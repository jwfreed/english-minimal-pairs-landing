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

function createSummary({ perfect, partial, zero }) {
  return ({ correct, total }) => {
    if (correct === total) {
      return perfect;
    }

    if (correct === 0) {
      return zero;
    }

    return partial;
  };
}

const localizedSeoExerciseSupplementByLocale = Object.freeze({
  ja: {
    label: 'この音の違いを試す',
    previewChoicesAriaLabel: '2つの単語の試聴',
    guessChoicesAriaLabel: '聞こえた単語の選択',
    replayChoicesAriaLabel: '音の違いの再生',
    liveInitial: '音の違いを聞いてから、聞き取りを試してみましょう。',
    previewPrompt: 'まず2つの単語を聞いてみましょう。',
    testPrompt: 'どちらの単語が聞こえましたか？',
    speakerLabel: '聞く',
    audioUnavailable: '音声を再生できません。回答する前に、音を有効にするか、音声読み上げに対応したブラウザをお試しください。',
    feedbackContrast: (contrast) => `この音の違いは ${contrast} です。`,
    generalizationHeading: (contrast) => `${contrast} を練習しました。別の例も試してみましょう。`,
    generalizationBody: 'これらの単語ペアは同じ音の違いを使っています。',
  },
  zh: {
    label: '试试这组声音对比',
    previewChoicesAriaLabel: '试听这两个单词',
    guessChoicesAriaLabel: '选择你听到的单词',
    replayChoicesAriaLabel: '重听这组对比',
    liveInitial: '先听这组对比，再测试你的听力。',
    previewPrompt: '先听这两个单词。',
    testPrompt: '你听到的是哪个单词？',
    speakerLabel: '听',
    audioUnavailable: '无法播放音频。请先开启声音，或换用支持语音播放的浏览器，然后再作答。',
    feedbackContrast: (contrast) => `这组对比是 ${contrast}。`,
    generalizationHeading: (contrast) => `你练习了 ${contrast}。再试一个例子。`,
    generalizationBody: '这些词对使用同一组声音对比。',
  },
  yue: {
    label: '試吓呢組對比',
    previewChoicesAriaLabel: '試聽呢兩個字',
    guessChoicesAriaLabel: '揀你聽到嘅字',
    replayChoicesAriaLabel: '再聽呢組對比',
    liveInitial: '先聽呢組對比，然後試吓你隻耳。',
    previewPrompt: '先聽吓呢兩個字。',
    testPrompt: '你聽到邊個字？',
    speakerLabel: '聽',
    audioUnavailable: '播唔到聲音。答之前請先開聲，或者換去支援語音播放嘅瀏覽器。',
    feedbackContrast: (contrast) => `呢組對比係 ${contrast}。`,
    generalizationHeading: (contrast) => `你練咗 ${contrast}。再試另一個例子。`,
    generalizationBody: '呢啲字用嘅係同一組聲音分別。',
    summary: createSummary({
      perfect: { lead: '做得好 — 你聽到呢個音嘅分別啦。', body: '今次你聽得好清楚。用唔同嘅字同唔同把聲再聽同一組對比,可以令呢個分別越聽越熟。' },
      partial: { lead: '呢兩個音真係好難分。', body: '你聽到部分分別。專心練習聽力,可以幫你留意到字同字之間有咩唔同。' },
      zero: { lead: '呢組對比仲需要多啲辨音練習。', body: '咁係好正常。專心練習聽力，可以幫你嘅腦分辨以前聽落一樣嘅聲音。' },
    }),
  },
  ko: {
    label: '이 소리 차이 연습해 보기',
    previewChoicesAriaLabel: '두 단어 미리 듣기',
    guessChoicesAriaLabel: '들린 단어 선택',
    replayChoicesAriaLabel: '소리 차이 다시 듣기',
    liveInitial: '소리 차이를 먼저 들어 보고, 귀를 시험해 보세요.',
    previewPrompt: '먼저 두 단어를 들어 보세요.',
    testPrompt: '어떤 단어가 들렸나요?',
    speakerLabel: '듣기',
    audioUnavailable: '오디오를 재생할 수 없습니다. 답하기 전에 소리를 켜거나 음성 재생을 지원하는 브라우저를 사용해 보세요.',
    feedbackContrast: (contrast) => `이 소리 차이는 ${contrast}입니다.`,
    generalizationHeading: (contrast) => `${contrast} 소리 차이를 연습했습니다. 다른 예도 시도해 보세요.`,
    generalizationBody: '이 단어들은 같은 소리 차이를 사용합니다.',
    summary: createSummary({
      perfect: { lead: '잘했어요 — 소리의 차이를 들으셨네요.', body: '이번 라운드는 또렷하게 들으셨습니다. 같은 대비를 여러 단어와 다양한 목소리로 반복해 들으면 그 차이가 점점 익숙해집니다.' },
      partial: { lead: '이 두 소리는 정말 구분하기 어려운 소리입니다.', body: '소리의 차이 중 일부를 들으셨어요. 집중해서 듣는 연습은 단어 사이에서 무엇이 달라지는지 알아차리는 데 도움이 됩니다.' },
      zero: { lead: '이 소리 차이는 귀 훈련이 더 필요합니다.', body: '자연스러운 일입니다. 집중적인 듣기 연습은 예전에는 똑같이 들렸던 소리를 뇌가 구분하도록 도와줍니다.' },
    }),
  },
  es: {
    label: 'Prueba este contraste',
    previewChoicesAriaLabel: 'Escucha previa de las dos palabras',
    guessChoicesAriaLabel: 'Elige la palabra que oíste',
    replayChoicesAriaLabel: 'Vuelve a escuchar el contraste',
    liveInitial: 'Escucha el contraste y luego pon a prueba tu oído.',
    previewPrompt: 'Escucha primero las dos palabras.',
    testPrompt: '¿Qué palabra oíste?',
    speakerLabel: 'Escuchar',
    audioUnavailable: 'No se puede reproducir el audio. Activa el sonido o usa un navegador con reproducción de voz antes de responder.',
    feedbackContrast: (contrast) => `El contraste es ${contrast}.`,
    generalizationHeading: (contrast) => `Practicaste ${contrast}. Prueba otro ejemplo.`,
    generalizationBody: 'Estos pares usan el mismo contraste de sonido.',
  },
  pt: {
    label: 'Experimente este contraste',
    previewChoicesAriaLabel: 'Prévia das duas palavras',
    guessChoicesAriaLabel: 'Escolha a palavra que você ouviu',
    replayChoicesAriaLabel: 'Ouça o contraste de novo',
    liveInitial: 'Ouça o contraste e depois teste seu ouvido.',
    previewPrompt: 'Ouça primeiro as duas palavras.',
    testPrompt: 'Qual palavra você ouviu?',
    speakerLabel: 'Ouvir',
    audioUnavailable: 'Não é possível reproduzir o áudio. Ative o som ou use um navegador com reprodução de voz antes de responder.',
    feedbackContrast: (contrast) => `O contraste é ${contrast}.`,
    generalizationHeading: (contrast) => `Você praticou ${contrast}. Tente outro exemplo.`,
    generalizationBody: 'Estes pares usam o mesmo contraste de som.',
  },
  ar: {
    label: 'جرّب هذا الفرق الصوتي',
    previewChoicesAriaLabel: 'الاستماع إلى الكلمتين',
    guessChoicesAriaLabel: 'اختر الكلمة التي سمعتها',
    replayChoicesAriaLabel: 'إعادة الاستماع إلى الفرق الصوتي',
    liveInitial: 'استمع إلى الفرق الصوتي، ثم اختبر أذنك.',
    previewPrompt: 'استمع إلى الكلمتين أولاً.',
    testPrompt: 'أي كلمة سمعت؟',
    speakerLabel: 'استمع',
    audioUnavailable: 'تشغيل الصوت غير متاح. فعّل الصوت أو استخدم متصفحاً يدعم تشغيل الكلام قبل الإجابة.',
    feedbackContrast: (contrast) => `الفرق الصوتي هو ${contrast}.`,
    generalizationHeading: (contrast) => `لقد تدرّبت على ${contrast}. جرّب مثالاً آخر.`,
    generalizationBody: 'هذه الكلمات تشترك في الفرق الصوتي نفسه.',
    summary: createSummary({
      perfect: { lead: 'أحسنت — تمكّنت من تمييز الفرق بين الصوتين.', body: 'سمعت هذه الجولة بوضوح. تكرار التمرين على الفرق نفسه عبر كلمات وأصوات مختلفة يجعل التمييز أكثر ألفة.' },
      partial: { lead: 'هذه الأصوات يصعب التمييز بينها فعلاً.', body: 'لاحظت جزءاً من الفرق. التدريب على الاستماع المركّز يساعدك على ملاحظة ما يتغيّر بين الكلمات.' },
      zero: { lead: 'هذا الفرق الصوتي يحتاج إلى مزيد من تدريب الأذن.', body: 'هذا أمر طبيعي. التدريب المركّز على الاستماع يساعد دماغك على الفصل بين أصوات كانت تبدو متطابقة.' },
    }),
  },
  'hi-ur': {
    label: 'यह फ़र्क़ सुनकर देखिए',
    previewChoicesAriaLabel: 'दोनों शब्द सुनिए',
    guessChoicesAriaLabel: 'जो शब्द सुना, वह चुनिए',
    replayChoicesAriaLabel: 'यह फ़र्क़ फिर से सुनिए',
    liveInitial: 'पहले यह फ़र्क़ सुनिए, फिर अपने कान को परखिए।',
    previewPrompt: 'पहले दोनों शब्द सुनिए।',
    testPrompt: 'आपने कौन-सा शब्द सुना?',
    speakerLabel: 'सुनिए',
    audioUnavailable: 'आवाज़ नहीं चल पा रही है। जवाब देने से पहले आवाज़ चालू कीजिए या ऐसा ब्राउज़र इस्तेमाल कीजिए जो बोली चला सके।',
    feedbackContrast: (contrast) => `यह फ़र्क़ ${contrast} का है।`,
    generalizationHeading: (contrast) => `आपने ${contrast} का अभ्यास किया। एक और उदाहरण आज़माइए।`,
    generalizationBody: 'इन शब्दों में वही आवाज़ का फ़र्क़ है।',
    summary: createSummary({
      perfect: { lead: 'बहुत बढ़िया — आपने इन ध्वनियों का अंतर सुन लिया।', body: 'इस राउंड में आपने साफ़ सुना। यही अंतर अलग-अलग शब्दों और आवाज़ों में दोहराकर सुनने से यह फ़र्क और परिचित लगने लगता है।' },
      partial: { lead: 'इन ध्वनियों में फ़र्क़ करना सचमुच कठिन है।', body: 'आपने अंतर का कुछ हिस्सा सुन लिया। ध्यान से सुनने का अभ्यास यह नोटिस करने में मदद करता है कि शब्दों के बीच क्या बदलता है।' },
      zero: { lead: 'इस फ़र्क़ के लिए कान को और अभ्यास चाहिए।', body: 'यह आम बात है। ध्यान लगाकर सुनने का अभ्यास दिमाग़ को उन आवाज़ों में फ़र्क़ करना सिखाता है जो पहले एक जैसी लगती थीं।' },
    }),
  },
  id: {
    label: 'Coba kontras ini',
    previewChoicesAriaLabel: 'Dengarkan kedua kata',
    guessChoicesAriaLabel: 'Pilih kata yang kamu dengar',
    replayChoicesAriaLabel: 'Dengar kontras ini lagi',
    liveInitial: 'Dengarkan kontrasnya, lalu uji pendengaranmu.',
    previewPrompt: 'Dengarkan kedua kata dulu.',
    testPrompt: 'Kata mana yang kamu dengar?',
    speakerLabel: 'Dengar',
    audioUnavailable: 'Audio tidak bisa diputar. Nyalakan suara atau gunakan browser yang mendukung pemutaran suara sebelum menjawab.',
    feedbackContrast: (contrast) => `Kontrasnya adalah ${contrast}.`,
    generalizationHeading: (contrast) => `Kamu sudah melatih ${contrast}. Coba contoh lain.`,
    generalizationBody: 'Pasangan kata ini memakai kontras bunyi yang sama.',
  },
  fa: {
    label: 'این تقابل را امتحان کنید',
    previewChoicesAriaLabel: 'شنیدن هر دو کلمه',
    guessChoicesAriaLabel: 'انتخاب کلمه‌ای که شنیدید',
    replayChoicesAriaLabel: 'دوباره شنیدن این تقابل',
    liveInitial: 'ابتدا این تقابل را بشنوید، سپس گوش خود را بیازمایید.',
    previewPrompt: 'ابتدا هر دو کلمه را بشنوید.',
    testPrompt: 'کدام کلمه را شنیدید؟',
    speakerLabel: 'شنیدن',
    audioUnavailable: 'پخش صدا ممکن نیست. پیش از پاسخ دادن، صدا را روشن کنید یا از مرورگری استفاده کنید که پخش گفتار را پشتیبانی می‌کند.',
    feedbackContrast: (contrast) => `این تقابل ${contrast} است.`,
    generalizationHeading: (contrast) => `شما ${contrast} را تمرین کردید. نمونه‌ای دیگر را امتحان کنید.`,
    generalizationBody: 'این کلمه‌ها از همان تقابل صوتی استفاده می‌کنند.',
    summary: createSummary({
      perfect: { lead: 'آفرین — تفاوت این صداها را شنیدید.', body: 'این دور را به‌روشنی شنیدید. تکرار همین تقابل با کلمات و صداهای گوناگون باعث می‌شود این تفاوت برایتان آشناتر شود.' },
      partial: { lead: 'تشخیص این صداها از یکدیگر واقعاً دشوار است.', body: 'بخشی از تفاوت را شنیدید. تمرین شنیداری متمرکز کمک می‌کند متوجه شوید بین کلمات چه چیزی تغییر می‌کند.' },
      zero: { lead: 'این تقابل به تمرین شنیداری بیشتری نیاز دارد.', body: 'این طبیعی است. تمرین شنیداری متمرکز به مغز شما کمک می‌کند صداهایی را که پیش‌تر یکسان به نظر می‌رسیدند از هم جدا کند.' },
    }),
  },
  ru: {
    label: 'Попробуйте этот контраст',
    previewChoicesAriaLabel: 'Прослушивание двух слов',
    guessChoicesAriaLabel: 'Выберите услышанное слово',
    replayChoicesAriaLabel: 'Прослушать контраст ещё раз',
    liveInitial: 'Послушайте контраст, затем проверьте свой слух.',
    previewPrompt: 'Сначала послушайте оба слова.',
    testPrompt: 'Какое слово прозвучало?',
    speakerLabel: 'Слушать',
    audioUnavailable: 'Воспроизведение звука недоступно. Включите звук или откройте браузер с поддержкой воспроизведения речи, прежде чем отвечать.',
    feedbackContrast: (contrast) => `Этот контраст — ${contrast}.`,
    generalizationHeading: (contrast) => `Вы потренировались с ${contrast}. Попробуйте другой пример.`,
    generalizationBody: 'Эти пары используют один и тот же звуковой контраст.',
  },
  tr: {
    label: 'Bu karşıtlığı dene',
    previewChoicesAriaLabel: 'İki kelimenin ön dinlemesi',
    guessChoicesAriaLabel: 'Duyduğun kelimeyi seç',
    replayChoicesAriaLabel: 'Karşıtlığı tekrar dinle',
    liveInitial: 'Karşıtlığı dinle, sonra kulağını test et.',
    previewPrompt: 'Önce iki kelimeyi de dinle.',
    testPrompt: 'Hangi kelimeyi duydun?',
    speakerLabel: 'Dinle',
    audioUnavailable: 'Ses çalınamıyor. Cevaplamadan önce sesi aç ya da konuşma çalmayı destekleyen bir tarayıcı kullan.',
    feedbackContrast: (contrast) => `Ses karşıtlığı: ${contrast}.`,
    generalizationHeading: (contrast) => `${contrast} karşıtlığını çalıştın. Başka bir örnek dene.`,
    generalizationBody: 'Bu kelime çiftleri aynı ses karşıtlığını kullanıyor.',
  },
  vi: {
    label: 'Thử cặp âm này',
    previewChoicesAriaLabel: 'Nghe thử hai từ',
    guessChoicesAriaLabel: 'Chọn từ bạn đã nghe',
    replayChoicesAriaLabel: 'Nghe lại cặp âm này',
    liveInitial: 'Nghe cặp âm này, rồi kiểm tra tai của bạn.',
    previewPrompt: 'Nghe cả hai từ trước.',
    testPrompt: 'Bạn nghe thấy từ nào?',
    speakerLabel: 'Nghe',
    audioUnavailable: 'Không phát được âm thanh. Hãy bật tiếng hoặc dùng trình duyệt hỗ trợ phát giọng nói trước khi trả lời.',
    feedbackContrast: (contrast) => `Cặp âm này là ${contrast}.`,
    generalizationHeading: (contrast) => `Bạn đã luyện ${contrast}. Thử một ví dụ khác.`,
    generalizationBody: 'Những từ này dùng cùng một cặp âm.',
    summary: createSummary({
      perfect: { lead: 'Tốt lắm — bạn đã nghe ra được sự khác biệt.', body: 'Vòng này bạn nghe khá rõ. Luyện lại cùng cặp âm này với nhiều từ và giọng khác nhau sẽ giúp sự khác biệt trở nên quen thuộc hơn.' },
      partial: { lead: 'Hai âm này thực sự khó phân biệt.', body: 'Bạn đã nghe ra một phần khác biệt. Luyện nghe có tập trung giúp bạn nhận ra điều gì thay đổi giữa các từ.' },
      zero: { lead: 'Cặp âm này cần luyện tai thêm.', body: 'Điều đó là bình thường. Luyện nghe có tập trung giúp não bạn tách được những âm trước đây nghe như nhau.' },
    }),
  },
});

const localizedSeoExerciseCopyByLocale = Object.freeze(
  Object.fromEntries(
    Object.entries(SEO_EXERCISE_HERO_REUSE_BY_LOCALE).map(([locale, reusableCopy]) => [
      locale,
      Object.freeze({
        ...reusableCopy,
        ...localizedSeoExerciseSupplementByLocale[locale],
      }),
    ])
  )
);

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
  ...localizedSeoExerciseCopyByLocale,
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
