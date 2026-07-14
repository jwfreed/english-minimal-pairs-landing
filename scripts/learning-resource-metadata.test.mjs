import assert from 'node:assert/strict';
import test from 'node:test';
import {
  PAIR_LEARNING_RESOURCE_TYPE,
  validatePairLearningResourceMetadata,
} from './learning-resource-metadata.mjs';

function learningResource(overrides = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: 'right vs light',
    description: 'Listening practice for the /r/ and /l/ contrast.',
    url: 'https://getsoundwise.co/right-vs-light/',
    learningResourceType: PAIR_LEARNING_RESOURCE_TYPE,
    educationalUse: 'English listening practice',
    teaches: 'English minimal-pair listening contrast',
    inLanguage: 'en',
    ...overrides,
  };
}

test('allows English pair pages to keep English teaches metadata', () => {
  const failures = validatePairLearningResourceMetadata({
    blocks: [learningResource()],
    route: '/right-vs-light/',
    locale: 'en',
  });

  assert.deepEqual(failures, []);
});

test('allows independently worded localized teaches metadata', () => {
  const failures = validatePairLearningResourceMetadata({
    blocks: [learningResource({
      description: '한국어 모국어 학습자를 위해 영어 right와 light의 첫소리 /r/, /l/ 차이를 설명하고, 최소 대립쌍으로 그 차이를 천천히 듣는 방법을 안내합니다.',
      url: 'https://getsoundwise.co/ko/right-vs-light/',
      teaches: '한국어 모국어 학습자를 위해 영어 right와 light의 첫소리 /r/, /l/ 차이를 설명하고, 최소 대립쌍으로 그 차이를 천천히 듣는 방법을 안내합니다.',
      inLanguage: 'ko',
    })],
    route: '/ko/right-vs-light/',
    locale: 'ko',
  });

  assert.deepEqual(failures, []);
});

test('rejects generic English teaches metadata and resource-type drift on localized pairs', () => {
  const failures = validatePairLearningResourceMetadata({
    blocks: [learningResource({
      url: 'https://getsoundwise.co/ko/right-vs-light/',
      learningResourceType: 'Practice page',
      inLanguage: 'ko',
    })],
    route: '/ko/right-vs-light/',
    locale: 'ko',
  });

  assert.match(failures.join('\n'), /learningResourceType/);
  assert.match(failures.join('\n'), /localized, pair-specific LearningResource\.teaches/);
});

test('requires a complete LearningResource structure on pair pages', () => {
  const failures = validatePairLearningResourceMetadata({
    blocks: [learningResource({ description: '' })],
    route: '/right-vs-light/',
    locale: 'en',
  });

  assert.match(failures.join('\n'), /LearningResource\.description must be a non-empty string/);
});

test('does not apply pair vocabulary to learning-resource guide pages', () => {
  const failures = validatePairLearningResourceMetadata({
    blocks: [learningResource({ learningResourceType: 'Guide' })],
    route: '/english-ear-training/',
    locale: 'en',
  });

  assert.deepEqual(failures, []);
});
