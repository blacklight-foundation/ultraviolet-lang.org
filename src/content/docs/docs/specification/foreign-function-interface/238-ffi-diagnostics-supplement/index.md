---
title: "23.8 FFI Diagnostics Supplement"
description: "23.8 FFI Diagnostics Supplement from 23. Foreign Function Interface of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "foreign-function-interface"
specSection: "238-ffi-diagnostics-supplement"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/foreign-function-interface/">23. Foreign Function Interface</a>
  <span>Foreign Function Interface</span>
</div>

## 23.8 FFI Diagnostics Supplement

This section owns FFI diagnostics not already attached to the surface-attribute or foreign-contract subsections.

| Code         | Severity | Detection    | Condition                     |
| ------------ | -------- | ------------ | ----------------------------- |
| `E-SYS-3352` | Error    | Compile-time | Unsupported extern ABI string |
