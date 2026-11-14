# Growth Portfolio Working Materials

Supporting material for the Growth Portfolio in
[`seo-growth-execution.md`](seo-growth-execution.md). That tracker is the only
source of truth for strategy, status, decisions and next actions. This file
holds the long-form items the tracker points to: implementation briefs, draft
outreach, and the usability protocol. It carries no status. If the two
disagree, the tracker wins.

Prepared 2026-11-13. Nothing here has been deployed, sent or published.

## 1. Search briefs (top three opportunities)

Data: GSC `sc-domain:getsoundwise.co` and GA4 property `536565930`,
2026-10-14 → 2026-11-10 (28 days) unless stated.

### S-01: Make the English hub a listening test, not a reading page

**Learner and problem.** Someone searching "minimal pairs practice",
"minimal pairs listening practice/exercises/test" wants to do the task now.
The hub answers with about 200 lines of explanation before any practice, and
has no exercise of its own.

**Evidence.**

- The hub earns 3.2% CTR at position 12.3 (6 clicks / 189 impressions). Pair
  pages earn 0.1–0.6% at positions 5–8. Task-intent queries click; bare-pair
  queries mostly do not.
- The hub has no `[data-exercise]` mount. It already loads
  `/src/seo-page.js`, the script that mounts exercises on pair pages.
- Gemini sent 6 sessions and ChatGPT 2 to the hub since 2026-07-14: assistants
  already treat it as the practice destination.
- Teachers assigning through Google Classroom picked single pair pages
  (`/cap-vs-cup/`, `/bit-vs-beat/`, `/bad-vs-bed/`). There is no single link
  that offers several contrasts.

**Intervention (smallest version first).**

1. Mount one existing exercise directly under the definition, above the
   current three practice links:
   `<div id="hub-listening-exercise" data-exercise data-contrast="ship-vs-sheep"></div>`
   with a one-line heading such as "Try a minimal pairs listening test".
   `/ɪ/`–`/iː/` is the contrast with the widest L1 app support.
2. Keep the three contrast links as "next test" choices after the exercise.
3. Leave title, description, canonical, hreflang and URL unchanged in the
   first release. Consider a title that names "listening test" only after a
   28-day read, because the `/man-vs-men/` title change cut impressions by
   63% with flat clicks.

**Checks before building.**

- Read on 2026-11-13, not yet run: `src/seo-page.js` mounts any
  `[data-exercise][data-contrast]` element whose contrast is cataloged, and
  the hub already loads that script, so the mount should work at runtime.
  `scripts/validate-seo-exercise.mjs` skips hub slugs (`HUB_SLUGS`), so a hub
  exercise would ship unvalidated. Extend the validator to cover a hub mount
  as part of the change. If any existing gate rejects it, stop and report; do
  not route around a gate.
- `/ship-vs-sheep/` carries `contrast_journey_v1`. Mounting the same contrast
  on the hub must not assign a `content_variant` to the hub.
- Capability wording: the hub exercise CTA must resolve through
  `src/app-capability-resolver.js` like any other mount.

**Measurement.** No new events. Exercise events from the hub will arrive with
`page_slug = minimal-pairs-practice`, which is a new event source and a
measurement boundary for hub metrics; record the deploy time in the tracker.
Read pooled 28-day windows: hub organic landing sessions, share with
`exercise_start`, hub GSC clicks and position for the practice cluster.

**Success signal (directional).** In the first two 28-day windows after
deploy: hub organic landings back to ≥15 per window (they were 15–18 before
mid-October and 4–5 since), and at least half of hub landers start an
exercise. **Stop/rethink** if hub landings stay under 8 per window for two
windows; then the constraint is ranking, not page design.

**Cost.** About half a day including browser checks, if validators allow an
HTML-only mount. **Depends on:** owner approval to end the hub page freeze
(EXP-HUB-1 → observational).

### S-02: Match each localized hub's first practice links to that L1

**Learner and problem.** A Russian, Cantonese or Korean speaker lands on the
hub in their language, wanting practice for the sounds they confuse.

**Evidence.**

- Localized hubs are 37 of 163 organic sessions (23%) and 10 of the 20
  organic sessions with an App Store click. They earn 2.5–6% CTR at positions
  4–9 (`/ru/` 10 clicks / 183 impressions, `/yue/` 5 / 200, `/ko/` 3 / 70,
  `/th/` 3 / 48).
- Only 3 of those 37 sessions started an exercise.
- The first practice links are not L1-matched. `/ru/minimal-pairs-practice/`
  leads with `/ru/ship-vs-sheep/`, then English `/thin-vs-tin/` and
  `/bad-vs-bed/`; `docs/app-website-contrast-alignment.md` lists both as
  `NO_APP_SUPPORT` for Russian. Russian has exact app support for
  vest/west, cap/cup, bit/beat and live/leave.

**Intervention.** For each localized hub, reorder the first practice list
(the `sound-list` under "What are minimal pairs") so that it starts with the
localized exercise page for that locale, followed by English exercise pages
whose contrast is `EXACT_PAIR_EXISTS` for that L1 in the alignment document.
Link text stays in the hub's language with English target words visible. No
new pages, no new claims. Start with `ru`, `yue`, `ko`, `zh`, `th`, `ja`
(the six with measurable traffic), then the rest.

**Checks.** `npm run validate:localized -- --page <locale>/minimal-pairs-practice`
per edited page; preserve section IDs; do not touch
`content/locales/<locale>/index.html` (generated homepages).

**Measurement.** Pooled across localized hubs, 28-day windows: share of
localized-hub organic landings with `exercise_start` (baseline 3/37) and with
`app_store_click` (baseline 10/37, a guardrail: it must not fall).

**Cost.** About one day for six locales. **Depends on:** nothing frozen; needs
owner approval to deploy.

### S-03: Answer "X vs Y pronunciation" at the top of unfrozen pair pages

**Learner and problem.** Queries such as "three vs tree pronunciation" or
"cap and cup pronunciation" come from someone who wants to hear both words.

**Evidence.** In the exported query rows, pronunciation-qualified queries
total about 1,100 impressions and 9 clicks at positions 5–8. Where the page
ranks in the top five the clicks arrive: `/three-vs-tree/` took 3 clicks from
120 impressions on this family. Exported rows cover only 38% of impressions,
so the family is larger than this, by an unknown amount.

**Intervention.** On `/three-vs-tree/`, `/cap-vs-cup/`, `/cup-vs-cop/`,
`/heart-vs-hurt/` and `/bet-vs-bat/` (none frozen): make sure the first screen
contains a short "How to pronounce X and Y" answer with IPA and the existing
jump link to the listening test, and that one H2 uses the "pronunciation"
wording. Reuse existing components; no new audio feature. Extend to the five
frozen routes only after `conversion_serp_cta_v1` is closed.

**Measurement.** GSC clicks and position for queries containing
"pronunciation" or "pronounce" on the edited pages, pooled, two 28-day
windows. **Success:** pooled position improves by at least one place and
clicks at least double from the baseline of 4. **Stop** if position does not
move in two windows.

**Cost.** About one day. **Depends on:** owner approval to deploy.

## 2. Distribution: first outreach wave (drafts, not sent)

### Rules for every message

- Send from the owner's own address, as the maker. State that plainly.
- One message per person. No follow-up unless they reply.
- Lead with what is useful to their readers. Ask for nothing in the first
  line.
- Stay inside `docs/messaging-framework.md`: no accent-fixing, native-like,
  guaranteed or clinical claims. Say "listening practice", "hear the
  difference", "two-question check".
- Use a tagged link so placements are visible in GA4:
  `?utm_source=<site>&utm_medium=referral&utm_campaign=educator_outreach_2026q4`
  (source names follow "Source Naming Standards" in
  `docs/analytics-and-attribution.md`). If a curator strips the tag, the
  referrer still identifies the source.

### Targets

Verified by fetch on 2026-11-13 unless marked. Re-open each page before
writing to it.

| # | Target | Why it fits | Route | Caution |
| --- | --- | --- | --- | --- |
| 1 | Larry Ferlazzo, "Best Websites for Learning English Pronunciation" (`larryferlazzo.edublogs.org/?p=1272`) | Lists shiporsheep.com; list dates from 2008 | Contact page lists email and a form | No stated suggestion policy |
| 2 | El Camino College ESL LibGuide, listening page (`libguides.elcamino.edu/esl/listining`) | Pronunciation links, none for minimal pairs; updated 2025-03 | "Report a problem" form | Library staff not named |
| 3 | Randall's ESL Cyber Listening Lab (`esl-lab.com`) | Large listening site, no minimal-pair practice on the home page | "Contact Randall" page | No stated link policy |
| 4 | ESL Vault minimal pairs listening (`eslvault.com/minimal-pairs-listening/`) | Worksheets only; an interactive check complements them | Contact page | Hosts its own PDFs; may not link out |
| 5 | IATEFL PronSIG *Speak Out!* (`pronsig.iatefl.org`) | Pronunciation teachers | Outline to the editor first | Needs a real practitioner note, not a product pitch; address unverified |
| 6 | r/languagelearning resource-sharing thread | Stickied thread reported as exempt from promotion limits | One post, affiliation disclosed | Rule text came from a mirror; read the live rules first |
| 7 | Niagara College ESL resources | Pronunciation resource list | Unknown | Page returned 404; re-verify or drop |
| 8 | Other college and public-library ESL guides listing pronunciation tools | Same pattern as #2 | Guide owner or feedback form | To be found: search `site:libguides.com ESL pronunciation` |

Not pursuing: italki and Preply tutor communities (italki's community policy
bans commercial-only posts and unsolicited commercial contact), launch sites
such as Product Hunt or Show HN (wrong audience, one-off), competitor sites
with their own paid libraries. Unverified and parked: r/TEFL,
r/ESL_Teachers, r/EnglishLearning rules; Facebook groups; L1-specific forums.

### Draft A: resource-list curator (targets 1, 3, 4)

> Subject: A free listening check for minimal pairs (no login)
>
> Hello [name],
>
> I'm Jonathan, and I make Soundwise, a small English listening-practice
> project. Your [page title] is one of the few lists that still collects
> pronunciation and listening tools for learners, so I wanted to mention a
> resource in case it is useful for it.
>
> Each page plays one word from a pair, such as ship or sheep, and the
> learner chooses which one they heard. It takes under a minute, runs in the
> browser, and needs no account. There are 21 English pairs so far, covering
> contrasts such as /ɪ/–/iː/, /r/–/l/ and /æ/–/ɛ/:
> https://getsoundwise.co/minimal-pairs-practice/
>
> Full disclosure: the site also links to a paid iOS app that I make. The
> web exercises are free.
>
> If it does not fit the list, no reply is needed. Thank you for keeping the
> list going.
>
> Jonathan Freed

### Draft B: library guide owner (targets 2, 7, 8)

> Subject: Suggested resource for the ESL listening guide
>
> Hello,
>
> I noticed the pronunciation section of your ESL guide ([URL]) and wanted to
> suggest a free resource for students who have trouble hearing the
> difference between similar English sounds.
>
> https://getsoundwise.co/minimal-pairs-practice/ lists short listening
> checks for pairs such as ship/sheep and right/light. A student hears one
> word and picks which it was. No login, works on a phone.
>
> I make the site, and it also links to a paid iOS app; the web exercises
> are free to use and to assign.
>
> Thank you for considering it.
>
> Jonathan Freed

### Draft C: note for teachers (for a teacher-facing block or page, if approved)

> **Using these exercises with a class**
>
> Every pair page works as a one-minute listening check. Paste the page link
> into Google Classroom or your LMS; students do not need an account. Each
> student hears a word, chooses which one they heard, and sees the result.
>
> Pick the contrast your students confuse: /ɪ/–/iː/ (ship/sheep, bit/beat),
> /æ/–/ʌ/ (cap/cup), /æ/–/ɛ/ (bad/bed), /r/–/l/ (right/light).
>
> The exercise checks listening on a small set of words. It does not record
> or grade student work.

Draft C states only what the web exercise does today. Check it against the
current exercise before publishing; it is not a claim about the app.

### What we will count

Per message sent: reply (yes/no), placement (yes/no), and in GA4 the
sessions, engaged sessions and `exercise_start` sessions from that source over
the following 28 days. The decision rule is in the tracker under D-1.

## 3. Usability investigation protocol

### Purpose

Analytics show where learners leave, not why. Of 163 organic sessions, 28
started an exercise and 17 completed it. This study explains those two losses
with 5–8 learners before any exercise change is built.

### Questions

1. In the first 20 seconds on a pair page, does the learner realise there is
   a listening test, and where it is?
2. What do they expect to happen when they press Start, and does the first
   sound play when they expect it?
3. After the first answer, do they understand the feedback and that a second
   round follows?
4. What do they think the summary screen and its App Store button are
   offering?
5. On a phone, does anything about sound (silent switch, volume, voice
   quality) make the exercise look broken?
6. Would they do another contrast, and can they find one?
7. While the first word plays the answer buttons are disabled. Do learners
   notice, and do they use "Play the sample" and the per-word Listen buttons?

Run at least two sessions on a phone with the silent switch on or inside an
in-app browser (a link opened from a chat app), because a code review found
that a failed or unfinished first sound leaves the learner with disabled
answer buttons and no way forward. Include `/live-vs-leave/` in at least two
sessions: it has the most impressions and no first-screen link to the
exercise.

### Participants

Six target, five minimum, eight maximum.

- Adult English learners at roughly B1–B2 who report trouble hearing some
  English sounds apart.
- At least three first languages, drawn from the site's real audience:
  Russian, Japanese, Spanish or Portuguese, Chinese or Cantonese.
- At least half on their own phone; at least two on iPhone.
- Not prior users of the app or site. Not friends who know the product.
- Recruiting routes that need no public promotion: personal network and
  language-exchange partners first. A recruiting post in any community needs
  separate approval.
- Offer a modest thank-you (owner decision; this is the only possible cost).

### Session (25 minutes, remote, screen and audio shared, or in person)

Ask the learner to think aloud. Do not explain the product. Do not help
unless they are stuck for more than a minute; note where.

1. **Warm-up (3 min).** Which English sounds are hard to hear apart? How do
   you practise now?
2. **Search task (4 min).** "You want to check whether you can hear the
   difference between *ship* and *sheep*. Use Google as you normally would."
   Note the query typed and what they click. Then send the page link if they
   did not reach it.
3. **Page task (6 min).** On a pair page for a contrast they named (or
   `/bad-vs-bed/`): "Show me what you would do here." Do not mention the
   exercise. Note time to first scroll, whether they find Start, taps before
   the first sound, and reactions to the sound.
4. **Exercise task (5 min).** If they have not started: "There is a listening
   test on this page. Try it." Watch both rounds and the summary.
5. **Next step (3 min).** "What would you do next?" Then: "Find another pair
   to try."
6. **Debrief (4 min).** What was confusing? What did you expect that did not
   happen? Would you use this again, and for what?

### What counts as a meaningful usability problem

Record a problem when a participant:

- does not find the exercise without being told;
- presses Start and does not hear, or does not notice, the sound;
- stops before the second round without intending to;
- misreads feedback (thinks a correct answer was wrong, or the reverse);
- cannot say what the App Store button leads to;
- cannot find a second contrast.

Severity: **blocker** when it stops the task; **friction** when it delays it
or needs a retry. A problem is **confirmed** when at least two of five
participants hit it, or when one participant hits a blocker that a code
reading also explains. Preferences and feature wishes are noted, not counted.

### From findings to changes

- For each confirmed problem, write one line: what happened, how many
  participants, the smallest change that removes it.
- Confirmed blockers enter the portfolio as READY items ahead of any item
  supported by analytics alone.
- A change that alters when `exercise_start` or `exercise_complete` fires, or
  their parameters, is a measurement boundary: it needs owner approval and a
  dated entry in the tracker before it ships.
- Unconfirmed analytics-only hypotheses stay in BACKLOG.

### Record sheet (one row per participant)

| P | L1 | Device and browser | Query typed | Found exercise unprompted | Taps to first sound | Sound heard first time | Finished round 2 | Understood summary and CTA | Found second contrast | Problems (blocker/friction) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
