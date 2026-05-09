import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { basename, relative, resolve } from 'node:path';

export const SPEC_SOURCE_PATH =
  process.env.ULTRAVIOLET_SPEC_PATH ?? resolve(process.cwd(), 'SPECIFICATION.md');

export const SPEC_OUTPUT_DIR = 'src/content/docs/docs/specification';
export const RULE_BAR = '\u2500'.repeat(18);

const LATEX_SYMBOLS = new Map([
  ['Γ', '\\Gamma'],
  ['Σ', '\\Sigma'],
  ['Ξ', '\\Xi'],
  ['Ω', '\\Omega'],
  ['π', '\\pi'],
  ['σ', '\\sigma'],
  ['θ', '\\theta'],
  ['λ', '\\lambda'],
  ['ε', '\\varepsilon'],
  ['κ', '\\kappa'],
  ['α', '\\alpha'],
  ['β', '\\beta'],
  ['δ', '\\delta'],
  ['τ', '\\tau'],
  ['⊢', '\\vdash'],
  ['⇓', '\\Downarrow'],
  ['⇑', '\\Uparrow'],
  ['⇔', '\\Leftrightarrow'],
  ['⇒', '\\Rightarrow'],
  ['→', '\\to'],
  ['↦', '\\mapsto'],
  ['∀', '\\forall'],
  ['∃', '\\exists'],
  ['∈', '\\in'],
  ['∉', '\\notin'],
  ['∋', '\\ni'],
  ['⊆', '\\subseteq'],
  ['⊄', '\\nsubseteq'],
  ['⊥', '\\bot'],
  ['⊤', '\\top'],
  ['≠', '\\ne'],
  ['≤', '\\le'],
  ['≥', '\\ge'],
  ['≡', '\\equiv'],
  ['≈', '\\approx'],
  ['∧', '\\land'],
  ['∨', '\\lor'],
  ['¬', '\\lnot'],
  ['∪', '\\cup'],
  ['∩', '\\cap'],
  ['∅', '\\emptyset'],
  ['∞', '\\infty'],
  ['ℕ', '\\mathbb{N}'],
  ['𝒯', '\\mathcal{T}'],
  ['⟨', '\\langle'],
  ['⟩', '\\rangle'],
  ['…', '\\ldots'],
  ['⋃', '\\bigcup'],
  ['×', '\\times'],
  ['∖', '\\setminus'],
  ['▷', '\\triangleright'],
  ['◁', '\\triangleleft'],
  ['±', '\\pm'],
  ['–', '-'],
  ['𝔅', '\\mathfrak{B}'],
]);

const SUBSCRIPT_DIGITS = new Map([
  ['₀', '0'],
  ['₁', '1'],
  ['₂', '2'],
  ['₃', '3'],
  ['₄', '4'],
  ['₅', '5'],
  ['₆', '6'],
  ['₇', '7'],
  ['₈', '8'],
  ['₉', '9'],
]);

for (const [char, symbol] of [
  ['\u03a0', '\\Pi'],
  ['\u03a6', '\\Phi'],
  ['\u03b3', '\\gamma'],
  ['\u03b7', '\\eta'],
  ['\u03bc', '\\mu'],
  ['\u03c1', '\\rho'],
  ['\u03c9', '\\omega'],
  ['\u03c6', '\\phi'],
  ['\u03c7', '\\chi'],
  ['\u03c8', '\\psi'],
  ['\u0394', '\\Delta'],
  ['\u22a3', '\\dashv'],
  ['\u21d0', '\\Leftarrow'],
  ['\u2194', '\\leftrightarrow'],
  ['\u21c0', '\\rightharpoonup'],
  ['\u2191', '\\uparrow'],
  ['\u22ac', '\\nvdash'],
  ['\u2211', '\\sum'],
  ['\u22ef', '\\cdots'],
  ['\u2124', '\\mathbb{Z}'],
  ['\u2113', '\\ell'],
  ['\u2118', '\\wp'],
  ['\ud835\udcab', '\\mathcal{P}'],
  ['\u00b7', '\\cdot'],
  ['\u227a', '\\prec'],
  ['\u228e', '\\uplus'],
  ['\u2295', '\\oplus'],
  ['\u2282', '\\subset'],
  ['\u2288', '\\nsubseteq'],
  ['\u22c0', '\\bigwedge'],
  ['\u22a8', '\\models'],
  ['\u230a', '\\lfloor'],
  ['\u230b', '\\rfloor'],
  ['\u2308', '\\lceil'],
  ['\u2309', '\\rceil'],
  ['\u2218', '\\circ'],
  ['\u00a7', '\\S'],
]) {
  LATEX_SYMBOLS.set(char, symbol);
}

const TEXT_REPLACEMENTS = new Map([
  ['\u0393', 'Gamma'],
  ['\u03a3', 'Sigma'],
  ['\u039e', 'Xi'],
  ['\u03a9', 'Omega'],
  ['\u0394', 'Delta'],
  ['\u03a0', 'Pi'],
  ['\u03a6', 'Phi'],
  ['\u03c0', 'pi'],
  ['\u03c3', 'sigma'],
  ['\u03b8', 'theta'],
  ['\u03bb', 'lambda'],
  ['\u03b5', 'epsilon'],
  ['\u03ba', 'kappa'],
  ['\u03b1', 'alpha'],
  ['\u03b2', 'beta'],
  ['\u03b3', 'gamma'],
  ['\u03b4', 'delta'],
  ['\u03b7', 'eta'],
  ['\u03bc', 'mu'],
  ['\u03c1', 'rho'],
  ['\u03c4', 'tau'],
  ['\u03c9', 'omega'],
  ['\u03c6', 'phi'],
  ['\u03c7', 'chi'],
  ['\u03c8', 'psi'],
  ['\u22a2', '|-'],
  ['\u21d3', '=>'],
  ['\u21d1', '=^'],
  ['\u21d4', '<=>'],
  ['\u21d2', '=>'],
  ['\u21d0', '<='],
  ['\u2194', '<->'],
  ['\u2192', '->'],
  ['\u21c0', '->'],
  ['\u2191', '^'],
  ['\u21a6', '|->'],
  ['\u2200', 'forall'],
  ['\u2203', 'exists'],
  ['\u2208', 'in'],
  ['\u2209', 'notin'],
  ['\u220b', 'contains'],
  ['\u2286', 'subseteq'],
  ['\u2284', 'nsubseteq'],
  ['\u22a5', 'bottom'],
  ['\u22a4', 'top'],
  ['\u2260', '!='],
  ['\u2264', '<='],
  ['\u2265', '>='],
  ['\u2261', '=='],
  ['\u2248', '~='],
  ['\u2227', 'and'],
  ['\u2228', 'or'],
  ['\u00ac', 'not'],
  ['\u222a', 'union'],
  ['\u2229', 'intersect'],
  ['\u2205', 'emptyset'],
  ['\u221e', 'infinity'],
  ['\u2211', 'sum'],
  ['\u22ef', '...'],
  ['\u2115', 'N'],
  ['\u2124', 'Z'],
  ['\u2113', 'ell'],
  ['\u2118', 'wp'],
  ['\ud835\udcab', 'P'],
  ['\ud835\udcaf', 'T'],
  ['\u27e8', '<'],
  ['\u27e9', '>'],
  ['\u2026', '...'],
  ['\u22c3', 'bigunion'],
  ['\u22c0', 'bigand'],
  ['\u22a8', 'models'],
  ['\u22a3', '-|'],
  ['\u22ac', 'not-vdash'],
  ['\u00b7', '.'],
  ['\u227a', 'prec'],
  ['\u228e', 'uplus'],
  ['\u2295', 'oplus'],
  ['\u2282', 'subset'],
  ['\u2288', 'nsubseteq'],
  ['\u230a', 'floor'],
  ['\u230b', 'floor'],
  ['\u2308', 'ceil'],
  ['\u2309', 'ceil'],
  ['\u2218', 'compose'],
  ['\u00d7', 'x'],
  ['\u2216', '\\'],
  ['\u25b7', '>'],
  ['\u25c1', '<'],
  ['\u00b1', '+/-'],
  ['\u00a7', 'section'],
  ['\u2013', '-'],
  ['\ud835\udd05', 'B'],
  ['\u2080', '_0'],
  ['\u2081', '_1'],
  ['\u2082', '_2'],
  ['\u2083', '_3'],
  ['\u2084', '_4'],
  ['\u2085', '_5'],
  ['\u2086', '_6'],
  ['\u2087', '_7'],
  ['\u2088', '_8'],
  ['\u2089', '_9'],
]);

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
  normalized = normalized.replace(/^(?:-|\u2500){12,}$/gmu, RULE_BAR);
  normalized = normalized.replace(/^[-â”€]{12,}$/gm, RULE_BAR);
  normalized = normalized.replaceAll('\\rule{\\linewidth}{0.4pt}', RULE_BAR);
  normalized = normalized.replaceAll('\\rule{18em}{0.4pt}', RULE_BAR);
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

export function normalizeChapterBody(body) {
  const lines = body.split(/\r?\n/);
  const out = [];
  let inSourceFence = false;
  let sourceFenceLang = '';
  let formalLines = [];

  function flushFormalBlock() {
    if (formalLines.length === 0) return;
    if (out.at(-1) !== '') out.push('');
    out.push('```math');
    out.push(renderLatexBlock(formalLines));
    out.push('```');
    formalLines = [];
  }

  for (const line of lines) {
    const fence = line.match(/^```([A-Za-z0-9_-]*)\s*$/);
    if (fence) {
      flushFormalBlock();

      if (!inSourceFence) {
        inSourceFence = true;
        sourceFenceLang = fence[1] || '';
        out.push(['ebnf', 'uv', 'ultraviolet', ''].includes(sourceFenceLang) ? '```text' : line);
      } else {
        inSourceFence = false;
        sourceFenceLang = '';
        out.push('```');
      }
      continue;
    }

    if (inSourceFence) {
      if (sourceFenceLang === 'math') {
        out.push(line.replaceAll('\\linewidth', '18em'));
      } else {
        out.push(line);
      }
      continue;
    }

    if (isFormalLine(line) || isFormalContinuationLine(line, formalLines)) {
      formalLines.push(line);
      continue;
    }

    flushFormalBlock();
    out.push(line);
  }

  flushFormalBlock();

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
  if (trimmed === RULE_BAR || /^(?:-|\u2500){12,}$/u.test(trimmed)) return true;
  if (/[ΓΣΞΩπσθλεκαβδτ⊢⇓⇑⇔⇒→∀∃∈∉∋⊆⊄⊥⊤≠≤≥≡≈↦⟨⟩∧∨¬∪∩∅∞ℕ𝒯⋃×]/u.test(trimmed)) {
    return true;
  }
  if (/^#\S/.test(trimmed)) return true;
  if (/[A-Za-z_][A-Za-z0-9_]*\([^)]*\)/.test(trimmed) && /[=:[\]{}|]/.test(trimmed)) {
    return true;
  }
  if (/[A-Za-z_][A-Za-z0-9_]*\s*=\s*/.test(trimmed) && /[()[\]{}_,]/.test(trimmed)) {
    return true;
  }
  if (/(<:|::|\+\+|->|=>|!=|<=|>=)/.test(trimmed)) return true;
  return false;
}

function isFormalContinuationLine(line, formalLines) {
  if (formalLines.length === 0) return false;

  const trimmed = line.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('|')) return false;
  if (/^#{1,6}\s/.test(trimmed)) return false;
  if (/^\*\*.*\*\*$/.test(trimmed)) return false;
  if (/^[-*]\s/.test(trimmed)) return false;
  if (/^\d+\.\s/.test(trimmed)) return false;

  const previous = formalLines.at(-1).trim();
  if (previous === RULE_BAR) return true;
  if (/^where$/i.test(trimmed)) return true;
  if (/^otherwise\b/i.test(trimmed)) return true;
  if (/^\s+\S/.test(line)) return true;
  return false;
}

function renderLatexBlock(lines) {
  const latexLines = lines
    .filter((line) => line.trim() !== '')
    .map((line) => renderLatexLine(line));

  if (latexLines.length === 1) {
    return latexLines[0];
  }

  return `\\begin{array}{l}\n${latexLines.join(' \\\\\n')}\n\\end{array}`;
}

function renderLatexLine(line) {
  const trimmed = line.trim();
  if (trimmed === RULE_BAR) {
    return '\\rule{18em}{0.4pt}';
  }

  let out = '';
  let index = 0;

  while (index < line.length) {
    const rest = line.slice(index);
    const char = line[index];

    if (char === '`') {
      const end = line.indexOf('`', index + 1);
      if (end !== -1) {
        out += `\\texttt{${escapeLatexText(line.slice(index + 1, end))}}`;
        index = end + 1;
        continue;
      }
    }

    if (char === '"') {
      const end = findStringEnd(line, index + 1);
      if (end !== -1) {
        out += `\\texttt{${escapeLatexText(line.slice(index, end + 1))}}`;
        index = end + 1;
        continue;
      }
    }

    const space = rest.match(/^\s+/);
    if (space) {
      out += renderLatexSpace(space[0].length);
      index += space[0].length;
      continue;
    }

    const greek = renderGreekIdentifier(line, index);
    if (greek) {
      out += greek.latex;
      index = greek.next;
      continue;
    }

    const identifier = rest.match(/^[A-Za-z][A-Za-z0-9]*(?:_[A-Za-z0-9]+)*/);
    if (identifier) {
      const token = identifier[0];
      const next = line[index + token.length];
      out += next === '(' ? `\\operatorname{${token}}` : renderIdentifier(token);
      index += token.length;
      continue;
    }

    const number = rest.match(/^\d+(?:\.\d+)?/);
    if (number) {
      out += number[0];
      index += number[0].length;
      continue;
    }

    const multi = renderMultiCharOperator(rest);
    if (multi) {
      out += multi.latex;
      index += multi.length;
      continue;
    }

    const symbol = LATEX_SYMBOLS.get(char);
    if (symbol) {
      out += renderSymbol(symbol);
      index += 1;
      continue;
    }

    const subscriptDigit = SUBSCRIPT_DIGITS.get(char);
    if (subscriptDigit) {
      out += `_{${subscriptDigit}}`;
      index += 1;
      continue;
    }

    out += renderAsciiPunctuation(char);
    index += 1;
  }

  return out;
}

function renderGreekIdentifier(line, index) {
  const symbol = LATEX_SYMBOLS.get(line[index]);
  if (!symbol) return null;

  let next = index + 1;
  let latex = symbol;
  if (line[next] === '_') {
    const subscript = line.slice(next + 1).match(/^[A-Za-z0-9]+/);
    if (subscript) {
      latex += `_{${renderIdentifierPart(subscript[0])}}`;
      next += subscript[0].length + 1;
    }
  }

  return { latex: renderSymbol(latex), next };
}

function renderSymbol(symbol) {
  return `${symbol} `;
}

function renderIdentifier(token) {
  const parts = token.split('_');
  const base = renderIdentifierPart(parts[0]);
  if (parts.length === 1) return base;
  return `${base}_{${parts.slice(1).map(renderIdentifierPart).join('\\_')}}`;
}

function renderIdentifierPart(part) {
  if (/^[A-Za-z]$/.test(part)) return part;
  if (/^\d+$/.test(part)) return part;
  return `\\mathsf{${escapeLatexText(part)}}`;
}

function renderMultiCharOperator(text) {
  const operators = [
    ['...', '\\ldots '],
    ['<=', '\\le '],
    ['>=', '\\ge '],
    ['!=', '\\ne '],
    ['==', '='],
    ['->', '\\to '],
    ['=>', '\\Rightarrow '],
    ['<:', '\\mathrel{<:} '],
    ['::', '\\mathbin{::} '],
    ['++', '\\mathbin{++} '],
    ['&&', '\\land '],
    ['||', '\\lor '],
    ['\\', '\\setminus '],
  ];

  const operator = operators.find(([source]) => text.startsWith(source));
  if (!operator) return null;
  return { length: operator[0].length, latex: operator[1] };
}

function renderAsciiPunctuation(char) {
  const escaped = new Map([
    ['{', '\\{'],
    ['}', '\\}'],
    ['#', '\\#'],
    ['$', '\\$'],
    ['%', '\\%'],
    ['&', '\\&'],
    ['_', '\\_'],
    ['~', '\\sim{}'],
    ['|', '\\mid '],
  ]);

  return escaped.get(char) ?? char;
}

function renderLatexSpace(count) {
  if (count >= 4) return '\\quad ';
  return '\\ ';
}

function escapeLatexText(text) {
  const ascii = [...text]
    .map((char) => TEXT_REPLACEMENTS.get(char) ?? char)
    .join('');

  return ascii.replace(/[\\{}_$&#%^~]/g, (char) => {
    const escaped = {
      '\\': '\\textbackslash{}',
      '{': '\\{',
      '}': '\\}',
      '_': '\\_',
      '$': '\\$',
      '&': '\\&',
      '#': '\\#',
      '%': '\\%',
      '^': '\\^{}',
      '~': '\\~{}',
    };
    return escaped[char];
  });
}

function findStringEnd(line, start) {
  for (let index = start; index < line.length; index += 1) {
    if (line[index] === '"' && line[index - 1] !== '\\') return index;
  }
  return -1;
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
