import { supplementalTranslations } from './landing-supplement-translations.js';
import { buildLandingTranslations, getRuntimeLocaleMeta } from './landing-copy-runtime.js';
import { heroDemoTranslations } from './hero-demo-translations.js';
import { HERO_DEMO_BROWSER_LANGUAGE_MAP, HERO_DEMO_CONTRASTS } from './hero-demo-config.js';

export const USER_LANGUAGE_STORAGE_KEY = 'soundwise_user_language';
const LEGACY_LANGUAGE_STORAGE_KEY = 'language';

const translationSource = Object.fromEntries(
  Object.entries(supplementalTranslations).map(([locale, supplementalLocale]) => [
    locale,
    {
      ...supplementalLocale,
      ...(heroDemoTranslations[locale] || {}),
    },
  ])
);

export const translations = buildLandingTranslations(translationSource);

const browserLanguageMap = {
  en: 'en',
  ja: HERO_DEMO_CONTRASTS.japanese.runtimeLocale,
  zh: HERO_DEMO_CONTRASTS.mandarin.runtimeLocale,
  'zh-cn': HERO_DEMO_CONTRASTS.mandarin.runtimeLocale,
  'zh-sg': HERO_DEMO_CONTRASTS.mandarin.runtimeLocale,
  'zh-hk': HERO_DEMO_CONTRASTS.cantonese.runtimeLocale,
  yue: HERO_DEMO_CONTRASTS.cantonese.runtimeLocale,
  th: HERO_DEMO_CONTRASTS.thai.runtimeLocale,
  es: HERO_DEMO_CONTRASTS.spanish.runtimeLocale,
  ar: HERO_DEMO_CONTRASTS.arabic.runtimeLocale,
  ru: HERO_DEMO_CONTRASTS.russian.runtimeLocale,
  ko: HERO_DEMO_CONTRASTS.korean.runtimeLocale,
  hi: HERO_DEMO_CONTRASTS.hindi_urdu.runtimeLocale,
  ur: HERO_DEMO_CONTRASTS.hindi_urdu.runtimeLocale,
  pt: HERO_DEMO_CONTRASTS.portuguese.runtimeLocale,
  'pt-br': HERO_DEMO_CONTRASTS.portuguese.runtimeLocale,
  'pt-pt': HERO_DEMO_CONTRASTS.portuguese.runtimeLocale,
  vi: HERO_DEMO_CONTRASTS.vietnamese.runtimeLocale,
  tr: HERO_DEMO_CONTRASTS.turkish.runtimeLocale,
  fa: HERO_DEMO_CONTRASTS.persian.runtimeLocale,
  id: HERO_DEMO_CONTRASTS.indonesian.runtimeLocale,
};

function normalizeBrowserLanguage(languageCode) {
  return (languageCode || '').trim().toLowerCase();
}

function detectBrowserLanguage() {
  const candidates = [
    ...(Array.isArray(navigator.languages) ? navigator.languages : []),
    navigator.language,
    navigator.userLanguage,
  ].filter(Boolean);

  for (const candidate of candidates) {
    const normalizedCandidate = normalizeBrowserLanguage(candidate);
    const exactDemoLocale = HERO_DEMO_BROWSER_LANGUAGE_MAP[normalizedCandidate];

    if (exactDemoLocale) {
      return HERO_DEMO_CONTRASTS[exactDemoLocale].runtimeLocale;
    }

    if (browserLanguageMap[normalizedCandidate]) {
      return browserLanguageMap[normalizedCandidate];
    }

    const baseLanguage = normalizedCandidate.split('-')[0];
    const baseDemoLocale = HERO_DEMO_BROWSER_LANGUAGE_MAP[baseLanguage];

    if (baseDemoLocale) {
      return HERO_DEMO_CONTRASTS[baseDemoLocale].runtimeLocale;
    }

    if (browserLanguageMap[baseLanguage]) {
      return browserLanguageMap[baseLanguage];
    }
  }

  return 'en';
}

function applyDirectionalSafety(element, isRtl) {
  if (isRtl) {
    element.setAttribute('dir', 'auto');
    element.style.unicodeBidi = 'plaintext';
  } else {
    element.removeAttribute('dir');
    element.style.unicodeBidi = '';
  }
}

export function getCurrentLanguage() {
  const storedLang = localStorage.getItem(USER_LANGUAGE_STORAGE_KEY);
  if (storedLang && translations[storedLang]) {
    return storedLang;
  }

  const legacyLang = localStorage.getItem(LEGACY_LANGUAGE_STORAGE_KEY);
  if (legacyLang && translations[legacyLang]) {
    localStorage.setItem(USER_LANGUAGE_STORAGE_KEY, legacyLang);
    return legacyLang;
  }

  return detectBrowserLanguage();
}

export function setLanguage(lang) {
  localStorage.setItem(USER_LANGUAGE_STORAGE_KEY, lang);
  localStorage.removeItem(LEGACY_LANGUAGE_STORAGE_KEY);
  applyTranslations(lang);
}

export function applyTranslations(lang) {
  const t = translations[lang] || translations.en;
  const { htmlLang, isRtl } = getRuntimeLocaleMeta(lang);

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.getAttribute('data-i18n');
    const translation = t[key];

    if (translation === undefined) {
      return;
    }

    const listItem = element.closest('ul.feature-list li');
    if (listItem) {
      listItem.style.display = translation === '' ? 'none' : '';
    }

    element.innerHTML = translation;
    applyDirectionalSafety(element, isRtl);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    const key = element.getAttribute('data-i18n-placeholder');
    if (t[key]) {
      element.placeholder = t[key];
    }
  });

  const langSelector = document.getElementById('language-selector');
  if (langSelector && translations[lang]) {
    langSelector.textContent = `${translations[lang].flag} ${translations[lang].name}`;
    applyDirectionalSafety(langSelector, isRtl);
  }

  document.documentElement.lang = htmlLang;
}
