---
title: "Conformance and Notation"
description: "1. Conformance and Notation of the Ultraviolet language specification."
specSource: "../../Ultraviolet/SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T14:44:07.538Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## 1. Conformance and Notation

### 1.1 Conformance

**Conforming.**

```text
Conforming(P) ⇔ WF(P)
```

**WF.**

```text
WF(P) ⇔ ∃ Γ. Project(Γ) = P ∧ ∀ j ∈ ReqJudgments(P). Γ ⊢ j ⇓ ok
```

**ReqJudgments.**
ReqJudgments(P) = [Phase1Order(P), Phase2Order(P), Phase3Order(P), Phase4Order(P)]

**Phase1Order.**

```text
Γ ⊢ Phase1Order(P) ⇓ ok ⇔ ∃ Ms. Γ ⊢ ParseModules(P) ⇓ Ms
```

**Phase2Order.**

```text
Γ ⊢ Phase2Order(P) ⇓ ok ⇔ ∃ Ms, Ms_ct. Γ ⊢ ParseModules(P) ⇓ Ms ∧ Γ ⊢ ExecuteComptime(P, Ms) ⇓ Ms_ct
```

```text
Phase3Checks(P, Ms_ct, Ms_res) = [Γ_ct ⊢ ResolveModules(P_ct) ⇓ Ms_res, Γ_res ⊢ DeclTyping(Ms_res) ⇓ ok, Γ_res ⊢ MainCheck(P_res) ⇓ ok]
```

 where
  P_ct = ProjectView(P, Ms_ct)

```text
  Γ_ct = Γ[project ↦ P_ct]
```

  P_res = ProjectView(P, Ms_res)

```text
  Γ_res = Γ[project ↦ P_res]
Phase3Order(P) ⇔ ∃ Ms, Ms_ct, Ms_res. Γ ⊢ ParseModules(P) ⇓ Ms ∧ Γ ⊢ ExecuteComptime(P, Ms) ⇓ Ms_ct ∧ FirstFail(Phase3Checks(P, Ms_ct, Ms_res)) = ⊥
```

**Phase4Order.**

```text
Γ ⊢ Phase4Order(P) ⇓ ok ⇔ ∃ Ms, Ms_ct, Ms_res, Objs, IRs, Artifact. Γ ⊢ ParseModules(P) ⇓ Ms ∧ Γ ⊢ ExecuteComptime(P, Ms) ⇓ Ms_ct ∧ FirstFail(Phase3Checks(P, Ms_ct, Ms_res)) = ⊥ ∧ P_res = ProjectView(P, Ms_res) ∧ Γ_res = Γ[project ↦ P_res] ∧ Γ_res ⊢ OutputPipeline(P_res) ⇓ (Objs, IRs, Artifact)
```

**Constructs.**

```text
TypeNodes(P, m) = { t | t ∈ Type ∧ Subnode(ASTModule(P, m), t) }
StmtNodes(P, m) = { s | s ∈ Stmt ∧ Subnode(ASTModule(P, m), s) }
```

ItemKind(UsingDecl(_, _, _, _, _)) = `using_decl`
ItemKind(ProcedureDecl(_, _, _, _, _, _, _, _, _, _, _)) = `procedure`
ItemKind(RecordDecl(_, _, _, _, _, _, _, _, _, _)) = `record`
ItemKind(EnumDecl(_, _, _, _, _, _, _, _, _, _)) = `enum`
ItemKind(ModalDecl(_, _, _, _, _, _, _, _, _, _)) = `modal`
ItemKind(ClassDecl(_, _, _, _, _, _, _, _, _, _)) = `class`
ItemKind(TypeAliasDecl(_, _, _, _, _, _, _, _)) = `type_alias`
ItemKind(StaticDecl(_, _, _, _, _, _)) = `static_decl`

```text
ItemKind(_) = ⊥
```

```text
TopDeclConstructs(P) = { ItemKind(it) | m ∈ P.modules ∧ it ∈ ASTModule(P, m).items ∧ ItemKind(it) ≠ ⊥ }
```

TypeCtor(TypePerm(_, base)) = TypeCtor(base)
TypeCtor(TypePrim(name)) = {name}

```text
TypeCtor(TypeTuple(elems)) = {`tuple`} ∪ ⋃_{t ∈ elems} TypeCtor(t)
TypeCtor(TypeArray(elem, _)) = {`array`} ∪ TypeCtor(elem)
TypeCtor(TypeSlice(elem)) = {`slice`} ∪ TypeCtor(elem)
TypeCtor(TypeUnion(members)) = {`union`} ∪ ⋃_{t ∈ members} TypeCtor(t)
TypeCtor(TypeFunc(params, ret)) = {`function`} ∪ ⋃_{⟨_, t⟩ ∈ params} TypeCtor(t) ∪ TypeCtor(ret)
```

TypeCtor(TypeApply(path, _)) = TypeCtor(TypePath(path))

```text
TypeCtor(TypePtr(elem, _)) = {`ptr`} ∪ TypeCtor(elem)
TypeCtor(TypeRawPtr(_, elem)) = {`rawptr`} ∪ TypeCtor(elem)
```

TypeCtor(TypeString(_)) = {`string`}
TypeCtor(TypeBytes(_)) = {`bytes`}
TypeCtor(TypeDynamic(_)) = {`dyn_class`}
TypeCtor(TypeOpaque(_)) = {`opaque`}

```text
TypeCtor(TypeRefine(base, _)) = {`refinement`} ∪ TypeCtor(base)
```

TypeCtor(TypeModalState(_, _)) = {`modal`}

```text
TypeCtor(TypeRange(base)) = {`range`} ∪ TypeCtor(base)
TypeCtor(TypeRangeInclusive(base)) = {`range_inclusive`} ∪ TypeCtor(base)
TypeCtor(TypeRangeFrom(base)) = {`range_from`} ∪ TypeCtor(base)
TypeCtor(TypeRangeTo(base)) = {`range_to`} ∪ TypeCtor(base)
TypeCtor(TypeRangeToInclusive(base)) = {`range_to_inclusive`} ∪ TypeCtor(base)
```

TypeCtor(TypeRangeFull) = {`range_full`}

```text
TypeCtor(TypeClosure(params, ret, _)) = {`closure`} ∪ ⋃_{⟨_, t⟩ ∈ params} TypeCtor(t) ∪ TypeCtor(ret)
```

TypeCtor(TypePath(["Region"])) = {`region`}
TypeCtor(TypePath(["RegionOptions"])) = {`region_options`}
TypeCtor(TypePath(p)) = {`record`} if RecordDecl(p) defined
TypeCtor(TypePath(p)) = {`enum`} if EnumDecl(p) defined
TypeCtor(_) = ∅

```text
TypeConstructs(P) = ⋃_{m ∈ P.modules} ⋃_{t ∈ TypeNodes(P, m)} TypeCtor(t)
```

PermOfType(TypePerm(p, _)) = {p}
PermOfType(_) = ∅

```text
RecvPerms(members) = { p | ∃ attrs, vis, ov, name, gen_params, recv, params, ret, contract, body, span, doc. MethodDecl(attrs, vis, ov, name, gen_params, recv, params, ret, contract, body, span, doc) ∈ members ∧ recv = ReceiverShorthand(p) }
ClassRecvPerms(items) = { p | ∃ attrs, vis, name, gen_params, recv, params, ret, contract, body, span, doc. ClassMethodDecl(attrs, vis, name, gen_params, recv, params, ret, contract, body, span, doc) ∈ items ∧ recv = ReceiverShorthand(p) }
StateRecvPerms(states) = { p | ∃ S, members, span, doc, attrs, vis, name, gen_params, recv, params, ret, contract, body. StateBlock(S, members, span, doc) ∈ states ∧ StateMethodDecl(attrs, vis, name, gen_params, recv, params, ret, contract, body, _, _) ∈ members ∧ recv = ReceiverShorthand(p) }
PermConstructs(P) = ⋃_{m ∈ P.modules} ⋃_{t ∈ TypeNodes(P, m)} PermOfType(t) ∪ ⋃_{m ∈ P.modules} ⋃_{RecordDecl(_, _, _, _, _, _, members, _, _, _) ∈ ASTModule(P, m).items} RecvPerms(members) ∪ ⋃_{m ∈ P.modules} ⋃_{ModalDecl(_, _, _, _, _, _, states, _, _, _) ∈ ASTModule(P, m).items} StateRecvPerms(states) ∪ ⋃_{m ∈ P.modules} ⋃_{ClassDecl(_, _, _, _, _, _, _, items, _, _) ∈ ASTModule(P, m).items} ClassRecvPerms(items)
```

ExprKind(Literal(_)) = `literal`
ExprKind(Identifier(_)) = `identifier`
ExprKind(FieldAccess(_, _)) = `field_access`
ExprKind(TupleAccess(_, _)) = `tuple_index`
ExprKind(IndexAccess(_, _)) = `index`
ExprKind(IfExpr(_, _, _)) = `if`
ExprKind(IfIsExpr(_, _, _, _)) = `if`
ExprKind(IfCaseExpr(_, _, _)) = `if`
ExprKind(LoopInfinite(_, _)) = `loop`
ExprKind(LoopConditional(_, _, _)) = `loop`
ExprKind(LoopIter(_, _, _, _, _)) = `loop`
ExprKind(MoveExpr(_)) = `move`
ExprKind(Unary(`"widen"`, _)) = `widen`
ExprKind(TransmuteExpr(_, _, _)) = `transmute`
ExprKind(UnsafeBlockExpr(_)) = `unsafe`
ExprKind(AllocExpr(_, _)) = `region_alloc`
ExprKind(MethodCall(_, _, _)) = `method_call`
ExprKind(Propagate(_)) = `union_propagate`
ExprKind(ParallelExpr(_, _, _)) = `parallel`
ExprKind(SpawnExpr(_, _)) = `spawn`
ExprKind(DispatchExpr(_, _, _, _, _)) = `dispatch`
ExprKind(WaitExpr(_)) = `wait`
ExprKind(YieldExpr(_, _)) = `yield`
ExprKind(YieldFromExpr(_, _)) = `yield`
ExprKind(SyncExpr(_)) = `sync`
ExprKind(RaceExpr(_)) = `race`
ExprKind(AllExpr(_)) = `all`

```text
ExprKind(_) = ⊥
```

StmtKind(LetStmt(_)) = `let`
StmtKind(VarStmt(_)) = `var`
StmtKind(UsingLocalStmt(_, _, _)) = `using`
StmtKind(AssignStmt(_, _)) = `assign`
StmtKind(CompoundAssignStmt(_, _, _)) = `compound_assign`
StmtKind(DeferStmt(_)) = `defer`
StmtKind(RegionStmt(_, _, _)) = `region`
StmtKind(FrameStmt(_, _)) = `frame`
StmtKind(KeyBlockStmt(_, _, _, _, _, _)) = `key_block`
StmtKind(ReturnStmt(_)) = `return`
StmtKind(BreakStmt(_)) = `break`
StmtKind(ContinueStmt) = `continue`
StmtKind(UnsafeBlockStmt(_)) = `unsafe`

```text
StmtKind(_) = ⊥
```

```text
ExprStmtConstructs(P) = { ExprKind(e) | m ∈ P.modules ∧ e ∈ ExprNodes(P, m) ∧ ExprKind(e) ≠ ⊥ } ∪ { StmtKind(s) | m ∈ P.modules ∧ s ∈ StmtNodes(P, m) ∧ StmtKind(s) ≠ ⊥ }
```

```text
CapConstructs(P) = { c | c ∈ {`Context`, `FileSystem`, `Network`, `HeapAllocator`, `ExecutionDomain`, `Reactor`} ∧ ∃ m, t. m ∈ P.modules ∧ t ∈ TypeNodes(P, m) ∧ t = TypePath([c]) }
```

```text
Constructs(P) = TopDeclConstructs(P) ∪ TypeConstructs(P) ∪ PermConstructs(P) ∪ ExprStmtConstructs(P) ∪ CapConstructs(P)
```

**(Reject-IllFormed)**

```text
¬ Conforming(P)
```

─────────────────

```text
Γ ⊢ Reject(P)
```

**TranslationPhases.**
TranslationPhases = [Phase1, Phase2, Phase3, Phase4]

### 1.2 Behavior Types

**IllFormed.**

```text
StaticJudgSet = WFModulePathJudg ∪ LinkJudg ∪ ParseJudgment ∪ ResolvePathJudg ∪ ResolveExprListJudg ∪ ResolveEnumPayloadJudg ∪ ResolveCalleeJudg ∪ ResolveIfCaseJudg ∪ ResolveStmtSeqJudg ∪ TypeEqJudg ∪ ConstLenJudg ∪ SubtypingJudg ∪ PermAdmitsJudg ∪ ArgsOkTJudg ∪ TypeInfJudg ∪ StmtJudg ∪ PatJudg ∪ ExprJudg ∪ CaseJudg ∪ DeclJudg ∪ BJudgment ∪ ArgPassJudg ∪ ProvPlaceJudg ∪ ProvExprJudg ∪ ProvStmtJudg ∪ BlockProvJudg ∪ ArgsOkJudg ∪ TypeWFJudg ∪ StringBytesJudg ∪ BitcopyDropJudg ∪ BitcopyJudg ∪ CloneJudg ∪ DropJudg ∪ FfiSafeJudg ∪ TypeRefsJudg ∪ ValueRefsJudg ∪ CodegenJudg ∪ LayoutJudg ∪ EncodeConstJudg ∪ ValidValueJudg ∪ RecordLayoutJudg ∪ UnionLayoutJudg ∪ TupleLayoutJudg ∪ RangeLayoutJudg ∪ EnumLayoutJudg ∪ ModalLayoutJudg ∪ DynLayoutJudg ∪ ABITyJudg ∪ ABIParamJudg ∪ ABIRetJudg ∪ ABICallJudg ∪ LowerCallJudg ∪ MangleJudg ∪ LinkageJudg ∪ EvalOrderJudg ∪ LowerExprJudg ∪ LowerStmtJudg ∪ PatternLowerJudg ∪ LowerBindJudg ∪ GlobalsJudg ∪ ConstInitJudg ∪ CleanupJudg ∪ RuntimeIfcJudg ∪ DynDispatchJudg ∪ ChecksJudg ∪ LLVMAttrJudg ∪ RuntimeDeclJudg ∪ LLVMTyJudg ∪ LLVMEmitJudg ∪ LowerIRJudg ∪ BindStorageJudg ∪ LLVMCallJudg ∪ VTableJudg ∪ LiteralEmitJudg ∪ BuiltinSymJudg ∪ DropHookJudg ∪ EntryJudg ∪ PoisonJudg
StaticRuleSet = { r | Conclusion(r) ∈ StaticJudgSet }
Conclusion(r) = J    (r is written (π_1 … π_k) / J)
Premises(r) = [π_1, …, π_k]    (r is written (π_1 … π_k) / _)
Subject(Γ ⊢ j) = j_0 where j_0 is the leftmost term to the right of ⊢
EnvOf(Γ ⊢ j) = Γ
θ ranges over substitutions of metavariables in r
Applies(r, x) ⇔ ∃ θ. Subject(Conclusion(r)[θ]) = x
PremisesHold(r, x) ⇔ ∃ θ. Subject(Conclusion(r)[θ]) = x ∧ Γ_r = EnvOf(Conclusion(r)[θ]) ∧ ∀ π ∈ Premises(r)[θ]. π ≠ ⊥ ∧ (π is a judgment ⇒ Γ_r ⊢ π)
IllFormed(x) ⇔ ∃ r ∈ StaticRuleSet. Applies(r, x) ∧ ¬ PremisesHold(r, x)
```

**Undefinedness Policy.**

```text
StaticUndefined(J) ⇔ ∃ r. Conclusion(r) = J ∧ ∃ π ∈ Premises(r). π = ⊥
```

```text
RuleId(r) = id ⇔ r is labeled (id)
DiagIdOf(J) = id ⇔ ∃ r. Conclusion(r) = J ∧ RuleId(r) = id
DiagIdOf(J) = ⊥ ⇔ ¬ ∃ r. Conclusion(r) = J ∧ RuleId(r) defined
SectionId(r) ∈ String
RulesIn(Σ) = { r | SectionId(r) ∈ Σ }
```

**(Static-Undefined)**
StaticUndefined(J)    Code(DiagIdOf(J)) = c
───────────────────────────────────────

```text
Γ ⊢ J ⇑ c
```

**(Static-Undefined-NoCode)**

```text
StaticUndefined(J)    Code(DiagIdOf(J)) = ⊥
```

────────────────────────────────────────

```text
Γ ⊢ J ⇑
```

**OutsideConformance.**
If OutsideConformance holds, this specification imposes no requirements on observable behavior, diagnostics, or termination. Implementations MAY exhibit any behavior.

**Static vs. Runtime Checks.**
CheckKind = {PatternExhaustiveness, TypeCompatibility, PermissionViolations, ProvenanceEscape, ArrayBounds, SafePointerValidity, IntegerOverflow, SliceBounds, IntDivisionByZero}

StaticCheck = {PatternExhaustiveness, TypeCompatibility, PermissionViolations, ProvenanceEscape, ArrayBounds, SafePointerValidity}
RuntimeCheck = {IntegerOverflow, SliceBounds, IntDivisionByZero}

RuntimeBehavior(IntegerOverflow) = Panic
RuntimeBehavior(SliceBounds) = Panic
RuntimeBehavior(IntDivisionByZero) = Panic

```text
ResourceExhaustion ⇒ OutsideConformance
```

**Error Recovery.**
LexRecovery = SkipToNextTokenStart
ParseRecovery = SyncSet({`;`, `}`, `EOF`})
TypeRecovery = ContinueDecls

```text
MaxErrorCount ∈ ℕ ∪ {∞}
```

SuggestedMaxErrorCount = 100

```text
AbortOnErrorCount(n) ⇔ n ≥ MaxErrorCount
```

### 1.3 Document Conventions

**NormativeKeywords.**
NormativeKeywords = {`MUST`, `MUST NOT`, `SHOULD`, `SHOULD NOT`, `MAY`}

**RFC 2119 Interpretation.**
The keywords in NormativeKeywords MUST be interpreted as described in RFC 2119.

**DiagnosticCodeFormat.**
DiagPrefix = {E, W, I, P}
DiagCategory = [A-Z]^3
DiagDigits = [0-9]^4
DiagCode = DiagPrefix ++ "-" ++ DiagCategory ++ "-" ++ DiagDigits
Bucket(Digits) = Digits[0..1]
Seq(Digits) = Digits[2..3]

### 1.4 Normative References

**NormativeRefs.**
This specification relies on the following external documents:

| Reference | Document                                                           | Usage                                                                                     |
| --------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| [RFC2119] | RFC 2119: Key words for use in RFCs to Indicate Requirement Levels | Normative keyword interpretation (§1.3)                                                   |
| [UNICODE] | The Unicode Standard, Version 15.0.0                               | Source text encoding (§4.1), identifier normalization (§4.1.6), escape sequences (§4.2.6) |
| [IEEE754] | IEEE 754-2019: Standard for Floating-Point Arithmetic              | Float literal semantics (§16.1), float type representation (§24.2.1)                      |
| [LLVM21]  | LLVM Language Reference Manual, Version 21                         | Backend target and IR requirements (§24.1, §24.7)                                         |

**Reference Details.**
[RFC2119] Bradner, S., "Key words for use in RFCs to Indicate Requirement Levels", BCP 14, RFC 2119, March 1997. https://www.rfc-editor.org/rfc/rfc2119

[UNICODE] The Unicode Consortium. The Unicode Standard, Version 15.0.0, (Mountain View, CA: The Unicode Consortium, 2022). https://www.unicode.org/versions/Unicode15.0.0/

[IEEE754] IEEE. "IEEE Standard for Floating-Point Arithmetic," IEEE Std 754-2019, July 2019.

[LLVM21] LLVM Project. "LLVM Language Reference Manual," Version 21. https://llvm.org/docs/LangRef.html

**Conformance.**
A conforming implementation MUST implement the features of the referenced standards as specified in this document. Where this specification differs from a referenced standard, this specification takes precedence.

### 1.5 Compile-Time Execution and Phase Ordering

TranslationPhases = [Phase1, Phase2, Phase3, Phase4]
Phase1 = ParseAndAggregate
Phase2 = ExecuteComptime
Phase3 = ResolveAndTypecheck
Phase4 = LowerAndEmit

```text
Γ ⊢ ExecuteComptime(P, Ms) ⇓ Ms_ct ⇔ Γ ⊢ ComptimePass(P, Ms) ⇓ Ms_ct
```

1. Phase 1 MUST parse and aggregate all modules before Phase 2 begins.
2. Phase 2 MUST execute all compile-time forms over the Phase 1 module set in deterministic dependency order.
3. Any declaration emitted during Phase 2 MUST be incorporated into the module set before Phase 3 begins.
4. Phase 3 MUST resolve names and discharge static semantics against the Phase 2-expanded module set.
5. Phase 4 MUST lower and emit only the program accepted by Phase 3.

The syntax and semantics of compile-time forms are defined by Chapter 22.

### 1.6 Target and ABI Assumptions

TargetProfile = {`x86_64-sysv`, `x86_64-win64`, `aarch64-aapcs64`}

```text
SelectedTargetProfile ∈ TargetProfile
```

The selected target profile is resolved once per compilation invocation.
Resolution order is:
1. the explicit CLI target-profile override, if provided;
2. otherwise `toolchain.target_profile` from `Ultraviolet.toml`, if provided;
3. otherwise the compilation invocation is ill-formed.
A conforming implementation MUST NOT silently infer `SelectedTargetProfile` from the host platform.

TargetArch(`x86_64-sysv`) = `x86_64`
TargetArch(`x86_64-win64`) = `x86_64`
TargetArch(`aarch64-aapcs64`) = `aarch64`

Endianness = Little
PtrSizeBytes = PtrSize

Target(`x86_64-sysv`) = "x86_64-unknown-linux-gnu"
Target(`x86_64-win64`) = "x86_64-pc-windows-msvc"
Target(`aarch64-aapcs64`) = "aarch64-unknown-linux-gnu"

Layout and ABI requirements are defined only by their canonical owner sections in this document, especially Chapters 12, 13, 14.6, and 23.2. The source-draft bundle name `LayoutSpec` is not a separate normative relation in this reorganization.
