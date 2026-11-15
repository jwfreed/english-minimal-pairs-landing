// Call speakWord synchronously from a tap. Do not await voice loading: iOS
// speech initialization can require the original user gesture.
export const SPEECH_PLAYBACK_TIMEOUT_MS = 6000;

let activePlayback = null;
let sequence = 0;
let diagnosticListener = null;

export function setSpeechDiagnosticListener(listener) {
  diagnosticListener = listener;
}

function diagnose(event, detail = {}) {
  diagnosticListener?.(event, detail);
}

// iOS mutes speech in Silent Mode unless page media is playing: WebKit derives
// the page's playback audio category from active media elements, not from
// speechSynthesis or the audioSession preference alone. Loop silence during
// speech so the category ignores the ringer switch. Reuse one element so later
// automatic replays keep the activation granted by the first tap.
let mediaKeepalive = null;

function silentWavUrl() {
  const samples = 4000; // 0.5 s of 8-bit 8 kHz mono silence (midpoint 128).
  const bytes = new Uint8Array(44 + samples).fill(128, 44);
  const view = new DataView(bytes.buffer);
  const text = (offset, value) => [...value].forEach((c, i) => view.setUint8(offset + i, c.charCodeAt(0)));
  text(0, 'RIFF'); view.setUint32(4, 36 + samples, true); text(8, 'WAVEfmt ');
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, 8000, true); view.setUint32(28, 8000, true);
  view.setUint16(32, 1, true); view.setUint16(34, 8, true);
  text(36, 'data'); view.setUint32(40, samples, true);
  return URL.createObjectURL(new Blob([bytes], { type: 'audio/wav' }));
}

function startMediaKeepalive(id) {
  try {
    if (typeof window.Audio !== 'function') return;
    if (!mediaKeepalive) {
      mediaKeepalive = new window.Audio(silentWavUrl());
      mediaKeepalive.loop = true;
    }
    // Do not await: speech must be submitted in the same gesture stack.
    Promise.resolve(mediaKeepalive.play()).then(
      () => diagnose('media-keepalive', { id }),
      (error) => diagnose('media-keepalive-error', { id, error: error?.name || 'Error' }),
    );
  } catch (error) {
    // Media is a Silent Mode aid; its failure must not block speech.
    diagnose('media-keepalive-error', { id, error: error?.name || 'Error' });
  }
}

function stopMediaKeepalive() {
  try { mediaKeepalive?.pause(); } catch { /* best effort */ }
}

function setButtonBusy(button, busy, automaticReplay) {
  button?.classList.toggle('is-playing', busy);
  button?.classList.toggle('is-auto-playing', busy && automaticReplay);
  button?.setAttribute('aria-busy', String(busy));
}

export function cancelSpeechPlayback() {
  const synthesis = window.speechSynthesis;
  const playback = activePlayback;
  // Cancellation is never evidence of successful playback. Settle before
  // cancel(), which can synchronously deliver callbacks on some engines.
  playback?.complete(false, 'cancelled');
  if (playback || synthesis?.speaking || synthesis?.pending) {
    diagnose('cancel');
    synthesis?.cancel?.();
  }
}

function getEnglishVoice(voices) {
  return voices.find((voice) => voice.lang === 'en-US')
    || voices.find((voice) => voice.lang.startsWith('en-US'))
    || voices.find((voice) => voice.lang === 'en-GB')
    || voices.find((voice) => voice.lang.startsWith('en-GB'))
    || voices.find((voice) => /^en(-|$)/i.test(voice.lang))
    || null;
}

export function speakWord(text, activeButton, {
  automaticReplay = false,
  timeoutMs = SPEECH_PLAYBACK_TIMEOUT_MS,
} = {}) {
  const synthesis = window.speechSynthesis;
  if (!synthesis || typeof SpeechSynthesisUtterance === 'undefined') {
    diagnose('unavailable');
    return Promise.resolve(false);
  }

  cancelSpeechPlayback();
  const id = ++sequence;
  return new Promise((resolve) => {
    let started = false;
    let settled = false;
    let watchdog;
    const complete = (didPlay, reason) => {
      if (settled) return;
      settled = true;
      clearTimeout(watchdog);
      if (activePlayback?.id === id) {
        activePlayback = null;
        stopMediaKeepalive();
        setButtonBusy(activeButton, false, automaticReplay);
      }
      diagnose('settled', { id, didPlay, reason });
      resolve(didPlay);
    };

    try {
      // iOS Silent Mode can suppress speech despite successful callbacks.
      // Request intentional media playback at the tap, before speech starts.
      // The optional API is not available in every browser.
      try {
        const session = window.navigator?.audioSession;
        if (session) {
          if (session.type !== 'playback') session.type = 'playback';
          diagnose('audio-session', { id, type: session.type, state: session.state });
        }
      } catch (error) {
        // A rejected session preference must not break otherwise working TTS.
        diagnose('audio-session-error', { id, error: error?.name || 'Error' });
      }
      const utterance = new SpeechSynthesisUtterance(text);
      // Query each time; never retain a voice from an old voiceschanged list.
      const voices = synthesis.getVoices?.() ?? [];
      const voice = getEnglishVoice(voices);
      utterance.lang = voice?.lang || 'en-US';
      utterance.rate = 0.82;
      utterance.pitch = 1;
      utterance.volume = 1;
      diagnose('voice-selection', {
        id,
        voiceCount: voices.length,
        selectedVoice: voice ? { name: voice.name, lang: voice.lang } : null,
        lang: utterance.lang,
      });
      if (voice) utterance.voice = voice;

      // Keep the utterance alive until settlement, including on mobile engines.
      activePlayback = { id, utterance, complete };
      const callback = (event, detail = {}) => {
        diagnose(event, { id, stale: settled, ...detail });
        return !settled;
      };
      utterance.onstart = () => {
        if (callback('start')) started = true;
      };
      utterance.onend = () => {
        if (callback('end')) complete(started, started ? 'ended' : 'end-without-start');
      };
      utterance.onerror = (event) => {
        if (callback('error', { error: event?.error })) complete(false, 'error');
      };
      utterance.onpause = () => callback('pause');
      utterance.onresume = () => callback('resume');

      setButtonBusy(activeButton, true, automaticReplay);
      // Arm before speak(): synchronous callbacks must also clear this timer.
      watchdog = setTimeout(() => {
        complete(false, 'timeout');
        synthesis.cancel?.();
      }, timeoutMs);
      startMediaKeepalive(id);
      diagnose('submit', { id });
      synthesis.speak(utterance);
    } catch (error) {
      diagnose('exception', { id, error: error?.name || 'Error' });
      complete(false, 'exception');
      synthesis.cancel?.();
    }
  });
}

// Vite removes this branch and its module from release builds. No diagnostic
// information is sent to analytics or persisted. Opt in on the dev server only.
if (import.meta.env?.DEV && new URLSearchParams(window.location.search).has('speechDebug')) {
  import('./speech-diagnostics.js').then(({ setupSpeechDiagnostics }) => {
    setupSpeechDiagnostics(setSpeechDiagnosticListener);
  });
}
