---
title: "5.10 Parsing Diagnostics Supplement"
description: "5.10 Parsing Diagnostics Supplement from 5. Parsing and AST Infrastructure of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "parsing-and-ast-infrastructure"
specSection: "510-parsing-diagnostics-supplement"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
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
