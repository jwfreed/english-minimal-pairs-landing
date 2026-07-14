import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  HREFLANG_BY_LOCALE,
  LOCALIZED_HOMEPAGE_ROUTES,
  SITE_ORIGIN,
} from '../src/localized-homepage-routes.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const sitemapPath = path.join(distDir, 'sitemap.xml');
const checkRemote = process.argv.includes('--remote');
const includeInventory = process.argv.includes('--inventory');
const localeSlugs = new Set(LOCALIZED_HOMEPAGE_ROUTES.map((route) => route.slug));
const supportedHreflangs = new Set([...Object.values(HREFLANG_BY_LOCALE), 'x-default']);

function walkHtml(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walkHtml(entryPath);
    return entry.name.endsWith('.html') ? [entryPath] : [];
  });
}

function routeFromFile(filePath) {
  const relative = path.relative(distDir, filePath).split(path.sep).join('/');
  if (relative === 'index.html') return '/';
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -'index.html'.length)}`;
  return `/${relative}`;
}

function parseAttributes(source) {
  const attributes = {};
  for (const match of source.matchAll(/([:@\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) {
    attributes[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? '';
  }
  return attributes;
}

function linkElements(html) {
  return [...html.matchAll(/<link\b([^>]*)>/gi)].map((match) => parseAttributes(match[1]));
}

function metaElements(html) {
  return [...html.matchAll(/<meta\b([^>]*)>/gi)].map((match) => parseAttributes(match[1]));
}

function relIncludes(attributes, value) {
  return (attributes.rel || '').toLowerCase().split(/\s+/).includes(value);
}

function absoluteUrl(value) {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function routeFromUrl(value) {
  const url = absoluteUrl(value);
  return url?.origin === SITE_ORIGIN ? decodeURI(url.pathname) : null;
}

function sitemapRoutes(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => {
    const url = absoluteUrl(match[1]);
    return { url: match[1], route: url?.pathname || null };
  });
}

function localeForRoute(route) {
  const first = route.split('/').filter(Boolean)[0];
  return localeSlugs.has(first) ? first : 'en';
}

function contentKey(route) {
  const segments = route.split('/').filter(Boolean);
  if (localeSlugs.has(segments[0])) segments.shift();
  return `/${segments.join('/')}${segments.length ? '/' : ''}`;
}

function canonicalRouteStyle(route) {
  if (route === '/') return true;
  return path.posix.extname(route) ? !route.endsWith('/') : route.endsWith('/');
}

function clusterSignature(page) {
  return JSON.stringify(
    [...page.alternates]
      .map((alternate) => [alternate.hreflang, alternate.href])
      .sort(([left], [right]) => left.localeCompare(right)),
  );
}

async function mapWithConcurrency(values, concurrency, worker) {
  const results = new Array(values.length);
  let cursor = 0;

  async function run() {
    while (cursor < values.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(values[index]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, run));
  return results;
}

async function getRemoteStatuses(urls) {
  return mapWithConcurrency(urls, 8, async (url) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        redirect: 'manual',
        signal: AbortSignal.timeout(15000),
      });
      return {
        url,
        status: response.status,
        location: response.headers.get('location'),
      };
    } catch (error) {
      return { url, status: null, error: error.message };
    }
  });
}

if (!fs.existsSync(distDir)) {
  throw new Error('dist/ does not exist. Run npm run build before validating SEO architecture.');
}

const sitemapEntries = sitemapRoutes(fs.readFileSync(sitemapPath, 'utf8'));
const sitemapRouteList = sitemapEntries.map((entry) => entry.route);
const sitemapSet = new Set(sitemapRouteList);
const pages = new Map(walkHtml(distDir).map((filePath) => {
  const html = fs.readFileSync(filePath, 'utf8');
  const route = routeFromFile(filePath);
  const links = linkElements(html);
  const metas = metaElements(html);
  const canonicals = links.filter((link) => relIncludes(link, 'canonical')).map((link) => link.href);
  const alternates = links
    .filter((link) => relIncludes(link, 'alternate') && link.hreflang)
    .map((link) => ({ hreflang: link.hreflang, href: link.href }));
  const robots = metas
    .filter((meta) => meta.name?.toLowerCase() === 'robots')
    .flatMap((meta) => (meta.content || '').toLowerCase().split(/[\s,]+/));
  const isRedirect = metas.some((meta) => meta['http-equiv']?.toLowerCase() === 'refresh');
  const isIndexable = !robots.includes('noindex') && !isRedirect;
  const title = (html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '').replace(/\s+/g, ' ').trim();

  return [route, {
    route,
    filePath,
    title,
    canonicals,
    canonical: canonicals[0] || null,
    alternates,
    robots,
    isRedirect,
    isIndexable,
  }];
}));

const errors = [];
const duplicateSitemapRoutes = sitemapRouteList.filter((route, index) => (
  sitemapRouteList.indexOf(route) !== index
));

for (const entry of sitemapEntries) {
  const url = absoluteUrl(entry.url);
  if (!url || url.origin !== SITE_ORIGIN || url.protocol !== 'https:') {
    errors.push(`Sitemap URL must use ${SITE_ORIGIN}: ${entry.url}`);
  }
}
for (const route of new Set(duplicateSitemapRoutes)) {
  errors.push(`Duplicate sitemap URL: ${route}`);
}

for (const page of pages.values()) {
  if (page.isIndexable && page.canonicals.length !== 1) {
    errors.push(`${page.route} has ${page.canonicals.length} canonical tags; expected exactly one`);
  }

  for (const canonical of page.canonicals) {
    const canonicalUrl = absoluteUrl(canonical);
    const targetRoute = routeFromUrl(canonical);
    if (!canonicalUrl || canonicalUrl.protocol !== 'https:' || canonicalUrl.origin !== SITE_ORIGIN) {
      errors.push(`${page.route} canonical must use ${SITE_ORIGIN}: ${canonical}`);
      continue;
    }
    if (canonicalUrl.search || canonicalUrl.hash || !canonicalRouteStyle(canonicalUrl.pathname)) {
      errors.push(`${page.route} canonical has a noncanonical path form: ${canonical}`);
    }
    const target = pages.get(targetRoute);
    if (!target) {
      errors.push(`${page.route} canonical target is missing from dist: ${canonical}`);
    } else if (!target.isIndexable) {
      errors.push(`${page.route} canonical target is not indexable: ${canonical}`);
    } else if (target.canonical !== canonical) {
      errors.push(`${page.route} canonical chain or loop through ${canonical}`);
    }
  }

  if (page.isIndexable && page.canonical !== `${SITE_ORIGIN}${page.route}`) {
    errors.push(`${page.route} is indexable but not self-canonical: ${page.canonical || 'missing'}`);
  }
}

// Hub title brand policy: localized hubs stay keyword/benefit focused; the
// "| Soundwise" suffix needs search evidence plus localization review first
// (docs/seo-page-creation-guide.md, "Hub title policy").
const hubContentKeys = new Set(['/english-ear-training/', '/minimal-pairs-practice/']);
for (const page of pages.values()) {
  if (localeForRoute(page.route) === 'en' || !hubContentKeys.has(contentKey(page.route))) continue;
  if (/\|\s*Soundwise\s*$/.test(page.title)) {
    errors.push(`${page.route} localized hub title must not default to the "| Soundwise" brand suffix (see docs/seo-page-creation-guide.md "Hub title policy"): ${page.title}`);
  }
}

for (const route of sitemapSet) {
  const page = pages.get(route);
  if (!page) {
    errors.push(`Sitemap route is missing from dist: ${route}`);
  } else if (!page.isIndexable) {
    errors.push(`Sitemap route is not indexable: ${route}`);
  } else if (page.canonical !== `${SITE_ORIGIN}${route}`) {
    errors.push(`Sitemap route is not self-canonical: ${route}`);
  }
}

const hreflangPages = [...pages.values()].filter((page) => page.alternates.length > 0);
for (const page of hreflangPages) {
  const seenCodes = new Set();
  const expectedSelfCode = HREFLANG_BY_LOCALE[localeForRoute(page.route)];
  const xDefaultAlternates = page.alternates.filter((alternate) => alternate.hreflang === 'x-default');
  const selfAlternates = page.alternates.filter((alternate) => (
    alternate.hreflang !== 'x-default' && routeFromUrl(alternate.href) === page.route
  ));

  if (!page.isIndexable) errors.push(`${page.route} is non-indexable but emits hreflang`);
  if (selfAlternates.length !== 1 || selfAlternates[0]?.hreflang !== expectedSelfCode) {
    errors.push(`${page.route} must self-reference with hreflang ${expectedSelfCode}`);
  }
  if (contentKey(page.route) === '/') {
    if (xDefaultAlternates.length !== 1 || xDefaultAlternates[0]?.href !== `${SITE_ORIGIN}/`) {
      errors.push(`${page.route} homepage cluster must use ${SITE_ORIGIN}/ as its single x-default locale-selection fallback`);
    }
  } else if (xDefaultAlternates.length > 0) {
    errors.push(`${page.route} must omit x-default because it is not a locale-selection fallback page`);
  }

  for (const alternate of page.alternates) {
    if (seenCodes.has(alternate.hreflang)) {
      errors.push(`${page.route} declares duplicate hreflang ${alternate.hreflang}`);
    }
    seenCodes.add(alternate.hreflang);

    if (!supportedHreflangs.has(alternate.hreflang)) {
      errors.push(`${page.route} uses unsupported hreflang ${alternate.hreflang}`);
    }

    const alternateUrl = absoluteUrl(alternate.href);
    const alternateRoute = routeFromUrl(alternate.href);
    if (!alternateUrl || alternateUrl.protocol !== 'https:' || alternateUrl.origin !== SITE_ORIGIN) {
      errors.push(`${page.route} hreflang ${alternate.hreflang} must use ${SITE_ORIGIN}`);
      continue;
    }
    if (alternateUrl.search || alternateUrl.hash || !canonicalRouteStyle(alternateUrl.pathname)) {
      errors.push(`${page.route} hreflang ${alternate.hreflang} has a noncanonical URL form`);
    }

    const target = pages.get(alternateRoute);
    if (!target) {
      errors.push(`${page.route} hreflang ${alternate.hreflang} target is missing: ${alternate.href}`);
      continue;
    }
    if (!target.isIndexable) {
      errors.push(`${page.route} hreflang ${alternate.hreflang} target is not indexable`);
    }
    if (target.canonical !== alternate.href) {
      errors.push(
        `${page.route} hreflang ${alternate.hreflang} URL ${alternate.href} must exactly match target canonical ${target.canonical || 'missing'}`,
      );
    }
    if (!sitemapSet.has(alternateRoute)) {
      errors.push(`${page.route} hreflang ${alternate.hreflang} target is absent from sitemap`);
    }
    if (contentKey(alternateRoute) !== contentKey(page.route)) {
      errors.push(`${page.route} hreflang ${alternate.hreflang} crosses intent to ${alternateRoute}`);
    }
    if (alternate.hreflang !== 'x-default' && target.alternates.length === 0) {
      errors.push(`${page.route} hreflang ${alternate.hreflang} is not reciprocated by ${alternateRoute}`);
    }
  }
}

for (const page of hreflangPages) {
  const expectedSignature = clusterSignature(page);
  for (const alternate of page.alternates.filter((entry) => entry.hreflang !== 'x-default')) {
    const target = pages.get(routeFromUrl(alternate.href));
    if (target && clusterSignature(target) !== expectedSignature) {
      errors.push(`${page.route} and ${target.route} do not declare identical hreflang sets`);
    }
  }
}

const seoLocalizedWithoutHreflang = [...pages.values()]
  .filter((page) => (
    page.isIndexable
    && sitemapSet.has(page.route)
    && localeForRoute(page.route) !== 'en'
    && page.alternates.length === 0
  ))
  .map((page) => page.route);
for (const route of seoLocalizedWithoutHreflang) {
  errors.push(`Localized sitemap route has no hreflang cluster: ${route}`);
}

const clusterRoutes = [];
const visited = new Set();
for (const page of hreflangPages) {
  if (visited.has(page.route)) continue;
  const members = new Set(
    page.alternates
      .filter((alternate) => alternate.hreflang !== 'x-default')
      .map((alternate) => routeFromUrl(alternate.href))
      .filter(Boolean),
  );
  for (const route of members) visited.add(route);
  clusterRoutes.push([...members].sort());
}

let remoteStatuses = [];
if (checkRemote) {
  const canonicalTargets = [...new Set(
    [...pages.values()].flatMap((page) => page.canonicals),
  )].sort();
  remoteStatuses = await getRemoteStatuses(canonicalTargets);
  for (const result of remoteStatuses) {
    if (result.status !== 200) {
      errors.push(`Remote canonical target did not return 200: ${result.url} (${result.status ?? result.error})`);
    }
  }
}

const indexablePages = [...pages.values()].filter((page) => page.isIndexable);
const indexableNotInSitemap = indexablePages
  .filter((page) => !sitemapSet.has(page.route))
  .map((page) => page.route)
  .sort();
const localizedWithoutHreflang = indexablePages
  .filter((page) => localeForRoute(page.route) !== 'en' && page.alternates.length === 0)
  .map((page) => page.route)
  .sort();
const remoteStatusByUrl = new Map(remoteStatuses.map((result) => [result.url, result.status]));

const output = {
  htmlPageCount: pages.size,
  indexablePageCount: indexablePages.length,
  nonIndexablePageCount: pages.size - indexablePages.length,
  sitemapUrlCount: sitemapSet.size,
  selfCanonicalIndexableCount: indexablePages.filter((page) => (
    page.canonical === `${SITE_ORIGIN}${page.route}`
  )).length,
  indexableNotInSitemap,
  hreflangPageCount: hreflangPages.length,
  hreflangClusterCount: clusterRoutes.length,
  hreflangClusters: clusterRoutes.map((routes) => ({
    contentKey: contentKey(routes[0]),
    pageCount: routes.length,
    routes,
  })),
  hreflangCodes: [...new Set(hreflangPages.flatMap((page) => (
    page.alternates.map((alternate) => alternate.hreflang)
  )))].sort(),
  xDefaultPolicy: {
    homepageCluster: `${SITE_ORIGIN}/`,
    otherClusters: 'omitted',
  },
  localizedIndexableWithoutHreflang: localizedWithoutHreflang,
  remoteStatusCount: remoteStatuses.length,
  remoteNon200: remoteStatuses.filter((result) => result.status !== 200),
  ...(includeInventory ? {
    canonicalInventory: indexablePages
      .sort((left, right) => left.route.localeCompare(right.route))
      .map((page) => ({
        url: `${SITE_ORIGIN}${page.route}`,
        canonical: page.canonical,
        expectedStatus: 200,
        remoteStatus: checkRemote ? remoteStatusByUrl.get(page.canonical) ?? null : null,
        issue: page.canonical === `${SITE_ORIGIN}${page.route}` ? null : 'not self-canonical',
      })),
  } : {}),
  errorCount: errors.length,
  errors: [...new Set(errors)].sort(),
  status: errors.length === 0 ? 'ok' : 'failed',
};

if (errors.length > 0) {
  console.error(JSON.stringify(output, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(output, null, 2));
