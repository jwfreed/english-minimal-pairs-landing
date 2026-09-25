export const APPLE_APP_ID = '6753882308';
export const APPLE_PROVIDER_TOKEN = '128210308';

const APPLE_CAMPAIGN_BY_PAGE_SLUG = Object.freeze({
  homepage: 'web-home',
  'bit-vs-beat': 'web-bitbeat',
  'fill-vs-feel': 'web-fillfeel',
  'ship-vs-sheep': 'web-shipsheep',
  'minimal-pairs-practice': 'web-mpphub',
});

function getPathSegments(pathname) {
  return pathname
    .split(/[?#]/u, 1)[0]
    .split('/')
    .map((segment) => decodeURIComponent(segment).trim().toLowerCase())
    .filter((segment) => segment && segment !== 'index.html');
}

function getPageSlugForPathname(pathname) {
  const segments = getPathSegments(pathname);
  const sourceIndex = segments.indexOf('content');

  if (sourceIndex >= 0 && segments[sourceIndex + 1] === 'pairs') {
    return segments[sourceIndex + 2] || 'homepage';
  }

  if (sourceIndex >= 0 && segments[sourceIndex + 1] === 'locales') {
    return null;
  }

  return segments.at(-1) || 'homepage';
}

export function getAppleCampaignToken(pageSlug) {
  return APPLE_CAMPAIGN_BY_PAGE_SLUG[pageSlug] || null;
}

export function buildAppleCampaignUrl(pageSlug) {
  const campaignToken = getAppleCampaignToken(pageSlug);

  if (!campaignToken) {
    return null;
  }

  return `https://apps.apple.com/app/apple-store/id${APPLE_APP_ID}?pt=${APPLE_PROVIDER_TOKEN}&ct=${campaignToken}&mt=8`;
}

export function buildAppleCampaignUrlForPathname(pathname) {
  return buildAppleCampaignUrl(getPageSlugForPathname(pathname));
}

export function applyAppleCampaignLinksHtml({ html, pathname }) {
  const appStoreUrl = buildAppleCampaignUrlForPathname(pathname);

  if (!appStoreUrl) {
    return html;
  }

  return html.replace(
    /href=(['"])[^'"\s>]*apps\.apple\.com[^'"\s>]*\1/giu,
    `href="${appStoreUrl}"`
  );
}
