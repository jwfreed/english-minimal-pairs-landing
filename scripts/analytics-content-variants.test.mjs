import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  CONTENT_VARIANTS,
  applyContentVariantHtml,
  getContentVariantForPathname,
} from '../src/analytics-content-variants.js';

const SHIP_SOURCE_PATH = 'content/pairs/ship-vs-sheep/index.html';

test('registered content variant identifiers follow one versioned naming convention', () => {
  const identifiers = Object.values(CONTENT_VARIANTS);

  assert.equal(new Set(identifiers).size, identifiers.length);
  for (const identifier of identifiers) {
    assert.match(identifier, /^[a-z0-9]+(?:_[a-z0-9]+)*_v[1-9][0-9]*$/u);
  }
});

test('Contrast Journey v1 is assigned only to the English ship-vs-sheep page', () => {
  assert.equal(
    getContentVariantForPathname('/ship-vs-sheep/'),
    CONTENT_VARIANTS.CONTRAST_JOURNEY_V1
  );
  assert.equal(
    getContentVariantForPathname('/content/pairs/ship-vs-sheep/index.html'),
    CONTENT_VARIANTS.CONTRAST_JOURNEY_V1
  );

  for (const unrelatedPath of [
    '/ja/ship-vs-sheep/',
    '/content/locales/ja/ship-vs-sheep/index.html',
  ]) {
    assert.equal(getContentVariantForPathname(unrelatedPath), undefined);
  }
});

test('conversion SERP CTA v1 is assigned only to the two treatment pages', () => {
  for (const pathname of [
    '/bit-vs-beat/',
    '/content/pairs/bit-vs-beat/index.html',
    '/fill-vs-feel/',
    '/content/pairs/fill-vs-feel/index.html',
  ]) {
    assert.equal(
      getContentVariantForPathname(pathname),
      'conversion_serp_cta_v1'
    );
  }

  assert.equal(
    getContentVariantForPathname('/ship-vs-sheep/'),
    CONTENT_VARIANTS.CONTRAST_JOURNEY_V1
  );

  for (const pathname of [
    '/live-vs-leave/',
    '/sit-vs-seat/',
    '/content/pairs/live-vs-leave/index.html',
  ]) {
    assert.equal(getContentVariantForPathname(pathname), undefined);
  }
});

test('the experiment build carries its registry variant into the automatic page view', () => {
  const shipSource = fs.readFileSync(SHIP_SOURCE_PATH, 'utf8');
  const unrelatedSource = fs.readFileSync('content/pairs/live-vs-leave/index.html', 'utf8');

  assert.doesNotMatch(shipSource, /data-content-variant=/u);
  const experimentHtml = applyContentVariantHtml({
    html: shipSource,
    pathname: '/content/pairs/ship-vs-sheep/index.html',
  });

  assert.match(
    experimentHtml,
    /<html lang="en" data-content-variant="contrast_journey_v1">/u
  );
  assert.match(
    experimentHtml,
    /gtag\('config', 'G-FTKLKBSY0K', \{ content_variant: 'contrast_journey_v1' \}\);/u
  );
  assert.equal(
    applyContentVariantHtml({
      html: unrelatedSource,
      pathname: '/content/pairs/live-vs-leave/index.html',
    }),
    unrelatedSource
  );
});

test('the conversion treatment build carries its variant into page view analytics', () => {
  const source = fs.readFileSync('content/pairs/bit-vs-beat/index.html', 'utf8');
  const experimentHtml = applyContentVariantHtml({
    html: source,
    pathname: '/content/pairs/bit-vs-beat/index.html',
  });

  assert.match(
    experimentHtml,
    /<html lang="en" data-content-variant="conversion_serp_cta_v1">/u
  );
  assert.match(
    experimentHtml,
    /gtag\('config', 'G-FTKLKBSY0K', \{ content_variant: 'conversion_serp_cta_v1' \}\);/u
  );
});

test('page-local content variant metadata fails instead of overriding the registry', () => {
  assert.throws(
    () => applyContentVariantHtml({
      html: '<html lang="en" data-content-variant="unregistered_variant"></html>',
      pathname: '/ship-vs-sheep/',
    }),
    /must come from the analytics registry/u
  );
});
