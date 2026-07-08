# Exercise Architecture

## System Purpose

Soundwise pronunciation exercises let visitors hear an English contrast, answer listening prompts, see feedback, complete a short exercise, and then decide whether to continue training in the native app. The web exercise architecture exists so the homepage and future SEO pronunciation pages can share one exercise lifecycle without duplicating state machine, scoring, playback, or analytics event logic.

## Architecture Diagram

```text
SEO pages
    ↓
seo-page.js
    ↓
exercise-engine.js
    ↓
contrast-catalog.js
    ↓
funnel-tracking.js
    ↓
GA4
```

The homepage follows the same engine and analytics path through `main.js` instead of `seo-page.js`:

```text
Homepage
    ↓
main.js
    ↓
exercise-engine.js
    ↓
contrast-catalog.js
    ↓
funnel-tracking.js
    ↓
GA4
```

## Module Responsibilities

### `src/exercise-engine.js`

Owns reusable exercise lifecycle behavior:

- exercise state: stage, round, target word, score, completion
- audio playback lifecycle orchestration through injected adapter callbacks
- answer handling and scoring
- feedback payload generation for the host surface
- completion detection
- `soundwise:demo_started`, `soundwise:demo_round_completed`, `soundwise:demo_completed`, and `soundwise:challenge_completed` dispatching

The engine is surface-agnostic. It must not query homepage DOM, import homepage language configuration, import SEO route logic, promote CTAs, build share URLs, or send GA4 events directly.

### `src/contrast-catalog.js`

Owns canonical pronunciation contrast data. URLs and page routes map to catalog IDs; they do not define contrast content. Each contrast record includes a stable ID, words, IPA, and sound contrast label.

### `src/funnel-tracking.js`

Owns GA4 forwarding only. It listens for Soundwise lifecycle events and forwards `exercise_start` and `exercise_complete` with the prebuilt `event.detail.exerciseParams`. It must not build exercise params, import contrast data, know about homepage or SEO page logic, or track App Store clicks.

### `src/main.js`

Owns homepage-specific behavior:

- DOM selection and rendering
- language switching
- homepage challenge links and sharing
- CTA promotion
- homepage exercise parameter construction
- homepage adapter callbacks passed into `createExercise`

Homepage behavior must stay user-visible compatible with the pre-extraction implementation.

### `src/seo-page.js`

Owns SEO page behavior. In Phase 2 it must not mount exercises yet. Future phases may let SEO pages create an exercise by resolving a URL slug to a catalog contrast and passing an SEO-specific adapter into `createExercise`.

## Ownership Boundaries

- The engine owns lifecycle, not presentation.
- The exercise engine must remain surface-agnostic.
- Host surfaces own DOM, copy, URL behavior, and CTA behavior.
- The catalog owns contrast facts, not page routing.
- Contrast data must not depend on URLs or pages.
- Funnel tracking owns GA4 forwarding, not lifecycle or parameter construction.
- App Store click tracking remains separate from exercise events.
- No module may invent native app training events such as `training_start`.
- SEO pages consume the exercise system; they do not own it.

## Adding A New Contrast

1. Add a record to `CONTRAST_CATALOG` in `src/contrast-catalog.js`.
2. Use a stable lowercase hyphenated `id`, for example `ship-vs-sheep`.
3. Provide exactly two word records with `text` and `ipa`.
4. Provide the `contrast` label shown to visitors and sent through analytics params.
5. Map any homepage language-specific demo selection in `src/hero-demo-config.js`.
6. Map future SEO routes to the catalog ID; do not duplicate contrast data in route code or generated HTML.

## Homepage vs SEO Experiences

The homepage chooses a contrast from the visitor's selected UI language and can enter challenge mode through query parameters. It also owns CTA promotion, challenge sharing, and localized copy.

SEO pages will start from a URL that maps to a catalog contrast. They should reuse the same engine lifecycle and analytics pipeline, but provide their own copy, mount DOM, and `experience_surface` value. SEO pages must not duplicate lifecycle logic or define contrast content inline.

## Analytics Event Ownership

`exercise-engine.js` dispatches semantic Soundwise lifecycle events. Host surfaces provide `exerciseParams` in the event detail through adapter callbacks so params can include the correct `language` and `experience_surface`.

`funnel-tracking.js` forwards:

- `soundwise:demo_started` to GA4 `exercise_start`
- `soundwise:demo_completed` and `soundwise:challenge_completed` to GA4 `exercise_complete`

`app_store_click` is owned by CTA tracking in each surface and is intentionally separate from exercise lifecycle tracking.

Analytics event contracts must remain stable unless intentionally versioned. Any event rename, parameter removal, dedupe behavior change, or split into a new event name requires an explicit migration plan and regression verification.

## Regression Verification

Homepage behavior changes require explicit regression verification. At minimum, verify exercise start, answer handling, score display, completion summary, CTA promotion, and GA4 forwarding for `exercise_start` and `exercise_complete`.

## Known Constraints

- There must be no duplicate exercise implementations.
- The engine must not contain SEO-specific logic.
- The engine must not contain homepage-specific DOM or language assumptions.
- GA4 forwarding must remain centralized in `src/funnel-tracking.js`.
- The website must not track fake native app training starts.
- Phase 2 does not add SEO exercise mounts.
