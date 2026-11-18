import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import { CONTRAST_CATALOG } from '../src/contrast-catalog.js';
import { HERO_DEMO_CONTRASTS } from '../src/hero-demo-config.js';
import { wordClipUrl } from '../src/speech-playback.js';

const directory = new URL('../public/audio/words/', import.meta.url);
const manifest = JSON.parse(readFileSync(new URL('manifest.json', directory), 'utf8'));

test('every exercise stimulus maps to exactly one manifest-verified media asset', () => {
  const words = new Map(
    [...Object.values(CONTRAST_CATALOG), ...Object.values(HERO_DEMO_CONTRASTS)]
      .flatMap(({ words }) => words.map(({ text, ipa }) => [text, ipa])),
  );
  assert.deepEqual(Object.keys(manifest.clips).sort(), [...words.keys()].sort());
  assert.deepEqual(
    readdirSync(directory).filter((name) => name.endsWith('.m4a')).sort(),
    [...words.keys()].map((word) => `${word}.m4a`).sort(),
  );
  for (const [word, ipa] of words) {
    const clip = readFileSync(new URL(`../public${wordClipUrl(word)}`, import.meta.url));
    assert.equal(clip.subarray(4, 8).toString(), 'ftyp', word);
    assert.equal(createHash('sha256').update(clip).digest('hex'), manifest.clips[word].sha256, word);
    assert.equal(manifest.clips[word].ipa, ipa, word);
  }
  assert.equal(manifest.clips.bad.piperPhonemes, 'bˈad');
  assert.equal(manifest.clips.live.piperPhonemes, 'lˈɪv');
});
