import { HREFLANG_BY_LOCALE } from './localized-homepage-routes.js';
import { getContentVariantEventParameters } from './analytics-content-variants.js';

export const SEO_CTA_POSITIONS = Object.freeze([
  'hero',
  'mid-content',
  'post-interaction',
  'exercise-summary',
  'post-exercise-footer',
]);

const SEO_CTA_POSITION_SET = new Set(SEO_CTA_POSITIONS);
const EXERCISE_COMPLETION_EVENTS = new Set([
  'demo_completed',
  'challenge_completed',
]);
const SEO_LOCALE_BY_HREFLANG = Object.freeze(
  Object.fromEntries(
    Object.entries(HREFLANG_BY_LOCALE).map(([locale, hreflang]) => [hreflang.toLowerCase(), locale])
  )
);

function getPathSegments(pathname) {
  return pathname
    .split('/')
    .map((segment) => decodeURIComponent(segment).trim().toLowerCase())
    .filter((segment) => segment && segment !== 'index.html');
}

export function getSeoPageSlug(pathname) {
  return getPathSegments(pathname).at(-1);
}

export function getSeoPageLocale(pathname, documentLanguage = 'en') {
  const segments = getPathSegments(pathname);
  const localizedSourceIndex = segments.indexOf('locales');
  const routeLocale = localizedSourceIndex >= 0
    ? segments[localizedSourceIndex + 1]
    : segments[0];

  if (HREFLANG_BY_LOCALE[routeLocale]) {
    return routeLocale;
  }

  const normalizedDocumentLanguage = documentLanguage.trim().toLowerCase();
  return SEO_LOCALE_BY_HREFLANG[normalizedDocumentLanguage]
    || normalizedDocumentLanguage.split('-')[0]
    || 'en';
}

export function getSeoCtaPosition(link) {
  const declaredPosition = link.dataset.ctaPosition;

  if (SEO_CTA_POSITION_SET.has(declaredPosition)) {
    return declaredPosition;
  }

  if (link.closest('.seo-nav')) {
    return 'hero';
  }

  if (link.closest('.footer')) {
    return 'post-exercise-footer';
  }

  return 'mid-content';
}

export function buildSeoAppStoreAttribution({
  link,
  pathname,
  documentLanguage,
  exerciseCompleted,
  contentVariant,
}) {
  return {
    page_slug: getSeoPageSlug(pathname),
    learner_language: documentLanguage || 'en',
    locale: getSeoPageLocale(pathname, documentLanguage),
    cta_position: getSeoCtaPosition(link),
    exercise_completed: exerciseCompleted === true,
    ...getContentVariantEventParameters(contentVariant),
  };
}

export function buildHomepageAppStoreAttribution({
  link,
  pathname,
  documentLanguage,
  language,
  exerciseCompleted,
  contentVariant,
}) {
  return {
    page_slug: 'homepage',
    learner_language: language || documentLanguage || 'en',
    locale: getSeoPageLocale(pathname, documentLanguage),
    cta_position: getSeoCtaPosition(link),
    exercise_completed: exerciseCompleted === true,
    ...getContentVariantEventParameters(contentVariant),
  };
}

export function buildExerciseAttribution({
  eventName,
  pageSlug,
  locale,
  contentVariant,
}) {
  return {
    page_slug: pageSlug,
    locale,
    exercise_completed: EXERCISE_COMPLETION_EVENTS.has(eventName),
    ...getContentVariantEventParameters(contentVariant),
  };
}
