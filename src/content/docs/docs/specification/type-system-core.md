---
title: "Type System Core"
description: "8. Type System Core of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T19:35:24.518Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>


## 8.1 Type Equivalence

$$
\begin{array}{l}
\mathsf{TypeEqJudg}\ =\ \{\equiv \} \\
\mathsf{ConstLenJudg}\ =\ \{\mathsf{ConstLen}\}
\end{array}
$$

**(ConstLen-Lit)**

$$
\begin{array}{l}
e\ =\ \operatorname{Literal}(\mathsf{lit})\quad \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{IntLiteral}\quad \operatorname{InRange}(\operatorname{IntValue}(\mathsf{lit}),\ \texttt{"usize"})\quad n\ =\ \operatorname{IntValue}(\mathsf{lit}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ConstLen}(e)\ \Downarrow \ n
\end{array}
$$

**(ConstLen-Path)**

$$
\begin{array}{l}
e\ =\ \operatorname{Path}(\mathsf{path},\ \mathsf{name})\quad \operatorname{ValuePathType}(\mathsf{path},\ \mathsf{name})\ =\ T\quad \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \langle \operatorname{IdentPattern}(\mathsf{name}),\ \_,\ \texttt{"="},\ \mathsf{init},\ \_\rangle ,\ \_,\ \_)\ \in \ \Gamma \quad \Gamma \ \vdash \ \operatorname{ConstLen}(\mathsf{init})\ \Downarrow \ n \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ConstLen}(e)\ \Downarrow \ n
\end{array}
$$

**(ConstLen-Err)**

$$
\begin{array}{l}
\lnot \ \exists \ n.\ \Gamma \ \vdash \ \operatorname{ConstLen}(e)\ \Downarrow \ n\quad c\ =\ \operatorname{Code}(\mathsf{ConstLen}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ConstLen}(e)\ \Uparrow \ c
\end{array}
$$

$$
\operatorname{MembersEq}([T_{1},\ \ldots ,\ T_{n}],\ [U_{1},\ \ldots ,\ U_{n}])\ \Leftrightarrow \ \exists \ U'.\ \operatorname{Permutation}(U',\ [U_{1},\ \ldots ,\ U_{n}])\ \land \ \forall \ i.\ 0\ \le \ i\ <\ n\ \Rightarrow \ \Gamma \ \vdash \ T_{i}\ \equiv \ U'[i]
$$

**(T-Equiv-Prim)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePrim}(n)\quad U\ =\ \operatorname{TypePrim}(n) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Perm)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePerm}(p,\ T_{0})\quad U\ =\ \operatorname{TypePerm}(p,\ U_{0})\quad \Gamma \ \vdash \ T_{0}\ \equiv \ U_{0} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Tuple)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}])\quad U\ =\ \operatorname{TypeTuple}([U_{1},\ \ldots ,\ U_{n}])\quad \forall \ i,\ \Gamma \ \vdash \ T_{i}\ \equiv \ U_{i} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Array)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeArray}(T_{0},\ e_{0})\quad U\ =\ \operatorname{TypeArray}(U_{0},\ e_{1})\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e_{0})\ \Downarrow \ n\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e_{1})\ \Downarrow \ n\quad \Gamma \ \vdash \ T_{0}\ \equiv \ U_{0} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Slice)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeSlice}(T_{0})\quad U\ =\ \operatorname{TypeSlice}(U_{0})\quad \Gamma \ \vdash \ T_{0}\ \equiv \ U_{0} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Func)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeFunc}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ],\ R)\quad U\ =\ \operatorname{TypeFunc}([\langle m_{1},\ U_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ U_{n}\rangle ],\ S)\quad \forall \ i,\ \Gamma \ \vdash \ T_{i}\ \equiv \ U_{i}\quad \Gamma \ \vdash \ R\ \equiv \ S \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Closure)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeClosure}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ],\ R,\ D)\quad U\ =\ \operatorname{TypeClosure}([\langle m_{1},\ U_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ U_{n}\rangle ],\ S,\ D)\quad \forall \ i,\ \Gamma \ \vdash \ T_{i}\ \equiv \ U_{i}\quad \Gamma \ \vdash \ R\ \equiv \ S \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Union)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad U\ =\ \operatorname{TypeUnion}([U_{1},\ \ldots ,\ U_{n}])\quad \operatorname{MembersEq}([T_{1},\ \ldots ,\ T_{n}],\ [U_{1},\ \ldots ,\ U_{n}]) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Path)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad U\ =\ \operatorname{TypePath}(p) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-ModalState)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\quad U\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-String)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeString}(\mathsf{st})\quad U\ =\ \operatorname{TypeString}(\mathsf{st}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Bytes)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeBytes}(\mathsf{st})\quad U\ =\ \operatorname{TypeBytes}(\mathsf{st}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Range)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRange}(T_{0})\quad U\ =\ \operatorname{TypeRange}(U_{0})\quad \Gamma \ \vdash \ T_{0}\ \equiv \ U_{0} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-RangeInclusive)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRangeInclusive}(T_{0})\quad U\ =\ \operatorname{TypeRangeInclusive}(U_{0})\quad \Gamma \ \vdash \ T_{0}\ \equiv \ U_{0} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-RangeFrom)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRangeFrom}(T_{0})\quad U\ =\ \operatorname{TypeRangeFrom}(U_{0})\quad \Gamma \ \vdash \ T_{0}\ \equiv \ U_{0} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-RangeTo)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRangeTo}(T_{0})\quad U\ =\ \operatorname{TypeRangeTo}(U_{0})\quad \Gamma \ \vdash \ T_{0}\ \equiv \ U_{0} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-RangeToInclusive)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRangeToInclusive}(T_{0})\quad U\ =\ \operatorname{TypeRangeToInclusive}(U_{0})\quad \Gamma \ \vdash \ T_{0}\ \equiv \ U_{0} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-RangeFull)**
T = TypeRangeFull    U = TypeRangeFull

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Ptr)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePtr}(T_{0},\ s)\quad U\ =\ \operatorname{TypePtr}(U_{0},\ s)\quad \Gamma \ \vdash \ T_{0}\ \equiv \ U_{0} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-RawPtr)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRawPtr}(q,\ T_{0})\quad U\ =\ \operatorname{TypeRawPtr}(q,\ U_{0})\quad \Gamma \ \vdash \ T_{0}\ \equiv \ U_{0} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Dynamic)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeDynamic}(p)\quad U\ =\ \operatorname{TypeDynamic}(p) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Apply)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeApply}(\mathsf{path},\ [T_{1},\ \ldots ,\ T_{n}])\quad U\ =\ \operatorname{TypeApply}(\mathsf{path},\ [U_{1},\ \ldots ,\ U_{n}])\quad \forall \ i,\ \Gamma \ \vdash \ T_{i}\ \equiv \ U_{i} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Opaque)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeOpaque}(\mathsf{path})\quad U\ =\ \operatorname{TypeOpaque}(\mathsf{path}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Refine)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRefine}(T_{0},\ P_{1})\quad U\ =\ \operatorname{TypeRefine}(U_{0},\ P_{2})\quad \Gamma \ \vdash \ T_{0}\ \equiv \ U_{0}\quad \operatorname{PredicateEquiv}(P_{1},\ P_{2}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

$$
\operatorname{PredicateEquiv}(P_{1},\ P_{2})\ \Leftrightarrow \ \forall \ \sigma .\ (\operatorname{Eval}(P_{1},\ \sigma )\ =\ \mathsf{true}\ \Leftrightarrow \ \operatorname{Eval}(P_{2},\ \sigma )\ =\ \mathsf{true})
$$

**(T-Equiv-Refine-Norm)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRefine}(\operatorname{TypeRefine}(T_{0},\ P_{1}),\ P_{2})\quad U\ =\ \operatorname{TypeRefine}(T_{0},\ P_{1}\ \land \ P_{2}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Refl)**

$$
\begin{array}{l}
T\ \in \ 𝒯 \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \equiv \ T
\end{array}
$$

**(T-Equiv-Sym)**

$$
\begin{array}{l}
\Gamma \ \vdash \ T\ \equiv \ U \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ U\ \equiv \ T
\end{array}
$$

**(T-Equiv-Trans)**

$$
\begin{array}{l}
\Gamma \ \vdash \ T\ \equiv \ U\quad \Gamma \ \vdash \ U\ \equiv \ V \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \equiv \ V
\end{array}
$$

## 8.2 Subtyping

$$
\mathsf{SubtypingJudg}\ =\ \{\mathrel{<:} \}
$$

$$
\begin{array}{l}
\forall \ T,\ U\ \in \ \mathsf{IntTypes}.\ T\ \ne \ U\ \Rightarrow \ \lnot (\Gamma \ \vdash \ T\ \mathrel{<:} \ U) \\
\forall \ T,\ U\ \in \ \mathsf{FloatTypes}.\ T\ \ne \ U\ \Rightarrow \ \lnot (\Gamma \ \vdash \ T\ \mathrel{<:} \ U)
\end{array}
$$

Permission admissibility is defined by Chapter 10. This chapter defines only type subtyping. For permission-qualified types, general subtyping requires permission equality.

**(Sub-Perm)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePerm}(p,\ T_{0})\quad U\ =\ \operatorname{TypePerm}(q,\ U_{0})\quad p\ =\ q\quad \Gamma \ \vdash \ T_{0}\ \mathrel{<:} \ U_{0} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

**(Sub-Never)**

$$
\begin{array}{l}
T\ \in \ 𝒯 \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypePrim}(\texttt{"!"})\ \mathrel{<:} \ T
\end{array}
$$

**(Sub-Tuple)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}])\quad U\ =\ \operatorname{TypeTuple}([U_{1},\ \ldots ,\ U_{n}])\quad \forall \ i,\ \Gamma \ \vdash \ T_{i}\ \mathrel{<:} \ U_{i} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

**(Sub-Array)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeArray}(T_{0},\ e_{0})\quad U\ =\ \operatorname{TypeArray}(U_{0},\ e_{1})\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e_{0})\ \Downarrow \ n\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e_{1})\ \Downarrow \ n\quad \Gamma \ \vdash \ T_{0}\ \equiv \ U_{0} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

**(Sub-Slice)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeSlice}(T_{0})\quad U\ =\ \operatorname{TypeSlice}(U_{0})\quad \Gamma \ \vdash \ T_{0}\ \equiv \ U_{0} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

**(Sub-Range)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRange}(T_{0})\quad U\ =\ \operatorname{TypeRange}(U_{0})\quad \Gamma \ \vdash \ T_{0}\ \mathrel{<:} \ U_{0} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

**(Sub-RangeInclusive)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRangeInclusive}(T_{0})\quad U\ =\ \operatorname{TypeRangeInclusive}(U_{0})\quad \Gamma \ \vdash \ T_{0}\ \mathrel{<:} \ U_{0} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

**(Sub-RangeFrom)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRangeFrom}(T_{0})\quad U\ =\ \operatorname{TypeRangeFrom}(U_{0})\quad \Gamma \ \vdash \ T_{0}\ \mathrel{<:} \ U_{0} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

**(Sub-RangeTo)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRangeTo}(T_{0})\quad U\ =\ \operatorname{TypeRangeTo}(U_{0})\quad \Gamma \ \vdash \ T_{0}\ \mathrel{<:} \ U_{0} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

**(Sub-RangeToInclusive)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRangeToInclusive}(T_{0})\quad U\ =\ \operatorname{TypeRangeToInclusive}(U_{0})\quad \Gamma \ \vdash \ T_{0}\ \mathrel{<:} \ U_{0} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

**(Sub-RangeFull)**
T = TypeRangeFull    U = TypeRangeFull

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

**(Sub-Ptr-State)**

$$
\begin{array}{l}
s\ \in \ \{\texttt{Valid},\ \texttt{Null}\} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypePtr}(T,\ s)\ \mathrel{<:} \ \operatorname{TypePtr}(T,\ \bot )
\end{array}
$$

**(Sub-Modal-Niche)**

$$
\begin{array}{l}
\operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad S\ \in \ \operatorname{States}(M)\quad \operatorname{NicheCompatible}(\mathsf{modal}_{\mathsf{ref}},\ S) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\ \mathrel{<:} \ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})
\end{array}
$$

**(Sub-Func)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeFunc}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ],\ R)\quad U\ =\ \operatorname{TypeFunc}([\langle m_{1},\ U_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ U_{n}\rangle ],\ S)\quad \forall \ i,\ \Gamma \ \vdash \ U_{i}\ \mathrel{<:} \ T_{i}\quad \Gamma \ \vdash \ R\ \mathrel{<:} \ S \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

**(Sub-Closure)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeClosure}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ],\ R,\ D)\quad U\ =\ \operatorname{TypeClosure}([\langle m_{1},\ U_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ U_{n}\rangle ],\ S,\ D)\quad \forall \ i,\ \Gamma \ \vdash \ U_{i}\ \mathrel{<:} \ T_{i}\quad \Gamma \ \vdash \ R\ \mathrel{<:} \ S \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

**(Sub-Async)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(T)\ =\ \langle \mathsf{Out}_{1},\ \mathsf{In}_{1},\ \mathsf{Result}_{1},\ E_{1}\rangle \quad \operatorname{AsyncSig}(U)\ =\ \langle \mathsf{Out}_{2},\ \mathsf{In}_{2},\ \mathsf{Result}_{2},\ E_{2}\rangle  \\
\Gamma \ \vdash \ \mathsf{Out}_{1}\ \mathrel{<:} \ \mathsf{Out}_{2}\quad \Gamma \ \vdash \ \mathsf{In}_{2}\ \mathrel{<:} \ \mathsf{In}_{1}\quad \Gamma \ \vdash \ \mathsf{Result}_{1}\ \mathrel{<:} \ \mathsf{Result}_{2}\quad \Gamma \ \vdash \ E_{1}\ \mathrel{<:} \ E_{2} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

$$
\operatorname{Member}(T,\ U)\ \Leftrightarrow \ U\ =\ \operatorname{TypeUnion}([U_{1},\ \ldots ,\ U_{n}])\ \land \ \exists \ i.\ \Gamma \ \vdash \ T\ \equiv \ U_{i}
$$

**(Sub-Member-Union)**
Member(T, U)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

**(Sub-Union-Width)**

$$
\begin{array}{l}
U_{1}\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad U_{2}\ =\ \operatorname{TypeUnion}([U_{1}',\ \ldots ,\ U_{m}'])\quad \forall \ i,\ \operatorname{Member}(T_{i},\ U_{2}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ U_{1}\ \mathrel{<:} \ U_{2}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{Variance}\ =\ \{\texttt{+},\ \texttt{-},\ \texttt{=},\ \texttt{+/-}\} \\
\mathsf{VarianceOf}\ :\ \mathsf{TypePath}\ \times \ \mathbb{N} \ \to \ \mathsf{Variance} \\
\operatorname{VarianceOf}(\mathsf{path},\ i)\ =\ v\ \Leftrightarrow \ \operatorname{GenericDecl}(\mathsf{path})\ =\ \langle \mathsf{params},\ \_\rangle \ \land \ \mathsf{params}[i].\mathsf{variance}\ =\ v
\end{array}
$$

$$
\begin{array}{l}
\operatorname{VarianceSatisfied}(v,\ T,\ U)\ \Leftrightarrow  \\
\ (v\ =\ \texttt{+}\ \land \ \Gamma \ \vdash \ T\ \mathrel{<:} \ U)\ \lor  \\
\ (v\ =\ \texttt{-}\ \land \ \Gamma \ \vdash \ U\ \mathrel{<:} \ T)\ \lor  \\
\ (v\ =\ \texttt{=}\ \land \ \Gamma \ \vdash \ T\ \equiv \ U)\ \lor  \\
\ (v\ =\ \texttt{+/-})
\end{array}
$$

**(Sub-Generic)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeApply}(\mathsf{path},\ [T_{1},\ \ldots ,\ T_{n}])\quad U\ =\ \operatorname{TypeApply}(\mathsf{path},\ [U_{1},\ \ldots ,\ U_{n}])\quad \forall \ i,\ \operatorname{VarianceSatisfied}(\operatorname{VarianceOf}(\mathsf{path},\ i),\ T_{i},\ U_{i}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

**(Sub-Generic-Invariant-Err)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeApply}(\mathsf{path},\ [T_{1},\ \ldots ,\ T_{n}])\quad U\ =\ \operatorname{TypeApply}(\mathsf{path},\ [U_{1},\ \ldots ,\ U_{n}])\quad \exists \ i,\ \operatorname{VarianceOf}(\mathsf{path},\ i)\ =\ \texttt{=}\ \land \ \lnot (\Gamma \ \vdash \ T_{i}\ \equiv \ U_{i})\quad c\ =\ \operatorname{Code}(E-\mathsf{TYP}-1520) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \mathrel{<:} \ U\ \Uparrow \ c
\end{array}
$$

**(Sub-Generic-Covariant-Err)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeApply}(\mathsf{path},\ [T_{1},\ \ldots ,\ T_{n}])\quad U\ =\ \operatorname{TypeApply}(\mathsf{path},\ [U_{1},\ \ldots ,\ U_{n}])\quad \exists \ i,\ \operatorname{VarianceOf}(\mathsf{path},\ i)\ =\ \texttt{+}\ \land \ \lnot (\Gamma \ \vdash \ T_{i}\ \mathrel{<:} \ U_{i})\quad c\ =\ \operatorname{Code}(E-\mathsf{TYP}-1521) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \mathrel{<:} \ U\ \Uparrow \ c
\end{array}
$$

**(Sub-Generic-Contravariant-Err)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeApply}(\mathsf{path},\ [T_{1},\ \ldots ,\ T_{n}])\quad U\ =\ \operatorname{TypeApply}(\mathsf{path},\ [U_{1},\ \ldots ,\ U_{n}])\quad \exists \ i,\ \operatorname{VarianceOf}(\mathsf{path},\ i)\ =\ \texttt{-}\ \land \ \lnot (\Gamma \ \vdash \ U_{i}\ \mathrel{<:} \ T_{i})\quad c\ =\ \operatorname{Code}(E-\mathsf{TYP}-1521) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \mathrel{<:} \ U\ \Uparrow \ c
\end{array}
$$

**(Sub-Refl)**

$$
\begin{array}{l}
T\ \in \ 𝒯 \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \mathrel{<:} \ T
\end{array}
$$

**(Sub-Trans)**

$$
\begin{array}{l}
\Gamma \ \vdash \ T\ \mathrel{<:} \ U\quad \Gamma \ \vdash \ U\ \mathrel{<:} \ V \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \mathrel{<:} \ V
\end{array}
$$

## 8.3 Type Inference

$$
\mathsf{TypeInfJudg}\ =\ \{\Rightarrow ,\ \Leftarrow ,\ \mathsf{Solve}\}
$$

$$
\begin{array}{l}
\mathsf{Constraint}\ =\ \mathsf{Type}\ \times \ \mathsf{Type} \\
\mathsf{ConstraintSet}\ =\ \wp (\mathsf{Constraint})
\end{array}
$$

$$
\mathsf{Constraint}\ \mathsf{generation}\ \mathsf{is}\ \mathsf{feature}-\mathsf{local}.\ \mathsf{This}\ \mathsf{chapter}\ \mathsf{defines}\ \mathsf{only}\ \mathsf{the}\ \mathsf{shared}\ \mathsf{equality}-\mathsf{constraint}\ \mathsf{domain},\ \mathsf{substitution}\ \mathsf{machinery},\ \mathsf{and}\ \mathsf{solver}\ \mathsf{consumed}\ \mathsf{by}\ \mathsf{those}\ \mathsf{rules}.\ \mathsf{Rules}\ \mathsf{that}\ \mathsf{generate}\ \mathsf{no}\ \mathsf{additional}\ \mathsf{equalities}\ \mathsf{yield}\ \texttt{emptyset}.
$$

$$
\begin{array}{l}
\mathsf{TVar}\ =\ \{\alpha ,\ \beta ,\ \gamma ,\ \ldots \} \\
\operatorname{TVars}(T)\ =\ \mathsf{set}\ \mathsf{of}\ \mathsf{type}\ \mathsf{variables}\ \mathsf{occurring}\ \mathsf{in}\ T
\end{array}
$$

$$
\begin{array}{l}
\mathsf{Subst}\ =\ \mathsf{TVar}\ \rightharpoonup \ \mathsf{Type} \\
\operatorname{Dom}(\theta )\ =\ \{\alpha \ \mid \ \theta (\alpha )\ \mathsf{defined}\} \\
\mathsf{Id}\ =\ \emptyset 
\end{array}
$$

$$
\begin{array}{l}
\theta (\operatorname{TypePrim}(p))\ =\ \operatorname{TypePrim}(p) \\
\theta (\operatorname{TVar}(\alpha ))\ =\ \theta (\alpha )\ \mathsf{if}\ \alpha \ \in \ \operatorname{Dom}(\theta ),\ \mathsf{else}\ \operatorname{TVar}(\alpha ) \\
\theta (\operatorname{TypeTuple}(\mathsf{Ts}))\ =\ \operatorname{TypeTuple}([\theta (T)\ \mid \ T\ \in \ \mathsf{Ts}]) \\
\theta (\operatorname{TypeArray}(T,\ n))\ =\ \operatorname{TypeArray}(\theta (T),\ n) \\
\theta (\operatorname{TypeSlice}(T))\ =\ \operatorname{TypeSlice}(\theta (T)) \\
\theta (\operatorname{TypeUnion}(\mathsf{Ts}))\ =\ \operatorname{TypeUnion}([\theta (T)\ \mid \ T\ \in \ \mathsf{Ts}]) \\
\theta (\operatorname{TypeFunc}(\mathsf{ps},\ R))\ =\ \operatorname{TypeFunc}([(m,\ \theta (T))\ \mid \ (m,\ T)\ \in \ \mathsf{ps}],\ \theta (R)) \\
\theta (\operatorname{TypePtr}(T,\ s))\ =\ \operatorname{TypePtr}(\theta (T),\ s) \\
\theta (\operatorname{TypePerm}(p,\ T))\ =\ \operatorname{TypePerm}(p,\ \theta (T)) \\
\theta (\operatorname{TypeApply}(\mathsf{path},\ \mathsf{args}))\ =\ \operatorname{TypeApply}(\mathsf{path},\ [\theta (T)\ \mid \ T\ \in \ \mathsf{args}]) \\
\theta \ \mathsf{distributes}\ \mathsf{over}\ \mathsf{all}\ \mathsf{remaining}\ \mathsf{type}\ \mathsf{constructors}.
\end{array}
$$

$$
\theta _{1}\ \circ \ \theta _{2}\ =\ \lambda \alpha .\ \theta _{1}(\theta _{2}(\alpha ))
$$

$$
\mathsf{UnifyState}\ =\ \{\operatorname{UnifyStart}(C),\ \operatorname{UnifyStep}(C,\ \theta ),\ \operatorname{UnifyDone}(\theta ),\ \mathsf{UnifyFail}\}
$$

**(Unify-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\langle \operatorname{UnifyStart}(\emptyset )\rangle \ \to \ \langle \operatorname{UnifyDone}(\mathsf{Id})\rangle 
\end{array}
$$

**(Unify-Eq)**
T = U

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}(C,\ \theta )\rangle 
\end{array}
$$

**(Unify-Var-L)**

$$
\begin{array}{l}
T\ =\ \operatorname{TVar}(\alpha )\quad \alpha \ \notin \ \operatorname{TVars}(U) \\
\rule{18em}{0.4pt} \\
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}([\alpha \ \mapsto \ U]C,\ [\alpha \ \mapsto \ U]\ \circ \ \theta )\rangle 
\end{array}
$$

**(Unify-Var-R)**

$$
\begin{array}{l}
U\ =\ \operatorname{TVar}(\alpha )\quad \alpha \ \notin \ \operatorname{TVars}(T) \\
\rule{18em}{0.4pt} \\
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}([\alpha \ \mapsto \ T]C,\ [\alpha \ \mapsto \ T]\ \circ \ \theta )\rangle 
\end{array}
$$

**(Unify-Occurs-Fail)**

$$
\begin{array}{l}
T\ =\ \operatorname{TVar}(\alpha )\quad \alpha \ \in \ \operatorname{TVars}(U)\quad T\ \ne \ U \\
\rule{18em}{0.4pt} \\
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \mathsf{UnifyFail}\rangle 
\end{array}
$$

**(Unify-Tuple)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}])\quad U\ =\ \operatorname{TypeTuple}([U_{1},\ \ldots ,\ U_{n}]) \\
\rule{18em}{0.4pt} \\
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}(\{(T_{1},\ U_{1}),\ \ldots ,\ (T_{n},\ U_{n})\}\ \cup \ C,\ \theta )\rangle 
\end{array}
$$

**(Unify-Tuple-Fail)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}])\quad U\ =\ \operatorname{TypeTuple}([U_{1},\ \ldots ,\ U_{m}])\quad n\ \ne \ m \\
\rule{18em}{0.4pt} \\
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \mathsf{UnifyFail}\rangle 
\end{array}
$$

**(Unify-Array)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeArray}(T_{0},\ e_{0})\quad U\ =\ \operatorname{TypeArray}(U_{0},\ e_{1})\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e_{0})\ \Downarrow \ n\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e_{1})\ \Downarrow \ n \\
\rule{18em}{0.4pt} \\
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}(\{(T_{0},\ U_{0})\}\ \cup \ C,\ \theta )\rangle 
\end{array}
$$

**(Unify-Array-Len-Fail)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeArray}(T_{0},\ e_{0})\quad U\ =\ \operatorname{TypeArray}(U_{0},\ e_{1})\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e_{0})\ \Downarrow \ n_{0}\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e_{1})\ \Downarrow \ n_{1}\quad n_{0}\ \ne \ n_{1} \\
\rule{18em}{0.4pt} \\
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \mathsf{UnifyFail}\rangle 
\end{array}
$$

**(Unify-Slice)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeSlice}(T_{0})\quad U\ =\ \operatorname{TypeSlice}(U_{0}) \\
\rule{18em}{0.4pt} \\
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}(\{(T_{0},\ U_{0})\}\ \cup \ C,\ \theta )\rangle 
\end{array}
$$

**(Unify-Perm)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePerm}(p,\ T_{0})\quad U\ =\ \operatorname{TypePerm}(p,\ U_{0}) \\
\rule{18em}{0.4pt} \\
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}(\{(T_{0},\ U_{0})\}\ \cup \ C,\ \theta )\rangle 
\end{array}
$$

**(Unify-Perm-Fail)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePerm}(p,\ T_{0})\quad U\ =\ \operatorname{TypePerm}(q,\ U_{0})\quad p\ \ne \ q \\
\rule{18em}{0.4pt} \\
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \mathsf{UnifyFail}\rangle 
\end{array}
$$

**(Unify-Func)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeFunc}([(m_{1},\ T_{1}),\ \ldots ,\ (m_{n},\ T_{n})],\ R_{T}) \\
U\ =\ \operatorname{TypeFunc}([(m_{1},\ U_{1}),\ \ldots ,\ (m_{n},\ U_{n})],\ R_{U}) \\
\rule{18em}{0.4pt} \\
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}(\{(T_{1},\ U_{1}),\ \ldots ,\ (T_{n},\ U_{n}),\ (R_{T},\ R_{U})\}\ \cup \ C,\ \theta )\rangle 
\end{array}
$$

**(Unify-Func-Fail)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeFunc}(\mathsf{ps}_{T},\ R_{T})\quad U\ =\ \operatorname{TypeFunc}(\mathsf{ps}_{U},\ R_{U})\quad \lnot \ \exists \ n,\ \mathsf{vec}\{m\},\ \mathsf{vec}\{T\},\ \mathsf{vec}\{U\}.\ \mathsf{ps}_{T}\ =\ [(m_{1},\ T_{1}),\ \ldots ,\ (m_{n},\ T_{n})]\ \land \ \mathsf{ps}_{U}\ =\ [(m_{1},\ U_{1}),\ \ldots ,\ (m_{n},\ U_{n})] \\
\rule{18em}{0.4pt} \\
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \mathsf{UnifyFail}\rangle 
\end{array}
$$

**(Unify-Closure)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeClosure}([(m_{1},\ T_{1}),\ \ldots ,\ (m_{n},\ T_{n})],\ R_{T},\ D)\quad U\ =\ \operatorname{TypeClosure}([(m_{1},\ U_{1}),\ \ldots ,\ (m_{n},\ U_{n})],\ R_{U},\ D) \\
\rule{18em}{0.4pt} \\
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}(\{(T_{1},\ U_{1}),\ \ldots ,\ (T_{n},\ U_{n}),\ (R_{T},\ R_{U})\}\ \cup \ C,\ \theta )\rangle 
\end{array}
$$

**(Unify-Closure-Fail)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeClosure}(\mathsf{ps}_{T},\ R_{T},\ D_{T})\quad U\ =\ \operatorname{TypeClosure}(\mathsf{ps}_{U},\ R_{U},\ D_{U})\quad (D_{T}\ \ne \ D_{U}\ \lor \ \lnot \ \exists \ n,\ \mathsf{vec}\{m\},\ \mathsf{vec}\{T\},\ \mathsf{vec}\{U\}.\ \mathsf{ps}_{T}\ =\ [(m_{1},\ T_{1}),\ \ldots ,\ (m_{n},\ T_{n})]\ \land \ \mathsf{ps}_{U}\ =\ [(m_{1},\ U_{1}),\ \ldots ,\ (m_{n},\ U_{n})]) \\
\rule{18em}{0.4pt} \\
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \mathsf{UnifyFail}\rangle 
\end{array}
$$

**(Unify-Ptr)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePtr}(T_{0},\ s)\quad U\ =\ \operatorname{TypePtr}(U_{0},\ s) \\
\rule{18em}{0.4pt} \\
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}(\{(T_{0},\ U_{0})\}\ \cup \ C,\ \theta )\rangle 
\end{array}
$$

**(Unify-Ptr-State-Fail)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePtr}(T_{0},\ s_{0})\quad U\ =\ \operatorname{TypePtr}(U_{0},\ s_{1})\quad s_{0}\ \ne \ s_{1} \\
\rule{18em}{0.4pt} \\
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \mathsf{UnifyFail}\rangle 
\end{array}
$$

**(Unify-RawPtr)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRawPtr}(q,\ T_{0})\quad U\ =\ \operatorname{TypeRawPtr}(q,\ U_{0}) \\
\rule{18em}{0.4pt} \\
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}(\{(T_{0},\ U_{0})\}\ \cup \ C,\ \theta )\rangle 
\end{array}
$$

**(Unify-RawPtr-Qual-Fail)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRawPtr}(q_{0},\ T_{0})\quad U\ =\ \operatorname{TypeRawPtr}(q_{1},\ U_{0})\quad q_{0}\ \ne \ q_{1} \\
\rule{18em}{0.4pt} \\
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \mathsf{UnifyFail}\rangle 
\end{array}
$$

**(Unify-Apply)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeApply}(\mathsf{path},\ [T_{1},\ \ldots ,\ T_{n}])\quad U\ =\ \operatorname{TypeApply}(\mathsf{path},\ [U_{1},\ \ldots ,\ U_{n}]) \\
\rule{18em}{0.4pt} \\
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}(\{(T_{1},\ U_{1}),\ \ldots ,\ (T_{n},\ U_{n})\}\ \cup \ C,\ \theta )\rangle 
\end{array}
$$

**(Unify-Apply-Fail)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeApply}(\mathsf{path}_{T},\ \mathsf{Ts})\quad U\ =\ \operatorname{TypeApply}(\mathsf{path}_{U},\ \mathsf{Us})\quad (\mathsf{path}_{T}\ \ne \ \mathsf{path}_{U}\ \lor \ \mid \mathsf{Ts}\mid \ \ne \ \mid \mathsf{Us}\mid ) \\
\rule{18em}{0.4pt} \\
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \mathsf{UnifyFail}\rangle 
\end{array}
$$

**(Unify-Range)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRange}(T_{0})\quad U\ =\ \operatorname{TypeRange}(U_{0}) \\
\rule{18em}{0.4pt} \\
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}(\{(T_{0},\ U_{0})\}\ \cup \ C,\ \theta )\rangle 
\end{array}
$$

**(Unify-RangeInclusive)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRangeInclusive}(T_{0})\quad U\ =\ \operatorname{TypeRangeInclusive}(U_{0}) \\
\rule{18em}{0.4pt} \\
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}(\{(T_{0},\ U_{0})\}\ \cup \ C,\ \theta )\rangle 
\end{array}
$$

**(Unify-RangeFrom)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRangeFrom}(T_{0})\quad U\ =\ \operatorname{TypeRangeFrom}(U_{0}) \\
\rule{18em}{0.4pt} \\
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}(\{(T_{0},\ U_{0})\}\ \cup \ C,\ \theta )\rangle 
\end{array}
$$

**(Unify-RangeTo)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRangeTo}(T_{0})\quad U\ =\ \operatorname{TypeRangeTo}(U_{0}) \\
\rule{18em}{0.4pt} \\
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}(\{(T_{0},\ U_{0})\}\ \cup \ C,\ \theta )\rangle 
\end{array}
$$

**(Unify-RangeToInclusive)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRangeToInclusive}(T_{0})\quad U\ =\ \operatorname{TypeRangeToInclusive}(U_{0}) \\
\rule{18em}{0.4pt} \\
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}(\{(T_{0},\ U_{0})\}\ \cup \ C,\ \theta )\rangle 
\end{array}
$$

**(Unify-Refine)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRefine}(T_{0},\ \mathsf{pred})\quad U\ =\ \operatorname{TypeRefine}(U_{0},\ \mathsf{pred}) \\
\rule{18em}{0.4pt} \\
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}(\{(T_{0},\ U_{0})\}\ \cup \ C,\ \theta )\rangle 
\end{array}
$$

**(Unify-Refine-Pred-Fail)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRefine}(T_{0},\ \mathsf{pred}_{T})\quad U\ =\ \operatorname{TypeRefine}(U_{0},\ \mathsf{pred}_{U})\quad \mathsf{pred}_{T}\ \ne \ \mathsf{pred}_{U} \\
\rule{18em}{0.4pt} \\
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \mathsf{UnifyFail}\rangle 
\end{array}
$$

**(Unify-Prim-Fail)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePrim}(p_{T})\quad U\ =\ \operatorname{TypePrim}(p_{U})\quad p_{T}\ \ne \ p_{U} \\
\rule{18em}{0.4pt} \\
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \mathsf{UnifyFail}\rangle 
\end{array}
$$

**(Unify-Rigid-Fail)**

$$
\begin{array}{l}
((T\ =\ \operatorname{TypeUnion}(\_)\ \land \ U\ =\ \operatorname{TypeUnion}(\_))\ \lor  \\
\ (T\ =\ \operatorname{TypePath}(\_)\ \land \ U\ =\ \operatorname{TypePath}(\_))\ \lor  \\
\ (T\ =\ \operatorname{TypeString}(\_)\ \land \ U\ =\ \operatorname{TypeString}(\_))\ \lor  \\
\ (T\ =\ \operatorname{TypeBytes}(\_)\ \land \ U\ =\ \operatorname{TypeBytes}(\_))\ \lor  \\
\ (T\ =\ \operatorname{TypeDynamic}(\_)\ \land \ U\ =\ \operatorname{TypeDynamic}(\_))\ \lor  \\
\ (T\ =\ \operatorname{TypeOpaque}(\_)\ \land \ U\ =\ \operatorname{TypeOpaque}(\_))\ \lor  \\
\ (T\ =\ \operatorname{TypeModalState}(\_,\ \_)\ \land \ U\ =\ \operatorname{TypeModalState}(\_,\ \_))\ \lor  \\
\ (T\ =\ \mathsf{TypeRangeFull}\ \land \ U\ =\ \mathsf{TypeRangeFull}))\quad T\ \ne \ U \\
\rule{18em}{0.4pt} \\
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \mathsf{UnifyFail}\rangle 
\end{array}
$$

**(Unify-Ctor-Mismatch)**

$$
\begin{array}{l}
\operatorname{TypeCtor}(T)\ \ne \ \operatorname{TypeCtor}(U)\quad T\ \notin \ \mathsf{TVar}\quad U\ \notin \ \mathsf{TVar} \\
\rule{18em}{0.4pt} \\
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \mathsf{UnifyFail}\rangle 
\end{array}
$$

**(Unify-Ok)**

$$
\begin{array}{l}
\langle \operatorname{UnifyStart}(C)\rangle \ \to *\ \langle \operatorname{UnifyDone}(\theta )\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Unify}(C)\ \Downarrow \ \theta 
\end{array}
$$

**(Unify-Err)**

$$
\begin{array}{l}
\langle \operatorname{UnifyStart}(C)\rangle \ \to *\ \langle \mathsf{UnifyFail}\rangle \quad c\ =\ \operatorname{Code}(\mathsf{Unify}-\mathsf{Fail}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Unify}(C)\ \Uparrow \ c
\end{array}
$$

**(Solve-Unify)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Unify}(C)\ \Downarrow \ \theta  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Solve}(C)\ \Downarrow \ \theta 
\end{array}
$$

**(Solve-Fail)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Unify}(C)\ \Uparrow \ c \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Solve}(C)\ \Uparrow \ c
\end{array}
$$

**(Syn-Expr)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ e\ \Rightarrow \ T\ \dashv \ \emptyset 
\end{array}
$$

**(Syn-Ident)**

$$
\begin{array}{l}
(x\ :\ T)\ \in \ \Gamma  \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Identifier}(x)\ \Rightarrow \ T\ \dashv \ \emptyset 
\end{array}
$$

**(Syn-Unit)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{TupleExpr}([])\ \Rightarrow \ \operatorname{TypePrim}(\texttt{"()"})\ \dashv \ \emptyset 
\end{array}
$$

**(Syn-Tuple)**

$$
\begin{array}{l}
n\ \ge \ 1\quad \forall \ i,\ \Gamma ;\ R;\ L\ \vdash \ e_{i}\ \Rightarrow \ T_{i}\ \dashv \ C_{i} \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{TupleExpr}([e_{1},\ \ldots ,\ e_{n}])\ \Rightarrow \ \operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}])\ \dashv \ \bigcup_{i} \ C_{i}
\end{array}
$$

**(Syn-Call)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{callee}\ \Rightarrow \ \operatorname{TypeFunc}(\mathsf{params},\ R_{c})\ \dashv \ C_{0}\quad \Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk_T}(\mathsf{params},\ \mathsf{args}) \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Call}(\mathsf{callee},\ \mathsf{args})\ \Rightarrow \ R_{c}\ \dashv \ C_{0}
\end{array}
$$

**(Syn-Call-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Call}(\mathsf{callee},\ \mathsf{args})\ \Uparrow \ c \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Call}(\mathsf{callee},\ \mathsf{args})\ \Rightarrow \ T\ \dashv \ C\ \Uparrow \ c
\end{array}
$$

**(Chk-Subsumption-Modal-NonNiche)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ \Rightarrow \ S\ \dashv \ C\quad \operatorname{StripPerm}(S)\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S_{s})\quad \operatorname{StripPerm}(T)\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \lnot \ \operatorname{NicheCompatible}(\mathsf{modal}_{\mathsf{ref}},\ S_{s})\quad c\ =\ \operatorname{Code}(\mathsf{Chk}-\mathsf{Subsumption}-\mathsf{Modal}-\mathsf{NonNiche}) \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ e\ \Leftarrow \ T\ \Uparrow \ c
\end{array}
$$

**(Chk-Subsumption)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ \Rightarrow \ S\ \dashv \ C\quad \Gamma \ \vdash \ S\ \mathrel{<:} \ T \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ e\ \Leftarrow \ T\ \dashv \ C
\end{array}
$$

**(Chk-Null-Ptr)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePtr}(U,\ s)\quad s\ \in \ \{\texttt{Null},\ \bot \} \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \mathsf{PtrNullExpr}\ \Leftarrow \ T\ \dashv \ \emptyset 
\end{array}
$$

$$
\operatorname{PtrNullExpected}(T)\ \Leftrightarrow \ T\ =\ \operatorname{TypePtr}(U,\ s)\ \land \ s\ \in \ \{\texttt{Null},\ \bot \}
$$

**(Syn-PtrNull-Err)**

$$
\begin{array}{l}
c\ =\ \operatorname{Code}(\mathsf{PtrNull}-\mathsf{Infer}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \mathsf{PtrNullExpr}\ \Rightarrow \ T\ \dashv \ C\ \Uparrow \ c
\end{array}
$$

**(Chk-PtrNull-Err)**

$$
\begin{array}{l}
\lnot \ \operatorname{PtrNullExpected}(T)\quad c\ =\ \operatorname{Code}(\mathsf{PtrNull}-\mathsf{Infer}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \mathsf{PtrNullExpr}\ \Leftarrow \ T\ \dashv \ C\ \Uparrow \ c
\end{array}
$$

Feature-local synthesis and checking rules are owned by the corresponding feature chapters. This chapter owns the shared unification, substitution, and judgment framework those rules consume.

## 8.4 Metatheoretic Properties

This subsection states the key metatheoretic properties that the Ultraviolet type system is designed to satisfy. Formal proofs are deferred to supplementary materials.

**(Progress)**

$$
\mathsf{If}\ \Gamma \ \vdash \ e\ :\ T\ \mathsf{and}\ \texttt{e}\ \mathsf{is}\ \mathsf{not}\ a\ \mathsf{value},\ \mathsf{then}\ \mathsf{either}:
$$
1. `e` can take a step.
2. `e` is blocked on an external operation.
3. `e` panics.

**(Preservation)**

$$
\mathsf{If}\ \Gamma \ \vdash \ e\ :\ T\ \mathsf{and}\ \texttt{e -> e'},\ \mathsf{then}\ \Gamma \ \vdash \ e'\ :\ T.
$$

**(No-Use-After-Free)**

$$
A\ \mathsf{binding}\ \mathsf{in}\ \mathsf{state}\ \texttt{Moved}\ \mathsf{or}\ \texttt{PartiallyMoved(F)}\ \mathsf{where}\ \texttt{f in F}\ \mathsf{cannot}\ \mathsf{be}\ \mathsf{read}\ \mathsf{or}\ \mathsf{moved}\ \mathsf{from}.
$$

**(No-Double-Free)**
Each responsible binding is dropped exactly once when it goes out of scope.

**(No-Dangling-Pointers)**

$$
A\ \mathsf{pointer}\ \texttt{Ptr<T>@Valid}\ \mathsf{always}\ \mathsf{references}\ \mathsf{valid}\ \mathsf{storage}.\ A\ \mathsf{pointer}\ \mathsf{with}\ \mathsf{provenance}\ \texttt{pi}\ \mathsf{cannot}\ \mathsf{escape}\ \mathsf{to}\ \mathsf{storage}\ \mathsf{with}\ \mathsf{longer}\ \mathsf{lifetime}\ \texttt{pi'}\ \mathsf{where}\ \texttt{pi < pi'}.
$$

**(Exclusivity-Invariant)**
If a binding `x` has permission `unique` and is in state `Active`, then no other live path exists to the same storage location.

**(Permission-Preservation)**
Permissions are preserved as permission regimes. Admissibility at a use site MUST NOT create a weaker alias or convert a `unique` binding into `shared` or `const`.

**(State-Determinism)**

$$
\mathsf{At}\ \mathsf{each}\ \mathsf{program}\ \mathsf{point},\ \mathsf{every}\ \mathsf{binding}\ \mathsf{has}\ \mathsf{exactly}\ \mathsf{one}\ \mathsf{state}\ \mathsf{in}\ \texttt{\{Valid, Moved, PartiallyMoved(F)\}}.
$$

**(No-Resurrection)**
A binding in state `Moved` cannot transition back to `Valid` except through reassignment of a `var` binding.

**(Data-Race-Freedom)**
Concurrent accesses to `shared` data are serialized through the key system.

**(Fork-Join-Guarantee)**
All work items spawned within a `parallel` block complete before the block exits.

**(Key-Serialization)**
If two tasks hold keys `K₁` and `K₂` to overlapping paths with incompatible modes, the key system ensures they do not execute concurrently.

**(Async-Key-Safety)**
Keys cannot be held across `yield` or `wait` suspension points unless the `release` modifier is used.

## 8.5 Core Type Diagnostics

This section owns core type-inference and alias-cycle diagnostics that are not specific to a single feature chapter.

| Code         | Severity | Detection    | Condition                                                  |
| ------------ | -------- | ------------ | ---------------------------------------------------------- |
| `E-TYP-1506` | Error    | Compile-time | Type alias cycle detected                                  |
| `E-TYP-1520` | Error    | Compile-time | Variance violation in generic type instantiation           |
| `E-TYP-1521` | Error    | Compile-time | Invariant type parameter requires exact type match         |
| `E-TYP-1530` | Error    | Compile-time | Type inference failed; unable to determine type            |
| `E-TYP-1531` | Error    | Compile-time | Float literal explicit suffix does not match expected type |
