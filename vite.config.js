import { defineConfig } from 'vite'
import { LOCALIZED_HOMEPAGE_ROUTES } from './src/localized-homepage-routes.js'

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
  'fan-vs-van',
  'vest-vs-west',
  'bet-vs-bat',
  'law-vs-low',
  'heart-vs-hurt',
  'minimal-pairs-practice',
  'english-ear-training',
  'ja/minimal-pairs-practice',
  'ja/english-ear-training',
  'zh/english-ear-training',
  'zh/minimal-pairs-practice',
  'yue/english-ear-training',
  'yue/minimal-pairs-practice',
  'ko/english-ear-training',
  'ko/minimal-pairs-practice',
  'es/english-ear-training',
  'es/minimal-pairs-practice',
  'pt/english-ear-training',
  'pt/minimal-pairs-practice',
  'ar/english-ear-training',
  'ar/minimal-pairs-practice',
  'hi-ur/english-ear-training',
  'hi-ur/minimal-pairs-practice',
  'fa/english-ear-training',
  'fa/minimal-pairs-practice',
  'id/english-ear-training',
  'id/minimal-pairs-practice',
  'ru/english-ear-training',
  'ru/minimal-pairs-practice',
  'th/english-ear-training',
  'th/minimal-pairs-practice',
  'tr/english-ear-training',
  'tr/minimal-pairs-practice',
  'vi/english-ear-training',
  'vi/minimal-pairs-practice',
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

const localizedHomepageEntries = Object.fromEntries(
  LOCALIZED_HOMEPAGE_ROUTES.map((route) => [
    `homepage-${route.slug}`,
    `${route.slug}/index.html`,
  ]),
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
        ...localizedHomepageEntries,
        ...seoPageEntries,
        ...legalPageEntries,
      }
    }
  }
})
