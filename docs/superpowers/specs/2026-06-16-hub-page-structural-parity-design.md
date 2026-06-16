# Hub-Page Structural Parity Design

Date: 2026-06-16

## Goal

Bring both SEO hub-page families to a single, consistent structural skeleton across every
locale, while preserving all localized prose and L1-specific content.

The two families:

- `english-ear-training` (base `english-ear-training/index.html` plus 12 locale variants)
- `minimal-pairs-practice` (base `minimal-pairs-practice/index.html` plus 12 locale variants)

Locales in scope: base (English) plus `es, ja, zh, yue, ar, hi-ur, fa, id, ko, pt, ru, th`.

## Background

A structural audit of all 26 pages found the page shells, section ordering, comparison
grids, CTAs, and footers are uniform, with two divergences:

1. **`english-ear-training` / `#minimal-pairs-guide`** — every locale uses this section as a
   compact cross-link to the practice page (heading + one linking sentence) **except `th`**,
   which additionally renders a redundant 16-item inline contrast list. Those same word pairs
   already appear in Thai's `#common-contrasts` grid, so the list is duplicative.

2. **`minimal-pairs-practice` / `#related-guide`** — every locale already has a fully written,
   native `#related-guide` section linking back to its ear-training page. The divergence is
   purely structural:
   - Correct: `<section id="related-guide" aria-labelledby="related-guide-title">`, placed
     after `#soundwise` and before `#faq`: `ja, zh, yue, hi-ur, fa, id, ru, th`
   - Misplaced: has `id="related-guide"` but sits **before** `#soundwise`: `ko`
   - Missing the section id: base (English), `es`, `ar`, `pt` use
     `<section aria-labelledby="related-guide-title">` (no `id="related-guide"`), placed
     after `#soundwise`. The localized copy is already present and correct; only the `id`
     attribute is absent.

   The earlier assumption that English/`es`/`ar`/`pt` lacked the section (and needed new copy
   or native-review stubs) was a false negative from id-based tooling. No copy is added or
   changed in this work.

## Canonical Structure

English is canonical for **shell and architecture only**, not for suppressing L1-specific
localized content.

### `english-ear-training`

Section order (unchanged):
`why-listening-first, what-ear-training-means, common-contrasts, how-to-practice,
minimal-pairs-guide, soundwise, faq`

`#minimal-pairs-guide` role: a compact cross-link to the practice page. It contains a heading,
localized intro prose, and the cross-link sentence — but no inline contrast list.

### `minimal-pairs-practice`

Section order (canonical):
`what-are-minimal-pairs, why-they-help, how-to-practice, start-here, soundwise,
related-guide, faq`

`#related-guide` is positioned **after `#soundwise` and before `#faq`** on every locale.

Existing `#related-guide` markup pattern (do not change for compliant locales):

```html
<section id="related-guide" aria-labelledby="related-guide-title">
  <h2 id="related-guide-title">…localized heading…</h2>
  <p>…<a href="/<loc>/english-ear-training/">…localized ear-training H1…</a>.</p>
</section>
```

`#related-guide` is **not** added to the table of contents, matching the current convention
(no page lists it in the TOC).

## Changes

Exactly six files change.

### A. `english-ear-training` (1 file)

- **`th/english-ear-training/index.html`**: in `#minimal-pairs-guide`, remove only the
  redundant 16-item `<ul>`. Keep the heading, the two Thai intro paragraphs, and the approved
  cross-link sentence (`ดูวิธีฝึกด้วย minimal pairs` → `/th/minimal-pairs-practice/`).
- All other 12 locales are already compliant. No change.

### B. `minimal-pairs-practice` (5 files)

This pass is **structure only**. Do not edit any existing heading, sentence, anchor text, or
L1-specific content. The localized `#related-guide` copy already exists and is preserved exactly.

- **`ko/minimal-pairs-practice/index.html`**: move the existing `#related-guide` section
  (already has `id="related-guide"`) from before `#soundwise` to after it (before `#faq`).
  Move the block verbatim — do not change the Korean copy.
- **`minimal-pairs-practice/index.html` (base/English)**, **`es/minimal-pairs-practice/index.html`**,
  **`ar/minimal-pairs-practice/index.html`**, **`pt/minimal-pairs-practice/index.html`**: each
  already has a complete `#related-guide` section placed after `#soundwise`, but its `<section>`
  tag reads `<section aria-labelledby="related-guide-title">` (no id). Add `id="related-guide"`
  so it becomes `<section id="related-guide" aria-labelledby="related-guide-title">`. Change the
  one attribute only; leave the heading, paragraph, and anchor untouched.
- The 8 already-correct locales (`ja, zh, yue, hi-ur, fa, id, ru, th`): no change.

The existing en/es/ar/pt heading and sentence text is left exactly as-is and is recorded in the
final report so the user can decide on a separate copy-review pass later.

## Out of Scope (do not touch)

- All existing `#related-guide` headings, sentences, and anchor text (en/es/ar/pt included).
  This pass changes section structure/attributes only, never copy.
- L1-specific `comparison-grid` contrast cards (intentionally different per locale).
- Localized prose outside the structural cross-link work.
- Source-preserved contrast links, even where target contrast pages do not yet exist.
- TOC behavior (`#related-guide` is not part of the current TOC convention).
- Hreflang clusters, canonicals, sitemap, vite routing, JSON-LD content.

## Verification

- Structural skeleton audit within both families — section-id sequences must be identical
  across all locales per family. In particular, `minimal-pairs-practice` must show
  `…, soundwise, related-guide, faq` (with `id="related-guide"` present) for all 13 locales.
- `npm run build` (Node 22).
- `npm run validate:localized-homepages`.
- `npm run validate:app-store-tracking`.
- JSON-LD parse for any page touched.
- `git diff --check`.
- Focused diff review confirming exactly the six expected files changed and no content removed
  except Thai's duplicate list.
