import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { applyContentVariantHtml } from '../src/analytics-content-variants.js';
import { alignSeoPageCtaHtml } from '../src/seo-capability-cta.js';

const TREATMENTS = [
  {
    slug: 'bit-vs-beat',
    title: 'Bit vs Beat Pronunciation: Hear the Difference',
    heading: 'Can you hear the difference between “bit” and “beat”?',
  },
  {
    slug: 'fill-vs-feel',
    title: 'Fill vs Feel Pronunciation: Hear the Difference',
    heading: 'Can you hear the difference between “fill” and “feel”?',
  },
];

function readPage(slug) {
  return fs.readFileSync(`content/pairs/${slug}/index.html`, 'utf8');
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
}

function renderPage(slug) {
  const withVariant = applyContentVariantHtml({
    html: readPage(slug),
    pathname: `/content/pairs/${slug}/index.html`,
  });

  return alignSeoPageCtaHtml({
    html: withVariant,
    pathname: `/${slug}/`,
    documentLanguage: 'en',
  });
}

test('both treatment pages render the controlled SERP and first-screen CTA treatment', () => {
  for (const { slug, title, heading } of TREATMENTS) {
    const html = renderPage(slug);

    assert.match(html, new RegExp(`<title>${escapeRegex(title)}</title>`, 'u'));
    assert.ok(title.length <= 60);
    assert.match(html, new RegExp(`<h1>${escapeRegex(heading)}</h1>`, 'u'));
    assert.match(html, /data-content-variant="conversion_serp_cta_v1"/u);
    assert.match(html, /class="seo-hero-actions"/u);
    assert.match(html, />Listen &amp; Test Yourself<\/a>/u);
    assert.match(
      html,
      new RegExp(`href="#${slug}-listening-exercise"`, 'u')
    );
    assert.match(
      html,
      new RegExp(
        `id="hero-${slug}-app-store-cta"[^>]*data-cta-position="hero"`,
        'u'
      )
    );
    assert.match(html, />Practice More in Soundwise<\/a>/u);
    assert.match(html, /data-capability-copy="generic"/u);
    assert.match(
      html,
      new RegExp(`id="${slug}-listening-exercise" data-exercise data-contrast="${slug}"`, 'u')
    );
    assert.match(html, new RegExp(`<link rel="canonical" href="https://getsoundwise.co/${slug}/"`, 'u'));
  }
});

test('control pages remain outside the conversion treatment', () => {
  for (const slug of ['live-vs-leave', 'sit-vs-seat', 'ship-vs-sheep']) {
    const html = renderPage(slug);

    assert.doesNotMatch(html, /data-content-variant="conversion_serp_cta_v1"/u);
    assert.doesNotMatch(html, /class="seo-hero-actions"/u);
    assert.doesNotMatch(html, /post-interaction-app-store-cta/u);
  }
});
