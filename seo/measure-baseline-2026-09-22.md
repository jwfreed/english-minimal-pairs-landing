# MEASURE Baseline — 2026-09-22

Deployed baseline: commit `9324c48` (footer heading fix live).
Post-AUDIT crawl: `ef8aa623-fff6-4506-9cdb-425fab1259e9` (111/111 pages).

**FACT** = measured. **INTERPRETATION** = inference drawn from it, explicitly labelled.

---

## 1. Measurement period and sources

| Source | Property | Window | Status |
| --- | --- | --- | --- |
| Google Search Console | `sc-domain:getsoundwise.co` (Domain) | 2026-08-22 → 2026-09-19 (29 days) | Connected, verified |
| Google Analytics 4 | `Soundwise - getsoundwise.co` (`536565930`) | 2026-08-24 → 2026-09-20 | Connected, partial |
| OpenSEO site audit | `ef8aa623` | 2026-09-22 | 111/111 pages |

Scopes: `webmasters.readonly`, `analytics.readonly` only. Account `jon.freed@gmail.com`.

**The two windows do not align** (GSC ends 09-19, GA4 ends 09-20) and are not directly
subtractable. Both predate or barely overlap the `9324c48` deployment, so **none of this is
post-heading-fix data.** It is the pre-fix baseline against which the fix will later be measured.

---

## 2. Class-1 pages, individually (FACT)

| Page | Clicks | Impressions | CTR | Avg pos | GA4 organic sessions | app_store_click |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `/fill-vs-feel/` | 5 | 2,493 | 0.20% | 6.4 | 8 | 2 |
| `/live-vs-leave/` | 8 | 2,331 | 0.34% | 8.0 | 7 | 0 |
| `/ship-vs-sheep/` | 4 | 457 | 0.88% | 8.6 | 4 | 0 |
| `/bit-vs-beat/` | 11 | 2,646 | 0.42% | 6.2 | 12 | 0 |

Top queries are precisely on-intent — `fill vs feel` (103 impr, pos 4.9), `live vs leave` (249
impr, pos 7.6), `beat or bit` (103 impr, pos 4.3). These are the right queries, not accidental
traffic.

**INTERPRETATION:** `/ship-vs-sheep/` is the anomaly — 457 impressions against ~2,500 for its
siblings, despite "ship vs sheep" being the canonical minimal pair. Its own-name queries rank
poorly (`ship sheep` pos 13.9, `ship and sheep` pos 20.3). Locale variants (`/ja/`, `/ru/`, `/zh/`)
also surface for these queries but at negligible volume (3–4 impressions each), so cannibalisation
does not explain the gap. Cause unestablished.

---

## 3. Class-1 cluster (FACT)

| Metric | Value |
| --- | --- |
| Clicks | 28 |
| Impressions | 7,927 |
| CTR | 0.35% |
| Avg position (impression-weighted) | 6.9 |
| Share of site impressions | 29.6% |
| Share of site clicks | 19.9% |
| GA4 organic sessions | 31 |
| app_store_click | 2 |

---

## 4. Conversion-funnel evidence

### Measured (FACT)

```
organic sessions (31) → exercise_start (NOT MEASURABLE) → exercise_complete (NOT MEASURABLE) → app_store_click (2)
```

Site-wide GA4: `app_store_click` = 26 events / 22 users. It is the only key event with data.

Class-1 detail: `/fill-vs-feel/` 8 sessions → 2 app_store_click. The other three Class-1 pages
produced **0** app_store_click on 23 combined sessions.

### The middle of the funnel cannot be measured (FACT)

`exercise_start` and `exercise_complete` are **not retrievable through OpenSEO.** Its GA4 surface
exposes key events only — `get_google_analytics_key_events` is the sole event-level tool and filters
to key events; none of the nine GA4 tools accepts an arbitrary event-name parameter. Verified
against every schema, not inferred.

This is a tooling limit, **not** an instrumentation defect. The instrumentation is correct and live:

- `src/funnel-tracking.js:11,20` emit `exercise_start` / `exercise_complete`
- `src/seo-page.js:611` and `src/main.js:1020` emit `app_store_click`
- Parameters verified present in the **deployed** bundle at `9324c48`: `exercise_id`, `pair_name`,
  `sound_contrast`, `learner_language`, `experience_surface`, `page_slug`, `cta_position`,
  `exercise_completed`, `content_variant`

`exercise_completed` rides on `app_store_click`, so completion→intent linkage exists in the data —
it simply cannot be read through this tool.

**Sample size: far too small for conclusions.** 31 Class-1 sessions and 2 conversions over 28 days
cannot distinguish a real conversion rate from noise. No funnel claim is supportable today.

---

## 5. Strongest Class-2 opportunities (FACT)

| Page | Clicks | Impressions | CTR | Pos |
| --- | ---: | ---: | ---: | ---: |
| `/man-vs-men/` | 6 | 2,898 | 0.21% | 9.9 |
| `/bad-vs-bed/` | 2 | 1,902 | 0.11% | 6.9 |
| `/bet-vs-bat/` | 4 | 1,870 | 0.21% | 7.8 |
| `/cap-vs-cup/` | 3 | 1,689 | 0.18% | 8.1 |
| `/three-vs-tree/` | 3 | 1,376 | 0.22% | 8.7 |
| `/minimal-pairs-practice/` | 18 | 446 | **4.04%** | 14.8 |

**INTERPRETATION:** `/man-vs-men/` carries more impressions than any Class-1 page and outranks
none of them on CTR — `man vs men` alone is 1,517 impressions, 0 clicks, position 9.8. It is the
largest single pool of unconverted demand on the site.

`/minimal-pairs-practice/` is the inverse and the most informative page on the site: the **worst
average position (14.8)** paired with **by far the best CTR (4.04%)** and the most clicks (18) and
GA4 sessions (27) of any page. A hub page at position 15 outperforms every pair page at position 6.

---

## 6. L1 / international observations (FACT)

| Locale | Pages | Clicks | Impressions | CTR | Avg pos |
| --- | ---: | ---: | ---: | ---: | ---: |
| ru | 3 | 13 | 329 | 3.95% | 5.0 |
| zh | 4 | 0 | 164 | 0.00% | 10.6 |
| ko | 4 | 4 | 141 | 2.84% | 8.4 |
| yue | 4 | 1 | 129 | 0.78% | 8.7 |
| es | 4 | 3 | 114 | 2.63% | 11.9 |
| ja | 4 | 5 | 106 | 4.72% | 7.1 |
| vi | 4 | 3 | 87 | 3.45% | 10.4 |
| fa | 3 | 0 | 50 | 0.00% | 7.7 |
| hi-ur | 3 | 0 | 49 | 0.00% | 10.1 |
| pt | 4 | 1 | 47 | 2.13% | 9.8 |
| id | 4 | 0 | 41 | 0.00% | 7.4 |
| th | 3 | 0 | 38 | 0.00% | 4.8 |
| ar | 3 | 1 | 30 | 3.33% | 5.1 |
| tr | 4 | 1 | 22 | 4.55% | 7.5 |
| **Total** | **51** | **32** | **1,347** | **2.38%** | — |

All 14 locales have GSC rows — none is invisible.

**The headline ratio: locale routes are 5.0% of impressions but 22.7% of clicks.**

**INTERPRETATION:** judged as acquisition surfaces rather than as pair pages, the L1 routes are the
efficient part of the site. Their 2.38% CTR is roughly 10x the English pair pages'. `ru` and `ja`
are the standouts. Zero-click locales (`zh`, `fa`, `hi-ur`, `id`, `th`) sit at 38–164 impressions —
too small to call underperformance rather than insufficient exposure.

Country context: usa 5,632 impr / 23 clicks (0.4%); **ind 3,227 impr / 4 clicks (0.1%)**; rus 393 /
14 (3.6%); jpn 259 / 7 (2.7%). Device: mobile 18,086 impr at 0.4% CTR, desktop 8,379 at 0.8%.

---

## 7. The finding that reframes everything (FACT)

CTR by position band, query-level:

| Position band | Queries | Impressions | Clicks | CTR |
| --- | ---: | ---: | ---: | ---: |
| 1–3 | 64 | 232 | 1 | 0.43% |
| 4–10 | 367 | 9,457 | 17 | 0.18% |
| 11–20 | 98 | 1,053 | 3 | 0.28% |
| 21+ | 147 | 365 | 1 | 0.27% |

**657 of 676 queries (97%) produced zero clicks**, carrying 10,030 impressions (37.4% of total).
The ten largest queries by impressions carry 3,905 impressions and **2 clicks** between them.

**INTERPRETATION:** CTR is flat at ~0.2–0.4% *regardless of rank*. Ranking better does not produce
clicks here — position 1–3 performs no better than position 21+. Published CTR curves would predict
roughly 2–8% at position 4–10; the site records 0.18%, which is 10–40x below expectation.

This is not a ranking problem, and therefore not a problem more pages or better positions would
solve. The most probable explanations, **none of which is established by this data**:

1. SERP answer capture — AI Overviews or featured snippets resolve "X vs Y" queries in-SERP.
2. Title/description not earning the click.
3. The queries are definitional, and a searcher asking "bad or bed" wants a one-line answer, not a
   listening exercise.

Distinguishing these requires SERP inspection, which the free path cannot do (no DataForSEO, and
the skill forbids scraping Google). `/minimal-pairs-practice/` at 4.04% is the counter-example
worth studying: a page whose query intent ("minimal pairs practice") *requires* a visit.

---

## 8. Data quality and limitations

1. **Performance UNMEASURED.** Lighthouse failed 20/20 in both the pre-fix and post-fix crawls —
   reproducible, not transient. Performance is not clean; it is unknown.
2. **Middle funnel unmeasurable** through OpenSEO (section 4).
3. **Sample size.** 141 site clicks and 26 app_store_click in 28 days. Class-1 has 31 sessions and
   2 conversions. Nothing here supports a conversion-rate claim.
4. **Window mismatch.** GSC 08-22→09-19; GA4 08-24→09-20. Not subtractable.
5. **All data predates `9324c48`.** No post-fix effect is present or claimable.
6. **DataForSEO absent** — no keyword volume, no SERP features, no per-locale market scoring for
   any route including English.
7. **GSC query anonymisation.** Locale pages show 32 clicks in aggregate but ~0 in page+query rows;
   low-volume queries are withheld. Locale query lists are therefore incomplete by design.
8. **`thin-content` / `meta-description-too-short` remain false positives** for ja/zh/th/yue
   (whitespace tokenisation; Latin-calibrated length thresholds). Carried forward, unactioned.
9. **Earlier correction:** a first pass matched Class-1 pages with `endswith`, which also captured
   `/ja/ship-vs-sheep/` etc. Table in section 2 uses exact path matching. The erroneous intermediate
   figures (e.g. `/ship-vs-sheep/` at 3.05% CTR) were never recorded anywhere but chat.

---

## 9. Snapshot artifacts

| File | Contents |
| --- | --- |
| `seo/snapshots/2026-09-21.json` | Pre-fix crawl (151 issues), `gsc.available: false` |
| `seo/snapshots/2026-09-22.json` | Post-fix crawl (70 issues), `gsc.available: true`, 141 clicks / 26,802 impressions, top 50 queries |

Audit delta, independently confirming the AUDIT phase: **151 → 70 issues.**
`heading-order-skip` 80 → **0**. `slow-response` 1 → **0** (the `/thin-vs-tin/` 1,639ms reading did
not recur, vindicating the decision not to optimise from a single observation).

---

## 10. Evidence-backed implications

**What the evidence supports:**

1. **The bottleneck is CTR, not rank or coverage.** 26,802 impressions at average position 7.9
   yielding 141 clicks is a click-through failure. Flat CTR across all position bands is the proof.
2. **Diagnose before acting.** Whether this is AI Overview capture, weak titles, or intent
   mismatch is currently undetermined, and the three have opposite remedies. Manually inspecting
   the SERP for `man vs men`, `bad or bed` and `live vs leave` is the cheapest next step.
3. **`/minimal-pairs-practice/` is the highest-value page to understand**, not necessarily to
   change: worst position, best CTR, most clicks and sessions.
4. **L1 routes earn continued investment on their own terms** — 5% of impressions, 23% of clicks.

**What the evidence does NOT support:**

- Expanding to new pair pages. 17 existing exercise pages already hold thousands of impressions
  converting at ~0.2%. More pages would add impressions to a funnel that does not convert them.
- Any claim about exercise engagement or completion. Unmeasurable today.
- Rewriting Class-1 titles as an SEO fix while they are the controlled conversion experiment.
- Treating the heading fix as having improved anything. Not yet measurable.
