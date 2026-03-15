import './style.css';
import { applyTranslations, getCurrentLanguage, setLanguage, translations } from './i18n.js';
import { getRuntimeLocaleMeta } from './landing-copy-runtime.js';
import {
  HERO_DEMO_CONTRASTS,
  HERO_DEMO_LOCALE_ORDER,
  RUNTIME_LOCALE_TO_DEMO_LOCALE,
} from './hero-demo-config.js';

const DEMO_MAX_ROUNDS = 2;
const CTA_UNLOCKED_CLASS = 'is-muted';

const heroDemoState = {
  runtimeLocale: 'en',
  demoLocale: 'english',
  round: 1,
  correct: 0,
  targetIndex: null,
  stage: 'preview',
  ctaActivated: false,
  playbackToken: 0,
};

const dom = {};

function getTranslation(locale, key) {
  return translations[locale]?.[key] ?? translations.en?.[key] ?? '';
}

function formatMessage(template, replacements = {}) {
  return Object.entries(replacements).reduce(
    (message, [token, value]) => message.replaceAll(`{${token}}`, String(value)),
    template
  );
}

function getDemoConfig(runtimeLocale) {
  const demoLocale = RUNTIME_LOCALE_TO_DEMO_LOCALE[runtimeLocale] || 'english';

  return {
    demoLocale,
    config: HERO_DEMO_CONTRASTS[demoLocale] || HERO_DEMO_CONTRASTS.english,
  };
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

function unlockPrimaryCta() {
  if (heroDemoState.ctaActivated) {
    return;
  }

  heroDemoState.ctaActivated = true;
  dom.heroPrimaryCta?.classList.remove(CTA_UNLOCKED_CLASS);
}

function updatePrimaryCtaText() {
  if (!dom.heroPrimaryCtaText) {
    return;
  }

  const key = heroDemoState.stage === 'summary' ? 'demoUnlockCta' : 'ctaPrimary';
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

  if (!synthesis) {
    return Promise.resolve();
  }

  synthesis.cancel();

  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.82;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = synthesis.getVoices();
    const preferredVoice = voices.find((voice) => (
      voice.lang.startsWith('en-US')
      && (
        voice.name.includes('Google')
        || voice.name.includes('Microsoft')
        || voice.name.includes('Samantha')
      )
    ));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    const complete = () => {
      setButtonBusy(activeButton, false);
      resolve();
    };

    utterance.onend = complete;
    utterance.onerror = complete;

    setButtonBusy(activeButton, true);
    synthesis.speak(utterance);
  });
}

async function playWord(index, activeButton) {
  const { config } = getDemoConfig(heroDemoState.runtimeLocale);
  const word = config.words[index];

  if (!word) {
    return;
  }

  unlockPrimaryCta();
  await speakWord(word.text, activeButton);
}

async function replayContrast() {
  const { config } = getDemoConfig(heroDemoState.runtimeLocale);
  const playbackToken = ++heroDemoState.playbackToken;

  for (const word of config.words) {
    if (playbackToken !== heroDemoState.playbackToken) {
      return;
    }

    await speakWord(word.text);
    await new Promise((resolve) => window.setTimeout(resolve, 240));
  }
}

function buildWordButton(word, index, action, labelKey) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `hero-demo-word hero-demo-word-${action}`;
  button.dataset.wordIndex = String(index);
  button.dataset.action = action;
  button.setAttribute(
    'aria-label',
    `${getTranslation(heroDemoState.runtimeLocale, labelKey)}: ${word.text}`
  );

  const wordText = document.createElement('span');
  wordText.className = 'hero-demo-word-text';
  wordText.lang = 'en';
  wordText.dir = 'ltr';
  wordText.textContent = word.text.toUpperCase();

  const wordIpa = document.createElement('span');
  wordIpa.className = 'hero-demo-word-ipa';
  wordIpa.textContent = word.ipa;

  const wordIcon = document.createElement('span');
  wordIcon.className = 'hero-demo-word-icon';
  wordIcon.setAttribute('aria-hidden', 'true');
  wordIcon.textContent = 'Play';

  button.append(wordText, wordIpa, wordIcon);
  return button;
}

function renderWordButtons() {
  const { config } = getDemoConfig(heroDemoState.runtimeLocale);

  dom.heroDemoPreviewWords.replaceChildren(
    ...config.words.map((word, index) => buildWordButton(word, index, 'preview', 'demoPlayWord'))
  );

  dom.heroDemoGuessWords.replaceChildren(
    ...config.words.map((word, index) => buildWordButton(word, index, 'guess', 'demoChooseWord'))
  );
}

function renderReplayButtons() {
  const { config } = getDemoConfig(heroDemoState.runtimeLocale);
  const { isRtl } = getRuntimeLocaleMeta(heroDemoState.runtimeLocale);
  const replayLabel = document.createElement('p');
  replayLabel.className = 'hero-demo-replay-label';
  replayLabel.textContent = getTranslation(heroDemoState.runtimeLocale, 'demoReplayPrompt');
  applyDirectionalSafety(replayLabel, isRtl);

  const replayButtons = document.createElement('div');
  replayButtons.className = 'hero-demo-choices';
  replayButtons.append(
    ...config.words.map((word, index) => buildWordButton(word, index, 'replay', 'demoPlayWord'))
  );

  dom.heroDemoReplay.replaceChildren(replayLabel, replayButtons);
}

function renderFeedback(selectedIndex, isCorrect) {
  const { config } = getDemoConfig(heroDemoState.runtimeLocale);
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

function renderSummary() {
  dom.heroDemoScore.textContent = formatMessage(
    getTranslation(heroDemoState.runtimeLocale, 'demoScore'),
    { correct: heroDemoState.correct, total: DEMO_MAX_ROUNDS }
  );
}

function renderDemo() {
  const { config } = getDemoConfig(heroDemoState.runtimeLocale);
  const { isRtl } = getRuntimeLocaleMeta(heroDemoState.runtimeLocale);
  const visibleRound = Math.min(heroDemoState.round, DEMO_MAX_ROUNDS);

  dom.nativeLanguage.value = heroDemoState.runtimeLocale;
  dom.heroDemoRound.textContent = formatMessage(
    getTranslation(heroDemoState.runtimeLocale, 'demoRoundLabel'),
    { current: visibleRound, total: DEMO_MAX_ROUNDS }
  );
  dom.heroDemoTitle.textContent = `${config.words[0].text.toUpperCase()} / ${config.words[1].text.toUpperCase()}`;
  dom.heroDemoContrast.textContent = config.contrast;
  dom.heroDemoPrompt.textContent = getTranslation(heroDemoState.runtimeLocale, 'demoHearDifference');
  dom.heroDemoTestPrompt.textContent = getTranslation(heroDemoState.runtimeLocale, 'demoListenPrompt');
  dom.heroDemoStart.textContent = getTranslation(heroDemoState.runtimeLocale, 'demoStartTest');
  dom.heroDemoPlay.textContent = getTranslation(heroDemoState.runtimeLocale, 'demoPlaySample');
  dom.heroDemoNext.textContent = getTranslation(heroDemoState.runtimeLocale, 'demoNextRound');

  applyDirectionalSafety(dom.heroDemoRound, isRtl);
  applyDirectionalSafety(dom.heroDemoPrompt, isRtl);
  applyDirectionalSafety(dom.heroDemoTestPrompt, isRtl);
  applyDirectionalSafety(dom.heroDemoFeedbackCopy, isRtl);
  applyDirectionalSafety(dom.heroDemoScore, isRtl);
  applyDirectionalSafety(dom.heroDemoSummary, isRtl);
  dom.heroDemoTitle.setAttribute('dir', 'ltr');
  dom.heroDemoTitle.style.unicodeBidi = 'plaintext';

  renderWordButtons();
  renderReplayButtons();
  renderSummary();
  updatePrimaryCtaText();

  showStage(dom.heroDemoPreview, heroDemoState.stage === 'preview');
  showStage(dom.heroDemoTest, heroDemoState.stage === 'test');
  showStage(dom.heroDemoFeedback, heroDemoState.stage === 'feedback' || heroDemoState.stage === 'summary');
  showStage(dom.heroDemoSummary, heroDemoState.stage === 'summary');
  showStage(dom.heroDemoNext, heroDemoState.stage === 'feedback' && heroDemoState.round < DEMO_MAX_ROUNDS);
}

async function beginRoundTest() {
  heroDemoState.stage = 'test';
  heroDemoState.targetIndex = Math.round(Math.random());
  dom.heroDemoFeedbackCopy.textContent = '';
  renderDemo();
  unlockPrimaryCta();
  announce(getTranslation(heroDemoState.runtimeLocale, 'demoListenPrompt'));
  await playWord(heroDemoState.targetIndex, dom.heroDemoPlay);
}

async function handleGuess(selectedIndex) {
  if (heroDemoState.stage !== 'test' || heroDemoState.targetIndex === null) {
    return;
  }

  const isCorrect = selectedIndex === heroDemoState.targetIndex;
  if (isCorrect) {
    heroDemoState.correct += 1;
  }

  heroDemoState.stage = heroDemoState.round >= DEMO_MAX_ROUNDS ? 'summary' : 'feedback';
  renderFeedback(selectedIndex, isCorrect);
  renderDemo();
  unlockPrimaryCta();
  announce(dom.heroDemoFeedbackCopy.textContent || '');
  await replayContrast();
}

function nextRound() {
  if (heroDemoState.stage !== 'feedback' || heroDemoState.round >= DEMO_MAX_ROUNDS) {
    return;
  }

  heroDemoState.round += 1;
  heroDemoState.targetIndex = null;
  heroDemoState.stage = 'preview';
  dom.heroDemoFeedbackCopy.textContent = '';
  renderDemo();
  announce(getTranslation(heroDemoState.runtimeLocale, 'demoHearDifference'));
}

function syncLanguageMenu(runtimeLocale) {
  document.querySelectorAll('.lang-option').forEach((option) => {
    option.classList.toggle('is-active', option.dataset.lang === runtimeLocale);
    option.setAttribute('aria-pressed', String(option.dataset.lang === runtimeLocale));
  });
}

function resetHeroDemoState() {
  heroDemoState.round = 1;
  heroDemoState.correct = 0;
  heroDemoState.targetIndex = null;
  heroDemoState.stage = 'preview';
  heroDemoState.playbackToken += 1;

  if (dom.heroDemoFeedbackCopy) {
    dom.heroDemoFeedbackCopy.textContent = '';
  }
}

function applyRuntimeLanguage(runtimeLocale, { persist = false } = {}) {
  heroDemoState.runtimeLocale = translations[runtimeLocale] ? runtimeLocale : 'en';
  heroDemoState.demoLocale = getDemoConfig(heroDemoState.runtimeLocale).demoLocale;
  resetHeroDemoState();

  if (persist) {
    setLanguage(heroDemoState.runtimeLocale);
  } else {
    applyTranslations(heroDemoState.runtimeLocale);
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
}

function setupHeroDemo() {
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
  dom.heroDemoScore = document.getElementById('hero-demo-score');
  dom.heroDemoLive = document.getElementById('hero-demo-live');
  dom.heroPrimaryCta = document.getElementById('hero-primary-cta');
  dom.heroPrimaryCtaText = document.getElementById('hero-primary-cta-text');

  populateNativeLanguageDropdown();

  dom.nativeLanguage?.addEventListener('change', (event) => {
    applyRuntimeLanguage(event.target.value, { persist: true });
    announce(getTranslation(heroDemoState.runtimeLocale, 'demoHearDifference'));
  });

  dom.heroDemoStart?.addEventListener('click', () => {
    beginRoundTest();
  });

  dom.heroDemoPlay?.addEventListener('click', () => {
    if (heroDemoState.targetIndex !== null) {
      playWord(heroDemoState.targetIndex, dom.heroDemoPlay);
    }
  });

  dom.heroDemoPreviewWords?.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action="preview"]');
    if (!button) {
      return;
    }

    playWord(Number(button.dataset.wordIndex), button);
  });

  dom.heroDemoReplay?.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action="replay"]');
    if (!button) {
      return;
    }

    playWord(Number(button.dataset.wordIndex), button);
  });

  dom.heroDemoGuessWords?.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action="guess"]');
    if (!button) {
      return;
    }

    handleGuess(Number(button.dataset.wordIndex));
  });

  dom.heroDemoGuessWords?.addEventListener('keydown', handleGuessKeydown);

  dom.heroDemoNext?.addEventListener('click', () => {
    nextRound();
  });
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
    option.addEventListener('click', (event) => {
      const runtimeLocale = event.currentTarget.dataset.lang;
      applyRuntimeLanguage(runtimeLocale, { persist: true });
      languageDropdown?.classList.remove('show');
      announce(getTranslation(heroDemoState.runtimeLocale, 'demoHearDifference'));
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
  document.querySelectorAll('.btn-primary').forEach((button) => {
    button.addEventListener('click', () => {
      const buttonText = button.textContent.trim();
      console.log(`CTA clicked: ${buttonText}`);
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
  const currentLang = getCurrentLanguage();

  setupHeroDemo();
  setupLanguageSwitcher();
  setupFaqAccordion();
  setupSmoothScroll();
  setupNavScrollEffect();
  setupDemoPhoneMockup();
  setupScrollAnimations();
  setupCtaTracking();
  setupPerformanceMonitoring();
  warmSpeechVoices();

  applyRuntimeLanguage(currentLang, { persist: false });
  announce(getTranslation(heroDemoState.runtimeLocale, 'demoHearDifference'));

  document.body.style.opacity = '0';
  window.setTimeout(() => {
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '1';
  }, 100);

  console.log('Soundwise landing page ready');
});
