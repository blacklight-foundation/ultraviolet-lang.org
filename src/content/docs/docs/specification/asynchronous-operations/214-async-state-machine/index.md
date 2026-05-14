---
title: "21.4 Async State Machine"
description: "21.4 Async State Machine from 21. Asynchronous Operations of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "asynchronous-operations"
specSection: "214-async-state-machine"
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

## 21.4 Async State Machine

### 21.4.1 Syntax

This section introduces no additional surface syntax beyond ordinary procedure declarations, calls, and `resume` method calls on `Async@Suspended`.

An async procedure is any procedure whose declared return type `R` satisfies `AsyncSig(R) ≠ ⊥`.

### 21.4.2 Parsing

This section introduces no additional parser productions beyond ordinary procedure, call, and method-call parsing.

### 21.4.3 AST Representation / Form

Async-state-machine analysis uses the following helper forms:

$$
\begin{array}{l}
\operatorname{SuspendExpr}(e)\ \Leftrightarrow \ e\ =\ \operatorname{YieldExpr}(\_,\ \_)\ \lor \ e\ =\ \operatorname{YieldFromExpr}(\_,\ \_) \\[0.16em]
\operatorname{AsyncCreateExpr}(\operatorname{Call}(\_,\ \_))\ \Leftrightarrow \ \operatorname{AsyncSig}(\operatorname{ExprType}(\operatorname{Call}(\_,\ \_)))\ \ne \ \bot  \\[0.16em]
\operatorname{AsyncCreateExpr}(\operatorname{MethodCall}(\_,\ \_,\ \_))\ \Leftrightarrow \ \operatorname{AsyncSig}(\operatorname{ExprType}(\operatorname{MethodCall}(\_,\ \_,\ \_)))\ \ne \ \bot  \\[0.16em]
\operatorname{AsyncCreateExpr}(\operatorname{RaceExpr}(\_))\ \Leftrightarrow \ \operatorname{AsyncSig}(\operatorname{ExprType}(\operatorname{RaceExpr}(\_)))\ \ne \ \bot  \\[0.16em]
\operatorname{AsyncCreateExpr}(\_)\ \Leftrightarrow \ \mathsf{false} \\[0.16em]
\operatorname{AsyncCaptureArgs}(\operatorname{Call}(\_,\ \mathsf{args}))\ =\ [e\ \mid \ \langle \_,\ e,\ \_\rangle \ \in \ \mathsf{args}] \\[0.16em]
\operatorname{AsyncCaptureArgs}(\operatorname{MethodCall}(\mathsf{base},\ \_,\ \mathsf{args}))\ =\ [\mathsf{base}]\ \mathbin{++} \ [e\ \mid \ \langle \_,\ e,\ \_\rangle \ \in \ \mathsf{args}] \\[0.16em]
\operatorname{AsyncCaptureArgs}(\operatorname{RaceExpr}(\mathsf{arms}))\ =\ [e\ \mid \ \langle e,\ \_,\ \_\rangle \ \in \ \mathsf{arms}] \\[0.16em]
\operatorname{AsyncCaptureArgs}(\_)\ =\ [] \\[0.16em]
\mathsf{ASYNC}_{\mathsf{LARGE}\_\mathsf{CAPTURE}\_\mathsf{THRESHOLD}\_\mathsf{BYTES}}\ =\ \mathsf{WIDEN}_{\mathsf{LARGE}\_\mathsf{PAYLOAD}\_\mathsf{THRESHOLD}\_\mathsf{BYTES}} \\[0.16em]
\operatorname{AsyncCaptureSize}(\mathsf{args})\ =\ \Sigma \_\{e\ \in \ \mathsf{args}\}\ \operatorname{sizeof}(\operatorname{ExprType}(e)) \\[0.16em]
\operatorname{AsyncCaptureWarnCond}(e)\ \Leftrightarrow \ \operatorname{AsyncCreateExpr}(e)\ \land \ \operatorname{AsyncCaptureSize}(\operatorname{AsyncCaptureArgs}(e))\ >\ \mathsf{ASYNC}_{\mathsf{LARGE}\_\mathsf{CAPTURE}\_\mathsf{THRESHOLD}\_\mathsf{BYTES}}
\end{array}
$$

The async frame stores:

- every binding live across suspension,
- the current resumption point,
- implementation fields required by the runtime.

### 21.4.4 Static Semantics

A binding is live across suspension iff there exists a control-flow path from a suspension point to a use of the binding on which the binding is not redefined.

Large capture warning and capture/escape provenance rules are:

**(Warn-Async-LargeCapture)**

$$
\begin{array}{l}
\operatorname{AsyncCaptureWarnCond}(e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{WarnAsyncCapture}(e)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(Warn-Async-LargeCapture-Ok)**

$$
\begin{array}{l}
\lnot \ \operatorname{AsyncCaptureWarnCond}(e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{WarnAsyncCapture}(e)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

When **(Warn-Async-LargeCapture)** applies, emit the warning defined in §21.4.7.

**(Async-Capture-Err)**

$$
\begin{array}{l}
\operatorname{AsyncCreateExpr}(e)\quad \operatorname{AsyncCaptureArgs}(e)\ =\ \mathsf{args}\quad \exists \ e_{i}\ \in \ \mathsf{args}.\ \Gamma ;\ \Omega \ \vdash \ e_{i}\ \Downarrow \ \pi_{i} \ \land \ \pi_{i} \ <\ \operatorname{FrameProv}(\Gamma ,\ \Omega ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \Omega \ \vdash \ e\ \Uparrow 
\end{array}
$$

**(P-Async-Create)**

$$
\begin{array}{l}
\operatorname{AsyncCreateExpr}(e)\quad \operatorname{AsyncCaptureArgs}(e)\ =\ \mathsf{args}\quad \forall \ e_{i}\ \in \ \mathsf{args},\ \Gamma ;\ \Omega \ \vdash \ e_{i}\ \Downarrow \ \pi_{i}  \\[0.16em]
\forall \ e_{i}\ \in \ \mathsf{args},\ \lnot (\pi_{i} \ <\ \operatorname{FrameProv}(\Gamma ,\ \Omega ))\quad \Gamma \ \vdash \ \operatorname{WarnAsyncCapture}(e)\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \Omega \ \vdash \ e\ \Downarrow \ \operatorname{FrameProv}(\Gamma ,\ \Omega )
\end{array}
$$

**(Prov-Async-Escape-Err)**

$$
\begin{array}{l}
\mathsf{stmt}\ \in \ \{\operatorname{AssignStmt}(p,\ e),\ \operatorname{CompoundAssignStmt}(p,\ \_,\ e)\}\quad \Gamma ;\ \Omega \ \vdash \ p\ \Downarrow \ \pi_{x} \quad \Gamma ;\ \Omega \ \vdash \ e\ \Downarrow \ \pi_{e}  \\[0.16em]
\pi_{e} \ <\ \pi_{x} \quad \operatorname{AsyncSig}(\operatorname{ExprType}(e))\ \ne \ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \Omega \ \vdash \ \mathsf{stmt}\ \Uparrow 
\end{array}
$$

Typing of error propagation in async procedures is defined by the async propagate rules in Chapter 16.

### 21.4.5 Dynamic Semantics

Evaluation of a call to an async procedure:

1. Evaluate arguments left-to-right.
2. Allocate a fresh async frame, capturing required arguments and initializing the resumption point to the procedure entry.
3. Execute the body until it suspends, completes, or fails.
4. The call expression evaluates to the produced async modal state.

Settlement rules are:

- `yield` or `yield from` produces `Async@Suspended { output = v }`.
- `return` produces `Async@Completed { value = v }`.
- error propagation via `?` produces `Async@Failed { error = e }`.

Evaluation of `a~>resume(input)` for `a : Async@Suspended`:

1. Resume execution at the stored resumption point with the yielded input value bound to the suspended `yield` expression.
2. Run until the next suspension, completion, or failure, and return the resulting `Async` state.

When an async computation fails:

1. Capture the error value.
2. Execute `defer` blocks in reverse order.
3. Run `Drop` implementations for live bindings.
4. Transition to `@Failed { error }`.

### 21.4.6 Lowering

$$
\begin{array}{l}
\mathsf{AsyncStateMachineJudg}\ =\ \{\mathsf{LowerAsyncProc},\ \mathsf{LowerAsyncResume}\} \\[0.16em]
\mathsf{AsyncProcIR}\ =\ \{\mathsf{AsyncFrameInitIR},\ \mathsf{AsyncResumeSwitchIR},\ \mathsf{AsyncSuspendStateIR},\ \mathsf{AsyncCompleteStateIR},\ \mathsf{AsyncFailStateIR}\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{GenPoints}(\mathsf{proc})\ =\ [g_{0},\ \ldots ,\ g_{n}]\quad \mathsf{where}\ \mathsf{the}\ \mathsf{suspension}\ \mathsf{expressions}\ \mathsf{of}\ \mathsf{proc}\ \mathsf{are}\ \mathsf{listed}\ \mathsf{in}\ \mathsf{source}\ \mathsf{order} \\[0.16em]
\operatorname{FrameSlots}(\mathsf{proc})\ =\ \operatorname{CaptureSet}(\mathsf{proc})\ \cup \ \operatorname{LiveAcrossSuspend}(\mathsf{proc})
\end{array}
$$

**(Lower-Async-Proc)**

$$
\begin{array}{l}
\operatorname{ProcedureDecl}(\_,\ \_,\ \mathsf{name},\ \_,\ \_,\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \_,\ \mathsf{body},\ \_,\ \_)\ =\ \mathsf{proc}\quad \operatorname{AsyncSig}(\operatorname{ProcReturn}(\mathsf{ret}_{\mathsf{opt}}))\ =\ \mathsf{sig} \\[0.16em]
\mathsf{slots}\ =\ \operatorname{FrameSlots}(\mathsf{proc})\quad \mathsf{gen}_{\mathsf{points}}\ =\ \operatorname{GenPoints}(\mathsf{proc}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerAsyncProc}(\mathsf{proc})\ \Downarrow \ \operatorname{ProcIR}(\operatorname{Mangle}(\mathsf{proc}),\ \mathsf{params},\ \operatorname{ProcReturn}(\mathsf{ret}_{\mathsf{opt}}),\ \operatorname{AsyncFrameInitIR}(\mathsf{name},\ \mathsf{sig},\ \mathsf{slots},\ \mathsf{gen}_{\mathsf{points}}))
\end{array}
$$

`AsyncFrameInitIR` MUST:
1. evaluate arguments left-to-right,
2. allocate the async frame,
3. copy or move captured values into `FrameSlots(proc)`,
4. initialize `gen_point` to `g_0`,
5. enter `AsyncResumeSwitchIR`.

**(Lower-Async-Resume)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(\operatorname{ExprType}(a))\ =\ \mathsf{sig}\quad \operatorname{CurrentAsyncFrame}(\Gamma )\ =\ f\quad \operatorname{CurrentProcedure}(\Gamma )\ =\ \mathsf{proc} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerAsyncResume}(a)\ \Downarrow \ \operatorname{AsyncResumeSwitchIR}(f,\ \operatorname{GenPoints}(\mathsf{proc}))
\end{array}
$$

`AsyncResumeSwitchIR` MUST dispatch on the stored `gen_point` and continue execution at the corresponding resumption label.

**(Lower-Async-Suspend)**

$$
\begin{array}{l}
\operatorname{CurrentAsyncFrame}(\Gamma )\ =\ f\quad \operatorname{CurrentGenPoint}(\Gamma )\ =\ g \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{Suspend}(\mathsf{async}_{\mathsf{state}})\ \mathsf{lowers}\ \mathsf{through}\ \operatorname{AsyncSuspendStateIR}(f,\ g)
\end{array}
$$

**(Lower-Async-Complete)**

$$
\begin{array}{l}
\operatorname{CurrentAsyncFrame}(\Gamma )\ =\ f \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{Return}\ \mathsf{from}\ \mathsf{an}\ \mathsf{async}\ \mathsf{procedure}\ \mathsf{lowers}\ \mathsf{through}\ \operatorname{AsyncCompleteStateIR}(f)
\end{array}
$$

**(Lower-Async-Fail)**

$$
\begin{array}{l}
\operatorname{CurrentAsyncFrame}(\Gamma )\ =\ f \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{Async}\ \mathsf{failure}\ \mathsf{lowers}\ \mathsf{through}\ \operatorname{AsyncFailStateIR}(f)
\end{array}
$$

`AsyncFailStateIR(f)` MUST execute `defer` blocks and drop live frame slots in reverse cleanup order before materializing `@Failed { error }`. If `AsyncSig(ProcReturn(ret_opt)).4 = TypePrim("!")`, `AsyncFailStateIR(f)` is unreachable and MUST NOT be emitted.

### 21.4.7 Diagnostics

| Code         | Severity | Detection    | Condition                               |
| ------------ | -------- | ------------ | --------------------------------------- |
| `W-CON-0201` | Warning  | Compile-time | Large captured state (performance)      |
| `E-CON-0280` | Error    | Compile-time | Captured binding does not outlive async |
| `E-CON-0281` | Error    | Compile-time | Async operation escapes its region      |
