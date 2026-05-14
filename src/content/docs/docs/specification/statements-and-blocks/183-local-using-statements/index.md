---
title: "18.3 Local Using Statements"
description: "18.3 Local Using Statements from 18. Statements and Blocks of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "statements-and-blocks"
specSection: "183-local-using-statements"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/statements-and-blocks/">18. Statements and Blocks</a>
  <span>Statements and Blocks</span>
</div>

## 18.3 Local Using Statements

### 18.3.1 Syntax

```text
using_local_stmt ::= "using" identifier "as" identifier terminator
```

### 18.3.2 Parsing

**(Parse-UsingLocal-Stmt)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{using})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{source})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{as})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{alias})\quad s\ =\ \operatorname{UsingLocalStmt}(\mathsf{source},\ \mathsf{alias},\ \operatorname{SpanBetween}(P,\ P_{2})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStmtCore}(P)\ \Downarrow \ (P_{2},\ s)
\end{array}
$$

### 18.3.3 AST Representation / Form

UsingLocalStmt(source, alias, span)

### 18.3.4 Static Semantics

Evaluation of a `UsingLocalStmt` extends the environment via the `UsingAlias` judgment defined in §7.2:

**(T-UsingLocalStmt)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{UsingAlias}(\mathsf{source},\ \mathsf{alias})\ \Downarrow \ \Gamma ' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{UsingLocalStmt}(\mathsf{source},\ \mathsf{alias},\ \_)\ \Rightarrow \ \Gamma '
\end{array}
$$

**(T-UsingLocalStmt-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{UsingAlias}(\mathsf{source},\ \mathsf{alias})\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{UsingLocalStmt}(\mathsf{source},\ \mathsf{alias},\ \_)\ \Uparrow \ c
\end{array}
$$

The alias introduces no new storage; the `Entity` stored under `alias` is the identical `Entity` to which `source` resolves. Aliasing an alias resolves through to the original `Entity`.

### 18.3.5 Dynamic Semantics

**(ExecSigma-UsingLocal)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{UsingLocalStmt}(\_,\ \_,\ \_),\ \sigma )\ \Downarrow \ (\mathsf{ok},\ \sigma )
\end{array}
$$

A `UsingLocalStmt` has no runtime effect: name resolution is compile-time only.

### 18.3.6 Lowering

**(Lower-Stmt-UsingLocal)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{UsingLocalStmt}(\_,\ \_,\ \_))\ \Downarrow \ \mathsf{NoOpIR}
\end{array}
$$

`using` statements produce no runtime IR; they are consumed entirely during resolution.

### 18.3.7 Diagnostics

Diagnostics are defined for duplicate alias names (alias already in any scope), unresolved source names, and use of reserved names as aliases. See §7.2 `Using-Alias-*` rules.
