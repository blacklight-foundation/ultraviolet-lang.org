---
title: "21.6 Async Diagnostics Supplement"
description: "21.6 Async Diagnostics Supplement from 21. Asynchronous Operations of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "asynchronous-operations"
specSection: "216-async-diagnostics-supplement"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/asynchronous-operations/">21. Asynchronous Operations</a>
  <span>Asynchronous Operations</span>
</div>

## 21.6 Async Diagnostics Supplement

This section owns async diagnostics not covered by the syntax-local tables in §§21.1 through 21.5.

| Code         | Severity | Detection    | Condition                                       |
| ------------ | -------- | ------------ | ----------------------------------------------- |
| `E-CON-0203` | Error    | Compile-time | `result` type mismatch with `Result` parameter  |
| `E-CON-0230` | Error    | Compile-time | Error propagation in infallible async procedure |
