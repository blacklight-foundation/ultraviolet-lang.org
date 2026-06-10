---
title: "B.11 Async Grammar"
description: "B.11 Async Grammar from Appendix B. Complete Grammar Reference of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "complete-grammar-reference"
specSection: "b11-async-grammar"
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

## B.11 Async Grammar

```text
(* The following productions are informative shape restatements of the
   built-in Async class declaration and of async procedure and loop usage;
   the normative surface forms are ordinary class, procedure, and loop syntax. *)
async_class  ::= "class" "Async" "<" type_param (";" type_param)* ">"
type_param   ::= identifier ("=" type)?
async_procedure ::= procedure_decl

wait_expr       ::= "wait" expression
yield_expr      ::= "yield" "release"? expression
yield_from_expr ::= "yield" "release"? "from" expression

async_loop ::= "loop" pattern "in" expression block_expr
sync_expr  ::= "sync" expression
race_expr  ::= "race" "{" race_arm ("," race_arm)* ","? "}"
race_arm   ::= expression "->" "|" pattern "|" race_handler
race_handler ::= expression | "yield" expression
all_expr   ::= "all" "{" expression ("," expression)* ","? "}"
```
