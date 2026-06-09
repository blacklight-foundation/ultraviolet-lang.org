---
title: "B.11 Async Grammar"
description: "B.11 Async Grammar from Appendix B. Complete Grammar Reference of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "complete-grammar-reference"
specSection: "b11-async-grammar"
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

## B.11 Async Grammar

```text
async_class  ::= "class" "Async" "<" type_param (";" type_param)* ">"
type_param   ::= identifier ("=" type)?
async_procedure ::= procedure_decl

yield_expr      ::= "yield" "release"? expression
yield_from_expr ::= "yield" "release"? "from" expression

async_loop ::= "loop" pattern "in" expression block_expr
sync_expr  ::= "sync" expression
race_expr  ::= "race" "{" race_arm ("," race_arm)* ","? "}"
race_arm   ::= expression "->" "|" pattern "|" race_handler
race_handler ::= expression | "yield" expression
all_expr   ::= "all" "{" expression ("," expression)* ","? "}"
```
