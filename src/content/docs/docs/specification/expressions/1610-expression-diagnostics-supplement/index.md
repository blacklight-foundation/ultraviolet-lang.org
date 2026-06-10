---
title: "16.10 Expression Diagnostics Supplement"
description: "16.10 Expression Diagnostics Supplement from 16. Expressions of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "expressions"
specSection: "1610-expression-diagnostics-supplement"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
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
| `E-SEM-2527`  | Error    | Compile-time | Indexing applied to non-indexable type (`Index-NonIndexable`) |
| `E-SEM-2528`  | Error    | Compile-time | Invalid cast (`T-Cast-Invalid`) |
| `E-SEM-2531`  | Error    | Compile-time | Callee expression is not of FUNCTION type (`Call-Callee-NotFunc`) |
| `E-SEM-2532`  | Error    | Compile-time | Argument count mismatch (`Call-ArgCount-Err`) |
| `E-SEM-2533`  | Error    | Compile-time | Argument type incompatible with parameter type (`Call-ArgType-Err`) |
| `E-SEM-2534`  | Error    | Compile-time | Consuming parameter requires ownership transfer with `move` or an explicit duplicate with `copy` (`Call-Move-Missing`) |
| `E-SEM-2535`  | Error    | Compile-time | `move` argument provided for non-consuming parameter (`Call-Move-Unexpected`) |
| `E-SEM-2536`  | Error    | Compile-time | Method not found for receiver type                                                  |
| `E-SEM-2538`  | Error    | Compile-time | Pipeline RHS is not callable (`T-Pipeline-NotCallable-Err`) |
| `E-SEM-2539`  | Error    | Compile-time | Pipeline argument type mismatch (`T-Pipeline-TypeMismatch-Err`, `T-Pipeline-ArgCount-Err`) |
| `E-SEM-2591`  | Error    | Compile-time | Closure parameter type cannot be inferred (`Infer-Closure-Params-Err`) |
| `E-MEM-3031`  | Error    | Compile-time | `transmute` source and target sizes differ                                          |
| `E-UNS-0102`  | Error    | Compile-time | Fixed-size array index must be a compile-time constant outside `#dynamic` scope (`Index-Array-NonConst-Err`) |
| `E-UNS-0103`  | Error    | Compile-time | Array index out of bounds (`Index-Array-OOB-Err`) |
| `E-UNS-0104`  | Error    | Compile-time | `transmute` source and target alignments differ                                     |
| `E-UNS-0107`  | Error    | Compile-time | Explicit `copy` requires a `Bitcopy` value (`ValueUse-NonBitcopyPlace`) |
| `W-SAF-0100` | Warning  | Compile-time | `transmute` target type is known to admit invalid bit patterns                      |
