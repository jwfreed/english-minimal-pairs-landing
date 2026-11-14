export function setupSpeechDiagnostics(setListener) {
  const synthesis = window.speechSynthesis;
  const records = [];
  const startedAt = performance.now();
  const state = () => ({
    speaking: synthesis?.speaking,
    pending: synthesis?.pending,
    paused: synthesis?.paused,
    userActivation: navigator.userActivation?.isActive,
    visibility: document.visibilityState,
  });
  const snapshot = () => {
    const voices = synthesis?.getVoices?.() ?? [];
    return {
      browser: navigator.userAgent,
      platform: navigator.platform,
      voiceCount: voices.length,
      englishVoices: voices.filter((voice) => /^en(-|$)/i.test(voice.lang))
        .map(({ name, lang, localService, default: isDefault }) => (
          { name, lang, localService, default: isDefault }
        )),
      state: state(),
      records: [...records],
    };
  };
  const panel = document.createElement('details');
  const label = document.createElement('summary');
  const output = document.createElement('pre');
  label.textContent = 'Speech diagnostics (local, development only)';
  output.style.cssText = 'white-space:pre-wrap;overflow-wrap:anywhere;max-height:60vh;overflow:auto';
  panel.append(label, output);
  const render = () => { output.textContent = JSON.stringify(snapshot(), null, 2); };
  const record = (event, detail = {}) => {
    records.push({ ms: Math.round(performance.now() - startedAt), event, ...detail, ...state() });
    if (records.length > 200) records.shift();
    render();
  };
  setListener(record);
  synthesis?.addEventListener('voiceschanged', () => record('voiceschanged', {
    voiceCount: synthesis.getVoices().length,
  }));
  document.addEventListener('visibilitychange', () => record('visibilitychange'));
  panel.addEventListener('toggle', render);
  window.soundwiseSpeechDiagnostics = { snapshot, clear: () => { records.length = 0; render(); } };
  const mount = () => { document.body.append(panel); record('ready'); };
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount, { once: true });
}
