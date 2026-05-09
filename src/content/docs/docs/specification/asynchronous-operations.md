---
title: "Asynchronous Operations"
description: "21. Asynchronous Operations of the Ultraviolet language specification."
specSource: "../../Ultraviolet/SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T13:48:04.933Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## 21. Asynchronous Operations

### 21.1 Async Type

#### 21.1.1 Syntax

This section introduces no additional concrete type grammar beyond ordinary type-application syntax and modal-state type syntax.

The following built-in async type constructors and aliases are reserved:

- `Async<Out, In, Result, E>`
- `Sequence<T>`
- `Future<T, E>`
- `Stream<T, E>`
- `Pipe<In, Out>`
- `Exchange<T>`

Parameter defaults are applied by `AsyncSig` in §21.1.4.

The following built-in async states are reserved and use ordinary modal-state type syntax:

- `Async@Suspended`
- `Async@Completed`
- `Async@Failed`

#### 21.1.2 Parsing

`Async`, `Sequence`, `Future`, `Stream`, `Pipe`, and `Exchange` use ordinary path and type-application parsing.

`Async@Suspended`, `Async@Completed`, and `Async@Failed` use ordinary modal-state type parsing.

`TypePath(["Async"])` MAY be parsed by the general type parser; rejection of unapplied `Async` is a static-semantic rule of this section.

#### 21.1.3 AST Representation / Form

`Async` is a built-in modal declaration:

```text
```

States(`Async`) = { `@Suspended`, `@Completed`, `@Failed` }

AsyncParams = [
  ⟨`Out`, [], ⊥, ⊥⟩,
  ⟨`In`, [], TypePrim("()"), ⊥⟩,
  ⟨`Result`, [], TypePrim("()"), ⊥⟩,
  ⟨`E`, [], TypePrim("!"), ⊥⟩
]

AsyncRef = TypeApply(["Async"], [TypePath(["Out"]), TypePath(["In"]), TypePath(["Result"]), TypePath(["E"])])

AsyncSuspendedFields = [⟨`output`, TypePath(["Out"])⟩]
AsyncCompletedFields = [⟨`value`, TypePath(["Result"])⟩]
AsyncFailedFields = [⟨`error`, TypePath(["E"])⟩]

Payload(`Async`, `@Suspended`) = AsyncSuspendedFields
Payload(`Async`, `@Completed`) = AsyncCompletedFields
Payload(`Async`, `@Failed`) = AsyncFailedFields

AsyncSuspendedMembers = [
  StateFieldDecl(⊥, `public`, false, `output`, TypePath(["Out"]), ⊥, ⊥),
  StateMethodDecl(
    ⊥,
    `public`,
    "resume",
    ⊥,
    ReceiverShorthand(`unique`),
    [⟨⊥, `input`, TypePath(["In"])⟩],
    TypeUnion([
      TypeModalState(AsyncRef, `@Suspended`),
      TypeModalState(AsyncRef, `@Completed`),
      TypeModalState(AsyncRef, `@Failed`)
    ]),
    ⊥,
    ⊥,
    ⊥,
    ⊥
  )
]

AsyncCompletedMembers = [
  StateFieldDecl(⊥, `public`, false, `value`, TypePath(["Result"]), ⊥, ⊥)
]

AsyncFailedMembers = [
  StateFieldDecl(⊥, `public`, false, `error`, TypePath(["E"]), ⊥, ⊥)
]

AsyncStates = [
  StateBlock(`@Suspended`, AsyncSuspendedMembers, ⊥, ⊥),
  StateBlock(`@Completed`, AsyncCompletedMembers, ⊥, ⊥),
  StateBlock(`@Failed`, AsyncFailedMembers, ⊥, ⊥)
]

AsyncDecl = ModalDecl(⊥, `public`, `Async`, AsyncParams, ⊥, [], AsyncStates, ⊥, ⊥, ⊥)
```

The following built-in aliases are defined:

```text
SequenceDecl = TypeAliasDecl(⊥, `public`, `Sequence`, [⟨`T`, [], ⊥, ⊥⟩], ⊥, TypeApply(["Async"], [TypePath(["T"]), TypePrim("()"), TypePrim("()"), TypePrim("!")]), ⊥, ⊥)
FutureDecl = TypeAliasDecl(⊥, `public`, `Future`, [⟨`T`, [], ⊥, ⊥⟩, ⟨`E`, [], TypePrim("!"), ⊥⟩], ⊥, TypeApply(["Async"], [TypePrim("()"), TypePrim("()"), TypePath(["T"]), TypePath(["E"])]), ⊥, ⊥)
StreamDecl = TypeAliasDecl(⊥, `public`, `Stream`, [⟨`T`, [], ⊥, ⊥⟩, ⟨`E`, [], ⊥, ⊥⟩], ⊥, TypeApply(["Async"], [TypePath(["T"]), TypePrim("()"), TypePrim("()"), TypePath(["E"])]), ⊥, ⊥)
PipeDecl = TypeAliasDecl(⊥, `public`, `Pipe`, [⟨`In`, [], ⊥, ⊥⟩, ⟨`Out`, [], ⊥, ⊥⟩], ⊥, TypeApply(["Async"], [TypePath(["Out"]), TypePath(["In"]), TypePrim("()"), TypePrim("!")]), ⊥, ⊥)
ExchangeDecl = TypeAliasDecl(⊥, `public`, `Exchange`, [⟨`T`, [], ⊥, ⊥⟩], ⊥, TypeApply(["Async"], [TypePath(["T"]), TypePath(["T"]), TypePath(["T"]), TypePrim("!")]), ⊥, ⊥)
```

The built-in async combinator member set is:

```text
```

AsyncCombinatorNames = {`map`, `filter`, `take`, `fold`, `chain`}
BuiltinModalGeneralMember(modal_ref, name) ⇔ ModalRefPath(modal_ref) = ["Async"] ∧ name ∈ AsyncCombinatorNames
```

#### 21.1.4 Static Semantics

Alias normalization over built-in async aliases is defined by:

```text
AsyncSig(T) = ⟨Out, In, Result, E⟩ ⇔
  AliasNorm(T) = TypeApply(["Async"], args) ∧
  DefaultArgs(AsyncParams, args) = [Out, In, Result, E]

AsyncSig(T) = ⊥    otherwise

BodyReturnType(R) =
  { Result    if AsyncSig(R) = ⟨Out, In, Result, E⟩
    R         otherwise }
```

`Async` subtyping is:

**(Sub-Async)**
```text
AsyncSig(T) = ⟨Out_1, In_1, Result_1, E_1⟩    AsyncSig(U) = ⟨Out_2, In_2, Result_2, E_2⟩
Γ ⊢ Out_1 <: Out_2    Γ ⊢ In_2 <: In_1    Γ ⊢ Result_1 <: Result_2    Γ ⊢ E_1 <: E_2
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ T <: U
```

`Async` well-formedness is:

**(WF-Async)**
```text
T = TypeApply(["Async"], args)    DefaultArgs(AsyncParams, args) = args'    ∀ i, Γ ⊢ args'_i wf
────────────────────────────────────────────────────────────────
Γ ⊢ T wf
```

**(WF-Async-ArgCount-Err)**
```text
T = TypeApply(["Async"], args)    DefaultArgs(AsyncParams, args) = ⊥
────────────────────────────────────────────────────────────────
Γ ⊢ T wf ⇑
```

**(WF-Async-Arg-WF-Err)**
```text
T = TypeApply(["Async"], args)    DefaultArgs(AsyncParams, args) = args'    ∃ i. Γ ⊢ args'_i wf ⇑
────────────────────────────────────────────────────────────────
Γ ⊢ T wf ⇑
```

**(WF-Async-Path-Err)**
```text
```

T = TypePath(["Async"])
────────────────────────────────────────────────────────────────
Γ ⊢ T wf ⇑
```

When `E = !`, values of `Async@Failed` are uninhabited.

#### 21.1.5 Dynamic Semantics

This section introduces no independent evaluation relation beyond the ordinary modal-state value model.

Construction, suspension, resumption, and settlement of `Async` values are defined in §§21.2 through 21.4.

#### 21.1.6 Lowering

AsyncTypeLowerJudg = {LowerAsyncType}

```text
AsyncLoweredStates(⟨Out, In, Result, TypePrim("!")⟩) = [`@Suspended`, `@Completed`]
AsyncLoweredStates(⟨Out, In, Result, E⟩) = [`@Suspended`, `@Completed`, `@Failed`]    if E ≠ TypePrim("!")

AsyncResumeType(⟨Out, In, Result, TypePrim("!")⟩) =
  TypeUnion([
    TypeModalState(TypeApply(["Async"], [Out, In, Result, TypePrim("!")]), `@Suspended`),
    TypeModalState(TypeApply(["Async"], [Out, In, Result, TypePrim("!")]), `@Completed`)
  ])

AsyncResumeType(⟨Out, In, Result, E⟩) =
  TypeUnion([
    TypeModalState(TypeApply(["Async"], [Out, In, Result, E]), `@Suspended`),
    TypeModalState(TypeApply(["Async"], [Out, In, Result, E]), `@Completed`),
    TypeModalState(TypeApply(["Async"], [Out, In, Result, E]), `@Failed`)
  ])    if E ≠ TypePrim("!")
```

When `E = !`, lowering MUST omit the `@Failed` state from concrete storage layouts and from the concrete resume-result tag space. The semantic state `@Failed` remains uninhabited and lowering MUST emit no failed-state variant.

**(Lower-Async-Type)**
```text
AsyncSig(T) = ⟨Out, In, Result, E⟩    sig = ⟨Out, In, Result, E⟩    states = AsyncLoweredStates(sig)    resume_ty = AsyncResumeType(sig)
────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ LowerAsyncType(T) ⇓ ⟨AsyncStateTagIR(states), AsyncResumeSigIR(In, resume_ty)⟩
```

Built-in aliases lower through their normalized `Async` body:

**(Lower-Async-Alias)**
```text
AliasNorm(T) = T'    AsyncSig(T') = sig    Γ ⊢ LowerAsyncType(T') ⇓ out
────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ LowerAsyncType(T) ⇓ out
```

#### 21.1.7 Diagnostics

| Code         | Severity | Detection    | Condition                                 |
| ------------ | -------- | ------------ | ----------------------------------------- |
| `E-CON-0201` | Error    | Compile-time | `Async` type parameter is not well-formed |

### 21.2 Suspension Forms

#### 21.2.1 Syntax

```text
```

wait_expr       ::= "wait" expression
yield_expr      ::= "yield" "release"? expression
yield_from_expr ::= "yield" "release"? "from" expression
```

#### 21.2.2 Parsing

`wait`, `yield`, and `yield from` are primary expressions.

`wait` is parsed by:

**(Parse-Wait-Expr)**
```text
IsIdent(Tok(P))    Lexeme(Tok(P)) = `wait`    Γ ⊢ ParseExpr(Advance(P)) ⇓ (P_1, handle)
────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ ParsePrimary(P) ⇓ (P_1, WaitExpr(handle))
```

`yield from` is parsed by:

**(Parse-Yield-From-Expr)**
```text
```

IsKw(Tok(P), `yield`)    P_1 = Advance(P)
(IsIdent(Tok(P_1)) ∧ Lexeme(Tok(P_1)) = `release` ⇒ release_opt = Release ∧ P_2 = Advance(P_1))
(¬(IsIdent(Tok(P_1)) ∧ Lexeme(Tok(P_1)) = `release`) ⇒ release_opt = ⊥ ∧ P_2 = P_1)
IsKw(Tok(P_2), `from`)    Γ ⊢ ParseExpr(Advance(P_2)) ⇓ (P_3, e)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ ParsePrimary(P) ⇓ (P_3, YieldFromExpr(release_opt, e))
```

`yield` is parsed by:

**(Parse-Yield-Expr)**
```text
```

IsKw(Tok(P), `yield`)    P_1 = Advance(P)
(IsIdent(Tok(P_1)) ∧ Lexeme(Tok(P_1)) = `release` ⇒ release_opt = Release ∧ P_2 = Advance(P_1))
(¬(IsIdent(Tok(P_1)) ∧ Lexeme(Tok(P_1)) = `release`) ⇒ release_opt = ⊥ ∧ P_2 = P_1)
¬ IsKw(Tok(P_2), `from`)    Γ ⊢ ParseExpr(P_2) ⇓ (P_3, e)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ ParsePrimary(P) ⇓ (P_3, YieldExpr(release_opt, e))
```

#### 21.2.3 AST Representation / Form

```text
YieldReleaseOpt ∈ {⊥} ∪ {Release}

Expr includes:
  WaitExpr(handle)
  YieldExpr(release_opt, expr)
  YieldFromExpr(release_opt, expr)
```

Name resolution preserves these forms:

```text
Γ ⊢ ResolveExpr(WaitExpr(handle)) ⇓ WaitExpr(handle')
Γ ⊢ ResolveExpr(YieldExpr(release_opt, e)) ⇓ YieldExpr(release_opt, e')
Γ ⊢ ResolveExpr(YieldFromExpr(release_opt, e)) ⇓ YieldFromExpr(release_opt, e')
```

Evaluation order is:

```text
```

Children_LTR(WaitExpr(handle)) = [handle]
Children_LTR(YieldExpr(release_opt, e)) = [e]
Children_LTR(YieldFromExpr(release_opt, e)) = [e]
```

#### 21.2.4 Static Semantics

`wait` typing is:

**(T-Wait)**
```text
Γ; R; L ⊢ h : TypeApply(["Spawned"], [T])
──────────────────────────────────────────
Γ; R; L ⊢ `wait` h : T
```

**(T-Wait-Future)**
```text
Γ; R; L ⊢ h : TypeApply(["Tracked"], [T, E])
──────────────────────────────────────────
Γ; R; L ⊢ `wait` h : TypeUnion([T, E])
```

**(Wait-Handle-Err)**
```text
Γ; R; L ⊢ h : T_h    StripPerm(T_h) ∉ {TypeApply(["Spawned"], [_]), TypeApply(["Tracked"], [_, _])}
──────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ; R; L ⊢ `wait` h ⇑
```

`yield` typing is:

**(T-Yield)**
```text
AsyncSig(R) = ⟨Out, In, Result, E⟩    Γ; R; L ⊢ e : T    Γ ⊢ T <: Out
────────────────────────────────────────────────────────────────
Γ; R; L ⊢ YieldExpr(release_opt, e) : In
```

**(Yield-NotAsync-Err)**
```text
AsyncSig(R) = ⊥
──────────────────────────────────────────────
Γ; R; L ⊢ YieldExpr(release_opt, e) ⇑
```

**(Yield-Out-Err)**
```text
AsyncSig(R) = ⟨Out, In, Result, E⟩    Γ; R; L ⊢ e : T    ¬(Γ ⊢ T <: Out)
────────────────────────────────────────────────────────────────
Γ; R; L ⊢ YieldExpr(release_opt, e) ⇑
```

`yield from` typing is:

**(T-Yield-From)**
```text
AsyncSig(R) = ⟨Out, In, Result, E_1⟩    Γ; R; L ⊢ e : T_e    AsyncSig(T_e) = ⟨Out_e, In_e, Result_e, E_2⟩    Γ ⊢ Out_e ≡ Out    Γ ⊢ In_e ≡ In    Γ ⊢ E_2 <: E_1
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ; R; L ⊢ YieldFromExpr(release_opt, e) : Result_e
```

**(YieldFrom-NotAsync-Err)**
```text
AsyncSig(R) = ⊥
──────────────────────────────────────────────
Γ; R; L ⊢ YieldFromExpr(release_opt, e) ⇑
```

**(YieldFrom-Out-Err)**
```text
AsyncSig(R) = ⟨Out, In, Result, E_1⟩    Γ; R; L ⊢ e : T_e
(AsyncSig(T_e) = ⊥ ∨ (AsyncSig(T_e) = ⟨Out_e, In_e, Result_e, E_2⟩ ∧ ¬(Γ ⊢ Out_e ≡ Out)))
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ; R; L ⊢ YieldFromExpr(release_opt, e) ⇑
```

**(YieldFrom-In-Err)**
```text
AsyncSig(R) = ⟨Out, In, Result, E_1⟩    Γ; R; L ⊢ e : T_e    AsyncSig(T_e) = ⟨Out_e, In_e, Result_e, E_2⟩    Γ ⊢ Out_e ≡ Out    ¬(Γ ⊢ In_e ≡ In)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ; R; L ⊢ YieldFromExpr(release_opt, e) ⇑
```

**(YieldFrom-ErrType-Err)**
```text
AsyncSig(R) = ⟨Out, In, Result, E_1⟩    Γ; R; L ⊢ e : T_e    AsyncSig(T_e) = ⟨Out_e, In_e, Result_e, E_2⟩    Γ ⊢ Out_e ≡ Out    Γ ⊢ In_e ≡ In    ¬(Γ ⊢ E_2 <: E_1)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ; R; L ⊢ YieldFromExpr(release_opt, e) ⇑
```

Key restrictions for `wait`, `yield`, and `yield from` are defined in §21.5.4.

#### 21.2.5 Dynamic Semantics

`wait` retrieves results from `Spawned<T>` and `Tracked<T, E>` handles.

`wait` evaluation is:

1. Evaluate `h`.
2. If the handle is ready, return its settled value.
3. If the handle is pending, block the current task until the handle settles.
4. If a `Spawned<T>` handle settles by panic, that failure is consumed by the enclosing `parallel` panic propagation defined by §20.7.5.

Formal `wait` rules:

```text
```

SpawnHandleState(SpawnedVal(@Ready { value }, _)) = Ready(value)
SpawnHandleState(SpawnedVal(@Pending, _)) = Pending
TrackedHandleState(TrackedVal(@Ready { value }, _)) = Ready(value)
TrackedHandleState(TrackedVal(@Pending, _)) = Pending

BlockUntilSettledSpawned(handle, σ) ⇓ (handle', σ') ⇔
  σ' extends σ by abstract scheduler progress until SpawnHandleState(handle') ∈ {Ready(_), Failed(_)}

BlockUntilSettledTracked(handle, σ) ⇓ (handle', σ') ⇔
  σ' extends σ by abstract scheduler progress until TrackedHandleState(handle') = Ready(_)
```

**(EvalSigma-Wait-Spawned-Ready)**
```text
Γ ⊢ EvalSigma(h, σ) ⇓ (Val(handle), σ_1)    SpawnHandleState(handle) = Ready(v)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ EvalSigma(WaitExpr(h), σ) ⇓ (Val(v), σ_1)
```

**(EvalSigma-Wait-Spawned-Pending)**
```text
Γ ⊢ EvalSigma(h, σ) ⇓ (Val(handle), σ_1)    SpawnHandleState(handle) = Pending
BlockUntilSettledSpawned(handle, σ_1) ⇓ (handle', σ_2)    SpawnHandleState(handle') = Ready(v)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ EvalSigma(WaitExpr(h), σ) ⇓ (Val(v), σ_2)
```

Failed `Spawned<T>` settlement is not independently observed by `wait`; it is consumed by the enclosing `AwaitSpawned(...)` / §20.7.5 parallel panic propagation.

**(EvalSigma-Wait-Tracked-Ready)**
```text
Γ ⊢ EvalSigma(h, σ) ⇓ (Val(handle), σ_1)    TrackedHandleState(handle) = Ready(v)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ EvalSigma(WaitExpr(h), σ) ⇓ (Val(v), σ_1)
```

**(EvalSigma-Wait-Tracked-Pending)**
```text
Γ ⊢ EvalSigma(h, σ) ⇓ (Val(handle), σ_1)    TrackedHandleState(handle) = Pending
BlockUntilSettledTracked(handle, σ_1) ⇓ (handle', σ_2)    TrackedHandleState(handle') = Ready(v)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ EvalSigma(WaitExpr(h), σ) ⇓ (Val(v), σ_2)
```

**(EvalSigma-Wait-Ctrl)**
```text
Γ ⊢ EvalSigma(h, σ) ⇓ (Ctrl(κ), σ_1)
────────────────────────────────────────────────────────────────────────────────
Γ ⊢ EvalSigma(WaitExpr(h), σ) ⇓ (Ctrl(κ), σ_1)
```

`yield` suspends the current async computation:

1. Evaluate `e` to `v`.
2. If `release_opt = Release`, release all held keys and record the key set.
3. Transition to `Async@Suspended { output = v }`.
4. On resumption with input `i`, reacquire any recorded keys in canonical order under Chapter 19, bind `i` as the value of the suspended `yield` expression, and continue.

Resumption helpers are:

```text
ResumptionPoint = ⟨scope_stack, region_stack, continuation⟩

ReleaseKeys(σ, keys) ⇓ σ' ⇔
  rev = CanonicalOrder(keys) ∧
  ∀ k ∈ Reverse(rev). ReleaseLock(σ, k) ∧
  σ' = σ[held_keys := σ.held_keys ∖ keys]

ReacquireKeys(σ, keys) ⇓ σ' ⇔
  sorted = CanonicalOrder(keys) ∧
  ∀ k ∈ sorted. AcquireLock(σ, k, ModeOf(k)) ∧
  σ' = σ[held_keys := σ.held_keys ∪ keys]

RestoreResumptionPoint(rp) ⇓ σ ⇔
  rp = ⟨scope_stack, region_stack, continuation⟩ ∧
  σ.scope_stack = scope_stack ∧
  σ.region_stack = region_stack ∧
  σ.continuation = continuation

Γ_keys(σ) = σ.held_keys
```

Formal `yield` rules:

**(EvalSigma-Yield)**
```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Val(v), σ_1)    release_opt = ⊥    Γ_keys(σ_1) = ∅
async_state = AsyncSuspended(v, σ_1.resumption_point)
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ EvalSigma(YieldExpr(release_opt, e), σ) ⇓ (Suspend(async_state), σ_1)
```

**(EvalSigma-Yield-Release)**
```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Val(v), σ_1)    release_opt = Release    held = Γ_keys(σ_1)    ReleaseKeys(σ_1, held) ⇓ σ_2
async_state = AsyncSuspended(v, σ_2.resumption_point, held)
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ EvalSigma(YieldExpr(release_opt, e), σ) ⇓ (Suspend(async_state), σ_2)
```

**(EvalSigma-Yield-Resume)**
```text
async_state = AsyncSuspended(_, rp, held_opt)    input = i    RestoreResumptionPoint(rp) ⇓ σ_0
σ_1 = (held_opt ≠ ⊥ ∧ ReacquireKeys(σ_0, held_opt) ⇓ σ_1' → σ_1' | σ_0)
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ EvalSigma(Resume(async_state, i), σ) ⇓ (Val(i), σ_1)
```

`yield from` delegates suspension and completion to another async value:

1. Evaluate the source async value.
2. If it is suspended, re-emit its output through the enclosing async, preserving `release_opt`.
3. If it is completed, produce the completed value.
4. If it is failed, propagate the failure.

Formal `yield from` rules:

**(EvalSigma-YieldFrom-Suspended)**
```text
Γ ⊢ EvalSigma(source, σ) ⇓ (Val(s), σ_1)    ModalState(s) = @Suspended    s.output = v
Γ ⊢ EvalSigma(YieldExpr(release_opt, v), σ_1) ⇓ (Suspend(outer_state), σ_2)
outer_state' = outer_state[inner_async ↦ s]
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ EvalSigma(YieldFromExpr(release_opt, source), σ) ⇓ (Suspend(outer_state'), σ_2)
```

**(EvalSigma-YieldFrom-Completed)**
```text
Γ ⊢ EvalSigma(source, σ) ⇓ (Val(s), σ_1)    ModalState(s) = @Completed    s.value = v
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ EvalSigma(YieldFromExpr(release_opt, source), σ) ⇓ (Val(v), σ_1)
```

**(EvalSigma-YieldFrom-Failed)**
```text
Γ ⊢ EvalSigma(source, σ) ⇓ (Val(s), σ_1)    ModalState(s) = @Failed    s.error = e
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ EvalSigma(YieldFromExpr(release_opt, source), σ) ⇓ (Propagate(e), σ_1)
```

**(EvalSigma-YieldFrom-Resume)**
```text
outer_state.inner_async = s    input = i    Γ ⊢ EvalSigma(Resume(s, i), σ) ⇓ (Val(s'), σ_1)
Γ ⊢ EvalYieldFromContinue(release_opt, s', σ_1) ⇓ (out, σ_2)
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ EvalSigma(Resume(outer_state, i), σ) ⇓ (out, σ_2)
```

```text
```

EvalYieldFromContinue : ReleaseOpt × AsyncValue × State → EvalOut × State
```

**(EvalYieldFromContinue-Suspended)**
```text
```

ModalState(s) = @Suspended    s.output = v
Γ ⊢ EvalSigma(YieldExpr(release_opt, v), σ) ⇓ (Suspend(outer_state), σ_1)
outer_state' = outer_state[inner_async ↦ s]
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ EvalYieldFromContinue(release_opt, s, σ) ⇓ (Suspend(outer_state'), σ_1)
```

**(EvalYieldFromContinue-Completed)**
```text
```

ModalState(s) = @Completed    s.value = v
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ EvalYieldFromContinue(release_opt, s, σ) ⇓ (Val(v), σ)
```

**(EvalYieldFromContinue-Failed)**
```text
```

ModalState(s) = @Failed    s.error = e
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ EvalYieldFromContinue(release_opt, s, σ) ⇓ (Propagate(e), σ)
```

#### 21.2.6 Lowering

SuspensionIR = {WaitIR, YieldIR, YieldFromEnterIR, YieldFromResumeIR, SnapshotHeldKeysIR, ReleaseHeldKeysIR, ReacquireHeldKeysIR}

```text
CurrentAsyncFrame(Γ) = f
CurrentGenPoint(Γ) = g
ResumeLabel(Γ, g) = L
WaitResult(v_h) = v_r    where v_r is the result value produced by WaitIR(v_h)
ResumeInput(f, g) = v_i  where v_i is the resume-input value bound at ResumeLabel(Γ, g)
```

**(Lower-Wait-Spawned)**
```text
Γ ⊢ LowerExpr(h) ⇓ ⟨IR_h, v_h⟩    StripPerm(ExprType(h)) = TypeApply(["Spawned"], [T])
────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ LowerExpr(WaitExpr(h)) ⇓ ⟨SeqIR(IR_h, WaitIR(v_h)), WaitResult(v_h)⟩
```

**(Lower-Wait-Tracked)**
```text
Γ ⊢ LowerExpr(h) ⇓ ⟨IR_h, v_h⟩    StripPerm(ExprType(h)) = TypeApply(["Tracked"], [T, E])
────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ LowerExpr(WaitExpr(h)) ⇓ ⟨SeqIR(IR_h, WaitIR(v_h)), WaitResult(v_h)⟩
```

**(Lower-Yield)**
```text
Γ ⊢ LowerExpr(e) ⇓ ⟨IR_e, v⟩    CurrentAsyncFrame(Γ) = f    CurrentGenPoint(Γ) = g
────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ LowerExpr(YieldExpr(⊥, e)) ⇓ ⟨SeqIR(IR_e, YieldIR(f, g, v)), ResumeInput(f, g)⟩
```

**(Lower-Yield-Release)**
```text
Γ ⊢ LowerExpr(e) ⇓ ⟨IR_e, v⟩    CurrentAsyncFrame(Γ) = f    CurrentGenPoint(Γ) = g    ResumeLabel(Γ, g) = L
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ LowerExpr(YieldExpr(Release, e)) ⇓ ⟨SeqIR(IR_e, SeqIR(SnapshotHeldKeysIR(f), SeqIR(ReleaseHeldKeysIR(f), YieldIR(f, g, v)))), ResumeInput(f, g)⟩
```

For **(Lower-Yield-Release)**, the resumption target `L` MUST begin by executing `ReacquireHeldKeysIR(f)` in canonical key order before control reaches the suspended continuation.

**(Lower-YieldFrom)**
```text
Γ ⊢ LowerExpr(source) ⇓ ⟨IR_s, v_s⟩    CurrentAsyncFrame(Γ) = f    CurrentGenPoint(Γ) = g
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ LowerExpr(YieldFromExpr(release_opt, source)) ⇓ ⟨SeqIR(IR_s, YieldFromEnterIR(f, g, release_opt, v_s)), YieldFromResumeIR(f, g)⟩
```

`YieldFromEnterIR` MUST lower delegation as a loop over the inner async state:
1. `@Suspended { output = v }` re-enters lowering through the `yield` path using the same `release_opt`,
2. `@Completed { value = v }` returns `v`,
3. `@Failed { error = e }` lowers as async error propagation.

#### 21.2.7 Diagnostics

| Code         | Severity | Detection    | Condition                                      |
| ------------ | -------- | ------------ | ---------------------------------------------- |
| `E-CON-0132` | Error    | Compile-time | `wait` operand is not Spawned or Tracked       |
| `E-CON-0210` | Error    | Compile-time | `yield` outside async-returning procedure      |
| `E-CON-0211` | Error    | Compile-time | `yield` operand type does not match `Out`      |
| `E-CON-0220` | Error    | Compile-time | `yield from` outside async-returning procedure |
| `E-CON-0221` | Error    | Compile-time | Incompatible `Out` parameter in `yield from`   |
| `E-CON-0222` | Error    | Compile-time | Incompatible `In` parameter in `yield from`    |
| `E-CON-0225` | Error    | Compile-time | Error type not compatible in `yield from`      |

### 21.3 Composition Forms

#### 21.3.1 Syntax

`loop ... in ...` async iteration uses the ordinary loop syntax defined in Chapter 18.

Manual stepping uses ordinary modal-state inspection and method-call syntax.

```text
```

sync_expr    ::= "sync" expression
race_expr    ::= "race" "{" race_arm ("," race_arm)* "}"
race_arm     ::= expression "->" "|" pattern "|" race_handler
race_handler ::= expression | "yield" expression
all_expr     ::= "all" "{" expression ("," expression)* "}"
```

This section defines the following method-call surfaces:

- `shared_value~>until(pred, action)`
- `a~>map(f)`
- `a~>filter(p)`
- `a~>take(n)`
- `a~>fold(init, f)`
- `a~>chain(f)`

`until` is a source-specified method-call surface on `shared` values. Its type and runtime behavior are defined by this section's static and dynamic semantics.

#### 21.3.2 Parsing

`sync`, `race`, and `all` are primary expressions.

`sync` is parsed by:

**(Parse-Sync-Expr)**
```text
IsKw(Tok(P), `sync`)    Γ ⊢ ParseExpr(Advance(P)) ⇓ (P_1, e)
────────────────────────────────────────────────────────────────
Γ ⊢ ParsePrimary(P) ⇓ (P_1, SyncExpr(e))
```

`race` is parsed by:

**(Parse-Race-Expr)**
```text
IsKw(Tok(P), `race`)    IsPunc(Tok(Advance(P)), "{")    Γ ⊢ ParseRaceArms(Advance(Advance(P))) ⇓ (P_1, arms)    IsPunc(Tok(P_1), "}")
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ ParsePrimary(P) ⇓ (Advance(P_1), RaceExpr(arms))
```

Race-arm parsing is:

**(Parse-RaceArms-Cons)**
```text
Γ ⊢ ParseRaceArm(P) ⇓ (P_1, a)    Γ ⊢ ParseRaceArmsTail(P_1, [a]) ⇓ (P_2, arms)
────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ ParseRaceArms(P) ⇓ (P_2, arms)
```

**(Parse-RaceArm)**
```text
Γ ⊢ ParseExpr(P) ⇓ (P_1, e)    IsOp(Tok(P_1), "->")    IsPunc(Tok(Advance(P_1)), "|")
Γ ⊢ ParsePattern(Advance(Advance(P_1))) ⇓ (P_2, pat)    IsPunc(Tok(P_2), "|")
Γ ⊢ ParseRaceHandler(Advance(P_2)) ⇓ (P_3, handler)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ ParseRaceArm(P) ⇓ (P_3, ⟨e, pat, handler⟩)
```

**(Parse-RaceArmsTail-End)**
```text
```

¬ IsPunc(Tok(P), ",")
────────────────────────────────────────────────────────────────
Γ ⊢ ParseRaceArmsTail(P, xs) ⇓ (P, xs)
```

**(Parse-RaceArmsTail-TrailingComma)**
```text
```

IsPunc(Tok(P), ",")    IsPunc(Tok(Advance(P)), "}")
────────────────────────────────────────────────────────────────
Γ ⊢ ParseRaceArmsTail(P, xs) ⇓ (Advance(P), xs)
```

**(Parse-RaceArmsTail-Comma)**
```text
IsPunc(Tok(P), ",")    Γ ⊢ ParseRaceArm(Advance(P)) ⇓ (P_1, a)    Γ ⊢ ParseRaceArmsTail(P_1, xs ++ [a]) ⇓ (P_2, ys)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ ParseRaceArmsTail(P, xs) ⇓ (P_2, ys)
```

**(Parse-RaceHandler-Yield)**
```text
IsKw(Tok(P), `yield`)    Γ ⊢ ParseExpr(Advance(P)) ⇓ (P_1, e)
────────────────────────────────────────────────────────────────
Γ ⊢ ParseRaceHandler(P) ⇓ (P_1, RaceYield(e))
```

**(Parse-RaceHandler-Return)**
```text
Γ ⊢ ParseExpr(P) ⇓ (P_1, e)
────────────────────────────────────────────────────────────────
Γ ⊢ ParseRaceHandler(P) ⇓ (P_1, RaceReturn(e))
```

`all` is parsed by:

**(Parse-All-Expr)**
```text
IsKw(Tok(P), `all`)    IsPunc(Tok(Advance(P)), "{")    Γ ⊢ ParseAllExprList(Advance(Advance(P))) ⇓ (P_1, es)    IsPunc(Tok(P_1), "}")
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ ParsePrimary(P) ⇓ (Advance(P_1), AllExpr(es))
```

`loop ... in ...`, manual stepping, `until`, and async combinators use ordinary parsing for loops, modal-state operations, and method calls.

#### 21.3.3 AST Representation / Form

```text
```

RaceHandler = {RaceReturn(expr), RaceYield(expr)}
RaceArm = ⟨expr, pat, handler⟩    handler ∈ RaceHandler
RaceArms = [RaceArm]

Expr includes:
  SyncExpr(expr)
  RaceExpr(arms)
  AllExpr(exprs)
```

Async iteration uses the existing loop form:

```text
```

LoopIter(pattern, type_opt, iter, inv_opt, body)
```

Manual stepping, `until`, and async combinators use existing `IfCaseExpr`, modal-state forms, and `MethodCall`.

No dedicated AST nodes are introduced for `until` or for async combinators beyond ordinary method calls.

Resolution is:

```text
```

ResolveRaceJudg = {ResolveRaceArm, ResolveRaceArms, ResolveRaceHandler}
ResolveAllExprListJudg = {ResolveAllExprList}

Γ ⊢ ResolveRaceHandler(RaceReturn(e)) ⇓ RaceReturn(e')
Γ ⊢ ResolveRaceHandler(RaceYield(e)) ⇓ RaceYield(e')
Γ ⊢ ResolveRaceArm(⟨e, pat, handler⟩) ⇓ ⟨e', pat', handler'⟩
Γ ⊢ ResolveRaceArms([]) ⇓ []
Γ ⊢ ResolveRaceArms(a :: as) ⇓ a' :: as'
Γ ⊢ ResolveAllExprList([]) ⇓ []
Γ ⊢ ResolveAllExprList(e :: es) ⇓ e' :: es'
Γ ⊢ ResolveExpr(SyncExpr(e)) ⇓ SyncExpr(e')
Γ ⊢ ResolveExpr(RaceExpr(arms)) ⇓ RaceExpr(arms')
Γ ⊢ ResolveExpr(AllExpr(es)) ⇓ AllExpr(es')
```

Evaluation order is:

```text
```

RaceArmExprs([]) = []
RaceArmExprs(⟨e, _, _⟩ :: as) = [e] ++ RaceArmExprs(as)

Children_LTR(SyncExpr(e)) = [e]
Children_LTR(RaceExpr(arms)) = RaceArmExprs(arms)
Children_LTR(AllExpr(es)) = es
```

#### 21.3.4 Static Semantics

Async iteration over `loop pat in e { body }` is:

**(T-Loop-Iter-Async)**
```text
AsyncSig(R) = ⟨Out_r, In_r, Result_r, E_r⟩    Γ; R; L ⊢ iter : T_iter    AsyncSig(T_iter) = ⟨Out_i, In_i, Result_i, E_i⟩    In_i = TypePrim("()")    Γ ⊢ E_i <: E_r
(ty_opt = ⊥ ⇒ T_p = Out_i)    (ty_opt = T_a ⇒ Γ ⊢ Out_i <: T_a ∧ T_p = T_a)
Γ ⊢ pat ⇐ T_p ⊣ B    Distinct(PatNames(pat))    LoopInvOk(inv_opt)
Γ_0 = PushScope(Γ)    IntroAll(Γ_0, B) ⇓ Γ_1
Γ_1; R; `loop` ⊢ BlockInfo(body) ⇓ ⟨T_b, Brk, BrkVoid⟩    LoopTypeFin(Brk, BrkVoid) = T_r
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ; R; L ⊢ LoopIter(pat, ty_opt, iter, inv_opt, body) : T_r
```

**(Loop-Async-Err)**
```text
Γ; R; L ⊢ iter : T_iter    AsyncSig(T_iter) = ⟨Out_i, In_i, Result_i, E_i⟩    (AsyncSig(R) = ⊥ ∨ In_i ≠ TypePrim("()"))
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ; R; L ⊢ LoopIter(pat, ty_opt, iter, inv_opt, body) ⇑
```

```text
Manual stepping is permitted by ordinary modal-state inspection and `a~>resume(input)`. It is required when an async value has `In ≠ ()`.

`sync` typing is:

```text
YieldInExpr(e) ⇔ ∃ e' ∈ SubExprsList([e]). e' = YieldExpr(_, _)
YieldFromInExpr(e) ⇔ ∃ e' ∈ SubExprsList([e]). e' = YieldFromExpr(_, _)
```

**(Sync-Yield-Err)**
```text
```

YieldInExpr(e)
──────────────────────────────────────────────
Γ; R; L ⊢ SyncExpr(e) ⇑
```

**(Sync-YieldFrom-Err)**
```text
```

YieldFromInExpr(e)
──────────────────────────────────────────────
Γ; R; L ⊢ SyncExpr(e) ⇑
```

**(T-Sync)**
```text
AsyncSig(R) = ⊥    Γ; R; L ⊢ e : T_e    AsyncSig(T_e) = ⟨Out, In, Result, E⟩    Out = TypePrim("()")    In = TypePrim("()")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ; R; L ⊢ SyncExpr(e) : TypeUnion([Result, E])
```

**(Sync-Async-Context-Err)**
```text
AsyncSig(R) ≠ ⊥
──────────────────────────────────────────────
Γ; R; L ⊢ SyncExpr(e) ⇑
```

**(Sync-Out-Err)**
```text
AsyncSig(R) = ⊥    Γ; R; L ⊢ e : T_e
(AsyncSig(T_e) = ⊥ ∨ (AsyncSig(T_e) = ⟨Out, In, Result, E⟩ ∧ Out ≠ TypePrim("()")))
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ; R; L ⊢ SyncExpr(e) ⇑
```

**(Sync-In-Err)**
```text
AsyncSig(R) = ⊥    Γ; R; L ⊢ e : T_e    AsyncSig(T_e) = ⟨Out, In, Result, E⟩    Out = TypePrim("()")    In ≠ TypePrim("()")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ; R; L ⊢ SyncExpr(e) ⇑
```

`race` typing is:

```text
```

RaceMode(arms) =
  { `return`    if ∀ arm ∈ arms. arm.handler = RaceReturn(_)
    `yield`     if ∀ arm ∈ arms. arm.handler = RaceYield(_)
    ⊥           otherwise }
```

**(T-Race)**
```text
n = |arms|    n ≥ 2    RaceMode(arms) = `return`
∀ i, arm_i = ⟨e_i, pat_i, RaceReturn(r_i)⟩    Γ; R; L ⊢ e_i : T_i    AsyncSig(T_i) = ⟨Out_i, In_i, Result_i, E_i⟩
Out_i = TypePrim("()")    In_i = TypePrim("()")    Γ ⊢ pat_i ⇐ Result_i ⊣ B_i    Distinct(PatNames(pat_i))
Γ_i = IntroAll(Γ, B_i)    Γ_i; R; L ⊢ r_i : T_i^r    AllEq_Γ([T_1^r, …, T_n^r])    T_r = T_1^r
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ; R; L ⊢ RaceExpr(arms) : TypeUnion([T_r, E_1, …, E_n])
```

**(T-Race-Stream)**
```text
n = |arms|    n ≥ 2    RaceMode(arms) = `yield`
∀ i, arm_i = ⟨e_i, pat_i, RaceYield(r_i)⟩    Γ; R; L ⊢ e_i : T_i    AsyncSig(T_i) = ⟨Out_i, In_i, Result_i, E_i⟩
In_i = TypePrim("()")    Γ ⊢ pat_i ⇐ Out_i ⊣ B_i    Distinct(PatNames(pat_i))
Γ_i = IntroAll(Γ, B_i)    Γ_i; R; L ⊢ r_i : U_i    AllEq_Γ([U_1, …, U_n])    U = U_1
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ; R; L ⊢ RaceExpr(arms) : TypeApply(["Stream"], [U, TypeUnion([E_1, …, E_n])])
```

**(Race-Arity-Err)**
```text
```

n = |arms|    n < 2
──────────────────────────────────────────────
Γ; R; L ⊢ RaceExpr(arms) ⇑
```

**(Race-Handler-Mix-Err)**
```text
RaceMode(arms) = ⊥
──────────────────────────────────────────────
Γ; R; L ⊢ RaceExpr(arms) ⇑
```

**(Race-Operand-Out-Err)**
```text
```

RaceMode(arms) = `return`
∃ i. Γ; R; L ⊢ e_i : T_i ∧ (AsyncSig(T_i) = ⟨Out_i, In_i, Result_i, E_i⟩ ∧ Out_i ≠ TypePrim("()"))
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ; R; L ⊢ RaceExpr(arms) ⇑
```

**(Race-Operand-Err)**
```text
```

RaceMode(arms) = `return`
∃ i. Γ; R; L ⊢ e_i : T_i ∧ (AsyncSig(T_i) = ⊥ ∨ (AsyncSig(T_i) = ⟨Out_i, In_i, Result_i, E_i⟩ ∧ Out_i = TypePrim("()") ∧ In_i ≠ TypePrim("()")))
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ; R; L ⊢ RaceExpr(arms) ⇑
```

**(Race-Stream-Operand-Err)**
```text
```

RaceMode(arms) = `yield`
∃ i. Γ; R; L ⊢ e_i : T_i ∧ (AsyncSig(T_i) = ⊥ ∨ (AsyncSig(T_i) = ⟨Out_i, In_i, Result_i, E_i⟩ ∧ In_i ≠ TypePrim("()")))
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ; R; L ⊢ RaceExpr(arms) ⇑
```

**(Race-Handler-Type-Err)**
```text
n = |arms|    n ≥ 2    RaceMode(arms) = `return`
∀ i, arm_i = ⟨e_i, pat_i, RaceReturn(r_i)⟩    Γ; R; L ⊢ e_i : T_i    AsyncSig(T_i) = ⟨Out_i, In_i, Result_i, E_i⟩
Out_i = TypePrim("()")    In_i = TypePrim("()")    Γ ⊢ pat_i ⇐ Result_i ⊣ B_i    Distinct(PatNames(pat_i))
Γ_i = IntroAll(Γ, B_i)    Γ_i; R; L ⊢ r_i : T_i^r    ¬ AllEq_Γ([T_1^r, …, T_n^r])
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ; R; L ⊢ RaceExpr(arms) ⇑
```

**(Race-Stream-Handler-Type-Err)**
```text
n = |arms|    n ≥ 2    RaceMode(arms) = `yield`
∀ i, arm_i = ⟨e_i, pat_i, RaceYield(r_i)⟩    Γ; R; L ⊢ e_i : T_i    AsyncSig(T_i) = ⟨Out_i, In_i, Result_i, E_i⟩
In_i = TypePrim("()")    Γ ⊢ pat_i ⇐ Out_i ⊣ B_i    Distinct(PatNames(pat_i))
Γ_i = IntroAll(Γ, B_i)    Γ_i; R; L ⊢ r_i : U_i    ¬ AllEq_Γ([U_1, …, U_n])
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ; R; L ⊢ RaceExpr(arms) ⇑
```

`all` typing is:

**(T-All)**
```text
n = |exprs|    ∀ i, Γ; R; L ⊢ e_i : T_i    AsyncSig(T_i) = ⟨Out_i, In_i, Result_i, E_i⟩
Out_i = TypePrim("()")    In_i = TypePrim("()")    T_tuple = TypeTuple([Result_1, …, Result_n])
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ; R; L ⊢ AllExpr([e_1, …, e_n]) : TypeUnion([T_tuple, E_1, …, E_n])
```

**(All-Out-Err)**
```text
∃ i. Γ; R; L ⊢ e_i : T_i ∧ (AsyncSig(T_i) = ⊥ ∨ (AsyncSig(T_i) = ⟨Out_i, In_i, Result_i, E_i⟩ ∧ Out_i ≠ TypePrim("()")))
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ; R; L ⊢ AllExpr(exprs) ⇑
```

**(All-In-Err)**
```text
∃ i. Γ; R; L ⊢ e_i : T_i ∧ (AsyncSig(T_i) = ⟨Out_i, In_i, Result_i, E_i⟩ ∧ Out_i = TypePrim("()") ∧ In_i ≠ TypePrim("()"))
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ; R; L ⊢ AllExpr(exprs) ⇑
```

`until` has the source-specified type:

```text
```

until : shared T × procedure(const T) -> bool × procedure(unique T) -> R -> Future<R>
```

Async combinator typing is:

```text
```

map    : Async<Out, In, Result, E> × procedure(Out) -> U -> Async<U, In, Result, E>
filter : Async<T, (), (), E> × procedure(const T) -> bool -> Async<T, (), (), E>
take   : Async<T, (), (), E> × usize -> Async<T, (), (), E>
fold   : Async<T, (), (), E> × A × procedure(A, T) -> A -> Future<A, E>
chain  : Future<T, E> × procedure(T) -> Future<U, E> -> Future<U, E>
```

For `e~>name(args)`, if `StripPerm(ExprType(e)) = ModalRefType(modal_ref)` and `BuiltinModalGeneralMember(modal_ref, name)`, typing MUST be derived by the async combinator rules in this section.

A conforming implementation MUST resolve `AsyncCombinatorNames` through built-in modal member lookup on `Async` (including aliases normalized via `AsyncSig`) and MUST NOT treat these members as non-modal ad hoc method-call exceptions.

**(T-Async-Map)**
```text
Γ; R; L ⊢ a : TypeApply(["Async"], [Out, In, Result, E])    Γ; R; L ⊢ f : (Out) -> U
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ; R; L ⊢ a~>map(f) : TypeApply(["Async"], [U, In, Result, E])
```

**(T-Async-Filter)**
```text
Γ; R; L ⊢ a : TypeApply(["Async"], [T, TypePrim("()"), TypePrim("()"), E])    Γ; R; L ⊢ p : (TypePerm(`const`, T)) -> TypePrim("bool")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ; R; L ⊢ a~>filter(p) : TypeApply(["Async"], [T, TypePrim("()"), TypePrim("()"), E])
```

**(T-Async-Take)**
```text
Γ; R; L ⊢ a : TypeApply(["Async"], [T, TypePrim("()"), TypePrim("()"), E])    Γ; R; L ⊢ n : TypePrim("usize")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ; R; L ⊢ a~>take(n) : TypeApply(["Async"], [T, TypePrim("()"), TypePrim("()"), E])
```

**(T-Async-Fold)**
```text
Γ; R; L ⊢ a : TypeApply(["Async"], [T, TypePrim("()"), TypePrim("()"), E])    Γ; R; L ⊢ init : A    Γ; R; L ⊢ f : (A, T) -> A
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ; R; L ⊢ a~>fold(init, f) : TypeApply(["Future"], [A, E])
```

**(T-Async-Chain)**
```text
Γ; R; L ⊢ a : TypeApply(["Future"], [T, E])    Γ; R; L ⊢ f : (T) -> TypeApply(["Future"], [U, E])
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ; R; L ⊢ a~>chain(f) : TypeApply(["Future"], [U, E])
```

#### 21.3.5 Dynamic Semantics

Async iteration over `loop pat in e { body }` is:

1. Evaluate `e` to `a`.
2. If `a` is `@Suspended { output }`, bind `output` to `pat`, execute `body`, and resume with `()`.
3. If `a` is `@Completed { value }`, terminate the loop.
4. If `a` is `@Failed { error }`, propagate the error from the enclosing async procedure.

Manual stepping advances an async value by inspecting its modal state and invoking `~>resume(input)` on `@Suspended`.

`sync` evaluation is:

1. Evaluate `e` to `a`.
2. While `a` is `@Suspended { output = () }`, set `a := a~>resume(())`.
3. If `a` is `@Completed { value }`, produce `value`.
4. If `a` is `@Failed { error }`, produce the union error value.

Formal `sync` rules:

```text
```

SyncStep : AsyncValue × State → AsyncValue × State
```

**(SyncStep-Suspended)**
```text
ModalState(a) = @Suspended    a.output = ()    Γ ⊢ EvalSigma(Resume(a, ()), σ) ⇓ (Val(a'), σ_1)
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ SyncStep(a, σ) ⇓ (a', σ_1)
```

**(EvalSigma-Sync-Suspended)**
```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Val(a), σ_1)    ModalState(a) = @Suspended    Γ ⊢ SyncStep(a, σ_1) ⇓ (a', σ_2)
Γ ⊢ EvalSigma(SyncExpr(a'), σ_2) ⇓ (out, σ_3)
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ EvalSigma(SyncExpr(e), σ) ⇓ (out, σ_3)
```

**(EvalSigma-Sync-Completed)**
```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Val(a), σ_1)    ModalState(a) = @Completed    a.value = v
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ EvalSigma(SyncExpr(e), σ) ⇓ (Val(v), σ_1)
```

**(EvalSigma-Sync-Failed)**
```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Val(a), σ_1)    ModalState(a) = @Failed    a.error = err
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ EvalSigma(SyncExpr(e), σ) ⇓ (Val(err), σ_1)
```

`race` return-mode evaluation is:

1. Initiate all async expressions concurrently.
2. When any arm completes or fails, handle that arm.
3. Cancel all remaining arms.
4. Produce the selected handler result or propagated error value.

`race` streaming-mode evaluation is:

1. Initiate all async expressions concurrently.
2. When an arm yields, execute the corresponding handler and emit its value as the next stream output.
3. When an arm completes, remove it from the race.
4. When all arms complete, the stream completes.
5. If any arm fails, propagate the error and cancel remaining arms.

Formal `race` rules:

```text
SelectReady(asyncs) = (index, async_value) ⇔
  asyncs = [a_1, …, a_n] ∧
  ∃ i ∈ [1..n]. ModalState(a_i) = @Suspended ∧ IsReady(a_i) ∧
  (∀ j < i. ¬IsReady(a_j) ∨ ModalState(a_j) ≠ @Suspended) ∧
  index = i ∧
  async_value = a_i

SelectReadyAny(asyncs) = (index, async_value) ⇔
  asyncs = [a_1, …, a_n] ∧
  ∃ i ∈ [1..n]. (ModalState(a_i) = @Completed ∨ ModalState(a_i) = @Failed ∨ (ModalState(a_i) = @Suspended ∧ IsReady(a_i))) ∧
  (∀ j < i. ModalState(a_j) = @Suspended ∧ ¬IsReady(a_j)) ∧
  index = i ∧
  async_value = a_i

RaceState = { active: [AsyncValue], completed: Option<(Index, AsyncValue)>, mode: `return` | `yield` }
InitRace : [RaceArm] × State → RaceState × State
```

**(InitRace)**
```text
∀ i, Γ ⊢ EvalSigma(arm_i.expr, σ_i) ⇓ (Val(a_i), σ_{i+1})    mode = RaceMode(arms)
race_state = { active: [a_1, …, a_n], completed: ⊥, mode: mode }
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ InitRace(arms, σ_0) ⇓ (race_state, σ_n)
```

```text
```

RaceStepReturn : RaceState × [RaceArm] × State → EvalOut × State
```

**(RaceStepReturn-Completed)**
```text
∃ i. ModalState(race_state.active[i]) = @Completed    a_i = race_state.active[i]    a_i.value = v
arm_i = arms[i]    Γ ⊢ BindPattern(arm_i.pat, v) ⇓ Γ_1    Γ_1 ⊢ EvalSigma(arm_i.handler.expr, σ) ⇓ (Val(r), σ_1)
CancelAll(race_state.active ∖ {a_i}, σ_1) ⇓ σ_2
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ RaceStepReturn(race_state, arms, σ) ⇓ (Val(r), σ_2)
```

**(RaceStepReturn-Failed)**
```text
∃ i. ModalState(race_state.active[i]) = @Failed    a_i = race_state.active[i]    a_i.error = e
CancelAll(race_state.active ∖ {a_i}, σ) ⇓ σ_1
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ RaceStepReturn(race_state, arms, σ) ⇓ (Val(e), σ_1)
```

**(RaceStepReturn-Continue)**
```text
∀ i. ModalState(race_state.active[i]) = @Suspended
SelectReady(race_state.active) = (j, a_j)    Γ ⊢ EvalSigma(Resume(a_j, ()), σ) ⇓ (Val(a_j'), σ_1)
race_state' = race_state[active[j] ↦ a_j']    Γ ⊢ RaceStepReturn(race_state', arms, σ_1) ⇓ (out, σ_2)
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ RaceStepReturn(race_state, arms, σ) ⇓ (out, σ_2)
```

**(EvalSigma-Race-Return)**
```text
RaceMode(arms) = `return`    Γ ⊢ InitRace(arms, σ) ⇓ (race_state, σ_1)
Γ ⊢ RaceStepReturn(race_state, arms, σ_1) ⇓ (out, σ_2)
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ EvalSigma(RaceExpr(arms), σ) ⇓ (out, σ_2)
```

```text
```

RaceStepStream : RaceState × [RaceArm] × State → EvalOut × State
```

**(RaceStepStream-Yield)**
```text
∃ i. ModalState(race_state.active[i]) = @Suspended    a_i = race_state.active[i]    a_i.output = v
arm_i = arms[i]    Γ ⊢ BindPattern(arm_i.pat, v) ⇓ Γ_1    Γ_1 ⊢ EvalSigma(arm_i.handler.expr, σ) ⇓ (Val(u), σ_1)
stream_state = { race_state: race_state, pending_yield: (i, u) }
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ RaceStepStream(race_state, arms, σ) ⇓ (Suspend(AsyncSuspended(u, stream_state)), σ_1)
```

**(RaceStepStream-AllComplete)**
```text
∀ i. ModalState(race_state.active[i]) = @Completed
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ RaceStepStream(race_state, arms, σ) ⇓ (Val(AsyncCompleted(())), σ)
```

**(RaceStepStream-Failed)**
```text
∃ i. ModalState(race_state.active[i]) = @Failed    a_i = race_state.active[i]    a_i.error = e
CancelAll(race_state.active ∖ {a_i}, σ) ⇓ σ_1
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ RaceStepStream(race_state, arms, σ) ⇓ (Val(AsyncFailed(e)), σ_1)
```

**(EvalSigma-Race-Stream)**
```text
RaceMode(arms) = `yield`    Γ ⊢ InitRace(arms, σ) ⇓ (race_state, σ_1)
Γ ⊢ RaceStepStream(race_state, arms, σ_1) ⇓ (out, σ_2)
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ EvalSigma(RaceExpr(arms), σ) ⇓ (out, σ_2)
```

```text
```

CancelAll : [AsyncValue] × State → State
```

**(CancelAll)**
```text
∀ a ∈ asyncs. Cancel(a) ⇓ ()
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
CancelAll(asyncs, σ) ⇓ σ
```

Streaming-race suspension state is:

```text
```

RaceStreamState = { race_state: RaceState, yielded_arm: Index }

RaceResumeOrder(state, arms) = [state.yielded_arm] ++ [j | 1 ≤ j ≤ |arms| ∧ j ≠ state.yielded_arm ∧ ModalState(state.race_state.active[j]) ≠ @Completed]

ResumeRaceArm(a, σ) ⇓ (a', σ') ⇔ ModalState(a) = @Suspended ∧ Γ ⊢ EvalSigma(Resume(a, ()), σ) ⇓ (Val(a'), σ')
ResumeRaceArm(a, σ) ⇓ (a, σ)  ⇔ ModalState(a) = @Completed
```

**(RaceStepStream-Yield)**
```text
∃ i. ModalState(race_state.active[i]) = @Suspended    a_i = race_state.active[i]    a_i.output = v
arm_i = arms[i]    Γ ⊢ BindPattern(arm_i.pat, v) ⇓ Γ_1    Γ_1 ⊢ EvalSigma(arm_i.handler.expr, σ) ⇓ (Val(u), σ_1)
stream_state = { race_state: race_state, yielded_arm: i }
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ RaceStepStream(race_state, arms, σ) ⇓ (Suspend(AsyncSuspended(u, stream_state)), σ_1)
```

**(ResumeRaceState-Step)**
```text
order = [i] ++ rest    a_i = state.active[i]    ResumeRaceArm(a_i, σ) ⇓ (a_i', σ_1)
state' = state[active[i] ↦ a_i']    Γ ⊢ ResumeRaceState(state', rest, σ_1) ⇓ (state'', σ_2)
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ ResumeRaceState(state, order, σ) ⇓ (state'', σ_2)
```

**(ResumeRaceState-Done)**
```text
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ ResumeRaceState(state, [], σ) ⇓ (state, σ)
```

**(EvalSigma-Race-Stream-Resume)**
```text
```

async_state = AsyncSuspended(_, stream_state)    input = ()    order = RaceResumeOrder(stream_state, arms)
Γ ⊢ ResumeRaceState(stream_state.race_state, order, σ) ⇓ (race_state', σ_1)
Γ ⊢ RaceStepStream(race_state', arms, σ_1) ⇓ (out, σ_2)
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ EvalSigma(Resume(async_state, input), σ) ⇓ (out, σ_2)
```

On resumption of a streaming `race`, the previously yielded arm MUST resume first. Remaining live arms MUST then resume in arm declaration order. The first resumed arm to yield determines the next stream output. The first resumed arm to fail cancels the remaining live arms and determines the failure result.

`all` evaluation is:

1. Initiate all async expressions concurrently.
2. Wait for all operations to complete.
3. If all succeed, return the result tuple in expression order.
4. If any fails, cancel remaining operations and return the first recorded error value.

Formal `all` rules:

```text
```

AllState = { active: [AsyncValue], results: [Option<Value>], failed: Option<Error> }
InitAll : [Expr] × State → AllState × State
```

**(InitAll)**
```text
∀ i, Γ ⊢ EvalSigma(e_i, σ_i) ⇓ (Val(a_i), σ_{i+1})
all_state = { active: [a_1, …, a_n], results: [⊥, …, ⊥], failed: ⊥ }
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ InitAll([e_1, …, e_n], σ_0) ⇓ (all_state, σ_n)
```

```text
```

AllStep : AllState × State → AllState × State
```

**(AllStep-Complete)**
```text
∃ i. ModalState(all_state.active[i]) = @Completed    a_i = all_state.active[i]    a_i.value = v
all_state' = all_state[results[i] ↦ v]
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ AllStep(all_state, σ) ⇓ (all_state', σ)
```

**(AllStep-Failed)**
```text
∃ i. ModalState(all_state.active[i]) = @Failed    a_i = all_state.active[i]    a_i.error = e    all_state.failed = ⊥
remaining = { a_j | j ≠ i ∧ ModalState(a_j) ≠ @Completed }    CancelAll(remaining, σ) ⇓ σ_1
all_state' = all_state[failed ↦ e]
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ AllStep(all_state, σ) ⇓ (all_state', σ_1)
```

**(AllStep-Resume)**
```text
∀ i. ModalState(all_state.active[i]) ≠ @Failed    ∃ j. all_state.results[j] = ⊥ ∧ ModalState(all_state.active[j]) = @Suspended
SelectReady(all_state.active) = (j, a_j)    Γ ⊢ EvalSigma(Resume(a_j, ()), σ) ⇓ (Val(a_j'), σ_1)
all_state' = all_state[active[j] ↦ a_j']
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ AllStep(all_state, σ) ⇓ (all_state', σ_1)
```

```text
```

AllLoop : AllState × State → EvalOut × State
```

**(AllLoop-AllCompleted)**
```text
∀ i. all_state.results[i] ≠ ⊥    all_state.failed = ⊥    tuple = (all_state.results[1], …, all_state.results[n])
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ AllLoop(all_state, σ) ⇓ (Val(tuple), σ)
```

**(AllLoop-Failed)**
```text
all_state.failed = e    e ≠ ⊥
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ AllLoop(all_state, σ) ⇓ (Val(e), σ)
```

**(AllLoop-Continue)**
```text
∃ i. all_state.results[i] = ⊥    all_state.failed = ⊥    Γ ⊢ AllStep(all_state, σ) ⇓ (all_state', σ_1)
Γ ⊢ AllLoop(all_state', σ_1) ⇓ (out, σ_2)
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ AllLoop(all_state, σ) ⇓ (out, σ_2)
```

**(EvalSigma-All)**
```text
Γ ⊢ InitAll(exprs, σ) ⇓ (all_state, σ_1)    Γ ⊢ AllLoop(all_state, σ_1) ⇓ (out, σ_2)
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ EvalSigma(AllExpr(exprs), σ) ⇓ (out, σ_2)
```

`until` evaluation is:

1. If `pred(shared_value)` is true, acquire a Write key for the target path, execute `action(shared_value)`, and complete the future with the result.
2. Otherwise register a waiter record and transition to `@Suspended { output = () }`.
3. On key release, re-evaluate registered waiters and schedule those whose predicates become true.

Async combinators create wrapper async values:

```text
MappedAsync = ⟨source, f⟩
FilteredAsync = ⟨source, pred, state⟩    state ∈ {Pending, Done}
TakeAsync = ⟨source, remaining⟩
FoldAsync = ⟨source, acc, f⟩
ChainAsync = ⟨source, f, state⟩    state ∈ {WaitingSource, WaitingChained(inner)}
```

Formal combinator rules:

**(EvalSigma-Map-Create)**
```text
Γ ⊢ EvalSigma(a, σ) ⇓ (Val(src), σ')    Γ ⊢ EvalSigma(f, σ') ⇓ (Val(fn), σ'')
────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ EvalSigma(a~>map(f), σ) ⇓ (Val(MappedAsync(src, fn)), σ'')
```

**(EvalSigma-Map-Resume-Yield)**
```text
a = MappedAsync(src, f)    Γ ⊢ Resume(src, input, σ) ⇓ (@Suspended{output: v}, σ')    Γ ⊢ Apply(f, v, σ') ⇓ (Val(v'), σ'')
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ Resume(a, input, σ) ⇓ (@Suspended{output: v'}, σ'')
```

**(EvalSigma-Map-Resume-Complete)**
```text
a = MappedAsync(src, f)    Γ ⊢ Resume(src, input, σ) ⇓ (@Completed{value: v}, σ')
────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ Resume(a, input, σ) ⇓ (@Completed{value: v}, σ')
```

**(EvalSigma-Map-Resume-Failed)**
```text
a = MappedAsync(src, f)    Γ ⊢ Resume(src, input, σ) ⇓ (@Failed{error: e}, σ')
────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ Resume(a, input, σ) ⇓ (@Failed{error: e}, σ')
```

**(EvalSigma-Filter-Create)**
```text
Γ ⊢ EvalSigma(a, σ) ⇓ (Val(src), σ')    Γ ⊢ EvalSigma(p, σ') ⇓ (Val(pred), σ'')
────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ EvalSigma(a~>filter(p), σ) ⇓ (Val(FilteredAsync(src, pred, Pending)), σ'')
```

**(EvalSigma-Filter-Resume-Pass)**
```text
a = FilteredAsync(src, pred, Pending)    Γ ⊢ Resume(src, (), σ) ⇓ (@Suspended{output: v}, σ')    Γ ⊢ Apply(pred, v, σ') ⇓ (Val(true), σ'')
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ Resume(a, (), σ) ⇓ (@Suspended{output: v}, σ'')
```

**(EvalSigma-Filter-Resume-Skip)**
```text
a = FilteredAsync(src, pred, Pending)    Γ ⊢ Resume(src, (), σ) ⇓ (@Suspended{output: v}, σ')    Γ ⊢ Apply(pred, v, σ') ⇓ (Val(false), σ'')
Γ ⊢ Resume(FilteredAsync(src, pred, Pending), (), σ'') ⇓ (out, σ''')
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ Resume(a, (), σ) ⇓ (out, σ''')
```

**(EvalSigma-Filter-Resume-Complete)**
```text
a = FilteredAsync(src, pred, _)    Γ ⊢ Resume(src, (), σ) ⇓ (@Completed{value: v}, σ')
────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ Resume(a, (), σ) ⇓ (@Completed{value: v}, σ')
```

**(EvalSigma-Take-Create)**
```text
Γ ⊢ EvalSigma(a, σ) ⇓ (Val(src), σ')    Γ ⊢ EvalSigma(n, σ') ⇓ (Val(count), σ'')
────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ EvalSigma(a~>take(n), σ) ⇓ (Val(TakeAsync(src, count)), σ'')
```

**(EvalSigma-Take-Resume-Yield)**
```text
a = TakeAsync(src, n)    n > 0    Γ ⊢ Resume(src, (), σ) ⇓ (@Suspended{output: v}, σ')
────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ Resume(a, (), σ) ⇓ (@Suspended{output: v}, σ')    ∧ a' = TakeAsync(src, n - 1)
```

**(EvalSigma-Take-Resume-Done)**
```text
```

a = TakeAsync(src, 0)
────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ Resume(a, (), σ) ⇓ (@Completed{value: ()}, σ)
```

**(EvalSigma-Take-Resume-Source-Complete)**
```text
a = TakeAsync(src, n)    Γ ⊢ Resume(src, (), σ) ⇓ (@Completed{value: v}, σ')
────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ Resume(a, (), σ) ⇓ (@Completed{value: ()}, σ')
```

**(EvalSigma-Fold-Create)**
```text
Γ ⊢ EvalSigma(a, σ) ⇓ (Val(src), σ')    Γ ⊢ EvalSigma(init, σ') ⇓ (Val(acc), σ'')    Γ ⊢ EvalSigma(f, σ'') ⇓ (Val(fn), σ''')
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ EvalSigma(a~>fold(init, f), σ) ⇓ (Val(FoldAsync(src, acc, fn)), σ''')
```

**(EvalSigma-Fold-Resume-Accumulate)**
```text
a = FoldAsync(src, acc, f)    Γ ⊢ Resume(src, (), σ) ⇓ (@Suspended{output: v}, σ')    Γ ⊢ Apply(f, (acc, v), σ') ⇓ (Val(acc'), σ'')
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ Resume(a, (), σ) ⇓ (@Suspended{output: ()}, σ'')    ∧ a' = FoldAsync(src, acc', f)
```

**(EvalSigma-Fold-Resume-Complete)**
```text
a = FoldAsync(src, acc, f)    Γ ⊢ Resume(src, (), σ) ⇓ (@Completed{value: _}, σ')
────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ Resume(a, (), σ) ⇓ (@Completed{value: acc}, σ')
```

**(EvalSigma-Fold-Resume-Failed)**
```text
a = FoldAsync(src, acc, f)    Γ ⊢ Resume(src, (), σ) ⇓ (@Failed{error: e}, σ')
────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ Resume(a, (), σ) ⇓ (@Failed{error: e}, σ')
```

**(EvalSigma-Chain-Create)**
```text
Γ ⊢ EvalSigma(a, σ) ⇓ (Val(src), σ')    Γ ⊢ EvalSigma(f, σ') ⇓ (Val(fn), σ'')
────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ EvalSigma(a~>chain(f), σ) ⇓ (Val(ChainAsync(src, fn, WaitingSource)), σ'')
```

**(EvalSigma-Chain-Resume-Source-Complete)**
```text
a = ChainAsync(src, f, WaitingSource)    Γ ⊢ Resume(src, (), σ) ⇓ (@Completed{value: v}, σ')    Γ ⊢ Apply(f, v, σ') ⇓ (Val(inner), σ'')
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ Resume(a, (), σ) ⇓ (@Suspended{output: ()}, σ'')    ∧ a' = ChainAsync(src, f, WaitingChained(inner))
```

**(EvalSigma-Chain-Resume-Chained)**
```text
a = ChainAsync(_, _, WaitingChained(inner))    Γ ⊢ Resume(inner, (), σ) ⇓ (out, σ')
────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ Resume(a, (), σ) ⇓ (out, σ')
```

**(EvalSigma-Chain-Resume-Source-Failed)**
```text
a = ChainAsync(src, f, WaitingSource)    Γ ⊢ Resume(src, (), σ) ⇓ (@Failed{error: e}, σ')
────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ Resume(a, (), σ) ⇓ (@Failed{error: e}, σ')
```

#### 21.3.6 Lowering

AsyncComposeIR = {SyncLoopIR, RaceInitIR, RaceSelectIR, RaceResumeIR, AllInitIR, AllJoinIR, UntilWaiterIR, AsyncMapIR, AsyncFilterIR, AsyncTakeIR, AsyncFoldIR, AsyncChainIR}

**(Lower-Expr-Sync)**
```text
Γ ⊢ LowerExpr(e) ⇓ ⟨IR_e, v_e⟩
────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ LowerExpr(SyncExpr(e)) ⇓ ⟨SeqIR(IR_e, SyncLoopIR(v_e)), SyncResult(v_e)⟩
```

`SyncLoopIR(v)` MUST loop on the modal state of `v`, resuming `@Suspended` with input `()`, returning `@Completed.value`, and returning the union error value from `@Failed.error`.

**(Lower-Expr-Race-Return)**
```text
```

RaceMode(arms) = `return`
────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ LowerExpr(RaceExpr(arms)) ⇓ ⟨RaceInitIR(arms, `return`), RaceSelectIR(`return`)⟩
```

**(Lower-Expr-Race-Stream)**
```text
```

RaceMode(arms) = `yield`
────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ LowerExpr(RaceExpr(arms)) ⇓ ⟨RaceInitIR(arms, `yield`), RaceSelectIR(`yield`)⟩
```

For `RaceInitIR(arms, mode)`, lowering MUST:
1. evaluate all arm expressions left-to-right,
2. store the live arm states in declaration order,
3. for streaming mode, allocate race-stream suspension state containing the live arm vector and the yielded-arm index.

`RaceResumeIR` MUST lower streaming-race resumption according to **(EvalSigma-Race-Stream-Resume)**.

**(Lower-Expr-All)**
```text
Γ ⊢ LowerExpr(AllExpr(exprs)) ⇓ ⟨AllInitIR(exprs), AllJoinIR(exprs)⟩
```

`AllJoinIR` MUST preserve expression order in the result tuple and MUST cancel unfinished operands on the first failure.

Async combinators lower to wrapper async state machines around their source operand:

**(Lower-Async-Map)**
```text
Γ ⊢ LowerExpr(a~>map(f)) ⇓ ⟨AsyncMapIR(a, f), AsyncMapState(a, f)⟩
```

**(Lower-Async-Filter)**
```text
Γ ⊢ LowerExpr(a~>filter(p)) ⇓ ⟨AsyncFilterIR(a, p), AsyncFilterState(a, p)⟩
```

**(Lower-Async-Take)**
```text
Γ ⊢ LowerExpr(a~>take(n)) ⇓ ⟨AsyncTakeIR(a, n), AsyncTakeState(a, n)⟩
```

**(Lower-Async-Fold)**
```text
Γ ⊢ LowerExpr(a~>fold(init, f)) ⇓ ⟨AsyncFoldIR(a, init, f), AsyncFoldState(a, init, f)⟩
```

**(Lower-Async-Chain)**
```text
Γ ⊢ LowerExpr(a~>chain(f)) ⇓ ⟨AsyncChainIR(a, f), AsyncChainState(a, f)⟩
```

Each wrapper lowering MUST delegate to the source async via `resume`, store its local wrapper state in the generated async frame, and preserve the dynamic semantics of §21.3.5 exactly.

#### 21.3.7 Diagnostics

| Code         | Severity | Detection    | Condition                                   |
| ------------ | -------- | ------------ | ------------------------------------------- |
| `E-CON-0212` | Error    | Compile-time | `yield` inside `sync` expression            |
| `E-CON-0223` | Error    | Compile-time | `yield from` inside `sync` expression       |
| `E-CON-0240` | Error    | Compile-time | Iteration over async with `In ≠ ()`         |
| `E-CON-0250` | Error    | Compile-time | `sync` inside async-returning procedure     |
| `E-CON-0251` | Error    | Compile-time | `sync` operand has `Out ≠ ()`               |
| `E-CON-0252` | Error    | Compile-time | `sync` operand has `In ≠ ()`                |
| `E-CON-0260` | Error    | Compile-time | `race` with fewer than 2 arms               |
| `E-CON-0261` | Error    | Compile-time | `race` arms have incompatible types         |
| `E-CON-0262` | Error    | Compile-time | Non-streaming `race` operand has `Out ≠ ()` |
| `E-CON-0263` | Error    | Compile-time | Mixed yield/non-yield handlers in race      |
| `E-CON-0270` | Error    | Compile-time | `all` operand has `Out ≠ ()`                |
| `E-CON-0271` | Error    | Compile-time | `all` operand has `In ≠ ()`                 |

### 21.4 Async State Machine

#### 21.4.1 Syntax

This section introduces no additional surface syntax beyond ordinary procedure declarations, calls, and `resume` method calls on `Async@Suspended`.

```text
An async procedure is any procedure whose declared return type `R` satisfies `AsyncSig(R) ≠ ⊥`.

#### 21.4.2 Parsing

This section introduces no additional parser productions beyond ordinary procedure, call, and method-call parsing.

#### 21.4.3 AST Representation / Form

Async-state-machine analysis uses the following helper forms:

```text
SuspendExpr(e) ⇔ e = YieldExpr(_, _) ∨ e = YieldFromExpr(_, _)

AsyncCreateExpr(Call(_, _)) ⇔ AsyncSig(ExprType(Call(_, _))) ≠ ⊥
AsyncCreateExpr(MethodCall(_, _, _)) ⇔ AsyncSig(ExprType(MethodCall(_, _, _))) ≠ ⊥
AsyncCreateExpr(RaceExpr(_)) ⇔ AsyncSig(ExprType(RaceExpr(_))) ≠ ⊥
AsyncCreateExpr(_) ⇔ false

AsyncCaptureArgs(Call(_, args)) = [e | ⟨_, e, _⟩ ∈ args]
AsyncCaptureArgs(MethodCall(base, _, args)) = [base] ++ [e | ⟨_, e, _⟩ ∈ args]
AsyncCaptureArgs(RaceExpr(arms)) = [e | ⟨e, _, _⟩ ∈ arms]
AsyncCaptureArgs(_) = []

ASYNC_LARGE_CAPTURE_THRESHOLD_BYTES = WIDEN_LARGE_PAYLOAD_THRESHOLD_BYTES
AsyncCaptureSize(args) = Σ_{e ∈ args} sizeof(ExprType(e))
AsyncCaptureWarnCond(e) ⇔ AsyncCreateExpr(e) ∧ AsyncCaptureSize(AsyncCaptureArgs(e)) > ASYNC_LARGE_CAPTURE_THRESHOLD_BYTES
```

The async frame stores:

- every binding live across suspension,
- the current resumption point,
- implementation fields required by the runtime.

#### 21.4.4 Static Semantics

A binding is live across suspension iff there exists a control-flow path from a suspension point to a use of the binding on which the binding is not redefined.

Large capture warning and capture/escape provenance rules are:

**(Warn-Async-LargeCapture)**
```text
```

AsyncCaptureWarnCond(e)
───────────────────────────────────────────────────────────────
Γ ⊢ WarnAsyncCapture(e) ⇓ ok
```

**(Warn-Async-LargeCapture-Ok)**
```text
```

¬ AsyncCaptureWarnCond(e)
───────────────────────────────────────────────
Γ ⊢ WarnAsyncCapture(e) ⇓ ok
```

When **(Warn-Async-LargeCapture)** applies, emit the warning defined in §21.4.7.

**(Async-Capture-Err)**
```text
AsyncCreateExpr(e)    AsyncCaptureArgs(e) = args    ∃ e_i ∈ args. Γ; Ω ⊢ e_i ⇓ π_i ∧ π_i < FrameProv(Γ, Ω)
────────────────────────────────────────────────────────────────────────────────────────────────
Γ; Ω ⊢ e ⇑
```

**(P-Async-Create)**
```text
AsyncCreateExpr(e)    AsyncCaptureArgs(e) = args    ∀ e_i ∈ args, Γ; Ω ⊢ e_i ⇓ π_i
∀ e_i ∈ args, ¬(π_i < FrameProv(Γ, Ω))    Γ ⊢ WarnAsyncCapture(e) ⇓ ok
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ; Ω ⊢ e ⇓ FrameProv(Γ, Ω)
```

**(Prov-Async-Escape-Err)**
```text
stmt ∈ {AssignStmt(p, e), CompoundAssignStmt(p, _, e)}    Γ; Ω ⊢ p ⇓ π_x    Γ; Ω ⊢ e ⇓ π_e
π_e < π_x    AsyncSig(ExprType(e)) ≠ ⊥
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ; Ω ⊢ stmt ⇑
```

Typing of error propagation in async procedures is defined by the async propagate rules in Chapter 16.

#### 21.4.5 Dynamic Semantics

Evaluation of a call to an async procedure:

1. Evaluate arguments left-to-right.
2. Allocate a fresh async frame, capturing required arguments and initializing the resumption point to the procedure entry.
3. Execute the body until it suspends, completes, or fails.
4. The call expression evaluates to the produced async modal state.

Settlement rules are:

- `yield` or `yield from` produces `Async@Suspended { output = v }`.
- `return` produces `Async@Completed { value = v }`.
- error propagation via `?` produces `Async@Failed { error = e }`.

Evaluation of `a~>resume(input)` for `a : Async@Suspended`:

1. Resume execution at the stored resumption point with the yielded input value bound to the suspended `yield` expression.
2. Run until the next suspension, completion, or failure, and return the resulting `Async` state.

When an async computation fails:

1. Capture the error value.
2. Execute `defer` blocks in reverse order.
3. Run `Drop` implementations for live bindings.
4. Transition to `@Failed { error }`.

#### 21.4.6 Lowering

AsyncStateMachineJudg = {LowerAsyncProc, LowerAsyncResume}
AsyncProcIR = {AsyncFrameInitIR, AsyncResumeSwitchIR, AsyncSuspendStateIR, AsyncCompleteStateIR, AsyncFailStateIR}

```text
```

GenPoints(proc) = [g_0, …, g_n]    where the suspension expressions of proc are listed in source order
FrameSlots(proc) = CaptureSet(proc) ∪ LiveAcrossSuspend(proc)
```

**(Lower-Async-Proc)**
```text
```

ProcedureDecl(_, _, name, _, _, params, ret_opt, _, body, _, _) = proc    AsyncSig(ProcReturn(ret_opt)) = sig
slots = FrameSlots(proc)    gen_points = GenPoints(proc)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ LowerAsyncProc(proc) ⇓ ProcIR(Mangle(proc), params, ProcReturn(ret_opt), AsyncFrameInitIR(name, sig, slots, gen_points))
```

`AsyncFrameInitIR` MUST:
1. evaluate arguments left-to-right,
2. allocate the async frame,
3. copy or move captured values into `FrameSlots(proc)`,
4. initialize `gen_point` to `g_0`,
5. enter `AsyncResumeSwitchIR`.

**(Lower-Async-Resume)**
```text
AsyncSig(ExprType(a)) = sig    CurrentAsyncFrame(Γ) = f    CurrentProcedure(Γ) = proc
────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ LowerAsyncResume(a) ⇓ AsyncResumeSwitchIR(f, GenPoints(proc))
```

`AsyncResumeSwitchIR` MUST dispatch on the stored `gen_point` and continue execution at the corresponding resumption label.

**(Lower-Async-Suspend)**
```text
CurrentAsyncFrame(Γ) = f    CurrentGenPoint(Γ) = g
────────────────────────────────────────────────────────────────────────────────────────────────
Suspend(async_state) lowers through AsyncSuspendStateIR(f, g)
```

**(Lower-Async-Complete)**
```text
CurrentAsyncFrame(Γ) = f
────────────────────────────────────────────────────────────────────────────────────────────────
Return from an async procedure lowers through AsyncCompleteStateIR(f)
```

**(Lower-Async-Fail)**
```text
CurrentAsyncFrame(Γ) = f
────────────────────────────────────────────────────────────────────────────────────────────────
Async failure lowers through AsyncFailStateIR(f)
```

`AsyncFailStateIR(f)` MUST execute `defer` blocks and drop live frame slots in reverse cleanup order before materializing `@Failed { error }`. If `AsyncSig(ProcReturn(ret_opt)).4 = TypePrim("!")`, `AsyncFailStateIR(f)` is unreachable and MUST NOT be emitted.

#### 21.4.7 Diagnostics

| Code         | Severity | Detection    | Condition                               |
| ------------ | -------- | ------------ | --------------------------------------- |
| `W-CON-0201` | Warning  | Compile-time | Large captured state (performance)      |
| `E-CON-0280` | Error    | Compile-time | Captured binding does not outlive async |
| `E-CON-0281` | Error    | Compile-time | Async operation escapes its region      |

### 21.5 Async-Key Integration

#### 21.5.1 Syntax

This section introduces no additional surface syntax beyond `wait`, `yield`, `yield from`, `yield release`, closures, and the key forms defined in Chapter 19.

#### 21.5.2 Parsing

This section introduces no additional parser productions.

#### 21.5.3 AST Representation / Form

Async-key integration is defined over existing forms:

- `WaitExpr(handle)`
- `YieldExpr(release_opt, expr)`
- `YieldFromExpr(release_opt, expr)`
- `ClosureExpr(params, ret_type_opt, body)`

This section introduces no additional AST node variants.

#### 21.5.4 Static Semantics

Async key restrictions are:

- `wait` is ill-formed at program point `p` when `Γ_keys(p) ≠ ∅`.
- `yield` is ill-formed at program point `p` when `release_opt = ⊥` and `Γ_keys(p) ≠ ∅`.
- `yield from` is ill-formed at program point `p` when `release_opt = ⊥` and `Γ_keys(p) ≠ ∅`.

Shared-capturing closures that contain `yield` are additionally constrained:

**(A-Closure-Yield-Keys-Err)**
```text
C = ClosureExpr(params, ret_type_opt, body)    YieldExpr(_, _) ∈ body    SharedCaptures(C) ≠ ∅
YieldExpr(⊥, _) at program point p within body    Γ_keys(p) ≠ ∅
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ C ⇑
```

A closure that captures `shared` bindings and contains `yield` expressions MUST NOT hold keys across the yield point unless the `release` modifier is present.

Bindings derived from shared data before a `yield release` are potentially stale after resumption. The staleness warning defined in Chapter 19 applies unless suppressed by `[[stale_ok]]`.

Async capability requirements are:

| Category      | Capability Required                         |
| ------------- | ------------------------------------------- |
| Pure sequence | None                                        |
| I/O operation | Capability providing the invoked I/O method |
| Timing        | `System`                                    |
| Async runtime | `Reactor`                                   |

#### 21.5.5 Dynamic Semantics

At suspension, the task releases access rights. Other tasks MAY acquire keys to the same paths during the suspension period.

For `yield release`, key release and reacquisition are defined by §21.2.5.

Async failure handling is defined by §21.4.5.

#### 21.5.6 Lowering

AsyncKeyIR = {SnapshotHeldKeysIR, ReleaseHeldKeysIR, ReacquireHeldKeysIR, StaleValueMarkIR}

**(Lower-Wait-Key-Illegal)**
```text
WaitExpr(h) occurs at program point p    Γ_keys(p) ≠ ∅
────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ LowerExpr(WaitExpr(h)) ⇑
```

**(Lower-Yield-Release-Keys)**
```text
YieldExpr(Release, e) at program point p    Γ_keys(p) = keys    keys ≠ ∅
────────────────────────────────────────────────────────────────────────────────────────────────
Lowering MUST emit SnapshotHeldKeysIR(CurrentAsyncFrame(Γ)), then ReleaseHeldKeysIR(CurrentAsyncFrame(Γ)), then the ordinary yield lowering, and MUST prepend ReacquireHeldKeysIR(CurrentAsyncFrame(Γ)) to the resumption target.
```

**(Lower-YieldFrom-Release-Keys)**
```text
YieldFromExpr(Release, e) at program point p    Γ_keys(p) = keys    keys ≠ ∅
────────────────────────────────────────────────────────────────────────────────────────────────
Lowering MUST use the same key snapshot, release, and reacquisition sequence as **(Lower-Yield-Release-Keys)** around the delegated async state machine.
```

**(Lower-Closure-Yield-Shared)**
```text
C = ClosureExpr(params, ret_type_opt, body)    SharedCaptures(C) ≠ ∅    YieldExpr(Release, _) ∈ body ∨ YieldFromExpr(Release, _) ∈ body
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Lowering MUST attach the captured-key snapshot to the generated closure async frame and MUST emit StaleValueMarkIR for bindings derived from shared captures across the suspension boundary.
```

Bindings marked by `StaleValueMarkIR` remain usable but MUST continue to trigger the Chapter 19 staleness warning unless suppressed by `[[stale_ok]]`.

#### 21.5.7 Diagnostics

| Code         | Severity | Detection    | Condition                                          |
| ------------ | -------- | ------------ | -------------------------------------------------- |
| `E-CON-0133` | Error    | Compile-time | `wait` while key is held                           |
| `E-CON-0213` | Error    | Compile-time | `yield` while key is held (without `release`)      |
| `E-CON-0224` | Error    | Compile-time | `yield from` while key is held (without `release`) |

### 21.6 Async Diagnostics Supplement

This section owns async diagnostics not covered by the syntax-local tables in §§21.1 through 21.5.

| Code         | Severity | Detection    | Condition                                       |
| ------------ | -------- | ------------ | ----------------------------------------------- |
| `E-CON-0203` | Error    | Compile-time | `result` type mismatch with `Result` parameter  |
| `E-CON-0230` | Error    | Compile-time | Error propagation in infallible async procedure |
