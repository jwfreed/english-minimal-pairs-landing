import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const sitemapPath = path.join(root, 'public', 'sitemap.xml');

const routeModule = await import(pathToFileURL(path.join(root, 'src', 'localized-homepage-routes.js')).href);
const i18nModule = await import(pathToFileURL(path.join(root, 'src', 'i18n.js')).href);
const runtimeCopyModule = await import(pathToFileURL(path.join(root, 'src', 'landing-copy-runtime.js')).href);

const {
  HOMEPAGE_HREFLANG_ROUTES,
  LOCALIZED_HOMEPAGE_ROUTES,
  getHomepageUrl,
} = routeModule;
const { translations } = i18nModule;
const { getRuntimeLocaleMeta } = runtimeCopyModule;

const issues = [];

function readIfExists(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getExpectedSeo(runtimeLocale) {
  const t = translations[runtimeLocale] || translations.en;
  return {
    title: `${t.heroTitle} | Soundwise`,
    description: t.heroSubtitle,
  };
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

function validateHomepageHtml(
  source,
  route,
  filePath,
  { expectInitialLocale = true, expectLocalizedSeo = true } = {}
) {
  const { htmlLang } = getRuntimeLocaleMeta(route.runtimeLocale);
  const expectedSeo = getExpectedSeo(route.runtimeLocale);
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
  const generatedPath = path.join(root, route.slug, 'index.html');
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
  status: 'ok',
}, null, 2));
