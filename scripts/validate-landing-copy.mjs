import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const jsonPath = path.join(root, 'landing-copy.json');
const htmlPath = path.join(root, 'index.html');
const runtimeModuleUrl = pathToFileURL(path.join(root, 'src', 'i18n.js')).href;
const canonicalModuleUrl = pathToFileURL(path.join(root, 'src', 'landing-copy-runtime.js')).href;
const heroDemoModuleUrl = pathToFileURL(path.join(root, 'src', 'hero-demo-translations.js')).href;

const CANONICAL_ARTIFACT_KEYS = [
  'HERO_HEADLINE',
  'HERO_DESCRIPTION',
  'HERO_PRIMARY_CTA',
  'HERO_SECONDARY_CTA',
  'TRUST_METRIC_1',
  'TRUST_METRIC_2',
  'TRUST_METRIC_3',
  'PROBLEM_HEADLINE',
  'PROBLEM_DESCRIPTION',
  'SOLUTION_HEADLINE',
  'PROCESS_SUBTITLE',
  'FEATURE_BUILT_FOR_LANGUAGE',
  'FEATURE_REAL_ACCENTS',
  'FEATURE_REAL_WORDS',
  'FINAL_CTA_HEADLINE',
  'FINAL_CTA_SUBTEXT',
];

const MICROCOPY_KEYS = [
  'cta_hover_primary',
  'cta_hover_secondary',
  'tooltip_language_selector',
  'tooltip_minimal_pair',
  'tooltip_ipa',
  'encouragement_first_correct',
  'encouragement_streak',
  'encouragement_after_mistake',
  'encouragement_session_complete',
  'onboarding_welcome',
  'onboarding_select_language',
  'onboarding_first_drill',
  'onboarding_headphones',
];

const RUNTIME_LOCALE_ALIAS_EXPECTATIONS = {
  zh: '中文',
  'zh-CN': '中文',
  yue: '廣東話',
  'zh-HK': '廣東話',
  es: 'idioma español',
  ar: 'اللغة العربية',
  fa: 'زبان فارسی',
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function getLanguages(data) {
  return {
    english: data.english,
    ...data.translations,
  };
}

function extractRuntimeKeys(html) {
  return [...new Set([...html.matchAll(/data-i18n="([^"]+)"/g)].map((match) => match[1]))];
}

function isRtlText(value) {
  return /[\u0590-\u08FF]/.test(value);
}

function hasLatinInRtl(value) {
  return isRtlText(value) && /[A-Za-z]/.test(value);
}

function hasLocalizedPriceHint(value) {
  return /บาท|₽|ريال|تومان|円|¥|₹|रु|Rs|₫|TL|₺|Rp|R\$|₩|원|دلار/.test(value);
}

function collectIssues(languages, runtimeKeys, translations, canonicalRuntimeKeys, getRuntimeLocaleMeta, runtimeToArtifactLocale) {
  const languageEntries = Object.entries(languages);
  const [firstLanguageName, firstLanguage] = languageEntries[0];
  const expectedTopOrder = Object.keys(firstLanguage);
  const expectedMicroOrder = Object.keys(firstLanguage.microcopy || {});
  const artifactToRuntimeLocale = Object.fromEntries(
    Object.entries(runtimeToArtifactLocale).map(([runtimeLocale, artifactLocale]) => [artifactLocale, runtimeLocale])
  );
  const findings = {
    structural: [],
    runtime: [],
    rtl: [],
    pricing: [],
  };

  for (const [languageName, language] of languageEntries) {
    const runtimeLocale = artifactToRuntimeLocale[languageName];
    const runtimeTranslation = translations[runtimeLocale];
    const canonicalArtifactMissing = CANONICAL_ARTIFACT_KEYS.filter((key) => !(key in language));
    const microMissing = MICROCOPY_KEYS.filter((key) => !(key in (language.microcopy || {})));
    const canonicalMissing = canonicalRuntimeKeys.filter((runtimeKey) => runtimeTranslation?.[runtimeKey] === undefined);
    const runtimeMissing = runtimeKeys.filter((runtimeKey) => runtimeTranslation?.[runtimeKey] === undefined);
    const topOrder = Object.keys(language);
    const microOrder = Object.keys(language.microcopy || {});

    if (microMissing.length > 0) {
      findings.structural.push(`${languageName}: missing microcopy keys: ${microMissing.join(', ')}`);
    }
    if (JSON.stringify(topOrder) !== JSON.stringify(expectedTopOrder)) {
      findings.structural.push(`${languageName}: top-level key order drifted from ${firstLanguageName}`);
    }
    if (JSON.stringify(microOrder) !== JSON.stringify(expectedMicroOrder)) {
      findings.structural.push(`${languageName}: microcopy key order drifted from ${firstLanguageName}`);
    }
    if (canonicalArtifactMissing.length > 0) {
      findings.structural.push(`${languageName}: missing canonical landing-copy keys: ${canonicalArtifactMissing.join(', ')}`);
    }
    if (canonicalMissing.length > 0) {
      findings.runtime.push(`${languageName}: canonical runtime keys missing after runtime build: ${canonicalMissing.join(', ')}`);
    }
    if (runtimeMissing.length > 0) {
      findings.runtime.push(`${languageName}: page runtime lookups missing: ${runtimeMissing.join(', ')}`);
    }

    const values = [
      ...Object.entries(language).filter(([key]) => key !== 'microcopy').map(([, value]) => String(value)),
      ...Object.values(language.microcopy || {}).map((value) => String(value)),
    ];
    const finalCta = String(language.FINAL_CTA_SUBTEXT || '');

    for (const value of values) {
      if (hasLatinInRtl(value)) {
        findings.rtl.push(`${languageName}: mixed RTL/LTR text needs ` + '`dir="auto"` or `unicode-bidi: plaintext` at render time');
        break;
      }
    }

    if (/\$4\.99|4\.99/.test(finalCta) && !hasLocalizedPriceHint(finalCta)) {
      findings.pricing.push(`${languageName}: price is USD-only with no local-market cue in FINAL_CTA_SUBTEXT`);
    }
  }

  for (const runtimeLocale of ['اللغة العربية', 'زبان فارسی']) {
    if (!getRuntimeLocaleMeta(runtimeLocale).isRtl) {
      findings.rtl.push(`${runtimeLocale}: runtime locale metadata is not marked RTL`);
    }
  }

  return {
    findings,
    metadata: {
      languages: languageEntries.map(([name]) => name),
      canonicalRuntimeKeyCount: canonicalRuntimeKeys.length,
      microcopyKeyCount: MICROCOPY_KEYS.length,
      runtimeKeyCount: runtimeKeys.length,
      runtimeLocaleCount: Object.keys(translations).length,
      deterministicTopLevelOrder: findings.structural.every((item) => !item.includes('top-level key order drifted')),
      deterministicMicrocopyOrder: findings.structural.every((item) => !item.includes('microcopy key order drifted')),
    },
  };
}

function collectLocaleAliasIssues(resolveRuntimeLocale) {
  if (typeof resolveRuntimeLocale !== 'function') {
    return ['resolveRuntimeLocale export is missing'];
  }

  return Object.entries(RUNTIME_LOCALE_ALIAS_EXPECTATIONS)
    .filter(([alias, expectedRuntimeLocale]) => resolveRuntimeLocale(alias) !== expectedRuntimeLocale)
    .map(([alias, expectedRuntimeLocale]) => (
      `${alias}: expected runtime locale ${expectedRuntimeLocale}, got ${resolveRuntimeLocale(alias) || 'null'}`
    ));
}

async function main() {
  const data = readJson(jsonPath);
  const html = fs.readFileSync(htmlPath, 'utf8');
  const languages = getLanguages(data);
  const runtimeKeys = extractRuntimeKeys(html);
  const runtimeModule = await import(runtimeModuleUrl);
  const canonicalModule = await import(canonicalModuleUrl);
  const heroDemoModule = await import(heroDemoModuleUrl);
  const result = collectIssues(
    languages,
    [...new Set([...runtimeKeys, ...heroDemoModule.HERO_DEMO_TRANSLATION_KEYS])],
    runtimeModule.translations,
    canonicalModule.CANONICAL_RUNTIME_KEYS,
    canonicalModule.getRuntimeLocaleMeta,
    canonicalModule.RUNTIME_LOCALE_TO_ARTIFACT_LOCALE
  );
  result.findings.runtime.push(...collectLocaleAliasIssues(runtimeModule.resolveRuntimeLocale));

  console.log(JSON.stringify(result, null, 2));

  if (result.findings.structural.length > 0 || result.findings.runtime.length > 0) {
    process.exitCode = 1;
  }
}

main();
