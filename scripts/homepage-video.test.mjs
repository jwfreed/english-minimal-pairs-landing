import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { getHomepageVideoAssets, setupHomepageVideo, syncHomepageVideo } from '../src/homepage-video.js';
import { supplementalTranslations } from '../src/landing-supplement-translations.js';
import { HOMEPAGE_HREFLANG_ROUTES } from '../src/localized-homepage-routes.js';
import { buildLocalizedHtml } from './generate-localized-homepages.mjs';

const template = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

for (const route of HOMEPAGE_HREFLANG_ROUTES) {
  const language = route.slug === 'hi-ur' ? 'hi' : route.slug || 'en';
  test(`${language}: the homepage ships its own video, poster, and transcript`, () => {
    const assets = getHomepageVideoAssets(route.runtimeLocale);
    assert.equal(assets.language, language);
    const source = route.slug ? buildLocalizedHtml(template, route) : template;
    for (const key of ['src', 'poster', 'transcript']) {
      if (key !== 'transcript') assert.ok(source.includes(`${key}="${assets[key]}"`), `${key} is not statically localized`);
      assert.ok(fs.statSync(new URL(`../public${assets[key]}`, import.meta.url)).size > 0);
    }
    const transcript = fs.readFileSync(new URL(`../public${assets.transcript}`, import.meta.url), 'utf8');
    assert.equal(supplementalTranslations[route.runtimeLocale].videoTranscriptContent, transcript);
    for (const target of ['ship /ʃɪp/', 'sheep /ʃiːp/']) assert.ok(transcript.includes(target));
    assert.ok(source.includes('data-i18n="videoTranscriptContent"'));
    assert.match(source, new RegExp(`height="1080" lang="${language}"`));
  });
}

test('unknown runtime locales safely resolve to English assets', () => {
  assert.deepEqual(getHomepageVideoAssets('unknown'), getHomepageVideoAssets('en'));
});

test('video uses explicit playback, inline mobile controls, and no eager video download', () => {
  const video = template.match(/<video id="homepage-video"[\s\S]*?<\/video>/)?.[0];
  assert.ok(video);
  assert.match(video, /\bcontrols\b/);
  assert.match(video, /\bplaysinline\b/);
  assert.match(video, /preload="none"/);
  assert.doesNotMatch(video, /\bautoplay\b/);
  assert.match(template, /id="homepage-video-transcript"/);
});

test('changing language switches all video assets and stops playback without auto-playing', () => {
  const previousDocument = globalThis.document;
  const attributes = { src: '/videos/soundwise-en.mp4', poster: '/videos/soundwise-en.jpg' };
  const unavailable = { hidden: false };
  let pauses = 0;
  let loads = 0;
  const video = {
    getAttribute: key => attributes[key],
    setAttribute: (key, value) => { attributes[key] = value; },
    pause: () => { pauses += 1; },
    load: () => { loads += 1; },
    play: () => { assert.fail('Language switching must not auto-play'); },
  };
  globalThis.document = {
    getElementById: id => id === 'homepage-video' ? video : unavailable,
  };
  try {
    syncHomepageVideo('日本語');
    assert.equal(attributes.src, '/videos/soundwise-ja.mp4');
    assert.equal(attributes.poster, '/videos/soundwise-ja.jpg');
    assert.equal(attributes.lang, 'ja');
    assert.equal(video.hidden, false);
    assert.equal(unavailable.hidden, true);
    assert.equal(pauses, 1);
    assert.equal(loads, 1);
    syncHomepageVideo('日本語');
    assert.equal(loads, 1, 'Reapplying the same language must not reset playback');
    syncHomepageVideo('اللغة العربية');
    assert.equal(attributes.src, '/videos/soundwise-ar.mp4');
    assert.equal(attributes.lang, 'ar');
    assert.equal(pauses, 2);
  } finally {
    globalThis.document = previousDocument;
  }
});

test('media failure exposes the inline transcript and preserves keyboard focus', () => {
  const previousDocument = globalThis.document;
  const video = new EventTarget();
  const unavailable = { hidden: true };
  let focused = false;
  let scrollPosition;
  const transcript = { open: false, querySelector: () => ({
    focus: () => { focused = true; }, scrollIntoView: options => { scrollPosition = options.block; },
  }) };
  video.matches = () => true;
  globalThis.document = { getElementById: id => ({
    'homepage-video': video, 'homepage-video-unavailable': unavailable,
    'homepage-video-transcript': transcript,
  })[id] };
  try {
    setupHomepageVideo();
    video.dispatchEvent(new Event('error'));
    assert.equal(video.hidden, true);
    assert.equal(unavailable.hidden, false);
    assert.equal(transcript.open, true);
    assert.equal(focused, true);
    assert.equal(scrollPosition, 'center');
  } finally { globalThis.document = previousDocument; }
});

test('video analytics deduplicate pause/resume, replay, initialization and locale revisits', () => {
  const previousDocument = globalThis.document;
  const previousWindow = globalThis.window;
  const video = new EventTarget();
  let language = 'en';
  const calls = [];
  video.getAttribute = () => language;
  video.duration = 20;
  globalThis.document = { getElementById: () => video, documentElement: { lang: 'en' } };
  globalThis.window = { location: { pathname: '/' }, gtag: (...args) => calls.push(args) };
  try {
    setupHomepageVideo();
    setupHomepageVideo();
    video.dispatchEvent(new Event('ended'));
    assert.equal(calls.length, 0, 'Completion requires observed playback');
    for (const name of ['playing', 'playing', 'ended', 'playing', 'ended']) video.dispatchEvent(new Event(name));
    language = 'ja';
    video.dispatchEvent(new Event('playing'));
    video.dispatchEvent(new Event('ended'));
    language = 'en';
    video.dispatchEvent(new Event('playing'));
    assert.deepEqual(calls.map(([, name, params]) => [name, params.video_language]), [
      ['video_play', 'en'], ['video_complete', 'en'], ['video_play', 'ja'], ['video_complete', 'ja'],
    ]);
    assert.deepEqual(calls[0][2], {
      video_title: 'Soundwise homepage promo', video_language: 'en', video_duration: 20,
      page_slug: 'homepage', locale: 'en', experience_surface: 'homepage', transport_type: 'beacon',
    });
    delete window.gtag;
    language = 'ar';
    assert.doesNotThrow(() => video.dispatchEvent(new Event('playing')));
  } finally {
    globalThis.document = previousDocument;
    globalThis.window = previousWindow;
  }
});

test('pages without a video remain unaffected by language changes', () => {
  const previousDocument = globalThis.document;
  globalThis.document = { getElementById: () => null };
  try { assert.doesNotThrow(() => syncHomepageVideo('日本語')); }
  finally { globalThis.document = previousDocument; }
});
