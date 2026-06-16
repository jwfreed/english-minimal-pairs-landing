# Thai SEO Hub Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Thai `english-ear-training` and `minimal-pairs-practice` static hub pages, wire them into Vite and the sitemap, and update reciprocal hreflang clusters without changing the existing page system.

**Architecture:** Implement two checked-in static HTML pages by cloning the current localized hub-page structure used by the newest locale rollouts, then apply minimal registry changes in `vite.config.js` and `public/sitemap.xml`. Keep all Thai copy manual and explicit, add the approved structural cross-links in the same positions used by the newest localized pages, and verify the two Thai pages plus every reciprocal hreflang update with targeted grep and JSON-LD parsing checks.

**Tech Stack:** Vite multi-page static site, hand-authored HTML, JSON-LD, XML sitemap, repo validation scripts, `rtk` shell wrapper.

---

## File Map

**Create**

- `th/english-ear-training/index.html`: Thai ear-training hub page with Thai metadata, Thai article copy, JSON-LD, localized CTA, approved cross-link section, and full hreflang cluster including `th`.
- `th/minimal-pairs-practice/index.html`: Thai minimal-pairs hub page with Thai metadata, Thai article copy, JSON-LD, localized CTA, approved related-guide cross-link section, and full hreflang cluster including `th`.

**Modify**

- `vite.config.js`: add `th/english-ear-training` and `th/minimal-pairs-practice` to `seoPageSlugs`.
- `public/sitemap.xml`: add both Thai canonicals with trailing slash and current rollout sitemap metadata.
- `english-ear-training/index.html`
- `es/english-ear-training/index.html`
- `ja/english-ear-training/index.html`
- `zh/english-ear-training/index.html`
- `yue/english-ear-training/index.html`
- `ar/english-ear-training/index.html`
- `hi-ur/english-ear-training/index.html`
- `fa/english-ear-training/index.html`
- `id/english-ear-training/index.html`
- `ko/english-ear-training/index.html`
- `pt/english-ear-training/index.html`
- `ru/english-ear-training/index.html`
- `minimal-pairs-practice/index.html`
- `es/minimal-pairs-practice/index.html`
- `ja/minimal-pairs-practice/index.html`
- `zh/minimal-pairs-practice/index.html`
- `yue/minimal-pairs-practice/index.html`
- `ar/minimal-pairs-practice/index.html`
- `hi-ur/minimal-pairs-practice/index.html`
- `fa/minimal-pairs-practice/index.html`
- `id/minimal-pairs-practice/index.html`
- `ko/minimal-pairs-practice/index.html`
- `pt/minimal-pairs-practice/index.html`
- `ru/minimal-pairs-practice/index.html`

**Reference Inputs**

- `/Users/jonathanfreed/Documents/Soundwise SEO copy/Foreign Language/Thai/th-english-ear-training.md`
- `/Users/jonathanfreed/Documents/Soundwise SEO copy/Foreign Language/Thai/th-minimal-pairs-practice.md`
- `ru/english-ear-training/index.html`
- `ru/minimal-pairs-practice/index.html`
- `id/english-ear-training/index.html`
- `id/minimal-pairs-practice/index.html`

### Task 1: Baseline And Reference Capture

**Files:**
- Modify: none
- Reference: `package.json`, `vite.config.js`, `public/sitemap.xml`, `ru/english-ear-training/index.html`, `ru/minimal-pairs-practice/index.html`, `id/english-ear-training/index.html`, `id/minimal-pairs-practice/index.html`

- [ ] **Step 1: Confirm workspace state**

Run:

```bash
rtk git status --short --branch
```

Expected: branch and any existing spec/plan changes are shown; no Thai hub-page implementation files exist yet.

- [ ] **Step 2: Reconfirm route and sitemap conventions**

Run:

```bash
rtk rg -n "seoPageSlugs|ru/english-ear-training|ru/minimal-pairs-practice|<loc>https://getsoundwise.co/ru/english-ear-training/|<loc>https://getsoundwise.co/ru/minimal-pairs-practice/" vite.config.js public/sitemap.xml
```

Expected: localized hub pages are enumerated manually in both files.

- [ ] **Step 3: Reconfirm the latest hreflang order and cross-link placement**

Run:

```bash
rtk rg -n '<link rel="alternate" hreflang=|<section id="minimal-pairs-guide"|<section id="related-guide"' \
  ru/english-ear-training/index.html \
  ru/minimal-pairs-practice/index.html \
  id/english-ear-training/index.html \
  id/minimal-pairs-practice/index.html
```

Expected: the current locale order ends with locale self-link then `x-default`, and the cross-link sections appear at the same positions in both `ru` and `id`.

### Task 2: Create `th/english-ear-training/index.html`

**Files:**
- Create: `th/english-ear-training/index.html`
- Reference: `ru/english-ear-training/index.html`, `id/english-ear-training/index.html`, `/Users/jonathanfreed/Documents/Soundwise SEO copy/Foreign Language/Thai/th-english-ear-training.md`

- [ ] **Step 1: Draft the Thai page from the current localized template**

Copy the localized shell from `ru/english-ear-training/index.html` and replace content with the Thai source while preserving the static structure. The new head block must include:

```html
<!doctype html>
<html lang="th">
  <head>
    <meta charset="UTF-8" />
    <meta name="description" content="ship กับ sheep ฟังเหมือนกันไหม? คู่มือฝึกหูภาษาอังกฤษสำหรับคนไทยที่อยากแยกเสียงอังกฤษให้ชัดขึ้นด้วย minimal pairs" />
    <link rel="canonical" href="https://getsoundwise.co/th/english-ear-training/" />
    <!-- full hreflang cluster in newest existing order, plus th, then x-default -->
    <meta property="og:title" content="ฝึกฟังภาษาอังกฤษ | ฟังให้แยกก่อน แล้วค่อยพูดให้ชัด" />
    <meta property="og:description" content="ship กับ sheep ฟังเหมือนกันไหม? คู่มือฝึกหูภาษาอังกฤษสำหรับคนไทยที่อยากแยกเสียงอังกฤษให้ชัดขึ้นด้วย minimal pairs" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://getsoundwise.co/th/english-ear-training/" />
    <meta property="og:site_name" content="Soundwise" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="ฝึกฟังภาษาอังกฤษ | ฟังให้แยกก่อน แล้วค่อยพูดให้ชัด" />
    <meta name="twitter:description" content="ship กับ sheep ฟังเหมือนกันไหม? คู่มือฝึกหูภาษาอังกฤษสำหรับคนไทยที่อยากแยกเสียงอังกฤษให้ชัดขึ้นด้วย minimal pairs" />
    <title>ฝึกฟังภาษาอังกฤษ | ฟังให้แยกก่อน แล้วค่อยพูดให้ชัด</title>
  </head>
```

- [ ] **Step 2: Insert the Thai hero, TOC, and article content without rewriting it**

Preserve the Thai content exactly except for HTML escaping, tag wrapping, whitespace normalization, and existing static-site markup conventions. The hero and TOC should map like this:

```html
<p class="seo-kicker">ฟังให้แยกก่อน แล้วค่อยพูดให้ชัด</p>
<h1>ฝึกฟังภาษาอังกฤษ: ฟังให้แยกก่อน แล้วค่อยพูดให้ชัด</h1>
<aside class="seo-toc" aria-label="Page sections">
  <p>เนื้อหาในหน้านี้</p>
  <a href="#why-listening-first">ทำไมต้องฟังก่อนพูด?</a>
  <a href="#what-ear-training-means">การฝึกฟังคืออะไร?</a>
  <a href="#common-contrasts">เสียงที่คนไทยมักสับสน</a>
  <a href="#how-to-practice">วิธีฝึก</a>
  <a href="#minimal-pairs-guide">ยี่สิบหน้าฝึกเสียง</a>
  <a href="#soundwise">เกี่ยวกับ Soundwise</a>
  <a href="#faq">คำถามที่พบบ่อย</a>
</aside>
```

- [ ] **Step 3: Add the approved structural cross-link section**

If the final Thai source still lacks an equivalent section, add the dedicated cross-link section before the Soundwise CTA using the same markup pattern as `ru/english-ear-training/index.html`:

```html
<section id="minimal-pairs-guide" aria-labelledby="minimal-pairs-guide-title">
  <h2 id="minimal-pairs-guide-title">ยี่สิบหน้าฝึกเสียง</h2>
  <p><a href="/th/minimal-pairs-practice/">ดูวิธีฝึกด้วย minimal pairs</a></p>
</section>
```

If the final Thai source already contains an equivalent section or link, preserve the source section and adapt only the markup or placement needed to match the localized pattern.

- [ ] **Step 4: Add Thai JSON-LD and CTA details**

Use the existing three-block JSON-LD pattern, localized to the visible Thai content. Include:

```json
{
  "@context": "https://schema.org",
  "@type": "LearningResource",
  "name": "ฝึกฟังภาษาอังกฤษ: ฟังให้แยกก่อน แล้วค่อยพูดให้ชัด",
  "url": "https://getsoundwise.co/th/english-ear-training/",
  "inLanguage": "th"
}
```

And localize the nav/app CTA tracking:

```html
<a
  href="https://apps.apple.com/app/apple-store/id6743531155?pt=127297995&amp;ct=thai-english-ear-training&amp;mt=8"
  id="nav-th-english-ear-training-app-store-cta"
  class="nav-cta"
>เริ่มฝึก</a>
```

- [ ] **Step 5: Verify the new file contains the required Thai markers**

Run:

```bash
rtk rg -n 'lang="th"|canonical|hreflang="th"|nav-th-english-ear-training-app-store-cta|thai-english-ear-training|inLanguage|/th/minimal-pairs-practice/' th/english-ear-training/index.html
```

Expected: all required Thai metadata, CTA, and internal-link markers are present.

### Task 3: Create `th/minimal-pairs-practice/index.html`

**Files:**
- Create: `th/minimal-pairs-practice/index.html`
- Reference: `ru/minimal-pairs-practice/index.html`, `id/minimal-pairs-practice/index.html`, `/Users/jonathanfreed/Documents/Soundwise SEO copy/Foreign Language/Thai/th-minimal-pairs-practice.md`

- [ ] **Step 1: Draft the Thai minimal-pairs page from the current localized template**

Create the file with the same shell as `ru/minimal-pairs-practice/index.html`, using the Thai source metadata:

```html
<!doctype html>
<html lang="th">
  <head>
    <meta name="description" content="ฝึกแยกเสียงภาษาอังกฤษด้วย minimal pairs เช่น ship/sheep, thin/tin, vest/west และ bad/bed สำหรับผู้เรียนชาวไทย" />
    <link rel="canonical" href="https://getsoundwise.co/th/minimal-pairs-practice/" />
    <!-- full hreflang cluster in newest existing order, plus th, then x-default -->
    <meta property="og:title" content="Minimal Pairs ภาษาอังกฤษ | ฝึกแยกเสียงที่คล้ายกัน" />
    <meta property="og:description" content="ฝึกแยกเสียงภาษาอังกฤษด้วย minimal pairs เช่น ship/sheep, thin/tin, vest/west และ bad/bed สำหรับผู้เรียนชาวไทย" />
    <meta property="og:url" content="https://getsoundwise.co/th/minimal-pairs-practice/" />
    <title>Minimal Pairs ภาษาอังกฤษ | ฝึกแยกเสียงที่คล้ายกัน</title>
  </head>
```

- [ ] **Step 2: Insert the Thai page copy and preserve supplied links**

Use the Thai source verbatim except for HTML-safe formatting. Keep the localized contrast-page URLs exactly as supplied. The hero and TOC should map like this:

```html
<p class="seo-kicker">ฝึกแยกเสียงที่คล้ายกัน</p>
<h1>Minimal Pairs ภาษาอังกฤษ: ฝึกแยกเสียงที่คล้ายกัน</h1>
<aside class="seo-toc" aria-label="Page sections">
  <p>เนื้อหาในหน้านี้</p>
  <a href="#what-are-minimal-pairs">Minimal pairs คืออะไร?</a>
  <a href="#why-they-help">ทำไมมันช่วยได้?</a>
  <a href="#how-to-practice">วิธีฝึก</a>
  <a href="#start-here">เริ่มจากเสียงไหน</a>
  <a href="#soundwise">เกี่ยวกับ Soundwise</a>
  <a href="#faq">คำถามที่พบบ่อย</a>
</aside>
```

- [ ] **Step 3: Add the approved related-guide section**

If the final Thai source still lacks an equivalent section, add the dedicated related-guide section after the Soundwise CTA and before the FAQ using the same markup pattern as `ru/minimal-pairs-practice/index.html`:

```html
<section id="related-guide" aria-labelledby="related-guide-title">
  <h2 id="related-guide-title">อ่านต่อ</h2>
  <p><a href="/th/english-ear-training/">อ่านเพิ่มเติมเรื่องการฝึกฟังภาษาอังกฤษ</a></p>
</section>
```

If the final Thai source already contains an equivalent section or link, preserve the source section and adapt only the markup or placement needed to match the localized pattern.

- [ ] **Step 4: Add Thai JSON-LD and CTA details**

Use the same JSON-LD block set as current localized pages, localized to Thai page content. Include:

```json
{
  "@context": "https://schema.org",
  "@type": "LearningResource",
  "name": "Minimal Pairs ภาษาอังกฤษ: ฝึกแยกเสียงที่คล้ายกัน",
  "url": "https://getsoundwise.co/th/minimal-pairs-practice/",
  "inLanguage": "th"
}
```

And localize the nav/app CTA tracking:

```html
<a
  href="https://apps.apple.com/app/apple-store/id6743531155?pt=127297995&amp;ct=thai-minimal-pairs-practice&amp;mt=8"
  id="nav-th-minimal-pairs-practice-app-store-cta"
  class="nav-cta"
>เริ่มฝึก</a>
```

- [ ] **Step 5: Verify the new file contains the required Thai markers**

Run:

```bash
rtk rg -n 'lang="th"|canonical|hreflang="th"|nav-th-minimal-pairs-practice-app-store-cta|thai-minimal-pairs-practice|inLanguage|/th/english-ear-training/' th/minimal-pairs-practice/index.html
```

Expected: all required Thai metadata, CTA, and internal-link markers are present.

### Task 4: Register Routes, Sitemap Entries, And Reciprocal Hreflang Links

**Files:**
- Modify: `vite.config.js`, `public/sitemap.xml`, `english-ear-training/index.html`, `es/english-ear-training/index.html`, `ja/english-ear-training/index.html`, `zh/english-ear-training/index.html`, `yue/english-ear-training/index.html`, `ar/english-ear-training/index.html`, `hi-ur/english-ear-training/index.html`, `fa/english-ear-training/index.html`, `id/english-ear-training/index.html`, `ko/english-ear-training/index.html`, `pt/english-ear-training/index.html`, `ru/english-ear-training/index.html`, `minimal-pairs-practice/index.html`, `es/minimal-pairs-practice/index.html`, `ja/minimal-pairs-practice/index.html`, `zh/minimal-pairs-practice/index.html`, `yue/minimal-pairs-practice/index.html`, `ar/minimal-pairs-practice/index.html`, `hi-ur/minimal-pairs-practice/index.html`, `fa/minimal-pairs-practice/index.html`, `id/minimal-pairs-practice/index.html`, `ko/minimal-pairs-practice/index.html`, `pt/minimal-pairs-practice/index.html`, `ru/minimal-pairs-practice/index.html`

- [ ] **Step 1: Register both Thai slugs in Vite**

Add these exact entries to `seoPageSlugs` in `vite.config.js`, immediately after the current `ru` entries:

```js
  'ru/english-ear-training',
  'ru/minimal-pairs-practice',
  'th/english-ear-training',
  'th/minimal-pairs-practice',
```

- [ ] **Step 2: Add both Thai canonical URLs to the sitemap**

Add these exact blocks to `public/sitemap.xml`, matching current localized hub-page formatting and rollout metadata:

```xml
  <url>
    <loc>https://getsoundwise.co/th/english-ear-training/</loc>
    <lastmod>2026-06-16</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://getsoundwise.co/th/minimal-pairs-practice/</loc>
    <lastmod>2026-06-16</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
```

- [ ] **Step 3: Add `th` to every existing `english-ear-training` hreflang cluster**

In each file in the `english-ear-training` family, add:

```html
<link rel="alternate" hreflang="th" href="https://getsoundwise.co/th/english-ear-training/" />
```

Place it immediately before `x-default`, preserving the existing locale order used by the newest localized pages.

- [ ] **Step 4: Add `th` to every existing `minimal-pairs-practice` hreflang cluster**

In each file in the `minimal-pairs-practice` family, add:

```html
<link rel="alternate" hreflang="th" href="https://getsoundwise.co/th/minimal-pairs-practice/" />
```

Place it immediately before `x-default`, preserving the existing locale order used by the newest localized pages.

- [ ] **Step 5: Verify route registration, sitemap entries, and reciprocal hreflang coverage**

Run:

```bash
rtk rg -n 'th/english-ear-training|th/minimal-pairs-practice' vite.config.js public/sitemap.xml
```

Expected: both Thai slugs appear in `vite.config.js` and both Thai canonicals appear in `public/sitemap.xml`.

Run:

```bash
rtk rg -n 'hreflang="th"' \
  english-ear-training/index.html es/english-ear-training/index.html ja/english-ear-training/index.html zh/english-ear-training/index.html yue/english-ear-training/index.html ar/english-ear-training/index.html hi-ur/english-ear-training/index.html fa/english-ear-training/index.html id/english-ear-training/index.html ko/english-ear-training/index.html pt/english-ear-training/index.html ru/english-ear-training/index.html th/english-ear-training/index.html \
  minimal-pairs-practice/index.html es/minimal-pairs-practice/index.html ja/minimal-pairs-practice/index.html zh/minimal-pairs-practice/index.html yue/minimal-pairs-practice/index.html ar/minimal-pairs-practice/index.html hi-ur/minimal-pairs-practice/index.html fa/minimal-pairs-practice/index.html id/minimal-pairs-practice/index.html ko/minimal-pairs-practice/index.html pt/minimal-pairs-practice/index.html ru/minimal-pairs-practice/index.html th/minimal-pairs-practice/index.html
```

Expected: every file in both families contains exactly one `hreflang="th"` line.

### Task 5: Build, Validate, And Compare Copy

**Files:**
- Verify: `th/english-ear-training/index.html`, `th/minimal-pairs-practice/index.html`, `dist/th/english-ear-training/index.html`, `dist/th/minimal-pairs-practice/index.html`
- Reference: `/Users/jonathanfreed/Documents/Soundwise SEO copy/Foreign Language/Thai/th-english-ear-training.md`, `/Users/jonathanfreed/Documents/Soundwise SEO copy/Foreign Language/Thai/th-minimal-pairs-practice.md`

- [ ] **Step 1: Build the site**

Run:

```bash
rtk npm run build
```

Expected: Vite completes successfully and emits `dist/th/english-ear-training/index.html` and `dist/th/minimal-pairs-practice/index.html`.

- [ ] **Step 2: Run repo validators when available**

Run:

```bash
rtk npm run validate:app-store-tracking
```

Expected: command succeeds, or returns a clear raw error if the script is unavailable.

Run:

```bash
rtk npm run validate:localized-homepages
```

Expected: command succeeds, or returns a clear raw error if the script is unavailable.

- [ ] **Step 3: Verify built output and canonical markers**

Run:

```bash
rtk rg -n 'lang="th"|https://getsoundwise.co/th/english-ear-training/|https://getsoundwise.co/th/minimal-pairs-practice/|thai-english-ear-training|thai-minimal-pairs-practice' \
  th/english-ear-training/index.html \
  th/minimal-pairs-practice/index.html \
  dist/th/english-ear-training/index.html \
  dist/th/minimal-pairs-practice/index.html
```

Expected: Thai source and built files both contain the Thai language markers, canonicals, and App Store tracking values.

- [ ] **Step 4: Parse JSON-LD from both Thai pages**

Run:

```bash
node - <<'EOF'
const fs = require('fs');
for (const file of [
  'th/english-ear-training/index.html',
  'th/minimal-pairs-practice/index.html',
]) {
  const html = fs.readFileSync(file, 'utf8');
  const matches = [...html.matchAll(/<script type="application\\/ld\\+json">([\\s\\S]*?)<\\/script>/g)];
  console.log(file, matches.length);
  for (const match of matches) JSON.parse(match[1]);
}
EOF
```

Expected:

```text
th/english-ear-training/index.html 3
th/minimal-pairs-practice/index.html 3
```

- [ ] **Step 5: Check copy preservation and final diff shape**

Run:

```bash
rtk git diff --stat
```

Expected: only the planned Thai pages, registry files, reciprocal hreflang pages, and plan/spec files are modified.

Run:

```bash
rtk git diff -- th/english-ear-training/index.html th/minimal-pairs-practice/index.html vite.config.js public/sitemap.xml
```

Expected: Thai prose matches source content except for HTML markup, whitespace normalization, and the approved structural cross-link sections.

## Self-Review

- Spec coverage check: this plan covers the two new Thai pages, Vite route registration, sitemap additions, reciprocal hreflang updates across both families, Thai language metadata, JSON-LD, approved structural cross-links, build verification, repo validators, and copy-preservation review.
- Placeholder scan: no `TODO`, `TBD`, or implicit “handle later” tasks remain; every task lists exact files and commands.
- Type and naming consistency: all file paths, section ids, hreflang values, canonical URLs, and CTA ids match the approved spec and current repo patterns.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-06-16-thai-seo-hub-pages.md`. The user has already approved proceeding, so execute this plan inline in the current session. Do not commit, push, or open a PR until the user reviews the diff.
