---
title: "8.3 Type Inference"
description: "8.3 Type Inference from 8. Type System Core of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "type-system-core"
specSection: "83-type-inference"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/type-system-core/">8. Type System Core</a>
  <span>Type System Core</span>
</div>

## 8.3 Type Inference

$$
\mathsf{TypeInfJudg}\ =\ \{\Rightarrow ,\ \Leftarrow ,\ \mathsf{Solve}\}
$$

$$
\begin{array}{l}
\mathsf{Constraint}\ =\ \mathsf{Type}\ \times \ \mathsf{Type} \\[0.16em]
\mathsf{ConstraintSet}\ =\ \wp (\mathsf{Constraint})
\end{array}
$$

Constraint generation is feature-local. This chapter defines only the shared equality-constraint domain, substitution machinery, and solver consumed by those rules. Rules that generate no additional equalities yield `∅`.

$$
\begin{array}{l}
\mathsf{TVar}\ =\ \{\alpha ,\ \beta ,\ \gamma ,\ \ldots \} \\[0.16em]
\operatorname{TVars}(T)\ =\ \mathsf{set}\ \mathsf{of}\ \mathsf{type}\ \mathsf{variables}\ \mathsf{occurring}\ \mathsf{in}\ T
\end{array}
$$

$$
\begin{array}{l}
\mathsf{Subst}\ =\ \mathsf{TVar}\ \rightharpoonup \ \mathsf{Type} \\[0.16em]
\operatorname{Dom}(\theta )\ =\ \{\alpha \ \mid \ \theta (\alpha )\ \mathsf{defined}\} \\[0.16em]
\mathsf{Id}\ =\ \emptyset 
\end{array}
$$

$$
\begin{array}{l}
\theta (\operatorname{TypePrim}(p))\ =\ \operatorname{TypePrim}(p) \\[0.16em]
\theta (\operatorname{TVar}(\alpha ))\ =\ \theta (\alpha )\ \mathsf{if}\ \alpha \ \in \ \operatorname{Dom}(\theta ),\ \mathsf{else}\ \operatorname{TVar}(\alpha ) \\[0.16em]
\theta (\operatorname{TypeTuple}(\mathsf{Ts}))\ =\ \operatorname{TypeTuple}([\theta (T)\ \mid \ T\ \in \ \mathsf{Ts}]) \\[0.16em]
\theta (\operatorname{TypeArray}(T,\ n))\ =\ \operatorname{TypeArray}(\theta (T),\ n) \\[0.16em]
\theta (\operatorname{TypeSlice}(T))\ =\ \operatorname{TypeSlice}(\theta (T)) \\[0.16em]
\theta (\operatorname{TypeUnion}(\mathsf{Ts}))\ =\ \operatorname{TypeUnion}([\theta (T)\ \mid \ T\ \in \ \mathsf{Ts}]) \\[0.16em]
\theta (\operatorname{TypeFunc}(\mathsf{ps},\ R))\ =\ \operatorname{TypeFunc}([(m,\ \theta (T))\ \mid \ (m,\ T)\ \in \ \mathsf{ps}],\ \theta (R)) \\[0.16em]
\theta (\operatorname{TypePtr}(T,\ s))\ =\ \operatorname{TypePtr}(\theta (T),\ s) \\[0.16em]
\theta (\operatorname{TypePerm}(p,\ T))\ =\ \operatorname{TypePerm}(p,\ \theta (T)) \\[0.16em]
\theta (\operatorname{TypeApply}(\mathsf{path},\ \mathsf{args}))\ =\ \operatorname{TypeApply}(\mathsf{path},\ [\theta (T)\ \mid \ T\ \in \ \mathsf{args}]) \\[0.16em]
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
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnifyStart}(\emptyset )\rangle \ \to \ \langle \operatorname{UnifyDone}(\mathsf{Id})\rangle 
\end{array}
$$

**(Unify-Eq)**

$$
\begin{array}{l}
T\ =\ U \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}(C,\ \theta )\rangle 
\end{array}
$$

**(Unify-Var-L)**

$$
\begin{array}{l}
T\ =\ \operatorname{TVar}(\alpha )\quad \alpha \ \notin \ \operatorname{TVars}(U) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}([\alpha \ \mapsto \ U]C,\ [\alpha \ \mapsto \ U]\ \circ \ \theta )\rangle 
\end{array}
$$

**(Unify-Var-R)**

$$
\begin{array}{l}
U\ =\ \operatorname{TVar}(\alpha )\quad \alpha \ \notin \ \operatorname{TVars}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}([\alpha \ \mapsto \ T]C,\ [\alpha \ \mapsto \ T]\ \circ \ \theta )\rangle 
\end{array}
$$

**(Unify-Occurs-Fail)**

$$
\begin{array}{l}
T\ =\ \operatorname{TVar}(\alpha )\quad \alpha \ \in \ \operatorname{TVars}(U)\quad T\ \ne \ U \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \mathsf{UnifyFail}\rangle 
\end{array}
$$

**(Unify-Tuple)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}])\quad U\ =\ \operatorname{TypeTuple}([U_{1},\ \ldots ,\ U_{n}]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}(\{(T_{1},\ U_{1}),\ \ldots ,\ (T_{n},\ U_{n})\}\ \cup \ C,\ \theta )\rangle 
\end{array}
$$

**(Unify-Tuple-Fail)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}])\quad U\ =\ \operatorname{TypeTuple}([U_{1},\ \ldots ,\ U_{m}])\quad n\ \ne \ m \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \mathsf{UnifyFail}\rangle 
\end{array}
$$

**(Unify-Array)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeArray}(T_{0},\ e_{0})\quad U\ =\ \operatorname{TypeArray}(U_{0},\ e_{1})\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e_{0})\ \Downarrow \ n\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e_{1})\ \Downarrow \ n \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}(\{(T_{0},\ U_{0})\}\ \cup \ C,\ \theta )\rangle 
\end{array}
$$

**(Unify-Array-Len-Fail)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeArray}(T_{0},\ e_{0})\quad U\ =\ \operatorname{TypeArray}(U_{0},\ e_{1})\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e_{0})\ \Downarrow \ n_{0}\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e_{1})\ \Downarrow \ n_{1}\quad n_{0}\ \ne \ n_{1} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \mathsf{UnifyFail}\rangle 
\end{array}
$$

**(Unify-Slice)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeSlice}(T_{0})\quad U\ =\ \operatorname{TypeSlice}(U_{0}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}(\{(T_{0},\ U_{0})\}\ \cup \ C,\ \theta )\rangle 
\end{array}
$$

**(Unify-Perm)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePerm}(p,\ T_{0})\quad U\ =\ \operatorname{TypePerm}(p,\ U_{0}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}(\{(T_{0},\ U_{0})\}\ \cup \ C,\ \theta )\rangle 
\end{array}
$$

**(Unify-Perm-Fail)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePerm}(p,\ T_{0})\quad U\ =\ \operatorname{TypePerm}(q,\ U_{0})\quad p\ \ne \ q \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \mathsf{UnifyFail}\rangle 
\end{array}
$$

**(Unify-Func)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeFunc}([(m_{1},\ T_{1}),\ \ldots ,\ (m_{n},\ T_{n})],\ R_{T}) \\[0.16em]
U\ =\ \operatorname{TypeFunc}([(m_{1},\ U_{1}),\ \ldots ,\ (m_{n},\ U_{n})],\ R_{U}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}(\{(T_{1},\ U_{1}),\ \ldots ,\ (T_{n},\ U_{n}),\ (R_{T},\ R_{U})\}\ \cup \ C,\ \theta )\rangle 
\end{array}
$$

**(Unify-Func-Fail)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeFunc}(\mathsf{ps}_{T},\ R_{T})\quad U\ =\ \operatorname{TypeFunc}(\mathsf{ps}_{U},\ R_{U})\quad \lnot \ \exists \ n,\ \mathsf{vec}\{m\},\ \mathsf{vec}\{T\},\ \mathsf{vec}\{U\}.\ \mathsf{ps}_{T}\ =\ [(m_{1},\ T_{1}),\ \ldots ,\ (m_{n},\ T_{n})]\ \land \ \mathsf{ps}_{U}\ =\ [(m_{1},\ U_{1}),\ \ldots ,\ (m_{n},\ U_{n})] \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \mathsf{UnifyFail}\rangle 
\end{array}
$$

**(Unify-Closure)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeClosure}([(m_{1},\ T_{1}),\ \ldots ,\ (m_{n},\ T_{n})],\ R_{T},\ D)\quad U\ =\ \operatorname{TypeClosure}([(m_{1},\ U_{1}),\ \ldots ,\ (m_{n},\ U_{n})],\ R_{U},\ D) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}(\{(T_{1},\ U_{1}),\ \ldots ,\ (T_{n},\ U_{n}),\ (R_{T},\ R_{U})\}\ \cup \ C,\ \theta )\rangle 
\end{array}
$$

**(Unify-Closure-Fail)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeClosure}(\mathsf{ps}_{T},\ R_{T},\ D_{T})\quad U\ =\ \operatorname{TypeClosure}(\mathsf{ps}_{U},\ R_{U},\ D_{U})\quad (D_{T}\ \ne \ D_{U}\ \lor \ \lnot \ \exists \ n,\ \mathsf{vec}\{m\},\ \mathsf{vec}\{T\},\ \mathsf{vec}\{U\}.\ \mathsf{ps}_{T}\ =\ [(m_{1},\ T_{1}),\ \ldots ,\ (m_{n},\ T_{n})]\ \land \ \mathsf{ps}_{U}\ =\ [(m_{1},\ U_{1}),\ \ldots ,\ (m_{n},\ U_{n})]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \mathsf{UnifyFail}\rangle 
\end{array}
$$

**(Unify-Ptr)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePtr}(T_{0},\ s)\quad U\ =\ \operatorname{TypePtr}(U_{0},\ s) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}(\{(T_{0},\ U_{0})\}\ \cup \ C,\ \theta )\rangle 
\end{array}
$$

**(Unify-Ptr-State-Fail)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePtr}(T_{0},\ s_{0})\quad U\ =\ \operatorname{TypePtr}(U_{0},\ s_{1})\quad s_{0}\ \ne \ s_{1} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \mathsf{UnifyFail}\rangle 
\end{array}
$$

**(Unify-RawPtr)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRawPtr}(q,\ T_{0})\quad U\ =\ \operatorname{TypeRawPtr}(q,\ U_{0}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}(\{(T_{0},\ U_{0})\}\ \cup \ C,\ \theta )\rangle 
\end{array}
$$

**(Unify-RawPtr-Qual-Fail)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRawPtr}(q_{0},\ T_{0})\quad U\ =\ \operatorname{TypeRawPtr}(q_{1},\ U_{0})\quad q_{0}\ \ne \ q_{1} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \mathsf{UnifyFail}\rangle 
\end{array}
$$

**(Unify-Apply)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeApply}(\mathsf{path},\ [T_{1},\ \ldots ,\ T_{n}])\quad U\ =\ \operatorname{TypeApply}(\mathsf{path},\ [U_{1},\ \ldots ,\ U_{n}]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}(\{(T_{1},\ U_{1}),\ \ldots ,\ (T_{n},\ U_{n})\}\ \cup \ C,\ \theta )\rangle 
\end{array}
$$

**(Unify-Apply-Fail)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeApply}(\mathsf{path}_{T},\ \mathsf{Ts})\quad U\ =\ \operatorname{TypeApply}(\mathsf{path}_{U},\ \mathsf{Us})\quad (\mathsf{path}_{T}\ \ne \ \mathsf{path}_{U}\ \lor \ \mid \mathsf{Ts}\mid \ \ne \ \mid \mathsf{Us}\mid ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \mathsf{UnifyFail}\rangle 
\end{array}
$$

**(Unify-Range)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRange}(T_{0})\quad U\ =\ \operatorname{TypeRange}(U_{0}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}(\{(T_{0},\ U_{0})\}\ \cup \ C,\ \theta )\rangle 
\end{array}
$$

**(Unify-RangeInclusive)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRangeInclusive}(T_{0})\quad U\ =\ \operatorname{TypeRangeInclusive}(U_{0}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}(\{(T_{0},\ U_{0})\}\ \cup \ C,\ \theta )\rangle 
\end{array}
$$

**(Unify-RangeFrom)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRangeFrom}(T_{0})\quad U\ =\ \operatorname{TypeRangeFrom}(U_{0}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}(\{(T_{0},\ U_{0})\}\ \cup \ C,\ \theta )\rangle 
\end{array}
$$

**(Unify-RangeTo)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRangeTo}(T_{0})\quad U\ =\ \operatorname{TypeRangeTo}(U_{0}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}(\{(T_{0},\ U_{0})\}\ \cup \ C,\ \theta )\rangle 
\end{array}
$$

**(Unify-RangeToInclusive)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRangeToInclusive}(T_{0})\quad U\ =\ \operatorname{TypeRangeToInclusive}(U_{0}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}(\{(T_{0},\ U_{0})\}\ \cup \ C,\ \theta )\rangle 
\end{array}
$$

**(Unify-Refine)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRefine}(T_{0},\ \mathsf{pred})\quad U\ =\ \operatorname{TypeRefine}(U_{0},\ \mathsf{pred}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \operatorname{UnifyStep}(\{(T_{0},\ U_{0})\}\ \cup \ C,\ \theta )\rangle 
\end{array}
$$

**(Unify-Refine-Pred-Fail)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRefine}(T_{0},\ \mathsf{pred}_{T})\quad U\ =\ \operatorname{TypeRefine}(U_{0},\ \mathsf{pred}_{U})\quad \mathsf{pred}_{T}\ \ne \ \mathsf{pred}_{U} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \mathsf{UnifyFail}\rangle 
\end{array}
$$

**(Unify-Prim-Fail)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePrim}(p_{T})\quad U\ =\ \operatorname{TypePrim}(p_{U})\quad p_{T}\ \ne \ p_{U} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \mathsf{UnifyFail}\rangle 
\end{array}
$$

**(Unify-Rigid-Fail)**

$$
\begin{array}{l}
((T\ =\ \operatorname{TypeUnion}(\_)\ \land \ U\ =\ \operatorname{TypeUnion}(\_))\ \lor  \\[0.16em]
\ (T\ =\ \operatorname{TypePath}(\_)\ \land \ U\ =\ \operatorname{TypePath}(\_))\ \lor  \\[0.16em]
\ (T\ =\ \operatorname{TypeString}(\_)\ \land \ U\ =\ \operatorname{TypeString}(\_))\ \lor  \\[0.16em]
\ (T\ =\ \operatorname{TypeBytes}(\_)\ \land \ U\ =\ \operatorname{TypeBytes}(\_))\ \lor  \\[0.16em]
\ (T\ =\ \operatorname{TypeDynamic}(\_)\ \land \ U\ =\ \operatorname{TypeDynamic}(\_))\ \lor  \\[0.16em]
\ (T\ =\ \operatorname{TypeOpaque}(\_)\ \land \ U\ =\ \operatorname{TypeOpaque}(\_))\ \lor  \\[0.16em]
\ (T\ =\ \operatorname{TypeModalState}(\_,\ \_)\ \land \ U\ =\ \operatorname{TypeModalState}(\_,\ \_))\ \lor  \\[0.16em]
\ (T\ =\ \mathsf{TypeRangeFull}\ \land \ U\ =\ \mathsf{TypeRangeFull}))\quad T\ \ne \ U \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \mathsf{UnifyFail}\rangle 
\end{array}
$$

**(Unify-Ctor-Mismatch)**

$$
\begin{array}{l}
\operatorname{TypeCtor}(T)\ \ne \ \operatorname{TypeCtor}(U)\quad T\ \notin \ \mathsf{TVar}\quad U\ \notin \ \mathsf{TVar} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnifyStep}(\{(T,\ U)\}\ \cup \ C,\ \theta )\rangle \ \to \ \langle \mathsf{UnifyFail}\rangle 
\end{array}
$$

**(Unify-Ok)**

$$
\begin{array}{l}
\langle \operatorname{UnifyStart}(C)\rangle \ \to *\ \langle \operatorname{UnifyDone}(\theta )\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Unify}(C)\ \Downarrow \ \theta 
\end{array}
$$

**(Unify-Err)**

$$
\begin{array}{l}
\langle \operatorname{UnifyStart}(C)\rangle \ \to *\ \langle \mathsf{UnifyFail}\rangle \quad c\ =\ \operatorname{Code}(\mathsf{Unify}-\mathsf{Fail}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Unify}(C)\ \Uparrow \ c
\end{array}
$$

**(Solve-Unify)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Unify}(C)\ \Downarrow \ \theta  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Solve}(C)\ \Downarrow \ \theta 
\end{array}
$$

**(Solve-Fail)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Unify}(C)\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Solve}(C)\ \Uparrow \ c
\end{array}
$$

**(Syn-Expr)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ e\ \Rightarrow \ T\ \dashv \ \emptyset 
\end{array}
$$

**(Syn-Ident)**

$$
\begin{array}{l}
(x\ :\ T)\ \in \ \Gamma  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Identifier}(x)\ \Rightarrow \ T\ \dashv \ \emptyset 
\end{array}
$$

**(Syn-Unit)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{TupleExpr}([])\ \Rightarrow \ \operatorname{TypePrim}(\texttt{"()"})\ \dashv \ \emptyset 
\end{array}
$$

**(Syn-Tuple)**

$$
\begin{array}{l}
n\ \ge \ 1\quad \forall \ i,\ \Gamma ;\ R;\ L\ \vdash \ e_{i}\ \Rightarrow \ T_{i}\ \dashv \ C_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{TupleExpr}([e_{1},\ \ldots ,\ e_{n}])\ \Rightarrow \ \operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}])\ \dashv \ \bigcup_{i} \ C_{i}
\end{array}
$$

**(Syn-Call)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{callee}\ \Rightarrow \ \operatorname{TypeFunc}(\mathsf{params},\ R_{c})\ \dashv \ C_{0}\quad \Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk_T}(\mathsf{params},\ \mathsf{args}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Call}(\mathsf{callee},\ \mathsf{args})\ \Rightarrow \ R_{c}\ \dashv \ C_{0}
\end{array}
$$

**(Syn-Call-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Call}(\mathsf{callee},\ \mathsf{args})\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Call}(\mathsf{callee},\ \mathsf{args})\ \Rightarrow \ T\ \dashv \ C\ \Uparrow \ c
\end{array}
$$

**(Chk-Subsumption-Modal-NonNiche)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ \Rightarrow \ S\ \dashv \ C\quad \operatorname{StripPerm}(S)\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S_{s})\quad \operatorname{StripPerm}(T)\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \lnot \ \operatorname{NicheCompatible}(\mathsf{modal}_{\mathsf{ref}},\ S_{s})\quad c\ =\ \operatorname{Code}(\mathsf{Chk}-\mathsf{Subsumption}-\mathsf{Modal}-\mathsf{NonNiche}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ e\ \Leftarrow \ T\ \Uparrow \ c
\end{array}
$$

**(Chk-Subsumption)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ \Rightarrow \ S\ \dashv \ C\quad \Gamma \ \vdash \ S\ \mathrel{<:} \ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ e\ \Leftarrow \ T\ \dashv \ C
\end{array}
$$

**(Chk-Null-Ptr)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePtr}(U,\ s)\quad s\ \in \ \{\texttt{Null},\ \bot \} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \mathsf{PtrNullExpr}\ \Leftarrow \ T\ \dashv \ \emptyset 
\end{array}
$$

$$
\operatorname{PtrNullExpected}(T)\ \Leftrightarrow \ T\ =\ \operatorname{TypePtr}(U,\ s)\ \land \ s\ \in \ \{\texttt{Null},\ \bot \}
$$

**(Syn-PtrNull-Err)**

$$
\begin{array}{l}
c\ =\ \operatorname{Code}(\mathsf{PtrNull}-\mathsf{Infer}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \mathsf{PtrNullExpr}\ \Rightarrow \ T\ \dashv \ C\ \Uparrow \ c
\end{array}
$$

**(Chk-PtrNull-Err)**

$$
\begin{array}{l}
\lnot \ \operatorname{PtrNullExpected}(T)\quad c\ =\ \operatorname{Code}(\mathsf{PtrNull}-\mathsf{Infer}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \mathsf{PtrNullExpr}\ \Leftarrow \ T\ \dashv \ C\ \Uparrow \ c
\end{array}
$$

Feature-local synthesis and checking rules are owned by the corresponding feature chapters. This chapter owns the shared unification, substitution, and judgment framework those rules consume.
