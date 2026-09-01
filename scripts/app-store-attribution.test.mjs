import test from 'node:test';
import assert from 'node:assert/strict';

import {
  SEO_CTA_POSITIONS,
  buildExerciseAttribution,
  buildHomepageAppStoreAttribution,
  buildSeoAppStoreAttribution,
  getSeoCtaPosition,
  getSeoPageLocale,
  getSeoPageSlug,
} from '../src/app-store-attribution.js';
import { CONTENT_VARIANTS } from '../src/analytics-content-variants.js';
import { setupCtaTracking } from '../src/seo-page.js';

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

function captureSeoAppStoreClick({
  pathname,
  documentLanguage,
  contentVariant,
}) {
  let clickListener;
  const gtagCalls = [];
  const root = {
    documentElement: {
      lang: documentLanguage,
      dataset: contentVariant ? { contentVariant } : {},
    },
    addEventListener(name, listener) {
      if (name === 'click') {
        clickListener = listener;
      }
    },
  };
  const browserWindow = {
    location: { pathname },
    addEventListener() {},
    gtag(...args) {
      gtagCalls.push(args);
    },
  };
  const link = {
    dataset: { ctaPosition: 'mid-content' },
    href: 'https://apps.apple.com/app/id6753882308?utm_source=website&utm_medium=seo-page&utm_campaign=minimal-pair-pages&utm_content=ship-vs-sheep',
    id: 'article-app-store-cta',
    textContent: 'Soundwise App',
    getAttribute() {
      return null;
    },
    closest(selector) {
      return selector === 'a[href*="apps.apple.com"]' ? this : null;
    },
  };

  setupCtaTracking({ root, browserWindow });
  clickListener({ target: link });

  return gtagCalls[0];
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
  assert.deepEqual(SEO_CTA_POSITIONS, [
    'hero',
    'mid-content',
    'post-interaction',
    'exercise-summary',
    'post-exercise-footer',
  ]);
  assert.equal(getSeoCtaPosition(createLink({ declaredPosition: 'hero' })), 'hero');
  assert.equal(
    getSeoCtaPosition(createLink({ declaredPosition: 'exercise-summary' })),
    'exercise-summary'
  );
  assert.equal(
    getSeoCtaPosition(createLink({ declaredPosition: 'post-interaction' })),
    'post-interaction'
  );
  assert.equal(getSeoCtaPosition(createLink({ context: '.seo-nav' })), 'hero');
  assert.equal(getSeoCtaPosition(createLink({ context: '.footer' })), 'post-exercise-footer');
  assert.equal(getSeoCtaPosition(createLink()), 'mid-content');
});

test('SEO attribution preserves learner language and verified exercise completion', () => {
  const baseInput = {
    link: createLink({ declaredPosition: 'mid-content' }),
    pathname: '/zh/ship-vs-sheep/',
    documentLanguage: 'zh-Hans',
  };

  assert.deepEqual(buildSeoAppStoreAttribution(baseInput), {
    page_slug: 'ship-vs-sheep',
    learner_language: 'zh-Hans',
    locale: 'zh',
    cta_position: 'mid-content',
    exercise_completed: false,
  });

  assert.equal(
    buildSeoAppStoreAttribution({ ...baseInput, exerciseCompleted: true }).exercise_completed,
    true
  );

  assert.deepEqual(
    buildSeoAppStoreAttribution({
      ...baseInput,
      contentVariant: CONTENT_VARIANTS.CONTRAST_JOURNEY_V1,
    }),
    {
      page_slug: 'ship-vs-sheep',
      learner_language: 'zh-Hans',
      locale: 'zh',
      cta_position: 'mid-content',
      exercise_completed: false,
      content_variant: CONTENT_VARIANTS.CONTRAST_JOURNEY_V1,
    }
  );
  assert.equal('language' in buildSeoAppStoreAttribution(baseInput), false);
});

test('homepage attribution separates active language from canonical route locale', () => {
  const baseInput = {
    link: createLink({ declaredPosition: 'exercise-summary' }),
    pathname: '/',
    documentLanguage: 'en',
    language: 'ja',
  };

  assert.deepEqual(buildHomepageAppStoreAttribution(baseInput), {
    page_slug: 'homepage',
    learner_language: 'ja',
    locale: 'en',
    cta_position: 'exercise-summary',
    exercise_completed: false,
  });

  assert.deepEqual(
    buildHomepageAppStoreAttribution({
      ...baseInput,
      pathname: '/ja/',
      documentLanguage: 'ja',
      exerciseCompleted: true,
    }),
    {
      page_slug: 'homepage',
      learner_language: 'ja',
      locale: 'ja',
      cta_position: 'exercise-summary',
      exercise_completed: true,
    }
  );
  assert.equal('language' in buildHomepageAppStoreAttribution(baseInput), false);
});

test('exercise attribution reports page context and lifecycle completion', () => {
  const baseInput = {
    pageSlug: 'ship-vs-sheep',
    locale: 'ja',
  };

  assert.deepEqual(buildExerciseAttribution({ ...baseInput, eventName: 'demo_started' }), {
    page_slug: 'ship-vs-sheep',
    locale: 'ja',
    exercise_completed: false,
  });
  assert.equal('cta_position' in buildExerciseAttribution({ ...baseInput, eventName: 'demo_started' }), false);

  assert.deepEqual(buildExerciseAttribution({ ...baseInput, eventName: 'demo_completed' }), {
    page_slug: 'ship-vs-sheep',
    locale: 'ja',
    exercise_completed: true,
  });
  assert.equal('cta_position' in buildExerciseAttribution({ ...baseInput, eventName: 'demo_completed' }), false);

  assert.equal(
    buildExerciseAttribution({ ...baseInput, eventName: 'challenge_completed' }).exercise_completed,
    true
  );

  assert.deepEqual(
    buildExerciseAttribution({
      ...baseInput,
      eventName: 'demo_started',
      contentVariant: CONTENT_VARIANTS.CONTRAST_JOURNEY_V1,
    }),
    {
      page_slug: 'ship-vs-sheep',
      locale: 'ja',
      exercise_completed: false,
      content_variant: CONTENT_VARIANTS.CONTRAST_JOURNEY_V1,
    }
  );
});

test('App Store click events tag only the registered experiment page', () => {
  const experimentCall = captureSeoAppStoreClick({
    pathname: '/ship-vs-sheep/',
    documentLanguage: 'en',
    contentVariant: CONTENT_VARIANTS.CONTRAST_JOURNEY_V1,
  });
  const legacyCall = captureSeoAppStoreClick({
    pathname: '/bit-vs-beat/',
    documentLanguage: 'en',
  });

  assert.equal(experimentCall[0], 'event');
  assert.equal(experimentCall[1], 'app_store_click');
  assert.equal(
    experimentCall[2].link_url,
    'https://apps.apple.com/app/id6753882308?utm_source=website&utm_medium=seo-page&utm_campaign=minimal-pair-pages&utm_content=ship-vs-sheep'
  );
  assert.deepEqual(
    {
      page_slug: experimentCall[2].page_slug,
      learner_language: experimentCall[2].learner_language,
      locale: experimentCall[2].locale,
      cta_position: experimentCall[2].cta_position,
      exercise_completed: experimentCall[2].exercise_completed,
      content_variant: experimentCall[2].content_variant,
    },
    {
      page_slug: 'ship-vs-sheep',
      learner_language: 'en',
      locale: 'en',
      cta_position: 'mid-content',
      exercise_completed: false,
      content_variant: CONTENT_VARIANTS.CONTRAST_JOURNEY_V1,
    }
  );

  assert.equal(legacyCall[1], 'app_store_click');
  assert.deepEqual(
    {
      page_slug: legacyCall[2].page_slug,
      learner_language: legacyCall[2].learner_language,
      locale: legacyCall[2].locale,
      cta_position: legacyCall[2].cta_position,
      exercise_completed: legacyCall[2].exercise_completed,
    },
    {
      page_slug: 'bit-vs-beat',
      learner_language: 'en',
      locale: 'en',
      cta_position: 'mid-content',
      exercise_completed: false,
    }
  );
  assert.equal('language' in experimentCall[2], false);
  assert.equal('language' in legacyCall[2], false);
  assert.equal('content_variant' in legacyCall[2], false);
});
