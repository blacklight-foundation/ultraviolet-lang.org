import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import {
  CHAPTERS,
  SPEC_OUTPUT_DIR,
  docsPathForSlug,
  frontmatter,
  groupedChapters,
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
  const groupMarkdown = [...groupedChapters().entries()]
    .map(([group, chapters]) => {
      const links = chapters
        .map((chapter) => {
          const chapterNumber = chapter.heading.replace(` ${chapter.title}`, '');
          return `<a class="spec-index-link" href="/docs/specification/${chapter.slug}/">
  <span>${chapterNumber}</span>
  <strong>${chapter.title}</strong>
</a>`;
        })
        .join('\n');
      return `<section class="spec-index-group" aria-labelledby="spec-${slugify(group)}">
  <h2 id="spec-${slugify(group)}">${group}</h2>
  <div class="spec-index-grid">
${links}
  </div>
</section>`;
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

<div class="spec-reader-map">
  <a href="/docs/reference/specification-reading-guide/">Reading guide</a>
  <a href="/docs/specification/complete-grammar-reference/">Grammar</a>
  <a href="/docs/specification/diagnostic-index/">Diagnostics</a>
  <a href="/docs/reference/documentation-audit/">Claim audit</a>
</div>

The Ultraviolet language specification is the authoritative reference for syntax, static semantics, dynamic semantics, lowering, diagnostics, ABI behavior, and conformance. The generated pages below preserve chapter boundaries from <code>${specSourceRelative()}</code> and render formal notation as display mathematics.

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

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
