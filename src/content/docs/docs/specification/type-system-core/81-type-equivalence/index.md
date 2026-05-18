---
title: "8.1 Type Equivalence"
description: "8.1 Type Equivalence from 8. Type System Core of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "type-system-core"
specSection: "81-type-equivalence"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/type-system-core/">8. Type System Core</a>
  <span>Type System Core</span>
</div>

## 8.1 Type Equivalence

$$
\begin{array}{l}
\mathsf{TypeEqJudg}\ =\ \{\equiv \} \\[0.16em]
\mathsf{ConstLenJudg}\ =\ \{\mathsf{ConstLen}\}
\end{array}
$$

**(ConstLen-Lit)**

$$
\begin{array}{l}
e\ =\ \operatorname{Literal}(\mathsf{lit})\quad \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{IntLiteral}\quad \operatorname{InRange}(\operatorname{IntValue}(\mathsf{lit}),\ \texttt{"usize"})\quad n\ =\ \operatorname{IntValue}(\mathsf{lit}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ConstLen}(e)\ \Downarrow \ n
\end{array}
$$

**(ConstLen-Path)**

$$
\begin{array}{l}
e\ =\ \operatorname{Path}(\mathsf{path},\ \mathsf{name})\quad \operatorname{ValuePathType}(\mathsf{path},\ \mathsf{name})\ =\ T\quad \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \langle \operatorname{IdentPattern}(\mathsf{name}),\ \_,\ \texttt{"="},\ \mathsf{init},\ \_\rangle ,\ \_,\ \_)\ \in \ \Gamma \quad \Gamma \ \vdash \ \operatorname{ConstLen}(\mathsf{init})\ \Downarrow \ n \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ConstLen}(e)\ \Downarrow \ n
\end{array}
$$

**(ConstLen-Err)**

$$
\begin{array}{l}
\lnot \ \exists \ n.\ \Gamma \ \vdash \ \operatorname{ConstLen}(e)\ \Downarrow \ n\quad c\ =\ \operatorname{Code}(\mathsf{ConstLen}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ConstLen}(e)\ \Uparrow \ c
\end{array}
$$

$$
\operatorname{MembersEq}([T_{1},\ \ldots ,\ T_{n}],\ [U_{1},\ \ldots ,\ U_{n}])\ \Leftrightarrow \ \exists \ U'.\ \operatorname{Permutation}(U',\ [U_{1},\ \ldots ,\ U_{n}])\ \land \ \forall \ i.\ 0\ \le \ i\ <\ n\ \Rightarrow \ \Gamma \ \vdash \ T_{i}\ \equiv \ U'[i]
$$

**(T-Equiv-Prim)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePrim}(n)\quad U\ =\ \operatorname{TypePrim}(n) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Perm)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePerm}(p,\ T_{0})\quad U\ =\ \operatorname{TypePerm}(p,\ U_{0})\quad \Gamma \ \vdash \ T_{0}\ \equiv \ U_{0} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Tuple)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}])\quad U\ =\ \operatorname{TypeTuple}([U_{1},\ \ldots ,\ U_{n}])\quad \forall \ i,\ \Gamma \ \vdash \ T_{i}\ \equiv \ U_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Array)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeArray}(T_{0},\ e_{0})\quad U\ =\ \operatorname{TypeArray}(U_{0},\ e_{1})\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e_{0})\ \Downarrow \ n\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e_{1})\ \Downarrow \ n\quad \Gamma \ \vdash \ T_{0}\ \equiv \ U_{0} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Slice)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeSlice}(T_{0})\quad U\ =\ \operatorname{TypeSlice}(U_{0})\quad \Gamma \ \vdash \ T_{0}\ \equiv \ U_{0} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Func)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeFunc}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ],\ R)\quad U\ =\ \operatorname{TypeFunc}([\langle m_{1},\ U_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ U_{n}\rangle ],\ S)\quad \forall \ i,\ \Gamma \ \vdash \ T_{i}\ \equiv \ U_{i}\quad \Gamma \ \vdash \ R\ \equiv \ S \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Closure)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeClosure}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ],\ R,\ D)\quad U\ =\ \operatorname{TypeClosure}([\langle m_{1},\ U_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ U_{n}\rangle ],\ S,\ D)\quad \forall \ i,\ \Gamma \ \vdash \ T_{i}\ \equiv \ U_{i}\quad \Gamma \ \vdash \ R\ \equiv \ S \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Union)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad U\ =\ \operatorname{TypeUnion}([U_{1},\ \ldots ,\ U_{n}])\quad \operatorname{MembersEq}([T_{1},\ \ldots ,\ T_{n}],\ [U_{1},\ \ldots ,\ U_{n}]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Path)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad U\ =\ \operatorname{TypePath}(p) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-ModalState)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\quad U\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-String)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeString}(\mathsf{st})\quad U\ =\ \operatorname{TypeString}(\mathsf{st}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Bytes)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeBytes}(\mathsf{st})\quad U\ =\ \operatorname{TypeBytes}(\mathsf{st}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Range)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRange}(T_{0})\quad U\ =\ \operatorname{TypeRange}(U_{0})\quad \Gamma \ \vdash \ T_{0}\ \equiv \ U_{0} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-RangeInclusive)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRangeInclusive}(T_{0})\quad U\ =\ \operatorname{TypeRangeInclusive}(U_{0})\quad \Gamma \ \vdash \ T_{0}\ \equiv \ U_{0} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-RangeFrom)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRangeFrom}(T_{0})\quad U\ =\ \operatorname{TypeRangeFrom}(U_{0})\quad \Gamma \ \vdash \ T_{0}\ \equiv \ U_{0} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-RangeTo)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRangeTo}(T_{0})\quad U\ =\ \operatorname{TypeRangeTo}(U_{0})\quad \Gamma \ \vdash \ T_{0}\ \equiv \ U_{0} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-RangeToInclusive)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRangeToInclusive}(T_{0})\quad U\ =\ \operatorname{TypeRangeToInclusive}(U_{0})\quad \Gamma \ \vdash \ T_{0}\ \equiv \ U_{0} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-RangeFull)**
T = TypeRangeFull    U = TypeRangeFull

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Ptr)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePtr}(T_{0},\ s)\quad U\ =\ \operatorname{TypePtr}(U_{0},\ s)\quad \Gamma \ \vdash \ T_{0}\ \equiv \ U_{0} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-RawPtr)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRawPtr}(q,\ T_{0})\quad U\ =\ \operatorname{TypeRawPtr}(q,\ U_{0})\quad \Gamma \ \vdash \ T_{0}\ \equiv \ U_{0} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Dynamic)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeDynamic}(p)\quad U\ =\ \operatorname{TypeDynamic}(p) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Apply)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeApply}(\mathsf{path},\ [T_{1},\ \ldots ,\ T_{n}])\quad U\ =\ \operatorname{TypeApply}(\mathsf{path},\ [U_{1},\ \ldots ,\ U_{n}])\quad \forall \ i,\ \Gamma \ \vdash \ T_{i}\ \equiv \ U_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Opaque)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeOpaque}(\mathsf{path})\quad U\ =\ \operatorname{TypeOpaque}(\mathsf{path}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Refine)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRefine}(T_{0},\ P_{1})\quad U\ =\ \operatorname{TypeRefine}(U_{0},\ P_{2})\quad \Gamma \ \vdash \ T_{0}\ \equiv \ U_{0}\quad \operatorname{PredicateEquiv}(P_{1},\ P_{2}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

$$
\operatorname{PredicateEquiv}(P_{1},\ P_{2})\ \Leftrightarrow \ \forall \ \sigma .\ (\operatorname{Eval}(P_{1},\ \sigma )\ =\ \mathsf{true}\ \Leftrightarrow \ \operatorname{Eval}(P_{2},\ \sigma )\ =\ \mathsf{true})
$$

**(T-Equiv-Refine-Norm)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRefine}(\operatorname{TypeRefine}(T_{0},\ P_{1}),\ P_{2})\quad U\ =\ \operatorname{TypeRefine}(T_{0},\ P_{1}\ \land \ P_{2}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Refl)**

$$
\begin{array}{l}
T\ \in \ \mathcal{T}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ T
\end{array}
$$

**(T-Equiv-Sym)**

$$
\begin{array}{l}
\Gamma \ \vdash \ T\ \equiv \ U \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ U\ \equiv \ T
\end{array}
$$

**(T-Equiv-Trans)**

$$
\begin{array}{l}
\Gamma \ \vdash \ T\ \equiv \ U\quad \Gamma \ \vdash \ U\ \equiv \ V \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ V
\end{array}
$$
