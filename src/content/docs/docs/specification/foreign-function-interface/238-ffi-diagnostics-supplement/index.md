---
title: "23.8 FFI Diagnostics Supplement"
description: "23.8 FFI Diagnostics Supplement from 23. Foreign Function Interface of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "foreign-function-interface"
specSection: "238-ffi-diagnostics-supplement"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/foreign-function-interface/">23. Foreign Function Interface</a>
  <span>Foreign Function Interface</span>
</div>

## 23.8 FFI Diagnostics Supplement

This section owns FFI diagnostics not already attached to the surface-attribute or foreign-contract subsections.

| Code         | Severity | Detection    | Condition                     |
| ------------ | -------- | ------------ | ----------------------------- |
| `E-SYS-3352` | Error    | Compile-time | Unsupported extern ABI string (`ExternAbi-Unknown-Err`) |
