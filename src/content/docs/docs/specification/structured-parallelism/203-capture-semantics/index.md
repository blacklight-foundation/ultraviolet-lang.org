---
title: "20.3 Capture Semantics"
description: "20.3 Capture Semantics from 20. Structured Parallelism of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "structured-parallelism"
specSection: "203-capture-semantics"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/structured-parallelism/">20. Structured Parallelism</a>
  <span>Structured Parallelism</span>
</div>

## 20.3 Capture Semantics

### 20.3.1 Syntax

This section introduces no additional surface syntax beyond closure, `spawn`, and `dispatch` bodies.

### 20.3.2 Parsing

This section introduces no additional parsing rules.

### 20.3.3 AST Representation / Form

Capture-set computation is defined by §16.9.4.

This section consumes the following capture classifications from §16.9.4:

- `CaptureSet(C)`
- `MoveCaptureSet(C)`
- `RefCaptureSet(C)`
- `ConstCaptures(C)`
- `SharedCaptures(C)`
- `UniqueCaptures(C)`

$$
\mathsf{GpuCaptureJudg}\ =\ \{\operatorname{GpuCaptureOk}(\Gamma ,\ x,\ T)\}
$$

$$
\operatorname{HasHeapProvenance}(\Gamma ,\ x)\ \Leftrightarrow \ \Gamma [x].\mathsf{provenance}\ =\ \pi_{\mathsf{Heap}} \ \lor \ (\Gamma [x].\mathsf{provenance}\ =\ \pi_{\mathsf{Derived}} (y)\ \land \ \operatorname{HasHeapProvenance}(\Gamma ,\ y))
$$

### 20.3.4 Static Semantics

Bindings with `const` permission MAY be captured by reference into `spawn` and `dispatch` bodies.

Bindings with `shared` permission MAY be captured by reference into `spawn` and `dispatch` bodies. Access synchronization is defined by Chapter 19.

Bindings with `unique` permission MUST NOT be captured by closures used in `spawn` or `dispatch` bodies.

**(Parallel-Closure-Capture-Const)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{Context}(C)\ \subseteq \ \{\mathsf{SpawnBody},\ \mathsf{DispatchBody}\}\quad x\ \in \ \operatorname{ConstCaptures}(C) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParallelClosureCapture}(C,\ x)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(Parallel-Closure-Capture-Shared)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{Context}(C)\ \subseteq \ \{\mathsf{SpawnBody},\ \mathsf{DispatchBody}\}\quad x\ \in \ \operatorname{SharedCaptures}(C) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParallelClosureCapture}(C,\ x)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(Parallel-Closure-Capture-Unique-Err)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{Context}(C)\ \subseteq \ \{\mathsf{SpawnBody},\ \mathsf{DispatchBody}\}\quad x\ \in \ \operatorname{UniqueCaptures}(C) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{Reject}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{OuterParallelBinding}(\Gamma ,\ x)\ \Leftrightarrow \ x\ \mathsf{is}\ \mathsf{bound}\ \mathsf{in}\ \mathsf{an}\ \mathsf{enclosing}\ \texttt{parallel}\ \mathsf{body}\ \mathsf{outside}\ \mathsf{the}\ \mathsf{current}\ \mathsf{child}\ \mathsf{task}\ \mathsf{body} \\[0.16em]
\operatorname{FirstChildMove}(\Gamma ,\ x)\ \Leftrightarrow \ x\ \mathsf{is}\ \mathsf{the}\ \mathsf{unique}\ \mathsf{outer}\ \mathsf{binding}\ \mathsf{selected}\ \mathsf{by}\ \mathsf{the}\ \mathsf{enclosing}\ \mathsf{parallel}\ \mathsf{capture}\ \mathsf{analysis}\ \mathsf{for}\ \mathsf{one}\ \mathsf{child}\ \mathsf{task}
\end{array}
$$

**(Parallel-Closure-Capture-Unique-Move-Ok)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{Context}(C)\ \subseteq \ \{\mathsf{SpawnBody},\ \mathsf{DispatchBody}\}\quad x\ \in \ \operatorname{UniqueCaptures}(C)\quad \operatorname{ExplicitMove}(x)\quad \operatorname{OuterParallelBinding}(\Gamma ,\ x)\quad \operatorname{FirstChildMove}(\Gamma ,\ x) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParallelClosureCapture}(C,\ x)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(Parallel-Closure-Capture-OuterMove-Err)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{Context}(C)\ \subseteq \ \{\mathsf{SpawnBody},\ \mathsf{DispatchBody}\}\quad x\ \in \ \operatorname{UniqueCaptures}(C)\quad \operatorname{ExplicitMove}(x)\quad \operatorname{OuterParallelBinding}(\Gamma ,\ x)\quad \lnot \ \operatorname{FirstChildMove}(\Gamma ,\ x)\quad c\ =\ \operatorname{Code}(\mathsf{Parallel}-\mathsf{Closure}-\mathsf{Capture}-\mathsf{OuterMove}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParallelClosureCapture}(C,\ x)\ \Uparrow \ c
\end{array}
$$

**(Parallel-Escaping-Closure-Spawn-Err)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{IsEscaping}(C)\quad \operatorname{SpawnExpr}(\_,\ \_)\ \in \ \mathsf{body} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{Reject}
\end{array}
$$

All closures in parallel contexts are classified as local closures for Chapter 19 key analysis. A `spawn` expression is forbidden in the body of an escaping closure.

**(GpuCaptureOk-Const)**

$$
\begin{array}{l}
\operatorname{GpuContext}(\Gamma )\quad \Gamma [x]\ =\ \langle \texttt{const},\ T,\ \_,\ \_\rangle \quad \operatorname{GpuSafeType}(T)\quad \lnot \operatorname{HasHeapProvenance}(\Gamma ,\ x) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{GpuCaptureOk}(\Gamma ,\ x,\ T)
\end{array}
$$

**(GpuCaptureOk-Unique-Move)**

$$
\begin{array}{l}
\operatorname{GpuContext}(\Gamma )\quad \Gamma [x]\ =\ \langle \texttt{unique},\ T,\ \_,\ \_\rangle \quad \operatorname{GpuSafeType}(T)\quad \lnot \operatorname{HasHeapProvenance}(\Gamma ,\ x)\quad \operatorname{ExplicitMove}(x) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{GpuCaptureOk}(\Gamma ,\ x,\ T)
\end{array}
$$

**(GpuCapture-Shared-Err)**

$$
\begin{array}{l}
\operatorname{GpuContext}(\Gamma )\quad \Gamma [x]\ =\ \langle \texttt{shared},\ T,\ \_,\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{Reject}
\end{array}
$$

**(GpuCapture-HeapProv-Err)**

$$
\begin{array}{l}
\operatorname{GpuContext}(\Gamma )\quad \operatorname{HasHeapProvenance}(\Gamma ,\ x) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{Reject}
\end{array}
$$

**(GpuCapture-NonGpuSafe-Err)**

$$
\begin{array}{l}
\operatorname{GpuContext}(\Gamma )\quad \Gamma [x]\ =\ \langle \_,\ T,\ \_,\ \_\rangle \quad \lnot \operatorname{GpuSafeType}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{Reject}
\end{array}
$$

Moved-binding validity checks remain defined by the generic closure-capture rules in §16.9.4.

### 20.3.5 Dynamic Semantics

This section introduces no additional runtime mechanism beyond:

1. Closure environment construction in §16.9.5.
2. GPU work-item capture environments in §20.2.5.
3. Key synchronization for `shared` captures in Chapter 19.

### 20.3.6 Lowering

No parallel-specific lowering rule was found. Generic closure-environment lowering is defined by §16.9.6.

### 20.3.7 Diagnostics

| Code         | Severity | Detection    | Condition                                 |
| ------------ | -------- | ------------ | ----------------------------------------- |
| `E-CON-0120` | Error    | Compile-time | Implicit capture of `unique` binding      |
| `E-CON-0121` | Error    | Compile-time | Move of already-moved binding             |
| `E-CON-0122` | Error    | Compile-time | Move of binding from outer parallel scope |
| `E-CON-0131` | Error    | Compile-time | `spawn` in escaping closure               |
| `E-CON-0151` | Error    | Compile-time | `shared` capture in GPU context           |
| `E-CON-0153` | Error    | Compile-time | Non-GpuSafe type in GPU capture           |
