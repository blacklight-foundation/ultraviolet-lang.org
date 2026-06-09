---
title: "9.2 Vendor Attributes"
description: "9.2 Vendor Attributes from 9. Attributes and Metadata of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "attributes-and-metadata"
specSection: "92-vendor-attributes"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/attributes-and-metadata/">9. Attributes and Metadata</a>
  <span>Attributes and Metadata</span>
</div>

## 9.2 Vendor Attributes

### 9.2.1 Syntax

This section introduces no additional concrete syntax beyond the scoped `attribute_name` form defined by §9.1.1.

### 9.2.2 Parsing

Vendor-qualified attribute names reuse the general attribute parser with the vendor-name delta below.

$$
\operatorname{AttrLeafTok}(\mathsf{tok},\ \mathsf{id})\ \Leftrightarrow \ \mathsf{tok}\ =\ \operatorname{Identifier}(\mathsf{id})\ \lor \ (\mathsf{tok}\ =\ \operatorname{Keyword}(\mathsf{kw})\ \land \ \mathsf{kw}\ \in \ \{\texttt{dynamic},\ \texttt{static}\}\ \land \ \mathsf{id}\ =\ \mathsf{kw})
$$

**(Parse-AttrName-Plain)**

$$
\begin{array}{l}
\operatorname{AttrLeafTok}(\operatorname{Tok}(P),\ \mathsf{id})\quad P_{1}\ =\ \operatorname{Advance}(P)\quad \lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"."})\quad \lnot \ \operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{"::"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseAttrName}(P)\ \Downarrow \ (P_{1},\ \mathsf{id})
\end{array}
$$

**(Parse-AttrName-Vendor)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseIdent}(P)\ \Downarrow \ (P_{1},\ \mathsf{id}_{0})\quad \Gamma \ \vdash \ \operatorname{ParseVendorPrefixTail}(P_{1},\ [\mathsf{id}_{0}])\ \Downarrow \ (P_{2},\ \mathsf{pref})\quad \operatorname{IsOp}(\operatorname{Tok}(P_{2}),\ \texttt{"::"})\quad \operatorname{AttrLeafTok}(\operatorname{Tok}(\operatorname{Advance}(P_{2})),\ \mathsf{name})\quad P_{3}\ =\ \operatorname{Advance}(\operatorname{Advance}(P_{2})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseAttrName}(P)\ \Downarrow \ (P_{3},\ \langle \mathsf{pref},\ \mathsf{name}\rangle )
\end{array}
$$

**(Parse-VendorPrefixTail-End)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"::"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseVendorPrefixTail}(P,\ \mathsf{xs})\ \Downarrow \ (P,\ \mathsf{xs})
\end{array}
$$

**(Parse-VendorPrefixTail-Cons)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"::"})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{id})\quad \Gamma \ \vdash \ \operatorname{ParseVendorPrefixTail}(P_{1},\ \mathsf{xs}\ \mathbin{++} \ [\mathsf{id}])\ \Downarrow \ (P_{2},\ \mathsf{ys}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseVendorPrefixTail}(P,\ \mathsf{xs})\ \Downarrow \ (P_{2},\ \mathsf{ys})
\end{array}
$$

### 9.2.3 AST Representation / Form

Vendor-defined attribute names use the scoped `AttrName` form `⟨vendor_prefix, leaf⟩`, where `leaf` is an `identifier` or one of the reserved verification-mode names `dynamic` or `static`. `vendor_prefix` segments are always `identifier` tokens.

### 9.2.4 Static Semantics

Vendor-defined attributes in `R_vendor` MUST use scoped prefixes of the form `vendor::name` or `com::vendor::name`.

The `ultraviolet::...` namespace is reserved for specification-defined attributes.

$$
\texttt{R\_vendor = emptyset}.\ \mathsf{Any}\ \mathsf{attribute}\ \mathsf{name}\ \mathsf{not}\ \mathsf{in}\ \texttt{R\_spec}\ \mathsf{is}\ \mathsf{rejected}\ \mathsf{as}\ \mathsf{unknown}.
$$

### 9.2.5 Dynamic Semantics

This section introduces no additional runtime mechanism.

### 9.2.6 Lowering

This section introduces no additional lowering rules.

### 9.2.7 Diagnostics

| Code         | Severity | Detection    | Condition                                               |
| ------------ | -------- | ------------ | ------------------------------------------------------- |
| `E-CNF-0402` | Error    | Compile-time | Reserved namespace `ultraviolet::...` used by user code |

Unknown attribute-name rejection is owned by §9.1.7.
