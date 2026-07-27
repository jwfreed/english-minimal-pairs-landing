import assert from 'node:assert/strict';
import test from 'node:test';

import {
  APP_CAPABILITY_STATUS,
  resolveAppCapability,
} from '../src/app-capability-resolver.js';
import {
  CONTRAST_JOURNEY_CATALOG,
  getContrastJourneyForPair,
  getLearningContrastForPair,
  getPracticePairsForContrast,
} from '../src/contrast-journey-catalog.js';
import { getContrastById } from '../src/contrast-catalog.js';

test('ship-vs-sheep maps to the explicit /ɪ/ vs /iː/ learning contrast', () => {
  const contrast = getLearningContrastForPair('ship-vs-sheep');

  assert.equal(contrast.id, 'short-i-vs-long-e');
  assert.equal(contrast.label, '/ɪ/ vs /iː/');
  assert.equal(contrast.flagshipPairId, 'ship-vs-sheep');
  assert.equal(
    contrast.description,
    'The difference between the short i sound in ship and the long ee sound in sheep.'
  );
});

test('/ɪ/ vs /iː/ returns the reviewed practice pairs in journey order', () => {
  const practicePairs = getPracticePairsForContrast('/ɪ/ vs /iː/');

  assert.deepEqual(
    practicePairs.map((pair) => pair.id),
    [
      'ship-vs-sheep',
      'bit-vs-beat',
      'fill-vs-feel',
      'live-vs-leave',
      'sit-vs-seat',
    ]
  );
  assert.deepEqual(
    practicePairs.map((pair) => pair.words.map((word) => word.text)),
    [
      ['ship', 'sheep'],
      ['bit', 'beat'],
      ['fill', 'feel'],
      ['live', 'leave'],
      ['sit', 'seat'],
    ]
  );
});

test('ship-vs-sheep exposes the other reviewed pairs as related examples', () => {
  const journey = getContrastJourneyForPair('ship-vs-sheep');

  assert.equal(journey.pair, 'ship-vs-sheep');
  assert.equal(journey.contrast.label, '/ɪ/ vs /iː/');
  assert.deepEqual(
    journey.relatedPairs.map((pair) => pair.id),
    ['bit-vs-beat', 'fill-vs-feel', 'live-vs-leave', 'sit-vs-seat']
  );
});

test('unknown pairs and contrasts fail safely without inferred matches', () => {
  assert.equal(getLearningContrastForPair('unknown-vs-pair'), null);
  assert.equal(getContrastJourneyForPair('unknown-vs-pair'), null);
  assert.deepEqual(getPracticePairsForContrast('unknown-contrast'), []);
  assert.deepEqual(getPracticePairsForContrast('/iː/ vs /ɪ/'), []);
});

test('contrast journey pair IDs reuse reviewed pronunciation catalog records', () => {
  const mappedPairIds = new Set();

  for (const contrast of Object.values(CONTRAST_JOURNEY_CATALOG)) {
    assert.ok(
      contrast.practicePairIds.includes(contrast.flagshipPairId),
      `${contrast.id} should include its flagship in the practice sequence`
    );

    for (const pairId of contrast.practicePairIds) {
      const pair = getContrastById(pairId);

      assert.ok(pair, `${pairId} should exist in CONTRAST_CATALOG`);
      assert.equal(pair.contrast, contrast.label, `${pairId} contrast label`);
      assert.equal(
        mappedPairIds.has(pairId),
        false,
        `${pairId} should belong to only one learning contrast`
      );
      mappedPairIds.add(pairId);
    }
  }
});

test('contrast journey records remain route-neutral', () => {
  for (const contrast of Object.values(CONTRAST_JOURNEY_CATALOG)) {
    for (const routeField of ['route', 'slug', 'url', 'canonical']) {
      assert.equal(routeField in contrast, false, routeField);
    }
  }
});

test('a reviewed journey is not evidence of app capability', () => {
  const pair = getContrastById('ship-vs-sheep');
  const journey = getContrastJourneyForPair(pair.id);
  const capability = resolveAppCapability({
    route: '/th/ship-vs-sheep/',
    locale: 'th',
    flagshipPair: pair.words,
    contrastGroup: pair.capabilityGroup,
  });

  assert.ok(journey);
  assert.equal(capability.status, APP_CAPABILITY_STATUS.NO_APP_SUPPORT);
  assert.equal(capability.recommendedCTA, null);
});
