---
title: "23.8 FFI Diagnostics Supplement"
description: "23.8 FFI Diagnostics Supplement from 23. Foreign Function Interface of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "foreign-function-interface"
specSection: "238-ffi-diagnostics-supplement"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
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
