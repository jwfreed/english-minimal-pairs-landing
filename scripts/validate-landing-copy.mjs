import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const jsonPath = path.join(root, 'landing-copy.json');
const htmlPath = path.join(root, 'index.html');

const CURRENT_CONTENT_KEYS = [
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

const BRIEF_SECTION_KEYS = [
  'HERO_HEADLINE',
  'HERO_SUBHEADLINE',
  'VALUE_PROPOSITION',
  'SOCIAL_PROOF',
  'PROBLEM_STATEMENT',
  'SOLUTION_DESCRIPTION',
  'FEATURE_LIST',
  'BENEFITS_SECTION',
  'USE_CASES',
  'TESTIMONIAL',
  'PRICING_OVERVIEW',
  'PRICING_DETAILS',
  'FAQ_SECTION',
  'SECURITY_TRUST',
  'FINAL_CTA',
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

function collectIssues(languages, runtimeKeys) {
  const languageEntries = Object.entries(languages);
  const [firstLanguageName, firstLanguage] = languageEntries[0];
  const expectedTopOrder = Object.keys(firstLanguage);
  const expectedMicroOrder = Object.keys(firstLanguage.microcopy || {});
  const findings = {
    structural: [],
    runtime: [],
    rtl: [],
    pricing: [],
  };

  const availableJsonKeys = new Set([
    ...Object.keys(firstLanguage).filter((key) => key !== 'microcopy'),
    ...Object.keys(firstLanguage.microcopy || {}),
  ]);

  const runtimeMissing = runtimeKeys.filter((key) => !availableJsonKeys.has(key));
  if (runtimeMissing.length > 0) {
    findings.runtime.push(
      `landing-copy.json exposes ${availableJsonKeys.size} runtime-usable keys, but index.html renders ${runtimeKeys.length}; ${runtimeMissing.length} UI keys are not covered by JSON.`
    );
  }

  for (const [languageName, language] of languageEntries) {
    const currentMissing = CURRENT_CONTENT_KEYS.filter((key) => !(key in language));
    const briefMissing = BRIEF_SECTION_KEYS.filter((key) => !(key in language));
    const microMissing = MICROCOPY_KEYS.filter((key) => !(key in (language.microcopy || {})));
    const topOrder = Object.keys(language);
    const microOrder = Object.keys(language.microcopy || {});

    if (currentMissing.length > 0) {
      findings.structural.push(`${languageName}: missing current content keys: ${currentMissing.join(', ')}`);
    }
    if (microMissing.length > 0) {
      findings.structural.push(`${languageName}: missing microcopy keys: ${microMissing.join(', ')}`);
    }
    if (JSON.stringify(topOrder) !== JSON.stringify(expectedTopOrder)) {
      findings.structural.push(`${languageName}: top-level key order drifted from ${firstLanguageName}`);
    }
    if (JSON.stringify(microOrder) !== JSON.stringify(expectedMicroOrder)) {
      findings.structural.push(`${languageName}: microcopy key order drifted from ${firstLanguageName}`);
    }
    if (briefMissing.length > 0) {
      findings.structural.push(`${languageName}: does not match brief section taxonomy; missing ${briefMissing.length} of 16 brief keys`);
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

  return {
    findings,
    metadata: {
      languages: languageEntries.map(([name]) => name),
      currentContentKeyCount: CURRENT_CONTENT_KEYS.length,
      microcopyKeyCount: MICROCOPY_KEYS.length,
      runtimeKeyCount: runtimeKeys.length,
      jsonRuntimeKeyCount: availableJsonKeys.size,
      deterministicTopLevelOrder: findings.structural.every((item) => !item.includes('top-level key order drifted')),
      deterministicMicrocopyOrder: findings.structural.every((item) => !item.includes('microcopy key order drifted')),
    },
  };
}

function main() {
  const data = readJson(jsonPath);
  const html = fs.readFileSync(htmlPath, 'utf8');
  const languages = getLanguages(data);
  const runtimeKeys = extractRuntimeKeys(html);
  const result = collectIssues(languages, runtimeKeys);

  console.log(JSON.stringify(result, null, 2));

  if (result.findings.structural.some((item) => item.includes('missing current content keys') || item.includes('missing microcopy keys'))) {
    process.exitCode = 1;
  }
}

main();
