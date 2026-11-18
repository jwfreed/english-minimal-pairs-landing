# SEO Growth Execution Tracker

Canonical record of growth strategy, execution state, experiments and
decisions. Current state is in the Growth Portfolio section; the October
2026 SEO cycle follows it as history. One owner updates this file: the
orchestrating agent. Delegated agents report to it and do not edit it.

Audit evidence lives in `/tmp/soundwise-seo-audit-2026-10-16/` (`report.md`,
`measurement-2026-10-16.md`, CSVs). This file does not duplicate it. `/tmp`
is not durable, so the baseline figures this cycle depends on are copied
below.

## Growth Portfolio

Adopted 2026-11-13 at the owner's direction. It replaces experiment
preservation as the operating model. Everything from "Objective and scope"
down is the historical record of the October 2026 cycle and stays as written.
Long-form briefs, outreach drafts and the usability protocol are in
[`growth-portfolio-materials.md`](growth-portfolio-materials.md); that file
carries no status.

Contents: [A. Strategy](#a-current-strategy) ·
[B. Baseline](#b-current-baseline) · [C. Portfolio](#c-growth-portfolio) ·
[D. Active initiatives](#d-active-initiatives) ·
[E. Decisions and proposed transitions](#e-decision-log-and-proposed-transitions) ·
[F. Scorecard](#f-weekly-operating-scorecard) · [G. Next actions](#g-next-actions)

### A. Current strategy

**Objective (proposed, owner to confirm).** Reach 225 qualified visits per
28 days by the window ending 2027-02-09, with 300 as the stretch figure. The
kickoff figure of 300 was set against "about 150 organic sessions"; measured
as qualified visits the baseline is 112–124, so 300 is 2.5 times baseline,
not double. Neither number is a forecast.

**Qualified visit.** A GA4 session whose channel is not Direct and that GA4
counts as engaged (10 seconds in the foreground, a second page view, or a key
event). Direct is excluded because it is mostly automated traffic: 650
sessions, 49 engaged, 346 from Singapore with none engaged. This undercounts
real direct visits and is accepted.

**Activated visit.** A qualified-channel session with at least one
`exercise_start`.

**Activation guardrail.** Activated visits ÷ non-Direct sessions stays at or
above 15% (baseline 19–21%). Growth that drops it below 15% for two
consecutive 28-day windows is not counted as progress.

**Learner segments.**

| Segment | Problem | Where they look now | Evidence here |
| --- | --- | --- | --- |
| L1-language learner searching in their own language | Cannot hear a contrast their language lacks | Search in L1 for "minimal pairs" and pair names | Localized hubs: 23% of organic sessions, half of organic App Store click sessions |
| Self-directed learner searching "X vs Y pronunciation" or "minimal pairs practice" | Wants to hear two words and check themselves | Google, assistants (ChatGPT, Gemini), YouTube | Hub CTR 3.2% against 0.1–0.6% on pair pages |
| Teacher or tutor assigning listening practice | Needs a no-login activity for a specific contrast | Resource lists, colleagues, Google Classroom | One unprompted Classroom assignment: 35 sessions since 2026-10-07 |
| Searcher of a bare pair ("live vs leave") | Mostly wants the meaning | AI Overview answers it | About 24,000 impressions, 0.1–0.3% CTR. Not a target |

**Positioning.** Soundwise lets a learner test whether they can hear a
contrast, in one minute, in the browser, in their own language, then continue
in the app. The exercise is the product on the web; explanation supports it.

**Assumptions to test.**

1. Task-intent and L1-language searchers are the qualified audience; bare-pair
   impressions will not convert whatever the snippet says.
2. One teacher placement is worth more than a month of search tuning. In
   2026-09-16 → 2026-10-13, Referral gave 30 sessions, 15 starts and 11
   completions; Organic Search gave 157, 23 and 8. This rests on one class.
3. Most visitors who do not start have not seen the exercise; most who start
   and stop met a sound or comprehension problem. Unverified.

**Operating principles.**

- Decide on direction and pre-set thresholds, not significance. A 10-point
  lift needs about 250 sessions per arm; no page here has that in a year.
- Read pooled 28-day windows. Every deployment is a dated boundary in section
  E. No page is frozen for measurement unless section E says so.
- Qualitative evidence from real learners outranks analytics-only inference
  for exercise changes.
- Claims stay within `AGENTS.md` and `docs/messaging-framework.md`. No new
  pages or event changes without approval.
- At most three active bets. A new bet enters only when one ends.

**Resources.** One owner, agent time, no budget. Effort split recommended at
distribution 40%, search 35%, activation 25% (the kickoff suggested
50/30/20); assumption 2 is the reason. Owner to confirm.

### B. Current baseline

GA4 property `536565930` (time zone America/New_York) and GSC
`sc-domain:getsoundwise.co`, pulled 2026-11-13. Current: 2026-10-14 →
2026-11-10. Previous: 2026-09-16 → 2026-10-13. Counts are distinct sessions.

| Measure | Previous | Current |
| --- | --- | --- |
| Non-Direct sessions | 200 | 178 |
| **Qualified visits** (engaged, non-Direct) | 124 | 112 |
| of which Organic Search / Referral / AI Assistant | 91 / 21 / 11 | 104 / 4 / 4 |
| Organic Search sessions | 157 | 163 |
| **Activated visits** (`exercise_start`, non-Direct) | 43 (21.5%) | 34 (19.1%) |
| Sessions with `exercise_complete`, non-Direct | 23 | 22 |
| Sessions with `app_store_click`, non-Direct | 33 | 23 |
| Organic only: start / complete / store click | 23 / 8 / 16 | 28 / 17 / 20 |
| GSC clicks / impressions / CTR | 135 / 28,136 / 0.48% | 129 / 26,055 / 0.50% |

Current-window observations:

- English pair pages hold about 24,000 impressions at positions 5–8 and
  0.1–0.6% CTR. `/live-vs-leave/` alone has 4,333 impressions and 7 clicks.
- The five routes under the `conversion_serp_cta_v1` presentation freeze hold
  10,124 impressions, 39% of the site.
- English hub organic landings fell from 15–18 per window to 5. GSC shows
  12 → 6 clicks at an unchanged position (12.5 → 12.3), so this is demand or
  click variance, not a ranking loss.
- Organic App Store clicks: 15 of 26 events are the hero CTA before any
  exercise; 5 follow a completion.
- Russia is the largest country by organic sessions (29) and clicks (24),
  then the United States (17 sessions) and Japan (15).
- `classroom.google.com`: 35 sessions from 2026-10-07 to 2026-10-31, mostly
  Peru on desktop, landing on `/cap-vs-cup/`, with exercise starts on
  `/cap-vs-cup/`, `/bit-vs-beat/` and `/bad-vs-bed/`. One teacher, probably
  one class.
- AI assistants since 2026-07-14: ChatGPT 33 sessions to the homepage (27
  engaged), Gemini 6 to the English hub.

Limitations: query rows cover 38% of impressions; installs and in-app
behaviour are not observable; one bot wave or one class moves any figure
here; the Classroom teacher is unknown to us; weekly numbers are too small to
read alone.

### C. Growth portfolio

Scores are 1–3 judgments (3 is best) for reach, learner fit, differentiation,
evidence, low cost and speed of feedback, summed to 18. They order the list;
they are not forecasts. Search briefs for S-01 to S-03 are in the materials
file. Owner = the site owner; Lead = the orchestrating agent.

| ID | Workstream | Hypothesis | Customer value | Evidence | Pri (score) | Effort | Status | Who | Depends on | Next action | Review |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **S-01** | Search | An exercise at the top of the English hub turns it into the page task-intent searchers, assistants and teachers want | Test your hearing without reading first | Hub CTR 3.2% at position 12; no exercise on the hub; Gemini and ChatGPT already send visits there | 1 (14) | 0.5 day | ACTIVE (built on branch; deploy review) | Lead builds, Owner approves | T-1 approved 2026-11-14; deploy approval | Owner reviews branch `growth/hub-exercise-and-speech-reliability` | 2026-12-11 |
| S-02 | Search | L1-matched first links on localized hubs raise exercise starts from the highest-intent segment | Practice the contrast your language lacks | 37 sessions, 10 store-click sessions, 3 starts; `/ru/` hub leads with pairs the app does not support for Russian | 2 (14) | 1 day | READY | Lead | Deploy approval | Queue behind S-01 | 2026-12-11 |
| S-03 | Search | A first-screen pronunciation answer lifts "X vs Y pronunciation" rankings on unfrozen pair pages | Hear both words at once | About 1,100 exported impressions at positions 5–8; `/three-vs-tree/` 3 clicks from 120 | 3 (13) | 1 day | READY | Lead | Deploy approval | Queue | 2026-12-11 |
| S-04 | Search | Ending the presentation freeze lets the five highest-impression routes get the current exercise and S-03 | Same experience on the most-seen pages | 10,124 impressions (39%) are frozen for an unreadable test | 4 (13) | 1 day | BLOCKED | Lead | T-4 approved; code and validator change | Owner decision on T-4 | 2026-12-11 |
| S-05 | Search | A baseline of how assistants describe and cite Soundwise shows what to fix | Assistants point learners to a working exercise | 33 ChatGPT homepage sessions, 82% engaged; `ai_visibility` phase never run | 5 (13) | 0.5 day | BACKLOG | Lead | — | Run after S-01 ships | 2027-01-12 |
| S-06 | Search | Registering with Bing and Yandex webmaster tools widens indexing where Russia leads | Russian speakers find the Russian pages | Russia is the top country; 17 sessions from Bing and Yandex; registration status unknown | 6 (12) | 1 hour | BACKLOG | Owner | Owner accounts | Owner checks whether already registered | 2027-01-12 |
| S-07 | Search | A second Russian pair page (vest/west or live/leave, both app-supported for Russian) extends the one L1 with proven clicks | More than one contrast in Russian | Russian routes: 22 clicks / 1,018 impressions; EXP-RU-WATCH window 1 missed its expand rule | 7 (11) | 2 days | BACKLOG | Lead | EXP-RU-WATCH window 2 (ends 2026-12-08); new-page approval | Read window 2 | 2026-12-11 |
| S-08 | Search | Pair pages for the six cataloged contrasts without one (think/sink, pack/back, wine/vine, fan/pan, day/they, light/night) add impressions | Coverage of more contrasts | Catalog entries exist; existing pair pages average 0.3% CTR, so the gain is small | 8 (11) | 1 day each | BACKLOG | Lead | New-page approval; app capability check | None now | 2027-01-12 |
| S-09 | Search | `/ja/right-vs-light/` serves the best-known Japanese difficulty | /r/–/l/ practice in Japanese | Japan third by sessions (15); app supports the pair; `ko`, `yue`, `vi` have the page; no query evidence | 9 (10) | 2 days | BACKLOG | Lead | New-page approval | None now | 2027-01-12 |
| S-10 | Search | Rewriting titles on bare-pair pages lifts CTR | — | `/man-vs-men/` title test: impressions 1,633 → 598, clicks 2 → 2 | — | — | STOPPED | — | — | Do not repeat without new evidence | — |
| **D-1** | Distribution | Curators of ESL resource lists and library guides will list a free, no-login listening check, and each listing keeps sending learners | Teachers and students find a tool on lists they already trust | Unprompted Classroom use; lists still cite Flash-era tools; no outreach has ever been done | 1 | 1 day to send 8, then 1 hour a week | ACTIVE (drafts ready, sending needs approval) | Owner sends, Lead drafts | Approval to send | Owner reviews drafts and target list | 2026-12-11 |
| D-2 | Distribution | A short "use with a class" block on pair pages and the hub makes assignment repeatable | A teacher knows the page can be assigned | Classroom sessions; competitor pitches the same thing | 2 | 0.5 day | READY | Lead | Deploy approval; wording check against the exercise | Ship with S-01 if approved | 2026-12-11 |
| D-3 | Distribution | A practitioner note in a pronunciation-teacher publication earns durable credibility | Teachers hear about it from peers | None beyond audience fit | 3 | 2 days | BACKLOG | Owner | D-1 replies | Revisit after D-1 | 2027-01-12 |
| **A-1** | Activation | Watching 5–8 learners use a pair page will show why 83% never start and 40% of starters stop | Fix what actually blocks learners | 28 of 163 start, 17 complete; start-only sessions are seconds long | 1 | 6 sessions of 25 minutes plus recruiting | ACTIVE (protocol ready) | Owner runs, Lead synthesizes | Participants | Owner recruits first two | 2026-12-11 |
| A-4 | Activation | Learners whose browser plays no sound, or never finishes the first word, are stuck: the start event fires, the answer buttons stay disabled, and the message offers no fix | The exercise does not look broken | Reproduced with stubbed speech synthesis; real frequency unknown. Audio is browser speech synthesis only | 2 | 0.5 day | ACTIVE (fix built on branch; real-device test pending) | Lead | Deploy approval; A-1 real-device sessions | Confirm on real iOS and in-app browsers during A-1 | 2026-12-11 |
| A-2 | Activation | Bringing the exercise within reach raises starts: add the existing jump link to the 3 pages without one, then move the mount up where it is deepest | Less scrolling to practice | Measured 2026-11-13 at 390 px: mount below 4,000 px on 14 of 21 pair pages (`/sit-vs-seat/` 12,175 px); `/live-vs-leave/`, `/ship-vs-sheep/` and `/sit-vs-seat/` show no first-screen cue | 2 | 1 day | BACKLOG | Lead | A-1 findings; deploy approval | Confirm or drop after A-1 | 2026-12-11 |
| A-3 | Activation | The completion event waits for a replay that may never settle, hiding real completions | Accurate picture of finishing | Engine code; see Current blockers | 3 | 0.5 day | BACKLOG | Lead | Owner approval as a measurement boundary | Decide after A-1 | 2027-01-12 |

### D. Active initiatives

#### S-01: Hub as a listening test (search bet)

- **Audience and problem:** people searching for minimal pairs practice or a
  listening test, who reach a page with no exercise on it.
- **Intervention:** mount one existing exercise under the hub's definition;
  keep the three contrast links as next steps; metadata unchanged.
- **Why it should work:** the hub is the only English page whose queries
  click; it is also the link assistants cite and the natural link for D-1.
- **Success signals:** hub organic landings ≥15 per 28 days; at least half
  of hub landers start an exercise.
- **Measurement:** pooled 28-day windows from the deploy boundary; existing
  events only. Hub-sourced exercise events are a new event source and are
  recorded as a boundary.
- **Budget:** half a day to build and check; two windows to read.
- **Decision rule:** keep if either signal is met after two windows; if hub
  landings stay under 8 for two windows, stop page work on the hub and treat
  ranking as the constraint.
- **Evidence so far:** baseline only (5 landings, 2 starts, 2026-10-14 →
  2026-11-10).
- **Implementation (2026-11-14):** built on branch
  `growth/hub-exercise-and-speech-reliability`; see section D2.
- **Next action:** owner reviews the branch and decides on deployment.

#### D-1: Curator and library-guide outreach (distribution bet)

- **Audience and problem:** teachers and students who use curated lists of
  pronunciation tools, several of which point at retired tools.
- **Intervention:** eight individual messages from the owner, using drafts A
  and B and the target list in the materials file, each with a tagged link to
  the hub.
- **Why it should work:** a listing persists and needs no community
  standing. It may not work: no curator has a stated suggestion policy, and
  the Classroom evidence is one teacher.
- **Success signals:** at least 2 placements from 8 messages; referral
  qualified visits ≥15 per 28 days by the second window.
- **Measurement:** reply and placement per message; GA4 sessions, engaged
  sessions and `exercise_start` sessions by source.
- **Budget:** one day to send the first eight; no money.
- **Decision rule:** 2 or more placements, send a second wave of 8 to
  library guides. 0–1 placements, stop curator outreach and move the effort
  to D-2 and D-3.
- **Evidence so far:** channel research 2026-11-13: resource lists and
  Classroom shareability rated highest; tutor marketplaces and launch sites
  ruled out; Reddit teacher-community rules could not be verified.
- **Next action:** owner reviews drafts and approves sending. S-01 should be
  live first so the linked page has an exercise on it.

#### A-1: Usability sessions (activation and customer-learning bet)

- **Audience and problem:** learners who land on a pair page and leave
  without starting, or start and stop.
- **Intervention:** six moderated 25-minute sessions using the protocol in
  the materials file.
- **Why it should work:** two losses are measured but unexplained, and no
  per-page test can explain them at this traffic.
- **Success signals:** five or more sessions completed; a ranked list of
  confirmed problems (two of five participants, or one blocker also explained
  by the code).
- **Measurement:** the protocol's record sheet. No analytics change.
- **Budget:** about four hours of sessions plus recruiting; an optional
  thank-you is the only possible cost.
- **Decision rule:** confirmed blockers become READY items ahead of A-2 and
  A-3. If no problem is confirmed, the loss is intent mismatch, and effort
  moves from activation to acquisition quality.
- **Evidence so far:** analytics (section B) plus a code and headless-browser
  review on 2026-11-13. It found: the exercise below 4,000 px on 14 of 21
  pair pages at phone width; no first-screen cue on the three control-cohort
  pages; a dead end when speech synthesis fails or hangs; a second Start tap
  required in round 2; no restart control; on `/full-vs-fool/` the header
  still names full/fool while round 2 plays pull/pool. It also reported that
  the summary App Store CTA does not render on any English pair page because
  the capability resolver returns no CTA without an L1. That last point is
  unconfirmed and should be checked against the intended design. Real-device
  audio was not testable.
- **Next action:** owner recruits the first two participants.

### D2. Phase 1 implementation record (2026-11-14)

Branch `growth/hub-exercise-and-speech-reliability`, from `main` at
`b8e31f3`. Nothing is merged, pushed or deployed.

**T-1 approved 2026-11-14** (owner instruction). EXP-HUB-1 is downgraded to
observational and the hub page restriction is lifted. Unchanged: the original
deployment (`76e3de3`, 2026-10-16T12:53Z), its baseline, the three-link
treatment, the 2026-10-23 confounders (`7013956`, `84909a3`), and the
2026-11-13 checkpoint results, none of which showed a result for the links.
2026-12-11 stays a reporting checkpoint, not a restriction. Not touched:
`conversion_serp_cta_v1`, its freeze, tracking definitions, T-2 to T-8.

**S-01 built.** `content/pairs/minimal-pairs-practice/index.html`:

- A "Start the Listening Test" button under the H1 (first viewport at 390 and
  1280 px; 54 px tall) that jumps to the exercise and moves focus to it.
- A new first section "Try a Minimal Pairs Listening Test" holding one
  existing exercise, `data-contrast="ship-vs-sheep"`, plus a TOC entry.
- Title, description, canonical, hreflang, JSON-LD, existing sections, the
  three contrast links and all localized hubs are unchanged. No new CSS, JS,
  events or content variant. No assignment affordance was added: the S-01
  brief did not specify one (it belongs to D-2).
- Mount sits at about 1,200 px at 390 px and 1,160 px at 1280 px, so the
  button, not the mount, is what is in the first viewport.
- `scripts/validate-seo-exercise.mjs` skipped hubs. It now checks the one
  sanctioned hub mount (one mount, `ship-vs-sheep`, cataloged, shared script,
  no hand-written `data-content-variant`) and still rejects any other
  `data-exercise` outside pair pages. Proven by temporarily changing the
  contrast and seeing the build gate fail.
- `scripts/seo-exercise-training-rollout.test.mjs` mount count is now 36
  (22 English including the hub, 14 localized); the hub stays single-pair.

**Measurement boundary (hub).** From the deploy time, exercise events can
carry `page_slug = minimal-pairs-practice` with `exercise_id = ship-vs-sheep`.
Before then no exercise event could come from the hub page, so hub
`exercise_start` rates before and after deploy are not comparable. Record the
deploy commit and UTC time here. The earlier "hub-landing sessions with a later
`exercise_start`" metric counted starts on other pages; after deploy it also
counts the hub's own.

**Reliability defect fixed.** `speakWord` in `src/seo-page.js` waited for
`onend` or `onerror` with no bound. If a browser accepted `speak()` and never
reported either, the first word hung: guesses stayed disabled, the input gate
ignored every later Start (it reuses the pending promise), and no message
appeared. A hung replay after the final answer kept `exercise_complete` and the
summary App Store CTA from ever firing. Fix: a 6 s watchdog
(`SPEECH_PLAYBACK_TIMEOUT_MS`, injectable for tests) that settles the playback
as unavailable, ignores a late `onend`, and cancels the stalled utterance.
The existing recovery path then returns the learner to preview with the
existing localized "audio unavailable" message, and Start works again. An
unheard word is never scoreable: no answer is accepted and no round is
counted.

- **Semantic note for approval:** in the final-replay hang case,
  `exercise_complete` now fires about 6 s after the last answer, where before
  it never fired. Normal playback, the firing point, and every event
  definition are unchanged. This is the same result already produced when
  playback errors out.
- Same defect still exists in the homepage demo (`src/main.js` `speakWord`);
  not changed, outside the scope.
- Real frequency is unknown; no real iOS or in-app-browser test was possible.

**CTA verdict (browser, speech stubbed, 390 px).** Both earlier reports were
partly right.

| Page type | Summary CTA | Evidence |
| --- | --- | --- |
| Localized exact-pair routes (`/ru/`, `/ja/`, `/es/ship-vs-sheep/`, `/ko/right-vs-light/`) | Renders (`exercise-summary`, 266×74 px), correct UTM (`utm_content=<locale>-<pair>`), `app_store_click` fires once with `exercise_completed=true` | Journey run on each |
| English `bit-vs-beat`, `fill-vs-feel` | "Continue Training in Soundwise" (`post-interaction`) appears from round-1 feedback; click fires `app_store_click` with `exercise_completed=true`, `ct=web-bitbeat` | `bit-vs-beat` journey run |
| English pair pages and the hub (`bad-vs-bed`, `full-vs-fool`, `live-vs-leave`, hub) | No CTA inside the exercise at summary | Journey run; page-level CTAs (hero, mid-content, footer) remain and are tracked |

Root cause, by design: the summary CTA needs `capability.recommendedCTA`, which
the capability resolver returns only for an exact-pair or contrast match for a
known learner language (`src/app-capability-resolver.js`). English routes
have no learner language, so the status is `NO_APP_SUPPORT` and no
in-exercise CTA is shown, to avoid claiming app support that is unknown.
The CTA does not depend on playback completing, except that a hung final
replay delayed it before the fix. No change made. Whether English pages
should show a generic in-exercise CTA is a product decision that needs
separate approval; the 4–5 organic App Store clicks after completion per
28 days are consistent with this gap.

**Verification (local, 2026-11-14).** `npm test` 225 passed, 0 failed (221
before; 4 new regression tests); `npm run build` passes with all validators;
`validate:landing-copy`, `funnel-tracking`, `app-store-tracking`,
`seo-conversion-matrix`, `exercise-engine`, `faq-parity` pass.
`validate:localized` passes for `ru/ship-vs-sheep`; it fails on the five
localized hubs it was tried on, and fails identically on the untouched
baseline (it checks pair-page UTM and hub-link rules). Playwright (headless
Chromium, stubbed `speechSynthesis`, GTM and App Store requests blocked) at
390 and 1280 px: hub journey with a wrong then right answer, round progress,
summary and related-pair links; hang recovery and retry on the hub and on
`bad-vs-bed` and `bit-vs-beat`; error recovery on the hub and `/ru/`; hung
final replay on `/ru/ship-vs-sheep/`, `bit-vs-beat` and the hub; keyboard-only
path (focus lands on the exercise, Start and answer by Enter); no horizontal
overflow; no console errors apart from the requests I blocked. Not tested:
real audio, real iOS Safari or in-app browsers, screen readers.

**Files changed.** `content/pairs/minimal-pairs-practice/index.html`,
`src/seo-page.js`, `scripts/validate-seo-exercise.mjs`,
`scripts/seo-exercise-ux.test.mjs`,
`scripts/seo-exercise-training-rollout.test.mjs`, this file, and
`docs/growth-portfolio-materials.md` (committed unchanged from the previous
session).

**Remaining blockers and approvals before deploy:** owner review of the
branch; approval to push and deploy (and to record the commit and UTC time
here); the `exercise_complete` timing note above; and a decision on a generic
English in-exercise CTA. Merging ships only this branch's changes on top of `b8e31f3`.

### D3. Release Check 1: exercise completion invariants (2026-11-14)

**Result: PASS.** Verified at `b4b1dac` on branch
`growth/hub-exercise-and-speech-reliability`. No defect found, so no
production code changed. Checks 2 and 3 have not been started.

Lifecycle as implemented: Start click unlocks audio, sets stage `test` and
fires `demo_started` before any sound. Guesses open only when the first word's
playback resolves true (input gate). An answer is accepted only in stage
`test`; it scores, sets stage `feedback` or `summary`, then replays both words.
`demo_completed` fires after that replay settles. The summary shows at answer
time, before the replay. `exercise_start` and `exercise_complete` are each
sent to GA4 once per page load (`src/funnel-tracking.js`).

| Invariant | Result | Evidence |
| --- | --- | --- |
| A. No unheard stimulus scored | PASS | Hang and error both return to preview with no target, no score, no round; the gate and the engine reject answers; retry works |
| B. No unanswered advancement | PASS | At 5,999 ms still waiting; at 6,000 ms preview, same round, `demo_round_completed` count 0 |
| C. No duplicate transitions | PASS | Late and repeated `onend`/`onerror`, double guess, double Next: one score, one round, no extra events |
| D. Completion after final-replay timeout | PASS | Summary and final score shown at answer time; `exercise_complete` 0 before and exactly 1 after the watchdog; late callbacks add none |
| E. Recovery preserves later rounds | PASS | Retry stays in the same round; a stale callback cannot settle the new attempt; round 2 fail, retry, answer gives the right score and one completion |

**Tests added:** `scripts/exercise-lifecycle-speech.test.mjs`, 21 tests, run
for the hub subject (`ship-vs-sheep`) and a pair-page subject (`bad-vs-bed`).
They use the real engine, input gate, `speakWord` and funnel tracking with a
manual speech stub and mock timers, and cover normal completion, hang, error,
late `onend` and `onerror`, retry, a stale callback during retry, final-replay
hang, repeated terminal callbacks, Play-the-sample interruption, Next during a
replay, Listen interrupting the final replay, and a stale watchdog from a
finished playback. Mutation check: making a timeout report success, removing
the watchdog, or leaving its timer uncleared each fail tests. Dropping the
`settled` guard in `speakWord` does not, because a promise resolves only once
and the playback id check already protects state; that guard is redundant.

**Browser check (Playwright, 390 px, manual speech stub, real timers):** the
same scenario on the hub and `/bad-vs-bed/` showed the same results in the DOM
(guess buttons, notice, stage, summary score, `dataLayer` counts): stale
callbacks changed nothing, retry worked, and `exercise_complete` appeared once,
after the watchdog, with a 2 out of 2 summary. Not committed; Playwright is not
a repository dependency.

**Observations, not defects, no change made:**
- Pressing "Play the sample" while the first word is still playing supersedes
  it. The round returns to preview (nothing scored) and the "audio
  unavailable" notice shows even though audio works. Start works again.
- After a final-replay hang the summary shows the same notice beside the score.
- A retry draws a new random target for the same round; the unheard word is
  not repeated.

**Limitations:** the unit harness mirrors the `seo-page.js` handlers rather
than running them; DOM wiring is covered only by the uncommitted browser run.
Real iOS Safari, in-app browsers and a real speech engine were not tested, so
whether browsers fire a late `onend` after `cancel()` is assumed, not observed.
A learner who leaves the page within 6 s of a hung final replay still produces
no `exercise_complete`.

**Results:** `npm test` 246 passed, 0 failed (225 before); the exercise-engine,
seo-exercise, funnel-tracking, app-store-tracking and seo-conversion-matrix
validators pass. No build was needed (no source change).

### D4. App Store destination investigation (2026-11-14)

**Result: root cause UNRESOLVED; no Soundwise defect found; no code changed.**
Investigated on branch `growth/hub-exercise-and-speech-reliability` at
`941e851`. Release Check 1 (D3) is unaffected.

**Observation.** A real learner completed the homepage exercise, clicked
"Practice more sound contrasts with Soundwise" and saw Apple's "An Error
Occurred" page in desktop Chrome on macOS. Destination:
`https://apps.apple.com/app/apple-store/id6753882308?pt=128210308&ct=web-home&mt=8`.
Their storefront, network, extensions and the time are unknown.

**Reproduction attempt (all from Thailand, 2026-11-14, Chrome 157 via Playwright
and curl).** The failure did not reproduce.

| URL | curl | Chrome |
| --- | --- | --- |
| A. failing URL (`/app/apple-store/...?pt&ct=web-home&mt=8`) | 301 to `/us/app/soundwise-english/id6753882308?ct=web-home&pt=128210308`, then 200 | listing renders, title "Soundwise English App - App Store" |
| B. `/us/app/soundwise-english/id6753882308` | 200 | listing renders |
| C. B plus `?pt=128210308&ct=web-home` | 200 | listing renders |

- 30 fresh-context Chrome loads (10 each of A, B, C): 30 rendered the listing,
  0 showed an error page. Apple's client strips `pt`/`ct` from the address bar
  after render; they were present on the request Apple received.
- `/app/id6753882308` and `/app/apple-store/id6753882308` (no params) also end
  on `/us/...`. `mt=8` is harmless: B with `mt=8` also loads, but Apple's page
  does not say whether `mt` is required, so it was kept.
- Varying `Accept-Language`, the `geo` cookie and browser locale/timezone
  (DE, FR, ES, IT, GB) did not change the redirect; every case ended on `/us/`.
  The 301 is edge-cached (`cache-control: public, max-age=900`, Akamai).
- One unrelated Apple sub-request (`/api/apps/v1/editorial/...`) returned 429
  once during a rapid sequence while the page still rendered. This shows Apple's
  web app rate-limits and can fail, but it is not shown to cause the error page.
- Format check: Apple's own
  [Campaign links help](https://developer.apple.com/help/app-store-connect-analytics/acquisition/campaign-links/)
  gives `https://apps.apple.com/app/apple-store/id123456789?pt=123456&ct=test1234&mt=8`.
  The failing URL has exactly that structure, so it is **not** an obsolete or
  invalid URL format.
- iTunes Lookup API (`itunes.apple.com/lookup?id=6753882308&country=XX`) returns
  the app for 26 of 30 storefronts tried and **no result for `de`, `fr`, `es`,
  `it`**; `apps.apple.com/{de,fr,es,it,nl,pt}/app/soundwise-english/id6753882308`
  return HTTP 404. The app ID is correct and the listing is live in the US.
  Reaching an unavailable storefront could produce an error page for a visitor
  whose Apple session maps there, but no tested input did that, so this is an
  **unconfirmed hypothesis, not the cause**. Not investigated further: whether
  the EU gap is intentional.

**Link audit.**
- Source HTML (all pages, `index.html`, `content/pairs/`, `content/locales/`)
  contains the plain `https://apps.apple.com/us/app/soundwise-english/id6753882308`
  form, with `utm_*` parameters on SEO pages.
- `src/apple-campaign-links.js` is the single generator. The Vite plugin
  `apply-apple-campaign-links` (`vite.config.js`) rewrites every Apple href at
  build time to the campaign-link format, only for five English routes:
  `homepage` `web-home`, `bit-vs-beat` `web-bitbeat`, `fill-vs-feel`
  `web-fillfeel`, `ship-vs-sheep` `web-shipsheep`, `minimal-pairs-practice`
  `web-mpphub`. Localized routes and unmapped pages keep their plain `/us/` URL
  by design (tested in `scripts/apple-campaign-links.test.mjs`).
- Production check (curl of `getsoundwise.co`): `/`, `/minimal-pairs-practice/`,
  `/bit-vs-beat/`, `/ship-vs-sheep/`, `/fill-vs-feel/` serve the campaign-link
  format with the matching `ct`; `/live-vs-leave/`, `/ja/`, `/es/`,
  `/ja/ship-vs-sheep/` and `/ja/minimal-pairs-practice/` serve the plain `/us/`
  URL. The app ID and provider token `128210308` match everywhere.
- `ct=web-home` on the exercise-completion CTA is **intended**: the CTA lives on
  the homepage, which maps to `web-home` (asserted by test). It is not a
  labeling defect. The taxonomy was not changed.

**Tracking verification (production homepage, real Chrome, GA collect requests
aborted so real analytics were not polluted).** Start, guess, reach the summary,
click `#demo-app-store-cta`: the link href was the failing URL; the click
navigated to the Soundwise listing (final `https://apps.apple.com/us/app/soundwise-english/id6753882308`,
no error page). Observed GA requests: `page_view`, `exercise_start`, **one**
`app_store_click` (`cta_position=exercise-summary`, `exercise_completed=true`,
`link_url` = the campaign URL), plus GA's own automatic outbound `click`. An
`app_store_click` records an outbound click, not a successful App Store landing.
The `exercise_complete` request was not in the captured set in this run; it was
not the subject of the check and nothing in this investigation touched it.

**Tests.** `npm test` 246 passed, 0 failed; `validate:app-store-tracking`,
`validate:funnel-tracking`, `validate:seo-conversion-matrix`,
`validate:landing-copy`, `validate:localized-homepages` pass. Not run:
`npm run build` (no source change), `validate:localized` (needs `--page`
arguments).

**Conclusion and implications.**
- Probable: a transient or visitor-specific Apple-side failure (Apple web app
  data call failing or rate-limited, or a storefront/network condition on the
  learner's side). Not confirmed; no Soundwise defect was demonstrated, so per
  the task brief no speculative change was made.
- The destination is safe to deploy as-is; the current pages already serve it in
  production. This work adds no release risk.
- Open for the owner, outside this task's scope: (1) whether the missing
  `de`/`fr`/`es`/`it` storefront availability is intended, given Spanish and
  Portuguese localized pages exist; (2) if more error reports arrive, collect the
  learner's country, browser, extensions and timestamp; (3) outbound-click events
  cannot detect landing failures, so a recurrence is only visible through user
  reports or App Store Connect referrer counts.
- Rollback: none needed; only this documentation section was added.

### D5. Mobile speech investigation and release hold (2026-11-14)

**Release verdict: BLOCKED — awaiting device verification.** Implementation and
local checks are complete. No iPhone, iOS Safari/Firefox, or remote Web Inspector
was available. Desktop events and emulation cannot verify audible iPhone speech.
The owner reports Chrome iOS audible and Safari/Firefox silent on the same phone;
those observations have not been independently reproduced here. D3 (Release Check
1) and D4 (App Store investigation) above remain historical records, unchanged.

**Root cause: unresolved for physical silence; confirmed for unsafe success.**

- Both production and branch SEO code accepted `onend` without requiring
  `onstart`. The homepage additionally accepted `onerror` as success and exposed
  answers while the target was pending. Three regression probes failed before
  editing: deferred Start, end-without-start success, and pending-answer scoring.
- SEO Start used `Promise.resolve().then(startRound)` before speech. This is a
  confirmed asynchronous boundary, **not proof that iOS lost activation**.
  [WebKit's speech implementation](https://github.com/WebKit/WebKit/blob/main/Source/WebCore/Modules/speech/SpeechSynthesis.cpp)
  checks a user gesture when opening an iOS speech session. Keeping the original
  synchronous call path removes that avoidable boundary; the affected device
  must establish whether it caused this report.
- Both players queried voices synchronously, selected the first matching US/UK/
  other English voice, assigned its language and submitted a new utterance after
  unconditional cancellation. The branch's SEO player added a 6 s watchdog;
  production and the homepage had none. Neither used resume loops. Homepage
  voice warming only queried again on `voiceschanged`; it did not start speech.
- Read-only GitHub inspection confirmed remote main at `b8e31f3`. Direct live
  asset reads confirmed the older behavior in `seo-page-unkCYzwh.js` and
  `main--BA7HdV9.js`. Thus the unsafe success logic exists in both versions;
  whether the iPhone's silence occurs in both versions is still unknown.

**Hypotheses, probes, and choice.**

| Candidate | Discriminating evidence | Decision |
| --- | --- | --- |
| Gesture loss before first speech | Compare tap activation and callback trace on affected iPhone before/after synchronous Start; unit probe proves call-stack preservation only | Preserve synchronous Start; device causality unconfirmed |
| Voices empty, delayed, removed or incompatible | Record voice list and selected voice; retry after `voiceschanged`; compare default-English behavior when no matching voice is exposed | Fresh lookup per tap, existing English preference and language default retained; no asynchronous wait or automatic retry |
| Cancellation interrupts initialization or a prior utterance leaks callbacks | Log cancel/submit ordering and stale callbacks; deterministic tests deliver callbacks during/after cancellation | Cancel active/pending speech only; cancellation always fails the old attempt; idle cancellation removed without claiming it caused silence |
| Silent success, stalled/errored speech, paused engine | Log start/end/error/timing and speaking/pending/paused; test end-only, start/error, no callbacks and missing end | Require start then end; errors, exceptions, cancellation and watchdog fail closed; no speculative resume loop |
| Mute, output route or browser/device settings | Compare the same phone, volume, output destination, Silent Mode and browser settings; human reports actual sound | Unresolved locally; JavaScript cannot inspect physical output |

Waiting for voices before `speak()` was rejected because it introduces another
asynchronous first-play boundary without device evidence. Forcing every browser
to a different voice, arbitrary delays, repeated speech, and UA-specific hacks
were rejected for lack of evidence. A normal start/end sequence can still be
silent; if the device shows that trace without sound, stop release and evaluate
a small learner-confirmed audio check separately. No such UX is included here.

**Implementation.**

- `src/speech-playback.js`: shared homepage/SEO player, strong utterance reference,
  fresh voice selection, synchronous submission, start-before-end requirement,
  exception/error handling, idempotent settlement, and the existing 6 s timeout.
  Watchdog is armed before `speak()` so synchronous callbacks clear it correctly.
- `src/seo-page.js` and `src/seo-exercise-input-gate.js`: call Start immediately,
  synchronize answer availability with engine readiness, and cancel on Next
  without reporting success. Existing exports remain available to callers/tests.
- `src/exercise-engine.js`: reject pending/failed target answers on either
  surface, close readiness during target replay, retain the round on failure,
  and ignore stale playback/session completion. Final replay failure still
  settles completion exactly once; completion timing remains after replay.
- `src/main.js`: use the same player because the same missing-start validation
  affects this demo too; disable pending guesses, announce failures using existing
  localized copy, and cancel interrupted/reset playback. Other homepage features,
  scoring math, attribution, URLs, SEO content and analytics names are unchanged.
- `src/speech-diagnostics.js`: opt-in **development-only** panel and
  `window.soundwiseSpeechDiagnostics.snapshot()` / `.clear()`. Captures browser,
  platform, English voice descriptors/count, selected voice/language, callback
  timing/sequence, state flags, error names/codes and settlement/watchdog reasons.
  At most 200 records in page memory; no utterance text, personal identifiers,
  storage, upload or analytics. Vite excludes the panel module from release builds.

**Local verification.** Node `v22.21.0`; clean initial branch
`growth/hub-exercise-and-speech-reliability` at `6a65395`.

```bash
rtk proxy node --test --test-reporter=spec scripts/speech-playback.test.mjs scripts/exercise-lifecycle-speech.test.mjs scripts/seo-exercise-ux.test.mjs scripts/exercise-engine.test.mjs scripts/seo-exercise-adapter.test.mjs
# PASS: 81 tests, 0 failures
rtk proxy npm test
# PASS: 270 tests, 0 failures
rtk proxy npm run validate:landing-copy
rtk proxy npm run validate:funnel-tracking
rtk proxy npm run validate:app-store-tracking
rtk proxy npm run validate:seo-conversion-matrix
rtk proxy npm run validate:seo-exercise
# All PASS; landing-copy retains its existing RTL guidance
rtk proxy npm run validate:localized -- --page ja/ship-vs-sheep --page zh/ship-vs-sheep --page es/ship-vs-sheep --page pt/ship-vs-sheep --page id/ship-vs-sheep --page ru/ship-vs-sheep --page tr/ship-vs-sheep --page ar/pat-vs-bat --page yue/right-vs-light --page ko/right-vs-light --page vi/right-vs-light --page hi-ur/vest-vs-west --page fa/vest-vs-west --page th/thin-vs-tin
# PASS: all 14 localized pair pages
rtk proxy npm run build
# PASS: prebuild, Vite and all postbuild gates
rtk git diff --check
# PASS
```

The bare localized command exits with usage: explicit page arguments are required.
An exploratory run including hubs failed on pair-specific UTM/self-link
expectations; those hubs and validator are unchanged. The applicable pair-page
run above passes. An initial build also rejected downloaded production HTML
stored as `.html` under `output/`; these read-only captures now use `.txt` and
are not website source. No validation rule was weakened. Build retains the
existing internal-link warning about 746 localized-to-English fallback edges.

Desktop Chromium 157, macOS, real speech engine: 180 voices; selected Samantha
`en-US`; observed normal start/end and delayed answer availability on homepage
and bad/bed. Audibility was **not** independently checked. At 390 px, browser
checks on production preview exercised both surfaces with controlled speech:
end-only failure, error during target replay, deliberate retry, two rounds,
hung final replay, summary recovery, one `exercise_start`, one
`exercise_complete`, and one `app_store_click`. External analytics requests and
App Store navigation were blocked. A delayed synthetic `voiceschanged` updated
the dev panel without auto-speaking, and a subsequent tap selected the new voice.
Diagnostic globals and panel strings were absent from production output even
with `?speechDebug=1`. Only blocked third-party requests appeared as console errors.

Browser harness/screenshots are local, ignored artifacts in `output/playwright/`:
`check-audio.js`, `check-audio-result.txt`, `seo-audio-native.png`,
`home-audio-summary.png`, `pair-audio-summary.png`, `speech-diagnostics.png`.
Run the browser harness in a fresh session so init scripts/listeners do not
accumulate. The existing homepage summary CTA overflows at 390 px (495 px scroll
width); its markup/CSS were not changed. No redesign is included.

**Affected-iPhone procedure (no deployment).**

1. Record iPhone/iOS and Safari/Firefox/Chrome app versions manually. First compare
   the original production URL in all three, recording actual audibility and
   page URL. Chrome's result is not proof of Safari/Firefox voice availability.
2. On the Mac, run `rtk proxy npm run dev -- --host 0.0.0.0`. On the same Wi-Fi,
   use the printed LAN address (not iPhone localhost). Open
   `http://<Mac-LAN-IP>:5173/?speechDebug=1` and
   `http://<Mac-LAN-IP>:5173/content/pairs/bad-vs-bed/index.html?speechDebug=1`.
   Dev clean `/bad-vs-bed/` falls back to the homepage; use this source path.
   Also check the new hub via `/content/pairs/minimal-pairs-practice/index.html`.
3. Wait for the bottom "Speech diagnostics" panel. Tap Start once, listen,
   replay, answer both rounds, then test interruption by switching apps/locking
   during playback and deliberately tapping Start again if it fails. Do not
   answer an unheard word. Failure must retain the round/score and allow retry.
4. Open the panel and copy its JSON (or use remote Web Inspector and
   `JSON.stringify(window.soundwiseSpeechDiagnostics.snapshot(), null, 2)`).
   Record the selected voice, voice count, submit/start/end/error timing,
   paused/pending/speaking flags, timeout, and separately **heard / silent**.
   Repeat cold-load and retry after voices arrive. Logs stay on the device.
5. Compare baseline settings first; then diagnose with Silent Mode off, media
   volume raised while speech plays, and Bluetooth/AirPlay disconnected so output
   uses the phone speaker. Note any setting-dependent change; do not infer that
   successful callbacks mean audibility or diagnose mute from JavaScript alone.
6. Run `rtk proxy npm run preview -- --host 0.0.0.0 --port 4173` after the passing
   build. Repeat the acceptance matrix on LAN port 4173 using production routes
   `/`, `/bad-vs-bed/`, and `/minimal-pairs-practice/`. Debug panel is absent here.
   Verify the outbound CTA independently; D4's English summary-CTA capability
   decision is unchanged, so use the existing page CTA where applicable.

Each cell requires human-confirmed sound on that same physical iPhone. All are
pending, across the homepage demo and at least bad/bed; include the hub too.

| Acceptance test | Safari iOS | Firefox iOS | Chrome iOS |
| --- | --- | --- | --- |
| Initial Start is audible | Pending — required | Pending — required | Pending — required |
| Replay is audible | Pending — required | Pending — required | Pending — required |
| Multiple rounds play correctly | Pending — required | Pending — required | Pending — required |
| Retry after interruption works | Pending — required | Pending — required | Pending — required |
| Completion and CTA work | Pending — required | Pending — required | Pending — required |

**Risk and handoff.** Start/end is browser-reported playback success, never
confirmation that sound reached the listener. The 6 s bound can reject a slow
voice startup. A browser emitting no start now correctly fails closed. Leaving
before a final replay settles can still omit completion, as D3 records. Device
output routing, OS voice availability, private browsing/settings and iOS behavior
remain unverified. No push, merge or deployment has been performed.

The local implementation commit is titled `fix: fail closed on incomplete speech playback`;
resolve its SHA with `git log -1 --format=%H --grep='fix: fail closed on incomplete speech playback'`.
Rollback after preserving any later work: `git revert <that-local-commit-SHA>` and
rerun `npm test` / `npm run build`. This restores the previous behavior, including
its known unsafe success handling; it is not a remedy for the original silence.
Release stays **BLOCKED** until Safari and Firefox are audible on the affected
phone and all three browsers pass the matrix. No production success is claimed.

### D6. iOS 27.2 Silent Mode reproduction (2026-11-15)

**Baseline FAIL; candidate BLOCKED — awaiting device verification.** The owner
retested deployed `5077762` and reports Safari and Firefox remain silent on
mobile while desktop works. On the affected iPhone running **iOS 27.2**, both
the homepage and practice pages are affected. In the Safari follow-up, answer
buttons become available despite silence; **turning Silent Mode off makes speech
audible**. This is device evidence from the owner, not an automated observation.
Firefox's Silent Mode-off result has not been separately confirmed.

The prior patch repaired unsafe callback/state handling but did not remedy
Silent Mode-dependent output. Root cause is now confirmed at the behavioral
level for Safari: physical output depends on Silent Mode even when the browser
reports completed speech. The precise OS/session category remains an inference.
Voice-loading and gesture-loss explanations are lower priority for this specific
reproduction because the same page speaks when that one device setting changes.

**Candidate correction: request playback session before speech.**

- `src/speech-playback.js` requests `window.navigator.audioSession.type =
  'playback'` synchronously before constructing/submitting an utterance, if that
  API exists and the type is not already playback. No startup audio session
  change occurs merely from loading the page. Retry rechecks the preference.
- Unsupported API or rejected getter/setter preserves the existing speech path;
  this is a compatibility fallback, not evidence that muted output is solved.
  Start-before-end, watchdog, cancellation, scoring and completion safeguards
  remain in place. No voice, timing, analytics, URL, content or exercise-UX change.
- `src/speech-diagnostics.js` adds session type/state and state-change events to
  the existing development-only local panel. Session configuration errors are
  distinguished from speech errors. Nothing is uploaded or added to analytics.
- [WebKit maps the browser's playback type to MediaPlayback](https://github.com/WebKit/WebKit/blob/main/Source/WebCore/Modules/audiosession/DOMAudioSession.cpp).
  [Apple documents that its playback category continues through Silent Mode](https://developer.apple.com/documentation/avfaudio/avaudiosession/category-swift.struct/playback).
  This supports the candidate; it does not prove that the affected browser's
  speech synthesizer uses the page's requested session. That requires retesting.

**Alternatives.** Leaving session policy unchanged and requiring Silent Mode off
is the confirmed workaround. A silent HTML audio warmup would add a second player
and asset plus new activation/cancellation behavior without a website reproduction
proving it necessary; defer it. Waiting for voices, changing voices or adding
resume/delay loops does not address the newly observed Silent Mode dependence.
The standard session preference is the smallest causal change to test first.

**Validation.** The new production-function regression failed before this change
(`auto` was still selected at `speak()`) and passes after it. Five added tests
cover synchronous session setup, already-configured sessions, rejected getter,
rejected setter, and retry after the browser changes the preference.

```bash
rtk proxy node --test --test-reporter=spec scripts/speech-playback.test.mjs scripts/exercise-lifecycle-speech.test.mjs scripts/seo-exercise-ux.test.mjs scripts/exercise-engine.test.mjs scripts/seo-exercise-adapter.test.mjs
# PASS: 86 tests
rtk proxy npm test
# PASS: 275 tests
rtk proxy npm run validate:landing-copy
rtk proxy npm run validate:funnel-tracking
rtk proxy npm run validate:app-store-tracking
rtk proxy npm run validate:seo-conversion-matrix
rtk proxy npm run build
# PASS, including all build gates; existing RTL/fallback-link guidance remains
```

The D5 `validate:localized` command was repeated verbatim: all 14 pair pages pass.
Desktop Chromium with the real speech engine reports start/end successfully on
the API-unavailable compatibility path. At 390 px, the production-preview browser
harness uses controlled speech and a session stub: every utterance must observe
`playback` at submission, and both surfaces must recover through end-only/error
failures, retry and hung final replay with exactly-once tracking. This verifies
wiring/state behavior, not Silent Mode or audible iPhone output. Attempted desktop
WebKit automation could not run because its browser executable is not installed;
no iOS-browser verification is inferred from Chromium. Local harness/evidence:
`output/playwright/check-audio-session.js` and `check-audio-session-result.txt`.

**Acceptance and risks.** Reload the deployed candidate in Safari, Firefox and
Chrome on the same iPhone. With **Silent Mode on**, verify audible initial Start,
sample replay, both rounds, interruption/retry, summary and CTA on `/` and
`/bad-vs-bed/`; repeat with Silent Mode off. All candidate device checks remain
pending, and the D5 matrix is not passed. The current workaround is Silent Mode
off. A normal start/end sequence still cannot prove physical audibility.

The playback preference is page-wide and may interrupt music from another app.
The OS may ignore it for speech; a successful setter or session state of active
is not proof of sound. If the device remains silent with this candidate, stop
stacking workarounds and inspect the new session diagnostics; consider a small
explicit hearing check before scoring because silent success is now demonstrated.

Deployment for device testing follows the owner's existing push/deploy request;
this is not an acceptance PASS. The previous production deployment of `5077762`
succeeded in [run 43664915161](https://github.com/jwfreed/english-minimal-pairs-landing/actions/runs/43664915161).
The new commit is titled `fix: request playback audio session before speech`.
Rollback: `git revert <that-commit-SHA>` and redeploy via the unchanged workflow.
D3, D4 and D5 are preserved as historical records.

### D7. Failed session candidate; isolated phone diagnostics (2026-11-15)

**Release FAIL for the reported mobile behavior; diagnosis awaits phone logs.**
After deployment of `0ba4357`, the owner still reports no audio in Safari and
Firefox mobile. Safari now shows an audio playback error; Firefox does not.
The exact Safari message and whether Silent Mode off still works on this new
build are pending. Do not infer identical callback sequences from both browsers.
The session request is therefore not a verified remedy. D6's prior Silent Mode
off observation applies to the previous device test, not automatically this one.

Rather than change the speech policy again, this deployment adds only a
standalone support diagnostic at `/audio-check.html`. `vite.config.js` explicitly
registers it; robots metadata is `noindex, nofollow`, it is omitted from the
sitemap, and no marketing page links to it. It has no canonical because the
architecture gate prohibits canonical targets that are non-indexable. The gate
initially caught that conflict and the page was corrected; no validator changed.

`src/audio-check.js` records browser/platform, available English voices,
selection, session type/state, activation, callback timings, errors and timeouts.
Three explicit user-triggered probes compare plain speech (default or chosen
voice, auto/playback session), the actual production `speakWord` function, and a
quiet generated PCM WAV through HTML audio. The raw probe is intentionally
separate from exercise orchestration. A bounded timeout releases controls on
failure. User-reported Heard/Silent results are kept distinct from browser
callbacks. The page has no exercise, scoring, microphone, analytics, third-party
scripts, upload or persistent storage. It retains at most 200 records in page
memory and provides a copyable report, with selectable text as clipboard fallback.
It does not autoplay or prime a media session for the normal exercises.

This is a deliberate, isolated hosted diagnostic for the owner's deployment/test
workflow: the original inline diagnostic remains development-only. Production
exercise code and playback policy are unchanged in this deployment. Remove the
support page/module/build entry after the physical-device cause is resolved.

**Verification:** `npm test` (275), `validate:landing-copy`,
`validate:funnel-tracking`, `validate:app-store-tracking`,
`validate:seo-conversion-matrix`, and `npm run build` pass. Build includes all
source and dist gates and preserves the existing fallback-link warning.
Desktop Chromium exercises all three probes, report copying/listener outcomes,
control recovery and 390 px layout. Controlled errors/timeouts are also exercised
in-browser. These are diagnostic-function checks, not iPhone audibility evidence.
No independent physical iPhone or Web Inspector is available here.

**Phone procedure:** In Safari, open `/audio-check.html` with Silent Mode on.
Leave the plain-speech selectors at their defaults. Run the three tests in order,
mark each Heard/Silent, and copy the report into the conversation. Reload and
repeat with Silent Mode off. Repeat in Firefox. If plain speech works but the
exercise player does not, compare the same explicit voice and requested session
using the selectors; otherwise leave those controls unchanged for the first run.
A test tone playing with silent speech isolates media output from the speech
path; it does not by itself identify the cause. Browser error codes will guide
the next correction. Do not declare a fix from desktop callbacks.

Commit title: `diagnostics: add isolated mobile audio check`. Rollback is reverting
that commit and redeploying. Earlier release checks/investigations remain intact.

### D8. Silent media keepalive candidate (2026-11-15)

**Candidate; awaiting device verification.** The owner confirms Safari and
Firefox mobile are silent only while Silent Mode is on. The `0ba4357` session
preference alone did not change output. WebKit derives the page's iOS audio
category from playing media elements; `speechSynthesis` is not one, so the
ambient (ringer-switch-muted) category stays in effect.

- `src/speech-playback.js` now plays one reused, looping, unmuted HTML audio
  element of generated silence (0.5 s, 8-bit 8 kHz WAV blob) synchronously
  before `speak()` and pauses it at settlement (end, error, timeout, cancel,
  exception). It is not awaited, so speech stays in the tap's gesture stack.
  Reuse lets automatic replays keep the first tap's media activation. A
  rejected `play()` is diagnosed and never blocks speech. The playback session
  request is kept. No voice, timing, scoring, analytics or content change.
- Risk: like the session request, playing media can pause another app's music.
- Tests: three regressions (order play → speak → pause and element reuse;
  rejected play; timeout stops media) fail on `fb8fc9b` and pass now.
  `npm test` (278), the four release validators and `npm run build` pass.
  Desktop Chromium preview at 390 px: `/audio-check.html` exercise probe
  records `media-keepalive` and `settled:ended` with no page errors. This is not
  iPhone audibility evidence.

**Acceptance:** with Silent Mode on, in Safari and Firefox on the iPhone,
`/audio-check.html` (`audio-check-v2`) exercise probe audible while plain speech
stays silent; then `/` and `/bad-vs-bed/` initial Start, replay, both rounds and
summary audible. Repeat with Silent Mode off. Rollback: revert the commit.

### D9. Private prerecorded TTS pilot (2026-11-18)

**Release verdict is BLOCKED.** The production audio-check page still serves
the silent-media keepalive implementation at `bc19189`. The reports confirm
that Safari on the affected iPhone can speak with Silent Mode off. Earlier
tests reported silence with Silent Mode on in Safari and Firefox, and audible
speech in Chrome. The Firefox and Safari pilot results below distinguish
audibility on the two playback paths. The full exercise and Chrome pilot
still need testing on that iPhone.

The recorded-audio draft was present in the working tree but would select
recorded playback in any browser with HTML audio, despite having no word files.
The draft would cause every clip request to fail. Restrict the draft to an
explicit development preview for **ship/sheep**, using two existing TTS samples
from the private VoiceStudio pilot. The playback code calls HTML media
`play()` synchronously, waits for its own start promise and end, and keeps the
timeout and cancellation safeguards. A late event from a prior source cannot
complete an active clip that is still playing. Failed media is retried only
from the existing user controls. The diagnostic page can compare this path
with plain Web Speech and the generated tone. The production build continues
to use the current Web Speech path and contains neither pilot recording.

**Architecture decision.** Use the device comparison to determine whether
prerecorded TTS through HTML audio solves the Silent Mode reproduction.
Browser TTS has no word-asset maintenance and uses the user's installed voices,
but gesture, voice selection and session tweaks have not demonstrated reliable
Silent Mode output. Prerecorded TTS decouples pronunciation and playback from
the device's speech synthesis. This adds asset review and publishing. Apple
documents AAC support on Safari for iOS. Confirm the same media path in Firefox
and Chrome and on the target desktop browsers.
([Safari supported media](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html))

The catalog and all homepage locales together use 50 distinct words. The
app uses device TTS and has only silent warmup audio. VoiceStudio's nearby
private pilot covers eight word types overall and has no approved output
redistribution or human pronunciation review. The nearby Azure and Polly
research also leaves production rights open. The owner prefers TTS. If
HTML audio is audible on the iPhone, source all missing clips from a cleared
TTS voice and confirm redistribution terms before generating the full set.
The proposed workflow is to use a consistent English voice for each contrast,
review both takes for audible contrast and comparable level/rate, and record
voice, source, licensing, IPA, and file hashes. Resolve ambiguous words such
as `live` (/lɪv/) explicitly and review dialect-specific vowels against the
page's intended contrast. Encode comparable mono AAC and validate the complete
catalog and homepage inventory before activating it. A new word must come
with a reviewed clip. The two 24 kHz samples total 16,712 bytes, approximately
0.4 MB for 50 clips of comparable size. Load only requested words and allow
normal browser caching. The site has no offline guarantee for uncached files.
Full asset acquisition and production activation remain outside this pilot.

**Run the private pilot on trusted LAN Wi-Fi.** In the landing repo, use the
existing adjacent local VoiceStudio pilot. The converted files live in ignored
`.generated`, outside Vite's public directory. Run on the same Mac and
Wi-Fi as the iPhone.

```sh
rtk proxy mkdir -p .generated/word-audio
rtk proxy afconvert -f m4af -d aac -b 48000 ../english-minimal-pairs-voicestudio-pilot-2026-10-19/audio/candidate/candidate-ivsi-v01-ship-t01.wav .generated/word-audio/ship.m4a
rtk proxy afconvert -f m4af -d aac -b 48000 ../english-minimal-pairs-voicestudio-pilot-2026-10-19/audio/candidate/candidate-ivsi-v01-sheep-t01.wav .generated/word-audio/sheep.m4a
rtk proxy npm run dev -- --host 0.0.0.0 --port 5180 --strictPort
```

With Silent Mode on, open `http://<Mac-LAN-IP>:5180/audio-check.html?recordedAudio`
in Safari, Firefox, and Chrome. Compare plain speech, exercise speech (the
recorded clip), and the test tone, recording Heard or Silent for each. Repeat
with Silent Mode off. If the recordings are audible, verify pronunciation,
Start, replay, two rounds, recovery, summary and CTA on these Vite source URLs
with `?recordedAudio&speechDebug` appended. Select English on the homepage
so the preview targets ship/sheep.

- Homepage `/`
- English hub `/content/pairs/minimal-pairs-practice/index.html`
- English pair `/content/pairs/ship-vs-sheep/index.html`
- Japanese pair `/content/locales/ja/ship-vs-sheep/index.html`

The controller's callbacks establish playback state only. Record what can
actually be heard before declaring device acceptance. If both the tone and the
recording are silent, investigate the phone's media output before adopting
recorded audio. If only the Web Speech path is silent, the recording avoids
that path. Record each browser's device results separately.

**Initial verification.** The focused suite
(`rtk proxy node --test --test-reporter=spec scripts/speech-playback.test.mjs scripts/exercise-lifecycle-speech.test.mjs scripts/seo-exercise-adapter.test.mjs`)
passes 52 tests. `rtk proxy npm test` passes 280 tests.
`rtk proxy npm run build` and
`npm run validate:landing-copy`, `npm run validate:funnel-tracking`,
`npm run validate:app-store-tracking`, and `npm run validate:seo-conversion-matrix`
pass, as does `npm run validate:localized -- --page ja/ship-vs-sheep`.
Chromium at 390 px loaded the actual AAC files on all four routes above,
recovered from an injected clip request failure, replayed the stimulus and
completed both rounds. Each run emitted one exercise start, one completion
and one App Store click to a local tracking stub. The build includes the usual
localized-link warning and omits the pilot media. The existing device failure
remains the release blocker. The pilot commit can be reverted locally.

**Firefox physical-device result (2026-11-18).** In the owner's
`audio-check-dev` report, Firefox for iOS (UA token `FxiOS/160.0`) exposed 71
voices. Plain speech used the browser default English voice. It reported
start and end with user activation present, but the listener marked it
**silent**. The prerecorded `ship.m4a` and the independent HTML audio tone
both completed and the listener marked both **heard**. The owner confirmed
Silent Mode was on during this run. This isolates the observed silence to
the live speech path in Firefox under that setting and validates the recorded
clip as an audible alternative.

**Safari physical-device result (2026-11-18).** The owner's
`audio-check-dev` report identifies Safari 27.2. User activation was present
and the browser default voice reported start and end. The listener marked
plain speech **silent**, and marked the same prerecorded `ship.m4a` and HTML
audio tone **heard**. This reproduces Firefox's separation between live
speech and file playback. Silent Mode was requested for this check, but the
Safari report itself contains no hardware Silent Mode reading.

**Selected playback path.** Prerecorded TTS through HTML audio is the release
candidate for scored exercises. An audible file and tone on both affected
browsers establish that the phone can play the stimuli over this path. Playback
events alone cannot establish audibility. Chrome and end-to-end acceptance
for the final clips remain pending.

**Production voice candidate.** Evaluate Piper `en_US-ljspeech-medium`
offline. Its card identifies training from scratch on the public-domain LJ
Speech dataset. Piper's commercial-use list corroborates the dataset
provenance and its licensing guide distinguishes the training data terms
from model and output rights. Verify the exact model revision and terms
before release.
([Voice card](https://huggingface.co/rhasspy/piper-voices/blob/main/en/en_US/ljspeech/medium/MODEL_CARD),
[LJ Speech source](https://keithito.com/LJ-Speech-Dataset/),
[Piper commercial-use list](https://github.com/OHF-Voice/piper1-gpl/blob/main/docs/COMMERCIAL_USE.md),
[Piper licensing](https://github.com/OHF-Voice/piper1-gpl/blob/main/docs/LICENSING.md))

The six private audition clips for `ship/sheep`, `live/leave` and `law/low`
are available at `/.generated/piper-audition/index.html` on the LAN preview.
They use Piper 1.8.0 with the model repository pinned to
`0ca208afc2a2ee102b1e961e72e0a7e4907be3d0` and the verified model SHA-256
`6f52a751e2349abe7a76735eb09dc1875298c77ea2342ffd2fef79ff81b87f22`.
The `live` clip uses the explicit eSpeak phonemes `lˈɪv`. These three pairs
check vowel length, the homograph `live`, and dialect-dependent vowel quality.
The samples use mono AAC at 22.05 kHz, range from 0.42 to 0.53 seconds before
encoding, and total 44,983 bytes. A listening review is pending. After owner
approval, generate the full set locally and validate each AAC file and its
catalog mapping against a pronunciation manifest. The deployable artifacts
are the reviewed audio files and player code. Synthesis runs offline.

### D10. Recorded TTS release candidate (2026-11-18)

**Device evidence.** The owner confirmed Silent Mode was on during both the
Firefox and Safari probes. In both browsers live speech finished silently
while the recorded `ship` and the test tone were audible. The test establishes
that recorded media bypasses the observed live-speech failure on those
browsers. The owner approved local generation of the complete vocabulary.

**Playback.** Homepage, hub and pair exercises use the same recorded-clip
player, including for preview and feedback replay. The first tap issues
`Audio.play()` synchronously. Replays reuse the media element. Scoring still
requires the current play request to start and end. Cancelled, stale, rejected
or timed-out requests leave the attempt unscored. The independent plain speech
and tone controls remain on the unindexed audio-check page for diagnosis.

**Source and regeneration.** The 50 clips in `public/audio/words/` were
generated offline using Piper 1.8.0 and ONNX Runtime 1.23.2. The pinned LJ
Speech medium model and config hashes are recorded in
`scripts/generate-word-audio.py`. The model author lists this voice as public
domain and the source dataset is public domain. The pinned model card records
training from scratch. Only synthesized audio and its manifest are served.
([Author's voice and license notes](https://brycebeattie.com/files/tts/),
[pinned model card](https://huggingface.co/rhasspy/piper-voices/blob/0ca208afc2a2ee102b1e961e72e0a7e4907be3d0/en/en_US/ljspeech/medium/MODEL_CARD),
[LJ Speech dataset](https://keithito.com/LJ-Speech-Dataset/))

The generator reads the catalog, uses US English phonemes and forces the verb
`live` to /lɪv/. It matches clip levels with linear gain, encodes mono AAC, and
writes the catalog IPA, actual phoneme input and file checksum to the manifest.
All 50 built clips decode as 22.05 kHz mono audio. Decoded duration is
0.29–0.74 seconds and RMS is −20.30 to −19.97 dBFS with peak below clipping.
The clips total 364,870 bytes. The player requests one word at a time. The
build checks coverage and checksums against the current catalog and homepage
configuration.

```sh
rtk proxy /tmp/soundwise-piper-audition-venv/bin/python scripts/generate-word-audio.py /tmp/soundwise-piper-audition-model/en_US-ljspeech-medium.onnx public/audio/words
rtk proxy node --test scripts/speech-playback.test.mjs scripts/exercise-lifecycle-speech.test.mjs scripts/seo-exercise-adapter.test.mjs scripts/seo-exercise-ux.test.mjs
rtk proxy npm test
rtk proxy npm run build
rtk proxy npm run validate:landing-copy
rtk proxy npm run validate:funnel-tracking
rtk proxy npm run validate:app-store-tracking
rtk proxy npm run validate:seo-conversion-matrix
rtk proxy npm run validate:localized -- --page ja/ship-vs-sheep
```

The focused suite passed 45 tests and the full suite passed 259. The build and
all listed validators passed. The total test count decreased because the
exercise player no longer has voice selection, live speech callbacks or the
silent-media keepalive. Lifecycle regressions still cover retries, cancellation,
focus, scores and exactly-once tracking through a controlled media player.

Chromium at 390 px exercised the built homepage, English hub, bad/bed and
Japanese ship/sheep pages. Each flow recovered from a blocked clip request,
replayed a stimulus and finished both rounds. Each recorded one start, one
completion and one App Store click against a local tracking stub. Chromium
also decoded every clip in the manifest. These checks establish usable files
and correct state transitions, while pronunciation and audibility require
listening.

**Acceptance before merge.** Serve the built site with
`rtk proxy npm run preview -- --host 0.0.0.0 --port 4180 --strictPort`.
On the affected iPhone with Silent Mode on, complete both rounds and replay
the sample in Safari, Firefox and Chrome. Check the homepage, practice hub,
`/bad-vs-bed/` and `/ja/ship-vs-sheep/` as representative routes. Confirm the
words match the intended pronunciations and the result opens after both
answers. The LAN development server has a side-by-side listening review at
`/.generated/word-review.html` for the entire set. Initial physical-device
probes passed in Safari and Firefox, and the final build is awaiting device
acceptance. Release remains **BLOCKED**. Rollback is reverting the recorded
audio commit. Production still serves the previous implementation.

### E. Decision log and proposed transitions

Decisions made on 2026-11-13:

| Decision | Why | Evidence |
| --- | --- | --- |
| Adopt the Growth Portfolio as the operating model | Owner direction in the kickoff brief | Organic sessions flat for three windows (153, 157, 163) |
| Judge changes by pooled 28-day windows and pre-set directional rules | No page can reach a readable sample | Hub: 4 landings in 27 days |
| Define qualified and activated visits as in section A (proposed) | "Organic sessions" mixes engaged and unengaged visits and ignores referral | Section B |
| Do not rewrite bare-pair titles (S-10 STOPPED) | The one test lost impressions without gaining clicks | `/man-vs-men/`: 1,633 → 598 impressions, 2 → 2 clicks |
| Select S-01, D-1 and A-1 as the three bets | Highest score in each workstream; S-01 also gives D-1 a page worth linking | Section C |
| Local `main` fast-forwarded to `origin/main` (`b8e31f3`) before editing | Three checkpoint commits existed only on the remote | `git log` |

Decisions made on 2026-11-14:

| Decision | Why | Evidence |
| --- | --- | --- |
| **T-1 approved**; EXP-HUB-1 observational; hub restriction lifted | Owner approval; the link-only comparison was never readable | Hub: 4 landings in 27 days; 2026-10-23 confounders |
| Fix speech playback hang with a 6 s watchdog | A silent browser could trap a learner with disabled answers | Reproduced with stubbed speech; regression tests |
| No CTA change | English summary CTA absence follows the capability design; changing it is a product decision | Section D2 |

**Proposed transitions. None is in force until the owner approves it.** All
historical findings, dates and confounders below stay in the record. The
2026-12-11 hub readout stays as a reporting checkpoint, read as directional.

| ID | Item | Proposal | Evidence | What we give up | What it frees |
| --- | --- | --- | --- | --- | --- |
| T-1 | EXP-HUB-1 | **APPROVED 2026-11-14.** DOWNGRADE TO OBSERVATIONAL; end the hub page freeze now | 4 hub landings in 27 days against 15–18 before; mixed exposure since 2026-10-23 | A link-only attribution that could not be obtained anyway | S-01, D-2 on the hub |
| T-2 | EXP-HUB-2 | DOWNGRADE TO OBSERVATIONAL; one readout on 2026-12-11 with EXP-HUB-1 | Live since 2026-10-23T01:09Z; hub 5 clicks / 161 impressions after | Nothing; it has no control | No separate bookkeeping |
| T-3 | EXP-LIVE-1 | DOWNGRADE TO OBSERVATIONAL; one readout on 2026-12-11 | Live since 2026-10-23T01:09Z; meaning and difference queries 1,251 impressions, 0 clicks; pronunciation queries 302 impressions, 2 clicks | Nothing | `/live-vs-leave/` copy can change again |
| T-4 | `conversion_serp_cta_v1` | CLOSE AS INCONCLUSIVE; leave both treatment pages as they are; remove the registry entry and the presentation freeze in a separate approved change | 2026-09-02 → 2026-11-10 organic landings: treatment 36 sessions, 9 starts, 2 store clicks; control 39, 7, 1. Control copy changed 2026-10-23 | The only controlled test on the site; it would need years to read | S-04: five routes, 39% of impressions; ends the Class-1 snippet exclusion |
| T-5 | `/man-vs-men/` title test | CLOSE AS INCONCLUSIVE; keep the current title | Impressions 1,633 → 598, clicks 2 → 2, position 8.8 → 7.1; 2–6 organic landings a month | Reverting would be one more unreadable change | Page leaves the exclusion list |
| T-6 | 2026-10-22 and 2026-10-23 releases | Record as permanent boundaries, not experiments: `15e7a9c` 2026-10-22T02:23Z (cap/cup explanation), `7013956` and `84909a3` 2026-10-23T01:09Z (hub and live/leave copy, preferred-source button), `03cde4d` 05:23Z and `e37c072` 07:44Z (homepage video) | GitHub Actions run times | — | Before/after reads split at these times |
| T-7 | EXP-RU-WATCH | CONTINUE; it costs nothing and restricts nothing | Window 1 (2026-10-14 → 2026-11-10): 12 clicks / 826 impressions, CTR 1.45%, 29.5 impressions a day. Misses expand (needs ≥20 clicks and CTR ≥2%); above deprioritize | — | S-07 waits for window 2, ending 2026-12-08 |
| T-8 | Completion-event timing | CONTINUE unchanged until A-1 reports; any change is a dated boundary | See Current blockers | A possible undercount persists | — |

T-4 changes a tracking parameter (`content_variant` stops being sent on two
pages) and edits validators and tests. It needs explicit approval and its own
entry in `docs/analytics-and-attribution.md`.

### F. Weekly operating scorecard

Source: GA4 Data API (`.seo-god/ga4-report.py` credentials), ISO weeks,
`sessionDefaultChannelGroup != Direct`; GSC by date. Fill one row each Monday
for the week just ended. Read trends over four rows, never one.

| ISO week (Mon–Sun) | Non-Direct sessions | Qualified visits | Activated visits | Completions | App Store click sessions | Referral sessions | GSC clicks | Outreach sent / placements | Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 28-day baseline ÷ 4 | 45 | 28 | 8.5 | 5.5 | 5.8 | 2 | 32 | 0 / 0 | 2026-10-14 → 2026-11-10 |
| W43 (Oct 19–25) | 41 | 28 | 10 | 4 | 6 | — | 32 | 0 / 0 | 10-23 releases |
| W44 (Oct 26–Nov 1) | 56 | 30 | 10 | 8 | 5 | — | 37 | 0 / 0 | |
| W45 (Nov 2–8) | 35 | 24 | 6 | 3 | 3 | — | 25 | 0 / 0 | |
| W46 (Nov 9–15) | | | | | | | | | Kickoff 11-13 |

Targets for the window ending 2027-02-09 (proposed): qualified visits 56 a
week (225 per 28 days), activated visits 15 a week, activation share ≥15%,
referral sessions ≥4 a week.

### G. Next actions

| # | Action | Who | Approval |
| --- | --- | --- | --- |
| 1 | Review branch `growth/hub-exercise-and-speech-reliability`; decide whether to merge and deploy S-01 and the speech fix. Record commit and UTC time here after deploy | Owner | **Needed** (merge, push, deploy) |
| 2 | Review outreach drafts A and B and the target list; send the first eight once S-01 is live | Owner | **Needed** to send |
| 3 | Recruit two learners and run the first two A-1 sessions, including one on an iPhone with the silent switch on | Owner | Not needed |

Also awaiting the owner: T-2 to T-5, an English in-exercise App Store CTA decision, the `exercise_complete` timing note (D2), the objective and guardrail in section
A, and the 40/35/25 effort split.

---

# Historical record: October 2026 SEO cycle

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
| Decision | Pending. This change is directional. A significance test is not achievable at this traffic. **2026-11-14: downgraded to observational (T-1); the hub restriction is lifted.** |

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

> 2026-11-14: the hub dependency below ("must stay unchanged until the
> EXP-HUB-1 readout") is lifted by T-1; both edits were already live from
> 2026-10-23. The `/live-vs-leave/` dependency is unchanged.

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

### 2026-11-13 — Four-week sanity check (incomplete; no experiment decision)

- Attempted live GA4 Data API reads for organic landing sessions on `/minimal-pairs-practice/` for 2026-10-17–2026-11-12, plus GA4 metadata. Both returned `invalid_grant: Bad Request`. Thus the distinct organic landing-session denominator, ordered `exercise_start` rate, and secondary `exercise_complete` / `app_store_click` session counts **could not be verified**. Do not substitute event totals or infer zero traffic.
- Attempted GSC page performance for 2026-10-17–2026-11-10 and comparison period; both also returned `invalid_grant`. This is an access blocker, not evidence of a traffic regression. The working Python GA4 route reported in October was not available in this run.
- GitHub history confirms changes on 2026-10-23: `7013956` (hub copy and live/leave content) and `84909a3` (Google preferred-source button), followed by homepage video commits. These establish an additional exposure boundary after the original 2026-10-16 hub-link release. Exact production deployment time was not independently verified in this check. Consequently, the original link-only treatment is not isolated across the full observation window.
- Instrumentation health and actual user abandonment cannot be reassessed without a successful analytics read; no new regression is demonstrated. No site code or experiment configuration changed during this check.
- **Next:** reauthorize the GA4 and GSC connector tokens or use the previously working local Python GA4 route; retrieve distinct organic hub-landing sessions and ordered funnel counts for 2026-10-17–2026-11-12, splitting at the verified October 23 production deployment boundary. Check event volume and data freshness, then retain the December 11 readout as directional only. **No expand/stop decision today.**


### 2026-11-13 — Sanity-check rerun (GSC restored; GA4 still blocked)

- Re-ran connected read-only APIs on November 13. **GSC succeeded** for `sc-domain:getsoundwise.co`; the connected GA4 Data API still returned `invalid_grant: Bad Request`. Do not treat missing GA4 measurements as zero. The separate local Python authorization was not tested in this rerun.
- Latest available finalized GSC data ended **2026-11-10**. Matched 25-day windows: 2026-09-22–2026-10-16 (before) vs 2026-10-17–2026-11-10 (after). Property-wide: **116 clicks / 24,959 impressions (0.465% CTR)** vs **115 / 23,255 (0.495%)**. No meaningful sitewide click growth.
- Exact English hub page `https://getsoundwise.co/minimal-pairs-practice/` (excluding all localized hubs): **8 clicks / 204 impressions (3.92% CTR)** before vs **5 / 161 (3.11%)** after. These counts are too small for a change verdict; GSC clicks do not measure organic GA4 landing sessions or exercise starts.
- The October 23 additional changes remain a separate confounder. GSC can describe search visibility but cannot isolate the Oct 16 link-only effect or verify exercise engagement. No production browser QA or code-instrumentation tests were performed in this API-only rerun.
- **Outstanding:** retrieve GA4 distinct organic hub-landing sessions and ordered `exercise_start`, `exercise_complete`, and `app_store_click` session counts, split around the October 23 deployment boundary where feasible. **No experiment decision**; preserve December 11 readout as directional.


### 2026-11-13 — Sanity-check rerun, GA4 and GSC both verified

- Connected GA4 Data API **succeeded** for property `properties/536565930` (GA4 reporting time zone: America/New_York). The same connected GSC API also succeeded for `sc-domain:getsoundwise.co`. This supersedes the earlier November 13 GA4 `invalid_grant` blocker for these connected read paths; it does **not** establish whether OpenSEO's separate GA4 integration has recovered.
- GA4, English hub `/minimal-pairs-practice`, `sessionDefaultChannelGroup = Organic Search`: **2026-10-17–2026-11-12 (27 days): 4 landing sessions, 2 sessions with `exercise_start` (50.0%), 2 with `exercise_complete`, 1 with `app_store_click`**. Event counts respectively 4 starts, 3 completions and 1 App Store click. `sessions` grouped by `eventName` counts sessions containing each event, not a verified *ordered* event funnel.
- Immediate preceding comparison **2026-09-19–2026-10-16 (28 days)**: 15 hub landing sessions, 4 with `exercise_start` (26.7%), 2 with `exercise_complete`, 2 with `app_store_click`. Not equal-length windows; October 16 includes partial treatment exposure, so this is an operational reference **not** a clean causal control.
- By GA4 date, earlier exposure **Oct 17–22**: 1 hub organic session, 1 session containing a start, 1 containing a completion, 0 App Store clicks. **Oct 23–Nov 12**: 3 hub organic sessions, 1 containing a start, 1 containing a completion, 1 App Store click. October 23 content/button deployment is an additional confounder; a date-level split does not prove the exact transition hour.
- Site-wide `Organic Search` sessions: **150** in Oct 17–Nov 12 (27 days), versus **158** in Sep 19–Oct 16 (28 days); engaged organic sessions **96 vs 95**. The site's organic traffic is broadly flat, while the English hub's four observed sessions are too few to distinguish a regression or improvement. No absence of instrumentation events can be inferred from an empty row at this sample size.
- GSC, as in the earlier successful rerun: matched 25-day periods Sep 22–Oct 16 versus Oct 17–Nov 10, English hub **8 clicks/204 impressions (3.92% CTR)** versus **5 clicks/161 impressions (3.11% CTR)**. Site-wide clicks **116 versus 115**. GSC clicks and GA4 landing sessions are different measures, with different freshness and attribution.
- **Sanity verdict: no clear site-wide organic regression; hub activation is inconclusive. No expand/stop decision.** Preserve the December 11 readout as directional, given mixed October 16/23 exposure and low traffic. No production browser QA, repository instrumentation audit, or event-level sequencing analysis was performed in this API-only rerun.


## Current blockers

| Blocker | Next action |
| --- | --- |
| EXP-HUB-1 observation window is running | Read out after 2026-12-11. Report distinct hub-landing organic sessions with a later `exercise_start`, with the secondary metrics, as directional only; a before/after difference does not show cause. |
| Latent completion undercount: `exercise_complete` waits for the final replay to settle, so a browser that fires neither `onend` nor `onerror`, or a learner who leaves during the ~2 s replay, produces a summary screen without the event | Owner decision. The ordering is asserted on purpose (`scripts/exercise-engine.test.mjs`) and gates the summary CTA. A fix would be a measurement discontinuity, so it should not ship during EXP-HUB-1 unless it is recorded here as one. |
| OpenSEO's GA4 link is broken (`ga4_reconnect_required`) | The owner reconnects Analytics in OpenSEO when needed. The Python GA4 path works meanwhile. |

## Next action

*2026-11-14: T-1 was approved, so the restriction below is lifted. The text
is kept as history. Current next actions are in Growth Portfolio section G.*

EXP-HUB-1 is live (`76e3de3`, 2026-10-16T12:53Z). Make no other page changes to
`/minimal-pairs-practice/` or its metadata until the readout, so it stays
attributable. First checkpoint 2026-11-13; readout after 2026-12-11.
