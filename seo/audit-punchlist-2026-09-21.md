# SEO Audit Punch List — 2026-09-21

Source: OpenSEO 0.1.9 site audit `bbf033e1-c301-4549-be9d-b0663ccc8c3f`
Target: https://getsoundwise.co · 111/111 pages crawled · 0 blocked
Total issues reported: **151**

Money-page classification used (user-supplied, not inferred):

- **Class 1** — `/fill-vs-feel/`, `/live-vs-leave/`, `/ship-vs-sheep/`, `/bit-vs-beat/`
  (the controlled /ɪ/–/iː/ conversion surface)
- **Class 2** — the other 17 pages matching `[data-exercise][data-contrast]`, the 14 L1 locale
  routes, and the English root

> `[data-exercise][data-contrast]` marks page capability, not business priority. The two are kept
> separate throughout this document.

---

## Resolved in this run (not punch-list items)

**`heading-order-skip` — 80 occurrences → 0.** Every `<h4>` in the codebase was a footer column
heading ("Product" / "Legal & Support") in one of 14 languages; none was a content heading. After an
`<h2>` section this produced an h2→h4 skip on nearly every page, including all four Class 1 pages.
Converted to `<h3>` across 66 hand-maintained source files plus regeneration of the 14 localized
homepages. Verified: `npm test && npm run build` exits 0, and 0 of 114 built pages skip a heading
level.

**Not yet live.** This fix exists in the working tree only. It is uncommitted and undeployed, so
production still serves the old markup until it ships.

---

## Class 1 — broken links / 4xx / 5xx on money pages

**None.** No `broken-internal-link`, `broken-page`, `server-error`, or `redirect-loop` anywhere in
the crawl, on any page. All 111 crawled pages returned successfully and 0 were blocked.

---

## Class 2 — missing or duplicate titles and metas

### 2.1 `missing-meta-description` — 28 pages — NEEDS A LOCALIZATION DECISION

All 28 are the flat legacy legal URLs: `privacy-<locale>.html` and `terms-<locale>.html` for all 14
locales.

- **What breaks:** Google composes its own snippet for these pages. Impact is low — they are absent
  from `public/sitemap.xml` and are retained only for inbound-link compatibility
  (`vite.config.js:120`: *"legacy .html URLs and translated legal .html URLs remain built for
  existing public links"*). They are, however, self-canonical and indexable (only 2 of 32 legal
  files carry `noindex`).
- **Exact change:** add one `<meta name="description">` to each file under `legal/privacy/` and
  `legal/terms/`.
- **Why this is not done here:** it requires writing new copy in 14 languages. Per `AGENTS.md`
  ("Localization Safety", "ask rather than invent") this is a transcreation decision, not a
  mechanical fix. Hindi-Urdu in particular has a house style to honour.
- **Owner:** whoever owns localized copy.
- **Cheaper alternative worth considering first:** decide whether these legacy URLs should be
  indexable at all. If they should not, one `noindex` per file retires this issue permanently and
  needs no translated copy.

### 2.2 `title-too-long` — 26 pages — DELIBERATELY DEFERRED ON CLASS 1

Breakdown: 17 locale routes, 8 English pages, 1 root. Severity `info`. Lengths 61–84 characters.

**Class 1 pages affected — recommend NO action right now:**

| Page | Length | Title |
| --- | --- | --- |
| `/ship-vs-sheep/` | 61 | `Ship vs Sheep Pronunciation: /ɪ/ vs /iː/ Practice \| Soundwise` |
| `/live-vs-leave/` | 61 | `Live vs Leave Pronunciation: /ɪ/ vs /iː/ Practice \| Soundwise` |

Both exceed the threshold by a single character, and both sit on the controlled i-vs-ee conversion
surface currently being used to establish a funnel baseline. Rewriting a title mid-measurement
changes the thing being measured. **A one-character overage is not worth contaminating the
baseline.** Revisit once the baseline exists.

**Class 2, English (6):** `/english-ear-training/` (62), `/pull-vs-pool/` (68), `/man-vs-men/` (74),
`/right-vs-light/` (61), `/three-vs-tree/` (62), `/heart-vs-hurt/` (62). Safe to trim, but note the
tension: the characters most easily cut are the phonemic notation and the brand suffix, and the
notation carries search intent. Trim the brand suffix first.

**Class 2, locale routes (17):** these need transcreation, and the 14 localized homepages are
generated — a title change must go through `index.html` plus
`src/landing-supplement-translations.js` and then `npm run generate:localized-homepages`. Never edit
`content/locales/<locale>/index.html` directly.

**Root (1):** `/` at 65 characters.

---

## Class 3 — uncrawlable / noindex mistakes

**None.** No `noindex-page`, `blocked-page`, `canonical-conflict`, `canonicalized-page`,
`redirect-chain`, `orphan-page`, `no-outgoing-links`, or `deep-page` issues were reported.

---

## Class 4 — thin / duplicate content

### 4.1 `thin-content` — 8 pages — FALSE POSITIVE, DO NOT ACT

Affected: `privacy-ja`, `terms-ja`, `privacy-zh`, `terms-zh`, `privacy-th`, `terms-th`,
`privacy-yue`, `terms-yue` — reported word counts 67–141.

These are exactly the four scripts that do not delimit words with spaces (Japanese, Simplified
Chinese, Thai, Traditional Chinese/Cantonese). Korean, Arabic, Russian and the Latin-script locales
are **not** flagged, which is the tell.

Measured directly on `legal/privacy/privacy-ja.html`:

```
OpenSEO reported wordCount : 75
whitespace-split tokens    : 78
total characters           : 1116
CJK characters             : 841
```

A 1,116-character Japanese privacy policy is not thin content. The metric is a whitespace-tokenizer
artifact. **Do not pad, expand, or rewrite these pages to satisfy it.**

### 4.2 No duplicate-content findings

Worth recording explicitly: the audit reported **zero** `duplicate-content`, `duplicate-title` and
`duplicate-meta-description` issues. The concern that 14 structurally parallel L1 routes would be
collapsed into a duplicate-content finding **did not materialise** in this run. The routes are
deliberately parallel by design — same phonetic-training format, different minimal pairs per L1 —
and this is now recorded in OpenSEO's project context so future runs inherit the caveat.

---

## Class 5 — performance

### 5.1 Lighthouse — NOT ASSESSED

**20 of 20 Lighthouse runs failed. `lighthouseCompleted: 0`.** There is no performance or Core Web
Vitals data behind this class at all. This class is not clean — it is unmeasured. Any statement
about the site's performance would be unsupported.

- **Next step:** re-run with `runLighthouse: true` and investigate the failure cause in the
  container logs before trusting a future "no performance issues" result.

### 5.2 `slow-response` — 1 page

- `https://getsoundwise.co/thin-vs-tin/` — 1,639 ms.
- Single occurrence out of 111 pages on GitHub Pages static hosting; most likely a cold-cache edge
  fetch rather than a site defect. Not repo-fixable — there is no origin server to tune.
- **Owner:** hosting. **Action:** re-measure before acting. If it persists across runs, investigate
  that page's asset weight.

---

## Also flagged: `meta-description-too-short` — 8 pages — LIKELY FALSE POSITIVE

Affected: `/ja/`, `/zh/`, `/yue/`, `/ja/english-ear-training/`, `/yue/english-ear-training/`,
`/zh/minimal-pairs-practice/`, `/zh/ship-vs-sheep/`, `/yue/right-vs-light/` — lengths 60–69.

Every one is Japanese, Simplified Chinese or Cantonese. No Latin-script locale is flagged.

`/ja/` description, measured: 66 characters, 37 of them Japanese —

```
ship/sheep、bit/beat、right/lightのようなミニマルペアを練習し、話す前に耳でコントラストを掴みましょう。
```

That carries the full proposition. CJK meta descriptions conventionally run 60–90 characters, since
each character carries far more information than a Latin one; the audit's minimum is calibrated for
Latin script. **Do not pad these to hit a character count.**

---

## Audit reliability notes

1. **`scripts/validate-seo-exercise.mjs` does not respect `.gitignore`.** It globs `**/*.html` and
   failed the build when it found backup copies under the gitignored `.seo-god/backup/`. Any tool
   that writes HTML anywhere in the tree will break the build the same way. Consider excluding
   dotfile directories in that validator.
2. **Market setting.** The OpenSEO project is `locationCode 2840 / languageCode en`. That covers the
   English root only. Per-locale market scoring is currently unavailable for **every** route,
   English included, because it requires DataForSEO, which is not configured. If DataForSEO is ever
   funded, set per-L1 markets before trusting any keyword, SERP or rank figure for a locale route.
3. **OpenSEO's audit does not check hreflang.** None of its 29 issue types covers it. hreflang
   reciprocity across the 14 locale routes and the English root is enforced in-repo by
   `scripts/validate-seo-architecture.mjs`, which runs inside `npm run build`.
