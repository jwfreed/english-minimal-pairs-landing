import assert from 'node:assert/strict';
import test from 'node:test';

import {
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
});

test('falls back to English SEO exercise UI copy for unsupported locales', () => {
  const copy = getSeoExerciseCopy('ko');

  assert.equal(copy.locale, 'en');
  assert.equal(copy.startButton, 'Start the listening test');
  assert.equal(copy.roundLabel(1, 2), 'Round 1 of 2');
  assert.equal(copy.feedback({ selectedWord: 'SHIP', correctWord: 'SHEEP', correct: true }), 'Correct. You chose: SHIP. Correct answer: SHEEP.');
});
