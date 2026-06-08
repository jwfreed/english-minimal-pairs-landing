import { HERO_DEMO_CONTRASTS } from './hero-demo-config.js';

export const SITE_ORIGIN = 'https://getsoundwise.co';

export const LOCALIZED_HOMEPAGE_ROUTES = Object.freeze([
  {
    slug: 'ja',
    hreflang: 'ja',
    runtimeLocale: HERO_DEMO_CONTRASTS.japanese.runtimeLocale,
  },
  {
    slug: 'zh',
    hreflang: 'zh',
    runtimeLocale: HERO_DEMO_CONTRASTS.mandarin.runtimeLocale,
  },
  {
    slug: 'th',
    hreflang: 'th',
    runtimeLocale: HERO_DEMO_CONTRASTS.thai.runtimeLocale,
  },
  {
    slug: 'es',
    hreflang: 'es',
    runtimeLocale: HERO_DEMO_CONTRASTS.spanish.runtimeLocale,
  },
  {
    slug: 'ar',
    hreflang: 'ar',
    runtimeLocale: HERO_DEMO_CONTRASTS.arabic.runtimeLocale,
  },
  {
    slug: 'ru',
    hreflang: 'ru',
    runtimeLocale: HERO_DEMO_CONTRASTS.russian.runtimeLocale,
  },
  {
    slug: 'ko',
    hreflang: 'ko',
    runtimeLocale: HERO_DEMO_CONTRASTS.korean.runtimeLocale,
  },
  {
    slug: 'hi-ur',
    hreflang: 'hi-ur',
    runtimeLocale: HERO_DEMO_CONTRASTS.hindi_urdu.runtimeLocale,
  },
  {
    slug: 'pt',
    hreflang: 'pt',
    runtimeLocale: HERO_DEMO_CONTRASTS.portuguese.runtimeLocale,
  },
  {
    slug: 'vi',
    hreflang: 'vi',
    runtimeLocale: HERO_DEMO_CONTRASTS.vietnamese.runtimeLocale,
  },
  {
    slug: 'tr',
    hreflang: 'tr',
    runtimeLocale: HERO_DEMO_CONTRASTS.turkish.runtimeLocale,
  },
  {
    slug: 'fa',
    hreflang: 'fa',
    runtimeLocale: HERO_DEMO_CONTRASTS.persian.runtimeLocale,
  },
  {
    slug: 'yue',
    hreflang: 'yue',
    runtimeLocale: HERO_DEMO_CONTRASTS.cantonese.runtimeLocale,
  },
  {
    slug: 'id',
    hreflang: 'id',
    runtimeLocale: HERO_DEMO_CONTRASTS.indonesian.runtimeLocale,
  },
]);

export const HOMEPAGE_HREFLANG_ROUTES = Object.freeze([
  {
    slug: '',
    hreflang: 'en',
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
