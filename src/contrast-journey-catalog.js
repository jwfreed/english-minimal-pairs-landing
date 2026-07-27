import { getContrastById } from './contrast-catalog.js';

// Reviewed educational relationships only. Membership and sequence are
// explicit; app support remains the responsibility of app-capability-resolver.
// See docs/contrast-journey-architecture.md.
export const CONTRAST_JOURNEY_CATALOG = Object.freeze({
  'short-i-vs-long-e': Object.freeze({
    id: 'short-i-vs-long-e',
    label: '/ɪ/ vs /iː/',
    description:
      'The difference between the short i sound in ship and the long ee sound in sheep.',
    flagshipPairId: 'ship-vs-sheep',
    practicePairIds: Object.freeze([
      'ship-vs-sheep',
      'bit-vs-beat',
      'fill-vs-feel',
      'live-vs-leave',
      'sit-vs-seat',
    ]),
  }),
});

function getContrastByReference(contrastIdOrLabel) {
  return Object.values(CONTRAST_JOURNEY_CATALOG).find((contrast) => (
    contrast.id === contrastIdOrLabel || contrast.label === contrastIdOrLabel
  )) || null;
}

export function getLearningContrastForPair(pairId) {
  return Object.values(CONTRAST_JOURNEY_CATALOG).find((contrast) => (
    contrast.practicePairIds.includes(pairId)
  )) || null;
}

export function getPracticePairsForContrast(contrastIdOrLabel) {
  const contrast = getContrastByReference(contrastIdOrLabel);

  if (!contrast) {
    return [];
  }

  return contrast.practicePairIds
    .map((pairId) => getContrastById(pairId))
    .filter(Boolean);
}

export function getContrastJourneyForPair(pairId) {
  const contrast = getLearningContrastForPair(pairId);
  const pair = getContrastById(pairId);

  if (!contrast || !pair) {
    return null;
  }

  return Object.freeze({
    pair: pair.id,
    contrast,
    relatedPairs: Object.freeze(
      getPracticePairsForContrast(contrast.id).filter(
        (practicePair) => practicePair.id !== pair.id
      )
    ),
  });
}
