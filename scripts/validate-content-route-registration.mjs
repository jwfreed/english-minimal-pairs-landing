import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const viteConfigPath = path.join(root, 'vite.config.js');
const contentPairsDir = path.join(root, 'content', 'pairs');
const contentLocalesDir = path.join(root, 'content', 'locales');

function readRequired(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${path.relative(root, filePath)} does not exist`);
  }

  return fs.readFileSync(filePath, 'utf8');
}

function parseSeoPageSlugs(source) {
  const match = source.match(/const\s+seoPageSlugs\s*=\s*\[([\s\S]*?)\]\s*(?:;|\n)/);
  if (!match) {
    throw new Error('Could not find seoPageSlugs in vite.config.js');
  }

  return [...match[1].matchAll(/'([^']+)'/g)].map((slugMatch) => slugMatch[1]);
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

const registeredRoutes = uniqueSorted(parseSeoPageSlugs(readRequired(viteConfigPath)));
const contentRoutes = uniqueSorted([
  ...collectIndexRoutes(contentPairsDir),
  ...collectIndexRoutes(contentLocalesDir).filter((route) => route.includes('/')),
]);

const unregisteredContent = contentRoutes.filter((route) => !registeredRoutes.includes(route));
const missingContentSource = registeredRoutes.filter((route) => !contentRoutes.includes(route));
const issues = [
  ...unregisteredContent.map((route) => (
    `content route is not registered in seoPageSlugs: ${route}`
  )),
  ...missingContentSource.map((route) => (
    `seoPageSlugs entry has no content source: ${route}`
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
