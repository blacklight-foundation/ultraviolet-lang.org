---
title: Documentation Audit
description: Trace ledger for high-level Ultraviolet language documentation claims.
---

This ledger records the specification anchors used for the public language guide pages. It is a maintenance aid for keeping explanatory documentation aligned with the generated specification.

## Core Claims

| Public claim | Documentation surface | Specification anchor |
| :----------- | :-------------------- | :------------------- |
| Ultraviolet source uses `.uv`, projects use `Ultraviolet.toml`, and assemblies are loaded through the manifest model. | Quickstart, First Program, Toolchain | [3. Project and Compilation Model](/docs/specification/project-and-compilation-model/) |
| Executable entrypoints receive `Context` as the explicit root for standard capability-bearing values. | First Program, Explicit Effects, Runtime and Built-ins | [6. Abstract Machine, Objects, Responsibility, and Authority](/docs/specification/abstract-machine-objects-responsibility-and-authority/), [24. Common Lowering, Program Lifecycle, and Backend](/docs/specification/common-lowering-program-lifecycle-and-backend/) |
| External effects flow through explicit capability values. | Explicit Effects, Why Ultraviolet | [6.1 Authority Model](/docs/specification/abstract-machine-objects-responsibility-and-authority/), [23. Foreign Function Interface](/docs/specification/foreign-function-interface/) |
| Permissions describe access, mutation, aliasing, binding state, and responsibility transfer. | Permissions, Language Tour, Core Language | [10. Permissions and Binding State](/docs/specification/permissions-and-binding-state/), [6.3 Binding and Permission Runtime State](/docs/specification/abstract-machine-objects-responsibility-and-authority/) |
| `shared` access is governed by key paths, modes, scopes, conflict checks, static proof, and dynamic synchronization. | Key System, Permissions, Structured Concurrency | [19. Key System](/docs/specification/key-system/) |
| `parallel`, `spawn`, `dispatch`, `sync`, and `race` are structured language constructs with specified capture and lifecycle behavior. | Structured Concurrency, Language Tour | [20. Structured Parallelism](/docs/specification/structured-parallelism/), [21. Asynchronous Operations](/docs/specification/asynchronous-operations/) |
| `dispatch` and async behavior integrate with the key system for `shared` access. | Key System, Structured Concurrency | [19.3 Conflict Detection](/docs/specification/key-system/#193-conflict-detection), [20.3 Capture Semantics](/docs/specification/structured-parallelism/#203-capture-semantics), [21.5 Async-Key Integration](/docs/specification/asynchronous-operations/#215-async-key-integration/) |
| Modal programming exposes states, state-specific fields, state-specific methods, and transitions. | Modal Programming, Language Tour | [13. Modal and Special Types](/docs/specification/modal-and-special-types/) |
| Contracts express procedure requirements, promises, invariants, and foreign obligations. | Contracts, Language Tour | [15. Procedures and Contracts](/docs/specification/procedures-and-contracts/) |
| CPU, GPU, and inline execution domains are language-level values, with GPU-safe restrictions. | CPU/GPU Programming, Structured Concurrency | [20.2 Execution Domains](/docs/specification/structured-parallelism/#202-execution-domains/) |
| Compile-time execution, quote/splice, reflection, and emission still produce source that must pass the same language checks. | Language Tour | [22. Compile-Time Execution and Metaprogramming](/docs/specification/compile-time-execution-and-metaprogramming/) |
| FFI and unsafe behavior have explicit specification ownership and do not erase capability, provenance, or lifecycle requirements. | Explicit Effects, Runtime and Built-ins | [23. Foreign Function Interface](/docs/specification/foreign-function-interface/), [6.1.6 Unsafe and Foreign Interaction](/docs/specification/abstract-machine-objects-responsibility-and-authority/) |

## Maintenance Rules

When a guide page changes a language claim:

1. Link the claim to the owning generated specification chapter.
2. Use the specification's feature names and rule boundaries.
3. Update this ledger when the claim is high-level or repeated across pages.
4. Record specification ambiguity here instead of adding invented guide behavior.

Current audit status: no known unresolved guide/spec mismatch for the key system, language tour, core-language overview, permissions, structured concurrency, explicit effects, or reference overview.
