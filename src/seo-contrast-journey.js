import {
  getContrastJourneyForPair,
  getPracticePairsForContrast,
} from './contrast-journey-catalog.js';

const CONTRAST_JOURNEY_MOUNT_PATTERN =
  /<div\b[^>]*\bdata-contrast-journey="([^"]+)"[^>]*>\s*<\/div>/giu;

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatPairWords(pair) {
  return pair.words.map((word) => word.text).join(' vs ');
}

function formatPairIpa(pair) {
  return pair.words.map((word) => word.ipa).join(' vs ');
}

function renderPracticePair(pair, flagshipPairId) {
  const isFlagship = pair.id === flagshipPairId;
  const pairContent = [
    `<span class="contrast-journey-pair">${escapeHtml(formatPairWords(pair))}</span>`,
    `<span class="contrast-journey-ipa">${escapeHtml(formatPairIpa(pair))}</span>`,
  ].join('');
  const pairElement = isFlagship
    ? `<span class="contrast-journey-current" aria-current="page">${pairContent}</span>`
    : `<a class="contrast-journey-link" href="/${escapeHtml(pair.id)}/">${pairContent}</a>`;

  return [
    `<li class="contrast-journey-item${isFlagship ? ' is-flagship' : ''}">`,
    `<span class="contrast-journey-role">${isFlagship ? 'Starting example' : 'Related example'}</span>`,
    pairElement,
    '</li>',
  ].join('');
}

export function renderSeoContrastJourneyHtml(html, { publishedSeoPageSlugs } = {}) {
  return html.replace(
    CONTRAST_JOURNEY_MOUNT_PATTERN,
    (_, pairId) => {
      const journey = getContrastJourneyForPair(pairId);

      if (!journey) {
        throw new Error(`No Contrast Journey found for "${pairId}".`);
      }

      const practicePairs = getPracticePairsForContrast(journey.contrast.id);

      if (practicePairs.length !== journey.contrast.practicePairIds.length) {
        throw new Error(
          `Contrast Journey "${journey.contrast.id}" contains an unknown practice pair.`
        );
      }

      if (!(publishedSeoPageSlugs instanceof Set)) {
        throw new Error('Contrast Journey rendering requires the published SEO route registry.');
      }

      const unpublishedRelatedPairIds = journey.relatedPairs
        .map((pair) => pair.id)
        .filter((relatedPairId) => !publishedSeoPageSlugs.has(relatedPairId));

      if (unpublishedRelatedPairIds.length > 0) {
        throw new Error(
          `Contrast Journey "${journey.contrast.id}" references unpublished SEO routes: ${unpublishedRelatedPairIds.join(', ')}.`
        );
      }

      return [
        `<ol class="pair-list contrast-journey-list" data-contrast-journey="${escapeHtml(pairId)}" aria-label="${escapeHtml(journey.contrast.label)} reviewed example sequence">`,
        ...practicePairs.map((pair) => (
          renderPracticePair(pair, journey.contrast.flagshipPairId)
        )),
        '</ol>',
      ].join('');
    }
  );
}
