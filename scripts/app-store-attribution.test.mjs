import test from 'node:test';
import assert from 'node:assert/strict';

import {
  SEO_CTA_POSITIONS,
  buildSeoAppStoreAttribution,
  getSeoCtaPosition,
  getSeoPageLocale,
  getSeoPageSlug,
} from '../src/app-store-attribution.js';

function createLink({ declaredPosition, context } = {}) {
  return {
    dataset: {
      ctaPosition: declaredPosition,
    },
    closest(selector) {
      return selector === context ? {} : null;
    },
  };
}

test('SEO page identity uses the terminal slug on English and localized routes', () => {
  assert.equal(getSeoPageSlug('/ship-vs-sheep/'), 'ship-vs-sheep');
  assert.equal(getSeoPageSlug('/ja/ship-vs-sheep/'), 'ship-vs-sheep');
  assert.equal(
    getSeoPageSlug('/content/locales/ja/ship-vs-sheep/index.html'),
    'ship-vs-sheep'
  );
});

test('SEO locale uses canonical product route values', () => {
  assert.equal(getSeoPageLocale('/ship-vs-sheep/', 'en'), 'en');
  assert.equal(getSeoPageLocale('/ja/ship-vs-sheep/', 'ja'), 'ja');
  assert.equal(getSeoPageLocale('/hi-ur/vest-vs-west/', 'hi'), 'hi-ur');
  assert.equal(getSeoPageLocale('/yue/right-vs-light/', 'zh-Hant-HK'), 'yue');
  assert.equal(getSeoPageLocale('/content/locales/zh/ship-vs-sheep/index.html', 'zh-Hans'), 'zh');
});

test('CTA positions are allowlisted and inferred for legacy SEO markup', () => {
  assert.deepEqual(SEO_CTA_POSITIONS, ['hero', 'mid-content', 'post-exercise-footer']);
  assert.equal(getSeoCtaPosition(createLink({ declaredPosition: 'hero' })), 'hero');
  assert.equal(getSeoCtaPosition(createLink({ context: '.seo-nav' })), 'hero');
  assert.equal(getSeoCtaPosition(createLink({ context: '.footer' })), 'post-exercise-footer');
  assert.equal(getSeoCtaPosition(createLink()), 'mid-content');
});

test('SEO attribution reports only verified exercise completion', () => {
  const baseInput = {
    link: createLink({ declaredPosition: 'mid-content' }),
    pathname: '/ja/ship-vs-sheep/',
    documentLanguage: 'ja',
  };

  assert.deepEqual(buildSeoAppStoreAttribution(baseInput), {
    page_slug: 'ship-vs-sheep',
    locale: 'ja',
    cta_position: 'mid-content',
    exercise_completed: false,
  });

  assert.equal(
    buildSeoAppStoreAttribution({ ...baseInput, exerciseCompleted: true }).exercise_completed,
    true
  );
});
