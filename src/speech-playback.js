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
        setButtonBusy(activeButton, false, automaticReplay);
      }
      diagnose('settled', { id, didPlay, reason });
      resolve(didPlay);
    };

    try {
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
