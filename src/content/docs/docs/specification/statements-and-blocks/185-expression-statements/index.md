---
title: "18.5 Expression Statements"
description: "18.5 Expression Statements from 18. Statements and Blocks of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "statements-and-blocks"
specSection: "185-expression-statements"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/statements-and-blocks/">18. Statements and Blocks</a>
  <span>Statements and Blocks</span>
</div>

## 18.5 Expression Statements

### 18.5.1 Syntax

```text
expr_stmt ::= expression terminator
```

### 18.5.2 Parsing

**(Parse-Expr-Stmt)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseExpr}(P)\ \Downarrow \ (P_{1},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStmtCore}(P)\ \Downarrow \ (P_{1},\ \operatorname{ExprStmt}(e))
\end{array}
$$

### 18.5.3 AST Representation / Form

ExprStmt(expr)

### 18.5.4 Static Semantics

**(T-ExprStmt)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{ExprStmt}(e)\ \Rightarrow \ \Gamma \ \triangleright \ \langle [],\ [],\ \mathsf{false}\rangle 
\end{array}
$$

**(B-ExprStmt)** and **(Prov-ExprStmt)** define binding-state and provenance preservation for expression statements.

### 18.5.5 Dynamic Semantics

**(ExecSigma-ExprStmt)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{ExprStmt}(e),\ \sigma )\ \Downarrow \ (\operatorname{StmtOutOf}(\mathsf{out}),\ \sigma_{1} )
\end{array}
$$

### 18.5.6 Lowering

**(Lower-Stmt-Expr)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(\mathsf{expr})\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{ExprStmt}(\mathsf{expr}))\ \Downarrow \ \mathsf{IR}_{e}
\end{array}
$$

### 18.5.7 Diagnostics

No additional named diagnostics are introduced for expression statements beyond the diagnostics of the contained expression and the required terminator diagnostics of §18.1.7.
