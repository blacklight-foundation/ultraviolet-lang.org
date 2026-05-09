import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const docsRoot = join(root, 'src', 'content', 'docs', 'docs');
const pageRoot = join(root, 'src', 'pages');
const errors = [];

const files = [
  ...walk(docsRoot).filter((file) => /\.(md|mdx)$/.test(file)),
  ...walk(pageRoot).filter((file) => /\.(astro|md|mdx)$/.test(file)),
];

for (const file of files) {
  const content = readFileSync(file, 'utf8');
  for (const href of extractLinks(content)) {
    if (!href.startsWith('/')) continue;
    if (href.startsWith('//')) continue;
    if (href.startsWith('/api/')) continue;
    if (href.includes('#')) {
      checkRoute(file, href.split('#')[0] || '/');
    } else {
      checkRoute(file, href);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Checked internal links in ${files.length} content files.`);

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    const stat = statSync(path);
    return stat.isDirectory() ? walk(path) : [path];
  });
}

function extractLinks(content) {
  const links = new Set();
  const markdown = /\]\((\/[^)\s]+)\)/g;
  const html = /href=["'](\/[^"']+)["']/g;
  for (const match of content.matchAll(markdown)) links.add(match[1]);
  for (const match of content.matchAll(html)) links.add(match[1]);
  return [...links];
}

function checkRoute(file, route) {
  const normalized = route.endsWith('/') ? route.slice(0, -1) : route;
  if (normalized === '') return;

  const candidates = [];
  if (normalized.startsWith('/docs')) {
    const slug = normalized.replace(/^\/docs\/?/, '');
    if (slug === '') {
      candidates.push(join(docsRoot, 'index.md'), join(docsRoot, 'index.mdx'));
    } else {
      candidates.push(
        join(docsRoot, `${slug}.md`),
        join(docsRoot, `${slug}.mdx`),
        join(docsRoot, slug, 'index.md'),
        join(docsRoot, slug, 'index.mdx'),
      );
    }
  } else {
    const slug = normalized.slice(1);
    candidates.push(
      join(pageRoot, `${slug}.astro`),
      join(pageRoot, slug, 'index.astro'),
      join(root, 'public', `${slug}.svg`),
      join(root, 'public', slug),
    );
  }

  if (!candidates.some((candidate) => existsSync(candidate))) {
    errors.push(`${relativePath(file)} links to missing route ${route}`);
  }
}

function relativePath(file) {
  return file.replace(`${root}\\`, '').replaceAll('\\', '/');
}
