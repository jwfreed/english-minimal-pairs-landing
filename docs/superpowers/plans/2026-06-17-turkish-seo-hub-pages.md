# Turkish SEO Hub Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Turkish `english-ear-training` and `minimal-pairs-practice` static hub pages, wire them into Vite and the sitemap, and update reciprocal hreflang clusters without changing the existing page system.

**Architecture:** Clone the newest localized shell in each hub-page family, replace only Turkish locale-specific content and metadata, then make the smallest registry updates in `vite.config.js`, `public/sitemap.xml`, and the two existing hreflang page families. Verification is command-driven because this is a checked-in static HTML/content change rather than a unit-tested application feature.

**Tech Stack:** Vite multi-page static site, hand-authored HTML, JSON-LD, XML sitemap, repo validation scripts, `rtk` shell wrapper.

---

## File Map

**Create**

- `tr/english-ear-training/index.html`: Turkish ear-training hub page with Turkish metadata, prose, JSON-LD, CTA tracking, localized internal cross-link, and the full localized hreflang cluster plus `tr`.
- `tr/minimal-pairs-practice/index.html`: Turkish minimal-pairs hub page with Turkish metadata, prose, JSON-LD, CTA tracking, related-guide section, and the full localized hreflang cluster plus `tr`.

**Modify**

- `vite.config.js`: add `tr/english-ear-training` and `tr/minimal-pairs-practice` to `seoPageSlugs`.
- `public/sitemap.xml`: add the two Turkish canonical URLs with the current addition date.
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
- `th/english-ear-training/index.html`
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
- `th/minimal-pairs-practice/index.html`

**Reference Inputs**

- `th/english-ear-training/index.html`
- `th/minimal-pairs-practice/index.html`
- `/Users/jonathanfreed/Downloads/tr-english-ear-training.md`
- `/Users/jonathanfreed/Downloads/tr-minimal-pairs-practice.md`

### Task 1: Set Up An Isolated Workspace And Baseline

**Files:**
- Modify: none
- Reference: `.gitignore`, `package.json`

- [ ] **Step 1: Detect current git isolation state**

Run:

```bash
rtk proxy sh -lc 'GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P); GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P); BRANCH=$(git branch --show-current); printf "GIT_DIR=%s\nGIT_COMMON=%s\nBRANCH=%s\n" "$GIT_DIR" "$GIT_COMMON" "$BRANCH"'
```

Expected: `BRANCH=main` and `GIT_DIR == GIT_COMMON`, confirming this is the primary checkout and implementation must not proceed here.

- [ ] **Step 2: Prepare a project-local worktree directory if needed**

Run:

```bash
rtk proxy sh -lc 'if [ -d .worktrees ]; then echo ".worktrees exists"; elif [ -d worktrees ]; then echo "worktrees exists"; else echo "none"; fi'
rtk proxy git check-ignore -q .worktrees || printf ".worktrees-not-ignored\n"
```

Expected: either `.worktrees` already exists and is ignored, or the second command prints `.worktrees-not-ignored`, signaling that `.gitignore` needs a single-line `.worktrees/` entry before worktree creation.

- [ ] **Step 3: Create and enter the implementation worktree**

Run:

```bash
rtk proxy sh -lc 'mkdir -p .worktrees && git worktree add .worktrees/tr-seo-hub-pages -b tr-seo-hub-pages'
```

Expected: a new linked worktree at `.worktrees/tr-seo-hub-pages` on branch `tr-seo-hub-pages`.

- [ ] **Step 4: Verify the baseline build state inside the worktree**

Run:

```bash
rtk npm run build
rtk npm run validate:app-store-tracking
rtk npm run validate:localized-homepages
```

Expected: commands complete successfully before Turkish implementation starts. If a baseline failure appears, stop and report it before proceeding.

### Task 2: Create `tr/english-ear-training/index.html`

**Files:**
- Create: `tr/english-ear-training/index.html`
- Reference: `th/english-ear-training/index.html`, `/Users/jonathanfreed/Downloads/tr-english-ear-training.md`

- [ ] **Step 1: Clone the Thai shell as the starting file**

Run:

```bash
rtk proxy sh -lc 'mkdir -p tr/english-ear-training && cp th/english-ear-training/index.html tr/english-ear-training/index.html'
```

Expected: the Turkish file exists with the latest localized page structure before content replacement.

- [ ] **Step 2: Replace locale-specific metadata, JSON-LD, and visible copy with Turkish content**

The resulting page must include these Turkish metadata anchors:

```html
<html lang="tr">
<meta name="description" content="ship ve sheep kulağa aynı mı geliyor? Türkçe konuşanlar için İngilizce sesleri ayırt etmeye yönelik net, pratik kulak eğitimi rehberi." />
<link rel="canonical" href="https://getsoundwise.co/tr/english-ear-training/" />
<meta property="og:title" content="İngilizce Dinleme Kulağı | Önce sesi ayır, sonra daha net konuş" />
<meta property="og:url" content="https://getsoundwise.co/tr/english-ear-training/" />
<meta name="twitter:title" content="İngilizce Dinleme Kulağı | Önce sesi ayır, sonra daha net konuş" />
<title>İngilizce Dinleme Kulağı | Önce sesi ayır, sonra daha net konuş</title>
```

The hero and TOC must map to:

```html
<p class="seo-kicker">Önce sesi ayır, sonra daha net konuş</p>
<h1>İngilizce Dinleme Kulağı: Önce sesi ayır, sonra daha net konuş</h1>
<aside class="seo-toc" aria-label="Page sections">
  <p>Bu sayfada</p>
  <a href="#why-listening-first">Neden önce dinleme?</a>
  <a href="#what-ear-training-means">Kulak eğitimi nedir?</a>
  <a href="#common-contrasts">Türkçe konuşanların sık karıştırdığı sesler</a>
  <a href="#how-to-practice">Nasıl çalışılır?</a>
  <a href="#minimal-pairs-guide">Minimal pairs ile çalışma</a>
  <a href="#soundwise">Soundwise hakkında</a>
  <a href="#faq">Sık sorulan sorular</a>
</aside>
```

- [ ] **Step 3: Preserve the Turkish cross-link and final-consonants prose rules**

The `#minimal-pairs-guide` section must remain before `#soundwise`, with a localized internal link:

```html
<section id="minimal-pairs-guide" aria-labelledby="minimal-pairs-guide-title">
  <h2 id="minimal-pairs-guide-title">Minimal pairs ile çalışma</h2>
  <p>Bu yöntemi ayrı olarak görmek isterseniz, <a href="/tr/minimal-pairs-practice/">minimal pairs alıştırmaları rehberine</a> bakabilirsiniz.</p>
</section>
```

The final-consonants subsection in `#common-contrasts` must stay as prose-only discussion. Do not add links for removed pairs such as `cap-vs-cab`.

- [ ] **Step 4: Use the Turkish App Store tracking pattern from the supplied copy**

The nav and primary CTA must both use the Turkish tracking pattern:

```html
href="https://apps.apple.com/us/app/soundwise-english/id6753882308?utm_source=website&utm_medium=seo-page&utm_campaign=seo-hub-pages&utm_content=tr-english-ear-training"
id="nav-tr-english-ear-training-app-store-cta"
```

- [ ] **Step 5: Verify required Turkish markers in the file**

Run:

```bash
rtk rg -n 'lang="tr"|tr/english-ear-training|nav-tr-english-ear-training-app-store-cta|utm_content=tr-english-ear-training|/tr/minimal-pairs-practice/|hit-vs-heat|think-vs-tink|pan-vs-pen|vine-vs-wine|cap-vs-cab' tr/english-ear-training/index.html
```

Expected: the Turkish file contains the `tr` metadata and internal link markers, and the dead-link patterns do not appear.

### Task 3: Create `tr/minimal-pairs-practice/index.html`

**Files:**
- Create: `tr/minimal-pairs-practice/index.html`
- Reference: `th/minimal-pairs-practice/index.html`, `/Users/jonathanfreed/Downloads/tr-minimal-pairs-practice.md`

- [ ] **Step 1: Clone the Thai shell as the starting file**

Run:

```bash
rtk proxy sh -lc 'mkdir -p tr/minimal-pairs-practice && cp th/minimal-pairs-practice/index.html tr/minimal-pairs-practice/index.html'
```

Expected: the Turkish minimal-pairs file exists with the latest localized shell before content replacement.

- [ ] **Step 2: Replace metadata, JSON-LD, and visible copy with Turkish content**

The resulting page must include:

```html
<html lang="tr">
<meta name="description" content="ship/sheep, thin/tin, vest/west ve bad/bed gibi İngilizce minimal pairs alıştırmalarıyla Türkçe konuşanlar için benzer sesleri ayırt etme rehberi." />
<link rel="canonical" href="https://getsoundwise.co/tr/minimal-pairs-practice/" />
<meta property="og:title" content="İngilizce Minimal Pairs | Benzer sesleri ayırt etme alıştırmaları" />
<meta property="og:url" content="https://getsoundwise.co/tr/minimal-pairs-practice/" />
<title>İngilizce Minimal Pairs | Benzer sesleri ayırt etme alıştırmaları</title>
```

The hero and TOC must map to:

```html
<p class="seo-kicker">Benzer sesleri ayırt etme alıştırmaları</p>
<h1>İngilizce Minimal Pairs: Benzer sesleri ayırt etme alıştırmaları</h1>
<aside class="seo-toc" aria-label="Page sections">
  <p>Bu sayfada</p>
  <a href="#what-are-minimal-pairs">Minimal pairs nedir?</a>
  <a href="#why-they-help">Neden işe yarar?</a>
  <a href="#how-to-practice">Nasıl çalışılır?</a>
  <a href="#start-here">Hangi seslerden başlamalı?</a>
  <a href="#soundwise">Soundwise hakkında</a>
  <a href="#faq">Sık sorulan sorular</a>
</aside>
```

- [ ] **Step 3: Preserve the current related-guide convention**

The `#related-guide` section must remain after `#soundwise` and before `#faq`, but stay out of the TOC:

```html
<section id="related-guide" aria-labelledby="related-guide-title">
  <h2 id="related-guide-title">İlgili rehber</h2>
  <p>Bu alıştırmaların arkasındaki “önce dinle, sonra konuş” yaklaşımını görmek için <a href="/tr/english-ear-training/">İngilizce Dinleme Kulağı: Önce sesi ayır, sonra daha net konuş</a> rehberini okuyabilirsiniz.</p>
</section>
```

- [ ] **Step 4: Use the Turkish minimal-pairs App Store tracking pattern**

The nav and primary CTA must both use:

```html
href="https://apps.apple.com/us/app/soundwise-english/id6753882308?utm_source=website&utm_medium=seo-page&utm_campaign=seo-hub-pages&utm_content=tr-minimal-pairs-practice"
id="nav-tr-minimal-pairs-practice-app-store-cta"
```

- [ ] **Step 5: Verify required Turkish markers in the file**

Run:

```bash
rtk rg -n 'lang="tr"|tr/minimal-pairs-practice|nav-tr-minimal-pairs-practice-app-store-cta|utm_content=tr-minimal-pairs-practice|/tr/english-ear-training/|hit-vs-heat|think-vs-tink|pan-vs-pen|vine-vs-wine|cap-vs-cab' tr/minimal-pairs-practice/index.html
```

Expected: the Turkish file contains the `tr` metadata and internal link markers, and the dead-link patterns do not appear.

### Task 4: Register Turkish Routes, Sitemap Entries, And Reciprocal Hreflang Links

**Files:**
- Modify: `vite.config.js`, `public/sitemap.xml`, the 26 existing hub-page family files listed above

- [ ] **Step 1: Add the two Turkish Vite slugs**

Add these exact entries to `seoPageSlugs`:

```js
'tr/english-ear-training',
'tr/minimal-pairs-practice',
```

- [ ] **Step 2: Add the two Turkish sitemap entries**

Add:

```xml
<url>
  <loc>https://getsoundwise.co/tr/english-ear-training/</loc>
  <lastmod>2026-06-17</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.9</priority>
</url>
<url>
  <loc>https://getsoundwise.co/tr/minimal-pairs-practice/</loc>
  <lastmod>2026-06-17</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.9</priority>
</url>
```

- [ ] **Step 3: Add reciprocal Turkish hreflang alternates without broader cleanup**

Insert these exact lines into every existing file in the two hub-page families, immediately before each file’s `x-default` alternate so the existing locale order stays intact:

```html
<link rel="alternate" hreflang="tr" href="https://getsoundwise.co/tr/english-ear-training/" />
<link rel="alternate" hreflang="tr" href="https://getsoundwise.co/tr/minimal-pairs-practice/" />
```

Do not add missing `pt` or `ko` alternates to older files that still omit them. This task is `tr`-only.

- [ ] **Step 4: Verify Turkish registration across all integration points**

Run:

```bash
rtk rg -n 'tr/english-ear-training|tr/minimal-pairs-practice|hreflang="tr"' \
  vite.config.js \
  public/sitemap.xml \
  english-ear-training/index.html \
  minimal-pairs-practice/index.html \
  es ja zh yue ar hi-ur fa id ko pt ru th tr
```

Expected: both Turkish routes appear in Vite, sitemap, the two new files, and every existing hreflang family file.

### Task 5: Validate, Parse, And Review

**Files:**
- Modify: none unless verification reveals a focused fix

- [ ] **Step 1: Check for whitespace and patch hygiene issues**

Run:

```bash
rtk proxy git diff --check
```

Expected: no whitespace, merge-marker, or patch formatting errors.

- [ ] **Step 2: Run the repo validators and production build**

Run:

```bash
rtk npm run validate:app-store-tracking
rtk npm run validate:localized-homepages
rtk npm run build
```

Expected: all three commands exit successfully.

- [ ] **Step 3: Parse JSON-LD and confirm no dead links are present**

Run:

```bash
rtk proxy node - <<'NODE'
const fs = require('fs');
for (const file of ['tr/english-ear-training/index.html', 'tr/minimal-pairs-practice/index.html']) {
  const html = fs.readFileSync(file, 'utf8');
  const scripts = [...html.matchAll(/<script type="application\\/ld\\+json">([\\s\\S]*?)<\\/script>/g)];
  console.log(file, scripts.length);
  scripts.forEach((m, i) => JSON.parse(m[1]));
}
NODE
rtk rg -n 'hit-vs-heat|think-vs-tink|pan-vs-pen|vine-vs-wine|cap-vs-cab' tr/english-ear-training/index.html tr/minimal-pairs-practice/index.html
```

Expected: each Turkish page reports `3` JSON-LD blocks with no parse errors, and the dead-link grep returns no matches.

- [ ] **Step 4: Inspect the final diff**

Run:

```bash
rtk proxy git diff --stat
rtk proxy git diff -- tr/english-ear-training/index.html tr/minimal-pairs-practice/index.html vite.config.js public/sitemap.xml english-ear-training/index.html minimal-pairs-practice/index.html es ja zh yue ar hi-ur fa id ko pt ru th
```

Expected: changes are limited to the two new Turkish pages, the route registry, the sitemap, and reciprocal `tr` hreflang updates in the two hub-page families.
