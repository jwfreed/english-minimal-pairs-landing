# Persian SEO Hub Pages Design

Date: 2026-06-14

## Goal

Add two Persian/Farsi Soundwise SEO hub pages:

- `/fa/english-ear-training/`
- `/fa/minimal-pairs-practice/`

The provided Persian Markdown files are the source of truth. Preserve the Persian prose exactly except for HTML escaping, line wrapping, bidi markup, and required static-site formatting.

## Existing Structure

The repo serves SEO hub pages as checked-in static HTML files under route directories such as `english-ear-training/index.html`, `ar/english-ear-training/index.html`, and `id/minimal-pairs-practice/index.html`. Vite includes those pages through the `seoPageSlugs` array in `vite.config.js`. `public/sitemap.xml` lists public routes manually and uses trailing slashes in `<loc>` values.

The Persian homepage route already exists at `/fa/`. The homepage localization system is separate and does not generate SEO hub pages.

## Route And File Shape

Create two new static HTML pages:

- `fa/english-ear-training/index.html`
- `fa/minimal-pairs-practice/index.html`

Use `id` as the closest recent hub-page implementation reference and `ar` as the closest RTL/bidi rendering reference.

Each page uses the established static hub-page shell:

- `<html lang="fa" dir="rtl">`
- same nav pattern
- same hero pattern
- same TOC pattern
- same structured-data pattern
- same CTA placement
- same stylesheet and analytics includes
- same section ordering as the equivalent hub pages

Use the Arabic page's existing treatment for inline English and IPA text. Do not introduce a new bidi pattern unless the Arabic implementation is insufficient.

## Metadata And Registries

Add `fa/english-ear-training` and `fa/minimal-pairs-practice` to `seoPageSlugs` in `vite.config.js`, matching the slug format already used for localized hub pages.

Add both routes to `public/sitemap.xml`, matching the existing sitemap convention exactly:

- `https://getsoundwise.co/fa/english-ear-training/`
- `https://getsoundwise.co/fa/minimal-pairs-practice/`

Use `lastmod` `2026-06-14`, `changefreq` `monthly`, and `priority` `0.9`, matching the recent Indonesian hub entries.

Add `hreflang="fa"` alternates for both hub-page clusters across the existing localized versions. Keep `x-default` pointing to the English canonical page, consistent with existing hub pages.

Use the provided canonical URLs exactly:

- `https://getsoundwise.co/fa/english-ear-training/`
- `https://getsoundwise.co/fa/minimal-pairs-practice/`

Use `lang="fa"` and `dir="rtl"` on the document root, and `inLanguage: "fa"` in structured data.

## Copy Conversion And Structured Data

Convert the provided Markdown/frontmatter into the existing static HTML article structure.

Preserve:

- headings
- paragraph order
- FAQ questions and answers
- CTA text
- UTM URLs
- Persian body copy
- provided localized cross-links
- absolute links to English contrast pages

Map frontmatter fields into HTML metadata:

- `title` -> `<title>`, Open Graph title, and Twitter title
- `meta-description` -> meta description, Open Graph description, and Twitter description
- `canonical`, `lang`, `hreflang`, and `dir` -> HTML and head equivalents

Create `BreadcrumbList`, `LearningResource`, and `FAQPage` JSON-LD by following the existing English, Indonesian, and Arabic hub-page pattern. The JSON-LD must reflect the visible Persian page content and must not introduce claims, FAQs, or descriptions that are not present on the page.

## Verification

Use the documented compatible Node runtime for build commands:

```bash
PATH="$HOME/.nvm/versions/node/v22.21.0/bin:$PATH" npm run build
```

Run targeted checks for:

- both Persian pages included in production build output
- Persian route registration in `vite.config.js`
- trailing-slash Persian sitemap `<loc>` values
- `lang="fa"`
- `dir="rtl"`
- `hreflang="fa"`
- canonical URLs
- App Store CTA `utm_content=fa-english-ear-training`
- App Store CTA `utm_content=fa-minimal-pairs-practice`
- existing English, Indonesian, Arabic, and other localized hub pages include the Persian hreflang alternate in their clusters
- rendered Persian text differs from the provided source only by HTML escaping, line wrapping, bidi markup, or required static-site formatting

Also inspect `git diff --stat`, focused diffs for changed files, and `git diff --check`.

## Out Of Scope

- Refactoring hreflang generation.
- Creating localized individual contrast pages.
- Rewriting, polishing, summarizing, or translating the Persian prose.
- Adding unrelated localization infrastructure.
- Editing unrelated homepage, legal-page, or product copy.
