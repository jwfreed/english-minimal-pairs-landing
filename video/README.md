# Soundwise promotional-video production

This repository owns the approved 20-second film and its production pipeline.
No command imports, reads or links to the mobile app repository. The website
still publishes the existing files under `/videos/soundwise-<language>.*`.

## Structure

- `composition/`: editable English HTML/GSAP scenes, Hyperframes configuration,
  local Public Sans fonts, logo, music, effects and approved mastered soundtrack.
- `copy/video-copy.json`: canonical translated screen/share copy. The existing
  website route registry selects 15 published versions: English plus 14
  translations. Hindi serves `/hi-ur/`; Cantonese is separate from Mandarin.
  The original Urdu translation is retained as an unpublished draft.
- `copy/descriptions.json`: accessibility descriptions of the music and visual
  interaction. `copy/video-copy.md` and `copy/languages/*.txt` are review exports.
- `project.mjs`: reads the existing website locale/asset authority and resolves
  locally installed authoring tools. It defines no independent locale registry.
- `render.py`, `transcripts.py`, `validate.py`: local rendering, finishing,
  poster/transcript generation and comparison against published assets.
- `package.json` / lockfile: pinned authoring tools, separate from the website's
  install/build. This is an unpublished tool manifest, with no workspace or
  shared package; these tools are never bundled into the website.
- `fonts.json`, `migration-inventory.json`, `history/`: external-font
  fingerprints, migration classification and historical provenance/reviews.
- `.working/`, `.generated/`, `logs/`: ignored projects, staging assets and logs.

## Prerequisites

Use Node **22.12+**, npm and Python **3.9+**. No Python packages are needed.
The verified platform is macOS, with the original Apple/system fonts listed in
`fonts.json`. Those licensed font binaries are not redistributed. By default the
renderer reads `/System/Library/Fonts`; `SOUNDWISE_FONT_DIR` may point to another
directory containing the same relative files. Missing fonts fail before a batch
starts. Different OS/font/browser versions can change rasterization; other
platforms have not been verified. Do not silently substitute fonts.

From the website root:

```sh
npm run video:install
node video/node_modules/hyperframes/bin/hyperframes.mjs browser ensure
npm run video:test
```

The lockfile pins Hyperframes **0.8.186**, `ffmpeg-static` **5.3.0** and
`ffprobe-static` **3.1.0**. The verified macOS binaries are FFmpeg **6.1.1**,
FFprobe **4.0.2**, and Chrome Headless Shell **152.0.7977.30**. The explicit browser
command finds or downloads Chrome; there is no assumed global FFmpeg, CLI or npm
cache. Initial npm/browser provisioning needs network access. Rendering itself
is local and needs no API credentials, HeyGen account, cloud renderer, Whisper,
Kokoro, MusicGen or Docker. Hyperframes' general doctor also checks those optional
features; missing optional tools are not requirements of this film.

## Edit, review and render

Edit English wording/layout in `composition/compositions/*.html`, keeping the
four scene boundaries at 0, 3, 10, 16 and 20 seconds. Edit translated screen copy
in `copy/video-copy.json`; keep brand, English examples and IPA intact. Existing
font/layout adaptations and RTL isolation live in `render.py`.

```sh
python3 video/export-copy.py
npm run video:render -- --locale en --prepare-only
npm run video:render -- --locale ja --prepare-only
```

Every prepared project receives Hyperframes check plus four scene snapshots;
inspect `video/.working/<locale>/review/`. Preview the canonical English project
with `npm --prefix video/composition run dev`. For a prepared translation, run
`npm --prefix video/.working/ja run dev`. Source scenes
and fonts are copied into each project; no symlinks point to the app repository.

```sh
npm run video:render -- --locale en
npm run video:render -- --jobs 2
npm run video:render -- --locale ur  # optional unpublished draft
npm run video:validate
npm run video:validate -- --locale ur
```

Default batch selection is the website's 15 locales, including English. Repeat
`--locale` to select several. `--jobs` controls simultaneous locales; each uses
up to three render workers. Outputs default to `video/.generated/`; `--output`
accepts another staging directory. The renderer refuses to write into `public/`.
Source files and currently published assets are never overwritten by rendering.

Finishing retains the existing H.264/yuv420p, 1920×1080, 30fps, 600-frame contract.
It extracts the poster at 13 seconds, embeds that poster in frame zero, copies
the approved AAC soundtrack and writes a fast-start, exactly 20-second MP4.
Posters and transcripts are regenerated on every render. English transcripts
come from the English scenes; translated transcripts come from the JSON copy,
with accessibility descriptions prepended. Published transcript formatting is
preserved, including the English transcript's sentence-final comparison period.

`validate.py` checks streams, frame count, timing, poster size, exact transcripts,
fast-start metadata and decoded audio hashes. Against existing published assets
it records file hashes and compares 18 decoded frames, covering scene entrances,
settled copy, actions, cuts, frame zero and the final frame. Differences are
review findings, not an automatic approval of an intentional future edit.

## Audio ownership

`composition/assets/audio/mastered.m4a` is the exact approved soundtrack extracted
losslessly from the deployed English master. Default renders copy it rather than
renormalizing/re-encoding the sound. The original music and effects remain local
and editable in the root composition timeline; their cues and the embedded RMS
array driving the subtle control shadow are retained.

If intentionally changing audio, render English with `--remaster-audio` to also
produce `.generated/mastered-candidate.m4a` from the edited timeline mix at
−16 LUFS / −1 dBTP targets. Measure and audition it before explicitly promoting it
to the approved source. This option never replaces the approved soundtrack or
changes the normal output audio automatically. Refresh the visual RMS data if the
music changes. See `CREDITS.md` for asset provenance and license limitations.

## Review and publish later

All translated headlines/captions remain **drafts pending native-speaker review**;
the migration does not approve them. Urdu is not assigned a homepage route.
Historical app-source references are provenance, not files needed at render time.

For an intentional future video update, review staged decoded frames, audio and
validation differences first. Copy only approved `.mp4`, `.jpg` and `.txt` files
into `public/videos/`, preserving their names. If transcript text changes, update
the existing `videoTranscriptContent` supplemental translation and English
`index.html` transcript to match. Existing homepage tests enforce this parity.
Run `npm run build`, `npm test`, `npm run video:test` and relevant website release
gates. In a fresh checkout, build first: an existing website test reads generated
localized homepage files. Publishing uses the existing, separately authorized push-to-main
GitHub Pages workflow. Neither rendering nor validation deploys anything.

## Migration inventory and verification

`migration-inventory.json` records original source hashes and excluded artifact
categories. The ownership mapping is:

| Original app-side material | Website owner / classification |
| --- | --- |
| `brag-output/composition/` scenes, CSS, configuration, media/fonts/vendor runtime | `video/composition/`; production source |
| `brag-output/localized-copy/` JSON | `video/copy/`; editable production copy |
| Markdown and individual-language copy sheets | `video/copy/`; reproducible review exports |
| `brag-output/localized-videos/render.py` | `video/render.py`; adapted relative paths and complete English/finishing/transcript support |
| Plans, brief, share copy and prior reviews/measurements | `video/history/`; historical provenance |
| Selected cue presets, font/license notices outside the old directory | Local source metadata/notices plus `CREDITS.md` |
| Finished original exports, raw encodes, thumbnails, waveforms, logs, work projects | Reproducible outputs; excluded from Git |
| Downloaded CLI/tools/virtualenv, Hyperframes history/cache | Disposable tooling state; replaced by the pinned install and provisioning commands |

The app retains its runtime icon, Public Sans dependency, learning data and UI
translations. This repo owns video-specific snapshots of those assets/copy;
neither repository imports the other's production sources.

`verification.json` records the isolated migration run: fresh tool install and
browser HOME, with operating-system rules denying all app-repository reads.
All 15 website variants plus the unpublished Urdu draft rendered and passed
Hyperframes/media checks. All published posters/transcripts and decoded audio
match exactly. Nine MP4s are byte-identical; six have small transient render
variation, with minimum sampled-frame SSIM 0.999744. The unchanged creative
source, timestamps, codecs, durations and frame counts were also verified.
The 184-file website build and all 45 published media assets remain byte-identical.
