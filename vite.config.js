import { defineConfig } from 'vite'

const seoPageSlugs = [
  'ship-vs-sheep',
  'bit-vs-beat',
  'sit-vs-seat',
  'live-vs-leave',
  'fill-vs-feel',
  'full-vs-fool',
  'pull-vs-pool',
  'bad-vs-bed',
  'man-vs-men',
  'cap-vs-cup',
  'cup-vs-cop',
  'rice-vs-lice',
  'right-vs-light',
  'three-vs-tree',
  'thin-vs-tin',
]

const legalLocales = [
  'ja',
  'zh',
  'yue',
  'es',
  'th',
  'ko',
  'pt',
  'ru',
  'ar',
  'fa',
  'vi',
  'hi-ur',
  'tr',
  'id',
]

const seoPageEntries = Object.fromEntries(
  seoPageSlugs.map((slug) => [slug, `${slug}/index.html`]),
)

// English legal pages have clean primary URLs while legacy .html URLs and
// translated legal .html URLs remain built for existing public links.
const legalPageEntries = {
  privacy: 'privacy/index.html',
  terms: 'terms/index.html',
  privacyLegacy: 'privacy.html',
  termsLegacy: 'terms.html',
  ...Object.fromEntries(
    legalLocales.map((locale) => [`privacy-${locale}`, `privacy-${locale}.html`]),
  ),
  ...Object.fromEntries(
    legalLocales.map((locale) => [`terms-${locale}`, `terms-${locale}.html`]),
  ),
}

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        support: 'support.html',
        ...seoPageEntries,
        ...legalPageEntries,
      }
    }
  }
})
