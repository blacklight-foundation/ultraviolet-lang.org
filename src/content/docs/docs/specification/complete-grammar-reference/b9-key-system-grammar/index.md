---
title: "B.9 Key System Grammar"
description: "B.9 Key System Grammar from Appendix B. Complete Grammar Reference of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "complete-grammar-reference"
specSection: "b9-key-system-grammar"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
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

key_block        ::= key_block_head path_list key_options? block_expr
key_block_head   ::= "%read" | "%write" | "%release" key_mode | "%speculative" "write"
path_list        ::= key_path_expr ("," key_path_expr)*
key_options      ::= "[" key_option ("," key_option)* ","? "]"
key_option       ::= "ordered"

speculative_block ::= "%speculative" "write" path_list block_expr
coarsened_path    ::= path_segment* "#" path_segment+
```
