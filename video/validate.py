"""Validate staged renders and compare them with committed website assets."""
import argparse
import hashlib
import json
from pathlib import Path
import re

import render
from transcripts import transcript


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def probe(path):
    return json.loads(render.run([render.FFPROBE, "-v", "error", "-show_streams", "-show_format", "-of", "json", path]))


def media_contract(path):
    data = probe(path)
    video = next(s for s in data["streams"] if s["codec_type"] == "video")
    audio = next(s for s in data["streams"] if s["codec_type"] == "audio")
    expected = {"codec_name": "h264", "width": 1920, "height": 1080, "r_frame_rate": "30/1", "nb_frames": "600", "pix_fmt": "yuv420p"}
    if any(video.get(k) != value for k, value in expected.items()):
        raise ValueError(f"Video contract failed: {path}")
    if audio["codec_name"] != "aac" or audio["channels"] != 2:
        raise ValueError(f"Audio contract failed: {path}")
    if any(abs(float(s["duration"]) - 20) > 0.001 for s in [video, audio, data["format"]]):
        raise ValueError(f"Duration contract failed: {path}")
    raw = path.read_bytes()
    if not 0 < raw.find(b"moov") < raw.find(b"mdat"):
        raise ValueError(f"Fast-start metadata missing: {path}")
    return {**expected, "seconds": 20, "audio_codec": audio["codec_name"],
            "audio_channels": audio["channels"], "audio_sample_rate": audio["sample_rate"]}


def audio_hash(path):
    return render.run([render.FFMPEG, "-v", "error", "-i", path, "-map", "0:a:0", "-f", "hash", "-hash", "sha256", "-"]).strip()


def compare_frames(current, baseline, language, report_dir):
    # Include frame zero, entrances, settled scenes, action, both sides of cuts and the final frame.
    frames = [0, 1, 45, 89, 105, 156, 195, 263, 270, 299, 300, 315, 390, 479, 480, 495, 540, 599]
    select = "+".join(f"eq(n,{n})" for n in frames)
    filename = f"ssim-{language}.log"
    filters = f"select='{select}',setpts=N/30/TB"
    render.run([render.FFMPEG, "-v", "error", "-i", current, "-i", baseline,
                "-filter_complex", f"[0:v]{filters}[a];[1:v]{filters}[b];[a][b]ssim=stats_file={filename}",
                "-an", "-f", "null", "-"], cwd=report_dir)
    values = [float(v) for v in re.findall(r"All:([\d.]+)", (report_dir / filename).read_text())]
    if len(values) != len(frames):
        raise ValueError(f"Incomplete visual comparison: {language} ({len(values)} frames)")
    if min(values) < 0.995:
        raise ValueError(f"Material visual difference requires review: {language}, minimum frame SSIM={min(values)}")
    return {"frames": frames, "minimumSsim": min(values), "meanSsim": sum(values) / len(values)}


def validate(language, output, baseline, report_dir):
    paths = {ext: output / f"soundwise-{language}.{ext}" for ext in ["mp4", "jpg", "txt"]}
    if not all(p.is_file() and p.stat().st_size for p in paths.values()):
        raise ValueError(f"Missing or empty output: {language}")
    if paths["txt"].read_text() != transcript(language):
        raise ValueError(f"Transcript differs from source: {language}")
    result = {"language": language, "properties": media_contract(paths["mp4"]),
              "sha256": {ext: sha256(p) for ext, p in paths.items()}}
    poster = probe(paths["jpg"])["streams"][0]
    if (poster["width"], poster["height"]) != (1920, 1080):
        raise ValueError(f"Invalid poster size: {language}")
    approved = render.BASE / "assets/audio/mastered.m4a"
    if audio_hash(paths["mp4"]) != audio_hash(approved):
        raise ValueError(f"Approved soundtrack changed: {language}")
    result["approvedAudioMatches"] = True
    old = baseline / paths["mp4"].name
    if old.is_file():
        if media_contract(old) != result["properties"] or audio_hash(paths["mp4"]) != audio_hash(old):
            raise ValueError(f"Published media/audio properties changed: {language}")
        result["publishedHashesMatch"] = {ext: sha256(p) == sha256(baseline / p.name) for ext, p in paths.items()}
        if not result["publishedHashesMatch"]["txt"]:
            raise ValueError(f"Published transcript drift: {language}")
        # Video encoding/metadata can differ, so compare decoded frames even if its hash changes.
        result["visualComparison"] = compare_frames(paths["mp4"], old, language, report_dir)
    else:
        result["publishedBaseline"] = "none (unpublished draft)"
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=render.HERE / ".generated")
    parser.add_argument("--baseline", type=Path, default=render.HERE.parent / "public/videos")
    parser.add_argument("--locale", action="append")
    parser.add_argument("--report", type=Path)
    args = parser.parse_args()
    locales = render.configure()
    codes = args.locale or [item["language"] for item in locales]
    if len(codes) != len(set(codes)) or not set(codes) <= set(render.DIRECTIONS):
        parser.error("Choose distinct supported video languages")
    report = (args.report or args.output / "verification.json").resolve()
    report.parent.mkdir(parents=True, exist_ok=True)
    results = [validate(code, args.output.resolve(), args.baseline.resolve(), report.parent) for code in codes]
    report.write_text(json.dumps({"status": "passed", "results": results}, ensure_ascii=False, indent=2) + "\n")
    print(f"Validated {len(results)} variants; report: {report}")


if __name__ == "__main__":
    main()
