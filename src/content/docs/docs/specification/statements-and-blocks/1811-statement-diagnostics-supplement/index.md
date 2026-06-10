---
title: "18.11 Statement Diagnostics Supplement"
description: "18.11 Statement Diagnostics Supplement from 18. Statements and Blocks of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "statements-and-blocks"
specSection: "1811-statement-diagnostics-supplement"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/statements-and-blocks/">18. Statements and Blocks</a>
  <span>Statements and Blocks</span>
</div>

## 18.11 Statement Diagnostics Supplement

This section owns diagnostics for statement typing, method placement, assignment, `defer`, and control flow.

| Code         | Severity | Detection    | Condition                                   |
| ------------ | -------- | ------------ | ------------------------------------------- |
| `E-MOD-2401` | Error    | Compile-time | Reassignment of immutable `let` binding (`Assign-Immutable-Err`) |
| `E-SEM-3011` | Error    | Compile-time | Method defined outside of type context      |
| `E-SEM-3012` | Error    | Compile-time | Duplicate method name in type               |
| `E-SEM-3131` | Error    | Compile-time | Assignment target is not a place expression (`Assign-NotPlace`) |
| `E-SEM-3133` | Error    | Compile-time | Assignment type mismatch (`Assign-Type-Err`, `T-LetStmt-Ann-Mismatch`) |
| `E-SEM-3151` | Error    | Compile-time | Defer block has non-unit type (`Defer-NonUnit-Err`) |
| `E-SEM-3152` | Error    | Compile-time | Non-local control flow in defer block (`Defer-NonLocal-Err`) |
| `E-SEM-3161` | Error    | Compile-time | `return` type mismatch with procedure (`BlockInfo-Res-Err`, `Return-Type-Err`) |
| `E-SEM-3162` | Error    | Compile-time | `break` outside `loop` (`Break-Outside-Loop`) |
| `E-SEM-3163` | Error    | Compile-time | `continue` outside `loop` (`Continue-Outside-Loop`) |
| `E-SEM-3165` | Error    | Compile-time | `return` at module scope                    |

Const permission assignment diagnostics are owned by §10.4.7 Permission Admissibility.
