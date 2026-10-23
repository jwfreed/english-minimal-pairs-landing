# Source assets and dependencies

- Soundwise icon: snapshot of the product's own brand asset. The app retains its
  original runtime icon; this video owns its copied production image.
- Public Sans: existing three TTF files copied byte-for-byte; see
  `composition/assets/fonts/LICENSE_PUBLIC_SANS` (SIL Open Font License).
- Apple/system fonts: external macOS prerequisites, not redistributed. Names,
  byte sizes and SHA-256 values are recorded in `fonts.json`.
- GSAP **3.15.0**: existing vendored runtime, original copyright/license header
  retained in `composition/assets/vendor/gsap.min.js`; its header references the
  [GSAP Standard License](https://gsap.com/standard-license).
- Music: “Happy Beats / Business Moves”, volume 12, by ende.app, copied from the
  existing brag 0.4.0 bundle. Original music/energy data and the finished mix are
  preserved. The bundle's music README did not establish exact music license
  terms; this migration makes no new music-rights claim or licensing approval.
- Effects: the existing Kenney CC0 reveal, selection and brand effects supplied
  with the brag bundle. No replacement effects were introduced.
- Creative plan/brief and translation provenance: retained under `history/` and
  `copy/`; `history/BRAG_LICENSE` preserves the original plugin's software notice.
  That software notice is not represented as a verified music license.
- Hyperframes / FFmpeg / FFprobe: installed only into ignored `video/node_modules`
  from the pinned authoring lockfile. Their upstream licenses remain in those
  installed packages; executables and caches are not committed.
