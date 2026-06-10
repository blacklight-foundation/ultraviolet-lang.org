---
title: "12.10 Data Type Diagnostics Supplement"
description: "12.10 Data Type Diagnostics Supplement from 12. Concrete Data Types of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "concrete-data-types"
specSection: "1210-data-type-diagnostics-supplement"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/concrete-data-types/">12. Concrete Data Types</a>
  <span>Concrete Data Types</span>
</div>

## 12.10 Data Type Diagnostics Supplement

This section owns diagnostics for array, slice, and union data-type rules that are shared across the Chapter 12 type forms.

| Code         | Severity | Detection    | Condition                                             |
| ------------ | -------- | ------------ | ----------------------------------------------------- |
| `E-TYP-1810` | Error    | Compile-time | Array length is not a compile-time constant (`ConstLen-Err`) |
| `E-TYP-1812` | Error    | Compile-time | Array index expression has non-`usize` type (`Index-Array-NonUsize`) |
| `E-TYP-1820` | Error    | Compile-time | Slice index expression has non-`usize` type (`Index-Slice-NonUsize`) |
| `E-TYP-2201` | Error    | Compile-time | Union type has fewer than two member types (`WF-Union-TooFew`) |
| `E-TYP-2202` | Error    | Compile-time | Direct access on union value without pattern matching (`Union-DirectAccess-Err`) |
