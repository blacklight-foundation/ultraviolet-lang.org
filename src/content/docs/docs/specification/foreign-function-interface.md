---
title: "Foreign Function Interface"
description: "23. Foreign Function Interface of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T18:13:03.158Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## 23. Foreign Function Interface

**FFI Boundary.** A call to an `extern` procedure or an invocation of a `[[export]]` or `[[host_export]]` procedure from foreign code crosses the foreign-function boundary.

```math
\operatorname{FFIBoundary}(\mathsf{proc})\ \Leftrightarrow \ \mathsf{proc}\ =\ \operatorname{ExternProcDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \lor \ (\mathsf{proc}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \land \ (\operatorname{ExportAttr}(\mathsf{proc})\ \mathsf{defined}\ \lor \ \operatorname{HostExportAttr}(\mathsf{proc})\ \mathsf{defined}))
```

### 23.1 FfiSafe

#### 23.1.1 Syntax

This section introduces no additional concrete syntax.

#### 23.1.2 Parsing

This section introduces no additional parsing rules.

#### 23.1.3 AST Representation / Form

`FfiSafeType` is a semantic predicate over existing `Type` forms, including `TypePrim`, `TypeArray`, `TypeFunc`, `TypePerm`, `TypePath`, and `TypeApply`.

#### 23.1.4 Static Semantics

**FfiSafe Predicate.** `FfiSafeType(T)` holds when the runtime representation of `T` is compatible with the platform C ABI.

```math
\mathsf{FfiSafeJudg}\ =\ \{\mathsf{FfiSafeType}\}
```

```math
\mathsf{FfiPrimTypes}\ =\ \{\texttt{i8},\ \texttt{i16},\ \texttt{i32},\ \texttt{i64},\ \texttt{i128},\ \texttt{u8},\ \texttt{u16},\ \texttt{u32},\ \texttt{u64},\ \texttt{u128},\ \texttt{isize},\ \texttt{usize},\ \texttt{f16},\ \texttt{f32},\ \texttt{f64},\ \texttt{char},\ \texttt{()}\}
```

```math
\begin{array}{l}
\operatorname{HasLayoutC}(D)\ \Leftrightarrow \ \texttt{layout(C)}\ \mathsf{appears}\ \mathsf{in}\ D.\mathsf{attrs}_{\mathsf{opt}} \\
\operatorname{PayloadTypes}(v)\ =\ []\quad \mathsf{if}\ v.\mathsf{payload}_{\mathsf{opt}}\ =\ \bot  \\
\operatorname{PayloadTypes}(v)\ =\ \mathsf{ts}\quad \mathsf{if}\ v.\mathsf{payload}_{\mathsf{opt}}\ =\ \operatorname{TuplePayload}(\mathsf{ts}) \\
\operatorname{PayloadTypes}(v)\ =\ [T_{f}\ \mid \ \langle \_,\ f,\ T_{f},\ \_,\ \_,\ \_\rangle \ \in \ \mathsf{fields}]\quad \mathsf{if}\ v.\mathsf{payload}_{\mathsf{opt}}\ =\ \operatorname{RecordPayload}(\mathsf{fields})
\end{array}
```

```math
\operatorname{TypeParamSet}(\mathsf{params})\ =\ \operatorname{Set}(\operatorname{TypeParamNames}(\mathsf{params}))
```

```math
\begin{array}{l}
\operatorname{AliasParams}(p)\ =\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}}\ \Leftrightarrow \ \Sigma .\mathsf{Types}[p]\ =\ \operatorname{TypeAliasDecl}(\_,\ \_,\ \_,\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \_,\ \_,\ \_,\ \_) \\
\operatorname{AliasPredicateClause}(p)\ =\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}\ \Leftrightarrow \ \Sigma .\mathsf{Types}[p]\ =\ \operatorname{TypeAliasDecl}(\_,\ \_,\ \_,\ \_,\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \_,\ \_,\ \_)
\end{array}
```

```math
\begin{array}{l}
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypePath}([x]))\ =\ \theta (x)\quad \mathsf{if}\ x\ \in \ \operatorname{dom}(\theta ) \\
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypePath}(p))\ =\ \operatorname{TypePath}(p)\quad \mathsf{if}\ p\ \ne \ [x]\ \lor \ x\ \notin \ \operatorname{dom}(\theta ) \\
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeApply}(p,\ \mathsf{args}))\ =\ \operatorname{TypeApply}(p,\ [\operatorname{TypeSubst}(\theta ,\ a)\ \mid \ a\ \in \ \mathsf{args}]) \\
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypePerm}(p,\ T))\ =\ \operatorname{TypePerm}(p,\ \operatorname{TypeSubst}(\theta ,\ T)) \\
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeTuple}(\mathsf{ts}))\ =\ \operatorname{TypeTuple}([\operatorname{TypeSubst}(\theta ,\ t)\ \mid \ t\ \in \ \mathsf{ts}]) \\
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeArray}(T,\ e))\ =\ \operatorname{TypeArray}(\operatorname{TypeSubst}(\theta ,\ T),\ e) \\
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeSlice}(T))\ =\ \operatorname{TypeSlice}(\operatorname{TypeSubst}(\theta ,\ T)) \\
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeUnion}(\mathsf{ts}))\ =\ \operatorname{TypeUnion}([\operatorname{TypeSubst}(\theta ,\ t)\ \mid \ t\ \in \ \mathsf{ts}]) \\
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeFunc}(\mathsf{params},\ R))\ =\ \operatorname{TypeFunc}([\langle m,\ \operatorname{TypeSubst}(\theta ,\ T)\rangle \ \mid \ \langle m,\ T\rangle \ \in \ \mathsf{params}],\ \operatorname{TypeSubst}(\theta ,\ R)) \\
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypePtr}(T,\ s))\ =\ \operatorname{TypePtr}(\operatorname{TypeSubst}(\theta ,\ T),\ s) \\
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeRawPtr}(q,\ T))\ =\ \operatorname{TypeRawPtr}(q,\ \operatorname{TypeSubst}(\theta ,\ T)) \\
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeString}(s))\ =\ \operatorname{TypeString}(s) \\
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeBytes}(s))\ =\ \operatorname{TypeBytes}(s) \\
\operatorname{ModalRefSubst}(\theta ,\ \operatorname{TypePath}(p))\ =\ \operatorname{TypePath}(p) \\
\operatorname{ModalRefSubst}(\theta ,\ \operatorname{TypeApply}(p,\ \mathsf{args}))\ =\ \operatorname{TypeApply}(p,\ [\operatorname{TypeSubst}(\theta ,\ a)\ \mid \ a\ \in \ \mathsf{args}]) \\
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S))\ =\ \operatorname{TypeModalState}(\operatorname{ModalRefSubst}(\theta ,\ \mathsf{modal}_{\mathsf{ref}}),\ S) \\
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeDynamic}(p))\ =\ \operatorname{TypeDynamic}(p) \\
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeOpaque}(p))\ =\ \operatorname{TypeOpaque}(p) \\
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypePrim}(n))\ =\ \operatorname{TypePrim}(n) \\
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeRange}(\mathsf{base}))\ =\ \operatorname{TypeRange}(\operatorname{TypeSubst}(\theta ,\ \mathsf{base})) \\
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeRangeInclusive}(\mathsf{base}))\ =\ \operatorname{TypeRangeInclusive}(\operatorname{TypeSubst}(\theta ,\ \mathsf{base})) \\
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeRangeFrom}(\mathsf{base}))\ =\ \operatorname{TypeRangeFrom}(\operatorname{TypeSubst}(\theta ,\ \mathsf{base})) \\
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeRangeTo}(\mathsf{base}))\ =\ \operatorname{TypeRangeTo}(\operatorname{TypeSubst}(\theta ,\ \mathsf{base})) \\
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeRangeToInclusive}(\mathsf{base}))\ =\ \operatorname{TypeRangeToInclusive}(\operatorname{TypeSubst}(\theta ,\ \mathsf{base})) \\
\operatorname{TypeSubst}(\theta ,\ \mathsf{TypeRangeFull})\ =\ \mathsf{TypeRangeFull}
\end{array}
```

```math
\begin{array}{l}
\operatorname{TypeParamsIn}(\operatorname{TypePath}([x]),\ \mathsf{params})\ =\ \{x\}\quad \mathsf{if}\ x\ \in \ \operatorname{TypeParamSet}(\mathsf{params}) \\
\operatorname{TypeParamsIn}(\operatorname{TypePath}(p),\ \mathsf{params})\ =\ \emptyset \quad \mathsf{if}\ p\ \ne \ [x]\ \lor \ x\ \notin \ \operatorname{TypeParamSet}(\mathsf{params}) \\
\operatorname{TypeParamsIn}(\operatorname{TypeApply}(\_,\ \mathsf{args}),\ \mathsf{params})\ =\ \bigcup \_\{a\ \in \ \mathsf{args}\}\ \operatorname{TypeParamsIn}(a,\ \mathsf{params}) \\
\operatorname{TypeParamsIn}(\operatorname{TypePerm}(\_,\ T),\ \mathsf{params})\ =\ \operatorname{TypeParamsIn}(T,\ \mathsf{params}) \\
\operatorname{TypeParamsIn}(\operatorname{TypeTuple}(\mathsf{ts}),\ \mathsf{params})\ =\ \bigcup \_\{t\ \in \ \mathsf{ts}\}\ \operatorname{TypeParamsIn}(t,\ \mathsf{params}) \\
\operatorname{TypeParamsIn}(\operatorname{TypeArray}(T,\ \_),\ \mathsf{params})\ =\ \operatorname{TypeParamsIn}(T,\ \mathsf{params}) \\
\operatorname{TypeParamsIn}(\operatorname{TypeSlice}(T),\ \mathsf{params})\ =\ \operatorname{TypeParamsIn}(T,\ \mathsf{params}) \\
\operatorname{TypeParamsIn}(\operatorname{TypeUnion}(\mathsf{ts}),\ \mathsf{params})\ =\ \bigcup \_\{t\ \in \ \mathsf{ts}\}\ \operatorname{TypeParamsIn}(t,\ \mathsf{params}) \\
\operatorname{TypeParamsIn}(\operatorname{TypeFunc}(\mathsf{params}_{t},\ R),\ \mathsf{params})\ =\ \bigcup \_\{\langle \_,\ T\rangle \ \in \ \mathsf{params}_{t}\}\ \operatorname{TypeParamsIn}(T,\ \mathsf{params})\ \cup \ \operatorname{TypeParamsIn}(R,\ \mathsf{params}) \\
\operatorname{TypeParamsIn}(\operatorname{TypePtr}(T,\ \_),\ \mathsf{params})\ =\ \operatorname{TypeParamsIn}(T,\ \mathsf{params}) \\
\operatorname{TypeParamsIn}(\operatorname{TypeRawPtr}(\_,\ T),\ \mathsf{params})\ =\ \operatorname{TypeParamsIn}(T,\ \mathsf{params}) \\
\operatorname{TypeParamsInModalRef}(\operatorname{TypePath}(\_),\ \mathsf{params})\ =\ \emptyset  \\
\operatorname{TypeParamsInModalRef}(\operatorname{TypeApply}(\_,\ \mathsf{args}),\ \mathsf{params})\ =\ \bigcup \_\{a\ \in \ \mathsf{args}\}\ \operatorname{TypeParamsIn}(a,\ \mathsf{params}) \\
\operatorname{TypeParamsIn}(\operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ \_),\ \mathsf{params})\ =\ \operatorname{TypeParamsInModalRef}(\mathsf{modal}_{\mathsf{ref}},\ \mathsf{params}) \\
\operatorname{TypeParamsIn}(\operatorname{TypeString}(\_),\ \mathsf{params})\ =\ \emptyset  \\
\operatorname{TypeParamsIn}(\operatorname{TypeBytes}(\_),\ \mathsf{params})\ =\ \emptyset  \\
\operatorname{TypeParamsIn}(\operatorname{TypeModalState}(\_,\ \_),\ \mathsf{params})\ =\ \emptyset  \\
\operatorname{TypeParamsIn}(\operatorname{TypeDynamic}(\_),\ \mathsf{params})\ =\ \emptyset  \\
\operatorname{TypeParamsIn}(\operatorname{TypeOpaque}(\_),\ \mathsf{params})\ =\ \emptyset  \\
\operatorname{TypeParamsIn}(\operatorname{TypePrim}(\_),\ \mathsf{params})\ =\ \emptyset  \\
\operatorname{TypeParamsIn}(\operatorname{TypeRange}(\mathsf{base}),\ \mathsf{params})\ =\ \operatorname{TypeParamsIn}(\mathsf{base},\ \mathsf{params}) \\
\operatorname{TypeParamsIn}(\operatorname{TypeRangeInclusive}(\mathsf{base}),\ \mathsf{params})\ =\ \operatorname{TypeParamsIn}(\mathsf{base},\ \mathsf{params}) \\
\operatorname{TypeParamsIn}(\operatorname{TypeRangeFrom}(\mathsf{base}),\ \mathsf{params})\ =\ \operatorname{TypeParamsIn}(\mathsf{base},\ \mathsf{params}) \\
\operatorname{TypeParamsIn}(\operatorname{TypeRangeTo}(\mathsf{base}),\ \mathsf{params})\ =\ \operatorname{TypeParamsIn}(\mathsf{base},\ \mathsf{params}) \\
\operatorname{TypeParamsIn}(\operatorname{TypeRangeToInclusive}(\mathsf{base}),\ \mathsf{params})\ =\ \operatorname{TypeParamsIn}(\mathsf{base},\ \mathsf{params}) \\
\operatorname{TypeParamsIn}(\mathsf{TypeRangeFull},\ \mathsf{params})\ =\ \emptyset 
\end{array}
```

```math
\begin{array}{l}
\operatorname{TypeParamsInFields}(\mathsf{fields},\ \mathsf{params})\ =\ \bigcup \_\{f\ \in \ \mathsf{fields}\}\ \operatorname{TypeParamsIn}(f.\mathsf{type},\ \mathsf{params}) \\
\operatorname{TypeParamsInPayloads}(\mathsf{vars},\ \mathsf{params})\ =\ \bigcup \_\{v\ \in \ \mathsf{vars}\}\ \bigcup \_\{T_{f}\ \in \ \operatorname{PayloadTypes}(v)\}\ \operatorname{TypeParamsIn}(T_{f},\ \mathsf{params})
\end{array}
```

```math
\begin{array}{l}
\operatorname{HasFfiSafeReq}(W,\ x)\ \Leftrightarrow \ \exists \ \mathsf{wp}\ \in \ \operatorname{PredicateReqs}(W).\ \mathsf{wp}\ =\ \operatorname{PredicateReq}(\texttt{FfiSafe},\ \operatorname{TypePath}([x])) \\
\operatorname{FfiSafePredicateClauseOk}(\mathsf{params},\ W,\ \mathsf{Xs})\ \Leftrightarrow \ \forall \ x\ \in \ \mathsf{Xs}.\ \operatorname{HasFfiSafeReq}(W,\ x)
\end{array}
```

```math
\begin{array}{l}
\operatorname{ProhibitedFfiType}(T)\ \Leftrightarrow  \\
\ T\ =\ \operatorname{TypePrim}(\texttt{"bool"})\ \lor  \\
\ T\ =\ \operatorname{TypePtr}(\_,\ \_)\ \lor  \\
\ T\ =\ \operatorname{TypeModalState}(\_,\ \_)\ \lor  \\
\ T\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\ \lor  \\
\ T\ =\ \operatorname{TypeDynamic}(\_)\ \lor  \\
\ T\ =\ \operatorname{TypeOpaque}(\_)\ \lor  \\
\ T\ =\ \operatorname{TypeTuple}(\_)\ \lor  \\
\ T\ =\ \operatorname{TypeUnion}(\_)\ \lor  \\
\ T\ =\ \operatorname{TypeSlice}(\_)\ \lor  \\
\ T\ =\ \operatorname{TypeString}(\_)\ \lor  \\
\ T\ =\ \operatorname{TypeBytes}(\_)\ \lor  \\
\ T\ =\ \operatorname{TypeRange}(\_)\ \lor  \\
\ T\ =\ \operatorname{TypeRangeInclusive}(\_)\ \lor  \\
\ T\ =\ \operatorname{TypeRangeFrom}(\_)\ \lor  \\
\ T\ =\ \operatorname{TypeRangeTo}(\_)\ \lor  \\
\ T\ =\ \operatorname{TypeRangeToInclusive}(\_)\ \lor  \\
\ T\ =\ \mathsf{TypeRangeFull}\ \lor  \\
\ T\ =\ \operatorname{TypePath}([\texttt{"Context"}])
\end{array}
```

```math
\begin{array}{l}
\operatorname{FfiByValueType}(T)\ \Leftrightarrow \ \operatorname{StripPerm}(T)\ \notin \ \{\operatorname{TypeRawPtr}(\_,\ \_),\ \operatorname{TypePtr}(\_,\ \_),\ \operatorname{TypeFunc}(\_,\ \_)\}\ \land \ \operatorname{StripPerm}(T)\ \ne \ \operatorname{TypePrim}(\texttt{"()"}) \\
\operatorname{FfiPassByValueAttr}(T)\ \Leftrightarrow \ (T\ =\ \operatorname{TypePath}(p)\ \land \ \operatorname{RecordDecl}(p)\ =\ R\ \land \ \operatorname{AttrByName}(R,\ \texttt{"ffi\_pass\_by\_value"})\ \ne \ [])\ \lor \ (T\ =\ \operatorname{TypePath}(p)\ \land \ \operatorname{EnumDecl}(p)\ =\ E\ \land \ \operatorname{AttrByName}(E,\ \texttt{"ffi\_pass\_by\_value"})\ \ne \ []) \\
\operatorname{FfiByValueOk}(T)\ \Leftrightarrow \ \lnot (\operatorname{DropType}(T)\ \land \ \operatorname{FfiSafeType}(T)\ \Downarrow \ \mathsf{ok}\ \land \ \operatorname{FfiByValueType}(T))\ \lor \ \operatorname{FfiPassByValueAttr}(\operatorname{StripPerm}(T))
\end{array}
```

**(FfiSafe-Prim)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePrim}(t)\quad t\ \in \ \mathsf{FfiPrimTypes} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
```

**(FfiSafe-RawPtr)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeRawPtr}(\_,\ \_) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
```

**(FfiSafe-Array)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeArray}(U,\ n)\quad \Gamma \ \vdash \ \operatorname{ConstLen}(n)\ \Downarrow \ \_\quad \Gamma \ \vdash \ \operatorname{FfiSafeType}(U)\ \Downarrow \ \mathsf{ok} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
```

**(FfiSafe-Func)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeFunc}(\mathsf{params},\ R)\quad \forall \ \langle \_,\ T_{i}\rangle \ \in \ \mathsf{params}.\ \Gamma \ \vdash \ \operatorname{FfiSafeType}(T_{i})\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{FfiSafeType}(R)\ \Downarrow \ \mathsf{ok} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
```

**(FfiSafe-Perm)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePerm}(\_,\ U)\quad \Gamma \ \vdash \ \operatorname{FfiSafeType}(U)\ \Downarrow \ \mathsf{ok} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
```

**(FfiSafe-Alias)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{AliasBody}(p)\ =\ \mathsf{ty}\quad \Gamma \ \vdash \ \operatorname{FfiSafeType}(\mathsf{ty})\ \Downarrow \ \mathsf{ok} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
```

**(FfiSafe-Alias-Apply)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeApply}(p,\ \mathsf{args})\quad \operatorname{AliasBody}(p)\ =\ \mathsf{ty}\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(\operatorname{AliasParams}(p))\quad \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{args})\ =\ \mathsf{args}'\quad \theta \ =\ [\mathsf{args}'\_i\ /\ \mathsf{params}_{\mathsf{gen}}[i].\mathsf{name}]\quad \Gamma \ \vdash \ \operatorname{AliasPredicateClause}(p)[\theta ]\ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{FfiSafeType}(\operatorname{TypeSubst}(\theta ,\ \mathsf{ty}))\ \Downarrow \ \mathsf{ok} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
```

**(FfiSafe-Record)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \operatorname{HasLayoutC}(R)\quad \operatorname{TypeParamsOpt}(R.\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\ =\ []\quad \Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \_\quad \forall \ f\ :\ T_{f}\ \in \ \operatorname{Fields}(R).\ \Gamma \ \vdash \ \operatorname{FfiSafeType}(T_{f})\ \Downarrow \ \mathsf{ok}\quad \operatorname{FfiSafePredicateClauseOk}([],\ R.\mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \emptyset ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
```

**(FfiSafe-Record-Apply)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeApply}(p,\ \mathsf{args})\quad \operatorname{RecordDecl}(p)\ =\ R\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(R.\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{args})\ =\ \mathsf{args}'\quad \theta \ =\ [\mathsf{args}'\_i\ /\ \mathsf{params}_{\mathsf{gen}}[i].\mathsf{name}]\quad \operatorname{HasLayoutC}(R)\quad \Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \_\quad \Gamma \ \vdash \ R.\mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}[\theta ]\ \mathsf{ok}\quad \operatorname{FfiSafePredicateClauseOk}(\mathsf{params}_{\mathsf{gen}},\ R.\mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \operatorname{TypeParamsInFields}(\operatorname{Fields}(R),\ \mathsf{params}_{\mathsf{gen}}))\quad \forall \ f\ :\ T_{f}\ \in \ \operatorname{Fields}(R).\ \Gamma \ \vdash \ \operatorname{FfiSafeType}(\operatorname{TypeSubst}(\theta ,\ T_{f}))\ \Downarrow \ \mathsf{ok} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
```

**(FfiSafe-Enum)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{HasLayoutC}(E)\quad \operatorname{TypeParamsOpt}(E.\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\ =\ []\quad \Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \_\quad \forall \ v\ \in \ \operatorname{Variants}(E).\ \forall \ T_{f}\ \in \ \operatorname{PayloadTypes}(v).\ \Gamma \ \vdash \ \operatorname{FfiSafeType}(T_{f})\ \Downarrow \ \mathsf{ok}\quad \operatorname{FfiSafePredicateClauseOk}([],\ E.\mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \emptyset ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
```

**(FfiSafe-Enum-Apply)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeApply}(p,\ \mathsf{args})\quad \operatorname{EnumDecl}(p)\ =\ E\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(E.\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{args})\ =\ \mathsf{args}'\quad \theta \ =\ [\mathsf{args}'\_i\ /\ \mathsf{params}_{\mathsf{gen}}[i].\mathsf{name}]\quad \operatorname{HasLayoutC}(E)\quad \Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \_\quad \Gamma \ \vdash \ E.\mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}[\theta ]\ \mathsf{ok}\quad \operatorname{FfiSafePredicateClauseOk}(\mathsf{params}_{\mathsf{gen}},\ E.\mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \operatorname{TypeParamsInPayloads}(\operatorname{Variants}(E),\ \mathsf{params}_{\mathsf{gen}}))\quad \forall \ v\ \in \ \operatorname{Variants}(E).\ \forall \ T_{f}\ \in \ \operatorname{PayloadTypes}(v).\ \Gamma \ \vdash \ \operatorname{FfiSafeType}(\operatorname{TypeSubst}(\theta ,\ T_{f}))\ \Downarrow \ \mathsf{ok} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
```

**(FfiSafe-Prohibited-Err)**

```math
\begin{array}{l}
\operatorname{ProhibitedFfiType}(T)\quad c\ =\ \operatorname{Code}(\mathsf{FfiSafe}-\mathsf{Prohibited}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Uparrow \ c
\end{array}
```

**(FfiSafe-Record-LayoutC-Err)**

```math
\begin{array}{l}
(T\ =\ \operatorname{TypePath}(p)\ \lor \ T\ =\ \operatorname{TypeApply}(p,\ \_))\quad \operatorname{RecordDecl}(p)\ =\ R\quad \lnot \ \operatorname{HasLayoutC}(R)\quad c\ =\ \operatorname{Code}(\mathsf{FfiSafe}-\mathsf{Record}-\mathsf{LayoutC}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Uparrow \ c
\end{array}
```

**(FfiSafe-Enum-LayoutC-Err)**

```math
\begin{array}{l}
(T\ =\ \operatorname{TypePath}(p)\ \lor \ T\ =\ \operatorname{TypeApply}(p,\ \_))\quad \operatorname{EnumDecl}(p)\ =\ E\quad \lnot \ \operatorname{HasLayoutC}(E)\quad c\ =\ \operatorname{Code}(\mathsf{FfiSafe}-\mathsf{Enum}-\mathsf{LayoutC}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Uparrow \ c
\end{array}
```

**(FfiSafe-Record-Field-Err)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \operatorname{HasLayoutC}(R)\quad \exists \ f\ :\ T_{f}\ \in \ \operatorname{Fields}(R).\ \Gamma \ \vdash \ \operatorname{FfiSafeType}(T_{f})\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{FfiSafe}-\mathsf{Record}-\mathsf{Field}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Uparrow \ c
\end{array}
```

**(FfiSafe-Record-Field-Apply-Err)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeApply}(p,\ \mathsf{args})\quad \operatorname{RecordDecl}(p)\ =\ R\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(R.\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{args})\ =\ \mathsf{args}'\quad \theta \ =\ [\mathsf{args}'\_i\ /\ \mathsf{params}_{\mathsf{gen}}[i].\mathsf{name}]\quad \operatorname{HasLayoutC}(R)\quad \exists \ f\ :\ T_{f}\ \in \ \operatorname{Fields}(R).\ \Gamma \ \vdash \ \operatorname{FfiSafeType}(\operatorname{TypeSubst}(\theta ,\ T_{f}))\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{FfiSafe}-\mathsf{Record}-\mathsf{Field}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Uparrow \ c
\end{array}
```

**(FfiSafe-Enum-Field-Err)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{HasLayoutC}(E)\quad \exists \ v\ \in \ \operatorname{Variants}(E).\ \exists \ T_{f}\ \in \ \operatorname{PayloadTypes}(v).\ \Gamma \ \vdash \ \operatorname{FfiSafeType}(T_{f})\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{FfiSafe}-\mathsf{Enum}-\mathsf{Field}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Uparrow \ c
\end{array}
```

**(FfiSafe-Enum-Field-Apply-Err)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeApply}(p,\ \mathsf{args})\quad \operatorname{EnumDecl}(p)\ =\ E\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(E.\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{args})\ =\ \mathsf{args}'\quad \theta \ =\ [\mathsf{args}'\_i\ /\ \mathsf{params}_{\mathsf{gen}}[i].\mathsf{name}]\quad \operatorname{HasLayoutC}(E)\quad \exists \ v\ \in \ \operatorname{Variants}(E).\ \exists \ T_{f}\ \in \ \operatorname{PayloadTypes}(v).\ \Gamma \ \vdash \ \operatorname{FfiSafeType}(\operatorname{TypeSubst}(\theta ,\ T_{f}))\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{FfiSafe}-\mathsf{Enum}-\mathsf{Field}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Uparrow \ c
\end{array}
```

**(FfiSafe-Incomplete-Err)**

```math
\begin{array}{l}
(T\ =\ \operatorname{TypePath}(p)\ \lor \ T\ =\ \operatorname{TypeApply}(p,\ \_))\quad (\operatorname{RecordDecl}(p)\ =\ R\ \lor \ \operatorname{EnumDecl}(p)\ =\ E)\quad \lnot \ \exists \ \tau .\ \Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \tau \quad c\ =\ \operatorname{Code}(\mathsf{FfiSafe}-\mathsf{Incomplete}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Uparrow \ c
\end{array}
```

**(FfiSafe-Record-Generic-Unbounded-Err)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(R.\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \mathsf{params}_{\mathsf{gen}}\ \ne \ []\quad \lnot \ \operatorname{FfiSafePredicateClauseOk}(\mathsf{params}_{\mathsf{gen}},\ R.\mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \operatorname{TypeParamsInFields}(\operatorname{Fields}(R),\ \mathsf{params}_{\mathsf{gen}}))\quad c\ =\ \operatorname{Code}(\mathsf{FfiSafe}-\mathsf{Generic}-\mathsf{Unbounded}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Uparrow \ c
\end{array}
```

**(FfiSafe-Enum-Generic-Unbounded-Err)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(E.\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \mathsf{params}_{\mathsf{gen}}\ \ne \ []\quad \lnot \ \operatorname{FfiSafePredicateClauseOk}(\mathsf{params}_{\mathsf{gen}},\ E.\mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \operatorname{TypeParamsInPayloads}(\operatorname{Variants}(E),\ \mathsf{params}_{\mathsf{gen}}))\quad c\ =\ \operatorname{Code}(\mathsf{FfiSafe}-\mathsf{Generic}-\mathsf{Unbounded}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Uparrow \ c
\end{array}
```

**(FfiSafe-Record-Apply-Generic-Unbounded-Err)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeApply}(p,\ \mathsf{args})\quad \operatorname{RecordDecl}(p)\ =\ R\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(R.\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \mathsf{params}_{\mathsf{gen}}\ \ne \ []\quad \lnot \ \operatorname{FfiSafePredicateClauseOk}(\mathsf{params}_{\mathsf{gen}},\ R.\mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \operatorname{TypeParamsInFields}(\operatorname{Fields}(R),\ \mathsf{params}_{\mathsf{gen}}))\quad c\ =\ \operatorname{Code}(\mathsf{FfiSafe}-\mathsf{Generic}-\mathsf{Unbounded}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Uparrow \ c
\end{array}
```

**(FfiSafe-Enum-Apply-Generic-Unbounded-Err)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeApply}(p,\ \mathsf{args})\quad \operatorname{EnumDecl}(p)\ =\ E\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(E.\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \mathsf{params}_{\mathsf{gen}}\ \ne \ []\quad \lnot \ \operatorname{FfiSafePredicateClauseOk}(\mathsf{params}_{\mathsf{gen}},\ E.\mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \operatorname{TypeParamsInPayloads}(\operatorname{Variants}(E),\ \mathsf{params}_{\mathsf{gen}}))\quad c\ =\ \operatorname{Code}(\mathsf{FfiSafe}-\mathsf{Generic}-\mathsf{Unbounded}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Uparrow \ c
\end{array}
```

**Prohibited Categories**

The following type categories MUST NOT satisfy `FfiSafeType`:

- `bool`
- Modal types
- Safe pointers `Ptr<T>`
- Dynamic class object types `TypeDynamic(_)`
- Opaque types
- Tuples
- Unions
- Slices
- String and bytes types
- `Context`
- Range types

**RAII by-value rule.** If a type satisfies both `DropType` and `FfiSafeType`, then any by-value appearance of that type in an FFI signature requires the defining type to carry `[[ffi_pass_by_value]]`.

```math
**\mathsf{Generic}\ \mathsf{Bounds}.**\ \mathsf{Any}\ \mathsf{type}\ \mathsf{parameter}\ \mathsf{that}\ \mathsf{appears}\ \mathsf{in}\ a\ \mathsf{field}\ \mathsf{type}\ \mathsf{or}\ \mathsf{variant}\ \mathsf{payload}\ \mathsf{of}\ a\ \mathsf{type}\ \mathsf{satisfying}\ \texttt{FfiSafeType}\ \mathsf{MUST}\ \mathsf{be}\ \mathsf{bounded}\ \mathsf{by}\ a\ \mathsf{predicate}\ \mathsf{requirement}\ \mathsf{of}\ \mathsf{the}\ \mathsf{form}\ \texttt{FfiSafe(X)}\ \mathsf{in}\ \mathsf{the}\ \mathsf{declaration}'s\ \texttt{|:}\ \mathsf{clause}.
```

#### 23.1.5 Dynamic Semantics

This section introduces no additional runtime mechanism. Dynamic boundary behavior is defined by §§23.2, 23.3, and 23.7.

#### 23.1.6 Lowering

`FfiSafeType` constrains which values may be lowered across an FFI boundary. This section introduces no additional feature-local lowering beyond the ABI and boundary rules defined in §§23.2, 23.3, and 23.7.

#### 23.1.7 Diagnostics

| Code         | Severity | Detection    | Condition                                                      |
| ------------ | -------- | ------------ | -------------------------------------------------------------- |
| `E-TYP-2623` | Error    | Compile-time | Prohibited type category in `FfiSafeType`                      |
| `E-TYP-2624` | Error    | Compile-time | `FfiSafeType` record without `[[layout(C)]]`                   |
| `E-TYP-2625` | Error    | Compile-time | `FfiSafeType` enum without `[[layout(C)]]`                     |
| `E-TYP-2626` | Error    | Compile-time | `FfiSafeType` record has non-`FfiSafeType` field               |
| `E-TYP-2627` | Error    | Compile-time | `FfiSafeType` enum has non-`FfiSafeType` payload field         |
| `E-TYP-2628` | Error    | Compile-time | `FfiSafeType` requires complete layout                         |
| `E-TYP-2629` | Error    | Compile-time | Generic `FfiSafeType` with unconstrained parameter             |
| `E-TYP-2630` | Error    | Compile-time | By-value FFI use of `DropType` without `[[ffi_pass_by_value]]` |

### 23.2 Extern Procedures

#### 23.2.1 Syntax

```text
extern_procedure_decl ::= attribute_list? visibility? "procedure" identifier generic_params? signature predicate_clause? contract_clause? foreign_contract_clause_list? terminator
```

#### 23.2.2 Parsing

**(Parse-ExternProcDecl)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{procedure})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseGenericParamsOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseSignature}(P_{3})\ \Downarrow \ (P_{4},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParsePredicateClauseOpt}(P_{4})\ \Downarrow \ (P_{5},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseContractClauseOpt}(P_{5})\ \Downarrow \ (P_{6},\ \mathsf{contract}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseForeignContractClauseListOpt}(P_{6})\ \Downarrow \ (P_{7},\ \mathsf{foreign}_{\mathsf{contracts}\_\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ConsumeTerminatorReq}(P_{7})\ \Downarrow \ P_{8} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseExternProcDecl}(P)\ \Downarrow \ (P_{8},\ \operatorname{ExternProcDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{foreign}_{\mathsf{contracts}\_\mathsf{opt}},\ \operatorname{SpanBetween}(P,\ P_{8}),\ []))
\end{array}
```

#### 23.2.3 AST Representation / Form

Extern procedure declarations are represented by:

```text
ExternProcDecl = ⟨attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, params, return_type_opt, contract_opt, foreign_contracts_opt, span, doc⟩
```

Extern procedure declarations also admit the derived forms:

```text
ProcName(proc) = name ⇔ proc = ExternProcDecl(_, _, name, _, _, _, _, _, _, _, _)
ExternRawName(proc) ⇔ proc = ExternProcDecl(_, _, _, _, _, _, _, _, _, _, _) ∧ ExternAbiName(ExternAbiOf(proc)) ∈ {"C", "C-unwind"}
```

#### 23.2.4 Static Semantics

**Extern Procedure.** A declaration whose implementation is provided by foreign code.

**ABI Strings**

```math
\mathsf{ExternAbiSet}\ =\ \{\texttt{"C"},\ \texttt{"C-unwind"},\ \texttt{"system"},\ \texttt{"stdcall"},\ \texttt{"fastcall"},\ \texttt{"vectorcall"}\}
```
AbiProfileOk("C", profile)
AbiProfileOk("C-unwind", profile)
AbiProfileOk("system", profile)

```math
\begin{array}{l}
\operatorname{AbiProfileOk}(\texttt{"stdcall"},\ \mathsf{profile})\ \Leftrightarrow \ \mathsf{profile}\ =\ \texttt{x86\_64-win64} \\
\operatorname{AbiProfileOk}(\texttt{"fastcall"},\ \mathsf{profile})\ \Leftrightarrow \ \mathsf{profile}\ =\ \texttt{x86\_64-win64} \\
\operatorname{AbiProfileOk}(\texttt{"vectorcall"},\ \mathsf{profile})\ \Leftrightarrow \ \mathsf{profile}\ =\ \texttt{x86\_64-win64} \\
\operatorname{ExternAbiOk}(\mathsf{abi}_{\mathsf{opt}})\ \Leftrightarrow \ \operatorname{ExternAbiName}(\mathsf{abi}_{\mathsf{opt}})\ \in \ \mathsf{ExternAbiSet}\ \land \ \operatorname{AbiProfileOk}(\operatorname{ExternAbiName}(\mathsf{abi}_{\mathsf{opt}}),\ \mathsf{SelectedTargetProfile})
\end{array}
```

**Signature Requirements**

```math
\begin{array}{l}
\operatorname{ExternParamTypes}(\mathsf{params})\ =\ [T_{i}\ \mid \ \langle \_,\ \_,\ T_{i}\rangle \ \in \ \mathsf{params}] \\
\operatorname{ExternSigOk}(\mathsf{params},\ \mathsf{ret}_{\mathsf{opt}})\ \Leftrightarrow  \\
\ R\ =\ \operatorname{ProcReturn}(\mathsf{ret}_{\mathsf{opt}})\ \land  \\
\ (R\ =\ \operatorname{TypePrim}(\texttt{"()"})\ \lor \ \Gamma \ \vdash \ \operatorname{FfiSafeType}(R)\ \Downarrow \ \mathsf{ok})\ \land  \\
\ (\forall \ T\ \in \ \operatorname{ExternParamTypes}(\mathsf{params}).\ \Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Downarrow \ \mathsf{ok})\ \land  \\
\ (\forall \ T\ \in \ \operatorname{ExternParamTypes}(\mathsf{params}).\ \operatorname{FfiByValueOk}(T))\ \land  \\
\ \operatorname{FfiByValueOk}(R)
\end{array}
```

```math
\operatorname{SparseFuncType}(T)\ \Leftrightarrow \ T\ =\ \operatorname{TypeFunc}(\_,\ \_)
```

**FFI Constraints**

1. Closure types MUST NOT appear in `extern` signatures.
2. Only sparse function pointer types are FFI-safe in `extern` signatures (`SparseFuncType`).
3. Sparse function pointer types in `extern` signatures MUST NOT have generic type parameters.

**Call Safety**

Calls to extern procedures MUST appear within an `unsafe` block.

#### 23.2.5 Dynamic Semantics

```math
\mathsf{Calls}\ \mathsf{to}\ \mathsf{extern}\ \mathsf{procedures}\ \mathsf{transfer}\ \mathsf{control}\ \mathsf{to}\ \mathsf{foreign}\ \mathsf{code}.\ \mathsf{If}\ \texttt{UnwindMode(proc) = "catch"},\ \mathsf{foreign}\ \mathsf{unwinds}\ \mathsf{are}\ \mathsf{converted}\ \mathsf{to}\ \mathsf{Ultraviolet}\ \mathsf{panics}\ \mathsf{at}\ \mathsf{the}\ \mathsf{boundary}\ \mathsf{as}\ \mathsf{defined}\ \mathsf{in}\ \S 23.7.\ \mathsf{If}\ \texttt{UnwindMode(proc) = "abort"},\ \mathsf{any}\ \mathsf{unwind}\ \mathsf{that}\ \mathsf{attempts}\ \mathsf{to}\ \mathsf{cross}\ \mathsf{the}\ \mathsf{boundary}\ \mathsf{aborts}\ \mathsf{as}\ \mathsf{defined}\ \mathsf{in}\ \S 23.7.
```

#### 23.2.6 Lowering

Import-side unwind landing pads are defined in §23.7. This section introduces no additional lowering rules beyond ABI selection and the required unsafe-call boundary.

#### 23.2.7 Diagnostics

| Code         | Severity | Detection    | Condition                                         |
| ------------ | -------- | ------------ | ------------------------------------------------- |
| `E-TYP-2306` | Error    | Compile-time | Generic parameter in `extern` procedure signature |
| `E-TYP-2106` | Error    | Compile-time | Call to `extern` procedure outside `unsafe`       |

Type-admissibility failures in `FfiSafeType` and by-value FFI use are owned by §23.1.7.

### 23.3 Exported Procedures and Hosted Exports

#### 23.3.1 Raw Exported Procedures

```math
A\ \mathsf{procedure}\ \mathsf{becomes}\ a\ \mathsf{raw}\ \mathsf{exported}\ \mathsf{procedure}\ \mathsf{when}\ \mathsf{it}\ \mathsf{carries}\ \texttt{[[export("abi")]]}.\ \mathsf{The}\ \mathsf{attribute}\ \mathsf{syntax}\ \mathsf{is}\ \mathsf{defined}\ \mathsf{in}\ \S 23.4.1.
```

#### 23.3.2 Parsing

Raw exported procedures are parsed by the ordinary procedure-declaration parser from §15.1.2.

```math
\mathsf{An}\ \mathsf{ordinary}\ \texttt{ProcedureDecl}\ \mathsf{is}\ \mathsf{classified}\ \mathsf{as}\ a\ \mathsf{raw}\ \mathsf{exported}\ \mathsf{procedure}\ \mathsf{when}\ \mathsf{its}\ \mathsf{attached}\ \mathsf{attribute}\ \mathsf{list}\ \mathsf{contains}\ \texttt{[[export("abi")]]}\ \mathsf{as}\ \mathsf{parsed}\ \mathsf{by}\ \S 23.4.2.
```

#### 23.3.3 AST Representation / Form

Raw exported procedures are represented by ordinary `ProcedureDecl(...)` items with `ExportAttr(proc)` defined.

This section introduces no dedicated raw-export AST node beyond `ProcedureDecl` plus the attached `export` attribute.

#### 23.3.4 Static Semantics

**Raw Exported Procedure.** A Ultraviolet procedure made callable from foreign code via `[[export]]`.

**Error Indicator Value.**

```math
\begin{array}{l}
\operatorname{ZeroBits}(T)\ =\ [0\mathsf{x00},\ \ldots ,\ 0\mathsf{x00}]\ \mathsf{where}\ \mid \operatorname{ZeroBits}(T)\mid \ =\ \operatorname{sizeof}(T) \\
\operatorname{ZeroValue}(T)\ =\ v\ \Leftrightarrow \ \operatorname{ValueBits}(T,\ v)\ =\ \operatorname{ZeroBits}(T)\ \land \ \forall \ v'.\ (\operatorname{ValueBits}(T,\ v')\ =\ \operatorname{ZeroBits}(T)\ \Rightarrow \ v'\ =\ v) \\
\operatorname{ZeroableType}(T)\ \Leftrightarrow \ \exists \ v.\ \operatorname{ZeroValue}(T)\ =\ v
\end{array}
```

```math
\begin{array}{l}
\mathsf{ExportSigJudg}\ =\ \{\mathsf{ExportSigOk}\} \\
\operatorname{ExportParamTypes}(\mathsf{params})\ =\ [T_{i}\ \mid \ \langle \_,\ \_,\ T_{i}\rangle \ \in \ \mathsf{params}]
\end{array}
```

**(ExportSig-Ok)**

```math
\begin{array}{l}
\mathsf{proc}\ =\ \operatorname{ProcedureDecl}(\_,\ \mathsf{vis},\ \_,\ \_,\ \_,\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \_,\ \_,\ \_,\ \_)\quad \mathsf{vis}\ =\ \texttt{public}\quad \operatorname{ExportAttr}(\mathsf{proc})\ =\ \langle \mathsf{abi},\ \_\rangle \quad \mathsf{abi}\ \in \ \mathsf{ExternAbiSet}\quad \operatorname{AbiProfileOk}(\mathsf{abi},\ \mathsf{SelectedTargetProfile})\quad R\ =\ \operatorname{ProcReturn}(\mathsf{ret}_{\mathsf{opt}})\quad (R\ =\ \operatorname{TypePrim}(\texttt{"()"})\ \lor \ \Gamma \ \vdash \ \operatorname{FfiSafeType}(R)\ \Downarrow \ \mathsf{ok})\quad (\forall \ T\ \in \ \operatorname{ExportParamTypes}(\mathsf{params}).\ \Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Downarrow \ \mathsf{ok})\quad (\forall \ T\ \in \ \operatorname{ExportParamTypes}(\mathsf{params}).\ \operatorname{FfiByValueOk}(T))\quad \operatorname{FfiByValueOk}(R)\quad (\operatorname{UnwindMode}(\mathsf{proc})\ \ne \ \texttt{catch}\ \lor \ \operatorname{ZeroableType}(R)) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ExportSigOk}(\mathsf{proc})\ \Downarrow \ \mathsf{ok}
\end{array}
```

#### 23.3.5 Dynamic Semantics

```math
\mathsf{Execution}\ \mathsf{of}\ \mathsf{the}\ \mathsf{body}\ \mathsf{follows}\ \mathsf{ordinary}\ \mathsf{procedure}\ \mathsf{semantics}.\ \mathsf{Boundary}\ \mathsf{panic}\ \mathsf{handling}\ \mathsf{is}\ \mathsf{defined}\ \mathsf{by}\ \S 23.7.\ \mathsf{When}\ \texttt{UnwindMode(proc) = "catch"},\ \mathsf{the}\ \mathsf{boundary}\ \mathsf{MUST}\ \mathsf{return}\ \texttt{ZeroValue(R)}\ \mathsf{for}\ \mathsf{the}\ \mathsf{raw}\ \mathsf{exported}\ \mathsf{procedure}'s\ \mathsf{return}\ \mathsf{type}\ \texttt{R}.
```

```math
\mathsf{For}\ a\ \mathsf{raw}\ \mathsf{exported}\ \mathsf{procedure}\ \texttt{proc}\ \mathsf{owned}\ \mathsf{by}\ a\ \mathsf{project}\ \texttt{P}\ \mathsf{satisfying}\ \texttt{RawExportLibrary(P)},\ a\ \mathsf{boundary}\ \mathsf{call}\ \mathsf{occurs}\ \mathsf{only}\ \mathsf{through}\ \mathsf{one}\ \mathsf{live}\ \mathsf{loaded}\ \mathsf{library}\ \mathsf{image}\ \texttt{i}\ \mathsf{owned}\ \mathsf{by}\ \texttt{P}.\ \mathsf{Before}\ \mathsf{the}\ \mathsf{first}\ \mathsf{raw}\ \mathsf{export}\ \mathsf{call}\ \mathsf{through}\ a\ \mathsf{newly}\ \mathsf{loaded}\ \mathsf{image},\ \mathsf{the}\ \mathsf{implementation}\ \mathsf{MUST}\ \mathsf{establish}\ \mathsf{that}\ \mathsf{image}\ \mathsf{by}\ \texttt{LibraryImageInitSigma(P, i, sigma)}\ \mathsf{as}\ \mathsf{defined}\ \mathsf{in}\ \S 24.4.4.\ \mathsf{Later}\ \mathsf{raw}\ \mathsf{export}\ \mathsf{calls}\ \mathsf{through}\ \mathsf{the}\ \mathsf{same}\ \mathsf{live}\ \mathsf{image}\ \mathsf{MUST}\ \mathsf{reuse}\ \mathsf{the}\ \mathsf{same}\ \mathsf{image}-\mathsf{owned}\ \mathsf{static}\ \mathsf{state},\ \mathsf{poison}\ \mathsf{flags},\ \mathsf{and}\ \mathsf{boundary}\ \mathsf{panic}\ \mathsf{record}\ \mathsf{until}\ \mathsf{unload}.\ \mathsf{On}\ \mathsf{unload}\ \mathsf{of}\ \mathsf{that}\ \mathsf{live}\ \mathsf{image},\ \mathsf{the}\ \mathsf{implementation}\ \mathsf{MUST}\ \mathsf{execute}\ \texttt{LibraryImageDestroySigma(P, i, sigma)}\ \mathsf{exactly}\ \mathsf{once}.\ \mathsf{User}-\mathsf{procedure}\ \mathsf{execution}\ \mathsf{within}\ \mathsf{that}\ \mathsf{live}\ \mathsf{image}\ \mathsf{is}\ \mathsf{governed}\ \mathsf{by}\ \texttt{RawLibraryCallSigma(P, i, proc, vs, sigma)}\ \mathsf{in}\ \S 24.4.4.
```

```math
\mathsf{For}\ \mathsf{any}\ \mathsf{shared}\ \mathsf{library}\ \mathsf{project}\ \texttt{P},\ \mathsf{an}\ \mathsf{ordinary}\ \mathsf{Ultraviolet}\ \mathsf{call}\ \mathsf{that}\ \mathsf{crosses}\ a\ \mathsf{shared}-\mathsf{library}\ \mathsf{link}\ \mathsf{boundary}\ \mathsf{into}\ \mathsf{one}\ \mathsf{externally}\ \mathsf{linked}\ \mathsf{procedure}\ \mathsf{owned}\ \mathsf{by}\ \texttt{P}\ \mathsf{likewise}\ \mathsf{occurs}\ \mathsf{only}\ \mathsf{through}\ \mathsf{one}\ \mathsf{live}\ \mathsf{loaded}\ \mathsf{library}\ \mathsf{image}\ \texttt{i}\ \mathsf{owned}\ \mathsf{by}\ \texttt{P}.\ \mathsf{Before}\ \mathsf{the}\ \mathsf{first}\ \mathsf{such}\ \mathsf{linked}\ \mathsf{call}\ \mathsf{through}\ a\ \mathsf{newly}\ \mathsf{loaded}\ \mathsf{image},\ \mathsf{the}\ \mathsf{implementation}\ \mathsf{MUST}\ \mathsf{establish}\ \mathsf{that}\ \mathsf{image}\ \mathsf{by}\ \texttt{LibraryImageInitSigma(P, i, sigma)}\ \mathsf{as}\ \mathsf{defined}\ \mathsf{in}\ \S 24.4.4.\ \mathsf{Later}\ \mathsf{linked}\ \mathsf{calls}\ \mathsf{through}\ \mathsf{the}\ \mathsf{same}\ \mathsf{live}\ \mathsf{image}\ \mathsf{MUST}\ \mathsf{reuse}\ \mathsf{the}\ \mathsf{same}\ \mathsf{image}-\mathsf{owned}\ \mathsf{static}\ \mathsf{state},\ \mathsf{poison}\ \mathsf{flags},\ \mathsf{and}\ \mathsf{boundary}\ \mathsf{panic}\ \mathsf{record}\ \mathsf{until}\ \mathsf{unload}.\ \mathsf{On}\ \mathsf{unload}\ \mathsf{of}\ \mathsf{that}\ \mathsf{live}\ \mathsf{image},\ \mathsf{the}\ \mathsf{implementation}\ \mathsf{MUST}\ \mathsf{execute}\ \texttt{LibraryImageDestroySigma(P, i, sigma)}\ \mathsf{exactly}\ \mathsf{once}.\ \mathsf{User}-\mathsf{procedure}\ \mathsf{execution}\ \mathsf{for}\ \mathsf{that}\ \mathsf{linked}\ \mathsf{call}\ \mathsf{continues}\ \mathsf{to}\ \mathsf{follow}\ \mathsf{ordinary}\ \texttt{ApplyProcSigma}\ \mathsf{under}\ \mathsf{the}\ \mathsf{image}-\mathsf{state}\ \mathsf{interpretation}\ \mathsf{defined}\ \mathsf{by}\ \S 24.4.4.
```

#### 23.3.6 Lowering

Export-side unwind frames are defined in §23.7. This section introduces no additional lowering rules beyond export ABI selection and external linkage.

#### 23.3.7 Diagnostics

| Code         | Severity | Detection    | Condition                                        |
| ------------ | -------- | ------------ | ------------------------------------------------ |
| `E-SYS-3353` | Error    | Compile-time | `[[export]]` requires `public` visibility        |
| `E-TYP-2631` | Error    | Compile-time | `[[export]]` catch requires zeroable return type |

Unsupported export-ABI-string rejection is owned by §23.2.7. Type-admissibility failures in `FfiSafeType` and by-value FFI use are owned by §23.1.7.

#### 23.3.8 Hosted Exports

```math
A\ \mathsf{procedure}\ \mathsf{becomes}\ a\ \mathsf{hosted}\ \mathsf{export}\ \mathsf{when}\ \mathsf{it}\ \mathsf{carries}\ \texttt{[[host\_export("abi")]]}.\ A\ \mathsf{hosted}\ \mathsf{export}\ \mathsf{is}\ \mathsf{not}\ a\ \mathsf{raw}\ \mathsf{FFI}\ \mathsf{signature}:\ \mathsf{the}\ \mathsf{foreign}-\mathsf{visible}\ \mathsf{signature}\ \mathsf{is}\ \mathsf{derived}\ \mathsf{from}\ \mathsf{the}\ \mathsf{source}\ \mathsf{procedure}\ \mathsf{plus}\ \mathsf{an}\ \mathsf{opaque}\ \mathsf{hosted}-\mathsf{library}\ \mathsf{session}\ \mathsf{handle}.
```

#### 23.3.9 Parsing

Hosted exports are parsed by the ordinary procedure-declaration parser from §15.1.2.

```math
\mathsf{An}\ \mathsf{ordinary}\ \texttt{ProcedureDecl}\ \mathsf{is}\ \mathsf{classified}\ \mathsf{as}\ a\ \mathsf{hosted}\ \mathsf{export}\ \mathsf{when}\ \mathsf{its}\ \mathsf{attached}\ \mathsf{attribute}\ \mathsf{list}\ \mathsf{contains}\ \texttt{[[host\_export("abi")]]}\ \mathsf{as}\ \mathsf{parsed}\ \mathsf{by}\ \S 23.4.2.
```

#### 23.3.10 AST Representation / Form

Hosted exports are represented by ordinary `ProcedureDecl(...)` items with `HostExportAttr(proc)` defined.

```math
\begin{array}{l}
\operatorname{HostExported}(\mathsf{proc})\ \Leftrightarrow \ \mathsf{proc}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \land \ \operatorname{HostExportAttr}(\mathsf{proc})\ \mathsf{defined} \\
\operatorname{HostContextParam}(\mathsf{proc})\ =\ \langle \mathsf{mode},\ \mathsf{name},\ T_{\mathsf{ctx}}\rangle \ \Leftrightarrow \ \mathsf{proc}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ [\langle \mathsf{mode},\ \mathsf{name},\ T_{\mathsf{ctx}}\rangle ]\ \mathbin{++} \ \_,\ \_,\ \_,\ \_,\ \_,\ \_) \\
\operatorname{HostVisibleParams}(\mathsf{proc})\ =\ \mathsf{params}_{\mathsf{vis}}\ \Leftrightarrow \ \mathsf{proc}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ [\mathsf{ctx}_{\mathsf{param}}]\ \mathbin{++} \ \mathsf{params}_{\mathsf{vis}},\ \_,\ \_,\ \_,\ \_,\ \_) \\
\operatorname{HostVisibleParamTypes}(\mathsf{proc})\ =\ [T_{i}\ \mid \ \langle \_,\ \_,\ T_{i}\rangle \ \in \ \mathsf{params}_{\mathsf{vis}}]\ \Leftrightarrow \ \operatorname{HostVisibleParams}(\mathsf{proc})\ =\ \mathsf{params}_{\mathsf{vis}} \\
\operatorname{HostExports}(P)\ =\ [d\ \mid \ m\ \in \ P.\mathsf{modules},\ d\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items},\ \operatorname{HostExported}(d)] \\
\operatorname{RawExports}(P)\ =\ [d\ \mid \ m\ \in \ P.\mathsf{modules},\ d\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items},\ d\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \land \ \operatorname{ExportAttr}(d)\ \mathsf{defined}] \\
\operatorname{HostedLibrary}(P)\ \Leftrightarrow \ \operatorname{Library}(P)\ \land \ \operatorname{HostExports}(P)\ \ne \ [] \\
\operatorname{MixedForeignExportModes}(P)\ \Leftrightarrow \ \operatorname{HostedLibrary}(P)\ \land \ \operatorname{RawExports}(P)\ \ne \ [] \\
\operatorname{HostedRootCaps}(P)\ =\ \bigcup \{\operatorname{CapInType}(\operatorname{StripPerm}(T_{\mathsf{ctx}}))\ \mid \ d\ \in \ \operatorname{HostExports}(P)\ \land \ \operatorname{HostContextParam}(d)\ =\ \langle \_,\ \_,\ T_{\mathsf{ctx}}\rangle \} \\
\operatorname{HostedContextBundleType}(T)\ \Leftrightarrow \ \operatorname{ContextBundleType}(T)\ \land \ \operatorname{AliasNorm}(T)\ \ne \ \operatorname{TypePath}([\texttt{"Context"}])
\end{array}
```
HostAbiVersion = 1

```math
\begin{array}{l}
\mathsf{HostSessionAbiParam}\ =\ \langle \texttt{move},\ \texttt{\_\_ultraviolet\_session},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle  \\
\operatorname{HostThunkParams}(\mathsf{proc})\ =\ [\mathsf{HostSessionAbiParam}]\ \mathbin{++} \ \mathsf{params}_{\mathsf{vis}}\ \Leftrightarrow \ \operatorname{HostVisibleParams}(\mathsf{proc})\ =\ \mathsf{params}_{\mathsf{vis}} \\
\operatorname{HostThunkForeignParamTypes}(\mathsf{proc})\ =\ [\operatorname{TypePrim}(\texttt{"usize"})]\ \mathbin{++} \ [T_{i}\ \mid \ \langle \_,\ \_,\ T_{i}\rangle \ \in \ \mathsf{params}_{\mathsf{vis}}]\ \Leftrightarrow \ \operatorname{HostVisibleParams}(\mathsf{proc})\ =\ \mathsf{params}_{\mathsf{vis}} \\
\operatorname{HostThunkSig}(\mathsf{proc})\ =\ \langle \operatorname{HostThunkParams}(\mathsf{proc}),\ \operatorname{ProcReturn}(\mathsf{ret}_{\mathsf{opt}})\rangle \ \Leftrightarrow \ \mathsf{proc}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \mathsf{ret}_{\mathsf{opt}},\ \_,\ \_,\ \_,\ \_)
\end{array}
```

`HostedRootCaps(P)` is the maximal capability set that may become visible to Ultraviolet user code through hosted exports of `P`.

#### 23.3.11 Static Semantics

**Hosted Export.** A Ultraviolet procedure made callable from foreign code through a hosted-library session.

**Foreign-visible signature.** For a hosted export `proc`, the foreign-visible signature consists of one leading `usize` session-handle parameter followed by the source parameters after the first source parameter. The first source parameter itself is not part of the foreign-visible ABI.

```math
\mathsf{For}\ \mathsf{each}\ \mathsf{visible}\ \mathsf{source}\ \mathsf{parameter}\ \texttt{<mode\_i, \_, T\_i>},\ \mathsf{the}\ \mathsf{foreign}-\mathsf{visible}\ \mathsf{pass}\ \mathsf{kind}\ \mathsf{MUST}\ \mathsf{be}\ \mathsf{derived}\ \mathsf{by}\ \texttt{ForeignABIParam(T\_i)}\ (\S 24.2.5),\ \mathsf{independent}\ \mathsf{of}\ \mathsf{source}\ \mathsf{parameter}\ \mathsf{mode}.
```

```math
\mathsf{HostExportSigJudg}\ =\ \{\mathsf{HostExportSigOk}\}
```

**(HostExportSig-Ok)**

```math
\begin{array}{l}
\operatorname{Project}(\Gamma )\ =\ P\quad \mathsf{proc}\ =\ \operatorname{ProcedureDecl}(\_,\ \mathsf{vis},\ \_,\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \_,\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \_,\ \_,\ \_,\ \_)\quad \mathsf{vis}\ =\ \texttt{public}\quad \operatorname{HostExportAttr}(\mathsf{proc})\ =\ \langle \mathsf{abi},\ \_\rangle \quad \operatorname{TypeParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\ =\ []\quad \lnot \ \operatorname{MixedForeignExportModes}(P)\quad \operatorname{Library}(P)\quad \mathsf{params}\ =\ [\langle \bot ,\ \_,\ T_{\mathsf{ctx}}\rangle ]\ \mathbin{++} \ \mathsf{params}_{\mathsf{vis}}\quad \operatorname{HostedContextBundleType}(\operatorname{StripPerm}(T_{\mathsf{ctx}}))\quad \mathsf{abi}\ \in \ \mathsf{ExternAbiSet}\quad \operatorname{AbiProfileOk}(\mathsf{abi},\ \mathsf{SelectedTargetProfile})\quad R\ =\ \operatorname{ProcReturn}(\mathsf{ret}_{\mathsf{opt}})\quad (R\ =\ \operatorname{TypePrim}(\texttt{"()"})\ \lor \ \Gamma \ \vdash \ \operatorname{FfiSafeType}(R)\ \Downarrow \ \mathsf{ok})\quad (\forall \ T\ \in \ \operatorname{HostVisibleParamTypes}(\mathsf{proc}).\ \Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Downarrow \ \mathsf{ok})\quad (\forall \ T\ \in \ \operatorname{HostVisibleParamTypes}(\mathsf{proc}).\ \operatorname{CapInType}(T)\ =\ \emptyset )\quad \operatorname{CapInType}(R)\ =\ \emptyset \quad (\forall \ T\ \in \ \operatorname{HostVisibleParamTypes}(\mathsf{proc}).\ \operatorname{FfiByValueOk}(T))\quad \operatorname{FfiByValueOk}(R)\quad (\operatorname{UnwindMode}(\mathsf{proc})\ \ne \ \texttt{catch}\ \lor \ \operatorname{ZeroableType}(R)) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{HostExportSigOk}(\mathsf{proc})\ \Downarrow \ \mathsf{ok}
\end{array}
```

**(HostExport-Library-Err)**

```math
\begin{array}{l}
\operatorname{Project}(\Gamma )\ =\ P\quad \operatorname{HostExported}(\mathsf{proc})\quad \lnot \ \operatorname{Library}(P)\quad c\ =\ \operatorname{Code}(\mathsf{HostExport}-\mathsf{Library}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{HostExportSigOk}(\mathsf{proc})\ \Uparrow \ c
\end{array}
```

**(HostExport-MixedMode-Err)**

```math
\begin{array}{l}
\operatorname{Project}(\Gamma )\ =\ P\quad \operatorname{HostExported}(\mathsf{proc})\quad \operatorname{MixedForeignExportModes}(P)\quad c\ =\ \operatorname{Code}(\mathsf{HostExport}-\mathsf{MixedMode}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{HostExportSigOk}(\mathsf{proc})\ \Uparrow \ c
\end{array}
```

**(HostExport-Generic-Err)**

```math
\begin{array}{l}
\mathsf{proc}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\quad \operatorname{HostExportAttr}(\mathsf{proc})\ =\ \langle \_,\ \_\rangle \quad \operatorname{TypeParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\ \ne \ []\quad c\ =\ \operatorname{Code}(\mathsf{HostExport}-\mathsf{Generic}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{HostExportSigOk}(\mathsf{proc})\ \Uparrow \ c
\end{array}
```

**(HostExport-Context-Err)**

```math
\begin{array}{l}
\mathsf{proc}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \mathsf{params},\ \_,\ \_,\ \_,\ \_,\ \_)\quad \operatorname{HostExportAttr}(\mathsf{proc})\ =\ \langle \_,\ \_\rangle \quad (\mathsf{params}\ =\ []\ \lor \ (\mathsf{params}\ =\ [\langle \mathsf{mode},\ \_,\ T_{\mathsf{ctx}}\rangle ]\ \mathbin{++} \ \_\ \land \ \lnot \ \operatorname{ContextBundleType}(\operatorname{StripPerm}(T_{\mathsf{ctx}}))))\quad c\ =\ \operatorname{Code}(\mathsf{HostExport}-\mathsf{Context}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{HostExportSigOk}(\mathsf{proc})\ \Uparrow \ c
\end{array}
```

**(HostExport-Context-Raw-Err)**

```math
\begin{array}{l}
\mathsf{proc}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ [\langle \mathsf{mode},\ \_,\ T_{\mathsf{ctx}}\rangle ]\ \mathbin{++} \ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\quad \operatorname{HostExportAttr}(\mathsf{proc})\ =\ \langle \_,\ \_\rangle \quad \operatorname{AliasNorm}(\operatorname{StripPerm}(T_{\mathsf{ctx}}))\ =\ \operatorname{TypePath}([\texttt{"Context"}])\quad c\ =\ \operatorname{Code}(\mathsf{HostExport}-\mathsf{Context}-\mathsf{Raw}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{HostExportSigOk}(\mathsf{proc})\ \Uparrow \ c
\end{array}
```

**(HostExport-Context-Move-Err)**

```math
\begin{array}{l}
\mathsf{proc}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ [\langle \texttt{move},\ \_,\ T_{\mathsf{ctx}}\rangle ]\ \mathbin{++} \ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\quad \operatorname{HostExportAttr}(\mathsf{proc})\ =\ \langle \_,\ \_\rangle \quad \operatorname{ContextBundleType}(\operatorname{StripPerm}(T_{\mathsf{ctx}}))\quad c\ =\ \operatorname{Code}(\mathsf{HostExport}-\mathsf{Context}-\mathsf{Move}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{HostExportSigOk}(\mathsf{proc})\ \Uparrow \ c
\end{array}
```

#### 23.3.12 Dynamic Semantics

A hosted export call occurs only with a live, idle hosted-library session `h` owned by the library project `P`. Hosted-export foreign-visible session handles use ABI type `usize`; the value `0` MUST be rejected as invalid.

A conforming implementation MUST ensure that the only capability-bearing value introduced to Ultraviolet user code by the hosted-export boundary is the reconstructed first source argument. Raw `Context` values MUST NOT be exposed directly to hosted-export user code, and the capability roots that become visible across all hosted exports of `P` MUST be a subset of `HostedRootCaps(P)`.

This specification revision defines no foreign-supplied capability adapters or session options. A successful hosted session MUST grant exactly `HostedRootCaps(P)` through runtime-owned standard providers; foreign code does not pass capability values across the hosted-session ABI.

The boundary MUST:

1. validate the foreign-visible session handle;
2. reject any handle that is invalid, not live, or currently busy before any user code executes;
3. recover the session-owned root context carrier for `h`;
4. construct the first source argument `v_ctx` by `ContextBundleBuild(StripPerm(T_ctx), SessionContext(h))`;
5. pass `v_ctx` plus the foreign-visible arguments to the source procedure under ordinary Ultraviolet semantics.

If the supplied handle is invalid, not live, or busy, then the hosted-export boundary MUST:

1. return `ZeroValue(R)` when `UnwindMode(proc) = "catch"`;
2. otherwise terminate the boundary call as `Abort`.

```math
\mathsf{When}\ \texttt{UnwindMode(proc) = "catch"},\ \mathsf{any}\ \mathsf{boundary}\ \mathsf{failure}\ \mathsf{that}\ \mathsf{occurs}\ \mathsf{before}\ \mathsf{or}\ \mathsf{during}\ \mathsf{hosted}-\mathsf{export}\ \mathsf{invocation}\ \mathsf{MUST}\ \mathsf{return}\ \texttt{ZeroValue(R)}\ \mathsf{for}\ \mathsf{the}\ \mathsf{hosted}\ \mathsf{export}'s\ \mathsf{return}\ \mathsf{type}\ \texttt{R}.
```

#### 23.3.13 Lowering

Hosted-export lowering MUST preserve the raw-FFI rules of §§23.1–23.5 for the foreign-visible signature while reconstructing the first source parameter internally.

```math
\mathsf{For}\ a\ \mathsf{hosted}\ \mathsf{export}\ \texttt{proc}\ \mathsf{with}\ \texttt{HostExportAttr(proc) = <abi, \_>}\ \mathsf{and}\ \texttt{HostThunkSig(proc) = <params\_thunk, R>},\ \mathsf{the}\ \mathsf{foreign}-\mathsf{visible}\ \mathsf{thunk}\ \mathsf{ABI}\ \mathsf{is}\ \mathsf{determined}\ \mathsf{exactly}\ \mathsf{as}\ \mathsf{follows}:
```

1. `Γ ⊢ ForeignABICall(HostThunkForeignParamTypes(proc), R) ⇓ ⟨[k_1, …, k_n], k_r, sretSigma⟩` determines the complete foreign by-value/by-reference parameter classification and indirect-return decision.
2. `ConventionLayout(SelectedTargetProfile, AbiToConvention(abi))` determines the calling-convention layout used by the thunk.
3. `AssignParamRegs(HostThunkForeignParamTypes(proc), AbiToConvention(abi))` determines the thunk's parameter register assignment and stack-slot assignment.
4. The thunk's return-register assignment, indirect-return slot placement, and stack layout MUST be exactly those implied by the same `ForeignABICall`, `ConventionLayout`, and `AssignParamRegs` results for a raw exported procedure whose source signature is `params_thunk -> R`.

```math
\begin{array}{l}
\mathsf{HostThunkParamCarrierJudg}\ =\ \{\mathsf{HostThunkParamCarrier}\} \\
\mathsf{HostThunkRetCarrierJudg}\ =\ \{\mathsf{HostThunkRetCarrier}\} \\
\operatorname{HostThunkParamShape}(\mathsf{proc})\ =\ [\langle k_{i},\ c_{i},\ \tau_{i} \rangle ]\ \Leftrightarrow  \\
\ \operatorname{HostThunkForeignParamTypes}(\mathsf{proc})\ =\ [T_{i}]\ \land  \\
\ \operatorname{HostThunkSig}(\mathsf{proc})\ =\ \langle \_,\ R\rangle \ \land  \\
\ \Gamma \ \vdash \ \operatorname{ForeignABICall}([T_{i}],\ R)\ \Downarrow \ \langle [k_{i}],\ k_{r},\ \mathsf{sretSigma}_{\mathsf{base}}\rangle \ \land  \\
\ \forall \ i.\ \Gamma \ \vdash \ \operatorname{HostThunkParamCarrier}(\mathsf{SelectedTargetProfile},\ k_{i},\ T_{i})\ \Downarrow \ \langle c_{i},\ \tau_{i} \rangle  \\
\operatorname{HostThunkRetShape}(\mathsf{proc})\ =\ \langle k_{r},\ c_{r},\ \tau_{r} ,\ \mathsf{sretSigma}\rangle \ \Leftrightarrow  \\
\ \operatorname{HostThunkSig}(\mathsf{proc})\ =\ \langle \_,\ R\rangle \ \land  \\
\ \Gamma \ \vdash \ \operatorname{ForeignABICall}(\operatorname{HostThunkForeignParamTypes}(\mathsf{proc}),\ R)\ \Downarrow \ \langle [k_{i}],\ k_{r},\ \mathsf{sretSigma}_{\mathsf{base}}\rangle \ \land  \\
\ \Gamma \ \vdash \ \operatorname{HostThunkRetCarrier}(\mathsf{SelectedTargetProfile},\ k_{r},\ R,\ \mathsf{sretSigma}_{\mathsf{base}})\ \Downarrow \ \langle c_{r},\ \tau_{r} ,\ \mathsf{sretSigma}\rangle  \\
\operatorname{IntLane}(1)\ =\ \texttt{i8} \\
\operatorname{IntLane}(2)\ =\ \texttt{i16} \\
\operatorname{IntLane}(4)\ =\ \texttt{i32} \\
\operatorname{IntLane}(8)\ =\ \texttt{i64} \\
\operatorname{AggLLVM}(T)\ \Leftrightarrow \ \exists \ \tau .\ \Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau \ \land \ (\tau \ \mathsf{is}\ \texttt{struct}\ \lor \ \tau \ \mathsf{is}\ \texttt{array})
\end{array}
```

**(HostThunkParamCarrier-ByRef)**
k = `ByRef`

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{HostThunkParamCarrier}(\mathsf{profile},\ k,\ T)\ \Downarrow \ \langle \texttt{Direct},\ \operatorname{LLVMPtrTy}(\operatorname{TypePtr}(\operatorname{TypePerm}(\texttt{const},\ T),\ \texttt{Valid}))\rangle 
\end{array}
```

**(HostThunkParamCarrier-ByValue-Default)**

```math
\begin{array}{l}
k\ =\ \texttt{ByValue}\quad \lnot (\mathsf{profile}\ =\ \texttt{x86\_64-win64}\ \land \ \operatorname{AggLLVM}(T))\quad \Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{HostThunkParamCarrier}(\mathsf{profile},\ k,\ T)\ \Downarrow \ \langle \texttt{Direct},\ \tau \rangle 
\end{array}
```

**(HostThunkParamCarrier-Win64-DirectAgg)**

```math
\begin{array}{l}
\mathsf{profile}\ =\ \texttt{x86\_64-win64}\quad k\ =\ \texttt{ByValue}\quad \operatorname{AggLLVM}(T)\quad \Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ n\quad n\ \in \ \{1,\ 2,\ 4,\ 8\} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{HostThunkParamCarrier}(\mathsf{profile},\ k,\ T)\ \Downarrow \ \langle \texttt{Direct},\ \operatorname{IntLane}(n)\rangle 
\end{array}
```

**(HostThunkParamCarrier-Win64-IndirectAgg)**

```math
\begin{array}{l}
\mathsf{profile}\ =\ \texttt{x86\_64-win64}\quad k\ =\ \texttt{ByValue}\quad \operatorname{AggLLVM}(T)\quad \Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ n\quad n\ >\ 0\quad n\ \notin \ \{1,\ 2,\ 4,\ 8\} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{HostThunkParamCarrier}(\mathsf{profile},\ k,\ T)\ \Downarrow \ \langle \texttt{Indirect},\ \operatorname{LLVMPtrTy}(\operatorname{TypePtr}(\operatorname{TypePerm}(\texttt{const},\ T),\ \texttt{Valid}))\rangle 
\end{array}
```

**(HostThunkRetCarrier-Default)**

```math
\begin{array}{l}
\mathsf{profile}\ \ne \ \texttt{x86\_64-win64}\ \lor \ \lnot (k_{r}\ =\ \texttt{ByValue}\ \land \ \operatorname{AggLLVM}(R))\quad \Gamma \ \vdash \ \operatorname{LLVMRetLower}(R,\ k_{r})\ \Downarrow \ \tau_{r}  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{HostThunkRetCarrier}(\mathsf{profile},\ k_{r},\ R,\ \mathsf{sretSigma}_{\mathsf{base}})\ \Downarrow \ \langle \texttt{Direct},\ \tau_{r} ,\ \mathsf{sretSigma}_{\mathsf{base}}\rangle 
\end{array}
```

**(HostThunkRetCarrier-Win64-DirectAgg)**

```math
\begin{array}{l}
\mathsf{profile}\ =\ \texttt{x86\_64-win64}\quad k_{r}\ =\ \texttt{ByValue}\quad \operatorname{AggLLVM}(R)\quad \Gamma \ \vdash \ \operatorname{sizeof}(R)\ =\ n\quad n\ \in \ \{1,\ 2,\ 4,\ 8\} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{HostThunkRetCarrier}(\mathsf{profile},\ k_{r},\ R,\ \mathsf{sretSigma}_{\mathsf{base}})\ \Downarrow \ \langle \texttt{Direct},\ \operatorname{IntLane}(n),\ \mathsf{false}\rangle 
\end{array}
```

**(HostThunkRetCarrier-Win64-SRetAgg)**

```math
\begin{array}{l}
\mathsf{profile}\ =\ \texttt{x86\_64-win64}\quad k_{r}\ =\ \texttt{ByValue}\quad \operatorname{AggLLVM}(R)\quad \Gamma \ \vdash \ \operatorname{sizeof}(R)\ =\ n\quad n\ >\ 0\quad n\ \notin \ \{1,\ 2,\ 4,\ 8\} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{HostThunkRetCarrier}(\mathsf{profile},\ k_{r},\ R,\ \mathsf{sretSigma}_{\mathsf{base}})\ \Downarrow \ \langle \texttt{Indirect},\ \texttt{void},\ \mathsf{true}\rangle 
\end{array}
```

For hosted-export thunk lowering, a conforming implementation MUST use `HostThunkParamShape(proc)` and `HostThunkRetShape(proc)` as the foreign ABI shape.

```math
\mathsf{For}\ \texttt{SelectedTargetProfile = x86\_64-win64},\ a\ \mathsf{conforming}\ \mathsf{implementation}\ \mathsf{MUST}\ \mathsf{NOT}\ \mathsf{split}\ \mathsf{one}\ \mathsf{by}-\mathsf{value}\ \mathsf{aggregate}\ \mathsf{source}\ \mathsf{parameter}\ \mathsf{of}\ a\ \mathsf{hosted}\ \mathsf{export}\ \mathsf{into}\ \mathsf{multiple}\ \mathsf{scalar}\ \mathsf{ABI}\ \mathsf{parameters}\ \mathsf{at}\ \mathsf{the}\ \mathsf{foreign}-\mathsf{visible}\ \mathsf{thunk}\ \mathsf{boundary}.
```

No hosted-export-specific ABI rewriting beyond prepending `HostSessionAbiParam` and omitting the first source parameter is permitted.

Hosted thunk foreign parameter classification MUST be mode-independent. Pointer-typed visible parameters therefore use canonical C-style pointer carriers at the foreign boundary.

```math
\mathsf{When}\ \texttt{ForeignABIParam(T\_i) != ABIParam(mode\_i, T\_i)},\ \mathsf{thunk}-\mathsf{to}-\mathsf{source}\ \mathsf{call}\ \mathsf{reconstruction}\ \mathsf{MUST}\ \mathsf{preserve}\ \mathsf{source}\ \mathsf{semantics}\ \mathsf{by}\ \mathsf{materializing}\ \mathsf{one}\ \mathsf{temporary}\ \mathsf{storage}\ \mathsf{cell}\ \mathsf{of}\ \mathsf{type}\ \texttt{T\_i},\ \mathsf{storing}\ \mathsf{the}\ \mathsf{incoming}\ \mathsf{foreign}\ \mathsf{value}\ \mathsf{into}\ \mathsf{that}\ \mathsf{cell},\ \mathsf{and}\ \mathsf{passing}\ \mathsf{that}\ \mathsf{temporary}\ \mathsf{according}\ \mathsf{to}\ \texttt{ABIParam(mode\_i, T\_i)}\ \mathsf{to}\ \mathsf{the}\ \mathsf{source}\ \mathsf{procedure}\ \mathsf{body}.
```

```math
\mathsf{For}\ \mathsf{hosted}-\mathsf{library}\ \mathsf{thunk}\ \mathsf{and}\ \mathsf{body}\ \mathsf{emission},\ \mathsf{loads}\ \mathsf{and}\ \mathsf{stores}\ \mathsf{of}\ \texttt{HostedStateSym(Project(Gamma), sym)}\ \mathsf{MUST}\ \mathsf{resolve}\ \mathsf{by}\ \mathsf{full}\ \mathsf{symbol}\ \mathsf{identity}\ \texttt{sym}\ (\mathsf{including}\ \mathsf{cross}-\mathsf{module}\ \mathsf{references})\ \mathsf{and}\ \mathsf{session}\ \mathsf{context},\ \mathsf{not}\ \mathsf{by}\ \mathsf{module}-\mathsf{local}\ \mathsf{global}-\mathsf{declaration}\ \mathsf{presence}.\ \mathsf{When}\ \texttt{HostedStateSym(Project(Gamma), sym)}\ \mathsf{holds},\ a\ \mathsf{conforming}\ \mathsf{implementation}\ \mathsf{MUST}\ \mathsf{NOT}\ \mathsf{substitute}\ \texttt{ZeroValue}\ \mathsf{or}\ \mathsf{any}\ \mathsf{other}\ \mathsf{default}\ \mathsf{value}\ \mathsf{in}\ \mathsf{place}\ \mathsf{of}\ a\ \mathsf{failed}\ \mathsf{symbol}\ \mathsf{materialization}.
```

For every hosted library, a conforming implementation MUST emit foreign-callable lifecycle exports with the following names and ABIs:

1. `__ultraviolet_host_abi_version : () -> u32`, which MUST return `HostAbiVersion`.
2. `__ultraviolet_host_session_create : () -> usize`, which MUST return `0` iff it cannot establish a live hosted session by `HostSessionInitSigma`, MUST leave no live hosted session reachable from foreign code on that failure path, MUST reclaim any partially initialized session state for that failed attempt, and MUST otherwise return one nonzero hosted-session handle token.
3. `__ultraviolet_host_session_destroy : (usize) -> u32`, which MUST return `1` iff it destroys one live idle hosted session by `HostSessionDestroySigma`, MUST return `0` for invalid, non-live, or busy handles, and MUST NOT return any value other than `0` or `1`.

These lifecycle exports are backend-generated boundary declarations. They are not user-declared `ProcedureDecl` items. A conforming backend MUST emit them exactly once in the linked image of each hosted library.

These lifecycle exports MUST NOT propagate `Panic` across the foreign boundary. If hosted-session destruction accepts a live idle handle but user deinitialization panics or session teardown otherwise cannot complete `HostSessionDestroySigma`, `__ultraviolet_host_session_destroy` MUST return `0`, MUST retire the handle so it is no longer live and cannot be reused, and MUST reclaim any remaining session-private runtime state that is not already consumed by the deinitialization steps that completed before the failure.
A hosted-session handle token that has been returned nonzero by `__ultraviolet_host_session_create` MUST NOT be reissued again later in the same process lifetime.

For every hosted export `proc`, a conforming implementation MUST emit one foreign-callable thunk whose link name is selected by `LinkName` and whose foreign-visible ABI:

1. prepends one `usize` session-handle parameter;
2. omits the first source parameter from the foreign-visible ABI;
3. reconstructs the first source parameter from the session-owned `Context` value before entering the user procedure;
4. rejects invalid, non-live, and busy handles according to §23.3.12 before any user code executes;
5. applies the same `[[unwind]]` boundary rules as a raw exported procedure with the derived foreign-visible signature.

```math
\mathsf{These}\ \mathsf{hosted}-\mathsf{export}\ \mathsf{thunks}\ \mathsf{are}\ \mathsf{backend}-\mathsf{generated}\ \mathsf{boundary}\ \mathsf{declarations}.\ \mathsf{They}\ \mathsf{are}\ \mathsf{not}\ \mathsf{the}\ \mathsf{same}\ \mathsf{declarations}\ \mathsf{as}\ \mathsf{the}\ \mathsf{user}-\mathsf{authored}\ \mathsf{source}\ \mathsf{procedures}.\ A\ \mathsf{conforming}\ \mathsf{backend}\ \mathsf{MUST}\ \mathsf{emit}\ \mathsf{exactly}\ \mathsf{one}\ \mathsf{hosted}-\mathsf{export}\ \mathsf{thunk}\ \mathsf{per}\ \texttt{proc in HostExports(P)}\ \mathsf{in}\ \mathsf{the}\ \mathsf{linked}\ \mathsf{image}\ \mathsf{of}\ \texttt{P},\ \mathsf{and}\ \mathsf{that}\ \mathsf{thunk}\ \mathsf{MUST}\ \mathsf{use}\ \texttt{HostThunkLinkName(proc)}\ \mathsf{as}\ \mathsf{its}\ \mathsf{foreign}\ \mathsf{symbol}\ \mathsf{while}\ \mathsf{calls}\ \mathsf{from}\ \mathsf{Ultraviolet}\ \mathsf{code}\ \mathsf{continue}\ \mathsf{to}\ \mathsf{target}\ \mathsf{the}\ \mathsf{source}\ \mathsf{procedure}\ \mathsf{body}\ \mathsf{symbol}\ \texttt{Mangle(proc)}.\ A\ \mathsf{conforming}\ \mathsf{implementation}\ \mathsf{MUST}\ \mathsf{NOT}\ \mathsf{expose}\ \texttt{Mangle(proc)}\ \mathsf{itself}\ \mathsf{as}\ \mathsf{the}\ \mathsf{hosted}\ \mathsf{foreign}\ \mathsf{entrypoint}\ \mathsf{for}\ \texttt{proc};\ \mathsf{foreign}\ \mathsf{code}\ \mathsf{enters}\ \mathsf{only}\ \mathsf{through}\ \mathsf{the}\ \mathsf{generated}\ \mathsf{thunk}.
```

#### 23.3.14 Diagnostics

| Code         | Severity | Detection    | Condition                                                                            |
| ------------ | -------- | ------------ | ------------------------------------------------------------------------------------ |
| `E-TYP-2632` | Error    | Compile-time | `[[host_export]]` requires a leading `Context` bundle parameter                      |
| `E-TYP-2633` | Error    | Compile-time | `[[host_export]]` leading `Context` bundle parameter MUST NOT use `move`             |
| `E-TYP-2634` | Error    | Compile-time | Generic `[[host_export]]` procedure                                                  |
| `E-TYP-2635` | Error    | Compile-time | `[[host_export]]` catch requires zeroable return type                                |
| `E-TYP-2636` | Error    | Compile-time | `[[host_export]]` MUST use an explicit projected `Context` bundle, not raw `Context` |

Type-admissibility failures in `FfiSafeType` and by-value FFI use for hosted-export visible parameters and returns are owned by §23.1.7.

### 23.4 FFI Attributes

#### 23.4.1 Syntax

```text
mangle_attribute            ::= "[[" "mangle" "(" mangle_mode ")" "]]"
mangle_mode                 ::= "none" | string_literal

library_attribute           ::= "[[" "library" "(" library_args ")" "]]"
library_args                ::= "name" ":" string_literal ("," "kind" ":" string_literal)?

unwind_attribute            ::= "[[" "unwind" "(" unwind_mode ")" "]]"
unwind_mode                 ::= string_literal

export_attribute            ::= "[[" "export" "(" string_literal ")" "]]"
host_export_attribute       ::= "[[" "host_export" "(" string_literal ")" "]]"

ffi_pass_by_value_attribute ::= "[[" "ffi_pass_by_value" "]]"
```

#### 23.4.2 Parsing

FFI attributes are parsed by the general attribute parser in Chapter 5. Argument classification and target checking are defined by Chapter 9 and the attribute-specific constraints below.

#### 23.4.3 AST Representation / Form

FFI attributes are ordinary attribute-list entries attached to their owning declarations.

| Attribute           | Target Kinds     |
| :------------------ | :--------------- |
| `mangle`            | `Procedure`      |
| `library`           | `ExternBlock`    |
| `unwind`            | `Procedure`      |
| `export`            | `Procedure`      |
| `host_export`       | `Procedure`      |
| `ffi_pass_by_value` | `Record`, `Enum` |

#### 23.4.4 Static Semantics

##### 23.4.4.1 `[[mangle]]`

1. Valid only on extern procedure declarations, raw exported procedures, and hosted exports.
2. `[[mangle(none)]]` sets link name to the declaration identifier (unmangled).
3. `[[mangle("name")]]` sets link name to the exact string.
4. String mode MUST be non-empty and valid for the target linker.
5. On non-FFI procedures, `[[mangle(...)]]` is ill-formed.

##### 23.4.4.2 `[[library]]`

**Link Kinds**

| Kind          | Meaning                   |
| :------------ | :------------------------ |
| `"dylib"`     | Dynamic library (default) |
| `"static"`    | Static library            |
| `"framework"` | macOS framework           |
| `"raw-dylib"` | Windows named DLL import  |

1. Valid only on `extern` blocks.
2. The `name` argument specifies the library name without platform prefix or suffix.
3. If `kind` is omitted, `"dylib"` is assumed.
4. This attribute governs foreign-library resolution only. It is independent of the manifest key `assembly.link_kind` defined in §3.2.
5. Library resolution is:

```text
ResolveLibraryName(`dylib`, name, `x86_64-sysv`) = "lib" ++ name ++ ".so"
ResolveLibraryName(`dylib`, name, `aarch64-aapcs64`) = "lib" ++ name ++ ".so"
ResolveLibraryName(`dylib`, name, `x86_64-win64`) = name ++ ".dll"

ResolveLibraryName(`static`, name, `x86_64-sysv`) = "lib" ++ name ++ ".a"
ResolveLibraryName(`static`, name, `aarch64-aapcs64`) = "lib" ++ name ++ ".a"
ResolveLibraryName(`static`, name, `x86_64-win64`) = name ++ ".lib"

ResolveLibraryName(`raw-dylib`, name, `x86_64-win64`) = name ++ ".dll"

LibraryKindSupported(`framework`, profile) ⇔ false
LibraryKindSupported(`raw-dylib`, profile) ⇔ profile = `x86_64-win64`
LibraryKindSupported(kind, profile) ⇔ kind ∈ {`dylib`, `static`}
```

If `LibraryKindSupported(kind, SelectedTargetProfile)` does not hold, the declaration is ill-formed.

For `raw-dylib` imports, the implementation MUST resolve the named Windows DLL
and foreign symbol using the resolved DLL name and declared foreign symbol
name. Resolution strategy is implementation-defined and MAY be lazy; an
implementation is not required to use PE `/DELAYLOAD`.

##### 23.4.4.3 `[[unwind]]`

**Modes**

| Mode      | Behavior                                                                                                |
| :-------- | :------------------------------------------------------------------------------------------------------ |
| `"abort"` | Any panic or foreign unwind that would cross the boundary aborts.                                       |
| `"catch"` | Unwinding is caught at the boundary. Imported procedures convert foreign unwinds to Ultraviolet panics. |

If `[[unwind]]` is not specified, `"abort"` is assumed.

`[[unwind]]` is valid only on extern procedure declarations, raw exported procedures, and hosted exports.

**Catch ABI Requirement.**

```math
\mathsf{If}\ \texttt{UnwindMode(proc) = "catch"},\ \mathsf{the}\ \mathsf{ABI}\ \mathsf{at}\ \mathsf{the}\ \mathsf{boundary}\ \mathsf{MUST}\ \mathsf{be}\ \texttt{"C-unwind"}:
```
1. For extern procedures: `ExternAbiName(ExternAbiOf(proc)) = "C-unwind"`.
2. For raw exported procedures: `ExportAttr(proc) = ⟨"C-unwind", _⟩`.
3. For hosted exports: `HostExportAttr(proc) = ⟨"C-unwind", _⟩`.

##### 23.4.4.4 `[[export]]`

1. Valid only on procedure declarations.
2. The procedure MUST be `public`.
3. The ABI string selects the foreign calling convention (see §23.2.4).
4. `[[export]]` implies external linkage.
5. Link name selection is defined by `LinkName` (§24.3) and `[[mangle(...)]]`.
6. Raw export signatures MUST satisfy the FFI safety requirements in §§23.3 and 23.5.

##### 23.4.4.5 `[[host_export]]`

1. Valid only on procedure declarations.
2. The procedure MUST be `public`.
3. The owning assembly MUST be a library assembly.
4. `[[host_export]]` implies external linkage through the hosted-export thunk defined in §23.3.13. The source procedure body continues to use ordinary visibility-based linkage for Ultraviolet calls; `[[host_export]]` alone does not make the source procedure body symbol the foreign entrypoint.
5. The ABI string selects the foreign calling convention (see §23.2.4).
6. Link name selection is defined by `LinkName` (§24.3) and `[[mangle(...)]]`.
7. Hosted-export signatures MUST satisfy the hosted-export rules of §§23.3 and 23.5.
8. `[[host_export]]` and `[[export]]` MUST NOT appear in the same assembly.

##### 23.4.4.6 `[[ffi_pass_by_value]]`

This attribute marks a `record` or `enum` that satisfies both `DropType` and `FfiSafeType` as eligible for by-value passing across the FFI boundary. If a `DropType` + `FfiSafeType` type is passed by value in any FFI signature without this attribute, the program is ill-formed (§23.1.4).

**FFI Attribute Constraints**

1. `[[mangle]]` is valid only on extern procedure declarations, raw exported procedures, or hosted exports.
2. Duplicate symbol names within a compilation unit are ill-formed and MUST be diagnosed at compile-time or link-time.
3. `[[library]]` is valid only on `extern` blocks.
4. Unknown library kinds are ill-formed.
5. `[[mangle(none)]]` on a non-FFI procedure is ill-formed.
6. `[[mangle(none)]]` with `[[export("C")]]` is redundant and SHOULD emit a warning.
7. `[[unwind]]` on a non-FFI procedure is ill-formed.
8. `[[unwind("abort")]]` is redundant and SHOULD emit a warning.
9. `[[host_export]]` requires `assembly.kind = "library"`.
10. `[[host_export]]` and `[[export]]` MUST NOT be mixed in the same assembly.

#### 23.4.5 Dynamic Semantics

FFI attributes do not directly evaluate to runtime values. `[[unwind]]` selects the boundary behavior defined by §23.7. `[[mangle]]`, `[[library]]`, `[[export]]`, `[[host_export]]`, and `[[ffi_pass_by_value]]` have no direct runtime semantics apart from their effects on linkage, signature admissibility, hosted-session lowering, and boundary behavior.

#### 23.4.6 Lowering

`[[mangle]]` selects link names. `[[library]]` contributes library-resolution metadata for extern blocks. `[[export]]` implies external linkage at the raw FFI boundary. `[[host_export]]` selects hosted-library thunk emission and the hosted-session lifecycle exports required by §23.3.13. `[[unwind]]` selects the boundary frame strategy in §23.7. `[[ffi_pass_by_value]]` authorizes by-value ABI lowering for eligible `DropType` + `FfiSafeType` records and enums.

#### 23.4.7 Diagnostics

| Code         | Severity | Detection                 | Condition                                                |
| ------------ | -------- | ------------------------- | -------------------------------------------------------- |
| `E-SYS-3340` | Error    | Compile-time              | `[[mangle(...)]]` on non-FFI procedure                   |
| `E-SYS-3341` | Error    | Compile-time              | Invalid `[[mangle(mode)]]` argument                      |
| `E-SYS-3342` | Error    | Compile-time or Link-time | Duplicate symbol name in compilation unit                |
| `E-SYS-3345` | Error    | Compile-time              | `[[library]]` outside `extern` block                     |
| `E-SYS-3346` | Error    | Compile-time              | Unknown or unsupported library kind                      |
| `E-SYS-3347` | Error    | Link-time                 | Library not found                                        |
| `E-SYS-3350` | Error    | Compile-time              | `[[mangle(none)]]` on non-exportable procedure           |
| `E-SYS-3351` | Error    | Compile-time              | Conflicting explicit mangling directives                 |
| `E-SYS-3355` | Error    | Compile-time              | Unknown unwind mode                                      |
| `E-SYS-3356` | Error    | Compile-time              | `[[unwind]]` on non-FFI procedure                        |
| `E-SYS-3357` | Error    | Compile-time              | `[[host_export]]` requires `assembly.kind = "library"`   |
| `E-SYS-3358` | Error    | Compile-time              | `[[host_export]]` and `[[export]]` mixed in one assembly |
| `E-FFI-0350` | Error    | Compile-time              | Multiple `[[unwind]]` attributes                         |
| `W-SYS-3350` | Warning  | Compile-time              | `[[mangle(none)]]` with `[[export("C")]]` (redundant)    |
| `W-SYS-3355` | Warning  | Compile-time              | `[[unwind("abort")]]` (redundant)                        |

### 23.5 Capability Isolation

#### 23.5.1 Syntax

This section introduces no additional concrete syntax.

#### 23.5.2 Parsing

This section introduces no additional parsing rules.

#### 23.5.3 AST Representation / Form

Capability-isolation checks range over existing FFI signature types and declaration forms; this section introduces no dedicated AST node.

#### 23.5.4 Static Semantics

**Capability Isolation.** Foreign code MUST NOT receive or return capability-bearing values.

1. Any raw FFI signature or hosted-export visible signature containing `Context`, a capability class, or a dynamic class object is ill-formed.
2. A raw pointer derived from region-local storage MUST NOT cross an FFI boundary.

```text
RegionLocalProv(π) ⇔ ∃ tag. π = π_Region(tag)
RawPtrType(T) ⇔ T = TypeRawPtr(_, _)
FFICall(Call(callee, args)) ⇔ CalleeProc(callee) = proc ∧ FFIBoundary(proc)
```

**(FFI-Arg-RegionLocalRawPtr-Err)**
```text
FFICall(Call(callee, args))    ∃ ⟨_, arg, _⟩ ∈ args. Γ; Ω ⊢ arg ⇓ π ∧ RegionLocalProv(π) ∧ RawPtrType(ExprType(arg))
──────────────────
Γ; Ω ⊢ Call(callee, args) ⇑
```

**(FFI-Return-RegionLocalRawPtr-Err)**
```text
CurrentProcedure(Γ) = proc    (ExportAttr(proc) defined ∨ HostExportAttr(proc) defined)    Γ; Ω ⊢ e ⇓ π    RegionLocalProv(π)    RawPtrType(ExprType(e))
──────────────────
Γ; Ω ⊢ ReturnStmt(e) ⇑
```

#### 23.5.5 Dynamic Semantics

This section introduces no additional runtime mechanism. Ill-formed raw FFI signatures and ill-formed hosted-export visible signatures that would transport capability-bearing values are rejected statically.

#### 23.5.6 Lowering

This section introduces no additional lowering rules beyond the signature-admissibility checks defined by §§23.1–23.4.

#### 23.5.7 Diagnostics

| Code         | Severity | Detection    | Condition                                        |
| ------------ | -------- | ------------ | ------------------------------------------------ |
| `E-SYS-3360` | Error    | Compile-time | Region-local raw pointer crosses an FFI boundary |

Capability-bearing-type violations other than region-local raw-pointer escape are diagnosed by the signature and type-admissibility checks owned by §23.1.7.

### 23.6 Foreign Contracts

#### 23.6.1 Syntax

```text
ffi_verification_attr    ::= "[[" ffi_verification_mode "]]"
ffi_verification_mode    ::= "static" | "dynamic"

foreign_contract         ::= "|:" "@foreign_assumes" "(" predicate_expr ")"
                           | "|:" "@foreign_ensures" "(" ensures_predicate ")"
foreign_contract_clause_list ::= foreign_contract+
ensures_predicate        ::= predicate_expr
                           | "@error" ":" predicate_expr
                           | "@null_result" ":" predicate_expr
```

#### 23.6.2 Parsing

```math
\operatorname{ForeignContractStart}(P)\ \Leftrightarrow \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|:"})\ \land \ \operatorname{IsOp}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"@"})\ \land \ \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))))\ \land \ \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))))\ \in \ \{\texttt{foreign\_assumes},\ \texttt{foreign\_ensures}\}
```

**(Parse-ForeignContractClauseListOpt-None)**

```math
\begin{array}{l}
\lnot \ \operatorname{ForeignContractStart}(P) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseForeignContractClauseListOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
```

**(Parse-ForeignContractClauseListOpt-Yes)**

```math
\begin{array}{l}
\operatorname{ForeignContractStart}(P)\quad \Gamma \ \vdash \ \operatorname{ParseForeignContractClauseList}(P)\ \Downarrow \ (P_{1},\ \mathsf{clauses}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseForeignContractClauseListOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{clauses})
\end{array}
```

**(Parse-ForeignContractClauseList-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseForeignContractClause}(P)\ \Downarrow \ (P_{1},\ \mathsf{clause})\quad \Gamma \ \vdash \ \operatorname{ParseForeignContractClauseListTail}(P_{1},\ [\mathsf{clause}])\ \Downarrow \ (P_{2},\ \mathsf{clauses}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseForeignContractClauseList}(P)\ \Downarrow \ (P_{2},\ \mathsf{clauses})
\end{array}
```

**(Parse-ForeignContractClauseListTail-End)**

```math
\begin{array}{l}
\lnot \ \operatorname{ForeignContractStart}(P) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseForeignContractClauseListTail}(P,\ \mathsf{xs})\ \Downarrow \ (P,\ \mathsf{xs})
\end{array}
```

**(Parse-ForeignContractClauseListTail-Cons)**

```math
\begin{array}{l}
\operatorname{ForeignContractStart}(P)\quad \Gamma \ \vdash \ \operatorname{ParseForeignContractClause}(P)\ \Downarrow \ (P_{1},\ \mathsf{clause})\quad \Gamma \ \vdash \ \operatorname{ParseForeignContractClauseListTail}(P_{1},\ \mathsf{xs}\ \mathbin{++} \ [\mathsf{clause}])\ \Downarrow \ (P_{2},\ \mathsf{ys}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseForeignContractClauseListTail}(P,\ \mathsf{xs})\ \Downarrow \ (P_{2},\ \mathsf{ys})
\end{array}
```

**(Parse-ForeignContractClause-Assumes)**

```math
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|:"})\quad \operatorname{IsOp}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"@"})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))))\quad \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))))\ =\ \texttt{foreign\_assumes}\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P)))),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParsePredicateExpr}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P)))))\ \Downarrow \ (P_{1},\ \mathsf{pred})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{")"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseForeignContractClause}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{ForeignContractClause}(\mathsf{ForeignAssumes},\ [\mathsf{pred}]))
\end{array}
```

**(Parse-ForeignContractClause-Ensures)**

```math
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|:"})\quad \operatorname{IsOp}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"@"})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))))\quad \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))))\ =\ \texttt{foreign\_ensures}\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P)))),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseEnsuresPredicate}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P)))))\ \Downarrow \ (P_{1},\ \mathsf{epred})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{")"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseForeignContractClause}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{ForeignContractClause}(\operatorname{ForeignEnsuresKind}(\mathsf{epred}),\ [\operatorname{ForeignEnsuresExpr}(\mathsf{epred})]))
\end{array}
```

```math
\begin{array}{l}
\operatorname{ForeignEnsuresKind}(\operatorname{Ensures}(\mathsf{pred}))\ =\ \mathsf{ForeignEnsures} \\
\operatorname{ForeignEnsuresKind}(\operatorname{EnsuresError}(\mathsf{pred}))\ =\ \mathsf{ForeignEnsuresError} \\
\operatorname{ForeignEnsuresKind}(\operatorname{EnsuresNullResult}(\mathsf{pred}))\ =\ \mathsf{ForeignEnsuresNullResult}
\end{array}
```

```math
\begin{array}{l}
\operatorname{ForeignEnsuresExpr}(\operatorname{Ensures}(\mathsf{pred}))\ =\ \mathsf{pred} \\
\operatorname{ForeignEnsuresExpr}(\operatorname{EnsuresError}(\mathsf{pred}))\ =\ \mathsf{pred} \\
\operatorname{ForeignEnsuresExpr}(\operatorname{EnsuresNullResult}(\mathsf{pred}))\ =\ \mathsf{pred}
\end{array}
```

**(Parse-EnsuresPredicate-Error)**

```math
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"@"})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(P)))\quad \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(P)))\ =\ \texttt{error}\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParsePredicateExpr}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P))))\ \Downarrow \ (P_{1},\ \mathsf{pred}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseEnsuresPredicate}(P)\ \Downarrow \ (P_{1},\ \operatorname{EnsuresError}(\mathsf{pred}))
\end{array}
```

**(Parse-EnsuresPredicate-NullResult)**

```math
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"@"})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(P)))\quad \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(P)))\ =\ \texttt{null\_result}\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParsePredicateExpr}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P))))\ \Downarrow \ (P_{1},\ \mathsf{pred}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseEnsuresPredicate}(P)\ \Downarrow \ (P_{1},\ \operatorname{EnsuresNullResult}(\mathsf{pred}))
\end{array}
```

**(Parse-EnsuresPredicate-Plain)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParsePredicateExpr}(P)\ \Downarrow \ (P_{1},\ \mathsf{pred}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseEnsuresPredicate}(P)\ \Downarrow \ (P_{1},\ \operatorname{Ensures}(\mathsf{pred}))
\end{array}
```
#### 23.6.3 AST Representation / Form

Foreign contracts are attached to extern declarations via `foreign_contracts_opt`.

```text
foreign_contracts_opt ∈ {⊥} ∪ [ForeignContractClause]

ForeignContractKind = {ForeignAssumes, ForeignEnsures, ForeignEnsuresError, ForeignEnsuresNullResult}
EnsuresPredicate = {Ensures(pred), EnsuresError(pred), EnsuresNullResult(pred)}    pred ∈ Expr

ForeignContractClause = ForeignContractClause(kind, preds)
kind ∈ ForeignContractKind    preds ∈ [Expr]
```

Ensures-predicate forms are:

```text
Ensures(pred)
EnsuresError(pred)
EnsuresNullResult(pred)
```
#### 23.6.4 Static Semantics

##### 23.6.4.1 Foreign Preconditions

**Foreign Preconditions.** Conditions that callers must satisfy before invoking foreign procedures, specified using the `@foreign_assumes` clause.

**Predicate Context**

Predicates MAY reference:

- Parameter names from the procedure signature
- Literal constants
- Pure functions and operators
- Fields of parameter values (for record types)

Predicates MUST NOT reference:

- Global mutable state
- Values not in scope at the call site
- Effectful operations

**Verification Modes**

| Mode                   | Behavior                                     |
| :--------------------- | :------------------------------------------- |
| `[[static]]` (default) | Caller must prove predicates at compile time |
| `[[dynamic]]`          | Runtime checks inserted before `unsafe` call |

```math
\texttt{[[static]]}\ \mathsf{uses}\ \texttt{StaticProof}\ \mathsf{as}\ \mathsf{defined}\ \mathsf{in}\ \S 15.8.\ \texttt{[[dynamic]]}\ \mathsf{inserts}\ \texttt{ContractCheck(P, ForeignPre, s, rho\_emptyset)}\ \mathsf{immediately}\ \mathsf{before}\ \mathsf{the}\ \mathsf{foreign}\ \mathsf{call}.
```

##### 23.6.4.2 Foreign Postconditions

**Foreign Postconditions.** Conditions that foreign code guarantees upon successful return, specified using the `@foreign_ensures` clause.

**Predicate Bindings**

Postcondition predicates MAY reference:

- `@result`: The return value of the foreign procedure
- Parameter names (for checking output parameters)
- `@error`: Predicates that hold when the call fails
- `@null_result`: Predicates that hold when result is null

**Success, Error, and Null Classification**

Let U be the set of unconditional predicates, E the list of `@error` predicates, and N the list of `@null_result` predicates.

Define:

ErrCond =

```math
\begin{array}{l}
\ \bigwedge \_(P\ \in \ E)\ P\quad \mathsf{if}\ E\ \ne \ \emptyset  \\
\ \texttt{false}\quad \mathsf{otherwise}
\end{array}
```

```math
\mathsf{NullCond}\ =\ (\texttt{@result}\ =\ \texttt{null})
```

```math
\mathsf{SuccessCond}\ =\ \lnot \ \mathsf{ErrCond}
```

The foreign call is classified as an error iff `ErrCond` holds; otherwise it is classified as success.

Then the foreign postcondition obligations are:

1. For each P ∈ U, require SuccessCond ⇒ P
2. For each P ∈ E, require ErrCond ⇒ P
3. For each P ∈ N, require NullCond ⇒ P

`@null_result` predicates are well-formed only when the return type is a nullable pointer type; otherwise they are invalid. A nullable pointer type is one of:
1. `Ptr<T>@Null`
2. `*imm T`
3. `*mut T`

```text
NullableFfiResult(T) ⇔ T = TypePtr(_, `@Null`) ∨ T = TypeRawPtr(`imm`, _) ∨ T = TypeRawPtr(`mut`, _)
NullResultEnsures(proc) = [pred | clause ∈ proc.foreign_contracts_opt ∧ clause.kind = ForeignEnsures ∧ pred ∈ clause.preds ∧ pred = EnsuresNullResult(_)]
```

**(ForeignEnsures-NullResult-Err)**
```text
proc = ExternProcDecl(_, _, _, _, _, _, ret_opt, _, foreign_contracts_opt, _, _)
NullResultEnsures(proc) ≠ []    R = ProcReturn(ret_opt)    ¬ NullableFfiResult(R)
──────────────────
Γ ⊢ proc ⇑
```

`@error` predicates are well-formed only when the return type is not `()`. Using `@error` on a void-returning foreign procedure is ill-formed.

**Verification Modes**

| Mode                   | Behavior                                                      |
| :--------------------- | :------------------------------------------------------------ |
| `[[static]]` (default) | Postconditions available as assumptions for downstream proofs |
| `[[dynamic]]`          | Runtime assertions after foreign call returns                 |

`[[static]]` uses `StaticProof` as defined in §15.8 with `SuccessCond` and `ErrCond` gating the obligations.

##### 23.6.4.3 Verification Summary

**Verification Summary.** Foreign-contract verification uses the following mode table:

| Level         | Precondition Check | Postcondition Check      |
| :------------ | :----------------- | :----------------------- |
| `[[static]]`  | Compile-time proof | Available as assumptions |
| `[[dynamic]]` | Runtime assertion  | Runtime assertion        |

#### 23.6.5 Dynamic Semantics

For foreign preconditions, a failed `ForeignPre` check triggers a panic.

```math
\mathsf{For}\ \mathsf{foreign}\ \mathsf{postconditions},\ \mathsf{in}\ \texttt{[[dynamic]]}\ \mathsf{mode},\ \mathsf{the}\ \mathsf{implementation}\ \mathsf{MUST}\ \mathsf{evaluate}\ \texttt{ErrCond}\ \mathsf{and}\ \texttt{NullCond}\ \mathsf{in}\ \mathsf{left}-\mathsf{to}-\mathsf{right}\ \mathsf{predicate}\ \mathsf{order}\ \mathsf{and}\ \mathsf{insert}\ \mathsf{runtime}\ \mathsf{checks}\ \mathsf{enforcing}\ \mathsf{the}\ \mathsf{implications}\ \mathsf{above}\ \mathsf{immediately}\ \mathsf{after}\ \mathsf{the}\ \mathsf{foreign}\ \mathsf{call}\ \mathsf{returns}.\ \mathsf{Each}\ \mathsf{inserted}\ \mathsf{check}\ \mathsf{is}\ \texttt{ContractCheck(P, ForeignPost, s, rho\_foreign\_post)}.\ A\ \mathsf{failed}\ \mathsf{runtime}\ \mathsf{check}\ \mathsf{triggers}\ a\ \mathsf{panic}\ \mathsf{with}\ \mathsf{payload}\ \texttt{ContractViolation(ForeignPost, P, s)}\ \mathsf{at}\ \mathsf{the}\ \mathsf{call}\ \mathsf{site}.
```

#### 23.6.6 Lowering

`[[dynamic]]` lowers foreign contracts by inserting `ContractCheck` before the foreign call for `ForeignPre` and after the foreign call for `ForeignPost`. `[[static]]` introduces no runtime checks.

#### 23.6.7 Diagnostics

| Code         | Severity | Detection    | Condition                                            |
| ------------ | -------- | ------------ | ---------------------------------------------------- |
| `E-SEM-2850` | Error    | Compile-time | Cannot prove `@foreign_assumes` predicate            |
| `E-SEM-2851` | Error    | Compile-time | Invalid predicate in foreign contract                |
| `E-SEM-2852` | Error    | Compile-time | Predicate references out-of-scope value              |
| `E-SEM-2853` | Error    | Compile-time | Invalid predicate in `@foreign_ensures`              |
| `E-SEM-2854` | Error    | Compile-time | `@result` used in non-return context                 |
| `E-SEM-2855` | Error    | Compile-time | `@error` predicate on void-returning procedure       |
| `E-SEM-2856` | Error    | Compile-time | `@null_result` predicate on non-nullable return type |
| `P-SEM-2860` | Panic    | Runtime      | Foreign precondition failed at runtime               |
| `P-SEM-2861` | Panic    | Runtime      | Foreign postcondition failed at runtime              |

### 23.7 Boundary Unwinding

#### 23.7.1 Syntax

```math
\mathsf{The}\ \mathsf{only}\ \mathsf{surface}\ \mathsf{syntax}\ \mathsf{owned}\ \mathsf{by}\ \mathsf{this}\ \mathsf{section}\ \mathsf{is}\ \texttt{[[unwind(...)]],}\ \mathsf{defined}\ \mathsf{in}\ \S 23.4.1.\ \mathsf{This}\ \mathsf{section}\ \mathsf{introduces}\ \mathsf{no}\ \mathsf{additional}\ \mathsf{concrete}\ \mathsf{syntax}.
```

#### 23.7.2 Parsing

This section introduces no additional parsing rules.

#### 23.7.3 AST Representation / Form

Boundary unwind policy is derived from the `[[unwind]]` attribute attached to a procedure declaration.

```math
\mathsf{UnwindModeValue}\ =\ \{\ \texttt{abort},\ \texttt{catch}\ \}
```

```math
\mathsf{UnwindMode}\ :\ \mathsf{ProcDecl}\ \to \ \mathsf{UnwindModeValue}
```

```math
\begin{array}{l}
\operatorname{UnwindMode}(\mathsf{proc})\ =\ m\ \Leftrightarrow \ \operatorname{UnwindAttr}(\mathsf{proc})\ =\ m \\
\operatorname{UnwindMode}(\mathsf{proc})\ =\ \texttt{abort}\ \Leftrightarrow \ \operatorname{UnwindAttr}(\mathsf{proc})\ \mathsf{undefined}
\end{array}
```

```math
\operatorname{UnwindAttr}(\mathsf{proc})\ =\ m\ \Leftrightarrow \ \exists \ a\ \in \ \operatorname{AttrByName}(\mathsf{proc},\ \texttt{"unwind"}).\ a.\mathsf{args}\ =\ [\operatorname{StringLiteral}(m)]\ \land \ m\ \in \ \mathsf{UnwindModeValue}
```

#### 23.7.4 Static Semantics

**Formal UnwindMode Determination**

```math
\mathsf{DetermineUnwindMode}\ :\ \mathsf{ProcDecl}\ \to \ \mathsf{UnwindModeValue}
```

```text
DetermineUnwindMode(proc) =
  let attrs = AttrByName(proc, "unwind")
  match attrs {
    []        → `abort`
    [a]       → ParseUnwindArg(a)
    _         → Emit(`E-FFI-0350`)
  }
```

```math
\mathsf{ParseUnwindArg}\ :\ \mathsf{Attr}\ \to \ \mathsf{UnwindModeValue}
```

```text
ParseUnwindArg(a) =
  match a.args {
    [StringLiteral("abort")] → `abort`
    [StringLiteral("catch")] → `catch`
    _                        → Emit(`E-SYS-3355`)
  }
```

**(UnwindMode-Valid)**
```text
UnwindAttr(proc) = m    m ∈ { "abort", "catch" }
──────────────────
UnwindMode(proc) = m
```

**(UnwindMode-Invalid-Err)**
```text
UnwindAttr(proc) = m    m ∉ { "abort", "catch" }    c = Code(E-SYS-3355)
──────────────────
UnwindMode(proc) ⇑ c
```

#### 23.7.5 Dynamic Semantics

**Boundary Effects.**

1. If a Ultraviolet panic or foreign unwind attempts to cross an FFI boundary with `UnwindMode(proc) = abort`, the program MUST abort.
2. If `UnwindMode(proc) = catch`:
   - imported procedures convert foreign unwinds to Ultraviolet panics;
   - raw exported procedures return `ZeroValue(R)` as defined by §23.3.5;
   - hosted exports return `ZeroValue(R)` as defined by §23.3.12.

General destruction and unwind cleanup semantics remain defined by §24.5.

#### 23.7.6 Lowering

**Code Generation Effects**

The `UnwindMode` affects generated code at FFI boundaries:

| Mode    | Import (calling extern)                                | Export / Hosted Export (called from foreign)                    |
| :------ | :----------------------------------------------------- | :-------------------------------------------------------------- |
| `abort` | Install landing pad that aborts on foreign unwind      | Install frame that aborts if Ultraviolet panic escapes          |
| `catch` | Install landing pad that converts to Ultraviolet panic | Install frame that catches unwind and returns the boundary zero |

**(CodeGen-UnwindAbort-Import)**
```text
UnwindMode(extern_proc) = `abort`    CallSite(extern_proc) at location L
──────────────────
EmitAbortLandingPad(L)
```

**(CodeGen-UnwindCatch-Import)**
```text
UnwindMode(extern_proc) = `catch`    CallSite(extern_proc) at location L
──────────────────
EmitCatchLandingPad(L, ConvertToUltravioletPanic)
```

**(CodeGen-UnwindAbort-Export)**
```text
UnwindMode(exported_proc) = `abort`    EntryPoint(exported_proc) at location L
──────────────────
EmitAbortOnPanicFrame(L)
```

**(CodeGen-UnwindCatch-Export)**
```text
UnwindMode(exported_proc) = `catch`    EntryPoint(exported_proc) at location L
──────────────────
EmitCatchExportFrame(L, ReturnZeroValue)
```

#### 23.7.7 Diagnostics

No additional named diagnostics are introduced here.

`[[unwind]]` placement and argument-validation diagnostics are owned by §23.4.7.

### 23.8 FFI Diagnostics Supplement

This section owns FFI diagnostics not already attached to the surface-attribute or foreign-contract subsections.

| Code         | Severity | Detection    | Condition                     |
| ------------ | -------- | ------------ | ----------------------------- |
| `E-SYS-3352` | Error    | Compile-time | Unsupported extern ABI string |
