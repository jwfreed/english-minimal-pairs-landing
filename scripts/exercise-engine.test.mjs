import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { CONTRAST_CATALOG, getContrastById } from '../src/contrast-catalog.js';
import { createExercise } from '../src/exercise-engine.js';

function createHarness({ challengeMode = false, targetIndexes = [1, 0] } = {}) {
  const events = [];
  const playedWords = [];
  const feedback = [];
  const snapshots = [];
  let targetIndexCursor = 0;

  const contrast = getContrastById('ship-vs-sheep');
  const exercise = createExercise({
    mount: {
      buildEventDetail(eventName, detail) {
        return {
          runtimeLocale: 'en',
          demoLocale: 'english',
          ...detail,
          exerciseParams: {
            exercise_id: contrast.id,
            pair_name: 'SHIP / SHEEP',
            sound_contrast: contrast.contrast,
            language: 'en',
            experience_surface: 'homepage',
          },
        };
      },
      dispatchEvent(name, detail) {
        events.push({ name, detail });
      },
      getTargetIndex() {
        const targetIndex = targetIndexes[targetIndexCursor] ?? 0;
        targetIndexCursor += 1;
        return targetIndex;
      },
      onFeedback(payload) {
        feedback.push(payload);
      },
      onStateChange(snapshot) {
        snapshots.push(snapshot);
      },
      async playWord(word) {
        playedWords.push(word.text);
      },
      async wait() {},
    },
    contrast,
    uiLocale: 'en',
    options: {
      challengeMode,
      maxRounds: 2,
    },
  });

  return {
    contrast,
    events,
    exercise,
    feedback,
    playedWords,
    snapshots,
  };
}

test('contrast catalog exposes canonical URL-addressable contrast data', () => {
  const contrast = getContrastById('ship-vs-sheep');

  assert.equal(contrast.id, 'ship-vs-sheep');
  assert.equal(contrast.words.length, 2);
  assert.deepEqual(contrast.words.map((word) => word.text), ['ship', 'sheep']);
  assert.equal(contrast.contrast, '/ɪ/ vs /iː/');
  assert.equal(CONTRAST_CATALOG['ship-vs-sheep'], contrast);
});

test('/ɪ/ vs /iː/ SEO journey contrasts are available in the catalog', () => {
  const expectedContrasts = [
    {
      id: 'ship-vs-sheep',
      words: ['ship', 'sheep'],
      ipa: ['/ʃɪp/', '/ʃiːp/'],
    },
    {
      id: 'fill-vs-feel',
      words: ['fill', 'feel'],
      ipa: ['/fɪl/', '/fiːl/'],
    },
    {
      id: 'live-vs-leave',
      words: ['live', 'leave'],
      ipa: ['/lɪv/', '/liːv/'],
    },
    {
      id: 'bit-vs-beat',
      words: ['bit', 'beat'],
      ipa: ['/bɪt/', '/biːt/'],
    },
  ];

  for (const expected of expectedContrasts) {
    const contrast = getContrastById(expected.id);

    assert.ok(contrast, `${expected.id} should exist`);
    assert.deepEqual(contrast.words.map((word) => word.text), expected.words);
    assert.deepEqual(contrast.words.map((word) => word.ipa), expected.ipa);
    assert.equal(contrast.contrast, '/ɪ/ vs /iː/');
  }
});

test('exercise starts a round, dispatches demo_started, and plays the target after audio unlock', async () => {
  const { events, exercise, playedWords, snapshots } = createHarness();

  exercise.unlockAudio();
  await exercise.startRound('play-button');

  assert.equal(exercise.getSnapshot().stage, 'test');
  assert.equal(exercise.getSnapshot().round, 1);
  assert.equal(exercise.getSnapshot().targetIndex, 1);
  assert.deepEqual(playedWords, ['sheep']);
  assert.equal(events.length, 1);
  assert.equal(events[0].name, 'demo_started');
  assert.equal(events[0].detail.round, 1);
  assert.equal(events[0].detail.challengeMode, false);
  assert.equal(events[0].detail.exerciseParams.experience_surface, 'homepage');
  assert.equal(snapshots.at(-1).stage, 'test');
});

test('exercise scores answers, advances rounds, and dispatches completion after the final replay', async () => {
  const { events, exercise, feedback, playedWords } = createHarness();

  exercise.unlockAudio();
  await exercise.startRound();
  const firstAnswer = await exercise.answer(0);

  assert.equal(firstAnswer.correct, false);
  assert.equal(exercise.getSnapshot().stage, 'feedback');
  assert.equal(exercise.getSnapshot().correct, 0);
  assert.equal(events[1].name, 'demo_round_completed');
  assert.equal(events[1].detail.correct, false);
  assert.equal(feedback.at(-1).selectedWord.text, 'ship');
  assert.equal(feedback.at(-1).correctWord.text, 'sheep');

  exercise.nextRound();
  assert.equal(exercise.getSnapshot().stage, 'preview');
  assert.equal(exercise.getSnapshot().round, 2);

  await exercise.startRound();
  const secondAnswer = await exercise.answer(0);

  assert.equal(secondAnswer.correct, true);
  assert.equal(exercise.getSnapshot().stage, 'summary');
  assert.equal(exercise.getSnapshot().hasCompletedDemo, true);
  assert.equal(exercise.getSnapshot().correct, 1);
  assert.deepEqual(
    events.map((event) => event.name),
    ['demo_started', 'demo_round_completed', 'demo_started', 'demo_round_completed', 'demo_completed']
  );
  assert.equal(events.at(-1).detail.correct, 1);
  assert.equal(events.at(-1).detail.total, 2);
  assert.deepEqual(playedWords.slice(-2), ['ship', 'sheep']);
});

test('challenge mode dispatches challenge_completed without changing scoring behavior', async () => {
  const { events, exercise } = createHarness({ challengeMode: true, targetIndexes: [0, 0] });

  exercise.unlockAudio();
  await exercise.startRound();
  await exercise.answer(0);
  exercise.nextRound();
  await exercise.startRound();
  await exercise.answer(0);

  assert.equal(exercise.getSnapshot().correct, 2);
  assert.equal(events.at(-1).name, 'challenge_completed');
  assert.equal(events.at(-1).detail.correct, 2);
});

test('reset restores the initial exercise state after completion', async () => {
  const { exercise, feedback, snapshots } = createHarness({ targetIndexes: [0, 0] });

  exercise.unlockAudio();
  await exercise.startRound();
  await exercise.answer(0);
  exercise.nextRound();
  await exercise.startRound();
  await exercise.answer(0);

  const resetSnapshot = exercise.reset();

  assert.equal(resetSnapshot.stage, 'preview');
  assert.equal(resetSnapshot.round, 1);
  assert.equal(resetSnapshot.correct, 0);
  assert.equal(resetSnapshot.targetIndex, null);
  assert.equal(resetSnapshot.hasCompletedDemo, false);
  assert.equal(feedback.at(-1), null);
  assert.equal(snapshots.at(-1).stage, 'preview');
});

test('exercise engine remains surface agnostic and analytics-neutral', () => {
  const engineSource = fs.readFileSync('src/exercise-engine.js', 'utf8');
  const forbiddenSnippets = [
    'hero-demo-config',
    'localized-homepage-routes',
    'seo-page',
    'querySelector',
    'getElementById',
    'gtag',
    'app_store_click',
    'training_start',
    'training_cta_click',
  ];

  for (const snippet of forbiddenSnippets) {
    assert.equal(engineSource.includes(snippet), false, `engine must not include ${snippet}`);
  }
});
