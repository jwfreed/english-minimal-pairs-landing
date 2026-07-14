# Site Structure

## Overview

This repository is a Vite static site for the Soundwise landing page at `https://getsoundwise.co`.

The architecture is intentionally simple:

- Static HTML files define pages.
- Shared CSS and JavaScript live in `src/`.
- Static assets live in `public/`.
- Vite builds all configured HTML entry points into `dist/`.
- GitHub Pages serves the built `dist/` artifact.

## Folder Structure

| Path | Purpose |
| --- | --- |
| `index.html` | Main Soundwise landing page. |
| `content/locales/<locale>/index.html` | Generated localized homepage source entries such as `content/locales/ja/index.html` and `content/locales/zh/index.html`. They are rebuilt from `index.html`, ignored by Git, and emitted at public routes such as `/ja/`. |
| `support.html` | Public support page. |
| `legal/privacy/index.html`, `legal/terms/index.html` | Primary English legal page sources with clean public URLs. |
| `legal/privacy/privacy.html`, `legal/terms/terms.html` | Lightweight compatibility page sources for existing public `.html` links. They redirect to the clean English legal URLs. |
| `legal/privacy/privacy-*.html`, `legal/terms/terms-*.html` | Localized legal variant sources emitted at existing root `.html` URLs. |
| `content/pairs/*/index.html` | Clean-URL SEO page sources for English minimal-pair sound contrasts and SEO hubs. |
| `content/locales/*/*/index.html` | Localized SEO page and SEO hub sources. |
| `src/` | Shared CSS, landing-page JavaScript, i18n runtime code, and SEO-page behavior. |
| `public/` | Static assets copied directly into `dist/`. |
| `scripts/` | Repository validation scripts. |
| `docs/` | Product, SEO, operations, deployment, and repository documentation. |
| `.github/workflows/deploy.yml` | GitHub Pages deployment workflow. |
| `vite.config.js` | Vite configuration and multi-page build entries. |
| `dist/` | Generated build output. Do not edit by hand. |

## Page Organization

The site uses Vite's multi-page build support. Each production HTML page must be listed in `vite.config.js` under `build.rollupOptions.input`.

Current page groups:

- Homepage: `index.html`
- Localized homepages: generated `content/locales/<locale>/index.html` source entries for `/ja/`, `/zh/`, `/th/`, `/es/`, `/ar/`, `/ru/`, `/ko/`, `/hi-ur/`, `/pt/`, `/vi/`, `/tr/`, `/fa/`, `/yue/`, and `/id/`
- Support page: `support.html`
- SEO pages: minimal-pair contrast pages and SEO hubs registered via `seoPageSlugs` in `vite.config.js`. English sources live in `content/pairs/`; localized sources live in `content/locales/`. The indexed URLs are in `public/sitemap.xml`.
- Legal pages: primary English `legal/privacy/index.html` and `legal/terms/index.html`, legacy English `legal/privacy/privacy.html` and `legal/terms/terms.html`, and localized `legal/privacy/privacy-*.html` / `legal/terms/terms-*.html` pages

### Legal Pages

The primary English legal URLs are:

```text
https://getsoundwise.co/privacy/
https://getsoundwise.co/terms/
```

These pages are the canonical English legal URLs and are the only English legal URLs that should appear in `public/sitemap.xml`.

The legacy English URLs remain available for old links:

```text
https://getsoundwise.co/privacy.html
https://getsoundwise.co/terms.html
```

The legacy English `.html` files are compatibility pages only. They use a meta refresh redirect, a canonical tag pointing to the clean URL, and a visible fallback link. Do not put full legal copy in the legacy files.

Localized legal pages are intentionally different. Their source files live in `legal/`, but Vite emits them at root `.html` URLs:

```text
https://getsoundwise.co/privacy-ja.html
https://getsoundwise.co/terms-ja.html
```

GitHub Pages serves static files and directories directly from the Vite output. `vite.config.js` maps the nested legal source files back to the existing root `.html` output paths so no public redirects are required.

Localized legal pages use this naming pattern:

```text
legal/privacy/privacy-[locale].html
legal/terms/terms-[locale].html
```

Use short lowercase locale identifiers that match the existing pattern, for example `ja`, `zh`, `yue`, `es`, or compound identifiers such as `hi-ur` when one page intentionally serves more than one language community.

When adding a new privacy or terms translation:

1. Create both source files under `legal/` if both documents are available, for example `legal/privacy/privacy-de.html` and `legal/terms/terms-de.html`.
2. Keep each translated page self-canonical on its own root `.html` URL.
3. Add the locale code to `legalLocales` in `vite.config.js`.
4. Add the language link to the existing legal language switchers.
5. Link back to the English pages with `/privacy/` and `/terms/`, not the legacy `.html` compatibility pages.
6. Do not add translated legal pages to `public/sitemap.xml` unless there is a deliberate localized SEO strategy.
7. Run `npm run build`.

The build also runs `npm run validate:internal-links` against `dist/`. The validator
checks that sitemap routes are reachable, internal targets exist and are canonical, pair
pages link contextually to their parent hubs and related practice, hubs cover their
intended children, hreflang links are reciprocal, and localized pages do not bypass an
available same-language target.

Do not rewrite legal copy as part of file-organization work. Treat copy updates as separate legal/content changes.

### SEO Pages

Clean URL pages use a directory plus `index.html`, for example:

```text
content/pairs/ship-vs-sheep/index.html
```

This builds to a URL like:

```text
https://getsoundwise.co/ship-vs-sheep/
```

Minimal-pair SEO source pages live in `content/pairs/`, while localized SEO sources live in `content/locales/`. Vite maps those source paths back to short production URLs such as `/ship-vs-sheep/` and `/ja/ship-vs-sheep/`; do not create root source directories to preserve public URLs.

Root-level pages use `.html` filenames, for example:

```text
support.html
```

This builds to:

```text
https://getsoundwise.co/support.html
```

## Static Assets

Assets in `public/` are copied directly to the root of `dist/`.

Important files include:

- `public/robots.txt`
- `public/sitemap.xml`
- `public/404.html`
- `public/EMP_logo.png`
- Product/feature images such as `public/Native Speaker Audio.png`

Use root-relative paths for public assets in HTML, for example:

```html
<img src="/EMP_logo.png" alt="Soundwise Logo">
```

Shared source files in `src/` are processed by Vite when referenced by an HTML entry point. The main shared stylesheet is:

```text
src/style.css
```

## Vite Entry-Point Configuration

`vite.config.js` controls which HTML files are included in the production build. Entries are grouped by page type:

- `seoPageSlugs` for clean-URL minimal-pair pages.
- `legalLocales` for translated privacy and terms pages.
- `seoPageEntries` and `legalPageEntries` derive the Vite input map from those lists.
- `preservePublicHtmlRoutes()` maps nested source files back to the existing public HTML output paths.
- Root utility pages such as `index.html` and `support.html` remain explicit in the input map.

```js
const seoPageSlugs = [
  'ship-vs-sheep',
  // ... 19 more slugs through 'heart-vs-hurt'
]
const legalLocales = ['ja', /* ... */]
```

When adding a page, update this input map. If a page is missing from this map, it may work during local file browsing but will not be part of the intended Vite production build.

## SEO Page Status

Pages 1–20 (the initial sequence) are fully implemented as of 2026-05. The sequence covers:

| # | Slug | Contrast |
|---|------|----------|
| 1 | `ship-vs-sheep` | /ɪ/ vs /iː/ |
| 2 | `bit-vs-beat` | /ɪ/ vs /iː/ |
| 3 | `sit-vs-seat` | /ɪ/ vs /iː/ |
| 4 | `live-vs-leave` | /ɪ/ vs /iː/ |
| 5 | `fill-vs-feel` | /ɪ/ vs /iː/ |
| 6 | `full-vs-fool` | /ʊ/ vs /uː/ |
| 7 | `pull-vs-pool` | /ʊ/ vs /uː/ |
| 8 | `bad-vs-bed` | /æ/ vs /ɛ/ |
| 9 | `man-vs-men` | /æ/ vs /ɛ/ |
| 10 | `cap-vs-cup` | /æ/ vs /ʌ/ |
| 11 | `cup-vs-cop` | /ʌ/ vs /ɑ/ or /ɒ/, depending on accent |
| 12 | `rice-vs-lice` | /r/ vs /l/ |
| 13 | `right-vs-light` | /r/ vs /l/ |
| 14 | `three-vs-tree` | /θ/ vs /t/ |
| 15 | `thin-vs-tin` | /θ/ vs /t/ |
| 16 | `fan-vs-van` | /f/ vs /v/ |
| 17 | `vest-vs-west` | /v/ vs /w/ |
| 18 | `bet-vs-bat` | /ɛ/ vs /æ/ |
| 19 | `law-vs-low` | /ɔː/ or /ɑ/ vs /oʊ/, depending on accent |
| 20 | `heart-vs-hurt` | /ɑr/ or /ɑː/ vs /ɝ/ or /ɜː/, depending on accent |

Current stage (post-implementation):

- Live URL verification for pages 16–20
- Google Search Console: submit updated sitemap, monitor indexing
- Metadata, canonical URL, and FAQ schema validation for each page
- Visual consistency and TOC label polish across pages 16–20
- Internal link audit for pages 16–20

## SEO Page Strategy

SEO pages target learner search intent for English minimal-pair sound contrasts. They should explain the listening problem first, then introduce Soundwise as a practical next step.

Canonical SEO references:

- `docs/seo-page-creation-guide.md`
- `docs/seo-keyword-map.md`
- `docs/messaging-framework.md`
- `docs/analytics-and-attribution.md`

Indexed SEO pages should also be listed in:

```text
public/sitemap.xml
```

Each SEO page should include unique page metadata in its HTML `<head>`. Existing SEO pages also use canonical URLs such as:

```html
<link rel="canonical" href="https://getsoundwise.co/ship-vs-sheep/" />
```

## Conventions for Adding Pages

For a new clean-URL SEO page:

1. Create `content/pairs/[word-a]-vs-[word-b]/index.html`.
2. Follow the content and metadata guidance in `docs/seo-page-creation-guide.md`.
3. Use lowercase ASCII slugs with hyphens.
4. Add the slug, without leading or trailing slashes, to `seoPageSlugs` in `vite.config.js`.
5. Add the production URL to `public/sitemap.xml` if the page should be indexed.
6. Keep App Store CTA links consistent with the UTM conventions in `docs/analytics-and-attribution.md`.
7. Run `npm run build`.

For a new legal translation:

1. Create `legal/privacy/privacy-[locale].html` and/or `legal/terms/terms-[locale].html`.
2. Follow the existing root `.html` public URL convention.
3. Add the locale to `legalLocales` in `vite.config.js`.
4. Update legal language switcher links.
5. Run `npm run build`.

For a new support or utility page:

1. Add the HTML file at the repository root, unless a clean URL is required.
2. Reuse existing styling and navigation patterns.
3. Add the HTML file to `vite.config.js`.
4. Add it to `public/sitemap.xml` only if it should be indexed.
5. Run `npm run build`.

Do not introduce a new framework, CMS, router, or build layer for routine static-page additions.

## Legal URL Maintenance

Use `/privacy/` and `/terms/` for all primary internal links, including the homepage footer, support page, 404 page, SEO article footers, and translated legal language switchers.

Keep `privacy.html` and `terms.html` in the Vite input map so older external links continue to resolve on GitHub Pages. These files should stay small and should only contain:

- a meta refresh redirect to the clean URL
- a canonical tag for the clean URL
- a visible fallback link for browsers or crawlers that do not follow the refresh

Do not add `privacy.html`, `terms.html`, or translated legal pages to the sitemap. The sitemap is intentionally limited to the homepage, clean learner-intent SEO pages, and canonical English legal pages.
