import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SPEC_OUTPUT_DIR, docsPathForSlug } from './spec-utils.mjs';

const errors = [];
const distSpecDir = join('dist', 'docs', 'specification');
const manifestPath = `${SPEC_OUTPUT_DIR}/manifest.json`;

if (!existsSync(manifestPath)) {
  errors.push(`Missing ${manifestPath}. Run npm run docs:spec:generate before building.`);
} else if (!existsSync(distSpecDir)) {
  errors.push(`Missing ${distSpecDir}. Run npm run build before checking rendered spec output.`);
} else {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  let renderedWithKatex = 0;
  let expectedWithMath = 0;

  for (const page of manifest.pages) {
    const sourcePath = docsPathForSlug(page.slug);
    const outputPath = join(distSpecDir, ...page.slug.split('/'), 'index.html');

    if (!existsSync(outputPath)) {
      errors.push(`Missing built spec page ${outputPath}.`);
      continue;
    }

    const source = readFileSync(sourcePath, 'utf8');
    const output = readFileSync(outputPath, 'utf8');
    const hasMath = /^\$\$/m.test(source);

    if (hasMath) expectedWithMath += 1;
    if (output.includes('```math') || output.includes('language-math')) {
      errors.push(`${outputPath} renders generated math as a fenced code block.`);
    }
    if (hasMath && output.includes('katex-display')) {
      renderedWithKatex += 1;
    }
    if (hasMath && !output.includes('katex-display')) {
      errors.push(`${outputPath} does not contain rendered KaTeX display markup.`);
    }
    if (/\\mathsf\{(?:For|The|This|These|Those|If|When|While|Every|Each|Calls|Executables|Libraries)\}/.test(output)) {
      errors.push(`${outputPath} appears to render prose inside KaTeX output.`);
    }
    if (output.includes('&lt;!--') || output.includes('<!-- Source:')) {
      errors.push(`${outputPath} contains an HTML comment in rendered content.`);
    }
  }

  if (expectedWithMath > 0 && renderedWithKatex !== expectedWithMath) {
    errors.push(
      `Built spec KaTeX coverage mismatch: ${renderedWithKatex}/${expectedWithMath} generated math pages render KaTeX.`,
    );
  }
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('Built specification pages render generated math with KaTeX.');
