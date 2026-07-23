import fs from 'node:fs';
import {
  APP_CAPABILITY_CONTRACT,
  APP_CAPABILITY_INVENTORY,
  resolveAppCapability,
} from '../src/app-capability-resolver.js';
import { CONTRAST_CATALOG } from '../src/contrast-catalog.js';

const matrixPath = 'docs/seo-page-conversion-matrix.md';
const requiredColumns = [
  'Page',
  'Target Query Intent',
  'Sound Contrast',
  'Exercise Available',
  'Exercise Start Tracked',
  'Exercise Complete Tracked',
  'App CTA',
  'App Support Type',
  'Priority',
  'Notes',
];
const targetPages = [
  {
    page: '/fill-vs-feel/',
    filePath: 'content/pairs/fill-vs-feel/index.html',
    contrastId: 'fill-vs-feel',
    deeperSectionIds: ['difference'],
  },
  {
    page: '/live-vs-leave/',
    filePath: 'content/pairs/live-vs-leave/index.html',
    contrastId: 'live-vs-leave',
    deeperSectionIds: ['difference'],
  },
  {
    page: '/ship-vs-sheep/',
    filePath: 'content/pairs/ship-vs-sheep/index.html',
    contrastId: 'ship-vs-sheep',
    deeperSectionIds: ['difference'],
  },
  {
    page: '/bit-vs-beat/',
    filePath: 'content/pairs/bit-vs-beat/index.html',
    contrastId: 'bit-vs-beat',
    deeperSectionIds: ['difference'],
  },
];

let hasFailure = false;

function fail(message) {
  console.error(message);
  hasFailure = true;
}

function countOccurrences(haystack, needle) {
  return haystack.split(needle).length - 1;
}

function splitTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function getMatrixRows(source) {
  const lines = source
    .split('\n')
    .filter((line) => line.trim().startsWith('|') && line.trim().endsWith('|'));
  const headerLine = lines[0] || '';
  const headers = splitTableRow(headerLine);
  const rows = new Map();

  for (const line of lines.slice(2)) {
    const cells = splitTableRow(line);
    const row = Object.fromEntries(headers.map((header, index) => [header, cells[index] || '']));

    if (row.Page) {
      rows.set(row.Page, row);
    }
  }

  return { headers, rows };
}

function firstSectionIndex(source, sectionIds) {
  return Math.min(
    ...sectionIds
      .map((sectionId) => source.indexOf(`id="${sectionId}"`))
      .filter((index) => index >= 0)
  );
}

if (!fs.existsSync(matrixPath)) {
  fail(`${matrixPath} does not exist`);
} else {
  const matrixSource = fs.readFileSync(matrixPath, 'utf8');
  const { headers, rows } = getMatrixRows(matrixSource);

  if (!matrixSource.includes(APP_CAPABILITY_CONTRACT)) {
    fail(`${matrixPath} should reference ${APP_CAPABILITY_CONTRACT}`);
  }

  for (const column of requiredColumns) {
    if (!headers.includes(column)) {
      fail(`${matrixPath} is missing required column: ${column}`);
    }
  }

  for (const { page, contrastId } of targetPages) {
    const row = rows.get(page);

    if (!row) {
      fail(`${matrixPath} is missing row for ${page}`);
      continue;
    }

    const contrast = CONTRAST_CATALOG[contrastId];

    if (row['Sound Contrast'] !== contrast?.contrast) {
      fail(`${page} should list sound contrast ${contrast?.contrast}, found "${row['Sound Contrast']}"`);
    }

    for (const column of ['Exercise Available', 'Exercise Start Tracked', 'Exercise Complete Tracked', 'App CTA']) {
      if (row[column] !== 'Yes') {
        fail(`${page} should have ${column} set to Yes, found "${row[column]}"`);
      }
    }

    const statuses = new Set(
      Object.keys(APP_CAPABILITY_INVENTORY).map((locale) => (
        resolveAppCapability({
          route: page,
          locale,
          flagshipPair: contrast.words,
          contrastGroup: contrast.capabilityGroup,
        }).status
      ))
    );

    if (statuses.size <= 1) {
      fail(`${page} should exercise more than one L1 capability state, found ${[...statuses].join(', ')}`);
    }

    if (row['App Support Type'] !== 'L1_DEPENDENT') {
      fail(`${page} should use App Support Type L1_DEPENDENT, found "${row['App Support Type']}"`);
    }

  }
}

for (const { filePath, contrastId, deeperSectionIds } of targetPages) {
  const source = fs.readFileSync(filePath, 'utf8');
  const mountSnippet = `data-exercise data-contrast="${contrastId}"`;
  const mountCount = countOccurrences(source, 'data-exercise');
  const exerciseIndex = source.indexOf(mountSnippet);
  const deeperIndex = firstSectionIndex(source, deeperSectionIds);

  if (mountCount !== 1) {
    fail(`${filePath} should contain exactly one exercise mount, found ${mountCount}`);
  }

  if (exerciseIndex < 0) {
    fail(`${filePath} is missing exercise mount ${mountSnippet}`);
  }

  if (deeperIndex === Infinity) {
    fail(`${filePath} is missing expected deeper explanation section`);
  } else if (exerciseIndex > deeperIndex) {
    fail(`${filePath} should place the exercise before the deeper contrast explanation section`);
  }

  if (!source.includes('<script type="module" src="/src/seo-page.js"></script>')) {
    fail(`${filePath} is missing src/seo-page.js`);
  }

  if (!source.includes('apps.apple.com')) {
    fail(`${filePath} is missing an App Store CTA link`);
  }
}

if (hasFailure) {
  process.exit(1);
}
