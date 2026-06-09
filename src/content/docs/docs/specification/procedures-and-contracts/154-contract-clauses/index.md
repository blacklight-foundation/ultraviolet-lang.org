---
title: "15.4 Contract Clauses"
description: "15.4 Contract Clauses from 15. Procedures and Contracts of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "procedures-and-contracts"
specSection: "154-contract-clauses"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/procedures-and-contracts/">15. Procedures and Contracts</a>
  <span>Procedures and Contracts</span>
</div>

## 15.4 Contract Clauses

### 15.4.1 Syntax

```text
contract_clause    ::= "|:" contract_body
contract_body      ::= precondition_expr "|=" postcondition_expr
                     | "|=" postcondition_expr
                     | precondition_expr
precondition_expr  ::= predicate_expr
postcondition_expr ::= predicate_expr
```

### 15.4.2 Parsing

`ForeignContractStart` is defined by §23.6.2 and is used here only to disambiguate ordinary contract clauses from foreign contract clauses.

**(Parse-ContractClauseOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|:"})\ \lor \ \operatorname{ForeignContractStart}(P) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseContractClauseOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-ContractClauseOpt-Yes)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|:"})\quad \Gamma \ \vdash \ \operatorname{ParseContractBody}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{clause}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseContractClauseOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{clause})
\end{array}
$$

**(Parse-ContractBody-PostOnly)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|="})\quad \Gamma \ \vdash \ \operatorname{ParsePredicateExpr}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{post}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseContractBody}(P)\ \Downarrow \ (P_{1},\ \langle \top ,\ \mathsf{post}\rangle )
\end{array}
$$

**(Parse-ContractBody-PrePost)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParsePredicateExpr}(P)\ \Downarrow \ (P_{1},\ \mathsf{pre})\quad \operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{"|="})\quad \Gamma \ \vdash \ \operatorname{ParsePredicateExpr}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{post}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseContractBody}(P)\ \Downarrow \ (P_{2},\ \langle \mathsf{pre},\ \mathsf{post}\rangle )
\end{array}
$$

**(Parse-ContractBody-PreOnly)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParsePredicateExpr}(P)\ \Downarrow \ (P_{1},\ \mathsf{pre})\quad \lnot \ \operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{"|="}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseContractBody}(P)\ \Downarrow \ (P_{1},\ \langle \mathsf{pre},\ \bot \rangle )
\end{array}
$$

### 15.4.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{ContractClause}\ =\ \langle \mathsf{pre},\ \mathsf{post}\rangle  \\[0.16em]
\mathsf{contract}_{\mathsf{opt}}\ \in \ \{\bot \}\ \cup \ \mathsf{ContractClause}
\end{array}
$$

### 15.4.4 Static Semantics

**(WF-Contract)**

$$
\begin{array}{l}
\Gamma_{\mathsf{pre}} \ \vdash \ P_{\mathsf{pre}}\ :\ \texttt{bool}\quad \operatorname{pure}(P_{\mathsf{pre}}) \\[0.16em]
\Gamma_{\mathsf{post}} \ \vdash \ P_{\mathsf{post}}\ :\ \texttt{bool}\quad \operatorname{pure}(P_{\mathsf{post}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \texttt{|:}\ P_{\mathsf{pre}}\ \texttt{|=}\ P_{\mathsf{post}}\ :\ \mathsf{WF}
\end{array}
$$

The purity judgment for contract expressions is:

**(Pure-Literal)**

$$
\begin{array}{l}
v\ \in \ \mathsf{Literals} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LiteralExpr}(v)\ \mathsf{pure}
\end{array}
$$

**(Pure-Ident)**

$$
\begin{array}{l}
\Gamma (x)\ =\ (T,\ \_) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Ident}(x)\ \mathsf{pure}
\end{array}
$$

**(Pure-Field)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ \mathsf{pure} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{FieldAccess}(e,\ f)\ \mathsf{pure}
\end{array}
$$

**(Pure-Tuple-Access)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ \mathsf{pure} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TupleAccess}(e,\ i)\ \mathsf{pure}
\end{array}
$$

**(Pure-Index)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ \mathsf{pure}\quad \Gamma \ \vdash \ e_{2}\ \mathsf{pure} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ \mathsf{pure}
\end{array}
$$

**(Pure-Unary)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ \mathsf{pure}\quad \mathsf{op}\ \in \ \{\texttt{!},\ \texttt{-},\ \texttt{*}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{UnaryExpr}(\mathsf{op},\ e)\ \mathsf{pure}
\end{array}
$$

**(Pure-Binary)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ \mathsf{pure}\quad \Gamma \ \vdash \ e_{2}\ \mathsf{pure}\quad \mathsf{op}\ \in \ \mathsf{PureOps} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BinaryExpr}(\mathsf{op},\ e_{1},\ e_{2})\ \mathsf{pure}
\end{array}
$$

$$
\mathsf{PureOps}\ =\ \{\texttt{+},\ \texttt{-},\ \texttt{*},\ \texttt{/},\ \texttt{\%},\ \texttt{**},\ \texttt{==},\ \texttt{!=},\ \texttt{<},\ \texttt{<=},\ \texttt{>},\ \texttt{>=},\ \texttt{\&\&},\ \texttt{||},\ \texttt{\&},\ \texttt{|},\ \texttt{\^{}},\ \texttt{<<},\ \texttt{>>},\ \texttt{..},\ \texttt{..=}\}
$$

**(Pure-Cast)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ \mathsf{pure} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CastExpr}(e,\ T)\ \mathsf{pure}
\end{array}
$$

**(Pure-If)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{\mathsf{cond}}\ \mathsf{pure}\quad \Gamma \ \vdash \ e_{\mathsf{then}}\ \mathsf{pure}\quad \Gamma \ \vdash \ e_{\mathsf{else}}\ \mathsf{pure} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IfExpr}(e_{\mathsf{cond}},\ e_{\mathsf{then}},\ e_{\mathsf{else}})\ \mathsf{pure}
\end{array}
$$

**(Pure-If-Is)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ \mathsf{pure}\quad \Gamma ,\ \operatorname{PatternBindings}(\mathsf{pat})\ \vdash \ b_{t}\ \mathsf{pure}\quad \Gamma \ \vdash \ b_{f}\ \mathsf{pure} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IfIsExpr}(e,\ \mathsf{pat},\ b_{t},\ b_{f})\ \mathsf{pure}
\end{array}
$$

**(Pure-If-Is-No-Else)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ \mathsf{pure}\quad \Gamma ,\ \operatorname{PatternBindings}(\mathsf{pat})\ \vdash \ b_{t}\ \mathsf{pure} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IfIsExpr}(e,\ \mathsf{pat},\ b_{t},\ \bot )\ \mathsf{pure}
\end{array}
$$

**(Pure-If-Case)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ \mathsf{pure}\quad \forall \ \mathsf{case}\ \in \ \mathsf{cases}.\ \Gamma ,\ \operatorname{PatternBindings}(\mathsf{case}.\mathsf{pat})\ \vdash \ \mathsf{case}.\mathsf{body}\ \mathsf{pure}\quad \Gamma \ \vdash \ b_{f}\ \mathsf{pure} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ b_{f})\ \mathsf{pure}
\end{array}
$$

**(Pure-If-Case-No-Else)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ \mathsf{pure}\quad \forall \ \mathsf{case}\ \in \ \mathsf{cases}.\ \Gamma ,\ \operatorname{PatternBindings}(\mathsf{case}.\mathsf{pat})\ \vdash \ \mathsf{case}.\mathsf{body}\ \mathsf{pure} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ \bot )\ \mathsf{pure}
\end{array}
$$

**(Pure-Block)**

$$
\begin{array}{l}
\forall \ s\ \in \ \mathsf{stmts}.\ \Gamma \ \vdash \ s\ \mathsf{pure}_{\mathsf{stmt}}\quad \Gamma \ \vdash \ e\ \mathsf{pure} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BlockExpr}(\mathsf{stmts},\ e)\ \mathsf{pure}
\end{array}
$$

**(Pure-Tuple)**

$$
\begin{array}{l}
\forall \ i.\ \Gamma \ \vdash \ e_{i}\ \mathsf{pure} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TupleExpr}([e_{1},\ \ldots ,\ e_{n}])\ \mathsf{pure}
\end{array}
$$

**(Pure-Array)**

$$
\begin{array}{l}
\forall \ i.\ \Gamma \ \vdash \ e_{i}\ \mathsf{pure} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ArrayExpr}([e_{1},\ \ldots ,\ e_{n}])\ \mathsf{pure}
\end{array}
$$

**(Pure-Record)**

$$
\begin{array}{l}
\forall \ (f,\ e)\ \in \ \mathsf{fields}.\ \Gamma \ \vdash \ e\ \mathsf{pure} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RecordExpr}(T,\ \mathsf{fields})\ \mathsf{pure}
\end{array}
$$

**(Pure-Call-Builtin)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ \mathsf{pure}\quad \ldots \quad \Gamma \ \vdash \ e_{n}\ \mathsf{pure}\quad \operatorname{BuiltinPure}(f) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CallExpr}(f,\ [e_{1},\ \ldots ,\ e_{n}])\ \mathsf{pure}
\end{array}
$$

**(Pure-Call-Procedure)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ \mathsf{pure}\quad \ldots \quad \Gamma \ \vdash \ e_{n}\ \mathsf{pure}\quad \operatorname{ProcDecl}(f)\ =\ P\quad \lnot \operatorname{HasCapabilityParams}(P)\quad \operatorname{IsPureProc}(P) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CallExpr}(f,\ [e_{1},\ \ldots ,\ e_{n}])\ \mathsf{pure}
\end{array}
$$

**(Pure-Method-Const)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ \mathsf{pure}\quad \Gamma \ \vdash \ e_{1}\ \mathsf{pure}\quad \ldots \quad \Gamma \ \vdash \ e_{n}\ \mathsf{pure}\quad \operatorname{ReceiverPerm}(m)\ =\ \texttt{const}\quad \lnot \operatorname{HasCapabilityParams}(m)\quad \operatorname{IsPureProc}(m) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MethodCallExpr}(e,\ m,\ [e_{1},\ \ldots ,\ e_{n}])\ \mathsf{pure}
\end{array}
$$

**(Pure-Comptime)**

$$
\begin{array}{l}
\operatorname{ComptimeProc}(f)\quad \Gamma \ \vdash \ e_{1}\ \mathsf{pure}\quad \ldots \quad \Gamma \ \vdash \ e_{n}\ \mathsf{pure}\quad \forall \ T\ \in \ \operatorname{ArgTypes}(f)\ \cup \ \{\operatorname{ReturnType}(f)\}.\ \operatorname{CtAvail}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CallExpr}(f,\ [e_{1},\ \ldots ,\ e_{n}])\ \mathsf{pure}
\end{array}
$$

Contract predicate checking is a static verification context. Pure compile-time
procedures may be evaluated in contract predicates when their argument and result
types are valid for compile-time evaluation and the final predicate has type `bool`.
Such calls are absent from runtime item lowering.

**Helper Predicates**

$$
\begin{array}{l}
\operatorname{HasCapabilityParams}(P)\ \Leftrightarrow \ \exists \ \mathsf{param}\ \in \ \operatorname{Params}(P).\ \operatorname{IsCapabilityType}(\operatorname{ParamType}(\mathsf{param})) \\[0.16em]
\operatorname{IsCapabilityType}(T)\ \Leftrightarrow \ \operatorname{CapInType}(T)\ \ne \ \emptyset  \\[0.16em]
\operatorname{ContainsCapability}(T)\ \Leftrightarrow \ \operatorname{CapInType}(T)\ \ne \ \emptyset  \\[0.16em]
\operatorname{BuiltinPure}(f)\ \Leftrightarrow \ f\ \in \ \{\mathsf{sizeof},\ \mathsf{alignof},\ \mathsf{type}_{\mathsf{name}},\ \ldots \} \\[0.16em]
\operatorname{IsPureProc}(P)\ \Leftrightarrow \ \forall \ \mathsf{stmt}\ \in \ \operatorname{Body}(P).\ \Gamma \ \vdash \ \mathsf{stmt}\ \mathsf{pure}_{\mathsf{stmt}}\ \land \ \lnot \operatorname{WritesGlobalState}(P) \\[0.16em]
\operatorname{ComptimeProc}(f)\ \Leftrightarrow \ \operatorname{HasAttribute}(\operatorname{ProcDecl}(f),\ \texttt{comptime})
\end{array}
$$

The following forms are never pure: assignment expressions, mutable method calls, allocation expressions, spawn/dispatch/parallel expressions, yield/wait expressions, procedure calls with capability parameters, and unsafe blocks.

**Precondition Evaluation Context (Γ_pre)** includes the receiver binding (if present) and all procedure parameters at entry state. It excludes `@result`, `@entry`, module-scope bindings, enclosing locals, and body-local bindings.

**Postcondition Evaluation Context (Γ_post)** includes the receiver, all procedure parameters, `@result`, and `@entry`. Mutable parameters and mutable receivers denote post-state values on the right of `|=`, while `@entry(...)` denotes entry-state values.

### 15.4.5 Dynamic Semantics

Contract clauses themselves have no independent runtime effect. Their operational impact is through verification and inserted `ContractCheck` forms defined in §15.8.

### 15.4.6 Lowering

No lowering is defined directly for a contract clause. Lowering consumes verification results and, when required, emits checks as defined in §15.8.

### 15.4.7 Diagnostics

Diagnostics are defined for malformed contract clauses and for contract predicates that are ill-typed or impure.
