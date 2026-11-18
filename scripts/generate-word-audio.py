"""Generate the static English exercise clips with Piper 1.8.0 and afconvert."""

import argparse
import hashlib
import json
import subprocess
import tempfile
import wave
from dataclasses import replace
from importlib.metadata import version
from pathlib import Path

import numpy as np
import onnxruntime
from piper import PiperVoice

MODEL_REVISION = "0ca208afc2a2ee102b1e961e72e0a7e4907be3d0"
MODEL_SHA256 = "6f52a751e2349abe7a76735eb09dc1875298c77ea2342ffd2fef79ff81b87f22"
CONFIG_SHA256 = "141d612cc0a95ed7efc1ca936b845c2364967f2e9217c5dbfcf69fc4d6c65860"


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def match_level(path):
    with wave.open(str(path), "rb") as wav:
        params = wav.getparams()
        assert params.nchannels == 1 and params.sampwidth == 2
        samples = np.frombuffer(wav.readframes(params.nframes), dtype="<i2").astype(float)
    peak = np.max(np.abs(samples))
    rms = np.sqrt(np.mean(samples ** 2))
    if not rms:
        raise ValueError("Synthesis produced a silent clip")
    gain = min(32768 * 0.1 / rms, 32768 * 0.88 / peak)
    with wave.open(str(path), "wb") as wav:
        wav.setparams(params)
        wav.writeframes(np.rint(samples * gain).astype("<i2").tobytes())


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("model", type=Path, help="Path to en_US-ljspeech-medium.onnx")
    parser.add_argument("output", type=Path, help="Directory for the AAC clips and manifest")
    args = parser.parse_args()
    if sha256(args.model) != MODEL_SHA256 or sha256(Path(f"{args.model}.json")) != CONFIG_SHA256:
        parser.error("Model and config must match the pinned LJ Speech voice files")
    if version("piper-tts") != "1.8.0" or onnxruntime.__version__ != "1.23.2":
        parser.error("Use Piper 1.8.0 and ONNX Runtime 1.23.2")

    root = Path(__file__).resolve().parents[1]
    words = json.loads(subprocess.check_output(["node", "--input-type=module", "-e", """
      import { CONTRAST_CATALOG } from './src/contrast-catalog.js';
      const words = Object.values(CONTRAST_CATALOG).flatMap(({ words }) => words);
      console.log(JSON.stringify(Object.fromEntries(words.map(({ text, ipa }) => [text, ipa]))));
    """], cwd=root))
    onnxruntime.set_seed(20261118)
    voice = PiperVoice.load(args.model)
    voice.config = replace(voice.config, espeak_voice="en-us")
    args.output.mkdir(parents=True, exist_ok=True)
    manifest = {"model": "en_US-ljspeech-medium", "revision": MODEL_REVISION, "clips": {}}
    with tempfile.TemporaryDirectory() as tmp:
        for word, ipa in sorted(words.items()):
            # The exercise uses the verb, which rhymes with “give”.
            text = "[[lˈɪv]]" if word == "live" else word
            phonemes = "".join(phoneme for sentence in voice.phonemize(text) for phoneme in sentence)
            if not phonemes or set(phonemes).difference(voice.config.phoneme_id_map):
                raise ValueError(f"Unsupported phonemes for {word}: {phonemes}")
            path = Path(tmp) / f"{word}.wav"
            with wave.open(str(path), "wb") as wav:
                voice.synthesize_wav(text, wav)
            match_level(path)
            target = args.output / f"{word}.m4a"
            subprocess.run([
                "afconvert", "-f", "m4af", "-d", "aac", "-b", "48000",
                str(path), str(target),
            ], check=True)
            manifest["clips"][word] = {
                "ipa": ipa,
                "piperPhonemes": phonemes,
                "sha256": sha256(target),
            }
    (args.output / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    print(f"Generated {len(words)} word clips")


if __name__ == "__main__":
    main()
