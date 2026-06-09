---
title: "19.7 Memory Ordering"
description: "19.7 Memory Ordering from 19. Key System of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "key-system"
specSection: "197-memory-ordering"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/key-system/">19. Key System</a>
  <span>Key System</span>
</div>

## 19.7 Memory Ordering

### 19.7.1 Syntax

```text
memory_order_attribute ::= attr_open memory_order attr_close
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

Ordering levels:

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

Required ordering constraints:

1. `fence(acquire)`: operations sequenced after the fence MUST NOT be reordered before it.
2. `fence(release)`: operations sequenced before the fence MUST NOT be reordered after it.
3. `fence(seqcst)`: acquire and release constraints both hold, and all `Fence(seqcst)` events and `#seqcst` accesses participate in one global total order consistent with each task's sequenced-before order.

Fence evaluation MUST NOT read or write program-visible storage.

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
\operatorname{ContainsSharedAccess}(e)\quad \mathsf{ord}\ =\ \operatorname{EffectiveOrdering}(e)\quad \Gamma \ \vdash \ \operatorname{LowerExprCore}(e)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \operatorname{OrderedAccessIR}(\mathsf{ord},\ \mathsf{IR}),\ v\rangle 
\end{array}
$$

### 19.7.7 Diagnostics

No additional named diagnostics are introduced here. The speculative-block restriction on memory-order annotations and fence operations is owned by §19.5.7.
