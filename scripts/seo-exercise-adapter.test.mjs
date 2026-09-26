import assert from 'node:assert/strict';
import test from 'node:test';

import { getContrastById } from '../src/contrast-catalog.js';
import { getSeoExerciseCopy } from '../src/seo-exercise-translations.js';
import {
  createSeoExercise,
  focusSeoExerciseTarget,
} from '../src/seo-page.js';

function dataKey(attributeName) {
  return attributeName
    .slice(5)
    .replace(/-([a-z])/gu, (_, letter) => letter.toUpperCase());
}

class FakeClassList {
  constructor(element) {
    this.element = element;
  }

  values() {
    return this.element.className.split(/\s+/u).filter(Boolean);
  }

  add(...names) {
    this.element.className = [...new Set([...this.values(), ...names])].join(' ');
  }

  remove(...names) {
    this.element.className = this.values().filter((name) => !names.includes(name)).join(' ');
  }

  contains(name) {
    return this.values().includes(name);
  }

  toggle(name, force) {
    const shouldAdd = force === undefined ? !this.contains(name) : force;
    if (shouldAdd) {
      this.add(name);
    } else {
      this.remove(name);
    }
    return shouldAdd;
  }
}

function matchesSelector(element, selector) {
  const classNames = [...selector.matchAll(/\.([\w-]+)/gu)].map((match) => match[1]);
  if (classNames.some((className) => !element.classList.contains(className))) {
    return false;
  }

  const tagName = selector.match(/^[a-z][\w-]*/iu)?.[0];
  if (tagName && element.tagName !== tagName.toUpperCase()) {
    return false;
  }

  const attributes = [...selector.matchAll(/\[([\w-]+)(?:([*]?=)["']?([^\]"']+)["']?)?\]/gu)];
  return attributes.every(([, name, operator, expected]) => {
    const actual = element.getAttribute(name);
    if (!operator) {
      return actual !== null;
    }
    if (operator === '*=') {
      return actual?.includes(expected) ?? false;
    }
    return actual === expected;
  });
}

class FakeElement {
  constructor(tagName, ownerDocument) {
    this.tagName = tagName.toUpperCase();
    this.ownerDocument = ownerDocument;
    this.children = [];
    this.parentNode = null;
    this.className = '';
    this.classList = new FakeClassList(this);
    this.dataset = {};
    this.attributes = new Map();
    this.hidden = false;
    this.id = '';
    this.href = '';
    this._textContent = '';
    this.listeners = new Map();
  }

  get textContent() {
    return this._textContent + this.children.map((child) => child.textContent).join('');
  }

  set textContent(value) {
    this._textContent = String(value ?? '');
    this.children = [];
  }

  append(...children) {
    for (const child of children) {
      child.parentNode = this;
      this.children.push(child);
    }
  }

  replaceChildren(...children) {
    this.children.forEach((child) => {
      child.parentNode = null;
    });
    this.children = [];
    this._textContent = '';
    this.append(...children);
  }

  remove() {
    if (!this.parentNode) {
      return;
    }
    this.parentNode.children = this.parentNode.children.filter((child) => child !== this);
    this.parentNode = null;
  }

  setAttribute(name, value) {
    const normalizedValue = String(value);
    this.attributes.set(name, normalizedValue);
    if (name === 'id') {
      this.id = normalizedValue;
    } else if (name === 'href') {
      this.href = normalizedValue;
    } else if (name === 'hidden') {
      this.hidden = true;
    } else if (name.startsWith('data-')) {
      this.dataset[dataKey(name)] = normalizedValue;
    }
  }

  getAttribute(name) {
    if (name === 'id' && this.id) {
      return this.id;
    }
    if (name === 'href' && this.href) {
      return this.href;
    }
    return this.attributes.get(name) ?? null;
  }

  removeAttribute(name) {
    this.attributes.delete(name);
    if (name === 'hidden') {
      this.hidden = false;
    } else if (name.startsWith('data-')) {
      delete this.dataset[dataKey(name)];
    }
  }

  matches(selector) {
    return matchesSelector(this, selector);
  }

  querySelectorAll(selector) {
    const matches = [];
    for (const child of this.children) {
      if (child.matches(selector)) {
        matches.push(child);
      }
      matches.push(...child.querySelectorAll(selector));
    }
    return matches;
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  closest(selector) {
    let candidate = this;
    while (candidate) {
      if (candidate.matches(selector)) {
        return candidate;
      }
      candidate = candidate.parentNode;
    }
    return null;
  }

  addEventListener(name, listener) {
    const listeners = this.listeners.get(name) || [];
    listeners.push(listener);
    this.listeners.set(name, listeners);
  }

  async click() {
    const event = {
      target: this,
      preventDefault() {},
    };
    let current = this;
    while (current) {
      for (const listener of current.listeners.get('click') || []) {
        await listener.call(current, event);
      }
      current = current.parentNode;
    }
  }

  focus() {
    this.ownerDocument.activeElement = this;
  }
}

function createEnvironment(pathname) {
  const root = new FakeElement('body', null);
  const document = {
    activeElement: null,
    documentElement: {
      dataset: {},
      lang: 'en',
    },
    createElement(tagName) {
      return new FakeElement(tagName, document);
    },
    querySelector(selector) {
      return root.querySelector(selector);
    },
  };
  root.ownerDocument = document;
  const spoken = [];
  const speechSynthesis = {
    cancel() {},
    getVoices: () => [],
    speak(utterance) {
      spoken.push(utterance.text);
      queueMicrotask(() => utterance.onend?.());
    },
  };
  const window = {
    location: { pathname },
    speechSynthesis,
    dispatchEvent() {},
    setTimeout(callback) {
      queueMicrotask(callback);
      return 1;
    },
  };

  return { document, root, spoken, window };
}

function findButton(mount, text) {
  return mount.querySelectorAll('button').find((button) => button.textContent.includes(text));
}

function installEnvironment(t, pathname) {
  const originals = {
    CustomEvent: globalThis.CustomEvent,
    SpeechSynthesisUtterance: globalThis.SpeechSynthesisUtterance,
    document: globalThis.document,
    window: globalThis.window,
  };
  const environment = createEnvironment(pathname);

  globalThis.document = environment.document;
  globalThis.window = environment.window;
  globalThis.CustomEvent = class {
    constructor(name, options) {
      this.type = name;
      this.detail = options?.detail;
    }
  };
  globalThis.SpeechSynthesisUtterance = class {
    constructor(text) {
      this.text = text;
    }
  };

  t.after(() => {
    Object.assign(globalThis, originals);
  });

  return environment;
}

test('rendered multi-pair adapter preserves its header and performs every focus transition', async (t) => {
  const { document } = installEnvironment(t, '/full-vs-fool/');
  const originalRandom = Math.random;
  Math.random = () => 1;
  t.after(() => {
    Math.random = originalRandom;
  });

  const mount = document.createElement('div');
  mount.setAttribute('data-exercise', '');
  mount.setAttribute('data-contrast', 'full-vs-fool');
  const entryPair = getContrastById('full-vs-fool');
  const secondPair = getContrastById('pull-vs-pool');
  const uiCopy = getSeoExerciseCopy('en');

  createSeoExercise(
    mount,
    entryPair,
    null,
    uiCopy,
    [entryPair, secondPair],
    'en'
  );

  const title = mount.querySelector('.seo-exercise-title');
  const chip = mount.querySelector('.seo-exercise-contrast-chip');
  assert.equal(title.textContent, 'FULL / FOOL');
  assert.equal(chip.textContent, '/ʊ/ vs /uː/');

  focusSeoExerciseTarget(mount);
  assert.equal(document.activeElement, title);

  await findButton(mount, uiCopy.startButton).click();
  assert.equal(document.activeElement, mount.querySelector('button[data-action="guess"]'));

  await mount.querySelector('button[data-action="guess"]').click();
  assert.equal(document.activeElement, findButton(mount, uiCopy.nextButton));
  assert.equal(mount.querySelectorAll('.seo-exercise-word-feedback-marker').length, 2);

  await findButton(mount, uiCopy.nextButton).click();
  const roundTwoPreview = mount.querySelectorAll('button[data-action="preview"]');
  assert.equal(document.activeElement, roundTwoPreview[0]);
  assert.deepEqual(roundTwoPreview.map((button) => button.textContent), [
    'ListenPULL/pʊl/',
    'ListenPOOL/puːl/',
  ]);
  assert.equal(title.textContent, 'FULL / FOOL');
  assert.equal(chip.textContent, '/ʊ/ vs /uː/');

  await findButton(mount, uiCopy.startButton).click();
  await mount.querySelector('button[data-action="guess"]').click();
  assert.equal(document.activeElement, mount.querySelector('.seo-exercise-summary-lead'));
});

test('rendered frozen routes retain legacy presentation while invisible protections remain', async (t) => {
  const { document } = installEnvironment(t, '/bit-vs-beat/');
  const mount = document.createElement('div');
  mount.setAttribute('data-exercise', '');
  mount.setAttribute('data-contrast', 'bit-vs-beat');

  const uiCopy = getSeoExerciseCopy('en');

  createSeoExercise(
    mount,
    getContrastById('bit-vs-beat'),
    null,
    uiCopy
  );

  assert.equal(mount.querySelector('.seo-exercise-contrast-chip'), null);
  assert.ok(mount.querySelector('.seo-exercise-contrast'));
  assert.ok(
    mount.querySelectorAll('button[data-action="preview"]')
      .every((button) => !button.querySelector('.seo-exercise-word-ipa'))
  );
  assert.ok(
    mount.querySelectorAll('button[data-action="replay"]')
      .every((button) => button.querySelector('.seo-exercise-word-ipa'))
  );

  const startPromise = findButton(mount, uiCopy.startButton).click();
  assert.ok(
    mount.querySelectorAll('button[data-action="guess"]')
      .every((button) => button.getAttribute('aria-disabled') === 'true')
  );
  await startPromise;
  assert.ok(
    mount.querySelectorAll('button[data-action="guess"]')
      .every((button) => button.getAttribute('aria-disabled') === 'false')
  );

  await mount.querySelector('button[data-action="guess"]').click();
  assert.equal(mount.querySelectorAll('.seo-exercise-word-feedback-marker').length, 0);
});
