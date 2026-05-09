---
title: "Structured Parallelism"
description: "20. Structured Parallelism of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T18:13:03.158Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## 20. Structured Parallelism

### 20.1 Parallel Blocks

#### 20.1.1 Syntax

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

#### 20.1.2 Parsing

Parallel-block parsing is defined by the following source rules:

- `Parse-Parallel-Expr`
- `Parse-ParallelOptsOpt-None`
- `Parse-ParallelOptsOpt-Yes`
- `Parse-ParallelOptList-Empty`
- `Parse-ParallelOptList-Cons`
- `Parse-ParallelOptListTail-End`
- `Parse-ParallelOptListTail-TrailingComma`
- `Parse-ParallelOptListTail-Comma`
- `Parse-ParallelOpt-Cancel`
- `Parse-ParallelOpt-Name`
- `Parse-ParallelOpt-Workgroup`
- `Parse-ParallelOpt-Workgroups`

`Parse-Parallel-Expr` parses the domain expression with `ParseExpr_NoBrace`, then parses the optional option list, then parses the block body.

#### 20.1.3 AST Representation / Form

```math
\mathsf{ParallelOpt}\ =\ \{\operatorname{Cancel}(\mathsf{expr}),\ \operatorname{Name}(\mathsf{str}),\ \operatorname{Workgroup}(\mathsf{dim3}),\ \operatorname{Workgroups}(\mathsf{dim3})\}
```

```math
\mathsf{ParallelOpts}\ =\ [\mathsf{ParallelOpt}]
```

```math
\mathsf{Expr}\ =\ \ldots \ \mid \ \operatorname{ParallelExpr}(\mathsf{domain},\ \mathsf{opts},\ \mathsf{body})\ \mid \ \ldots 
```

```math
\mathsf{ResolveParallelOptJudg}\ =\ \{\mathsf{ResolveParallelOpt},\ \mathsf{ResolveParallelOpts}\}
```

ResolveParallelOpt is homomorphic on the option forms:

- If Γ ⊢ ResolveExpr(e) ⇓ e' then Γ ⊢ ResolveParallelOpt(Workgroup(e)) ⇓ Workgroup(e').
- If Γ ⊢ ResolveExpr(e) ⇓ e' then Γ ⊢ ResolveParallelOpt(Workgroups(e)) ⇓ Workgroups(e').

```math
\operatorname{ParallelOptExprs}([])\ =\ []
```

```math
\operatorname{ParallelOptExprs}(\operatorname{Cancel}(e)\ \mathbin{::} \ \mathsf{os})\ =\ [e]\ \mathbin{++} \ \operatorname{ParallelOptExprs}(\mathsf{os})
```

```math
\operatorname{ParallelOptExprs}(\operatorname{Name}(\_)\ \mathbin{::} \ \mathsf{os})\ =\ \operatorname{ParallelOptExprs}(\mathsf{os})
```

```math
\operatorname{ParallelOptExprs}(\operatorname{Workgroup}(e)\ \mathbin{::} \ \mathsf{os})\ =\ [e]\ \mathbin{++} \ \operatorname{ParallelOptExprs}(\mathsf{os})
```

```math
\operatorname{ParallelOptExprs}(\operatorname{Workgroups}(e)\ \mathbin{::} \ \mathsf{os})\ =\ [e]\ \mathbin{++} \ \operatorname{ParallelOptExprs}(\mathsf{os})
```

#### 20.1.4 Static Semantics

```math
\operatorname{BlockOptOk}(\operatorname{Name}(\_))\ \Leftrightarrow \ \mathsf{true}
```

```math
\operatorname{BlockOptOk}(\operatorname{Cancel}(e))\ \Leftrightarrow \ G\ \vdash \ e\ :\ \operatorname{TypePath}([\texttt{"CancelToken"}])
```

```math
\begin{array}{l}
G\ \vdash \ \operatorname{Dim3Const}((e_{1},\ e_{2},\ e_{3}))\ \Downarrow \ (x,\ y,\ z)\ \Leftrightarrow  \\
\ G\ \vdash \ e_{1}\ :\ \operatorname{TypePrim}(\texttt{"usize"})\ \land \ G\ \vdash \ \operatorname{ConstLen}(e_{1})\ \Downarrow \ x\ \land \ x\ >\ 0\ \land  \\
\ G\ \vdash \ e_{2}\ :\ \operatorname{TypePrim}(\texttt{"usize"})\ \land \ G\ \vdash \ \operatorname{ConstLen}(e_{2})\ \Downarrow \ y\ \land \ y\ >\ 0\ \land  \\
\ G\ \vdash \ e_{3}\ :\ \operatorname{TypePrim}(\texttt{"usize"})\ \land \ G\ \vdash \ \operatorname{ConstLen}(e_{3})\ \Downarrow \ z\ \land \ z\ >\ 0
\end{array}
```

**(Dim3Const-Err)**

```math
\begin{array}{l}
\lnot \exists \ \mathsf{dims}.\ G\ \vdash \ \operatorname{Dim3Const}(e)\ \Downarrow \ \mathsf{dims}\quad c\ =\ \operatorname{Code}(\mathsf{Dim3Const}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\mathsf{Reject}
\end{array}
```

```math
\operatorname{BlockOptOk}(\operatorname{Workgroup}(e))\ \Leftrightarrow \ \exists \ \mathsf{dims}.\ G\ \vdash \ \operatorname{Dim3Const}(e)\ \Downarrow \ \mathsf{dims}
```

```math
\operatorname{BlockOptOk}(\operatorname{Workgroups}(e))\ \Leftrightarrow \ \exists \ \mathsf{dims}.\ G\ \vdash \ \operatorname{Dim3Const}(e)\ \Downarrow \ \mathsf{dims}
```

```math
\begin{array}{l}
\operatorname{BlockOptsOk}(\mathsf{opts})\ \Leftrightarrow \ \forall \ \mathsf{opt}\ \in \ \mathsf{opts}.\ \operatorname{BlockOptOk}(\mathsf{opt}) \\
\operatorname{DomainCtor}(\operatorname{MethodCall}(\mathsf{ctx},\ \mathsf{name},\ \mathsf{args}))\ \Leftrightarrow \ \mathsf{name}\ \in \ \{\texttt{cpu},\ \texttt{gpu},\ \texttt{inline}\} \\
\operatorname{DomainCtor}(\_)\ \Leftrightarrow \ \mathsf{false} \\
\operatorname{DomainCtorOk}(\operatorname{MethodCall}(\mathsf{ctx},\ \texttt{cpu},\ [])) \\
\operatorname{DomainCtorOk}(\operatorname{MethodCall}(\mathsf{ctx},\ \texttt{cpu},\ [\mathsf{mask}]))\ \Leftrightarrow \ G\ \vdash \ \mathsf{mask}\ :\ \operatorname{TypePath}([\texttt{"CpuSet"}]) \\
\operatorname{DomainCtorOk}(\operatorname{MethodCall}(\mathsf{ctx},\ \texttt{cpu},\ [\mathsf{mask},\ \mathsf{prio}]))\ \Leftrightarrow \ G\ \vdash \ \mathsf{mask}\ :\ \operatorname{TypePath}([\texttt{"CpuSet"}])\ \land \ G\ \vdash \ \mathsf{prio}\ :\ \operatorname{TypePath}([\texttt{"Priority"}]) \\
\operatorname{DomainCtorOk}(\operatorname{MethodCall}(\mathsf{ctx},\ \texttt{gpu},\ [])) \\
\operatorname{DomainCtorOk}(\operatorname{MethodCall}(\mathsf{ctx},\ \texttt{inline},\ [])) \\
\operatorname{DomainCtorOk}(D)\ \Leftrightarrow \ \lnot \operatorname{DomainCtor}(D)
\end{array}
```

**(T-Parallel)**

```math
\begin{array}{l}
\Gamma \ \vdash \ D\ :\ \texttt{\$ExecutionDomain}\quad \operatorname{DomainCtorOk}(D)\quad \operatorname{BlockOptsOk}(\mathsf{opts})\quad \Gamma_{P} \ =\ \Gamma [\mathsf{parallel}_{\mathsf{context}}\ \mapsto \ D]\quad \Gamma_{P} \ \vdash \ B\ :\ T \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \texttt{parallel}\ D\ \mathsf{opts}\ \{B\}\ :\ T
\end{array}
```

A parallel block is well-formed only if:

1. The domain expression evaluates to a value implementing `ExecutionDomain`.
2. `spawn` and `dispatch` expressions are evaluated only within an enclosing parallel block.
3. Capture constraints from §20.3 are satisfied.

**(Parallel-Domain-Param-Err)**

```math
\begin{array}{l}
\operatorname{DomainCtor}(D)\quad \lnot \operatorname{DomainCtorOk}(D)\quad c\ =\ \operatorname{Code}(\mathsf{Parallel}-\mathsf{Domain}-\mathsf{Param}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \texttt{parallel}\ D\ \mathsf{opts}\ \{B\}\ \Uparrow \ c
\end{array}
```

```math
\mathsf{The}\ \mathsf{same}\ \mathsf{rejection}\ \mathsf{form}\ \mathsf{applies}\ \mathsf{when}\ \mathsf{some}\ \mathsf{option}\ \texttt{Cancel(e)}\ \mathsf{is}\ \mathsf{present}\ \mathsf{and}\ \Gamma \ \vdash \ e\ :\ \operatorname{TypePath}([\texttt{"CancelToken"}])\ \mathsf{does}\ \mathsf{not}\ \mathsf{hold}.
```

#### 20.1.5 Dynamic Semantics

```math
\mathsf{ParallelState}\ =\ \{\mathsf{Domain}\ :\ \mathsf{Value},\ \mathsf{Handles}\ :\ \mathsf{List}\langle \mathsf{Value}\rangle ,\ \mathsf{CancelToken}\ :\ \mathsf{CancelToken}@\mathsf{Active}\ \mid \ \bot \}
```

```math
\operatorname{ParallelInit}(d,\ \mathsf{opts})\ \Downarrow \ \mathsf{pstate}\ \Leftrightarrow \ \mathsf{pstate}\ =\ \{\mathsf{Domain}:\ d,\ \mathsf{Handles}:\ [],\ \mathsf{CancelToken}:\ \operatorname{CancelOpt}(\mathsf{opts})\}
```

```math
\operatorname{CancelOpt}(\mathsf{opts})\ =\ \mathsf{token}\ \Leftrightarrow \ \operatorname{Cancel}(\mathsf{token})\ \in \ \mathsf{opts}
```

```math
\operatorname{CancelOpt}(\mathsf{opts})\ =\ \bot \ \Leftrightarrow \ \forall \ \mathsf{opt}\ \in \ \mathsf{opts}.\ \mathsf{opt}\ \ne \ \operatorname{Cancel}(\_)
```

```math
\mathsf{DEFAULT}_{\mathsf{GPU}\_\mathsf{WORKGROUP}}\ =\ (64,\ 1,\ 1)
```

```math
\mathsf{DEFAULT}_{\mathsf{GPU}\_\mathsf{WORKGROUPS}}\ =\ (1,\ 1,\ 1)
```

```math
\operatorname{WorkgroupOpt}(\mathsf{opts})\ =\ \mathsf{dims}\ \Leftrightarrow \ \operatorname{Workgroup}(\mathsf{dims})\ \in \ \mathsf{opts}
```

```math
\operatorname{WorkgroupOpt}(\mathsf{opts})\ =\ \bot \ \Leftrightarrow \ \forall \ \mathsf{opt}\ \in \ \mathsf{opts}.\ \mathsf{opt}\ \ne \ \operatorname{Workgroup}(\_)
```

```math
\operatorname{WorkgroupsOpt}(\mathsf{opts})\ =\ \mathsf{dims}\ \Leftrightarrow \ \operatorname{Workgroups}(\mathsf{dims})\ \in \ \mathsf{opts}
```

```math
\operatorname{WorkgroupsOpt}(\mathsf{opts})\ =\ \bot \ \Leftrightarrow \ \forall \ \mathsf{opt}\ \in \ \mathsf{opts}.\ \mathsf{opt}\ \ne \ \operatorname{Workgroups}(\_)
```

```math
\begin{array}{l}
\operatorname{ComputeTopologyParallel}(\mathsf{opts})\ =\ \mathsf{topo}\ \Leftrightarrow  \\
\ \mathsf{wg}\ =\ \mathsf{if}\ \operatorname{WorkgroupOpt}(\mathsf{opts})\ \ne \ \bot \ \mathsf{then}\ \operatorname{WorkgroupOpt}(\mathsf{opts})\ \mathsf{else}\ \mathsf{DEFAULT}_{\mathsf{GPU}\_\mathsf{WORKGROUP}}\ \land  \\
\ \mathsf{ng}\ =\ \mathsf{if}\ \operatorname{WorkgroupsOpt}(\mathsf{opts})\ \ne \ \bot \ \mathsf{then}\ \operatorname{WorkgroupsOpt}(\mathsf{opts})\ \mathsf{else}\ \mathsf{DEFAULT}_{\mathsf{GPU}\_\mathsf{WORKGROUPS}}\ \land  \\
\ \mathsf{topo}\ =\ \langle  \\
\quad \mathsf{WorkgroupSize}\ :=\ \mathsf{wg}, \\
\quad \mathsf{NumWorkgroups}\ :=\ \mathsf{ng}, \\
\quad \mathsf{GlobalSize}\ :=\ (\mathsf{wg}.0\ \times \ \mathsf{ng}.0,\ \mathsf{wg}.1\ \times \ \mathsf{ng}.1,\ \mathsf{wg}.2\ \times \ \mathsf{ng}.2) \\
\ \rangle 
\end{array}
```

```math
\operatorname{AwaitSpawned}(\mathsf{pstate},\ \sigma )\ \Downarrow \ (\mathsf{panic}_{\mathsf{opt}},\ \sigma ')\ \Leftrightarrow \ \mathsf{every}\ \mathsf{handle}\ \mathsf{in}\ \texttt{pstate.Handles}\ \mathsf{reaches}\ \texttt{Ready}\ \mathsf{or}\ \texttt{Failed}\ \mathsf{between}\ \texttt{sigma}\ \mathsf{and}\ \texttt{sigma'},\ \mathsf{and}\ \texttt{panic\_opt}\ \mathsf{is}\ \mathsf{the}\ \mathsf{failed}\ \mathsf{completion}\ \mathsf{associated}\ \mathsf{with}\ \mathsf{the}\ \mathsf{least}\ \mathsf{completion}-\mathsf{sequence}\ \mathsf{number}\ \mathsf{among}\ \mathsf{handles}\ \mathsf{in}\ \texttt{pstate.Handles}\ \mathsf{whose}\ \mathsf{terminal}\ \mathsf{state}\ \mathsf{is}\ \texttt{Failed},\ \mathsf{or}\ \texttt{bottom}\ \mathsf{if}\ \mathsf{none}\ \mathsf{fail}.
```

**(EvalSigma-Parallel)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(D,\ \sigma )\ \Downarrow \ (\operatorname{Val}(d),\ \sigma_{1} )\quad \operatorname{ParallelInit}(d,\ \mathsf{opts})\ \Downarrow \ \mathsf{pstate}_{0}\quad \mathsf{topology}\ =\ \mathsf{if}\ \operatorname{IsGpuDomain}(d)\ \mathsf{then}\ \operatorname{ComputeTopologyParallel}(\mathsf{opts})\ \mathsf{else}\ \bot \quad \Gamma \ \vdash \ \operatorname{EvalSigma}(B,\ \sigma_{1} [\mathsf{parallel}_{\mathsf{context}}\ \mapsto \ \mathsf{pstate}_{0}])\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{body}}),\ \sigma_{2} )\quad \operatorname{LookupVal}(\sigma_{2} ,\ \mathsf{parallel}_{\mathsf{context}})\ =\ \mathsf{pstate}_{n}\quad \operatorname{AwaitSpawned}(\mathsf{pstate}_{n},\ \sigma_{2} )\ \Downarrow \ (\bot ,\ \sigma_{3} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{ParallelExpr}(D,\ \mathsf{opts},\ B),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{body}}),\ \sigma_{3} )
\end{array}
```

**(EvalSigma-Parallel-Body-Ctrl)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(D,\ \sigma )\ \Downarrow \ (\operatorname{Val}(d),\ \sigma_{1} )\quad \operatorname{ParallelInit}(d,\ \mathsf{opts})\ \Downarrow \ \mathsf{pstate}_{0}\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(B,\ \sigma_{1} [\mathsf{parallel}_{\mathsf{context}}\ \mapsto \ \mathsf{pstate}_{0}])\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} )\quad \operatorname{LookupVal}(\sigma_{2} ,\ \mathsf{parallel}_{\mathsf{context}})\ =\ \mathsf{pstate}_{n}\quad \operatorname{AwaitSpawned}(\mathsf{pstate}_{n},\ \sigma_{2} )\ \Downarrow \ (\bot ,\ \sigma_{3} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{ParallelExpr}(D,\ \mathsf{opts},\ B),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{3} )
\end{array}
```

**(EvalSigma-Parallel-Domain-Ctrl)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(D,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{ParallelExpr}(D,\ \mathsf{opts},\ B),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
```

Panic propagation after fork-join is defined by §20.7.5.

#### 20.1.6 Lowering

```math
\mathsf{ParallelLowerJudg}\ =\ \{\mathsf{LowerParallelBody}\}
```

**(Lower-Expr-Parallel)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(D)\ \Downarrow \ \langle \mathsf{IR}_{d},\ v_{d}\rangle \quad \Gamma \ \vdash \ \operatorname{LowerBlock}(B)\ \Downarrow \ \langle \mathsf{IR}_{b},\ v_{b}\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{ParallelExpr}(D,\ \mathsf{opts},\ B))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{d},\ \operatorname{ParallelBegin}(v_{d},\ \mathsf{opts}),\ \mathsf{IR}_{b},\ \mathsf{ParallelJoin}),\ v_{b}\rangle 
\end{array}
```

#### 20.1.7 Diagnostics

| Code         | Severity | Detection    | Condition                                        |
| ------------ | -------- | ------------ | ------------------------------------------------ |
| `E-CON-0101` | Error    | Compile-time | `spawn` outside parallel                         |
| `E-CON-0102` | Error    | Compile-time | Domain expression not `ExecutionDomain`          |
| `E-CON-0103` | Error    | Compile-time | Invalid parallel domain or option parameter type |

### 20.2 Execution Domains

#### 20.2.1 Syntax

Execution-domain values use ordinary method-call syntax and GPU intrinsics use ordinary call-expression syntax.

```text
ctx.cpu()
ctx.gpu()
ctx.inline()
```

#### 20.2.2 Parsing

This section introduces no additional parser productions beyond ordinary type, call, and method-call parsing.

`GpuPtr<T, S>` uses the ordinary generic type parser of §14.2.1 with head `GpuPtr` and exactly two generic arguments. The second argument MUST name one of `Global`, `Shared`, or `Private`.

#### 20.2.3 AST Representation / Form

```math
\mathsf{GpuDomainJudg}\ =\ \{\mathsf{IsGpuDomain},\ \mathsf{GpuContext},\ \mathsf{GpuSafeType},\ \mathsf{GpuCaptureOk}\}
```

```math
\operatorname{IsGpuDomain}(D)\ \Leftrightarrow \ \operatorname{DomainKind}(D)\ =\ \texttt{GPU}
```

```math
\operatorname{GpuContext}(G)\ \Leftrightarrow \ G[\mathsf{parallel}_{\mathsf{context}}]\ =\ D\ \land \ \operatorname{IsGpuDomain}(D)
```

```math
\mathsf{GpuSafeJudg}\ =\ \{\mathsf{GpuSafeType}\}
```

```math
\mathsf{GpuAddressSpace}\ =\ \{\mathsf{Global},\ \mathsf{Shared},\ \mathsf{Private}\}
```

```math
\mathsf{GpuMemory}\ =\ \langle \mathsf{GlobalMem},\ \mathsf{SharedMem},\ \mathsf{PrivateMem}\rangle 
```
GlobalMem : Addr ⇀ Value

```math
\begin{array}{l}
\mathsf{SharedMem}\ :\ \mathsf{WorkgroupId}\ \times \ \mathsf{Addr}\ \rightharpoonup \ \mathsf{Value} \\
\mathsf{PrivateMem}\ :\ \mathsf{WorkItemId}\ \times \ \mathsf{Addr}\ \rightharpoonup \ \mathsf{Value}
\end{array}
```

**GpuPtr Type.** `GpuPtr<T, S>` represents a pointer to GPU memory in address space `S`.

```math
\begin{array}{l}
\operatorname{TypeGpuPtr}(T,\ S)\ \mathsf{where}\ S\ \in \ \mathsf{GpuAddressSpace} \\
\operatorname{GpuPtrAddrSpace}(\operatorname{TypeGpuPtr}(T,\ S))\ =\ S
\end{array}
```

```math
\begin{array}{l}
\operatorname{ComputeTopologyDispatch}(\mathsf{bounds},\ \mathsf{opts})\ =\ \mathsf{topo}\ \Leftrightarrow  \\
\ \mathsf{wg}\ =\ \mathsf{if}\ \operatorname{WorkgroupOpt}(\mathsf{opts})\ \ne \ \bot \ \mathsf{then}\ \operatorname{WorkgroupOpt}(\mathsf{opts})\ \mathsf{else}\ \mathsf{DEFAULT}_{\mathsf{GPU}\_\mathsf{WORKGROUP}}\ \land  \\
\ \mathsf{volume}\ =\ \mathsf{wg}.0\ \times \ \mathsf{wg}.1\ \times \ \mathsf{wg}.2\ \land  \\
\ \mathsf{groups}\ =\ \operatorname{CeilDiv}(\mid \mathsf{bounds}\mid ,\ \mathsf{volume})\ \land  \\
\ \mathsf{topo}\ =\ \langle  \\
\quad \mathsf{WorkgroupSize}\ :=\ \mathsf{wg}, \\
\quad \mathsf{NumWorkgroups}\ :=\ (\mathsf{groups},\ 1,\ 1), \\
\quad \mathsf{GlobalSize}\ :=\ (\mathsf{wg}.0\ \times \ \mathsf{groups},\ \mathsf{wg}.1,\ \mathsf{wg}.2) \\
\ \rangle 
\end{array}
```

**GPU Execution Topology.** Work-items are organized into a 3-dimensional hierarchy of workgroups.

```math
\mathsf{GpuTopology}\ =\ \langle \mathsf{GlobalSize},\ \mathsf{WorkgroupSize},\ \mathsf{NumWorkgroups}\rangle 
```
GlobalSize : (usize, usize, usize)
WorkgroupSize : (usize, usize, usize)
NumWorkgroups : (usize, usize, usize)

```math
\begin{array}{l}
\mathsf{WorkItemId}\ =\ (\mathsf{usize},\ \mathsf{usize},\ \mathsf{usize}) \\
\mathsf{WorkgroupId}\ =\ (\mathsf{usize},\ \mathsf{usize},\ \mathsf{usize}) \\
\operatorname{GlobalId}(\mathsf{local}_{\mathsf{id}},\ \mathsf{workgroup}_{\mathsf{id}},\ \mathsf{workgroup}_{\mathsf{size}})\ = \\
\ (\mathsf{local}_{\mathsf{id}}.0\ +\ \mathsf{workgroup}_{\mathsf{id}}.0\ \times \ \mathsf{workgroup}_{\mathsf{size}}.0, \\
\ \mathsf{local}_{\mathsf{id}}.1\ +\ \mathsf{workgroup}_{\mathsf{id}}.1\ \times \ \mathsf{workgroup}_{\mathsf{size}}.1, \\
\ \mathsf{local}_{\mathsf{id}}.2\ +\ \mathsf{workgroup}_{\mathsf{id}}.2\ \times \ \mathsf{workgroup}_{\mathsf{size}}.2)
\end{array}
```

```math
\begin{array}{l}
\mathsf{GpuIntrinsicTable}\ =\ \{ \\
\ \langle \texttt{gpu\_global\_id},\ [],\ \operatorname{TypeTuple}([\operatorname{TypePrim}(\texttt{"usize"}),\ \operatorname{TypePrim}(\texttt{"usize"}),\ \operatorname{TypePrim}(\texttt{"usize"})])\rangle , \\
\ \langle \texttt{gpu\_local\_id},\ [],\ \operatorname{TypeTuple}([\operatorname{TypePrim}(\texttt{"usize"}),\ \operatorname{TypePrim}(\texttt{"usize"}),\ \operatorname{TypePrim}(\texttt{"usize"})])\rangle , \\
\ \langle \texttt{gpu\_workgroup\_id},\ [],\ \operatorname{TypeTuple}([\operatorname{TypePrim}(\texttt{"usize"}),\ \operatorname{TypePrim}(\texttt{"usize"}),\ \operatorname{TypePrim}(\texttt{"usize"})])\rangle , \\
\ \langle \texttt{gpu\_workgroup\_size},\ [],\ \operatorname{TypeTuple}([\operatorname{TypePrim}(\texttt{"usize"}),\ \operatorname{TypePrim}(\texttt{"usize"}),\ \operatorname{TypePrim}(\texttt{"usize"})])\rangle , \\
\ \langle \texttt{gpu\_global\_size},\ [],\ \operatorname{TypeTuple}([\operatorname{TypePrim}(\texttt{"usize"}),\ \operatorname{TypePrim}(\texttt{"usize"}),\ \operatorname{TypePrim}(\texttt{"usize"})])\rangle , \\
\ \langle \texttt{gpu\_num\_workgroups},\ [],\ \operatorname{TypeTuple}([\operatorname{TypePrim}(\texttt{"usize"}),\ \operatorname{TypePrim}(\texttt{"usize"}),\ \operatorname{TypePrim}(\texttt{"usize"})])\rangle , \\
\ \langle \texttt{gpu\_linear\_id},\ [],\ \operatorname{TypePrim}(\texttt{"usize"})\rangle , \\
\ \langle \texttt{gpu\_barrier},\ [],\ \operatorname{TypePrim}(\texttt{"()"})\rangle , \\
\ \langle \texttt{gpu\_memory\_barrier},\ [],\ \operatorname{TypePrim}(\texttt{"()"})\rangle , \\
\ \langle \texttt{gpu\_workgroup\_barrier},\ [],\ \operatorname{TypePrim}(\texttt{"()"})\rangle 
\end{array}
```
}

```math
\mathsf{GpuIntrinsicNames}\ =\ \{\mathsf{name}\ \mid \ \langle \mathsf{name},\ \_,\ \_\rangle \ \in \ \mathsf{GpuIntrinsicTable}\}
```

```math
\mathsf{GpuState}\ =\ \langle \mathsf{Topology},\ \mathsf{GlobalMem},\ \mathsf{WorkgroupStates}\rangle 
```

```math
\mathsf{WorkgroupState}\ =\ \langle \mathsf{SharedMem},\ \mathsf{WorkItems},\ \mathsf{BarrierCount}\rangle 
```

```math
\mathsf{GpuWorkItem}\ =\ \langle \mathsf{id},\ \mathsf{local}_{\mathsf{id}},\ \mathsf{workgroup}_{\mathsf{id}},\ \mathsf{expr},\ \mathsf{captures},\ \mathsf{status},\ \mathsf{private}_{\mathsf{mem}}\rangle 
```

```math
\begin{array}{l}
\mathsf{GpuWorkItemStatus}\ =\ \{\mathsf{Pending},\ \mathsf{Running},\ \mathsf{AtBarrier},\ \mathsf{Done}\} \\
\operatorname{AtBarrier}(\mathsf{wi})\ \Leftrightarrow \ \mathsf{wi}.\mathsf{status}\ =\ \mathsf{AtBarrier} \\
\operatorname{LinearId}(\mathsf{id}_{\mathsf{3d}},\ \mathsf{size})\ =\ \mathsf{id}_{\mathsf{3d}}.0\ +\ \mathsf{id}_{\mathsf{3d}}.1\ \times \ \mathsf{size}.0\ +\ \mathsf{id}_{\mathsf{3d}}.2\ \times \ \mathsf{size}.0\ \times \ \mathsf{size}.1 \\
\operatorname{LocalIdFromLinear}(\mathsf{linear},\ \mathsf{workgroup}_{\mathsf{size}})\ =\ ( \\
\ \mathsf{linear}\ \%\ \mathsf{workgroup}_{\mathsf{size}}.0, \\
\ (\mathsf{linear}\ /\ \mathsf{workgroup}_{\mathsf{size}}.0)\ \%\ \mathsf{workgroup}_{\mathsf{size}}.1, \\
\ \mathsf{linear}\ /\ (\mathsf{workgroup}_{\mathsf{size}}.0\ \times \ \mathsf{workgroup}_{\mathsf{size}}.1)
\end{array}
```
)

```math
\begin{array}{l}
\mathsf{ExecutionDomainMethods}\ =\ [ \\
\ \operatorname{ClassMethodDecl}(\bot ,\ \texttt{public},\ \texttt{"name"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [],\ \operatorname{TypeString}(\bot ),\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\
\ \operatorname{ClassMethodDecl}(\bot ,\ \texttt{public},\ \texttt{"max\_concurrency"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [],\ \operatorname{TypePrim}(\texttt{"usize"}),\ \bot ,\ \bot ,\ \bot ,\ \bot )
\end{array}
```
]

```math
\mathsf{ExecutionDomainDecl}\ =\ \operatorname{ClassDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{ExecutionDomain},\ \bot ,\ \bot ,\ [],\ \mathsf{ExecutionDomainMethods},\ \bot ,\ \bot )
```

#### 20.2.4 Static Semantics

`ctx.cpu()`, `ctx.gpu()`, and `ctx.inline()` are `Context` methods that each return a value of type `$ExecutionDomain`.

`ctx.cpu()` selects the domain-default CPU execution domain.

`ctx.cpu(mask)` selects a CPU execution domain restricted to the `CpuSet` mask.

`ctx.cpu(mask, priority)` selects a CPU execution domain restricted to the `CpuSet` mask and default task `Priority`.

`ctx.gpu()` selects the default GPU execution domain.

`ctx.inline()` selects the inline execution domain.

`CpuSet` is an alias of `u64` interpreted as a CPU-bitset mask.

`Priority` is an enum with variants `Low`, `Normal`, and `High`.

```math
\begin{array}{l}
\texttt{GpuSafeType(T)}\ \mathsf{holds}\ \mathsf{iff}\ \texttt{notProhibitedGpuType(T)}\ \mathsf{and}\ \texttt{GpuSafeComponents(T)}. \\
\operatorname{GpuSafeType}(T)\ \Leftrightarrow \ \lnot \operatorname{ProhibitedGpuType}(T)\ \land \ \operatorname{GpuSafeComponents}(T)
\end{array}
```

```math
\mathsf{GpuSafePrimTypes}\ =\ \{\texttt{i8},\ \texttt{i16},\ \texttt{i32},\ \texttt{i64},\ \texttt{u8},\ \texttt{u16},\ \texttt{u32},\ \texttt{u64},\ \texttt{isize},\ \texttt{usize},\ \texttt{f16},\ \texttt{f32},\ \texttt{f64},\ \texttt{bool},\ \texttt{()}\}
```

```math
\begin{array}{l}
\operatorname{ProhibitedGpuType}(T)\ \Leftrightarrow  \\
\ T\ =\ \operatorname{TypeDynamic}(\_)\ \lor  \\
\ T\ =\ \operatorname{TypePath}([\texttt{"Context"}])\ \lor  \\
\ T\ =\ \operatorname{TypePath}([\texttt{"System"}])\ \lor  \\
\ \operatorname{IsCapabilityType}(T)\ \lor  \\
\ T\ =\ \operatorname{TypeString}(\texttt{@Managed})\ \lor  \\
\ T\ =\ \operatorname{TypeBytes}(\texttt{@Managed})\ \lor  \\
\ T\ =\ \operatorname{TypePtr}(\_,\ \texttt{@Valid})\ \lor  \\
\ T\ =\ \operatorname{TypeModalState}(\_,\ \_)\ \lor  \\
\ \operatorname{ModalRefType}(T)
\end{array}
```

```math
\operatorname{GpuSafeComponents}(T)\ \Leftrightarrow \ \operatorname{BitcopyType}(T)\ \land \ (\operatorname{CompoundType}(T)\ \Rightarrow \ \forall \ \mathsf{elem}\ \in \ \operatorname{Elements}(T).\ \operatorname{GpuSafeType}(\mathsf{elem}))
```

```math
\operatorname{HasGpuSafeReq}(W,\ x)\ \Leftrightarrow \ \exists \ \mathsf{wp}\ \in \ \operatorname{PredicateReqs}(W).\ \mathsf{wp}\ =\ \operatorname{PredicateReq}(\texttt{GpuSafe},\ \operatorname{TypePath}([x]))
```

```math
\operatorname{GpuSafePredicateClauseOk}(\mathsf{params},\ W)\ \Leftrightarrow \ \forall \ p\ \in \ \mathsf{params}.\ (p.\mathsf{name}\ \in \ \mathsf{TypeParamsUsed}\ \Rightarrow \ \operatorname{HasGpuSafeReq}(W,\ p.\mathsf{name}))
```

**(GpuSafe-Prim)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePrim}(t)\quad t\ \in \ \mathsf{GpuSafePrimTypes} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{GpuSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
```

**(GpuSafe-RawPtr)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeRawPtr}(\_,\ U)\quad \Gamma \ \vdash \ \operatorname{GpuSafeType}(U)\ \Downarrow \ \mathsf{ok} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{GpuSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
```

**(GpuSafe-Array)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeArray}(U,\ n)\quad \Gamma \ \vdash \ \operatorname{GpuSafeType}(U)\ \Downarrow \ \mathsf{ok} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{GpuSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
```

**(GpuSafe-Tuple)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}])\quad \forall \ i.\ \Gamma \ \vdash \ \operatorname{GpuSafeType}(T_{i})\ \Downarrow \ \mathsf{ok} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{GpuSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
```

**(GpuSafe-Perm)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePerm}(\_,\ U)\quad \Gamma \ \vdash \ \operatorname{GpuSafeType}(U)\ \Downarrow \ \mathsf{ok} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{GpuSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
```

**(GpuSafe-Record)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \forall \ f\ :\ T_{f}\ \in \ \operatorname{Fields}(R).\ \Gamma \ \vdash \ \operatorname{GpuSafeType}(T_{f})\ \Downarrow \ \mathsf{ok}\quad \operatorname{BitcopyType}(T) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{GpuSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
```

**(GpuSafe-Enum)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \forall \ v\ \in \ \operatorname{Variants}(E).\ \forall \ T_{f}\ \in \ \operatorname{PayloadTypes}(v).\ \Gamma \ \vdash \ \operatorname{GpuSafeType}(T_{f})\ \Downarrow \ \mathsf{ok}\quad \operatorname{BitcopyType}(T) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{GpuSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
```

**(GpuSafe-StringView)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeString}(\texttt{@View}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{GpuSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
```

**(GpuSafe-BytesView)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeBytes}(\texttt{@View}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{GpuSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
```

**(GpuSafeType-Err)**

```math
\begin{array}{l}
\operatorname{ProhibitedGpuType}(T)\quad c\ =\ \operatorname{Code}(E-\mathsf{TYP}-2640) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{GpuSafeType}(T)\ \Uparrow \ c
\end{array}
```

**(GpuSafe-Record-Field-Err)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \exists \ f\ :\ T_{f}\ \in \ \operatorname{Fields}(R).\ \Gamma \ \vdash \ \operatorname{GpuSafeType}(T_{f})\ \Uparrow \quad c\ =\ \operatorname{Code}(E-\mathsf{TYP}-2640) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{GpuSafeType}(T)\ \Uparrow \ c
\end{array}
```

**(GpuSafe-Generic-Unbounded-Err)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad (\operatorname{RecordDecl}(p)\ =\ R\ \lor \ \operatorname{EnumDecl}(p)\ =\ E)\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(\_.\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \mathsf{params}_{\mathsf{gen}}\ \ne \ []\quad \lnot \ \operatorname{GpuSafePredicateClauseOk}(\mathsf{params}_{\mathsf{gen}},\ \_.\mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}})\quad c\ =\ \operatorname{Code}(E-\mathsf{TYP}-2642) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{GpuSafeType}(T)\ \Uparrow \ c
\end{array}
```

**(T-GpuIntrinsic)**

```math
\begin{array}{l}
\operatorname{GpuContext}(\Gamma )\quad \langle \mathsf{name},\ [],\ \mathsf{ret}\rangle \ \in \ \mathsf{GpuIntrinsicTable} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Call}(\operatorname{PathExpr}([\mathsf{name}]),\ [])\ :\ \mathsf{ret}
\end{array}
```

**(Barrier-Outside-Err)**

```math
\begin{array}{l}
\lnot \operatorname{GpuContext}(\Gamma )\quad \mathsf{name}\ \in \ \{\texttt{gpu\_barrier},\ \texttt{gpu\_memory\_barrier},\ \texttt{gpu\_workgroup\_barrier}\}\quad c\ =\ \operatorname{Code}(\mathsf{Barrier}-\mathsf{Outside}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Call}(\operatorname{PathExpr}([\mathsf{name}]),\ [])\ \Uparrow \ c
\end{array}
```

**(GpuIntrinsic-Outside-Err)**

```math
\begin{array}{l}
\lnot \operatorname{GpuContext}(\Gamma )\quad \mathsf{name}\ \in \ \mathsf{GpuIntrinsicNames}\ \setminus \ \{\texttt{gpu\_barrier},\ \texttt{gpu\_memory\_barrier},\ \texttt{gpu\_workgroup\_barrier}\}\quad c\ =\ \operatorname{Code}(E-\mathsf{CON}-0154) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Call}(\operatorname{PathExpr}([\mathsf{name}]),\ [])\ \Uparrow \ c
\end{array}
```

**(GpuPtr-AddrSpace-Err)**

```math
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypeGpuPtr}(T,\ S_{1})\quad \operatorname{ExpectedType}(e)\ =\ \operatorname{TypeGpuPtr}(T,\ S_{2})\quad S_{1}\ \ne \ S_{2}\quad c\ =\ \operatorname{Code}(\mathsf{GpuPtr}-\mathsf{AddrSpace}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ e\ \Uparrow \ c
\end{array}
```

`ExecutionDomain` is a dispatchable class used for heterogeneous domain handling.

Any type parameter that appears in a field or variant payload of a type satisfying `GpuSafeType` MUST be bounded by `GpuSafe(X)` in the declaration predicate clause.

The key system is not available within GPU execution contexts.

#### 20.2.5 Dynamic Semantics

Inline-domain semantics:

1. `spawn { e }` evaluates `e` immediately and blocks until completion.
2. `dispatch i in range { e }` executes as a sequential loop.
3. No actual parallelism occurs.
4. Capture and permission rules remain enforced.

```math
\begin{array}{l}
\operatorname{GpuMemVisible}(\mathsf{addr},\ S,\ \mathsf{wg},\ \mathsf{wi})\ \Leftrightarrow  \\
\ (S\ =\ \mathsf{Global})\ \lor  \\
\ (S\ =\ \mathsf{Shared}\ \land \ \operatorname{WorkgroupOf}(\mathsf{wi})\ =\ \mathsf{wg})\ \lor  \\
\ (S\ =\ \mathsf{Private}\ \land \ \mathsf{wi}\ =\ \mathsf{CurrentWorkItem})
\end{array}
```

**(GpuPtr-Deref-Visible)**

```math
\begin{array}{l}
G[\mathsf{gpu}_{\mathsf{workitem}}]\ =\ \mathsf{wi}\quad G[\mathsf{gpu}_{\mathsf{workgroup}}]\ =\ \mathsf{wg}\quad \operatorname{GpuMemVisible}(\mathsf{addr},\ S,\ \mathsf{wg},\ \mathsf{wi}) \\
\rule{18em}{0.4pt} \\
G\ \vdash \ \operatorname{Deref}(\operatorname{GpuPtr}(\mathsf{addr},\ S))\ \Downarrow \ \mathsf{ok}
\end{array}
```

**(GpuPtr-Deref-Err)**

```math
\begin{array}{l}
G[\mathsf{gpu}_{\mathsf{workitem}}]\ =\ \mathsf{wi}\quad G[\mathsf{gpu}_{\mathsf{workgroup}}]\ =\ \mathsf{wg}\quad \lnot \operatorname{GpuMemVisible}(\mathsf{addr},\ S,\ \mathsf{wg},\ \mathsf{wi})\quad c\ =\ \operatorname{Code}(E-\mathsf{CON}-0150) \\
\rule{18em}{0.4pt} \\
G\ \vdash \ \operatorname{Deref}(\operatorname{GpuPtr}(\mathsf{addr},\ S))\ \Uparrow \ c
\end{array}
```

```math
\begin{array}{l}
\operatorname{TopologyValid}(\mathsf{topo})\ \Leftrightarrow  \\
\ \mathsf{topo}.\mathsf{WorkgroupSize}.0\ \times \ \mathsf{topo}.\mathsf{WorkgroupSize}.1\ \times \ \mathsf{topo}.\mathsf{WorkgroupSize}.2\ =\ \mathsf{MAX}_{\mathsf{WORKGROUP}\_\mathsf{SIZE}}\ \land  \\
\ \mathsf{topo}.\mathsf{GlobalSize}.0\ =\ \mathsf{topo}.\mathsf{WorkgroupSize}.0\ \times \ \mathsf{topo}.\mathsf{NumWorkgroups}.0\ \land  \\
\ \mathsf{topo}.\mathsf{GlobalSize}.1\ =\ \mathsf{topo}.\mathsf{WorkgroupSize}.1\ \times \ \mathsf{topo}.\mathsf{NumWorkgroups}.1\ \land  \\
\ \mathsf{topo}.\mathsf{GlobalSize}.2\ =\ \mathsf{topo}.\mathsf{WorkgroupSize}.2\ \times \ \mathsf{topo}.\mathsf{NumWorkgroups}.2
\end{array}
```

```math
\mathsf{MAX}_{\mathsf{WORKGROUP}\_\mathsf{SIZE}}\ =\ 1024
```

**(EvalSigma-GPU-Parallel)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(D,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{domain}}),\ \sigma_{1} )\quad \operatorname{IsGpuDomain}(v_{\mathsf{domain}})\quad \Gamma \ \vdash \ \operatorname{GpuInit}(v_{\mathsf{domain}},\ \mathsf{opts})\ \Downarrow \ \mathsf{gpu}_{\mathsf{state}}\quad \Gamma \ \vdash \ \operatorname{EvalGpuBody}(B,\ \sigma_{1} ,\ \mathsf{gpu}_{\mathsf{state}})\ \Downarrow \ (\mathsf{work}_{\mathsf{items}},\ \sigma_{2} )\quad \Gamma \ \vdash \ \operatorname{GpuExecute}(\mathsf{work}_{\mathsf{items}},\ \mathsf{gpu}_{\mathsf{state}})\ \Downarrow \ (\mathsf{results},\ \sigma_{3} )\quad \Gamma \ \vdash \ \operatorname{GpuJoin}(\mathsf{results})\ \Downarrow \ (\mathsf{out},\ \sigma_{4} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{ParallelExpr}(D,\ \mathsf{opts},\ B),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{4} )
\end{array}
```

**(EvalSigma-GPU-Dispatch)**

```math
\begin{array}{l}
\operatorname{GpuContext}(\Gamma )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{range},\ \sigma )\ \Downarrow \ (\operatorname{Val}(r),\ \sigma_{1} )\quad \mathsf{bounds}\ =\ \operatorname{RangeBounds}(r)\quad \mathsf{topology}\ =\ \operatorname{ComputeTopology}(\mathsf{bounds},\ \mathsf{opts})\quad \mathsf{work}_{\mathsf{items}}\ =\ [\operatorname{GpuWorkItem}(i,\ \operatorname{LocalIdFromLinear}(i,\ \mathsf{topology}.\mathsf{WorkgroupSize}),\ \operatorname{WorkgroupIdFromLinear}(i,\ \mathsf{topology}),\ B[i/\mathsf{var}],\ \operatorname{CaptureEnv}(\Gamma ,\ B),\ \mathsf{Pending},\ \emptyset )\ \mid \ i\ \in \ \mathsf{bounds}] \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalGpuDispatch}(\operatorname{DispatchExpr}(\mathsf{var},\ \mathsf{range},\ \bot ,\ \mathsf{opts},\ B),\ \sigma )\ \Downarrow \ (\mathsf{work}_{\mathsf{items}},\ \sigma_{1} )
\end{array}
```

**(GpuExecute-Step)**

```math
\begin{array}{l}
\forall \ \mathsf{wg}\ \in \ \operatorname{Workgroups}(\mathsf{gpu}_{\mathsf{state}}).\ \forall \ \mathsf{wi}\ \in \ \operatorname{WorkItems}(\mathsf{wg}).\ \mathsf{wi}.\mathsf{status}\ =\ \mathsf{Running}\quad \forall \ \mathsf{wi}.\ \Gamma \ \vdash \ \operatorname{EvalGpuWorkItem}(\mathsf{wi}.\mathsf{expr},\ \mathsf{wi}.\mathsf{captures},\ \mathsf{wi}.\mathsf{private}_{\mathsf{mem}})\ \Downarrow \ (\mathsf{out}_{i},\ \mathsf{pm}_{i}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{GpuExecute}(\mathsf{work}_{\mathsf{items}},\ \mathsf{gpu}_{\mathsf{state}})\ \Downarrow \ (\operatorname{GpuWorkItemResults}(\mathsf{work}_{\mathsf{items}}),\ \mathsf{gpu}_{\mathsf{state}}')
\end{array}
```

**(GpuBarrier-Sync)**

```math
\begin{array}{l}
\forall \ \mathsf{wi}\ \in \ \operatorname{WorkItems}(\mathsf{wg}).\ \mathsf{wi}.\mathsf{status}\ =\ \mathsf{AtBarrier} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{GpuWorkgroupSync}(\mathsf{wg})\ \Downarrow \ \operatorname{ResumeAll}(\mathsf{wg})
\end{array}
```

GpuBarrierWait(wg) blocks execution until all work-items in workgroup wg reach the barrier.

`gpu_barrier()` blocks until all work-items in the workgroup reach the barrier. After barrier completion, all shared-memory writes by work-items in that workgroup are visible to all work-items in that workgroup.

**(EvalSigma-GpuBarrier)**

```math
\begin{array}{l}
\operatorname{GpuContext}(\Gamma )\quad \Gamma [\mathsf{gpu}_{\mathsf{workgroup}}]\ =\ \mathsf{wg} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Call}(\operatorname{PathExpr}([\texttt{gpu\_barrier}]),\ []),\ \sigma )\ \Downarrow \ (\operatorname{Val}(()),\ \sigma [\mathsf{wi}.\mathsf{status}\ :=\ \mathsf{AtBarrier}])
\end{array}
```

**(Barrier-Divergence-Err)**

```math
\begin{array}{l}
\operatorname{GpuContext}(\Gamma )\quad \exists \ \mathsf{wi}_{1},\ \mathsf{wi}_{2}\ \in \ \operatorname{WorkItems}(\mathsf{wg}).\ \operatorname{ControlFlowDiverges}(\mathsf{wi}_{1},\ \mathsf{wi}_{2},\ \mathsf{barrier}_{\mathsf{point}}) \\
\rule{18em}{0.4pt} \\
\mathsf{Reject}
\end{array}
```

**(KeyBlock-GPU-Err)**

```math
\begin{array}{l}
\operatorname{GpuContext}(\Gamma ) \\
\rule{18em}{0.4pt} \\
\mathsf{Reject}
\end{array}
```

**(WorkgroupSize-Err)**

```math
\begin{array}{l}
\mathsf{topology}\ =\ \operatorname{ComputeTopology}(\mathsf{bounds},\ \mathsf{opts})\quad \lnot \operatorname{TopologyValid}(\mathsf{topology})\quad c\ =\ \operatorname{Code}(\mathsf{WorkgroupSize}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalGpuDispatch}(\operatorname{DispatchExpr}(\mathsf{var},\ \mathsf{range},\ \bot ,\ \mathsf{opts},\ B),\ \sigma )\ \Uparrow \ c
\end{array}
```

#### 20.2.6 Lowering

**(Lower-Domain-CPU)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{MethodCall}(\mathsf{ctx},\ \texttt{cpu},\ \mathsf{args}))\ \Downarrow \ \langle \operatorname{CpuDomainIR}(\mathsf{args}),\ \operatorname{CpuDomainVal}(\mathsf{args})\rangle 
\end{array}
```

**(Lower-Domain-GPU)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{MethodCall}(\mathsf{ctx},\ \texttt{gpu},\ []))\ \Downarrow \ \langle \mathsf{GpuDomainIR},\ \mathsf{GpuDomainVal}\rangle 
\end{array}
```

**(Lower-Domain-Inline)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{MethodCall}(\mathsf{ctx},\ \texttt{inline},\ []))\ \Downarrow \ \langle \mathsf{InlineDomainIR},\ \mathsf{InlineDomainVal}\rangle 
\end{array}
```

**(Lower-Expr-Parallel-GPU)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(D)\ \Downarrow \ \langle \mathsf{IR}_{d},\ v_{d}\rangle \quad \operatorname{IsGpuDomain}(v_{d})\quad \Gamma \ \vdash \ \operatorname{LowerBlock}(B)\ \Downarrow \ \langle \mathsf{IR}_{b},\ v_{b}\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{ParallelExpr}(D,\ \mathsf{opts},\ B))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{d},\ \operatorname{KernelLaunchIR}(v_{d},\ \mathsf{opts}),\ \operatorname{GpuDispatchIR}(\mathsf{IR}_{b}),\ \mathsf{ParallelJoin}),\ v_{b}\rangle 
\end{array}
```

**(Lower-Expr-GpuBarrier)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{Call}(\operatorname{PathExpr}([\texttt{gpu\_barrier}]),\ []))\ \Downarrow \ \langle \operatorname{GpuBarrierIR}(\texttt{full}),\ \mathsf{UnitVal}\rangle 
\end{array}
```

#### 20.2.7 Diagnostics

| Code         | Severity | Detection    | Condition                                          |
| ------------ | -------- | ------------ | -------------------------------------------------- |
| `E-CON-0150` | Error    | Compile-time | Host/heap memory access in GPU code                |
| `E-CON-0154` | Error    | Compile-time | GPU intrinsic outside GPU context                  |
| `E-CON-0155` | Error    | Compile-time | Key block in GPU context                           |
| `E-CON-0156` | Error    | Compile-time | Barrier outside workgroup context                  |
| `E-CON-0157` | Error    | Compile-time | Workgroup size exceeds device limit                |
| `E-CON-0158` | Error    | Compile-time | Non-uniform control flow at barrier                |
| `E-CON-0159` | Error    | Compile-time | Invalid `dim3_const` in GPU topology option        |
| `E-TYP-2640` | Error    | Compile-time | Type not `GpuSafeType`                             |
| `E-TYP-2641` | Error    | Compile-time | `GpuPtr` address space mismatch                    |
| `E-TYP-2642` | Error    | Compile-time | Generic `GpuSafeType` with unconstrained parameter |

### 20.3 Capture Semantics

#### 20.3.1 Syntax

This section introduces no additional surface syntax beyond closure, `spawn`, and `dispatch` bodies.

#### 20.3.2 Parsing

This section introduces no additional parsing rules.

#### 20.3.3 AST Representation / Form

Capture-set computation is defined by §16.9.4.

This section consumes the following capture classifications from §16.9.4:

- `CaptureSet(C)`
- `MoveCaptureSet(C)`
- `RefCaptureSet(C)`
- `ConstCaptures(C)`
- `SharedCaptures(C)`
- `UniqueCaptures(C)`

```math
\mathsf{GpuCaptureJudg}\ =\ \{\operatorname{GpuCaptureOk}(\Gamma ,\ x,\ T)\}
```

```math
\operatorname{HasHeapProvenance}(\Gamma ,\ x)\ \Leftrightarrow \ \Gamma [x].\mathsf{provenance}\ =\ \pi_{\mathsf{Heap}} \ \lor \ (\Gamma [x].\mathsf{provenance}\ =\ \pi_{\mathsf{Derived}} (y)\ \land \ \operatorname{HasHeapProvenance}(\Gamma ,\ y))
```

#### 20.3.4 Static Semantics

Bindings with `const` permission MAY be captured by reference into `spawn` and `dispatch` bodies.

Bindings with `shared` permission MAY be captured by reference into `spawn` and `dispatch` bodies. Access synchronization is defined by Chapter 19.

Bindings with `unique` permission MUST NOT be captured by closures used in `spawn` or `dispatch` bodies.

**(Parallel-Closure-Capture-Const)**

```math
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{Context}(C)\ \subseteq \ \{\mathsf{SpawnBody},\ \mathsf{DispatchBody}\}\quad x\ \in \ \operatorname{ConstCaptures}(C) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParallelClosureCapture}(C,\ x)\ \Downarrow \ \mathsf{ok}
\end{array}
```

**(Parallel-Closure-Capture-Shared)**

```math
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{Context}(C)\ \subseteq \ \{\mathsf{SpawnBody},\ \mathsf{DispatchBody}\}\quad x\ \in \ \operatorname{SharedCaptures}(C) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParallelClosureCapture}(C,\ x)\ \Downarrow \ \mathsf{ok}
\end{array}
```

**(Parallel-Closure-Capture-Unique-Err)**

```math
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{Context}(C)\ \subseteq \ \{\mathsf{SpawnBody},\ \mathsf{DispatchBody}\}\quad x\ \in \ \operatorname{UniqueCaptures}(C) \\
\rule{18em}{0.4pt} \\
\mathsf{Reject}
\end{array}
```

```math
\begin{array}{l}
\operatorname{OuterParallelBinding}(\Gamma ,\ x)\ \Leftrightarrow \ x\ \mathsf{is}\ \mathsf{bound}\ \mathsf{in}\ \mathsf{an}\ \mathsf{enclosing}\ \texttt{parallel}\ \mathsf{body}\ \mathsf{outside}\ \mathsf{the}\ \mathsf{current}\ \mathsf{child}\ \mathsf{task}\ \mathsf{body} \\
\operatorname{FirstChildMove}(\Gamma ,\ x)\ \Leftrightarrow \ x\ \mathsf{is}\ \mathsf{the}\ \mathsf{unique}\ \mathsf{outer}\ \mathsf{binding}\ \mathsf{selected}\ \mathsf{by}\ \mathsf{the}\ \mathsf{enclosing}\ \mathsf{parallel}\ \mathsf{capture}\ \mathsf{analysis}\ \mathsf{for}\ \mathsf{one}\ \mathsf{child}\ \mathsf{task}
\end{array}
```

**(Parallel-Closure-Capture-Unique-Move-Ok)**

```math
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{Context}(C)\ \subseteq \ \{\mathsf{SpawnBody},\ \mathsf{DispatchBody}\}\quad x\ \in \ \operatorname{UniqueCaptures}(C)\quad \operatorname{ExplicitMove}(x)\quad \operatorname{OuterParallelBinding}(\Gamma ,\ x)\quad \operatorname{FirstChildMove}(\Gamma ,\ x) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParallelClosureCapture}(C,\ x)\ \Downarrow \ \mathsf{ok}
\end{array}
```

**(Parallel-Closure-Capture-OuterMove-Err)**

```math
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{Context}(C)\ \subseteq \ \{\mathsf{SpawnBody},\ \mathsf{DispatchBody}\}\quad x\ \in \ \operatorname{UniqueCaptures}(C)\quad \operatorname{ExplicitMove}(x)\quad \operatorname{OuterParallelBinding}(\Gamma ,\ x)\quad \lnot \ \operatorname{FirstChildMove}(\Gamma ,\ x)\quad c\ =\ \operatorname{Code}(\mathsf{Parallel}-\mathsf{Closure}-\mathsf{Capture}-\mathsf{OuterMove}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParallelClosureCapture}(C,\ x)\ \Uparrow \ c
\end{array}
```

**(Parallel-Escaping-Closure-Spawn-Err)**

```math
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{IsEscaping}(C)\quad \operatorname{SpawnExpr}(\_,\ \_)\ \in \ \mathsf{body} \\
\rule{18em}{0.4pt} \\
\mathsf{Reject}
\end{array}
```

All closures in parallel contexts are classified as local closures for Chapter 19 key analysis. A `spawn` expression is forbidden in the body of an escaping closure.

**(GpuCaptureOk-Const)**

```math
\begin{array}{l}
\operatorname{GpuContext}(\Gamma )\quad \Gamma [x]\ =\ \langle \texttt{const},\ T,\ \_,\ \_\rangle \quad \operatorname{GpuSafeType}(T)\quad \lnot \operatorname{HasHeapProvenance}(\Gamma ,\ x) \\
\rule{18em}{0.4pt} \\
\operatorname{GpuCaptureOk}(\Gamma ,\ x,\ T)
\end{array}
```

**(GpuCaptureOk-Unique-Move)**

```math
\begin{array}{l}
\operatorname{GpuContext}(\Gamma )\quad \Gamma [x]\ =\ \langle \texttt{unique},\ T,\ \_,\ \_\rangle \quad \operatorname{GpuSafeType}(T)\quad \lnot \operatorname{HasHeapProvenance}(\Gamma ,\ x)\quad \operatorname{ExplicitMove}(x) \\
\rule{18em}{0.4pt} \\
\operatorname{GpuCaptureOk}(\Gamma ,\ x,\ T)
\end{array}
```

**(GpuCapture-Shared-Err)**

```math
\begin{array}{l}
\operatorname{GpuContext}(\Gamma )\quad \Gamma [x]\ =\ \langle \texttt{shared},\ T,\ \_,\ \_\rangle  \\
\rule{18em}{0.4pt} \\
\mathsf{Reject}
\end{array}
```

**(GpuCapture-HeapProv-Err)**

```math
\begin{array}{l}
\operatorname{GpuContext}(\Gamma )\quad \operatorname{HasHeapProvenance}(\Gamma ,\ x) \\
\rule{18em}{0.4pt} \\
\mathsf{Reject}
\end{array}
```

**(GpuCapture-NonGpuSafe-Err)**

```math
\begin{array}{l}
\operatorname{GpuContext}(\Gamma )\quad \Gamma [x]\ =\ \langle \_,\ T,\ \_,\ \_\rangle \quad \lnot \operatorname{GpuSafeType}(T) \\
\rule{18em}{0.4pt} \\
\mathsf{Reject}
\end{array}
```

Moved-binding validity checks remain defined by the generic closure-capture rules in §16.9.4.

#### 20.3.5 Dynamic Semantics

This section introduces no additional runtime mechanism beyond:

1. Closure environment construction in §16.9.5.
2. GPU work-item capture environments in §20.2.5.
3. Key synchronization for `shared` captures in Chapter 19.

#### 20.3.6 Lowering

No parallel-specific lowering rule was found. Generic closure-environment lowering is defined by §16.9.6.

#### 20.3.7 Diagnostics

| Code         | Severity | Detection    | Condition                                 |
| ------------ | -------- | ------------ | ----------------------------------------- |
| `E-CON-0120` | Error    | Compile-time | Implicit capture of `unique` binding      |
| `E-CON-0121` | Error    | Compile-time | Move of already-moved binding             |
| `E-CON-0122` | Error    | Compile-time | Move of binding from outer parallel scope |
| `E-CON-0131` | Error    | Compile-time | `spawn` in escaping closure               |
| `E-CON-0151` | Error    | Compile-time | `shared` capture in GPU context           |
| `E-CON-0153` | Error    | Compile-time | Non-GpuSafe type in GPU capture           |

### 20.4 Spawn

#### 20.4.1 Syntax

```text
spawn_expr         ::= "spawn" spawn_option_list? block
spawn_option_list  ::= "[" spawn_option ("," spawn_option)* "]"
spawn_option       ::= "name" ":" string_literal
                     | "affinity" ":" expression
                     | "priority" ":" expression
```

#### 20.4.2 Parsing

Spawn parsing is defined by the following source rules:

- `Parse-Spawn-Expr`
- `Parse-SpawnOptsOpt-None`
- `Parse-SpawnOptsOpt-Yes`
- `Parse-SpawnOptList-Empty`
- `Parse-SpawnOptList-Cons`
- `Parse-SpawnOptListTail-End`
- `Parse-SpawnOptListTail-TrailingComma`
- `Parse-SpawnOptListTail-Comma`
- `Parse-SpawnOpt-Name`
- `Parse-SpawnOpt-Affinity`
- `Parse-SpawnOpt-Priority`

#### 20.4.3 AST Representation / Form

```math
\mathsf{SpawnOpt}\ =\ \{\operatorname{Name}(\mathsf{str}),\ \operatorname{Affinity}(\mathsf{expr}),\ \operatorname{Priority}(\mathsf{expr})\}
```

```math
\mathsf{SpawnOpts}\ =\ [\mathsf{SpawnOpt}]
```

```math
\mathsf{Expr}\ =\ \ldots \ \mid \ \operatorname{SpawnExpr}(\mathsf{opts},\ \mathsf{body})\ \mid \ \ldots 
```

```math
\mathsf{ResolveSpawnOptJudg}\ =\ \{\mathsf{ResolveSpawnOpt},\ \mathsf{ResolveSpawnOpts}\}
```

```math
\operatorname{SpawnOptExprs}([])\ =\ []
```

```math
\operatorname{SpawnOptExprs}(\operatorname{Name}(\_)\ \mathbin{::} \ \mathsf{os})\ =\ \operatorname{SpawnOptExprs}(\mathsf{os})
```

```math
\operatorname{SpawnOptExprs}(\operatorname{Affinity}(e)\ \mathbin{::} \ \mathsf{os})\ =\ [e]\ \mathbin{++} \ \operatorname{SpawnOptExprs}(\mathsf{os})
```

```math
\operatorname{SpawnOptExprs}(\operatorname{Priority}(e)\ \mathbin{::} \ \mathsf{os})\ =\ [e]\ \mathbin{++} \ \operatorname{SpawnOptExprs}(\mathsf{os})
```

```math
\operatorname{States}(\texttt{Spawned})\ =\ \{\ \texttt{@Pending},\ \texttt{@Ready}\ \}
```

See §13.1.4 for the built-in `Spawned<T>` modal declaration, state set, payload, and type registration.

#### 20.4.4 Static Semantics

```math
\operatorname{SpawnOptOk}(\operatorname{Name}(\_))\ \Leftrightarrow \ \mathsf{true}
```

```math
\operatorname{SpawnOptOk}(\operatorname{Affinity}(e))\ \Leftrightarrow \ \Gamma \ \vdash \ e\ :\ \operatorname{TypePath}([\texttt{"CpuSet"}])
```

```math
\operatorname{SpawnOptOk}(\operatorname{Priority}(e))\ \Leftrightarrow \ \Gamma \ \vdash \ e\ :\ \operatorname{TypePath}([\texttt{"Priority"}])
```

```math
\operatorname{SpawnOptsOk}(\mathsf{opts})\ \Leftrightarrow \ \forall \ \mathsf{opt}\ \in \ \mathsf{opts}.\ \operatorname{SpawnOptOk}(\mathsf{opt})
```

An enclosing `parallel_context` is required. The enclosing-context diagnostic is owned by §20.1.7.

**(T-Spawn)**

```math
\begin{array}{l}
\Gamma [\mathsf{parallel}_{\mathsf{context}}]\ =\ D\quad \operatorname{SpawnOptsOk}(\mathsf{opts})\quad \Gamma_{\mathsf{capture}} \ \vdash \ e\ :\ T \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \texttt{spawn}\ \mathsf{opts}\ \{e\}\ :\ \mathsf{Spawned}\langle T\rangle 
\end{array}
```

#### 20.4.5 Dynamic Semantics

```math
\mathsf{SpawnHandle}\ =\ \{\mathsf{id}\ :\ \mathbb{N} ,\ \mathsf{state}\ :\ \mathsf{Pending}\ \mid \ \operatorname{Ready}(\mathsf{Value})\ \mid \ \operatorname{Failed}(\mathsf{Panic})\}
```

```math
\operatorname{CapturedEnv}(e,\ \sigma )\ =\ \{\ x\ \mapsto \ \operatorname{LookupVal}(\sigma ,\ x)\ \mid \ x\ \in \ \operatorname{FreeVars}(e)\ \}
```

```math
\operatorname{EnqueueWork}(\mathsf{pstate},\ w,\ \mathsf{opts})\ \Downarrow \ \mathsf{pstate}'\ \Leftrightarrow \ \mathsf{pstate}'\ =\ \mathsf{pstate}[\mathsf{Handles}\ :=\ \mathsf{pstate}.\mathsf{Handles}\ \mathbin{++} \ [\operatorname{SpawnedVal}(@\mathsf{Pending},\ w.\mathsf{id})]]\ \mathsf{and}\ \mathsf{work}\ \mathsf{item}\ \texttt{w}\ \mathsf{is}\ \mathsf{submitted}\ \mathsf{to}\ \texttt{pstate.Domain}\ \mathsf{subject}\ \mathsf{to}\ \texttt{opts}
```

Evaluation of `spawn [opts] { e }`:

1. Capture free variables per §20.3.
2. Package the captured environment and body into a work item.
3. If `affinity` is present, restrict worker selection to CPU indices whose bits are set in the `CpuSet` mask; if the set is empty, use the domain default.
4. If `priority` is present, assign the task the given `Priority`. When multiple tasks are ready, workers MUST select any task of maximal priority among those ready.
5. Enqueue the work item.
6. Return `Spawned<T>@Pending` immediately.

**(EvalSigma-Spawn)**

```math
\begin{array}{l}
\Gamma [\mathsf{parallel}_{\mathsf{context}}]\ =\ \mathsf{pstate}\quad \mathsf{caps}\ =\ \operatorname{CapturedEnv}(e,\ \sigma )\quad w\ =\ \{\mathsf{id}:\ \operatorname{NextWorkId}(\mathsf{pstate}),\ \mathsf{expr}:\ e,\ \mathsf{captures}:\ \mathsf{caps},\ \mathsf{status}:\ \mathsf{Pending}\}\quad \operatorname{EnqueueWork}(\mathsf{pstate},\ w,\ \mathsf{opts})\ \Downarrow \ \mathsf{pstate}'\quad \mathsf{handle}\ =\ \operatorname{SpawnedVal}(@\mathsf{Pending},\ w.\mathsf{id}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{SpawnExpr}(\mathsf{opts},\ e),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{handle}),\ \sigma [\mathsf{parallel}_{\mathsf{context}}\ \mapsto \ \mathsf{pstate}'])
\end{array}
```

Result retrieval for `Spawned<T>` handles is defined by §21.2.

#### 20.4.6 Lowering

**(Lower-Expr-Spawn)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerBlock}(e)\ \Downarrow \ \langle \mathsf{IR}_{b},\ v_{b}\rangle \quad \mathsf{caps}\ =\ \operatorname{CaptureSet}(e) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{SpawnExpr}(\mathsf{opts},\ e))\ \Downarrow \ \langle \operatorname{SeqIR}(\operatorname{TaskCreate}(\mathsf{caps},\ \mathsf{opts},\ \mathsf{IR}_{b}),\ \mathsf{TaskEnqueue}),\ \mathsf{SpawnHandleVal}\rangle 
\end{array}
```

#### 20.4.7 Diagnostics

| Code         | Severity | Detection    | Condition                    |
| ------------ | -------- | ------------ | ---------------------------- |
| `E-CON-0130` | Error    | Compile-time | Invalid spawn attribute type |

### 20.5 Dispatch

#### 20.5.1 Syntax

```text
dispatch_expr         ::= "dispatch" pattern "in" range_expression key_clause? dispatch_option_list? block
key_clause            ::= "key" key_path_expr key_mode
key_mode              ::= "read" | "write"
dispatch_option_list  ::= "[" dispatch_option ("," dispatch_option)* "]"
dispatch_option       ::= "reduce" ":" reduce_op
                        | "ordered"
                        | "chunk" ":" expression
                        | "workgroup" ":" dim3_const
reduce_op             ::= "+" | "*" | "min" | "max" | "and" | "or" | identifier
```

#### 20.5.2 Parsing

Dispatch parsing is defined by the following source rules:

- `Parse-Dispatch-Expr`
- `Parse-KeyClauseOpt-None`
- `Parse-KeyClauseOpt-Yes`
- `Parse-DispatchOptsOpt-None`
- `Parse-DispatchOptsOpt-Yes`
- `Parse-DispatchOptList-Empty`
- `Parse-DispatchOptList-Cons`
- `Parse-DispatchOptListTail-End`
- `Parse-DispatchOptListTail-TrailingComma`
- `Parse-DispatchOptListTail-Comma`
- `Parse-ReduceOp-Op`
- `Parse-ReduceOp-Ident`
- `Parse-DispatchOpt-Reduce`
- `Parse-DispatchOpt-Ordered`
- `Parse-DispatchOpt-Chunk`
- `Parse-DispatchOpt-Workgroup`

The fixed identifiers `min`, `max`, `and`, and `or` are tokenized as identifiers by Chapter 4 and are accepted in dispatch position by `Parse-ReduceOp-Ident`.

#### 20.5.3 AST Representation / Form

```math
\mathsf{ReduceOp}\ =\ \{\texttt{+},\ \texttt{*},\ \texttt{min},\ \texttt{max},\ \texttt{and},\ \texttt{or}\}\ \cup \ \mathsf{Identifier}
```

```math
\mathsf{DispatchOpt}\ =\ \{\operatorname{Reduce}(\mathsf{op}),\ \mathsf{Ordered},\ \operatorname{Chunk}(\mathsf{expr}),\ \operatorname{Workgroup}(\mathsf{dim3})\}\quad \mathsf{op}\ \in \ \mathsf{ReduceOp}
```

```math
\mathsf{DispatchOpts}\ =\ [\mathsf{DispatchOpt}]
```

```math
\mathsf{KeyClause}\ =\ \langle \mathsf{path},\ \mathsf{mode}\rangle 
```

```math
\mathsf{KeyClauseOpt}\ =\ \{\bot \}\ \cup \ \mathsf{KeyClause}
```

```math
\mathsf{Expr}\ =\ \ldots \ \mid \ \operatorname{DispatchExpr}(\mathsf{pat},\ \mathsf{range},\ \mathsf{key}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{opts},\ \mathsf{body})\ \mid \ \ldots 
```

```math
\mathsf{ResolveKeyClauseJudg}\ =\ \{\mathsf{ResolveKeyClauseOpt}\}
```

```math
\mathsf{ResolveDispatchOptJudg}\ =\ \{\mathsf{ResolveDispatchOpt},\ \mathsf{ResolveDispatchOpts}\}
```

```math
\operatorname{DispatchOptExprs}([])\ =\ []
```

```math
\operatorname{DispatchOptExprs}(\operatorname{Reduce}(\_)\ \mathbin{::} \ \mathsf{os})\ =\ \operatorname{DispatchOptExprs}(\mathsf{os})
```

```math
\operatorname{DispatchOptExprs}(\mathsf{Ordered}\ \mathbin{::} \ \mathsf{os})\ =\ \operatorname{DispatchOptExprs}(\mathsf{os})
```

```math
\operatorname{DispatchOptExprs}(\operatorname{Chunk}(e)\ \mathbin{::} \ \mathsf{os})\ =\ [e]\ \mathbin{++} \ \operatorname{DispatchOptExprs}(\mathsf{os})
```

```math
\operatorname{DispatchOptExprs}(\operatorname{Workgroup}(e)\ \mathbin{::} \ \mathsf{os})\ =\ [e]\ \mathbin{++} \ \operatorname{DispatchOptExprs}(\mathsf{os})
```

```math
\mathsf{DispatchAccess}\ =\ \langle \mathsf{schema},\ \mathsf{mode}\rangle \quad \mathsf{mode}\ \in \ \{\mathsf{Read},\ \mathsf{Write}\}
```

```math
\mathsf{DispatchAccessSet}\ =\ [\mathsf{DispatchAccess}]
```

#### 20.5.4 Static Semantics

An enclosing `parallel_context` is required. The enclosing-context diagnostics are owned by §§20.1.7 and 20.5.7.

**(T-Dispatch)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \mathsf{range}\ :\ \mathsf{Range}<I>\quad \Gamma ,\ i\ :\ I\ \vdash \ B\ :\ T \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \texttt{dispatch}\ i\ \texttt{in range}\ \{B\}\ :\ ()
\end{array}
```

**(T-Dispatch-Reduce)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \mathsf{range}\ :\ \mathsf{Range}<I>\quad \Gamma ,\ i\ :\ I\ \vdash \ B\ :\ T\quad \Gamma \ \vdash \ \mathsf{op}\ :\ (T,\ T)\ \to \ T \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \texttt{dispatch}\ i\ \texttt{in range [reduce: op]}\ \{B\}\ :\ T
\end{array}
```

**(T-GPU-Dispatch)**

```math
\begin{array}{l}
\operatorname{GpuContext}(\Gamma )\quad \Gamma \ \vdash \ \mathsf{range}\ :\ \mathsf{Range}<I>\quad \Gamma ,\ i\ :\ I\ \vdash \ B\ :\ T\quad \mathsf{topology}\ =\ \operatorname{ComputeTopologyDispatch}(\operatorname{RangeBounds}(\mathsf{range}),\ \mathsf{opts})\quad \operatorname{TopologyValid}(\mathsf{topology})\quad \forall \ x\ \in \ \operatorname{FreeVars}(B).\ \operatorname{GpuCaptureOk}(\Gamma ,\ x,\ \Gamma [x].\mathsf{type}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{DispatchExpr}(i,\ \mathsf{range},\ \bot ,\ \mathsf{opts},\ B)\ :\ ()
\end{array}
```

**(T-GPU-Dispatch-Reduce)**

```math
\begin{array}{l}
\operatorname{GpuContext}(\Gamma )\quad \Gamma \ \vdash \ \mathsf{range}\ :\ \mathsf{Range}<I>\quad \Gamma ,\ i\ :\ I\ \vdash \ B\ :\ T\quad \Gamma \ \vdash \ \mathsf{op}\ :\ (T,\ T)\ \to \ T\quad \operatorname{GpuSafeType}(T)\quad \mathsf{topology}\ =\ \operatorname{ComputeTopologyDispatch}(\operatorname{RangeBounds}(\mathsf{range}),\ \mathsf{opts})\quad \operatorname{TopologyValid}(\mathsf{topology})\quad \forall \ x\ \in \ \operatorname{FreeVars}(B).\ \operatorname{GpuCaptureOk}(\Gamma ,\ x,\ \Gamma [x].\mathsf{type}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{DispatchExpr}(i,\ \mathsf{range},\ \operatorname{Reduce}(\mathsf{op}),\ \mathsf{opts},\ B)\ :\ T
\end{array}
```

```math
\operatorname{DispatchPatternVars}(\mathsf{pat})\ =\ \operatorname{PatNames}(\mathsf{pat})
```

```math
\operatorname{PathRootVar}(\mathsf{expr})\ =\ x\ \Leftrightarrow \ \operatorname{KeyPath}(\mathsf{expr})\ \mathsf{is}\ \mathsf{rooted}\ \mathsf{at}\ \mathsf{binding}\ \texttt{x}
```

```math
\operatorname{DispatchInvariant}(\mathsf{expr},\ \mathsf{pat})\ \Leftrightarrow \ \operatorname{FreeVars}(\mathsf{expr})\ \setminus \ \{\operatorname{PathRootVar}(\mathsf{expr})\}\ \subseteq \ \operatorname{DispatchPatternVars}(\mathsf{pat})\ \cup \ \{\ x\ \mid \ x\ \in \ \operatorname{dom}(\Gamma )\ \land \ \Gamma [x]\ =\ \operatorname{TypePerm}(\texttt{const},\ \_)\ \}
```

```math
\operatorname{InsideKeyBlock}(B,\ e)\ \Leftrightarrow \ \exists \ K.\ K\ \mathsf{is}\ a\ \mathsf{key}\ \mathsf{block}\ \mathsf{in}\ \texttt{B}\ \mathsf{and}\ \texttt{e}\ \mathsf{is}\ a\ \mathsf{proper}\ \mathsf{subexpression}\ \mathsf{of}\ \texttt{K.body}
```

```math
\begin{array}{l}
\operatorname{ImplicitDispatchUse}(B,\ e)\ \Leftrightarrow  \\
\ e\ \in \ \operatorname{Subexpressions}(B)\ \land  \\
\ \lnot \operatorname{InsideKeyBlock}(B,\ e)\ \land  \\
\ (\exists \ T.\ \Gamma \ \vdash \ e\ :\ \operatorname{TypePerm}(\texttt{shared},\ T)\ \lor \ \Gamma \ \vdash \ e\ :\mathsf{place}\ \operatorname{TypePerm}(\texttt{shared},\ T))\ \land  \\
\ \operatorname{KeyPath}(e)\ \mathsf{is}\ \mathsf{defined}\ \land  \\
\ \operatorname{RequiredMode}(e)\ \mathsf{is}\ \mathsf{defined}
\end{array}
```

```math
\operatorname{SchemaOf}(\mathsf{pat},\ e)\ =\ S\ \Leftrightarrow \ S\ \mathsf{is}\ \texttt{KeyPath(e)}\ \mathsf{with}\ \mathsf{occurrences}\ \mathsf{of}\ \mathsf{bindings}\ \mathsf{in}\ \texttt{DispatchPatternVars(pat)}\ \mathsf{left}\ \mathsf{symbolic}\ \mathsf{and}\ \mathsf{all}\ \mathsf{other}\ \mathsf{subexpressions}\ \mathsf{preserved}
```

```math
\operatorname{JoinDispatchMode}(\mathsf{Read},\ \mathsf{Read})\ =\ \mathsf{Read}
```

```math
\operatorname{JoinDispatchMode}(\_,\ \_)\ =\ \mathsf{Write}
```

```math
\operatorname{MergeDispatchAccesses}(\mathsf{raw})\ =\ \mathsf{merged}\ \mathsf{where}\ \texttt{merged}\ \mathsf{contains}\ \mathsf{one}\ \mathsf{entry}\ \mathsf{per}\ \mathsf{distinct}\ \mathsf{schema}\ \mathsf{and}\ \mathsf{the}\ \mathsf{mode}\ \mathsf{for}\ \mathsf{each}\ \mathsf{schema}\ \mathsf{is}\ \mathsf{the}\ \mathsf{join}\ \mathsf{of}\ \mathsf{all}\ \mathsf{modes}\ \mathsf{attached}\ \mathsf{to}\ \mathsf{that}\ \mathsf{schema}\ \mathsf{in}\ \texttt{raw}
```

```math
\begin{array}{l}
\operatorname{InferDispatchAccesses}(\mathsf{pat},\ B)\ =\ \mathsf{merged}\ \Leftrightarrow  \\
\ \mathsf{raw}\ =\ [\langle \operatorname{SchemaOf}(\mathsf{pat},\ e),\ \operatorname{RequiredMode}(e)\rangle \ \mid \ e\ \in \ \operatorname{Subexpressions}(B)\ \land \ \operatorname{ImplicitDispatchUse}(B,\ e)\ \land \ \operatorname{DispatchInvariant}(\operatorname{KeyPath}(e),\ \mathsf{pat})]\ \land  \\
\ \operatorname{MergeDispatchAccesses}(\mathsf{raw})\ =\ \mathsf{merged}
\end{array}
```

```math
\begin{array}{l}
\operatorname{ChunkExpr}(\mathsf{opts})\ =\ e\ \Leftrightarrow \ \operatorname{Chunk}(e)\ \in \ \mathsf{opts} \\
\operatorname{ChunkExpr}(\mathsf{opts})\ =\ \bot \ \Leftrightarrow \ \forall \ o\ \in \ \mathsf{opts}.\ o\ \ne \ \operatorname{Chunk}(\_) \\
\operatorname{AssociativeReduce}(\texttt{+})\ \Leftrightarrow \ \mathsf{true} \\
\operatorname{AssociativeReduce}(\texttt{*})\ \Leftrightarrow \ \mathsf{true} \\
\operatorname{AssociativeReduce}(\texttt{min})\ \Leftrightarrow \ \mathsf{true} \\
\operatorname{AssociativeReduce}(\texttt{max})\ \Leftrightarrow \ \mathsf{true} \\
\operatorname{AssociativeReduce}(\texttt{and})\ \Leftrightarrow \ \mathsf{true} \\
\operatorname{AssociativeReduce}(\texttt{or})\ \Leftrightarrow \ \mathsf{true} \\
\operatorname{AssociativeReduce}(\_)\ \Leftrightarrow \ \mathsf{false} \\
\operatorname{DispatchStaticIndexExpr}(\mathsf{pat},\ e)\ \Leftrightarrow  \\
\ e\ \mathsf{is}\ a\ \mathsf{compile}-\mathsf{time}\ \mathsf{constant}\ \mathsf{expression}\ \lor  \\
\ (e\ =\ x\ \land \ x\ \in \ \operatorname{DispatchPatternVars}(\mathsf{pat}))\ \lor  \\
\ (e\ =\ e_{0}.f\ \land \ \operatorname{DispatchStaticIndexExpr}(\mathsf{pat},\ e_{0}))\ \lor  \\
\ (e\ =\ e_{0}.n\ \land \ \operatorname{DispatchStaticIndexExpr}(\mathsf{pat},\ e_{0}))\ \lor  \\
\ (e\ =\ e_{0}[e_{1}]\ \land \ \operatorname{DispatchStaticIndexExpr}(\mathsf{pat},\ e_{0})\ \land \ \operatorname{DispatchStaticIndexExpr}(\mathsf{pat},\ e_{1}))\ \lor  \\
\ (e\ =\ \mathsf{op}\ e_{0}\ \land \ \operatorname{DispatchStaticIndexExpr}(\mathsf{pat},\ e_{0}))\ \lor  \\
\ (e\ =\ e_{0}\ \mathsf{op}\ e_{1}\ \land \ \operatorname{DispatchStaticIndexExpr}(\mathsf{pat},\ e_{0})\ \land \ \operatorname{DispatchStaticIndexExpr}(\mathsf{pat},\ e_{1}))\ \lor  \\
\ (e\ =\ \operatorname{cast}(e_{0},\ \_)\ \land \ \operatorname{DispatchStaticIndexExpr}(\mathsf{pat},\ e_{0})) \\
\operatorname{DynamicKeyPattern}(\mathsf{pat},\ \mathsf{spec})\ \Leftrightarrow \ \exists \ \langle S,\ \_\rangle \ \in \ \mathsf{spec}.\ S\ \mathsf{contains}\ \mathsf{an}\ \mathsf{index}\ \mathsf{expression}\ e\ \land \ \lnot \ \operatorname{DispatchStaticIndexExpr}(\mathsf{pat},\ e)
\end{array}
```

**(Dispatch-Infer-Err)**

```math
\begin{array}{l}
e\ \in \ \operatorname{Subexpressions}(B)\quad \operatorname{ImplicitDispatchUse}(B,\ e)\quad \lnot \ \operatorname{DispatchInvariant}(\operatorname{KeyPath}(e),\ \mathsf{pat}) \\
\rule{18em}{0.4pt} \\
\mathsf{Reject}
\end{array}
```

**(Dispatch-Outside-Err)**

```math
\begin{array}{l}
\Gamma [\mathsf{parallel}_{\mathsf{context}}]\ =\ \bot \quad c\ =\ \operatorname{Code}(\mathsf{Dispatch}-\mathsf{Outside}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{DispatchExpr}(\mathsf{pat},\ \mathsf{range},\ \mathsf{key}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{opts},\ \mathsf{body})\ \Uparrow \ c
\end{array}
```

**(Dispatch-Chunk-Type-Err)**

```math
\begin{array}{l}
\operatorname{Chunk}(e)\ \in \ \mathsf{opts}\quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ T\quad T\ \ne \ \operatorname{TypePrim}(\texttt{"usize"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{DispatchExpr}(\mathsf{pat},\ \mathsf{range},\ \mathsf{key}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{opts},\ \mathsf{body})\ \Uparrow 
\end{array}
```

**(Dispatch-Dependency-Err)**

```math
\begin{array}{l}
\operatorname{InferDispatchAccesses}(\mathsf{pat},\ B)\ =\ \mathsf{spec}\quad \exists \ \langle S_{a},\ M_{a}\rangle ,\ \langle S_{b},\ M_{b}\rangle \ \in \ \mathsf{spec}.\ \lnot \ \operatorname{ProvablyDisjointPath}(S_{a},\ S_{b})\ \land \ \lnot \ \operatorname{KeyModeCompatible}(M_{a},\ M_{b})\quad c\ =\ \operatorname{Code}(\mathsf{Dispatch}-\mathsf{Dependency}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{DispatchExpr}(\mathsf{pat},\ \mathsf{range},\ \mathsf{key}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{opts},\ \mathsf{body})\ \Uparrow \ c
\end{array}
```

**(Dispatch-Reduce-Assoc-Err)**

```math
\begin{array}{l}
\operatorname{Reduce}(\mathsf{op})\ \in \ \mathsf{opts}\quad \mathsf{Ordered}\ \notin \ \mathsf{opts}\quad \lnot \ \operatorname{AssociativeReduce}(\mathsf{op})\quad c\ =\ \operatorname{Code}(\mathsf{Dispatch}-\mathsf{Reduce}-\mathsf{Assoc}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{DispatchExpr}(\mathsf{pat},\ \mathsf{range},\ \mathsf{key}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{opts},\ \mathsf{body})\ \Uparrow \ c
\end{array}
```

**(Dispatch-DynamicKey-Warn)**

```math
\begin{array}{l}
\operatorname{DispatchPartitionSpec}(\mathsf{pat},\ \mathsf{key}_{\mathsf{clause}\_\mathsf{opt}},\ B)\ =\ \mathsf{spec}\quad \operatorname{DynamicKeyPattern}(\mathsf{pat},\ \mathsf{spec})\quad w\ =\ \operatorname{Code}(\mathsf{Dispatch}-\mathsf{DynamicKey}-\mathsf{Warn}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{WarnDispatch}(\operatorname{DispatchExpr}(\mathsf{pat},\ \mathsf{range},\ \mathsf{key}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{opts},\ \mathsf{body}))\ \Downarrow \ w
\end{array}
```

When no explicit `key` clause is present, the implementation MUST infer a dispatch partition summary using `InferDispatchAccesses`.

`dispatch` v `in` r { … a[v] … }

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\forall \ v_{1},\ v_{2}\ \in \ r,\ v_{1}\ \ne \ v_{2}\ \Rightarrow \ \operatorname{ProvablyDisjoint}(a[v_{1}],\ a[v_{2}])
\end{array}
```

Reduction operators MUST be associative unless `[ordered]` is present.

`chunk: e` is evaluated exactly once before partitioning. `e` MUST have type `usize`. The resulting positive integer partitions each post-key-partition group into contiguous chunks of at most that size.

#### 20.5.5 Dynamic Semantics

```math
\operatorname{DispatchPartitionSpec}(\mathsf{pat},\ \mathsf{key}_{\mathsf{clause}},\ B)\ =\ [\langle \operatorname{SchemaOf}(\mathsf{pat},\ \mathsf{key}_{e}),\ \operatorname{ModeOf}(\mathsf{key}_{\mathsf{clause}})\rangle ]\ \Leftrightarrow \ \mathsf{key}_{\mathsf{clause}}\ =\ \texttt{key}\ \mathsf{key}_{e}\ \mathsf{mode}
```

```math
\operatorname{DispatchPartitionSpec}(\mathsf{pat},\ \bot ,\ B)\ =\ \mathsf{ks}\ \Leftrightarrow \ \operatorname{InferDispatchAccesses}(\mathsf{pat},\ B)\ =\ \mathsf{ks}
```

```math
\operatorname{InstantiateSchema}(S,\ v)\ =\ P\ \Leftrightarrow \ \texttt{P}\ \mathsf{is}\ \mathsf{obtained}\ \mathsf{by}\ \mathsf{substituting}\ \texttt{v}\ \mathsf{for}\ \mathsf{the}\ \mathsf{dispatch}-\mathsf{pattern}\ \mathsf{bindings}\ \mathsf{in}\ \texttt{S}
```

IdxNorm(e) is `e` with harmless parentheses and expression attributes removed

```math
e_{1}\ \equiv_{\mathsf{idx}} \ e_{2}\ \Leftrightarrow \ \operatorname{IdxNorm}(e_{1})\ \mathsf{and}\ \operatorname{IdxNorm}(e_{2})\ \mathsf{are}\ \mathsf{syntactically}\ \mathsf{identical}
```

```math
\begin{array}{l}
\operatorname{AffineDispatchIndex}(e)\ =\ \langle x,\ k\rangle \ \Leftrightarrow  \\
\ (e\ =\ x\ \land \ k\ =\ 0)\ \lor  \\
\ (e\ =\ x\ +\ n\ \land \ n\ \mathsf{is}\ a\ \mathsf{compile}-\mathsf{time}\ \mathsf{constant}\ \mathsf{integer}\ \mathsf{expression}\ \mathsf{with}\ \mathsf{value}\ k)\ \lor  \\
\ (e\ =\ x\ -\ n\ \land \ n\ \mathsf{is}\ a\ \mathsf{compile}-\mathsf{time}\ \mathsf{constant}\ \mathsf{integer}\ \mathsf{expression}\ \mathsf{with}\ \mathsf{value}\ n_{0}\ \land \ k\ =\ -n_{0})\ \lor  \\
\ (e\ =\ n\ +\ x\ \land \ n\ \mathsf{is}\ a\ \mathsf{compile}-\mathsf{time}\ \mathsf{constant}\ \mathsf{integer}\ \mathsf{expression}\ \mathsf{with}\ \mathsf{value}\ k)
\end{array}
```

```math
\begin{array}{l}
\operatorname{ProvablyDisjoint}(e_{1},\ e_{2})\ \Leftrightarrow  \\
\ (e_{1}\ \mathsf{and}\ e_{2}\ \mathsf{are}\ \mathsf{distinct}\ \mathsf{integer}\ \mathsf{literals})\ \lor  \\
\ (\operatorname{AffineDispatchIndex}(e_{1})\ =\ \langle x,\ k_{1}\rangle \ \land \ \operatorname{AffineDispatchIndex}(e_{2})\ =\ \langle x,\ k_{2}\rangle \ \land \ k_{1}\ \ne \ k_{2})
\end{array}
```

```math
\begin{array}{l}
\operatorname{ProvablyDisjointPath}(P,\ Q)\ \Leftrightarrow \ \exists \ k.\ \operatorname{PrefixEqThrough}(P,\ Q,\ k-1)\ \land \ \operatorname{SegmentProvablyDisjoint}(P[k],\ Q[k]) \\
\operatorname{PrefixEqThrough}(P,\ Q,\ 0)\ \Leftrightarrow \ \mathsf{true} \\
\operatorname{PrefixEqThrough}(P,\ Q,\ k)\ \Leftrightarrow \ \forall \ r\ \in \ 1..k.\ \operatorname{SegEqForDispatch}(P[r],\ Q[r])
\end{array}
```

```math
\operatorname{SegEqForDispatch}(\operatorname{Root}(x),\ \operatorname{Root}(y))\ \Leftrightarrow \ x\ =\ y
```

```math
\operatorname{SegEqForDispatch}(\operatorname{Field}(\_,\ f),\ \operatorname{Field}(\_,\ g))\ \Leftrightarrow \ f\ =\ g
```

```math
\operatorname{SegEqForDispatch}(\operatorname{Index}(\_,\ e_{1}),\ \operatorname{Index}(\_,\ e_{2}))\ \Leftrightarrow \ e_{1}\ \equiv_{\mathsf{idx}} \ e_{2}
```

```math
\operatorname{SegmentProvablyDisjoint}(\operatorname{Root}(x),\ \operatorname{Root}(y))\ \Leftrightarrow \ x\ \ne \ y
```

```math
\operatorname{SegmentProvablyDisjoint}(\operatorname{Field}(\_,\ f),\ \operatorname{Field}(\_,\ g))\ \Leftrightarrow \ f\ \ne \ g
```

```math
\operatorname{SegmentProvablyDisjoint}(\operatorname{Index}(\_,\ e_{1}),\ \operatorname{Index}(\_,\ e_{2}))\ \Leftrightarrow \ \operatorname{ProvablyDisjoint}(e_{1},\ e_{2})
```

```math
\begin{array}{l}
\operatorname{PartitionByKey}(\mathsf{range},\ \mathsf{key}_{\mathsf{spec}})\ =\ [\mathsf{Group}_{1},\ \ldots ,\ \mathsf{Group}_{k}]\ \Leftrightarrow  \\
\ \operatorname{IterBounds}(\mathsf{range})\ =\ (\mathsf{start},\ \mathsf{end})\ \land  \\
\ \mathsf{indices}\ =\ [\mathsf{start},\ \mathsf{start}+1,\ \ldots ,\ \mathsf{end}-1]\ \land  \\
\ \operatorname{Conflict}(i,\ j)\ \Leftrightarrow \ i\ \ne \ j\ \land \ (\exists \ \langle S_{a},\ M_{a}\rangle \ \in \ \mathsf{key}_{\mathsf{spec}},\ \langle S_{b},\ M_{b}\rangle \ \in \ \mathsf{key}_{\mathsf{spec}}.\ P_{i}\ =\ \operatorname{InstantiateSchema}(S_{a},\ i)\ \land \ P_{j}\ =\ \operatorname{InstantiateSchema}(S_{b},\ j)\ \land \ \lnot \ \operatorname{ProvablyDisjointPath}(P_{i},\ P_{j})\ \land \ \lnot \ \operatorname{KeyModeCompatible}(M_{a},\ M_{b}))\ \land  \\
\ \operatorname{ConnectedComponents}(\mathsf{indices},\ \mathsf{Conflict})\ =\ [\mathsf{Group}_{1},\ \ldots ,\ \mathsf{Group}_{k}]\ \land  \\
\ \operatorname{OrderedByLeastMember}([\mathsf{Group}_{1},\ \ldots ,\ \mathsf{Group}_{k}])
\end{array}
```

```math
\begin{array}{l}
\operatorname{DispatchPartition}(\mathsf{pat},\ \mathsf{range},\ \mathsf{key}_{\mathsf{clause}},\ B)\ =\ [\mathsf{Group}_{1},\ \ldots ,\ \mathsf{Group}_{k}]\ \Leftrightarrow \ \operatorname{DispatchPartitionSpec}(\mathsf{pat},\ \mathsf{key}_{\mathsf{clause}},\ B)\ =\ \mathsf{key}_{\mathsf{spec}}\ \land \ \operatorname{PartitionByKey}(\mathsf{range},\ \mathsf{key}_{\mathsf{spec}})\ =\ [\mathsf{Group}_{1},\ \ldots ,\ \mathsf{Group}_{k}] \\
\operatorname{TotalIterations}([\mathsf{Group}_{1},\ \ldots ,\ \mathsf{Group}_{k}])\ =\ \Sigma \_\{i=1..k\}\ \mid \mathsf{Group}_{i}\mid 
\end{array}
```

```math
\operatorname{ReduceOpOf}(\mathsf{attrs})\ =\ \mathsf{op}\ \Leftrightarrow \ \operatorname{Reduce}(\mathsf{op})\ \in \ \mathsf{attrs}
```

```math
\operatorname{ReduceOpOf}(\mathsf{attrs})\ =\ \bot \ \Leftrightarrow \ \forall \ a\ \in \ \mathsf{attrs}.\ a\ \ne \ \operatorname{Reduce}(\_)
```

```math
\begin{array}{l}
\operatorname{ChunkSizeOf}(\mathsf{attrs},\ \sigma )\ \Downarrow \ (n,\ \sigma ')\ \Leftrightarrow \ \operatorname{ChunkExpr}(\mathsf{attrs})\ =\ \bot \ \land \ n\ =\ 1\ \land \ \sigma '\ =\ \sigma  \\
\operatorname{ChunkSizeOf}(\mathsf{attrs},\ \sigma )\ \Downarrow \ (n,\ \sigma_{1} )\ \Leftrightarrow \ \operatorname{ChunkExpr}(\mathsf{attrs})\ =\ e\ \land \ \Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{IntVal}(\texttt{"usize"},\ n)),\ \sigma_{1} )\ \land \ n\ >\ 0
\end{array}
```

```math
\begin{array}{l}
\operatorname{ContiguousChunks}([],\ n)\ =\ [] \\
\operatorname{ContiguousChunks}([i_{1},\ \ldots ,\ i_{k}],\ n)\ =\ [[i_{1},\ \ldots ,\ i_{m}]]\ \mathbin{++} \ \operatorname{ContiguousChunks}([i\_\{m+1\},\ \ldots ,\ i_{k}],\ n)\ \mathsf{where}\ m\ =\ \operatorname{min}(n,\ k) \\
\operatorname{ChunkGroups}(\mathsf{groups},\ n)\ =\ \operatorname{concat}([\operatorname{ContiguousChunks}(G,\ n)\ \mid \ G\ \in \ \mathsf{groups}])
\end{array}
```

**(EvalSigma-Dispatch)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{range},\ \sigma )\ \Downarrow \ (\operatorname{Val}(r),\ \sigma_{1} )\quad \operatorname{ChunkSizeOf}(\mathsf{attrs},\ \sigma_{1} )\ \Downarrow \ (n,\ \sigma_{2} )\quad \operatorname{DispatchPartition}(\mathsf{pat},\ r,\ \mathsf{key}_{\mathsf{opt}},\ B)\ =\ \mathsf{groups}_{0}\quad \mathsf{groups}\ =\ \operatorname{ChunkGroups}(\mathsf{groups}_{0},\ n)\quad \operatorname{ReduceOpOf}(\mathsf{attrs})\ =\ \mathsf{reduce}_{\mathsf{opt}}\quad \Gamma \ \vdash \ \operatorname{DispatchRun}(\mathsf{pat},\ B,\ \mathsf{groups},\ \mathsf{reduce}_{\mathsf{opt}},\ \sigma_{2} )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{DispatchExpr}(\mathsf{pat},\ \mathsf{range},\ \mathsf{key}_{\mathsf{opt}},\ \mathsf{attrs},\ B),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} )
\end{array}
```

**(EvalSigma-Dispatch-Range-Ctrl)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{range},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{DispatchExpr}(\mathsf{pat},\ \mathsf{range},\ \mathsf{key}_{\mathsf{opt}},\ \mathsf{attrs},\ B),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
```

**(EvalSigma-Dispatch-Chunk-Ctrl)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{range},\ \sigma )\ \Downarrow \ (\operatorname{Val}(r),\ \sigma_{1} )\quad \operatorname{ChunkExpr}(\mathsf{attrs})\ =\ e\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{DispatchExpr}(\mathsf{pat},\ \mathsf{range},\ \mathsf{key}_{\mathsf{opt}},\ \mathsf{attrs},\ B),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} )
\end{array}
```

```math
\operatorname{DispatchRun}(\mathsf{pat},\ B,\ \mathsf{groups},\ \bot ,\ \sigma )\ \Downarrow \ (\operatorname{Val}(()),\ \sigma ')\ \Leftrightarrow \ \mathsf{all}\ \mathsf{groups}\ \mathsf{execute}\ \mathsf{to}\ \mathsf{completion}\ \mathsf{without}\ \mathsf{panic}\ \mathsf{and}\ \mathsf{every}\ \mathsf{iteration}\ \mathsf{result}\ \mathsf{is}\ \mathsf{discarded}
```

```math
\operatorname{DispatchRun}(\mathsf{pat},\ B,\ \mathsf{groups},\ \mathsf{op},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma ')\ \Leftrightarrow \ \mathsf{all}\ \mathsf{groups}\ \mathsf{execute}\ \mathsf{to}\ \mathsf{completion}\ \mathsf{without}\ \mathsf{panic}\ \mathsf{and}\ \texttt{v}\ \mathsf{is}\ \mathsf{the}\ \mathsf{deterministic}\ \mathsf{reduction}\ \mathsf{of}\ \mathsf{all}\ \mathsf{iteration}\ \mathsf{results}\ \mathsf{under}\ \texttt{op}
```

```math
\operatorname{DispatchRun}(\mathsf{pat},\ B,\ \mathsf{groups},\ \mathsf{reduce}_{\mathsf{opt}},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma ')\ \Leftrightarrow \ \mathsf{some}\ \mathsf{iteration}\ \mathsf{panics}\ \mathsf{and}\ \mathsf{all}\ \mathsf{started}\ \mathsf{iterations}\ \mathsf{settle}\ \mathsf{before}\ \mathsf{panic}\ \mathsf{propagation}
```

```math
\operatorname{DispatchRun}(\mathsf{pat},\ B,\ \mathsf{groups},\ \mathsf{op},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma )\ \Leftrightarrow \ \mathsf{op}\ \ne \ \bot \ \land \ \operatorname{TotalIterations}(\mathsf{groups})\ =\ 0
```

#### 20.5.6 Lowering

**(Lower-Expr-Dispatch)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(\mathsf{range})\ \Downarrow \ \langle \mathsf{IR}_{r},\ v_{r}\rangle \quad \mathsf{key}_{\mathsf{spec}}\ =\ \operatorname{DispatchPartitionSpec}(\mathsf{pat},\ \mathsf{key}_{\mathsf{opt}},\ \mathsf{body})\quad \Gamma \ \vdash \ \operatorname{LowerBlock}(\mathsf{body})\ \Downarrow \ \langle \mathsf{IR}_{b},\ v_{b}\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{DispatchExpr}(\mathsf{pat},\ \mathsf{range},\ \mathsf{key}_{\mathsf{opt}},\ \mathsf{attrs},\ \mathsf{body}))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{r},\ \operatorname{DispatchPartition}(\mathsf{key}_{\mathsf{spec}},\ \mathsf{attrs}),\ \operatorname{DispatchReduce}(\mathsf{attrs},\ \mathsf{IR}_{b}),\ \mathsf{ParallelJoin}),\ \mathsf{DispatchResultVal}\rangle 
\end{array}
```

#### 20.5.7 Diagnostics

| Code         | Severity | Detection    | Condition                                     |
| ------------ | -------- | ------------ | --------------------------------------------- |
| `E-CON-0140` | Error    | Compile-time | Dispatch outside parallel block               |
| `E-CON-0141` | Error    | Compile-time | Key inference failed; explicit key required   |
| `E-CON-0142` | Error    | Compile-time | Cross-iteration dependency detected           |
| `E-CON-0143` | Error    | Compile-time | Non-associative reduction without `[ordered]` |
| `W-CON-0140` | Warning  | Compile-time | Dynamic key pattern; runtime serialization    |

### 20.6 Cancellation

#### 20.6.1 Syntax

This section introduces no additional surface syntax beyond the `cancel` parallel option and ordinary `CancelToken` procedure or method call syntax.

#### 20.6.2 Parsing

This section introduces no additional parsing rules.

#### 20.6.3 AST Representation / Form

```math
\operatorname{States}(\texttt{CancelToken})\ =\ \{\ \texttt{@Active}\ \}
```

```math
\operatorname{Payload}(\texttt{CancelToken},\ \texttt{@Active})\ =\ [\langle \texttt{id},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ]
```

```math
\mathsf{CancelJudg}\ =\ \{\operatorname{CancelNew}()\ \Downarrow \ v,\ \operatorname{CancelChild}(v)\ \Downarrow \ v',\ \operatorname{CancelIsCancelled}(v)\ \Downarrow \ b,\ \operatorname{CancelDoCancel}(v)\ \Downarrow \ \mathsf{ok},\ \operatorname{CancelWaitCancelled}(v)\ \Downarrow \ a\}
```

```math
\mathsf{CancelJudg}\_\chi \ =\ \{\operatorname{CancelNew}(\chi )\ \Downarrow \ (v,\ \chi '),\ \operatorname{CancelChild}(v,\ \chi )\ \Downarrow \ (v',\ \chi '),\ \operatorname{CancelIsCancelled}(v,\ \chi )\ \Downarrow \ b,\ \operatorname{CancelDoCancel}(v,\ \chi )\ \Downarrow \ \chi ',\ \operatorname{CancelWaitCancelled}(v,\ \chi )\ \Downarrow \ a\}
```

```math
\mathsf{CancelStatus}\ =\ \{\mathsf{Active},\ \mathsf{Cancelled}\}
```

```math
\mathsf{CancelState}\ =\ \langle \mathsf{parent},\ \mathsf{status}\rangle 
```

```math
\mathsf{CancelMap}\ =\ \mathbb{N} \ \rightharpoonup \ \mathsf{CancelState}
```

#### 20.6.4 Static Semantics

`CancelToken` is a built-in modal type.

```math
\texttt{CancelToken::new}\ \mathsf{returns}\ \texttt{CancelToken@Active}.
```

```math
\texttt{CancelToken@Active::child()}\ \mathsf{returns}\ a\ \mathsf{descendant}\ \texttt{CancelToken@Active}.
```

```math
\texttt{CancelToken@Active::cancel()}\ \mathsf{returns}\ \texttt{()}.
```

```math
\texttt{CancelToken@Active::is\_cancelled()}\ \mathsf{returns}\ \texttt{bool}.
```

```math
\texttt{CancelToken@Active::wait\_cancelled()}\ \mathsf{returns}\ \mathsf{an}\ \texttt{Async}\ \mathsf{value}\ \mathsf{whose}\ \mathsf{eventual}\ \mathsf{completion}\ \mathsf{indicates}\ \mathsf{cancellation}.
```

#### 20.6.5 Dynamic Semantics

When a cancel token is attached to a parallel block via the `cancel` option, the token is implicitly available within all enclosed `spawn` and `dispatch` bodies.

```math
\operatorname{CancelStatusOf}(\chi ,\ \mathsf{id})\ =\ s\ \Leftrightarrow \ \chi [\mathsf{id}]\ =\ \langle \_,\ s\rangle 
```

```math
\operatorname{CancelParentOf}(\chi ,\ \mathsf{id})\ =\ p\ \Leftrightarrow \ \chi [\mathsf{id}]\ =\ \langle p,\ \_\rangle 
```

```math
\operatorname{Descendant}(\chi ,\ a,\ b)\ \Leftrightarrow \ (a\ =\ b)\ \lor \ (\exists \ p.\ \operatorname{CancelParentOf}(\chi ,\ b)\ =\ p\ \land \ \operatorname{Descendant}(\chi ,\ a,\ p))
```

```math
\operatorname{FreshCancelId}(\chi )\ =\ n\ \Leftrightarrow \ n\ \notin \ \operatorname{dom}(\chi )\ \land \ \forall \ m\ <\ n.\ m\ \in \ \operatorname{dom}(\chi )
```

```math
\operatorname{CancelVal}(n)\ =\ \operatorname{RecordValue}(\operatorname{ModalStateRef}([\texttt{"CancelToken"}],\ \texttt{@Active}),\ [\langle \texttt{id},\ \operatorname{IntVal}(\texttt{"usize"},\ n)\rangle ])
```

```math
\operatorname{CancelId}(v)\ =\ n\ \Leftrightarrow \ v\ =\ \operatorname{RecordValue}(\operatorname{ModalStateRef}([\texttt{"CancelToken"}],\ \texttt{@Active}),\ \mathsf{fs})\ \land \ \operatorname{FieldValue}(v,\ \texttt{id})\ =\ \operatorname{IntVal}(\texttt{"usize"},\ n)
```

**(Cancel-New)**

```math
\begin{array}{l}
\operatorname{FreshCancelId}(\chi )\ =\ n\quad \chi '\ =\ \chi [n\ \mapsto \ \langle \bot ,\ \mathsf{Active}\rangle ] \\
\rule{18em}{0.4pt} \\
\operatorname{CancelNew}(\chi )\ \Downarrow \ (\operatorname{CancelVal}(n),\ \chi ')
\end{array}
```

**(Cancel-Child)**

```math
\begin{array}{l}
\operatorname{CancelId}(v)\ =\ p\quad \operatorname{FreshCancelId}(\chi )\ =\ n\quad \chi '\ =\ \chi [n\ \mapsto \ \langle p,\ \mathsf{Active}\rangle ] \\
\rule{18em}{0.4pt} \\
\operatorname{CancelChild}(v,\ \chi )\ \Downarrow \ (\operatorname{CancelVal}(n),\ \chi ')
\end{array}
```

**(Cancel-IsCancelled)**

```math
\begin{array}{l}
\operatorname{CancelId}(v)\ =\ n\quad \operatorname{CancelStatusOf}(\chi ,\ n)\ =\ s\quad b\ =\ (s\ =\ \mathsf{Cancelled}) \\
\rule{18em}{0.4pt} \\
\operatorname{CancelIsCancelled}(v,\ \chi )\ \Downarrow \ b
\end{array}
```

**(Cancel-DoCancel)**

```math
\begin{array}{l}
\operatorname{CancelId}(v)\ =\ n\quad \chi '\ =\ \chi [\ k\ \mapsto \ \langle \operatorname{CancelParentOf}(\chi ,\ k),\ \mathsf{Cancelled}\rangle \ \mid \ k\ \in \ \operatorname{dom}(\chi )\ \land \ \operatorname{Descendant}(\chi ,\ n,\ k)\ ] \\
\rule{18em}{0.4pt} \\
\operatorname{CancelDoCancel}(v,\ \chi )\ \Downarrow \ \chi '
\end{array}
```

**(Cancel-WaitCancelled-Completed)**

```math
\begin{array}{l}
\operatorname{CancelId}(v)\ =\ n\quad \operatorname{CancelStatusOf}(\chi ,\ n)\ =\ \mathsf{Cancelled} \\
\rule{18em}{0.4pt} \\
\operatorname{CancelWaitCancelled}(v,\ \chi )\ \Downarrow \ \operatorname{RecordValue}(\operatorname{ModalStateRef}([\texttt{"Async"}],\ \texttt{@Completed}),\ [\langle \texttt{value},\ \mathsf{UnitVal}\rangle ])
\end{array}
```

**(Cancel-WaitCancelled-Suspended)**

```math
\begin{array}{l}
\operatorname{CancelId}(v)\ =\ n\quad \operatorname{CancelStatusOf}(\chi ,\ n)\ =\ \mathsf{Active} \\
\rule{18em}{0.4pt} \\
\operatorname{CancelWaitCancelled}(v,\ \chi )\ \Downarrow \ \operatorname{RecordValue}(\operatorname{ModalStateRef}([\texttt{"Async"}],\ \texttt{@Suspended}),\ [\langle \texttt{output},\ \mathsf{UnitVal}\rangle ])
\end{array}
```

Cancellation is cooperative:

| Scenario                       | Behavior                                             |
| ------------------------------ | ---------------------------------------------------- |
| Work checks and returns early  | Iteration completes immediately                      |
| Work ignores cancellation      | Iteration runs to completion                         |
| Work is queued but not started | MUST be dequeued, marked cancelled, and not executed |
| Work is mid-execution          | Continues until next check point                     |

#### 20.6.6 Lowering

```math
\mathsf{CancelIR}\ =\ \{\mathsf{CancelCreateIR},\ \mathsf{CancelRequestIR},\ \mathsf{CancelCheckIR},\ \mathsf{CancelWaitIR},\ \mathsf{CancelSuppressIR}\}
```

**(Lower-Cancel-New)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{Call}(\operatorname{PathExpr}([\texttt{CancelToken},\ \texttt{new}]),\ []))\ \Downarrow \ \langle \mathsf{CancelCreateIR},\ \mathsf{CancelTokenVal}\rangle 
\end{array}
```

**(Lower-Cancel-Request)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{MethodCall}(\mathsf{tok},\ \texttt{cancel},\ []))\ \Downarrow \ \langle \operatorname{CancelRequestIR}(\mathsf{tok}),\ \mathsf{UnitVal}\rangle 
\end{array}
```

**(Lower-Cancel-Wait)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{MethodCall}(\mathsf{tok},\ \texttt{wait\_cancelled},\ []))\ \Downarrow \ \langle \operatorname{CancelWaitIR}(\mathsf{tok}),\ \mathsf{AsyncVal}\rangle 
\end{array}
```

```math
\mathsf{For}\ \mathsf{this}\ \mathsf{rule},\ \mathsf{explicit}\ \mathsf{cancellation}\ \mathsf{check}\ \mathsf{points}\ \mathsf{are}\ \mathsf{the}\ \mathsf{built}-\mathsf{in}\ \texttt{CancelToken@Active::is\_cancelled()}\ \mathsf{and}\ \texttt{CancelToken@Active::wait\_cancelled()}\ \mathsf{surfaces}.
```

```math
\mathsf{Spawn}\ \mathsf{and}\ \mathsf{dispatch}\ \mathsf{lowerings}\ \mathsf{MUST}\ \mathsf{lower}\ \texttt{CancelToken@Active::is\_cancelled()}\ \mathsf{through}\ \texttt{CancelCheckIR},\ \mathsf{lower}\ \texttt{CancelToken@Active::wait\_cancelled()}\ \mathsf{through}\ \texttt{CancelWaitIR},\ \mathsf{and}\ \mathsf{preserve}\ \mathsf{the}\ \texttt{CancelSuppressIR}\ \mathsf{semantics}\ \mathsf{for}\ \mathsf{dequeued}-\mathsf{but}-\mathsf{unstarted}\ \mathsf{work}\ \mathsf{that}\ \mathsf{is}\ \mathsf{cancelled}\ \mathsf{before}\ \mathsf{execution}\ \mathsf{begins}.
```

#### 20.6.7 Diagnostics

No additional named diagnostics are introduced for cancellation itself.

### 20.7 Panic Handling

#### 20.7.1 Syntax

This section introduces no additional surface syntax.

#### 20.7.2 Parsing

This section introduces no additional parsing rules.

#### 20.7.3 AST Representation / Form

```math
\mathsf{Parallel}\ \mathsf{panic}\ \mathsf{propagation}\ \mathsf{consumes}\ \mathsf{failure}\ \mathsf{states}\ \mathsf{produced}\ \mathsf{by}\ \texttt{SpawnHandle}\ \mathsf{settlement}\ \mathsf{and}\ \mathsf{by}\ \texttt{DispatchRun(... ) => (Ctrl(Panic), sigma')}.
```

#### 20.7.4 Static Semantics

This section introduces no additional static typing rules.

#### 20.7.5 Dynamic Semantics

When a work item panics within a parallel block:

1. The panic is captured.
2. Other work items continue to completion, or cancellation is requested if a cancel token is attached.
3. After all started work settles, a panic is propagated at the block boundary.

**(EvalSigma-Parallel-Spawn-Panic)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(D,\ \sigma )\ \Downarrow \ (\operatorname{Val}(d),\ \sigma_{1} )\quad \operatorname{ParallelInit}(d,\ \mathsf{opts})\ \Downarrow \ \mathsf{pstate}_{0}\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(B,\ \sigma_{1} [\mathsf{parallel}_{\mathsf{context}}\ \mapsto \ \mathsf{pstate}_{0}])\ \Downarrow \ (\mathsf{out}_{\mathsf{body}},\ \sigma_{2} )\quad \operatorname{LookupVal}(\sigma_{2} ,\ \mathsf{parallel}_{\mathsf{context}})\ =\ \mathsf{pstate}_{n}\quad \operatorname{AwaitSpawned}(\mathsf{pstate}_{n},\ \sigma_{2} )\ \Downarrow \ (\mathsf{panic}_{\mathsf{opt}},\ \sigma_{3} )\quad \mathsf{panic}_{\mathsf{opt}}\ \ne \ \bot  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{ParallelExpr}(D,\ \mathsf{opts},\ B),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma_{3} )
\end{array}
```

If a cancel token is attached to the parallel block, the runtime MUST request cancellation on the first captured panic, exactly once. If no cancel token is attached, panic alone MUST NOT request cancellation.

```math
\operatorname{FirstCompletedFailure}(\mathsf{pstate},\ \sigma )\ =\ \mathsf{panic}_{\mathsf{opt}}\ \Leftrightarrow \ \mathsf{panic}_{\mathsf{opt}}\ \mathsf{is}\ \mathsf{the}\ \mathsf{failure}\ \mathsf{whose}\ \texttt{CompletionSeq}\ \mathsf{is}\ \mathsf{least}\ \mathsf{among}\ \mathsf{failed}\ \mathsf{handles}\ \mathsf{in}\ \texttt{pstate.Handles}.
```

#### 20.7.6 Lowering

**(Lower-Parallel-Join-Panic)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\mathsf{ParallelJoin}\ \mathsf{lowers}\ \mathsf{to}\ a\ \mathsf{join}\ \mathsf{operation}\ \mathsf{that}\ \mathsf{waits}\ \mathsf{for}\ \mathsf{all}\ \mathsf{started}\ \mathsf{work},\ \mathsf{requests}\ \mathsf{cancellation}\ \mathsf{exactly}\ \mathsf{once}\ \mathsf{on}\ \mathsf{the}\ \mathsf{first}\ \mathsf{observed}\ \mathsf{failure}\ \mathsf{when}\ a\ \mathsf{cancel}\ \mathsf{token}\ \mathsf{is}\ \mathsf{attached},\ \mathsf{and}\ \mathsf{re}-\mathsf{emits}\ \mathsf{the}\ \mathsf{panic}\ \mathsf{with}\ \mathsf{least}\ \texttt{CompletionSeq}.
\end{array}
```

#### 20.7.7 Diagnostics

No additional named diagnostics are introduced for panic propagation itself.

### 20.8 Determinism and Nesting

#### 20.8.1 Syntax

This section introduces no additional surface syntax.

#### 20.8.2 Parsing

This section introduces no additional parsing rules.

#### 20.8.3 AST Representation / Form

This section introduces no additional feature-local AST nodes beyond `ParallelExpr`, `SpawnExpr`, and `DispatchExpr`.

#### 20.8.4 Static Semantics

Dispatch is deterministic when:

1. Key patterns produce identical partitioning across runs.
2. Iterations with the same key execute in index order.
3. Reduction uses deterministic tree combination.

The `[ordered]` dispatch option forces sequential side-effect ordering.

GPU parallel blocks MUST NOT be nested inside other GPU parallel blocks.

#### 20.8.5 Dynamic Semantics

Inner CPU parallel blocks share the worker pool with outer CPU parallel blocks.

CPU and GPU blocks MAY be nested heterogeneously.

Capture rules apply independently at each nesting level.

Work items MAY capture `ctx.heap` and invoke allocation methods.

Work items executing within a `region` block MAY allocate from that region using `^`.

```math
\begin{array}{l}
\operatorname{TaskId}(w)\ =\ n\ \mathsf{assigns}\ \mathsf{each}\ \mathsf{created}\ \mathsf{work}\ \mathsf{item}\ a\ \mathsf{stable}\ \mathsf{creation}\ \mathsf{identifier}. \\
\operatorname{CompletionSeq}(w)\ =\ n\ \mathsf{assigns}\ \mathsf{each}\ \mathsf{settled}\ \mathsf{work}\ \mathsf{item}\ a\ \mathsf{global}\ \mathsf{monotonically}\ \mathsf{increasing}\ \mathsf{completion}\ \mathsf{identifier}.
\end{array}
```

Within each CPU domain queue, ready work items are dequeued in ascending `TaskId`.

Dispatch groups are scheduled in ascending order of their least iteration index.

The inline domain executes work immediately at creation.

GPU work-items execute in lexicographic order of `(workgroup_id, local_id)` for abstract semantics.

Ordered dispatch buffers side effects within each group and commits them in ascending iteration order after group completion.

#### 20.8.6 Lowering

**(Lower-Deterministic-Dispatch)**

```math
\begin{array}{l}
\mathsf{Ordered}\ \in \ \mathsf{opts} \\
\rule{18em}{0.4pt} \\
\mathsf{Dispatch}\ \mathsf{lowering}\ \mathsf{MUST}\ \mathsf{emit}\ \mathsf{OrderedDispatchBufferIR}\ \mathsf{before}\ \mathsf{the}\ \mathsf{group}\ \mathsf{body}\ \mathsf{and}\ \mathsf{OrderedDispatchCommitIR}\ \mathsf{after}\ \mathsf{the}\ \mathsf{group}\ \mathsf{body},\ \mathsf{committing}\ \mathsf{buffered}\ \mathsf{side}\ \mathsf{effects}\ \mathsf{in}\ \mathsf{ascending}\ \mathsf{iteration}\ \mathsf{order}.
\end{array}
```

**(Lower-Nested-Parallel)**
Nested CPU parallel lowering reuses the enclosing pool handle. Nested GPU-in-GPU lowering is ill-formed and therefore emits no IR.

#### 20.8.7 Diagnostics

| Code         | Severity | Detection    | Condition                 |
| ------------ | -------- | ------------ | ------------------------- |
| `E-CON-0152` | Error    | Compile-time | Nested GPU parallel block |

### 20.9 Structured Parallelism Diagnostics Supplement

This section owns the structured-parallelism runtime panic defined by reduced dispatch over an empty iteration space.

| Code         | Severity | Detection | Condition                                   |
| ------------ | -------- | --------- | ------------------------------------------- |
| `P-SEM-2862` | Panic    | Runtime   | Reduced dispatch over empty iteration space |
