---
title: "20.9 Structured Parallelism Diagnostics Supplement"
description: "20.9 Structured Parallelism Diagnostics Supplement from 20. Structured Parallelism of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "structured-parallelism"
specSection: "209-structured-parallelism-diagnostics-supplement"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/structured-parallelism/">20. Structured Parallelism</a>
  <span>Structured Parallelism</span>
</div>

## 20.9 Structured Parallelism Diagnostics Supplement

This section owns the structured-parallelism runtime panic defined by reduced dispatch over an empty iteration space.

| Code         | Severity | Detection | Condition                                   |
| ------------ | -------- | --------- | ------------------------------------------- |
| `P-SEM-2862` | Panic    | Runtime   | Reduced dispatch over empty iteration space |
