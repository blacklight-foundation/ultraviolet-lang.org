---
title: "B.10 Concurrency Grammar"
description: "B.10 Concurrency Grammar from Appendix B. Complete Grammar Reference of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "complete-grammar-reference"
specSection: "b10-concurrency-grammar"
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

## B.10 Concurrency Grammar

```text
parallel_block       ::= "parallel" domain_expr parallel_option_list? block_expr
domain_expr          ::= expression
parallel_option_list ::= "[" parallel_option ("," parallel_option)* "]"
parallel_option      ::= "cancel" ":" expression
                       | "name" ":" string_literal
                       | "workgroup" ":" dim3_const
                       | "workgroups" ":" dim3_const
dim3_const           ::= "(" expression "," expression "," expression ")"

spawn_expr        ::= "spawn" spawn_option_list? block_expr
spawn_option_list ::= "[" spawn_option ("," spawn_option)* "]"
spawn_option      ::= "name" ":" string_literal
                    | "affinity" ":" expression
                    | "priority" ":" expression

dispatch_expr        ::= "dispatch" pattern "in" range_expression key_clause? dispatch_option_list? block_expr
key_clause           ::= "key" key_path_expr key_mode
key_mode             ::= "read" | "write"
dispatch_option_list ::= "[" dispatch_option ("," dispatch_option)* "]"
dispatch_option      ::= "reduce" ":" reduce_op
                       | "ordered"
                       | "chunk" ":" expression
                       | "workgroup" ":" dim3_const
reduce_op            ::= "+" | "*" | "min" | "max" | "and" | "or" | identifier

memory_order_attribute ::= "#" memory_order
memory_order           ::= "relaxed" | "acquire" | "release" | "acqrel" | "seqcst"
```
