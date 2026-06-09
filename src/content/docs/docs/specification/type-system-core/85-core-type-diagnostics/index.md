---
title: "8.5 Core Type Diagnostics"
description: "8.5 Core Type Diagnostics from 8. Type System Core of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "type-system-core"
specSection: "85-core-type-diagnostics"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/type-system-core/">8. Type System Core</a>
  <span>Type System Core</span>
</div>

## 8.5 Core Type Diagnostics

This section owns core type-inference and alias-cycle diagnostics that are not specific to a single feature chapter.

| Code         | Severity | Detection    | Condition                                                  |
| ------------ | -------- | ------------ | ---------------------------------------------------------- |
| `E-TYP-1506` | Error    | Compile-time | Type alias cycle detected                                  |
| `E-TYP-1520` | Error    | Compile-time | Invariant type parameter requires exact type match         |
| `E-TYP-1521` | Error    | Compile-time | Covariant or contravariant generic variance requirement not satisfied |
| `E-TYP-1530` | Error    | Compile-time | Type inference failed; unable to determine type            |
| `E-TYP-1531` | Error    | Compile-time | Float literal explicit suffix does not match expected type |
