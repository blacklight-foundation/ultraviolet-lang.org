---
title: "18.11 Statement Diagnostics Supplement"
description: "18.11 Statement Diagnostics Supplement from 18. Statements and Blocks of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "statements-and-blocks"
specSection: "1811-statement-diagnostics-supplement"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/statements-and-blocks/">18. Statements and Blocks</a>
  <span>Statements and Blocks</span>
</div>

## 18.11 Statement Diagnostics Supplement

This section owns diagnostics for statement typing, method placement, assignment, `defer`, and control flow.

| Code         | Severity | Detection    | Condition                                   |
| ------------ | -------- | ------------ | ------------------------------------------- |
| `E-MOD-2401` | Error    | Compile-time | Reassignment of immutable `let` binding     |
| `E-SEM-3011` | Error    | Compile-time | Method defined outside of type context      |
| `E-SEM-3012` | Error    | Compile-time | Duplicate method name in type               |
| `E-SEM-3131` | Error    | Compile-time | Assignment target is not a place expression |
| `E-SEM-3132` | Error    | Compile-time | Assignment through `const` permission       |
| `E-SEM-3133` | Error    | Compile-time | Assignment type mismatch                    |
| `E-SEM-3151` | Error    | Compile-time | Defer block has non-unit type               |
| `E-SEM-3152` | Error    | Compile-time | Non-local control flow in defer block       |
| `E-SEM-3161` | Error    | Compile-time | `return` type mismatch with procedure       |
| `E-SEM-3162` | Error    | Compile-time | `break` outside `loop`                      |
| `E-SEM-3163` | Error    | Compile-time | `continue` outside `loop`                   |
| `E-SEM-3165` | Error    | Compile-time | `return` at module scope                    |
