import fs from 'node:fs';
import path from 'node:path';

const targetPage = 'ship-vs-sheep/index.html';
const targetSource = fs.readFileSync(targetPage, 'utf8');
const seoSource = fs.readFileSync('src/seo-page.js', 'utf8');
const docSource = fs.readFileSync('docs/exercise-architecture.md', 'utf8');
const styleSource = fs.readFileSync('src/style.css', 'utf8');

let hasFailure = false;

function fail(message) {
  console.error(message);
  hasFailure = true;
}

function countOccurrences(haystack, needle) {
  return haystack.split(needle).length - 1;
}

function collectHtmlFiles(root = '.') {
  const entries = fs.readdirSync(root, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git' || entry.name === '.worktrees') {
      continue;
    }

    const entryPath = path.join(root, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectHtmlFiles(entryPath));
    } else if (entry.name.endsWith('.html')) {
      files.push(entryPath);
    }
  }

  return files;
}

const requiredTargetSnippets = [
  'data-exercise',
  'data-contrast="ship-vs-sheep"',
  'id="ship-vs-sheep-listening-exercise"',
  '<script type="module" src="/src/seo-page.js"></script>',
];

for (const snippet of requiredTargetSnippets) {
  if (!targetSource.includes(snippet)) {
    fail(`${targetPage} is missing required SEO exercise snippet: ${snippet}`);
  }
}

const exerciseMountCount = countOccurrences(targetSource, 'data-exercise');
if (exerciseMountCount !== 1) {
  fail(`${targetPage} should contain exactly one data-exercise mount, found ${exerciseMountCount}`);
}

for (const filePath of collectHtmlFiles()) {
  if (filePath === targetPage) {
    continue;
  }

  const source = fs.readFileSync(filePath, 'utf8');
  if (source.includes('data-exercise')) {
    fail(`Phase 3 should only mount the SEO exercise on ${targetPage}; found data-exercise in ${filePath}`);
  }
}

const requiredSeoSourcePatterns = [
  {
    description: 'imports contrast catalog data',
    pattern: /import\s+\{[^}]*getContrastById[^}]*\}\s+from\s+['"]\.\/contrast-catalog\.js['"]/,
  },
  {
    description: 'imports the reusable exercise engine',
    pattern: /import\s+\{[^}]*createExercise[^}]*\}\s+from\s+['"]\.\/exercise-engine\.js['"]/,
  },
  {
    description: 'imports centralized funnel tracking',
    pattern: /import\s+\w+\s+from\s+['"]\.\/funnel-tracking\.js['"]/,
  },
  {
    description: 'discovers declarative exercise mounts',
    pattern: /querySelectorAll\(\s*['"]\[data-exercise\]['"]\s*\)/,
  },
  {
    description: 'reads the mount contrast ID instead of hardcoding page data',
    pattern: /\.dataset\.contrast\b/,
  },
  {
    description: 'looks up contrast data from the catalog',
    pattern: /getContrastById\(/,
  },
  {
    description: 'delegates lifecycle behavior to createExercise',
    pattern: /createExercise\(/,
  },
  {
    description: 'marks SEO exercise analytics with the SEO surface',
    pattern: /experience_surface\s*:\s*['"]seo_contrast_page['"]/,
  },
  {
    description: 'registers centralized funnel tracking',
    pattern: /setupFunnelTracking\(\s*\)/,
  },
];

for (const { description, pattern } of requiredSeoSourcePatterns) {
  if (!pattern.test(seoSource)) {
    fail(`src/seo-page.js does not satisfy SEO exercise boundary: ${description}`);
  }
}

const forbiddenSeoSourceSnippets = [
  "gtag('event', 'exercise_start'",
  "gtag('event', 'exercise_complete'",
  "window.gtag('event', 'exercise_start'",
  "window.gtag('event', 'exercise_complete'",
  'training_start',
  'training_cta_click',
];

for (const snippet of forbiddenSeoSourceSnippets) {
  if (seoSource.includes(snippet)) {
    fail(`src/seo-page.js must not include forbidden analytics snippet: ${snippet}`);
  }
}

const requiredDocSnippets = [
  'data-exercise',
  'data-contrast',
  'seo_contrast_page',
  'SEO HTML mount',
  'seo-page.js adapter',
];

for (const snippet of requiredDocSnippets) {
  if (!docSource.includes(snippet)) {
    fail(`docs/exercise-architecture.md is missing SEO integration documentation: ${snippet}`);
  }
}

if (!styleSource.includes('.seo-exercise')) {
  fail('src/style.css is missing scoped .seo-exercise styles');
}

if (hasFailure) {
  process.exit(1);
}
