---
title: "Attributes and Metadata"
description: "9. Attributes and Metadata of the Ultraviolet language specification."
specSource: "../../Ultraviolet/SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T14:44:07.538Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## 9. Attributes and Metadata

### 9.1 Attribute Syntax and Placement

#### 9.1.1 Syntax

```text
attribute_list    ::= attribute+
attribute         ::= "[[" attribute_spec ("," attribute_spec)* "]]"
attribute_spec    ::= attribute_name ("(" attribute_args ")")?
attribute_name    ::= identifier
                    | "dynamic"
                    | "static"
                    | vendor_prefix "::" identifier
                    | vendor_prefix "::" "dynamic"
                    | vendor_prefix "::" "static"
vendor_prefix     ::= identifier ("::" identifier)*
attribute_args    ::= attribute_arg ("," attribute_arg)* ","?
attribute_arg     ::= literal
                    | identifier
                    | identifier ":" literal
                    | identifier ":" identifier
                    | identifier "(" attribute_args ")"
```

The reserved names `dynamic` and `static` are admitted only in the leaf position of `attribute_name`. They MUST NOT appear inside `vendor_prefix`.

An attribute list MUST appear immediately before the declaration or expression it modifies.

#### 9.1.2 Parsing

**(Parse-AttrListOpt-None)**

```text
¬ IsPunc(Tok(P), "[[")
```

──────────────────────────────────────────────

```text
Γ ⊢ ParseAttrListOpt(P) ⇓ (P, ⊥)
```

**(Parse-AttrListOpt-Yes)**

```text
IsPunc(Tok(P), "[[")    Γ ⊢ ParseAttrList(P) ⇓ (P_1, attrs)
```

──────────────────────────────────────────────

```text
Γ ⊢ ParseAttrListOpt(P) ⇓ (P_1, attrs)
```

**(Parse-AttrList-Cons)**

```text
Γ ⊢ ParseAttrBlock(P) ⇓ (P_1, attrs_0)    Γ ⊢ ParseAttrListTail(P_1, attrs_0) ⇓ (P_2, attrs)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseAttrList(P) ⇓ (P_2, attrs)
```

**(Parse-AttrListTail-End)**

```text
¬ IsPunc(Tok(P), "[[")
```

──────────────────────────────────────────────

```text
Γ ⊢ ParseAttrListTail(P, attrs) ⇓ (P, attrs)
```

**(Parse-AttrListTail-Cons)**

```text
IsPunc(Tok(P), "[[")    Γ ⊢ ParseAttrBlock(P) ⇓ (P_1, attrs_0)    Γ ⊢ ParseAttrListTail(P_1, attrs ++ attrs_0) ⇓ (P_2, attrs_1)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseAttrListTail(P, attrs) ⇓ (P_2, attrs_1)
```

**(Parse-AttrBlock)**

```text
IsPunc(Tok(P), "[[")    P_0 = Advance(P)    Γ ⊢ ParseAttrSpecList(P_0) ⇓ (P_1, specs)    IsPunc(Tok(P_1), "]]")
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseAttrBlock(P) ⇓ (Advance(P_1), specs)
```

**(Parse-AttrSpecList-Cons)**

```text
Γ ⊢ ParseAttrSpec(P) ⇓ (P_1, s)    Γ ⊢ ParseAttrSpecListTail(P_1, [s]) ⇓ (P_2, specs)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseAttrSpecList(P) ⇓ (P_2, specs)
```

**(Parse-AttrSpecListTail-End)**

```text
¬ IsPunc(Tok(P), ",")
```

──────────────────────────────────────────────

```text
Γ ⊢ ParseAttrSpecListTail(P, xs) ⇓ (P, xs)
```

**(Parse-AttrSpecListTail-TrailingComma)**
IsPunc(Tok(P), ",")    IsPunc(Tok(Advance(P)), "]]")    TrailingCommaAllowed(P_0, P, {Punctuator("]]")})
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseAttrSpecListTail(P, xs) ⇓ (Advance(P), xs)
```

**(Parse-AttrSpecListTail-Comma)**

```text
IsPunc(Tok(P), ",")    Γ ⊢ ParseAttrSpec(Advance(P)) ⇓ (P_1, s)    Γ ⊢ ParseAttrSpecListTail(P_1, xs ++ [s]) ⇓ (P_2, ys)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseAttrSpecListTail(P, xs) ⇓ (P_2, ys)
```

**(Parse-AttrSpec)**

```text
Γ ⊢ ParseAttrName(P) ⇓ (P_1, name)    Γ ⊢ ParseAttrArgsOpt(P_1) ⇓ (P_2, args)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseAttrSpec(P) ⇓ (P_2, Attr(name, args))
```

**(Parse-AttrArgsOpt-None)**

```text
¬ IsPunc(Tok(P), "(")
```

──────────────────────────────────────────────

```text
Γ ⊢ ParseAttrArgsOpt(P) ⇓ (P, [])
```

**(Parse-AttrArgsOpt-Yes)**

```text
IsPunc(Tok(P), "(")    Γ ⊢ ParseAttrArgList(Advance(P)) ⇓ (P_1, args)    IsPunc(Tok(P_1), ")")
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseAttrArgsOpt(P) ⇓ (Advance(P_1), args)
```

**(Parse-AttrArgList-Cons)**

```text
Γ ⊢ ParseAttrArg(P) ⇓ (P_1, a)    Γ ⊢ ParseAttrArgListTail(P_1, [a]) ⇓ (P_2, args)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseAttrArgList(P) ⇓ (P_2, args)
```

**(Parse-AttrArgListTail-End)**

```text
¬ IsPunc(Tok(P), ",")
```

──────────────────────────────────────────────

```text
Γ ⊢ ParseAttrArgListTail(P, xs) ⇓ (P, xs)
```

**(Parse-AttrArgListTail-TrailingComma)**
IsPunc(Tok(P), ",")    IsPunc(Tok(Advance(P)), ")")    TrailingCommaAllowed(P_0, P, {Punctuator(")")})
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseAttrArgListTail(P, xs) ⇓ (Advance(P), xs)
```

**(Parse-AttrArgListTail-Comma)**

```text
IsPunc(Tok(P), ",")    Γ ⊢ ParseAttrArg(Advance(P)) ⇓ (P_1, a)    Γ ⊢ ParseAttrArgListTail(P_1, xs ++ [a]) ⇓ (P_2, ys)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseAttrArgListTail(P, xs) ⇓ (P_2, ys)
```

**(Parse-AttrArg-Named-Literal)**

```text
Γ ⊢ ParseIdent(P) ⇓ (P_1, name)    IsPunc(Tok(P_1), ":")    Tok(Advance(P_1)).kind ∈ LiteralKind
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseAttrArg(P) ⇓ (Advance(Advance(P_1)), ⟨name, Tok(Advance(P_1))⟩)
```

**(Parse-AttrArg-Named-Ident)**

```text
Γ ⊢ ParseIdent(P) ⇓ (P_1, name)    IsPunc(Tok(P_1), ":")    Γ ⊢ ParseIdent(Advance(P_1)) ⇓ (P_2, value)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseAttrArg(P) ⇓ (P_2, ⟨name, value⟩)
```

**(Parse-AttrArg-Named-Call)**

```text
Γ ⊢ ParseIdent(P) ⇓ (P_1, name)    IsPunc(Tok(P_1), "(")    Γ ⊢ ParseAttrArgList(Advance(P_1)) ⇓ (P_2, args)    IsPunc(Tok(P_2), ")")
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseAttrArg(P) ⇓ (Advance(P_2), ⟨name, args⟩)
```

**(Parse-AttrArg-Literal)**

```text
Tok(P).kind ∈ LiteralKind
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseAttrArg(P) ⇓ (Advance(P), Tok(P))
```

**(Parse-AttrArg-Ident)**

```text
Γ ⊢ ParseIdent(P) ⇓ (P_1, name)
```

──────────────────────────────────────────────

```text
Γ ⊢ ParseAttrArg(P) ⇓ (P_1, name)
```

#### 9.1.3 AST Representation / Form

AttrName ::= identifier
           | "dynamic"
           | "static"
           | ⟨vendor_prefix, identifier⟩
           | ⟨vendor_prefix, "dynamic"⟩
           | ⟨vendor_prefix, "static"⟩
vendor_prefix ::= identifier ("::" identifier)*

```text
AttrArg ::= literal | identifier | ⟨name, literal⟩ | ⟨name, identifier⟩ | ⟨name, args⟩
```

AttributeSpec ::= Attr(name: AttrName, args: [AttrArg])
AttributeList ::= [AttributeSpec]

```text
AttrOpt ::= {⊥} ∪ AttributeList
```

```text
ExprAttrs(e) ∈ AttrOpt
```

```text
AttachExprAttrs(e, attrs) = e' where ExprAttrs(e') = (attrs ++ ExprAttrs(e) if ExprAttrs(e) ≠ ⊥ else attrs) and all other fields of e' equal those of e
```

AttrListOf(item) = attrs    if item.attrs_opt = attrs

```text
AttrListOf(item) = []       if item.attrs_opt = ⊥
AttrByName(item, n) = [a | a ∈ AttrListOf(item) ∧ a.name = n]
```

#### 9.1.4 Static Semantics

Malformed attribute syntax is ill-formed.

AttrTarget = {Record, Enum, Modal, Procedure, Method, Field, Binding, Statement, Expression, KeyBlock, ExternBlock, TypeAlias}

AttrRegistry = R_spec ⊎ R_vendor
R_vendor = ∅

R_spec = {
  layout, inline, cold, deprecated,
  dynamic, stale_ok,
  relaxed, acquire, release, acqrel, seqcst,
  static,
  mangle, library, unwind,
  reflect, derive, emit, files,
  export, host_export, ffi_pass_by_value,
  test
}

AttrTargets(layout) = {Record, Enum}
AttrTargets(inline) = {Procedure, Method}
AttrTargets(cold) = {Procedure, Method}
AttrTargets(deprecated) = {Record, Enum, Modal, Procedure, Method, Field, Binding, TypeAlias}
AttrTargets(dynamic) = {Record, Enum, Modal, Procedure, Method, Expression}
AttrTargets(stale_ok) = {Binding}
AttrTargets(relaxed) = {Expression, KeyBlock}
AttrTargets(acquire) = {Expression, KeyBlock}
AttrTargets(release) = {Expression, KeyBlock}
AttrTargets(acqrel) = {Expression, KeyBlock}
AttrTargets(seqcst) = {Expression, KeyBlock}
AttrTargets(static) = {Procedure}
AttrTargets(mangle) = {Procedure}
AttrTargets(library) = {ExternBlock}
AttrTargets(unwind) = {Procedure}
AttrTargets(reflect) = {Record, Enum, Modal}
AttrTargets(derive) = {Record, Enum, Modal}
AttrTargets(emit) = {Statement, Expression}
AttrTargets(files) = {Statement, Expression}
AttrTargets(export) = {Procedure}
AttrTargets(host_export) = {Procedure}
AttrTargets(ffi_pass_by_value) = {Record, Enum}
AttrTargets(test) = {Procedure}

AttrListJudg = {AttrListWf}

**(AttrList-Ok)**

```text
A = [a_1, …, a_n]    ∀ i, a_i = ⟨name_i, args_i⟩    ∀ i, name_i ∈ R_spec ∪ R_vendor    ∀ i, τ ∈ AttrTargets(name_i)    ∀ i, AttrArgsOk(name_i, args_i)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ AttrListWf(A, τ) ⇓ ok
```

**(AttrList-Unknown)**

```text
A = [a_1, …, a_n]    ∃ i, a_i = ⟨name_i, _⟩ ∧ name_i ∉ R_spec ∪ R_vendor
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ AttrListWf(A, τ) ⇑ c    c = Code(Attr-Unknown)
```

**(AttrList-Target-Err)**

```text
A = [a_1, …, a_n]    ∃ i, a_i = ⟨name_i, _⟩ ∧ name_i ∈ R_spec ∪ R_vendor ∧ τ ∉ AttrTargets(name_i)
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ AttrListWf(A, τ) ⇑ c    c = Code(Attr-Target-Err)
```

```text
AttrArgsOk(name, args) ⇔ args satisfy the attribute-specific grammar and constraints in §§9.3–9.6, §19.7, §23.4, and §23.6, or the vendor-defined schema for name ∈ R_vendor.
```

Memory-order attributes are well-formed only when attached to key blocks or expressions that contain key acquisition.

```text
For every declaration or expression with an attribute list A and target kind τ, the implementation MUST check Γ ⊢ AttrListWf(A, τ) ⇓ ok.
```

Multiple attribute lists on the same target are equivalent to a single list with concatenated entries in source order. Attribute application order is left-to-right in that concatenated list.

FFI-specific attributes `mangle`, `library`, `unwind`, `export`, `host_export`, and `ffi_pass_by_value` are defined by §23.4.

#### 9.1.5 Dynamic Semantics

Attribute lists do not evaluate to runtime values. Runtime effects, when any, are defined by the owning attribute families in §§9.3–9.6, §19.7, and §23.

#### 9.1.6 Lowering

This section introduces no direct lowering. Lowering consequences of specific attributes are defined by the owning sections.

#### 9.1.7 Diagnostics

| Code         | Severity | Detection    | Condition                                      |
| ------------ | -------- | ------------ | ---------------------------------------------- |
| `E-MOD-2450` | Error    | Compile-time | Malformed attribute syntax                     |
| `E-MOD-2451` | Error    | Compile-time | Unknown attribute name                         |
| `E-MOD-2452` | Error    | Compile-time | Attribute not valid on target declaration kind |

### 9.2 Vendor Attributes

#### 9.2.1 Syntax

This section introduces no additional concrete syntax beyond the scoped `attribute_name` form defined by §9.1.1.

#### 9.2.2 Parsing

Vendor-qualified attribute names reuse the general attribute parser with the vendor-name delta below.

```text
AttrLeafTok(tok, id) ⇔ tok = Identifier(id) ∨ (tok = Keyword(kw) ∧ kw ∈ {`dynamic`, `static`} ∧ id = kw)
```

**(Parse-AttrName-Plain)**

```text
AttrLeafTok(Tok(P), id)    P_1 = Advance(P)    ¬ IsPunc(Tok(P_1), ".")    ¬ IsOp(Tok(P_1), "::")
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseAttrName(P) ⇓ (P_1, id)
```

**(Parse-AttrName-Vendor)**

```text
Γ ⊢ ParseIdent(P) ⇓ (P_1, id_0)    Γ ⊢ ParseVendorPrefixTail(P_1, [id_0]) ⇓ (P_2, pref)    IsOp(Tok(P_2), "::")    AttrLeafTok(Tok(Advance(P_2)), name)    P_3 = Advance(Advance(P_2))
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseAttrName(P) ⇓ (P_3, ⟨pref, name⟩)
```

**(Parse-VendorPrefixTail-End)**

```text
¬ IsOp(Tok(P), "::")
```

──────────────────────────────────────────────

```text
Γ ⊢ ParseVendorPrefixTail(P, xs) ⇓ (P, xs)
```

**(Parse-VendorPrefixTail-Cons)**

```text
IsOp(Tok(P), "::")    Γ ⊢ ParseIdent(Advance(P)) ⇓ (P_1, id)    Γ ⊢ ParseVendorPrefixTail(P_1, xs ++ [id]) ⇓ (P_2, ys)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseVendorPrefixTail(P, xs) ⇓ (P_2, ys)
```

#### 9.2.3 AST Representation / Form

```text
Vendor-defined attribute names use the scoped `AttrName` form `⟨vendor_prefix, leaf⟩`, where `leaf` is an `identifier` or one of the reserved verification-mode names `dynamic` or `static`. `vendor_prefix` segments are always `identifier` tokens.
```

#### 9.2.4 Static Semantics

Vendor-defined attributes in `R_vendor` MUST use scoped prefixes of the form `vendor::name` or `com::vendor::name`.

The `ultraviolet::...` namespace is reserved for specification-defined attributes.

`R_vendor = ∅`. Any attribute name not in `R_spec` is rejected as unknown.

#### 9.2.5 Dynamic Semantics

This section introduces no additional runtime mechanism.

#### 9.2.6 Lowering

This section introduces no additional lowering rules.

#### 9.2.7 Diagnostics

| Code         | Severity | Detection    | Condition                                               |
| ------------ | -------- | ------------ | ------------------------------------------------------- |
| `E-CNF-0402` | Error    | Compile-time | Reserved namespace `ultraviolet::...` used by user code |

Unknown attribute-name rejection is owned by §9.1.7.

### 9.3 Layout Attributes

#### 9.3.1 Syntax

```text
layout_attribute ::= "[[" "layout" "(" layout_args ")" "]]"
layout_args      ::= layout_kind ("," layout_kind)*
layout_kind      ::= "C" | "packed" | "align" "(" integer_literal ")" | int_type
int_type         ::= "i8" | "i16" | "i32" | "i64" | "u8" | "u16" | "u32" | "u64"
```

#### 9.3.2 Parsing

Layout attributes are parsed by the general attribute parser in §9.1.2. This section introduces no additional parsing rules.

#### 9.3.3 AST Representation / Form

Layout attributes are ordinary `AttributeSpec` entries attached to `RecordDecl` or `EnumDecl`.

#### 9.3.4 Static Semantics

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

#### 9.3.5 Dynamic Semantics

Layout attributes introduce no direct runtime mechanism. Packed-field reference safety is enforced statically at the use site.

#### 9.3.6 Lowering

Layout attributes constrain the layout and ABI calculations used by Chapter 24. `layout(C)` selects target C-ABI layout, `layout(packed)` removes inter-field padding and lowers effective alignment to 1, `layout(align(N))` raises minimum alignment, and `layout(IntType)` selects the enum discriminant representation.

#### 9.3.7 Diagnostics

| Code         | Severity | Detection    | Condition                                  |
| ------------ | -------- | ------------ | ------------------------------------------ |
| `E-MOD-2453` | Error    | Compile-time | `align(N)` where N is not a power of two   |
| `E-MOD-2454` | Error    | Compile-time | `packed` applied to non-record             |
| `E-MOD-2455` | Error    | Compile-time | Conflicting layout arguments               |
| `E-TYP-2105` | Error    | Compile-time | Reference to packed field outside `unsafe` |
| `W-MOD-2451` | Warning  | Compile-time | `align(N)` where N < natural alignment     |

### 9.4 Optimization Attributes

#### 9.4.1 Syntax

```text
inline_attribute ::= "[[" "inline" ("(" inline_mode ")")? "]]"
inline_mode      ::= "always" | "never" | "default"

cold_attribute   ::= "[[" "cold" "]]"
```

#### 9.4.2 Parsing

Optimization attributes are parsed by the general attribute parser in §9.1.2. This section introduces no additional parsing rules.

#### 9.4.3 AST Representation / Form

Optimization attributes are ordinary `AttributeSpec` entries attached to `ProcedureDecl` or `MethodDecl`.

#### 9.4.4 Static Semantics

**`[[inline]]`.** The implementation SHOULD inline the procedure at call sites when feasible.

**`[[inline(always)]]`.** The implementation SHOULD inline the procedure at all call sites. If inlining is not possible, such as for reultraviolet procedures or procedures whose address is taken, the implementation SHOULD emit a warning.

**`[[inline(default)]]`.** Equivalent to omitting the attribute.

**`[[inline(never)]]`.** The implementation MUST NOT inline the procedure. The procedure body MUST be emitted as a separate callable unit.

**`[[cold]]`.** Marks a procedure as unlikely to execute during typical runs. The implementation MAY use this as an optimization hint.

#### 9.4.5 Dynamic Semantics

Optimization attributes do not change the language-level runtime semantics of the annotated procedure.

#### 9.4.6 Lowering

`[[inline(always)]]` and `[[inline(never)]]` constrain procedure inlining decisions during lowering. `[[inline(never)]]` requires emission of a separate callable unit. `[[cold]]` MAY influence code layout or backend optimization heuristics.

#### 9.4.7 Diagnostics

| Code         | Severity | Detection    | Condition                            |
| ------------ | -------- | ------------ | ------------------------------------ |
| `W-MOD-2452` | Warning  | Compile-time | `inline(always)` but inlining failed |

### 9.5 Diagnostics and Metadata Attributes

#### 9.5.1 Syntax

All attributes in this section use the general attribute syntax from §9.1.1.

#### 9.5.2 Parsing

These attributes are parsed by the general attribute parser in §9.1.2.

#### 9.5.3 AST Representation / Form

ExprAttrList(e) = A    if ExprAttrs(e) = A

```text
ExprAttrList(e) = []   if ExprAttrs(e) = ⊥
ExprAttrByName(e, n) = [a | a ∈ ExprAttrList(e) ∧ a.name = n]
```

```text
DynamicDecl(d) ⇔ AttrByName(d, "dynamic") ≠ []
DynamicExpr(e) ⇔ ExprAttrByName(e, "dynamic") ≠ []
DynamicScope(s) ⇔ (∃ d. DynamicDecl(d) ∧ s ⊆ d.span) ∨ (∃ e. DynamicExpr(e) ∧ s ⊆ ExprSpan(e))
InDynamicContext ⇔ DynamicScope(s) where s is the span of the syntactic form currently being verified or type-checked.
```

#### 9.5.4 Static Semantics

**`[[deprecated]]`.** Marks a declaration as deprecated. When referenced, the implementation MUST emit a deprecation warning. If a message argument is present, the diagnostic SHOULD include it.

**`[[dynamic]]`.** Marks a declaration or expression as requiring runtime verification when static verification is insufficient.

Scope determination:
1. `e` is within a `[[dynamic]]` scope if it is enclosed by a `[[dynamic]]` declaration, or by an attributed expression.
2. Scope is lexical and does not propagate through procedure calls.

```text
ComputeDynamicContext : Span × AncestorList → Bool
```

```text
ComputeDynamicContext(s, ancestors) =
  let enclosing_dynamic = FindInnermostDynamic(s, ancestors)
  match enclosing_dynamic {
    ⊥            → false
    Some(_)      → true
  }
```

```text
FindInnermostDynamic : Span × AncestorList → Option<Span>
```

```text
FindInnermostDynamic(s, ancestors) =
  let dynamic_ancestors = [a | a ∈ ancestors ∧ (DynamicDecl(a) ∨ DynamicExpr(a)) ∧ s ⊆ a.span]
  if dynamic_ancestors = [] then ⊥
  else Some(MinimalSpan(dynamic_ancestors))
```

```text
MinimalSpan : [SyntacticForm] → Span
```

```text
MinimalSpan(forms) = argmin_{f ∈ forms} |f.span|
```

**(DynamicContext-Override)**
```text
ClassProc(C, m) has [[dynamic]]    ClassImpl(T, C) has override m
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
ComputeDynamicContext(override.body.span, Ancestors(override)) = true
```

A class procedure's `[[dynamic]]` annotation propagates to implementations.

**(DynamicContext-NoInherit-Call)**
```text
CallExpr(f, args) at span s    f is [[dynamic]]    s ⊄ f.span
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
ComputeDynamicContext(s, Ancestors(s)) does not consider f's [[dynamic]]
```

`[[dynamic]]` scope is lexical and does not propagate through procedure calls.

Effects:
- Key system: runtime synchronization MUST be inserted exactly in the cases required by Chapter 19 and MUST NOT be inserted otherwise.
- Contracts: runtime checks MUST be inserted exactly in the cases required by §15.8 and MUST NOT be inserted otherwise.
- Refinement types: runtime checks MUST be inserted exactly in the cases required by §14.8 and MUST NOT be inserted otherwise.

Dynamic target restrictions:
1. `[[dynamic]]` applied to a contract predicate expression is ill-formed.
2. `[[dynamic]]` applied to a `type` alias declaration is ill-formed.
3. `[[dynamic]]` applied to a field declaration is ill-formed.

If a `[[dynamic]]` scope results in no runtime checks or runtime synchronization, the implementation SHOULD emit a warning.

**`[[stale_ok]]`.** Suppresses staleness warnings for bindings derived from `shared` data across `release` or `yield release` boundaries. Valid only on `let` and `var` bindings. See Chapters 19 and 21.

**Verification-mode attributes.** `[[static]]` is interpreted only in foreign-contract contexts. Semantics are defined by §23.6. `[[dynamic]]` reuses the dynamic verification mode defined above.

**`[[reflect]]`.** Marks a `record`, `enum`, or `modal` declaration as reflectable during Phase 2. Reflection queries over such declarations are defined by §22.3. A conforming implementation MUST expose the declaration's canonical shape, member order, and attached attributes to the compile-time reflection environment.

**`[[derive(... )]]`.** Schedules derive-target execution in Phase 2 for the annotated `record`, `enum`, or `modal` declaration. Derive target resolution, dependency ordering, and contract checking are defined by §22.5.

**`[[emit]]`.** Grants the `TypeEmitter` capability to the annotated compile-time statement or compile-time expression. The target MUST be a `comptime` form. Emission ordering and generated-item visibility are defined by §22.4.

**`[[files]]`.** Grants the `ProjectFiles` capability to the annotated compile-time statement or compile-time expression. The target MUST be a `comptime` form. File snapshot and path-confinement semantics are defined by §22.2.

#### 9.5.5 Dynamic Semantics

`[[deprecated]]`, `[[stale_ok]]`, and `[[static]]` introduce no direct runtime behavior in this chapter.

For `[[dynamic]]`, runtime synchronization or runtime verification MUST be inserted exactly when required by the owning chapters for keys, contracts, refinements, and foreign contracts, and MUST NOT be inserted otherwise.

#### 9.5.6 Lowering

`[[dynamic]]` lowers by enabling runtime synchronization or runtime checks exactly where the owning semantic sections require them and nowhere else. `[[stale_ok]]` suppresses warnings only and does not affect lowering. `[[deprecated]]` introduces no lowering. `[[reflect]]`, `[[derive(... )]]`, `[[emit]]`, and `[[files]]` lower only through Phase 2 execution as defined by Chapter 22 and MUST introduce no direct Phase 4 runtime instrumentation.

#### 9.5.7 Diagnostics

| Code         | Severity | Detection    | Condition                                               |
| ------------ | -------- | ------------ | ------------------------------------------------------- |
| `W-CNF-0601` | Warning  | Compile-time | Reference to declaration marked `[[deprecated]]`        |
| `E-CON-0410` | Error    | Compile-time | `[[dynamic]]` applied to contract clause directly       |
| `E-CON-0411` | Error    | Compile-time | `[[dynamic]]` applied to type alias declaration         |
| `E-CON-0412` | Error    | Compile-time | `[[dynamic]]` applied to field declaration              |
| `W-CON-0401` | Warning  | Compile-time | `[[dynamic]]` present but all proofs succeed statically |

### 9.6 Source-Native Test Attributes

#### 9.6.1 Syntax

```text
test_attribute      ::= "[[" "test" ("(" test_attribute_args ")")? "]]"
test_attribute_args ::= test_attribute_arg ("," test_attribute_arg)*
test_attribute_arg  ::= "name" ":" string_literal
                      | "covers" "(" string_literal ")"
```

#### 9.6.2 Parsing

`[[test]]` is parsed by the ordinary attribute parser from §9.1.2. The `name`

```text
argument is represented as `⟨name, string_literal⟩`. Each `covers(...)` argument
is represented as `⟨covers, [string_literal]⟩`.
```

#### 9.6.3 AST Representation / Form

A source-native test is an ordinary `ProcedureDecl` whose `AttrByName(proc,
test)` set is non-empty.

TestName(proc) = s when the unique `name: s` argument is present.
TestName(proc) = FullyQualifiedProcPath(proc) when no `name` argument is present.

TestCoverage(proc) = [r_1, …, r_n] where each r_i is the string argument of one
`covers(r_i)` entry in source order.

#### 9.6.4 Static Semantics

`[[test]]` is valid only on ordinary source procedures.

`AttrArgsOk(test, args)` holds exactly when:

1. every argument is either `name: string_literal` or `covers(string_literal)`;
2. at most one `name` argument is present;
3. every `covers` argument has exactly one non-empty string literal argument;
4. every coverage reference names one row in the obligation ledger using
   `obligation-id@Linternal_spec_line`.

A `[[test]]` procedure MUST:

1. have a body;
2. be non-generic;
3. have explicit visibility;
4. have an explicit return type;
5. have a contract clause containing a postcondition;
6. have either no parameters or exactly one parameter whose type is the
   toolchain-provided `TestContext` type.

The `TestContext` parameter is the only runner-injected value. It carries the
filesystem, process, temporary-directory, target-profile, and compiler-invocation
authority needed by effectful compiler tests.

#### 9.6.5 Dynamic Semantics

`[[test]]` does not change ordinary procedure execution. During test execution,
the runner calls each discovered test procedure. A test passes when the procedure
returns normally and its postcondition is satisfied. A test fails when the
procedure returns normally and its postcondition is violated. A test errors when
the procedure is ill-formed for test execution, panics, requires unavailable
authority, or cannot be invoked by the generated harness.

#### 9.6.6 Lowering

`[[test]]` does not lower into production program artifacts.

```text
TestArg = ⊥ | s where s is the optional positional argument to `uv test`.
```

```text
HostPath(s) ⇔ ResolveHostPath(CurrentDirectory, s) ⇓ p ∧ exists(p)
```

```text
TestInput(⊥) = CurrentDirectory
TestInput(s) = p  if HostPath(s) ∧ ResolveHostPath(CurrentDirectory, s) ⇓ p
TestInput(s) = CurrentDirectory  if ¬ HostPath(s)
```

TestRoot(arg) = FindProjectRoot(TestInput(arg))

TestsPrefix(A) = A.name :: `Tests`

```text
TestBearing(A) ⇔ ∃ m ∈ A.modules. Prefix(path(m), TestsPrefix(A))
TestAssemblies(P) = [A ∈ P.assemblies | TestBearing(A)]
```

TestScope ::= AllTests | AssemblyTests(A) | ModuleTests(q) | SourceFileTests(f) | DirectoryTests(d)

```text
ResolveTestTarget(P, ⊥) = AllTests
```

ResolveTestTarget(P, s) = SourceFileTests(p)

```text
  if HostPath(s) ∧ ResolveHostPath(CurrentDirectory, s) ⇓ p ∧ File(p)
```

ResolveTestTarget(P, s) = AllTests

```text
  if HostPath(s) ∧ ResolveHostPath(CurrentDirectory, s) ⇓ p ∧ Dir(p) ∧ p = P.root
```

ResolveTestTarget(P, s) = DirectoryTests(p)

```text
  if HostPath(s) ∧ ResolveHostPath(CurrentDirectory, s) ⇓ p ∧ Dir(p) ∧ p ≠ P.root
```

ResolveTestTarget(P, s) = AssemblyTests(A)

```text
  if ¬ HostPath(s) ∧ A ∈ P.assemblies ∧ A.name = s
```

ResolveTestTarget(P, s) = ModuleTests(q)

```text
  if ¬ HostPath(s) ∧ ParseModulePath(s) ⇓ q ∧ ∃ m ∈ ModuleList(P). path(m) = q
ResolveTestTarget(P, s) ⇑ Code(Test-Target-Err) otherwise
```

SelectedTests(P, AllTests) =

```text
  [proc | A ∈ TestAssemblies(P), proc ∈ TestProceduresUnder(A, TestsPrefix(A))]
```

SelectedTests(P, AssemblyTests(A)) =

```text
  [proc | proc ∈ TestProceduresUnder(A, TestsPrefix(A))]
```

SelectedTests(P, ModuleTests(q)) =

```text
  [proc | proc ∈ TestProceduresUnder(OwnerAssembly(P, q), q)]
```

SelectedTests(P, SourceFileTests(f)) =

```text
  [proc | proc ∈ TestProceduresInFile(P, f) ∧ InTestsSubtree(P, proc)]
```

SelectedTests(P, DirectoryTests(d)) =

```text
  [proc | proc ∈ TestProceduresUnderDirectory(P, d) ∧ InTestsSubtree(P, proc)]
```

For each selected assembly A represented in SelectedTests(P, scope), `uv test`
generates an ephemeral harness in A's build output directory, compiles
AssemblyProject(P, A) with that harness entrypoint, and invokes the selected
tests for A in deterministic order.

Discovery order is module path, file order, declaration span, then
fully-qualified procedure symbol. The fully-qualified procedure path is the
stable test identity. `name: "..."` is a display label.

#### 9.6.7 Diagnostics

| Code         | Severity | Detection    | Condition                                        |
| ------------ | -------- | ------------ | ------------------------------------------------ |
| `E-MOD-2452` | Error    | Compile-time | `[[test]]` applied outside an ordinary procedure |
| `E-TST-0101` | Error    | Compile-time | Malformed `[[test]]` argument                    |
| `E-TST-0102` | Error    | Compile-time | Duplicate `[[test]]` name argument               |
| `E-TST-0103` | Error    | Compile-time | Malformed `covers(...)` argument                 |
| `E-TST-0104` | Error    | Compile-time | Invalid `[[test]]` procedure shape               |
| `E-TST-0105` | Error    | Compile-time | Invalid `TestContext` parameter                  |
| `E-TST-0106` | Error    | Compile-time | `[[test]]` procedure missing postcondition       |
| `E-TST-0107` | Error    | Compile-time | Unknown audit coverage reference                 |
| `E-TST-0108` | Error    | Compile-time | Unknown `uv test` target                         |
