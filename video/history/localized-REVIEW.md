# Localized homepage video review

The landing repository now contains the approved English video plus 14 localized
variants, each with a localized poster and transcript. Its existing combined
Hindi/Urdu homepage targets Hindi, so that route uses the Hindi variant. Urdu
copy remains available in the text pack for a future distinct Urdu page.

The films retain the English ship/sheep examples, IPA, timing, interaction and
mastered music/effects. Native script fonts and RTL prose are applied locally
while rendering; the site ships only static video/image/text files. Reviewed
the four settled scene frames for every locale. Japanese, Korean and Thai
feedback headings received explicit phrase breaks to avoid orphaned syllables;
those three films were rendered and reviewed again. Also inspected decoded
delivered hook frames for Japanese, Arabic, Hindi and Korean.

All exports pass Hyperframes check and have 1920×1080 H.264 video, exactly 600
frames at 30fps, and 20-second video and AAC audio streams. The existing mastered
audio was copied without re-encoding; it measures −16 LUFS and −1 dBTP in the
approved English export. Audio was measured, not auditioned.

All 15 built homepage routes were checked in Playwright: matching video,
poster, language metadata and transcript; paused initially; zero MP4 requests
before playback. The native play control starts playback. Switching to Japanese
while playing pauses the old video, resets time and updates assets. Arabic
layout fits a 390px viewport with native inline controls and no horizontal
overflow. Console errors/warnings: zero in the production browser check.

The landing repository's 220 tests, production build and postbuild gates pass.
Landing-copy, representative localized SEO, funnel and App Store tracking
validation also pass. App repository `npm run check` passes. Measurements and
check summaries are in `verification.json`. Native-speaker review of newly
translated marketing headlines/captions has not been performed. No deployment
was made.
