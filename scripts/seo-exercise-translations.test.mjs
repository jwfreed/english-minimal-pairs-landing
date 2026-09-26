import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { CONTRAST_CATALOG } from '../src/contrast-catalog.js';
import { heroDemoTranslations } from '../src/hero-demo-translations.js';
import {
  SEO_EXERCISE_REQUIRED_KEYS,
  SEO_EXERCISE_TRANSLATION_CANDIDATES,
  SEO_EXERCISE_TRANSLATIONS,
  getSeoExerciseCopy,
  getMissingSeoExerciseKeys,
  getSeoExerciseTranslationStatus,
  hasCompleteSeoExerciseTranslation,
  resolveSeoExerciseLocale,
} from '../src/seo-exercise-translations.js';

const LOCALIZED_FLAGSHIP_ROUTES = [
  { locale: 'ja', documentLocale: 'ja', slug: 'ship-vs-sheep', pair: ['ship', 'sheep'] },
  { locale: 'zh', documentLocale: 'zh-Hans', slug: 'ship-vs-sheep', pair: ['ship', 'sheep'] },
  { locale: 'yue', documentLocale: 'zh-Hant-HK', slug: 'right-vs-light', pair: ['right', 'light'] },
  { locale: 'ko', documentLocale: 'ko', slug: 'right-vs-light', pair: ['right', 'light'] },
  { locale: 'es', documentLocale: 'es', slug: 'ship-vs-sheep', pair: ['ship', 'sheep'] },
  { locale: 'pt', documentLocale: 'pt', slug: 'ship-vs-sheep', pair: ['ship', 'sheep'] },
  { locale: 'ar', documentLocale: 'ar', slug: 'pat-vs-bat', pair: ['pat', 'bat'] },
  { locale: 'hi-ur', documentLocale: 'hi', slug: 'vest-vs-west', pair: ['vest', 'west'] },
  { locale: 'id', documentLocale: 'id', slug: 'ship-vs-sheep', pair: ['ship', 'sheep'] },
  { locale: 'fa', documentLocale: 'fa', slug: 'vest-vs-west', pair: ['vest', 'west'] },
  { locale: 'ru', documentLocale: 'ru', slug: 'ship-vs-sheep', pair: ['ship', 'sheep'] },
  { locale: 'th', documentLocale: 'th', slug: 'thin-vs-tin', pair: ['thin', 'tin'] },
  { locale: 'tr', documentLocale: 'tr', slug: 'ship-vs-sheep', pair: ['ship', 'sheep'] },
  { locale: 'vi', documentLocale: 'vi', slug: 'right-vs-light', pair: ['right', 'light'] },
];

const LOCALIZED_FLAGSHIP_LOCALES = LOCALIZED_FLAGSHIP_ROUTES.map(({ locale }) => locale);

const HERO_RUNTIME_LOCALE_BY_SEO_LOCALE = {
  yue: '廣東話',
  ko: '한국어',
  ar: 'اللغة العربية',
  'hi-ur': 'हिंदी/اردو',
  fa: 'زبان فارسی',
  vi: 'Tiếng Việt',
};

const ZERO_SCORE_SUMMARY_BY_LOCALE = {
  yue: {
    lead: '呢組對比仲需要多啲辨音練習。',
    body: '咁係好正常。專心練習聽力，可以幫你嘅腦分辨以前聽落一樣嘅聲音。',
  },
  ko: {
    lead: '이 소리 차이는 귀 훈련이 더 필요합니다.',
    body: '자연스러운 일입니다. 집중적인 듣기 연습은 예전에는 똑같이 들렸던 소리를 뇌가 구분하도록 도와줍니다.',
  },
  ar: {
    lead: 'هذا الفرق الصوتي يحتاج إلى مزيد من تدريب الأذن.',
    body: 'هذا أمر طبيعي. التدريب المركّز على الاستماع يساعد دماغك على الفصل بين أصوات كانت تبدو متطابقة.',
  },
  'hi-ur': {
    lead: 'इस फ़र्क़ के लिए कान को और अभ्यास चाहिए।',
    body: 'यह आम बात है। ध्यान लगाकर सुनने का अभ्यास दिमाग़ को उन आवाज़ों में फ़र्क़ करना सिखाता है जो पहले एक जैसी लगती थीं।',
  },
  fa: {
    lead: 'این تقابل به تمرین شنیداری بیشتری نیاز دارد.',
    body: 'این طبیعی است. تمرین شنیداری متمرکز به مغز شما کمک می‌کند صداهایی را که پیش‌تر یکسان به نظر می‌رسیدند از هم جدا کند.',
  },
  vi: {
    lead: 'Cặp âm này cần luyện tai thêm.',
    body: 'Điều đó là bình thường. Luyện nghe có tập trung giúp não bạn tách được những âm trước đây nghe như nhau.',
  },
};

test('resolves exact, regional, and unsupported SEO exercise locales', () => {
  assert.equal(resolveSeoExerciseLocale('en'), 'en');
  assert.equal(resolveSeoExerciseLocale('th-TH'), 'th');
  assert.equal(resolveSeoExerciseLocale('pt-BR'), 'pt');
  assert.equal(resolveSeoExerciseLocale('zh-Hant-HK'), 'yue');
  assert.equal(resolveSeoExerciseLocale('hi'), 'hi-ur');
  assert.equal(resolveSeoExerciseLocale('xx'), null);
  assert.equal(resolveSeoExerciseLocale(''), 'en');
});

test('returns localized SEO exercise UI copy with formatted dynamic labels', () => {
  const copy = getSeoExerciseCopy('th-TH');

  assert.equal(copy.locale, 'th');
  assert.equal(copy.label, 'ลองฝึกคู่เสียงนี้');
  assert.equal(copy.roundLabel(2, 3), 'รอบที่ 2 จาก 3');
  assert.equal(copy.feedback({ selectedWord: 'SHIP', correctWord: 'SHEEP', correct: false }), 'ยังไม่ใช่ คุณเลือก: SHIP คำตอบที่ถูกต้อง: SHEEP');
  assert.equal(copy.scoreLabel(2, 3), 'คุณตอบถูก 2 จาก 3 ข้อ');
  assert.equal(copy.feedbackContrast('/θ/ vs /t/'), 'คู่เสียงนี้คือ /θ/ vs /t/');
  assert.match(copy.generalizationHeading('/θ/ vs /t/'), /\/θ\/ vs \/t\//);
  assert.equal(copy.summaryCta({ correct: 1, total: 2 }).headline, 'ฝึกแยกคู่เสียงนี้ต่อ');
});

test('returns localized copy without exposing an English fallback', () => {
  assert.equal(getSeoExerciseCopy('ko').locale, 'ko');
  assert.equal(getSeoExerciseCopy('pt-BR').locale, 'pt');
  assert.equal(getSeoExerciseCopy('zh-Hant-HK').locale, 'yue');
  assert.equal(getSeoExerciseCopy('hi').locale, 'hi-ur');
  assert.equal(getSeoExerciseCopy('xx'), null);
});

test('provides score-aware English CTA copy for incomplete and perfect results', () => {
  const copy = getSeoExerciseCopy('en');
  const incomplete = copy.summaryCta({ correct: 1, total: 2 });
  const perfect = copy.summaryCta({ correct: 2, total: 2 });

  assert.equal(incomplete.headline, 'Keep training this sound contrast');
  assert.match(incomplete.body, /You got 1 out of 2 correct\./);
  assert.equal(perfect.headline, 'Keep building your listening skills');
  assert.match(perfect.body, /You got 2 out of 2 correct\./);
  assert.equal('label' in incomplete, false);
  assert.equal('label' in perfect, false);
});

test('all localized flagship exercise bundles are treated as supported', () => {
  assert.deepEqual(
    Object.keys(SEO_EXERCISE_TRANSLATIONS).sort(),
    ['en', ...LOCALIZED_FLAGSHIP_LOCALES].sort()
  );

  for (const { locale, documentLocale } of LOCALIZED_FLAGSHIP_ROUTES) {
    assert.equal(hasCompleteSeoExerciseTranslation(documentLocale), true, locale);
    assert.equal(resolveSeoExerciseLocale(documentLocale), locale, locale);
  }
});

test('the required contract covers every field consumed by the SEO exercise lifecycle', () => {
  assert.deepEqual(SEO_EXERCISE_REQUIRED_KEYS, [
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

  for (const { locale, documentLocale } of LOCALIZED_FLAGSHIP_ROUTES) {
    assert.deepEqual(getSeoExerciseTranslationStatus(documentLocale).missingKeys, [], locale);
  }
});

test('localized contrast templates render the canonical catalog value without leaking placeholders', () => {
  const cases = [
    ['es', '/ɪ/ vs /iː/', 'El contraste es /ɪ/ vs /iː/.', 'Practicaste /ɪ/ vs /iː/. Prueba otro ejemplo.'],
    ['ko', '/r/ vs /l/', '이 소리 차이는 /r/ vs /l/입니다.', '/r/ vs /l/ 소리 차이를 연습했습니다. 다른 예도 시도해 보세요.'],
    ['ar', '/p/ vs /b/', 'الفرق الصوتي هو /p/ vs /b/.', 'لقد تدرّبت على /p/ vs /b/. جرّب مثالاً آخر.'],
    ['fa', '/v/ vs /w/', 'این تقابل /v/ vs /w/ است.', 'شما /v/ vs /w/ را تمرین کردید. نمونه‌ای دیگر را امتحان کنید.'],
  ];

  for (const [locale, contrast, expectedFeedback, expectedHeading] of cases) {
    const copy = getSeoExerciseCopy(locale);
    assert.equal(copy.feedbackContrast(contrast), expectedFeedback, `${locale} feedback`);
    assert.equal(copy.generalizationHeading(contrast), expectedHeading, `${locale} heading`);
    assert.doesNotMatch(copy.feedbackContrast(contrast), /\{contrast\}/u, locale);
    assert.doesNotMatch(copy.generalizationHeading(contrast), /\{contrast\}/u, locale);
  }
});

test('the completeness gate rejects malformed dynamic output instead of trusting function presence', () => {
  const valid = SEO_EXERCISE_TRANSLATIONS.th;
  const malformed = {
    ...valid,
    feedbackContrast: () => '',
    generalizationHeading: () => 'ไม่มีตัวแปรเสียง',
    chooseWordLabel: () => '',
    playWordLabel: () => '',
    roundLabel: () => '',
    scoreLabel: () => '',
    feedback: () => '',
    summary: () => ({ lead: '', body: '' }),
    summaryCta: () => ({ headline: '', body: '' }),
  };

  assert.deepEqual(getMissingSeoExerciseKeys(malformed), [
    'chooseWordLabel',
    'feedback',
    'feedbackContrast',
    'generalizationHeading',
    'playWordLabel',
    'roundLabel',
    'scoreLabel',
    'summary',
    'summaryCta',
  ]);
});

test('safe reuse preserves approved hero-demo strings and their existing UI composition', () => {
  const japanese = SEO_EXERCISE_TRANSLATION_CANDIDATES.ja;
  const hero = heroDemoTranslations['日本語'];

  assert.equal(japanese.previewPrompt, hero.demoHearDifference);
  assert.equal(japanese.startButton, hero.demoStartTest);
  assert.equal(japanese.playButton, hero.demoPlaySample);
  assert.equal(japanese.testPrompt, hero.demoListenPrompt);
  assert.equal(japanese.feedbackReplayPrompt, hero.demoReplayPrompt);
  assert.equal(japanese.nextButton, hero.demoNextRound);
  assert.equal(japanese.chooseWordLabel('SHIP'), 'SHIP を選ぶ');
  assert.equal(japanese.playWordLabel('SHEEP'), 'SHEEP の発音を再生');
  assert.equal(japanese.roundLabel(1, 2), '2回中 1回目');
  assert.equal(japanese.scoreLabel(1, 2), '2問中1問正解です。');
  assert.equal(
    japanese.feedback({ selectedWord: 'SHIP', correctWord: 'SHEEP', correct: false }),
    '惜しいです。 あなたの選択: SHIP. 正解: SHEEP.'
  );
  assert.deepEqual(japanese.summary({ correct: 2, total: 2 }), {
    lead: hero.demoSummaryAllCorrectLead,
    body: hero.demoSummaryAllCorrectBody,
  });
  assert.deepEqual(japanese.summaryCta({ correct: 0, total: 2 }), {
    headline: hero.demoReadyPrompt,
    body: hero.demoValueSignal,
  });
});

test('consonant flagship routes use complete contrast-neutral summaries', () => {
  for (const [locale, runtimeLocale] of Object.entries(HERO_RUNTIME_LOCALE_BY_SEO_LOCALE)) {
    const summary = SEO_EXERCISE_TRANSLATION_CANDIDATES[locale].summary;
    const hero = heroDemoTranslations[runtimeLocale];

    assert.deepEqual(summary({ correct: 2, total: 2 }), {
      lead: hero.demoSummaryAllCorrectLead,
      body: hero.demoSummaryAllCorrectBody,
    }, `${locale} perfect`);
    assert.deepEqual(summary({ correct: 1, total: 2 }), {
      lead: hero.demoSummaryPartialCorrectLead,
      body: hero.demoSummaryPartialCorrectBody,
    }, `${locale} partial`);
    assert.deepEqual(summary({ correct: 0, total: 2 }), ZERO_SCORE_SUMMARY_BY_LOCALE[locale], `${locale} zero`);
    assert.notEqual(summary({ correct: 0, total: 2 }).body, hero.demoSummaryNoneCorrectBody, locale);
  }
});

test('all localized flagship pages keep exact pair mappings and mount one complete locale bundle', () => {
  for (const { locale, documentLocale, slug, pair } of LOCALIZED_FLAGSHIP_ROUTES) {
    const sourcePath = `content/locales/${locale}/${slug}/index.html`;
    const source = fs.readFileSync(sourcePath, 'utf8');
    const catalogPair = CONTRAST_CATALOG[slug].words.map((word) => word.text);
    const mountCount = source.split('data-exercise').length - 1;

    assert.deepEqual(catalogPair, pair, `${locale} catalog pair`);
    assert.match(source, new RegExp(`<html[^>]+lang="${documentLocale}"`, 'u'), `${locale} lang`);
    assert.equal(hasCompleteSeoExerciseTranslation(documentLocale), true, `${locale} complete`);
    assert.equal(mountCount, 1, `${locale} mount`);
    assert.match(source, new RegExp(`id="${slug}-listening-exercise"[^>]+data-exercise[^>]+data-contrast="${slug}"`, 'u'), `${locale} contrast`);
    assert.match(source.slice(0, source.indexOf('</header>')), new RegExp(`href="#${slug}-listening-exercise"`, 'u'), `${locale} hero practice CTA`);
  }
});
