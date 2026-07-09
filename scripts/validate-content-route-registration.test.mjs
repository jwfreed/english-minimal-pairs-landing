import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const validatorPath = path.join(__dirname, 'validate-content-route-registration.mjs');

function writeFile(root, relativePath, source = '<!doctype html><html></html>') {
  const filePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, source);
}

function writeViteConfig(root, slugs) {
  writeFile(
    root,
    'vite.config.js',
    `const seoPageSlugs = [\n${slugs.map((slug) => `  '${slug}',`).join('\n')}\n]\n\nexport default {}\n`,
  );
}

function createFixture(slugs = ['ship-vs-sheep', 'ja/ship-vs-sheep']) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'content-route-validator-'));
  writeViteConfig(root, slugs);
  writeFile(root, 'content/pairs/ship-vs-sheep/index.html');
  writeFile(root, 'content/locales/ja/index.html');
  writeFile(root, 'content/locales/ja/ship-vs-sheep/index.html');
  return root;
}

async function runValidator(root) {
  try {
    const result = await execFileAsync(process.execPath, [validatorPath], { cwd: root });
    return { code: 0, stdout: result.stdout, stderr: result.stderr };
  } catch (error) {
    return {
      code: error.code,
      stdout: error.stdout || '',
      stderr: error.stderr || '',
    };
  }
}

test('passes when content route files and seoPageSlugs match', async () => {
  const root = createFixture();

  const result = await runValidator(root);

  assert.equal(result.code, 0);
  assert.match(result.stdout, /contentRouteCount/);
  assert.match(result.stdout, /registeredSeoSlugCount/);
});

test('fails when a content pair page is not registered for build output', async () => {
  const root = createFixture();
  writeFile(root, 'content/pairs/unregistered-pair/index.html');

  const result = await runValidator(root);
  const output = `${result.stdout}\n${result.stderr}`;

  assert.notEqual(result.code, 0);
  assert.match(output, /content route is not registered in seoPageSlugs: unregistered-pair/);
});

test('fails when a localized content page is not registered for build output', async () => {
  const root = createFixture();
  writeFile(root, 'content/locales/ko/right-vs-light/index.html');

  const result = await runValidator(root);
  const output = `${result.stdout}\n${result.stderr}`;

  assert.notEqual(result.code, 0);
  assert.match(output, /content route is not registered in seoPageSlugs: ko\/right-vs-light/);
});

test('fails when a registered slug has no content source file', async () => {
  const root = createFixture(['ship-vs-sheep', 'ja/ship-vs-sheep', 'missing-page']);

  const result = await runValidator(root);
  const output = `${result.stdout}\n${result.stderr}`;

  assert.notEqual(result.code, 0);
  assert.match(output, /seoPageSlugs entry has no content source: missing-page/);
});
