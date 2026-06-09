---
title: "B.5 Statement Grammar"
description: "B.5 Statement Grammar from Appendix B. Complete Grammar Reference of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "complete-grammar-reference"
specSection: "b5-statement-grammar"
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

## B.5 Statement Grammar

```text
statement ::= binding_stmt | using_local_stmt | assignment_stmt | compound_assign | expr_stmt | return_stmt | break_stmt | continue_stmt | defer_stmt | region_stmt | frame_stmt | unsafe_block | key_block_stmt | comptime_stmt

binding_stmt     ::= ("let" | "var") pattern (":" type)? binding_op expression terminator
using_local_stmt ::= "using" identifier "as" identifier terminator
binding_op       ::= "=" | ":="

assignment_stmt ::= place_expr "=" expression terminator
compound_assign ::= place_expr compound_op expression terminator
compound_op     ::= "+=" | "-=" | "*=" | "/=" | "%="
place_expr      ::= identifier | postfix_expr "." identifier | postfix_expr "[" expression "]"

expr_stmt  ::= expression terminator
terminator ::= ";" | newline
newline    ::= "\n"

return_stmt   ::= "return" expression?
break_stmt    ::= "break" expression?
continue_stmt ::= "continue"

defer_stmt   ::= "defer" block_expr
unsafe_block ::= "unsafe" block_expr
```
