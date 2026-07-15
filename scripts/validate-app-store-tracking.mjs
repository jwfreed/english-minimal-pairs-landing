import fs from 'node:fs';
import path from 'node:path';
import { SEO_CTA_POSITIONS } from '../src/app-store-attribution.js';

const trackingFiles = ['src/main.js', 'src/seo-page.js', 'public/404.html'];
const requiredSnippets = [
  "'event', 'app_store_click'",
  'button_text:',
  'page_path:',
  'link_url:',
  "transport_type: 'beacon'",
];
const seoTrackingSource = fs.readFileSync('src/seo-page.js', 'utf8');
const attributionSource = fs.readFileSync('src/app-store-attribution.js', 'utf8');
const allowedSeoCtaPositions = new Set(SEO_CTA_POSITIONS);
const requiredSeoTrackingSnippets = [
  "import { buildSeoAppStoreAttribution } from './app-store-attribution.js';",
  "window.addEventListener('soundwise:demo_completed', markExerciseCompleted)",
  "window.addEventListener('soundwise:challenge_completed', markExerciseCompleted)",
  'exerciseCompleted = true',
  '...buildSeoAppStoreAttribution({',
];
const requiredAttributionSnippets = [
  'page_slug:',
  'locale:',
  'cta_position:',
  'exercise_completed:',
  'exerciseCompleted === true',
];

let hasFailure = false;

for (const filePath of trackingFiles) {
  const source = fs.readFileSync(filePath, 'utf8');

  for (const snippet of requiredSnippets) {
    if (!source.includes(snippet)) {
      console.error(`${filePath} is missing required App Store tracking snippet: ${snippet}`);
      hasFailure = true;
    }
  }

  if (
    source.includes("window.gtag('event', 'click_app_store'") ||
    source.includes("gtag('event', 'click_app_store'")
  ) {
    console.error(`${filePath} still sends the unrecognized click_app_store event`);
    hasFailure = true;
  }
}

for (const snippet of requiredSeoTrackingSnippets) {
  if (!seoTrackingSource.includes(snippet)) {
    console.error(`src/seo-page.js is missing required SEO attribution snippet: ${snippet}`);
    hasFailure = true;
  }
}

for (const snippet of requiredAttributionSnippets) {
  if (!attributionSource.includes(snippet)) {
    console.error(`src/app-store-attribution.js is missing required contract field: ${snippet}`);
    hasFailure = true;
  }
}

if ((seoTrackingSource.split("'event', 'app_store_click'").length - 1) !== 1) {
  console.error('src/seo-page.js must dispatch app_store_click exactly once per click path');
  hasFailure = true;
}

function findSeoPageFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return findSeoPageFiles(entryPath);
    }

    if (entry.name !== 'index.html') {
      return [];
    }

    const source = fs.readFileSync(entryPath, 'utf8');
    return source.includes('/src/seo-page.js') ? [{ filePath: entryPath, source }] : [];
  });
}

for (const { filePath, source } of findSeoPageFiles('content')) {
  const positions = [...source.matchAll(/data-cta-position="([^"]+)"/g)]
    .map((match) => match[1]);

  for (const position of positions) {
    if (!allowedSeoCtaPositions.has(position)) {
      console.error(`${filePath} uses unknown SEO CTA position: ${position}`);
      hasFailure = true;
    }
  }

  if (!source.includes('href="https://apps.apple.com')) {
    console.error(`${filePath} has no App Store conversion link to attribute`);
    hasFailure = true;
  }
}

if (hasFailure) {
  process.exit(1);
}
