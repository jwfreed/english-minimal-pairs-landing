import { translations } from './i18n.js';

const BRAND_NAME = 'Soundwise';

function normalizeOptionalField(value) {
  const normalized = String(value ?? '').trim();
  return normalized || null;
}

// Localized homepage search-appearance metadata. Locale copy may carry
// optional seoTitle/seoDescription overrides (see docs/seo-page-creation-guide.md,
// "Localized homepage SEO metadata"); pages without them keep the historical
// hero-coupled metadata so unpopulated locales are byte-identical to before.
export function resolveSeoMetadata(localeCopy) {
  const seoTitle = normalizeOptionalField(localeCopy.seoTitle);
  const seoDescription = normalizeOptionalField(localeCopy.seoDescription);

  return {
    title: seoTitle || `${localeCopy.heroTitle} | ${BRAND_NAME}`,
    description: seoDescription || localeCopy.heroSubtitle,
  };
}

export function getLocalizedSeoMetadata(runtimeLocale) {
  return resolveSeoMetadata(translations[runtimeLocale] || translations.en);
}
