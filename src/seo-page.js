import { getContrastById } from './contrast-catalog.js';
import { createExercise } from './exercise-engine.js';
import setupFunnelTracking from './funnel-tracking.js';

const SEO_EXERCISE_SURFACE = 'seo_contrast_page';
const SEO_EXERCISE_MOUNT_SELECTOR = '[data-exercise][data-contrast]';
const SEO_EXERCISE_CLASS_NAME = 'seo-exercise';

function getSeoExerciseMountId(contrastId) {
  return `${contrastId}-listening-exercise`;
}

function formatPairName(contrast) {
  return contrast.words.map((word) => word.text.toUpperCase()).join(' / ');
}

function buildExerciseParams(contrast) {
  return {
    exercise_id: contrast.id,
    pair_name: formatPairName(contrast),
    sound_contrast: contrast.contrast,
    language: document.documentElement.lang || 'en',
    experience_surface: 'seo_contrast_page',
  };
}

function dispatchSoundwiseEvent(name, detail = {}) {
  window.dispatchEvent(new CustomEvent(`soundwise:${name}`, { detail }));
}

function buildSeoExerciseEventDetail(contrast, detail = {}) {
  return {
    ...detail,
    contrast_id: contrast.id,
    exerciseParams: buildExerciseParams(contrast),
  };
}

function prepareSeoExerciseMount(mount, contrast) {
  if (!mount.id) {
    mount.id = getSeoExerciseMountId(contrast.id);
  }

  mount.classList.add(SEO_EXERCISE_CLASS_NAME);
  return mount;
}

function createElement(tagName, { className, textContent, attributes = {} } = {}) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (textContent !== undefined) {
    element.textContent = textContent;
  }

  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }

  return element;
}

function showStage(element, isVisible) {
  if (!element) {
    return;
  }

  element.hidden = !isVisible;
}

function getEnglishVoice() {
  const voices = window.speechSynthesis?.getVoices?.() ?? [];

  return (
    voices.find((voice) => voice.lang === 'en-US')
    || voices.find((voice) => voice.lang.startsWith('en-US'))
    || voices.find((voice) => voice.lang === 'en-GB')
    || voices.find((voice) => voice.lang.startsWith('en-GB'))
    || voices.find((voice) => /^en(-|$)/i.test(voice.lang))
    || null
  );
}

function setButtonBusy(button, isBusy) {
  if (!button) {
    return;
  }

  button.classList.toggle('is-playing', isBusy);
  button.setAttribute('aria-busy', String(isBusy));
}

function speakWord(text, activeButton) {
  const synthesis = window.speechSynthesis;

  if (!synthesis) {
    return Promise.resolve(false);
  }

  synthesis.cancel();

  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const englishVoice = getEnglishVoice();
    utterance.lang = englishVoice?.lang || 'en-US';
    utterance.rate = 0.82;
    utterance.pitch = 1;
    utterance.volume = 1;

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    const complete = () => {
      setButtonBusy(activeButton, false);
      resolve(true);
    };

    utterance.onend = complete;
    utterance.onerror = complete;

    setButtonBusy(activeButton, true);
    synthesis.speak(utterance);
  });
}

function buildWordButton(contrast, index, action) {
  const word = contrast.words[index];
  const button = createElement('button', {
    className: `seo-exercise-word seo-exercise-word-${action}`,
    attributes: {
      type: 'button',
      'data-word-index': String(index),
      'data-action': action,
      'aria-label': action === 'guess'
        ? `Choose ${word.text}`
        : `Play pronunciation for ${word.text}`,
    },
  });

  const wordText = createElement('span', {
    className: 'seo-exercise-word-text',
    textContent: word.text.toUpperCase(),
    attributes: {
      lang: 'en',
      dir: 'ltr',
    },
  });
  const wordIpa = createElement('span', {
    className: 'seo-exercise-word-ipa',
    textContent: word.ipa,
  });

  if (action !== 'guess') {
    const icon = createElement('span', {
      className: 'seo-exercise-word-speaker',
      textContent: 'Listen',
      attributes: { 'aria-hidden': 'true' },
    });
    const body = createElement('span', { className: 'seo-exercise-word-body' });
    body.append(wordText, wordIpa);
    button.append(icon, body);
    return button;
  }

  button.append(wordText, wordIpa);
  return button;
}

function renderWordButtons(container, contrast, action) {
  container.replaceChildren(
    ...contrast.words.map((word, index) => buildWordButton(contrast, index, action))
  );
}

function renderFeedbackCopy(element, contrast, feedback) {
  if (!feedback) {
    element.textContent = '';
    return;
  }

  const selectedWord = feedback.selectedWord?.text.toUpperCase() || '';
  const correctWord = feedback.correctWord?.text.toUpperCase() || '';
  const status = feedback.correct ? 'Correct.' : 'Not quite.';

  element.textContent = `${status} You chose: ${selectedWord}. Correct answer: ${correctWord}.`;
}

function renderSummaryCopy(elements, snapshot) {
  const { score, summaryLead, summaryBody } = elements;

  score.textContent = `You got ${snapshot.correct} out of ${snapshot.total} correct.`;

  if (snapshot.correct === snapshot.total) {
    summaryLead.textContent = 'Nice work - you heard the contrast.';
    summaryBody.textContent = 'Keep practicing across more voices and word pairs so the distinction becomes automatic.';
    return;
  }

  if (snapshot.correct === 0) {
    summaryLead.textContent = 'This contrast needs more ear training.';
    summaryBody.textContent = 'That is normal. Focused listening practice helps your brain separate sounds that used to feel identical.';
    return;
  }

  summaryLead.textContent = 'You are starting to hear the contrast.';
  summaryBody.textContent = 'A few more focused repetitions can help make the difference clearer.';
}

function createSeoExercise(mount, contrast) {
  const titleId = `${mount.id || contrast.id}-title`;
  const liveRegion = createElement('p', {
    className: 'seo-exercise-live',
    textContent: 'Hear the contrast, then test your ear.',
    attributes: { 'aria-live': 'polite' },
  });

  const header = createElement('div', { className: 'seo-exercise-header' });
  header.append(
    createElement('p', { className: 'seo-exercise-label', textContent: 'Try this contrast' }),
    createElement('h2', {
      className: 'seo-exercise-title',
      textContent: formatPairName(contrast),
      attributes: { id: titleId },
    }),
    createElement('p', { className: 'seo-exercise-contrast', textContent: contrast.contrast })
  );

  const round = createElement('p', { className: 'seo-exercise-round' });
  const preview = createElement('div', { className: 'seo-exercise-stage' });
  const previewWords = createElement('div', {
    className: 'seo-exercise-choices',
    attributes: {
      role: 'group',
      'aria-label': 'Preview the two words',
    },
  });
  const startButton = createElement('button', {
    className: 'seo-exercise-action',
    textContent: 'Start the listening test',
    attributes: { type: 'button' },
  });
  preview.append(
    createElement('p', { className: 'seo-exercise-prompt', textContent: 'Listen to both words first.' }),
    previewWords,
    startButton
  );

  const test = createElement('div', { className: 'seo-exercise-stage' });
  const playButton = createElement('button', {
    className: 'seo-exercise-action seo-exercise-action-secondary',
    textContent: 'Play the sample',
    attributes: { type: 'button' },
  });
  const guessWords = createElement('div', {
    className: 'seo-exercise-choices',
    attributes: {
      role: 'group',
      'aria-label': 'Choose the word you heard',
    },
  });
  test.append(
    createElement('p', { className: 'seo-exercise-prompt', textContent: 'Which word did you hear?' }),
    playButton,
    guessWords
  );

  const feedback = createElement('div', { className: 'seo-exercise-stage seo-exercise-feedback' });
  const feedbackCopy = createElement('p', { className: 'seo-exercise-feedback-copy' });
  const replayWords = createElement('div', {
    className: 'seo-exercise-choices',
    attributes: {
      role: 'group',
      'aria-label': 'Replay the contrast',
    },
  });
  const nextButton = createElement('button', {
    className: 'seo-exercise-action',
    textContent: 'Try one more round',
    attributes: { type: 'button' },
  });
  feedback.append(
    feedbackCopy,
    createElement('p', { className: 'seo-exercise-prompt', textContent: 'Listen again:' }),
    replayWords,
    nextButton
  );

  const summary = createElement('div', { className: 'seo-exercise-stage seo-exercise-summary' });
  const summaryLead = createElement('p', { className: 'seo-exercise-summary-lead' });
  const score = createElement('p', { className: 'seo-exercise-score' });
  const summaryBody = createElement('p', { className: 'seo-exercise-summary-body' });
  summary.append(
    summaryLead,
    score,
    summaryBody,
    createElement('p', {
      className: 'seo-exercise-next-step',
      textContent: 'When you are ready, continue with the Soundwise app practice below.',
    })
  );

  mount.setAttribute('role', 'region');
  mount.setAttribute('aria-labelledby', titleId);
  mount.replaceChildren(header, round, preview, test, feedback, summary, liveRegion);
  renderWordButtons(previewWords, contrast, 'preview');
  renderWordButtons(guessWords, contrast, 'guess');
  renderWordButtons(replayWords, contrast, 'replay');

  let exercise = null;

  const render = (snapshot = exercise?.getSnapshot()) => {
    if (!snapshot) {
      return;
    }

    round.textContent = `Round ${Math.min(snapshot.round, snapshot.total)} of ${snapshot.total}`;
    showStage(preview, snapshot.stage === 'preview');
    showStage(test, snapshot.stage === 'test');
    showStage(feedback, snapshot.stage === 'feedback' || snapshot.stage === 'summary');
    showStage(summary, snapshot.stage === 'summary');
    showStage(nextButton, snapshot.stage === 'feedback' && snapshot.round < snapshot.total);

    if (snapshot.stage === 'summary') {
      renderSummaryCopy({ score, summaryLead, summaryBody }, snapshot);
    }
  };

  exercise = createExercise({
    mount: {
      buildEventDetail: (eventName, detail) => buildSeoExerciseEventDetail(contrast, detail),
      dispatchEvent: dispatchSoundwiseEvent,
      getTargetIndex: () => Math.round(Math.random()),
      onFeedback: (payload) => renderFeedbackCopy(feedbackCopy, contrast, payload),
      onStateChange: render,
      onListenPrompt: () => {
        liveRegion.textContent = 'Listen carefully. Which word did you hear?';
      },
      onFeedbackReady: () => {
        liveRegion.textContent = feedbackCopy.textContent;
      },
      onPreviewPrompt: () => {
        liveRegion.textContent = 'Listen to both words first.';
      },
      playWord: (word, activeButton) => speakWord(word.text, activeButton),
      wait: (ms) => new Promise((resolve) => window.setTimeout(resolve, ms)),
    },
    contrast,
    uiLocale: document.documentElement.lang || 'en',
    options: {
      experienceSurface: SEO_EXERCISE_SURFACE,
    },
  });

  const markInteraction = () => {
    exercise.unlockAudio();
  };

  startButton.addEventListener('click', () => {
    markInteraction();
    exercise.startRound(playButton);
  });

  playButton.addEventListener('click', () => {
    markInteraction();
    const snapshot = exercise.getSnapshot();

    if (snapshot.targetIndex !== null) {
      exercise.playWord(snapshot.targetIndex, playButton);
    }
  });

  previewWords.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action="preview"]');

    if (!button) {
      return;
    }

    markInteraction();
    exercise.playWord(Number(button.dataset.wordIndex), button);
  });

  replayWords.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action="replay"]');

    if (!button) {
      return;
    }

    markInteraction();
    exercise.playWord(Number(button.dataset.wordIndex), button);
  });

  guessWords.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action="guess"]');

    if (!button) {
      return;
    }

    markInteraction();
    exercise.answer(Number(button.dataset.wordIndex));
  });

  nextButton.addEventListener('click', () => {
    markInteraction();
    exercise.nextRound();
  });

  render(exercise.getSnapshot());
}

function setupSeoExercises() {
  document.querySelectorAll(SEO_EXERCISE_MOUNT_SELECTOR).forEach((mount) => {
    const contrast = getContrastById(mount.dataset.contrast);

    if (!contrast) {
      console.warn(`No exercise contrast found for "${mount.dataset.contrast}".`);
      mount.hidden = true;
      return;
    }

    prepareSeoExerciseMount(mount, contrast);
    createSeoExercise(mount, contrast);
  });
}

function setupFaqAccordion() {
  document.querySelectorAll('.faq-item').forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
      question.setAttribute('aria-expanded', String(item.classList.contains('active')));
    }

    question?.addEventListener('click', () => {
      const isExpanded = item.classList.toggle('active');
      question.setAttribute('aria-expanded', String(isExpanded));
    });
  });
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function handleAnchorClick(event) {
      const href = this.getAttribute('href');

      if (href === '#') {
        return;
      }

      const target = document.querySelector(href);
      if (!target) {
        return;
      }

      event.preventDefault();
      const navHeight = document.querySelector('.nav')?.offsetHeight || 70;

      window.scrollTo({
        top: target.offsetTop - navHeight - 20,
        behavior: 'smooth',
      });
    });
  });
}

function setupCtaTracking() {
  document.querySelectorAll('a[href*="apps.apple.com"]').forEach((link) => {
    link.addEventListener('click', () => {
      if (typeof window.gtag === 'function') {
        const buttonText = link.textContent.trim().replace(/\s+/g, ' ');

        window.gtag('event', 'app_store_click', {
          button_text: buttonText || link.getAttribute('aria-label') || undefined,
          page_path: window.location.pathname,
          link_url: link.href,
          link_id: link.id || undefined,
          transport_type: 'beacon',
        });
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupFaqAccordion();
  setupSmoothScroll();
  setupCtaTracking();
  setupFunnelTracking();
  setupSeoExercises();
});
