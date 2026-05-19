# SEO Article Typography & Cross-Browser Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix cross-browser readability issues on all SEO article pages by correcting the font stack, darkening body text, narrowing the content column, adding link styles, improving CTA card spacing, and hardening the H1 and nav CTA against overflow.

**Architecture:** Single-file CSS change to `src/style.css`. No HTML changes, no new files, no new dependencies. All SEO article styles are scoped under `.seo-*` selectors or `:root` custom properties, so edits are low-risk to the landing page.

**Tech Stack:** Plain CSS, Vite (build), Inter via Google Fonts (already loaded in every SEO page `<head>`).

---

## File map

| File | Action | Why |
|------|--------|-----|
| `src/style.css:35` | Modify | Add `'Inter'` to `--font-sans` |
| `src/style.css:63–67` | Modify | Add `font-size: 16px` and `text-rendering` to `html {}` |
| `src/style.css:2130–2132` | Modify | Narrow `.seo-content` max-width from 820px to 700px |
| `src/style.css:2159–2164` | Modify | Darken `.seo-content p, li` color to `#1f2937` |
| `src/style.css:2164` | Insert after | Add `.seo-content a` link styles |
| `src/style.css:2306–2317` | Modify | Improve CTA card element spacing |
| `src/style.css:2103–2110` | Modify | Switch H1 to `clamp()` |
| `src/style.css:2342–2345` | Remove | Delete now-redundant 720px H1 override |
| `src/style.css:2401–2405` | Remove | Delete now-redundant 520px H1 override |
| `src/style.css:2352–2355` | Modify | Update 1024px grid to use 200px + 700px columns |
| `src/style.css:243–254` | Modify | Add overflow protection to `.nav-cta` |

---

## Task 1: Fix the font stack and HTML root (primary cross-browser fix)

**Files:**
- Modify: `src/style.css:35` (`:root` custom property)
- Modify: `src/style.css:63–67` (`html {}` block)

Inter is loaded from Google Fonts on every SEO page but is absent from the CSS font stack. Firefox falls back to system fonts, which look lighter and smaller. This is the root cause.

- [ ] **Step 1: Open `src/style.css` and update line 35 — add `'Inter'` to `--font-sans`**

  Find:
  ```css
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  ```

  Replace with:
  ```css
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  ```

- [ ] **Step 2: Update the `html {}` block (lines 63–67) — add `font-size` and `text-rendering`**

  Find:
  ```css
  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  ```

  Replace with:
  ```css
  html {
    font-size: 16px;
    scroll-behavior: smooth;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  ```

  `font-size: 16px` on `html` anchors rem calculations if a user stylesheet overrides the browser default. `text-rendering: optimizeLegibility` improves kerning cross-browser.

- [ ] **Step 3: Run the build to confirm no errors**

  ```bash
  npm run build
  ```

  Expected: build succeeds, no warnings about CSS.

- [ ] **Step 4: Commit**

  ```bash
  git add src/style.css
  git commit -m "fix: add Inter to font stack and harden html root typography"
  ```

---

## Task 2: Darken article body text and add explicit link styles

**Files:**
- Modify: `src/style.css:2159–2164` (`.seo-content p, .seo-content li`)
- Insert after line 2164: new `.seo-content a` rule

The current text color is `var(--text-body)` = `#374151`. Changing to `#1f2937` gives more contrast, especially with Firefox's default subpixel rendering. The `.related-practice` links and any inline article links have no `.seo-content a` rule — they fall back to browser defaults (blue/purple underline), which looks inconsistent between Chrome and Firefox.

- [ ] **Step 1: Update `.seo-content p, .seo-content li` color (line 2161)**

  Find:
  ```css
  .seo-content p,
  .seo-content li {
    color: var(--text-body);
    font-size: 1.075rem;
    line-height: 1.8;
  }
  ```

  Replace with:
  ```css
  .seo-content p,
  .seo-content li {
    color: #1f2937;
    font-size: 1.075rem;
    line-height: 1.8;
  }
  ```

- [ ] **Step 2: Insert a `.seo-content a` rule immediately after the block above**

  After the closing `}` of `.seo-content p, .seo-content li { ... }`, add:

  ```css
  .seo-content a {
    color: var(--primary-dark);
    text-decoration: underline;
    text-underline-offset: 3px;
    font-weight: 500;
  }

  .seo-content a:hover,
  .seo-content a:focus-visible {
    color: var(--primary);
  }
  ```

  `var(--primary-dark)` is `#D35400` (orange-brown) — on-brand, distinct from body text, and clearly clickable. Do not add this inside the `.seo-content p, li` block — it must be its own rule.

- [ ] **Step 3: Build and confirm**

  ```bash
  npm run build
  ```

  Expected: build succeeds.

- [ ] **Step 4: Commit**

  ```bash
  git add src/style.css
  git commit -m "fix: darken article body text and add link styles to seo-content"
  ```

---

## Task 3: Narrow the article content column

**Files:**
- Modify: `src/style.css:2130–2132` (`.seo-content`)
- Modify: `src/style.css:2352–2355` (`@media (min-width: 1024px)` `.seo-layout` grid columns)

The content column is currently 820px max-width, wider than the 650–720px optimal reading-width target. At 1024px viewport the grid is `220px + 820px`, which sums to 1040px plus the gap — the column is essentially at max.

- [ ] **Step 1: Update `.seo-content` max-width (line 2131)**

  Find:
  ```css
  .seo-content {
    max-width: 820px;
  }
  ```

  Replace with:
  ```css
  .seo-content {
    max-width: 700px;
  }
  ```

- [ ] **Step 2: Update the 1024px grid column definition (line 2354)**

  Find:
  ```css
  @media (min-width: 1024px) {
    .seo-layout {
      grid-template-columns: 220px minmax(0, 820px);
      align-items: start;
    }
  ```

  Replace with:
  ```css
  @media (min-width: 1024px) {
    .seo-layout {
      grid-template-columns: 200px minmax(0, 700px);
      align-items: start;
    }
  ```

  The TOC column drops from 220px to 200px — still ample for the short nav link text.

- [ ] **Step 3: Build and confirm**

  ```bash
  npm run build
  ```

  Expected: build succeeds.

- [ ] **Step 4: Commit**

  ```bash
  git add src/style.css
  git commit -m "fix: narrow seo-content column to 700px for better reading width"
  ```

---

## Task 4: Switch H1 to fluid `clamp()` sizing

**Files:**
- Modify: `src/style.css:2103–2110` (`.seo-hero h1`)
- Remove from: `src/style.css` — the `@media (min-width: 720px)` H1 override
- Remove from: `src/style.css` — the `@media (max-width: 520px)` H1 override

The H1 currently has three discrete sizes: 2.65rem (base), 3.6rem (720px+), 2rem (520px and below). `clamp(2rem, 5vw, 3.5rem)` replaces all three with a single smooth range — 2rem at 400px, scaling up to 3.5rem at 700px+, never exceeding 3.5rem.

- [ ] **Step 1: Update `.seo-hero h1` to use `clamp()` (lines 2103–2110)**

  Find:
  ```css
  .seo-hero h1 {
    max-width: 900px;
    color: var(--text-primary);
    font-size: 2.65rem;
    font-weight: 800;
    line-height: 1.06;
    margin-bottom: 1.4rem;
  }
  ```

  Replace with:
  ```css
  .seo-hero h1 {
    max-width: 900px;
    color: var(--text-primary);
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 1.4rem;
  }
  ```

  Line-height moves from 1.06 to 1.1 — slightly more open at large sizes.

- [ ] **Step 2: Remove the 720px H1 override**

  Find and delete this rule (inside the `@media (min-width: 720px)` block):
  ```css
  .seo-hero h1 {
    font-size: 3.6rem;
  }
  ```

  The `@media (min-width: 720px)` block also contains the `.comparison-grid` rule — keep that. Only delete the `.seo-hero h1` declaration inside it. If deleting the H1 rule leaves the media query empty, delete the media query wrapper too. If `.comparison-grid` is still present, leave the wrapper and just remove the H1 block.

- [ ] **Step 3: Remove the 520px H1 override**

  Find and delete this rule (inside the `@media (max-width: 520px)` block):
  ```css
  .seo-hero h1 {
    font-size: 2rem;
    line-height: 1.12;
    margin-bottom: 1rem;
  }
  ```

  The 520px block contains other rules (nav height, hero padding, lede size, layout padding, h2 size, content p/li size, cta padding) — keep all of those. Only delete the H1 block.

- [ ] **Step 4: Build and confirm**

  ```bash
  npm run build
  ```

  Expected: build succeeds.

- [ ] **Step 5: Commit**

  ```bash
  git add src/style.css
  git commit -m "fix: switch seo-hero h1 to clamp() for fluid responsive sizing"
  ```

---

## Task 5: Improve CTA card internal spacing

**Files:**
- Modify: `src/style.css:2306–2317` (`.seo-cta-label` and `.seo-cta .btn`)
- Insert: new `.seo-content .seo-cta h2` rule with bottom margin

The dark CTA card has an eyebrow label, an H2, two paragraphs, and a button. The current spacing between label and heading is 0.5rem; there is no bottom margin on the H2; paragraph spacing uses the inherited `p + p` rule (1rem). The button is pushed down 1.5rem.

- [ ] **Step 1: Update `.seo-cta-label` bottom margin (line 2310) and add an explicit H2 margin rule**

  Find:
  ```css
  .seo-cta-label {
    font-size: 0.85rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
  }

  .seo-cta .btn {
    margin-top: 1.5rem;
    white-space: normal;
  }
  ```

  Replace with:
  ```css
  .seo-cta-label {
    font-size: 0.85rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    margin-bottom: 0.35rem;
    text-transform: uppercase;
  }

  .seo-content .seo-cta h2 {
    margin-bottom: 1rem;
  }

  .seo-content .seo-cta p + p {
    margin-top: 0.75rem;
  }

  .seo-cta .btn {
    margin-top: 1.85rem;
    white-space: normal;
  }
  ```

  This tightens the eyebrow–heading gap (0.5→0.35rem), creates explicit spacing below the heading (1rem), adds breathing room between paragraphs inside the dark card (0.75rem), and increases the button top margin (1.5→1.85rem).

- [ ] **Step 2: Build and confirm**

  ```bash
  npm run build
  ```

  Expected: build succeeds.

- [ ] **Step 3: Commit**

  ```bash
  git add src/style.css
  git commit -m "fix: improve internal spacing of seo-cta card"
  ```

---

## Task 6: Harden the nav CTA against overflow on narrow viewports

**Files:**
- Modify: `src/style.css:243–254` (`.nav-cta` base rule)

At very narrow widths (320–380px) the nav CTA text can clip or push the logo off-screen. Adding `overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: calc(100vw - 100px)` to the base `.nav-cta` rule ensures it degrades gracefully at any width. The `100px` accounts for the logo icon (36px) + container padding (48px) + a small gap.

- [ ] **Step 1: Add overflow protection to the `.nav-cta` base rule (lines 243–254)**

  Find:
  ```css
  .nav-cta {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: white;
    padding: 0.625rem 1.5rem;
    border-radius: var(--radius-full);
    font-weight: 600;
    font-size: 0.875rem;
    text-decoration: none;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(230, 126, 34, 0.25);
    border: none;
  }
  ```

  Replace with:
  ```css
  .nav-cta {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: white;
    padding: 0.625rem 1.5rem;
    border-radius: var(--radius-full);
    font-weight: 600;
    font-size: 0.875rem;
    text-decoration: none;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(230, 126, 34, 0.25);
    border: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: calc(100vw - 100px);
  }
  ```

- [ ] **Step 2: Build and confirm**

  ```bash
  npm run build
  ```

  Expected: build succeeds.

- [ ] **Step 3: Commit**

  ```bash
  git add src/style.css
  git commit -m "fix: prevent nav CTA overflow on narrow viewports"
  ```

---

## Task 7: Final build and visual verification

- [ ] **Step 1: Run a clean build**

  ```bash
  npm run build
  ```

  Expected output: `dist/` generated, no errors, no CSS warnings.

- [ ] **Step 2: Start the preview server**

  ```bash
  npm run preview
  ```

  The preview server will print a local URL (typically `http://localhost:4173`).

- [ ] **Step 3: Open `/cup-vs-cop/` in Chrome**

  Check each item:
  - [ ] Article body text uses Inter (distinct from system fonts — slightly rounded, consistent weight)
  - [ ] Body text reads as dark (#1f2937), not medium-gray
  - [ ] Article column visibly narrower than before — comfortable reading width, not edge-to-edge
  - [ ] H1 scales fluidly — not too large, not clipped
  - [ ] Related practice links (`Cap vs Cup`) are orange-brown, underlined, clearly clickable
  - [ ] CTA card has visible breathing room between eyebrow, heading, paragraphs, and button
  - [ ] Nav CTA is fully visible and readable

- [ ] **Step 4: Open `/cup-vs-cop/` in Firefox**

  Check same list. Inter should now appear in Firefox — the text weight and character spacing should match Chrome closely.

- [ ] **Step 5: Resize to 375px width (mobile) in both browsers**

  - [ ] H1 is readable — approximately 2rem at 375px
  - [ ] Nav CTA does not clip or push the logo off-screen
  - [ ] Article body paragraphs are readable at full width (no horizontal scroll)
  - [ ] TOC is hidden (correct — only appears at 1024px+)

- [ ] **Step 6: Resize to 1100px width (tablet/narrow desktop)**

  - [ ] TOC appears in the left rail (1024px+ breakpoint is met)
  - [ ] Article column is noticeably narrower than the full container — comfortable reading column
  - [ ] No horizontal overflow

- [ ] **Step 7: Check a second SEO page — open `/rice-vs-lice/` or `/three-vs-tree/` in both browsers**

  Confirm the same improvements apply consistently (same template, same CSS).

- [ ] **Step 8: Spot-check the landing page (`/`) in both browsers**

  The landing page does not use `.seo-*` classes, so none of these changes should affect it. Confirm:
  - [ ] Hero section looks unchanged
  - [ ] Nav looks unchanged
  - [ ] No font or layout regressions

- [ ] **Step 9: If everything looks correct, commit a final summary commit**

  ```bash
  git add src/style.css
  git commit -m "fix: SEO article typography and cross-browser readability improvements"
  ```

  If there are no uncommitted changes at this point (all tasks were committed individually), skip this step.
