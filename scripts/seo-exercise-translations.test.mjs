import assert from 'node:assert/strict';
import test from 'node:test';

import {
  SEO_EXERCISE_TRANSLATIONS,
  getSeoExerciseCopy,
  resolveSeoExerciseLocale,
} from '../src/seo-exercise-translations.js';

test('resolves exact, regional, and unsupported SEO exercise locales', () => {
  assert.equal(resolveSeoExerciseLocale('en'), 'en');
  assert.equal(resolveSeoExerciseLocale('th-TH'), 'th');
  assert.equal(resolveSeoExerciseLocale('pt-BR'), 'en');
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

test('falls back to English SEO exercise UI copy for unsupported locales', () => {
  const copy = getSeoExerciseCopy('ko');

  assert.equal(copy.locale, 'en');
  assert.equal(copy.startButton, 'Start the listening test');
  assert.equal(copy.roundLabel(1, 2), 'Round 1 of 2');
  assert.equal(copy.feedback({ selectedWord: 'SHIP', correctWord: 'SHEEP', correct: true }), 'Correct. You chose: SHIP. Correct answer: SHEEP.');
  assert.equal(copy.feedbackContrast('/ɪ/ vs /iː/'), 'The contrast is /ɪ/ vs /iː/.');
  assert.equal(copy.generalizationHeading('/ɪ/ vs /iː/'), 'You practiced /ɪ/ vs /iː/. Try another example.');
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

test('only explicitly translated localized exercise routes are treated as supported', () => {
  assert.deepEqual(Object.keys(SEO_EXERCISE_TRANSLATIONS).sort(), ['en', 'th']);
  assert.equal(resolveSeoExerciseLocale('th-TH'), 'th');
  assert.equal(resolveSeoExerciseLocale('ja'), 'en');
});
