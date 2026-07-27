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
    '/bit-vs-beat/',
    '/ja/ship-vs-sheep/',
    '/content/locales/ja/ship-vs-sheep/index.html',
  ]) {
    assert.equal(getContentVariantForPathname(unrelatedPath), undefined);
  }
});

test('build metadata is injected from the registry without page-local duplication', () => {
  const shipSource = fs.readFileSync(SHIP_SOURCE_PATH, 'utf8');
  const unrelatedSource = fs.readFileSync('content/pairs/bit-vs-beat/index.html', 'utf8');

  assert.doesNotMatch(shipSource, /data-content-variant=/u);
  assert.match(
    applyContentVariantHtml({
      html: shipSource,
      pathname: '/content/pairs/ship-vs-sheep/index.html',
    }),
    /<html lang="en" data-content-variant="contrast_journey_v1">/u
  );
  assert.equal(
    applyContentVariantHtml({
      html: unrelatedSource,
      pathname: '/content/pairs/bit-vs-beat/index.html',
    }),
    unrelatedSource
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
