# Exercise Architecture

## System Purpose

Soundwise pronunciation exercises let visitors hear an English contrast, answer listening prompts, see feedback, complete a short exercise, and then decide whether to continue training in the native app. The web exercise architecture exists so the homepage and future SEO pronunciation pages can share one exercise lifecycle without duplicating state machine, scoring, playback, or analytics event logic.

## Architecture Diagram

```text
SEO pages
    ↓
seo-page.js
    ↓
contrast-catalog.js
    ↓
exercise-engine.js
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

Owns SEO page behavior. SEO pages can mount exercises by declaring `data-exercise` and `data-contrast` in HTML, then letting this adapter resolve the catalog contrast and pass SEO-specific callbacks into `createExercise`.

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

## SEO Integration Pattern

SEO pages add exercises by declaring a small HTML mount, then letting `src/seo-page.js` act as the surface adapter:

```html
<div data-exercise data-contrast="ship-vs-sheep"></div>
```

The SEO adapter applies the standard `seo-exercise` class and, when no `id` is provided, assigns the predictable ID `<contrast-id>-listening-exercise`. A page may provide an explicit ID only when it has a real accessibility or linking need.

```text
SEO HTML mount
    ↓
seo-page.js adapter
    ↓
contrast-catalog lookup
    ↓
exercise-engine
    ↓
funnel-tracking
```

To add an exercise to a new SEO page:

1. Add one `data-exercise` mount to the page.
2. Set `data-contrast` to a valid `CONTRAST_CATALOG` ID.
3. Keep page-specific copy, article structure, and CTA placement in the HTML/CSS surface.
4. Let `src/seo-page.js` render exercise controls and pass adapter callbacks into `createExercise`.
5. Do not add page-local scoring, audio lifecycle, or direct GA4 exercise calls.

SEO exercise analytics must keep the existing event names and include `experience_surface: 'seo_contrast_page'` in `exerciseParams`. App Store click tracking remains the existing `app_store_click` path in `src/seo-page.js`.

## Adding A New Pronunciation Page

A new SEO pronunciation page should be mostly content plus one declarative exercise mount.

1. Create or update the page HTML using the existing SEO page structure.
2. Confirm the page includes `<script type="module" src="/src/seo-page.js"></script>`.
3. Add the exercise mount near the article section that explains active listening practice, before the primary article CTA:

   ```html
   <div data-exercise data-contrast="right-vs-light"></div>
   ```

4. Confirm `data-contrast` matches a key in `CONTRAST_CATALOG`.
5. Add the page path and contrast ID to the `exercisePages` allowlist in `scripts/validate-seo-exercise.mjs`.
6. Keep pronunciation facts in the catalog. Do not duplicate IPA or sound contrast labels in JavaScript.
7. Keep page copy, examples, headings, related links, and App Store CTA copy in the HTML.
8. Run the SEO exercise validator and the shared analytics validators before shipping.

The mount should support the customer journey: explain the listening problem, let the visitor try the exercise, then show the CTA. Avoid burying the exercise below related links, FAQ, or the conversion CTA.

## Catalog Data Rules

`src/contrast-catalog.js` is domain data. Add only fields with an immediate consumer in code or documentation.

Required fields:

- `id`: stable lowercase hyphenated ID, usually `<word-a>-vs-<word-b>`
- `words`: exactly two word records with `text` and `ipa`
- `contrast`: visitor-visible sound contrast label, also used in analytics params

Do not add speculative fields such as difficulty, tags, learning order, route paths, titles, slugs, or SEO metadata until a concrete feature consumes them. Page URLs and page-specific SEO copy belong to the HTML surface, not the catalog.

## Common Mistakes

- Adding more than one `data-exercise` mount to a page.
- Setting `data-contrast` to a route slug that does not exist in `CONTRAST_CATALOG`.
- Forgetting to add an intentionally rolled-out page to the SEO exercise validator allowlist.
- Copying exercise scoring, round, or answer logic into an SEO page.
- Calling `gtag('event', 'exercise_start')` or `gtag('event', 'exercise_complete')` from `src/seo-page.js`.
- Adding fake native-app events such as `training_start`.
- Moving `app_store_click` into funnel tracking.
- Adding catalog fields for future ideas before anything consumes them.
- Placing the exercise after the article CTA, related links, or FAQ.

## Testing And Rollout Checklist

Before shipping a page with an SEO exercise:

1. Run `npm run validate:seo-exercise`.
2. Run `npm run validate:exercise-engine`.
3. Run `npm run validate:funnel-tracking`.
4. Run `npm run validate:app-store-tracking`.
5. Run `npm run build`.
6. Manually open the homepage and verify the existing homepage exercise still starts, completes, scores, promotes the CTA, and sends one `exercise_start` plus one `exercise_complete`.
7. Manually open the SEO page and verify the exercise renders at the intended point in the article, starts, completes, scores, and keeps the article CTA usable.
8. Stub or inspect `window.gtag` and confirm SEO exercise params include `exercise_id`, `pair_name`, `sound_contrast`, `language`, and `experience_surface: 'seo_contrast_page'`.
9. Confirm App Store CTA clicks still send only `app_store_click` with the existing payload shape.

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
- The current SEO exercise allowlist mounts exercises only on intentionally rolled-out SEO pages.
