---
title: Core Language Surfaces
description: Main Ultraviolet language surfaces for reviewable AI-written code.
---

The core Ultraviolet surfaces are the parts reviewers need to inspect when deciding whether AI-written code is safe, performant, and auditable.

The surfaces compose directly. Contracts state what must hold. Modals expose state and valid transitions. Permissions describe access, mutation, aliasing, responsibility, and whether key synchronization applies. The key system coordinates `shared` access with paths, modes, scopes, conflict checks, static proof, and runtime synchronization. Structured concurrency and CPU/GPU execution domains determine where work runs while preserving those local review facts.

<div class="feature-grid">
  <a class="feature-card" href="/docs/core-language/contracts/">
    <strong>Contracts</strong>
    <span>Preconditions, postconditions, invariants, and foreign contracts.</span>
  </a>
  <a class="feature-card" href="/docs/modal-programming/">
    <strong>Modals</strong>
    <span>State-specific fields, methods, and transitions.</span>
  </a>
  <a class="feature-card" href="/docs/core-language/permissions/">
    <strong>Permissions</strong>
    <span>Access, mutation, aliasing, responsibility, and binding state.</span>
  </a>
  <a class="feature-card" href="/docs/core-language/key-system/">
    <strong>Key system</strong>
    <span>Key paths, modes, scopes, conflict checks, dynamic verification, release, and speculative execution.</span>
  </a>
  <a class="feature-card" href="/docs/core-language/structured-concurrency/">
    <strong>Structured concurrency</strong>
    <span>Parallelism, dispatch, sync, race, and async integration.</span>
  </a>
  <a class="feature-card" href="/docs/core-language/cpu-gpu-programming/">
    <strong>CPU/GPU programming</strong>
    <span>Execution domains for CPU, GPU, and inline work.</span>
  </a>
</div>

## Exact rules

Use the generated specification for normative behavior:

- [10. Permissions and Binding State](/docs/specification/permissions-and-binding-state/)
- [13. Modal and Special Types](/docs/specification/modal-and-special-types/)
- [15. Procedures and Contracts](/docs/specification/procedures-and-contracts/)
- [19. Key System](/docs/specification/key-system/)
- [20. Structured Parallelism](/docs/specification/structured-parallelism/)
- [21. Asynchronous Operations](/docs/specification/asynchronous-operations/)
