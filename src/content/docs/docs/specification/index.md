---
title: "Specification"
description: "Generated website edition of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
generatedAt: "2026-05-14T00:55:03.609Z"
---

<div class="spec-provenance">
  <strong>Generated specification.</strong>
  <span>Source: <code>SPECIFICATION.md</code></span>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
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
  <span>Appendix</span>
  <strong>Diagnostic Index</strong>
</a>
<a class="spec-index-link" href="/docs/specification/complete-grammar-reference/">
  <span>Appendix</span>
  <strong>Complete Grammar Reference</strong>
</a>
<a class="spec-index-link" href="/docs/specification/ast-form-index/">
  <span>Appendix</span>
  <strong>AST Form Index</strong>
</a>
<a class="spec-index-link" href="/docs/specification/layout-abi-and-runtime-reference/">
  <span>Appendix</span>
  <strong>Layout, ABI, and Runtime Reference</strong>
</a>
  </div>
</section>

<section class="spec-outline" aria-labelledby="spec-complete-outline">
  <h2 id="spec-complete-outline">Complete Section Outline</h2>
  <ol class="spec-outline-list">
<li class="spec-outline-chapter">
  <a class="spec-outline-chapter-link" href="/docs/specification/front-matter/">
    <span>0.</span>
    <strong>Front Matter</strong>
  </a>
  <ol class="spec-outline-sections">
    <li>
      <a href="/docs/specification/front-matter/#01-document-organization">0.1 Document Organization</a>

    </li>
    <li>
      <a href="/docs/specification/front-matter/#02-canonical-chapter-outline">0.2 Canonical Chapter Outline</a>

    </li>
    <li>
      <a href="/docs/specification/front-matter/#03-required-feature-section-template">0.3 Required Feature Section Template</a>

    </li>
    <li>
      <a href="/docs/specification/front-matter/#04-language-design-contract">0.4 Language Design Contract</a>

    </li>
  </ol>
</li>
<li class="spec-outline-chapter">
  <a class="spec-outline-chapter-link" href="/docs/specification/conformance-and-notation/">
    <span>1.</span>
    <strong>Conformance and Notation</strong>
  </a>
  <ol class="spec-outline-sections">
    <li>
      <a href="/docs/specification/conformance-and-notation/#11-conformance">1.1 Conformance</a>

    </li>
    <li>
      <a href="/docs/specification/conformance-and-notation/#12-behavior-types">1.2 Behavior Types</a>

    </li>
    <li>
      <a href="/docs/specification/conformance-and-notation/#13-document-conventions">1.3 Document Conventions</a>

    </li>
    <li>
      <a href="/docs/specification/conformance-and-notation/#14-normative-references">1.4 Normative References</a>

    </li>
    <li>
      <a href="/docs/specification/conformance-and-notation/#15-compile-time-execution-and-phase-ordering">1.5 Compile-Time Execution and Phase Ordering</a>

    </li>
    <li>
      <a href="/docs/specification/conformance-and-notation/#16-target-and-abi-assumptions">1.6 Target and ABI Assumptions</a>

    </li>
  </ol>
</li>
<li class="spec-outline-chapter">
  <a class="spec-outline-chapter-link" href="/docs/specification/diagnostic-infrastructure/">
    <span>2.</span>
    <strong>Diagnostic Infrastructure</strong>
  </a>
  <ol class="spec-outline-sections">
    <li>
      <a href="/docs/specification/diagnostic-infrastructure/#21-source-locations-and-spans">2.1 Source Locations and Spans</a>

    </li>
    <li>
      <a href="/docs/specification/diagnostic-infrastructure/#22-token-spans">2.2 Token Spans</a>

    </li>
    <li>
      <a href="/docs/specification/diagnostic-infrastructure/#23-diagnostic-records-and-emission">2.3 Diagnostic Records and Emission</a>

    </li>
    <li>
      <a href="/docs/specification/diagnostic-infrastructure/#24-diagnostic-code-selection">2.4 Diagnostic Code Selection</a>

    </li>
    <li>
      <a href="/docs/specification/diagnostic-infrastructure/#25-diagnostic-ordering">2.5 Diagnostic Ordering</a>

    </li>
    <li>
      <a href="/docs/specification/diagnostic-infrastructure/#26-diagnostic-rendering">2.6 Diagnostic Rendering</a>

    </li>
    <li>
      <a href="/docs/specification/diagnostic-infrastructure/#27-diagnostics-without-source-spans">2.7 Diagnostics Without Source Spans</a>

    </li>
  </ol>
</li>
<li class="spec-outline-chapter">
  <a class="spec-outline-chapter-link" href="/docs/specification/project-and-compilation-model/">
    <span>3.</span>
    <strong>Project and Compilation Model</strong>
  </a>
  <ol class="spec-outline-sections">
    <li>
      <a href="/docs/specification/project-and-compilation-model/#31-core-project-records">3.1 Core Project Records</a>

    </li>
    <li>
      <a href="/docs/specification/project-and-compilation-model/#32-project-root-and-manifest">3.2 Project Root and Manifest</a>

    </li>
    <li>
      <a href="/docs/specification/project-and-compilation-model/#33-assemblies-and-project-loading">3.3 Assemblies and Project Loading</a>

    </li>
    <li>
      <a href="/docs/specification/project-and-compilation-model/#34-deterministic-ordering-and-case-folding">3.4 Deterministic Ordering and Case Folding</a>

    </li>
    <li>
      <a href="/docs/specification/project-and-compilation-model/#35-source-roots-module-directories-and-compilation-units">3.5 Source Roots, Module Directories, and Compilation Units</a>

    </li>
    <li>
      <a href="/docs/specification/project-and-compilation-model/#36-output-artifacts-and-linking">3.6 Output Artifacts and Linking</a>

    </li>
    <li>
      <a href="/docs/specification/project-and-compilation-model/#37-tool-resolution-and-ir-assembly-inputs">3.7 Tool Resolution and IR Assembly Inputs</a>

    </li>
    <li>
      <a href="/docs/specification/project-and-compilation-model/#38-project-diagnostics">3.8 Project Diagnostics</a>

    </li>
  </ol>
</li>
<li class="spec-outline-chapter">
  <a class="spec-outline-chapter-link" href="/docs/specification/source-text-and-lexical-structure/">
    <span>4.</span>
    <strong>Source Text and Lexical Structure</strong>
  </a>
  <ol class="spec-outline-sections">
    <li>
      <a href="/docs/specification/source-text-and-lexical-structure/#41-source-loading-and-normalization">4.1 Source Loading and Normalization</a>
<details class="spec-outline-subsections">
    <summary>9 subsections</summary>
    <ol>
      <li><a href="/docs/specification/source-text-and-lexical-structure/#411-unicode-normalization-outside-identifiers">4.1.1 Unicode Normalization Outside Identifiers</a></li>
      <li><a href="/docs/specification/source-text-and-lexical-structure/#412-lexically-sensitive-unicode-enforcement">4.1.2 Lexically Sensitive Unicode Enforcement</a></li>
      <li><a href="/docs/specification/source-text-and-lexical-structure/#413-utf-8-decoding-and-bom-handling">4.1.3 UTF-8 Decoding and BOM Handling</a></li>
      <li><a href="/docs/specification/source-text-and-lexical-structure/#414-line-ending-normalization-and-logical-lines">4.1.4 Line Ending Normalization and Logical Lines</a></li>
      <li><a href="/docs/specification/source-text-and-lexical-structure/#415-prohibited-code-points">4.1.5 Prohibited Code Points</a></li>
      <li><a href="/docs/specification/source-text-and-lexical-structure/#416-nfc-normalization-for-identifiers-and-module-paths">4.1.6 NFC Normalization for Identifiers and Module Paths</a></li>
      <li><a href="/docs/specification/source-text-and-lexical-structure/#417-newline-tokens-and-statement-termination">4.1.7 Newline Tokens and Statement Termination</a></li>
      <li><a href="/docs/specification/source-text-and-lexical-structure/#418-source-loading-pipeline">4.1.8 Source Loading Pipeline</a></li>
      <li><a href="/docs/specification/source-text-and-lexical-structure/#419-diagnostic-spans-for-source-loading">4.1.9 Diagnostic Spans for Source Loading</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/source-text-and-lexical-structure/#42-lexical-analysis">4.2 Lexical Analysis</a>
<details class="spec-outline-subsections">
    <summary>12 subsections</summary>
    <ol>
      <li><a href="/docs/specification/source-text-and-lexical-structure/#421-inputs-outputs-and-records">4.2.1 Inputs, Outputs, and Records</a></li>
      <li><a href="/docs/specification/source-text-and-lexical-structure/#422-character-classes">4.2.2 Character Classes</a></li>
      <li><a href="/docs/specification/source-text-and-lexical-structure/#423-reserved-lexemes">4.2.3 Reserved Lexemes</a></li>
      <li><a href="/docs/specification/source-text-and-lexical-structure/#424-token-kinds">4.2.4 Token Kinds</a></li>
      <li><a href="/docs/specification/source-text-and-lexical-structure/#425-comment-and-whitespace-scanning">4.2.5 Comment and Whitespace Scanning</a></li>
      <li><a href="/docs/specification/source-text-and-lexical-structure/#426-literal-lexing">4.2.6 Literal Lexing</a></li>
      <li><a href="/docs/specification/source-text-and-lexical-structure/#427-identifier-and-keyword-lexing">4.2.7 Identifier and Keyword Lexing</a></li>
      <li><a href="/docs/specification/source-text-and-lexical-structure/#428-operator-and-punctuator-lexing">4.2.8 Operator and Punctuator Lexing</a></li>
      <li><a href="/docs/specification/source-text-and-lexical-structure/#429-maximal-munch-rule">4.2.9 Maximal-Munch Rule</a></li>
      <li><a href="/docs/specification/source-text-and-lexical-structure/#4210-lexical-security">4.2.10 Lexical Security</a></li>
      <li><a href="/docs/specification/source-text-and-lexical-structure/#4211-tokenization">4.2.11 Tokenization</a></li>
      <li><a href="/docs/specification/source-text-and-lexical-structure/#4212-tokenize">4.2.12 Tokenize</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/source-text-and-lexical-structure/#43-source-loading-and-lexical-diagnostics">4.3 Source Loading and Lexical Diagnostics</a>

    </li>
  </ol>
</li>
<li class="spec-outline-chapter">
  <a class="spec-outline-chapter-link" href="/docs/specification/parsing-and-ast-infrastructure/">
    <span>5.</span>
    <strong>Parsing and AST Infrastructure</strong>
  </a>
  <ol class="spec-outline-sections">
    <li>
      <a href="/docs/specification/parsing-and-ast-infrastructure/#51-parsing-inputs-outputs-and-invariants">5.1 Parsing Inputs, Outputs, and Invariants</a>

    </li>
    <li>
      <a href="/docs/specification/parsing-and-ast-infrastructure/#52-ast-meta-conventions">5.2 AST Meta-Conventions</a>

    </li>
    <li>
      <a href="/docs/specification/parsing-and-ast-infrastructure/#53-parser-state-and-judgments">5.3 Parser State and Judgments</a>

    </li>
    <li>
      <a href="/docs/specification/parsing-and-ast-infrastructure/#54-shared-grammar-policy-and-parser-helpers">5.4 Shared Grammar Policy and Parser Helpers</a>

    </li>
    <li>
      <a href="/docs/specification/parsing-and-ast-infrastructure/#55-token-consumption-and-list-parsing">5.5 Token Consumption and List Parsing</a>

    </li>
    <li>
      <a href="/docs/specification/parsing-and-ast-infrastructure/#56-parsefile-item-sequencing-and-terminators">5.6 ParseFile, Item Sequencing, and Terminators</a>

    </li>
    <li>
      <a href="/docs/specification/parsing-and-ast-infrastructure/#57-doc-comment-association">5.7 Doc Comment Association</a>

    </li>
    <li>
      <a href="/docs/specification/parsing-and-ast-infrastructure/#58-error-recovery-and-synchronization">5.8 Error Recovery and Synchronization</a>

    </li>
    <li>
      <a href="/docs/specification/parsing-and-ast-infrastructure/#59-parsing-diagnostics">5.9 Parsing Diagnostics</a>

    </li>
    <li>
      <a href="/docs/specification/parsing-and-ast-infrastructure/#510-parsing-diagnostics-supplement">5.10 Parsing Diagnostics Supplement</a>

    </li>
  </ol>
</li>
<li class="spec-outline-chapter">
  <a class="spec-outline-chapter-link" href="/docs/specification/abstract-machine-objects-responsibility-and-authority/">
    <span>6.</span>
    <strong>Abstract Machine, Objects, Responsibility, and Authority</strong>
  </a>
  <ol class="spec-outline-sections">
    <li>
      <a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/#61-authority-model">6.1 Authority Model</a>
<details class="spec-outline-subsections">
    <summary>6 subsections</summary>
    <ol>
      <li><a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/#611-capability-universe">6.1.1 Capability Universe</a></li>
      <li><a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/#612-no-ambient-authority-requirements">6.1.2 No Ambient Authority Requirements</a></li>
      <li><a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/#613-attenuation-requirements">6.1.3 Attenuation Requirements</a></li>
      <li><a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/#614-observable-behavior-and-as-if-rule">6.1.4 Observable Behavior and As-If Rule</a></li>
      <li><a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/#615-sequence-points">6.1.5 Sequence Points</a></li>
      <li><a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/#616-unsafe-and-foreign-interaction">6.1.6 Unsafe and Foreign Interaction</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/#62-host-primitives">6.2 Host Primitives</a>
<details class="spec-outline-subsections">
    <summary>5 subsections</summary>
    <ol>
      <li><a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/#621-filesystem-file-and-directory-primitive-relations">6.2.1 FileSystem, File, and Directory Primitive Relations</a></li>
      <li><a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/#622-system-primitive-relations">6.2.2 System Primitive Relations</a></li>
      <li><a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/#623-time-primitive-relations">6.2.3 Time Primitive Relations</a></li>
      <li><a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/#624-network-primitive-relations">6.2.4 Network Primitive Relations</a></li>
      <li><a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/#625-primitive-method-application">6.2.5 Primitive Method Application</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/#63-binding-and-permission-runtime-state">6.3 Binding and Permission Runtime State</a>
<details class="spec-outline-subsections">
    <summary>4 subsections</summary>
    <ol>
      <li><a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/#631-binding-state">6.3.1 Binding State</a></li>
      <li><a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/#632-permission-activity-state">6.3.2 Permission Activity State</a></li>
      <li><a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/#633-join-and-transition-operations">6.3.3 Join and Transition Operations</a></li>
      <li><a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/#634-access-and-binding-introduction-helpers">6.3.4 Access and Binding Introduction Helpers</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/#64-regions-frames-and-provenance">6.4 Regions, Frames, and Provenance</a>
<details class="spec-outline-subsections">
    <summary>3 subsections</summary>
    <ol>
      <li><a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/#641-built-in-region-options-and-region-helpers">6.4.1 Built-In Region Options and Region Helpers</a></li>
      <li><a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/#642-provenance-tags-and-lifetime-order">6.4.2 Provenance Tags and Lifetime Order</a></li>
      <li><a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/#643-provenance-environment">6.4.3 Provenance Environment</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/#65-dynamic-scope-stack-bindings-and-region-runtime">6.5 Dynamic Scope Stack, Bindings, and Region Runtime</a>
<details class="spec-outline-subsections">
    <summary>3 subsections</summary>
    <ol>
      <li><a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/#651-dynamic-scope-stack-and-binding-store">6.5.1 Dynamic Scope Stack and Binding Store</a></li>
      <li><a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/#652-region-stack-and-arenas">6.5.2 Region Stack and Arenas</a></li>
      <li><a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/#653-runtime-value-block-and-address-helpers">6.5.3 Runtime Value, Block, and Address Helpers</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/#66-runtime-state-and-memory-diagnostics">6.6 Runtime State and Memory Diagnostics</a>

    </li>
  </ol>
</li>
<li class="spec-outline-chapter">
  <a class="spec-outline-chapter-link" href="/docs/specification/name-resolution-and-visibility/">
    <span>7.</span>
    <strong>Name Resolution and Visibility</strong>
  </a>
  <ol class="spec-outline-sections">
    <li>
      <a href="/docs/specification/name-resolution-and-visibility/#71-scope-context-and-identifiers">7.1 Scope Context and Identifiers</a>

    </li>
    <li>
      <a href="/docs/specification/name-resolution-and-visibility/#72-name-introduction-and-module-validation">7.2 Name Introduction and Module Validation</a>
<details class="spec-outline-subsections">
    <summary>1 subsections</summary>
    <ol>
      <li><a href="/docs/specification/name-resolution-and-visibility/#usingalias">UsingAlias</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/name-resolution-and-visibility/#73-lookup-and-qualified-resolution">7.3 Lookup and Qualified Resolution</a>

    </li>
    <li>
      <a href="/docs/specification/name-resolution-and-visibility/#74-visibility-and-accessibility">7.4 Visibility and Accessibility</a>

    </li>
    <li>
      <a href="/docs/specification/name-resolution-and-visibility/#75-top-level-name-collection">7.5 Top-Level Name Collection</a>

    </li>
    <li>
      <a href="/docs/specification/name-resolution-and-visibility/#76-qualified-disambiguation">7.6 Qualified Disambiguation</a>

    </li>
    <li>
      <a href="/docs/specification/name-resolution-and-visibility/#77-shared-resolution-helpers-and-resolution-pass">7.7 Shared Resolution Helpers and Resolution Pass</a>

    </li>
    <li>
      <a href="/docs/specification/name-resolution-and-visibility/#78-name-resolution-and-reserved-name-diagnostics">7.8 Name Resolution and Reserved Name Diagnostics</a>

    </li>
  </ol>
</li>
<li class="spec-outline-chapter">
  <a class="spec-outline-chapter-link" href="/docs/specification/type-system-core/">
    <span>8.</span>
    <strong>Type System Core</strong>
  </a>
  <ol class="spec-outline-sections">
    <li>
      <a href="/docs/specification/type-system-core/#81-type-equivalence">8.1 Type Equivalence</a>

    </li>
    <li>
      <a href="/docs/specification/type-system-core/#82-subtyping">8.2 Subtyping</a>

    </li>
    <li>
      <a href="/docs/specification/type-system-core/#83-type-inference">8.3 Type Inference</a>

    </li>
    <li>
      <a href="/docs/specification/type-system-core/#84-metatheoretic-properties">8.4 Metatheoretic Properties</a>

    </li>
    <li>
      <a href="/docs/specification/type-system-core/#85-core-type-diagnostics">8.5 Core Type Diagnostics</a>

    </li>
  </ol>
</li>
<li class="spec-outline-chapter">
  <a class="spec-outline-chapter-link" href="/docs/specification/attributes-and-metadata/">
    <span>9.</span>
    <strong>Attributes and Metadata</strong>
  </a>
  <ol class="spec-outline-sections">
    <li>
      <a href="/docs/specification/attributes-and-metadata/#91-attribute-syntax-and-placement">9.1 Attribute Syntax and Placement</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/attributes-and-metadata/#911-syntax">9.1.1 Syntax</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#912-parsing">9.1.2 Parsing</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#913-ast-representation-form">9.1.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#914-static-semantics">9.1.4 Static Semantics</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#915-dynamic-semantics">9.1.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#916-lowering">9.1.6 Lowering</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#917-diagnostics">9.1.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/attributes-and-metadata/#92-vendor-attributes">9.2 Vendor Attributes</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/attributes-and-metadata/#921-syntax">9.2.1 Syntax</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#922-parsing">9.2.2 Parsing</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#923-ast-representation-form">9.2.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#924-static-semantics">9.2.4 Static Semantics</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#925-dynamic-semantics">9.2.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#926-lowering">9.2.6 Lowering</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#927-diagnostics">9.2.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/attributes-and-metadata/#93-layout-attributes">9.3 Layout Attributes</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/attributes-and-metadata/#931-syntax">9.3.1 Syntax</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#932-parsing">9.3.2 Parsing</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#933-ast-representation-form">9.3.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#934-static-semantics">9.3.4 Static Semantics</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#935-dynamic-semantics">9.3.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#936-lowering">9.3.6 Lowering</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#937-diagnostics">9.3.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/attributes-and-metadata/#94-optimization-attributes">9.4 Optimization Attributes</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/attributes-and-metadata/#941-syntax">9.4.1 Syntax</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#942-parsing">9.4.2 Parsing</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#943-ast-representation-form">9.4.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#944-static-semantics">9.4.4 Static Semantics</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#945-dynamic-semantics">9.4.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#946-lowering">9.4.6 Lowering</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#947-diagnostics">9.4.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/attributes-and-metadata/#95-diagnostics-and-metadata-attributes">9.5 Diagnostics and Metadata Attributes</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/attributes-and-metadata/#951-syntax">9.5.1 Syntax</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#952-parsing">9.5.2 Parsing</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#953-ast-representation-form">9.5.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#954-static-semantics">9.5.4 Static Semantics</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#955-dynamic-semantics">9.5.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#956-lowering">9.5.6 Lowering</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#957-diagnostics">9.5.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/attributes-and-metadata/#96-source-native-test-attributes">9.6 Source-Native Test Attributes</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/attributes-and-metadata/#961-syntax">9.6.1 Syntax</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#962-parsing">9.6.2 Parsing</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#963-ast-representation-form">9.6.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#964-static-semantics">9.6.4 Static Semantics</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#965-dynamic-semantics">9.6.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#966-lowering">9.6.6 Lowering</a></li>
      <li><a href="/docs/specification/attributes-and-metadata/#967-diagnostics">9.6.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
  </ol>
</li>
<li class="spec-outline-chapter">
  <a class="spec-outline-chapter-link" href="/docs/specification/permissions-and-binding-state/">
    <span>10.</span>
    <strong>Permissions and Binding State</strong>
  </a>
  <ol class="spec-outline-sections">
    <li>
      <a href="/docs/specification/permissions-and-binding-state/#101-permission-forms">10.1 Permission Forms</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/permissions-and-binding-state/#1011-syntax">10.1.1 Syntax</a></li>
      <li><a href="/docs/specification/permissions-and-binding-state/#1012-parsing">10.1.2 Parsing</a></li>
      <li><a href="/docs/specification/permissions-and-binding-state/#1013-ast-representation-form">10.1.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/permissions-and-binding-state/#1014-static-semantics">10.1.4 Static Semantics</a></li>
      <li><a href="/docs/specification/permissions-and-binding-state/#1015-dynamic-semantics">10.1.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/permissions-and-binding-state/#1016-lowering">10.1.6 Lowering</a></li>
      <li><a href="/docs/specification/permissions-and-binding-state/#1017-diagnostics">10.1.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/permissions-and-binding-state/#102-alias-and-exclusivity-rules">10.2 Alias and Exclusivity Rules</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/permissions-and-binding-state/#1021-syntax">10.2.1 Syntax</a></li>
      <li><a href="/docs/specification/permissions-and-binding-state/#1022-parsing">10.2.2 Parsing</a></li>
      <li><a href="/docs/specification/permissions-and-binding-state/#1023-ast-representation-form">10.2.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/permissions-and-binding-state/#1024-static-semantics">10.2.4 Static Semantics</a></li>
      <li><a href="/docs/specification/permissions-and-binding-state/#1025-dynamic-semantics">10.2.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/permissions-and-binding-state/#1026-lowering">10.2.6 Lowering</a></li>
      <li><a href="/docs/specification/permissions-and-binding-state/#1027-diagnostics">10.2.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/permissions-and-binding-state/#103-binding-activity-states">10.3 Binding Activity States</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/permissions-and-binding-state/#1031-syntax">10.3.1 Syntax</a></li>
      <li><a href="/docs/specification/permissions-and-binding-state/#1032-parsing">10.3.2 Parsing</a></li>
      <li><a href="/docs/specification/permissions-and-binding-state/#1033-ast-representation-form">10.3.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/permissions-and-binding-state/#1034-static-semantics">10.3.4 Static Semantics</a></li>
      <li><a href="/docs/specification/permissions-and-binding-state/#1035-dynamic-semantics">10.3.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/permissions-and-binding-state/#1036-lowering">10.3.6 Lowering</a></li>
      <li><a href="/docs/specification/permissions-and-binding-state/#1037-diagnostics">10.3.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/permissions-and-binding-state/#104-permission-admissibility">10.4 Permission Admissibility</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/permissions-and-binding-state/#1041-syntax">10.4.1 Syntax</a></li>
      <li><a href="/docs/specification/permissions-and-binding-state/#1042-parsing">10.4.2 Parsing</a></li>
      <li><a href="/docs/specification/permissions-and-binding-state/#1043-ast-representation-form">10.4.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/permissions-and-binding-state/#1044-static-semantics">10.4.4 Static Semantics</a></li>
      <li><a href="/docs/specification/permissions-and-binding-state/#1045-dynamic-semantics">10.4.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/permissions-and-binding-state/#1046-lowering">10.4.6 Lowering</a></li>
      <li><a href="/docs/specification/permissions-and-binding-state/#1047-diagnostics">10.4.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
  </ol>
</li>
<li class="spec-outline-chapter">
  <a class="spec-outline-chapter-link" href="/docs/specification/module-level-forms/">
    <span>11.</span>
    <strong>Module-Level Forms</strong>
  </a>
  <ol class="spec-outline-sections">
    <li>
      <a href="/docs/specification/module-level-forms/#111-import-declarations">11.1 Import Declarations</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/module-level-forms/#1111-syntax">11.1.1 Syntax</a></li>
      <li><a href="/docs/specification/module-level-forms/#1112-parsing">11.1.2 Parsing</a></li>
      <li><a href="/docs/specification/module-level-forms/#1113-ast-representation-form">11.1.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/module-level-forms/#1114-static-semantics">11.1.4 Static Semantics</a></li>
      <li><a href="/docs/specification/module-level-forms/#1115-dynamic-semantics">11.1.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/module-level-forms/#1116-lowering">11.1.6 Lowering</a></li>
      <li><a href="/docs/specification/module-level-forms/#1117-diagnostics">11.1.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/module-level-forms/#112-using-declarations">11.2 Using Declarations</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/module-level-forms/#1121-syntax">11.2.1 Syntax</a></li>
      <li><a href="/docs/specification/module-level-forms/#1122-parsing">11.2.2 Parsing</a></li>
      <li><a href="/docs/specification/module-level-forms/#1123-ast-representation-form">11.2.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/module-level-forms/#1124-static-semantics">11.2.4 Static Semantics</a></li>
      <li><a href="/docs/specification/module-level-forms/#1125-dynamic-semantics">11.2.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/module-level-forms/#1126-lowering">11.2.6 Lowering</a></li>
      <li><a href="/docs/specification/module-level-forms/#1127-diagnostics">11.2.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/module-level-forms/#113-static-declarations">11.3 Static Declarations</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/module-level-forms/#1131-syntax">11.3.1 Syntax</a></li>
      <li><a href="/docs/specification/module-level-forms/#1132-parsing">11.3.2 Parsing</a></li>
      <li><a href="/docs/specification/module-level-forms/#1133-ast-representation-form">11.3.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/module-level-forms/#1134-static-semantics">11.3.4 Static Semantics</a></li>
      <li><a href="/docs/specification/module-level-forms/#1135-dynamic-semantics">11.3.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/module-level-forms/#1136-lowering">11.3.6 Lowering</a></li>
      <li><a href="/docs/specification/module-level-forms/#1137-diagnostics">11.3.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/module-level-forms/#114-extern-block-shell">11.4 Extern Block Shell</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/module-level-forms/#1141-syntax">11.4.1 Syntax</a></li>
      <li><a href="/docs/specification/module-level-forms/#1142-parsing">11.4.2 Parsing</a></li>
      <li><a href="/docs/specification/module-level-forms/#1143-ast-representation-form">11.4.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/module-level-forms/#1144-static-semantics">11.4.4 Static Semantics</a></li>
      <li><a href="/docs/specification/module-level-forms/#1145-dynamic-semantics">11.4.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/module-level-forms/#1146-lowering">11.4.6 Lowering</a></li>
      <li><a href="/docs/specification/module-level-forms/#1147-diagnostics">11.4.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/module-level-forms/#115-module-and-file-aggregation">11.5 Module and File Aggregation</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/module-level-forms/#1151-syntax">11.5.1 Syntax</a></li>
      <li><a href="/docs/specification/module-level-forms/#1152-parsing">11.5.2 Parsing</a></li>
      <li><a href="/docs/specification/module-level-forms/#1153-ast-representation-form">11.5.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/module-level-forms/#1154-static-semantics">11.5.4 Static Semantics</a></li>
      <li><a href="/docs/specification/module-level-forms/#1155-dynamic-semantics">11.5.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/module-level-forms/#1156-lowering">11.5.6 Lowering</a></li>
      <li><a href="/docs/specification/module-level-forms/#1157-diagnostics">11.5.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
  </ol>
</li>
<li class="spec-outline-chapter">
  <a class="spec-outline-chapter-link" href="/docs/specification/concrete-data-types/">
    <span>12.</span>
    <strong>Concrete Data Types</strong>
  </a>
  <ol class="spec-outline-sections">
    <li>
      <a href="/docs/specification/concrete-data-types/#121-primitive-types">12.1 Primitive Types</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/concrete-data-types/#1211-syntax">12.1.1 Syntax</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1212-parsing">12.1.2 Parsing</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1213-ast-representation-form">12.1.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1214-static-semantics">12.1.4 Static Semantics</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1215-dynamic-semantics">12.1.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1216-lowering">12.1.6 Lowering</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1217-diagnostics">12.1.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/concrete-data-types/#122-tuples">12.2 Tuples</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/concrete-data-types/#1221-syntax">12.2.1 Syntax</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1222-parsing">12.2.2 Parsing</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1223-ast-representation-form">12.2.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1224-static-semantics">12.2.4 Static Semantics</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1225-dynamic-semantics">12.2.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1226-lowering">12.2.6 Lowering</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1227-diagnostics">12.2.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/concrete-data-types/#123-arrays">12.3 Arrays</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/concrete-data-types/#1231-syntax">12.3.1 Syntax</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1232-parsing">12.3.2 Parsing</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1233-ast-representation-form">12.3.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1234-static-semantics">12.3.4 Static Semantics</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1235-dynamic-semantics">12.3.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1236-lowering">12.3.6 Lowering</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1237-diagnostics">12.3.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/concrete-data-types/#124-slices">12.4 Slices</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/concrete-data-types/#1241-syntax">12.4.1 Syntax</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1242-parsing">12.4.2 Parsing</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1243-ast-representation-form">12.4.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1244-static-semantics">12.4.4 Static Semantics</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1245-dynamic-semantics">12.4.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1246-lowering">12.4.6 Lowering</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1247-diagnostics">12.4.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/concrete-data-types/#125-ranges">12.5 Ranges</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/concrete-data-types/#1251-syntax">12.5.1 Syntax</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1252-parsing">12.5.2 Parsing</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1253-ast-representation-form">12.5.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1254-static-semantics">12.5.4 Static Semantics</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1255-dynamic-semantics">12.5.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1256-lowering">12.5.6 Lowering</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1257-diagnostics">12.5.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/concrete-data-types/#126-records">12.6 Records</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/concrete-data-types/#1261-syntax">12.6.1 Syntax</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1262-parsing">12.6.2 Parsing</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1263-ast-representation-form">12.6.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1264-static-semantics">12.6.4 Static Semantics</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1265-dynamic-semantics">12.6.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1266-lowering">12.6.6 Lowering</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1267-diagnostics">12.6.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/concrete-data-types/#127-enums">12.7 Enums</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/concrete-data-types/#1271-syntax">12.7.1 Syntax</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1272-parsing">12.7.2 Parsing</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1273-ast-representation-form">12.7.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1274-static-semantics">12.7.4 Static Semantics</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1275-dynamic-semantics">12.7.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1276-lowering">12.7.6 Lowering</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1277-diagnostics">12.7.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/concrete-data-types/#128-union-types">12.8 Union Types</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/concrete-data-types/#1281-syntax">12.8.1 Syntax</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1282-parsing">12.8.2 Parsing</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1283-ast-representation-form">12.8.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1284-static-semantics">12.8.4 Static Semantics</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1285-dynamic-semantics">12.8.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1286-lowering">12.8.6 Lowering</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1287-diagnostics">12.8.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/concrete-data-types/#129-type-aliases">12.9 Type Aliases</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/concrete-data-types/#1291-syntax">12.9.1 Syntax</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1292-parsing">12.9.2 Parsing</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1293-ast-representation-form">12.9.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1294-static-semantics">12.9.4 Static Semantics</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1295-dynamic-semantics">12.9.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1296-lowering">12.9.6 Lowering</a></li>
      <li><a href="/docs/specification/concrete-data-types/#1297-diagnostics">12.9.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/concrete-data-types/#1210-data-type-diagnostics-supplement">12.10 Data Type Diagnostics Supplement</a>

    </li>
  </ol>
</li>
<li class="spec-outline-chapter">
  <a class="spec-outline-chapter-link" href="/docs/specification/modal-and-special-types/">
    <span>13.</span>
    <strong>Modal and Special Types</strong>
  </a>
  <ol class="spec-outline-sections">
    <li>
      <a href="/docs/specification/modal-and-special-types/#131-modal-declarations">13.1 Modal Declarations</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/modal-and-special-types/#1311-syntax">13.1.1 Syntax</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1312-parsing">13.1.2 Parsing</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1313-ast-representation-form">13.1.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1314-static-semantics">13.1.4 Static Semantics</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1315-dynamic-semantics">13.1.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1316-lowering">13.1.6 Lowering</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1317-diagnostics">13.1.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/modal-and-special-types/#132-state-fields">13.2 State Fields</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/modal-and-special-types/#1321-syntax">13.2.1 Syntax</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1322-parsing">13.2.2 Parsing</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1323-ast-representation-form">13.2.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1324-static-semantics">13.2.4 Static Semantics</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1325-dynamic-semantics">13.2.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1326-lowering">13.2.6 Lowering</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1327-diagnostics">13.2.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/modal-and-special-types/#133-state-specific-methods">13.3 State-Specific Methods</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/modal-and-special-types/#1331-syntax">13.3.1 Syntax</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1332-parsing">13.3.2 Parsing</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1333-ast-representation-form">13.3.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1334-static-semantics">13.3.4 Static Semantics</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1335-dynamic-semantics">13.3.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1336-lowering">13.3.6 Lowering</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1337-diagnostics">13.3.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/modal-and-special-types/#134-transitions">13.4 Transitions</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/modal-and-special-types/#1341-syntax">13.4.1 Syntax</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1342-parsing">13.4.2 Parsing</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1343-ast-representation-form">13.4.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1344-static-semantics">13.4.4 Static Semantics</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1345-dynamic-semantics">13.4.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1346-lowering">13.4.6 Lowering</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1347-diagnostics">13.4.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/modal-and-special-types/#135-modal-widening">13.5 Modal Widening</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/modal-and-special-types/#1351-syntax">13.5.1 Syntax</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1352-parsing">13.5.2 Parsing</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1353-ast-representation-form">13.5.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1354-static-semantics">13.5.4 Static Semantics</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1355-dynamic-semantics">13.5.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1356-lowering">13.5.6 Lowering</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1357-diagnostics">13.5.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/modal-and-special-types/#136-string-types">13.6 String Types</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/modal-and-special-types/#1361-syntax">13.6.1 Syntax</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1362-parsing">13.6.2 Parsing</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1363-ast-representation-form">13.6.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1364-static-semantics">13.6.4 Static Semantics</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1365-dynamic-semantics">13.6.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1366-lowering">13.6.6 Lowering</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1367-diagnostics">13.6.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/modal-and-special-types/#137-bytes-types">13.7 Bytes Types</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/modal-and-special-types/#1371-syntax">13.7.1 Syntax</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1372-parsing">13.7.2 Parsing</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1373-ast-representation-form">13.7.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1374-static-semantics">13.7.4 Static Semantics</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1375-dynamic-semantics">13.7.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1376-lowering">13.7.6 Lowering</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1377-diagnostics">13.7.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/modal-and-special-types/#138-safe-pointer-types">13.8 Safe Pointer Types</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/modal-and-special-types/#1381-syntax">13.8.1 Syntax</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1382-parsing">13.8.2 Parsing</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1383-ast-representation-form">13.8.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1384-static-semantics">13.8.4 Static Semantics</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1385-dynamic-semantics">13.8.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1386-lowering">13.8.6 Lowering</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1387-diagnostics">13.8.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/modal-and-special-types/#139-raw-pointer-types">13.9 Raw Pointer Types</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/modal-and-special-types/#1391-syntax">13.9.1 Syntax</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1392-parsing">13.9.2 Parsing</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1393-ast-representation-form">13.9.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1394-static-semantics">13.9.4 Static Semantics</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1395-dynamic-semantics">13.9.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1396-lowering">13.9.6 Lowering</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#1397-diagnostics">13.9.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/modal-and-special-types/#1310-function-types">13.10 Function Types</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/modal-and-special-types/#13101-syntax">13.10.1 Syntax</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#13102-parsing">13.10.2 Parsing</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#13103-ast-representation-form">13.10.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#13104-static-semantics">13.10.4 Static Semantics</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#13105-dynamic-semantics">13.10.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#13106-lowering">13.10.6 Lowering</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#13107-diagnostics">13.10.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/modal-and-special-types/#1311-closure-types">13.11 Closure Types</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/modal-and-special-types/#13111-syntax">13.11.1 Syntax</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#13112-parsing">13.11.2 Parsing</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#13113-ast-representation-form">13.11.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#13114-static-semantics">13.11.4 Static Semantics</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#13115-dynamic-semantics">13.11.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#13116-lowering">13.11.6 Lowering</a></li>
      <li><a href="/docs/specification/modal-and-special-types/#13117-diagnostics">13.11.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/modal-and-special-types/#1312-modal-and-pointer-diagnostics-supplement">13.12 Modal and Pointer Diagnostics Supplement</a>

    </li>
  </ol>
</li>
<li class="spec-outline-chapter">
  <a class="spec-outline-chapter-link" href="/docs/specification/abstraction-and-polymorphism/">
    <span>14.</span>
    <strong>Abstraction and Polymorphism</strong>
  </a>
  <ol class="spec-outline-sections">
    <li>
      <a href="/docs/specification/abstraction-and-polymorphism/#141-generic-parameters-and-arguments">14.1 Generic Parameters and Arguments</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1411-syntax">14.1.1 Syntax</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1412-parsing">14.1.2 Parsing</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1413-ast-representation-form">14.1.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1414-static-semantics">14.1.4 Static Semantics</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1415-dynamic-semantics">14.1.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1416-lowering">14.1.6 Lowering</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1417-diagnostics">14.1.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/abstraction-and-polymorphism/#142-generic-procedures-and-types">14.2 Generic Procedures and Types</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1421-syntax">14.2.1 Syntax</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1422-parsing">14.2.2 Parsing</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1423-ast-representation-form">14.2.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1424-static-semantics">14.2.4 Static Semantics</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1425-dynamic-semantics">14.2.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1426-lowering">14.2.6 Lowering</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1427-diagnostics">14.2.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/abstraction-and-polymorphism/#143-classes">14.3 Classes</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1431-syntax">14.3.1 Syntax</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1432-parsing">14.3.2 Parsing</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1433-ast-representation-form">14.3.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1434-static-semantics">14.3.4 Static Semantics</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1435-dynamic-semantics">14.3.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1436-lowering">14.3.6 Lowering</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1437-diagnostics">14.3.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/abstraction-and-polymorphism/#144-implementations">14.4 Implementations</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1441-syntax">14.4.1 Syntax</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1442-parsing">14.4.2 Parsing</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1443-ast-representation-form">14.4.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1444-static-semantics">14.4.4 Static Semantics</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1445-dynamic-semantics">14.4.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1446-lowering">14.4.6 Lowering</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1447-diagnostics">14.4.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/abstraction-and-polymorphism/#145-associated-types">14.5 Associated Types</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1451-syntax">14.5.1 Syntax</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1452-parsing">14.5.2 Parsing</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1453-ast-representation-form">14.5.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1454-static-semantics">14.5.4 Static Semantics</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1455-dynamic-semantics">14.5.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1456-lowering">14.5.6 Lowering</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1457-diagnostics">14.5.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/abstraction-and-polymorphism/#146-dynamic-class-objects">14.6 Dynamic Class Objects</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1461-syntax">14.6.1 Syntax</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1462-parsing">14.6.2 Parsing</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1463-ast-representation-form">14.6.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1464-static-semantics">14.6.4 Static Semantics</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1465-dynamic-semantics">14.6.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1466-lowering">14.6.6 Lowering</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1467-diagnostics">14.6.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/abstraction-and-polymorphism/#147-opaque-types">14.7 Opaque Types</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1471-syntax">14.7.1 Syntax</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1472-parsing">14.7.2 Parsing</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1473-ast-representation-form">14.7.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1474-static-semantics">14.7.4 Static Semantics</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1475-dynamic-semantics">14.7.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1476-lowering">14.7.6 Lowering</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1477-diagnostics">14.7.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/abstraction-and-polymorphism/#148-refinement-types">14.8 Refinement Types</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1481-syntax">14.8.1 Syntax</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1482-parsing">14.8.2 Parsing</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1483-ast-representation-form">14.8.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1484-static-semantics">14.8.4 Static Semantics</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1485-dynamic-semantics">14.8.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1486-lowering">14.8.6 Lowering</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1487-diagnostics">14.8.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/abstraction-and-polymorphism/#149-capability-classes">14.9 Capability Classes</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1491-syntax">14.9.1 Syntax</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1492-parsing">14.9.2 Parsing</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1493-ast-representation-form">14.9.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1494-static-semantics">14.9.4 Static Semantics</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1495-dynamic-semantics">14.9.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1496-lowering">14.9.6 Lowering</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#1497-diagnostics">14.9.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/abstraction-and-polymorphism/#1410-foundational-classes-and-predicates">14.10 Foundational Classes and Predicates</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#14101-syntax">14.10.1 Syntax</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#14102-parsing">14.10.2 Parsing</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#14103-ast-representation-form">14.10.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#14104-static-semantics">14.10.4 Static Semantics</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#14105-dynamic-semantics">14.10.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#14106-lowering">14.10.6 Lowering</a></li>
      <li><a href="/docs/specification/abstraction-and-polymorphism/#14107-diagnostics">14.10.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/abstraction-and-polymorphism/#1411-refinement-and-polymorphism-diagnostics-supplement">14.11 Refinement and Polymorphism Diagnostics Supplement</a>

    </li>
  </ol>
</li>
<li class="spec-outline-chapter">
  <a class="spec-outline-chapter-link" href="/docs/specification/procedures-and-contracts/">
    <span>15.</span>
    <strong>Procedures and Contracts</strong>
  </a>
  <ol class="spec-outline-sections">
    <li>
      <a href="/docs/specification/procedures-and-contracts/#151-procedure-declarations">15.1 Procedure Declarations</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/procedures-and-contracts/#1511-syntax">15.1.1 Syntax</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1512-parsing">15.1.2 Parsing</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1513-ast-representation-form">15.1.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1514-static-semantics">15.1.4 Static Semantics</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1515-dynamic-semantics">15.1.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1516-lowering">15.1.6 Lowering</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1517-diagnostics">15.1.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/procedures-and-contracts/#152-methods-and-receivers">15.2 Methods and Receivers</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/procedures-and-contracts/#1521-syntax">15.2.1 Syntax</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1522-parsing">15.2.2 Parsing</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1523-ast-representation-form">15.2.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1524-static-semantics">15.2.4 Static Semantics</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1525-dynamic-semantics">15.2.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1526-lowering">15.2.6 Lowering</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1527-diagnostics">15.2.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/procedures-and-contracts/#153-overloading">15.3 Overloading</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/procedures-and-contracts/#1531-syntax">15.3.1 Syntax</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1532-parsing">15.3.2 Parsing</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1533-ast-representation-form">15.3.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1534-static-semantics">15.3.4 Static Semantics</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1535-dynamic-semantics">15.3.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1536-lowering">15.3.6 Lowering</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1537-diagnostics">15.3.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/procedures-and-contracts/#154-contract-clauses">15.4 Contract Clauses</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/procedures-and-contracts/#1541-syntax">15.4.1 Syntax</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1542-parsing">15.4.2 Parsing</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1543-ast-representation-form">15.4.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1544-static-semantics">15.4.4 Static Semantics</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1545-dynamic-semantics">15.4.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1546-lowering">15.4.6 Lowering</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1547-diagnostics">15.4.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/procedures-and-contracts/#155-preconditions">15.5 Preconditions</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/procedures-and-contracts/#1551-syntax">15.5.1 Syntax</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1552-parsing">15.5.2 Parsing</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1553-ast-representation-form">15.5.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1554-static-semantics">15.5.4 Static Semantics</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1555-dynamic-semantics">15.5.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1556-lowering">15.5.6 Lowering</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1557-diagnostics">15.5.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/procedures-and-contracts/#156-postconditions">15.6 Postconditions</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/procedures-and-contracts/#1561-syntax">15.6.1 Syntax</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1562-parsing">15.6.2 Parsing</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1563-ast-representation-form">15.6.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1564-static-semantics">15.6.4 Static Semantics</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1565-dynamic-semantics">15.6.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1566-lowering">15.6.6 Lowering</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1567-diagnostics">15.6.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/procedures-and-contracts/#157-invariants">15.7 Invariants</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/procedures-and-contracts/#1571-syntax">15.7.1 Syntax</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1572-parsing">15.7.2 Parsing</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1573-ast-representation-form">15.7.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1574-static-semantics">15.7.4 Static Semantics</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1575-dynamic-semantics">15.7.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1576-lowering">15.7.6 Lowering</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1577-diagnostics">15.7.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/procedures-and-contracts/#158-verification-logic">15.8 Verification Logic</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/procedures-and-contracts/#1581-syntax">15.8.1 Syntax</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1582-parsing">15.8.2 Parsing</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1583-ast-representation-form">15.8.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1584-static-semantics">15.8.4 Static Semantics</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1585-dynamic-semantics">15.8.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1586-lowering">15.8.6 Lowering</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1587-diagnostics">15.8.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/procedures-and-contracts/#159-behavioral-subtyping">15.9 Behavioral Subtyping</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/procedures-and-contracts/#1591-syntax">15.9.1 Syntax</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1592-parsing">15.9.2 Parsing</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1593-ast-representation-form">15.9.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1594-static-semantics">15.9.4 Static Semantics</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1595-dynamic-semantics">15.9.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1596-lowering">15.9.6 Lowering</a></li>
      <li><a href="/docs/specification/procedures-and-contracts/#1597-diagnostics">15.9.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/procedures-and-contracts/#1510-procedure-contract-and-entry-diagnostics-supplement">15.10 Procedure, Contract, and Entry Diagnostics Supplement</a>

    </li>
  </ol>
</li>
<li class="spec-outline-chapter">
  <a class="spec-outline-chapter-link" href="/docs/specification/expressions/">
    <span>16.</span>
    <strong>Expressions</strong>
  </a>
  <ol class="spec-outline-sections">
    <li>
      <a href="/docs/specification/expressions/#161-literal-and-name-expressions">16.1 Literal and Name Expressions</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/expressions/#1611-syntax">16.1.1 Syntax</a></li>
      <li><a href="/docs/specification/expressions/#1612-parsing">16.1.2 Parsing</a></li>
      <li><a href="/docs/specification/expressions/#1613-ast-representation-form">16.1.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/expressions/#1614-static-semantics">16.1.4 Static Semantics</a></li>
      <li><a href="/docs/specification/expressions/#1615-dynamic-semantics">16.1.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/expressions/#1616-lowering">16.1.6 Lowering</a></li>
      <li><a href="/docs/specification/expressions/#1617-diagnostics">16.1.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/expressions/#162-access-and-place-expressions">16.2 Access and Place Expressions</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/expressions/#1621-syntax">16.2.1 Syntax</a></li>
      <li><a href="/docs/specification/expressions/#1622-parsing">16.2.2 Parsing</a></li>
      <li><a href="/docs/specification/expressions/#1623-ast-representation-form">16.2.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/expressions/#1624-static-semantics">16.2.4 Static Semantics</a></li>
      <li><a href="/docs/specification/expressions/#1625-dynamic-semantics">16.2.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/expressions/#1626-lowering">16.2.6 Lowering</a></li>
      <li><a href="/docs/specification/expressions/#1627-diagnostics">16.2.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/expressions/#163-call-expressions">16.3 Call Expressions</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/expressions/#1631-syntax">16.3.1 Syntax</a></li>
      <li><a href="/docs/specification/expressions/#1632-parsing">16.3.2 Parsing</a></li>
      <li><a href="/docs/specification/expressions/#1633-ast-representation-form">16.3.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/expressions/#1634-static-semantics">16.3.4 Static Semantics</a></li>
      <li><a href="/docs/specification/expressions/#1635-dynamic-semantics">16.3.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/expressions/#1636-lowering">16.3.6 Lowering</a></li>
      <li><a href="/docs/specification/expressions/#1637-diagnostics">16.3.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/expressions/#164-operator-expressions">16.4 Operator Expressions</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/expressions/#1641-syntax">16.4.1 Syntax</a></li>
      <li><a href="/docs/specification/expressions/#1642-parsing">16.4.2 Parsing</a></li>
      <li><a href="/docs/specification/expressions/#1643-ast-representation-form">16.4.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/expressions/#1644-static-semantics">16.4.4 Static Semantics</a></li>
      <li><a href="/docs/specification/expressions/#1645-dynamic-semantics">16.4.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/expressions/#1646-lowering">16.4.6 Lowering</a></li>
      <li><a href="/docs/specification/expressions/#1647-diagnostics">16.4.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/expressions/#165-cast-and-transmute-expressions">16.5 Cast and Transmute Expressions</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/expressions/#1651-syntax">16.5.1 Syntax</a></li>
      <li><a href="/docs/specification/expressions/#1652-parsing">16.5.2 Parsing</a></li>
      <li><a href="/docs/specification/expressions/#1653-ast-representation-form">16.5.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/expressions/#1654-static-semantics">16.5.4 Static Semantics</a></li>
      <li><a href="/docs/specification/expressions/#1655-dynamic-semantics">16.5.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/expressions/#1656-lowering">16.5.6 Lowering</a></li>
      <li><a href="/docs/specification/expressions/#1657-diagnostics">16.5.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/expressions/#166-construction-expressions">16.6 Construction Expressions</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/expressions/#1661-syntax">16.6.1 Syntax</a></li>
      <li><a href="/docs/specification/expressions/#1662-parsing">16.6.2 Parsing</a></li>
      <li><a href="/docs/specification/expressions/#1663-ast-representation-form">16.6.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/expressions/#1664-static-semantics">16.6.4 Static Semantics</a></li>
      <li><a href="/docs/specification/expressions/#1665-dynamic-semantics">16.6.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/expressions/#1666-lowering">16.6.6 Lowering</a></li>
      <li><a href="/docs/specification/expressions/#1667-diagnostics">16.6.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/expressions/#167-control-expressions">16.7 Control Expressions</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/expressions/#1671-syntax">16.7.1 Syntax</a></li>
      <li><a href="/docs/specification/expressions/#1672-parsing">16.7.2 Parsing</a></li>
      <li><a href="/docs/specification/expressions/#1673-ast-representation-form">16.7.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/expressions/#1674-static-semantics">16.7.4 Static Semantics</a></li>
      <li><a href="/docs/specification/expressions/#1675-dynamic-semantics">16.7.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/expressions/#1676-lowering">16.7.6 Lowering</a></li>
      <li><a href="/docs/specification/expressions/#1677-diagnostics">16.7.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/expressions/#168-effectful-core-expressions">16.8 Effectful Core Expressions</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/expressions/#1681-syntax">16.8.1 Syntax</a></li>
      <li><a href="/docs/specification/expressions/#1682-parsing">16.8.2 Parsing</a></li>
      <li><a href="/docs/specification/expressions/#1683-ast-representation-form">16.8.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/expressions/#1684-static-semantics">16.8.4 Static Semantics</a></li>
      <li><a href="/docs/specification/expressions/#1685-dynamic-semantics">16.8.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/expressions/#1686-lowering">16.8.6 Lowering</a></li>
      <li><a href="/docs/specification/expressions/#1687-diagnostics">16.8.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/expressions/#169-closure-and-pipeline-expressions">16.9 Closure and Pipeline Expressions</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/expressions/#1691-syntax">16.9.1 Syntax</a></li>
      <li><a href="/docs/specification/expressions/#1692-parsing">16.9.2 Parsing</a></li>
      <li><a href="/docs/specification/expressions/#1693-ast-representation-form">16.9.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/expressions/#1694-static-semantics">16.9.4 Static Semantics</a></li>
      <li><a href="/docs/specification/expressions/#1695-dynamic-semantics">16.9.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/expressions/#1696-lowering">16.9.6 Lowering</a></li>
      <li><a href="/docs/specification/expressions/#1697-diagnostics">16.9.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/expressions/#1610-expression-diagnostics-supplement">16.10 Expression Diagnostics Supplement</a>

    </li>
  </ol>
</li>
<li class="spec-outline-chapter">
  <a class="spec-outline-chapter-link" href="/docs/specification/patterns/">
    <span>17.</span>
    <strong>Patterns</strong>
  </a>
  <ol class="spec-outline-sections">
    <li>
      <a href="/docs/specification/patterns/#171-basic-patterns">17.1 Basic Patterns</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/patterns/#1711-syntax">17.1.1 Syntax</a></li>
      <li><a href="/docs/specification/patterns/#1712-parsing">17.1.2 Parsing</a></li>
      <li><a href="/docs/specification/patterns/#1713-ast-representation-form">17.1.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/patterns/#1714-static-semantics">17.1.4 Static Semantics</a></li>
      <li><a href="/docs/specification/patterns/#1715-dynamic-semantics">17.1.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/patterns/#1716-lowering">17.1.6 Lowering</a></li>
      <li><a href="/docs/specification/patterns/#1717-diagnostics">17.1.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/patterns/#172-tuple-and-record-patterns">17.2 Tuple and Record Patterns</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/patterns/#1721-syntax">17.2.1 Syntax</a></li>
      <li><a href="/docs/specification/patterns/#1722-parsing">17.2.2 Parsing</a></li>
      <li><a href="/docs/specification/patterns/#1723-ast-representation-form">17.2.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/patterns/#1724-static-semantics">17.2.4 Static Semantics</a></li>
      <li><a href="/docs/specification/patterns/#1725-dynamic-semantics">17.2.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/patterns/#1726-lowering">17.2.6 Lowering</a></li>
      <li><a href="/docs/specification/patterns/#1727-diagnostics">17.2.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/patterns/#173-enum-and-modal-patterns">17.3 Enum and Modal Patterns</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/patterns/#1731-syntax">17.3.1 Syntax</a></li>
      <li><a href="/docs/specification/patterns/#1732-parsing">17.3.2 Parsing</a></li>
      <li><a href="/docs/specification/patterns/#1733-ast-representation-form">17.3.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/patterns/#1734-static-semantics">17.3.4 Static Semantics</a></li>
      <li><a href="/docs/specification/patterns/#1735-dynamic-semantics">17.3.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/patterns/#1736-lowering">17.3.6 Lowering</a></li>
      <li><a href="/docs/specification/patterns/#1737-diagnostics">17.3.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/patterns/#174-range-patterns">17.4 Range Patterns</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/patterns/#1741-syntax">17.4.1 Syntax</a></li>
      <li><a href="/docs/specification/patterns/#1742-parsing">17.4.2 Parsing</a></li>
      <li><a href="/docs/specification/patterns/#1743-ast-representation-form">17.4.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/patterns/#1744-static-semantics">17.4.4 Static Semantics</a></li>
      <li><a href="/docs/specification/patterns/#1745-dynamic-semantics">17.4.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/patterns/#1746-lowering">17.4.6 Lowering</a></li>
      <li><a href="/docs/specification/patterns/#1747-diagnostics">17.4.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/patterns/#175-case-clauses">17.5 Case Clauses</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/patterns/#1751-syntax">17.5.1 Syntax</a></li>
      <li><a href="/docs/specification/patterns/#1752-parsing">17.5.2 Parsing</a></li>
      <li><a href="/docs/specification/patterns/#1753-ast-representation-form">17.5.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/patterns/#1754-static-semantics">17.5.4 Static Semantics</a></li>
      <li><a href="/docs/specification/patterns/#1755-dynamic-semantics">17.5.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/patterns/#1756-lowering">17.5.6 Lowering</a></li>
      <li><a href="/docs/specification/patterns/#1757-diagnostics">17.5.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/patterns/#176-exhaustiveness-and-reachability">17.6 Exhaustiveness and Reachability</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/patterns/#1761-syntax">17.6.1 Syntax</a></li>
      <li><a href="/docs/specification/patterns/#1762-parsing">17.6.2 Parsing</a></li>
      <li><a href="/docs/specification/patterns/#1763-ast-representation-form">17.6.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/patterns/#1764-static-semantics">17.6.4 Static Semantics</a></li>
      <li><a href="/docs/specification/patterns/#1765-dynamic-semantics">17.6.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/patterns/#1766-lowering">17.6.6 Lowering</a></li>
      <li><a href="/docs/specification/patterns/#1767-diagnostics">17.6.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/patterns/#177-pattern-diagnostics-supplement">17.7 Pattern Diagnostics Supplement</a>

    </li>
  </ol>
</li>
<li class="spec-outline-chapter">
  <a class="spec-outline-chapter-link" href="/docs/specification/statements-and-blocks/">
    <span>18.</span>
    <strong>Statements and Blocks</strong>
  </a>
  <ol class="spec-outline-sections">
    <li>
      <a href="/docs/specification/statements-and-blocks/#181-blocks">18.1 Blocks</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/statements-and-blocks/#1811-syntax">18.1.1 Syntax</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1812-parsing">18.1.2 Parsing</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1813-ast-representation-form">18.1.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1814-static-semantics">18.1.4 Static Semantics</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1815-dynamic-semantics">18.1.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1816-lowering">18.1.6 Lowering</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1817-diagnostics">18.1.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/statements-and-blocks/#182-binding-statements">18.2 Binding Statements</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/statements-and-blocks/#1821-syntax">18.2.1 Syntax</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1822-parsing">18.2.2 Parsing</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1823-ast-representation-form">18.2.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1824-static-semantics">18.2.4 Static Semantics</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1825-dynamic-semantics">18.2.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1826-lowering">18.2.6 Lowering</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1827-diagnostics">18.2.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/statements-and-blocks/#183-local-using-statements">18.3 Local Using Statements</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/statements-and-blocks/#1831-syntax">18.3.1 Syntax</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1832-parsing">18.3.2 Parsing</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1833-ast-representation-form">18.3.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1834-static-semantics">18.3.4 Static Semantics</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1835-dynamic-semantics">18.3.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1836-lowering">18.3.6 Lowering</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1837-diagnostics">18.3.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/statements-and-blocks/#184-assignment-statements">18.4 Assignment Statements</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/statements-and-blocks/#1841-syntax">18.4.1 Syntax</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1842-parsing">18.4.2 Parsing</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1843-ast-representation-form">18.4.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1844-static-semantics">18.4.4 Static Semantics</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1845-dynamic-semantics">18.4.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1846-lowering">18.4.6 Lowering</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1847-diagnostics">18.4.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/statements-and-blocks/#185-expression-statements">18.5 Expression Statements</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/statements-and-blocks/#1851-syntax">18.5.1 Syntax</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1852-parsing">18.5.2 Parsing</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1853-ast-representation-form">18.5.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1854-static-semantics">18.5.4 Static Semantics</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1855-dynamic-semantics">18.5.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1856-lowering">18.5.6 Lowering</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1857-diagnostics">18.5.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/statements-and-blocks/#186-defer">18.6 Defer</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/statements-and-blocks/#1861-syntax">18.6.1 Syntax</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1862-parsing">18.6.2 Parsing</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1863-ast-representation-form">18.6.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1864-static-semantics">18.6.4 Static Semantics</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1865-dynamic-semantics">18.6.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1866-lowering">18.6.6 Lowering</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1867-diagnostics">18.6.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/statements-and-blocks/#187-region">18.7 Region</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/statements-and-blocks/#1871-syntax">18.7.1 Syntax</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1872-parsing">18.7.2 Parsing</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1873-ast-representation-form">18.7.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1874-static-semantics">18.7.4 Static Semantics</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1875-dynamic-semantics">18.7.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1876-lowering">18.7.6 Lowering</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1877-diagnostics">18.7.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/statements-and-blocks/#188-frame">18.8 Frame</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/statements-and-blocks/#1881-syntax">18.8.1 Syntax</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1882-parsing">18.8.2 Parsing</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1883-ast-representation-form">18.8.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1884-static-semantics">18.8.4 Static Semantics</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1885-dynamic-semantics">18.8.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1886-lowering">18.8.6 Lowering</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1887-diagnostics">18.8.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/statements-and-blocks/#189-control-transfer-statements">18.9 Control-Transfer Statements</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/statements-and-blocks/#1891-syntax">18.9.1 Syntax</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1892-parsing">18.9.2 Parsing</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1893-ast-representation-form">18.9.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1894-static-semantics">18.9.4 Static Semantics</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1895-dynamic-semantics">18.9.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1896-lowering">18.9.6 Lowering</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#1897-diagnostics">18.9.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/statements-and-blocks/#1810-unsafe-statements">18.10 Unsafe Statements</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/statements-and-blocks/#18101-syntax">18.10.1 Syntax</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#18102-parsing">18.10.2 Parsing</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#18103-ast-representation-form">18.10.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#18104-static-semantics">18.10.4 Static Semantics</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#18105-dynamic-semantics">18.10.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#18106-lowering">18.10.6 Lowering</a></li>
      <li><a href="/docs/specification/statements-and-blocks/#18107-diagnostics">18.10.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/statements-and-blocks/#1811-statement-diagnostics-supplement">18.11 Statement Diagnostics Supplement</a>

    </li>
  </ol>
</li>
<li class="spec-outline-chapter">
  <a class="spec-outline-chapter-link" href="/docs/specification/key-system/">
    <span>19.</span>
    <strong>Key System</strong>
  </a>
  <ol class="spec-outline-sections">
    <li>
      <a href="/docs/specification/key-system/#191-key-paths">19.1 Key Paths</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/key-system/#1911-syntax">19.1.1 Syntax</a></li>
      <li><a href="/docs/specification/key-system/#1912-parsing">19.1.2 Parsing</a></li>
      <li><a href="/docs/specification/key-system/#1913-ast-representation-form">19.1.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/key-system/#1914-static-semantics">19.1.4 Static Semantics</a></li>
      <li><a href="/docs/specification/key-system/#1915-dynamic-semantics">19.1.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/key-system/#1916-lowering">19.1.6 Lowering</a></li>
      <li><a href="/docs/specification/key-system/#1917-diagnostics">19.1.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/key-system/#192-key-acquisition-blocks">19.2 Key Acquisition Blocks</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/key-system/#1921-syntax">19.2.1 Syntax</a></li>
      <li><a href="/docs/specification/key-system/#1922-parsing">19.2.2 Parsing</a></li>
      <li><a href="/docs/specification/key-system/#1923-ast-representation-form">19.2.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/key-system/#1924-static-semantics">19.2.4 Static Semantics</a></li>
      <li><a href="/docs/specification/key-system/#1925-dynamic-semantics">19.2.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/key-system/#1926-lowering">19.2.6 Lowering</a></li>
      <li><a href="/docs/specification/key-system/#1927-diagnostics">19.2.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/key-system/#193-conflict-detection">19.3 Conflict Detection</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/key-system/#1931-syntax">19.3.1 Syntax</a></li>
      <li><a href="/docs/specification/key-system/#1932-parsing">19.3.2 Parsing</a></li>
      <li><a href="/docs/specification/key-system/#1933-ast-representation-form">19.3.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/key-system/#1934-static-semantics">19.3.4 Static Semantics</a></li>
      <li><a href="/docs/specification/key-system/#1935-dynamic-semantics">19.3.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/key-system/#1936-lowering">19.3.6 Lowering</a></li>
      <li><a href="/docs/specification/key-system/#1937-diagnostics">19.3.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/key-system/#194-nested-release">19.4 Nested Release</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/key-system/#1941-syntax">19.4.1 Syntax</a></li>
      <li><a href="/docs/specification/key-system/#1942-parsing">19.4.2 Parsing</a></li>
      <li><a href="/docs/specification/key-system/#1943-ast-representation-form">19.4.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/key-system/#1944-static-semantics">19.4.4 Static Semantics</a></li>
      <li><a href="/docs/specification/key-system/#1945-dynamic-semantics">19.4.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/key-system/#1946-lowering">19.4.6 Lowering</a></li>
      <li><a href="/docs/specification/key-system/#1947-diagnostics">19.4.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/key-system/#195-speculative-execution">19.5 Speculative Execution</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/key-system/#1951-syntax">19.5.1 Syntax</a></li>
      <li><a href="/docs/specification/key-system/#1952-parsing">19.5.2 Parsing</a></li>
      <li><a href="/docs/specification/key-system/#1953-ast-representation-form">19.5.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/key-system/#1954-static-semantics">19.5.4 Static Semantics</a></li>
      <li><a href="/docs/specification/key-system/#1955-dynamic-semantics">19.5.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/key-system/#1956-lowering">19.5.6 Lowering</a></li>
      <li><a href="/docs/specification/key-system/#1957-diagnostics">19.5.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/key-system/#196-dynamic-key-verification">19.6 Dynamic Key Verification</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/key-system/#1961-syntax">19.6.1 Syntax</a></li>
      <li><a href="/docs/specification/key-system/#1962-parsing">19.6.2 Parsing</a></li>
      <li><a href="/docs/specification/key-system/#1963-ast-representation-form">19.6.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/key-system/#1964-static-semantics">19.6.4 Static Semantics</a></li>
      <li><a href="/docs/specification/key-system/#1965-dynamic-semantics">19.6.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/key-system/#1966-lowering">19.6.6 Lowering</a></li>
      <li><a href="/docs/specification/key-system/#1967-diagnostics">19.6.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/key-system/#197-memory-ordering">19.7 Memory Ordering</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/key-system/#1971-syntax">19.7.1 Syntax</a></li>
      <li><a href="/docs/specification/key-system/#1972-parsing">19.7.2 Parsing</a></li>
      <li><a href="/docs/specification/key-system/#1973-ast-representation-form">19.7.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/key-system/#1974-static-semantics">19.7.4 Static Semantics</a></li>
      <li><a href="/docs/specification/key-system/#1975-dynamic-semantics">19.7.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/key-system/#1976-lowering">19.7.6 Lowering</a></li>
      <li><a href="/docs/specification/key-system/#1977-diagnostics">19.7.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
  </ol>
</li>
<li class="spec-outline-chapter">
  <a class="spec-outline-chapter-link" href="/docs/specification/structured-parallelism/">
    <span>20.</span>
    <strong>Structured Parallelism</strong>
  </a>
  <ol class="spec-outline-sections">
    <li>
      <a href="/docs/specification/structured-parallelism/#201-parallel-blocks">20.1 Parallel Blocks</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/structured-parallelism/#2011-syntax">20.1.1 Syntax</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2012-parsing">20.1.2 Parsing</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2013-ast-representation-form">20.1.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2014-static-semantics">20.1.4 Static Semantics</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2015-dynamic-semantics">20.1.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2016-lowering">20.1.6 Lowering</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2017-diagnostics">20.1.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/structured-parallelism/#202-execution-domains">20.2 Execution Domains</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/structured-parallelism/#2021-syntax">20.2.1 Syntax</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2022-parsing">20.2.2 Parsing</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2023-ast-representation-form">20.2.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2024-static-semantics">20.2.4 Static Semantics</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2025-dynamic-semantics">20.2.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2026-lowering">20.2.6 Lowering</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2027-diagnostics">20.2.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/structured-parallelism/#203-capture-semantics">20.3 Capture Semantics</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/structured-parallelism/#2031-syntax">20.3.1 Syntax</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2032-parsing">20.3.2 Parsing</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2033-ast-representation-form">20.3.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2034-static-semantics">20.3.4 Static Semantics</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2035-dynamic-semantics">20.3.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2036-lowering">20.3.6 Lowering</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2037-diagnostics">20.3.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/structured-parallelism/#204-spawn">20.4 Spawn</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/structured-parallelism/#2041-syntax">20.4.1 Syntax</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2042-parsing">20.4.2 Parsing</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2043-ast-representation-form">20.4.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2044-static-semantics">20.4.4 Static Semantics</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2045-dynamic-semantics">20.4.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2046-lowering">20.4.6 Lowering</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2047-diagnostics">20.4.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/structured-parallelism/#205-dispatch">20.5 Dispatch</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/structured-parallelism/#2051-syntax">20.5.1 Syntax</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2052-parsing">20.5.2 Parsing</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2053-ast-representation-form">20.5.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2054-static-semantics">20.5.4 Static Semantics</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2055-dynamic-semantics">20.5.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2056-lowering">20.5.6 Lowering</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2057-diagnostics">20.5.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/structured-parallelism/#206-cancellation">20.6 Cancellation</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/structured-parallelism/#2061-syntax">20.6.1 Syntax</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2062-parsing">20.6.2 Parsing</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2063-ast-representation-form">20.6.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2064-static-semantics">20.6.4 Static Semantics</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2065-dynamic-semantics">20.6.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2066-lowering">20.6.6 Lowering</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2067-diagnostics">20.6.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/structured-parallelism/#207-panic-handling">20.7 Panic Handling</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/structured-parallelism/#2071-syntax">20.7.1 Syntax</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2072-parsing">20.7.2 Parsing</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2073-ast-representation-form">20.7.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2074-static-semantics">20.7.4 Static Semantics</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2075-dynamic-semantics">20.7.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2076-lowering">20.7.6 Lowering</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2077-diagnostics">20.7.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/structured-parallelism/#208-determinism-and-nesting">20.8 Determinism and Nesting</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/structured-parallelism/#2081-syntax">20.8.1 Syntax</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2082-parsing">20.8.2 Parsing</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2083-ast-representation-form">20.8.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2084-static-semantics">20.8.4 Static Semantics</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2085-dynamic-semantics">20.8.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2086-lowering">20.8.6 Lowering</a></li>
      <li><a href="/docs/specification/structured-parallelism/#2087-diagnostics">20.8.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/structured-parallelism/#209-structured-parallelism-diagnostics-supplement">20.9 Structured Parallelism Diagnostics Supplement</a>

    </li>
  </ol>
</li>
<li class="spec-outline-chapter">
  <a class="spec-outline-chapter-link" href="/docs/specification/asynchronous-operations/">
    <span>21.</span>
    <strong>Asynchronous Operations</strong>
  </a>
  <ol class="spec-outline-sections">
    <li>
      <a href="/docs/specification/asynchronous-operations/#211-async-type">21.1 Async Type</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/asynchronous-operations/#2111-syntax">21.1.1 Syntax</a></li>
      <li><a href="/docs/specification/asynchronous-operations/#2112-parsing">21.1.2 Parsing</a></li>
      <li><a href="/docs/specification/asynchronous-operations/#2113-ast-representation-form">21.1.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/asynchronous-operations/#2114-static-semantics">21.1.4 Static Semantics</a></li>
      <li><a href="/docs/specification/asynchronous-operations/#2115-dynamic-semantics">21.1.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/asynchronous-operations/#2116-lowering">21.1.6 Lowering</a></li>
      <li><a href="/docs/specification/asynchronous-operations/#2117-diagnostics">21.1.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/asynchronous-operations/#212-suspension-forms">21.2 Suspension Forms</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/asynchronous-operations/#2121-syntax">21.2.1 Syntax</a></li>
      <li><a href="/docs/specification/asynchronous-operations/#2122-parsing">21.2.2 Parsing</a></li>
      <li><a href="/docs/specification/asynchronous-operations/#2123-ast-representation-form">21.2.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/asynchronous-operations/#2124-static-semantics">21.2.4 Static Semantics</a></li>
      <li><a href="/docs/specification/asynchronous-operations/#2125-dynamic-semantics">21.2.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/asynchronous-operations/#2126-lowering">21.2.6 Lowering</a></li>
      <li><a href="/docs/specification/asynchronous-operations/#2127-diagnostics">21.2.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/asynchronous-operations/#213-composition-forms">21.3 Composition Forms</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/asynchronous-operations/#2131-syntax">21.3.1 Syntax</a></li>
      <li><a href="/docs/specification/asynchronous-operations/#2132-parsing">21.3.2 Parsing</a></li>
      <li><a href="/docs/specification/asynchronous-operations/#2133-ast-representation-form">21.3.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/asynchronous-operations/#2134-static-semantics">21.3.4 Static Semantics</a></li>
      <li><a href="/docs/specification/asynchronous-operations/#2135-dynamic-semantics">21.3.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/asynchronous-operations/#2136-lowering">21.3.6 Lowering</a></li>
      <li><a href="/docs/specification/asynchronous-operations/#2137-diagnostics">21.3.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/asynchronous-operations/#214-async-state-machine">21.4 Async State Machine</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/asynchronous-operations/#2141-syntax">21.4.1 Syntax</a></li>
      <li><a href="/docs/specification/asynchronous-operations/#2142-parsing">21.4.2 Parsing</a></li>
      <li><a href="/docs/specification/asynchronous-operations/#2143-ast-representation-form">21.4.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/asynchronous-operations/#2144-static-semantics">21.4.4 Static Semantics</a></li>
      <li><a href="/docs/specification/asynchronous-operations/#2145-dynamic-semantics">21.4.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/asynchronous-operations/#2146-lowering">21.4.6 Lowering</a></li>
      <li><a href="/docs/specification/asynchronous-operations/#2147-diagnostics">21.4.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/asynchronous-operations/#215-async-key-integration">21.5 Async-Key Integration</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/asynchronous-operations/#2151-syntax">21.5.1 Syntax</a></li>
      <li><a href="/docs/specification/asynchronous-operations/#2152-parsing">21.5.2 Parsing</a></li>
      <li><a href="/docs/specification/asynchronous-operations/#2153-ast-representation-form">21.5.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/asynchronous-operations/#2154-static-semantics">21.5.4 Static Semantics</a></li>
      <li><a href="/docs/specification/asynchronous-operations/#2155-dynamic-semantics">21.5.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/asynchronous-operations/#2156-lowering">21.5.6 Lowering</a></li>
      <li><a href="/docs/specification/asynchronous-operations/#2157-diagnostics">21.5.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/asynchronous-operations/#216-async-diagnostics-supplement">21.6 Async Diagnostics Supplement</a>

    </li>
  </ol>
</li>
<li class="spec-outline-chapter">
  <a class="spec-outline-chapter-link" href="/docs/specification/compile-time-execution-and-metaprogramming/">
    <span>22.</span>
    <strong>Compile-Time Execution and Metaprogramming</strong>
  </a>
  <ol class="spec-outline-sections">
    <li>
      <a href="/docs/specification/compile-time-execution-and-metaprogramming/#221-compile-time-forms">22.1 Compile-Time Forms</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2211-syntax">22.1.1 Syntax</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2212-parsing">22.1.2 Parsing</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2213-ast-representation-form">22.1.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2214-static-semantics">22.1.4 Static Semantics</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2215-dynamic-semantics">22.1.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2216-lowering">22.1.6 Lowering</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2217-diagnostics">22.1.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/compile-time-execution-and-metaprogramming/#222-compile-time-capabilities">22.2 Compile-Time Capabilities</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2221-syntax">22.2.1 Syntax</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2222-parsing">22.2.2 Parsing</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2223-ast-representation-form">22.2.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2224-static-semantics">22.2.4 Static Semantics</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2225-dynamic-semantics">22.2.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2226-lowering">22.2.6 Lowering</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2227-diagnostics">22.2.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/compile-time-execution-and-metaprogramming/#223-reflection">22.3 Reflection</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2231-syntax">22.3.1 Syntax</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2232-parsing">22.3.2 Parsing</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2233-ast-representation-form">22.3.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2234-static-semantics">22.3.4 Static Semantics</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2235-dynamic-semantics">22.3.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2236-lowering">22.3.6 Lowering</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2237-diagnostics">22.3.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/compile-time-execution-and-metaprogramming/#224-quote-splice-and-emission">22.4 Quote, Splice, and Emission</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2241-syntax">22.4.1 Syntax</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2242-parsing">22.4.2 Parsing</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2243-ast-representation-form">22.4.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2244-static-semantics">22.4.4 Static Semantics</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2245-dynamic-semantics">22.4.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2246-lowering">22.4.6 Lowering</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2247-diagnostics">22.4.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/compile-time-execution-and-metaprogramming/#225-derive-targets-and-contracts">22.5 Derive Targets and Contracts</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2251-syntax">22.5.1 Syntax</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2252-parsing">22.5.2 Parsing</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2253-ast-representation-form">22.5.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2254-static-semantics">22.5.4 Static Semantics</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2255-dynamic-semantics">22.5.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2256-lowering">22.5.6 Lowering</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/#2257-diagnostics">22.5.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/compile-time-execution-and-metaprogramming/#226-compile-time-diagnostics-supplement">22.6 Compile-Time Diagnostics Supplement</a>

    </li>
  </ol>
</li>
<li class="spec-outline-chapter">
  <a class="spec-outline-chapter-link" href="/docs/specification/foreign-function-interface/">
    <span>23.</span>
    <strong>Foreign Function Interface</strong>
  </a>
  <ol class="spec-outline-sections">
    <li>
      <a href="/docs/specification/foreign-function-interface/#231-ffisafe">23.1 FfiSafe</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/foreign-function-interface/#2311-syntax">23.1.1 Syntax</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2312-parsing">23.1.2 Parsing</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2313-ast-representation-form">23.1.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2314-static-semantics">23.1.4 Static Semantics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2315-dynamic-semantics">23.1.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2316-lowering">23.1.6 Lowering</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2317-diagnostics">23.1.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/foreign-function-interface/#232-extern-procedures">23.2 Extern Procedures</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/foreign-function-interface/#2321-syntax">23.2.1 Syntax</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2322-parsing">23.2.2 Parsing</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2323-ast-representation-form">23.2.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2324-static-semantics">23.2.4 Static Semantics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2325-dynamic-semantics">23.2.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2326-lowering">23.2.6 Lowering</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2327-diagnostics">23.2.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/foreign-function-interface/#233-exported-procedures-and-hosted-exports">23.3 Exported Procedures and Hosted Exports</a>
<details class="spec-outline-subsections">
    <summary>14 subsections</summary>
    <ol>
      <li><a href="/docs/specification/foreign-function-interface/#2331-raw-exported-procedures">23.3.1 Raw Exported Procedures</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2332-parsing">23.3.2 Parsing</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2333-ast-representation-form">23.3.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2334-static-semantics">23.3.4 Static Semantics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2335-dynamic-semantics">23.3.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2336-lowering">23.3.6 Lowering</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2337-diagnostics">23.3.7 Diagnostics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2338-hosted-exports">23.3.8 Hosted Exports</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2339-parsing">23.3.9 Parsing</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#23310-ast-representation-form">23.3.10 AST Representation / Form</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#23311-static-semantics">23.3.11 Static Semantics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#23312-dynamic-semantics">23.3.12 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#23313-lowering">23.3.13 Lowering</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#23314-diagnostics">23.3.14 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/foreign-function-interface/#234-ffi-attributes">23.4 FFI Attributes</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/foreign-function-interface/#2341-syntax">23.4.1 Syntax</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2342-parsing">23.4.2 Parsing</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2343-ast-representation-form">23.4.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2344-static-semantics">23.4.4 Static Semantics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2345-dynamic-semantics">23.4.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2346-lowering">23.4.6 Lowering</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2347-diagnostics">23.4.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/foreign-function-interface/#235-capability-isolation">23.5 Capability Isolation</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/foreign-function-interface/#2351-syntax">23.5.1 Syntax</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2352-parsing">23.5.2 Parsing</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2353-ast-representation-form">23.5.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2354-static-semantics">23.5.4 Static Semantics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2355-dynamic-semantics">23.5.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2356-lowering">23.5.6 Lowering</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2357-diagnostics">23.5.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/foreign-function-interface/#236-foreign-contracts">23.6 Foreign Contracts</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/foreign-function-interface/#2361-syntax">23.6.1 Syntax</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2362-parsing">23.6.2 Parsing</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2363-ast-representation-form">23.6.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2364-static-semantics">23.6.4 Static Semantics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2365-dynamic-semantics">23.6.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2366-lowering">23.6.6 Lowering</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2367-diagnostics">23.6.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/foreign-function-interface/#237-boundary-unwinding">23.7 Boundary Unwinding</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/foreign-function-interface/#2371-syntax">23.7.1 Syntax</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2372-parsing">23.7.2 Parsing</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2373-ast-representation-form">23.7.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2374-static-semantics">23.7.4 Static Semantics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2375-dynamic-semantics">23.7.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2376-lowering">23.7.6 Lowering</a></li>
      <li><a href="/docs/specification/foreign-function-interface/#2377-diagnostics">23.7.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/foreign-function-interface/#238-ffi-diagnostics-supplement">23.8 FFI Diagnostics Supplement</a>

    </li>
  </ol>
</li>
<li class="spec-outline-chapter">
  <a class="spec-outline-chapter-link" href="/docs/specification/common-lowering-program-lifecycle-and-backend/">
    <span>24.</span>
    <strong>Common Lowering, Program Lifecycle, and Backend</strong>
  </a>
  <ol class="spec-outline-sections">
    <li>
      <a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#241-shared-lowering-judgments">24.1 Shared Lowering Judgments</a>
<details class="spec-outline-subsections">
    <summary>4 subsections</summary>
    <ol>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#2411-codegen-model-and-targets">24.1.1 Codegen Model and Targets</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#2412-shared-judgments-and-correctness">24.1.2 Shared Judgments and Correctness</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#2413-ir-forms-and-composition">24.1.3 IR Forms and Composition</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#2414-project-and-module-composition">24.1.4 Project and Module Composition</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#242-layout-and-abi-framework">24.2 Layout and ABI Framework</a>
<details class="spec-outline-subsections">
    <summary>5 subsections</summary>
    <ol>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#2421-primitive-layout-and-encoding">24.2.1 Primitive Layout and Encoding</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#2422-permission-pointer-and-function-layout">24.2.2 Permission, Pointer, and Function Layout</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#2423-default-calling-convention">24.2.3 Default Calling Convention</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#2424-abi-type-lowering">24.2.4 ABI Type Lowering</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#2425-abi-parameter-and-return-passing">24.2.5 ABI Parameter and Return Passing</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#243-symbols-mangling-and-linkage">24.3 Symbols, Mangling, and Linkage</a>
<details class="spec-outline-subsections">
    <summary>2 subsections</summary>
    <ol>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#2431-symbol-names-and-mangling">24.3.1 Symbol Names and Mangling</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#2432-linkage-for-generated-symbols">24.3.2 Linkage for Generated Symbols</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#244-initialization-and-program-lifecycle">24.4 Initialization and Program Lifecycle</a>
<details class="spec-outline-subsections">
    <summary>5 subsections</summary>
    <ol>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#2441-static-globals-and-module-initdeinit-lowering">24.4.1 Static Globals and Module Init/Deinit Lowering</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#2442-initialization-order-poisoning-and-project-lifecycle">24.4.2 Initialization Order, Poisoning, and Project Lifecycle</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#2443-entry-symbols-and-context-construction">24.4.3 Entry Symbols and Context Construction</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#2444-library-images-and-hosted-library-sessions">24.4.4 Library Images and Hosted Library Sessions</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#2445-interpreter-entrypoint">24.4.5 Interpreter Entrypoint</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#245-cleanup-drop-and-unwinding-framework">24.5 Cleanup, Drop, and Unwinding Framework</a>
<details class="spec-outline-subsections">
    <summary>4 subsections</summary>
    <ol>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#2451-cleanup-lowering-interface">24.5.1 Cleanup Lowering Interface</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#2452-panic-record-and-panic-lowering">24.5.2 Panic Record and Panic Lowering</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#2453-deterministic-destruction">24.5.3 Deterministic Destruction</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#2454-cleanup-and-unwinding-driver">24.5.4 Cleanup and Unwinding Driver</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#246-runtime-interface">24.6 Runtime Interface</a>
<details class="spec-outline-subsections">
    <summary>4 subsections</summary>
    <ol>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#2461-built-in-modal-layout-and-capability-symbols">24.6.1 Built-in Modal Layout and Capability Symbols</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#2462-managed-stringbytes-runtime-symbols-and-drop-hooks">24.6.2 Managed String/Bytes Runtime Symbols and Drop Hooks</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#2463-runtime-and-built-in-declarations">24.6.3 Runtime and Built-in Declarations</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#2464-network-heap-reactor-and-time-host-primitives">24.6.4 Network, Heap, Reactor, and Time Host-Primitives</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#247-backend-requirements">24.7 Backend Requirements</a>
<details class="spec-outline-subsections">
    <summary>13 subsections</summary>
    <ol>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#2471-llvm-module-header">24.7.1 LLVM Module Header</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#2472-opaque-pointer-model">24.7.2 Opaque Pointer Model</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#2473-llvm-attribute-mapping">24.7.3 LLVM Attribute Mapping</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#2474-ub-and-poison-avoidance">24.7.4 UB and Poison Avoidance</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#2475-memory-intrinsics">24.7.5 Memory Intrinsics</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#2476-llvm-toolchain-version">24.7.6 LLVM Toolchain Version</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#2477-llvm-type-mapping">24.7.7 LLVM Type Mapping</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#2478-ir-declaration-and-instruction-lowering">24.7.8 IR Declaration and Instruction Lowering</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#2479-binding-storage-and-validity">24.7.9 Binding Storage and Validity</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#24710-call-abi-mapping">24.7.10 Call ABI Mapping</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#24711-vtable-emission">24.7.11 VTable Emission</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#24712-literal-data-emission">24.7.12 Literal Data Emission</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#24713-poisoning-instrumentation">24.7.13 Poisoning Instrumentation</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/common-lowering-program-lifecycle-and-backend/#248-output-and-backend-diagnostics">24.8 Output and Backend Diagnostics</a>

    </li>
  </ol>
</li>
<li class="spec-outline-chapter">
  <a class="spec-outline-chapter-link" href="/docs/specification/diagnostic-index/">
    <span>Appendix</span>
    <strong>Diagnostic Index</strong>
  </a>
  <ol class="spec-outline-sections">

  </ol>
</li>
<li class="spec-outline-chapter">
  <a class="spec-outline-chapter-link" href="/docs/specification/complete-grammar-reference/">
    <span>Appendix</span>
    <strong>Complete Grammar Reference</strong>
  </a>
  <ol class="spec-outline-sections">
    <li>
      <a href="/docs/specification/complete-grammar-reference/#b1-lexical-grammar">B.1 Lexical Grammar</a>

    </li>
    <li>
      <a href="/docs/specification/complete-grammar-reference/#b2-type-grammar">B.2 Type Grammar</a>

    </li>
    <li>
      <a href="/docs/specification/complete-grammar-reference/#b3-expression-grammar">B.3 Expression Grammar</a>

    </li>
    <li>
      <a href="/docs/specification/complete-grammar-reference/#b4-pattern-grammar">B.4 Pattern Grammar</a>

    </li>
    <li>
      <a href="/docs/specification/complete-grammar-reference/#b5-statement-grammar">B.5 Statement Grammar</a>

    </li>
    <li>
      <a href="/docs/specification/complete-grammar-reference/#b6-declaration-grammar">B.6 Declaration Grammar</a>

    </li>
    <li>
      <a href="/docs/specification/complete-grammar-reference/#b7-contract-grammar">B.7 Contract Grammar</a>

    </li>
    <li>
      <a href="/docs/specification/complete-grammar-reference/#b8-attribute-grammar">B.8 Attribute Grammar</a>

    </li>
    <li>
      <a href="/docs/specification/complete-grammar-reference/#b9-key-system-grammar">B.9 Key System Grammar</a>

    </li>
    <li>
      <a href="/docs/specification/complete-grammar-reference/#b10-concurrency-grammar">B.10 Concurrency Grammar</a>

    </li>
    <li>
      <a href="/docs/specification/complete-grammar-reference/#b11-async-grammar">B.11 Async Grammar</a>

    </li>
    <li>
      <a href="/docs/specification/complete-grammar-reference/#b12-metaprogramming-grammar">B.12 Metaprogramming Grammar</a>

    </li>
    <li>
      <a href="/docs/specification/complete-grammar-reference/#b13-ffi-grammar">B.13 FFI Grammar</a>

    </li>
    <li>
      <a href="/docs/specification/complete-grammar-reference/#b14-region-grammar">B.14 Region Grammar</a>

    </li>
  </ol>
</li>
<li class="spec-outline-chapter">
  <a class="spec-outline-chapter-link" href="/docs/specification/ast-form-index/">
    <span>Appendix</span>
    <strong>AST Form Index</strong>
  </a>
  <ol class="spec-outline-sections">
    <li>
      <a href="/docs/specification/ast-form-index/#c1-item-forms">C.1 Item Forms</a>

    </li>
    <li>
      <a href="/docs/specification/ast-form-index/#c2-type-forms">C.2 Type Forms</a>

    </li>
    <li>
      <a href="/docs/specification/ast-form-index/#c3-expression-pattern-and-statement-families">C.3 Expression, Pattern, and Statement Families</a>

    </li>
  </ol>
</li>
<li class="spec-outline-chapter">
  <a class="spec-outline-chapter-link" href="/docs/specification/layout-abi-and-runtime-reference/">
    <span>Appendix</span>
    <strong>Layout, ABI, and Runtime Reference</strong>
  </a>
  <ol class="spec-outline-sections">

  </ol>
</li>
  </ol>
</section>
