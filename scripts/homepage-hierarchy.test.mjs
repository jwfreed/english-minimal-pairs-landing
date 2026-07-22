import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const i18nModule = await import(pathToFileURL(path.join(root, 'src', 'i18n.js')).href);
const { translations } = i18nModule;

test('homepage source emphasizes English ear training and demo-first hierarchy', () => {
  assert.match(indexHtml, /data-i18n="heroBadge">English Ear Training</);
  assert.match(indexHtml, /Hear the English sounds your brain keeps mixing up/);
  assert.match(indexHtml, /<section id="demo" class="demo-section demo-section-prominent">/);
  assert.ok(indexHtml.indexOf('class="demo-section') < indexHtml.indexOf('class="problem-section"'));
  assert.ok(indexHtml.indexOf('class="problem-section"') < indexHtml.indexOf('class="how-it-works"'));
  assert.ok(indexHtml.indexOf('class="how-it-works"') < indexHtml.indexOf('class="seo-pairs-section"'));
  assert.ok(indexHtml.indexOf('<section class="seo-pairs-section"') < indexHtml.indexOf('<section class="features"'));
  assert.ok(indexHtml.indexOf('<section class="features"') < indexHtml.indexOf('<section class="testimonials testimonial-compact"'));
});

test('English copy leads features with learner outcomes', () => {
  assert.equal(translations.en.featureCard3Title, 'Understand sounds you used to confuse');
  assert.equal(translations.en.featureCard1Title, 'Focus on the contrasts that matter for your language');
  assert.equal(translations.en.featureCard6Title, 'Know exactly what you heard');
  assert.equal(translations.en.featureCard4Title, 'Move from guessing to recognition');
});

test('feature card markup preserves title and body translation pairings', () => {
  const featureSection = indexHtml.match(/<section class="features"[\s\S]*?<\/section>/)?.[0] || '';
  const titleKeys = [...featureSection.matchAll(/<h3 data-i18n="([^"]+)">/g)].map((match) => match[1]);
  const bodyKeys = [...featureSection.matchAll(/<p data-i18n="([^"]+)">/g)].map((match) => match[1]);

  assert.deepEqual(titleKeys, [
    'featureCard3Title',
    'featureCard1Title',
    'featureCard6Title',
    'featureCard4Title',
  ]);
  assert.deepEqual(bodyKeys, [
    'featureCard3Text',
    'featureCard1Text',
    'featureCard6Text',
    'featureCard4Text',
  ]);
});

test('localized homepages do not receive English-only testimonial copy', () => {
  const jaHomepage = fs.readFileSync(path.join(root, 'content', 'locales', 'ja', 'index.html'), 'utf8');
  assert.doesNotMatch(jaHomepage, /rafaismyname/);
  assert.doesNotMatch(jaHomepage, /im FLABBERGASTED/);
});
