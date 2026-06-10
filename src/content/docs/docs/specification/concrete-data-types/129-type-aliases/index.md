---
title: "12.9 Type Aliases"
description: "12.9 Type Aliases from 12. Concrete Data Types of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "concrete-data-types"
specSection: "129-type-aliases"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/concrete-data-types/">12. Concrete Data Types</a>
  <span>Concrete Data Types</span>
</div>

## 12.9 Type Aliases

### 12.9.1 Syntax

```text
type_alias_decl ::= attribute_list? visibility? "type" identifier generic_params? predicate_clause? "=" type
```

### 12.9.2 Parsing

**(Parse-Type-Alias)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{type})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseGenericParamsOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParsePredicateClauseOpt}(P_{3})\ \Downarrow \ (P_{4},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}})\quad \operatorname{IsOp}(\operatorname{Tok}(P_{4}),\ \texttt{"="})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P_{4}))\ \Downarrow \ (P_{5},\ \mathsf{ty}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseItem}(P)\ \Downarrow \ (P_{5},\ \langle \mathsf{TypeAliasDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{ty},\ \operatorname{SpanBetween}(P,\ P_{5}),\ []\rangle )
\end{array}
$$

### 12.9.3 AST Representation / Form

$$
\mathsf{TypeAliasDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{type},\ \mathsf{span},\ \mathsf{doc}\rangle
$$

$$
\begin{array}{l}
\operatorname{AliasBody}(p)\ =\ \mathsf{ty}\ \Leftrightarrow \ \Sigma .\mathsf{Types}[p]\ =\ \operatorname{TypeAliasDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{ty},\ \mathsf{span},\ \mathsf{doc}) \\[0.16em]
\operatorname{AliasParams}(p)\ =\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}}\ \Leftrightarrow \ \Sigma .\mathsf{Types}[p]\ =\ \operatorname{TypeAliasDecl}(\_,\ \_,\ \_,\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \_,\ \_,\ \_,\ \_) \\[0.16em]
\operatorname{AliasPredicateClause}(p)\ =\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}\ \Leftrightarrow \ \Sigma .\mathsf{Types}[p]\ =\ \operatorname{TypeAliasDecl}(\_,\ \_,\ \_,\ \_,\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \_,\ \_,\ \_)
\end{array}
$$

### 12.9.4 Static Semantics

Rule **(Bind-TypeAlias)** is defined once by §7.5.

**(ResolveItem-TypeAlias)**

$$
\begin{array}{l}
S_{\mathsf{gen}}\ =\ \operatorname{TypeParamBindings}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \Gamma_{g} \ =\ [S_{\mathsf{gen}},\ S_{\mathsf{module}},\ S_{\mathsf{universe}}]\quad \Gamma_{g} \ \vdash \ \operatorname{ResolveGenericParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\ \Downarrow \ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}}'\quad \Gamma_{g} \ \vdash \ \operatorname{ResolvePredicateClauseOpt}(\mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}})\ \Downarrow \ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}'\quad \Gamma_{g} \ \vdash \ \operatorname{ResolveType}(\mathsf{ty})\ \Downarrow \ \mathsf{ty}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveItem}(\operatorname{TypeAliasDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{ty},\ \mathsf{span},\ \mathsf{doc}))\ \Downarrow \ \operatorname{TypeAliasDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}}',\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}',\ \mathsf{ty}',\ \mathsf{span},\ \mathsf{doc})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{AliasStep}(\operatorname{TypePath}(p))\ =\ \operatorname{AliasBody}(p)\ \mathsf{if}\ \mathsf{defined};\ \mathsf{otherwise}\ \operatorname{TypePath}(p) \\[0.16em]
\operatorname{AliasStep}(T)\ =\ T\ \mathsf{if}\ T\ \notin \ \{\operatorname{TypePath}(p)\} \\[0.16em]
\operatorname{AliasNorm}(T)\ = \\[0.16em]
\ \operatorname{TypePerm}(\mathsf{perm},\ \operatorname{AliasNorm}(\mathsf{base}))\ \mathsf{if}\ T\ =\ \operatorname{TypePerm}(\mathsf{perm},\ \mathsf{base}) \\[0.16em]
\ \operatorname{TypeTuple}([\operatorname{AliasNorm}(t)\ \mid \ t\ \in \ \mathsf{elems}])\ \mathsf{if}\ T\ =\ \operatorname{TypeTuple}(\mathsf{elems}) \\[0.16em]
\ \operatorname{TypeArray}(\operatorname{AliasNorm}(\mathsf{elem}),\ \mathsf{size}_{\mathsf{expr}})\ \mathsf{if}\ T\ =\ \operatorname{TypeArray}(\mathsf{elem},\ \mathsf{size}_{\mathsf{expr}}) \\[0.16em]
\ \operatorname{TypeSlice}(\operatorname{AliasNorm}(\mathsf{elem}))\ \mathsf{if}\ T\ =\ \operatorname{TypeSlice}(\mathsf{elem}) \\[0.16em]
\ \operatorname{TypeUnion}([\operatorname{AliasNorm}(t)\ \mid \ t\ \in \ \mathsf{members}])\ \mathsf{if}\ T\ =\ \operatorname{TypeUnion}(\mathsf{members}) \\[0.16em]
\ \operatorname{TypeFunc}([\langle m,\ \operatorname{AliasNorm}(t)\rangle \ \mid \ \langle m,\ t\rangle \ \in \ \mathsf{params}],\ \operatorname{AliasNorm}(\mathsf{ret}))\ \mathsf{if}\ T\ =\ \operatorname{TypeFunc}(\mathsf{params},\ \mathsf{ret}) \\[0.16em]
\ \operatorname{TypeApply}(\operatorname{AliasPath}(\mathsf{path}),\ [\operatorname{AliasNorm}(t)\ \mid \ t\ \in \ \mathsf{args}])\ \mathsf{if}\ T\ =\ \operatorname{TypeApply}(\mathsf{path},\ \mathsf{args}) \\[0.16em]
\ \operatorname{TypeDynamic}(\operatorname{AliasPath}(\mathsf{path}))\ \mathsf{if}\ T\ =\ \operatorname{TypeDynamic}(\mathsf{path}) \\[0.16em]
\ \operatorname{TypeOpaque}(\operatorname{AliasPath}(\mathsf{path}))\ \mathsf{if}\ T\ =\ \operatorname{TypeOpaque}(\mathsf{path}) \\[0.16em]
\ \operatorname{TypeModalState}(\operatorname{AliasModalRef}(\mathsf{modal}_{\mathsf{ref}}),\ \mathsf{state})\ \mathsf{if}\ T\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ \mathsf{state}) \\[0.16em]
\ \operatorname{TypePtr}(\operatorname{AliasNorm}(\mathsf{elem}),\ \mathsf{ptr}_{\mathsf{state}\_\mathsf{opt}})\ \mathsf{if}\ T\ =\ \operatorname{TypePtr}(\mathsf{elem},\ \mathsf{ptr}_{\mathsf{state}\_\mathsf{opt}}) \\[0.16em]
\ \operatorname{TypeRawPtr}(\mathsf{qual},\ \operatorname{AliasNorm}(\mathsf{elem}))\ \mathsf{if}\ T\ =\ \operatorname{TypeRawPtr}(\mathsf{qual},\ \mathsf{elem}) \\[0.16em]
\ \operatorname{TypeRange}(\operatorname{AliasNorm}(\mathsf{base}))\ \mathsf{if}\ T\ =\ \operatorname{TypeRange}(\mathsf{base}) \\[0.16em]
\ \operatorname{TypeRangeInclusive}(\operatorname{AliasNorm}(\mathsf{base}))\ \mathsf{if}\ T\ =\ \operatorname{TypeRangeInclusive}(\mathsf{base}) \\[0.16em]
\ \operatorname{TypeRangeFrom}(\operatorname{AliasNorm}(\mathsf{base}))\ \mathsf{if}\ T\ =\ \operatorname{TypeRangeFrom}(\mathsf{base}) \\[0.16em]
\ \operatorname{TypeRangeTo}(\operatorname{AliasNorm}(\mathsf{base}))\ \mathsf{if}\ T\ =\ \operatorname{TypeRangeTo}(\mathsf{base}) \\[0.16em]
\ \operatorname{TypeRangeToInclusive}(\operatorname{AliasNorm}(\mathsf{base}))\ \mathsf{if}\ T\ =\ \operatorname{TypeRangeToInclusive}(\mathsf{base}) \\[0.16em]
\ \operatorname{TypeRefine}(\operatorname{AliasNorm}(\mathsf{base}),\ \mathsf{pred})\ \mathsf{if}\ T\ =\ \operatorname{TypeRefine}(\mathsf{base},\ \mathsf{pred}) \\[0.16em]
\ \operatorname{AliasNorm}(\operatorname{AliasStep}(T))\ \mathsf{if}\ T\ =\ \operatorname{TypePath}(p) \\[0.16em]
\ T\ \mathsf{otherwise} \\[0.16em]
\operatorname{AliasPath}(p)\ =\ p\ \mathsf{if}\ \operatorname{AliasBody}(p)\ \mathsf{undefined} \\[0.16em]
\operatorname{AliasPath}(p)\ =\ \operatorname{AliasPath}(p')\ \mathsf{if}\ \operatorname{AliasBody}(p)\ =\ \operatorname{TypePath}(p') \\[0.16em]
\operatorname{AliasModalRef}(\operatorname{TypePath}(p))\ =\ \operatorname{TypePath}(\operatorname{AliasPath}(p)) \\[0.16em]
\operatorname{AliasModalRef}(\operatorname{TypeApply}(p,\ \mathsf{args}))\ =\ \operatorname{TypeApply}(\operatorname{AliasPath}(p),\ [\operatorname{AliasNorm}(t)\ \mid \ t\ \in \ \mathsf{args}]) \\[0.16em]
\operatorname{AliasTransparent}(T,\ U)\ \Leftrightarrow \ \operatorname{AliasNorm}(T)\ =\ \operatorname{AliasNorm}(U) \\[0.16em]
\mathsf{AliasGraph}\ =\ \{\ \langle p,\ q\rangle \ \mid \ \operatorname{AliasBody}(p)\ =\ T\ \land \ q\ \in \ \operatorname{TypePaths}(T)\ \} \\[0.16em]
\operatorname{TypePaths}(\operatorname{TypePrim}(\_))\ =\ \emptyset \\[0.16em]
\operatorname{TypePaths}(\operatorname{TypeRange}(\mathsf{base}))\ =\ \operatorname{TypePaths}(\mathsf{base}) \\[0.16em]
\operatorname{TypePaths}(\operatorname{TypeRangeInclusive}(\mathsf{base}))\ =\ \operatorname{TypePaths}(\mathsf{base}) \\[0.16em]
\operatorname{TypePaths}(\operatorname{TypeRangeFrom}(\mathsf{base}))\ =\ \operatorname{TypePaths}(\mathsf{base}) \\[0.16em]
\operatorname{TypePaths}(\operatorname{TypeRangeTo}(\mathsf{base}))\ =\ \operatorname{TypePaths}(\mathsf{base}) \\[0.16em]
\operatorname{TypePaths}(\operatorname{TypeRangeToInclusive}(\mathsf{base}))\ =\ \operatorname{TypePaths}(\mathsf{base}) \\[0.16em]
\operatorname{TypePaths}(\mathsf{TypeRangeFull})\ =\ \emptyset \\[0.16em]
\operatorname{TypePaths}(\operatorname{TypePerm}(\_,\ T))\ =\ \operatorname{TypePaths}(T) \\[0.16em]
\operatorname{TypePaths}(\operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}]))\ =\ \bigcup \_\{i=1\}^n\ \operatorname{TypePaths}(T_{i}) \\[0.16em]
\operatorname{TypePaths}(\operatorname{TypeArray}(T,\ \_))\ =\ \operatorname{TypePaths}(T) \\[0.16em]
\operatorname{TypePaths}(\operatorname{TypeSlice}(T))\ =\ \operatorname{TypePaths}(T) \\[0.16em]
\operatorname{TypePaths}(\operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}]))\ =\ \bigcup \_\{i=1\}^n\ \operatorname{TypePaths}(T_{i}) \\[0.16em]
\operatorname{TypePaths}(\operatorname{TypeFunc}([\langle \_,\ T_{1}\rangle ,\ \ldots ,\ \langle \_,\ T_{n}\rangle ],\ R))\ =\ (\bigcup \_\{i=1\}^n\ \operatorname{TypePaths}(T_{i}))\ \cup \ \operatorname{TypePaths}(R) \\[0.16em]
\operatorname{TypePaths}(\operatorname{TypeApply}(p,\ \mathsf{args}))\ =\ \{p\}\ \cup \ (\bigcup \_\{t\ \in \ \mathsf{args}\}\ \operatorname{TypePaths}(t)) \\[0.16em]
\operatorname{TypePaths}(\operatorname{TypePtr}(T,\ \_))\ =\ \operatorname{TypePaths}(T) \\[0.16em]
\operatorname{TypePaths}(\operatorname{TypeRawPtr}(\_,\ T))\ =\ \operatorname{TypePaths}(T) \\[0.16em]
\operatorname{TypePaths}(\operatorname{TypeString}(\_))\ =\ \emptyset \\[0.16em]
\operatorname{TypePaths}(\operatorname{TypeBytes}(\_))\ =\ \emptyset \\[0.16em]
\operatorname{TypePaths}(\operatorname{TypeDynamic}(p))\ =\ \{p\} \\[0.16em]
\operatorname{TypePaths}(\operatorname{TypeOpaque}(p))\ =\ \{p\} \\[0.16em]
\operatorname{TypePaths}(\operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ \_))\ =\ \operatorname{TypePathsOfModalRef}(\mathsf{modal}_{\mathsf{ref}}) \\[0.16em]
\operatorname{TypePaths}(\operatorname{TypePath}(p))\ =\ \{p\} \\[0.16em]
\operatorname{TypePaths}(\operatorname{TypeRefine}(\mathsf{base},\ \_))\ =\ \operatorname{TypePaths}(\mathsf{base}) \\[0.16em]
\operatorname{TypePathsOfModalRef}(\operatorname{TypePath}(p))\ =\ \{p\} \\[0.16em]
\operatorname{TypePathsOfModalRef}(\operatorname{TypeApply}(p,\ \mathsf{args}))\ =\ \{p\}\ \cup \ (\bigcup \_\{t\ \in \ \mathsf{args}\}\ \operatorname{TypePaths}(t))
\end{array}
$$

$$
\operatorname{AliasCycle}(p)\ \Leftrightarrow \ p\ \in \ \mathsf{Reach}^+(\mathsf{AliasGraph},\ p)
$$

$$
\begin{array}{l}
\Sigma .\mathsf{Types}[p]\ =\ \operatorname{TypeAliasDecl}(\_,\ \_,\ \_,\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{ty},\ \_,\ \_)\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \mathsf{params}_{\mathsf{gen}}\ =\ [P_{1},\ \ldots ,\ P_{n}]\quad \Gamma \ \vdash \ \langle P_{1};\ \ldots ;\ P_{n}\rangle \ \mathsf{wf}\quad \Gamma_{g} \ =\ \operatorname{BindTypeParams}(\Gamma ,\ \mathsf{params}_{\mathsf{gen}})\quad \Gamma_{g} ;\ \mathsf{params}_{\mathsf{gen}}\ \vdash \ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}\ \mathsf{wf}\quad \Gamma_{g} \ \vdash \ \mathsf{ty}\ \mathsf{wf}\quad \lnot \ \operatorname{AliasCycle}(p) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ p\ :\ \mathsf{TypeAliasOk}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{AliasCycle}(p)\quad c\ =\ \operatorname{Code}(\mathsf{TypeAlias}-\mathsf{Recursive}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ p\ :\ \mathsf{TypeAliasOk}\ \Uparrow \ c
\end{array}
$$

### 12.9.5 Dynamic Semantics

Type aliases introduce no distinct runtime values. Dynamic semantics use the alias body after alias normalization.

### 12.9.6 Lowering

**(Size-Alias)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{AliasBody}(p)\ =\ \mathsf{ty}\quad \Gamma \ \vdash \ \operatorname{sizeof}(\mathsf{ty})\ =\ \mathsf{size} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ \mathsf{size}
\end{array}
$$

**(Align-Alias)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{AliasBody}(p)\ =\ \mathsf{ty}\quad \Gamma \ \vdash \ \operatorname{alignof}(\mathsf{ty})\ =\ \mathsf{align} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{align}
\end{array}
$$

**(Layout-Alias)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{AliasBody}(p)\ =\ \mathsf{ty}\quad \Gamma \ \vdash \ \operatorname{layout}(\mathsf{ty})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle
\end{array}
$$

$$
\operatorname{ValueBits}(\operatorname{TypePath}(p),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ \operatorname{AliasBody}(p)\ =\ \mathsf{ty}\ \land \ \operatorname{ValueBits}(\mathsf{ty},\ v)\ =\ \mathsf{bits}
$$

### 12.9.7 Diagnostics

Diagnostics are defined for recursive type aliases. Generic-argument count and bound failures for alias applications are defined by the shared type-application rules in Chapter 14.
