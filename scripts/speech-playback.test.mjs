import assert from 'node:assert/strict';
import test from 'node:test';
import { installWordAudio } from './fake-word-audio.mjs';
import {
  speakWord, cancelSpeechPlayback, SPEECH_PLAYBACK_TIMEOUT_MS,
} from '../src/speech-playback.js';

test('starts the recorded word in the tap and waits for media completion', async (t) => {
  const { attempts } = installWordAudio(t);
  const playback = speakWord('Ship');
  assert.equal(attempts.length, 1);
  const [attempt] = attempts;
  assert.equal(attempt.player.src, '/audio/words/ship.m4a');

  let settled = false;
  playback.then(() => { settled = true; });
  attempt.onstart();
  await Promise.resolve();
  assert.equal(settled, false);
  attempt.onend();
  assert.equal(await playback, true);

  const replay = speakWord('sheep');
  assert.equal(attempts[1].player, attempt.player);
  assert.equal(attempts[1].player.src, '/audio/words/sheep.m4a');
  attempts[1].onstart();
  attempts[1].onend();
  assert.equal(await replay, true);
});

test('a superseded media event cannot finish the active word', async (t) => {
  const { attempts, pauses } = installWordAudio(t);
  const initial = speakWord('ship');
  const [first] = attempts;
  const retry = speakWord('sheep');
  assert.equal(await initial, false);
  assert.equal(pauses.count, 1);
  const active = attempts[1];
  assert.equal(active.player, first.player);

  first.onstart();
  first.onend();
  first.onerror();
  active.player.onended(); // Queued on the reused element, which has yet to end.
  await Promise.resolve();
  assert.equal(typeof active.player.onended, 'function');
  active.onstart();
  active.onend();
  assert.equal(await retry, true);
});

test('media errors, rejected play, missing start and a hang fail closed', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const { attempts, pauses } = installWordAudio(t);
  Object.defineProperty(globalThis.window, 'speechSynthesis', {
    get() { assert.fail('Exercise playback must not use live speech'); },
  });

  const rejected = speakWord('ship');
  attempts.at(-1).reject(new DOMException('No gesture', 'NotAllowedError'));
  assert.equal(await rejected, false);

  const missing = speakWord('ship');
  attempts.at(-1).onerror();
  assert.equal(await missing, false);

  const endedEarly = speakWord('ship');
  attempts.at(-1).onend();
  assert.equal(await endedEarly, false);

  const hung = speakWord('sheep');
  t.mock.timers.tick(SPEECH_PLAYBACK_TIMEOUT_MS);
  assert.equal(await hung, false);
  assert.equal(pauses.count, 1);

  const retry = speakWord('sheep');
  attempts.at(-1).onstart();
  attempts.at(-1).onend();
  assert.equal(await retry, true);
  cancelSpeechPlayback();
});
