---
title: "20.2 Execution Domains"
description: "20.2 Execution Domains from 20. Structured Parallelism of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "structured-parallelism"
specSection: "202-execution-domains"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/structured-parallelism/">20. Structured Parallelism</a>
  <span>Structured Parallelism</span>
</div>

## 20.2 Execution Domains

### 20.2.1 Syntax

Execution-domain values use ordinary method-call syntax and GPU intrinsics use ordinary call-expression syntax.

```text
ctx.cpu()
ctx.gpu()
ctx.inline()
```

### 20.2.2 Parsing

This section introduces no additional parser productions beyond ordinary type, call, and method-call parsing.

`GpuPtr<T, S>` uses the ordinary generic type parser of §14.2.1 with head `GpuPtr` and exactly two generic arguments. The second argument MUST name one of `Global`, `Shared`, or `Private`.

### 20.2.3 AST Representation / Form

$$
\mathsf{GpuDomainJudg}\ =\ \{\mathsf{IsGpuDomain},\ \mathsf{GpuContext},\ \mathsf{GpuSafeType},\ \mathsf{GpuCaptureOk}\}
$$

$$
\operatorname{IsGpuDomain}(D)\ \Leftrightarrow \ \operatorname{DomainKind}(D)\ =\ \texttt{GPU}
$$

$$
\operatorname{GpuContext}(G)\ \Leftrightarrow \ G[\mathsf{parallel}_{\mathsf{context}}]\ =\ D\ \land \ \operatorname{IsGpuDomain}(D)
$$

$$
\mathsf{GpuSafeJudg}\ =\ \{\mathsf{GpuSafeType}\}
$$

$$
\mathsf{GpuAddressSpace}\ =\ \{\mathsf{Global},\ \mathsf{Shared},\ \mathsf{Private}\}
$$

$$
\begin{array}{l}
\mathsf{GpuMemory}\ =\ \langle \mathsf{GlobalMem},\ \mathsf{SharedMem},\ \mathsf{PrivateMem}\rangle  \\[0.16em]
\mathsf{GlobalMem}\ :\ \mathsf{Addr}\ \rightharpoonup \ \mathsf{Value} \\[0.16em]
\mathsf{SharedMem}\ :\ \mathsf{WorkgroupId}\ \times \ \mathsf{Addr}\ \rightharpoonup \ \mathsf{Value} \\[0.16em]
\mathsf{PrivateMem}\ :\ \mathsf{WorkItemId}\ \times \ \mathsf{Addr}\ \rightharpoonup \ \mathsf{Value}
\end{array}
$$

**GpuPtr Type.** `GpuPtr<T, S>` represents a pointer to GPU memory in address space `S`.

$$
\begin{array}{l}
\operatorname{TypeGpuPtr}(T,\ S)\ \mathsf{where}\ S\ \in \ \mathsf{GpuAddressSpace} \\[0.16em]
\operatorname{GpuPtrAddrSpace}(\operatorname{TypeGpuPtr}(T,\ S))\ =\ S
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ComputeTopologyDispatch}(\mathsf{bounds},\ \mathsf{opts})\ =\ \mathsf{topo}\ \Leftrightarrow  \\[0.16em]
\ \mathsf{wg}\ =\ \mathsf{if}\ \operatorname{WorkgroupOpt}(\mathsf{opts})\ \ne \ \bot \ \mathsf{then}\ \operatorname{WorkgroupOpt}(\mathsf{opts})\ \mathsf{else}\ \mathsf{DEFAULT}_{\mathsf{GPU}\_\mathsf{WORKGROUP}}\ \land  \\[0.16em]
\ \mathsf{volume}\ =\ \mathsf{wg}.0\ \times \ \mathsf{wg}.1\ \times \ \mathsf{wg}.2\ \land  \\[0.16em]
\ \mathsf{groups}\ =\ \operatorname{CeilDiv}(\mid \mathsf{bounds}\mid ,\ \mathsf{volume})\ \land  \\[0.16em]
\ \mathsf{topo}\ =\ \langle  \\[0.16em]
\quad \mathsf{WorkgroupSize}\ :=\ \mathsf{wg}, \\[0.16em]
\quad \mathsf{NumWorkgroups}\ :=\ (\mathsf{groups},\ 1,\ 1), \\[0.16em]
\quad \mathsf{GlobalSize}\ :=\ (\mathsf{wg}.0\ \times \ \mathsf{groups},\ \mathsf{wg}.1,\ \mathsf{wg}.2) \\[0.16em]
\ \rangle 
\end{array}
$$

**GPU Execution Topology.** Work-items are organized into a 3-dimensional hierarchy of workgroups.

$$
\mathsf{GpuTopology}\ =\ \langle \mathsf{GlobalSize},\ \mathsf{WorkgroupSize},\ \mathsf{NumWorkgroups}\rangle 
$$
GlobalSize : (usize, usize, usize)
WorkgroupSize : (usize, usize, usize)
NumWorkgroups : (usize, usize, usize)

$$
\begin{array}{l}
\mathsf{WorkItemId}\ =\ (\mathsf{usize},\ \mathsf{usize},\ \mathsf{usize}) \\[0.16em]
\mathsf{WorkgroupId}\ =\ (\mathsf{usize},\ \mathsf{usize},\ \mathsf{usize}) \\[0.16em]
\operatorname{GlobalId}(\mathsf{local}_{\mathsf{id}},\ \mathsf{workgroup}_{\mathsf{id}},\ \mathsf{workgroup}_{\mathsf{size}})\ = \\[0.16em]
\ (\mathsf{local}_{\mathsf{id}}.0\ +\ \mathsf{workgroup}_{\mathsf{id}}.0\ \times \ \mathsf{workgroup}_{\mathsf{size}}.0, \\[0.16em]
\ \mathsf{local}_{\mathsf{id}}.1\ +\ \mathsf{workgroup}_{\mathsf{id}}.1\ \times \ \mathsf{workgroup}_{\mathsf{size}}.1, \\[0.16em]
\ \mathsf{local}_{\mathsf{id}}.2\ +\ \mathsf{workgroup}_{\mathsf{id}}.2\ \times \ \mathsf{workgroup}_{\mathsf{size}}.2)
\end{array}
$$

$$
\begin{array}{l}
\mathsf{GpuIntrinsicTable}\ =\ \{ \\[0.16em]
\ \langle \texttt{gpu\_global\_id},\ [],\ \operatorname{TypeTuple}([\operatorname{TypePrim}(\texttt{"usize"}),\ \operatorname{TypePrim}(\texttt{"usize"}),\ \operatorname{TypePrim}(\texttt{"usize"})])\rangle , \\[0.16em]
\ \langle \texttt{gpu\_local\_id},\ [],\ \operatorname{TypeTuple}([\operatorname{TypePrim}(\texttt{"usize"}),\ \operatorname{TypePrim}(\texttt{"usize"}),\ \operatorname{TypePrim}(\texttt{"usize"})])\rangle , \\[0.16em]
\ \langle \texttt{gpu\_workgroup\_id},\ [],\ \operatorname{TypeTuple}([\operatorname{TypePrim}(\texttt{"usize"}),\ \operatorname{TypePrim}(\texttt{"usize"}),\ \operatorname{TypePrim}(\texttt{"usize"})])\rangle , \\[0.16em]
\ \langle \texttt{gpu\_workgroup\_size},\ [],\ \operatorname{TypeTuple}([\operatorname{TypePrim}(\texttt{"usize"}),\ \operatorname{TypePrim}(\texttt{"usize"}),\ \operatorname{TypePrim}(\texttt{"usize"})])\rangle , \\[0.16em]
\ \langle \texttt{gpu\_global\_size},\ [],\ \operatorname{TypeTuple}([\operatorname{TypePrim}(\texttt{"usize"}),\ \operatorname{TypePrim}(\texttt{"usize"}),\ \operatorname{TypePrim}(\texttt{"usize"})])\rangle , \\[0.16em]
\ \langle \texttt{gpu\_num\_workgroups},\ [],\ \operatorname{TypeTuple}([\operatorname{TypePrim}(\texttt{"usize"}),\ \operatorname{TypePrim}(\texttt{"usize"}),\ \operatorname{TypePrim}(\texttt{"usize"})])\rangle , \\[0.16em]
\ \langle \texttt{gpu\_linear\_id},\ [],\ \operatorname{TypePrim}(\texttt{"usize"})\rangle , \\[0.16em]
\ \langle \texttt{gpu\_barrier},\ [],\ \operatorname{TypePrim}(\texttt{"()"})\rangle , \\[0.16em]
\ \langle \texttt{gpu\_memory\_barrier},\ [],\ \operatorname{TypePrim}(\texttt{"()"})\rangle , \\[0.16em]
\ \langle \texttt{gpu\_workgroup\_barrier},\ [],\ \operatorname{TypePrim}(\texttt{"()"})\rangle  \\[0.16em]
\}
\end{array}
$$

$$
\mathsf{GpuIntrinsicNames}\ =\ \{\mathsf{name}\ \mid \ \langle \mathsf{name},\ \_,\ \_\rangle \ \in \ \mathsf{GpuIntrinsicTable}\}
$$

$$
\mathsf{GpuState}\ =\ \langle \mathsf{Topology},\ \mathsf{GlobalMem},\ \mathsf{WorkgroupStates}\rangle 
$$

$$
\mathsf{WorkgroupState}\ =\ \langle \mathsf{SharedMem},\ \mathsf{WorkItems},\ \mathsf{BarrierCount}\rangle 
$$

$$
\mathsf{GpuWorkItem}\ =\ \langle \mathsf{id},\ \mathsf{local}_{\mathsf{id}},\ \mathsf{workgroup}_{\mathsf{id}},\ \mathsf{expr},\ \mathsf{captures},\ \mathsf{status},\ \mathsf{private}_{\mathsf{mem}}\rangle 
$$

$$
\begin{array}{l}
\mathsf{GpuWorkItemStatus}\ =\ \{\mathsf{Pending},\ \mathsf{Running},\ \mathsf{AtBarrier},\ \mathsf{Done}\} \\[0.16em]
\operatorname{AtBarrier}(\mathsf{wi})\ \Leftrightarrow \ \mathsf{wi}.\mathsf{status}\ =\ \mathsf{AtBarrier} \\[0.16em]
\operatorname{LinearId}(\mathsf{id}_{\mathsf{3d}},\ \mathsf{size})\ =\ \mathsf{id}_{\mathsf{3d}}.0\ +\ \mathsf{id}_{\mathsf{3d}}.1\ \times \ \mathsf{size}.0\ +\ \mathsf{id}_{\mathsf{3d}}.2\ \times \ \mathsf{size}.0\ \times \ \mathsf{size}.1 \\[0.16em]
\operatorname{LocalIdFromLinear}(\mathsf{linear},\ \mathsf{workgroup}_{\mathsf{size}})\ =\ ( \\[0.16em]
\ \mathsf{linear}\ \%\ \mathsf{workgroup}_{\mathsf{size}}.0, \\[0.16em]
\ (\mathsf{linear}\ /\ \mathsf{workgroup}_{\mathsf{size}}.0)\ \%\ \mathsf{workgroup}_{\mathsf{size}}.1, \\[0.16em]
\ \mathsf{linear}\ /\ (\mathsf{workgroup}_{\mathsf{size}}.0\ \times \ \mathsf{workgroup}_{\mathsf{size}}.1) \\[0.16em]
)
\end{array}
$$

$$
\begin{array}{l}
\mathsf{ExecutionDomainMethods}\ =\ [ \\[0.16em]
\ \operatorname{ClassMethodDecl}(\bot ,\ \texttt{public},\ \texttt{"name"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [],\ \operatorname{TypeString}(\bot ),\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{ClassMethodDecl}(\bot ,\ \texttt{public},\ \texttt{"max\_concurrency"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [],\ \operatorname{TypePrim}(\texttt{"usize"}),\ \bot ,\ \bot ,\ \bot ,\ \bot ) \\[0.16em]
]
\end{array}
$$

$$
\mathsf{ExecutionDomainDecl}\ =\ \operatorname{ClassDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{ExecutionDomain},\ \bot ,\ \bot ,\ [],\ \mathsf{ExecutionDomainMethods},\ \bot ,\ \bot )
$$

### 20.2.4 Static Semantics

`ctx.cpu()`, `ctx.gpu()`, and `ctx.inline()` are `Context` methods that each return a value of type `$ExecutionDomain`.

`ctx.cpu()` selects the domain-default CPU execution domain.

`ctx.cpu(mask)` selects a CPU execution domain restricted to the `CpuSet` mask.

`ctx.cpu(mask, priority)` selects a CPU execution domain restricted to the `CpuSet` mask and default task `Priority`.

`ctx.gpu()` selects the default GPU execution domain.

`ctx.inline()` selects the inline execution domain.

`CpuSet` is an alias of `u64` interpreted as a CPU-bitset mask.

`Priority` is an enum with variants `Low`, `Normal`, and `High`.

$$
\begin{array}{l}
\texttt{GpuSafeType(T)}\ \mathsf{holds}\ \mathsf{iff}\ \texttt{notProhibitedGpuType(T)}\ \mathsf{and}\ \texttt{GpuSafeComponents(T)}. \\[0.16em]
\operatorname{GpuSafeType}(T)\ \Leftrightarrow \ \lnot \operatorname{ProhibitedGpuType}(T)\ \land \ \operatorname{GpuSafeComponents}(T)
\end{array}
$$

$$
\mathsf{GpuSafePrimTypes}\ =\ \{\texttt{i8},\ \texttt{i16},\ \texttt{i32},\ \texttt{i64},\ \texttt{u8},\ \texttt{u16},\ \texttt{u32},\ \texttt{u64},\ \texttt{isize},\ \texttt{usize},\ \texttt{f16},\ \texttt{f32},\ \texttt{f64},\ \texttt{bool},\ \texttt{()}\}
$$

$$
\begin{array}{l}
\operatorname{ProhibitedGpuType}(T)\ \Leftrightarrow  \\[0.16em]
\ T\ =\ \operatorname{TypeDynamic}(\_)\ \lor  \\[0.16em]
\ T\ =\ \operatorname{TypePath}([\texttt{"Context"}])\ \lor  \\[0.16em]
\ T\ =\ \operatorname{TypePath}([\texttt{"System"}])\ \lor  \\[0.16em]
\ \operatorname{IsCapabilityType}(T)\ \lor  \\[0.16em]
\ T\ =\ \operatorname{TypeString}(\texttt{@Managed})\ \lor  \\[0.16em]
\ T\ =\ \operatorname{TypeBytes}(\texttt{@Managed})\ \lor  \\[0.16em]
\ T\ =\ \operatorname{TypePtr}(\_,\ \texttt{@Valid})\ \lor  \\[0.16em]
\ T\ =\ \operatorname{TypeModalState}(\_,\ \_)\ \lor  \\[0.16em]
\ \operatorname{ModalRefType}(T)
\end{array}
$$

$$
\operatorname{GpuSafeComponents}(T)\ \Leftrightarrow \ \operatorname{BitcopyType}(T)\ \land \ (\operatorname{CompoundType}(T)\ \Rightarrow \ \forall \ \mathsf{elem}\ \in \ \operatorname{Elements}(T).\ \operatorname{GpuSafeType}(\mathsf{elem}))
$$

$$
\operatorname{HasGpuSafeReq}(W,\ x)\ \Leftrightarrow \ \exists \ \mathsf{wp}\ \in \ \operatorname{PredicateReqs}(W).\ \mathsf{wp}\ =\ \operatorname{PredicateReq}(\texttt{GpuSafe},\ \operatorname{TypePath}([x]))
$$

$$
\operatorname{GpuSafePredicateClauseOk}(\mathsf{params},\ W)\ \Leftrightarrow \ \forall \ p\ \in \ \mathsf{params}.\ (p.\mathsf{name}\ \in \ \mathsf{TypeParamsUsed}\ \Rightarrow \ \operatorname{HasGpuSafeReq}(W,\ p.\mathsf{name}))
$$

**(GpuSafe-Prim)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePrim}(t)\quad t\ \in \ \mathsf{GpuSafePrimTypes} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{GpuSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(GpuSafe-RawPtr)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRawPtr}(\_,\ U)\quad \Gamma \ \vdash \ \operatorname{GpuSafeType}(U)\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{GpuSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(GpuSafe-Array)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeArray}(U,\ n)\quad \Gamma \ \vdash \ \operatorname{GpuSafeType}(U)\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{GpuSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(GpuSafe-Tuple)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}])\quad \forall \ i.\ \Gamma \ \vdash \ \operatorname{GpuSafeType}(T_{i})\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{GpuSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(GpuSafe-Perm)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePerm}(\_,\ U)\quad \Gamma \ \vdash \ \operatorname{GpuSafeType}(U)\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{GpuSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(GpuSafe-Record)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \forall \ f\ :\ T_{f}\ \in \ \operatorname{Fields}(R).\ \Gamma \ \vdash \ \operatorname{GpuSafeType}(T_{f})\ \Downarrow \ \mathsf{ok}\quad \operatorname{BitcopyType}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{GpuSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(GpuSafe-Enum)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \forall \ v\ \in \ \operatorname{Variants}(E).\ \forall \ T_{f}\ \in \ \operatorname{PayloadTypes}(v).\ \Gamma \ \vdash \ \operatorname{GpuSafeType}(T_{f})\ \Downarrow \ \mathsf{ok}\quad \operatorname{BitcopyType}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{GpuSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(GpuSafe-StringView)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeString}(\texttt{@View}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{GpuSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(GpuSafe-BytesView)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeBytes}(\texttt{@View}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{GpuSafeType}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(GpuSafeType-Err)**

$$
\begin{array}{l}
\operatorname{ProhibitedGpuType}(T)\quad c\ =\ \operatorname{Code}(E-\mathsf{TYP}-2640) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{GpuSafeType}(T)\ \Uparrow \ c
\end{array}
$$

**(GpuSafe-Record-Field-Err)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \exists \ f\ :\ T_{f}\ \in \ \operatorname{Fields}(R).\ \Gamma \ \vdash \ \operatorname{GpuSafeType}(T_{f})\ \Uparrow \quad c\ =\ \operatorname{Code}(E-\mathsf{TYP}-2640) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{GpuSafeType}(T)\ \Uparrow \ c
\end{array}
$$

**(GpuSafe-Generic-Unbounded-Err)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad (\operatorname{RecordDecl}(p)\ =\ R\ \lor \ \operatorname{EnumDecl}(p)\ =\ E)\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(\_.\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \mathsf{params}_{\mathsf{gen}}\ \ne \ []\quad \lnot \ \operatorname{GpuSafePredicateClauseOk}(\mathsf{params}_{\mathsf{gen}},\ \_.\mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}})\quad c\ =\ \operatorname{Code}(E-\mathsf{TYP}-2642) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{GpuSafeType}(T)\ \Uparrow \ c
\end{array}
$$

**(T-GpuIntrinsic)**

$$
\begin{array}{l}
\operatorname{GpuContext}(\Gamma )\quad \langle \mathsf{name},\ [],\ \mathsf{ret}\rangle \ \in \ \mathsf{GpuIntrinsicTable} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Call}(\operatorname{PathExpr}([\mathsf{name}]),\ [])\ :\ \mathsf{ret}
\end{array}
$$

**(Barrier-Outside-Err)**

$$
\begin{array}{l}
\lnot \operatorname{GpuContext}(\Gamma )\quad \mathsf{name}\ \in \ \{\texttt{gpu\_barrier},\ \texttt{gpu\_memory\_barrier},\ \texttt{gpu\_workgroup\_barrier}\}\quad c\ =\ \operatorname{Code}(\mathsf{Barrier}-\mathsf{Outside}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Call}(\operatorname{PathExpr}([\mathsf{name}]),\ [])\ \Uparrow \ c
\end{array}
$$

**(GpuIntrinsic-Outside-Err)**

$$
\begin{array}{l}
\lnot \operatorname{GpuContext}(\Gamma )\quad \mathsf{name}\ \in \ \mathsf{GpuIntrinsicNames}\ \setminus \ \{\texttt{gpu\_barrier},\ \texttt{gpu\_memory\_barrier},\ \texttt{gpu\_workgroup\_barrier}\}\quad c\ =\ \operatorname{Code}(E-\mathsf{CON}-0154) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Call}(\operatorname{PathExpr}([\mathsf{name}]),\ [])\ \Uparrow \ c
\end{array}
$$

**(GpuPtr-AddrSpace-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypeGpuPtr}(T,\ S_{1})\quad \operatorname{ExpectedType}(e)\ =\ \operatorname{TypeGpuPtr}(T,\ S_{2})\quad S_{1}\ \ne \ S_{2}\quad c\ =\ \operatorname{Code}(\mathsf{GpuPtr}-\mathsf{AddrSpace}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ e\ \Uparrow \ c
\end{array}
$$

`ExecutionDomain` is a dispatchable class used for heterogeneous domain handling.

Any type parameter that appears in a field or variant payload of a type satisfying `GpuSafeType` MUST be bounded by `GpuSafe(X)` in the declaration predicate clause.

The key system is not available within GPU execution contexts.

### 20.2.5 Dynamic Semantics

Inline-domain semantics:

1. `spawn { e }` evaluates `e` immediately and blocks until completion.
2. `dispatch i in range { e }` executes as a sequential loop.
3. No actual parallelism occurs.
4. Capture and permission rules remain enforced.

$$
\begin{array}{l}
\operatorname{GpuMemVisible}(\mathsf{addr},\ S,\ \mathsf{wg},\ \mathsf{wi})\ \Leftrightarrow  \\[0.16em]
\ (S\ =\ \mathsf{Global})\ \lor  \\[0.16em]
\ (S\ =\ \mathsf{Shared}\ \land \ \operatorname{WorkgroupOf}(\mathsf{wi})\ =\ \mathsf{wg})\ \lor  \\[0.16em]
\ (S\ =\ \mathsf{Private}\ \land \ \mathsf{wi}\ =\ \mathsf{CurrentWorkItem})
\end{array}
$$

**(GpuPtr-Deref-Visible)**

$$
\begin{array}{l}
G[\mathsf{gpu}_{\mathsf{workitem}}]\ =\ \mathsf{wi}\quad G[\mathsf{gpu}_{\mathsf{workgroup}}]\ =\ \mathsf{wg}\quad \operatorname{GpuMemVisible}(\mathsf{addr},\ S,\ \mathsf{wg},\ \mathsf{wi}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
G\ \vdash \ \operatorname{Deref}(\operatorname{GpuPtr}(\mathsf{addr},\ S))\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(GpuPtr-Deref-Err)**

$$
\begin{array}{l}
G[\mathsf{gpu}_{\mathsf{workitem}}]\ =\ \mathsf{wi}\quad G[\mathsf{gpu}_{\mathsf{workgroup}}]\ =\ \mathsf{wg}\quad \lnot \operatorname{GpuMemVisible}(\mathsf{addr},\ S,\ \mathsf{wg},\ \mathsf{wi})\quad c\ =\ \operatorname{Code}(E-\mathsf{CON}-0150) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
G\ \vdash \ \operatorname{Deref}(\operatorname{GpuPtr}(\mathsf{addr},\ S))\ \Uparrow \ c
\end{array}
$$

$$
\begin{array}{l}
\operatorname{TopologyValid}(\mathsf{topo})\ \Leftrightarrow  \\[0.16em]
\ \mathsf{topo}.\mathsf{WorkgroupSize}.0\ >\ 0\ \land \ \mathsf{topo}.\mathsf{WorkgroupSize}.1\ >\ 0\ \land \ \mathsf{topo}.\mathsf{WorkgroupSize}.2\ >\ 0\ \land  \\[0.16em]
\ \mathsf{topo}.\mathsf{WorkgroupSize}.0\ \times \ \mathsf{topo}.\mathsf{WorkgroupSize}.1\ \times \ \mathsf{topo}.\mathsf{WorkgroupSize}.2\ \le \ \mathsf{MAX}_{\mathsf{WORKGROUP}\_\mathsf{SIZE}}\ \land  \\[0.16em]
\ \mathsf{topo}.\mathsf{GlobalSize}.0\ =\ \mathsf{topo}.\mathsf{WorkgroupSize}.0\ \times \ \mathsf{topo}.\mathsf{NumWorkgroups}.0\ \land  \\[0.16em]
\ \mathsf{topo}.\mathsf{GlobalSize}.1\ =\ \mathsf{topo}.\mathsf{WorkgroupSize}.1\ \times \ \mathsf{topo}.\mathsf{NumWorkgroups}.1\ \land  \\[0.16em]
\ \mathsf{topo}.\mathsf{GlobalSize}.2\ =\ \mathsf{topo}.\mathsf{WorkgroupSize}.2\ \times \ \mathsf{topo}.\mathsf{NumWorkgroups}.2
\end{array}
$$

$$
\mathsf{MAX}_{\mathsf{WORKGROUP}\_\mathsf{SIZE}}\ =\ 1024
$$

**(EvalSigma-GPU-Parallel)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(D,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{domain}}),\ \sigma_{1} )\quad \operatorname{IsGpuDomain}(v_{\mathsf{domain}})\quad \Gamma \ \vdash \ \operatorname{GpuInit}(v_{\mathsf{domain}},\ \mathsf{opts})\ \Downarrow \ \mathsf{gpu}_{\mathsf{state}}\quad \Gamma \ \vdash \ \operatorname{EvalGpuBody}(B,\ \sigma_{1} ,\ \mathsf{gpu}_{\mathsf{state}})\ \Downarrow \ (\mathsf{work}_{\mathsf{items}},\ \sigma_{2} )\quad \Gamma \ \vdash \ \operatorname{GpuExecute}(\mathsf{work}_{\mathsf{items}},\ \mathsf{gpu}_{\mathsf{state}})\ \Downarrow \ (\mathsf{results},\ \sigma_{3} )\quad \Gamma \ \vdash \ \operatorname{GpuJoin}(\mathsf{results})\ \Downarrow \ (\mathsf{out},\ \sigma_{4} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{ParallelExpr}(D,\ \mathsf{opts},\ B),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{4} )
\end{array}
$$

**(EvalSigma-GPU-Dispatch)**

$$
\begin{array}{l}
\operatorname{GpuContext}(\Gamma )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{range},\ \sigma )\ \Downarrow \ (\operatorname{Val}(r),\ \sigma_{1} )\quad \mathsf{bounds}\ =\ \operatorname{RangeBounds}(r)\quad \mathsf{topology}\ =\ \operatorname{ComputeTopology}(\mathsf{bounds},\ \mathsf{opts})\quad \mathsf{work}_{\mathsf{items}}\ =\ [\operatorname{GpuWorkItem}(i,\ \operatorname{LocalIdFromLinear}(i,\ \mathsf{topology}.\mathsf{WorkgroupSize}),\ \operatorname{WorkgroupIdFromLinear}(i,\ \mathsf{topology}),\ B[i/\mathsf{var}],\ \operatorname{CaptureEnv}(\Gamma ,\ B),\ \mathsf{Pending},\ \emptyset )\ \mid \ i\ \in \ \mathsf{bounds}] \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalGpuDispatch}(\operatorname{DispatchExpr}(\mathsf{var},\ \mathsf{range},\ \bot ,\ \mathsf{opts},\ B),\ \sigma )\ \Downarrow \ (\mathsf{work}_{\mathsf{items}},\ \sigma_{1} )
\end{array}
$$

**(GpuExecute-Step)**

$$
\begin{array}{l}
\forall \ \mathsf{wg}\ \in \ \operatorname{Workgroups}(\mathsf{gpu}_{\mathsf{state}}).\ \forall \ \mathsf{wi}\ \in \ \operatorname{WorkItems}(\mathsf{wg}).\ \mathsf{wi}.\mathsf{status}\ =\ \mathsf{Running}\quad \forall \ \mathsf{wi}.\ \Gamma \ \vdash \ \operatorname{EvalGpuWorkItem}(\mathsf{wi}.\mathsf{expr},\ \mathsf{wi}.\mathsf{captures},\ \mathsf{wi}.\mathsf{private}_{\mathsf{mem}})\ \Downarrow \ (\mathsf{out}_{i},\ \mathsf{pm}_{i}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{GpuExecute}(\mathsf{work}_{\mathsf{items}},\ \mathsf{gpu}_{\mathsf{state}})\ \Downarrow \ (\operatorname{GpuWorkItemResults}(\mathsf{work}_{\mathsf{items}}),\ \mathsf{gpu}_{\mathsf{state}}')
\end{array}
$$

**(GpuBarrier-Sync)**

$$
\begin{array}{l}
\forall \ \mathsf{wi}\ \in \ \operatorname{WorkItems}(\mathsf{wg}).\ \mathsf{wi}.\mathsf{status}\ =\ \mathsf{AtBarrier} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{GpuWorkgroupSync}(\mathsf{wg})\ \Downarrow \ \operatorname{ResumeAll}(\mathsf{wg})
\end{array}
$$

GpuBarrierWait(wg) blocks execution until all work-items in workgroup wg reach the barrier.

`gpu_barrier()` blocks until all work-items in the workgroup reach the barrier. After barrier completion, all shared-memory writes by work-items in that workgroup are visible to all work-items in that workgroup.

**(EvalSigma-GpuBarrier)**

$$
\begin{array}{l}
\operatorname{GpuContext}(\Gamma )\quad \Gamma [\mathsf{gpu}_{\mathsf{workgroup}}]\ =\ \mathsf{wg} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Call}(\operatorname{PathExpr}([\texttt{gpu\_barrier}]),\ []),\ \sigma )\ \Downarrow \ (\operatorname{Val}(()),\ \sigma [\mathsf{wi}.\mathsf{status}\ :=\ \mathsf{AtBarrier}])
\end{array}
$$

**(Barrier-Divergence-Err)**

$$
\begin{array}{l}
\operatorname{GpuContext}(\Gamma )\quad \exists \ \mathsf{wi}_{1},\ \mathsf{wi}_{2}\ \in \ \operatorname{WorkItems}(\mathsf{wg}).\ \operatorname{ControlFlowDiverges}(\mathsf{wi}_{1},\ \mathsf{wi}_{2},\ \mathsf{barrier}_{\mathsf{point}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{Reject}
\end{array}
$$

**(KeyBlock-GPU-Err)**

$$
\begin{array}{l}
\operatorname{GpuContext}(\Gamma ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{Reject}
\end{array}
$$

**(WorkgroupSize-Err)**

$$
\begin{array}{l}
\mathsf{topology}\ =\ \operatorname{ComputeTopology}(\mathsf{bounds},\ \mathsf{opts})\quad \lnot \operatorname{TopologyValid}(\mathsf{topology})\quad c\ =\ \operatorname{Code}(\mathsf{WorkgroupSize}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalGpuDispatch}(\operatorname{DispatchExpr}(\mathsf{var},\ \mathsf{range},\ \bot ,\ \mathsf{opts},\ B),\ \sigma )\ \Uparrow \ c
\end{array}
$$

### 20.2.6 Lowering

**(Lower-Domain-CPU)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{MethodCall}(\mathsf{ctx},\ \texttt{cpu},\ \mathsf{args}))\ \Downarrow \ \langle \operatorname{CpuDomainIR}(\mathsf{args}),\ \operatorname{CpuDomainVal}(\mathsf{args})\rangle 
\end{array}
$$

**(Lower-Domain-GPU)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{MethodCall}(\mathsf{ctx},\ \texttt{gpu},\ []))\ \Downarrow \ \langle \mathsf{GpuDomainIR},\ \mathsf{GpuDomainVal}\rangle 
\end{array}
$$

**(Lower-Domain-Inline)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{MethodCall}(\mathsf{ctx},\ \texttt{inline},\ []))\ \Downarrow \ \langle \mathsf{InlineDomainIR},\ \mathsf{InlineDomainVal}\rangle 
\end{array}
$$

**(Lower-Expr-Parallel-GPU)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(D)\ \Downarrow \ \langle \mathsf{IR}_{d},\ v_{d}\rangle \quad \operatorname{IsGpuDomain}(v_{d})\quad \Gamma \ \vdash \ \operatorname{LowerBlock}(B)\ \Downarrow \ \langle \mathsf{IR}_{b},\ v_{b}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{ParallelExpr}(D,\ \mathsf{opts},\ B))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{d},\ \operatorname{KernelLaunchIR}(v_{d},\ \mathsf{opts}),\ \operatorname{GpuDispatchIR}(\mathsf{IR}_{b}),\ \mathsf{ParallelJoin}),\ v_{b}\rangle 
\end{array}
$$

**(Lower-Expr-GpuBarrier)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{Call}(\operatorname{PathExpr}([\texttt{gpu\_barrier}]),\ []))\ \Downarrow \ \langle \operatorname{GpuBarrierIR}(\texttt{full}),\ \mathsf{UnitVal}\rangle 
\end{array}
$$

### 20.2.7 Diagnostics

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
