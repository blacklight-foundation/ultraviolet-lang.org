---
title: "20.9 Structured Parallelism Diagnostics Supplement"
description: "20.9 Structured Parallelism Diagnostics Supplement from 20. Structured Parallelism of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "structured-parallelism"
specSection: "209-structured-parallelism-diagnostics-supplement"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
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
