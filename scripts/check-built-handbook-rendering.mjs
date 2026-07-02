import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { HANDBOOK_MANIFEST_PATH } from './handbook-utils.mjs';
import { documentationRedirects } from '../src/data/documentationRedirects.mjs';

const errors = [];
const distHandbookDir = join('dist', 'docs', 'handbook');
const representativeHandbookRoutes = [
  '/docs/handbook/',
  '/docs/handbook/01-introduction/',
  '/docs/handbook/23-key-system/',
  '/docs/handbook/29-grammar-reference/',
];
const representativeRedirectRoutes = [
  '/docs/specification/',
  '/docs/specification/key-system/',
  '/docs/language-tour/',
];

if (!existsSync(HANDBOOK_MANIFEST_PATH)) {
  errors.push(`Missing ${HANDBOOK_MANIFEST_PATH}. Run npm run docs:handbook:generate before building.`);
} else if (!existsSync(distHandbookDir)) {
  errors.push(`Missing ${distHandbookDir}. Run npm run build before checking rendered handbook output.`);
} else {
  checkRepresentativeHandbookRoutes();
  checkRepresentativeRedirectRoutes();
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('Built handbook pages and legacy redirects render.');

function checkRepresentativeHandbookRoutes() {
  for (const route of representativeHandbookRoutes) {
    const outputPath = builtDocsPath(route);
    if (!existsSync(outputPath)) {
      errors.push(`Missing representative built route ${outputPath}.`);
      continue;
    }

    const output = readFileSync(outputPath, 'utf8');
    if (route === '/docs/handbook/' && !output.includes('Ultraviolet Developer Handbook')) {
      errors.push(`${outputPath} does not render the handbook index.`);
    }
    if (route.includes('/23-key-system/') && !output.includes('Key System')) {
      errors.push(`${outputPath} does not render the key-system handbook chapter.`);
    }
    if (route.includes('/29-grammar-reference/') && !output.includes('Complete Grammar Reference')) {
      errors.push(`${outputPath} does not render the grammar handbook chapter.`);
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
