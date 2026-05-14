---
title: "Common Lowering, Program Lifecycle, and Backend"
description: "24. Common Lowering, Program Lifecycle, and Backend section index for the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>



<section class="spec-chapter-sections" aria-labelledby="spec-chapter-sections">
  <h2 id="spec-chapter-sections">Sections</h2>
  <ol class="spec-outline-sections">
    <li>
      <a href="/docs/specification/common-lowering-program-lifecycle-and-backend/241-shared-lowering-judgments/">24.1 Shared Lowering Judgments</a>
<details class="spec-outline-subsections">
    <summary>4 subsections</summary>
    <ol>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/241-shared-lowering-judgments/#2411-codegen-model-and-targets">24.1.1 Codegen Model and Targets</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/241-shared-lowering-judgments/#2412-shared-judgments-and-correctness">24.1.2 Shared Judgments and Correctness</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/241-shared-lowering-judgments/#2413-ir-forms-and-composition">24.1.3 IR Forms and Composition</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/241-shared-lowering-judgments/#2414-project-and-module-composition">24.1.4 Project and Module Composition</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/common-lowering-program-lifecycle-and-backend/242-layout-and-abi-framework/">24.2 Layout and ABI Framework</a>
<details class="spec-outline-subsections">
    <summary>5 subsections</summary>
    <ol>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/242-layout-and-abi-framework/#2421-primitive-layout-and-encoding">24.2.1 Primitive Layout and Encoding</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/242-layout-and-abi-framework/#2422-permission-pointer-and-function-layout">24.2.2 Permission, Pointer, and Function Layout</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/242-layout-and-abi-framework/#2423-default-calling-convention">24.2.3 Default Calling Convention</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/242-layout-and-abi-framework/#2424-abi-type-lowering">24.2.4 ABI Type Lowering</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/242-layout-and-abi-framework/#2425-abi-parameter-and-return-passing">24.2.5 ABI Parameter and Return Passing</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/common-lowering-program-lifecycle-and-backend/243-symbols-mangling-and-linkage/">24.3 Symbols, Mangling, and Linkage</a>
<details class="spec-outline-subsections">
    <summary>2 subsections</summary>
    <ol>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/243-symbols-mangling-and-linkage/#2431-symbol-names-and-mangling">24.3.1 Symbol Names and Mangling</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/243-symbols-mangling-and-linkage/#2432-linkage-for-generated-symbols">24.3.2 Linkage for Generated Symbols</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/common-lowering-program-lifecycle-and-backend/244-initialization-and-program-lifecycle/">24.4 Initialization and Program Lifecycle</a>
<details class="spec-outline-subsections">
    <summary>5 subsections</summary>
    <ol>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/244-initialization-and-program-lifecycle/#2441-static-globals-and-module-initdeinit-lowering">24.4.1 Static Globals and Module Init/Deinit Lowering</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/244-initialization-and-program-lifecycle/#2442-initialization-order-poisoning-and-project-lifecycle">24.4.2 Initialization Order, Poisoning, and Project Lifecycle</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/244-initialization-and-program-lifecycle/#2443-entry-symbols-and-context-construction">24.4.3 Entry Symbols and Context Construction</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/244-initialization-and-program-lifecycle/#2444-library-images-and-hosted-library-sessions">24.4.4 Library Images and Hosted Library Sessions</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/244-initialization-and-program-lifecycle/#2445-interpreter-entrypoint">24.4.5 Interpreter Entrypoint</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/common-lowering-program-lifecycle-and-backend/245-cleanup-drop-and-unwinding-framework/">24.5 Cleanup, Drop, and Unwinding Framework</a>
<details class="spec-outline-subsections">
    <summary>4 subsections</summary>
    <ol>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/245-cleanup-drop-and-unwinding-framework/#2451-cleanup-lowering-interface">24.5.1 Cleanup Lowering Interface</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/245-cleanup-drop-and-unwinding-framework/#2452-panic-record-and-panic-lowering">24.5.2 Panic Record and Panic Lowering</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/245-cleanup-drop-and-unwinding-framework/#2453-deterministic-destruction">24.5.3 Deterministic Destruction</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/245-cleanup-drop-and-unwinding-framework/#2454-cleanup-and-unwinding-driver">24.5.4 Cleanup and Unwinding Driver</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/common-lowering-program-lifecycle-and-backend/246-runtime-interface/">24.6 Runtime Interface</a>
<details class="spec-outline-subsections">
    <summary>4 subsections</summary>
    <ol>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/246-runtime-interface/#2461-built-in-modal-layout-and-capability-symbols">24.6.1 Built-in Modal Layout and Capability Symbols</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/246-runtime-interface/#2462-managed-stringbytes-runtime-symbols-and-drop-hooks">24.6.2 Managed String/Bytes Runtime Symbols and Drop Hooks</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/246-runtime-interface/#2463-runtime-and-built-in-declarations">24.6.3 Runtime and Built-in Declarations</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/246-runtime-interface/#2464-network-heap-reactor-and-time-host-primitives">24.6.4 Network, Heap, Reactor, and Time Host-Primitives</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/common-lowering-program-lifecycle-and-backend/247-backend-requirements/">24.7 Backend Requirements</a>
<details class="spec-outline-subsections">
    <summary>13 subsections</summary>
    <ol>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/247-backend-requirements/#2471-llvm-module-header">24.7.1 LLVM Module Header</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/247-backend-requirements/#2472-opaque-pointer-model">24.7.2 Opaque Pointer Model</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/247-backend-requirements/#2473-llvm-attribute-mapping">24.7.3 LLVM Attribute Mapping</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/247-backend-requirements/#2474-ub-and-poison-avoidance">24.7.4 UB and Poison Avoidance</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/247-backend-requirements/#2475-memory-intrinsics">24.7.5 Memory Intrinsics</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/247-backend-requirements/#2476-llvm-toolchain-version">24.7.6 LLVM Toolchain Version</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/247-backend-requirements/#2477-llvm-type-mapping">24.7.7 LLVM Type Mapping</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/247-backend-requirements/#2478-ir-declaration-and-instruction-lowering">24.7.8 IR Declaration and Instruction Lowering</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/247-backend-requirements/#2479-binding-storage-and-validity">24.7.9 Binding Storage and Validity</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/247-backend-requirements/#24710-call-abi-mapping">24.7.10 Call ABI Mapping</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/247-backend-requirements/#24711-vtable-emission">24.7.11 VTable Emission</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/247-backend-requirements/#24712-literal-data-emission">24.7.12 Literal Data Emission</a></li>
      <li><a href="/docs/specification/common-lowering-program-lifecycle-and-backend/247-backend-requirements/#24713-poisoning-instrumentation">24.7.13 Poisoning Instrumentation</a></li>
    </ol>
  </details>
    </li>
    <li>
      <a href="/docs/specification/common-lowering-program-lifecycle-and-backend/248-output-and-backend-diagnostics/">24.8 Output and Backend Diagnostics</a>

    </li>
  </ol>
</section>
