import fs from 'node:fs';
import path from 'node:path';
import { LOCALIZED_HOMEPAGE_ROUTES, SITE_ORIGIN } from '../src/localized-homepage-routes.js';

const root = process.cwd();
const validateDist = process.argv.includes('--dist');
const localeSlugs = new Set(LOCALIZED_HOMEPAGE_ROUTES.map((route) => route.slug));
const issues = [];
const sitemapPath = path.join(root, 'public', 'sitemap.xml');
const sitemapSource = fs.readFileSync(sitemapPath, 'utf8');
const sitemapUrls = new Set(
  [...sitemapSource.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
);

function walkHtml(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return walkHtml(entryPath);
    }
    return entry.name.endsWith('.html') ? [entryPath] : [];
  });
}

function sourceHtmlFiles() {
  return [
    path.join(root, 'index.html'),
    path.join(root, 'support.html'),
    ...walkHtml(path.join(root, 'content')),
    ...walkHtml(path.join(root, 'legal')),
    ...walkHtml(path.join(root, 'public')).filter((filePath) => path.basename(filePath) === '404.html'),
  ];
}

function parseAttributes(source) {
  return Object.fromEntries(
    [...source.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/gs)]
      .map((match) => [match[1].toLowerCase(), match[3]])
  );
}

function getCanonical(source) {
  for (const match of source.matchAll(/<link\b([^>]*)>/gi)) {
    const attributes = parseAttributes(match[1]);
    if (attributes.rel === 'canonical') {
      return attributes.href || '';
    }
  }
  return '';
}

function stripTags(source) {
  return source
    .replace(/<[^>]*>/g, ' ')
    .replaceAll('&nbsp;', ' ')
    .replaceAll('&amp;', '&')
    .replaceAll('&#39;', "'")
    .replaceAll('&quot;', '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractJsonLd(source, fileLabel) {
  const blocks = [];
  for (const match of source.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      blocks.push(JSON.parse(match[1]));
    } catch (error) {
      issues.push(`${fileLabel}: invalid JSON-LD (${error.message})`);
    }
  }
  return blocks.flatMap((block) => Array.isArray(block?.['@graph']) ? block['@graph'] : [block]);
}

function extractVisibleBreadcrumbs(source, canonical, fileLabel) {
  const navs = [];
  for (const match of source.matchAll(/<nav\b([^>]*)>([\s\S]*?)<\/nav>/gi)) {
    const attributes = parseAttributes(match[1]);
    if (!(attributes.class || '').split(/\s+/).includes('seo-breadcrumb')) {
      continue;
    }

    const items = [];
    for (const itemMatch of match[2].matchAll(/<(a|span)\b([^>]*)>([\s\S]*?)<\/\1>/gi)) {
      const itemAttributes = parseAttributes(itemMatch[2]);
      if (itemAttributes['aria-hidden'] === 'true') {
        continue;
      }
      const name = stripTags(itemMatch[3]);
      if (!name || name === '/') {
        continue;
      }
      const item = itemMatch[1].toLowerCase() === 'a'
        ? new URL(itemAttributes.href || '', canonical).href
        : canonical;
      items.push({ name, item });
    }
    navs.push(items);
  }

  if (navs.length > 1) {
    issues.push(`${fileLabel}: expected at most one visible breadcrumb, found ${navs.length}`);
  }
  return navs;
}

function classify(canonical) {
  const segments = new URL(canonical).pathname.split('/').filter(Boolean);
  if (segments.length === 0 || (segments.length === 1 && localeSlugs.has(segments[0]))) {
    return 'homepage';
  }

  const localized = localeSlugs.has(segments[0]);
  const slug = localized ? segments[1] : segments[0];
  if (['english-ear-training', 'minimal-pairs-practice'].includes(slug) && segments.length === (localized ? 2 : 1)) {
    return localized ? 'localized hub' : 'English hub';
  }
  if (slug?.includes('-vs-') && segments.length === (localized ? 2 : 1)) {
    return localized ? 'localized pair' : 'English pair';
  }
  return 'utility/legal';
}

function expectedHierarchy(canonical, pageClass) {
  const url = new URL(canonical);
  const segments = url.pathname.split('/').filter(Boolean);
  const locale = localeSlugs.has(segments[0]) ? segments[0] : '';
  const home = `${SITE_ORIGIN}/${locale ? `${locale}/` : ''}`;

  if (pageClass.endsWith('hub')) {
    return [home, canonical];
  }
  if (pageClass.endsWith('pair')) {
    return [home, `${home}minimal-pairs-practice/`, canonical];
  }
  return [];
}

function isIndexable(source) {
  const robots = [...source.matchAll(/<meta\b([^>]*)>/gi)]
    .map((match) => parseAttributes(match[1]))
    .find((attributes) => attributes.name?.toLowerCase() === 'robots')?.content || '';
  return !/\bnoindex\b/i.test(robots) && !/<meta\b[^>]*http-equiv=["']refresh["']/i.test(source);
}

const baseDirectory = validateDist ? path.join(root, 'dist') : root;
const files = validateDist ? walkHtml(baseDirectory) : sourceHtmlFiles();
if (validateDist && !fs.existsSync(baseDirectory)) {
  console.error('dist does not exist; run npm run build first');
  process.exit(1);
}

const pages = files.map((filePath) => {
  const source = fs.readFileSync(filePath, 'utf8');
  const fileLabel = path.relative(root, filePath);
  const canonical = getCanonical(source);
  if (!canonical) {
    if (isIndexable(source)) {
      issues.push(`${fileLabel}: indexable HTML has no canonical URL`);
    }
    return { filePath, fileLabel, source, canonical: '', indexable: false, pageClass: 'utility/legal', breadcrumbs: [], visible: [] };
  }

  let canonicalUrl;
  try {
    canonicalUrl = new URL(canonical);
  } catch {
    issues.push(`${fileLabel}: canonical is not an absolute URL: ${canonical}`);
  }
  if (canonicalUrl && (canonicalUrl.protocol !== 'https:' || canonicalUrl.origin !== SITE_ORIGIN)) {
    issues.push(`${fileLabel}: canonical must use ${SITE_ORIGIN}: ${canonical}`);
  }

  const blocks = extractJsonLd(source, fileLabel);
  const breadcrumbs = blocks.filter((block) => block?.['@type'] === 'BreadcrumbList');
  const visible = extractVisibleBreadcrumbs(source, canonical, fileLabel);
  return {
    filePath,
    fileLabel,
    source,
    canonical,
    indexable: isIndexable(source),
    pageClass: canonicalUrl ? classify(canonical) : 'utility/legal',
    breadcrumbs,
    visible,
  };
});

const canonicalPages = new Map();
for (const page of pages.filter((candidate) => candidate.indexable && candidate.canonical)) {
  if (!canonicalPages.has(page.canonical)) {
    canonicalPages.set(page.canonical, page);
  }
}

for (const sitemapUrl of sitemapUrls) {
  if (!canonicalPages.has(sitemapUrl)) {
    issues.push(`public/sitemap.xml: URL has no live, indexable canonical HTML route: ${sitemapUrl}`);
  }
}

const hubLabels = new Map();
for (const page of pages.filter((candidate) => candidate.pageClass.endsWith('hub'))) {
  const finalItem = page.breadcrumbs[0]?.itemListElement?.at(-1);
  if (finalItem?.name) {
    hubLabels.set(page.canonical, stripTags(String(finalItem.name)));
  }
}

const counts = {};
for (const page of pages) {
  counts[page.pageClass] = (counts[page.pageClass] || 0) + 1;
  if (page.breadcrumbs.length > 1) {
    issues.push(`${page.fileLabel}: expected at most one BreadcrumbList, found ${page.breadcrumbs.length}`);
  }

  const requiresBreadcrumb = page.indexable && (page.pageClass.endsWith('hub') || page.pageClass.endsWith('pair'));
  const expectedCount = requiresBreadcrumb ? 1 : 0;
  if (page.breadcrumbs.length !== expectedCount) {
    issues.push(`${page.fileLabel}: ${page.pageClass} must contain ${expectedCount} BreadcrumbList, found ${page.breadcrumbs.length}`);
  }
  if (page.visible.length !== expectedCount) {
    issues.push(`${page.fileLabel}: ${page.pageClass} must contain ${expectedCount} visible breadcrumb, found ${page.visible.length}`);
  }
  if (!requiresBreadcrumb || page.breadcrumbs.length !== 1) {
    continue;
  }
  if (!sitemapUrls.has(page.canonical)) {
    issues.push(`${page.fileLabel}: breadcrumb page is missing from public/sitemap.xml: ${page.canonical}`);
  }

  const items = page.breadcrumbs[0].itemListElement;
  if (!Array.isArray(items) || items.length < 2) {
    issues.push(`${page.fileLabel}: BreadcrumbList must contain at least two ListItems`);
    continue;
  }

  const expectedUrls = expectedHierarchy(page.canonical, page.pageClass);
  const actualUrls = [];
  const normalizedItems = [];
  const positions = new Set();
  for (const [index, item] of items.entries()) {
    if (item?.['@type'] !== 'ListItem') {
      issues.push(`${page.fileLabel}: breadcrumb item ${index + 1} must have @type ListItem`);
    }
    if (item?.position !== index + 1 || positions.has(item?.position)) {
      issues.push(`${page.fileLabel}: breadcrumb positions must be unique and sequential from 1`);
    }
    positions.add(item?.position);

    const name = stripTags(String(item?.name || ''));
    if (!name || /\{\{|\}\}|^[\w-]+\.[\w.-]+$/.test(name)) {
      issues.push(`${page.fileLabel}: breadcrumb item ${index + 1} has an empty or placeholder label`);
    }

    let itemUrl;
    try {
      itemUrl = new URL(item?.item || '');
      if (itemUrl.protocol !== 'https:' || itemUrl.origin !== SITE_ORIGIN) {
        issues.push(`${page.fileLabel}: breadcrumb URL must use ${SITE_ORIGIN}: ${item?.item || '(missing)'}`);
      }
    } catch {
      issues.push(`${page.fileLabel}: breadcrumb item ${index + 1} must have an absolute HTTPS item URL`);
    }
    const itemHref = itemUrl?.href || String(item?.item || '');
    actualUrls.push(itemHref);
    normalizedItems.push({ name, item: itemHref });

    const target = canonicalPages.get(itemHref);
    if (!target) {
      issues.push(`${page.fileLabel}: breadcrumb URL is not a live, indexable canonical route: ${itemHref}`);
    }
  }

  if (JSON.stringify(actualUrls) !== JSON.stringify(expectedUrls)) {
    issues.push(`${page.fileLabel}: expected hierarchy ${JSON.stringify(expectedUrls)}, found ${JSON.stringify(actualUrls)}`);
  }
  if (JSON.stringify(page.visible[0]) !== JSON.stringify(normalizedItems)) {
    issues.push(`${page.fileLabel}: visible breadcrumb does not match BreadcrumbList names and URLs`);
  }
  if (normalizedItems[0]?.name !== 'Soundwise') {
    issues.push(`${page.fileLabel}: first breadcrumb label must be Soundwise`);
  }
  if (page.pageClass.endsWith('pair')) {
    const expectedHubLabel = hubLabels.get(expectedUrls[1]);
    if (!expectedHubLabel || normalizedItems[1]?.name !== expectedHubLabel) {
      issues.push(`${page.fileLabel}: hub label must match the target hub (${expectedHubLabel || 'missing hub'})`);
    }
    const slug = new URL(page.canonical).pathname.split('/').filter(Boolean).at(-1);
    const topicWords = slug.split('-').filter((word) => word !== 'vs');
    const finalLabel = normalizedItems.at(-1)?.name.toLowerCase() || '';
    if (!topicWords.every((word) => finalLabel.includes(word))) {
      issues.push(`${page.fileLabel}: final breadcrumb label does not naturally identify ${slug}`);
    }
  }
}

if (issues.length > 0) {
  console.error(JSON.stringify({ mode: validateDist ? 'dist' : 'source', issues }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  mode: validateDist ? 'dist' : 'source',
  htmlFileCount: pages.length,
  sitemapUrlCount: sitemapUrls.size,
  breadcrumbPageCount: pages.filter((page) => page.breadcrumbs.length === 1).length,
  pageClasses: counts,
  status: 'ok',
}, null, 2));
