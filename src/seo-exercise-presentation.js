export function shouldShowWordIpa({ action, enhancedPresentation }) {
  return action === 'replay' || (action === 'preview' && enhancedPresentation);
}

export function getReplayFeedbackStates(feedback, wordCount) {
  const states = Array.from({ length: wordCount }, () => null);

  if (!feedback) {
    return states;
  }

  if (Number.isInteger(feedback.correctWordIndex)) {
    states[feedback.correctWordIndex] = 'correct';
  }

  if (!feedback.correct && Number.isInteger(feedback.selectedIndex)) {
    states[feedback.selectedIndex] = 'selected-incorrect';
  }

  return states;
}
