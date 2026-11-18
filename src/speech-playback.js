// Call synchronously from the learner's tap to preserve media activation.
export const SPEECH_PLAYBACK_TIMEOUT_MS = 6000;

let activePlayback = null;
let clipPlayer = null;
let sequence = 0;
let diagnosticListener = null;

export function setSpeechDiagnosticListener(listener) {
  diagnosticListener = listener;
}

function diagnose(event, detail = {}) {
  diagnosticListener?.(event, detail);
}

export function wordClipUrl(text) {
  return `/audio/words/${encodeURIComponent(text.toLowerCase())}.m4a`;
}

function setButtonBusy(button, busy, automaticReplay) {
  button?.classList.toggle('is-playing', busy);
  button?.classList.toggle('is-auto-playing', busy && automaticReplay);
  button?.setAttribute('aria-busy', String(busy));
}

export function cancelSpeechPlayback() {
  const playback = activePlayback;
  if (!playback) return;

  // Settle the cancelled attempt before pausing the element.
  playback.complete(false, 'cancelled');
  playback.player.pause();
}

export function speakWord(text, activeButton, {
  automaticReplay = false,
  timeoutMs = SPEECH_PLAYBACK_TIMEOUT_MS,
} = {}) {
  if (typeof window.Audio !== 'function') {
    diagnose('unavailable');
    return Promise.resolve(false);
  }

  cancelSpeechPlayback();
  try {
    // Reuse the first element for automatic contrast replay on iOS.
    if (!(clipPlayer instanceof window.Audio)) clipPlayer = new window.Audio();
  } catch (error) {
    diagnose('exception', { error: error.name });
    return Promise.resolve(false);
  }

  const player = clipPlayer;
  const id = ++sequence;
  const clip = wordClipUrl(text);
  return new Promise((resolve) => {
    let started = false;
    let settled = false;
    let watchdog;
    const complete = (didPlay, reason) => {
      if (settled) return;
      settled = true;
      clearTimeout(watchdog);
      player.onended = null;
      player.onerror = null;
      activePlayback = null;
      setButtonBusy(activeButton, false, automaticReplay);
      diagnose('settled', { id, didPlay, reason });
      resolve(didPlay);
    };

    activePlayback = { player, complete };
    player.onended = () => {
      // An event queued for the preceding source can reach this handler.
      if (settled || !player.ended) return;
      diagnose('end', { id });
      complete(started, started ? 'ended' : 'end-without-start');
    };
    player.onerror = () => {
      if (settled || !player.error) return;
      diagnose('error', { id, error: player.error.code });
      complete(false, 'error');
    };

    setButtonBusy(activeButton, true, automaticReplay);
    watchdog = setTimeout(() => {
      complete(false, 'timeout');
      player.pause();
    }, timeoutMs);

    try {
      if (!player.error && player.src.endsWith(clip)) player.currentTime = 0;
      else player.src = clip;
      diagnose('submit', { id, clip });
      // Only this attempt's promise can mark its playback as started.
      player.play().then(
        () => {
          if (settled) return;
          started = true;
          diagnose('start', { id });
        },
        (error) => {
          if (settled) return;
          diagnose('error', { id, error: error.name });
          complete(false, 'error');
        },
      );
    } catch (error) {
      diagnose('exception', { id, error: error.name });
      complete(false, 'exception');
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
