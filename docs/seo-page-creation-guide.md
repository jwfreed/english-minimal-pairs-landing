# SEO Page Creation Guide

## Purpose

This guide documents how to create learner-first SEO pages for English minimal-pair sound contrasts, such as `ship` vs `sheep`, `bit` vs `beat`, and `right` vs `light`.

The goal is to make pages that answer a learner's real listening problem clearly, then point them toward Soundwise for focused ear training. These pages should support the core positioning: train your ear first, focus on listening and perception before pronunciation production, and avoid hype.

## URL Conventions

Use HTTPS production URLs on `getsoundwise.co`.

Examples:

- `https://getsoundwise.co/ship-vs-sheep/`
- `https://getsoundwise.co/bit-vs-beat/`
- `https://getsoundwise.co/right-vs-light/`

Preferred slug pattern:

```text
/[word-a]-vs-[word-b]/
```

Keep slugs short and readable. Use `ship-vs-sheep`, not keyword-stuffed slugs such as `ship-vs-sheep-pronunciation-minimal-pair-english-listening-practice`. Short slugs are easier to remember, easier to link internally, and less spammy.

Use lowercase ASCII words, hyphens between words, and the order that matches the page title. If both word orders have search demand, still choose one canonical page and mention the reverse order naturally in body copy.

## Page Creation Workflow

This repository is a Vite static site with vanilla JavaScript. Current public pages are HTML files in the repo root, and `vite.config.js` lists each HTML entry under `build.rollupOptions.input`. GitHub Pages deploys the built `dist/` folder through `.github/workflows/deploy.yml`.

For a clean URL such as `https://getsoundwise.co/ship-vs-sheep/`, create a directory with an `index.html` file:

```text
ship-vs-sheep/index.html
```

Then add that HTML file to `vite.config.js`:

```js
input: {
  main: 'index.html',
  support: 'support.html',
  // ...
  'ship-vs-sheep': 'ship-vs-sheep/index.html',
}
```

Recommended workflow:

1. Create the page directory and route file, for example `ship-vs-sheep/index.html`.
2. Add page metadata in the HTML `<head>`.
3. Write learner-first content using the standard page structure below.
4. Add links to related minimal-pair pages only when those pages exist.
5. Add a Soundwise CTA that is helpful but not aggressive.
6. Add a UTM-tagged App Store link or another configured landing-page CTA link.
7. If the page should be indexed, add it to `public/sitemap.xml` with an HTTPS URL.
8. Add the new HTML entry to `vite.config.js`.
9. Run local checks: `npm run build`.
10. Preview if needed: `npm run preview`.
11. Deploy by pushing to `main`, which triggers the GitHub Pages workflow.
12. Verify the production URL loads over HTTPS.

Do not create the five initial SEO pages until the content brief for each page is ready. Do not add dependencies or new build infrastructure for these pages unless the site architecture changes.

## Standard Page Structure

Use this content pattern for each minimal-pair page:

1. H1
2. Quick answer
3. Sound difference
4. Why learners confuse the pair
5. How to hear the difference
6. Practice examples
7. Soundwise CTA
8. FAQ

Reusable outline:

```md
# Ship vs Sheep: How to Hear the Difference

## Quick Answer

`Ship` and `sheep` can sound similar because they differ mainly in the vowel sound. `Ship` uses the shorter /ɪ/ sound. `Sheep` uses the longer /iː/ sound.

## Sound Difference

Explain the two sounds in plain English. Include IPA only where it helps.

## Why Learners Confuse Them

Connect the contrast to common learner experience. Mention first-language influence only when accurate and relevant.

## How to Hear the Difference

Give practical listening cues. Focus on what to listen for before asking learners to pronounce the words.

## Practice Examples

Add short minimal-pair examples and simple sentence examples.

## Practice This Contrast in Soundwise

Use an approved CTA and a UTM-tagged link.

## FAQ

Answer 2-4 practical questions about the contrast.
```

## Metadata Guidelines

Every SEO page needs unique metadata.

Title tag pattern:

```text
[Word A] vs [Word B]: How to Hear the Difference
```

Example:

```text
Ship vs Sheep: How to Hear the Difference
```

Meta description pattern:

```text
Learn why [word a] and [word b] sound similar to English learners and how focused minimal-pair listening practice can help you hear the difference.
```

Example:

```text
Learn why ship and sheep sound similar to English learners and how focused minimal-pair listening practice can help you hear the difference.
```

Canonical URL expectation:

- If canonical tags are added to the site, use the HTTPS clean URL, for example `https://getsoundwise.co/ship-vs-sheep/`.
- This repository does not currently use canonical tags on the homepage, so do not claim canonical support exists until it is implemented.

Open Graph and Twitter card notes:

- The current homepage does not define Open Graph or Twitter card metadata.
- If social metadata is added later, keep titles and descriptions consistent with the SEO metadata.
- Use real product or page-relevant images if social images are added. Do not use unrelated stock imagery.

## Content Guidelines

Write for learners, not search engines.

- Answer the learner's pain directly in the first section.
- Use plain English.
- Include IPA only where useful, and explain it in everyday terms.
- Avoid jargon unless it is explained immediately.
- Make the page useful without requiring an app download.
- Focus on perception and listening before pronunciation.
- Use minimal-pair examples that a learner can understand quickly.
- Avoid unsupported claims about guaranteed results, clinical proof, fluency, or sounding native.
- Keep product mentions practical: Soundwise provides focused minimal-pair listening practice.

## CTA Guidelines

Approved CTA examples:

- `Practice this contrast in Soundwise.`
- `Train your ear with focused minimal-pair practice.`
- `Try focused listening practice in Soundwise.`

Banned CTA and messaging examples:

- `Fix your accent`
- `Sound native fast`
- `Clinically proven`
- `Guaranteed fluency`

The CTA should appear once near the middle or end of the page, and can be repeated in a final section if the page is long. Do not interrupt the quick answer with a sales pitch.

## UTM Convention

The current App Store URL used in `index.html` is:

```text
https://apps.apple.com/us/app/soundwise-english/id6753882308
```

For minimal-pair SEO pages, append UTM parameters:

```text
https://apps.apple.com/us/app/soundwise-english/id6753882308?utm_source=website&utm_medium=seo-page&utm_campaign=minimal-pair-pages&utm_content=ship-vs-sheep
```

Use this convention:

- `utm_source=website`
- `utm_medium=seo-page`
- `utm_campaign=minimal-pair-pages`
- `utm_content=[slug]`

The `utm_content` value should match the slug without leading or trailing slashes, for example `ship-vs-sheep`.

The site currently tracks App Store clicks with the `app_store_click` Google Analytics event in `src/main.js` for links containing `apps.apple.com`. Keep App Store CTA links on that domain if this click tracking should apply.

## Internal Linking

Internal links should help learners continue naturally.

Link to:

- Related minimal-pair pages, when they exist.
- Broader vowel or consonant category pages, when available.
- A minimal-pairs practice hub, when available.
- The homepage or app CTA.

Use placeholders in briefs until the pages exist:

```md
Related pages to add when available:
- /bit-vs-beat/
- /full-vs-fool/
- /minimal-pairs/
- /vowel-sounds/
```

Do not publish links to non-existent pages. Add links as pages go live, then verify them locally and in production.

## First Five Pages

Recommended first batch:

1. `ship-vs-sheep`
2. `bit-vs-beat`
3. `right-vs-light`
4. `three-vs-tree`
5. `full-vs-fool`

These cover common vowel and consonant contrasts and align with Soundwise's minimal-pair listening focus.

## QA Checklist

Before publishing a minimal-pair SEO page, check:

- [ ] URL matches the slug convention.
- [ ] Page has one clear H1.
- [ ] Metadata exists and is unique.
- [ ] Learner pain is answered in the first section.
- [ ] No forbidden claims or banned CTAs are used.
- [ ] CTA is present but not aggressive.
- [ ] UTM link is correct.
- [ ] `utm_content` matches the slug.
- [ ] Internal links work.
- [ ] Page is included in `vite.config.js`.
- [ ] Page is included in `public/sitemap.xml` if it should be indexed.
- [ ] Local build passes with `npm run build`.
- [ ] Production page loads over HTTPS.
- [ ] Page is ready for Google Search Console inspection.

## Example Page Brief

Brief for `/ship-vs-sheep/`:

- Target URL: `https://getsoundwise.co/ship-vs-sheep/`
- Target learner pain: Learners hear `ship` and `sheep` as the same word and are not sure what listening cue separates them.
- Primary keyword: `ship vs sheep`
- Secondary keywords: `ship sheep pronunciation`, `ship vs sheep sound`, `ship sheep minimal pair`, `i vs short i English`
- Suggested H1: `Ship vs Sheep: How to Hear the Difference`
- Suggested title: `Ship vs Sheep: How to Hear the Difference`
- Suggested description: `Learn why ship and sheep sound similar to English learners and how focused minimal-pair listening practice can help you hear the difference.`
- CTA: `Practice this contrast in Soundwise.`
- UTM content value: `ship-vs-sheep`

## Repo Notes

At the time this guide was added, the requested docs `docs/operations.md`, `docs/messaging-framework.md`, `docs/seo-keyword-map.md`, and `docs/analytics-and-attribution.md` were not present in this checkout. Repo-specific guidance above is based on:

- `README.md`
- `index.html`
- `src/main.js`
- `vite.config.js`
- `public/sitemap.xml`
- `CNAME`
- `.github/workflows/deploy.yml`
