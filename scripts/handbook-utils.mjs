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
const HEADING_PATTERN = /^(#{3,5})\s+(.+)$/gm;

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
  const referenceTree = renderHandbookReferenceTree(sourceTree);

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

## Reference Tree

${referenceTree}
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

function renderHandbookReferenceTree(sourceTree) {
  const chapters = sourceTree.chapters
    .map((chapter) => {
      const sections = headingTreeForChapter(chapter);
      return `<li>
  <details open>
    <summary><a href="${chapter.route}">${escapeHtml(chapter.title)}</a></summary>
${renderHeadingNodes(sections, 4)}
  </details>
</li>`;
    })
    .join('\n');

  return `<ol class="handbook-reference-tree">
${chapters}
</ol>`;
}

function renderHeadingNodes(nodes, indent) {
  if (nodes.length === 0) return `${' '.repeat(indent)}<ol></ol>`;

  const padding = ' '.repeat(indent);
  const childPadding = ' '.repeat(indent + 2);
  const items = nodes
    .map((node) => {
      const children = node.children.length > 0 ? `\n${renderHeadingNodes(node.children, indent + 4)}\n${childPadding}` : '';
      return `${childPadding}<li><a href="${node.href}">${escapeHtml(node.title)}</a>${children}</li>`;
    })
    .join('\n');

  return `${padding}<ol>
${items}
${padding}</ol>`;
}

function headingTreeForChapter(chapter) {
  const slugger = createSlugger();
  const root = { depth: 2, children: [] };
  const stack = [root];

  for (const match of chapter.body.matchAll(HEADING_PATTERN)) {
    const depth = match[1].length;
    const title = headingText(match[2]);
    const node = {
      depth,
      title,
      href: `${chapter.route}#${slugger.slug(title)}`,
      children: [],
    };

    while (stack.at(-1).depth >= depth) stack.pop();
    stack.at(-1).children.push(node);
    stack.push(node);
  }

  return root.children;
}

function headingText(value) {
  return value
    .replace(/!\[([^\]]*)]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .trim();
}

function createSlugger() {
  const occurrences = new Map();
  return {
    slug(value) {
      const base = slug(value);
      const count = occurrences.get(base) ?? 0;
      occurrences.set(base, count + 1);
      return count === 0 ? base : `${base}-${count}`;
    },
  };
}

function slug(value) {
  return value
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}\p{Mark}\p{Connector_Punctuation} -]/gu, '')
    .replace(/ /g, '-');
}
