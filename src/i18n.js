import { supplementalTranslations } from './landing-supplement-translations.js';
import { buildLandingTranslations, getRuntimeLocaleMeta } from './landing-copy-runtime.js';

export const translations = buildLandingTranslations(supplementalTranslations);

const languageMap = {
  en: 'en',
  ja: '日本語',
  zh: '中文',
  'zh-CN': '中文',
  'zh-TW': '中文',
  'zh-HK': '廣東話',
  yue: '廣東話',
  es: 'idioma español',
  th: 'ภาษาไทย',
  ko: '한국어',
  pt: 'Português',
  ru: 'русский язык',
  ar: 'اللغة العربية',
  vi: 'Tiếng Việt',
  hi: 'हिंदी/اردو',
  ur: 'हिंदी/اردو',
  tr: 'Türkçe',
  fa: 'زبان فارسی',
  id: 'bahasa Indo',
};

function detectBrowserLanguage() {
  const browserLang = navigator.language || navigator.userLanguage;

  if (languageMap[browserLang]) {
    return languageMap[browserLang];
  }

  const langCode = browserLang.split('-')[0];
  if (languageMap[langCode]) {
    return languageMap[langCode];
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
  const storedLang = localStorage.getItem('language');
  if (storedLang) {
    return storedLang;
  }

  const detectedLang = detectBrowserLanguage();
  localStorage.setItem('language', detectedLang);
  return detectedLang;
}

export function setLanguage(lang) {
  localStorage.setItem('language', lang);
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
