import { HERO_DEMO_CONTRASTS } from './hero-demo-config.js';

export const SITE_ORIGIN = 'https://getsoundwise.co';

export const HREFLANG_BY_LOCALE = Object.freeze({
  en: 'en',
  ja: 'ja',
  zh: 'zh-Hans',
  th: 'th',
  es: 'es',
  ar: 'ar',
  ru: 'ru',
  ko: 'ko',
  // /hi-ur/ remains the product route, while its Devanagari content targets Hindi in Google.
  'hi-ur': 'hi',
  pt: 'pt',
  vi: 'vi',
  tr: 'tr',
  fa: 'fa',
  // /yue/ remains the product route; Google targeting uses Traditional Chinese for Hong Kong.
  yue: 'zh-Hant-HK',
  id: 'id',
});

export const LOCALIZED_HOMEPAGE_ROUTES = Object.freeze([
  {
    slug: 'ja',
    hreflang: HREFLANG_BY_LOCALE.ja,
    runtimeLocale: HERO_DEMO_CONTRASTS.japanese.runtimeLocale,
  },
  {
    slug: 'zh',
    hreflang: HREFLANG_BY_LOCALE.zh,
    runtimeLocale: HERO_DEMO_CONTRASTS.mandarin.runtimeLocale,
  },
  {
    slug: 'th',
    hreflang: HREFLANG_BY_LOCALE.th,
    runtimeLocale: HERO_DEMO_CONTRASTS.thai.runtimeLocale,
  },
  {
    slug: 'es',
    hreflang: HREFLANG_BY_LOCALE.es,
    runtimeLocale: HERO_DEMO_CONTRASTS.spanish.runtimeLocale,
  },
  {
    slug: 'ar',
    hreflang: HREFLANG_BY_LOCALE.ar,
    runtimeLocale: HERO_DEMO_CONTRASTS.arabic.runtimeLocale,
  },
  {
    slug: 'ru',
    hreflang: HREFLANG_BY_LOCALE.ru,
    runtimeLocale: HERO_DEMO_CONTRASTS.russian.runtimeLocale,
  },
  {
    slug: 'ko',
    hreflang: HREFLANG_BY_LOCALE.ko,
    runtimeLocale: HERO_DEMO_CONTRASTS.korean.runtimeLocale,
  },
  {
    slug: 'hi-ur',
    hreflang: HREFLANG_BY_LOCALE['hi-ur'],
    runtimeLocale: HERO_DEMO_CONTRASTS.hindi_urdu.runtimeLocale,
  },
  {
    slug: 'pt',
    hreflang: HREFLANG_BY_LOCALE.pt,
    runtimeLocale: HERO_DEMO_CONTRASTS.portuguese.runtimeLocale,
  },
  {
    slug: 'vi',
    hreflang: HREFLANG_BY_LOCALE.vi,
    runtimeLocale: HERO_DEMO_CONTRASTS.vietnamese.runtimeLocale,
  },
  {
    slug: 'tr',
    hreflang: HREFLANG_BY_LOCALE.tr,
    runtimeLocale: HERO_DEMO_CONTRASTS.turkish.runtimeLocale,
  },
  {
    slug: 'fa',
    hreflang: HREFLANG_BY_LOCALE.fa,
    runtimeLocale: HERO_DEMO_CONTRASTS.persian.runtimeLocale,
  },
  {
    slug: 'yue',
    hreflang: HREFLANG_BY_LOCALE.yue,
    runtimeLocale: HERO_DEMO_CONTRASTS.cantonese.runtimeLocale,
  },
  {
    slug: 'id',
    hreflang: HREFLANG_BY_LOCALE.id,
    runtimeLocale: HERO_DEMO_CONTRASTS.indonesian.runtimeLocale,
  },
]);

export const HOMEPAGE_HREFLANG_ROUTES = Object.freeze([
  {
    slug: '',
    hreflang: HREFLANG_BY_LOCALE.en,
    runtimeLocale: 'en',
  },
  ...LOCALIZED_HOMEPAGE_ROUTES,
]);

export const HOMEPAGE_ROUTE_BY_SLUG = Object.freeze(
  Object.fromEntries(LOCALIZED_HOMEPAGE_ROUTES.map((route) => [route.slug, route]))
);

export function getHomepageUrl(slug = '') {
  return slug ? `${SITE_ORIGIN}/${slug}/` : `${SITE_ORIGIN}/`;
}
