import fs from 'node:fs';
import path from 'node:path';

const exercisePages = [
  {
    filePath: 'ship-vs-sheep/index.html',
    contrastId: 'ship-vs-sheep',
  },
];
const exercisePagePaths = new Set(exercisePages.map((page) => page.filePath));
const seoSource = fs.readFileSync('src/seo-page.js', 'utf8');
const docSource = fs.readFileSync('docs/exercise-architecture.md', 'utf8');
const rolloutChecklistSource = fs.readFileSync('docs/seo-page-checklist.md', 'utf8');
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

for (const { filePath, contrastId } of exercisePages) {
  const targetSource = fs.readFileSync(filePath, 'utf8');
  const requiredTargetSnippets = [
    'data-exercise',
    `data-contrast="${contrastId}"`,
    '<script type="module" src="/src/seo-page.js"></script>',
  ];

  for (const snippet of requiredTargetSnippets) {
    if (!targetSource.includes(snippet)) {
      fail(`${filePath} is missing required SEO exercise snippet: ${snippet}`);
    }
  }

  const exerciseMountCount = countOccurrences(targetSource, 'data-exercise');
  if (exerciseMountCount !== 1) {
    fail(`${filePath} should contain exactly one data-exercise mount, found ${exerciseMountCount}`);
  }
}

for (const filePath of collectHtmlFiles()) {
  if (exercisePagePaths.has(filePath)) {
    continue;
  }

  const source = fs.readFileSync(filePath, 'utf8');
  if (source.includes('data-exercise')) {
    fail(`SEO exercise rollout should only mount exercises on allowlisted pages; found data-exercise in ${filePath}`);
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
    pattern: /querySelectorAll\(\s*SEO_EXERCISE_MOUNT_SELECTOR\s*\)/,
  },
  {
    description: 'requires contrast IDs on SEO exercise mounts',
    pattern: /SEO_EXERCISE_MOUNT_SELECTOR\s*=\s*['"]\[data-exercise\]\[data-contrast\]['"]/,
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
  {
    description: 'applies the standard SEO exercise class in the adapter',
    pattern: /classList\.add\(\s*SEO_EXERCISE_CLASS_NAME\s*\)/,
  },
  {
    description: 'generates predictable mount IDs from contrast IDs',
    pattern: /getSeoExerciseMountId\([^)]*\)/,
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
  'Adding A New Pronunciation Page',
  'Common Mistakes',
  'Testing And Rollout Checklist',
];

for (const snippet of requiredDocSnippets) {
  if (!docSource.includes(snippet)) {
    fail(`docs/exercise-architecture.md is missing SEO integration documentation: ${snippet}`);
  }
}

const requiredChecklistSnippets = [
  'Required Files',
  'Required Page Structure',
  '<div data-exercise data-contrast="right-vs-light"></div>',
  'Analytics Contract',
  'Validation Commands',
  'Manual QA',
  'Acceptance Criteria',
];

for (const snippet of requiredChecklistSnippets) {
  if (!rolloutChecklistSource.includes(snippet)) {
    fail(`docs/seo-page-checklist.md is missing rollout guidance: ${snippet}`);
  }
}

if (!styleSource.includes('.seo-exercise')) {
  fail('src/style.css is missing scoped .seo-exercise styles');
}

if (hasFailure) {
  process.exit(1);
}
