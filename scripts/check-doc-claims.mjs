import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { CHAPTERS, SPEC_OUTPUT_DIR, docsPathForSlug, readSpec } from './spec-utils.mjs';

const root = process.cwd();
const docsRoot = join(root, 'src', 'content', 'docs', 'docs');
const errors = [];

const { hash } = readSpec();
const manifestPath = `${SPEC_OUTPUT_DIR}/manifest.json`;

checkGeneratedSpecHash();
checkGeneratedSpecText();
checkPublicDocs();

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('Documentation claim checks passed.');

function checkGeneratedSpecHash() {
  if (!existsSync(manifestPath)) {
    errors.push(`Missing ${manifestPath}. Run npm run docs:spec:generate.`);
    return;
  }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (manifest.hash !== hash) {
    errors.push(`Generated specification hash ${manifest.hash} does not match canonical hash ${hash}.`);
  }
}

function checkGeneratedSpecText() {
  for (const chapter of CHAPTERS) {
    const path = docsPathForSlug(chapter.slug);
    if (!existsSync(path)) {
      errors.push(`Missing generated specification page ${path}.`);
      continue;
    }

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
    if (file.includes(`${join('docs', 'specification')}\\`) || file.includes(`${join('docs', 'specification')}/`)) {
      continue;
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
  }
}

function checkMojibake(path, content) {
  const suspicious = ['Ã', 'Â', 'Î', 'Ï', 'â'];
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

function relativePath(file) {
  return file.replace(`${root}\\`, '').replaceAll('\\', '/');
}
