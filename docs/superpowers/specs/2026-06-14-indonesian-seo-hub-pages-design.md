# Indonesian SEO Hub Pages Design

## Goal

Add two Indonesian Soundwise SEO hub pages at `/id/english-ear-training/` and `/id/minimal-pairs-practice/` using the provided Markdown copy as the source of truth.

## Existing Structure

The repo serves SEO hub pages as checked-in static HTML files under route directories such as `english-ear-training/index.html`, `es/english-ear-training/index.html`, and `hi-ur/minimal-pairs-practice/index.html`. Vite includes those pages through the `seoPageSlugs` array in `vite.config.js`. `public/sitemap.xml` lists public routes manually.

The homepage localization system is separate and already includes Indonesian at `/id/`. It does not generate these SEO hub pages.

## Approach

Create two static HTML pages:

- `id/english-ear-training/index.html`
- `id/minimal-pairs-practice/index.html`

Each page will follow the established SEO page template:

- `<html lang="id">`
- provided title, meta description, canonical URL, Open Graph, Twitter, breadcrumb JSON-LD, LearningResource JSON-LD, and FAQPage JSON-LD
- existing navigation, footer, app-store CTA tracking conventions, and `src/seo-page.js`
- body copy converted from the provided Markdown into semantic HTML without copyediting Indonesian prose

Update route wiring:

- add both Indonesian hub pages to `seoPageSlugs` in `vite.config.js`
- add both routes to `public/sitemap.xml` with the current implementation date
- add `hreflang="id"` alternates for the English and localized hub page clusters where those clusters enumerate available translations

## Link Handling

The provided Markdown contains two localized internal links between the new pages:

- `/id/english-ear-training/`
- `/id/minimal-pairs-practice/`

Those links will remain localized. Existing absolute links to English pair pages will remain unchanged because there are no Indonesian pair-page equivalents in the repo.

## Verification

Run the available validations and build commands:

- `npm run validate:app-store-tracking`
- `npm run validate:localized-homepages`
- `npm run build`

Also inspect the generated/static route files for:

- correct canonical URLs
- `lang="id"`
- `hreflang="id"`
- app-store `utm_content=id-english-ear-training` and `utm_content=id-minimal-pairs-practice`
- sitemap entries for both target routes

## Baseline Note

Before implementation, `npm run validate:localized-homepages` and `npm run build` fail in this shell under Node `v20.0.0` because `src/landing-copy-runtime.js` uses JSON import attributes syntax: `with { type: 'json' }`. This is an environment compatibility issue present before the Indonesian page changes.
