import { existsSync, readFileSync } from 'node:fs';
import katex from 'katex';
import {
  CHAPTERS,
  SPEC_OUTPUT_DIR,
  docsPathForSlug,
  readSpec,
  splitChapters,
} from './spec-utils.mjs';

const errors = [];
const { normalized, hash } = readSpec();
const chunks = splitChapters(normalized);
const manifestPath = `${SPEC_OUTPUT_DIR}/manifest.json`;

if (!existsSync(manifestPath)) {
  errors.push(`Missing ${manifestPath}. Run npm run docs:spec:generate.`);
} else {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (manifest.hash !== hash) {
    errors.push(`Spec hash drift: generated ${manifest.hash}, current ${hash}.`);
  }
}

for (const chapter of CHAPTERS) {
  if (!chunks.has(chapter.slug)) {
    errors.push(`Canonical spec is missing chapter ${chapter.heading}.`);
  }

  const path = docsPathForSlug(chapter.slug);
  if (!existsSync(path)) {
    errors.push(`Missing generated page ${path}.`);
    continue;
  }

  const content = readFileSync(path, 'utf8');
  if (!content.includes(`specHash: "${hash}"`)) {
    errors.push(`${path} does not include current spec hash.`);
  }
  if (content.includes('\\linewidth')) {
    errors.push(`${path} contains unsupported \\linewidth.`);
  }

  checkMathBlocks(path, content);
  checkInternalSpecLinks(path, content);
}

const indexPath = docsPathForSlug('index');
if (!existsSync(indexPath)) {
  errors.push(`Missing generated index ${indexPath}.`);
} else {
  const index = readFileSync(indexPath, 'utf8');
  for (const chapter of CHAPTERS) {
    if (!index.includes(`/docs/specification/${chapter.slug}/`)) {
      errors.push(`Specification index is missing ${chapter.slug}.`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Specification docs are current: ${CHAPTERS.length + 1} pages, hash ${hash}`);

function checkMathBlocks(path, content) {
  const blockPattern = /```math\n([\s\S]*?)\n```/g;
  for (const match of content.matchAll(blockPattern)) {
    try {
      katex.renderToString(match[1], { throwOnError: true, displayMode: true });
    } catch (error) {
      errors.push(`${path} has invalid math block: ${error.message}`);
    }
  }

  // Generated spec pages intentionally avoid validating inline dollar spans.
  // The canonical spec contains source snippets such as `$Cl` and `$ExecutionDomain`
  // that are language syntax, not LaTeX.
}

function checkInternalSpecLinks(path, content) {
  const linkPattern = /\]\((\/docs\/specification\/([a-z0-9-]+)\/)\)/g;
  const slugs = new Set(CHAPTERS.map((chapter) => chapter.slug));
  for (const match of content.matchAll(linkPattern)) {
    if (!slugs.has(match[2])) {
      errors.push(`${path} links to unknown specification page ${match[1]}.`);
    }
  }
}
