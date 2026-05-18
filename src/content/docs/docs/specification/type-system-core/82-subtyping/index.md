---
title: "8.2 Subtyping"
description: "8.2 Subtyping from 8. Type System Core of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "type-system-core"
specSection: "82-subtyping"
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

## 8.2 Subtyping

$$
\mathsf{SubtypingJudg}\ =\ \{\mathrel{<:} \}
$$

$$
\begin{array}{l}
\forall \ T,\ U\ \in \ \mathsf{IntTypes}.\ T\ \ne \ U\ \Rightarrow \ \lnot (\Gamma \ \vdash \ T\ \mathrel{<:} \ U) \\[0.16em]
\forall \ T,\ U\ \in \ \mathsf{FloatTypes}.\ T\ \ne \ U\ \Rightarrow \ \lnot (\Gamma \ \vdash \ T\ \mathrel{<:} \ U)
\end{array}
$$

Permission admissibility is defined by Chapter 10. This chapter defines only type subtyping. For permission-qualified types, general subtyping requires permission equality.

**(Sub-Perm)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePerm}(p,\ T_{0})\quad U\ =\ \operatorname{TypePerm}(q,\ U_{0})\quad p\ =\ q\quad \Gamma \ \vdash \ T_{0}\ \mathrel{<:} \ U_{0} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

**(Sub-Never)**

$$
\begin{array}{l}
T\ \in \ \mathcal{T}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypePrim}(\texttt{"!"})\ \mathrel{<:} \ T
\end{array}
$$

**(Sub-Tuple)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}])\quad U\ =\ \operatorname{TypeTuple}([U_{1},\ \ldots ,\ U_{n}])\quad \forall \ i,\ \Gamma \ \vdash \ T_{i}\ \mathrel{<:} \ U_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

**(Sub-Array)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeArray}(T_{0},\ e_{0})\quad U\ =\ \operatorname{TypeArray}(U_{0},\ e_{1})\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e_{0})\ \Downarrow \ n\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e_{1})\ \Downarrow \ n\quad \Gamma \ \vdash \ T_{0}\ \equiv \ U_{0} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

**(Sub-Slice)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeSlice}(T_{0})\quad U\ =\ \operatorname{TypeSlice}(U_{0})\quad \Gamma \ \vdash \ T_{0}\ \equiv \ U_{0} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

**(Sub-Range)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRange}(T_{0})\quad U\ =\ \operatorname{TypeRange}(U_{0})\quad \Gamma \ \vdash \ T_{0}\ \mathrel{<:} \ U_{0} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

**(Sub-RangeInclusive)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRangeInclusive}(T_{0})\quad U\ =\ \operatorname{TypeRangeInclusive}(U_{0})\quad \Gamma \ \vdash \ T_{0}\ \mathrel{<:} \ U_{0} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

**(Sub-RangeFrom)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRangeFrom}(T_{0})\quad U\ =\ \operatorname{TypeRangeFrom}(U_{0})\quad \Gamma \ \vdash \ T_{0}\ \mathrel{<:} \ U_{0} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

**(Sub-RangeTo)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRangeTo}(T_{0})\quad U\ =\ \operatorname{TypeRangeTo}(U_{0})\quad \Gamma \ \vdash \ T_{0}\ \mathrel{<:} \ U_{0} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

**(Sub-RangeToInclusive)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRangeToInclusive}(T_{0})\quad U\ =\ \operatorname{TypeRangeToInclusive}(U_{0})\quad \Gamma \ \vdash \ T_{0}\ \mathrel{<:} \ U_{0} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

**(Sub-RangeFull)**
T = TypeRangeFull    U = TypeRangeFull

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

**(Sub-Ptr-State)**

$$
\begin{array}{l}
s\ \in \ \{\texttt{Valid},\ \texttt{Null}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypePtr}(T,\ s)\ \mathrel{<:} \ \operatorname{TypePtr}(T,\ \bot )
\end{array}
$$

**(Sub-Modal-Niche)**

$$
\begin{array}{l}
\operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad S\ \in \ \operatorname{States}(M)\quad \operatorname{NicheCompatible}(\mathsf{modal}_{\mathsf{ref}},\ S) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\ \mathrel{<:} \ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})
\end{array}
$$

**(Sub-Func)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeFunc}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ],\ R)\quad U\ =\ \operatorname{TypeFunc}([\langle m_{1},\ U_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ U_{n}\rangle ],\ S)\quad \forall \ i,\ \Gamma \ \vdash \ U_{i}\ \mathrel{<:} \ T_{i}\quad \Gamma \ \vdash \ R\ \mathrel{<:} \ S \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

**(Sub-Closure)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeClosure}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ],\ R,\ D)\quad U\ =\ \operatorname{TypeClosure}([\langle m_{1},\ U_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ U_{n}\rangle ],\ S,\ D)\quad \forall \ i,\ \Gamma \ \vdash \ U_{i}\ \mathrel{<:} \ T_{i}\quad \Gamma \ \vdash \ R\ \mathrel{<:} \ S \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

**(Sub-Async)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(T)\ =\ \langle \mathsf{Out}_{1},\ \mathsf{In}_{1},\ \mathsf{Result}_{1},\ E_{1}\rangle \quad \operatorname{AsyncSig}(U)\ =\ \langle \mathsf{Out}_{2},\ \mathsf{In}_{2},\ \mathsf{Result}_{2},\ E_{2}\rangle  \\[0.16em]
\Gamma \ \vdash \ \mathsf{Out}_{1}\ \mathrel{<:} \ \mathsf{Out}_{2}\quad \Gamma \ \vdash \ \mathsf{In}_{2}\ \mathrel{<:} \ \mathsf{In}_{1}\quad \Gamma \ \vdash \ \mathsf{Result}_{1}\ \mathrel{<:} \ \mathsf{Result}_{2}\quad \Gamma \ \vdash \ E_{1}\ \mathrel{<:} \ E_{2} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
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
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

**(Sub-Union-Width)**

$$
\begin{array}{l}
U_{1}\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad U_{2}\ =\ \operatorname{TypeUnion}([U_{1}',\ \ldots ,\ U_{m}'])\quad \forall \ i,\ \operatorname{Member}(T_{i},\ U_{2}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ U_{1}\ \mathrel{<:} \ U_{2}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{Variance}\ =\ \{\texttt{+},\ \texttt{-},\ \texttt{=},\ \texttt{+/-}\} \\[0.16em]
\mathsf{VarianceOf}\ :\ \mathsf{TypePath}\ \times \ \mathbb{N} \ \to \ \mathsf{Variance} \\[0.16em]
\operatorname{VarianceOf}(\mathsf{path},\ i)\ =\ v\ \Leftrightarrow \ \operatorname{GenericDecl}(\mathsf{path})\ =\ \langle \mathsf{params},\ \_\rangle \ \land \ \mathsf{params}[i].\mathsf{variance}\ =\ v
\end{array}
$$

$$
\begin{array}{l}
\operatorname{VarianceSatisfied}(v,\ T,\ U)\ \Leftrightarrow  \\[0.16em]
\ (v\ =\ \texttt{+}\ \land \ \Gamma \ \vdash \ T\ \mathrel{<:} \ U)\ \lor  \\[0.16em]
\ (v\ =\ \texttt{-}\ \land \ \Gamma \ \vdash \ U\ \mathrel{<:} \ T)\ \lor  \\[0.16em]
\ (v\ =\ \texttt{=}\ \land \ \Gamma \ \vdash \ T\ \equiv \ U)\ \lor  \\[0.16em]
\ (v\ =\ \texttt{+/-})
\end{array}
$$

**(Sub-Generic)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeApply}(\mathsf{path},\ [T_{1},\ \ldots ,\ T_{n}])\quad U\ =\ \operatorname{TypeApply}(\mathsf{path},\ [U_{1},\ \ldots ,\ U_{n}])\quad \forall \ i,\ \operatorname{VarianceSatisfied}(\operatorname{VarianceOf}(\mathsf{path},\ i),\ T_{i},\ U_{i}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

**(Sub-Generic-Invariant-Err)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeApply}(\mathsf{path},\ [T_{1},\ \ldots ,\ T_{n}])\quad U\ =\ \operatorname{TypeApply}(\mathsf{path},\ [U_{1},\ \ldots ,\ U_{n}])\quad \exists \ i,\ \operatorname{VarianceOf}(\mathsf{path},\ i)\ =\ \texttt{=}\ \land \ \lnot (\Gamma \ \vdash \ T_{i}\ \equiv \ U_{i})\quad c\ =\ \operatorname{Code}(E-\mathsf{TYP}-1520) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathrel{<:} \ U\ \Uparrow \ c
\end{array}
$$

**(Sub-Generic-Covariant-Err)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeApply}(\mathsf{path},\ [T_{1},\ \ldots ,\ T_{n}])\quad U\ =\ \operatorname{TypeApply}(\mathsf{path},\ [U_{1},\ \ldots ,\ U_{n}])\quad \exists \ i,\ \operatorname{VarianceOf}(\mathsf{path},\ i)\ =\ \texttt{+}\ \land \ \lnot (\Gamma \ \vdash \ T_{i}\ \mathrel{<:} \ U_{i})\quad c\ =\ \operatorname{Code}(E-\mathsf{TYP}-1521) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathrel{<:} \ U\ \Uparrow \ c
\end{array}
$$

**(Sub-Generic-Contravariant-Err)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeApply}(\mathsf{path},\ [T_{1},\ \ldots ,\ T_{n}])\quad U\ =\ \operatorname{TypeApply}(\mathsf{path},\ [U_{1},\ \ldots ,\ U_{n}])\quad \exists \ i,\ \operatorname{VarianceOf}(\mathsf{path},\ i)\ =\ \texttt{-}\ \land \ \lnot (\Gamma \ \vdash \ U_{i}\ \mathrel{<:} \ T_{i})\quad c\ =\ \operatorname{Code}(E-\mathsf{TYP}-1521) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathrel{<:} \ U\ \Uparrow \ c
\end{array}
$$

**(Sub-Refl)**

$$
\begin{array}{l}
T\ \in \ \mathcal{T}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathrel{<:} \ T
\end{array}
$$

**(Sub-Trans)**

$$
\begin{array}{l}
\Gamma \ \vdash \ T\ \mathrel{<:} \ U\quad \Gamma \ \vdash \ U\ \mathrel{<:} \ V \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathrel{<:} \ V
\end{array}
$$
