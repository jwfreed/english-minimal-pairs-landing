import assert from 'node:assert/strict';
import test from 'node:test';

import { getContrastById } from '../src/contrast-catalog.js';
import { createExercise } from '../src/exercise-engine.js';
import setupFunnelTracking from '../src/funnel-tracking.js';
import { createSeoExerciseInputGate } from '../src/seo-exercise-input-gate.js';
import {
  SPEECH_PLAYBACK_TIMEOUT_MS,
  cancelSpeechPlayback,
  speakWord,
} from '../src/seo-page.js';

// Release Check 1: the exercise must stay correct when browser speech synthesis
// misbehaves. The harness wires the same pieces seo-page.js wires (engine,
// input gate, speakWord, funnel tracking) and drives them with a manual speech
// stub and mock timers, then asserts on externally observable behaviour:
// scores, rounds, stage, accepted answers, and event counts.
//
// Both subjects use the same shared code path: the English hub mounts
// ship-vs-sheep, and bad-vs-bed is an existing English pair page.
const SUBJECTS = [
  { label: 'hub exercise (ship-vs-sheep)', contrastId: 'ship-vs-sheep' },
  { label: 'pair-page exercise (bad-vs-bed)', contrastId: 'bad-vs-bed' },
];

const flush = () => new Promise((resolve) => setImmediate(resolve));

function createLifecycle(t, contrastId) {
  t.mock.timers.enable({ apis: ['setTimeout'] });

  const originalWindow = globalThis.window;
  const originalUtterance = globalThis.SpeechSynthesisUtterance;
  const utterances = [];
  const listeners = new Map();
  const dispatched = [];
  const gtagEvents = [];
  const unavailable = { count: 0 };
  const cancelCalls = { count: 0 };
  let guessesAvailable = false;

  globalThis.window = {
    speechSynthesis: {
      cancel() {
        cancelCalls.count += 1;
      },
      getVoices: () => [],
      speak(utterance) {
        utterances.push(utterance);
      },
    },
    addEventListener(name, listener) {
      listeners.set(name, listener);
    },
    dispatchEvent(event) {
      dispatched.push(event.type.replace('soundwise:', ''));
      listeners.get(event.type)?.(event);
      return true;
    },
    gtag(_command, name) {
      gtagEvents.push(name);
    },
  };
  globalThis.SpeechSynthesisUtterance = class {
    constructor(text) {
      this.text = text;
    }
  };
  t.after(() => {
    cancelSpeechPlayback();
    globalThis.window = originalWindow;
    globalThis.SpeechSynthesisUtterance = originalUtterance;
  });

  setupFunnelTracking();

  const gate = createSeoExerciseInputGate({
    onGuessAvailabilityChange: (isAvailable) => {
      guessesAvailable = isAvailable;
    },
  });
  const exercise = createExercise({
    contrast: getContrastById(contrastId),
    mount: {
      getTargetIndex: () => 1,
      onAudioUnavailable: () => {
        unavailable.count += 1;
      },
      playWord: (word) => speakWord(word.text, null),
      wait: () => Promise.resolve(),
    },
  });

  // Mirrors the handlers in createSeoExercise (seo-page.js).
  const actions = {
    start() {
      exercise.unlockAudio();
      return gate.start(() => exercise.startRound(null));
    },
    guess(index) {
      return gate.answer(() => exercise.answer(index));
    },
    next() {
      cancelSpeechPlayback();
      gate.reset();
      return exercise.nextRound();
    },
    playSample() {
      const { targetIndex } = exercise.getSnapshot();
      return targetIndex === null ? null : exercise.playWord(targetIndex, null);
    },
    listen(index) {
      return exercise.playWord(index, null);
    },
  };

  // Answers every not-yet-handled utterance according to `policy` until the
  // promise settles or nothing more can happen. 'hang' leaves it unanswered.
  const pump = async (promise, policy = () => 'end') => {
    let done = false;
    let value;
    promise.then((result) => {
      done = true;
      value = result;
    });

    for (let i = 0; i < 30 && !done; i += 1) {
      await flush();
      for (const utterance of utterances) {
        if (utterance.handled) {
          continue;
        }

        utterance.handled = true;
        const outcome = policy(utterance);
        if (outcome === 'end') {
          utterance.onstart();
          utterance.onend();
        } else if (outcome === 'error') {
          utterance.onerror();
        }
      }
    }

    await flush();
    return { done, value };
  };

  const counts = () => ({
    started: dispatched.filter((name) => name === 'demo_started').length,
    rounds: dispatched.filter((name) => name === 'demo_round_completed').length,
    completed: dispatched.filter((name) => name === 'demo_completed').length,
  });

  return {
    actions,
    cancelCalls,
    counts,
    exercise,
    gtagEvents,
    guessesAvailable: () => guessesAvailable,
    pump,
    snapshot: () => exercise.getSnapshot(),
    t,
    unavailable,
    utterances,
  };
}

// Plays round `round` normally and answers it. Returns the answer result.
async function playRound(lifecycle, { correct = true } = {}) {
  const started = lifecycle.actions.start();
  await lifecycle.pump(started);
  const { targetIndex } = lifecycle.snapshot();
  const picked = correct ? targetIndex : 1 - targetIndex;
  const answered = lifecycle.actions.guess(picked);
  return (await lifecycle.pump(answered)).value;
}

for (const { label, contrastId } of SUBJECTS) {
  test(`${label}: end without start never opens answering, and double-tap retry stays in the same round`, async (t) => {
    const lc = createLifecycle(t, contrastId);
    const first = lc.actions.start();
    assert.equal(lc.utterances.length, 1); // No asynchronous hop before speak().
    lc.utterances[0].onend();
    await first;
    assert.equal(lc.snapshot().stage, 'preview');
    assert.equal(lc.guessesAvailable(), false);
    assert.equal((await lc.exercise.answer(0)).accepted, false);
    const retry = lc.actions.start();
    const duplicate = lc.actions.start();
    assert.equal(retry, duplicate);
    assert.equal(lc.utterances.length, 2);
    lc.utterances[1].onstart();
    assert.equal((await lc.exercise.answer(0)).accepted, false);
    lc.utterances[1].onend();
    await retry;
    assert.equal(lc.snapshot().canAnswer, true);
    assert.equal(lc.snapshot().round, 1);
    assert.deepEqual(lc.gtagEvents, ['exercise_start']);
  });

  test(`${label}: a failed target replay closes answering and permits an unscored retry`, async (t) => {
    const lc = createLifecycle(t, contrastId);
    await lc.pump(lc.actions.start());
    const replay = lc.actions.playSample();
    assert.equal((await lc.exercise.answer(0)).accepted, false);
    await lc.pump(replay, () => 'error');
    assert.equal(lc.snapshot().stage, 'preview');
    assert.equal(lc.snapshot().correct, 0);
    assert.equal(lc.snapshot().round, 1);
    await lc.pump(lc.actions.start());
    assert.equal(lc.snapshot().canAnswer, true);
    assert.deepEqual(lc.gtagEvents, ['exercise_start']);
  });

  test(`${label}: normal audio completes both rounds once and scores them`, async (t) => {
    const lc = createLifecycle(t, contrastId);

    assert.equal((await playRound(lc)).accepted, true);
    assert.equal(lc.snapshot().stage, 'feedback');
    lc.actions.next();
    assert.equal(lc.snapshot().round, 2);
    assert.equal((await playRound(lc, { correct: false })).accepted, true);

    assert.equal(lc.snapshot().stage, 'summary');
    assert.equal(lc.snapshot().correct, 1);
    assert.deepEqual(lc.counts(), { started: 2, rounds: 2, completed: 1 });
    assert.deepEqual(lc.gtagEvents, ['exercise_start', 'exercise_complete']);
  });

  test(`${label}: A/B - a hung first word is never scored and the timeout does not answer or advance`, async (t) => {
    const lc = createLifecycle(t, contrastId);
    const started = lc.actions.start();

    await lc.pump(started, () => 'hang');
    assert.equal(lc.snapshot().stage, 'test');
    assert.equal(lc.guessesAvailable(), false);
    assert.deepEqual(await lc.actions.guess(0), { accepted: false });

    t.mock.timers.tick(SPEECH_PLAYBACK_TIMEOUT_MS - 1);
    assert.equal((await lc.pump(started, () => 'hang')).done, false);

    t.mock.timers.tick(1);
    const result = await lc.pump(started, () => 'hang');
    assert.equal(result.done, true);

    const snapshot = lc.snapshot();
    assert.equal(snapshot.stage, 'preview');
    assert.equal(snapshot.targetIndex, null);
    assert.equal(snapshot.round, 1);
    assert.equal(snapshot.correct, 0);
    assert.equal(lc.guessesAvailable(), false);
    assert.equal(lc.unavailable.count, 1);
    assert.deepEqual(await lc.actions.guess(0), { accepted: false });
    assert.equal((await lc.exercise.answer(0)).accepted, false);
    assert.deepEqual(lc.counts(), { started: 1, rounds: 0, completed: 0 });
    assert.deepEqual(lc.gtagEvents, ['exercise_start']);
  });

  test(`${label}: a reported playback error is recoverable, unscored, and leaves no live watchdog`, async (t) => {
    const lc = createLifecycle(t, contrastId);

    const result = await lc.pump(lc.actions.start(), () => 'error');
    assert.equal(result.done, true);
    assert.equal(lc.snapshot().stage, 'preview');
    assert.equal(lc.snapshot().correct, 0);
    assert.equal(lc.unavailable.count, 1);

    t.mock.timers.tick(SPEECH_PLAYBACK_TIMEOUT_MS * 2);
    await flush();
    assert.equal(lc.unavailable.count, 1);
    assert.deepEqual(lc.counts(), { started: 1, rounds: 0, completed: 0 });
  });

  test(`${label}: C - late onend and onerror after the timeout are ignored`, async (t) => {
    const lc = createLifecycle(t, contrastId);
    const started = lc.actions.start();
    await lc.pump(started, () => 'hang');
    t.mock.timers.tick(SPEECH_PLAYBACK_TIMEOUT_MS);
    await lc.pump(started, () => 'hang');
    const before = {
      snapshot: lc.snapshot(),
      counts: lc.counts(),
      gtag: [...lc.gtagEvents],
      spoken: lc.utterances.length,
      unavailable: lc.unavailable.count,
    };

    const [stale] = lc.utterances;
    stale.onend();
    stale.onerror();
    stale.onend();
    await flush();

    assert.deepEqual(lc.snapshot(), before.snapshot);
    assert.deepEqual(lc.counts(), before.counts);
    assert.deepEqual(lc.gtagEvents, before.gtag);
    assert.equal(lc.utterances.length, before.spoken);
    assert.equal(lc.unavailable.count, before.unavailable);
    assert.equal(lc.guessesAvailable(), false);
  });

  test(`${label}: E - retry after failure keeps the round; a stale callback cannot settle the new attempt; later rounds and the score stay correct`, async (t) => {
    const lc = createLifecycle(t, contrastId);
    const failed = lc.actions.start();
    await lc.pump(failed, () => 'hang');
    t.mock.timers.tick(SPEECH_PLAYBACK_TIMEOUT_MS);
    await lc.pump(failed, () => 'hang');
    const [stale] = lc.utterances;

    const retry = lc.actions.start();
    await flush();
    assert.equal(lc.utterances.length, 2);
    assert.equal(lc.snapshot().stage, 'test');

    // The old attempt's callbacks arrive while the new playback is pending.
    stale.onend();
    stale.onerror();
    await flush();
    assert.equal((await lc.pump(retry, () => 'hang')).done, false);
    assert.equal(lc.guessesAvailable(), false);
    assert.equal(lc.snapshot().stage, 'test');

    lc.utterances[1].onstart();
    lc.utterances[1].onend();
    assert.equal((await lc.pump(retry)).done, true);
    assert.equal(lc.snapshot().round, 1);
    assert.equal(lc.snapshot().stage, 'test');
    assert.equal(lc.guessesAvailable(), true);

    const { targetIndex } = lc.snapshot();
    assert.equal((await lc.pump(lc.actions.guess(targetIndex))).value.accepted, true);
    assert.equal(lc.snapshot().correct, 1);
    lc.actions.next();

    // Round 2 fails once, is retried, and is answered wrongly.
    const failedRound2 = lc.actions.start();
    await lc.pump(failedRound2, () => 'hang');
    t.mock.timers.tick(SPEECH_PLAYBACK_TIMEOUT_MS);
    await lc.pump(failedRound2, () => 'hang');
    assert.equal(lc.snapshot().round, 2);
    assert.equal(lc.snapshot().stage, 'preview');
    assert.equal(lc.snapshot().correct, 1);

    await lc.pump(lc.actions.start());
    const { targetIndex: target2 } = lc.snapshot();
    await lc.pump(lc.actions.guess(1 - target2));

    assert.equal(lc.snapshot().stage, 'summary');
    assert.equal(lc.snapshot().correct, 1);
    assert.deepEqual(lc.counts(), { started: 4, rounds: 2, completed: 1 });
    assert.deepEqual(lc.gtagEvents, ['exercise_start', 'exercise_complete']);
  });

  test(`${label}: D - a hung final replay still shows the summary and completes exactly once`, async (t) => {
    const lc = createLifecycle(t, contrastId);
    await playRound(lc);
    lc.actions.next();

    await lc.pump(lc.actions.start());
    const { targetIndex } = lc.snapshot();
    const spokenBefore = lc.utterances.length;
    const final = lc.actions.guess(targetIndex);
    await lc.pump(final, () => 'hang');

    // The answer was submitted: the summary is already showing, the score is
    // final, and completion has not been reported while the replay is stuck.
    assert.equal(lc.snapshot().stage, 'summary');
    assert.equal(lc.snapshot().correct, 2);
    assert.equal(lc.counts().completed, 0);
    assert.deepEqual(lc.gtagEvents, ['exercise_start']);

    t.mock.timers.tick(SPEECH_PLAYBACK_TIMEOUT_MS);
    assert.equal((await lc.pump(final, () => 'hang')).done, true);
    assert.deepEqual(lc.counts(), { started: 2, rounds: 2, completed: 1 });
    assert.deepEqual(lc.gtagEvents, ['exercise_start', 'exercise_complete']);
    // A stuck first replay word ends the replay; it does not retry or skip on.
    assert.equal(lc.utterances.length, spokenBefore + 1);

    const stale = lc.utterances.at(-1);
    stale.onend();
    stale.onerror();
    await flush();
    assert.equal(lc.snapshot().stage, 'summary');
    assert.equal(lc.snapshot().correct, 2);
    assert.deepEqual(lc.counts(), { started: 2, rounds: 2, completed: 1 });
    assert.deepEqual(lc.gtagEvents, ['exercise_start', 'exercise_complete']);
    assert.deepEqual(await lc.actions.guess(0), { accepted: false });
  });

  test(`${label}: C - repeated terminal callbacks and double clicks cause one transition each`, async (t) => {
    const lc = createLifecycle(t, contrastId);
    const started = lc.actions.start();
    await flush();
    const first = lc.utterances[0];
    first.onstart();
    first.onend();
    first.onerror();
    first.onend();
    assert.equal((await lc.pump(started)).done, true);
    assert.equal(lc.snapshot().stage, 'test');
    assert.equal(lc.counts().started, 1);

    const { targetIndex } = lc.snapshot();
    const firstGuess = lc.actions.guess(targetIndex);
    const secondGuess = lc.actions.guess(targetIndex);
    assert.deepEqual(await secondGuess, { accepted: false });

    const noisy = (utterance) => {
      utterance.onstart();
      utterance.onend();
      utterance.onerror();
      utterance.onend();
      return 'handled';
    };
    assert.equal((await lc.pump(firstGuess, noisy)).value.accepted, true);
    assert.equal(lc.snapshot().correct, 1);
    assert.equal(lc.counts().rounds, 1);

    lc.actions.next();
    lc.actions.next();
    assert.equal(lc.snapshot().round, 2);

    await lc.pump(lc.actions.start(), noisy);
    const { targetIndex: target2 } = lc.snapshot();
    await lc.pump(lc.actions.guess(target2), noisy);
    assert.equal(lc.snapshot().stage, 'summary');
    assert.equal(lc.snapshot().correct, 2);
    assert.deepEqual(lc.counts(), { started: 2, rounds: 2, completed: 1 });
    assert.deepEqual(lc.gtagEvents, ['exercise_start', 'exercise_complete']);
  });

  test(`${label}: interrupting the first word with Play the sample never scores or advances`, async (t) => {
    const lc = createLifecycle(t, contrastId);
    const started = lc.actions.start();
    await flush();
    assert.equal(lc.snapshot().stage, 'test');

    // The sample button supersedes the pending first playback.
    const sample = lc.actions.playSample();
    const result = await lc.pump(started, () => 'end');
    await lc.pump(sample);

    assert.equal(result.done, true);
    assert.equal(lc.snapshot().stage, 'preview');
    assert.equal(lc.snapshot().targetIndex, null);
    assert.equal(lc.snapshot().correct, 0);
    assert.equal(lc.snapshot().round, 1);
    assert.equal(lc.guessesAvailable(), false);
    assert.deepEqual(await lc.actions.guess(0), { accepted: false });
    assert.deepEqual(lc.counts(), { started: 1, rounds: 0, completed: 0 });

    await lc.pump(lc.actions.start());
    assert.equal(lc.snapshot().stage, 'test');
    assert.equal(lc.guessesAvailable(), true);
  });

  test(`${label}: Next during a feedback replay advances once and the cancelled replay cannot affect round 2`, async (t) => {
    const lc = createLifecycle(t, contrastId);
    await lc.pump(lc.actions.start());
    const { targetIndex } = lc.snapshot();
    const answered = lc.actions.guess(targetIndex);
    await lc.pump(answered, () => 'hang');
    assert.equal(lc.snapshot().stage, 'feedback');

    lc.actions.next();
    assert.equal((await lc.pump(answered, () => 'hang')).done, true);
    assert.equal(lc.snapshot().round, 2);
    assert.equal(lc.snapshot().stage, 'preview');
    assert.equal(lc.snapshot().correct, 1);
    assert.equal(lc.counts().completed, 0);

    const stale = lc.utterances.at(-1);
    stale.onend();
    stale.onerror();
    await flush();
    assert.equal(lc.snapshot().round, 2);
    assert.equal(lc.counts().rounds, 1);

    await playRound(lc);
    assert.equal(lc.snapshot().stage, 'summary');
    assert.equal(lc.snapshot().correct, 2);
    assert.deepEqual(lc.counts(), { started: 2, rounds: 2, completed: 1 });
  });

  test(`${label}: D - interrupting the final replay with a Listen button still completes once`, async (t) => {
    const lc = createLifecycle(t, contrastId);
    await playRound(lc);
    lc.actions.next();
    await lc.pump(lc.actions.start());
    const { targetIndex } = lc.snapshot();
    const final = lc.actions.guess(targetIndex);
    await lc.pump(final, () => 'hang');
    assert.equal(lc.counts().completed, 0);

    const listen = lc.actions.listen(0);
    assert.equal((await lc.pump(final, () => 'hang')).done, true);
    await lc.pump(listen);

    assert.equal(lc.snapshot().stage, 'summary');
    assert.equal(lc.snapshot().correct, 2);
    assert.deepEqual(lc.counts(), { started: 2, rounds: 2, completed: 1 });
    assert.deepEqual(lc.gtagEvents, ['exercise_start', 'exercise_complete']);
  });
}

test('a finished playback leaves no watchdog behind to cancel or time out a later playback', async (t) => {
  const lc = createLifecycle(t, 'ship-vs-sheep');
  await lc.pump(lc.actions.start());
  assert.equal(lc.snapshot().stage, 'test');
  const cancelsBefore = lc.cancelCalls.count;

  // The first word finished at t=0. Its 6 s watchdog would fire at t=6000, in
  // the middle of this second, still-pending playback.
  t.mock.timers.tick(3000);
  const { targetIndex } = lc.snapshot();
  const answered = lc.actions.guess(targetIndex);
  await lc.pump(answered, () => 'hang');
  const cancelsAfterAnswerStart = lc.cancelCalls.count;
  t.mock.timers.tick(3500);
  await flush();

  assert.equal((await lc.pump(answered, () => 'hang')).done, false);
  assert.equal(lc.cancelCalls.count, cancelsAfterAnswerStart);
  assert.ok(cancelsAfterAnswerStart >= cancelsBefore);

  // The second playback's own watchdog still ends it, once.
  t.mock.timers.tick(2500);
  assert.equal((await lc.pump(answered, () => 'hang')).done, true);
  assert.equal(lc.counts().rounds, 1);
});
