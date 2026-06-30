import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const validatorPath = path.join(__dirname, 'validate-localized-seo-page.mjs');

function writeFile(root, relativePath, source) {
  const filePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, source);
}

function jsonLd(block) {
  return `<script type="application/ld+json">${JSON.stringify(block)}</script>`;
}

function validLocalizedPage({
  locale = 'ko',
  slug = 'right-vs-light',
  alternateHref = 'https://getsoundwise.co/right-vs-light/',
  breadcrumbLabel = 'right vs light',
  breadcrumbSchemaLabel = breadcrumbLabel,
  faqQuestion = 'Why are right and light hard to hear?',
  faqSchemaQuestion = faqQuestion,
  appStoreHref = `https://apps.apple.com/us/app/soundwise-english/id6753882308?utm_source=website&utm_medium=seo-page&utm_campaign=minimal-pair-pages&utm_content=${locale}-${slug}`,
  extraBody = '',
  lateralHref = '/rice-vs-lice/',
  tocHref = '#faq',
} = {}) {
  const url = `https://getsoundwise.co/${locale}/${slug}/`;

  return `<!doctype html>
<html lang="ko">
  <head>
    <title>right vs light | Soundwise</title>
    <meta name="description" content="A listening practice page." />
    <link rel="canonical" href="${url}" />
    <link rel="alternate" hreflang="en" href="${alternateHref}" />
    <link rel="alternate" hreflang="ko" href="${url}" />
    <link rel="alternate" hreflang="x-default" href="https://getsoundwise.co/right-vs-light/" />
    ${jsonLd({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: faqSchemaQuestion,
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'They differ at the first sound.',
          },
        },
      ],
    })}
    ${jsonLd({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Soundwise', item: `https://getsoundwise.co/${locale}/` },
        { '@type': 'ListItem', position: 2, name: 'Practice hub', item: `https://getsoundwise.co/${locale}/minimal-pairs-practice/` },
        { '@type': 'ListItem', position: 3, name: breadcrumbSchemaLabel, item: url },
      ],
    })}
    ${jsonLd({
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: 'right vs light',
      url,
      inLanguage: 'ko',
    })}
  </head>
  <body>
    <nav class="seo-breadcrumb" aria-label="Breadcrumb">
      <a href="/${locale}/">Soundwise</a>
      <a href="/${locale}/minimal-pairs-practice/">Practice hub</a>
      <span>${breadcrumbLabel}</span>
    </nav>
    <aside class="seo-toc"><a href="${tocHref}">FAQ</a></aside>
    <a href="${appStoreHref}">App Store</a>
    <section id="faq" class="seo-faq">
      <div class="faq-item">
        <button class="faq-question" type="button"><span>${faqQuestion}</span></button>
        <div class="faq-answer"><p>They differ at the first sound.</p></div>
      </div>
    </section>
    <section class="related-practice">
      <a href="/${locale}/minimal-pairs-practice/">Practice hub</a>
      <a href="/${locale}/english-ear-training/">Ear training hub</a>
      <a href="${lateralHref}">related pair</a>
    </section>
    ${extraBody}
  </body>
</html>`;
}

function validEnglishAlternate({ includeKo = true } = {}) {
  const koAlternate = includeKo
    ? '<link rel="alternate" hreflang="ko" href="https://getsoundwise.co/ko/right-vs-light/" />'
    : '';

  return `<!doctype html>
<html lang="en">
  <head>
    <title>right vs light | Soundwise</title>
    <meta name="description" content="English page." />
    <link rel="canonical" href="https://getsoundwise.co/right-vs-light/" />
    <link rel="alternate" hreflang="en" href="https://getsoundwise.co/right-vs-light/" />
    ${koAlternate}
    <link rel="alternate" hreflang="x-default" href="https://getsoundwise.co/right-vs-light/" />
  </head>
  <body>English alternate</body>
</html>`;
}

function createFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'localized-seo-validator-'));
  writeFile(root, 'dist/ko/right-vs-light/index.html', validLocalizedPage());
  writeFile(root, 'dist/right-vs-light/index.html', validEnglishAlternate());
  writeFile(root, 'dist/rice-vs-lice/index.html', '<html lang="en"><title>rice vs lice</title></html>');
  writeFile(root, 'dist/ko/minimal-pairs-practice/index.html', '<html lang="ko"></html>');
  writeFile(root, 'dist/ko/english-ear-training/index.html', '<html lang="ko"></html>');
  return root;
}

async function runValidator(root, args) {
  try {
    const result = await execFileAsync(process.execPath, [validatorPath, ...args], { cwd: root });
    return { code: 0, stdout: result.stdout, stderr: result.stderr };
  } catch (error) {
    return {
      code: error.code,
      stdout: error.stdout || '',
      stderr: error.stderr || '',
    };
  }
}

test('passes a valid localized SEO page', async () => {
  const root = createFixture();

  const result = await runValidator(root, ['--locale', 'ko', '--slug', 'right-vs-light']);

  assert.equal(result.code, 0);
  assert.match(result.stdout, /PASS ko\/right-vs-light/);
  assert.match(result.stdout, /PASS hreflang/);
  assert.match(result.stdout, /PASS FAQ parity/);
});

test('accepts multiple explicit --page values', async () => {
  const root = createFixture();
  writeFile(root, 'dist/ja/ship-vs-sheep/index.html', validLocalizedPage({
    locale: 'ja',
    slug: 'ship-vs-sheep',
    alternateHref: 'https://getsoundwise.co/ship-vs-sheep/',
    appStoreHref: 'https://apps.apple.com/us/app/soundwise-english/id6753882308?utm_source=website&utm_medium=seo-page&utm_campaign=minimal-pair-pages&utm_content=ja-ship-vs-sheep',
  }).replace('<html lang="ko">', '<html lang="ja">').replace('"inLanguage":"ko"', '"inLanguage":"ja"').replace('hreflang="ko" href="https://getsoundwise.co/ja/ship-vs-sheep/"', 'hreflang="ja" href="https://getsoundwise.co/ja/ship-vs-sheep/"'));
  writeFile(root, 'dist/ship-vs-sheep/index.html', validEnglishAlternate().replaceAll('right-vs-light', 'ship-vs-sheep').replace('hreflang="ko" href="https://getsoundwise.co/ko/ship-vs-sheep/"', 'hreflang="ja" href="https://getsoundwise.co/ja/ship-vs-sheep/"'));
  writeFile(root, 'dist/ja/minimal-pairs-practice/index.html', '<html lang="ja"></html>');
  writeFile(root, 'dist/ja/english-ear-training/index.html', '<html lang="ja"></html>');

  const result = await runValidator(root, ['--page', 'ko/right-vs-light', '--page', 'ja/ship-vs-sheep']);

  assert.equal(result.code, 0);
  assert.match(result.stdout, /PASS ko\/right-vs-light/);
  assert.match(result.stdout, /PASS ja\/ship-vs-sheep/);
});

test('fails with targeted messages for common SEO regressions', async () => {
  const root = createFixture();
  writeFile(root, 'dist/ko/right-vs-light/index.html', validLocalizedPage({
    breadcrumbSchemaLabel: 'wrong breadcrumb',
    faqSchemaQuestion: 'Wrong FAQ question?',
    appStoreHref: 'https://apps.apple.com/us/app/soundwise-english/id6753882308?utm_source=website&utm_medium=seo-page&utm_campaign=minimal-pair-pages',
    lateralHref: '/ko/missing-pair/',
    tocHref: '#missing-section',
    extraBody: '<p>TODO placeholder</p><p>guaranteed improvement</p>',
  }));
  writeFile(root, 'dist/right-vs-light/index.html', validEnglishAlternate({ includeKo: false }));

  const result = await runValidator(root, ['--locale', 'ko', '--slug', 'right-vs-light']);
  const output = `${result.stdout}\n${result.stderr}`;

  assert.notEqual(result.code, 0);
  assert.match(output, /FAIL breadcrumb parity/);
  assert.match(output, /FAIL FAQ parity/);
  assert.match(output, /FAIL hreflang/);
  assert.match(output, /FAIL UTM/);
  assert.match(output, /FAIL lateral links/);
  assert.match(output, /FAIL TOC/);
  assert.match(output, /FAIL forbidden claims/);
  assert.match(output, /FAIL placeholder hygiene/);
});
