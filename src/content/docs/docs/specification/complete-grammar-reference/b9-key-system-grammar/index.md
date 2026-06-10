---
title: "B.9 Key System Grammar"
description: "B.9 Key System Grammar from Appendix B. Complete Grammar Reference of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "complete-grammar-reference"
specSection: "b9-key-system-grammar"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/complete-grammar-reference/">Appendix B. Complete Grammar Reference</a>
  <span>Complete Grammar Reference</span>
</div>

## B.9 Key System Grammar

```text
key_path_expr ::= key_root key_seg*
key_root      ::= identifier
key_seg       ::= "." key_field | "[" key_index "]"
key_field     ::= key_marker? identifier
key_index     ::= key_marker? expression
key_marker    ::= "#"

key_block_stmt ::= key_block_head key_path_list key_options? block_expr
key_block_head ::= "%read" | "%write" | "%release" key_mode | "%speculative" "write"
key_path_list  ::= key_path_expr ("," key_path_expr)*
key_options    ::= "[" key_option ("," key_option)* ","? "]"
key_option     ::= "ordered"

fence_expr  ::= "fence" "(" fence_order ")"
fence_order ::= "acquire" | "release" | "seqcst"
```
