---
title: "8.5 Core Type Diagnostics"
description: "8.5 Core Type Diagnostics from 8. Type System Core of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "type-system-core"
specSection: "85-core-type-diagnostics"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
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
| `E-TYP-1520` | Error    | Compile-time | Variance violation in generic type instantiation           |
| `E-TYP-1521` | Error    | Compile-time | Invariant type parameter requires exact type match         |
| `E-TYP-1530` | Error    | Compile-time | Type inference failed; unable to determine type            |
| `E-TYP-1531` | Error    | Compile-time | Float literal explicit suffix does not match expected type |
