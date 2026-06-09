---
title: "18.10 Unsafe Statements"
description: "18.10 Unsafe Statements from 18. Statements and Blocks of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "statements-and-blocks"
specSection: "1810-unsafe-statements"
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

## 18.10 Unsafe Statements

### 18.10.1 Syntax

```text
unsafe_block ::= "unsafe" block_expr
```

### 18.10.2 Parsing

**(Parse-Unsafe-Block)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{unsafe})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ b) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStmtCore}(P)\ \Downarrow \ (P_{1},\ \operatorname{UnsafeBlockStmt}(b))
\end{array}
$$

### 18.10.3 AST Representation / Form

UnsafeBlockStmt(block)

### 18.10.4 Static Semantics

**(T-UnsafeStmt)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ b\ :\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{UnsafeBlockStmt}(b)\ \Rightarrow \ \Gamma \ \triangleright \ \langle [],\ [],\ \mathsf{false}\rangle 
\end{array}
$$

**(B-UnsafeStmt)** and **(Prov-UnsafeStmt)** define binding-state and provenance behavior for unsafe statement blocks.

Unsafe-required operation diagnostics are owned by the constructs that require them, including packed-field references, `transmute`, raw allocator operations, unchecked region operations, and `extern` calls.

### 18.10.5 Dynamic Semantics

**(ExecSigma-UnsafeStmt)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(b,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{UnsafeBlockStmt}(b),\ \sigma )\ \Downarrow \ (\operatorname{StmtOutOf}(\mathsf{out}),\ \sigma_{1} )
\end{array}
$$

### 18.10.6 Lowering

**(Lower-Stmt-UnsafeBlock)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerBlock}(\mathsf{block})\ \Downarrow \ \langle \mathsf{IR}_{b},\ v\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{UnsafeBlockStmt}(\mathsf{block}))\ \Downarrow \ \mathsf{IR}_{b}
\end{array}
$$

### 18.10.7 Diagnostics

No additional named diagnostics are introduced for the `unsafe` statement form itself. Diagnostics for unsafe-required operations remain owned by the specific construct being used.
