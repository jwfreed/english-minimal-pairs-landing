import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pagePath = path.join(root, 'content', 'locales', 'yue', 'right-vs-light', 'index.html');
const englishPagePath = path.join(root, 'content', 'pairs', 'right-vs-light', 'index.html');
const viteConfigPath = path.join(root, 'vite.config.js');
const sitemapPath = path.join(root, 'public', 'sitemap.xml');

const issues = [];

function readRequired(filePath) {
  if (!fs.existsSync(filePath)) {
    issues.push(`${path.relative(root, filePath)}: file does not exist`);
    return '';
  }

  return fs.readFileSync(filePath, 'utf8');
}

function expectContains(source, expected, label) {
  if (!source.includes(expected)) {
    issues.push(`${label}: missing ${expected}`);
  }
}

function extractJsonLd(source) {
  return [...source.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
}

function getVisibleBreadcrumb(source) {
  const breadcrumbMatch = source.match(/<nav class="seo-breadcrumb"[\s\S]*?<\/nav>/);
  if (!breadcrumbMatch) {
    issues.push('yue/right-vs-light/index.html: visible breadcrumb is missing');
    return [];
  }

  return [...breadcrumbMatch[0].matchAll(/<(?:a|span)(?:\s[^>]*)?>([^<]+)<\/(?:a|span)>/g)]
    .map((match) => match[1].replace(/\u00a0|&nbsp;/g, ' ').trim())
    .filter((text) => text && text !== '/');
}

function getFaqPairs(source) {
  return [...source.matchAll(
    /<button[\s\S]*?class="faq-question"[\s\S]*?<span>([\s\S]*?)<\/span>[\s\S]*?<\/button>\s*<div[\s\S]*?class="faq-answer"[\s\S]*?>([\s\S]*?)<\/div>/g,
  )].map((match) => ({
    question: stripTags(match[1]),
    answer: stripTags(match[2]),
  }));
}

function stripTags(value) {
  return value
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function expectJsonLd(page) {
  let blocks = [];
  try {
    blocks = extractJsonLd(page);
  } catch (error) {
    issues.push(`yue/right-vs-light/index.html: JSON-LD does not parse: ${error.message}`);
    return;
  }

  const byType = new Map(blocks.map((block) => [block['@type'], block]));
  for (const type of ['FAQPage', 'BreadcrumbList', 'LearningResource']) {
    if (!byType.has(type)) {
      issues.push(`yue/right-vs-light/index.html: missing ${type} JSON-LD`);
    }
  }

  const learningResource = byType.get('LearningResource');
  if (learningResource?.inLanguage !== 'zh-Hant-HK') {
    issues.push('yue/right-vs-light/index.html: LearningResource inLanguage must be zh-Hant-HK');
  }

  const visibleBreadcrumb = getVisibleBreadcrumb(page);
  const breadcrumbItems = byType.get('BreadcrumbList')?.itemListElement || [];
  const schemaBreadcrumb = breadcrumbItems.map((item) => item.name);
  if (JSON.stringify(visibleBreadcrumb) !== JSON.stringify(schemaBreadcrumb)) {
    issues.push(
      `yue/right-vs-light/index.html: visible breadcrumb ${JSON.stringify(visibleBreadcrumb)} does not match schema ${JSON.stringify(schemaBreadcrumb)}`,
    );
  }

  const faqPairs = getFaqPairs(page);
  const schemaFaq = byType.get('FAQPage')?.mainEntity || [];
  if (faqPairs.length !== schemaFaq.length) {
    issues.push(`yue/right-vs-light/index.html: visible FAQ count ${faqPairs.length} does not match schema count ${schemaFaq.length}`);
  }

  for (const faq of schemaFaq) {
    const visible = faqPairs.find((pair) => pair.question === faq.name);
    if (!visible) {
      issues.push(`yue/right-vs-light/index.html: FAQ schema question is not visible: ${faq.name}`);
    } else if (visible.answer !== faq.acceptedAnswer?.text) {
      issues.push(`yue/right-vs-light/index.html: FAQ schema answer does not match visible answer for ${faq.name}`);
    }
  }
}

const page = readRequired(pagePath);
const englishPage = readRequired(englishPagePath);
const viteConfig = readRequired(viteConfigPath);
const sitemap = readRequired(sitemapPath);

if (page) {
  expectContains(page, '<html lang="zh-Hant-HK">', 'yue/right-vs-light/index.html');
  expectContains(page, '<link rel="canonical" href="https://getsoundwise.co/yue/right-vs-light/" />', 'yue/right-vs-light/index.html');
  expectContains(page, '<link rel="alternate" hreflang="en" href="https://getsoundwise.co/right-vs-light/" />', 'yue/right-vs-light/index.html');
  expectContains(page, '<link rel="alternate" hreflang="yue-Hant-HK" href="https://getsoundwise.co/yue/right-vs-light/" />', 'yue/right-vs-light/index.html');
  expectContains(page, '<link rel="alternate" hreflang="x-default" href="https://getsoundwise.co/right-vs-light/" />', 'yue/right-vs-light/index.html');
  expectContains(page, 'right vs light', 'yue/right-vs-light/index.html');
  expectContains(page, 'utm_content=yue-right-vs-light', 'yue/right-vs-light/index.html');
  expectContains(page, 'href="/yue/minimal-pairs-practice/"', 'yue/right-vs-light/index.html');
  expectContains(page, 'href="/yue/english-ear-training/"', 'yue/right-vs-light/index.html');
  expectContains(page, 'href="/rice-vs-lice/"', 'yue/right-vs-light/index.html');
  expectContains(page, 'href="/thin-vs-tin/"', 'yue/right-vs-light/index.html');
  expectContains(page, 'href="/three-vs-tree/"', 'yue/right-vs-light/index.html');
  expectContains(page, 'href="/vest-vs-west/"', 'yue/right-vs-light/index.html');
  expectJsonLd(page);

  if (page.includes('href="/yue/rice-vs-lice/"') || page.includes('href="/yue/thin-vs-tin/"') || page.includes('href="/yue/three-vs-tree/"') || page.includes('href="/yue/vest-vs-west/"')) {
    issues.push('yue/right-vs-light/index.html: lateral links must not point to non-existent Cantonese pair pages');
  }

  if (/TODO|TBD/.test(page)) {
    issues.push('yue/right-vs-light/index.html: contains TODO/TBD placeholder');
  }
}

if (englishPage) {
  expectContains(englishPage, '<link rel="alternate" hreflang="en" href="https://getsoundwise.co/right-vs-light/" />', 'right-vs-light/index.html');
  expectContains(englishPage, '<link rel="alternate" hreflang="yue-Hant-HK" href="https://getsoundwise.co/yue/right-vs-light/" />', 'right-vs-light/index.html');
  expectContains(englishPage, '<link rel="alternate" hreflang="x-default" href="https://getsoundwise.co/right-vs-light/" />', 'right-vs-light/index.html');
}

expectContains(viteConfig, "'yue/right-vs-light'", 'vite.config.js');
expectContains(sitemap, '<loc>https://getsoundwise.co/yue/right-vs-light/</loc>', 'public/sitemap.xml');

if (issues.length > 0) {
  console.error(JSON.stringify({ issues }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: 'ok', route: '/yue/right-vs-light/' }, null, 2));
