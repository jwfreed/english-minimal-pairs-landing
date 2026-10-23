"""Render the approved Soundwise film into staging; never overwrite public/videos."""
import argparse
from concurrent.futures import ThreadPoolExecutor
import html
import json
import os
from pathlib import Path
import re
import shutil
import subprocess

from transcripts import transcript

HERE = Path(__file__).resolve().parent
BASE = HERE / "composition"
PACK = json.loads((HERE / "copy/video-copy.json").read_text())
FONT_DIR = Path(os.environ.get("SOUNDWISE_FONT_DIR", "/System/Library/Fonts"))
FONT_PATHS = {
    "ja": "*角*W3.ttc", "zh": "Hiragino Sans GB.ttc", "yue": "Hiragino Sans GB.ttc",
    "ko": "AppleSDGothicNeo.ttc", "th": "Supplemental/Thonburi.ttc", "hi": "Kohinoor.ttc",
    "ar": "GeezaPro.ttc", "fa": "GeezaPro.ttc", "ur": "GeezaPro.ttc", "ru": "Supplemental/Arial.ttf",
}
DIRECTIONS = {}
NODE = None
CLI = None
FFMPEG = None
FFPROBE = None
ENV = dict(os.environ)


def native_font(code):
    pattern = FONT_PATHS.get(code)
    if not pattern:
        return None
    matches = sorted(FONT_DIR.glob(pattern))
    if not matches:
        raise RuntimeError(f"Missing licensed system font: {FONT_DIR / pattern}. See video/README.md.")
    return matches[0]


def configure():
    global NODE, CLI, FFMPEG, FFPROBE, ENV, DIRECTIONS
    NODE = shutil.which("node")
    if not NODE:
        raise RuntimeError("Node 22.12+ must be on PATH. See video/README.md.")
    version = subprocess.check_output([NODE, "--version"], text=True).strip().lstrip("v")
    if tuple(map(int, version.split(".")[:2])) < (22, 12):
        raise RuntimeError(f"Node 22.12+ required; found {version}. Select it on PATH.")
    try:
        project = json.loads(subprocess.check_output([NODE, HERE / "project.mjs", "--tools"], text=True))
    except subprocess.CalledProcessError as error:
        raise RuntimeError("Install pinned authoring tools with npm run video:install.") from error
    CLI, FFMPEG, FFPROBE = (Path(project["tools"][key]) for key in ["cli", "ffmpeg", "ffprobe"])
    for tool in [CLI, FFMPEG, FFPROBE]:
        if not tool.is_file():
            raise RuntimeError(f"Missing {tool}. Run npm run video:install.")
    ENV = dict(os.environ, PATH=os.pathsep.join([str(FFMPEG.parent), str(FFPROBE.parent), os.environ.get("PATH", "")]))
    DIRECTIONS = {item["language"]: item["direction"] for item in project["locales"]}
    DIRECTIONS["ur"] = PACK["locales"]["ur"]["direction"]  # Unpublished draft, not a homepage route.
    return project["locales"]


def run(args, cwd=None, log=None):
    result = subprocess.run([str(a) for a in args], cwd=cwd, env=ENV, text=True,
                            stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    if log:
        log.write_text(result.stdout)
    if result.returncode:
        raise RuntimeError(f"Command failed ({result.returncode}): {' '.join(map(str, args))}\n{result.stdout[-7000:]}")
    return result.stdout


def replace_content(source, pattern, value):
    source, count = re.subn(pattern, lambda m: m[1] + value + m[2], source, flags=re.S)
    if count != 1:
        raise ValueError(f"Expected one match, found {count}: {pattern}")
    return source


def prepare(code):
    work = HERE / ".working" / code
    work.mkdir(parents=True, exist_ok=True)
    for name in ["index.html", "hyperframes.json", "package.json", "meta.json", "AGENTS.md"]:
        shutil.copy2(BASE / name, work / name)
    shutil.copytree(BASE / "assets", work / "assets", dirs_exist_ok=True)
    shutil.copytree(BASE / "compositions", work / "compositions", dirs_exist_ok=True)
    # Prepared projects are one level deeper than composition/; keep their npm shortcuts valid.
    package = json.loads((work / "package.json").read_text())
    package["scripts"] = {
        "dev": "node ../../node_modules/hyperframes/bin/hyperframes.mjs preview",
        "check": "node ../../node_modules/hyperframes/bin/hyperframes.mjs check",
        "render": f"python3 ../../render.py --locale {code}",
    }
    (work / "package.json").write_text(json.dumps(package, indent=2) + "\n")
    if code == "en":
        return work
    locale = PACK["locales"][code]
    t = locale["text"]
    # Copy once per locale; references remain relative to the rendering project.
    font = native_font(code)
    css = (BASE / "assets/style.css").read_text()
    shutil.copyfile(FONT_DIR / "Supplemental/Arial Unicode.ttf", work / "assets/fonts/ipa.ttf")
    css += "\n@font-face{font-family:'IPA Sans';src:url('fonts/ipa.ttf')}\n"
    if font:
        target = "native" + font.suffix
        shutil.copyfile(font, work / "assets/fonts" / target)
        css += f"@font-face{{font-family:'Video Local';src:url('fonts/{target}')}}\n"
        css += "#root{font-family:'Video Local','Public Sans','IPA Sans'}\n"
    css += """
.headline{font-size:86px;line-height:1.18;letter-spacing:-2px;overflow-wrap:normal}
.product-name{font-family:'Public Sans';direction:ltr;text-align:left}
.word,.ipa,.phonemes,.compare-word,.compare-ipa,.latin-example{font-family:'IPA Sans'}
.latin-example{direction:ltr;unicode-bidi:isolate}
.answers,.compare-row,.phonemes{direction:ltr}
.play-control{font-size:31px}
.feedback-title{font-size:30px;line-height:1.5}
.instruction,.prompt{font-size:28px;line-height:1.6}
.compare-title{font-size:28px;line-height:1.5}
"""
    if DIRECTIONS[code] == "rtl":
        css += ".copy,#outro-type,.practice-heading,.instruction,.prompt,.feedback-title,.compare-title,.play-control{direction:rtl}\n.copy,#outro-type,.practice-heading{text-align:right}\n"
        css += ".headline{font-size:108px;line-height:1.3;letter-spacing:0}\n"
    (work / "assets/style.css").write_text(css)
    def safe(value):
        return html.escape(value)
    for name in ["hook", "practice", "feedback", "outro"]:
        file = work / "compositions" / f"{name}.html"
        source = file.read_text()
        if name == "hook":
            source = replace_content(source, r'(<p\b[^>]*id="hook-line"[^>]*>).*?(</p>)', safe(t["hook"]))
        elif name == "practice":
            source = replace_content(source, r'(<h1\b[^>]*class="headline"[^>]*>).*?(</h1>)', safe(t["listen"]) + '<br><span class="orange">' + safe(t["choose"]) + '</span>')
            source = replace_content(source, r'(<p\b[^>]*class="support"[^>]*>).*?(</p>)', safe(t["trainEar"]))
            title = safe(t["contrastTitle"]).replace('/iː/ vs /ɪ/', '<bdi dir="ltr" class="latin-example">/iː/ vs /ɪ/</bdi>')
            source = replace_content(source, r'(<p\b[^>]*class="contrast"[^>]*>).*?(</p>)', title)
            source = replace_content(source, r'(<p\b[^>]*class="instruction"[^>]*>).*?(</p>)', safe(t["listenInstruction"]))
            source = replace_content(source, r'(<span\b[^>]*class="practice-ready"[^>]*>).*?(</span>)', safe(t["playWord"]))
            source = replace_content(source, r'(<div\b[^>]*id="practice-listening"[^>]*>).*?(</div>)', safe(t["listening"]))
            source = replace_content(source, r'(<p\b[^>]*class="prompt"[^>]*>).*?(</p>)', safe(t["answerQuestion"]))
        elif name == "feedback":
            heading = safe(t["hearDifference"])
            # Keep these phrases together rather than orphaning their final syllables.
            break_before = {"ja": "聞き分けよう", "ko": "들어보세요", "th": "ให้ออก"}.get(code)
            if break_before:
                heading = heading.replace(break_before, "<br>" + break_before)
            source = replace_content(source, r'(<h1\b[^>]*class="headline"[^>]*>).*?(</h1>)', heading)
            feedback = safe(t["correctFeedback"]).replace('/iː/', '<bdi dir="ltr" class="latin-example orange">/iː/</bdi>').replace('sheep', '<bdi dir="ltr" class="latin-example">sheep</bdi>')
            source = replace_content(source, r'(<p\b[^>]*class="feedback-title"[^>]*>).*?(</p>)', feedback)
            source = replace_content(source, r'(<p\b[^>]*class="compare-title"[^>]*>).*?(</p>)', safe(t["compareWords"]))
        else:
            source = replace_content(source, r'(<p\b[^>]*id="outro-tagline"[^>]*>).*?(</p>)', safe(t["trainEar"]))
            source = replace_content(source, r'(<p\b[^>]*id="outro-note"[^>]*>).*?(</p>)', safe(t["noMicrophone"]))
            source = source.replace('#outro-tagline{font-size:62px;', '#outro-tagline{font-size:54px;')
        if name in ["practice", "feedback"]:
            source = replace_content(source, r'(<h2\b[^>]*class="practice-heading"[^>]*>).*?(</h2>)', safe(t["practiceLabel"]))
        file.write_text(source)
    return work


def render(code, output, prepare_only=False, workers=3, remaster_audio=False):
    work = prepare(code)
    logs = HERE / "logs"
    logs.mkdir(exist_ok=True)
    print(f"{code}: checking", flush=True)
    run([NODE, CLI, "check", "--json"], work, logs / f"{code}-check.log")
    run([NODE, CLI, "snapshot", "--at", "1.5,6.5,13,18", "--no-end", "--output", "review", "--json"], work, logs / f"{code}-snapshot.log")
    if prepare_only:
        print(f"{code}: ready for review in {work / 'review'}", flush=True)
        return
    print(f"{code}: rendering", flush=True)
    raw = work / "raw.mp4"
    run([NODE, CLI, "render", "--quality", "delivery", "--workers", workers, "--fps", "30", "--output", raw], work, logs / f"{code}-render.log")
    if remaster_audio:
        # Explicit opt-in for later audio edits; never replace the approved source automatically.
        run([FFMPEG, "-v", "error", "-y", "-i", raw, "-vn", "-af", "loudnorm=I=-16:TP=-1:LRA=11,atrim=duration=20", "-ar", "48000", "-c:a", "aac", "-b:a", "192k", output / "mastered-candidate.m4a"])
    poster = output / f"soundwise-{code}.jpg"
    run([FFMPEG, "-v", "error", "-y", "-ss", "13", "-i", raw, "-frames:v", "1", "-q:v", "2", poster])
    final = output / f"soundwise-{code}.mp4"
    run([FFMPEG, "-v", "error", "-y", "-i", raw, "-i", poster, "-i", BASE / "assets/audio/mastered.m4a",
         "-filter_complex", "[0:v][1:v]overlay=0:0:enable='eq(n,0)'[v]", "-map", "[v]", "-map", "2:a",
         "-c:v", "libx264", "-crf", "18", "-preset", "slow", "-pix_fmt", "yuv420p", "-c:a", "copy",
         "-t", "20", "-movflags", "+faststart", final])
    (output / f"soundwise-{code}.txt").write_text(transcript(code), encoding="utf-8")
    metadata = json.loads(run([FFPROBE, "-v", "error", "-show_entries", "stream=codec_name,duration,nb_frames,width,height", "-of", "json", final]))
    if metadata["streams"][0]["nb_frames"] != "600" or not all(float(s["duration"]) == 20 for s in metadata["streams"]):
        raise RuntimeError(f"Invalid render metadata: {metadata}")
    print(f"{code}: complete ({final.stat().st_size // 1024} KiB)", flush=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--locale", action="append", help="Language code; repeat to select several. Default: the website's 15 locales. ur is an optional unpublished draft.")
    parser.add_argument("--output", type=Path, default=HERE / ".generated")
    parser.add_argument("--prepare-only", action="store_true")
    parser.add_argument("--jobs", type=int, choices=[1, 2, 3], default=1)
    parser.add_argument("--workers", type=int, choices=[1, 2, 3], default=3)
    parser.add_argument("--remaster-audio", action="store_true", help="English only: also write a candidate soundtrack for explicit review.")
    args = parser.parse_args()
    locales = configure()
    codes = args.locale or [item["language"] for item in locales]
    if len(codes) != len(set(codes)) or not set(codes) <= set(DIRECTIONS):
        parser.error("Choose distinct supported homepage languages, or ur for its unpublished draft.")
    if args.remaster_audio and codes != ["en"]:
        parser.error("--remaster-audio requires --locale en")
    output = args.output.resolve()
    public = (HERE.parent / "public").resolve()
    if output == public or public in output.parents:
        parser.error("Render to staging, never public/. Review and copy assets explicitly afterward.")
    output.mkdir(parents=True, exist_ok=True)
    # Fail before starting a costly batch if a required system font is absent.
    for code in codes:
        if code != "en":
            native_font(code)
            if not (FONT_DIR / "Supplemental/Arial Unicode.ttf").is_file():
                raise RuntimeError("Missing Arial Unicode.ttf. See video/README.md.")
    with ThreadPoolExecutor(max_workers=args.jobs) as pool:
        futures = [pool.submit(render, code, output, args.prepare_only, args.workers, args.remaster_audio) for code in codes]
        for future in futures:
            future.result()


if __name__ == "__main__":
    main()
