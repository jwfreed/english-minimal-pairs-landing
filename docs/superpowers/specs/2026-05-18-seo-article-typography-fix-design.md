# Design: SEO Article Template Typography & Layout Fixes

**Date:** 2026-05-18  
**Status:** Approved  
**Approach:** Option A — Targeted fixes in `src/style.css`  
**Scope:** All minimal-pair SEO pages (15 pages sharing one CSS file)

---

## Problem

The SEO article template has several cross-browser readability issues, most visibly:

1. Firefox renders article text noticeably smaller and lighter than Chrome.
2. Related practice links have no explicit link styling — appearance depends on browser defaults.
3. The article content column is wider than the optimal reading width.
4. The CTA card has no spacing between its internal elements beyond the default `p + p` margin.
5. The H1 uses discrete breakpoints rather than fluid `clamp()` sizing.
6. The nav CTA can clip or behave unexpectedly at narrow widths.

**Root cause of Firefox difference:** The Inter font is loaded from Google Fonts in every SEO page's `<head>`, but the CSS `--font-sans` variable does not include `'Inter'`. The font stack is `-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`. Firefox falls back to system fonts (typically thinner and lighter than Inter), while Chrome may resolve `system-ui` to a locally-installed Inter copy on some machines. This explains the cross-browser inconsistency.

---

## File changed

**Single file:** `src/style.css`

No HTML changes. No new files. No new dependencies.

---

## Changes

### 1. Font stack — add Inter

```css
/* In :root */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
```

Inter is already loaded via Google Fonts on every SEO page. Adding it here makes the declaration effective in all browsers.

### 2. HTML root — add text-rendering and explicit font-size

```css
html {
  font-size: 16px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

`text-rendering: optimizeLegibility` improves kerning and ligatures across browsers. The explicit `font-size: 16px` ensures rem calculations are anchored even if a user stylesheet changes the root.

### 3. Article text color — darken from #374151 to #1f2937

```css
.seo-content p,
.seo-content li {
  color: #1f2937;
}
```

`#374151` (current `--text-body`) is medium-dark. `#1f2937` is the darkest text token in the design system and gives better contrast on white backgrounds, especially under Firefox's default font rendering.

### 4. Article content column — narrow from 820px to 700px

```css
.seo-content {
  max-width: 700px;
}
```

At 1024px+ grid layout:
```css
.seo-layout {
  grid-template-columns: 200px minmax(0, 700px);
}
```

Narrows the content column to the 650–720px reading-width target. The TOC column shrinks slightly from 220px to 200px — enough for the nav links.

### 5. Article link styling — make links recognizable in all browsers

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

The `.related-practice` links and any inline links currently rely on browser defaults. This makes them consistently styled and clearly clickable.

### 6. CTA card internal spacing

```css
.seo-cta-label {
  margin-bottom: 0.4rem;
}

.seo-cta h2 {
  margin-bottom: 1rem;
}

.seo-content .seo-cta p + p {
  margin-top: 0.85rem;
}

.seo-cta .btn {
  margin-top: 1.75rem;
}
```

Adds breathing room between the eyebrow label, heading, body paragraphs, and the CTA button. The dark background makes density more noticeable — more space helps.

### 7. H1 — switch to clamp() for fluid responsiveness

```css
.seo-hero h1 {
  font-size: clamp(2rem, 5vw, 3.5rem);
}
```

Replaces the three discrete breakpoint sizes (2rem / 2.65rem / 3.6rem) with a single fluid declaration. Stays readable at 320px and appropriately large at 1440px.

Remove or consolidate the now-redundant `@media (min-width: 720px) .seo-hero h1` and `@media (max-width: 520px) .seo-hero h1` overrides.

### 8. Nav CTA — prevent overflow at narrow widths

```css
.nav-cta {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: calc(100vw - 120px);
}

@media (max-width: 380px) {
  .nav-cta {
    font-size: 0.75rem;
    padding: 0.5rem 0.7rem;
  }
}
```

Prevents the CTA label from pushing the nav logo off-screen on very narrow viewports.

---

## What is not changed

- SEO page HTML files — no changes
- Page slugs, metadata, structured data
- Landing page styles (none of the modified selectors apply outside `.seo-*` or `:root`)
- Footer, testimonials, hero demo, problem section, or any other landing page component
- JavaScript (`src/seo-page.js`)

---

## Validation

After changes, run:

```bash
npm run build
```

Then manually verify:
- Chrome and Firefox: article body text visibly uses Inter, is dark and readable
- Mobile (320px): H1 does not overflow, nav CTA does not clip
- 1024px viewport: TOC is visible, article column is comfortably narrow
- Related practice links are clearly styled as links in both browsers
- CTA card has visible breathing room between elements
- No landing page visual regressions

---

## Success criteria

1. Firefox article text matches Chrome in weight and feel (Inter applied in both).
2. Body text color is #1f2937 — dark and clearly readable.
3. Article column is ≤700px wide.
4. Related links are unmistakably styled as links.
5. CTA card has improved internal spacing.
6. H1 is fluid and does not clip on mobile.
7. Nav CTA does not overflow on narrow widths.
8. `npm run build` passes.
9. No other pages visually regressed.
