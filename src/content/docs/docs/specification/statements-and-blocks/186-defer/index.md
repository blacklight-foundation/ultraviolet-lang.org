---
title: "18.6 Defer"
description: "18.6 Defer from 18. Statements and Blocks of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "statements-and-blocks"
specSection: "186-defer"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/statements-and-blocks/">18. Statements and Blocks</a>
  <span>Statements and Blocks</span>
</div>

## 18.6 Defer

### 18.6.1 Syntax

```text
defer_stmt ::= "defer" block_expr
```

### 18.6.2 Parsing

**(Parse-Defer-Stmt)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{defer})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ b) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStmtCore}(P)\ \Downarrow \ (P_{1},\ \operatorname{DeferStmt}(b))
\end{array}
$$

### 18.6.3 AST Representation / Form

DeferStmt(block)

### 18.6.4 Static Semantics

**(T-DeferStmt)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ b\ \Leftarrow \ \operatorname{TypePrim}(\texttt{"()"})\ \dashv \ \emptyset \quad \operatorname{DeferSafe}(b) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{DeferStmt}(b)\ \Rightarrow \ \Gamma \ \triangleright \ \langle [],\ [],\ \mathsf{false}\rangle 
\end{array}
$$

**(Defer-NonUnit-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ b\ :\ T_{b}\quad T_{b}\ \ne \ \operatorname{TypePrim}(\texttt{"()"})\quad c\ =\ \operatorname{Code}(\mathsf{Defer}-\mathsf{NonUnit}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{DeferStmt}(b)\ \Uparrow \ c
\end{array}
$$

**(Defer-NonLocal-Err)**

$$
\begin{array}{l}
\lnot \ \operatorname{DeferSafe}(b)\quad c\ =\ \operatorname{Code}(\mathsf{Defer}-\mathsf{NonLocal}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{DeferStmt}(b)\ \Uparrow \ c
\end{array}
$$

**(HasNonLocalCtrl-Return)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{HasNonLocalCtrl}(\operatorname{ReturnStmt}(\_),\ \mathsf{in}_{\mathsf{loop}})
\end{array}
$$

**(HasNonLocalCtrl-Break)**

$$
\begin{array}{l}
\mathsf{in}_{\mathsf{loop}}\ =\ \mathsf{false} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{HasNonLocalCtrl}(\operatorname{BreakStmt}(\_),\ \mathsf{in}_{\mathsf{loop}})
\end{array}
$$

**(HasNonLocalCtrl-Continue)**

$$
\begin{array}{l}
\mathsf{in}_{\mathsf{loop}}\ =\ \mathsf{false} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{HasNonLocalCtrl}(\mathsf{ContinueStmt},\ \mathsf{in}_{\mathsf{loop}})
\end{array}
$$

**(HasNonLocalCtrl-LoopInfinite)**, **(HasNonLocalCtrl-LoopConditional)**, **(HasNonLocalCtrl-LoopIter)**, and **(HasNonLocalCtrl-Child)** propagate non-local control-flow detection through nested expressions and statements.

$$
\operatorname{DeferSafe}(b)\ \Leftrightarrow \ \lnot \ \operatorname{HasNonLocalCtrl}(b,\ \mathsf{false})
$$

**(B-Defer)** and **(Prov-DeferStmt)** require a deferred block to preserve the current binding-state and provenance environment.

### 18.6.5 Dynamic Semantics

**(ExecSigma-Defer)**

$$
\begin{array}{l}
\operatorname{AppendCleanup}(\sigma ,\ \operatorname{DeferBlock}(b))\ \Downarrow \ \sigma ' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{DeferStmt}(b),\ \sigma )\ \Downarrow \ (\mathsf{ok},\ \sigma ')
\end{array}
$$

**(Cleanup-Step-Defer-Ok)**, **(Cleanup-Step-Defer-Panic)**, and **(Cleanup-Step-Defer-Abort)** define execution of deferred blocks during scope exit.

**(Cleanup-Cons-Defer-Ok)** and **(Cleanup-Cons-Defer-Panic)** define the big-step cleanup view of deferred blocks.

### 18.6.6 Lowering

**(Lower-Stmt-Defer)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{DeferStmt}(\mathsf{block}))\ \Downarrow \ \operatorname{DeferIR}(\mathsf{block})
\end{array}
$$

### 18.6.7 Diagnostics

Diagnostics are defined for defer blocks with non-unit type and for defer blocks that contain non-local control flow.
