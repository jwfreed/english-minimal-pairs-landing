# Soundwise Analytics and Attribution

## Purpose

Lightweight analytics governance for a solo-founder product. Defines what to measure, how to name things, and how to review results without building unnecessary infrastructure.

This document assumes no enterprise analytics stack. Optimize for clarity and low overhead.

## Last Updated

2026-07-27

---

## Analytics Philosophy

Measure what informs decisions. Ignore what doesn't.

At early stage, the highest-value signals are:
1. Are people finding the product through organic channels?
2. Are they downloading and opening it?
3. Are they coming back?

Everything else is secondary until the core loop is confirmed.

Do not let analytics setup become a project. A spreadsheet and App Store Connect are sufficient to start.

---

## KPI Definitions

These are the metrics that matter most at current stage. Do not add more until these are understood.

| KPI | Definition | Where to Measure |
| --- | --- | --- |
| **App Store downloads** | Installs from App Store, any source | App Store Connect |
| **Day-7 retention** | % of users who open the app at least once in the first 7 days | App Store Connect (if enabled) |
| **Sessions per user (7-day)** | Average number of sessions per active user in 7 days | App analytics (when provider is selected) |
| **Community engagement rate** | Ratio of engaged replies (upvotes, follow-up comments) to total replies posted | Manual tracking in Google Sheets |
| **Organic traffic (landing page)** | Visitors to getsoundwise.co from search | GitHub Pages + Google Search Console |
| **Search Console impressions** | Impressions from organic search per URL | Google Search Console |
| **UTM-tagged clicks** | Clicks from external placements with UTM parameters | Google Analytics (when added to landing page) |

---

## Attribution Assumptions

**Important limitation:** App Store attribution is opaque. Apple's SKAdNetwork provides limited, delayed, and aggregated signals. Direct source-to-install attribution is not reliably available without a paid mobile measurement partner (not warranted at this stage).

**Working assumption for early stage:**
- Attribute installs directionally, not precisely.
- Use UTM data on the landing page (pre-install clicks) as a proxy for channel performance.
- Do not over-interpret day-to-day install variance.

**Workable attribution model:**
1. Track landing page visits by source using UTMs.
2. Track App Store referrer data where available (App Store Connect Referrals).
3. Correlate Reddit/YouTube activity spikes with install spikes in App Store Connect.
4. Log community engagement dates in a sheet alongside install-count snapshots.

This is directional, not causal. That is fine for early-stage decisions.

---

## UTM Naming Conventions

Use lowercase, hyphens only (no underscores, no spaces, no camelCase).

### Structure

```
https://getsoundwise.co?utm_source=SOURCE&utm_medium=MEDIUM&utm_campaign=CAMPAIGN&utm_content=CONTENT
```

`utm_content` is optional. Use it when testing multiple variants of the same placement.

### Source (`utm_source`)

| Context | Value |
| --- | --- |
| Reddit | `reddit` |
| YouTube comment | `youtube` |
| Email | `email` |
| Twitter/X | `twitter` |
| Direct / manual share | `direct` |
| App Store product page | `app-store` |

### Medium (`utm_medium`)

| Context | Value |
| --- | --- |
| Organic community reply | `community` |
| Organic search | `organic` (do not add UTMs to organic links; this is set by GA automatically) |
| Email | `email` |
| Paid ad (if ever used) | `cpc` |
| Social post | `social` |

### Campaign (`utm_campaign`)

Use a descriptive slug that identifies the context.

| Context | Example value |
| --- | --- |
| r/EnglishLearning thread | `r-englishlearning` |
| r/LearnJapanese thread | `r-learnjapanese` |
| YouTube ship/sheep video comment | `yt-ship-sheep` |
| IELTS Reddit thread | `r-ielts` |
| General community outreach (no specific thread) | `community-general` |

---

## Campaign Naming Standards

Campaign names should be readable at a glance in a spreadsheet.

Format: `CHANNEL-TOPIC-YYYY-MM`

Examples:
- `reddit-r-l-confusion-2026-05`
- `youtube-vowels-2026-05`
- `reddit-ielts-2026-06`

If you run multiple community replies in the same topic/month, differentiate by thread slug in `utm_content`:
- `utm_content=thread-cant-hear-difference`

---

## Source Naming Standards

For tracking community engagement in a Google Sheet (separate from UTMs):

| Column | Example |
| --- | --- |
| Date | 2026-05-07 |
| Platform | Reddit |
| Channel / Subreddit | r/EnglishLearning |
| Thread title (truncated) | "Why do ship and sheep sound the same?" |
| Reply type | Helpful / Product mention / Link included |
| UTM used (y/n) | y |
| UTM campaign | r-englishlearning |
| Engagement (upvotes, replies, etc.) | +12 upvotes, 1 follow-up |
| Notes | Led with explanation, soft Soundwise mention |

---

## Reddit Attribution Examples

A reply in r/EnglishLearning includes a link:

```
https://getsoundwise.co?utm_source=reddit&utm_medium=community&utm_campaign=r-englishlearning&utm_content=ship-sheep-thread
```

A reply in r/LearnJapanese about /r/ vs /l/:

```
https://getsoundwise.co?utm_source=reddit&utm_medium=community&utm_campaign=r-learnjapanese&utm_content=r-l-confusion-thread
```

A reply in r/IELTS:

```
https://getsoundwise.co?utm_source=reddit&utm_medium=community&utm_campaign=r-ielts
```

**When to include UTM links in Reddit replies:**
Only when a link is contextually appropriate (someone asked for a resource, or the thread is specifically about tools). Do not include UTM links in every reply — it looks promotional and violates community norms.

---

## YouTube Attribution Examples

A comment on a ship/sheep pronunciation video:

```
https://getsoundwise.co?utm_source=youtube&utm_medium=community&utm_campaign=yt-ship-sheep
```

A comment on a general English pronunciation channel:

```
https://getsoundwise.co?utm_source=youtube&utm_medium=community&utm_campaign=yt-pronunciation-general
```

---

## App Store Attribution Limitations

- Apple does not provide referrer URLs for App Store downloads by default.
- App Store Connect > Analytics > Acquisition shows top referrers aggregated, with delay.
- SKAdNetwork conversion values are available but require development instrumentation to use meaningfully.
- At early stage: do not build around App Store attribution. Use landing page click data and install-count snapshots as a proxy.

**Practical approach:**
- Check App Store Connect once per week.
- Note weekly installs, sources, and impressions.
- Log in the same sheet as community engagement.
- Look for correlation patterns over 2–4 week windows, not day-to-day noise.

## Landing Page GA4 Events

| Event | Trigger | Parameters |
| --- | --- | --- |
| `exercise_start` | First exercise round started, once per page load | `exercise_id`, `pair_name`, `sound_contrast`, `learner_language`, `experience_surface`, `page_slug`, `locale`, `exercise_completed: false`; experiment pages also send `content_variant`. |
| `exercise_complete` | Final exercise round completed, once per page load | `exercise_id`, `pair_name`, `sound_contrast`, `learner_language`, `experience_surface`, `page_slug`, `locale`, `exercise_completed: true`; experiment pages also send `content_variant`. |
| `contrast_journey_view` | A Contrast Journey list first enters the viewport; one event is sent for each visible destination link | `source_pair`, `destination_pair`, `learner_language`, `locale`; experiment pages also send `content_variant`. |
| `contrast_journey_click` | A learner activates a generated Contrast Journey destination link | `source_pair`, `destination_pair`, `learner_language`, `locale`; experiment pages also send `content_variant`. |
| `app_store_click` | Clicks on links to `apps.apple.com` from the homepage, SEO pages, or 404 page | Homepage and SEO pages: `button_text`, `page_path`, `link_url`, `page_slug`, `learner_language`, `locale`, `cta_position`, `exercise_completed`; experiment pages also send `content_variant`. The non-indexable 404 utility page sends only the three generic click fields. |

### Landing-Page Taxonomy

The measurement taxonomy is derived from stable route and event context rather
than a separate `page_type` parameter:

| Surface | Identification |
| --- | --- |
| English or localized homepage | `page_slug = homepage`; `locale` is the canonical route locale; `learner_language` is the active learner/UI language context; GA4 `page_path` distinguishes `/` from localized routes such as `/ja/`. |
| Pair page | `page_slug` is the exact pair ID, such as `ship-vs-sheep`; `locale` and `page_path` distinguish English and localized versions. Exercise events also send the same ID as `exercise_id`. |
| Practice hub | `page_slug` is `minimal-pairs-practice` or `english-ear-training`; `locale` and `page_path` distinguish localized versions. |
| Contrast Journey consumer | The page remains a pair page. Journey events add `source_pair` and `destination_pair`; exercise events add `sound_contrast`. |

“Contrast page” and “pair page” are not separate route types in this
repository. A pair page teaches an exact pair and may also expose its phonemic
contrast and a Contrast Journey. Use `page_slug`/`exercise_id` for the exact
pair, `sound_contrast` for the phonemic category, and `source_pair` plus
`destination_pair` for journey analysis. Do not turn `content_variant` into a
page-type dimension; it identifies experiment cohorts only.

### Search-to-Conversion Measurement

The repository supports these post-launch questions without adding another
event:

1. **Which organic landing pages generate engaged learners?** Use GA4 landing
   page or `page_path`, then sequence `exercise_start`,
   `exercise_complete`, `contrast_journey_view`, or
   `contrast_journey_click` before `app_store_click` within the same session.
2. **Which pairs and contrasts drive product intent?** Use `page_slug` and
   `exercise_id` for the entry pair, `sound_contrast` for exercise engagement,
   and `source_pair`/`destination_pair` for journey movement before
   `app_store_click`.
3. **Which language audiences convert?** Segment the engagement and conversion
   events by `learner_language` (active learner/UI language context) and `locale` (canonical
   route locale). This intentionally distinguishes, for example, a learner
   using Japanese on `/` from a learner landing on `/ja/`.

Search Console owns query, country, device, and search landing-page
performance. GA4 owns session-level engagement and App Store intent. These
datasets can later be compared or blended by canonical landing URL and date;
Search Console query rows cannot be joined to an individual GA4 visitor or
conversion.

### Exercise Event Contract

`page_slug` and `locale` identify the page and canonical route locale that produced the exercise
interaction. `learner_language` identifies the active learner/UI language context and may differ from
`locale` on the homepage. It is not proof of the user's native language or L1. `locale` remains the
canonical route locale. `cta_position` is not sent on exercise events: it identifies the physical App Store CTA
clicked (`hero`, `mid-content`, `post-interaction`, `exercise-summary`, or `post-exercise-footer`) and therefore applies only to
`app_store_click`.

`exercise_completed` is intentionally present even though `event_name` distinguishes
`exercise_start` from `exercise_complete`. It provides one normalized lifecycle-state field across
exercise events and the downstream SEO `app_store_click`, so GA4 explorations can filter or compare
the funnel without deriving equivalent state separately for each event name. On exercise events it is
deterministic (`false` for start, `true` for completion); on `app_store_click` it records whether a
verified completion happened earlier in the same page load. It does not replace `event_name`.

### Content Variant Registry

`src/analytics-content-variants.js` is the single source of truth for
experiment identifier values and their page assignments. Page HTML must not
declare `data-content-variant` directly; Vite adds it from the registry so the
existing exercise and App Store event paths receive the same value.

| `content_variant` | Meaning | Current scope |
| --- | --- | --- |
| `contrast_journey_v1` | First experimental contrast-first presentation. This is an experiment cohort, not a permanent SEO page category. | English `/ship-vs-sheep/` only. |
| `conversion_serp_cta_v1` | Controlled SERP and on-page conversion treatment with first-screen actions and a post-interaction CTA. | English `/bit-vs-beat/` and `/fill-vs-feel/` only. |

Future experiments must add one stable identifier and its exact page assignment
to the registry, then add the same identifier to this table. Use lowercase
snake_case with an explicit version suffix, keep one meaning per identifier,
and do not create page-local spellings or reuse an experiment identifier as a
permanent content taxonomy.

Legacy pages intentionally omit `content_variant`. Absence means the page is
not assigned to a registered experiment variant; it must not be rewritten as a
default or control label in event code.

### Contrast Journey Link Contract

`contrast_journey_view` measures destination-level exposure, not a module-level
impression or page load.
When the generated journey list first enters the viewport, the site sends one
event for each link the learner could choose. A list is counted at most once per
page load. The current page is rendered as non-linked text and therefore does
not emit a destination impression.

`contrast_journey_click` uses delegated click tracking on the same generated
links. `source_pair` comes from the list's `data-contrast-journey` value and
`destination_pair` comes from renderer-owned `data-destination-pair` metadata;
page HTML must not maintain separate analytics IDs.

Practice CTA progression continues to use the existing `app_store_click`
contract. Analyze `page_slug`, `cta_position`, `exercise_completed`, and, where
present, `content_variant` after a journey view or click. Do not emit a second
`practice_cta_click` event for the same App Store activation.

#### GA4 activation

The website emits `content_variant` as an event parameter. Before using it in
standard GA4 reports, register `content_variant` as an event-scoped custom
dimension and validate incoming `exercise_start`, `exercise_complete`, and
`app_store_click` events, plus `contrast_journey_view` and
`contrast_journey_click` where applicable, in DebugView or the equivalent
live-event inspection workflow. Custom-dimension registration is not
retroactive, so do not assume older events will become available after
activation. Register `source_pair` and `destination_pair` as event-scoped
custom dimensions before using the journey events in standard reports.

### App Store Click Contract

The homepage and SEO pages extend the existing `app_store_click` event with the
same measurement context; they do not send a second conversion event.

| Parameter | Requirement | Purpose | Allowed or example values |
| --- | --- | --- | --- |
| `page_slug` | Required on homepage and SEO pages | Identifies the landing-page topic without coupling reporting to localized route prefixes | `homepage`, `ship-vs-sheep`, `minimal-pairs-practice` |
| `learner_language` | Required on homepage and SEO pages | Identifies the active learner/UI language context; it does not prove native language or L1 | `en`, `ja`, `zh-Hans` |
| `locale` | Required on homepage and SEO pages | Identifies the canonical Soundwise route locale | `en`, `ja`, `hi-ur`, `yue` |
| `cta_position` | Required on homepage and SEO pages | Identifies the stable CTA location | `hero`, `mid-content`, `post-interaction`, `exercise-summary`, `post-exercise-footer` |
| `exercise_completed` | Required boolean on homepage and SEO pages | Distinguishes clicks before and after verified exercise lifecycle completion | `true`, `false` |
| `content_variant` | Required only for pages assigned in `src/analytics-content-variants.js` | Identifies an experiment cohort without creating a new event | `contrast_journey_v1`, `conversion_serp_cta_v1` |

`exercise_completed` becomes `true` only after the shared exercise engine dispatches
`soundwise:demo_completed` or `soundwise:challenge_completed`. Visibility, scrolling, and elapsed time
must not set this value. Validators reject checked-in `data-cta-position` values outside the allowlist.

#### Completed Exercise Summary CTA Experiment

The `exercise-summary` App Store CTA appears only after the shared exercise engine dispatches a
verified completion event. It renders inside the completed SEO exercise summary, uses score-aware
supporting copy, and reuses the page's existing App Store destination. For this CTA,
`exercise_completed` is always `true`. Existing App Store CTAs retain their current locations and
`cta_position` values.

The primary experiment metric is:

```text
app_store_click where cta_position = exercise-summary
divided by
exercise_complete
```

Guardrails are `exercise_complete / exercise_start`, duplicate `app_store_click` rate, and the event
integrity of existing CTA positions.

#### Controlled SERP and Conversion CTA Experiment

The `conversion_serp_cta_v1` treatment is limited to English `/bit-vs-beat/`
and `/fill-vs-feel/`. Its hero App Store CTA uses `cta_position = hero`. After
the first submitted exercise answer, a contextual CTA appears with
`cta_position = post-interaction`. A click before verified completion reports
`exercise_completed = false`; a later click reports the current verified
lifecycle state. At completion, the contextual CTA yields to the existing
capability-specific `exercise-summary` CTA when one is available. Otherwise,
the generic contextual CTA remains as the non-gated continuation path. Stable
link IDs include the pair slug and placement so the two treatment pages and
CTA moments can be compared without adding another conversion event.

Control pages omit this content variant and post-interaction placement. In
particular, `/live-vs-leave/` and `/sit-vs-seat/` remain unassigned, while
`/ship-vs-sheep/` retains its separate `contrast_journey_v1` assignment.

GA4 administrators should register `page_slug`, `learner_language`, `locale`, `cta_position`, and
`content_variant` as event-scoped custom dimensions. Register
`exercise_completed` as an event-scoped custom dimension if the property does
not already expose boolean event parameters in the intended reporting workflow.

## Deployment Milestones

### SEO Attribution Contract Live

**Date:** 2026-07-15

**Repository:** `jwfreed/english-minimal-pairs-landing`

**Environment:** Production

**Deployment:** GitHub Pages

**Commit:** `e5b4d1d0fb97b1f33c73ad515dd35eda8136b688`

**Verified:**

- `app_store_click` fires from production pages.
- SEO parameters are present:
  - `page_slug`
  - `locale`
  - `cta_position`
  - `exercise_completed`
- GA4 DebugView confirmed production events.

**Known limitation:**

- GA4 custom dimensions only collect future data.
- Historical events before this deployment should not be treated as equivalent to events using the complete SEO attribution contract.

---

## Event Naming Suggestions

If and when an in-app analytics provider is added, use the following naming conventions. These are suggestions only — do not implement until a provider is selected.

Use snake_case for all event names.

| Event | Name | Notes |
| --- | --- | --- |
| App opened | `app_opened` | With session ID |
| Language category selected | `category_selected` | Include category name |
| Audio played | `audio_played` | Include pair ID, speed tier |
| Answer submitted | `answer_submitted` | Include correct/incorrect, pair ID, response time |
| Mastery tier promoted | `mastery_promoted` | Include group, new tier |
| Placement test completed | `placement_test_completed` | Include recommended tier |
| Settings opened | `settings_opened` | |
| Voice toggled | `voice_toggled` | Include voice name if useful |

Do not log PII. Do not log the content of user inputs.

---

## Weekly Review Process

Keep this to under 15 minutes.

1. **App Store Connect** — note weekly installs, impressions, product page views.
2. **Google Search Console** (once landing page is indexed) — note top queries, impressions, clicks.
3. **Community log (Google Sheet)** — note replies posted, engagement received, links clicked (from UTM data).
4. **One-line summary** — what worked, what did not, one question to answer next week.

Do this every Monday or whenever the week resets. Write the summary in the sheet, not in a separate doc.

---

## Metrics to Ignore Early

These are real metrics that are not useful until the product has reached a stable, growing user base.

| Metric | Reason to ignore early |
| --- | --- |
| DAU/MAU ratio | Meaningful only with 500+ active users |
| Average session length | Requires instrumented analytics; volatile at small N |
| Funnel conversion rate | Not enough data points to be meaningful |
| Social follower count | Vanity — does not correlate with downloads or retention at this stage |
| App Store rating count | Useful for social proof, not for learning signals |
| Reddit post karma | Vanity — focus on reply quality, not score |

---

## Qualitative Signals to Track

These are not quantifiable but are high-signal indicators of whether the product is resonating.

- **Direct questions** in reply threads ("does this app cover [X] language?") — indicates interest and content gap awareness.
- **Unsolicited recommendations** — someone else in a thread mentions Soundwise without being prompted.
- **Teacher and educator inquiries** to `support@getsoundwise.co` — indicates institutional fit.
- **Repeat engagement** from the same Reddit or YouTube account — indicates the product left an impression.
- **Negative feedback** about specific features or gaps — high-signal for product improvement priorities.

Log qualitative signals in a short "signals" column in the weekly review sheet.

---

## Anti-Vanity-Metric Guidance

It is easy to optimize for metrics that feel good but do not correlate with product health.

| Vanity metric | What to measure instead |
| --- | --- |
| Reddit upvotes on a reply | Did the reply generate a follow-up question or a link click? |
| Total app reviews | Day-7 retention and repeat session rate |
| Landing page pageviews | Unique visitors from organic search (quality signal) |
| Number of community replies posted | Engagement rate per reply (quality over volume) |
| Social impressions | Attributed landing page clicks from social sources |

**Rule of thumb:** If a metric can increase while the product is getting worse, it is a vanity metric. Do not optimize for it.
