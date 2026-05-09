---
title: Compiler Architecture
description: Public overview of the Ultraviolet compiler source tree.
---

The Ultraviolet compiler source is organized around the same surfaces exposed by the specification.

## Main source areas

| Area | Responsibility |
| :--- | :------------- |
| `Compiler/Core` | Conformance, behavior, paths, spans, and specification traceability |
| `Compiler/Project` | Manifest loading, assemblies, module discovery, target config, output artifacts |
| `Compiler/Source` | Source loading, lexer, AST, parser |
| `Compiler/Resolve` | Name resolution, imports, lookup, scopes, visibility |
| `Compiler/Semantics` | Types, permissions, contracts, modals, keys, concurrency, FFI, memory |
| `Compiler/Driver` | CLI, pipeline, testing, conformance trace |
| `Compiler/Backend` | Backend IR, runtime symbol resolution, target output work |
| `Runtime` | Context, IO, memory, concurrency, system, network, host support |
| `Tools/Uv` | Public `uv` command entrypoint |

## Current build direction

The compiler rebuild plan tracks a full self-hosting compiler implementation bootstrapped by the existing Cursive compiler. Windows `x86_64-win64` is the first bootstrap target.

## Source references

- `CompilerRebuildPlan.md`
- `Ultraviolet.toml`
- `Compiler`
- `Runtime`
- `Tools/Uv`
