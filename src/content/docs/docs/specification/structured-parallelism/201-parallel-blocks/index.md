---
title: "20.1 Parallel Blocks"
description: "20.1 Parallel Blocks from 20. Structured Parallelism of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "structured-parallelism"
specSection: "201-parallel-blocks"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/structured-parallelism/">20. Structured Parallelism</a>
  <span>Structured Parallelism</span>
</div>

## 20.1 Parallel Blocks

### 20.1.1 Syntax

```text
parallel_block       ::= "parallel" domain_expr parallel_option_list? block
domain_expr          ::= expression
parallel_option_list ::= "[" parallel_option ("," parallel_option)* "]"
parallel_option      ::= "cancel" ":" expression
                       | "name" ":" string_literal
                       | "workgroup" ":" dim3_const
                       | "workgroups" ":" dim3_const
dim3_const           ::= "(" ct_usize_expr "," ct_usize_expr "," ct_usize_expr ")"
ct_usize_expr        ::= expression
```

### 20.1.2 Parsing

**(Parse-ParallelOpt-Cancel)**

$$
\begin{array}{l}
\operatorname{IsCtxIdent}(\operatorname{Tok}(P),\ \texttt{"cancel"})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseParallelOpt}(P)\ \Downarrow \ (P_{1},\ \operatorname{Cancel}(e))
\end{array}
$$

**(Parse-ParallelOpt-Name)**

$$
\begin{array}{l}
\operatorname{IsCtxIdent}(\operatorname{Tok}(P),\ \texttt{"name"})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{":"})\quad \operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))).\mathsf{kind}\ =\ \mathsf{StringLiteral}\quad s\ =\ \operatorname{StringValue}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P)))) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseParallelOpt}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P))),\ \operatorname{Name}(s))
\end{array}
$$

**(Parse-ParallelOpt-Workgroup)**

$$
\begin{array}{l}
\operatorname{IsCtxIdent}(\operatorname{Tok}(P),\ \texttt{"workgroup"})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseParallelOpt}(P)\ \Downarrow \ (P_{1},\ \operatorname{Workgroup}(e))
\end{array}
$$

**(Parse-ParallelOpt-Workgroups)**

$$
\begin{array}{l}
\operatorname{IsCtxIdent}(\operatorname{Tok}(P),\ \texttt{"workgroups"})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseParallelOpt}(P)\ \Downarrow \ (P_{1},\ \operatorname{Workgroups}(e))
\end{array}
$$

**(Parse-Parallel-Expr)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{"parallel"})\quad \Gamma \ \vdash \ \operatorname{ParseExpr_NoBrace}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{domain}) \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseOptListOpt}(\mathsf{ParseParallelOpt},\ P_{1})\ \Downarrow \ (P_{2},\ \mathsf{opts})\quad \Gamma \ \vdash \ \operatorname{ParseBlockExpr}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{body}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimaryExpr}(P)\ \Downarrow \ (P_{3},\ \operatorname{ParallelExpr}(\mathsf{domain},\ \mathsf{opts},\ \mathsf{body}))
\end{array}
$$

The option-list rules instantiate the shared schema of §5.5 with `El = ParseParallelOpt`. The `dim3_const` shape of `workgroup`/`workgroups` operands is validated by §20.1.4, not by the parser.

### 20.1.3 AST Representation / Form

$$
\mathsf{ParallelOpt}\ =\ \{\operatorname{Cancel}(\mathsf{expr}),\ \operatorname{Name}(\mathsf{str}),\ \operatorname{Workgroup}(\mathsf{dim3}),\ \operatorname{Workgroups}(\mathsf{dim3})\}
$$

$$
\mathsf{ParallelOpts}\ =\ [\mathsf{ParallelOpt}]
$$

$$
\mathsf{Expr}\ =\ \ldots \ \mid \ \operatorname{ParallelExpr}(\mathsf{domain},\ \mathsf{opts},\ \mathsf{body})\ \mid \ \ldots
$$

$$
\mathsf{ResolveParallelOptJudg}\ =\ \{\mathsf{ResolveParallelOpt},\ \mathsf{ResolveParallelOpts}\}
$$

ResolveParallelOpt is homomorphic on the option forms:

- If Γ ⊢ ResolveExpr(e) ⇓ e' then Γ ⊢ ResolveParallelOpt(Workgroup(e)) ⇓ Workgroup(e').
- If Γ ⊢ ResolveExpr(e) ⇓ e' then Γ ⊢ ResolveParallelOpt(Workgroups(e)) ⇓ Workgroups(e').

$$
\operatorname{ParallelOptExprs}([])\ =\ []
$$

$$
\operatorname{ParallelOptExprs}(\operatorname{Cancel}(e)\ \mathbin{::} \ \mathsf{os})\ =\ [e]\ \mathbin{++} \ \operatorname{ParallelOptExprs}(\mathsf{os})
$$

$$
\operatorname{ParallelOptExprs}(\operatorname{Name}(\_)\ \mathbin{::} \ \mathsf{os})\ =\ \operatorname{ParallelOptExprs}(\mathsf{os})
$$

$$
\operatorname{ParallelOptExprs}(\operatorname{Workgroup}(e)\ \mathbin{::} \ \mathsf{os})\ =\ [e]\ \mathbin{++} \ \operatorname{ParallelOptExprs}(\mathsf{os})
$$

$$
\operatorname{ParallelOptExprs}(\operatorname{Workgroups}(e)\ \mathbin{::} \ \mathsf{os})\ =\ [e]\ \mathbin{++} \ \operatorname{ParallelOptExprs}(\mathsf{os})
$$

### 20.1.4 Static Semantics

$$
\operatorname{BlockOptOk}(\operatorname{Name}(\_))\ \Leftrightarrow \ \mathsf{true}
$$

$$
\operatorname{BlockOptOk}(\operatorname{Cancel}(e))\ \Leftrightarrow \ G\ \vdash \ e\ :\ \operatorname{TypePath}([\texttt{"CancelToken"}])
$$

$$
\begin{array}{l}
G\ \vdash \ \operatorname{Dim3Const}((e_{1},\ e_{2},\ e_{3}))\ \Downarrow \ (x,\ y,\ z)\ \Leftrightarrow \\[0.16em]
\ G\ \vdash \ e_{1}\ :\ \operatorname{TypePrim}(\texttt{"usize"})\ \land \ G\ \vdash \ \operatorname{ConstLen}(e_{1})\ \Downarrow \ x\ \land \ x\ >\ 0\ \land \\[0.16em]
\ G\ \vdash \ e_{2}\ :\ \operatorname{TypePrim}(\texttt{"usize"})\ \land \ G\ \vdash \ \operatorname{ConstLen}(e_{2})\ \Downarrow \ y\ \land \ y\ >\ 0\ \land \\[0.16em]
\ G\ \vdash \ e_{3}\ :\ \operatorname{TypePrim}(\texttt{"usize"})\ \land \ G\ \vdash \ \operatorname{ConstLen}(e_{3})\ \Downarrow \ z\ \land \ z\ >\ 0
\end{array}
$$

**(Dim3Const-Err)**

$$
\begin{array}{l}
\lnot \exists \ \mathsf{dims}.\ G\ \vdash \ \operatorname{Dim3Const}(e)\ \Downarrow \ \mathsf{dims}\quad c\ =\ \operatorname{Code}(\mathsf{Dim3Const}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{Reject}
\end{array}
$$

$$
\operatorname{BlockOptOk}(\operatorname{Workgroup}(e))\ \Leftrightarrow \ \exists \ \mathsf{dims}.\ G\ \vdash \ \operatorname{Dim3Const}(e)\ \Downarrow \ \mathsf{dims}
$$

$$
\operatorname{BlockOptOk}(\operatorname{Workgroups}(e))\ \Leftrightarrow \ \exists \ \mathsf{dims}.\ G\ \vdash \ \operatorname{Dim3Const}(e)\ \Downarrow \ \mathsf{dims}
$$

$$
\begin{array}{l}
\operatorname{BlockOptsOk}(\mathsf{opts})\ \Leftrightarrow \ \forall \ \mathsf{opt}\ \in \ \mathsf{opts}.\ \operatorname{BlockOptOk}(\mathsf{opt}) \\[0.16em]
\operatorname{DomainCtor}(\operatorname{MethodCall}(\mathsf{ctx},\ \mathsf{name},\ \mathsf{args}))\ \Leftrightarrow \ \mathsf{name}\ \in \ \{\texttt{cpu},\ \texttt{gpu},\ \texttt{inline}\} \\[0.16em]
\operatorname{DomainCtor}(\_)\ \Leftrightarrow \ \mathsf{false} \\[0.16em]
\operatorname{DomainCtorOk}(\operatorname{MethodCall}(\mathsf{ctx},\ \texttt{cpu},\ [])) \\[0.16em]
\operatorname{DomainCtorOk}(\operatorname{MethodCall}(\mathsf{ctx},\ \texttt{cpu},\ [\mathsf{mask}]))\ \Leftrightarrow \ G\ \vdash \ \mathsf{mask}\ :\ \operatorname{TypePath}([\texttt{"CpuSet"}]) \\[0.16em]
\operatorname{DomainCtorOk}(\operatorname{MethodCall}(\mathsf{ctx},\ \texttt{cpu},\ [\mathsf{mask},\ \mathsf{prio}]))\ \Leftrightarrow \ G\ \vdash \ \mathsf{mask}\ :\ \operatorname{TypePath}([\texttt{"CpuSet"}])\ \land \ G\ \vdash \ \mathsf{prio}\ :\ \operatorname{TypePath}([\texttt{"Priority"}]) \\[0.16em]
\operatorname{DomainCtorOk}(\operatorname{MethodCall}(\mathsf{ctx},\ \texttt{gpu},\ [])) \\[0.16em]
\operatorname{DomainCtorOk}(\operatorname{MethodCall}(\mathsf{ctx},\ \texttt{inline},\ [])) \\[0.16em]
\operatorname{DomainCtorOk}(D)\ \Leftrightarrow \ \lnot \operatorname{DomainCtor}(D)
\end{array}
$$

**(T-Parallel)**

$$
\begin{array}{l}
\Gamma \ \vdash \ D\ :\ \texttt{\$ExecutionDomain}\quad \operatorname{DomainCtorOk}(D)\quad \operatorname{BlockOptsOk}(\mathsf{opts})\quad \Gamma_{P} \ =\ \Gamma [\mathsf{parallel}_{\mathsf{context}}\ \mapsto \ D]\quad \Gamma_{P} \ \vdash \ B\ :\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \texttt{parallel}\ D\ \mathsf{opts}\ \{B\}\ :\ T
\end{array}
$$

A parallel block is well-formed only if:

1. The domain expression evaluates to a value implementing `ExecutionDomain`.
2. `spawn` and `dispatch` expressions are evaluated only within an enclosing parallel block.
3. Capture constraints from §20.3 are satisfied.

**(Parallel-Domain-Param-Err)**

$$
\begin{array}{l}
\operatorname{DomainCtor}(D)\quad \lnot \operatorname{DomainCtorOk}(D)\quad c\ =\ \operatorname{Code}(\mathsf{Parallel}-\mathsf{Domain}-\mathsf{Param}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \texttt{parallel}\ D\ \mathsf{opts}\ \{B\}\ \Uparrow \ c
\end{array}
$$

The same rejection form applies when some option `Cancel(e)` is present and Γ ⊢ e : TypePath(["CancelToken"]) does not hold.

### 20.1.5 Dynamic Semantics

$$
\mathsf{ParallelState}\ =\ \{\mathsf{Domain}\ :\ \mathsf{Value},\ \mathsf{Handles}\ :\ \mathsf{List}\langle \mathsf{Value}\rangle ,\ \mathsf{CancelToken}\ :\ \mathsf{CancelToken}@\mathsf{Active}\ \mid \ \bot \}
$$

$$
\operatorname{ParallelInit}(d,\ \mathsf{opts})\ \Downarrow \ \mathsf{pstate}\ \Leftrightarrow \ \mathsf{pstate}\ =\ \{\mathsf{Domain}:\ d,\ \mathsf{Handles}:\ [],\ \mathsf{CancelToken}:\ \operatorname{CancelOpt}(\mathsf{opts})\}
$$

$$
\operatorname{CancelOpt}(\mathsf{opts})\ =\ \mathsf{token}\ \Leftrightarrow \ \operatorname{Cancel}(\mathsf{token})\ \in \ \mathsf{opts}
$$

$$
\operatorname{CancelOpt}(\mathsf{opts})\ =\ \bot \ \Leftrightarrow \ \forall \ \mathsf{opt}\ \in \ \mathsf{opts}.\ \mathsf{opt}\ \ne \ \operatorname{Cancel}(\_)
$$

$$
\mathsf{DEFAULT}_{\mathsf{GPU}\_\mathsf{WORKGROUP}}\ =\ (64,\ 1,\ 1)
$$

$$
\mathsf{DEFAULT}_{\mathsf{GPU}\_\mathsf{WORKGROUPS}}\ =\ (1,\ 1,\ 1)
$$

$$
\operatorname{WorkgroupOpt}(\mathsf{opts})\ =\ \mathsf{dims}\ \Leftrightarrow \ \operatorname{Workgroup}(\mathsf{dims})\ \in \ \mathsf{opts}
$$

$$
\operatorname{WorkgroupOpt}(\mathsf{opts})\ =\ \bot \ \Leftrightarrow \ \forall \ \mathsf{opt}\ \in \ \mathsf{opts}.\ \mathsf{opt}\ \ne \ \operatorname{Workgroup}(\_)
$$

$$
\operatorname{WorkgroupsOpt}(\mathsf{opts})\ =\ \mathsf{dims}\ \Leftrightarrow \ \operatorname{Workgroups}(\mathsf{dims})\ \in \ \mathsf{opts}
$$

$$
\operatorname{WorkgroupsOpt}(\mathsf{opts})\ =\ \bot \ \Leftrightarrow \ \forall \ \mathsf{opt}\ \in \ \mathsf{opts}.\ \mathsf{opt}\ \ne \ \operatorname{Workgroups}(\_)
$$

$$
\begin{array}{l}
\operatorname{ComputeTopologyParallel}(\mathsf{opts})\ =\ \mathsf{topo}\ \Leftrightarrow \\[0.16em]
\ \mathsf{wg}\ =\ \mathsf{if}\ \operatorname{WorkgroupOpt}(\mathsf{opts})\ \ne \ \bot \ \mathsf{then}\ \operatorname{WorkgroupOpt}(\mathsf{opts})\ \mathsf{else}\ \mathsf{DEFAULT}_{\mathsf{GPU}\_\mathsf{WORKGROUP}}\ \land \\[0.16em]
\ \mathsf{ng}\ =\ \mathsf{if}\ \operatorname{WorkgroupsOpt}(\mathsf{opts})\ \ne \ \bot \ \mathsf{then}\ \operatorname{WorkgroupsOpt}(\mathsf{opts})\ \mathsf{else}\ \mathsf{DEFAULT}_{\mathsf{GPU}\_\mathsf{WORKGROUPS}}\ \land \\[0.16em]
\ \mathsf{topo}\ =\ \langle \\[0.16em]
\quad \mathsf{WorkgroupSize}\ :=\ \mathsf{wg}, \\[0.16em]
\quad \mathsf{NumWorkgroups}\ :=\ \mathsf{ng}, \\[0.16em]
\quad \mathsf{GlobalSize}\ :=\ (\mathsf{wg}.0\ \times \ \mathsf{ng}.0,\ \mathsf{wg}.1\ \times \ \mathsf{ng}.1,\ \mathsf{wg}.2\ \times \ \mathsf{ng}.2) \\[0.16em]
\ \rangle
\end{array}
$$

$$
\operatorname{AwaitSpawned}(\mathsf{pstate},\ \sigma )\ \Downarrow \ (\mathsf{panic}_{\mathsf{opt}},\ \sigma ')\ \Leftrightarrow \ \mathsf{every}\ \mathsf{handle}\ \mathsf{in}\ \texttt{pstate.Handles}\ \mathsf{reaches}\ \texttt{Ready}\ \mathsf{or}\ \texttt{Failed}\ \mathsf{between}\ \texttt{sigma}\ \mathsf{and}\ \texttt{sigma'},\ \mathsf{and}\ \texttt{panic\_opt}\ \mathsf{is}\ \mathsf{the}\ \mathsf{failed}\ \mathsf{completion}\ \mathsf{associated}\ \mathsf{with}\ \mathsf{the}\ \mathsf{least}\ \mathsf{completion}-\mathsf{sequence}\ \mathsf{number}\ \mathsf{among}\ \mathsf{handles}\ \mathsf{in}\ \texttt{pstate.Handles}\ \mathsf{whose}\ \mathsf{terminal}\ \mathsf{state}\ \mathsf{is}\ \texttt{Failed},\ \mathsf{or}\ \texttt{bottom}\ \mathsf{if}\ \mathsf{none}\ \mathsf{fail}.
$$

**(EvalSigma-Parallel)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(D,\ \sigma )\ \Downarrow \ (\operatorname{Val}(d),\ \sigma_{1} )\quad \operatorname{ParallelInit}(d,\ \mathsf{opts})\ \Downarrow \ \mathsf{pstate}_{0}\quad \mathsf{topology}\ =\ \mathsf{if}\ \operatorname{IsGpuDomain}(d)\ \mathsf{then}\ \operatorname{ComputeTopologyParallel}(\mathsf{opts})\ \mathsf{else}\ \bot \quad \Gamma \ \vdash \ \operatorname{EvalSigma}(B,\ \sigma_{1} [\mathsf{parallel}_{\mathsf{context}}\ \mapsto \ \mathsf{pstate}_{0}])\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{body}}),\ \sigma_{2} )\quad \operatorname{LookupVal}(\sigma_{2} ,\ \mathsf{parallel}_{\mathsf{context}})\ =\ \mathsf{pstate}_{n}\quad \operatorname{AwaitSpawned}(\mathsf{pstate}_{n},\ \sigma_{2} )\ \Downarrow \ (\bot ,\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{ParallelExpr}(D,\ \mathsf{opts},\ B),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{body}}),\ \sigma_{3} )
\end{array}
$$

**(EvalSigma-Parallel-Body-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(D,\ \sigma )\ \Downarrow \ (\operatorname{Val}(d),\ \sigma_{1} )\quad \operatorname{ParallelInit}(d,\ \mathsf{opts})\ \Downarrow \ \mathsf{pstate}_{0}\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(B,\ \sigma_{1} [\mathsf{parallel}_{\mathsf{context}}\ \mapsto \ \mathsf{pstate}_{0}])\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} )\quad \operatorname{LookupVal}(\sigma_{2} ,\ \mathsf{parallel}_{\mathsf{context}})\ =\ \mathsf{pstate}_{n}\quad \operatorname{AwaitSpawned}(\mathsf{pstate}_{n},\ \sigma_{2} )\ \Downarrow \ (\bot ,\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{ParallelExpr}(D,\ \mathsf{opts},\ B),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{3} )
\end{array}
$$

**(EvalSigma-Parallel-Domain-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(D,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{ParallelExpr}(D,\ \mathsf{opts},\ B),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

Panic propagation after fork-join is defined by §20.7.5.

### 20.1.6 Lowering

$$
\mathsf{ParallelLowerJudg}\ =\ \{\mathsf{LowerParallelBody}\}
$$

**(Lower-Expr-Parallel)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(D)\ \Downarrow \ \langle \mathsf{IR}_{d},\ v_{d}\rangle \quad \Gamma \ \vdash \ \operatorname{LowerBlock}(B)\ \Downarrow \ \langle \mathsf{IR}_{b},\ v_{b}\rangle \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{ParallelExpr}(D,\ \mathsf{opts},\ B))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{d},\ \operatorname{ParallelBegin}(v_{d},\ \mathsf{opts}),\ \mathsf{IR}_{b},\ \mathsf{ParallelJoin}),\ v_{b}\rangle
\end{array}
$$

### 20.1.7 Diagnostics

| Code         | Severity | Detection    | Condition                                        |
| ------------ | -------- | ------------ | ------------------------------------------------ |
| `E-CON-0101` | Error    | Compile-time | `spawn` outside parallel                         |
| `E-CON-0102` | Error    | Compile-time | Domain expression not `ExecutionDomain` (`Parallel-Domain-Param-Err`) |
| `E-CON-0103` | Error    | Compile-time | Invalid parallel domain or option parameter type (`Dim3Const-Err`) |
