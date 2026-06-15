# Russian SEO Hub Pages Design

Date: 2026-06-15

## Goal

Add two Russian Soundwise SEO hub pages:

- `/ru/english-ear-training/`
- `/ru/minimal-pairs-practice/`

The provided Russian Markdown files are the source of truth. Preserve the Russian prose exactly except for HTML escaping, required wrapping, and existing static markup conventions.

## Existing Structure

The repo serves SEO hub pages as checked-in static HTML files under route directories such as `english-ear-training/index.html`, `id/english-ear-training/index.html`, and `fa/minimal-pairs-practice/index.html`. Vite includes those pages through the `seoPageSlugs` array in `vite.config.js`. `public/sitemap.xml` lists public routes manually and uses trailing slashes in `<loc>` values.

The Russian homepage route already exists at `/ru/`. The homepage localization system is separate and does not generate these SEO hub pages.

## Route And File Shape

Create two new static HTML pages:

- `ru/english-ear-training/index.html`
- `ru/minimal-pairs-practice/index.html`

Use `id` and `fa` as the closest recent implementation references. Do not refactor, normalize, or generalize the page system.

Each page must follow the established localized hub-page shell exactly:

- `<html lang="ru">`
- same nav pattern
- same hero pattern
- same TOC pattern
- same section ordering
- same structured-data pattern
- same CTA placement
- same footer
- same stylesheet, script, and analytics includes

Russian is LTR, so no `dir` attribute is needed unless an existing Russian page pattern already requires one.

## Metadata And Registries

Add both Russian slugs to `seoPageSlugs` in `vite.config.js`:

- `ru/english-ear-training`
- `ru/minimal-pairs-practice`

Add both canonical URLs to `public/sitemap.xml`:

- `https://getsoundwise.co/ru/english-ear-training/`
- `https://getsoundwise.co/ru/minimal-pairs-practice/`

Use the newest existing localized hub-page rollout convention for sitemap metadata:

- `lastmod` should match the newest rollout date pattern already used for recent locale additions
- `changefreq` remains `monthly`
- `priority` remains `0.9`

Map the provided frontmatter directly:

- `title` -> `<title>`, Open Graph title, and Twitter title
- `meta-description` -> meta description, Open Graph description, and Twitter description
- `canonical` -> canonical link and Open Graph URL
- `lang` / `hreflang` -> HTML and alternate-link metadata

Use `inLanguage: "ru"` in the `LearningResource` JSON-LD.

## Hreflang Cluster Rules

Match the most recent localized hub-page pattern exactly. Do not invent a new locale order and do not refactor how alternates are managed.

For each new Russian hub page, include the full existing hreflang cluster for all currently supported locales where the corresponding page exists, plus `ru`, in the same order used by the most recent equivalent localized hub pages. Keep `x-default` pointing to the English canonical page.

Update `ru` reciprocally only within the existing hard-coded hub-page clusters for:

- `english-ear-training`
- `minimal-pairs-practice`

That means:

- each new Russian page must include all current alternates for its page family plus `ru`
- each existing localized page in those two page families that already participates in the cluster must gain the `ru` alternate

Do not invent alternates for nonexistent pages. Do not perform broader hreflang cleanup outside these two page families.

## Copy Conversion

Convert the provided Markdown/frontmatter into the existing static HTML article structure.

Preserve:

- headings
- paragraph order
- lists
- FAQ questions and answers
- CTA text
- App Store UTM URLs from the provided copy
- Russian body copy
- provided Russian cross-links between the two new hub pages
- contrast-page links exactly as supplied unless an existing localized page pattern clearly requires otherwise

Do not rewrite, shorten, polish, or normalize the Russian prose.

## Structured Data

Create JSON-LD blocks matching the current hub-page pattern:

- `BreadcrumbList`
- `LearningResource`
- `FAQPage`

The JSON-LD must reflect the visible Russian content only. Do not add claims, questions, or descriptions that do not appear on the page.

## Verification

Run at minimum:

- `rtk git status`
- `rtk git diff --stat`
- `rtk npm run build`

Run targeted checks for:

- route registration in `vite.config.js`
- sitemap entries for both Russian canonicals
- `lang="ru"` in both Russian pages
- Russian canonical URLs
- `hreflang="ru"` in both new Russian pages
- reciprocal `ru` alternates in the existing `english-ear-training` page family
- reciprocal `ru` alternates in the existing `minimal-pairs-practice` page family
- generated `dist/ru/english-ear-training/index.html`
- generated `dist/ru/minimal-pairs-practice/index.html`
- Russian copy preservation against the supplied source files

If available, also run relevant validators such as:

- `rtk npm run validate:app-store-tracking`
- `rtk npm run validate:localized-homepages`

If a script is unavailable or fails, capture and report the raw output.

## Out Of Scope

- Refactoring or centralizing hreflang generation.
- Creating Russian individual contrast pages.
- Rewriting or retranslating the supplied Russian copy.
- Normalizing locale ordering across older pages beyond the required reciprocal `ru` additions.
- Unrelated site, styling, routing, or localization changes.
