---
title: "Abstraction and Polymorphism"
description: "14. Abstraction and Polymorphism of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
generatedAt: "2026-05-14T00:55:03.609Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
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

## 14.2 Generic Procedures and Types

### 14.2.1 Syntax

```text
generic_procedure ::= "procedure" identifier generic_params? signature predicate_clause? contract_clause? block
generic_call      ::= callee generic_args "(" arg_list? ")"
generic_type_use  ::= type_path generic_args
```

Generic parameters and predicate clauses also appear on nominal type declarations and type aliases in their owning chapters.

### 14.2.2 Parsing

Generic declaration parsing is delegated to the owning declaration forms, each of which invokes `ParseGenericParamsOpt` and `ParsePredicateClauseOpt` before its body-specific parser.

$$
\operatorname{CallTypeArgsStart}(P)\ \Leftrightarrow \ \operatorname{TypeArgsStartTok}(\operatorname{Tok}(P))\ \land \ (\Gamma \ \vdash \ \operatorname{ParseGenericArgs}(P)\ \Downarrow \ (P_{1},\ \mathsf{args}))\ \land \ \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"("})
$$

**(Postfix-Call-TypeArgs)**

$$
\begin{array}{l}
\operatorname{CallTypeArgsStart}(P)\quad \Gamma \ \vdash \ \operatorname{ParseGenericArgs}(P)\ \Downarrow \ (P_{1},\ \mathsf{targs})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseArgList}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{args})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{")"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PostfixStep}(P,\ e)\ \Downarrow \ (\operatorname{Advance}(P_{2}),\ \operatorname{CallTypeArgs}(e,\ \mathsf{targs},\ \mathsf{args}))
\end{array}
$$

### 14.2.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{ProcedureDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{return}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}\rangle  \\[0.16em]
\mathsf{RecordDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{implements},\ \mathsf{members},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}\rangle  \\[0.16em]
\mathsf{EnumDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{implements},\ \mathsf{variants},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}\rangle  \\[0.16em]
\mathsf{ModalDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{implements},\ \mathsf{states},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}\rangle  \\[0.16em]
\mathsf{ClassDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{modal},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{supers},\ \mathsf{items},\ \mathsf{span},\ \mathsf{doc}\rangle  \\[0.16em]
\mathsf{TypeAliasDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{type},\ \mathsf{span},\ \mathsf{doc}\rangle 
\end{array}
$$

$$
\begin{array}{l}
\mathsf{Type}\ =\ \operatorname{TypeApply}(\mathsf{path},\ \mathsf{args})\ \mid \ \ldots  \\[0.16em]
\mathsf{TypeApply}\ =\ \langle \mathsf{path},\ \mathsf{args}\rangle  \\[0.16em]
\mathsf{Expr}\ =\ \operatorname{CallTypeArgs}(\mathsf{callee},\ \mathsf{type}_{\mathsf{args}},\ \mathsf{args})\ \mid \ \ldots 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{TypeParamsOf}(p)\ =\ \mathsf{params}_{\mathsf{gen}} \\[0.16em]
\operatorname{TypePredicateClauseOf}(p)\ =\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}
\end{array}
$$

### 14.2.4 Static Semantics

**(WF-Generic-Proc)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \langle P_{1},\ \ldots ,\ P_{n}\rangle \ \mathsf{wf}\quad \Gamma '\ =\ \Gamma ,\ T_{1}\ :\ P_{1},\ \ldots ,\ T_{n}\ :\ P_{n}\quad \Gamma '\ \vdash \ \mathsf{signature}\ \mathsf{wf}\quad \Gamma '\ \vdash \ \mathsf{body}\ \mathsf{wf} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \texttt{procedure}\ f\langle P_{1},\ \ldots ,\ P_{n}\rangle (\ldots )\ \to \ R\ \{\ldots \}\ \mathsf{wf}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{GenericCalleeProc}(\operatorname{Identifier}(f))\ =\ \mathsf{proc}\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{ResolveValueName}(f)\ \Downarrow \ \mathsf{ent}\ \land \ \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ \mathsf{mp}\ \land \ f'\ =\ (\mathsf{ent}.\mathsf{target}_{\mathsf{opt}}\ \mathsf{if}\ \mathsf{present},\ \mathsf{else}\ f)\ \land \ \operatorname{DeclOf}(\mathsf{mp},\ f')\ =\ \mathsf{proc}\ \land \ \mathsf{proc}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \land \ \operatorname{TypeParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\ \ne \ [] \\[0.16em]
\operatorname{GenericCalleeProc}(\operatorname{Path}(\mathsf{path},\ \mathsf{name}))\ =\ \mathsf{proc}\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{ResolveQualified}(\mathsf{path},\ \mathsf{name},\ \mathsf{ValueKind})\ \Downarrow \ \mathsf{ent}\ \land \ \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ \mathsf{mp}\ \land \ \mathsf{name}'\ =\ (\mathsf{ent}.\mathsf{target}_{\mathsf{opt}}\ \mathsf{if}\ \mathsf{present},\ \mathsf{else}\ \mathsf{name})\ \land \ \operatorname{DeclOf}(\mathsf{mp},\ \mathsf{name}')\ =\ \mathsf{proc}\ \land \ \mathsf{proc}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \land \ \operatorname{TypeParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\ \ne \ []
\end{array}
$$
GenericCalleeProc(callee) undefined otherwise

$$
\begin{array}{l}
\operatorname{FreshTypeArgs}([P_{1},\ \ldots ,\ P_{n}])\ =\ [\operatorname{TVar}(\alpha_{1} ),\ \ldots ,\ \operatorname{TVar}(\alpha_{n} )]\quad \mathsf{where}\ \alpha_{1} ,\ \ldots ,\ \alpha_{n} \ \mathsf{are}\ \mathsf{pairwise}\ \mathsf{distinct}\ \mathsf{and}\ \mathsf{fresh} \\[0.16em]
\operatorname{SolvedType}(T)\ \Leftrightarrow \ \operatorname{TVars}(T)\ =\ \emptyset 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{InferTypeArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{raw}_{\mathsf{args}})\ =\ \mathsf{args}'\ \Leftrightarrow \ \mathsf{params}_{\mathsf{gen}}\ =\ [P_{1},\ \ldots ,\ P_{n}]\ \land \ \mathsf{raw}_{\mathsf{args}}\ =\ [R_{1},\ \ldots ,\ R_{n}]\ \land  \\[0.16em]
\ (\forall \ i\ \in \ 1..n. \\[0.16em]
\quad ((\operatorname{SolvedType}(R_{i})\ \land \ A_{i}\ =\ R_{i})\ \lor  \\[0.16em]
\quad (\lnot \operatorname{SolvedType}(R_{i})\ \land \ P_{i}.\mathsf{default}_{\mathsf{opt}}\ =\ D_{i}\ \land \ A_{i}\ =\ \operatorname{TypeSubst}([A_{1}/P_{1}.\mathsf{name},\ \ldots ,\ A\_\{i-1\}/P\_\{i-1\}.\mathsf{name}],\ D_{i}))))\ \land  \\[0.16em]
\ \mathsf{args}'\ =\ [A_{1},\ \ldots ,\ A_{n}]
\end{array}
$$

$$
\operatorname{InferTypeArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{raw}_{\mathsf{args}})\ =\ \bot \ \Leftrightarrow \ \lnot \ \exists \ \mathsf{args}'.\ \operatorname{InferTypeArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{raw}_{\mathsf{args}})\ =\ \mathsf{args}'
$$

**(GenericCallInference)**

$$
\begin{array}{l}
\operatorname{GenericCalleeProc}(\mathsf{callee})\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \_,\ \_,\ \_,\ \_) \\[0.16em]
\mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \mathsf{params}_{\mathsf{gen}}\ =\ [P_{1},\ \ldots ,\ P_{n}] \\[0.16em]
\operatorname{FreshTypeArgs}(\mathsf{params}_{\mathsf{gen}})\ =\ [X_{1},\ \ldots ,\ X_{n}] \\[0.16em]
\theta_{\mathsf{var}} \ =\ [X_{1}/P_{1}.\mathsf{name},\ \ldots ,\ X_{n}/P_{n}.\mathsf{name}] \\[0.16em]
\mathsf{params}_{i}\ =\ [\langle \mathsf{mode}_{j},\ \operatorname{TypeSubst}(\theta_{\mathsf{var}} ,\ T_{j})\rangle \ \mid \ \langle \mathsf{mode}_{j},\ x_{j},\ T_{j}\rangle \ \in \ \mathsf{params}] \\[0.16em]
R_{i}\ =\ \operatorname{TypeSubst}(\theta_{\mathsf{var}} ,\ \operatorname{ProcReturn}(\mathsf{ret}_{\mathsf{opt}}))
\end{array}
$$
|params_i| = |args|

$$
\begin{array}{l}
C_{\mathsf{args}}\ =\ \{(\operatorname{ArgType}(\mathsf{params}_{i}[j],\ \mathsf{args}[j]),\ \operatorname{ParamType}(\mathsf{params}_{i}[j]))\ \mid \ j\ \in \ 1..\mid \mathsf{args}\mid \} \\[0.16em]
C_{\mathsf{ret}}\ =\ \{(R_{i},\ T_{\mathsf{exp}})\}\quad \mathsf{if}\ T_{\mathsf{exp}\_\mathsf{opt}}\ =\ T_{\mathsf{exp}} \\[0.16em]
\quad \emptyset \quad \mathsf{otherwise} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Solve}(C_{\mathsf{args}}\ \cup \ C_{\mathsf{ret}})\ \Downarrow \ \theta_{s}  \\[0.16em]
\mathsf{raw}_{\mathsf{args}}\ =\ [\theta_{s} (X_{1}),\ \ldots ,\ \theta_{s} (X_{n})] \\[0.16em]
\operatorname{InferTypeArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{raw}_{\mathsf{args}})\ =\ [A_{1},\ \ldots ,\ A_{n}] \\[0.16em]
\theta \ =\ [A_{1}/P_{1}.\mathsf{name},\ \ldots ,\ A_{n}/P_{n}.\mathsf{name}] \\[0.16em]
\forall \ i\ \in \ 1..n.\ \Gamma \ \vdash \ A_{i}\ \mathsf{satisfies}\ \operatorname{Bounds}(P_{i}) \\[0.16em]
\Gamma \ \vdash \ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}[\theta ]\ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{GenericCallInference}(\mathsf{callee},\ \mathsf{args},\ T_{\mathsf{exp}\_\mathsf{opt}})\ \Downarrow \ [A_{1},\ \ldots ,\ A_{n}]
\end{array}
$$

**(T-Generic-Call)**

$$
\begin{array}{l}
\operatorname{GenericCalleeProc}(\mathsf{callee})\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \_,\ \_,\ \_,\ \_) \\[0.16em]
\mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \mathsf{params}_{\mathsf{gen}}\ =\ [P_{1},\ \ldots ,\ P_{n}] \\[0.16em]
\operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ [A_{1},\ \ldots ,\ A_{k}])\ =\ [A_{1}',\ \ldots ,\ A_{n}'] \\[0.16em]
\theta \ =\ [A_{1}'/P_{1}.\mathsf{name},\ \ldots ,\ A_{n}'/P_{n}.\mathsf{name}] \\[0.16em]
\mathsf{params}\_\theta \ =\ [\langle \mathsf{mode}_{j},\ \operatorname{TypeSubst}(\theta ,\ T_{j})\rangle \ \mid \ \langle \mathsf{mode}_{j},\ x_{j},\ T_{j}\rangle \ \in \ \mathsf{params}] \\[0.16em]
\forall \ i\ \in \ 1..n.\ \Gamma \ \vdash \ A_{i}'\ \mathsf{satisfies}\ \operatorname{Bounds}(P_{i}) \\[0.16em]
\Gamma \ \vdash \ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}[\theta ]\ \mathsf{ok} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk_T}(\mathsf{params}\_\theta ,\ \mathsf{args}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{CallTypeArgs}(\mathsf{callee},\ [A_{1},\ \ldots ,\ A_{k}],\ \mathsf{args})\ :\ \operatorname{ProcReturn}(\mathsf{ret}_{\mathsf{opt}})[\theta ]
\end{array}
$$

**(Generic-Call-ArgCount-Err)**

$$
\begin{array}{l}
\operatorname{GenericCalleeProc}(\mathsf{callee})\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ [A_{1},\ \ldots ,\ A_{k}])\ =\ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{CallTypeArgs}(\mathsf{callee},\ [A_{1},\ \ldots ,\ A_{k}],\ \mathsf{args})\ \Uparrow 
\end{array}
$$

**(WF-Path-Generic-Err)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad p\ \in \ \operatorname{dom}(\Sigma .\mathsf{Types})\quad \operatorname{TypeParamsOf}(p)\ \ne \ [] \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}\ \Uparrow 
\end{array}
$$

**(WF-Apply)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeApply}(p,\ \mathsf{args})\quad p\ \in \ \operatorname{dom}(\Sigma .\mathsf{Types})\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOf}(p)\quad \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{args})\ =\ \mathsf{args}'\quad \theta \ =\ [\mathsf{args}'\_i\ /\ \mathsf{params}_{\mathsf{gen}}[i].\mathsf{name}]\quad \forall \ i,\ \Gamma \ \vdash \ \mathsf{args}'\_i\ \mathsf{wf}\quad \forall \ i,\ \Gamma \ \vdash \ \mathsf{args}'\_i\ \mathsf{satisfies}\ \operatorname{Bounds}(\mathsf{params}_{\mathsf{gen}}[i])\quad \Gamma \ \vdash \ \operatorname{TypePredicateClauseOf}(p)[\theta ]\ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}
\end{array}
$$

**(WF-Apply-ArgCount-Err)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeApply}(p,\ \mathsf{args})\quad p\ \in \ \operatorname{dom}(\Sigma .\mathsf{Types})\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOf}(p)\quad \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{args})\ =\ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}\ \Uparrow 
\end{array}
$$

Type arguments MAY be omitted at generic procedure call sites only when `GenericCallInference` succeeds. A well-typed omitted-type-argument call is elaborated to `CallTypeArgs(callee, inferred_args, args)` before the §14.2.5 monomorphic-call elaboration. Class methods with generic parameter lists are not vtable-eligible and therefore MUST NOT be invoked through dynamic class objects.

### 14.2.5 Dynamic Semantics

`CallTypeArgs` is elaborated to a monomorphic `Call` after substitution. `TypeApply(path, args)` denotes the specialized declaration obtained by applying the elaborated substitution to the generic declaration named by `path`.

Distinct monomorphic instantiations are distinct declarations and distinct layouts.

### 14.2.6 Lowering

Monomorphization produces a specialized declaration `D[A_1/T_1, …, A_n/T_n]` for each concrete instantiation.

Lowering requirements:

1. Calls to generic procedures lower to direct static calls to the specialized instantiation.
2. Each distinct instantiation lowers independently.
3. Implementations MUST reject infinite monomorphization recursion.
4. The maximum instantiation depth is 128.

For instantiated nominal types, `sizeof` and `alignof` are those of the substituted body.

### 14.2.7 Diagnostics

Diagnostics are defined for missing or excess type arguments, omitted-type-argument inference failures, use of a generic nominal declaration without required arguments, generic-call substitution failures, unsatisfied bounds or predicate clauses after substitution, and infinite monomorphization recursion.

## 14.3 Classes

### 14.3.1 Syntax

```text
class_decl   ::= attribute_list? visibility? "modal"? "class" identifier generic_params? ("<:" superclass_bounds)? predicate_clause? "{" class_body? "}"
class_item   ::= class_method | associated_type | abstract_field | abstract_state
abstract_state ::= "@" identifier "{" abstract_field* "}"
abstract_field ::= attribute_list? visibility? key_boundary? identifier ":" type
```

Associated type item syntax is defined canonically in §14.5.

### 14.3.2 Parsing

**(Parse-Class)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \Gamma \ \vdash \ \operatorname{ParseModalOpt}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{modal})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{2}),\ \texttt{class})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{2}))\ \Downarrow \ (P_{3},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseGenericParamsOpt}(P_{3})\ \Downarrow \ (P_{4},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseSuperclassOpt}(P_{4})\ \Downarrow \ (P_{5},\ \mathsf{supers})\quad \Gamma \ \vdash \ \operatorname{ParsePredicateClauseOpt}(P_{5})\ \Downarrow \ (P_{6},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseClassBody}(P_{6})\ \Downarrow \ (P_{7},\ \mathsf{items}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseItem}(P)\ \Downarrow \ (P_{7},\ \langle \mathsf{ClassDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{modal},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{supers},\ \mathsf{items},\ \operatorname{SpanBetween}(P,\ P_{7}),\ []\rangle )
\end{array}
$$

**(Parse-Superclass-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"<:"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseSuperclassOpt}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-Superclass-Yes)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"<:"})\quad \Gamma \ \vdash \ \operatorname{ParseSuperclassBounds}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{supers}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseSuperclassOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{supers})
\end{array}
$$

**(Parse-SuperclassBounds-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseClassPath}(P)\ \Downarrow \ (P_{1},\ c_{0})\quad \Gamma \ \vdash \ \operatorname{ParseSuperclassBoundsTail}(P_{1},\ [c_{0}])\ \Downarrow \ (P_{2},\ \mathsf{cs}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseSuperclassBounds}(P)\ \Downarrow \ (P_{2},\ \mathsf{cs})
\end{array}
$$

**(Parse-SuperclassBoundsTail-End)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"+"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseSuperclassBoundsTail}(P,\ \mathsf{cs})\ \Downarrow \ (P,\ \mathsf{cs})
\end{array}
$$

**(Parse-SuperclassBoundsTail-Plus)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"+"})\quad \Gamma \ \vdash \ \operatorname{ParseClassPath}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ c)\quad \Gamma \ \vdash \ \operatorname{ParseSuperclassBoundsTail}(P_{1},\ \mathsf{cs}\ \mathbin{++} \ [c])\ \Downarrow \ (P_{2},\ \mathsf{cs}') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseSuperclassBoundsTail}(P,\ \mathsf{cs})\ \Downarrow \ (P_{2},\ \mathsf{cs}')
\end{array}
$$

**(Parse-ClassBody)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseClassItemList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{items})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClassBody}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \mathsf{items})
\end{array}
$$

**(Parse-ClassItemList-End)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClassItemList}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-ClassItemList-Cons)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\}"})\quad \Gamma \ \vdash \ \operatorname{ParseClassItem}(P)\ \Downarrow \ (P_{1},\ \mathsf{it})\quad \Gamma \ \vdash \ \operatorname{ParseClassItemList}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{rest}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClassItemList}(P)\ \Downarrow \ (P_{2},\ [\mathsf{it}]\ \mathbin{++} \ \mathsf{rest})
\end{array}
$$

**(Parse-ClassItem-Method)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{procedure})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseGenericParamsOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseMethodSignature}(P_{3})\ \Downarrow \ (P_{4},\ \mathsf{receiver},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseContractClauseOpt}(P_{4})\ \Downarrow \ (P_{5},\ \mathsf{contract}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseClassMethodBody}(P_{5})\ \Downarrow \ (P_{6},\ \mathsf{body}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClassItem}(P)\ \Downarrow \ (P_{6},\ \langle \mathsf{ClassMethodDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{receiver},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body}_{\mathsf{opt}},\ \operatorname{SpanBetween}(P,\ P_{6}),\ []\rangle )
\end{array}
$$

**(Parse-ClassItem-Field)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \Gamma \ \vdash \ \operatorname{ParseKeyBoundaryOpt}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{boundary})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{name})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{3}),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P_{3}))\ \Downarrow \ (P_{4},\ \mathsf{ty})\quad \Gamma \ \vdash \ \operatorname{ConsumeTerminatorReq}(P_{4})\ \Downarrow \ P_{5} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClassItem}(P)\ \Downarrow \ (P_{5},\ \langle \mathsf{ClassFieldDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{name},\ \mathsf{ty},\ \operatorname{SpanBetween}(P,\ P_{5}),\ []\rangle )
\end{array}
$$

**(Parse-ClassItem-AbstractState)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{"@"})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{name})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseAbstractFieldList}(\operatorname{Advance}(P_{2}))\ \Downarrow \ (P_{3},\ \mathsf{fields})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{3}),\ \texttt{"\}"})\quad \Gamma \ \vdash \ \operatorname{ConsumeTerminatorOpt}(\operatorname{Advance}(P_{3}),\ \bot )\ \Downarrow \ P_{4} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClassItem}(P)\ \Downarrow \ (P_{4},\ \langle \mathsf{AbstractStateDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{fields},\ \operatorname{SpanBetween}(P,\ P_{4}),\ []\rangle )
\end{array}
$$

**(Parse-ClassMethodBody-Concrete)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(P)\ \Downarrow \ (P_{1},\ \mathsf{body}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClassMethodBody}(P)\ \Downarrow \ (P_{1},\ \mathsf{body})
\end{array}
$$

**(Parse-ClassMethodBody-Abstract)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ConsumeTerminatorReq}(P)\ \Downarrow \ P_{1} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClassMethodBody}(P)\ \Downarrow \ (P_{1},\ \bot )
\end{array}
$$

### 14.3.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{ClassDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{modal},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{supers},\ \mathsf{items},\ \mathsf{span},\ \mathsf{doc}\rangle  \\[0.16em]
\mathsf{ClassDecl}.\mathsf{supers}\ \in \ [\mathsf{ClassPath}]
\end{array}
$$

$$
\begin{array}{l}
\mathsf{ClassItem}\ \in \ \{ \\[0.16em]
\ \mathsf{ClassFieldDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{name},\ \mathsf{type},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}\rangle , \\[0.16em]
\ \mathsf{ClassMethodDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{receiver},\ \mathsf{params},\ \mathsf{return}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}\rangle , \\[0.16em]
\ \mathsf{AssociatedTypeDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{type}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}\rangle , \\[0.16em]
\ \mathsf{AbstractStateDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{fields},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}\rangle  \\[0.16em]
\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{AbstractClassMethod}(m)\ \Leftrightarrow \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{span},\ \mathsf{doc}.\ m\ =\ \operatorname{ClassMethodDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \bot ,\ \mathsf{span},\ \mathsf{doc}) \\[0.16em]
\operatorname{ConcreteClassMethod}(m)\ \Leftrightarrow \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}.\ m\ =\ \operatorname{ClassMethodDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\ \land \ \mathsf{body}\ \ne \ \bot 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ClassItems}(\mathsf{Cl})\ =\ \mathsf{Cl}.\mathsf{items} \\[0.16em]
\operatorname{ClassMethods}(\mathsf{Cl})\ =\ [\ m\ \mid \ m\ \in \ \operatorname{ClassItems}(\mathsf{Cl})\ \land \ m\ \mathsf{is}\ \mathsf{ClassMethodDecl}\ ] \\[0.16em]
\operatorname{ClassFields}(\mathsf{Cl})\ =\ [\ f\ \mid \ f\ \in \ \operatorname{ClassItems}(\mathsf{Cl})\ \land \ f\ \mathsf{is}\ \mathsf{ClassFieldDecl}\ ] \\[0.16em]
\operatorname{MethodNames}(\mathsf{Cl})\ =\ [\ m.\mathsf{name}\ \mid \ m\ \in \ \operatorname{ClassMethods}(\mathsf{Cl})\ ] \\[0.16em]
\operatorname{FieldNames}(\mathsf{Cl})\ =\ [\ f.\mathsf{name}\ \mid \ f\ \in \ \operatorname{ClassFields}(\mathsf{Cl})\ ]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ReturnType}(m)\ =\ m.\mathsf{return}_{\mathsf{type}\_\mathsf{opt}}\quad \mathsf{if}\ m.\mathsf{return}_{\mathsf{type}\_\mathsf{opt}}\ \ne \ \bot  \\[0.16em]
\operatorname{ReturnType}(m)\ =\ \operatorname{TypePrim}(\texttt{"()"})\quad \mathsf{if}\ m.\mathsf{return}_{\mathsf{type}\_\mathsf{opt}}\ =\ \bot 
\end{array}
$$

$$
\mathsf{SelfVar}\ =\ \operatorname{TypePath}([\texttt{Self}])
$$

### 14.3.4 Static Semantics

$$
\begin{array}{l}
\operatorname{Distinct}(\mathsf{xs})\ \Leftrightarrow \ \forall \ i\ \ne \ j.\ \mathsf{xs}[i]\ \ne \ \mathsf{xs}[j] \\[0.16em]
\operatorname{Disjoint}(\mathsf{xs},\ \mathsf{ys})\ \Leftrightarrow \ \forall \ x\ \in \ \mathsf{xs}.\ x\ \notin \ \mathsf{ys}
\end{array}
$$

**(WF-ClassPath)**

$$
\begin{array}{l}
p\ \in \ \operatorname{dom}(\Sigma .\mathsf{Classes}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ p\ :\ \mathsf{ClassPath}
\end{array}
$$

**(WF-ClassPath-Err)**

$$
\begin{array}{l}
p\ \notin \ \operatorname{dom}(\Sigma .\mathsf{Classes}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ p\ :\ \mathsf{ClassPath}\ \Uparrow 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{SubstSelf}(T,\ \operatorname{TypePath}([\texttt{Self}]))\ =\ T \\[0.16em]
\operatorname{SubstSelf}(T,\ \operatorname{TypePerm}(p,\ \mathsf{ty}))\ =\ \operatorname{TypePerm}(p,\ \operatorname{SubstSelf}(T,\ \mathsf{ty})) \\[0.16em]
\operatorname{SubstSelf}(T,\ \operatorname{TypeTuple}([t_{1},\ \ldots ,\ t_{n}]))\ =\ \operatorname{TypeTuple}([\operatorname{SubstSelf}(T,\ t_{1}),\ \ldots ,\ \operatorname{SubstSelf}(T,\ t_{n})]) \\[0.16em]
\operatorname{SubstSelf}(T,\ \operatorname{TypeArray}(\mathsf{ty},\ e))\ =\ \operatorname{TypeArray}(\operatorname{SubstSelf}(T,\ \mathsf{ty}),\ e) \\[0.16em]
\operatorname{SubstSelf}(T,\ \operatorname{TypeSlice}(\mathsf{ty}))\ =\ \operatorname{TypeSlice}(\operatorname{SubstSelf}(T,\ \mathsf{ty})) \\[0.16em]
\operatorname{SubstSelf}(T,\ \operatorname{TypeUnion}([t_{1},\ \ldots ,\ t_{n}]))\ =\ \operatorname{TypeUnion}([\operatorname{SubstSelf}(T,\ t_{1}),\ \ldots ,\ \operatorname{SubstSelf}(T,\ t_{n})]) \\[0.16em]
\operatorname{SubstSelf}(T,\ \operatorname{TypeFunc}([\langle m_{1},\ t_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ t_{n}\rangle ],\ r))\ =\ \operatorname{TypeFunc}([\langle m_{1},\ \operatorname{SubstSelf}(T,\ t_{1})\rangle ,\ \ldots ,\ \langle m_{n},\ \operatorname{SubstSelf}(T,\ t_{n})\rangle ],\ \operatorname{SubstSelf}(T,\ r)) \\[0.16em]
\operatorname{SubstSelf}(T,\ \operatorname{TypePtr}(\mathsf{ty},\ s))\ =\ \operatorname{TypePtr}(\operatorname{SubstSelf}(T,\ \mathsf{ty}),\ s) \\[0.16em]
\operatorname{SubstSelf}(T,\ \operatorname{TypeRawPtr}(q,\ \mathsf{ty}))\ =\ \operatorname{TypeRawPtr}(q,\ \operatorname{SubstSelf}(T,\ \mathsf{ty})) \\[0.16em]
\operatorname{SubstSelf}(T,\ \operatorname{TypeString}(\mathsf{state}_{\mathsf{opt}}))\ =\ \operatorname{TypeString}(\mathsf{state}_{\mathsf{opt}}) \\[0.16em]
\operatorname{SubstSelf}(T,\ \operatorname{TypeBytes}(\mathsf{state}_{\mathsf{opt}}))\ =\ \operatorname{TypeBytes}(\mathsf{state}_{\mathsf{opt}}) \\[0.16em]
\operatorname{SubstSelf}(T,\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S))\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S) \\[0.16em]
\operatorname{SubstSelf}(T,\ \operatorname{TypeDynamic}(p))\ =\ \operatorname{TypeDynamic}(p) \\[0.16em]
\operatorname{SubstSelf}(T,\ \operatorname{TypePrim}(n))\ =\ \operatorname{TypePrim}(n) \\[0.16em]
\operatorname{SubstSelf}(T,\ \operatorname{TypePath}(p))\ =\ \operatorname{TypePath}(p)\quad \mathsf{if}\ p\ \ne \ [\texttt{Self}]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{RecvType}(T,\ \operatorname{ReceiverShorthand}(\texttt{const}))\ =\ \operatorname{TypePerm}(\texttt{const},\ T) \\[0.16em]
\operatorname{RecvType}(T,\ \operatorname{ReceiverShorthand}(\texttt{unique}))\ =\ \operatorname{TypePerm}(\texttt{unique},\ T) \\[0.16em]
\operatorname{RecvType}(T,\ \operatorname{ReceiverShorthand}(\texttt{shared}))\ =\ \operatorname{TypePerm}(\texttt{shared},\ T) \\[0.16em]
\operatorname{RecvType}(T,\ \operatorname{ReceiverExplicit}(\mathsf{mode}_{\mathsf{opt}},\ \mathsf{ty}))\ =\ \operatorname{SubstSelf}(T,\ \mathsf{ty})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{RecvMode}(\operatorname{ReceiverShorthand}(\_))\ =\ \bot  \\[0.16em]
\operatorname{RecvMode}(\operatorname{ReceiverExplicit}(\mathsf{mode}_{\mathsf{opt}},\ \_))\ =\ \mathsf{mode}_{\mathsf{opt}}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{PermOf}(\operatorname{TypePerm}(p,\ \_))\ =\ p \\[0.16em]
\operatorname{PermOf}(\mathsf{ty})\ =\ \texttt{const}\quad \mathsf{otherwise} \\[0.16em]
\operatorname{RecvPerm}(T,\ r)\ =\ \operatorname{PermOf}(\operatorname{RecvType}(T,\ r))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ParamSig_T}(T,\ \mathsf{params})\ =\ [\langle \mathsf{mode},\ \operatorname{SubstSelf}(T,\ \mathsf{ty})\rangle \ \mid \ \langle \mathsf{mode},\ \mathsf{name},\ \mathsf{ty}\rangle \ \in \ \mathsf{params}] \\[0.16em]
\operatorname{ParamBinds_T}(T,\ \mathsf{params})\ =\ [\langle x_{1},\ \operatorname{SubstSelf}(T,\ T_{1})\rangle ,\ \ldots ,\ \langle x_{n},\ \operatorname{SubstSelf}(T,\ T_{n})\rangle ] \\[0.16em]
\operatorname{ReturnType_T}(T,\ m)\ =\ \operatorname{SubstSelf}(T,\ \operatorname{ReturnType}(m)) \\[0.16em]
\operatorname{Sig_T}(T,\ m)\ =\ \langle \operatorname{RecvType}(T,\ m.\mathsf{receiver}),\ \operatorname{ParamSig_T}(T,\ m.\mathsf{params}),\ \operatorname{SubstSelf}(T,\ \operatorname{ReturnType}(m))\rangle  \\[0.16em]
\operatorname{SigSelf}(m)\ =\ \operatorname{Sig_T}(\mathsf{SelfVar},\ m) \\[0.16em]
\operatorname{SigMatch}(T,\ m_{\mathsf{impl}},\ m_{\mathsf{decl}})\ \Leftrightarrow \ \operatorname{Sig_T}(T,\ m_{\mathsf{impl}})\ =\ \langle \mathsf{recv}_{i},\ \mathsf{params}_{i},\ \mathsf{ret}_{i}\rangle \ \land \ \operatorname{Sig_T}(T,\ m_{\mathsf{decl}})\ =\ \langle \mathsf{recv}_{d},\ \mathsf{params}_{d},\ \mathsf{ret}_{d}\rangle \ \land \ \mathsf{recv}_{i}\ =\ \mathsf{recv}_{d}\ \land \ \mathsf{params}_{i}\ =\ \mathsf{params}_{d}\ \land \ \Gamma \ \vdash \ \mathsf{ret}_{i}\ \mathrel{<:} \ \mathsf{ret}_{d}
\end{array}
$$

$$
\operatorname{Supers}(\mathsf{Cl})\ =\ \mathsf{Cl}.\mathsf{supers}
$$

**(T-Superclass)**

$$
\begin{array}{l}
\mathsf{class}\ A\ \mathrel{<:} \ B\quad T\ \mathrel{<:} \ A \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathrel{<:} \ B
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Head}(h\ \mathbin{::} \ t)\ =\ h \\[0.16em]
\operatorname{Tail}([])\ =\ [] \\[0.16em]
\operatorname{Tail}(h\ \mathbin{::} \ t)\ =\ t \\[0.16em]
\operatorname{HeadOk}(h,\ \mathsf{Ls})\ \Leftrightarrow \ \exists \ L\ \in \ \mathsf{Ls}.\ L\ =\ h\ \mathbin{::} \ t\ \land \ \forall \ L'\ \in \ \mathsf{Ls}.\ h\ \notin \ \operatorname{Tail}(L') \\[0.16em]
\operatorname{SelectHead}(\mathsf{Ls})\ =\ h\ \Leftrightarrow \ \mathsf{Ls}\ =\ [L_{1},\ \ldots ,\ L_{n}]\ \land \ L_{i}\ =\ h\ \mathbin{::} \ t\ \land \ \operatorname{HeadOk}(h,\ \mathsf{Ls})\ \land \ \forall \ j\ <\ i.\ \lnot \ \operatorname{HeadOk}(\operatorname{Head}(L_{j}),\ \mathsf{Ls}) \\[0.16em]
\operatorname{SelectHead}(\mathsf{Ls})\ =\ \bot \ \Leftrightarrow \ \lnot \ \exists \ h.\ \operatorname{HeadOk}(h,\ \mathsf{Ls}) \\[0.16em]
\operatorname{PopHead}(h,\ L)\ =\ t\ \Leftrightarrow \ L\ =\ h\ \mathbin{::} \ t \\[0.16em]
\operatorname{PopHead}(h,\ L)\ =\ L\ \Leftrightarrow \ \lnot (L\ =\ h\ \mathbin{::} \ t) \\[0.16em]
\operatorname{PopAll}(h,\ \mathsf{Ls})\ =\ [\operatorname{PopHead}(h,\ L)\ \mid \ L\ \in \ \mathsf{Ls}]
\end{array}
$$

**(Lin-Base)**

$$
\begin{array}{l}
\operatorname{Supers}(\mathsf{Cl})\ =\ [] \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linearize}(\mathsf{Cl})\ \Downarrow \ [\mathsf{Cl}]
\end{array}
$$

**(Merge-Empty)**

$$
\begin{array}{l}
\forall \ L\ \in \ \mathsf{Ls},\ L\ =\ [] \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Merge}(\mathsf{Ls})\ \Downarrow \ []
\end{array}
$$

**(Merge-Step)**

$$
\begin{array}{l}
\operatorname{SelectHead}(\mathsf{Ls})\ =\ h\quad \Gamma \ \vdash \ \operatorname{Merge}(\operatorname{PopAll}(h,\ \mathsf{Ls}))\ \Downarrow \ L \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Merge}(\mathsf{Ls})\ \Downarrow \ [h]\ \mathbin{++} \ L
\end{array}
$$

**(Merge-Fail)**

$$
\begin{array}{l}
\lnot \ \exists \ h.\ \operatorname{HeadOk}(h,\ \mathsf{Ls}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Merge}(\mathsf{Ls})\ \Uparrow 
\end{array}
$$

**(Lin-Ok)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Merge}([\operatorname{Linearize}(S_{1}),\ \ldots ,\ \operatorname{Linearize}(S_{n}),\ [S_{1},\ \ldots ,\ S_{n}]])\ \Downarrow \ L \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linearize}(\mathsf{Cl})\ \Downarrow \ [\mathsf{Cl}]\ \mathbin{++} \ L
\end{array}
$$

**(Lin-Fail)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Merge}(\cdots )\ \Uparrow  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linearize}(\mathsf{Cl})\ \Uparrow 
\end{array}
$$

**(Superclass-Cycle)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Linearize}(\mathsf{Cl})\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{Superclass}-\mathsf{Cycle}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{Cl}\ \Uparrow \ c
\end{array}
$$

$$
\operatorname{Linearize}(\mathsf{Cl})\ =\ [C_{0},\ C_{1},\ \ldots ,\ C_{k}]\ \land \ C_{0}\ =\ \mathsf{Cl}
$$

$$
\begin{array}{l}
\operatorname{EffMethods}(\mathsf{Cl})\ =\ \operatorname{FirstByName}(\mathbin{++} \_\{i=0..k\}\ \operatorname{ClassMethods}(C_{i}))\quad \mathsf{where}\ \operatorname{Linearize}(\mathsf{Cl})\ =\ [C_{0},\ \ldots ,\ C_{k}] \\[0.16em]
\operatorname{EffFields}(\mathsf{Cl})\ =\ \operatorname{FirstFieldByName}(\mathbin{++} \_\{i=0..k\}\ \operatorname{ClassFields}(C_{i}))\quad \mathsf{where}\ \operatorname{Linearize}(\mathsf{Cl})\ =\ [C_{0},\ \ldots ,\ C_{k}]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{FirstByName}(\mathsf{ms})\ =\ \operatorname{FirstByName}(\mathsf{ms},\ \emptyset ) \\[0.16em]
\operatorname{FirstByName}([],\ \mathsf{Seen})\ =\ [] \\[0.16em]
\operatorname{FirstByName}(m\ \mathbin{::} \ \mathsf{ms},\ \mathsf{Seen})\ = \\[0.16em]
\ \{\ m\ \mathbin{::} \ \operatorname{FirstByName}(\mathsf{ms},\ \mathsf{Seen}\ \cup \ \{\ m.\mathsf{name}\ \mapsto \ \operatorname{SigSelf}(m)\ \})\quad \mathsf{if}\ m.\mathsf{name}\ \notin \ \operatorname{dom}(\mathsf{Seen}) \\[0.16em]
\quad \operatorname{FirstByName}(\mathsf{ms},\ \mathsf{Seen})\quad \mathsf{if}\ \mathsf{Seen}[m.\mathsf{name}]\ =\ \operatorname{SigSelf}(m) \\[0.16em]
\quad \Uparrow \quad \mathsf{otherwise}\ \}
\end{array}
$$

**(EffMethods-Conflict)**

$$
\begin{array}{l}
\operatorname{FirstByName}(\mathsf{ms})\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{EffMethods}-\mathsf{Conflict}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Emit}(c)
\end{array}
$$

$$
\operatorname{FieldSig}(f)\ =\ \operatorname{SubstSelf}(\mathsf{SelfVar},\ f.\mathsf{type})
$$

$$
\begin{array}{l}
\operatorname{FirstFieldByName}(\mathsf{fs})\ =\ \operatorname{FirstFieldByName}(\mathsf{fs},\ \emptyset ) \\[0.16em]
\operatorname{FirstFieldByName}([],\ \mathsf{Seen})\ =\ [] \\[0.16em]
\operatorname{FirstFieldByName}(f\ \mathbin{::} \ \mathsf{fs},\ \mathsf{Seen})\ = \\[0.16em]
\ \{\ f\ \mathbin{::} \ \operatorname{FirstFieldByName}(\mathsf{fs},\ \mathsf{Seen}\ \cup \ \{\ f.\mathsf{name}\ \mapsto \ \operatorname{FieldSig}(f)\ \})\quad \mathsf{if}\ f.\mathsf{name}\ \notin \ \operatorname{dom}(\mathsf{Seen}) \\[0.16em]
\quad \operatorname{FirstFieldByName}(\mathsf{fs},\ \mathsf{Seen})\quad \mathsf{if}\ \mathsf{Seen}[f.\mathsf{name}]\ =\ \operatorname{FieldSig}(f) \\[0.16em]
\quad \Uparrow \quad \mathsf{otherwise}\ \}
\end{array}
$$

**(EffFields-Conflict)**

$$
\begin{array}{l}
\operatorname{FirstFieldByName}(\mathsf{fs})\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{EffFields}-\mathsf{Conflict}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Emit}(c)
\end{array}
$$

$$
\operatorname{SelfTypeClass}(\mathsf{ty})\ \Leftrightarrow \ \mathsf{ty}\ =\ \mathsf{SelfVar}\ \lor \ \exists \ p.\ \mathsf{ty}\ =\ \operatorname{TypePerm}(p,\ \mathsf{SelfVar})
$$

**(WF-Class-Method)**

$$
\begin{array}{l}
\mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \mathsf{params}_{\mathsf{gen}}\ =\ [P_{1},\ \ldots ,\ P_{n}]\quad \Gamma \ \vdash \ \langle P_{1};\ \ldots ;\ P_{n}\rangle \ \mathsf{wf}\quad \Gamma_{m} \ =\ \operatorname{BindTypeParams}(\Gamma ,\ \mathsf{params}_{\mathsf{gen}})\quad (r\ =\ \operatorname{ReceiverExplicit}(\mathsf{mode}_{\mathsf{opt}},\ \mathsf{ty})\ \Rightarrow \ \operatorname{SelfTypeClass}(\mathsf{ty}))\quad (r\ =\ \operatorname{ReceiverShorthand}(\_)\ \Rightarrow \ \mathsf{true})\quad \Gamma_{m} \ \vdash \ \operatorname{RecvType}(\mathsf{SelfVar},\ r)\ \mathsf{wf}\quad \mathsf{self}\ \notin \ \operatorname{ParamNames}(\mathsf{params})\quad \operatorname{Distinct}(\operatorname{ParamNames}(\mathsf{params}))\quad \forall \ \langle \_,\ \_,\ T_{i}\rangle \ \in \ \mathsf{params},\ \Gamma_{m} \ \vdash \ T_{i}\ \mathsf{wf}\quad (\mathsf{return}_{\mathsf{type}\_\mathsf{opt}}\ =\ \bot \ \lor \ \Gamma_{m} \ \vdash \ \mathsf{return}_{\mathsf{type}\_\mathsf{opt}}\ \mathsf{wf}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \langle \mathsf{ClassMethodDecl},\ \_,\ \_,\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ r,\ \mathsf{params},\ \mathsf{return}_{\mathsf{type}\_\mathsf{opt}},\ \_,\ \mathsf{body}_{\mathsf{opt}},\ \_,\ \_\rangle \ :\ \operatorname{ClassMethodOK}(\mathsf{Cl})
\end{array}
$$

**(T-Class-Method-Body-Abstract)**

$$
\begin{array}{l}
m.\mathsf{body}_{\mathsf{opt}}\ =\ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ m\ :\ \mathsf{ClassMethodBodyOK}
\end{array}
$$

**(T-Class-Method-Body)**

$$
\begin{array}{l}
m.\mathsf{body}_{\mathsf{opt}}\ =\ \mathsf{body}\quad T_{\mathsf{self}}\ =\ \operatorname{RecvType}(\mathsf{SelfVar},\ m.\mathsf{receiver})\quad R_{m}\ =\ \operatorname{ReturnType_T}(\mathsf{SelfVar},\ m)\quad R_{b}\ =\ \operatorname{BodyReturnType}(R_{m})\quad \Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \operatorname{IntroAll}(\Gamma_{0} ,\ [\langle \texttt{self},\ T_{\mathsf{self}}\rangle ]\ \mathbin{++} \ \operatorname{ParamBinds_T}(\mathsf{SelfVar},\ m.\mathsf{params}))\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} ;\ R_{m};\ \bot \ \vdash \ \mathsf{body}\ :\ T_{b}\quad \Gamma \ \vdash \ T_{b}\ \mathrel{<:} \ R_{b}\quad (R_{b}\ \ne \ \operatorname{TypePrim}(\texttt{"()"})\ \Rightarrow \ \operatorname{ExplicitReturn}(\mathsf{body})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ m\ :\ \mathsf{ClassMethodBodyOK}
\end{array}
$$

**(WF-Class)**

$$
\begin{array}{l}
\operatorname{Distinct}(\operatorname{MethodNames}(\mathsf{Cl}))\quad \operatorname{Distinct}(\operatorname{FieldNames}(\mathsf{Cl}))\quad \operatorname{Disjoint}(\operatorname{MethodNames}(\mathsf{Cl}),\ \operatorname{FieldNames}(\mathsf{Cl}))\quad \operatorname{Distinct}(\operatorname{Supers}(\mathsf{Cl}))\quad \forall \ S\ \in \ \operatorname{Supers}(\mathsf{Cl}),\ \Gamma \ \vdash \ S\ :\ \mathsf{ClassPath}\quad \forall \ m\ \in \ \operatorname{ClassMethods}(\mathsf{Cl}),\ \Gamma \ \vdash \ m\ :\ \operatorname{ClassMethodOK}(\mathsf{Cl})\quad \Gamma \ \vdash \ m\ :\ \mathsf{ClassMethodBodyOK}\quad \Gamma \ \vdash \ \operatorname{Linearize}(\mathsf{Cl})\ \Downarrow \ L \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{Cl}\ :\ \mathsf{ClassOk}
\end{array}
$$

### 14.3.5 Dynamic Semantics

Class declarations do not introduce runtime actions by themselves. Observable behavior arises only when concrete method bodies are invoked or when a class participates in dynamic dispatch as defined in §14.6.

### 14.3.6 Lowering

Concrete class methods lower as procedures. Abstract methods, abstract fields, abstract states, and superclass lists do not lower to executable code directly.

Default-method reuse and vtable construction are defined in §14.4 and §14.6.

### 14.3.7 Diagnostics

Diagnostics are defined for duplicate method names, duplicate abstract-field names, class item name conflicts, invalid `Self` receiver forms, undefined superclass paths, superclass linearization cycles, and effective-method or effective-field conflicts introduced by inheritance.

## 14.4 Implementations

### 14.4.1 Syntax

```text
implements_clause ::= "<:" class_path ("," class_path)*
override_method   ::= visibility? "override"? "procedure" identifier signature contract_clause? block
```

Class implementation occurs at the defining record, enum, or modal declaration. Standalone extension implementation blocks are not part of the language.

### 14.4.2 Parsing

**(Parse-Implements-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"<:"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseImplementsOpt}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-Implements-Yes)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"<:"})\quad \Gamma \ \vdash \ \operatorname{ParseClassList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{cls}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseImplementsOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{cls})
\end{array}
$$

**(Parse-ClassList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseClassPath}(P)\ \Downarrow \ (P_{1},\ c_{0})\quad \Gamma \ \vdash \ \operatorname{ParseClassListTail}(P_{1},\ [c_{0}])\ \Downarrow \ (P_{2},\ \mathsf{cs}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClassList}(P)\ \Downarrow \ (P_{2},\ \mathsf{cs})
\end{array}
$$

**(Parse-ClassListTail-End)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClassListTail}(P,\ \mathsf{cs})\ \Downarrow \ (P,\ \mathsf{cs})
\end{array}
$$

**(Parse-ClassListTail-Comma)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParseClassPath}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ c)\quad \Gamma \ \vdash \ \operatorname{ParseClassListTail}(P_{1},\ \mathsf{cs}\ \mathbin{++} \ [c])\ \Downarrow \ (P_{2},\ \mathsf{cs}') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClassListTail}(P,\ \mathsf{cs})\ \Downarrow \ (P_{2},\ \mathsf{cs}')
\end{array}
$$

### 14.4.3 AST Representation / Form

$$
\operatorname{Implements}(T)\ =\ \mathsf{impls}\ \Leftrightarrow \ T\ =\ \operatorname{RecordDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \mathsf{impls},\ \_,\ \_,\ \_,\ \_)\ \lor \ T\ =\ \operatorname{EnumDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \mathsf{impls},\ \_,\ \_,\ \_,\ \_)\ \lor \ T\ =\ \operatorname{ModalDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \mathsf{impls},\ \_,\ \_,\ \_,\ \_)
$$

The surface operator `<:` is overloaded.

1. For records, enums, and modals, `<:` is represented by membership in `Implements(T)`.
2. For classes, `<:` is represented by `Supers(Cl)` together with the superclass rules of §14.3.4.

This section owns only the concrete-implementer relation for records, enums, and modals. Class superclass clauses are not re-encoded as implementation lists here.

$$
\begin{array}{l}
\operatorname{Fields}(T)\ =\ \operatorname{Fields}(R)\ \Leftrightarrow \ T\ =\ \operatorname{TypePath}(p)\ \land \ \operatorname{RecordDecl}(p)\ =\ R \\[0.16em]
\operatorname{Fields}(T)\ =\ []\ \Leftrightarrow \ (T\ =\ \operatorname{TypePath}(p)\ \land \ \operatorname{EnumDecl}(p)\ =\ E)\ \lor \ (T\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}}))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Methods}(T)\ =\ \operatorname{Methods}(R)\ \Leftrightarrow \ T\ =\ \operatorname{TypePath}(p)\ \land \ \operatorname{RecordDecl}(p)\ =\ R \\[0.16em]
\operatorname{Methods}(T)\ =\ []\ \Leftrightarrow \ (T\ =\ \operatorname{TypePath}(p)\ \land \ \operatorname{EnumDecl}(p)\ =\ E)\ \lor \ (T\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}}))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{MethodByName}(T,\ \mathsf{name})\ =\ m'\ \Leftrightarrow \ m'\ \in \ \operatorname{Methods}(T)\ \land \ m'.\mathsf{name}\ =\ \mathsf{name} \\[0.16em]
\operatorname{MethodByName}(T,\ \mathsf{name})\ =\ \bot \ \Leftrightarrow \ \lnot \ \exists \ m'\ \in \ \operatorname{Methods}(T).\ m'.\mathsf{name}\ =\ \mathsf{name}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ClassMethodTable}(\mathsf{Cl})\ =\ \operatorname{EffMethods}(\mathsf{Cl}) \\[0.16em]
\operatorname{ClassFieldTable}(\mathsf{Cl})\ =\ \operatorname{EffFields}(\mathsf{Cl})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ImplModule}(T)\ =\ \operatorname{ModuleOf}(T) \\[0.16em]
\operatorname{ClassModule}(\mathsf{Cl})\ =\ \operatorname{ModuleOf}(\Sigma .\mathsf{Classes}[\mathsf{Cl}])\quad \mathsf{if}\ \mathsf{Cl}\ \in \ \operatorname{dom}(\Sigma .\mathsf{Classes}) \\[0.16em]
\operatorname{ImplOrphanOk}(T,\ \mathsf{Cl})\ \Leftrightarrow \ \operatorname{SameAssembly}(\operatorname{ImplModule}(T),\ \operatorname{CurrentModule}(\Gamma ))\ \lor \ (\mathsf{Cl}\ \in \ \operatorname{dom}(\Sigma .\mathsf{Classes})\ \land \ \operatorname{SameAssembly}(\operatorname{ClassModule}(\mathsf{Cl}),\ \operatorname{CurrentModule}(\Gamma )))
\end{array}
$$

### 14.4.4 Static Semantics

$$
\begin{array}{l}
\operatorname{NoDefaultMethods}(\mathsf{Cl})\ \Leftrightarrow \ \forall \ m\ \in \ \operatorname{ClassMethods}(\mathsf{Cl}).\ m.\mathsf{body}\ =\ \bot  \\[0.16em]
\operatorname{AbstractsImplemented}(T)\ \Leftrightarrow \ \forall \ \mathsf{Cl}\ \in \ \operatorname{Implements}(T).\ \forall \ m\ \in \ \operatorname{ClassMethodTable}(\mathsf{Cl}).\ (m.\mathsf{body}\ =\ \bot \ \Rightarrow \ \operatorname{MethodByName}(T,\ m.\mathsf{name})\ \ne \ \bot )
\end{array}
$$

**(Impl-Abstract-Method)**

$$
\begin{array}{l}
m\ \in \ \operatorname{ClassMethodTable}(\mathsf{Cl})\quad m.\mathsf{body}\ =\ \bot \quad \operatorname{MethodByName}(T,\ m.\mathsf{name})\ =\ m'\quad \operatorname{SigMatch}(T,\ m',\ m)\quad m'.\mathsf{override}\ =\ \mathsf{false} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{implements}\ \mathsf{abstract}\ m
\end{array}
$$

**(Impl-Missing-Method)**

$$
\begin{array}{l}
m\ \in \ \operatorname{ClassMethodTable}(\mathsf{Cl})\quad m.\mathsf{body}\ =\ \bot \quad \operatorname{MethodByName}(T,\ m.\mathsf{name})\ =\ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{ImplementsOk}\ \Uparrow 
\end{array}
$$

**(Impl-AssocType-Missing)**

$$
\begin{array}{l}
a\ \in \ \operatorname{A_abs}(\mathsf{Cl})\quad \lnot (T\ \mathsf{binds}\ a\ \mathsf{for}\ \mathsf{Cl}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{ImplementsOk}\ \Uparrow 
\end{array}
$$

**(Impl-Sig-Err)**

$$
\begin{array}{l}
m\ \in \ \operatorname{ClassMethodTable}(\mathsf{Cl})\quad m.\mathsf{body}\ =\ \bot \quad \operatorname{MethodByName}(T,\ m.\mathsf{name})\ =\ m'\quad \lnot \ \operatorname{SigMatch}(T,\ m',\ m) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{ImplementsOk}\ \Uparrow 
\end{array}
$$

**(Override-Abstract-Err)**

$$
\begin{array}{l}
m\ \in \ \operatorname{ClassMethodTable}(\mathsf{Cl})\quad m.\mathsf{body}\ =\ \bot \quad \operatorname{MethodByName}(T,\ m.\mathsf{name})\ =\ m'\quad \operatorname{SigMatch}(T,\ m',\ m)\quad m'.\mathsf{override}\ =\ \mathsf{true} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{ImplementsOk}\ \Uparrow 
\end{array}
$$

**(Impl-Concrete-Default)**

$$
\begin{array}{l}
m\ \in \ \operatorname{ClassMethodTable}(\mathsf{Cl})\quad m.\mathsf{body}\ \ne \ \bot \quad \operatorname{MethodByName}(T,\ m.\mathsf{name})\ =\ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{uses}\ \mathsf{default}\ m
\end{array}
$$

**(Impl-Concrete-Override)**

$$
\begin{array}{l}
m\ \in \ \operatorname{ClassMethodTable}(\mathsf{Cl})\quad m.\mathsf{body}\ \ne \ \bot \quad \operatorname{MethodByName}(T,\ m.\mathsf{name})\ =\ m'\quad \operatorname{SigMatch}(T,\ m',\ m)\quad m'.\mathsf{override}\ =\ \mathsf{true} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{overrides}\ m
\end{array}
$$

**(Override-Missing-Err)**

$$
\begin{array}{l}
m\ \in \ \operatorname{ClassMethodTable}(\mathsf{Cl})\quad m.\mathsf{body}\ \ne \ \bot \quad \operatorname{MethodByName}(T,\ m.\mathsf{name})\ =\ m'\quad \operatorname{SigMatch}(T,\ m',\ m)\quad m'.\mathsf{override}\ =\ \mathsf{false} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{ImplementsOk}\ \Uparrow 
\end{array}
$$

**(Impl-Sig-Err-Concrete)**

$$
\begin{array}{l}
m\ \in \ \operatorname{ClassMethodTable}(\mathsf{Cl})\quad m.\mathsf{body}\ \ne \ \bot \quad \operatorname{MethodByName}(T,\ m.\mathsf{name})\ =\ m'\quad \lnot \ \operatorname{SigMatch}(T,\ m',\ m) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{ImplementsOk}\ \Uparrow 
\end{array}
$$

**(Override-NoConcrete)**

$$
\begin{array}{l}
m'\ \in \ \operatorname{Methods}(T)\quad m'.\mathsf{override}\ =\ \mathsf{true}\quad \lnot \ \exists \ \mathsf{Cl}\ \in \ \operatorname{Implements}(T).\ \exists \ m\ \in \ \operatorname{ClassMethodTable}(\mathsf{Cl}).\ m.\mathsf{name}\ =\ m'.\mathsf{name}\ \land \ m.\mathsf{body}\ \ne \ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{ImplementsOk}\ \Uparrow 
\end{array}
$$

**(Impl-Field)**

$$
\begin{array}{l}
f\ :\ T_{c}\ \in \ \operatorname{ClassFieldTable}(\mathsf{Cl})\quad f\ :\ T_{i}\ \in \ \operatorname{Fields}(T)\quad T_{i}\ \mathrel{<:} \ T_{c} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{satisfies}\ \mathsf{field}\ f
\end{array}
$$

**(Impl-Field-Missing)**

$$
\begin{array}{l}
f\ :\ T_{c}\ \in \ \operatorname{ClassFieldTable}(\mathsf{Cl})\quad \lnot \ \exists \ T_{i}.\ f\ :\ T_{i}\ \in \ \operatorname{Fields}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{ImplementsOk}\ \Uparrow 
\end{array}
$$

**(Impl-Field-Type-Err)**

$$
\begin{array}{l}
f\ :\ T_{c}\ \in \ \operatorname{ClassFieldTable}(\mathsf{Cl})\quad f\ :\ T_{i}\ \in \ \operatorname{Fields}(T)\quad \lnot (\Gamma \ \vdash \ T_{i}\ \mathrel{<:} \ T_{c}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{ImplementsOk}\ \Uparrow 
\end{array}
$$

**(Impl-Coherence-Err)**

$$
\begin{array}{l}
\lnot \ \operatorname{Distinct}(\operatorname{Implements}(T)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{ImplementsOk}\ \Uparrow 
\end{array}
$$

**(Impl-Orphan-Err)**

$$
\begin{array}{l}
\mathsf{Cl}\ \in \ \operatorname{Implements}(T)\quad \lnot \ \operatorname{ImplOrphanOk}(T,\ \mathsf{Cl}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{ImplementsOk}\ \Uparrow 
\end{array}
$$

**(WF-Impl)**

$$
\begin{array}{l}
\forall \ \mathsf{Cl}\ \in \ \operatorname{Implements}(T),\ \Gamma \ \vdash \ \mathsf{Cl}\ :\ \mathsf{ClassOk}\quad \operatorname{Distinct}(\operatorname{Implements}(T))\quad \forall \ \mathsf{Cl}\ \in \ \operatorname{Implements}(T),\ \operatorname{ImplOrphanOk}(T,\ \mathsf{Cl})\quad \Gamma \ \vdash \ T\ :\ \mathsf{BitcopyDropOk}\quad \forall \ \mathsf{Cl}\ \in \ \operatorname{Implements}(T),\ \forall \ m\ \in \ \operatorname{ClassMethodTable}(\mathsf{Cl}),\ (\Gamma \ \vdash \ T\ \mathsf{implements}\ \mathsf{abstract}\ m\ \lor \ \Gamma \ \vdash \ T\ \mathsf{overrides}\ m\ \lor \ \Gamma \ \vdash \ T\ \mathsf{uses}\ \mathsf{default}\ m)\quad \forall \ \mathsf{Cl}\ \in \ \operatorname{Implements}(T),\ \forall \ f\ \in \ \operatorname{ClassFieldTable}(\mathsf{Cl}),\ \Gamma \ \vdash \ T\ \mathsf{satisfies}\ \mathsf{field}\ f \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{ImplementsOk}
\end{array}
$$

$$
\Gamma \ \vdash \ T\ \mathrel{<:} \ \mathsf{Cl}\ \Leftrightarrow \ \mathsf{Cl}\ \in \ \operatorname{Implements}(T)\ \land \ \Gamma \ \vdash \ T\ :\ \mathsf{ImplementsOk}
$$

A class with abstract states may be implemented only by a modal type.
A type MUST NOT implement the same class more than once.
For every implementation `T <: Cl`, at least one of the implementing declaration `T` or the referenced class `Cl` MUST be defined in the current assembly.

### 14.4.5 Dynamic Semantics

Implementations do not add new runtime state beyond the concrete methods and fields already present on the implementing type. Default-method selection and dynamic dispatch are defined in §14.6.

### 14.4.6 Lowering

Implementation-specific bodies lower exactly as concrete methods on the implementing type. When a required method is satisfied by a class default, lowering reuses the default implementation body as the dispatch target for that `(type, class, method)` triple.

### 14.4.7 Diagnostics

Diagnostics are defined for duplicate implemented classes on a declaration, missing required methods, incompatible method signatures, missing associated-type bindings, misuse of `override`, missing required fields, incompatible field types, and non-modal types attempting to implement modal classes.

## 14.5 Associated Types

### 14.5.1 Syntax

```text
associated_type ::= "type" identifier ("=" type)?
```

In class declarations, the optional `= type` introduces a default. In implementing record bodies, the optional `= type` is the bound associated type body.

### 14.5.2 Parsing

**(Parse-ClassItem-AssociatedType)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{type})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseAssocTypeOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{type}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ConsumeTerminatorReq}(P_{3})\ \Downarrow \ P_{4} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClassItem}(P)\ \Downarrow \ (P_{4},\ \langle \mathsf{AssociatedTypeDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{type}_{\mathsf{opt}},\ \operatorname{SpanBetween}(P,\ P_{4}),\ []\rangle )
\end{array}
$$

**(Parse-AssocTypeOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"="}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseAssocTypeOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-AssocTypeOpt-Yes)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"="})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{ty}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseAssocTypeOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{ty})
\end{array}
$$

**(Parse-AssocTypeDefaultOpt)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAssocTypeOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{ty}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseAssocTypeDefaultOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{ty}_{\mathsf{opt}})
\end{array}
$$

**(Parse-RecordMember-AssociatedType)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{type})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseAssocTypeDefaultOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{default}_{\mathsf{type}\_\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRecordMember}(P)\ \Downarrow \ (P_{3},\ \langle \mathsf{AssociatedTypeDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{default}_{\mathsf{type}\_\mathsf{opt}},\ \operatorname{SpanBetween}(P,\ P_{3}),\ []\rangle )
\end{array}
$$

### 14.5.3 AST Representation / Form

$$
\mathsf{AssociatedTypeDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{type}_{\mathsf{opt}\_\mathsf{or}\_\mathsf{default}\_\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}\rangle 
$$

$$
\begin{array}{l}
\mathsf{ClassItem}\ \mathbin{::} =\ \ldots \ \mid \ \mathsf{AssociatedTypeDecl} \\[0.16em]
\mathsf{RecordMember}\ \mathbin{::} =\ \ldots \ \mid \ \mathsf{AssociatedTypeDecl}
\end{array}
$$

An associated type in a class item is abstract when `type_opt = ⊥` and concrete-defaulted when `type_opt ≠ ⊥`.

$$
\begin{array}{l}
\operatorname{AssocTypeItems}(\mathsf{Cl})\ =\ [a\ \mid \ a\ \in \ \operatorname{ClassItems}(\mathsf{Cl})\ \land \ a\ \mathsf{is}\ \mathsf{AssociatedTypeDecl}] \\[0.16em]
\operatorname{AssocTypeNames}(\mathsf{Cl})\ =\ [a.\mathsf{name}\ \mid \ a\ \in \ \operatorname{AssocTypeItems}(\mathsf{Cl})]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{AssocTypeDefault}(\mathsf{Cl},\ \mathsf{name})\ =\ \mathsf{ty}\ \Leftrightarrow \ \exists \ a\ \in \ \operatorname{AssocTypeItems}(\mathsf{Cl}).\ a.\mathsf{name}\ =\ \mathsf{name}\ \land \ a.\mathsf{type}_{\mathsf{opt}\_\mathsf{or}\_\mathsf{default}\_\mathsf{opt}}\ =\ \mathsf{ty}\ \land \ \mathsf{ty}\ \ne \ \bot  \\[0.16em]
\operatorname{AssocTypeDefault}(\mathsf{Cl},\ \mathsf{name})\ =\ \bot \ \Leftrightarrow \ \lnot \ \exists \ \mathsf{ty}.\ \operatorname{AssocTypeDefault}(\mathsf{Cl},\ \mathsf{name})\ =\ \mathsf{ty}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ImplAssocType}(\operatorname{TypePath}(p),\ \mathsf{name})\ =\ \mathsf{ty}\ \Leftrightarrow \ \operatorname{RecordDecl}(p)\ =\ R\ \land \ \exists \ a\ \in \ R.\mathsf{members}.\ a\ \mathsf{is}\ \mathsf{AssociatedTypeDecl}\ \land \ a.\mathsf{name}\ =\ \mathsf{name}\ \land \ a.\mathsf{type}_{\mathsf{opt}\_\mathsf{or}\_\mathsf{default}\_\mathsf{opt}}\ =\ \mathsf{ty}\ \land \ \mathsf{ty}\ \ne \ \bot  \\[0.16em]
\operatorname{ImplAssocType}(T,\ \mathsf{name})\ =\ \bot \ \Leftrightarrow \ \lnot \ \exists \ \mathsf{ty}.\ \operatorname{ImplAssocType}(T,\ \mathsf{name})\ =\ \mathsf{ty}
\end{array}
$$

$$
\operatorname{A_abs}(\mathsf{Cl})\ =\ \{\ \mathsf{name}\ \mid \ \mathsf{name}\ \in \ \operatorname{AssocTypeNames}(\mathsf{Cl})\ \land \ \operatorname{AssocTypeDefault}(\mathsf{Cl},\ \mathsf{name})\ =\ \bot \ \}
$$

$$
\begin{array}{l}
\operatorname{AssocTypeBinding}(T,\ \mathsf{Cl},\ \mathsf{name})\ =\ \mathsf{ty}\ \Leftrightarrow \ \operatorname{ImplAssocType}(T,\ \mathsf{name})\ =\ \mathsf{ty} \\[0.16em]
\operatorname{AssocTypeBinding}(T,\ \mathsf{Cl},\ \mathsf{name})\ =\ \mathsf{ty}\ \Leftrightarrow \ \operatorname{ImplAssocType}(T,\ \mathsf{name})\ =\ \bot \ \land \ \operatorname{AssocTypeDefault}(\Sigma .\mathsf{Classes}[\mathsf{Cl}],\ \mathsf{name})\ =\ \mathsf{ty} \\[0.16em]
\operatorname{AssocTypeBinding}(T,\ \mathsf{Cl},\ \mathsf{name})\ =\ \bot \ \Leftrightarrow \ \operatorname{ImplAssocType}(T,\ \mathsf{name})\ =\ \bot \ \land \ \operatorname{AssocTypeDefault}(\Sigma .\mathsf{Classes}[\mathsf{Cl}],\ \mathsf{name})\ =\ \bot 
\end{array}
$$

$$
T\ \mathsf{binds}\ \mathsf{name}\ \mathsf{for}\ \mathsf{Cl}\ \Leftrightarrow \ \operatorname{AssocTypeBinding}(T,\ \mathsf{Cl},\ \mathsf{name})\ \ne \ \bot 
$$

### 14.5.4 Static Semantics

Generic class parameters are supplied at use sites. Associated types are supplied by the implementing declaration body.

An abstract associated type in a class must be bound by every implementation of that class. A default associated type in a class may be used when the implementing type does not provide an overriding binding.

$$
\mathsf{In}\ a\ \mathsf{concrete}\ \mathsf{implementing}\ \mathsf{declaration}\ \mathsf{body},\ \mathsf{an}\ \mathsf{associated}-\mathsf{type}\ \mathsf{member}\ \mathsf{is}\ \mathsf{well}-\mathsf{formed}\ \mathsf{only}\ \mathsf{in}\ \mathsf{the}\ \mathsf{bound}\ \mathsf{form}\ \texttt{type Name = Bound}.
$$

Associated-type lookup order is:

1. implementation binding from the implementing declaration body;
2. class default from the referenced class;
3. missing binding.

**Class Alias Equivalence (T-Alias-Equiv)**
type Alias = A + B

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathrel{<:} \ \mathsf{Alias}\ \Leftrightarrow \ \Gamma \ \vdash \ T\ \mathrel{<:} \ A\ \land \ \Gamma \ \vdash \ T\ \mathrel{<:} \ B
\end{array}
$$

### 14.5.5 Dynamic Semantics

Associated types are compile-time declarations only. They introduce no runtime values and no abstract-machine transitions.

### 14.5.6 Lowering

Associated types are erased during type elaboration. No feature-specific runtime representation or ABI form is introduced.

### 14.5.7 Diagnostics

Diagnostics are defined for duplicate associated-type names within a class and for implementations that fail to bind required abstract associated types.

## 14.6 Dynamic Class Objects

### 14.6.1 Syntax

```text
dynamic_type      ::= "$" class_path
dynamic_cast_expr ::= expr "as" dynamic_type
```

Method-call surface syntax on dynamic values is the ordinary `base~>name(args)` form from Chapter 16.

### 14.6.2 Parsing

**(Parse-Dynamic-Type)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"\$"})\quad \Gamma \ \vdash \ \operatorname{ParseTypePath}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{path}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseNonPermType}(P)\ \Downarrow \ (P_{1},\ \operatorname{TypeDynamic}(\mathsf{path}))
\end{array}
$$

No feature-specific parse form exists beyond ordinary cast parsing for `expr as $Class`.

### 14.6.3 AST Representation / Form

$$
\mathsf{Type}\ =\ \operatorname{TypeDynamic}(\mathsf{path})\ \mid \ \ldots 
$$

$$
\begin{array}{l}
\operatorname{DynFields}(\mathsf{Cl})\ =\ [\langle \texttt{data},\ \operatorname{TypeRawPtr}(\texttt{imm},\ \operatorname{TypePrim}(\texttt{"()"}))\rangle ,\ \langle \texttt{vtable},\ \operatorname{TypeRawPtr}(\texttt{imm},\ \operatorname{TypePath}([\texttt{"VTable"}]))\rangle ] \\[0.16em]
\mathsf{DynLayoutJudg}\ =\ \{\mathsf{DynLayout}\}
\end{array}
$$

Dyn(Cl, RawPtr(`imm`, addr), T) is the runtime value form for a dynamic class object whose hidden concrete type is `T`.

$$
\begin{array}{l}
\operatorname{SelfOccurs}(\operatorname{TypePath}([\texttt{Self}]))\ =\ \mathsf{true} \\[0.16em]
\operatorname{SelfOccurs}(\operatorname{TypePerm}(p,\ \mathsf{ty}))\ =\ \operatorname{SelfOccurs}(\mathsf{ty}) \\[0.16em]
\operatorname{SelfOccurs}(\operatorname{TypeTuple}([t_{1},\ \ldots ,\ t_{n}]))\ =\ \lor_{i} \ \operatorname{SelfOccurs}(t_{i}) \\[0.16em]
\operatorname{SelfOccurs}(\operatorname{TypeArray}(\mathsf{ty},\ e))\ =\ \operatorname{SelfOccurs}(\mathsf{ty}) \\[0.16em]
\operatorname{SelfOccurs}(\operatorname{TypeSlice}(\mathsf{ty}))\ =\ \operatorname{SelfOccurs}(\mathsf{ty}) \\[0.16em]
\operatorname{SelfOccurs}(\operatorname{TypeUnion}([t_{1},\ \ldots ,\ t_{n}]))\ =\ \lor_{i} \ \operatorname{SelfOccurs}(t_{i}) \\[0.16em]
\operatorname{SelfOccurs}(\operatorname{TypeFunc}([\langle m_{1},\ t_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ t_{n}\rangle ],\ r))\ =\ (\lor_{i} \ \operatorname{SelfOccurs}(t_{i}))\ \lor \ \operatorname{SelfOccurs}(r) \\[0.16em]
\operatorname{SelfOccurs}(\operatorname{TypePtr}(\_,\ \_))\ =\ \mathsf{false} \\[0.16em]
\operatorname{SelfOccurs}(\operatorname{TypeRawPtr}(\_,\ \_))\ =\ \mathsf{false} \\[0.16em]
\operatorname{SelfOccurs}(\operatorname{TypeString}(\_))\ =\ \mathsf{false} \\[0.16em]
\operatorname{SelfOccurs}(\operatorname{TypeBytes}(\_))\ =\ \mathsf{false} \\[0.16em]
\operatorname{SelfOccurs}(\operatorname{TypeModalState}(\_,\ \_))\ =\ \mathsf{false} \\[0.16em]
\operatorname{SelfOccurs}(\operatorname{TypeDynamic}(\_))\ =\ \mathsf{false} \\[0.16em]
\operatorname{SelfOccurs}(\operatorname{TypePrim}(\_))\ =\ \mathsf{false} \\[0.16em]
\operatorname{SelfOccurs}(\operatorname{TypePath}(p))\ =\ \mathsf{false}\quad \mathsf{if}\ p\ \ne \ [\texttt{Self}]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{HasReceiver}(m)\ \Leftrightarrow \ m.\mathsf{receiver}\ \ne \ \bot  \\[0.16em]
\operatorname{HasGenericParams}(m)\ \Leftrightarrow \ \operatorname{TypeParamsOpt}(m.\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\ \ne \ [] \\[0.16em]
\operatorname{vtable_eligible}(m)\ \Leftrightarrow \ \operatorname{HasReceiver}(m)\ \land \ \lnot \ \operatorname{HasGenericParams}(m)\ \land \ \lnot \ \operatorname{SelfOccurs}(m) \\[0.16em]
\operatorname{dispatchable}(\mathsf{Cl})\ \Leftrightarrow \ \forall \ m\ \in \ \operatorname{EffMethods}(\mathsf{Cl}).\ \operatorname{vtable_eligible}(m)
\end{array}
$$

### 14.6.4 Static Semantics

**(WF-Dynamic)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeDynamic}(p)\quad p\ \in \ \operatorname{dom}(\Sigma .\mathsf{Classes}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}
\end{array}
$$

**(WF-Dynamic-Err)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeDynamic}(p)\quad p\ \notin \ \operatorname{dom}(\Sigma .\mathsf{Classes}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}\ \Uparrow 
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

**(T-Dynamic-Form)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\mathsf{place}\ T\quad \operatorname{IsPlace}(e)\quad \operatorname{AddrOfOk}(e)\quad \Gamma \ \vdash \ \mathsf{Cl}\ :\ \mathsf{ClassPath}\quad \Gamma \ \vdash \ \operatorname{StripPerm}(T)\ \mathrel{<:} \ \mathsf{Cl}\quad \operatorname{dispatchable}(\mathsf{Cl}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ e\ \texttt{as}\ \operatorname{TypeDynamic}(\mathsf{Cl})\ :\ \operatorname{TypeDynamic}(\mathsf{Cl})
\end{array}
$$

**(Dynamic-NonDispatchable)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\mathsf{place}\ T\quad \operatorname{IsPlace}(e)\quad \Gamma \ \vdash \ \mathsf{Cl}\ :\ \mathsf{ClassPath}\quad \Gamma \ \vdash \ \operatorname{StripPerm}(T)\ \mathrel{<:} \ \mathsf{Cl}\quad \lnot \ \operatorname{dispatchable}(\mathsf{Cl}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ e\ \texttt{as}\ \operatorname{TypeDynamic}(\mathsf{Cl})\ \Uparrow 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LookupMethod}(T,\ \mathsf{name})\ =\ m\ \Leftrightarrow \ \operatorname{MethodByName}(T,\ \mathsf{name})\ =\ m \\[0.16em]
\operatorname{LookupMethod}(T,\ \mathsf{name})\ =\ m\ \Leftrightarrow \ \operatorname{MethodByName}(T,\ \mathsf{name})\ =\ \bot \ \land \ \mid \operatorname{ClassDefaults}(T,\ \mathsf{name})\mid \ =\ 1\ \land \ m\ \in \ \operatorname{ClassDefaults}(T,\ \mathsf{name}) \\[0.16em]
\operatorname{LookupMethod}(T,\ \mathsf{name})\ =\ \bot \ \Leftrightarrow \ \operatorname{MethodByName}(T,\ \mathsf{name})\ =\ \bot \ \land \ (\mid \operatorname{ClassDefaults}(T,\ \mathsf{name})\mid \ =\ 0\ \lor \ \mid \operatorname{ClassDefaults}(T,\ \mathsf{name})\mid \ >\ 1)
\end{array}
$$

**(T-Dynamic-MethodCall)**

$$
\begin{array}{l}
\operatorname{RecvBaseType}(\mathsf{base},\ \operatorname{RecvMode}(m.\mathsf{receiver}))\ =\ P_{\mathsf{caller}}\ \operatorname{TypeDynamic}(\mathsf{Cl})\quad \operatorname{LookupClassMethod}(\mathsf{Cl},\ \mathsf{name})\ =\ m\quad \operatorname{RecvPerm}(\mathsf{SelfVar},\ m.\mathsf{receiver})\ =\ P_{\mathsf{method}}\quad \operatorname{PermAdmits}(P_{\mathsf{caller}},\ P_{\mathsf{method}})\quad \operatorname{RecvArgOk}(\mathsf{base},\ \operatorname{RecvMode}(m.\mathsf{receiver}))\quad \Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk}(m.\mathsf{params},\ \mathsf{args}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{MethodCall}(\mathsf{base},\ \mathsf{name},\ \mathsf{args})\ :\ \operatorname{ReturnType}(m)
\end{array}
$$

**(LookupClassMethod-NotFound)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{base}\ :\ \operatorname{TypeDynamic}(\mathsf{Cl})\quad \operatorname{LookupClassMethod}(\mathsf{Cl},\ \mathsf{name})\ \mathsf{undefined} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{MethodCall}(\mathsf{base},\ \mathsf{name},\ \mathsf{args})\ \Uparrow 
\end{array}
$$

Dynamic dispatch is permitted only for dispatchable classes, that is, classes whose effective method set is entirely vtable-eligible.

### 14.6.5 Dynamic Semantics

$$
\operatorname{ValueType}(\operatorname{Dyn}(\mathsf{Cl},\ \operatorname{RawPtr}(\texttt{imm},\ \mathsf{addr}),\ T))\ =\ \operatorname{TypeDynamic}(\mathsf{Cl})
$$

**(Eval-Dynamic-Form)**

$$
\begin{array}{l}
\operatorname{IsPlace}(e)\quad \Gamma \ \vdash \ \operatorname{AddrOfSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{addr}),\ \sigma_{1} )\quad T_{e}\ =\ \operatorname{ExprType}(e)\quad T\ =\ \operatorname{StripPerm}(T_{e})\quad \Gamma \ \vdash \ T\ \mathrel{<:} \ \mathsf{Cl} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(e\ \texttt{as}\ \operatorname{TypeDynamic}(\mathsf{Cl}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{Dyn}(\mathsf{Cl},\ \operatorname{RawPtr}(\texttt{imm},\ \mathsf{addr}),\ T)),\ \sigma_{1} )
\end{array}
$$

**(Eval-Dynamic-Form-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{AddrOfSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(e\ \texttt{as}\ \operatorname{TypeDynamic}(\mathsf{Cl}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Dispatch}(T,\ \mathsf{Cl},\ \mathsf{name})\ =\ m'\ \Leftrightarrow \ m\ =\ \operatorname{LookupClassMethod}(\mathsf{Cl},\ \mathsf{name})\ \land \ \operatorname{MethodByName}(T,\ \mathsf{name})\ =\ m'\ \land \ \operatorname{SigMatch}(T,\ m',\ m) \\[0.16em]
\operatorname{Dispatch}(T,\ \mathsf{Cl},\ \mathsf{name})\ =\ m\ \Leftrightarrow \ m\ =\ \operatorname{LookupClassMethod}(\mathsf{Cl},\ \mathsf{name})\ \land \ (\operatorname{MethodByName}(T,\ \mathsf{name})\ =\ \bot \ \lor \ (\exists \ m'.\ \operatorname{MethodByName}(T,\ \mathsf{name})\ =\ m'\ \land \ \lnot \ \operatorname{SigMatch}(T,\ m',\ m)))\ \land \ m.\mathsf{body}\ \ne \ \bot  \\[0.16em]
\operatorname{Dispatch}(T,\ \mathsf{Cl},\ \mathsf{name})\ =\ \bot \ \Leftrightarrow \ m\ =\ \operatorname{LookupClassMethod}(\mathsf{Cl},\ \mathsf{name})\ \land \ (\operatorname{MethodByName}(T,\ \mathsf{name})\ =\ \bot \ \lor \ (\exists \ m'.\ \operatorname{MethodByName}(T,\ \mathsf{name})\ =\ m'\ \land \ \lnot \ \operatorname{SigMatch}(T,\ m',\ m)))\ \land \ m.\mathsf{body}\ =\ \bot 
\end{array}
$$

$$
\operatorname{MethodTarget}(\operatorname{Dyn}(\mathsf{Cl},\ \operatorname{RawPtr}(\texttt{imm},\ \mathsf{addr}),\ T),\ \mathsf{name})\ =\ \operatorname{Dispatch}(T,\ \mathsf{Cl},\ \mathsf{name})
$$

### 14.6.6 Lowering

**(Layout-DynamicClass)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DynLayout}(\mathsf{Cl})\ \Downarrow \ \langle 2\ \times \ \mathsf{PtrSize},\ \mathsf{PtrAlign},\ \operatorname{DynFields}(\mathsf{Cl})\rangle 
\end{array}
$$

**(Size-DynamicClass)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeDynamic}(\mathsf{Cl}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ 2\ \times \ \mathsf{PtrSize}
\end{array}
$$

**(Align-DynamicClass)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeDynamic}(\mathsf{Cl}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{PtrAlign}
\end{array}
$$

**(ABI-Dynamic)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{DynLayout}(\mathsf{Cl})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ABITy}(\operatorname{TypeDynamic}(\mathsf{Cl}))\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

$$
\operatorname{ValueBits}(\operatorname{TypeDynamic}(\mathsf{Cl}),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ v\ =\ \operatorname{Dyn}(\mathsf{Cl},\ \operatorname{RawPtr}(\texttt{imm},\ \mathsf{addr}),\ T)\ \land \ \mathsf{sym}\ =\ \operatorname{ScopedSym}(\operatorname{VTableDecl}(T,\ \mathsf{Cl}))\ \land \ \mathsf{addr}_{\mathsf{vt}}\ =\ \operatorname{AddrOfSym}(\mathsf{sym})\ \land \ \operatorname{RecordLayout}(\operatorname{DynFields}(\mathsf{Cl}))\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \ \land \ \operatorname{StructBits}([\operatorname{TypeRawPtr}(\texttt{imm},\ \operatorname{TypePrim}(\texttt{"()"})),\ \operatorname{TypeRawPtr}(\texttt{imm},\ \operatorname{TypePath}([\texttt{"VTable"}]))],\ [\operatorname{RawPtr}(\texttt{imm},\ \mathsf{addr}),\ \operatorname{RawPtr}(\texttt{imm},\ \mathsf{addr}_{\mathsf{vt}})],\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{bits}
$$

$$
\begin{array}{l}
\mathsf{DynDispatchJudg}\ =\ \{\mathsf{VTable},\ \mathsf{VSlot},\ \mathsf{DynPack},\ \mathsf{LowerDynCall}\} \\[0.16em]
\operatorname{VTableEligible}(\mathsf{Cl})\ =\ [\ m\ \in \ \operatorname{EffMethods}(\mathsf{Cl})\ \mid \ \operatorname{vtable_eligible}(m)\ ]
\end{array}
$$

**(DispatchSym-Impl)**

$$
\begin{array}{l}
\operatorname{LookupClassMethod}(\mathsf{Cl},\ \mathsf{name})\ =\ m\quad \operatorname{MethodByName}(T,\ \mathsf{name})\ =\ m'\quad \operatorname{SigMatch}(T,\ m',\ m)\quad \Gamma \ \vdash \ \operatorname{Mangle}(m')\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DispatchSym}(T,\ \mathsf{Cl},\ \mathsf{name})\ \Downarrow \ \mathsf{sym}
\end{array}
$$

**(DispatchSym-Default-None)**

$$
\begin{array}{l}
\operatorname{LookupClassMethod}(\mathsf{Cl},\ \mathsf{name})\ =\ m\quad \operatorname{MethodByName}(T,\ \mathsf{name})\ =\ \bot \quad m.\mathsf{body}_{\mathsf{opt}}\ \ne \ \bot \quad \Gamma \ \vdash \ \operatorname{Mangle}(\operatorname{DefaultImpl}(T,\ m))\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DispatchSym}(T,\ \mathsf{Cl},\ \mathsf{name})\ \Downarrow \ \mathsf{sym}
\end{array}
$$

**(DispatchSym-Default-Mismatch)**

$$
\begin{array}{l}
\operatorname{LookupClassMethod}(\mathsf{Cl},\ \mathsf{name})\ =\ m\quad \operatorname{MethodByName}(T,\ \mathsf{name})\ =\ m'\quad \lnot \ \operatorname{SigMatch}(T,\ m',\ m)\quad m.\mathsf{body}_{\mathsf{opt}}\ \ne \ \bot \quad \Gamma \ \vdash \ \operatorname{Mangle}(\operatorname{DefaultImpl}(T,\ m))\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DispatchSym}(T,\ \mathsf{Cl},\ \mathsf{name})\ \Downarrow \ \mathsf{sym}
\end{array}
$$

**(VTable-Order)**

$$
\begin{array}{l}
\operatorname{VTableEligible}(\mathsf{Cl})\ =\ [m_{1},\ \ldots ,\ m_{k}]\quad \forall \ i,\ \operatorname{DispatchSym}(T,\ \mathsf{Cl},\ m_{i}.\mathsf{name})\ =\ \mathsf{sym}_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{VTable}(T,\ \mathsf{Cl})\ \Downarrow \ [\mathsf{sym}_{1},\ \ldots ,\ \mathsf{sym}_{k}]
\end{array}
$$

**(VSlot-Entry)**

$$
\begin{array}{l}
\operatorname{VTableEligible}(\mathsf{Cl})\ =\ [m_{0},\ \ldots ,\ m\_\{k-1\}]\quad m_{i}.\mathsf{name}\ =\ \mathsf{method}.\mathsf{name} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{VSlot}(\mathsf{Cl},\ \mathsf{method})\ \Downarrow \ i
\end{array}
$$

**(Lower-Dynamic-Form)**

$$
\begin{array}{l}
\operatorname{IsPlace}(e)\quad \Gamma \ \vdash \ \operatorname{LowerAddrOf}(e)\ \Downarrow \ \langle \mathsf{IR},\ \mathsf{addr}\rangle \quad T_{e}\ =\ \operatorname{ExprType}(e)\quad T\ =\ \operatorname{StripPerm}(T_{e})\quad \Gamma \ \vdash \ T\ \mathrel{<:} \ \mathsf{Cl} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DynPack}(T,\ e)\ \Downarrow \ \langle \operatorname{RawPtr}(\texttt{imm},\ \mathsf{addr}),\ \operatorname{VTable}(T,\ \mathsf{Cl})\rangle 
\end{array}
$$

**(Lower-DynCall)**

$$
\begin{array}{l}
\operatorname{VSlot}(\mathsf{Cl},\ \mathsf{name})\ \Downarrow \ i \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerDynCall}(\mathsf{base},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ \operatorname{SeqIR}(\operatorname{CallVTable}(\mathsf{base},\ i,\ \mathsf{args}),\ \mathsf{PanicCheck})
\end{array}
$$

**(EmitVTable-Decl)**

$$
\begin{array}{l}
\operatorname{Mangle}(\operatorname{VTableDecl}(T,\ \mathsf{Cl}))\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitVTable}(T,\ \mathsf{Cl})\ \Downarrow \ \operatorname{GlobalVTable}(\mathsf{sym},\ \operatorname{VTableHeader}(T),\ \operatorname{VTable}(T,\ \mathsf{Cl}))
\end{array}
$$

### 14.6.7 Diagnostics

Diagnostics are defined for dynamic casts to undefined or non-dispatchable classes, dynamic method lookup failures, direct calls to dynamically-dispatched `drop`, and vtable emission failures.

## 14.7 Opaque Types

### 14.7.1 Syntax

```text
opaque_type ::= "opaque" class_path
```

Opaque types are type forms and therefore compose with the ordinary declaration and return-type syntactic positions that accept `type`.

### 14.7.2 Parsing

**(Parse-Opaque-Type)**

$$
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \operatorname{Lexeme}(\operatorname{Tok}(P))\ =\ \texttt{opaque}\quad \Gamma \ \vdash \ \operatorname{ParseTypePath}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{path}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseNonPermType}(P)\ \Downarrow \ (P_{1},\ \operatorname{TypeOpaque}(\mathsf{path}))
\end{array}
$$

### 14.7.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{Type}\ =\ \operatorname{TypeOpaque}(\mathsf{path})\ \mid \ \ldots  \\[0.16em]
\mathsf{TypeOpaque}\ =\ \langle \mathsf{path}\rangle 
\end{array}
$$

### 14.7.4 Static Semantics

**(WF-Opaque)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeOpaque}(\mathsf{path})\quad \mathsf{path}\ \in \ \operatorname{dom}(\Sigma .\mathsf{Classes}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}
\end{array}
$$

**(WF-Opaque-Err)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeOpaque}(\mathsf{path})\quad \mathsf{path}\ \notin \ \operatorname{dom}(\Sigma .\mathsf{Classes}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}\ \Uparrow 
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

**(T-Opaque-Return)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \mathsf{body}\ :\ T\quad \Gamma \ \vdash \ T\ \mathrel{<:} \ \mathsf{Cl}\quad \operatorname{return_type}(f)\ =\ \mathsf{opaque}\ \mathsf{Cl} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ f\ :\ ()\ \to \ \mathsf{opaque}\ \mathsf{Cl}
\end{array}
$$

**(T-Opaque-Project)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{f}()\ :\ \mathsf{opaque}\ \mathsf{Cl}\quad m\ \in \ \operatorname{interface}(\mathsf{Cl}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{f}()\sim{}>\operatorname{m}(\mathsf{args})\ :\ R_{m}
\end{array}
$$

Two opaque types are equivalent exactly when they name the same class path. Opaque values expose only the class interface named by that path.

### 14.7.5 Dynamic Semantics

Opaque types add no runtime wrapper. The callee returns a concrete value implementing the named class, and the caller observes that value only through the statically-restricted opaque interface.

### 14.7.6 Lowering

Opaque types incur no distinct runtime representation or ABI form. Lowering uses the underlying concrete type chosen by the defining body.

### 14.7.7 Diagnostics

Diagnostics are defined for opaque types naming undefined classes, member access outside the named class interface, and assignment or matching between opaque types with incompatible class paths.

## 14.8 Refinement Types

### 14.8.1 Syntax

```text
refinement_type       ::= type "|:" "{" predicate_expr "}"
type_alias_decl       ::= visibility? "type" identifier "=" type "|:" "{" predicate_expr "}"
param_with_constraint ::= identifier ":" type "|:" "{" predicate_expr "}"
```

Within a standalone refinement type, `self` denotes the constrained value.

### 14.8.2 Parsing

**(Parse-RefinementOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|:"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRefinementOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-RefinementOpt-Yes)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|:"})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParsePredicateExpr}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ \mathsf{pred})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRefinementOpt}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \mathsf{pred})
\end{array}
$$

$$
\operatorname{ParsePredicateExpr}(P)\ \Downarrow \ (P_{1},\ e)\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{ParseExpr}(P)\ \Downarrow \ (P_{1},\ e)
$$

### 14.8.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{Type}\ =\ \operatorname{TypeRefine}(\mathsf{base},\ \mathsf{pred})\ \mid \ \ldots  \\[0.16em]
\mathsf{TypeRefine}\ =\ \langle \mathsf{base},\ \mathsf{pred}\rangle 
\end{array}
$$

$$
\operatorname{PredicateEquiv}(P_{1},\ P_{2})\ \Leftrightarrow \ \forall \ \sigma .\ (\operatorname{Eval}(P_{1},\ \sigma )\ =\ \mathsf{true}\ \Leftrightarrow \ \operatorname{Eval}(P_{2},\ \sigma )\ =\ \mathsf{true})
$$

### 14.8.4 Static Semantics

**(T-Equiv-Refine)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRefine}(T_{0},\ P_{1})\quad U\ =\ \operatorname{TypeRefine}(U_{0},\ P_{2})\quad \Gamma \ \vdash \ T_{0}\ \equiv \ U_{0}\quad \operatorname{PredicateEquiv}(P_{1},\ P_{2}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Refine-Norm)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRefine}(\operatorname{TypeRefine}(T_{0},\ P_{1}),\ P_{2})\quad U\ =\ \operatorname{TypeRefine}(T_{0},\ P_{1}\ \land \ P_{2}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(WF-Refine-Type)**

$$
\begin{array}{l}
\Gamma \ \vdash \ T\ \mathsf{wf}\quad \Gamma ,\ \texttt{self}\ :\ T\ \vdash \ P\ :\ \texttt{bool}\quad \operatorname{Pure}(P) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ (T\ \mid :\ \{P\})\ \mathsf{wf}
\end{array}
$$

**(T-Refine-Intro)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ :\ T\quad \Gamma \ \vdash \ \operatorname{F}(P[e/\texttt{self}],\ L)\quad L\ \mathsf{dominates}\ \mathsf{current}\ \mathsf{location} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ e\ :\ T\ \mid :\ \{P\}
\end{array}
$$

**(T-Refine-Elim)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ :\ T\ \mid :\ \{P\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ e\ :\ T
\end{array}
$$

Subtyping relations:

$$
\Gamma \ \vdash \ (T\ \mid :\ \{P\})\ \mathrel{<:} \ T
$$

$$
\begin{array}{l}
\Gamma \ \vdash \ P\ \Rightarrow \ Q \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ (T\ \mid :\ \{P\})\ \mathrel{<:} \ (T\ \mid :\ \{Q\})
\end{array}
$$

Implementations MUST support the following decidable predicate fragment: literal comparisons, bound propagation from control flow, syntactic equality up to alpha-renaming, transitive integer inequalities, and boolean combinations thereof.

Refinement predicates are statically verified by default. If proof fails outside `[[dynamic]]`, the program is ill-formed. If proof fails inside `[[dynamic]]`, lowering inserts a runtime check.

### 14.8.5 Dynamic Semantics

Refinement types do not alter the underlying value representation. Failed dynamically-inserted refinement checks panic.

### 14.8.6 Lowering

**(LLVMTy-Refine)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMTy}(\operatorname{TypeRefine}(T,\ P))\ \Downarrow \ \tau 
\end{array}
$$

Feature-local lowering consists only of optional runtime predicate checks when static verification is not discharged inside `[[dynamic]]` scopes.

### 14.8.7 Diagnostics

Diagnostics are defined for ill-formed or impure refinement predicates, failed static proof obligations for refinement introduction, and failing dynamic refinement checks.

## 14.9 Capability Classes

### 14.9.1 Syntax

Capability classes use the ordinary class syntax from §14.3 and dynamic class type syntax from §14.6. No distinct surface grammar is introduced.

### 14.9.2 Parsing

Capability classes have no feature-specific parser beyond ordinary class parsing and `$Class` type parsing.

### 14.9.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{CapClass}\ =\ \{\texttt{FileSystem},\ \texttt{Network},\ \texttt{HeapAllocator},\ \texttt{ExecutionDomain},\ \texttt{Reactor},\ \texttt{Time},\ \texttt{MonotonicTime},\ \texttt{WallTime}\} \\[0.16em]
\operatorname{CapType}(\mathsf{Cl})\ =\ \operatorname{TypeDynamic}(\mathsf{Cl})
\end{array}
$$

FileSystemInterface =
{

$$
\begin{array}{l}
\ \langle \texttt{"open\_read"},\ \texttt{const},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeUnion}([\operatorname{TypeModalState}([\texttt{"File"}],\ \texttt{@Read}),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"open\_write"},\ \texttt{const},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeUnion}([\operatorname{TypeModalState}([\texttt{"File"}],\ \texttt{@Write}),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"open\_append"},\ \texttt{const},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeUnion}([\operatorname{TypeModalState}([\texttt{"File"}],\ \texttt{@Append}),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"create\_write"},\ \texttt{const},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeUnion}([\operatorname{TypeModalState}([\texttt{"File"}],\ \texttt{@Write}),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"read\_file"},\ \texttt{const},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeString}(\texttt{@Managed})),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"read\_bytes"},\ \texttt{const},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeBytes}(\texttt{@Managed})),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"write\_file"},\ \texttt{const},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ,\ \langle \bot ,\ \texttt{data},\ \operatorname{TypeBytes}(\texttt{@View})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"write\_stdout"},\ \texttt{const},\ [\langle \bot ,\ \texttt{data},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"write\_stderr"},\ \texttt{const},\ [\langle \bot ,\ \texttt{data},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"exists"},\ \texttt{const},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypePrim}(\texttt{"bool"})\rangle , \\[0.16em]
\ \langle \texttt{"remove"},\ \texttt{const},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"open\_dir"},\ \texttt{const},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeUnion}([\operatorname{TypeModalState}([\texttt{"DirIter"}],\ \texttt{@Open}),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"create\_dir"},\ \texttt{const},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"ensure\_dir"},\ \texttt{const},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"kind"},\ \texttt{const},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeUnion}([\operatorname{TypePath}([\texttt{"FileKind"}]),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"restrict"},\ \texttt{const},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeDynamic}(\texttt{FileSystem})\rangle  \\[0.16em]
\}
\end{array}
$$

NetworkInterface =
{

$$
\begin{array}{l}
\ \langle \texttt{"restrict\_to\_host"},\ \texttt{const},\ [\langle \bot ,\ \texttt{host},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeDynamic}(\texttt{Network})\rangle  \\[0.16em]
\}
\end{array}
$$

HeapAllocatorInterface =
{

$$
\begin{array}{l}
\ \langle \texttt{"with\_quota"},\ \texttt{const},\ [\langle \bot ,\ \texttt{size},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ],\ \operatorname{TypeDynamic}(\texttt{HeapAllocator})\rangle , \\[0.16em]
\ \langle \texttt{"alloc\_raw"},\ \texttt{const},\ [\langle \bot ,\ \texttt{count},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ],\ \operatorname{TypeRawPtr}(\texttt{mut},\ \operatorname{TypePrim}(\texttt{"u8"}))\rangle , \\[0.16em]
\ \langle \texttt{"dealloc\_raw"},\ \texttt{const},\ [\langle \bot ,\ \texttt{ptr},\ \operatorname{TypeRawPtr}(\texttt{mut},\ \operatorname{TypePrim}(\texttt{"u8"}))\rangle ,\ \langle \bot ,\ \texttt{count},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ],\ \operatorname{TypePrim}(\texttt{"()"})\rangle  \\[0.16em]
\}
\end{array}
$$

TimeInterface =
{

$$
\begin{array}{l}
\ \langle \texttt{"monotonic"},\ \texttt{const},\ [],\ \operatorname{TypeDynamic}(\texttt{MonotonicTime})\rangle , \\[0.16em]
\ \langle \texttt{"wall"},\ \texttt{const},\ [],\ \operatorname{TypeDynamic}(\texttt{WallTime})\rangle  \\[0.16em]
\}
\end{array}
$$

MonotonicTimeInterface =
{

$$
\begin{array}{l}
\ \langle \texttt{"now"},\ \texttt{const},\ [],\ \operatorname{TypePath}([\texttt{"MonotonicInstant"}])\rangle , \\[0.16em]
\ \langle \texttt{"resolution"},\ \texttt{const},\ [],\ \operatorname{TypePath}([\texttt{"Duration"}])\rangle , \\[0.16em]
\ \langle \texttt{"elapsed"},\ \texttt{const},\ [\langle \bot ,\ \texttt{start},\ \operatorname{TypePath}([\texttt{"MonotonicInstant"}])\rangle ,\ \langle \bot ,\ \texttt{end},\ \operatorname{TypePath}([\texttt{"MonotonicInstant"}])\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePath}([\texttt{"Duration"}]),\ \operatorname{TypePath}([\texttt{"TimeError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"coarsen"},\ \texttt{const},\ [\langle \bot ,\ \texttt{resolution},\ \operatorname{TypePath}([\texttt{"Duration"}])\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypeDynamic}(\texttt{MonotonicTime}),\ \operatorname{TypePath}([\texttt{"TimeError"}])])\rangle  \\[0.16em]
\}
\end{array}
$$

WallTimeInterface =
{

$$
\begin{array}{l}
\ \langle \texttt{"now\_utc"},\ \texttt{const},\ [],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePath}([\texttt{"UtcInstant"}]),\ \operatorname{TypePath}([\texttt{"TimeError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"resolution"},\ \texttt{const},\ [],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePath}([\texttt{"Duration"}]),\ \operatorname{TypePath}([\texttt{"TimeError"}])])\rangle , \\[0.16em]
\ \langle \texttt{"coarsen"},\ \texttt{const},\ [\langle \bot ,\ \texttt{resolution},\ \operatorname{TypePath}([\texttt{"Duration"}])\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypeDynamic}(\texttt{WallTime}),\ \operatorname{TypePath}([\texttt{"TimeError"}])])\rangle  \\[0.16em]
\}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{FileKindVariants}\ =\ [ \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{File},\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{Dir},\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{Other},\ \bot ,\ \bot ,\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{FileKindDecl}\ =\ \operatorname{EnumDecl}(\bot ,\ \texttt{public},\ \texttt{FileKind},\ \bot ,\ \bot ,\ [],\ \mathsf{FileKindVariants},\ \bot ,\ \bot ,\ \bot )
\end{array}
$$

$$
\begin{array}{l}
\mathsf{IoErrorVariants}\ =\ [ \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{NotFound},\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{PermissionDenied},\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{AlreadyExists},\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{InvalidPath},\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{Busy},\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{IoFailure},\ \bot ,\ \bot ,\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{IoErrorDecl}\ =\ \operatorname{EnumDecl}(\bot ,\ \texttt{public},\ \texttt{IoError},\ \bot ,\ \bot ,\ [],\ \mathsf{IoErrorVariants},\ \bot ,\ \bot ,\ \bot )
\end{array}
$$

$$
\begin{array}{l}
\mathsf{DirEntryFields}\ =\ [ \\[0.16em]
\ \langle \bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{name},\ \operatorname{TypeString}(\texttt{@Managed}),\ \bot ,\ \bot ,\ \bot \rangle , \\[0.16em]
\ \langle \bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{path},\ \operatorname{TypeString}(\texttt{@Managed}),\ \bot ,\ \bot ,\ \bot \rangle , \\[0.16em]
\ \langle \bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{kind},\ \operatorname{TypePath}([\texttt{"FileKind"}]),\ \bot ,\ \bot ,\ \bot \rangle  \\[0.16em]
] \\[0.16em]
\mathsf{DirEntryDecl}\ =\ \operatorname{RecordDecl}(\bot ,\ \texttt{public},\ \texttt{DirEntry},\ \bot ,\ \bot ,\ [],\ \mathsf{DirEntryFields},\ \bot ,\ \bot ,\ \bot )
\end{array}
$$

$$
\begin{array}{l}
\mathsf{AllocationErrorVariants}\ =\ [ \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{OutOfMemory},\ \operatorname{TuplePayload}([\operatorname{TypePrim}(\texttt{"usize"})]),\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{QuotaExceeded},\ \operatorname{TuplePayload}([\operatorname{TypePrim}(\texttt{"usize"})]),\ \bot ,\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{AllocationErrorDecl}\ =\ \operatorname{EnumDecl}(\bot ,\ \texttt{public},\ \texttt{AllocationError},\ \bot ,\ \bot ,\ [],\ \mathsf{AllocationErrorVariants},\ \bot ,\ \bot ,\ \bot )
\end{array}
$$

$$
\begin{array}{l}
\mathsf{TimeErrorVariants}\ =\ [ \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{Unsupported},\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{ClockUnavailable},\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{OutOfRange},\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{InvalidResolution},\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{ClockMismatch},\ \bot ,\ \bot ,\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{TimeErrorDecl}\ =\ \operatorname{EnumDecl}(\bot ,\ \texttt{public},\ \texttt{TimeError},\ \bot ,\ \bot ,\ [],\ \mathsf{TimeErrorVariants},\ \bot ,\ \bot ,\ \bot )
\end{array}
$$

$$
\begin{array}{l}
\mathsf{DurationFields}\ =\ [ \\[0.16em]
\ \langle \bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{nanoseconds},\ \operatorname{TypePrim}(\texttt{"u128"}),\ \bot ,\ \bot ,\ \bot \rangle  \\[0.16em]
] \\[0.16em]
\mathsf{DurationDecl}\ =\ \operatorname{RecordDecl}(\bot ,\ \texttt{public},\ \texttt{Duration},\ \bot ,\ \bot ,\ [],\ \mathsf{DurationFields},\ \bot ,\ \bot ,\ \bot )
\end{array}
$$

$$
\begin{array}{l}
\mathsf{MonotonicInstantFields}\ =\ [ \\[0.16em]
\ \langle \bot ,\ \texttt{private},\ \mathsf{false},\ \texttt{domain},\ \operatorname{TypePrim}(\texttt{"usize"}),\ \bot ,\ \bot ,\ \bot \rangle , \\[0.16em]
\ \langle \bot ,\ \texttt{private},\ \mathsf{false},\ \texttt{ticks},\ \operatorname{TypePrim}(\texttt{"u128"}),\ \bot ,\ \bot ,\ \bot \rangle  \\[0.16em]
] \\[0.16em]
\mathsf{MonotonicInstantDecl}\ =\ \operatorname{RecordDecl}(\bot ,\ \texttt{public},\ \texttt{MonotonicInstant},\ \bot ,\ \bot ,\ [],\ \mathsf{MonotonicInstantFields},\ \bot ,\ \bot ,\ \bot )
\end{array}
$$

$$
\begin{array}{l}
\mathsf{UtcInstantFields}\ =\ [ \\[0.16em]
\ \langle \bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{unix\_nanoseconds},\ \operatorname{TypePrim}(\texttt{"i128"}),\ \bot ,\ \bot ,\ \bot \rangle  \\[0.16em]
] \\[0.16em]
\mathsf{UtcInstantDecl}\ =\ \operatorname{RecordDecl}(\bot ,\ \texttt{public},\ \texttt{UtcInstant},\ \bot ,\ \bot ,\ [],\ \mathsf{UtcInstantFields},\ \bot ,\ \bot ,\ \bot )
\end{array}
$$

$$
\begin{array}{l}
\mathsf{ContextFields}\ =\ [ \\[0.16em]
\ \langle \bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{fs},\ \operatorname{TypeDynamic}(\texttt{FileSystem}),\ \bot ,\ \bot ,\ \bot \rangle , \\[0.16em]
\ \langle \bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{net},\ \operatorname{TypeDynamic}(\texttt{Network}),\ \bot ,\ \bot ,\ \bot \rangle , \\[0.16em]
\ \langle \bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{heap},\ \operatorname{TypeDynamic}(\texttt{HeapAllocator}),\ \bot ,\ \bot ,\ \bot \rangle , \\[0.16em]
\ \langle \bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{sys},\ \operatorname{TypePath}([\texttt{"System"}]),\ \bot ,\ \bot ,\ \bot \rangle , \\[0.16em]
\ \langle \bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{reactor},\ \operatorname{TypeDynamic}(\texttt{Reactor}),\ \bot ,\ \bot ,\ \bot \rangle , \\[0.16em]
\ \langle \bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{time},\ \operatorname{TypeDynamic}(\texttt{Time}),\ \bot ,\ \bot ,\ \bot \rangle  \\[0.16em]
] \\[0.16em]
\mathsf{ContextMethods}\ =\ [ \\[0.16em]
\ \operatorname{MethodDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{"cpu"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [],\ \operatorname{TypeDynamic}(\texttt{ExecutionDomain}),\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{MethodDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{"gpu"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [],\ \operatorname{TypeDynamic}(\texttt{ExecutionDomain}),\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{MethodDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{"inline"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [],\ \operatorname{TypeDynamic}(\texttt{ExecutionDomain}),\ \bot ,\ \bot ,\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{ContextMembers}\ =\ \mathsf{ContextFields}\ \mathbin{++} \ \mathsf{ContextMethods} \\[0.16em]
\mathsf{ContextDecl}\ =\ \operatorname{RecordDecl}(\bot ,\ \texttt{public},\ \texttt{Context},\ \bot ,\ \bot ,\ [],\ \mathsf{ContextMembers},\ \bot ,\ \bot ,\ \bot )
\end{array}
$$

SystemInterface =
{

$$
\begin{array}{l}
\ \langle \texttt{"exit"},\ [\langle \bot ,\ \texttt{code},\ \operatorname{TypePrim}(\texttt{"i32"})\rangle ],\ \operatorname{TypePrim}(\texttt{"!"})\rangle , \\[0.16em]
\ \langle \texttt{"get\_env"},\ [\langle \bot ,\ \texttt{key},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeString}(\texttt{@View})\rangle , \\[0.16em]
\ \langle \texttt{"executable\_path"},\ [],\ \operatorname{TypeString}(\texttt{@View})\rangle , \\[0.16em]
\ \langle \texttt{"argument\_count"},\ [],\ \operatorname{TypePrim}(\texttt{"usize"})\rangle , \\[0.16em]
\ \langle \texttt{"argument"},\ [\langle \bot ,\ \texttt{index},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ],\ \operatorname{TypeString}(\texttt{@View})\rangle , \\[0.16em]
\ \langle \texttt{"current\_directory"},\ [],\ \operatorname{TypeString}(\texttt{@View})\rangle , \\[0.16em]
\ \langle \texttt{"run"},\ [\langle \bot ,\ \texttt{command},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypePrim}(\texttt{"i32"})\rangle  \\[0.16em]
\} \\[0.16em]
\mathsf{SystemMembers}\ =\ [ \\[0.16em]
\ \operatorname{MethodDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{"exit"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [\langle \bot ,\ \texttt{code},\ \operatorname{TypePrim}(\texttt{"i32"})\rangle ],\ \operatorname{TypePrim}(\texttt{"!"}),\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{MethodDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{"get\_env"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [\langle \bot ,\ \texttt{key},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeString}(\texttt{@View}),\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{MethodDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{"executable\_path"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [],\ \operatorname{TypeString}(\texttt{@View}),\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{MethodDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{"argument\_count"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [],\ \operatorname{TypePrim}(\texttt{"usize"}),\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{MethodDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{"argument"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [\langle \bot ,\ \texttt{index},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ],\ \operatorname{TypeString}(\texttt{@View}),\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{MethodDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{"current\_directory"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [],\ \operatorname{TypeString}(\texttt{@View}),\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{MethodDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{"run"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [\langle \bot ,\ \texttt{command},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypePrim}(\texttt{"i32"}),\ \bot ,\ \bot ,\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{SystemDecl}\ =\ \operatorname{RecordDecl}(\bot ,\ \texttt{public},\ \texttt{System},\ \bot ,\ \bot ,\ [],\ \mathsf{SystemMembers},\ \bot ,\ \bot ,\ \bot )
\end{array}
$$

$$
\begin{array}{l}
\mathsf{CpuSetDecl}\ =\ \operatorname{TypeAliasDecl}(\bot ,\ \texttt{public},\ \texttt{CpuSet},\ \bot ,\ \bot ,\ \operatorname{TypePrim}(\texttt{"u64"}),\ \bot ,\ \bot ) \\[0.16em]
\mathsf{PriorityVariants}\ =\ [ \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{Low},\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{Normal},\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{VariantDecl}(\texttt{High},\ \bot ,\ \bot ,\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{PriorityDecl}\ =\ \operatorname{EnumDecl}(\bot ,\ \texttt{public},\ \texttt{Priority},\ \bot ,\ \bot ,\ [],\ \mathsf{PriorityVariants},\ \bot ,\ \bot ,\ \bot )
\end{array}
$$

$$
\begin{array}{l}
\mathsf{ReactorMethodParams}\ =\ [\langle \texttt{T},\ [],\ \bot ,\ \bot \rangle ,\ \langle \texttt{E},\ [],\ \bot ,\ \bot \rangle ] \\[0.16em]
\mathsf{ReactorMethods}\ =\ [ \\[0.16em]
\ \operatorname{ClassMethodDecl}(\bot ,\ \texttt{public},\ \texttt{"run"},\ \mathsf{ReactorMethodParams},\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [\langle \bot ,\ \texttt{future},\ \operatorname{TypeApply}([\texttt{"Future"}],\ [\operatorname{TypePath}([\texttt{"T"}]),\ \operatorname{TypePath}([\texttt{"E"}])])\rangle ],\ \operatorname{TypeUnion}([\operatorname{TypePath}([\texttt{"T"}]),\ \operatorname{TypePath}([\texttt{"E"}])]),\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{ClassMethodDecl}(\bot ,\ \texttt{public},\ \texttt{"register"},\ \mathsf{ReactorMethodParams},\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [\langle \bot ,\ \texttt{future},\ \operatorname{TypeApply}([\texttt{"Future"}],\ [\operatorname{TypePath}([\texttt{"T"}]),\ \operatorname{TypePath}([\texttt{"E"}])])\rangle ],\ \operatorname{TypeApply}([\texttt{"Tracked"}],\ [\operatorname{TypePath}([\texttt{"T"}]),\ \operatorname{TypePath}([\texttt{"E"}])]),\ \bot ,\ \bot ,\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{ReactorMethodNames}\ =\ \{\ m.\mathsf{name}\ \mid \ m\ \in \ \mathsf{ReactorMethods}\ \} \\[0.16em]
\mathsf{ReactorDecl}\ =\ \operatorname{ClassDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{Reactor},\ \bot ,\ \bot ,\ [],\ \mathsf{ReactorMethods},\ \bot ,\ \bot ) \\[0.16em]
\Sigma .\mathsf{Classes}[\texttt{"Reactor"}]\ =\ \mathsf{ReactorDecl}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{CapMethodSig}(\texttt{FileSystem},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \langle \mathsf{name},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}\rangle \ \in \ \mathsf{FileSystemInterface} \\[0.16em]
\operatorname{CapMethodSig}(\texttt{Network},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \langle \mathsf{name},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}\rangle \ \in \ \mathsf{NetworkInterface} \\[0.16em]
\operatorname{CapMethodSig}(\texttt{HeapAllocator},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \langle \mathsf{name},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}\rangle \ \in \ \mathsf{HeapAllocatorInterface} \\[0.16em]
\operatorname{CapMethodSig}(\texttt{Reactor},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \operatorname{LookupClassMethod}(\texttt{Reactor},\ \mathsf{name})\ =\ m\ \land \ \operatorname{Sig_T}(\mathsf{SelfVar},\ m)\ =\ \langle \_,\ \mathsf{params},\ \mathsf{ret}\rangle  \\[0.16em]
\operatorname{CapMethodSig}(\texttt{Time},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \langle \mathsf{name},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}\rangle \ \in \ \mathsf{TimeInterface} \\[0.16em]
\operatorname{CapMethodSig}(\texttt{MonotonicTime},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \langle \mathsf{name},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}\rangle \ \in \ \mathsf{MonotonicTimeInterface} \\[0.16em]
\operatorname{CapMethodSig}(\texttt{WallTime},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \langle \mathsf{name},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}\rangle \ \in \ \mathsf{WallTimeInterface} \\[0.16em]
\operatorname{SystemMethodSig}(\mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \langle \mathsf{name},\ \mathsf{params},\ \mathsf{ret}\rangle \ \in \ \mathsf{SystemInterface}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{CapRecv}(\texttt{FileSystem},\ \mathsf{name})\ =\ \mathsf{recv}\ \Leftrightarrow \ \langle \mathsf{name},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}\rangle \ \in \ \mathsf{FileSystemInterface} \\[0.16em]
\operatorname{CapRecv}(\texttt{Network},\ \mathsf{name})\ =\ \mathsf{recv}\ \Leftrightarrow \ \langle \mathsf{name},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}\rangle \ \in \ \mathsf{NetworkInterface} \\[0.16em]
\operatorname{CapRecv}(\texttt{HeapAllocator},\ \mathsf{name})\ =\ \mathsf{recv}\ \Leftrightarrow \ \langle \mathsf{name},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}\rangle \ \in \ \mathsf{HeapAllocatorInterface} \\[0.16em]
\operatorname{CapRecv}(\texttt{Reactor},\ \mathsf{name})\ =\ \mathsf{recv}\ \Leftrightarrow \ \operatorname{LookupClassMethod}(\texttt{Reactor},\ \mathsf{name})\ =\ m\ \land \ \operatorname{RecvPerm}(\mathsf{SelfVar},\ m.\mathsf{receiver})\ =\ \mathsf{recv} \\[0.16em]
\operatorname{CapRecv}(\texttt{Time},\ \mathsf{name})\ =\ \mathsf{recv}\ \Leftrightarrow \ \langle \mathsf{name},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}\rangle \ \in \ \mathsf{TimeInterface} \\[0.16em]
\operatorname{CapRecv}(\texttt{MonotonicTime},\ \mathsf{name})\ =\ \mathsf{recv}\ \Leftrightarrow \ \langle \mathsf{name},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}\rangle \ \in \ \mathsf{MonotonicTimeInterface} \\[0.16em]
\operatorname{CapRecv}(\texttt{WallTime},\ \mathsf{name})\ =\ \mathsf{recv}\ \Leftrightarrow \ \langle \mathsf{name},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}\rangle \ \in \ \mathsf{WallTimeInterface}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{LowerCallJudg}\ =\ \{\mathsf{MethodSymbol},\ \mathsf{BuiltinMethodSym},\ \mathsf{LowerMethodCall},\ \mathsf{LowerArgs},\ \mathsf{LowerRecvArg}\} \\[0.16em]
\operatorname{ModalStateOf}(T)\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\ \Leftrightarrow \ \operatorname{StripPerm}(T)\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S) \\[0.16em]
\mathsf{BuiltinCapClass}\ =\ \{\texttt{FileSystem},\ \texttt{Network},\ \texttt{HeapAllocator},\ \texttt{Reactor},\ \texttt{Time},\ \texttt{MonotonicTime},\ \texttt{WallTime}\}
\end{array}
$$

### 14.9.4 Static Semantics

Capability classes are ordinary classes in the type system. A parameter of type `$Class` accepts any concrete type implementing `Class`.

Capability classes MAY be used as generic bounds exactly like any other class bound.

The built-in capability class names `FileSystem`, `Network`, `HeapAllocator`, `ExecutionDomain`, `Reactor`, `Time`, `MonotonicTime`, and `WallTime` are reserved. Type-system use of those names is via `CapType(Cl) = TypeDynamic(Cl)`.

Calls to `HeapAllocator.alloc_raw` and `HeapAllocator.dealloc_raw` require `unsafe` context.

**(AllocRaw-Unsafe-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{base}\ :\ \operatorname{TypeDynamic}(\texttt{HeapAllocator})\quad \lnot \ \operatorname{UnsafeSpan}(\operatorname{span}(\operatorname{MethodCall}(\mathsf{base},\ \texttt{"alloc\_raw"},\ \mathsf{args})))\quad c\ =\ \operatorname{Code}(\mathsf{AllocRaw}-\mathsf{Unsafe}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{MethodCall}(\mathsf{base},\ \texttt{"alloc\_raw"},\ \mathsf{args})\ \Uparrow \ c
\end{array}
$$

**(DeallocRaw-Unsafe-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{base}\ :\ \operatorname{TypeDynamic}(\texttt{HeapAllocator})\quad \lnot \ \operatorname{UnsafeSpan}(\operatorname{span}(\operatorname{MethodCall}(\mathsf{base},\ \texttt{"dealloc\_raw"},\ \mathsf{args})))\quad c\ =\ \operatorname{Code}(\mathsf{DeallocRaw}-\mathsf{Unsafe}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{MethodCall}(\mathsf{base},\ \texttt{"dealloc\_raw"},\ \mathsf{args})\ \Uparrow \ c
\end{array}
$$

$$
\begin{array}{l}
\mathsf{BuiltinTypes}_{\mathsf{FS}}\ =\ \{\texttt{File},\ \texttt{DirIter},\ \texttt{DirEntry},\ \texttt{FileKind},\ \texttt{IoError}\} \\[0.16em]
\mathsf{BuiltinTypes}_{\mathsf{Time}}\ =\ \{\texttt{Duration},\ \texttt{MonotonicInstant},\ \texttt{UtcInstant},\ \texttt{TimeError}\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{RecordDecl}([\texttt{"DirEntry"}])\ =\ \mathsf{DirEntryDecl} \\[0.16em]
\operatorname{RecordDecl}([\texttt{"Duration"}])\ =\ \mathsf{DurationDecl} \\[0.16em]
\operatorname{RecordDecl}([\texttt{"MonotonicInstant"}])\ =\ \mathsf{MonotonicInstantDecl} \\[0.16em]
\operatorname{RecordDecl}([\texttt{"UtcInstant"}])\ =\ \mathsf{UtcInstantDecl} \\[0.16em]
\operatorname{RecordDecl}([\texttt{"Context"}])\ =\ \mathsf{ContextDecl} \\[0.16em]
\operatorname{RecordDecl}([\texttt{"System"}])\ =\ \mathsf{SystemDecl} \\[0.16em]
\operatorname{EnumDecl}([\texttt{"FileKind"}])\ =\ \mathsf{FileKindDecl} \\[0.16em]
\operatorname{EnumDecl}([\texttt{"IoError"}])\ =\ \mathsf{IoErrorDecl} \\[0.16em]
\operatorname{EnumDecl}([\texttt{"AllocationError"}])\ =\ \mathsf{AllocationErrorDecl} \\[0.16em]
\operatorname{EnumDecl}([\texttt{"TimeError"}])\ =\ \mathsf{TimeErrorDecl} \\[0.16em]
\operatorname{EnumDecl}([\texttt{"Priority"}])\ =\ \mathsf{PriorityDecl}
\end{array}
$$

$$
\begin{array}{l}
\Sigma .\mathsf{Types}[\texttt{"DirEntry"}]\ =\ \mathsf{DirEntryDecl} \\[0.16em]
\Sigma .\mathsf{Types}[\texttt{"Duration"}]\ =\ \mathsf{DurationDecl} \\[0.16em]
\Sigma .\mathsf{Types}[\texttt{"MonotonicInstant"}]\ =\ \mathsf{MonotonicInstantDecl} \\[0.16em]
\Sigma .\mathsf{Types}[\texttt{"UtcInstant"}]\ =\ \mathsf{UtcInstantDecl} \\[0.16em]
\Sigma .\mathsf{Types}[\texttt{"FileKind"}]\ =\ \mathsf{FileKindDecl} \\[0.16em]
\Sigma .\mathsf{Types}[\texttt{"IoError"}]\ =\ \mathsf{IoErrorDecl} \\[0.16em]
\Sigma .\mathsf{Types}[\texttt{"AllocationError"}]\ =\ \mathsf{AllocationErrorDecl} \\[0.16em]
\Sigma .\mathsf{Types}[\texttt{"TimeError"}]\ =\ \mathsf{TimeErrorDecl} \\[0.16em]
\Sigma .\mathsf{Types}[\texttt{"Context"}]\ =\ \mathsf{ContextDecl} \\[0.16em]
\Sigma .\mathsf{Types}[\texttt{"System"}]\ =\ \mathsf{SystemDecl} \\[0.16em]
\Sigma .\mathsf{Types}[\texttt{"CpuSet"}]\ =\ \mathsf{CpuSetDecl} \\[0.16em]
\Sigma .\mathsf{Types}[\texttt{"Priority"}]\ =\ \mathsf{PriorityDecl}
\end{array}
$$

$$
\operatorname{BuiltInContext}(T)\ \Leftrightarrow \ T\ =\ \operatorname{TypePath}([\texttt{"Context"}])\ \land \ \operatorname{RecordDecl}([\texttt{"Context"}])\ =\ \mathsf{ContextDecl}
$$

$$
\begin{array}{l}
\operatorname{ContextBundleFieldType}(\texttt{fs})\ =\ \operatorname{TypeDynamic}(\texttt{FileSystem}) \\[0.16em]
\operatorname{ContextBundleFieldType}(\texttt{net})\ =\ \operatorname{TypeDynamic}(\texttt{Network}) \\[0.16em]
\operatorname{ContextBundleFieldType}(\texttt{heap})\ =\ \operatorname{TypeDynamic}(\texttt{HeapAllocator}) \\[0.16em]
\operatorname{ContextBundleFieldType}(\texttt{sys})\ =\ \operatorname{TypePath}([\texttt{"System"}]) \\[0.16em]
\operatorname{ContextBundleFieldType}(\texttt{reactor})\ =\ \operatorname{TypeDynamic}(\texttt{Reactor}) \\[0.16em]
\operatorname{ContextBundleFieldType}(\texttt{time})\ =\ \operatorname{TypeDynamic}(\texttt{Time}) \\[0.16em]
\operatorname{ContextBundleFieldType}(\texttt{cpu})\ =\ \operatorname{TypeDynamic}(\texttt{ExecutionDomain}) \\[0.16em]
\operatorname{ContextBundleFieldType}(\texttt{gpu})\ =\ \operatorname{TypeDynamic}(\texttt{ExecutionDomain}) \\[0.16em]
\operatorname{ContextBundleFieldType}(\texttt{inline})\ =\ \operatorname{TypeDynamic}(\texttt{ExecutionDomain})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ContextBundleType}(T)\ \Leftrightarrow \ \operatorname{AliasNorm}(T)\ =\ \operatorname{TypePath}([\texttt{"Context"}]) \\[0.16em]
\operatorname{ContextBundleType}(T)\ \Leftrightarrow \ \operatorname{AliasNorm}(T)\ =\ \operatorname{TypePath}(p)\ \land \ p\ \ne \ [\texttt{"Context"}]\ \land \ \operatorname{RecordDecl}(p)\ =\ R\ \land \ \forall \ f\ \in \ \operatorname{Fields}(R).\ ((\exists \ T_{f}.\ \operatorname{ContextBundleFieldType}(f.\mathsf{name})\ =\ T_{f}\ \land \ \operatorname{StripPerm}(f.\mathsf{type})\ =\ T_{f})\ \lor \ \operatorname{ContextBundleType}(\operatorname{StripPerm}(f.\mathsf{type})))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ContextBundleFieldValue}(v_{\mathsf{ctx}},\ \texttt{fs})\ \Downarrow \ v\ \Leftrightarrow \ \operatorname{FieldValue}(v_{\mathsf{ctx}},\ \texttt{fs})\ =\ v \\[0.16em]
\operatorname{ContextBundleFieldValue}(v_{\mathsf{ctx}},\ \texttt{net})\ \Downarrow \ v\ \Leftrightarrow \ \operatorname{FieldValue}(v_{\mathsf{ctx}},\ \texttt{net})\ =\ v \\[0.16em]
\operatorname{ContextBundleFieldValue}(v_{\mathsf{ctx}},\ \texttt{heap})\ \Downarrow \ v\ \Leftrightarrow \ \operatorname{FieldValue}(v_{\mathsf{ctx}},\ \texttt{heap})\ =\ v \\[0.16em]
\operatorname{ContextBundleFieldValue}(v_{\mathsf{ctx}},\ \texttt{sys})\ \Downarrow \ v\ \Leftrightarrow \ \operatorname{FieldValue}(v_{\mathsf{ctx}},\ \texttt{sys})\ =\ v \\[0.16em]
\operatorname{ContextBundleFieldValue}(v_{\mathsf{ctx}},\ \texttt{reactor})\ \Downarrow \ v\ \Leftrightarrow \ \operatorname{FieldValue}(v_{\mathsf{ctx}},\ \texttt{reactor})\ =\ v \\[0.16em]
\operatorname{ContextBundleFieldValue}(v_{\mathsf{ctx}},\ \texttt{time})\ \Downarrow \ v\ \Leftrightarrow \ \operatorname{FieldValue}(v_{\mathsf{ctx}},\ \texttt{time})\ =\ v \\[0.16em]
\operatorname{ContextBundleFieldValue}(v_{\mathsf{ctx}},\ \texttt{cpu})\ \Downarrow \ v\ \Leftrightarrow \ \operatorname{ContextDomainValue}(v_{\mathsf{ctx}},\ \texttt{cpu})\ \Downarrow \ v \\[0.16em]
\operatorname{ContextBundleFieldValue}(v_{\mathsf{ctx}},\ \texttt{gpu})\ \Downarrow \ v\ \Leftrightarrow \ \operatorname{ContextDomainValue}(v_{\mathsf{ctx}},\ \texttt{gpu})\ \Downarrow \ v \\[0.16em]
\operatorname{ContextBundleFieldValue}(v_{\mathsf{ctx}},\ \texttt{inline})\ \Downarrow \ v\ \Leftrightarrow \ \operatorname{ContextDomainValue}(v_{\mathsf{ctx}},\ \texttt{inline})\ \Downarrow \ v
\end{array}
$$

$$
\operatorname{ContextDomainValue}(v_{\mathsf{ctx}},\ m)\ \Downarrow \ v\ \Leftrightarrow \ m\ \in \ \{\texttt{cpu},\ \texttt{gpu},\ \texttt{inline}\}\ \land \ v\ \mathsf{is}\ \mathsf{the}\ \mathsf{value}\ \mathsf{denoted}\ \mathsf{by}\ \mathsf{evaluating}\ \mathsf{the}\ \mathsf{corresponding}\ \mathsf{built}-\mathsf{in}\ \texttt{Context}\ \mathsf{method}\ \mathsf{on}\ v_{\mathsf{ctx}}
$$

$$
\begin{array}{l}
\operatorname{ContextBundleBuild}(T,\ v_{\mathsf{ctx}})\ \Downarrow \ v_{\mathsf{ctx}}\ \Leftrightarrow \ \operatorname{AliasNorm}(T)\ =\ \operatorname{TypePath}([\texttt{"Context"}]) \\[0.16em]
\operatorname{ContextBundleBuild}(T,\ v_{\mathsf{ctx}})\ \Downarrow \ \operatorname{RecordValue}(\operatorname{TypePath}(p),\ \mathsf{fs}_{\mathsf{out}})\ \Leftrightarrow  \\[0.16em]
\ \operatorname{AliasNorm}(T)\ =\ \operatorname{TypePath}(p)\ \land \ p\ \ne \ [\texttt{"Context"}]\ \land \ \operatorname{RecordDecl}(p)\ =\ R\ \land  \\[0.16em]
\ \mathsf{fs}_{\mathsf{out}}\ =\ [\langle f.\mathsf{name},\ v_{f}\rangle \ \mid \ f\ \in \ \operatorname{Fields}(R)\ \land \ ((\exists \ T_{f}.\ \operatorname{ContextBundleFieldType}(f.\mathsf{name})\ =\ T_{f}\ \land \ \operatorname{StripPerm}(f.\mathsf{type})\ =\ T_{f}\ \land \ \operatorname{ContextBundleFieldValue}(v_{\mathsf{ctx}},\ f.\mathsf{name})\ \Downarrow \ v_{f})\ \lor \ (\operatorname{ContextBundleType}(\operatorname{StripPerm}(f.\mathsf{type}))\ \land \ \operatorname{ContextBundleBuild}(\operatorname{StripPerm}(f.\mathsf{type}),\ v_{\mathsf{ctx}})\ \Downarrow \ v_{f}))]
\end{array}
$$

$$
\operatorname{AllocErrorVal}(r)\ \Leftrightarrow \ \exists \ s.\ r\ =\ \operatorname{EnumValue}([\texttt{"AllocationError"},\ \texttt{"OutOfMemory"}],\ \operatorname{TuplePayload}([s]))\ \lor \ r\ =\ \operatorname{EnumValue}([\texttt{"AllocationError"},\ \texttt{"QuotaExceeded"}],\ \operatorname{TuplePayload}([s]))
$$

### 14.9.5 Dynamic Semantics

Capability classes introduce no separate dispatch model. Built-in capability operations have primitive implementations, but capability values are still expressed through the same dynamic-class-object machinery as other dispatchable classes.

### 14.9.6 Lowering

Calls on dynamic receivers of builtin capability classes `FileSystem`, `Network`, `HeapAllocator`, `Reactor`, `Time`, `MonotonicTime`, and `WallTime` lower to builtin method symbols rather than emitted vtable-call sequences. Other capability classes lower through the ordinary dynamic-dispatch path of §14.6.

### 14.9.7 Diagnostics

Diagnostics are defined for capability operations that require `unsafe`, including raw allocation and deallocation through `HeapAllocator`.

## 14.10 Foundational Classes and Predicates

### 14.10.1 Syntax

Foundational classes use ordinary class syntax from §14.3. The foundational names `Bitcopy`, `Clone`, `Drop`, `FfiSafe`, `Eq`, `Hasher`, `Hash`, `Iterator`, and `Step` are reserved.

### 14.10.2 Parsing

Foundational classes and predicates have no feature-specific parse form beyond ordinary class parsing and predicate-requirement parsing from §14.1.

### 14.10.3 AST Representation / Form

$$
\mathsf{FoundationalClassName}\ =\ \{\texttt{Bitcopy},\ \texttt{Clone},\ \texttt{Drop},\ \texttt{FfiSafe},\ \texttt{Eq},\ \texttt{Hasher},\ \texttt{Hash},\ \texttt{Iterator},\ \texttt{Step}\}
$$

$$
\begin{array}{l}
\mathsf{BitcopyDropJudg}\ =\ \{\Gamma \ \vdash \ T\ :\ \mathsf{BitcopyDropOk}\} \\[0.16em]
\mathsf{BitcopyJudg}\ =\ \{\mathsf{BitcopyType}\} \\[0.16em]
\mathsf{CloneJudg}\ =\ \{\mathsf{CloneType}\} \\[0.16em]
\mathsf{DropJudg}\ =\ \{\mathsf{DropType}\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{HasCloneMethod}(T)\ \Leftrightarrow \ \exists \ p,\ R,\ m.\ T\ =\ \operatorname{TypePath}(p)\ \land \ \operatorname{RecordDecl}(p)\ =\ R\ \land \ m\ \in \ \operatorname{Methods}(R)\ \land \ \operatorname{MethodName}(m)\ =\ \texttt{clone}\ \land \ \operatorname{Sig_T}(T,\ m)\ =\ \langle \operatorname{TypePerm}(\texttt{const},\ T),\ [],\ T\rangle  \\[0.16em]
\operatorname{HasDropMethod}(T)\ \Leftrightarrow \ \exists \ p,\ R,\ m.\ T\ =\ \operatorname{TypePath}(p)\ \land \ \operatorname{RecordDecl}(p)\ =\ R\ \land \ m\ \in \ \operatorname{Methods}(R)\ \land \ \operatorname{MethodName}(m)\ =\ \texttt{drop}\ \land \ \operatorname{Sig_T}(T,\ m)\ =\ \langle \operatorname{TypePerm}(\texttt{unique},\ T),\ [],\ \operatorname{TypePrim}(\texttt{"()"})\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{CloneType}(T)\ \Leftrightarrow \ \operatorname{BuiltinCloneType}(T)\ \lor \ \operatorname{HasCloneMethod}(\operatorname{StripPerm}(T))\ \lor \ \operatorname{BitcopyType}(T) \\[0.16em]
\operatorname{DropType}(T)\ \Leftrightarrow \ \operatorname{BuiltinDropType}(T)\ \lor \ \operatorname{HasDropMethod}(\operatorname{StripPerm}(T))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BuiltinStepType}(T)\ \Leftrightarrow \ \operatorname{StripPerm}(T)\ =\ \operatorname{TypePrim}(t)\ \land \ t\ \in \ \mathsf{IntTypes}\ \cup \ \mathsf{UnsignedIntTypes}\ \cup \ \{\texttt{char}\} \\[0.16em]
\operatorname{ImplementsEq}(T)\ \Leftrightarrow \ \operatorname{EqType}(T)\ \lor \ \texttt{Eq}\ \in \ \operatorname{Implements}(T) \\[0.16em]
\operatorname{ImplementsHash}(T)\ \Leftrightarrow \ \texttt{Hash}\ \in \ \operatorname{Implements}(T) \\[0.16em]
\operatorname{ImplementsIterator}(T)\ \Leftrightarrow \ \texttt{Iterator}\ \in \ \operatorname{Implements}(T) \\[0.16em]
\operatorname{ImplementsStep}(T)\ \Leftrightarrow \ \operatorname{BuiltinStepType}(T)\ \lor \ \texttt{Step}\ \in \ \operatorname{Implements}(T) \\[0.16em]
\operatorname{ImplementsHasher}(T)\ \Leftrightarrow \ \texttt{Hasher}\ \in \ \operatorname{Implements}(T)
\end{array}
$$

### 14.10.4 Static Semantics

Foundational class bounds for `Bitcopy`, `Clone`, `Drop`, and `FfiSafe` are interpreted by intrinsic satisfaction judgments, not by user-defined class implementation lookup. `Eq` is satisfied intrinsically when `EqType(T)` holds. `Step` is satisfied intrinsically when `BuiltinStepType(T)` holds. Other `Eq` and `Step` obligations are discharged through ordinary class implementation lookup.

**(BitcopyDrop-Ok)**

$$
\begin{array}{l}
\lnot (\operatorname{BitcopyType}(T)\ \land \ \operatorname{DropType}(T)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{BitcopyDropOk}
\end{array}
$$

**(BitcopyDrop-Conflict)**

$$
\begin{array}{l}
\operatorname{BitcopyType}(T)\ \land \ \operatorname{DropType}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{BitcopyDropOk}\ \Uparrow 
\end{array}
$$

$$
\operatorname{BitcopyType}(T)\ \Leftrightarrow \ \operatorname{BitcopyTypeCore}(T)
$$

$$
\begin{array}{l}
\operatorname{BitcopyTypeCore}(T)\ \Leftrightarrow  \\[0.16em]
\ \mathsf{false}\quad \mathsf{if}\ T\ =\ \operatorname{TypePerm}(\texttt{unique},\ \_) \\[0.16em]
\ \operatorname{BitcopyTypeCore}(T_{0})\quad \mathsf{if}\ T\ =\ \operatorname{TypePerm}(p,\ T_{0})\ \land \ p\ \ne \ \texttt{unique} \\[0.16em]
\ \operatorname{BuiltinBitcopyType}(T)\ \lor  \\[0.16em]
\ (T\ =\ \operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}])\ \land \ \forall \ i\ \in \ 1..n,\ \operatorname{BitcopyType}(T_{i}))\ \lor  \\[0.16em]
\ (T\ =\ \operatorname{TypeArray}(T_{0},\ e)\ \land \ \Gamma \ \vdash \ \operatorname{ConstLen}(e)\ \Downarrow \ \_\ \land \ \operatorname{BitcopyType}(T_{0}))\ \lor  \\[0.16em]
\ (T\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\ \land \ \forall \ i\ \in \ 1..n,\ \operatorname{BitcopyType}(T_{i}))\ \lor  \\[0.16em]
\ (T\ =\ \operatorname{TypePath}(p)\ \land \ \operatorname{RecordDecl}(p)\ =\ R\ \land \ \forall \ f\ :\ T_{f}\ \in \ \operatorname{Fields}(R).\ \operatorname{BitcopyType}(T_{f}))\ \lor  \\[0.16em]
\ (T\ =\ \operatorname{TypePath}(p)\ \land \ \operatorname{EnumDecl}(p)\ =\ E\ \land \ \forall \ v\ \in \ \operatorname{Variants}(E).\ \forall \ T_{f}\ \in \ \operatorname{PayloadTypes}(v).\ \operatorname{BitcopyType}(T_{f}))\ \lor  \\[0.16em]
\ (T\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\ \land \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ \forall \ T_{f}\ \in \ \operatorname{ModalPayload}(\mathsf{modal}_{\mathsf{ref}},\ S).\ \operatorname{BitcopyType}(T_{f}))\ \lor  \\[0.16em]
\ (T\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\ \land \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ \forall \ S\ \in \ \operatorname{States}(M).\ \forall \ T_{f}\ \in \ \operatorname{ModalPayload}(\mathsf{modal}_{\mathsf{ref}},\ S).\ \operatorname{BitcopyType}(T_{f}))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BuiltinBitcopyType}(T)\ \Leftrightarrow  \\[0.16em]
\ T\ =\ \operatorname{TypePrim}(t)\ \land \ t\ \in \ \mathsf{PrimTypeNames}\ \lor  \\[0.16em]
\ T\ =\ \operatorname{TypePtr}(U,\ s)\ \lor  \\[0.16em]
\ T\ =\ \operatorname{TypeRawPtr}(q,\ U)\ \lor  \\[0.16em]
\ T\ =\ \operatorname{TypeSlice}(U)\ \lor  \\[0.16em]
\ T\ =\ \operatorname{TypeFunc}(\mathsf{ps},\ R)\ \lor  \\[0.16em]
\ T\ =\ \operatorname{TypeDynamic}(\mathsf{Cl})\ \lor  \\[0.16em]
\ (T\ =\ \operatorname{TypeRange}(U)\ \land \ \operatorname{BitcopyType}(U))\ \lor  \\[0.16em]
\ (T\ =\ \operatorname{TypeRangeInclusive}(U)\ \land \ \operatorname{BitcopyType}(U))\ \lor  \\[0.16em]
\ (T\ =\ \operatorname{TypeRangeFrom}(U)\ \land \ \operatorname{BitcopyType}(U))\ \lor  \\[0.16em]
\ (T\ =\ \operatorname{TypeRangeTo}(U)\ \land \ \operatorname{BitcopyType}(U))\ \lor  \\[0.16em]
\ (T\ =\ \operatorname{TypeRangeToInclusive}(U)\ \land \ \operatorname{BitcopyType}(U))\ \lor  \\[0.16em]
\ T\ =\ \mathsf{TypeRangeFull}\ \lor  \\[0.16em]
\ T\ =\ \operatorname{TypeString}(\texttt{@View})\ \lor  \\[0.16em]
\ T\ =\ \operatorname{TypeBytes}(\texttt{@View})\ \lor  \\[0.16em]
\ T\ =\ \operatorname{TypePath}([\texttt{"FileKind"}])\ \lor  \\[0.16em]
\ T\ =\ \operatorname{TypePath}([\texttt{"IoError"}])\ \lor  \\[0.16em]
\ T\ =\ \operatorname{TypePath}([\texttt{"Context"}])\ \lor  \\[0.16em]
\ T\ =\ \operatorname{TypePath}([\texttt{"System"}])
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BuiltinDropType}(T)\ \Leftrightarrow \ T\ =\ \operatorname{TypeString}(\texttt{@Managed})\ \lor \ T\ =\ \operatorname{TypeBytes}(\texttt{@Managed}) \\[0.16em]
\operatorname{BuiltinCloneType}(T)\ \Leftrightarrow \ \operatorname{BuiltinBitcopyType}(T)
\end{array}
$$

The built-in class signatures are:

- `Eq`: `eq(~, other: const Self) -> bool`
- `Hasher`: `write(~!, data: bytes@View) -> ()`; `finish(~) -> u64`
- `Hash`: `hash(~, hasher: unique Hasher) -> ()`
- `Iterator`: associated type `Item`; `next(~!) -> Self::Item | ()`
- `Step`: `successor(~) -> Self | ()`; `predecessor(~) -> Self | ()`

`Eq::eq` MUST be reflexive, symmetric, and transitive.

`Hash` implementations MUST also implement `Eq`, and equal values MUST produce equal hash results when hashed from identical initial hasher states.

$$
\texttt{Iterator::next}\ \mathsf{returns}\ \texttt{Self::Item}\ \mathsf{while}\ \mathsf{iteration}\ \mathsf{remains},\ \mathsf{or}\ \texttt{()}\ \mathsf{when}\ \mathsf{exhausted}.
$$

$$
\texttt{Step::successor}\ \mathsf{and}\ \texttt{Step::predecessor}\ \mathsf{define}\ a\ \mathsf{discrete}\ \mathsf{stepping}\ \mathsf{relation}\ \mathsf{and}\ \mathsf{are}\ \mathsf{partial}\ \mathsf{inverses}\ \mathsf{when}\ \mathsf{both}\ \mathsf{are}\ \mathsf{defined}.
$$

### 14.10.5 Dynamic Semantics

`drop` is invoked implicitly by scope exit when `DropType(T)` holds. `clone` on a `BitcopyType` value is equivalent to the implicit bitwise duplication already permitted by that predicate.

`Hasher` maintains an internal `u64` state. `write` appends bytes to the input stream. `finish` returns the FNV-1a 64-bit hash of the concatenated byte stream using `FNVOffset64` and `FNVPrime64`.

For `BuiltinStepType(T)` with `StripPerm(T) = TypePrim(t)` and `t ∈ IntTypes ∪ UnsignedIntTypes`, `Step::successor` returns the least representable value greater than the receiver when one exists, or `()` otherwise; `Step::predecessor` returns the greatest representable value smaller than the receiver when one exists, or `()` otherwise.

For `BuiltinStepType(T)` with `StripPerm(T) = TypePrim(`char`)`, `Step::successor` returns `CharVal(u')` where `u' = min { v ∈ UnicodeScalar | v > u }` for receiver `CharVal(u)` when such `u'` exists, or `()` otherwise; `Step::predecessor` returns `CharVal(u')` where `u' = max { v ∈ UnicodeScalar | v < u }` when such `u'` exists, or `()` otherwise.

### 14.10.6 Lowering

$$
\texttt{Eq::eq}\ \mathsf{on}\ \texttt{EqType(T)}\ \mathsf{lowers}\ \mathsf{intrinsically}\ \mathsf{to}\ \mathsf{the}\ \mathsf{built}-\mathsf{in}\ \mathsf{equality}\ \mathsf{relation}\ \mathsf{for}\ \texttt{T}.\ \texttt{Step::successor}\ \mathsf{and}\ \texttt{Step::predecessor}\ \mathsf{on}\ \texttt{BuiltinStepType(T)}\ \mathsf{lower}\ \mathsf{intrinsically}\ \mathsf{to}\ \mathsf{the}\ \mathsf{built}-\mathsf{in}\ \mathsf{stepping}\ \mathsf{relation}\ \mathsf{for}\ \texttt{T}.\ \mathsf{Other}\ \texttt{Eq}\ \mathsf{and}\ \texttt{Step}\ \mathsf{calls}\ \mathsf{lower}\ \mathsf{through}\ \mathsf{ordinary}\ \mathsf{method}-\mathsf{call}\ \mathsf{lowering}.
$$

These predicates and built-in classes do not introduce a separate representation. They influence lowering indirectly through copy semantics, drop-glue generation, built-in `Eq`/`Step` call selection, and whether a dynamic-class-object vtable header carries a non-null drop entry.

### 14.10.7 Diagnostics

Diagnostics are defined for types that simultaneously satisfy `BitcopyType` and `DropType`, and for direct user calls to the implicit `drop` protocol on types where destruction is reserved to the language runtime.

## 14.11 Refinement and Polymorphism Diagnostics Supplement

This section owns diagnostics for refinement types, generic instantiation, class implementation, dynamic objects, and foundational predicate requirements.

| Code         | Severity | Detection    | Condition                                                                           |
| ------------ | -------- | ------------ | ----------------------------------------------------------------------------------- |
| `E-TYP-1953` | Error    | Compile-time | Refinement not provable outside `[[dynamic]]` scope                                 |
| `E-TYP-1954` | Error    | Compile-time | Impure expression in refinement predicate                                           |
| `E-TYP-1955` | Error    | Compile-time | Predicate does not evaluate to `bool`                                               |
| `E-TYP-1956` | Error    | Compile-time | `self` used in inline parameter constraint                                          |
| `E-TYP-1957` | Error    | Compile-time | Circular type dependency in refinement predicate                                    |
| `P-TYP-1953` | Panic    | Runtime      | Refinement predicate failed at runtime                                              |
| `E-TYP-2301` | Error    | Compile-time | Type arguments cannot be inferred; explicit instantiation required                  |
| `E-TYP-2302` | Error    | Compile-time | Type argument does not satisfy required class bound or predicate                    |
| `E-TYP-2303` | Error    | Compile-time | Wrong number of type arguments                                                      |
| `E-TYP-2304` | Error    | Compile-time | Duplicate type parameter name in generic declaration                                |
| `E-TYP-2305` | Error    | Compile-time | Class bound references a non-class type                                             |
| `E-TYP-2307` | Error    | Compile-time | Infinite monomorphization recursion                                                 |
| `E-TYP-2308` | Error    | Compile-time | Monomorphization depth limit exceeded                                               |
| `E-TYP-2401` | Error    | Compile-time | Non-modal type implements modal class                                               |
| `E-TYP-2402` | Error    | Compile-time | Implementing type missing required field                                            |
| `E-TYP-2403` | Error    | Compile-time | Implementing modal missing required state                                           |
| `E-TYP-2404` | Error    | Compile-time | Implementing field has incompatible type                                            |
| `E-TYP-2405` | Error    | Compile-time | Implementing state missing required payload field                                   |
| `E-TYP-2406` | Error    | Compile-time | Conflicting field names from multiple classes                                       |
| `E-TYP-2407` | Error    | Compile-time | Conflicting state names from multiple classes                                       |
| `E-TYP-2408` | Error    | Compile-time | Duplicate abstract field name in class                                              |
| `E-TYP-2409` | Error    | Compile-time | Duplicate abstract state name in class                                              |
| `E-TYP-2500` | Error    | Compile-time | Duplicate procedure name in class                                                   |
| `E-TYP-2501` | Error    | Compile-time | `override` used on abstract procedure implementation                                |
| `E-TYP-2502` | Error    | Compile-time | Missing `override` on concrete procedure replacement                                |
| `E-TYP-2503` | Error    | Compile-time | Type does not implement required procedure from class or has incompatible signature |
| `E-TYP-2504` | Error    | Compile-time | Duplicate associated type name in class                                             |
| `E-TYP-2505` | Error    | Compile-time | Name conflict among class members                                                   |
| `E-TYP-2506` | Error    | Compile-time | Coherence violation: duplicate class implementation                                 |
| `E-TYP-2507` | Error    | Compile-time | Orphan rule violation: neither type nor class is local                              |
| `E-TYP-2508` | Error    | Compile-time | Cyclic superclass dependency detected                                               |
| `E-TYP-2509` | Error    | Compile-time | Superclass bound refers to undefined class                                          |
| `E-TYP-2510` | Error    | Compile-time | Accessing member not defined on opaque type's class                                 |
| `E-TYP-2511` | Error    | Compile-time | Opaque return type does not implement required class                                |
| `E-TYP-2512` | Error    | Compile-time | Attempting to assign incompatible opaque types                                      |
| `E-TYP-2530` | Error    | Compile-time | Type argument does not satisfy class constraint                                     |
| `E-TYP-2531` | Error    | Compile-time | Unconstrained type parameter used in class method                                   |
| `E-TYP-2540` | Error    | Compile-time | Non-vtable-eligible procedure called on `$`                                         |
| `E-TYP-2541` | Error    | Compile-time | Dynamic class type created from non-dispatchable class                              |
| `E-TYP-2542` | Error    | Compile-time | Generic procedure in class is not vtable-eligible for `$` dispatch                  |
| `E-TYP-2621` | Error    | Compile-time | Type satisfies both `BitcopyType` and `DropType`                                    |
| `E-TYP-2622` | Error    | Compile-time | `BitcopyType` has non-`BitcopyType` field                                           |
| `E-UNS-0105` | Error    | Compile-time | `override` used with no concrete procedure to override                              |
| `E-UNS-0106` | Error    | Compile-time | Conflicting procedure signatures from multiple classes                              |
