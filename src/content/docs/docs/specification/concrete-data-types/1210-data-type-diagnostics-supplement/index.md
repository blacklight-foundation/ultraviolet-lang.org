---
title: "12.10 Data Type Diagnostics Supplement"
description: "12.10 Data Type Diagnostics Supplement from 12. Concrete Data Types of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "concrete-data-types"
specSection: "1210-data-type-diagnostics-supplement"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/concrete-data-types/">12. Concrete Data Types</a>
  <span>Concrete Data Types</span>
</div>

## 12.10 Data Type Diagnostics Supplement

This section owns diagnostics for array, slice, and union data-type rules that are shared across the Chapter 12 type forms.

| Code         | Severity | Detection    | Condition                                             |
| ------------ | -------- | ------------ | ----------------------------------------------------- |
| `E-TYP-1810` | Error    | Compile-time | Array length is not a compile-time constant           |
| `E-TYP-1812` | Error    | Compile-time | Array index expression has non-`usize` type           |
| `E-TYP-1820` | Error    | Compile-time | Slice index expression has non-`usize` type           |
| `E-TYP-2201` | Error    | Compile-time | Union type has fewer than two member types            |
| `E-TYP-2202` | Error    | Compile-time | Direct access on union value without pattern matching |
