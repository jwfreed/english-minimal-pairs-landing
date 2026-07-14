import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const sitemapPath = path.join(root, 'public', 'sitemap.xml');
const localizedContentDir = path.join(root, 'content', 'locales');

const routeModule = await import(pathToFileURL(path.join(root, 'src', 'localized-homepage-routes.js')).href);
const i18nModule = await import(pathToFileURL(path.join(root, 'src', 'i18n.js')).href);
const runtimeCopyModule = await import(pathToFileURL(path.join(root, 'src', 'landing-copy-runtime.js')).href);
const seoModule = await import(pathToFileURL(path.join(root, 'src', 'localized-homepage-seo.js')).href);

const {
  HOMEPAGE_HREFLANG_ROUTES,
  LOCALIZED_HOMEPAGE_ROUTES,
  getHomepageUrl,
} = routeModule;
const { formatTranslationHtml, translations } = i18nModule;
const { getRuntimeLocaleMeta } = runtimeCopyModule;
const { getLocalizedSeoMetadata } = seoModule;

const issues = [];
let homepageTranslationElements = [];

function readIfExists(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function expectContains(source, expected, label) {
  if (!source.includes(expected)) {
    issues.push(`${label}: missing ${expected}`);
  }
}

function expectMetaContent(source, selectorPattern, expected, label) {
  const pattern = new RegExp(`${selectorPattern}[^>]+content="${escapeRegex(expected)}"|content="${escapeRegex(expected)}"[^>]+${selectorPattern}`);
  if (!pattern.test(source)) {
    issues.push(`${label}: missing metadata content ${expected}`);
  }
}

function extractTranslationElements(source) {
  const byKey = new Map();

  for (const match of source.matchAll(
    /<([a-z][a-z0-9-]*)\b([^>]*\bdata-i18n="([^"]+)"[^>]*)>/gi
  )) {
    const [, tagName, attributes, translationKey] = match;
    byKey.set(translationKey, {
      tagName,
      translationKey,
      formatPhonemes: /\bseo-pairs-group-heading\b/.test(attributes),
    });
  }

  return [...byKey.values()];
}

function validateStaticLocalizedContent(source, route, label) {
  const t = translations[route.runtimeLocale] || translations.en;
  const { isRtl } = getRuntimeLocaleMeta(route.runtimeLocale);

  for (const element of homepageTranslationElements) {
    const translation = t[element.translationKey];
    if (translation === undefined) {
      issues.push(`${label}: missing runtime translation ${element.translationKey}`);
      continue;
    }
    if (String(translation).trim() === '') {
      continue;
    }

    const expectedHtml = formatTranslationHtml(translation, {
      formatPhonemes: element.formatPhonemes,
    });
    const localizedElementPattern = new RegExp(
      `<${element.tagName}[^>]*data-i18n="${escapeRegex(element.translationKey)}"[^>]*>`
      + `${escapeRegex(expectedHtml)}</${element.tagName}>`,
      'i'
    );
    if (!localizedElementPattern.test(source)) {
      issues.push(`${label}: ${element.translationKey} does not contain its static localized HTML`);
    }

    if (isRtl) {
      const rtlPattern = new RegExp(
        `<${element.tagName}[^>]*data-i18n="${escapeRegex(element.translationKey)}"`
        + '[^>]*dir="auto"[^>]*style="unicode-bidi: plaintext;"[^>]*>',
        'i'
      );
      if (!rtlPattern.test(source)) {
        issues.push(`${label}: ${element.translationKey} is missing static RTL safeguards`);
      }
    }
  }

  const languageLabelPattern = new RegExp(
    `<button id="language-selector"[^>]*>\\s*${escapeRegex(`${t.flag} ${t.name}`)}\\s*</button>`,
    'i'
  );
  if (!languageLabelPattern.test(source)) {
    issues.push(`${label}: language selector does not show the static locale label`);
  }
}

function validateHomepageHtml(
  source,
  route,
  filePath,
  { expectInitialLocale = true, expectLocalizedSeo = true } = {}
) {
  const { htmlLang } = getRuntimeLocaleMeta(route.runtimeLocale);
  const expectedSeo = getLocalizedSeoMetadata(route.runtimeLocale);
  const canonicalUrl = getHomepageUrl(route.slug);
  const label = path.relative(root, filePath);

  expectContains(source, `<html lang="${htmlLang}"`, label);
  if (expectInitialLocale) {
    expectContains(source, `<body data-initial-runtime-locale="${route.runtimeLocale}">`, label);
  } else if (source.includes('data-initial-runtime-locale=')) {
    issues.push(`${label}: root homepage must not force an initial runtime locale`);
  }
  expectContains(source, `<link rel="canonical" href="${canonicalUrl}" />`, label);
  if (expectLocalizedSeo) {
    expectContains(source, `<title>${expectedSeo.title}</title>`, label);
    expectMetaContent(source, 'name="description"', expectedSeo.description, label);
    expectMetaContent(source, 'property="og:title"', expectedSeo.title, label);
    expectMetaContent(source, 'property="og:description"', expectedSeo.description, label);
    expectMetaContent(source, 'name="twitter:title"', expectedSeo.title, label);
    expectMetaContent(source, 'name="twitter:description"', expectedSeo.description, label);
  }
  if (expectInitialLocale) {
    validateStaticLocalizedContent(source, route, label);
  }
  expectMetaContent(source, 'property="og:url"', canonicalUrl, label);

  for (const hreflangRoute of HOMEPAGE_HREFLANG_ROUTES) {
    expectContains(
      source,
      `<link rel="alternate" hreflang="${hreflangRoute.hreflang}" href="${getHomepageUrl(hreflangRoute.slug)}" />`,
      label
    );
  }
  expectContains(source, '<link rel="alternate" hreflang="x-default" href="https://getsoundwise.co/" />', label);
}

const rootRoute = { slug: '', runtimeLocale: 'en' };
const rootSource = readIfExists(path.join(root, 'index.html'));
if (!rootSource) {
  issues.push('index.html: file does not exist');
} else {
  homepageTranslationElements = extractTranslationElements(rootSource);
  validateHomepageHtml(rootSource, rootRoute, path.join(root, 'index.html'), {
    expectInitialLocale: false,
    expectLocalizedSeo: false,
  });
}

const builtRootSource = readIfExists(path.join(distDir, 'index.html'));
if (builtRootSource) {
  validateHomepageHtml(builtRootSource, rootRoute, path.join(distDir, 'index.html'), {
    expectInitialLocale: false,
    expectLocalizedSeo: false,
  });
}

for (const route of LOCALIZED_HOMEPAGE_ROUTES) {
  const generatedPath = path.join(localizedContentDir, route.slug, 'index.html');
  const generatedSource = readIfExists(generatedPath);
  if (!generatedSource) {
    issues.push(`${path.relative(root, generatedPath)}: file does not exist`);
  } else {
    validateHomepageHtml(generatedSource, route, generatedPath);
  }

  const builtPath = path.join(distDir, route.slug, 'index.html');
  const builtSource = readIfExists(builtPath);
  if (!builtSource) {
    issues.push(`${path.relative(root, builtPath)}: file does not exist`);
  } else {
    validateHomepageHtml(builtSource, route, builtPath);
  }
}

const sitemapSource = readIfExists(sitemapPath);
if (!sitemapSource) {
  issues.push('public/sitemap.xml: file does not exist');
} else {
  for (const route of HOMEPAGE_HREFLANG_ROUTES) {
    expectContains(sitemapSource, `<loc>${getHomepageUrl(route.slug)}</loc>`, 'public/sitemap.xml');
  }
}

if (issues.length > 0) {
  console.error(JSON.stringify({ issues }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  localizedHomepageRoutes: LOCALIZED_HOMEPAGE_ROUTES.map((route) => `/${route.slug}/`),
  staticLocalizedKeyCount: homepageTranslationElements.length,
  status: 'ok',
}, null, 2));
