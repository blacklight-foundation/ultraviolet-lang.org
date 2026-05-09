import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { basename, relative } from 'node:path';

export const SPEC_SOURCE_PATH =
  process.env.ULTRAVIOLET_SPEC_PATH ?? 'C:\\Dev\\Ultraviolet\\SPECIFICATION.md';

export const SPEC_OUTPUT_DIR = 'src/content/docs/docs/specification';

export const CHAPTERS = [
  {
    slug: 'front-matter',
    heading: '0. Front Matter',
    title: 'Front Matter',
    group: 'Front Matter',
  },
  {
    slug: 'conformance-and-notation',
    heading: '1. Conformance and Notation',
    title: 'Conformance and Notation',
    group: 'Foundation',
  },
  {
    slug: 'diagnostic-infrastructure',
    heading: '2. Diagnostic Infrastructure',
    title: 'Diagnostic Infrastructure',
    group: 'Foundation',
  },
  {
    slug: 'project-and-compilation-model',
    heading: '3. Project and Compilation Model',
    title: 'Project and Compilation Model',
    group: 'Toolchain',
  },
  {
    slug: 'source-text-and-lexical-structure',
    heading: '4. Source Text and Lexical Structure',
    title: 'Source Text and Lexical Structure',
    group: 'Source Language',
  },
  {
    slug: 'parsing-and-ast-infrastructure',
    heading: '5. Parsing and AST Infrastructure',
    title: 'Parsing and AST Infrastructure',
    group: 'Source Language',
  },
  {
    slug: 'abstract-machine-objects-responsibility-and-authority',
    heading: '6. Abstract Machine, Objects, Responsibility, and Authority',
    title: 'Abstract Machine, Objects, Responsibility, and Authority',
    group: 'Semantics',
  },
  {
    slug: 'name-resolution-and-visibility',
    heading: '7. Name Resolution and Visibility',
    title: 'Name Resolution and Visibility',
    group: 'Semantics',
  },
  {
    slug: 'type-system-core',
    heading: '8. Type System Core',
    title: 'Type System Core',
    group: 'Semantics',
  },
  {
    slug: 'attributes-and-metadata',
    heading: '9. Attributes and Metadata',
    title: 'Attributes and Metadata',
    group: 'Source Language',
  },
  {
    slug: 'permissions-and-binding-state',
    heading: '10. Permissions and Binding State',
    title: 'Permissions and Binding State',
    group: 'Core Surfaces',
  },
  {
    slug: 'module-level-forms',
    heading: '11. Module-Level Forms',
    title: 'Module-Level Forms',
    group: 'Source Language',
  },
  {
    slug: 'concrete-data-types',
    heading: '12. Concrete Data Types',
    title: 'Concrete Data Types',
    group: 'Types',
  },
  {
    slug: 'modal-and-special-types',
    heading: '13. Modal and Special Types',
    title: 'Modal and Special Types',
    group: 'Core Surfaces',
  },
  {
    slug: 'abstraction-and-polymorphism',
    heading: '14. Abstraction and Polymorphism',
    title: 'Abstraction and Polymorphism',
    group: 'Types',
  },
  {
    slug: 'procedures-and-contracts',
    heading: '15. Procedures and Contracts',
    title: 'Procedures and Contracts',
    group: 'Core Surfaces',
  },
  {
    slug: 'expressions',
    heading: '16. Expressions',
    title: 'Expressions',
    group: 'Source Language',
  },
  {
    slug: 'patterns',
    heading: '17. Patterns',
    title: 'Patterns',
    group: 'Source Language',
  },
  {
    slug: 'statements-and-blocks',
    heading: '18. Statements and Blocks',
    title: 'Statements and Blocks',
    group: 'Source Language',
  },
  {
    slug: 'key-system',
    heading: '19. Key System',
    title: 'Key System',
    group: 'Core Surfaces',
  },
  {
    slug: 'structured-parallelism',
    heading: '20. Structured Parallelism',
    title: 'Structured Parallelism',
    group: 'Core Surfaces',
  },
  {
    slug: 'asynchronous-operations',
    heading: '21. Asynchronous Operations',
    title: 'Asynchronous Operations',
    group: 'Core Surfaces',
  },
  {
    slug: 'compile-time-execution-and-metaprogramming',
    heading: '22. Compile-Time Execution and Metaprogramming',
    title: 'Compile-Time Execution and Metaprogramming',
    group: 'Generation',
  },
  {
    slug: 'foreign-function-interface',
    heading: '23. Foreign Function Interface',
    title: 'Foreign Function Interface',
    group: 'Interop',
  },
  {
    slug: 'common-lowering-program-lifecycle-and-backend',
    heading: '24. Common Lowering, Program Lifecycle, and Backend',
    title: 'Common Lowering, Program Lifecycle, and Backend',
    group: 'Backend',
  },
  {
    slug: 'diagnostic-index',
    heading: 'Appendix A. Diagnostic Index',
    title: 'Diagnostic Index',
    group: 'Appendices',
  },
  {
    slug: 'complete-grammar-reference',
    heading: 'Appendix B. Complete Grammar Reference',
    title: 'Complete Grammar Reference',
    group: 'Appendices',
  },
  {
    slug: 'ast-form-index',
    heading: 'Appendix C. AST Form Index',
    title: 'AST Form Index',
    group: 'Appendices',
  },
  {
    slug: 'layout-abi-and-runtime-reference',
    heading: 'Appendix D. Layout, ABI, and Runtime Reference',
    title: 'Layout, ABI, and Runtime Reference',
    group: 'Appendices',
  },
];

export function readSpec() {
  const raw = readFileSync(SPEC_SOURCE_PATH, 'utf8');
  return {
    raw,
    normalized: normalizeSpecText(raw),
    hash: sha256(raw),
  };
}

export function sha256(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

export function specSourceLabel() {
  return basename(SPEC_SOURCE_PATH);
}

export function specSourceRelative() {
  return relative(process.cwd(), SPEC_SOURCE_PATH).replaceAll('\\', '/');
}

export function normalizeSpecText(text) {
  const replacements = [
    ['Î“', 'Γ'],
    ['Î£', 'Σ'],
    ['Îž', 'Ξ'],
    ['Î©', 'Ω'],
    ['Ïƒ', 'σ'],
    ['Ï€', 'π'],
    ['Î¸', 'θ'],
    ['Îµ', 'ε'],
    ['Îº', 'κ'],
    ['Î»', 'λ'],
    ['âŠ¢', '⊢'],
    ['â‡“', '⇓'],
    ['â‡‘', '⇑'],
    ['â‡’', '⇒'],
    ['â‡”', '⇔'],
    ['âˆ§', '∧'],
    ['âˆ¨', '∨'],
    ['Â¬', '¬'],
    ['âˆ€', '∀'],
    ['âˆƒ', '∃'],
    ['âˆˆ', '∈'],
    ['âˆ‰', '∉'],
    ['âˆª', '∪'],
    ['âˆ©', '∩'],
    ['âŠ†', '⊆'],
    ['âŠ¥', '⊥'],
    ['â‰ ', '≠'],
    ['â‰¤', '≤'],
    ['â‰¥', '≥'],
    ['â†¦', '↦'],
    ['â†’', '→'],
    ['âŸ¨', '⟨'],
    ['âŸ©', '⟩'],
    ['â€¦', '…'],
    ['Ã—', '×'],
    ['Â§', '§'],
    ['Â§Â§', '§§'],
    ['reultravioletly', 'recursively'],
  ];

  let normalized = text;
  for (const [bad, good] of replacements) {
    normalized = normalized.split(bad).join(good);
  }
  normalized = normalized.replace(/^[-â”€]{12,}$/gm, '\\rule{18em}{0.4pt}');
  normalized = normalized.replaceAll('\\rule{\\linewidth}{0.4pt}', '\\rule{18em}{0.4pt}');
  return normalized;
}

export function splitChapters(markdown) {
  const headingPattern = /^## (.+)$/gm;
  const matches = [...markdown.matchAll(headingPattern)];
  const chunks = new Map();

  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    const heading = match[1].trim();
    const start = match.index;
    const end = index + 1 < matches.length ? matches[index + 1].index : markdown.length;
    const meta = CHAPTERS.find((chapter) => chapter.heading === heading);
    if (meta) {
      chunks.set(meta.slug, markdown.slice(start, end).trim());
    }
  }

  return chunks;
}

export function frontmatter(fields) {
  const lines = ['---'];
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value === 'boolean') {
      lines.push(`${key}: ${value ? 'true' : 'false'}`);
    } else {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    }
  }
  lines.push('---');
  return `${lines.join('\n')}\n\n`;
}

export function docsPathForSlug(slug) {
  return slug === 'index'
    ? `${SPEC_OUTPUT_DIR}/index.md`
    : `${SPEC_OUTPUT_DIR}/${slug}.md`;
}
