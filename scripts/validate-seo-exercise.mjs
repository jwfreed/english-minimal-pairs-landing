import fs from 'node:fs';
import path from 'node:path';

import { CONTRAST_CATALOG } from '../src/contrast-catalog.js';
import { SEO_EXERCISE_TRANSLATIONS } from '../src/seo-exercise-translations.js';

const HUB_SLUGS = new Set(['english-ear-training', 'minimal-pairs-practice']);
const SEO_PAGE_SCRIPT = '<script type="module" src="/src/seo-page.js"></script>';
const PRACTICE_PROMISE_PATTERNS = [
  {
    id: 'try-listening-exercise',
    pattern: /\btry the listening (?:exercise|test)\b/giu,
  },
  {
    id: 'exercise-below',
    pattern: /\b(?:use|try|start)\b[^.!?]{0,100}\b(?:exercise|test)\s+(?:below|here|on this page)\b/giu,
  },
];
const seoSource = fs.readFileSync('src/seo-page.js', 'utf8');
const docSource = fs.readFileSync('docs/exercise-architecture.md', 'utf8');
const rolloutChecklistSource = fs.readFileSync('docs/seo-page-checklist.md', 'utf8');
const styleSource = fs.readFileSync('src/style.css', 'utf8');
const viteSource = fs.readFileSync('vite.config.js', 'utf8');

let hasFailure = false;

function fail(message) {
  console.error(message);
  hasFailure = true;
}

function countOccurrences(haystack, needle) {
  return haystack.split(needle).length - 1;
}

function getVisibleText(source) {
  return source
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(?:nbsp|amp|quot|apos|ldquo|rdquo|lsquo|rsquo);/gi, ' ')
    .replace(/&#(?:x[0-9a-f]+|\d+);/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getPracticePromiseSignals(source) {
  const visibleText = getVisibleText(source);

  return PRACTICE_PROMISE_PATTERNS
    .filter(({ pattern }) => {
      pattern.lastIndex = 0;
      return pattern.test(visibleText);
    })
    .map(({ id }) => id);
}

function getSearchIntentStatus(source, contrastId) {
  const headingMatch = source.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  const headingText = getVisibleText(headingMatch?.[1] || '').toLowerCase();

  return contrastId
    .split('-vs-')
    .every((word) => headingText.includes(word));
}

function getExplanationStatus(source) {
  return /<section\b[^>]*>[\s\S]*?<p\b/i.test(source);
}

function getAppCtaStatus(source) {
  return /<section\b[^>]*class="[^"]*\bseo-cta\b[^"]*"[\s\S]*?apps\.apple\.com[\s\S]*?<\/section>/i.test(source);
}

function getJourneyCoverageRows(source) {
  const sectionMatch = source.match(
    /<!-- journey-coverage:start -->([\s\S]*?)<!-- journey-coverage:end -->/
  );
  const rows = new Map();

  if (!sectionMatch) {
    fail('docs/exercise-architecture.md is missing journey coverage markers');
    return rows;
  }

  for (const line of sectionMatch[1].split('\n')) {
    const match = line.match(
      /^\|\s*`([^`]+)`\s*\|\s*(✅|❌)\s*\|\s*(✅|❌)\s*\|\s*(✅|❌)\s*\|\s*(✅|❌)\s*\|\s*(✅|❌|⚠️)\s*\|$/u
    );

    if (!match) {
      continue;
    }

    const [, route, searchIntent, explanation, exercise, completion, cta] = match;
    if (rows.has(route)) {
      fail(`docs/exercise-architecture.md has a duplicate journey coverage row for ${route}`);
    }
    rows.set(route, { searchIntent, explanation, exercise, completion, cta });
  }

  return rows;
}

function parseRegisteredRoutes(source) {
  const match = source.match(/const\s+seoPageSlugs\s*=\s*\[([\s\S]*?)\]\s*(?:;|\n)/);

  if (!match) {
    fail('Could not find seoPageSlugs in vite.config.js');
    return new Set();
  }

  return new Set([...match[1].matchAll(/'([^']+)'/g)].map((routeMatch) => routeMatch[1]));
}

function hasExactCatalogContrast(contrastId) {
  const contrast = CONTRAST_CATALOG[contrastId];

  return Boolean(
    contrast
    && contrast.id === contrastId
    && Array.isArray(contrast.words)
    && contrast.words.length === 2
    && contrast.words.every((word) => word.text && word.ipa)
    && contrast.words.map((word) => word.text.toLowerCase()).join('-vs-') === contrastId
    && contrast.contrast
  );
}

function hasExplicitExerciseTranslation(locale) {
  const normalizedLocale = (locale || '').trim().toLowerCase();
  const baseLocale = normalizedLocale.split('-')[0];

  return Boolean(
    SEO_EXERCISE_TRANSLATIONS[normalizedLocale]
    || SEO_EXERCISE_TRANSLATIONS[baseLocale]
  );
}

function getDocumentLocale(source, filePath) {
  const match = source.match(/<html\b[^>]*\blang="([^"]+)"/i);

  if (!match) {
    fail(`${filePath} is missing an html lang attribute`);
    return '';
  }

  return match[1];
}

function collectPairPages() {
  const pages = [];
  const englishRoot = path.join('content', 'pairs');
  const localesRoot = path.join('content', 'locales');

  for (const entry of fs.readdirSync(englishRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || HUB_SLUGS.has(entry.name)) {
      continue;
    }

    const filePath = path.join(englishRoot, entry.name, 'index.html');
    if (fs.existsSync(filePath)) {
      pages.push({ filePath, contrastId: entry.name, route: entry.name });
    }
  }

  for (const localeEntry of fs.readdirSync(localesRoot, { withFileTypes: true })) {
    if (!localeEntry.isDirectory()) {
      continue;
    }

    const localeRoot = path.join(localesRoot, localeEntry.name);
    for (const pageEntry of fs.readdirSync(localeRoot, { withFileTypes: true })) {
      if (!pageEntry.isDirectory() || HUB_SLUGS.has(pageEntry.name)) {
        continue;
      }

      const filePath = path.join(localeRoot, pageEntry.name, 'index.html');
      if (fs.existsSync(filePath)) {
        pages.push({
          filePath,
          contrastId: pageEntry.name,
          route: `${localeEntry.name}/${pageEntry.name}`,
        });
      }
    }
  }

  return pages;
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

const registeredRoutes = parseRegisteredRoutes(viteSource);
const pairPages = collectPairPages();
const exercisePagePaths = new Set();
const pageFacts = new Map();
const coverage = {
  eligible: [],
  missingCatalogCapability: [],
  missingLocalizedUi: [],
};
const practicePromiseReport = {
  mode: 'report-only',
  coveredPages: [],
  uncoveredPages: [],
};

for (const { filePath, contrastId, route } of pairPages) {
  const targetSource = fs.readFileSync(filePath, 'utf8');
  const documentLocale = getDocumentLocale(targetSource, filePath);
  const hasCatalogCapability = hasExactCatalogContrast(contrastId);
  const hasLocalizedUi = hasExplicitExerciseTranslation(documentLocale);
  const shouldMountExercise = hasCatalogCapability && hasLocalizedUi;
  const exerciseMountCount = countOccurrences(targetSource, 'data-exercise');
  const hasExerciseMount = exerciseMountCount === 1;
  const routePath = `/${route}/`;
  const hasAppCta = getAppCtaStatus(targetSource);
  const promiseSignals = getPracticePromiseSignals(targetSource);

  pageFacts.set(routePath, {
    searchIntent: getSearchIntentStatus(targetSource, contrastId) ? '✅' : '❌',
    explanation: getExplanationStatus(targetSource) ? '✅' : '❌',
    exercise: hasExerciseMount ? '✅' : '❌',
    completion: hasExerciseMount ? '✅' : '❌',
    cta: hasAppCta ? (hasExerciseMount ? '✅' : '⚠️') : '❌',
  });

  if (promiseSignals.length > 0) {
    const reportEntry = { route: routePath, signals: promiseSignals };
    if (hasExerciseMount) {
      practicePromiseReport.coveredPages.push(reportEntry);
    } else {
      practicePromiseReport.uncoveredPages.push(reportEntry);
    }
  }

  if (!registeredRoutes.has(route)) {
    fail(`${filePath} does not resolve through vite.config.js route ${route}`);
  }

  if (!shouldMountExercise) {
    if (exerciseMountCount !== 0) {
      const blocker = hasCatalogCapability
        ? `explicit ${documentLocale} exercise UI translation`
        : `exact ${contrastId} catalog capability`;
      fail(`${filePath} mounts an exercise without ${blocker}`);
    }

    if (!hasCatalogCapability) {
      coverage.missingCatalogCapability.push(route);
    } else {
      coverage.missingLocalizedUi.push(route);
    }
    continue;
  }

  exercisePagePaths.add(filePath);
  coverage.eligible.push(route);

  const requiredTargetSnippets = [
    'data-exercise',
    `data-contrast="${contrastId}"`,
    SEO_PAGE_SCRIPT,
    'apps.apple.com',
  ];

  for (const snippet of requiredTargetSnippets) {
    if (!targetSource.includes(snippet)) {
      fail(`${filePath} is missing required SEO exercise snippet: ${snippet}`);
    }
  }

  if (exerciseMountCount !== 1) {
    fail(`${filePath} should contain exactly one data-exercise mount, found ${exerciseMountCount}`);
  }

  const firstSectionIndex = targetSource.indexOf('<section');
  const firstExplanationEnd = targetSource.indexOf('</section>', firstSectionIndex);
  const exerciseIndex = targetSource.indexOf(`data-exercise data-contrast="${contrastId}"`);
  const primaryCtaIndex = targetSource.search(/<section\b[^>]*class="[^"]*\bseo-cta\b[^"]*"/);
  const primaryCtaEnd = targetSource.indexOf('</section>', primaryCtaIndex);

  if (firstSectionIndex < 0 || firstExplanationEnd < 0 || exerciseIndex < firstExplanationEnd) {
    fail(`${filePath} should explain the contrast before mounting the exercise`);
  }

  if (primaryCtaIndex < 0 || exerciseIndex > primaryCtaIndex) {
    fail(`${filePath} should mount the exercise before its primary App Store CTA`);
  } else if (
    primaryCtaEnd < 0
    || !targetSource.slice(primaryCtaIndex, primaryCtaEnd).includes('apps.apple.com')
  ) {
    fail(`${filePath} should provide an App Store next action after the exercise`);
  }
}

const journeyCoverageRows = getJourneyCoverageRows(docSource);

for (const [route, expectedFacts] of pageFacts) {
  const documentedFacts = journeyCoverageRows.get(route);

  if (!documentedFacts) {
    fail(`docs/exercise-architecture.md is missing a journey coverage row for ${route}`);
    continue;
  }

  for (const field of ['searchIntent', 'explanation', 'exercise', 'completion', 'cta']) {
    if (documentedFacts[field] !== expectedFacts[field]) {
      fail(
        `docs/exercise-architecture.md journey coverage drift for ${route} ${field}: `
        + `expected ${expectedFacts[field]}, found ${documentedFacts[field]}`
      );
    }
  }
}

for (const route of journeyCoverageRows.keys()) {
  if (!pageFacts.has(route)) {
    fail(`docs/exercise-architecture.md has a journey coverage row for unknown route ${route}`);
  }
}

const englishEligiblePageCount = coverage.eligible.filter((route) => !route.includes('/')).length;
const localizedEligiblePageCount = coverage.eligible.length - englishEligiblePageCount;
const requiredCoverageCountRows = [
  `| English eligible exercise pages | ${englishEligiblePageCount} |`,
  `| Localized eligible exercise pages | ${localizedEligiblePageCount} |`,
  `| Total rendered exercise mounts | ${exercisePagePaths.size} |`,
];

for (const row of requiredCoverageCountRows) {
  if (!docSource.includes(row)) {
    fail(`docs/exercise-architecture.md has stale exercise coverage terminology: ${row}`);
  }
}

for (const filePath of collectHtmlFiles()) {
  if (exercisePagePaths.has(filePath)) {
    continue;
  }

  const source = fs.readFileSync(filePath, 'utf8');
  if (source.includes('data-exercise') && !exercisePagePaths.has(filePath)) {
    fail(`SEO exercise rollout should only mount exercises on eligible pair pages; found data-exercise in ${filePath}`);
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
  'Journey Coverage',
  'Practice-Promise Reporting Policy',
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

console.log(JSON.stringify({
  coverageTerminology: {
    englishEligibleExercisePages: englishEligiblePageCount,
    localizedEligibleExercisePages: localizedEligiblePageCount,
    totalRenderedExerciseMounts: exercisePagePaths.size,
  },
  eligibleExercisePages: coverage.eligible.sort(),
  blockedByCatalogCapability: coverage.missingCatalogCapability.sort(),
  blockedByLocalizedExerciseUi: coverage.missingLocalizedUi.sort(),
  practicePromiseReport: {
    ...practicePromiseReport,
    coveredPages: practicePromiseReport.coveredPages.sort((a, b) => a.route.localeCompare(b.route)),
    uncoveredPages: practicePromiseReport.uncoveredPages.sort((a, b) => a.route.localeCompare(b.route)),
  },
  status: 'ok',
}, null, 2));
