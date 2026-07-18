import fs from 'node:fs';

// Guards the homepage funnel measurement:
//  - exercise_start and exercise_complete are forwarded from src/funnel-tracking.js
//    exactly once per page load using in-memory closure state,
//  - event params are built by the homepage and passed through event.detail.exerciseParams,
//  - the pre-existing app_store_click tracking in src/main.js is preserved.
const mainSource = fs.readFileSync('src/main.js', 'utf8');
const funnelSource = fs.readFileSync('src/funnel-tracking.js', 'utf8');

const exactlyOnceInFunnelModule = [
  "'event', 'exercise_start'",
  "'event', 'exercise_complete'",
];
const requiredInMain = [
  "import setupFunnelTracking from './funnel-tracking.js';",
  "experience_surface: 'homepage'",
  'exerciseParams: buildExerciseParams(eventName, baseDetail)',
  "pageSlug: 'homepage'",
  "'event', 'app_store_click'",
];
const requiredInFunnelModule = [
  'export default function setupFunnelTracking()',
  "window.addEventListener('soundwise:demo_started'",
  "window.addEventListener('soundwise:demo_completed'",
  "window.addEventListener('soundwise:challenge_completed'",
  "typeof window.gtag !== 'function'",
  "window.gtag('event', 'exercise_start', event.detail.exerciseParams)",
  "window.gtag('event', 'exercise_complete', event.detail.exerciseParams)",
  'let exerciseStartSent = false',
  'let exerciseCompleteSent = false',
];
const forbiddenInFunnelModule = [
  'hero-demo-config',
  'buildExerciseParams',
  'localStorage',
  'sessionStorage',
  'document.cookie',
];

let hasFailure = false;

function countOccurrences(haystack, needle) {
  return haystack.split(needle).length - 1;
}

for (const snippet of exactlyOnceInFunnelModule) {
  const count = countOccurrences(funnelSource, snippet);
  if (count !== 1) {
    console.error(`src/funnel-tracking.js should fire ${snippet} exactly once, found ${count}`);
    hasFailure = true;
  }
}

for (const snippet of requiredInMain) {
  if (!mainSource.includes(snippet)) {
    console.error(`src/main.js is missing required tracking snippet: ${snippet}`);
    hasFailure = true;
  }
}

for (const snippet of requiredInFunnelModule) {
  if (!funnelSource.includes(snippet)) {
    console.error(`src/funnel-tracking.js is missing required tracking snippet: ${snippet}`);
    hasFailure = true;
  }
}

for (const snippet of forbiddenInFunnelModule) {
  if (funnelSource.includes(snippet)) {
    console.error(`src/funnel-tracking.js includes forbidden snippet: ${snippet}`);
    hasFailure = true;
  }
}

if (hasFailure) {
  process.exit(1);
}
