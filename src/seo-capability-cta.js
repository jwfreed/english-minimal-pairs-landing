import {
  APP_CAPABILITY_STATUS,
  resolveAppCapability,
  resolveCapabilityLocale,
} from './app-capability-resolver.js';
import { getContrastById } from './contrast-catalog.js';
import {
  getSeoCtaPosition,
  getSeoPageLocale,
  getSeoPageSlug,
} from './app-store-attribution.js';

const APP_STORE_ANCHOR_PATTERN =
  /<a\b([^>]*href=["'][^"']*apps\.apple\.com[^"']*["'][^>]*)>([\s\S]*?)<\/a>/giu;

const CTA_COPY_BY_LOCALE = Object.freeze({
  en: {
    exact: (pair) => `Practice ${pair} in Soundwise`,
    contrast: 'Practice this sound contrast in Soundwise',
  },
  ja: {
    exact: (pair) => `Soundwiseで${pair}を練習する`,
    contrast: 'Soundwiseでこの音の違いを練習する',
  },
  zh: {
    exact: (pair) => `用 Soundwise 练习 ${pair}`,
    contrast: '用 Soundwise 练习这组声音差别',
  },
  th: {
    exact: (pair) => `ฝึก ${pair} ใน Soundwise`,
    contrast: 'ฝึกความต่างของเสียงนี้ใน Soundwise',
  },
  es: {
    exact: (pair) => `Practicar ${pair} en Soundwise`,
    contrast: 'Practicar este contraste de sonidos en Soundwise',
  },
  ar: {
    exact: (pair) => `تدرّب على ${pair} في Soundwise`,
    contrast: 'تدرّب على هذا التباين الصوتي في Soundwise',
  },
  ru: {
    exact: (pair) => `Практиковать ${pair} в Soundwise`,
    contrast: 'Практиковать это звуковое различие в Soundwise',
  },
  ko: {
    exact: (pair) => `Soundwise에서 ${pair} 연습하기`,
    contrast: 'Soundwise에서 이 소리 차이를 연습하기',
  },
  'hi-ur': {
    exact: (pair) => `Soundwise पर ${pair} की प्रैक्टिस करें`,
    contrast: 'Soundwise पर इस ध्वनि अंतर की प्रैक्टिस करें',
  },
  pt: {
    exact: (pair) => `Praticar ${pair} no Soundwise`,
    contrast: 'Praticar este contraste de sons no Soundwise',
  },
  vi: {
    exact: (pair) => `Luyện ${pair} trên Soundwise`,
    contrast: 'Luyện sự khác biệt âm này trên Soundwise',
  },
  tr: {
    exact: (pair) => `Soundwise’ta ${pair} çalışın`,
    contrast: 'Soundwise’ta bu ses karşıtlığını çalışın',
  },
  fa: {
    exact: (pair) => `تمرین ${pair} در Soundwise`,
    contrast: 'تمرین این تقابل آوایی در Soundwise',
  },
  yue: {
    exact: (pair) => `用 Soundwise 練習 ${pair}`,
    contrast: '用 Soundwise 練習這組聲音對比',
  },
  id: {
    exact: (pair) => `Latih ${pair} di Soundwise`,
    contrast: 'Latih kontras bunyi ini di Soundwise',
  },
});

export const CAPABILITY_CTA_LOCALES = Object.freeze(
  Object.keys(CTA_COPY_BY_LOCALE)
);

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function getPairDisplay(capability) {
  return (capability?.evidence?.flagshipPair || '')
    .split('/')
    .filter(Boolean)
    .join(' vs ');
}

export function getCapabilityCtaLabel(capability, locale) {
  if (!capability) {
    return null;
  }

  if (capability.status === APP_CAPABILITY_STATUS.NO_APP_SUPPORT) {
    return 'Soundwise App';
  }

  const resolvedLocale = resolveCapabilityLocale(locale)
    || capability.evidence.resolvedL1
    || 'en';
  const copy = CTA_COPY_BY_LOCALE[resolvedLocale] || CTA_COPY_BY_LOCALE.en;

  if (capability.status === APP_CAPABILITY_STATUS.EXACT_PAIR_EXISTS) {
    return copy.exact(getPairDisplay(capability));
  }

  return copy.contrast;
}

export function resolveSeoPageCapability({
  pathname,
  documentLanguage = 'en',
  learnerL1,
} = {}) {
  const route = pathname || '/';
  const slug = getSeoPageSlug(route);
  const contrast = getContrastById(slug);

  if (!contrast) {
    return null;
  }

  const routeLocale = getSeoPageLocale(route, documentLanguage);
  // A localized route or an explicit learner selection is product context.
  // Browser language is deliberately not accepted here: it may inform UI
  // presentation elsewhere, but it is not proof of the learner's L1.
  const learnerLocale = resolveCapabilityLocale(routeLocale)
    || resolveCapabilityLocale(learnerL1)
    || routeLocale;

  return resolveAppCapability({
    route,
    locale: learnerLocale,
    flagshipPair: contrast.words,
    contrastGroup: contrast.capabilityGroup,
  });
}

function addCapabilityAttributes(attributes, capability) {
  const withoutExistingAttributes = attributes
    .replace(/\sdata-app-capability-status=["'][^"']*["']/giu, '')
    .replace(/\sdata-app-capability-cta=["'][^"']*["']/giu, '');

  return `${withoutExistingAttributes} data-app-capability-cta="true" data-app-capability-status="${capability.status}"`;
}

export function alignSeoPageCtaHtml({
  html,
  pathname,
  documentLanguage = 'en',
} = {}) {
  const capability = resolveSeoPageCapability({
    pathname,
    documentLanguage,
  });

  if (!capability) {
    return html;
  }

  const label = escapeHtml(getCapabilityCtaLabel(capability, capability.evidence.resolvedL1));
  const footerIndex = html.search(/<footer\b/iu);
  const contentEnd = footerIndex >= 0 ? footerIndex : html.length;
  const pageContent = html.slice(0, contentEnd).replace(
    APP_STORE_ANCHOR_PATTERN,
    (_, attributes, content) => {
      const alignedLabel = /\bdata-capability-copy=["']generic["']/iu.test(attributes)
        ? content
        : label;

      return `<a${addCapabilityAttributes(attributes, capability)}>${alignedLabel}</a>`;
    }
  );

  return `${pageContent}${html.slice(contentEnd)}`;
}

export function applyCapabilityToSeoCtas({
  root = document,
  capability,
  locale,
} = {}) {
  if (!capability) {
    return [];
  }

  const label = getCapabilityCtaLabel(capability, locale);
  const updatedLinks = [];

  root.querySelectorAll('a[href*="apps.apple.com"]').forEach((link) => {
    if (getSeoCtaPosition(link) === 'post-exercise-footer') {
      return;
    }

    link.dataset.appCapabilityCta = 'true';
    link.dataset.appCapabilityStatus = capability.status;

    if (link.dataset.capabilityCopy !== 'generic') {
      link.textContent = label;
    }

    updatedLinks.push(link);
  });

  return updatedLinks;
}

// Generic App Store links (including footers, hubs, and the homepage demo)
// describe the product rather than promising a route-specific pair/contrast.
// Pair-page practice claims and exercise-summary links are the capability-
// gated paths; product-level links are intentionally outside this resolver.
export function canRenderAppPracticeCta(capability) {
  return Boolean(
    capability
    && capability.status !== APP_CAPABILITY_STATUS.NO_APP_SUPPORT
    && capability.recommendedCTA
  );
}
