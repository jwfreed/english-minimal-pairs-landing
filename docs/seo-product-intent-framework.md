# SEO Product Intent Measurement Framework

## Purpose

Sprint 1 validated that the i-vs-ee SEO cluster is *built correctly*: messaging, structured data, exercise functionality, and internal linking all passed review. That answers "does it work." It does not answer "does it produce product intent."

This framework exists to make that second question answerable with evidence instead of assumption. It defines what to measure, how to interpret the results, and what evidence is required before the SEO program expands past this cluster. It does not report results — no GA4 or Search Console data has been pulled yet (see "Next Analysis Phase" below for what happens first). Every metric below is a *definition*, not a result.

## Current SEO Funnel Hypothesis

The intended path: a searcher with a specific sound-contrast question (e.g. "fill vs feel pronunciation") lands on a cluster page from organic search, engages the embedded listening exercise, completes it, and clicks through to the App Store.

Two implementation facts materially shape how that hypothesis should be read:

- **`exercise_complete` is a real intent signal, not a vanity one.** It only fires after both rounds of the exercise (`DEFAULT_MAX_ROUNDS = 2` in `src/exercise-engine.js`), not after a single interaction. A user who completes it has done real work, not just glanced at a widget.
- **`app_store_click` fires from three CTA positions per page** — nav/hero, mid-content (end of the article body), and footer — and until this sprint those clicks were indistinguishable in GA4. That gap is closed below (see [Metric Definitions](#cta_position)); it is the single most important distinction for judging whether the *exercise* drives intent, versus users who bounce straight to the CTA without engaging.

**Assumption (unverified):** organic traffic is actually reaching these pages in measurable volume. Nothing in the repository confirms current traffic — that has to come from GA4/Search Console directly, not from this document.

## Measurement Model

```
organic arrival → exercise_start → exercise_complete → app_store_click
```

This model applies identically to every page in the cluster, regardless of language. The four contrasts and their approved localized variants are one semantic cluster, not separate English and localized funnels — a searcher choosing `/es/ship-vs-sheep/` over `/ship-vs-sheep/` is answering the same underlying question in a different language, and the funnel that matters (did they engage, did they complete, did they click through) is the same shape either way.

### Three measurement levels

Because the same contrast exists in multiple locales (today: `ship-vs-sheep` in `en`, `es`, `id`, `ja`, `pt`, `ru`, `tr`, `zh`), reporting must be built to roll up cleanly across three levels rather than being written page-by-page:

1. **URL level** — one row per page (`/ship-vs-sheep/`, `/es/ship-vs-sheep/`, `/ja/ship-vs-sheep/`, …). This is the finest grain, useful for catching a single locale or page that's broken or underperforming its siblings.
2. **Locale level** — all cluster pages for one locale rolled together (e.g. every `es/*` cluster page). Useful for asking "is Spanish-language demand and engagement different from English," independent of which contrast.
3. **Contrast-cluster level** — all locales of one contrast rolled together (e.g. every `ship-vs-sheep` variant across all 8 locales), and ultimately all four contrasts rolled together as "the i-vs-ee cluster." The four word-pairs (`fill-vs-feel`, `live-vs-leave`, `ship-vs-sheep`, `bit-vs-beat`) are different lexical instances of one underlying phoneme contrast, `/ɪ/` vs `/iː/` (see `docs/seo-page-conversion-matrix.md`) — that contrast, not the individual word pairs, is the actual learning object this level measures. This is the level the expansion decision in this document is actually made at — a single locale or single page underperforming should not by itself block or justify expansion; the cluster-level trend should.

GA4 supports this natively: `exercise_id` (the contrast) and `language` (`document.documentElement.lang`) are already sent as event params on every funnel event (`src/seo-page.js` → `buildExerciseParams`), and `page_path` is sent on `app_store_click`. No new instrumentation is required to build all three rollups — this is a reporting/Exploration-report construction task, not a code change.

## Metric Definitions

| Stage | Event | Metric | Success Signal | Risk / Interpretation Note |
|---|---|---|---|---|
| Organic arrival | `page_view` (GA4 default), filtered to cluster URLs, segmented by `sessionSource = google / organic` | Organic sessions per URL / locale / cluster; landing query text (via Search Console, not GA4) | Sessions arrive from queries matching the page's target intent, not just any query containing the words | Vanity metric in isolation. Traffic without downstream funnel movement is not evidence of product intent and must never be reported as if it were |
| Exercise engagement | `exercise_start` | `exercise_start` ÷ organic sessions, rolled up at all three levels | A meaningful share of organic visitors engage the exercise (no baseline yet — the first data pull sets it) | The dedup guard in `src/funnel-tracking.js` (`exerciseStartSent`) is scoped to a single page load, not a persisted session. A reload-heavy visit can resend the event. Treat exact rates as directional until corroborated against session counts |
| Exercise completion | `exercise_complete` | `exercise_complete` ÷ `exercise_start` | High completion rate — the exercise requires finishing both rounds, so this is a genuine friction signal, not a click-through rate | A low rate could mean the exercise is confusing or broken (investigate: speech-synthesis voice availability across browsers, mobile tap targets), *not* automatically "no intent." Requires qualitative review before drawing product conclusions |
| Purchase intent | `app_store_click`, broken down by `cta_position` | `app_store_click` (position = `post-exercise-footer`) ÷ `exercise_complete` — the post-completion click rate, now separable from clicks by users who never engaged | Any sustained non-zero post-completion rate — this is the only web-observable proxy for product intent this system can produce | Click ≠ install ≠ paid conversion. There is zero web visibility past the App Store link — `training_start` was deliberately not implemented because no truthful web signal exists past this point (see project memory: SEO Funnel Analytics). Treat this stage as a ceiling, not a KPI to chase past its natural limit |

<a id="cta_position"></a>
### `cta_position` (added this sprint)

`app_store_click` now carries a `cta_position` parameter with one of three values, matching the three CTA anchors present on every cluster page:

- `hero` — the nav-bar CTA, visible without scrolling
- `mid-content` — the CTA at the end of the article body, after the exercise and the deeper contrast explanation
- `post-exercise-footer` — the footer CTA

This is what makes the "purchase intent" row above answerable at all: without it, GA4 could not distinguish a click from someone who engaged the exercise from a click by someone who bounced straight to the top-of-page CTA. `link_id` already existed for the `hero` and `mid-content` positions (`nav-{contrast}-app-store-cta`, `article-{contrast}-app-store-cta`) but required parsing a per-contrast string and had no value at all for the footer link; `cta_position` is a single, locale- and contrast-independent dimension usable directly in GA4 breakdowns and rollups at all three measurement levels.

**Naming note:** these values name layout position, not journey stage, deliberately. In DOM order, only `hero` precedes the exercise mount — both `mid-content` and `post-exercise-footer` sit after it (the `mid-content` CTA follows the exercise and the deeper contrast explanation; the footer CTA follows that). A stage-based name like `post_exercise` would describe `mid-content` just as accurately as the footer CTA, so it wouldn't add clarity — it would blur a distinction that currently exists. It would also overstate what the event proves: a click's position says where on the page it happened, not that the visitor actually finished the exercise before clicking (a visitor can scroll past an unfinished exercise and click either downstream CTA). Layout-based names keep that boundary honest.

## Risks and Interpretation Notes

- **No GA4 or Search Console data has been pulled for this cluster.** Every threshold above is a definition, not a target — do not backfill numbers into this document from memory or assumption.
- **Event guards are page-load-scoped, not session-persisted**, for both `exercise_start`/`exercise_complete` (in-memory flags in `funnel-tracking.js`) and unguarded entirely for `app_store_click`. Reloads and repeat clicks within one visit can inflate raw counts. Rates (stage ÷ stage) are more trustworthy than raw counts until this is corroborated against session-scoped data.
- **`app_store_click` is a ceiling, not a KPI.** The web funnel cannot see past this event — install, in-app training start, and paid conversion are all outside its visibility by design. Do not propose instrumenting further down this path; it isn't truthfully measurable from the web.
- **A single underperforming locale or page is not evidence against the cluster.** Judge expansion readiness at the contrast-cluster level (all locales rolled up), and only use URL-level or locale-level data to diagnose *why*, not *whether*.

## Expansion Decision Criteria

- **Minimum evidence bar to launch a 5th sound family:** the contrast-cluster must show organic sessions converting to `exercise_complete` at a non-trivial, repeatable rate across at least two of the four contrasts (not one outlier page), *and* measurable `app_store_click` volume at the `post-exercise-footer` position specifically — now that it's distinguishable from pre-engagement clicks.
- **Traffic volume alone does not justify expansion.** Rankings or impressions with no corresponding funnel movement are explicitly out of scope as evidence, per the Sprint 2 constraint that this program does not expand on traffic signals alone.
- **No new thresholds are invented here.** The first GA4 + Search Console pull sets the baseline; this document will be updated with actual numbers once that happens, not before.

## Next Analysis Phase

The first GA4 + Search Console pull should be structured around the three measurement levels above (URL, locale, contrast-cluster), and should prioritize, in this order:

1. Organic sessions per page — the traffic baseline; context, not a success metric on its own.
2. `exercise_start` ÷ organic sessions — engagement rate.
3. `exercise_complete` ÷ `exercise_start` — completion rate.
4. `app_store_click` at `cta_position = post-exercise-footer` ÷ `exercise_complete` — the post-exercise CTA click rate, and the core product-intent signal this framework exists to produce.

This isn't new instrumentation — all four are already defined in the Metric Definitions table above. This section exists so the next analysis pass has one starting point instead of re-deriving priority from the full table each time.

## Changelog: Metadata Optimization (2026-07-14)

All English pair pages were moved to the problem-led title/description pattern
(`X vs Y Pronunciation: /a/ vs /b/ Practice`; template in
`docs/seo-page-creation-guide.md`), two broken localized titles (ko/yue
right-vs-light) were fixed, and the two English hub descriptions were trimmed.
Three things matter for interpreting data against this change:

- **This optimization completed before the first Search Console baseline pull.**
  There is no "before" CTR snapshot; the first pull sets the baseline on the new
  metadata.
- **CTR impact should be evaluated only after Google recrawls the affected pages**,
  not against the deployment date itself — snippets update on recrawl, per page.
- **Future metadata optimization decisions should use query-level impressions and
  CTR (Search Console) plus `app_store_click` data (GA4)**, not intuition or
  further template rewrites. No further metadata changes until that evidence exists.

## Changelog: Localized Metadata Parity, Batch 1 (2026-07-14)

**Deployed 2026-07-14. This date is the SEO measurement baseline marker:** it
shipped the same day as the English metadata optimization, inside the same
pre-baseline window, so English and localized changes share one Search Console
before/after dividing line. Evaluate both against the first baseline pull, per
page, after recrawl. Scope was fix-class only:

- Vietnamese ear-training hub title/description no longer use "luyện tai nghe"
  ("tai nghe" reads as *headphones*); head metadata and LearningResource JSON-LD
  now say "luyện nghe phân biệt âm".

  **Deferred vi visible-copy note:** the visible breadcrumb, H1, and body on
  `/vi/english-ear-training/` still say "luyện tai nghe" on purpose. The
  breadcrumb validators require visible breadcrumb text to equal BreadcrumbList
  JSON-LD names, and the hub's breadcrumb label is reused on other vi pages, so
  fixing the visible copy is a coordinated body-copy change across the vi pages
  (visible breadcrumb + breadcrumb JSON-LD + H1/body together), not a metadata
  edit. Batch 1 was metadata-only; do this as its own reviewed change.
- The 10 non-CJK localized pair pages (ar, es, fa, hi-ur, id, pt, ru, th, tr, vi)
  promoted their problem-led og:description into the meta description and now
  keep meta = og = twitter descriptions (and titles) synchronized, matching the
  English pattern. ja/ko/yue/zh already complied and were not touched.
- Truncating metadata trimmed: es and id minimal-pairs hub titles/descriptions,
  id and tr flagship pair descriptions.

## Changelog: Batch 2A–D Complete — Baseline-Preservation Release (2026-07-14)

**Status: Batch 2A–D is complete; this entry is the completion record.**
Delivered: (A) the homepage SEO metadata architecture (optional
`seoTitle`/`seoDescription` with hero fallback, shared helper, generator and
validator in lockstep — infrastructure only, no fields populated), (B) the
localized hub title policy, documented and validator-enforced, (C) the three
confirmed locale metadata fixes (ko 변별→구분, tr "Dinleme Kulağı"→"Kulak
Eğitimi", hi-ur अंग्रेज़ी spelling), and (D) the Vietnamese visible-copy issue
documented as deferred, untouched. Intentionally deferred: homepage
seoTitle/seoDescription population, hub brand-suffix experiments, and all
visible-copy parity fixes (see "Deferred Localized Metadata Experiments"
below).

**This is the SEO baseline-preservation release.** Deployed 2026-07-14, inside
the same pre-baseline window as the English optimization and Batch 1, so all
three share one Search Console before/after dividing line. Do not populate
homepage SEO fields or begin SERP experiments until Search Console baseline
data exists. Scope was architecture preparation plus the three register fixes
already confirmed by native-guidance review — no experimental SERP copy.

- **Homepage SEO metadata architecture (infrastructure only).**
  `src/localized-homepage-seo.js` now owns the homepage title/description
  formula; `scripts/generate-localized-homepages.mjs` and
  `scripts/validate-localized-homepages.mjs` both consume it, so generator and
  validator cannot drift. Locale copy may define optional
  `seoTitle`/`seoDescription` overrides with fallback to
  `heroTitle | Soundwise` / `heroSubtitle` (rules in
  `docs/seo-page-creation-guide.md`, "Localized homepage SEO metadata").
  **No locale defines these fields yet** — generated homepages are
  byte-identical to before, deliberately, to keep the baseline clean. The
  homepage validator now also checks `twitter:title`/`twitter:description`
  sync. Unit coverage: `scripts/localized-homepage-seo.test.mjs`.
- **Hub title brand policy (decided and enforced).** Localized hubs stay
  keyword + benefit focused with no `| Soundwise` suffix by default; English
  hubs keep their branded titles. Policy and exception conditions live in
  `docs/seo-page-creation-guide.md` ("Hub title policy");
  `scripts/validate-seo-architecture.mjs` fails the build if a localized hub
  title gains the suffix.
- **ko hubs:** the clinical 변별 replaced with learner-natural 구분 in head
  metadata (title/og/twitter/description) and LearningResource JSON-LD
  (name/description/teaches) on both hubs. Visible breadcrumb, H1, FAQ, and
  body still use 변별 on purpose — same coupling as the vi case below.
- **tr ear-training hub:** "İngilizce Dinleme Kulağı" (unnatural construction)
  replaced with "İngilizce Kulak Eğitimi" — the term the page's own reviewed
  description and FAQ copy already use — in title/og/twitter and
  LearningResource name. Tagline "Önce sesi ayır, sonra daha net konuş" kept.
  Visible breadcrumb/H1 and two cross-page link texts deferred (coupling).
- **hi-ur hubs:** metadata spelling standardized on nuqta forms (अंग्रेज़ी) in
  head metadata and LearningResource JSON-LD on both hubs, matching the
  Hindustani register target. Breadcrumb/H1/FAQ/body deferred (coupling).

No pair-page, English homepage/hub, canonical, hreflang, sitemap, URL,
structured-data-architecture, analytics, or exercise changes.

## Deferred Localized Metadata Experiments (post-baseline only)

Do not start these until the first Search Console baseline exists and shows
query-level evidence:

- **Populate localized homepage `seoTitle`/`seoDescription`.** The architecture
  landed 2026-07-14 (above); the 14 per-locale strings have not been written.
  Write them per locale as reviewed native-quality copy (brand +
  category-keyword; several current hero-coupled titles run 73–84 chars and
  truncate), gated on baseline query evidence per locale.
- **Hub brand-suffix experiments.** The default policy is decided (no suffix on
  localized hubs). Revisiting a specific locale requires the three conditions
  in `docs/seo-page-creation-guide.md` ("Hub title policy") — branded-query
  evidence first.
- **Deferred visible-copy parity fixes (coordinated body-copy changes, not
  metadata edits).** Each couples visible breadcrumb + BreadcrumbList JSON-LD +
  H1/FAQ/body across pages that reuse the hub breadcrumb label, so each is its
  own reviewed change:
  - vi: "luyện tai nghe" → "luyện nghe phân biệt âm" (breadcrumb/H1/body on
    `/vi/english-ear-training/` and every vi page reusing the label).
  - ko: 변별 → 구분 in visible breadcrumb/H1/FAQ/body on both hubs and pages
    reusing the labels.
  - tr: "İngilizce Dinleme Kulağı" → "İngilizce Kulak Eğitimi" in visible
    breadcrumb/H1 plus link texts on `/tr/minimal-pairs-practice/` and
    `/tr/ship-vs-sheep/`.
  - hi-ur: अंग्रेजी → अंग्रेज़ी in visible breadcrumb/H1/FAQ/body on both hubs
    (and review pair-page body copy for the same mix).

## Reuse for Future Sound-Family Clusters

This framework is written to generalize, not to be rewritten per cluster:

1. **One framework, one measurement model, applied per cluster.** A 5th sound family does not get its own document — it gets new rows in the existing `docs/seo-page-conversion-matrix.md` (already the source-of-truth pattern for "is this page's funnel wired," enforced by `npm run validate:seo-conversion-matrix`) and is reported through the same `organic arrival → exercise_start → exercise_complete → app_store_click` model at the same three levels (URL, locale, contrast-cluster).
2. **English and localized pages are always one cluster.** Any future sound family that ships with localized variants should be measured the same way this one is: rolled up by contrast across all locales, with per-locale and per-URL breakdowns used only for diagnosis.
3. **`cta_position` is now a standing convention**, not a one-off fix. Any new SEO page template with an App Store CTA should carry a `data-cta-position` attribute (`hero`, `mid-content`, `post-exercise-footer`, or a new value if the page introduces a genuinely new CTA placement) from the start, so this breakdown doesn't need to be retrofitted again.
4. **The expansion gate is the same gate every time:** contrast-cluster-level funnel evidence, not traffic, decides whether to move to the next cluster.
