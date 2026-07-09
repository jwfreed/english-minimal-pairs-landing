import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const CURRENT_APP_STORE_ID = 'id6753882308';
const STALE_APP_STORE_IDS = new Set(['id6743531155']);

function collectHtmlFiles(root = '.') {
  const entries = fs.readdirSync(root, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (['.git', '.worktrees', 'dist', 'node_modules', 'output'].includes(entry.name)) {
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

test('production HTML only links to the current Soundwise App Store ID', () => {
  const staleMatches = [];
  let currentIdCount = 0;

  for (const filePath of collectHtmlFiles()) {
    const source = fs.readFileSync(filePath, 'utf8');

    currentIdCount += source.split(CURRENT_APP_STORE_ID).length - 1;

    for (const staleId of STALE_APP_STORE_IDS) {
      if (source.includes(staleId)) {
        staleMatches.push(`${filePath}: ${staleId}`);
      }
    }
  }

  assert.ok(currentIdCount > 0, `${CURRENT_APP_STORE_ID} should be present in production HTML`);
  assert.deepEqual(staleMatches, []);
});
