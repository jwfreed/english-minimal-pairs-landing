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
  assert.match(indexHtml, /<section id="demo" class="demo-section demo-section-prominent">/);
  assert.ok(indexHtml.indexOf('class="demo-section') < indexHtml.indexOf('class="problem-section"'));
});

test('English copy leads features with learner outcomes', () => {
  assert.equal(translations.en.featureCard3Title, 'Hear difficult English sound contrasts');
  assert.equal(translations.en.featureCard1Title, 'Practice sounds chosen for your first language');
  assert.equal(translations.en.featureCard6Title, 'Get immediate feedback');
  assert.equal(translations.en.featureCard4Title, 'Build with adaptive practice');
  assert.equal(translations.en.featureCard5Title, 'Track progress by sound contrast');
  assert.equal(translations.en.featureCard2Title, 'Hear varied English voices');
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
    'featureCard5Title',
    'featureCard2Title',
  ]);
  assert.deepEqual(bodyKeys, [
    'featureCard3Text',
    'featureCard1Text',
    'featureCard6Text',
    'featureCard4Text',
    'featureCard5Text',
    'featureCard2Text',
  ]);
});

test('localized homepages do not receive English-only testimonial copy', () => {
  const jaHomepage = fs.readFileSync(path.join(root, 'content', 'locales', 'ja', 'index.html'), 'utf8');
  assert.doesNotMatch(jaHomepage, /rafaismyname/);
  assert.doesNotMatch(jaHomepage, /im FLABBERGASTED/);
});
