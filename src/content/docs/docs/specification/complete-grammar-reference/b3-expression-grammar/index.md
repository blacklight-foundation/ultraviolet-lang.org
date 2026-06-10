---
title: "B.3 Expression Grammar"
description: "B.3 Expression Grammar from Appendix B. Complete Grammar Reference of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "complete-grammar-reference"
specSection: "b3-expression-grammar"
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

## B.3 Expression Grammar

```text
expression         ::= attributed_expr | unattributed_expr
attributed_expr    ::= attribute_list expression
unattributed_expr  ::= range_expression | logical_or_expr

range_expression    ::= exclusive_range | inclusive_range | from_range | to_range | to_inclusive_range | full_range
exclusive_range     ::= logical_or_expr ".." logical_or_expr
inclusive_range     ::= logical_or_expr "..=" logical_or_expr
from_range          ::= logical_or_expr ".."
to_range            ::= ".." logical_or_expr
to_inclusive_range  ::= "..=" logical_or_expr
full_range          ::= ".."

logical_or_expr     ::= logical_and_expr ("||" logical_and_expr)*
logical_and_expr    ::= comparison_expr ("&&" comparison_expr)*
comparison_expr     ::= bitwise_or_expr (comparison_op bitwise_or_expr)*
comparison_op       ::= "==" | "!=" | "<" | "<=" | ">" | ">="
bitwise_or_expr     ::= bitwise_xor_expr ("|" bitwise_xor_expr)*
bitwise_xor_expr    ::= bitwise_and_expr ("^" bitwise_and_expr)*
bitwise_and_expr    ::= shift_expr ("&" shift_expr)*
shift_expr          ::= additive_expr (shift_op additive_expr)*
shift_op            ::= "<<" | ">>"
additive_expr       ::= multiplicative_expr (additive_op multiplicative_expr)*
additive_op         ::= "+" | "-"
multiplicative_expr ::= power_expr (multiplicative_op power_expr)*
multiplicative_op   ::= "*" | "/" | "%"
power_expr          ::= cast_expr ("**" power_expr)?
cast_expr           ::= unary_expr ("as" type)?

unary_expr     ::= unary_operator unary_expr | pipeline_expr
unary_operator ::= "!" | "-" | "&" | "*" | "^" | "move" | "widen"
pipeline_expr  ::= postfix_expr ("=>" postfix_expr)*

postfix_expr   ::= primary_expr postfix_suffix*
postfix_suffix ::= "." identifier | "." decimal_integer | "[" expression "]" | "~>" identifier "(" argument_list? ")" | "(" argument_list? ")" | "?"

primary_expr ::= literal | identifier_expr | path_expr | tuple_literal | array_literal | record_literal | enum_literal | closure_expr | if_expr | loop_expr | block_expr | move_expr | copy_expr | widen_expr | address_of_expr | null_ptr_expr | transmute_expr | alloc_expr | sync_expr | race_expr | all_expr | wait_expr | yield_expr | yield_from_expr | spawn_expr | parallel_block | dispatch_expr | fence_expr | comptime_expr | comptime_if | comptime_loop | quote_expr | quote_type | quote_pattern | type_literal | splice_expr | splice_ident | contract_intrinsic

literal ::= integer_literal | float_literal | string_literal | char_literal | bool_literal | null_literal | unit_literal

identifier_expr ::= identifier
path_expr       ::= type_path "::" identifier

tuple_literal       ::= "(" tuple_expr_elements? ")"
tuple_expr_elements ::= expression ";" | expression ("," expression)+
array_literal       ::= "[" array_segment_list? "]"
array_segment_list  ::= array_segment ("," array_segment)*
array_segment       ::= expression | expression ";" expression
expression_list     ::= expression ("," expression)* ","?
record_literal      ::= identifier "{" field_init_list "}" | state_specific_type "{" field_init_list? "}"
field_init_list     ::= field_init ("," field_init)* ","?
field_init          ::= identifier ":" expression | identifier
enum_literal        ::= type_path "::" identifier variant_args?
variant_args        ::= "(" expression_list ")" | "{" field_init_list "}"

argument_list ::= argument ("," argument)* ","?
argument      ::= ("move" | "copy")? expression

closure_expr       ::= "|" closure_param_list? "|" ("->" type)? closure_body
closure_param_list ::= closure_param ("," closure_param)* ","?
closure_param      ::= "move"? identifier (":" type)?
closure_body       ::= expression | block_expr

Within `closure_expr`, a typed parameter annotation whose outermost constructor is `union_type` MUST be parenthesized as `("(" type ")")`.

if_expr        ::= "if" expression if_tail
if_tail        ::= block_expr ("else" (block_expr | if_expr))?
                 | "is" if_case_pattern block_expr ("else" (block_expr | if_expr))?
                 | "is" "{" if_case+ if_case_else? "}"
if_case        ::= if_case_pattern block_expr
if_case_pattern ::= pattern | ":" type
if_case_else   ::= "else" block_expr
loop_expr      ::= "loop" loop_condition? loop_invariant? block_expr
loop_condition ::= expression | pattern (":" type)? "in" expression
loop_invariant ::= "|:" "{" predicate_expr "}"

block_expr ::= "{" statement* expression? "}"

move_expr        ::= "move" place_expr
copy_expr        ::= "copy" unary_expr
widen_expr       ::= "widen" unary_expr
address_of_expr  ::= "&" place_expr
null_ptr_expr    ::= "Ptr" "::" "null" "()"
transmute_expr   ::= "transmute" "<" type "," type ">" "(" expression ")"
```
