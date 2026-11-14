export function createSeoExerciseInputGate({
  onGuessAvailabilityChange = () => {},
} = {}) {
  let guessesAvailable = false;
  let startPromise = null;

  const setGuessesAvailable = (isAvailable, { force = false } = {}) => {
    if (!force && guessesAvailable === isAvailable) {
      return;
    }

    guessesAvailable = isAvailable;
    onGuessAvailabilityChange(isAvailable);
  };

  return {
    sync(snapshot) {
      setGuessesAvailable(snapshot.stage === 'test' && snapshot.canAnswer);
    },
    areGuessesAvailable() {
      return guessesAvailable;
    },

    start(startRound) {
      if (startPromise) {
        return startPromise;
      }

      setGuessesAvailable(false, { force: true });
      // Invoke immediately: iOS speech must retain the tap's gesture context.
      // Keep thrown errors on the same Promise-based interface.
      let result;
      try {
        result = startRound();
      } catch (error) {
        result = Promise.reject(error);
      }
      startPromise = Promise.resolve(result)
        .then((snapshot) => {
          setGuessesAvailable(snapshot?.stage === 'test' && snapshot.canAnswer);
          return snapshot;
        })
        .finally(() => {
          startPromise = null;
        });

      return startPromise;
    },

    answer(submitAnswer) {
      if (!guessesAvailable) {
        return Promise.resolve({ accepted: false });
      }

      setGuessesAvailable(false);
      return Promise.resolve().then(submitAnswer);
    },

    reset() {
      setGuessesAvailable(false);
    },
  };
}
