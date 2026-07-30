# AGENTS.md

Operating manual for AI coding agents working in this repository. Read this before making changes.

## Repository Overview

This is the marketing/landing site for **Soundwise**, an iOS app that trains English listening perception via minimal-pair sound contrasts (e.g. "ship" vs "sheep"). Production URL: `https://getsoundwise.co`.

- **Stack**: Vite 7 (multi-page build), vanilla JavaScript (ES modules, no framework), plain CSS, static HTML.
- **Hosting**: GitHub Pages, custom domain via `CNAME`.
- **No backend.** No database, no API, no server-side code. Everything ships as static files in the deployment artifact (`dist/`).
- **Architecture**: Deliberately simple by design (see `docs/site-structure.md`). Do not introduce a framework, CMS, router, or new build layer for routine page work.

This is one repo in a two-repo product:

- `jwfreed/english-minimal-pairs`
  - iOS app
  - learner practice experience
  - contrast training logic
  - app capability source of truth

- `jwfreed/english-minimal-pairs-landing`
  - public acquisition layer
  - SEO pages
  - localized marketing pages
  - App Store conversion pathway

The landing repo represents product capability. It does not independently define product capability.

## Product Context

Soundwise is an English ear-training product focused on helping learners hear difficult English sound contrasts more clearly.

The landing site should optimize for qualified learner intent, not traffic volume alone.

Prioritize:

- accurate explanations of learner problems
- truthful representation of app capabilities
- clear paths from search intent to practice

Avoid broadening pages into generic English-learning content that does not match the product.

## Repository Invariants

Rules that must always hold. Violating these breaks production, or breaks it silently after `npm run dev` looks fine.

- **`vite.config.js` is the authoritative registry of what ships.** A page is only in production if its source path appears in `build.rollupOptions.input` — directly, via `seoPageSlugs`, or via `legalLocales`. Local file browsing and `npm run dev` will happily serve an unregistered page; the production build will not.

- **Generated locale files are not sources of truth.** `content/locales/<locale>/index.html` (exactly that path — the localized homepage) is rebuilt by `npm run generate:localized-homepages` from `index.html` and supplemental translation files. Edits made directly to these files are lost the next time the generator runs.

- **SEO metadata relationships must stay internally consistent.** Every indexable page is self-canonical; pages in a localized cluster must declare an identical, reciprocal `hreflang` alternate set; `public/sitemap.xml` must only list pages that are actually built and meant to be indexed.

- **The existing validation scripts are release gates, not suggestions.** They encode rules recovered from real production issues (broken hreflang, orphaned sitemap entries, unregistered pages). Treat a failing validator as a real defect to fix, not friction to route around.

## Product & Content Alignment

The website is not an independent marketing layer — it is a representation of what the Soundwise app actually does.

## App capability source of truth

The app repository and product documentation are the authority for product capability.

If capability is unclear:

1. inspect existing documentation
2. inspect implementation where needed
3. prefer conservative wording

Do not infer product capability from SEO pages.

Never invent:

- app features
- supported exercises
- learning methods
- analytics capabilities
- scientific claims

## Exercise claims

`src/contrast-catalog.js` (`CONTRAST_CATALOG`) is the source of truth for which minimal-pair contrasts have a real, working listening exercise on this site.

An SEO page must not promise "try the listening exercise below" unless:

1. the contrast id exists in the catalog
2. the exercise is mounted via `src/seo-page.js`

If a pair is not cataloged:

- write about the sound contrast without claiming an exercise
- or link to a related supported contrast page

Do not imply unsupported capability.

## Contrast-first terminology

The learning objective is the sound contrast.

A word pair is an exercise example.

Prefer:

"Practice the /ɪ/ vs /iː/ contrast using examples like ship/sheep and bit/beat."

Avoid:

"Master ship/sheep."

Do not make a single SEO pair appear to represent the entire learning experience unless the app actually works that way.

## Exact pair vs category language

`CONTRAST_CATALOG` entries have both an exact word pair (`id`/`words`) and a shared phonemic `contrast`.

Only title/H1 a page as `[Word A] vs [Word B]` when that exact pair has a catalog entry.

If only the broader phonemic contrast is covered:

- write about the contrast/category
- do not title or CTA a page as if a specific word-pair exercise exists

## Localization Safety

Localized pages are content variants of the English source, not independent pages.

When touching any localized page:

- Transcreate for natural target-language phrasing.
- Preserve the English source's teaching sequence and SEO intent.
- Preserve claim boundaries.
- Keep English target words visible where search intent depends on them.
- Preserve section IDs / TOC anchors unless there is a clear reason to change them.
- Only link to related-practice pages that already exist and are production-ready.
- Do not reintroduce discouraged terminology in another language simply because the literal English phrase is absent.

`docs/messaging-framework.md` applies by meaning, not exact wording.

Do not introduce:

- accent-fixing claims
- native-like promises
- clinical proof claims
- guaranteed improvement claims

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
| Per-page SEO metadata | that page's own `<head>` | — |
| hreflang mapping | `HREFLANG_BY_LOCALE` in `src/localized-homepage-routes.js` | individual invented tags |
| Build registration | `vite.config.js` | — |
| Indexed URLs | `public/sitemap.xml` | — |
| Validation rules | `scripts/validate-*.mjs` | — |
| Built output | regenerate only | `dist/` |

Rule of thumb:

If a file lives under `dist/`, or matches `content/locales/<locale>/index.html` exactly, it is generated.

Everything else under `content/`, `legal/`, `src/`, and the repo root is hand-maintained source unless documented otherwise.

## Development Environment

Required tools:

- Node.js `20.19+` or `22.12+`
- npm

Setup:

```bash
npm ci
Commands:

npm run dev
npm run build
npm run preview
There is no linter, formatter, or type checker configured.

Do not assume one exists.

Change Strategy

Before changing higher-risk areas:

SEO metadata
localization
routing/page registration
generated content
deployment configuration
analytics/attribution

follow these steps:

Find the closest existing implementation.
Identify the source of truth.
Understand generation/build implications.
Confirm validation requirements.
Make the smallest change that fits the existing pattern.

Prefer:

existing patterns
existing helpers
documented conventions

Avoid without explicit instruction:

framework migrations
CMS additions
new abstractions for one-off problems
unrelated refactors
large rewrites
Copy Editing Rules

When changing user-facing marketing copy:

Preserve meaning before improving style.
Do not increase claims.
Do not add urgency, guarantees, or unsupported outcomes.
Do not replace educational explanations with generic marketing language.
Prefer clarity over cleverness.

Check:

Does this clarify the learner problem?
Does this accurately describe the product?
Does this create a clearer next action?
Analytics Guardrails

Analytics changes are production changes.

Before modifying GA4, GTM, or attribution:

inspect existing events first
preserve existing event names
avoid duplicate events
verify parameters before adding dimensions
do not create events that cannot be truthfully measured

Website analytics should measure website behavior.

Example:

Allowed:

App Store CTA click

Not measurable from this repo:

completed in-app practice session

Do not create proxy measurements that imply unavailable data.

Documentation Discipline

Before creating a new document:

search existing docs/
update an existing source of truth when appropriate
avoid creating competing strategy documents

Each decision should have one canonical location.

Testing and Verification

Before completion:

Run:

npm test
npm run build

Run additional checks when relevant:

npm run validate:landing-copy
npm run validate:funnel-tracking
npm run validate:app-store-tracking
npm run validate:seo-conversion-matrix
npm run validate:localized

For visible UI changes:

run the local site
inspect the rendered page in a browser

Before claiming completion:

Report:

files changed
tests/checks run
results
remaining risks
Agent Operating Principles
Inspect before modifying.
Prefer evidence over assumptions.
Preserve existing behavior.
Explain uncertainty.
Keep diffs focused.
Verify before completion.

When unsure:

check docs/
check existing patterns
ask rather than invent
Deployment Notes

Deployment is automated via:

.github/workflows/deploy.yml

Flow:

push to main
→ npm ci
→ npm run build
→ write getsoundwise.co to dist/CNAME
→ deploy GitHub Pages

There is no staging environment.

Do not push to main or trigger deployment without explicit approval.

See:

docs/deployment.md

for deployment details.