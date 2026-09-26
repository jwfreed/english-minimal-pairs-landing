import { getTrainingPairsForExercise } from './contrast-journey-catalog.js';

// Production activation for multi-pair SEO exercise sessions, keyed by page
// locale and entry pair ID. CONTRAST_JOURNEY_CATALOG defines reviewed training
// membership; this policy deliberately remains narrower so active experiments
// (conversion_serp_cta_v1, contrast_journey_v1) and staged releases stay
// isolated. Journey membership alone never enables multi-pair training.
// See docs/exercise-architecture.md, "Multi-Pair Training Sessions".
export const MULTI_PAIR_TRAINING_ROLLOUT = Object.freeze({
  en: Object.freeze(['full-vs-fool']),
});

export function isMultiPairTrainingEnabled({ pairId, locale }) {
  return Object.hasOwn(MULTI_PAIR_TRAINING_ROLLOUT, locale)
    && MULTI_PAIR_TRAINING_ROLLOUT[locale].includes(pairId);
}

// Reviewed training pairs for an enabled mount, or null to keep the
// single-pair session.
export function getSeoExerciseTrainingPairs({ pairId, locale }) {
  if (!isMultiPairTrainingEnabled({ pairId, locale })) {
    return null;
  }

  return getTrainingPairsForExercise(pairId);
}
