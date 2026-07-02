---
title: "Ultraviolet Developer Handbook"
description: "The complete reference and engineering guide for writing correct, idiomatic Ultraviolet."
handbookSource: "handbook"
handbookHash: "a5d21aff583bfbb6d9db8ef52b842fec80adad1864f5846488ab5bc00e090e24"
generated: true
prev: false
next: false
---

<p class="ddp-kicker">Docs / Handbook</p>

The Ultraviolet Developer Handbook is the public reference for learning and writing Ultraviolet. It is generated from the handbook chapter parts maintained in the language repository and published here as stable website pages.

<div class="spec-provenance">
  <strong>Generated handbook.</strong>
  <span>Source snapshot: <code>handbook</code></span>
  <span>SHA-256: <code>a5d21aff583bfbb6d9db8ef52b842fec80adad1864f5846488ab5bc00e090e24</code></span>
</div>

## Reference Tree

<ol class="handbook-reference-tree">
<li>
  <details open>
    <summary><a href="/docs/handbook/01-introduction/">1. Introduction &amp; Design Philosophy</a></summary>
    <ol>
      <li><a href="/docs/handbook/01-introduction/#11-what-ultraviolet-is">1.1 What Ultraviolet Is</a>
        <ol>
          <li><a href="/docs/handbook/01-introduction/#what-general-purpose-and-systems-mean-here">What &quot;general-purpose&quot; and &quot;systems&quot; mean here</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/01-introduction/#12-the-four-foundational-design-rules">1.2 The Four Foundational Design Rules</a>
        <ol>
          <li><a href="/docs/handbook/01-introduction/#121-one-correct-way">1.2.1 One Correct Way</a></li>
          <li><a href="/docs/handbook/01-introduction/#122-local-reasoning">1.2.2 Local Reasoning</a></li>
          <li><a href="/docs/handbook/01-introduction/#123-explicit-over-implicit">1.2.3 Explicit over Implicit</a></li>
          <li><a href="/docs/handbook/01-introduction/#124-static-by-default">1.2.4 Static by Default</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/01-introduction/#13-the-mental-model-a-developer-should-hold">1.3 The Mental Model a Developer Should Hold</a>
        <ol>
          <li><a href="/docs/handbook/01-introduction/#how-the-philosophy-shapes-api-and-module-design">How the philosophy shapes API and module design</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/01-introduction/#14-the-language-design-contract-04">1.4 The Language Design Contract (§0.4)</a></li>
      <li><a href="/docs/handbook/01-introduction/#15-how-the-specification-and-handbook-are-organized">1.5 How the Specification and Handbook Are Organized</a>
        <ol>
          <li><a href="/docs/handbook/01-introduction/#151-document-organization-01">1.5.1 Document Organization (§0.1)</a></li>
          <li><a href="/docs/handbook/01-introduction/#152-canonical-chapter-outline-02">1.5.2 Canonical Chapter Outline (§0.2)</a></li>
          <li><a href="/docs/handbook/01-introduction/#153-required-feature-section-template-01--03">1.5.3 Required Feature-Section Template (§0.1 / §0.3)</a></li>
          <li><a href="/docs/handbook/01-introduction/#154-the-shape-of-the-surface-language">1.5.4 The shape of the surface language</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/01-introduction/#16-idioms--best-practices">1.6 Idioms &amp; Best Practices</a></li>
      <li><a href="/docs/handbook/01-introduction/#17-pitfalls--diagnostics">1.7 Pitfalls &amp; Diagnostics</a></li>
    </ol>
  </details>
</li>
<li>
  <details open>
    <summary><a href="/docs/handbook/02-conformance-behavior/">2. Conformance, Behavior Types &amp; the Phase Model</a></summary>
    <ol>
      <li><a href="/docs/handbook/02-conformance-behavior/#21-conformance-11">2.1 Conformance (§1.1)</a>
        <ol>
          <li><a href="/docs/handbook/02-conformance-behavior/#211-the-conformance-predicate">2.1.1 The conformance predicate</a></li>
          <li><a href="/docs/handbook/02-conformance-behavior/#212-the-phase-order-judgments">2.1.2 The phase-order judgments</a></li>
          <li><a href="/docs/handbook/02-conformance-behavior/#213-translation-phases-and-rejection">2.1.3 Translation phases and rejection</a></li>
          <li><a href="/docs/handbook/02-conformance-behavior/#214-the-entry-point-check-maincheck">2.1.4 The entry-point check (MainCheck)</a></li>
          <li><a href="/docs/handbook/02-conformance-behavior/#215-constructs-the-conformance-surface">2.1.5 Constructs (the conformance surface)</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/02-conformance-behavior/#22-behavior-types-12">2.2 Behavior Types (§1.2)</a>
        <ol>
          <li><a href="/docs/handbook/02-conformance-behavior/#221-ill-formed-programs">2.2.1 Ill-formed programs</a></li>
          <li><a href="/docs/handbook/02-conformance-behavior/#222-statically-undefined-behavior">2.2.2 Statically-undefined behavior</a></li>
          <li><a href="/docs/handbook/02-conformance-behavior/#223-outsideconformance-the-anything-may-happen-category">2.2.3 OutsideConformance (the &quot;anything may happen&quot; category)</a></li>
          <li><a href="/docs/handbook/02-conformance-behavior/#224-static-versus-runtime-checks">2.2.4 Static versus runtime checks</a></li>
          <li><a href="/docs/handbook/02-conformance-behavior/#225-implementation-defined-behavior">2.2.5 Implementation-defined behavior</a></li>
          <li><a href="/docs/handbook/02-conformance-behavior/#226-error-recovery-and-diagnostic-limits">2.2.6 Error recovery and diagnostic limits</a></li>
          <li><a href="/docs/handbook/02-conformance-behavior/#227-worked-example-choosing-the-right-behavior-category">2.2.7 Worked example: choosing the right behavior category</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/02-conformance-behavior/#23-document-conventions-and-notation-13">2.3 Document Conventions and Notation (§1.3)</a>
        <ol>
          <li><a href="/docs/handbook/02-conformance-behavior/#231-normative-keywords">2.3.1 Normative keywords</a></li>
          <li><a href="/docs/handbook/02-conformance-behavior/#232-diagnostic-code-format">2.3.2 Diagnostic code format</a></li>
          <li><a href="/docs/handbook/02-conformance-behavior/#233-notation-used-throughout-the-handbook">2.3.3 Notation used throughout the handbook</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/02-conformance-behavior/#24-normative-references-14">2.4 Normative References (§1.4)</a></li>
      <li><a href="/docs/handbook/02-conformance-behavior/#25-compile-time-execution-and-phase-ordering-15">2.5 Compile-Time Execution and Phase Ordering (§1.5)</a>
        <ol>
          <li><a href="/docs/handbook/02-conformance-behavior/#251-the-four-phases">2.5.1 The four phases</a></li>
          <li><a href="/docs/handbook/02-conformance-behavior/#252-the-five-ordering-requirements">2.5.2 The five ordering requirements</a></li>
          <li><a href="/docs/handbook/02-conformance-behavior/#253-compile-time-forms-syntax">2.5.3 Compile-time forms (syntax)</a></li>
          <li><a href="/docs/handbook/02-conformance-behavior/#254-worked-example-compile-time-versus-run-time-evaluation">2.5.4 Worked example: compile-time versus run-time evaluation</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/02-conformance-behavior/#26-target-and-abi-assumptions-16">2.6 Target and ABI Assumptions (§1.6)</a>
        <ol>
          <li><a href="/docs/handbook/02-conformance-behavior/#261-target-profiles">2.6.1 Target profiles</a></li>
          <li><a href="/docs/handbook/02-conformance-behavior/#262-architecture-endianness-and-pointer-size">2.6.2 Architecture, endianness, and pointer size</a></li>
          <li><a href="/docs/handbook/02-conformance-behavior/#263-llvm-target-triples">2.6.3 LLVM target triples</a></li>
          <li><a href="/docs/handbook/02-conformance-behavior/#264-where-abi-and-layout-are-actually-defined">2.6.4 Where ABI and layout are actually defined</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/02-conformance-behavior/#27-idioms--best-practices">2.7 Idioms &amp; Best Practices</a></li>
      <li><a href="/docs/handbook/02-conformance-behavior/#28-pitfalls--diagnostics">2.8 Pitfalls &amp; Diagnostics</a></li>
    </ol>
  </details>
</li>
<li>
  <details open>
    <summary><a href="/docs/handbook/03-project-model/">3. Projects, Manifest, Modules &amp; the Compilation Model</a></summary>
    <ol>
      <li><a href="/docs/handbook/03-project-model/#31-core-project-records">3.1 Core Project Records</a>
        <ol>
          <li><a href="/docs/handbook/03-project-model/#validation-scope">Validation scope</a></li>
          <li><a href="/docs/handbook/03-project-model/#the-entry-procedure">The entry procedure</a></li>
          <li><a href="/docs/handbook/03-project-model/#command-line-output-and-diagnostics">Command-line output and diagnostics</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/03-project-model/#32-the-ultraviolettoml-manifest">3.2 The Ultraviolet.toml Manifest</a>
        <ol>
          <li><a href="/docs/handbook/03-project-model/#project-root-discovery">Project-root discovery</a></li>
          <li><a href="/docs/handbook/03-project-model/#parsing-the-manifest">Parsing the manifest</a></li>
          <li><a href="/docs/handbook/03-project-model/#top-level-schema">Top-level schema</a></li>
          <li><a href="/docs/handbook/03-project-model/#the-assembly-table">The [assembly] table</a></li>
          <li><a href="/docs/handbook/03-project-model/#the-toolchain-table">The [toolchain] table</a></li>
          <li><a href="/docs/handbook/03-project-model/#the-build-table">The [build] table</a></li>
          <li><a href="/docs/handbook/03-project-model/#worked-manifest">Worked manifest</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/03-project-model/#33-assemblies-and-project-loading">3.3 Assemblies and Project Loading</a>
        <ol>
          <li><a href="/docs/handbook/03-project-model/#deterministic-manifest-validation">Deterministic manifest validation</a></li>
          <li><a href="/docs/handbook/03-project-model/#building-one-assembly">Building one assembly</a></li>
          <li><a href="/docs/handbook/03-project-model/#module-ownership-across-assemblies">Module ownership across assemblies</a></li>
          <li><a href="/docs/handbook/03-project-model/#selecting-the-target-assembly">Selecting the target assembly</a></li>
          <li><a href="/docs/handbook/03-project-model/#worked-load-skeleton">Worked load (skeleton)</a></li>
          <li><a href="/docs/handbook/03-project-model/#assembly-graph-constraints">Assembly graph constraints</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/03-project-model/#34-deterministic-ordering-and-case-folding">3.4 Deterministic Ordering and Case Folding</a></li>
      <li><a href="/docs/handbook/03-project-model/#35-source-roots-module-directories-and-compilation-units">3.5 Source Roots, Module Directories, and Compilation Units</a>
        <ol>
          <li><a href="/docs/handbook/03-project-model/#source-root">Source root</a></li>
          <li><a href="/docs/handbook/03-project-model/#module-directories-and-compilation-units">Module directories and compilation units</a></li>
          <li><a href="/docs/handbook/03-project-model/#mapping-the-filesystem-to-the-module-tree">Mapping the filesystem to the module tree</a></li>
          <li><a href="/docs/handbook/03-project-model/#module-discovery">Module discovery</a></li>
          <li><a href="/docs/handbook/03-project-model/#worked-layout">Worked layout</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/03-project-model/#36-output-artifacts-and-linking">3.6 Output Artifacts and Linking</a>
        <ol>
          <li><a href="/docs/handbook/03-project-model/#output-root-and-directory-layout">Output root and directory layout</a></li>
          <li><a href="/docs/handbook/03-project-model/#object-file-naming">Object-file naming</a></li>
          <li><a href="/docs/handbook/03-project-model/#final-artifact-naming">Final artifact naming</a></li>
          <li><a href="/docs/handbook/03-project-model/#which-modules-get-emitted">Which modules get emitted</a></li>
          <li><a href="/docs/handbook/03-project-model/#ir-emission">IR emission</a></li>
          <li><a href="/docs/handbook/03-project-model/#linking-archiving-finalizing">Linking, archiving, finalizing</a></li>
          <li><a href="/docs/handbook/03-project-model/#module-symbol-naming">Module symbol naming</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/03-project-model/#37-tool-resolution-and-ir-assembly-inputs">3.7 Tool Resolution and IR Assembly Inputs</a></li>
      <li><a href="/docs/handbook/03-project-model/#38-project-diagnostics">3.8 Project Diagnostics</a></li>
      <li><a href="/docs/handbook/03-project-model/#the-uv-command-line">The uv Command Line</a></li>
      <li><a href="/docs/handbook/03-project-model/#idioms--best-practices">Idioms &amp; Best Practices</a></li>
      <li><a href="/docs/handbook/03-project-model/#pitfalls--diagnostics">Pitfalls &amp; Diagnostics</a></li>
    </ol>
  </details>
</li>
<li>
  <details open>
    <summary><a href="/docs/handbook/04-lexical/">4. Source Text &amp; Lexical Structure</a></summary>
    <ol>
      <li><a href="/docs/handbook/04-lexical/#41-source-loading-and-normalization">4.1 Source Loading and Normalization</a>
        <ol>
          <li><a href="/docs/handbook/04-lexical/#411-encoding-utf-8-and-unicode-scalars">4.1.1 Encoding: UTF-8 and Unicode Scalars</a></li>
          <li><a href="/docs/handbook/04-lexical/#412-bom-handling">4.1.2 BOM Handling</a></li>
          <li><a href="/docs/handbook/04-lexical/#413-line-ending-normalization">4.1.3 Line-Ending Normalization</a></li>
          <li><a href="/docs/handbook/04-lexical/#414-unicode-normalization">4.1.4 Unicode Normalization</a></li>
          <li><a href="/docs/handbook/04-lexical/#415-prohibited-code-points">4.1.5 Prohibited Code Points</a></li>
          <li><a href="/docs/handbook/04-lexical/#416-the-loading-pipeline-big-step">4.1.6 The Loading Pipeline (Big-Step)</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/04-lexical/#42-lexical-analysis">4.2 Lexical Analysis</a>
        <ol>
          <li><a href="/docs/handbook/04-lexical/#421-character-classes">4.2.1 Character Classes</a></li>
          <li><a href="/docs/handbook/04-lexical/#422-keywords-and-reserved-lexemes">4.2.2 Keywords and Reserved Lexemes</a></li>
          <li><a href="/docs/handbook/04-lexical/#423-identifiers">4.2.3 Identifiers</a></li>
          <li><a href="/docs/handbook/04-lexical/#424-integer-literals">4.2.4 Integer Literals</a></li>
          <li><a href="/docs/handbook/04-lexical/#425-floating-point-literals">4.2.5 Floating-Point Literals</a></li>
          <li><a href="/docs/handbook/04-lexical/#426-boolean-and-null-literals">4.2.6 Boolean and Null Literals</a></li>
          <li><a href="/docs/handbook/04-lexical/#427-character-literals">4.2.7 Character Literals</a></li>
          <li><a href="/docs/handbook/04-lexical/#428-string-literals">4.2.8 String Literals</a></li>
          <li><a href="/docs/handbook/04-lexical/#429-escape-sequences">4.2.9 Escape Sequences</a></li>
          <li><a href="/docs/handbook/04-lexical/#4210-operators-and-punctuators">4.2.10 Operators and Punctuators</a></li>
          <li><a href="/docs/handbook/04-lexical/#4211-comments-and-doc-comments">4.2.11 Comments and Doc Comments</a></li>
          <li><a href="/docs/handbook/04-lexical/#4212-maximal-munch-and-token-selection">4.2.12 Maximal Munch and Token Selection</a></li>
          <li><a href="/docs/handbook/04-lexical/#4213-newlines-and-statement-termination">4.2.13 Newlines and Statement Termination</a></li>
          <li><a href="/docs/handbook/04-lexical/#4214-lexical-security-bidi-confusables-and-mixed-scripts">4.2.14 Lexical Security: Bidi, Confusables, and Mixed Scripts</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/04-lexical/#43-source-loading-and-lexical-diagnostics">4.3 Source Loading and Lexical Diagnostics</a></li>
      <li><a href="/docs/handbook/04-lexical/#idioms--best-practices">Idioms &amp; Best Practices</a></li>
      <li><a href="/docs/handbook/04-lexical/#pitfalls--diagnostics">Pitfalls &amp; Diagnostics</a></li>
    </ol>
  </details>
</li>
<li>
  <details open>
    <summary><a href="/docs/handbook/05-names-visibility/">5. Names, Scopes &amp; Visibility</a></summary>
    <ol>
      <li><a href="/docs/handbook/05-names-visibility/#51-the-scope-context-and-identifier-kinds-71">5.1 The Scope Context and Identifier Kinds (§7.1)</a>
        <ol>
          <li><a href="/docs/handbook/05-names-visibility/#511-the-resolution-context-γ">5.1.1 The resolution context Γ</a></li>
          <li><a href="/docs/handbook/05-names-visibility/#512-the-scope-stack">5.1.2 The scope stack</a></li>
          <li><a href="/docs/handbook/05-names-visibility/#513-entities">5.1.3 Entities</a></li>
          <li><a href="/docs/handbook/05-names-visibility/#514-the-universe-scope-and-reserved-names">5.1.4 The universe scope and reserved names</a></li>
          <li><a href="/docs/handbook/05-names-visibility/#515-reserved-identifier-predicates">5.1.5 Reserved-identifier predicates</a></li>
          <li><a href="/docs/handbook/05-names-visibility/#516-keyword-keys">5.1.6 Keyword keys</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/05-names-visibility/#52-name-introduction-and-module-validation-72">5.2 Name Introduction and Module Validation (§7.2)</a>
        <ol>
          <li><a href="/docs/handbook/05-names-visibility/#521-the-intro-rules">5.2.1 The Intro rules</a></li>
          <li><a href="/docs/handbook/05-names-visibility/#522-local-binding-goes-through-intro">5.2.2 Local binding goes through Intro</a></li>
          <li><a href="/docs/handbook/05-names-visibility/#523-usingalias-the-sanctioned-way-to-make-a-second-name">5.2.3 UsingAlias: the sanctioned way to make a second name</a></li>
          <li><a href="/docs/handbook/05-names-visibility/#524-module-name-validation">5.2.4 Module-name validation</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/05-names-visibility/#53-lookup-and-qualified-resolution-73">5.3 Lookup and Qualified Resolution (§7.3)</a>
        <ol>
          <li><a href="/docs/handbook/05-names-visibility/#531-unqualified-lookup">5.3.1 Unqualified lookup</a></li>
          <li><a href="/docs/handbook/05-names-visibility/#532-kind-checked-resolvers">5.3.2 Kind-checked resolvers</a></li>
          <li><a href="/docs/handbook/05-names-visibility/#533-the--operator-and-qualified-resolution">5.3.3 The :: operator and qualified resolution</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/05-names-visibility/#54-visibility-and-accessibility-74">5.4 Visibility and Accessibility (§7.4)</a>
        <ol>
          <li><a href="/docs/handbook/05-names-visibility/#541-the-accessibility-judgment">5.4.1 The accessibility judgment</a></li>
          <li><a href="/docs/handbook/05-names-visibility/#542-top-level-visibility">5.4.2 Top-level visibility</a></li>
          <li><a href="/docs/handbook/05-names-visibility/#543-visibility-and-using-re-exports">5.4.3 Visibility and using re-exports</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/05-names-visibility/#55-top-level-name-collection-75">5.5 Top-Level Name Collection (§7.5)</a>
        <ol>
          <li><a href="/docs/handbook/05-names-visibility/#551-what-each-declaration-binds">5.5.1 What each declaration binds</a></li>
          <li><a href="/docs/handbook/05-names-visibility/#552-collecting-and-rejecting-duplicates">5.5.2 Collecting and rejecting duplicates</a></li>
          <li><a href="/docs/handbook/05-names-visibility/#553-derived-name-maps">5.5.3 Derived name maps</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/05-names-visibility/#56-qualified-disambiguation-76">5.6 Qualified Disambiguation (§7.6)</a></li>
      <li><a href="/docs/handbook/05-names-visibility/#57-shared-resolution-helpers-and-the-resolution-pass-77">5.7 Shared Resolution Helpers and the Resolution Pass (§7.7)</a>
        <ol>
          <li><a href="/docs/handbook/05-names-visibility/#571-scope-push-and-type-parameter-bindings">5.7.1 Scope push and type-parameter bindings</a></li>
          <li><a href="/docs/handbook/05-names-visibility/#572-resolving-type-class-and-value-paths">5.7.2 Resolving type, class, and value paths</a></li>
          <li><a href="/docs/handbook/05-names-visibility/#573-resolving-expressions">5.7.3 Resolving expressions</a></li>
          <li><a href="/docs/handbook/05-names-visibility/#574-module-path-validation-and-the-module-driver">5.7.4 Module path validation and the module driver</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/05-names-visibility/#58-referencing-names-across-modules-and-assemblies">5.8 Referencing Names Across Modules and Assemblies</a></li>
      <li><a href="/docs/handbook/05-names-visibility/#59-idioms--best-practices">5.9 Idioms &amp; Best Practices</a></li>
      <li><a href="/docs/handbook/05-names-visibility/#510-pitfalls--diagnostics">5.10 Pitfalls &amp; Diagnostics</a></li>
    </ol>
  </details>
</li>
<li>
  <details open>
    <summary><a href="/docs/handbook/06-module-forms/">6. Module-Level Forms: Imports, Using, Statics &amp; Extern Shell</a></summary>
    <ol>
      <li><a href="/docs/handbook/06-module-forms/#61-import-declarations-111">6.1 Import Declarations (§11.1)</a>
        <ol>
          <li><a href="/docs/handbook/06-module-forms/#syntax">Syntax</a></li>
          <li><a href="/docs/handbook/06-module-forms/#semantics">Semantics</a></li>
          <li><a href="/docs/handbook/06-module-forms/#diagnostics">Diagnostics</a></li>
          <li><a href="/docs/handbook/06-module-forms/#worked-example">Worked Example</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/06-module-forms/#62-using-declarations-112">6.2 Using Declarations (§11.2)</a>
        <ol>
          <li><a href="/docs/handbook/06-module-forms/#syntax-1">Syntax</a></li>
          <li><a href="/docs/handbook/06-module-forms/#621-single-item-using">6.2.1 Single-item using</a></li>
          <li><a href="/docs/handbook/06-module-forms/#622-using-list">6.2.2 Using list</a></li>
          <li><a href="/docs/handbook/06-module-forms/#623-using-wildcard-module">6.2.3 Using wildcard (module::*)</a></li>
          <li><a href="/docs/handbook/06-module-forms/#diagnostics-1">Diagnostics</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/06-module-forms/#63-static-declarations-113">6.3 Static Declarations (§11.3)</a>
        <ol>
          <li><a href="/docs/handbook/06-module-forms/#syntax-2">Syntax</a></li>
          <li><a href="/docs/handbook/06-module-forms/#semantics-and-mandatory-rules">Semantics and mandatory rules</a></li>
          <li><a href="/docs/handbook/06-module-forms/#initialization-ordering-and-naming">Initialization, ordering, and naming</a></li>
          <li><a href="/docs/handbook/06-module-forms/#diagnostics-2">Diagnostics</a></li>
          <li><a href="/docs/handbook/06-module-forms/#worked-example-1">Worked Example</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/06-module-forms/#64-the-extern-block-shell-114">6.4 The Extern Block Shell (§11.4)</a>
        <ol>
          <li><a href="/docs/handbook/06-module-forms/#syntax-3">Syntax</a></li>
          <li><a href="/docs/handbook/06-module-forms/#semantics-1">Semantics</a></li>
          <li><a href="/docs/handbook/06-module-forms/#worked-example-shell-only">Worked Example (shell only)</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/06-module-forms/#65-module-and-file-aggregation-115">6.5 Module and File Aggregation (§11.5)</a>
        <ol>
          <li><a href="/docs/handbook/06-module-forms/#651-directories-are-modules-files-aggregate">6.5.1 Directories are modules; files aggregate</a></li>
          <li><a href="/docs/handbook/06-module-forms/#652-well-formed-module-paths">6.5.2 Well-formed module paths</a></li>
          <li><a href="/docs/handbook/06-module-forms/#653-import-coverage--the-rule-that-ties-111-and-112-together">6.5.3 Import coverage — the rule that ties §11.1 and §11.2 together</a></li>
          <li><a href="/docs/handbook/06-module-forms/#654-path-resolution">6.5.4 Path resolution</a></li>
          <li><a href="/docs/handbook/06-module-forms/#655-initialization-ordering">6.5.5 Initialization ordering</a></li>
          <li><a href="/docs/handbook/06-module-forms/#diagnostics-3">Diagnostics</a></li>
          <li><a href="/docs/handbook/06-module-forms/#worked-example-layout">Worked Example (layout)</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/06-module-forms/#idioms--best-practices">Idioms &amp; Best Practices</a></li>
      <li><a href="/docs/handbook/06-module-forms/#pitfalls--diagnostics">Pitfalls &amp; Diagnostics</a></li>
    </ol>
  </details>
</li>
<li>
  <details open>
    <summary><a href="/docs/handbook/07-type-system-core/">7. The Type System Core: Equivalence, Subtyping &amp; Inference</a></summary>
    <ol>
      <li><a href="/docs/handbook/07-type-system-core/#71-type-equivalence-">7.1 Type Equivalence (≡)</a>
        <ol>
          <li><a href="/docs/handbook/07-type-system-core/#711-the-shape-of-the-rules">7.1.1 The shape of the rules</a></li>
          <li><a href="/docs/handbook/07-type-system-core/#712-unions-equivalence-is-permutation-closed">7.1.2 Unions: equivalence is permutation-closed</a></li>
          <li><a href="/docs/handbook/07-type-system-core/#713-array-lengths-constlen">7.1.3 Array lengths: ConstLen</a></li>
          <li><a href="/docs/handbook/07-type-system-core/#714-refinements-subject-normalized-predicate-equality">7.1.4 Refinements: subject-normalized predicate equality</a></li>
          <li><a href="/docs/handbook/07-type-system-core/#715-the-equivalence-relation-closure">7.1.5 The equivalence-relation closure</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/07-type-system-core/#72-subtyping-">7.2 Subtyping (&lt;:)</a>
        <ol>
          <li><a href="/docs/handbook/07-type-system-core/#721-where-subtyping-does-not-widen-numerics-and-permissions">7.2.1 Where subtyping does *not* widen: numerics and permissions</a></li>
          <li><a href="/docs/handbook/07-type-system-core/#722-the-bottom-type">7.2.2 The bottom type</a></li>
          <li><a href="/docs/handbook/07-type-system-core/#723-structural-covariant-subtyping">7.2.3 Structural (covariant) subtyping</a></li>
          <li><a href="/docs/handbook/07-type-system-core/#724-pointer-and-modal-subtyping">7.2.4 Pointer and modal subtyping</a></li>
          <li><a href="/docs/handbook/07-type-system-core/#725-functions-closures-and-async-contravariant-parameters">7.2.5 Functions, closures, and async: contravariant parameters</a></li>
          <li><a href="/docs/handbook/07-type-system-core/#726-union-subtyping-membership-and-width">7.2.6 Union subtyping: membership and width</a></li>
          <li><a href="/docs/handbook/07-type-system-core/#727-generic-subtyping-and-declared-variance">7.2.7 Generic subtyping and declared variance</a></li>
          <li><a href="/docs/handbook/07-type-system-core/#728-reflexivity-and-transitivity">7.2.8 Reflexivity and transitivity</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/07-type-system-core/#73-type-inference">7.3 Type Inference</a>
        <ol>
          <li><a href="/docs/handbook/07-type-system-core/#731-type-variables-and-substitutions">7.3.1 Type variables and substitutions</a></li>
          <li><a href="/docs/handbook/07-type-system-core/#732-the-unifier">7.3.2 The unifier</a></li>
          <li><a href="/docs/handbook/07-type-system-core/#733-the-solver">7.3.3 The solver</a></li>
          <li><a href="/docs/handbook/07-type-system-core/#734-bidirectional-synthesis-and-checking">7.3.4 Bidirectional synthesis and checking</a></li>
          <li><a href="/docs/handbook/07-type-system-core/#735-inference-for-literals">7.3.5 Inference for literals</a></li>
          <li><a href="/docs/handbook/07-type-system-core/#736-subsumption-pointer-null-and-modal-subsumption-at-use-sites">7.3.6 Subsumption, pointer-null, and modal subsumption at use sites</a></li>
          <li><a href="/docs/handbook/07-type-system-core/#737-where-types-may-be-omitted-and-where-they-are-required">7.3.7 Where types may be omitted, and where they are required</a></li>
          <li><a href="/docs/handbook/07-type-system-core/#738-inference-for-generics">7.3.8 Inference for generics</a></li>
          <li><a href="/docs/handbook/07-type-system-core/#739-inference-for-tuples-arrays-and-unions">7.3.9 Inference for tuples, arrays, and unions</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/07-type-system-core/#74-metatheoretic-properties">7.4 Metatheoretic Properties</a>
        <ol>
          <li><a href="/docs/handbook/07-type-system-core/#741-the-step-relation">7.4.1 The step relation</a></li>
          <li><a href="/docs/handbook/07-type-system-core/#742-the-guarantees">7.4.2 The guarantees</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/07-type-system-core/#75-core-type-diagnostics">7.5 Core Type Diagnostics</a></li>
      <li><a href="/docs/handbook/07-type-system-core/#76-idioms--best-practices">7.6 Idioms &amp; Best Practices</a></li>
      <li><a href="/docs/handbook/07-type-system-core/#77-pitfalls--diagnostics">7.7 Pitfalls &amp; Diagnostics</a></li>
    </ol>
  </details>
</li>
<li>
  <details open>
    <summary><a href="/docs/handbook/08-data-types/">8. Primitive &amp; Aggregate Data Types</a></summary>
    <ol>
      <li><a href="/docs/handbook/08-data-types/#81-primitive-types">8.1 Primitive Types</a>
        <ol>
          <li><a href="/docs/handbook/08-data-types/#811-exact-syntax">8.1.1 Exact syntax</a></li>
          <li><a href="/docs/handbook/08-data-types/#812-integer-types--exact-names-widths-and-signedness">8.1.2 Integer types — exact names, widths, and signedness</a></li>
          <li><a href="/docs/handbook/08-data-types/#813-floating-point-types">8.1.3 Floating-point types</a></li>
          <li><a href="/docs/handbook/08-data-types/#814-bool-char-unit-never">8.1.4 bool, char, unit, never</a></li>
          <li><a href="/docs/handbook/08-data-types/#815-integer-and-float-literaltype-pairing-rules">8.1.5 Integer and float literal/type pairing rules</a></li>
          <li><a href="/docs/handbook/08-data-types/#816-diagnostics">8.1.6 Diagnostics</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/08-data-types/#82-tuples">8.2 Tuples</a>
        <ol>
          <li><a href="/docs/handbook/08-data-types/#821-exact-syntax">8.2.1 Exact syntax</a></li>
          <li><a href="/docs/handbook/08-data-types/#822-construction-indexing-arity">8.2.2 Construction, indexing, arity</a></li>
          <li><a href="/docs/handbook/08-data-types/#823-diagnostics">8.2.3 Diagnostics</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/08-data-types/#83-arrays">8.3 Arrays</a>
        <ol>
          <li><a href="/docs/handbook/08-data-types/#831-exact-syntax">8.3.1 Exact syntax</a></li>
          <li><a href="/docs/handbook/08-data-types/#832-declaration-literals-length">8.3.2 Declaration, literals, length</a></li>
          <li><a href="/docs/handbook/08-data-types/#833-indexing-and-bounds">8.3.3 Indexing and bounds</a></li>
          <li><a href="/docs/handbook/08-data-types/#834-layout">8.3.4 Layout</a></li>
          <li><a href="/docs/handbook/08-data-types/#835-diagnostics">8.3.5 Diagnostics</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/08-data-types/#84-slices">8.4 Slices</a>
        <ol>
          <li><a href="/docs/handbook/08-data-types/#841-exact-syntax">8.4.1 Exact syntax</a></li>
          <li><a href="/docs/handbook/08-data-types/#842-views-length-sub-slicing">8.4.2 Views, length, sub-slicing</a></li>
          <li><a href="/docs/handbook/08-data-types/#843-layout">8.4.3 Layout</a></li>
          <li><a href="/docs/handbook/08-data-types/#844-diagnostics">8.4.4 Diagnostics</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/08-data-types/#85-ranges">8.5 Ranges</a>
        <ol>
          <li><a href="/docs/handbook/08-data-types/#851-exact-syntax">8.5.1 Exact syntax</a></li>
          <li><a href="/docs/handbook/08-data-types/#852-the-six-range-forms-and-their-types">8.5.2 The six range forms and their types</a></li>
          <li><a href="/docs/handbook/08-data-types/#853-layout">8.5.3 Layout</a></li>
          <li><a href="/docs/handbook/08-data-types/#854-diagnostics">8.5.4 Diagnostics</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/08-data-types/#86-records">8.6 Records</a>
        <ol>
          <li><a href="/docs/handbook/08-data-types/#861-exact-syntax">8.6.1 Exact syntax</a></li>
          <li><a href="/docs/handbook/08-data-types/#862-field-visibility">8.6.2 Field visibility</a></li>
          <li><a href="/docs/handbook/08-data-types/#863-construction-expressions">8.6.3 Construction expressions</a></li>
          <li><a href="/docs/handbook/08-data-types/#864-field-access">8.6.4 Field access</a></li>
          <li><a href="/docs/handbook/08-data-types/#865-on-functional-update">8.6.5 On functional update</a></li>
          <li><a href="/docs/handbook/08-data-types/#866-layout">8.6.6 Layout</a></li>
          <li><a href="/docs/handbook/08-data-types/#867-diagnostics">8.6.7 Diagnostics</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/08-data-types/#87-enums">8.7 Enums</a>
        <ol>
          <li><a href="/docs/handbook/08-data-types/#871-exact-syntax">8.7.1 Exact syntax</a></li>
          <li><a href="/docs/handbook/08-data-types/#872-variant-forms">8.7.2 Variant forms</a></li>
          <li><a href="/docs/handbook/08-data-types/#873-discriminants-and-representation">8.7.3 Discriminants and representation</a></li>
          <li><a href="/docs/handbook/08-data-types/#874-construction">8.7.4 Construction</a></li>
          <li><a href="/docs/handbook/08-data-types/#875-diagnostics">8.7.5 Diagnostics</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/08-data-types/#88-union-types">8.8 Union Types</a>
        <ol>
          <li><a href="/docs/handbook/08-data-types/#881-exact-syntax">8.8.1 Exact syntax</a></li>
          <li><a href="/docs/handbook/08-data-types/#882-semantics">8.8.2 Semantics</a></li>
          <li><a href="/docs/handbook/08-data-types/#883-layout">8.8.3 Layout</a></li>
          <li><a href="/docs/handbook/08-data-types/#884-diagnostics">8.8.4 Diagnostics</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/08-data-types/#89-type-aliases">8.9 Type Aliases</a>
        <ol>
          <li><a href="/docs/handbook/08-data-types/#891-exact-syntax">8.9.1 Exact syntax</a></li>
          <li><a href="/docs/handbook/08-data-types/#892-semantics">8.9.2 Semantics</a></li>
          <li><a href="/docs/handbook/08-data-types/#893-diagnostics">8.9.3 Diagnostics</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/08-data-types/#810-shared-data-type-diagnostics">8.10 Shared Data-Type Diagnostics</a></li>
      <li><a href="/docs/handbook/08-data-types/#idioms--best-practices">Idioms &amp; Best Practices</a></li>
      <li><a href="/docs/handbook/08-data-types/#pitfalls--diagnostics">Pitfalls &amp; Diagnostics</a></li>
    </ol>
  </details>
</li>
<li>
  <details open>
    <summary><a href="/docs/handbook/09-modal-types/">9. Modal Types &amp; Typestate</a></summary>
    <ol>
      <li><a href="/docs/handbook/09-modal-types/#91-modal-declarations-131">9.1 Modal Declarations (§13.1)</a>
        <ol>
          <li><a href="/docs/handbook/09-modal-types/#syntax">Syntax</a></li>
          <li><a href="/docs/handbook/09-modal-types/#naming">Naming</a></li>
          <li><a href="/docs/handbook/09-modal-types/#semantics-and-well-formedness">Semantics and well-formedness</a></li>
          <li><a href="/docs/handbook/09-modal-types/#worked-example-the-declaration-shape">Worked example: the declaration shape</a></li>
          <li><a href="/docs/handbook/09-modal-types/#runtime-representation-and-layout-13151316">Runtime representation and layout (§13.1.5–§13.1.6)</a></li>
          <li><a href="/docs/handbook/09-modal-types/#built-in-modal-types">Built-in modal types</a></li>
          <li><a href="/docs/handbook/09-modal-types/#constructing-a-state-value">Constructing a state value</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/09-modal-types/#92-state-fields-132">9.2 State Fields (§13.2)</a>
        <ol>
          <li><a href="/docs/handbook/09-modal-types/#syntax-1">Syntax</a></li>
          <li><a href="/docs/handbook/09-modal-types/#semantics">Semantics</a></li>
          <li><a href="/docs/handbook/09-modal-types/#worked-example">Worked example</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/09-modal-types/#93-state-specific-methods-133">9.3 State-Specific Methods (§13.3)</a>
        <ol>
          <li><a href="/docs/handbook/09-modal-types/#syntax-2">Syntax</a></li>
          <li><a href="/docs/handbook/09-modal-types/#receiver-forms">Receiver forms</a></li>
          <li><a href="/docs/handbook/09-modal-types/#invocation">Invocation</a></li>
          <li><a href="/docs/handbook/09-modal-types/#semantics-1">Semantics</a></li>
          <li><a href="/docs/handbook/09-modal-types/#worked-example-1">Worked example</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/09-modal-types/#94-transitions-134">9.4 Transitions (§13.4)</a>
        <ol>
          <li><a href="/docs/handbook/09-modal-types/#syntax-3">Syntax</a></li>
          <li><a href="/docs/handbook/09-modal-types/#semantics-2">Semantics</a></li>
          <li><a href="/docs/handbook/09-modal-types/#worked-example-2">Worked example</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/09-modal-types/#95-modal-widening-135">9.5 Modal Widening (§13.5)</a>
        <ol>
          <li><a href="/docs/handbook/09-modal-types/#syntax-4">Syntax</a></li>
          <li><a href="/docs/handbook/09-modal-types/#semantics-3">Semantics</a></li>
          <li><a href="/docs/handbook/09-modal-types/#worked-example-3">Worked example</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/09-modal-types/#96-matching-and-dispatch-on-modal-state-1315-167-chapter-17">9.6 Matching and Dispatch on Modal State (§13.1.5, §16.7, Chapter 17)</a>
        <ol>
          <li><a href="/docs/handbook/09-modal-types/#modal-patterns">Modal patterns</a></li>
          <li><a href="/docs/handbook/09-modal-types/#the-if--is----form">The if ... is { ... } form</a></li>
          <li><a href="/docs/handbook/09-modal-types/#worked-example-exhaustive-dispatch">Worked example: exhaustive dispatch</a></li>
          <li><a href="/docs/handbook/09-modal-types/#single-arm-narrowing">Single-arm narrowing</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/09-modal-types/#97-a-complete-worked-lifecycle">9.7 A Complete Worked Lifecycle</a></li>
      <li><a href="/docs/handbook/09-modal-types/#98-modal-vs-booleans-and-enums--when-to-use-which">9.8 Modal vs. Booleans and Enums — When to Use Which</a></li>
      <li><a href="/docs/handbook/09-modal-types/#99-idioms--best-practices">9.9 Idioms &amp; Best Practices</a></li>
      <li><a href="/docs/handbook/09-modal-types/#910-pitfalls--diagnostics">9.10 Pitfalls &amp; Diagnostics</a></li>
    </ol>
  </details>
</li>
<li>
  <details open>
    <summary><a href="/docs/handbook/10-strings-bytes/">10. Strings, Bytes &amp; Text Handling</a></summary>
    <ol>
      <li><a href="/docs/handbook/10-strings-bytes/#101-the-two-type-families-at-a-glance">10.1 The Two Type Families at a Glance</a>
        <ol>
          <li><a href="/docs/handbook/10-strings-bytes/#1011-exact-syntax">10.1.1 Exact Syntax</a></li>
          <li><a href="/docs/handbook/10-strings-bytes/#1012-the-type-surface">10.1.2 The Type Surface</a></li>
          <li><a href="/docs/handbook/10-strings-bytes/#1013-the-dynamic-model-everything-is-a-byte-sequence">10.1.3 The Dynamic Model: Everything Is a Byte Sequence</a></li>
          <li><a href="/docs/handbook/10-strings-bytes/#1014-lowering">10.1.4 Lowering</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/10-strings-bytes/#102-string-types-136">10.2 String Types (§13.6)</a>
        <ol>
          <li><a href="/docs/handbook/10-strings-bytes/#1021-the-operation-surface">10.2.1 The Operation Surface</a></li>
          <li><a href="/docs/handbook/10-strings-bytes/#1022-string-literals-and-the-stringview-type">10.2.2 String Literals and the string@View Type</a></li>
          <li><a href="/docs/handbook/10-strings-bytes/#1023-length-and-emptiness">10.2.3 Length and Emptiness</a></li>
          <li><a href="/docs/handbook/10-strings-bytes/#1024-constructing-an-owned-stringmanaged">10.2.4 Constructing an Owned string@Managed</a></li>
          <li><a href="/docs/handbook/10-strings-bytes/#1025-borrowing-a-view-from-an-owned-string">10.2.5 Borrowing a View From an Owned String</a></li>
          <li><a href="/docs/handbook/10-strings-bytes/#1026-slicing-with-utf-8-boundary-safety">10.2.6 Slicing With UTF-8 Boundary Safety</a></li>
          <li><a href="/docs/handbook/10-strings-bytes/#1027-appending-to-an-owned-string">10.2.7 Appending to an Owned String</a></li>
          <li><a href="/docs/handbook/10-strings-bytes/#1028-conversions-and-encoding-guarantees">10.2.8 Conversions and Encoding Guarantees</a></li>
          <li><a href="/docs/handbook/10-strings-bytes/#1029-worked-example-read-only-inspection">10.2.9 Worked Example: Read-Only Inspection</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/10-strings-bytes/#103-bytes-types-137">10.3 Bytes Types (§13.7)</a>
        <ol>
          <li><a href="/docs/handbook/10-strings-bytes/#1031-the-operation-surface">10.3.1 The Operation Surface</a></li>
          <li><a href="/docs/handbook/10-strings-bytes/#1032-the-element-type-is-u8-reached-through-as_slice">10.3.2 The Element Type Is u8, Reached Through as_slice</a></li>
          <li><a href="/docs/handbook/10-strings-bytes/#1033-length-emptiness-and-iteration">10.3.3 Length, Emptiness, and Iteration</a></li>
          <li><a href="/docs/handbook/10-strings-bytes/#1034-constructing-owned-bytes">10.3.4 Constructing Owned Bytes</a></li>
          <li><a href="/docs/handbook/10-strings-bytes/#1035-borrowing-views-and-slices">10.3.5 Borrowing Views and Slices</a></li>
          <li><a href="/docs/handbook/10-strings-bytes/#1036-appending-and-building-bytes">10.3.6 Appending and Building Bytes</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/10-strings-bytes/#104-bridging-string-and-bytes">10.4 Bridging String and Bytes</a>
        <ol>
          <li><a href="/docs/handbook/10-strings-bytes/#1041-bytesview_string-string--bytes">10.4.1 bytes::view_string (string → bytes)</a></li>
          <li><a href="/docs/handbook/10-strings-bytes/#1042-bytesview-slice--bytes">10.4.2 bytes::view (slice → bytes)</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/10-strings-bytes/#105-idioms--best-practices">10.5 Idioms &amp; Best Practices</a></li>
      <li><a href="/docs/handbook/10-strings-bytes/#106-pitfalls--diagnostics">10.6 Pitfalls &amp; Diagnostics</a></li>
    </ol>
  </details>
</li>
<li>
  <details open>
    <summary><a href="/docs/handbook/11-pointers-closures/">11. Pointers, Function Types &amp; Closures</a></summary>
    <ol>
      <li><a href="/docs/handbook/11-pointers-closures/#111-safe-pointer-types-ptrt">11.1 Safe Pointer Types (Ptr&lt;T&gt;)</a>
        <ol>
          <li><a href="/docs/handbook/11-pointers-closures/#1111-exact-syntax">11.1.1 Exact syntax</a></li>
          <li><a href="/docs/handbook/11-pointers-closures/#1112-the-pointer-state-lattice-and-its-semantics">11.1.2 The pointer-state lattice and its semantics</a></li>
          <li><a href="/docs/handbook/11-pointers-closures/#1113-creation-address-of--and-region-allocation">11.1.3 Creation: address-of (&amp;) and region allocation</a></li>
          <li><a href="/docs/handbook/11-pointers-closures/#1114-dereference-">11.1.4 Dereference (*)</a></li>
          <li><a href="/docs/handbook/11-pointers-closures/#1115-null-pointers-ptrnull">11.1.5 Null pointers: Ptr::null()</a></li>
          <li><a href="/docs/handbook/11-pointers-closures/#1116-layout-copying-and-the-valid-niche">11.1.6 Layout, copying, and the @Valid niche</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/11-pointers-closures/#112-raw-pointer-types-imm-t-mut-t">11.2 Raw Pointer Types (*imm T, *mut T)</a>
        <ol>
          <li><a href="/docs/handbook/11-pointers-closures/#1121-exact-syntax">11.2.1 Exact syntax</a></li>
          <li><a href="/docs/handbook/11-pointers-closures/#1122-where-raw-pointers-may-be-used">11.2.2 Where raw pointers may be used</a></li>
          <li><a href="/docs/handbook/11-pointers-closures/#1123-dynamic-semantics-panics-not-ub">11.2.3 Dynamic semantics: panics, not UB</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/11-pointers-closures/#113-function-types">11.3 Function Types</a>
        <ol>
          <li><a href="/docs/handbook/11-pointers-closures/#1131-exact-syntax">11.3.1 Exact syntax</a></li>
          <li><a href="/docs/handbook/11-pointers-closures/#1132-procedures-as-first-class-values">11.3.2 Procedures as first-class values</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/11-pointers-closures/#114-closure-types-and-closure-expressions">11.4 Closure Types and Closure Expressions</a>
        <ol>
          <li><a href="/docs/handbook/11-pointers-closures/#1141-closure-type-syntax">11.4.1 Closure type syntax</a></li>
          <li><a href="/docs/handbook/11-pointers-closures/#1142-closure-expression-syntax">11.4.2 Closure expression syntax</a></li>
          <li><a href="/docs/handbook/11-pointers-closures/#1143-capture-classification">11.4.3 Capture classification</a></li>
          <li><a href="/docs/handbook/11-pointers-closures/#1144-local-vs-escaping-closures-and-the-dependency-clause">11.4.4 Local vs escaping closures, and the dependency clause</a></li>
          <li><a href="/docs/handbook/11-pointers-closures/#1145-calling-closures-and-the-pipeline-operator">11.4.5 Calling closures and the pipeline operator</a></li>
          <li><a href="/docs/handbook/11-pointers-closures/#1146-closure-representation-and-layout">11.4.6 Closure representation and layout</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/11-pointers-closures/#115-choosing-the-right-indirection">11.5 Choosing the Right Indirection</a></li>
      <li><a href="/docs/handbook/11-pointers-closures/#116-idioms--best-practices">11.6 Idioms &amp; Best Practices</a></li>
      <li><a href="/docs/handbook/11-pointers-closures/#117-pitfalls--diagnostics">11.7 Pitfalls &amp; Diagnostics</a></li>
    </ol>
  </details>
</li>
<li>
  <details open>
    <summary><a href="/docs/handbook/12-generics/">12. Generics &amp; Parametric Polymorphism</a></summary>
    <ol>
      <li><a href="/docs/handbook/12-generics/#121-generic-parameter-and-argument-syntax">12.1 Generic Parameter and Argument Syntax</a>
        <ol>
          <li><a href="/docs/handbook/12-generics/#1211-grammar">12.1.1 Grammar</a></li>
          <li><a href="/docs/handbook/12-generics/#1212-parameter-form-and-naming">12.1.2 Parameter Form and Naming</a></li>
          <li><a href="/docs/handbook/12-generics/#1213-variance">12.1.3 Variance</a></li>
          <li><a href="/docs/handbook/12-generics/#1214-class-bounds-">12.1.4 Class Bounds (&lt;:)</a></li>
          <li><a href="/docs/handbook/12-generics/#1215-foundational-class-bounds">12.1.5 Foundational Class Bounds</a></li>
          <li><a href="/docs/handbook/12-generics/#1216-parameter-defaults--type">12.1.6 Parameter Defaults (= type)</a></li>
          <li><a href="/docs/handbook/12-generics/#1217-no-const--value-generic-parameters">12.1.7 No Const / Value Generic Parameters</a></li>
          <li><a href="/docs/handbook/12-generics/#1218-no-runtime-semantics">12.1.8 No Runtime Semantics</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/12-generics/#122-generic-procedures-and-generic-types">12.2 Generic Procedures and Generic Types</a>
        <ol>
          <li><a href="/docs/handbook/12-generics/#1221-grammar">12.2.1 Grammar</a></li>
          <li><a href="/docs/handbook/12-generics/#1222-declaring-a-generic-procedure">12.2.2 Declaring a Generic Procedure</a></li>
          <li><a href="/docs/handbook/12-generics/#1223-calling-a-generic-procedure-explicit-type-arguments">12.2.3 Calling a Generic Procedure: Explicit Type Arguments</a></li>
          <li><a href="/docs/handbook/12-generics/#1224-type-argument-inference">12.2.4 Type-Argument Inference</a></li>
          <li><a href="/docs/handbook/12-generics/#1225-generic-records-and-other-nominal-types">12.2.5 Generic Records and Other Nominal Types</a></li>
          <li><a href="/docs/handbook/12-generics/#1226-generic-type-aliases">12.2.6 Generic Type Aliases</a></li>
          <li><a href="/docs/handbook/12-generics/#1227-monomorphization-model-and-cost">12.2.7 Monomorphization Model and Cost</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/12-generics/#idioms--best-practices">Idioms &amp; Best Practices</a></li>
      <li><a href="/docs/handbook/12-generics/#pitfalls--diagnostics">Pitfalls &amp; Diagnostics</a></li>
    </ol>
  </details>
</li>
<li>
  <details open>
    <summary><a href="/docs/handbook/13-classes-implementations/">13. Classes, Implementations &amp; Associated Types</a></summary>
    <ol>
      <li><a href="/docs/handbook/13-classes-implementations/#131-classes-spec-143">13.1 Classes (spec §14.3)</a>
        <ol>
          <li><a href="/docs/handbook/13-classes-implementations/#exact-syntax">Exact syntax</a></li>
          <li><a href="/docs/handbook/13-classes-implementations/#semantics">Semantics</a></li>
          <li><a href="/docs/handbook/13-classes-implementations/#well-formedness-rules-1434">Well-formedness rules (§14.3.4)</a></li>
          <li><a href="/docs/handbook/13-classes-implementations/#superclasses-linearization-and-effective-members">Superclasses, linearization, and effective members</a></li>
          <li><a href="/docs/handbook/13-classes-implementations/#class-vs-record-vs-modal">class vs record vs modal</a></li>
          <li><a href="/docs/handbook/13-classes-implementations/#worked-example-a-class-with-abstract-and-default-methods">Worked example: a class with abstract and default methods</a></li>
          <li><a href="/docs/handbook/13-classes-implementations/#worked-example-a-class-with-required-fields-and-a-superclass">Worked example: a class with required fields and a superclass</a></li>
          <li><a href="/docs/handbook/13-classes-implementations/#worked-example-a-modal-class-abstract-states">Worked example: a modal class (abstract states)</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/13-classes-implementations/#132-implementations-spec-144">13.2 Implementations (spec §14.4)</a>
        <ol>
          <li><a href="/docs/handbook/13-classes-implementations/#exact-syntax-1">Exact syntax</a></li>
          <li><a href="/docs/handbook/13-classes-implementations/#semantics-what-an-implementer-must-provide">Semantics: what an implementer must provide</a></li>
          <li><a href="/docs/handbook/13-classes-implementations/#coherence-and-the-orphan-rule-1444">Coherence and the orphan rule (§14.4.4)</a></li>
          <li><a href="/docs/handbook/13-classes-implementations/#lowering">Lowering</a></li>
          <li><a href="/docs/handbook/13-classes-implementations/#worked-example-a-record-implementing-a-class">Worked example: a record implementing a class</a></li>
          <li><a href="/docs/handbook/13-classes-implementations/#worked-example-a-modal-implementing-a-modal-class">Worked example: a modal implementing a modal class</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/13-classes-implementations/#133-associated-types-spec-145">13.3 Associated Types (spec §14.5)</a>
        <ol>
          <li><a href="/docs/handbook/13-classes-implementations/#exact-syntax-2">Exact syntax</a></li>
          <li><a href="/docs/handbook/13-classes-implementations/#semantics-1">Semantics</a></li>
          <li><a href="/docs/handbook/13-classes-implementations/#worked-example-abstract-and-defaulted-associated-types">Worked example: abstract and defaulted associated types</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/13-classes-implementations/#134-dynamic-class-objects-spec-146">13.4 Dynamic Class Objects (spec §14.6)</a>
        <ol>
          <li><a href="/docs/handbook/13-classes-implementations/#exact-syntax-3">Exact syntax</a></li>
          <li><a href="/docs/handbook/13-classes-implementations/#semantics-dispatchability">Semantics: dispatchability</a></li>
          <li><a href="/docs/handbook/13-classes-implementations/#method-resolution-and-dispatch">Method resolution and dispatch</a></li>
          <li><a href="/docs/handbook/13-classes-implementations/#vtable-layout-and-cost-model-1466">Vtable layout and cost model (§14.6.6)</a></li>
          <li><a href="/docs/handbook/13-classes-implementations/#worked-example-dynamic-dispatch-over-rendertarget">Worked example: dynamic dispatch over $RenderTarget</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/13-classes-implementations/#idioms--best-practices">Idioms &amp; Best Practices</a></li>
      <li><a href="/docs/handbook/13-classes-implementations/#pitfalls--diagnostics">Pitfalls &amp; Diagnostics</a></li>
    </ol>
  </details>
</li>
<li>
  <details open>
    <summary><a href="/docs/handbook/14-refinement-capability/">14. Opaque, Refinement &amp; Capability Classes</a></summary>
    <ol>
      <li><a href="/docs/handbook/14-refinement-capability/#147-opaque-types">14.7 Opaque Types</a>
        <ol>
          <li><a href="/docs/handbook/14-refinement-capability/#1471-syntax">14.7.1 Syntax</a></li>
          <li><a href="/docs/handbook/14-refinement-capability/#1472-parsing">14.7.2 Parsing</a></li>
          <li><a href="/docs/handbook/14-refinement-capability/#1473-ast-representation">14.7.3 AST Representation</a></li>
          <li><a href="/docs/handbook/14-refinement-capability/#1474-static-semantics">14.7.4 Static Semantics</a></li>
          <li><a href="/docs/handbook/14-refinement-capability/#1475-dynamic-semantics">14.7.5 Dynamic Semantics</a></li>
          <li><a href="/docs/handbook/14-refinement-capability/#1476-lowering">14.7.6 Lowering</a></li>
          <li><a href="/docs/handbook/14-refinement-capability/#1477-worked-example">14.7.7 Worked Example</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/14-refinement-capability/#148-refinement-types">14.8 Refinement Types</a>
        <ol>
          <li><a href="/docs/handbook/14-refinement-capability/#1481-syntax">14.8.1 Syntax</a></li>
          <li><a href="/docs/handbook/14-refinement-capability/#1482-parsing">14.8.2 Parsing</a></li>
          <li><a href="/docs/handbook/14-refinement-capability/#1483-ast-representation">14.8.3 AST Representation</a></li>
          <li><a href="/docs/handbook/14-refinement-capability/#1484-static-semantics">14.8.4 Static Semantics</a></li>
          <li><a href="/docs/handbook/14-refinement-capability/#1485-dynamic-semantics">14.8.5 Dynamic Semantics</a></li>
          <li><a href="/docs/handbook/14-refinement-capability/#1486-lowering">14.8.6 Lowering</a></li>
          <li><a href="/docs/handbook/14-refinement-capability/#1487-worked-examples">14.8.7 Worked Examples</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/14-refinement-capability/#149-capability-classes">14.9 Capability Classes</a>
        <ol>
          <li><a href="/docs/handbook/14-refinement-capability/#1491-syntax">14.9.1 Syntax</a></li>
          <li><a href="/docs/handbook/14-refinement-capability/#1492-parsing">14.9.2 Parsing</a></li>
          <li><a href="/docs/handbook/14-refinement-capability/#1493-the-capability-universe-and-capclass">14.9.3 The Capability Universe and CapClass</a></li>
          <li><a href="/docs/handbook/14-refinement-capability/#1494-static-semantics">14.9.4 Static Semantics</a></li>
          <li><a href="/docs/handbook/14-refinement-capability/#1495-the-authority--context-model">14.9.5 The Authority / Context Model</a></li>
          <li><a href="/docs/handbook/14-refinement-capability/#1496-dynamic-semantics-and-lowering">14.9.6 Dynamic Semantics and Lowering</a></li>
          <li><a href="/docs/handbook/14-refinement-capability/#1497-worked-examples">14.9.7 Worked Examples</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/14-refinement-capability/#1410-foundational-classes">14.10 Foundational Classes</a>
        <ol>
          <li><a href="/docs/handbook/14-refinement-capability/#14101-syntax">14.10.1 Syntax</a></li>
          <li><a href="/docs/handbook/14-refinement-capability/#14102-ast-representation-and-structural-relations">14.10.2 AST Representation and Structural Relations</a></li>
          <li><a href="/docs/handbook/14-refinement-capability/#14103-static-semantics">14.10.3 Static Semantics</a></li>
          <li><a href="/docs/handbook/14-refinement-capability/#14104-dynamic-semantics">14.10.4 Dynamic Semantics</a></li>
          <li><a href="/docs/handbook/14-refinement-capability/#14105-lowering">14.10.5 Lowering</a></li>
          <li><a href="/docs/handbook/14-refinement-capability/#14106-worked-examples">14.10.6 Worked Examples</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/14-refinement-capability/#1411-refinement-and-polymorphism-diagnostics-supplement">14.11 Refinement and Polymorphism Diagnostics Supplement</a></li>
      <li><a href="/docs/handbook/14-refinement-capability/#idioms--best-practices">Idioms &amp; Best Practices</a></li>
      <li><a href="/docs/handbook/14-refinement-capability/#pitfalls--diagnostics">Pitfalls &amp; Diagnostics</a></li>
    </ol>
  </details>
</li>
<li>
  <details open>
    <summary><a href="/docs/handbook/15-procedures-methods/">15. Procedures, Methods &amp; Overloading</a></summary>
    <ol>
      <li><a href="/docs/handbook/15-procedures-methods/#151-procedure-declarations">15.1 Procedure Declarations</a>
        <ol>
          <li><a href="/docs/handbook/15-procedures-methods/#1511-exact-syntax">15.1.1 Exact Syntax</a>
            <ol>
              <li><a href="/docs/handbook/15-procedures-methods/#parameters-and-the-move-mode">Parameters and the move mode</a></li>
              <li><a href="/docs/handbook/15-procedures-methods/#permission-annotations-on-parameter-types">Permission annotations on parameter types</a></li>
              <li><a href="/docs/handbook/15-procedures-methods/#return-types----and-the-explicit-return-rule">Return types, -&gt; (), and the explicit-return rule</a></li>
              <li><a href="/docs/handbook/15-procedures-methods/#the-main-entry-point">The main entry point</a></li>
            </ol>
          </li>
          <li><a href="/docs/handbook/15-procedures-methods/#1512-semantics">15.1.2 Semantics</a></li>
          <li><a href="/docs/handbook/15-procedures-methods/#1513-worked-example--a-free-procedure">15.1.3 Worked Example — a free procedure</a></li>
          <li><a href="/docs/handbook/15-procedures-methods/#1514-diagnostics-1517">15.1.4 Diagnostics (§15.1.7)</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/15-procedures-methods/#152-methods-and-receivers">15.2 Methods and Receivers</a>
        <ol>
          <li><a href="/docs/handbook/15-procedures-methods/#1521-exact-syntax">15.2.1 Exact Syntax</a></li>
          <li><a href="/docs/handbook/15-procedures-methods/#1522-receiver-forms-and-their-meaning">15.2.2 Receiver forms and their meaning</a>
            <ol>
              <li><a href="/docs/handbook/15-procedures-methods/#mutable-unique-receivers">Mutable (unique) receivers</a></li>
              <li><a href="/docs/handbook/15-procedures-methods/#explicit-self-receivers-must-be-self">Explicit self receivers must be Self</a></li>
              <li><a href="/docs/handbook/15-procedures-methods/#receiver-permission-at-the-call-site">Receiver permission at the call site</a></li>
            </ol>
          </li>
          <li><a href="/docs/handbook/15-procedures-methods/#1523-how-methods-attach-to-types">15.2.3 How methods attach to types</a></li>
          <li><a href="/docs/handbook/15-procedures-methods/#1524-semantics">15.2.4 Semantics</a></li>
          <li><a href="/docs/handbook/15-procedures-methods/#1525-worked-example--a-method-with-a-mutable-receiver">15.2.5 Worked Example — a method with a mutable receiver</a></li>
          <li><a href="/docs/handbook/15-procedures-methods/#1526-diagnostics-1527">15.2.6 Diagnostics (§15.2.7)</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/15-procedures-methods/#153-overloading">15.3 Overloading</a>
        <ol>
          <li><a href="/docs/handbook/15-procedures-methods/#1531-free-procedure-overload-resolution">15.3.1 Free-procedure overload resolution</a></li>
          <li><a href="/docs/handbook/15-procedures-methods/#1532-method-and-inherited-default-resolution">15.3.2 Method and inherited-default resolution</a></li>
          <li><a href="/docs/handbook/15-procedures-methods/#1533-worked-example--a-free-procedure-overload-set">15.3.3 Worked Example — a free-procedure overload set</a></li>
          <li><a href="/docs/handbook/15-procedures-methods/#1534-diagnostics-1537">15.3.4 Diagnostics (§15.3.7)</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/15-procedures-methods/#idioms--best-practices">Idioms &amp; Best Practices</a></li>
      <li><a href="/docs/handbook/15-procedures-methods/#pitfalls--diagnostics">Pitfalls &amp; Diagnostics</a></li>
    </ol>
  </details>
</li>
<li>
  <details open>
    <summary><a href="/docs/handbook/16-contracts/">16. Contracts: Preconditions, Postconditions, Invariants &amp; Verification</a></summary>
    <ol>
      <li><a href="/docs/handbook/16-contracts/#161-the-contract-clause-154">16.1 The Contract Clause (§15.4)</a>
        <ol>
          <li><a href="/docs/handbook/16-contracts/#1611-exact-syntax">16.1.1 Exact syntax</a></li>
          <li><a href="/docs/handbook/16-contracts/#1612-semantics-predicates-must-be-bool-and-pure">16.1.2 Semantics: predicates must be bool and pure</a></li>
          <li><a href="/docs/handbook/16-contracts/#1613-worked-example-a-contract-on-a-public-api">16.1.3 Worked example: a contract on a public API</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/16-contracts/#162-preconditions-155">16.2 Preconditions (§15.5)</a>
        <ol>
          <li><a href="/docs/handbook/16-contracts/#1621-syntax-and-elision">16.2.1 Syntax and elision</a></li>
          <li><a href="/docs/handbook/16-contracts/#1622-semantics-the-caller-proves-the-precondition">16.2.2 Semantics: the caller proves the precondition</a></li>
          <li><a href="/docs/handbook/16-contracts/#1623-worked-example-a-precondition-the-caller-can-prove">16.2.3 Worked example: a precondition the caller can prove</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/16-contracts/#163-postconditions-result-and-entry-156">16.3 Postconditions: @result and @entry (§15.6)</a>
        <ol>
          <li><a href="/docs/handbook/16-contracts/#1631-syntax">16.3.1 Syntax</a></li>
          <li><a href="/docs/handbook/16-contracts/#1632-result--the-returned-value">16.3.2 @result — the returned value</a></li>
          <li><a href="/docs/handbook/16-contracts/#1633-entryexpr--entry-state-snapshots">16.3.3 @entry(expr) — entry-state snapshots</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/16-contracts/#164-invariants-157">16.4 Invariants (§15.7)</a>
        <ol>
          <li><a href="/docs/handbook/16-contracts/#1641-exact-syntax">16.4.1 Exact syntax</a></li>
          <li><a href="/docs/handbook/16-contracts/#1642-type-invariant-semantics">16.4.2 Type-invariant semantics</a></li>
          <li><a href="/docs/handbook/16-contracts/#1643-loop-invariant-semantics">16.4.3 Loop-invariant semantics</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/16-contracts/#165-verification-logic-what-is-proved-vs-checked-158">16.5 Verification Logic: what is proved vs checked (§15.8)</a>
        <ol>
          <li><a href="/docs/handbook/16-contracts/#1651-the-decision-static-proof-first-dynamic-check-only-in-dynamic">16.5.1 The decision: static proof first, dynamic check only in #dynamic</a></li>
          <li><a href="/docs/handbook/16-contracts/#1652-what-the-compiler-may-reason-with">16.5.2 What the compiler may reason with</a></li>
          <li><a href="/docs/handbook/16-contracts/#1653-facts-how-proofs-flow-through-code">16.5.3 Facts: how proofs flow through code</a></li>
          <li><a href="/docs/handbook/16-contracts/#1654-the-dynamic-check-and-its-panic">16.5.4 The dynamic check and its panic</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/16-contracts/#166-behavioral-subtyping-159">16.6 Behavioral Subtyping (§15.9)</a></li>
      <li><a href="/docs/handbook/16-contracts/#167-idioms--best-practices">16.7 Idioms &amp; Best Practices</a></li>
      <li><a href="/docs/handbook/16-contracts/#168-foreign-contracts-on-extern-procedures-236">16.8 Foreign Contracts on extern Procedures (§23.6)</a></li>
      <li><a href="/docs/handbook/16-contracts/#169-pitfalls--diagnostics">16.9 Pitfalls &amp; Diagnostics</a></li>
    </ol>
  </details>
</li>
<li>
  <details open>
    <summary><a href="/docs/handbook/17-expressions-operators/">17. Expressions &amp; Operators</a></summary>
    <ol>
      <li><a href="/docs/handbook/17-expressions-operators/#171-operator-precedence-and-associativity-overview">17.1 Operator Precedence and Associativity (Overview)</a></li>
      <li><a href="/docs/handbook/17-expressions-operators/#172-literal-and-name-expressions-161">17.2 Literal and Name Expressions (§16.1)</a>
        <ol>
          <li><a href="/docs/handbook/17-expressions-operators/#1721-syntax">17.2.1 Syntax</a></li>
          <li><a href="/docs/handbook/17-expressions-operators/#1722-integer-literals">17.2.2 Integer literals</a></li>
          <li><a href="/docs/handbook/17-expressions-operators/#1723-float-bool-char-string-unit-and-null-literals">17.2.3 Float, bool, char, string, unit, and null literals</a></li>
          <li><a href="/docs/handbook/17-expressions-operators/#1724-name-expressions">17.2.4 Name expressions</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/17-expressions-operators/#173-access-and-place-expressions-162">17.3 Access and Place Expressions (§16.2)</a>
        <ol>
          <li><a href="/docs/handbook/17-expressions-operators/#1731-syntax">17.3.1 Syntax</a></li>
          <li><a href="/docs/handbook/17-expressions-operators/#1732-field-access">17.3.2 Field access</a></li>
          <li><a href="/docs/handbook/17-expressions-operators/#1733-tuple-index">17.3.3 Tuple index</a></li>
          <li><a href="/docs/handbook/17-expressions-operators/#1734-indexing-and-slicing">17.3.4 Indexing and slicing</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/17-expressions-operators/#174-call-expressions-163">17.4 Call Expressions (§16.3)</a>
        <ol>
          <li><a href="/docs/handbook/17-expressions-operators/#1741-syntax">17.4.1 Syntax</a></li>
          <li><a href="/docs/handbook/17-expressions-operators/#1742-ordinary-calls-and-argument-passing">17.4.2 Ordinary calls and argument passing</a></li>
          <li><a href="/docs/handbook/17-expressions-operators/#1743-generic-calls">17.4.3 Generic calls</a></li>
          <li><a href="/docs/handbook/17-expressions-operators/#1744-the-capability--method-call-operator-">17.4.4 The capability / method call operator ~&gt;</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/17-expressions-operators/#175-operator-expressions-164">17.5 Operator Expressions (§16.4)</a>
        <ol>
          <li><a href="/docs/handbook/17-expressions-operators/#1751-unary-operators--and--">17.5.1 Unary operators ! and -</a></li>
          <li><a href="/docs/handbook/17-expressions-operators/#1752-arithmetic-operators-------">17.5.2 Arithmetic operators + - * / % **</a></li>
          <li><a href="/docs/handbook/17-expressions-operators/#1753-comparison-operators------">17.5.3 Comparison operators == != &lt; &lt;= &gt; &gt;=</a></li>
          <li><a href="/docs/handbook/17-expressions-operators/#1754-logical-operators---">17.5.4 Logical operators &amp;&amp; || !</a></li>
          <li><a href="/docs/handbook/17-expressions-operators/#1755-bitwise-operators----and-complement-">17.5.5 Bitwise operators &amp; | ^ and complement !</a></li>
          <li><a href="/docs/handbook/17-expressions-operators/#1756-shift-operators--and-">17.5.6 Shift operators &lt;&lt; and &gt;&gt;</a></li>
          <li><a href="/docs/handbook/17-expressions-operators/#1757-range-expressions">17.5.7 Range expressions</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/17-expressions-operators/#176-cast-and-transmute-expressions-165">17.6 Cast and Transmute Expressions (§16.5)</a>
        <ol>
          <li><a href="/docs/handbook/17-expressions-operators/#1761-syntax">17.6.1 Syntax</a></li>
          <li><a href="/docs/handbook/17-expressions-operators/#1762-as-casts">17.6.2 as casts</a></li>
          <li><a href="/docs/handbook/17-expressions-operators/#1763-transmute">17.6.3 transmute</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/17-expressions-operators/#177-construction-expressions-166">17.7 Construction Expressions (§16.6)</a>
        <ol>
          <li><a href="/docs/handbook/17-expressions-operators/#1771-syntax">17.7.1 Syntax</a></li>
          <li><a href="/docs/handbook/17-expressions-operators/#1772-tuples">17.7.2 Tuples</a></li>
          <li><a href="/docs/handbook/17-expressions-operators/#1773-arrays">17.7.3 Arrays</a></li>
          <li><a href="/docs/handbook/17-expressions-operators/#1774-records">17.7.4 Records</a></li>
          <li><a href="/docs/handbook/17-expressions-operators/#1775-enums">17.7.5 Enums</a></li>
          <li><a href="/docs/handbook/17-expressions-operators/#1776-modal-state-construction">17.7.6 Modal state construction</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/17-expressions-operators/#178-control-expressions-167">17.8 Control Expressions (§16.7)</a>
        <ol>
          <li><a href="/docs/handbook/17-expressions-operators/#1781-syntax">17.8.1 Syntax</a></li>
          <li><a href="/docs/handbook/17-expressions-operators/#1782-if-as-an-expression">17.8.2 if as an expression</a></li>
          <li><a href="/docs/handbook/17-expressions-operators/#1783-if--is--pattern-and-match-expression-form">17.8.3 if ... is — pattern and match expression form</a></li>
          <li><a href="/docs/handbook/17-expressions-operators/#1784-loop-as-an-expression">17.8.4 loop as an expression</a></li>
          <li><a href="/docs/handbook/17-expressions-operators/#1785-block-expressions">17.8.5 Block expressions</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/17-expressions-operators/#179-effectful-core-expressions-168">17.9 Effectful Core Expressions (§16.8)</a>
        <ol>
          <li><a href="/docs/handbook/17-expressions-operators/#1791-syntax">17.9.1 Syntax</a></li>
          <li><a href="/docs/handbook/17-expressions-operators/#1792-unsafe-blocks">17.9.2 unsafe blocks</a></li>
          <li><a href="/docs/handbook/17-expressions-operators/#1793-address-of--and-dereference-">17.9.3 Address-of &amp; and dereference *</a></li>
          <li><a href="/docs/handbook/17-expressions-operators/#1794-move-and-copy">17.9.4 move and copy</a></li>
          <li><a href="/docs/handbook/17-expressions-operators/#1795-region-allocation">17.9.5 Region allocation</a></li>
          <li><a href="/docs/handbook/17-expressions-operators/#1796-error-propagation-">17.9.6 Error propagation ?</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/17-expressions-operators/#1710-closure-and-pipeline-expressions-169">17.10 Closure and Pipeline Expressions (§16.9)</a>
        <ol>
          <li><a href="/docs/handbook/17-expressions-operators/#17101-syntax">17.10.1 Syntax</a></li>
          <li><a href="/docs/handbook/17-expressions-operators/#17102-closures">17.10.2 Closures</a></li>
          <li><a href="/docs/handbook/17-expressions-operators/#17103-pipelines-">17.10.3 Pipelines =&gt;</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/17-expressions-operators/#idioms--best-practices">Idioms &amp; Best Practices</a></li>
      <li><a href="/docs/handbook/17-expressions-operators/#pitfalls--diagnostics">Pitfalls &amp; Diagnostics</a></li>
    </ol>
  </details>
</li>
<li>
  <details open>
    <summary><a href="/docs/handbook/18-patterns/">18. Patterns &amp; Matching</a></summary>
    <ol>
      <li><a href="/docs/handbook/18-patterns/#181-basic-patterns">18.1 Basic Patterns</a>
        <ol>
          <li><a href="/docs/handbook/18-patterns/#1811-syntax">18.1.1 Syntax</a></li>
          <li><a href="/docs/handbook/18-patterns/#1812-the-four-basic-forms">18.1.2 The four basic forms</a></li>
          <li><a href="/docs/handbook/18-patterns/#1813-permission-threading">18.1.3 Permission threading</a></li>
          <li><a href="/docs/handbook/18-patterns/#1814-worked-example">18.1.4 Worked example</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/18-patterns/#182-tuple-and-record-patterns">18.2 Tuple and Record Patterns</a>
        <ol>
          <li><a href="/docs/handbook/18-patterns/#1821-syntax">18.2.1 Syntax</a></li>
          <li><a href="/docs/handbook/18-patterns/#1822-tuple-patterns">18.2.2 Tuple patterns</a></li>
          <li><a href="/docs/handbook/18-patterns/#1823-record-patterns">18.2.3 Record patterns</a></li>
          <li><a href="/docs/handbook/18-patterns/#1824-worked-example">18.2.4 Worked example</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/18-patterns/#183-enum-and-modal-patterns">18.3 Enum and Modal Patterns</a>
        <ol>
          <li><a href="/docs/handbook/18-patterns/#1831-syntax">18.3.1 Syntax</a></li>
          <li><a href="/docs/handbook/18-patterns/#1832-enum-pattern-semantics">18.3.2 Enum pattern semantics</a></li>
          <li><a href="/docs/handbook/18-patterns/#1833-modal-pattern-semantics">18.3.3 Modal pattern semantics</a></li>
          <li><a href="/docs/handbook/18-patterns/#1834-worked-example--enums">18.3.4 Worked example — enums</a></li>
          <li><a href="/docs/handbook/18-patterns/#1835-worked-example--modal-state">18.3.5 Worked example — modal state</a></li>
          <li><a href="/docs/handbook/18-patterns/#1836-worked-example--outcome">18.3.6 Worked example — Outcome</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/18-patterns/#184-range-patterns">18.4 Range Patterns</a>
        <ol>
          <li><a href="/docs/handbook/18-patterns/#1841-syntax">18.4.1 Syntax</a></li>
          <li><a href="/docs/handbook/18-patterns/#1842-semantics">18.4.2 Semantics</a></li>
          <li><a href="/docs/handbook/18-patterns/#1843-worked-example">18.4.3 Worked example</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/18-patterns/#185-case-clauses">18.5 Case Clauses</a>
        <ol>
          <li><a href="/docs/handbook/18-patterns/#1851-syntax">18.5.1 Syntax</a></li>
          <li><a href="/docs/handbook/18-patterns/#1852-guards-via-nested-matching">18.5.2 Guards via nested matching</a></li>
          <li><a href="/docs/handbook/18-patterns/#1853-scoping-and-type-narrowing">18.5.3 Scoping and type narrowing</a></li>
          <li><a href="/docs/handbook/18-patterns/#1854-evaluation-semantics">18.5.4 Evaluation semantics</a></li>
          <li><a href="/docs/handbook/18-patterns/#1855-worked-example--exhaustive-enum-dispatch-with-narrowing">18.5.5 Worked example — exhaustive enum dispatch with narrowing</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/18-patterns/#186-exhaustiveness-and-reachability">18.6 Exhaustiveness and Reachability</a>
        <ol>
          <li><a href="/docs/handbook/18-patterns/#1861-irrefutability-and-coverage">18.6.1 Irrefutability and coverage</a></li>
          <li><a href="/docs/handbook/18-patterns/#1862-enum-exhaustiveness">18.6.2 Enum exhaustiveness</a></li>
          <li><a href="/docs/handbook/18-patterns/#1863-modal-exhaustiveness">18.6.3 Modal exhaustiveness</a></li>
          <li><a href="/docs/handbook/18-patterns/#1864-union-exhaustiveness">18.6.4 Union exhaustiveness</a></li>
          <li><a href="/docs/handbook/18-patterns/#1865-other-scrutinees">18.6.5 Other scrutinees</a></li>
          <li><a href="/docs/handbook/18-patterns/#1866-reachability">18.6.6 Reachability</a></li>
          <li><a href="/docs/handbook/18-patterns/#1867-how-exhaustiveness-drives-safe-code">18.6.7 How exhaustiveness drives safe code</a></li>
          <li><a href="/docs/handbook/18-patterns/#1868-worked-example--refactor-safety">18.6.8 Worked example — refactor safety</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/18-patterns/#187-idioms--best-practices">18.7 Idioms &amp; Best Practices</a></li>
      <li><a href="/docs/handbook/18-patterns/#188-pitfalls--diagnostics">18.8 Pitfalls &amp; Diagnostics</a></li>
    </ol>
  </details>
</li>
<li>
  <details open>
    <summary><a href="/docs/handbook/19-statements-regions/">19. Statements, Blocks, Regions, Frames &amp; Defer</a></summary>
    <ol>
      <li><a href="/docs/handbook/19-statements-regions/#191-blocks-and-block-values-181">19.1 Blocks and Block Values (§18.1)</a>
        <ol>
          <li><a href="/docs/handbook/19-statements-regions/#1911-grammar">19.1.1 Grammar</a></li>
          <li><a href="/docs/handbook/19-statements-regions/#1912-statement-terminators">19.1.2 Statement terminators</a></li>
          <li><a href="/docs/handbook/19-statements-regions/#1913-the-block-value-tail-expression">19.1.3 The block value (tail expression)</a></li>
          <li><a href="/docs/handbook/19-statements-regions/#1914-scope-evaluation-order-and-cleanup">19.1.4 Scope, evaluation order, and cleanup</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/19-statements-regions/#192-binding-statements-let-and-var-182">19.2 Binding Statements: let and var (§18.2)</a>
        <ol>
          <li><a href="/docs/handbook/19-statements-regions/#1921-grammar">19.2.1 Grammar</a></li>
          <li><a href="/docs/handbook/19-statements-regions/#1922-the-two-binding-operators--vs-">19.2.2 The two binding operators: = vs :=</a></li>
          <li><a href="/docs/handbook/19-statements-regions/#1923-typing-rules">19.2.3 Typing rules</a></li>
          <li><a href="/docs/handbook/19-statements-regions/#1924-worked-example">19.2.4 Worked example</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/19-statements-regions/#193-local-using-statements-183">19.3 Local using Statements (§18.3)</a>
        <ol>
          <li><a href="/docs/handbook/19-statements-regions/#1931-grammar">19.3.1 Grammar</a></li>
          <li><a href="/docs/handbook/19-statements-regions/#1932-semantics">19.3.2 Semantics</a></li>
          <li><a href="/docs/handbook/19-statements-regions/#1933-worked-example">19.3.3 Worked example</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/19-statements-regions/#194-assignment-statements-184">19.4 Assignment Statements (§18.4)</a>
        <ol>
          <li><a href="/docs/handbook/19-statements-regions/#1941-grammar">19.4.1 Grammar</a></li>
          <li><a href="/docs/handbook/19-statements-regions/#1942-plain-assignment">19.4.2 Plain assignment</a></li>
          <li><a href="/docs/handbook/19-statements-regions/#1943-compound-assignment">19.4.3 Compound assignment</a></li>
          <li><a href="/docs/handbook/19-statements-regions/#1944-diagnostics">19.4.4 Diagnostics</a></li>
          <li><a href="/docs/handbook/19-statements-regions/#1945-worked-example">19.4.5 Worked example</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/19-statements-regions/#195-expression-statements-185">19.5 Expression Statements (§18.5)</a>
        <ol>
          <li><a href="/docs/handbook/19-statements-regions/#1951-grammar">19.5.1 Grammar</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/19-statements-regions/#196-defer-186">19.6 defer (§18.6)</a>
        <ol>
          <li><a href="/docs/handbook/19-statements-regions/#1961-grammar">19.6.1 Grammar</a></li>
          <li><a href="/docs/handbook/19-statements-regions/#1962-semantics">19.6.2 Semantics</a></li>
          <li><a href="/docs/handbook/19-statements-regions/#1963-ordering--lifo">19.6.3 Ordering — LIFO</a></li>
          <li><a href="/docs/handbook/19-statements-regions/#1964-worked-example">19.6.4 Worked example</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/19-statements-regions/#197-region--arena-scopes-187">19.7 region — Arena Scopes (§18.7)</a>
        <ol>
          <li><a href="/docs/handbook/19-statements-regions/#1971-grammar">19.7.1 Grammar</a></li>
          <li><a href="/docs/handbook/19-statements-regions/#1972-options-and-alias">19.7.2 Options and alias</a></li>
          <li><a href="/docs/handbook/19-statements-regions/#1973-semantics">19.7.3 Semantics</a></li>
          <li><a href="/docs/handbook/19-statements-regions/#1974-allocating-into-a-region">19.7.4 Allocating into a region</a></li>
          <li><a href="/docs/handbook/19-statements-regions/#1975-worked-example">19.7.5 Worked example</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/19-statements-regions/#198-frame--stack-like-scopes-188">19.8 frame — Stack-Like Scopes (§18.8)</a>
        <ol>
          <li><a href="/docs/handbook/19-statements-regions/#1981-grammar">19.8.1 Grammar</a></li>
          <li><a href="/docs/handbook/19-statements-regions/#1982-implicit-vs-explicit-target">19.8.2 Implicit vs explicit target</a></li>
          <li><a href="/docs/handbook/19-statements-regions/#1983-semantics">19.8.3 Semantics</a></li>
          <li><a href="/docs/handbook/19-statements-regions/#1984-worked-example">19.8.4 Worked example</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/19-statements-regions/#199-control-transfer-statements-return-break-continue-189">19.9 Control-Transfer Statements: return, break, continue (§18.9)</a>
        <ol>
          <li><a href="/docs/handbook/19-statements-regions/#1991-grammar">19.9.1 Grammar</a></li>
          <li><a href="/docs/handbook/19-statements-regions/#1992-return">19.9.2 return</a></li>
          <li><a href="/docs/handbook/19-statements-regions/#1993-break">19.9.3 break</a></li>
          <li><a href="/docs/handbook/19-statements-regions/#1994-continue">19.9.4 continue</a></li>
          <li><a href="/docs/handbook/19-statements-regions/#1995-interaction-with-cleanup">19.9.5 Interaction with cleanup</a></li>
          <li><a href="/docs/handbook/19-statements-regions/#1996-worked-example">19.9.6 Worked example</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/19-statements-regions/#1910-unsafe-statements-1810">19.10 unsafe Statements (§18.10)</a>
        <ol>
          <li><a href="/docs/handbook/19-statements-regions/#19101-grammar">19.10.1 Grammar</a></li>
          <li><a href="/docs/handbook/19-statements-regions/#19102-what-unsafe-enables">19.10.2 What unsafe enables</a></li>
          <li><a href="/docs/handbook/19-statements-regions/#19103-worked-example">19.10.3 Worked example</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/19-statements-regions/#1911-idioms--best-practices">19.11 Idioms &amp; Best Practices</a></li>
      <li><a href="/docs/handbook/19-statements-regions/#1912-pitfalls--diagnostics">19.12 Pitfalls &amp; Diagnostics</a></li>
    </ol>
  </details>
</li>
<li>
  <details open>
    <summary><a href="/docs/handbook/20-permissions/">20. Permissions &amp; Binding State</a></summary>
    <ol>
      <li><a href="/docs/handbook/20-permissions/#201-permission-forms-101">20.1 Permission Forms (§10.1)</a>
        <ol>
          <li><a href="/docs/handbook/20-permissions/#2011-exact-syntax">20.1.1 Exact Syntax</a></li>
          <li><a href="/docs/handbook/20-permissions/#2012-parsing">20.1.2 Parsing</a></li>
          <li><a href="/docs/handbook/20-permissions/#2013-ast-representation">20.1.3 AST Representation</a></li>
          <li><a href="/docs/handbook/20-permissions/#2014-static-semantics-the-three-regimes">20.1.4 Static Semantics: the three regimes</a></li>
          <li><a href="/docs/handbook/20-permissions/#2015-dynamic-semantics">20.1.5 Dynamic Semantics</a></li>
          <li><a href="/docs/handbook/20-permissions/#2016-lowering">20.1.6 Lowering</a></li>
          <li><a href="/docs/handbook/20-permissions/#2017-worked-example">20.1.7 Worked example</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/20-permissions/#202-alias-and-exclusivity-rules-102">20.2 Alias and Exclusivity Rules (§10.2)</a>
        <ol>
          <li><a href="/docs/handbook/20-permissions/#2021-aliasing-and-the-exclusivity-invariant">20.2.1 Aliasing and the exclusivity invariant</a></li>
          <li><a href="/docs/handbook/20-permissions/#2022-the-coexistence-matrix">20.2.2 The Coexistence Matrix</a></li>
          <li><a href="/docs/handbook/20-permissions/#2023-dynamic-semantics-and-lowering">20.2.3 Dynamic semantics and lowering</a></li>
          <li><a href="/docs/handbook/20-permissions/#2024-worked-example">20.2.4 Worked example</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/20-permissions/#203-binding-activity-states-103">20.3 Binding Activity States (§10.3)</a>
        <ol>
          <li><a href="/docs/handbook/20-permissions/#2031-the-two-states">20.3.1 The two states</a></li>
          <li><a href="/docs/handbook/20-permissions/#2032-transition-rules">20.3.2 Transition rules</a></li>
          <li><a href="/docs/handbook/20-permissions/#2033-dynamic-semantics">20.3.3 Dynamic semantics</a></li>
          <li><a href="/docs/handbook/20-permissions/#2034-worked-example">20.3.4 Worked example</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/20-permissions/#204-permission-admissibility-104">20.4 Permission Admissibility (§10.4)</a>
        <ol>
          <li><a href="/docs/handbook/20-permissions/#2041-the-permadmits-relation">20.4.1 The PermAdmits relation</a></li>
          <li><a href="/docs/handbook/20-permissions/#2042-method-receiver-permissions">20.4.2 Method receiver permissions</a></li>
          <li><a href="/docs/handbook/20-permissions/#2043-constraints">20.4.3 Constraints</a></li>
          <li><a href="/docs/handbook/20-permissions/#2044-dynamic-semantics-and-lowering">20.4.4 Dynamic semantics and lowering</a></li>
          <li><a href="/docs/handbook/20-permissions/#2045-how-permissions-enable-local-reasoning">20.4.5 How permissions enable local reasoning</a></li>
          <li><a href="/docs/handbook/20-permissions/#2046-worked-example">20.4.6 Worked example</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/20-permissions/#205-permissions-in-parameter-signatures-and-move">20.5 Permissions in Parameter Signatures and move</a></li>
      <li><a href="/docs/handbook/20-permissions/#idioms--best-practices">Idioms &amp; Best Practices</a></li>
      <li><a href="/docs/handbook/20-permissions/#pitfalls--diagnostics">Pitfalls &amp; Diagnostics</a></li>
    </ol>
  </details>
</li>
<li>
  <details open>
    <summary><a href="/docs/handbook/21-authority-memory/">21. Authority, Capabilities, Regions &amp; the Memory Model</a></summary>
    <ol>
      <li><a href="/docs/handbook/21-authority-memory/#211-the-authority-model-61">21.1 The Authority Model (§6.1)</a>
        <ol>
          <li><a href="/docs/handbook/21-authority-memory/#2111-no-ambient-authority">21.1.1 No Ambient Authority</a></li>
          <li><a href="/docs/handbook/21-authority-memory/#2112-the-four-no-ambient-authority-requirements">21.1.2 The Four No-Ambient-Authority Requirements</a></li>
          <li><a href="/docs/handbook/21-authority-memory/#2113-the-idiomatic-entry-point-and-the-capability-call-operator-">21.1.3 The Idiomatic Entry Point and the Capability Call Operator ~&gt;</a></li>
          <li><a href="/docs/handbook/21-authority-memory/#2114-attenuation">21.1.4 Attenuation</a></li>
          <li><a href="/docs/handbook/21-authority-memory/#2115-observable-behavior-the-as-if-rule-and-sequence-points">21.1.5 Observable Behavior, the As-If Rule, and Sequence Points</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/21-authority-memory/#212-host-primitives-62">21.2 Host Primitives (§6.2)</a>
        <ol>
          <li><a href="/docs/handbook/21-authority-memory/#2121-io-file-and-directory-primitives">21.2.1 IO, File, and Directory Primitives</a></li>
          <li><a href="/docs/handbook/21-authority-memory/#2122-system-primitives">21.2.2 System Primitives</a></li>
          <li><a href="/docs/handbook/21-authority-memory/#2123-time-primitives">21.2.3 Time Primitives</a></li>
          <li><a href="/docs/handbook/21-authority-memory/#2124-network-primitives">21.2.4 Network Primitives</a></li>
          <li><a href="/docs/handbook/21-authority-memory/#2125-heap-and-reactor-primitives">21.2.5 Heap and Reactor Primitives</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/21-authority-memory/#213-binding-and-permission-runtime-state-63">21.3 Binding and Permission Runtime State (§6.3)</a>
        <ol>
          <li><a href="/docs/handbook/21-authority-memory/#2131-binding-state">21.3.1 Binding State</a></li>
          <li><a href="/docs/handbook/21-authority-memory/#2132-permission-activity-state">21.3.2 Permission Activity State</a></li>
          <li><a href="/docs/handbook/21-authority-memory/#2133-state-transitions">21.3.3 State Transitions</a></li>
          <li><a href="/docs/handbook/21-authority-memory/#2134-procedure-entry-state">21.3.4 Procedure Entry State</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/21-authority-memory/#214-regions-frames-and-provenance-64">21.4 Regions, Frames, and Provenance (§6.4)</a>
        <ol>
          <li><a href="/docs/handbook/21-authority-memory/#2141-region-options">21.4.1 Region Options</a></li>
          <li><a href="/docs/handbook/21-authority-memory/#2142-the-region-statement-the-frame-statement-and-region-allocation">21.4.2 The region Statement, the frame Statement, and Region Allocation</a></li>
          <li><a href="/docs/handbook/21-authority-memory/#2143-provenance-tags-and-lifetime-order">21.4.3 Provenance Tags and Lifetime Order</a></li>
          <li><a href="/docs/handbook/21-authority-memory/#2144-the-region-modal-type-and-its-procedures">21.4.4 The Region Modal Type and Its Procedures</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/21-authority-memory/#215-dynamic-scope-stack-bindings-and-region-runtime-65">21.5 Dynamic Scope Stack, Bindings, and Region Runtime (§6.5)</a>
        <ol>
          <li><a href="/docs/handbook/21-authority-memory/#2151-dynamic-scope-stack-and-binding-store">21.5.1 Dynamic Scope Stack and Binding Store</a></li>
          <li><a href="/docs/handbook/21-authority-memory/#2152-region-stack-and-arenas">21.5.2 Region Stack and Arenas</a></li>
          <li><a href="/docs/handbook/21-authority-memory/#2153-address-state-and-pointer-expiry">21.5.3 Address State and Pointer Expiry</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/21-authority-memory/#216-runtime-state-and-memory-diagnostics-66">21.6 Runtime State and Memory Diagnostics (§6.6)</a></li>
      <li><a href="/docs/handbook/21-authority-memory/#idioms--best-practices">Idioms &amp; Best Practices</a></li>
      <li><a href="/docs/handbook/21-authority-memory/#pitfalls--diagnostics">Pitfalls &amp; Diagnostics</a></li>
    </ol>
  </details>
</li>
<li>
  <details open>
    <summary><a href="/docs/handbook/22-attributes-tests/">22. Attributes, Metadata &amp; Source-Native Tests</a></summary>
    <ol>
      <li><a href="/docs/handbook/22-attributes-tests/#221-attribute-syntax-and-placement-91">22.1 Attribute Syntax and Placement (§9.1)</a>
        <ol>
          <li><a href="/docs/handbook/22-attributes-tests/#2211-the-attribute-grammar">22.1.1 The attribute grammar</a></li>
          <li><a href="/docs/handbook/22-attributes-tests/#2212-placement">22.1.2 Placement</a></li>
          <li><a href="/docs/handbook/22-attributes-tests/#2213-well-formedness">22.1.3 Well-formedness</a></li>
          <li><a href="/docs/handbook/22-attributes-tests/#2214-worked-example">22.1.4 Worked example</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/22-attributes-tests/#222-vendor-attributes-92">22.2 Vendor Attributes (§9.2)</a></li>
      <li><a href="/docs/handbook/22-attributes-tests/#223-layout-attributes-93">22.3 Layout Attributes (§9.3)</a>
        <ol>
          <li><a href="/docs/handbook/22-attributes-tests/#2231-syntax">22.3.1 Syntax</a></li>
          <li><a href="/docs/handbook/22-attributes-tests/#2232-the-layout-kinds">22.3.2 The layout kinds</a></li>
          <li><a href="/docs/handbook/22-attributes-tests/#2233-valid-and-invalid-combinations">22.3.3 Valid and invalid combinations</a></li>
          <li><a href="/docs/handbook/22-attributes-tests/#2234-worked-example">22.3.4 Worked example</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/22-attributes-tests/#224-optimization-attributes-94">22.4 Optimization Attributes (§9.4)</a>
        <ol>
          <li><a href="/docs/handbook/22-attributes-tests/#2241-syntax">22.4.1 Syntax</a></li>
          <li><a href="/docs/handbook/22-attributes-tests/#2242-semantics">22.4.2 Semantics</a></li>
          <li><a href="/docs/handbook/22-attributes-tests/#2243-worked-example">22.4.3 Worked example</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/22-attributes-tests/#225-diagnostics-and-metadata-attributes-95">22.5 Diagnostics and Metadata Attributes (§9.5)</a>
        <ol>
          <li><a href="/docs/handbook/22-attributes-tests/#2251-deprecated">22.5.1 #deprecated</a></li>
          <li><a href="/docs/handbook/22-attributes-tests/#2252-dynamic--runtime-verification-scope">22.5.2 #dynamic — runtime verification scope</a></li>
          <li><a href="/docs/handbook/22-attributes-tests/#2253-stale_ok">22.5.3 #stale_ok</a></li>
          <li><a href="/docs/handbook/22-attributes-tests/#2254-static--verification-mode">22.5.4 #static — verification mode</a></li>
          <li><a href="/docs/handbook/22-attributes-tests/#2255-phase-2-attributes-reflect-derive-emit-files">22.5.5 Phase-2 attributes: #reflect, #derive, #emit, #files</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/22-attributes-tests/#226-source-native-test-attributes-96">22.6 Source-Native Test Attributes (§9.6)</a>
        <ol>
          <li><a href="/docs/handbook/22-attributes-tests/#2261-syntax">22.6.1 Syntax</a></li>
          <li><a href="/docs/handbook/22-attributes-tests/#2262-identity-and-coverage">22.6.2 Identity and coverage</a></li>
          <li><a href="/docs/handbook/22-attributes-tests/#2263-argument-well-formedness">22.6.3 Argument well-formedness</a></li>
          <li><a href="/docs/handbook/22-attributes-tests/#2264-required-test-procedure-shape">22.6.4 Required test-procedure shape</a></li>
          <li><a href="/docs/handbook/22-attributes-tests/#2265-the-testauthority-parameter">22.6.5 The TestAuthority parameter</a></li>
          <li><a href="/docs/handbook/22-attributes-tests/#2266-pass--fail--error-semantics">22.6.6 Pass / fail / error semantics</a></li>
          <li><a href="/docs/handbook/22-attributes-tests/#2267-how-uv-test-discovers-and-runs-tests">22.6.7 How uv test discovers and runs tests</a></li>
          <li><a href="/docs/handbook/22-attributes-tests/#2268-complete-test-example">22.6.8 Complete #test example</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/22-attributes-tests/#idioms--best-practices">Idioms &amp; Best Practices</a></li>
      <li><a href="/docs/handbook/22-attributes-tests/#pitfalls--diagnostics">Pitfalls &amp; Diagnostics</a></li>
    </ol>
  </details>
</li>
<li>
  <details open>
    <summary><a href="/docs/handbook/23-key-system/">23. The Key System: Shared-Memory Concurrency</a></summary>
    <ol>
      <li><a href="/docs/handbook/23-key-system/#231-why-keys-replace-runtime-mutexes">23.1 Why Keys Replace Runtime Mutexes</a></li>
      <li><a href="/docs/handbook/23-key-system/#232-key-paths-191">23.2 Key Paths (§19.1)</a>
        <ol>
          <li><a href="/docs/handbook/23-key-system/#2321-key-path-syntax">23.2.1 Key-Path Syntax</a></li>
          <li><a href="/docs/handbook/23-key-system/#2322-path-well-formedness">23.2.2 Path Well-Formedness</a></li>
          <li><a href="/docs/handbook/23-key-system/#2323-path-root-extraction-and-boundaries">23.2.3 Path Root Extraction and Boundaries</a></li>
          <li><a href="/docs/handbook/23-key-system/#2324-key-coarsening-with-">23.2.4 Key Coarsening with #</a></li>
          <li><a href="/docs/handbook/23-key-system/#2325-shared-dynamic-class-objects">23.2.5 shared Dynamic Class Objects</a></li>
          <li><a href="/docs/handbook/23-key-system/#2326-worked-example--key-paths-and-coarsening">23.2.6 Worked Example — Key Paths and Coarsening</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/23-key-system/#233-key-acquisition-blocks-192">23.3 Key Acquisition Blocks (§19.2)</a>
        <ol>
          <li><a href="/docs/handbook/23-key-system/#2331-key-block-syntax">23.3.1 Key-Block Syntax</a></li>
          <li><a href="/docs/handbook/23-key-system/#2332-key-triples-modes-and-mode-ordering">23.3.2 Key Triples, Modes, and Mode Ordering</a></li>
          <li><a href="/docs/handbook/23-key-system/#2333-coverage-and-implicit-acquisition">23.3.3 Coverage and Implicit Acquisition</a></li>
          <li><a href="/docs/handbook/23-key-system/#2334-explicit-block-acquisition-and-canonical-order">23.3.4 Explicit Block Acquisition and Canonical Order</a></li>
          <li><a href="/docs/handbook/23-key-system/#2335-scope-bound-release-and-escape-rules">23.3.5 Scope-Bound Release and Escape Rules</a></li>
          <li><a href="/docs/handbook/23-key-system/#2336-closure-capture-of-shared-bindings">23.3.6 Closure Capture of shared Bindings</a></li>
          <li><a href="/docs/handbook/23-key-system/#2337-worked-example--a-write-block-over-two-paths">23.3.7 Worked Example — A %write Block over Two Paths</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/23-key-system/#234-conflict-detection-193">23.4 Conflict Detection (§19.3)</a>
        <ol>
          <li><a href="/docs/handbook/23-key-system/#2341-prefix-disjointness-and-overlap">23.4.1 Prefix, Disjointness, and Overlap</a></li>
          <li><a href="/docs/handbook/23-key-system/#2342-mode-compatibility-and-the-conflict-relation">23.4.2 Mode Compatibility and the Conflict Relation</a></li>
          <li><a href="/docs/handbook/23-key-system/#2343-canonical-ordering">23.4.3 Canonical Ordering</a></li>
          <li><a href="/docs/handbook/23-key-system/#2344-dynamic-index-conflicts-and-read-then-write">23.4.4 Dynamic-Index Conflicts and Read-Then-Write</a></li>
          <li><a href="/docs/handbook/23-key-system/#2345-the-ordered-option">23.4.5 The ordered Option</a></li>
          <li><a href="/docs/handbook/23-key-system/#2346-worked-example--disjoint-indices-and-a-covering-write">23.4.6 Worked Example — Disjoint Indices and a Covering Write</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/23-key-system/#235-nested-release-194">23.5 Nested Release (§19.4)</a>
        <ol>
          <li><a href="/docs/handbook/23-key-system/#2351-semantics-of-release">23.5.1 Semantics of %release</a></li>
          <li><a href="/docs/handbook/23-key-system/#2352-the-mode-change-rule">23.5.2 The Mode-Change Rule</a></li>
          <li><a href="/docs/handbook/23-key-system/#2353-reentrancy-through-shared-parameters">23.5.3 Reentrancy Through shared Parameters</a></li>
          <li><a href="/docs/handbook/23-key-system/#2354-worked-example--downgrade-to-read-during-a-long-scan">23.5.4 Worked Example — Downgrade to Read During a Long Scan</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/23-key-system/#236-speculative-execution-195">23.6 Speculative Execution (§19.5)</a>
        <ol>
          <li><a href="/docs/handbook/23-key-system/#2361-speculative-block-syntax">23.6.1 Speculative-Block Syntax</a></li>
          <li><a href="/docs/handbook/23-key-system/#2362-body-restrictions">23.6.2 Body Restrictions</a></li>
          <li><a href="/docs/handbook/23-key-system/#2363-the-speculative-state-machine">23.6.3 The Speculative State Machine</a></li>
          <li><a href="/docs/handbook/23-key-system/#2364-worked-example--a-speculative-counter-bump">23.6.4 Worked Example — A Speculative Counter Bump</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/23-key-system/#237-dynamic-key-verification-196">23.7 Dynamic Key Verification (§19.6)</a>
        <ol>
          <li><a href="/docs/handbook/23-key-system/#2371-static-safety-conditions">23.7.1 Static Safety Conditions</a></li>
          <li><a href="/docs/handbook/23-key-system/#2372-static-vs-dynamic-outcomes">23.7.2 Static vs. Dynamic Outcomes</a></li>
          <li><a href="/docs/handbook/23-key-system/#2373-runtime-synchronization-guarantees">23.7.3 Runtime Synchronization Guarantees</a></li>
          <li><a href="/docs/handbook/23-key-system/#2374-worked-example--dynamic-for-data-dependent-indices">23.7.4 Worked Example — #dynamic for Data-Dependent Indices</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/23-key-system/#238-memory-ordering-197">23.8 Memory Ordering (§19.7)</a>
        <ol>
          <li><a href="/docs/handbook/23-key-system/#2381-memory-order-syntax">23.8.1 Memory-Order Syntax</a></li>
          <li><a href="/docs/handbook/23-key-system/#2382-ordering-levels-and-effective-ordering">23.8.2 Ordering Levels and Effective Ordering</a></li>
          <li><a href="/docs/handbook/23-key-system/#2383-fences">23.8.3 Fences</a></li>
          <li><a href="/docs/handbook/23-key-system/#2384-the-happens-before-model-and-key-transfer-visibility">23.8.4 The Happens-Before Model and Key-Transfer Visibility</a></li>
          <li><a href="/docs/handbook/23-key-system/#2385-worked-example--a-release-fence-around-a-handoff">23.8.5 Worked Example — A Release Fence Around a Handoff</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/23-key-system/#239-key-propagation-and-the-static-replacement-of-mutexes">23.9 Key Propagation and the Static Replacement of Mutexes</a></li>
      <li><a href="/docs/handbook/23-key-system/#2310-capstone-worked-example--a-guarded-shared-counter">23.10 Capstone Worked Example — A Guarded Shared Counter</a></li>
      <li><a href="/docs/handbook/23-key-system/#idioms--best-practices">Idioms &amp; Best Practices</a></li>
      <li><a href="/docs/handbook/23-key-system/#pitfalls--diagnostics">Pitfalls &amp; Diagnostics</a></li>
    </ol>
  </details>
</li>
<li>
  <details open>
    <summary><a href="/docs/handbook/24-parallelism/">24. Structured Parallelism</a></summary>
    <ol>
      <li><a href="/docs/handbook/24-parallelism/#241-parallel-blocks-201">24.1 Parallel Blocks (§20.1)</a>
        <ol>
          <li><a href="/docs/handbook/24-parallelism/#2411-syntax">24.1.1 Syntax</a></li>
          <li><a href="/docs/handbook/24-parallelism/#2412-options-and-their-static-requirements-2014">24.1.2 Options and their static requirements (§20.1.4)</a></li>
          <li><a href="/docs/handbook/24-parallelism/#2413-static-semantics-2014">24.1.3 Static semantics (§20.1.4)</a></li>
          <li><a href="/docs/handbook/24-parallelism/#2414-dynamic-semantics-fork-join-2015">24.1.4 Dynamic semantics: fork-join (§20.1.5)</a></li>
          <li><a href="/docs/handbook/24-parallelism/#2415-worked-example">24.1.5 Worked example</a></li>
          <li><a href="/docs/handbook/24-parallelism/#2416-diagnostics-2017">24.1.6 Diagnostics (§20.1.7)</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/24-parallelism/#242-execution-domains-202">24.2 Execution Domains (§20.2)</a>
        <ol>
          <li><a href="/docs/handbook/24-parallelism/#2421-syntax-and-constructors">24.2.1 Syntax and constructors</a></li>
          <li><a href="/docs/handbook/24-parallelism/#2422-domain-behaviors">24.2.2 Domain behaviors</a></li>
          <li><a href="/docs/handbook/24-parallelism/#2423-gpu-intrinsics-memory-and-safety">24.2.3 GPU intrinsics, memory, and safety</a></li>
          <li><a href="/docs/handbook/24-parallelism/#2424-domain-example">24.2.4 Domain example</a></li>
          <li><a href="/docs/handbook/24-parallelism/#2425-diagnostics-2027">24.2.5 Diagnostics (§20.2.7)</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/24-parallelism/#243-capture-semantics-203">24.3 Capture Semantics (§20.3)</a>
        <ol>
          <li><a href="/docs/handbook/24-parallelism/#2431-cpu-capture-rules-2034">24.3.1 CPU capture rules (§20.3.4)</a></li>
          <li><a href="/docs/handbook/24-parallelism/#2432-gpu-capture-rules-2034">24.3.2 GPU capture rules (§20.3.4)</a></li>
          <li><a href="/docs/handbook/24-parallelism/#2433-capture-example">24.3.3 Capture example</a></li>
          <li><a href="/docs/handbook/24-parallelism/#2434-diagnostics-2037">24.3.4 Diagnostics (§20.3.7)</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/24-parallelism/#244-spawn-spawnedt-and-wait-204-212">24.4 Spawn, Spawned&lt;T&gt;, and Wait (§20.4, §21.2)</a>
        <ol>
          <li><a href="/docs/handbook/24-parallelism/#2441-spawn-syntax-2041">24.4.1 Spawn syntax (§20.4.1)</a></li>
          <li><a href="/docs/handbook/24-parallelism/#2442-spawn-options-and-typing-2044">24.4.2 Spawn options and typing (§20.4.4)</a></li>
          <li><a href="/docs/handbook/24-parallelism/#2443-the-spawnedt-modal-1314">24.4.3 The Spawned&lt;T&gt; modal (§13.1.4)</a></li>
          <li><a href="/docs/handbook/24-parallelism/#2444-spawn-dynamic-semantics-2045">24.4.4 Spawn dynamic semantics (§20.4.5)</a></li>
          <li><a href="/docs/handbook/24-parallelism/#2445-wait-212">24.4.5 Wait (§21.2)</a></li>
          <li><a href="/docs/handbook/24-parallelism/#2446-spawnwait-example">24.4.6 Spawn/wait example</a></li>
          <li><a href="/docs/handbook/24-parallelism/#2447-diagnostics-2047-2127-2157">24.4.7 Diagnostics (§20.4.7, §21.2.7, §21.5.7)</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/24-parallelism/#245-dispatch--parallel-loops-205">24.5 Dispatch — Parallel Loops (§20.5)</a>
        <ol>
          <li><a href="/docs/handbook/24-parallelism/#2451-syntax-2051">24.5.1 Syntax (§20.5.1)</a></li>
          <li><a href="/docs/handbook/24-parallelism/#2452-typing-2054">24.5.2 Typing (§20.5.4)</a></li>
          <li><a href="/docs/handbook/24-parallelism/#2453-dependency-safety-and-key-inference-2054">24.5.3 Dependency safety and key inference (§20.5.4)</a></li>
          <li><a href="/docs/handbook/24-parallelism/#2454-reduction-ordering-and-chunking-2054">24.5.4 Reduction, ordering, and chunking (§20.5.4)</a></li>
          <li><a href="/docs/handbook/24-parallelism/#2455-dispatch-dynamic-semantics-2055">24.5.5 Dispatch dynamic semantics (§20.5.5)</a></li>
          <li><a href="/docs/handbook/24-parallelism/#2456-dispatch-examples">24.5.6 Dispatch examples</a></li>
          <li><a href="/docs/handbook/24-parallelism/#2457-diagnostics-2057-209">24.5.7 Diagnostics (§20.5.7, §20.9)</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/24-parallelism/#246-cancellation-206">24.6 Cancellation (§20.6)</a>
        <ol>
          <li><a href="/docs/handbook/24-parallelism/#2461-the-canceltoken-modal-2063-2064">24.6.1 The CancelToken modal (§20.6.3, §20.6.4)</a></li>
          <li><a href="/docs/handbook/24-parallelism/#2462-attaching-and-propagating-2065">24.6.2 Attaching and propagating (§20.6.5)</a></li>
          <li><a href="/docs/handbook/24-parallelism/#2463-cancellation-example">24.6.3 Cancellation example</a></li>
          <li><a href="/docs/handbook/24-parallelism/#2464-diagnostics-2067">24.6.4 Diagnostics (§20.6.7)</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/24-parallelism/#247-panic-handling-across-tasks-207">24.7 Panic Handling Across Tasks (§20.7)</a>
        <ol>
          <li><a href="/docs/handbook/24-parallelism/#2471-semantics-2075">24.7.1 Semantics (§20.7.5)</a></li>
          <li><a href="/docs/handbook/24-parallelism/#2472-panic-handling-example">24.7.2 Panic-handling example</a></li>
          <li><a href="/docs/handbook/24-parallelism/#2473-diagnostics-2077">24.7.3 Diagnostics (§20.7.7)</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/24-parallelism/#248-determinism-and-nesting-208">24.8 Determinism and Nesting (§20.8)</a>
        <ol>
          <li><a href="/docs/handbook/24-parallelism/#2481-determinism-2084-2085">24.8.1 Determinism (§20.8.4, §20.8.5)</a></li>
          <li><a href="/docs/handbook/24-parallelism/#2482-nesting-2084-2085">24.8.2 Nesting (§20.8.4, §20.8.5)</a></li>
          <li><a href="/docs/handbook/24-parallelism/#2483-nesting-example">24.8.3 Nesting example</a></li>
          <li><a href="/docs/handbook/24-parallelism/#2484-diagnostics-2087">24.8.4 Diagnostics (§20.8.7)</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/24-parallelism/#249-worked-structured-concurrency-example">24.9 Worked Structured-Concurrency Example</a></li>
      <li><a href="/docs/handbook/24-parallelism/#idioms--best-practices">Idioms &amp; Best Practices</a></li>
      <li><a href="/docs/handbook/24-parallelism/#pitfalls--diagnostics">Pitfalls &amp; Diagnostics</a></li>
    </ol>
  </details>
</li>
<li>
  <details open>
    <summary><a href="/docs/handbook/25-async/">25. Asynchronous Operations</a></summary>
    <ol>
      <li><a href="/docs/handbook/25-async/#251-the-async-type">25.1 The Async Type</a>
        <ol>
          <li><a href="/docs/handbook/25-async/#2511-the-four-type-parameters">25.1.1 The four type parameters</a></li>
          <li><a href="/docs/handbook/25-async/#2512-the-three-states">25.1.2 The three states</a></li>
          <li><a href="/docs/handbook/25-async/#2513-syntax-and-parsing">25.1.3 Syntax and parsing</a></li>
          <li><a href="/docs/handbook/25-async/#2514-built-in-aliases">25.1.4 Built-in aliases</a></li>
          <li><a href="/docs/handbook/25-async/#2515-asyncsig--the-normalization-that-drives-every-async-rule">25.1.5 AsyncSig — the normalization that drives every async rule</a></li>
          <li><a href="/docs/handbook/25-async/#2516-subtyping-and-variance">25.1.6 Subtyping and variance</a></li>
          <li><a href="/docs/handbook/25-async/#2517-well-formedness-and-diagnostics">25.1.7 Well-formedness and diagnostics</a></li>
          <li><a href="/docs/handbook/25-async/#2518-worked-example--declaring-async-procedures">25.1.8 Worked example — declaring async procedures</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/25-async/#252-suspension-forms">25.2 Suspension Forms</a>
        <ol>
          <li><a href="/docs/handbook/25-async/#2521-wait--awaiting-a-handle">25.2.1 wait — awaiting a handle</a></li>
          <li><a href="/docs/handbook/25-async/#2522-yield--suspending-the-current-async-computation">25.2.2 yield — suspending the current async computation</a></li>
          <li><a href="/docs/handbook/25-async/#2523-yield-from--delegating-to-another-async-value">25.2.3 yield from — delegating to another async value</a></li>
          <li><a href="/docs/handbook/25-async/#2524-key-restrictions">25.2.4 Key restrictions</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/25-async/#253-composition-forms">25.3 Composition Forms</a>
        <ol>
          <li><a href="/docs/handbook/25-async/#2531-async-iteration--loop-pat-in-async">25.3.1 Async iteration — loop pat in async</a></li>
          <li><a href="/docs/handbook/25-async/#2532-manual-stepping">25.3.2 Manual stepping</a></li>
          <li><a href="/docs/handbook/25-async/#2533-sync--driving-an-async-to-completion-synchronously">25.3.3 sync — driving an async to completion synchronously</a></li>
          <li><a href="/docs/handbook/25-async/#2534-race--first-to-settle-wins">25.3.4 race — first-to-settle wins</a></li>
          <li><a href="/docs/handbook/25-async/#2535-all--join-all-results">25.3.5 all — join all results</a></li>
          <li><a href="/docs/handbook/25-async/#2536-the-async-combinators">25.3.6 The async combinators</a></li>
          <li><a href="/docs/handbook/25-async/#2537-until--a-source-specified-surface-on-shared-values">25.3.7 until — a source-specified surface on shared values</a></li>
          <li><a href="/docs/handbook/25-async/#2538-composition-diagnostics">25.3.8 Composition diagnostics</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/25-async/#254-the-async-state-machine-model">25.4 The Async State Machine Model</a>
        <ol>
          <li><a href="/docs/handbook/25-async/#2541-what-async-procedure-means-structurally">25.4.1 What &quot;async procedure&quot; means structurally</a></li>
          <li><a href="/docs/handbook/25-async/#2542-the-async-frame">25.4.2 The async frame</a></li>
          <li><a href="/docs/handbook/25-async/#2543-settlement--how-the-three-states-are-produced">25.4.3 Settlement — how the three states are produced</a></li>
          <li><a href="/docs/handbook/25-async/#2544-error-propagation-inside-async-procedures">25.4.4 Error propagation inside async procedures</a></li>
          <li><a href="/docs/handbook/25-async/#2545-capture-and-escape-provenance">25.4.5 Capture and escape provenance</a></li>
          <li><a href="/docs/handbook/25-async/#2546-lowering-informative">25.4.6 Lowering (informative)</a></li>
          <li><a href="/docs/handbook/25-async/#2547-state-machine-diagnostics">25.4.7 State-machine diagnostics</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/25-async/#255-asynckey-integration">25.5 Async–Key Integration</a>
        <ol>
          <li><a href="/docs/handbook/25-async/#2551-the-three-key-restrictions">25.5.1 The three key restrictions</a></li>
          <li><a href="/docs/handbook/25-async/#2552-yield-release--suspend-while-holding-keys">25.5.2 yield release — suspend while holding keys</a></li>
          <li><a href="/docs/handbook/25-async/#2553-shared-capturing-closures-with-yield">25.5.3 Shared-capturing closures with yield</a></li>
          <li><a href="/docs/handbook/25-async/#2554-staleness-across-yield-release">25.5.4 Staleness across yield release</a></li>
          <li><a href="/docs/handbook/25-async/#2555-async-capability-requirements">25.5.5 Async capability requirements</a></li>
          <li><a href="/docs/handbook/25-async/#2556-asynckey-diagnostics">25.5.6 Async–key diagnostics</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/25-async/#idioms--best-practices">Idioms &amp; Best Practices</a></li>
      <li><a href="/docs/handbook/25-async/#pitfalls--diagnostics">Pitfalls &amp; Diagnostics</a></li>
    </ol>
  </details>
</li>
<li>
  <details open>
    <summary><a href="/docs/handbook/26-comptime-meta/">26. Compile-Time Execution &amp; Metaprogramming</a></summary>
    <ol>
      <li><a href="/docs/handbook/26-comptime-meta/#261-compile-time-forms-221">26.1 Compile-Time Forms (§22.1)</a>
        <ol>
          <li><a href="/docs/handbook/26-comptime-meta/#2611-exact-syntax">26.1.1 Exact Syntax</a></li>
          <li><a href="/docs/handbook/26-comptime-meta/#2612-what-may-run-at-compile-time">26.1.2 What May Run at Compile Time</a></li>
          <li><a href="/docs/handbook/26-comptime-meta/#2613-comptime-statement-and-comptime-expression">26.1.3 comptime Statement and comptime Expression</a></li>
          <li><a href="/docs/handbook/26-comptime-meta/#2614-comptime-if">26.1.4 comptime if</a></li>
          <li><a href="/docs/handbook/26-comptime-meta/#2615-comptime-loop">26.1.5 comptime loop</a></li>
          <li><a href="/docs/handbook/26-comptime-meta/#2616-compile-time-procedures">26.1.6 Compile-Time Procedures</a></li>
          <li><a href="/docs/handbook/26-comptime-meta/#2617-phase-2-execution-order-and-emission-visibility">26.1.7 Phase 2 Execution Order and Emission Visibility</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/26-comptime-meta/#262-compile-time-capabilities-222">26.2 Compile-Time Capabilities (§22.2)</a>
        <ol>
          <li><a href="/docs/handbook/26-comptime-meta/#2621-availability">26.2.1 Availability</a></li>
          <li><a href="/docs/handbook/26-comptime-meta/#2622-typeemitter">26.2.2 TypeEmitter</a></li>
          <li><a href="/docs/handbook/26-comptime-meta/#2623-introspect">26.2.3 Introspect</a></li>
          <li><a href="/docs/handbook/26-comptime-meta/#2624-projectfiles">26.2.4 ProjectFiles</a></li>
          <li><a href="/docs/handbook/26-comptime-meta/#2625-comptimediagnostics">26.2.5 ComptimeDiagnostics</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/26-comptime-meta/#263-reflection-223">26.3 Reflection (§22.3)</a>
        <ol>
          <li><a href="/docs/handbook/26-comptime-meta/#2631-the-typet-literal">26.3.1 The Type::&lt;T&gt; Literal</a></li>
          <li><a href="/docs/handbook/26-comptime-meta/#2632-categories">26.3.2 Categories</a></li>
          <li><a href="/docs/handbook/26-comptime-meta/#2633-reflectability">26.3.3 Reflectability</a></li>
          <li><a href="/docs/handbook/26-comptime-meta/#2634-member-queries">26.3.4 Member Queries</a></li>
          <li><a href="/docs/handbook/26-comptime-meta/#2635-type-predicates-and-names">26.3.5 Type Predicates and Names</a></li>
          <li><a href="/docs/handbook/26-comptime-meta/#2636-worked-example">26.3.6 Worked Example</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/26-comptime-meta/#264-quote-splice-and-emission-224">26.4 Quote, Splice, and Emission (§22.4)</a>
        <ol>
          <li><a href="/docs/handbook/26-comptime-meta/#2641-exact-syntax">26.4.1 Exact Syntax</a></li>
          <li><a href="/docs/handbook/26-comptime-meta/#2642-quote-kind-resolution">26.4.2 Quote Kind Resolution</a></li>
          <li><a href="/docs/handbook/26-comptime-meta/#2643-splicing-rules">26.4.3 Splicing Rules</a></li>
          <li><a href="/docs/handbook/26-comptime-meta/#2644-hygiene">26.4.4 Hygiene</a></li>
          <li><a href="/docs/handbook/26-comptime-meta/#2645-emission">26.4.5 Emission</a></li>
          <li><a href="/docs/handbook/26-comptime-meta/#2646-worked-example">26.4.6 Worked Example</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/26-comptime-meta/#265-derive-targets-and-contracts-225">26.5 Derive Targets and Contracts (§22.5)</a>
        <ol>
          <li><a href="/docs/handbook/26-comptime-meta/#2651-exact-syntax">26.5.1 Exact Syntax</a></li>
          <li><a href="/docs/handbook/26-comptime-meta/#2652-validity-and-bindings">26.5.2 Validity and Bindings</a></li>
          <li><a href="/docs/handbook/26-comptime-meta/#2653-derive-contracts-and-ordering">26.5.3 Derive Contracts and Ordering</a></li>
          <li><a href="/docs/handbook/26-comptime-meta/#2654-execution-semantics">26.5.4 Execution Semantics</a></li>
          <li><a href="/docs/handbook/26-comptime-meta/#2655-worked-example">26.5.5 Worked Example</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/26-comptime-meta/#266-idioms--best-practices">26.6 Idioms &amp; Best Practices</a></li>
      <li><a href="/docs/handbook/26-comptime-meta/#267-pitfalls--diagnostics">26.7 Pitfalls &amp; Diagnostics</a></li>
    </ol>
  </details>
</li>
<li>
  <details open>
    <summary><a href="/docs/handbook/27-ffi/">27. Foreign Function Interface (FFI)</a></summary>
    <ol>
      <li><a href="/docs/handbook/27-ffi/#271-ffisafe--which-types-may-cross-the-boundary">27.1 FfiSafe — Which Types May Cross the Boundary</a>
        <ol>
          <li><a href="/docs/handbook/27-ffi/#2711-the-ffi-safe-primitive-set">27.1.1 The FFI-safe primitive set</a></li>
          <li><a href="/docs/handbook/27-ffi/#2712-compound-ffi-safe-types">27.1.2 Compound FFI-safe types</a></li>
          <li><a href="/docs/handbook/27-ffi/#2713-prohibited-type-categories">27.1.3 Prohibited type categories</a></li>
          <li><a href="/docs/handbook/27-ffi/#2714-generic-bounds-and-the-by-value-raii-rule">27.1.4 Generic bounds and the by-value RAII rule</a></li>
          <li><a href="/docs/handbook/27-ffi/#2715-worked-example--an-ffi-safe-record-and-a-generic-ffi-safe-record">27.1.5 Worked example — an FFI-safe record and a generic FFI-safe record</a></li>
          <li><a href="/docs/handbook/27-ffi/#2716-diagnostics-2317">27.1.6 Diagnostics (§23.1.7)</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/27-ffi/#272-extern-procedures--calling-foreign-code">27.2 Extern Procedures — Calling Foreign Code</a>
        <ol>
          <li><a href="/docs/handbook/27-ffi/#2721-syntax">27.2.1 Syntax</a></li>
          <li><a href="/docs/handbook/27-ffi/#2722-abi-strings">27.2.2 ABI strings</a></li>
          <li><a href="/docs/handbook/27-ffi/#2723-signature-requirements">27.2.3 Signature requirements</a></li>
          <li><a href="/docs/handbook/27-ffi/#2724-call-safety">27.2.4 Call safety</a></li>
          <li><a href="/docs/handbook/27-ffi/#2725-dynamic-semantics">27.2.5 Dynamic semantics</a></li>
          <li><a href="/docs/handbook/27-ffi/#2726-worked-example--declaring-and-calling-a-c-function">27.2.6 Worked example — declaring and calling a C function</a></li>
          <li><a href="/docs/handbook/27-ffi/#2727-diagnostics-2327">27.2.7 Diagnostics (§23.2.7)</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/27-ffi/#273-foreign-callable-procedure-exports--exposing-ultraviolet-to-foreign-callers">27.3 Foreign-Callable Procedure Exports — Exposing Ultraviolet to Foreign Callers</a>
        <ol>
          <li><a href="/docs/handbook/27-ffi/#2731-raw-exported-procedures">27.3.1 Raw exported procedures</a>
            <ol>
              <li><a href="/docs/handbook/27-ffi/#worked-example--a-raw-export">Worked example — a raw export</a></li>
            </ol>
          </li>
          <li><a href="/docs/handbook/27-ffi/#2732-hosted-exports">27.3.2 Hosted exports</a>
            <ol>
              <li><a href="/docs/handbook/27-ffi/#worked-example--a-hosted-export">Worked example — a hosted export</a></li>
            </ol>
          </li>
          <li><a href="/docs/handbook/27-ffi/#2733-diagnostics-23317-23327">27.3.3 Diagnostics (§23.3.1.7, §23.3.2.7)</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/27-ffi/#274-ffi-attributes">27.4 FFI Attributes</a>
        <ol>
          <li><a href="/docs/handbook/27-ffi/#2741-syntax-2341">27.4.1 Syntax (§23.4.1)</a></li>
          <li><a href="/docs/handbook/27-ffi/#2742-mangle">27.4.2 #mangle</a></li>
          <li><a href="/docs/handbook/27-ffi/#2743-library">27.4.3 #library</a></li>
          <li><a href="/docs/handbook/27-ffi/#2744-unwind">27.4.4 #unwind</a></li>
          <li><a href="/docs/handbook/27-ffi/#2745-export-and-host_export">27.4.5 #export and #host_export</a></li>
          <li><a href="/docs/handbook/27-ffi/#2746-ffi_pass_by_value">27.4.6 #ffi_pass_by_value</a></li>
          <li><a href="/docs/handbook/27-ffi/#2747-diagnostics-2347">27.4.7 Diagnostics (§23.4.7)</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/27-ffi/#275-capability-isolation-across-the-ffi-boundary">27.5 Capability Isolation Across the FFI Boundary</a></li>
      <li><a href="/docs/handbook/27-ffi/#276-foreign-contracts">27.6 Foreign Contracts</a>
        <ol>
          <li><a href="/docs/handbook/27-ffi/#2761-syntax-2361">27.6.1 Syntax (§23.6.1)</a></li>
          <li><a href="/docs/handbook/27-ffi/#2762-foreign-preconditions--foreign_assumes">27.6.2 Foreign preconditions — @foreign_assumes</a></li>
          <li><a href="/docs/handbook/27-ffi/#2763-foreign-postconditions--foreign_ensures">27.6.3 Foreign postconditions — @foreign_ensures</a></li>
          <li><a href="/docs/handbook/27-ffi/#2764-worked-example--a-contract-bearing-extern">27.6.4 Worked example — a contract-bearing extern</a></li>
          <li><a href="/docs/handbook/27-ffi/#2765-diagnostics-2367">27.6.5 Diagnostics (§23.6.7)</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/27-ffi/#277-the-extern-block-shell-114">27.7 The extern Block Shell (§11.4)</a>
        <ol>
          <li><a href="/docs/handbook/27-ffi/#2771-syntax-1141">27.7.1 Syntax (§11.4.1)</a></li>
          <li><a href="/docs/handbook/27-ffi/#2772-semantics">27.7.2 Semantics</a></li>
          <li><a href="/docs/handbook/27-ffi/#2773-worked-example--a-complete-extern-block">27.7.3 Worked example — a complete extern block</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/27-ffi/#278-boundary-unwinding-and-panic-safety">27.8 Boundary Unwinding and Panic Safety</a>
        <ol>
          <li><a href="/docs/handbook/27-ffi/#2781-boundary-effects-2375">27.8.1 Boundary effects (§23.7.5)</a></li>
          <li><a href="/docs/handbook/27-ffi/#2782-code-generation-2376">27.8.2 Code generation (§23.7.6)</a></li>
          <li><a href="/docs/handbook/27-ffi/#2783-worked-example--a-panic-safe-export">27.8.3 Worked example — a panic-safe export</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/27-ffi/#idioms--best-practices">Idioms &amp; Best Practices</a></li>
      <li><a href="/docs/handbook/27-ffi/#pitfalls--diagnostics">Pitfalls &amp; Diagnostics</a></li>
    </ol>
  </details>
</li>
<li>
  <details open>
    <summary><a href="/docs/handbook/28-lifecycle-abi/">28. Program Lifecycle, Drop, ABI &amp; Runtime</a></summary>
    <ol>
      <li><a href="/docs/handbook/28-lifecycle-abi/#281-the-target-profile">28.1 The Target Profile</a></li>
      <li><a href="/docs/handbook/28-lifecycle-abi/#282-layout--abi-essentials">28.2 Layout &amp; ABI Essentials</a>
        <ol>
          <li><a href="/docs/handbook/28-lifecycle-abi/#2821-primitive-sizes-and-alignments">28.2.1 Primitive Sizes and Alignments</a></li>
          <li><a href="/docs/handbook/28-lifecycle-abi/#2822-default-calling-convention">28.2.2 Default Calling Convention</a></li>
          <li><a href="/docs/handbook/28-lifecycle-abi/#2823-parameter-and-return-passing">28.2.3 Parameter and Return Passing</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/28-lifecycle-abi/#283-symbols-mangling--linkage">28.3 Symbols, Mangling &amp; Linkage</a>
        <ol>
          <li><a href="/docs/handbook/28-lifecycle-abi/#2831-how-names-are-produced">28.3.1 How names are produced</a></li>
          <li><a href="/docs/handbook/28-lifecycle-abi/#2832-linkage">28.3.2 Linkage</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/28-lifecycle-abi/#284-initialization--program-lifecycle">28.4 Initialization &amp; Program Lifecycle</a>
        <ol>
          <li><a href="/docs/handbook/28-lifecycle-abi/#2841-the-main-entry-contract">28.4.1 The main entry contract</a></li>
          <li><a href="/docs/handbook/28-lifecycle-abi/#2842-the-entry-stub-and-startup-sequence">28.4.2 The entry stub and startup sequence</a></li>
          <li><a href="/docs/handbook/28-lifecycle-abi/#2843-static-globals-and-initialization-order">28.4.3 Static globals and initialization order</a></li>
          <li><a href="/docs/handbook/28-lifecycle-abi/#2844-initialization-panics-and-poisoning">28.4.4 Initialization panics and poisoning</a></li>
          <li><a href="/docs/handbook/28-lifecycle-abi/#2845-the-panic-out-parameter">28.4.5 The panic-out parameter</a></li>
          <li><a href="/docs/handbook/28-lifecycle-abi/#2846-interpreter-and-library-lifecycles">28.4.6 Interpreter and library lifecycles</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/28-lifecycle-abi/#285-cleanup-drop--unwinding">28.5 Cleanup, Drop &amp; Unwinding</a>
        <ol>
          <li><a href="/docs/handbook/28-lifecycle-abi/#2851-what-drop-means">28.5.1 What &quot;drop&quot; means</a></li>
          <li><a href="/docs/handbook/28-lifecycle-abi/#2852-drop-order">28.5.2 Drop order</a></li>
          <li><a href="/docs/handbook/28-lifecycle-abi/#2853-defer">28.5.3 defer</a></li>
          <li><a href="/docs/handbook/28-lifecycle-abi/#2854-the-cleanup-driver-panics-during-cleanup-and-abort">28.5.4 The cleanup driver, panics during cleanup, and abort</a></li>
          <li><a href="/docs/handbook/28-lifecycle-abi/#2855-static-teardown">28.5.5 Static teardown</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/28-lifecycle-abi/#286-temporary-cleanup">28.6 Temporary Cleanup</a></li>
      <li><a href="/docs/handbook/28-lifecycle-abi/#287-the-runtime-interface">28.7 The Runtime Interface</a></li>
      <li><a href="/docs/handbook/28-lifecycle-abi/#288-backend-requirements-reference-level">28.8 Backend Requirements (Reference Level)</a></li>
      <li><a href="/docs/handbook/28-lifecycle-abi/#idioms--best-practices">Idioms &amp; Best Practices</a></li>
      <li><a href="/docs/handbook/28-lifecycle-abi/#pitfalls--diagnostics">Pitfalls &amp; Diagnostics</a></li>
    </ol>
  </details>
</li>
<li>
  <details open>
    <summary><a href="/docs/handbook/29-grammar-reference/">29. Complete Grammar Reference</a></summary>
    <ol>
      <li><a href="/docs/handbook/29-grammar-reference/#291-b1--lexical-grammar">29.1 B.1 — Lexical Grammar</a></li>
      <li><a href="/docs/handbook/29-grammar-reference/#292-b2--type-grammar">29.2 B.2 — Type Grammar</a></li>
      <li><a href="/docs/handbook/29-grammar-reference/#293-b3--expression-grammar">29.3 B.3 — Expression Grammar</a></li>
      <li><a href="/docs/handbook/29-grammar-reference/#294-b4--pattern-grammar">29.4 B.4 — Pattern Grammar</a></li>
      <li><a href="/docs/handbook/29-grammar-reference/#295-b5--statement-grammar">29.5 B.5 — Statement Grammar</a></li>
      <li><a href="/docs/handbook/29-grammar-reference/#296-b6--declaration-grammar">29.6 B.6 — Declaration Grammar</a></li>
      <li><a href="/docs/handbook/29-grammar-reference/#297-b7--contract-grammar">29.7 B.7 — Contract Grammar</a></li>
      <li><a href="/docs/handbook/29-grammar-reference/#298-b8--attribute-grammar">29.8 B.8 — Attribute Grammar</a></li>
      <li><a href="/docs/handbook/29-grammar-reference/#299-b9--key-system-grammar">29.9 B.9 — Key System Grammar</a></li>
      <li><a href="/docs/handbook/29-grammar-reference/#2910-b10--concurrency-grammar">29.10 B.10 — Concurrency Grammar</a></li>
      <li><a href="/docs/handbook/29-grammar-reference/#2911-b11--async-grammar">29.11 B.11 — Async Grammar</a></li>
      <li><a href="/docs/handbook/29-grammar-reference/#2912-b12--metaprogramming-grammar">29.12 B.12 — Metaprogramming Grammar</a></li>
      <li><a href="/docs/handbook/29-grammar-reference/#2913-b13--ffi-grammar">29.13 B.13 — FFI Grammar</a></li>
      <li><a href="/docs/handbook/29-grammar-reference/#2914-b14--region-grammar">29.14 B.14 — Region Grammar</a></li>
      <li><a href="/docs/handbook/29-grammar-reference/#2915-appendix-c--ast-form-index-quick-map">29.15 Appendix C — AST Form Index (Quick Map)</a>
        <ol>
          <li><a href="/docs/handbook/29-grammar-reference/#29151-c1-item-forms">29.15.1 C.1 Item Forms</a></li>
          <li><a href="/docs/handbook/29-grammar-reference/#29152-c2-type-forms">29.15.2 C.2 Type Forms</a></li>
          <li><a href="/docs/handbook/29-grammar-reference/#29153-c3-expression-pattern-and-statement-families">29.15.3 C.3 Expression, Pattern, and Statement Families</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/29-grammar-reference/#2916-cross-section-token-cautions">29.16 Cross-Section Token Cautions</a></li>
      <li><a href="/docs/handbook/29-grammar-reference/#2917-idioms--best-practices">29.17 Idioms &amp; Best Practices</a></li>
      <li><a href="/docs/handbook/29-grammar-reference/#2918-pitfalls--diagnostics">29.18 Pitfalls &amp; Diagnostics</a></li>
    </ol>
  </details>
</li>
<li>
  <details open>
    <summary><a href="/docs/handbook/30-style-best-practices/">30. Style, Naming &amp; Engineering Best Practices</a></summary>
    <ol>
      <li><a href="/docs/handbook/30-style-best-practices/#301-naming">30.1 Naming</a>
        <ol>
          <li><a href="/docs/handbook/30-style-best-practices/#3011-general-rules">30.1.1 General Rules</a></li>
          <li><a href="/docs/handbook/30-style-best-practices/#3012-the-naming-matrix">30.1.2 The Naming Matrix</a></li>
          <li><a href="/docs/handbook/30-style-best-practices/#3013-acronyms-and-initialisms">30.1.3 Acronyms and Initialisms</a></li>
          <li><a href="/docs/handbook/30-style-best-practices/#3014-naming-exceptions">30.1.4 Naming Exceptions</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/30-style-best-practices/#302-formatting">30.2 Formatting</a>
        <ol>
          <li><a href="/docs/handbook/30-style-best-practices/#3021-layout">30.2.1 Layout</a></li>
          <li><a href="/docs/handbook/30-style-best-practices/#3022-line-breaking">30.2.2 Line Breaking</a></li>
          <li><a href="/docs/handbook/30-style-best-practices/#3023-spacing-and-blank-lines">30.2.3 Spacing and Blank Lines</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/30-style-best-practices/#303-module-directory-and-file-organization">30.3 Module, Directory, and File Organization</a>
        <ol>
          <li><a href="/docs/handbook/30-style-best-practices/#3031-module-structure">30.3.1 Module Structure</a></li>
          <li><a href="/docs/handbook/30-style-best-practices/#3032-file-and-module-size">30.3.2 File and Module Size</a></li>
          <li><a href="/docs/handbook/30-style-best-practices/#3033-special-files">30.3.3 Special Files</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/30-style-best-practices/#304-imports-and-visibility">30.4 Imports and Visibility</a>
        <ol>
          <li><a href="/docs/handbook/30-style-best-practices/#3041-import-ordering">30.4.1 Import Ordering</a></li>
          <li><a href="/docs/handbook/30-style-best-practices/#3042-using-rules">30.4.2 using Rules</a></li>
          <li><a href="/docs/handbook/30-style-best-practices/#3043-visibility">30.4.3 Visibility</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/30-style-best-practices/#305-type-design">30.5 Type Design</a>
        <ol>
          <li><a href="/docs/handbook/30-style-best-practices/#3051-record-class-and-modal">30.5.1 record, class, and modal</a></li>
          <li><a href="/docs/handbook/30-style-best-practices/#3052-member-ordering">30.5.2 Member Ordering</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/30-style-best-practices/#306-contracts-invariants-and-safety-semantics">30.6 Contracts, Invariants, and Safety Semantics</a>
        <ol>
          <li><a href="/docs/handbook/30-style-best-practices/#3061-contracts-are-mandatory-where-expressible">30.6.1 Contracts Are Mandatory Where Expressible</a></li>
          <li><a href="/docs/handbook/30-style-best-practices/#3062-capability-passing">30.6.2 Capability Passing</a></li>
          <li><a href="/docs/handbook/30-style-best-practices/#3063-state-and-validation">30.6.3 State and Validation</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/30-style-best-practices/#307-unsafe-dynamic-and-ffi">30.7 unsafe, #dynamic, and FFI</a>
        <ol>
          <li><a href="/docs/handbook/30-style-best-practices/#3071-unsafe">30.7.1 unsafe</a></li>
          <li><a href="/docs/handbook/30-style-best-practices/#3072-dynamic">30.7.2 #dynamic</a></li>
          <li><a href="/docs/handbook/30-style-best-practices/#3073-ffi-boundaries">30.7.3 FFI Boundaries</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/30-style-best-practices/#308-procedures-and-api-design">30.8 Procedures and API Design</a>
        <ol>
          <li><a href="/docs/handbook/30-style-best-practices/#3081-procedure-style">30.8.1 Procedure Style</a></li>
          <li><a href="/docs/handbook/30-style-best-practices/#3082-api-surface">30.8.2 API Surface</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/30-style-best-practices/#309-module-scope-state">30.9 Module-Scope State</a></li>
      <li><a href="/docs/handbook/30-style-best-practices/#3010-comments-and-documentation">30.10 Comments and Documentation</a>
        <ol>
          <li><a href="/docs/handbook/30-style-best-practices/#30101-comments">30.10.1 Comments</a></li>
          <li><a href="/docs/handbook/30-style-best-practices/#30102-documentation-comments">30.10.2 Documentation Comments</a></li>
        </ol>
      </li>
      <li><a href="/docs/handbook/30-style-best-practices/#3011-review-expectations">30.11 Review Expectations</a></li>
      <li><a href="/docs/handbook/30-style-best-practices/#idioms--best-practices">Idioms &amp; Best Practices</a></li>
      <li><a href="/docs/handbook/30-style-best-practices/#pitfalls--diagnostics">Pitfalls &amp; Diagnostics</a></li>
    </ol>
  </details>
</li>
</ol>
