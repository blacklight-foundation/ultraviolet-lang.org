import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import {
  CHAPTERS,
  SPEC_OUTPUT_DIR,
  chapterNumber,
  docsPathForSlug,
  extractChapterSections,
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
const chapterEntries = CHAPTERS.map((chapter) => ({
  ...chapter,
  sections: extractChapterSections(chunks.get(chapter.slug) ?? ''),
}));

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
  `${JSON.stringify({ source: specSourceRelative(), hash, generatedAt, chapters: chapterEntries }, null, 2)}\n`,
  'utf8',
);

const { sectionCount, subsectionCount } = countOutlineEntries(chapterEntries);
console.log(
  `Generated ${CHAPTERS.length + 1} specification pages with ${sectionCount} sections and ${subsectionCount} subsections from ${specSourceLabel()}`,
);

function renderIndex(hash, generatedAt) {
  const groupMarkdown = [...groupedChapters().entries()]
    .map(([group, chapters]) => {
      const links = chapters
        .map((chapter) => {
          const number = chapterNumber(chapter.heading);
          return `<a class="spec-index-link" href="/docs/specification/${chapter.slug}/">
  <span>${escapeHtml(number)}</span>
  <strong>${escapeHtml(chapter.title)}</strong>
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

${renderSectionOutline()}
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

function renderSectionOutline() {
  const chapters = chapterEntries
    .map((chapter) => {
      const sections = chapter.sections
        .map((section) => renderSection(chapter, section))
        .join('\n');
      return `<li class="spec-outline-chapter">
  <a class="spec-outline-chapter-link" href="/docs/specification/${chapter.slug}/">
    <span>${escapeHtml(chapterNumber(chapter.heading))}</span>
    <strong>${escapeHtml(chapter.title)}</strong>
  </a>
  <ol class="spec-outline-sections">
${sections}
  </ol>
</li>`;
    })
    .join('\n');

  return `<section class="spec-outline" aria-labelledby="spec-complete-outline">
  <h2 id="spec-complete-outline">Complete Section Outline</h2>
  <ol class="spec-outline-list">
${chapters}
  </ol>
</section>`;
}

function renderSection(chapter, section) {
  const subsections =
    section.subsections.length > 0
      ? `<details class="spec-outline-subsections">
    <summary>${section.subsections.length} subsections</summary>
    <ol>
${section.subsections
  .map(
    (subsection) => `      <li><a href="/docs/specification/${chapter.slug}/#${subsection.anchor}">${escapeHtml(subsection.title)}</a></li>`,
  )
  .join('\n')}
    </ol>
  </details>`
      : '';

  return `    <li>
      <a href="/docs/specification/${chapter.slug}/#${section.anchor}">${escapeHtml(section.title)}</a>
${subsections}
    </li>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function countOutlineEntries(chapters) {
  return chapters.reduce(
    (counts, chapter) => ({
      sectionCount: counts.sectionCount + chapter.sections.length,
      subsectionCount:
        counts.subsectionCount +
        chapter.sections.reduce((total, section) => total + section.subsections.length, 0),
    }),
    { sectionCount: 0, subsectionCount: 0 },
  );
}
