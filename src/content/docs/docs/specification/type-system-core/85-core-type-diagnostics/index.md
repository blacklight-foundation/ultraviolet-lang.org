---
title: "8.5 Core Type Diagnostics"
description: "8.5 Core Type Diagnostics from 8. Type System Core of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "type-system-core"
specSection: "85-core-type-diagnostics"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
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
