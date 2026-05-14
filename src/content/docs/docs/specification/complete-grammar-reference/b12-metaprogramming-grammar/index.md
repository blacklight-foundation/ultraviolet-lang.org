---
title: "B.12 Metaprogramming Grammar"
description: "B.12 Metaprogramming Grammar from Appendix B. Complete Grammar Reference of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "complete-grammar-reference"
specSection: "b12-metaprogramming-grammar"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/complete-grammar-reference/">Appendix B. Complete Grammar Reference</a>
  <span>Complete Grammar Reference</span>
</div>

## B.12 Metaprogramming Grammar

```text
comptime_stmt           ::= attribute_list? "comptime" block_expr
comptime_expr           ::= attribute_list? "comptime" "{" expression "}"
comptime_if             ::= "comptime" "if" expression block_expr ("else" (comptime_if | block_expr))?
comptime_loop           ::= "comptime" "loop" pattern (":" type)? "in" expression block_expr
comptime_procedure_decl ::= attribute_list? "comptime" visibility? "procedure" identifier generic_params? signature contract_clause? block_expr

type_literal   ::= "Type" "::<" type ">"
quote_expr     ::= "quote" "{" quoted_content "}"
quote_type     ::= "quote" "type" "{" type "}"
quote_pattern  ::= "quote" "pattern" "{" pattern "}"
quoted_content ::= expression | statement | top_level_item
splice_expr    ::= "$(" expression ")"
splice_ident   ::= "$" identifier

derive_target_decl  ::= "derive" "target" identifier "(" "target" ":" "Type" ")" derive_contract_opt block_expr
derive_contract_opt ::= "|:" derive_clause ("," derive_clause)*
derive_clause       ::= "emits" identifier | "requires" identifier
```
