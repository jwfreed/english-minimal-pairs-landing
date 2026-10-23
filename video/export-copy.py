"""Regenerate review sheets from the canonical translation JSON (not website assets)."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent / "copy"
pack = json.loads((ROOT / "video-copy.json").read_text())
overview = ["# Soundwise video translation drafts", "",
            "Generated from `video-copy.json`. All translations await native-speaker review.",
            "Website locale selection comes from `src/localized-homepage-routes.js`; Urdu is unpublished.", ""]
for code, locale in pack["locales"].items():
    lines = [f'# {locale["language"]} ({code})', "", "Native-speaker review: pending.",
             f'Direction: {locale["direction"]}', ""]
    for key, text in locale["text"].items():
        if not text.strip() or "{" in text or "}" in text:
            raise ValueError(f"Empty/unresolved {code}.{key}")
        lines += [key, text, ""]
    if "sheep" not in locale["text"]["correctFeedback"] or "/iː/" not in locale["text"]["correctFeedback"]:
        raise ValueError(f"Changed example/IPA in {code}")
    (ROOT / "languages" / f"{code}.txt").write_text("\n".join(lines), encoding="utf-8")
    overview += ["## " + locale["language"] + f" ({code})", "", *lines[2:]]
    notes = locale.get("adaptationNotes", [])
    if notes:
        overview += ["Adaptation notes:", *[f"- {note}" for note in notes], ""]
(ROOT / "video-copy.md").write_text("\n".join(overview), encoding="utf-8")
(ROOT / "validation.json").write_text(json.dumps({
    "translationVariants": len(pack["locales"]),
    "coverageAuthority": "src/localized-homepage-routes.js via video/project.mjs",
    "unpublishedDraft": "ur",
    "wordAndIpaPreservation": "passed",
    "emptyOrUnresolvedValues": "none",
    "nativeSpeakerReview": "not performed",
}, indent=2) + "\n")
print(f'Exported {len(pack["locales"])} translation review sheets.')
