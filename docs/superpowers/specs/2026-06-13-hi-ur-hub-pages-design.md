# Hindi/Urdu SEO Hub Pages Design

Date: 2026-06-13

## Goal

Add two Hindi-content SEO hub pages to the existing Hindi/Urdu locale family:

- `/hi-ur/english-ear-training/`
- `/hi-ur/minimal-pairs-practice/`

The pages should use the provided Hindi/Hindustani copy as the source of truth, preserve the site's existing static-page architecture, and keep locale metadata consistent with current `hi-ur` conventions.

## Existing Conventions

The site is a Vite static site. Clean URL SEO pages are standalone `index.html` files listed in `seoPageSlugs` in `vite.config.js`.

The existing Hindi/Urdu homepage uses:

- Route slug: `hi-ur`
- Hreflang: `hi-ur`
- Document language: `<html lang="hi">`
- Canonical homepage URL: `https://getsoundwise.co/hi-ur/`

Translated legal pages also use `lang="hi"` for the Hindi/Urdu locale. The new hub pages should follow that exact pattern: `hi-ur` for URL and hreflang, `hi` for HTML document language.

## Pages

### English Ear Training

Route: `/hi-ur/english-ear-training/`

Canonical: `https://getsoundwise.co/hi-ur/english-ear-training/`

HTML language: `hi`

Hreflang self-entry: `hi-ur`

Source content: `/Users/jonathanfreed/Downloads/HindiUrdu/hi-english-ear-training.md`

The page will preserve the supplied title, meta description, headings, FAQ copy, internal links, and App Store CTA content, with only route and metadata changes required by the repo convention.

### Minimal Pairs Practice

Route: `/hi-ur/minimal-pairs-practice/`

Canonical: `https://getsoundwise.co/hi-ur/minimal-pairs-practice/`

HTML language: `hi`

Hreflang self-entry: `hi-ur`

Source content: `/Users/jonathanfreed/Downloads/HindiUrdu/hi-minimal-pairs-practice.md`

The page will preserve the supplied title, meta description, headings, FAQ copy, internal links, and App Store CTA content, with only route and metadata changes required by the repo convention.

## Implementation Approach

Create two new standalone HTML pages under `hi-ur/`, using the existing localized hub-page structure from current `ar`, `pt`, `ko`, `es`, `ja`, `zh`, and `yue` hub pages.

Each page will include:

- Google Analytics snippet matching existing pages.
- Favicon and viewport metadata matching existing SEO pages.
- Unique title and meta description from the supplied copy.
- Canonical URL using `/hi-ur/`.
- Open Graph and Twitter summary metadata aligned with title and description.
- BreadcrumbList JSON-LD.
- LearningResource JSON-LD with `inLanguage: "hi"`.
- FAQPage JSON-LD that matches the visible FAQ.
- Existing `seo-page seo-body` layout classes and shared `/src/style.css`.
- Existing SEO nav, hero, TOC, content, CTA, FAQ, and footer patterns.

The supplied Markdown will be converted to HTML. Devanagari, Urdu/Hindustani words, IPA symbols, English examples, and CTA text must be preserved. Formatting changes are allowed only where needed for valid HTML, consistent SEO-page markup, or bidirectional handling of English examples in Hindi text.

## Routing And Build

Update `seoPageSlugs` in `vite.config.js` with:

- `hi-ur/english-ear-training`
- `hi-ur/minimal-pairs-practice`

No `/hi/` aliases or redirects will be added because the repo does not currently have a legacy localized-route alias convention for these hub pages.

## Hreflang

Add reciprocal `hi-ur` alternate links to the full localized hub-page clusters for both page families.

For `english-ear-training`, update:

- `/english-ear-training/`
- `/ja/english-ear-training/`
- `/zh/english-ear-training/`
- `/yue/english-ear-training/`
- `/ko/english-ear-training/`
- `/es/english-ear-training/`
- `/pt/english-ear-training/`
- `/ar/english-ear-training/`
- `/hi-ur/english-ear-training/`

For `minimal-pairs-practice`, update:

- `/minimal-pairs-practice/`
- `/ja/minimal-pairs-practice/`
- `/zh/minimal-pairs-practice/`
- `/yue/minimal-pairs-practice/`
- `/ko/minimal-pairs-practice/`
- `/es/minimal-pairs-practice/`
- `/pt/minimal-pairs-practice/`
- `/ar/minimal-pairs-practice/`
- `/hi-ur/minimal-pairs-practice/`

The `x-default` entries remain the English root pages.

## Internal Links

Use `/hi-ur/minimal-pairs-practice/` and `/hi-ur/english-ear-training/` for cross-links between the two new Hindi/Urdu pages.

Existing links to individual English contrast pages remain pointed at their current canonical English URLs because localized contrast pages do not exist.

## Sitemap

Add both production URLs to `public/sitemap.xml` because these are public SEO hub pages:

- `https://getsoundwise.co/hi-ur/english-ear-training/`
- `https://getsoundwise.co/hi-ur/minimal-pairs-practice/`

## Verification

Run the repository's relevant checks after implementation:

- `npm run build`
- Any available validation scripts in `package.json` that apply to static routes or localized pages.

Also inspect:

- `git diff --check`
- Route files exist at both expected paths.
- `vite.config.js` includes both new slugs.
- `public/sitemap.xml` includes both new URLs.
- Hreflang clusters include reciprocal `hi-ur` entries.
- Internal cross-links point to `/hi-ur/`.

## Out Of Scope

- Creating `/hi/` aliases or redirects.
- Rewriting the supplied Hindi copy for style.
- Creating localized individual contrast pages.
- Introducing a new i18n, CMS, routing, or content-generation system.
- Editing unrelated homepage, legal-page, or product copy.
