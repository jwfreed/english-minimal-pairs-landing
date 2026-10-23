# Soundwise film review

Latest revision: the user changed the hook subtitle to “Can you hear the difference?” in Studio. Verified that edit from source and history, passed Hyperframes check with zero findings, and inspected the updated settled hook. Exported `../brag-updated.mp4` with the same finished audio and poster as the original. The original `../brag.mp4` is preserved. Verification for this revision is in `../verification-updated.json`.

The chosen film demonstrates a listening trial. A generic feature montage and a dramatic trailer were rejected because the ship/sheep interaction explains the product more directly.

## Visual review
- Hook: two oversized words, with orange on the different vowel letters; the subtitle supplies the premise.
- Practice: Soundwise name and Listen/Choose at left, source-derived practice controls and IPA at right. The pointer makes the selection causal.
- Feedback: the same card position anchors the match cut; the check, phoneme-specific feedback and compare rows show the result.
- Outro: the existing app icon, product name and exact onboarding copy land together.

Inspected the complete beat sheet, phone sheet and three transition strips. No clipped text or unreadable overlap in settled frames. The first frames of the cuts intentionally give the incoming content a short fade; nothing essential is read during that transient. The feedback shot deliberately holds long enough to read the feedback and compare both pronunciations; it carries `data-hold`.

The weakest shot is the feedback hold: a real audible word comparison could strengthen the demonstration, but this run intentionally uses music and effects without spoken audio. Fine IPA and helper copy should be viewed at full resolution; large words and the main story remain clear in the phone sheet.

## Measured checks
Hyperframes check passes with zero errors, zero warnings, zero infos; 39 contrast checks pass. Runtime, layout and seek sampling pass. Main product interaction and final payoff use the supplied 8.74s / 17.47s music cues; the Play Word shadow uses extracted music RMS values. Repository `npm run check` passes.

Delivered media: 1920×1080 H.264, 30fps, exactly 600 frames and 20.000 seconds; stereo AAC also ends at 20.000 seconds. Final mix measures −16 LUFS integrated, −1.0 dBTP and zero clipped samples. Audio was measured, not heard; no subjective listening review is claimed.

Selected the settled product-feedback frame at 13 seconds as `../brag.jpg` and baked it into frame 0. Inspected decoded frames 0, 45, 267 and 561: poster, hook, selected answer and outro all render correctly. Final delivery normalizes the music/effects mix and preserves video frame count and timing. Full measurements are in `../verification.json`.
