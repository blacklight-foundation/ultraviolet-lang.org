---
title: "5.10 Parsing Diagnostics Supplement"
description: "5.10 Parsing Diagnostics Supplement from 5. Parsing and AST Infrastructure of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "parsing-and-ast-infrastructure"
specSection: "510-parsing-diagnostics-supplement"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
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
| `E-SRC-0510` | Error    | Compile-time | Missing statement terminator (`Missing-Terminator-Err`) |
| `E-SRC-0520` | Error    | Compile-time | Generic syntax error (unexpected token) (`Parse-KeyMode-Err`, `Parse-Syntax-Err`) |
| `E-SRC-0521` | Error    | Compile-time | Trailing comma in single-line list (`Trailing-Comma-Err`) |
