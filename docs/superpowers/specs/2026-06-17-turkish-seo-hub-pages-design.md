# Turkish SEO Hub Pages Design

Date: 2026-06-17

## Goal

Add two Turkish Soundwise SEO hub pages:

- `/tr/english-ear-training/`
- `/tr/minimal-pairs-practice/`

The implementation must preserve existing page-family structure and integrate the supplied
Turkish copy without rewriting it.

## Existing Structure

The repo serves SEO hub pages as checked-in static HTML files under route directories such as
`english-ear-training/index.html`, `th/english-ear-training/index.html`, and
`ru/minimal-pairs-practice/index.html`.

The integration points are explicit and manual:

- `vite.config.js` registers SEO hub pages through the `seoPageSlugs` array
- `public/sitemap.xml` lists public routes manually with trailing-slash canonicals
- each hub page contains its own hard-coded hreflang cluster
- each hub page contains `BreadcrumbList`, `LearningResource`, and `FAQPage` JSON-LD blocks

The Turkish localized homepage route already exists at `/tr/`. The homepage localization system
is separate and does not generate these SEO hub pages.

Recent localized rollouts use a shared static shell with:

- identical nav, hero, TOC, section wrappers, CTA placement, footer, CSS includes, and analytics
- localized metadata and JSON-LD text
- family-specific section ordering
- localized App Store CTA URLs

## Canonical Sources

### Structure authority

Existing English and localized hub pages are canonical for:

- structure
- markup
- classes
- wrappers
- heading hierarchy
- metadata shape
- script and stylesheet includes
- CTA placement
- FAQ schema shape
- hreflang cluster format
- JSON-LD block structure
- page-family conventions

### Turkish copy authority

The supplied Turkish Markdown files are canonical for:

- visible Turkish prose inside the existing page-family section skeleton
- headings
- paragraph order
- lists
- FAQ questions and answers
- CTA label text
- in-page copy
- L1-specific explanations
- allowed pair links
- App Store URL values supplied in the copy

The Turkish Markdown is not authority to redefine the page skeleton, TOC pattern, section ids,
or JSON-LD block structure.

## Shell Selection

Use the newest compliant localized shells in each family as the implementation base.

After inspection, the preferred shells are:

- `th/english-ear-training/index.html`
- `th/minimal-pairs-practice/index.html`

These already reflect the newest family conventions, including current section placement,
localized JSON-LD shape, TOC behavior, and recent structural parity fixes.

Do not build directly from the Markdown outline.
Do not use the English base pages as the primary shell if the Thai localized shells already carry
newer parity fixes.
Do not introduce a generator or abstraction.

## Route And File Shape

Create:

- `tr/english-ear-training/index.html`
- `tr/minimal-pairs-practice/index.html`

Turkish is LTR, so use:

- `<html lang="tr">`
- no `dir="rtl"`

Keep the existing family section skeletons exactly:

### `tr/english-ear-training/index.html`

Section order:

- `why-listening-first`
- `what-ear-training-means`
- `common-contrasts`
- `how-to-practice`
- `minimal-pairs-guide`
- `soundwise`
- `faq`

### `tr/minimal-pairs-practice/index.html`

Section order:

- `what-are-minimal-pairs`
- `why-they-help`
- `how-to-practice`
- `start-here`
- `soundwise`
- `related-guide`
- `faq`

`#related-guide` remains present in the page body but is not listed in the TOC, matching the
current family convention.

## Locale-Specific Swaps

When cloning the shell pages, replace only locale-specific values:

- `lang`
- page title
- meta description
- canonical URL
- Open Graph title, description, and URL
- Twitter title and description
- breadcrumb text
- JSON-LD text fields that reflect visible content
- visible Turkish section copy
- FAQ schema text
- CTA label text
- CTA URL
- localized internal links
- the `tr` hreflang entry and reciprocal cluster updates

Do not redesign, restyle, refactor, or normalize the shell.

## Metadata And Registries

Add both Turkish slugs to `seoPageSlugs` in `vite.config.js`:

- `tr/english-ear-training`
- `tr/minimal-pairs-practice`

Add both Turkish canonicals to `public/sitemap.xml`:

- `https://getsoundwise.co/tr/english-ear-training/`
- `https://getsoundwise.co/tr/minimal-pairs-practice/`

Use the current addition date for these two sitemap entries only. Leave unrelated sitemap entries
untouched. Preserve the existing `changefreq` and `priority` pattern for recent locale hub pages:

- `changefreq`: `monthly`
- `priority`: `0.9`

Map the Turkish frontmatter meaning directly:

- `title` -> `<title>`, Open Graph title, and Twitter title
- `meta-description` -> meta description, Open Graph description, and Twitter description
- `canonical` -> canonical link and Open Graph URL
- `lang` / `hreflang` -> HTML and alternate-link metadata

Use `inLanguage: "tr"` in `LearningResource`.

## Hreflang Cluster Rules

Update only the hard-coded hreflang clusters in the existing `english-ear-training` and
`minimal-pairs-practice` page families so the new Turkish pages are reciprocally advertised.

The new Turkish pages must include the full existing cluster for their family plus `tr`, in the
same ordering style already used by the newest compliant family pages. Keep `x-default` pointing
to the English canonical page.

Expected reciprocal updates:

### `english-ear-training` family

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
- `th/english-ear-training/index.html`
- `tr/english-ear-training/index.html`

### `minimal-pairs-practice` family

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
- `th/minimal-pairs-practice/index.html`
- `tr/minimal-pairs-practice/index.html`

Do not perform broader hreflang cleanup outside these two page families.
Do not add alternates for nonexistent pages.
Do not alter unrelated localized pages.

## Copy Conversion

Convert the Turkish Markdown into the existing static HTML shell pattern.

Preserve:

- visible Turkish prose
- H1 and section headings
- paragraph order
- lists
- FAQ questions and answers
- CTA text
- inline English terms
- IPA
- slash-marked contrasts
- Turkish punctuation and casing
- supplied live pair links only

Allowed changes:

- HTML escaping
- tag wrapping
- whitespace normalization
- Markdown-to-HTML conversion
- adaptation to existing static-site markup conventions

Do not:

- rewrite Turkish prose
- shorten Turkish prose
- polish Turkish prose
- normalize voice
- add humor or remove humor
- translate from another locale
- add unsupported claims
- add extra examples
- add extra pair links

## Link Policy

Only use the live pair pages supplied in the Turkish Markdown:

- `bit-vs-beat`
- `fill-vs-feel`
- `live-vs-leave`
- `ship-vs-sheep`
- `sit-vs-seat`
- `bad-vs-bed`
- `bet-vs-bat`
- `man-vs-men`
- `thin-vs-tin`
- `three-vs-tree`
- `fan-vs-van`
- `vest-vs-west`

Do not introduce known dead or removed pair links such as:

- `hit-vs-heat`
- `think-vs-tink`
- `pan-vs-pen`
- `vine-vs-wine`
- `cap-vs-cab`

The conceptual final-consonants discussion in the Turkish copy must remain as prose, but no dead
links should be added to that section.

## Cross-Link Placement

Preserve the current family conventions for the cross-links between the two hub pages:

- `tr/english-ear-training/index.html` contains the `#minimal-pairs-guide` section before
  `#soundwise`
- `tr/minimal-pairs-practice/index.html` contains the `#related-guide` section after `#soundwise`
  and before `#faq`
- `#related-guide` is not added to the TOC

Use localized internal links:

- `/tr/minimal-pairs-practice/`
- `/tr/english-ear-training/`

The Turkish Markdown remains canonical for the visible Turkish copy inside those existing section
slots.

## Structured Data

Each new Turkish page must include the same three JSON-LD blocks as the current family shell:

- `BreadcrumbList`
- `LearningResource`
- `FAQPage`

Keep the block structure identical to the shell pattern.
Update only the locale-specific text, page names, URLs, and language values.

The JSON-LD should reflect the visible Turkish content and must not add unsupported claims or
extra FAQ items.

## Verification

Inspect the diff and verify structural parity against the Thai shell sources.

Run:

- `rtk proxy git diff --check`
- `rtk proxy git diff --stat`
- `rtk npm run validate:app-store-tracking`
- `rtk npm run validate:localized-homepages`
- `rtk npm run build`

Run targeted checks for:

- both Turkish slugs present in `vite.config.js`
- both Turkish canonical URLs present in `public/sitemap.xml`
- `lang="tr"` in both new Turkish pages
- Turkish canonical URLs and localized breadcrumbs
- Turkish App Store CTA URLs present and correctly tracked
- `hreflang="tr"` present in both new Turkish pages
- reciprocal Turkish hreflang entries present across both page families
- `#related-guide` present in-body but absent from the Turkish minimal-pairs TOC
- absence of known dead links listed above
- prose-only handling of the final-consonants discussion
- JSON-LD parse success for all structured-data blocks on both Turkish pages
- generated `dist/tr/english-ear-training/index.html`
- generated `dist/tr/minimal-pairs-practice/index.html`

## Out Of Scope

- Broader hreflang cleanup outside the two hub-page families
- Changes to unrelated localized pages
- Refactoring or centralizing page generation
- Redesigning or restyling the hub pages
- Rewriting or retranslating the supplied Turkish copy
- Creating Turkish individual contrast pages
