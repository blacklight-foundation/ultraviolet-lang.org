---
title: "B.6 Declaration Grammar"
description: "B.6 Declaration Grammar from Appendix B. Complete Grammar Reference of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "complete-grammar-reference"
specSection: "b6-declaration-grammar"
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

## B.6 Declaration Grammar

```text
top_level_item ::= import_decl | using_decl | static_decl | procedure_decl | comptime_procedure_decl | record_decl | enum_decl | modal_decl | class_declaration | type_alias_decl | extern_block | derive_target_decl

import_decl     ::= attribute_list? visibility? "import" module_path ("as" identifier)?
using_decl      ::= attribute_list? visibility? "using" using_clause
using_clause    ::= module_path "::" identifier ("as" identifier)?
                  | module_path "::" using_list
                  | module_path "::" "*"
using_list      ::= "{" using_specifier ("," using_specifier)* ","? "}"
using_specifier ::= identifier ("as" identifier)?
module_path     ::= identifier ("::" identifier)*

static_decl ::= attribute_list? visibility? ("let" | "var") binding_decl

visibility ::= "public" | "internal" | "private"

procedure_decl ::= attribute_list? visibility? "procedure" identifier generic_params? signature predicate_clause? contract_clause? block_expr
signature      ::= "(" param_list? ")" ("->" return_type)?
param_list     ::= param ("," param)* ","?
param          ::= param_mode? identifier ":" type
param_mode     ::= "move"
return_type    ::= type | union_return
union_return   ::= type ("|" type)+

method_def         ::= attribute_list? visibility? "override"? "procedure" identifier generic_params? "(" receiver ("," param_list)? ")" ("->" return_type)? contract_clause? block_expr
receiver           ::= receiver_shorthand | explicit_receiver
receiver_shorthand ::= "~" | "~!" | "~%"
explicit_receiver  ::= param_mode? "self" ":" type

record_decl       ::= attribute_list? visibility? "record" identifier generic_params? implements_clause? predicate_clause? "{" record_body "}" invariant_clause?
record_body       ::= record_member*
record_member     ::= record_field_decl | method_def
record_field_decl ::= attribute_list? visibility? identifier ":" type record_field_init?
record_field_init ::= "=" expression
field_decl        ::= visibility? identifier ":" type
implements_clause ::= "<:" class_list
class_list        ::= type_path ("," type_path)*

enum_decl       ::= attribute_list? visibility? "enum" identifier generic_params? implements_clause? predicate_clause? "{" variant_members? "}" invariant_clause?
variant_members ::= variant (terminator variant)* terminator?
variant         ::= identifier variant_payload? ("=" integer_literal)?
variant_payload ::= "(" type_list ")" | "{" field_decl_list "}"
type_list       ::= type ("," type)* ","?
field_decl_list ::= field_decl ("," field_decl)* ","?

modal_decl        ::= attribute_list? visibility? "modal" identifier generic_params? implements_clause? predicate_clause? "{" state_block+ "}" invariant_clause?
state_block       ::= "@" state_name "{" state_member* "}"
state_member      ::= state_field_decl | state_method_def | transition_def
state_field_decl  ::= attribute_list? visibility? identifier ":" type
state_method_def  ::= attribute_list? visibility? "procedure" identifier generic_params? state_method_signature contract_clause? block_expr
transition_def    ::= attribute_list? visibility? "transition" identifier "(" param_list ")" "->" "@" target_state block_expr
target_state      ::= identifier

class_declaration   ::= attribute_list? visibility? "modal"? "class" identifier generic_params? ("<:" superclass_bounds)? predicate_clause? "{" class_item* "}"
superclass_bounds   ::= class_bound ("+" class_bound)*
class_item          ::= abstract_procedure | concrete_procedure | abstract_field | abstract_state | associated_type
abstract_procedure  ::= "procedure" identifier signature contract_clause?
concrete_procedure  ::= "procedure" identifier signature contract_clause? block_expr
abstract_field      ::= attribute_list? visibility? key_boundary? identifier ":" type
abstract_state      ::= "@" identifier "{" field_list? "}"
field_list          ::= abstract_field ("," abstract_field)* ","?
associated_type     ::= "type" identifier ("=" type)?

type_alias_decl ::= attribute_list? visibility? "type" identifier generic_params? predicate_clause? "=" type

extern_block      ::= attribute_list? visibility? "extern" abi_string? "{" extern_item* "}"
abi_string        ::= string_literal
extern_item       ::= foreign_procedure
foreign_procedure ::= attribute_list? visibility? "procedure" identifier generic_params? signature predicate_clause? contract_clause? foreign_contract_clause_list? terminator
```
