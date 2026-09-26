const DEFAULT_MAX_ROUNDS = 2;
const REPLAY_WORD_DELAY_MS = 220;

function createDefaultWait() {
  return (ms) => new Promise((resolve) => {
    if (typeof window !== 'undefined' && typeof window.setTimeout === 'function') {
      window.setTimeout(resolve, ms);
      return;
    }

    setTimeout(resolve, ms);
  });
}

function normalizeTargetIndex(targetIndex, wordCount) {
  if (Number.isInteger(targetIndex) && targetIndex >= 0 && targetIndex < wordCount) {
    return targetIndex;
  }

  return 0;
}

function assertPlayablePair(pair) {
  if (!pair || !Array.isArray(pair.words) || pair.words.length < 2) {
    throw new Error('createExercise requires a contrast with at least two words');
  }
}

function normalizeTrainingPairs(contrast, trainingPairs) {
  if (trainingPairs == null) {
    return [contrast];
  }

  if (!Array.isArray(trainingPairs) || trainingPairs[0]?.id !== contrast.id) {
    throw new Error('createExercise trainingPairs must lead with the entry pair');
  }

  trainingPairs.forEach(assertPlayablePair);
  return [...trainingPairs];
}

// Round 1 always trains the entry pair. Later rounds take the first reviewed
// pair not yet seen, then rotate through the reviewed order once all are seen.
export function selectRoundPair({ trainingPairs, round, pairsSeen }) {
  if (round <= 1) {
    return trainingPairs[0];
  }

  return trainingPairs.find((pair) => !pairsSeen.includes(pair.id))
    || trainingPairs[(round - 1) % trainingPairs.length];
}

function dispatchBrowserEvent(name, detail) {
  if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') {
    return;
  }

  window.dispatchEvent(new CustomEvent(`soundwise:${name}`, { detail }));
}

// `contrast` is the stable entry/session pair. `trainingPairs` optionally lists
// reviewed pairs (entry first) the session may train; `currentPair` in the
// snapshot is the pair whose words are active in the current round.
export function createExercise({
  mount = {},
  contrast,
  trainingPairs,
  uiLocale = 'en',
  options = {},
} = {}) {
  assertPlayablePair(contrast);

  let currentContrast = contrast;
  let currentTrainingPairs = normalizeTrainingPairs(contrast, trainingPairs);
  let currentUiLocale = uiLocale;
  let currentOptions = {
    challengeMode: false,
    maxRounds: DEFAULT_MAX_ROUNDS,
    ...options,
  };

  const wait = mount.wait || createDefaultWait();
  const state = {
    round: 1,
    correct: 0,
    targetIndex: null,
    stage: 'preview',
    playbackToken: 0,
    audioUnlocked: false,
    hasCompletedDemo: false,
    currentPair: currentTrainingPairs[0],
    pairsSeen: [currentTrainingPairs[0].id],
  };

  const enterRoundPair = () => {
    state.currentPair = selectRoundPair({
      trainingPairs: currentTrainingPairs,
      round: state.round,
      pairsSeen: state.pairsSeen,
    });

    if (!state.pairsSeen.includes(state.currentPair.id)) {
      state.pairsSeen.push(state.currentPair.id);
    }
  };

  const resetRoundPairs = () => {
    state.pairsSeen = [];
    enterRoundPair();
  };

  const getSnapshot = () => ({
    ...state,
    pairsSeen: [...state.pairsSeen],
    challengeMode: Boolean(currentOptions.challengeMode),
    contrast: currentContrast,
    total: currentOptions.maxRounds,
    uiLocale: currentUiLocale,
  });

  const notifyState = (reason) => {
    mount.onStateChange?.(getSnapshot(), { reason });
  };

  const notifyFeedback = (payload) => {
    mount.onFeedback?.(payload, getSnapshot());
  };

  const buildEventDetail = (name, detail) => (
    mount.buildEventDetail?.(name, detail, getSnapshot()) || detail
  );

  const dispatchExerciseEvent = (name, detail) => {
    const eventDetail = buildEventDetail(name, detail);

    if (mount.dispatchEvent) {
      mount.dispatchEvent(name, eventDetail, getSnapshot());
      return;
    }

    dispatchBrowserEvent(name, eventDetail);
  };

  const playContrastWord = async (word, activeTarget) => {
    if (!mount.playWord) {
      return false;
    }

    return (await mount.playWord(word, activeTarget, getSnapshot())) !== false;
  };

  const controller = {
    getSnapshot,

    updateContext({ nextContrast, nextUiLocale, nextOptions } = {}) {
      if (nextContrast) {
        // A new session identity replaces any reviewed training set.
        currentContrast = nextContrast;
        currentTrainingPairs = [nextContrast];
        resetRoundPairs();
      }

      if (nextUiLocale) {
        currentUiLocale = nextUiLocale;
      }

      if (nextOptions) {
        currentOptions = {
          ...currentOptions,
          ...nextOptions,
        };
      }

      return getSnapshot();
    },

    reset({ notify = true } = {}) {
      state.round = 1;
      state.correct = 0;
      state.targetIndex = null;
      state.stage = 'preview';
      state.hasCompletedDemo = false;
      state.playbackToken += 1;
      resetRoundPairs();

      if (notify) {
        notifyFeedback(null);
        notifyState('reset');
      }

      return getSnapshot();
    },

    unlockAudio() {
      state.audioUnlocked = true;
      return getSnapshot();
    },

    async playWord(index, activeTarget, { allowWithoutInteraction = false } = {}) {
      const word = state.currentPair.words[index];

      if (!word || (!state.audioUnlocked && !allowWithoutInteraction)) {
        return false;
      }

      mount.onPlaybackReady?.(getSnapshot());
      const didPlay = await playContrastWord(word, activeTarget);

      if (!didPlay) {
        mount.onAudioUnavailable?.(getSnapshot());
      }

      return didPlay;
    },

    async replayContrast() {
      if (!state.audioUnlocked) {
        return false;
      }

      const playbackToken = ++state.playbackToken;

      for (const [index] of state.currentPair.words.entries()) {
        if (playbackToken !== state.playbackToken) {
          return false;
        }

        const didPlay = await controller.playWord(index);

        if (!didPlay) {
          return false;
        }

        await wait(REPLAY_WORD_DELAY_MS);
      }

      return true;
    },

    async startRound(activeTarget) {
      state.stage = 'test';
      state.targetIndex = normalizeTargetIndex(
        mount.getTargetIndex?.(state.currentPair, getSnapshot()) ?? Math.round(Math.random()),
        state.currentPair.words.length
      );

      notifyFeedback(null);
      notifyState('round_started');
      dispatchExerciseEvent('demo_started', {
        round: state.round,
        challengeMode: Boolean(currentOptions.challengeMode),
      });

      if (state.audioUnlocked) {
        mount.onListenPrompt?.(getSnapshot());
        const didPlay = await controller.playWord(state.targetIndex, activeTarget);

        if (!didPlay) {
          state.stage = 'preview';
          state.targetIndex = null;
          notifyState('audio_unavailable');
        }
      }

      return getSnapshot();
    },

    async answer(selectedIndex) {
      if (state.stage !== 'test' || state.targetIndex === null) {
        return {
          accepted: false,
          correct: false,
          snapshot: getSnapshot(),
        };
      }

      const isCorrect = selectedIndex === state.targetIndex;

      if (isCorrect) {
        state.correct += 1;
      }

      dispatchExerciseEvent('demo_round_completed', {
        round: state.round,
        correct: isCorrect,
      });

      state.stage = state.round >= currentOptions.maxRounds ? 'summary' : 'feedback';
      state.hasCompletedDemo = state.stage === 'summary';

      const feedback = {
        correct: isCorrect,
        correctWord: state.currentPair.words[state.targetIndex],
        correctWordIndex: state.targetIndex,
        selectedIndex,
        selectedWord: state.currentPair.words[selectedIndex] || null,
      };

      notifyFeedback(feedback);
      notifyState('answer_submitted');
      mount.onPlaybackReady?.(getSnapshot());
      mount.onFeedbackReady?.(feedback, getSnapshot());
      await controller.replayContrast();

      if (state.hasCompletedDemo) {
        dispatchExerciseEvent(
          currentOptions.challengeMode ? 'challenge_completed' : 'demo_completed',
          {
            correct: state.correct,
            total: currentOptions.maxRounds,
          }
        );
      }

      return {
        accepted: true,
        correct: isCorrect,
        snapshot: getSnapshot(),
      };
    },

    nextRound() {
      if (state.stage !== 'feedback' || state.round >= currentOptions.maxRounds) {
        return getSnapshot();
      }

      state.round += 1;
      state.targetIndex = null;
      state.stage = 'preview';
      enterRoundPair();

      notifyFeedback(null);
      notifyState('next_round');
      mount.onPreviewPrompt?.(getSnapshot());
      return getSnapshot();
    },
  };

  mount.onReady?.(getSnapshot());

  return controller;
}
