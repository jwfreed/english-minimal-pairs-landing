import hashlib
import json
from pathlib import Path
import subprocess
import unittest

from transcripts import transcript

ROOT = Path(__file__).resolve().parent


class VideoContract(unittest.TestCase):
    def test_website_locale_authority_and_deterministic_transcripts(self):
        project = json.loads(subprocess.check_output(["node", ROOT / "project.mjs"], text=True))
        self.assertEqual(len(project["locales"]), 15)
        for locale in project["locales"]:
            with self.subTest(language=locale["language"]):
                self.assertEqual(transcript(locale["language"]),
                                 (ROOT.parent / "public" / locale["transcript"].lstrip("/")).read_text())
                self.assertIn("ship /ʃɪp/", transcript(locale["language"]))
                self.assertIn("sheep /ʃiːp/", transcript(locale["language"]))
        hindi = next(item for item in project["locales"] if item["route"] == "/hi-ur/")
        self.assertEqual(hindi["language"], "hi")
        self.assertNotIn("ur", [item["language"] for item in project["locales"]])

    def test_migrated_source_assets_match_inventory(self):
        manifest = json.loads((ROOT / "migration-inventory.json").read_text())
        # Creative source and media must move without changing their bytes.
        for item in manifest["files"]:
            path = item["path"]
            if not path.startswith("composition/") or not path.endswith((".html", ".css", ".ttf", ".png", ".mp3", ".ogg", ".js")):
                continue
            with self.subTest(path=path):
                self.assertEqual(hashlib.sha256((ROOT / path).read_bytes()).hexdigest(), item["sha256"])


if __name__ == "__main__":
    unittest.main()
