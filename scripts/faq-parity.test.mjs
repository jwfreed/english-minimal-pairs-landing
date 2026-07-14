import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  getFaqQuestionSets,
  validateFaqQuestionParity,
} from './faq-parity.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function readPairPage(slug) {
  return fs.readFileSync(path.join(root, 'content', 'pairs', slug, 'index.html'), 'utf8');
}

test('normalizes HTML entities, quote variants, whitespace, and Unicode equivalents', () => {
  const source = `
    <script type="application/ld+json">
      {"@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What's \\"full\\" /ɛ/ - vs fool?"}]}
    </script>
    <button class="faq-question"><span>What&#39;s &ldquo;full&rdquo; /&epsilon;/ &mdash;\u3000vs fool?</span></button>
  `;

  assert.deepEqual(validateFaqQuestionParity(source), []);
});

for (const slug of ['pull-vs-pool', 'full-vs-fool']) {
  test(`${slug} visible and JSON-LD FAQ questions stay in parity`, () => {
    const source = readPairPage(slug);
    const { visibleQuestions, schemaQuestions } = getFaqQuestionSets(source);

    assert.ok(visibleQuestions.length > 0);
    assert.deepEqual(schemaQuestions, visibleQuestions);
    assert.deepEqual(validateFaqQuestionParity(source), []);
  });
}
