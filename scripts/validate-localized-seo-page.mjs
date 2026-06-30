import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const origin = 'https://getsoundwise.co';

const languageByLocale = {
  ja: ['ja'],
  zh: ['zh-Hans'],
  yue: ['zh-Hant-HK', 'yue-Hant-HK'],
  ko: ['ko'],
  es: ['es'],
  pt: ['pt'],
  ar: ['ar'],
  'hi-ur': ['hi'],
  fa: ['fa'],
  id: ['id'],
  ru: ['ru'],
  th: ['th'],
  tr: ['tr'],
  vi: ['vi'],
};

const hreflangByLocale = {
  ja: 'ja',
  zh: 'zh-Hans',
  yue: 'yue-Hant-HK',
  ko: 'ko',
  es: 'es',
  pt: 'pt',
  ar: 'ar',
  'hi-ur': 'hi',
  fa: 'fa',
  id: 'id',
  ru: 'ru',
  th: 'th',
  tr: 'tr',
  vi: 'vi',
};

const forbiddenClaims = [
  'clinically proven',
  'scientifically proven',
  'guaranteed improvement',
  'fix your accent',
  'accent reduction',
  'sound native',
  'become fluent',
  'instant results',
];

const placeholderTerms = [
  'TODO',
  'TBD',
  'FIXME',
  'placeholder',
  'lorem ipsum',
];

function usage() {
  return [
    'Usage:',
    '  node scripts/validate-localized-seo-page.mjs --locale ko --slug right-vs-light',
    '  node scripts/validate-localized-seo-page.mjs --page ja/ship-vs-sheep --page ko/right-vs-light',
  ].join('\n');
}

function parseArgs(argv) {
  const pages = [];
  let locale = null;
  let slug = null;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--locale') {
      locale = argv[index + 1];
      index += 1;
    } else if (arg === '--slug') {
      slug = argv[index + 1];
      index += 1;
    } else if (arg === '--page') {
      pages.push(parsePage(argv[index + 1]));
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}\n${usage()}`);
    }
  }

  if (locale || slug) {
    if (!locale || !slug) {
      throw new Error(`--locale and --slug must be provided together\n${usage()}`);
    }
    pages.push({ locale, slug });
  }

  if (pages.length === 0) {
    throw new Error(usage());
  }

  return pages;
}

function parsePage(value) {
  if (!value) {
    throw new Error(`--page requires a value like ko/right-vs-light\n${usage()}`);
  }

  const normalized = value.replace(/^\/+|\/+$/g, '');
  const [locale, ...slugParts] = normalized.split('/');
  const slug = slugParts.join('/');

  if (!locale || !slug || slug.includes('/')) {
    throw new Error(`--page must be formatted as <locale>/<slug>: ${value}`);
  }

  return { locale, slug };
}

function pageUrl({ locale, slug }) {
  return `${origin}/${locale}/${slug}/`;
}

function pageLabel(page) {
  return `${page.locale}/${page.slug}`;
}

function pageFilePath(page) {
  return path.join(distDir, page.locale, page.slug, 'index.html');
}

function routeFilePath(routePath) {
  const normalizedPath = routePath.replace(/^\/+|\/+$/g, '');
  return path.join(distDir, normalizedPath, 'index.html');
}

function routeExists(routePath) {
  return fs.existsSync(routeFilePath(routePath));
}

function addCheck(checks, name, failures = []) {
  checks.push({ name, failures });
}

function parseAttributes(source) {
  const attrs = {};
  for (const match of source.matchAll(/([:@\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) {
    attrs[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? '';
  }
  return attrs;
}

function decodeHtml(value) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function stripTags(value) {
  return normalizeText(decodeHtml(value.replace(/<[^>]+>/g, ' ')));
}

function normalizeText(value) {
  return decodeHtml(String(value)).replace(/\s+/g, ' ').trim();
}

function getHtmlLang(source) {
  const match = source.match(/<html\b([^>]*)>/i);
  return match ? parseAttributes(match[1]).lang : null;
}

function getTitle(source) {
  return stripTags(source.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '');
}

function getMetaContent(source, selectorName, selectorValue) {
  for (const match of source.matchAll(/<meta\b([^>]*)>/gi)) {
    const attrs = parseAttributes(match[1]);
    if (attrs[selectorName] === selectorValue) {
      return attrs.content || '';
    }
  }
  return '';
}

function getLinkTags(source) {
  return [...source.matchAll(/<link\b([^>]*)>/gi)].map((match) => parseAttributes(match[1]));
}

function getHrefValues(source) {
  return [...source.matchAll(/<a\b([^>]*)>/gi)]
    .map((match) => parseAttributes(match[1]).href)
    .filter(Boolean);
}

function getBlockByClass(source, tagName, className) {
  const pattern = new RegExp(`<${tagName}\\b(?=[^>]*class=["'][^"']*\\b${escapeRegex(className)}\\b[^"']*["'])[^>]*>[\\s\\S]*?<\\/${tagName}>`, 'i');
  return source.match(pattern)?.[0] || '';
}

function extractJsonLd(source) {
  const blocks = [];
  const failures = [];

  for (const match of source.matchAll(/<script\b(?=[^>]*type=["']application\/ld\+json["'])[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      blocks.push(JSON.parse(match[1]));
    } catch (error) {
      failures.push(`JSON-LD does not parse: ${error.message}`);
    }
  }

  return { blocks, failures };
}

function flattenJsonLd(blocks) {
  return blocks.flatMap((block) => Array.isArray(block?.['@graph']) ? block['@graph'] : [block]);
}

function getJsonLdByType(blocks, type) {
  return flattenJsonLd(blocks).find((block) => {
    const blockType = block?.['@type'];
    return Array.isArray(blockType) ? blockType.includes(type) : blockType === type;
  });
}

function getVisibleBreadcrumb(source, currentUrl) {
  const block = getBlockByClass(source, 'nav', 'seo-breadcrumb');
  if (!block) {
    return { items: [], failures: ['visible breadcrumb is missing'] };
  }

  const items = [];
  for (const match of block.matchAll(/<(a|span)\b([^>]*)>([\s\S]*?)<\/\1>/gi)) {
    const tagName = match[1].toLowerCase();
    const attrs = parseAttributes(match[2]);
    const label = stripTags(match[3]);

    if (!label || label === '/' || attrs['aria-hidden'] === 'true') {
      continue;
    }

    items.push({
      label,
      url: tagName === 'a' ? absoluteSiteUrl(attrs.href) : currentUrl,
    });
  }

  return { items, failures: [] };
}

function getVisibleFaq(source) {
  const faqBlock = getBlockByClass(source, 'section', 'seo-faq') || source;
  const pairs = [];

  for (const match of faqBlock.matchAll(/<button\b(?=[^>]*class=["'][^"']*\bfaq-question\b[^"']*["'])[^>]*>([\s\S]*?)<\/button>\s*<div\b(?=[^>]*class=["'][^"']*\bfaq-answer\b[^"']*["'])[^>]*>([\s\S]*?)<\/div>/gi)) {
    const questionSource = match[1].match(/<span\b[^>]*>([\s\S]*?)<\/span>/i)?.[1] || match[1];
    pairs.push({
      question: stripTags(questionSource),
      answer: stripTags(match[2]),
    });
  }

  return pairs;
}

function absoluteSiteUrl(href) {
  if (!href) {
    return '';
  }

  try {
    return new URL(href, origin).href;
  } catch {
    return href;
  }
}

function urlToRoutePath(href) {
  try {
    const url = new URL(href, origin);
    if (url.origin !== origin) {
      return null;
    }
    return url.pathname;
  } catch {
    return null;
  }
}

function validateHtmlBasics(source, page) {
  const failures = [];
  const currentUrl = pageUrl(page);
  const expectedLanguages = languageByLocale[page.locale] || [page.locale];
  const htmlLang = getHtmlLang(source);

  if (!htmlLang) {
    failures.push('<html lang="..."> is missing');
  } else if (!expectedLanguages.includes(htmlLang)) {
    failures.push(`<html lang> is ${htmlLang}, expected one of ${expectedLanguages.join(', ')}`);
  }

  const canonical = getLinkTags(source).find((link) => link.rel === 'canonical')?.href;
  if (canonical !== currentUrl) {
    failures.push(`canonical must be ${currentUrl}`);
  }

  if (!getTitle(source)) {
    failures.push('title is missing');
  }

  if (!getMetaContent(source, 'name', 'description')) {
    failures.push('meta description is missing');
  }

  return failures;
}

function validateJsonLd(source, page) {
  const { blocks, failures } = extractJsonLd(source);
  const expectedLanguages = languageByLocale[page.locale] || [page.locale];

  if (blocks.length === 0) {
    failures.push('no application/ld+json blocks found');
  }

  for (const type of ['FAQPage', 'BreadcrumbList', 'LearningResource']) {
    if (!getJsonLdByType(blocks, type)) {
      failures.push(`missing ${type} JSON-LD`);
    }
  }

  const learningResource = getJsonLdByType(blocks, 'LearningResource');
  if (learningResource && !expectedLanguages.includes(learningResource.inLanguage)) {
    failures.push(`LearningResource.inLanguage is ${learningResource.inLanguage}, expected one of ${expectedLanguages.join(', ')}`);
  }

  return { blocks, failures };
}

function validateBreadcrumbParity(source, blocks, page) {
  const currentUrl = pageUrl(page);
  const visible = getVisibleBreadcrumb(source, currentUrl);
  const breadcrumbList = getJsonLdByType(blocks, 'BreadcrumbList');
  const failures = [...visible.failures];

  const schemaItems = (breadcrumbList?.itemListElement || []).map((item) => ({
    label: normalizeText(item.name || ''),
    url: item.item || currentUrl,
  }));

  if (schemaItems.length === 0) {
    failures.push('BreadcrumbList has no itemListElement entries');
  } else if (JSON.stringify(visible.items) !== JSON.stringify(schemaItems)) {
    failures.push(`visible ${JSON.stringify(visible.items)} does not match schema ${JSON.stringify(schemaItems)}`);
  }

  return failures;
}

function validateFaqParity(source, blocks) {
  const visibleFaq = getVisibleFaq(source);
  const schemaFaq = getJsonLdByType(blocks, 'FAQPage')?.mainEntity || [];
  const failures = [];

  if (visibleFaq.length !== schemaFaq.length) {
    failures.push(`visible FAQ count ${visibleFaq.length} does not match schema count ${schemaFaq.length}`);
  }

  const visibleQuestions = visibleFaq.map((faq) => faq.question);
  const schemaQuestions = schemaFaq.map((faq) => normalizeText(faq.name || ''));
  if (JSON.stringify(visibleQuestions) !== JSON.stringify(schemaQuestions)) {
    failures.push(`visible FAQ questions ${JSON.stringify(visibleQuestions)} do not match schema ${JSON.stringify(schemaQuestions)}`);
  }

  for (const faq of visibleFaq) {
    if (!faq.answer) {
      failures.push(`visible FAQ answer is empty for ${faq.question}`);
    }
  }

  for (const faq of schemaFaq) {
    const answer = normalizeText(faq.acceptedAnswer?.text || '');
    if (!answer) {
      failures.push(`schema FAQ answer is empty for ${faq.name}`);
    }
  }

  return failures;
}

function validateHreflang(source, page) {
  const failures = [];
  const currentUrl = pageUrl(page);
  const links = getLinkTags(source).filter((link) => link.rel === 'alternate' && link.hreflang && link.href);
  const selfHreflang = hreflangByLocale[page.locale] || page.locale;
  const selfLink = links.find((link) => link.hreflang === selfHreflang && link.href === currentUrl);

  if (!selfLink) {
    failures.push(`missing self hreflang ${selfHreflang} for ${currentUrl}`);
  }

  if (!links.some((link) => link.hreflang === 'x-default')) {
    failures.push('missing x-default hreflang');
  }

  for (const link of links) {
    if (link.hreflang === 'x-default') {
      continue;
    }

    const routePath = urlToRoutePath(link.href);
    if (!routePath) {
      failures.push(`${link.hreflang} points outside ${origin}: ${link.href}`);
      continue;
    }

    if (!routeExists(routePath)) {
      failures.push(`${link.hreflang} points to missing built page ${routePath}`);
      continue;
    }

    if (link.href === currentUrl) {
      continue;
    }

    const alternateSource = fs.readFileSync(routeFilePath(routePath), 'utf8');
    const reciprocalLinks = getLinkTags(alternateSource).filter((alternateLink) => (
      alternateLink.rel === 'alternate'
      && alternateLink.hreflang
      && alternateLink.href
    ));
    if (!reciprocalLinks.some((alternateLink) => alternateLink.href === currentUrl)) {
      failures.push(`${routePath} is missing reciprocal alternate for ${currentUrl}`);
    }
  }

  return failures;
}

function validateUtm(source, page) {
  const failures = [];
  const expectedParams = {
    utm_source: 'website',
    utm_medium: 'seo-page',
    utm_campaign: 'minimal-pair-pages',
    utm_content: `${page.locale}-${page.slug}`,
  };

  const appStoreLinks = getHrefValues(source).filter((href) => {
    try {
      const url = new URL(href);
      return url.hostname === 'apps.apple.com' && url.pathname.includes('/app/');
    } catch {
      return false;
    }
  });

  for (const href of appStoreLinks) {
    const url = new URL(href);
    for (const [key, expected] of Object.entries(expectedParams)) {
      if (url.searchParams.get(key) !== expected) {
        failures.push(`${href} must contain ${key}=${expected}`);
      }
    }
  }

  return failures;
}

function validateHubLinks(source, page) {
  const hrefs = new Set(getHrefValues(source));
  const failures = [];

  for (const href of [`/${page.locale}/minimal-pairs-practice/`, `/${page.locale}/english-ear-training/`]) {
    if (!hrefs.has(href)) {
      failures.push(`missing ${href}`);
    }
  }

  return failures;
}

function validateLateralLinks(source, page) {
  const relatedBlock = getBlockByClass(source, 'section', 'related-practice');
  const failures = [];

  if (!relatedBlock) {
    return failures;
  }

  const ignoredLocalizedPaths = new Set([
    `/${page.locale}/`,
    `/${page.locale}/minimal-pairs-practice/`,
    `/${page.locale}/english-ear-training/`,
  ]);

  for (const href of getHrefValues(relatedBlock)) {
    const routePath = urlToRoutePath(href);
    if (!routePath || !routePath.endsWith('/') || routePath.includes('.')) {
      continue;
    }

    if (ignoredLocalizedPaths.has(routePath) || routePath === `/${page.locale}/${page.slug}/`) {
      continue;
    }

    const isLocalizedRelatedPair = routePath.startsWith(`/${page.locale}/`);
    const isEnglishFallbackPair = /^\/[a-z0-9-]+\/$/i.test(routePath);
    if ((isLocalizedRelatedPair || isEnglishFallbackPair) && !routeExists(routePath)) {
      failures.push(`${routePath} does not exist in dist`);
    }
  }

  return failures;
}

function validateToc(source) {
  const tocBlock = getBlockByClass(source, 'aside', 'seo-toc');
  const failures = [];

  if (!tocBlock) {
    return failures;
  }

  const ids = new Set([...source.matchAll(/\bid=(?:"([^"]+)"|'([^']+)')/gi)].map((match) => match[1] || match[2]));
  const anchors = [...tocBlock.matchAll(/<a\b([^>]*)>/gi)]
    .map((match) => parseAttributes(match[1]).href)
    .filter((href) => href?.startsWith('#'));

  for (const href of anchors) {
    const id = decodeURIComponent(href.slice(1));
    if (!ids.has(id)) {
      failures.push(`${href} does not resolve to an ID on the page`);
    }
  }

  return failures;
}

function validateForbiddenClaims(source) {
  const lowerSource = source.toLowerCase();
  return forbiddenClaims
    .filter((claim) => lowerSource.includes(claim))
    .map((claim) => `contains forbidden claim: ${claim}`);
}

function validatePlaceholderHygiene(source) {
  const lowerSource = source.toLowerCase();
  return placeholderTerms
    .filter((term) => lowerSource.includes(term.toLowerCase()))
    .map((term) => `contains placeholder term: ${term}`);
}

function validatePage(page) {
  const checks = [];
  const filePath = pageFilePath(page);

  if (!fs.existsSync(filePath)) {
    addCheck(checks, 'file exists', [`${path.relative(root, filePath)} does not exist`]);
    return { page, checks };
  }

  const source = fs.readFileSync(filePath, 'utf8');
  addCheck(checks, 'file exists');
  addCheck(checks, 'HTML basics', validateHtmlBasics(source, page));

  const jsonLd = validateJsonLd(source, page);
  addCheck(checks, 'JSON-LD', jsonLd.failures);
  addCheck(checks, 'breadcrumb parity', validateBreadcrumbParity(source, jsonLd.blocks, page));
  addCheck(checks, 'FAQ parity', validateFaqParity(source, jsonLd.blocks));
  addCheck(checks, 'hreflang', validateHreflang(source, page));
  addCheck(checks, 'UTM', validateUtm(source, page));
  addCheck(checks, 'hub links', validateHubLinks(source, page));
  addCheck(checks, 'lateral links', validateLateralLinks(source, page));
  addCheck(checks, 'TOC', validateToc(source));
  addCheck(checks, 'forbidden claims', validateForbiddenClaims(source));
  addCheck(checks, 'placeholder hygiene', validatePlaceholderHygiene(source));

  return { page, checks };
}

function hasFailures(result) {
  return result.checks.some((check) => check.failures.length > 0);
}

function printResult(result) {
  const status = hasFailures(result) ? 'FAIL' : 'PASS';
  console.log(`${status} ${pageLabel(result.page)}`);

  for (const check of result.checks) {
    if (check.failures.length === 0) {
      console.log(`  PASS ${check.name}`);
    } else {
      console.log(`  FAIL ${check.name}: ${check.failures.join('; ')}`);
    }
  }
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

try {
  const pages = parseArgs(process.argv.slice(2));
  const results = pages.map(validatePage);

  for (const result of results) {
    printResult(result);
  }

  if (results.some(hasFailures)) {
    process.exit(1);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
