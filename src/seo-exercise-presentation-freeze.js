// Temporary experiment infrastructure: keep the canonical SEO exercise's
// visible presentation unchanged on the conversion_serp_cta_v1 treatment and
// control routes. Reassess and remove this freeze when that experiment closes.
// Invisible correctness and accessibility fixes are intentionally not gated.
export const SEO_EXERCISE_PRESENTATION_FREEZE_ROUTES = Object.freeze([
  '/bit-vs-beat/',
  '/fill-vs-feel/',
  '/ship-vs-sheep/',
  '/live-vs-leave/',
  '/sit-vs-seat/',
]);

function normalizePathname(pathname = '') {
  const normalized = pathname
    .split(/[?#]/u, 1)[0]
    .replace(/\/index\.html$/u, '/');
  const withLeadingSlash = normalized.startsWith('/') ? normalized : `/${normalized}`;

  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
}

export function isSeoExercisePresentationFrozen(pathname) {
  return SEO_EXERCISE_PRESENTATION_FREEZE_ROUTES.includes(normalizePathname(pathname));
}
