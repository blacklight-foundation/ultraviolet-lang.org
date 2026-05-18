---
title: "Foreign Function Interface"
description: "23. Foreign Function Interface section index for the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>


**FFI Boundary.** A call to an `extern` procedure or an invocation of a `[[export]]` or `[[host_export]]` procedure from foreign code crosses the foreign-function boundary.

$$
\operatorname{FFIBoundary}(\mathsf{proc})\ \Leftrightarrow \ \mathsf{proc}\ =\ \operatorname{ExternProcDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \lor \ (\mathsf{proc}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \land \ (\operatorname{ExportAttr}(\mathsf{proc})\ \mathsf{defined}\ \lor \ \operatorname{HostExportAttr}(\mathsf{proc})\ \mathsf{defined}))
$$

<section class="spec-chapter-sections" aria-labelledby="spec-chapter-sections">
  <h2 id="spec-chapter-sections">Sections</h2>
  <ol class="spec-outline-sections">
    <li>
      <a href="/docs/specification/foreign-function-interface/231-ffisafe/">23.1 FfiSafe</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/foreign-function-interface/231-ffisafe/#2311-syntax">23.1.1 Syntax</a></li>
      <li><a href="/docs/specification/foreign-function-interface/231-ffisafe/#2312-parsing">23.1.2 Parsing</a></li>
      <li><a href="/docs/specification/foreign-function-interface/231-ffisafe/#2313-ast-representation-form">23.1.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/foreign-function-interface/231-ffisafe/#2314-static-semantics">23.1.4 Static Semantics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/231-ffisafe/#2315-dynamic-semantics">23.1.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/231-ffisafe/#2316-lowering">23.1.6 Lowering</a></li>
      <li><a href="/docs/specification/foreign-function-interface/231-ffisafe/#2317-diagnostics">23.1.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/foreign-function-interface/232-extern-procedures/">23.2 Extern Procedures</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/foreign-function-interface/232-extern-procedures/#2321-syntax">23.2.1 Syntax</a></li>
      <li><a href="/docs/specification/foreign-function-interface/232-extern-procedures/#2322-parsing">23.2.2 Parsing</a></li>
      <li><a href="/docs/specification/foreign-function-interface/232-extern-procedures/#2323-ast-representation-form">23.2.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/foreign-function-interface/232-extern-procedures/#2324-static-semantics">23.2.4 Static Semantics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/232-extern-procedures/#2325-dynamic-semantics">23.2.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/232-extern-procedures/#2326-lowering">23.2.6 Lowering</a></li>
      <li><a href="/docs/specification/foreign-function-interface/232-extern-procedures/#2327-diagnostics">23.2.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/foreign-function-interface/233-exported-procedures-and-hosted-exports/">23.3 Exported Procedures and Hosted Exports</a>
<details class="spec-outline-subsections">
    <summary>14 subsections</summary>
    <ol>
      <li><a href="/docs/specification/foreign-function-interface/233-exported-procedures-and-hosted-exports/#2331-raw-exported-procedures">23.3.1 Raw Exported Procedures</a></li>
      <li><a href="/docs/specification/foreign-function-interface/233-exported-procedures-and-hosted-exports/#2332-parsing">23.3.2 Parsing</a></li>
      <li><a href="/docs/specification/foreign-function-interface/233-exported-procedures-and-hosted-exports/#2333-ast-representation-form">23.3.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/foreign-function-interface/233-exported-procedures-and-hosted-exports/#2334-static-semantics">23.3.4 Static Semantics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/233-exported-procedures-and-hosted-exports/#2335-dynamic-semantics">23.3.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/233-exported-procedures-and-hosted-exports/#2336-lowering">23.3.6 Lowering</a></li>
      <li><a href="/docs/specification/foreign-function-interface/233-exported-procedures-and-hosted-exports/#2337-diagnostics">23.3.7 Diagnostics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/233-exported-procedures-and-hosted-exports/#2338-hosted-exports">23.3.8 Hosted Exports</a></li>
      <li><a href="/docs/specification/foreign-function-interface/233-exported-procedures-and-hosted-exports/#2339-parsing">23.3.9 Parsing</a></li>
      <li><a href="/docs/specification/foreign-function-interface/233-exported-procedures-and-hosted-exports/#23310-ast-representation-form">23.3.10 AST Representation / Form</a></li>
      <li><a href="/docs/specification/foreign-function-interface/233-exported-procedures-and-hosted-exports/#23311-static-semantics">23.3.11 Static Semantics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/233-exported-procedures-and-hosted-exports/#23312-dynamic-semantics">23.3.12 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/233-exported-procedures-and-hosted-exports/#23313-lowering">23.3.13 Lowering</a></li>
      <li><a href="/docs/specification/foreign-function-interface/233-exported-procedures-and-hosted-exports/#23314-diagnostics">23.3.14 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/foreign-function-interface/234-ffi-attributes/">23.4 FFI Attributes</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/foreign-function-interface/234-ffi-attributes/#2341-syntax">23.4.1 Syntax</a></li>
      <li><a href="/docs/specification/foreign-function-interface/234-ffi-attributes/#2342-parsing">23.4.2 Parsing</a></li>
      <li><a href="/docs/specification/foreign-function-interface/234-ffi-attributes/#2343-ast-representation-form">23.4.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/foreign-function-interface/234-ffi-attributes/#2344-static-semantics">23.4.4 Static Semantics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/234-ffi-attributes/#2345-dynamic-semantics">23.4.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/234-ffi-attributes/#2346-lowering">23.4.6 Lowering</a></li>
      <li><a href="/docs/specification/foreign-function-interface/234-ffi-attributes/#2347-diagnostics">23.4.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/foreign-function-interface/235-capability-isolation/">23.5 Capability Isolation</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/foreign-function-interface/235-capability-isolation/#2351-syntax">23.5.1 Syntax</a></li>
      <li><a href="/docs/specification/foreign-function-interface/235-capability-isolation/#2352-parsing">23.5.2 Parsing</a></li>
      <li><a href="/docs/specification/foreign-function-interface/235-capability-isolation/#2353-ast-representation-form">23.5.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/foreign-function-interface/235-capability-isolation/#2354-static-semantics">23.5.4 Static Semantics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/235-capability-isolation/#2355-dynamic-semantics">23.5.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/235-capability-isolation/#2356-lowering">23.5.6 Lowering</a></li>
      <li><a href="/docs/specification/foreign-function-interface/235-capability-isolation/#2357-diagnostics">23.5.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/foreign-function-interface/236-foreign-contracts/">23.6 Foreign Contracts</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/foreign-function-interface/236-foreign-contracts/#2361-syntax">23.6.1 Syntax</a></li>
      <li><a href="/docs/specification/foreign-function-interface/236-foreign-contracts/#2362-parsing">23.6.2 Parsing</a></li>
      <li><a href="/docs/specification/foreign-function-interface/236-foreign-contracts/#2363-ast-representation-form">23.6.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/foreign-function-interface/236-foreign-contracts/#2364-static-semantics">23.6.4 Static Semantics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/236-foreign-contracts/#2365-dynamic-semantics">23.6.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/236-foreign-contracts/#2366-lowering">23.6.6 Lowering</a></li>
      <li><a href="/docs/specification/foreign-function-interface/236-foreign-contracts/#2367-diagnostics">23.6.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/foreign-function-interface/237-boundary-unwinding/">23.7 Boundary Unwinding</a>
<details class="spec-outline-subsections">
    <summary>7 subsections</summary>
    <ol>
      <li><a href="/docs/specification/foreign-function-interface/237-boundary-unwinding/#2371-syntax">23.7.1 Syntax</a></li>
      <li><a href="/docs/specification/foreign-function-interface/237-boundary-unwinding/#2372-parsing">23.7.2 Parsing</a></li>
      <li><a href="/docs/specification/foreign-function-interface/237-boundary-unwinding/#2373-ast-representation-form">23.7.3 AST Representation / Form</a></li>
      <li><a href="/docs/specification/foreign-function-interface/237-boundary-unwinding/#2374-static-semantics">23.7.4 Static Semantics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/237-boundary-unwinding/#2375-dynamic-semantics">23.7.5 Dynamic Semantics</a></li>
      <li><a href="/docs/specification/foreign-function-interface/237-boundary-unwinding/#2376-lowering">23.7.6 Lowering</a></li>
      <li><a href="/docs/specification/foreign-function-interface/237-boundary-unwinding/#2377-diagnostics">23.7.7 Diagnostics</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/foreign-function-interface/238-ffi-diagnostics-supplement/">23.8 FFI Diagnostics Supplement</a>

    </li>
  </ol>
</section>
