---
title: "18.8 Frame"
description: "18.8 Frame from 18. Statements and Blocks of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "statements-and-blocks"
specSection: "188-frame"
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

## 18.8 Frame

### 18.8.1 Syntax

```text
frame_stmt ::= "frame" block_expr | identifier "." "frame" block_expr
```

### 18.8.2 Parsing

**(Parse-Frame-Stmt)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{frame})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ b) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStmtCore}(P)\ \Downarrow \ (P_{1},\ \operatorname{FrameStmt}(\bot ,\ b))
\end{array}
$$

**(Parse-Frame-Explicit)**

$$
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"."})\quad \operatorname{IsKw}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))),\ \texttt{frame})\quad \mathsf{name}\ =\ \operatorname{Lexeme}(\operatorname{Tok}(P))\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P))))\ \Downarrow \ (P_{1},\ b) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStmtCore}(P)\ \Downarrow \ (P_{1},\ \operatorname{FrameStmt}(\mathsf{name},\ b))
\end{array}
$$

### 18.8.3 AST Representation / Form

FrameStmt(target_opt, block)

$$
\begin{array}{l}
\operatorname{InnermostActiveRegion}([])\ =\ \bot  \\[0.16em]
\operatorname{InnermostActiveRegion}([\sigma ]\ \mathbin{++} \ \Gamma ')\ = \\[0.16em]
\ \{\ r\quad \mathsf{if}\ \exists \ r.\ r\ \in \ \operatorname{dom}(\sigma )\ \land \ \operatorname{RegionActiveType}(\sigma [r]) \\[0.16em]
\quad \operatorname{InnermostActiveRegion}(\Gamma ')\ \mathsf{otherwise}\ \}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{FrameBind}(\Gamma ,\ \mathsf{target}_{\mathsf{opt}})\ =\ \Gamma_{f} \ \Leftrightarrow \ r\ = \\[0.16em]
\ \{\ \operatorname{InnermostActiveRegion}(\Gamma )\quad \mathsf{if}\ \mathsf{target}_{\mathsf{opt}}\ =\ \bot  \\[0.16em]
\quad \mathsf{target}_{\mathsf{opt}}\quad \mathsf{if}\ \mathsf{target}_{\mathsf{opt}}\ \ne \ \bot \ \land \ \Gamma ;\ R;\ L\ \vdash \ \operatorname{Identifier}(\mathsf{target}_{\mathsf{opt}})\ :\ T_{r}\ \land \ \operatorname{RegionActiveType}(T_{r})\ \}\ \land \ F\ =\ \operatorname{FreshRegion}(\Gamma )\ \land \ \operatorname{IntroAll}(\Gamma ,\ [\langle F,\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}([\texttt{Region}],\ \texttt{Active}))\rangle ])\ \Downarrow \ \Gamma_{f} 
\end{array}
$$

### 18.8.4 Static Semantics

**(T-FrameStmt-Implicit)**

$$
\begin{array}{l}
\operatorname{FrameBind}(\Gamma ,\ \bot )\ =\ \Gamma_{f} \quad \Gamma_{f} ;\ R;\ L\ \vdash \ b\ :\ T_{b} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{FrameStmt}(\bot ,\ b)\ \Rightarrow \ \Gamma \ \triangleright \ \langle [],\ [],\ \mathsf{false}\rangle 
\end{array}
$$

**(T-FrameStmt-Explicit)**

$$
\begin{array}{l}
\operatorname{FrameBind}(\Gamma ,\ r)\ =\ \Gamma_{f} \quad \Gamma_{f} ;\ R;\ L\ \vdash \ b\ :\ T_{b} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{FrameStmt}(r,\ b)\ \Rightarrow \ \Gamma \ \triangleright \ \langle [],\ [],\ \mathsf{false}\rangle 
\end{array}
$$

**(Frame-NoActiveRegion-Err)**

$$
\begin{array}{l}
\operatorname{InnermostActiveRegion}(\Gamma )\ \mathsf{undefined}\quad c\ =\ \operatorname{Code}(\mathsf{Frame}-\mathsf{NoActiveRegion}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{FrameStmt}(\bot ,\ b)\ \Uparrow \ c
\end{array}
$$

**(Frame-Target-NotActive-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Identifier}(r)\ :\ T_{r}\quad \lnot \ \operatorname{RegionActiveType}(T_{r})\quad c\ =\ \operatorname{Code}(\mathsf{Frame}-\mathsf{Target}-\mathsf{NotActive}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{FrameStmt}(r,\ b)\ \Uparrow \ c
\end{array}
$$

FrameBind introduces a fresh synthetic region identifier `F` with the same synthetic-binding restriction as the anonymous `region` binding. `F` is used only for provenance assignment.

**(B-FrameStmt)** pushes a fresh scope, introduces `FrameBindInfo(Γ)`, and evaluates the body in that scope.

**(Prov-FrameStmt)** pushes `⟨F, r⟩` on the runtime region stack relation, where `r` is the resolved target.

### 18.8.5 Dynamic Semantics

$$
\begin{array}{l}
\operatorname{ActiveTarget}(\sigma )\ =\ \mathsf{target}\ \Leftrightarrow \ \operatorname{ActiveEntry}(\sigma )\ =\ e\ \land \ \operatorname{RegionTargetOf}(e)\ =\ \mathsf{target} \\[0.16em]
\operatorname{ResolveTarget}(\sigma ,\ r)\ =\ \mathsf{target}\ \Leftrightarrow \ \operatorname{ResolveEntry}(\operatorname{RegionStack}(\sigma ),\ r)\ =\ e\ \land \ \operatorname{RegionTargetOf}(e)\ =\ \mathsf{target}
\end{array}
$$

$$
\operatorname{FrameEnter}(\sigma ,\ r)\ \Downarrow \ (\sigma ',\ F,\ \mathsf{scope},\ \mathsf{mark})\ \Leftrightarrow \ \mathsf{PushScope}\_\sigma (\sigma )\ \Downarrow \ (\sigma_{1} ,\ \mathsf{scope})\ \land \ F\ =\ \operatorname{FreshTag}(\sigma )\ \land \ \mathsf{mark}\ =\ \operatorname{FrameMark}(\sigma_{1} ,\ r)\ \land \ \operatorname{UpdateRegionStack}(\sigma_{1} ,\ \langle F,\ r,\ \mathsf{scope},\ \mathsf{mark}\rangle \ \mathbin{::} \ \operatorname{RegionStack}(\sigma_{1} ))\ =\ \sigma '
$$

**(ExecSigma-Frame-Implicit)**

$$
\begin{array}{l}
\operatorname{ActiveTarget}(\sigma )\ =\ r\quad \operatorname{FrameEnter}(\sigma ,\ r)\ \Downarrow \ (\sigma_{1} ,\ F,\ \mathsf{scope},\ \mathsf{mark})\quad \Gamma \ \vdash \ \operatorname{EvalInScopeSigma}(b,\ \sigma_{1} ,\ \mathsf{scope})\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )\quad \operatorname{FrameReset}(\sigma_{2} ,\ r,\ \mathsf{scope},\ \mathsf{mark},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{FrameStmt}(\bot ,\ b),\ \sigma )\ \Downarrow \ (\operatorname{StmtOutOf}(\mathsf{out}'),\ \sigma_{3} )
\end{array}
$$

**(ExecSigma-Frame-Explicit)**

$$
\begin{array}{l}
\operatorname{LookupVal}(\sigma ,\ r)\ =\ v_{r}\quad \operatorname{RegionHandleOf}(v_{r})\ =\ h\quad \operatorname{ResolveTarget}(\sigma ,\ h)\ =\ r_{t}\quad \operatorname{FrameEnter}(\sigma ,\ r_{t})\ \Downarrow \ (\sigma_{1} ,\ F,\ \mathsf{scope},\ \mathsf{mark})\quad \Gamma \ \vdash \ \operatorname{EvalInScopeSigma}(b,\ \sigma_{1} ,\ \mathsf{scope})\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )\quad \operatorname{FrameReset}(\sigma_{2} ,\ r_{t},\ \mathsf{scope},\ \mathsf{mark},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{FrameStmt}(r,\ b),\ \sigma )\ \Downarrow \ (\operatorname{StmtOutOf}(\mathsf{out}'),\ \sigma_{3} )
\end{array}
$$

$$
\operatorname{FrameReset}(\Sigma ,\ r,\ \mathsf{scope},\ \mathsf{mark},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \Sigma ')\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{CleanupScope}(\mathsf{scope},\ \Sigma )\ \Downarrow \ (c,\ \Sigma_{1} )\ \land \ \mathsf{out}'\ =\ \operatorname{ExitOutcome}(\mathsf{out},\ c)\ \land \ ((\mathsf{out}'\ =\ \operatorname{Ctrl}(\mathsf{Abort})\ \land \ \Sigma '\ =\ \Sigma_{1} )\ \lor \ (\mathsf{out}'\ \ne \ \operatorname{Ctrl}(\mathsf{Abort})\ \land \ \operatorname{ResetArena}(\Sigma_{1} ,\ r,\ \mathsf{scope},\ \mathsf{mark})\ \Downarrow \ \Sigma_{2} \ \land \ \mathsf{PopScope}\_\sigma (\Sigma_{2} )\ \Downarrow \ (\Sigma ',\ \mathsf{scope})))
$$

**(Step-Exec-Frame-Enter-Implicit)**

$$
\begin{array}{l}
\operatorname{ActiveTarget}(\sigma )\ =\ r\quad \operatorname{FrameEnter}(\sigma ,\ r)\ \Downarrow \ (\sigma_{1} ,\ F,\ \mathsf{scope},\ \mathsf{mark}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Exec}(\operatorname{FrameStmt}(\bot ,\ b),\ \sigma )\rangle \ \to \ \langle \operatorname{FrameBody}(r,\ \mathsf{scope},\ \mathsf{mark},\ b,\ \sigma_{1} )\rangle 
\end{array}
$$

**(Step-Exec-Frame-Enter-Explicit)**

$$
\begin{array}{l}
\operatorname{LookupVal}(\sigma ,\ r)\ =\ v_{r}\quad \operatorname{RegionHandleOf}(v_{r})\ =\ h\quad \operatorname{ResolveTarget}(\sigma ,\ h)\ =\ r_{t}\quad \operatorname{FrameEnter}(\sigma ,\ r_{t})\ \Downarrow \ (\sigma_{1} ,\ F,\ \mathsf{scope},\ \mathsf{mark}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Exec}(\operatorname{FrameStmt}(r,\ b),\ \sigma )\rangle \ \to \ \langle \operatorname{FrameBody}(r_{t},\ \mathsf{scope},\ \mathsf{mark},\ b,\ \sigma_{1} )\rangle 
\end{array}
$$

**(Step-Exec-Frame-Body)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalInScopeSigma}(b,\ \sigma ,\ \mathsf{scope})\ \Downarrow \ (\mathsf{out},\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{FrameBody}(r,\ \mathsf{scope},\ \mathsf{mark},\ b,\ \sigma )\rangle \ \to \ \langle \operatorname{FrameExit}(r,\ \mathsf{scope},\ \mathsf{mark},\ \mathsf{out},\ \sigma_{1} )\rangle 
\end{array}
$$

**(Step-Exec-Frame-Exit-Ok)**

$$
\begin{array}{l}
\operatorname{FrameReset}(\sigma ,\ r,\ \mathsf{scope},\ \mathsf{mark},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma ')\quad \operatorname{StmtOutOf}(\mathsf{out}')\ =\ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{FrameExit}(r,\ \mathsf{scope},\ \mathsf{mark},\ \mathsf{out},\ \sigma )\rangle \ \to \ \langle \operatorname{ExecDone}(\sigma ')\rangle 
\end{array}
$$

**(Step-Exec-Frame-Exit-Ctrl)**

$$
\begin{array}{l}
\operatorname{FrameReset}(\sigma ,\ r,\ \mathsf{scope},\ \mathsf{mark},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma ')\quad \operatorname{StmtOutOf}(\mathsf{out}')\ =\ \operatorname{Ctrl}(\kappa ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{FrameExit}(r,\ \mathsf{scope},\ \mathsf{mark},\ \mathsf{out},\ \sigma )\rangle \ \to \ \langle \operatorname{ExecCtrl}(\kappa ,\ \sigma ')\rangle 
\end{array}
$$

### 18.8.6 Lowering

**(Lower-Stmt-Frame-Implicit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerBlock}(\mathsf{block})\ \Downarrow \ \langle \mathsf{IR}_{b},\ v_{b}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{FrameStmt}(\bot ,\ \mathsf{block}))\ \Downarrow \ \operatorname{FrameIR}(\bot ,\ \mathsf{IR}_{b},\ v_{b})
\end{array}
$$

**(Lower-Stmt-Frame-Explicit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{Identifier}(r))\ \Downarrow \ \langle \mathsf{IR}_{r},\ v_{r}\rangle \quad \Gamma \ \vdash \ \operatorname{LowerBlock}(\mathsf{block})\ \Downarrow \ \langle \mathsf{IR}_{b},\ v_{b}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{FrameStmt}(r,\ \mathsf{block}))\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{r},\ \operatorname{FrameIR}(v_{r},\ \mathsf{IR}_{b},\ v_{b}))
\end{array}
$$

### 18.8.7 Diagnostics

Diagnostics are defined for `frame` used with no active region in scope and for explicit frame targets that are not in `Region@Active` state.
