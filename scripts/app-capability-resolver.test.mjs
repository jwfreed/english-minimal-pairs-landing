import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  APP_GROUP_IDS_BY_CAPABILITY_GROUP,
  APP_CAPABILITY_INVENTORY,
  APP_CAPABILITY_STATUS,
  resolveAppCapability,
  resolveCapabilityLocale,
} from '../src/app-capability-resolver.js';
import {
  CAPABILITY_CTA_LOCALES,
  alignSeoPageCtaHtml,
  applyCapabilityToSeoCtas,
  canRenderAppPracticeCta,
  getCapabilityCtaLabel,
  resolveSeoPageCapability,
} from '../src/seo-capability-cta.js';
import { CONTRAST_CATALOG } from '../src/contrast-catalog.js';

const supportedLocales = Object.keys(APP_CAPABILITY_INVENTORY);

test('machine-readable inventory matches the canonical alignment artifact', () => {
  const artifact = fs.readFileSync(
    'docs/app-website-contrast-alignment.md',
    'utf8'
  );
  const inventorySection = artifact
    .split('## 4. L1 contrast inventory')[1]
    ?.split('## 5. Gap analysis')[0];
  const rows = inventorySection
    .split('\n')
    .filter((line) => /^\| (?!L1 |---)/u.test(line));
  const seenGroups = new Set();

  for (const row of rows) {
    const [l1, contrastCell, examplesCell] = row
      .replace(/^\| |\|$/gu, '')
      .split('|')
      .map((cell) => cell.trim());
    const locale = resolveCapabilityLocale(l1);
    const [, groupId, contrast] =
      contrastCell.match(/^`([^`]+)` \(([^)]+)\)$/u) || [];

    assert.ok(locale, `Unknown artifact L1: ${l1}`);
    assert.ok(groupId, `Invalid artifact contrast cell: ${contrastCell}`);

    const capability = APP_CAPABILITY_INVENTORY[locale]?.[groupId];
    assert.ok(capability, `Missing resolver group: ${locale}/${groupId}`);
    assert.equal(capability.contrast, contrast, `${locale}/${groupId} contrast`);
    assert.deepEqual(
      capability.pairs,
      examplesCell.split(', '),
      `${locale}/${groupId} examples`
    );
    seenGroups.add(`${locale}/${groupId}`);
  }

  const resolverGroupCount = Object.values(APP_CAPABILITY_INVENTORY)
    .reduce((total, groups) => total + Object.keys(groups).length, 0);
  assert.equal(seenGroups.size, resolverGroupCount);
});

test('resolver returns exact support with exact-pair CTA wording', () => {
  const capability = resolveAppCapability({
    route: '/ja/ship-vs-sheep/',
    locale: 'Japanese',
    flagshipPair: ['ship', 'sheep'],
    contrastGroup: 'iVsI',
  });

  assert.equal(capability.status, APP_CAPABILITY_STATUS.EXACT_PAIR_EXISTS);
  assert.equal(capability.recommendedCTA, 'Practice ship/sheep in Soundwise');
  assert.equal(capability.evidence.resolvedL1, 'ja');
  assert.equal(capability.evidence.matchedContrastGroup, 'iVsI');
});

test('resolver returns contrast-only support without claiming the exact pair', () => {
  const capability = resolveAppCapability({
    route: '/fill-vs-feel/',
    locale: 'ru',
    flagshipPair: 'fill/feel',
    contrastGroup: 'iVsI',
  });

  assert.equal(capability.status, APP_CAPABILITY_STATUS.CONTRAST_EXISTS_ONLY);
  assert.equal(
    capability.recommendedCTA,
    'Practice this sound contrast in Soundwise'
  );
  assert.doesNotMatch(capability.recommendedCTA, /fill|feel/iu);
  assert.equal(capability.evidence.matchedContrastGroup, 'iVsI');
});

test('heart/hurt and law/low are unsupported for every app L1', () => {
  for (const [pair, contrastGroup] of [
    ['heart/hurt', 'heartVsHurt'],
    ['law/low', 'lawVsLow'],
  ]) {
    for (const locale of supportedLocales) {
      const slug = pair.replace('/', '-vs-');
      const capability = resolveAppCapability({
        route: `/${locale}/${slug}/`,
        locale,
        flagshipPair: pair,
        contrastGroup,
      });

      assert.equal(
        capability.status,
        APP_CAPABILITY_STATUS.NO_APP_SUPPORT,
        `${locale}/${pair}`
      );
      assert.equal(capability.recommendedCTA, null, `${locale}/${pair}`);
      assert.equal(canRenderAppPracticeCta(capability), false, `${locale}/${pair}`);
    }
  }
});

test('resolver does not infer contrast support from IPA or route existence', () => {
  const capability = resolveAppCapability({
    route: '/fill-vs-feel/',
    locale: 'ru',
    flagshipPair: 'fill/feel',
    contrastGroup: '/ɪ/ vs /iː/',
  });

  assert.equal(capability.status, APP_CAPABILITY_STATUS.NO_APP_SUPPORT);
  assert.equal(capability.recommendedCTA, null);
  assert.equal(capability.evidence.matchedContrastGroup, null);
});

test('exact pair support is scoped to the declared canonical contrast group', () => {
  const capability = resolveAppCapability({
    route: '/ja/ship-vs-sheep/',
    locale: 'ja',
    flagshipPair: 'ship/sheep',
    contrastGroup: 'rL',
  });

  assert.notEqual(capability.status, APP_CAPABILITY_STATUS.EXACT_PAIR_EXISTS);
  assert.notEqual(
    capability.recommendedCTA,
    'Practice ship/sheep in Soundwise'
  );
});

test('all website contrasts declare an explicit capability group', () => {
  for (const contrast of Object.values(CONTRAST_CATALOG)) {
    assert.equal(
      typeof contrast.capabilityGroup,
      'string',
      contrast.id
    );
    assert.ok(contrast.capabilityGroup.length > 0, contrast.id);
  }

  assert.deepEqual(
    APP_GROUP_IDS_BY_CAPABILITY_GROUP.vW,
    ['vW', 'wV']
  );
  assert.deepEqual(
    APP_GROUP_IDS_BY_CAPABILITY_GROUP.thetaS,
    ['thetaS', 'sTheta']
  );
});

test('NO_APP_SUPPORT cannot emit pair-level or contrast-level practice promises', () => {
  for (const locale of supportedLocales) {
    const capability = resolveAppCapability({
      route: `/${locale}/heart-vs-hurt/`,
      locale,
      flagshipPair: 'heart/hurt',
      contrastGroup: 'heartVsHurt',
    });
    const renderedLabel = getCapabilityCtaLabel(capability, locale);

    assert.equal(renderedLabel, 'Soundwise App');
    assert.doesNotMatch(renderedLabel, /practice\s+(?:heart|hurt|this)/iu);
    assert.doesNotMatch(renderedLabel, /practice this (?:sound )?contrast/iu);
  }
});

test('resolver is pair-order insensitive and supports future routes from inventory data', () => {
  const capability = resolveAppCapability({
    route: '/ja/rake-vs-lake/',
    locale: 'ja-JP',
    flagshipPair: 'lake vs rake',
    contrastGroup: 'rL',
  });

  assert.equal(capability.status, APP_CAPABILITY_STATUS.EXACT_PAIR_EXISTS);
  assert.match(capability.recommendedCTA, /lake\/rake/);
});

test('localized route context resolves independently of the document hreflang', () => {
  const capability = resolveSeoPageCapability({
    pathname: '/yue/right-vs-light/',
    documentLanguage: 'zh-Hant-HK',
  });

  assert.equal(capability.status, APP_CAPABILITY_STATUS.EXACT_PAIR_EXISTS);
  assert.equal(capability.evidence.resolvedL1, 'yue');
});

test('browser language is not proof of learner L1 on English routes', () => {
  const capability = resolveSeoPageCapability({
    pathname: '/fill-vs-feel/',
    documentLanguage: 'en',
    browserLanguages: ['ru-RU', 'en-US'],
  });

  assert.equal(capability.status, APP_CAPABILITY_STATUS.NO_APP_SUPPORT);
  assert.equal(capability.evidence.resolvedL1, null);
  assert.equal(getCapabilityCtaLabel(capability, 'ru'), 'Soundwise App');
});

test('explicit learner L1 can resolve an English route without browser inference', () => {
  const capability = resolveSeoPageCapability({
    pathname: '/fill-vs-feel/',
    documentLanguage: 'en',
    learnerL1: 'ru',
  });

  assert.equal(capability.status, APP_CAPABILITY_STATUS.CONTRAST_EXISTS_ONLY);
  assert.equal(capability.evidence.resolvedL1, 'ru');
});

test('CTA localization covers supported L1s and safely falls back to English', () => {
  assert.deepEqual(
    CAPABILITY_CTA_LOCALES.filter((locale) => locale !== 'en').sort(),
    [...supportedLocales].sort()
  );

  const capability = resolveAppCapability({
    route: '/ja/ship-vs-sheep/',
    locale: 'ja',
    flagshipPair: 'ship/sheep',
    contrastGroup: 'iVsI',
  });
  assert.equal(
    getCapabilityCtaLabel(capability, 'ja'),
    'Soundwiseでship vs sheepを練習する'
  );

  const missingLocalizationCapability = {
    ...capability,
    evidence: {
      ...capability.evidence,
      resolvedL1: null,
    },
  };
  assert.equal(
    getCapabilityCtaLabel(missingLocalizationCapability, 'xx'),
    'Practice ship vs sheep in Soundwise'
  );

  const contrastOnly = resolveAppCapability({
    route: '/fill-vs-feel/',
    locale: 'ru',
    flagshipPair: 'fill/feel',
    contrastGroup: 'iVsI',
  });
  const contrastWithoutKnownLocale = {
    ...contrastOnly,
    evidence: {
      ...contrastOnly.evidence,
      resolvedL1: null,
    },
  };
  assert.equal(
    getCapabilityCtaLabel(contrastWithoutKnownLocale, 'xx'),
    'Practice this sound contrast in Soundwise'
  );
});

test('CTA contract preserves exact wording and forbids exact wording for contrast-only', () => {
  const exact = resolveAppCapability({
    route: '/ja/ship-vs-sheep/',
    locale: 'ja',
    flagshipPair: 'ship/sheep',
    contrastGroup: 'iVsI',
  });
  const contrastOnly = resolveAppCapability({
    route: '/ru/fill-vs-feel/',
    locale: 'ru',
    flagshipPair: 'fill/feel',
    contrastGroup: 'iVsI',
  });

  assert.equal(exact.recommendedCTA, 'Practice ship/sheep in Soundwise');
  assert.match(exact.recommendedCTA, /ship\/sheep/u);
  assert.equal(
    contrastOnly.recommendedCTA,
    'Practice this sound contrast in Soundwise'
  );
  assert.doesNotMatch(contrastOnly.recommendedCTA, /fill|feel/iu);
});

test('HTML alignment enforces each state without editing page templates', () => {
  const source = [
    '<html lang="en"><body>',
    '<nav><a href="https://apps.apple.com/app/id1">Practice this contrast</a></nav>',
    '<footer><a href="https://apps.apple.com/app/id1">App Store</a></footer>',
    '</body></html>',
  ].join('');

  const exact = alignSeoPageCtaHtml({
    html: source.replace('lang="en"', 'lang="ja"'),
    pathname: '/ja/ship-vs-sheep/',
    documentLanguage: 'ja',
  });
  assert.match(exact, /data-app-capability-status="EXACT_PAIR_EXISTS"/);
  assert.match(exact, /ship vs sheep/u);

  const contrastOnly = alignSeoPageCtaHtml({
    html: source.replace('lang="en"', 'lang="ru"'),
    pathname: '/ru/fill-vs-feel/',
    documentLanguage: 'ru',
  });
  assert.match(
    contrastOnly,
    /data-app-capability-status="CONTRAST_EXISTS_ONLY"/
  );
  assert.match(contrastOnly, /это звуковое различие/u);
  assert.doesNotMatch(contrastOnly, /Practice fill|Practice feel/iu);

  const unsupported = alignSeoPageCtaHtml({
    html: source.replace('lang="en"', 'lang="ja"'),
    pathname: '/ja/heart-vs-hurt/',
    documentLanguage: 'ja',
  });
  assert.match(unsupported, /data-app-capability-status="NO_APP_SUPPORT"/);
  assert.match(unsupported, />Soundwise App<\/a>/);
  assert.doesNotMatch(unsupported, /Practice heart|Practice hurt/iu);
  assert.doesNotMatch(unsupported, /Practice this contrast/iu);
  assert.match(unsupported, /<footer><a[^>]*>App Store<\/a><\/footer>/);
});

test('every pair-page conversion path is wired through shared capability enforcement', () => {
  const pairFiles = ['content/pairs', 'content/locales']
    .flatMap((directory) => (
      fs.readdirSync(directory, { recursive: true })
        .filter((entry) => entry.endsWith('index.html'))
        .map((entry) => `${directory}/${entry}`)
    ))
    .filter((file) => {
      const source = fs.readFileSync(file, 'utf8');
      return /<link rel="canonical" href="[^"]+\/[^"]*-vs-[^"]*\/"/u.test(source);
    });

  assert.equal(pairFiles.length, 35);

  for (const file of pairFiles) {
    const source = fs.readFileSync(file, 'utf8');
    const pathname = new URL(
      source.match(/<link rel="canonical" href="([^"]+)"/u)?.[1]
    ).pathname;
    const documentLanguage =
      source.match(/<html\b[^>]*\blang="([^"]+)"/iu)?.[1] || 'en';
    const transformed = alignSeoPageCtaHtml({
      html: source,
      pathname,
      documentLanguage,
    });
    const beforeFooter = transformed.split(/<footer\b/iu)[0];
    const practiceAnchors = [
      ...beforeFooter.matchAll(
        /<a\b[^>]*href="[^"]*apps\.apple\.com[^"]*"[^>]*>/giu
      ),
    ];

    assert.match(source, /src="\/src\/seo-page\.js"/u, file);
    assert.ok(practiceAnchors.length > 0, file);
    for (const [anchor] of practiceAnchors) {
      assert.match(anchor, /data-app-capability-cta="true"/u, file);
      assert.match(
        anchor,
        /data-app-capability-status="(?:EXACT_PAIR_EXISTS|CONTRAST_EXISTS_ONLY|NO_APP_SUPPORT)"/u,
        file
      );
    }
  }

  const runtimeSource = fs.readFileSync('src/seo-page.js', 'utf8');
  const summarySource = fs.readFileSync(
    'src/seo-exercise-summary-cta.js',
    'utf8'
  );
  const viteSource = fs.readFileSync('vite.config.js', 'utf8');

  assert.match(runtimeSource, /resolveSeoPageCapability\(/u);
  assert.match(runtimeSource, /applyCapabilityToSeoCtas\(/u);
  assert.match(summarySource, /!capability\?\.recommendedCTA/u);
  assert.match(viteSource, /alignSeoCapabilityCtas\(\)/u);
});

test('runtime CTA alignment preserves links while removing unsupported practice wording', () => {
  const links = [
    {
      dataset: {},
      textContent: 'Practice heart/hurt in Soundwise',
      closest(selector) {
        return selector === '.seo-nav' ? {} : null;
      },
    },
    {
      dataset: {},
      textContent: 'App Store',
      closest(selector) {
        return selector === '.footer' ? {} : null;
      },
    },
  ];
  const root = {
    querySelectorAll() {
      return links;
    },
  };
  const capability = resolveAppCapability({
    route: '/ja/heart-vs-hurt/',
    locale: 'ja',
    flagshipPair: 'heart/hurt',
    contrastGroup: 'heartVsHurt',
  });

  const updated = applyCapabilityToSeoCtas({ root, capability, locale: 'ja' });

  assert.equal(updated.length, 1);
  assert.equal(links[0].textContent, 'Soundwise App');
  assert.equal(links[0].dataset.appCapabilityStatus, 'NO_APP_SUPPORT');
  assert.equal(links[1].textContent, 'App Store');
});
