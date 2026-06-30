# Phase 1 Localized Flagship SEO Implementation Plan

## Purpose

This plan governs Phase 1 of the localized flagship SEO rollout for Soundwise: one localized flagship minimal-pair SEO page per supported L1 route. It is for future Codex or Claude agents creating the pages after this documentation step.

The goal is repeatable, repo-consistent page creation. Future agents must preserve the existing Soundwise SEO-page experience while localizing copy, metadata, schema, canonical URLs, hreflang, sitemap entries, and CTA attribution.

## Source of Truth

Use `docs/phase-1-localized-flagship-seo-matrix.md` as the canonical rollout list. If a future request conflicts with that file, pause and ask which source should win before creating pages.

Before implementation, also inspect these repo references:

- `vite.config.js`
- `public/sitemap.xml`
- `ship-vs-sheep/index.html`
- `right-vs-light/index.html`
- `thin-vs-tin/index.html`
- `vest-vs-west/index.html`
- `src/style.css`
- `src/seo-page.js`
- `docs/site-structure.md`
- `docs/seo-page-creation-guide.md`
- `docs/analytics-and-attribution.md`
- `docs/messaging-framework.md`

For the Arabic exception, also inspect consonant/vowel source patterns such as `fan-vs-van/index.html`, `cap-vs-cup/index.html`, and `bad-vs-bed/index.html`.

## Non-Negotiable Rule

Localized pages must be structurally and stylistically identical to the original English SEO pages. In plain terms: identical structure and style. They are localized content variants, not redesigned pages.

Do not add a CMS, router, generator, framework, abstraction, CSS system, or alternate layout for this rollout. Clone the correct English source-page shell, then localize only the content, URLs, metadata, schema, CTA text, and language attributes needed for the localized page.

## Rollout Matrix

| Rollout | Page | L1 / route | Prose reference | Style direction |
|---:|---|---|---|---|
| 1 | `/ja/ship-vs-sheep/` | Japanese `/ja/` | 寺田寅彦 / Torahiko Terada | Calm science essay: concrete, precise, modest, explanatory. |
| 2 | `/zh/ship-vs-sheep/` | Mandarin Chinese `/zh/` | 朱自清 / Zhu Ziqing | Clean modern Chinese, short paragraphs, gentle explanation, no slogan tone. |
| 3 | `/yue/right-vs-light/` | Cantonese `/yue/` | 西西 / Xi Xi | Natural Hong Kong Traditional Chinese: plain, vivid, teacherly, not Mainland-translated. |
| 4 | `/ko/right-vs-light/` | Korean `/ko/` | 이어령 / Lee O-young | Polished Korean explanatory prose: precise, reflective, accessible, not academic-heavy. |
| 5 | `/es/ship-vs-sheep/` | Spanish `/es/` | Manuel Toharia | Clear Spain-neutral Spanish; explain the listening mechanism before mentioning the app. |
| 6 | `/pt/ship-vs-sheep/` | Portuguese `/pt/` | Rubem Alves | Warm, practical Brazilian Portuguese; learner-centred rather than poetic. |
| 7 | `/ar/pat-vs-bat/` | Arabic `/ar/` | طه حسين / Taha Hussein | Elegant but simple Modern Standard Arabic: explanatory, respectful, never ornate. |
| 8 | `/hi-ur/vest-vs-west/` | Hindi / Hindustani `/hi-ur/` | Premchand | Accessible Hindustani register; avoid overly Sanskritized or Persianized language. |
| 9 | `/id/ship-vs-sheep/` | Indonesian `/id/` | Goenawan Mohamad | Clear Bahasa Indonesia: thoughtful, direct, lightly elegant, not newspaper-hype. |
| 10 | `/fa/vest-vs-west/` | Persian `/fa/` | محمدعلی جمال‌زاده / Mohammad-Ali Jamalzadeh | Natural modern Persian: simple, lightly conversational, clear, not literary-heavy. |
| 11 | `/ru/ship-vs-sheep/` | Russian `/ru/` | Яков Перельман / Yakov Perelman | Popular-science Russian: concrete examples, clear logic, no inflated claims. |
| 12 | `/th/thin-vs-tin/` | Thai `/th/` | วินทร์ เลียววาริณ / Win Lyovarin | Modern Thai explanatory prose: crisp, readable, practical, not bureaucratic. |
| 13 | `/tr/ship-vs-sheep/` | Turkish `/tr/` | Aziz Nesin | Clear Turkish: direct, human, lightly witty where natural, never sarcastic. |
| 14 | `/vi/right-vs-light/` | Vietnamese `/vi/` | Nguyễn Hiến Lê | Clear Vietnamese educational prose: direct, helpful, practical, not ornate. |

## Existing SEO Page Structure to Preserve

The existing SEO pages are static Vite clean-route pages, such as `ship-vs-sheep/index.html`, registered in `seoPageSlugs` in `vite.config.js` and indexed in `public/sitemap.xml`.

Every localized page must preserve this shell:

- `<!doctype html>`
- `<html lang="...">`, with `dir="rtl"` for RTL pages
- `<head>` metadata
- Google tag script currently used by the source page
- favicon, viewport, and color-scheme metadata
- localized meta description
- localized canonical URL
- localized Open Graph title, description, type, URL, and site name
- localized Twitter card title and description
- localized `<title>`
- Google Fonts preconnect and stylesheet links used by the source page
- `<link rel="stylesheet" href="/src/style.css">`
- `FAQPage` JSON-LD
- `BreadcrumbList` JSON-LD
- `LearningResource` JSON-LD
- `<body class="seo-page seo-body">`
- `<nav class="nav seo-nav" aria-label="Primary">`
- Soundwise logo link
- nav CTA
- `<article class="seo-article">`
- hero header
- breadcrumb
- `seo-kicker`
- `h1`
- `seo-lede`
- `seo-layout`
- `seo-toc`
- `seo-content`
- source-page section order and heading depth
- `comparison-grid` where the source page uses it
- `sound-list`
- `pair-list`
- `seo-cta`
- `seo-faq`
- `related-practice`
- footer
- `<script type="module" src="/src/seo-page.js"></script>`

Do not change `src/style.css` or `src/seo-page.js` for routine localized-page creation. The existing CSS already includes RTL adjustments for SEO content lists, blockquotes, tables, and the desktop TOC.

## Page Source Mapping

Use the mapped English source page as the structural clone for each localized route:

| Localized page | Clone from |
|---|---|
| `/ja/ship-vs-sheep/` | `/ship-vs-sheep/` |
| `/zh/ship-vs-sheep/` | `/ship-vs-sheep/` |
| `/yue/right-vs-light/` | `/right-vs-light/` |
| `/ko/right-vs-light/` | `/right-vs-light/` |
| `/es/ship-vs-sheep/` | `/ship-vs-sheep/` |
| `/pt/ship-vs-sheep/` | `/ship-vs-sheep/` |
| `/ar/pat-vs-bat/` | newly created `/pat-vs-bat/` |
| `/hi-ur/vest-vs-west/` | `/vest-vs-west/` |
| `/id/ship-vs-sheep/` | `/ship-vs-sheep/` |
| `/fa/vest-vs-west/` | `/vest-vs-west/` |
| `/ru/ship-vs-sheep/` | `/ship-vs-sheep/` |
| `/th/thin-vs-tin/` | `/thin-vs-tin/` |
| `/tr/ship-vs-sheep/` | `/ship-vs-sheep/` |
| `/vi/right-vs-light/` | `/right-vs-light/` |

## Arabic Exception

`/ar/pat-vs-bat/` requires creating `/pat-vs-bat/` first as an English source page. The English `/pat-vs-bat/` page must follow the same structure as the existing SEO pages and should be registered, indexed, and verified before the Arabic page is localized.

The Arabic page should be localized from that new English source, not generated independently. Do not use `/ar/ship-vs-sheep/` as the Arabic flagship.

For the English source page, use existing pages as pattern evidence:

- `fan-vs-van/index.html` for consonant-contrast explanatory structure
- `thin-vs-tin/index.html` for stop/fricative cue language
- `cap-vs-cup/index.html` and `bad-vs-bed/index.html` for vowel and simple word-pair teaching patterns

## Localization Rules

- Transcreate naturally; do not translate word-by-word when that weakens clarity.
- Preserve the teaching sequence: learner problem, listening mechanism, sound contrast, why the pair is misheard, listening-first practice, Soundwise as a practical next step.
- Follow the matrix style direction as a functional writing guide.
- Do not imitate copyrighted authors. Do not copy, parody, or pastiche a named writer's exact voice.
- Keep explanations learner-first and calm.
- Explain the listening contrast before the CTA.
- Keep IPA where helpful for the target audience, and explain it in ordinary language.
- Localize examples only if the meaning and the sound contrast remain correct.
- Keep the English target words visible where SEO/search intent depends on them, especially in titles, H1s, sound lists, examples, and FAQ.
- Preserve section IDs and TOC anchor behavior unless the localized heading requires a clearer local anchor. If anchors change, update the matching TOC links.
- Use related-practice links only for pages that already exist in the repo and are production-ready.

## Language and Direction Rules

- Arabic: `<html lang="ar" dir="rtl">`
- Persian: `<html lang="fa" dir="rtl">`
- Cantonese: use Traditional Chinese appropriate for Hong Kong Cantonese; set `lang="yue"`.
- Mandarin Chinese: use Simplified Chinese; set `lang="zh"`.
- Japanese: `lang="ja"`
- Korean: `lang="ko"`
- Spanish: `lang="es"`
- Brazilian Portuguese page: `lang="pt"` unless a future repo convention adopts `pt-BR`.
- Hindi/Hindustani route remains `/hi-ur/`. Use `lang="hi"` for hreflang if no Urdu-script page exists, unless existing repo conventions define a different value before implementation.
- Indonesian: `lang="id"`
- Russian: `lang="ru"`
- Thai: `lang="th"`
- Turkish: `lang="tr"`
- Vietnamese: `lang="vi"`

For RTL pages, check visual output after build. The shared CSS already has RTL handling for important SEO content blocks, but future agents must confirm the nav, hero, CTA, FAQ accordion, related links, and footer still read correctly.

## Metadata Rules

Each localized page must have:

- localized `<title>`
- localized meta description
- localized Open Graph title and description
- localized Twitter title and description
- `og:type` preserved as `article`
- `og:site_name` preserved as `Soundwise`
- canonical URL pointing to the localized production URL
- `og:url` pointing to the localized production URL
- no canonical pointing to the English source page
- page title retaining the English pair terms where useful for search

Use production URLs on `https://getsoundwise.co`. Do not create draft or localhost canonicals.

## Hreflang Rules

Existing English SEO source pages do not currently show hreflang alternates. If localized pair pages are added, future agents must decide whether the implementation batch includes reciprocal hreflang updates on all pages in the same alternate set.

When hreflang is added:

- Add hreflang only for pages that exist.
- Include a self-reference on every page in the alternate set.
- Include the English source page.
- Include localized alternates only where the same source pair has localized versions.
- Include `x-default` pointing to the English source page unless a newer repo convention says otherwise.
- Keep hreflang reciprocal across every page in the set.
- Do not list unrelated pairs as alternates of each other.
- Use `/pat-vs-bat/` as the English alternate for `/ar/pat-vs-bat/`, after that English page exists.

Suggested same-pair alternate sets for Phase 1:

- `ship-vs-sheep`: English, Japanese, Mandarin Chinese, Spanish, Portuguese, Indonesian, Russian, Turkish
- `right-vs-light`: English, Cantonese, Korean, Vietnamese
- `vest-vs-west`: English, Hindi/Hindustani, Persian
- `thin-vs-tin`: English, Thai
- `pat-vs-bat`: English, Arabic

## Schema Rules

Every localized page must preserve the existing lightweight schema approach:

- `FAQPage` questions and answers must match the visible localized FAQ.
- `BreadcrumbList` must use the localized page name and localized URL.
- `LearningResource` must use the localized page name, localized description, localized URL, and correct `inLanguage`.
- Keep `provider` as Soundwise with `https://getsoundwise.co/`.
- Do not add `Product`, `Review`, `Rating`, `Offer`, or unsupported schemas.
- Do not use schema to make claims that are not visible on the page.
- Do not describe rankings, guarantees, clinical proof, scientific validation of Soundwise, fluency, accent elimination, or fixed-time results.

## CTA and App-Support Rules

Soundwise messaging must stay within `docs/messaging-framework.md`.

- Use exact-pair CTA language only if the exact pair is app-supported for that L1.
- Otherwise use contrast-level CTA language if the broader contrast is app-supported.
- If support is unknown, mark the issue as `BLOCKED` in the implementation summary or use safest non-specific wording such as focused English ear-training practice.
- Never promise unavailable pair practice.
- Do not claim the app teaches speaking production, guarantees pronunciation improvement, fixes accents, or produces native-like speech.
- Keep the App Store link on `apps.apple.com` so `src/seo-page.js` click tracking still applies.

## App-Support Classification Table

This table is the CTA authority for Phase 1 until the main app dataset is inspected directly. The classifications are intentionally conservative and are based on checked-in website evidence: `src/hero-demo-config.js`, localized hub pages, and existing Soundwise messaging docs.

Classification meanings:

- `EXACT_PAIR_EXISTS`: checked-in locale-specific evidence names the exact rollout pair as a Soundwise/demo practice pair. Exact-pair CTA wording is allowed.
- `CONTRAST_EXISTS_ONLY`: checked-in locale-specific evidence supports the broader sound contrast, but the exact rollout pair is not verified as an app-supported pair for that L1. Use contrast-level CTA wording only.
- `NO_APP_SUPPORT`: no checked-in evidence supports the exact pair or broader contrast for that L1. Use non-specific Soundwise ear-training wording or mark the CTA as blocked until main-app support is verified.

Do not upgrade a row from `CONTRAST_EXISTS_ONLY` to `EXACT_PAIR_EXISTS` without inspecting the main app pair dataset or another explicit source of truth for app-supported pairs.

| Page | Classification | Evidence basis | Safe CTA source wording to localize |
|---|---|---|---|
| `/ja/ship-vs-sheep/` | `CONTRAST_EXISTS_ONLY` | Japanese hub pages list `ship vs sheep` under the /ɪ/ vs /iː/ contrast, but `src/hero-demo-config.js` uses `right/light` for Japanese. | Practice the /ɪ/ vs /iː/ listening contrast in Soundwise. |
| `/zh/ship-vs-sheep/` | `CONTRAST_EXISTS_ONLY` | Mandarin hub pages list `ship/sheep` under /ɪ/ vs /iː/, but `src/hero-demo-config.js` uses `think/sink` for Mandarin. | Practice the /ɪ/ vs /iː/ listening contrast in Soundwise. |
| `/yue/right-vs-light/` | `CONTRAST_EXISTS_ONLY` | Cantonese hub pages list `right/light` under /r/ vs /l/, but `src/hero-demo-config.js` uses `light/night` for Cantonese. | Practice the /r/ vs /l/ listening contrast in Soundwise. |
| `/ko/right-vs-light/` | `CONTRAST_EXISTS_ONLY` | Korean hub pages state Soundwise Korean contrasts include /r/ vs /l/ and list `right vs light`, but exact-pair app support is not separately verified. | Practice the /r/ vs /l/ listening contrast in Soundwise. |
| `/es/ship-vs-sheep/` | `EXACT_PAIR_EXISTS` | Spanish hub pages list `ship vs sheep`, and `src/hero-demo-config.js` uses `ship/sheep` for Spanish. | Practice ship vs sheep in Soundwise. |
| `/pt/ship-vs-sheep/` | `CONTRAST_EXISTS_ONLY` | Portuguese hub pages list `ship vs sheep` under /ɪ/ vs /iː/, but `src/hero-demo-config.js` uses `live/leave` for Portuguese. | Practice the /ɪ/ vs /iː/ listening contrast in Soundwise. |
| `/ar/pat-vs-bat/` | `CONTRAST_EXISTS_ONLY` | `src/hero-demo-config.js` uses Arabic `/p/ vs /b/` with `pack/back`; `pat/bat` is not yet verified. | Practice the /p/ vs /b/ listening contrast in Soundwise. |
| `/hi-ur/vest-vs-west/` | `EXACT_PAIR_EXISTS` | Hindi/Urdu hub pages list `vest vs west`, and `src/hero-demo-config.js` uses `vest/west` for Hindi/Urdu. | Practice vest vs west in Soundwise. |
| `/id/ship-vs-sheep/` | `CONTRAST_EXISTS_ONLY` | Indonesian hub pages list `ship vs sheep` under /ɪ/ vs /iː/, but `src/hero-demo-config.js` uses `fan/pan` for Indonesian. | Practice the /ɪ/ vs /iː/ listening contrast in Soundwise. |
| `/fa/vest-vs-west/` | `CONTRAST_EXISTS_ONLY` | Persian hub pages list `vest vs west` under /v/ vs /w/, but `src/hero-demo-config.js` uses `think/sink` for Persian. | Practice the /v/ vs /w/ listening contrast in Soundwise. |
| `/ru/ship-vs-sheep/` | `CONTRAST_EXISTS_ONLY` | Russian hub pages list `ship vs sheep` under /ɪ/ vs /iː/, but `src/hero-demo-config.js` uses `wine/vine` for Russian. | Practice the /ɪ/ vs /iː/ listening contrast in Soundwise. |
| `/th/thin-vs-tin/` | `EXACT_PAIR_EXISTS` | Thai hub pages list `thin vs tin`, and `src/hero-demo-config.js` uses `thin/tin` for Thai. | Practice thin vs tin in Soundwise. |
| `/tr/ship-vs-sheep/` | `CONTRAST_EXISTS_ONLY` | Turkish hub pages list `ship vs sheep` under /ɪ/ vs /iː/, but `src/hero-demo-config.js` uses `thin/tin` for Turkish. | Practice the /ɪ/ vs /iː/ listening contrast in Soundwise. |
| `/vi/right-vs-light/` | `CONTRAST_EXISTS_ONLY` | Vietnamese hub pages list `right vs light` under /r/ vs /l/, but `src/hero-demo-config.js` uses `day/they` for Vietnamese. | Practice the /r/ vs /l/ listening contrast in Soundwise. |

## UTM Rules

Use the existing App Store URL plus these UTM values:

```text
utm_source=website
utm_medium=seo-page
utm_campaign=minimal-pair-pages
utm_content={locale}-{slug}
```

Example:

```text
https://apps.apple.com/us/app/soundwise-english/id6753882308?utm_source=website&utm_medium=seo-page&utm_campaign=minimal-pair-pages&utm_content=ja-ship-vs-sheep
```

Use lowercase values with hyphens. Do not use spaces, underscores, or camelCase. For English source pages, keep the existing pattern `utm_content={slug}` unless a future analytics change explicitly migrates those pages.

## Build Integration

For each localized page:

1. Create `/{locale}/{slug}/index.html`.
2. Add `{locale}/{slug}` to `seoPageSlugs` in `vite.config.js`.
3. Add the production URL to `public/sitemap.xml` if the page is intended to be indexed.
4. Use the same sitemap conventions as existing SEO URLs: HTTPS `loc`, current intentional `lastmod`, monthly `changefreq`, and `0.8` priority unless the repo changes its sitemap policy.
5. Ensure internal links point only to live pages.
6. Run `npm run build`.

For `/pat-vs-bat/`, create the English route first:

1. Create `/pat-vs-bat/index.html`.
2. Add `pat-vs-bat` to `seoPageSlugs`.
3. Add `https://getsoundwise.co/pat-vs-bat/` to `public/sitemap.xml` if indexable.
4. Run `npm run build`.
5. Use that page as the source for `/ar/pat-vs-bat/`.

## Page QA Checklist

Use this checklist for every page:

- [ ] The page was cloned from the mapped source page, not built from scratch.
- [ ] The route is `/{locale}/{slug}/index.html`.
- [ ] `<html lang>` is correct.
- [ ] RTL pages include `dir="rtl"`.
- [ ] Title, description, OG, Twitter, canonical, and `og:url` are localized and self-referential.
- [ ] English pair terms remain visible where needed for search intent.
- [ ] The body shell and CSS classes match the source page.
- [ ] The TOC links match visible section IDs.
- [ ] The visible FAQ matches `FAQPage` JSON-LD exactly in meaning.
- [ ] `BreadcrumbList` uses the localized URL.
- [ ] `LearningResource` uses the localized URL and correct `inLanguage`.
- [ ] CTA language is classified as exact-pair supported, contrast-level supported, or blocked/unknown.
- [ ] CTA wording follows the App-Support Classification Table; no `CONTRAST_EXISTS_ONLY` page uses exact-pair practice claims.
- [ ] App Store CTAs use `utm_content={locale}-{slug}`.
- [ ] Related-practice links point only to existing pages.
- [ ] `seoPageSlugs` includes the new slug.
- [ ] `public/sitemap.xml` includes the new URL if indexable.
- [ ] Hreflang, if added, is reciprocal and includes only existing pages.
- [ ] `npm run build` passes.
- [ ] The built page has been visually checked for obvious layout, RTL, and text-overflow issues.

## Recommended Implementation Order

1. Add this plan and `docs/phase-1-localized-flagship-seo-matrix.md`.
2. Create `/pat-vs-bat/` as the English source page.
3. Create `/ar/pat-vs-bat/` as the first localized exception page.
4. Create one `ship-vs-sheep` localization as a template pilot, preferably `/ja/ship-vs-sheep/`.
5. Batch the remaining localized pages in small PRs grouped by source page or script direction.
6. Keep each PR small enough to review metadata, schema, sitemap, hreflang, and copy without losing the source-page invariant.

## Definition of Done

For a localized-page implementation batch to be done:

- All created pages match the mapped English page structure and style.
- All localized pages are registered in `vite.config.js`.
- Indexable pages are listed in `public/sitemap.xml`.
- Canonicals are self-referential localized URLs.
- Hreflang, if included, is reciprocal and lists only existing alternates.
- JSON-LD validates against visible page content.
- CTAs do not overstate app support.
- UTM values follow the localized SEO convention.
- `npm run build` passes.
- The diff contains no unrelated CSS, JS, architecture, generated `dist/`, or page redesign changes.

## Future-Agent Output Contract

Every future implementation summary must report:

- pages created
- source page used for each page
- files changed
- build result
- sitemap status
- hreflang status
- schema status
- app-support CTA classification
- unresolved risks or blockers
