const namedEntities = new Map([
  ['aelig', 'æ'],
  ['amp', '&'],
  ['apos', "'"],
  ['gt', '>'],
  ['epsilon', 'ε'],
  ['ldquo', '“'],
  ['lsquo', '‘'],
  ['lt', '<'],
  ['mdash', '—'],
  ['nbsp', ' '],
  ['ndash', '–'],
  ['quot', '"'],
  ['rdquo', '”'],
  ['rsquo', '’'],
  ['theta', 'θ'],
]);

export function decodeHtmlEntities(value) {
  return String(value)
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&([a-z][a-z\d]+);/gi, (entity, name) => namedEntities.get(name.toLowerCase()) ?? entity);
}

export function normalizeFaqText(value) {
  return decodeHtmlEntities(value)
    .normalize('NFKC')
    .replace(/ε/g, 'ɛ')
    .replace(/[‘’‛′ʼ＇]/g, "'")
    .replace(/[“”‟″＂]/g, '"')
    .replace(/[‐‑‒–—−]/g, '-')
    .replace(/[\s\u200B-\u200D\uFEFF]+/g, ' ')
    .trim();
}

function stripTags(value) {
  return normalizeFaqText(String(value).replace(/<[^>]+>/g, ' '));
}

export function extractVisibleFaqQuestions(source) {
  const questions = [];

  for (const match of source.matchAll(/<button\b(?=[^>]*class=["'][^"']*\bfaq-question\b[^"']*["'])[^>]*>([\s\S]*?)<\/button>/gi)) {
    const questionSource = match[1].match(/<span\b[^>]*>([\s\S]*?)<\/span>/i)?.[1] || match[1];
    questions.push(stripTags(questionSource));
  }

  return questions;
}

export function extractJsonLdBlocks(source) {
  const blocks = [];
  const failures = [];

  for (const match of source.matchAll(/<script\b(?=[^>]*type=["']application\/ld\+json["'])[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      blocks.push(JSON.parse(match[1]));
    } catch (error) {
      failures.push(`JSON-LD does not parse: ${error.message}`);
    }
  }

  return { blocks, failures };
}

function flattenJsonLd(blocks) {
  return blocks.flatMap((block) => Array.isArray(block?.['@graph']) ? block['@graph'] : [block]);
}

function getJsonLdByType(blocks, type) {
  return flattenJsonLd(blocks).find((block) => {
    const blockType = block?.['@type'];
    return Array.isArray(blockType) ? blockType.includes(type) : blockType === type;
  });
}

export function getFaqQuestionSets(source, jsonLdBlocks = null) {
  const parsed = jsonLdBlocks ? { blocks: jsonLdBlocks, failures: [] } : extractJsonLdBlocks(source);
  const schemaFaq = getJsonLdByType(parsed.blocks, 'FAQPage')?.mainEntity || [];

  return {
    visibleQuestions: extractVisibleFaqQuestions(source),
    schemaQuestions: schemaFaq.map((faq) => normalizeFaqText(faq.name || '')),
    parseFailures: parsed.failures,
  };
}

export function validateFaqQuestionParity(source, jsonLdBlocks = null) {
  const { visibleQuestions, schemaQuestions, parseFailures } = getFaqQuestionSets(source, jsonLdBlocks);
  const failures = [...parseFailures];

  if (visibleQuestions.length !== schemaQuestions.length) {
    failures.push(`visible FAQ count ${visibleQuestions.length} does not match schema count ${schemaQuestions.length}`);
  }

  if (JSON.stringify(visibleQuestions) !== JSON.stringify(schemaQuestions)) {
    failures.push(`visible FAQ questions ${JSON.stringify(visibleQuestions)} do not match schema ${JSON.stringify(schemaQuestions)}`);
  }

  return failures;
}
