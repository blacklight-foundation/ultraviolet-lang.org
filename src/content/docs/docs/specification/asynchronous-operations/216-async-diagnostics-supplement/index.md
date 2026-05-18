---
title: "21.6 Async Diagnostics Supplement"
description: "21.6 Async Diagnostics Supplement from 21. Asynchronous Operations of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "asynchronous-operations"
specSection: "216-async-diagnostics-supplement"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
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
