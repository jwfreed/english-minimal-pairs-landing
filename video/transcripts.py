"""Transcript generation from the editable composition/copy, with no app imports."""
from html.parser import HTMLParser
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent


class PlainText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []

    def handle_starttag(self, tag, attrs):
        if tag == "br":
            self.parts.append(" ")

    def handle_data(self, data):
        self.parts.append(data)


def element_text(source, tag, attribute, value):
    for match in re.finditer(rf'<{tag}\b([^>]*)>(.*?)</{tag}>', source, re.S):
        attrs = dict(re.findall(r'([\w-]+)="([^"]*)"', match[1]))
        if value not in attrs.get(attribute, "").split():
            continue
        parser = PlainText()
        parser.feed(match[2])
        text = re.sub(r"\s+", " ", "".join(parser.parts)).strip()
        if text:
            return text
    raise ValueError(f"Missing {tag}[{attribute}={value}] in English composition")


def english_text():
    scenes = {name: (ROOT / f"composition/compositions/{name}.html").read_text()
              for name in ["hook", "practice", "feedback", "outro"]}
    text = {}
    for key, scene, tag, attr, value in [
        ("hook", "hook", "p", "id", "hook-line"),
        ("headline", "practice", "h1", "class", "headline"),
        ("trainEar", "practice", "p", "class", "support"),
        ("practiceLabel", "practice", "h2", "class", "practice-heading"),
        ("contrastTitle", "practice", "p", "class", "contrast"),
        ("listenInstruction", "practice", "p", "class", "instruction"),
        ("playWord", "practice", "span", "class", "practice-ready"),
        ("answerQuestion", "practice", "p", "class", "prompt"),
        ("hearDifference", "feedback", "h1", "class", "headline"),
        ("correctFeedback", "feedback", "p", "class", "feedback-title"),
        ("compareWords", "feedback", "p", "class", "compare-title"),
        ("noMicrophone", "outro", "p", "id", "outro-note"),
    ]:
        text[key] = element_text(scenes[scene], tag, attr, value)
    # The listening div has no nested div, unlike its containing play control.
    match = re.search(r'<div\b[^>]*id="practice-listening"[^>]*>(.*?)</div>', scenes["practice"], re.S)
    if not match:
        raise ValueError("Missing English listening state")
    text["listening"] = match[1]
    return text


def transcript(language):
    pack = json.loads((ROOT / "copy/video-copy.json").read_text())
    descriptions = json.loads((ROOT / "copy/descriptions.json").read_text())
    shared = pack["shared"]
    forward = f'{shared["word2"]} {shared["ipa2"]} · {shared["word1"]} {shared["ipa1"]}'
    answers = f'{shared["word1"]} {shared["ipa1"]} · {shared["word2"]} {shared["ipa2"]}'
    brand = shared["brand"]
    if language == "en":
        t = english_text()
        # Preserve the published transcript's sentence punctuation; the card omits this period.
        t["compareWords"] = t["compareWords"].rstrip(".") + "."
        blocks = [brand, t["hook"] + "\n" + forward,
                  t["headline"] + "\n" + t["trainEar"],
                  "\n".join([t[k] for k in ["practiceLabel", "contrastTitle", "listenInstruction", "playWord", "listening", "answerQuestion"]] + [answers]),
                  "\n".join([t[k] for k in ["hearDifference", "correctFeedback", "compareWords"]] + [answers]),
                  "\n".join([brand, t["trainEar"], t["noMicrophone"]])]
    else:
        t = pack["locales"][language]["text"]
        blocks = [brand, t["hook"], forward, t["listen"] + " " + t["choose"], t["trainEar"],
                  *[t[k] for k in ["practiceLabel", "contrastTitle", "listenInstruction", "playWord", "listening", "answerQuestion"]],
                  answers, *[t[k] for k in ["hearDifference", "correctFeedback", "compareWords"]],
                  answers, brand, t["trainEar"], t["noMicrophone"]]
    return descriptions[language] + "\n\n" + "\n\n".join(blocks) + "\n"
