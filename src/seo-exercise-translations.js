const DEFAULT_SEO_EXERCISE_LOCALE = 'en';

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
  nextStep: 'When you are ready, continue with the Soundwise app practice below.',
  speakerLabel: 'Listen',
  listenPrompt: 'Listen carefully. Which word did you hear?',
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
  nextStep: 'เมื่อพร้อมแล้ว ฝึกต่อในแอป Soundwise ด้านล่าง',
  speakerLabel: 'ฟัง',
  listenPrompt: 'ตั้งใจฟัง คุณได้ยินคำไหน',
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
};

export const SEO_EXERCISE_TRANSLATIONS = {
  en: englishSeoExerciseCopy,
  th: thaiSeoExerciseCopy,
};

function normalizeLocale(locale) {
  return (locale || '').trim().toLowerCase();
}

export function resolveSeoExerciseLocale(locale) {
  const normalizedLocale = normalizeLocale(locale);

  if (SEO_EXERCISE_TRANSLATIONS[normalizedLocale]) {
    return normalizedLocale;
  }

  const baseLocale = normalizedLocale.split('-')[0];

  return SEO_EXERCISE_TRANSLATIONS[baseLocale]
    ? baseLocale
    : DEFAULT_SEO_EXERCISE_LOCALE;
}

export function getSeoExerciseCopy(locale) {
  const resolvedLocale = resolveSeoExerciseLocale(locale);
  const localizedCopy = SEO_EXERCISE_TRANSLATIONS[resolvedLocale] || {};

  return {
    ...englishSeoExerciseCopy,
    ...localizedCopy,
    locale: resolvedLocale,
  };
}
