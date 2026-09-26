import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  CONTRAST_CATALOG,
  getContrastById,
  getRelatedContrasts,
} from '../src/contrast-catalog.js';
import { createExercise, selectRoundPair } from '../src/exercise-engine.js';

function createHarness({ challengeMode = false, targetIndexes = [1, 0], shouldPlay = true } = {}) {
  const events = [];
  const playedWords = [];
  const feedback = [];
  const snapshots = [];
  const audioUnavailable = [];
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
            learner_language: 'en',
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
      onAudioUnavailable(snapshot) {
        audioUnavailable.push(snapshot);
      },
      async playWord(word) {
        playedWords.push(word.text);
        return shouldPlay;
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
    audioUnavailable,
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

test('related contrast examples are derived from verified catalog data, regardless of display order', () => {
  assert.deepEqual(
    getRelatedContrasts('ship-vs-sheep').map((contrast) => contrast.id),
    ['bit-vs-beat', 'fill-vs-feel', 'live-vs-leave']
  );
  assert.deepEqual(
    getRelatedContrasts('bet-vs-bat').map((contrast) => contrast.id),
    ['bad-vs-bed', 'man-vs-men']
  );
  assert.deepEqual(getRelatedContrasts('unknown-contrast'), []);
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

test('exercise returns to preview and rejects answers when playback is unavailable', async () => {
  const { audioUnavailable, events, exercise, playedWords } = createHarness({ shouldPlay: false });

  exercise.unlockAudio();
  await exercise.startRound();
  const answer = await exercise.answer(0);

  assert.deepEqual(playedWords, ['sheep']);
  assert.equal(exercise.getSnapshot().stage, 'preview');
  assert.equal(exercise.getSnapshot().targetIndex, null);
  assert.equal(audioUnavailable.length, 1);
  assert.equal(events.at(-1).name, 'demo_started');
  assert.equal(answer.accepted, false);
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

function createMultiPairHarness({ targetIndexes = [1, 0], trainingPairIds } = {}) {
  const events = [];
  const playedWords = [];
  const feedback = [];
  const targetPairs = [];
  let targetIndexCursor = 0;

  const contrast = getContrastById('full-vs-fool');
  const trainingPairs = (trainingPairIds || ['full-vs-fool', 'pull-vs-pool'])
    .map((pairId) => getContrastById(pairId));
  const exercise = createExercise({
    mount: {
      buildEventDetail(eventName, detail, snapshot) {
        return { ...detail, snapshot };
      },
      dispatchEvent(name, detail) {
        events.push({ name, detail });
      },
      getTargetIndex(pair) {
        targetPairs.push(pair.id);
        const targetIndex = targetIndexes[targetIndexCursor] ?? 0;
        targetIndexCursor += 1;
        return targetIndex;
      },
      onFeedback(payload) {
        feedback.push(payload);
      },
      async playWord(word) {
        playedWords.push(word.text);
        return true;
      },
      async wait() {},
    },
    contrast,
    trainingPairs,
    uiLocale: 'en',
  });

  return {
    contrast,
    events,
    exercise,
    feedback,
    playedWords,
    targetPairs,
  };
}

test('single-pair sessions expose the entry pair as the current pair in every round', async () => {
  const { contrast, exercise } = createHarness({ targetIndexes: [0, 0] });

  assert.equal(exercise.getSnapshot().currentPair, contrast);
  assert.deepEqual(exercise.getSnapshot().pairsSeen, ['ship-vs-sheep']);

  exercise.unlockAudio();
  await exercise.startRound();
  await exercise.answer(0);
  exercise.nextRound();

  assert.equal(exercise.getSnapshot().contrast, contrast);
  assert.equal(exercise.getSnapshot().currentPair, contrast);
  assert.deepEqual(exercise.getSnapshot().pairsSeen, ['ship-vs-sheep']);
});

test('a one-pair training list behaves exactly like an omitted training list', async () => {
  const contrast = getContrastById('ship-vs-sheep');
  const run = async (extraConfig) => {
    const playedWords = [];
    const exercise = createExercise({
      mount: {
        dispatchEvent() {},
        getTargetIndex: () => 1,
        async playWord(word) {
          playedWords.push(word.text);
          return true;
        },
        async wait() {},
      },
      contrast,
      ...extraConfig,
    });

    exercise.unlockAudio();
    await exercise.startRound();
    await exercise.answer(1);
    exercise.nextRound();
    await exercise.startRound();
    await exercise.answer(0);

    return { playedWords, snapshot: exercise.getSnapshot() };
  };

  const legacy = await run({});
  const explicit = await run({ trainingPairs: [contrast] });

  assert.deepEqual(explicit.playedWords, legacy.playedWords);
  assert.deepEqual(explicit.snapshot, legacy.snapshot);
});

test('multi-pair sessions train the entry pair first and the next reviewed pair second', async () => {
  const {
    contrast,
    events,
    exercise,
    feedback,
    playedWords,
    targetPairs,
  } = createMultiPairHarness({ targetIndexes: [1, 0] });

  assert.equal(exercise.getSnapshot().currentPair.id, 'full-vs-fool');
  assert.deepEqual(exercise.getSnapshot().pairsSeen, ['full-vs-fool']);

  exercise.unlockAudio();
  await exercise.startRound();
  assert.deepEqual(playedWords, ['fool']);
  await exercise.answer(0);

  assert.equal(feedback.at(-1).selectedWord.text, 'full');
  assert.equal(feedback.at(-1).correctWord.text, 'fool');
  assert.deepEqual(playedWords.slice(1), ['full', 'fool']);

  exercise.nextRound();
  const roundTwo = exercise.getSnapshot();

  assert.equal(roundTwo.round, 2);
  assert.equal(roundTwo.contrast, contrast);
  assert.equal(roundTwo.contrast.id, 'full-vs-fool');
  assert.equal(roundTwo.currentPair.id, 'pull-vs-pool');
  assert.deepEqual(roundTwo.pairsSeen, ['full-vs-fool', 'pull-vs-pool']);

  await exercise.startRound();
  assert.equal(playedWords.at(-1), 'pull');
  await exercise.answer(1);

  assert.equal(feedback.at(-1).selectedWord.text, 'pool');
  assert.equal(feedback.at(-1).correctWord.text, 'pull');
  assert.deepEqual(playedWords.slice(-2), ['pull', 'pool']);
  assert.deepEqual(targetPairs, ['full-vs-fool', 'pull-vs-pool']);

  const summary = exercise.getSnapshot();
  assert.equal(summary.stage, 'summary');
  assert.equal(summary.total, 2);
  assert.equal(summary.correct, 0);
  assert.equal(summary.contrast.id, 'full-vs-fool');
  assert.deepEqual(
    events.map((event) => event.name),
    ['demo_started', 'demo_round_completed', 'demo_started', 'demo_round_completed', 'demo_completed']
  );
  assert.deepEqual(events.at(-1).detail.snapshot.pairsSeen, ['full-vs-fool', 'pull-vs-pool']);
  assert.equal(events.at(-1).detail.snapshot.contrast.id, 'full-vs-fool');
});

test('multi-pair playback by index resolves words from the current round pair', async () => {
  const { exercise, playedWords } = createMultiPairHarness({ targetIndexes: [0, 0] });

  exercise.unlockAudio();
  await exercise.playWord(1);
  await exercise.startRound();
  await exercise.answer(0);
  exercise.nextRound();
  await exercise.playWord(0);
  await exercise.playWord(1);

  assert.deepEqual(playedWords, ['fool', 'full', 'full', 'fool', 'pull', 'pool']);
});

test('advancing during automatic replay speech prevents playback from leaking into the next pair', async () => {
  const contrast = getContrastById('full-vs-fool');
  const trainingPairs = [contrast, getContrastById('pull-vs-pool')];
  const playedWords = [];
  let replayStarted;
  let finishReplayWord;
  const replayWordStarted = new Promise((resolve) => {
    replayStarted = resolve;
  });
  const replayWordPlayback = new Promise((resolve) => {
    finishReplayWord = resolve;
  });
  let playbackCount = 0;
  const exercise = createExercise({
    mount: {
      dispatchEvent() {},
      getTargetIndex: () => 1,
      async playWord(word) {
        playedWords.push(word.text);
        playbackCount += 1;

        if (playbackCount === 2) {
          replayStarted();
          return replayWordPlayback;
        }

        return true;
      },
      async wait() {},
    },
    contrast,
    trainingPairs,
  });

  exercise.unlockAudio();
  await exercise.startRound();
  const answerPromise = exercise.answer(0);
  await replayWordStarted;

  exercise.nextRound();
  finishReplayWord(true);
  await answerPromise;

  assert.equal(exercise.getSnapshot().currentPair.id, 'pull-vs-pool');
  assert.deepEqual(playedWords, ['fool', 'full']);
});

test('advancing during the automatic replay gap prevents the next pair from being spoken', async () => {
  const contrast = getContrastById('full-vs-fool');
  const trainingPairs = [contrast, getContrastById('pull-vs-pool')];
  const playedWords = [];
  let replayGapStarted;
  let finishReplayGap;
  const gapStarted = new Promise((resolve) => {
    replayGapStarted = resolve;
  });
  const replayGap = new Promise((resolve) => {
    finishReplayGap = resolve;
  });
  let waitCount = 0;
  const exercise = createExercise({
    mount: {
      dispatchEvent() {},
      getTargetIndex: () => 1,
      async playWord(word) {
        playedWords.push(word.text);
        return true;
      },
      async wait() {
        waitCount += 1;

        if (waitCount === 1) {
          replayGapStarted();
          return replayGap;
        }
      },
    },
    contrast,
    trainingPairs,
  });

  exercise.unlockAudio();
  await exercise.startRound();
  const answerPromise = exercise.answer(0);
  await gapStarted;

  exercise.nextRound();
  finishReplayGap();
  await answerPromise;

  assert.equal(exercise.getSnapshot().currentPair.id, 'pull-vs-pool');
  assert.deepEqual(playedWords, ['fool', 'full']);
});

test('multi-pair sessions never mutate or alias the entry pair record', async () => {
  const entry = getContrastById('full-vs-fool');
  const entryBefore = structuredClone(entry);
  const { exercise } = createMultiPairHarness();

  exercise.unlockAudio();
  await exercise.startRound();
  await exercise.answer(0);
  exercise.nextRound();
  await exercise.startRound();
  await exercise.answer(0);

  assert.deepEqual(entry, entryBefore);
  assert.notEqual(exercise.getSnapshot().currentPair, exercise.getSnapshot().contrast);
});

test('snapshot pairsSeen is a detached copy of engine state', () => {
  const { exercise } = createMultiPairHarness();
  const snapshot = exercise.getSnapshot();

  snapshot.pairsSeen.push('ship-vs-sheep');

  assert.deepEqual(exercise.getSnapshot().pairsSeen, ['full-vs-fool']);
});

test('reset returns a multi-pair session to its entry pair', async () => {
  const { exercise } = createMultiPairHarness({ targetIndexes: [0, 0] });

  exercise.unlockAudio();
  await exercise.startRound();
  await exercise.answer(0);
  exercise.nextRound();

  const resetSnapshot = exercise.reset();

  assert.equal(resetSnapshot.currentPair.id, 'full-vs-fool');
  assert.deepEqual(resetSnapshot.pairsSeen, ['full-vs-fool']);
});

test('trainingPairs must lead with the entry pair and contain playable pairs', () => {
  const entry = getContrastById('full-vs-fool');
  const sibling = getContrastById('pull-vs-pool');

  assert.throws(
    () => createExercise({ contrast: entry, trainingPairs: [sibling, entry] }),
    /entry pair/u
  );
  assert.throws(
    () => createExercise({ contrast: entry, trainingPairs: [] }),
    /entry pair/u
  );
  assert.throws(
    () => createExercise({ contrast: entry, trainingPairs: [entry, { id: 'broken', words: [] }] }),
    /at least two words/u
  );
});

test('updating the single-pair session contrast moves the current pair with it', () => {
  const { exercise } = createHarness();
  const nextContrast = getContrastById('right-vs-light');

  const snapshot = exercise.updateContext({ nextContrast });

  assert.equal(snapshot.contrast, nextContrast);
  assert.equal(snapshot.currentPair, nextContrast);
  assert.deepEqual(snapshot.pairsSeen, ['right-vs-light']);
});

test('round pair selection is deterministic: entry first, then first unseen reviewed pair', () => {
  const full = getContrastById('full-vs-fool');
  const pull = getContrastById('pull-vs-pool');
  const trainingPairs = [full, pull];

  assert.equal(selectRoundPair({ trainingPairs, round: 1, pairsSeen: [] }), full);
  assert.equal(selectRoundPair({ trainingPairs, round: 2, pairsSeen: ['full-vs-fool'] }), pull);
  assert.equal(
    selectRoundPair({ trainingPairs, round: 3, pairsSeen: ['full-vs-fool', 'pull-vs-pool'] }),
    full
  );
  assert.equal(
    selectRoundPair({ trainingPairs, round: 4, pairsSeen: ['full-vs-fool', 'pull-vs-pool'] }),
    pull
  );
  assert.equal(selectRoundPair({ trainingPairs: [full], round: 2, pairsSeen: ['full-vs-fool'] }), full);
});

test('generalization examples can exclude pairs already trained in the session', () => {
  assert.deepEqual(
    getRelatedContrasts('full-vs-fool').map((contrast) => contrast.id),
    ['pull-vs-pool']
  );
  assert.deepEqual(
    getRelatedContrasts('full-vs-fool', { excludeIds: ['full-vs-fool', 'pull-vs-pool'] }),
    []
  );
  assert.deepEqual(
    getRelatedContrasts('ship-vs-sheep', { excludeIds: ['ship-vs-sheep', 'bit-vs-beat'] })
      .map((contrast) => contrast.id),
    ['fill-vs-feel', 'live-vs-leave', 'sit-vs-seat']
  );
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
