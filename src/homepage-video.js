import { getRuntimeLocaleMeta } from './landing-copy-runtime.js';
import { getSeoPageLocale } from './app-store-attribution.js';

const initializedPlayers = new WeakSet();

export function setupHomepageVideo() {
  const video = document.getElementById('homepage-video');
  if (!video || initializedPlayers.has(video)) return;
  initializedPlayers.add(video);
  const sent = new Set();

  function track(eventName) {
    const language = video.getAttribute('lang');
    const key = `${language}:${eventName}`;
    if (sent.has(key) || typeof window.gtag !== 'function') return;
    if (eventName === 'video_complete' && !sent.has(`${language}:video_play`)) return;
    sent.add(key);
    window.gtag('event', eventName, {
      video_title: 'Soundwise homepage promo',
      video_language: language,
      video_duration: Math.round(video.duration),
      page_slug: 'homepage',
      locale: getSeoPageLocale(window.location.pathname, document.documentElement.lang),
      experience_surface: 'homepage',
      transport_type: 'beacon',
    });
  }

  video.addEventListener('playing', () => track('video_play'));
  video.addEventListener('ended', () => track('video_complete'));
  video.addEventListener('error', () => {
    const hadFocus = video.matches(':focus-within');
    video.hidden = true;
    document.getElementById('homepage-video-unavailable').hidden = false;
    const transcript = document.getElementById('homepage-video-transcript');
    transcript.open = true;
    if (hadFocus) {
      const summary = transcript.querySelector('summary');
      summary.focus({ preventScroll: true });
      summary.scrollIntoView({ block: 'center' });
    }
  });
}

export function getHomepageVideoAssets(runtimeLocale) {
  // The existing Hindi/Urdu homepage is Hindi (htmlLang: hi); Chinese uses zh-CN.
  const language = getRuntimeLocaleMeta(runtimeLocale).htmlLang.split('-')[0];
  const base = `/videos/soundwise-${language}`;
  return { language, src: `${base}.mp4`, poster: `${base}.jpg`, transcript: `${base}.txt` };
}

export function syncHomepageVideo(runtimeLocale) {
  const video = document.getElementById('homepage-video');
  if (!video) return;

  const assets = getHomepageVideoAssets(runtimeLocale);
  if (video.getAttribute('src') !== assets.src) {
    video.pause();
    video.hidden = false;
    document.getElementById('homepage-video-unavailable').hidden = true;
    video.setAttribute('src', assets.src);
    video.setAttribute('poster', assets.poster);
    video.load();
  }
  video.setAttribute('lang', assets.language);
}
