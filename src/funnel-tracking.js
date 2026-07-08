export default function setupFunnelTracking() {
  let exerciseStartSent = false;
  let exerciseCompleteSent = false;

  window.addEventListener('soundwise:demo_started', (event) => {
    if (exerciseStartSent || typeof window.gtag !== 'function') {
      return;
    }

    exerciseStartSent = true;
    window.gtag('event', 'exercise_start', event.detail.exerciseParams);
  });

  const handleExerciseComplete = (event) => {
    if (exerciseCompleteSent || typeof window.gtag !== 'function') {
      return;
    }

    exerciseCompleteSent = true;
    window.gtag('event', 'exercise_complete', event.detail.exerciseParams);
  };

  window.addEventListener('soundwise:demo_completed', handleExerciseComplete);
  window.addEventListener('soundwise:challenge_completed', handleExerciseComplete);
}
