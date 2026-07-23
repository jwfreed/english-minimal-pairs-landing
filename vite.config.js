import { defineConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { LOCALIZED_HOMEPAGE_ROUTES } from './src/localized-homepage-routes.js'
import { alignSeoPageCtaHtml } from './src/seo-capability-cta.js'

const seoPageSlugs = [
  'ship-vs-sheep',
  'ja/ship-vs-sheep',
  'zh/ship-vs-sheep',
  'es/ship-vs-sheep',
  'pt/ship-vs-sheep',
  'id/ship-vs-sheep',
  'ru/ship-vs-sheep',
  'tr/ship-vs-sheep',
  'pat-vs-bat',
  'ar/pat-vs-bat',
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
  'yue/right-vs-light',
  'ko/right-vs-light',
  'vi/right-vs-light',
  'hi-ur/vest-vs-west',
  'fa/vest-vs-west',
  'three-vs-tree',
  'thin-vs-tin',
  'th/thin-vs-tin',
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

function getSeoPageSourcePath(slug) {
  return slug.includes('/')
    ? `content/locales/${slug}/index.html`
    : `content/pairs/${slug}/index.html`
}

function getLocalizedHomepageSourcePath(slug) {
  return `content/locales/${slug}/index.html`
}

function getLegacyLegalSourcePath(kind, locale) {
  return `legal/${kind}/${kind}-${locale}.html`
}

const seoPageEntries = Object.fromEntries(
  seoPageSlugs.map((slug) => [slug, getSeoPageSourcePath(slug)]),
)

const localizedHomepageEntries = Object.fromEntries(
  LOCALIZED_HOMEPAGE_ROUTES.map((route) => [
    `homepage-${route.slug}`,
    getLocalizedHomepageSourcePath(route.slug),
  ]),
)

// English legal pages have clean primary URLs while legacy .html URLs and
// translated legal .html URLs remain built for existing public links.
const legalPageEntries = {
  privacy: 'legal/privacy/index.html',
  terms: 'legal/terms/index.html',
  privacyLegacy: 'legal/privacy/privacy.html',
  termsLegacy: 'legal/terms/terms.html',
  ...Object.fromEntries(
    legalLocales.map((locale) => [`privacy-${locale}`, getLegacyLegalSourcePath('privacy', locale)]),
  ),
  ...Object.fromEntries(
    legalLocales.map((locale) => [`terms-${locale}`, getLegacyLegalSourcePath('terms', locale)]),
  ),
}

const htmlOutputFileNames = new Map([
  ...seoPageSlugs.map((slug) => [getSeoPageSourcePath(slug), `${slug}/index.html`]),
  ...LOCALIZED_HOMEPAGE_ROUTES.map((route) => [
    getLocalizedHomepageSourcePath(route.slug),
    `${route.slug}/index.html`,
  ]),
  ['legal/privacy/index.html', 'privacy/index.html'],
  ['legal/terms/index.html', 'terms/index.html'],
  ['legal/privacy/privacy.html', 'privacy.html'],
  ['legal/terms/terms.html', 'terms.html'],
  ...legalLocales.map((locale) => [
    getLegacyLegalSourcePath('privacy', locale),
    `privacy-${locale}.html`,
  ]),
  ...legalLocales.map((locale) => [
    getLegacyLegalSourcePath('terms', locale),
    `terms-${locale}.html`,
  ]),
])

function preservePublicHtmlRoutes() {
  let outDir

  function distPath(fileName) {
    return path.join(outDir, ...fileName.split('/'))
  }

  function removeEmptyDirectories(directory) {
    if (!fs.existsSync(directory)) {
      return
    }

    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        removeEmptyDirectories(path.join(directory, entry.name))
      }
    }

    try {
      fs.rmdirSync(directory)
    } catch {
      // Directory still contains non-migrated files.
    }
  }

  function renameBundleAssets(bundle) {
    for (const [bundleKey, item] of Object.entries(bundle)) {
      if (item.type !== 'asset') {
        continue
      }

      const outputFileName = htmlOutputFileNames.get(item.fileName)
      if (!outputFileName || outputFileName === item.fileName) {
        continue
      }

      if (bundle[outputFileName]) {
        this.error(`Cannot emit ${outputFileName}; output path already exists`)
      }

      delete bundle[bundleKey]
      item.fileName = outputFileName
      bundle[outputFileName] = item
    }
  }

  return {
    name: 'preserve-public-html-routes',
    enforce: 'post',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    generateBundle(_, bundle) {
      renameBundleAssets.call(this, bundle)
    },
    writeBundle() {
      for (const [sourceFileName, outputFileName] of htmlOutputFileNames) {
        if (sourceFileName === outputFileName) {
          continue
        }

        const sourcePath = distPath(sourceFileName)
        if (!fs.existsSync(sourcePath)) {
          continue
        }

        const outputPath = distPath(outputFileName)
        if (fs.existsSync(outputPath)) {
          this.error(`Cannot emit ${outputFileName}; output path already exists`)
        }

        fs.mkdirSync(path.dirname(outputPath), { recursive: true })
        fs.renameSync(sourcePath, outputPath)
      }

      removeEmptyDirectories(path.join(outDir, 'content'))
      removeEmptyDirectories(path.join(outDir, 'legal'))
    },
  }
}

function alignSeoCapabilityCtas() {
  return {
    name: 'align-seo-capability-ctas',
    transformIndexHtml: {
      order: 'pre',
      handler(html, context) {
        const documentLanguage = html.match(/<html\b[^>]*\blang="([^"]+)"/iu)?.[1] || 'en'

        return alignSeoPageCtaHtml({
          html,
          pathname: context.path,
          documentLanguage,
        })
      },
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [alignSeoCapabilityCtas(), preservePublicHtmlRoutes()],
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
