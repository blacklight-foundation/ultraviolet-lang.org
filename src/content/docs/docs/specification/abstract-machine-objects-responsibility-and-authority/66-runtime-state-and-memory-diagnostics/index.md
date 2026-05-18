---
title: "6.6 Runtime State and Memory Diagnostics"
description: "6.6 Runtime State and Memory Diagnostics from 6. Abstract Machine, Objects, Responsibility, and Authority of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "abstract-machine-objects-responsibility-and-authority"
specSection: "66-runtime-state-and-memory-diagnostics"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/">6. Abstract Machine, Objects, Responsibility, and Authority</a>
  <span>Abstract Machine, Objects, Responsibility, and Authority</span>
</div>

## 6.6 Runtime State and Memory Diagnostics

This section owns binding-state, region/frame, provenance, and unsafe-runtime diagnostics consumed by Chapters 6, 16, and 18.

| Code         | Severity | Detection    | Condition                                                            |
| ------------ | -------- | ------------ | -------------------------------------------------------------------- |
| `E-MEM-1206` | Error    | Compile-time | Named region not found for allocation                                |
| `E-MEM-1207` | Error    | Compile-time | `frame` used with no active region in scope                          |
| `E-MEM-1208` | Error    | Compile-time | `r.frame` target is not in `Region@Active` state                     |
| `E-MEM-3001` | Error    | Compile-time | Read or move of a binding in Moved or PartiallyMoved state           |
| `E-MEM-3003` | Error    | Compile-time | Reassignment of immutable binding                                    |
| `E-MEM-3004` | Error    | Compile-time | Partial move from binding without `unique` permission                |
| `E-MEM-3005` | Error    | Compile-time | Explicit call to `drop` method with destructor signature             |
| `E-MEM-3006` | Error    | Compile-time | Attempt to move from immovable binding (`:=`)                        |
| `E-MEM-3007` | Error    | Compile-time | `unique` binding from place expression requires explicit `move`      |
| `E-MEM-3020` | Error    | Compile-time | Value with shorter-lived provenance escapes to longer-lived location |
| `E-MEM-3021` | Error    | Compile-time | Region allocation `^` outside region scope                           |
| `E-MEM-3030` | Error    | Compile-time | Unsafe operation outside block                                       |
