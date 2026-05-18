---
title: "B.9 Key System Grammar"
description: "B.9 Key System Grammar from Appendix B. Complete Grammar Reference of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "complete-grammar-reference"
specSection: "b9-key-system-grammar"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/complete-grammar-reference/">Appendix B. Complete Grammar Reference</a>
  <span>Complete Grammar Reference</span>
</div>

## B.9 Key System Grammar

```text
key_path_expr   ::= root_segment ("." path_segment)*
root_segment    ::= key_marker? identifier index_suffix?
path_segment    ::= key_marker? identifier index_suffix?
key_marker      ::= "#"
index_suffix    ::= "[" expression "]"

key_block        ::= "#" path_list key_block_mod* key_mode_spec? block_expr
path_list        ::= key_path_expr ("," key_path_expr)*
key_block_mod    ::= "dynamic" | "speculative" | "ordered"
key_mode_spec    ::= key_mode | release_modifier
release_modifier ::= "release" key_mode

speculative_block ::= "#" path_list "speculative" "write" block_expr
coarsened_path    ::= path_segment* "#" path_segment+
```
