import { heroDemoTranslations } from './hero-demo-translations.js';

const HERO_RUNTIME_LOCALE_BY_SEO_LOCALE = Object.freeze({
  ja: '日本語',
  zh: '中文',
  yue: '廣東話',
  ko: '한국어',
  es: 'idioma español',
  pt: 'Português',
  ar: 'اللغة العربية',
  'hi-ur': 'हिंदी/اردو',
  id: 'bahasa Indo',
  fa: 'زبان فارسی',
  ru: 'русский язык',
  tr: 'Türkçe',
  vi: 'Tiếng Việt',
});

// Every localized hero-demo zero-score body refers specifically to a vowel
// difference. It is reusable only on flagship pages that actually train a
// vowel contrast; consonant pages remain translation-gated.
const VOWEL_FLAGSHIP_LOCALES = new Set(['ja', 'zh', 'es', 'pt', 'id', 'ru', 'tr']);

function formatMessage(template, values) {
  return String(template).replace(/\{(\w+)\}/gu, (match, key) => (
    Object.hasOwn(values, key) ? values[key] : match
  ));
}

function buildFeedback(copy) {
  return ({ selectedWord, correctWord, correct }) => [
    correct ? copy.demoFeedbackCorrect : copy.demoFeedbackIncorrect,
    `${copy.demoYouChose}: ${selectedWord}.`,
    `${copy.demoCorrectAnswer}: ${correctWord}.`,
  ].join(' ');
}

function buildSummary(copy) {
  return ({ correct, total }) => {
    if (correct === total) {
      return {
        lead: copy.demoSummaryAllCorrectLead,
        body: copy.demoSummaryAllCorrectBody,
      };
    }

    if (correct === 0) {
      return {
        lead: copy.demoSummaryNoneCorrectLead,
        body: copy.demoSummaryNoneCorrectBody,
      };
    }

    return {
      lead: copy.demoSummaryPartialCorrectLead,
      body: copy.demoSummaryPartialCorrectBody,
    };
  };
}

function buildReusableCopy(copy, { includeSummary }) {
  const reusableCopy = {
    previewPrompt: copy.demoHearDifference,
    startButton: copy.demoStartTest,
    playButton: copy.demoPlaySample,
    testPrompt: copy.demoListenPrompt,
    feedbackReplayPrompt: copy.demoReplayPrompt,
    nextButton: copy.demoNextRound,
    listenPrompt: copy.demoListenPrompt,
    chooseWordLabel: (word) => formatMessage(copy.demoChooseWord, { word }),
    playWordLabel: (word) => formatMessage(copy.demoPlayWord, { word }),
    roundLabel: (round, total) => formatMessage(copy.demoRoundLabel, {
      current: round,
      total,
    }),
    scoreLabel: (correct, total) => formatMessage(copy.demoScore, {
      correct,
      total,
      correctCount: correct,
      totalCount: total,
    }),
    feedback: buildFeedback(copy),
    summaryCta: () => ({
      headline: copy.demoReadyPrompt,
      body: copy.demoValueSignal,
    }),
  };

  if (includeSummary) {
    reusableCopy.summary = buildSummary(copy);
  }

  return Object.freeze(reusableCopy);
}

export const SEO_EXERCISE_HERO_REUSE_BY_LOCALE = Object.freeze(
  Object.fromEntries(
    Object.entries(HERO_RUNTIME_LOCALE_BY_SEO_LOCALE).map(([locale, runtimeLocale]) => [
      locale,
      buildReusableCopy(heroDemoTranslations[runtimeLocale], {
        includeSummary: VOWEL_FLAGSHIP_LOCALES.has(locale),
      }),
    ])
  )
);
