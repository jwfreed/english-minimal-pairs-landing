import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const routeRegistryPath = path.join(root, 'src', 'seo-page-routes.js');
const contentPairsDir = path.join(root, 'content', 'pairs');
const contentLocalesDir = path.join(root, 'content', 'locales');

function readRequired(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${path.relative(root, filePath)} does not exist`);
  }

  return fs.readFileSync(filePath, 'utf8');
}

async function readSeoPageSlugs() {
  readRequired(routeRegistryPath);
  const { SEO_PAGE_SLUGS } = await import(pathToFileURL(routeRegistryPath).href);

  if (!Array.isArray(SEO_PAGE_SLUGS)) {
    throw new Error('src/seo-page-routes.js must export SEO_PAGE_SLUGS as an array');
  }

  return SEO_PAGE_SLUGS;
}

function collectIndexRoutes(directory, prefix = '') {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const routes = [];
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const entryPath = path.join(directory, entry.name);
    const route = prefix ? `${prefix}/${entry.name}` : entry.name;

    if (fs.existsSync(path.join(entryPath, 'index.html'))) {
      routes.push(route);
    }

    routes.push(...collectIndexRoutes(entryPath, route));
  }

  return routes;
}

function uniqueSorted(values) {
  return [...new Set(values)].sort();
}

const registeredRoutes = uniqueSorted(await readSeoPageSlugs());
const contentRoutes = uniqueSorted([
  ...collectIndexRoutes(contentPairsDir),
  ...collectIndexRoutes(contentLocalesDir).filter((route) => route.includes('/')),
]);

const unregisteredContent = contentRoutes.filter((route) => !registeredRoutes.includes(route));
const missingContentSource = registeredRoutes.filter((route) => !contentRoutes.includes(route));
const issues = [
  ...unregisteredContent.map((route) => (
    `content route is not registered in SEO_PAGE_SLUGS: ${route}`
  )),
  ...missingContentSource.map((route) => (
    `SEO_PAGE_SLUGS entry has no content source: ${route}`
  )),
];

if (issues.length > 0) {
  console.error(JSON.stringify({ issues }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  contentRouteCount: contentRoutes.length,
  registeredSeoSlugCount: registeredRoutes.length,
  status: 'ok',
}, null, 2));
