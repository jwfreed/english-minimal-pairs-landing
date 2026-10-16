# SEO Growth Execution Tracker

Canonical state record for the October 2026 SEO growth cycle. One owner
updates it: the orchestrating agent. Delegated agents report to it and do
not edit this file.

Audit evidence lives in `/tmp/soundwise-seo-audit-2026-10-16/` (`report.md`,
`measurement-2026-10-16.md`, CSVs). This file does not duplicate it. `/tmp`
is not durable, so the baseline figures this cycle depends on are copied
below.

## Objective and scope

Increase qualified organic exercise engagement and, eventually, App Store
acquisition without adding pages or making measurement ambiguous.

In scope: funnel measurement integrity (P0), earlier practice access on
`/minimal-pairs-practice/` (P1), a small evidence-backed snippet batch (P1),
a read on the Russian ship/sheep page (P2), and rollout feasibility for
earlier practice on English contrast pages (P2, analysis only).

Out of scope: new pages or L1 routes, broad content expansion, exercise
rebuilds, new analytics infrastructure, OAuth changes, and deployment
without explicit approval.

## Baseline

Pulled 2026-10-16. Windows: current 2026-09-16 → 2026-10-13, previous
2026-08-19 → 2026-09-15, both 28 days. GSC `dataState=final`; GA4 property
`536565930`, channel = Organic Search.

| Metric | Prior baseline | Previous | Current |
| --- | --- | --- | --- |
| GSC clicks | 139 (Aug 23–Sep 19) | 130 | 135 |
| GSC impressions | — | 25,951 | 28,136 |
| GSC CTR | — | 0.501% | 0.480% |
| GA4 organic sessions | 166 | 153 | 157 |
| Sessions with `exercise_start` | 15 | 13 (8.5%) | 23 (14.6%) |
| Sessions with `exercise_complete` | 8 | 7 (4.6%) | 8 (5.1%) |
| Sessions with `app_store_click` | 22 (definition unverified) | 19 (12.4%) | 16 (10.2%) |
| Event counts start / complete / store | — | 14 / 8 / 21 | 36 / 17 / 22 |

Definitions: "sessions with X" is the GA4 `sessions` metric filtered to
`eventName = X`, so each session counts once per event type. Event counts
are secondary and are never conversions.

Known limitations:

- About 150 organic sessions per window; per-page rates are not interpretable.
- The GSC query export covers 38% of impressions and 16% of clicks in the
  current window. Intent splits describe exported rows only.
- Starts 13 → 23 is not significant (z ≈ 1.5, p ≈ 0.13).
- Russia accounts for most click growth (13 → 31); excluding Russia, clicks
  fell 117 → 104.
- OpenSEO's GA4 link is broken (`ga4_reconnect_required`). GA4 reads use
  `.seo-god/ga4-report.py`.
- Installs and in-app behavior are not observable from this repository.

## Workstream tracker

<!-- TRACKER:START -->
| ID | Pri | Status | Agent / model | Depends on | Files | Acceptance | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P0-MEASURE | P0 | DONE | Subagent, Sonnet; Opus code review | — | `docs/analytics-and-attribution.md` ("Session-Based Reporting Definitions"); no source changes | Event triggers verified; session definitions documented; defects fixed or blocked; comparability stated | Start fires on the Start click; complete fires after round 2 plus the final replay (`src/exercise-engine.js` `answer()`). No demonstrated defect. The 23 → 8 gap is mostly real abandonment: the 15 start-only sessions logged about 21 s of engagement combined. GA4 `runFunnelReport` works: 23 start → 8 complete → 3 later store clicks (closed, organic). No instrumentation change, so the baseline stays comparable. Latent undercount risk: see blockers. |
| P1-HUB | P1 | DONE (not deployed) | Subagent, Sonnet; Opus review | — | `content/pairs/minimal-pairs-practice/index.html` (+8 lines) | Three contrast-led links after the definition; links and exercises verified; mobile and keyboard checked; metadata, URLs and events unchanged | Reuses `sound-list`/`ipa`; no CSS or JS. IPA matches `CONTRAST_CATALOG`; each destination mounts `[data-exercise]` with the matching contrast. Playwright at 390 px and 1280 px: no overflow, no console errors, Tab order correct. Build, tests and gates: see Verification. |
| P1-SNIPPET | P1 | DONE: no edits authorized | Haiku classified; Opus reviewed and re-derived | — | None | ≤5 evidence-backed candidates; only authorized edits; URLs and canonicals preserved | Only 8 pronunciation/practice query rows site-wide reach ≥40 combined impressions. Eligible pages show 13–39 impressions and 0 clicks. See decision log 2026-10-16. |
| P2-RU | P2 | DONE: OBSERVE | Subagent, Haiku; Opus spot-check | — | None | EXPAND / OBSERVE / DEPRIORITIZE with evidence | Page 4/106 → 24/1,100 clicks/impressions at position 4.8 → 5.0. Impressions-led, Russia-only, single page. 95% of impressions are anonymized. See EXP-RU-WATCH. |
| P2-ROLLOUT | P2 | DONE: recommend neither A nor B now | Subagent, Sonnet; Opus spot-check | EXP-HUB-1 readout; `conversion_serp_cta_v1` and `/man-vs-men/` tests closed | None (analysis) | A vs B compared; one recommendation; nothing implemented | 18 of 21 pair pages already have a first-viewport "Listen & Test Yourself" jump link (untracked). The smallest real change is moving the existing mount up on about 8 deep pages (mount 5,000–7,000 px down at 390 px). Neither A nor B is readable: a 10-point lift needs about 250 sessions per arm. If the preconditions hold, use A on those 8 deep, non-test pages with a pooled 12-week before/after readout. |
<!-- TRACKER:END -->

### Verification (2026-10-16, combined working tree)

- `npm test`: 200 passed, 0 failed.
- `npm run build`: exit 0, with pre and post validators. One pre-existing warning (localized → English fallback edges). The built `dist/minimal-pairs-practice/` contains the new block.
- `validate:landing-copy`, `validate:funnel-tracking`, `validate:app-store-tracking` and `validate:seo-conversion-matrix`: exit 0.
- `validate:localized` needs a `--page`; it was run for `ru/ship-vs-sheep` and passed. No localized page changed.
- Browser: Playwright on the preview build (P1-HUB evidence).

## Decision log

| Date | Decision | Rationale |
| --- | --- | --- |
| 2026-10-16 | Use native Claude subagents (Haiku, Sonnet); no Codex | The Codex CLI is installed, but no authorized in-session Codex integration exists. |
| 2026-10-16 | Exclude Class-1 pages (`/fill-vs-feel/`, `/live-vs-leave/`, `/ship-vs-sheep/`, `/bit-vs-beat/`), `/man-vs-men/` and `/minimal-pairs-practice/` from snippet edits | Class-1 pages are the controlled measurement surface; `/man-vs-men/` has an unfinished title test (recrawled 2026-10-01); the hub's metadata must stay fixed during its on-page change. |
| 2026-10-16 | Authorize no title or description edits this cycle | The best eligible row, `bat vowel` on `/bet-vs-bat/`, fell from 415 to 25 impressions at position ~11, which is volatility plus phonetics-reference intent. Other eligible pages have under 40 impressions and 0 clicks. Large zero-click pools (`right and light` 167, `cap or cup` 141) are ambiguous bare-pair queries. The rows that clear the bar (`live vs leave pronunciation` 93 impr / 2 clicks, `fill vs feel pronunciation` 68 / 0) are on Class-1 pages. Revisit when an eligible page has ≥100 pronunciation/practice impressions in one window. |
| 2026-10-16 | Hub links reuse the existing `sound-list` style and sit directly above the Examples list | This is the smallest reversible change. Known limitation: ship/sheep and bad/bed also appear in the Examples list just below. Example links stay, to preserve internal-link semantics. |
| 2026-10-16 | No P0 code fix; document session-based definitions in `docs/analytics-and-attribution.md` | No defect demonstrated. Changing completion timing now would break comparability with the 2026-07-14 baseline in the middle of EXP-HUB-1. |
| 2026-10-16 | Broader practice-first rollout deferred | Neither all-at-once nor staged rollout is readable at current traffic, and the open experiments (`conversion_serp_cta_v1`, `/man-vs-men/`, EXP-HUB-1) would confound it. Needs separate approval. |
| 2026-10-16 | Russian ship/sheep: OBSERVE; no new Russian content | The growth is impressions-led at a stable position, and CTR fell from 3.8% to 2.2%. Observed queries cover only 4.9% of impressions and skew toward translation intent (37% of observed impressions, 0 clicks). 24 of 26 GA4 sessions are from Russia. Other Russian routes are flat. |

## Experiment register

### EXP-HUB-1: Earlier practice choice on `/minimal-pairs-practice/`

| Field | Value |
| --- | --- |
| Hypothesis | Visitors who land on the hub are more likely to start a real listening exercise when three supported practice links appear right after the definition. |
| Baseline | Hub-landing organic sessions with `exercise_start` later in the session: 4/18 (current), 4/22 (previous). |
| Treatment | Three contrast-led links (/ɪ/–/iː/ ship/sheep, /ʊ/–/uː/ full/fool, /æ/–/ɛ/ bad/bed) after the definition paragraphs. |
| Deployment date | Not deployed |
| Primary metric | Hub-landing organic sessions with ≥1 `exercise_start` ÷ hub-landing organic sessions |
| Secondary metrics | Same denominator with `exercise_complete`; with `app_store_click`; GSC clicks/CTR for the hub; device split |
| Evaluation period | 8 weeks after verified deployment, at most 12 |
| Confounders | Query, country and device mix; ranking changes; destination-page changes; small n (about 20 sessions per 28 days); returning visitors. `/ship-vs-sheep/` is a frozen `conversion_serp_cta_v1` route, and the hub was already linked to it twice. A third link adds a little hub-referred traffic there; landing-page metrics for that experiment are unaffected, but `pagePath` metrics are not. |
| Outcome | Pending |
| Decision | Pending. This change is directional. A significance test is not achievable at this traffic. |

### EXP-RU-WATCH: `/ru/ship-vs-sheep/` organic growth (observation, no treatment)

| Field | Value |
| --- | --- |
| Hypothesis | The impression step-up that began around Sep 13–16 reflects durable Russian-speaker demand for /ɪ/–/iː/ listening practice. |
| Baseline | Previous: 4 clicks / 106 impressions, position 4.8. Current: 24 / 1,100, position 5.0. |
| Treatment | None. Confounder: exercise mount and CTA enabled 2026-09-26 (`23d7379`), so exercise comparisons against the previous window are not like for like. |
| Evaluation | Two consecutive clean 28-day windows starting 2026-10-14 |
| Expand if | ≥20 clicks per window at CTR ≥2% and ≥25 impressions/day in both windows, and observed queries shift toward pronunciation/listening |
| Deprioritize if | <8 impressions/day or <8 clicks per 28 days |
| Outcome | Pending (first readout after 2026-11-10 plus ~3 days GSC lag) |

## Current blockers

| Blocker | Next action |
| --- | --- |
| EXP-HUB-1 is implemented but not deployed | The owner approves a commit and push to `main` (deploys via GitHub Pages). Then record the deploy date and commit here and start the 8-week window. |
| Latent completion undercount: `exercise_complete` waits for the final replay to settle, so a browser that fires neither `onend` nor `onerror`, or a learner who leaves during the ~2 s replay, produces a summary screen without the event | Owner decision. The ordering is asserted on purpose (`scripts/exercise-engine.test.mjs`) and gates the summary CTA. A fix would be a measurement discontinuity, so it should not ship during EXP-HUB-1 unless it is recorded here as one. |
| OpenSEO's GA4 link is broken (`ga4_reconnect_required`) | The owner reconnects Analytics in OpenSEO when needed. The Python GA4 path works meanwhile. |

## Next action

Get owner approval to deploy EXP-HUB-1 (the only shippable change in this
cycle), then record the deployment date. Make no other page changes until the
hub readout, so the readout stays attributable.
