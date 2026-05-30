import fs from 'node:fs';

const trackingFiles = ['src/main.js', 'src/seo-page.js', 'public/404.html'];
const requiredSnippets = [
  "'event', 'app_store_click'",
  'button_text:',
  'page_path:',
  'link_url:',
  "transport_type: 'beacon'",
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

if (hasFailure) {
  process.exit(1);
}
