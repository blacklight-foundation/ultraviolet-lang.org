import { existsSync, readFileSync } from 'node:fs';
import katex from 'katex';
import {
  CHAPTERS,
  SPEC_OUTPUT_DIR,
  docsPathForSlug,
  extractChapterSections,
  frontmatter,
  normalizeChapterBody,
  readSpec,
  specSourceLabel,
  specSourceRelative,
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
  if (manifest.source !== specSourceRelative()) {
    errors.push(`Spec source drift: generated ${manifest.source}, current ${specSourceRelative()}.`);
  }
  checkManifestChapters(manifest);
}

checkCanonicalChapterCoverage();

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
  if (!content.includes(`specSource: "${specSourceRelative()}"`)) {
    errors.push(`${path} does not include current spec source ${specSourceRelative()}.`);
  }
  if (content.includes('\\linewidth')) {
    errors.push(`${path} contains unsupported \\linewidth.`);
  }
  if (stripDisplayMath(content).includes('\\rule{')) {
    errors.push(`${path} contains literal LaTeX rule markup outside a rendered math block.`);
  }
  if (content.includes('<!--')) {
    errors.push(`${path} contains an HTML comment in generated specification content.`);
  }
  if (stripDisplayMath(content).match(/[\u{1D4AB}\u{1D4AF}\u{1D505}]/u)) {
    errors.push(`${path} contains raw mathematical alphabet glyphs outside generated math.`);
  }

  checkChapterBody(path, chapter, content, chunks.get(chapter.slug));
  checkMathBlocks(path, content);
  checkFences(path, content);
  checkFormalNotationNotFenced(path, content);
  checkDanglingMathClosers(path, content);
  checkMojibake(path, content);
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
  for (const chapter of expectedManifestChapters()) {
    for (const section of chapter.sections) {
      if (!index.includes(`/docs/specification/${chapter.slug}/#${section.anchor}`)) {
        errors.push(`${indexPath} is missing section link ${chapter.slug}#${section.anchor}.`);
      }
      for (const subsection of section.subsections) {
        if (!index.includes(`/docs/specification/${chapter.slug}/#${subsection.anchor}`)) {
          errors.push(`${indexPath} is missing subsection link ${chapter.slug}#${subsection.anchor}.`);
        }
      }
    }
  }
  for (const group of new Set(CHAPTERS.map((chapter) => chapter.group))) {
    if (!index.includes(`<section class="spec-index-group"`) || !index.includes(`>${group}</h2>`)) {
      errors.push(`${indexPath} is missing grouped navigation section ${group}.`);
    }
  }
  if (!index.includes(`specHash: "${hash}"`)) {
    errors.push(`${indexPath} does not include current spec hash.`);
  }
  if (!index.includes(`specSource: "${specSourceRelative()}"`)) {
    errors.push(`${indexPath} does not include current spec source ${specSourceRelative()}.`);
  }
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

const { sectionCount, subsectionCount } = countOutlineEntries(expectedManifestChapters());
console.log(
  `Specification docs are current: ${CHAPTERS.length + 1} pages, ${sectionCount} sections, ${subsectionCount} subsections, hash ${hash}`,
);

function checkManifestChapters(manifest) {
  const manifestChapters = JSON.stringify(manifest.chapters);
  const expectedChapters = JSON.stringify(expectedManifestChapters());
  if (manifestChapters !== expectedChapters) {
    errors.push(`${manifestPath} chapters do not match scripts/spec-utils.mjs.`);
  }
}

function expectedManifestChapters() {
  return CHAPTERS.map((chapter) => ({
    ...chapter,
    sections: extractChapterSections(chunks.get(chapter.slug) ?? ''),
  }));
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

function checkCanonicalChapterCoverage() {
  const chapterHeadings = [
    ...normalized.matchAll(/^## (.+)$/gm),
  ].map((match) => match[1].trim());
  const expectedHeadings = CHAPTERS.map((chapter) => chapter.heading);

  for (const heading of chapterHeadings) {
    if (!expectedHeadings.includes(heading)) {
      errors.push(`Canonical spec has unmapped chapter heading: ${heading}`);
    }
  }

  for (const heading of expectedHeadings) {
    if (!chapterHeadings.includes(heading)) {
      errors.push(`Configured chapter is missing from canonical spec: ${heading}`);
    }
  }
}

function checkChapterBody(path, chapter, content, sourceBody) {
  if (!sourceBody) return;

  const expected = `${frontmatter({
    title: chapter.title,
    description: `${chapter.heading} of the Ultraviolet language specification.`,
    specSource: specSourceRelative(),
    specHash: hash,
    generatedAt: extractGeneratedAt(content),
    generated: true,
  })}<div class="spec-provenance">
  <strong>Generated from ${specSourceLabel()}.</strong>
  <span>SHA-256: <code>${hash}</code></span>
</div>

${normalizeChapterBody(sourceBody)}
`;

  if (content !== expected) {
    errors.push(`${path} body does not match the normalized current SPECIFICATION.md chunk.`);
  }
}

function extractGeneratedAt(content) {
  const match = content.match(/^generatedAt: "([^"]+)"$/m);
  if (!match) {
    errors.push('Generated specification page is missing generatedAt frontmatter.');
    return '';
  }
  return match[1];
}

function stripDisplayMath(content) {
  return content.replace(/^\$\$\n[\s\S]*?\n\$\$/gm, '');
}

function checkMathBlocks(path, content) {
  const blockPattern = /^\$\$\n([\s\S]*?)\n\$\$/gm;
  let mathBlocks = 0;
  for (const match of content.matchAll(blockPattern)) {
    mathBlocks += 1;
    checkMathBlockContent(path, match[1]);
    try {
      katex.renderToString(match[1], {
        throwOnError: true,
        displayMode: true,
        strict: 'error',
      });
    } catch (error) {
      errors.push(`${path} has invalid math block: ${error.message}`);
    }
  }

  if (content.includes('```math')) {
    errors.push(`${path} contains fenced math; generated spec math must use display math delimiters.`);
  }

  const hasFormalNotation = /[ΓΣΞΩπσθλεκαβδτ⊢⇓⇑⇔⇒→∀∃∈∉∋⊆⊄⊥⊤≠≤≥≡≈↦⟨⟩∧∨¬∪∩∅∞ℕ𝒯⋃×]/u.test(content);
  if (hasFormalNotation && mathBlocks === 0) {
    errors.push(`${path} contains formal notation but no display math blocks.`);
  }

  // Generated spec pages intentionally avoid validating inline dollar spans.
  // The canonical spec contains source snippets such as `$Cl` and `$ExecutionDomain`
  // that are language syntax, not LaTeX.
}

function checkMathBlockContent(path, body) {
  if (body.includes('<!--')) {
    errors.push(`${path} has an HTML comment inside a generated math block.`);
  }

  if (/[^\x00-\x7F]/.test(body)) {
    errors.push(`${path} has raw non-ASCII inside generated math; convert it to KaTeX-safe LaTeX commands.`);
  }

  if (/\\mathsf\{(?:For|The|This|These|Those|If|When|While|Every|Each|Calls|Executables|Libraries)\}/.test(body)) {
    errors.push(`${path} appears to render prose as generated math.`);
  }
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
      errors.push(`${path} has an empty fenced block starting at line ${fenceStart}.`);
    }
    inFence = false;
    fenceStart = 0;
    contentLines = 0;
  });

  if (inFence) {
    errors.push(`${path} has an unclosed fenced block starting at line ${fenceStart}.`);
  }
}

function checkFormalNotationNotFenced(path, content) {
  const fencePattern = /```[A-Za-z0-9_-]*\n([\s\S]*?)\n```/g;
  for (const match of content.matchAll(fencePattern)) {
    if (hasFormalNotation(match[1])) {
      errors.push(`${path} contains formal notation inside a fenced code block.`);
    }
  }
}

function checkDanglingMathClosers(path, content) {
  const lines = content.split(/\r?\n/);
  for (let index = 1; index < lines.length; index += 1) {
    if (lines[index - 1] === '$$' && /^[}\])]+[,;]?$/.test(lines[index].trim())) {
      errors.push(`${path} has a dangling formal closer after display math at line ${index + 1}.`);
    }
  }
}

function hasFormalNotation(text) {
  return /[\u00ac\u00b1\u00b7\u00d7\u0393\u0394\u039e\u03a0\u03a3\u03a6\u03a9\u03b1\u03b2\u03b3\u03b4\u03b5\u03b8\u03ba\u03bb\u03c0\u03c1\u03c3\u03c4\u03c7\u03c9\u2113\u2115\u2118\u211d\u2124\u2191\u2192\u2194\u21a6\u21c0\u21d0\u21d1\u21d2\u21d3\u21d4\u2200\u2203\u2205\u2208\u2209\u220b\u2211\u2216\u2218\u221e\u2227\u2228\u2229\u222a\u2260\u2261\u2264\u2265\u227a\u2282\u2284\u2286\u2288\u228e\u2295\u22a2\u22a3\u22a5\u22a8\u22ac\u22c0\u22c3\u22ef\u2308\u2309\u230a\u230b\u25b7\u25c1\u27e8\u27e9\u{1D4AB}\u{1D4AF}\u{1D505}]/u.test(text);
}

function checkMojibake(path, content) {
  const suspicious = ['Ã', 'Â', 'Î', 'Ï', 'â'];
  const lines = content.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (suspicious.some((token) => line.includes(token))) {
      errors.push(`${path} has suspicious mojibake at line ${index + 1}: ${line.slice(0, 120)}`);
    }
  });
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
