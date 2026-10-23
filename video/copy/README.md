# Localized video copy

Edit `video-copy.json`, the canonical translation data. Run
`python3 video/export-copy.py` from the website root to refresh `video-copy.md`,
`languages/*.txt` and the copy validation summary. The app translations that
originally supplied UI wording are historical provenance, not imported sources.

The website route registry selects 15 published videos: English and 14 translated
versions. Hindi serves `/hi-ur/`. The original Urdu copy is retained for optional
unpublished rendering, so this pack contains 15 non-English translation drafts.
All translated headlines, captions and accessibility descriptions still await
native-speaker review. Brand, English words and IPA must remain intact.

English copy is edited in `../composition/`; transcript descriptions are in
`descriptions.json`. See `../README.md` for rendering and publishing instructions.
