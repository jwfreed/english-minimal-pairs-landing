export const PAIR_LEARNING_RESOURCE_TYPE = 'Minimal pair listening practice';

const requiredLearningResourceFields = [
  'name',
  'description',
  'url',
  'learningResourceType',
  'educationalUse',
  'teaches',
  'inLanguage',
];

function flattenJsonLd(blocks) {
  return blocks.flatMap((block) => (
    Array.isArray(block?.['@graph']) ? block['@graph'] : [block]
  ));
}

function hasType(block, type) {
  const blockType = block?.['@type'];
  return Array.isArray(blockType) ? blockType.includes(type) : blockType === type;
}

function pairSlug(route, locale) {
  const prefix = locale === 'en' ? '/' : `/${locale}/`;
  if (!route.startsWith(prefix) || !route.endsWith('/')) {
    return null;
  }

  const slug = route.slice(prefix.length, -1);
  return slug.includes('/') ? null : slug;
}

export function isPairPageRoute(route, locale) {
  const slug = pairSlug(route, locale);
  return Boolean(slug && /^[a-z0-9]+(?:-[a-z0-9]+)*-vs-[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug));
}

export function validatePairLearningResourceMetadata({ blocks, route, locale }) {
  if (!isPairPageRoute(route, locale)) {
    return [];
  }

  const failures = [];
  const learningResources = flattenJsonLd(blocks).filter((block) => (
    hasType(block, 'LearningResource')
  ));

  if (learningResources.length !== 1) {
    failures.push(`expected exactly one LearningResource block, found ${learningResources.length}`);
    return failures;
  }

  const learningResource = learningResources[0];
  for (const field of requiredLearningResourceFields) {
    if (typeof learningResource[field] !== 'string' || !learningResource[field].trim()) {
      failures.push(`LearningResource.${field} must be a non-empty string`);
    }
  }

  if (learningResource.learningResourceType !== PAIR_LEARNING_RESOURCE_TYPE) {
    failures.push(
      `LearningResource.learningResourceType must be "${PAIR_LEARNING_RESOURCE_TYPE}"`,
    );
  }

  const normalizedTeaches = typeof learningResource.teaches === 'string'
    ? learningResource.teaches.trim().replace(/\s+/g, ' ')
    : '';
  if (
    locale !== 'en'
    && /^english minimal[- ]pair listening contrast[.!]?$/i.test(normalizedTeaches)
  ) {
    failures.push('localized pair pages must use a localized, pair-specific LearningResource.teaches value');
  }

  return failures;
}
