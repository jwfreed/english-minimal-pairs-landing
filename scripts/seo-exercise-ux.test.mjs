import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { installWordAudio } from './fake-word-audio.mjs';

import {
  SEO_EXERCISE_PRESENTATION_FREEZE_ROUTES,
  isSeoExercisePresentationFrozen,
} from '../src/seo-exercise-presentation-freeze.js';
import { createExercise } from '../src/exercise-engine.js';
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
  SPEECH_PLAYBACK_TIMEOUT_MS,
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

  resolvePlayback({ stage: 'test', canAnswer: true });
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

test('Start invokes playback inside the caller gesture stack', async () => {
  const gate = createSeoExerciseInputGate();
  let inGesture = true;
  let sawGesture;
  const started = gate.start(() => {
    sawGesture = inGesture;
    return { stage: 'test', canAnswer: true };
  });
  inGesture = false;
  await started;
  assert.equal(sawGesture, true);
});

test('an end callback without a start is unavailable, never a playable stimulus', async (t) => {
  const { attempts } = installWordAudio(t);
  const playback = speakWord('ship');
  attempts[0].onend();
  assert.equal(await playback, false);
});

test('the engine rejects an answer before target playback settles, including on the homepage', async () => {
  let settle;
  const exercise = createExercise({
    contrast: { id: 'test', words: [{ text: 'ship' }, { text: 'sheep' }] },
    mount: { playWord: () => new Promise((resolve) => { settle = resolve; }) },
  });
  exercise.unlockAudio();
  const started = exercise.startRound();
  const answer = exercise.answer(0);
  assert.equal(exercise.getSnapshot().stage, 'test');
  assert.equal((await answer).accepted, false);
  assert.equal(exercise.getSnapshot().correct, 0);
  settle(false);
  await started;
  assert.equal(exercise.getSnapshot().stage, 'preview');
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
  const { attempts } = installWordAudio(t);

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

  attempts.at(-1).onstart();
  attempts.at(-1).onend();
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
    /nextButton\.addEventListener\('click', \(\) => \{\s*markInteraction\(\);\s*cancelSpeechPlayback\(\);\s*inputGate\.reset\(\);\s*exercise\.nextRound\(\);/u
  );
});

// Regression coverage for a browser that accepts play() but never reports
// onend or onerror. Before the watchdog, the exercise waited on that promise
// forever: guesses stayed disabled and the gate ignored every later Start.
function createTestExercise({ events, unavailable }) {
  const contrast = {
    id: 'ship-vs-sheep',
    words: [{ text: 'ship' }, { text: 'sheep' }],
  };

  return createExercise({
    contrast,
    mount: {
      dispatchEvent: (name) => events.push(name),
      getTargetIndex: () => 1,
      onAudioUnavailable: () => unavailable.push(true),
      playWord: (word) => speakWord(word.text, null, { timeoutMs: 20 }),
      wait: () => Promise.resolve(),
    },
  });
}

test('the default speech watchdog is long enough for one word and short enough to recover', () => {
  assert.ok(SPEECH_PLAYBACK_TIMEOUT_MS >= 3000);
  assert.ok(SPEECH_PLAYBACK_TIMEOUT_MS <= 10000);
});

test('speech that never reports completion settles as unavailable and ignores a late end', async (t) => {
  const { pauses, attempts } = installWordAudio(t);
  const button = { classList: { toggle() {} }, setAttribute() {} };

  assert.equal(await speakWord('ship', button, { timeoutMs: 10 }), false);
  assert.equal(pauses.count >= 1, true);

  // A callback arriving after the timeout must not change the settled result
  // or leave playback state behind for the next word.
  attempts[0].onend();
  const next = speakWord('sheep', button, { timeoutMs: 1000 });
  attempts[1].onstart();
  attempts[1].onend();
  assert.equal(await next, true);
});

test('a hung first word returns the learner to preview, accepts no answer, and allows retry', async (t) => {
  const { attempts } = installWordAudio(t);
  const events = [];
  const unavailable = [];
  const exercise = createTestExercise({ events, unavailable });
  const gate = createSeoExerciseInputGate();

  exercise.unlockAudio();
  const hungSnapshot = await gate.start(() => exercise.startRound());

  assert.equal(hungSnapshot.stage, 'preview');
  assert.equal(hungSnapshot.targetIndex, null);
  assert.equal(gate.areGuessesAvailable(), false);
  assert.deepEqual(unavailable, [true]);

  // An unheard stimulus is never a scoreable round.
  const rejected = await gate.answer(() => exercise.answer(1));
  assert.equal(rejected.accepted, false);
  assert.equal(exercise.getSnapshot().correct, 0);
  assert.equal(events.includes('demo_round_completed'), false);

  // Retry is possible: the gate is not stuck on the hung promise.
  const spoken = attempts.length;
  const retry = gate.start(() => exercise.startRound());
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(attempts.length, spoken + 1);
  attempts.at(-1).onstart();
  attempts.at(-1).onend();
  const retrySnapshot = await retry;

  assert.equal(retrySnapshot.stage, 'test');
  assert.equal(gate.areGuessesAvailable(), true);
});

test('a hung replay after the final answer still completes once, after both rounds were answered', async (t) => {
  const { attempts } = installWordAudio(t);
  const events = [];
  const exercise = createTestExercise({ events, unavailable: [] });

  exercise.unlockAudio();
  const answerRound = async () => {
    const started = exercise.startRound();
    await new Promise((resolve) => setImmediate(resolve));
    attempts.at(-1).onstart();
    attempts.at(-1).onend();
    await started;
    return exercise.answer(1);
  };

  assert.equal((await answerRound()).accepted, true);
  exercise.nextRound();
  const final = await answerRound();

  assert.equal(final.snapshot.stage, 'summary');
  assert.equal(events.filter((name) => name === 'demo_round_completed').length, 2);
  assert.equal(events.filter((name) => name === 'demo_completed').length, 1);
});
