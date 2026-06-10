---
title: "18.9 Control-Transfer Statements"
description: "18.9 Control-Transfer Statements from 18. Statements and Blocks of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "statements-and-blocks"
specSection: "189-control-transfer-statements"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/statements-and-blocks/">18. Statements and Blocks</a>
  <span>Statements and Blocks</span>
</div>

## 18.9 Control-Transfer Statements

### 18.9.1 Syntax

```text
return_stmt   ::= "return" expression? terminator?
break_stmt    ::= "break" expression? terminator?
continue_stmt ::= "continue" terminator?
```

### 18.9.2 Parsing

**(Parse-Return-Stmt)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{return})\quad \Gamma \ \vdash \ \operatorname{ParseExprOpt}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStmtCore}(P)\ \Downarrow \ (P_{1},\ \operatorname{ReturnStmt}(e_{\mathsf{opt}}))
\end{array}
$$

**(Parse-Break-Stmt)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{break})\quad \Gamma \ \vdash \ \operatorname{ParseExprOpt}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStmtCore}(P)\ \Downarrow \ (P_{1},\ \operatorname{BreakStmt}(e_{\mathsf{opt}}))
\end{array}
$$

**(Parse-Continue-Stmt)**
IsKw(Tok(P), `continue`)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStmtCore}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \mathsf{ContinueStmt})
\end{array}
$$

### 18.9.3 AST Representation / Form

ReturnStmt(expr_opt)
BreakStmt(expr_opt)
ContinueStmt

### 18.9.4 Static Semantics

$$
\begin{array}{l}
\operatorname{ReturnDestExpr}(e)\ = \\[0.16em]
\ \{\ \operatorname{CopyExpr}(\operatorname{CopyInner}(e))\quad \mathsf{if}\ \operatorname{IsCopyExpr}(e) \\[0.16em]
\quad \operatorname{MoveExpr}(e)\quad \mathsf{if}\ \operatorname{IsPlace}(e) \\[0.16em]
\quad e\quad \mathsf{otherwise}\ \}
\end{array}
$$

`ReturnDestExpr` is the static ownership-destination view of a return expression. `EvalReturnDest` and `LowerReturnDest` implement the same view dynamically and in IR: a returned owned place transfers its provenance/allocation domain to the return destination, a fresh expression materializes directly in that destination, and `copy` first creates a duplicate domain that becomes the returned owner.

**(T-Return-Value)**

$$
\begin{array}{l}
R_{b}\ =\ \operatorname{BodyReturnType}(R)\quad \Gamma ;\ R;\ L\ \vdash \ \operatorname{ReturnDestExpr}(e)\ \Leftarrow \ R_{b}\ \dashv \ \emptyset \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{ReturnStmt}(e)\ \Rightarrow \ \Gamma \ \triangleright \ \langle [],\ [],\ \mathsf{false}\rangle
\end{array}
$$

**(T-Return-Unit)**

$$
\begin{array}{l}
R_{b}\ =\ \operatorname{BodyReturnType}(R)\quad R_{b}\ =\ \operatorname{TypePrim}(\texttt{"()"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{ReturnStmt}(\bot )\ \Rightarrow \ \Gamma \ \triangleright \ \langle [],\ [],\ \mathsf{false}\rangle
\end{array}
$$

**(Return-Async-Type-Err)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle \quad \Gamma ;\ R;\ L\ \vdash \ \operatorname{ReturnDestExpr}(e)\ :\ T\quad \lnot (\Gamma \ \vdash \ T\ \mathrel{<:} \ \mathsf{Result})\quad c\ =\ \operatorname{Code}(\mathsf{Return}-\mathsf{Async}-\mathsf{Type}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{ReturnStmt}(e)\ \Uparrow \ c
\end{array}
$$

**(Return-Async-Unit-Err)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle \quad \mathsf{Result}\ \ne \ \operatorname{TypePrim}(\texttt{"()"})\quad c\ =\ \operatorname{Code}(\mathsf{Return}-\mathsf{Async}-\mathsf{Unit}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{ReturnStmt}(\bot )\ \Uparrow \ c
\end{array}
$$

**(Return-Type-Err)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \bot \quad \Gamma ;\ R;\ L\ \vdash \ \operatorname{ReturnDestExpr}(e)\ :\ T\quad R_{b}\ =\ \operatorname{BodyReturnType}(R)\quad \lnot (\Gamma \ \vdash \ T\ \mathrel{<:} \ R_{b})\quad c\ =\ \operatorname{Code}(\mathsf{Return}-\mathsf{Type}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{ReturnStmt}(e)\ \Uparrow \ c
\end{array}
$$

**(Return-Unit-Err)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \bot \quad R_{b}\ =\ \operatorname{BodyReturnType}(R)\quad R_{b}\ \ne \ \operatorname{TypePrim}(\texttt{"()"})\quad c\ =\ \operatorname{Code}(\mathsf{Return}-\mathsf{Type}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{ReturnStmt}(\bot )\ \Uparrow \ c
\end{array}
$$

**(T-Break-Value)**

$$
\begin{array}{l}
L\ =\ \texttt{loop}\quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{BreakStmt}(e)\ \Rightarrow \ \Gamma \ \triangleright \ \langle [],\ [T],\ \mathsf{false}\rangle
\end{array}
$$

**(T-Break-Unit)**
L = `loop`

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{BreakStmt}(\bot )\ \Rightarrow \ \Gamma \ \triangleright \ \langle [],\ [],\ \mathsf{true}\rangle
\end{array}
$$

**(Break-Outside-Loop)**

$$
\begin{array}{l}
L\ \ne \ \texttt{loop}\quad c\ =\ \operatorname{Code}(\mathsf{Break}-\mathsf{Outside}-\mathsf{Loop}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{BreakStmt}(\_)\ \Uparrow \ c
\end{array}
$$

**(T-Continue)**
L = `loop`

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \mathsf{ContinueStmt}\ \Rightarrow \ \Gamma \ \triangleright \ \langle [],\ [],\ \mathsf{false}\rangle
\end{array}
$$

**(Continue-Outside-Loop)**

$$
\begin{array}{l}
L\ \ne \ \texttt{loop}\quad c\ =\ \operatorname{Code}(\mathsf{Continue}-\mathsf{Outside}-\mathsf{Loop}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \mathsf{ContinueStmt}\ \Uparrow \ c
\end{array}
$$

**(B-Return)**, **(B-Return-Unit)**, **(B-Break)**, **(B-Break-Unit)**, and **(B-Continue)** define binding-state effects for control transfer.

**(Prov-Return)**, **(Prov-Return-Unit)**, **(Prov-Break)**, **(Prov-Break-Unit)**, and **(Prov-Continue)** define the corresponding provenance effects.

### 18.9.5 Dynamic Semantics

**(ExecSigma-Return)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalReturnDest}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{ReturnStmt}(e),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{Return}(v)),\ \sigma_{1} )
\end{array}
$$

**(ExecSigma-Return-Unit)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{ReturnStmt}(\bot ),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{Return}(())),\ \sigma )
\end{array}
$$

**(ExecSigma-Return-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalReturnDest}(e,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{ReturnStmt}(e),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(ExecSigma-Break)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{BreakStmt}(e),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{Break}(v)),\ \sigma_{1} )
\end{array}
$$

**(ExecSigma-Break-Unit)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{BreakStmt}(\bot ),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{Break}(\bot )),\ \sigma )
\end{array}
$$

**(ExecSigma-Break-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{BreakStmt}(e),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(ExecSigma-Continue)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\mathsf{ContinueStmt},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Continue}),\ \sigma )
\end{array}
$$

### 18.9.6 Lowering

**(Lower-Stmt-Return)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerReturnDest}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{ReturnStmt}(e))\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{e},\ \operatorname{ReturnIR}(v))
\end{array}
$$

**(Lower-Stmt-Return-Unit)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{ReturnStmt}(\bot ))\ \Downarrow \ \operatorname{ReturnIR}(())
\end{array}
$$

**(Lower-Stmt-Break)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{BreakStmt}(e))\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{e},\ \operatorname{BreakIR}(v))
\end{array}
$$

**(Lower-Stmt-Break-Unit)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{BreakStmt}(\bot ))\ \Downarrow \ \operatorname{BreakIR}(\bot )
\end{array}
$$

**(Lower-Stmt-Continue)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\mathsf{ContinueStmt})\ \Downarrow \ \mathsf{ContinueIR}
\end{array}
$$

For control-flow statements, the lowering MUST emit temporary cleanup immediately before the control transfer:

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{ReturnStmt}(e))\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{e},\ \operatorname{TempCleanupIR}(s\ \setminus \ \operatorname{ReturnedOwner}(e)),\ \operatorname{ReturnIR}(v)) \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{BreakStmt}(e))\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{e},\ \operatorname{TempCleanupIR}(s),\ \operatorname{BreakIR}(v)) \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{BreakStmt}(\bot ))\ \Downarrow \ \operatorname{SeqIR}(\operatorname{TempCleanupIR}(s),\ \operatorname{BreakIR}(\bot )) \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\mathsf{ContinueStmt})\ \Downarrow \ \operatorname{SeqIR}(\operatorname{TempCleanupIR}(s),\ \mathsf{ContinueIR})
\end{array}
$$

### 18.9.7 Diagnostics

Diagnostics are defined for return type mismatch, invalid async return type, `break` outside `loop`, `continue` outside `loop`, and `return` at module scope.
