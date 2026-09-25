import assert from 'node:assert/strict';
import test from 'node:test';

import {
  APPLE_APP_ID,
  APPLE_PROVIDER_TOKEN,
  applyAppleCampaignLinksHtml,
  buildAppleCampaignUrl,
  getAppleCampaignToken,
} from '../src/apple-campaign-links.js';

const EXPECTED_CAMPAIGNS = new Map([
  ['homepage', 'web-home'],
  ['bit-vs-beat', 'web-bitbeat'],
  ['fill-vs-feel', 'web-fillfeel'],
  ['ship-vs-sheep', 'web-shipsheep'],
  ['minimal-pairs-practice', 'web-mpphub'],
]);

test('builds the verified Apple Campaign Link for every configured page', () => {
  for (const [pageSlug, campaignToken] of EXPECTED_CAMPAIGNS) {
    assert.equal(getAppleCampaignToken(pageSlug), campaignToken);
    assert.equal(
      buildAppleCampaignUrl(pageSlug),
      `https://apps.apple.com/app/apple-store/id${APPLE_APP_ID}?pt=${APPLE_PROVIDER_TOKEN}&ct=${campaignToken}&mt=8`
    );
  }
});

test('rewrites every static App Store CTA on a configured page to one page campaign', () => {
  const html = `
    <a id="nav-bit-vs-beat-app-store-cta" href="https://apps.apple.com/us/app/soundwise-english/id6753882308?utm_content=bit-vs-beat">Nav</a>
    <a id="hero-bit-vs-beat-app-store-cta" data-cta-position="hero" href="https://apps.apple.com/us/app/soundwise-english/id6753882308?utm_content=bit-vs-beat">Hero</a>
    <footer><a href="https://apps.apple.com/us/app/soundwise-english/id6753882308?utm_content=bit-vs-beat">Footer</a></footer>
  `;

  const transformed = applyAppleCampaignLinksHtml({
    html,
    pathname: '/content/pairs/bit-vs-beat/index.html',
  });
  const hrefs = [...transformed.matchAll(/href="([^"]+)"/gu)].map((match) => match[1]);

  assert.deepEqual(hrefs, Array(3).fill(buildAppleCampaignUrl('bit-vs-beat')));
  assert.match(transformed, /id="hero-bit-vs-beat-app-store-cta" data-cta-position="hero"/u);
});

test('rewrites the English ship-vs-sheep source route to its verified Apple campaign', () => {
  const transformed = applyAppleCampaignLinksHtml({
    html: '<a href="https://apps.apple.com/us/app/soundwise-english/id6753882308">App Store</a>',
    pathname: '/content/pairs/ship-vs-sheep/index.html',
  });

  assert.match(
    transformed,
    new RegExp(`pt=${APPLE_PROVIDER_TOKEN}&ct=${getAppleCampaignToken('ship-vs-sheep')}&mt=8`, 'u')
  );
});

test('preserves localized App Store attribution instead of inheriting an English campaign by slug', () => {
  const localizedRoutes = [
    ['/content/locales/ja/ship-vs-sheep/index.html', 'ja-ship-vs-sheep'],
    ['/content/locales/yue/right-vs-light/index.html', 'yue-right-vs-light'],
  ];

  for (const [pathname, utmContent] of localizedRoutes) {
    const href = `https://apps.apple.com/us/app/soundwise-english/id${APPLE_APP_ID}?utm_source=website&utm_medium=seo-page&utm_campaign=minimal-pair-pages&utm_content=${utmContent}`;
    const html = `<a href="${href}">App Store</a>`;

    assert.equal(applyAppleCampaignLinksHtml({ html, pathname }), html);
  }
});

test('leaves unmapped pages unchanged instead of assigning incorrect Apple attribution', () => {
  const href = 'https://apps.apple.com/us/app/soundwise-english/id6753882308?utm_content=live-vs-leave';
  const html = `<a href="${href}">App Store</a>`;

  assert.equal(buildAppleCampaignUrl('live-vs-leave'), null);
  assert.equal(
    applyAppleCampaignLinksHtml({
      html,
      pathname: '/content/pairs/live-vs-leave/index.html',
    }),
    html
  );
});
