import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import { heroDemoTranslations } from '../src/hero-demo-translations.js';
import { supplementalTranslations } from '../src/landing-supplement-translations.js';
import {
  alignSeoPageCtaHtml,
  resolveSeoPageCapability,
} from '../src/seo-capability-cta.js';
import { APP_CAPABILITY_STATUS } from '../src/app-capability-resolver.js';

const UNSUPPORTED_PAGE_CASES = [
  {
    slug: 'heart-vs-hurt',
    pair: 'heart/hurt',
  },
  {
    slug: 'law-vs-low',
    pair: 'law/low',
  },
];

const STALE_FREE_APP_PATTERNS = [
  /\bfree (?:iOS )?app\b/iu,
  /\bfree (?:ear-training|minimal-pairs) app\b/iu,
  /\bSoundwise is free\b/iu,
  /\bfree on iOS\b/iu,
  /\bDownload Soundwise free\b/iu,
  /\bself-paced,\s*free\b/iu,
];

const UNSUPPORTED_APP_PRACTICE_PATTERN =
  /\bpractice\s+(?:heart\s*\/\s*hurt|law\s*\/\s*low|this (?:sound )?contrast)\s+in Soundwise\b/iu;
const STALE_APP_EXCLUSION_PATTERN =
  /\b(?:is|are)\s+not\s+(?:currently\s+)?(?:included|available|supported)\b[\s\S]{0,40}\b(?:app|Soundwise)\b/iu;

function getFiles(directory, extensionPattern) {
  return fs.readdirSync(directory, { recursive: true })
    .filter((entry) => extensionPattern.test(entry))
    .map((entry) => path.join(directory, entry));
}

const AUTHORED_MESSAGING_FILES = [
  'index.html',
  'landing-copy.json',
  ...getFiles('content', /\.html$/u),
  ...getFiles('legal', /\.html$/u),
  ...getFiles('src', /\.(?:js|json)$/u),
  ...getFiles('docs', /\.md$/u),
];

function getCapabilityCopyIssues(copy, capabilityStatus) {
  const issues = [];

  if (
    capabilityStatus === APP_CAPABILITY_STATUS.NO_APP_SUPPORT
    && UNSUPPORTED_APP_PRACTICE_PATTERN.test(copy)
  ) {
    issues.push('unsupported contrast promises exact in-app practice');
  }

  if (
    capabilityStatus !== APP_CAPABILITY_STATUS.NO_APP_SUPPORT
    && STALE_APP_EXCLUSION_PATTERN.test(copy)
  ) {
    issues.push('supported contrast retains stale app-exclusion copy');
  }

  return issues;
}

test('capability-copy guard covers unsupported promises and future support', () => {
  assert.deepEqual(
    getCapabilityCopyIssues(
      'Practice this contrast in Soundwise.',
      APP_CAPABILITY_STATUS.NO_APP_SUPPORT
    ),
    ['unsupported contrast promises exact in-app practice']
  );
  assert.deepEqual(
    getCapabilityCopyIssues(
      'Heart/hurt is not currently included in the app.',
      APP_CAPABILITY_STATUS.EXACT_PAIR_EXISTS
    ),
    ['supported contrast retains stale app-exclusion copy']
  );
});

test('heart/hurt and law/low separate web practice from capability-safe app coverage', () => {
  for (const { slug, pair } of UNSUPPORTED_PAGE_CASES) {
    const file = `content/pairs/${slug}/index.html`;
    const source = fs.readFileSync(file, 'utf8');
    const exerciseIndex = source.indexOf(`<div data-exercise data-contrast="${slug}"></div>`);
    const ctaSection = source.match(
      /<section class="seo-cta"[\s\S]*?<\/section>/u
    )?.[0];

    assert.ok(exerciseIndex >= 0, `${slug}: web exercise is preserved`);
    assert.ok(ctaSection, `${slug}: CTA section is present`);
    assert.ok(
      exerciseIndex < source.indexOf(ctaSection),
      `${slug}: app coverage clarification follows the web exercise`
    );
    assert.match(
      ctaSection,
      new RegExp(`practice ${pair.replace('/', '\\/')} on this page`, 'iu'),
      `${slug}: web practice is explicit`
    );
    assert.match(
      ctaSection,
      /other sound contrasts across its supported first-language tracks/iu,
      `${slug}: app coverage is capability-safe`
    );
    const capability = resolveSeoPageCapability({
      pathname: `/${slug}/`,
      documentLanguage: 'en',
    });
    assert.deepEqual(
      getCapabilityCopyIssues(ctaSection, capability.status),
      [],
      `${slug}: current copy matches capability`
    );
    assert.deepEqual(
      getCapabilityCopyIssues(
        ctaSection,
        APP_CAPABILITY_STATUS.EXACT_PAIR_EXISTS
      ),
      [],
      `${slug}: copy will not contradict future app support`
    );

    const transformed = alignSeoPageCtaHtml({
      html: source,
      pathname: `/${slug}/`,
      documentLanguage: 'en',
    });
    const beforeFooter = transformed.split(/<footer\b/iu)[0];
    const appStoreAnchors = [
      ...beforeFooter.matchAll(
        /<a\b[^>]*href="[^"]*apps\.apple\.com[^"]*"[^>]*>[\s\S]*?<\/a>/giu
      ),
    ].map(([anchor]) => anchor);

    assert.equal(appStoreAnchors.length, 2, `${slug}: conversion paths are preserved`);
    for (const anchor of appStoreAnchors) {
      assert.match(anchor, /data-app-capability-status="NO_APP_SUPPORT"/u, slug);
      assert.match(anchor, />Soundwise App<\/a>/u, slug);
    }
    assert.match(transformed, new RegExp(`id="nav-${slug}-app-store-cta"`), slug);
    assert.match(transformed, new RegExp(`id="article-${slug}-app-store-cta"`), slug);
    assert.match(transformed, new RegExp(`utm_content=${slug}`), slug);
  }
});

test('pricing sources consistently describe a $4.99 one-time purchase', () => {
  const homepage = fs.readFileSync('index.html', 'utf8');
  const terms = fs.readFileSync('legal/terms/index.html', 'utf8');
  const landingCopy = JSON.parse(fs.readFileSync('landing-copy.json', 'utf8'));
  const landingLanguages = {
    english: landingCopy.english,
    ...landingCopy.translations,
  };

  assert.match(homepage, /\$4\.99 one-time purchase/u);
  assert.match(terms, /available as a one-time purchase/iu);
  assert.match(terms, /There are no recurring subscription fees/iu);

  for (const [language, copy] of Object.entries(landingLanguages)) {
    assert.match(
      copy.microcopy.cta_hover_primary,
      /\$4\.99/u,
      `${language}: canonical landing CTA price`
    );
  }

  for (const [locale, copy] of Object.entries(supplementalTranslations)) {
    assert.match(copy.ctaFeature1, /\$4\.99/u, `${locale}: visible CTA price`);
    assert.match(copy.heroPricingMicrocopy, /\$4\.99/u, `${locale}: visible pricing copy`);
  }

  for (const [locale, copy] of Object.entries(heroDemoTranslations)) {
    if (locale !== 'en') {
      assert.match(copy.demoPromotedCta, /\$4\.99/u, `${locale}: demo CTA price`);
    }
  }

  const authoredPriceTokens = AUTHORED_MESSAGING_FILES.flatMap((file) => (
    [...fs.readFileSync(file, 'utf8').matchAll(/\$(\d+\.\d{2})/gu)]
      .map((match) => ({ file, price: match[1] }))
  ));
  assert.ok(authoredPriceTokens.length > 0);
  for (const { file, price } of authoredPriceTokens) {
    assert.equal(price, '4.99', file);
  }
});

test('authored website and messaging sources contain no stale free-app claim', () => {
  for (const file of AUTHORED_MESSAGING_FILES) {
    const source = fs.readFileSync(file, 'utf8');

    for (const pattern of STALE_FREE_APP_PATTERNS) {
      assert.doesNotMatch(source, pattern, file);
    }
  }
});
