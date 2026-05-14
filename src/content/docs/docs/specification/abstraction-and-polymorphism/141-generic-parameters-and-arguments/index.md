---
title: "14.1 Generic Parameters and Arguments"
description: "14.1 Generic Parameters and Arguments from 14. Abstraction and Polymorphism of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "abstraction-and-polymorphism"
specSection: "141-generic-parameters-and-arguments"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/abstraction-and-polymorphism/">14. Abstraction and Polymorphism</a>
  <span>Abstraction and Polymorphism</span>
</div>

## 14.1 Generic Parameters and Arguments

### 14.1.1 Syntax

```text
generic_params       ::= "<" generic_param (";" generic_param)* ">"
generic_param        ::= identifier ("<:" class_bound ("," class_bound)*)? ("=" type)?
generic_args         ::= "<" type ("," type)* ","? ">"
predicate_clause     ::= "|:" predicate_req (terminator predicate_req)* terminator?
predicate_req        ::= ("Bitcopy" | "Clone" | "Drop" | "FfiSafe") "(" type ")"
```

Trailing commas in `generic_args` are permitted only when `TrailingCommaAllowed` (§5.5). A trailing comma does not denote an additional type argument.

Inline bounds introduced by `<:` are class bounds only. Predicate requirements belong to `predicate_clause`.

### 14.1.2 Parsing

**(Parse-GenericArgs)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"<"})\quad \Gamma \ \vdash \ \operatorname{ParseTypeList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{args})\quad \operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{">"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseGenericArgs}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \mathsf{args})
\end{array}
$$

**(Parse-GenericArgsOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"<"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseGenericArgsOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-GenericArgsOpt-Yes)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseGenericArgs}(P)\ \Downarrow \ (P_{1},\ \mathsf{args}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseGenericArgsOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{args})
\end{array}
$$

**(Parse-GenericParamsOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"<"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseGenericParamsOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-GenericParamsOpt-Yes)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseGenericParams}(P)\ \Downarrow \ (P_{1},\ \mathsf{params}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseGenericParamsOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{params})
\end{array}
$$

**(Parse-GenericParams)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"<"})\quad \Gamma \ \vdash \ \operatorname{ParseTypeParam}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ p_{1})\quad \Gamma \ \vdash \ \operatorname{ParseTypeParamTail}(P_{1},\ [p_{1}])\ \Downarrow \ (P_{2},\ \mathsf{ps})\quad \operatorname{IsOp}(\operatorname{Tok}(P_{2}),\ \texttt{">"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseGenericParams}(P)\ \Downarrow \ (\operatorname{Advance}(P_{2}),\ \mathsf{ps})
\end{array}
$$

**(Parse-TypeParamTail-End)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{";"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseTypeParamTail}(P,\ \mathsf{ps})\ \Downarrow \ (P,\ \mathsf{ps})
\end{array}
$$

**(Parse-TypeParamTail-Cons)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{";"})\quad \Gamma \ \vdash \ \operatorname{ParseTypeParam}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ p)\quad \Gamma \ \vdash \ \operatorname{ParseTypeParamTail}(P_{1},\ \mathsf{ps}\ \mathbin{++} \ [p])\ \Downarrow \ (P_{2},\ \mathsf{ps}') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseTypeParamTail}(P,\ \mathsf{ps})\ \Downarrow \ (P_{2},\ \mathsf{ps}')
\end{array}
$$

**(Parse-TypeParam)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseIdent}(P)\ \Downarrow \ (P_{1},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseTypeBoundsOpt}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{bounds})\quad \Gamma \ \vdash \ \operatorname{ParseTypeDefaultOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{default}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseTypeParam}(P)\ \Downarrow \ (P_{3},\ \langle \mathsf{name},\ \mathsf{bounds},\ \mathsf{default}_{\mathsf{opt}},\ \bot \rangle )
\end{array}
$$

**(Parse-TypeBoundsOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"<:"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseTypeBoundsOpt}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-TypeBoundsOpt-Yes)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"<:"})\quad \Gamma \ \vdash \ \operatorname{ParseClassBoundList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{bounds}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseTypeBoundsOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{bounds})
\end{array}
$$

**(Parse-ClassBoundList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseClassBound}(P)\ \Downarrow \ (P_{1},\ b_{1})\quad \Gamma \ \vdash \ \operatorname{ParseClassBoundListTail}(P_{1},\ [b_{1}])\ \Downarrow \ (P_{2},\ \mathsf{bs}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClassBoundList}(P)\ \Downarrow \ (P_{2},\ \mathsf{bs})
\end{array}
$$

**(Parse-ClassBoundListTail-End)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClassBoundListTail}(P,\ \mathsf{bs})\ \Downarrow \ (P,\ \mathsf{bs})
\end{array}
$$

**(Parse-ClassBoundListTail-Cons)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParseClassBound}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ b)\quad \Gamma \ \vdash \ \operatorname{ParseClassBoundListTail}(P_{1},\ \mathsf{bs}\ \mathbin{++} \ [b])\ \Downarrow \ (P_{2},\ \mathsf{bs}') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClassBoundListTail}(P,\ \mathsf{bs})\ \Downarrow \ (P_{2},\ \mathsf{bs}')
\end{array}
$$

**(Parse-ClassBound)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseTypePath}(P)\ \Downarrow \ (P_{1},\ \mathsf{path})\quad \Gamma \ \vdash \ \operatorname{ParseGenericArgsOpt}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{args}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClassBound}(P)\ \Downarrow \ (P_{2},\ \langle \mathsf{path},\ \mathsf{args}_{\mathsf{opt}}\rangle )
\end{array}
$$

**(Parse-TypeDefaultOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"="}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseTypeDefaultOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-TypeDefaultOpt-Yes)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"="})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{ty}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseTypeDefaultOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{ty})
\end{array}
$$

**(Parse-PredicateClauseOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|:"})\ \lor \ \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"\{"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePredicateClauseOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-PredicateClauseOpt-Yes)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|:"})\quad \lnot \ \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParsePredicateReqList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{preds}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePredicateClauseOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{preds})
\end{array}
$$

**(Parse-PredicateReqList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParsePredicateReq}(P)\ \Downarrow \ (P_{1},\ p)\quad \Gamma \ \vdash \ \operatorname{ParsePredicateReqListTail}(P_{1},\ [p])\ \Downarrow \ (P_{2},\ \mathsf{ps}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePredicateReqList}(P)\ \Downarrow \ (P_{2},\ \mathsf{ps})
\end{array}
$$

**(Parse-PredicateReqListTail-End)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsTerminator}(\operatorname{Tok}(P)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePredicateReqListTail}(P,\ \mathsf{ps})\ \Downarrow \ (P,\ \mathsf{ps})
\end{array}
$$

**(Parse-PredicateReqListTail-TrailingTerminator)**

$$
\begin{array}{l}
\operatorname{IsTerminator}(\operatorname{Tok}(P))\quad \lnot \ \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(P))) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePredicateReqListTail}(P,\ \mathsf{ps})\ \Downarrow \ (\operatorname{Advance}(P),\ \mathsf{ps})
\end{array}
$$

**(Parse-PredicateReqListTail-Cons)**

$$
\begin{array}{l}
\operatorname{IsTerminator}(\operatorname{Tok}(P))\quad \Gamma \ \vdash \ \operatorname{ParsePredicateReq}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ p)\quad \Gamma \ \vdash \ \operatorname{ParsePredicateReqListTail}(P_{1},\ \mathsf{ps}\ \mathbin{++} \ [p])\ \Downarrow \ (P_{2},\ \mathsf{ps}') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePredicateReqListTail}(P,\ \mathsf{ps})\ \Downarrow \ (P_{2},\ \mathsf{ps}')
\end{array}
$$

$$
\operatorname{IsPredName}(\mathsf{name})\ \Leftrightarrow \ \mathsf{name}\ \in \ \{\texttt{Bitcopy},\ \texttt{Clone},\ \texttt{Drop},\ \texttt{FfiSafe}\}
$$

**(Parse-PredicateReq-Predicate)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseIdent}(P)\ \Downarrow \ (P_{1},\ \mathsf{name})\quad \operatorname{IsPredName}(\mathsf{name})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{ty})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{")"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePredicateReq}(P)\ \Downarrow \ (\operatorname{Advance}(P_{2}),\ \operatorname{PredicateReq}(\mathsf{name},\ \mathsf{ty}))
\end{array}
$$

**(Parse-PredicateReq-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseIdent}(P)\ \Downarrow \ (P_{1},\ \mathsf{name})\quad \lnot \ (\operatorname{IsPredName}(\mathsf{name})\ \land \ \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"("})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePredicateReq}(P)\ \Downarrow \ (P_{1},\ \operatorname{PredicateReq}(\mathsf{name},\ \operatorname{TypePrim}(\texttt{"!"})))
\end{array}
$$

### 14.1.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{Variance}\ =\ \{\mathsf{Covariant},\ \mathsf{Contravariant},\ \mathsf{Invariant},\ \mathsf{Bivariant}\} \\[0.16em]
\mathsf{TypeParam}\ =\ \langle \mathsf{name},\ \mathsf{bounds},\ \mathsf{default}_{\mathsf{opt}},\ \mathsf{variance}\rangle  \\[0.16em]
\mathsf{GenericParams}\ =\ [\mathsf{TypeParam}] \\[0.16em]
\mathsf{GenericArgs}\ =\ [\mathsf{Type}]
\end{array}
$$

$$
\begin{array}{l}
\mathsf{PredicateName}\ =\ \{\texttt{Bitcopy},\ \texttt{Clone},\ \texttt{Drop},\ \texttt{FfiSafe}\} \\[0.16em]
\mathsf{PredicateReq}\ =\ \langle \mathsf{pred},\ \mathsf{type}\rangle  \\[0.16em]
\mathsf{PredicateClause}\ =\ [\mathsf{PredicateReq}]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{TypeParamsOpt}(\bot )\ =\ [] \\[0.16em]
\operatorname{TypeParamsOpt}(\mathsf{ps})\ =\ \mathsf{ps} \\[0.16em]
\operatorname{PredicateReqs}(\bot )\ =\ [] \\[0.16em]
\operatorname{PredicateReqs}(W)\ =\ W \\[0.16em]
\operatorname{TypeParamNames}(\mathsf{params})\ =\ [p.\mathsf{name}\ \mid \ p\ \in \ \mathsf{params}] \\[0.16em]
\operatorname{BindTypeParams}(\Gamma ,\ \mathsf{params})\ =\ \Gamma ,\ T_{1}\ :\ P_{1},\ \ldots ,\ T_{n}\ :\ P_{n}\quad \mathsf{iff}\ \mathsf{params}\ =\ [P_{1},\ \ldots ,\ P_{n}]\ \land \ \forall \ i.\ T_{i}\ =\ P_{i}.\mathsf{name}
\end{array}
$$

### 14.1.4 Static Semantics

$$
\begin{array}{l}
\operatorname{DefaultSuffix}(\mathsf{params})\ \Leftrightarrow \ \forall \ i\ <\ j.\ (\mathsf{params}[i].\mathsf{default}_{\mathsf{opt}}\ \ne \ \bot \ \Rightarrow \ \mathsf{params}[j].\mathsf{default}_{\mathsf{opt}}\ \ne \ \bot ) \\[0.16em]
\operatorname{DefaultRefsOk}(\mathsf{params})\ \Leftrightarrow \ \forall \ i.\ \mathsf{params}[i].\mathsf{default}_{\mathsf{opt}}\ =\ T_{i}\ \Rightarrow \ \operatorname{TypeParamsIn}(T_{i},\ \mathsf{params})\ \subseteq \ \{\mathsf{params}[j].\mathsf{name}\ \mid \ j\ <\ i\} \\[0.16em]
\operatorname{DefaultWF}(\Gamma ,\ \mathsf{params})\ \Leftrightarrow \ \forall \ i.\ \mathsf{params}[i].\mathsf{default}_{\mathsf{opt}}\ =\ T_{i}\ \Rightarrow \ (\Gamma_{i} \ \vdash \ T_{i}\ \mathsf{wf}\ \land \ \Gamma_{i} \ \vdash \ T_{i}\ \mathsf{satisfies}\ \operatorname{Bounds}(\mathsf{params}[i]))\ \mathsf{where}\ \Gamma_{i} \ =\ \operatorname{BindTypeParams}(\Gamma ,\ [\mathsf{params}[j]\ \mid \ j\ <\ i])
\end{array}
$$

**(WF-Generic-Param)**

$$
\begin{array}{l}
\forall \ i\ \ne \ j,\ \mathsf{name}_{i}\ \ne \ \mathsf{name}_{j}\quad \forall \ i,\ \forall \ B\ \in \ \mathsf{Bounds}_{i},\ \Gamma \ \vdash \ B\ :\ \mathsf{ClassPath}\quad \operatorname{DefaultSuffix}([P_{1},\ \ldots ,\ P_{n}])\quad \operatorname{DefaultRefsOk}([P_{1},\ \ldots ,\ P_{n}])\quad \operatorname{DefaultWF}(\Gamma ,\ [P_{1},\ \ldots ,\ P_{n}]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \langle P_{1};\ \ldots ;\ P_{n}\rangle \ \mathsf{wf}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{DefaultArgs}(\mathsf{params},\ \mathsf{args})\ =\ \mathsf{args}'\ \Leftrightarrow \ \mathsf{params}\ =\ [P_{1},\ \ldots ,\ P_{n}]\ \land \ \mathsf{args}\ =\ [A_{1},\ \ldots ,\ A_{k}]\ \land \ k\ \le \ n\ \land  \\[0.16em]
\ (\forall \ i\ \le \ k.\ A_{i}'\ =\ A_{i})\ \land  \\[0.16em]
\ (\forall \ i\ \in \ k+1..n.\ P_{i}.\mathsf{default}_{\mathsf{opt}}\ =\ T_{i}\ \land \ A_{i}'\ =\ \operatorname{TypeSubst}([A_{1}'/P_{1}.\mathsf{name},\ \ldots ,\ A\_\{i-1\}'/P\_\{i-1\}.\mathsf{name}],\ T_{i}))\ \land  \\[0.16em]
\ \mathsf{args}'\ =\ [A_{1}',\ \ldots ,\ A_{n}']
\end{array}
$$

$$
\operatorname{DefaultArgs}(\mathsf{params},\ \mathsf{args})\ =\ \bot \ \Leftrightarrow \ \lnot \exists \ \mathsf{args}'.\ \operatorname{DefaultArgs}(\mathsf{params},\ \mathsf{args})\ =\ \mathsf{args}'
$$

**(PredicateReq-WF-Predicate)**

$$
\begin{array}{l}
\mathsf{wp}\ =\ \operatorname{PredicateReq}(\mathsf{pred},\ \mathsf{ty})\quad \mathsf{pred}\ \in \ \mathsf{PredicateName}\quad \Gamma '\ =\ \operatorname{BindTypeParams}(\Gamma ,\ \mathsf{params})\quad \Gamma '\ \vdash \ \mathsf{ty}\ \mathsf{wf} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \mathsf{params}\ \vdash \ \mathsf{wp}\ \mathsf{wf}
\end{array}
$$

$$
\Gamma ;\ \mathsf{params}\ \vdash \ W\ \mathsf{wf}\ \Leftrightarrow \ \forall \ \mathsf{wp}\ \in \ \operatorname{PredicateReqs}(W).\ \Gamma ;\ \mathsf{params}\ \vdash \ \mathsf{wp}\ \mathsf{wf}
$$

$$
\begin{array}{l}
\operatorname{PredOk}(\texttt{Bitcopy},\ T)\ \Leftrightarrow \ \operatorname{BitcopyType}(T) \\[0.16em]
\operatorname{PredOk}(\texttt{Clone},\ T)\ \Leftrightarrow \ \operatorname{CloneType}(T) \\[0.16em]
\operatorname{PredOk}(\texttt{Drop},\ T)\ \Leftrightarrow \ \operatorname{DropType}(T) \\[0.16em]
\operatorname{PredOk}(\texttt{FfiSafe},\ T)\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(T-Constraint-Sat)**

$$
\begin{array}{l}
\forall \ B\ \in \ \mathsf{Bounds},\ \Gamma \ \vdash \ A\ \mathrel{<:} \ B \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ A\ \mathsf{satisfies}\ \mathsf{Bounds}
\end{array}
$$

**(PredicateReq-Predicate)**

$$
\begin{array}{l}
\mathsf{wp}\ =\ \langle \mathsf{pred},\ \mathsf{ty}\rangle \quad \operatorname{PredOk}(\mathsf{pred},\ \mathsf{ty}[\theta ]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{wp}[\theta ]\ \mathsf{ok}
\end{array}
$$

$$
\Gamma \ \vdash \ W[\theta ]\ \mathsf{ok}\ \Leftrightarrow \ \forall \ \mathsf{wp}\ \in \ \operatorname{PredicateReqs}(W).\ \Gamma \ \vdash \ \mathsf{wp}[\theta ]\ \mathsf{ok}
$$

Inline bounds and predicate-clause requirements are conjunctive. An instantiation satisfies the parameter only when it satisfies both.

### 14.1.5 Dynamic Semantics

Generic parameter declarations, generic argument lists, class-bound lists, and predicate clauses have no runtime semantics. They are eliminated before abstract-machine evaluation.

### 14.1.6 Lowering

These forms do not lower directly. Lowering consumes their elaborated substitutions and instantiated declarations as defined in §14.2.

### 14.1.7 Diagnostics

Diagnostics are defined for duplicate type-parameter names, malformed predicate requirements, invalid class bounds, defaults that refer to later parameters, non-suffix defaults, missing default arguments during instantiation, and type arguments that fail required class or predicate constraints.
