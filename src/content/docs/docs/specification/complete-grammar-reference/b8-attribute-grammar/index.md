---
title: "B.8 Attribute Grammar"
description: "B.8 Attribute Grammar from Appendix B. Complete Grammar Reference of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "complete-grammar-reference"
specSection: "b8-attribute-grammar"
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

## B.8 Attribute Grammar

```text
attribute_list ::= attribute+
attribute      ::= "#" attribute_spec
attribute_spec ::= attribute_name ("(" attribute_args? ")")?
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
                 | identifier "(" attribute_args? ")"

layout_attribute              ::= "#" "layout" "(" layout_args ")"
layout_args                   ::= layout_kind ("," layout_kind)*
layout_kind                   ::= "C" | "packed" | "align" "(" integer_literal ")" | integer_type
inline_attribute              ::= "#" "inline" ("(" inline_mode ")")?
inline_mode                   ::= "always" | "never" | "default"
cold_attribute                ::= "#" "cold"
deprecated_attribute          ::= "#" "deprecated" ("(" string_literal ")")?
reflect_attribute             ::= "#" "reflect"
dynamic_attribute             ::= "#" "dynamic"
stale_ok_attribute            ::= "#" "stale_ok"
emit_attribute                ::= "#" "emit"
files_attribute               ::= "#" "files"
test_attribute                ::= "#" "test" ("(" test_attribute_args ")")?
test_attribute_args           ::= test_attribute_arg ("," test_attribute_arg)*
test_attribute_arg            ::= "name" ":" string_literal | "covers" "(" string_literal ")"
mangle_attribute              ::= "#" "mangle" "(" ("none" | string_literal) ")"
library_attribute             ::= "#" "library" "(" "name" ":" string_literal ("," "kind" ":" string_literal)? ")"
unwind_attribute              ::= "#" "unwind" "(" string_literal ")"
export_attribute              ::= "#" "export" "(" string_literal ")"
host_export_attribute         ::= "#" "host_export" "(" string_literal ")"
ffi_pass_by_value_attribute   ::= "#" "ffi_pass_by_value"
derive_attribute              ::= "#" "derive" "(" derive_target_list ")"
derive_target_list            ::= identifier ("," identifier)*
```

The `*_attribute` productions above are informative shape restatements: attributes parse through the generic `attribute` grammar, and each owning section validates its argument shape. The same applies to `ffi_verification_attr` and `ffi_verification_mode` in B.13.
