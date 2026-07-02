import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import {
  SPEC_AGGREGATE_PATH,
  SPEC_OUTPUT_DIR,
  chapterNumber,
  docsPathForSlug,
  frontmatter,
  normalizeChapterBody,
  readSpecSourceTree,
  specAggregateRelative,
  specSourceLabel,
  specSourceRelative,
  specRouteForSlug,
} from './spec-utils.mjs';

const sourceTree = readSpecSourceTree();
const { hash } = sourceTree;
const generatedAt = new Date().toISOString();
const chapterEntries = sourceTree.chapters;

writeGeneratedFile(SPEC_AGGREGATE_PATH, sourceTree.aggregate);

const outputDir = resolve(process.cwd(), SPEC_OUTPUT_DIR);
assertInsideWorkspace(outputDir);
mkdirSync(outputDir, { recursive: true });
rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

writeGeneratedFile(docsPathForSlug('index'), renderIndex(hash, generatedAt));

for (const entry of chapterEntries) {
  if (!entry?.body) {
    throw new Error(`Missing specification chapter: ${entry.heading}`);
  }

  writeGeneratedFile(docsPathForSlug(entry.slug), renderChapter(entry, hash, generatedAt));

  for (const section of entry.sectionPages) {
    writeGeneratedFile(
      docsPathForSlug(section.slug),
      renderSectionPage(entry, section, hash, generatedAt),
    );
  }
}

writeFileSync(
  `${SPEC_OUTPUT_DIR}/manifest.json`,
  `${JSON.stringify(
    {
      source: specSourceRelative(),
      aggregate: specAggregateRelative(),
      hash,
      generatedAt,
      chapters: chapterEntries.map(stripGeneratedBodies),
      pages: generatedPageEntries(chapterEntries),
    },
    null,
    2,
  )}\n`,
  'utf8',
);

const { sectionCount, subsectionCount } = countOutlineEntries(chapterEntries);
const generatedPageCount = generatedPageEntries(chapterEntries).length + 1;
console.log(
  `Generated ${generatedPageCount} specification pages with ${sectionCount} sections and ${subsectionCount} subsections from ${specSourceLabel()}`,
);

function renderIndex(hash, generatedAt) {
  const groupMarkdown = [...groupedChapterEntries().entries()]
    .map(([group, chapters]) => {
      const links = chapters
        .map((chapter) => {
          const number = chapterNumber(chapter.heading);
          const sectionCount = chapter.sections.length;
          const sectionLabel =
            sectionCount === 1 ? '1 section' : sectionCount > 1 ? `${sectionCount} sections` : 'Reference';
          return `<a class="spec-index-link" href="${specRouteForSlug(chapter.slug)}">
  <span>${escapeHtml(number)}</span>
  <strong>${escapeHtml(chapter.title)}</strong>
  <small>${escapeHtml(sectionLabel)}</small>
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
  <a href="/docs/specification/front-matter/03-required-feature-section-template/">Section template</a>
  <a href="/docs/specification/complete-grammar-reference/">Grammar</a>
  <a href="/docs/specification/diagnostic-index/">Diagnostics</a>
  <a href="/docs/specification/layout-abi-and-runtime-reference/">ABI and runtime</a>
</div>

The Ultraviolet language specification is the authoritative reference for syntax, static semantics, dynamic semantics, lowering, diagnostics, ABI behavior, and conformance. The generated pages below preserve the chapter outline from <code>${specSourceRelative()}</code> and publish section-sized pages for faster reading and rendering.

Use the short onboarding pages for learning paths and the generated specification pages when you need exact rules.

${groupMarkdown}

${renderSectionOutline()}
`;
}

function renderChapter(chapter, hash, generatedAt) {
  const hasSectionPages = chapter.sectionPages.length > 0;
  const normalizedIntro = hasSectionPages
    ? renderChapterSourceBody(chapter, chapter.intro)
    : renderChapterSourceBody(chapter, chapter.body);
  const sectionList = hasSectionPages ? `\n\n${renderChapterSectionList(chapter)}` : '';

  return `${frontmatter({
    title: chapter.title,
    description: hasSectionPages
      ? `${chapter.heading} section index for the Ultraviolet language specification.`
      : `${chapter.heading} of the Ultraviolet language specification.`,
    specSource: specSourceRelative(),
    specHash: hash,
    generatedAt,
    generated: true,
  })}<div class="spec-provenance">
  <strong>Generated from ${specSourceLabel()}.</strong>
  <span>SHA-256: <code>${hash}</code></span>
</div>

${normalizedIntro}${sectionList}
`;
}

function renderSectionPage(chapter, section, hash, generatedAt) {
  return `${frontmatter({
    title: section.title,
    description: `${section.title} from ${chapter.heading} of the Ultraviolet language specification.`,
    specSource: specSourceRelative(),
    specHash: hash,
    specChapter: chapter.slug,
    specSection: section.anchor,
    generatedAt,
    generated: true,
  })}<div class="spec-provenance">
  <strong>Generated from ${specSourceLabel()}.</strong>
  <span>SHA-256: <code>${hash}</code></span>
</div>

<div class="spec-section-context">
  <a href="${specRouteForSlug(chapter.slug)}">${escapeHtml(chapter.heading)}</a>
  <span>${escapeHtml(chapter.title)}</span>
</div>

${normalizeChapterBody(section.body)}
`;
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function groupedChapterEntries() {
  const groups = new Map();
  for (const chapter of chapterEntries) {
    const group = groups.get(chapter.group) ?? [];
    group.push(chapter);
    groups.set(chapter.group, group);
  }
  return groups;
}

function renderSectionOutline() {
  const chapters = chapterEntries
    .map((chapter) => {
      const sections = chapter.sections
        .map((section) => renderSection(chapter, section))
        .join('\n');
      return `<li class="spec-outline-chapter">
  <a class="spec-outline-chapter-link" href="${specRouteForSlug(chapter.slug)}">
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
  const sectionRoute = section.slug ? specRouteForSlug(section.slug) : specRouteForSlug(chapter.slug);
  const subsections =
    section.subsections.length > 0
      ? `<details class="spec-outline-subsections">
    <summary>${section.subsections.length} subsections</summary>
    <ol>
${section.subsections
  .map(
    (subsection) => `      <li><a href="${sectionRoute}#${subsection.anchor}">${escapeHtml(subsection.title)}</a></li>`,
  )
  .join('\n')}
    </ol>
  </details>`
      : '';

  return `    <li>
      <a href="${sectionRoute}">${escapeHtml(section.title)}</a>
${subsections}
    </li>`;
}

function renderChapterSectionList(chapter) {
  const sections = chapter.sections
    .map((section) => renderSection(chapter, section))
    .join('\n');
  return `<section class="spec-chapter-sections" aria-labelledby="spec-chapter-sections">
  <h2 id="spec-chapter-sections">Complete Section List</h2>
  <ol class="spec-outline-sections">
${sections}
  </ol>
</section>`;
}

function renderChapterSourceBody(chapter, body) {
  return normalizeChapterBody(body).replace(
    /\]\(\.\/([A-Za-z0-9_-]+)\.md\)/g,
    (_match, anchor) => `](${specRouteForSlug(`${chapter.slug}/${anchor}`)})`,
  );
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

function writeGeneratedFile(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, 'utf8');
}

function assertInsideWorkspace(path) {
  const workspace = resolve(process.cwd());
  const pathRelativeToWorkspace = relative(workspace, path);
  if (pathRelativeToWorkspace.startsWith('..') || pathRelativeToWorkspace === '') {
    throw new Error(`Refusing to write generated specification output outside the workspace: ${path}`);
  }
}

function stripGeneratedBodies(chapter) {
  const { body, intro, sectionPages, ...entry } = chapter;
  return {
    ...entry,
    sections: chapter.sections.map((section) => ({
      ...section,
      subsections: section.subsections.map((subsection) => ({ ...subsection })),
    })),
  };
}

function generatedPageEntries(chapters) {
  return chapters.flatMap((chapter) => [
    {
      kind: 'chapter',
      slug: chapter.slug,
      title: chapter.title,
      chapterSlug: chapter.slug,
    },
    ...chapter.sectionPages.map((section) => ({
      kind: 'section',
      slug: section.slug,
      title: section.title,
      chapterSlug: chapter.slug,
      sectionAnchor: section.anchor,
    })),
  ]);
}
