---
title: "Structured Parallelism"
description: "20. Structured Parallelism of the Ultraviolet language specification."
specSource: "../../Ultraviolet/SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T13:48:04.933Z"
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
```

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

ParallelOpt = {Cancel(expr), Name(str), Workgroup(dim3), Workgroups(dim3)}

ParallelOpts = [ParallelOpt]

Expr = … | ParallelExpr(domain, opts, body) | …

ResolveParallelOptJudg = {ResolveParallelOpt, ResolveParallelOpts}

ResolveParallelOpt is homomorphic on the option forms:

- If Γ ⊢ ResolveExpr(e) ⇓ e' then Γ ⊢ ResolveParallelOpt(Workgroup(e)) ⇓ Workgroup(e').
- If Γ ⊢ ResolveExpr(e) ⇓ e' then Γ ⊢ ResolveParallelOpt(Workgroups(e)) ⇓ Workgroups(e').

ParallelOptExprs([]) = []

ParallelOptExprs(Cancel(e) :: os) = [e] ++ ParallelOptExprs(os)

ParallelOptExprs(Name(_) :: os) = ParallelOptExprs(os)

ParallelOptExprs(Workgroup(e) :: os) = [e] ++ ParallelOptExprs(os)

ParallelOptExprs(Workgroups(e) :: os) = [e] ++ ParallelOptExprs(os)

#### 20.1.4 Static Semantics

```text
BlockOptOk(Name(_)) ⇔ true

```text
BlockOptOk(Cancel(e)) ⇔ G ⊢ e : TypePath(["CancelToken"])

```text
G ⊢ Dim3Const((e_1, e_2, e_3)) ⇓ (x, y, z) ⇔

```text
  G ⊢ e_1 : TypePrim("usize") ∧ G ⊢ ConstLen(e_1) ⇓ x ∧ x > 0 ∧

```text
  G ⊢ e_2 : TypePrim("usize") ∧ G ⊢ ConstLen(e_2) ⇓ y ∧ y > 0 ∧

```text
  G ⊢ e_3 : TypePrim("usize") ∧ G ⊢ ConstLen(e_3) ⇓ z ∧ z > 0

**(Dim3Const-Err)**

```text
¬∃ dims. G ⊢ Dim3Const(e) ⇓ dims    c = Code(Dim3Const-Err)
────────────────────────────────────────────────────────────
Reject

```text
BlockOptOk(Workgroup(e)) ⇔ ∃ dims. G ⊢ Dim3Const(e) ⇓ dims

```text
BlockOptOk(Workgroups(e)) ⇔ ∃ dims. G ⊢ Dim3Const(e) ⇓ dims

```text
BlockOptsOk(opts) ⇔ ∀ opt ∈ opts. BlockOptOk(opt)

```text
DomainCtor(MethodCall(ctx, name, args)) ⇔ name ∈ {`cpu`, `gpu`, `inline`}

```text
DomainCtor(_) ⇔ false
DomainCtorOk(MethodCall(ctx, `cpu`, []))

```text
DomainCtorOk(MethodCall(ctx, `cpu`, [mask])) ⇔ G ⊢ mask : TypePath(["CpuSet"])

```text
DomainCtorOk(MethodCall(ctx, `cpu`, [mask, prio])) ⇔ G ⊢ mask : TypePath(["CpuSet"]) ∧ G ⊢ prio : TypePath(["Priority"])
DomainCtorOk(MethodCall(ctx, `gpu`, []))
DomainCtorOk(MethodCall(ctx, `inline`, []))

```text
DomainCtorOk(D) ⇔ ¬DomainCtor(D)

**(T-Parallel)**

```text
Γ ⊢ D : `$ExecutionDomain`    DomainCtorOk(D)    BlockOptsOk(opts)    Γ_P = Γ[parallel_context ↦ D]    Γ_P ⊢ B : T
────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ `parallel` D opts {B} : T

A parallel block is well-formed only if:

1. The domain expression evaluates to a value implementing `ExecutionDomain`.
2. `spawn` and `dispatch` expressions are evaluated only within an enclosing parallel block.
3. Capture constraints from §20.3 are satisfied.

**(Parallel-Domain-Param-Err)**
DomainCtor(D)    ¬DomainCtorOk(D)    c = Code(Parallel-Domain-Param-Err)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ `parallel` D opts {B} ⇑ c

```text
The same rejection form applies when some option `Cancel(e)` is present and Γ ⊢ e : TypePath(["CancelToken"]) does not hold.

#### 20.1.5 Dynamic Semantics

```text
ParallelState = {Domain : Value, Handles : List⟨Value⟩, CancelToken : CancelToken@Active | ⊥}

```text
ParallelInit(d, opts) ⇓ pstate ⇔ pstate = {Domain: d, Handles: [], CancelToken: CancelOpt(opts)}

```text
CancelOpt(opts) = token ⇔ Cancel(token) ∈ opts

```text
CancelOpt(opts) = ⊥ ⇔ ∀ opt ∈ opts. opt ≠ Cancel(_)

DEFAULT_GPU_WORKGROUP = (64, 1, 1)

DEFAULT_GPU_WORKGROUPS = (1, 1, 1)

```text
WorkgroupOpt(opts) = dims ⇔ Workgroup(dims) ∈ opts

```text
WorkgroupOpt(opts) = ⊥ ⇔ ∀ opt ∈ opts. opt ≠ Workgroup(_)

```text
WorkgroupsOpt(opts) = dims ⇔ Workgroups(dims) ∈ opts

```text
WorkgroupsOpt(opts) = ⊥ ⇔ ∀ opt ∈ opts. opt ≠ Workgroups(_)

```text
ComputeTopologyParallel(opts) = topo ⇔

```text
  wg = if WorkgroupOpt(opts) ≠ ⊥ then WorkgroupOpt(opts) else DEFAULT_GPU_WORKGROUP ∧

```text
  ng = if WorkgroupsOpt(opts) ≠ ⊥ then WorkgroupsOpt(opts) else DEFAULT_GPU_WORKGROUPS ∧

```text
  topo = ⟨
    WorkgroupSize := wg,
    NumWorkgroups := ng,
    GlobalSize := (wg.0 × ng.0, wg.1 × ng.1, wg.2 × ng.2)

```text
  ⟩

```text
AwaitSpawned(pstate, σ) ⇓ (panic_opt, σ') ⇔ every handle in `pstate.Handles` reaches `Ready` or `Failed` between `σ` and `σ'`, and `panic_opt` is the failed completion associated with the least completion-sequence number among handles in `pstate.Handles` whose terminal state is `Failed`, or `⊥` if none fail.

**(EvalSigma-Parallel)**

```text
Γ ⊢ EvalSigma(D, σ) ⇓ (Val(d), σ_1)    ParallelInit(d, opts) ⇓ pstate_0    topology = if IsGpuDomain(d) then ComputeTopologyParallel(opts) else ⊥    Γ ⊢ EvalSigma(B, σ_1[parallel_context ↦ pstate_0]) ⇓ (Val(v_body), σ_2)    LookupVal(σ_2, parallel_context) = pstate_n    AwaitSpawned(pstate_n, σ_2) ⇓ (⊥, σ_3)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(ParallelExpr(D, opts, B), σ) ⇓ (Val(v_body), σ_3)

**(EvalSigma-Parallel-Body-Ctrl)**

```text
Γ ⊢ EvalSigma(D, σ) ⇓ (Val(d), σ_1)    ParallelInit(d, opts) ⇓ pstate_0    Γ ⊢ EvalSigma(B, σ_1[parallel_context ↦ pstate_0]) ⇓ (Ctrl(κ), σ_2)    LookupVal(σ_2, parallel_context) = pstate_n    AwaitSpawned(pstate_n, σ_2) ⇓ (⊥, σ_3)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(ParallelExpr(D, opts, B), σ) ⇓ (Ctrl(κ), σ_3)

**(EvalSigma-Parallel-Domain-Ctrl)**

```text
Γ ⊢ EvalSigma(D, σ) ⇓ (Ctrl(κ), σ_1)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(ParallelExpr(D, opts, B), σ) ⇓ (Ctrl(κ), σ_1)

Panic propagation after fork-join is defined by §20.7.5.

#### 20.1.6 Lowering

ParallelLowerJudg = {LowerParallelBody}

**(Lower-Expr-Parallel)**

```text
Γ ⊢ LowerExpr(D) ⇓ ⟨IR_d, v_d⟩    Γ ⊢ LowerBlock(B) ⇓ ⟨IR_b, v_b⟩
────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(ParallelExpr(D, opts, B)) ⇓ ⟨SeqIR(IR_d, ParallelBegin(v_d, opts), IR_b, ParallelJoin), v_b⟩

#### 20.1.7 Diagnostics

| Code         | Severity | Detection    | Condition                                        |
| ------------ | -------- | ------------ | ------------------------------------------------ |
| `E-CON-0101` | Error    | Compile-time | `spawn` outside parallel                         |
| `E-CON-0102` | Error    | Compile-time | Domain expression not `ExecutionDomain`          |
| `E-CON-0103` | Error    | Compile-time | Invalid parallel domain or option parameter type |

### 20.2 Execution Domains

#### 20.2.1 Syntax

Execution-domain values use ordinary method-call syntax and GPU intrinsics use ordinary call-expression syntax.

```ultraviolet
ctx.cpu()
ctx.gpu()
ctx.inline()
```

#### 20.2.2 Parsing

This section introduces no additional parser productions beyond ordinary type, call, and method-call parsing.

`GpuPtr<T, S>` uses the ordinary generic type parser of §14.2.1 with head `GpuPtr` and exactly two generic arguments. The second argument MUST name one of `Global`, `Shared`, or `Private`.

#### 20.2.3 AST Representation / Form

GpuDomainJudg = {IsGpuDomain, GpuContext, GpuSafeType, GpuCaptureOk}

```text
IsGpuDomain(D) ⇔ DomainKind(D) = `GPU`

```text
GpuContext(G) ⇔ G[parallel_context] = D ∧ IsGpuDomain(D)

GpuSafeJudg = {GpuSafeType}

GpuAddressSpace = {Global, Shared, Private}

```text
GpuMemory = ⟨GlobalMem, SharedMem, PrivateMem⟩
GlobalMem : Addr ⇀ Value
SharedMem : WorkgroupId × Addr ⇀ Value
PrivateMem : WorkItemId × Addr ⇀ Value

**GpuPtr Type.** `GpuPtr<T, S>` represents a pointer to GPU memory in address space `S`.

```text
TypeGpuPtr(T, S) where S ∈ GpuAddressSpace
GpuPtrAddrSpace(TypeGpuPtr(T, S)) = S

```text
ComputeTopologyDispatch(bounds, opts) = topo ⇔

```text
  wg = if WorkgroupOpt(opts) ≠ ⊥ then WorkgroupOpt(opts) else DEFAULT_GPU_WORKGROUP ∧
  volume = wg.0 × wg.1 × wg.2 ∧
  groups = CeilDiv(|bounds|, volume) ∧

```text
  topo = ⟨
    WorkgroupSize := wg,
    NumWorkgroups := (groups, 1, 1),
    GlobalSize := (wg.0 × groups, wg.1, wg.2)

```text
  ⟩

**GPU Execution Topology.** Work-items are organized into a 3-dimensional hierarchy of workgroups.

```text
GpuTopology = ⟨GlobalSize, WorkgroupSize, NumWorkgroups⟩
GlobalSize : (usize, usize, usize)
WorkgroupSize : (usize, usize, usize)
NumWorkgroups : (usize, usize, usize)

WorkItemId = (usize, usize, usize)
WorkgroupId = (usize, usize, usize)
GlobalId(local_id, workgroup_id, workgroup_size) =
  (local_id.0 + workgroup_id.0 × workgroup_size.0,
   local_id.1 + workgroup_id.1 × workgroup_size.1,
   local_id.2 + workgroup_id.2 × workgroup_size.2)

GpuIntrinsicTable = {

```text
  ⟨`gpu_global_id`, [], TypeTuple([TypePrim("usize"), TypePrim("usize"), TypePrim("usize")])⟩,

```text
  ⟨`gpu_local_id`, [], TypeTuple([TypePrim("usize"), TypePrim("usize"), TypePrim("usize")])⟩,

```text
  ⟨`gpu_workgroup_id`, [], TypeTuple([TypePrim("usize"), TypePrim("usize"), TypePrim("usize")])⟩,

```text
  ⟨`gpu_workgroup_size`, [], TypeTuple([TypePrim("usize"), TypePrim("usize"), TypePrim("usize")])⟩,

```text
  ⟨`gpu_global_size`, [], TypeTuple([TypePrim("usize"), TypePrim("usize"), TypePrim("usize")])⟩,

```text
  ⟨`gpu_num_workgroups`, [], TypeTuple([TypePrim("usize"), TypePrim("usize"), TypePrim("usize")])⟩,

```text
  ⟨`gpu_linear_id`, [], TypePrim("usize")⟩,

```text
  ⟨`gpu_barrier`, [], TypePrim("()")⟩,

```text
  ⟨`gpu_memory_barrier`, [], TypePrim("()")⟩,

```text
  ⟨`gpu_workgroup_barrier`, [], TypePrim("()")⟩
}

```text
GpuIntrinsicNames = {name | ⟨name, _, _⟩ ∈ GpuIntrinsicTable}

```text
GpuState = ⟨Topology, GlobalMem, WorkgroupStates⟩

```text
WorkgroupState = ⟨SharedMem, WorkItems, BarrierCount⟩

```text
GpuWorkItem = ⟨id, local_id, workgroup_id, expr, captures, status, private_mem⟩

GpuWorkItemStatus = {Pending, Running, AtBarrier, Done}

```text
AtBarrier(wi) ⇔ wi.status = AtBarrier
LinearId(id_3d, size) = id_3d.0 + id_3d.1 × size.0 + id_3d.2 × size.0 × size.1
LocalIdFromLinear(linear, workgroup_size) = (
  linear % workgroup_size.0,
  (linear / workgroup_size.0) % workgroup_size.1,
  linear / (workgroup_size.0 × workgroup_size.1)
)

ExecutionDomainMethods = [

```text
  ClassMethodDecl(⊥, `public`, "name", ⊥, ReceiverShorthand(`const`), [], TypeString(⊥), ⊥, ⊥, ⊥, ⊥),

```text
  ClassMethodDecl(⊥, `public`, "max_concurrency", ⊥, ReceiverShorthand(`const`), [], TypePrim("usize"), ⊥, ⊥, ⊥, ⊥)
]

```text
ExecutionDomainDecl = ClassDecl(⊥, `public`, false, `ExecutionDomain`, ⊥, ⊥, [], ExecutionDomainMethods, ⊥, ⊥)

#### 20.2.4 Static Semantics

`ctx.cpu()`, `ctx.gpu()`, and `ctx.inline()` are `Context` methods that each return a value of type `$ExecutionDomain`.

`ctx.cpu()` selects the domain-default CPU execution domain.

`ctx.cpu(mask)` selects a CPU execution domain restricted to the `CpuSet` mask.

`ctx.cpu(mask, priority)` selects a CPU execution domain restricted to the `CpuSet` mask and default task `Priority`.

`ctx.gpu()` selects the default GPU execution domain.

`ctx.inline()` selects the inline execution domain.

`CpuSet` is an alias of `u64` interpreted as a CPU-bitset mask.

`Priority` is an enum with variants `Low`, `Normal`, and `High`.

`GpuSafeType(T)` holds iff `¬ProhibitedGpuType(T)` and `GpuSafeComponents(T)`.

```text
GpuSafeType(T) ⇔ ¬ProhibitedGpuType(T) ∧ GpuSafeComponents(T)

GpuSafePrimTypes = {`i8`, `i16`, `i32`, `i64`, `u8`, `u16`, `u32`, `u64`, `isize`, `usize`, `f16`, `f32`, `f64`, `bool`, `()`}

```text
ProhibitedGpuType(T) ⇔
  T = TypeDynamic(_) ∨
  T = TypePath(["Context"]) ∨
  T = TypePath(["System"]) ∨
  IsCapabilityType(T) ∨
  T = TypeString(`@Managed`) ∨
  T = TypeBytes(`@Managed`) ∨
  T = TypePtr(_, `@Valid`) ∨
  T = TypeModalState(_, _) ∨
  ModalRefType(T)

```text
GpuSafeComponents(T) ⇔ BitcopyType(T) ∧ (CompoundType(T) ⇒ ∀ elem ∈ Elements(T). GpuSafeType(elem))

```text
HasGpuSafeReq(W, x) ⇔ ∃ wp ∈ PredicateReqs(W). wp = PredicateReq(`GpuSafe`, TypePath([x]))

```text
GpuSafePredicateClauseOk(params, W) ⇔ ∀ p ∈ params. (p.name ∈ TypeParamsUsed ⇒ HasGpuSafeReq(W, p.name))

**(GpuSafe-Prim)**

```text
T = TypePrim(t)    t ∈ GpuSafePrimTypes
──────────────────────────────────────────────

```text
Γ ⊢ GpuSafeType(T) ⇓ ok

**(GpuSafe-RawPtr)**

```text
T = TypeRawPtr(_, U)    Γ ⊢ GpuSafeType(U) ⇓ ok
──────────────────────────────────────────────────

```text
Γ ⊢ GpuSafeType(T) ⇓ ok

**(GpuSafe-Array)**

```text
T = TypeArray(U, n)    Γ ⊢ GpuSafeType(U) ⇓ ok
────────────────────────────────────────────────

```text
Γ ⊢ GpuSafeType(T) ⇓ ok

**(GpuSafe-Tuple)**

```text
T = TypeTuple([T_1, …, T_n])    ∀ i. Γ ⊢ GpuSafeType(T_i) ⇓ ok
────────────────────────────────────────────────────────────────────

```text
Γ ⊢ GpuSafeType(T) ⇓ ok

**(GpuSafe-Perm)**

```text
T = TypePerm(_, U)    Γ ⊢ GpuSafeType(U) ⇓ ok
──────────────────────────────────────────────────

```text
Γ ⊢ GpuSafeType(T) ⇓ ok

**(GpuSafe-Record)**

```text
T = TypePath(p)    RecordDecl(p) = R    ∀ f : T_f ∈ Fields(R). Γ ⊢ GpuSafeType(T_f) ⇓ ok    BitcopyType(T)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ GpuSafeType(T) ⇓ ok

**(GpuSafe-Enum)**

```text
T = TypePath(p)    EnumDecl(p) = E    ∀ v ∈ Variants(E). ∀ T_f ∈ PayloadTypes(v). Γ ⊢ GpuSafeType(T_f) ⇓ ok    BitcopyType(T)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ GpuSafeType(T) ⇓ ok

**(GpuSafe-StringView)**
T = TypeString(`@View`)
──────────────────────────────────────────────

```text
Γ ⊢ GpuSafeType(T) ⇓ ok

**(GpuSafe-BytesView)**
T = TypeBytes(`@View`)
──────────────────────────────────────────────

```text
Γ ⊢ GpuSafeType(T) ⇓ ok

**(GpuSafeType-Err)**
ProhibitedGpuType(T)    c = Code(E-TYP-2640)
────────────────────────────────────────────────────

```text
Γ ⊢ GpuSafeType(T) ⇑ c

**(GpuSafe-Record-Field-Err)**

```text
T = TypePath(p)    RecordDecl(p) = R    ∃ f : T_f ∈ Fields(R). Γ ⊢ GpuSafeType(T_f) ⇑    c = Code(E-TYP-2640)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ GpuSafeType(T) ⇑ c

**(GpuSafe-Generic-Unbounded-Err)**

```text
T = TypePath(p)    (RecordDecl(p) = R ∨ EnumDecl(p) = E)    params_gen = TypeParamsOpt(_.gen_params_opt)    params_gen ≠ []    ¬ GpuSafePredicateClauseOk(params_gen, _.predicate_clause_opt)    c = Code(E-TYP-2642)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ GpuSafeType(T) ⇑ c

**(T-GpuIntrinsic)**

```text
GpuContext(Γ)    ⟨name, [], ret⟩ ∈ GpuIntrinsicTable
────────────────────────────────────────────────────────────────

```text
Γ ⊢ Call(PathExpr([name]), []) : ret

**(Barrier-Outside-Err)**

```text
¬GpuContext(Γ)    name ∈ {`gpu_barrier`, `gpu_memory_barrier`, `gpu_workgroup_barrier`}    c = Code(Barrier-Outside-Err)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Call(PathExpr([name]), []) ⇑ c

**(GpuIntrinsic-Outside-Err)**

```text
¬GpuContext(Γ)    name ∈ GpuIntrinsicNames \ {`gpu_barrier`, `gpu_memory_barrier`, `gpu_workgroup_barrier`}    c = Code(E-CON-0154)
──────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Call(PathExpr([name]), []) ⇑ c

**(GpuPtr-AddrSpace-Err)**

```text
Γ; R; L ⊢ e : TypeGpuPtr(T, S_1)    ExpectedType(e) = TypeGpuPtr(T, S_2)    S_1 ≠ S_2    c = Code(GpuPtr-AddrSpace-Err)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ e ⇑ c

`ExecutionDomain` is a dispatchable class used for heterogeneous domain handling.

Any type parameter that appears in a field or variant payload of a type satisfying `GpuSafeType` MUST be bounded by `GpuSafe(X)` in the declaration predicate clause.

The key system is not available within GPU execution contexts.

#### 20.2.5 Dynamic Semantics

Inline-domain semantics:

1. `spawn { e }` evaluates `e` immediately and blocks until completion.
2. `dispatch i in range { e }` executes as a sequential loop.
3. No actual parallelism occurs.
4. Capture and permission rules remain enforced.

```text
GpuMemVisible(addr, S, wg, wi) ⇔
  (S = Global) ∨
  (S = Shared ∧ WorkgroupOf(wi) = wg) ∨
  (S = Private ∧ wi = CurrentWorkItem)

**(GpuPtr-Deref-Visible)**
G[gpu_workitem] = wi    G[gpu_workgroup] = wg    GpuMemVisible(addr, S, wg, wi)
────────────────────────────────────────────────────────────────────────────────────────

```text
G ⊢ Deref(GpuPtr(addr, S)) ⇓ ok

**(GpuPtr-Deref-Err)**
G[gpu_workitem] = wi    G[gpu_workgroup] = wg    ¬GpuMemVisible(addr, S, wg, wi)    c = Code(E-CON-0150)
────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
G ⊢ Deref(GpuPtr(addr, S)) ⇑ c

```text
TopologyValid(topo) ⇔
  topo.WorkgroupSize.0 × topo.WorkgroupSize.1 × topo.WorkgroupSize.2 = MAX_WORKGROUP_SIZE ∧
  topo.GlobalSize.0 = topo.WorkgroupSize.0 × topo.NumWorkgroups.0 ∧
  topo.GlobalSize.1 = topo.WorkgroupSize.1 × topo.NumWorkgroups.1 ∧
  topo.GlobalSize.2 = topo.WorkgroupSize.2 × topo.NumWorkgroups.2

MAX_WORKGROUP_SIZE = 1024

**(EvalSigma-GPU-Parallel)**

```text
Γ ⊢ EvalSigma(D, σ) ⇓ (Val(v_domain), σ_1)    IsGpuDomain(v_domain)    Γ ⊢ GpuInit(v_domain, opts) ⇓ gpu_state    Γ ⊢ EvalGpuBody(B, σ_1, gpu_state) ⇓ (work_items, σ_2)    Γ ⊢ GpuExecute(work_items, gpu_state) ⇓ (results, σ_3)    Γ ⊢ GpuJoin(results) ⇓ (out, σ_4)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(ParallelExpr(D, opts, B), σ) ⇓ (out, σ_4)

**(EvalSigma-GPU-Dispatch)**

```text
GpuContext(Γ)    Γ ⊢ EvalSigma(range, σ) ⇓ (Val(r), σ_1)    bounds = RangeBounds(r)    topology = ComputeTopology(bounds, opts)    work_items = [GpuWorkItem(i, LocalIdFromLinear(i, topology.WorkgroupSize), WorkgroupIdFromLinear(i, topology), B[i/var], CaptureEnv(Γ, B), Pending, ∅) | i ∈ bounds]
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalGpuDispatch(DispatchExpr(var, range, ⊥, opts, B), σ) ⇓ (work_items, σ_1)

**(GpuExecute-Step)**

```text
∀ wg ∈ Workgroups(gpu_state). ∀ wi ∈ WorkItems(wg). wi.status = Running    ∀ wi. Γ ⊢ EvalGpuWorkItem(wi.expr, wi.captures, wi.private_mem) ⇓ (out_i, pm_i)
────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ GpuExecute(work_items, gpu_state) ⇓ (GpuWorkItemResults(work_items), gpu_state')

**(GpuBarrier-Sync)**

```text
∀ wi ∈ WorkItems(wg). wi.status = AtBarrier
────────────────────────────────────────────────────────────────────

```text
Γ ⊢ GpuWorkgroupSync(wg) ⇓ ResumeAll(wg)

GpuBarrierWait(wg) blocks execution until all work-items in workgroup wg reach the barrier.

`gpu_barrier()` blocks until all work-items in the workgroup reach the barrier. After barrier completion, all shared-memory writes by work-items in that workgroup are visible to all work-items in that workgroup.

**(EvalSigma-GpuBarrier)**

```text
GpuContext(Γ)    Γ[gpu_workgroup] = wg
────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Call(PathExpr([`gpu_barrier`]), []), σ) ⇓ (Val(()), σ[wi.status := AtBarrier])

**(Barrier-Divergence-Err)**

```text
GpuContext(Γ)    ∃ wi_1, wi_2 ∈ WorkItems(wg). ControlFlowDiverges(wi_1, wi_2, barrier_point)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Reject

**(KeyBlock-GPU-Err)**

```text
GpuContext(Γ)
────────────────────────────────────────────
Reject

**(WorkgroupSize-Err)**
topology = ComputeTopology(bounds, opts)    ¬TopologyValid(topology)    c = Code(WorkgroupSize-Err)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalGpuDispatch(DispatchExpr(var, range, ⊥, opts, B), σ) ⇑ c

#### 20.2.6 Lowering

**(Lower-Domain-CPU)**
──────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(MethodCall(ctx, `cpu`, args)) ⇓ ⟨CpuDomainIR(args), CpuDomainVal(args)⟩

**(Lower-Domain-GPU)**
──────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(MethodCall(ctx, `gpu`, [])) ⇓ ⟨GpuDomainIR, GpuDomainVal⟩

**(Lower-Domain-Inline)**
──────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(MethodCall(ctx, `inline`, [])) ⇓ ⟨InlineDomainIR, InlineDomainVal⟩

**(Lower-Expr-Parallel-GPU)**

```text
Γ ⊢ LowerExpr(D) ⇓ ⟨IR_d, v_d⟩    IsGpuDomain(v_d)    Γ ⊢ LowerBlock(B) ⇓ ⟨IR_b, v_b⟩
────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(ParallelExpr(D, opts, B)) ⇓ ⟨SeqIR(IR_d, KernelLaunchIR(v_d, opts), GpuDispatchIR(IR_b), ParallelJoin), v_b⟩

**(Lower-Expr-GpuBarrier)**
──────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(Call(PathExpr([`gpu_barrier`]), [])) ⇓ ⟨GpuBarrierIR(`full`), UnitVal⟩

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

```text
GpuCaptureJudg = {GpuCaptureOk(Γ, x, T)}

```text
HasHeapProvenance(Γ, x) ⇔ Γ[x].provenance = π_Heap ∨ (Γ[x].provenance = π_Derived(y) ∧ HasHeapProvenance(Γ, y))

#### 20.3.4 Static Semantics

Bindings with `const` permission MAY be captured by reference into `spawn` and `dispatch` bodies.

Bindings with `shared` permission MAY be captured by reference into `spawn` and `dispatch` bodies. Access synchronization is defined by Chapter 19.

Bindings with `unique` permission MUST NOT be captured by closures used in `spawn` or `dispatch` bodies.

**(Parallel-Closure-Capture-Const)**

```text
C = ClosureExpr(params, ret_type_opt, body)    Context(C) ⊆ {SpawnBody, DispatchBody}    x ∈ ConstCaptures(C)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParallelClosureCapture(C, x) ⇓ ok

**(Parallel-Closure-Capture-Shared)**

```text
C = ClosureExpr(params, ret_type_opt, body)    Context(C) ⊆ {SpawnBody, DispatchBody}    x ∈ SharedCaptures(C)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParallelClosureCapture(C, x) ⇓ ok

**(Parallel-Closure-Capture-Unique-Err)**

```text
C = ClosureExpr(params, ret_type_opt, body)    Context(C) ⊆ {SpawnBody, DispatchBody}    x ∈ UniqueCaptures(C)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Reject

```text
OuterParallelBinding(Γ, x) ⇔ x is bound in an enclosing `parallel` body outside the current child task body

```text
FirstChildMove(Γ, x) ⇔ x is the unique outer binding selected by the enclosing parallel capture analysis for one child task

**(Parallel-Closure-Capture-Unique-Move-Ok)**

```text
C = ClosureExpr(params, ret_type_opt, body)    Context(C) ⊆ {SpawnBody, DispatchBody}    x ∈ UniqueCaptures(C)    ExplicitMove(x)    OuterParallelBinding(Γ, x)    FirstChildMove(Γ, x)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParallelClosureCapture(C, x) ⇓ ok

**(Parallel-Closure-Capture-OuterMove-Err)**

```text
C = ClosureExpr(params, ret_type_opt, body)    Context(C) ⊆ {SpawnBody, DispatchBody}    x ∈ UniqueCaptures(C)    ExplicitMove(x)    OuterParallelBinding(Γ, x)    ¬ FirstChildMove(Γ, x)    c = Code(Parallel-Closure-Capture-OuterMove-Err)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParallelClosureCapture(C, x) ⇑ c

**(Parallel-Escaping-Closure-Spawn-Err)**

```text
C = ClosureExpr(params, ret_type_opt, body)    IsEscaping(C)    SpawnExpr(_, _) ∈ body
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Reject

All closures in parallel contexts are classified as local closures for Chapter 19 key analysis. A `spawn` expression is forbidden in the body of an escaping closure.

**(GpuCaptureOk-Const)**

```text
GpuContext(Γ)    Γ[x] = ⟨`const`, T, _, _⟩    GpuSafeType(T)    ¬HasHeapProvenance(Γ, x)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
GpuCaptureOk(Γ, x, T)

**(GpuCaptureOk-Unique-Move)**

```text
GpuContext(Γ)    Γ[x] = ⟨`unique`, T, _, _⟩    GpuSafeType(T)    ¬HasHeapProvenance(Γ, x)    ExplicitMove(x)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
GpuCaptureOk(Γ, x, T)

**(GpuCapture-Shared-Err)**

```text
GpuContext(Γ)    Γ[x] = ⟨`shared`, T, _, _⟩
────────────────────────────────────────────────────────────────────────
Reject

**(GpuCapture-HeapProv-Err)**

```text
GpuContext(Γ)    HasHeapProvenance(Γ, x)
────────────────────────────────────────────────────────────────────
Reject

**(GpuCapture-NonGpuSafe-Err)**

```text
GpuContext(Γ)    Γ[x] = ⟨_, T, _, _⟩    ¬GpuSafeType(T)
──────────────────────────────────────────────────────────────────────────────────────
Reject

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
```

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

SpawnOpt = {Name(str), Affinity(expr), Priority(expr)}

SpawnOpts = [SpawnOpt]

Expr = … | SpawnExpr(opts, body) | …

ResolveSpawnOptJudg = {ResolveSpawnOpt, ResolveSpawnOpts}

SpawnOptExprs([]) = []

SpawnOptExprs(Name(_) :: os) = SpawnOptExprs(os)

SpawnOptExprs(Affinity(e) :: os) = [e] ++ SpawnOptExprs(os)

SpawnOptExprs(Priority(e) :: os) = [e] ++ SpawnOptExprs(os)

States(`Spawned`) = { `@Pending`, `@Ready` }

See §13.1.4 for the built-in `Spawned<T>` modal declaration, state set, payload, and type registration.

#### 20.4.4 Static Semantics

```text
SpawnOptOk(Name(_)) ⇔ true

```text
SpawnOptOk(Affinity(e)) ⇔ Γ ⊢ e : TypePath(["CpuSet"])

```text
SpawnOptOk(Priority(e)) ⇔ Γ ⊢ e : TypePath(["Priority"])

```text
SpawnOptsOk(opts) ⇔ ∀ opt ∈ opts. SpawnOptOk(opt)

An enclosing `parallel_context` is required. The enclosing-context diagnostic is owned by §20.1.7.

**(T-Spawn)**

```text
Γ[parallel_context] = D    SpawnOptsOk(opts)    Γ_capture ⊢ e : T
────────────────────────────────────────────────────────────

```text
Γ ⊢ `spawn` opts {e} : Spawned⟨T⟩

#### 20.4.5 Dynamic Semantics

SpawnHandle = {id : ℕ, state : Pending | Ready(Value) | Failed(Panic)}

```text
CapturedEnv(e, σ) = { x ↦ LookupVal(σ, x) | x ∈ FreeVars(e) }

```text
EnqueueWork(pstate, w, opts) ⇓ pstate' ⇔ pstate' = pstate[Handles := pstate.Handles ++ [SpawnedVal(@Pending, w.id)]] and work item `w` is submitted to `pstate.Domain` subject to `opts`

Evaluation of `spawn [opts] { e }`:

1. Capture free variables per §20.3.
2. Package the captured environment and body into a work item.
3. If `affinity` is present, restrict worker selection to CPU indices whose bits are set in the `CpuSet` mask; if the set is empty, use the domain default.
4. If `priority` is present, assign the task the given `Priority`. When multiple tasks are ready, workers MUST select any task of maximal priority among those ready.
5. Enqueue the work item.
6. Return `Spawned<T>@Pending` immediately.

**(EvalSigma-Spawn)**

```text
Γ[parallel_context] = pstate    caps = CapturedEnv(e, σ)    w = {id: NextWorkId(pstate), expr: e, captures: caps, status: Pending}    EnqueueWork(pstate, w, opts) ⇓ pstate'    handle = SpawnedVal(@Pending, w.id)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(SpawnExpr(opts, e), σ) ⇓ (Val(handle), σ[parallel_context ↦ pstate'])

Result retrieval for `Spawned<T>` handles is defined by §21.2.

#### 20.4.6 Lowering

**(Lower-Expr-Spawn)**

```text
Γ ⊢ LowerBlock(e) ⇓ ⟨IR_b, v_b⟩    caps = CaptureSet(e)
────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(SpawnExpr(opts, e)) ⇓ ⟨SeqIR(TaskCreate(caps, opts, IR_b), TaskEnqueue), SpawnHandleVal⟩

#### 20.4.7 Diagnostics

| Code         | Severity | Detection    | Condition                    |
| ------------ | -------- | ------------ | ---------------------------- |
| `E-CON-0130` | Error    | Compile-time | Invalid spawn attribute type |

### 20.5 Dispatch

#### 20.5.1 Syntax

```text
```

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

ReduceOp = {`+`, `*`, `min`, `max`, `and`, `or`} ∪ Identifier

```text
DispatchOpt = {Reduce(op), Ordered, Chunk(expr), Workgroup(dim3)}    op ∈ ReduceOp

DispatchOpts = [DispatchOpt]

```text
KeyClause = ⟨path, mode⟩

```text
KeyClauseOpt = {⊥} ∪ KeyClause

Expr = … | DispatchExpr(pat, range, key_clause_opt, opts, body) | …

ResolveKeyClauseJudg = {ResolveKeyClauseOpt}

ResolveDispatchOptJudg = {ResolveDispatchOpt, ResolveDispatchOpts}

DispatchOptExprs([]) = []

DispatchOptExprs(Reduce(_) :: os) = DispatchOptExprs(os)

DispatchOptExprs(Ordered :: os) = DispatchOptExprs(os)

DispatchOptExprs(Chunk(e) :: os) = [e] ++ DispatchOptExprs(os)

DispatchOptExprs(Workgroup(e) :: os) = [e] ++ DispatchOptExprs(os)

```text
DispatchAccess = ⟨schema, mode⟩    mode ∈ {Read, Write}

DispatchAccessSet = [DispatchAccess]

#### 20.5.4 Static Semantics

An enclosing `parallel_context` is required. The enclosing-context diagnostics are owned by §§20.1.7 and 20.5.7.

**(T-Dispatch)**

```text
Γ ⊢ range : Range<I>    Γ, i : I ⊢ B : T
──────────────────────────────────────────────────────────

```text
Γ ⊢ `dispatch` i `in range` {B} : ()

**(T-Dispatch-Reduce)**

```text
Γ ⊢ range : Range<I>    Γ, i : I ⊢ B : T    Γ ⊢ op : (T, T) -> T
─────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ `dispatch` i `in range [reduce: op]` {B} : T

**(T-GPU-Dispatch)**

```text
GpuContext(Γ)    Γ ⊢ range : Range<I>    Γ, i : I ⊢ B : T    topology = ComputeTopologyDispatch(RangeBounds(range), opts)    TopologyValid(topology)    ∀ x ∈ FreeVars(B). GpuCaptureOk(Γ, x, Γ[x].type)
────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ DispatchExpr(i, range, ⊥, opts, B) : ()

**(T-GPU-Dispatch-Reduce)**

```text
GpuContext(Γ)    Γ ⊢ range : Range<I>    Γ, i : I ⊢ B : T    Γ ⊢ op : (T, T) -> T    GpuSafeType(T)    topology = ComputeTopologyDispatch(RangeBounds(range), opts)    TopologyValid(topology)    ∀ x ∈ FreeVars(B). GpuCaptureOk(Γ, x, Γ[x].type)
────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ DispatchExpr(i, range, Reduce(op), opts, B) : T

DispatchPatternVars(pat) = PatNames(pat)

```text
PathRootVar(expr) = x ⇔ KeyPath(expr) is rooted at binding `x`

```text
DispatchInvariant(expr, pat) ⇔ FreeVars(expr) \ {PathRootVar(expr)} ⊆ DispatchPatternVars(pat) ∪ { x | x ∈ dom(Γ) ∧ Γ[x] = TypePerm(`const`, _) }

```text
InsideKeyBlock(B, e) ⇔ ∃ K. K is a key block in `B` and `e` is a proper subexpression of `K.body`

```text
ImplicitDispatchUse(B, e) ⇔

```text
  e ∈ Subexpressions(B) ∧
  ¬InsideKeyBlock(B, e) ∧

```text
  (∃ T. Γ ⊢ e : TypePerm(`shared`, T) ∨ Γ ⊢ e :place TypePerm(`shared`, T)) ∧
  KeyPath(e) is defined ∧
  RequiredMode(e) is defined

```text
SchemaOf(pat, e) = S ⇔ S is `KeyPath(e)` with occurrences of bindings in `DispatchPatternVars(pat)` left symbolic and all other subexpressions preserved

JoinDispatchMode(Read, Read) = Read

JoinDispatchMode(_, _) = Write

MergeDispatchAccesses(raw) = merged where `merged` contains one entry per distinct schema and the mode for each schema is the join of all modes attached to that schema in `raw`

```text
InferDispatchAccesses(pat, B) = merged ⇔

```text
  raw = [⟨SchemaOf(pat, e), RequiredMode(e)⟩ | e ∈ Subexpressions(B) ∧ ImplicitDispatchUse(B, e) ∧ DispatchInvariant(KeyPath(e), pat)] ∧
  MergeDispatchAccesses(raw) = merged

```text
ChunkExpr(opts) = e ⇔ Chunk(e) ∈ opts

```text
ChunkExpr(opts) = ⊥ ⇔ ∀ o ∈ opts. o ≠ Chunk(_)

```text
AssociativeReduce(`+`) ⇔ true

```text
AssociativeReduce(`*`) ⇔ true

```text
AssociativeReduce(`min`) ⇔ true

```text
AssociativeReduce(`max`) ⇔ true

```text
AssociativeReduce(`and`) ⇔ true

```text
AssociativeReduce(`or`) ⇔ true

```text
AssociativeReduce(_) ⇔ false

```text
DispatchStaticIndexExpr(pat, e) ⇔
  e is a compile-time constant expression ∨

```text
  (e = x ∧ x ∈ DispatchPatternVars(pat)) ∨
  (e = e_0.f ∧ DispatchStaticIndexExpr(pat, e_0)) ∨
  (e = e_0.n ∧ DispatchStaticIndexExpr(pat, e_0)) ∨
  (e = e_0[e_1] ∧ DispatchStaticIndexExpr(pat, e_0) ∧ DispatchStaticIndexExpr(pat, e_1)) ∨
  (e = op e_0 ∧ DispatchStaticIndexExpr(pat, e_0)) ∨
  (e = e_0 op e_1 ∧ DispatchStaticIndexExpr(pat, e_0) ∧ DispatchStaticIndexExpr(pat, e_1)) ∨
  (e = cast(e_0, _) ∧ DispatchStaticIndexExpr(pat, e_0))

```text
DynamicKeyPattern(pat, spec) ⇔ ∃ ⟨S, _⟩ ∈ spec. S contains an index expression e ∧ ¬ DispatchStaticIndexExpr(pat, e)

**(Dispatch-Infer-Err)**

```text
e ∈ Subexpressions(B)    ImplicitDispatchUse(B, e)    ¬ DispatchInvariant(KeyPath(e), pat)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Reject

**(Dispatch-Outside-Err)**

```text
Γ[parallel_context] = ⊥    c = Code(Dispatch-Outside-Err)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ DispatchExpr(pat, range, key_clause_opt, opts, body) ⇑ c

**(Dispatch-Chunk-Type-Err)**

```text
Chunk(e) ∈ opts    Γ; R; L ⊢ e : T    T ≠ TypePrim("usize")
──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ DispatchExpr(pat, range, key_clause_opt, opts, body) ⇑

**(Dispatch-Dependency-Err)**

```text
InferDispatchAccesses(pat, B) = spec    ∃ ⟨S_a, M_a⟩, ⟨S_b, M_b⟩ ∈ spec. ¬ ProvablyDisjointPath(S_a, S_b) ∧ ¬ KeyModeCompatible(M_a, M_b)    c = Code(Dispatch-Dependency-Err)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ DispatchExpr(pat, range, key_clause_opt, opts, body) ⇑ c

**(Dispatch-Reduce-Assoc-Err)**

```text
Reduce(op) ∈ opts    Ordered ∉ opts    ¬ AssociativeReduce(op)    c = Code(Dispatch-Reduce-Assoc-Err)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ DispatchExpr(pat, range, key_clause_opt, opts, body) ⇑ c

**(Dispatch-DynamicKey-Warn)**
DispatchPartitionSpec(pat, key_clause_opt, B) = spec    DynamicKeyPattern(pat, spec)    w = Code(Dispatch-DynamicKey-Warn)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ WarnDispatch(DispatchExpr(pat, range, key_clause_opt, opts, body)) ⇓ w

When no explicit `key` clause is present, the implementation MUST infer a dispatch partition summary using `InferDispatchAccesses`.

`dispatch` v `in` r { … a[v] … }
────────────────────────────────────────────────────────────

```text
∀ v_1, v_2 ∈ r, v_1 ≠ v_2 ⇒ ProvablyDisjoint(a[v_1], a[v_2])

Reduction operators MUST be associative unless `[ordered]` is present.

`chunk: e` is evaluated exactly once before partitioning. `e` MUST have type `usize`. The resulting positive integer partitions each post-key-partition group into contiguous chunks of at most that size.

#### 20.5.5 Dynamic Semantics

```text
DispatchPartitionSpec(pat, key_clause, B) = [⟨SchemaOf(pat, key_e), ModeOf(key_clause)⟩] ⇔ key_clause = `key` key_e mode

```text
DispatchPartitionSpec(pat, ⊥, B) = ks ⇔ InferDispatchAccesses(pat, B) = ks

```text
InstantiateSchema(S, v) = P ⇔ `P` is obtained by substituting `v` for the dispatch-pattern bindings in `S`

IdxNorm(e) is `e` with harmless parentheses and expression attributes removed

```text
e₁ ≡_idx e₂ ⇔ IdxNorm(e₁) and IdxNorm(e₂) are syntactically identical

```text
AffineDispatchIndex(e) = ⟨x, k⟩ ⇔
  (e = x ∧ k = 0) ∨
  (e = x + n ∧ n is a compile-time constant integer expression with value k) ∨
  (e = x - n ∧ n is a compile-time constant integer expression with value n₀ ∧ k = -n₀) ∨
  (e = n + x ∧ n is a compile-time constant integer expression with value k)

```text
ProvablyDisjoint(e₁, e₂) ⇔
  (e₁ and e₂ are distinct integer literals) ∨

```text
  (AffineDispatchIndex(e₁) = ⟨x, k₁⟩ ∧ AffineDispatchIndex(e₂) = ⟨x, k₂⟩ ∧ k₁ ≠ k₂)

```text
ProvablyDisjointPath(P, Q) ⇔ ∃ k. PrefixEqThrough(P, Q, k-1) ∧ SegmentProvablyDisjoint(P[k], Q[k])

```text
PrefixEqThrough(P, Q, 0) ⇔ true

```text
PrefixEqThrough(P, Q, k) ⇔ ∀ r ∈ 1..k. SegEqForDispatch(P[r], Q[r])

```text
SegEqForDispatch(Root(x), Root(y)) ⇔ x = y

```text
SegEqForDispatch(Field(_, f), Field(_, g)) ⇔ f = g

```text
SegEqForDispatch(Index(_, e_1), Index(_, e_2)) ⇔ e_1 ≡_idx e_2

```text
SegmentProvablyDisjoint(Root(x), Root(y)) ⇔ x ≠ y

```text
SegmentProvablyDisjoint(Field(_, f), Field(_, g)) ⇔ f ≠ g

```text
SegmentProvablyDisjoint(Index(_, e_1), Index(_, e_2)) ⇔ ProvablyDisjoint(e_1, e_2)

```text
PartitionByKey(range, key_spec) = [Group_1, …, Group_k] ⇔
  IterBounds(range) = (start, end) ∧
  indices = [start, start+1, …, end-1] ∧

```text
  Conflict(i, j) ⇔ i ≠ j ∧ (∃ ⟨S_a, M_a⟩ ∈ key_spec, ⟨S_b, M_b⟩ ∈ key_spec. P_i = InstantiateSchema(S_a, i) ∧ P_j = InstantiateSchema(S_b, j) ∧ ¬ ProvablyDisjointPath(P_i, P_j) ∧ ¬ KeyModeCompatible(M_a, M_b)) ∧
  ConnectedComponents(indices, Conflict) = [Group_1, …, Group_k] ∧
  OrderedByLeastMember([Group_1, …, Group_k])

```text
DispatchPartition(pat, range, key_clause, B) = [Group_1, …, Group_k] ⇔ DispatchPartitionSpec(pat, key_clause, B) = key_spec ∧ PartitionByKey(range, key_spec) = [Group_1, …, Group_k]

```text
TotalIterations([Group_1, …, Group_k]) = Σ_{i=1..k} |Group_i|

```text
ReduceOpOf(attrs) = op ⇔ Reduce(op) ∈ attrs

```text
ReduceOpOf(attrs) = ⊥ ⇔ ∀ a ∈ attrs. a ≠ Reduce(_)

```text
ChunkSizeOf(attrs, σ) ⇓ (n, σ') ⇔ ChunkExpr(attrs) = ⊥ ∧ n = 1 ∧ σ' = σ

```text
ChunkSizeOf(attrs, σ) ⇓ (n, σ_1) ⇔ ChunkExpr(attrs) = e ∧ Γ ⊢ EvalSigma(e, σ) ⇓ (Val(IntVal("usize", n)), σ_1) ∧ n > 0

ContiguousChunks([], n) = []
ContiguousChunks([i_1, …, i_k], n) = [[i_1, …, i_m]] ++ ContiguousChunks([i_{m+1}, …, i_k], n) where m = min(n, k)

```text
ChunkGroups(groups, n) = concat([ContiguousChunks(G, n) | G ∈ groups])

**(EvalSigma-Dispatch)**

```text
Γ ⊢ EvalSigma(range, σ) ⇓ (Val(r), σ_1)    ChunkSizeOf(attrs, σ_1) ⇓ (n, σ_2)    DispatchPartition(pat, r, key_opt, B) = groups_0    groups = ChunkGroups(groups_0, n)    ReduceOpOf(attrs) = reduce_opt    Γ ⊢ DispatchRun(pat, B, groups, reduce_opt, σ_2) ⇓ (out, σ_3)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(DispatchExpr(pat, range, key_opt, attrs, B), σ) ⇓ (out, σ_3)

**(EvalSigma-Dispatch-Range-Ctrl)**

```text
Γ ⊢ EvalSigma(range, σ) ⇓ (Ctrl(κ), σ_1)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(DispatchExpr(pat, range, key_opt, attrs, B), σ) ⇓ (Ctrl(κ), σ_1)

**(EvalSigma-Dispatch-Chunk-Ctrl)**

```text
Γ ⊢ EvalSigma(range, σ) ⇓ (Val(r), σ_1)    ChunkExpr(attrs) = e    Γ ⊢ EvalSigma(e, σ_1) ⇓ (Ctrl(κ), σ_2)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(DispatchExpr(pat, range, key_opt, attrs, B), σ) ⇓ (Ctrl(κ), σ_2)

```text
DispatchRun(pat, B, groups, ⊥, σ) ⇓ (Val(()), σ') ⇔ all groups execute to completion without panic and every iteration result is discarded

```text
DispatchRun(pat, B, groups, op, σ) ⇓ (Val(v), σ') ⇔ all groups execute to completion without panic and `v` is the deterministic reduction of all iteration results under `op`

```text
DispatchRun(pat, B, groups, reduce_opt, σ) ⇓ (Ctrl(Panic), σ') ⇔ some iteration panics and all started iterations settle before panic propagation

```text
DispatchRun(pat, B, groups, op, σ) ⇓ (Ctrl(Panic), σ) ⇔ op ≠ ⊥ ∧ TotalIterations(groups) = 0

#### 20.5.6 Lowering

**(Lower-Expr-Dispatch)**

```text
Γ ⊢ LowerExpr(range) ⇓ ⟨IR_r, v_r⟩    key_spec = DispatchPartitionSpec(pat, key_opt, body)    Γ ⊢ LowerBlock(body) ⇓ ⟨IR_b, v_b⟩
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(DispatchExpr(pat, range, key_opt, attrs, body)) ⇓ ⟨SeqIR(IR_r, DispatchPartition(key_spec, attrs), DispatchReduce(attrs, IR_b), ParallelJoin), DispatchResultVal⟩

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

States(`CancelToken`) = { `@Active` }

```text
Payload(`CancelToken`, `@Active`) = [⟨`id`, TypePrim("usize")⟩]

```text
CancelJudg = {CancelNew() ⇓ v, CancelChild(v) ⇓ v', CancelIsCancelled(v) ⇓ b, CancelDoCancel(v) ⇓ ok, CancelWaitCancelled(v) ⇓ a}

```text
CancelJudg_χ = {CancelNew(χ) ⇓ (v, χ'), CancelChild(v, χ) ⇓ (v', χ'), CancelIsCancelled(v, χ) ⇓ b, CancelDoCancel(v, χ) ⇓ χ', CancelWaitCancelled(v, χ) ⇓ a}

CancelStatus = {Active, Cancelled}

```text
CancelState = ⟨parent, status⟩

CancelMap = ℕ ⇀ CancelState

#### 20.6.4 Static Semantics

`CancelToken` is a built-in modal type.

`CancelToken::new` returns `CancelToken@Active`.

`CancelToken@Active::child()` returns a descendant `CancelToken@Active`.

`CancelToken@Active::cancel()` returns `()`.

`CancelToken@Active::is_cancelled()` returns `bool`.

`CancelToken@Active::wait_cancelled()` returns an `Async` value whose eventual completion indicates cancellation.

#### 20.6.5 Dynamic Semantics

When a cancel token is attached to a parallel block via the `cancel` option, the token is implicitly available within all enclosed `spawn` and `dispatch` bodies.

```text
CancelStatusOf(χ, id) = s ⇔ χ[id] = ⟨_, s⟩

```text
CancelParentOf(χ, id) = p ⇔ χ[id] = ⟨p, _⟩

```text
Descendant(χ, a, b) ⇔ (a = b) ∨ (∃ p. CancelParentOf(χ, b) = p ∧ Descendant(χ, a, p))

```text
FreshCancelId(χ) = n ⇔ n ∉ dom(χ) ∧ ∀ m < n. m ∈ dom(χ)

```text
CancelVal(n) = RecordValue(ModalStateRef(["CancelToken"], `@Active`), [⟨`id`, IntVal("usize", n)⟩])

```text
CancelId(v) = n ⇔ v = RecordValue(ModalStateRef(["CancelToken"], `@Active`), fs) ∧ FieldValue(v, `id`) = IntVal("usize", n)

**(Cancel-New)**

```text
FreshCancelId(χ) = n    χ' = χ[n ↦ ⟨⊥, Active⟩]
──────────────────────────────────────────────

```text
CancelNew(χ) ⇓ (CancelVal(n), χ')

**(Cancel-Child)**

```text
CancelId(v) = p    FreshCancelId(χ) = n    χ' = χ[n ↦ ⟨p, Active⟩]
──────────────────────────────────────────────────────────────────────────────

```text
CancelChild(v, χ) ⇓ (CancelVal(n), χ')

**(Cancel-IsCancelled)**
CancelId(v) = n    CancelStatusOf(χ, n) = s    b = (s = Cancelled)
──────────────────────────────────────────────────────────────────────────────

```text
CancelIsCancelled(v, χ) ⇓ b

**(Cancel-DoCancel)**

```text
CancelId(v) = n    χ' = χ[ k ↦ ⟨CancelParentOf(χ, k), Cancelled⟩ | k ∈ dom(χ) ∧ Descendant(χ, n, k) ]
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
CancelDoCancel(v, χ) ⇓ χ'

**(Cancel-WaitCancelled-Completed)**
CancelId(v) = n    CancelStatusOf(χ, n) = Cancelled
──────────────────────────────────────────────────────────────────────────────

```text
CancelWaitCancelled(v, χ) ⇓ RecordValue(ModalStateRef(["Async"], `@Completed`), [⟨`value`, UnitVal⟩])

**(Cancel-WaitCancelled-Suspended)**
CancelId(v) = n    CancelStatusOf(χ, n) = Active
──────────────────────────────────────────────────────────────────────────────

```text
CancelWaitCancelled(v, χ) ⇓ RecordValue(ModalStateRef(["Async"], `@Suspended`), [⟨`output`, UnitVal⟩])

Cancellation is cooperative:

| Scenario                       | Behavior                                             |
| ------------------------------ | ---------------------------------------------------- |
| Work checks and returns early  | Iteration completes immediately                      |
| Work ignores cancellation      | Iteration runs to completion                         |
| Work is queued but not started | MUST be dequeued, marked cancelled, and not executed |
| Work is mid-execution          | Continues until next check point                     |

#### 20.6.6 Lowering

CancelIR = {CancelCreateIR, CancelRequestIR, CancelCheckIR, CancelWaitIR, CancelSuppressIR}

**(Lower-Cancel-New)**
──────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(Call(PathExpr([`CancelToken`, `new`]), [])) ⇓ ⟨CancelCreateIR, CancelTokenVal⟩

**(Lower-Cancel-Request)**
──────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(MethodCall(tok, `cancel`, [])) ⇓ ⟨CancelRequestIR(tok), UnitVal⟩

**(Lower-Cancel-Wait)**
──────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(MethodCall(tok, `wait_cancelled`, [])) ⇓ ⟨CancelWaitIR(tok), AsyncVal⟩

For this rule, explicit cancellation check points are the built-in `CancelToken@Active::is_cancelled()` and `CancelToken@Active::wait_cancelled()` surfaces.

Spawn and dispatch lowerings MUST lower `CancelToken@Active::is_cancelled()` through `CancelCheckIR`, lower `CancelToken@Active::wait_cancelled()` through `CancelWaitIR`, and preserve the `CancelSuppressIR` semantics for dequeued-but-unstarted work that is cancelled before execution begins.

#### 20.6.7 Diagnostics

No additional named diagnostics are introduced for cancellation itself.

### 20.7 Panic Handling

#### 20.7.1 Syntax

This section introduces no additional surface syntax.

#### 20.7.2 Parsing

This section introduces no additional parsing rules.

#### 20.7.3 AST Representation / Form

```text
Parallel panic propagation consumes failure states produced by `SpawnHandle` settlement and by `DispatchRun(... ) ⇓ (Ctrl(Panic), σ')`.

#### 20.7.4 Static Semantics

This section introduces no additional static typing rules.

#### 20.7.5 Dynamic Semantics

When a work item panics within a parallel block:

1. The panic is captured.
2. Other work items continue to completion, or cancellation is requested if a cancel token is attached.
3. After all started work settles, a panic is propagated at the block boundary.

**(EvalSigma-Parallel-Spawn-Panic)**

```text
Γ ⊢ EvalSigma(D, σ) ⇓ (Val(d), σ_1)    ParallelInit(d, opts) ⇓ pstate_0    Γ ⊢ EvalSigma(B, σ_1[parallel_context ↦ pstate_0]) ⇓ (out_body, σ_2)    LookupVal(σ_2, parallel_context) = pstate_n    AwaitSpawned(pstate_n, σ_2) ⇓ (panic_opt, σ_3)    panic_opt ≠ ⊥
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(ParallelExpr(D, opts, B), σ) ⇓ (Ctrl(Panic), σ_3)

If a cancel token is attached to the parallel block, the runtime MUST request cancellation on the first captured panic, exactly once. If no cancel token is attached, panic alone MUST NOT request cancellation.

```text
FirstCompletedFailure(pstate, σ) = panic_opt ⇔ panic_opt is the failure whose `CompletionSeq` is least among failed handles in `pstate.Handles`.

#### 20.7.6 Lowering

**(Lower-Parallel-Join-Panic)**
──────────────────────────────────────────────
ParallelJoin lowers to a join operation that waits for all started work, requests cancellation exactly once on the first observed failure when a cancel token is attached, and re-emits the panic with least `CompletionSeq`.

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

TaskId(w) = n assigns each created work item a stable creation identifier.
CompletionSeq(w) = n assigns each settled work item a global monotonically increasing completion identifier.

Within each CPU domain queue, ready work items are dequeued in ascending `TaskId`.

Dispatch groups are scheduled in ascending order of their least iteration index.

The inline domain executes work immediately at creation.

GPU work-items execute in lexicographic order of `(workgroup_id, local_id)` for abstract semantics.

Ordered dispatch buffers side effects within each group and commits them in ascending iteration order after group completion.

#### 20.8.6 Lowering

**(Lower-Deterministic-Dispatch)**

```text
Ordered ∈ opts
──────────────────────────────────────────────
Dispatch lowering MUST emit OrderedDispatchBufferIR before the group body and OrderedDispatchCommitIR after the group body, committing buffered side effects in ascending iteration order.

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
