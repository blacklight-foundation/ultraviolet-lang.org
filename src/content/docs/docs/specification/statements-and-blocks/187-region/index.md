---
title: "18.7 Region"
description: "18.7 Region from 18. Statements and Blocks of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "statements-and-blocks"
specSection: "187-region"
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

## 18.7 Region

### 18.7.1 Syntax

```text
region_stmt  ::= "region" region_opts? region_alias? block_expr
region_opts  ::= "(" expression ")"
region_alias ::= "as" identifier
```

### 18.7.2 Parsing

**(Parse-Region-Opts-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRegionOptsOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-Region-Opts-Some)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e)\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{")"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRegionOptsOpt}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ e)
\end{array}
$$

**(Parse-Region-Alias-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{as}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRegionAliasOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-Region-Alias-Some)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{as})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{name}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRegionAliasOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{name})
\end{array}
$$

**(Parse-Region-Stmt)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{region})\quad \Gamma \ \vdash \ \operatorname{ParseRegionOptsOpt}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{opts}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseRegionAliasOpt}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{alias}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(P_{2})\ \Downarrow \ (P_{3},\ b) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStmtCore}(P)\ \Downarrow \ (P_{3},\ \operatorname{RegionStmt}(\mathsf{opts}_{\mathsf{opt}},\ \mathsf{alias}_{\mathsf{opt}},\ b))
\end{array}
$$

### 18.7.3 AST Representation / Form

RegionStmt(opts_opt, alias_opt, block)

$$
\begin{array}{l}
\operatorname{RegionActiveType}(T)\ \Leftrightarrow \ \operatorname{StripPerm}(T)\ =\ \operatorname{TypeModalState}([\texttt{Region}],\ \texttt{Active}) \\[0.16em]
\operatorname{FreshRegion}(\Gamma )\ \in \ \mathsf{Name}\ \setminus \ \operatorname{dom}(\Gamma )
\end{array}
$$

$$
\begin{array}{l}
\operatorname{RegionOptsExpr}(\bot )\ =\ \operatorname{Call}(\operatorname{Identifier}(\texttt{RegionOptions}),\ []) \\[0.16em]
\operatorname{RegionOptsExpr}(e)\ =\ e\quad \mathsf{if}\ e\ \ne \ \bot 
\end{array}
$$

### 18.7.4 Static Semantics

$$
\begin{array}{l}
\operatorname{RegionBind}(\Gamma ,\ \mathsf{alias}_{\mathsf{opt}})\ =\ \Gamma_{r} \ \Leftrightarrow \ r\ = \\[0.16em]
\ \{\ \mathsf{alias}_{\mathsf{opt}}\quad \mathsf{if}\ \mathsf{alias}_{\mathsf{opt}}\ \ne \ \bot  \\[0.16em]
\quad \operatorname{FreshRegion}(\Gamma )\quad \mathsf{otherwise}\ \}\ \land \ \operatorname{IntroAll}(\Gamma ,\ [\langle r,\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}([\texttt{Region}],\ \texttt{Active}))\rangle ])\ \Downarrow \ \Gamma_{r} 
\end{array}
$$

**(T-RegionStmt)**

$$
\begin{array}{l}
\operatorname{RegionOptsExpr}(\mathsf{opts}_{\mathsf{opt}})\ =\ \mathsf{opts}\quad \Gamma ;\ R;\ L\ \vdash \ \mathsf{opts}\ \Leftarrow \ \operatorname{TypePath}([\texttt{RegionOptions}])\ \dashv \ \emptyset \quad \operatorname{RegionBind}(\Gamma ,\ \mathsf{alias}_{\mathsf{opt}})\ =\ \Gamma_{r} \quad \Gamma_{r} ;\ R;\ L\ \vdash \ b\ :\ T_{b} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{RegionStmt}(\mathsf{opts}_{\mathsf{opt}},\ \mathsf{alias}_{\mathsf{opt}},\ b)\ \Rightarrow \ \Gamma \ \triangleright \ \langle [],\ [],\ \mathsf{false}\rangle 
\end{array}
$$

If alias_opt = ⊥, the identifier produced for the region binding MUST be treated as synthetic. It MUST NOT be introduced by name resolution and MUST NOT be referenced by user code.

**(B-RegionStmt)** introduces the region binding into a fresh local scope and pushes the corresponding permission scope.

**(Prov-RegionStmt)** introduces the region provenance tag and pushes `⟨r, r⟩` onto the runtime region stack relation.

### 18.7.5 Dynamic Semantics

$$
\begin{array}{l}
\operatorname{BindRegionAlias}(\sigma ,\ \bot ,\ r)\ \Downarrow \ \sigma  \\[0.16em]
\operatorname{BindRegionAlias}(\sigma ,\ x,\ r)\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{BindVal}(\sigma ,\ x,\ \operatorname{RegionValue}(\texttt{@Active},\ r))\ \Downarrow \ (\sigma ',\ b)
\end{array}
$$

**(ExecSigma-Region)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{opts},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{o}),\ \sigma_{1} )\quad \operatorname{RegionNew}(\sigma_{1} ,\ v_{o})\ \Downarrow \ (\sigma_{2} ,\ r,\ \mathsf{scope})\quad \operatorname{BindRegionAlias}(\sigma_{2} ,\ \mathsf{alias}_{\mathsf{opt}},\ r)\ \Downarrow \ \sigma_{3} \quad \Gamma \ \vdash \ \operatorname{EvalInScopeSigma}(b,\ \sigma_{3} ,\ \mathsf{scope})\ \Downarrow \ (\mathsf{out},\ \sigma_{4} )\quad \operatorname{RegionRelease}(\sigma_{4} ,\ r,\ \mathsf{scope},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma_{5} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{RegionStmt}(\mathsf{opts}_{\mathsf{opt}},\ \mathsf{alias}_{\mathsf{opt}},\ b),\ \sigma )\ \Downarrow \ (\operatorname{StmtOutOf}(\mathsf{out}'),\ \sigma_{5} )
\end{array}
$$

**(ExecSigma-Region-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{opts},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{RegionStmt}(\mathsf{opts}_{\mathsf{opt}},\ \mathsf{alias}_{\mathsf{opt}},\ b),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

$$
\operatorname{RegionRelease}(\Sigma ,\ r,\ \mathsf{scope},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \Sigma ')\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{CleanupScope}(\mathsf{scope},\ \Sigma )\ \Downarrow \ (c,\ \Sigma_{1} )\ \land \ \mathsf{out}'\ =\ \operatorname{ExitOutcome}(\mathsf{out},\ c)\ \land \ ((\mathsf{out}'\ =\ \operatorname{Ctrl}(\mathsf{Abort})\ \land \ \Sigma '\ =\ \Sigma_{1} )\ \lor \ (\mathsf{out}'\ \ne \ \operatorname{Ctrl}(\mathsf{Abort})\ \land \ \operatorname{ReleaseArena}(\Sigma_{1} ,\ r)\ \Downarrow \ \Sigma_{2} \ \land \ \mathsf{PopScope}\_\sigma (\Sigma_{2} )\ \Downarrow \ (\Sigma ',\ \mathsf{scope})))
$$

**(Step-Exec-Region-Enter)**

$$
\begin{array}{l}
\mathsf{opts}\ =\ \operatorname{RegionOptsExpr}(\mathsf{opts}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{opts},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{o}),\ \sigma_{1} )\quad \operatorname{RegionNew}(\sigma_{1} ,\ v_{o})\ \Downarrow \ (\sigma_{2} ,\ r,\ \mathsf{scope})\quad \operatorname{BindRegionAlias}(\sigma_{2} ,\ \mathsf{alias}_{\mathsf{opt}},\ r)\ \Downarrow \ \sigma_{3}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Exec}(\operatorname{RegionStmt}(\mathsf{opts}_{\mathsf{opt}},\ \mathsf{alias}_{\mathsf{opt}},\ b),\ \sigma )\rangle \ \to \ \langle \operatorname{RegionBody}(r,\ \mathsf{scope},\ b,\ \sigma_{3} )\rangle 
\end{array}
$$

**(Step-Exec-Region-Enter-Ctrl)**

$$
\begin{array}{l}
\mathsf{opts}\ =\ \operatorname{RegionOptsExpr}(\mathsf{opts}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{opts},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Exec}(\operatorname{RegionStmt}(\mathsf{opts}_{\mathsf{opt}},\ \mathsf{alias}_{\mathsf{opt}},\ b),\ \sigma )\rangle \ \to \ \langle \operatorname{ExecCtrl}(\kappa ,\ \sigma_{1} )\rangle 
\end{array}
$$

**(Step-Exec-Region-Body)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalInScopeSigma}(b,\ \sigma ,\ \mathsf{scope})\ \Downarrow \ (\mathsf{out},\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{RegionBody}(r,\ \mathsf{scope},\ b,\ \sigma )\rangle \ \to \ \langle \operatorname{RegionExit}(r,\ \mathsf{scope},\ \mathsf{out},\ \sigma_{1} )\rangle 
\end{array}
$$

**(Step-Exec-Region-Exit-Ok)**

$$
\begin{array}{l}
\operatorname{RegionRelease}(\sigma ,\ r,\ \mathsf{scope},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma ')\quad \operatorname{StmtOutOf}(\mathsf{out}')\ =\ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{RegionExit}(r,\ \mathsf{scope},\ \mathsf{out},\ \sigma )\rangle \ \to \ \langle \operatorname{ExecDone}(\sigma ')\rangle 
\end{array}
$$

**(Step-Exec-Region-Exit-Ctrl)**

$$
\begin{array}{l}
\operatorname{RegionRelease}(\sigma ,\ r,\ \mathsf{scope},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma ')\quad \operatorname{StmtOutOf}(\mathsf{out}')\ =\ \operatorname{Ctrl}(\kappa ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{RegionExit}(r,\ \mathsf{scope},\ \mathsf{out},\ \sigma )\rangle \ \to \ \langle \operatorname{ExecCtrl}(\kappa ,\ \sigma ')\rangle 
\end{array}
$$

### 18.7.6 Lowering

**(Lower-Stmt-Region)**

$$
\begin{array}{l}
\mathsf{opts}\ =\ \operatorname{RegionOptsExpr}(\mathsf{opts}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{LowerExpr}(\mathsf{opts})\ \Downarrow \ \langle \mathsf{IR}_{o},\ v_{o}\rangle \quad \Gamma \ \vdash \ \operatorname{LowerBlock}(\mathsf{block})\ \Downarrow \ \langle \mathsf{IR}_{b},\ v_{b}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{RegionStmt}(\mathsf{opts}_{\mathsf{opt}},\ \mathsf{alias}_{\mathsf{opt}},\ \mathsf{block}))\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{o},\ \operatorname{RegionIR}(v_{o},\ \mathsf{alias}_{\mathsf{opt}},\ \mathsf{IR}_{b},\ v_{b}))
\end{array}
$$

### 18.7.7 Diagnostics

No additional named diagnostics are introduced specifically for `region` statements beyond the diagnostics of the options expression, the enclosed block, and the region operations they trigger.
