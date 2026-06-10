---
title: "6.6 Runtime State and Memory Diagnostics"
description: "6.6 Runtime State and Memory Diagnostics from 6. Abstract Machine, Objects, Responsibility, and Authority of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "abstract-machine-objects-responsibility-and-authority"
specSection: "66-runtime-state-and-memory-diagnostics"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
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
| `E-MEM-1207` | Error    | Compile-time | `frame` used with no active region in scope (`Frame-NoActiveRegion-Err`) |
| `E-MEM-1208` | Error    | Compile-time | `r.frame` target is not in `Region@Active` state (`Frame-Target-NotActive-Err`) |
| `E-MEM-3001` | Error    | Compile-time | Read or move of a binding in Moved or PartiallyMoved state (`Trans-Moved-NoAccess`, `Trans-Partial-NoAccess`, `B-Closure-RefCapture-Moved-Err`) |
| `E-MEM-3003` | Error    | Compile-time | Reassignment of immutable binding                                    |
| `E-MEM-3004` | Error    | Compile-time | Partial move from binding without `unique` permission                |
| `E-MEM-3005` | Error    | Compile-time | Explicit call to `drop` method with destructor signature             |
| `E-MEM-3006` | Error    | Compile-time | Attempt to move from immovable binding (`:=`) (`Trans-Let-NoReassign`, `B-Closure-MoveCapture-Immovable-Err`) |
| `E-MEM-3007` | Error    | Compile-time | `unique` binding from place expression requires explicit `move` (`B-LetVar-UniqueNonMove-Err`) |
| `E-MEM-3020` | Error    | Compile-time | Value with shorter-lived provenance escapes to longer-lived location |
| `E-MEM-3021` | Error    | Compile-time | Region allocation `^` outside region scope                           |
| `E-MEM-3030` | Error    | Compile-time | Unsafe operation outside block (`AllocRaw-Unsafe-Err`, `DeallocRaw-Unsafe-Err`, `Region-Unchecked-Unsafe-Err`, `Transmute-Unsafe-Err`) |
