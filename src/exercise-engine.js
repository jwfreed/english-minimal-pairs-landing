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

function dispatchBrowserEvent(name, detail) {
  if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') {
    return;
  }

  window.dispatchEvent(new CustomEvent(`soundwise:${name}`, { detail }));
}

export function createExercise({
  mount = {},
  contrast,
  uiLocale = 'en',
  options = {},
} = {}) {
  if (!contrast || !Array.isArray(contrast.words) || contrast.words.length < 2) {
    throw new Error('createExercise requires a contrast with at least two words');
  }

  let currentContrast = contrast;
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
  };

  const getSnapshot = () => ({
    ...state,
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
        currentContrast = nextContrast;
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
      const word = currentContrast.words[index];

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

      for (const [index] of currentContrast.words.entries()) {
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
        mount.getTargetIndex?.(currentContrast, getSnapshot()) ?? Math.round(Math.random()),
        currentContrast.words.length
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
        correctWord: currentContrast.words[state.targetIndex],
        correctWordIndex: state.targetIndex,
        selectedIndex,
        selectedWord: currentContrast.words[selectedIndex] || null,
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

      notifyFeedback(null);
      notifyState('next_round');
      mount.onPreviewPrompt?.(getSnapshot());
      return getSnapshot();
    },
  };

  mount.onReady?.(getSnapshot());

  return controller;
}
