import {
  getContrastJourneyForPair,
  getPracticePairsForContrast,
} from './contrast-journey-catalog.js';

const CONTRAST_JOURNEY_MOUNT_PATTERN =
  /<div\b[^>]*\bdata-contrast-journey="([^"]+)"[^>]*>\s*<\/div>/giu;
const SEO_PRACTICE_CTA_PATTERN =
  /<section\b[^>]*\bclass="[^"]*\bseo-cta\b[^"]*"[^>]*>/iu;

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

function renderPracticePair(pair, { flagshipPairId, currentPairId }) {
  const isFlagship = pair.id === flagshipPairId;
  const isCurrent = pair.id === currentPairId;
  const pairContent = [
    `<span class="contrast-journey-pair">${escapeHtml(formatPairWords(pair))}</span>`,
    `<span class="contrast-journey-ipa">${escapeHtml(formatPairIpa(pair))}</span>`,
  ].join('');
  const pairElement = isCurrent
    ? `<span class="contrast-journey-current" aria-current="page">${pairContent}</span>`
    : `<a class="contrast-journey-link" href="/${escapeHtml(pair.id)}/" data-destination-pair="${escapeHtml(pair.id)}">${pairContent}</a>`;
  const role = isFlagship
    ? 'Starting example'
    : isCurrent
      ? 'Current example'
      : 'Related example';

  return [
    `<li class="contrast-journey-item${isFlagship ? ' is-flagship' : ''}${isCurrent ? ' is-current' : ''}">`,
    `<span class="contrast-journey-role">${role}</span>`,
    pairElement,
    '</li>',
  ].join('');
}

export function renderSeoContrastJourneyHtml(html, { publishedSeoPageSlugs } = {}) {
  return html.replace(
    CONTRAST_JOURNEY_MOUNT_PATTERN,
    (mountHtml, pairId, mountIndex) => {
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

      const contentAfterMount = html.slice(mountIndex + mountHtml.length);

      if (!SEO_PRACTICE_CTA_PATTERN.test(contentAfterMount)) {
        throw new Error(
          `Contrast Journey "${journey.contrast.id}" must appear before an SEO practice CTA.`
        );
      }

      return [
        `<ol class="pair-list contrast-journey-list" data-contrast-journey="${escapeHtml(pairId)}" aria-label="${escapeHtml(journey.contrast.label)} reviewed example sequence">`,
        ...practicePairs.map((pair) => (
          renderPracticePair(pair, {
            flagshipPairId: journey.contrast.flagshipPairId,
            currentPairId: journey.pair,
          })
        )),
        '</ol>',
      ].join('');
    }
  );
}
