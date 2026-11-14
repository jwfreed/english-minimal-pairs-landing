import assert from 'node:assert/strict';
import test from 'node:test';
import {
  speakWord, cancelSpeechPlayback, setSpeechDiagnosticListener, SPEECH_PLAYBACK_TIMEOUT_MS,
} from '../src/speech-playback.js';

function installSpeech(t) {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const originalWindow = globalThis.window;
  const originalUtterance = globalThis.SpeechSynthesisUtterance;
  const utterances = [];
  const records = [];
  const synthesis = {
    voices: [],
    cancelCount: 0,
    getVoices() { return this.voices; },
    speak(utterance) { utterances.push(utterance); },
    cancel() { this.cancelCount += 1; },
  };
  globalThis.window = { speechSynthesis: synthesis };
  globalThis.SpeechSynthesisUtterance = class {
    constructor(text) { this.text = text; }
  };
  setSpeechDiagnosticListener((event, detail) => records.push({ event, ...detail }));
  t.after(() => {
    cancelSpeechPlayback();
    setSpeechDiagnosticListener(null);
    globalThis.window = originalWindow;
    globalThis.SpeechSynthesisUtterance = originalUtterance;
  });
  return { synthesis, utterances, records };
}

const endNormally = (utterance) => { utterance.onstart(); utterance.onend(); };

test('empty voices uses the language default immediately without cancelling idle synthesis', async (t) => {
  const { utterances, synthesis } = installSpeech(t);
  const playback = speakWord('ship');
  assert.equal(utterances.length, 1);
  assert.equal(utterances[0].voice, undefined);
  assert.equal(utterances[0].lang, 'en-US');
  assert.equal(synthesis.cancelCount, 0);
  endNormally(utterances[0]);
  assert.equal(await playback, true);
});

test('voices arriving after initialization are selected on a deliberate retry, never auto-spoken', async (t) => {
  const { utterances, synthesis } = installSpeech(t);
  const first = speakWord('ship');
  utterances[0].onerror({ error: 'voice-unavailable' });
  assert.equal(await first, false);
  // Simulate the new list exposed by delayed voiceschanged. The player neither
  // caches old voices nor starts speech from this asynchronous notification.
  const english = { name: 'English', lang: 'en-GB' };
  synthesis.voices = [english];
  assert.equal(utterances.length, 1);
  const retry = speakWord('ship');
  assert.equal(utterances[1].voice, english);
  endNormally(utterances[1]);
  assert.equal(await retry, true);
  synthesis.voices = [{ name: 'French', lang: 'fr-FR' }];
  const removedVoice = speakWord('sheep');
  assert.equal(utterances[2].voice, undefined);
  assert.equal(utterances[2].lang, 'en-US');
  endNormally(utterances[2]);
  assert.equal(await removedVoice, true);
});

for (const sequence of [
  ['error'], ['end'], ['end', 'start'], ['error', 'start', 'end'], ['start', 'error', 'end'],
]) {
  test(`callback order ${sequence.join(' → ')} cannot report successful playback`, async (t) => {
    const { utterances } = installSpeech(t);
    const playback = speakWord('ship');
    for (const event of sequence) utterances[0][`on${event}`]({ error: 'interrupted' });
    assert.equal(await playback, false);
  });
}

test('synchronous start/end settles once and clears the watchdog before a later word', async (t) => {
  const { synthesis, utterances, records } = installSpeech(t);
  synthesis.speak = endNormally;
  assert.equal(await speakWord('ship'), true);
  assert.equal(records.filter(({ event }) => event === 'settled').length, 1);
  synthesis.speak = (utterance) => utterances.push(utterance);
  const next = speakWord('sheep', null, { timeoutMs: 10000 });
  t.mock.timers.tick(SPEECH_PLAYBACK_TIMEOUT_MS);
  assert.equal(synthesis.cancelCount, 0);
  endNormally(utterances[0]);
  assert.equal(await next, true);
});

for (const starts of [false, true]) {
  test(`watchdog fails closed with ${starts ? 'a start but no end' : 'no callbacks'} and retry ignores stale events`, async (t) => {
    const { utterances, synthesis, records } = installSpeech(t);
    const first = speakWord('ship');
    if (starts) utterances[0].onstart();
    t.mock.timers.tick(SPEECH_PLAYBACK_TIMEOUT_MS);
    assert.equal(await first, false);
    assert.equal(synthesis.cancelCount, 1);
    assert.equal(records.at(-1).reason, 'timeout');
    const retry = speakWord('sheep');
    utterances[0].onstart();
    utterances[0].onend();
    utterances[0].onerror();
    assert.equal(records.filter(({ event }) => event === 'settled').length, 1);
    endNormally(utterances[1]);
    assert.equal(await retry, true);
  });
}

test('cancel settles before synchronous late callbacks and cannot masquerade as success', async (t) => {
  const { utterances, synthesis } = installSpeech(t);
  const first = speakWord('ship');
  utterances[0].onstart();
  synthesis.cancel = () => utterances[0].onend();
  cancelSpeechPlayback({ didPlay: true }); // Old callers cannot upgrade cancellation.
  assert.equal(await first, false);
  const retry = speakWord('sheep');
  endNormally(utterances[1]);
  assert.equal(await retry, true);
});

for (const operation of ['getVoices', 'speak']) {
  test(`a thrown ${operation} fails closed and leaves retry usable`, async (t) => {
    const { synthesis, utterances } = installSpeech(t);
    const original = synthesis[operation];
    synthesis[operation] = () => { throw new Error('unavailable'); };
    assert.equal(await speakWord('ship'), false);
    synthesis[operation] = original;
    const retry = speakWord('ship');
    endNormally(utterances[0]);
    assert.equal(await retry, true);
  });
}

test('paused synthesis times out without resume loops or duplicate submissions', async (t) => {
  const { synthesis, utterances } = installSpeech(t);
  synthesis.paused = true;
  synthesis.resume = () => assert.fail('No speculative resume');
  const playback = speakWord('ship');
  t.mock.timers.tick(SPEECH_PLAYBACK_TIMEOUT_MS);
  assert.equal(await playback, false);
  assert.equal(utterances.length, 1);
});

test('a browser rejecting an incompatible explicit voice fails closed; retry can use the language default', async (t) => {
  const { synthesis, utterances, records } = installSpeech(t);
  globalThis.SpeechSynthesisUtterance = class {
    set voice(_voice) { throw new TypeError('Voice unavailable'); }
  };
  synthesis.voices = [{ name: 'Unavailable English', lang: 'en-US' }];
  assert.equal(await speakWord('ship'), false);
  assert.equal(utterances.length, 0);
  assert.ok(records.some(({ event, error }) => event === 'exception' && error === 'TypeError'));
  synthesis.voices = [];
  const retry = speakWord('ship');
  endNormally(utterances[0]);
  assert.equal(await retry, true);
});
