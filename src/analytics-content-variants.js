export const CONTENT_VARIANTS = Object.freeze({
  CONTRAST_JOURNEY_V1: 'contrast_journey_v1',
});

// This registry is the canonical assignment of experiment variants to pages.
// Variants describe temporary measurement cohorts, not permanent page types.
const CONTENT_VARIANT_ASSIGNMENTS = Object.freeze([
  Object.freeze({
    contentVariant: CONTENT_VARIANTS.CONTRAST_JOURNEY_V1,
    publicPath: '/ship-vs-sheep/',
    sourcePath: '/content/pairs/ship-vs-sheep/index.html',
  }),
]);

const GTAG_CONFIG_PATTERN = /gtag\('config',\s*'([^']+)'\s*\);/u;

function normalizePathname(pathname) {
  const normalized = pathname
    .split(/[?#]/u, 1)[0]
    .replace(/\/index\.html$/u, '/');

  return normalized.startsWith('/') ? normalized : `/${normalized}`;
}

export function getContentVariantForPathname(pathname) {
  const normalizedPathname = normalizePathname(pathname);
  const assignment = CONTENT_VARIANT_ASSIGNMENTS.find((candidate) => (
    normalizePathname(candidate.publicPath) === normalizedPathname
    || normalizePathname(candidate.sourcePath) === normalizedPathname
  ));

  return assignment?.contentVariant;
}

export function getContentVariantEventParameters(contentVariant) {
  return contentVariant ? { content_variant: contentVariant } : {};
}

export function applyContentVariantHtml({ html, pathname }) {
  const contentVariant = getContentVariantForPathname(pathname);

  if (!contentVariant) {
    return html;
  }

  if (/<html\b[^>]*\bdata-content-variant=/iu.test(html)) {
    throw new Error(
      `Content variant metadata for "${pathname}" must come from the analytics registry.`
    );
  }

  const htmlWithVariant = html.replace(
    /<html\b([^>]*)>/iu,
    `<html$1 data-content-variant="${contentVariant}">`
  );

  if (!GTAG_CONFIG_PATTERN.test(htmlWithVariant)) {
    throw new Error(
      `Content variant page "${pathname}" must use the standard gtag config call.`
    );
  }

  return htmlWithVariant.replace(
    GTAG_CONFIG_PATTERN,
    `gtag('config', '$1', { content_variant: '${contentVariant}' });`
  );
}
