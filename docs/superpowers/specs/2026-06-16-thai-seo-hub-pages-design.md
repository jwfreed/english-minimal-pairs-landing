# Thai SEO Hub Pages Design

Date: 2026-06-16

## Goal

Add two Thai Soundwise SEO hub pages:

- `/th/english-ear-training/`
- `/th/minimal-pairs-practice/`

The provided Thai Markdown files are the source of truth. Preserve the Thai prose exactly except for HTML escaping, tag wrapping, whitespace normalization, and required static-site markup conventions.

## Existing Structure

The repo serves SEO hub pages as checked-in static HTML files under route directories such as `english-ear-training/index.html`, `id/english-ear-training/index.html`, and `ru/minimal-pairs-practice/index.html`. Vite includes those pages through the `seoPageSlugs` array in `vite.config.js`. `public/sitemap.xml` lists public routes manually and uses trailing slashes in `<loc>` values.

The Thai homepage route already exists at `/th/`. The homepage localization system is separate and does not generate these SEO hub pages.

Recent localized hub-page rollouts use static HTML page shells with:

- hard-coded hreflang clusters inside each page
- `BreadcrumbList`, `LearningResource`, and `FAQPage` JSON-LD blocks
- a localized App Store nav CTA
- the same shared CSS, analytics, and FAQ interaction pattern

## Route And File Shape

Create two new static HTML pages:

- `th/english-ear-training/index.html`
- `th/minimal-pairs-practice/index.html`

Use `ru` and `id` as the closest recent implementation references. Do not refactor, normalize, or generalize the page system.

Each page must follow the established localized hub-page shell exactly:

- `<html lang="th">`
- same nav pattern
- same hero pattern
- same TOC pattern
- same section ordering as the latest localized equivalent
- same structured-data pattern
- same CTA placement
- same footer
- same stylesheet, script, and analytics includes

Thai is LTR, so no `dir` attribute is needed.

## Metadata And Registries

Add both Thai slugs to `seoPageSlugs` in `vite.config.js`:

- `th/english-ear-training`
- `th/minimal-pairs-practice`

Add both canonical URLs to `public/sitemap.xml`:

- `https://getsoundwise.co/th/english-ear-training/`
- `https://getsoundwise.co/th/minimal-pairs-practice/`

Use the newest existing localized hub-page rollout convention for sitemap metadata:

- `lastmod` should match the newest rollout date pattern already used for recent locale additions
- `changefreq` remains `monthly`
- `priority` remains `0.9`

Map the provided frontmatter directly:

- `title` -> `<title>`, Open Graph title, and Twitter title
- `meta-description` -> meta description, Open Graph description, and Twitter description
- `canonical` -> canonical link and Open Graph URL
- `lang` / `hreflang` -> HTML and alternate-link metadata

Use `inLanguage: "th"` in the `LearningResource` JSON-LD.

## Hreflang Cluster Rules

Match the most recent localized hub-page pattern exactly. Do not invent a new locale order and do not refactor how alternates are managed.

For each new Thai hub page, include the full existing hreflang cluster for all currently supported locales where the corresponding page exists, plus `th`, in the same order used by the most recent equivalent localized hub pages. Keep `x-default` pointing to the English canonical page.

Update `th` reciprocally only within the existing hard-coded hub-page clusters for:

- `english-ear-training`
- `minimal-pairs-practice`

That means:

- each new Thai page must include all current alternates for its page family plus `th`
- each existing localized page in those two page families that already participates in the cluster must gain the `th` alternate

Files expected to change for reciprocal hreflang updates:

- `english-ear-training/index.html`
- `es/english-ear-training/index.html`
- `ja/english-ear-training/index.html`
- `zh/english-ear-training/index.html`
- `yue/english-ear-training/index.html`
- `ar/english-ear-training/index.html`
- `hi-ur/english-ear-training/index.html`
- `fa/english-ear-training/index.html`
- `id/english-ear-training/index.html`
- `ko/english-ear-training/index.html`
- `pt/english-ear-training/index.html`
- `ru/english-ear-training/index.html`
- `minimal-pairs-practice/index.html`
- `es/minimal-pairs-practice/index.html`
- `ja/minimal-pairs-practice/index.html`
- `zh/minimal-pairs-practice/index.html`
- `yue/minimal-pairs-practice/index.html`
- `ar/minimal-pairs-practice/index.html`
- `hi-ur/minimal-pairs-practice/index.html`
- `fa/minimal-pairs-practice/index.html`
- `id/minimal-pairs-practice/index.html`
- `ko/minimal-pairs-practice/index.html`
- `pt/minimal-pairs-practice/index.html`
- `ru/minimal-pairs-practice/index.html`

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
- Thai body copy
- contrast-page links exactly as supplied unless an existing localized page pattern clearly requires otherwise
- inline English terms, IPA, and slash-marked contrasts

Do not rewrite, shorten, polish, or normalize the Thai prose.

## Structural Cross-Links

The supplied Thai Markdown does not explicitly include reciprocal body cross-links between the two new Thai hub pages. These must still be added because the user approved them as structural/internal-navigation elements that match the newest localized hub-page pattern.

Use these localized internal links:

- `/th/minimal-pairs-practice/`
- `/th/english-ear-training/`

Use these Thai anchor texts:

- from `/th/english-ear-training/` to `/th/minimal-pairs-practice/`: `ดูวิธีฝึกด้วย minimal pairs`
- from `/th/minimal-pairs-practice/` to `/th/english-ear-training/`: `อ่านเพิ่มเติมเรื่องการฝึกฟังภาษาอังกฤษ`

Placement must match the latest localized equivalents:

- `/th/english-ear-training/` gets a dedicated `#minimal-pairs-guide` section before the Soundwise CTA
- `/th/minimal-pairs-practice/` gets a dedicated `#related-guide` section after the Soundwise CTA and before the FAQ

Match the existing section ids, class names, and markup pattern of the newest localized pages. Do not add any extra explanatory paragraph beyond what that page-family pattern requires.
If the supplied Thai copy already contains an equivalent section or link after final source inspection, preserve the source section and adapt only the markup or placement needed to match the existing localized page pattern.

## Structured Data

Create JSON-LD blocks matching the current hub-page pattern:

- `BreadcrumbList`
- `LearningResource`
- `FAQPage`

The JSON-LD must reflect the visible Thai content only. Do not add claims, questions, or descriptions that do not appear on the page.

## Verification

Run at minimum:

- `rtk git status`
- `rtk git diff --stat`
- `rtk npm run build`

Run targeted checks for:

- route registration in `vite.config.js`
- sitemap entries for both Thai canonicals
- `lang="th"` in both Thai pages
- Thai canonical URLs
- `hreflang="th"` in both new Thai pages
- bidirectional hreflang coverage for `english-ear-training`: Thai page includes all existing alternates, and existing localized pages include the new `th` alternate
- bidirectional hreflang coverage for `minimal-pairs-practice`: Thai page includes all existing alternates, and existing localized pages include the new `th` alternate
- structural cross-link placement and localized internal URLs
- generated `dist/th/english-ear-training/index.html`
- generated `dist/th/minimal-pairs-practice/index.html`
- Thai copy preservation against the supplied source files, excluding approved structural cross-link sections
- successful JSON-LD parsing for all structured-data blocks on both Thai pages

If available, also run relevant validators such as:

- `rtk npm run validate:app-store-tracking`
- `rtk npm run validate:localized-homepages`

If a script is unavailable or fails, capture and report the raw output.

## Git Safety

Do not commit, push, or open a PR during implementation unless the user explicitly asks after reviewing the diff. This overrides any generic workflow step that would otherwise commit the spec.

## Out Of Scope

- Refactoring or centralizing hreflang generation.
- Creating Thai individual contrast pages.
- Rewriting or retranslating the supplied Thai copy.
- Normalizing locale ordering across older pages beyond the required reciprocal `th` additions.
- Unrelated site, styling, routing, or localization changes.
