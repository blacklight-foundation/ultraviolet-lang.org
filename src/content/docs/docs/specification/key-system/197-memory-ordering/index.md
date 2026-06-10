---
title: "19.7 Memory Ordering"
description: "19.7 Memory Ordering from 19. Key System of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "key-system"
specSection: "197-memory-ordering"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/key-system/">19. Key System</a>
  <span>Key System</span>
</div>

## 19.7 Memory Ordering

### 19.7.1 Syntax

```text
memory_order_attribute ::= "#" memory_order
memory_order           ::= "relaxed" | "acquire" | "release" | "acqrel" | "seqcst"
fence_expr             ::= "fence" "(" fence_order ")"
fence_order            ::= "acquire" | "release" | "seqcst"
```

### 19.7.2 Parsing

Memory-order attributes use the generic attribute parser in Chapter 9.

This section defines the surface grammar `fence_expr ::= "fence" "(" fence_order ")"`. No separate named parser helper beyond ordinary expression parsing is introduced here.

### 19.7.3 AST Representation / Form

Memory-order attributes are attached through the generic attribute forms owned by Chapter 9.

$$
\begin{array}{l}
\mathsf{FenceOrder}\ =\ \{\texttt{acquire},\ \texttt{release},\ \texttt{seqcst}\} \\[0.16em]
\mathsf{Expr}\ =\ \ldots \ \mid \ \operatorname{FenceExpr}(\mathsf{order})\ \mid \ \ldots
\end{array}
$$

$$
\operatorname{EffectiveOrdering}(e)\ \mathsf{is}\ \mathsf{defined}\ \mathsf{by}\ \mathsf{nearest}-\mathsf{override}\ \mathsf{precedence}:
$$

1. The nearest enclosing expression-level memory-order attribute on `e`.
2. Else the nearest enclosing key-block default memory-order attribute.
3. Else `seqcst`.

### 19.7.4 Static Semantics

Memory accesses default to sequentially consistent ordering.

Key acquisition uses acquire semantics. Key release uses release semantics.

Ordering levels (informative summary; the normative model is the happens-before axiomatization of §19.7.5):

| Ordering  | Guarantee                                 |
| --------- | ----------------------------------------- |
| `relaxed` | Atomicity only; no ordering               |
| `acquire` | Subsequent reads see prior writes         |
| `release` | Prior writes are visible to acquire reads |
| `acqrel`  | Both acquire and release                  |
| `seqcst`  | Total global order                        |

Memory-order attributes MAY be attached to:

1. A key-block statement, establishing a default ordering for keyed or shared accesses in that body.
2. An attributed expression, overriding any enclosing key-block default for that expression subtree.

A key block or attributed expression MUST carry at most one memory-order attribute.

Expression-level memory-order attributes are well-formed only when the attributed expression contains keyed or shared-data access.

Memory-order attributes affect only data-access ordering. They MUST NOT alter key acquire or key release semantics.

Memory-order annotations MUST NOT appear inside speculative blocks.

**(T-Fence)**

$$
\begin{array}{l}
O\ \in \ \{\texttt{acquire},\ \texttt{release},\ \texttt{seqcst}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \texttt{fence}(O)\ :\ ()
\end{array}
$$

Fence operations MAY appear in runtime expression contexts. They MUST NOT alter the held-key context.

### 19.7.5 Dynamic Semantics

Evaluation of `fence(O)`:

1. Evaluate `fence(O)` at the current expression evaluation point.
2. Emit ordering event `Fence(O)`.
3. Produce value `()`.

Fence evaluation MUST NOT read or write program-visible storage.

**Memory Actions.**

$$
\begin{array}{l}
\mathsf{TaskId}\ =\ \mathsf{task}\ \mathsf{identities}\ \mathsf{introduced}\ \mathsf{by}\ \mathsf{Chapters}\ 20\ \mathsf{and}\ 21;\ \mathsf{the}\ \mathsf{entry}\ \mathsf{task}\ \mathsf{is}\ t_{\mathsf{main}} \\[0.16em]
\mathsf{Loc}\ =\ \mathsf{storage}\ \mathsf{locations}\ \mathsf{of}\ \mathsf{the}\ \mathsf{runtime}\ \mathsf{state}\ \sigma \ (\S 6.5) \\[0.16em]
\mathsf{MemAction}\ = \\[0.16em]
\ \operatorname{Access}(t,\ l,\ \mathsf{kind},\ \mathsf{ord})\quad \mathsf{kind}\ \in \ \{\mathsf{Read},\ \mathsf{Write}\},\ \mathsf{ord}\ \in \ \{\mathsf{plain},\ \mathsf{relaxed},\ \mathsf{acquire},\ \mathsf{release},\ \mathsf{acqrel},\ \mathsf{seqcst}\} \\[0.16em]
\mid \ \operatorname{KeyAcquire}(t,\ \mathsf{ks})\quad \mathsf{ks}\ =\ \mathsf{key}\ \mathsf{set}\ \mathsf{acquired}\ \mathsf{by}\ a\ \mathsf{key}\ \mathsf{block}\ (\S 19.2.5) \\[0.16em]
\mid \ \operatorname{KeyRelease}(t,\ \mathsf{ks}) \\[0.16em]
\mid \ \operatorname{FenceAct}(t,\ O)\quad O\ \in \ \{\mathsf{acquire},\ \mathsf{release},\ \mathsf{seqcst}\} \\[0.16em]
\mid \ \operatorname{TaskStart}(t)\ \mid \ \operatorname{TaskEnd}(t) \\[0.16em]
\mid \ \operatorname{SpawnAct}(t_{\mathsf{parent}},\ t_{\mathsf{child}})\ \mid \ \operatorname{JoinAct}(t_{\mathsf{child}},\ t_{\mathsf{parent}})
\end{array}
$$

Keyed and `shared` accesses carry the `EffectiveOrdering` of §19.7.3; all other accesses are `plain`. `KeyAcquire`, `KeyRelease`, and ordered-commit events are the `KeyEffect` observables of §6.1.4.

**Sequenced-Before.**
`sb` is the per-task total order over that task's actions induced by the sequence points of §6.1.5 and, between adjacent sequence points, by `Children_LTR` (§24.7.7).

**Synchronizes-With.**
`sw` is the least relation containing:

1. **Key transfer.** `KeyRelease(t_1, ks_1) sw KeyAcquire(t_2, ks_2)` whenever some key in `ks_1` overlaps some key in `ks_2` (`KeysOverlap`, §19.3.5) and the release immediately precedes the acquire in that key's serialization order.
2. **Task creation.** `SpawnAct(t_p, t_c) sw TaskStart(t_c)`; the action of a `parallel` or `dispatch` block that logically creates a work item synchronizes with the first action of that item.
3. **Task completion.** `TaskEnd(t_c) sw JoinAct(t_c, t_p)`; every work item's `TaskEnd` synchronizes with the enclosing block's exit (§20.1.5), and `TaskEnd` of a `Spawned` task synchronizes with completion of the `wait` or `sync` that consumes it (§21.2.5).
4. **Release/acquire accesses.** `Access(t_1, l, Write, o_w)` with `o_w ∈ {release, acqrel, seqcst}` synchronizes with `Access(t_2, l, Read, o_r)` with `o_r ∈ {acquire, acqrel, seqcst}` when the read reads-from that write.
5. **Fences.** `FenceAct(t_1, release)` synchronizes with `FenceAct(t_2, acquire)` when some atomic write on `l` sequenced after the release fence is read-from by some atomic read on `l` sequenced before the acquire fence. `FenceAct(_, seqcst)` participates in clauses 4 and 5 as both an acquire and a release fence.
6. **Ordered commit.** The commit action of an `ordered` key block synchronizes with the acquisition of the next block in canonical order (§19.2.5).

**Happens-Before.**

$$
\mathsf{hb}\ =\ (\mathsf{sb}\ \cup \ \mathsf{sw})^{+}
$$

`hb` MUST be irreflexive in every execution.

**Coherence and Visibility.**
For each location `l` there is a total modification order `mo_l` over `Write` actions on `l`, consistent with `hb`. A `plain` or key-covered read of `l` MUST read-from the `hb`-latest write to `l` (unique by race-freedom below). A `relaxed`, `acquire`, or `seqcst` read of `l` MUST read-from a write `W` such that the read does not happen-before `W` and there is no write `W'` with `W →mo_l W'` and `W' hb` the read. All `seqcst` actions and `seqcst` fences belong to one total order `S` consistent with `hb` and with every `mo_l`; a `seqcst` read reads-from the latest `S`-prior write permitted by coherence.

Values MUST NOT be produced out of thin air: in every execution, `(rf ∪ sb)⁺` MUST be irreflexive, where `rf` relates each write to the reads that read-from it.

**Data Races.**
Two actions conflict iff they access the same location, at least one is a `Write`, and they are from different tasks. An execution has a data race iff some pair of conflicting actions, at least one of which is `plain`, is unordered by `hb`. Programs whose safe fragment is accepted by Chapters 10 and 19 have no data races (`Data-Race-Freedom`, §8.4): every `shared` access is key-covered and key transfer establishes `hb`. A data race introduced through `unsafe`, raw pointers, or FFI implies `OutsideConformance`.

**Key-Transfer Visibility.**
If `A` is any access sequenced before `KeyRelease(t_1, ks)` in `t_1`, and `KeyAcquire(t_2, ks')` with overlapping keys synchronizes with that release, then `A hb B` for every `B` sequenced after the acquire in `t_2` — regardless of memory-order attributes on `A` or `B`. Memory-order attributes weaken only same-location atomic visibility outside key transfer and the implementation's reordering latitude inside a held-key body; they MUST NOT weaken clause 1 synchronizes-with edges. This restates the attribute restriction of §19.7.4 in model terms.

### 19.7.6 Lowering

**(Lower-Expr-Fence)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{FenceExpr}(\mathsf{order}))\ \Downarrow \ \langle \operatorname{FenceIR}(\mathsf{order}),\ \mathsf{UnitVal}\rangle
\end{array}
$$

**(Lower-Ordered-Access)**

$$
\begin{array}{l}
\operatorname{ContainsSharedAccess}(e)\quad \mathsf{ord}\ =\ \operatorname{EffectiveOrdering}(e)\quad \Gamma \ \vdash \ \operatorname{LowerExprCore}(e)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \operatorname{OrderedAccessIR}(\mathsf{ord},\ \mathsf{IR}),\ v\rangle
\end{array}
$$

### 19.7.7 Diagnostics

No additional named diagnostics are introduced here. The speculative-block restriction on memory-order annotations and fence operations is owned by §19.5.7.
