# Hindi/Urdu Hub Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two Hindi/Urdu SEO hub pages at `/hi-ur/english-ear-training/` and `/hi-ur/minimal-pairs-practice/` using the repo's existing static HTML conventions.

**Architecture:** Each page is a standalone `index.html` file in a subdirectory of `hi-ur/`. Vite's explicit `seoPageSlugs` input list controls whether the pages are included in production builds. The hub-page hreflang clusters must be reciprocal across English and all existing localized hub-page variants.

**Tech Stack:** Static HTML, Vite, Inter font via Google Fonts, `/src/style.css` for shared page styling, `/src/seo-page.js` for FAQ accordion behavior.

---

## File Map

| Action | File |
|--------|------|
| Create | `hi-ur/english-ear-training/index.html` |
| Create | `hi-ur/minimal-pairs-practice/index.html` |
| Modify | `vite.config.js` |
| Modify | `public/sitemap.xml` |
| Modify | `english-ear-training/index.html` |
| Modify | `minimal-pairs-practice/index.html` |
| Modify | `ja/english-ear-training/index.html` |
| Modify | `ja/minimal-pairs-practice/index.html` |
| Modify | `zh/english-ear-training/index.html` |
| Modify | `zh/minimal-pairs-practice/index.html` |
| Modify | `yue/english-ear-training/index.html` |
| Modify | `yue/minimal-pairs-practice/index.html` |
| Modify | `ko/english-ear-training/index.html` |
| Modify | `ko/minimal-pairs-practice/index.html` |
| Modify | `es/english-ear-training/index.html` |
| Modify | `es/minimal-pairs-practice/index.html` |
| Modify | `pt/english-ear-training/index.html` |
| Modify | `pt/minimal-pairs-practice/index.html` |
| Modify | `ar/english-ear-training/index.html` |
| Modify | `ar/minimal-pairs-practice/index.html` |

---

## Task 1: Create `hi-ur/english-ear-training/index.html`

**Files:**
- Create: `hi-ur/english-ear-training/index.html`

Approved metadata:
- `html lang="hi"`
- title: `अंग्रेजी सुनने की ट्रेनिंग | पहले सुनो, फिर बोलो`
- meta description: `क्या आपको ship और sheep, vest और west एक जैसे लगते हैं? हिंदी बोलने वालों के लिए: अंग्रेजी की आवाज़ें पहचानने का तरीका।`
- canonical: `https://getsoundwise.co/hi-ur/english-ear-training/`
- H1: `अंग्रेजी सुनने की ट्रेनिंग: पहले सुनो, फिर बोलो`
- hreflang self-entry: `hi-ur`

Required route and CTA details:
- Nav CTA id: `nav-hi-ur-english-ear-training-app-store-cta`
- Hero CTA id: `hi-ur-english-ear-training-app-store-cta`
- App Store UTM content: `hi-ur-english-ear-training`
- Internal guide link target: `/hi-ur/minimal-pairs-practice/`

- [ ] Create `hi-ur/english-ear-training/` directory.
- [ ] Convert `/Users/jonathanfreed/Downloads/HindiUrdu/hi-english-ear-training.md` into the existing localized hub-page HTML structure.
- [ ] Use `<html lang="hi">`, canonical `/hi-ur/english-ear-training/`, and `hreflang="hi-ur"`.
- [ ] Preserve Devanagari copy, Hindustani/Urdu words, IPA symbols, and English examples.
- [ ] Add BreadcrumbList, LearningResource, and FAQPage JSON-LD matching visible page content.
- [ ] Confirm the visible related guide link points to `/hi-ur/minimal-pairs-practice/`.

## Task 2: Create `hi-ur/minimal-pairs-practice/index.html`

**Files:**
- Create: `hi-ur/minimal-pairs-practice/index.html`

Approved metadata:
- `html lang="hi"`
- title: `अंग्रेजी मिनिमल पेयर्स | मिलती-जुलती आवाज़ों में फ़र्क़ पहचानना`
- meta description: `ship/sheep, vest/west, bad/bed जैसे अंग्रेजी शब्दों में फ़र्क़ पहचानने की ट्रेनिंग। हिंदी बोलने वालों के लिए गाइड।`
- canonical: `https://getsoundwise.co/hi-ur/minimal-pairs-practice/`
- H1: `अंग्रेजी मिनिमल पेयर्स: एक जैसी आवाज़ों में फ़र्क़ पहचानना`
- hreflang self-entry: `hi-ur`

Required route and CTA details:
- Nav CTA id: `nav-hi-ur-minimal-pairs-practice-app-store-cta`
- Hero CTA id: `hi-ur-minimal-pairs-practice-app-store-cta`
- App Store UTM content: `hi-ur-minimal-pairs-practice`
- Internal guide link target: `/hi-ur/english-ear-training/`

- [ ] Create `hi-ur/minimal-pairs-practice/` directory.
- [ ] Convert `/Users/jonathanfreed/Downloads/HindiUrdu/hi-minimal-pairs-practice.md` into the existing localized hub-page HTML structure.
- [ ] Use `<html lang="hi">`, canonical `/hi-ur/minimal-pairs-practice/`, and `hreflang="hi-ur"`.
- [ ] Preserve Devanagari copy, Hindustani/Urdu words, IPA symbols, and English examples.
- [ ] Add BreadcrumbList, LearningResource, and FAQPage JSON-LD matching visible page content.
- [ ] Confirm the visible related guide link points to `/hi-ur/english-ear-training/`.

## Task 3: Update Vite inputs

**Files:**
- Modify: `vite.config.js`

Add the two new slugs to `seoPageSlugs` after the existing localized hub pages:

```js
'hi-ur/english-ear-training',
'hi-ur/minimal-pairs-practice',
```

- [ ] Add both slug entries.
- [ ] Confirm no `/hi/` alias entries are added.

## Task 4: Update reciprocal hreflang clusters

**Files:**
- Modify: every existing `english-ear-training/index.html` and `minimal-pairs-practice/index.html` hub variant listed in the file map.

For every English ear-training hub page, insert this alternate link before `x-default`:

```html
<link rel="alternate" hreflang="hi-ur" href="https://getsoundwise.co/hi-ur/english-ear-training/" />
```

For every minimal-pairs hub page, insert this alternate link before `x-default`:

```html
<link rel="alternate" hreflang="hi-ur" href="https://getsoundwise.co/hi-ur/minimal-pairs-practice/" />
```

- [ ] Update English root hub pages.
- [ ] Update Japanese hub pages.
- [ ] Update Simplified Chinese hub pages.
- [ ] Update Cantonese hub pages.
- [ ] Update Korean hub pages.
- [ ] Update Spanish hub pages.
- [ ] Update Portuguese hub pages.
- [ ] Update Arabic hub pages.
- [ ] Confirm the new Hindi/Urdu pages include the full reciprocal clusters.

## Task 5: Update sitemap

**Files:**
- Modify: `public/sitemap.xml`

Add:

```xml
<url>
  <loc>https://getsoundwise.co/hi-ur/english-ear-training/</loc>
  <lastmod>2026-06-13</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.9</priority>
</url>
<url>
  <loc>https://getsoundwise.co/hi-ur/minimal-pairs-practice/</loc>
  <lastmod>2026-06-13</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.9</priority>
</url>
```

- [ ] Add both URL entries near the other localized hub-page sitemap entries.
- [ ] Confirm no `/hi/` sitemap entries are added.

## Task 6: Verify implementation

**Files:**
- Inspect all modified files.

Run with a Node version that supports JSON import attributes:

```bash
PATH="$HOME/.nvm/versions/node/v22.21.0/bin:$PATH" npm run build
PATH="$HOME/.nvm/versions/node/v22.21.0/bin:$PATH" npm run validate:localized-homepages
PATH="$HOME/.nvm/versions/node/v22.21.0/bin:$PATH" npm run validate:landing-copy
PATH="$HOME/.nvm/versions/node/v22.21.0/bin:$PATH" npm run validate:app-store-tracking
git diff --check
```

Expected:
- Build exits 0.
- `dist/hi-ur/english-ear-training/index.html` exists.
- `dist/hi-ur/minimal-pairs-practice/index.html` exists.
- Validators exit 0 or report only pre-existing non-blocking warnings.
- `git diff --check` exits 0.

- [ ] Run build.
- [ ] Run validation scripts in sequence after build.
- [ ] Confirm dist route files exist.
- [ ] Run `git diff --check`.
- [ ] Review `git diff --stat` for scope.
