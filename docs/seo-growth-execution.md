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
| P1-HUB | P1 | DONE (deployed 2026-10-16, `76e3de3`) | Subagent, Sonnet; Opus review | — | `content/pairs/minimal-pairs-practice/index.html` (+8 lines) | Three contrast-led links after the definition; links and exercises verified; mobile and keyboard checked; metadata, URLs and events unchanged | Reuses `sound-list`/`ipa`; no CSS or JS. IPA matches `CONTRAST_CATALOG`; each destination mounts `[data-exercise]` with the matching contrast. Playwright at 390 px and 1280 px: no overflow, no console errors, Tab order correct. Build, tests and gates: see Verification. |
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
| Deployment | Commit `76e3de3` pushed 2026-10-16T12:53:09Z; GitHub Actions run 38903696440 succeeded 2026-10-16T12:53:49Z. Treatment exposure starts at that time; it is not backdated. |
| Primary metric | Hub-landing organic sessions with ≥1 `exercise_start` ÷ hub-landing organic sessions |
| Secondary metrics | Same denominator with `exercise_complete`; with `app_store_click`; GSC clicks/CTR for the hub; device split |
| Evaluation period | Treatment window: GA4 dates 2026-10-17 to 2026-12-11 (8 weeks of full days; 2026-10-16 is partly exposed and excluded). Extend to at most 2027-01-08 (12 weeks) if n is too small. Baseline: the two 28-day windows above, which end before deployment. Checkpoint 1: 2026-11-13 (4 weeks, sanity check only, no decision). |
| Confounders | Query, country and device mix; ranking changes; destination-page changes; small n (about 20 sessions per 28 days); returning visitors. `/ship-vs-sheep/` is a frozen `conversion_serp_cta_v1` route, and the hub was already linked to it twice. A third link adds a little hub-referred traffic there; landing-page metrics for that experiment are unaffected, but `pagePath` metrics are not. |
| Production verification (2026-10-16) | Live HTML contains the three links directly after the definition, before the Examples list; `/ship-vs-sheep/`, `/full-vs-fool/`, `/bad-vs-bed/` return 200; title and canonical unchanged; gtag instrumentation present and unchanged (no JS/CSS/event changes in the commit). Production browser check at 390 px and 1280 px was not rerun (no Playwright in the deploy session); preview-build checks are recorded under P1-HUB. |
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

### EXP-HUB-2 and EXP-LIVE-1: GSC-driven content edits

**Release authorization — 2026-10-23 (Asia/Bangkok):** the owner explicitly
requested committing and pushing all worktree changes. This supersedes the
earlier deployment deferral for this release and includes both copy changes
below plus the already-committed Google preferred-source button. The pending
states and checklists below describe the earlier hold; this authorization does
not imply that any experiment has closed or met its success criteria.

Use the successful GitHub Pages deployment's UTC timestamp as the new exposure
boundary, not the commit or authorization time. From that boundary, EXP-HUB-1
includes the later hub copy and preferred-source button; live/leave is a changed
SERP/CTA control. Preserve the original metrics, November 13 checkpoint and
December 11 endpoint, but report mixed exposure rather than attributing later
changes to the original treatments alone.

Release verification: 200 tests and the production build passed, along with
landing-copy, funnel-tracking, App Store tracking, SEO conversion matrix and all
14 localized exercise-page validations. Playwright verified the new FAQs,
390/1280 px layouts without horizontal overflow, the hub's ship/sheep link, and
live/leave exercise start, first-answer feedback and round continuation control.
Analytics collection was blocked during interactions; audio quality was not
independently assessed. Screenshots are in ignored `output/playwright/`.

Prepared 2026-10-21 on request, accepted, and held uncommitted in the working
tree. Deployment is deferred to protect the open experiments below. Each is an independent on-page
content experiment; neither changes titles, descriptions, canonicals, hreflang,
JS, CSS, or analytics events.

| Field | EXP-HUB-2 `/minimal-pairs-practice/` | EXP-LIVE-1 `/live-vs-leave/` |
| --- | --- | --- |
| Change | H2 `#start-here-title` reworded to name listening exercises; one intro paragraph (replaces the redundant "Choose a sound contrast…" line); FAQ "What is a minimal pairs listening test?" (visible + JSON-LD) | Meaning sentence in Quick Answer; note on adjective "live" /laɪv/ at the end of `#difference`; FAQ "What is the difference in meaning between live and leave?" (visible + JSON-LD) |
| GSC baseline (Jul 1–Sep 30) | 1,149 impr, 39 clicks, 3.4% CTR, pos 15.0. Practice/exercise cluster: "minimal pairs practice", "minimal pair practice", "minimal pairs listening exercises", "minimal pairs listening practice" | 12,932 impr, 23 clicks, ~0.2% CTR, pos 8.5. Meaning cluster ~1,614 impr / 1 click; difference cluster ~1,452 impr / 0 clicks |
| Primary metric | Organic clicks and position for the practice/exercise cluster; hub-landing organic session → `exercise_start` | Clicks and position for the meaning/difference cluster. Guardrail: pronunciation-query position and clicks |
| Deployment | Pending. Record commit and UTC time here; capture a fresh 28-day GSC baseline ending the day before deploy | Same |
| Confounders | Overlaps the EXP-HUB-1 observation window (checkpoint 2026-11-13, readout after 2026-12-11). The new intro text may itself raise clicks to pair pages, so a rise in hub-landing `exercise_start` can no longer be credited to EXP-HUB-1's three links alone. Read EXP-HUB-1 as "links plus later content edits" from the deploy date. | `/live-vs-leave/` is a control route for `conversion_serp_cta_v1` (CTA and exercise unchanged, copy only). Added copy and any ranking or traffic-mix shift contaminate that control from the deploy date. |

**Deployment dependencies**

- `/live-vs-leave/` must stay unchanged in production while it is a control for
  `conversion_serp_cta_v1` (with `/ship-vs-sheep/` and `/sit-vs-seat/`; treatment
  is `/bit-vs-beat/` and `/fill-vs-feel/`). EXP-LIVE-1 cannot deploy until that
  experiment is closed and recorded here.
- `/minimal-pairs-practice/` must stay unchanged in production until the
  EXP-HUB-1 readout (after 2026-12-11; extends to at most 2027-01-08 if n is
  too small). EXP-HUB-2 cannot deploy before then.
- The two are independent: neither depends on the other. Each can deploy as soon
  as its own gate clears.

**Commit `fe16804` (Google preferred-source button; local, unpushed)**

Reviewed read-only 2026-10-21; not reverted or modified. A Vite
`transformIndexHtml` plugin (`addPreferredSourceButton`, `vite.config.js`) adds
`news.google.com/swg/js/v1/publisher.js` (async) to `<head>` and a "Follow
Soundwise in Google Search" `<aside>` before `</article>` on every built page
whose route is in `SEO_PAGE_SLUGS`: 65 of 114 built HTML files, including all
five `conversion_serp_cta_v1` routes, `/ship-vs-sheep/`, the hub and many
localized routes. The homepage, legal and support pages are excluded. Plus 17
lines of CSS.

- Analytics: no GA4 event, parameter or `content_variant` change. The
  `app_store_click` listener only matches `a[href*="apps.apple.com"]` inside the
  exercise root, so the new block cannot fire it. No new tracked links.
  Validators and `npm test` pass with it in the build.
- SEO: no title, description, canonical, hreflang, sitemap or structured-data
  change. A direct ranking effect is not expected; this is unverified.
- Measurement: it is a site-wide, simultaneous change to treatment and control
  pages. It does not bias the `conversion_serp_cta_v1` treatment-vs-control
  comparison, but it is a new boundary for any before/after baseline, including
  EXP-HUB-1 (hub-landing sessions). Not live yet, so nothing is contaminated so
  far. Possible side effects that no existing metric isolates: a third-party
  script (page weight, load, layout shift at the foot of the article) and
  clicks on Google's button.
- Gap: `legal/privacy/` lists only App Store and analytics services. It does not
  name this Google script. Owner decision.
- Risk: any push of `main` ships it. Record its deploy date in this file as a
  measurement boundary for EXP-HUB-1 and `conversion_serp_cta_v1`.

**Verification limitations (2026-10-21)**

- Mobile (390 px) visual check incomplete: headless Chrome screenshots were
  clipped by its minimum window width, so they are not evidence. No horizontal
  overflow or tap-target check was done.
- Desktop (1280 px) was inspected on the hub only, not on `/live-vs-leave/`.
- No browser automation (no Playwright): the FAQ accordion toggle and exercise
  playback were not exercised by click. The live-vs-leave exercise mount was
  confirmed only in a headless DOM dump; the hub has no exercise mount.
- Audio playback was not tested.
- `validate:localized` was not run; localized pages were not changed.
- Passed: `npm test` (200), `npm run build`, `validate:landing-copy`,
  `validate:funnel-tracking`, `validate:app-store-tracking`,
  `validate:seo-conversion-matrix`, `validate:faq-parity`,
  `validate:seo-exercise`, plus a diff check of head metadata, non-FAQ JSON-LD,
  gtag, App Store links, exercise mounts and hrefs against `HEAD`.

**Release-readiness checklist**

EXP-HUB-2 (`/minimal-pairs-practice/`) deploys only when all are true:

- [ ] EXP-HUB-1 readout is recorded here (after 2026-12-11, or the 2027-01-08
      extension), with Outcome and Decision filled in.
- [ ] The 2026-11-13 checkpoint is recorded; no change shipped to the hub before it.
- [ ] `fe16804` is either already deployed and logged as a boundary, or the owner
      accepts it shipping in the same push; its deploy date is recorded.
- [ ] A fresh 28-day GSC baseline for the hub and the four-query cluster is saved
      here, ending the day before deploy.
- [ ] Mobile 390 px and desktop 1280 px browser checks done, including the new
      FAQ toggle and one pair-page link.
- [ ] `npm test`, `npm run build` and the validators above pass on the final tree.
- [ ] Owner approves the push to `main`; commit hash and UTC time recorded.

EXP-LIVE-1 (`/live-vs-leave/`) deploys only when all are true:

- [ ] `conversion_serp_cta_v1` is closed, with Outcome and Decision recorded in
      this file and `docs/analytics-and-attribution.md`.
- [ ] The control-cohort notes (`docs/seo-page-checklist.md`,
      `scripts/validate-seo-exercise.mjs`) are reassessed per their own rules;
      the presentation freeze is not changed by this edit.
- [ ] A fresh 28-day GSC baseline for the page, the meaning/difference clusters
      and the pronunciation-query guardrail is saved here, ending the day before deploy.
- [ ] Mobile and desktop browser checks done, including the FAQ toggle, the
      exercise start and one answer.
- [ ] `fe16804` status is logged as above.
- [ ] Gates pass on the final tree; owner approves the push; commit hash and UTC
      time recorded.

## Current blockers

| Blocker | Next action |
| --- | --- |
| EXP-HUB-1 observation window is running | Read out after 2026-12-11. Report distinct hub-landing organic sessions with a later `exercise_start`, with the secondary metrics, as directional only; a before/after difference does not show cause. |
| Latent completion undercount: `exercise_complete` waits for the final replay to settle, so a browser that fires neither `onend` nor `onerror`, or a learner who leaves during the ~2 s replay, produces a summary screen without the event | Owner decision. The ordering is asserted on purpose (`scripts/exercise-engine.test.mjs`) and gates the summary CTA. A fix would be a measurement discontinuity, so it should not ship during EXP-HUB-1 unless it is recorded here as one. |
| OpenSEO's GA4 link is broken (`ga4_reconnect_required`) | The owner reconnects Analytics in OpenSEO when needed. The Python GA4 path works meanwhile. |

## Next action

EXP-HUB-1 is live (`76e3de3`, 2026-10-16T12:53Z). Make no other page changes to
`/minimal-pairs-practice/` or its metadata until the readout, so it stays
attributable. First checkpoint 2026-11-13; readout after 2026-12-11.
