import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  SEO_EXERCISE_PRESENTATION_FREEZE_ROUTES,
  isSeoExercisePresentationFrozen,
} from '../src/seo-exercise-presentation-freeze.js';
import { createSeoExerciseInputGate } from '../src/seo-exercise-input-gate.js';
import {
  SEO_PAGE_SLUGS,
  getPublishedSeoPairRoute,
} from '../src/seo-page-routes.js';
import {
  getReplayFeedbackStates,
  shouldShowWordIpa,
} from '../src/seo-exercise-presentation.js';
import {
  cancelSpeechPlayback,
  speakWord,
} from '../src/seo-page.js';

test('the conversion SERP CTA presentation freeze covers exactly its five English routes', () => {
  assert.deepEqual(SEO_EXERCISE_PRESENTATION_FREEZE_ROUTES, [
    '/bit-vs-beat/',
    '/fill-vs-feel/',
    '/ship-vs-sheep/',
    '/live-vs-leave/',
    '/sit-vs-seat/',
  ]);

  for (const pathname of SEO_EXERCISE_PRESENTATION_FREEZE_ROUTES) {
    assert.equal(isSeoExercisePresentationFrozen(pathname), true, pathname);
  }

  assert.equal(isSeoExercisePresentationFrozen('/cap-vs-cup/'), false);
  assert.equal(isSeoExercisePresentationFrozen('/ja/ship-vs-sheep/'), false);
});

test('the input gate rejects answers while target playback is pending and accepts one afterward', async () => {
  const availabilityChanges = [];
  const gate = createSeoExerciseInputGate({
    onGuessAvailabilityChange: (isAvailable) => availabilityChanges.push(isAvailable),
  });
  let resolvePlayback;
  let startCalls = 0;
  let answerCalls = 0;
  const playback = new Promise((resolve) => {
    resolvePlayback = resolve;
  });
  const startRound = () => {
    startCalls += 1;
    return playback;
  };

  const firstStart = gate.start(startRound);
  const secondStart = gate.start(startRound);
  const pendingAnswer = await gate.answer(async () => {
    answerCalls += 1;
    return { accepted: true };
  });

  assert.equal(startCalls, 1);
  assert.equal(firstStart, secondStart);
  assert.deepEqual(pendingAnswer, { accepted: false });
  assert.equal(answerCalls, 0);
  assert.equal(gate.areGuessesAvailable(), false);

  resolvePlayback({ stage: 'test' });
  await firstStart;
  assert.equal(gate.areGuessesAvailable(), true);

  const acceptedAnswer = await gate.answer(async () => {
    answerCalls += 1;
    return { accepted: true };
  });
  const duplicateAnswer = await gate.answer(async () => {
    answerCalls += 1;
    return { accepted: true };
  });

  assert.deepEqual(acceptedAnswer, { accepted: true });
  assert.deepEqual(duplicateAnswer, { accepted: false });
  assert.equal(answerCalls, 1);
  assert.deepEqual(availabilityChanges, [false, true, false]);
});

test('the input gate stays closed when target playback fails closed to preview', async () => {
  const gate = createSeoExerciseInputGate();

  await gate.start(async () => ({ stage: 'preview' }));

  assert.equal(gate.areGuessesAvailable(), false);
});

test('published pair routes resolve in the current locale without English fallback', () => {
  assert.ok(SEO_PAGE_SLUGS.includes('cap-vs-cup'));
  assert.ok(SEO_PAGE_SLUGS.includes('ja/ship-vs-sheep'));
  assert.equal(
    getPublishedSeoPairRoute({ pairId: 'cap-vs-cup', locale: 'en' }),
    '/cap-vs-cup/'
  );
  assert.equal(
    getPublishedSeoPairRoute({ pairId: 'ship-vs-sheep', locale: 'ja' }),
    '/ja/ship-vs-sheep/'
  );
  assert.equal(getPublishedSeoPairRoute({ pairId: 'bit-vs-beat', locale: 'ja' }), null);
  assert.equal(getPublishedSeoPairRoute({ pairId: 'pack-vs-back', locale: 'en' }), null);
});

test('enhanced preview and replay show IPA while guesses remain word-only', () => {
  assert.equal(shouldShowWordIpa({ action: 'preview', enhancedPresentation: true }), true);
  assert.equal(shouldShowWordIpa({ action: 'replay', enhancedPresentation: true }), true);
  assert.equal(shouldShowWordIpa({ action: 'guess', enhancedPresentation: true }), false);
  assert.equal(shouldShowWordIpa({ action: 'preview', enhancedPresentation: false }), false);
  assert.equal(shouldShowWordIpa({ action: 'replay', enhancedPresentation: false }), true);
});

test('feedback marks the correct word and only a selected wrong word', () => {
  assert.deepEqual(
    getReplayFeedbackStates({ correctWordIndex: 1, selectedIndex: 0, correct: false }, 2),
    ['selected-incorrect', 'correct']
  );
  assert.deepEqual(
    getReplayFeedbackStates({ correctWordIndex: 1, selectedIndex: 1, correct: true }, 2),
    [null, 'correct']
  );
  assert.deepEqual(getReplayFeedbackStates(null, 2), [null, null]);
});

test('superseded and explicitly cancelled speech settles without browser callbacks', async (t) => {
  const originalWindow = globalThis.window;
  const originalUtterance = globalThis.SpeechSynthesisUtterance;
  const utterances = [];
  const synthesis = {
    cancel() {},
    getVoices: () => [],
    speak(utterance) {
      utterances.push(utterance);
    },
  };

  t.after(() => {
    globalThis.window = originalWindow;
    globalThis.SpeechSynthesisUtterance = originalUtterance;
  });

  globalThis.window = { speechSynthesis: synthesis };
  globalThis.SpeechSynthesisUtterance = class {};

  const createButton = () => ({
    attributes: new Map(),
    classes: new Map(),
    classList: {
      toggle(name, enabled) {
        this.owner.classes.set(name, enabled);
      },
      owner: null,
    },
    setAttribute(name, value) {
      this.attributes.set(name, value);
    },
  });
  const firstButton = createButton();
  firstButton.classList.owner = firstButton;
  const secondButton = createButton();
  secondButton.classList.owner = secondButton;

  const firstPlayback = speakWord('full', firstButton, { automaticReplay: true });
  const secondPlayback = speakWord('fool', secondButton, { automaticReplay: true });

  assert.equal(await firstPlayback, false);
  assert.equal(firstButton.classes.get('is-auto-playing'), false);

  utterances.at(-1).onend();
  assert.equal(await secondPlayback, true);

  const cancelledPlayback = speakWord('pull', firstButton);
  cancelSpeechPlayback();
  assert.equal(await cancelledPlayback, false);
  assert.equal(firstButton.classes.get('is-playing'), false);
});

test('the SEO adapter keeps one persistent error announcement and cancels playback on Next', () => {
  const source = fs.readFileSync('src/seo-page.js', 'utf8');
  const audioStatusBlock = source.match(
    /const audioStatus = createElement\('p', \{[\s\S]*?\n  \}\);/u
  )?.[0] || '';

  assert.equal(audioStatusBlock.includes("role: 'status'"), false);
  assert.match(source, /attributes: \{ 'aria-live': 'polite' \}/u);
  assert.match(
    source,
    /onAudioUnavailable: \(\) => \{\s*audioStatus\.textContent = uiCopy\.audioUnavailable;\s*liveRegion\.textContent = uiCopy\.audioUnavailable;/u
  );
  assert.match(
    source,
    /nextButton\.addEventListener\('click', \(\) => \{\s*markInteraction\(\);\s*cancelSpeechPlayback\(\{ didPlay: true \}\);\s*inputGate\.reset\(\);\s*exercise\.nextRound\(\);/u
  );
});
