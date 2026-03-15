import landingCopyData from '../landing-copy.json' with { type: 'json' };

export const RUNTIME_LOCALE_TO_ARTIFACT_LOCALE = {
  en: 'english',
  '日本語': 'japanese',
  '中文': 'mandarin',
  'idioma español': 'spanish',
  'ภาษาไทย': 'thai',
  '한국어': 'korean',
  'Português': 'portuguese',
  'русский язык': 'russian',
  'اللغة العربية': 'arabic',
  'Tiếng Việt': 'vietnamese',
  'हिंदी/اردو': 'hindi_urdu',
  'Türkçe': 'turkish',
  'زبان فارسی': 'persian',
  '廣東話': 'cantonese',
  'bahasa Indo': 'indonesian',
};

export const RUNTIME_LOCALE_META = {
  en: { htmlLang: 'en', isRtl: false },
  '日本語': { htmlLang: 'ja', isRtl: false },
  '中文': { htmlLang: 'zh-CN', isRtl: false },
  'idioma español': { htmlLang: 'es', isRtl: false },
  'ภาษาไทย': { htmlLang: 'th', isRtl: false },
  '한국어': { htmlLang: 'ko', isRtl: false },
  'Português': { htmlLang: 'pt', isRtl: false },
  'русский язык': { htmlLang: 'ru', isRtl: false },
  'اللغة العربية': { htmlLang: 'ar', isRtl: true },
  'Tiếng Việt': { htmlLang: 'vi', isRtl: false },
  'हिंदी/اردو': { htmlLang: 'hi', isRtl: false },
  'Türkçe': { htmlLang: 'tr', isRtl: false },
  'زبان فارسی': { htmlLang: 'fa', isRtl: true },
  '廣東話': { htmlLang: 'yue', isRtl: false },
  'bahasa Indo': { htmlLang: 'id', isRtl: false },
};

export const CANONICAL_RUNTIME_FIELD_MAP = {
  heroTitle: 'HERO_HEADLINE',
  heroSubtitle: 'HERO_DESCRIPTION',
  ctaPrimary: 'HERO_PRIMARY_CTA',
  ctaSecondary: 'HERO_SECONDARY_CTA',
  problemTitle: 'PROBLEM_HEADLINE',
  problemSubtitle: 'PROBLEM_DESCRIPTION',
  solutionTitle: 'SOLUTION_HEADLINE',
  howItWorksSubtitle: 'PROCESS_SUBTITLE',
  feature4: 'FEATURE_BUILT_FOR_LANGUAGE',
  featureCard1Text: 'FEATURE_BUILT_FOR_LANGUAGE',
  feature1: 'FEATURE_REAL_ACCENTS',
  featureCard2Text: 'FEATURE_REAL_ACCENTS',
  feature2: 'FEATURE_REAL_WORDS',
  featureCard3Text: 'FEATURE_REAL_WORDS',
  ctaTitle: 'FINAL_CTA_HEADLINE',
  ctaSubtitle: 'FINAL_CTA_SUBTEXT',
};

export const CANONICAL_RUNTIME_KEYS = Object.freeze(Object.keys(CANONICAL_RUNTIME_FIELD_MAP));

function getArtifactLocales() {
  return {
    english: landingCopyData.english,
    ...landingCopyData.translations,
  };
}

function buildCanonicalLocale(artifactLocale) {
  const runtimeLocale = {};

  for (const [runtimeKey, artifactKey] of Object.entries(CANONICAL_RUNTIME_FIELD_MAP)) {
    runtimeLocale[runtimeKey] = artifactLocale[artifactKey];
  }

  runtimeLocale.microcopy = { ...artifactLocale.microcopy };

  return runtimeLocale;
}

export function buildLandingTranslations(supplementalTranslations) {
  const artifactLocales = getArtifactLocales();
  const translations = {};

  for (const [runtimeLocale, artifactLocaleKey] of Object.entries(RUNTIME_LOCALE_TO_ARTIFACT_LOCALE)) {
    const canonicalLocale = buildCanonicalLocale(artifactLocales[artifactLocaleKey] || artifactLocales.english);
    const supplementalLocale = supplementalTranslations[runtimeLocale] || supplementalTranslations.en || {};

    translations[runtimeLocale] = {
      ...supplementalLocale,
      ...canonicalLocale,
    };
  }

  return translations;
}

export function getRuntimeLocaleMeta(runtimeLocale) {
  return RUNTIME_LOCALE_META[runtimeLocale] || RUNTIME_LOCALE_META.en;
}
