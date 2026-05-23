# Homepage Improvement — Design Spec

**Date:** 2026-05-23  
**Scope:** `index.html` + `src/style.css` only. SEO pages are not touched.

---

## Goal

Improve conversion clarity, credibility, CTA discipline, localization correctness, and internal SEO linking on the Soundwise homepage — without redesigning the site or introducing unsupported claims.

---

## Files Changed

| File | Changes |
|---|---|
| `index.html` | Section rewrites, CTA updates, SEO-link grid, localization fixes |
| `src/style.css` | Small additions for the SEO-pair link grid section |

---

## Section Plan

### 1. Hero

**Headline:** `Train your ear to hear English sounds clearly.`  
**Subheadline:** `Soundwise helps English learners practice minimal pairs so confusing words like ship/sheep, rice/lice, and vest/west become easier to hear — and later pronounce.`  
**Badge:** Remove `"Science-Backed Learning"` → use `"Ear training for English learners"`  
**Primary CTA:** `Start the 10-second test` (triggers the existing hero demo)  
**Secondary CTA:** `Download Soundwise` (App Store link)  
**Reassurance:** `One-time purchase. No subscription.` (preserve existing reassurance row)  
**Hero demo:** Preserved as-is. The "Start the test" button inside the demo card keeps its current label.  
**Trust signal:** Remove `"Most learners improve in 2–3 weeks"` (fixed timeframe claim). Replace with `"No microphone needed — just listen and choose."`

### 2. Problem Section

**Heading:** `It's hard to say a sound your brain can't hear yet.`  
**Body:** `Many pronunciation problems start as listening problems. If your first language does not use a sound contrast, your brain may treat two English sounds as the same. Soundwise trains your ear with focused minimal-pair practice before you try to fix everything through speaking drills.`  
**Problem cards:** Preserve the L1-specific examples. Remove flag emojis if they cause localization confusion (optional — keep if they're pure emoji, not i18n strings).  
**Insight box:** Keep "The Real Problem" insight box. Update copy to match the above framing.

### 3. Remove: Solution section (phone mockup)

The `<section class="solution-section">` contains hardcoded Spanish strings (`"Parejas de práctica"`, `"Reproducir Audio"`). Remove this section entirely. The "How it works" section below serves its purpose.

### 4. Keep / improve: Why It Works Section

Keep the brief `"Why this works"` section. Update copy to match problem framing. No claim violations here — just tighten copy.

### 5. How It Works

**Heading:** `How Soundwise works`  
**Step 1:** Choose a sound contrast — Examples: ship/sheep, rice/lice, fan/van.  
**Step 2:** Listen and choose — Train your ear to notice the difference.  
**Step 3:** Get feedback and repeat — Practice until the contrast becomes easier to recognize.  
**ID:** Keep `id="how-it-works"` for the smooth-scroll anchor.

### 6. Remove: Progress section (progress chart mockup)

The `<section class="progress-section">` contains hardcoded Chinese strings (`"加权平均"`, `"练习时间"`, `"0.1 / 60 分钟"`). Remove this section entirely. Progress tracking is mentioned in the features grid.

### 7. Credibility Section (replaces Testimonials + Science sections)

Replace both the testimonials section and the science section with a single, safe credibility section.

**Heading:** `Built around evidence-informed pronunciation learning principles`

**Intro paragraph:** `Many pronunciation problems begin as listening problems. Research in second-language speech perception shows that learners often filter unfamiliar sounds through the categories of their first language. Soundwise applies a practical version of this idea: focused minimal-pair listening practice, real English words, immediate feedback, and repeated identification drills.`

**Bullets (verified features only):**
- Real English minimal pairs
- Listen-and-choose identification practice  
- Immediate feedback after each response
- Repeated exposure to difficult contrasts
- Targeted practice by first-language background (14 L1 backgrounds)
- Native-speaker audio
- Progress tracking by sound contrast
- One-time purchase, no subscription
- iPhone and iPad support

**Claims explicitly avoided:**
- No "clinically proven" / "scientifically proven"
- No "research-backed" (implies Soundwise itself was studied)
- No fixed improvement timeframes
- No "sound like a native"
- No "neuroscience-backed"
- No App Store ratings
- No testimonials (real or invented)

### 8. Features Section

Keep as-is. Feature cards are factual product descriptions. Update `"Personalized to Your L1"` card wording if it contains any problematic claims.

### 9. New Section: Practice Common English Sound Pairs

**Heading:** `Practice common English sound pairs`  
**Intro:** `Soundwise covers 40+ English sound contrasts. These pages explain each contrast and let you practice with the app.`

Grouped internal links to all 20 SEO pages:

**Short /ɪ/ vs long /iː/:**
- bit vs beat → `/bit-vs-beat/`
- fill vs feel → `/fill-vs-feel/`
- live vs leave → `/live-vs-leave/`
- ship vs sheep → `/ship-vs-sheep/`
- sit vs seat → `/sit-vs-seat/`

**Short /ʊ/ vs long /uː/:**
- full vs fool → `/full-vs-fool/`
- pull vs pool → `/pull-vs-pool/`

**/æ/ and /ɛ/ contrasts:**
- bad vs bed → `/bad-vs-bed/`
- bet vs bat → `/bet-vs-bat/`
- man vs men → `/man-vs-men/`

**Other vowel contrasts:**
- cap vs cup → `/cap-vs-cup/`
- cup vs cop → `/cup-vs-cop/`
- heart vs hurt → `/heart-vs-hurt/`
- law vs low → `/law-vs-low/`

**/r/ vs /l/:**
- rice vs lice → `/rice-vs-lice/`
- right vs light → `/right-vs-light/`

**/f/, /v/, /w/:**
- fan vs van → `/fan-vs-van/`
- vest vs west → `/vest-vs-west/`

**/θ/ contrasts:**
- thin vs tin → `/thin-vs-tin/`
- three vs tree → `/three-vs-tree/`

**CSS needed:** A responsive grid for the grouped link sections. Minimal — flex-wrap or CSS columns, consistent with existing design tokens.

**Analytics:** Each SEO pair link gets `data-event="seo_pair_link_click"` and the existing `setupCtaTracking` approach is extended for this pattern, or a new `setupSeoPairTracking()` function is added.

### 10. FAQ Section

Keep as-is. No claim violations present.

### 11. Final CTA

**Heading:** `Ready to train your ear?`  
**Subheading:** Remove the `"Get lifetime access for just $4.99"` line — this is a pricing claim and may become stale. Replace with the same reassurance row from the hero.  
**CTA button:** `Download Soundwise` (App Store link)  
**Reassurance:** One-time purchase · No subscription · iPhone and iPad

### 12. Footer

**Tagline:** Replace `"Neuroscience-backed listening drills to help you hear English like a native."` → `"Ear training for English learners. Hear the difference between similar English sounds."`  
**Links:** Preserve `/privacy/`, `/terms/`, `/support.html`, all anchor links

---

## CTA Standardization

| Location | Old text | New text |
|---|---|---|
| Nav CTA | `Get Started` | `Download Soundwise` |
| Hero primary CTA | `Start Training` | `Start the 10-second test` |
| Hero secondary CTA | `See How It Works` | `Download Soundwise` |
| Mid-page CTA | `Start Training` | `Download Soundwise` |
| Final CTA button | App Store badge | Keep badge style, no text change needed |

**Note:** The `data-i18n="ctaPrimary"` key on the hero primary CTA text updates the text via `updatePrimaryCtaText()` after demo completion (it switches to `demoPromotedCta`). The initial static text in the HTML is replaced by JS on page load for non-English languages. For English, the HTML text is used directly. New CTA text only changes the HTML attribute value; the JS key reference is unchanged.

---

## Analytics Additions

Preserve existing `setupCtaTracking()` which fires `app_store_click` on all Apple Store link clicks.

Add `setupSeoPairTracking()`:
- Listens for clicks on `.seo-pairs-grid a`
- Fires `gtag('event', 'seo_pair_link_click', { link_text, link_url })`

Existing demo events (`soundwise:demo_started`, `soundwise:demo_completed`, etc.) are preserved in `src/main.js` unchanged.

---

## Localization Rules

The English homepage must not contain visible non-English text in static HTML. The language switcher (nav) is intentional — users opt in to non-English. Everything else must be English by default.

Strings removed by this plan:
- `"Parejas de práctica"` (Spanish — phone mockup)
- `"Reproducir Audio"` (Spanish — phone mockup)
- `"加权平均: 66.8%"` (Chinese — progress chart)
- `"练习时间:"` (Chinese — progress chart)
- `"0.1 / 60 分钟"` (Chinese — progress chart)

Both sections containing these strings are removed entirely.

---

## Accessibility

- Heading hierarchy is preserved (h1 → h2 → h3)
- New SEO pair links have descriptive anchor text (e.g., "bit vs beat")
- New section has a proper `<h2>` heading
- Existing ARIA attributes on the demo card are untouched
- New feature bullets are in a `<ul>` with appropriate list semantics

---

## Build / Verification Plan

1. `npm run build` — must pass with no errors
2. `npm run validate:landing-copy` — run if it covers homepage copy
3. Confirm all 20 SEO links present in HTML
4. Confirm no non-English strings in homepage static HTML
5. Confirm App Store URL preserved: `https://apps.apple.com/us/app/soundwise-english/id6753882308`
6. Confirm footer links `/privacy/`, `/terms/`, `/support.html` present
7. Confirm no testimonials, fake social proof, or unsupported claims

---

## What Is NOT Changed

- `src/main.js` — no changes
- `vite.config.js` — no changes
- All SEO pages — no changes
- All legal pages — no changes
- `public/sitemap.xml` — no changes
- App Store URL and UTM structure — preserved
