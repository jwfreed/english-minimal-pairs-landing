export const APP_CAPABILITY_STATUS = Object.freeze({
  EXACT_PAIR_EXISTS: 'EXACT_PAIR_EXISTS',
  CONTRAST_EXISTS_ONLY: 'CONTRAST_EXISTS_ONLY',
  NO_APP_SUPPORT: 'NO_APP_SUPPORT',
});

export const APP_CAPABILITY_CONTRACT =
  'docs/app-website-contrast-alignment.md';

// Canonical website contrast IDs map explicitly to the app group IDs that
// represent the same learning unit. Directional app IDs remain explicit
// aliases; no IPA or phonetic-similarity inference participates in support.
export const APP_GROUP_IDS_BY_CAPABILITY_GROUP = Object.freeze({
  aVsE: Object.freeze(['aVsE']),
  aVsUh: Object.freeze(['aVsUh']),
  bV: Object.freeze(['bV', 'vB']),
  ethD: Object.freeze(['ethD']),
  fP: Object.freeze(['fP']),
  hZero: Object.freeze(['hZero']),
  iVsI: Object.freeze(['iVsI']),
  pB: Object.freeze(['pB']),
  rL: Object.freeze(['rL']),
  thetaS: Object.freeze(['thetaS', 'sTheta']),
  thetaT: Object.freeze(['thetaT']),
  uhVsAh: Object.freeze(['uhVsAh']),
  uVsU: Object.freeze(['uVsU']),
  vF: Object.freeze(['vF']),
  vW: Object.freeze(['vW', 'wV']),
  zS: Object.freeze(['zS']),
});

const group = (contrast, pairs) => Object.freeze({
  contrast,
  pairs: Object.freeze(pairs.split(' ')),
});

// Website-side snapshot of the app inventory documented in the canonical
// alignment artifact. Group IDs and pair order are preserved from the app.
export const APP_CAPABILITY_INVENTORY = Object.freeze({
  ja: Object.freeze({
    rL: group('r vs l', 'rake/lake right/light red/led rate/late rice/lice road/load rag/lag rip/lip rain/lane pray/play correct/collect crowd/cloud'),
    bV: group('b vs v', 'ban/van bet/vet best/vest berry/very boat/vote bail/veil bow/vow bat/vat marble/marvel curb/curve'),
    sTheta: group('s vs θ', 'sink/think saw/thaw sum/thumb sick/thick sought/thought sank/thank mass/math sigh/thigh moss/moth face/faith'),
    aVsUh: group('æ vs ʌ', 'cat/cut bat/but hat/hut batter/butter bag/bug mad/mud ran/run pan/pun match/much cap/cup hang/hung stamp/stump'),
    iVsI: group('iː vs ɪ', 'sheep/ship peel/pill bean/bin leave/live feel/fill reed/rid beat/bit seal/sill heap/hip feet/fit neat/knit peach/pitch'),
  }),
  zh: Object.freeze({
    thetaS: group('θ vs s', 'thin/sin thaw/saw thumb/sum thick/sick thought/sought thank/sank think/sink faith/face math/mass mouth/mouse both/boss path/pass'),
    vW: group('v vs w', 'vine/wine vent/went vet/wet vest/west vile/while verse/worse vow/wow veil/wail vane/wane veal/wheel viper/wiper'),
    rL: group('r vs l', 'right/light red/led rock/lock road/load rate/late rain/lane rake/lake rice/lice rung/lung rip/lip correct/collect crowd/cloud'),
    iVsI: group('iː vs ɪ', 'beat/bit sheep/ship bean/bin leave/live feel/fill reed/rid feet/fit seat/sit neat/knit peach/pitch'),
    uVsU: group('uː vs ʊ', 'pool/pull suit/soot fool/full wooed/wood Luke/look cooed/could stewed/stood'),
  }),
  th: Object.freeze({
    thetaT: group('θ vs t', 'thin/tin thigh/tie thorn/torn thick/tick thought/taught three/tree thank/tank thread/tread threw/true thaw/taw math/mat oath/oat'),
    ethD: group('ð vs d', 'then/den those/doze though/dough father/fodder they/day lather/ladder seethe/seed there/dare soothe/sued breathe/breed loathe/load'),
    vF: group('v vs f', 'vine/fine vast/fast veil/fail vat/fat vault/fault view/few van/fan vase/face save/safe leave/leaf'),
    zS: group('z vs s', 'zip/sip zap/sap zinc/sink zeal/seal raise/race eyes/ice zone/sewn rise/rice phase/face zoo/sue buzz/bus lies/lice'),
    rL: group('r vs l', 'right/light red/led row/low road/load rate/late rice/lice rip/lip rain/lane read/lead rake/lake correct/collect crowd/cloud'),
  }),
  es: Object.freeze({
    iVsI: group('iː vs ɪ', 'sheep/ship seat/sit teen/tin deed/did leave/live feel/fill heat/hit bead/bid beat/bit heal/hill meal/mill feet/fit neat/knit peach/pitch'),
    uhVsAh: group('ʌ vs ɑː', 'cut/cot luck/lock cup/cop duck/dock hut/hot sung/song nut/not bus/boss gun/gone done/don sub/sob bug/bog'),
    aVsE: group('æ vs ɛ', 'bad/bed pan/pen dad/dead bat/bet band/bend ham/hem man/men sat/set gas/guess sad/said land/lend mat/met'),
    bV: group('b vs v', 'ban/van bet/vet boat/vote berry/very best/vest bolt/volt bow/vow bane/vane bat/vat marble/marvel curb/curve bail/veil'),
    thetaS: group('θ vs s', 'thin/sin thick/sick think/sink theme/seem mouth/mouse path/pass thaw/saw thumb/sum thought/sought thank/sank faith/face math/mass'),
  }),
  ar: Object.freeze({
    pB: group('p vs b', 'pat/bat pig/big pin/bin pan/ban pet/bet pill/bill pear/bear peak/beak pale/bale pack/back rapid/rabid cap/cab'),
    vF: group('v vs f', 'vine/fine vat/fat van/fan vase/face save/safe leave/leaf vast/fast veil/fail vault/fault view/few very/ferry veer/fear'),
    thetaS: group('θ vs s', 'thin/sin thaw/saw thumb/sum thick/sick thought/sought thank/sank think/sink mouth/mouse both/boss path/pass'),
    ethD: group('ð vs d', 'then/den those/doze though/dough father/fodder they/day lather/ladder seethe/seed there/dare soothe/sued breathe/breed loathe/load'),
    iVsI: group('iː vs ɪ', 'sheep/ship peel/pill bean/bin leave/live feel/fill reed/rid beat/bit green/grin seal/sill feet/fit peak/pick neat/knit heed/hid peach/pitch least/list'),
  }),
  ru: Object.freeze({
    iVsI: group('iː vs ɪ', 'sheep/ship leave/live beat/bit feet/fit neat/knit peach/pitch bean/bin keen/kin reed/rid deep/dip seal/sill heap/hip'),
    aVsUh: group('æ vs ʌ', 'bat/but cap/cup pan/pun ban/bun hang/hung stamp/stump cat/cut hat/hut bag/bug mad/mud match/much ran/run'),
    wV: group('w vs v', 'wine/vine went/vent wet/vet west/vest while/vile worse/verse wow/vow wail/veil wane/vane wheel/veal wiper/viper'),
    thetaS: group('θ vs s', 'thin/sin thaw/saw thumb/sum thick/sick thought/sought thank/sank think/sink mouth/mouse both/boss path/pass'),
    hZero: group('h vs ∅', 'hat/at hit/it hall/all heat/eat hear/ear hold/old hill/ill harm/arm her/err hair/air hedge/edge hand/and'),
  }),
  ko: Object.freeze({
    iVsI: group('iː vs ɪ', 'sheep/ship peel/pill bean/bin leave/live feel/fill reed/rid beat/bit feet/fit neat/knit peach/pitch'),
    fP: group('f vs p', 'fine/pine face/pace fork/pork fan/pan fat/pat file/pile ferry/perry feel/peel foot/put fail/pale coffee/copy leaf/leap'),
    vB: group('v vs b', 'van/ban vet/bet vent/bent vest/best vote/boat very/berry vow/bow veil/bail vat/bat vase/base dove/dub curve/curb'),
    rL: group('r vs l', 'right/light red/led row/low rate/late road/load rice/lice rip/lip rain/lane read/lead rake/lake correct/collect crowd/cloud'),
    thetaS: group('θ vs s', 'thin/sin thaw/saw thumb/sum thick/sick thought/sought thank/sank think/sink mouth/mouse both/boss path/pass'),
  }),
  'hi-ur': Object.freeze({
    thetaT: group('θ vs t', 'thin/tin thigh/tie thorn/torn thick/tick thought/taught three/tree thank/tank thread/tread threw/true thaw/taw math/mat oath/oat'),
    ethD: group('ð vs d', 'then/den those/doze though/dough father/fodder they/day lather/ladder seethe/seed there/dare soothe/sued breathe/breed loathe/load'),
    zS: group('z vs s', 'zip/sip zeal/seal zone/sewn zoo/sue buzz/bus lies/lice zap/sap zinc/sink rise/rice maze/mace phase/face prize/price'),
    wV: group('w vs v', 'wine/vine west/vest wow/vow wane/vane wheel/veal wiper/viper'),
    aVsE: group('æ vs ɛ', 'bad/bed bag/beg man/men pan/pen gas/guess sad/said dad/dead land/lend mat/met bat/bet band/bend ham/hem'),
  }),
  pt: Object.freeze({
    thetaT: group('θ vs t', 'thin/tin thigh/tie thorn/torn thick/tick thought/taught three/tree thank/tank thrill/trill thread/tread thaw/taw math/mat oath/oat'),
    ethD: group('ð vs d', 'then/den those/doze though/dough father/fodder they/day lather/ladder seethe/seed there/dare soothe/sued breathe/breed loathe/load'),
    iVsI: group('iː vs ɪ', 'sheep/ship peel/pill heel/hill leave/live feel/fill bead/bid beat/bit green/grin seek/sick feet/fit neat/knit peach/pitch'),
    uVsU: group('uː vs ʊ', 'pool/pull suit/soot fool/full wooed/wood Luke/look cooed/could stewed/stood'),
    aVsE: group('æ vs ɛ', 'bad/bed man/men sat/set pan/pen mass/mess sad/said dad/dead land/lend mat/met bat/bet rack/wreck band/bend bland/blend ham/hem flash/flesh'),
  }),
  vi: Object.freeze({
    thetaT: group('θ vs t', 'thin/tin thick/tick thank/tank thaw/taw math/mat oath/oat thigh/tie thorn/torn thought/taught three/tree thread/tread threw/true'),
    ethD: group('ð vs d', 'then/den though/dough they/day there/dare breathe/breed loathe/load those/doze father/fodder lather/ladder seethe/seed'),
    zS: group('z vs s', 'zip/sip zeal/seal zone/sewn zoo/sue buzz/bus lies/lice zap/sap zinc/sink rise/rice maze/mace phase/face prize/price'),
    rL: group('r vs l', 'right/light red/led row/low road/load rain/lane read/lead rip/lip rung/lung ride/lied rake/lake correct/collect crowd/cloud'),
    aVsUh: group('æ vs ʌ', 'cat/cut batter/butter ran/run cap/cup hang/hung stamp/stump bat/but hat/hut bag/bug mad/mud pan/pun match/much'),
  }),
  tr: Object.freeze({
    thetaT: group('θ vs t', 'thin/tin thigh/tie thorn/torn thick/tick thought/taught three/tree thank/tank thread/tread threw/true thaw/taw thrash/trash math/mat bath/bat oath/oat cloth/clot'),
    ethD: group('ð vs d', 'then/den those/doze though/dough father/fodder they/day lather/ladder seethe/seed there/dare soothe/sued breathe/breed loathe/load'),
    iVsI: group('iː vs ɪ', 'sheep/ship peel/pill bean/bin leave/live feel/fill reed/rid beat/bit green/grin seal/sill feet/fit peak/pick neat/knit heed/hid peach/pitch least/list'),
    uVsU: group('uː vs ʊ', 'pool/pull suit/soot fool/full wooed/wood Luke/look cooed/could stewed/stood'),
    aVsUh: group('æ vs ʌ', 'cat/cut bat/but hat/hut batter/butter bag/bug mad/mud ran/run pan/pun match/much cap/cup hang/hung stamp/stump'),
  }),
  fa: Object.freeze({
    thetaT: group('θ vs t', 'thin/tin thigh/tie thorn/torn thick/tick thought/taught three/tree thank/tank thread/tread threw/true thaw/taw thrash/trash math/mat bath/bat oath/oat cloth/clot'),
    ethD: group('ð vs d', 'then/den those/doze though/dough father/fodder they/day lather/ladder seethe/seed there/dare soothe/sued breathe/breed loathe/load'),
    wV: group('w vs v', 'wine/vine went/vent wet/vet west/vest while/vile worse/verse wow/vow wail/veil wane/vane wheel/veal wiper/viper'),
    iVsI: group('iː vs ɪ', 'sheep/ship peel/pill bean/bin leave/live feel/fill reed/rid beat/bit green/grin seal/sill feet/fit peak/pick neat/knit heed/hid peach/pitch least/list'),
    aVsE: group('æ vs ɛ', 'bad/bed man/men sat/set pan/pen mass/mess sad/said dad/dead land/lend mat/met bat/bet rack/wreck band/bend bland/blend ham/hem flash/flesh'),
  }),
  yue: Object.freeze({
    thetaT: group('θ vs t', 'thin/tin thigh/tie thorn/torn thick/tick thought/taught three/tree thank/tank thread/tread threw/true thaw/taw math/mat oath/oat'),
    ethD: group('ð vs d', 'then/den those/doze though/dough father/fodder they/day lather/ladder seethe/seed there/dare soothe/sued breathe/breed loathe/load'),
    vW: group('v vs w', 'vine/wine vent/went vet/wet vest/west vile/while verse/worse vow/wow veil/wail vane/wane veal/wheel viper/wiper'),
    rL: group('r vs l', 'right/light red/led row/low rate/late road/load rice/lice rip/lip rain/lane read/lead rake/lake rung/lung correct/collect ride/lied crowd/cloud'),
    iVsI: group('iː vs ɪ', 'sheep/ship peel/pill bean/bin leave/live feel/fill reed/rid beat/bit seal/sill heap/hip feet/fit neat/knit peach/pitch'),
  }),
  id: Object.freeze({
    thetaT: group('θ vs t', 'thin/tin thick/tick thank/tank thaw/taw math/mat oath/oat thigh/tie thorn/torn thought/taught three/tree thread/tread threw/true'),
    ethD: group('ð vs d', 'then/den though/dough they/day there/dare breathe/breed loathe/load those/doze father/fodder lather/ladder seethe/seed'),
    vF: group('v vs f', 'vine/fine vast/fast veil/fail vat/fat vault/fault view/few van/fan very/ferry veer/fear vase/face save/safe leave/leaf'),
    aVsUh: group('æ vs ʌ', 'cat/cut batter/butter ran/run cap/cup hang/hung stamp/stump bat/but hat/hut bag/bug mad/mud pan/pun match/much'),
    iVsI: group('iː vs ɪ', 'sheep/ship leave/live beat/bit feet/fit neat/knit peach/pitch bean/bin keen/kin reed/rid deep/dip seal/sill heap/hip'),
  }),
});

const LOCALE_ALIASES = Object.freeze({
  japanese: 'ja',
  日本語: 'ja',
  mandarin: 'zh',
  'mandarin chinese': 'zh',
  chinese: 'zh',
  中文: 'zh',
  thai: 'th',
  ภาษาไทย: 'th',
  spanish: 'es',
  español: 'es',
  arabic: 'ar',
  العربية: 'ar',
  russian: 'ru',
  русский: 'ru',
  korean: 'ko',
  한국어: 'ko',
  hindi: 'hi-ur',
  urdu: 'hi-ur',
  'hindi / urdu': 'hi-ur',
  hi: 'hi-ur',
  ur: 'hi-ur',
  portuguese: 'pt',
  português: 'pt',
  vietnamese: 'vi',
  'tiếng việt': 'vi',
  turkish: 'tr',
  türkçe: 'tr',
  persian: 'fa',
  farsi: 'fa',
  فارسی: 'fa',
  cantonese: 'yue',
  廣東話: 'yue',
  indonesian: 'id',
  'bahasa indonesia': 'id',
  'zh-hans': 'zh',
  'zh-cn': 'zh',
  'zh-sg': 'zh',
  'zh-hant-hk': 'yue',
  'zh-hk': 'yue',
  'pt-br': 'pt',
  'pt-pt': 'pt',
});

function normalizeText(value) {
  return String(value || '').trim().toLowerCase();
}

export function resolveCapabilityLocale(localeOrL1) {
  const normalized = normalizeText(localeOrL1).replaceAll('_', '-');

  if (APP_CAPABILITY_INVENTORY[normalized]) {
    return normalized;
  }

  if (LOCALE_ALIASES[normalized]) {
    return LOCALE_ALIASES[normalized];
  }

  const baseLocale = normalized.split('-')[0];
  return APP_CAPABILITY_INVENTORY[baseLocale] ? baseLocale : null;
}

function normalizePair(flagshipPair) {
  const words = Array.isArray(flagshipPair)
    ? flagshipPair
    : String(flagshipPair || '').split(/\s*(?:\/|vs)\s*/iu);
  const normalizedWords = words
    .map((word) => normalizeText(typeof word === 'object' ? word.text : word))
    .filter(Boolean);

  if (normalizedWords.length !== 2) {
    return { display: normalizedWords.join('/'), key: null };
  }

  return {
    display: normalizedWords.join('/'),
    key: [...normalizedWords].sort().join('|'),
  };
}

function normalizePairKey(pair) {
  return pair
    .split('/')
    .map(normalizeText)
    .sort()
    .join('|');
}

function buildResult({
  status,
  route,
  requestedLocale,
  locale,
  pair,
  requestedContrastGroup,
  matchedGroup,
  reason,
}) {
  const recommendedCTA = status === APP_CAPABILITY_STATUS.EXACT_PAIR_EXISTS
    ? `Practice ${pair.display} in Soundwise`
    : status === APP_CAPABILITY_STATUS.CONTRAST_EXISTS_ONLY
      ? 'Practice this sound contrast in Soundwise'
      : null;

  return Object.freeze({
    status,
    recommendedCTA,
    evidence: Object.freeze({
      contract: APP_CAPABILITY_CONTRACT,
      route: route || null,
      requestedLocale: requestedLocale || null,
      resolvedL1: locale,
      flagshipPair: pair.display || null,
      requestedContrastGroup: requestedContrastGroup || null,
      matchedContrastGroup: matchedGroup?.id || null,
      matchedContrast: matchedGroup?.contrast || null,
      reason,
    }),
  });
}

export function resolveAppCapability({
  route,
  locale,
  l1,
  flagshipPair,
  contrastGroup,
} = {}) {
  const requestedLocale = l1 || locale;
  const resolvedLocale = resolveCapabilityLocale(requestedLocale);
  const pair = normalizePair(flagshipPair);
  const groups = resolvedLocale
    ? Object.entries(APP_CAPABILITY_INVENTORY[resolvedLocale]).map(([id, capability]) => ({
      id,
      ...capability,
    }))
    : [];

  if (!resolvedLocale) {
    return buildResult({
      status: APP_CAPABILITY_STATUS.NO_APP_SUPPORT,
      route,
      requestedLocale,
      locale: null,
      pair,
      requestedContrastGroup: contrastGroup,
      reason: 'NO_SUPPORTED_L1_CONTEXT',
    });
  }

  const eligibleAppGroupIds =
    APP_GROUP_IDS_BY_CAPABILITY_GROUP[contrastGroup] || [];
  const eligibleGroups = groups.filter((candidate) => (
    eligibleAppGroupIds.includes(candidate.id)
  ));
  const exactGroup = pair.key
    ? eligibleGroups.find((candidate) => (
      candidate.pairs.some((candidatePair) => normalizePairKey(candidatePair) === pair.key)
    ))
    : null;

  if (exactGroup) {
    return buildResult({
      status: APP_CAPABILITY_STATUS.EXACT_PAIR_EXISTS,
      route,
      requestedLocale,
      locale: resolvedLocale,
      pair,
      requestedContrastGroup: contrastGroup,
      matchedGroup: exactGroup,
      reason: 'EXACT_PAIR_FOUND_IN_L1_INVENTORY',
    });
  }

  const contrastOnlyGroup = eligibleGroups[0];

  if (contrastOnlyGroup) {
    return buildResult({
      status: APP_CAPABILITY_STATUS.CONTRAST_EXISTS_ONLY,
      route,
      requestedLocale,
      locale: resolvedLocale,
      pair,
      requestedContrastGroup: contrastGroup,
      matchedGroup: contrastOnlyGroup,
      reason: 'CONTRAST_FOUND_WITHOUT_EXACT_PAIR',
    });
  }

  return buildResult({
    status: APP_CAPABILITY_STATUS.NO_APP_SUPPORT,
    route,
    requestedLocale,
    locale: resolvedLocale,
    pair,
    requestedContrastGroup: contrastGroup,
    reason: 'PAIR_AND_CONTRAST_ABSENT_FROM_L1_INVENTORY',
  });
}
