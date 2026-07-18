import './style.css';
import { createExercise } from './exercise-engine.js';
import setupFunnelTracking from './funnel-tracking.js';
import { applyTranslations, getCurrentLanguage, resolveRuntimeLocale, setLanguage, translations } from './i18n.js';
import { getRuntimeLocaleMeta } from './landing-copy-runtime.js';
import {
  HERO_DEMO_CONTRASTS,
  HERO_DEMO_LOCALE_ORDER,
  RUNTIME_LOCALE_TO_DEMO_LOCALE,
} from './hero-demo-config.js';
import { HOMEPAGE_ROUTE_BY_SLUG } from './localized-homepage-routes.js';
import { buildExerciseAttribution } from './app-store-attribution.js';

const DEMO_MAX_ROUNDS = 2;
const CTA_UNLOCKED_CLASS = 'is-muted';
const CHALLENGE_QUERY_PARAM = 'challenge';
const CHALLENGE_LANG_PARAM = 'lang';
const CHALLENGE_MODE_CLASS = 'challenge-mode';
const heroDemoState = {
  runtimeLocale: 'en',
  demoLocale: 'english',
  forcedDemoLocale: null,
  round: 1,
  correct: 0,
  targetIndex: null,
  stage: 'preview',
  ctaActivated: false,
  playbackToken: 0,
  audioUnlocked: false,
  hasCompletedDemo: false,
  isChallengeMode: false,
  challengeSlug: null,
};

const dom = {};
let heroExercise = null;

function getTranslation(locale, key) {
  const runtimeLocale = resolveRuntimeLocale(locale) || 'en';
  return translations[runtimeLocale]?.[key] ?? translations.en?.[key] ?? '';
}

function formatMessage(template, replacements = {}) {
  return Object.entries(replacements).reduce(
    (message, [token, value]) => message.replaceAll(`{${token}}`, String(value)),
    template
  );
}

function dispatchDemoEvent(name, detail = {}) {
  window.dispatchEvent(new CustomEvent(`soundwise:${name}`, { detail }));
}

// Grounded parameters for the SEO funnel exercise_* events. Everything here is
// derived from the active demo contrast config and the visitor's chosen UI
// language — no PII, no invented values.
function buildExerciseParams(eventName, detail = {}) {
  const demoLocale = detail.demoLocale || heroDemoState.demoLocale;
  const config = HERO_DEMO_CONTRASTS[demoLocale] || HERO_DEMO_CONTRASTS.english;
  const [first, second] = config.words;

  return {
    exercise_id: config.words.map((word) => word.text.toLowerCase()).join('-'),
    pair_name: `${first.text.toUpperCase()} / ${second.text.toUpperCase()}`,
    sound_contrast: config.contrast,
    language: detail.runtimeLocale || heroDemoState.runtimeLocale,
    experience_surface: 'homepage',
    ...buildExerciseAttribution({
      eventName,
      pageSlug: 'homepage',
      locale: detail.runtimeLocale || heroDemoState.runtimeLocale,
    }),
  };
}

function getDemoConfig(runtimeLocale = heroDemoState.runtimeLocale) {
  const demoLocale = heroDemoState.forcedDemoLocale
    || RUNTIME_LOCALE_TO_DEMO_LOCALE[runtimeLocale]
    || 'english';

  return {
    demoLocale,
    config: HERO_DEMO_CONTRASTS[demoLocale] || HERO_DEMO_CONTRASTS.english,
  };
}

function syncHeroDemoState(snapshot = heroExercise?.getSnapshot()) {
  if (!snapshot) {
    return;
  }

  heroDemoState.round = snapshot.round;
  heroDemoState.correct = snapshot.correct;
  heroDemoState.targetIndex = snapshot.targetIndex;
  heroDemoState.stage = snapshot.stage;
  heroDemoState.playbackToken = snapshot.playbackToken;
  heroDemoState.audioUnlocked = snapshot.audioUnlocked;
  heroDemoState.hasCompletedDemo = snapshot.hasCompletedDemo;
}

function getExerciseOptions() {
  return {
    challengeMode: heroDemoState.isChallengeMode,
    maxRounds: DEMO_MAX_ROUNDS,
  };
}

function updateExerciseContext() {
  if (!heroExercise) {
    return;
  }

  const { config } = getDemoConfig();
  heroExercise.updateContext({
    nextContrast: config,
    nextUiLocale: heroDemoState.runtimeLocale,
    nextOptions: getExerciseOptions(),
  });
}

function buildExerciseEventDetail(eventName, detail = {}) {
  const baseDetail = {
    runtimeLocale: heroDemoState.runtimeLocale,
    demoLocale: heroDemoState.demoLocale,
    ...detail,
  };

  if (
    eventName === 'demo_started'
    || eventName === 'demo_completed'
    || eventName === 'challenge_completed'
  ) {
    return {
      ...baseDetail,
      exerciseParams: buildExerciseParams(eventName, baseDetail),
    };
  }

  return baseDetail;
}

function getChallengeSlug(demoLocale = heroDemoState.demoLocale) {
  const config = HERO_DEMO_CONTRASTS[demoLocale] || HERO_DEMO_CONTRASTS.english;
  return config.words.map((word) => word.text.toLowerCase()).join('-');
}

function findDemoLocaleBySlug(slug) {
  return Object.entries(HERO_DEMO_CONTRASTS).find(([, config]) => (
    config.words.map((word) => word.text.toLowerCase()).join('-') === slug
  ))?.[0] ?? null;
}

function buildChallengeUrl(runtimeLocale = heroDemoState.runtimeLocale, demoLocale = heroDemoState.demoLocale) {
  const url = new URL(window.location.href);
  const challengeRuntimeLocale = resolveRuntimeLocale(runtimeLocale) || 'en';
  url.searchParams.set(CHALLENGE_QUERY_PARAM, getChallengeSlug(demoLocale));
  url.searchParams.set(CHALLENGE_LANG_PARAM, challengeRuntimeLocale);
  return url.toString();
}

function readChallengeParams() {
  const url = new URL(window.location.href);
  const challengeSlug = url.searchParams.get(CHALLENGE_QUERY_PARAM)?.trim().toLowerCase() || null;
  const forcedDemoLocale = challengeSlug ? findDemoLocaleBySlug(challengeSlug) : null;
  const challengeRuntimeLocale = url.searchParams.get(CHALLENGE_LANG_PARAM);

  return {
    challengeSlug,
    forcedDemoLocale,
    challengeRuntimeLocale: resolveRuntimeLocale(challengeRuntimeLocale),
  };
}

function readExplicitHomepageRuntimeLocale() {
  const initialRuntimeLocale = resolveRuntimeLocale(document.body.dataset.initialRuntimeLocale);
  if (initialRuntimeLocale) {
    return initialRuntimeLocale;
  }

  const slug = window.location.pathname.replace(/^\/+|\/+$/g, '');
  return HOMEPAGE_ROUTE_BY_SLUG[slug]?.runtimeLocale || null;
}

function showStage(element, isVisible) {
  if (!element) {
    return;
  }

  element.classList.toggle('hero-demo-stage-hidden', !isVisible);
  element.setAttribute('aria-hidden', String(!isVisible));
}

function announce(message) {
  if (dom.heroDemoLive) {
    dom.heroDemoLive.textContent = message;
  }
}

function applyDirectionalSafety(element, isRtl) {
  if (!element) {
    return;
  }

  if (isRtl) {
    element.setAttribute('dir', 'auto');
    element.style.unicodeBidi = 'plaintext';
  } else {
    element.removeAttribute('dir');
    element.style.unicodeBidi = '';
  }
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

function markUserInteraction() {
  heroExercise?.unlockAudio();
  syncHeroDemoState();
}

function unlockPrimaryCta() {
  if (heroDemoState.ctaActivated) {
    return;
  }

  heroDemoState.ctaActivated = true;
  dom.heroPrimaryCta?.classList.remove(CTA_UNLOCKED_CLASS);
  dispatchDemoEvent('cta_promoted', {
    runtimeLocale: heroDemoState.runtimeLocale,
    demoLocale: heroDemoState.demoLocale,
  });
}

function updatePrimaryCtaText() {
  if (!dom.heroPrimaryCtaText) {
    return;
  }

  const key = heroDemoState.hasCompletedDemo ? 'demoPromotedCta' : 'ctaPrimary';
  dom.heroPrimaryCtaText.textContent = getTranslation(heroDemoState.runtimeLocale, key);
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

  if (!synthesis || !heroDemoState.audioUnlocked) {
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

function createHeroExercise() {
  const { config } = getDemoConfig();

  return createExercise({
    mount: {
      buildEventDetail: buildExerciseEventDetail,
      dispatchEvent: dispatchDemoEvent,
      getTargetIndex: () => Math.round(Math.random()),
      onFeedback(feedback, snapshot) {
        syncHeroDemoState(snapshot);

        if (!feedback) {
          if (dom.heroDemoFeedbackCopy) {
            dom.heroDemoFeedbackCopy.textContent = '';
          }
          return;
        }

        renderFeedback(feedback.selectedIndex, feedback.correct);
      },
      onStateChange(snapshot) {
        syncHeroDemoState(snapshot);
        renderDemo();
      },
      onPlaybackReady: unlockPrimaryCta,
      onListenPrompt: () => {
        announce(getTranslation(heroDemoState.runtimeLocale, 'demoListenPrompt'));
      },
      onFeedbackReady: () => {
        announce(dom.heroDemoFeedbackCopy?.textContent || '');
      },
      onPreviewPrompt: () => {
        announce(getTranslation(heroDemoState.runtimeLocale, 'demoHearDifference'));
      },
      playWord: (word, activeButton) => speakWord(word.text, activeButton),
      wait: (ms) => new Promise((resolve) => window.setTimeout(resolve, ms)),
    },
    contrast: config,
    uiLocale: heroDemoState.runtimeLocale,
    options: getExerciseOptions(),
  });
}

async function playWord(index, activeButton, { allowWithoutInteraction = false } = {}) {
  updateExerciseContext();
  return heroExercise?.playWord(index, activeButton, { allowWithoutInteraction });
}

function buildPreviewButton(word, index, action) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `hero-demo-word hero-demo-word-${action}`;
  button.dataset.wordIndex = String(index);
  button.dataset.action = action;
  button.setAttribute(
    'aria-label',
    formatMessage(getTranslation(heroDemoState.runtimeLocale, 'demoPlayWord'), { word: word.text })
  );

  const icon = document.createElement('span');
  icon.className = 'hero-demo-word-speaker';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = '🔊';

  const textWrap = document.createElement('span');
  textWrap.className = 'hero-demo-word-body';

  const wordText = document.createElement('span');
  wordText.className = 'hero-demo-word-text';
  wordText.lang = 'en';
  wordText.dir = 'ltr';
  wordText.textContent = word.text.toUpperCase();

  const wordIpa = document.createElement('span');
  wordIpa.className = 'hero-demo-word-ipa';
  wordIpa.textContent = word.ipa;

  textWrap.append(wordText, wordIpa);
  button.append(icon, textWrap);
  return button;
}

function buildGuessButton(word, index) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'hero-demo-word hero-demo-word-guess';
  button.dataset.wordIndex = String(index);
  button.dataset.action = 'guess';
  button.setAttribute(
    'aria-label',
    formatMessage(getTranslation(heroDemoState.runtimeLocale, 'demoChooseWord'), { word: word.text })
  );

  const wordText = document.createElement('span');
  wordText.className = 'hero-demo-word-text';
  wordText.lang = 'en';
  wordText.dir = 'ltr';
  wordText.textContent = word.text.toUpperCase();

  const wordIpa = document.createElement('span');
  wordIpa.className = 'hero-demo-word-ipa';
  wordIpa.textContent = word.ipa;

  button.append(wordText, wordIpa);
  return button;
}

function renderWordButtons() {
  const { config } = getDemoConfig();

  dom.heroDemoPreviewWords.replaceChildren(
    ...config.words.map((word, index) => buildPreviewButton(word, index, 'preview'))
  );

  dom.heroDemoGuessWords.replaceChildren(
    ...config.words.map((word, index) => buildGuessButton(word, index))
  );
}

function renderReplayButtons() {
  const { config } = getDemoConfig();
  const { isRtl } = getRuntimeLocaleMeta(heroDemoState.runtimeLocale);
  const replayLabel = document.createElement('p');
  replayLabel.className = 'hero-demo-replay-label';
  replayLabel.textContent = getTranslation(heroDemoState.runtimeLocale, 'demoReplayPrompt');
  applyDirectionalSafety(replayLabel, isRtl);

  const replayButtons = document.createElement('div');
  replayButtons.className = 'hero-demo-choices';
  replayButtons.append(
    ...config.words.map((word, index) => buildPreviewButton(word, index, 'replay'))
  );

  dom.heroDemoReplay.replaceChildren(replayLabel, replayButtons);
}

function renderFeedback(selectedIndex, isCorrect) {
  const { config } = getDemoConfig();
  const selectedWord = config.words[selectedIndex]?.text.toUpperCase() || '';
  const correctWord = config.words[heroDemoState.targetIndex]?.text.toUpperCase() || '';
  const feedbackStatus = getTranslation(
    heroDemoState.runtimeLocale,
    isCorrect ? 'demoFeedbackCorrect' : 'demoFeedbackIncorrect'
  );

  dom.heroDemoFeedbackCopy.textContent = [
    feedbackStatus,
    `${getTranslation(heroDemoState.runtimeLocale, 'demoYouChose')}: ${selectedWord}.`,
    `${getTranslation(heroDemoState.runtimeLocale, 'demoCorrectAnswer')}: ${correctWord}.`,
  ].join(' ');
}

function getDemoResultCopy(correctCount, totalCount) {
  if (correctCount === totalCount) {
    return {
      leadKey: 'demoSummaryAllCorrectLead',
      bodyKey: 'demoSummaryAllCorrectBody',
    };
  }

  if (correctCount === 0) {
    return {
      leadKey: 'demoSummaryNoneCorrectLead',
      bodyKey: 'demoSummaryNoneCorrectBody',
    };
  }

  return {
    leadKey: 'demoSummaryPartialCorrectLead',
    bodyKey: 'demoSummaryPartialCorrectBody',
  };
}

function renderSummary() {
  const correctCount = heroDemoState.correct;
  const totalCount = DEMO_MAX_ROUNDS;
  const resultCopy = getDemoResultCopy(correctCount, totalCount);

  dom.heroDemoSummaryLead.textContent = getTranslation(heroDemoState.runtimeLocale, resultCopy.leadKey);
  dom.heroDemoSummaryBody.textContent = getTranslation(heroDemoState.runtimeLocale, resultCopy.bodyKey);

  dom.heroDemoScore.textContent = formatMessage(
    getTranslation(heroDemoState.runtimeLocale, 'demoScore'),
    {
      correct: correctCount,
      total: totalCount,
      correctCount,
      totalCount,
    }
  );
}

function renderShareBlock() {
  const promptKey = heroDemoState.isChallengeMode ? 'challengeSharePrompt' : 'demoSharePrompt';
  const buttonKey = heroDemoState.isChallengeMode ? 'challengeShareButton' : 'demoShareButton';

  dom.heroSharePrompt.textContent = getTranslation(heroDemoState.runtimeLocale, promptKey);
  dom.heroShareButton.textContent = getTranslation(heroDemoState.runtimeLocale, buttonKey);
  dom.heroShareLink.value = buildChallengeUrl();
}

function renderChallengeMode() {
  document.body.classList.toggle(CHALLENGE_MODE_CLASS, heroDemoState.isChallengeMode);

  // hero-primer is aria-hidden while invisible; remove that attribute when
  // challenge mode makes it visible, and restore it when leaving challenge mode.
  if (dom.heroPrimer) {
    if (heroDemoState.isChallengeMode) {
      dom.heroPrimer.removeAttribute('aria-hidden');
    } else {
      dom.heroPrimer.setAttribute('aria-hidden', 'true');
    }
  }

  if (!heroDemoState.isChallengeMode) {
    return;
  }

  const { config } = getDemoConfig();
  const headline = getTranslation(heroDemoState.runtimeLocale, 'challengeHeadline');
  const intro = getTranslation(heroDemoState.runtimeLocale, 'challengeIntro');

  dom.heroTitle.textContent = headline;
  dom.heroPrimer.textContent = intro;
  dom.heroSubtitle.textContent = formatMessage(
    getTranslation(heroDemoState.runtimeLocale, 'demoShareText'),
    {
      word1: config.words[0].text.toUpperCase(),
      word2: config.words[1].text.toUpperCase(),
    }
  );
  dom.heroDemoStart.textContent = getTranslation(heroDemoState.runtimeLocale, 'challengePrimaryCta');
}

function renderDemo() {
  // Guard: dom.* is not populated until setupHeroDemo() runs.
  // applyRuntimeLanguage() is called before setupHeroDemo() on first load,
  // so we bail early here and let setupHeroDemo() call renderDemo() once ready.
  if (!dom.nativeLanguage) return;

  const { demoLocale, config } = getDemoConfig();
  const { isRtl } = getRuntimeLocaleMeta(heroDemoState.runtimeLocale);
  const visibleRound = Math.min(heroDemoState.round, DEMO_MAX_ROUNDS);
  const showSummary = heroDemoState.stage === 'summary';

  heroDemoState.demoLocale = demoLocale;
  updateExerciseContext();

  dom.nativeLanguage.value = heroDemoState.runtimeLocale;
  dom.heroDemoRound.textContent = formatMessage(
    getTranslation(heroDemoState.runtimeLocale, 'demoRoundLabel'),
    { current: visibleRound, total: DEMO_MAX_ROUNDS }
  );
  dom.heroDemoTitle.textContent = `${config.words[0].text.toUpperCase()} / ${config.words[1].text.toUpperCase()}`;
  dom.heroDemoContrast.textContent = config.contrast;
  dom.heroDemoPrompt.textContent = getTranslation(heroDemoState.runtimeLocale, 'demoHearDifference');
  dom.heroDemoTestPrompt.textContent = getTranslation(heroDemoState.runtimeLocale, 'demoListenPrompt');
  if (!heroDemoState.isChallengeMode) {
    dom.heroDemoStart.textContent = getTranslation(heroDemoState.runtimeLocale, 'demoStartTest');
  }
  dom.heroDemoPlay.textContent = getTranslation(heroDemoState.runtimeLocale, 'demoPlaySample');
  dom.heroDemoNext.textContent = getTranslation(heroDemoState.runtimeLocale, 'demoNextRound');
  dom.heroCtaRevealMessage.textContent = getTranslation(heroDemoState.runtimeLocale, 'demoReadyPrompt');
  dom.heroCtaRevealMeta.textContent = getTranslation(heroDemoState.runtimeLocale, 'demoPromotedMeta');

  applyDirectionalSafety(dom.heroDemoRound, isRtl);
  applyDirectionalSafety(dom.heroDemoPrompt, isRtl);
  applyDirectionalSafety(dom.heroDemoTestPrompt, isRtl);
  applyDirectionalSafety(dom.heroDemoFeedbackCopy, isRtl);
  applyDirectionalSafety(dom.heroDemoSummary, isRtl);
  applyDirectionalSafety(dom.heroCtaReveal, isRtl);
  applyDirectionalSafety(dom.heroShareBlock, isRtl);
  applyDirectionalSafety(dom.heroShareStatus, isRtl);
  dom.heroDemoTitle.setAttribute('dir', 'ltr');
  dom.heroDemoTitle.style.unicodeBidi = 'plaintext';

  renderWordButtons();
  renderReplayButtons();
  renderSummary();
  renderShareBlock();
  updatePrimaryCtaText();
  renderChallengeMode();

  showStage(dom.heroDemoPreview, heroDemoState.stage === 'preview');
  showStage(dom.heroDemoTest, heroDemoState.stage === 'test');
  showStage(dom.heroDemoFeedback, heroDemoState.stage === 'feedback' || showSummary);
  showStage(dom.heroDemoSummary, showSummary);
  showStage(dom.heroDemoNext, heroDemoState.stage === 'feedback' && heroDemoState.round < DEMO_MAX_ROUNDS);
  showStage(dom.heroCtaReveal, showSummary);
  showStage(dom.heroShareBlock, showSummary);
}

async function beginRoundTest() {
  updateExerciseContext();
  await heroExercise?.startRound(dom.heroDemoPlay);
}

async function handleGuess(selectedIndex) {
  updateExerciseContext();
  await heroExercise?.answer(selectedIndex);
}

function nextRound() {
  updateExerciseContext();
  heroExercise?.nextRound();
}

function syncLanguageMenu(runtimeLocale) {
  document.querySelectorAll('.lang-option').forEach((option) => {
    const isActive = option.dataset.lang === runtimeLocale;
    option.classList.toggle('is-active', isActive);
    if (isActive) {
      option.setAttribute('aria-current', 'page');
    } else {
      option.removeAttribute('aria-current');
    }
  });
}

function resetHeroDemoState() {
  updateExerciseContext();

  if (heroExercise) {
    syncHeroDemoState(heroExercise.reset({ notify: false }));
  } else {
    heroDemoState.round = 1;
    heroDemoState.correct = 0;
    heroDemoState.targetIndex = null;
    heroDemoState.stage = 'preview';
    heroDemoState.hasCompletedDemo = false;
    heroDemoState.playbackToken += 1;
    heroDemoState.audioUnlocked = false;
  }

  if (dom.heroDemoFeedbackCopy) {
    dom.heroDemoFeedbackCopy.textContent = '';
  }

  if (dom.heroShareStatus) {
    dom.heroShareStatus.textContent = '';
    showStage(dom.heroShareStatus, false);
  }

  if (dom.heroShareLinkWrap) {
    showStage(dom.heroShareLinkWrap, false);
  }
}

function applyRuntimeLanguage(runtimeLocale, { persist = false, translateDocument = true } = {}) {
  heroDemoState.runtimeLocale = resolveRuntimeLocale(runtimeLocale) || 'en';
  resetHeroDemoState();

  if (translateDocument) {
    if (persist) {
      setLanguage(heroDemoState.runtimeLocale);
    } else {
      applyTranslations(heroDemoState.runtimeLocale);
    }
  }

  syncLanguageMenu(heroDemoState.runtimeLocale);
  renderDemo();
}

function populateNativeLanguageDropdown() {
  if (!dom.nativeLanguage) {
    return;
  }

  const placeholder = dom.nativeLanguage.querySelector('option[value=""]');
  dom.nativeLanguage.replaceChildren();

  if (placeholder) {
    dom.nativeLanguage.append(placeholder);
  }

  HERO_DEMO_LOCALE_ORDER.forEach((demoLocale) => {
    const config = HERO_DEMO_CONTRASTS[demoLocale];
    const option = document.createElement('option');
    option.value = config.runtimeLocale;
    option.textContent = config.nativeName;
    dom.nativeLanguage.append(option);
  });
}

function handleGuessKeydown(event) {
  const buttons = [...dom.heroDemoGuessWords.querySelectorAll('.hero-demo-word')];
  const currentIndex = buttons.indexOf(document.activeElement);

  if (currentIndex === -1) {
    return;
  }

  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    event.preventDefault();
    buttons[(currentIndex + 1) % buttons.length]?.focus();
  }

  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    event.preventDefault();
    buttons[(currentIndex - 1 + buttons.length) % buttons.length]?.focus();
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    buttons[currentIndex]?.click();
  }
}

async function shareCurrentChallenge() {
  const { config } = getDemoConfig();
  const shareUrl = buildChallengeUrl();
  const shareText = formatMessage(
    getTranslation(heroDemoState.runtimeLocale, 'demoShareText'),
    {
      word1: config.words[0].text.toUpperCase(),
      word2: config.words[1].text.toUpperCase(),
    }
  );

  dom.heroShareLink.value = shareUrl;
  showStage(dom.heroShareStatus, true);

  if (navigator.share) {
    try {
      await navigator.share({
        title: getTranslation(heroDemoState.runtimeLocale, 'challengeHeadline'),
        text: shareText,
        url: shareUrl,
      });
      dom.heroShareStatus.textContent = getTranslation(heroDemoState.runtimeLocale, 'demoShareCopied');
      dispatchDemoEvent('challenge_shared', {
        runtimeLocale: heroDemoState.runtimeLocale,
        demoLocale: heroDemoState.demoLocale,
        method: 'web-share',
      });
      return;
    } catch (error) {
      if (error?.name === 'AbortError') {
        showStage(dom.heroShareStatus, false);
        return;
      }
    }
  }

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(shareUrl);
      dom.heroShareStatus.textContent = getTranslation(heroDemoState.runtimeLocale, 'demoShareCopied');
      dispatchDemoEvent('challenge_shared', {
        runtimeLocale: heroDemoState.runtimeLocale,
        demoLocale: heroDemoState.demoLocale,
        method: 'clipboard',
      });
      return;
    } catch {
      // Fall through to visible link fallback.
    }
  }

  dom.heroShareStatus.textContent = getTranslation(heroDemoState.runtimeLocale, 'demoShareFallback');
  showStage(dom.heroShareLinkWrap, true);
  dom.heroShareLink.focus();
  dom.heroShareLink.select();
  dispatchDemoEvent('challenge_shared', {
    runtimeLocale: heroDemoState.runtimeLocale,
    demoLocale: heroDemoState.demoLocale,
    method: 'visible-link',
  });
}

function setupHeroDemo() {
  dom.heroTitle = document.querySelector('[data-i18n="heroTitle"]');
  dom.heroPrimer = document.querySelector('.hero-primer');
  dom.heroSubtitle = document.querySelector('.hero-subtitle');
  dom.nativeLanguage = document.getElementById('native-language');
  dom.heroDemoRound = document.getElementById('hero-demo-round');
  dom.heroDemoTitle = document.getElementById('hero-demo-title');
  dom.heroDemoContrast = document.getElementById('hero-demo-contrast');
  dom.heroDemoPrompt = document.getElementById('hero-demo-prompt');
  dom.heroDemoPreview = document.getElementById('hero-demo-preview');
  dom.heroDemoPreviewWords = document.getElementById('hero-demo-preview-words');
  dom.heroDemoStart = document.getElementById('hero-demo-start');
  dom.heroDemoTest = document.getElementById('hero-demo-test');
  dom.heroDemoTestPrompt = document.getElementById('hero-demo-test-prompt');
  dom.heroDemoPlay = document.getElementById('hero-demo-play');
  dom.heroDemoGuessWords = document.getElementById('hero-demo-guess-words');
  dom.heroDemoFeedback = document.getElementById('hero-demo-feedback');
  dom.heroDemoFeedbackCopy = document.getElementById('hero-demo-feedback-copy');
  dom.heroDemoReplay = document.getElementById('hero-demo-replay');
  dom.heroDemoNext = document.getElementById('hero-demo-next');
  dom.heroDemoSummary = document.getElementById('hero-demo-summary');
  dom.heroDemoSummaryLead = document.getElementById('hero-demo-summary-lead');
  dom.heroDemoSummaryBody = document.getElementById('hero-demo-summary-body');
  dom.heroDemoScore = document.getElementById('hero-demo-score');
  dom.heroDemoLive = document.getElementById('hero-demo-live');
  dom.heroPrimaryCta = document.getElementById('hero-primary-cta');
  dom.heroPrimaryCtaText = document.getElementById('hero-primary-cta-text');
  dom.heroCtaReveal = document.getElementById('hero-cta-reveal');
  dom.heroCtaRevealMessage = document.getElementById('hero-cta-reveal-message');
  dom.heroCtaRevealMeta = document.getElementById('hero-cta-reveal-meta');
  dom.heroShareBlock = document.getElementById('hero-share-block');
  dom.heroSharePrompt = document.getElementById('hero-share-prompt');
  dom.heroShareButton = document.getElementById('hero-share-button');
  dom.heroShareStatus = document.getElementById('hero-share-status');
  dom.heroShareLinkWrap = document.getElementById('hero-share-link-wrap');
  dom.heroShareLink = document.getElementById('hero-share-link');
  heroExercise = createHeroExercise();
  syncHeroDemoState();

  populateNativeLanguageDropdown();

  dom.nativeLanguage?.addEventListener('change', (event) => {
    applyRuntimeLanguage(event.target.value, { persist: true });
    announce(getTranslation(heroDemoState.runtimeLocale, 'demoHearDifference'));
  });

  dom.heroDemoStart?.addEventListener('click', () => {
    markUserInteraction();
    beginRoundTest();
  });

  dom.heroDemoPlay?.addEventListener('click', () => {
    markUserInteraction();
    if (heroDemoState.targetIndex !== null) {
      playWord(heroDemoState.targetIndex, dom.heroDemoPlay);
    }
  });

  dom.heroDemoPreviewWords?.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action="preview"]');
    if (!button) {
      return;
    }

    markUserInteraction();
    playWord(Number(button.dataset.wordIndex), button);
  });

  dom.heroDemoReplay?.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action="replay"]');
    if (!button) {
      return;
    }

    markUserInteraction();
    playWord(Number(button.dataset.wordIndex), button);
  });

  dom.heroDemoGuessWords?.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action="guess"]');
    if (!button) {
      return;
    }

    markUserInteraction();
    handleGuess(Number(button.dataset.wordIndex));
  });

  dom.heroDemoGuessWords?.addEventListener('keydown', handleGuessKeydown);

  dom.heroDemoNext?.addEventListener('click', () => {
    markUserInteraction();
    nextRound();
  });

  dom.heroShareButton?.addEventListener('click', () => {
    markUserInteraction();
    shareCurrentChallenge();
  });

  // dom.* is now populated — render the demo for the first time.
  renderDemo();
}

function setupLanguageSwitcher() {
  const languageButton = document.getElementById('language-selector');
  const languageDropdown = document.getElementById('language-dropdown');

  languageButton?.addEventListener('click', () => {
    languageDropdown?.classList.toggle('show');
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.language-switcher')) {
      languageDropdown?.classList.remove('show');
    }
  });

  document.querySelectorAll('.lang-option').forEach((option) => {
    option.addEventListener('click', () => {
      languageDropdown?.classList.remove('show');
    });
  });
}

function setupFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');

    question?.addEventListener('click', () => {
      faqItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
        }
      });

      item.classList.toggle('active');
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

      event.preventDefault();

      const target = document.querySelector(href);
      if (target) {
        const navHeight = document.querySelector('.nav')?.offsetHeight || 70;
        const targetPosition = target.offsetTop - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });
}

function setupNavScrollEffect() {
  const nav = document.querySelector('.nav');

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      nav?.classList.add('scrolled');
      if (nav) {
        nav.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      }
    } else {
      nav?.classList.remove('scrolled');
      if (nav) {
        nav.style.boxShadow = 'none';
      }
    }
  });
}

function setupDemoPhoneMockup() {
  const demoPlayButton = document.querySelector('.demo-play');
  const optionButtons = document.querySelectorAll('.option-btn');
  const demoFeedback = document.querySelector('.demo-feedback');

  demoPlayButton?.addEventListener('click', () => {
    demoPlayButton.style.transform = 'scale(0.95)';
    window.setTimeout(() => {
      demoPlayButton.style.transform = '';
    }, 150);
  });

  optionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      optionButtons.forEach((optionButton) => optionButton.classList.remove('option-selected'));
      button.classList.add('option-selected');

      if (demoFeedback) {
        demoFeedback.style.display = 'flex';
      }
    });
  });
}

function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  const animateOnScroll = document.querySelectorAll(
    '.problem-card, .step, .science-card, .testimonial-card, .feature-card'
  );

  animateOnScroll.forEach((element) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
  });
}

function setupCtaTracking() {
  document.querySelectorAll('a[href*="apps.apple.com"]').forEach((link) => {
    link.addEventListener('click', () => {
      if (typeof window.gtag === 'function') {
        const buttonText = link.textContent.trim().replace(/\s+/g, ' ');

        // beacon transport sends reliably even as the page unloads — no need
        // to preventDefault or delay navigation.
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

function setupPerformanceMonitoring() {
  if (!('PerformanceObserver' in window)) {
    return;
  }

  const performanceObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
  });

  performanceObserver.observe({ entryTypes: ['largest-contentful-paint'] });
}

function warmSpeechVoices() {
  if (!window.speechSynthesis) {
    return;
  }

  window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    window.speechSynthesis.getVoices();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const challengeParams = readChallengeParams();
  const staticRuntimeLocale = resolveRuntimeLocale(document.body.dataset.initialRuntimeLocale);
  const currentLang = challengeParams.challengeRuntimeLocale
    || readExplicitHomepageRuntimeLocale()
    || getCurrentLanguage();

  heroDemoState.isChallengeMode = Boolean(challengeParams.forcedDemoLocale);
  heroDemoState.forcedDemoLocale = challengeParams.forcedDemoLocale;
  heroDemoState.challengeSlug = challengeParams.challengeSlug;

  // Localized routes already contain their visible L1 copy in the generated HTML.
  // Only translate the document when runtime state intentionally overrides that
  // static locale (for example, a challenge-language parameter or root-page
  // browser-language detection).
  const documentRuntimeLocale = staticRuntimeLocale || 'en';

  if (currentLang !== 'en' || currentLang !== documentRuntimeLocale) {
    applyRuntimeLanguage(currentLang, {
      persist: false,
      translateDocument: documentRuntimeLocale !== currentLang,
    });
  } else {
    // English fast path: state is already at English defaults, just mark
    // the language menu so the correct option shows as active.
    syncLanguageMenu('en');
  }

  // Critical above-fold setup — run synchronously.
  setupHeroDemo();
  setupLanguageSwitcher();
  setupCtaTracking();
  // Register before any demo interaction can dispatch soundwise:* events.
  setupFunnelTracking();

  // Non-critical setup — deferred to window 'load' which fires after all
  // resources (images, fonts) are fetched, reliably after FCP/LCP.
  // Using 'load' avoids the requestIdleCallback anti-pattern where the idle
  // callback fires before the browser commits the first paint under heavy
  // CPU throttling.
  window.addEventListener('load', () => {
    setupFaqAccordion();
    setupSmoothScroll();
    setupNavScrollEffect();
    setupDemoPhoneMockup();
    setupScrollAnimations();
    setupPerformanceMonitoring();
    warmSpeechVoices();

    if (heroDemoState.isChallengeMode) {
      dispatchDemoEvent('challenge_opened', {
        runtimeLocale: heroDemoState.runtimeLocale,
        demoLocale: heroDemoState.demoLocale,
        challengeSlug: heroDemoState.challengeSlug,
      });
    }

    announce(getTranslation(heroDemoState.runtimeLocale, 'demoHearDifference'));
  }, { once: true });
});
