---
title: "4.3 Source Loading and Lexical Diagnostics"
description: "4.3 Source Loading and Lexical Diagnostics from 4. Source Text and Lexical Structure of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "source-text-and-lexical-structure"
specSection: "43-source-loading-and-lexical-diagnostics"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/source-text-and-lexical-structure/">4. Source Text and Lexical Structure</a>
  <span>Source Text and Lexical Structure</span>
</div>

## 4.3 Source Loading and Lexical Diagnostics

This section owns source-loading and lexical diagnostics not reintroduced by later feature chapters.

| Code         | Severity | Detection    | Condition                                                    |
| ------------ | -------- | ------------ | ------------------------------------------------------------ |
| `E-SRC-0101` | Error    | Compile-time | Invalid UTF-8 byte sequence                                  |
| `E-SRC-0102` | Error    | Compile-time | Failed to read source file                                   |
| `E-SRC-0103` | Error    | Compile-time | Embedded BOM found after the first position                  |
| `E-SRC-0104` | Error    | Compile-time | Forbidden control character or null byte                     |
| `E-SRC-0301` | Error    | Compile-time | Unterminated string literal                                  |
| `E-SRC-0302` | Error    | Compile-time | Invalid escape sequence                                      |
| `E-SRC-0303` | Error    | Compile-time | Invalid character literal                                    |
| `E-SRC-0304` | Error    | Compile-time | Malformed numeric literal                                    |
| `E-SRC-0306` | Error    | Compile-time | Unterminated block comment                                   |
| `E-SRC-0307` | Error    | Compile-time | Invalid Unicode in identifier                                |
| `E-SRC-0308` | Error    | Compile-time | Lexically sensitive Unicode character outside `unsafe` block |
| `E-SRC-0309` | Error    | Compile-time | Tokenization failed to classify a character sequence         |
| `E-SRC-0310` | Error    | Compile-time | Confusable identifier pair                                   |
| `E-SRC-0311` | Error    | Compile-time | Mixed-script identifier                                      |
| `W-SRC-0101` | Warning  | Compile-time | UTF-8 BOM present at the start of the file                   |
| `W-SRC-0301` | Warning  | Compile-time | Leading zeros in decimal literal                             |
| `W-SRC-0308` | Warning  | Compile-time | Lexically sensitive Unicode character within `unsafe` block  |
