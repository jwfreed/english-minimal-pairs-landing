# Experiment Design — Practice/Task Intent
2026-09-22 · baseline: `seo/snapshots/2026-09-22.json` · deployed `9324c48`

**Phase mapping: this is NOT a SEO-GOD phase.** The skill offers setup/audit/measure/ai_visibility/
schedule plus `act` (a daily regression-and-quick-wins loop). None is a controlled-experiment
framework, and forcing this into `act` would let a daily loop mutate an experiment mid-flight. Run
it as standalone work anchored to the MEASURE baseline.

---

## 0. What is already settled — do not re-test

Testing on existing observational data (GA4 organic, 2026-08-24→09-20, Fisher exact two-tailed):

| Metric | Definitional pair pages | Task/hub pages | p | Effect |
| --- | --- | --- | --- | --- |
| session → `app_store_click` | 6/95 (6.3%) | 19/59 (32.2%) | **0.000065** | **5.1x** |
| engagement rate | 46/95 (48%) | 43/59 (73%) | **0.0041** | 1.5x |

**The "materially more useful acquisition" half of the hypothesis is already supported at
significance.** Combined with CTR by intent class (0.06% vs 6.25%) and the AI Overview observation,
the quality claim holds at three independent levels.

Limits: observational, not randomized. Visitors self-select — someone searching "minimal pairs
practice" wants a tool, which *is* the hypothesis but also means intent and page type cannot be
separated. Absolute counts are small (19 and 6 conversions). Per-page rates are unstable
(`/tr/english-ear-training` shows 3 events on 1 session).

**Therefore the only open question worth an experiment is: can task-intent exposure be GROWN?**
Quality is established; reach is not. 64 task-intent impressions vs 7,767 definitional.

---

## 1. Exact hypothesis

> **H1 (exposure):** An existing definitional pair page re-framed to promise a practice/listening
> task, rather than an answer, will increase click-through from its existing impression pool —
> because an AI Overview can deliver an answer but cannot deliver an exercise.

> **H0:** Re-framing produces no CTR change. The impressions are structurally dead regardless of
> what the result promises.

Deliberately *not* tested (already supported): that task-intent visitors convert better.

---

## 2. Surfaces

| Role | Page | 28d impressions | CTR | Pos | Sessions | ASC |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| **Treatment** | `/man-vs-men/` | 2,898 | 0.21% | 9.9 | 6 | 1 |
| **Control A** | `/bad-vs-bed/` | 1,902 | 0.11% | 6.9 | — | — |
| **Control B** | `/bet-vs-bat/` | 1,870 | 0.21% | 7.8 | — | — |
| **Positive reference** (not a control) | `/minimal-pairs-practice/` | 446 | 4.04% | 14.8 | 27 | 7 |
| **Excluded** | Class-1 cluster | 7,927 | 0.35% | 6.9 | 31 | 2 |

`/man-vs-men/` is chosen because it is the largest dead pool on the site (2,898 impressions, 1,517
of them on the single query `man vs men` at 0 clicks) **and** has the worst engagement rate of any
page (0.17). It is currently producing almost nothing, so downside is minimal.

Controls are matched on profile (definitional pair, 1,800–1,900 impressions, comparable position)
and left **completely untouched**.

### `/minimal-pairs-practice/` is a positive *reference*, not a like-for-like control

Revised 2026-09-22 on direct GA4 evidence. It **mounts no exercise** (0 `data-exercise`), yet as a
*landing page* it produced 6 `exercise_start`, 3 `exercise_complete` and 7 `app_store_click`, while
as a *pagePath* it produced 0 starts and 0 completes.

It functions as a **funnel entrance**: visitors land there, navigate into pair pages, practice
there, and convert. The treatment page is the opposite shape — a destination whose entire pitch is
its own on-page exercise.

Consequences for analysis:

- It is a valid reference for **CTR by intent class** (the H1 question).
- It is **not** a like-for-like control for downstream conversion, because its conversions are not
  produced by on-page engagement. Do not compare treatment session→`app_store_click` against it as
  though the two mechanisms were the same.
- The earlier 5.1x task-vs-definitional conversion gap therefore does **not** show that exercise
  engagement drives conversion. Those pages convert with no exercise present. The gap is about
  visitor intent, not about the exercise.

### `landingPage` vs `pagePath` — preserve the distinction throughout

Every downstream figure must state which dimension produced it. They answer different questions and
disagree substantially on exactly the pages that matter:

| Dimension | Answers | Use for |
| --- | --- | --- |
| `pagePath` | where the event fired | on-page engagement with the treatment's exercise |
| `landingPagePlusQueryString` | where the session began | acquisition quality of the entry point |

Reporting either alone is misleading. `/minimal-pairs-practice/` reads as 0 engagement by
`pagePath` and as the site's best entrance by `landingPage`; both are true.

Class-1 is excluded entirely, per the constraint on the active conversion experiment.

---

## 3. Proposed change — one page, three fields

On `/man-vs-men/` only. From *answer* framing to *tool* framing:

| Field | Now | Proposed direction |
| --- | --- | --- |
| `<title>` | Man vs Men Pronunciation: Hear the Difference \| English Listening Practice | Lead with the exercise: a listening test for /æ/ vs /ɛ/, not a promise to explain |
| `meta description` | Learn the difference between man and men. Practice the English /æ/ and /ɛ/ vowel sounds with minimal pair listening exercises. | Open with the interactive task and what the listener does, not "learn the difference" |
| `<h1>` | (matches title framing) | Align with the task framing |

Exact copy to be drafted and approved before implementation. Constraints: no new claims, no
accent-fixing or guarantee language, keep the phonemic notation (search-relevant), preserve
contrast-first terminology per `AGENTS.md`.

**Nothing else changes.** No body content, no links, no schema, no exercise code.

---

## 4. Metrics

**Primary — GSC, treatment page:**
1. CTR on `/man-vs-men/` (pre vs post, vs controls)
2. Impressions on task-intent queries (`practice|exercise|listen|training|quiz|test`) for that page

**Secondary — GA4:**
3. Organic sessions to `/man-vs-men/`
4. Engagement rate
5. `exercise_start`, `exercise_complete` — **read directly from the GA4 Data API**, not via OpenSEO,
   and **without** marking them key events
6. `app_store_click`

**Guardrail:** average position on `/man-vs-men/`. A title change can shift rankings; if position
degrades materially, CTR changes are not attributable to framing.

The 23 tracked keywords stay a visibility/regression monitor and are **not** a success metric.

---

## 5. Observation period and evidence threshold

Power at `/man-vs-men/`'s 2,898 impressions/28d, baseline CTR 0.207%, α=0.05, 80%:

| Detectable lift | Impressions needed/arm | Weeks |
| --- | ---: | ---: |
| 10x (2.07%) | 508 | 0.7 |
| 5x (1.04%) | 1,412 | 1.9 |
| **3x (0.62%)** | **3,775** | **5.2** |
| 2x (0.41%) | 11,337 | 15.6 |

**Minimum run: 6 weeks. Preferred: 8.** Powered to detect ≥3x; explicitly *not* powered for 2x, and
a null result must be reported as "no effect ≥3x detected", never "no effect".

Add ~2 weeks before the clock starts for recrawl/reindex of the changed page. Confirm via GSC URL
inspection that the new title is indexed before counting day 1.

---

## 6. Confounders and stopping rules

**Confounders:**
1. **Framing vs demand type are conflated.** This tests whether *presentation* can harvest an
   impression pool — not whether demand type matters. The latter is already established (§0).
2. **Ranking drift.** Guardrail metric above.
3. **AI Overview volatility.** Presence may change independently during the window; re-check the
   SERP at start, midpoint, end.
4. **Geography.** SERP observation was Thailand-only; impressions are mostly USA/India.
5. **Seasonality.** Controls absorb this — they are the reason controls exist.
6. **Tiny downstream counts.** 6 sessions/28d on the treatment page. Secondary metrics will likely
   stay underpowered even at 8 weeks; they are directional only.

**Stopping rules:**
- **Stop early for harm:** treatment CTR falls below 50% of baseline for 2 consecutive weeks, or
  position degrades >3 places sustained → revert.
- **Stop early for success:** ≥5x lift reached with ≥1,412 impressions and controls flat.
- **Do not stop on a good week.** Minimum 6 weeks unless a stop rule fires.
- **Freeze:** no other change to treatment or control pages for the duration.

---

## 7. Outcome interpretation

| Outcome | Reading | Action |
| --- | --- | --- |
| Treatment CTR ↑ ≥3x, controls flat | Framing harvests dead impressions; AI Overview interception is beatable by promising what AI can't deliver | Roll the framing to the other 16 Class-2 pair pages |
| Treatment ↑, controls ↑ too | Site-wide or seasonal effect, not the intervention | No roll-out; investigate common cause |
| No change (≥3x not detected) | **This framing intervention, on this page, under these conditions, produced no detectable ≥3x CTR effect.** Nothing more | Weighs **strongly against rolling this framing tactic** to the other 16 pair pages. Does **not** on its own justify ending investment in definitional pair pages generally |
| Treatment CTR ↑ but sessions don't convert | Clicks bought with a promise the page doesn't keep | Revert; the framing misrepresents the page |
| Position degrades | Confounded; inconclusive | Revert, re-run with title length held constant |

### Scope of a null result — read this before acting on one

A null means exactly: **no ≥3x CTR effect was detected from this framing intervention on
`/man-vs-men/` under these experiment conditions.**

It is legitimate evidence against **this tactic** — one page, three metadata fields, definitional
impression pool — and should weigh strongly against rolling that framing across the remaining pair
pages.

It does **not** establish any of the following, and must not be cited for them:

- that definitional pair pages have no value (they may rank, hold topical coverage, feed internal
  links to the hub, or earn AI Overview citations regardless of clicks);
- that all investment in definitional pair pages should stop;
- that no *other* intervention on those pages would work — body content, schema, a different
  framing, or a different page were never tested;
- that the result generalises beyond `/man-vs-men/`, a page deliberately chosen as an outlier
  (largest dead pool, worst engagement rate on the site);
- that a smaller-than-3x effect is absent. The design is not powered below 3x.

A null narrows one tactic. It does not close the strategic question.

---

## 8. Smallest production change

**One file: `content/pairs/man-vs-men/index.html` — three fields (`<title>`, meta description,
`<h1>`).**

Not touched: body content, exercise mount, internal links, schema, analytics, canonical, hreflang,
any other page, Class-1, the positive control, `vite.config.js`, `public/sitemap.xml`.

Gate: `npm test && npm run build` must exit 0. Deploy via the normal push-to-main flow, with
explicit approval, as a separate bounded commit.

**Prerequisite, no production change:** direct GA4 Data API access for `exercise_start` /
`exercise_complete` by landing page. Without it the middle funnel stays invisible and secondary
metrics 5 cannot be collected. This is measurement tooling, outside the experiment's production
surface.
