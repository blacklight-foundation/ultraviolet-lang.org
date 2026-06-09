---
title: "15.3 Overloading"
description: "15.3 Overloading from 15. Procedures and Contracts of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "procedures-and-contracts"
specSection: "153-overloading"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/procedures-and-contracts/">15. Procedures and Contracts</a>
  <span>Procedures and Contracts</span>
</div>

## 15.3 Overloading

### 15.3.1 Syntax

No additional surface syntax is introduced beyond ordinary procedure and method declarations.

### 15.3.2 Parsing

Overload resolution is not a parser concern in this chapter.

### 15.3.3 AST Representation / Form

$$
\begin{array}{l}
\operatorname{ClassDefaults}(T,\ \mathsf{name})\ =\ \{\ m\ \mid \ \exists \ \mathsf{Cl}\ \in \ \operatorname{Implements}(T).\ m\ \in \ \operatorname{ClassMethodTable}(\mathsf{Cl})\ \land \ m.\mathsf{name}\ =\ \mathsf{name}\ \land \ m.\mathsf{body}\ \ne \ \bot \ \} \\[0.16em]
\operatorname{LookupMethod}(T,\ \mathsf{name})\ =\ m\ \Leftrightarrow \ \operatorname{MethodByName}(T,\ \mathsf{name})\ =\ m \\[0.16em]
\operatorname{LookupMethod}(T,\ \mathsf{name})\ =\ m\ \Leftrightarrow \ \operatorname{MethodByName}(T,\ \mathsf{name})\ =\ \bot \ \land \ \mid \operatorname{ClassDefaults}(T,\ \mathsf{name})\mid \ =\ 1\ \land \ m\ \in \ \operatorname{ClassDefaults}(T,\ \mathsf{name}) \\[0.16em]
\operatorname{LookupMethod}(T,\ \mathsf{name})\ =\ \bot \ \Leftrightarrow \ \operatorname{MethodByName}(T,\ \mathsf{name})\ =\ \bot \ \land \ (\mid \operatorname{ClassDefaults}(T,\ \mathsf{name})\mid \ =\ 0\ \lor \ \mid \operatorname{ClassDefaults}(T,\ \mathsf{name})\mid \ >\ 1)
\end{array}
$$

### 15.3.4 Static Semantics

**(LookupMethod-NotFound)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{base}\ :\ T_{b}\quad \operatorname{MethodByName}(\operatorname{StripPerm}(T_{b}),\ \mathsf{name})\ =\ \bot \quad \operatorname{ClassDefaults}(\operatorname{StripPerm}(T_{b}),\ \mathsf{name})\ =\ \emptyset  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{MethodCall}(\mathsf{base},\ \mathsf{name},\ \mathsf{args})\ \Uparrow 
\end{array}
$$

**(LookupMethod-Ambig)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{base}\ :\ T_{b}\quad \operatorname{MethodByName}(\operatorname{StripPerm}(T_{b}),\ \mathsf{name})\ =\ \bot \quad \mid \operatorname{ClassDefaults}(\operatorname{StripPerm}(T_{b}),\ \mathsf{name})\mid \ >\ 1 \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{MethodCall}(\mathsf{base},\ \mathsf{name},\ \mathsf{args})\ \Uparrow 
\end{array}
$$

Free-procedure overload resolution is complete before ordinary `Call` typing.

For a free call whose callee names an overload set `O`:

1. Candidate selection: retain procedures in `O` whose parameter count equals the argument count.
2. Type filtering: eliminate candidates for which any argument is incompatible with the corresponding parameter under the call-argument compatibility rules of §16.3.4.
3. Exact-match preference: if multiple candidates remain, retain those with the maximal number of exact argument-type matches.
4. Genericity preference: if both generic and non-generic candidates remain, retain only the non-generic candidates.
5. Constraint specificity: if multiple generic candidates remain, retain only those whose bounds and predicate requirements are pointwise at least as specific as every remaining alternative, with at least one strict improvement.
6. If exactly one candidate remains, that candidate is selected.
7. If no candidate remains, the call is ill-formed with `E-SEM-3031`.
8. If multiple candidates remain after all preference stages, the call is ill-formed with `E-SEM-3030`.

Two visible overloads with the same name MUST NOT have identical parameter-mode/type signatures after generic-parameter erasure. Such a declaration set is ill-formed with `E-SEM-3032`.

`ResolvedCallee(call)` is the declaration id selected by overload resolution,
including the selected generic substitution when the selected declaration is generic.
Lowering receives that declaration id and calls `Mangle(selected_decl)` or the
export-specific link-name rules for that declaration. ABI-facing names are outputs of
the selected declaration and are not inputs to overload resolution.

### 15.3.5 Dynamic Semantics

When `LookupMethod(T, name) = m`, execution uses that unique method body. No runtime overload search is performed.

### 15.3.6 Lowering

Overload resolution is complete before lowering. Lowering consumes the selected procedure or method symbol only.

### 15.3.7 Diagnostics

| Code         | Severity | Detection    | Condition                           |
| ------------ | -------- | ------------ | ----------------------------------- |
| `E-SEM-3030` | Error    | Compile-time | Ambiguous overload resolution       |
| `E-SEM-3031` | Error    | Compile-time | No matching overload found          |
| `E-SEM-3032` | Error    | Compile-time | Duplicate signature in overload set |

Method lookup diagnostics remain defined for missing methods and ambiguous inherited-default method resolution.
