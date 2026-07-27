import assert from 'node:assert/strict';
import test from 'node:test';

import { setupCtaTracking } from '../src/seo-page.js';
import { getSeoExerciseCopy } from '../src/seo-exercise-translations.js';
import { createSeoExerciseSummaryCta } from '../src/seo-exercise-summary-cta.js';
import { resolveAppCapability } from '../src/app-capability-resolver.js';

class FakeElement {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.className = '';
    this.dataset = {};
    this.href = '';
    this.parentNode = null;
    this.textContent = '';
  }

  append(...children) {
    for (const child of children) {
      child.parentNode = this;
      this.children.push(child);
    }
  }

  querySelector(selector) {
    const className = selector.startsWith('.') ? selector.slice(1) : null;

    for (const child of this.children) {
      if (className && child.className.split(/\s+/).includes(className)) {
        return child;
      }

      const descendant = child.querySelector(selector);
      if (descendant) {
        return descendant;
      }
    }

    return null;
  }

  remove() {
    if (!this.parentNode) {
      return;
    }

    this.parentNode.children = this.parentNode.children.filter((child) => child !== this);
    this.parentNode = null;
  }
}

const fakeDocument = {
  createElement(tagName) {
    return new FakeElement(tagName);
  },
};

function exactCapability(locale = 'ja', pair = 'ship/sheep', contrastGroup = 'iVsI') {
  return resolveAppCapability({
    route: `/${locale}/${pair.replace('/', '-vs-')}/`,
    locale,
    flagshipPair: pair,
    contrastGroup,
  });
}

test('summary CTA is absent before completion, appears once after completion, and resets cleanly', () => {
  const container = new FakeElement('div');
  const appStoreHref = 'https://apps.apple.com/us/app/soundwise-english/id6753882308?utm_content=ship-vs-sheep';
  const controller = createSeoExerciseSummaryCta({
    document: fakeDocument,
    container,
    uiCopy: getSeoExerciseCopy('en'),
    appStoreHref,
    capability: exactCapability(),
  });

  controller.sync({ stage: 'preview', correct: 0, total: 2 });
  controller.sync({ stage: 'summary', correct: 1, total: 2 });
  assert.equal(controller.getElement(), null);
  assert.equal(container.children.length, 0);

  const firstRender = controller.show({ stage: 'summary', correct: 1, total: 2 });
  const secondRender = controller.show({ stage: 'summary', correct: 1, total: 2 });
  const link = firstRender.querySelector('.seo-exercise-summary-cta-link');

  assert.equal(firstRender, secondRender);
  assert.equal(container.children.length, 1);
  assert.equal(link.href, appStoreHref);
  assert.equal(link.dataset.ctaPosition, 'exercise-summary');
  assert.equal(link.textContent, 'Soundwiseでship vs sheepを練習する');
  assert.match(firstRender.querySelector('.seo-exercise-summary-cta-body').textContent, /1 out of 2/);

  controller.sync({ stage: 'preview', correct: 0, total: 2 });
  assert.equal(controller.getElement(), null);
  assert.equal(container.children.length, 0);
});

test('summary CTA renders perfect-score copy and localized supported copy', () => {
  const englishContainer = new FakeElement('div');
  const englishController = createSeoExerciseSummaryCta({
    document: fakeDocument,
    container: englishContainer,
    uiCopy: getSeoExerciseCopy('en'),
    appStoreHref: 'https://apps.apple.com/app/id6753882308',
    capability: exactCapability(),
  });
  const perfect = englishController.show({ stage: 'summary', correct: 2, total: 2 });

  assert.equal(
    perfect.querySelector('.seo-exercise-summary-cta-headline').textContent,
    'Keep building your listening skills'
  );
  assert.match(perfect.querySelector('.seo-exercise-summary-cta-body').textContent, /2 out of 2/);
  assert.equal(
    perfect.querySelector('.seo-exercise-summary-cta-link').textContent,
    'Soundwiseでship vs sheepを練習する'
  );

  const thaiContainer = new FakeElement('div');
  const thaiController = createSeoExerciseSummaryCta({
    document: fakeDocument,
    container: thaiContainer,
    uiCopy: getSeoExerciseCopy('th'),
    appStoreHref: 'https://apps.apple.com/app/id6753882308',
    capability: exactCapability('th', 'thin/tin', 'thetaT'),
    locale: 'th',
  });
  const localized = thaiController.show({ stage: 'summary', correct: 1, total: 2 });

  assert.equal(localized.querySelector('.seo-exercise-summary-cta-headline').textContent, 'ฝึกแยกคู่เสียงนี้ต่อ');
  assert.match(localized.querySelector('.seo-exercise-summary-cta-body').textContent, /1 จาก 2/);
});

test('summary CTA cannot render when app capability is unsupported', () => {
  const container = new FakeElement('div');
  const capability = resolveAppCapability({
    route: '/ja/heart-vs-hurt/',
    locale: 'ja',
    flagshipPair: 'heart/hurt',
    contrastGroup: 'heartVsHurt',
  });
  const controller = createSeoExerciseSummaryCta({
    document: fakeDocument,
    container,
    uiCopy: getSeoExerciseCopy('en'),
    appStoreHref: 'https://apps.apple.com/app/id6753882308',
    capability,
  });

  assert.equal(
    controller.show({ stage: 'summary', correct: 2, total: 2 }),
    null
  );
  assert.equal(container.children.length, 0);
});

test('summary CTA derives contrast-only wording from capability, not caller copy', () => {
  const container = new FakeElement('div');
  const capability = resolveAppCapability({
    route: '/ru/fill-vs-feel/',
    locale: 'ru',
    flagshipPair: 'fill/feel',
    contrastGroup: 'iVsI',
  });
  const controller = createSeoExerciseSummaryCta({
    document: fakeDocument,
    container,
    uiCopy: getSeoExerciseCopy('en'),
    appStoreHref: 'https://apps.apple.com/app/id6753882308',
    capability,
    locale: 'ru',
  });

  const rendered = controller.show({ stage: 'summary', correct: 1, total: 2 });
  const label = rendered.querySelector('.seo-exercise-summary-cta-link').textContent;

  assert.equal(label, 'Практиковать это звуковое различие в Soundwise');
  assert.doesNotMatch(label, /fill|feel/iu);
});

test('delegated App Store tracking attributes one completed summary CTA activation exactly once', () => {
  const clickListeners = [];
  const windowListeners = new Map();
  const gtagCalls = [];
  const root = {
    documentElement: { lang: 'th' },
    addEventListener(name, listener) {
      if (name === 'click') {
        clickListeners.push(listener);
      }
    },
  };
  const browserWindow = {
    location: { pathname: '/th/thin-vs-tin/' },
    addEventListener(name, listener) {
      windowListeners.set(name, listener);
    },
    gtag(...args) {
      gtagCalls.push(args);
    },
  };
  const link = {
    dataset: { ctaPosition: 'exercise-summary' },
    href: 'https://apps.apple.com/app/id6753882308?utm_content=th-thin-vs-tin',
    id: '',
    textContent: 'ฝึกต่อใน Soundwise',
    getAttribute() {
      return null;
    },
    closest(selector) {
      if (selector === 'a[href*="apps.apple.com"]') {
        return this;
      }

      return null;
    },
  };

  setupCtaTracking({ root, browserWindow });
  windowListeners.get('soundwise:demo_completed')();
  clickListeners[0]({ target: link });

  assert.equal(clickListeners.length, 1);
  assert.equal(gtagCalls.length, 1);
  assert.equal(gtagCalls[0][0], 'event');
  assert.equal(gtagCalls[0][1], 'app_store_click');
  assert.deepEqual(
    {
      page_slug: gtagCalls[0][2].page_slug,
      locale: gtagCalls[0][2].locale,
      cta_position: gtagCalls[0][2].cta_position,
      exercise_completed: gtagCalls[0][2].exercise_completed,
    },
    {
      page_slug: 'thin-vs-tin',
      locale: 'th',
      cta_position: 'exercise-summary',
      exercise_completed: true,
    }
  );
  assert.equal('content_variant' in gtagCalls[0][2], false);
});
