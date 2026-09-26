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
    areGuessesAvailable() {
      return guessesAvailable;
    },

    start(startRound) {
      if (startPromise) {
        return startPromise;
      }

      setGuessesAvailable(false, { force: true });
      startPromise = Promise.resolve()
        .then(startRound)
        .then((snapshot) => {
          setGuessesAvailable(snapshot?.stage === 'test');
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
