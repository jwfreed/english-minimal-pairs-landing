import fs from 'node:fs';

// Guards the SEO funnel measurement in src/main.js:
//  - exercise_start and exercise_complete are each emitted exactly once
//    (no duplicate semantic events, no per-round inflation), and
//  - the pre-existing app_store_click tracking is preserved.
const source = fs.readFileSync('src/main.js', 'utf8');

const exactlyOnce = [
  "'event', 'exercise_start'",
  "'event', 'exercise_complete'",
];
const required = ["'event', 'app_store_click'"];

let hasFailure = false;

function countOccurrences(haystack, needle) {
  return haystack.split(needle).length - 1;
}

for (const snippet of exactlyOnce) {
  const count = countOccurrences(source, snippet);
  if (count !== 1) {
    console.error(`src/main.js should fire ${snippet} exactly once, found ${count}`);
    hasFailure = true;
  }
}

for (const snippet of required) {
  if (!countOccurrences(source, snippet)) {
    console.error(`src/main.js is missing preserved tracking snippet: ${snippet}`);
    hasFailure = true;
  }
}

if (hasFailure) {
  process.exit(1);
}
