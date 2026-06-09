---
title: "21.3 Composition Forms"
description: "21.3 Composition Forms from 21. Asynchronous Operations of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "asynchronous-operations"
specSection: "213-composition-forms"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/asynchronous-operations/">21. Asynchronous Operations</a>
  <span>Asynchronous Operations</span>
</div>

## 21.3 Composition Forms

### 21.3.1 Syntax

`loop ... in ...` async iteration uses the ordinary loop syntax defined in Chapter 18.

Manual stepping uses ordinary modal-state inspection and method-call syntax.

```text
sync_expr    ::= "sync" expression
race_expr    ::= "race" "{" race_arm ("," race_arm)* "}"
race_arm     ::= expression "->" "|" pattern "|" race_handler
race_handler ::= expression | "yield" expression
all_expr     ::= "all" "{" expression ("," expression)* "}"
```

This section defines the following method-call surfaces:

- `shared_value~>until(pred, action)`
- `a~>map(f)`
- `a~>filter(p)`
- `a~>take(n)`
- `a~>fold(init, f)`
- `a~>chain(f)`

`until` is a source-specified method-call surface on `shared` values. Its type and runtime behavior are defined by this section's static and dynamic semantics.

### 21.3.2 Parsing

`sync`, `race`, and `all` are primary expressions.

`sync` is parsed by:

**(Parse-Sync-Expr)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{sync})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (P_{1},\ \operatorname{SyncExpr}(e))
\end{array}
$$

`race` is parsed by:

**(Parse-Race-Expr)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{race})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseRaceArms}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ \mathsf{arms})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{RaceExpr}(\mathsf{arms}))
\end{array}
$$

Race-arm parsing is:

**(Parse-RaceArms-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseRaceArm}(P)\ \Downarrow \ (P_{1},\ a)\quad \Gamma \ \vdash \ \operatorname{ParseRaceArmsTail}(P_{1},\ [a])\ \Downarrow \ (P_{2},\ \mathsf{arms}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRaceArms}(P)\ \Downarrow \ (P_{2},\ \mathsf{arms})
\end{array}
$$

**(Parse-RaceArm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseExpr}(P)\ \Downarrow \ (P_{1},\ e)\quad \operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{"->"})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P_{1})),\ \texttt{"|"}) \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePattern}(\operatorname{Advance}(\operatorname{Advance}(P_{1})))\ \Downarrow \ (P_{2},\ \mathsf{pat})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{"|"}) \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRaceHandler}(\operatorname{Advance}(P_{2}))\ \Downarrow \ (P_{3},\ \mathsf{handler}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRaceArm}(P)\ \Downarrow \ (P_{3},\ \langle e,\ \mathsf{pat},\ \mathsf{handler}\rangle )
\end{array}
$$

**(Parse-RaceArmsTail-End)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRaceArmsTail}(P,\ \mathsf{xs})\ \Downarrow \ (P,\ \mathsf{xs})
\end{array}
$$

**(Parse-RaceArmsTail-TrailingComma)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRaceArmsTail}(P,\ \mathsf{xs})\ \Downarrow \ (\operatorname{Advance}(P),\ \mathsf{xs})
\end{array}
$$

**(Parse-RaceArmsTail-Comma)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParseRaceArm}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ a)\quad \Gamma \ \vdash \ \operatorname{ParseRaceArmsTail}(P_{1},\ \mathsf{xs}\ \mathbin{++} \ [a])\ \Downarrow \ (P_{2},\ \mathsf{ys}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRaceArmsTail}(P,\ \mathsf{xs})\ \Downarrow \ (P_{2},\ \mathsf{ys})
\end{array}
$$

**(Parse-RaceHandler-Yield)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{yield})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRaceHandler}(P)\ \Downarrow \ (P_{1},\ \operatorname{RaceYield}(e))
\end{array}
$$

**(Parse-RaceHandler-Return)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseExpr}(P)\ \Downarrow \ (P_{1},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRaceHandler}(P)\ \Downarrow \ (P_{1},\ \operatorname{RaceReturn}(e))
\end{array}
$$

`all` is parsed by:

**(Parse-All-Expr)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{all})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseAllExprList}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ \mathsf{es})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{AllExpr}(\mathsf{es}))
\end{array}
$$

`loop ... in ...`, manual stepping, `until`, and async combinators use ordinary parsing for loops, modal-state operations, and method calls.

### 21.3.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{RaceHandler}\ =\ \{\operatorname{RaceReturn}(\mathsf{expr}),\ \operatorname{RaceYield}(\mathsf{expr})\} \\[0.16em]
\mathsf{RaceArm}\ =\ \langle \mathsf{expr},\ \mathsf{pat},\ \mathsf{handler}\rangle \quad \mathsf{handler}\ \in \ \mathsf{RaceHandler} \\[0.16em]
\mathsf{RaceArms}\ =\ [\mathsf{RaceArm}] \\[0.16em]
\mathsf{Expr}\ \mathsf{includes}: \\[0.16em]
\ \operatorname{SyncExpr}(\mathsf{expr}) \\[0.16em]
\ \operatorname{RaceExpr}(\mathsf{arms}) \\[0.16em]
\ \operatorname{AllExpr}(\mathsf{exprs})
\end{array}
$$

Async iteration uses the existing loop form:

```text
LoopIter(pattern, type_opt, iter, inv_opt, body)
```

Manual stepping, `until`, and async combinators use existing `IfCaseExpr`, modal-state forms, and `MethodCall`.

No dedicated AST nodes are introduced for `until` or for async combinators beyond ordinary method calls.

Resolution is:

$$
\begin{array}{l}
\mathsf{ResolveRaceJudg}\ =\ \{\mathsf{ResolveRaceArm},\ \mathsf{ResolveRaceArms},\ \mathsf{ResolveRaceHandler}\} \\[0.16em]
\mathsf{ResolveAllExprListJudg}\ =\ \{\mathsf{ResolveAllExprList}\} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveRaceHandler}(\operatorname{RaceReturn}(e))\ \Downarrow \ \operatorname{RaceReturn}(e') \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveRaceHandler}(\operatorname{RaceYield}(e))\ \Downarrow \ \operatorname{RaceYield}(e') \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveRaceArm}(\langle e,\ \mathsf{pat},\ \mathsf{handler}\rangle )\ \Downarrow \ \langle e',\ \mathsf{pat}',\ \mathsf{handler}'\rangle  \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveRaceArms}([])\ \Downarrow \ [] \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveRaceArms}(a\ \mathbin{::} \ \mathsf{as})\ \Downarrow \ a'\ \mathbin{::} \ \mathsf{as}' \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveAllExprList}([])\ \Downarrow \ [] \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveAllExprList}(e\ \mathbin{::} \ \mathsf{es})\ \Downarrow \ e'\ \mathbin{::} \ \mathsf{es}' \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{SyncExpr}(e))\ \Downarrow \ \operatorname{SyncExpr}(e') \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{RaceExpr}(\mathsf{arms}))\ \Downarrow \ \operatorname{RaceExpr}(\mathsf{arms}') \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{AllExpr}(\mathsf{es}))\ \Downarrow \ \operatorname{AllExpr}(\mathsf{es}')
\end{array}
$$

Evaluation order is:

$$
\begin{array}{l}
\operatorname{RaceArmExprs}([])\ =\ [] \\[0.16em]
\operatorname{RaceArmExprs}(\langle e,\ \_,\ \_\rangle \ \mathbin{::} \ \mathsf{as})\ =\ [e]\ \mathbin{++} \ \operatorname{RaceArmExprs}(\mathsf{as}) \\[0.16em]
\operatorname{Children_LTR}(\operatorname{SyncExpr}(e))\ =\ [e] \\[0.16em]
\operatorname{Children_LTR}(\operatorname{RaceExpr}(\mathsf{arms}))\ =\ \operatorname{RaceArmExprs}(\mathsf{arms}) \\[0.16em]
\operatorname{Children_LTR}(\operatorname{AllExpr}(\mathsf{es}))\ =\ \mathsf{es}
\end{array}
$$

### 21.3.4 Static Semantics

Async iteration over `loop pat in e { body }` is:

**(T-Loop-Iter-Async)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \langle \mathsf{Out}_{r},\ \mathsf{In}_{r},\ \mathsf{Result}_{r},\ E_{r}\rangle \quad \Gamma ;\ R;\ L\ \vdash \ \mathsf{iter}\ :\ T_{\mathsf{iter}}\quad \operatorname{AsyncSig}(T_{\mathsf{iter}})\ =\ \langle \mathsf{Out}_{i},\ \mathsf{In}_{i},\ \mathsf{Result}_{i},\ E_{i}\rangle \quad \mathsf{In}_{i}\ =\ \operatorname{TypePrim}(\texttt{"()"})\quad \Gamma \ \vdash \ E_{i}\ \mathrel{<:} \ E_{r} \\[0.16em]
(\mathsf{ty}_{\mathsf{opt}}\ =\ \bot \ \Rightarrow \ T_{p}\ =\ \mathsf{Out}_{i})\quad (\mathsf{ty}_{\mathsf{opt}}\ =\ T_{a}\ \Rightarrow \ \Gamma \ \vdash \ \mathsf{Out}_{i}\ \mathrel{<:} \ T_{a}\ \land \ T_{p}\ =\ T_{a}) \\[0.16em]
\Gamma \ \vdash \ \mathsf{pat}\ \Leftarrow \ T_{p}\ \dashv \ B\quad \operatorname{Distinct}(\operatorname{PatNames}(\mathsf{pat}))\quad \operatorname{LoopInvOk}(\mathsf{inv}_{\mathsf{opt}}) \\[0.16em]
\Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \operatorname{IntroAll}(\Gamma_{0} ,\ B)\ \Downarrow \ \Gamma_{1}  \\[0.16em]
\Gamma_{1} ;\ R;\ \texttt{loop}\ \vdash \ \operatorname{BlockInfo}(\mathsf{body})\ \Downarrow \ \langle T_{b},\ \mathsf{Brk},\ \mathsf{BrkVoid}\rangle \quad \operatorname{LoopTypeFin}(\mathsf{Brk},\ \mathsf{BrkVoid})\ =\ T_{r} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{LoopIter}(\mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{iter},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body})\ :\ T_{r}
\end{array}
$$

**(Loop-Async-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{iter}\ :\ T_{\mathsf{iter}}\quad \operatorname{AsyncSig}(T_{\mathsf{iter}})\ =\ \langle \mathsf{Out}_{i},\ \mathsf{In}_{i},\ \mathsf{Result}_{i},\ E_{i}\rangle \quad (\operatorname{AsyncSig}(R)\ =\ \bot \ \lor \ \mathsf{In}_{i}\ \ne \ \operatorname{TypePrim}(\texttt{"()"})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{LoopIter}(\mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{iter},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body})\ \Uparrow 
\end{array}
$$

Manual stepping is permitted by ordinary modal-state inspection and `a~>resume(input)`. It is required when an async value has `In ≠ ()`.

`sync` typing is:

$$
\begin{array}{l}
\operatorname{YieldInExpr}(e)\ \Leftrightarrow \ \exists \ e'\ \in \ \operatorname{SubExprsList}([e]).\ e'\ =\ \operatorname{YieldExpr}(\_,\ \_) \\[0.16em]
\operatorname{YieldFromInExpr}(e)\ \Leftrightarrow \ \exists \ e'\ \in \ \operatorname{SubExprsList}([e]).\ e'\ =\ \operatorname{YieldFromExpr}(\_,\ \_)
\end{array}
$$

**(Sync-Yield-Err)**

$$
\begin{array}{l}
\operatorname{YieldInExpr}(e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{SyncExpr}(e)\ \Uparrow 
\end{array}
$$

**(Sync-YieldFrom-Err)**

$$
\begin{array}{l}
\operatorname{YieldFromInExpr}(e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{SyncExpr}(e)\ \Uparrow 
\end{array}
$$

**(T-Sync)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \bot \quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ T_{e}\quad \operatorname{AsyncSig}(T_{e})\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle \quad \mathsf{Out}\ =\ \operatorname{TypePrim}(\texttt{"()"})\quad \mathsf{In}\ =\ \operatorname{TypePrim}(\texttt{"()"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{SyncExpr}(e)\ :\ \operatorname{TypeUnion}([\mathsf{Result},\ E])
\end{array}
$$

**(Sync-Async-Context-Err)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ \ne \ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{SyncExpr}(e)\ \Uparrow 
\end{array}
$$

**(Sync-Out-Err)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \bot \quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ T_{e} \\[0.16em]
(\operatorname{AsyncSig}(T_{e})\ =\ \bot \ \lor \ (\operatorname{AsyncSig}(T_{e})\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle \ \land \ \mathsf{Out}\ \ne \ \operatorname{TypePrim}(\texttt{"()"}))) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{SyncExpr}(e)\ \Uparrow 
\end{array}
$$

**(Sync-In-Err)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \bot \quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ T_{e}\quad \operatorname{AsyncSig}(T_{e})\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle \quad \mathsf{Out}\ =\ \operatorname{TypePrim}(\texttt{"()"})\quad \mathsf{In}\ \ne \ \operatorname{TypePrim}(\texttt{"()"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{SyncExpr}(e)\ \Uparrow 
\end{array}
$$

`race` typing is:

$$
\begin{array}{l}
\operatorname{RaceMode}(\mathsf{arms})\ = \\[0.16em]
\ \{\ \texttt{return}\quad \mathsf{if}\ \forall \ \mathsf{arm}\ \in \ \mathsf{arms}.\ \mathsf{arm}.\mathsf{handler}\ =\ \operatorname{RaceReturn}(\_) \\[0.16em]
\quad \texttt{yield}\quad \mathsf{if}\ \forall \ \mathsf{arm}\ \in \ \mathsf{arms}.\ \mathsf{arm}.\mathsf{handler}\ =\ \operatorname{RaceYield}(\_) \\[0.16em]
\quad \bot \quad \mathsf{otherwise}\ \}
\end{array}
$$

**(T-Race)**

$$
\begin{array}{l}
n\ =\ \mid \mathsf{arms}\mid \quad n\ \ge \ 2\quad \operatorname{RaceMode}(\mathsf{arms})\ =\ \texttt{return} \\[0.16em]
\forall \ i,\ \mathsf{arm}_{i}\ =\ \langle e_{i},\ \mathsf{pat}_{i},\ \operatorname{RaceReturn}(r_{i})\rangle \quad \Gamma ;\ R;\ L\ \vdash \ e_{i}\ :\ T_{i}\quad \operatorname{AsyncSig}(T_{i})\ =\ \langle \mathsf{Out}_{i},\ \mathsf{In}_{i},\ \mathsf{Result}_{i},\ E_{i}\rangle  \\[0.16em]
\mathsf{Out}_{i}\ =\ \operatorname{TypePrim}(\texttt{"()"})\quad \mathsf{In}_{i}\ =\ \operatorname{TypePrim}(\texttt{"()"})\quad \Gamma \ \vdash \ \mathsf{pat}_{i}\ \Leftarrow \ \mathsf{Result}_{i}\ \dashv \ B_{i}\quad \operatorname{Distinct}(\operatorname{PatNames}(\mathsf{pat}_{i})) \\[0.16em]
\Gamma_{i} \ =\ \operatorname{IntroAll}(\Gamma ,\ B_{i})\quad \Gamma_{i} ;\ R;\ L\ \vdash \ r_{i}\ :\ T_{i}^r\quad \mathsf{AllEq}\_\Gamma ([T_{1}^r,\ \ldots ,\ T_{n}^r])\quad T_{r}\ =\ T_{1}^r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{RaceExpr}(\mathsf{arms})\ :\ \operatorname{TypeUnion}([T_{r},\ E_{1},\ \ldots ,\ E_{n}])
\end{array}
$$

**(T-Race-Stream)**

$$
\begin{array}{l}
n\ =\ \mid \mathsf{arms}\mid \quad n\ \ge \ 2\quad \operatorname{RaceMode}(\mathsf{arms})\ =\ \texttt{yield} \\[0.16em]
\forall \ i,\ \mathsf{arm}_{i}\ =\ \langle e_{i},\ \mathsf{pat}_{i},\ \operatorname{RaceYield}(r_{i})\rangle \quad \Gamma ;\ R;\ L\ \vdash \ e_{i}\ :\ T_{i}\quad \operatorname{AsyncSig}(T_{i})\ =\ \langle \mathsf{Out}_{i},\ \mathsf{In}_{i},\ \mathsf{Result}_{i},\ E_{i}\rangle  \\[0.16em]
\mathsf{In}_{i}\ =\ \operatorname{TypePrim}(\texttt{"()"})\quad \Gamma \ \vdash \ \mathsf{pat}_{i}\ \Leftarrow \ \mathsf{Out}_{i}\ \dashv \ B_{i}\quad \operatorname{Distinct}(\operatorname{PatNames}(\mathsf{pat}_{i})) \\[0.16em]
\Gamma_{i} \ =\ \operatorname{IntroAll}(\Gamma ,\ B_{i})\quad \Gamma_{i} ;\ R;\ L\ \vdash \ r_{i}\ :\ U_{i}\quad \mathsf{AllEq}\_\Gamma ([U_{1},\ \ldots ,\ U_{n}])\quad U\ =\ U_{1} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{RaceExpr}(\mathsf{arms})\ :\ \operatorname{TypeApply}([\texttt{"Stream"}],\ [U,\ \operatorname{TypeUnion}([E_{1},\ \ldots ,\ E_{n}])])
\end{array}
$$

**(Race-Arity-Err)**

$$
\begin{array}{l}
n\ =\ \mid \mathsf{arms}\mid \quad n\ <\ 2 \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{RaceExpr}(\mathsf{arms})\ \Uparrow 
\end{array}
$$

**(Race-Handler-Mix-Err)**

$$
\begin{array}{l}
\operatorname{RaceMode}(\mathsf{arms})\ =\ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{RaceExpr}(\mathsf{arms})\ \Uparrow 
\end{array}
$$

**(Race-Operand-Out-Err)**

$$
\begin{array}{l}
\operatorname{RaceMode}(\mathsf{arms})\ =\ \texttt{return} \\[0.16em]
\exists \ i.\ \Gamma ;\ R;\ L\ \vdash \ e_{i}\ :\ T_{i}\ \land \ (\operatorname{AsyncSig}(T_{i})\ =\ \langle \mathsf{Out}_{i},\ \mathsf{In}_{i},\ \mathsf{Result}_{i},\ E_{i}\rangle \ \land \ \mathsf{Out}_{i}\ \ne \ \operatorname{TypePrim}(\texttt{"()"})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{RaceExpr}(\mathsf{arms})\ \Uparrow 
\end{array}
$$

**(Race-Operand-Err)**

$$
\begin{array}{l}
\operatorname{RaceMode}(\mathsf{arms})\ =\ \texttt{return} \\[0.16em]
\exists \ i.\ \Gamma ;\ R;\ L\ \vdash \ e_{i}\ :\ T_{i}\ \land \ (\operatorname{AsyncSig}(T_{i})\ =\ \bot \ \lor \ (\operatorname{AsyncSig}(T_{i})\ =\ \langle \mathsf{Out}_{i},\ \mathsf{In}_{i},\ \mathsf{Result}_{i},\ E_{i}\rangle \ \land \ \mathsf{Out}_{i}\ =\ \operatorname{TypePrim}(\texttt{"()"})\ \land \ \mathsf{In}_{i}\ \ne \ \operatorname{TypePrim}(\texttt{"()"}))) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{RaceExpr}(\mathsf{arms})\ \Uparrow 
\end{array}
$$

**(Race-Stream-Operand-Err)**

$$
\begin{array}{l}
\operatorname{RaceMode}(\mathsf{arms})\ =\ \texttt{yield} \\[0.16em]
\exists \ i.\ \Gamma ;\ R;\ L\ \vdash \ e_{i}\ :\ T_{i}\ \land \ (\operatorname{AsyncSig}(T_{i})\ =\ \bot \ \lor \ (\operatorname{AsyncSig}(T_{i})\ =\ \langle \mathsf{Out}_{i},\ \mathsf{In}_{i},\ \mathsf{Result}_{i},\ E_{i}\rangle \ \land \ \mathsf{In}_{i}\ \ne \ \operatorname{TypePrim}(\texttt{"()"}))) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{RaceExpr}(\mathsf{arms})\ \Uparrow 
\end{array}
$$

**(Race-Handler-Type-Err)**

$$
\begin{array}{l}
n\ =\ \mid \mathsf{arms}\mid \quad n\ \ge \ 2\quad \operatorname{RaceMode}(\mathsf{arms})\ =\ \texttt{return} \\[0.16em]
\forall \ i,\ \mathsf{arm}_{i}\ =\ \langle e_{i},\ \mathsf{pat}_{i},\ \operatorname{RaceReturn}(r_{i})\rangle \quad \Gamma ;\ R;\ L\ \vdash \ e_{i}\ :\ T_{i}\quad \operatorname{AsyncSig}(T_{i})\ =\ \langle \mathsf{Out}_{i},\ \mathsf{In}_{i},\ \mathsf{Result}_{i},\ E_{i}\rangle  \\[0.16em]
\mathsf{Out}_{i}\ =\ \operatorname{TypePrim}(\texttt{"()"})\quad \mathsf{In}_{i}\ =\ \operatorname{TypePrim}(\texttt{"()"})\quad \Gamma \ \vdash \ \mathsf{pat}_{i}\ \Leftarrow \ \mathsf{Result}_{i}\ \dashv \ B_{i}\quad \operatorname{Distinct}(\operatorname{PatNames}(\mathsf{pat}_{i})) \\[0.16em]
\Gamma_{i} \ =\ \operatorname{IntroAll}(\Gamma ,\ B_{i})\quad \Gamma_{i} ;\ R;\ L\ \vdash \ r_{i}\ :\ T_{i}^r\quad \lnot \ \mathsf{AllEq}\_\Gamma ([T_{1}^r,\ \ldots ,\ T_{n}^r]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{RaceExpr}(\mathsf{arms})\ \Uparrow 
\end{array}
$$

**(Race-Stream-Handler-Type-Err)**

$$
\begin{array}{l}
n\ =\ \mid \mathsf{arms}\mid \quad n\ \ge \ 2\quad \operatorname{RaceMode}(\mathsf{arms})\ =\ \texttt{yield} \\[0.16em]
\forall \ i,\ \mathsf{arm}_{i}\ =\ \langle e_{i},\ \mathsf{pat}_{i},\ \operatorname{RaceYield}(r_{i})\rangle \quad \Gamma ;\ R;\ L\ \vdash \ e_{i}\ :\ T_{i}\quad \operatorname{AsyncSig}(T_{i})\ =\ \langle \mathsf{Out}_{i},\ \mathsf{In}_{i},\ \mathsf{Result}_{i},\ E_{i}\rangle  \\[0.16em]
\mathsf{In}_{i}\ =\ \operatorname{TypePrim}(\texttt{"()"})\quad \Gamma \ \vdash \ \mathsf{pat}_{i}\ \Leftarrow \ \mathsf{Out}_{i}\ \dashv \ B_{i}\quad \operatorname{Distinct}(\operatorname{PatNames}(\mathsf{pat}_{i})) \\[0.16em]
\Gamma_{i} \ =\ \operatorname{IntroAll}(\Gamma ,\ B_{i})\quad \Gamma_{i} ;\ R;\ L\ \vdash \ r_{i}\ :\ U_{i}\quad \lnot \ \mathsf{AllEq}\_\Gamma ([U_{1},\ \ldots ,\ U_{n}]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{RaceExpr}(\mathsf{arms})\ \Uparrow 
\end{array}
$$

`all` typing is:

**(T-All)**

$$
\begin{array}{l}
n\ =\ \mid \mathsf{exprs}\mid \quad \forall \ i,\ \Gamma ;\ R;\ L\ \vdash \ e_{i}\ :\ T_{i}\quad \operatorname{AsyncSig}(T_{i})\ =\ \langle \mathsf{Out}_{i},\ \mathsf{In}_{i},\ \mathsf{Result}_{i},\ E_{i}\rangle  \\[0.16em]
\mathsf{Out}_{i}\ =\ \operatorname{TypePrim}(\texttt{"()"})\quad \mathsf{In}_{i}\ =\ \operatorname{TypePrim}(\texttt{"()"})\quad T_{\mathsf{tuple}}\ =\ \operatorname{TypeTuple}([\mathsf{Result}_{1},\ \ldots ,\ \mathsf{Result}_{n}]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{AllExpr}([e_{1},\ \ldots ,\ e_{n}])\ :\ \operatorname{TypeUnion}([T_{\mathsf{tuple}},\ E_{1},\ \ldots ,\ E_{n}])
\end{array}
$$

**(All-Out-Err)**

$$
\begin{array}{l}
\exists \ i.\ \Gamma ;\ R;\ L\ \vdash \ e_{i}\ :\ T_{i}\ \land \ (\operatorname{AsyncSig}(T_{i})\ =\ \bot \ \lor \ (\operatorname{AsyncSig}(T_{i})\ =\ \langle \mathsf{Out}_{i},\ \mathsf{In}_{i},\ \mathsf{Result}_{i},\ E_{i}\rangle \ \land \ \mathsf{Out}_{i}\ \ne \ \operatorname{TypePrim}(\texttt{"()"}))) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{AllExpr}(\mathsf{exprs})\ \Uparrow 
\end{array}
$$

**(All-In-Err)**

$$
\begin{array}{l}
\exists \ i.\ \Gamma ;\ R;\ L\ \vdash \ e_{i}\ :\ T_{i}\ \land \ (\operatorname{AsyncSig}(T_{i})\ =\ \langle \mathsf{Out}_{i},\ \mathsf{In}_{i},\ \mathsf{Result}_{i},\ E_{i}\rangle \ \land \ \mathsf{Out}_{i}\ =\ \operatorname{TypePrim}(\texttt{"()"})\ \land \ \mathsf{In}_{i}\ \ne \ \operatorname{TypePrim}(\texttt{"()"})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{AllExpr}(\mathsf{exprs})\ \Uparrow 
\end{array}
$$

`until` has the source-specified type:

$$
\mathsf{until}\ :\ \mathsf{shared}\ T\ \times \ \operatorname{procedure}(\mathsf{const}\ T)\ \to \ \mathsf{bool}\ \times \ \operatorname{procedure}(\mathsf{unique}\ T)\ \to \ R\ \to \ \mathsf{Future}<R>
$$

Async combinator typing is:

$$
\begin{array}{l}
\mathsf{map}\quad :\ \mathsf{Async}<\mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E>\ \times \ \operatorname{procedure}(\mathsf{Out})\ \to \ U\ \to \ \mathsf{Async}<U,\ \mathsf{In},\ \mathsf{Result},\ E> \\[0.16em]
\mathsf{filter}\ :\ \mathsf{Async}<T,\ (),\ (),\ E>\ \times \ \operatorname{procedure}(\mathsf{const}\ T)\ \to \ \mathsf{bool}\ \to \ \mathsf{Async}<T,\ (),\ (),\ E> \\[0.16em]
\mathsf{take}\ :\ \mathsf{Async}<T,\ (),\ (),\ E>\ \times \ \mathsf{usize}\ \to \ \mathsf{Async}<T,\ (),\ (),\ E> \\[0.16em]
\mathsf{fold}\ :\ \mathsf{Async}<T,\ (),\ (),\ E>\ \times \ A\ \times \ \operatorname{procedure}(A,\ T)\ \to \ A\ \to \ \mathsf{Future}<A,\ E> \\[0.16em]
\mathsf{chain}\ :\ \mathsf{Future}<T,\ E>\ \times \ \operatorname{procedure}(T)\ \to \ \mathsf{Future}<U,\ E>\ \to \ \mathsf{Future}<U,\ E>
\end{array}
$$

For `e~>name(args)`, if `StripPerm(ExprType(e)) = ModalRefType(modal_ref)` and `BuiltinModalGeneralMember(modal_ref, name)`, typing MUST be derived by the async combinator rules in this section.

A conforming implementation MUST resolve `AsyncCombinatorNames` through built-in modal member lookup on `Async` (including aliases normalized via `AsyncSig`) and MUST NOT treat these members as non-modal ad hoc method-call exceptions.

**(T-Async-Map)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ a\ :\ \operatorname{TypeApply}([\texttt{"Async"}],\ [\mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E])\quad \Gamma ;\ R;\ L\ \vdash \ f\ :\ (\mathsf{Out})\ \to \ U \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ a\sim{}>\operatorname{map}(f)\ :\ \operatorname{TypeApply}([\texttt{"Async"}],\ [U,\ \mathsf{In},\ \mathsf{Result},\ E])
\end{array}
$$

**(T-Async-Filter)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ a\ :\ \operatorname{TypeApply}([\texttt{"Async"}],\ [T,\ \operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePrim}(\texttt{"()"}),\ E])\quad \Gamma ;\ R;\ L\ \vdash \ p\ :\ (\operatorname{TypePerm}(\texttt{const},\ T))\ \to \ \operatorname{TypePrim}(\texttt{"bool"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ a\sim{}>\operatorname{filter}(p)\ :\ \operatorname{TypeApply}([\texttt{"Async"}],\ [T,\ \operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePrim}(\texttt{"()"}),\ E])
\end{array}
$$

**(T-Async-Take)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ a\ :\ \operatorname{TypeApply}([\texttt{"Async"}],\ [T,\ \operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePrim}(\texttt{"()"}),\ E])\quad \Gamma ;\ R;\ L\ \vdash \ n\ :\ \operatorname{TypePrim}(\texttt{"usize"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ a\sim{}>\operatorname{take}(n)\ :\ \operatorname{TypeApply}([\texttt{"Async"}],\ [T,\ \operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePrim}(\texttt{"()"}),\ E])
\end{array}
$$

**(T-Async-Fold)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ a\ :\ \operatorname{TypeApply}([\texttt{"Async"}],\ [T,\ \operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePrim}(\texttt{"()"}),\ E])\quad \Gamma ;\ R;\ L\ \vdash \ \mathsf{init}\ :\ A\quad \Gamma ;\ R;\ L\ \vdash \ f\ :\ (A,\ T)\ \to \ A \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ a\sim{}>\operatorname{fold}(\mathsf{init},\ f)\ :\ \operatorname{TypeApply}([\texttt{"Future"}],\ [A,\ E])
\end{array}
$$

**(T-Async-Chain)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ a\ :\ \operatorname{TypeApply}([\texttt{"Future"}],\ [T,\ E])\quad \Gamma ;\ R;\ L\ \vdash \ f\ :\ (T)\ \to \ \operatorname{TypeApply}([\texttt{"Future"}],\ [U,\ E]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ a\sim{}>\operatorname{chain}(f)\ :\ \operatorname{TypeApply}([\texttt{"Future"}],\ [U,\ E])
\end{array}
$$

### 21.3.5 Dynamic Semantics

Async iteration over `loop pat in e { body }` is:

1. Evaluate `e` to `a`.
2. If `a` is `@Suspended { output }`, bind `output` to `pat`, execute `body`, and resume with `()`.
3. If `a` is `@Completed { value }`, terminate the loop.
4. If `a` is `@Failed { error }`, propagate the error from the enclosing async procedure.

Manual stepping advances an async value by inspecting its modal state and invoking `~>resume(input)` on `@Suspended`.

`sync` evaluation is:

1. Evaluate `e` to `a`.
2. While `a` is `@Suspended { output = () }`, set `a := a~>resume(())`.
3. If `a` is `@Completed { value }`, produce `value`.
4. If `a` is `@Failed { error }`, produce the union error value.

Formal `sync` rules:

$$
\mathsf{SyncStep}\ :\ \mathsf{AsyncValue}\ \times \ \mathsf{State}\ \to \ \mathsf{AsyncValue}\ \times \ \mathsf{State}
$$

**(SyncStep-Suspended)**

$$
\begin{array}{l}
\operatorname{ModalState}(a)\ =\ @\mathsf{Suspended}\quad a.\mathsf{output}\ =\ ()\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Resume}(a,\ ()),\ \sigma )\ \Downarrow \ (\operatorname{Val}(a'),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{SyncStep}(a,\ \sigma )\ \Downarrow \ (a',\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Sync-Suspended)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(a),\ \sigma_{1} )\quad \operatorname{ModalState}(a)\ =\ @\mathsf{Suspended}\quad \Gamma \ \vdash \ \operatorname{SyncStep}(a,\ \sigma_{1} )\ \Downarrow \ (a',\ \sigma_{2} ) \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{SyncExpr}(a'),\ \sigma_{2} )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{SyncExpr}(e),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} )
\end{array}
$$

**(EvalSigma-Sync-Completed)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(a),\ \sigma_{1} )\quad \operatorname{ModalState}(a)\ =\ @\mathsf{Completed}\quad a.\mathsf{value}\ =\ v \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{SyncExpr}(e),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Sync-Failed)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(a),\ \sigma_{1} )\quad \operatorname{ModalState}(a)\ =\ @\mathsf{Failed}\quad a.\mathsf{error}\ =\ \mathsf{err} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{SyncExpr}(e),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{err}),\ \sigma_{1} )
\end{array}
$$

`race` return-mode evaluation is:

1. Initiate all async expressions concurrently.
2. When any arm completes or fails, handle that arm.
3. Cancel all remaining arms.
4. Produce the selected handler result or propagated error value.

`race` streaming-mode evaluation is:

1. Initiate all async expressions concurrently.
2. When an arm yields, execute the corresponding handler and emit its value as the next stream output.
3. When an arm completes, remove it from the race.
4. When all arms complete, the stream completes.
5. If any arm fails, propagate the error and cancel remaining arms.

Formal `race` rules:

$$
\begin{array}{l}
\operatorname{SelectReady}(\mathsf{asyncs})\ =\ (\mathsf{index},\ \mathsf{async}_{\mathsf{value}})\ \Leftrightarrow  \\[0.16em]
\ \mathsf{asyncs}\ =\ [a_{1},\ \ldots ,\ a_{n}]\ \land  \\[0.16em]
\ \exists \ i\ \in \ [1..n].\ \operatorname{ModalState}(a_{i})\ =\ @\mathsf{Suspended}\ \land \ \operatorname{IsReady}(a_{i})\ \land  \\[0.16em]
\ (\forall \ j\ <\ i.\ \lnot \operatorname{IsReady}(a_{j})\ \lor \ \operatorname{ModalState}(a_{j})\ \ne \ @\mathsf{Suspended})\ \land  \\[0.16em]
\ \mathsf{index}\ =\ i\ \land  \\[0.16em]
\ \mathsf{async}_{\mathsf{value}}\ =\ a_{i} \\[0.16em]
\operatorname{SelectReadyAny}(\mathsf{asyncs})\ =\ (\mathsf{index},\ \mathsf{async}_{\mathsf{value}})\ \Leftrightarrow  \\[0.16em]
\ \mathsf{asyncs}\ =\ [a_{1},\ \ldots ,\ a_{n}]\ \land  \\[0.16em]
\ \exists \ i\ \in \ [1..n].\ (\operatorname{ModalState}(a_{i})\ =\ @\mathsf{Completed}\ \lor \ \operatorname{ModalState}(a_{i})\ =\ @\mathsf{Failed}\ \lor \ (\operatorname{ModalState}(a_{i})\ =\ @\mathsf{Suspended}\ \land \ \operatorname{IsReady}(a_{i})))\ \land  \\[0.16em]
\ (\forall \ j\ <\ i.\ \operatorname{ModalState}(a_{j})\ =\ @\mathsf{Suspended}\ \land \ \lnot \operatorname{IsReady}(a_{j}))\ \land  \\[0.16em]
\ \mathsf{index}\ =\ i\ \land  \\[0.16em]
\ \mathsf{async}_{\mathsf{value}}\ =\ a_{i} \\[0.16em]
\mathsf{RaceState}\ =\ \{\ \mathsf{active}:\ [\mathsf{AsyncValue}],\ \mathsf{completed}:\ \mathsf{Option}<(\mathsf{Index},\ \mathsf{AsyncValue})>,\ \mathsf{mode}:\ \texttt{return}\ \mid \ \texttt{yield}\ \} \\[0.16em]
\mathsf{InitRace}\ :\ [\mathsf{RaceArm}]\ \times \ \mathsf{State}\ \to \ \mathsf{RaceState}\ \times \ \mathsf{State}
\end{array}
$$

**(InitRace)**

$$
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{arm}_{i}.\mathsf{expr},\ \sigma_{i} )\ \Downarrow \ (\operatorname{Val}(a_{i}),\ \sigma \_\{i+1\})\quad \mathsf{mode}\ =\ \operatorname{RaceMode}(\mathsf{arms}) \\[0.16em]
\mathsf{race}_{\mathsf{state}}\ =\ \{\ \mathsf{active}:\ [a_{1},\ \ldots ,\ a_{n}],\ \mathsf{completed}:\ \bot ,\ \mathsf{mode}:\ \mathsf{mode}\ \} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{InitRace}(\mathsf{arms},\ \sigma_{0} )\ \Downarrow \ (\mathsf{race}_{\mathsf{state}},\ \sigma_{n} )
\end{array}
$$

$$
\mathsf{RaceStepReturn}\ :\ \mathsf{RaceState}\ \times \ [\mathsf{RaceArm}]\ \times \ \mathsf{State}\ \to \ \mathsf{EvalOut}\ \times \ \mathsf{State}
$$

**(RaceStepReturn-Completed)**

$$
\begin{array}{l}
\exists \ i.\ \operatorname{ModalState}(\mathsf{race}_{\mathsf{state}}.\mathsf{active}[i])\ =\ @\mathsf{Completed}\quad a_{i}\ =\ \mathsf{race}_{\mathsf{state}}.\mathsf{active}[i]\quad a_{i}.\mathsf{value}\ =\ v \\[0.16em]
\mathsf{arm}_{i}\ =\ \mathsf{arms}[i]\quad \Gamma \ \vdash \ \operatorname{BindPattern}(\mathsf{arm}_{i}.\mathsf{pat},\ v)\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} \ \vdash \ \operatorname{EvalSigma}(\mathsf{arm}_{i}.\mathsf{handler}.\mathsf{expr},\ \sigma )\ \Downarrow \ (\operatorname{Val}(r),\ \sigma_{1} ) \\[0.16em]
\operatorname{CancelAll}(\mathsf{race}_{\mathsf{state}}.\mathsf{active}\ \setminus \ \{a_{i}\},\ \sigma_{1} )\ \Downarrow \ \sigma_{2}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RaceStepReturn}(\mathsf{race}_{\mathsf{state}},\ \mathsf{arms},\ \sigma )\ \Downarrow \ (\operatorname{Val}(r),\ \sigma_{2} )
\end{array}
$$

**(RaceStepReturn-Failed)**

$$
\begin{array}{l}
\exists \ i.\ \operatorname{ModalState}(\mathsf{race}_{\mathsf{state}}.\mathsf{active}[i])\ =\ @\mathsf{Failed}\quad a_{i}\ =\ \mathsf{race}_{\mathsf{state}}.\mathsf{active}[i]\quad a_{i}.\mathsf{error}\ =\ e \\[0.16em]
\operatorname{CancelAll}(\mathsf{race}_{\mathsf{state}}.\mathsf{active}\ \setminus \ \{a_{i}\},\ \sigma )\ \Downarrow \ \sigma_{1}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RaceStepReturn}(\mathsf{race}_{\mathsf{state}},\ \mathsf{arms},\ \sigma )\ \Downarrow \ (\operatorname{Val}(e),\ \sigma_{1} )
\end{array}
$$

**(RaceStepReturn-Continue)**

$$
\begin{array}{l}
\forall \ i.\ \operatorname{ModalState}(\mathsf{race}_{\mathsf{state}}.\mathsf{active}[i])\ =\ @\mathsf{Suspended} \\[0.16em]
\operatorname{SelectReady}(\mathsf{race}_{\mathsf{state}}.\mathsf{active})\ =\ (j,\ a_{j})\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Resume}(a_{j},\ ()),\ \sigma )\ \Downarrow \ (\operatorname{Val}(a_{j}'),\ \sigma_{1} ) \\[0.16em]
\mathsf{race}_{\mathsf{state}}'\ =\ \mathsf{race}_{\mathsf{state}}[\mathsf{active}[j]\ \mapsto \ a_{j}']\quad \Gamma \ \vdash \ \operatorname{RaceStepReturn}(\mathsf{race}_{\mathsf{state}}',\ \mathsf{arms},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RaceStepReturn}(\mathsf{race}_{\mathsf{state}},\ \mathsf{arms},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Race-Return)**

$$
\begin{array}{l}
\operatorname{RaceMode}(\mathsf{arms})\ =\ \texttt{return}\quad \Gamma \ \vdash \ \operatorname{InitRace}(\mathsf{arms},\ \sigma )\ \Downarrow \ (\mathsf{race}_{\mathsf{state}},\ \sigma_{1} ) \\[0.16em]
\Gamma \ \vdash \ \operatorname{RaceStepReturn}(\mathsf{race}_{\mathsf{state}},\ \mathsf{arms},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{RaceExpr}(\mathsf{arms}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

$$
\mathsf{RaceStepStream}\ :\ \mathsf{RaceState}\ \times \ [\mathsf{RaceArm}]\ \times \ \mathsf{State}\ \to \ \mathsf{EvalOut}\ \times \ \mathsf{State}
$$

**(RaceStepStream-Yield)**

$$
\begin{array}{l}
\exists \ i.\ \operatorname{ModalState}(\mathsf{race}_{\mathsf{state}}.\mathsf{active}[i])\ =\ @\mathsf{Suspended}\quad a_{i}\ =\ \mathsf{race}_{\mathsf{state}}.\mathsf{active}[i]\quad a_{i}.\mathsf{output}\ =\ v \\[0.16em]
\mathsf{arm}_{i}\ =\ \mathsf{arms}[i]\quad \Gamma \ \vdash \ \operatorname{BindPattern}(\mathsf{arm}_{i}.\mathsf{pat},\ v)\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} \ \vdash \ \operatorname{EvalSigma}(\mathsf{arm}_{i}.\mathsf{handler}.\mathsf{expr},\ \sigma )\ \Downarrow \ (\operatorname{Val}(u),\ \sigma_{1} ) \\[0.16em]
\mathsf{stream}_{\mathsf{state}}\ =\ \{\ \mathsf{race}_{\mathsf{state}}:\ \mathsf{race}_{\mathsf{state}},\ \mathsf{pending}_{\mathsf{yield}}:\ (i,\ u)\ \} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RaceStepStream}(\mathsf{race}_{\mathsf{state}},\ \mathsf{arms},\ \sigma )\ \Downarrow \ (\operatorname{Suspend}(\operatorname{AsyncSuspended}(u,\ \mathsf{stream}_{\mathsf{state}})),\ \sigma_{1} )
\end{array}
$$

**(RaceStepStream-AllComplete)**

$$
\begin{array}{l}
\forall \ i.\ \operatorname{ModalState}(\mathsf{race}_{\mathsf{state}}.\mathsf{active}[i])\ =\ @\mathsf{Completed} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RaceStepStream}(\mathsf{race}_{\mathsf{state}},\ \mathsf{arms},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{AsyncCompleted}(())),\ \sigma )
\end{array}
$$

**(RaceStepStream-Failed)**

$$
\begin{array}{l}
\exists \ i.\ \operatorname{ModalState}(\mathsf{race}_{\mathsf{state}}.\mathsf{active}[i])\ =\ @\mathsf{Failed}\quad a_{i}\ =\ \mathsf{race}_{\mathsf{state}}.\mathsf{active}[i]\quad a_{i}.\mathsf{error}\ =\ e \\[0.16em]
\operatorname{CancelAll}(\mathsf{race}_{\mathsf{state}}.\mathsf{active}\ \setminus \ \{a_{i}\},\ \sigma )\ \Downarrow \ \sigma_{1}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RaceStepStream}(\mathsf{race}_{\mathsf{state}},\ \mathsf{arms},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{AsyncFailed}(e)),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Race-Stream)**

$$
\begin{array}{l}
\operatorname{RaceMode}(\mathsf{arms})\ =\ \texttt{yield}\quad \Gamma \ \vdash \ \operatorname{InitRace}(\mathsf{arms},\ \sigma )\ \Downarrow \ (\mathsf{race}_{\mathsf{state}},\ \sigma_{1} ) \\[0.16em]
\Gamma \ \vdash \ \operatorname{RaceStepStream}(\mathsf{race}_{\mathsf{state}},\ \mathsf{arms},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{RaceExpr}(\mathsf{arms}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

$$
\mathsf{CancelAll}\ :\ [\mathsf{AsyncValue}]\ \times \ \mathsf{State}\ \to \ \mathsf{State}
$$

**(CancelAll)**

$$
\begin{array}{l}
\forall \ a\ \in \ \mathsf{asyncs}.\ \operatorname{Cancel}(a)\ \Downarrow \ () \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{CancelAll}(\mathsf{asyncs},\ \sigma )\ \Downarrow \ \sigma 
\end{array}
$$

Streaming-race suspension state is:

$$
\begin{array}{l}
\mathsf{RaceStreamState}\ =\ \{\ \mathsf{race}_{\mathsf{state}}:\ \mathsf{RaceState},\ \mathsf{yielded}_{\mathsf{arm}}:\ \mathsf{Index}\ \} \\[0.16em]
\operatorname{RaceResumeOrder}(\mathsf{state},\ \mathsf{arms})\ =\ [\mathsf{state}.\mathsf{yielded}_{\mathsf{arm}}]\ \mathbin{++} \ [j\ \mid \ 1\ \le \ j\ \le \ \mid \mathsf{arms}\mid \ \land \ j\ \ne \ \mathsf{state}.\mathsf{yielded}_{\mathsf{arm}}\ \land \ \operatorname{ModalState}(\mathsf{state}.\mathsf{race}_{\mathsf{state}}.\mathsf{active}[j])\ \ne \ @\mathsf{Completed}] \\[0.16em]
\operatorname{ResumeRaceArm}(a,\ \sigma )\ \Downarrow \ (a',\ \sigma ')\ \Leftrightarrow \ \operatorname{ModalState}(a)\ =\ @\mathsf{Suspended}\ \land \ \Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Resume}(a,\ ()),\ \sigma )\ \Downarrow \ (\operatorname{Val}(a'),\ \sigma ') \\[0.16em]
\operatorname{ResumeRaceArm}(a,\ \sigma )\ \Downarrow \ (a,\ \sigma )\ \Leftrightarrow \ \operatorname{ModalState}(a)\ =\ @\mathsf{Completed}
\end{array}
$$

**(RaceStepStream-Yield)**

$$
\begin{array}{l}
\exists \ i.\ \operatorname{ModalState}(\mathsf{race}_{\mathsf{state}}.\mathsf{active}[i])\ =\ @\mathsf{Suspended}\quad a_{i}\ =\ \mathsf{race}_{\mathsf{state}}.\mathsf{active}[i]\quad a_{i}.\mathsf{output}\ =\ v \\[0.16em]
\mathsf{arm}_{i}\ =\ \mathsf{arms}[i]\quad \Gamma \ \vdash \ \operatorname{BindPattern}(\mathsf{arm}_{i}.\mathsf{pat},\ v)\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} \ \vdash \ \operatorname{EvalSigma}(\mathsf{arm}_{i}.\mathsf{handler}.\mathsf{expr},\ \sigma )\ \Downarrow \ (\operatorname{Val}(u),\ \sigma_{1} ) \\[0.16em]
\mathsf{stream}_{\mathsf{state}}\ =\ \{\ \mathsf{race}_{\mathsf{state}}:\ \mathsf{race}_{\mathsf{state}},\ \mathsf{yielded}_{\mathsf{arm}}:\ i\ \} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RaceStepStream}(\mathsf{race}_{\mathsf{state}},\ \mathsf{arms},\ \sigma )\ \Downarrow \ (\operatorname{Suspend}(\operatorname{AsyncSuspended}(u,\ \mathsf{stream}_{\mathsf{state}})),\ \sigma_{1} )
\end{array}
$$

**(ResumeRaceState-Step)**

$$
\begin{array}{l}
\mathsf{order}\ =\ [i]\ \mathbin{++} \ \mathsf{rest}\quad a_{i}\ =\ \mathsf{state}.\mathsf{active}[i]\quad \operatorname{ResumeRaceArm}(a_{i},\ \sigma )\ \Downarrow \ (a_{i}',\ \sigma_{1} ) \\[0.16em]
\mathsf{state}'\ =\ \mathsf{state}[\mathsf{active}[i]\ \mapsto \ a_{i}']\quad \Gamma \ \vdash \ \operatorname{ResumeRaceState}(\mathsf{state}',\ \mathsf{rest},\ \sigma_{1} )\ \Downarrow \ (\mathsf{state}'',\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResumeRaceState}(\mathsf{state},\ \mathsf{order},\ \sigma )\ \Downarrow \ (\mathsf{state}'',\ \sigma_{2} )
\end{array}
$$

**(ResumeRaceState-Done)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResumeRaceState}(\mathsf{state},\ [],\ \sigma )\ \Downarrow \ (\mathsf{state},\ \sigma )
\end{array}
$$

**(EvalSigma-Race-Stream-Resume)**

$$
\begin{array}{l}
\mathsf{async}_{\mathsf{state}}\ =\ \operatorname{AsyncSuspended}(\_,\ \mathsf{stream}_{\mathsf{state}})\quad \mathsf{input}\ =\ ()\quad \mathsf{order}\ =\ \operatorname{RaceResumeOrder}(\mathsf{stream}_{\mathsf{state}},\ \mathsf{arms}) \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResumeRaceState}(\mathsf{stream}_{\mathsf{state}}.\mathsf{race}_{\mathsf{state}},\ \mathsf{order},\ \sigma )\ \Downarrow \ (\mathsf{race}_{\mathsf{state}}',\ \sigma_{1} ) \\[0.16em]
\Gamma \ \vdash \ \operatorname{RaceStepStream}(\mathsf{race}_{\mathsf{state}}',\ \mathsf{arms},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Resume}(\mathsf{async}_{\mathsf{state}},\ \mathsf{input}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

On resumption of a streaming `race`, the previously yielded arm MUST resume first. Remaining live arms MUST then resume in arm declaration order. The first resumed arm to yield determines the next stream output. The first resumed arm to fail cancels the remaining live arms and determines the failure result.

`all` evaluation is:

1. Initiate all async expressions concurrently.
2. Wait for all operations to complete.
3. If all succeed, return the result tuple in expression order.
4. If any fails, cancel remaining operations and return the first recorded error value.

Formal `all` rules:

$$
\begin{array}{l}
\mathsf{AllState}\ =\ \{\ \mathsf{active}:\ [\mathsf{AsyncValue}],\ \mathsf{results}:\ [\mathsf{Option}<\mathsf{Value}>],\ \mathsf{failed}:\ \mathsf{Option}<\mathsf{Error}>\ \} \\[0.16em]
\mathsf{InitAll}\ :\ [\mathsf{Expr}]\ \times \ \mathsf{State}\ \to \ \mathsf{AllState}\ \times \ \mathsf{State}
\end{array}
$$

**(InitAll)**

$$
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{EvalSigma}(e_{i},\ \sigma_{i} )\ \Downarrow \ (\operatorname{Val}(a_{i}),\ \sigma \_\{i+1\}) \\[0.16em]
\mathsf{all}_{\mathsf{state}}\ =\ \{\ \mathsf{active}:\ [a_{1},\ \ldots ,\ a_{n}],\ \mathsf{results}:\ [\bot ,\ \ldots ,\ \bot ],\ \mathsf{failed}:\ \bot \ \} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{InitAll}([e_{1},\ \ldots ,\ e_{n}],\ \sigma_{0} )\ \Downarrow \ (\mathsf{all}_{\mathsf{state}},\ \sigma_{n} )
\end{array}
$$

$$
\mathsf{AllStep}\ :\ \mathsf{AllState}\ \times \ \mathsf{State}\ \to \ \mathsf{AllState}\ \times \ \mathsf{State}
$$

**(AllStep-Complete)**

$$
\begin{array}{l}
\exists \ i.\ \operatorname{ModalState}(\mathsf{all}_{\mathsf{state}}.\mathsf{active}[i])\ =\ @\mathsf{Completed}\quad a_{i}\ =\ \mathsf{all}_{\mathsf{state}}.\mathsf{active}[i]\quad a_{i}.\mathsf{value}\ =\ v \\[0.16em]
\mathsf{all}_{\mathsf{state}}'\ =\ \mathsf{all}_{\mathsf{state}}[\mathsf{results}[i]\ \mapsto \ v] \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AllStep}(\mathsf{all}_{\mathsf{state}},\ \sigma )\ \Downarrow \ (\mathsf{all}_{\mathsf{state}}',\ \sigma )
\end{array}
$$

**(AllStep-Failed)**

$$
\begin{array}{l}
\exists \ i.\ \operatorname{ModalState}(\mathsf{all}_{\mathsf{state}}.\mathsf{active}[i])\ =\ @\mathsf{Failed}\quad a_{i}\ =\ \mathsf{all}_{\mathsf{state}}.\mathsf{active}[i]\quad a_{i}.\mathsf{error}\ =\ e\quad \mathsf{all}_{\mathsf{state}}.\mathsf{failed}\ =\ \bot  \\[0.16em]
\mathsf{remaining}\ =\ \{\ a_{j}\ \mid \ j\ \ne \ i\ \land \ \operatorname{ModalState}(a_{j})\ \ne \ @\mathsf{Completed}\ \}\quad \operatorname{CancelAll}(\mathsf{remaining},\ \sigma )\ \Downarrow \ \sigma_{1}  \\[0.16em]
\mathsf{all}_{\mathsf{state}}'\ =\ \mathsf{all}_{\mathsf{state}}[\mathsf{failed}\ \mapsto \ e] \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AllStep}(\mathsf{all}_{\mathsf{state}},\ \sigma )\ \Downarrow \ (\mathsf{all}_{\mathsf{state}}',\ \sigma_{1} )
\end{array}
$$

**(AllStep-Resume)**

$$
\begin{array}{l}
\forall \ i.\ \operatorname{ModalState}(\mathsf{all}_{\mathsf{state}}.\mathsf{active}[i])\ \ne \ @\mathsf{Failed}\quad \exists \ j.\ \mathsf{all}_{\mathsf{state}}.\mathsf{results}[j]\ =\ \bot \ \land \ \operatorname{ModalState}(\mathsf{all}_{\mathsf{state}}.\mathsf{active}[j])\ =\ @\mathsf{Suspended} \\[0.16em]
\operatorname{SelectReady}(\mathsf{all}_{\mathsf{state}}.\mathsf{active})\ =\ (j,\ a_{j})\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Resume}(a_{j},\ ()),\ \sigma )\ \Downarrow \ (\operatorname{Val}(a_{j}'),\ \sigma_{1} ) \\[0.16em]
\mathsf{all}_{\mathsf{state}}'\ =\ \mathsf{all}_{\mathsf{state}}[\mathsf{active}[j]\ \mapsto \ a_{j}'] \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AllStep}(\mathsf{all}_{\mathsf{state}},\ \sigma )\ \Downarrow \ (\mathsf{all}_{\mathsf{state}}',\ \sigma_{1} )
\end{array}
$$

$$
\mathsf{AllLoop}\ :\ \mathsf{AllState}\ \times \ \mathsf{State}\ \to \ \mathsf{EvalOut}\ \times \ \mathsf{State}
$$

**(AllLoop-AllCompleted)**

$$
\begin{array}{l}
\forall \ i.\ \mathsf{all}_{\mathsf{state}}.\mathsf{results}[i]\ \ne \ \bot \quad \mathsf{all}_{\mathsf{state}}.\mathsf{failed}\ =\ \bot \quad \mathsf{tuple}\ =\ (\mathsf{all}_{\mathsf{state}}.\mathsf{results}[1],\ \ldots ,\ \mathsf{all}_{\mathsf{state}}.\mathsf{results}[n]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AllLoop}(\mathsf{all}_{\mathsf{state}},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{tuple}),\ \sigma )
\end{array}
$$

**(AllLoop-Failed)**

$$
\begin{array}{l}
\mathsf{all}_{\mathsf{state}}.\mathsf{failed}\ =\ e\quad e\ \ne \ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AllLoop}(\mathsf{all}_{\mathsf{state}},\ \sigma )\ \Downarrow \ (\operatorname{Val}(e),\ \sigma )
\end{array}
$$

**(AllLoop-Continue)**

$$
\begin{array}{l}
\exists \ i.\ \mathsf{all}_{\mathsf{state}}.\mathsf{results}[i]\ =\ \bot \quad \mathsf{all}_{\mathsf{state}}.\mathsf{failed}\ =\ \bot \quad \Gamma \ \vdash \ \operatorname{AllStep}(\mathsf{all}_{\mathsf{state}},\ \sigma )\ \Downarrow \ (\mathsf{all}_{\mathsf{state}}',\ \sigma_{1} ) \\[0.16em]
\Gamma \ \vdash \ \operatorname{AllLoop}(\mathsf{all}_{\mathsf{state}}',\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AllLoop}(\mathsf{all}_{\mathsf{state}},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-All)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{InitAll}(\mathsf{exprs},\ \sigma )\ \Downarrow \ (\mathsf{all}_{\mathsf{state}},\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{AllLoop}(\mathsf{all}_{\mathsf{state}},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{AllExpr}(\mathsf{exprs}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

`until` evaluation is:

1. If `pred(shared_value)` is true, acquire a Write key for the target path, execute `action(shared_value)`, and complete the future with the result.
2. Otherwise register a waiter record and transition to `@Suspended { output = () }`.
3. On key release, re-evaluate registered waiters and schedule those whose predicates become true.

Async combinators create wrapper async values:

$$
\begin{array}{l}
\mathsf{MappedAsync}\ =\ \langle \mathsf{source},\ f\rangle  \\[0.16em]
\mathsf{FilteredAsync}\ =\ \langle \mathsf{source},\ \mathsf{pred},\ \mathsf{state}\rangle \quad \mathsf{state}\ \in \ \{\mathsf{Pending},\ \mathsf{Done}\} \\[0.16em]
\mathsf{TakeAsync}\ =\ \langle \mathsf{source},\ \mathsf{remaining}\rangle  \\[0.16em]
\mathsf{FoldAsync}\ =\ \langle \mathsf{source},\ \mathsf{acc},\ f\rangle  \\[0.16em]
\mathsf{ChainAsync}\ =\ \langle \mathsf{source},\ f,\ \mathsf{state}\rangle \quad \mathsf{state}\ \in \ \{\mathsf{WaitingSource},\ \operatorname{WaitingChained}(\mathsf{inner})\}
\end{array}
$$

Formal combinator rules:

**(EvalSigma-Map-Create)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(a,\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{src}),\ \sigma ')\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(f,\ \sigma ')\ \Downarrow \ (\operatorname{Val}(\mathsf{fn}),\ \sigma '') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(a\sim{}>\operatorname{map}(f),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{MappedAsync}(\mathsf{src},\ \mathsf{fn})),\ \sigma '')
\end{array}
$$

**(EvalSigma-Map-Resume-Yield)**

$$
\begin{array}{l}
a\ =\ \operatorname{MappedAsync}(\mathsf{src},\ f)\quad \Gamma \ \vdash \ \operatorname{Resume}(\mathsf{src},\ \mathsf{input},\ \sigma )\ \Downarrow \ (@\mathsf{Suspended}\{\mathsf{output}:\ v\},\ \sigma ')\quad \Gamma \ \vdash \ \operatorname{Apply}(f,\ v,\ \sigma ')\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma '') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resume}(a,\ \mathsf{input},\ \sigma )\ \Downarrow \ (@\mathsf{Suspended}\{\mathsf{output}:\ v'\},\ \sigma '')
\end{array}
$$

**(EvalSigma-Map-Resume-Complete)**

$$
\begin{array}{l}
a\ =\ \operatorname{MappedAsync}(\mathsf{src},\ f)\quad \Gamma \ \vdash \ \operatorname{Resume}(\mathsf{src},\ \mathsf{input},\ \sigma )\ \Downarrow \ (@\mathsf{Completed}\{\mathsf{value}:\ v\},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resume}(a,\ \mathsf{input},\ \sigma )\ \Downarrow \ (@\mathsf{Completed}\{\mathsf{value}:\ v\},\ \sigma ')
\end{array}
$$

**(EvalSigma-Map-Resume-Failed)**

$$
\begin{array}{l}
a\ =\ \operatorname{MappedAsync}(\mathsf{src},\ f)\quad \Gamma \ \vdash \ \operatorname{Resume}(\mathsf{src},\ \mathsf{input},\ \sigma )\ \Downarrow \ (@\mathsf{Failed}\{\mathsf{error}:\ e\},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resume}(a,\ \mathsf{input},\ \sigma )\ \Downarrow \ (@\mathsf{Failed}\{\mathsf{error}:\ e\},\ \sigma ')
\end{array}
$$

**(EvalSigma-Filter-Create)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(a,\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{src}),\ \sigma ')\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(p,\ \sigma ')\ \Downarrow \ (\operatorname{Val}(\mathsf{pred}),\ \sigma '') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(a\sim{}>\operatorname{filter}(p),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{FilteredAsync}(\mathsf{src},\ \mathsf{pred},\ \mathsf{Pending})),\ \sigma '')
\end{array}
$$

**(EvalSigma-Filter-Resume-Pass)**

$$
\begin{array}{l}
a\ =\ \operatorname{FilteredAsync}(\mathsf{src},\ \mathsf{pred},\ \mathsf{Pending})\quad \Gamma \ \vdash \ \operatorname{Resume}(\mathsf{src},\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Suspended}\{\mathsf{output}:\ v\},\ \sigma ')\quad \Gamma \ \vdash \ \operatorname{Apply}(\mathsf{pred},\ v,\ \sigma ')\ \Downarrow \ (\operatorname{Val}(\mathsf{true}),\ \sigma '') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resume}(a,\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Suspended}\{\mathsf{output}:\ v\},\ \sigma '')
\end{array}
$$

**(EvalSigma-Filter-Resume-Skip)**

$$
\begin{array}{l}
a\ =\ \operatorname{FilteredAsync}(\mathsf{src},\ \mathsf{pred},\ \mathsf{Pending})\quad \Gamma \ \vdash \ \operatorname{Resume}(\mathsf{src},\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Suspended}\{\mathsf{output}:\ v\},\ \sigma ')\quad \Gamma \ \vdash \ \operatorname{Apply}(\mathsf{pred},\ v,\ \sigma ')\ \Downarrow \ (\operatorname{Val}(\mathsf{false}),\ \sigma '') \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resume}(\operatorname{FilteredAsync}(\mathsf{src},\ \mathsf{pred},\ \mathsf{Pending}),\ (),\ \sigma '')\ \Downarrow \ (\mathsf{out},\ \sigma ''') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resume}(a,\ (),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ''')
\end{array}
$$

**(EvalSigma-Filter-Resume-Complete)**

$$
\begin{array}{l}
a\ =\ \operatorname{FilteredAsync}(\mathsf{src},\ \mathsf{pred},\ \_)\quad \Gamma \ \vdash \ \operatorname{Resume}(\mathsf{src},\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Completed}\{\mathsf{value}:\ v\},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resume}(a,\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Completed}\{\mathsf{value}:\ v\},\ \sigma ')
\end{array}
$$

**(EvalSigma-Take-Create)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(a,\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{src}),\ \sigma ')\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(n,\ \sigma ')\ \Downarrow \ (\operatorname{Val}(\mathsf{count}),\ \sigma '') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(a\sim{}>\operatorname{take}(n),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{TakeAsync}(\mathsf{src},\ \mathsf{count})),\ \sigma '')
\end{array}
$$

**(EvalSigma-Take-Resume-Yield)**

$$
\begin{array}{l}
a\ =\ \operatorname{TakeAsync}(\mathsf{src},\ n)\quad n\ >\ 0\quad \Gamma \ \vdash \ \operatorname{Resume}(\mathsf{src},\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Suspended}\{\mathsf{output}:\ v\},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resume}(a,\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Suspended}\{\mathsf{output}:\ v\},\ \sigma ')\quad \land \ a'\ =\ \operatorname{TakeAsync}(\mathsf{src},\ n\ -\ 1)
\end{array}
$$

**(EvalSigma-Take-Resume-Done)**

$$
\begin{array}{l}
a\ =\ \operatorname{TakeAsync}(\mathsf{src},\ 0) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resume}(a,\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Completed}\{\mathsf{value}:\ ()\},\ \sigma )
\end{array}
$$

**(EvalSigma-Take-Resume-Source-Complete)**

$$
\begin{array}{l}
a\ =\ \operatorname{TakeAsync}(\mathsf{src},\ n)\quad \Gamma \ \vdash \ \operatorname{Resume}(\mathsf{src},\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Completed}\{\mathsf{value}:\ v\},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resume}(a,\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Completed}\{\mathsf{value}:\ ()\},\ \sigma ')
\end{array}
$$

**(EvalSigma-Fold-Create)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(a,\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{src}),\ \sigma ')\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{init},\ \sigma ')\ \Downarrow \ (\operatorname{Val}(\mathsf{acc}),\ \sigma '')\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(f,\ \sigma '')\ \Downarrow \ (\operatorname{Val}(\mathsf{fn}),\ \sigma ''') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(a\sim{}>\operatorname{fold}(\mathsf{init},\ f),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{FoldAsync}(\mathsf{src},\ \mathsf{acc},\ \mathsf{fn})),\ \sigma ''')
\end{array}
$$

**(EvalSigma-Fold-Resume-Accumulate)**

$$
\begin{array}{l}
a\ =\ \operatorname{FoldAsync}(\mathsf{src},\ \mathsf{acc},\ f)\quad \Gamma \ \vdash \ \operatorname{Resume}(\mathsf{src},\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Suspended}\{\mathsf{output}:\ v\},\ \sigma ')\quad \Gamma \ \vdash \ \operatorname{Apply}(f,\ (\mathsf{acc},\ v),\ \sigma ')\ \Downarrow \ (\operatorname{Val}(\mathsf{acc}'),\ \sigma '') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resume}(a,\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Suspended}\{\mathsf{output}:\ ()\},\ \sigma '')\quad \land \ a'\ =\ \operatorname{FoldAsync}(\mathsf{src},\ \mathsf{acc}',\ f)
\end{array}
$$

**(EvalSigma-Fold-Resume-Complete)**

$$
\begin{array}{l}
a\ =\ \operatorname{FoldAsync}(\mathsf{src},\ \mathsf{acc},\ f)\quad \Gamma \ \vdash \ \operatorname{Resume}(\mathsf{src},\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Completed}\{\mathsf{value}:\ \_\},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resume}(a,\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Completed}\{\mathsf{value}:\ \mathsf{acc}\},\ \sigma ')
\end{array}
$$

**(EvalSigma-Fold-Resume-Failed)**

$$
\begin{array}{l}
a\ =\ \operatorname{FoldAsync}(\mathsf{src},\ \mathsf{acc},\ f)\quad \Gamma \ \vdash \ \operatorname{Resume}(\mathsf{src},\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Failed}\{\mathsf{error}:\ e\},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resume}(a,\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Failed}\{\mathsf{error}:\ e\},\ \sigma ')
\end{array}
$$

**(EvalSigma-Chain-Create)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(a,\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{src}),\ \sigma ')\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(f,\ \sigma ')\ \Downarrow \ (\operatorname{Val}(\mathsf{fn}),\ \sigma '') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(a\sim{}>\operatorname{chain}(f),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{ChainAsync}(\mathsf{src},\ \mathsf{fn},\ \mathsf{WaitingSource})),\ \sigma '')
\end{array}
$$

**(EvalSigma-Chain-Resume-Source-Complete)**

$$
\begin{array}{l}
a\ =\ \operatorname{ChainAsync}(\mathsf{src},\ f,\ \mathsf{WaitingSource})\quad \Gamma \ \vdash \ \operatorname{Resume}(\mathsf{src},\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Completed}\{\mathsf{value}:\ v\},\ \sigma ')\quad \Gamma \ \vdash \ \operatorname{Apply}(f,\ v,\ \sigma ')\ \Downarrow \ (\operatorname{Val}(\mathsf{inner}),\ \sigma '') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resume}(a,\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Suspended}\{\mathsf{output}:\ ()\},\ \sigma '')\quad \land \ a'\ =\ \operatorname{ChainAsync}(\mathsf{src},\ f,\ \operatorname{WaitingChained}(\mathsf{inner}))
\end{array}
$$

**(EvalSigma-Chain-Resume-Chained)**

$$
\begin{array}{l}
a\ =\ \operatorname{ChainAsync}(\_,\ \_,\ \operatorname{WaitingChained}(\mathsf{inner}))\quad \Gamma \ \vdash \ \operatorname{Resume}(\mathsf{inner},\ (),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resume}(a,\ (),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')
\end{array}
$$

**(EvalSigma-Chain-Resume-Source-Failed)**

$$
\begin{array}{l}
a\ =\ \operatorname{ChainAsync}(\mathsf{src},\ f,\ \mathsf{WaitingSource})\quad \Gamma \ \vdash \ \operatorname{Resume}(\mathsf{src},\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Failed}\{\mathsf{error}:\ e\},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resume}(a,\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Failed}\{\mathsf{error}:\ e\},\ \sigma ')
\end{array}
$$

### 21.3.6 Lowering

$$
\mathsf{AsyncComposeIR}\ =\ \{\mathsf{SyncLoopIR},\ \mathsf{RaceInitIR},\ \mathsf{RaceSelectIR},\ \mathsf{RaceResumeIR},\ \mathsf{AllInitIR},\ \mathsf{AllJoinIR},\ \mathsf{UntilWaiterIR},\ \mathsf{AsyncMapIR},\ \mathsf{AsyncFilterIR},\ \mathsf{AsyncTakeIR},\ \mathsf{AsyncFoldIR},\ \mathsf{AsyncChainIR}\}
$$

**(Lower-Expr-Sync)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v_{e}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{SyncExpr}(e))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{e},\ \operatorname{SyncLoopIR}(v_{e})),\ \operatorname{SyncResult}(v_{e})\rangle 
\end{array}
$$

`SyncLoopIR(v)` MUST loop on the modal state of `v`, resuming `@Suspended` with input `()`, returning `@Completed.value`, and returning the union error value from `@Failed.error`.

**(Lower-Expr-Race-Return)**

$$
\begin{array}{l}
\operatorname{RaceMode}(\mathsf{arms})\ =\ \texttt{return} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{RaceExpr}(\mathsf{arms}))\ \Downarrow \ \langle \operatorname{RaceInitIR}(\mathsf{arms},\ \texttt{return}),\ \operatorname{RaceSelectIR}(\texttt{return})\rangle 
\end{array}
$$

**(Lower-Expr-Race-Stream)**

$$
\begin{array}{l}
\operatorname{RaceMode}(\mathsf{arms})\ =\ \texttt{yield} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{RaceExpr}(\mathsf{arms}))\ \Downarrow \ \langle \operatorname{RaceInitIR}(\mathsf{arms},\ \texttt{yield}),\ \operatorname{RaceSelectIR}(\texttt{yield})\rangle 
\end{array}
$$

For `RaceInitIR(arms, mode)`, lowering MUST:
1. evaluate all arm expressions left-to-right,
2. store the live arm states in declaration order,
3. for streaming mode, allocate race-stream suspension state containing the live arm vector and the yielded-arm index.

`RaceResumeIR` MUST lower streaming-race resumption according to **(EvalSigma-Race-Stream-Resume)**.

**(Lower-Expr-All)**

$$
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{AllExpr}(\mathsf{exprs}))\ \Downarrow \ \langle \operatorname{AllInitIR}(\mathsf{exprs}),\ \operatorname{AllJoinIR}(\mathsf{exprs})\rangle 
$$

`AllJoinIR` MUST preserve expression order in the result tuple and MUST cancel unfinished operands on the first failure.

Async combinators lower to wrapper async state machines around their source operand:

**(Lower-Async-Map)**

$$
\Gamma \ \vdash \ \operatorname{LowerExpr}(a\sim{}>\operatorname{map}(f))\ \Downarrow \ \langle \operatorname{AsyncMapIR}(a,\ f),\ \operatorname{AsyncMapState}(a,\ f)\rangle 
$$

**(Lower-Async-Filter)**

$$
\Gamma \ \vdash \ \operatorname{LowerExpr}(a\sim{}>\operatorname{filter}(p))\ \Downarrow \ \langle \operatorname{AsyncFilterIR}(a,\ p),\ \operatorname{AsyncFilterState}(a,\ p)\rangle 
$$

**(Lower-Async-Take)**

$$
\Gamma \ \vdash \ \operatorname{LowerExpr}(a\sim{}>\operatorname{take}(n))\ \Downarrow \ \langle \operatorname{AsyncTakeIR}(a,\ n),\ \operatorname{AsyncTakeState}(a,\ n)\rangle 
$$

**(Lower-Async-Fold)**

$$
\Gamma \ \vdash \ \operatorname{LowerExpr}(a\sim{}>\operatorname{fold}(\mathsf{init},\ f))\ \Downarrow \ \langle \operatorname{AsyncFoldIR}(a,\ \mathsf{init},\ f),\ \operatorname{AsyncFoldState}(a,\ \mathsf{init},\ f)\rangle 
$$

**(Lower-Async-Chain)**

$$
\Gamma \ \vdash \ \operatorname{LowerExpr}(a\sim{}>\operatorname{chain}(f))\ \Downarrow \ \langle \operatorname{AsyncChainIR}(a,\ f),\ \operatorname{AsyncChainState}(a,\ f)\rangle 
$$

Each wrapper lowering MUST delegate to the source async via `resume`, store its local wrapper state in the generated async frame, and preserve the dynamic semantics of §21.3.5 exactly.

### 21.3.7 Diagnostics

| Code         | Severity | Detection    | Condition                                   |
| ------------ | -------- | ------------ | ------------------------------------------- |
| `E-CON-0212` | Error    | Compile-time | `yield` inside `sync` expression            |
| `E-CON-0223` | Error    | Compile-time | `yield from` inside `sync` expression       |
| `E-CON-0240` | Error    | Compile-time | Iteration over async with `In ≠ ()`         |
| `E-CON-0250` | Error    | Compile-time | `sync` inside async-returning procedure     |
| `E-CON-0251` | Error    | Compile-time | `sync` operand has `Out ≠ ()`               |
| `E-CON-0252` | Error    | Compile-time | `sync` operand has `In ≠ ()`                |
| `E-CON-0260` | Error    | Compile-time | `race` with fewer than 2 arms               |
| `E-CON-0261` | Error    | Compile-time | `race` arms have incompatible types         |
| `E-CON-0262` | Error    | Compile-time | Non-streaming `race` operand has `Out ≠ ()` |
| `E-CON-0263` | Error    | Compile-time | Mixed yield/non-yield handlers in race      |
| `E-CON-0270` | Error    | Compile-time | `all` operand has `Out ≠ ()`                |
| `E-CON-0271` | Error    | Compile-time | `all` operand has `In ≠ ()`                 |
