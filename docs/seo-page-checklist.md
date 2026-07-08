# SEO Pronunciation Page Checklist

Use this checklist when adding one new SEO pronunciation page with the reusable listening exercise. Do not use it to migrate every page at once.

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

Check the new SEO page:

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

- One page is added or updated intentionally; no bulk migration.
- The page uses exactly one `data-exercise` mount.
- `data-contrast` resolves to a catalog entry.
- `scripts/validate-seo-exercise.mjs` allowlists the page and contrast ID.
- No scoring, lifecycle, or GA4 exercise forwarding is duplicated outside the shared modules.
- Validators and build pass.
- Manual homepage and target SEO page smoke tests pass.
