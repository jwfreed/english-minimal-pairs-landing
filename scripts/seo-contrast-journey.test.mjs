import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  getContrastJourneyForPair,
  getPracticePairsForContrast,
} from '../src/contrast-journey-catalog.js';
import { applyContentVariantHtml } from '../src/analytics-content-variants.js';
import { renderSeoContrastJourneyHtml } from '../src/seo-contrast-journey.js';

const SHIP_PAGE_PATH = 'content/pairs/ship-vs-sheep/index.html';
const ROLLOUT_PAGE_PATHS = [
  'content/pairs/bit-vs-beat/index.html',
  'content/pairs/fill-vs-feel/index.html',
  'content/pairs/full-vs-fool/index.html',
  'content/pairs/live-vs-leave/index.html',
  SHIP_PAGE_PATH,
  'content/pairs/sit-vs-seat/index.html',
];
const PUBLISHED_JOURNEY_ROUTES = new Set([
  'ship-vs-sheep',
  'bit-vs-beat',
  'fill-vs-feel',
  'live-vs-leave',
  'sit-vs-seat',
  'full-vs-fool',
  'pull-vs-pool',
]);

function countOccurrences(source, needle) {
  return source.split(needle).length - 1;
}

function renderShipPage(source) {
  return renderSeoContrastJourneyHtml(
    applyContentVariantHtml({
      html: source,
      pathname: '/content/pairs/ship-vs-sheep/index.html',
    }),
    {
      publishedSeoPageSlugs: PUBLISHED_JOURNEY_ROUTES,
    }
  );
}

test('renders the reviewed ship-vs-sheep sequence from Contrast Journey data', () => {
  const source = fs.readFileSync(SHIP_PAGE_PATH, 'utf8');
  const rendered = renderShipPage(source);
  const journey = getContrastJourneyForPair('ship-vs-sheep');
  const practicePairs = getPracticePairsForContrast(journey.contrast.id);

  assert.equal(
    countOccurrences(source, 'data-contrast-journey="ship-vs-sheep"'),
    1
  );
  assert.equal(
    countOccurrences(rendered, 'class="contrast-journey-item'),
    practicePairs.length
  );

  let previousIndex = -1;
  for (const pair of practicePairs) {
    const pairText = pair.words.map((word) => word.text).join(' vs ');
    const pairIndex = rendered.indexOf(
      `<span class="contrast-journey-pair">${pairText}</span>`
    );

    assert.ok(pairIndex > previousIndex, `${pair.id} should follow the reviewed sequence`);
    previousIndex = pairIndex;
  }

  assert.match(
    rendered,
    /class="contrast-journey-item is-flagship is-current"[\s\S]*Starting example[\s\S]*aria-current="page"[\s\S]*ship vs sheep/u
  );
  assert.doesNotMatch(rendered, /href="\/ship-vs-sheep\/"/u);

  for (const pair of journey.relatedPairs) {
    assert.match(
      rendered,
      new RegExp(`href="/${pair.id}/" data-destination-pair="${pair.id}"`, 'u')
    );
  }

  assert.deepEqual(
    [...rendered.matchAll(/class="contrast-journey-link" href="\/([^/]+)\//gu)]
      .map((match) => match[1]),
    [
      'bit-vs-beat',
      'fill-vs-feel',
      'live-vs-leave',
      'sit-vs-seat',
    ]
  );
  assert.doesNotMatch(rendered, /slip vs sleep/iu);
});

test('only the six approved English sources opt into Contrast Journey rendering', () => {
  const journeySources = fs.readdirSync('content', { recursive: true })
    .filter((entry) => entry.endsWith('index.html'))
    .map((entry) => `content/${entry}`)
    .filter((filePath) => (
      fs.readFileSync(filePath, 'utf8').includes('data-contrast-journey=')
    ))
    .sort();

  assert.deepEqual(journeySources, ROLLOUT_PAGE_PATHS);
});

test('each rollout page places one generated journey before its article CTA', () => {
  for (const pagePath of ROLLOUT_PAGE_PATHS) {
    const source = fs.readFileSync(pagePath, 'utf8');
    const mountIndex = source.indexOf('data-contrast-journey=');
    const ctaIndex = source.indexOf('<section class="seo-cta"', mountIndex);

    assert.equal(countOccurrences(source, 'data-contrast-journey='), 1, pagePath);
    assert.ok(mountIndex >= 0, `${pagePath} should include a journey mount`);
    assert.ok(ctaIndex > mountIndex, `${pagePath} should bridge from related learning to its CTA`);
  }
});

test('a related-pair page marks itself current and links back to the flagship', () => {
  const rendered = renderSeoContrastJourneyHtml(
    '<div data-contrast-journey="bit-vs-beat"></div><section class="seo-cta"></section>',
    { publishedSeoPageSlugs: PUBLISHED_JOURNEY_ROUTES }
  );

  assert.match(
    rendered,
    /Starting example<\/span><a class="contrast-journey-link" href="\/ship-vs-sheep\/"/u
  );
  assert.match(
    rendered,
    /Current example<\/span><span class="contrast-journey-current" aria-current="page">[\s\S]*bit vs beat/u
  );
  assert.doesNotMatch(rendered, /href="\/bit-vs-beat\/"/u);
});

test('renders the reviewed full-vs-fool path to pull-vs-pool', () => {
  const rendered = renderSeoContrastJourneyHtml(
    '<div data-contrast-journey="full-vs-fool"></div><section class="seo-cta"></section>',
    { publishedSeoPageSlugs: PUBLISHED_JOURNEY_ROUTES }
  );

  assert.match(rendered, /aria-current="page"[\s\S]*full vs fool/u);
  assert.match(rendered, /href="\/pull-vs-pool\/"[\s\S]*pull vs pool/u);
});

test('fails safely when a journey is not followed by an SEO practice CTA', () => {
  assert.throws(
    () => renderSeoContrastJourneyHtml(
      '<section class="seo-cta"></section><div data-contrast-journey="bit-vs-beat"></div>',
      { publishedSeoPageSlugs: PUBLISHED_JOURNEY_ROUTES }
    ),
    /must appear before an SEO practice CTA/u
  );
});

test('the experiment preserves SEO identity, exercise, CTA, and analytics hooks', () => {
  const source = fs.readFileSync(SHIP_PAGE_PATH, 'utf8');
  const rendered = renderShipPage(source);

  for (const snippet of [
    '<title>Ship vs Sheep Pronunciation: /ɪ/ vs /iː/ Practice | Soundwise</title>',
    '<link rel="canonical" href="https://getsoundwise.co/ship-vs-sheep/" />',
    'data-exercise data-contrast="ship-vs-sheep"',
    'id="nav-ship-vs-sheep-app-store-cta"',
    'id="article-ship-vs-sheep-app-store-cta"',
    'data-cta-position="hero"',
    'data-cta-position="mid-content"',
    '<script type="module" src="/src/seo-page.js"></script>',
  ]) {
    assert.equal(countOccurrences(rendered, snippet), countOccurrences(source, snippet), snippet);
  }

  assert.equal(
    countOccurrences(rendered, 'apps.apple.com'),
    countOccurrences(source, 'apps.apple.com')
  );
  assert.match(
    rendered,
    /<html lang="en" data-content-variant="contrast_journey_v1">/u
  );
  assert.doesNotMatch(source, /gtag\('event', '(?:exercise_start|exercise_complete|app_store_click)'/u);
});

test('fails safely when an SEO mount references no reviewed journey', () => {
  assert.throws(
    () => renderSeoContrastJourneyHtml(
      '<div data-contrast-journey="unknown-vs-pair"></div>',
      { publishedSeoPageSlugs: PUBLISHED_JOURNEY_ROUTES }
    ),
    /No Contrast Journey found/u
  );
});

test('fails safely rather than linking to an unpublished related SEO route', () => {
  const source = fs.readFileSync(SHIP_PAGE_PATH, 'utf8');
  const routesMissingSitVsSeat = new Set(PUBLISHED_JOURNEY_ROUTES);
  routesMissingSitVsSeat.delete('sit-vs-seat');

  assert.throws(
    () => renderSeoContrastJourneyHtml(source, {
      publishedSeoPageSlugs: routesMissingSitVsSeat,
    }),
    /references unpublished SEO routes: sit-vs-seat/u
  );
});
