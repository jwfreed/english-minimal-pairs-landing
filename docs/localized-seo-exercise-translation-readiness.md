# Localized SEO Exercise Translation Readiness

This document records the translation audit for the 14 localized flagship pair pages. It is subordinate to the exercise boundaries in `docs/exercise-architecture.md`; the executable completeness contract lives in `src/seo-exercise-translations.js`.

Audit date: 2026-09-25.

## Readiness Rule

A localized exercise is READY only when every required field is present and valid. Static fields must be non-empty strings. Dynamic fields must return non-empty output for every lifecycle branch and retain their supplied word, contrast, round, or score values. An incomplete localized candidate is never merged with English and is not mountable.

`EXACT_EXISTING` means the field already exists in the locale's explicit SEO exercise bundle. `SAFE_REUSE` means the value is reused verbatim, or composed through the same placeholder/feedback pattern already used by the localized homepage hero exercise. `NEEDS_NATIVE_REVIEW` and `MISSING` both keep the locale gated.

## Translation Contract

| SEO key | UI role / lifecycle | English source meaning | Thai control | Existing hero-demo source | Decision for the other locales |
|---|---|---|---|---|---|
| `label` | Exercise eyebrow, pre-start | Try this contrast | `ลองฝึกคู่เสียงนี้` | `demoHearDifference` is related, but is a prompt rather than an eyebrow | `NEEDS_NATIVE_REVIEW` |
| `previewChoicesAriaLabel` | Accessible name for the two preview buttons | Preview the two words | `ฟังตัวอย่างสองคำ` | `demoHearDifference` is related, but does not name the control group | `NEEDS_NATIVE_REVIEW` |
| `guessChoicesAriaLabel` | Accessible name for the answer group | Choose the word you heard | `เลือกคำที่คุณได้ยิน` | `demoListenPrompt` is related visible/live copy, not a reviewed group label | `NEEDS_NATIVE_REVIEW` |
| `replayChoicesAriaLabel` | Accessible name for the feedback replay group | Replay the contrast | `ฟังคู่เสียงนี้อีกครั้ง` | `demoReplayPrompt` is related visible copy, not a reviewed group label | `NEEDS_NATIVE_REVIEW` |
| `liveInitial` | Initial polite live-region message | Hear the contrast, then test your ear | `ฟังคู่เสียงนี้ แล้วทดสอบการฟังของคุณ` | `demoHearDifference` and `demoListenPrompt` each cover only part of the sequence | `NEEDS_NATIVE_REVIEW` |
| `previewPrompt` | Visible pre-start instruction | Listen to both words first | `ฟังทั้งสองคำก่อน` | `demoHearDifference` | `SAFE_REUSE` |
| `startButton` | Starts round one | Start the listening test | `เริ่มแบบทดสอบการฟัง` | `demoStartTest` | `SAFE_REUSE` |
| `playButton` | Replays the hidden sample during a round | Play the sample | `เล่นเสียงตัวอย่าง` | `demoPlaySample` | `SAFE_REUSE` |
| `testPrompt` | Visible answer prompt | Which word did you hear? | `คุณได้ยินคำไหน` | `demoListenPrompt` | `SAFE_REUSE` |
| `feedbackReplayPrompt` | Visible replay instruction after an answer | Listen again | `ฟังอีกครั้ง:` | `demoReplayPrompt` | `SAFE_REUSE` |
| `nextButton` | Advances to round two | Try one more round | `ลองอีกหนึ่งรอบ` | `demoNextRound` | `SAFE_REUSE` |
| `speakerLabel` | Short visible, aria-hidden label inside word playback buttons | Listen | `ฟัง` | `demoPlaySample` and `demoPlayWord` are longer action labels with different placements | `NEEDS_NATIVE_REVIEW` |
| `audioUnavailable` | Playback failure/status message | Audio is unavailable; enable sound or use a speech-capable browser before answering | `ไม่สามารถเล่นเสียงได้ โปรดเปิดเสียงหรือลองใช้เบราว์เซอร์ที่รองรับการเล่นเสียงก่อนตอบ` | None | `MISSING` |
| `listenPrompt` | Live-region instruction as a round starts | Listen carefully. Which word did you hear? | `ตั้งใจฟัง คุณได้ยินคำไหน` | `demoListenPrompt` | `SAFE_REUSE` |
| `feedbackContrast` | Dynamic feedback suffix naming the phonetic contrast | The contrast is `{contrast}` | `คู่เสียงนี้คือ {contrast}` | Summary copy refers to a contrast but no reviewed dynamic template exists | `NEEDS_NATIVE_REVIEW` |
| `generalizationHeading` | Completion heading above related catalog pairs | You practiced `{contrast}`. Try another example | `คุณฝึกคู่เสียง {contrast} แล้ว ลองตัวอย่างอื่น` | Summary copy discusses repetition, but no reviewed dynamic heading exists | `NEEDS_NATIVE_REVIEW` |
| `generalizationBody` | Explains why the listed pairs are related | These pairs use the same sound contrast | `คู่คำเหล่านี้ใช้ความต่างของเสียงเดียวกัน` | `demoSummaryAllCorrectBody` discusses practice across words and voices, not the semantic relationship of the rendered list | `NEEDS_NATIVE_REVIEW` |
| `chooseWordLabel` | Per-answer-button accessible label | Choose `{word}` | `เลือก {word}` | `demoChooseWord` | `SAFE_REUSE` |
| `playWordLabel` | Per-playback-button accessible label | Play pronunciation for `{word}` | `ฟังการออกเสียงของ {word}` | `demoPlayWord` | `SAFE_REUSE` |
| `roundLabel` | Progress indicator | Round `{current}` of `{total}` | `รอบที่ {current} จาก {total}` | `demoRoundLabel` | `SAFE_REUSE` |
| `scoreLabel` | Completion score | You got `{correct}` out of `{total}` correct | `คุณตอบถูก {correct} จาก {total} ข้อ` | `demoScore` | `SAFE_REUSE` |
| `feedback` | Correct/incorrect status plus selected and correct words | Status; you chose `{selectedWord}`; correct answer `{correctWord}` | `ถูกต้อง` / `ยังไม่ใช่`; `คุณเลือก`; `คำตอบที่ถูกต้อง` | `demoFeedbackCorrect`, `demoFeedbackIncorrect`, `demoYouChose`, and `demoCorrectAnswer`, composed exactly as in `src/main.js` | `SAFE_REUSE` |
| `summary` | Perfect, partial, and zero-score completion lead/body | Score-sensitive interpretation and next-practice guidance | Perfect: `ดีมาก คุณฟังความต่างของเสียงนี้ออกแล้ว` / `ฝึกต่อกับเสียงและคู่คำอื่น ๆ เพื่อให้แยกเสียงได้เป็นธรรมชาติ`; partial: `คุณเริ่มฟังความต่างของเสียงนี้ออกแล้ว` / `ฝึกซ้ำอีกเล็กน้อยจะช่วยให้ความต่างชัดขึ้น`; zero: `คู่เสียงนี้ยังต้องฝึกฟังเพิ่ม` / `เป็นเรื่องปกติ การฝึกฟังแบบเจาะจงช่วยให้สมองแยกเสียงที่เคยฟังคล้ายกันได้` | Six `demoSummary*` branch fields | `SAFE_REUSE` only for the vowel flagship routes; the existing zero-score body explicitly tells the learner to hear a vowel difference and is unsafe for consonant routes |
| `summaryCta` | Completion-only App Store CTA headline/body | Continue training based on the result | Perfect: `พัฒนาทักษะการฟังของคุณต่อไป` / score-aware continuation; incomplete: `ฝึกแยกคู่เสียงนี้ต่อ` / score-aware continuation | `demoReadyPrompt` and `demoValueSignal` are already shown together at homepage exercise completion; reused verbatim without adding a score claim | `SAFE_REUSE` |

The completion CTA's link label is not part of this translation bundle. `src/seo-capability-cta.js` continues to derive it from verified app capability and locale.

## Locale Readiness Matrix

| Locale | Route | Fixed pair | Translation status | Exercise before | Exercise after | Blocker set |
|---|---|---|---|---|---|---|
| Japanese | `/ja/ship-vs-sheep/` | ship/sheep | `BLOCKED_TRANSLATION` | Unmounted | Unmounted | Common ten-key punch list |
| Mandarin | `/zh/ship-vs-sheep/` | ship/sheep | `BLOCKED_TRANSLATION` | Unmounted | Unmounted | Common ten-key punch list |
| Cantonese | `/yue/right-vs-light/` | right/light | `BLOCKED_TRANSLATION` | Unmounted | Unmounted | Common ten-key punch list plus consonant-safe `summary` review |
| Korean | `/ko/right-vs-light/` | right/light | `BLOCKED_TRANSLATION` | Unmounted | Unmounted | Common ten-key punch list plus consonant-safe `summary` review |
| Spanish | `/es/ship-vs-sheep/` | ship/sheep | `BLOCKED_TRANSLATION` | Unmounted | Unmounted | Common ten-key punch list |
| Portuguese | `/pt/ship-vs-sheep/` | ship/sheep | `BLOCKED_TRANSLATION` | Unmounted | Unmounted | Common ten-key punch list |
| Arabic | `/ar/pat-vs-bat/` | pat/bat | `BLOCKED_TRANSLATION` | Unmounted | Unmounted | Common ten-key punch list plus consonant-safe `summary` review |
| Hindi/Urdu | `/hi-ur/vest-vs-west/` | vest/west | `BLOCKED_TRANSLATION` | Unmounted | Unmounted | Common ten-key punch list plus consonant-safe `summary` review |
| Indonesian | `/id/ship-vs-sheep/` | ship/sheep | `BLOCKED_TRANSLATION` | Unmounted | Unmounted | Common ten-key punch list |
| Persian | `/fa/vest-vs-west/` | vest/west | `BLOCKED_TRANSLATION` | Unmounted | Unmounted | Common ten-key punch list plus consonant-safe `summary` review |
| Russian | `/ru/ship-vs-sheep/` | ship/sheep | `BLOCKED_TRANSLATION` | Unmounted | Unmounted | Common ten-key punch list |
| Thai | `/th/thin-vs-tin/` | thin/tin | `READY` (`EXACT_EXISTING`) | Mounted | Mounted | None |
| Turkish | `/tr/ship-vs-sheep/` | ship/sheep | `BLOCKED_TRANSLATION` | Unmounted | Unmounted | Common ten-key punch list |
| Vietnamese | `/vi/right-vs-light/` | right/light | `BLOCKED_TRANSLATION` | Unmounted | Unmounted | Common ten-key punch list plus consonant-safe `summary` review |

No remaining localized flagship route became READY in this audit. No localized page source was therefore changed to add a mount or practice CTA.

## Native-Review Punch List

### Common to all 13 blocked locales

| Key | Classification | English meaning / UI context | Related repository translation | Why it cannot be reused as-is |
|---|---|---|---|---|
| `label` | `NEEDS_NATIVE_REVIEW` | “Try this contrast”; pre-start exercise eyebrow | `demoHearDifference` | A prompt is not necessarily a natural eyebrow label. |
| `previewChoicesAriaLabel` | `NEEDS_NATIVE_REVIEW` | “Preview the two words”; accessible name for a two-button group | `demoHearDifference` | The existing prompt does not explicitly name the control group. |
| `guessChoicesAriaLabel` | `NEEDS_NATIVE_REVIEW` | “Choose the word you heard”; accessible answer-group name | `demoListenPrompt` | The existing sentence is visible/live prompt copy, not a reviewed accessible group label. |
| `replayChoicesAriaLabel` | `NEEDS_NATIVE_REVIEW` | “Replay the contrast”; accessible replay-group name | `demoReplayPrompt` | The existing short visible instruction may need grammatical adaptation as a group label. |
| `liveInitial` | `NEEDS_NATIVE_REVIEW` | “Hear the contrast, then test your ear”; initial polite announcement | `demoHearDifference`, `demoListenPrompt` | Neither existing string expresses the full two-step pre-start sequence. |
| `speakerLabel` | `NEEDS_NATIVE_REVIEW` | “Listen”; short visible label inside each word playback control | `demoPlaySample`, `demoPlayWord` | Existing strings are a full sample button or word-specific accessible template, not this compact visible label. |
| `audioUnavailable` | `MISSING` | Playback failed; enable sound or use a speech-capable browser before answering | None | No localized error/recovery message exists in the repository. |
| `feedbackContrast` | `NEEDS_NATIVE_REVIEW` | “The contrast is `{contrast}`”; appended to answer feedback and announced live | Related contrast language exists in `demoSummary*`, without a placeholder | A new grammatical template is required around arbitrary IPA text. |
| `generalizationHeading` | `NEEDS_NATIVE_REVIEW` | “You practiced `{contrast}`. Try another example”; completion heading | Related repetition language exists in `demoSummaryAllCorrectBody` | No reviewed dynamic heading exists, and arbitrary IPA must remain readable. |
| `generalizationBody` | `NEEDS_NATIVE_REVIEW` | “These pairs use the same sound contrast”; explains the catalog-derived pair list | `demoSummaryAllCorrectBody` | Existing copy recommends practice across words and voices; it does not label the relationship of the displayed list. |

These ten keys are required for each of: Japanese (`ja`), Mandarin (`zh`), Cantonese (`yue`), Korean (`ko`), Spanish (`es`), Portuguese (`pt`), Arabic (`ar`), Hindi/Urdu (`hi-ur`), Indonesian (`id`), Persian (`fa`), Russian (`ru`), Turkish (`tr`), and Vietnamese (`vi`).

### Additional consonant-route review

| Locale | Key | Classification | English meaning / UI context | Related repository translation | Why it cannot be reused as-is |
|---|---|---|---|---|---|
| Cantonese (`yue`) | `summary` zero-score body | `NEEDS_NATIVE_REVIEW` | Completion guidance after 0/2 on right/light | `demoSummaryNoneCorrectBody` | It explicitly tells the learner to listen for a vowel difference, but right/light contrasts consonants. |
| Korean (`ko`) | `summary` zero-score body | `NEEDS_NATIVE_REVIEW` | Completion guidance after 0/2 on right/light | `demoSummaryNoneCorrectBody` | It explicitly tells the learner to listen for a vowel difference, but right/light contrasts consonants. |
| Arabic (`ar`) | `summary` zero-score body | `NEEDS_NATIVE_REVIEW` | Completion guidance after 0/2 on pat/bat | `demoSummaryNoneCorrectBody` | It explicitly tells the learner to listen for a vowel difference, but pat/bat contrasts consonants. |
| Hindi/Urdu (`hi-ur`) | `summary` zero-score body | `NEEDS_NATIVE_REVIEW` | Completion guidance after 0/2 on vest/west | `demoSummaryNoneCorrectBody` | It explicitly tells the learner to listen for a vowel difference, but vest/west contrasts consonants. |
| Persian (`fa`) | `summary` zero-score body | `NEEDS_NATIVE_REVIEW` | Completion guidance after 0/2 on vest/west | `demoSummaryNoneCorrectBody` | It explicitly tells the learner to listen for a vowel difference, but vest/west contrasts consonants. |
| Vietnamese (`vi`) | `summary` zero-score body | `NEEDS_NATIVE_REVIEW` | Completion guidance after 0/2 on right/light | `demoSummaryNoneCorrectBody` | It explicitly tells the learner to listen for a vowel difference, but right/light contrasts consonants. |

## Safe Reuse Provenance

`src/seo-exercise-translation-reuse.js` owns the explicit reuse mapping. It imports the approved strings from `src/hero-demo-translations.js`, preserves them verbatim, and performs only the placeholder substitution and feedback composition already used by `src/main.js`. It intentionally does not provide any of the punch-list fields.

The reusable fields are `previewPrompt`, `startButton`, `playButton`, `testPrompt`, `feedbackReplayPrompt`, `nextButton`, `listenPrompt`, `chooseWordLabel`, `playWordLabel`, `roundLabel`, `scoreLabel`, `feedback`, and `summaryCta`. `summary` is reusable only for the seven blocked vowel flagship locales (`ja`, `zh`, `es`, `pt`, `id`, `ru`, and `tr`).
