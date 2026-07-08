export const CONTRAST_CATALOG = {
  'ship-vs-sheep': {
    id: 'ship-vs-sheep',
    words: [
      { text: 'ship', ipa: '/ʃɪp/' },
      { text: 'sheep', ipa: '/ʃiːp/' },
    ],
    contrast: '/ɪ/ vs /iː/',
  },
  'right-vs-light': {
    id: 'right-vs-light',
    words: [
      { text: 'right', ipa: '/raɪt/' },
      { text: 'light', ipa: '/laɪt/' },
    ],
    contrast: '/r/ vs /l/',
  },
  'think-vs-sink': {
    id: 'think-vs-sink',
    words: [
      { text: 'think', ipa: '/θɪŋk/' },
      { text: 'sink', ipa: '/sɪŋk/' },
    ],
    contrast: '/θ/ vs /s/',
  },
  'thin-vs-tin': {
    id: 'thin-vs-tin',
    words: [
      { text: 'thin', ipa: '/θɪn/' },
      { text: 'tin', ipa: '/tɪn/' },
    ],
    contrast: '/θ/ vs /t/',
  },
  'pack-vs-back': {
    id: 'pack-vs-back',
    words: [
      { text: 'pack', ipa: '/pæk/' },
      { text: 'back', ipa: '/bæk/' },
    ],
    contrast: '/p/ vs /b/',
  },
  'wine-vs-vine': {
    id: 'wine-vs-vine',
    words: [
      { text: 'wine', ipa: '/waɪn/' },
      { text: 'vine', ipa: '/vaɪn/' },
    ],
    contrast: '/w/ vs /v/',
  },
  'fan-vs-pan': {
    id: 'fan-vs-pan',
    words: [
      { text: 'fan', ipa: '/fæn/' },
      { text: 'pan', ipa: '/pæn/' },
    ],
    contrast: '/f/ vs /p/',
  },
  'vest-vs-west': {
    id: 'vest-vs-west',
    words: [
      { text: 'vest', ipa: '/vest/' },
      { text: 'west', ipa: '/west/' },
    ],
    contrast: '/v/ vs /w/',
  },
  'live-vs-leave': {
    id: 'live-vs-leave',
    words: [
      { text: 'live', ipa: '/lɪv/' },
      { text: 'leave', ipa: '/liːv/' },
    ],
    contrast: '/ɪ/ vs /iː/',
  },
  'day-vs-they': {
    id: 'day-vs-they',
    words: [
      { text: 'day', ipa: '/deɪ/' },
      { text: 'they', ipa: '/ðeɪ/' },
    ],
    contrast: '/d/ vs /ð/',
  },
  'light-vs-night': {
    id: 'light-vs-night',
    words: [
      { text: 'light', ipa: '/laɪt/' },
      { text: 'night', ipa: '/naɪt/' },
    ],
    contrast: '/l/ vs /n/',
  },
};

export function getContrastById(id) {
  return CONTRAST_CATALOG[id] || null;
}

export function getContrastIdFromWords(words = []) {
  return words.map((word) => word.text.toLowerCase()).join('-vs-');
}
