---
title: "Compile-Time Execution and Metaprogramming"
description: "22. Compile-Time Execution and Metaprogramming section index for the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>


Phase 2 executes compile-time forms over the Phase 1 module set before name resolution and type checking of the expanded program.

<section class="spec-chapter-sections" aria-labelledby="spec-chapter-sections">
  <h2 id="spec-chapter-sections">Sections</h2>
  <ol class="spec-outline-sections">
    <li>
      <a href="/docs/specification/compile-time-execution-and-metaprogramming/221-compile-time-forms/">22.1 Compile-Time Forms</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/221-compile-time-forms/#2211-syntax">22.1.1 Syntax</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/221-compile-time-forms/#2212-parsing">22.1.2 Parsing</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/221-compile-time-forms/#2213-ast-representation-form">22.1.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/221-compile-time-forms/#2214-static-semantics">22.1.4 Static Semantics</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/221-compile-time-forms/#2215-dynamic-semantics">22.1.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/221-compile-time-forms/#2216-lowering">22.1.6 Lowering</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/221-compile-time-forms/#2217-diagnostics">22.1.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/compile-time-execution-and-metaprogramming/222-compile-time-capabilities/">22.2 Compile-Time Capabilities</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/222-compile-time-capabilities/#2221-syntax">22.2.1 Syntax</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/222-compile-time-capabilities/#2222-parsing">22.2.2 Parsing</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/222-compile-time-capabilities/#2223-ast-representation-form">22.2.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/222-compile-time-capabilities/#2224-static-semantics">22.2.4 Static Semantics</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/222-compile-time-capabilities/#2225-dynamic-semantics">22.2.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/222-compile-time-capabilities/#2226-lowering">22.2.6 Lowering</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/222-compile-time-capabilities/#2227-diagnostics">22.2.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/compile-time-execution-and-metaprogramming/223-reflection/">22.3 Reflection</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/223-reflection/#2231-syntax">22.3.1 Syntax</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/223-reflection/#2232-parsing">22.3.2 Parsing</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/223-reflection/#2233-ast-representation-form">22.3.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/223-reflection/#2234-static-semantics">22.3.4 Static Semantics</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/223-reflection/#2235-dynamic-semantics">22.3.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/223-reflection/#2236-lowering">22.3.6 Lowering</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/223-reflection/#2237-diagnostics">22.3.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/compile-time-execution-and-metaprogramming/224-quote-splice-and-emission/">22.4 Quote, Splice, and Emission</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/224-quote-splice-and-emission/#2241-syntax">22.4.1 Syntax</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/224-quote-splice-and-emission/#2242-parsing">22.4.2 Parsing</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/224-quote-splice-and-emission/#2243-ast-representation-form">22.4.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/224-quote-splice-and-emission/#2244-static-semantics">22.4.4 Static Semantics</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/224-quote-splice-and-emission/#2245-dynamic-semantics">22.4.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/224-quote-splice-and-emission/#2246-lowering">22.4.6 Lowering</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/224-quote-splice-and-emission/#2247-diagnostics">22.4.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/compile-time-execution-and-metaprogramming/225-derive-targets-and-contracts/">22.5 Derive Targets and Contracts</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/225-derive-targets-and-contracts/#2251-syntax">22.5.1 Syntax</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/225-derive-targets-and-contracts/#2252-parsing">22.5.2 Parsing</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/225-derive-targets-and-contracts/#2253-ast-representation-form">22.5.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/225-derive-targets-and-contracts/#2254-static-semantics">22.5.4 Static Semantics</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/225-derive-targets-and-contracts/#2255-dynamic-semantics">22.5.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/225-derive-targets-and-contracts/#2256-lowering">22.5.6 Lowering</a></li>
      <li><a href="/docs/specification/compile-time-execution-and-metaprogramming/225-derive-targets-and-contracts/#2257-diagnostics">22.5.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/compile-time-execution-and-metaprogramming/226-compile-time-diagnostics-supplement/">22.6 Compile-Time Diagnostics Supplement</a>

    </li>
  </ol>
</section>
