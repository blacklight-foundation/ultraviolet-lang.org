---
title: "B.7 Contract Grammar"
description: "B.7 Contract Grammar from Appendix B. Complete Grammar Reference of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "complete-grammar-reference"
specSection: "b7-contract-grammar"
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

## B.7 Contract Grammar

```text
contract_clause    ::= "|:" contract_body
contract_body      ::= precondition_expr "|=" postcondition_expr
                     | "|=" postcondition_expr
                     | precondition_expr
precondition_expr  ::= predicate_expr
postcondition_expr ::= predicate_expr
predicate_expr     ::= logical_or_expr
contract_intrinsic ::= "@result" | "@entry" "(" expression ")"

(* Contract intrinsics parse in any primary-expression position; `@result`
   outside a postcondition and `@entry` outside a contract predicate are
   rejected statically (E-SEM-2806, E-CON-0415, E-CON-0416). *)

type_invariant ::= "|:" "{" predicate_expr "}"
loop_invariant ::= "|:" "{" predicate_expr "}"
```
