---
title: "B.13 FFI Grammar"
description: "B.13 FFI Grammar from Appendix B. Complete Grammar Reference of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "complete-grammar-reference"
specSection: "b13-ffi-grammar"
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

## B.13 FFI Grammar

```text
extern_block                 ::= attribute_list? visibility? "extern" abi_string? "{" extern_item* "}"
abi_string                   ::= string_literal
extern_item                  ::= foreign_procedure
foreign_procedure            ::= attribute_list? visibility? "procedure" identifier generic_params? signature predicate_clause? contract_clause? foreign_contract_clause_list? terminator

ffi_verification_attr        ::= "#" ffi_verification_mode
ffi_verification_mode        ::= "static" | "dynamic"
foreign_contract             ::= "|:" "@foreign_assumes" "(" predicate_expr ")"
                               | "|:" "@foreign_ensures" "(" ensures_predicate ")"
ensures_predicate            ::= predicate_expr | "@error" ":" predicate_expr | "@null_result" ":" predicate_expr
foreign_contract_clause_list ::= foreign_contract+
```
