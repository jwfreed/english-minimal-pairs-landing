import assert from 'node:assert/strict';
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

test('exercise lifecycle events forward the experiment variant without changing fields', () => {
  const { gtagCalls, listeners } = createTrackingHarness();
  const sharedFields = {
    exercise_id: 'ship-vs-sheep',
    pair_name: 'SHIP / SHEEP',
    sound_contrast: '/ɪ/ vs /iː/',
    language: 'en',
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
});

test('legacy exercise payloads remain unchanged and untagged', () => {
  const { gtagCalls, listeners } = createTrackingHarness();
  const legacyParams = {
    exercise_id: 'bit-vs-beat',
    pair_name: 'BIT / BEAT',
    sound_contrast: '/ɪ/ vs /iː/',
    language: 'en',
    page_slug: 'bit-vs-beat',
    locale: 'en',
    experience_surface: 'seo_contrast_page',
    exercise_completed: false,
  };

  listeners.get('soundwise:demo_started')({
    detail: { exerciseParams: legacyParams },
  });

  assert.deepEqual(gtagCalls, [['event', 'exercise_start', legacyParams]]);
  assert.equal('content_variant' in gtagCalls[0][2], false);
});
