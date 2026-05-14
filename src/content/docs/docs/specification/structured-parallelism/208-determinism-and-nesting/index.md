---
title: "20.8 Determinism and Nesting"
description: "20.8 Determinism and Nesting from 20. Structured Parallelism of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "structured-parallelism"
specSection: "208-determinism-and-nesting"
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

## 20.8 Determinism and Nesting

### 20.8.1 Syntax

This section introduces no additional surface syntax.

### 20.8.2 Parsing

This section introduces no additional parsing rules.

### 20.8.3 AST Representation / Form

This section introduces no additional feature-local AST nodes beyond `ParallelExpr`, `SpawnExpr`, and `DispatchExpr`.

### 20.8.4 Static Semantics

Dispatch is deterministic when:

1. Key patterns produce identical partitioning across runs.
2. Iterations with the same key execute in index order.
3. Reduction uses deterministic tree combination.

The `[ordered]` dispatch option forces sequential side-effect ordering.

GPU parallel blocks MUST NOT be nested inside other GPU parallel blocks.

### 20.8.5 Dynamic Semantics

Inner CPU parallel blocks share the worker pool with outer CPU parallel blocks.

CPU and GPU blocks MAY be nested heterogeneously.

Capture rules apply independently at each nesting level.

Work items MAY capture `ctx.heap` and invoke allocation methods.

Work items executing within a `region` block MAY allocate from that region using `^`.

$$
\begin{array}{l}
\operatorname{TaskId}(w)\ =\ n\ \mathsf{assigns}\ \mathsf{each}\ \mathsf{created}\ \mathsf{work}\ \mathsf{item}\ a\ \mathsf{stable}\ \mathsf{creation}\ \mathsf{identifier}. \\[0.16em]
\operatorname{CompletionSeq}(w)\ =\ n\ \mathsf{assigns}\ \mathsf{each}\ \mathsf{settled}\ \mathsf{work}\ \mathsf{item}\ a\ \mathsf{global}\ \mathsf{monotonically}\ \mathsf{increasing}\ \mathsf{completion}\ \mathsf{identifier}.
\end{array}
$$

Within each CPU domain queue, ready work items are dequeued in ascending `TaskId`.

Dispatch groups are scheduled in ascending order of their least iteration index.

The inline domain executes work immediately at creation.

GPU work-items execute in lexicographic order of `(workgroup_id, local_id)` for abstract semantics.

Ordered dispatch buffers side effects within each group and commits them in ascending iteration order after group completion.

### 20.8.6 Lowering

**(Lower-Deterministic-Dispatch)**

$$
\begin{array}{l}
\mathsf{Ordered}\ \in \ \mathsf{opts} \\[0.16em]
\rule{18em}{0.4pt}
\end{array}
$$
Dispatch lowering MUST emit OrderedDispatchBufferIR before the group body and OrderedDispatchCommitIR after the group body, committing buffered side effects in ascending iteration order.

**(Lower-Nested-Parallel)**
Nested CPU parallel lowering reuses the enclosing pool handle. Nested GPU-in-GPU lowering is ill-formed and therefore emits no IR.

### 20.8.7 Diagnostics

| Code         | Severity | Detection    | Condition                 |
| ------------ | -------- | ------------ | ------------------------- |
| `E-CON-0152` | Error    | Compile-time | Nested GPU parallel block |
