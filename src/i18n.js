import { supplementalTranslations } from './landing-supplement-translations.js';
import { buildLandingTranslations, getRuntimeLocaleMeta } from './landing-copy-runtime.js';
import { heroDemoTranslations } from './hero-demo-translations.js';
import { HERO_DEMO_BROWSER_LANGUAGE_MAP, HERO_DEMO_CONTRASTS } from './hero-demo-config.js';

export const USER_LANGUAGE_STORAGE_KEY = 'soundwise_user_language';
const LEGACY_LANGUAGE_STORAGE_KEY = 'language';

const translationSourceLocales = new Set([
  ...Object.keys(supplementalTranslations),
  ...Object.keys(heroDemoTranslations),
]);

const translationSource = Object.fromEntries(
  [...translationSourceLocales].map((locale) => [
    locale,
    {
      ...(supplementalTranslations[locale] || {}),
      ...(heroDemoTranslations[locale] || {}),
    },
  ])
);

export const translations = buildLandingTranslations(translationSource);

export function formatTranslationHtml(translation, { formatPhonemes = false } = {}) {
  const html = String(translation ?? '');

  return formatPhonemes
    ? html.replace(/\/([^/]+)\//g, (match) => `<span style="text-transform:none">${match}</span>`)
    : html;
}

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

function getMappedRuntimeLocale(normalizedCandidate) {
  if (!normalizedCandidate) {
    return null;
  }

  const demoLocaleName = normalizedCandidate.replaceAll('-', '_');
  if (HERO_DEMO_CONTRASTS[demoLocaleName]) {
    return HERO_DEMO_CONTRASTS[demoLocaleName].runtimeLocale;
  }

  const languageParts = normalizedCandidate.split('-');
  if (
    (languageParts[0] === 'zh' || languageParts[0] === 'yue')
    && (languageParts.includes('hk') || languageParts.includes('mo'))
  ) {
    return HERO_DEMO_CONTRASTS.cantonese.runtimeLocale;
  }

  const exactDemoLocale = HERO_DEMO_BROWSER_LANGUAGE_MAP[normalizedCandidate];
  if (exactDemoLocale) {
    return HERO_DEMO_CONTRASTS[exactDemoLocale].runtimeLocale;
  }

  if (browserLanguageMap[normalizedCandidate]) {
    return browserLanguageMap[normalizedCandidate];
  }

  const baseLanguage = languageParts[0];
  const baseDemoLocale = HERO_DEMO_BROWSER_LANGUAGE_MAP[baseLanguage];
  if (baseDemoLocale) {
    return HERO_DEMO_CONTRASTS[baseDemoLocale].runtimeLocale;
  }

  return browserLanguageMap[baseLanguage] || null;
}

export function resolveRuntimeLocale(languageCode) {
  const candidate = (languageCode || '').trim();
  if (!candidate) {
    return null;
  }

  if (translations[candidate]) {
    return candidate;
  }

  const caseInsensitiveLocale = Object.keys(translations).find(
    (runtimeLocale) => runtimeLocale.toLowerCase() === candidate.toLowerCase()
  );
  if (caseInsensitiveLocale) {
    return caseInsensitiveLocale;
  }

  const mappedRuntimeLocale = getMappedRuntimeLocale(normalizeBrowserLanguage(candidate));
  return translations[mappedRuntimeLocale] ? mappedRuntimeLocale : null;
}

function detectBrowserLanguage() {
  const candidates = [
    ...(Array.isArray(navigator.languages) ? navigator.languages : []),
    navigator.language,
    navigator.userLanguage,
  ].filter(Boolean);

  for (const candidate of candidates) {
    const runtimeLocale = resolveRuntimeLocale(candidate);
    if (runtimeLocale) {
      return runtimeLocale;
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
  const storedRuntimeLocale = resolveRuntimeLocale(storedLang);
  if (storedRuntimeLocale) {
    if (storedRuntimeLocale !== storedLang) {
      localStorage.setItem(USER_LANGUAGE_STORAGE_KEY, storedRuntimeLocale);
    }
    return storedRuntimeLocale;
  }

  const legacyLang = localStorage.getItem(LEGACY_LANGUAGE_STORAGE_KEY);
  const legacyRuntimeLocale = resolveRuntimeLocale(legacyLang);
  if (legacyRuntimeLocale) {
    localStorage.setItem(USER_LANGUAGE_STORAGE_KEY, legacyRuntimeLocale);
    return legacyRuntimeLocale;
  }

  return detectBrowserLanguage();
}

export function setLanguage(lang) {
  const runtimeLocale = resolveRuntimeLocale(lang) || 'en';
  localStorage.setItem(USER_LANGUAGE_STORAGE_KEY, runtimeLocale);
  localStorage.removeItem(LEGACY_LANGUAGE_STORAGE_KEY);
  applyTranslations(runtimeLocale);
}

export function applyTranslations(lang) {
  const runtimeLocale = resolveRuntimeLocale(lang) || 'en';
  const t = translations[runtimeLocale] || translations.en;
  const { htmlLang, isRtl } = getRuntimeLocaleMeta(runtimeLocale);

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

    const html = formatTranslationHtml(translation, {
      formatPhonemes: element.classList.contains('seo-pairs-group-heading'),
    });
    element.innerHTML = html;
    applyDirectionalSafety(element, isRtl);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    const key = element.getAttribute('data-i18n-placeholder');
    if (t[key]) {
      element.placeholder = t[key];
    }
  });

  const langSelector = document.getElementById('language-selector');
  if (langSelector && translations[runtimeLocale]) {
    langSelector.textContent = `${translations[runtimeLocale].flag} ${translations[runtimeLocale].name}`;
    applyDirectionalSafety(langSelector, isRtl);
  }

  document.documentElement.lang = htmlLang;
}
