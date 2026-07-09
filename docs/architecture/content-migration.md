# Content Architecture Migration

## Purpose

The repository root previously mixed application entry points, generated localized homepage files, SEO content directories, localized SEO directories, legal pages, operational docs, and build tooling. That layout made ownership unclear because a route path, a content source path, and an operational file could all look like the same kind of root-level object.

This migration creates explicit source ownership boundaries:

- `src/` remains application behavior.
- `public/` remains static passthrough assets.
- `content/pairs/` owns English SEO content entities and SEO hubs.
- `content/locales/` owns localized SEO content entities, localized hubs, and generated localized homepage source files.
- `legal/` owns policy page sources.
- `docs/architecture/` owns long-lived repository architecture decisions.

This is intentionally not a redesign. It does not change public URLs, canonical URLs, sitemap URLs, page copy, CSS, JavaScript behavior, deployment hosting, analytics contracts, or the generated public route layout.

## Current Architecture

Before this migration, the root contained several unrelated domains:

- Application entry points: `index.html`, `support.html`, `src/`, and `public/`.
- Tooling: `scripts/`, `package.json`, `package-lock.json`, `vite.config.js`, and `.github/`.
- Documentation: `docs/`.
- English SEO content: root directories such as `ship-vs-sheep/`, `right-vs-light/`, `minimal-pairs-practice/`, and `english-ear-training/`.
- Localized SEO content: locale directories such as `ja/`, `zh/`, `ko/`, and `yue/`.
- Generated localized homepages: ignored files such as `ja/index.html` and `zh/index.html`.
- Legal pages: `privacy/`, `terms/`, `privacy.html`, `terms.html`, `privacy-*.html`, and `terms-*.html`.

The main ownership problem was that source content appeared to be public routing infrastructure. For example, moving or adding a root directory could look like an SEO routing decision even when it was only a source organization decision.

The content generation flow was:

1. `npm run build` ran `npm run generate:localized-homepages` through the `prebuild` hook.
2. `scripts/generate-localized-homepages.mjs` read `index.html` and wrote generated localized homepages to `<locale>/index.html`.
3. `vite.config.js` registered root source paths directly as Rollup HTML inputs.
4. Vite emitted `dist/` using those input paths.
5. `public/sitemap.xml` defined indexed production URLs.

## Target Architecture

```text
src/
Application code

public/
Static passthrough assets copied into dist

content/
  pairs/
    Minimal pair SEO entities and English SEO hubs
  locales/
    Translation/localization content and generated localized homepage sources

legal/
Policy page sources

docs/architecture/
Long-lived architectural decisions

scripts/
Automation and validation
```

The key implementation detail is that source paths and public paths are now intentionally different for content and legal pages. `vite.config.js` maps nested source files back to the existing public output paths.

## Ownership Model

| Area | Owner |
|---|---|
| Application behavior | `src/` |
| Static assets | `public/` |
| SEO content | `content/pairs/` |
| Localization | `content/locales/` |
| Legal content | `legal/` |
| Operations | `docs/` |
| Architecture decisions | `docs/architecture/` |
| Automation | `scripts/` |
| Build entry mapping | `vite.config.js` |

## Migration Decisions

Decision:
Move English SEO pages and SEO hubs from root directories into `content/pairs/`.

Reason:
Minimal-pair pages and SEO hubs are content entities, not application modules or operational files.

Impact:
Source paths changed from `<slug>/index.html` to `content/pairs/<slug>/index.html`. Public URLs remain `/<slug>/` through the Vite output map.

Verification:
Run `npm run build` and confirm built files such as `dist/ship-vs-sheep/index.html`, `dist/minimal-pairs-practice/index.html`, and `dist/english-ear-training/index.html` still exist.

Decision:
Move localized SEO pages and localized hubs from root locale directories into `content/locales/`.

Reason:
Locale-prefixed content belongs to the localization content boundary, not the repository root.

Impact:
Source paths changed from `<locale>/<slug>/index.html` to `content/locales/<locale>/<slug>/index.html`. Public URLs remain `/<locale>/<slug>/`.

Verification:
Run `npm run build` and localized SEO validators against built output, including `dist/yue/right-vs-light/index.html` and `dist/ja/ship-vs-sheep/index.html`.

Decision:
Generate localized homepage source files under `content/locales/<locale>/index.html`.

Reason:
Generated localized homepage route files are localization content and should live with other localized source files.

Impact:
`scripts/generate-localized-homepages.mjs`, `.gitignore`, and localized homepage validation now use `content/locales/<locale>/index.html`. Public URLs remain `/<locale>/`.

Verification:
Run `npm run generate:localized-homepages`, `npm run build`, and `npm run validate:localized-homepages`.

Decision:
Move legal page sources into `legal/privacy/` and `legal/terms/`.

Reason:
Policy pages are legal assets, not SEO content or application behavior.

Impact:
English clean legal sources moved to `legal/privacy/index.html` and `legal/terms/index.html`. Legacy and translated `.html` sources moved under `legal/privacy/` and `legal/terms/`. Public URLs remain `/privacy/`, `/terms/`, `/privacy.html`, `/terms.html`, `/privacy-*.html`, and `/terms-*.html`.

Verification:
Run `npm run build` and confirm legal files are emitted at the existing public paths in `dist/`.

Decision:
Add `preservePublicHtmlRoutes()` to `vite.config.js`.

Reason:
Vite normally emits HTML using source-relative paths. After moving sources under `content/` and `legal/`, the build needs an explicit output filename map to preserve public URLs and generated output shape.

Impact:
The Rollup bundle is rewritten during `generateBundle` for mapped HTML assets only. Runtime HTML, canonical tags, sitemap entries, and page links are not rewritten.

Verification:
Run `npm run build` and compare emitted route filenames against the expected public URL layout.

Decision:
Update source-path validators and active docs.

Reason:
Validation should continue to protect content behavior at the new source paths, and active authoring docs should not instruct contributors to put SEO or legal content back at the root.

Impact:
SEO exercise, SEO conversion, localized homepage, and Cantonese right-vs-light validators now read moved source paths. README and active architecture/SEO docs distinguish source paths from public URLs.

Verification:
Run the affected validation scripts and inspect docs for stale root-source guidance.

## Moved Files

English SEO content and hubs moved to `content/pairs/`:

- `bad-vs-bed/`
- `bet-vs-bat/`
- `bit-vs-beat/`
- `cap-vs-cup/`
- `cup-vs-cop/`
- `english-ear-training/`
- `fan-vs-van/`
- `fill-vs-feel/`
- `full-vs-fool/`
- `heart-vs-hurt/`
- `law-vs-low/`
- `live-vs-leave/`
- `man-vs-men/`
- `minimal-pairs-practice/`
- `pat-vs-bat/`
- `pull-vs-pool/`
- `rice-vs-lice/`
- `right-vs-light/`
- `ship-vs-sheep/`
- `sit-vs-seat/`
- `thin-vs-tin/`
- `three-vs-tree/`
- `vest-vs-west/`

Localized SEO content and hubs moved to `content/locales/`:

- `ar/english-ear-training/`, `ar/minimal-pairs-practice/`, `ar/pat-vs-bat/`
- `es/english-ear-training/`, `es/minimal-pairs-practice/`, `es/ship-vs-sheep/`
- `fa/english-ear-training/`, `fa/minimal-pairs-practice/`, `fa/vest-vs-west/`
- `hi-ur/english-ear-training/`, `hi-ur/minimal-pairs-practice/`, `hi-ur/vest-vs-west/`
- `id/english-ear-training/`, `id/minimal-pairs-practice/`, `id/ship-vs-sheep/`
- `ja/english-ear-training/`, `ja/minimal-pairs-practice/`, `ja/ship-vs-sheep/`
- `ko/english-ear-training/`, `ko/minimal-pairs-practice/`, `ko/right-vs-light/`
- `pt/english-ear-training/`, `pt/minimal-pairs-practice/`, `pt/ship-vs-sheep/`
- `ru/english-ear-training/`, `ru/minimal-pairs-practice/`, `ru/ship-vs-sheep/`
- `th/english-ear-training/`, `th/minimal-pairs-practice/`, `th/thin-vs-tin/`
- `tr/english-ear-training/`, `tr/minimal-pairs-practice/`, `tr/ship-vs-sheep/`
- `vi/english-ear-training/`, `vi/minimal-pairs-practice/`, `vi/right-vs-light/`
- `yue/english-ear-training/`, `yue/minimal-pairs-practice/`, `yue/right-vs-light/`
- `zh/english-ear-training/`, `zh/minimal-pairs-practice/`, `zh/ship-vs-sheep/`

Legal sources moved to `legal/`:

- `privacy/index.html` -> `legal/privacy/index.html`
- `terms/index.html` -> `legal/terms/index.html`
- `privacy.html` and `privacy-*.html` -> `legal/privacy/`
- `terms.html` and `terms-*.html` -> `legal/terms/`

## Rollback Strategy

Rollback is a source-path rollback, not a public URL rollback.

1. Revert the commit containing this migration, or move tracked files back to their previous root paths with `git mv`.
2. Restore the old Vite input derivation where `seoPageSlugs` map directly to `${slug}/index.html`.
3. Restore localized homepage generation to `<locale>/index.html` and restore the old `.gitignore` entries.
4. Restore validator source paths.
5. Run `npm run build` and the validation commands listed in the verification log.
6. Compare route output in `dist/` against the expected public paths before deploying.

Regression indicators:

- `dist/content/` or `dist/legal/` contains public HTML pages after build.
- Expected public routes such as `dist/ship-vs-sheep/index.html`, `dist/ja/index.html`, or `dist/privacy.html` are missing.
- Canonical URLs or sitemap URLs change from `https://getsoundwise.co/...`.
- Validators fail because they cannot find moved source files.

## Unresolved Risks

- The output-path preservation plugin depends on Vite emitting HTML assets with source-relative `fileName` values before `generateBundle`. This is verified by the build, but it should be rechecked after Vite major upgrades.
- Some historical planning docs still mention old source paths as part of past implementation notes. Active docs were updated, but historical docs were not rewritten to avoid changing project history.
- Generated localized homepage files are ignored. Contributors should run `npm run build` or `npm run generate:localized-homepages` before validating localized homepage source files.

## Verification Log

Commands run after the migration:

```bash
npm run build
npm run validate:landing-copy
npm run validate:localized-homepages
npm run validate:seo-exercise
npm run validate:seo-conversion-matrix
npm run validate:localized -- --page yue/right-vs-light --page ja/ship-vs-sheep --page ko/right-vs-light
npm run validate:app-store-tracking
npm run validate:funnel-tracking
node --test scripts/app-store-id-hygiene.test.mjs scripts/validate-localized-seo-page.test.mjs scripts/seo-exercise-translations.test.mjs
node scripts/validate-yue-right-vs-light.mjs
```

Results:

- `npm run build`: passed. The Vite size report and actual `dist/` artifact contain the expected public paths.
- Route-shape check: passed. `dist/content` HTML count was `0`, `dist/legal` HTML count was `0`, and sample public routes `dist/ship-vs-sheep/index.html`, `dist/ja/index.html`, `dist/privacy.html`, and `dist/terms.html` existed.
- `npm run validate:landing-copy`: passed with exit code 0. Existing RTL advisory output remains for Arabic and Persian mixed RTL/LTR text.
- `npm run validate:localized-homepages`: passed with `status: ok`.
- `npm run validate:seo-exercise`: passed.
- `npm run validate:seo-conversion-matrix`: passed.
- `npm run validate:localized -- --page yue/right-vs-light --page ja/ship-vs-sheep --page ko/right-vs-light`: passed all page checks.
- `npm run validate:app-store-tracking`: passed.
- `npm run validate:funnel-tracking`: passed.
- `npm run validate:exercise-engine`: passed, 6 tests.
- `node --test scripts/app-store-id-hygiene.test.mjs scripts/validate-localized-seo-page.test.mjs scripts/seo-exercise-translations.test.mjs`: passed, 7 tests.
- `node scripts/validate-yue-right-vs-light.mjs`: passed with `status: ok`.
