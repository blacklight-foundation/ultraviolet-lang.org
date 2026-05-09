import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import {
  CHAPTERS,
  SPEC_OUTPUT_DIR,
  docsPathForSlug,
  frontmatter,
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

function normalizeChapterBody(body) {
  const lines = body.split(/\r?\n/);
  const out = [];
  let inFence = false;
  let fenceLang = '';

  for (const line of lines) {
    const fence = line.match(/^```([A-Za-z0-9_-]*)\s*$/);
    if (fence) {
      if (!inFence) {
        inFence = true;
        fenceLang = fence[1] || '';
        out.push(['ebnf', 'uv'].includes(fenceLang) ? '```text' : line);
      } else {
        inFence = false;
        fenceLang = '';
        out.push(line);
      }
      continue;
    }

    if (!inFence && isFormalLine(line)) {
      if (out.at(-1) !== '```text') {
        if (out.at(-1) !== '') out.push('');
        out.push('```text');
      }
      out.push(line);
      continue;
    }

    if (out.at(-1) === '```text' && !isFormalLine(line)) {
      out.push('```');
      if (line !== '') out.push('');
    }

    if (inFence && fenceLang === 'math') {
      out.push(line.replaceAll('\\linewidth', '18em'));
    } else {
      out.push(line);
    }
  }

  if (out.at(-1) === '```text') {
    out.push('```');
  }

  return out.join('\n').replace(/\n{4,}/g, '\n\n\n');
}

function isFormalLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('|')) return false;
  if (/^#{1,6}\s/.test(trimmed)) return false;
  if (/^\*\*.*\*\*$/.test(trimmed)) return false;
  if (/^[-*]\s/.test(trimmed)) return false;
  if (/^\d+\.\s/.test(trimmed)) return false;
  if (/^\$\$/.test(trimmed)) return false;
  if (trimmed.includes('\\rule{18em}{0.4pt}')) return true;
  return /[ΓΣΞΩπσθλ⊢⇓⇑⇔⇒∀∃∈∉⊆⊥≠≤≥↦⟨⟩]/.test(trimmed);
}
