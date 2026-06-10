---
title: "21.6 Async Diagnostics Supplement"
description: "21.6 Async Diagnostics Supplement from 21. Asynchronous Operations of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "asynchronous-operations"
specSection: "216-async-diagnostics-supplement"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/asynchronous-operations/">21. Asynchronous Operations</a>
  <span>Asynchronous Operations</span>
</div>

## 21.6 Async Diagnostics Supplement

This section owns async diagnostics not covered by the syntax-local tables in §§21.1 through 21.5.

| Code         | Severity | Detection    | Condition                                       |
| ------------ | -------- | ------------ | ----------------------------------------------- |
| `E-CON-0203` | Error    | Compile-time | `result` type mismatch with `Result` parameter (`Return-Async-Type-Err`, `Return-Async-Unit-Err`) |
| `E-CON-0230` | Error    | Compile-time | Error propagation in infallible async procedure (`Async-Try-Infallible-Err`) |
