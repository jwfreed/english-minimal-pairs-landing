# Website ↔ App Contrast Alignment

Canonical capability and conversion reference for Soundwise website acquisition pages.

- **Snapshot:** 2026-07-23
- **Website:** `english-minimal-pairs-landing` at `e33e2fa`
- **App:** `english-minimal-pairs` at `9b90196`

## 1. Purpose and alignment model

The app inventory is authoritative for product capability. The website may explain or demonstrate additional sound pairs, but those website-only exercises do not prove that the app can train the same pair or contrast.

SEO pages are acquisition entry points. A flagship word pair such as `ship/sheep` is the searcher's concrete example; it is not the learning unit. The app's contrast category—such as `iVsI` (`iː` vs `ɪ`)—is the learning unit and contains multiple word-pair trials.

The canonical decision chain is:

> SEO keyword → flagship pair → contrast category → app capability for the learner's L1 → CTA decision

Therefore:

- A word-pair page may acquire a learner through a familiar query.
- The flagship pair illustrates the problem.
- The matching app contrast defines the transferable learning outcome.
- App support must be resolved against the learner's L1 dataset.
- CTA language must describe only the support found at that route + L1 intersection.

### Scope and sources

This snapshot covers the 21 English pair routes and 14 localized flagship pair routes registered in `vite.config.js`. The two hub families (`minimal-pairs-practice` and `english-ear-training`) are not pair-specific and are outside the status matrix.

Website evidence:

- `vite.config.js` for registered SEO routes and output URLs
- `content/pairs/*/index.html` for English pair pages and CTAs
- `content/locales/*/*/index.html` for localized pages and CTAs
- `src/contrast-catalog.js` for website flagship pairs and display contrasts
- `src/localized-homepage-routes.js` and `docs/phase-1-localized-flagship-seo-matrix.md` for locale/L1 routing

App evidence, read-only:

- `../english-minimal-pairs/src/constants/minimalPairs.ts` for the aggregated supported L1 list and shared `group` model
- `../english-minimal-pairs/src/constants/minimalPairs/*.ts` for exact pairs, group IDs, phonemes, and examples
- `../english-minimal-pairs/src/constants/languageSelection.ts` for locale-to-language selection

Pair matching is case-insensitive and order-insensitive. Thus app `sheep/ship` is an exact match for website `ship/sheep`. Contrast matching is phoneme-order-insensitive but otherwise exact; a related contrast is not silently treated as the same learning outcome.

## 2. Canonical status model

Status is evaluated for a specific flagship pair, contrast, and L1. An inventory-wide match must not be used to make a promise to every learner language.

### `EXACT_PAIR_EXISTS`

The matching L1 dataset contains the exact flagship pair, in either word order.

CTA:

> Practice {pair} in Soundwise

Example: the Japanese `iVsI` group contains `sheep/ship`, so `/ja/ship-vs-sheep/` may make the exact-pair claim.

### `CONTRAST_EXISTS_ONLY`

The matching L1 dataset trains the same sound contrast but does not contain the exact SEO pair.

CTA:

> Practice this sound contrast in Soundwise

Example from the current inventory: `/fill-vs-feel/` is `CONTRAST_EXISTS_ONLY` for Russian and Indonesian. Both L1 datasets train `iː` vs `ɪ`, but neither contains `fill/feel`.

### `NO_APP_SUPPORT`

The matching L1 dataset contains neither the exact pair nor the sound contrast. The app cannot honestly fulfill the page's conversion promise for that L1.

CTA decision:

> Do not publish localized acquisition page yet.

For an existing English educational page, this means no app-capability CTA should be inferred for that L1. It does not mean that a website-only explanation or exercise is app support.

## 3. Website/App alignment matrix

### Existing localized flagship routes

All 14 localized flagship routes currently have exact pair support in the corresponding app L1 dataset.

| SEO Route | Flagship Pair | Contrast | L1 | App Status | CTA |
|---|---|---|---|---|---|
| `/ja/ship-vs-sheep/` | ship/sheep | `iVsI` (`iː` vs `ɪ`) | Japanese | `EXACT_PAIR_EXISTS` | Practice ship/sheep in Soundwise |
| `/zh/ship-vs-sheep/` | ship/sheep | `iVsI` (`iː` vs `ɪ`) | Mandarin Chinese | `EXACT_PAIR_EXISTS` | Practice ship/sheep in Soundwise |
| `/th/thin-vs-tin/` | thin/tin | `thetaT` (`θ` vs `t`) | Thai | `EXACT_PAIR_EXISTS` | Practice thin/tin in Soundwise |
| `/es/ship-vs-sheep/` | ship/sheep | `iVsI` (`iː` vs `ɪ`) | Spanish | `EXACT_PAIR_EXISTS` | Practice ship/sheep in Soundwise |
| `/ar/pat-vs-bat/` | pat/bat | `pB` (`p` vs `b`) | Arabic | `EXACT_PAIR_EXISTS` | Practice pat/bat in Soundwise |
| `/ru/ship-vs-sheep/` | ship/sheep | `iVsI` (`iː` vs `ɪ`) | Russian | `EXACT_PAIR_EXISTS` | Practice ship/sheep in Soundwise |
| `/ko/right-vs-light/` | right/light | `rL` (`r` vs `l`) | Korean | `EXACT_PAIR_EXISTS` | Practice right/light in Soundwise |
| `/hi-ur/vest-vs-west/` | vest/west | `wV` (`w` vs `v`) | Hindi / Urdu | `EXACT_PAIR_EXISTS` | Practice vest/west in Soundwise |
| `/pt/ship-vs-sheep/` | ship/sheep | `iVsI` (`iː` vs `ɪ`) | Portuguese | `EXACT_PAIR_EXISTS` | Practice ship/sheep in Soundwise |
| `/vi/right-vs-light/` | right/light | `rL` (`r` vs `l`) | Vietnamese | `EXACT_PAIR_EXISTS` | Practice right/light in Soundwise |
| `/tr/ship-vs-sheep/` | ship/sheep | `iVsI` (`iː` vs `ɪ`) | Turkish | `EXACT_PAIR_EXISTS` | Practice ship/sheep in Soundwise |
| `/fa/vest-vs-west/` | vest/west | `wV` (`w` vs `v`) | Persian | `EXACT_PAIR_EXISTS` | Practice vest/west in Soundwise |
| `/yue/right-vs-light/` | right/light | `rL` (`r` vs `l`) | Cantonese | `EXACT_PAIR_EXISTS` | Practice right/light in Soundwise |
| `/id/ship-vs-sheep/` | ship/sheep | `iVsI` (`iː` vs `ɪ`) | Indonesian | `EXACT_PAIR_EXISTS` | Practice ship/sheep in Soundwise |

### English pair routes by L1 support cohort

The English routes do not identify an L1. Each route is repeated below only when its L1 cohort has a different canonical status. These rows are the localization and CTA lookup; an `EXACT_PAIR_EXISTS` result for one cohort does not authorize an exact-pair claim to another cohort.

| SEO Route | Flagship Pair | Contrast | L1 | App Status | CTA |
|---|---|---|---|---|---|
| `/bad-vs-bed/` | bad/bed | /æ/ vs /ɛ/ | Spanish, Portuguese, Persian, Hindi / Urdu | `EXACT_PAIR_EXISTS` | Practice bad/bed in Soundwise |
| `/bad-vs-bed/` | bad/bed | /æ/ vs /ɛ/ | Japanese, Mandarin Chinese, Thai, Arabic, Russian, Korean, Vietnamese, Turkish, Cantonese, Indonesian | `NO_APP_SUPPORT` | Do not publish localized acquisition page yet |
| `/bet-vs-bat/` | bet/bat | /ɛ/ vs /æ/ | Spanish, Portuguese, Persian, Hindi / Urdu | `EXACT_PAIR_EXISTS` | Practice bet/bat in Soundwise |
| `/bet-vs-bat/` | bet/bat | /ɛ/ vs /æ/ | Japanese, Mandarin Chinese, Thai, Arabic, Russian, Korean, Vietnamese, Turkish, Cantonese, Indonesian | `NO_APP_SUPPORT` | Do not publish localized acquisition page yet |
| `/bit-vs-beat/` | bit/beat | /ɪ/ vs /iː/ | Japanese, Mandarin Chinese, Spanish, Arabic, Russian, Korean, Portuguese, Turkish, Persian, Cantonese, Indonesian | `EXACT_PAIR_EXISTS` | Practice bit/beat in Soundwise |
| `/bit-vs-beat/` | bit/beat | /ɪ/ vs /iː/ | Thai, Vietnamese, Hindi / Urdu | `NO_APP_SUPPORT` | Do not publish localized acquisition page yet |
| `/cap-vs-cup/` | cap/cup | /æ/ vs /ʌ/ | Japanese, Russian, Vietnamese, Turkish, Indonesian | `EXACT_PAIR_EXISTS` | Practice cap/cup in Soundwise |
| `/cap-vs-cup/` | cap/cup | /æ/ vs /ʌ/ | Mandarin Chinese, Thai, Spanish, Arabic, Korean, Portuguese, Persian, Cantonese, Hindi / Urdu | `NO_APP_SUPPORT` | Do not publish localized acquisition page yet |
| `/cup-vs-cop/` | cup/cop | /ʌ/ vs /ɑ/ | Spanish | `EXACT_PAIR_EXISTS` | Practice cup/cop in Soundwise |
| `/cup-vs-cop/` | cup/cop | /ʌ/ vs /ɑ/ | Japanese, Mandarin Chinese, Thai, Arabic, Russian, Korean, Portuguese, Vietnamese, Turkish, Persian, Cantonese, Indonesian, Hindi / Urdu | `NO_APP_SUPPORT` | Do not publish localized acquisition page yet |
| `/fan-vs-van/` | fan/van | /f/ vs /v/ | Thai, Arabic, Indonesian | `EXACT_PAIR_EXISTS` | Practice fan/van in Soundwise |
| `/fan-vs-van/` | fan/van | /f/ vs /v/ | Japanese, Mandarin Chinese, Spanish, Russian, Korean, Portuguese, Vietnamese, Turkish, Persian, Cantonese, Hindi / Urdu | `NO_APP_SUPPORT` | Do not publish localized acquisition page yet |
| `/fill-vs-feel/` | fill/feel | /ɪ/ vs /iː/ | Japanese, Mandarin Chinese, Spanish, Arabic, Korean, Portuguese, Turkish, Persian, Cantonese | `EXACT_PAIR_EXISTS` | Practice fill/feel in Soundwise |
| `/fill-vs-feel/` | fill/feel | /ɪ/ vs /iː/ | Russian, Indonesian | `CONTRAST_EXISTS_ONLY` | Practice this sound contrast in Soundwise |
| `/fill-vs-feel/` | fill/feel | /ɪ/ vs /iː/ | Thai, Vietnamese, Hindi / Urdu | `NO_APP_SUPPORT` | Do not publish localized acquisition page yet |
| `/full-vs-fool/` | full/fool | /ʊ/ vs /uː/ | Mandarin Chinese, Portuguese, Turkish | `EXACT_PAIR_EXISTS` | Practice full/fool in Soundwise |
| `/full-vs-fool/` | full/fool | /ʊ/ vs /uː/ | Japanese, Thai, Spanish, Arabic, Russian, Korean, Vietnamese, Persian, Cantonese, Indonesian, Hindi / Urdu | `NO_APP_SUPPORT` | Do not publish localized acquisition page yet |
| `/heart-vs-hurt/` | heart/hurt | /ɑː/ vs /ɜː/ | All 14 supported L1s | `NO_APP_SUPPORT` | Do not publish localized acquisition page yet |
| `/law-vs-low/` | law/low | /ɔː/ vs /oʊ/ | All 14 supported L1s | `NO_APP_SUPPORT` | Do not publish localized acquisition page yet |
| `/live-vs-leave/` | live/leave | /ɪ/ vs /iː/ | Japanese, Mandarin Chinese, Spanish, Arabic, Russian, Korean, Portuguese, Turkish, Persian, Cantonese, Indonesian | `EXACT_PAIR_EXISTS` | Practice live/leave in Soundwise |
| `/live-vs-leave/` | live/leave | /ɪ/ vs /iː/ | Thai, Vietnamese, Hindi / Urdu | `NO_APP_SUPPORT` | Do not publish localized acquisition page yet |
| `/man-vs-men/` | man/men | /æ/ vs /ɛ/ | Spanish, Portuguese, Persian, Hindi / Urdu | `EXACT_PAIR_EXISTS` | Practice man/men in Soundwise |
| `/man-vs-men/` | man/men | /æ/ vs /ɛ/ | Japanese, Mandarin Chinese, Thai, Arabic, Russian, Korean, Vietnamese, Turkish, Cantonese, Indonesian | `NO_APP_SUPPORT` | Do not publish localized acquisition page yet |
| `/pat-vs-bat/` | pat/bat | /p/ vs /b/ | Arabic | `EXACT_PAIR_EXISTS` | Practice pat/bat in Soundwise |
| `/pat-vs-bat/` | pat/bat | /p/ vs /b/ | Japanese, Mandarin Chinese, Thai, Spanish, Russian, Korean, Portuguese, Vietnamese, Turkish, Persian, Cantonese, Indonesian, Hindi / Urdu | `NO_APP_SUPPORT` | Do not publish localized acquisition page yet |
| `/pull-vs-pool/` | pull/pool | /ʊ/ vs /uː/ | Mandarin Chinese, Portuguese, Turkish | `EXACT_PAIR_EXISTS` | Practice pull/pool in Soundwise |
| `/pull-vs-pool/` | pull/pool | /ʊ/ vs /uː/ | Japanese, Thai, Spanish, Arabic, Russian, Korean, Vietnamese, Persian, Cantonese, Indonesian, Hindi / Urdu | `NO_APP_SUPPORT` | Do not publish localized acquisition page yet |
| `/rice-vs-lice/` | rice/lice | /r/ vs /l/ | Japanese, Mandarin Chinese, Thai, Korean, Cantonese | `EXACT_PAIR_EXISTS` | Practice rice/lice in Soundwise |
| `/rice-vs-lice/` | rice/lice | /r/ vs /l/ | Vietnamese | `CONTRAST_EXISTS_ONLY` | Practice this sound contrast in Soundwise |
| `/rice-vs-lice/` | rice/lice | /r/ vs /l/ | Spanish, Arabic, Russian, Portuguese, Turkish, Persian, Indonesian, Hindi / Urdu | `NO_APP_SUPPORT` | Do not publish localized acquisition page yet |
| `/right-vs-light/` | right/light | /r/ vs /l/ | Japanese, Mandarin Chinese, Thai, Korean, Vietnamese, Cantonese | `EXACT_PAIR_EXISTS` | Practice right/light in Soundwise |
| `/right-vs-light/` | right/light | /r/ vs /l/ | Spanish, Arabic, Russian, Portuguese, Turkish, Persian, Indonesian, Hindi / Urdu | `NO_APP_SUPPORT` | Do not publish localized acquisition page yet |
| `/ship-vs-sheep/` | ship/sheep | /ɪ/ vs /iː/ | Japanese, Mandarin Chinese, Spanish, Arabic, Russian, Korean, Portuguese, Turkish, Persian, Cantonese, Indonesian | `EXACT_PAIR_EXISTS` | Practice ship/sheep in Soundwise |
| `/ship-vs-sheep/` | ship/sheep | /ɪ/ vs /iː/ | Thai, Vietnamese, Hindi / Urdu | `NO_APP_SUPPORT` | Do not publish localized acquisition page yet |
| `/sit-vs-seat/` | sit/seat | /ɪ/ vs /iː/ | Mandarin Chinese, Spanish | `EXACT_PAIR_EXISTS` | Practice sit/seat in Soundwise |
| `/sit-vs-seat/` | sit/seat | /ɪ/ vs /iː/ | Japanese, Arabic, Russian, Korean, Portuguese, Turkish, Persian, Cantonese, Indonesian | `CONTRAST_EXISTS_ONLY` | Practice this sound contrast in Soundwise |
| `/sit-vs-seat/` | sit/seat | /ɪ/ vs /iː/ | Thai, Vietnamese, Hindi / Urdu | `NO_APP_SUPPORT` | Do not publish localized acquisition page yet |
| `/thin-vs-tin/` | thin/tin | /θ/ vs /t/ | Thai, Portuguese, Vietnamese, Turkish, Persian, Cantonese, Indonesian, Hindi / Urdu | `EXACT_PAIR_EXISTS` | Practice thin/tin in Soundwise |
| `/thin-vs-tin/` | thin/tin | /θ/ vs /t/ | Japanese, Mandarin Chinese, Spanish, Arabic, Russian, Korean | `NO_APP_SUPPORT` | Do not publish localized acquisition page yet |
| `/three-vs-tree/` | three/tree | /θr/ vs /tr/ | Thai, Portuguese, Vietnamese, Turkish, Persian, Cantonese, Indonesian, Hindi / Urdu | `EXACT_PAIR_EXISTS` | Practice three/tree in Soundwise |
| `/three-vs-tree/` | three/tree | /θr/ vs /tr/ | Japanese, Mandarin Chinese, Spanish, Arabic, Russian, Korean | `NO_APP_SUPPORT` | Do not publish localized acquisition page yet |
| `/vest-vs-west/` | vest/west | /v/ vs /w/ | Mandarin Chinese, Russian, Persian, Cantonese, Hindi / Urdu | `EXACT_PAIR_EXISTS` | Practice vest/west in Soundwise |
| `/vest-vs-west/` | vest/west | /v/ vs /w/ | Japanese, Thai, Spanish, Arabic, Korean, Portuguese, Vietnamese, Turkish, Indonesian | `NO_APP_SUPPORT` | Do not publish localized acquisition page yet |

## 4. L1 contrast inventory

`Contrast` preserves the app's group ID and phoneme direction. `Available Examples` is the complete checked-in app list for that group. `Exact SEO Pair Matches` compares those examples with the 21 current English pair routes; word order does not affect a match.

| L1 | Contrast | Available Examples | Exact SEO Pair Matches | Notes |
|---|---|---|---|---|
| Japanese | `rL` (r vs l) | rake/lake, right/light, red/led, rate/late, rice/lice, road/load, rag/lag, rip/lip, rain/lane, pray/play, correct/collect, crowd/cloud | right/light, rice/lice | No localized flagship acquisition page. |
| Japanese | `bV` (b vs v) | ban/van, bet/vet, best/vest, berry/very, boat/vote, bail/veil, bow/vow, bat/vat, marble/marvel, curb/curve | None | No localized flagship acquisition page. |
| Japanese | `sTheta` (s vs θ) | sink/think, saw/thaw, sum/thumb, sick/thick, sought/thought, sank/thank, mass/math, sigh/thigh, moss/moth, face/faith | None | No localized flagship acquisition page. |
| Japanese | `aVsUh` (æ vs ʌ) | cat/cut, bat/but, hat/hut, batter/butter, bag/bug, mad/mud, ran/run, pan/pun, match/much, cap/cup, hang/hung, stamp/stump | cap/cup | No localized flagship acquisition page. |
| Japanese | `iVsI` (iː vs ɪ) | sheep/ship, peel/pill, bean/bin, leave/live, feel/fill, reed/rid, beat/bit, seal/sill, heap/hip, feet/fit, neat/knit, peach/pitch | sheep/ship, leave/live, feel/fill, beat/bit | Current localized flagship covers this contrast. |
| Mandarin Chinese | `thetaS` (θ vs s) | thin/sin, thaw/saw, thumb/sum, thick/sick, thought/sought, thank/sank, think/sink, faith/face, math/mass, mouth/mouse, both/boss, path/pass | None | No localized flagship acquisition page. |
| Mandarin Chinese | `vW` (v vs w) | vine/wine, vent/went, vet/wet, vest/west, vile/while, verse/worse, vow/wow, veil/wail, vane/wane, veal/wheel, viper/wiper | vest/west | No localized flagship acquisition page. |
| Mandarin Chinese | `rL` (r vs l) | right/light, red/led, rock/lock, road/load, rate/late, rain/lane, rake/lake, rice/lice, rung/lung, rip/lip, correct/collect, crowd/cloud | right/light, rice/lice | No localized flagship acquisition page. |
| Mandarin Chinese | `iVsI` (iː vs ɪ) | beat/bit, sheep/ship, bean/bin, leave/live, feel/fill, reed/rid, feet/fit, seat/sit, neat/knit, peach/pitch | beat/bit, sheep/ship, leave/live, feel/fill, seat/sit | Current localized flagship covers this contrast. |
| Mandarin Chinese | `uVsU` (uː vs ʊ) | pool/pull, suit/soot, fool/full, wooed/wood, Luke/look, cooed/could, stewed/stood | pool/pull, fool/full | No localized flagship acquisition page. |
| Thai | `thetaT` (θ vs t) | thin/tin, thigh/tie, thorn/torn, thick/tick, thought/taught, three/tree, thank/tank, thread/tread, threw/true, thaw/taw, math/mat, oath/oat | thin/tin, three/tree | Current localized flagship covers this contrast. |
| Thai | `ethD` (ð vs d) | then/den, those/doze, though/dough, father/fodder, they/day, lather/ladder, seethe/seed, there/dare, soothe/sued, breathe/breed, loathe/load | None | No localized flagship acquisition page. |
| Thai | `vF` (v vs f) | vine/fine, vast/fast, veil/fail, vat/fat, vault/fault, view/few, van/fan, vase/face, save/safe, leave/leaf | van/fan | No localized flagship acquisition page. |
| Thai | `zS` (z vs s) | zip/sip, zap/sap, zinc/sink, zeal/seal, raise/race, eyes/ice, zone/sewn, rise/rice, phase/face, zoo/sue, buzz/bus, lies/lice | None | No localized flagship acquisition page. |
| Thai | `rL` (r vs l) | right/light, red/led, row/low, road/load, rate/late, rice/lice, rip/lip, rain/lane, read/lead, rake/lake, correct/collect, crowd/cloud | right/light, rice/lice | No localized flagship acquisition page. |
| Spanish | `iVsI` (iː vs ɪ) | sheep/ship, seat/sit, teen/tin, deed/did, leave/live, feel/fill, heat/hit, bead/bid, beat/bit, heal/hill, meal/mill, feet/fit, neat/knit, peach/pitch | sheep/ship, seat/sit, leave/live, feel/fill, beat/bit | Current localized flagship covers this contrast. |
| Spanish | `uhVsAh` (ʌ vs ɑː) | cut/cot, luck/lock, cup/cop, duck/dock, hut/hot, sung/song, nut/not, bus/boss, gun/gone, done/don, sub/sob, bug/bog | cup/cop | No localized flagship acquisition page. |
| Spanish | `aVsE` (æ vs ɛ) | bad/bed, pan/pen, dad/dead, bat/bet, band/bend, ham/hem, man/men, sat/set, gas/guess, sad/said, land/lend, mat/met | bad/bed, bat/bet, man/men | No localized flagship acquisition page. |
| Spanish | `bV` (b vs v) | ban/van, bet/vet, boat/vote, berry/very, best/vest, bolt/volt, bow/vow, bane/vane, bat/vat, marble/marvel, curb/curve, bail/veil | None | No localized flagship acquisition page. |
| Spanish | `thetaS` (θ vs s) | thin/sin, thick/sick, think/sink, theme/seem, mouth/mouse, path/pass, thaw/saw, thumb/sum, thought/sought, thank/sank, faith/face, math/mass | None | No localized flagship acquisition page. |
| Arabic | `pB` (p vs b) | pat/bat, pig/big, pin/bin, pan/ban, pet/bet, pill/bill, pear/bear, peak/beak, pale/bale, pack/back, rapid/rabid, cap/cab | pat/bat | Current localized flagship covers this contrast. |
| Arabic | `vF` (v vs f) | vine/fine, vat/fat, van/fan, vase/face, save/safe, leave/leaf, vast/fast, veil/fail, vault/fault, view/few, very/ferry, veer/fear | van/fan | No localized flagship acquisition page. |
| Arabic | `thetaS` (θ vs s) | thin/sin, thaw/saw, thumb/sum, thick/sick, thought/sought, thank/sank, think/sink, mouth/mouse, both/boss, path/pass | None | No localized flagship acquisition page. |
| Arabic | `ethD` (ð vs d) | then/den, those/doze, though/dough, father/fodder, they/day, lather/ladder, seethe/seed, there/dare, soothe/sued, breathe/breed, loathe/load | None | No localized flagship acquisition page. |
| Arabic | `iVsI` (iː vs ɪ) | sheep/ship, peel/pill, bean/bin, leave/live, feel/fill, reed/rid, beat/bit, green/grin, seal/sill, feet/fit, peak/pick, neat/knit, heed/hid, peach/pitch, least/list | sheep/ship, leave/live, feel/fill, beat/bit | No localized flagship acquisition page. |
| Russian | `iVsI` (iː vs ɪ) | sheep/ship, leave/live, beat/bit, feet/fit, neat/knit, peach/pitch, bean/bin, keen/kin, reed/rid, deep/dip, seal/sill, heap/hip | sheep/ship, leave/live, beat/bit | Current localized flagship covers this contrast. |
| Russian | `aVsUh` (æ vs ʌ) | bat/but, cap/cup, pan/pun, ban/bun, hang/hung, stamp/stump, cat/cut, hat/hut, bag/bug, mad/mud, match/much, ran/run | cap/cup | No localized flagship acquisition page. |
| Russian | `wV` (w vs v) | wine/vine, went/vent, wet/vet, west/vest, while/vile, worse/verse, wow/vow, wail/veil, wane/vane, wheel/veal, wiper/viper | west/vest | No localized flagship acquisition page. |
| Russian | `thetaS` (θ vs s) | thin/sin, thaw/saw, thumb/sum, thick/sick, thought/sought, thank/sank, think/sink, mouth/mouse, both/boss, path/pass | None | No localized flagship acquisition page. |
| Russian | `hZero` (h vs ∅) | hat/at, hit/it, hall/all, heat/eat, hear/ear, hold/old, hill/ill, harm/arm, her/err, hair/air, hedge/edge, hand/and | None | No localized flagship acquisition page. |
| Korean | `iVsI` (iː vs ɪ) | sheep/ship, peel/pill, bean/bin, leave/live, feel/fill, reed/rid, beat/bit, feet/fit, neat/knit, peach/pitch | sheep/ship, leave/live, feel/fill, beat/bit | No localized flagship acquisition page. |
| Korean | `fP` (f vs p) | fine/pine, face/pace, fork/pork, fan/pan, fat/pat, file/pile, ferry/perry, feel/peel, foot/put, fail/pale, coffee/copy, leaf/leap | None | No localized flagship acquisition page. |
| Korean | `vB` (v vs b) | van/ban, vet/bet, vent/bent, vest/best, vote/boat, very/berry, vow/bow, veil/bail, vat/bat, vase/base, dove/dub, curve/curb | None | No localized flagship acquisition page. |
| Korean | `rL` (r vs l) | right/light, red/led, row/low, rate/late, road/load, rice/lice, rip/lip, rain/lane, read/lead, rake/lake, correct/collect, crowd/cloud | right/light, rice/lice | Current localized flagship covers this contrast. |
| Korean | `thetaS` (θ vs s) | thin/sin, thaw/saw, thumb/sum, thick/sick, thought/sought, thank/sank, think/sink, mouth/mouse, both/boss, path/pass | None | No localized flagship acquisition page. |
| Hindi / Urdu | `thetaT` (θ vs t) | thin/tin, thigh/tie, thorn/torn, thick/tick, thought/taught, three/tree, thank/tank, thread/tread, threw/true, thaw/taw, math/mat, oath/oat | thin/tin, three/tree | No localized flagship acquisition page. |
| Hindi / Urdu | `ethD` (ð vs d) | then/den, those/doze, though/dough, father/fodder, they/day, lather/ladder, seethe/seed, there/dare, soothe/sued, breathe/breed, loathe/load | None | No localized flagship acquisition page. |
| Hindi / Urdu | `zS` (z vs s) | zip/sip, zeal/seal, zone/sewn, zoo/sue, buzz/bus, lies/lice, zap/sap, zinc/sink, rise/rice, maze/mace, phase/face, prize/price | None | No localized flagship acquisition page. |
| Hindi / Urdu | `wV` (w vs v) | wine/vine, west/vest, wow/vow, wane/vane, wheel/veal, wiper/viper | west/vest | Current localized flagship covers this contrast. |
| Hindi / Urdu | `aVsE` (æ vs ɛ) | bad/bed, bag/beg, man/men, pan/pen, gas/guess, sad/said, dad/dead, land/lend, mat/met, bat/bet, band/bend, ham/hem | bad/bed, man/men, bat/bet | No localized flagship acquisition page. |
| Portuguese | `thetaT` (θ vs t) | thin/tin, thigh/tie, thorn/torn, thick/tick, thought/taught, three/tree, thank/tank, thrill/trill, thread/tread, thaw/taw, math/mat, oath/oat | thin/tin, three/tree | No localized flagship acquisition page. |
| Portuguese | `ethD` (ð vs d) | then/den, those/doze, though/dough, father/fodder, they/day, lather/ladder, seethe/seed, there/dare, soothe/sued, breathe/breed, loathe/load | None | No localized flagship acquisition page. |
| Portuguese | `iVsI` (iː vs ɪ) | sheep/ship, peel/pill, heel/hill, leave/live, feel/fill, bead/bid, beat/bit, green/grin, seek/sick, feet/fit, neat/knit, peach/pitch | sheep/ship, leave/live, feel/fill, beat/bit | Current localized flagship covers this contrast. |
| Portuguese | `uVsU` (uː vs ʊ) | pool/pull, suit/soot, fool/full, wooed/wood, Luke/look, cooed/could, stewed/stood | pool/pull, fool/full | No localized flagship acquisition page. |
| Portuguese | `aVsE` (æ vs ɛ) | bad/bed, man/men, sat/set, pan/pen, mass/mess, sad/said, dad/dead, land/lend, mat/met, bat/bet, rack/wreck, band/bend, bland/blend, ham/hem, flash/flesh | bad/bed, man/men, bat/bet | No localized flagship acquisition page. |
| Vietnamese | `thetaT` (θ vs t) | thin/tin, thick/tick, thank/tank, thaw/taw, math/mat, oath/oat, thigh/tie, thorn/torn, thought/taught, three/tree, thread/tread, threw/true | thin/tin, three/tree | No localized flagship acquisition page. |
| Vietnamese | `ethD` (ð vs d) | then/den, though/dough, they/day, there/dare, breathe/breed, loathe/load, those/doze, father/fodder, lather/ladder, seethe/seed | None | No localized flagship acquisition page. |
| Vietnamese | `zS` (z vs s) | zip/sip, zeal/seal, zone/sewn, zoo/sue, buzz/bus, lies/lice, zap/sap, zinc/sink, rise/rice, maze/mace, phase/face, prize/price | None | No localized flagship acquisition page. |
| Vietnamese | `rL` (r vs l) | right/light, red/led, row/low, road/load, rain/lane, read/lead, rip/lip, rung/lung, ride/lied, rake/lake, correct/collect, crowd/cloud | right/light | Current localized flagship covers this contrast. |
| Vietnamese | `aVsUh` (æ vs ʌ) | cat/cut, batter/butter, ran/run, cap/cup, hang/hung, stamp/stump, bat/but, hat/hut, bag/bug, mad/mud, pan/pun, match/much | cap/cup | No localized flagship acquisition page. |
| Turkish | `thetaT` (θ vs t) | thin/tin, thigh/tie, thorn/torn, thick/tick, thought/taught, three/tree, thank/tank, thread/tread, threw/true, thaw/taw, thrash/trash, math/mat, bath/bat, oath/oat, cloth/clot | thin/tin, three/tree | No localized flagship acquisition page. |
| Turkish | `ethD` (ð vs d) | then/den, those/doze, though/dough, father/fodder, they/day, lather/ladder, seethe/seed, there/dare, soothe/sued, breathe/breed, loathe/load | None | No localized flagship acquisition page. |
| Turkish | `iVsI` (iː vs ɪ) | sheep/ship, peel/pill, bean/bin, leave/live, feel/fill, reed/rid, beat/bit, green/grin, seal/sill, feet/fit, peak/pick, neat/knit, heed/hid, peach/pitch, least/list | sheep/ship, leave/live, feel/fill, beat/bit | Current localized flagship covers this contrast. |
| Turkish | `uVsU` (uː vs ʊ) | pool/pull, suit/soot, fool/full, wooed/wood, Luke/look, cooed/could, stewed/stood | pool/pull, fool/full | No localized flagship acquisition page. |
| Turkish | `aVsUh` (æ vs ʌ) | cat/cut, bat/but, hat/hut, batter/butter, bag/bug, mad/mud, ran/run, pan/pun, match/much, cap/cup, hang/hung, stamp/stump | cap/cup | No localized flagship acquisition page. |
| Persian | `thetaT` (θ vs t) | thin/tin, thigh/tie, thorn/torn, thick/tick, thought/taught, three/tree, thank/tank, thread/tread, threw/true, thaw/taw, thrash/trash, math/mat, bath/bat, oath/oat, cloth/clot | thin/tin, three/tree | No localized flagship acquisition page. |
| Persian | `ethD` (ð vs d) | then/den, those/doze, though/dough, father/fodder, they/day, lather/ladder, seethe/seed, there/dare, soothe/sued, breathe/breed, loathe/load | None | No localized flagship acquisition page. |
| Persian | `wV` (w vs v) | wine/vine, went/vent, wet/vet, west/vest, while/vile, worse/verse, wow/vow, wail/veil, wane/vane, wheel/veal, wiper/viper | west/vest | Current localized flagship covers this contrast. |
| Persian | `iVsI` (iː vs ɪ) | sheep/ship, peel/pill, bean/bin, leave/live, feel/fill, reed/rid, beat/bit, green/grin, seal/sill, feet/fit, peak/pick, neat/knit, heed/hid, peach/pitch, least/list | sheep/ship, leave/live, feel/fill, beat/bit | No localized flagship acquisition page. |
| Persian | `aVsE` (æ vs ɛ) | bad/bed, man/men, sat/set, pan/pen, mass/mess, sad/said, dad/dead, land/lend, mat/met, bat/bet, rack/wreck, band/bend, bland/blend, ham/hem, flash/flesh | bad/bed, man/men, bat/bet | No localized flagship acquisition page. |
| Cantonese | `thetaT` (θ vs t) | thin/tin, thigh/tie, thorn/torn, thick/tick, thought/taught, three/tree, thank/tank, thread/tread, threw/true, thaw/taw, math/mat, oath/oat | thin/tin, three/tree | No localized flagship acquisition page. |
| Cantonese | `ethD` (ð vs d) | then/den, those/doze, though/dough, father/fodder, they/day, lather/ladder, seethe/seed, there/dare, soothe/sued, breathe/breed, loathe/load | None | No localized flagship acquisition page. |
| Cantonese | `vW` (v vs w) | vine/wine, vent/went, vet/wet, vest/west, vile/while, verse/worse, vow/wow, veil/wail, vane/wane, veal/wheel, viper/wiper | vest/west | No localized flagship acquisition page. |
| Cantonese | `rL` (r vs l) | right/light, red/led, row/low, rate/late, road/load, rice/lice, rip/lip, rain/lane, read/lead, rake/lake, rung/lung, correct/collect, ride/lied, crowd/cloud | right/light, rice/lice | Current localized flagship covers this contrast. |
| Cantonese | `iVsI` (iː vs ɪ) | sheep/ship, peel/pill, bean/bin, leave/live, feel/fill, reed/rid, beat/bit, seal/sill, heap/hip, feet/fit, neat/knit, peach/pitch | sheep/ship, leave/live, feel/fill, beat/bit | No localized flagship acquisition page. |
| Indonesian | `thetaT` (θ vs t) | thin/tin, thick/tick, thank/tank, thaw/taw, math/mat, oath/oat, thigh/tie, thorn/torn, thought/taught, three/tree, thread/tread, threw/true | thin/tin, three/tree | No localized flagship acquisition page. |
| Indonesian | `ethD` (ð vs d) | then/den, though/dough, they/day, there/dare, breathe/breed, loathe/load, those/doze, father/fodder, lather/ladder, seethe/seed | None | No localized flagship acquisition page. |
| Indonesian | `vF` (v vs f) | vine/fine, vast/fast, veil/fail, vat/fat, vault/fault, view/few, van/fan, very/ferry, veer/fear, vase/face, save/safe, leave/leaf | van/fan | No localized flagship acquisition page. |
| Indonesian | `aVsUh` (æ vs ʌ) | cat/cut, batter/butter, ran/run, cap/cup, hang/hung, stamp/stump, bat/but, hat/hut, bag/bug, mad/mud, pan/pun, match/much | cap/cup | No localized flagship acquisition page. |
| Indonesian | `iVsI` (iː vs ɪ) | sheep/ship, leave/live, beat/bit, feet/fit, neat/knit, peach/pitch, bean/bin, keen/kin, reed/rid, deep/dip, seal/sill, heap/hip | sheep/ship, leave/live, beat/bit | Current localized flagship covers this contrast. |

## 5. Gap analysis

### Website promises exceeding app support

- `/heart-vs-hurt/` and `/law-vs-low/` are registered, published acquisition routes with App Store CTAs that say “Practice this contrast in Soundwise.” No supported L1 dataset contains either exact pair or either contrast. Their website exercises come from the website catalog and do not establish app support.
- The global pages `/bit-vs-beat/`, `/fill-vs-feel/`, `/man-vs-men/`, `/pat-vs-bat/`, and `/vest-vs-west/` currently include exact-pair CTA language. Each exact pair is available for only a subset of L1s; for example, `pat/bat` exists only in Arabic.
- The remaining global pages generally use contrast-level CTA language, but even that claim exceeds capability for L1 cohorts marked `NO_APP_SUPPORT` above.
- The website's `src/contrast-catalog.js` is broader than the app and is correctly useful for on-page demonstrations. It must not remain the source of truth for the “App Support Type” field in `docs/seo-page-conversion-matrix.md`.

### App capabilities not represented on the localized website

The current localized rollout represents one of five app contrast groups per L1. These checked-in app groups have no localized flagship acquisition page:

| L1 | Represented Group | App Groups Without a Localized Flagship |
|---|---|---|
| Japanese | `iVsI` | `rL`, `bV`, `sTheta`, `aVsUh` |
| Mandarin Chinese | `iVsI` | `thetaS`, `vW`, `rL`, `uVsU` |
| Thai | `thetaT` | `ethD`, `vF`, `zS`, `rL` |
| Spanish | `iVsI` | `uhVsAh`, `aVsE`, `bV`, `thetaS` |
| Arabic | `pB` | `vF`, `thetaS`, `ethD`, `iVsI` |
| Russian | `iVsI` | `aVsUh`, `wV`, `thetaS`, `hZero` |
| Korean | `rL` | `iVsI`, `fP`, `vB`, `thetaS` |
| Hindi / Urdu | `wV` | `thetaT`, `ethD`, `zS`, `aVsE` |
| Portuguese | `iVsI` | `thetaT`, `ethD`, `uVsU`, `aVsE` |
| Vietnamese | `rL` | `thetaT`, `ethD`, `zS`, `aVsUh` |
| Turkish | `iVsI` | `thetaT`, `ethD`, `uVsU`, `aVsUh` |
| Persian | `wV` | `thetaT`, `ethD`, `iVsI`, `aVsE` |
| Cantonese | `rL` | `thetaT`, `ethD`, `vW`, `iVsI` |
| Indonesian | `iVsI` | `thetaT`, `ethD`, `vF`, `aVsUh` |

This is opportunity inventory, not a recommendation to publish all 56 combinations.

### CTA improvements

No fixes are implemented by this artifact. The next CTA alignment pass should:

1. Resolve support from route + L1 using the app-derived matrix.
2. Use an exact-pair CTA only for `EXACT_PAIR_EXISTS`.
3. Replace an exact claim with “Practice this sound contrast in Soundwise” for `CONTRAST_EXISTS_ONLY`.
4. Withhold localized publication and app-capability CTAs for `NO_APP_SUPPORT`.
5. Remove the unsupported contrast promise from the existing `heart/hurt` and `law/low` conversion paths unless the app later adds those contrasts.
6. Treat the English routes as L1-neutral until the user selects or the experience reliably resolves an L1; an app-wide match is not enough for an exact claim.

## 6. SEO prioritization framework

### Eligibility gate

A candidate localized page must first be `EXACT_PAIR_EXISTS` or `CONTRAST_EXISTS_ONLY` for its intended L1. `NO_APP_SUPPORT` candidates do not enter the publishing backlog.

### Ranking score

Score each eligible route + L1 candidate from 1 (weak) to 5 (strong) on the five required dimensions:

| Dimension | Weight | Evidence |
|---|---:|---|
| Search demand | 30% | Query volume, trend stability, result quality, and relevant long-tail demand in the target language |
| Learner difficulty / relevance | 25% | L1-specific phonological evidence, learner research, support feedback, and observed confusion |
| L1 importance | 15% | Addressable learner base, current product usage, strategic market value, and localization readiness |
| App support strength | 20% | `EXACT_PAIR_EXISTS` over `CONTRAST_EXISTS_ONLY`, number and quality of examples, and full practice availability |
| Conversion potential | 10% | Existing organic engagement, exercise completion, CTA click-through, and App Store continuation |

Calculate:

> Priority score = (Demand × 0.30) + (Difficulty × 0.25) + (L1 importance × 0.15) + (App support × 0.20) + (Conversion × 0.10)

For app support strength, use 5 for an exact pair in a well-populated contrast group, 3 for contrast-only support with strong alternative examples, and exclude `NO_APP_SUPPORT`.

### Staged validation

1. Rank candidates within each L1; do not multiply one promising pair across every locale.
2. Select one to three high-scoring route + L1 candidates with clear app support.
3. Validate search impressions and intent before full copy production.
4. Publish a small cohort with status-correct CTAs and explicit contrast framing.
5. Compare organic entry, exercise engagement, CTA click-through, and downstream App Store continuation against the existing flagship.
6. Expand only the contrast/L1 combinations whose evidence survives the test; refresh this artifact whenever the app inventory changes.
