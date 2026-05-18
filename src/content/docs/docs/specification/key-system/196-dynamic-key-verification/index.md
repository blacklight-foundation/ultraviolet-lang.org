---
title: "19.6 Dynamic Key Verification"
description: "19.6 Dynamic Key Verification from 19. Key System of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "key-system"
specSection: "196-dynamic-key-verification"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/key-system/">19. Key System</a>
  <span>Key System</span>
</div>

## 19.6 Dynamic Key Verification

### 19.6.1 Syntax

This section introduces no additional surface syntax. `[[dynamic]]` attribute syntax is defined by Chapter 9.

### 19.6.2 Parsing

This section introduces no additional parsing rules beyond the generic attribute parser in Chapter 9.

### 19.6.3 AST Representation / Form

$$
\operatorname{StaticallySafe}(P)\ \mathsf{is}\ \mathsf{classified}\ \mathsf{by}\ \mathsf{the}\ \mathsf{following}\ \mathsf{source}\ \mathsf{conditions}:
$$

| Condition            | Description                                                 | Rule   |
| -------------------- | ----------------------------------------------------------- | ------ |
| `No escape`          | `shared` value never escapes to another task                | K-SS-1 |
| `Disjoint paths`     | Concurrent accesses target provably disjoint paths          | K-SS-2 |
| `Sequential context` | No `parallel` block encloses the access                     | K-SS-3 |
| `Unique origin`      | Value is `unique` at origin, temporarily viewed as `shared` | K-SS-4 |
| `Dispatch-indexed`   | Access indexed by `dispatch` iteration variable             | K-SS-5 |
| `Speculative-only`   | All accesses occur within speculative blocks with fallback  | K-SS-6 |

`StaticallySafe(P)` is a conservative compile-time judgment.

The conditions above describe sufficient proof shapes for omitting runtime synchronization.

An implementation MUST treat `StaticallySafe(P)` as false unless it can establish a complete sound proof for the concrete access. Uncertainty is not success.

### 19.6.4 Static Semantics

**(K-Static-Safe)**
Access(P, M)    StaticallySafe(P)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{NoRuntimeSync}(P)
\end{array}
$$

`NoRuntimeSync(P)` means that runtime synchronization is not required for correctness of the access.

An implementation MAY omit runtime synchronization for `P`, or MAY conservatively retain equivalent synchronization, provided observable behavior is preserved.

**(K-Static-Required)**

$$
\begin{array}{l}
\lnot \ \operatorname{StaticallySafe}(P)\quad \lnot \ \mathsf{InDynamicContext} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{Reject}
\end{array}
$$

### 19.6.5 Dynamic Semantics

When runtime synchronization is required:

1. Mutual exclusion is enforced by `KeyConflict` and `KeyModeCompatible` from §19.3.5.
2. Incompatible acquisitions block until release.
3. Keys are released on scope exit, including panic.
4. Implementations MUST guarantee eventual progress when conflicting holders eventually release.

Within `[[dynamic]]`, incomparable dynamic indices require a runtime ordering relation satisfying:

1. Totality.
2. Antisymmetry.
3. Transitivity.
4. Cross-task consistency.
5. Value-determinism.

An implementation MAY conservatively coarsen a non-statically-safe dynamic indexed path to a static prefix that soundly covers every runtime index reachable by the access.

When such conservative coarsening is used, runtime synchronization is performed on the coarsened path rather than on per-index dynamic keys. This is conforming iff the coarsened path preserves mutual exclusion and observational equivalence.

If all tasks acquire keys in `CanonicalOrder`, no circular wait can occur.

If a task waits for a key and all conflicting holders eventually release, the task eventually acquires the key.

Observable behavior under statically-proven key safety and under runtime synchronization MUST be observationally equivalent.

### 19.6.6 Lowering

**(K-Dynamic-Permitted)**

$$
\begin{array}{l}
\lnot \ \operatorname{StaticallySafe}(P)\quad \mathsf{InDynamicContext} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{EmitRuntimeSync}(P)
\end{array}
$$

When `InDynamicContext` and `StaticallySafe(P)` both hold, runtime synchronization is not required. An implementation MAY omit it or conservatively retain equivalent synchronization.

### 19.6.7 Diagnostics

| Code         | Severity | Detection    | Condition                                                |
| ------------ | -------- | ------------ | -------------------------------------------------------- |
| `E-CON-0020` | Error    | Compile-time | Key safety not statically provable outside `[[dynamic]]` |
| `I-CON-0011` | Info     | Compile-time | Runtime synchronization emitted under `[[dynamic]]`      |
| `I-CON-0013` | Info     | Compile-time | Static key safety proven under `[[dynamic]]`             |
