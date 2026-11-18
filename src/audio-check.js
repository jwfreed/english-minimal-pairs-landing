import { speakWord, setSpeechDiagnosticListener } from './speech-playback.js';

const synthesis = window.speechSynthesis;
const report = document.getElementById('report');
const status = document.getElementById('status');
const voiceSelect = document.getElementById('voice');
const records = [];
const started = performance.now();
let activeUtterance = null;
let attempt = 0;

function voices() {
  return allVoices().filter((voice) => /^en(-|$)/i.test(voice.lang));
}

function allVoices() {
  try { return synthesis?.getVoices?.() ?? []; }
  catch { return []; }
}

function sessionState() {
  try { return { sessionType: navigator.audioSession?.type, sessionState: navigator.audioSession?.state }; }
  catch (error) { return { sessionError: error.name }; }
}

function record(event, detail = {}) {
  records.push({ ms: Math.round(performance.now() - started), attempt, event, ...detail,
    speaking: synthesis?.speaking, pending: synthesis?.pending, paused: synthesis?.paused,
    ...sessionState(),
    userActivation: navigator.userActivation?.isActive, visibility: document.visibilityState,
    plainActive: Boolean(activeUtterance) });
  if (records.length > 200) records.shift();
  report.value = JSON.stringify({ build: import.meta.env.DEV ? 'audio-check-dev' : 'audio-check-v2', browser: navigator.userAgent,
    platform: navigator.platform, voiceCount: allVoices().length,
    englishVoices: voices().map(({ name, lang, localService }) => ({ name, lang, localService })), records }, null, 2);
}

function refreshVoices() {
  const selected = voiceSelect.value;
  voiceSelect.replaceChildren(new Option('Browser default English voice', ''));
  voices().forEach((voice) => voiceSelect.add(new Option(`${voice.name} (${voice.lang})`, voice.voiceURI)));
  voiceSelect.value = selected;
  if (voiceSelect.selectedIndex < 0) voiceSelect.selectedIndex = 0;
  record('voices');
}

// Standalone probe deliberately bypasses exercise state and its voice policy.
// Retain the utterance and bound failures, without retrying or inferring sound.
function plainSpeech() {
  return new Promise((resolve) => {
    let settled = false;
    let began = false;
    let timer;
    const finish = (reason) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      activeUtterance = null;
      record('plain-settled', { reason, began });
      resolve();
    };
    try {
      if (!synthesis) throw new Error('Speech synthesis unavailable');
      const requested = document.getElementById('session').value;
      if (navigator.audioSession) navigator.audioSession.type = requested;
      record('plain-session', { requested });
      const utterance = new SpeechSynthesisUtterance('ship');
      activeUtterance = utterance;
      utterance.lang = 'en-US';
      const voice = voices().find((entry) => entry.voiceURI === voiceSelect.value);
      if (voice) utterance.voice = voice;
      record('plain-submit', { selectedVoice: voice?.name ?? 'browser default', lang: utterance.lang });
      utterance.onstart = () => { if (!settled) { began = true; record('plain-start'); } };
      utterance.onend = () => finish('end');
      utterance.onerror = (event) => { record('plain-error', { error: event.error }); finish('error'); };
      timer = setTimeout(() => { finish('timeout'); synthesis.cancel(); }, 6000);
      synthesis.speak(utterance);
    } catch (error) {
      record('plain-exception', { name: error.name, message: error.message });
      finish('exception');
    }
  });
}

// A generated PCM WAV needs no external service, download, or media permission.
const samples = 8820;
const wav = new ArrayBuffer(44 + samples * 2);
const view = new DataView(wav);
function writeText(offset, text) { [...text].forEach((letter, index) => view.setUint8(offset + index, letter.charCodeAt(0))); }
writeText(0, 'RIFF'); view.setUint32(4, wav.byteLength - 8, true); writeText(8, 'WAVEfmt ');
view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
view.setUint32(24, 22050, true); view.setUint32(28, 44100, true); view.setUint16(32, 2, true);
view.setUint16(34, 16, true); writeText(36, 'data'); view.setUint32(40, samples * 2, true);
for (let i = 0; i < samples; i += 1) view.setInt16(44 + i * 2, Math.sin(i * 2 * Math.PI * 440 / 22050) * 4000, true);
const tone = new Audio(URL.createObjectURL(new Blob([wav], { type: 'audio/wav' })));
for (const name of ['playing', 'ended', 'error', 'waiting', 'stalled']) {
  tone.addEventListener(name, () => record(`tone-${name}`, { error: tone.error?.code }));
}

setSpeechDiagnosticListener(record);
synthesis?.addEventListener('voiceschanged', refreshVoices);
try { navigator.audioSession?.addEventListener('statechange', () => record('session-change')); }
catch (error) { record('session-observer-error', { name: error.name }); }
document.addEventListener('visibilitychange', () => record('visibility-change'));
refreshVoices();

document.querySelectorAll('[data-test]').forEach((button) => {
  button.addEventListener('click', async () => {
    document.querySelectorAll('[data-test]').forEach((element) => { element.disabled = true; });
    attempt += 1;
    record('test', { probe: button.dataset.test });
    status.textContent = 'Test running. Wait, then report whether you heard it.';
    try {
      if (button.dataset.test === 'plain') await plainSpeech();
      else if (button.dataset.test === 'exercise') record('exercise-result', { didPlay: await speakWord('ship') });
      else {
        tone.currentTime = 0;
        await new Promise((resolve, reject) => {
          const timer = setTimeout(() => { tone.pause(); reject(new Error('Media timeout')); }, 6000);
          tone.onended = () => { clearTimeout(timer); resolve(); };
          tone.onerror = () => { clearTimeout(timer); reject(new Error(`Media error ${tone.error?.code}`)); };
          tone.play().catch((error) => { clearTimeout(timer); reject(error); });
        });
      }
    } catch (error) { record('test-error', { name: error.name, message: error.message }); }
    status.textContent = 'Test finished. Choose Heard it or Silent for that test.';
    document.querySelectorAll('[data-test]').forEach((element) => { element.disabled = false; });
  });
});
document.querySelectorAll('[data-outcome]').forEach((button) => {
  button.addEventListener('click', () => record('listener-report', { probe: button.dataset.probe, outcome: button.dataset.outcome }));
});
document.getElementById('copy').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(report.value); status.textContent = 'Report copied. Paste it into our conversation.'; }
  catch { report.focus(); report.select(); status.textContent = 'Select and copy the report below.'; }
});
