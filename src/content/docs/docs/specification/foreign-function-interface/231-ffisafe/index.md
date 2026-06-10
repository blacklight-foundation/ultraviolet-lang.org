---
title: "23.1 FfiSafe"
description: "23.1 FfiSafe from 23. Foreign Function Interface of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "foreign-function-interface"
specSection: "231-ffisafe"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/foreign-function-interface/">23. Foreign Function Interface</a>
  <span>Foreign Function Interface</span>
</div>

## 23.1 FfiSafe

### 23.1.1 Syntax

This section introduces no additional concrete syntax.

### 23.1.2 Parsing

This section introduces no additional parsing rules.

### 23.1.3 AST Representation / Form

`FfiSafeType` is a semantic predicate over existing `Type` forms, including `TypePrim`, `TypeArray`, `TypeFunc`, `TypePerm`, `TypePath`, and `TypeApply`.

### 23.1.4 Static Semantics

**FfiSafe Predicate.** `FfiSafeType(T)` holds when the runtime representation of `T` is compatible with the platform C ABI.

$$
\mathsf{FfiSafeJudg}\ =\ \{\mathsf{FfiSafeType}\}
$$

$$
\mathsf{FfiPrimTypes}\ =\ \{\texttt{i8},\ \texttt{i16},\ \texttt{i32},\ \texttt{i64},\ \texttt{i128},\ \texttt{u8},\ \texttt{u16},\ \texttt{u32},\ \texttt{u64},\ \texttt{u128},\ \texttt{isize},\ \texttt{usize},\ \texttt{f16},\ \texttt{f32},\ \texttt{f64},\ \texttt{char},\ \texttt{()}\}
$$

$$
\begin{array}{l}
\operatorname{HasLayoutC}(D)\ \Leftrightarrow \ \texttt{layout(C)}\ \mathsf{appears}\ \mathsf{in}\ D.\mathsf{attrs}_{\mathsf{opt}} \\[0.16em]
\operatorname{PayloadTypes}(v)\ =\ []\quad \mathsf{if}\ v.\mathsf{payload}_{\mathsf{opt}}\ =\ \bot \\[0.16em]
\operatorname{PayloadTypes}(v)\ =\ \mathsf{ts}\quad \mathsf{if}\ v.\mathsf{payload}_{\mathsf{opt}}\ =\ \operatorname{TuplePayload}(\mathsf{ts}) \\[0.16em]
\operatorname{PayloadTypes}(v)\ =\ [T_{f}\ \mid \ \langle \_,\ f,\ T_{f},\ \_,\ \_,\ \_\rangle \ \in \ \mathsf{fields}]\quad \mathsf{if}\ v.\mathsf{payload}_{\mathsf{opt}}\ =\ \operatorname{RecordPayload}(\mathsf{fields})
\end{array}
$$

$$
\operatorname{TypeParamSet}(\mathsf{params})\ =\ \operatorname{Set}(\operatorname{TypeParamNames}(\mathsf{params}))
$$

$$
\begin{array}{l}
\operatorname{AliasParams}(p)\ =\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}}\ \Leftrightarrow \ \Sigma .\mathsf{Types}[p]\ =\ \operatorname{TypeAliasDecl}(\_,\ \_,\ \_,\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \_,\ \_,\ \_,\ \_) \\[0.16em]
\operatorname{AliasPredicateClause}(p)\ =\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}\ \Leftrightarrow \ \Sigma .\mathsf{Types}[p]\ =\ \operatorname{TypeAliasDecl}(\_,\ \_,\ \_,\ \_,\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \_,\ \_,\ \_)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypePath}([x]))\ =\ \theta (x)\quad \mathsf{if}\ x\ \in \ \operatorname{dom}(\theta ) \\[0.16em]
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypePath}(p))\ =\ \operatorname{TypePath}(p)\quad \mathsf{if}\ p\ \ne \ [x]\ \lor \ x\ \notin \ \operatorname{dom}(\theta ) \\[0.16em]
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeApply}(p,\ \mathsf{args}))\ =\ \operatorname{TypeApply}(p,\ [\operatorname{TypeSubst}(\theta ,\ a)\ \mid \ a\ \in \ \mathsf{args}]) \\[0.16em]
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypePerm}(p,\ T))\ =\ \operatorname{TypePerm}(p,\ \operatorname{TypeSubst}(\theta ,\ T)) \\[0.16em]
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeTuple}(\mathsf{ts}))\ =\ \operatorname{TypeTuple}([\operatorname{TypeSubst}(\theta ,\ t)\ \mid \ t\ \in \ \mathsf{ts}]) \\[0.16em]
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeArray}(T,\ e))\ =\ \operatorname{TypeArray}(\operatorname{TypeSubst}(\theta ,\ T),\ e) \\[0.16em]
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeSlice}(T))\ =\ \operatorname{TypeSlice}(\operatorname{TypeSubst}(\theta ,\ T)) \\[0.16em]
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeUnion}(\mathsf{ts}))\ =\ \operatorname{TypeUnion}([\operatorname{TypeSubst}(\theta ,\ t)\ \mid \ t\ \in \ \mathsf{ts}]) \\[0.16em]
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeFunc}(\mathsf{params},\ R))\ =\ \operatorname{TypeFunc}([\langle m,\ \operatorname{TypeSubst}(\theta ,\ T)\rangle \ \mid \ \langle m,\ T\rangle \ \in \ \mathsf{params}],\ \operatorname{TypeSubst}(\theta ,\ R)) \\[0.16em]
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypePtr}(T,\ s))\ =\ \operatorname{TypePtr}(\operatorname{TypeSubst}(\theta ,\ T),\ s) \\[0.16em]
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeRawPtr}(q,\ T))\ =\ \operatorname{TypeRawPtr}(q,\ \operatorname{TypeSubst}(\theta ,\ T)) \\[0.16em]
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeString}(s))\ =\ \operatorname{TypeString}(s) \\[0.16em]
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeBytes}(s))\ =\ \operatorname{TypeBytes}(s) \\[0.16em]
\operatorname{ModalRefSubst}(\theta ,\ \operatorname{TypePath}(p))\ =\ \operatorname{TypePath}(p) \\[0.16em]
\operatorname{ModalRefSubst}(\theta ,\ \operatorname{TypeApply}(p,\ \mathsf{args}))\ =\ \operatorname{TypeApply}(p,\ [\operatorname{TypeSubst}(\theta ,\ a)\ \mid \ a\ \in \ \mathsf{args}]) \\[0.16em]
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S))\ =\ \operatorname{TypeModalState}(\operatorname{ModalRefSubst}(\theta ,\ \mathsf{modal}_{\mathsf{ref}}),\ S) \\[0.16em]
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeDynamic}(p))\ =\ \operatorname{TypeDynamic}(p) \\[0.16em]
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeOpaque}(p))\ =\ \operatorname{TypeOpaque}(p) \\[0.16em]
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypePrim}(n))\ =\ \operatorname{TypePrim}(n) \\[0.16em]
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeRange}(\mathsf{base}))\ =\ \operatorname{TypeRange}(\operatorname{TypeSubst}(\theta ,\ \mathsf{base})) \\[0.16em]
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeRangeInclusive}(\mathsf{base}))\ =\ \operatorname{TypeRangeInclusive}(\operatorname{TypeSubst}(\theta ,\ \mathsf{base})) \\[0.16em]
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeRangeFrom}(\mathsf{base}))\ =\ \operatorname{TypeRangeFrom}(\operatorname{TypeSubst}(\theta ,\ \mathsf{base})) \\[0.16em]
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeRangeTo}(\mathsf{base}))\ =\ \operatorname{TypeRangeTo}(\operatorname{TypeSubst}(\theta ,\ \mathsf{base})) \\[0.16em]
\operatorname{TypeSubst}(\theta ,\ \operatorname{TypeRangeToInclusive}(\mathsf{base}))\ =\ \operatorname{TypeRangeToInclusive}(\operatorname{TypeSubst}(\theta ,\ \mathsf{base})) \\[0.16em]
\operatorname{TypeSubst}(\theta ,\ \mathsf{TypeRangeFull})\ =\ \mathsf{TypeRangeFull}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{TypeParamsIn}(\operatorname{TypePath}([x]),\ \mathsf{params})\ =\ \{x\}\quad \mathsf{if}\ x\ \in \ \operatorname{TypeParamSet}(\mathsf{params}) \\[0.16em]
\operatorname{TypeParamsIn}(\operatorname{TypePath}(p),\ \mathsf{params})\ =\ \emptyset \quad \mathsf{if}\ p\ \ne \ [x]\ \lor \ x\ \notin \ \operatorname{TypeParamSet}(\mathsf{params}) \\[0.16em]
\operatorname{TypeParamsIn}(\operatorname{TypeApply}(\_,\ \mathsf{args}),\ \mathsf{params})\ =\ \bigcup \_\{a\ \in \ \mathsf{args}\}\ \operatorname{TypeParamsIn}(a,\ \mathsf{params}) \\[0.16em]
\operatorname{TypeParamsIn}(\operatorname{TypePerm}(\_,\ T),\ \mathsf{params})\ =\ \operatorname{TypeParamsIn}(T,\ \mathsf{params}) \\[0.16em]
\operatorname{TypeParamsIn}(\operatorname{TypeTuple}(\mathsf{ts}),\ \mathsf{params})\ =\ \bigcup \_\{t\ \in \ \mathsf{ts}\}\ \operatorname{TypeParamsIn}(t,\ \mathsf{params}) \\[0.16em]
\operatorname{TypeParamsIn}(\operatorname{TypeArray}(T,\ \_),\ \mathsf{params})\ =\ \operatorname{TypeParamsIn}(T,\ \mathsf{params}) \\[0.16em]
\operatorname{TypeParamsIn}(\operatorname{TypeSlice}(T),\ \mathsf{params})\ =\ \operatorname{TypeParamsIn}(T,\ \mathsf{params}) \\[0.16em]
\operatorname{TypeParamsIn}(\operatorname{TypeUnion}(\mathsf{ts}),\ \mathsf{params})\ =\ \bigcup \_\{t\ \in \ \mathsf{ts}\}\ \operatorname{TypeParamsIn}(t,\ \mathsf{params}) \\[0.16em]
\operatorname{TypeParamsIn}(\operatorname{TypeFunc}(\mathsf{params}_{t},\ R),\ \mathsf{params})\ =\ \bigcup \_\{\langle \_,\ T\rangle \ \in \ \mathsf{params}_{t}\}\ \operatorname{TypeParamsIn}(T,\ \mathsf{params})\ \cup \ \operatorname{TypeParamsIn}(R,\ \mathsf{params}) \\[0.16em]
\operatorname{TypeParamsIn}(\operatorname{TypePtr}(T,\ \_),\ \mathsf{params})\ =\ \operatorname{TypeParamsIn}(T,\ \mathsf{params}) \\[0.16em]
\operatorname{TypeParamsIn}(\operatorname{TypeRawPtr}(\_,\ T),\ \mathsf{params})\ =\ \operatorname{TypeParamsIn}(T,\ \mathsf{params}) \\[0.16em]
\operatorname{TypeParamsInModalRef}(\operatorname{TypePath}(\_),\ \mathsf{params})\ =\ \emptyset \\[0.16em]
\operatorname{TypeParamsInModalRef}(\operatorname{TypeApply}(\_,\ \mathsf{args}),\ \mathsf{params})\ =\ \bigcup \_\{a\ \in \ \mathsf{args}\}\ \operatorname{TypeParamsIn}(a,\ \mathsf{params}) \\[0.16em]
\operatorname{TypeParamsIn}(\operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ \_),\ \mathsf{params})\ =\ \operatorname{TypeParamsInModalRef}(\mathsf{modal}_{\mathsf{ref}},\ \mathsf{params}) \\[0.16em]
\operatorname{TypeParamsIn}(\operatorname{TypeString}(\_),\ \mathsf{params})\ =\ \emptyset \\[0.16em]
\operatorname{TypeParamsIn}(\operatorname{TypeBytes}(\_),\ \mathsf{params})\ =\ \emptyset \\[0.16em]
\operatorname{TypeParamsIn}(\operatorname{TypeModalState}(\_,\ \_),\ \mathsf{params})\ =\ \emptyset \\[0.16em]
\operatorname{TypeParamsIn}(\operatorname{TypeDynamic}(\_),\ \mathsf{params})\ =\ \emptyset \\[0.16em]
\operatorname{TypeParamsIn}(\operatorname{TypeOpaque}(\_),\ \mathsf{params})\ =\ \emptyset \\[0.16em]
\operatorname{TypeParamsIn}(\operatorname{TypePrim}(\_),\ \mathsf{params})\ =\ \emptyset \\[0.16em]
\operatorname{TypeParamsIn}(\operatorname{TypeRange}(\mathsf{base}),\ \mathsf{params})\ =\ \operatorname{TypeParamsIn}(\mathsf{base},\ \mathsf{params}) \\[0.16em]
\operatorname{TypeParamsIn}(\operatorname{TypeRangeInclusive}(\mathsf{base}),\ \mathsf{params})\ =\ \operatorname{TypeParamsIn}(\mathsf{base},\ \mathsf{params}) \\[0.16em]
\operatorname{TypeParamsIn}(\operatorname{TypeRangeFrom}(\mathsf{base}),\ \mathsf{params})\ =\ \operatorname{TypeParamsIn}(\mathsf{base},\ \mathsf{params}) \\[0.16em]
\operatorname{TypeParamsIn}(\operatorname{TypeRangeTo}(\mathsf{base}),\ \mathsf{params})\ =\ \operatorname{TypeParamsIn}(\mathsf{base},\ \mathsf{params}) \\[0.16em]
\operatorname{TypeParamsIn}(\operatorname{TypeRangeToInclusive}(\mathsf{base}),\ \mathsf{params})\ =\ \operatorname{TypeParamsIn}(\mathsf{base},\ \mathsf{params}) \\[0.16em]
\operatorname{TypeParamsIn}(\mathsf{TypeRangeFull},\ \mathsf{params})\ =\ \emptyset
\end{array}
$$

$$
\begin{array}{l}
\operatorname{TypeParamsInFields}(\mathsf{fields},\ \mathsf{params})\ =\ \bigcup \_\{f\ \in \ \mathsf{fields}\}\ \operatorname{TypeParamsIn}(f.\mathsf{type},\ \mathsf{params}) \\[0.16em]
\operatorname{TypeParamsInPayloads}(\mathsf{vars},\ \mathsf{params})\ =\ \bigcup \_\{v\ \in \ \mathsf{vars}\}\ \bigcup \_\{T_{f}\ \in \ \operatorname{PayloadTypes}(v)\}\ \operatorname{TypeParamsIn}(T_{f},\ \mathsf{params})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{HasFfiSafeReq}(W,\ x)\ \Leftrightarrow \ \exists \ \mathsf{wp}\ \in \ \operatorname{PredicateReqs}(W).\ \mathsf{wp}\ =\ \operatorname{PredicateReq}(\texttt{FfiSafe},\ \operatorname{TypePath}([x])) \\[0.16em]
\operatorname{FfiSafePredicateClauseOk}(\mathsf{params},\ W,\ \mathsf{Xs})\ \Leftrightarrow \ \forall \ x\ \in \ \mathsf{Xs}.\ \operatorname{HasFfiSafeReq}(W,\ x)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ProhibitedFfiType}(T)\ \Leftrightarrow \\[0.16em]
\ T\ =\ \operatorname{TypePrim}(\texttt{"bool"})\ \lor \\[0.16em]
\ T\ =\ \operatorname{TypePtr}(\_,\ \_)\ \lor \\[0.16em]
\ T\ =\ \operatorname{TypeModalState}(\_,\ \_)\ \lor \\[0.16em]
\ T\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\ \lor \\[0.16em]
\ T\ =\ \operatorname{TypeDynamic}(\_)\ \lor \\[0.16em]
\ T\ =\ \operatorname{TypeOpaque}(\_)\ \lor \\[0.16em]
\ T\ =\ \operatorname{TypeTuple}(\_)\ \lor \\[0.16em]
\ T\ =\ \operatorname{TypeUnion}(\_)\ \lor \\[0.16em]
\ T\ =\ \operatorname{TypeSlice}(\_)\ \lor \\[0.16em]
\ T\ =\ \operatorname{TypeString}(\_)\ \lor \\[0.16em]
\ T\ =\ \operatorname{TypeBytes}(\_)\ \lor \\[0.16em]
\ T\ =\ \operatorname{TypeRange}(\_)\ \lor \\[0.16em]
\ T\ =\ \operatorname{TypeRangeInclusive}(\_)\ \lor \\[0.16em]
\ T\ =\ \operatorname{TypeRangeFrom}(\_)\ \lor \\[0.16em]
\ T\ =\ \operatorname{TypeRangeTo}(\_)\ \lor \\[0.16em]
\ T\ =\ \operatorname{TypeRangeToInclusive}(\_)\ \lor \\[0.16em]
\ T\ =\ \mathsf{TypeRangeFull}\ \lor \\[0.16em]
\ T\ =\ \operatorname{TypePath}([\texttt{"Context"}])
\end{array}
$$

$$
\begin{array}{l}
\operatorname{FfiByValueType}(T)\ \Leftrightarrow \ \operatorname{StripPerm}(T)\ \notin \ \{\operatorname{TypeRawPtr}(\_,\ \_),\ \operatorname{TypePtr}(\_,\ \_),\ \operatorname{TypeFunc}(\_,\ \_)\}\ \land \ \operatorname{StripPerm}(T)\ \ne \ \operatorname{TypePrim}(\texttt{"()"}) \\[0.16em]
\operatorname{FfiPassByValueAttr}(T)\ \Leftrightarrow \ (T\ =\ \operatorname{TypePath}(p)\ \land \ \operatorname{RecordDecl}(p)\ =\ R\ \land \ \operatorname{AttrByName}(R,\ \texttt{"ffi\_pass\_by\_value"})\ \ne \ [])\ \lor \ (T\ =\ \operatorname{TypePath}(p)\ \land \ \operatorname{EnumDecl}(p)\ =\ E\ \land \ \operatorname{AttrByName}(E,\ \texttt{"ffi\_pass\_by\_value"})\ \ne \ []) \\[0.16em]
\operatorname{FfiByValueOk}(T)\ \Leftrightarrow \ \lnot (\operatorname{DropType}(T)\ \land \ \operatorname{FfiSafeType}(T)\ \Downarrow \ \mathsf{ok}\ \land \ \operatorname{FfiByValueType}(T))\ \lor \ \operatorname{FfiPassByValueAttr}(\operatorname{StripPerm}(T))
\end{array}
$$

**(FfiSafe-Prim)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePrim}(t)\quad t\ \in \ \mathsf{FfiPrimTypes} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(FfiSafe-RawPtr)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRawPtr}(\_,\ \_) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(FfiSafe-Array)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeArray}(U,\ n)\quad \Gamma \ \vdash \ \operatorname{ConstLen}(n)\ \Downarrow \ \_\quad \Gamma \ \vdash \ \operatorname{FfiSafeType}(U)\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(FfiSafe-Func)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeFunc}(\mathsf{params},\ R)\quad \forall \ \langle \_,\ T_{i}\rangle \ \in \ \mathsf{params}.\ \Gamma \ \vdash \ \operatorname{FfiSafeType}(T_{i})\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{FfiSafeType}(R)\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(FfiSafe-Perm)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePerm}(\_,\ U)\quad \Gamma \ \vdash \ \operatorname{FfiSafeType}(U)\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(FfiSafe-Alias)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{AliasBody}(p)\ =\ \mathsf{ty}\quad \Gamma \ \vdash \ \operatorname{FfiSafeType}(\mathsf{ty})\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(FfiSafe-Alias-Apply)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeApply}(p,\ \mathsf{args})\quad \operatorname{AliasBody}(p)\ =\ \mathsf{ty}\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(\operatorname{AliasParams}(p))\quad \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{args})\ =\ \mathsf{args}'\quad \theta \ =\ [\mathsf{args}'\_i\ /\ \mathsf{params}_{\mathsf{gen}}[i].\mathsf{name}]\quad \Gamma \ \vdash \ \operatorname{AliasPredicateClause}(p)[\theta ]\ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{FfiSafeType}(\operatorname{TypeSubst}(\theta ,\ \mathsf{ty}))\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(FfiSafe-Record)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \operatorname{HasLayoutC}(R)\quad \operatorname{TypeParamsOpt}(R.\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\ =\ []\quad \Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \_\quad \forall \ f\ :\ T_{f}\ \in \ \operatorname{Fields}(R).\ \Gamma \ \vdash \ \operatorname{FfiSafeType}(T_{f})\ \Downarrow \ \mathsf{ok}\quad \operatorname{FfiSafePredicateClauseOk}([],\ R.\mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \emptyset ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(FfiSafe-Record-Apply)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeApply}(p,\ \mathsf{args})\quad \operatorname{RecordDecl}(p)\ =\ R\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(R.\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{args})\ =\ \mathsf{args}'\quad \theta \ =\ [\mathsf{args}'\_i\ /\ \mathsf{params}_{\mathsf{gen}}[i].\mathsf{name}]\quad \operatorname{HasLayoutC}(R)\quad \Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \_\quad \Gamma \ \vdash \ R.\mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}[\theta ]\ \mathsf{ok}\quad \operatorname{FfiSafePredicateClauseOk}(\mathsf{params}_{\mathsf{gen}},\ R.\mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \operatorname{TypeParamsInFields}(\operatorname{Fields}(R),\ \mathsf{params}_{\mathsf{gen}}))\quad \forall \ f\ :\ T_{f}\ \in \ \operatorname{Fields}(R).\ \Gamma \ \vdash \ \operatorname{FfiSafeType}(\operatorname{TypeSubst}(\theta ,\ T_{f}))\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(FfiSafe-Enum)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{HasLayoutC}(E)\quad \operatorname{TypeParamsOpt}(E.\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\ =\ []\quad \Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \_\quad \forall \ v\ \in \ \operatorname{Variants}(E).\ \forall \ T_{f}\ \in \ \operatorname{PayloadTypes}(v).\ \Gamma \ \vdash \ \operatorname{FfiSafeType}(T_{f})\ \Downarrow \ \mathsf{ok}\quad \operatorname{FfiSafePredicateClauseOk}([],\ E.\mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \emptyset ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(FfiSafe-Enum-Apply)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeApply}(p,\ \mathsf{args})\quad \operatorname{EnumDecl}(p)\ =\ E\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(E.\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{args})\ =\ \mathsf{args}'\quad \theta \ =\ [\mathsf{args}'\_i\ /\ \mathsf{params}_{\mathsf{gen}}[i].\mathsf{name}]\quad \operatorname{HasLayoutC}(E)\quad \Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \_\quad \Gamma \ \vdash \ E.\mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}[\theta ]\ \mathsf{ok}\quad \operatorname{FfiSafePredicateClauseOk}(\mathsf{params}_{\mathsf{gen}},\ E.\mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \operatorname{TypeParamsInPayloads}(\operatorname{Variants}(E),\ \mathsf{params}_{\mathsf{gen}}))\quad \forall \ v\ \in \ \operatorname{Variants}(E).\ \forall \ T_{f}\ \in \ \operatorname{PayloadTypes}(v).\ \Gamma \ \vdash \ \operatorname{FfiSafeType}(\operatorname{TypeSubst}(\theta ,\ T_{f}))\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(FfiSafe-Prohibited-Err)**

$$
\begin{array}{l}
\operatorname{ProhibitedFfiType}(T)\quad c\ =\ \operatorname{Code}(\mathsf{FfiSafe}-\mathsf{Prohibited}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Uparrow \ c
\end{array}
$$

**(FfiSafe-Record-LayoutC-Err)**

$$
\begin{array}{l}
(T\ =\ \operatorname{TypePath}(p)\ \lor \ T\ =\ \operatorname{TypeApply}(p,\ \_))\quad \operatorname{RecordDecl}(p)\ =\ R\quad \lnot \ \operatorname{HasLayoutC}(R)\quad c\ =\ \operatorname{Code}(\mathsf{FfiSafe}-\mathsf{Record}-\mathsf{LayoutC}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Uparrow \ c
\end{array}
$$

**(FfiSafe-Enum-LayoutC-Err)**

$$
\begin{array}{l}
(T\ =\ \operatorname{TypePath}(p)\ \lor \ T\ =\ \operatorname{TypeApply}(p,\ \_))\quad \operatorname{EnumDecl}(p)\ =\ E\quad \lnot \ \operatorname{HasLayoutC}(E)\quad c\ =\ \operatorname{Code}(\mathsf{FfiSafe}-\mathsf{Enum}-\mathsf{LayoutC}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Uparrow \ c
\end{array}
$$

**(FfiSafe-Record-Field-Err)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \operatorname{HasLayoutC}(R)\quad \exists \ f\ :\ T_{f}\ \in \ \operatorname{Fields}(R).\ \Gamma \ \vdash \ \operatorname{FfiSafeType}(T_{f})\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{FfiSafe}-\mathsf{Record}-\mathsf{Field}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Uparrow \ c
\end{array}
$$

**(FfiSafe-Record-Field-Apply-Err)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeApply}(p,\ \mathsf{args})\quad \operatorname{RecordDecl}(p)\ =\ R\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(R.\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{args})\ =\ \mathsf{args}'\quad \theta \ =\ [\mathsf{args}'\_i\ /\ \mathsf{params}_{\mathsf{gen}}[i].\mathsf{name}]\quad \operatorname{HasLayoutC}(R)\quad \exists \ f\ :\ T_{f}\ \in \ \operatorname{Fields}(R).\ \Gamma \ \vdash \ \operatorname{FfiSafeType}(\operatorname{TypeSubst}(\theta ,\ T_{f}))\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{FfiSafe}-\mathsf{Record}-\mathsf{Field}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Uparrow \ c
\end{array}
$$

**(FfiSafe-Enum-Field-Err)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{HasLayoutC}(E)\quad \exists \ v\ \in \ \operatorname{Variants}(E).\ \exists \ T_{f}\ \in \ \operatorname{PayloadTypes}(v).\ \Gamma \ \vdash \ \operatorname{FfiSafeType}(T_{f})\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{FfiSafe}-\mathsf{Enum}-\mathsf{Field}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Uparrow \ c
\end{array}
$$

**(FfiSafe-Enum-Field-Apply-Err)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeApply}(p,\ \mathsf{args})\quad \operatorname{EnumDecl}(p)\ =\ E\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(E.\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{args})\ =\ \mathsf{args}'\quad \theta \ =\ [\mathsf{args}'\_i\ /\ \mathsf{params}_{\mathsf{gen}}[i].\mathsf{name}]\quad \operatorname{HasLayoutC}(E)\quad \exists \ v\ \in \ \operatorname{Variants}(E).\ \exists \ T_{f}\ \in \ \operatorname{PayloadTypes}(v).\ \Gamma \ \vdash \ \operatorname{FfiSafeType}(\operatorname{TypeSubst}(\theta ,\ T_{f}))\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{FfiSafe}-\mathsf{Enum}-\mathsf{Field}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Uparrow \ c
\end{array}
$$

**(FfiSafe-Incomplete-Err)**

$$
\begin{array}{l}
(T\ =\ \operatorname{TypePath}(p)\ \lor \ T\ =\ \operatorname{TypeApply}(p,\ \_))\quad (\operatorname{RecordDecl}(p)\ =\ R\ \lor \ \operatorname{EnumDecl}(p)\ =\ E)\quad \lnot \ \exists \ \tau .\ \Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \tau \quad c\ =\ \operatorname{Code}(\mathsf{FfiSafe}-\mathsf{Incomplete}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Uparrow \ c
\end{array}
$$

**(FfiSafe-Record-Generic-Unbounded-Err)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(R.\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \mathsf{params}_{\mathsf{gen}}\ \ne \ []\quad \lnot \ \operatorname{FfiSafePredicateClauseOk}(\mathsf{params}_{\mathsf{gen}},\ R.\mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \operatorname{TypeParamsInFields}(\operatorname{Fields}(R),\ \mathsf{params}_{\mathsf{gen}}))\quad c\ =\ \operatorname{Code}(\mathsf{FfiSafe}-\mathsf{Generic}-\mathsf{Unbounded}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Uparrow \ c
\end{array}
$$

**(FfiSafe-Enum-Generic-Unbounded-Err)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(E.\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \mathsf{params}_{\mathsf{gen}}\ \ne \ []\quad \lnot \ \operatorname{FfiSafePredicateClauseOk}(\mathsf{params}_{\mathsf{gen}},\ E.\mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \operatorname{TypeParamsInPayloads}(\operatorname{Variants}(E),\ \mathsf{params}_{\mathsf{gen}}))\quad c\ =\ \operatorname{Code}(\mathsf{FfiSafe}-\mathsf{Generic}-\mathsf{Unbounded}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Uparrow \ c
\end{array}
$$

**(FfiSafe-Record-Apply-Generic-Unbounded-Err)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeApply}(p,\ \mathsf{args})\quad \operatorname{RecordDecl}(p)\ =\ R\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(R.\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \mathsf{params}_{\mathsf{gen}}\ \ne \ []\quad \lnot \ \operatorname{FfiSafePredicateClauseOk}(\mathsf{params}_{\mathsf{gen}},\ R.\mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \operatorname{TypeParamsInFields}(\operatorname{Fields}(R),\ \mathsf{params}_{\mathsf{gen}}))\quad c\ =\ \operatorname{Code}(\mathsf{FfiSafe}-\mathsf{Generic}-\mathsf{Unbounded}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Uparrow \ c
\end{array}
$$

**(FfiSafe-Enum-Apply-Generic-Unbounded-Err)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeApply}(p,\ \mathsf{args})\quad \operatorname{EnumDecl}(p)\ =\ E\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(E.\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \mathsf{params}_{\mathsf{gen}}\ \ne \ []\quad \lnot \ \operatorname{FfiSafePredicateClauseOk}(\mathsf{params}_{\mathsf{gen}},\ E.\mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \operatorname{TypeParamsInPayloads}(\operatorname{Variants}(E),\ \mathsf{params}_{\mathsf{gen}}))\quad c\ =\ \operatorname{Code}(\mathsf{FfiSafe}-\mathsf{Generic}-\mathsf{Unbounded}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Uparrow \ c
\end{array}
$$

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

**RAII by-value rule.** If a type satisfies both `DropType` and `FfiSafeType`, then any by-value appearance of that type in an FFI signature requires the defining type to carry `#ffi_pass_by_value`.

**Generic Bounds.** Any type parameter that appears in a field type or variant payload of a type satisfying `FfiSafeType` MUST be bounded by a predicate requirement of the form `FfiSafe(X)` in the declaration's `|:` clause.

### 23.1.5 Dynamic Semantics

This section introduces no additional runtime mechanism. Dynamic boundary behavior is defined by §§23.2, 23.3, and 23.7.

### 23.1.6 Lowering

`FfiSafeType` constrains which values may be lowered across an FFI boundary. This section introduces no additional feature-local lowering beyond the ABI and boundary rules defined in §§23.2, 23.3, and 23.7.

### 23.1.7 Diagnostics

| Code         | Severity | Detection    | Condition                                                      |
| ------------ | -------- | ------------ | -------------------------------------------------------------- |
| `E-TYP-2623` | Error    | Compile-time | Prohibited type category in `FfiSafeType` (`FfiSafe-Prohibited-Err`) |
| `E-TYP-2624` | Error    | Compile-time | `FfiSafeType` record without `#layout(C)` (`FfiSafe-Record-LayoutC-Err`) |
| `E-TYP-2625` | Error    | Compile-time | `FfiSafeType` enum without `#layout(C)` (`FfiSafe-Enum-LayoutC-Err`) |
| `E-TYP-2626` | Error    | Compile-time | `FfiSafeType` record has non-`FfiSafeType` field (`FfiSafe-Record-Field-Err`) |
| `E-TYP-2627` | Error    | Compile-time | `FfiSafeType` enum has non-`FfiSafeType` payload field (`FfiSafe-Enum-Field-Err`) |
| `E-TYP-2628` | Error    | Compile-time | `FfiSafeType` requires complete layout (`FfiSafe-Incomplete-Err`) |
| `E-TYP-2629` | Error    | Compile-time | Generic `FfiSafeType` with unconstrained parameter (`FfiSafe-Generic-Unbounded-Err`) |
| `E-TYP-2630` | Error    | Compile-time | By-value FFI use of `DropType` without `#ffi_pass_by_value` |
