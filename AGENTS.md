# AGENTS.md

Operating manual for AI coding agents working in this repository. Read this before making changes.

## Repository Overview

This is the marketing/landing site for **Soundwise**, an iOS app that trains English listening perception via minimal-pair sound contrasts (e.g. "ship" vs "sheep"). Production URL: `https://getsoundwise.co`.

- **Stack**: Vite 7 (multi-page build), vanilla JavaScript (ES modules, no framework), plain CSS, static HTML.
- **Hosting**: GitHub Pages, custom domain via `CNAME`.
- **No backend.** No database, no API, no server-side code. Everything ships as static files in the deployment artifact (`dist/`).
- **Architecture**: Deliberately simple by design (see `docs/site-structure.md`). Do not introduce a framework, CMS, router, or new build layer for routine page work — the docs explicitly say not to.

This is one repo in a two-repo product: `jwfreed/english-minimal-pairs` (iOS app) and `jwfreed/english-minimal-pairs-landing` (this repo).

## Repository Invariants

Rules that must always hold. Violating these breaks production, or breaks it silently after `npm run dev` looks fine.

- **`vite.config.js` is the authoritative registry of what ships.** A page is only in production if its source path appears in `build.rollupOptions.input` — directly, via `seoPageSlugs`, or via `legalLocales`. Local file browsing and `npm run dev` will happily serve an unregistered page; the production build will not.
- **Generated locale files are not sources of truth.** `content/locales/<locale>/index.html` (exactly that path — the localized homepage) is rebuilt by `npm run generate:localized-homepages` from `index.html` and the supplemental translation files, and is listed file-by-file in `.gitignore` (all 14 current locales). Edits made directly to these files are lost the next time the generator runs, including automatically as part of `npm run build`'s `prebuild` step.
- **SEO metadata relationships must stay internally consistent.** Every indexable page is self-canonical; pages in a localized cluster must declare an identical, reciprocal `hreflang` alternate set; `public/sitemap.xml` must only list pages that are actually built and meant to be indexed. `npm run validate:seo-architecture` and `npm run validate:internal-links` enforce this against the real built output, not against source intent.
- **The existing validation scripts are release gates, not suggestions.** They encode rules recovered from real production issues (broken hreflang, orphaned sitemap entries, unregistered pages). Treat a failing validator as a real defect to fix, not friction to route around.

## Product & Content Alignment

The website is not an independent marketing layer — it is a representation of what the Soundwise app actually does. Two enforcement layers apply:

- **Claims about the app**: `docs/messaging-framework.md` → Claim Boundaries is the governing list of what Soundwise may and must not claim (no clinical/scientific validation, no guaranteed results, no accent elimination, no fixed timelines). Check any new or edited marketing/SEO copy against it before publishing — this is not optional style guidance, it's the compliance boundary for the product.
- **Claims about a specific interactive exercise**: `src/contrast-catalog.js` (`CONTRAST_CATALOG`) is the source of truth for which minimal-pair contrasts have a real, working listening exercise on this site. An SEO page must not promise "try the listening exercise below" (see `PRACTICE_PROMISE_PATTERNS` in `scripts/validate-seo-exercise.mjs`) unless its contrast id is actually in the catalog and mounted via `src/seo-page.js`. If a pair isn't cataloged yet, write about the sound contrast without claiming an on-page exercise, or link to a related contrast page that does have one — don't imply a capability that isn't implemented. `npm run validate:seo-exercise` enforces this.
- **Exact pair vs. category language**: `CONTRAST_CATALOG` entries have both an exact word pair (`id`/`words`, e.g. `ship-vs-sheep`) and a shared phonemic `contrast` (e.g. `/ɪ/ vs /iː/`, which five different pairs share). Only title/H1 a page as `[Word A] vs [Word B]` when that exact pair has a catalog entry. If only the broader phonemic contrast is covered (via a sibling pair or a hub), write about the contrast/category — don't title or CTA a page as if a specific word-pair exercise exists when it doesn't.

## Localization Safety

Localized pages are content variants of the English source, not independent pages — see `docs/phase-1-localized-flagship-seo-implementation-plan.md` → Localization Rules for the full policy. Key rules when touching any localized page:

- Transcreate for natural target-language phrasing; do not translate word-by-word when that weakens clarity.
- Preserve the English source's teaching sequence and SEO intent — same structure, same claim boundaries (never strengthen a claim in translation that `docs/messaging-framework.md` restricts in English).
- Keep the English target words visible where search intent depends on them (titles, H1s, sound lists, FAQ), even inside otherwise fully localized copy.
- Preserve section IDs / TOC anchors unless the localized heading needs a clearer local anchor — update matching TOC links if they change.
- Only link to related-practice pages that already exist and are production-ready in this repo.
- Don't reintroduce discouraged terminology in the target language just because the literal English phrase is absent — `docs/messaging-framework.md` → Discouraged Terminology (no accent-fixing/native-sounding/clinically-proven framing, in any language) applies to meaning, not just exact English wording.

## Source of Truth

| Concern | Edit this | Never hand-edit this |
| --- | --- | --- |
| English homepage | `index.html` | — |
| Localized homepages | `index.html` + `src/landing-supplement-translations.js`, then run `npm run generate:localized-homepages` | `content/locales/<locale>/index.html` |
| English SEO pages | `content/pairs/<slug>/index.html` | — |
| Localized SEO pages / SEO hubs | `content/locales/<locale>/<slug>/index.html` | — |
| Legal pages | `legal/privacy/`, `legal/terms/` sources | — |
| Homepage copy strings | `landing-copy.json` | — |
| i18n / locale strings | `src/i18n.js`, `src/landing-supplement-translations.js`, `src/seo-exercise-translations.js` | — |
| Per-page SEO metadata (title, description, canonical, JSON-LD) | that page's own `<head>` — metadata is duplicated per page by design, not templated | — |
| hreflang language-tag mapping | `HREFLANG_BY_LOCALE` in `src/localized-homepage-routes.js` | individual page `<link rel="alternate">` tags should follow this mapping, not invent tags |
| What gets built, and public URL mapping | `vite.config.js` | — |
| Indexed URLs | `public/sitemap.xml` | — |
| Validation rules (what "correct" means) | `scripts/validate-*.mjs` — edit only when the policy itself is wrong, never to make a failing check pass | — |
| Built output | (nothing — always regenerate) | `dist/` — always regenerate via `npm run build` |

Rule of thumb: if a file lives under `dist/`, or matches `content/locales/<locale>/index.html` exactly (not a `<slug>` subpath under it), it is generated. Everything else under `content/`, `legal/`, `src/`, and the repo root is a hand-maintained source.

## Domain Concepts

Vocabulary as used in this repo's own docs — reuse these terms rather than inventing new ones:

- **Landing page** — the main English homepage at `index.html` (`/`), and its localized counterparts at `/<locale>/`.
- **Locale** — a short lowercase identifier for a language/market variant (`ja`, `zh`, `yue`, `hi-ur`, etc.), defined centrally in `HREFLANG_BY_LOCALE` in `src/localized-homepage-routes.js`.
- **SEO page** — a standalone learner-intent page for one minimal-pair sound contrast (e.g. `/ship-vs-sheep/`), sourced from `content/pairs/` (English) or `content/locales/<locale>/` (localized).
- **SEO hub** — a broader index-style SEO page (e.g. `/english-ear-training/`, `/minimal-pairs-practice/`) that links out to individual contrast pages, as opposed to a single-contrast pair page.
- **Content source** — the hand-authored `index.html` under `content/pairs/<slug>/` or `content/locales/<locale>/<slug>/` that Vite maps to a clean public URL.
- **Generated page** — output produced by a script rather than hand-authored, specifically `content/locales/<locale>/index.html` (homepages only).
- **Deployment artifact** — the built `dist/` directory, uploaded to GitHub Pages by the deploy workflow.

## Development Environment

Required tools:
- Node.js `20.19+` or `22.12+` (Vite 7 requirement). CI uses Node 20.
- No other runtime dependencies beyond `npm`.

Setup:
```bash
npm ci
```

Local development:
```bash
npm run dev        # Vite dev server, http://localhost:5173
npm run build       # production build to dist/ (runs prebuild/postbuild validators)
npm run preview     # serve the built dist/ locally
```

There is **no linter, formatter, or type checker configured** (no ESLint, Prettier, or TypeScript config in this repo). Do not assume one exists or invent config for it unless asked.

## Project Structure

| Path | Purpose |
| --- | --- |
| `index.html` | Main English homepage (hand-authored). |
| `content/locales/<locale>/index.html` | **Generated** localized homepages. See Repository Invariants. |
| `content/pairs/<slug>/index.html` | English SEO pages/hubs for minimal-pair contrasts (e.g. `content/pairs/ship-vs-sheep/`). |
| `content/locales/<locale>/<slug>/index.html` | Localized SEO pages / SEO hubs. |
| `legal/privacy/`, `legal/terms/` | Legal page sources (English canonical, legacy `.html` redirect stubs, localized `*-<locale>.html` variants). |
| `src/` | Shared JS (i18n, exercise engine, funnel tracking, SEO page behavior) and `src/style.css`. |
| `public/` | Static assets copied verbatim into `dist/` (robots.txt, sitemap.xml, 404.html, images). |
| `scripts/` | Node scripts: content generators, `validate:*` checks, and `*.test.mjs` files run via `node --test`. |
| `docs/` | Source of truth for SEO strategy, messaging rules, site structure, deployment, analytics. Read before writing content. |
| `vite.config.js` | Central registry of every HTML entry point (`build.rollupOptions.input`) and the plugin that maps `content/`/`legal/` source paths back to clean public URLs. |
| `landing-copy.json` | Canonical English homepage copy, validated against `index.html` and the i18n runtime. |
| `dist/` | Build output. Never hand-edit. |
| `.worktrees/` | Git worktrees for in-progress branches — not part of the deployed site, ignore unless explicitly asked to work there. |

## Coding Standards

- **JS style**: ES modules, `const`/`let`, arrow functions, small pure helper functions, template literals. No JSX, no TS, no build-time transpilation beyond what Vite does by default. Follow the existing style in `src/main.js` and `src/seo-page.js` (e.g. `SCREAMING_SNAKE_CASE` for module-level constants, `camelCase` for functions/variables, `dispatchEvent(new CustomEvent('soundwise:<name>', { detail }))` for cross-module events).
- **CSS**: One shared stylesheet, `src/style.css`, using CSS custom properties defined in `:root` (colors, spacing, typography). Reuse existing custom properties rather than hardcoding new values.
- **HTML**: Every page is a standalone static file with its own `<head>` (metadata, canonical, hreflang, JSON-LD are not shared/templated — they're duplicated per page intentionally). Match the structure of an existing sibling page when adding a new one (see `content/pairs/ship-vs-sheep/index.html` as the reference pattern).
- **i18n / locale data**: Locale strings live in `src/i18n.js`, `src/landing-supplement-translations.js`, `src/seo-exercise-translations.js`, and `landing-copy.json`. Locale codes are short lowercase identifiers matching existing ones (`ja`, `zh`, `yue`, `hi-ur`, etc.) — do not invent new codes without checking `src/localized-homepage-routes.js` (`HREFLANG_BY_LOCALE`) first.
- **No state management framework** — state is plain objects/module scope (see `heroDemoState` in `src/main.js`).
- **File organization**: New SEO/content pages are directories with `index.html` under `content/pairs/` (English) or `content/locales/<locale>/` (localized). Root-level utility pages (like `support.html`) are single `.html` files at repo root.

## Change Strategy

Before changing anything in a higher-risk area — **SEO metadata, localization, routing/page registration (`vite.config.js`), generated content, deployment configuration, or analytics/attribution** — the following four steps are mandatory, not optional:
1. **Find the closest existing implementation.** This repo repeats patterns deliberately (see `content/pairs/ship-vs-sheep/index.html` as the reference SEO page). Copy the pattern, don't design a new one.
2. **Identify the source of truth** for what you're editing, using the table above. If you're about to edit something under `content/locales/<locale>/index.html` or anything in `dist/`, stop — you're editing an artifact.
3. **Understand generation/build implications.** Does this change need a corresponding entry in `vite.config.js`? Does it need `npm run generate:localized-homepages` to be re-run? Does it affect `public/sitemap.xml`?
4. **Confirm validation requirements** — check which `validate:*` script(s) cover the area you're touching (see Testing and Verification) so you know what "done" looks like before you start.
5. **Make the smallest change that fits the existing pattern** — don't redesign, generalize, or restructure while implementing a scoped request.

For lower-risk areas (e.g. touching `src/style.css`, a single copy fix within one existing page), the same steps still apply in spirit but with proportionally less ceremony.

Prefer:
- Existing patterns, helpers, and doc-defined conventions (`docs/seo-page-creation-guide.md`, `docs/messaging-framework.md`) over new ones.
- Reusing existing CSS custom properties and JS helpers over adding new ones.

Avoid, without explicit instruction:
- Framework, router, or CMS migrations.
- New abstractions, templating layers, or build-tool changes to solve a one-off problem.
- Large rewrites or restructuring of working pages/scripts.
- Rewriting legal or marketing copy as a side effect of structural changes — treat copy edits as separate work per `docs/site-structure.md`.

Any user-facing SEO/marketing copy must also satisfy `docs/seo-page-creation-guide.md` (structure, CTA, UTM conventions) and the Product & Content Alignment / Localization Safety rules above before it's considered done.

On uncertainty: prefer the documented convention in `docs/` over guessing, and prefer asking or flagging the assumption over inventing new architecture.

## Failure Modes

Known ways this repo breaks, and how to catch them:

**Missing Vite entry**
- Symptom: a new page renders fine under `npm run dev` or direct file access, but is absent from `dist/` and 404s in production.
- Detection: `npm run validate:content-routes` (prebuild) or a full `npm run build`.
- Resolution: add the page's slug/path to `seoPageSlugs`, `legalLocales`, or the explicit input map in `vite.config.js`.

**Editing a generated locale homepage directly**
- Symptom: hand-made edits to `content/locales/<locale>/index.html` disappear after the next build or generator run.
- Detection: the file is listed in `.gitignore`; if you're editing something Git already ignores, that's the signal.
- Resolution: make the change in `index.html` and/or `src/landing-supplement-translations.js`, then run `npm run generate:localized-homepages`.

**SEO metadata regression**
- Symptom: broken/non-reciprocal `hreflang`, a canonical pointing at the wrong URL, or a sitemap entry for a page that isn't actually built.
- Detection: `npm run validate:seo-architecture` and `npm run validate:internal-links` (both run in `postbuild`, against real `dist/` output).
- Resolution: fix the offending `<link>` tags or `public/sitemap.xml` entry to match the centralized locale/hreflang mapping in `src/localized-homepage-routes.js`.

**Sitemap/registration drift**
- Symptom: a page is registered in `vite.config.js` but forgotten in `public/sitemap.xml` (or vice versa: listed in the sitemap but never registered/built).
- Detection: `npm run validate:internal-links`, or a manual cross-check between `vite.config.js` and `public/sitemap.xml`.
- Resolution: keep the two in sync deliberately — only indexable pages belong in the sitemap.

**SEO copy promises an exercise the page doesn't have**
- Symptom: page text says "try the listening exercise below" (or similar) but the contrast isn't in `CONTRAST_CATALOG` (`src/contrast-catalog.js`) or no exercise is mounted via `src/seo-page.js`.
- Detection: `npm run validate:seo-exercise`, which scans for practice-promise phrasing and checks it against the actual exercise mount.
- Resolution: either add the contrast to the catalog and mount the exercise, or rewrite the copy to not promise an on-page exercise that doesn't exist.

**Missing `dist/CNAME`**
- Symptom: the custom domain (`getsoundwise.co`) disappears from the deployed GitHub Pages site.
- Detection: check whether the deploy workflow's CNAME step ran (see `docs/deployment.md`).
- Resolution: this is generated by CI (`echo 'getsoundwise.co' > dist/CNAME`) and by `npm run deploy` locally — don't hand-maintain it, restore the step if it was removed.

## Testing and Verification

There is no lint/typecheck step; verification is script- and build-based, layered by cost:

**Fast checks** (no build required — run these first, during iteration):
```bash
npm test                               # runs all scripts/*.test.mjs via node --test
npm run validate:landing-copy          # landing-copy.json / index.html / i18n runtime consistency
npm run validate:funnel-tracking
npm run validate:app-store-tracking
npm run validate:seo-conversion-matrix
npm run validate:localized             # single localized SEO page structural check
```

**Build check** (required before any change is considered done):
```bash
npm run build
```
This chains `prebuild` (`generate:localized-homepages` → `validate:content-routes` → `validate:breadcrumbs` → `validate:seo-exercise`), the Vite build itself, then `postbuild` (`validate:breadcrumbs:dist` → `validate:localized-homepages` → `validate:seo-architecture` → `validate:internal-links`). The `postbuild` validators run against the real `dist/` output — this is the closest thing this repo has to a release gate. A clean exit is the minimum bar for "safe to ship."

**Manual check** (for anything visible):
```bash
npm run dev      # or: npm run preview
```
Validators check structure and metadata, not visual correctness — for UI-visible changes, actually look at the page in a browser.

Before declaring work complete:
1. Run `npm run build` and confirm it exits cleanly.
2. Run `npm test` if you touched `src/exercise-engine.js`, `scripts/*.mjs`, FAQ content, or anything else covered by a `*.test.mjs` file.
3. If you added/changed a page, confirm it's listed in `vite.config.js` and, if indexable, in `public/sitemap.xml`.
4. For UI-visible changes, check it in a browser via `npm run dev`/`npm run preview`.

## Common Tasks

**Add a new English SEO minimal-pair page:**
1. Create `content/pairs/<word-a>-vs-<word-b>/index.html` following `docs/seo-page-creation-guide.md` (structure, metadata, FAQ schema, banned-claims list).
2. Add the slug to `seoPageSlugs` in `vite.config.js`.
3. Add the URL to `public/sitemap.xml` if it should be indexed.
4. Run `npm run build`.

**Add a localized SEO page or homepage:** same as above but under `content/locales/<locale>/`, slug prefixed `<locale>/` in `vite.config.js`. Localized homepages (`content/locales/<locale>/index.html`) are generated, not hand-authored — edit `index.html` and/or `src/landing-supplement-translations.js` instead, then run `npm run generate:localized-homepages`.

**Add/update styles:** edit `src/style.css`; reuse existing custom properties in `:root` rather than introducing new hardcoded colors/spacing.

**Add a new locale:** add the locale to `HREFLANG_BY_LOCALE` in `src/localized-homepage-routes.js`, add translation entries to `src/i18n.js` and `src/landing-supplement-translations.js`, add to `legalLocales` in `vite.config.js` if legal pages are translated, and see `README_LANGUAGES.md`.

**Add a dependency:** this repo has exactly one dependency (`vite`, devDependency). Adding runtime dependencies is a significant architectural decision for a static site — flag it rather than doing it silently.

**Modify `vite.config.js`:** this file is the single source of truth for what gets built. Understand `seoPageSlugs`, `legalLocales`, `getSeoPageSourcePath`, and `preservePublicHtmlRoutes()` before changing it — it maps nested `content/`/`legal/` source paths back to clean public URLs at build time.

## Architectural Guardrails

Do not do the following without explicit user instruction:

- Migrate away from Vite, or introduce a second build tool or framework alongside it.
- Add runtime dependencies (the repo currently has exactly one devDependency).
- Redesign the content architecture (`content/pairs/`, `content/locales/`, the generated-homepage pipeline) — it's intentionally simple per `docs/site-structure.md`.
- Introduce a router, templating engine, or CMS for "routine" static-page additions — the docs explicitly rule this out.
- Restructure directories or rename established paths (`content/`, `legal/`, `src/`, `public/`) casually; these are referenced by `vite.config.js`, `.gitignore`, and multiple `scripts/validate-*.mjs` files.

## Agent Operating Principles

- Inspect before modifying — read the closest existing page/script/doc for the established pattern; this repo is convention-heavy and self-documenting via `docs/`.
- Prefer evidence over assumptions — verify a claim against the actual file/script before relying on it (e.g., confirm a script's behavior by reading it, not just its name).
- Preserve existing behavior — especially public URLs, canonical/hreflang relationships, and sitemap entries, unless the task is explicitly about changing them.
- Explain uncertainty — state assumptions explicitly (e.g., "assuming this page should be indexed," "no existing pattern for X, doing Y") rather than silently guessing.
- Keep diffs focused — don't perform unrelated refactors while doing content or feature work.
- Verify before completion — run `npm run build` (and `npm test` where relevant); don't claim success without running it.

## Deployment Notes

- Deployment is fully automated via `.github/workflows/deploy.yml`: push to `main` (or manual `workflow_dispatch`) → `npm ci` → `npm run build` → write `getsoundwise.co` to `dist/CNAME` → upload and deploy to GitHub Pages.
- There is no staging environment; `main` is production.
- `npm run deploy` is a local helper that runs the build and writes `dist/CNAME` — it does not publish anything itself.
- Do not push to `main` or trigger the deploy workflow without the user's explicit go-ahead; treat it as a shared/production action.
- See `docs/deployment.md` for the full checklist and common-issue troubleshooting (missing CNAME, page built locally but missing from `dist/`, sitemap omissions).
