---
title: "B.4 Pattern Grammar"
description: "B.4 Pattern Grammar from Appendix B. Complete Grammar Reference of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "complete-grammar-reference"
specSection: "b4-pattern-grammar"
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

## B.4 Pattern Grammar

```text
pattern                ::= literal_pattern | wildcard_pattern | identifier_pattern | typed_pattern | tuple_pattern | record_pattern | enum_pattern | modal_pattern | range_pattern
literal_pattern        ::= literal
wildcard_pattern       ::= "_"
identifier_pattern     ::= identifier
typed_pattern          ::= ("_" | identifier) ":" type
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
