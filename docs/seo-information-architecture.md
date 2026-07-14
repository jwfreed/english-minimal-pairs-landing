# SEO Information Architecture

## Purpose

This document is the canonical reference for how Soundwise SEO pages relate to one
another. It defines the **logical content hierarchy**, the **breadcrumb policy**, the
**internal-linking policy**, and the **localization rules** that every new SEO page must
follow.

It does **not** redesign the site. The URL structure described here already exists in the
repository and in `vite.config.js`. The goal of this document is to make the relationships
between existing pages explicit so future contributors can add pages consistently without
inventing new routes or hierarchies.

Read this alongside:

- `docs/site-structure.md` — file/route mechanics and the Vite entry map.
- `docs/seo-page-creation-guide.md` — page content structure, metadata, and QA checklist.
- `docs/seo-keyword-map.md` — keyword clusters and page priority.
- `docs/phase-1-localized-flagship-seo-matrix.md` — localized rollout tracking.

---

## 1. Site Hierarchy

The content forms a three-tier logical hierarchy:

```text
Home (/)
│
├── English Ear Training Hub        (/english-ear-training/)
│       broad listening-first guide
│
└── Minimal Pairs Practice Hub      (/minimal-pairs-practice/)
        practice strategy + directory
        │
        ├── ship-vs-sheep           (/ship-vs-sheep/)
        ├── bit-vs-beat             (/bit-vs-beat/)
        ├── right-vs-light          (/right-vs-light/)
        └── … 17 more pair pages
```

This is a **logical hierarchy, not a URL hierarchy.**

- The hierarchy describes *meaning and navigation* — which page is conceptually a parent
  of which.
- It is expressed through **breadcrumbs, internal links, and structured data**, not
  through nested URL paths.
- Every pair page is conceptually a child of the Minimal Pairs Practice Hub, even though
  its URL sits at the site root (`/ship-vs-sheep/`, not `/minimal-pairs-practice/ship-vs-sheep/`).

The two hubs are siblings under Home. The Ear Training Hub is the broad "why listening
first" entry point; the Minimal Pairs Practice Hub is the operational directory that
indexes the individual pair pages.

---

## 2. URL Architecture

### The rule: flat, top-level, clean public URLs

Every SEO page is emitted at the site root as a clean public URL. English source files live under `content/pairs/`:

```text
content/pairs/ship-vs-sheep/index.html             →  https://getsoundwise.co/ship-vs-sheep/
content/pairs/bit-vs-beat/index.html               →  https://getsoundwise.co/bit-vs-beat/
content/pairs/minimal-pairs-practice/index.html    →  https://getsoundwise.co/minimal-pairs-practice/
content/pairs/english-ear-training/index.html      →  https://getsoundwise.co/english-ear-training/
```

Localized source files live under `content/locales/` and prepend a locale segment in the public URL, but the page slug stays flat:

```text
content/locales/ja/ship-vs-sheep/index.html         →  https://getsoundwise.co/ja/ship-vs-sheep/
content/locales/ja/minimal-pairs-practice/index.html →  https://getsoundwise.co/ja/minimal-pairs-practice/
```

**Pair pages stay at `/ship-vs-sheep/` and `/ja/ship-vs-sheep/`. Do NOT nest them under a
hub path.** There is no `/minimal-pairs-practice/ship-vs-sheep/` and none should be created.

### Why URLs are flat (and stay flat)

| Reason | Detail |
| --- | --- |
| **Shorter URLs** | `/ship-vs-sheep/` is memorable, linkable, and clean in search results. |
| **Cleaner slugs** | The slug carries the keyword directly with no path noise. |
| **Existing routing** | Every slug is already registered in `seoPageSlugs` in `vite.config.js`; the build maps each content source path back to its existing public route. |
| **Easier maintenance** | New pages are one slug string plus one content directory — no public path migrations. |
| **Existing Vite configuration** | Vite's multi-page build maps each flat slug to an entry point. Nesting would change public URLs and require redirects for already-indexed pages. |

This matches the existing decision recorded in `docs/site-structure.md`: source files are grouped under `content/`, while public SEO URLs stay short and flat through the Vite output map.

The hierarchy in Section 1 is therefore expressed **conceptually** (breadcrumbs, links,
schema), never through the URL path.

---

## 3. Breadcrumb Policy

Breadcrumbs express the logical hierarchy that the flat URLs do not. Every SEO page must
ship a breadcrumb trail that places it correctly under its hub.

### Required hierarchy

**Pair page (English):**

```text
Soundwise → English Minimal Pairs Practice → Ship vs Sheep
   /                /minimal-pairs-practice/        (current page, no link)
```

**Hub page (English):**

```text
Soundwise → English Minimal Pairs Practice
   /                 (current page, no link)
```

**Pair page (localized — Japanese example):**

```text
Soundwise → 英語ミニマルペア練習 → ship vs sheep の聞き分け
 /ja/        /ja/minimal-pairs-practice/      (current page, no link)
```

Localized breadcrumbs must use **localized hub crumbs and localized link targets**:

- The "Soundwise" / home crumb on a `/ja/` page links to `/ja/`, not `/`.
- The hub crumb on a `/ja/` page links to `/ja/minimal-pairs-practice/`, not the English
  hub.

The three-crumb pair breadcrumb (`Soundwise → Hub → Pair`) is required for English and
localized pair pages. The two-crumb hub breadcrumb (`Soundwise → Hub`) is required for
English and localized hub pages. The visible breadcrumb and `BreadcrumbList` JSON-LD must
always be updated together.

### Visible breadcrumbs and JSON-LD must match

Two representations are required and they must be identical in label set and order:

1. **Visible breadcrumb** — the `<nav class="seo-breadcrumb" aria-label="Breadcrumb">`
   trail in the hero.
2. **`BreadcrumbList` JSON-LD** — a `<script type="application/ld+json">` block with one
   `ListItem` per visible crumb, in the same sequence, with matching `name` and `item`
   values.

If you add the hub crumb to the visible trail, you must add the same `ListItem` to the
JSON-LD (and vice versa). They are never allowed to diverge.

Example `BreadcrumbList` for a pair page under the policy:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Soundwise",
      "item": "https://getsoundwise.co/" },
    { "@type": "ListItem", "position": 2, "name": "English Minimal Pairs Practice",
      "item": "https://getsoundwise.co/minimal-pairs-practice/" },
    { "@type": "ListItem", "position": 3, "name": "Ship vs Sheep",
      "item": "https://getsoundwise.co/ship-vs-sheep/" }
  ]
}
```

### Current implementation status

All English and localized pair pages use the required three-crumb hierarchy. All localized
pair and hub pages link the first crumb to the matching localized homepage. Homepages and
utility/legal pages do not emit breadcrumb markup.

### Shared-template target (not yet implemented)

Every SEO page defines its breadcrumb **twice and by hand**: as inline
`seo-breadcrumb` HTML and as a separate `BreadcrumbList` JSON-LD block. There is no shared
breadcrumb function (`src/seo-page.js` handles page behavior/analytics, not markup
generation). `scripts/validate-breadcrumbs.mjs` prevents visible/schema divergence and
checks the hierarchy, labels, canonical route targets, positions, and page-class coverage
for source and built HTML.

**Target rule:** breadcrumb structure should be derived from a single shared
template/source so the visible trail and `BreadcrumbList` JSON-LD are generated from the
same data and cannot drift. No page should hand-author breadcrumb structure independently.
Introducing that shared template remains future work. Until it exists, authors must keep
the two representations identical and run `npm run validate:breadcrumbs`; the check also
runs automatically before each production build.

---

## 4. Internal Linking Policy

Internal links carry the hierarchy that the URLs flatten. Every pair page must link both
**upward** (to its hubs) and **laterally** (to related pair pages). No page may be an
orphan.

### Required links on every pair page

```text
                ┌──────────────────────────────┐
   upward  ───► │  Minimal Pairs Practice Hub  │
                └──────────────────────────────┘
                ┌──────────────────────────────┐
   upward  ───► │  English Ear Training Hub     │
                └──────────────────────────────┘
   lateral ───► 2–4 related pair pages (same sound contrast / family)
```

- **Upward:** link to *both* the Minimal Pairs Practice Hub and the English Ear Training
  Hub. These typically live in the page's "Related contrasts / Related practice" section.
- **Lateral:** link to 2–4 related pair pages that share the same vowel/consonant family
  (e.g. `ship-vs-sheep` links to `bit-vs-beat`, `sit-vs-seat`, `fill-vs-feel`,
  `live-vs-leave` — all `/ɪ/` vs `/iː/`).

### Hubs link downward

- The **Minimal Pairs Practice Hub** is the directory: it links down to the pair pages and
  across to the Ear Training Hub.
- The **English Ear Training Hub** links across to the Minimal Pairs Practice Hub and to
  category context.

This makes the link graph bidirectional: hubs point down to pairs, pairs point up to hubs,
and pairs point sideways to siblings.

### Same-language preference

When a localized version of a target page exists, **link to the same-language version.**
Only fall back to English when no localized equivalent exists yet.

```text
On /ja/ship-vs-sheep/:
  hub link      → /ja/minimal-pairs-practice/   (localized hub EXISTS → use it)
  hub link      → /ja/english-ear-training/      (localized hub EXISTS → use it)
  lateral link  → /ja/bit-vs-beat/  IF it exists, else /bit-vs-beat/  (English fallback)
```

Rule of precedence for any internal link target:

1. Same-language localized page, if it exists.
2. English page, as the fallback, if no localized version exists.

### Never create orphans

Every published page must be reachable through at least one internal link from a hub, and
must itself link back into the hub network. A page that nothing links to, or that links to
nothing, fails review.

### Operational guardrails (unchanged from existing guidance)

- **Do not link to pages that do not exist yet.** Add the link when the target page goes
  live, then verify it locally and in production (`docs/seo-page-creation-guide.md`).
- Use root-relative paths (`/bit-vs-beat/`, `/ja/minimal-pairs-practice/`).
- Keep legal links pointed at the clean URLs (`/privacy/`, `/terms/`).

### Current implementation status

`content/locales/ja/ship-vs-sheep/index.html` currently links **upward and laterally to English pages**
(`/minimal-pairs-practice/`, `/english-ear-training/`, `/bit-vs-beat/`, …) even though the
Japanese hubs (`/ja/minimal-pairs-practice/`, `/ja/english-ear-training/`) already exist.
Under the same-language-preference rule the hub links should point to the `/ja/` hubs; the
lateral pair links may remain English until localized pair pages exist. This is a known
deviation to correct, and new localized pages should follow the policy from the start.

---

## 5. Hub and Page Responsibilities

Each tier has a distinct job. Do not duplicate a hub's role inside a pair page, or collapse
a hub into a list of links with no guidance.

### English Ear Training Hub — `/english-ear-training/`

- Broad educational guide to ear training for English.
- Establishes the **listening-first philosophy**: perception before production.
- Provides pronunciation context — why hearing a contrast must come before saying it.
- Links across to the Minimal Pairs Practice Hub and to category/context pages.
- Tone: the "why and how to think about it" entry point.

### Minimal Pairs Practice Hub — `/minimal-pairs-practice/`

- Overview of what minimal pairs are and why they work.
- Practice strategy: how to use minimal-pair listening effectively.
- **Directory of the individual pair pages** — the canonical index that links down to
  every published pair page.
- Category navigation (vowel contrasts, consonant contrasts, etc.).
- Tone: the operational map of the pair-page network.

### Pair Pages — `/[word-a]-vs-[word-b]/`

Each pair page solves **one** learner problem and explains **one** sound contrast. Per
`docs/seo-page-creation-guide.md`, the structure is:

- One clear H1 and a direct quick answer to the learner's pain.
- The single sound contrast explained (IPA only where it helps).
- How to hear the difference (listening cues before pronunciation).
- Practice examples.
- A single, non-aggressive **Soundwise CTA**.
- A visible **FAQ** including `Why does this happen?` and `How do I practice?`.
- Links back **into the hub network** (upward + lateral, per Section 4).
- `FAQPage` JSON-LD matching the visible FAQ, plus the `BreadcrumbList` from Section 3.

A pair page never tries to be a hub: it does not enumerate the whole catalog or teach the
full strategy. It points up to the hubs for that.

---

## 6. Localization Rules

The information architecture is **identical in every language.** Localization changes the
words and the link targets, never the structure.

| Dimension | Rule |
| --- | --- |
| **Hierarchy** | Same three tiers in every locale: Home → Hubs → Pair pages. |
| **Breadcrumbs** | Localized labels, localized link targets; same crumb count and order as English. |
| **Hubs** | Each locale uses its own hubs (`/ja/minimal-pairs-practice/`, `/ja/english-ear-training/`). |
| **Internal navigation** | Stays within the language (Section 4 same-language preference). |
| **hreflang** | Declared independently of navigation (see below). |

### Locale set

Localized hubs exist for the 14 locales registered in `vite.config.js` and
`src/localized-homepage-routes.js`:

```text
ja  zh  yue  ko  es  pt  ar  hi-ur  fa  id  ru  th  tr  vi
```

Each has `/<locale>/minimal-pairs-practice/` and `/<locale>/english-ear-training/`.
Localized **pair** pages are rolling out per the flagship matrix; only `ja/ship-vs-sheep`
exists today.

### Navigation never crosses languages — except as fallback

A learner on a `/ja/` page should stay on `/ja/` pages as they navigate. The only time a
link may cross into English is when **no localized equivalent of the target exists yet**
(Section 4 precedence). When the localized target later ships, update the link to the
same-language version.

### hreflang is separate from navigation

`hreflang` / `rel="alternate"` annotations tell search engines which URL serves which
language for the *same* content. They are **not** navigation and must not be confused with
internal links:

- Hubs already declare a full hreflang cluster (`en` + all 14 locales + `x-default`), as in
  `content/pairs/minimal-pairs-practice/index.html`.
- A page can (and should) declare hreflang alternates for languages it does **not** link to
  in its visible navigation.
- Keep hreflang clusters consistent and reciprocal across a page's localized set. Aligning
  these clusters is tracked separately (see the localized hub hreflang work in repo
  history); do not let navigation changes silently alter hreflang.

---

## 7. Future Expansion

New pages slot into the existing architecture **without changing the URL structure.**

### Adding a new pair page

```text
 1. Create  content/pairs/[word-a]-vs-[word-b]/index.html
        │
 2. Register the slug in seoPageSlugs (vite.config.js)
        │
 3. Link UP to both hubs (same-language if localized)
        │
 4. Hubs link DOWN to the new page (add it to the directory)
        │
 5. Interlink LATERALLY with 2–4 related pair pages (same sound family)
        │
 6. Add BreadcrumbList (Soundwise → Hub → New Pair) + FAQPage JSON-LD
        │
 7. Add to public/sitemap.xml if it should be indexed
        │
 8. npm run build  →  verify  →  deploy
```

No new parent URL is created. No nesting is introduced. The page becomes a child of the
Minimal Pairs Practice Hub through **breadcrumbs and links**, not through its path.

### Adding a localized version of an existing page

- Create `content/locales/<locale>/<slug>/index.html` and register `<locale>/<slug>` in `seoPageSlugs`.
- Reuse the same structure; localize labels, breadcrumbs, and link targets.
- Point internal links at same-language hubs/pairs that exist; fall back to English only
  where a localized target is not yet live.
- Add the new URL to the page's hreflang cluster and update siblings reciprocally.

### What expansion must never do

- Never introduce a nested URL (`/minimal-pairs-practice/<slug>/`).
- Never invent a new hub URL — the two hubs and their 14 localized variants are the
  canonical parents.
- Never publish a link to a page that does not exist yet.
- Never leave a new page orphaned from the hub network.

---

## 8. Information Architecture Principles

A short summary of the rules above, for quick reference:

1. **Logical hierarchy over nested URLs.** Meaning lives in breadcrumbs, links, and schema;
   URLs stay flat.
2. **Shallow URL depth.** All SEO pages sit one level below root (`/slug/` or
   `/<locale>/slug/`). No deeper paths.
3. **Strong internal linking.** Every pair page links up to both hubs and laterally to
   related pairs; hubs link down. No orphans.
4. **Same-language navigation.** Stay within the locale; cross to English only as a fallback
   when no localized target exists.
5. **Breadcrumbs and JSON-LD always agree.** Visible trail and `BreadcrumbList` carry the
   same crumbs in the same order.
6. **Reusable page templates.** Hubs and pair pages each follow a fixed structure
   (`docs/seo-page-creation-guide.md`); new pages reuse it by swapping content. Breadcrumb
   structure should converge on a single shared source (target state, §3) so visible and
   JSON-LD trails cannot diverge.
7. **Localized navigation consistency.** Identical IA in every language; only labels and
   link targets change.
8. **Scalable multilingual architecture.** New pages and locales slot into the existing
   `seoPageSlugs` map and hub network with no structural change.
9. **Evidence over claims.** Structured data describes only visible content; no
   unsupported ranking, traffic, or AI-visibility guarantees (`docs/seo-page-creation-guide.md`).

---

## Quick Reference

| Concern | Policy |
| --- | --- |
| Pair page URL | `/[a]-vs-[b]/` (flat) and `/<locale>/[a]-vs-[b]/` |
| Hub URLs | `/minimal-pairs-practice/`, `/english-ear-training/` (+ 14 localized) |
| Nesting | None — ever |
| Breadcrumb (pair) | `Soundwise → Minimal Pairs Practice → [Pair]` |
| Breadcrumb (localized) | Localized labels + localized link targets |
| Visible vs JSON-LD breadcrumb | Must match exactly |
| Pair page links up to | Both hubs (same-language if available) |
| Pair page links sideways to | 2–4 related pairs in the same sound family |
| Cross-language links | Only as English fallback when no localized target exists |
| hreflang | Declared independently of navigation; full reciprocal clusters |
| Orphans | Not allowed |
| New parent URLs | Not allowed |
