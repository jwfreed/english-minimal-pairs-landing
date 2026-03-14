import landingCopyData from '../landing-copy.json' with { type: 'json' };

const RUNTIME_TO_ARTIFACT_LOCALE = {
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

const RUNTIME_LOCALE_META = {
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

const LANDING_COPY_TO_RUNTIME_FIELDS = {
  HERO_HEADLINE: ['heroTitle'],
  HERO_DESCRIPTION: ['heroSubtitle'],
  HERO_PRIMARY_CTA: ['ctaPrimary'],
  HERO_SECONDARY_CTA: ['ctaSecondary'],
  PROBLEM_HEADLINE: ['problemTitle'],
  PROBLEM_DESCRIPTION: ['problemSubtitle'],
  SOLUTION_HEADLINE: ['solutionTitle'],
  PROCESS_SUBTITLE: ['howItWorksSubtitle'],
  FEATURE_BUILT_FOR_LANGUAGE: ['feature4', 'featureCard1Text'],
  FEATURE_REAL_ACCENTS: ['feature1', 'featureCard2Text'],
  FEATURE_REAL_WORDS: ['feature2', 'featureCard3Text'],
  FINAL_CTA_HEADLINE: ['ctaTitle'],
  FINAL_CTA_SUBTEXT: ['ctaSubtitle'],
};

function getArtifactLocales() {
  return {
    english: landingCopyData.english,
    ...landingCopyData.translations,
  };
}

function buildOverlayForLocale(artifactLocale) {
  const overlay = {};

  for (const [artifactKey, runtimeKeys] of Object.entries(LANDING_COPY_TO_RUNTIME_FIELDS)) {
    for (const runtimeKey of runtimeKeys) {
      overlay[runtimeKey] = artifactLocale[artifactKey];
    }
  }

  // Preserve the validated microcopy on the runtime object for future use.
  overlay.microcopy = { ...artifactLocale.microcopy };

  return overlay;
}

export function buildRuntimeTranslations(legacyTranslations) {
  const artifactLocales = getArtifactLocales();
  const nextTranslations = {};

  for (const [runtimeLocale, legacyLocale] of Object.entries(legacyTranslations)) {
    const artifactLocaleKey = RUNTIME_TO_ARTIFACT_LOCALE[runtimeLocale];
    const artifactLocale = artifactLocaleKey ? artifactLocales[artifactLocaleKey] : null;

    nextTranslations[runtimeLocale] = artifactLocale
      ? {
          ...legacyLocale,
          ...buildOverlayForLocale(artifactLocale),
        }
      : { ...legacyLocale };
  }

  return nextTranslations;
}

export function getRuntimeLocaleMeta(runtimeLocale) {
  return RUNTIME_LOCALE_META[runtimeLocale] || { htmlLang: 'en', isRtl: false };
}
