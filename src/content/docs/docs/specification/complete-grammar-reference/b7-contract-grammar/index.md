---
title: "B.7 Contract Grammar"
description: "B.7 Contract Grammar from Appendix B. Complete Grammar Reference of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "complete-grammar-reference"
specSection: "b7-contract-grammar"
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

## B.7 Contract Grammar

```text
contract_clause    ::= "|:" contract_body
contract_body      ::= precondition_expr
                     | precondition_expr "=>" postcondition_expr
                     | "=>" postcondition_expr
precondition_expr  ::= predicate_expr
postcondition_expr ::= predicate_expr
predicate_expr     ::= logical_or_expr
contract_intrinsic ::= "@result" | "@entry" "(" expression ")"

type_invariant ::= "where" "{" predicate_expr "}"
loop_invariant ::= "where" "{" predicate_expr "}"
```
