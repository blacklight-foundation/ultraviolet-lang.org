---
title: "Specification"
description: "Generated website edition of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T19:35:24.518Z"
---

<div class="spec-provenance">
  <strong>Generated specification.</strong>
  <span>Source: <code>SPECIFICATION.md</code></span>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

<div class="spec-reader-map">
  <a href="/docs/reference/specification-reading-guide/">Reading guide</a>
  <a href="/docs/specification/complete-grammar-reference/">Grammar</a>
  <a href="/docs/specification/diagnostic-index/">Diagnostics</a>
  <a href="/docs/reference/documentation-audit/">Claim audit</a>
</div>

The Ultraviolet language specification is the authoritative reference for syntax, static semantics, dynamic semantics, lowering, diagnostics, ABI behavior, and conformance. The generated pages below preserve chapter boundaries from <code>SPECIFICATION.md</code> and render formal notation as display mathematics.

Use the guide pages for learning paths and the generated specification pages when you need exact rules.

<section class="spec-index-group" aria-labelledby="spec-front-matter">
  <h2 id="spec-front-matter">Front Matter</h2>
  <div class="spec-index-grid">
<a class="spec-index-link" href="/docs/specification/front-matter/">
  <span>0.</span>
  <strong>Front Matter</strong>
</a>
  </div>
</section>

<section class="spec-index-group" aria-labelledby="spec-foundation">
  <h2 id="spec-foundation">Foundation</h2>
  <div class="spec-index-grid">
<a class="spec-index-link" href="/docs/specification/conformance-and-notation/">
  <span>1.</span>
  <strong>Conformance and Notation</strong>
</a>
<a class="spec-index-link" href="/docs/specification/diagnostic-infrastructure/">
  <span>2.</span>
  <strong>Diagnostic Infrastructure</strong>
</a>
  </div>
</section>

<section class="spec-index-group" aria-labelledby="spec-toolchain">
  <h2 id="spec-toolchain">Toolchain</h2>
  <div class="spec-index-grid">
<a class="spec-index-link" href="/docs/specification/project-and-compilation-model/">
  <span>3.</span>
  <strong>Project and Compilation Model</strong>
</a>
  </div>
</section>

<section class="spec-index-group" aria-labelledby="spec-source-language">
  <h2 id="spec-source-language">Source Language</h2>
  <div class="spec-index-grid">
<a class="spec-index-link" href="/docs/specification/source-text-and-lexical-structure/">
  <span>4.</span>
  <strong>Source Text and Lexical Structure</strong>
</a>
<a class="spec-index-link" href="/docs/specification/parsing-and-ast-infrastructure/">
  <span>5.</span>
  <strong>Parsing and AST Infrastructure</strong>
</a>
<a class="spec-index-link" href="/docs/specification/attributes-and-metadata/">
  <span>9.</span>
  <strong>Attributes and Metadata</strong>
</a>
<a class="spec-index-link" href="/docs/specification/module-level-forms/">
  <span>11.</span>
  <strong>Module-Level Forms</strong>
</a>
<a class="spec-index-link" href="/docs/specification/expressions/">
  <span>16.</span>
  <strong>Expressions</strong>
</a>
<a class="spec-index-link" href="/docs/specification/patterns/">
  <span>17.</span>
  <strong>Patterns</strong>
</a>
<a class="spec-index-link" href="/docs/specification/statements-and-blocks/">
  <span>18.</span>
  <strong>Statements and Blocks</strong>
</a>
  </div>
</section>

<section class="spec-index-group" aria-labelledby="spec-semantics">
  <h2 id="spec-semantics">Semantics</h2>
  <div class="spec-index-grid">
<a class="spec-index-link" href="/docs/specification/abstract-machine-objects-responsibility-and-authority/">
  <span>6.</span>
  <strong>Abstract Machine, Objects, Responsibility, and Authority</strong>
</a>
<a class="spec-index-link" href="/docs/specification/name-resolution-and-visibility/">
  <span>7.</span>
  <strong>Name Resolution and Visibility</strong>
</a>
<a class="spec-index-link" href="/docs/specification/type-system-core/">
  <span>8.</span>
  <strong>Type System Core</strong>
</a>
  </div>
</section>

<section class="spec-index-group" aria-labelledby="spec-core-surfaces">
  <h2 id="spec-core-surfaces">Core Surfaces</h2>
  <div class="spec-index-grid">
<a class="spec-index-link" href="/docs/specification/permissions-and-binding-state/">
  <span>10.</span>
  <strong>Permissions and Binding State</strong>
</a>
<a class="spec-index-link" href="/docs/specification/modal-and-special-types/">
  <span>13.</span>
  <strong>Modal and Special Types</strong>
</a>
<a class="spec-index-link" href="/docs/specification/procedures-and-contracts/">
  <span>15.</span>
  <strong>Procedures and Contracts</strong>
</a>
<a class="spec-index-link" href="/docs/specification/key-system/">
  <span>19.</span>
  <strong>Key System</strong>
</a>
<a class="spec-index-link" href="/docs/specification/structured-parallelism/">
  <span>20.</span>
  <strong>Structured Parallelism</strong>
</a>
<a class="spec-index-link" href="/docs/specification/asynchronous-operations/">
  <span>21.</span>
  <strong>Asynchronous Operations</strong>
</a>
  </div>
</section>

<section class="spec-index-group" aria-labelledby="spec-types">
  <h2 id="spec-types">Types</h2>
  <div class="spec-index-grid">
<a class="spec-index-link" href="/docs/specification/concrete-data-types/">
  <span>12.</span>
  <strong>Concrete Data Types</strong>
</a>
<a class="spec-index-link" href="/docs/specification/abstraction-and-polymorphism/">
  <span>14.</span>
  <strong>Abstraction and Polymorphism</strong>
</a>
  </div>
</section>

<section class="spec-index-group" aria-labelledby="spec-generation">
  <h2 id="spec-generation">Generation</h2>
  <div class="spec-index-grid">
<a class="spec-index-link" href="/docs/specification/compile-time-execution-and-metaprogramming/">
  <span>22.</span>
  <strong>Compile-Time Execution and Metaprogramming</strong>
</a>
  </div>
</section>

<section class="spec-index-group" aria-labelledby="spec-interop">
  <h2 id="spec-interop">Interop</h2>
  <div class="spec-index-grid">
<a class="spec-index-link" href="/docs/specification/foreign-function-interface/">
  <span>23.</span>
  <strong>Foreign Function Interface</strong>
</a>
  </div>
</section>

<section class="spec-index-group" aria-labelledby="spec-backend">
  <h2 id="spec-backend">Backend</h2>
  <div class="spec-index-grid">
<a class="spec-index-link" href="/docs/specification/common-lowering-program-lifecycle-and-backend/">
  <span>24.</span>
  <strong>Common Lowering, Program Lifecycle, and Backend</strong>
</a>
  </div>
</section>

<section class="spec-index-group" aria-labelledby="spec-appendices">
  <h2 id="spec-appendices">Appendices</h2>
  <div class="spec-index-grid">
<a class="spec-index-link" href="/docs/specification/diagnostic-index/">
  <span>Appendix A.</span>
  <strong>Diagnostic Index</strong>
</a>
<a class="spec-index-link" href="/docs/specification/complete-grammar-reference/">
  <span>Appendix B.</span>
  <strong>Complete Grammar Reference</strong>
</a>
<a class="spec-index-link" href="/docs/specification/ast-form-index/">
  <span>Appendix C.</span>
  <strong>AST Form Index</strong>
</a>
<a class="spec-index-link" href="/docs/specification/layout-abi-and-runtime-reference/">
  <span>Appendix D.</span>
  <strong>Layout, ABI, and Runtime Reference</strong>
</a>
  </div>
</section>
