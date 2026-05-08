import { defineConfig } from 'vite'

const seoPageSlugs = [
  'ship-vs-sheep',
  'bit-vs-beat',
  'sit-vs-seat',
  'live-vs-leave',
  'fill-vs-feel',
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

// Legal pages stay at the repo root so existing /privacy*.html and
// /terms*.html public URLs remain unchanged.
const legalPageEntries = {
  privacy: 'privacy.html',
  terms: 'terms.html',
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
