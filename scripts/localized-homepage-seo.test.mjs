import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const seoModule = await import(pathToFileURL(path.join(root, 'src', 'localized-homepage-seo.js')).href);
const i18nModule = await import(pathToFileURL(path.join(root, 'src', 'i18n.js')).href);
const { resolveSeoMetadata, getLocalizedSeoMetadata } = seoModule;
const { translations } = i18nModule;

test('falls back to hero copy when no seo fields exist', () => {
  const copy = {
    heroTitle: 'Hero headline',
    heroSubtitle: 'Hero description',
  };

  assert.deepEqual(resolveSeoMetadata(copy), {
    title: 'Hero headline | Soundwise',
    description: 'Hero description',
  });
});

test('uses seoTitle verbatim when present', () => {
  const copy = {
    heroTitle: 'Hero headline',
    heroSubtitle: 'Hero description',
    seoTitle: 'Category keyword title | Soundwise',
  };

  assert.equal(resolveSeoMetadata(copy).title, 'Category keyword title | Soundwise');
  assert.equal(resolveSeoMetadata(copy).description, 'Hero description');
});

test('uses seoDescription when present', () => {
  const copy = {
    heroTitle: 'Hero headline',
    heroSubtitle: 'Hero description',
    seoDescription: 'Search-intent description.',
  };

  assert.equal(resolveSeoMetadata(copy).title, 'Hero headline | Soundwise');
  assert.equal(resolveSeoMetadata(copy).description, 'Search-intent description.');
});

test('treats blank seo fields as absent', () => {
  const copy = {
    heroTitle: 'Hero headline',
    heroSubtitle: 'Hero description',
    seoTitle: '   ',
    seoDescription: '',
  };

  assert.deepEqual(resolveSeoMetadata(copy), {
    title: 'Hero headline | Soundwise',
    description: 'Hero description',
  });
});

test('getLocalizedSeoMetadata resolves a runtime locale against real translations', () => {
  const spanishLocale = 'idioma español';
  const t = translations[spanishLocale];

  assert.deepEqual(getLocalizedSeoMetadata(spanishLocale), {
    title: `${t.heroTitle} | Soundwise`,
    description: t.heroSubtitle,
  });
});

test('getLocalizedSeoMetadata falls back to English copy for unknown locales', () => {
  assert.deepEqual(getLocalizedSeoMetadata('unknown-locale'), {
    title: `${translations.en.heroTitle} | Soundwise`,
    description: translations.en.heroSubtitle,
  });
});
