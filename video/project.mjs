import { createRequire } from 'node:module';
import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { HOMEPAGE_HREFLANG_ROUTES } from '../src/localized-homepage-routes.js';
import { getHomepageVideoAssets } from '../src/homepage-video.js';
import { getRuntimeLocaleMeta } from '../src/landing-copy-runtime.js';

// Reuse the website's route/asset authority; this is not a second locale registry.
export const locales = HOMEPAGE_HREFLANG_ROUTES.map(route => ({
  ...getHomepageVideoAssets(route.runtimeLocale),
  runtimeLocale: route.runtimeLocale,
  route: route.slug ? `/${route.slug}/` : '/',
  direction: getRuntimeLocaleMeta(route.runtimeLocale).isRtl ? 'rtl' : 'ltr',
}));

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = { locales };
  if (process.argv.includes('--tools')) {
    const require = createRequire(import.meta.url);
    result.tools = {
      cli: fileURLToPath(new URL('node_modules/hyperframes/bin/hyperframes.mjs', import.meta.url)),
      ffmpeg: require('ffmpeg-static'),
      ffprobe: require('ffprobe-static').path,
    };
  }
  console.log(JSON.stringify(result));
}
