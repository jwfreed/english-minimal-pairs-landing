import { SEO_EXERCISE_HERO_REUSE_BY_LOCALE } from './seo-exercise-translation-reuse.js';

const DEFAULT_SEO_EXERCISE_LOCALE = 'en';

export const SEO_EXERCISE_REQUIRED_KEYS = Object.freeze([
  'label',
  'previewChoicesAriaLabel',
  'guessChoicesAriaLabel',
  'replayChoicesAriaLabel',
  'liveInitial',
  'previewPrompt',
  'startButton',
  'playButton',
  'testPrompt',
  'feedbackReplayPrompt',
  'nextButton',
  'speakerLabel',
  'audioUnavailable',
  'listenPrompt',
  'feedbackContrast',
  'generalizationHeading',
  'generalizationBody',
  'chooseWordLabel',
  'playWordLabel',
  'roundLabel',
  'scoreLabel',
  'feedback',
  'summary',
  'summaryCta',
]);

const SEO_EXERCISE_FUNCTION_KEYS = new Set([
  'feedbackContrast',
  'generalizationHeading',
  'chooseWordLabel',
  'playWordLabel',
  'roundLabel',
  'scoreLabel',
  'feedback',
  'summary',
  'summaryCta',
]);

const SEO_EXERCISE_LOCALE_ALIASES = Object.freeze({
  hi: 'hi-ur',
  ur: 'hi-ur',
  'zh-hant-hk': 'yue',
  'zh-hk': 'yue',
  yue: 'yue',
});

const englishSeoExerciseCopy = {
  label: 'Try this contrast',
  previewChoicesAriaLabel: 'Preview the two words',
  guessChoicesAriaLabel: 'Choose the word you heard',
  replayChoicesAriaLabel: 'Replay the contrast',
  liveInitial: 'Hear the contrast, then test your ear.',
  previewPrompt: 'Listen to both words first.',
  startButton: 'Start the listening test',
  playButton: 'Play the sample',
  testPrompt: 'Which word did you hear?',
  feedbackReplayPrompt: 'Listen again:',
  nextButton: 'Try one more round',
  speakerLabel: 'Listen',
  audioUnavailable: 'Audio playback is unavailable. Enable sound or try a browser with speech playback before answering.',
  listenPrompt: 'Listen carefully. Which word did you hear?',
  feedbackContrast: (contrast) => `The contrast is ${contrast}.`,
  generalizationHeading: (contrast) => `You practiced ${contrast}. Try another example.`,
  generalizationBody: 'These pairs use the same sound contrast.',
  chooseWordLabel: (word) => `Choose ${word}`,
  playWordLabel: (word) => `Play pronunciation for ${word}`,
  roundLabel: (round, total) => `Round ${round} of ${total}`,
  scoreLabel: (correct, total) => `You got ${correct} out of ${total} correct.`,
  feedback: ({ selectedWord, correctWord, correct }) => {
    const status = correct ? 'Correct.' : 'Not quite.';
    return `${status} You chose: ${selectedWord}. Correct answer: ${correctWord}.`;
  },
  summary: ({ correct, total }) => {
    if (correct === total) {
      return {
        lead: 'Nice work - you heard the contrast.',
        body: 'Keep practicing across more voices and word pairs so the distinction becomes automatic.',
      };
    }

    if (correct === 0) {
      return {
        lead: 'This contrast needs more ear training.',
        body: 'That is normal. Focused listening practice helps your brain separate sounds that used to feel identical.',
      };
    }

    return {
      lead: 'You are starting to hear the contrast.',
      body: 'A few more focused repetitions can help make the difference clearer.',
    };
  },
  summaryCta: ({ correct, total }) => {
    if (correct === total) {
      return {
        headline: 'Keep building your listening skills',
        body: `You got ${correct} out of ${total} correct. Continue with more English sound contrasts in Soundwise.`,
      };
    }

    return {
      headline: 'Keep training this sound contrast',
      body: `You got ${correct} out of ${total} correct. A little more listening practice can make this contrast easier to recognize.`,
    };
  },
};

const thaiSeoExerciseCopy = {
  label: 'ลองฝึกคู่เสียงนี้',
  previewChoicesAriaLabel: 'ฟังตัวอย่างสองคำ',
  guessChoicesAriaLabel: 'เลือกคำที่คุณได้ยิน',
  replayChoicesAriaLabel: 'ฟังคู่เสียงนี้อีกครั้ง',
  liveInitial: 'ฟังคู่เสียงนี้ แล้วทดสอบการฟังของคุณ',
  previewPrompt: 'ฟังทั้งสองคำก่อน',
  startButton: 'เริ่มแบบทดสอบการฟัง',
  playButton: 'เล่นเสียงตัวอย่าง',
  testPrompt: 'คุณได้ยินคำไหน',
  feedbackReplayPrompt: 'ฟังอีกครั้ง:',
  nextButton: 'ลองอีกหนึ่งรอบ',
  speakerLabel: 'ฟัง',
  audioUnavailable: 'ไม่สามารถเล่นเสียงได้ โปรดเปิดเสียงหรือลองใช้เบราว์เซอร์ที่รองรับการเล่นเสียงก่อนตอบ',
  listenPrompt: 'ตั้งใจฟัง คุณได้ยินคำไหน',
  feedbackContrast: (contrast) => `คู่เสียงนี้คือ ${contrast}`,
  generalizationHeading: (contrast) => `คุณฝึกคู่เสียง ${contrast} แล้ว ลองตัวอย่างอื่น`,
  generalizationBody: 'คู่คำเหล่านี้ใช้ความต่างของเสียงเดียวกัน',
  chooseWordLabel: (word) => `เลือก ${word}`,
  playWordLabel: (word) => `ฟังการออกเสียงของ ${word}`,
  roundLabel: (round, total) => `รอบที่ ${round} จาก ${total}`,
  scoreLabel: (correct, total) => `คุณตอบถูก ${correct} จาก ${total} ข้อ`,
  feedback: ({ selectedWord, correctWord, correct }) => {
    const status = correct ? 'ถูกต้อง' : 'ยังไม่ใช่';
    return `${status} คุณเลือก: ${selectedWord} คำตอบที่ถูกต้อง: ${correctWord}`;
  },
  summary: ({ correct, total }) => {
    if (correct === total) {
      return {
        lead: 'ดีมาก คุณฟังความต่างของเสียงนี้ออกแล้ว',
        body: 'ฝึกต่อกับเสียงและคู่คำอื่น ๆ เพื่อให้แยกเสียงได้เป็นธรรมชาติ',
      };
    }

    if (correct === 0) {
      return {
        lead: 'คู่เสียงนี้ยังต้องฝึกฟังเพิ่ม',
        body: 'เป็นเรื่องปกติ การฝึกฟังแบบเจาะจงช่วยให้สมองแยกเสียงที่เคยฟังคล้ายกันได้',
      };
    }

    return {
      lead: 'คุณเริ่มฟังความต่างของเสียงนี้ออกแล้ว',
      body: 'ฝึกซ้ำอีกเล็กน้อยจะช่วยให้ความต่างชัดขึ้น',
    };
  },
  summaryCta: ({ correct, total }) => {
    if (correct === total) {
      return {
        headline: 'พัฒนาทักษะการฟังของคุณต่อไป',
        body: `คุณตอบถูก ${correct} จาก ${total} ข้อ ฝึกแยกคู่เสียงภาษาอังกฤษอื่น ๆ ต่อใน Soundwise`,
      };
    }

    return {
      headline: 'ฝึกแยกคู่เสียงนี้ต่อ',
      body: `คุณตอบถูก ${correct} จาก ${total} ข้อ การฝึกฟังเพิ่มอีกเล็กน้อยจะช่วยให้แยกคู่เสียงนี้ได้ง่ายขึ้น`,
    };
  },
};

export const SEO_EXERCISE_TRANSLATION_CANDIDATES = Object.freeze({
  ...SEO_EXERCISE_HERO_REUSE_BY_LOCALE,
  en: englishSeoExerciseCopy,
  th: thaiSeoExerciseCopy,
});

function normalizeLocale(locale) {
  return (locale || '').trim().toLowerCase();
}

function resolveCandidateLocale(locale) {
  const normalizedLocale = normalizeLocale(locale);

  if (!normalizedLocale) {
    return DEFAULT_SEO_EXERCISE_LOCALE;
  }

  const aliasedLocale = SEO_EXERCISE_LOCALE_ALIASES[normalizedLocale];
  if (aliasedLocale) {
    return aliasedLocale;
  }

  if (SEO_EXERCISE_TRANSLATION_CANDIDATES[normalizedLocale]) {
    return normalizedLocale;
  }

  const baseLocale = normalizedLocale.split('-')[0];
  return SEO_EXERCISE_LOCALE_ALIASES[baseLocale] || baseLocale;
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function callSafely(formatter, ...args) {
  try {
    return formatter(...args);
  } catch {
    return null;
  }
}

function includesValues(value, expectedValues) {
  return isNonEmptyString(value)
    && expectedValues.every((expected) => value.includes(String(expected)));
}

function hasMessagePair(value, firstKey, secondKey) {
  return Boolean(
    value
    && isNonEmptyString(value[firstKey])
    && isNonEmptyString(value[secondKey])
  );
}

function hasRequiredFunctionOutput(copy, key) {
  const formatter = copy?.[key];
  if (typeof formatter !== 'function') {
    return false;
  }

  if (key === 'feedbackContrast' || key === 'generalizationHeading') {
    return includesValues(callSafely(formatter, '/ɪ/ vs /iː/'), ['/ɪ/ vs /iː/']);
  }

  if (key === 'chooseWordLabel' || key === 'playWordLabel') {
    return includesValues(callSafely(formatter, 'SHEEP'), ['SHEEP']);
  }

  if (key === 'roundLabel' || key === 'scoreLabel') {
    return includesValues(callSafely(formatter, 1, 2), [1, 2]);
  }

  if (key === 'feedback') {
    return [true, false].every((correct) => includesValues(callSafely(formatter, {
      selectedWord: 'SHIP',
      correctWord: 'SHEEP',
      correct,
    }), ['SHIP', 'SHEEP']));
  }

  if (key === 'summary') {
    return [
      { correct: 2, total: 2 },
      { correct: 1, total: 2 },
      { correct: 0, total: 2 },
    ].every((snapshot) => hasMessagePair(callSafely(formatter, snapshot), 'lead', 'body'));
  }

  if (key === 'summaryCta') {
    return [
      { correct: 2, total: 2 },
      { correct: 1, total: 2 },
    ].every((snapshot) => hasMessagePair(callSafely(formatter, snapshot), 'headline', 'body'));
  }

  return false;
}

function hasRequiredValue(copy, key) {
  return SEO_EXERCISE_FUNCTION_KEYS.has(key)
    ? hasRequiredFunctionOutput(copy, key)
    : isNonEmptyString(copy?.[key]);
}

export function getMissingSeoExerciseKeys(copy) {
  return SEO_EXERCISE_REQUIRED_KEYS
    .filter((key) => !hasRequiredValue(copy, key))
    .sort();
}

export function getSeoExerciseTranslationStatus(locale) {
  const candidateLocale = resolveCandidateLocale(locale);
  const copy = SEO_EXERCISE_TRANSLATION_CANDIDATES[candidateLocale];
  const missingKeys = getMissingSeoExerciseKeys(copy);

  return {
    locale: candidateLocale,
    complete: Boolean(copy) && missingKeys.length === 0,
    missingKeys,
  };
}

export function hasCompleteSeoExerciseTranslation(locale) {
  return getSeoExerciseTranslationStatus(locale).complete;
}

export const SEO_EXERCISE_TRANSLATIONS = Object.freeze(
  Object.fromEntries(
    Object.entries(SEO_EXERCISE_TRANSLATION_CANDIDATES)
      .filter(([locale]) => hasCompleteSeoExerciseTranslation(locale))
  )
);

export function resolveSeoExerciseLocale(locale) {
  const status = getSeoExerciseTranslationStatus(locale);
  return status.complete ? status.locale : null;
}

export function getSeoExerciseCopy(locale) {
  const resolvedLocale = resolveSeoExerciseLocale(locale);

  if (!resolvedLocale) {
    return null;
  }

  return Object.freeze({
    ...SEO_EXERCISE_TRANSLATIONS[resolvedLocale],
    locale: resolvedLocale,
  });
}
