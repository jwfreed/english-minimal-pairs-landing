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
| `support.html` | Public support page. |
| `privacy*.html` | Privacy policy pages, including localized variants. |
| `terms*.html` | Terms pages, including localized variants. |
| `*-vs-*/index.html` | Clean-URL SEO pages for English minimal-pair sound contrasts. |
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
- Support page: `support.html`
- SEO pages: `ship-vs-sheep/index.html`, `bit-vs-beat/index.html`, `sit-vs-seat/index.html`, `live-vs-leave/index.html`, and `fill-vs-feel/index.html`
- Legal pages: `privacy.html`, `terms.html`, and localized `privacy-*.html` / `terms-*.html` pages

Clean URL pages use a directory plus `index.html`, for example:

```text
ship-vs-sheep/index.html
```

This builds to a URL like:

```text
https://getsoundwise.co/ship-vs-sheep/
```

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

`vite.config.js` controls which HTML files are included in the production build:

```js
build: {
  rollupOptions: {
    input: {
      main: 'index.html',
      support: 'support.html',
      'ship-vs-sheep': 'ship-vs-sheep/index.html',
      // ...
    }
  }
}
```

When adding a page, update this input map. If a page is missing from this map, it may work during local file browsing but will not be part of the intended Vite production build.

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

1. Create `[word-a]-vs-[word-b]/index.html`.
2. Follow the content and metadata guidance in `docs/seo-page-creation-guide.md`.
3. Use lowercase ASCII slugs with hyphens.
4. Add the HTML file to `vite.config.js`.
5. Add the production URL to `public/sitemap.xml` if the page should be indexed.
6. Keep App Store CTA links consistent with the UTM conventions in `docs/analytics-and-attribution.md`.
7. Run `npm run build`.

For a new support, legal, or utility page:

1. Add the HTML file at the repository root, unless a clean URL is required.
2. Reuse existing styling and navigation patterns.
3. Add the HTML file to `vite.config.js`.
4. Add it to `public/sitemap.xml` only if it should be indexed.
5. Run `npm run build`.

Do not introduce a new framework, CMS, router, or build layer for routine static-page additions.
