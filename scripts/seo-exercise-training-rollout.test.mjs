import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import { getSeoPageLocale } from '../src/app-store-attribution.js';
import { getContrastById } from '../src/contrast-catalog.js';
import { getLearningContrastForPair } from '../src/contrast-journey-catalog.js';
import { createExercise } from '../src/exercise-engine.js';
import setupFunnelTracking from '../src/funnel-tracking.js';
import { buildSeoExerciseEventDetail } from '../src/seo-page.js';
import {
  getSeoExerciseTrainingPairs,
  isMultiPairTrainingEnabled,
} from '../src/seo-exercise-training-rollout.js';

const CONVERSION_SERP_CTA_V1_ROUTES = [
  'bit-vs-beat',
  'fill-vs-feel',
  'ship-vs-sheep',
  'live-vs-leave',
  'sit-vs-seat',
];
const CONTRAST_JOURNEY_V1_ROUTE = 'ship-vs-sheep';

// Mirrors setupSeoExercises(): the effective configuration is derived from the
// mount's data-contrast plus the route locale, exactly as the browser sees it.
function collectExerciseMounts() {
  const mounts = [];
  const roots = [
    { dir: path.join('content', 'pairs'), toRoute: (slug) => `/${slug}/` },
    ...fs.readdirSync(path.join('content', 'locales'), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => ({
        dir: path.join('content', 'locales', entry.name),
        toRoute: (slug) => `/${entry.name}/${slug}/`,
      })),
  ];

  for (const { dir, toRoute } of roots) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const filePath = path.join(dir, entry.name, 'index.html');

      if (!entry.isDirectory() || !fs.existsSync(filePath)) {
        continue;
      }

      const source = fs.readFileSync(filePath, 'utf8');
      const pairId = source.match(/data-exercise data-contrast="([^"]+)"/u)?.[1];

      if (!pairId) {
        continue;
      }

      const route = toRoute(entry.name);
      const documentLanguage = source.match(/<html\b[^>]*\blang="([^"]+)"/u)[1];

      mounts.push({ route, pairId, locale: getSeoPageLocale(route, documentLanguage) });
    }
  }

  return mounts;
}

function getEffectiveTrainingPairIds(route) {
  const mount = collectExerciseMounts().find((candidate) => candidate.route === route);

  assert.ok(mount, `${route} should mount an exercise`);
  return getSeoExerciseTrainingPairs(mount)?.map((pair) => pair.id) ?? null;
}

test('all 35 existing exercise mounts are covered by the effective rollout check', () => {
  const mounts = collectExerciseMounts();

  assert.equal(mounts.length, 35);
  assert.equal(mounts.filter(({ locale }) => locale === 'en').length, 21);
  assert.equal(mounts.filter(({ locale }) => locale !== 'en').length, 14);
});

test('/full-vs-fool/ is the only production mount with multi-pair training', () => {
  const enabledRoutes = collectExerciseMounts()
    .filter((mount) => getSeoExerciseTrainingPairs(mount))
    .map((mount) => mount.route);

  assert.deepEqual(enabledRoutes, ['/full-vs-fool/']);
  assert.deepEqual(getEffectiveTrainingPairIds('/full-vs-fool/'), ['full-vs-fool', 'pull-vs-pool']);
});

test('/pull-vs-pool/ keeps single-pair training despite reviewed journey membership', () => {
  assert.ok(getLearningContrastForPair('pull-vs-pool'));
  assert.equal(isMultiPairTrainingEnabled({ pairId: 'pull-vs-pool', locale: 'en' }), false);
  assert.equal(getEffectiveTrainingPairIds('/pull-vs-pool/'), null);
});

test('every conversion_serp_cta_v1 route keeps single-pair training', () => {
  for (const slug of CONVERSION_SERP_CTA_V1_ROUTES) {
    assert.ok(getLearningContrastForPair(slug), `${slug} has reviewed journey membership`);
    assert.equal(isMultiPairTrainingEnabled({ pairId: slug, locale: 'en' }), false, slug);
    assert.equal(getEffectiveTrainingPairIds(`/${slug}/`), null, slug);
  }
});

test('the contrast_journey_v1 subject keeps single-pair training', () => {
  assert.equal(
    isMultiPairTrainingEnabled({ pairId: CONTRAST_JOURNEY_V1_ROUTE, locale: 'en' }),
    false
  );
  assert.equal(getEffectiveTrainingPairIds(`/${CONTRAST_JOURNEY_V1_ROUTE}/`), null);
});

test('localized exercises stay single-pair, including a hypothetical localized pilot pair', () => {
  const localizedMounts = collectExerciseMounts().filter(({ locale }) => locale !== 'en');

  assert.equal(localizedMounts.length, 14);
  for (const mount of localizedMounts) {
    assert.equal(getSeoExerciseTrainingPairs(mount), null, mount.route);
  }

  assert.equal(getEffectiveTrainingPairIds('/ja/ship-vs-sheep/'), null);
  for (const locale of ['ja', 'es', 'zh', 'hi-ur']) {
    assert.equal(isMultiPairTrainingEnabled({ pairId: 'full-vs-fool', locale }), false, locale);
  }
});

test('rollout is explicit, not derived from journeys, phonemes, or capability groups', () => {
  // Same capability group and phoneme string as the pilot, and reviewed
  // journey membership -- still not enabled.
  assert.equal(
    getContrastById('pull-vs-pool').capabilityGroup,
    getContrastById('full-vs-fool').capabilityGroup
  );
  assert.equal(isMultiPairTrainingEnabled({ pairId: 'pull-vs-pool', locale: 'en' }), false);
  assert.equal(isMultiPairTrainingEnabled({ pairId: 'unknown-vs-pair', locale: 'en' }), false);
  assert.equal(isMultiPairTrainingEnabled({ pairId: 'full-vs-fool' }), false);
});

test('seo-page.js resolves training pairs only through the rollout policy', () => {
  const seoPageSource = fs.readFileSync('src/seo-page.js', 'utf8');

  assert.match(seoPageSource, /getSeoExerciseTrainingPairs\(/u);
  assert.equal(seoPageSource.includes('getTrainingPairsForExercise'), false);
  assert.equal(seoPageSource.includes('CONTRAST_JOURNEY_CATALOG'), false);
});

function createAnalyticsHarness(pathname) {
  const gtagCalls = [];
  const browserWindow = new EventTarget();

  browserWindow.location = { pathname };
  browserWindow.gtag = (...args) => gtagCalls.push(args);
  globalThis.window = browserWindow;
  globalThis.document = { documentElement: { lang: 'en', dataset: {} } };
  setupFunnelTracking();

  return gtagCalls;
}

async function completeSession({ contrast, trainingPairs }) {
  const exercise = createExercise({
    mount: {
      buildEventDetail: (eventName, detail, snapshot) => buildSeoExerciseEventDetail(
        contrast,
        eventName,
        detail,
        trainingPairs ? snapshot : null
      ),
      getTargetIndex: () => 0,
      playWord: async () => true,
      wait: async () => {},
    },
    contrast,
    trainingPairs,
  });

  exercise.unlockAudio();
  await exercise.startRound();
  await exercise.answer(0);
  exercise.nextRound();
  await exercise.startRound();
  await exercise.answer(0);
}

test('multi-pair exercise_complete carries pairs_trained and entry_pair_id to gtag', async (t) => {
  t.after(() => {
    delete globalThis.window;
    delete globalThis.document;
  });
  const gtagCalls = createAnalyticsHarness('/full-vs-fool/');
  const contrast = getContrastById('full-vs-fool');

  await completeSession({
    contrast,
    trainingPairs: getSeoExerciseTrainingPairs({ pairId: 'full-vs-fool', locale: 'en' }),
  });

  assert.deepEqual(gtagCalls.map(([, eventName]) => eventName), ['exercise_start', 'exercise_complete']);

  const [, , startParams] = gtagCalls[0];
  const [, , completeParams] = gtagCalls[1];

  assert.equal('pairs_trained' in startParams, false);
  assert.equal('entry_pair_id' in startParams, false);
  assert.equal(completeParams.pairs_trained, 2);
  assert.equal(completeParams.entry_pair_id, 'full-vs-fool');
  assert.equal(completeParams.exercise_id, 'full-vs-fool');
  assert.equal(completeParams.pair_name, 'FULL / FOOL');
  assert.equal(completeParams.page_slug, 'full-vs-fool');
  assert.equal(completeParams.exercise_completed, true);
  assert.equal('content_variant' in completeParams, false);
});

test('single-pair exercise_complete payloads are unchanged', async (t) => {
  t.after(() => {
    delete globalThis.window;
    delete globalThis.document;
  });
  const gtagCalls = createAnalyticsHarness('/pull-vs-pool/');

  await completeSession({ contrast: getContrastById('pull-vs-pool'), trainingPairs: null });

  const [, eventName, completeParams] = gtagCalls[1];

  assert.equal(eventName, 'exercise_complete');
  assert.deepEqual(completeParams, {
    exercise_id: 'pull-vs-pool',
    pair_name: 'PULL / POOL',
    sound_contrast: '/ʊ/ vs /uː/',
    learner_language: 'en',
    experience_surface: 'seo_contrast_page',
    page_slug: 'pull-vs-pool',
    locale: 'en',
    exercise_completed: true,
  });
});
