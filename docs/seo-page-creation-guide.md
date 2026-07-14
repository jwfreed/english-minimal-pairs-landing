# SEO Page Creation Guide

## Purpose

This guide documents how to create learner-first SEO pages for English minimal-pair sound contrasts, such as `ship` vs `sheep`, `bit` vs `beat`, and `right` vs `light`.

The goal is to make pages that answer a learner's real listening problem clearly, then point them toward Soundwise for focused ear training. These pages should support the core positioning: train your ear first, focus on listening and perception before pronunciation production, and avoid hype.

## Related Docs

Use these docs as canonical references before writing or publishing SEO pages:

- `docs/messaging-framework.md` for positioning, approved terminology, CTAs, and claim boundaries.
- `docs/seo-keyword-map.md` for keyword clusters, search intent, and page priority.
- `docs/analytics-and-attribution.md` for UTM naming conventions and attribution limits.
- `docs/response-template-library.md` for learner-first explanations of common sound-confusion topics.
- `docs/operations.md` for public URLs, hosting, and lightweight operational constraints.

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

This repository is a Vite static site with vanilla JavaScript. Root utility pages are HTML files in the repo root, clean-URL SEO source pages live under `content/pairs/` or `content/locales/`, and `vite.config.js` lists each HTML entry under `build.rollupOptions.input`. GitHub Pages deploys the built `dist/` folder through `.github/workflows/deploy.yml`.

For an English clean URL such as `https://getsoundwise.co/ship-vs-sheep/`, create a source directory with an `index.html` file:

```text
content/pairs/ship-vs-sheep/index.html
```

Then add that slug to `seoPageSlugs` in `vite.config.js`:

```js
const seoPageSlugs = [
  'ship-vs-sheep',
]
```

The Vite config derives the HTML input path from the slug, so `ship-vs-sheep` maps to `content/pairs/ship-vs-sheep/index.html` and emits `dist/ship-vs-sheep/index.html`. A localized slug such as `ja/ship-vs-sheep` maps to `content/locales/ja/ship-vs-sheep/index.html` and emits `dist/ja/ship-vs-sheep/index.html`.

Recommended workflow:

1. Create the page source directory and route file, for example `content/pairs/ship-vs-sheep/index.html`.
2. Add page metadata in the HTML `<head>`.
3. Write learner-first content using the standard page structure below.
4. Add links to related minimal-pair pages only when those pages exist.
5. Add a Soundwise CTA that is helpful but not aggressive.
6. Add a UTM-tagged App Store link or another configured landing-page CTA link.
7. Add structured data that matches visible page content.
8. If the page should be indexed, add it to `public/sitemap.xml` with an HTTPS URL.
9. Add the new slug to `seoPageSlugs` in `vite.config.js`.
10. Run local checks: `npm run build`.
11. Preview if needed: `npm run preview`.
12. Deploy by pushing to `main`, which triggers the GitHub Pages workflow.
13. Verify the production URL loads over HTTPS.

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
9. Structured data

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

Include at least these two questions in visible page copy:

- `Why does this happen?`
- `How do I practice?`

## Structured Data

Add `FAQPage` JSON-LD that matches the visible FAQ.
```

## Structured Data

Add lightweight JSON-LD that helps search engines and AI systems interpret the page structure. Structured data must describe content that is visible on the page. Do not use schema to add claims, ratings, reviews, products, offers, or guarantees that are not present in the page content.

Minimum requirement:

- Add `FAQPage` schema for the visible FAQ content.
- Include at least `Why does this happen?` and `How do I practice?` in both the visible FAQ and the JSON-LD.
- Keep schema answers short, accurate, and consistent with the visible page copy.
- Reuse the same pattern across minimal-pair pages by swapping the pair name, sound explanation, and practice instructions.

Optional:

- Add `HowTo` schema only when the page includes explicit, visible, step-by-step practice instructions.
- Do not add `HowTo` schema for general advice, broad learning tips, or a short practice paragraph without clear steps.

Structured data supports clearer machine interpretation of the page. Do not describe it as guaranteeing rankings, traffic, rich results, or inclusion in AI-generated answers.

Reusable `FAQPage` example for `ship` vs `sheep`:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why does this happen?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Learners often confuse ship and sheep because the vowel sounds are close but not the same. Ship uses the short /ɪ/ sound, while sheep uses the long /iː/ sound. The difference can be difficult to hear and pronounce if a learner's first language does not separate these sounds."
      }
    },
    {
      "@type": "Question",
      "name": "How do I practice?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Practice ship and sheep by listening to the two words, repeating them slowly, and focusing on vowel length. Say ship with a shorter, more relaxed vowel, then say sheep with a longer, tenser vowel. Use short example sentences to practice hearing and speaking the contrast in context."
      }
    }
  ]
}
```

Place the JSON-LD in the page's HTML inside a `<script type="application/ld+json">` tag.

## Metadata Guidelines

Every SEO page needs unique metadata.

Title tag pattern:

```text
[Word A] vs [Word B] Pronunciation: /a/ vs /b/ Practice
```

Example:

```text
Ship vs Sheep Pronunciation: /ɪ/ vs /iː/ Practice
```

The word pair leads (it is the query head term), "Pronunciation" matches the primary
query modifier in `docs/seo-keyword-map.md`, and the IPA contrast tells the learner
exactly which sound distinction the page trains. Pages append ` | Soundwise`; keep the
pre-brand portion at or under roughly 50 characters so the brand survives truncation.

Meta description pattern:

```text
Can’t hear the difference between “[word a]” and “[word b]”? Compare /a/ and /b/, [one short pair-specific clause], and practice with English minimal pairs.
```

Example:

```text
Can’t hear the difference between “ship” and “sheep”? Compare /ɪ/ and /iː/, hear the short-vs-long vowel contrast, and practice with English minimal pairs.
```

Write a different middle clause for every pair (what specifically changes in the sound,
or what the contrast means, e.g. singular/plural for man/men) so no two descriptions
read as duplicates. Keep the full description at or under roughly 155 characters.
Keep `<title>`, `og:title`, `twitter:title`, and the LearningResource `name` in sync;
`og:description`/`twitter:description` may carry distinct social copy.

Canonical URL expectation:

- Every indexable page uses one self-referencing canonical with the HTTPS production URL,
  for example `https://getsoundwise.co/ship-vs-sheep/`.
- Localized alternatives remain self-canonical; do not canonicalize them to English.
- Use `HREFLANG_BY_LOCALE` in `src/localized-homepage-routes.js` for language tags. Route
  slugs such as `hi-ur` and `yue` are not themselves valid Google hreflang values.
- Omit `x-default` from hubs and pair pages. It is reserved for the homepage cluster,
  where `/` provides a real language-selection fallback.

Open Graph and Twitter card notes:

- The current homepage does not define Open Graph or Twitter card metadata.
- If social metadata is added later, keep titles and descriptions consistent with the SEO metadata.
- Use real product or page-relevant images if social images are added. Do not use unrelated stock imagery.

### Hub title policy

Localized hub titles (`/{locale}/english-ear-training/`, `/{locale}/minimal-pairs-practice/`)
stay **keyword + benefit focused** and do **not** append the `| Soundwise` brand suffix by
default. The English hubs keep their existing branded titles; do not retrofit the pattern
in either direction.

Rationale: several localized hub titles already run 47–73 characters, so the 12-character
suffix would push them past display width and truncate the benefit segment — the part
carrying the problem-led promise — while there is no Search Console evidence yet of
branded "Soundwise" queries in any locale.

A brand suffix may be added to a specific localized hub only when all three hold:

1. Search Console shows branded query evidence for that locale.
2. The full title stays comfortably within display width (roughly 55–60 Latin characters;
   CJK glyphs render about double width, so budget accordingly).
3. Localization review approves the resulting title as natural L1 copy.

`npm run validate:seo-architecture` enforces the default: a localized hub title ending in
`| Soundwise` fails the build until this policy's conditions are documented as met.

### Localized homepage SEO metadata

Localized homepage `<title>`/descriptions are generated by
`scripts/generate-localized-homepages.mjs` via `getLocalizedSeoMetadata()` in
`src/localized-homepage-seo.js` (the validator `scripts/validate-localized-homepages.mjs`
uses the same helper, so the two cannot drift):

- By default the title is `heroTitle | Soundwise` and the description is `heroSubtitle` —
  the historical hero-coupled behavior.
- A locale's copy may define optional `seoTitle` and/or `seoDescription` fields (in that
  locale's entry in `src/landing-supplement-translations.js`, merged through
  `buildLandingTranslations`). When present and non-blank they are used **verbatim**
  (no suffix is appended to `seoTitle`); when absent the hero fallback applies, keeping
  unpopulated locales byte-identical to the pre-field output.
- Never define `seoTitle`/`seoDescription` for `en`: other locales without supplemental
  entries fall back to the `en` supplemental object, and the root homepage is
  hand-authored in `index.html`, not generated.
- Do not populate these fields speculatively. Per
  `docs/seo-product-intent-framework.md`, localized homepage SEO titles are written only
  after the first Search Console baseline exists, per locale, as reviewed native-quality
  strings following the L1 style directions in
  `docs/phase-1-localized-flagship-seo-implementation-plan.md`.

## Content Guidelines

Write for learners, not search engines. Follow `docs/messaging-framework.md` for claim boundaries and terminology.

- Answer the learner's pain directly in the first section.
- Use plain English.
- Include IPA only where useful, and explain it in everyday terms.
- Avoid jargon unless it is explained immediately.
- Make the page useful without requiring an app download.
- Focus on perception and listening before pronunciation.
- Use minimal-pair examples that a learner can understand quickly.
- Avoid unsupported claims about guaranteed results, clinical proof, scientific validation of Soundwise specifically, fluency, fixed-time results, accent elimination, or sounding native.
- Keep product mentions practical: Soundwise provides focused minimal-pair listening practice.

## Writer-Inspired SEO Article Modes

Use these as functional writing modes, not imitation prompts. Borrow the editorial strength associated with each writer shorthand; do not copy, parody, or pastiche an author's exact voice. Choose the mode by content type and search intent, not personal preference.

| Mode | Functional Strength | Best For | Use When | Avoid |
| --- | --- | --- | --- | --- |
| Hemingway-inspired | Structural readability | Landing pages & product descriptions | The reader needs to understand the value quickly | Over-stripping nuance from educational explanations |
| Stephen King-inspired | Audience retention | Long-form blog posts & storytelling | The page needs narrative momentum or learner identification | Turning educational content into melodrama |
| Asimov-inspired | Information hierarchy | Technical guides & FAQ snippets | The learner needs a clear explanation of a concept or mechanism | Becoming too abstract before grounding the learner's problem |
| Sanderson-inspired | Comprehensive clarity | Ultimate guides & pillar pages | The page needs a complete system, taxonomy, or learning path | Over-explaining simple long-tail pages |

Practical translation for Soundwise SEO:

- **Hemingway-inspired:** Use short sentences, concrete nouns and verbs, plain claims, and fast comprehension. Good for homepage copy, App Store-adjacent copy, product descriptions, and short conversion sections.
- **Stephen King-inspired:** Start with learner frustration or curiosity, keep momentum between sections, and use concrete examples that help readers recognize themselves. Good for blog-style posts and learner-story-driven content.
- **Asimov-inspired:** Explain one concept at a time, build from a simple observation to a general principle, define terms clearly, and use headings to create conceptual order. Good for technical guides, FAQ snippets, and focused pages such as `/ship-vs-sheep/`.
- **Sanderson-inspired:** Build a complete map of the topic, use clear categories, show how the pieces relate, and make the system understandable. Good for pillar pages such as `/english-ear-training/`, `/what-are-minimal-pairs/`, and `/english-vowel-minimal-pairs/`.

Example mappings:

| Page Type | Example | Recommended Mode |
| --- | --- | --- |
| Minimal-pair explanation page | `/ship-vs-sheep/` | Asimov-inspired |
| Product landing section | homepage hero / App Store CTA | Hemingway-inspired |
| Learner frustration article | "Why English words sound the same to you" | Stephen King-inspired or Asimov-inspired |
| Pillar guide | "What are minimal pairs?" | Sanderson-inspired |
| FAQ answer | "Is this listening or pronunciation?" | Asimov-inspired |
| Product description | "Soundwise: English Ear Training App" | Hemingway-inspired |

Style mode never overrides Soundwise messaging constraints. Every SEO article must keep learner-first framing, listening perception before pronunciation production, educational value before CTA, no unsupported scientific or product claims, no keyword stuffing, and no aggressive sales language.

## CTA Guidelines

Follow the CTA hierarchy in `docs/messaging-framework.md`: teach first, mention Soundwise as a natural next step, and link only when the page context supports it.

Approved CTA examples:

- `Practice this contrast in Soundwise.`
- `Train your ear with focused minimal-pair practice.`
- `Try focused listening practice in Soundwise.`
- `Soundwise is a free ear-training app for English learners.`

Banned CTA and messaging examples:

- `Fix your accent`
- `Accent reduction`
- `Sound native fast`
- `Clinically proven`
- `Scientifically proven`
- `Guaranteed fluency`
- `Improve in 2 weeks`

The CTA should appear once near the middle or end of the page, and can be repeated in a final section if the page is long. Do not interrupt the quick answer with a sales pitch.

## UTM Convention

Follow `docs/analytics-and-attribution.md`: use lowercase values with hyphens only, and treat attribution as directional rather than precise.

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

For community links pointing to the website, use the source, medium, and campaign conventions in `docs/analytics-and-attribution.md` instead. Do not mix community attribution values into on-page App Store CTA links.

The site currently tracks App Store clicks with the `app_store_click` Google Analytics event in `src/main.js` and `src/seo-page.js` for links containing `apps.apple.com`. Keep App Store CTA links on that domain if this click tracking should apply. If analytics tooling changes, update this guide and `docs/analytics-and-attribution.md` together.

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

These cover common vowel and consonant contrasts and align with the high-priority `ship / sheep` and `/r/ vs /l/ clusters in `docs/seo-keyword-map.md`, plus related vowel contrasts that fit Soundwise's minimal-pair listening focus.

## Definition of Done / QA Checklist

Before publishing a minimal-pair SEO page, check:

- [ ] URL matches the slug convention.
- [ ] Page has one clear H1.
- [ ] Metadata exists and is unique.
- [ ] Learner pain is answered in the first section.
- [ ] No forbidden claims or banned CTAs are used.
- [ ] CTA is present but not aggressive.
- [ ] UTM link is correct.
- [ ] `utm_content` matches the slug.
- [ ] Visible FAQ includes `Why does this happen?`.
- [ ] Visible FAQ includes `How do I practice?`.
- [ ] Page includes valid `FAQPage` JSON-LD.
- [ ] `FAQPage` schema includes `Why does this happen?`.
- [ ] `FAQPage` schema includes `How do I practice?`.
- [ ] FAQ schema answers match visible page content.
- [ ] JSON-LD is valid JSON and uses `https://schema.org`.
- [ ] Schema has been checked with a structured data validator or rich results testing tool.
- [ ] No unsupported ranking, traffic, or AI-visibility guarantees are added.
- [ ] No review, rating, product, offer, or other misleading schema is used unless that content is visibly present on the page.
- [ ] `HowTo` schema is used only if the page contains explicit step-by-step practice instructions.
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
- Suggested title: `Ship vs Sheep Pronunciation: /ɪ/ vs /iː/ Practice`
- Suggested description: `Can’t hear the difference between “ship” and “sheep”? Compare /ɪ/ and /iː/, hear the short-vs-long vowel contrast, and practice with English minimal pairs.`
- CTA: `Practice this contrast in Soundwise.`
- UTM content value: `ship-vs-sheep`
