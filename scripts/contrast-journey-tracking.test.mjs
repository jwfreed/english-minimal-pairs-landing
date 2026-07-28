import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { CONTENT_VARIANTS } from '../src/analytics-content-variants.js';
import { setupContrastJourneyTracking } from '../src/seo-page.js';

const seoPageSource = fs.readFileSync('src/seo-page.js', 'utf8');

function createTrackingHarness({
  sourcePair = 'ship-vs-sheep',
  destinationPairs = ['bit-vs-beat', 'fill-vs-feel'],
  contentVariant = CONTENT_VARIANTS.CONTRAST_JOURNEY_V1,
  documentLanguage = 'en',
  pathname = `/${sourcePair}/`,
} = {}) {
  const gtagCalls = [];
  const links = destinationPairs.map((destinationPair) => ({
    dataset: { destinationPair },
    closest(selector) {
      if (selector === 'a.contrast-journey-link[data-destination-pair]') {
        return this;
      }

      if (selector === '.contrast-journey-list[data-contrast-journey]') {
        return list;
      }

      return null;
    },
  }));
  const list = {
    dataset: { contrastJourney: sourcePair },
    querySelectorAll(selector) {
      assert.equal(selector, 'a.contrast-journey-link[data-destination-pair]');
      return links;
    },
  };
  let clickListener;
  let observer;
  const root = {
    documentElement: {
      lang: documentLanguage,
      dataset: contentVariant ? { contentVariant } : {},
    },
    querySelectorAll(selector) {
      assert.equal(selector, '.contrast-journey-list[data-contrast-journey]');
      return [list];
    },
    addEventListener(name, listener) {
      if (name === 'click') {
        clickListener = listener;
      }
    },
  };
  const browserWindow = {
    location: { pathname },
    gtag(...args) {
      gtagCalls.push(args);
    },
  };
  class TestObserver {
    constructor(callback) {
      this.callback = callback;
      this.observed = [];
      this.unobserved = [];
      observer = this;
    }

    observe(target) {
      this.observed.push(target);
    }

    unobserve(target) {
      this.unobserved.push(target);
    }
  }

  setupContrastJourneyTracking({
    root,
    browserWindow,
    Observer: TestObserver,
  });

  return {
    browserWindow,
    clickListener,
    gtagCalls,
    links,
    list,
    observer,
  };
}

test('journey impressions report each visible destination once', () => {
  const {
    gtagCalls,
    list,
    observer,
  } = createTrackingHarness();
  const visibleEntry = { isIntersecting: true, target: list };

  assert.deepEqual(observer.observed, [list]);
  observer.callback([visibleEntry]);
  observer.callback([visibleEntry]);

  assert.deepEqual(gtagCalls, [
    ['event', 'contrast_journey_view', {
      source_pair: 'ship-vs-sheep',
      destination_pair: 'bit-vs-beat',
      learner_language: 'en',
      locale: 'en',
      content_variant: CONTENT_VARIANTS.CONTRAST_JOURNEY_V1,
    }],
    ['event', 'contrast_journey_view', {
      source_pair: 'ship-vs-sheep',
      destination_pair: 'fill-vs-feel',
      learner_language: 'en',
      locale: 'en',
      content_variant: CONTENT_VARIANTS.CONTRAST_JOURNEY_V1,
    }],
  ]);
  assert.equal(gtagCalls.some(([, , params]) => 'language' in params), false);
  assert.deepEqual(observer.unobserved, [list]);
});

test('journey clicks use delegated tracking and preserve legacy variant absence', () => {
  const {
    clickListener,
    gtagCalls,
    links,
  } = createTrackingHarness({
    sourcePair: 'bit-vs-beat',
    destinationPairs: ['ship-vs-sheep'],
    contentVariant: null,
  });

  clickListener({ target: links[0] });

  assert.deepEqual(gtagCalls, [
    ['event', 'contrast_journey_click', {
      source_pair: 'bit-vs-beat',
      destination_pair: 'ship-vs-sheep',
      learner_language: 'en',
      locale: 'en',
      transport_type: 'beacon',
    }],
  ]);
  assert.equal('language' in gtagCalls[0][2], false);
});

test('journey events separate learner language from localized route locale', () => {
  const {
    gtagCalls,
    list,
    observer,
  } = createTrackingHarness({
    documentLanguage: 'zh-Hans',
    pathname: '/zh/ship-vs-sheep/',
  });

  observer.callback([{ isIntersecting: true, target: list }]);

  assert.equal(gtagCalls[0][1], 'contrast_journey_view');
  assert.equal(gtagCalls[0][2].learner_language, 'zh-Hans');
  assert.equal(gtagCalls[0][2].locale, 'zh');
  assert.equal('language' in gtagCalls[0][2], false);
});

test('the SEO page adapter registers journey tracking once', () => {
  assert.equal(
    seoPageSource.split('setupContrastJourneyTracking();').length - 1,
    1
  );
});
