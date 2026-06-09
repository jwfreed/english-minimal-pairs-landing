# Cantonese Hub Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two Cantonese / Hong Kong Traditional Chinese hub pages at `/yue/english-ear-training/` and `/yue/minimal-pairs-practice/` using the repo's existing static HTML conventions.

**Architecture:** Each page is a standalone `index.html` file in a subdirectory of `yue/`. Vite's explicit input list in `vite.config.js` controls the build. hreflang clusters across all 4 locale variants (en, ja, zh, yue) must be kept reciprocal.

**Tech Stack:** Static HTML, Vite, Inter font via Google Fonts, `/src/style.css` for styles, `/src/seo-page.js` for FAQ accordion JS.

---

## File Map

| Action | File |
|--------|------|
| Create | `yue/english-ear-training/index.html` |
| Create | `yue/minimal-pairs-practice/index.html` |
| Modify | `vite.config.js` (add 2 slug entries to seoPageSlugs) |
| Modify | `english-ear-training/index.html` (add yue hreflang) |
| Modify | `minimal-pairs-practice/index.html` (add yue hreflang) |
| Modify | `ja/english-ear-training/index.html` (add yue hreflang) |
| Modify | `ja/minimal-pairs-practice/index.html` (add yue hreflang) |
| Modify | `zh/english-ear-training/index.html` (add yue hreflang) |
| Modify | `zh/minimal-pairs-practice/index.html` (add yue hreflang) |
| Modify | `public/sitemap.xml` (add 2 URLs) |

---

## Task 1: Create yue/english-ear-training/index.html

**Files:**
- Create: `yue/english-ear-training/index.html`

Approved metadata:
- `html lang="zh-Hant-HK"`
- title: `英語辨音訓練｜聽清 right/light、ship/sheep 的發音分別`
- meta-description: `分唔清 right/light、ship/sheep、vest/west？為廣東話母語學習者介紹英語辨音訓練同最小對立對練習方法。`
- canonical: `https://getsoundwise.co/yue/english-ear-training/`
- H1: `英文辨音訓練：先聽清發音分別，再開口說`

hreflang cluster:
```html
<link rel="canonical" href="https://getsoundwise.co/yue/english-ear-training/" />
<link rel="alternate" hreflang="en" href="https://getsoundwise.co/english-ear-training/" />
<link rel="alternate" hreflang="ja" href="https://getsoundwise.co/ja/english-ear-training/" />
<link rel="alternate" hreflang="zh-Hans" href="https://getsoundwise.co/zh/english-ear-training/" />
<link rel="alternate" hreflang="yue-Hant-HK" href="https://getsoundwise.co/yue/english-ear-training/" />
<link rel="alternate" hreflang="x-default" href="https://getsoundwise.co/english-ear-training/" />
```

Nav CTA id: `nav-yue-english-ear-training-app-store-cta`
App Store UTM content: `yue-english-ear-training`
FAQ id prefix: `yue-ear-training-faq`

- [ ] Create `yue/english-ear-training/` directory and `index.html` file
- [ ] Apply all approved copy edits (英文詞, 反饋, 即時得到反饋, ear-training FAQ edit)
- [ ] Verify html lang="zh-Hant-HK", correct canonical and hreflang

---

## Task 2: Create yue/minimal-pairs-practice/index.html

**Files:**
- Create: `yue/minimal-pairs-practice/index.html`

Approved metadata:
- `html lang="zh-Hant-HK"`
- title: `英語最小對立對練習｜Minimal Pairs 英文辨音訓練`
- meta-description: `用英語最小對立對練習 right/light、ship/sheep、vest/west 等發音分別。適合廣東話母語學習者的英文辨音練習指南。`
- canonical: `https://getsoundwise.co/yue/minimal-pairs-practice/`
- H1: `用最小對立對練習英文辨音`

hreflang cluster:
```html
<link rel="canonical" href="https://getsoundwise.co/yue/minimal-pairs-practice/" />
<link rel="alternate" hreflang="en" href="https://getsoundwise.co/minimal-pairs-practice/" />
<link rel="alternate" hreflang="ja" href="https://getsoundwise.co/ja/minimal-pairs-practice/" />
<link rel="alternate" hreflang="zh-Hans" href="https://getsoundwise.co/zh/minimal-pairs-practice/" />
<link rel="alternate" hreflang="yue-Hant-HK" href="https://getsoundwise.co/yue/minimal-pairs-practice/" />
<link rel="alternate" hreflang="x-default" href="https://getsoundwise.co/minimal-pairs-practice/" />
```

Nav CTA id: `nav-yue-minimal-pairs-practice-app-store-cta`
App Store UTM content: `yue-minimal-pairs-practice`
FAQ id prefix: `yue-minimal-pairs-faq`

- [ ] Create `yue/minimal-pairs-practice/` directory and `index.html` file
- [ ] Apply all approved copy edits (英文詞, 反饋, 即時得到反饋, minimal-pairs FAQ edit)
- [ ] Verify html lang="zh-Hant-HK", correct canonical and hreflang

---

## Task 3: Update vite.config.js

**Files:**
- Modify: `vite.config.js:26-31`

Add to seoPageSlugs array (after existing `zh/minimal-pairs-practice`):
```js
'yue/english-ear-training',
'yue/minimal-pairs-practice',
```

- [ ] Add two slug entries
- [ ] Confirm no other vite.config.js changes needed

---

## Task 4: Add yue hreflang to existing English hub pages

**Files:**
- Modify: `english-ear-training/index.html:24`
- Modify: `minimal-pairs-practice/index.html:24`

Insert after existing zh-Hans alternate line:
```html
<link rel="alternate" hreflang="yue-Hant-HK" href="https://getsoundwise.co/yue/english-ear-training/" />
```
and
```html
<link rel="alternate" hreflang="yue-Hant-HK" href="https://getsoundwise.co/yue/minimal-pairs-practice/" />
```

- [ ] Update english-ear-training/index.html
- [ ] Update minimal-pairs-practice/index.html

---

## Task 5: Add yue hreflang to Japanese hub pages

**Files:**
- Modify: `ja/english-ear-training/index.html:24`
- Modify: `ja/minimal-pairs-practice/index.html:24`

Same inserts as Task 4 (after zh-Hans line in each file).

- [ ] Update ja/english-ear-training/index.html
- [ ] Update ja/minimal-pairs-practice/index.html

---

## Task 6: Add yue hreflang to Simplified Chinese hub pages

**Files:**
- Modify: `zh/english-ear-training/index.html:24`
- Modify: `zh/minimal-pairs-practice/index.html:24`

Same inserts as Task 4.

- [ ] Update zh/english-ear-training/index.html
- [ ] Update zh/minimal-pairs-practice/index.html

---

## Task 7: Update sitemap

**Files:**
- Modify: `public/sitemap.xml`

Add after the existing zh/ hub page entries (before ship-vs-sheep):
```xml
<url>
  <loc>https://getsoundwise.co/yue/english-ear-training/</loc>
  <lastmod>2026-06-09</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.9</priority>
</url>
<url>
  <loc>https://getsoundwise.co/yue/minimal-pairs-practice/</loc>
  <lastmod>2026-06-09</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.9</priority>
</url>
```

- [ ] Insert 2 new URL entries

---

## Task 8: Run build and verify

Run: `cd /Users/jonathanfreed/Documents/Development/english-minimal-pairs-landing && npm run build`
Expected: Exit 0, no errors.

- [ ] Run npm run build
- [ ] Confirm both yue pages appear in dist/
- [ ] Confirm no existing pages broken
