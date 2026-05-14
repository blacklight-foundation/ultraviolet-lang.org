---
title: "21.2 Suspension Forms"
description: "21.2 Suspension Forms from 21. Asynchronous Operations of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "asynchronous-operations"
specSection: "212-suspension-forms"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/asynchronous-operations/">21. Asynchronous Operations</a>
  <span>Asynchronous Operations</span>
</div>

## 21.2 Suspension Forms

### 21.2.1 Syntax

```text
wait_expr       ::= "wait" expression
yield_expr      ::= "yield" "release"? expression
yield_from_expr ::= "yield" "release"? "from" expression
```

### 21.2.2 Parsing

`wait`, `yield`, and `yield from` are primary expressions.

`wait` is parsed by:

**(Parse-Wait-Expr)**

$$
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \operatorname{Lexeme}(\operatorname{Tok}(P))\ =\ \texttt{wait}\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{handle}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (P_{1},\ \operatorname{WaitExpr}(\mathsf{handle}))
\end{array}
$$

`yield from` is parsed by:

**(Parse-Yield-From-Expr)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{yield})\quad P_{1}\ =\ \operatorname{Advance}(P) \\[0.16em]
(\operatorname{IsIdent}(\operatorname{Tok}(P_{1}))\ \land \ \operatorname{Lexeme}(\operatorname{Tok}(P_{1}))\ =\ \texttt{release}\ \Rightarrow \ \mathsf{release}_{\mathsf{opt}}\ =\ \mathsf{Release}\ \land \ P_{2}\ =\ \operatorname{Advance}(P_{1})) \\[0.16em]
(\lnot (\operatorname{IsIdent}(\operatorname{Tok}(P_{1}))\ \land \ \operatorname{Lexeme}(\operatorname{Tok}(P_{1}))\ =\ \texttt{release})\ \Rightarrow \ \mathsf{release}_{\mathsf{opt}}\ =\ \bot \ \land \ P_{2}\ =\ P_{1}) \\[0.16em]
\operatorname{IsKw}(\operatorname{Tok}(P_{2}),\ \texttt{from})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(P_{2}))\ \Downarrow \ (P_{3},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (P_{3},\ \operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ e))
\end{array}
$$

`yield` is parsed by:

**(Parse-Yield-Expr)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{yield})\quad P_{1}\ =\ \operatorname{Advance}(P) \\[0.16em]
(\operatorname{IsIdent}(\operatorname{Tok}(P_{1}))\ \land \ \operatorname{Lexeme}(\operatorname{Tok}(P_{1}))\ =\ \texttt{release}\ \Rightarrow \ \mathsf{release}_{\mathsf{opt}}\ =\ \mathsf{Release}\ \land \ P_{2}\ =\ \operatorname{Advance}(P_{1})) \\[0.16em]
(\lnot (\operatorname{IsIdent}(\operatorname{Tok}(P_{1}))\ \land \ \operatorname{Lexeme}(\operatorname{Tok}(P_{1}))\ =\ \texttt{release})\ \Rightarrow \ \mathsf{release}_{\mathsf{opt}}\ =\ \bot \ \land \ P_{2}\ =\ P_{1}) \\[0.16em]
\lnot \ \operatorname{IsKw}(\operatorname{Tok}(P_{2}),\ \texttt{from})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(P_{2})\ \Downarrow \ (P_{3},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (P_{3},\ \operatorname{YieldExpr}(\mathsf{release}_{\mathsf{opt}},\ e))
\end{array}
$$

### 21.2.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{YieldReleaseOpt}\ \in \ \{\bot \}\ \cup \ \{\mathsf{Release}\} \\[0.16em]
\mathsf{Expr}\ \mathsf{includes}: \\[0.16em]
\ \operatorname{WaitExpr}(\mathsf{handle}) \\[0.16em]
\ \operatorname{YieldExpr}(\mathsf{release}_{\mathsf{opt}},\ \mathsf{expr}) \\[0.16em]
\ \operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ \mathsf{expr})
\end{array}
$$

Name resolution preserves these forms:

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{WaitExpr}(\mathsf{handle}))\ \Downarrow \ \operatorname{WaitExpr}(\mathsf{handle}') \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{YieldExpr}(\mathsf{release}_{\mathsf{opt}},\ e))\ \Downarrow \ \operatorname{YieldExpr}(\mathsf{release}_{\mathsf{opt}},\ e') \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ e))\ \Downarrow \ \operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ e')
\end{array}
$$

Evaluation order is:

$$
\begin{array}{l}
\operatorname{Children_LTR}(\operatorname{WaitExpr}(\mathsf{handle}))\ =\ [\mathsf{handle}] \\[0.16em]
\operatorname{Children_LTR}(\operatorname{YieldExpr}(\mathsf{release}_{\mathsf{opt}},\ e))\ =\ [e] \\[0.16em]
\operatorname{Children_LTR}(\operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ e))\ =\ [e]
\end{array}
$$

### 21.2.4 Static Semantics

`wait` typing is:

**(T-Wait)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ h\ :\ \operatorname{TypeApply}([\texttt{"Spawned"}],\ [T]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \texttt{wait}\ h\ :\ T
\end{array}
$$

**(T-Wait-Future)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ h\ :\ \operatorname{TypeApply}([\texttt{"Tracked"}],\ [T,\ E]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \texttt{wait}\ h\ :\ \operatorname{TypeUnion}([T,\ E])
\end{array}
$$

**(Wait-Handle-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ h\ :\ T_{h}\quad \operatorname{StripPerm}(T_{h})\ \notin \ \{\operatorname{TypeApply}([\texttt{"Spawned"}],\ [\_]),\ \operatorname{TypeApply}([\texttt{"Tracked"}],\ [\_,\ \_])\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \texttt{wait}\ h\ \Uparrow 
\end{array}
$$

`yield` typing is:

**(T-Yield)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle \quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ T\quad \Gamma \ \vdash \ T\ \mathrel{<:} \ \mathsf{Out} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{YieldExpr}(\mathsf{release}_{\mathsf{opt}},\ e)\ :\ \mathsf{In}
\end{array}
$$

**(Yield-NotAsync-Err)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{YieldExpr}(\mathsf{release}_{\mathsf{opt}},\ e)\ \Uparrow 
\end{array}
$$

**(Yield-Out-Err)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle \quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ T\quad \lnot (\Gamma \ \vdash \ T\ \mathrel{<:} \ \mathsf{Out}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{YieldExpr}(\mathsf{release}_{\mathsf{opt}},\ e)\ \Uparrow 
\end{array}
$$

`yield from` typing is:

**(T-Yield-From)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E_{1}\rangle \quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ T_{e}\quad \operatorname{AsyncSig}(T_{e})\ =\ \langle \mathsf{Out}_{e},\ \mathsf{In}_{e},\ \mathsf{Result}_{e},\ E_{2}\rangle \quad \Gamma \ \vdash \ \mathsf{Out}_{e}\ \equiv \ \mathsf{Out}\quad \Gamma \ \vdash \ \mathsf{In}_{e}\ \equiv \ \mathsf{In}\quad \Gamma \ \vdash \ E_{2}\ \mathrel{<:} \ E_{1} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ e)\ :\ \mathsf{Result}_{e}
\end{array}
$$

**(YieldFrom-NotAsync-Err)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ e)\ \Uparrow 
\end{array}
$$

**(YieldFrom-Out-Err)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E_{1}\rangle \quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ T_{e} \\[0.16em]
(\operatorname{AsyncSig}(T_{e})\ =\ \bot \ \lor \ (\operatorname{AsyncSig}(T_{e})\ =\ \langle \mathsf{Out}_{e},\ \mathsf{In}_{e},\ \mathsf{Result}_{e},\ E_{2}\rangle \ \land \ \lnot (\Gamma \ \vdash \ \mathsf{Out}_{e}\ \equiv \ \mathsf{Out}))) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ e)\ \Uparrow 
\end{array}
$$

**(YieldFrom-In-Err)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E_{1}\rangle \quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ T_{e}\quad \operatorname{AsyncSig}(T_{e})\ =\ \langle \mathsf{Out}_{e},\ \mathsf{In}_{e},\ \mathsf{Result}_{e},\ E_{2}\rangle \quad \Gamma \ \vdash \ \mathsf{Out}_{e}\ \equiv \ \mathsf{Out}\quad \lnot (\Gamma \ \vdash \ \mathsf{In}_{e}\ \equiv \ \mathsf{In}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ e)\ \Uparrow 
\end{array}
$$

**(YieldFrom-ErrType-Err)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E_{1}\rangle \quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ T_{e}\quad \operatorname{AsyncSig}(T_{e})\ =\ \langle \mathsf{Out}_{e},\ \mathsf{In}_{e},\ \mathsf{Result}_{e},\ E_{2}\rangle \quad \Gamma \ \vdash \ \mathsf{Out}_{e}\ \equiv \ \mathsf{Out}\quad \Gamma \ \vdash \ \mathsf{In}_{e}\ \equiv \ \mathsf{In}\quad \lnot (\Gamma \ \vdash \ E_{2}\ \mathrel{<:} \ E_{1}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ e)\ \Uparrow 
\end{array}
$$

Key restrictions for `wait`, `yield`, and `yield from` are defined in §21.5.4.

### 21.2.5 Dynamic Semantics

`wait` retrieves results from `Spawned<T>` and `Tracked<T, E>` handles.

`wait` evaluation is:

1. Evaluate `h`.
2. If the handle is ready, return its settled value.
3. If the handle is pending, block the current task until the handle settles.
4. If a `Spawned<T>` handle settles by panic, that failure is consumed by the enclosing `parallel` panic propagation defined by §20.7.5.

Formal `wait` rules:

$$
\begin{array}{l}
\operatorname{SpawnHandleState}(\operatorname{SpawnedVal}(@\mathsf{Ready}\ \{\ \mathsf{value}\ \},\ \_))\ =\ \operatorname{Ready}(\mathsf{value}) \\[0.16em]
\operatorname{SpawnHandleState}(\operatorname{SpawnedVal}(@\mathsf{Pending},\ \_))\ =\ \mathsf{Pending} \\[0.16em]
\operatorname{TrackedHandleState}(\operatorname{TrackedVal}(@\mathsf{Ready}\ \{\ \mathsf{value}\ \},\ \_))\ =\ \operatorname{Ready}(\mathsf{value}) \\[0.16em]
\operatorname{TrackedHandleState}(\operatorname{TrackedVal}(@\mathsf{Pending},\ \_))\ =\ \mathsf{Pending} \\[0.16em]
\operatorname{BlockUntilSettledSpawned}(\mathsf{handle},\ \sigma )\ \Downarrow \ (\mathsf{handle}',\ \sigma ')\ \Leftrightarrow  \\[0.16em]
\ \sigma '\ \mathsf{extends}\ \sigma \ \mathsf{by}\ \mathsf{abstract}\ \mathsf{scheduler}\ \mathsf{progress}\ \mathsf{until}\ \operatorname{SpawnHandleState}(\mathsf{handle}')\ \in \ \{\operatorname{Ready}(\_),\ \operatorname{Failed}(\_)\} \\[0.16em]
\operatorname{BlockUntilSettledTracked}(\mathsf{handle},\ \sigma )\ \Downarrow \ (\mathsf{handle}',\ \sigma ')\ \Leftrightarrow  \\[0.16em]
\ \sigma '\ \mathsf{extends}\ \sigma \ \mathsf{by}\ \mathsf{abstract}\ \mathsf{scheduler}\ \mathsf{progress}\ \mathsf{until}\ \operatorname{TrackedHandleState}(\mathsf{handle}')\ =\ \operatorname{Ready}(\_)
\end{array}
$$

**(EvalSigma-Wait-Spawned-Ready)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(h,\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{handle}),\ \sigma_{1} )\quad \operatorname{SpawnHandleState}(\mathsf{handle})\ =\ \operatorname{Ready}(v) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{WaitExpr}(h),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Wait-Spawned-Pending)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(h,\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{handle}),\ \sigma_{1} )\quad \operatorname{SpawnHandleState}(\mathsf{handle})\ =\ \mathsf{Pending} \\[0.16em]
\operatorname{BlockUntilSettledSpawned}(\mathsf{handle},\ \sigma_{1} )\ \Downarrow \ (\mathsf{handle}',\ \sigma_{2} )\quad \operatorname{SpawnHandleState}(\mathsf{handle}')\ =\ \operatorname{Ready}(v) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{WaitExpr}(h),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{2} )
\end{array}
$$

Failed `Spawned<T>` settlement is not independently observed by `wait`; it is consumed by the enclosing `AwaitSpawned(...)` / §20.7.5 parallel panic propagation.

**(EvalSigma-Wait-Tracked-Ready)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(h,\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{handle}),\ \sigma_{1} )\quad \operatorname{TrackedHandleState}(\mathsf{handle})\ =\ \operatorname{Ready}(v) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{WaitExpr}(h),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Wait-Tracked-Pending)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(h,\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{handle}),\ \sigma_{1} )\quad \operatorname{TrackedHandleState}(\mathsf{handle})\ =\ \mathsf{Pending} \\[0.16em]
\operatorname{BlockUntilSettledTracked}(\mathsf{handle},\ \sigma_{1} )\ \Downarrow \ (\mathsf{handle}',\ \sigma_{2} )\quad \operatorname{TrackedHandleState}(\mathsf{handle}')\ =\ \operatorname{Ready}(v) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{WaitExpr}(h),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Wait-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(h,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{WaitExpr}(h),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

`yield` suspends the current async computation:

1. Evaluate `e` to `v`.
2. If `release_opt = Release`, release all held keys and record the key set.
3. Transition to `Async@Suspended { output = v }`.
4. On resumption with input `i`, reacquire any recorded keys in canonical order under Chapter 19, bind `i` as the value of the suspended `yield` expression, and continue.

Resumption helpers are:

$$
\begin{array}{l}
\mathsf{ResumptionPoint}\ =\ \langle \mathsf{scope}_{\mathsf{stack}},\ \mathsf{region}_{\mathsf{stack}},\ \mathsf{continuation}\rangle  \\[0.16em]
\operatorname{ReleaseKeys}(\sigma ,\ \mathsf{keys})\ \Downarrow \ \sigma '\ \Leftrightarrow  \\[0.16em]
\ \mathsf{rev}\ =\ \operatorname{CanonicalOrder}(\mathsf{keys})\ \land  \\[0.16em]
\ \forall \ k\ \in \ \operatorname{Reverse}(\mathsf{rev}).\ \operatorname{ReleaseLock}(\sigma ,\ k)\ \land  \\[0.16em]
\ \sigma '\ =\ \sigma [\mathsf{held}_{\mathsf{keys}}\ :=\ \sigma .\mathsf{held}_{\mathsf{keys}}\ \setminus \ \mathsf{keys}] \\[0.16em]
\operatorname{ReacquireKeys}(\sigma ,\ \mathsf{keys})\ \Downarrow \ \sigma '\ \Leftrightarrow  \\[0.16em]
\ \mathsf{sorted}\ =\ \operatorname{CanonicalOrder}(\mathsf{keys})\ \land  \\[0.16em]
\ \forall \ k\ \in \ \mathsf{sorted}.\ \operatorname{AcquireLock}(\sigma ,\ k,\ \operatorname{ModeOf}(k))\ \land  \\[0.16em]
\ \sigma '\ =\ \sigma [\mathsf{held}_{\mathsf{keys}}\ :=\ \sigma .\mathsf{held}_{\mathsf{keys}}\ \cup \ \mathsf{keys}] \\[0.16em]
\operatorname{RestoreResumptionPoint}(\mathsf{rp})\ \Downarrow \ \sigma \ \Leftrightarrow  \\[0.16em]
\ \mathsf{rp}\ =\ \langle \mathsf{scope}_{\mathsf{stack}},\ \mathsf{region}_{\mathsf{stack}},\ \mathsf{continuation}\rangle \ \land  \\[0.16em]
\ \sigma .\mathsf{scope}_{\mathsf{stack}}\ =\ \mathsf{scope}_{\mathsf{stack}}\ \land  \\[0.16em]
\ \sigma .\mathsf{region}_{\mathsf{stack}}\ =\ \mathsf{region}_{\mathsf{stack}}\ \land  \\[0.16em]
\ \sigma .\mathsf{continuation}\ =\ \mathsf{continuation} \\[0.16em]
\Gamma_{\mathsf{keys}} (\sigma )\ =\ \sigma .\mathsf{held}_{\mathsf{keys}}
\end{array}
$$

Formal `yield` rules:

**(EvalSigma-Yield)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad \mathsf{release}_{\mathsf{opt}}\ =\ \bot \quad \Gamma_{\mathsf{keys}} (\sigma_{1} )\ =\ \emptyset  \\[0.16em]
\mathsf{async}_{\mathsf{state}}\ =\ \operatorname{AsyncSuspended}(v,\ \sigma_{1} .\mathsf{resumption}_{\mathsf{point}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{YieldExpr}(\mathsf{release}_{\mathsf{opt}},\ e),\ \sigma )\ \Downarrow \ (\operatorname{Suspend}(\mathsf{async}_{\mathsf{state}}),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Yield-Release)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad \mathsf{release}_{\mathsf{opt}}\ =\ \mathsf{Release}\quad \mathsf{held}\ =\ \Gamma_{\mathsf{keys}} (\sigma_{1} )\quad \operatorname{ReleaseKeys}(\sigma_{1} ,\ \mathsf{held})\ \Downarrow \ \sigma_{2}  \\[0.16em]
\mathsf{async}_{\mathsf{state}}\ =\ \operatorname{AsyncSuspended}(v,\ \sigma_{2} .\mathsf{resumption}_{\mathsf{point}},\ \mathsf{held}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{YieldExpr}(\mathsf{release}_{\mathsf{opt}},\ e),\ \sigma )\ \Downarrow \ (\operatorname{Suspend}(\mathsf{async}_{\mathsf{state}}),\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Yield-Resume)**

$$
\begin{array}{l}
\mathsf{async}_{\mathsf{state}}\ =\ \operatorname{AsyncSuspended}(\_,\ \mathsf{rp},\ \mathsf{held}_{\mathsf{opt}})\quad \mathsf{input}\ =\ i\quad \operatorname{RestoreResumptionPoint}(\mathsf{rp})\ \Downarrow \ \sigma_{0}  \\[0.16em]
\sigma_{1} \ =\ (\mathsf{held}_{\mathsf{opt}}\ \ne \ \bot \ \land \ \operatorname{ReacquireKeys}(\sigma_{0} ,\ \mathsf{held}_{\mathsf{opt}})\ \Downarrow \ \sigma_{1} '\ \to \ \sigma_{1} '\ \mid \ \sigma_{0} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Resume}(\mathsf{async}_{\mathsf{state}},\ i),\ \sigma )\ \Downarrow \ (\operatorname{Val}(i),\ \sigma_{1} )
\end{array}
$$

`yield from` delegates suspension and completion to another async value:

1. Evaluate the source async value.
2. If it is suspended, re-emit its output through the enclosing async, preserving `release_opt`.
3. If it is completed, produce the completed value.
4. If it is failed, propagate the failure.

Formal `yield from` rules:

**(EvalSigma-YieldFrom-Suspended)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{source},\ \sigma )\ \Downarrow \ (\operatorname{Val}(s),\ \sigma_{1} )\quad \operatorname{ModalState}(s)\ =\ @\mathsf{Suspended}\quad s.\mathsf{output}\ =\ v \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{YieldExpr}(\mathsf{release}_{\mathsf{opt}},\ v),\ \sigma_{1} )\ \Downarrow \ (\operatorname{Suspend}(\mathsf{outer}_{\mathsf{state}}),\ \sigma_{2} ) \\[0.16em]
\mathsf{outer}_{\mathsf{state}}'\ =\ \mathsf{outer}_{\mathsf{state}}[\mathsf{inner}_{\mathsf{async}}\ \mapsto \ s] \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ \mathsf{source}),\ \sigma )\ \Downarrow \ (\operatorname{Suspend}(\mathsf{outer}_{\mathsf{state}}'),\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-YieldFrom-Completed)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{source},\ \sigma )\ \Downarrow \ (\operatorname{Val}(s),\ \sigma_{1} )\quad \operatorname{ModalState}(s)\ =\ @\mathsf{Completed}\quad s.\mathsf{value}\ =\ v \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ \mathsf{source}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-YieldFrom-Failed)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{source},\ \sigma )\ \Downarrow \ (\operatorname{Val}(s),\ \sigma_{1} )\quad \operatorname{ModalState}(s)\ =\ @\mathsf{Failed}\quad s.\mathsf{error}\ =\ e \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ \mathsf{source}),\ \sigma )\ \Downarrow \ (\operatorname{Propagate}(e),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-YieldFrom-Resume)**

$$
\begin{array}{l}
\mathsf{outer}_{\mathsf{state}}.\mathsf{inner}_{\mathsf{async}}\ =\ s\quad \mathsf{input}\ =\ i\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Resume}(s,\ i),\ \sigma )\ \Downarrow \ (\operatorname{Val}(s'),\ \sigma_{1} ) \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalYieldFromContinue}(\mathsf{release}_{\mathsf{opt}},\ s',\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Resume}(\mathsf{outer}_{\mathsf{state}},\ i),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

$$
\mathsf{EvalYieldFromContinue}\ :\ \mathsf{ReleaseOpt}\ \times \ \mathsf{AsyncValue}\ \times \ \mathsf{State}\ \to \ \mathsf{EvalOut}\ \times \ \mathsf{State}
$$

**(EvalYieldFromContinue-Suspended)**

$$
\begin{array}{l}
\operatorname{ModalState}(s)\ =\ @\mathsf{Suspended}\quad s.\mathsf{output}\ =\ v \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{YieldExpr}(\mathsf{release}_{\mathsf{opt}},\ v),\ \sigma )\ \Downarrow \ (\operatorname{Suspend}(\mathsf{outer}_{\mathsf{state}}),\ \sigma_{1} ) \\[0.16em]
\mathsf{outer}_{\mathsf{state}}'\ =\ \mathsf{outer}_{\mathsf{state}}[\mathsf{inner}_{\mathsf{async}}\ \mapsto \ s] \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalYieldFromContinue}(\mathsf{release}_{\mathsf{opt}},\ s,\ \sigma )\ \Downarrow \ (\operatorname{Suspend}(\mathsf{outer}_{\mathsf{state}}'),\ \sigma_{1} )
\end{array}
$$

**(EvalYieldFromContinue-Completed)**

$$
\begin{array}{l}
\operatorname{ModalState}(s)\ =\ @\mathsf{Completed}\quad s.\mathsf{value}\ =\ v \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalYieldFromContinue}(\mathsf{release}_{\mathsf{opt}},\ s,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma )
\end{array}
$$

**(EvalYieldFromContinue-Failed)**

$$
\begin{array}{l}
\operatorname{ModalState}(s)\ =\ @\mathsf{Failed}\quad s.\mathsf{error}\ =\ e \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalYieldFromContinue}(\mathsf{release}_{\mathsf{opt}},\ s,\ \sigma )\ \Downarrow \ (\operatorname{Propagate}(e),\ \sigma )
\end{array}
$$

### 21.2.6 Lowering

$$
\mathsf{SuspensionIR}\ =\ \{\mathsf{WaitIR},\ \mathsf{YieldIR},\ \mathsf{YieldFromEnterIR},\ \mathsf{YieldFromResumeIR},\ \mathsf{SnapshotHeldKeysIR},\ \mathsf{ReleaseHeldKeysIR},\ \mathsf{ReacquireHeldKeysIR}\}
$$

$$
\begin{array}{l}
\operatorname{CurrentAsyncFrame}(\Gamma )\ =\ f \\[0.16em]
\operatorname{CurrentGenPoint}(\Gamma )\ =\ g \\[0.16em]
\operatorname{ResumeLabel}(\Gamma ,\ g)\ =\ L \\[0.16em]
\operatorname{WaitResult}(v_{h})\ =\ v_{r}\quad \mathsf{where}\ v_{r}\ \mathsf{is}\ \mathsf{the}\ \mathsf{result}\ \mathsf{value}\ \mathsf{produced}\ \mathsf{by}\ \operatorname{WaitIR}(v_{h}) \\[0.16em]
\operatorname{ResumeInput}(f,\ g)\ =\ v_{i}\ \mathsf{where}\ v_{i}\ \mathsf{is}\ \mathsf{the}\ \mathsf{resume}-\mathsf{input}\ \mathsf{value}\ \mathsf{bound}\ \mathsf{at}\ \operatorname{ResumeLabel}(\Gamma ,\ g)
\end{array}
$$

**(Lower-Wait-Spawned)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(h)\ \Downarrow \ \langle \mathsf{IR}_{h},\ v_{h}\rangle \quad \operatorname{StripPerm}(\operatorname{ExprType}(h))\ =\ \operatorname{TypeApply}([\texttt{"Spawned"}],\ [T]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{WaitExpr}(h))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{h},\ \operatorname{WaitIR}(v_{h})),\ \operatorname{WaitResult}(v_{h})\rangle 
\end{array}
$$

**(Lower-Wait-Tracked)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(h)\ \Downarrow \ \langle \mathsf{IR}_{h},\ v_{h}\rangle \quad \operatorname{StripPerm}(\operatorname{ExprType}(h))\ =\ \operatorname{TypeApply}([\texttt{"Tracked"}],\ [T,\ E]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{WaitExpr}(h))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{h},\ \operatorname{WaitIR}(v_{h})),\ \operatorname{WaitResult}(v_{h})\rangle 
\end{array}
$$

**(Lower-Yield)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle \quad \operatorname{CurrentAsyncFrame}(\Gamma )\ =\ f\quad \operatorname{CurrentGenPoint}(\Gamma )\ =\ g \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{YieldExpr}(\bot ,\ e))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{e},\ \operatorname{YieldIR}(f,\ g,\ v)),\ \operatorname{ResumeInput}(f,\ g)\rangle 
\end{array}
$$

**(Lower-Yield-Release)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle \quad \operatorname{CurrentAsyncFrame}(\Gamma )\ =\ f\quad \operatorname{CurrentGenPoint}(\Gamma )\ =\ g\quad \operatorname{ResumeLabel}(\Gamma ,\ g)\ =\ L \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{YieldExpr}(\mathsf{Release},\ e))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{e},\ \operatorname{SeqIR}(\operatorname{SnapshotHeldKeysIR}(f),\ \operatorname{SeqIR}(\operatorname{ReleaseHeldKeysIR}(f),\ \operatorname{YieldIR}(f,\ g,\ v)))),\ \operatorname{ResumeInput}(f,\ g)\rangle 
\end{array}
$$

For **(Lower-Yield-Release)**, the resumption target `L` MUST begin by executing `ReacquireHeldKeysIR(f)` in canonical key order before control reaches the suspended continuation.

**(Lower-YieldFrom)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(\mathsf{source})\ \Downarrow \ \langle \mathsf{IR}_{s},\ v_{s}\rangle \quad \operatorname{CurrentAsyncFrame}(\Gamma )\ =\ f\quad \operatorname{CurrentGenPoint}(\Gamma )\ =\ g \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ \mathsf{source}))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{s},\ \operatorname{YieldFromEnterIR}(f,\ g,\ \mathsf{release}_{\mathsf{opt}},\ v_{s})),\ \operatorname{YieldFromResumeIR}(f,\ g)\rangle 
\end{array}
$$

`YieldFromEnterIR` MUST lower delegation as a loop over the inner async state:
1. `@Suspended { output = v }` re-enters lowering through the `yield` path using the same `release_opt`,
2. `@Completed { value = v }` returns `v`,
3. `@Failed { error = e }` lowers as async error propagation.

### 21.2.7 Diagnostics

| Code         | Severity | Detection    | Condition                                      |
| ------------ | -------- | ------------ | ---------------------------------------------- |
| `E-CON-0132` | Error    | Compile-time | `wait` operand is not Spawned or Tracked       |
| `E-CON-0210` | Error    | Compile-time | `yield` outside async-returning procedure      |
| `E-CON-0211` | Error    | Compile-time | `yield` operand type does not match `Out`      |
| `E-CON-0220` | Error    | Compile-time | `yield from` outside async-returning procedure |
| `E-CON-0221` | Error    | Compile-time | Incompatible `Out` parameter in `yield from`   |
| `E-CON-0222` | Error    | Compile-time | Incompatible `In` parameter in `yield from`    |
| `E-CON-0225` | Error    | Compile-time | Error type not compatible in `yield from`      |
