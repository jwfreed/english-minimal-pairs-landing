import { cancelSpeechPlayback } from '../src/speech-playback.js';

// Each play request has a promise and a snapshot of its event handlers.
// Tests can finish, reject or stall that attempt after the player is reused.
export function fakeWordAudio({ onPlay, onPause } = {}) {
  return class FakeAudio {
    src = '';
    currentTime = 0;
    ended = false;
    error = null;

    play() {
      this.ended = false;
      this.error = null;
      const ended = this.onended;
      const failed = this.onerror;
      return new Promise((resolve, reject) => {
        const attempt = {
          player: this,
          text: decodeURIComponent(this.src.split('/').at(-1).replace(/\.m4a$/, '')),
          onstart: resolve,
          reject,
          onend: () => queueMicrotask(() => {
            if (this.attempt === attempt) this.ended = true;
            ended?.();
          }),
          onerror: () => queueMicrotask(() => {
            if (this.attempt === attempt) this.error = { code: 4 };
            failed?.();
          }),
        };
        this.attempt = attempt;
        onPlay?.(attempt);
      });
    }

    pause() {
      onPause?.();
    }
  };
}

export function installWordAudio(t) {
  const originalWindow = globalThis.window;
  const attempts = [];
  const pauses = { count: 0 };
  globalThis.window = {
    Audio: fakeWordAudio({
      onPlay: (attempt) => attempts.push(attempt),
      onPause: () => { pauses.count += 1; },
    }),
  };
  t.after(() => {
    cancelSpeechPlayback();
    globalThis.window = originalWindow;
  });
  return { attempts, pauses };
}
