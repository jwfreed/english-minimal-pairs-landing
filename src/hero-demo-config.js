import { CONTRAST_CATALOG } from './contrast-catalog.js';

export const HERO_DEMO_LOCALE_ORDER = [
  'english',
  'japanese',
  'mandarin',
  'thai',
  'spanish',
  'arabic',
  'russian',
  'korean',
  'hindi_urdu',
  'portuguese',
  'vietnamese',
  'turkish',
  'persian',
  'cantonese',
  'indonesian',
];

const HERO_DEMO_LOCALE_META = {
  english: {
    runtimeLocale: 'en',
    nativeName: 'English',
    contrastId: 'ship-vs-sheep',
  },
  japanese: {
    runtimeLocale: '日本語',
    nativeName: '日本語',
    contrastId: 'right-vs-light',
  },
  mandarin: {
    runtimeLocale: '中文',
    nativeName: '普通话',
    contrastId: 'think-vs-sink',
  },
  thai: {
    runtimeLocale: 'ภาษาไทย',
    nativeName: 'ไทย',
    contrastId: 'thin-vs-tin',
  },
  spanish: {
    runtimeLocale: 'idioma español',
    nativeName: 'Español',
    contrastId: 'ship-vs-sheep',
  },
  arabic: {
    runtimeLocale: 'اللغة العربية',
    nativeName: 'العربية',
    contrastId: 'pack-vs-back',
  },
  russian: {
    runtimeLocale: 'русский язык',
    nativeName: 'Русский',
    contrastId: 'wine-vs-vine',
  },
  korean: {
    runtimeLocale: '한국어',
    nativeName: '한국어',
    contrastId: 'fan-vs-pan',
  },
  hindi_urdu: {
    runtimeLocale: 'हिंदी/اردو',
    nativeName: 'हिंदी',
    contrastId: 'vest-vs-west',
  },
  portuguese: {
    runtimeLocale: 'Português',
    nativeName: 'Português',
    contrastId: 'live-vs-leave',
  },
  vietnamese: {
    runtimeLocale: 'Tiếng Việt',
    nativeName: 'Tiếng Việt',
    contrastId: 'day-vs-they',
  },
  turkish: {
    runtimeLocale: 'Türkçe',
    nativeName: 'Türkçe',
    contrastId: 'thin-vs-tin',
  },
  persian: {
    runtimeLocale: 'زبان فارسی',
    nativeName: 'فارسی',
    contrastId: 'think-vs-sink',
  },
  cantonese: {
    runtimeLocale: '廣東話',
    nativeName: '廣東話',
    contrastId: 'light-vs-night',
  },
  indonesian: {
    runtimeLocale: 'bahasa Indo',
    nativeName: 'Bahasa Indonesia',
    contrastId: 'fan-vs-pan',
  },
};

export const HERO_DEMO_CONTRASTS = Object.fromEntries(
  Object.entries(HERO_DEMO_LOCALE_META).map(([demoLocale, meta]) => {
    const contrast = CONTRAST_CATALOG[meta.contrastId] || CONTRAST_CATALOG['ship-vs-sheep'];

    return [
      demoLocale,
      {
        runtimeLocale: meta.runtimeLocale,
        nativeName: meta.nativeName,
        ...contrast,
      },
    ];
  })
);

export const HERO_DEMO_BROWSER_LANGUAGE_MAP = {
  ja: 'japanese',
  'zh-cn': 'mandarin',
  'zh-sg': 'mandarin',
  'zh-hk': 'cantonese',
  yue: 'cantonese',
  th: 'thai',
  es: 'spanish',
  ar: 'arabic',
  ru: 'russian',
  ko: 'korean',
  hi: 'hindi_urdu',
  ur: 'hindi_urdu',
  'pt-br': 'portuguese',
  'pt-pt': 'portuguese',
  vi: 'vietnamese',
  tr: 'turkish',
  fa: 'persian',
  id: 'indonesian',
};

export const RUNTIME_LOCALE_TO_DEMO_LOCALE = Object.fromEntries(
  Object.entries(HERO_DEMO_CONTRASTS).map(([demoLocale, config]) => [config.runtimeLocale, demoLocale])
);
