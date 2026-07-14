import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const sourcePath = path.join(root, 'index.html');
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
const { translations } = i18nModule;
const { getRuntimeLocaleMeta } = runtimeCopyModule;
const { getLocalizedSeoMetadata } = seoModule;

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll('"', '&quot;');
}

function buildHreflangCluster() {
  const links = HOMEPAGE_HREFLANG_ROUTES.map((route) => (
    `    <link rel="alternate" hreflang="${route.hreflang}" href="${getHomepageUrl(route.slug)}" />`
  ));

  links.push('    <link rel="alternate" hreflang="x-default" href="https://getsoundwise.co/" />');
  return links.join('\n');
}

function replaceRequired(source, pattern, replacement, label) {
  if (!pattern.test(source)) {
    throw new Error(`Could not replace ${label} in ${sourcePath}`);
  }

  return source.replace(pattern, replacement);
}

function replaceOptional(source, pattern, replacement) {
  return source.replace(pattern, replacement);
}

function stripUnavailableOptionalSections(source, runtimeLocale) {
  const t = translations[runtimeLocale] || translations.en;

  return source.replace(
    /\n\s*<!-- English-only testimonial; localized pages omit this until approved translations exist\. -->\s*<section\b(?=[^>]*\bdata-localized-optional-key="([^"]+)")[\s\S]*?<\/section>\n?/g,
    (match, translationKey) => (String(t[translationKey] || '').trim() ? match : '\n')
  );
}

function localizeAvailableLearningLinks(source, locale) {
  let html = source.replace(/href="\/([^"/]+)\/"/g, (match, slug) => {
    const localizedSource = path.join(localizedContentDir, locale, slug, 'index.html');
    return fs.existsSync(localizedSource) ? `href="/${locale}/${slug}/"` : match;
  });

  html = html.replaceAll('href="/privacy/"', `href="/privacy-${locale}.html"`);
  html = html.replaceAll('href="/terms/"', `href="/terms-${locale}.html"`);
  return html;
}

function buildLocalizedHtml(template, route) {
  const { htmlLang } = getRuntimeLocaleMeta(route.runtimeLocale);
  const canonicalUrl = getHomepageUrl(route.slug);
  const seo = getLocalizedSeoMetadata(route.runtimeLocale);
  const title = escapeHtml(seo.title);
  const description = escapeAttribute(seo.description);
  const escapedCanonicalUrl = escapeAttribute(canonicalUrl);
  const escapedRuntimeLocale = escapeAttribute(route.runtimeLocale);

  let html = template;
  html = stripUnavailableOptionalSections(html, route.runtimeLocale);
  html = localizeAvailableLearningLinks(html, route.slug);
  html = replaceRequired(html, /<html lang="[^"]*">/, `<html lang="${escapeAttribute(htmlLang)}">`, 'html lang');
  html = replaceRequired(html, /<body(.*?)>/, `<body$1 data-initial-runtime-locale="${escapedRuntimeLocale}">`, 'initial locale marker');
  html = replaceRequired(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${escapedCanonicalUrl}" />`, 'canonical');
  html = replaceOptional(
    html,
    /(?:\s*<link rel="alternate" hreflang="[^"]+" href="[^"]+" \/>\n)+/,
    '\n'
  );
  html = replaceRequired(
    html,
    /(<link rel="canonical" href="[^"]*" \/>\n)/,
    `$1${buildHreflangCluster()}\n`,
    'hreflang cluster'
  );
  html = replaceRequired(html, /<meta name="description" content="[^"]*">/, `<meta name="description" content="${description}">`, 'description');
  html = replaceRequired(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escapeAttribute(seo.title)}" />`, 'og:title');
  html = replaceRequired(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${description}" />`, 'og:description');
  html = replaceRequired(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${escapedCanonicalUrl}" />`, 'og:url');
  html = replaceRequired(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${escapeAttribute(seo.title)}" />`, 'twitter:title');
  html = replaceRequired(html, /<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${description}" />`, 'twitter:description');
  html = replaceRequired(html, /<title>.*?<\/title>/, `<title>${title}</title>`, 'title');

  return html;
}

function main() {
  const template = fs.readFileSync(sourcePath, 'utf8');

  for (const route of LOCALIZED_HOMEPAGE_ROUTES) {
    const outputPath = path.join(localizedContentDir, route.slug, 'index.html');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, buildLocalizedHtml(template, route));
  }

  console.log(JSON.stringify({
    generated: LOCALIZED_HOMEPAGE_ROUTES.map((route) => `/${route.slug}/`),
  }, null, 2));
}

main();
