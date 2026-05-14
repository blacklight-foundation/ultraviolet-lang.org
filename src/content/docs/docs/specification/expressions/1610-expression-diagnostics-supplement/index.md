---
title: "16.10 Expression Diagnostics Supplement"
description: "16.10 Expression Diagnostics Supplement from 16. Expressions of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "expressions"
specSection: "1610-expression-diagnostics-supplement"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/expressions/">16. Expressions</a>
  <span>Expressions</span>
</div>

## 16.10 Expression Diagnostics Supplement

This section owns diagnostics for general expression typing, calls, indexing restrictions, and `transmute`.

| Code          | Severity | Detection    | Condition                                                                           |
| ------------- | -------- | ------------ | ----------------------------------------------------------------------------------- |
| `E-SEM-2525`  | Error    | Compile-time | Operator operands are not compatible with the operator's type requirements          |
| `E-SEM-2526`  | Error    | Compile-time | Expression type incompatible with expected type                                     |
| `E-SEM-2527`  | Error    | Compile-time | Indexing applied to non-indexable type                                              |
| `E-SEM-2528`  | Error    | Compile-time | Invalid cast                                                                        |
| `E-SEM-2531`  | Error    | Compile-time | Callee expression is not of FUNCTION type                                           |
| `E-SEM-2532`  | Error    | Compile-time | Argument count mismatch                                                             |
| `E-SEM-2533`  | Error    | Compile-time | Argument type incompatible with parameter type                                      |
| `E-SEM-2534`  | Error    | Compile-time | `move` argument required but not provided for provenance-bearing consuming argument |
| `E-SEM-2535`  | Error    | Compile-time | `move` argument provided but parameter is not `move`                                |
| `E-SEM-2536`  | Error    | Compile-time | Method not found for receiver type                                                  |
| `E-SEM-2538`  | Error    | Compile-time | Pipeline RHS is not callable                                                        |
| `E-SEM-2539`  | Error    | Compile-time | Pipeline argument type mismatch                                                     |
| `E-SEM-2591`  | Error    | Compile-time | Closure parameter type cannot be inferred                                           |
| `E-MEM-3031`  | Error    | Compile-time | `transmute` source and target sizes differ                                          |
| `E-UNS-0102`  | Error    | Compile-time | Array index must be a compile-time constant outside `[[dynamic]]` scope             |
| `E-UNS-0103`  | Error    | Compile-time | Array index out of bounds                                                           |
| `E-UNS-0104`  | Error    | Compile-time | `transmute` source and target alignments differ                                     |
| `E-UNS-0107`  | Error    | Compile-time | Non-`Bitcopy` place expression used as value                                        |
| `W-SAFE-0100` | Warning  | Compile-time | `transmute` target type is known to admit invalid bit patterns                      |
