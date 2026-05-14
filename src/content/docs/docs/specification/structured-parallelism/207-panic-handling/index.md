---
title: "20.7 Panic Handling"
description: "20.7 Panic Handling from 20. Structured Parallelism of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "structured-parallelism"
specSection: "207-panic-handling"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/structured-parallelism/">20. Structured Parallelism</a>
  <span>Structured Parallelism</span>
</div>

## 20.7 Panic Handling

### 20.7.1 Syntax

This section introduces no additional surface syntax.

### 20.7.2 Parsing

This section introduces no additional parsing rules.

### 20.7.3 AST Representation / Form

Parallel panic propagation consumes failure states produced by `SpawnHandle` settlement and by `DispatchRun(... ) ⇓ (Ctrl(Panic), σ')`.

### 20.7.4 Static Semantics

This section introduces no additional static typing rules.

### 20.7.5 Dynamic Semantics

When a work item panics within a parallel block:

1. The panic is captured.
2. Other work items continue to completion, or cancellation is requested if a cancel token is attached.
3. After all started work settles, a panic is propagated at the block boundary.

**(EvalSigma-Parallel-Spawn-Panic)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(D,\ \sigma )\ \Downarrow \ (\operatorname{Val}(d),\ \sigma_{1} )\quad \operatorname{ParallelInit}(d,\ \mathsf{opts})\ \Downarrow \ \mathsf{pstate}_{0}\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(B,\ \sigma_{1} [\mathsf{parallel}_{\mathsf{context}}\ \mapsto \ \mathsf{pstate}_{0}])\ \Downarrow \ (\mathsf{out}_{\mathsf{body}},\ \sigma_{2} )\quad \operatorname{LookupVal}(\sigma_{2} ,\ \mathsf{parallel}_{\mathsf{context}})\ =\ \mathsf{pstate}_{n}\quad \operatorname{AwaitSpawned}(\mathsf{pstate}_{n},\ \sigma_{2} )\ \Downarrow \ (\mathsf{panic}_{\mathsf{opt}},\ \sigma_{3} )\quad \mathsf{panic}_{\mathsf{opt}}\ \ne \ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{ParallelExpr}(D,\ \mathsf{opts},\ B),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma_{3} )
\end{array}
$$

If a cancel token is attached to the parallel block, the runtime MUST request cancellation on the first captured panic, exactly once. If no cancel token is attached, panic alone MUST NOT request cancellation.

$$
\operatorname{FirstCompletedFailure}(\mathsf{pstate},\ \sigma )\ =\ \mathsf{panic}_{\mathsf{opt}}\ \Leftrightarrow \ \mathsf{panic}_{\mathsf{opt}}\ \mathsf{is}\ \mathsf{the}\ \mathsf{failure}\ \mathsf{whose}\ \texttt{CompletionSeq}\ \mathsf{is}\ \mathsf{least}\ \mathsf{among}\ \mathsf{failed}\ \mathsf{handles}\ \mathsf{in}\ \texttt{pstate.Handles}.
$$

### 20.7.6 Lowering

**(Lower-Parallel-Join-Panic)**

$$
\rule{18em}{0.4pt}
$$
ParallelJoin lowers to a join operation that waits for all started work, requests cancellation exactly once on the first observed failure when a cancel token is attached, and re-emits the panic with least `CompletionSeq`.

### 20.7.7 Diagnostics

No additional named diagnostics are introduced for panic propagation itself.
