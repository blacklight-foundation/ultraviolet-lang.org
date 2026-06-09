---
title: "B.10 Concurrency Grammar"
description: "B.10 Concurrency Grammar from Appendix B. Complete Grammar Reference of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "complete-grammar-reference"
specSection: "b10-concurrency-grammar"
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

## B.10 Concurrency Grammar

```text
parallel_block ::= "parallel" domain_expr block_options? block_expr
domain_expr    ::= expression
block_options  ::= "[" block_option ("," block_option)* "]"
block_option   ::= "cancel" ":" expression

spawn_expr        ::= "spawn" spawn_option_list? block_expr
spawn_option_list ::= "[" spawn_option ("," spawn_option)* "]"
spawn_option      ::= "name" ":" string_literal

dispatch_expr        ::= "dispatch" pattern "in" range_expression key_clause? dispatch_option_list? block_expr
key_clause           ::= "key" key_path_expr key_mode
key_mode             ::= "read" | "write"
dispatch_option_list ::= "[" dispatch_option ("," dispatch_option)* "]"
dispatch_option      ::= "reduce" ":" reduce_op
reduce_op            ::= "+" | "*" | "min" | "max" | "and" | "or" | identifier

memory_order_attribute ::= "#" memory_order
memory_order           ::= "relaxed" | "acquire" | "release" | "acqrel" | "seqcst"
```
