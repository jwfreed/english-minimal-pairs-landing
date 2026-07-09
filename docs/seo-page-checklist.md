# SEO Pronunciation Page Checklist

Use this checklist when adding one new SEO pronunciation page, or an intentionally scoped sound-family cluster, with the reusable listening exercise. Do not use it for unbounded bulk migration.

## Required Files

- SEO page HTML, for example `right-vs-light/index.html`
- Existing shared script: `src/seo-page.js`
- Existing shared styles: `src/style.css`
- Existing contrast catalog: `src/contrast-catalog.js`
- Existing validators in `package.json`

## Required Page Structure

Every SEO page with an exercise must include the shared SEO page script:

```html
<script type="module" src="/src/seo-page.js"></script>
```

Add one exercise mount in the article body near the section that explains active listening practice, before the main article App Store CTA:

```html
<div data-exercise data-contrast="right-vs-light"></div>
```

The adapter adds the `seo-exercise` class and the default ID `<contrast-id>-listening-exercise`. Add a manual `id` only when the page has a real link or accessibility requirement.

Add the page to the validator allowlist in `scripts/validate-seo-exercise.mjs`:

```js
{
  filePath: 'right-vs-light/index.html',
  contrastId: 'right-vs-light',
},
```

## Preferred Learning Journey Structure

For high-intent minimal-pair SEO pages, the page should teach the sound contrast before it sells the app. The preferred order is:

1. Hero headline names the sound problem, not only the word pair.
2. Quick answer explains what sound the learner is confusing and why that happens.
3. Vowel or consonant comparison gives concrete listening cues.
4. Listening-before-pronunciation section explains why hearing comes first.
5. Practice section introduces the active listening pattern and mounts the exercise.
6. Related sound-family section links to nearby pages that train the same contrast.
7. App CTA invites the learner to continue the same type of training in Soundwise.
8. FAQ and secondary related links answer objections without blocking the core journey.

The word pair is the search entry point. The sound contrast is the teaching objective.

## Exercise Placement Guidance

Place the exercise at the moment the article moves from explanation to action. The best location is inside or immediately after the practice section, after the page has explained:

- which two sounds are being confused,
- why the sounds may collapse into one listening category,
- what cue the learner should listen for,
- why active choice plus feedback works better than passive exposure.

Do not place the exercise after the primary CTA, FAQ, tables of related words, or long sentence-practice sections. The visitor should understand the sound problem, try the contrast, and then see a clear next step.

Use short instructional copy immediately before the mount. Good copy tells the learner what to listen for, such as vowel quality rather than spelling, meaning, context, or length alone.

## Sound-Family Cross-Linking Guidance

When several pages teach the same sound contrast, link them as a learning sequence, not as a generic SEO list. The copy should explain that the consonants or words change while the underlying sound contrast stays the same.

For a sound-family sprint:

- keep the cluster limited to the intended sound family,
- link the other primary pages from the practice or related-contrast section,
- use learner-facing labels such as "Keep training the same /ɪ/ vs /iː/ contrast",
- avoid burying the only sound-family links below FAQ,
- keep broad hub links secondary to the sound-family journey.

## CTA Guidance

The App Store CTA should feel like the continuation of the listening exercise, not a separate marketing interruption. CTA copy should connect the completed exercise to more repetitions, more voices, more minimal pairs, or continued ear training.

Preserve existing App Store URLs, link IDs, and tracking shape unless there is a planned analytics migration. Do not add new CTA events for SEO page experiments; the existing `app_store_click` event is the contract.

## Common Pitfalls

- Framing the page as two vocabulary words instead of one sound contrast.
- Explaining pronunciation mechanics without giving the learner an immediate listening task.
- Treating vowel length as the whole explanation when vowel quality is the more stable cue.
- Placing related links where they read like an SEO footer instead of a learning path.
- Putting the app CTA before the visitor has experienced the exercise.
- Adding a second exercise mount to make the page feel more interactive.
- Editing `exercise-engine.js` or analytics modules for page-specific copy changes.

## Required Catalog Entry

`data-contrast` must match a key in `CONTRAST_CATALOG`:

```js
'right-vs-light': {
  id: 'right-vs-light',
  words: [
    { text: 'right', ipa: '/raɪt/' },
    { text: 'light', ipa: '/laɪt/' },
  ],
  contrast: '/r/ vs /l/',
},
```

Catalog entries are pronunciation domain data only. Do not add route paths, page titles, SEO descriptions, CTA copy, difficulty, tags, or learning order unless a current feature consumes the field.

## Analytics Contract

The SEO adapter must dispatch Soundwise lifecycle events through `exercise-engine.js`; `src/funnel-tracking.js` forwards them to GA4.

Expected GA4 exercise events:

- `exercise_start`: once per page load
- `exercise_complete`: once per page load

Required exercise params:

- `exercise_id`
- `pair_name`
- `sound_contrast`
- `language`
- `experience_surface: 'seo_contrast_page'`

Do not add direct `gtag` calls for `exercise_start` or `exercise_complete` in the SEO page. Do not create new training events. App Store clicks remain the separate `app_store_click` path.

## Validation Commands

Before running validation, confirm each target page is included in the `exercisePages` allowlist in `scripts/validate-seo-exercise.mjs`. The allowlist is the guardrail that keeps rollout intentional and scoped.

Run all commands from the repository root:

```bash
npm run validate:seo-exercise
npm run validate:exercise-engine
npm run validate:funnel-tracking
npm run validate:app-store-tracking
npm run build
```

Use the repo's supported Node version if the local shell defaults to an older Node release.

## Manual QA

Check each new or updated SEO page:

- Exercise appears before the primary article CTA.
- Exercise title, contrast label, word buttons, IPA, feedback, score, and summary render correctly.
- Start exercise, answer both rounds, and confirm completion.
- Article App Store CTA remains visible and clickable after completion.
- No unrelated SEO pages gained an exercise mount.

Check the homepage:

- Homepage exercise still starts and completes.
- Score, summary, CTA promotion, challenge/share behavior, language switching, and App Store CTA behavior are unchanged.

## Analytics Verification

With `window.gtag` stubbed or network calls inspected:

- Starting the SEO exercise sends exactly one `exercise_start`.
- Completing the SEO exercise sends exactly one `exercise_complete`.
- Both exercise events include `experience_surface: 'seo_contrast_page'`.
- Clicking the SEO App Store CTA sends exactly one `app_store_click`.
- Homepage exercise events still use `experience_surface: 'homepage'`.

## Acceptance Criteria

- Each page is added or updated intentionally; no unbounded bulk migration.
- Each page uses exactly one `data-exercise` mount.
- `data-contrast` resolves to a catalog entry.
- `scripts/validate-seo-exercise.mjs` allowlists the page and contrast ID.
- No scoring, lifecycle, or GA4 exercise forwarding is duplicated outside the shared modules.
- Validators and build pass.
- Manual homepage and target SEO page smoke tests pass.
