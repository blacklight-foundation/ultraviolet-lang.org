---
title: "B.2 Type Grammar"
description: "B.2 Type Grammar from Appendix B. Complete Grammar Reference of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "complete-grammar-reference"
specSection: "b2-type-grammar"
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

## B.2 Type Grammar

```text
type                ::= permission? non_permission_type refinement_clause?
non_permission_type ::= union_type | non_union_type
non_union_type      ::= primitive_type | tuple_type | array_type | slice_type | function_type | closure_type | safe_pointer_type | raw_pointer_type | string_type | bytes_type | dynamic_type | opaque_type | state_specific_type | nominal_type
permission          ::= "const" | "unique" | "shared"

primitive_type ::= integer_type | float_type | bool_type | char_type | unit_type | never_type | string_type | bytes_type
integer_type   ::= signed_int | unsigned_int | pointer_int
signed_int     ::= "i8" | "i16" | "i32" | "i64" | "i128"
unsigned_int   ::= "u8" | "u16" | "u32" | "u64" | "u128"
pointer_int    ::= "isize" | "usize"
float_type     ::= "f16" | "f32" | "f64"
bool_type      ::= "bool"
char_type      ::= "char"
unit_type      ::= "(" ")"
never_type     ::= "!"

tuple_type       ::= "(" ")" | "(" type ";)" | "(" type ("," type)+ ")"
array_type       ::= "[" type ";" expression "]"
slice_type       ::= "[" type "]"
union_type       ::= non_union_type ("|" non_union_type)+

nominal_type        ::= type_path generic_args?
type_path           ::= identifier ("::" identifier)*
opaque_type         ::= "opaque" class_path
dynamic_type        ::= "$" class_path
class_path          ::= type_path

string_type  ::= "string" ("@" string_state)?
bytes_type   ::= "bytes" ("@" bytes_state)?
string_state ::= "Managed" | "View"
bytes_state  ::= "Managed" | "View"

safe_pointer_type ::= "Ptr" "<" type ">" ("@" pointer_state)?
pointer_state     ::= "Valid" | "Null" | "Expired"
raw_pointer_type  ::= "*" raw_pointer_qual type
raw_pointer_qual  ::= "imm" | "mut"

function_type        ::= sparse_function_type | closure_type
sparse_function_type ::= "(" param_type_list? ")" "->" type
closure_type         ::= "|" param_type_list? "|" "->" type closure_deps?
closure_deps         ::= "[" "shared" ":" "{" shared_dep_list? "}" "]"
shared_dep_list      ::= shared_dep ("," shared_dep)*
shared_dep           ::= identifier ":" type
param_type_list      ::= param_type ("," param_type)* ","?
param_type           ::= "move"? type

Within `closure_type`, a parameter type whose outermost constructor is `union_type` MUST be parenthesized as `("(" type ")")`.

generic_params     ::= "<" generic_param_list ">"
generic_param_list ::= generic_param (";" generic_param)*
generic_param      ::= identifier bound_clause? default_clause?
bound_clause       ::= "<:" class_bound_list
default_clause     ::= "=" type
class_bound_list   ::= class_bound ("," class_bound)*
class_bound        ::= type_path generic_args?
generic_args       ::= "<" type_arg_list ">"
type_arg_list      ::= type ("," type)* ","?

refinement_clause     ::= "|:" "{" predicate_expr "}"

modal_type_name     ::= type_path generic_args?
state_specific_type ::= modal_type_name "@" state_name
state_name          ::= identifier
```
