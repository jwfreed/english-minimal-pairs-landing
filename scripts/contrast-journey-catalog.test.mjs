import assert from 'node:assert/strict';
import test from 'node:test';

import {
  APP_CAPABILITY_STATUS,
  resolveAppCapability,
} from '../src/app-capability-resolver.js';
import fs from 'node:fs';

import {
  CONTRAST_JOURNEY_CATALOG,
  assertValidContrastJourney,
  getContrastJourneyForPair,
  getLearningContrastForPair,
  getPracticePairsForContrast,
  getTrainingPairsForExercise,
} from '../src/contrast-journey-catalog.js';
import { getContrastById } from '../src/contrast-catalog.js';

function journeyFixture(overrides = {}) {
  return {
    id: 'fixture-journey',
    label: '/ʊ/ vs /uː/',
    flagshipPairId: 'full-vs-fool',
    practicePairIds: ['full-vs-fool', 'pull-vs-pool'],
    ...overrides,
  };
}

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

test('/ʊ/ vs /uː/ maps to its reviewed practice pair sequence', () => {
  const contrast = getLearningContrastForPair('pull-vs-pool');
  const practicePairs = getPracticePairsForContrast('/ʊ/ vs /uː/');

  assert.equal(contrast.id, 'short-u-vs-long-u');
  assert.equal(contrast.flagshipPairId, 'full-vs-fool');
  assert.deepEqual(
    practicePairs.map((pair) => pair.id),
    ['full-vs-fool', 'pull-vs-pool']
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

test('every reviewed journey satisfies the training-membership invariants', () => {
  for (const journey of Object.values(CONTRAST_JOURNEY_CATALOG)) {
    assert.doesNotThrow(() => assertValidContrastJourney(journey), journey.id);
    assert.equal(
      journey.practicePairIds[0],
      journey.flagshipPairId,
      `${journey.id} must lead its reviewed sequence with the flagship entry pair`
    );
    assert.equal(
      new Set(journey.practicePairIds.map((pairId) => getContrastById(pairId).contrast)).size,
      1,
      `${journey.id} pairs must share one canonical phonemic contrast`
    );
  }
});

test('journey validation fails loudly on a missing or unresolvable flagship', () => {
  assert.throws(
    () => assertValidContrastJourney(journeyFixture({ flagshipPairId: undefined })),
    /flagship/u
  );
  assert.throws(
    () => assertValidContrastJourney(journeyFixture({
      flagshipPairId: 'fuel-vs-fool',
      practicePairIds: ['fuel-vs-fool', 'full-vs-fool'],
    })),
    /unknown pair "fuel-vs-fool"/u
  );
});

test('journey validation fails loudly on unresolved practice pair IDs', () => {
  assert.throws(
    () => assertValidContrastJourney(journeyFixture({
      practicePairIds: ['full-vs-fool', 'pool-vs-pull'],
    })),
    /unknown pair "pool-vs-pull"/u
  );
});

test('journey validation fails loudly on duplicate practice pair IDs', () => {
  assert.throws(
    () => assertValidContrastJourney(journeyFixture({
      practicePairIds: ['full-vs-fool', 'pull-vs-pool', 'pull-vs-pool'],
    })),
    /duplicate pair "pull-vs-pool"/u
  );
});

test('journey validation requires the flagship to lead its practice sequence', () => {
  assert.throws(
    () => assertValidContrastJourney(journeyFixture({
      practicePairIds: ['pull-vs-pool'],
    })),
    /flagship "full-vs-fool" must lead/u
  );
  assert.throws(
    () => assertValidContrastJourney(journeyFixture({
      practicePairIds: ['pull-vs-pool', 'full-vs-fool'],
    })),
    /flagship "full-vs-fool" must lead/u
  );
});

test('journey validation rejects mixed phonemic contrasts, including shared capability groups', () => {
  assert.throws(
    () => assertValidContrastJourney(journeyFixture({
      practicePairIds: ['full-vs-fool', 'ship-vs-sheep'],
    })),
    /mixes phonemic contrasts/u
  );

  // three-vs-tree and thin-vs-tin share capabilityGroup "thetaT" but are not
  // the same phonemic contrast; capability grouping must never admit them.
  assert.equal(
    getContrastById('three-vs-tree').capabilityGroup,
    getContrastById('thin-vs-tin').capabilityGroup
  );
  assert.throws(
    () => assertValidContrastJourney(journeyFixture({
      label: '/θ/ vs /t/',
      flagshipPairId: 'thin-vs-tin',
      practicePairIds: ['thin-vs-tin', 'three-vs-tree'],
    })),
    /mixes phonemic contrasts/u
  );
});

test('/ʊ/ vs /uː/ resolves reviewed training pairs in entry-first journey order', () => {
  const trainingPairs = getTrainingPairsForExercise('full-vs-fool');

  assert.deepEqual(trainingPairs.map((pair) => pair.id), ['full-vs-fool', 'pull-vs-pool']);
  assert.equal(trainingPairs[0], getContrastById('full-vs-fool'));
  assert.equal(trainingPairs[1], getContrastById('pull-vs-pool'));
});

test('training pairs always lead with the requested entry pair, then reviewed order', () => {
  for (const journey of Object.values(CONTRAST_JOURNEY_CATALOG)) {
    for (const entryPairId of journey.practicePairIds) {
      assert.deepEqual(
        getTrainingPairsForExercise(entryPairId).map((pair) => pair.id),
        [entryPairId, ...journey.practicePairIds.filter((pairId) => pairId !== entryPairId)],
        entryPairId
      );
    }
  }
});

test('training membership is never inferred for pairs outside a reviewed journey', () => {
  // thin-vs-tin has a capabilityGroup sibling and three-vs-tree has none with
  // its exact contrast; neither has reviewed journey membership.
  assert.throws(() => getTrainingPairsForExercise('thin-vs-tin'), /No reviewed Contrast Journey/u);
  assert.throws(() => getTrainingPairsForExercise('three-vs-tree'), /No reviewed Contrast Journey/u);
  // bad-vs-bed shares its exact phoneme string with man-vs-men, yet has no journey.
  assert.throws(() => getTrainingPairsForExercise('bad-vs-bed'), /No reviewed Contrast Journey/u);
  assert.throws(() => getTrainingPairsForExercise('unknown-vs-pair'), /No reviewed Contrast Journey/u);

  const journeySource = fs.readFileSync('src/contrast-journey-catalog.js', 'utf8');
  assert.equal(journeySource.includes('capabilityGroup'), false);
});
