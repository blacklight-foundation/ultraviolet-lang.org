---
title: "5.10 Parsing Diagnostics Supplement"
description: "5.10 Parsing Diagnostics Supplement from 5. Parsing and AST Infrastructure of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "parsing-and-ast-infrastructure"
specSection: "510-parsing-diagnostics-supplement"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/parsing-and-ast-infrastructure/">5. Parsing and AST Infrastructure</a>
  <span>Parsing and AST Infrastructure</span>
</div>

## 5.10 Parsing Diagnostics Supplement

This section owns parser-level diagnostics that are shared across feature chapters and therefore are not duplicated in feature-local diagnostic tables.

| Code         | Severity | Detection    | Condition                               |
| ------------ | -------- | ------------ | --------------------------------------- |
| `E-CNF-0401` | Error    | Compile-time | Reserved keyword used as identifier     |
| `E-SRC-0510` | Error    | Compile-time | Missing statement terminator            |
| `E-SRC-0520` | Error    | Compile-time | Generic syntax error (unexpected token) |
| `E-SRC-0521` | Error    | Compile-time | Trailing comma in single-line list      |
