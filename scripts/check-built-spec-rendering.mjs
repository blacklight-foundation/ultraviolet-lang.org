import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CHAPTERS, docsPathForSlug } from './spec-utils.mjs';

const errors = [];
const distSpecDir = join('dist', 'docs', 'specification');

if (!existsSync(distSpecDir)) {
  errors.push(`Missing ${distSpecDir}. Run npm run build before checking rendered spec output.`);
} else {
  let renderedWithKatex = 0;
  let expectedWithMath = 0;

  for (const chapter of CHAPTERS) {
    const sourcePath = docsPathForSlug(chapter.slug);
    const outputPath = join(distSpecDir, chapter.slug, 'index.html');

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
