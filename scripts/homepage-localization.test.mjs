import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { applyTranslations, translations } from '../src/i18n.js';
import { LOCALIZED_HOMEPAGE_ROUTES } from '../src/localized-homepage-routes.js';
import { HERO_DEMO_TRANSLATION_KEYS } from '../src/hero-demo-translations.js';
import { HERO_DEMO_CONTRASTS, RUNTIME_LOCALE_TO_DEMO_LOCALE } from '../src/hero-demo-config.js';
import { getLocalizedSeoMetadata } from '../src/localized-homepage-seo.js';
import { buildLocalizedHtml } from './generate-localized-homepages.mjs';

const template = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const keys = [...template.matchAll(/data-i18n(?:-aria-label)?="([^"]+)"/g)].map(match => match[1]);
const intentionalEnglishKeys = new Set(['footerFAQ', 'seoPairsGroupRL', 'seoPairsGroupFvw']);
const leafPattern = /<[a-z][a-z0-9-]*\b([^>]*)>([^<>]+)<\/[a-z][a-z0-9-]*>/gi;
const englishTemplateText = new Set([...template.matchAll(leafPattern)].map(match => match[2].trim()));

for (const route of LOCALIZED_HOMEPAGE_ROUTES) {
  test(`${route.slug}: homepage and interactive UI have explicit localized copy`, () => {
    const copy = translations[route.runtimeLocale];
    for (const key of new Set([...keys, ...HERO_DEMO_TRANSLATION_KEYS])) {
      assert.notEqual(copy[key], undefined, `${key} is missing`);
      if (copy[key] && !intentionalEnglishKeys.has(key)) {
        assert.notEqual(copy[key], translations.en[key], `${key} falls back to English`);
      }
    }
  });
}

test('shared guide links and accessibility labels participate in localization', () => {
  for (const key of ['seoPairsGuideLink', 'seoPairsEarTrainingLink']) {
    assert.match(template, new RegExp(`<a[^>]+data-i18n="${key}"`));
  }
  for (const match of template.matchAll(/<[^>]+\baria-label="[^"]+"[^>]*>/g)) {
    // This testimonial is explicitly English-only and omitted from localized homepages.
    if (match[0].includes('class="stars"')) continue;
    assert.match(match[0], /data-i18n-aria-label="[^"]+"/);
  }
  for (const match of template.matchAll(/<img\b[^>]*>/g)) {
    assert.match(match[0], /alt="(?:|Soundwise)"/);
  }
});

for (const route of LOCALIZED_HOMEPAGE_ROUTES) {
  test(`${route.slug}: generated HTML has no unmarked English UI`, () => {
    const source = buildLocalizedHtml(template, route);
    const unlocalized = source
      .replace(/<head>[\s\S]*?<\/head>|<script\b[^>]*>[\s\S]*?<\/script>|<!--[\s\S]*?-->/g, '')
      .replace(/<([a-z][a-z0-9-]*)\b[^>]*data-i18n="[^"]+"[^>]*>[\s\S]*?<\/\1>/gi, '');
    for (const [, attributes, text] of unlocalized.matchAll(leafPattern)) {
      if (!/[a-z]/i.test(text) || !englishTemplateText.has(text.trim())) continue;
      if (/class="(?:logo-text|lang-name)"|id="language-selector"/.test(attributes)) continue;
      // Exact English examples and phonemic comparisons are teaching content.
      if (/^\s*"?[a-z]+"? vs "?[a-z]+"?\s*$/.test(text) || /^\s*\/[\s\S]+\/\s*$/.test(text) || text.trim() === 'vs') continue;
      assert.fail(`Unmarked UI text: ${text.trim()}`);
    }
    const copy = translations[route.runtimeLocale];
    assert.ok(source.includes(copy.demoRoundLabel.replaceAll('{current}', '1').replaceAll('{total}', '2')));
    const demo = HERO_DEMO_CONTRASTS[RUNTIME_LOCALE_TO_DEMO_LOCALE[route.runtimeLocale]];
    assert.ok(source.includes(demo.words.map(word => word.text.toUpperCase()).join(' / ')));
    for (const [, key] of template.matchAll(/data-i18n-aria-label="([^"]+)"/g)) {
      assert.ok(source.includes(`aria-label="${copy[key]}"`), `${key} is not statically localized`);
    }
    const organization = [...source.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .map(match => JSON.parse(match[1])).find(data => data['@type'] === 'Organization');
    assert.equal(organization.description, getLocalizedSeoMetadata(route.runtimeLocale).description);
  });
}

test('runtime language changes update accessibility labels', () => {
  const originalDocument = globalThis.document;
  const elements = ['selectLanguageLabel', 'appHighlightsLabel', 'learningPrinciplesLabel'].map(key => ({
    getAttribute: () => key,
    setAttribute(name, value) { this[name] = value; },
  }));
  globalThis.document = {
    querySelectorAll: selector => selector === '[data-i18n-aria-label]' ? elements : [],
    getElementById: () => null,
    documentElement: {},
  };
  try {
    for (const route of LOCALIZED_HOMEPAGE_ROUTES) {
      applyTranslations(route.runtimeLocale);
      for (const element of elements) {
        assert.equal(element['aria-label'], translations[route.runtimeLocale][element.getAttribute()]);
      }
    }
  } finally {
    globalThis.document = originalDocument;
  }
});
