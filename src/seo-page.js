import { getContrastById, getRelatedContrasts } from './contrast-catalog.js';
import { createExercise } from './exercise-engine.js';
import setupFunnelTracking from './funnel-tracking.js';
import { getSeoExerciseCopy } from './seo-exercise-translations.js';
import { createSeoExerciseSummaryCta } from './seo-exercise-summary-cta.js';
import {
  CONTENT_VARIANTS,
  getContentVariantEventParameters,
} from './analytics-content-variants.js';
import {
  applyCapabilityToSeoCtas,
  resolveSeoPageCapability,
} from './seo-capability-cta.js';
import {
  buildExerciseAttribution,
  buildSeoAppStoreAttribution,
  getSeoPageLocale,
  getSeoPageSlug,
} from './app-store-attribution.js';

const SEO_EXERCISE_SURFACE = 'seo_contrast_page';
const SEO_EXERCISE_MOUNT_SELECTOR = '[data-exercise][data-contrast]';
const SEO_EXERCISE_CLASS_NAME = 'seo-exercise';
const EXERCISE_COMPLETION_EVENTS = new Set(['demo_completed', 'challenge_completed']);
const CONTRAST_JOURNEY_LIST_SELECTOR = '.contrast-journey-list[data-contrast-journey]';
const CONTRAST_JOURNEY_LINK_SELECTOR =
  'a.contrast-journey-link[data-destination-pair]';

function getSeoExerciseMountId(contrastId) {
  return `${contrastId}-listening-exercise`;
}

export function buildSeoExerciseInteractionCtaConfig({
  contentVariant,
  container,
  contrastId,
}) {
  if (contentVariant !== CONTENT_VARIANTS.CONVERSION_SERP_CTA_V1) {
    return undefined;
  }

  return {
    container,
    headline: 'You heard the contrast.',
    body: 'Soundwise trains your ear with more pairs like this.',
    linkId: `exercise-${contrastId}-post-interaction-app-store-cta`,
    linkLabel: 'Practice More in Soundwise',
  };
}

function formatPairName(contrast) {
  return contrast.words.map((word) => word.text.toUpperCase()).join(' / ');
}

function buildExerciseParams(contrast, eventName) {
  return {
    exercise_id: contrast.id,
    pair_name: formatPairName(contrast),
    sound_contrast: contrast.contrast,
    learner_language: document.documentElement.lang || 'en',
    experience_surface: 'seo_contrast_page',
    ...buildExerciseAttribution({
      eventName,
      pageSlug: getSeoPageSlug(window.location.pathname),
      locale: getSeoPageLocale(window.location.pathname, document.documentElement.lang),
      contentVariant: document.documentElement.dataset.contentVariant,
    }),
  };
}

function dispatchSoundwiseEvent(name, detail = {}) {
  window.dispatchEvent(new CustomEvent(`soundwise:${name}`, { detail }));
}

function buildSeoExerciseEventDetail(contrast, eventName, detail = {}) {
  return {
    ...detail,
    contrast_id: contrast.id,
    exerciseParams: buildExerciseParams(contrast, eventName),
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

    const complete = (didPlay) => {
      setButtonBusy(activeButton, false);
      resolve(didPlay);
    };

    utterance.onend = () => complete(true);
    utterance.onerror = () => complete(false);

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
    body.append(wordText);

    if (action === 'replay') {
      body.append(wordIpa);
    }

    button.append(icon, body);
    return button;
  }

  button.append(wordText);
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

function renderGeneralizationCopy(element, relatedContrasts, contrast, uiCopy) {
  if (!relatedContrasts.length) {
    element.hidden = true;
    return;
  }

  const [heading, body, list] = element.children;
  heading.textContent = uiCopy.generalizationHeading(contrast.contrast);
  body.textContent = uiCopy.generalizationBody;
  list.replaceChildren(
    ...relatedContrasts.map((relatedContrast) => createElement('li', {
      className: 'seo-exercise-generalization-pair',
      textContent: formatPairName(relatedContrast),
    }))
  );
  element.hidden = false;
}

function createSeoExercise(mount, contrast, capability) {
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
    })
  );

  const round = createElement('p', { className: 'seo-exercise-round' });
  const audioStatus = createElement('p', {
    className: 'seo-exercise-audio-status',
    attributes: { role: 'status' },
  });
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
  const feedbackContrast = createElement('p', { className: 'seo-exercise-contrast' });
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
    feedbackContrast,
    createElement('p', { className: 'seo-exercise-prompt', textContent: uiCopy.feedbackReplayPrompt }),
    replayWords,
    nextButton
  );

  const summary = createElement('div', { className: 'seo-exercise-stage seo-exercise-summary' });
  const summaryLead = createElement('p', { className: 'seo-exercise-summary-lead' });
  const score = createElement('p', { className: 'seo-exercise-score' });
  const summaryBody = createElement('p', { className: 'seo-exercise-summary-body' });
  const generalization = createElement('section', {
    className: 'seo-exercise-generalization',
    attributes: { hidden: '' },
  });
  generalization.append(
    createElement('h3', { className: 'seo-exercise-generalization-heading' }),
    createElement('p', { className: 'seo-exercise-generalization-body' }),
    createElement('ul', { className: 'seo-exercise-generalization-list' })
  );
  summary.append(
    summaryLead,
    score,
    summaryBody,
    generalization
  );

  const existingAppStoreLink = document.querySelector('a[href*="apps.apple.com"]');
  const summaryCta = createSeoExerciseSummaryCta({
    document,
    container: summary,
    uiCopy,
    appStoreHref: existingAppStoreLink?.href,
    capability,
    locale: capability?.evidence?.resolvedL1,
    interactionCta: buildSeoExerciseInteractionCtaConfig({
      contentVariant: document.documentElement.dataset.contentVariant,
      container: feedback,
      contrastId: contrast.id,
    }),
  });

  mount.setAttribute('role', 'region');
  mount.setAttribute('aria-labelledby', titleId);
  mount.replaceChildren(header, round, audioStatus, preview, test, feedback, summary, liveRegion);
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
    summaryCta.sync(snapshot);

    if (snapshot.stage === 'feedback') {
      summaryCta.showInteraction(snapshot);
    }

    if (snapshot.stage === 'summary') {
      renderSummaryCopy({ score, summaryLead, summaryBody }, snapshot, uiCopy);
      renderGeneralizationCopy(
        generalization,
        getRelatedContrasts(contrast.id),
        contrast,
        uiCopy
      );
    }
  };

  exercise = createExercise({
    mount: {
      buildEventDetail: (eventName, detail) => buildSeoExerciseEventDetail(contrast, eventName, detail),
      dispatchEvent: (eventName, detail, snapshot) => {
        dispatchSoundwiseEvent(eventName, detail);

        if (EXERCISE_COMPLETION_EVENTS.has(eventName)) {
          summaryCta.show(snapshot);
        }
      },
      getTargetIndex: () => Math.round(Math.random()),
      onFeedback: (payload) => renderFeedbackCopy(feedbackCopy, payload, uiCopy),
      onAudioUnavailable: () => {
        audioStatus.textContent = uiCopy.audioUnavailable;
        liveRegion.textContent = uiCopy.audioUnavailable;
      },
      onPlaybackReady: () => {
        audioStatus.textContent = '';
      },
      onStateChange: render,
      onListenPrompt: () => {
        liveRegion.textContent = uiCopy.listenPrompt;
      },
      onFeedbackReady: () => {
        feedbackContrast.textContent = uiCopy.feedbackContrast(contrast.contrast);
        liveRegion.textContent = `${feedbackCopy.textContent} ${feedbackContrast.textContent}`;
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

function setupSeoExercises(capability) {
  document.querySelectorAll(SEO_EXERCISE_MOUNT_SELECTOR).forEach((mount) => {
    const contrast = getContrastById(mount.dataset.contrast);

    if (!contrast) {
      console.warn(`No exercise contrast found for "${mount.dataset.contrast}".`);
      mount.hidden = true;
      return;
    }

    prepareSeoExerciseMount(mount, contrast);
    createSeoExercise(mount, contrast, capability);
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

export function setupCtaTracking({
  root = document,
  browserWindow = window,
} = {}) {
  let exerciseCompleted = false;

  const markExerciseCompleted = () => {
    exerciseCompleted = true;
  };

  browserWindow.addEventListener('soundwise:demo_completed', markExerciseCompleted);
  browserWindow.addEventListener('soundwise:challenge_completed', markExerciseCompleted);

  root.addEventListener('click', (event) => {
    const link = event.target?.closest?.('a[href*="apps.apple.com"]');

    if (!link || typeof browserWindow.gtag !== 'function') {
      return;
    }

    const buttonText = link.textContent.trim().replace(/\s+/g, ' ');

    browserWindow.gtag('event', 'app_store_click', {
      button_text: buttonText || link.getAttribute('aria-label') || undefined,
      page_path: browserWindow.location.pathname,
      link_url: link.href,
      link_id: link.id || undefined,
      ...buildSeoAppStoreAttribution({
        link,
        pathname: browserWindow.location.pathname,
        documentLanguage: root.documentElement.lang,
        exerciseCompleted,
        contentVariant: root.documentElement.dataset?.contentVariant,
      }),
      transport_type: 'beacon',
    });
  });
}

export function setupContrastJourneyTracking({
  root = document,
  browserWindow = window,
  Observer = browserWindow.IntersectionObserver,
} = {}) {
  const journeyLists = [...root.querySelectorAll(CONTRAST_JOURNEY_LIST_SELECTOR)];

  if (journeyLists.length === 0) {
    return;
  }

  const language = root.documentElement.lang || 'en';
  const locale = getSeoPageLocale(browserWindow.location.pathname, language);
  const contentVariant = root.documentElement.dataset?.contentVariant;
  const viewedLists = new WeakSet();
  const sendJourneyEvent = (eventName, list, link, extraParams = {}) => {
    const sourcePair = list?.dataset?.contrastJourney;
    const destinationPair = link?.dataset?.destinationPair;

    if (
      !sourcePair
      || !destinationPair
      || typeof browserWindow.gtag !== 'function'
    ) {
      return;
    }

    browserWindow.gtag('event', eventName, {
      source_pair: sourcePair,
      destination_pair: destinationPair,
      learner_language: language,
      locale,
      ...getContentVariantEventParameters(contentVariant),
      ...extraParams,
    });
  };

  root.addEventListener('click', (event) => {
    const link = event.target?.closest?.(CONTRAST_JOURNEY_LINK_SELECTOR);
    const list = link?.closest?.(CONTRAST_JOURNEY_LIST_SELECTOR);

    if (!link || !list) {
      return;
    }

    sendJourneyEvent('contrast_journey_click', list, link, {
      transport_type: 'beacon',
    });
  });

  if (typeof Observer !== 'function') {
    return;
  }

  const observer = new Observer((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting || viewedLists.has(entry.target)) {
        continue;
      }

      viewedLists.add(entry.target);
      entry.target.querySelectorAll(CONTRAST_JOURNEY_LINK_SELECTOR)
        .forEach((link) => {
          sendJourneyEvent('contrast_journey_view', entry.target, link);
        });
      observer.unobserve(entry.target);
    }
  });

  journeyLists.forEach((list) => observer.observe(list));
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const capability = resolveSeoPageCapability({
      pathname: window.location.pathname,
      documentLanguage: document.documentElement.lang,
    });

    applyCapabilityToSeoCtas({
      capability,
      locale: capability?.evidence?.resolvedL1,
    });
    setupFaqAccordion();
    setupSmoothScroll();
    setupCtaTracking();
    setupContrastJourneyTracking();
    setupFunnelTracking();
    setupSeoExercises(capability);
  });
}
