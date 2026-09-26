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

const COMMON_LOCALIZED_BLOCKERS = [
  'audioUnavailable',
  'feedbackContrast',
  'generalizationBody',
  'generalizationHeading',
  'guessChoicesAriaLabel',
  'label',
  'liveInitial',
  'previewChoicesAriaLabel',
  'replayChoicesAriaLabel',
  'speakerLabel',
];

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

test('resolves exact, regional, and unsupported SEO exercise locales', () => {
  assert.equal(resolveSeoExerciseLocale('en'), 'en');
  assert.equal(resolveSeoExerciseLocale('th-TH'), 'th');
  assert.equal(resolveSeoExerciseLocale('pt-BR'), null);
  assert.equal(resolveSeoExerciseLocale('zh-Hant-HK'), null);
  assert.equal(resolveSeoExerciseLocale('hi'), null);
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

test('does not expose English fallback copy to unsupported localized exercises', () => {
  assert.equal(getSeoExerciseCopy('ko'), null);
  assert.equal(getSeoExerciseCopy('pt-BR'), null);
  assert.equal(getSeoExerciseCopy('zh-Hant-HK'), null);
  assert.equal(getSeoExerciseCopy('hi'), null);
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

test('only complete localized exercise bundles are treated as supported', () => {
  assert.deepEqual(Object.keys(SEO_EXERCISE_TRANSLATIONS).sort(), ['en', 'th']);
  assert.equal(hasCompleteSeoExerciseTranslation('en'), true);
  assert.equal(hasCompleteSeoExerciseTranslation('th-TH'), true);
  assert.equal(hasCompleteSeoExerciseTranslation('ja'), false);
  assert.equal(hasCompleteSeoExerciseTranslation('zh-Hant-HK'), false);
  assert.equal(hasCompleteSeoExerciseTranslation('hi'), false);
  assert.equal(resolveSeoExerciseLocale('th-TH'), 'th');
  assert.equal(resolveSeoExerciseLocale('ja'), null);
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

  assert.deepEqual(getSeoExerciseTranslationStatus('th').missingKeys, []);
  assert.deepEqual(getSeoExerciseTranslationStatus('ja').missingKeys, COMMON_LOCALIZED_BLOCKERS);
  assert.deepEqual(
    getSeoExerciseTranslationStatus('ar').missingKeys,
    [...COMMON_LOCALIZED_BLOCKERS, 'summary'].sort()
  );
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

test('non-vowel flagship routes do not reuse vowel-specific zero-score summary copy', () => {
  for (const locale of ['ar', 'fa', 'hi-ur', 'ko', 'vi', 'yue']) {
    assert.equal('summary' in SEO_EXERCISE_TRANSLATION_CANDIDATES[locale], false, locale);
    assert.equal(getSeoExerciseTranslationStatus(locale).missingKeys.includes('summary'), true, locale);
  }
});

test('all localized flagship pages keep exact pair mappings and mount only complete locale bundles', () => {
  for (const { locale, documentLocale, slug, pair } of LOCALIZED_FLAGSHIP_ROUTES) {
    const sourcePath = `content/locales/${locale}/${slug}/index.html`;
    const source = fs.readFileSync(sourcePath, 'utf8');
    const catalogPair = CONTRAST_CATALOG[slug].words.map((word) => word.text);
    const mountCount = source.split('data-exercise').length - 1;
    const complete = hasCompleteSeoExerciseTranslation(documentLocale);

    assert.deepEqual(catalogPair, pair, `${locale} catalog pair`);
    assert.match(source, new RegExp(`<html[^>]+lang="${documentLocale}"`, 'u'), `${locale} lang`);
    assert.equal(mountCount, complete ? 1 : 0, `${locale} mount gate`);

    if (complete) {
      assert.match(source, new RegExp(`data-contrast="${slug}"`, 'u'), `${locale} contrast`);
    } else {
      const hero = source.slice(0, source.indexOf('</header>'));
      assert.doesNotMatch(hero, /href="#[^"]*listening-exercise"/u, `${locale} fake practice CTA`);
    }
  }
});
