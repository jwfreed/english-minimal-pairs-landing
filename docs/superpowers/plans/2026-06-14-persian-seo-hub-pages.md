# Persian SEO Hub Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Persian/Farsi static SEO hub pages for English ear training and minimal pairs practice at the requested localized routes.

**Architecture:** Follow the existing checked-in static HTML pattern for SEO hub pages. Convert the provided Persian Markdown copy into semantic HTML inside the established SEO page template, then register the pages with Vite, sitemap metadata, and reciprocal hreflang clusters.

**Tech Stack:** Static HTML, Vite multi-page build, existing `src/style.css`, existing `src/seo-page.js`.

---

### Task 1: Add Persian Static Pages

**Files:**
- Create: `fa/english-ear-training/index.html`
- Create: `fa/minimal-pairs-practice/index.html`

- [ ] **Step 1: Use existing localized SEO pages as templates**

Reference these files for structure, CSS classes, JSON-LD placement, RTL handling, footer, CTA patterns, and FAQ accordion markup:

```bash
rtk sed -n '1,260p' id/english-ear-training/index.html
rtk sed -n '1,260p' id/minimal-pairs-practice/index.html
rtk sed -n '1,260p' ar/english-ear-training/index.html
rtk sed -n '1,260p' ar/minimal-pairs-practice/index.html
```

- [ ] **Step 2: Create `fa/english-ear-training/index.html`**

Convert `/Users/jonathanfreed/Downloads/files 2/fa-english-ear-training.md` to the established static HTML layout. Preserve the Persian prose and frontmatter values as metadata:

```html
<html lang="fa" dir="rtl">
<meta name="description" content="ship و sheep یکی به نظر می‌رسند؟ برای فارسی‌زبانان: روش تمرین تشخیص اصوات انگلیسی با جفت‌های کمینه.">
<link rel="canonical" href="https://getsoundwise.co/fa/english-ear-training/" />
<title>تمرین شنیداری انگلیسی | اول گوش کن، بعد حرف بزن</title>
```

Use app-store tracking:

```text
utm_content=fa-english-ear-training
```

Use Arabic-style inline bidi handling for English tokens and IPA:

```html
<bdi dir="ltr" lang="en">ship</bdi>
<span class="ipa" dir="ltr" lang="en">/ɪ/</span>
```

- [ ] **Step 3: Create `fa/minimal-pairs-practice/index.html`**

Convert `/Users/jonathanfreed/Downloads/files 2/fa-minimal-pairs-practice.md` to the established static HTML layout. Preserve the Persian prose and frontmatter values as metadata:

```html
<html lang="fa" dir="rtl">
<meta name="description" content="تفاوت ship/sheep، thin/tin، bad/bed و دیگر جفت‌های کلمات انگلیسی که فقط یک صدا با هم فرق دارند را تمرین کنید. راهنمای فارسی‌زبانان.">
<link rel="canonical" href="https://getsoundwise.co/fa/minimal-pairs-practice/" />
<title>جفت‌های کمینه انگلیسی | تمرین تشخیص اصوات مشابه</title>
```

Use app-store tracking:

```text
utm_content=fa-minimal-pairs-practice
```

- [ ] **Step 4: Verify the two new static files contain target route metadata**

Run:

```bash
rtk rg -n 'lang="fa"|dir="rtl"|https://getsoundwise.co/fa/english-ear-training/|https://getsoundwise.co/fa/minimal-pairs-practice/|utm_content=fa-' fa
```

Expected: both new files contain Persian language metadata, RTL direction, canonical URLs, cross-links, and CTA tracking values.

### Task 2: Register Routes, Sitemap, and Hreflang

**Files:**
- Modify: `vite.config.js`
- Modify: `public/sitemap.xml`
- Modify: existing hub pages that contain hreflang clusters

- [ ] **Step 1: Add Vite entries**

Add both route slugs to `seoPageSlugs`:

```js
'fa/english-ear-training',
'fa/minimal-pairs-practice',
```

- [ ] **Step 2: Add sitemap entries**

Add two entries to `public/sitemap.xml` near the other localized hub pages, preserving trailing slashes:

```xml
<url>
  <loc>https://getsoundwise.co/fa/english-ear-training/</loc>
  <lastmod>2026-06-14</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.9</priority>
</url>
<url>
  <loc>https://getsoundwise.co/fa/minimal-pairs-practice/</loc>
  <lastmod>2026-06-14</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.9</priority>
</url>
```

- [ ] **Step 3: Add Persian hreflang alternates to existing hub clusters**

For each existing `english-ear-training/index.html` and `*/english-ear-training/index.html` cluster, add:

```html
<link rel="alternate" hreflang="fa" href="https://getsoundwise.co/fa/english-ear-training/" />
```

For each existing `minimal-pairs-practice/index.html` and `*/minimal-pairs-practice/index.html` cluster, add:

```html
<link rel="alternate" hreflang="fa" href="https://getsoundwise.co/fa/minimal-pairs-practice/" />
```

- [ ] **Step 4: Verify route registration and hreflang clusters**

Run:

```bash
rtk rg -n "fa/english-ear-training|fa/minimal-pairs-practice|hreflang=\"fa\"" vite.config.js public/sitemap.xml english-ear-training minimal-pairs-practice ja zh yue ko es pt ar hi-ur id fa
```

Expected: Vite, sitemap, both new pages, and existing hreflang clusters reference both Persian routes.

### Task 3: Validate and Review

**Files:**
- No new files unless verification reveals a focused fix is required.

- [ ] **Step 1: Run app-store tracking validation**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v22.21.0/bin:$PATH" rtk npm run validate:app-store-tracking
```

Expected: exit 0.

- [ ] **Step 2: Run localized homepage validation**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v22.21.0/bin:$PATH" rtk npm run validate:localized-homepages
```

Expected: exit 0.

- [ ] **Step 3: Run build**

Run:

```bash
PATH="$HOME/.nvm/versions/node/v22.21.0/bin:$PATH" rtk npm run build
```

Expected: exit 0 and production output includes:

```text
dist/fa/english-ear-training/index.html
dist/fa/minimal-pairs-practice/index.html
```

- [ ] **Step 4: Check copy preservation**

Compare rendered Persian text against the two source Markdown files. Expected differences are limited to HTML escaping, line wrapping, bidi markup, and required static-site formatting.

```bash
rtk rg -n 'تمرین شنیداری انگلیسی: اول گوش کن، بعد حرف بزن|جفت‌های کمینه انگلیسی: تمرین تشخیص اصوات مشابه|شروع تمرین شنیداری در Soundwise|شروع تمرین جفت کمینه در Soundwise' fa
```

- [ ] **Step 5: Inspect diff**

Run:

```bash
rtk git diff --check
rtk git diff --stat
rtk git diff -- fa/english-ear-training/index.html fa/minimal-pairs-practice/index.html vite.config.js public/sitemap.xml
```

Expected: changes are limited to the two new pages, Vite route registration, sitemap, hreflang clusters, and Superpowers docs.

## Baseline Note

Baseline `npm run build` fails under `/usr/local/bin/node` `v20.0.0` because `src/landing-copy-runtime.js` uses JSON import attributes syntax: `with { type: 'json' }`. The repo documents Node.js `20.19+` or `22.12+` in `docs/deployment.md`; baseline build passes with `PATH="$HOME/.nvm/versions/node/v22.21.0/bin:$PATH"`.
