---
title: "Modal and Special Types"
description: "13. Modal and Special Types of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T17:39:45.389Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## 13. Modal and Special Types

### 13.1 Modal Declarations

#### 13.1.1 Syntax

```text
modal_decl        ::= attribute_list? visibility? "modal" identifier generic_params? implements_clause? predicate_clause? modal_body invariant_clause?
modal_body        ::= "{" state_block* "}"
state_block       ::= "@" identifier "{" state_member* "}"
state_member      ::= state_field_decl | state_method_def | transition_def
modal_type_ref    ::= type_path generic_args?
modal_state_type  ::= modal_type_ref "@" identifier
modal_state_expr  ::= modal_type_ref "@" identifier "{" field_init_list? "}"
```

#### 13.1.2 Parsing

**(Parse-Modal)**

```text
Γ ⊢ ParseAttrListOpt(P) ⇓ (P_0, attrs_opt)    Γ ⊢ ParseVis(P_0) ⇓ (P_1, vis)    IsKw(Tok(P_1), `modal`)    Γ ⊢ ParseIdent(Advance(P_1)) ⇓ (P_2, name)    Γ ⊢ ParseGenericParamsOpt(P_2) ⇓ (P_3, gen_params_opt)    Γ ⊢ ParseImplementsOpt(P_3) ⇓ (P_4, impls)    Γ ⊢ ParsePredicateClauseOpt(P_4) ⇓ (P_5, predicate_clause_opt)    Γ ⊢ ParseModalBody(P_5) ⇓ (P_6, states)    Γ ⊢ ParseInvariantOpt(P_6) ⇓ (P_7, invariant_opt)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseItem(P) ⇓ (P_7, ⟨ModalDecl, attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, impls, states, invariant_opt, SpanBetween(P, P_7), []⟩)
```

**(Parse-ModalBody)**

```text
IsPunc(Tok(P), "{")    Γ ⊢ ParseStateBlockList(Advance(P)) ⇓ (P_1, states)    IsPunc(Tok(P_1), "}")
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseModalBody(P) ⇓ (Advance(P_1), states)
```

**(Parse-StateBlock)**

```text
IsOp(Tok(P), "@")    Γ ⊢ ParseIdent(Advance(P)) ⇓ (P_1, name)    IsPunc(Tok(P_1), "{")    Γ ⊢ ParseStateMemberList(Advance(P_1)) ⇓ (P_2, members)    IsPunc(Tok(P_2), "}")
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseStateBlock(P) ⇓ (Advance(P_2), ⟨name, members, SpanBetween(P, P_2), []⟩)
```

**Modal Type References.**

```text
ParseModalTypeRef(P) ⇓ (P_2, tr) ⇔ Γ ⊢ ParseTypePath(P) ⇓ (P_1, path) ∧ Γ ⊢ ParseGenericArgsOpt(P_1) ⇓ (P_2, args_opt) ∧ tr = (TypePath(path) if args_opt = ⊥ else TypeApply(path, args_opt))
```

**(Parse-Modal-State-Type)**

```text
Γ ⊢ ParseModalTypeRef(P) ⇓ (P_1, modal_ref)    IsOp(Tok(P_1), "@")    Γ ⊢ ParseIdent(Advance(P_1)) ⇓ (P_2, state)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseNonPermType(P) ⇓ (P_2, TypeModalState(modal_ref, state))
```

**(Parse-Record-Literal-ModalState)**

```text
Γ ⊢ ParseModalTypeRef(P) ⇓ (P_1, modal_ref)    IsOp(Tok(P_1), "@")    Γ ⊢ ParseIdent(Advance(P_1)) ⇓ (P_2, state)    IsPunc(Tok(P_2), "{")    Γ ⊢ ParseFieldInitList(Advance(P_2)) ⇓ (P_3, fields)    IsPunc(Tok(P_3), "}")
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePrimary(P) ⇓ (Advance(P_3), RecordExpr(ModalStateRef(modal_ref, state), fields))
```

`ParseStateMember` dispatches to the owning feature parsers in §§13.2.2, 13.3.2, and 13.4.2.

#### 13.1.3 AST Representation / Form

```text
ModalDecl = ⟨attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, implements, states, invariant_opt, span, doc⟩
ModalDecl.implements ∈ [ClassPath]
```

```text
StateBlock = ⟨name, members, span, doc⟩
```

```text
StateMember ∈ {
  StateFieldDecl = ⟨attrs_opt, vis, boundary, name, type, span, doc_opt⟩,
  StateMethodDecl = ⟨attrs_opt, vis, name, gen_params_opt, receiver, params, return_type_opt, contract_opt, body, span, doc_opt⟩,
  TransitionDecl = ⟨attrs_opt, vis, name, params, target_state, body, span, doc_opt⟩
```

}

ModalRef = {TypePath(path), TypeApply(path, args)}
TypeRef = {TypePath(path), TypeApply(path, args), ModalStateRef(modal_ref, state)}

StateBlocks(M) = M.states

```text
StateList(M) = [ b.name | b ∈ StateBlocks(M) ]
StateNames(M) = { S | S ∈ StateList(M) }
```

States(M) = StateNames(M)

```text
StateBlockOf(M, S) = b ⇔ b ∈ StateBlocks(M) ∧ b.name = S
StateMembers(M, S) = b.members ⇔ StateBlockOf(M, S) = b
```

```text
Payload(M, S) = [⟨f, T⟩ | StateFieldDecl(_, _, _, f, T, _, _) ∈ StateMembers(M, S)]
```

BuiltinModal = {`Region`, `File`, `DirIter`, `CancelToken`, `Spawned`, `Tracked`, `Async`, `Outcome`}

```text
ModalPath(M) = [M.name]    if M.name ∈ BuiltinModal
```

ModalPath(M) = FullPath(ModuleOf(M), M.name)    otherwise

ModalSelfRef(M) =
  { TypePath(ModalPath(M))    if params_gen = []

```text
    TypeApply(ModalPath(M), [TypePath([P_i.name]) | P_i ∈ params_gen])    otherwise
```

  }    where params_gen = TypeParamsOpt(M.gen_params_opt)

ModalSelfType(M, S) = TypeModalState(ModalSelfRef(M), S)
ModalSelfBase(M) = ModalRefType(ModalSelfRef(M))

ModalRefPath(TypePath(p)) = p
ModalRefPath(TypeApply(p, _)) = p
ModalRefArgs(TypePath(_)) = []
ModalRefArgs(TypeApply(_, args)) = args
ModalRefType(TypePath(p)) = TypePath(p)
ModalRefType(TypeApply(p, args)) = TypeApply(p, args)

```text
ModalDeclOf(modal_ref) = M ⇔ ModalRefPath(modal_ref) = p ∧ Σ.Types[p] = `modal` M
ModalRefSubst(modal_ref, M) = θ ⇔ params_gen = TypeParamsOpt(M.gen_params_opt) ∧ DefaultArgs(params_gen, ModalRefArgs(modal_ref)) = args' ∧ θ = [args'_i / params_gen[i].name]
```

```text
ModalPayload(modal_ref, S) = [⟨f, TypeSubst(θ, T)⟩ | ⟨f, T⟩ ∈ Payload(M, S)] where ModalDeclOf(modal_ref) = M and θ = ModalRefSubst(modal_ref, M)
```

PayloadMap(M, S) =

```text
 { f_i ↦ T_i | ⟨f_i, T_i⟩ ∈ Payload(M, S) }    if Distinct([f_i | ⟨f_i, T_i⟩ ∈ Payload(M, S)])
 ⊥    otherwise
```

ModalPayloadMap(modal_ref, S) =

```text
 { f_i ↦ T_i | ⟨f_i, T_i⟩ ∈ ModalPayload(modal_ref, S) }    if Distinct([f_i | ⟨f_i, T_i⟩ ∈ ModalPayload(modal_ref, S)])
 ⊥    otherwise
```

#### 13.1.4 Static Semantics

**(WF-Modal-Payload)**

```text
∀ i, Γ ⊢ T_i wf    ∀ i ≠ j, f_i ≠ f_j
```

────────────────────────────────────────

```text
Γ ⊢ Payload(M, S) wf
```

**(Modal-Payload-DupField)**

```text
∃ i ≠ j. f_i = f_j    c = Code(Modal-Payload-DupField)
```

────────────────────────────────────────────────────────

```text
Γ ⊢ Payload(M, S) wf ⇑ c
```

**(WF-ModalState)**

```text
T = TypeModalState(modal_ref, S)    ModalDeclOf(modal_ref) = M    S ∈ States(M)    params_gen = TypeParamsOpt(M.gen_params_opt)    DefaultArgs(params_gen, ModalRefArgs(modal_ref)) = args'    θ = [args'_i / params_gen[i].name]    ∀ i, Γ ⊢ args'_i wf    ∀ i, Γ ⊢ args'_i satisfies Bounds(params_gen[i])    Γ ⊢ M.predicate_clause_opt[θ] ok
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T wf
```

**(WF-ModalState-ArgCount-Err)**

```text
T = TypeModalState(modal_ref, S)    ModalDeclOf(modal_ref) = M    params_gen = TypeParamsOpt(M.gen_params_opt)    DefaultArgs(params_gen, ModalRefArgs(modal_ref)) = ⊥    c = Code(E-TYP-2303)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T wf ⇑ c
```

```text
StateMemberVisOk(M) ⇔ ∀ S ∈ States(M), ∀ m ∈ Payload(M, S) ∪ Methods(M, S) ∪ Transitions(M, S). VisRank(m.vis) ≤ VisRank(M.vis)
```

**(WF-ModalDecl)**

```text
M = ModalDecl(_, _, _, gen_params_opt, predicate_clause_opt, _, _, _, _, _)    params_gen = TypeParamsOpt(gen_params_opt)    params_gen = [P_1, …, P_n]    Γ ⊢ ⟨P_1; …; P_n⟩ wf    Γ_g = BindTypeParams(Γ, params_gen)    Γ_g; params_gen ⊢ predicate_clause_opt wf    p = ModalPath(M)    Γ_g ⊢ `modal` M wf    StateMemberVisOk(M)    Γ_g ⊢ TypePath(p) : ImplementsOk    ∀ S ∈ States(M), ∀ md ∈ Methods(M, S), Γ_g ⊢ md : StateMethodOK(M, S)    Γ_g ⊢ md : StateMethodBodyOK(p, S)    ∀ tr ∈ Transitions(M, S), Γ_g ⊢ tr : TransitionOK(M, S)    Γ_g ⊢ tr : TransitionBodyOK(p, S)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ M modal : ok
```

**(StateMemberVisOk-Err)**

```text
M = ModalDecl(_, _, _, _, _, _, _, _, _, _)    ¬ StateMemberVisOk(M)    c = Code(StateMemberVisOk-Err)
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ M ⇑ c
```

**(Modal-WF)**

```text
n ≥ 1    ∀ i ∈ 1..n, S_i unique    ∀ i, Γ ⊢ Payload(M, S_i) wf    ∀ i, S_i ≠ M
```

────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ `modal` M { @S_1 ... @S_n } wf
```

**(Modal-NoStates-Err)**
n = 0    c = Code(Modal-NoStates-Err)
────────────────────────────────────────────

```text
Γ ⊢ `modal` M { @S_1 ... @S_n } wf ⇑ c
```

**(Modal-DupState-Err)**

```text
¬ Distinct([S_1, …, S_n])    c = Code(Modal-DupState-Err)
```

────────────────────────────────────────────────────────────────────

```text
Γ ⊢ `modal` M { @S_1 ... @S_n } wf ⇑ c
```

**(Modal-StateName-Err)**

```text
∃ i. S_i = M    c = Code(Modal-StateName-Err)
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ `modal` M { @S_1 ... @S_n } wf ⇑ c
```

**(State-Specific-WF)**

```text
S ∈ States(M)
```

──────────────────────

```text
Γ ⊢ M@S wf
```

```text
ModalPayloadNames(modal_ref, S) = [ f | ⟨f, _⟩ ∈ ModalPayload(modal_ref, S) ]
```

ModalPayloadNameSet(modal_ref, S) = Set(ModalPayloadNames(modal_ref, S))

**(T-Modal-State-Intro)**

```text
ModalDeclOf(modal_ref) = M    S ∈ States(M)    ModalRefPath(modal_ref) ∉ {["File"], ["DirIter"], ["CancelToken"], ["Spawned"], ["Tracked"], ["Async"]}    ModalPayloadNameSet(modal_ref, S) = FieldInitSet(fields)    Distinct(FieldInitNames(fields))    ∀ ⟨f, e⟩ ∈ fields, ModalPayloadMap(modal_ref, S)(f) = T_f ∧ Γ; R; L ⊢ e ⇐ T_f ⊣ ∅
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ RecordExpr(ModalStateRef(modal_ref, S), fields) : TypeModalState(modal_ref, S)
```

**(Record-FileDir-Err)**

```text
ModalRefPath(modal_ref) ∈ {["File"], ["DirIter"], ["CancelToken"], ["Spawned"], ["Tracked"], ["Async"]}    c = Code(Record-FileDir-Err)
```

────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ RecordExpr(ModalStateRef(modal_ref, S), fields) ⇑ c
```

**Built-in Modal Declarations.**

```text
RegionPayloadFields = [⟨`handle`, TypePrim("usize")⟩]
```

Payload(`Region`, `@Active`) = RegionPayloadFields
Payload(`Region`, `@Frozen`) = RegionPayloadFields
Payload(`Region`, `@Freed`) = RegionPayloadFields

RegionProcs = {`Region::new_scoped`, `Region::alloc`, `Region::reset_unchecked`, `Region::freeze`, `Region::thaw`, `Region::free_unchecked`}

```text
RegionProcSig(`Region::new_scoped`) = ⟨[⟨⊥, `options`, TypePath(["RegionOptions"])⟩], TypePerm(`unique`, TypeModalState(["Region"], `@Active`))⟩
RegionProcSig(`Region::alloc`) = ⟨[⟨⊥, `self`, TypePerm(`unique`, TypeModalState(["Region"], `@Active`))⟩, ⟨⊥, `value`, T⟩], T_{π_Region(`self`)}⟩    (T ∈ Type)
RegionProcSig(`Region::reset_unchecked`) = ⟨[⟨⊥, `self`, TypePerm(`unique`, TypeModalState(["Region"], `@Active`))⟩], TypeModalState(["Region"], `@Active`)⟩
RegionProcSig(`Region::freeze`) = ⟨[⟨⊥, `self`, TypePerm(`unique`, TypeModalState(["Region"], `@Active`))⟩], TypeModalState(["Region"], `@Frozen`)⟩
RegionProcSig(`Region::thaw`) = ⟨[⟨⊥, `self`, TypePerm(`unique`, TypeModalState(["Region"], `@Frozen`))⟩], TypeModalState(["Region"], `@Active`)⟩
RegionProcSig(`Region::free_unchecked`) = ⟨[⟨⊥, `self`, TypePerm(`unique`, TypeUnion([TypeModalState(["Region"], `@Active`), TypeModalState(["Region"], `@Frozen`)]))⟩], TypeModalState(["Region"], `@Freed`)⟩
```

```text
ProvType(T, π) = T_π
BaseType(T_π) = T
ProvOf(T_π) = π
```

```text
¬ BitcopyType(TypePath(["Region"]))
```

**Region Arena Requirements.**
1. `Region::alloc` MUST yield a value with provenance `π_Region(tag)`, where `tag` is the region-provenance tag carried by the receiver handle in the current provenance environment. Fresh region tags are introduced by fresh region-creating constructs, including `region` statements and bindings of freshly created `Region@Active` values such as `Region::new_scoped(...)`. Rebinding a `Region@Active` handle MUST preserve the existing region tag and MUST introduce the new binding name as a target alias in the region-target relation.
2. After `Region::reset_unchecked` or `Region::free_unchecked`, any dereference through a `Ptr<T>@Valid` whose address has an inactive `RegionTag` MUST behave as `Expired` per `PtrState` and `ReadPtrSigma`. Uses of non-pointer values with provenance `π_Region(r)` after reset/free are `OutsideConformance`.
3. `Region::free_unchecked` MUST be invoked exactly once on any `Region` that remains in `@Active` or `@Frozen` at scope exit. Implementations MAY invoke `Region::free_unchecked` implicitly during `RegionStmt` cleanup.

**(Region-Unchecked-Unsafe-Err)**

```text
Γ; R; L ⊢ base : T    StripPerm(T) = TypeModalState(["Region"], S)    S ∈ {`Active`, `Frozen`}    name ∈ {"reset_unchecked", "free_unchecked"}    ¬ UnsafeSpan(span(MethodCall(base, name, args)))    c = Code(Region-Unchecked-Unsafe-Err)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ MethodCall(base, name, args) ⇑ c
```

```text
["CancelToken"] ∈ dom(Σ.Types)
```

States(`CancelToken`) = { `@Active` }

```text
CancelTokenFields = [⟨`id`, TypePrim("usize")⟩]
```

Payload(`CancelToken`, `@Active`) = CancelTokenFields

CancelTokenActiveMembers = [

```text
  StateFieldDecl(⊥, `private`, false, `id`, TypePrim("usize"), ⊥, ⊥),
  StateMethodDecl(⊥, `public`, "cancel", ⊥, ReceiverShorthand(`shared`), [], TypePrim("()"), ⊥, ⊥, ⊥, ⊥),
  StateMethodDecl(⊥, `public`, "is_cancelled", ⊥, ReceiverShorthand(`const`), [], TypePrim("bool"), ⊥, ⊥, ⊥, ⊥),
  StateMethodDecl(⊥, `public`, "wait_cancelled", ⊥, ReceiverShorthand(`const`), [], TypeApply(["Async"], [TypePrim("()")]), ⊥, ⊥, ⊥, ⊥),
  StateMethodDecl(⊥, `public`, "child", ⊥, ReceiverShorthand(`const`), [], TypeModalState(["CancelToken"], `@Active`), ⊥, ⊥, ⊥, ⊥)
```

]
CancelTokenStates = [

```text
  StateBlock(`@Active`, CancelTokenActiveMembers, ⊥, ⊥)
```

]

```text
CancelTokenDecl = ModalDecl(⊥, `public`, `CancelToken`, ⊥, ⊥, [], CancelTokenStates, ⊥, ⊥, ⊥)
```

```text
Σ.Types["CancelToken"] = `modal` CancelTokenDecl
```

CancelTokenProcs = {`CancelToken::new`}

```text
CancelTokenProcSig(`CancelToken::new`) = ⟨[], TypeModalState(["CancelToken"], `@Active`)⟩
```

```text
["Spawned"] ∈ dom(Σ.Types)
```

States(`Spawned`) = { `@Pending`, `@Ready` }

```text
SpawnedParams = [⟨`T`, [], ⊥, ⊥⟩]
SpawnedReadyFields = [⟨`value`, TypePath(["T"])⟩]
```

Payload(`Spawned`, `@Pending`) = []
Payload(`Spawned`, `@Ready`) = SpawnedReadyFields

SpawnedPendingMembers = []
SpawnedReadyMembers = [

```text
  StateFieldDecl(⊥, `public`, false, `value`, TypePath(["T"]), ⊥, ⊥)
```

]
SpawnedStates = [

```text
  StateBlock(`@Pending`, SpawnedPendingMembers, ⊥, ⊥),
  StateBlock(`@Ready`, SpawnedReadyMembers, ⊥, ⊥)
```

]

```text
SpawnedDecl = ModalDecl(⊥, `public`, `Spawned`, SpawnedParams, ⊥, [], SpawnedStates, ⊥, ⊥, ⊥)
```

```text
Σ.Types["Spawned"] = `modal` SpawnedDecl
```

```text
["Tracked"] ∈ dom(Σ.Types)
```

States(`Tracked`) = { `@Pending`, `@Ready` }

```text
TrackedParams = [⟨`T`, [], ⊥, ⊥⟩, ⟨`E`, [], ⊥, ⊥⟩]
TrackedReadyFields = [⟨`value`, TypeUnion([TypePath(["T"]), TypePath(["E"])])⟩]
```

Payload(`Tracked`, `@Pending`) = []
Payload(`Tracked`, `@Ready`) = TrackedReadyFields

TrackedPendingMembers = []
TrackedReadyMembers = [

```text
  StateFieldDecl(⊥, `public`, false, `value`, TypeUnion([TypePath(["T"]), TypePath(["E"])]), ⊥, ⊥)
```

]
TrackedStates = [

```text
  StateBlock(`@Pending`, TrackedPendingMembers, ⊥, ⊥),
  StateBlock(`@Ready`, TrackedReadyMembers, ⊥, ⊥)
```

]

```text
TrackedDecl = ModalDecl(⊥, `public`, `Tracked`, TrackedParams, ⊥, [], TrackedStates, ⊥, ⊥, ⊥)
```

```text
Σ.Types["Tracked"] = `modal` TrackedDecl
```

```text
["Outcome"] ∈ dom(Σ.Types)
```

States(`Outcome`) = { `@Value`, `@Error` }

```text
OutcomeParams = [⟨`TValue`, [], ⊥, ⊥⟩, ⟨`TError`, [], ⊥, ⊥⟩]
OutcomeValueFields = [⟨`value`, TypePath(["TValue"])⟩]
OutcomeErrorFields = [⟨`error`, TypePath(["TError"])⟩]
```

Payload(`Outcome`, `@Value`) = OutcomeValueFields
Payload(`Outcome`, `@Error`) = OutcomeErrorFields

OutcomeValueMembers = [

```text
  StateFieldDecl(⊥, `public`, false, `value`, TypePath(["TValue"]), ⊥, ⊥)
```

]
OutcomeErrorMembers = [

```text
  StateFieldDecl(⊥, `public`, false, `error`, TypePath(["TError"]), ⊥, ⊥)
```

]
OutcomeStates = [

```text
  StateBlock(`@Value`, OutcomeValueMembers, ⊥, ⊥),
  StateBlock(`@Error`, OutcomeErrorMembers, ⊥, ⊥)
```

]

```text
OutcomeDecl = ModalDecl(⊥, `public`, `Outcome`, OutcomeParams, ⊥, [], OutcomeStates, ⊥, ⊥, ⊥)
```

```text
Σ.Types["Outcome"] = `modal` OutcomeDecl
```

```text
OutcomeSig(T) = ⟨TValue, TError⟩ ⇔ AliasNorm(T) = TypeApply(["Outcome"], [TValue, TError])
OutcomeSig(T) = ⊥ otherwise
```

DirIterOpenMembers = [

```text
  StateFieldDecl(⊥, `public`, false, `handle`, TypePrim("usize"), ⊥, ⊥),
  StateMethodDecl(⊥, `public`, "next", ⊥, ReceiverShorthand(`const`), [], TypeApply(["Outcome"], [TypeUnion([TypePath(["DirEntry"]), TypePrim("()")]), TypePath(["IoError"])]), ⊥, ⊥, ⊥, ⊥),
  TransitionDecl(⊥, `public`, "close", [], `@Closed`, ⊥, ⊥, ⊥)
```

]
DirIterClosedMembers = []
DirIterStates = [

```text
  StateBlock(`@Open`, DirIterOpenMembers, ⊥, ⊥),
  StateBlock(`@Closed`, DirIterClosedMembers, ⊥, ⊥)
```

]

```text
DirIterDecl = ModalDecl(⊥, `public`, `DirIter`, ⊥, ⊥, [], DirIterStates, ⊥, ⊥, ⊥)
```

FileReadMembers = [

```text
  StateFieldDecl(⊥, `public`, false, `handle`, TypePrim("usize"), ⊥, ⊥),
  StateMethodDecl(⊥, `public`, "read_all", ⊥, ReceiverShorthand(`const`), [], TypeApply(["Outcome"], [TypePerm(`unique`, TypeString(`@Managed`)), TypePath(["IoError"])]), ⊥, ⊥, ⊥, ⊥),
  StateMethodDecl(⊥, `public`, "read_all_bytes", ⊥, ReceiverShorthand(`const`), [], TypeApply(["Outcome"], [TypePerm(`unique`, TypeBytes(`@Managed`)), TypePath(["IoError"])]), ⊥, ⊥, ⊥, ⊥),
  TransitionDecl(⊥, `public`, "close", [], `@Closed`, ⊥, ⊥, ⊥)
```

]
FileWriteMembers = [

```text
  StateFieldDecl(⊥, `public`, false, `handle`, TypePrim("usize"), ⊥, ⊥),
  StateMethodDecl(⊥, `public`, "write", ⊥, ReceiverShorthand(`const`), [⟨⊥, `data`, TypeBytes(`@View`)⟩], TypeApply(["Outcome"], [TypePrim("()"), TypePath(["IoError"])]), ⊥, ⊥, ⊥, ⊥),
  StateMethodDecl(⊥, `public`, "flush", ⊥, ReceiverShorthand(`const`), [], TypeApply(["Outcome"], [TypePrim("()"), TypePath(["IoError"])]), ⊥, ⊥, ⊥, ⊥),
  TransitionDecl(⊥, `public`, "close", [], `@Closed`, ⊥, ⊥, ⊥)
```

]
FileAppendMembers = [

```text
  StateFieldDecl(⊥, `public`, false, `handle`, TypePrim("usize"), ⊥, ⊥),
  StateMethodDecl(⊥, `public`, "write", ⊥, ReceiverShorthand(`const`), [⟨⊥, `data`, TypeBytes(`@View`)⟩], TypeApply(["Outcome"], [TypePrim("()"), TypePath(["IoError"])]), ⊥, ⊥, ⊥, ⊥),
  StateMethodDecl(⊥, `public`, "flush", ⊥, ReceiverShorthand(`const`), [], TypeApply(["Outcome"], [TypePrim("()"), TypePath(["IoError"])]), ⊥, ⊥, ⊥, ⊥),
  TransitionDecl(⊥, `public`, "close", [], `@Closed`, ⊥, ⊥, ⊥)
```

]
FileClosedMembers = []
FileStates = [

```text
  StateBlock(`@Read`, FileReadMembers, ⊥, ⊥),
  StateBlock(`@Write`, FileWriteMembers, ⊥, ⊥),
  StateBlock(`@Append`, FileAppendMembers, ⊥, ⊥),
  StateBlock(`@Closed`, FileClosedMembers, ⊥, ⊥)
```

]

```text
FileDecl = ModalDecl(⊥, `public`, `File`, ⊥, ⊥, [], FileStates, ⊥, ⊥, ⊥)
```

```text
Σ.Types["DirIter"] = `modal` DirIterDecl
Σ.Types["File"] = `modal` FileDecl
```

The built-in modal `Async` is defined in Chapter 21. Its declaration, state set, and combinator surface are not duplicated here.

#### 13.1.5 Dynamic Semantics

```text
ModalVal(S, v) = ⟨S, v⟩
```

ValueType(RecordValue(ModalStateRef(modal_ref, S), fs)) = TypeModalState(modal_ref, S)

```text
ValueType(ModalVal(S, v_s)) = ModalRefType(modal_ref) ⇔ ValueType(v_s) = TypeModalState(modal_ref, S)
```

At runtime, an unreified state value is represented as `RecordValue(ModalStateRef(modal_ref, S), fs)`. A widened general modal value is represented as `ModalVal(S, v_s)`. Pattern matching over general modal values is defined in Chapter 17.

#### 13.1.6 Lowering

ModalDiscType(modal_ref) = DiscType(|States(M)| - 1) where ModalDeclOf(modal_ref) = M

```text
StateSize(modal_ref, S) = s ⇔ RecordLayout(ModalPayload(modal_ref, S)) ⇓ ⟨s, a, _⟩
StateAlign(modal_ref, S) = a ⇔ RecordLayout(ModalPayload(modal_ref, S)) ⇓ ⟨s, a, _⟩
SingleFieldPayload(M, S) = T ⇔ Payload(M, S) = [⟨f, T⟩]
ModalSingleFieldPayload(modal_ref, S) = T' ⇔ ModalDeclOf(modal_ref) = M ∧ SingleFieldPayload(M, S) = T ∧ θ = ModalRefSubst(modal_ref, M) ∧ T' = TypeSubst(θ, T)
EmptyState(M, S) ⇔ Payload(M, S) = []
PayloadState(modal_ref) = S_p ⇔ ModalDeclOf(modal_ref) = M ∧ S_p ∈ States(M) ∧ ModalSingleFieldPayload(modal_ref, S_p) = T_p ∧ NicheCount(T_p) > 0 ∧ (∀ S ∈ States(M). S ≠ S_p ⇒ EmptyState(M, S)) ∧ NicheCount(T_p) ≥ |States(M)| - 1
NicheApplies(modal_ref) ⇔ ∃ S_p. PayloadState(modal_ref) = S_p
```

```text
ValueBits(TypeModalState(modal_ref, S), v) = bits ⇔ ModalDeclOf(modal_ref) = M ∧ S ∈ States(M) ∧ v = RecordValue(ModalStateRef(modal_ref, S), fs) ∧ ModalPayload(modal_ref, S) = fields ∧ RecordLayout(fields) ⇓ ⟨size, _, offsets⟩ ∧ fields = [⟨f_1, T_1⟩, …, ⟨f_n, T_n⟩] ∧ (∀ i. FieldValue(RecordValue(ModalStateRef(modal_ref, S), fs), f_i) = v_i) ∧ StructBits([T_1, …, T_n], [v_1, …, v_n], offsets, size) = bits
EmptyStates(M) = [ S ∈ States(M) | EmptyState(M, S) ]
EmptyRecordVal(v) ⇔ ∃ tr. v = RecordValue(tr, [])
ModalNicheBits(modal_ref, S, v) = bits ⇔ ModalDeclOf(modal_ref) = M ∧ NicheApplies(modal_ref) ∧ PayloadState(modal_ref) = S_p ∧ ModalSingleFieldPayload(modal_ref, S_p) = T_p ∧ ((S = S_p ∧ ValueBits(T_p, v) = bits ∧ bits ∉ NicheSet(T_p)) ∨ (∃ i. EmptyStates(M)[i] = S ∧ (v = () ∨ EmptyRecordVal(v)) ∧ NicheOrder(T_p)[i] = bits))
ModalBits(modal_ref, S, v) = bits ⇔ ModalNicheBits(modal_ref, S, v) = bits ∨ ModalTaggedBits(modal_ref, S, v) = bits
ModalAlign(modal_ref) = max(alignof(ModalDiscType(modal_ref)), max_{S ∈ States(M)}(StateAlign(modal_ref, S))) where ModalDeclOf(modal_ref) = M
ModalSize(modal_ref) = AlignUp(sizeof(ModalDiscType(modal_ref)) + max_{S ∈ States(M)}(StateSize(modal_ref, S)), ModalAlign(modal_ref)) where ModalDeclOf(modal_ref) = M
ModalPayloadSize(modal_ref) = s ⇔ ModalDeclOf(modal_ref) = M ∧ s = max_{S ∈ States(M)}(StateSize(modal_ref, S))
ModalPayloadAlign(modal_ref) = a ⇔ ModalDeclOf(modal_ref) = M ∧ a = max_{S ∈ States(M)}(StateAlign(modal_ref, S))
StateRecordBits(modal_ref, S, v) = b ⇔ ModalPayload(modal_ref, S) = fields ∧ RecordLayout(fields) ⇓ ⟨size, _, offsets⟩ ∧ fields = [⟨f_1, T_1⟩, …, ⟨f_n, T_n⟩] ∧ ((n = 0 ∧ (v = () ∨ EmptyRecordVal(v)) ∧ b = []) ∨ (n > 0 ∧ v = RecordValue(tr, fs) ∧ (∀ i. FieldValue(RecordValue(tr, fs), f_i) = v_i) ∧ StructBits([T_1, …, T_n], [v_1, …, v_n], offsets, size) = b))
ModalPayloadBits(modal_ref, S, v) = bits ⇔ StateRecordBits(modal_ref, S, v) = b ∧ ModalPayloadSize(modal_ref) = s ∧ PadBytes(b, s) = bits
```

ModalLayoutJudg = {ModalLayout}

**(Layout-Modal-Niche)**

```text
ModalDeclOf(modal_ref) = M    NicheApplies(modal_ref)    PayloadState(modal_ref) = S_p    ModalSingleFieldPayload(modal_ref, S_p) = T_p    Γ ⊢ layout(T_p) ⇓ ⟨size, align⟩
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ModalLayout(modal_ref) ⇓ ⟨size, align, ⊥, layout(T_p)⟩
```

**(Layout-Modal-Tagged)**

```text
ModalDeclOf(modal_ref) = M    ¬ NicheApplies(modal_ref)    size = ModalSize(modal_ref)    align = ModalAlign(modal_ref)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ModalLayout(modal_ref) ⇓ ⟨size, align, ModalDiscType(modal_ref), max_{S ∈ States(M)}(StateSize(modal_ref, S))⟩
```

**(Size-Modal)**

```text
T = ModalRefType(modal_ref)    ModalLayout(modal_ref) ⇓ ⟨size, _, _, _⟩
```

──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ sizeof(T) = size
```

**(Align-Modal)**

```text
T = ModalRefType(modal_ref)    ModalLayout(modal_ref) ⇓ ⟨_, align, _, _⟩
```

───────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ alignof(T) = align
```

**(Layout-Modal)**

```text
T = ModalRefType(modal_ref)    ModalLayout(modal_ref) ⇓ ⟨size, align, _, _⟩
```

──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ layout(T) ⇓ ⟨size, align⟩
```

**(Size-ModalState)**

```text
T = TypeModalState(modal_ref, S)    ModalDeclOf(modal_ref) = M    S ∈ States(M)    StateSize(modal_ref, S) = size
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ sizeof(T) = size
```

**(Align-ModalState)**

```text
T = TypeModalState(modal_ref, S)    ModalDeclOf(modal_ref) = M    S ∈ States(M)    StateAlign(modal_ref, S) = align
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ alignof(T) = align
```

**(Layout-ModalState)**

```text
T = TypeModalState(modal_ref, S)    ModalDeclOf(modal_ref) = M    S ∈ States(M)    StateSize(modal_ref, S) = size    StateAlign(modal_ref, S) = align
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ layout(T) ⇓ ⟨size, align⟩
```

layout(TypeModalState(modal_ref, S)) = layout(`record` {ModalPayload(modal_ref, S)})

```text
ModalPayload(modal_ref, S) = ∅ ⇒ sizeof(TypeModalState(modal_ref, S)) = 0
```

layout(ModalRefType(modal_ref)) =

```text
 layout(T_p)    if NicheApplies(modal_ref) ∧ PayloadState(modal_ref) = S_p ∧ ModalSingleFieldPayload(modal_ref, S_p) = T_p
```

 layout(`enum` {S_1(ModalPayload(modal_ref, S_1)), …, S_n(ModalPayload(modal_ref, S_n))})    otherwise

Modal tagged layout is fully defined; all bytes outside the discriminant and payload ranges MUST be zero.

```text
ModalTaggedBits(modal_ref, S, v) = bits ⇔ ModalDeclOf(modal_ref) = M ∧ ¬ NicheApplies(modal_ref) ∧ ModalDiscType(modal_ref) = D ∧ StateIndex(M, S) = i ∧ ValueBits(D, i) = disc_bits ∧ ModalPayloadBits(modal_ref, S, v) = payload_bits ∧ ModalPayloadSize(modal_ref) = psize ∧ ModalPayloadAlign(modal_ref) = palign ∧ TaggedBits(disc_bits, payload_bits, sizeof(D), psize, palign, ModalSize(modal_ref)) = bits ∧ payload_off = AlignUp(sizeof(D), palign) ∧ ∀ j. 0 ≤ j < |bits| ∧ j ∉ [0, sizeof(D)) ∧ j ∉ [payload_off, payload_off + psize) ⇒ bits[j] = 0x00
ValueBits(ModalRefType(modal_ref), v) = bits ⇔ ModalDeclOf(modal_ref) = M ∧ v = ⟨S, v_s⟩ ∧ ModalBits(modal_ref, S, v_s) = bits
```

#### 13.1.7 Diagnostics

Diagnostics are defined for modal declarations with zero states, duplicate state names, state names equal to the modal name, duplicate payload field names, state-member visibility that exceeds modal visibility, bad generic-argument count on modal-state references, and direct record construction of runtime-backed built-in modal states. Match exhaustiveness for general modal values is defined in Chapter 17.

### 13.2 State Fields

#### 13.2.1 Syntax

```text
state_field_decl ::= attribute_list? visibility? key_boundary? identifier ":" type
```

#### 13.2.2 Parsing

**(Parse-StateMember-Field)**

```text
Γ ⊢ ParseAttrListOpt(P) ⇓ (P_0, attrs_opt)    Γ ⊢ ParseVis(P_0) ⇓ (P_1, vis)    Γ ⊢ ParseKeyBoundaryOpt(P_1) ⇓ (P_2, boundary)    Γ ⊢ ParseIdent(P_2) ⇓ (P_3, name)    IsPunc(Tok(P_3), ":")    Γ ⊢ ParseType(Advance(P_3)) ⇓ (P_4, ty)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseStateMember(P) ⇓ (P_4, ⟨StateFieldDecl, attrs_opt, vis, boundary, name, ty, SpanBetween(P, P_4), []⟩)
```

#### 13.2.3 AST Representation / Form

```text
StateFieldDecl = ⟨attrs_opt, vis, boundary, name, type, span, doc_opt⟩
```

```text
PayloadNames(M, S) = [ f | ⟨f, _⟩ ∈ Payload(M, S) ]
```

PayloadNameSet(M, S) = Set(PayloadNames(M, S))

#### 13.2.4 Static Semantics

```text
ModalFieldVisible(m, modal_ref) ⇔ ModalDeclOf(modal_ref) = M ∧ ModuleOfPath(ModalPath(M)) = m
```

**(T-Modal-Field)**

```text
Γ; R; L ⊢ e : TypeModalState(modal_ref, S)    ModalDeclOf(modal_ref) = M    ModalPayloadMap(modal_ref, S)(f) = T    ModalFieldVisible(m, modal_ref)
```

────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ e.f : T
```

**(T-Modal-Field-Perm)**

```text
Γ; R; L ⊢ e : TypePerm(p', TypeModalState(modal_ref, S))    ModalDeclOf(modal_ref) = M    ModalPayloadMap(modal_ref, S)(f) = T    ModalFieldVisible(m, modal_ref)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ e.f : TypePerm(p', T)
```

**(Modal-Field-Missing)**

```text
Γ; R; L ⊢ e : TypeModalState(modal_ref, S)    ModalDeclOf(modal_ref) = M    ModalPayloadMap(modal_ref, S)(f) undefined    c = Code(Modal-Field-Missing)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ e.f ⇑ c
```

**(Modal-Field-General-Err)**

```text
Γ; R; L ⊢ e : T    StripPerm(T) = ModalRefType(modal_ref)    ModalDeclOf(modal_ref) = M    c = Code(Modal-Field-General-Err)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ e.f ⇑ c
```

**(Modal-Field-NotVisible)**

```text
Γ; R; L ⊢ e : TypeModalState(modal_ref, S)    ModalDeclOf(modal_ref) = M    ModalPayloadMap(modal_ref, S)(f) = T    ¬ ModalFieldVisible(m, modal_ref)    c = Code(Modal-Field-NotVisible)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ e.f ⇑ c
```

#### 13.2.5 Dynamic Semantics

State-field access on `TypeModalState(modal_ref, S)` reuses ordinary record-field evaluation over the concrete runtime value `RecordValue(ModalStateRef(modal_ref, S), fs)`. No additional abstract-machine rule is introduced for successful access beyond the shared `FieldAccess` rules.

#### 13.2.6 Lowering

State-field reads and writes lower exactly as record-payload field accesses over the current state's payload layout. No modal-specific field-access lowering is introduced beyond the general place and field lowering rules.

#### 13.2.7 Diagnostics

Diagnostics are defined for missing state fields, field access on a general modal value without first refining to a state, and access to a state field outside the declaring modal's module. Duplicate field names within a single state payload are defined by §13.1.4.

### 13.3 State-Specific Methods

#### 13.3.1 Syntax

```text
state_method_def       ::= attribute_list? visibility? "procedure" identifier generic_params? state_method_signature contract_clause? block_expr
state_method_signature ::= "(" receiver method_param_list? ")" return_opt
```

#### 13.3.2 Parsing

**(Parse-StateMember-Method)**

```text
Γ ⊢ ParseAttrListOpt(P) ⇓ (P_0, attrs_opt)    Γ ⊢ ParseVis(P_0) ⇓ (P_1, vis)    IsKw(Tok(P_1), `procedure`)    Γ ⊢ ParseIdent(Advance(P_1)) ⇓ (P_2, name)    Γ ⊢ ParseGenericParamsOpt(P_2) ⇓ (P_3, gen_params_opt)    Γ ⊢ ParseStateMethodSignature(P_3) ⇓ (P_4, recv, params, ret_opt)    Γ ⊢ ParseContractClauseOpt(P_4) ⇓ (P_5, contract_opt)    Γ ⊢ ParseBlock(P_5) ⇓ (P_6, body)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseStateMember(P) ⇓ (P_6, ⟨StateMethodDecl, attrs_opt, vis, name, gen_params_opt, recv, params, ret_opt, contract_opt, body, SpanBetween(P, P_6), []⟩)
```

`ParseStateMethodSignature` is defined canonically by the shared method parser in §15.2.2. This section consumes that parser but does not redefine it.

#### 13.3.3 AST Representation / Form

```text
StateMethodDecl = ⟨attrs_opt, vis, name, gen_params_opt, receiver, params, return_type_opt, contract_opt, body, span, doc_opt⟩
```

```text
Methods(M, S) = [ m | m ∈ StateMembers(M, S) ∧ ∃ attrs, vis, name, gen_params, recv, params, ret, contract, body, span, doc. m = StateMethodDecl(attrs, vis, name, gen_params, recv, params, ret, contract, body, span, doc) ]
StateMethodNames(M, S) = [ m.name | m ∈ Methods(M, S) ]
```

MethodSig(M, S, m).recv = RecvType(ModalSelfType(M, S), m.receiver)
MethodSig(M, S, m).params = m.params
MethodSig(M, S, m).ret = ReturnType(m)

```text
LookupStateMethod(M, S, name) = m ⇔ m ∈ Methods(M, S) ∧ m.name = name
LookupStateMethod(M, S, name) = ⊥ ⇔ ¬ ∃ m ∈ Methods(M, S). m.name = name
```

#### 13.3.4 Static Semantics

```text
StateMemberVisible(mod, M, vis) ⇔ vis ∈ {`public`, `internal`} ∨ (vis = `private` ∧ ModuleOfPath(ModalPath(M)) = mod)
```

**(StateMethod-Dup)**

```text
¬ Distinct(StateMethodNames(M, S))    c = Code(StateMethod-Dup)
```

────────────────────────────────────────────────────────────

```text
Γ ⊢ S ⇑ c
```

**(WF-State-Method)**

```text
params_gen = TypeParamsOpt(md.gen_params_opt)    params_gen = [P_1, …, P_n]    Γ ⊢ ⟨P_1; …; P_n⟩ wf    Γ_m = BindTypeParams(Γ, params_gen)    Γ_m ⊢ md.receiver : Recv(ModalSelfType(M, S), P, mode)    self ∉ ParamNames(md.params)    Distinct(ParamNames(md.params))    ∀ ⟨_, _, T_i⟩ ∈ md.params, Γ_m ⊢ T_i wf    (md.return_type_opt = ⊥ ∨ Γ_m ⊢ md.return_type_opt wf)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ md : StateMethodOK(M, S)
```

**(T-Modal-Method)**

```text
Γ; R; L ⊢ e : P_caller TypeModalState(modal_ref, S)    ModalDeclOf(modal_ref) = M    LookupStateMethod(M, S, m) = md    P_method = RecvPerm(ModalSelfType(M, S), md.receiver)    PermAdmits(P_caller, P_method)    StateMemberVisible(mod, M, md.vis)    MethodSig(M, S, md).params = ps    Γ; R; L ⊢ ArgsOk(ps, args)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ e ~> m(args) : ReturnType(md)
```

**(Modal-Method-RecvPerm-Err)**

```text
Γ; R; L ⊢ e : P_caller TypeModalState(modal_ref, S)    ModalDeclOf(modal_ref) = M    LookupStateMethod(M, S, m) = md    P_method = RecvPerm(ModalSelfType(M, S), md.receiver)    ¬ PermAdmits(P_caller, P_method)    c = Code(MethodCall-RecvPerm-Err)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ e ~> m(args) ⇑ c
```

**(Modal-Method-NotFound)**

```text
Γ; R; L ⊢ e : P_caller TypeModalState(modal_ref, S)    ModalDeclOf(modal_ref) = M    LookupStateMethod(M, S, m) undefined    c = Code(Modal-Method-NotFound)
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ e ~> m(args) ⇑ c
```

**(Modal-Method-NotVisible)**

```text
Γ; R; L ⊢ e : P_caller TypeModalState(modal_ref, S)    ModalDeclOf(modal_ref) = M    LookupStateMethod(M, S, m) = md    ¬ StateMemberVisible(mod, M, md.vis)    c = Code(Modal-Method-NotVisible)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ e ~> m(args) ⇑ c
```

**(T-Modal-Method-Body)**

```text
Σ.Types[p] = `modal` M    S ∈ States(M)    md ∈ Methods(M, S)    md.body = body    T_self = RecvType(ModalSelfType(M, S), md.receiver)    Γ_0 = PushScope(Γ)    IntroAll(Γ_0, [⟨`self`, T_self⟩] ++ ParamBinds(md.params)) ⇓ Γ_1    R_m = ReturnType(md)    R_b = BodyReturnType(R_m)    Γ_1; R_m; ⊥ ⊢ body : T_b    Γ ⊢ T_b <: R_b    (R_b ≠ TypePrim("()") ⇒ ExplicitReturn(body))
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ md : StateMethodBodyOK(p, S)
```

#### 13.3.5 Dynamic Semantics

```text
MethodTarget(RecordValue(ModalStateRef(modal_ref, S), fs), name) = md ⇔ ModalDeclOf(modal_ref) = M ∧ LookupStateMethod(M, S, name) = md
```

**(ApplyMethodSigma)**

```text
m = MethodTarget(v_self, name)    ¬ IsTransition(m)    BindParams(RecvParams(base, name), [v_arg] ++ vec_v) = binds    BlockEnter(σ, binds) ⇓ (σ_1, scope)    Γ ⊢ EvalBlockBodySigma(m.body, σ_1) ⇓ (out, σ_2)    BlockExit(σ_2, scope, out) ⇓ (out', σ_3)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ApplyMethodSigma(base, name, v_self, v_arg, vec_v, σ) ⇓ (ReturnOut(out'), σ_3)
```

Built-in state methods on `CancelToken`, `File`, `DirIter`, `string`, and `bytes` are defined by their respective primitive relations in this chapter and later capability chapters; they do not introduce a distinct calling convention.

#### 13.3.6 Lowering

State-specific method calls lower as ordinary direct method calls specialized to the receiver type `ModalSelfType(M, S)`. No modal tag dispatch is inserted when the receiver type is already a concrete state type.

#### 13.3.7 Diagnostics

Diagnostics are defined for duplicate state-method names within a state block, receiver-permission mismatch at method call sites, missing state methods, and state-method visibility failures. Name conflicts with transitions are defined in §13.4.4.

### 13.4 Transitions

#### 13.4.1 Syntax

```text
transition_def ::= attribute_list? visibility? "transition" identifier "(" param_list ")" "->" "@" identifier block_expr
```

#### 13.4.2 Parsing

**(Parse-StateMember-Transition)**

```text
Γ ⊢ ParseAttrListOpt(P) ⇓ (P_0, attrs_opt)    Γ ⊢ ParseVis(P_0) ⇓ (P_1, vis)    IsKw(Tok(P_1), `transition`)    Γ ⊢ ParseIdent(Advance(P_1)) ⇓ (P_2, name)    IsPunc(Tok(P_2), "(")    Γ ⊢ ParseParamList(Advance(P_2)) ⇓ (P_3, params)    IsPunc(Tok(P_3), ")")    P_3' = Advance(P_3)    IsOp(Tok(P_3'), "->")    IsOp(Tok(Advance(P_3')), "@")    Γ ⊢ ParseIdent(Advance(Advance(P_3'))) ⇓ (P_4, target)    Γ ⊢ ParseBlock(P_4) ⇓ (P_5, body)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseStateMember(P) ⇓ (P_5, ⟨TransitionDecl, attrs_opt, vis, name, params, target, body, SpanBetween(P, P_5), []⟩)
```

#### 13.4.3 AST Representation / Form

```text
TransitionDecl = ⟨attrs_opt, vis, name, params, target_state, body, span, doc_opt⟩
```

```text
Transitions(M, S) = [ t | t ∈ StateMembers(M, S) ∧ ∃ attrs, vis, name, params, target, body, span, doc. t = TransitionDecl(attrs, vis, name, params, target, body, span, doc) ]
TransitionNames(M, S) = [ t.name | t ∈ Transitions(M, S) ]
```

StateMemberNames(M, S) = StateMethodNames(M, S) ++ TransitionNames(M, S)

```text
LookupTransition(M, S, name) = t ⇔ t ∈ Transitions(M, S) ∧ t.name = name
LookupTransition(M, S, name) = ⊥ ⇔ ¬ ∃ t ∈ Transitions(M, S). t.name = name
```

TransitionSig(M, S_src, t).recv = TypePerm(`unique`, ModalSelfType(M, S_src))
TransitionSig(M, S_src, t).params = t.params
S_tgt = t.target
TransitionSig(M, S_src, t).ret = ModalSelfType(M, S_tgt)
TransitionSig(M, S_src, t).target = S_tgt
TransitionSig(M, S_src, t).mode = `move`

#### 13.4.4 Static Semantics

**(Transition-Dup)**

```text
¬ Distinct(TransitionNames(M, S))    c = Code(Transition-Dup)
```

──────────────────────────────────────────────────────────

```text
Γ ⊢ S ⇑ c
```

**(StateMember-Name-Conflict)**

```text
¬ Disjoint(StateMethodNames(M, S), TransitionNames(M, S))    c = Code(StateMember-Name-Conflict)
```

────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ S ⇑ c
```

**(WF-Transition)**

```text
self ∉ ParamNames(tr.params)    Distinct(ParamNames(tr.params))    ∀ ⟨_, _, T_i⟩ ∈ tr.params, Γ ⊢ T_i wf    tr.target ∈ States(M)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ tr : TransitionOK(M, S_src)
```

**(Transition-Target-Err)**

```text
tr.target ∉ States(M)    c = Code(Transition-Target-Err)
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ tr ⇑ c
```

**(T-Modal-Transition)**

```text
Γ; R; L ⊢ e_self : TypePerm(`unique`, TypeModalState(modal_ref, S_src))    ModalDeclOf(modal_ref) = M    LookupTransition(M, S_src, t) = tr    StateMemberVisible(mod, M, tr.vis)    TransitionSig(M, S_src, tr).params = ps    TransitionSig(M, S_src, tr).target = S_tgt    Γ; R; L ⊢ ArgsOk(ps, args)    RecvArgOk(e_self, `move`)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ e_self ~> t(args) : TypeModalState(modal_ref, S_tgt)
```

**(Transition-Source-Err)**

```text
Γ; R; L ⊢ e_self : T    (PermOf(T) ≠ `unique` ∨ StripPerm(T) ≠ TypeModalState(_, _))    c = Code(Transition-Source-Err)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ e_self ~> t(args) ⇑ c
```

**(Transition-NotVisible)**

```text
Γ; R; L ⊢ e_self : TypePerm(`unique`, TypeModalState(modal_ref, S_src))    ModalDeclOf(modal_ref) = M    LookupTransition(M, S_src, t) = tr    ¬ StateMemberVisible(mod, M, tr.vis)    c = Code(Transition-NotVisible)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ e_self ~> t(args) ⇑ c
```

**(T-Modal-Transition-Body)**

```text
Σ.Types[p] = `modal` M    S_src ∈ States(M)    tr ∈ Transitions(M, S_src)    tr.body = body    tr.target = S_tgt    S_tgt ∈ States(M)    Γ_0 = PushScope(Γ)    IntroAll(Γ_0, [⟨`self`, TypePerm(`unique`, ModalSelfType(M, S_src))⟩] ++ ParamBinds(tr.params)) ⇓ Γ_1    Γ_1; ModalSelfType(M, S_tgt); ⊥ ⊢ body : T_b    Γ ⊢ T_b <: ModalSelfType(M, S_tgt)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ tr : TransitionBodyOK(p, S_src)
```

**(Transition-Body-Err)**

```text
Σ.Types[p] = `modal` M    S_src ∈ States(M)    tr ∈ Transitions(M, S_src)    tr.body = body    tr.target = S_tgt    S_tgt ∈ States(M)    Γ_0 = PushScope(Γ)    IntroAll(Γ_0, [⟨`self`, TypePerm(`unique`, ModalSelfType(M, S_src))⟩] ++ ParamBinds(tr.params)) ⇓ Γ_1    Γ_1; ModalSelfType(M, S_tgt); ⊥ ⊢ body : T_b    ¬(Γ ⊢ T_b <: ModalSelfType(M, S_tgt))    c = Code(Transition-Body-Err)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ tr ⇑ c
```

#### 13.4.5 Dynamic Semantics

```text
MethodTarget(RecordValue(ModalStateRef(modal_ref, S), fs), name) = tr ⇔ ModalDeclOf(modal_ref) = M ∧ LookupTransition(M, S, name) = tr
```

**(ApplyTransitionSigma)**

Modal state transitions consume the source state value and produce a target state value. The transition is identified when `IsTransition(m)` holds.

```text
IsTransition(m) ⇔ ∃ M, S. m ∈ Transitions(M, S)
TransitionTarget(m) = S_tgt ⇔ m.target = S_tgt
```

tr = MethodTarget(v_self, name)    IsTransition(tr)    v_self = RecordValue(ModalStateRef(modal_ref, S_src), fs_src)    ModalDeclOf(modal_ref) = M    tr.target = S_tgt

```text
BindParams(TransitionParams(M, S_src, tr), [v_arg] ++ vec_v) = binds    BlockEnter(σ, binds) ⇓ (σ_1, scope)    Γ ⊢ EvalBlockBodySigma(tr.body, σ_1) ⇓ (out_body, σ_2)
v_tgt = ExtractReturnValue(out_body)    ValidateModalState(v_tgt, modal_ref, S_tgt)    BlockExit(σ_2, scope, out_body) ⇓ (out', σ_3)
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ApplyMethodSigma(base, name, v_self, v_arg, vec_v, σ) ⇓ (Val(v_tgt), σ_3)
```

ExtractReturnValue(Val(v)) = v
ExtractReturnValue(Ctrl(Return(v))) = v

```text
ValidateModalState(v, modal_ref, S) ⇔ v = RecordValue(ModalStateRef(modal_ref, S), _)
```

#### 13.4.6 Lowering

Transitions lower as direct modal-method bodies with a moved `self` receiver. Lowering does not mutate an in-place state tag; it lowers the transition body that constructs and returns a fresh `RecordValue(ModalStateRef(modal_ref, S_tgt), ...)`.

#### 13.4.7 Diagnostics

Diagnostics are defined for duplicate transition names, target states not declared by the modal, transition invocation on a non-`unique` or non-state receiver, transition visibility failures, transition bodies that do not return the declared target state, and name conflicts between transitions and state methods.

### 13.5 Modal Widening

#### 13.5.1 Syntax

```text
widen_expr ::= "widen" unary_expr
```

#### 13.5.2 Parsing

**(Parse-Unary-Widen)**

```text
IsKw(Tok(P), `widen`)    Γ ⊢ ParseUnary(Advance(P)) ⇓ (P_1, e)
```

────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseUnary(P) ⇓ (P_1, Unary(`widen`, e))
```

#### 13.5.3 AST Representation / Form

ExprKind(Unary(`"widen"`, _)) = `widen`

#### 13.5.4 Static Semantics

WIDEN_LARGE_PAYLOAD_THRESHOLD_BYTES = 256

**(T-Modal-Widen)**

```text
Γ; R; L ⊢ e : TypeModalState(modal_ref, S)    ModalDeclOf(modal_ref) = M    S ∈ States(M)    Γ ⊢ WarnWidenLargePayload(e, modal_ref, S) ⇓ ok
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ `widen` e : ModalRefType(modal_ref)
```

**(T-Modal-Widen-Perm)**

```text
Γ; R; L ⊢ e : TypePerm(p', TypeModalState(modal_ref, S))    ModalDeclOf(modal_ref) = M    S ∈ States(M)    Γ ⊢ WarnWidenLargePayload(e, modal_ref, S) ⇓ ok
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ `widen` e : TypePerm(p', ModalRefType(modal_ref))
```

**(Widen-AlreadyGeneral)**

```text
Γ; R; L ⊢ e : T    StripPerm(T) = ModalRefType(modal_ref)    ModalDeclOf(modal_ref) = M    c = Code(Widen-AlreadyGeneral)
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ `widen` e ⇑ c
```

**(Widen-NonModal)**

```text
Γ; R; L ⊢ e : T    StripPerm(T) = U    U ≠ TypeModalState(_, _)    ¬ ∃ modal_ref, M. (U = ModalRefType(modal_ref) ∧ ModalDeclOf(modal_ref) = M)    c = Code(Widen-NonModal)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ `widen` e ⇑ c
```

```text
NicheCompatible(modal_ref, S) ⇔ ModalDeclOf(modal_ref) = M ∧ NicheApplies(modal_ref) ∧ PayloadState(modal_ref) = S ∧ sizeof(TypeModalState(modal_ref, S)) = sizeof(ModalRefType(modal_ref)) ∧ alignof(TypeModalState(modal_ref, S)) = alignof(ModalRefType(modal_ref))
```

**(Chk-Subsumption-Modal-NonNiche)**

```text
Γ; R; L ⊢ e ⇒ S ⊣ C    StripPerm(S) = TypeModalState(modal_ref, S_s)    StripPerm(T) = ModalRefType(modal_ref)    ModalDeclOf(modal_ref) = M    ¬ NicheCompatible(modal_ref, S_s)    c = Code(Chk-Subsumption-Modal-NonNiche)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ e ⇐ T ⇑ c
```

```text
WidenWarnCond(modal_ref, S) ⇔ ModalDeclOf(modal_ref) = M ∧ sizeof(TypeModalState(modal_ref, S)) > WIDEN_LARGE_PAYLOAD_THRESHOLD_BYTES ∧ ¬ NicheCompatible(modal_ref, S)
```

**(Warn-Widen-LargePayload)**

```text
WidenWarnCond(modal_ref, S)    sp = span(Unary("widen", e))    Γ ⊢ Emit(W-SYS-4010, sp)
```

────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ WarnWidenLargePayload(e, modal_ref, S) ⇓ ok
```

**(Warn-Widen-Ok)**

```text
¬ WidenWarnCond(modal_ref, S)
```

───────────────────────────────────────────────

```text
Γ ⊢ WarnWidenLargePayload(e, modal_ref, S) ⇓ ok
```

#### 13.5.5 Dynamic Semantics

```text
UnOp("widen", v) ⇓ ModalVal(S, v) ⇔ v = RecordValue(ModalStateRef(modal_ref, S), fs)
```

#### 13.5.6 Lowering

General modal values lower according to `ModalLayout(modal_ref)`. When `NicheCompatible(modal_ref, S)` holds, widening MAY be representation-preserving. Otherwise, lowering MUST materialize the tagged general-modal representation for the source state.

```text
sizeof(M@S) ≤ sizeof(M)
```

#### 13.5.7 Diagnostics

Diagnostics are defined for applying `widen` to a non-modal operand, applying `widen` to an already-general modal value, implicitly subsuming a concrete modal state to a non-niche-compatible general modal type, and widening a large non-niche payload.

### 13.6 String Types

#### 13.6.1 Syntax

```text
string_type      ::= "string" string_state_opt
string_state_opt ::= ε | "@" "Managed" | "@" "View"
```

#### 13.6.2 Parsing

**(Parse-String-Type)**

```text
IsIdent(Tok(P))    Lexeme(Tok(P)) = `string`    Γ ⊢ ParseStringState(Advance(P)) ⇓ (P_1, st_opt)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseNonPermType(P) ⇓ (P_1, TypeString(st_opt))
```

**String State.**

**(Parse-StringState-None)**

```text
¬ IsOp(Tok(P), "@")
```

───────────────────────────────────────────────

```text
Γ ⊢ ParseStringState(P) ⇓ (P, ⊥)
```

**(Parse-StringState-Managed)**
IsOp(Tok(P), "@")    IsIdent(Tok(Advance(P)))    Lexeme(Tok(Advance(P))) = `Managed`
────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseStringState(P) ⇓ (Advance(Advance(P)), `Managed`)
```

**(Parse-StringState-View)**
IsOp(Tok(P), "@")    IsIdent(Tok(Advance(P)))    Lexeme(Tok(Advance(P))) = `View`
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseStringState(P) ⇓ (Advance(Advance(P)), `View`)
```

#### 13.6.3 AST Representation / Form

```text
TypeString(state_opt)    where state_opt ∈ {⊥, `View`, `Managed`}
```

States(`string`) = { `@Managed`, `@View` }

StringBuiltinTable =
{

```text
 ⟨`string::from`, [⟨⊥, `source`, TypeString(`@View`)⟩, ⟨⊥, `heap`, TypeDynamic(`HeapAllocator`)⟩], TypeApply(["Outcome"], [TypePerm(`unique`, TypeString(`@Managed`)), TypePath(["AllocationError"])])⟩,
 ⟨`string::as_view`, [⟨⊥, `self`, TypePerm(`const`, TypeString(`@Managed`))⟩], TypeString(`@View`)⟩,
 ⟨`string::slice`, [⟨⊥, `self`, TypePerm(`const`, TypeString(`@View`))⟩, ⟨⊥, `start`, TypePrim("usize")⟩, ⟨⊥, `end`, TypePrim("usize")⟩], TypeString(`@View`)⟩,
 ⟨`string::to_managed`, [⟨⊥, `self`, TypePerm(`const`, TypeString(`@View`))⟩, ⟨⊥, `heap`, TypeDynamic(`HeapAllocator`)⟩], TypeApply(["Outcome"], [TypePerm(`unique`, TypeString(`@Managed`)), TypePath(["AllocationError"])])⟩,
 ⟨`string::clone_with`, [⟨⊥, `self`, TypePerm(`const`, TypeString(`@Managed`))⟩, ⟨⊥, `heap`, TypeDynamic(`HeapAllocator`)⟩], TypeApply(["Outcome"], [TypePerm(`unique`, TypeString(`@Managed`)), TypePath(["AllocationError"])])⟩,
 ⟨`string::append`, [⟨⊥, `self`, TypePerm(`unique`, TypeString(`@Managed`))⟩, ⟨⊥, `data`, TypeString(`@View`)⟩, ⟨⊥, `heap`, TypeDynamic(`HeapAllocator`)⟩], TypeApply(["Outcome"], [TypePrim("()"), TypePath(["AllocationError"])])⟩,
 ⟨`string::length`, [⟨⊥, `self`, TypePerm(`const`, TypeString(`@View`))⟩], TypePrim("usize")⟩,
 ⟨`string::is_empty`, [⟨⊥, `self`, TypePerm(`const`, TypeString(`@View`))⟩], TypePrim("bool")⟩
```

}

```text
StringBuiltinSig(method) = ⟨params, ret⟩ ⇔ ⟨method, params, ret⟩ ∈ StringBuiltinTable
```

#### 13.6.4 Static Semantics

**(WF-String)**

```text
T = TypeString(state_opt)    state_opt ∈ {⊥, `View`, `Managed`}
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ T wf
```

```text
S ∈ {`@Managed`, `@View`}
```

──────────────────────────────────────

```text
Γ ⊢ string@S <: string
```

The built-in string operations are typed by `StringBuiltinSig`. Calls to those operations use the ordinary call and method-call rules of Chapter 16.

#### 13.6.5 Dynamic Semantics

```text
StringLiteralVal(lit) = v ⇔ LiteralValue(lit, TypeString(`@View`)) = v
```

ByteSeq = List(`u8`)

```text
SB = ⟨StrBuf, BytesBuf, BytesCap⟩
```

StrBuf : `string@Managed` ⇀ ByteSeq
BytesBuf : `bytes@Managed` ⇀ ByteSeq
BytesCap : `bytes@Managed` ⇀ `usize`

```text
ViewBytes : (`string@View` ∪ `bytes@View`) → ByteSeq
```

ByteSeqOf(SB, v) =
 StrBuf(v)    if v:`string@Managed`
 BytesBuf(v)  if v:`bytes@Managed`
 ViewBytes(v) if v:`string@View` or v:`bytes@View`
ByteLen(SB, v) = |ByteSeqOf(SB, v)|

```text
ValueType(v) = TypeString(`@View`) ⇔ v ∈ `string@View`
ValueType(v) = TypeString(`@Managed`) ⇔ v ∈ `string@Managed`
ValueType(v) = TypeString(⊥) ⇔ ValueType(v) = TypeString(`@View`) ∨ ValueType(v) = TypeString(`@Managed`)
```

StringBytesJudg_string = {

```text
 StringFrom(SB, source, heap) ⇓ (r, SB'),
 StringAsView(SB, self) ⇓ v,
 StringSlice(SB, self, start, end) ⇓ v,
 StringToManaged(SB, self, heap) ⇓ (r, SB'),
 StringCloneWith(SB, self, heap) ⇓ (r, SB'),
 StringAppend(SB, self, data, heap) ⇓ (r, SB'),
 StringLength(SB, self) ⇓ n,
 StringIsEmpty(SB, self) ⇓ b
```

}

**String Literal Storage.**
For any string literal `lit`, evaluation MUST allocate `StringBytes(lit)` in static, read-only storage. The resulting `string@View` value MUST reference that storage and MUST have length `|StringBytes(lit)|`. The backing storage MUST have static duration and MUST NOT be deallocated.
<!-- Source: "Literal content is allocated in static, read-only memory at compilation ... A string@View value is constructed with pointer to static memory and byte length ... String literals have static storage duration; backing memory is never deallocated." -->

**(StringFrom-Ok)**

```text
r = v    SB' = ⟨StrBuf[v ↦ ByteSeqOf(SB, source)], BytesBuf, BytesCap⟩
```

────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ StringFrom(SB, source, heap) ⇓ (r, SB')
```

**(StringFrom-Err)**
AllocErrorVal(r)    SB' = SB
────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ StringFrom(SB, source, heap) ⇓ (r, SB')
```

**(StringAsView-Ok)**
ByteSeqOf(SB, v) = ByteSeqOf(SB, self)
──────────────────────────────────────────────

```text
Γ ⊢ StringAsView(SB, self) ⇓ v
```

**(StringSlice-Ok)**

```text
0 ≤ start ≤ end ≤ ByteLen(SB, self)    start and end are valid UTF-8 byte boundaries of ByteSeqOf(SB, self)    ByteSeqOf(SB, v) = ByteSeqOf(SB, self)[start..end)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ StringSlice(SB, self, start, end) ⇓ v
```

**(StringToManaged-Ok)**

```text
r = v    SB' = ⟨StrBuf[v ↦ ByteSeqOf(SB, self)], BytesBuf, BytesCap⟩
```

──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ StringToManaged(SB, self, heap) ⇓ (r, SB')
```

**(StringToManaged-Err)**
AllocErrorVal(r)    SB' = SB
────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ StringToManaged(SB, self, heap) ⇓ (r, SB')
```

**(StringCloneWith-Ok)**

```text
r = v    SB' = ⟨StrBuf[v ↦ ByteSeqOf(SB, self)], BytesBuf, BytesCap⟩
```

────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ StringCloneWith(SB, self, heap) ⇓ (r, SB')
```

**(StringCloneWith-Err)**
AllocErrorVal(r)    SB' = SB
────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ StringCloneWith(SB, self, heap) ⇓ (r, SB')
```

**(StringAppend-Ok)**

```text
r = ()    StrBuf' = StrBuf[self ↦ ByteSeqOf(SB, self) ++ ByteSeqOf(SB, data)]    SB' = ⟨StrBuf', BytesBuf, BytesCap⟩
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ StringAppend(SB, self, data, heap) ⇓ (r, SB')
```

**(StringAppend-Err)**
AllocErrorVal(r)    SB' = SB
────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ StringAppend(SB, self, data, heap) ⇓ (r, SB')
```

**(StringLength)**
n = ByteLen(SB, self)
───────────────────────────────────────

```text
Γ ⊢ StringLength(SB, self) ⇓ n
```

**(StringIsEmpty)**
b = (ByteLen(SB, self) = 0)
────────────────────────────────────────

```text
Γ ⊢ StringIsEmpty(SB, self) ⇓ b
```

```text
StringViewOf(v_managed) = v_view ⇔
  v_managed = ManagedString(ptr, len, cap) ∧
```

  v_view = ViewString(ptr, len)

StringLength(ViewString(_, len)) = len
StringLength(ManagedString(_, len, _)) = len

#### 13.6.6 Lowering

```text
StringManagedFields = [⟨`pointer`, TypePtr(TypePrim("u8"), `Valid`)⟩, ⟨`length`, TypePrim("usize")⟩, ⟨`capacity`, TypePrim("usize")⟩]
```

StringManagedOffsets = [0, PtrSize, 2 × PtrSize]

```text
RecordLayout(StringManagedFields) = ⟨3 × PtrSize, PtrAlign, StringManagedOffsets⟩
```

```text
StringViewFields = [⟨`pointer`, TypePtr(TypePerm(`const`, TypePrim("u8")), `Valid`)⟩, ⟨`length`, TypePrim("usize")⟩]
```

StringViewOffsets = [0, PtrSize]

```text
RecordLayout(StringViewFields) = ⟨2 × PtrSize, PtrAlign, StringViewOffsets⟩
```

**(Size-String-Managed)**
T = TypeString(`@Managed`)
──────────────────────────────────────────────────

```text
Γ ⊢ sizeof(T) = 3 × PtrSize
```

**(Align-String-Managed)**
T = TypeString(`@Managed`)
───────────────────────────────────────

```text
Γ ⊢ alignof(T) = PtrAlign
```

**(Layout-String-Managed)**
T = TypeString(`@Managed`)
────────────────────────────────────────────

```text
Γ ⊢ layout(T) ⇓ ⟨3 × PtrSize, PtrAlign⟩
```

**(Size-String-View)**
T = TypeString(`@View`)
────────────────────────────────────────

```text
Γ ⊢ sizeof(T) = 2 × PtrSize
```

**(Align-String-View)**
T = TypeString(`@View`)
────────────────────────────────────

```text
Γ ⊢ alignof(T) = PtrAlign
```

**(Layout-String-View)**
T = TypeString(`@View`)
───────────────────────────────────────────

```text
Γ ⊢ layout(T) ⇓ ⟨2 × PtrSize, PtrAlign⟩
```

**(Size-String-Modal)**

```text
T = TypeString(⊥)    Γ ⊢ ModalLayout(`string`) ⇓ ⟨size, align, _, _⟩
```

───────────────────────────────────────────────────────────────

```text
Γ ⊢ sizeof(T) = size
```

**(Align-String-Modal)**

```text
T = TypeString(⊥)    Γ ⊢ ModalLayout(`string`) ⇓ ⟨size, align, _, _⟩
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ alignof(T) = align
```

```text
ValueBits(TypeString(st), v) = bits ⇔ ValueType(v) = TypeString(st) ∧ |bits| = sizeof(TypeString(st))
```

```text
DropManaged(ManagedString(ptr, _, cap), v_heap) ⇔ HeapDeallocRaw(v_heap, ptr, cap)
```

#### 13.6.7 Diagnostics

This section introduces no additional diagnostics beyond the shared well-formedness, call typing, and allocation-result rules.

### 13.7 Bytes Types

#### 13.7.1 Syntax

```text
bytes_type      ::= "bytes" bytes_state_opt
bytes_state_opt ::= ε | "@" "Managed" | "@" "View"
```

#### 13.7.2 Parsing

**(Parse-Bytes-Type)**

```text
IsIdent(Tok(P))    Lexeme(Tok(P)) = `bytes`    Γ ⊢ ParseBytesState(Advance(P)) ⇓ (P_1, st_opt)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseNonPermType(P) ⇓ (P_1, TypeBytes(st_opt))
```

**Bytes State.**

**(Parse-BytesState-None)**

```text
¬ IsOp(Tok(P), "@")
```

───────────────────────────────────────────────

```text
Γ ⊢ ParseBytesState(P) ⇓ (P, ⊥)
```

**(Parse-BytesState-Managed)**
IsOp(Tok(P), "@")    IsIdent(Tok(Advance(P)))    Lexeme(Tok(Advance(P))) = `Managed`
────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseBytesState(P) ⇓ (Advance(Advance(P)), `Managed`)
```

**(Parse-BytesState-View)**
IsOp(Tok(P), "@")    IsIdent(Tok(Advance(P)))    Lexeme(Tok(Advance(P))) = `View`
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseBytesState(P) ⇓ (Advance(Advance(P)), `View`)
```

#### 13.7.3 AST Representation / Form

```text
TypeBytes(state_opt)    where state_opt ∈ {⊥, `View`, `Managed`}
```

States(`bytes`) = { `@Managed`, `@View` }

BytesBuiltinTable =
{

```text
 ⟨`bytes::with_capacity`, [⟨⊥, `cap`, TypePrim("usize")⟩, ⟨⊥, `heap`, TypeDynamic(`HeapAllocator`)⟩], TypeApply(["Outcome"], [TypePerm(`unique`, TypeBytes(`@Managed`)), TypePath(["AllocationError"])])⟩,
 ⟨`bytes::from_slice`, [⟨⊥, `data`, TypePerm(`const`, TypeSlice(TypePrim("u8")))⟩, ⟨⊥, `heap`, TypeDynamic(`HeapAllocator`)⟩], TypeApply(["Outcome"], [TypePerm(`unique`, TypeBytes(`@Managed`)), TypePath(["AllocationError"])])⟩,
 ⟨`bytes::as_view`, [⟨⊥, `self`, TypePerm(`const`, TypeBytes(`@Managed`))⟩], TypeBytes(`@View`)⟩,
 ⟨`bytes::as_slice`, [⟨⊥, `self`, TypePerm(`const`, TypeBytes(`@View`))⟩], TypePerm(`const`, TypeSlice(TypePrim("u8")))⟩,
 ⟨`bytes::to_managed`, [⟨⊥, `self`, TypePerm(`const`, TypeBytes(`@View`))⟩, ⟨⊥, `heap`, TypeDynamic(`HeapAllocator`)⟩], TypeApply(["Outcome"], [TypePerm(`unique`, TypeBytes(`@Managed`)), TypePath(["AllocationError"])])⟩,
 ⟨`bytes::view`, [⟨⊥, `data`, TypePerm(`const`, TypeSlice(TypePrim("u8")))⟩], TypeBytes(`@View`)⟩,
 ⟨`bytes::view_string`, [⟨⊥, `data`, TypeString(`@View`)⟩], TypeBytes(`@View`)⟩,
 ⟨`bytes::append`, [⟨⊥, `self`, TypePerm(`unique`, TypeBytes(`@Managed`))⟩, ⟨⊥, `data`, TypeBytes(`@View`)⟩, ⟨⊥, `heap`, TypeDynamic(`HeapAllocator`)⟩], TypeApply(["Outcome"], [TypePrim("()"), TypePath(["AllocationError"])])⟩,
 ⟨`bytes::length`, [⟨⊥, `self`, TypePerm(`const`, TypeBytes(`@View`))⟩], TypePrim("usize")⟩,
 ⟨`bytes::is_empty`, [⟨⊥, `self`, TypePerm(`const`, TypeBytes(`@View`))⟩], TypePrim("bool")⟩
```

}

```text
StringBytesBuiltinTable = StringBuiltinTable ∪ BytesBuiltinTable
BytesBuiltinSig(method) = ⟨params, ret⟩ ⇔ ⟨method, params, ret⟩ ∈ BytesBuiltinTable
StringBytesBuiltinSig(method) = ⟨params, ret⟩ ⇔ StringBuiltinSig(method) = ⟨params, ret⟩
StringBytesBuiltinSig(method) = ⟨params, ret⟩ ⇔ BytesBuiltinSig(method) = ⟨params, ret⟩
```

#### 13.7.4 Static Semantics

**(WF-Bytes)**

```text
T = TypeBytes(state_opt)    state_opt ∈ {⊥, `View`, `Managed`}
```

───────────────────────────────────────────────────────────────

```text
Γ ⊢ T wf
```

```text
S ∈ {`@Managed`, `@View`}
```

────────────────────────────────────

```text
Γ ⊢ bytes@S <: bytes
```

The built-in bytes operations are typed by `BytesBuiltinSig`. Calls to those operations use the ordinary call and method-call rules of Chapter 16.

#### 13.7.5 Dynamic Semantics

```text
SliceBytes(data) = [b | b ∈ data]
```

```text
ValueType(v) = TypeBytes(`@View`) ⇔ v ∈ `bytes@View`
ValueType(v) = TypeBytes(`@Managed`) ⇔ v ∈ `bytes@Managed`
ValueType(v) = TypeBytes(⊥) ⇔ ValueType(v) = TypeBytes(`@View`) ∨ ValueType(v) = TypeBytes(`@Managed`)
```

StringBytesJudg_bytes = {

```text
 BytesWithCapacity(SB, cap, heap) ⇓ (r, SB'),
 BytesFromSlice(SB, data, heap) ⇓ (r, SB'),
 BytesAsView(SB, self) ⇓ v,
 BytesToManaged(SB, self, heap) ⇓ (r, SB'),
 BytesView(SB, data) ⇓ v,
 BytesViewString(SB, data) ⇓ v,
 BytesAsSlice(SB, self) ⇓ s,
 BytesAppend(SB, self, data, heap) ⇓ (r, SB'),
 BytesLength(SB, self) ⇓ n,
 BytesIsEmpty(SB, self) ⇓ b
```

}

```text
StringBytesJudg = StringBytesJudg_string ∪ StringBytesJudg_bytes
```

**(BytesWithCapacity-Ok)**

```text
r = v    BytesBuf' = BytesBuf[v ↦ []]    BytesCap' = BytesCap[v ↦ cap']    cap' ≥ cap    SB' = ⟨StrBuf, BytesBuf', BytesCap'⟩
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BytesWithCapacity(SB, cap, heap) ⇓ (r, SB')
```

**(BytesWithCapacity-Err)**
AllocErrorVal(r)    SB' = SB
────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BytesWithCapacity(SB, cap, heap) ⇓ (r, SB')
```

**(BytesFromSlice-Ok)**

```text
r = v    BytesBuf' = BytesBuf[v ↦ SliceBytes(data)]    SB' = ⟨StrBuf, BytesBuf', BytesCap⟩
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BytesFromSlice(SB, data, heap) ⇓ (r, SB')
```

**(BytesFromSlice-Err)**
AllocErrorVal(r)    SB' = SB
────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BytesFromSlice(SB, data, heap) ⇓ (r, SB')
```

**(BytesAsView-Ok)**
ByteSeqOf(SB, v) = ByteSeqOf(SB, self)
────────────────────────────────────────────

```text
Γ ⊢ BytesAsView(SB, self) ⇓ v
```

**(BytesToManaged-Ok)**

```text
r = v    BytesBuf' = BytesBuf[v ↦ ByteSeqOf(SB, self)]    SB' = ⟨StrBuf, BytesBuf', BytesCap⟩
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BytesToManaged(SB, self, heap) ⇓ (r, SB')
```

**(BytesToManaged-Err)**
AllocErrorVal(r)    SB' = SB
──────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BytesToManaged(SB, self, heap) ⇓ (r, SB')
```

**(BytesView-Ok)**
ByteSeqOf(SB, v) = SliceBytes(data)
──────────────────────────────────────────

```text
Γ ⊢ BytesView(SB, data) ⇓ v
```

**(BytesViewString-Ok)**
ByteSeqOf(SB, v) = ByteSeqOf(SB, data)
───────────────────────────────────────────

```text
Γ ⊢ BytesViewString(SB, data) ⇓ v
```

**(BytesAsSlice-Ok)**
SliceBytes(s) = ByteSeqOf(SB, self)
──────────────────────────────────────────

```text
Γ ⊢ BytesAsSlice(SB, self) ⇓ s
```

**(BytesAppend-Ok)**

```text
r = ()    BytesBuf' = BytesBuf[self ↦ ByteSeqOf(SB, self) ++ ByteSeqOf(SB, data)]    SB' = ⟨StrBuf, BytesBuf', BytesCap⟩
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BytesAppend(SB, self, data, heap) ⇓ (r, SB')
```

**(BytesAppend-Err)**
AllocErrorVal(r)    SB' = SB
────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BytesAppend(SB, self, data, heap) ⇓ (r, SB')
```

**(BytesLength)**
n = ByteLen(SB, self)
──────────────────────────────────────

```text
Γ ⊢ BytesLength(SB, self) ⇓ n
```

**(BytesIsEmpty)**
b = (ByteLen(SB, self) = 0)
───────────────────────────────────────

```text
Γ ⊢ BytesIsEmpty(SB, self) ⇓ b
```

```text
BytesViewOf(v_managed) = v_view ⇔
  v_managed = ManagedBytes(ptr, len, cap) ∧
```

  v_view = ViewBytes(ptr, len)

BytesLength(ViewBytes(_, len)) = len
BytesLength(ManagedBytes(_, len, _)) = len

BytesViewFromSlice(SliceVal(ptr, len)) = ViewBytes(ptr, len)
BytesViewFromString(ViewString(ptr, len)) = ViewBytes(ptr, len)

#### 13.7.6 Lowering

```text
BytesManagedFields = [⟨`pointer`, TypePtr(TypePrim("u8"), `Valid`)⟩, ⟨`length`, TypePrim("usize")⟩, ⟨`capacity`, TypePrim("usize")⟩]
```

BytesManagedOffsets = [0, PtrSize, 2 × PtrSize]

```text
RecordLayout(BytesManagedFields) = ⟨3 × PtrSize, PtrAlign, BytesManagedOffsets⟩
```

```text
BytesViewFields = [⟨`pointer`, TypePtr(TypePerm(`const`, TypePrim("u8")), `Valid`)⟩, ⟨`length`, TypePrim("usize")⟩]
```

BytesViewOffsets = [0, PtrSize]

```text
RecordLayout(BytesViewFields) = ⟨2 × PtrSize, PtrAlign, BytesViewOffsets⟩
```

**(Size-Bytes-Managed)**
T = TypeBytes(`@Managed`)
─────────────────────────────────────────

```text
Γ ⊢ sizeof(T) = 3 × PtrSize
```

**(Align-Bytes-Managed)**
T = TypeBytes(`@Managed`)
────────────────────────────────────

```text
Γ ⊢ alignof(T) = PtrAlign
```

**(Layout-Bytes-Managed)**
T = TypeBytes(`@Managed`)
───────────────────────────────────────────

```text
Γ ⊢ layout(T) ⇓ ⟨3 × PtrSize, PtrAlign⟩
```

**(Size-Bytes-View)**
T = TypeBytes(`@View`)
────────────────────────────────────────

```text
Γ ⊢ sizeof(T) = 2 × PtrSize
```

**(Align-Bytes-View)**
T = TypeBytes(`@View`)
────────────────────────────────────

```text
Γ ⊢ alignof(T) = PtrAlign
```

**(Layout-Bytes-View)**
T = TypeBytes(`@View`)
───────────────────────────────────────────

```text
Γ ⊢ layout(T) ⇓ ⟨2 × PtrSize, PtrAlign⟩
```

**(Size-Bytes-Modal)**

```text
T = TypeBytes(⊥)    Γ ⊢ ModalLayout(`bytes`) ⇓ ⟨size, align, _, _⟩
```

───────────────────────────────────────────────────────────────

```text
Γ ⊢ sizeof(T) = size
```

**(Align-Bytes-Modal)**

```text
T = TypeBytes(⊥)    Γ ⊢ ModalLayout(`bytes`) ⇓ ⟨size, align, _, _⟩
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ alignof(T) = align
```

```text
ValueBits(TypeBytes(st), v) = bits ⇔ ValueType(v) = TypeBytes(st) ∧ |bits| = sizeof(TypeBytes(st))
```

```text
DropManaged(ManagedBytes(ptr, _, cap), v_heap) ⇔ HeapDeallocRaw(v_heap, ptr, cap)
```

#### 13.7.7 Diagnostics

This section introduces no additional diagnostics beyond the shared well-formedness, call typing, and allocation-result rules.

### 13.8 Safe Pointer Types

#### 13.8.1 Syntax

```text
safe_ptr_type ::= "Ptr" "<" type ">" ptr_state_opt
ptr_state_opt ::= ε | "@" "Valid" | "@" "Null" | "@" "Expired"
```

#### 13.8.2 Parsing

**(Parse-Safe-Pointer-Type-ShiftSplit)**

```text
IsIdent(Tok(P))    Lexeme(Tok(P)) = `Ptr`    IsOp(Tok(Advance(P)), "<")    Γ ⊢ ParseType(Advance(Advance(P))) ⇓ (P_1, t)    IsOp(Tok(P_1), ">>")    P_1' = SplitShiftR(P_1)    Γ ⊢ ParsePtrState(Advance(P_1')) ⇓ (P_2, st_opt)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseNonPermType(P) ⇓ (P_2, TypePtr(t, st_opt))
```

**(Parse-Safe-Pointer-Type)**

```text
IsIdent(Tok(P))    Lexeme(Tok(P)) = `Ptr`    IsOp(Tok(Advance(P)), "<")    Γ ⊢ ParseType(Advance(Advance(P))) ⇓ (P_1, t)    IsOp(Tok(P_1), ">")    Γ ⊢ ParsePtrState(Advance(P_1)) ⇓ (P_2, st_opt)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseNonPermType(P) ⇓ (P_2, TypePtr(t, st_opt))
```

**Pointer State.**

**(Parse-PtrState-None)**

```text
¬ IsOp(Tok(P), "@")
```

──────────────────────────────────────────────

```text
Γ ⊢ ParsePtrState(P) ⇓ (P, ⊥)
```

**(Parse-PtrState-Valid)**
IsOp(Tok(P), "@")    IsIdent(Tok(Advance(P)))    Lexeme(Tok(Advance(P))) = `Valid`
────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePtrState(P) ⇓ (Advance(Advance(P)), `Valid`)
```

**(Parse-PtrState-Null)**
IsOp(Tok(P), "@")    IsIdent(Tok(Advance(P)))    Lexeme(Tok(Advance(P))) = `Null`
──────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePtrState(P) ⇓ (Advance(Advance(P)), `Null`)
```

**(Parse-PtrState-Expired)**
IsOp(Tok(P), "@")    IsIdent(Tok(Advance(P)))    Lexeme(Tok(Advance(P))) = `Expired`
──────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePtrState(P) ⇓ (Advance(Advance(P)), `Expired`)
```

#### 13.8.3 AST Representation / Form

PtrState = {`Valid`, `Null`, `Expired`}

```text
Ptr<T> = TypePtr(T, ⊥)
Ptr<T>@s = TypePtr(T, s)    (s ≠ ⊥)
```

#### 13.8.4 Static Semantics

**(WF-Ptr)**

```text
T = TypePtr(T_0, state_opt)    state_opt ∈ {⊥, `Valid`, `Null`, `Expired`}    Γ ⊢ T_0 wf
```

────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T wf
```

BitcopyType(TypePtr(T, s))
CloneType(TypePtr(T, s))

```text
¬ DropType(TypePtr(T, s))
```

**(Sub-Ptr-State)**

```text
s ∈ {`Valid`, `Null`}
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ TypePtr(T, s) <: TypePtr(T, ⊥)
```

#### 13.8.5 Dynamic Semantics

Ptr@Valid(addr) = PtrVal(`Valid`, addr)
Ptr@Null(addr) = PtrVal(`Null`, addr)
Ptr@Expired(addr) = PtrVal(`Expired`, addr)

```text
ValueType(PtrVal(s, addr)) = TypePtr(T, s) ⇔ T ∈ Type
```

```text
PtrState(σ, Ptr@Null(_)) = `Null`
PtrState(σ, Ptr@Expired(_)) = `Expired`
PtrState(σ, Ptr@Valid(addr)) =
 `Valid`    if AddrTag(σ, addr) = ⊥
 `Valid`    if AddrTag(σ, addr) = tag ≠ ⊥ ∧ TagActive(σ, tag)
 `Expired`  if AddrTag(σ, addr) = tag ≠ ⊥ ∧ ¬ TagActive(σ, tag)
```

```text
PtrAddrJudg = {Γ ⊢ ReadPtrSigma(v_ptr, σ) ⇓ (out, σ'), Γ ⊢ WritePtrSigma(v_ptr, v, σ) ⇓ (sout, σ'), Γ ⊢ AddrOfSigma(p, σ) ⇓ (out, σ')}
```

**(ReadPtr-Safe)**

```text
PtrState(σ, v_ptr) = `Valid`    PtrAddr(v_ptr) = addr    ReadAddr(σ, addr) = v
```

──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ReadPtrSigma(v_ptr, σ) ⇓ (Val(v), σ)
```

**(WritePtr-Safe)**

```text
PtrState(σ, v_ptr) = `Valid`    PtrAddr(v_ptr) = addr    WriteAddr(σ, addr, v) ⇓ σ'
```

────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ WritePtrSigma(v_ptr, v, σ) ⇓ (ok, σ')
```

**(ReadPtr-Null)**

```text
PtrState(σ, v_ptr) = `Null`
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ ReadPtrSigma(v_ptr, σ) ⇓ (Ctrl(Panic), σ)
```

**(ReadPtr-Expired)**

```text
PtrState(σ, v_ptr) = `Expired`
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ ReadPtrSigma(v_ptr, σ) ⇓ (Ctrl(Panic), σ)
```

**(WritePtr-Null)**

```text
PtrState(σ, v_ptr) = `Null`
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ WritePtrSigma(v_ptr, v, σ) ⇓ (Ctrl(Panic), σ)
```

**(WritePtr-Expired)**

```text
PtrState(σ, v_ptr) = `Expired`
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ WritePtrSigma(v_ptr, v, σ) ⇓ (Ctrl(Panic), σ)
```

#### 13.8.6 Lowering

**(Size-Ptr)**
T = TypePtr(T_0, s)
────────────────────────────────

```text
Γ ⊢ sizeof(T) = PtrSize
```

**(Align-Ptr)**
T = TypePtr(T_0, s)
────────────────────────────────

```text
Γ ⊢ alignof(T) = PtrAlign
```

**(Layout-Ptr)**
T = TypePtr(T_0, s)
────────────────────────────────────────────

```text
Γ ⊢ layout(T) ⇓ ⟨PtrSize, PtrAlign⟩
```

sizeof(`Ptr<T>`) = sizeof(`usize`)    alignof(`Ptr<T>`) = alignof(`usize`)
PtrDiagRefs = {"8.10"}

```text
NicheSet(T) = {LEBytes(0, PtrSize)} ⇔ ∃ U. T = TypePtr(U, `Valid`)
NicheSet(T) = ∅ ⇔ ¬ ∃ U. T = TypePtr(U, `Valid`)
```

```text
ValidValue(TypePtr(T, `Valid`), bits) ⇔ |bits| = PtrSize ∧ bits ≠ LEBytes(0, PtrSize)
ValidValue(TypePtr(T, `Null`), bits) ⇔ bits = LEBytes(0, PtrSize)
ValidValue(TypePtr(T, `Expired`), bits) ⇔ |bits| = PtrSize
ValidValue(TypePtr(T, ⊥), bits) ⇔ |bits| = PtrSize
```

```text
ValueBits(TypePtr(T, `Valid`), v) = bits ⇔ v = PtrVal(`Valid`, addr) ∧ addr ≠ 0x0 ∧ bits = LEBytes(addr, PtrSize)
ValueBits(TypePtr(T, `Null`), v) = bits ⇔ v = PtrVal(`Null`, addr) ∧ addr = 0x0 ∧ bits = LEBytes(addr, PtrSize)
ValueBits(TypePtr(T, `Expired`), v) = bits ⇔ v = PtrVal(`Expired`, addr) ∧ bits = LEBytes(addr, PtrSize)
ValueBits(TypePtr(T, ⊥), v) = bits ⇔ ∃ s. s ∈ PtrStateSet ∧ ValueBits(TypePtr(T, s), v) = bits
```

#### 13.8.7 Diagnostics

Diagnostics are defined for dereference of safe pointers known statically to be in the `@Null` or `@Expired` states. `Ptr::null()` expression diagnostics are owned by §16.1.7.

### 13.9 Raw Pointer Types

#### 13.9.1 Syntax

```text
raw_ptr_type ::= "*" ("imm" | "mut") type
```

#### 13.9.2 Parsing

**(Parse-Raw-Pointer-Type)**

```text
IsOp(Tok(P), "*")    IsKw(Tok(Advance(P)), q)    q ∈ {`imm`, `mut`}    Γ ⊢ ParseType(Advance(Advance(P))) ⇓ (P_1, t)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseNonPermType(P) ⇓ (P_1, TypeRawPtr(q, t))
```

#### 13.9.3 AST Representation / Form

```text
TypeRawPtr(qual, elem)    where qual ∈ {`imm`, `mut`}
```

#### 13.9.4 Static Semantics

**(WF-RawPtr)**

```text
T = TypeRawPtr(q, T_0)    Γ ⊢ T_0 wf
```

────────────────────────────────────────

```text
Γ ⊢ T wf
```

**(T-Deref-Raw)**

```text
UnsafeSpan(span(Deref(e)))    Γ; R; L ⊢ e : TypeRawPtr(q, T)    BitcopyType(T)
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Deref(e) : T
```

**(P-Deref-Raw-Imm)**

```text
UnsafeSpan(span(Deref(e)))    Γ; R; L ⊢ e : TypeRawPtr(`imm`, T)
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Deref(e) :place TypePerm(`const`, T)
```

**(P-Deref-Raw-Mut)**

```text
UnsafeSpan(span(Deref(e)))    Γ; R; L ⊢ e : TypeRawPtr(`mut`, T)
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Deref(e) :place TypePerm(`unique`, T)
```

**(Deref-Raw-Unsafe)**

```text
Γ; R; L ⊢ e : TypeRawPtr(q, T)    ¬ UnsafeSpan(span(Deref(e)))    c = Code(Deref-Raw-Unsafe)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Deref(e) ⇑ c
```

#### 13.9.5 Dynamic Semantics

```text
ValueType(RawPtr(q, addr)) = TypeRawPtr(q, T) ⇔ T ∈ Type
```

**(ReadPtr-Raw)**

```text
v_ptr = RawPtr(q, addr)    ReadAddr(σ, addr) = v
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ ReadPtrSigma(v_ptr, σ) ⇓ (Val(v), σ)
```

**(WritePtr-Raw)**

```text
v_ptr = RawPtr(`mut`, addr)    WriteAddr(σ, addr, v) ⇓ σ'
```

───────────────────────────────────────────────────────────────

```text
Γ ⊢ WritePtrSigma(v_ptr, v, σ) ⇓ (ok, σ')
```

**(ReadPtr-Raw-Invalid)**

```text
v_ptr = RawPtr(q, addr)    ReadAddr(σ, addr) undefined
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ ReadPtrSigma(v_ptr, σ) ⇓ (Ctrl(Panic), σ)
```

**(WritePtr-Raw-Imm)**
v_ptr = RawPtr(`imm`, addr)
──────────────────────────────────────────────────────────────

```text
Γ ⊢ WritePtrSigma(v_ptr, v, σ) ⇓ (Ctrl(Panic), σ)
```

**(WritePtr-Raw-Invalid)**

```text
v_ptr = RawPtr(`mut`, addr)    ¬ ∃ σ'. WriteAddr(σ, addr, v) ⇓ σ'
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ WritePtrSigma(v_ptr, v, σ) ⇓ (Ctrl(Panic), σ)
```

#### 13.9.6 Lowering

**(Size-RawPtr)**
T = TypeRawPtr(q, T_0)
────────────────────────────────

```text
Γ ⊢ sizeof(T) = PtrSize
```

**(Align-RawPtr)**
T = TypeRawPtr(q, T_0)
────────────────────────────────

```text
Γ ⊢ alignof(T) = PtrAlign
```

**(Layout-RawPtr)**
T = TypeRawPtr(q, T_0)
────────────────────────────────────────────

```text
Γ ⊢ layout(T) ⇓ ⟨PtrSize, PtrAlign⟩
```

```text
ValidValue(TypeRawPtr(q, T), bits) ⇔ |bits| = PtrSize
ValueBits(TypeRawPtr(q, T), v) = bits ⇔ v = RawPtr(q, addr) ∧ bits = LEBytes(addr, PtrSize)
```

Dereference lowering for raw pointers uses the shared `ReadPtrIR` and `WritePtrIR` operations. A raw dereference does not carry pointer-state metadata; invalid-address behavior is therefore observed only dynamically.

#### 13.9.7 Diagnostics

Diagnostics are defined for dereference of raw pointers outside `unsafe`. Invalid raw-pointer reads and writes are runtime panic behavior rather than compile-time diagnostics.

### 13.10 Function Types

#### 13.10.1 Syntax

```text
func_type       ::= "(" param_type_list? ")" "->" type
param_type_list ::= param_type ("," param_type)* ","?
param_type      ::= "move" type | type
```

Trailing commas in `param_type_list` are permitted only when `TrailingCommaAllowed` (§5.5). A trailing comma does not denote an additional parameter type.

#### 13.10.2 Parsing

**(Parse-Func-Type)**

```text
IsPunc(Tok(P), "(")    Γ ⊢ ParseParamTypeList(Advance(P)) ⇓ (P_1, params)    IsPunc(Tok(P_1), ")")    IsOp(Tok(Advance(P_1)), "->")    Γ ⊢ ParseType(Advance(Advance(P_1))) ⇓ (P_2, ret)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseNonPermType(P) ⇓ (P_2, TypeFunc(params, ret))
```

**(Parse-ParamType-Move)**

```text
IsKw(Tok(P), `move`)    Γ ⊢ ParseType(Advance(P)) ⇓ (P_1, ty)
```

────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseParamType(P) ⇓ (P_1, ⟨`move`, ty⟩)
```

**(Parse-ParamType-Plain)**

```text
¬ IsKw(Tok(P), `move`)    Γ ⊢ ParseType(P) ⇓ (P_1, ty)
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseParamType(P) ⇓ (P_1, ⟨⊥, ty⟩)
```

**(Parse-ParamTypeList-Empty)**
IsPunc(Tok(P), ")")
──────────────────────────────────────────────

```text
Γ ⊢ ParseParamTypeList(P) ⇓ (P, [])
```

**(Parse-ParamTypeList-Cons)**

```text
Γ ⊢ ParseParamType(P) ⇓ (P_1, pt)    Γ ⊢ ParseParamTypeListTail(P_1, [pt]) ⇓ (P_2, pts)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseParamTypeList(P) ⇓ (P_2, pts)
```

**(Parse-ParamTypeListTail-End)**
IsPunc(Tok(P), ")")
──────────────────────────────────────────────

```text
Γ ⊢ ParseParamTypeListTail(P, ps) ⇓ (P, ps)
```

**(Parse-ParamTypeListTail-TrailingComma)**
IsPunc(Tok(P), ",")    IsPunc(Tok(Advance(P)), ")")    TrailingCommaAllowed(P_0, P, {Punctuator(")")})
───────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseParamTypeListTail(P, ps) ⇓ (Advance(P), ps)
```

**(Parse-ParamTypeListTail-Cons)**

```text
IsPunc(Tok(P), ",")    Γ ⊢ ParseParamType(Advance(P)) ⇓ (P_1, pt)    Γ ⊢ ParseParamTypeListTail(P_1, ps ++ [pt]) ⇓ (P_2, ps')
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseParamTypeListTail(P, ps) ⇓ (P_2, ps')
```

#### 13.10.3 AST Representation / Form

```text
TypeFunc([⟨mode_1, T_1⟩, …, ⟨mode_n, T_n⟩], R)
```

#### 13.10.4 Static Semantics

**(WF-Func)**

```text
T = TypeFunc([⟨m_1, T_1⟩, …, ⟨m_n, T_n⟩], R)    Γ ⊢ R wf    ∀ i, Γ ⊢ T_i wf
```

────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T wf
```

**(T-Equiv-Func)**

```text
T = TypeFunc([⟨m_1, T_1⟩, …, ⟨m_n, T_n⟩], R)    U = TypeFunc([⟨m_1, U_1⟩, …, ⟨m_n, U_n⟩], S)    ∀ i, Γ ⊢ T_i ≡ U_i    Γ ⊢ R ≡ S
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T ≡ U
```

**(Sub-Func)**

```text
T = TypeFunc([⟨m_1, T_1⟩, …, ⟨m_n, T_n⟩], R)    U = TypeFunc([⟨m_1, U_1⟩, …, ⟨m_n, U_n⟩], S)    ∀ i, Γ ⊢ U_i <: T_i    Γ ⊢ R <: S
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T <: U
```

**(T-Proc-As-Value)**
procedure f(m_1 x_1 : T_1, …, m_n x_n : T_n) -> R declared
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ f : TypeFunc([⟨m_1, T_1⟩, …, ⟨m_n, T_n⟩], R)
```

Call arity, argument typing, and callee-kind diagnostics for `TypeFunc` are owned by Chapter 16.

#### 13.10.5 Dynamic Semantics

```text
FuncVal(sym) defined ⇔ sym ∈ Symbol
```

**(EvalSigma-Call-Proc)**

```text
Γ ⊢ EvalSigma(callee, σ) ⇓ (Val(v_c), σ_1)    proc = CallTarget(v_c)    Γ ⊢ EvalArgsSigma(proc.params, args, σ_1) ⇓ (Val(vec_v), σ_2)    Γ ⊢ ApplyProcSigma(proc, vec_v, σ_2) ⇓ (out, σ_3)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Call(callee, args), σ) ⇓ (out, σ_3)
```

Named procedures therefore denote first-class callable values of function type.

#### 13.10.6 Lowering

**(Size-Func)**
T = TypeFunc(params, R)
────────────────────────────────

```text
Γ ⊢ sizeof(T) = PtrSize
```

**(Align-Func)**
T = TypeFunc(params, R)
────────────────────────────────

```text
Γ ⊢ alignof(T) = PtrAlign
```

**(Layout-Func)**
T = TypeFunc(params, R)
────────────────────────────────────────────

```text
Γ ⊢ layout(T) ⇓ ⟨PtrSize, PtrAlign⟩
```

Function-type calls are lowered through the ordinary call-lowering and ABI rules of Chapters 16 and 23.

#### 13.10.7 Diagnostics

This section introduces no additional diagnostics beyond the shared type well-formedness rules and the call-expression diagnostics owned by Chapter 16.

### 13.11 Closure Types

#### 13.11.1 Syntax

```text
closure_type      ::= "|" param_type_list? "|" "->" type closure_deps_opt
closure_deps_opt  ::= ε | "[" "shared" ":" "{" shared_dep_list? "}" "]"
shared_dep_list   ::= shared_dep ("," shared_dep)*
shared_dep        ::= identifier ":" type
```

Within `closure_type`, if a parameter type has a top-level `union_type`, it MUST be parenthesized as `("(" type ")")`. This grouped form is permitted only to disambiguate closure parameter types and does not introduce a distinct type constructor.

#### 13.11.2 Parsing

**(Parse-Closure-Type)**

```text
IsOp(Tok(P), "|")    Γ ⊢ ParseClosureParamTypeList(Advance(P)) ⇓ (P_1, params)    IsOp(Tok(P_1), "|")    IsOp(Tok(Advance(P_1)), "->")    Γ ⊢ ParseType(Advance(Advance(P_1))) ⇓ (P_2, ret)    Γ ⊢ ParseClosureDepsOpt(P_2) ⇓ (P_3, deps_opt)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseNonPermType(P) ⇓ (P_3, TypeClosure(params, ret, deps_opt))
```

**(Parse-Closure-Type-Empty)**

```text
IsOp(Tok(P), "|")    IsOp(Tok(Advance(P)), "|")    IsOp(Tok(Advance(Advance(P))), "->")    Γ ⊢ ParseType(Advance(Advance(Advance(P)))) ⇓ (P_1, ret)    Γ ⊢ ParseClosureDepsOpt(P_1) ⇓ (P_2, deps_opt)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseNonPermType(P) ⇓ (P_2, TypeClosure([], ret, deps_opt))
```

**(Parse-ClosureParamType-Grouped)**

```text
IsPunc(Tok(P), "(")    Γ ⊢ ParseType(Advance(P)) ⇓ (P_1, ty)    IsPunc(Tok(P_1), ")")
```

────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseClosureParamType(P) ⇓ (Advance(P_1), ty)
```

**(Parse-ClosureParamType-Plain)**

```text
¬ IsPunc(Tok(P), "(")    Γ ⊢ ParseTypeNoUnion(P) ⇓ (P_1, ty)
```

─────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseClosureParamType(P) ⇓ (P_1, ty)
```

**(Parse-ClosureParamTypeList-Empty)**
IsOp(Tok(P), "|")
─────────────────────────────────────────────

```text
Γ ⊢ ParseClosureParamTypeList(P) ⇓ (P, [])
```

**(Parse-ClosureParamTypeList-Cons)**

```text
Γ ⊢ ParseClosureParamType(P) ⇓ (P_1, pt)    Γ ⊢ ParseClosureParamTypeListTail(P_1, [pt]) ⇓ (P_2, pts)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseClosureParamTypeList(P) ⇓ (P_2, pts)
```

**(Parse-ClosureParamTypeListTail-End)**
IsOp(Tok(P), "|")
─────────────────────────────────────────────────

```text
Γ ⊢ ParseClosureParamTypeListTail(P, ps) ⇓ (P, ps)
```

**(Parse-ClosureParamTypeListTail-TrailingComma)**
IsPunc(Tok(P), ",")    IsOp(Tok(Advance(P)), "|")    TrailingCommaAllowed(P_0, P, {Operator("|")})
──────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseClosureParamTypeListTail(P, ps) ⇓ (Advance(P), ps)
```

**(Parse-ClosureParamTypeListTail-Comma)**

```text
IsPunc(Tok(P), ",")    Γ ⊢ ParseClosureParamType(Advance(P)) ⇓ (P_1, pt)    Γ ⊢ ParseClosureParamTypeListTail(P_1, ps ++ [pt]) ⇓ (P_2, ps')
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseClosureParamTypeListTail(P, ps) ⇓ (P_2, ps')
```

**(Parse-ClosureDepsOpt-None)**

```text
¬ IsPunc(Tok(P), "[")
```

────────────────────────────────────────────────

```text
Γ ⊢ ParseClosureDepsOpt(P) ⇓ (P, ⊥)
```

**(Parse-ClosureDepsOpt-Some)**

```text
IsPunc(Tok(P), "[")    IsKw(Tok(Advance(P)), `shared`)    IsPunc(Tok(Advance(Advance(P))), ":")    IsPunc(Tok(Advance(Advance(Advance(P)))), "{")    Γ ⊢ ParseSharedDepList(Advance(Advance(Advance(Advance(P))))) ⇓ (P_1, deps)    IsPunc(Tok(P_1), "}")    IsPunc(Tok(Advance(P_1)), "]")
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseClosureDepsOpt(P) ⇓ (Advance(Advance(P_1)), ⟨deps⟩)
```

**(Parse-SharedDepList-Empty)**
IsPunc(Tok(P), "}")
────────────────────────────────────────────────

```text
Γ ⊢ ParseSharedDepList(P) ⇓ (P, [])
```

**(Parse-SharedDepList-Single)**

```text
Γ ⊢ ParseSharedDep(P) ⇓ (P_1, dep)    ¬ IsPunc(Tok(P_1), ",")
```

────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseSharedDepList(P) ⇓ (P_1, [dep])
```

**(Parse-SharedDepList-Cons)**

```text
Γ ⊢ ParseSharedDep(P) ⇓ (P_1, dep)    IsPunc(Tok(P_1), ",")    Γ ⊢ ParseSharedDepList(Advance(P_1)) ⇓ (P_2, deps)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseSharedDepList(P) ⇓ (P_2, [dep] ++ deps)
```

**(Parse-SharedDep)**

```text
IsIdent(Tok(P))    name = Lexeme(Tok(P))    IsPunc(Tok(Advance(P)), ":")    Γ ⊢ ParseType(Advance(Advance(P))) ⇓ (P_1, ty)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseSharedDep(P) ⇓ (P_1, ⟨name, ty⟩)
```

#### 13.11.3 AST Representation / Form

Type = … | TypeClosure(params, ret, deps_opt) | …

```text
deps_opt = ⊥ ∨ deps_opt = ⟨[⟨name_1, T_1⟩, …, ⟨name_n, T_n⟩]⟩
```

Closure expressions, capture classification, closure invocation, and pipeline expressions are owned by §16.9. Chapter 19 consumes the dependency information carried by `TypeClosure(..., deps_opt)`.

#### 13.11.4 Static Semantics

**(WF-Closure)**

```text
T = TypeClosure(params, R, deps_opt)    ∀ ⟨m, T_i⟩ ∈ params, Γ ⊢ T_i wf    Γ ⊢ R wf    (deps_opt = ⊥ ∨ ∀ d ∈ deps_opt, Γ ⊢ TypeOf(d) wf)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T wf
```

**(T-Equiv-Closure)**

```text
T = TypeClosure([⟨m_1, T_1⟩, …, ⟨m_n, T_n⟩], R, D)    U = TypeClosure([⟨m_1, U_1⟩, …, ⟨m_n, U_n⟩], S, D)    ∀ i, Γ ⊢ T_i ≡ U_i    Γ ⊢ R ≡ S
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T ≡ U
```

**(Sub-Closure)**

```text
T = TypeClosure([⟨m_1, T_1⟩, …, ⟨m_n, T_n⟩], R, D)    U = TypeClosure([⟨m_1, U_1⟩, …, ⟨m_n, U_n⟩], S, D)    ∀ i, Γ ⊢ U_i <: T_i    Γ ⊢ R <: S
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T <: U
```

Closure-expression typing and dependency-set construction are defined in §16.9.4.

#### 13.11.5 Dynamic Semantics

```text
ClosureVal(env_ptr, code_ptr) defined ⇔ (env_ptr = null ∨ env_ptr ∈ Addr) ∧ code_ptr ∈ Symbol
```

Creation and invocation of closure values are defined in §16.9.5. Key acquisition for closures that capture `shared` bindings is defined in Chapter 19 and depends on the dependency set carried by `TypeClosure(..., deps_opt)`.

#### 13.11.6 Lowering

```text
ClosureRep = ⟨env_ptr: *imm u8, code_ptr: *imm u8⟩
```

**(Size-Closure)**
T = TypeClosure(params, R, deps_opt)
────────────────────────────────────────────

```text
Γ ⊢ sizeof(T) = 2 × PtrSize
```

**(Align-Closure)**
T = TypeClosure(params, R, deps_opt)
────────────────────────────────────────────

```text
Γ ⊢ alignof(T) = PtrAlign
```

**(Layout-Closure)**
T = TypeClosure(params, R, deps_opt)
────────────────────────────────────────────

```text
Γ ⊢ layout(T) ⇓ ⟨2 × PtrSize, PtrAlign⟩
```

Closure-expression lowering, closure environment layout, and captured-variable access lowering are defined in §16.9.6.

#### 13.11.7 Diagnostics

This section defines no additional named diagnostics beyond failures of closure-type parsing and well-formedness. Closure capture diagnostics are owned by §16.9.7; shared-dependency and closure-key diagnostics are owned by Chapter 19; spawn-body closure diagnostics are owned by Chapter 20.

### 13.12 Modal and Pointer Diagnostics Supplement

This section owns diagnostics for modal-state usage, modal widening, and pointer operations.

| Code         | Severity | Detection    | Condition                                                                                                                |
| ------------ | -------- | ------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `E-TYP-2050` | Error    | Compile-time | Modal type declares zero states                                                                                          |
| `E-TYP-2051` | Error    | Compile-time | Duplicate state name within modal type                                                                                   |
| `E-TYP-2052` | Error    | Compile-time | Field access for field not present in current state's payload                                                            |
| `E-TYP-2053` | Error    | Compile-time | Method invocation for method not available in current state                                                              |
| `E-TYP-2054` | Error    | Compile-time | State name collides with modal type name                                                                                 |
| `E-TYP-2055` | Error    | Compile-time | Transition body returns value not matching declared target state                                                         |
| `E-TYP-2056` | Error    | Compile-time | Transition invoked on value not of declared source state                                                                 |
| `E-TYP-2057` | Error    | Compile-time | Direct field access on general modal type without pattern matching                                                       |
| `E-TYP-2058` | Error    | Compile-time | Duplicate field name in modal state payload                                                                              |
| `E-TYP-2059` | Error    | Compile-time | Transition target state not declared in modal type                                                                       |
| `E-TYP-2060` | Error    | Compile-time | Non-exhaustive `if ... is { ... }` on general modal type                                                                 |
| `E-TYP-2061` | Error    | Compile-time | Duplicate method name in modal state                                                                                     |
| `E-TYP-2062` | Error    | Compile-time | Duplicate transition name in modal state                                                                                 |
| `E-TYP-2063` | Error    | Compile-time | State member visibility exceeds modal visibility                                                                         |
| `E-TYP-2064` | Error    | Compile-time | State member not visible in current scope                                                                                |
| `E-TYP-2065` | Error    | Compile-time | State method name conflicts with transition name in the same modal state                                                 |
| `E-TYP-2070` | Error    | Compile-time | Implicit widening on non-niche-layout-compatible type                                                                    |
| `E-TYP-2071` | Error    | Compile-time | `widen` applied to non-modal type                                                                                        |
| `E-TYP-2072` | Error    | Compile-time | `widen` applied to already-general modal type                                                                            |
| `E-TYP-2073` | Error    | Compile-time | Record literal whose type is `File@S`, `DirIter@S`, or `CancelToken@S` for any state `S` in the corresponding modal type |
| `W-SYS-4010` | Warning  | Compile-time | Modal widening involves large payload copy (>256 bytes)                                                                  |
| `E-TYP-2101` | Error    | Compile-time | Dereference of pointer in `@Null` state                                                                                  |
| `E-TYP-2102` | Error    | Compile-time | Dereference of pointer in `@Expired` state                                                                               |
| `E-TYP-2103` | Error    | Compile-time | Dereference of raw pointer outside `unsafe`                                                                              |
| `E-TYP-2104` | Error    | Compile-time | Address-of applied to non-place expression                                                                               |
