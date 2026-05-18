---
title: "9.3 Layout Attributes"
description: "9.3 Layout Attributes from 9. Attributes and Metadata of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "attributes-and-metadata"
specSection: "93-layout-attributes"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/attributes-and-metadata/">9. Attributes and Metadata</a>
  <span>Attributes and Metadata</span>
</div>

## 9.3 Layout Attributes

### 9.3.1 Syntax

```text
layout_attribute ::= attr_open "layout" "(" layout_args ")" attr_close
layout_args      ::= layout_kind ("," layout_kind)*
layout_kind      ::= "C" | "packed" | "align" "(" integer_literal ")" | int_type
int_type         ::= "i8" | "i16" | "i32" | "i64" | "u8" | "u16" | "u32" | "u64"
```

### 9.3.2 Parsing

Layout attributes are parsed by the general attribute parser in §9.1.2. This section introduces no additional parsing rules.

### 9.3.3 AST Representation / Form

Layout attributes are ordinary `AttributeSpec` entries attached to `RecordDecl` or `EnumDecl`.

### 9.3.4 Static Semantics

**`[[layout(C)]]`.** Specifies C-compatible memory layout.

For `record` declarations:
1. Fields MUST be laid out in declaration order.
2. Padding MUST be inserted only as required by the target platform's C ABI.
3. Total size MUST be a multiple of the record's alignment.

For `enum` declarations:
1. The discriminant MUST be represented as a C-compatible integer tag.
2. Default tag type is `DiscType(E)` as defined by §12.7.
3. Layout MUST conform to a tagged union per the target C ABI.

**`[[layout(IntType)]]` (explicit discriminant).** For an `enum` marked `[[layout(IntType)]]` where `IntType` is `i8`–`i64` or `u8`–`u64`:
1. The discriminant MUST use the specified integer type.
2. Each variant's discriminant value MUST be representable in that type.
3. This form is valid only on `enum` declarations.

**`[[layout(packed)]]`.** Removes inter-field padding.

For a `record` marked `[[layout(packed)]]`:
1. All inter-field padding is removed.
2. Each field MUST be laid out with alignment 1.
3. The record's overall alignment becomes 1.

Taking a reference to a packed field MUST occur within an `unsafe` block. Outside `unsafe`, the program is ill-formed.

**`[[layout(align(N))]]`.** Sets a minimum alignment.

1. N MUST be a positive integer that is a power of two.
2. Effective alignment is max(N, natural alignment).
3. If N < natural alignment, natural alignment is used.
4. Type size is padded to a multiple of the effective alignment.

**Compile-time layout verification**

Valid combinations:
- `layout(C)`
- `layout(packed)`
- `layout(align(N))`
- `layout(C, packed)`
- `layout(C, align(N))`
- `layout(u8)`

Invalid combinations:
- `layout(packed, align(N))`

Applicability constraints:
- `record`: `C`, `packed`, `align(N)`
- `enum`: `C`, `align(N)`, `IntType`
- `modal`: none
- generic (unmonomorphized): none

Constraints:
1. `layout(packed)` applied to a non-`record` declaration is ill-formed.
2. `layout(align(N))` where N is not a power of two is ill-formed.
3. Conflicting layout arguments, including `layout(packed, align(N))`, are ill-formed.
4. `layout(align(N))` where N < natural alignment emits a warning.

### 9.3.5 Dynamic Semantics

Layout attributes introduce no direct runtime mechanism. Packed-field reference safety is enforced statically at the use site.

### 9.3.6 Lowering

Layout attributes constrain the layout and ABI calculations used by Chapter 24. `layout(C)` selects target C-ABI layout, `layout(packed)` removes inter-field padding and lowers effective alignment to 1, `layout(align(N))` raises minimum alignment, and `layout(IntType)` selects the enum discriminant representation.

### 9.3.7 Diagnostics

| Code         | Severity | Detection    | Condition                                  |
| ------------ | -------- | ------------ | ------------------------------------------ |
| `E-MOD-2453` | Error    | Compile-time | `align(N)` where N is not a power of two   |
| `E-MOD-2454` | Error    | Compile-time | `packed` applied to non-record             |
| `E-MOD-2455` | Error    | Compile-time | Conflicting layout arguments               |
| `E-TYP-2105` | Error    | Compile-time | Reference to packed field outside `unsafe` |
| `W-MOD-2451` | Warning  | Compile-time | `align(N)` where N < natural alignment     |
