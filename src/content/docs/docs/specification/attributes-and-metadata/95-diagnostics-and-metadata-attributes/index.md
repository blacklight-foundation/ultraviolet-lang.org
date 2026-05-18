---
title: "9.5 Diagnostics and Metadata Attributes"
description: "9.5 Diagnostics and Metadata Attributes from 9. Attributes and Metadata of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "attributes-and-metadata"
specSection: "95-diagnostics-and-metadata-attributes"
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

## 9.5 Diagnostics and Metadata Attributes

### 9.5.1 Syntax

All attributes in this section use the general attribute syntax from §9.1.1.

### 9.5.2 Parsing

These attributes are parsed by the general attribute parser in §9.1.2.

### 9.5.3 AST Representation / Form

$$
\begin{array}{l}
\operatorname{ExprAttrList}(e)\ =\ A\quad \mathsf{if}\ \operatorname{ExprAttrs}(e)\ =\ A \\[0.16em]
\operatorname{ExprAttrList}(e)\ =\ []\ \mathsf{if}\ \operatorname{ExprAttrs}(e)\ =\ \bot  \\[0.16em]
\operatorname{ExprAttrByName}(e,\ n)\ =\ [a\ \mid \ a\ \in \ \operatorname{ExprAttrList}(e)\ \land \ a.\mathsf{name}\ =\ n]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{DynamicDecl}(d)\ \Leftrightarrow \ \operatorname{AttrByName}(d,\ \texttt{"dynamic"})\ \ne \ [] \\[0.16em]
\operatorname{DynamicExpr}(e)\ \Leftrightarrow \ \operatorname{ExprAttrByName}(e,\ \texttt{"dynamic"})\ \ne \ [] \\[0.16em]
\operatorname{DynamicScope}(s)\ \Leftrightarrow \ (\exists \ d.\ \operatorname{DynamicDecl}(d)\ \land \ s\ \subseteq \ d.\mathsf{span})\ \lor \ (\exists \ e.\ \operatorname{DynamicExpr}(e)\ \land \ s\ \subseteq \ \operatorname{ExprSpan}(e)) \\[0.16em]
\mathsf{InDynamicContext}\ \Leftrightarrow \ \operatorname{DynamicScope}(s)\ \mathsf{where}\ s\ \mathsf{is}\ \mathsf{the}\ \mathsf{span}\ \mathsf{of}\ \mathsf{the}\ \mathsf{syntactic}\ \mathsf{form}\ \mathsf{currently}\ \mathsf{being}\ \mathsf{verified}\ \mathsf{or}\ \mathsf{type}-\mathsf{checked}.
\end{array}
$$

### 9.5.4 Static Semantics

**`[[deprecated]]`.** Marks a declaration as deprecated. When referenced, the implementation MUST emit a deprecation warning. If a message argument is present, the diagnostic SHOULD include it.

**`[[dynamic]]`.** Marks a declaration or expression as requiring runtime verification when static verification is insufficient.

Scope determination:
1. `e` is within a `[[dynamic]]` scope if it is enclosed by a `[[dynamic]]` declaration, or by an attributed expression.
2. Scope is lexical and does not propagate through procedure calls.

$$
\mathsf{ComputeDynamicContext}\ :\ \mathsf{Span}\ \times \ \mathsf{AncestorList}\ \to \ \mathsf{Bool}
$$

$$
\begin{array}{l}
\operatorname{ComputeDynamicContext}(s,\ \mathsf{ancestors})\ = \\[0.16em]
\ \mathsf{let}\ \mathsf{enclosing}_{\mathsf{dynamic}}\ =\ \operatorname{FindInnermostDynamic}(s,\ \mathsf{ancestors}) \\[0.16em]
\ \mathsf{match}\ \mathsf{enclosing}_{\mathsf{dynamic}}\ \{ \\[0.16em]
\quad \bot \quad \to \ \mathsf{false} \\[0.16em]
\quad \operatorname{Some}(\_)\quad \to \ \mathsf{true} \\[0.16em]
\ \}
\end{array}
$$

$$
\mathsf{FindInnermostDynamic}\ :\ \mathsf{Span}\ \times \ \mathsf{AncestorList}\ \to \ \mathsf{Option}<\mathsf{Span}>
$$

$$
\begin{array}{l}
\operatorname{FindInnermostDynamic}(s,\ \mathsf{ancestors})\ = \\[0.16em]
\ \mathsf{let}\ \mathsf{dynamic}_{\mathsf{ancestors}}\ =\ [a\ \mid \ a\ \in \ \mathsf{ancestors}\ \land \ (\operatorname{DynamicDecl}(a)\ \lor \ \operatorname{DynamicExpr}(a))\ \land \ s\ \subseteq \ a.\mathsf{span}] \\[0.16em]
\ \mathsf{if}\ \mathsf{dynamic}_{\mathsf{ancestors}}\ =\ []\ \mathsf{then}\ \bot  \\[0.16em]
\ \mathsf{else}\ \operatorname{Some}(\operatorname{MinimalSpan}(\mathsf{dynamic}_{\mathsf{ancestors}}))
\end{array}
$$

$$
\mathsf{MinimalSpan}\ :\ [\mathsf{SyntacticForm}]\ \to \ \mathsf{Span}
$$

$$
\operatorname{MinimalSpan}(\mathsf{forms})\ =\ \mathsf{argmin}\_\{f\ \in \ \mathsf{forms}\}\ \mid f.\mathsf{span}\mid 
$$

**(DynamicContext-Override)**

$$
\begin{array}{l}
\operatorname{ClassProc}(C,\ m)\ \mathsf{has}\ [[\mathsf{dynamic}]]\quad \operatorname{ClassImpl}(T,\ C)\ \mathsf{has}\ \mathsf{override}\ m \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ComputeDynamicContext}(\mathsf{override}.\mathsf{body}.\mathsf{span},\ \operatorname{Ancestors}(\mathsf{override}))\ =\ \mathsf{true}
\end{array}
$$

A class procedure's `[[dynamic]]` annotation propagates to implementations.

**(DynamicContext-NoInherit-Call)**

$$
\begin{array}{l}
\operatorname{CallExpr}(f,\ \mathsf{args})\ \mathsf{at}\ \mathsf{span}\ s\quad f\ \mathsf{is}\ [[\mathsf{dynamic}]]\quad s\ \nsubseteq \ f.\mathsf{span} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ComputeDynamicContext}(s,\ \operatorname{Ancestors}(s))\ \mathsf{does}\ \mathsf{not}\ \mathsf{consider}\ f's\ [[\mathsf{dynamic}]]
\end{array}
$$

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

### 9.5.5 Dynamic Semantics

`[[deprecated]]`, `[[stale_ok]]`, and `[[static]]` introduce no direct runtime behavior in this chapter.

For `[[dynamic]]`, runtime synchronization or runtime verification MUST be inserted exactly when required by the owning chapters for keys, contracts, refinements, and foreign contracts, and MUST NOT be inserted otherwise.

### 9.5.6 Lowering

`[[dynamic]]` lowers by enabling runtime synchronization or runtime checks exactly where the owning semantic sections require them and nowhere else. `[[stale_ok]]` suppresses warnings only and does not affect lowering. `[[deprecated]]` introduces no lowering. `[[reflect]]`, `[[derive(... )]]`, `[[emit]]`, and `[[files]]` lower only through Phase 2 execution as defined by Chapter 22 and MUST introduce no direct Phase 4 runtime instrumentation.

### 9.5.7 Diagnostics

| Code         | Severity | Detection    | Condition                                               |
| ------------ | -------- | ------------ | ------------------------------------------------------- |
| `W-CNF-0601` | Warning  | Compile-time | Reference to declaration marked `[[deprecated]]`        |
| `E-CON-0410` | Error    | Compile-time | `[[dynamic]]` applied to contract clause directly       |
| `E-CON-0411` | Error    | Compile-time | `[[dynamic]]` applied to type alias declaration         |
| `E-CON-0412` | Error    | Compile-time | `[[dynamic]]` applied to field declaration              |
| `W-CON-0401` | Warning  | Compile-time | `[[dynamic]]` present but all proofs succeed statically |
