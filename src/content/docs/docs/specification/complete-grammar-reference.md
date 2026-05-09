---
title: "Complete Grammar Reference"
description: "Appendix B. Complete Grammar Reference of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T18:13:03.158Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## Appendix B. Complete Grammar Reference

This appendix consolidates canonical grammar productions into one parser-oriented reference.

### B.1 Lexical Grammar

```text
source_file     ::= normalized_line*
normalized_line ::= code_point* line_terminator?
line_terminator ::= "\n"
code_point      ::= (* Unicode scalar except U+000A and prohibited code points *)

identifier     ::= ident_start ident_continue*
ident_start    ::= (* Unicode XID_Start *) | "_"
ident_continue ::= (* Unicode XID_Continue *) | "_"

integer_literal  ::= (decimal_integer | hex_integer | octal_integer | binary_integer) int_suffix?
decimal_integer  ::= dec_digit ("_"* dec_digit)*
hex_integer      ::= "0x" hex_digit ("_"* hex_digit)*
octal_integer    ::= "0o" oct_digit ("_"* oct_digit)*
binary_integer   ::= "0b" bin_digit ("_"* bin_digit)*
int_suffix       ::= "i8" | "i16" | "i32" | "i64" | "i128" | "u8" | "u16" | "u32" | "u64" | "u128" | "isize" | "usize"
dec_digit        ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
hex_digit        ::= dec_digit | "a" | "b" | "c" | "d" | "e" | "f" | "A" | "B" | "C" | "D" | "E" | "F"
oct_digit        ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7"
bin_digit        ::= "0" | "1"

float_literal ::= decimal_integer "." decimal_integer? exponent? float_suffix?
exponent      ::= ("e" | "E") ("+" | "-")? decimal_integer
float_suffix  ::= "f" | "f16" | "f32" | "f64"

string_literal   ::= '"' (string_char | escape_sequence)* '"'
string_char      ::= (* Unicode scalar except ", \\, or U+000A *)
escape_sequence  ::= "\n" | "\r" | "\t" | "\\" | "\"" | "\'" | "\0" | "\x" hex_digit hex_digit | "\u{" hex_digit+ "}"

char_literal ::= "'" (char_content | escape_sequence) "'"
char_content ::= (* Unicode scalar except ', \\, or U+000A *)

bool_literal ::= "true" | "false"
null_literal ::= "null"
unit_literal ::= "(" ")"
```

### B.2 Type Grammar

```text
type                ::= permission? non_permission_type refinement_clause?
non_permission_type ::= union_type | non_union_type
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
tuple_elements   ::= type ";" | type ("," type)+
array_type       ::= "[" type ";" expr "]"
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

pointer_type      ::= safe_pointer_type | raw_pointer_type
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
refinement_type       ::= type refinement_clause
param_with_constraint ::= identifier ":" type "|:" "{" predicate_expr "}"

modal_type_name     ::= type_path generic_args?
state_specific_type ::= modal_type_name "@" state_name
state_name          ::= identifier
```

### B.3 Expression Grammar

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
postfix_suffix ::= "." identifier | "." decimal_literal | "[" expression "]" | "~>" identifier "(" argument_list? ")" | "(" argument_list? ")" | "?"

primary_expr ::= literal | identifier_expr | path_expr | tuple_literal | array_literal | record_literal | closure_expr | if_expr | loop_expr | block_expr | comptime_expr | quote_expr | quote_type | quote_pattern | type_literal

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

call_expr     ::= postfix_expr "(" argument_list? ")"
argument_list ::= argument ("," argument)* ","?
argument      ::= "move"? expression
method_call   ::= postfix_expr "~>" identifier "(" argument_list? ")"
static_call   ::= type_path "::" identifier "(" argument_list? ")"

closure_expr       ::= "|" closure_param_list? "|" ("->" type)? closure_body
closure_param_list ::= closure_param ("," closure_param)* ","?
closure_param      ::= "move"? identifier (":" type)?
closure_body       ::= expression | block_expr

Within `closure_expr`, a typed parameter annotation whose outermost constructor is `union_type` MUST be parenthesized as `("(" type ")")`.

if_expr        ::= "if" expression if_tail
if_tail        ::= block_expr ("else" (block_expr | if_expr))?
                 | "is" pattern block_expr ("else" (block_expr | if_expr))?
                 | "is" "{" if_case+ if_case_else? "}"
if_case        ::= pattern block_expr
if_case_else   ::= "else" block_expr
loop_expr      ::= "loop" loop_condition? loop_invariant? block_expr
loop_condition ::= expression | pattern (":" type)? "in" expression
loop_invariant ::= "|:" "{" predicate_expr "}"

block_expr ::= "{" statement* expression? "}"

move_expr        ::= "move" place_expr
widen_expr       ::= "widen" unary_expr
try_expr         ::= postfix_expr "?"
address_of_expr  ::= "&" place_expr
null_ptr_expr    ::= "Ptr" "::" "null" "()"
transmute_expr   ::= "transmute" "<" type "," type ">" "(" expression ")"
```

### B.4 Pattern Grammar

```text
pattern                ::= literal_pattern | wildcard_pattern | identifier_pattern | tuple_pattern | record_pattern | enum_pattern | modal_pattern | range_pattern
literal_pattern        ::= literal
wildcard_pattern       ::= "_"
identifier_pattern     ::= identifier
tuple_pattern          ::= "(" tuple_pattern_elements? ")"
tuple_pattern_elements ::= pattern ";" | pattern ("," pattern)+ ","?
record_pattern         ::= type_path "{" field_pattern_list? "}"
field_pattern_list     ::= field_pattern ("," field_pattern)* ","?
field_pattern          ::= identifier ":" pattern | identifier
enum_pattern                  ::= type_path "::" identifier enum_payload_pattern?
enum_payload_pattern          ::= "(" enum_payload_pattern_elements? ")" | "{" field_pattern_list? "}"
enum_payload_pattern_elements ::= pattern ("," pattern)* ","?
modal_pattern          ::= "@" identifier ("{" field_pattern_list? "}")?
range_pattern          ::= pattern (".." | "..=") pattern
```

### B.5 Statement Grammar

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

### B.6 Declaration Grammar

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

### B.7 Contract Grammar

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

### B.8 Attribute Grammar

```text
attribute_list ::= attribute+
attribute      ::= "[[" attribute_spec ("," attribute_spec)* "]]"
attribute_spec ::= attribute_name ("(" attribute_args ")")?
attribute_name ::= identifier
                 | "dynamic"
                 | "static"
                 | vendor_prefix "::" identifier
                 | vendor_prefix "::" "dynamic"
                 | vendor_prefix "::" "static"
vendor_prefix  ::= identifier ("::" identifier)*
attribute_args ::= attribute_arg ("," attribute_arg)* ","?
attribute_arg  ::= literal
                  | identifier
                 | identifier ":" literal
                 | identifier ":" identifier
                 | identifier "(" attribute_args ")"

layout_attribute              ::= "[[" "layout" "(" layout_args ")" "]]"
layout_args                   ::= layout_kind ("," layout_kind)*
layout_kind                   ::= "C" | "packed" | "align" "(" integer_literal ")" | int_type
inline_attribute              ::= "[[" "inline" ("(" inline_mode ")")? "]]"
inline_mode                   ::= "always" | "never" | "default"
cold_attribute                ::= "[[" "cold" "]]"
deprecated_attribute          ::= "[[" "deprecated" ("(" string_literal ")")? "]]"
reflect_attribute             ::= "[[" "reflect" "]]"
dynamic_attribute             ::= "[[" "dynamic" "]]"
stale_ok_attribute            ::= "[[" "stale_ok" "]]"
emit_attribute                ::= "[[" "emit" "]]"
files_attribute               ::= "[[" "files" "]]"
test_attribute                ::= "[[" "test" ("(" test_attribute_args ")")? "]]"
test_attribute_args           ::= test_attribute_arg ("," test_attribute_arg)*
test_attribute_arg            ::= "name" ":" string_literal | "covers" "(" string_literal ")"
mangle_attribute              ::= "[[" "mangle" "(" ("none" | string_literal) ")" "]]"
library_attribute             ::= "[[" "library" "(" "name" ":" string_literal ("," "kind" ":" string_literal)? ")" "]]"
unwind_attribute              ::= "[[" "unwind" "(" string_literal ")" "]]"
export_attribute              ::= "[[" "export" "(" string_literal ")" "]]"
host_export_attribute         ::= "[[" "host_export" "(" string_literal ")" "]]"
ffi_pass_by_value_attribute   ::= "[[" "ffi_pass_by_value" "]]"
derive_attribute              ::= "[[" "derive" "(" derive_target_list ")" "]]"
derive_target_list            ::= identifier ("," identifier)*
```

### B.9 Key System Grammar

```text
key_path_expr   ::= root_segment ("." path_segment)*
root_segment    ::= key_marker? identifier index_suffix?
path_segment    ::= key_marker? identifier index_suffix?
key_marker      ::= "#"
index_suffix    ::= "[" expression "]"

key_block        ::= "#" path_list key_block_mod* key_mode_spec? block_expr
path_list        ::= key_path_expr ("," key_path_expr)*
key_block_mod    ::= "dynamic" | "speculative" | "ordered"
key_mode_spec    ::= key_mode | release_modifier
release_modifier ::= "release" key_mode

speculative_block ::= "#" path_list "speculative" "write" block_expr
coarsened_path    ::= path_segment* "#" path_segment+
```

### B.10 Concurrency Grammar

```text
parallel_block ::= "parallel" domain_expr block_options? block_expr
domain_expr    ::= expression
block_options  ::= "[" block_option ("," block_option)* "]"
block_option   ::= "cancel" ":" expression

spawn_expr        ::= "spawn" spawn_option_list? block_expr
spawn_option_list ::= "[" spawn_option ("," spawn_option)* "]"
spawn_option      ::= "name" ":" string_literal

dispatch_expr        ::= "dispatch" pattern "in" range_expression key_clause? dispatch_option_list? block_expr
key_clause           ::= "key" key_path_expr key_mode
key_mode             ::= "read" | "write"
dispatch_option_list ::= "[" dispatch_option ("," dispatch_option)* "]"
dispatch_option      ::= "reduce" ":" reduce_op
reduce_op            ::= "+" | "*" | "min" | "max" | "and" | "or" | identifier

memory_order_attribute ::= "[[" memory_order "]]"
memory_order           ::= "relaxed" | "acquire" | "release" | "acqrel" | "seqcst"
```

### B.11 Async Grammar

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

### B.12 Metaprogramming Grammar

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

### B.13 FFI Grammar

```text
extern_block                 ::= attribute_list? visibility? "extern" abi_string? "{" extern_item* "}"
abi_string                   ::= string_literal
extern_item                  ::= foreign_procedure
foreign_procedure            ::= attribute_list? visibility? "procedure" identifier generic_params? signature predicate_clause? contract_clause? foreign_contract_clause_list? terminator

ffi_verification_attr        ::= "[[" ffi_verification_mode "]]"
ffi_verification_mode        ::= "static" | "dynamic"
foreign_contract             ::= "|:" "@foreign_assumes" "(" predicate_expr ")"
                               | "|:" "@foreign_ensures" "(" ensures_predicate ")"
ensures_predicate            ::= predicate_expr | "@error" ":" predicate_expr | "@null_result" ":" predicate_expr
foreign_contract_clause_list ::= foreign_contract+
```
### B.14 Region Grammar

```text
region_stmt  ::= "region" region_opts? region_alias? block_expr
region_opts  ::= "(" expression ")"
region_alias ::= "as" identifier
alloc_expr   ::= identifier "^" expression
frame_stmt   ::= "frame" block_expr | identifier "." "frame" block_expr
```
