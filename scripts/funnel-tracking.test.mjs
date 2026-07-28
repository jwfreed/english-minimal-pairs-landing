import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { CONTENT_VARIANTS } from '../src/analytics-content-variants.js';
import setupFunnelTracking from '../src/funnel-tracking.js';

test.afterEach(() => {
  delete globalThis.window;
});

function createTrackingHarness() {
  const listeners = new Map();
  const gtagCalls = [];
  const browserWindow = {
    addEventListener(name, listener) {
      listeners.set(name, listener);
    },
    gtag(...args) {
      gtagCalls.push(args);
    },
  };

  globalThis.window = browserWindow;
  setupFunnelTracking();

  return { gtagCalls, listeners };
}

test('homepage and SEO exercise producers use only the learner_language contract key', () => {
  const mainSource = fs.readFileSync('src/main.js', 'utf8');
  const seoPageSource = fs.readFileSync('src/seo-page.js', 'utf8');

  assert.match(
    mainSource,
    /\n\s+learner_language: detail\.runtimeLocale \|\| heroDemoState\.runtimeLocale/
  );
  assert.doesNotMatch(
    mainSource,
    /\n\s+language: detail\.runtimeLocale \|\| heroDemoState\.runtimeLocale/
  );
  assert.match(
    seoPageSource,
    /\n\s+learner_language: document\.documentElement\.lang \|\| 'en'/
  );
  assert.doesNotMatch(
    seoPageSource,
    /\n\s+language: document\.documentElement\.lang \|\| 'en'/
  );
});

test('exercise lifecycle events preserve names, learner language, locale, variants, and dedupe guards', () => {
  const { gtagCalls, listeners } = createTrackingHarness();
  const sharedFields = {
    exercise_id: 'ship-vs-sheep',
    pair_name: 'SHIP / SHEEP',
    sound_contrast: '/ɪ/ vs /iː/',
    learner_language: 'en',
    page_slug: 'ship-vs-sheep',
    locale: 'en',
    experience_surface: 'seo_contrast_page',
    content_variant: CONTENT_VARIANTS.CONTRAST_JOURNEY_V1,
  };

  listeners.get('soundwise:demo_started')({
    detail: {
      exerciseParams: {
        ...sharedFields,
        exercise_completed: false,
      },
    },
  });
  listeners.get('soundwise:demo_completed')({
    detail: {
      exerciseParams: {
        ...sharedFields,
        exercise_completed: true,
      },
    },
  });
  listeners.get('soundwise:demo_started')({
    detail: {
      exerciseParams: {
        ...sharedFields,
        exercise_completed: false,
      },
    },
  });
  listeners.get('soundwise:challenge_completed')({
    detail: {
      exerciseParams: {
        ...sharedFields,
        exercise_completed: true,
      },
    },
  });

  assert.deepEqual(gtagCalls, [
    ['event', 'exercise_start', {
      ...sharedFields,
      exercise_completed: false,
    }],
    ['event', 'exercise_complete', {
      ...sharedFields,
      exercise_completed: true,
    }],
  ]);
  assert.equal(gtagCalls.some(([, , params]) => 'language' in params), false);
  assert.deepEqual(gtagCalls.map(([, eventName]) => eventName), [
    'exercise_start',
    'exercise_complete',
  ]);
});

test('non-experiment exercise payloads remain untagged', () => {
  const { gtagCalls, listeners } = createTrackingHarness();
  const legacyParams = {
    exercise_id: 'bit-vs-beat',
    pair_name: 'BIT / BEAT',
    sound_contrast: '/ɪ/ vs /iː/',
    learner_language: 'en',
    page_slug: 'bit-vs-beat',
    locale: 'en',
    experience_surface: 'seo_contrast_page',
    exercise_completed: false,
  };

  listeners.get('soundwise:demo_started')({
    detail: { exerciseParams: legacyParams },
  });

  assert.deepEqual(gtagCalls, [['event', 'exercise_start', legacyParams]]);
  assert.equal('language' in gtagCalls[0][2], false);
  assert.equal('content_variant' in gtagCalls[0][2], false);
});
