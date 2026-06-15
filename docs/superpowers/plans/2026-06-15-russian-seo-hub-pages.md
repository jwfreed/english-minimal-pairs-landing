# Russian SEO Hub Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Russian `english-ear-training` and `minimal-pairs-practice` static hub pages, wire them into Vite and the sitemap, and update reciprocal hreflang clusters without changing the existing page system.

**Architecture:** Implement two checked-in static HTML pages by cloning the current localized hub-page structure used by the newest locale rollouts, then apply minimal registry changes in `vite.config.js` and `public/sitemap.xml`. Keep all copy manual and explicit, and verify the two Russian pages plus every reciprocal hreflang update with targeted grep and JSON-LD parsing checks.

**Tech Stack:** Vite multi-page static site, hand-authored HTML, JSON-LD, XML sitemap, repo validation scripts, `rtk` shell wrapper.

---

## File Map

**Create**

- `ru/english-ear-training/index.html`: Russian ear-training hub page with Russian metadata, copy, JSON-LD, localized CTA, and full hreflang cluster including `ru`.
- `ru/minimal-pairs-practice/index.html`: Russian minimal-pairs hub page with Russian metadata, copy, JSON-LD, localized CTA, and full hreflang cluster including `ru`.

**Modify**

- `vite.config.js`: add `ru/english-ear-training` and `ru/minimal-pairs-practice` to `seoPageSlugs`.
- `public/sitemap.xml`: add both Russian canonicals with trailing slash and newest-rollout sitemap metadata.
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

**Reference Inputs**

- `/Users/jonathanfreed/Downloads/Russian/ru-english-ear-training.md`
- `/Users/jonathanfreed/Downloads/Russian/ru-minimal-pairs-practice.md`
- `id/english-ear-training/index.html`
- `id/minimal-pairs-practice/index.html`
- `fa/english-ear-training/index.html`
- `fa/minimal-pairs-practice/index.html`

### Task 1: Baseline And Reference Capture

**Files:**
- Modify: none
- Reference: `package.json`, `vite.config.js`, `public/sitemap.xml`, `id/english-ear-training/index.html`, `id/minimal-pairs-practice/index.html`, `fa/english-ear-training/index.html`, `fa/minimal-pairs-practice/index.html`

- [ ] **Step 1: Confirm clean intent and current workspace state**

Run:

```bash
rtk git status --short
```

Expected: existing spec and plan files may be modified; no Russian hub-page implementation files exist yet.

- [ ] **Step 2: Reconfirm the current route and sitemap conventions**

Run:

```bash
rtk rg -n "seoPageSlugs|id/english-ear-training|id/minimal-pairs-practice|fa/english-ear-training|fa/minimal-pairs-practice" vite.config.js public/sitemap.xml
```

Expected: localized hub pages are enumerated manually in `vite.config.js` and `public/sitemap.xml`.

- [ ] **Step 3: Reconfirm the latest hreflang ordering to clone**

Run:

```bash
rtk rg -n '<link rel="alternate" hreflang=' \
  id/english-ear-training/index.html \
  id/minimal-pairs-practice/index.html \
  fa/english-ear-training/index.html \
  fa/minimal-pairs-practice/index.html
```

Expected: newest localized pages show the locale order to preserve, ending with `x-default`.

### Task 2: Create `ru/english-ear-training/index.html`

**Files:**
- Create: `ru/english-ear-training/index.html`
- Reference: `id/english-ear-training/index.html`, `fa/english-ear-training/index.html`, `/Users/jonathanfreed/Downloads/Russian/ru-english-ear-training.md`

- [ ] **Step 1: Draft the Russian page from the current localized template**

Copy the localized shell from `id/english-ear-training/index.html` and replace content with the Russian source while preserving the static structure. The new head block must follow this shape:

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-FTKLKBSY0K"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-FTKLKBSY0K');
    </script>
    <link rel="icon" type="image/png" href="/EMP_logo.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light" />
    <meta name="description" content="ship и sheep звучат одинаково? Для русскоязычных: как тренировать слух для различения звуков английского с помощью минимальных пар." />
    <link rel="canonical" href="https://getsoundwise.co/ru/english-ear-training/" />
    <!-- full hreflang cluster in newest existing order, plus ru, then x-default -->
    <meta property="og:title" content="Тренировка слуха по английскому | Сначала услышь — потом говори" />
    <meta property="og:description" content="ship и sheep звучат одинаково? Для русскоязычных: как тренировать слух для различения звуков английского с помощью минимальных пар." />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://getsoundwise.co/ru/english-ear-training/" />
    <meta property="og:site_name" content="Soundwise" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="Тренировка слуха по английскому | Сначала услышь — потом говори" />
    <meta name="twitter:description" content="ship и sheep звучат одинаково? Для русскоязычных: как тренировать слух для различения звуков английского с помощью минимальных пар." />
    <title>Тренировка слуха по английскому | Сначала услышь — потом говори</title>
  </head>
```

- [ ] **Step 2: Insert the Russian body copy without rewriting it**

Preserve the Russian content exactly except for HTML escaping, tag wrapping, whitespace normalization, and existing static-site markup conventions. The hero and TOC should map like this:

```html
<p class="seo-kicker">Сначала услышь, потом говори</p>
<h1>Тренировка слуха по английскому: сначала услышь, потом говори</h1>
<aside class="seo-toc" aria-label="Page sections">
  <p>Содержание страницы</p>
  <a href="#why-listening-first">Почему сначала нужно слушать?</a>
  <a href="#what-ear-training-means">Что такое тренировка слуха?</a>
  <a href="#common-contrasts">Типичные трудности</a>
  <a href="#how-to-practice">Как заниматься</a>
  <a href="#minimal-pairs-guide">Двадцать страниц практики</a>
  <a href="#soundwise">О Soundwise</a>
  <a href="#faq">Вопросы и ответы</a>
</aside>
```

- [ ] **Step 3: Add Russian JSON-LD and CTA details**

Use the existing three-block JSON-LD pattern, localized to the visible Russian content. Include:

```json
{
  "@context": "https://schema.org",
  "@type": "LearningResource",
  "name": "Тренировка слуха по английскому: сначала услышь, потом говори",
  "url": "https://getsoundwise.co/ru/english-ear-training/",
  "inLanguage": "ru"
}
```

And localize the nav/app CTA tracking:

```html
<a
  href="https://apps.apple.com/us/app/soundwise-english/id6753882308?utm_source=website&utm_medium=seo-page&utm_campaign=seo-hub-pages&utm_content=ru-english-ear-training"
  id="nav-ru-english-ear-training-app-store-cta"
  class="nav-cta"
>Начать тренировку</a>
```

- [ ] **Step 4: Verify the new file contains the required Russian markers**

Run:

```bash
rtk rg -n 'lang="ru"|canonical|hreflang="ru"|utm_content=ru-english-ear-training|inLanguage' ru/english-ear-training/index.html
```

Expected: all required Russian metadata markers are present.

### Task 3: Create `ru/minimal-pairs-practice/index.html`

**Files:**
- Create: `ru/minimal-pairs-practice/index.html`
- Reference: `id/minimal-pairs-practice/index.html`, `fa/minimal-pairs-practice/index.html`, `/Users/jonathanfreed/Downloads/Russian/ru-minimal-pairs-practice.md`

- [ ] **Step 1: Draft the Russian minimal-pairs page from the current localized template**

Create the file with the same shell as `id/minimal-pairs-practice/index.html`, using the Russian source metadata:

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta name="description" content="Тренируйте различие между ship/sheep, thin/tin, vest/west и другими парами английских слов, различающихся одним звуком. Руководство для русскоязычных." />
    <link rel="canonical" href="https://getsoundwise.co/ru/minimal-pairs-practice/" />
    <!-- full hreflang cluster in newest existing order, plus ru, then x-default -->
    <meta property="og:title" content="Минимальные пары в английском | Тренировка различения звуков" />
    <meta property="og:description" content="Тренируйте различие между ship/sheep, thin/tin, vest/west и другими парами английских слов, различающихся одним звуком. Руководство для русскоязычных." />
    <meta property="og:url" content="https://getsoundwise.co/ru/minimal-pairs-practice/" />
    <title>Минимальные пары в английском | Тренировка различения звуков</title>
  </head>
```

- [ ] **Step 2: Insert the Russian page copy and preserve supplied links**

Use the Russian source verbatim except for HTML-safe formatting. Keep the localized related-material cross-link and the supplied contrast-page URLs:

```html
<p class="seo-kicker">Тренировка минимальных пар в английском</p>
<h1>Минимальные пары в английском: как различить похожие звуки</h1>
<a href="/ru/english-ear-training/">Тренировка слуха по английскому: сначала услышь, потом говори</a>
```

- [ ] **Step 3: Add Russian JSON-LD and CTA details**

Use the same JSON-LD block set as current localized pages, localized to Russian page content. Include:

```json
{
  "@context": "https://schema.org",
  "@type": "LearningResource",
  "name": "Минимальные пары в английском: как различить похожие звуки",
  "url": "https://getsoundwise.co/ru/minimal-pairs-practice/",
  "inLanguage": "ru"
}
```

And localize the nav/app CTA tracking:

```html
<a
  href="https://apps.apple.com/us/app/soundwise-english/id6753882308?utm_source=website&utm_medium=seo-page&utm_campaign=seo-hub-pages&utm_content=ru-minimal-pairs-practice"
  id="nav-ru-minimal-pairs-practice-app-store-cta"
  class="nav-cta"
>Начать тренировку</a>
```

- [ ] **Step 4: Verify the new file contains the required Russian markers**

Run:

```bash
rtk rg -n 'lang="ru"|canonical|hreflang="ru"|utm_content=ru-minimal-pairs-practice|inLanguage' ru/minimal-pairs-practice/index.html
```

Expected: all required Russian metadata markers are present.

### Task 4: Register Routes, Sitemap Entries, And Reciprocal Hreflang Links

**Files:**
- Modify: `vite.config.js`, `public/sitemap.xml`
- Modify: `english-ear-training/index.html`, `es/english-ear-training/index.html`, `ja/english-ear-training/index.html`, `zh/english-ear-training/index.html`, `yue/english-ear-training/index.html`, `ar/english-ear-training/index.html`, `hi-ur/english-ear-training/index.html`, `fa/english-ear-training/index.html`, `id/english-ear-training/index.html`, `ko/english-ear-training/index.html`, `pt/english-ear-training/index.html`
- Modify: `minimal-pairs-practice/index.html`, `es/minimal-pairs-practice/index.html`, `ja/minimal-pairs-practice/index.html`, `zh/minimal-pairs-practice/index.html`, `yue/minimal-pairs-practice/index.html`, `ar/minimal-pairs-practice/index.html`, `hi-ur/minimal-pairs-practice/index.html`, `fa/minimal-pairs-practice/index.html`, `id/minimal-pairs-practice/index.html`, `ko/minimal-pairs-practice/index.html`, `pt/minimal-pairs-practice/index.html`

- [ ] **Step 1: Add the Russian slugs to Vite’s static input list**

Update `vite.config.js` to include:

```js
  'id/english-ear-training',
  'id/minimal-pairs-practice',
  'ru/english-ear-training',
  'ru/minimal-pairs-practice',
]
```

- [ ] **Step 2: Add the Russian sitemap URLs with newest-rollout metadata**

Insert two new `<url>` blocks in `public/sitemap.xml` next to the recent localized hub entries:

```xml
  <url>
    <loc>https://getsoundwise.co/ru/english-ear-training/</loc>
    <lastmod>2026-06-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://getsoundwise.co/ru/minimal-pairs-practice/</loc>
    <lastmod>2026-06-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
```

- [ ] **Step 3: Add `ru` to every existing `english-ear-training` hreflang cluster**

In each existing `english-ear-training` page listed above, add:

```html
<link rel="alternate" hreflang="ru" href="https://getsoundwise.co/ru/english-ear-training/" />
```

Place it in the same locale order used by the most recent localized implementation, immediately before `x-default`.

- [ ] **Step 4: Add `ru` to every existing `minimal-pairs-practice` hreflang cluster**

In each existing `minimal-pairs-practice` page listed above, add:

```html
<link rel="alternate" hreflang="ru" href="https://getsoundwise.co/ru/minimal-pairs-practice/" />
```

Place it in the same locale order used by the most recent localized implementation, immediately before `x-default`.

- [ ] **Step 5: Verify bidirectional hreflang coverage in both page families**

Run:

```bash
rtk rg -n 'hreflang="ru"' \
  english-ear-training/index.html es/english-ear-training/index.html ja/english-ear-training/index.html zh/english-ear-training/index.html yue/english-ear-training/index.html ar/english-ear-training/index.html hi-ur/english-ear-training/index.html fa/english-ear-training/index.html id/english-ear-training/index.html ko/english-ear-training/index.html pt/english-ear-training/index.html ru/english-ear-training/index.html \
  minimal-pairs-practice/index.html es/minimal-pairs-practice/index.html ja/minimal-pairs-practice/index.html zh/minimal-pairs-practice/index.html yue/minimal-pairs-practice/index.html ar/minimal-pairs-practice/index.html hi-ur/minimal-pairs-practice/index.html fa/minimal-pairs-practice/index.html id/minimal-pairs-practice/index.html ko/minimal-pairs-practice/index.html pt/minimal-pairs-practice/index.html ru/minimal-pairs-practice/index.html
```

Expected: every file in both clusters contains exactly one `hreflang="ru"` line.

### Task 5: Validate Build Output, Structured Data, And Copy Preservation

**Files:**
- Verify: `ru/english-ear-training/index.html`, `ru/minimal-pairs-practice/index.html`, `dist/ru/english-ear-training/index.html`, `dist/ru/minimal-pairs-practice/index.html`

- [ ] **Step 1: Run repo validators that exist today**

Run:

```bash
rtk npm run validate:app-store-tracking
rtk npm run validate:localized-homepages
```

Expected: both commands either pass or produce raw output that can be reported directly.

- [ ] **Step 2: Run the production build**

Run:

```bash
rtk npm run build
```

Expected: Vite build succeeds and emits `dist/ru/english-ear-training/index.html` and `dist/ru/minimal-pairs-practice/index.html`.

- [ ] **Step 3: Verify built Russian outputs and sitemap entries**

Run:

```bash
rtk rg -n 'lang="ru"|https://getsoundwise.co/ru/english-ear-training/|https://getsoundwise.co/ru/minimal-pairs-practice/' \
  ru/english-ear-training/index.html \
  ru/minimal-pairs-practice/index.html \
  dist/ru/english-ear-training/index.html \
  dist/ru/minimal-pairs-practice/index.html \
  public/sitemap.xml
```

Expected: source files, build outputs, and sitemap all reference the final Russian URLs and language tag.

- [ ] **Step 4: Validate JSON-LD parsing for both Russian pages**

Run:

```bash
node --input-type=module <<'EOF'
import fs from 'node:fs';

for (const path of [
  'ru/english-ear-training/index.html',
  'ru/minimal-pairs-practice/index.html',
]) {
  const html = fs.readFileSync(path, 'utf8');
  const matches = [...html.matchAll(/<script type="application\\/ld\\+json">([\\s\\S]*?)<\\/script>/g)];
  const parsed = matches.map(([, json]) => JSON.parse(json));
  console.log(path, parsed.length);
}
EOF
```

Expected:

```text
ru/english-ear-training/index.html 3
ru/minimal-pairs-practice/index.html 3
```

- [ ] **Step 5: Check copy preservation against the provided Russian sources**

Run:

```bash
rtk rg -n 'Тренировка слуха по английскому: сначала услышь, потом говори|Минимальные пары в английском: как различить похожие звуки|Посмотреть все двадцать страниц практики|Связанный материал' \
  ru/english-ear-training/index.html \
  ru/minimal-pairs-practice/index.html
```

Expected: anchor phrases from both Russian source files appear in the final HTML, indicating the page copy was preserved rather than rewritten.

- [ ] **Step 6: Review the final diff without committing**

Run:

```bash
rtk git diff --stat
rtk git diff -- ru/english-ear-training/index.html ru/minimal-pairs-practice/index.html vite.config.js public/sitemap.xml
```

Expected: only the planned Russian pages, route registry, sitemap, and reciprocal hreflang edits are present.

- [ ] **Step 7: Stop at the diff review gate**

Do not commit, push, or open a PR. Present the diff summary and verification results to the user for approval before any further git action.
