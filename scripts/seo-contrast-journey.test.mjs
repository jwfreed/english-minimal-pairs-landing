import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  getContrastJourneyForPair,
  getPracticePairsForContrast,
} from '../src/contrast-journey-catalog.js';
import { renderSeoContrastJourneyHtml } from '../src/seo-contrast-journey.js';

const SHIP_PAGE_PATH = 'content/pairs/ship-vs-sheep/index.html';

function countOccurrences(source, needle) {
  return source.split(needle).length - 1;
}

test('renders the reviewed ship-vs-sheep sequence from Contrast Journey data', () => {
  const source = fs.readFileSync(SHIP_PAGE_PATH, 'utf8');
  const rendered = renderSeoContrastJourneyHtml(source);
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
    /class="contrast-journey-item is-flagship"[\s\S]*aria-current="page"[\s\S]*ship vs sheep/u
  );
  assert.doesNotMatch(rendered, /href="\/ship-vs-sheep\/"/u);

  for (const pair of journey.relatedPairs) {
    assert.match(rendered, new RegExp(`href="/${pair.id}/"`, 'u'));
  }

  assert.doesNotMatch(rendered, /slip vs sleep/iu);
});

test('only the English ship-vs-sheep source opts into Contrast Journey rendering', () => {
  const journeySources = fs.readdirSync('content', { recursive: true })
    .filter((entry) => entry.endsWith('index.html'))
    .map((entry) => `content/${entry}`)
    .filter((filePath) => (
      fs.readFileSync(filePath, 'utf8').includes('data-contrast-journey=')
    ));

  assert.deepEqual(journeySources, [SHIP_PAGE_PATH]);
});

test('the experiment preserves SEO identity, exercise, CTA, and analytics hooks', () => {
  const source = fs.readFileSync(SHIP_PAGE_PATH, 'utf8');
  const rendered = renderSeoContrastJourneyHtml(source);

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
  assert.doesNotMatch(source, /gtag\('event', '(?:exercise_start|exercise_complete|app_store_click)'/u);
});

test('fails safely when an SEO mount references no reviewed journey', () => {
  assert.throws(
    () => renderSeoContrastJourneyHtml(
      '<div data-contrast-journey="unknown-vs-pair"></div>'
    ),
    /No Contrast Journey found/u
  );
});
