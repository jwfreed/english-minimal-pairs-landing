import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LOCALIZED_HOMEPAGE_ROUTES } from '../src/localized-homepage-routes.js';

const SITE_ORIGIN = 'https://getsoundwise.co';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const sitemapPath = path.join(root, 'public', 'sitemap.xml');
const localeSlugs = new Set(LOCALIZED_HOMEPAGE_ROUTES.map((route) => route.slug));

function walkHtml(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory()
      ? walkHtml(entryPath)
      : entry.name.endsWith('.html') ? [entryPath] : [];
  });
}

function routeFromFile(filePath) {
  const relative = path.relative(distDir, filePath).split(path.sep).join('/');
  if (relative === 'index.html') return '/';
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -'index.html'.length)}`;
  return `/${relative}`;
}

function normalizeRoute(href, sourceRoute) {
  if (!href || href.startsWith('#') || /^(?:mailto|tel|javascript|data):/i.test(href)) {
    return null;
  }

  let url;
  try {
    url = new URL(href, `${SITE_ORIGIN}${sourceRoute}`);
  } catch {
    return null;
  }

  if (url.origin !== SITE_ORIGIN) return null;
  let pathname = decodeURI(url.pathname);
  if (!path.extname(pathname) && !pathname.endsWith('/')) pathname += '/';
  return pathname;
}

function parseAttributes(source) {
  const attributes = {};
  for (const match of source.matchAll(/([:@\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) {
    attributes[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? '';
  }
  return attributes;
}

function elementRange(html, tagName, openingTagPattern) {
  const openingTag = openingTagPattern.exec(html);
  if (!openingTag) return null;
  const end = html.indexOf(`</${tagName}>`, openingTag.index);
  return end === -1 ? null : [openingTag.index, end + tagName.length + 3];
}

function isWithin(index, range) {
  return range && index >= range[0] && index < range[1];
}

function extractAnchors(html, sourceRoute) {
  const headerRange = elementRange(html, 'nav', /<nav\b(?=[^>]*class=["'][^"']*\bnav\b[^"']*["'])[^>]*>/i);
  const footerRange = elementRange(html, 'footer', /<footer\b[^>]*>/i);
  const languageSwitchRange = elementRange(html, 'div', /<div\b(?=[^>]*class=["'][^"']*\blang-switch\b[^"']*["'])[^>]*>/i);

  return [...html.matchAll(/<a\b([^>]*)>/gi)].flatMap((match) => {
    const attributes = parseAttributes(match[1]);
    const target = normalizeRoute(attributes.href, sourceRoute);
    if (!target) return [];

    const classes = new Set((attributes.class || '').split(/\s+/).filter(Boolean));
    const region = classes.has('lang-option') || isWithin(match.index, languageSwitchRange)
      ? 'language selector'
      : isWithin(match.index, footerRange)
        ? 'footer'
        : isWithin(match.index, headerRange)
          ? 'shared header'
          : 'contextual';

    let rawPathname = null;
    try {
      rawPathname = decodeURI(new URL(attributes.href, `${SITE_ORIGIN}${sourceRoute}`).pathname);
    } catch {
      // normalizeRoute already rejected malformed internal URLs.
    }

    return [{ href: attributes.href, target, rawPathname, region }];
  });
}

function extractCanonical(html) {
  const match = html.match(/<link\b(?=[^>]*\brel\s*=\s*["']canonical["'])[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/i)
    || html.match(/<link\b(?=[^>]*\bhref\s*=\s*["']([^"']+)["'])[^>]*\brel\s*=\s*["']canonical["'][^>]*>/i);
  return match ? normalizeRoute(match[1], '/') : null;
}

function extractAlternates(html) {
  return [...html.matchAll(/<link\b([^>]*)>/gi)].flatMap((match) => {
    const attributes = parseAttributes(match[1]);
    if (attributes.rel !== 'alternate' || !attributes.hreflang || !attributes.href) return [];
    return [{ hreflang: attributes.hreflang, href: attributes.href }];
  });
}

function hasMetaRefresh(html) {
  return /<meta\b(?=[^>]*http-equiv=["']refresh["'])[^>]*>/i.test(html);
}

function extractSitemapRoutes(xml) {
  return new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => {
    const url = new URL(match[1]);
    return url.pathname;
  }));
}

function pageClass(route, sitemapRoutes) {
  if (route === '/') return 'English homepage';
  const segments = route.split('/').filter(Boolean);
  if (segments.length === 1 && localeSlugs.has(segments[0])) return 'localized homepage';
  if (segments.length === 2 && localeSlugs.has(segments[0]) && ['minimal-pairs-practice', 'english-ear-training'].includes(segments[1])) {
    return 'localized hub';
  }
  if (segments.length === 2 && localeSlugs.has(segments[0]) && segments[1].includes('-vs-')) return 'localized pair';
  if (['/minimal-pairs-practice/', '/english-ear-training/'].includes(route)) return 'English hub';
  if (/^\/[^/]+-vs-[^/]+\/$/.test(route)) return 'English pair';
  return sitemapRoutes.has(route) ? 'indexable utility/legal' : 'non-indexable utility/legal';
}

function localeOf(route) {
  const firstSegment = route.split('/').filter(Boolean)[0];
  return localeSlugs.has(firstSegment) ? firstSegment : 'en';
}

if (!fs.existsSync(distDir)) {
  throw new Error('dist/ does not exist. Run npm run build before validating internal links.');
}

const sitemapRoutes = extractSitemapRoutes(fs.readFileSync(sitemapPath, 'utf8'));
const pages = new Map(walkHtml(distDir).map((filePath) => {
  const route = routeFromFile(filePath);
  const html = fs.readFileSync(filePath, 'utf8');
  const anchors = extractAnchors(html, route);
  const targets = anchors.map((anchor) => anchor.target);
  return [route, {
    route,
    filePath,
    html,
    canonical: extractCanonical(html),
    alternates: extractAlternates(html),
    isRedirect: hasMetaRefresh(html),
    anchors,
    targets,
    distinctTargets: new Set(targets),
    pageClass: pageClass(route, sitemapRoutes),
  }];
}));

const errors = [];
const warnings = [];
const inbound = new Map([...pages.keys()].map((route) => [route, new Set()]));
const contextualInbound = new Map([...pages.keys()].map((route) => [route, new Set()]));
const topicalContextualInbound = new Map([...pages.keys()].map((route) => [route, new Set()]));
const inboundByRegion = new Map([...pages.keys()].map((route) => [route, new Map()]));

for (const page of pages.values()) {
  for (const anchor of page.anchors) {
    const { target } = anchor;
    if (!pages.has(target)) {
      errors.push(`${page.route} links to missing route ${target}`);
      continue;
    }
    if (target !== page.route) {
      inbound.get(target).add(page.route);
      if (anchor.region === 'contextual') {
        contextualInbound.get(target).add(page.route);
        if (sitemapRoutes.has(page.route) && !page.pageClass.includes('utility/legal')) {
          topicalContextualInbound.get(target).add(page.route);
        }
      }
      if (!inboundByRegion.get(target).has(anchor.region)) {
        inboundByRegion.get(target).set(anchor.region, new Set());
      }
      inboundByRegion.get(target).get(anchor.region).add(page.route);
    }

    const targetPage = pages.get(target);
    if (targetPage.isRedirect) {
      errors.push(`${page.route} links to redirect route ${target}`);
    }
    if (targetPage.canonical && targetPage.canonical !== target) {
      errors.push(`${page.route} links to noncanonical route ${target} (canonical: ${targetPage.canonical})`);
    }
    if (targetPage.canonical && anchor.rawPathname !== targetPage.canonical) {
      errors.push(`${page.route} uses noncanonical path ${anchor.rawPathname} for ${targetPage.canonical}`);
    }
  }
}

for (const route of sitemapRoutes) {
  if (!pages.has(route)) errors.push(`Sitemap route is missing from dist: ${route}`);
}

const indexablePages = [...pages.values()].filter((page) => sitemapRoutes.has(page.route));
for (const page of indexablePages) {
  if (page.canonical !== page.route) {
    errors.push(`Sitemap route ${page.route} is not self-canonical (canonical: ${page.canonical || 'missing'})`);
  }
}

for (const page of indexablePages.filter((candidate) => candidate.alternates.length > 0)) {
  for (const alternate of page.alternates) {
    const alternateRoute = normalizeRoute(alternate.href, page.route);
    const alternatePage = pages.get(alternateRoute);
    if (!alternatePage) {
      errors.push(`${page.route} hreflang ${alternate.hreflang} points to missing route ${alternateRoute}`);
      continue;
    }
    const isReciprocal = alternatePage.alternates.some((candidate) => (
      normalizeRoute(candidate.href, alternateRoute) === page.route
    ));
    if (!isReciprocal) {
      errors.push(`${page.route} hreflang ${alternate.hreflang} is not reciprocated by ${alternateRoute}`);
    }
  }
}

const orphans = indexablePages
  .filter((page) => page.route !== '/' && inbound.get(page.route).size === 0)
  .map((page) => page.route);
const deadEnds = indexablePages
  .filter((page) => [...page.distinctTargets].every((target) => !sitemapRoutes.has(target) || target === page.route))
  .map((page) => page.route);

for (const route of orphans) errors.push(`Indexable orphan page: ${route}`);
for (const route of deadEnds) errors.push(`Indexable dead-end page: ${route}`);

const reachable = new Set(['/']);
const queue = ['/'];
while (queue.length) {
  const route = queue.shift();
  for (const target of pages.get(route)?.distinctTargets || []) {
    if (!sitemapRoutes.has(target) || reachable.has(target)) continue;
    reachable.add(target);
    queue.push(target);
  }
}
const unreachableFromHome = indexablePages
  .filter((page) => !reachable.has(page.route))
  .map((page) => page.route);
if (unreachableFromHome.length) {
  errors.push(`${unreachableFromHome.length} sitemap routes are not reachable from /`);
}

function hasContextualTarget(page, target) {
  return page.anchors.some((anchor) => anchor.region === 'contextual' && anchor.target === target);
}

for (const page of indexablePages.filter((candidate) => candidate.pageClass.endsWith('pair'))) {
  const locale = localeOf(page.route);
  const expectedHome = locale === 'en' ? '/' : `/${locale}/`;
  const expectedHub = locale === 'en' ? '/minimal-pairs-practice/' : `/${locale}/minimal-pairs-practice/`;
  const expectedEarTraining = locale === 'en' ? '/english-ear-training/' : `/${locale}/english-ear-training/`;
  if (!page.distinctTargets.has(expectedHome)) errors.push(`${page.route} does not link to homepage ${expectedHome}`);
  if (!hasContextualTarget(page, expectedHub)) errors.push(`${page.route} does not contextually link to parent hub ${expectedHub}`);
  if (!hasContextualTarget(page, expectedEarTraining)) errors.push(`${page.route} does not contextually link to ear-training hub ${expectedEarTraining}`);

  const hasRelatedPair = page.anchors.some((anchor) => (
    anchor.region === 'contextual'
      && anchor.target !== page.route
      && pages.get(anchor.target)?.pageClass.endsWith('pair')
  ));
  if (!hasRelatedPair) errors.push(`${page.route} does not contextually link to a related pair page`);
}

for (const page of indexablePages.filter((candidate) => candidate.pageClass.endsWith('hub'))) {
  const locale = localeOf(page.route);
  const expectedHome = locale === 'en' ? '/' : `/${locale}/`;
  if (!page.distinctTargets.has(expectedHome)) errors.push(`${page.route} does not link to homepage ${expectedHome}`);

  const hasChildPair = page.anchors.some((anchor) => (
    anchor.region === 'contextual'
      && localeOf(anchor.target) === locale
      && pages.get(anchor.target)?.pageClass.endsWith('pair')
  ));
  if (!hasChildPair) errors.push(`${page.route} does not contextually link to a same-language child pair page`);
}

const localizedPairs = indexablePages.filter((page) => page.pageClass === 'localized pair');
for (const pair of localizedPairs) {
  const locale = localeOf(pair.route);
  const hubRoute = `/${locale}/minimal-pairs-practice/`;
  const hub = pages.get(hubRoute);
  if (!hub?.distinctTargets.has(pair.route)) {
    errors.push(`${hubRoute} does not link to localized child ${pair.route}`);
  }
}

function isLocaleSwitcherEdge(sourcePage, targetPage) {
  return sourcePage.pageClass === 'localized homepage'
    && ['English homepage', 'localized homepage'].includes(targetPage?.pageClass);
}

const englishPairRoutes = indexablePages
  .filter((page) => page.pageClass === 'English pair')
  .map((page) => page.route);
const englishPairHub = pages.get('/minimal-pairs-practice/');
for (const pairRoute of englishPairRoutes) {
  if (!englishPairHub?.distinctTargets.has(pairRoute)) {
    errors.push(`/minimal-pairs-practice/ does not link to English child ${pairRoute}`);
  }
}

for (const route of LOCALIZED_HOMEPAGE_ROUTES) {
  const homepageRoute = `/${route.slug}/`;
  const homepage = pages.get(homepageRoute);
  for (const hubSlug of ['minimal-pairs-practice', 'english-ear-training']) {
    const hubRoute = `/${route.slug}/${hubSlug}/`;
    if (!homepage?.distinctTargets.has(hubRoute)) {
      errors.push(`${homepageRoute} does not link to localized hub ${hubRoute}`);
    }
  }
}

const avoidableCrossLanguageEdges = [];
for (const page of indexablePages.filter((candidate) => candidate.pageClass.startsWith('localized'))) {
  const locale = localeOf(page.route);
  for (const target of page.distinctTargets) {
    if (localeOf(target) !== 'en') continue;
    if (isLocaleSwitcherEdge(page, pages.get(target))) continue;
    const localizedAlternative = target === '/'
      ? `/${locale}/`
      : ['/privacy/', '/terms/'].includes(target)
        ? `${target.slice(0, -1)}-${locale}.html`
        : `/${locale}${target}`;
    if (pages.has(localizedAlternative)) {
      avoidableCrossLanguageEdges.push(`${page.route} -> ${target} (use ${localizedAlternative})`);
    }
  }
}
for (const edge of avoidableCrossLanguageEdges) {
  errors.push(`Avoidable cross-language link: ${edge}`);
}

function sourceTypeOf(page) {
  if (page.pageClass === 'localized homepage') return 'localized homepage';
  if (page.pageClass === 'localized hub') return 'localized hub';
  if (page.pageClass === 'localized pair') return 'localized pair';
  return 'other';
}

function destinationTypeOf(page) {
  if (page.pageClass === 'English hub') return 'English hub';
  if (page.pageClass === 'English pair') return 'English pair';
  if (page.pageClass.includes('utility/legal')) return 'legal/utility';
  return 'other';
}

const crossLanguageFallbacks = [];
for (const page of indexablePages.filter((candidate) => candidate.pageClass.startsWith('localized'))) {
  const sourceLocale = localeOf(page.route);
  for (const target of page.distinctTargets) {
    const targetPage = pages.get(target);
    if (!targetPage || !sitemapRoutes.has(target)) continue;
    if (isLocaleSwitcherEdge(page, targetPage)) continue;
    const targetLocale = localeOf(target);
    if (targetLocale !== sourceLocale && targetLocale !== 'en' && !targetPage.pageClass.includes('utility/legal')) {
      errors.push(`Unexpected cross-language link: ${page.route} -> ${target}`);
      continue;
    }
    if (targetLocale === 'en' && !targetPage.pageClass.includes('utility/legal')) {
      const regions = [...new Set(page.anchors
        .filter((anchor) => anchor.target === target)
        .map((anchor) => anchor.region))].sort();
      crossLanguageFallbacks.push({
        source: page.route,
        target,
        sourceLocale,
        sourceType: sourceTypeOf(page),
        destinationType: destinationTypeOf(targetPage),
        regions,
      });
    }
  }
}
if (crossLanguageFallbacks.length) {
  warnings.push(`${crossLanguageFallbacks.length} localized-to-English fallback edges have no same-language target`);
}

const fallbackByLocale = Object.fromEntries([...localeSlugs].sort().map((locale) => {
  const localeFallbacks = crossLanguageFallbacks.filter((edge) => edge.sourceLocale === locale);
  return [locale, {
    'localized homepage': localeFallbacks.filter((edge) => edge.sourceType === 'localized homepage').length,
    'localized hub': localeFallbacks.filter((edge) => edge.sourceType === 'localized hub').length,
    'localized pair': localeFallbacks.filter((edge) => edge.sourceType === 'localized pair').length,
    total: localeFallbacks.length,
  }];
}));

function countBy(items, key) {
  return Object.fromEntries([...new Set(items.map((item) => item[key]))].sort().map((value) => [
    value,
    items.filter((item) => item[key] === value).length,
  ]));
}

const fallbackBreakdown = {
  byLocale: fallbackByLocale,
  bySourceType: countBy(crossLanguageFallbacks, 'sourceType'),
  byDestinationType: countBy(crossLanguageFallbacks, 'destinationType'),
  byRegion: Object.fromEntries(['contextual', 'shared header', 'language selector', 'footer'].map((region) => [
    region,
    crossLanguageFallbacks.filter((edge) => edge.regions.includes(region)).length,
  ])),
};

const englishPairInboundEdges = indexablePages
  .filter((page) => page.pageClass === 'English pair')
  .flatMap((page) => [...topicalContextualInbound.get(page.route)].map((source) => ({
    source,
    target: page.route,
    sourceType: pages.get(source)?.pageClass || 'other',
  })));
const englishPairInboundBySourceType = countBy(englishPairInboundEdges, 'sourceType');
const directorySourceTypes = new Set([
  'English homepage',
  'localized homepage',
  'English hub',
  'localized hub',
]);
const directoryInboundEdgeCount = englishPairInboundEdges
  .filter((edge) => directorySourceTypes.has(edge.sourceType)).length;
const englishPairInboundConcentration = {
  totalTopicalContextualEdges: englishPairInboundEdges.length,
  bySourceType: englishPairInboundBySourceType,
  directoryAndHomepageEdges: directoryInboundEdgeCount,
  directoryAndHomepageShare: Number((directoryInboundEdgeCount / englishPairInboundEdges.length).toFixed(3)),
};

const classSummary = Object.fromEntries([...new Set(indexablePages.map((page) => page.pageClass))].sort().map((name) => {
  const classPages = indexablePages.filter((page) => page.pageClass === name);
  return [name, {
    pages: classPages.length,
    averageInboundLinks: Number((classPages.reduce((sum, page) => sum + inbound.get(page.route).size, 0) / classPages.length).toFixed(1)),
    averageContextualInboundLinks: Number((classPages.reduce((sum, page) => sum + contextualInbound.get(page.route).size, 0) / classPages.length).toFixed(1)),
    averageTopicalContextualInboundLinks: Number((classPages.reduce((sum, page) => sum + topicalContextualInbound.get(page.route).size, 0) / classPages.length).toFixed(1)),
    averageDistinctInternalLinks: Number((classPages.reduce((sum, page) => sum + page.distinctTargets.size, 0) / classPages.length).toFixed(1)),
    averageContextualOutboundLinks: Number((classPages.reduce((sum, page) => sum + new Set(page.anchors
      .filter((anchor) => anchor.region === 'contextual')
      .map((anchor) => anchor.target)).size, 0) / classPages.length).toFixed(1)),
  }];
}));

const hubMetrics = indexablePages
  .filter((page) => page.pageClass.endsWith('hub'))
  .map((page) => ({
    route: page.route,
    inbound: inbound.get(page.route).size,
    contextualInbound: contextualInbound.get(page.route).size,
    topicalContextualInbound: topicalContextualInbound.get(page.route).size,
    outbound: page.distinctTargets.size,
    contextualOutbound: new Set(page.anchors
      .filter((anchor) => anchor.region === 'contextual')
      .map((anchor) => anchor.target)).size,
  }))
  .sort((a, b) => a.route.localeCompare(b.route));

const mostLinked = indexablePages
  .map((page) => ({
    route: page.route,
    inbound: inbound.get(page.route).size,
    contextualInbound: contextualInbound.get(page.route).size,
    topicalContextualInbound: topicalContextualInbound.get(page.route).size,
    sharedHeaderInbound: inboundByRegion.get(page.route).get('shared header')?.size || 0,
    languageSelectorInbound: inboundByRegion.get(page.route).get('language selector')?.size || 0,
    footerInbound: inboundByRegion.get(page.route).get('footer')?.size || 0,
  }))
  .sort((a, b) => b.inbound - a.inbound || a.route.localeCompare(b.route))
  .slice(0, 15);
const leastLinked = indexablePages
  .filter((page) => page.route !== '/')
  .map((page) => ({ route: page.route, inbound: inbound.get(page.route).size }))
  .sort((a, b) => a.inbound - b.inbound || a.route.localeCompare(b.route))
  .slice(0, 20);
const mostOutbound = indexablePages
  .map((page) => ({
    route: page.route,
    outbound: page.distinctTargets.size,
    contextualOutbound: new Set(page.anchors
      .filter((anchor) => anchor.region === 'contextual')
      .map((anchor) => anchor.target)).size,
  }))
  .sort((a, b) => b.outbound - a.outbound || a.route.localeCompare(b.route))
  .slice(0, 15);

const report = {
  htmlPageCount: pages.size,
  indexablePageCount: indexablePages.length,
  internalEdgeCount: [...pages.values()].reduce((sum, page) => sum + page.distinctTargets.size, 0),
  classSummary,
  hubMetrics,
  mostLinked,
  leastLinked,
  mostOutbound,
  orphans,
  deadEnds,
  reachableFromHomeCount: reachable.size,
  unreachableFromHome,
  avoidableCrossLanguageEdgeCount: avoidableCrossLanguageEdges.length,
  avoidableCrossLanguageEdges,
  crossLanguageEdgeCount: crossLanguageFallbacks.length,
  crossLanguageFallbackBreakdown: fallbackBreakdown,
  englishPairInboundConcentration,
  crossLanguageEdgesSample: crossLanguageFallbacks.slice(0, 40),
  warningCount: warnings.length,
  warnings,
  errorCount: errors.length,
  errors,
  status: errors.length ? 'failed' : 'ok',
};

console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exitCode = 1;
