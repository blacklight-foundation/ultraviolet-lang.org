---
title: "8.5 Core Type Diagnostics"
description: "8.5 Core Type Diagnostics from 8. Type System Core of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "type-system-core"
specSection: "85-core-type-diagnostics"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/type-system-core/">8. Type System Core</a>
  <span>Type System Core</span>
</div>

## 8.5 Core Type Diagnostics

This section owns core type-inference and alias-cycle diagnostics that are not specific to a single feature chapter.

| Code         | Severity | Detection    | Condition                                                  |
| ------------ | -------- | ------------ | ---------------------------------------------------------- |
| `E-TYP-1506` | Error    | Compile-time | Type alias cycle detected (`TypeAlias-Recursive-Err`) |
| `E-TYP-1530` | Error    | Compile-time | Type inference failed; unable to determine type (`PtrNull-Infer-Err`, `T-LetStmt-Infer-Err`, `Unify-Fail`) |
| `E-TYP-1531` | Error    | Compile-time | Float literal explicit suffix does not match expected type |
