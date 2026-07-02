import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import {
  HANDBOOK_MANIFEST_PATH,
  HANDBOOK_OUTPUT_DIR,
  generatedHandbookManifest,
  readHandbookSourceTree,
} from './handbook-utils.mjs';
import { documentationRedirects } from '../src/data/documentationRedirects.mjs';

const root = process.cwd();
const docsRoot = join(root, 'src', 'content', 'docs', 'docs');
const handbookRoot = join(root, HANDBOOK_OUTPUT_DIR);
const documentationRedirectsPath = join(root, 'src', 'data', 'documentationRedirects.mjs');
const publicContentRoots = [
  join(root, 'src', 'content', 'docs'),
  join(root, 'src', 'components'),
  join(root, 'src', 'data'),
  join(root, 'src', 'layouts'),
  join(root, 'src', 'pages'),
];
const errors = [];
const allowedPublicDocRoutes = new Set([
  '/docs/',
  '/docs/quickstart/',
  '/docs/first-program/',
  '/docs/build-the-compiler/',
]);

const sourceTree = readHandbookSourceTree();

checkGeneratedHandbookManifest();
checkGeneratedHandbookText();
checkRedirects();
checkPublicDocs();
checkNoStaleSpecificationLinks();

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('Documentation claim checks passed.');

function checkGeneratedHandbookManifest() {
  if (!existsSync(HANDBOOK_MANIFEST_PATH)) {
    errors.push(`Missing ${HANDBOOK_MANIFEST_PATH}. Run npm run docs:handbook:generate.`);
    return;
  }

  const manifest = JSON.parse(readFileSync(HANDBOOK_MANIFEST_PATH, 'utf8'));
  const expected = generatedHandbookManifest(sourceTree);
  if (JSON.stringify(manifest) !== JSON.stringify(expected)) {
    errors.push(`${HANDBOOK_MANIFEST_PATH} does not match the current handbook source tree.`);
  }
}

function checkGeneratedHandbookText() {
  for (const path of walk(handbookRoot).filter((file) => file.endsWith('.md'))) {
    const content = readFileSync(path, 'utf8');
    if (content.includes('\\linewidth')) {
      errors.push(`${relativePath(path)} contains unsupported \\linewidth.`);
    }
    checkMojibake(path, content);
    checkFences(path, content);
  }
}

function checkPublicDocs() {
  for (const file of walk(docsRoot).filter((path) => /\.(md|mdx)$/.test(path))) {
    if (isUnderDirectory(file, handbookRoot)) {
      continue;
    }

    const route = docRouteForFile(file);
    if (documentationRedirects[route]) {
      continue;
    }
    if (!allowedPublicDocRoutes.has(route)) {
      errors.push(`${relativePath(file)} is outside the allowed non-handbook onboarding route set.`);
    }

    const content = readFileSync(file, 'utf8');
    const rel = relativePath(file);

    if (/\bCursive\b/i.test(content)) {
      errors.push(`${rel} contains stale Cursive naming.`);
    }
    if (/\bkey\s+[A-Za-z_][\w.]*#/.test(content)) {
      errors.push(`${rel} appears to use obsolete manual-key syntax; use # key blocks.`);
    }
    if (content.includes('key cache.entries#[id]')) {
      errors.push(`${rel} contains the old key-system tour example.`);
    }
    if (/uv\s+(compile|execute)\b/.test(content)) {
      errors.push(`${rel} mentions an unsupported uv command.`);
    }
    if (!content.includes('/docs/handbook/')) {
      errors.push(`${rel} must link into the owning handbook surface.`);
    }
    checkExampleTierMetadata(file, content);
  }
}

function checkRedirects() {
  for (const [source, target] of Object.entries(documentationRedirects)) {
    if (!source.startsWith('/docs/') || !target.startsWith('/docs/')) {
      errors.push(`Documentation redirect ${source} -> ${target} must stay within /docs/.`);
    }
    if (!routeExists(target)) {
      errors.push(`Documentation redirect ${source} targets missing route ${target}.`);
    }
    if (routeHasContent(source)) {
      errors.push(`Documentation redirect source ${source} still has local content instead of being redirect-only.`);
    }
  }
}

function checkNoStaleSpecificationLinks() {
  for (const rootPath of publicContentRoots) {
    for (const file of walk(rootPath).filter((path) => /\.(astro|js|md|mdx|mjs|ts)$/.test(path))) {
      if (file === documentationRedirectsPath) {
        continue;
      }
      const content = readFileSync(file, 'utf8');
      if (content.includes('/docs/specification/')) {
        errors.push(`${relativePath(file)} links to the retired specification route.`);
      }
    }
  }
}

function checkExampleTierMetadata(path, content) {
  const lines = content.split(/\r?\n/);
  let inFence = false;

  lines.forEach((line, index) => {
    if (!/^```[A-Za-z0-9_-]*\s*$/.test(line)) return;

    if (inFence) {
      inFence = false;
      return;
    }

    inFence = true;
    const previousLine = lines[index - 1]?.trim() ?? '';
    if (!/^<!--\s*example-tier:\s*(compiler|syntax|illustrative)\s*-->$/.test(previousLine)) {
      errors.push(
        `${relativePath(path)} fenced block at line ${index + 1} must be preceded by <!-- example-tier: compiler|syntax|illustrative -->.`,
      );
    }
  });
}

function checkMojibake(path, content) {
  const suspicious = [0x00c3, 0x00c2, 0x00ce, 0x00cf, 0x00e2].map((code) =>
    String.fromCharCode(code),
  );
  content.split(/\r?\n/).forEach((line, index) => {
    if (suspicious.some((token) => line.includes(token))) {
      errors.push(`${relativePath(path)} has suspicious mojibake at line ${index + 1}.`);
    }
  });
}

function checkFences(path, content) {
  const lines = content.split(/\r?\n/);
  let inFence = false;
  let fenceStart = 0;
  let contentLines = 0;

  lines.forEach((line, index) => {
    const fence = line.match(/^```[A-Za-z0-9_-]*\s*$/);
    if (!fence) {
      if (inFence && line.trim() !== '') contentLines += 1;
      return;
    }

    if (!inFence) {
      inFence = true;
      fenceStart = index + 1;
      contentLines = 0;
      return;
    }

    if (contentLines === 0) {
      errors.push(`${relativePath(path)} has an empty fenced block starting at line ${fenceStart}.`);
    }
    inFence = false;
    fenceStart = 0;
    contentLines = 0;
  });

  if (inFence) {
    errors.push(`${relativePath(path)} has an unclosed fenced block starting at line ${fenceStart}.`);
  }
}

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    const stat = statSync(path);
    return stat.isDirectory() ? walk(path) : [path];
  });
}

function routeExists(route) {
  const normalized = route.endsWith('/') ? route.slice(0, -1) : route;
  if (normalized === '/docs') {
    return existsSync(join(docsRoot, 'index.md')) || existsSync(join(docsRoot, 'index.mdx'));
  }
  if (!normalized.startsWith('/docs')) return false;

  const slug = normalized.replace(/^\/docs\/?/, '');
  return [
    join(docsRoot, `${slug}.md`),
    join(docsRoot, `${slug}.mdx`),
    join(docsRoot, slug, 'index.md'),
    join(docsRoot, slug, 'index.mdx'),
  ].some((candidate) => existsSync(candidate));
}

function routeHasContent(route) {
  const normalized = route.endsWith('/') ? route.slice(0, -1) : route;
  if (normalized === '/docs') {
    return existsSync(join(docsRoot, 'index.md')) || existsSync(join(docsRoot, 'index.mdx'));
  }
  if (!normalized.startsWith('/docs')) return false;

  const slug = normalized.replace(/^\/docs\/?/, '');
  return [
    join(docsRoot, `${slug}.md`),
    join(docsRoot, `${slug}.mdx`),
    join(docsRoot, slug, 'index.md'),
    join(docsRoot, slug, 'index.mdx'),
  ].some((candidate) => existsSync(candidate));
}

function docRouteForFile(file) {
  const rel = relative(docsRoot, file).replaceAll('\\', '/');
  if (rel === 'index.md' || rel === 'index.mdx') return '/docs/';
  const slug = rel.replace(/\.(md|mdx)$/, '').replace(/\/index$/, '');
  return `/docs/${slug}/`;
}

function isUnderDirectory(file, directory) {
  const normalizedFile = file.replaceAll('\\', '/');
  const normalizedDirectory = directory.replaceAll('\\', '/');
  return normalizedFile.startsWith(`${normalizedDirectory}/`);
}

function relativePath(file) {
  return file.replace(`${root}\\`, '').replaceAll('\\', '/');
}
