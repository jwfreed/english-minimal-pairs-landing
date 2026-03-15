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

export const HERO_DEMO_CONTRASTS = {
  english: {
    runtimeLocale: 'en',
    nativeName: 'English',
    contrast: '/ɪ/ vs /iː/',
    words: [
      { text: 'ship', ipa: '/ʃɪp/' },
      { text: 'sheep', ipa: '/ʃiːp/' },
    ],
  },
  japanese: {
    runtimeLocale: '日本語',
    nativeName: '日本語',
    contrast: '/r/ vs /l/',
    words: [
      { text: 'right', ipa: '/raɪt/' },
      { text: 'light', ipa: '/laɪt/' },
    ],
  },
  mandarin: {
    runtimeLocale: '中文',
    nativeName: '普通话',
    contrast: '/θ/ vs /s/',
    words: [
      { text: 'think', ipa: '/θɪŋk/' },
      { text: 'sink', ipa: '/sɪŋk/' },
    ],
  },
  thai: {
    runtimeLocale: 'ภาษาไทย',
    nativeName: 'ไทย',
    contrast: '/θ/ vs /t/',
    words: [
      { text: 'thin', ipa: '/θɪn/' },
      { text: 'tin', ipa: '/tɪn/' },
    ],
  },
  spanish: {
    runtimeLocale: 'idioma español',
    nativeName: 'Español',
    contrast: '/ɪ/ vs /iː/',
    words: [
      { text: 'ship', ipa: '/ʃɪp/' },
      { text: 'sheep', ipa: '/ʃiːp/' },
    ],
  },
  arabic: {
    runtimeLocale: 'اللغة العربية',
    nativeName: 'العربية',
    contrast: '/p/ vs /b/',
    words: [
      { text: 'pack', ipa: '/pæk/' },
      { text: 'back', ipa: '/bæk/' },
    ],
  },
  russian: {
    runtimeLocale: 'русский язык',
    nativeName: 'Русский',
    contrast: '/w/ vs /v/',
    words: [
      { text: 'wine', ipa: '/waɪn/' },
      { text: 'vine', ipa: '/vaɪn/' },
    ],
  },
  korean: {
    runtimeLocale: '한국어',
    nativeName: '한국어',
    contrast: '/f/ vs /p/',
    words: [
      { text: 'fan', ipa: '/fæn/' },
      { text: 'pan', ipa: '/pæn/' },
    ],
  },
  hindi_urdu: {
    runtimeLocale: 'हिंदी/اردو',
    nativeName: 'हिंदी',
    contrast: '/v/ vs /w/',
    words: [
      { text: 'vest', ipa: '/vest/' },
      { text: 'west', ipa: '/west/' },
    ],
  },
  portuguese: {
    runtimeLocale: 'Português',
    nativeName: 'Português',
    contrast: '/ɪ/ vs /iː/',
    words: [
      { text: 'live', ipa: '/lɪv/' },
      { text: 'leave', ipa: '/liːv/' },
    ],
  },
  vietnamese: {
    runtimeLocale: 'Tiếng Việt',
    nativeName: 'Tiếng Việt',
    contrast: '/d/ vs /ð/',
    words: [
      { text: 'day', ipa: '/deɪ/' },
      { text: 'they', ipa: '/ðeɪ/' },
    ],
  },
  turkish: {
    runtimeLocale: 'Türkçe',
    nativeName: 'Türkçe',
    contrast: '/θ/ vs /t/',
    words: [
      { text: 'thin', ipa: '/θɪn/' },
      { text: 'tin', ipa: '/tɪn/' },
    ],
  },
  persian: {
    runtimeLocale: 'زبان فارسی',
    nativeName: 'فارسی',
    contrast: '/θ/ vs /s/',
    words: [
      { text: 'think', ipa: '/θɪŋk/' },
      { text: 'sink', ipa: '/sɪŋk/' },
    ],
  },
  cantonese: {
    runtimeLocale: '廣東話',
    nativeName: '廣東話',
    contrast: '/l/ vs /n/',
    words: [
      { text: 'light', ipa: '/laɪt/' },
      { text: 'night', ipa: '/naɪt/' },
    ],
  },
  indonesian: {
    runtimeLocale: 'bahasa Indo',
    nativeName: 'Bahasa Indonesia',
    contrast: '/f/ vs /p/',
    words: [
      { text: 'fan', ipa: '/fæn/' },
      { text: 'pan', ipa: '/pæn/' },
    ],
  },
};

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
