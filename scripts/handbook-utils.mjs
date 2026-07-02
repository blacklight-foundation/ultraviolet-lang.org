import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { relative, resolve } from 'node:path';

export const HANDBOOK_SOURCE_DIR = resolve(
  process.cwd(),
  process.env.ULTRAVIOLET_HANDBOOK_SOURCE_DIR ?? 'handbook',
);
export const HANDBOOK_OUTPUT_DIR = 'src/content/docs/docs/handbook';
export const HANDBOOK_MANIFEST_PATH = `${HANDBOOK_OUTPUT_DIR}/manifest.json`;
export const HANDBOOK_UPSTREAM_SOURCE_DIR = resolve(
  process.cwd(),
  process.env.ULTRAVIOLET_HANDBOOK_UPSTREAM_DIR ??
    '..\\ultraviolet\\Docs\\UltravioletHandbook.parts',
);

const PART_FILE_PATTERN = /^[0-9]{2}-[a-z0-9-]+\.md$/;

export function readHandbookSourceTree(sourceDir = HANDBOOK_SOURCE_DIR) {
  const chapters = readHandbookChapters(sourceDir);
  const aggregate = chapters.map((chapter) => chapter.content).join('\n\n');
  return {
    sourceDir,
    source: sourceRelative(sourceDir),
    chapters,
    aggregate,
    hash: sha256(aggregate),
  };
}

export function readHandbookChapters(sourceDir = HANDBOOK_SOURCE_DIR) {
  if (!existsSync(sourceDir)) {
    throw new Error(`Missing handbook source directory ${sourceRelative(sourceDir)}.`);
  }

  const files = readdirSync(sourceDir)
    .filter((name) => PART_FILE_PATTERN.test(name))
    .sort((left, right) => left.localeCompare(right));

  if (files.length === 0) {
    throw new Error(`No handbook chapter parts found in ${sourceRelative(sourceDir)}.`);
  }

  return files.map((file) => {
    const path = resolve(sourceDir, file);
    const content = normalizeNewlines(readFileSync(path, 'utf8')).trimEnd();
    const title = chapterTitle(content, file);
    const slug = file.replace(/\.md$/, '');
    const number = file.slice(0, 2);
    return {
      file,
      number,
      slug,
      route: `/docs/handbook/${slug}/`,
      title,
      body: stripChapterHeading(content),
      content,
    };
  });
}

export function handbookSidebarItems(sourceTree = readHandbookSourceTree()) {
  return [
    { label: 'Overview', slug: 'docs/handbook' },
    ...sourceTree.chapters.map((chapter) => ({
      label: chapter.title,
      slug: `docs/handbook/${chapter.slug}`,
    })),
  ];
}

export function renderHandbookIndex(sourceTree = readHandbookSourceTree()) {
  const chapterLinks = sourceTree.chapters
    .map((chapter) => `- [${chapter.title}](${chapter.route})`)
    .join('\n');

  return `${frontmatter({
    title: 'Ultraviolet Developer Handbook',
    description: 'The complete reference and engineering guide for writing correct, idiomatic Ultraviolet.',
    handbookSource: sourceTree.source,
    handbookHash: sourceTree.hash,
    generated: true,
    prev: false,
    next: false,
  })}<p class="ddp-kicker">Docs / Handbook</p>

The Ultraviolet Developer Handbook is the public reference for learning and writing Ultraviolet. It is generated from the handbook chapter parts maintained in the language repository and published here as stable website pages.

<div class="spec-provenance">
  <strong>Generated handbook.</strong>
  <span>Source snapshot: <code>${escapeHtml(sourceTree.source)}</code></span>
  <span>SHA-256: <code>${sourceTree.hash}</code></span>
</div>

## Chapters

${chapterLinks}
`;
}

export function renderHandbookChapter(sourceTree, chapter) {
  return `${frontmatter({
    title: chapter.title,
    description: `Chapter ${chapter.number} of the Ultraviolet Developer Handbook.`,
    handbookSource: `${sourceTree.source}/${chapter.file}`,
    handbookHash: sourceTree.hash,
    generated: true,
    prev: false,
    next: false,
  })}<div class="spec-provenance">
  <strong>Generated from ${escapeHtml(chapter.file)}.</strong>
  <span>Handbook SHA-256: <code>${sourceTree.hash}</code></span>
</div>

${chapter.body}
`;
}

export function generatedHandbookManifest(sourceTree = readHandbookSourceTree()) {
  return {
    source: sourceTree.source,
    hash: sourceTree.hash,
    output: HANDBOOK_OUTPUT_DIR,
    chapters: sourceTree.chapters.map(({ body, content, ...chapter }) => chapter),
  };
}

export function docsPathForHandbookSlug(slug) {
  return slug === 'index'
    ? `${HANDBOOK_OUTPUT_DIR}/index.md`
    : `${HANDBOOK_OUTPUT_DIR}/${slug}/index.md`;
}

export function handbookRouteForSlug(slug) {
  return slug === 'index' ? '/docs/handbook/' : `/docs/handbook/${slug}/`;
}

export function frontmatter(fields) {
  const lines = ['---'];
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value === 'boolean') {
      lines.push(`${key}: ${value ? 'true' : 'false'}`);
    } else {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    }
  }
  lines.push('---');
  return `${lines.join('\n')}\n\n`;
}

export function sha256(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

export function normalizeNewlines(text) {
  return text.replace(/\r\n?/g, '\n');
}

export function sourceRelative(path) {
  return relative(process.cwd(), path).replaceAll('\\', '/');
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function chapterTitle(content, file) {
  const heading = content.match(/^##\s+(.+)$/m);
  if (!heading) {
    throw new Error(`${file} must contain a level-2 chapter heading.`);
  }
  return heading[1].trim();
}

function stripChapterHeading(content) {
  return content.replace(/^##\s+.+\n+/, '').trimStart();
}
