---
title: "8.1 Type Equivalence"
description: "8.1 Type Equivalence from 8. Type System Core of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "type-system-core"
specSection: "81-type-equivalence"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
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

$$
\begin{array}{l}
\operatorname{CtPureEnv}(\Gamma )\ =\ \mathsf{the}\ \mathsf{compile}-\mathsf{time}\ \mathsf{environment}\ \mathsf{of}\ \S 22.1.5\ \mathsf{with}\ \mathsf{no}\ \mathsf{capability}\ \mathsf{bindings}\ \mathsf{and}\ \mathsf{no}\ \mathsf{emission}\ \mathsf{rights} \\[0.16em]
\Phi_{\mathsf{pure}} \ =\ \langle \mathsf{files}:\ \emptyset ,\ \mathsf{root}:\ \bot ,\ [],\ [],\ 0\rangle
\end{array}
$$

**(ConstLen-Comptime)**
e does not match the Literal form of ConstLen-Lit    e does not match the Path form of ConstLen-Path

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CtEval}(\operatorname{CtPureEnv}(\Gamma ),\ \Phi_{\mathsf{pure}} ,\ e)\ \Downarrow \ (\operatorname{CtPrim}(n),\ \_,\ \Phi_{1} )\quad \operatorname{CtPendingEmits}(\Phi_{1} )\ =\ []\quad n\ \in \ \mathbb{N} \quad \operatorname{InRange}(n,\ \texttt{"usize"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ConstLen}(e)\ \Downarrow \ n
\end{array}
$$

Array-length expressions admit any pure, capability-free, emission-free compile-time-evaluable expression. `ConstLen-Comptime` evaluation occurs during Phase 3 over the Phase-2-expanded module set; any `CtBuiltinCall` that requires capabilities or emission leaves `CtEval` undefined, so `ConstLen-Err` applies.

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

$$
\begin{array}{l}
\operatorname{TypeKeyString}(T)\ =\ \operatorname{TypeRender}(\operatorname{AliasExpand}(T)) \\[0.16em]
\operatorname{UnionSort}([T_{1},\ \ldots ,\ T_{n}])\ =\ \mathsf{the}\ \mathsf{stable}\ \mathsf{sort}\ \mathsf{of}\ [T_{1},\ \ldots ,\ T_{n}]\ \mathsf{by}\ \mathsf{byte}-\mathsf{wise}\ \mathsf{lexicographic}\ \mathsf{order}\ \mathsf{of}\ \mathsf{TypeKeyString}
\end{array}
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
\begin{array}{l}
\operatorname{PredSubject}(P)\ =\ \mathsf{the}\ \mathsf{binder}\ \mathsf{identifier}\ \mathsf{the}\ \mathsf{refinement}\ \mathsf{form}\ \mathsf{introduces}\ \mathsf{for}\ \mathsf{the}\ \mathsf{refined}\ \mathsf{value}\ \mathsf{in}\ P \\[0.16em]
\operatorname{PredNorm}(P)\ =\ P\ \mathsf{with}\ \mathsf{every}\ \mathsf{free}\ \mathsf{occurrence}\ \mathsf{of}\ \operatorname{PredSubject}(P)\ \mathsf{replaced}\ \mathsf{by}\ \mathsf{the}\ \mathsf{reserved}\ \mathsf{subject}\ \mathsf{symbol}\ \varnothing ,\ \mathsf{and}\ \mathsf{no}\ \mathsf{other}\ \mathsf{rewriting} \\[0.16em]
\operatorname{PredicateEquiv}(P_{1},\ P_{2})\ \Leftrightarrow \ \operatorname{PredNorm}(P_{1})\ =\ \operatorname{PredNorm}(P_{2})\quad (\mathsf{structural}\ \mathsf{AST}\ \mathsf{equality})
\end{array}
$$

Predicates that are semantically equivalent but structurally distinct after subject renaming are NOT equivalent for type equivalence. Implementations MUST NOT accept broader equivalences; this keeps `≡` decidable and aligned with `Unify-Refine`.

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
T\ \in \ \mathcal{T} \\[0.16em]
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
