# Indonesian SEO Hub Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Indonesian static SEO hub pages for English ear training and minimal pairs practice at the requested localized routes.

**Architecture:** Follow the existing checked-in static HTML pattern for SEO hub pages. Convert the provided Markdown copy into semantic HTML inside the established SEO page template, then register the pages with Vite and sitemap metadata.

**Tech Stack:** Static HTML, Vite multi-page build, existing `src/style.css`, existing `src/seo-page.js`.

---

### Task 1: Add Indonesian Static Pages

**Files:**
- Create: `id/english-ear-training/index.html`
- Create: `id/minimal-pairs-practice/index.html`

- [ ] **Step 1: Use existing localized SEO pages as templates**

Reference these files for structure, CSS classes, JSON-LD placement, footer, CTA patterns, and FAQ accordion markup:

```bash
rtk sed -n '1,220p' hi-ur/english-ear-training/index.html
rtk sed -n '1,220p' hi-ur/minimal-pairs-practice/index.html
rtk sed -n '1,180p' es/english-ear-training/index.html
rtk sed -n '1,180p' es/minimal-pairs-practice/index.html
```

- [ ] **Step 2: Create `id/english-ear-training/index.html`**

Convert `/Users/jonathanfreed/Downloads/files 2/id-english-ear-training.md` to the established static HTML layout. Preserve the Indonesian prose and frontmatter values as metadata:

```html
<html lang="id">
<meta name="description" content="Ship dan sheep kedengarannya sama? Untuk penutur bahasa Indonesia: cara melatih telinga membedakan bunyi bahasa Inggris dengan minimal pairs.">
<link rel="canonical" href="https://getsoundwise.co/id/english-ear-training/" />
<title>Latihan Mendengar Bahasa Inggris | Dengar Dulu, Baru Bicara</title>
```

Use app-store tracking:

```text
utm_content=id-english-ear-training
```

- [ ] **Step 3: Create `id/minimal-pairs-practice/index.html`**

Convert `/Users/jonathanfreed/Downloads/files 2/id-minimal-pairs-practice.md` to the established static HTML layout. Preserve the Indonesian prose and frontmatter values as metadata:

```html
<html lang="id">
<meta name="description" content="Latih perbedaan bunyi antara ship/sheep, thin/tin, bad/bed, dan pasangan kata Inggris lainnya yang berbeda satu bunyi. Panduan untuk penutur bahasa Indonesia.">
<link rel="canonical" href="https://getsoundwise.co/id/minimal-pairs-practice/" />
<title>Minimal Pairs Bahasa Inggris | Latihan Membedakan Bunyi untuk Penutur Indonesia</title>
```

Use app-store tracking:

```text
utm_content=id-minimal-pairs-practice
```

- [ ] **Step 4: Verify the two new static files contain target route metadata**

Run:

```bash
rtk rg -n 'lang="id"|https://getsoundwise.co/id/english-ear-training/|https://getsoundwise.co/id/minimal-pairs-practice/|utm_content=id-' id
```

Expected: both new files contain Indonesian language metadata, canonical URLs, cross-links, and CTA tracking values.

### Task 2: Register Routes and Sitemap

**Files:**
- Modify: `vite.config.js`
- Modify: `public/sitemap.xml`
- Modify: existing hub pages that contain hreflang clusters

- [ ] **Step 1: Add Vite entries**

Add both route slugs to `seoPageSlugs`:

```js
'id/english-ear-training',
'id/minimal-pairs-practice',
```

- [ ] **Step 2: Add sitemap entries**

Add two entries to `public/sitemap.xml` near the other localized hub pages:

```xml
<url>
  <loc>https://getsoundwise.co/id/english-ear-training/</loc>
  <lastmod>2026-06-14</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.9</priority>
</url>
<url>
  <loc>https://getsoundwise.co/id/minimal-pairs-practice/</loc>
  <lastmod>2026-06-14</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.9</priority>
</url>
```

- [ ] **Step 3: Add Indonesian hreflang alternates to existing hub clusters**

For each existing `english-ear-training/index.html` and `*/english-ear-training/index.html` cluster, add:

```html
<link rel="alternate" hreflang="id" href="https://getsoundwise.co/id/english-ear-training/" />
```

For each existing `minimal-pairs-practice/index.html` and `*/minimal-pairs-practice/index.html` cluster, add:

```html
<link rel="alternate" hreflang="id" href="https://getsoundwise.co/id/minimal-pairs-practice/" />
```

- [ ] **Step 4: Verify route registration**

Run:

```bash
rtk rg -n "id/english-ear-training|id/minimal-pairs-practice|hreflang=\"id\"" vite.config.js public/sitemap.xml english-ear-training minimal-pairs-practice ja zh yue ko es pt ar hi-ur id
```

Expected: Vite, sitemap, both new pages, and existing hreflang clusters reference both Indonesian routes.

### Task 3: Validate and Review

**Files:**
- No new files unless verification reveals a focused fix is required.

- [ ] **Step 1: Run app-store tracking validation**

Run:

```bash
rtk npm run validate:app-store-tracking
```

Expected: exit 0.

- [ ] **Step 2: Run localized homepage validation**

Run:

```bash
rtk npm run validate:localized-homepages
```

Expected in a compatible Node runtime: exit 0. In this shell, baseline fails under Node `v20.0.0` at JSON import attributes syntax before page changes.

- [ ] **Step 3: Run build**

Run:

```bash
rtk npm run build
```

Expected in a compatible Node runtime: exit 0. In this shell, baseline fails under Node `v20.0.0` at JSON import attributes syntax before page changes.

- [ ] **Step 4: Inspect diff**

Run:

```bash
rtk git diff --stat
rtk git diff -- id/english-ear-training/index.html id/minimal-pairs-practice/index.html vite.config.js public/sitemap.xml
```

Expected: changes are limited to the two new pages, Vite route registration, sitemap, hreflang clusters, and Superpowers docs.
