import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import {
  CHAPTERS,
  SPEC_OUTPUT_DIR,
  docsPathForSlug,
  frontmatter,
  normalizeChapterBody,
  readSpec,
  specSourceLabel,
  specSourceRelative,
  splitChapters,
} from './spec-utils.mjs';

const { normalized, hash } = readSpec();
const chunks = splitChapters(normalized);
const generatedAt = new Date().toISOString();

mkdirSync(SPEC_OUTPUT_DIR, { recursive: true });
rmSync(SPEC_OUTPUT_DIR, { recursive: true, force: true });
mkdirSync(SPEC_OUTPUT_DIR, { recursive: true });

writeFileSync(docsPathForSlug('index'), renderIndex(hash, generatedAt), 'utf8');

for (const chapter of CHAPTERS) {
  const body = chunks.get(chapter.slug);
  if (!body) {
    throw new Error(`Missing specification chapter: ${chapter.heading}`);
  }
  writeFileSync(docsPathForSlug(chapter.slug), renderChapter(chapter, body, hash, generatedAt), 'utf8');
}

writeFileSync(
  `${SPEC_OUTPUT_DIR}/manifest.json`,
  `${JSON.stringify({ source: specSourceRelative(), hash, generatedAt, chapters: CHAPTERS }, null, 2)}\n`,
  'utf8',
);

console.log(`Generated ${CHAPTERS.length + 1} specification pages from ${specSourceLabel()}`);

function renderIndex(hash, generatedAt) {
  const groups = new Map();
  for (const chapter of CHAPTERS) {
    const group = groups.get(chapter.group) ?? [];
    group.push(chapter);
    groups.set(chapter.group, group);
  }

  const groupMarkdown = [...groups.entries()]
    .map(([group, chapters]) => {
      const links = chapters
        .map((chapter) => `- [${chapter.heading}](/docs/specification/${chapter.slug}/)`)
        .join('\n');
      return `## ${group}\n\n${links}`;
    })
    .join('\n\n');

  return `${frontmatter({
    title: 'Specification',
    description: 'Generated website edition of the Ultraviolet language specification.',
    specSource: specSourceRelative(),
    specHash: hash,
    generatedAt,
  })}<div class="spec-provenance">
  <strong>Generated specification.</strong>
  <span>Source: <code>${specSourceRelative()}</code></span>
  <span>SHA-256: <code>${hash}</code></span>
</div>

The Ultraviolet language specification is the authoritative reference for syntax, static semantics, dynamic semantics, lowering, diagnostics, ABI behavior, and conformance.

Use the guide pages for learning paths and the generated specification pages when you need exact rules.

${groupMarkdown}
`;
}

function renderChapter(chapter, body, hash, generatedAt) {
  const normalizedBody = normalizeChapterBody(body);
  return `${frontmatter({
    title: chapter.title,
    description: `${chapter.heading} of the Ultraviolet language specification.`,
    specSource: specSourceRelative(),
    specHash: hash,
    generatedAt,
    generated: true,
  })}<div class="spec-provenance">
  <strong>Generated from ${specSourceLabel()}.</strong>
  <span>SHA-256: <code>${hash}</code></span>
</div>

${normalizedBody}
`;
}
