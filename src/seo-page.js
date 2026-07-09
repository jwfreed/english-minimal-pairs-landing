import { getContrastById } from './contrast-catalog.js';
import { createExercise } from './exercise-engine.js';
import setupFunnelTracking from './funnel-tracking.js';
import { getSeoExerciseCopy } from './seo-exercise-translations.js';

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

function buildWordButton(contrast, index, action, uiCopy) {
  const word = contrast.words[index];
  const wordLabel = word.text.toUpperCase();
  const button = createElement('button', {
    className: `seo-exercise-word seo-exercise-word-${action}`,
    attributes: {
      type: 'button',
      'data-word-index': String(index),
      'data-action': action,
      'aria-label': action === 'guess'
        ? uiCopy.chooseWordLabel(wordLabel)
        : uiCopy.playWordLabel(wordLabel),
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
      textContent: uiCopy.speakerLabel,
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

function renderWordButtons(container, contrast, action, uiCopy) {
  container.replaceChildren(
    ...contrast.words.map((word, index) => buildWordButton(contrast, index, action, uiCopy))
  );
}

function renderFeedbackCopy(element, feedback, uiCopy) {
  if (!feedback) {
    element.textContent = '';
    return;
  }

  const selectedWord = feedback.selectedWord?.text.toUpperCase() || '';
  const correctWord = feedback.correctWord?.text.toUpperCase() || '';

  element.textContent = uiCopy.feedback({
    selectedWord,
    correctWord,
    correct: feedback.correct,
  });
}

function renderSummaryCopy(elements, snapshot, uiCopy) {
  const { score, summaryLead, summaryBody } = elements;
  const summary = uiCopy.summary(snapshot);

  score.textContent = uiCopy.scoreLabel(snapshot.correct, snapshot.total);
  summaryLead.textContent = summary.lead;
  summaryBody.textContent = summary.body;
}

function createSeoExercise(mount, contrast) {
  const uiCopy = getSeoExerciseCopy(document.documentElement.lang || 'en');
  const titleId = `${mount.id || contrast.id}-title`;
  const liveRegion = createElement('p', {
    className: 'seo-exercise-live',
    textContent: uiCopy.liveInitial,
    attributes: { 'aria-live': 'polite' },
  });

  const header = createElement('div', { className: 'seo-exercise-header' });
  header.append(
    createElement('p', { className: 'seo-exercise-label', textContent: uiCopy.label }),
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
      'aria-label': uiCopy.previewChoicesAriaLabel,
    },
  });
  const startButton = createElement('button', {
    className: 'seo-exercise-action',
    textContent: uiCopy.startButton,
    attributes: { type: 'button' },
  });
  preview.append(
    createElement('p', { className: 'seo-exercise-prompt', textContent: uiCopy.previewPrompt }),
    previewWords,
    startButton
  );

  const test = createElement('div', { className: 'seo-exercise-stage' });
  const playButton = createElement('button', {
    className: 'seo-exercise-action seo-exercise-action-secondary',
    textContent: uiCopy.playButton,
    attributes: { type: 'button' },
  });
  const guessWords = createElement('div', {
    className: 'seo-exercise-choices',
    attributes: {
      role: 'group',
      'aria-label': uiCopy.guessChoicesAriaLabel,
    },
  });
  test.append(
    createElement('p', { className: 'seo-exercise-prompt', textContent: uiCopy.testPrompt }),
    playButton,
    guessWords
  );

  const feedback = createElement('div', { className: 'seo-exercise-stage seo-exercise-feedback' });
  const feedbackCopy = createElement('p', { className: 'seo-exercise-feedback-copy' });
  const replayWords = createElement('div', {
    className: 'seo-exercise-choices',
    attributes: {
      role: 'group',
      'aria-label': uiCopy.replayChoicesAriaLabel,
    },
  });
  const nextButton = createElement('button', {
    className: 'seo-exercise-action',
    textContent: uiCopy.nextButton,
    attributes: { type: 'button' },
  });
  feedback.append(
    feedbackCopy,
    createElement('p', { className: 'seo-exercise-prompt', textContent: uiCopy.feedbackReplayPrompt }),
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
      textContent: uiCopy.nextStep,
    })
  );

  mount.setAttribute('role', 'region');
  mount.setAttribute('aria-labelledby', titleId);
  mount.replaceChildren(header, round, preview, test, feedback, summary, liveRegion);
  renderWordButtons(previewWords, contrast, 'preview', uiCopy);
  renderWordButtons(guessWords, contrast, 'guess', uiCopy);
  renderWordButtons(replayWords, contrast, 'replay', uiCopy);

  let exercise = null;

  const render = (snapshot = exercise?.getSnapshot()) => {
    if (!snapshot) {
      return;
    }

    round.textContent = uiCopy.roundLabel(Math.min(snapshot.round, snapshot.total), snapshot.total);
    showStage(preview, snapshot.stage === 'preview');
    showStage(test, snapshot.stage === 'test');
    showStage(feedback, snapshot.stage === 'feedback' || snapshot.stage === 'summary');
    showStage(summary, snapshot.stage === 'summary');
    showStage(nextButton, snapshot.stage === 'feedback' && snapshot.round < snapshot.total);

    if (snapshot.stage === 'summary') {
      renderSummaryCopy({ score, summaryLead, summaryBody }, snapshot, uiCopy);
    }
  };

  exercise = createExercise({
    mount: {
      buildEventDetail: (eventName, detail) => buildSeoExerciseEventDetail(contrast, detail),
      dispatchEvent: dispatchSoundwiseEvent,
      getTargetIndex: () => Math.round(Math.random()),
      onFeedback: (payload) => renderFeedbackCopy(feedbackCopy, payload, uiCopy),
      onStateChange: render,
      onListenPrompt: () => {
        liveRegion.textContent = uiCopy.listenPrompt;
      },
      onFeedbackReady: () => {
        liveRegion.textContent = feedbackCopy.textContent;
      },
      onPreviewPrompt: () => {
        liveRegion.textContent = uiCopy.previewPrompt;
      },
      playWord: (word, activeButton) => speakWord(word.text, activeButton),
      wait: (ms) => new Promise((resolve) => window.setTimeout(resolve, ms)),
    },
    contrast,
    uiLocale: uiCopy.locale,
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
