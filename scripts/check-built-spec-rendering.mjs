import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SPEC_OUTPUT_DIR, docsPathForSlug } from './spec-utils.mjs';
import { documentationRedirects } from '../src/data/documentationRedirects.mjs';

const errors = [];
const distSpecDir = join('dist', 'docs', 'specification');
const manifestPath = `${SPEC_OUTPUT_DIR}/manifest.json`;
const representativeSpecRoutes = [
  '/docs/specification/',
  '/docs/specification/modal-and-special-types/',
  '/docs/specification/modal-and-special-types/132-state-fields/',
  '/docs/specification/asynchronous-operations/213-composition-forms/',
  '/docs/specification/diagnostic-index/',
  '/docs/specification/complete-grammar-reference/b1-lexical-grammar/',
  '/docs/specification/layout-abi-and-runtime-reference/',
];
const representativeRedirectRoutes = [
  '/docs/language-tour/',
  '/docs/reference/runtime-and-builtins/',
];

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

  checkRepresentativeSpecRoutes();
  checkRepresentativeRedirectRoutes();
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('Built specification pages render generated math with KaTeX.');

function checkRepresentativeSpecRoutes() {
  for (const route of representativeSpecRoutes) {
    const outputPath = builtDocsPath(route);
    if (!existsSync(outputPath)) {
      errors.push(`Missing representative built route ${outputPath}.`);
      continue;
    }

    const output = readFileSync(outputPath, 'utf8');
    if (route.includes('/132-state-fields/') && !output.includes('spec-reader-panel')) {
      errors.push(`${outputPath} does not render the section reader panel.`);
    }
    if (route.includes('/213-composition-forms/') && !output.includes('spec-rule-map')) {
      errors.push(`${outputPath} does not render the oversized section rule map.`);
    }
    if (route.includes('/diagnostic-index/') && !output.includes('Diagnostic Index')) {
      errors.push(`${outputPath} does not render the diagnostic appendix.`);
    }
    if (route.includes('/b1-lexical-grammar/') && !output.includes('Lexical Grammar')) {
      errors.push(`${outputPath} does not render the grammar appendix section.`);
    }
  }
}

function checkRepresentativeRedirectRoutes() {
  for (const route of representativeRedirectRoutes) {
    const target = documentationRedirects[route];
    if (!target) {
      errors.push(`Missing configured redirect for representative route ${route}.`);
      continue;
    }

    const outputPath = builtDocsPath(route);
    if (!existsSync(outputPath)) {
      errors.push(`Missing representative redirect output ${outputPath}.`);
      continue;
    }

    const output = readFileSync(outputPath, 'utf8');
    if (!output.includes(target)) {
      errors.push(`${outputPath} does not include redirect target ${target}.`);
    }
  }
}

function builtDocsPath(route) {
  const normalized = route.endsWith('/') ? route.slice(1, -1) : route.slice(1);
  return join('dist', normalized, 'index.html');
}
