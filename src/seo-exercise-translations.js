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
