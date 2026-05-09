---
title: "Common Lowering, Program Lifecycle, and Backend"
description: "24. Common Lowering, Program Lifecycle, and Backend of the Ultraviolet language specification."
specSource: "../../Ultraviolet/SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T14:44:07.538Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## 24. Common Lowering, Program Lifecycle, and Backend

### 24.1 Shared Lowering Judgments

Feature-local lowering rules are defined by the owning feature sections in Chapters 12 through 22. This section defines only the shared lowering interface, correctness obligations, and project/module composition rules used by those feature-owned derivations.

#### 24.1.1 Codegen Model and Targets

```text
ArtifactsOf(P) = Set(Objs) ∪ Set(IRs) ∪ ({Artifact} if Artifact ≠ ⊥ else ∅) ⇔ Γ ⊢ OutputPipeline(P) ⇓ (Objs, IRs, Artifact)
```

IRTarget = "LLVM-21.1.8"
ObjTarget = ObjFormatOf(SelectedTargetProfile)

```text
LLVMValid_21.1.8(L) ⇔ L ∈ LLVMIR_21.1.8
∀ IR, L. Γ ⊢ LowerIR(IR) ⇓ L ⇒ LLVMValid_21.1.8(L)
```

#### 24.1.2 Shared Judgments and Correctness

CodegenJudg = {CodegenProject, CodegenModule, CodegenItem, CodegenExpr, CodegenStmt, CodegenBlock, CodegenPlace}

```text
IRDefined(IR) ⇔ ∀ σ. ∃ out, σ'. ExecIRSigma(IR, σ) ⇓ (out, σ')
```

```text
CodegenExprValCorrect ⇔ ∀ e, IR, v, σ, v', σ'. (Γ ⊢ CodegenExpr(e) ⇓ ⟨IR, v⟩ ∧ Γ ⊢ EvalSigma(e, σ) ⇓ (Val(v'), σ')) ⇒ (ExecIRSigma(IR, σ) ⇓ (Val(v'), σ') ∧ v = v')
CodegenExprCtrlCorrect ⇔ ∀ e, IR, v, σ, κ, σ'. (Γ ⊢ CodegenExpr(e) ⇓ ⟨IR, v⟩ ∧ Γ ⊢ EvalSigma(e, σ) ⇓ (Ctrl(κ), σ')) ⇒ ExecIRSigma(IR, σ) ⇓ (Ctrl(κ), σ')
CodegenStmtCorrect ⇔ ∀ s, IR, σ, sout, σ'. (Γ ⊢ CodegenStmt(s) ⇓ IR ∧ Γ ⊢ ExecSigma(s, σ) ⇓ (sout, σ')) ⇒ ExecIRSigma(IR, σ) ⇓ (sout, σ')
CodegenBlockValCorrect ⇔ ∀ b, IR, v, σ, v', σ'. (Γ ⊢ CodegenBlock(b) ⇓ ⟨IR, v⟩ ∧ Γ ⊢ EvalBlockSigma(b, σ) ⇓ (Val(v'), σ')) ⇒ (ExecIRSigma(IR, σ) ⇓ (Val(v'), σ') ∧ v = v')
CodegenBlockCtrlCorrect ⇔ ∀ b, IR, v, σ, κ, σ'. (Γ ⊢ CodegenBlock(b) ⇓ ⟨IR, v⟩ ∧ Γ ⊢ EvalBlockSigma(b, σ) ⇓ (Ctrl(κ), σ')) ⇒ ExecIRSigma(IR, σ) ⇓ (Ctrl(κ), σ')
```

```text
CodegenCorrect ⇔ CodegenExprValCorrect ∧ CodegenExprCtrlCorrect ∧ CodegenStmtCorrect ∧ CodegenBlockValCorrect ∧ CodegenBlockCtrlCorrect
CodegenUndefined ⇔ ∃ e, IR, v. Γ ⊢ CodegenExpr(e) ⇓ ⟨IR, v⟩ ∧ ¬ IRDefined(IR) ∨ ∃ s, IR. Γ ⊢ CodegenStmt(s) ⇓ IR ∧ ¬ IRDefined(IR) ∨ ∃ b, IR, v. Γ ⊢ CodegenBlock(b) ⇓ ⟨IR, v⟩ ∧ ¬ IRDefined(IR)
CodegenUndefined ⇒ OutsideConformance
```

#### 24.1.3 IR Forms and Composition

IRDecls = [IRDecl]
ModuleIR = IRDecls

```text
LLVMEmitJudg = {LowerIR(ModuleIR) ⇓ LLVMIR, EmitLLVM(LLVMIR) ⇓ bytes, EmitObj(LLVMIR) ⇓ bytes}
```

```text
Γ ⊢ CodegenItem(item) ⇓ ds ⇒ ds ∈ IRDecls
ProcIR : Symbol × [Param] × Type × IR → IRDecl
```

```text
PanicOutParam = ⟨`move`, PanicOutName, PanicOutType⟩
```

CodegenParams(params) = params ++ [PanicOutParam]

```text
MethodParams(R, m) = [⟨RecvMode(m.receiver), `self`, RecvType(Self_R, m.receiver)⟩] ++ m.params
ClassMethodParams(Cl, m) = [⟨RecvMode(m.receiver), `self`, RecvType(SelfVar, m.receiver)⟩] ++ m.params
ParamList_T(T, params) = [⟨mode_i, name_i, SubstSelf(T, ty_i)⟩ | ⟨mode_i, name_i, ty_i⟩ ∈ params]
ClassMethodParams_T(T, m) = [⟨RecvMode(m.receiver), `self`, RecvType(T, m.receiver)⟩] ++ ParamList_T(T, m.params)
StateMethodParams(M, S, md) = [⟨RecvMode(md.receiver), `self`, RecvType(TypeModalState(ModalPath(M), S), md.receiver)⟩] ++ md.params
TransitionParams(M, S, tr) = [⟨`move`, `self`, TypePerm(`unique`, TypeModalState(ModalPath(M), S))⟩] ++ tr.params
```

```text
SeqIR() = ε
```

SeqIR(IR) = IR

```text
SeqIR(IR_1, …, IR_n) = SeqIR(IR_1, SeqIR(IR_2, …, IR_n))    (n ≥ 2)
```

EvalOrderJudg = {Children_LTR}

ArgsExprs([]) = []

```text
ArgsExprs([⟨moved, e, span⟩] ++ rest) = [e] ++ ArgsExprs(rest)
```

FieldExprs([]) = []

```text
FieldExprs([⟨f, e⟩] ++ rest) = [e] ++ FieldExprs(rest)
```

```text
OptExprs(⊥, ⊥) = []
OptExprs(e, ⊥) = [e]
OptExprs(⊥, e) = [e]
```

OptExprs(e_1, e_2) = [e_1, e_2]

ParallelOptExprs([]) = []
ParallelOptExprs(Cancel(e) :: os) = [e] ++ ParallelOptExprs(os)
ParallelOptExprs(Name(_) :: os) = ParallelOptExprs(os)

SpawnOptExprs([]) = []
SpawnOptExprs(Name(_) :: os) = SpawnOptExprs(os)
SpawnOptExprs(Affinity(e) :: os) = [e] ++ SpawnOptExprs(os)
SpawnOptExprs(Priority(e) :: os) = [e] ++ SpawnOptExprs(os)

DispatchOptExprs([]) = []
DispatchOptExprs(Reduce(_) :: os) = DispatchOptExprs(os)
DispatchOptExprs(Ordered :: os) = DispatchOptExprs(os)
DispatchOptExprs(Chunk(e) :: os) = [e] ++ DispatchOptExprs(os)

KeySegExprs([]) = []
KeySegExprs(Field(_, _) :: ss) = KeySegExprs(ss)
KeySegExprs(Index(_, e) :: ss) = [e] ++ KeySegExprs(ss)

```text
KeyPathExprs(⟨root, segs⟩) = KeySegExprs(segs)
KeyClauseExprs(⊥) = []
KeyClauseExprs(⟨path, mode⟩) = KeyPathExprs(path)
```

RaceArmExprs([]) = []

```text
RaceArmExprs(⟨e, _, _⟩ :: as) = [e] ++ RaceArmExprs(as)
```

Children_LTR(Literal(ℓ)) = []
Children_LTR(PtrNullExpr) = []
Children_LTR(Identifier(x)) = []
Children_LTR(Path(path, name)) = []
Children_LTR(TupleExpr(es)) = es
Children_LTR(ArrayExpr(es)) = es
Children_LTR(RecordExpr(tr, fields)) = FieldExprs(fields)

```text
Children_LTR(EnumLiteral(path, ⊥)) = []
```

Children_LTR(EnumLiteral(path, Paren(es))) = es
Children_LTR(EnumLiteral(path, Brace(fields))) = FieldExprs(fields)
Children_LTR(FieldAccess(base, f)) = [base]
Children_LTR(TupleAccess(base, i)) = [base]
Children_LTR(IndexAccess(base, idx)) = [base, idx]
Children_LTR(Call(callee, args)) = [callee] ++ ArgsExprs(args)
Children_LTR(CallTypeArgs(callee, type_args, args)) = [callee] ++ ArgsExprs(args)
Children_LTR(MethodCall(base, name, args)) = [base] ++ ArgsExprs(args)
Children_LTR(Unary(op, e)) = [e]
Children_LTR(Binary(op, e_1, e_2)) = [e_1, e_2]
Children_LTR(Cast(e, T)) = [e]
Children_LTR(TransmuteExpr(T_1, T_2, e)) = [e]
Children_LTR(Propagate(e)) = [e]
Children_LTR(Range(kind, lo_opt, hi_opt)) = OptExprs(lo_opt, hi_opt)
Children_LTR(IfExpr(cond, b1, b2)) = [cond]
Children_LTR(IfIsExpr(scrut, _, _, _)) = [scrut]
Children_LTR(IfCaseExpr(scrut, _, _)) = [scrut]

```text
LoopInvExprs(⊥) = []
```

LoopInvExprs(inv) = [inv]
Children_LTR(LoopInfinite(inv_opt, body)) = LoopInvExprs(inv_opt) ++ [body]
Children_LTR(LoopConditional(cond, inv_opt, body)) = [cond] ++ LoopInvExprs(inv_opt) ++ [body]
Children_LTR(LoopIter(pat, ty_opt, iter, inv_opt, body)) = [iter] ++ LoopInvExprs(inv_opt) ++ [body]
Children_LTR(BlockExpr(stmts, tail_opt)) = []
Children_LTR(UnsafeBlockExpr(b)) = []
Children_LTR(MoveExpr(p)) = []
Children_LTR(AddressOf(p)) = []
Children_LTR(Deref(e)) = [e]
Children_LTR(AllocExpr(r_opt, e)) = [e]
Children_LTR(ParallelExpr(domain, opts, body)) = [domain] ++ ParallelOptExprs(opts)
Children_LTR(SpawnExpr(opts, body)) = SpawnOptExprs(opts)
Children_LTR(DispatchExpr(pat, range, key_clause_opt, opts, body)) = [range] ++ KeyClauseExprs(key_clause_opt) ++ DispatchOptExprs(opts)

LowerExprJudg = {LowerExpr, LowerUnOp, LowerBinOp, LowerCast, LowerList, LowerFieldInits, LowerOpt, LowerReadPlace, LowerWritePlace, LowerMovePlace, LowerAddrOf, LowerPlace}

```text
RetType(Γ) = R ⇔ ProcRet(Γ) = R
```

**(Lower-Expr-Correctness)**

```text
∀ σ, Γ ⊢ EvalSigma(e, σ) ⇓ (out, σ') ⇒ ExecIRSigma(IR, σ) ⇓ (out, σ')
```

──────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(e) ⇓ ⟨IR, v⟩
```

ExprForms0 = {Literal(_), PtrNullExpr, Identifier(_), Path(_, _), ErrorExpr(_), TupleExpr(_), ArrayExpr(_), RecordExpr(_, _), EnumLiteral(_, _), FieldAccess(_, _), TupleAccess(_, _), IndexAccess(_, _), Call(_, _), MethodCall(_, _, _), Unary(_, _), Binary(_, _, _), Cast(_, _), TransmuteExpr(_, _, _), Propagate(_), Range(_, _, _), IfExpr(_, _, _), IfIsExpr(_, _, _, _), IfCaseExpr(_, _, _), LoopInfinite(_, _), LoopConditional(_, _, _), LoopIter(_, _, _, _, _), BlockExpr(_, _), UnsafeBlockExpr(_), MoveExpr(_), AddressOf(_), Deref(_), AllocExpr(_, _)}

```text
LowerExprTotal(Γ) ⇔ ∀ e. e ∈ ExprForms0 ⇒ ∃ IR, v. Γ ⊢ LowerExpr(e) ⇓ ⟨IR, v⟩
```

ExecIRJudg = {ExecIRSigma, MoveStateSigma}

**(ExecIR-ReadVar)**

```text
LookupVal(σ, x) = v
```

──────────────────────────────────────────────────────────────

```text
ExecIRSigma(ReadVarIR(x), σ) ⇓ (Val(v), σ)
```

**(ExecIR-ReadPath)**

```text
LookupValPath(σ, path, name) = v
```

──────────────────────────────────────────────────────────────────────

```text
ExecIRSigma(ReadPathIR(path, name), σ) ⇓ (Val(v), σ)
```

**(ExecIR-StoreVar)**

```text
Γ ⊢ WritePlaceSigma(Identifier(x), v, σ) ⇓ (sout, σ')
```

─────────────────────────────────────────────────────────────────────────────

```text
ExecIRSigma(StoreVarIR(x, v), σ) ⇓ (sout, σ')
```

**(ExecIR-StoreVarNoDrop)**

```text
Γ ⊢ WritePlaceSubSigma(Identifier(x), v, σ) ⇓ (sout, σ')
```

──────────────────────────────────────────────────────────────────────────────────

```text
ExecIRSigma(StoreVarNoDropIR(x, v), σ) ⇓ (sout, σ')
```

**(ExecIR-BindVar)**

```text
BindVal(σ, x, v) ⇓ (σ', b)
```

─────────────────────────────────────────────────────────────

```text
ExecIRSigma(BindVarIR(x, v), σ) ⇓ (ok, σ')
```

**(ExecIR-ReadPtr)**

```text
Γ ⊢ ReadPtrSigma(v_ptr, σ) ⇓ (out, σ')
```

──────────────────────────────────────────────────────────────

```text
ExecIRSigma(ReadPtrIR(v_ptr), σ) ⇓ (out, σ')
```

**(ExecIR-WritePtr)**

```text
Γ ⊢ WritePtrSigma(v_ptr, v, σ) ⇓ (sout, σ')
```

────────────────────────────────────────────────────────────────

```text
ExecIRSigma(WritePtrIR(v_ptr, v), σ) ⇓ (sout, σ')
```

```text
AllocTarget(σ, ⊥) = ActiveTarget(σ)
AllocTarget(σ, r) = ResolveTarget(σ, r)
```

**(ExecIR-Alloc)**

```text
AllocTarget(σ, r_opt) = r    RegionAlloc(σ, r, v) ⇓ (σ', v')
```

──────────────────────────────────────────────────────────────────────────────

```text
ExecIRSigma(AllocIR(r_opt, v), σ) ⇓ (Val(v'), σ')
```

**(MoveState-Root)**

```text
PlaceRoot(p) = x    FieldHead(p) = ⊥    LookupBind(σ, x) = b    SetState(σ, b, Moved) ⇓ σ'
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ MoveStateSigma(p, σ) ⇓ σ'
```

**(MoveState-Field)**

```text
PlaceRoot(p) = x    FieldHead(p) = f    LookupBind(σ, x) = b    BindState(σ, b) = s    PM(s, f) = s'    SetState(σ, b, s') ⇓ σ'
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ MoveStateSigma(p, σ) ⇓ σ'
```

**(ExecIR-MoveState)**

```text
Γ ⊢ MoveStateSigma(p, σ) ⇓ σ'
```

──────────────────────────────────────────────────────────────

```text
ExecIRSigma(MoveStateIR(p), σ) ⇓ (ok, σ')
```

```text
ExecIRSigma(ReturnIR(v), σ) ⇓ (Ctrl(Return(v)), σ)
ExecIRSigma(TailValueIR(v), σ) ⇓ (Ctrl(TailValue(v)), σ)
ExecIRSigma(BreakIR(v_opt), σ) ⇓ (Ctrl(Break(v_opt)), σ)
ExecIRSigma(ContinueIR, σ) ⇓ (Ctrl(Continue), σ)
```

**(ExecIR-Defer)**

```text
AppendCleanup(σ, DeferBlock(b)) ⇓ σ'
```

──────────────────────────────────────────────────────────────

```text
ExecIRSigma(DeferIR(b), σ) ⇓ (ok, σ')
```

```text
ExecBlockBodyIRSigma(IR_s, IR_t, σ) ⇓ (out, σ') ⇔ ExecIRSigma(IR_s, σ) ⇓ (sout, σ_1) ∧ ((sout = ok ∧ IR_t = ε ∧ out = Val(()) ∧ σ' = σ_1) ∨ (sout = ok ∧ ExecIRSigma(IR_t, σ_1) ⇓ (out, σ')) ∨ (sout = Ctrl(TailValue(v)) ∧ out = Val(v) ∧ σ' = σ_1) ∨ (sout = Ctrl(κ) ∧ κ ≠ TailValue(_) ∧ out = Ctrl(κ) ∧ σ' = σ_1))
Γ ⊢ ExecInScopeIRSigma(IR_b, σ, scope) ⇓ (out, σ') ⇔ CurrentScopeId(σ) = scope ∧ ExecIRSigma(IR_b, σ) ⇓ (out, σ')
Γ ⊢ ExecBlockBindIRSigma(pat, v, IR_b, σ) ⇓ (out', σ'') ⇔ BindPatternVal(pat, v) ⇓ B ∧ BindOrder(pat, B) = binds ∧ BlockEnter(σ, binds) ⇓ (σ_1, scope) ∧ ExecIRSigma(IR_b, σ_1) ⇓ (out, σ_2) ∧ BlockExit(σ_2, scope, out) ⇓ (out', σ'')
```

**(ExecIR-If-True)**

```text
v_c = true    ExecIRSigma(IR_t, σ) ⇓ (out, σ')
```

──────────────────────────────────────────────────────────────────────────────────────────

```text
ExecIRSigma(IfIR(v_c, IR_t, v_t, IR_f, v_f), σ) ⇓ (out, σ')
```

**(ExecIR-If-False)**

```text
v_c = false    ExecIRSigma(IR_f, σ) ⇓ (out, σ')
```

──────────────────────────────────────────────────────────────────────────────────────────

```text
ExecIRSigma(IfIR(v_c, IR_t, v_t, IR_f, v_f), σ) ⇓ (out, σ')
```

**(ExecIR-Block)**

```text
BlockEnter(σ, []) ⇓ (σ_1, scope)    ExecBlockBodyIRSigma(IR_s, IR_t, σ_1) ⇓ (out, σ_2)    BlockExit(σ_2, scope, out) ⇓ (out', σ_3)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
ExecIRSigma(BlockIR(IR_s, IR_t, v_t), σ) ⇓ (out', σ_3)
```

**(ExecIR-IfCase)**

```text
Γ ⊢ EvalIfCaseListSigma(cases, else_opt, v_s, σ) ⇓ (out, σ')
```

──────────────────────────────────────────────────────────────────────────────

```text
ExecIRSigma(IfCaseIR(v_s, cases, else_opt), σ) ⇓ (out, σ')
```

**(ExecIR-Loop-Infinite-Step)**

```text
ExecIRSigma(IR_b, σ) ⇓ (Val(v), σ_1)    ExecIRSigma(LoopIR(LoopInfinite, IR_b, v_b), σ_1) ⇓ (out, σ_2)
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
ExecIRSigma(LoopIR(LoopInfinite, IR_b, v_b), σ) ⇓ (out, σ_2)
```

**(ExecIR-Loop-Infinite-Continue)**

```text
ExecIRSigma(IR_b, σ) ⇓ (Ctrl(Continue), σ_1)    ExecIRSigma(LoopIR(LoopInfinite, IR_b, v_b), σ_1) ⇓ (out, σ_2)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
ExecIRSigma(LoopIR(LoopInfinite, IR_b, v_b), σ) ⇓ (out, σ_2)
```

**(ExecIR-Loop-Infinite-Break)**

```text
ExecIRSigma(IR_b, σ) ⇓ (Ctrl(Break(v_opt)), σ_1)    v = BreakVal(v_opt)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
ExecIRSigma(LoopIR(LoopInfinite, IR_b, v_b), σ) ⇓ (Val(v), σ_1)
```

**(ExecIR-Loop-Infinite-Ctrl)**

```text
ExecIRSigma(IR_b, σ) ⇓ (Ctrl(κ), σ_1)    κ ∈ {Return(_), Panic, Abort}
```

───────────────────────────────────────────────────────────────────────────────────────────────────────

```text
ExecIRSigma(LoopIR(LoopInfinite, IR_b, v_b), σ) ⇓ (Ctrl(κ), σ_1)
```

**(ExecIR-Loop-Cond-False)**

```text
ExecIRSigma(IR_c, σ) ⇓ (Val(false), σ_1)
```

──────────────────────────────────────────────────────────────────────────────────────────

```text
ExecIRSigma(LoopIR(LoopConditional, IR_c, v_c, IR_b, v_b), σ) ⇓ (Val(()), σ_1)
```

**(ExecIR-Loop-Cond-True-Step)**

```text
ExecIRSigma(IR_c, σ) ⇓ (Val(true), σ_1)    ExecIRSigma(IR_b, σ_1) ⇓ (Val(v), σ_2)    ExecIRSigma(LoopIR(LoopConditional, IR_c, v_c, IR_b, v_b), σ_2) ⇓ (out, σ_3)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
ExecIRSigma(LoopIR(LoopConditional, IR_c, v_c, IR_b, v_b), σ) ⇓ (out, σ_3)
```

**(ExecIR-Loop-Cond-Continue)**

```text
ExecIRSigma(IR_c, σ) ⇓ (Val(true), σ_1)    ExecIRSigma(IR_b, σ_1) ⇓ (Ctrl(Continue), σ_2)    ExecIRSigma(LoopIR(LoopConditional, IR_c, v_c, IR_b, v_b), σ_2) ⇓ (out, σ_3)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
ExecIRSigma(LoopIR(LoopConditional, IR_c, v_c, IR_b, v_b), σ) ⇓ (out, σ_3)
```

**(ExecIR-Loop-Cond-Break)**

```text
ExecIRSigma(IR_c, σ) ⇓ (Val(true), σ_1)    ExecIRSigma(IR_b, σ_1) ⇓ (Ctrl(Break(v_opt)), σ_2)    v = BreakVal(v_opt)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
ExecIRSigma(LoopIR(LoopConditional, IR_c, v_c, IR_b, v_b), σ) ⇓ (Val(v), σ_2)
```

**(ExecIR-Loop-Cond-Ctrl)**

```text
ExecIRSigma(IR_c, σ) ⇓ (Ctrl(κ), σ_1)
```

─────────────────────────────────────────────────────────────────────────────────────────────

```text
ExecIRSigma(LoopIR(LoopConditional, IR_c, v_c, IR_b, v_b), σ) ⇓ (Ctrl(κ), σ_1)
```

**(ExecIR-Loop-Cond-Body-Ctrl)**

```text
ExecIRSigma(IR_c, σ) ⇓ (Val(true), σ_1)    ExecIRSigma(IR_b, σ_1) ⇓ (Ctrl(κ), σ_2)    κ ∈ {Return(_), Panic, Abort}
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
ExecIRSigma(LoopIR(LoopConditional, IR_c, v_c, IR_b, v_b), σ) ⇓ (Ctrl(κ), σ_2)
```

```text
LoopIterIRJudg = {Γ ⊢ LoopIterExecIRSigma(pat, IR_b, it, σ) ⇓ (out, σ')}
```

**(ExecIR-Loop-Iter)**

```text
ExecIRSigma(IR_i, σ) ⇓ (Val(v_iter), σ_1)    IterInit(v_iter) ⇓ it    Γ ⊢ LoopIterExecIRSigma(pat, IR_b, it, σ_1) ⇓ (out, σ_2)
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
ExecIRSigma(LoopIR(LoopIter, pat, ty_opt, IR_i, v_iter, IR_b, v_b), σ) ⇓ (out, σ_2)
```

**(ExecIR-Loop-Iter-Ctrl)**

```text
ExecIRSigma(IR_i, σ) ⇓ (Ctrl(κ), σ_1)
```

───────────────────────────────────────────────────────────────────────────────────────────────

```text
ExecIRSigma(LoopIR(LoopIter, pat, ty_opt, IR_i, v_iter, IR_b, v_b), σ) ⇓ (Ctrl(κ), σ_1)
```

**(LoopIterIR-Done)**

```text
IterNext(it) ⇓ (⊥, it')
```

──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LoopIterExecIRSigma(pat, IR_b, it, σ) ⇓ (Val(()), σ)
```

**(LoopIterIR-Step-Val)**

```text
IterNext(it) ⇓ (v, it')    Γ ⊢ ExecBlockBindIRSigma(pat, v, IR_b, σ) ⇓ (Val(v_b), σ_1)    Γ ⊢ LoopIterExecIRSigma(pat, IR_b, it', σ_1) ⇓ (out, σ_2)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LoopIterExecIRSigma(pat, IR_b, it, σ) ⇓ (out, σ_2)
```

**(LoopIterIR-Step-Continue)**

```text
IterNext(it) ⇓ (v, it')    Γ ⊢ ExecBlockBindIRSigma(pat, v, IR_b, σ) ⇓ (Ctrl(Continue), σ_1)    Γ ⊢ LoopIterExecIRSigma(pat, IR_b, it', σ_1) ⇓ (out, σ_2)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LoopIterExecIRSigma(pat, IR_b, it, σ) ⇓ (out, σ_2)
```

**(LoopIterIR-Step-Break)**

```text
IterNext(it) ⇓ (v, it')    Γ ⊢ ExecBlockBindIRSigma(pat, v, IR_b, σ) ⇓ (Ctrl(Break(v_opt)), σ_1)    v' = BreakVal(v_opt)
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LoopIterExecIRSigma(pat, IR_b, it, σ) ⇓ (Val(v'), σ_1)
```

**(LoopIterIR-Step-Ctrl)**

```text
IterNext(it) ⇓ (v, it')    Γ ⊢ ExecBlockBindIRSigma(pat, v, IR_b, σ) ⇓ (Ctrl(κ), σ_1)    κ ∈ {Return(_), Panic, Abort}
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LoopIterExecIRSigma(pat, IR_b, it, σ) ⇓ (Ctrl(κ), σ_1)
```

**(ExecIR-Region)**

```text
RegionNew(σ, v_o) ⇓ (σ_1, r, scope)    BindRegionAlias(σ_1, alias_opt, r) ⇓ σ_2    Γ ⊢ ExecInScopeIRSigma(IR_b, σ_2, scope) ⇓ (out, σ_3)    RegionRelease(σ_3, r, scope, out) ⇓ (out', σ_4)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
ExecIRSigma(RegionIR(v_o, alias_opt, IR_b, v_b), σ) ⇓ (StmtOutOf(out'), σ_4)
```

**(ExecIR-Frame-Implicit)**

```text
ActiveTarget(σ) = r    FrameEnter(σ, r) ⇓ (σ_1, F, scope, mark)    Γ ⊢ ExecInScopeIRSigma(IR_b, σ_1, scope) ⇓ (out, σ_2)    FrameReset(σ_2, r, scope, mark, out) ⇓ (out', σ_3)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
ExecIRSigma(FrameIR(⊥, IR_b, v_b), σ) ⇓ (StmtOutOf(out'), σ_3)
```

**(ExecIR-Frame-Explicit)**

```text
RegionHandleOf(v_r) = h    ResolveTarget(σ, h) = r_t    FrameEnter(σ, r_t) ⇓ (σ_1, F, scope, mark)    Γ ⊢ ExecInScopeIRSigma(IR_b, σ_1, scope) ⇓ (out, σ_2)    FrameReset(σ_2, r_t, scope, mark, out) ⇓ (out', σ_3)
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
ExecIRSigma(FrameIR(v_r, IR_b, v_b), σ) ⇓ (StmtOutOf(out'), σ_3)
```

**(LowerList-Empty)**
──────────────────────────────────────────────

```text
Γ ⊢ LowerList([]) ⇓ ⟨ε, []⟩
```

**(LowerList-Cons)**

```text
Γ ⊢ LowerExpr(e) ⇓ ⟨IR_e, v⟩    Γ ⊢ LowerList(es) ⇓ ⟨IR_s, vec_v⟩
```

──────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerList(e::es) ⇓ ⟨SeqIR(IR_e, IR_s), [v] ++ vec_v⟩
```

**(LowerFieldInits-Empty)**
────────────────────────────────────────────────────

```text
Γ ⊢ LowerFieldInits([]) ⇓ ⟨ε, []⟩
```

**(LowerFieldInits-Cons)**

```text
Γ ⊢ LowerExpr(e) ⇓ ⟨IR_e, v⟩    Γ ⊢ LowerFieldInits(fs) ⇓ ⟨IR_s, vec_f⟩
```

──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerFieldInits([⟨f, e⟩] ++ fs) ⇓ ⟨SeqIR(IR_e, IR_s), [⟨f, v⟩] ++ vec_f⟩
```

**(LowerOpt-None)**
─────────────────────────────────────────────

```text
Γ ⊢ LowerOpt(⊥) ⇓ ⟨ε, ⊥⟩
```

**(LowerOpt-Some)**

```text
Γ ⊢ LowerExpr(e) ⇓ ⟨IR_e, v⟩
```

──────────────────────────────────────────

```text
Γ ⊢ LowerOpt(e) ⇓ ⟨IR_e, v⟩
```

```text
RefSyms : IR → 𝒫(Symbol)
```

RefSyms([]) = ∅

```text
RefSyms([d] ++ ds) = RefSyms(d) ∪ RefSyms(ds)
```

RefSyms(ProcIR(_, _, _, IR)) = RefSyms(IR)
RefSyms(GlobalConst(_, _)) = ∅
RefSyms(GlobalZero(_, _)) = ∅

```text
RefSyms(GlobalVTable(_, header, slots)) = { s | s ∈ header ∧ s ∈ Symbol } ∪ { s | s ∈ slots ∧ s ∈ Symbol }
RefSyms(EmitVTable(T, Cl)) = RefSyms(d) ⇔ Γ ⊢ EmitVTable(T, Cl) ⇓ d
RefSyms(EmitDropGlue(T)) = RefSyms(IR) ⇔ Γ ⊢ DropGlueIR(T) ⇓ IR
```

RefSyms(EmitLiteralData(_, _)) = ∅

```text
RefSyms(ε) = ∅
RefSyms(SeqIR(IR_1, IR_2)) = RefSyms(IR_1) ∪ RefSyms(IR_2)
```

RefSyms(ReadVarIR(_)) = ∅
RefSyms(StoreVarIR(_, _)) = ∅
RefSyms(StoreVarNoDropIR(_, _)) = ∅
RefSyms(BindVarIR(_, _)) = ∅
RefSyms(ReadPtrIR(_)) = ∅
RefSyms(WritePtrIR(_, _)) = ∅
RefSyms(AllocIR(_, _)) = ∅
RefSyms(MoveStateIR(_)) = ∅
RefSyms(ReturnIR(_)) = ∅
RefSyms(TailValueIR(_)) = ∅
RefSyms(BreakIR(_)) = ∅
RefSyms(ContinueIR) = ∅
RefSyms(DeferIR(_)) = ∅

```text
RefSyms(ReadPathIR(path, name)) = {PathSym(path, name)} ∪ { sym | StaticSymPath(path, name) = sym }
```

RefSyms(StoreGlobal(sym, _)) = {sym}

```text
RefSyms(CallIR(callee, _)) = { callee | callee ∈ Symbol }
RefSyms(IfIR(_, IR_t, _, IR_f, _)) = RefSyms(IR_t) ∪ RefSyms(IR_f)
RefSyms(BlockIR(IR_s, IR_t, _)) = RefSyms(IR_s) ∪ RefSyms(IR_t)
```

RefSyms(IfCaseIR(_, _, _)) = ∅
RefSyms(LoopIR(LoopInfinite, IR_b, _)) = RefSyms(IR_b)

```text
RefSyms(LoopIR(LoopConditional, IR_c, _, IR_b, _)) = RefSyms(IR_c) ∪ RefSyms(IR_b)
RefSyms(LoopIR(LoopIter, _, _, IR_i, _, IR_b, _)) = RefSyms(IR_i) ∪ RefSyms(IR_b)
```

RefSyms(RegionIR(_, _, IR_b, _)) = RefSyms(IR_b)
RefSyms(FrameIR(_, IR_b, _)) = RefSyms(IR_b)
RefSyms(BranchIR(_)) = ∅
RefSyms(BranchIR(_, _, _)) = ∅
RefSyms(PhiIR(_, _, _)) = ∅
RefSyms(CallVTable(_, _, _)) = ∅

```text
RefSyms(AddrOfIR(p)) = RefSyms(IR_p) ⇔ Γ ⊢ LowerAddrOf(p) ⇓ ⟨IR_p, addr⟩
RefSyms(ClearPanic) = RefSyms(IR) ⇔ Γ ⊢ ClearPanic ⇓ IR
RefSyms(PanicCheck) = RefSyms(IR) ⇔ Γ ⊢ PanicCheck ⇓ IR
RefSyms(CheckPoison(m)) = RefSyms(IR) ⇔ Γ ⊢ CheckPoison(m) ⇓ IR
RefSyms(LowerPanic(r)) = RefSyms(IR) ⇔ Γ ⊢ LowerPanic(r) ⇓ IR
```

```text
RuntimeRefs(IR) = RefSyms(IR) ∩ RuntimeSyms
LiteralRef(IR, kind, bytes) ⇔ LiteralDataSym(kind, bytes) ∈ RefSyms(IR)
LiteralRefs(IR) = {⟨kind, bytes⟩ | LiteralRef(IR, kind, bytes)}
VTableRefs(IR) = {(T, Cl) | DynPack(T, _) ∈ IR ∨ CallVTable(_, _, _) ∈ IR}
```

```text
ExpandIR(IR) = IR ++ ((++_{(T, Cl) ∈ VTableRefs(IR)} [EmitDropGlue(T), EmitVTable(T, Cl)])) ++ ((++_{⟨kind, bytes⟩ ∈ LiteralRefs(IR)} [EmitLiteralData(kind, bytes)]))
```

EmitKey(d) =

```text
 ⟨`vtable`, T, Cl⟩     if d = EmitVTable(T, Cl)
 ⟨`drop`, T⟩           if d = EmitDropGlue(T)
 ⟨`lit`, kind, bytes⟩  if d = EmitLiteralData(kind, bytes)
 ⊥                     otherwise
```

```text
EmitKeys(IR) = [EmitKey(d) | d ∈ IR ∧ EmitKey(d) ≠ ⊥]
UniqueEmits(IR) ⇔ NoDup(EmitKeys(IR))
```

#### 24.1.4 Project and Module Composition

Items(P, m) = ASTModule(P, m).items

**(CG-Project)**

```text
Γ ⊢ OutputPipeline(P) ⇓ (Objs, IRs, Artifact)
```

─────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CodegenProject(P) ⇓ (Set(Objs) ∪ Set(IRs) ∪ ({Artifact} if Artifact ≠ ⊥ else ∅))
```

Feature-local `CodegenItem` rules are defined by the owning feature sections. This section introduces no additional item-specific lowering rules.

**(CG-Module)**

```text
Items(Project(Γ), m) = [i_1, …, i_k]    ∀ j, Γ ⊢ CodegenItem(i_j) ⇓ ds_j    Γ ⊢ InitFn(m) ⇓ sym_init    Γ ⊢ DeinitFn(m) ⇓ sym_deinit    Γ ⊢ Lower-StaticInit(m) ⇓ IR_init    Γ ⊢ Lower-StaticDeinit(m) ⇓ IR_deinit
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CodegenModule(m) ⇓ ds_1 ++ … ++ ds_k ++ [ProcIR(sym_init, [PanicOutParam], TypePrim("()"), IR_init), ProcIR(sym_deinit, [PanicOutParam], TypePrim("()"), IR_deinit)]
```

**(CG-Expr)**

```text
Γ ⊢ LowerExpr(e) ⇓ ⟨IR, v⟩
```

────────────────────────────────────────────

```text
Γ ⊢ CodegenExpr(e) ⇓ ⟨IR, v⟩
```

**(CG-Stmt)**

```text
Γ ⊢ LowerStmt(s) ⇓ IR
```

──────────────────────────────

```text
Γ ⊢ CodegenStmt(s) ⇓ IR
```

**(CG-Block)**

```text
Γ ⊢ LowerBlock(b) ⇓ ⟨IR, v⟩
```

─────────────────────────────────────────────

```text
Γ ⊢ CodegenBlock(b) ⇓ ⟨IR, v⟩
```

**(CG-Place)**

```text
Γ ⊢ LowerPlace(p) ⇓ l
```

────────────────────────────────

```text
Γ ⊢ CodegenPlace(p) ⇓ l
```

**(LowerIR-Module)**

```text
IR' = ExpandIR(IR)    IR' = [d_1, …, d_k]    ∀ i, Γ ⊢ LowerIRDecl(d_i) ⇓ ll_i    RuntimeDecls(RuntimeRefs(IR')) = ds    RuntimeDeclsOk(ds)    LLVMIR = LLVMHeader ++ ds ++ ll_1 ++ … ++ ll_k    LLVMUBSafe(LLVMIR)    RuntimeDeclsCover(LLVMIR, IR')    UniqueEmits(IR')
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIR(IR) ⇓ LLVMIR
```

**(LowerIR-Err)**

```text
∃ i, Γ ⊢ LowerIRDecl(d_i) ⇑
```

────────────────────────────────

```text
Γ ⊢ LowerIR(IR) ⇑
```

**(EmitLLVM-Ok)**

```text
Γ ⊢ ResolveTool(`llvm-as`) ⇓ a    RenderLLVM(LLVMIR, a) = bytes
```

───────────────────────────────────────────────────────────────

```text
Γ ⊢ EmitLLVM(LLVMIR) ⇓ bytes
```

LLVMText_21 = { bytes | `llvm-as`_21 accepts bytes }

```text
RenderLLVM(LLVMIR, a) = bytes ⇒ bytes ∈ LLVMText_21
```

**(EmitLLVM-Err)**

```text
Γ ⊢ ResolveTool(`llvm-as`) ⇓ a    RenderLLVM(LLVMIR, a) ⇑
```

─────────────────────────────────────────────────────────

```text
Γ ⊢ EmitLLVM(LLVMIR) ⇑
```

LLVMText_21 and LLVMObj_21 are defined by LLVM 21.1.8 tool acceptance for textual IR and object emission respectively.
Failure to resolve `llvm-as` is owned by §3.7 `ResolveTool-Err-IR` and the enclosing output rule; it MUST NOT be classified as `EmitLLVM-Err`.

**(EmitObj-Ok)**
LLVMEmitObj_21(LLVMIR) = bytes
───────────────────────────────────────────

```text
Γ ⊢ EmitObj(LLVMIR) ⇓ bytes
```

```text
LLVMEmitObj_21(LLVMIR) = bytes ⇔ LLVMObj_21(LLVMIR, LLVMHeader) = bytes
```

**(EmitObj-Err)**

```text
LLVMEmitObj_21(LLVMIR) ⇑
```

──────────────────────────────

```text
Γ ⊢ EmitObj(LLVMIR) ⇑
```

### 24.2 Layout and ABI Framework

#### 24.2.1 Primitive Layout and Encoding

PtrSize = 8
PointerSize = PtrSize
PtrAlign = 8

PrimSize("i8") = 1
PrimSize("i16") = 2
PrimSize("i32") = 4
PrimSize("i64") = 8
PrimSize("i128") = 16
PrimSize("u8") = 1
PrimSize("u16") = 2
PrimSize("u32") = 4
PrimSize("u64") = 8
PrimSize("u128") = 16
PrimSize("f16") = 2
PrimSize("f32") = 4
PrimSize("f64") = 8
PrimSize("bool") = 1
PrimSize("char") = 4
PrimSize("usize") = PtrSize
PrimSize("isize") = PtrSize
PrimSize("()") = 0
PrimSize("!") = 0

PrimAlign("i8") = 1
PrimAlign("i16") = 2
PrimAlign("i32") = 4
PrimAlign("i64") = 8
PrimAlign("i128") = 16
PrimAlign("u8") = 1
PrimAlign("u16") = 2
PrimAlign("u32") = 4
PrimAlign("u64") = 8
PrimAlign("u128") = 16
PrimAlign("f16") = 2
PrimAlign("f32") = 4
PrimAlign("f64") = 8
PrimAlign("bool") = 1
PrimAlign("char") = 4
PrimAlign("usize") = PtrAlign
PrimAlign("isize") = PtrAlign
PrimAlign("()") = 1
PrimAlign("!") = 1

LayoutJudg = {sizeof, alignof, layout}

**(Size-Prim)**
T = TypePrim(name)    PrimSize(name) = n
────────────────────────────────────────

```text
Γ ⊢ sizeof(T) = n
```

**(Align-Prim)**
T = TypePrim(name)    PrimAlign(name) = a
──────────────────────────────────────────

```text
Γ ⊢ alignof(T) = a
```

**(Layout-Prim)**
T = TypePrim(name)    PrimSize(name) = n    PrimAlign(name) = a
────────────────────────────────────────────────────────────

```text
Γ ⊢ layout(T) ⇓ ⟨n, a⟩
```

LEBytes(v, n) = LE(v mod 2^{8n}, n)
FloatBits_t(v) = IEEE754Bits(t, v)
EncodeConstJudg = {EncodeConst}
BoolByte(false) = 0x00
BoolByte(true) = 0x01

**(Encode-Bool)**
LiteralValue(lit, TypePrim("bool")) = b
──────────────────────────────────────────────────────────────

```text
Γ ⊢ EncodeConst(TypePrim("bool"), lit) ⇓ LEBytes(BoolByte(b), 1)
```

**(Encode-Char)**
LiteralValue(lit, TypePrim("char")) = c
──────────────────────────────────────────────────────────────

```text
Γ ⊢ EncodeConst(TypePrim("char"), lit) ⇓ LEBytes(c, 4)
```

**(Encode-Int)**

```text
lit.kind = IntLiteral    T = TypePrim(t)    t ∈ IntTypes    v = LiteralValue(lit, T)    x = IntValValue(v)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EncodeConst(T, lit) ⇓ LEBytes(x, sizeof(T))
```

**(Encode-Float)**

```text
lit.kind = FloatLiteral    T = TypePrim(t)    t ∈ FloatTypes    v = LiteralValue(lit, T)    x = FloatValValue(v)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EncodeConst(T, lit) ⇓ LEBytes(FloatBits_t(x), sizeof(T))
```

**(Encode-Unit)**
T = TypePrim("()")
────────────────────────────────────────────

```text
Γ ⊢ EncodeConst(T, lit) ⇓ []
```

**(Encode-Never)**
T = TypePrim("!")
────────────────────────────────────────────

```text
Γ ⊢ EncodeConst(T, lit) ⇓ []
```

**(Encode-RawPtr-Null)**
lit.kind = NullLiteral    T = TypeRawPtr(q, U)
───────────────────────────────────────────────────────────────

```text
Γ ⊢ EncodeConst(T, lit) ⇓ LEBytes(0, sizeof(T))
```

ValidValueJudg = {ValidValue}

**(Valid-Bool)**

```text
ValidValue(TypePrim("bool"), bits) ⇔ bits ∈ {[0x00], [0x01]}
```

**(Valid-Char)**

```text
ValidValue(TypePrim("char"), bits) ⇔ ∃ c. LEBytes(c, 4) = bits ∧ c ∈ UnicodeScalar
```

**(Valid-Scalar)**
ScalarTypes = {"i8", "i16", "i32", "i64", "i128", "u8", "u16", "u32", "u64", "u128", "f16", "f32", "f64", "usize", "isize"}

```text
∀ t ∈ ScalarTypes. ValidValue(TypePrim(t), bits) ⇔ |bits| = PrimSize(t)
```

**(Valid-Unit)**

```text
ValidValue(TypePrim("()"), bits) ⇔ bits = []
```

**(Valid-Never)**

```text
ValidValue(TypePrim("!"), bits) ⇔ false
```

```text
ValidValue(T, bits) ⇔ T ∉ {TypePrim(_), TypePtr(_, _), TypeRawPtr(_, _)} ∧ ∃ v. ValueBits(T, v) = bits
ValueBits(T, v) = bits ⇒ ValidValue(T, bits)
```

#### 24.2.2 Permission, Pointer, and Function Layout

**(Layout-Perm)**

```text
Γ ⊢ layout(T) ⇓ L
```

────────────────────────────────────────

```text
Γ ⊢ layout(TypePerm(p, T)) ⇓ L
```

**(Size-Perm)**

```text
Γ ⊢ sizeof(T) = n
```

────────────────────────────────────────

```text
Γ ⊢ sizeof(TypePerm(p, T)) = n
```

**(Align-Perm)**

```text
Γ ⊢ alignof(T) = a
```

────────────────────────────────────────

```text
Γ ⊢ alignof(TypePerm(p, T)) = a
```

```text
ValueBits(TypePerm(p, T), v) = bits ⇔ ValueBits(T, v) = bits
```

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

#### 24.2.3 Default Calling Convention

CallConvDefault = `C`

CallingConvention = { `C`, `C-unwind`, `system`, `stdcall`, `fastcall`, `vectorcall` }

ObjFormatOf(`x86_64-sysv`) = "ELF"
ObjFormatOf(`x86_64-win64`) = "COFF"
ObjFormatOf(`aarch64-aapcs64`) = "ELF"

ObjExt(`x86_64-sysv`) = ".o"
ObjExt(`x86_64-win64`) = ".obj"
ObjExt(`aarch64-aapcs64`) = ".o"

ExeSuffix(`x86_64-sysv`) = ""
ExeSuffix(`x86_64-win64`) = ".exe"
ExeSuffix(`aarch64-aapcs64`) = ""

LibraryPrefix(`x86_64-sysv`) = "lib"
LibraryPrefix(`x86_64-win64`) = ""
LibraryPrefix(`aarch64-aapcs64`) = "lib"

SharedLibSuffix(`x86_64-sysv`) = ".so"
SharedLibSuffix(`x86_64-win64`) = ".dll"
SharedLibSuffix(`aarch64-aapcs64`) = ".so"

StaticLibSuffix(`x86_64-sysv`) = ".a"
StaticLibSuffix(`x86_64-win64`) = ".lib"
StaticLibSuffix(`aarch64-aapcs64`) = ".a"

ImportLibSuffix(`x86_64-sysv`) = ".so.import"
ImportLibSuffix(`x86_64-win64`) = ".lib"
ImportLibSuffix(`aarch64-aapcs64`) = ".so.import"

```text
EmitsImportLib(`x86_64-sysv`) ⇔ false
EmitsImportLib(`x86_64-win64`) ⇔ true
EmitsImportLib(`aarch64-aapcs64`) ⇔ false
```

RuntimeLibNameFor(`x86_64-sysv`) = "UltravioletRT.a"
RuntimeLibNameFor(`x86_64-win64`) = "UltravioletRT.lib"
RuntimeLibNameFor(`aarch64-aapcs64`) = "UltravioletRT.a"

LinkerToolName(`x86_64-sysv`) = `ld.lld`
LinkerToolName(`x86_64-win64`) = `lld-link`
LinkerToolName(`aarch64-aapcs64`) = `ld.lld`

LibraryEntrySym(`x86_64-win64`) = "__ultraviolet_library_entry"

ArchiverToolName(`x86_64-sysv`) = `llvm-ar`
ArchiverToolName(`x86_64-win64`) = `llvm-lib`
ArchiverToolName(`aarch64-aapcs64`) = `llvm-ar`

LinkFlagsFor(`x86_64-sysv`, `exe`, out, _) = ["-o", out, "--entry=_start", "--nostdlib", "--dynamic-linker=/lib64/ld-linux-x86-64.so.2"]
LinkFlagsFor(`x86_64-sysv`, `shared`, out, _) = ["-o", out, "--shared", "--nostdlib"]
LinkFlagsFor(`x86_64-win64`, `exe`, out, _) = ["/OUT:" ++ out, "/ENTRY:main", "/SUBSYSTEM:CONSOLE", "/NODEFAULTLIB"]
LinkFlagsFor(`x86_64-win64`, `shared`, out, import_lib) = ["/OUT:" ++ out, "/DLL", "/ENTRY:" ++ LibraryEntrySym(`x86_64-win64`), "/NODEFAULTLIB", "/IMPLIB:" ++ import_lib]
LinkFlagsFor(`aarch64-aapcs64`, `exe`, out, _) = ["-o", out, "--entry=main", "--nostdlib", "--dynamic-linker=/lib/ld-linux-aarch64.so.1"]
LinkFlagsFor(`aarch64-aapcs64`, `shared`, out, _) = ["-o", out, "--shared", "--nostdlib"]

ArchiveFlagsFor(`x86_64-sysv`, out) = ["rcs", out]
ArchiveFlagsFor(`x86_64-win64`, out) = ["/OUT:" ++ out]
ArchiveFlagsFor(`aarch64-aapcs64`, out) = ["rcs", out]

LLVMTripleOf(`x86_64-sysv`) = "x86_64-unknown-linux-gnu"
LLVMTripleOf(`x86_64-win64`) = "x86_64-pc-windows-msvc"
LLVMTripleOf(`aarch64-aapcs64`) = "aarch64-unknown-linux-gnu"

LLVMDataLayoutOf(`x86_64-sysv`) = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i128:128-n8:16:32:64-S128"
LLVMDataLayoutOf(`x86_64-win64`) = "e-m:w-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
LLVMDataLayoutOf(`aarch64-aapcs64`) = "e-m:e-i8:8:32-i16:16:32-i64:64-i128:128-n32:64-S128"

ExternAbiSet = { `"C"`, `"C-unwind"`, `"system"`, `"stdcall"`, `"fastcall"`, `"vectorcall"` }

```text
AbiToConvention : String → CallingConvention
```

AbiToConvention("C") = `C`
AbiToConvention("C-unwind") = `C-unwind`
AbiToConvention("system") = `system`
AbiToConvention("stdcall") = `stdcall`
AbiToConvention("fastcall") = `fastcall`
AbiToConvention("vectorcall") = `vectorcall`

```text
ConventionLayout(`x86_64-sysv`, `C`) = ⟨
  param_regs: ⟨int = [rdi, rsi, rdx, rcx, r8, r9], float = [xmm0, xmm1, xmm2, xmm3, xmm4, xmm5, xmm6, xmm7]⟩,
  return_regs: ⟨int = [rax, rdx], float = [xmm0, xmm1]⟩,
```

  stack_alignment: 16,
  callee_saved: [rbx, rbp, r12, r13, r14, r15],
  caller_saved: [rax, rcx, rdx, rsi, rdi, r8, r9, r10, r11],
  variadic_support: true,
  unwind_support: false,
  panic_passing: `OutParam`

```text
⟩
```

```text
ConventionLayout(`x86_64-win64`, `C`) = ⟨
  param_regs: ⟨int = [rcx, rdx, r8, r9], float = [xmm0, xmm1, xmm2, xmm3]⟩,
  return_regs: ⟨int = [rax], float = [xmm0]⟩,
```

  stack_alignment: 16,
  callee_saved: [rbx, rbp, rdi, rsi, r12, r13, r14, r15],
  caller_saved: [rax, rcx, rdx, r8, r9, r10, r11],
  variadic_support: true,
  unwind_support: false,
  panic_passing: `OutParam`

```text
⟩
```

```text
ConventionLayout(`aarch64-aapcs64`, `C`) = ⟨
  param_regs: ⟨int = [x0, x1, x2, x3, x4, x5, x6, x7], float = [v0, v1, v2, v3, v4, v5, v6, v7]⟩,
  return_regs: ⟨int = [x0, x1], float = [v0, v1]⟩,
```

  stack_alignment: 16,
  callee_saved: [x19, x20, x21, x22, x23, x24, x25, x26, x27, x28, x29, x30],
  caller_saved: [x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18],
  variadic_support: true,
  unwind_support: false,
  panic_passing: `OutParam`

```text
⟩
```

ConventionLayout(profile, `C-unwind`) = ConventionLayout(profile, `C`) with `unwind_support := true`
ConventionLayout(profile, `system`) = ConventionLayout(profile, `C`)
ConventionLayout(`x86_64-win64`, `stdcall`) = ConventionLayout(`x86_64-win64`, `C`)
ConventionLayout(`x86_64-win64`, `fastcall`) = ConventionLayout(`x86_64-win64`, `C`)
ConventionLayout(`x86_64-win64`, `vectorcall`) = ConventionLayout(`x86_64-win64`, `C`) with `variadic_support := false`

```text
AssignParamRegs : [ParamType] × CallingConvention → [ParamLocation]
```

AssignParamRegs(params, conv) =
  let abi = ConventionLayout(SelectedTargetProfile, conv)
  let (int_regs, float_regs) = (abi.param_regs.int, abi.param_regs.float)
  let int_idx = 0, float_idx = 0, stack_offset = 0
  for each (mode, T) in params:

```text
    if IsFloatType(T) ∧ float_idx < |float_regs|:
```

      assign float_regs[float_idx++]

```text
    else if IsIntOrPtrType(T) ∧ int_idx < |int_regs|:
```

      assign int_regs[int_idx++]
    else:
      assign Stack(stack_offset)
      stack_offset += Align(sizeof(T), abi.stack_alignment)

```text
StackFrame = ⟨
```

  return_address: Offset,
  saved_frame_pointer: Option<Offset>,

```text
  callee_saved_area: [⟨Register, Offset⟩],
  local_variables: [⟨Name, Offset, Size⟩],
```

  outgoing_args: Option<Offset>,
  alignment_padding: Size

```text
⟩
```

**(StackFrame-Layout)**
procedure f with locals L, max_outgoing_args M
frame_size = Align(|L| + |ConventionLayout(SelectedTargetProfile, CallConvDefault).callee_saved| × PtrSize + M, ConventionLayout(SelectedTargetProfile, CallConvDefault).stack_alignment)
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
StackFrameOf(f) = ⟨frame_size, local_offsets, callee_saved_offsets, outgoing_offset⟩
```

**(Conv-Compatible)**
CallerConv = conv_1    CalleeConv = conv_2    conv_1 = conv_2
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
ConvCompatible(conv_1, conv_2) = true

**(Conv-FFI-Required)**
FFIBoundary(call_site)    ExternAbi(callee) = abi_str    AbiToConvention(abi_str) = conv
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
RequiredConvention(call_site) = conv

#### 24.2.4 ABI Type Lowering

```text
ABIType = { ⟨size, align⟩ | size ∈ ℕ ∧ align ∈ ℕ }
```

ABITyJudg = {ABITy}

**(ABI-Prim)**

```text
Γ ⊢ sizeof(TypePrim(name)) = s    Γ ⊢ alignof(TypePrim(name)) = a
```

────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ABITy(TypePrim(name)) ⇓ ⟨s, a⟩
```

**(ABI-Perm)**

```text
Γ ⊢ ABITy(T) ⇓ τ
```

──────────────────────────────────────────

```text
Γ ⊢ ABITy(TypePerm(p, T)) ⇓ τ
```

**(ABI-Ptr)**
T = TypePtr(U, s)
──────────────────────────────────────────────

```text
Γ ⊢ ABITy(T) ⇓ ⟨PtrSize, PtrAlign⟩
```

**(ABI-RawPtr)**
T = TypeRawPtr(q, U)
──────────────────────────────────────────────

```text
Γ ⊢ ABITy(T) ⇓ ⟨PtrSize, PtrAlign⟩
```

**(ABI-Func)**
T = TypeFunc(params, R)
──────────────────────────────────────────────

```text
Γ ⊢ ABITy(T) ⇓ ⟨PtrSize, PtrAlign⟩
```

**(ABI-Alias)**

```text
T = TypePath(p)    AliasBody(p) = ty    Γ ⊢ ABITy(ty) ⇓ τ
```

────────────────────────────────────────────────────────────

```text
Γ ⊢ ABITy(T) ⇓ τ
```

**(ABI-Record)**

```text
T = TypePath(p)    RecordDecl(p) = R    Fields(R) = fields    RecordLayout(fields) ⇓ ⟨size, align, _⟩
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ABITy(T) ⇓ ⟨size, align⟩
```

**(ABI-Tuple)**

```text
TupleLayout([T_1, …, T_n]) ⇓ ⟨size, align, _⟩
```

───────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ABITy(TypeTuple([T_1, …, T_n])) ⇓ ⟨size, align⟩
```

**(ABI-Array)**

```text
Γ ⊢ sizeof(TypeArray(T, e)) = size    Γ ⊢ alignof(TypeArray(T, e)) = align
```

────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ABITy(TypeArray(T, e)) ⇓ ⟨size, align⟩
```

**(ABI-Slice)**
T = TypeSlice(U)
──────────────────────────────────────────────

```text
Γ ⊢ ABITy(T) ⇓ ⟨2 × PtrSize, PtrAlign⟩
```

**(ABI-Range)**

```text
Γ ⊢ sizeof(TypeRange(T)) = size    Γ ⊢ alignof(TypeRange(T)) = align
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ABITy(TypeRange(T)) ⇓ ⟨size, align⟩
```

**(ABI-RangeInclusive)**

```text
Γ ⊢ sizeof(TypeRangeInclusive(T)) = size    Γ ⊢ alignof(TypeRangeInclusive(T)) = align
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ABITy(TypeRangeInclusive(T)) ⇓ ⟨size, align⟩
```

**(ABI-RangeFrom)**

```text
Γ ⊢ sizeof(TypeRangeFrom(T)) = size    Γ ⊢ alignof(TypeRangeFrom(T)) = align
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ABITy(TypeRangeFrom(T)) ⇓ ⟨size, align⟩
```

**(ABI-RangeTo)**

```text
Γ ⊢ sizeof(TypeRangeTo(T)) = size    Γ ⊢ alignof(TypeRangeTo(T)) = align
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ABITy(TypeRangeTo(T)) ⇓ ⟨size, align⟩
```

**(ABI-RangeToInclusive)**

```text
Γ ⊢ sizeof(TypeRangeToInclusive(T)) = size    Γ ⊢ alignof(TypeRangeToInclusive(T)) = align
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ABITy(TypeRangeToInclusive(T)) ⇓ ⟨size, align⟩
```

**(ABI-RangeFull)**

```text
Γ ⊢ sizeof(TypeRangeFull) = size    Γ ⊢ alignof(TypeRangeFull) = align
```

──────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ABITy(TypeRangeFull) ⇓ ⟨size, align⟩
```

**(ABI-Enum)**

```text
T = TypePath(p)    EnumDecl(p) = E    EnumLayout(E) ⇓ ⟨size, align, _, _⟩
```

──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ABITy(T) ⇓ ⟨size, align⟩
```

**(ABI-Union)**

```text
T = TypeUnion([T_1, …, T_n])    UnionLayout(T) ⇓ ⟨size, align, _, _⟩
```

──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ABITy(T) ⇓ ⟨size, align⟩
```

**(ABI-Modal)**

```text
T = ModalRefType(modal_ref)    ModalLayout(modal_ref) ⇓ ⟨size, align, _, _⟩
```

──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ABITy(T) ⇓ ⟨size, align⟩
```

**(ABI-Dynamic)**

```text
Γ ⊢ DynLayout(Cl) ⇓ ⟨size, align, _⟩
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ ABITy(TypeDynamic(Cl)) ⇓ ⟨size, align⟩
```

**(ABI-StringBytes)**

```text
T ∈ {TypeString(`@View`), TypeString(`@Managed`), TypeBytes(`@View`), TypeBytes(`@Managed`)}    Γ ⊢ sizeof(T) = size    Γ ⊢ alignof(T) = align
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ABITy(T) ⇓ ⟨size, align⟩
```

#### 24.2.5 ABI Parameter and Return Passing

PassKind = {`ByValue`, `ByRef`, `SRet`}
ByValMax = 2 × PtrSize
ByValAlign = PtrAlign

```text
ByValOk(T) ⇔ Γ ⊢ sizeof(T) = n ∧ Γ ⊢ alignof(T) = a ∧ n ≤ ByValMax ∧ a ≤ ByValAlign
```

ABIParamJudg = {ABIParam}
ABIRetJudg = {ABIRet}
ABICallJudg = {ABICall}
ForeignABIParamJudg = {ForeignABIParam}
ForeignABICallJudg = {ForeignABICall}

`ForeignABIParam` and `ForeignABICall` MUST be used for foreign-visible ABI boundaries whose signatures do not carry source parameter-mode information.

**(ABI-Param-ByRef-Alias)**

```text
mode = ⊥    Γ ⊢ sizeof(T) = n
```

──────────────────────────────────────────

```text
Γ ⊢ ABIParam(mode, T) ⇓ `ByRef`
```

**(ABI-Param-ByValue-Move)**

```text
mode = `move`    Γ ⊢ sizeof(T) = 0 ∨ ByValOk(T)
```

────────────────────────────────────────────────────────

```text
Γ ⊢ ABIParam(mode, T) ⇓ `ByValue`
```

**(ABI-Param-ByRef-Move)**

```text
mode = `move`    Γ ⊢ sizeof(T) = n    n > 0    ¬ ByValOk(T)
```

─────────────────────────────────────────────────────────────

```text
Γ ⊢ ABIParam(mode, T) ⇓ `ByRef`
```

**(ABI-Ret-ByValue)**

```text
Γ ⊢ sizeof(T) = 0 ∨ ByValOk(T)
```

────────────────────────────────────────────

```text
Γ ⊢ ABIRet(T) ⇓ `ByValue`
```

**(ABI-Ret-ByRef)**

```text
Γ ⊢ sizeof(T) = n    n > 0    ¬ ByValOk(T)
```

──────────────────────────────────────────

```text
Γ ⊢ ABIRet(T) ⇓ `SRet`
```

**(ABI-Call)**

```text
∀ i, Γ ⊢ ABIParam(m_i, T_i) ⇓ k_i    Γ ⊢ ABIRet(R) ⇓ k_r
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ABICall([⟨m_1, T_1⟩, …, ⟨m_n, T_n⟩], R) ⇓ ⟨[k_1, …, k_n], k_r, (k_r = `SRet`)⟩
```

**(ABI-ForeignParam-ByValue)**

```text
Γ ⊢ sizeof(T) = 0 ∨ ByValOk(T)
```

──────────────────────────────────────────────────

```text
Γ ⊢ ForeignABIParam(T) ⇓ `ByValue`
```

**(ABI-ForeignParam-ByRef)**

```text
Γ ⊢ sizeof(T) = n    n > 0    ¬ ByValOk(T)
```

──────────────────────────────────────────────────

```text
Γ ⊢ ForeignABIParam(T) ⇓ `ByRef`
```

**(ABI-ForeignCall)**

```text
∀ i, Γ ⊢ ForeignABIParam(T_i) ⇓ k_i    Γ ⊢ ABIRet(R) ⇓ k_r
```

────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ForeignABICall([T_1, …, T_n], R) ⇓ ⟨[k_1, …, k_n], k_r, (k_r = `SRet`)⟩
```

```text
PanicRecordFields = [⟨`panic`, TypePrim("bool")⟩, ⟨`code`, TypePrim("u32")⟩]
```

PanicRecordLayout = RecordLayout(PanicRecordFields)
PanicRecordFieldsOf(PanicRecord) = PanicRecordFields
PanicRecordLayoutOf(PanicRecord) = PanicRecordLayout

PanicOutType = TypeRawPtr(`mut`, PanicRecord)
PanicOutName = "__panic"

```text
NeedsPanicOut(callee) ⇔ callee ≠ RecordCtor(_) ∧ callee ≠ EntrySym ∧ RuntimeSig(callee) undefined
```

PanicOutParams(params, callee) =

```text
 params ++ [⟨`move`, PanicOutName, PanicOutType⟩]    if NeedsPanicOut(callee)
```

 params    otherwise

### 24.3 Symbols, Mangling, and Linkage

#### 24.3.1 Symbol Names and Mangling

MangleJudg = {Mangle}
VTableDecl(T, Cl) constructor
LiteralData(kind, contents) constructor
DefaultImpl(T, m) constructor

Join(sep, []) = "\""
Join(sep, [s]) = s

```text
Join(sep, [s_1, …, s_n]) = s_1 ++ sep ++ Join(sep, [s_2, …, s_n])    (n ≥ 2)
```

PathSig(p) = mangle(PathString(p))
PathSym(path, name) = PathSig(path ++ [name])

```text
ItemPath(it) = PathOfModule(ModuleOf(it)) ++ [name] ⇔ it = ProcedureDecl(_, _, name, _, _, _, _, _, _, _, _)
ItemPath(it) = PathOfModule(ModuleOf(it)) ++ [name] ⇔ it = ExternProcDecl(_, _, name, _, _, _, _, _, _, _, _)
ItemPath(m) = RecordPath(R) ++ [m.name] ⇔ m ∈ Methods(R)
ItemPath(m) = ClassPath(Cl) ++ [m.name] ⇔ m ∈ ClassMethods(Cl)
ItemPath(m) = ModalPath(M) ++ [S] ++ [m.name] ⇔ S ∈ States(M) ∧ m ∈ Methods(M, S)
ItemPath(tr) = ModalPath(M) ++ [S] ++ [tr.name] ⇔ S ∈ States(M) ∧ tr ∈ Transitions(M, S)
ItemPath(it) = PathOfModule(ModuleOf(it)) ++ [StaticName(binding)] ⇔ it = StaticDecl(_, _, _, binding, span, doc) ∧ StaticName(binding) ≠ ⊥
```

ItemPath(StaticBinding(StaticDecl(attrs_opt, vis, mut, binding, span, doc), x)) = PathOfModule(ModuleOf(StaticDecl(attrs_opt, vis, mut, binding, span, doc))) ++ [x]
ItemPath(VTableDecl(T, Cl)) = ["vtable"] ++ PathOfType(T) ++ ["cl"] ++ ClassPath(Cl)

```text
ItemPath(DefaultImpl(T, m)) = ["default"] ++ PathOfType(T) ++ ["cl"] ++ ClassPath(Cl) ++ [m.name] ⇔ m ∈ ClassMethods(Cl)
```

TypeStateName(`View`) = "view"
TypeStateName(`Managed`) = "managed"
PathOfType(TypePrim(name)) = ["prim", name]
PathOfType(TypeString(st)) = ["string", TypeStateName(st)]
PathOfType(TypeBytes(st)) = ["bytes", TypeStateName(st)]
PathOfType(TypePath(p)) = p
PathOfType(TypeModalState(modal_ref, S)) = ModalRefPath(modal_ref) ++ [S]

```text
PathOfType(T) = ⊥ ⇔ T ∉ {TypePrim(_), TypeString(_), TypeBytes(_), TypePath(_), TypeModalState(_, _)}
ClassPath(Cl) = p ⇔ Σ.Classes[p] = Cl
```

FNVOffset64 = 14695981039346656037
FNVPrime64 = 1099511628211
FNV1a64([]) = FNVOffset64

```text
FNV1a64([b_1, …, b_n]) = h_n ⇔ h_0 = FNVOffset64 ∧ ∀ i ∈ 0..n-1. h_{i+1} = ((h_i ⊕ b_{i+1}) × FNVPrime64) mod 2^64
Hex64(h) = Join("\"", [Hex2(b_1), …, Hex2(b_8)]) ⇔ rev(LEBytes(h, 8)) = [b_1, …, b_8]
```

LiteralID(kind, contents) = mangle(kind) ++ "_" ++ Hex64(FNV1a64(contents))
LiteralDataSym(kind, bytes) = Mangle(LiteralData(kind, bytes))

ScopedSym(item) = PathSig(ItemPath(item))
RawSym(s) = s

```text
HostBodySym(item) = PathSig([ScopedSym(item), "__host_body"]) ⇔ item = ProcedureDecl(_, _, _, _, _, _, _, _, _, _, _) ∧ HostExportAttr(item) defined
```

AttrListOf(item) = attrs    if item.attrs_opt = attrs

```text
AttrListOf(item) = []       if item.attrs_opt = ⊥
AttrByName(item, n) = [a | a ∈ AttrListOf(item) ∧ a.name = n]
MangleAttr(item) = mode ⇔ ∃ a ∈ AttrByName(item, "mangle"). MangleArgs(a) = mode
MangleArgs(a) = `none` ⇔ a.args = [Identifier(`none`)]
MangleArgs(a) = s      ⇔ a.args = [StringLiteral(s)]
ExportAttr(item) = abi ⇔ ∃ a ∈ AttrByName(item, "export"). a.args = [StringLiteral(abi)]
HostExportAttr(item) = abi ⇔ ∃ a ∈ AttrByName(item, "host_export"). a.args = [StringLiteral(abi)]
```

```text
StringText(tok) = s ⇔ tok.kind = StringLiteral ∧ T = Lexeme(tok) ∧ StringBytesFrom(T, 1, |T|-1) = bytes ∧ DecodeUTF8(bytes) = s
ExternAbiName(abi_opt) = "C"    if abi_opt = ⊥
```

ExternAbiName(abi_opt) = s      if abi_opt = IdentAbi(s)

```text
ExternAbiName(abi_opt) = s      if abi_opt = StringAbi(tok) ∧ StringText(tok) = s
ExternAbiExplicit(abi_opt) ⇔ abi_opt ≠ ⊥
ExternAbiOf(proc) = abi_opt ⇔ ExternBlockOf(proc) = ExternBlock(_, _, abi_opt, _, _, _)
ExternRawName(proc) ⇔ proc = ExternProcDecl(_, _, _, _, _, _, _, _, _, _, _) ∧ ExternAbiName(ExternAbiOf(proc)) ∈ {"C", "C-unwind"}
```

```text
LinkName(item) = sym ⇔
 MangleAttr(item) = `none`                     ∧ sym = RawSym(ItemName(item))
 MangleAttr(item) = s ∧ s ≠ `none`            ∧ sym = RawSym(s)
 MangleAttr(item) undefined ∧ ExternRawName(item)         ∧ sym = RawSym(ItemName(item))
 MangleAttr(item) undefined ∧ ExportAttr(item) defined    ∧ sym = ScopedSym(item)
 MangleAttr(item) undefined ∧ ExportAttr(item) undefined  ∧ sym = ScopedSym(item)
```

```text
HostThunkLinkName(item) = sym ⇔ item = ProcedureDecl(_, _, _, _, _, _, _, _, _, _, _) ∧ HostExportAttr(item) defined ∧ LinkName(item) = sym
```

```text
ItemName(item) = name ⇔ item = ProcedureDecl(_, _, name, _, _, _, _, _, _, _, _)
ItemName(item) = name ⇔ item = ExternProcDecl(_, _, name, _, _, _, _, _, _, _, _)
ItemName(item) = name ⇔ item = StaticDecl(_, _, _, ⟨IdentifierPattern(name), _, _, _, _⟩, _, _)
```

**(Mangle-HostExport-Proc)**

```text
item = ProcedureDecl(attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, params, ret_opt, contract_opt, body, span, doc)    name ≠ "main"    HostExportAttr(item) defined    HostBodySym(item) = sym
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Mangle(item) ⇓ sym
```

**(Mangle-Proc)**

```text
item = ProcedureDecl(attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, params, ret_opt, contract_opt, body, span, doc)    name ≠ "main"    HostExportAttr(item) undefined    LinkName(item) = sym
```

─────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Mangle(item) ⇓ sym
```

**(Mangle-ExternProc)**
item = ExternProcDecl(attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, params, ret_opt, contract_opt, foreign_contracts_opt, span, doc)    LinkName(item) = sym
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Mangle(item) ⇓ sym
```

**(Mangle-Main)**
item = ProcedureDecl(attrs_opt, vis, "main", gen_params_opt, predicate_clause_opt, params, ret_opt, contract_opt, body, span, doc)    MainSigOk(item)    LinkName(item) = sym
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Mangle(item) ⇓ sym
```

**(Mangle-Record-Method)**
item = MethodDecl(attrs_opt, vis, override, name, gen_params_opt, receiver, params, ret_opt, contract_opt, body, span, doc_opt)
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Mangle(item) ⇓ ScopedSym(item)
```

**(Mangle-Class-Method)**
item = ClassMethodDecl(attrs_opt, vis, name, gen_params_opt, receiver, params, ret_opt, contract_opt, body_opt, span, doc_opt)
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Mangle(item) ⇓ ScopedSym(item)
```

**(Mangle-State-Method)**
item = StateMethodDecl(attrs_opt, vis, name, gen_params_opt, recv, params, ret_opt, contract_opt, body, span, doc_opt)
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Mangle(item) ⇓ ScopedSym(item)
```

**(Mangle-Transition)**
item = TransitionDecl(attrs_opt, vis, name, params, target, body, span, doc_opt)
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Mangle(item) ⇓ ScopedSym(item)
```

**(Mangle-Static)**

```text
item = StaticDecl(attrs_opt, vis, mut, binding, span, doc)    StaticName(binding) ≠ ⊥
```

──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Mangle(item) ⇓ ScopedSym(item)
```

**(Mangle-StaticBinding)**
item = StaticBinding(StaticDecl(_, _, _, binding, _, _), x)
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Mangle(item) ⇓ ScopedSym(item)
```

**(Mangle-VTable)**
item = VTableDecl(T, Cl)
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Mangle(item) ⇓ ScopedSym(item)
```

**(Mangle-Literal)**
item = LiteralData(kind, contents)    LiteralID(kind, contents) = id
──────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Mangle(item) ⇓ PathSig(["ultraviolet", "runtime", "literal", id])
```

**(Mangle-DefaultImpl)**
item = DefaultImpl(T, m)
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Mangle(item) ⇓ ScopedSym(item)
```

ClosureIndex(C) returns a unique index for closure C within its enclosing scope.

```text
EnclosingSym(C) = sym ⇔ EnclosingScope(C) = item ∧ Γ ⊢ Mangle(item) ⇓ sym
```

**(Mangle-Closure)**
C = ClosureExpr(params, ret_type_opt, body)    EnclosingSym(C) = sym_enc    ClosureIndex(C) = idx
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Mangle(C) ⇓ PathSig([sym_enc, "_closure" ++ ToString(idx)])
```

**(Mangle-ClosureEnv)**

```text
C = ClosureExpr(params, ret_type_opt, body)    Γ ⊢ Mangle(C) ⇓ sym_closure
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ MangleClosureEnv(C) ⇓ PathSig([sym_closure, "_env"])
```

```text
ClosureCodeSym(C) = sym ⇔ Γ ⊢ Mangle(C) ⇓ sym
```

#### 24.3.2 Linkage for Generated Symbols

LinkageKind = {`internal`, `external`}
LinkageJudg = {Linkage}

**(Linkage-UserItem)**

```text
item ∈ {ProcedureDecl, StaticDecl, MethodDecl}    Vis(item) ∈ {`public`, `internal`}    Γ ⊢ Mangle(item) ⇓ sym
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Linkage(sym) ⇓ `external`
```

**(Linkage-ExternProc)**

```text
item = ExternProcDecl(_, _, _, _, _, _, _, _, _, _, _)    Γ ⊢ Mangle(item) ⇓ sym
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Linkage(sym) ⇓ `external`
```

**(Linkage-UserItem-Internal)**

```text
item ∈ {ProcedureDecl, StaticDecl, MethodDecl}    Vis(item) = `private`    Γ ⊢ Mangle(item) ⇓ sym
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Linkage(sym) ⇓ `internal`
```

**(Linkage-StaticBinding)**

```text
item = StaticBinding(StaticDecl(_, vis, _, _, _, _), x)    vis ∈ {`public`, `internal`}    Γ ⊢ Mangle(item) ⇓ sym
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Linkage(sym) ⇓ `external`
```

**(Linkage-StaticBinding-Internal)**

```text
item = StaticBinding(StaticDecl(_, vis, _, _, _, _), x)    vis = `private`    Γ ⊢ Mangle(item) ⇓ sym
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Linkage(sym) ⇓ `internal`
```

**(Linkage-ClassMethod)**

```text
item = ClassMethodDecl(attrs_opt, vis, name, gen_params_opt, receiver, params, ret_opt, contract_opt, body_opt, span, doc_opt)    body_opt ≠ ⊥    Vis(item) ∈ {`public`, `internal`}    Γ ⊢ Mangle(item) ⇓ sym
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Linkage(sym) ⇓ `external`
```

**(Linkage-ClassMethod-Internal)**

```text
item = ClassMethodDecl(attrs_opt, vis, name, gen_params_opt, receiver, params, ret_opt, contract_opt, body_opt, span, doc_opt)    body_opt ≠ ⊥    Vis(item) = `private`    Γ ⊢ Mangle(item) ⇓ sym
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Linkage(sym) ⇓ `internal`
```

**(Linkage-StateMethod)**

```text
item = StateMethodDecl(attrs_opt, vis, name, gen_params_opt, recv, params, ret_opt, contract_opt, body, span, doc_opt)    Vis(item) ∈ {`public`, `internal`}    Γ ⊢ Mangle(item) ⇓ sym
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Linkage(sym) ⇓ `external`
```

**(Linkage-StateMethod-Internal)**

```text
item = StateMethodDecl(attrs_opt, vis, name, gen_params_opt, recv, params, ret_opt, contract_opt, body, span, doc_opt)    Vis(item) = `private`    Γ ⊢ Mangle(item) ⇓ sym
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Linkage(sym) ⇓ `internal`
```

**(Linkage-Transition)**

```text
item = TransitionDecl(attrs_opt, vis, name, params, target, body, span, doc_opt)    Vis(item) ∈ {`public`, `internal`}    Γ ⊢ Mangle(item) ⇓ sym
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Linkage(sym) ⇓ `external`
```

**(Linkage-Transition-Internal)**

```text
item = TransitionDecl(attrs_opt, vis, name, params, target, body, span, doc_opt)    Vis(item) = `private`    Γ ⊢ Mangle(item) ⇓ sym
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Linkage(sym) ⇓ `internal`
```

**(Linkage-InitFn)**

```text
InitFn(m) ⇓ sym
```

──────────────────────────────────────

```text
Γ ⊢ Linkage(sym) ⇓ `internal`
```

**(Linkage-DeinitFn)**

```text
DeinitFn(m) ⇓ sym
```

────────────────────────────────────────

```text
Γ ⊢ Linkage(sym) ⇓ `internal`
```

**(Linkage-VTable)**

```text
Mangle(VTableDecl(T, Cl)) ⇓ sym
```

────────────────────────────────────────────

```text
Γ ⊢ Linkage(sym) ⇓ `internal`
```

**(Linkage-LiteralData)**

```text
Mangle(LiteralData(kind, contents)) ⇓ sym
```

─────────────────────────────────────────────────

```text
Γ ⊢ Linkage(sym) ⇓ `internal`
```

**(Linkage-DropGlue)**

```text
DropGlueSym(T) ⇓ sym
```

─────────────────────────────────────────

```text
Γ ⊢ Linkage(sym) ⇓ `internal`
```

**(Linkage-DefaultImpl)**

```text
item = DefaultImpl(T, m)    Vis(m) ∈ {`public`, `internal`}    Γ ⊢ Mangle(item) ⇓ sym
```

──────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Linkage(sym) ⇓ `external`
```

**(Linkage-DefaultImpl-Internal)**

```text
item = DefaultImpl(T, m)    Vis(m) = `private`    Γ ⊢ Mangle(item) ⇓ sym
```

─────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Linkage(sym) ⇓ `internal`
```

**(Linkage-PanicSym)**

```text
PanicSym ⇓ sym
```

────────────────────────────────

```text
Γ ⊢ Linkage(sym) ⇓ `internal`
```

**(Linkage-BuiltinModalSym)**

```text
BuiltinModalSym(proc) ⇓ sym
```

─────────────────────────────────────

```text
Γ ⊢ Linkage(sym) ⇓ `internal`
```

**(Linkage-BuiltinSym)**

```text
BuiltinSym(method) ⇓ sym
```

──────────────────────────────────────

```text
Γ ⊢ Linkage(sym) ⇓ `internal`
```

**(Linkage-EntrySym)**

```text
EntrySym ⇓ sym
```

────────────────────────────────

```text
Γ ⊢ Linkage(sym) ⇓ `external`
```

### 24.4 Initialization and Program Lifecycle

#### 24.4.1 Static Globals and Module Init/Deinit Lowering

GlobalsJudg = {EmitGlobal, InitFn, DeinitFn, Lower-StaticInit, Lower-StaticInitItem, Lower-StaticInitItems, InitCallIR, Lower-StaticDeinit, Lower-StaticDeinitNames, Lower-StaticDeinitItem, Lower-StaticDeinitItems, DeinitCallIR, EmitInitPlan, EmitDeinitPlan, EmitStringLit, EmitBytesLit, InitPanicHandle}

ConstInitJudg = {ConstInit}

```text
Γ ⊢ ConstInit(e) ⇓ bytes ⇔ e = Literal(lit) ∧ Γ ⊢ EncodeConst(ExprType(e), lit) ⇓ bytes
```

StaticName(binding) =

```text
 name    if binding = ⟨IdentifierPattern(name), ty_opt, op, init, span⟩
 ⊥       otherwise
```

```text
StaticBindTypes(binding) = B ⇔ binding = ⟨pat, ty_opt, op, init, _⟩ ∧ Γ ⊢ pat ⇐ BindType(binding) ⊣ B
```

```text
StaticBindList(binding) = PatNames(pat) ⇔ binding = ⟨pat, _, _, _, _⟩
```

```text
StaticBinding : StaticDecl × Name → StaticDecl
```

StaticSym(StaticDecl(_, _, _, binding, _, _), x) =
 Mangle(StaticDecl(_, _, _, binding, _, _))    if StaticName(binding) = x
 Mangle(StaticBinding(StaticDecl(_, _, _, binding, _, _), x))    otherwise

**(Emit-Static-Const)**

```text
item = StaticDecl(attrs_opt, vis, mut, binding, span, doc)    mut = `let`    StaticName(binding) = name    binding = ⟨pat, ty_opt, op, init, _⟩    Γ ⊢ ConstInit(init) ⇓ bytes    Γ ⊢ Mangle(item) ⇓ sym
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EmitGlobal(item) ⇓ [GlobalConst(sym, bytes)]
```

**(Emit-Static-Init)**

```text
item = StaticDecl(attrs_opt, vis, mut, binding, span, doc)    StaticName(binding) = name    binding = ⟨pat, ty_opt, op, init, _⟩    ((mut = `var`) ∨ (Γ ⊢ ConstInit(init) ⇑))    T = ExprType(init)    Γ ⊢ Mangle(item) ⇓ sym
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EmitGlobal(item) ⇓ [GlobalZero(sym, sizeof(T))]
```

**(Emit-Static-Multi)**

```text
item = StaticDecl(attrs_opt, vis, mut, binding, span, doc)    StaticName(binding) = ⊥    StaticBindTypes(binding) = B    StaticBindList(binding) = [x_1, …, x_k]    ∀ i, Γ ⊢ Mangle(StaticBinding(item, x_i)) ⇓ sym_i
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EmitGlobal(item) ⇓ [GlobalZero(sym_1, sizeof(B[x_1])), …, GlobalZero(sym_k, sizeof(B[x_k]))]
```

InitSym(m) = PathSig(["ultraviolet", "runtime", "init"] ++ PathOfModule(m))

**(InitFn)**
InitSym(m) = sym
──────────────────────────────

```text
Γ ⊢ InitFn(m) ⇓ sym
```

DeinitSym(m) = PathSig(["ultraviolet", "runtime", "deinit"] ++ PathOfModule(m))

**(DeinitFn)**
DeinitSym(m) = sym
──────────────────────────────

```text
Γ ⊢ DeinitFn(m) ⇓ sym
```

```text
StaticItems(P, m) = [ item | item ∈ ASTModule(P, m).items ∧ item = StaticDecl(_, _, _, _, _, _) ]
```

```text
StaticItemOf(path, name) = item ⇔ m = path ∧ item ∈ StaticItems(Project(Γ), m) ∧ item = StaticDecl(_, _, _, binding, _, _) ∧ name ∈ StaticBindList(binding) ∧ ∀ item'. (item' ∈ StaticItems(Project(Γ), m) ∧ item' = StaticDecl(_, _, _, binding', _, _) ∧ name ∈ StaticBindList(binding')) ⇒ item' = item
```

```text
StaticSymPath(path, name) = StaticSym(item, name) ⇔ StaticItemOf(path, name) = item
```

```text
StaticAddr(path, name) = addr ⇔ ∃ sym. StaticSymPath(path, name) = sym ∧ AddrOfSym(sym) = addr
```

For hosted-library session execution, §24.4.1 reinterprets the `AddrOfSym(sym)` occurrence above session-locally for every hosted-state symbol.

```text
AddrOfSym : Symbol → Addr
```

```text
StaticType(path, name) = StaticBindTypes(binding)[name] ⇔ StaticItemOf(path, name) = StaticDecl(_, _, mut, binding, _, _)
```

```text
StaticBindInfo(path, name) = BindInfoMap(λ U. RespOfInit(init), StaticBindTypes(binding), MovOf(op), mut)[name] ⇔ StaticItemOf(path, name) = StaticDecl(_, _, mut, binding, _, _) ∧ binding = ⟨_, _, op, init, _⟩
```

```text
SeqIRList([]) = ε
```

SeqIRList([IR] ++ IRs) = SeqIR(IR, SeqIRList(IRs))

```text
StaticStoreIR(item, []) = ε
StaticStoreIR(item, [⟨x, v⟩] ++ bs) = SeqIR(StoreGlobal(StaticSym(item, x), v), StaticStoreIR(item, bs))
```

**(Lower-StaticInit-Item)**

```text
item = StaticDecl(attrs_opt, vis, mut, binding, span, doc)    binding = ⟨pat, ty_opt, op, init, _⟩    Γ ⊢ LowerExpr(init) ⇓ ⟨IR_e, v⟩    Γ ⊢ MatchPattern(pat, v) ⇓ B    BindOrder(pat, B) = binds    Γ ⊢ InitPanicHandle(m) ⇓ IR_p
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Lower-StaticInitItem(m, item) ⇓ SeqIR(IR_e, StaticStoreIR(item, binds), IR_p)
```

**(Lower-StaticInitItems-Empty)**
──────────────────────────────────────────────────────────

```text
Γ ⊢ Lower-StaticInitItems(m, []) ⇓ ε
```

**(Lower-StaticInitItems-Cons)**

```text
Γ ⊢ Lower-StaticInitItem(m, item) ⇓ IR_i    Γ ⊢ Lower-StaticInitItems(m, items) ⇓ IR_r
```

────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Lower-StaticInitItems(m, [item] ++ items) ⇓ SeqIR(IR_i, IR_r)
```

**(Lower-StaticInit)**

```text
StaticItems(Project(Γ), m) = items    Γ ⊢ Lower-StaticInitItems(m, items) ⇓ IR
```

──────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Lower-StaticInit(m) ⇓ IR
```

**(InitCallIR)**

```text
Γ ⊢ InitFn(m) ⇓ sym
```

────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ InitCallIR(m) ⇓ SeqIR(CallIR(sym, [PanicOutName]), PanicCheck)
```

Rev([]) = []
Rev([x] ++ xs) = Rev(xs) ++ [x]

**(Lower-StaticDeinitNames-Empty)**
────────────────────────────────────────────────────────────────

```text
Γ ⊢ Lower-StaticDeinitNames(path, item, []) ⇓ ε
```

**(Lower-StaticDeinitNames-Cons-Resp)**

```text
StaticBindInfo(path, x).resp = resp    sym = StaticSym(item, x)    Γ ⊢ StateRef(sym) ⇓ slot    Γ ⊢ EmitDrop(StaticType(path, x), Load(slot, StaticType(path, x))) ⇓ IR_d    Γ ⊢ Lower-StaticDeinitNames(path, item, xs) ⇓ IR_r
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Lower-StaticDeinitNames(path, item, [x] ++ xs) ⇓ SeqIR(IR_d, IR_r)
```

**(Lower-StaticDeinitNames-Cons-NoResp)**

```text
StaticBindInfo(path, x).resp ≠ resp    Γ ⊢ Lower-StaticDeinitNames(path, item, xs) ⇓ IR_r
```

──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Lower-StaticDeinitNames(path, item, [x] ++ xs) ⇓ IR_r
```

**(Lower-StaticDeinit-Item)**

```text
item = StaticDecl(attrs_opt, vis, mut, binding, span, doc)    binding = ⟨pat, _, _, _, _⟩    xs = Rev(StaticBindList(binding))    Γ ⊢ Lower-StaticDeinitNames(PathOfModule(m), item, xs) ⇓ IR
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Lower-StaticDeinitItem(m, item) ⇓ IR
```

**(Lower-StaticDeinitItems-Empty)**
────────────────────────────────────────────────────────────

```text
Γ ⊢ Lower-StaticDeinitItems(m, []) ⇓ ε
```

**(Lower-StaticDeinitItems-Cons)**

```text
Γ ⊢ Lower-StaticDeinitItem(m, item) ⇓ IR_i    Γ ⊢ Lower-StaticDeinitItems(m, items) ⇓ IR_r
```

────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Lower-StaticDeinitItems(m, [item] ++ items) ⇓ SeqIR(IR_i, IR_r)
```

**(Lower-StaticDeinit)**

```text
StaticItems(Project(Γ), m) = items    Γ ⊢ Lower-StaticDeinitItems(m, Rev(items)) ⇓ IR
```

────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Lower-StaticDeinit(m) ⇓ IR
```

**(DeinitCallIR)**

```text
Γ ⊢ DeinitFn(m) ⇓ sym
```

──────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ DeinitCallIR(m) ⇓ SeqIR(CallIR(sym, [PanicOutName]), PanicCheck)
```

```text
AddrOfSessionSym : Session × Symbol → Addr
SessionPanicRecordOf : Store × Session → ⟨pending, code⟩
SessionPanicRecordInit(σ, h) ⇔ SessionPanicRecordOf(σ, h) = ⟨false, 0⟩
```

```text
HostedStateSym(P, sym) ⇔ HostedLibrary(P) ∧ ((∃ m, name. m ∈ P.modules ∧ StaticSymPath(m, name) = sym) ∨ (∃ m. m ∈ P.modules ∧ Γ ⊢ PoisonFlag(m) ⇓ sym))
SharedLibraryStateSym(P, sym) ⇔ SharedLibrary(P) ∧ ((∃ m, name. m ∈ P.modules ∧ StaticSymPath(m, name) = sym) ∨ (∃ m. m ∈ P.modules ∧ Γ ⊢ PoisonFlag(m) ⇓ sym))
RawExportLibrary(P) ⇔ SharedLibrary(P) ∧ RawExports(P) ≠ [] ∧ ¬ HostedLibrary(P)
RawLibraryStateSym(P, sym) ⇔ RawExportLibrary(P) ∧ SharedLibraryStateSym(P, sym)
HostedStateJudg = {Γ ⊢ SessionStateInitSigma(P, h, σ) ⇓ σ', Γ ⊢ SessionStateDestroySigma(P, h, σ) ⇓ σ'}
```

```text
A conforming implementation MUST ensure that whenever `Γ ⊢ SessionStateInitSigma(P, h, σ) ⇓ σ'`, `ReadAddr(σ', AddrOfSessionSym(h, sym))` is defined for every `sym` satisfying `HostedStateSym(P, sym)`, and the initial contents of that cell equal the value denoted by the `GlobalConst` or `GlobalZero` template emitted for `sym` by §§24.4.1, 24.7.8, and 24.7.13.
```

```text
A conforming implementation MUST ensure that whenever `Γ ⊢ SessionStateDestroySigma(P, h, σ) ⇓ σ'`, the cells previously reachable at `AddrOfSessionSym(h, sym)` for `HostedStateSym(P, sym)` are no longer live.
```

```text
For `HostedLibrary(P)` as defined by §23.3.10, every user-static storage cell, poison flag, and boundary panic record consumed by Chapters 6, 24.4, and 24.5 MUST be indexed by the live hosted session within the dynamic extent of `HostSessionInitSigma`, `HostedCallSigma`, and `HostSessionDestroySigma`. Within those hosted-session dynamic extents, every occurrence of `AddrOfSym(sym)` in those rules with `HostedStateSym(P, sym)` MUST be interpreted as `AddrOfSessionSym(h, sym)` for the active hosted session `h`, and every boundary panic-record operation MUST be interpreted through `SessionPanicRecordOf(_, h)`. For `HostedLibrary(P) ∧ SharedLibrary(P)`, when execution occurs outside those hosted-session dynamic extents but within one live loaded library image `i`, every occurrence of `AddrOfSym(sym)` in Chapters 6, 24.4, and 24.5 with `HostedStateSym(P, sym)` MUST instead be interpreted as `AddrOfImageSym(i, sym)`, and every boundary panic-record operation MUST be interpreted through `ImagePanicRecordOf(_, i)`. Executables and libraries that are not shared libraries continue to use the process-global interpretation of `AddrOfSym(sym)` and `PanicRecordOf(_)` outside hosted-session dynamic extents.
```

#### 24.4.2 Initialization Order, Poisoning, and Project Lifecycle

Section §11.5.4 supplies the eager static-initialization dependency graph `G_e`. This section defines only the ordering and execution semantics that consume that graph.

```text
Vertices(G_e) = V ⇔ G_e = ⟨V, E⟩
Edges(G_e) = E ⇔ G_e = ⟨V, E⟩
Index(L, x) = i ⇔ 0 ≤ i < |L| ∧ L[i] = x
TopoOrder(G_e, L) ⇔ Distinct(L) ∧ Set(L) = Vertices(G_e) ∧ ∀ (u, v) ∈ Edges(G_e). Index(L, u) < Index(L, v)
Incomparable_{G_e}(u, v) ⇔ ¬ Reachable(u, v, Edges(G_e)) ∧ ¬ Reachable(v, u, Edges(G_e))
TopoTieBreak(G_e, L, P) ⇔ ∀ u, v ∈ Vertices(G_e). Incomparable_{G_e}(u, v) ∧ Index(P.modules, u) < Index(P.modules, v) ⇒ Index(L, u) < Index(L, v)
Cycle(G_e) ⇔ ∃ v ∈ Vertices(G_e). Reachable(v, v, Edges(G_e))
```

**(Topo-Ok)**

```text
Project(Γ) = P    Γ ⊢ G_e : DAG    TopoOrder(G_e, L)    TopoTieBreak(G_e, L, P)
```

──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Topo(G_e) ⇓ L
```

**(Topo-Cycle)**
Cycle(G_e)    c = Code(Topo-Cycle)
──────────────────────────────────────

```text
Γ ⊢ Topo(G_e) ⇑ c
```

```text
P = Project(Γ)
StaticInitOf(item) = init ⇔ item = StaticDecl(attrs_opt, vis, mut, binding, span, doc) ∧ binding = ⟨pat, ty_opt, op, init, sp⟩
StaticInitOf(item) = ⊥ ⇔ item ∉ StaticDecl(_, _, _, _, _, _)
InitList(m) = [ init | item ∈ Items(P, m) ∧ StaticInitOf(item) = init ]
```

```text
InitOrder(G_e) = L ⇔ Γ ⊢ Topo(G_e) ⇓ L
InitPlan(G_e) = ++_{m ∈ InitOrder(G_e)} InitList(m)
```

DeinitOrder(G_e) = rev(InitOrder(G_e))

```text
StaticBindOrder(m) = ++_{item ∈ StaticItems(P, m), item = StaticDecl(attrs_opt, vis, mut, binding, span, doc)} [⟨PathOfModule(m), x⟩ | x ∈ StaticBindList(binding)]
```

```text
GlobalStaticOrder = ++_{m ∈ InitOrder(G_e)} StaticBindOrder(m)
```

```text
DeinitList(P) = rev([ DropStatic(path, name) | ⟨path, name⟩ ∈ GlobalStaticOrder ∧ StaticBindInfo(path, name).resp = resp ])
```

```text
Γ ⊢ Eval(e, σ) ⇓ v ⇔ ∃ σ'. Γ ⊢ EvalSigma(e, σ) ⇓ (Val(v), σ')
Γ ⊢ Eval(e, σ) ⇑ panic ⇔ ∃ σ'. Γ ⊢ EvalSigma(e, σ) ⇓ (Ctrl(Panic), σ')
```

**(EmitInitPlan)**

```text
InitOrder = [m_1, …, m_k]    ∀ i, Γ ⊢ InitCallIR(m_i) ⇓ IR_i    IR_init = SeqIRList([IR_1, …, IR_k])
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EmitInitPlan(P) ⇓ IR_init
```

**(EmitInitPlan-Err)**

```text
∃ m ∈ InitOrder. Γ ⊢ InitFn(m) ⇑
```

────────────────────────────────────────

```text
Γ ⊢ EmitInitPlan(P) ⇑
```

**(EmitDeinitPlan)**

```text
InitOrder = [m_1, …, m_k]    ∀ i, Γ ⊢ DeinitCallIR(m_i) ⇓ IR_i    IR_deinit = SeqIRList(Rev([IR_1, …, IR_k]))
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EmitDeinitPlan(P) ⇓ IR_deinit
```

**(EmitDeinitPlan-Err)**

```text
∃ m ∈ InitOrder. Γ ⊢ DeinitFn(m) ⇑
```

──────────────────────────────────────────

```text
Γ ⊢ EmitDeinitPlan(P) ⇑
```

```text
InitState = {InitStart(G_e, L, σ), InitMod(L, mi, ii, P, σ), InitDone(σ), InitPanic(P, σ)}
InitItem(L, mi, ii) = e ⇔ mi < |L| ∧ L[mi] = m ∧ InitList(m)[ii] = e
InitLen(L, mi) = k ⇔ mi < |L| ∧ L[mi] = m ∧ |InitList(m)| = k
```

**(Init-Start)**
──────────────────────────────────────────────────────────────────────────

```text
⟨InitStart(G_e, L, σ)⟩ → ⟨InitMod(L, 0, 0, ∅, σ)⟩
```

**(Init-Step)**

```text
InitItem(L, mi, ii) = e    Γ ⊢ EvalSigma(e, σ) ⇓ (Val(v), σ')
```

────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨InitMod(L, mi, ii, P, σ)⟩ → ⟨InitMod(L, mi, ii + 1, P, σ')⟩
```

**(Init-Next-Module)**
InitLen(L, mi) = k    ii = k
──────────────────────────────────────────────────────────────

```text
⟨InitMod(L, mi, ii, P, σ)⟩ → ⟨InitMod(L, mi + 1, 0, P, σ)⟩
```

**(Init-Panic)**

```text
InitItem(L, mi, ii) = e    Γ ⊢ EvalSigma(e, σ) ⇓ (Ctrl(Panic), σ')    L[mi] = m    P' = P ∪ {m} ∪ {x | Reachable(x, m, E_val^{eager})}
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨InitMod(L, mi, ii, P, σ)⟩ → ⟨InitPanic(P', σ')⟩
```

**(Init-Done)**
mi = |L|
────────────────────────────────────────────────

```text
⟨InitMod(L, mi, ii, P, σ)⟩ → ⟨InitDone(σ)⟩
```

**(Init-Ok)**

```text
⟨InitStart(G_e, InitOrder(G_e), σ)⟩ →* ⟨InitDone(σ')⟩
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ Init(G_e, σ) ⇓ σ'
```

**(Init-Fail)**

```text
⟨InitStart(G_e, InitOrder(G_e), σ)⟩ →* ⟨InitPanic(P, σ')⟩
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ Init(G_e, σ) ⇑ panic(P)
```

**(Deinit-Ok)**

```text
Γ ⊢ Cleanup(DeinitList(P), σ) ⇓ (ok, σ')
```

───────────────────────────────────────────────────────────

```text
Γ ⊢ Deinit(P, σ) ⇓ σ'
```

**(Deinit-Panic)**

```text
Γ ⊢ Cleanup(DeinitList(P), σ) ⇓ (panic, σ')
```

───────────────────────────────────────────────────────────

```text
Γ ⊢ Deinit(P, σ) ⇑ panic
```

#### 24.4.3 Entry Symbols and Context Construction

```text
EntryJudg = {EntrySym ⇓ sym, ContextInitSym ⇓ sym, EntryStub(P) ⇓ IRDecl}
```

**(EntrySym-Decl)**
──────────────────────────────────────────────

```text
Γ ⊢ EntrySym ⇓ PathSig(["main"])
```

**(ContextInitSym-Decl)**
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ContextInitSym ⇓ PathSig(["ultraviolet", "runtime", "context_init"])
```

```text
ProcessInvocation = ⟨executable_path, arguments, current_directory⟩
```

```text
ProcessInvocationNormalization(host) ⇓ inv ⇔
  inv.executable_path is the host executable path normalized to UTF-8 text ∧
```

  inv.arguments is the ordered list of host command arguments after the executable path,

```text
    each normalized to UTF-8 text ∧
```

  inv.current_directory is the host current working directory normalized to UTF-8 text

A conforming runtime MUST isolate platform-specific process startup, argv, path
encoding, and current-directory acquisition behind the runtime host/platform
boundary. Source programs observe only the normalized `System` methods defined
by `SystemInterface`.

```text
PanicRecordInit(σ) ⇔ PanicRecordOf(σ) = ⟨false, 0⟩
EntryStubSpec(P, IR_entry) ⇔ Executable(P) ∧ ∃ d, main_sym. MainDecls(P) = [d] ∧ Γ ⊢ Mangle(d) ⇓ main_sym ∧ ∀ σ. ∃ ctx, arg, ret, c, σ_1, σ_2, σ_3.
 ExecIRSigma(CallIR(ContextInitSym, []), σ) ⇓ (Val(ctx), σ_1) ∧ ContextBundleBuild(StripPerm(MainArgType(d)), ctx) ⇓ arg ∧ PanicRecordInit(σ_1) ∧ ExecIRSigma(CallIR(main_sym, [arg, PanicOutName]), σ_1) ⇓ (Val(ret), σ_2) ∧
 (PanicRecordOf(σ_2) = ⟨true, c⟩ ⇒ ExecIRSigma(CallIR(PanicSym, [c]), σ_2) ⇓ (Ctrl(Panic), σ_3)) ∧
 (PanicRecordOf(σ_2) = ⟨false, c⟩ ⇒ ∃ IR_d. Γ ⊢ EmitDeinitPlan(P) ⇓ IR_d ∧ ExecIRSigma(IR_d, σ_2) ⇓ (Val(()), σ_3)) ∧
 (PanicRecordOf(σ_2) = ⟨true, c⟩ ⇒ ExecIRSigma(IR_entry, σ) ⇓ (Ctrl(Panic), σ_3)) ∧
 (PanicRecordOf(σ_2) = ⟨false, c⟩ ⇒ ExecIRSigma(IR_entry, σ) ⇓ (Val(ret), σ_3))
```

**(EntryStub-Decl)**

```text
Γ ⊢ EntrySym ⇓ sym    EntryStubSpec(P, IR_entry)
```

──────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EntryStub(P) ⇓ ProcIR(sym, [], TypePrim("i32"), IR_entry)
```

**(EntrySym-Err)**
EntrySym undefined
────────────────────

```text
Γ ⊢ EntrySym ⇑
```

**(EntryStub-Err)**
EntryStub(P) undefined
────────────────────────

```text
Γ ⊢ EntryStub(P) ⇑
```

#### 24.4.4 Library Images and Hosted Library Sessions

```text
LibraryImageJudg = {Γ ⊢ LibraryImageInitSigma(P, i, σ) ⇓ σ', Γ ⊢ RawLibraryCallSigma(P, i, d, vs, σ) ⇓ (out, σ'), Γ ⊢ LibraryImageDestroySigma(P, i, σ) ⇓ σ'}
```

LibraryImageHandle(i) is an abstract predicate over loaded shared-library images.

```text
LibraryImageValid(P, i, σ) ⇔ LibraryImageHandle(i) ∧ LibraryImageOwner(i) = P ∧ LibraryImageLive(i, σ)
LibraryImageOwner : LibraryImage → Project
LibraryImageLive : LibraryImage × Store → Bool
AddrOfImageSym : LibraryImage × Symbol → Addr
ImagePanicRecordOf : Store × LibraryImage → ⟨pending, code⟩
ImagePanicRecordInit(σ, i) ⇔ ImagePanicRecordOf(σ, i) = ⟨false, 0⟩
DistinctLibraryImageState(σ) ⇔ ∀ i_1, i_2. i_1 ≠ i_2 ∧ LibraryImageLive(i_1, σ) ∧ LibraryImageLive(i_2, σ) ⇒ ∀ sym. (SharedLibraryStateSym(LibraryImageOwner(i_1), sym) ∨ SharedLibraryStateSym(LibraryImageOwner(i_2), sym)) ⇒ AddrOfImageSym(i_1, sym) ≠ AddrOfImageSym(i_2, sym)
```

```text
A conforming implementation MUST ensure `DistinctLibraryImageState(σ)` for every store `σ`.
A conforming implementation MUST ensure that every successful `LibraryImageInitSigma(P, i, σ) ⇓ σ'` establishes `LibraryImageLive(i, σ')`, every successful `RawLibraryCallSigma(P, i, d, vs, σ) ⇓ (out, σ')` establishes `LibraryImageLive(i, σ')`, and every successful `LibraryImageDestroySigma(P, i, σ) ⇓ σ'` establishes `¬ LibraryImageLive(i, σ')`.
A conforming implementation MUST ensure that whenever `Γ ⊢ LibraryImageInitSigma(P, i, σ) ⇓ σ'`, `ReadAddr(σ', AddrOfImageSym(i, sym))` is defined for every `sym` satisfying `SharedLibraryStateSym(P, sym)`, and the initial contents of that cell equal the value denoted by the `GlobalConst` or `GlobalZero` template emitted for `sym` by §§24.4.1, 24.7.8, and 24.7.13.
A conforming implementation MUST ensure that whenever `Γ ⊢ LibraryImageDestroySigma(P, i, σ) ⇓ σ'`, the cells previously reachable at `AddrOfImageSym(i, sym)` for `SharedLibraryStateSym(P, sym)` are no longer live.
For `SharedLibrary(P)`, within the dynamic extent of `LibraryImageInitSigma(P, i, σ)` and `LibraryImageDestroySigma(P, i, σ)`, every occurrence of `AddrOfSym(sym)` in Chapters 6, 24.4, and 24.5 with `SharedLibraryStateSym(P, sym)` MUST be interpreted as `AddrOfImageSym(i, sym)` for the active loaded image `i`, and every boundary panic-record operation MUST be interpreted through `ImagePanicRecordOf(_, i)`. For `RawExportLibrary(P)`, that same image interpretation also governs `RawLibraryCallSigma(P, i, d, vs, σ)`.
If initialization of one module `m_j` within `LibraryImageInitSigma(P, i, σ)` or `HostSessionInitSigma(P, σ)` panics after only a strict prefix of that module's responsible static bindings has completed `StaticStoreIR`, cleanup MUST be limited to the successfully initialized prefix. The implementation MUST execute `DropStaticActionOut(m_j, x_t), ..., DropStaticActionOut(m_j, x_1)` only for the completed prefix `[x_1, ..., x_t]` in reverse order, MUST NOT execute the remaining static deinit actions of `m_j`, MUST execute full module deinit only for the earlier modules whose init completed successfully, and MUST NOT deinitialize any later module.
```

```text
A raw export call from foreign code on `RawExportLibrary(P)` occurs only with one live loaded library image `i` owned by `P`. Before the first raw export call through a newly loaded image, the implementation MUST establish that live image by `LibraryImageInitSigma(P, i, σ)`. Later raw export calls through the same live image MUST reuse that image-owned state. On library unload of that live image, the implementation MUST execute `LibraryImageDestroySigma(P, i, σ)` exactly once.
An ordinary Ultraviolet call that crosses a shared-library link boundary into `SharedLibrary(P)` likewise occurs only with one live loaded library image `i` owned by `P`. Before the first such linked call through a newly loaded image, the implementation MUST establish that live image by `LibraryImageInitSigma(P, i, σ)`. Later linked calls through the same live image MUST reuse that image-owned state. On library unload of that live image, the implementation MUST execute `LibraryImageDestroySigma(P, i, σ)` exactly once.
On targets whose shared-library linker selects one loader entrypoint symbol for process attach/detach, a conforming backend MUST emit exactly one backend-generated loader entrypoint for each linked image of `SharedLibrary(P)`. That loader entrypoint is not a user-declared `ProcedureDecl`. It MUST establish `LibraryImageInitSigma(P, i, σ)` before user code first becomes callable from that image, MUST execute `LibraryImageDestroySigma(P, i, σ)` on image unload, and MUST NOT expose any additional capability-bearing parameter to Ultraviolet user code.
```

**(LibraryImageInitSigma)**

```text
SharedLibrary(P)    LibraryImageHandle(i)    LibraryImageOwner(i) = P    ImagePanicRecordInit(σ, i)    Γ ⊢ Init(G_e, σ) ⇓ σ'
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LibraryImageInitSigma(P, i, σ) ⇓ σ'
```

**(RawLibraryCallSigma-Ok)**

```text
LibraryImageValid(P, i, σ)    RawExportLibrary(P)    d ∈ RawExports(P)    Γ ⊢ ApplyProcSigma(d, vs, σ) ⇓ (out, σ')
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ RawLibraryCallSigma(P, i, d, vs, σ) ⇓ (out, σ')
```

**(LibraryImageDestroySigma)**

```text
LibraryImageValid(P, i, σ)    SharedLibrary(P)    Γ ⊢ Deinit(P, σ) ⇓ σ'
```

──────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LibraryImageDestroySigma(P, i, σ) ⇓ σ'
```

```text
HostedSessionJudg = {Γ ⊢ HostSessionInitSigma(P, σ) ⇓ (Val(h), σ'), Γ ⊢ HostedCallSigma(P, h, d, vs, σ) ⇓ (out, σ'), Γ ⊢ HostSessionDestroySigma(P, h, σ) ⇓ σ'}
```

SessionHandle(h) is an abstract predicate over hosted-library session handles. At the foreign ABI, hosted-library session handles are represented as nonzero `usize` tokens.

```text
SessionValid(P, h, σ) ⇔ SessionHandle(h) ∧ HostedSessionOwner(h) = P ∧ SessionLive(h, σ)
SessionReady(P, h, σ) ⇔ SessionValid(P, h, σ) ∧ ¬ SessionBusy(h, σ)
HostedSessionOwner : Session → Project
SessionContext : Session → Value
HostedGrantedCaps : Project × Session → 𝒫(CapToken)
HostedGrantVisible(P, h, T) ⇔ CapInType(StripPerm(T)) ⊆ HostedGrantedCaps(P, h)
SessionLive : Session × Store → Bool
SessionBusy : Session × Store → Bool
DistinctHostedState(σ) ⇔ ∀ h_1, h_2. h_1 ≠ h_2 ∧ SessionLive(h_1, σ) ∧ SessionLive(h_2, σ) ⇒ ∀ sym. (HostedStateSym(HostedSessionOwner(h_1), sym) ∨ HostedStateSym(HostedSessionOwner(h_2), sym)) ⇒ AddrOfSessionSym(h_1, sym) ≠ AddrOfSessionSym(h_2, sym)
```

```text
A conforming implementation MUST ensure `DistinctHostedState(σ)` for every store `σ`.
A conforming implementation MUST ensure that every successful `HostSessionInitSigma(P, σ) ⇓ (Val(h), σ')` establishes `SessionLive(h, σ') ∧ ¬ SessionBusy(h, σ') ∧ HostedGrantedCaps(P, h) = HostedRootCaps(P)`, every successful `HostedCallSigma(P, h, d, vs, σ) ⇓ (out, σ')` establishes `SessionLive(h, σ') ∧ ¬ SessionBusy(h, σ')`, and every successful `HostSessionDestroySigma(P, h, σ) ⇓ σ'` establishes `¬ SessionLive(h, σ')`.
```

A hosted-library session MUST NOT be entered concurrently or reentrantly. While one hosted call or destroy operation on `h` is in progress, the implementation MUST treat `SessionBusy(h, _)` as true for that operation and MUST reject any second hosted entry on the same session according to §23.3.12.

**(HostSessionInitSigma)**

```text
HostedLibrary(P)    Γ ⊢ ContextInitSigma(σ) ⇓ (Val(v_ctx), σ_0)    SessionHandle(h)    HostedSessionOwner(h) = P    SessionContext(h) = v_ctx    HostedGrantedCaps(P, h) = HostedRootCaps(P)    Γ ⊢ SessionStateInitSigma(P, h, σ_0) ⇓ σ_s    SessionPanicRecordInit(σ_s, h)    (∀ d ∈ HostExports(P). HostContextParam(d) = ⟨_, _, T_d⟩ ⇒ HostedGrantVisible(P, h, T_d) ∧ ∃ v_d. ContextBundleBuild(StripPerm(T_d), v_ctx) ⇓ v_d)    Γ ⊢ Init(G_e, σ_s) ⇓ σ_1
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ HostSessionInitSigma(P, σ) ⇓ (Val(h), σ_1)
```

**(HostedCallSigma-Ok)**

```text
SessionReady(P, h, σ)    HostedLibrary(P)    HostExported(d)    d ∈ HostExports(P)    HostContextParam(d) = ⟨_, _, T_ctx⟩    HostedGrantVisible(P, h, T_ctx)    ContextBundleBuild(StripPerm(T_ctx), SessionContext(h)) ⇓ v_ctx    Γ ⊢ ApplyProcSigma(d, [v_ctx] ++ vs, σ) ⇓ (out, σ')
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ HostedCallSigma(P, h, d, vs, σ) ⇓ (out, σ')
```

**(HostSessionDestroySigma)**

```text
SessionReady(P, h, σ)    Γ ⊢ Deinit(P, σ) ⇓ σ_1    Γ ⊢ SessionStateDestroySigma(P, h, σ_1) ⇓ σ'
```

─────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ HostSessionDestroySigma(P, h, σ) ⇓ σ'
```

#### 24.4.5 Interpreter Entrypoint

```text
InterpJudg = {Γ ⊢ ContextInitSigma(σ) ⇓ (Val(v_ctx), σ'), Γ ⊢ InterpretProject(P, σ) ⇓ (out, σ'), Γ ⊢ InterpretProject(P, σ) ⇑ panic(P_s)}
ContextValue(v) ⇔ ∃ bits. ValueBits(TypePath(["Context"]), v) = bits
```

**(ContextInitSigma)**
ContextValue(v_ctx)
────────────────────────────────────────────────────────────

```text
Γ ⊢ ContextInitSigma(σ) ⇓ (Val(v_ctx), σ)
```

**(Interpret-Project-Ok)**

```text
Executable(P)    MainDecls(P) = [d]    MainSigOk(d)    Γ ⊢ ContextInitSigma(σ) ⇓ (Val(v_ctx), σ_0)    Γ ⊢ Init(G_e, σ_0) ⇓ σ_1    ContextBundleBuild(StripPerm(MainArgType(d)), v_ctx) ⇓ v_arg    Γ ⊢ ApplyProcSigma(d, [v_arg], σ_1) ⇓ (Val(v), σ_2)    Γ ⊢ Deinit(P, σ_2) ⇓ σ_3
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ InterpretProject(P, σ) ⇓ (Val(v), σ_3)
```

**(Interpret-Project-Init-Panic)**

```text
Executable(P)    MainDecls(P) = [d]    MainSigOk(d)    Γ ⊢ ContextInitSigma(σ) ⇓ (Val(v_ctx), σ_0)    Γ ⊢ Init(G_e, σ_0) ⇑ panic(P_s)
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ InterpretProject(P, σ) ⇑ panic(P_s)
```

**(Interpret-Project-Main-Ctrl)**

```text
Executable(P)    MainDecls(P) = [d]    MainSigOk(d)    Γ ⊢ ContextInitSigma(σ) ⇓ (Val(v_ctx), σ_0)    Γ ⊢ Init(G_e, σ_0) ⇓ σ_1    ContextBundleBuild(StripPerm(MainArgType(d)), v_ctx) ⇓ v_arg    Γ ⊢ ApplyProcSigma(d, [v_arg], σ_1) ⇓ (Ctrl(κ), σ_2)    κ ∈ {Panic, Abort}
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ InterpretProject(P, σ) ⇓ (Ctrl(κ), σ_2)
```

**(Interpret-Project-Deinit-Panic)**

```text
Executable(P)    MainDecls(P) = [d]    MainSigOk(d)    Γ ⊢ ContextInitSigma(σ) ⇓ (Val(v_ctx), σ_0)    Γ ⊢ Init(G_e, σ_0) ⇓ σ_1    ContextBundleBuild(StripPerm(MainArgType(d)), v_ctx) ⇓ v_arg    Γ ⊢ ApplyProcSigma(d, [v_arg], σ_1) ⇓ (Val(v), σ_2)    Γ ⊢ Deinit(P, σ_2) ⇑ panic
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ InterpretProject(P, σ) ⇑ panic
```

### 24.5 Cleanup, Drop, and Unwinding Framework

Dynamic scope-stack, binding-state, and region-stack machinery are defined by Chapter 6. This section defines only the cleanup, panic, drop, and unwinding framework that consumes those runtime structures.

#### 24.5.1 Cleanup Lowering Interface

CleanupJudg = {EmitDrop, CleanupPlan, LowerPanic, PanicSym, ClearPanic, PanicCheck}

**(CleanupPlan)**
cs = CleanupList(scope)
────────────────────────────────────────────

```text
Γ ⊢ CleanupPlan(scope) ⇓ cs
```

```text
EmitDropSpec(Γ, T, v, IR) ⇔ ∀ σ, ExecIRSigma(IR, σ) ⇓ (out, σ') ∧ Γ ⊢ DropValue(T, v, ∅) ⇓ σ'
Γ ⊢ EmitDrop(T, v) ⇓ IR ⇔ EmitDropSpec(Γ, T, v, IR).
```

#### 24.5.2 Panic Record and Panic Lowering

```text
PanicOutAddr(σ) = addr ⇔ LookupVal(σ, PanicOutName) = RawPtr(`mut`, addr)
```

```text
PanicRecordOf(σ) = ⟨p, c⟩ ⇔ PanicOutAddr(σ) = addr ∧ ReadAddr(σ, FieldAddr(PanicRecord, addr, "panic")) = p ∧ ReadAddr(σ, FieldAddr(PanicRecord, addr, "code")) = c
```

```text
WritePanicRecord(σ, p, c) ⇓ σ' ⇔ WriteAddr(σ, FieldAddr(PanicRecord, PanicOutAddr(σ), "panic"), p) ⇓ σ_1 ∧ WriteAddr(σ_1, FieldAddr(PanicRecord, PanicOutAddr(σ), "code"), c) ⇓ σ'
```

```text
Γ ⊢ InitPanicHandle(m) ⇓ IR ⇔ ∀ σ. (PanicRecordOf(σ) = ⟨true, c⟩ ⇒ ∃ σ'. ExecIRSigma(IR, σ) ⇓ (Ctrl(Panic), σ') ∧ ExecIRSigma(SeqIR(SetPoison(m), LowerPanic(InitPanic(m))), σ) ⇓ (Ctrl(Panic), σ')) ∧ (PanicRecordOf(σ) = ⟨false, c⟩ ⇒ ExecIRSigma(IR, σ) ⇓ (Val(()), σ))
```

During lowering of one module-init procedure, the cleanup performed by `InitPanicHandle(m)` MUST be exactly the reverse of the currently completed responsible-static prefix of `m`. `InitPanicHandle(m)` MUST NOT execute the full `DeinitFn(m)` body.

**(PanicSym)**
──────────────────────────────────────────────────────────

```text
Γ ⊢ PanicSym ⇓ PathSig(["ultraviolet", "runtime", "panic"])
```

PanicReason = {ErrorExpr(span), ErrorStmt(span), DivZero, Overflow, Shift, Bounds, Cast, NullDeref, ExpiredDeref, InitPanic(m), Other}.

PanicCode(ErrorExpr(_)) = 0x0001
PanicCode(ErrorStmt(_)) = 0x0002
PanicCode(DivZero) = 0x0003
PanicCode(Overflow) = 0x0004
PanicCode(Shift) = 0x0005
PanicCode(Bounds) = 0x0006
PanicCode(Cast) = 0x0007
PanicCode(NullDeref) = 0x0008
PanicCode(ExpiredDeref) = 0x0009
PanicCode(InitPanic(_)) = 0x000A
PanicCode(Other) = 0x00FF.

PanicSite = {DivZeroCheck, OverflowCheck, ShiftCheck, BoundsCheck, CastCheck, NullDerefCheck, ExpiredDerefCheck, ErrorExprSite(span), ErrorStmtSite(span), InitPanicSite(m), OtherSite}.
PanicReasonOf(DivZeroCheck) = DivZero
PanicReasonOf(OverflowCheck) = Overflow
PanicReasonOf(ShiftCheck) = Shift
PanicReasonOf(BoundsCheck) = Bounds
PanicReasonOf(CastCheck) = Cast
PanicReasonOf(NullDerefCheck) = NullDeref
PanicReasonOf(ExpiredDerefCheck) = ExpiredDeref
PanicReasonOf(ErrorExprSite(span)) = ErrorExpr(span)
PanicReasonOf(ErrorStmtSite(span)) = ErrorStmt(span)
PanicReasonOf(InitPanicSite(m)) = InitPanic(m)
PanicReasonOf(OtherSite) = Other

```text
Γ ⊢ ClearPanic ⇓ IR ⇔ ∀ σ, ExecIRSigma(IR, σ) ⇓ (out, σ') ∧ WritePanicRecord(σ, false, 0) ⇓ σ'
```

```text
Γ ⊢ PanicCheck ⇓ IR ⇔ ∀ σ, (PanicRecordOf(σ) = ⟨true, c⟩ ⇒ ExecIRSigma(IR, σ) ⇓ (Ctrl(Panic), σ)) ∧ (PanicRecordOf(σ) = ⟨false, c⟩ ⇒ ExecIRSigma(IR, σ) ⇓ (Val(()), σ)).
```

```text
Γ ⊢ LowerPanic(reason) ⇓ IR ⇔ ∀ σ. ∃ σ'. ExecIRSigma(IR, σ) ⇓ (Ctrl(Panic), σ') ∧ WritePanicRecord(σ, true, PanicCode(reason)) ⇓ σ'
```

#### 24.5.3 Deterministic Destruction

```text
Responsible(b) ⇔ BindInfo(b).resp = resp
```

CleanupItem ::= DropBinding(b) | DropStatic(path, name) | DeferBlock(b)
DropStatus = {ok, panic}

```text
DropJudg = {DropAction(b) ⇓ σ', DropValue(T, v, F) ⇓ σ', DropStaticAction(path, name) ⇓ σ', DropActionOut(b) ⇓ (c, σ'), DropValueOut(T, v, F) ⇓ (c, σ'), DropStaticActionOut(path, name) ⇓ (c, σ')}
DropAction(b) ⇓ σ' ⇔ DropActionOut(b) ⇓ (ok, σ')
DropValue(T, v, F) ⇓ σ' ⇔ DropValueOut(T, v, F) ⇓ (ok, σ')
DropStaticAction(path, name) ⇓ σ' ⇔ DropStaticActionOut(path, name) ⇓ (ok, σ')
RecordType(T) ⇔ ∃ p. T = TypePath(p) ∧ RecordDecl(p) defined
DropCall(T, v, σ) ⇓ (out, σ') relation
¬ DropType(T) ⇒ DropCall(T, v, σ) ⇓ (Val(()), σ)
DropType(T) ∧ BuiltinDropType(T) ∧ T = TypeString(`@Managed`) ∧ Γ ⊢ StringDropSym ⇓ sym ∧ ExecIRSigma(CallIR(sym, [v]), σ) ⇓ (out, σ') ⇒ DropCall(T, v, σ) ⇓ (out, σ')
DropType(T) ∧ BuiltinDropType(T) ∧ T = TypeBytes(`@Managed`) ∧ Γ ⊢ BytesDropSym ⇓ sym ∧ ExecIRSigma(CallIR(sym, [v]), σ) ⇓ (out, σ') ⇒ DropCall(T, v, σ) ⇓ (out, σ')
DropType(T) ∧ ¬ BuiltinDropType(T) ∧ LookupMethod(StripPerm(T), "drop") = m ∧ Sig_T(StripPerm(T), m) = ⟨TypePerm(`unique`, StripPerm(T)), [], TypePrim("()")⟩ ∧ BindParams(MethodParamsDecl(StripPerm(T), m), [v]) = binds ∧ BlockEnter(σ, binds) ⇓ (σ_1, scope) ∧ Γ ⊢ EvalBlockBodySigma(m.body, σ_1) ⇓ (out_1, σ_2) ∧ BlockExit(σ_2, scope, out_1) ⇓ (out_2, σ_3) ∧ ReturnOut(out_2) = out ⇒ DropCall(T, v, σ) ⇓ (out, σ_3)
ReleaseValue(T, v, σ) ⇓ σ' relation
ReleaseValue(T, v, σ) ⇓ σ' ⇔ σ' = σ
```

DropChildren(T, v, F) =

```text
 [⟨T_i, v_i⟩ | ⟨f_i, T_i⟩ ∈ FieldsRev(R), f_i ∉ F, FieldValue(v, f_i) = v_i]    if T = TypePath(p) ∧ RecordDecl(p) = R
 [⟨T_i, v_i⟩ | T = TypeTuple([T_0, …, T_{n-1}]), i ∈ rev([0, …, n-1]), TupleValue(v, i) = v_i]    if T = TypeTuple(_)
 [⟨T_e, v_i⟩ | T = TypeArray(T_e, n), i ∈ rev([0, …, n-1]), IndexValue(v, i) = v_i]    if T = TypeArray(_, _)
 [⟨T', v'⟩ | UnionCase(v) = ⟨T', v'⟩]    if T = TypeUnion(_)
 [⟨TypeModalState(modal_ref, S), v_s⟩ | v = ⟨S, v_s⟩]    if T = ModalRefType(modal_ref) ∧ ModalDeclOf(modal_ref) = M
 [⟨T_i, v_i⟩ | ⟨f_i, T_i⟩ ∈ ModalPayload(modal_ref, S), FieldValue(v, f_i) = v_i]    if T = TypeModalState(modal_ref, S) ∧ ModalDeclOf(modal_ref) = M
```

 []    otherwise

```text
DropList([], σ) ⇓ (ok, σ)
DropList([⟨T, v⟩] ++ xs, σ) ⇓ (c, σ'') ⇔ DropValueOut(T, v, ∅) ⇓ (c_1, σ') ∧ (c_1 = panic ⇒ c = panic ∧ σ'' = σ') ∧ (c_1 = ok ⇒ DropList(xs, σ') ⇓ (c, σ''))
```

**(DropAction-Moved)**

```text
BindState(σ, b) = Moved
```

──────────────────────────────────────────────

```text
Γ ⊢ DropActionOut(b) ⇓ (ok, σ)
```

**(DropAction-Partial)**

```text
BindState(σ, b) = PartiallyMoved(F)    Γ ⊢ DropValueOut(TypeOf(b), BindingValue(σ, b), F) ⇓ (c, σ')
```

────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ DropActionOut(b) ⇓ (c, σ')
```

**(DropAction-Valid)**

```text
BindState(σ, b) = `Valid`    Γ ⊢ DropValueOut(TypeOf(b), BindingValue(σ, b), ∅) ⇓ (c, σ')
```

──────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ DropActionOut(b) ⇓ (c, σ')
```

**(DropStaticAction)**

```text
StaticAddr(path, name) = addr    ReadAddr(σ, addr) = v    Γ ⊢ DropValueOut(StaticType(path, name), v, ∅) ⇓ (c, σ')
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ DropStaticActionOut(path, name) ⇓ (c, σ')
```

```text
NonRecordFOk(T, F) ⇔ RecordType(T) ∨ F = ∅
```

**(DropValueOut-DropPanic)**

```text
NonRecordFOk(T, F)    DropCall(T, v, σ) ⇓ (Ctrl(Panic), σ_1)
```

────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ DropValueOut(T, v, F) ⇓ (panic, σ_1)
```

**(DropValueOut-ChildPanic)**

```text
NonRecordFOk(T, F)    DropCall(T, v, σ) ⇓ (Val(()), σ_1)    DropList(DropChildren(T, v, F), σ_1) ⇓ (panic, σ_2)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ DropValueOut(T, v, F) ⇓ (panic, σ_2)
```

**(DropValueOut-Ok)**

```text
NonRecordFOk(T, F)    DropCall(T, v, σ) ⇓ (Val(()), σ_1)    DropList(DropChildren(T, v, F), σ_1) ⇓ (ok, σ_2)    ReleaseValue(T, v, σ_2) ⇓ σ_3
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ DropValueOut(T, v, F) ⇓ (ok, σ_3)
```

#### 24.5.4 Cleanup and Unwinding Driver

CleanupFlag = {ok, panic}

```text
CleanupState = {CleanupLoop(scope, σ, c) | c ∈ CleanupFlag} ∪ {ExitDone(c, σ) | c ∈ CleanupFlag} ∪ {Abort}
```

**(Cleanup-Start)**
────────────────────────────────────────────────────────────────────

```text
⟨ExitScope(scope, σ)⟩ → ⟨CleanupLoop(scope, σ, ok)⟩
```

**(Cleanup-Step-Drop-Ok)**

```text
CleanupList(scope) = rest ++ [DropBinding(b)]    σ_1 = SetCleanupList(scope, rest, σ)    Γ ⊢ DropActionOut(b) ⇓ (ok, σ_2)
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨CleanupLoop(scope, σ, c)⟩ → ⟨CleanupLoop(scope, σ_2, c)⟩
```

**(Cleanup-Step-Drop-Panic)**

```text
CleanupList(scope) = rest ++ [DropBinding(b)]    σ_1 = SetCleanupList(scope, rest, σ)    Γ ⊢ DropActionOut(b) ⇓ (panic, σ_2)    c = ok
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨CleanupLoop(scope, σ, c)⟩ → ⟨CleanupLoop(scope, σ_2, panic)⟩
```

**(Cleanup-Step-Drop-Abort)**

```text
CleanupList(scope) = rest ++ [DropBinding(b)]    σ_1 = SetCleanupList(scope, rest, σ)    Γ ⊢ DropActionOut(b) ⇓ (panic, σ_2)    c = panic
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨CleanupLoop(scope, σ, c)⟩ → ⟨Abort⟩
```

**(Cleanup-Step-DropStatic-Ok)**

```text
CleanupList(scope) = rest ++ [DropStatic(path, name)]    σ_1 = SetCleanupList(scope, rest, σ)    Γ ⊢ DropStaticActionOut(path, name) ⇓ (ok, σ_2)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨CleanupLoop(scope, σ, c)⟩ → ⟨CleanupLoop(scope, σ_2, c)⟩
```

**(Cleanup-Step-DropStatic-Panic)**

```text
CleanupList(scope) = rest ++ [DropStatic(path, name)]    σ_1 = SetCleanupList(scope, rest, σ)    Γ ⊢ DropStaticActionOut(path, name) ⇓ (panic, σ_2)    c = ok
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨CleanupLoop(scope, σ, c)⟩ → ⟨CleanupLoop(scope, σ_2, panic)⟩
```

**(Cleanup-Step-DropStatic-Abort)**

```text
CleanupList(scope) = rest ++ [DropStatic(path, name)]    σ_1 = SetCleanupList(scope, rest, σ)    Γ ⊢ DropStaticActionOut(path, name) ⇓ (panic, σ_2)    c = panic
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨CleanupLoop(scope, σ, c)⟩ → ⟨Abort⟩
```

**(Cleanup-Step-Defer-Ok)**

```text
CleanupList(scope) = rest ++ [DeferBlock(b)]    σ_1 = SetCleanupList(scope, rest, σ)    Γ ⊢ EvalSigma(b, σ_1) ⇓ (Val(v), σ_2)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨CleanupLoop(scope, σ, c)⟩ → ⟨CleanupLoop(scope, σ_2, c)⟩
```

**(Cleanup-Step-Defer-Panic)**

```text
CleanupList(scope) = rest ++ [DeferBlock(b)]    σ_1 = SetCleanupList(scope, rest, σ)    Γ ⊢ EvalSigma(b, σ_1) ⇓ (Ctrl(Panic), σ_2)    c = ok
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨CleanupLoop(scope, σ, c)⟩ → ⟨CleanupLoop(scope, σ_2, panic)⟩
```

**(Cleanup-Step-Defer-Abort)**

```text
CleanupList(scope) = rest ++ [DeferBlock(b)]    σ_1 = SetCleanupList(scope, rest, σ)    Γ ⊢ EvalSigma(b, σ_1) ⇓ (Ctrl(Panic), σ_2)    c = panic
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨CleanupLoop(scope, σ, c)⟩ → ⟨Abort⟩
```

**(Cleanup-Done)**
CleanupList(scope) = []
────────────────────────────────────────────────────────────

```text
⟨CleanupLoop(scope, σ, c)⟩ → ⟨ExitDone(c, σ)⟩
```

**(Destroy-Empty)**
────────────────────────────────────────────

```text
Γ ⊢ Destroy([], σ) ⇓ σ
```

**(Destroy-Cons)**

```text
Γ ⊢ DropAction(b) ⇓ σ_1    Γ ⊢ Destroy(bs, σ_1) ⇓ σ_2
```

───────────────────────────────────────────────────────────

```text
Γ ⊢ Destroy(b::bs, σ) ⇓ σ_2
```

```text
CleanupJudg_Dyn = {Cleanup(cs, σ) ⇓ (c, σ')}
```

**(Cleanup-Empty)**
────────────────────────────────────────────────────

```text
Γ ⊢ Cleanup([], σ) ⇓ (ok, σ)
```

**(Cleanup-Cons-Drop)**

```text
Γ ⊢ DropActionOut(b) ⇓ (ok, σ_1)    Γ ⊢ Cleanup(cs, σ_1) ⇓ (c, σ_2)
```

──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Cleanup(DropBinding(b)::cs, σ) ⇓ (c, σ_2)
```

**(Cleanup-Cons-Drop-Panic)**

```text
Γ ⊢ DropActionOut(b) ⇓ (panic, σ_1)    Γ ⊢ Cleanup(cs, σ_1) ⇓ (c, σ_2)
```

────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Cleanup(DropBinding(b)::cs, σ) ⇓ (panic, σ_2)
```

**(Cleanup-Cons-DropStatic)**

```text
Γ ⊢ DropStaticActionOut(path, name) ⇓ (ok, σ_1)    Γ ⊢ Cleanup(cs, σ_1) ⇓ (c, σ_2)
```

────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Cleanup(DropStatic(path, name)::cs, σ) ⇓ (c, σ_2)
```

**(Cleanup-Cons-DropStatic-Panic)**

```text
Γ ⊢ DropStaticActionOut(path, name) ⇓ (panic, σ_1)    Γ ⊢ Cleanup(cs, σ_1) ⇓ (c, σ_2)
```

────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Cleanup(DropStatic(path, name)::cs, σ) ⇓ (panic, σ_2)
```

**(Cleanup-Cons-Defer-Ok)**

```text
Γ ⊢ EvalSigma(b, σ) ⇓ (Val(v), σ_1)    Γ ⊢ Cleanup(cs, σ_1) ⇓ (c, σ_2)
```

──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Cleanup(DeferBlock(b)::cs, σ) ⇓ (c, σ_2)
```

**(Cleanup-Cons-Defer-Panic)**

```text
Γ ⊢ EvalSigma(b, σ) ⇓ (Ctrl(Panic), σ_1)    Γ ⊢ Cleanup(cs, σ_1) ⇓ (c, σ_2)
```

────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Cleanup(DeferBlock(b)::cs, σ) ⇓ (panic, σ_2)
```

```text
CleanupScopeJudg = {CleanupScope(scope, σ) ⇓ (c, σ')}
```

**(CleanupScope-From-SmallStep)**

```text
⟨ExitScope(scope, σ)⟩ →* ⟨ExitDone(c, σ')⟩
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ CleanupScope(scope, σ) ⇓ (c, σ')
```

**(Unwind-Step)**

```text
Γ ⊢ CleanupScope(f_1.scope, σ) ⇓ (ok, σ')
```

──────────────────────────────────────────────────────────────

```text
⟨Unwind(f_1::fs, σ)⟩ → ⟨Unwind(fs, σ')⟩
```

**(Unwind-Abort)**

```text
Γ ⊢ CleanupScope(f_1.scope, σ) ⇓ (panic, σ')
```

──────────────────────────────────────────────────────────────

```text
⟨Unwind(f_1::fs, σ)⟩ → ⟨Abort⟩
```

### 24.6 Runtime Interface

Feature-local runtime behavior remains owned by the feature sections that invoke these built-ins. This section defines only the runtime symbol surface, builtin modal layout hooks, and runtime declaration interface.

#### 24.6.1 Built-in Modal Layout and Capability Symbols

RuntimeIfcJudg = {BuiltinModalLayout, BuiltinModalSym, RegionAddrIsActiveSym, RegionAddrTagFromSym, BuiltinSym}

```text
BuiltinModalLayoutSpec(`Region`) = ⟨16, 8, u8, ⟨8, 8⟩⟩
```

**(BuiltinModalLayout)**

```text
BuiltinModalLayoutSpec(modal) = ⟨size, align, disc, payload⟩
```

────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuiltinModalLayout(modal) ⇓ ⟨size, align, [⟨`disc`, disc⟩, ⟨`payload`, payload⟩]⟩
```

BuiltinModalSymMap = [

```text
  ⟨`Region::new_scoped`, PathSig(["ultraviolet", "runtime", "region", "new_scoped"])⟩,
  ⟨`Region::alloc`, PathSig(["ultraviolet", "runtime", "region", "alloc"])⟩,
  ⟨`Region::mark`, PathSig(["ultraviolet", "runtime", "region", "mark"])⟩,
  ⟨`Region::reset_to`, PathSig(["ultraviolet", "runtime", "region", "reset_to"])⟩,
  ⟨`Region::reset_unchecked`, PathSig(["ultraviolet", "runtime", "region", "reset_unchecked"])⟩,
  ⟨`Region::freeze`, PathSig(["ultraviolet", "runtime", "region", "freeze"])⟩,
  ⟨`Region::thaw`, PathSig(["ultraviolet", "runtime", "region", "thaw"])⟩,
  ⟨`Region::free_unchecked`, PathSig(["ultraviolet", "runtime", "region", "free_unchecked"])⟩,
  ⟨`CancelToken::new`, PathSig(["CancelToken", "new"])⟩,
  ⟨`CancelToken::Active::cancel`, PathSig(["CancelToken", "Active", "cancel"])⟩,
  ⟨`CancelToken::Active::is_cancelled`, PathSig(["CancelToken", "Active", "is_cancelled"])⟩,
  ⟨`CancelToken::Active::child`, PathSig(["CancelToken", "Active", "child"])⟩,
  ⟨`CancelToken::Active::wait_cancelled`, PathSig(["CancelToken", "Active", "wait_cancelled"])⟩
```

]

**(BuiltinModalSym)**

```text
⟨proc, sym⟩ ∈ BuiltinModalSymMap
```

────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuiltinModalSym(proc) ⇓ sym
```

**(RegionAddr-AddrIsActive)**
────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ RegionAddrIsActiveSym ⇓ PathSig(["ultraviolet", "runtime", "region", "addr_is_active"])
```

**(RegionAddr-AddrTagFrom)**
────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ RegionAddrTagFromSym ⇓ PathSig(["ultraviolet", "runtime", "region", "addr_tag_from"])
```

**(BuiltinSym-FileSystem-OpenRead)**
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuiltinSym(`FileSystem::open_read`) ⇓ PathSig(["ultraviolet", "runtime", "fs", "open_read"])
```

**(BuiltinSym-FileSystem-OpenWrite)**
──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuiltinSym(`FileSystem::open_write`) ⇓ PathSig(["ultraviolet", "runtime", "fs", "open_write"])
```

**(BuiltinSym-FileSystem-OpenAppend)**
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuiltinSym(`FileSystem::open_append`) ⇓ PathSig(["ultraviolet", "runtime", "fs", "open_append"])
```

**(BuiltinSym-FileSystem-CreateWrite)**
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuiltinSym(`FileSystem::create_write`) ⇓ PathSig(["ultraviolet", "runtime", "fs", "create_write"])
```

**(BuiltinSym-FileSystem-ReadFile)**
──────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuiltinSym(`FileSystem::read_file`) ⇓ PathSig(["ultraviolet", "runtime", "fs", "read_file"])
```

**(BuiltinSym-FileSystem-ReadBytes)**
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuiltinSym(`FileSystem::read_bytes`) ⇓ PathSig(["ultraviolet", "runtime", "fs", "read_bytes"])
```

**(BuiltinSym-FileSystem-WriteFile)**
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuiltinSym(`FileSystem::write_file`) ⇓ PathSig(["ultraviolet", "runtime", "fs", "write_file"])
```

**(BuiltinSym-FileSystem-WriteStdout)**
──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuiltinSym(`FileSystem::write_stdout`) ⇓ PathSig(["ultraviolet", "runtime", "fs", "write_stdout"])
```

**(BuiltinSym-FileSystem-WriteStderr)**
──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuiltinSym(`FileSystem::write_stderr`) ⇓ PathSig(["ultraviolet", "runtime", "fs", "write_stderr"])
```

**(BuiltinSym-FileSystem-Exists)**
────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuiltinSym(`FileSystem::exists`) ⇓ PathSig(["ultraviolet", "runtime", "fs", "exists"])
```

**(BuiltinSym-FileSystem-Remove)**
────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuiltinSym(`FileSystem::remove`) ⇓ PathSig(["ultraviolet", "runtime", "fs", "remove"])
```

**(BuiltinSym-FileSystem-OpenDir)**
──────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuiltinSym(`FileSystem::open_dir`) ⇓ PathSig(["ultraviolet", "runtime", "fs", "open_dir"])
```

**(BuiltinSym-FileSystem-CreateDir)**
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuiltinSym(`FileSystem::create_dir`) ⇓ PathSig(["ultraviolet", "runtime", "fs", "create_dir"])
```

**(BuiltinSym-FileSystem-EnsureDir)**
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuiltinSym(`FileSystem::ensure_dir`) ⇓ PathSig(["ultraviolet", "runtime", "fs", "ensure_dir"])
```

**(BuiltinSym-FileSystem-Kind)**
──────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuiltinSym(`FileSystem::kind`) ⇓ PathSig(["ultraviolet", "runtime", "fs", "kind"])
```

**(BuiltinSym-FileSystem-Restrict)**
──────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuiltinSym(`FileSystem::restrict`) ⇓ PathSig(["ultraviolet", "runtime", "fs", "restrict"])
```

**(BuiltinSym-Network-RestrictHost)**
──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuiltinSym(`Network::restrict_to_host`) ⇓ PathSig(["ultraviolet", "runtime", "net", "restrict_to_host"])
```

**(BuiltinSym-HeapAllocator-WithQuota)**
──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuiltinSym(`HeapAllocator::with_quota`) ⇓ PathSig(["ultraviolet", "runtime", "heap", "with_quota"])
```

**(BuiltinSym-HeapAllocator-AllocRaw)**
───────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuiltinSym(`HeapAllocator::alloc_raw`) ⇓ PathSig(["ultraviolet", "runtime", "heap", "alloc_raw"])
```

**(BuiltinSym-HeapAllocator-DeallocRaw)**
──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuiltinSym(`HeapAllocator::dealloc_raw`) ⇓ PathSig(["ultraviolet", "runtime", "heap", "dealloc_raw"])
```

**(BuiltinSym-Reactor-Run)**
──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuiltinSym(`Reactor::run`) ⇓ PathSig(["ultraviolet", "runtime", "reactor", "run"])
```

**(BuiltinSym-Reactor-Register)**
───────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuiltinSym(`Reactor::register`) ⇓ PathSig(["ultraviolet", "runtime", "reactor", "register"])
```

**(BuiltinSym-System-Exit)**
──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuiltinSym(`System::exit`) ⇓ PathSig(["ultraviolet", "runtime", "system", "exit"])
```

**(BuiltinSym-System-GetEnv)**
─────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuiltinSym(`System::get_env`) ⇓ PathSig(["ultraviolet", "runtime", "system", "get_env"])
```

**(BuiltinSym-System-ExecutablePath)**
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuiltinSym(`System::executable_path`) ⇓ PathSig(["ultraviolet", "runtime", "system", "executable_path"])
```

**(BuiltinSym-System-ArgumentCount)**
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuiltinSym(`System::argument_count`) ⇓ PathSig(["ultraviolet", "runtime", "system", "argument_count"])
```

**(BuiltinSym-System-Argument)**
─────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuiltinSym(`System::argument`) ⇓ PathSig(["ultraviolet", "runtime", "system", "argument"])
```

**(BuiltinSym-System-CurrentDirectory)**
──────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuiltinSym(`System::current_directory`) ⇓ PathSig(["ultraviolet", "runtime", "system", "current_directory"])
```

**(BuiltinSym-System-Run)**
─────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuiltinSym(`System::run`) ⇓ PathSig(["ultraviolet", "runtime", "system", "run"])
```

#### 24.6.2 Managed String/Bytes Runtime Symbols and Drop Hooks

```text
BuiltinSymJudg = {BuiltinSym(method) ⇓ sym}
```

StringBuiltins = {`string::from`, `string::as_view`, `string::slice`, `string::to_managed`, `string::clone_with`, `string::append`, `string::length`, `string::is_empty`}
BytesBuiltins = {`bytes::with_capacity`, `bytes::from_slice`, `bytes::as_view`, `bytes::as_slice`, `bytes::to_managed`, `bytes::view`, `bytes::view_string`, `bytes::append`, `bytes::length`, `bytes::is_empty`}

```text
StringMethod(method) ⇔ ∃ name. method = `string::`name
BytesMethod(method) ⇔ ∃ name. method = `bytes::`name
```

BuiltinSym(`string::from`) = PathSig(["ultraviolet", "runtime", "string", "from"])
BuiltinSym(`string::as_view`) = PathSig(["ultraviolet", "runtime", "string", "as_view"])
BuiltinSym(`string::slice`) = PathSig(["ultraviolet", "runtime", "string", "slice"])
BuiltinSym(`string::to_managed`) = PathSig(["ultraviolet", "runtime", "string", "to_managed"])
BuiltinSym(`string::clone_with`) = PathSig(["ultraviolet", "runtime", "string", "clone_with"])
BuiltinSym(`string::append`) = PathSig(["ultraviolet", "runtime", "string", "append"])
BuiltinSym(`string::length`) = PathSig(["ultraviolet", "runtime", "string", "length"])
BuiltinSym(`string::is_empty`) = PathSig(["ultraviolet", "runtime", "string", "is_empty"])

BuiltinSym(`bytes::with_capacity`) = PathSig(["ultraviolet", "runtime", "bytes", "with_capacity"])
BuiltinSym(`bytes::from_slice`) = PathSig(["ultraviolet", "runtime", "bytes", "from_slice"])
BuiltinSym(`bytes::as_view`) = PathSig(["ultraviolet", "runtime", "bytes", "as_view"])
BuiltinSym(`bytes::as_slice`) = PathSig(["ultraviolet", "runtime", "bytes", "as_slice"])
BuiltinSym(`bytes::to_managed`) = PathSig(["ultraviolet", "runtime", "bytes", "to_managed"])
BuiltinSym(`bytes::view`) = PathSig(["ultraviolet", "runtime", "bytes", "view"])
BuiltinSym(`bytes::view_string`) = PathSig(["ultraviolet", "runtime", "bytes", "view_string"])
BuiltinSym(`bytes::append`) = PathSig(["ultraviolet", "runtime", "bytes", "append"])
BuiltinSym(`bytes::length`) = PathSig(["ultraviolet", "runtime", "bytes", "length"])
BuiltinSym(`bytes::is_empty`) = PathSig(["ultraviolet", "runtime", "bytes", "is_empty"])

**(BuiltinSym-String-Err)**

```text
StringMethod(method)    method ∉ StringBuiltins
```

───────────────────────────────────────────────

```text
Γ ⊢ BuiltinSym(method) ⇑
```

**(BuiltinSym-Bytes-Err)**

```text
BytesMethod(method)    method ∉ BytesBuiltins
```

──────────────────────────────────────────────

```text
Γ ⊢ BuiltinSym(method) ⇑
```

```text
DropHookJudg = {StringDropSym ⇓ sym, BytesDropSym ⇓ sym}
```

**(StringDropSym-Decl)**
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ StringDropSym ⇓ PathSig(["ultraviolet", "runtime", "string", "drop_managed"])
```

**(BytesDropSym-Decl)**
───────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BytesDropSym ⇓ PathSig(["ultraviolet", "runtime", "bytes", "drop_managed"])
```

**(StringDropSym-Err)**
StringDropSym undefined
──────────────────────────

```text
Γ ⊢ StringDropSym ⇑
```

**(BytesDropSym-Err)**
BytesDropSym undefined
─────────────────────────

```text
Γ ⊢ BytesDropSym ⇑
```

#### 24.6.3 Runtime and Built-in Declarations

```text
RuntimeDeclJudg = {RuntimeSig(sym) ⇓ ⟨params, ret⟩, BuiltinSig(method) ⇓ ⟨params, ret⟩, RuntimeDecls(S) ⇓ decls}
```

FileSystemBuiltinMethods = {`FileSystem::open_read`, `FileSystem::open_write`, `FileSystem::open_append`, `FileSystem::create_write`, `FileSystem::read_file`, `FileSystem::read_bytes`, `FileSystem::write_file`, `FileSystem::write_stdout`, `FileSystem::write_stderr`, `FileSystem::exists`, `FileSystem::remove`, `FileSystem::open_dir`, `FileSystem::create_dir`, `FileSystem::ensure_dir`, `FileSystem::kind`, `FileSystem::restrict`}
NetworkBuiltinMethods = {`Network::restrict_to_host`}
HeapAllocatorBuiltinMethods = {`HeapAllocator::with_quota`, `HeapAllocator::alloc_raw`, `HeapAllocator::dealloc_raw`}

```text
SystemBuiltinMethods = {`System::name` | ⟨name, params, ret⟩ ∈ SystemInterface}
```

ReactorBuiltinMethods = {`Reactor::run`, `Reactor::register`}

```text
BuiltinMethods = StringBuiltins ∪ BytesBuiltins ∪ FileSystemBuiltinMethods ∪ NetworkBuiltinMethods ∪ HeapAllocatorBuiltinMethods ∪ SystemBuiltinMethods ∪ ReactorBuiltinMethods
RuntimeSyms = {PanicSym, StringDropSym, BytesDropSym, ContextInitSym} ∪ {BuiltinModalSym(proc) | proc ∈ dom(BuiltinModalSymMap)} ∪ {RegionAddrIsActiveSym, RegionAddrTagFromSym} ∪ {BuiltinSym(method) | method ∈ BuiltinMethods}
```

```text
BuiltinSig(`FileSystem`::name) = ⟨[⟨⊥, `self`, TypePerm(CapRecv(`FileSystem`, name), TypeDynamic(`FileSystem`))⟩] ++ params, ret⟩ ⇔ CapMethodSig(`FileSystem`, name) = ⟨params, ret⟩
BuiltinSig(`Network`::name) = ⟨[⟨⊥, `self`, TypePerm(CapRecv(`Network`, name), TypeDynamic(`Network`))⟩] ++ params, ret⟩ ⇔ CapMethodSig(`Network`, name) = ⟨params, ret⟩
BuiltinSig(`HeapAllocator`::name) = ⟨[⟨⊥, `self`, TypePerm(CapRecv(`HeapAllocator`, name), TypeDynamic(`HeapAllocator`))⟩] ++ params, ret⟩ ⇔ CapMethodSig(`HeapAllocator`, name) = ⟨params, ret⟩
BuiltinSig(`System`::name) = ⟨[⟨⊥, `self`, TypePerm(`const`, TypePath(["System"]))⟩] ++ params, ret⟩ ⇔ SystemMethodSig(name) = ⟨params, ret⟩
BuiltinSig(`Reactor`::name) = ⟨[⟨⊥, `self`, TypePerm(CapRecv(`Reactor`, name), TypeDynamic(`Reactor`))⟩] ++ params, ret⟩ ⇔ CapMethodSig(`Reactor`, name) = ⟨params, ret⟩
BuiltinSig(method) = ⟨params, ret⟩ ⇔ StringBytesBuiltinSig(method) = ⟨params, ret⟩
```

```text
RuntimeSig(PanicSym) = ⟨[⟨⊥, `code`, TypePrim("u32")⟩], TypePrim("!")⟩
RuntimeSig(ContextInitSym) = ⟨[], TypePath(["Context"])⟩
RuntimeSig(StringDropSym) = ⟨[⟨`move`, `value`, TypeString(`@Managed`)⟩], TypePrim("()")⟩
RuntimeSig(BytesDropSym) = ⟨[⟨`move`, `value`, TypeBytes(`@Managed`)⟩], TypePrim("()")⟩
BuiltinModalProcSig(proc) = ⟨params, ret⟩ ⇔ proc ∈ RegionProcs ∧ RegionProcSig(proc) = ⟨params, ret⟩
BuiltinModalProcSig(`CancelToken::new`) = ⟨[], TypeModalState(["CancelToken"], `@Active`)⟩
BuiltinModalProcSig(`CancelToken::Active::cancel`) = ⟨[⟨⊥, `self`, TypePerm(`shared`, TypeModalState(["CancelToken"], `@Active`))⟩], TypePrim("()")⟩
BuiltinModalProcSig(`CancelToken::Active::is_cancelled`) = ⟨[⟨⊥, `self`, TypePerm(`const`, TypeModalState(["CancelToken"], `@Active`))⟩], TypePrim("bool")⟩
BuiltinModalProcSig(`CancelToken::Active::child`) = ⟨[⟨⊥, `self`, TypePerm(`const`, TypeModalState(["CancelToken"], `@Active`))⟩], TypeModalState(["CancelToken"], `@Active`)⟩
BuiltinModalProcSig(`CancelToken::Active::wait_cancelled`) = ⟨[⟨⊥, `self`, TypePerm(`const`, TypeModalState(["CancelToken"], `@Active`))⟩], TypePath(["Async"], [TypePrim("()")])⟩
RuntimeSig(sym) = ⟨[⟨⊥, `self`, TypePerm(`unique`, TypeModalState(["Region"], `@Active`))⟩, ⟨⊥, `size`, TypePrim("usize")⟩, ⟨⊥, `align`, TypePrim("usize")⟩], TypeRawPtr(`mut`, TypePrim("u8"))⟩ ⇔ sym = BuiltinModalSym(`Region::alloc`)
RuntimeSig(sym) = ⟨[⟨⊥, `self`, TypePerm(`unique`, TypeModalState(["Region"], `@Active`))⟩], TypePrim("usize")⟩ ⇔ sym = BuiltinModalSym(`Region::mark`)
RuntimeSig(sym) = ⟨[⟨⊥, `self`, TypePerm(`unique`, TypeModalState(["Region"], `@Active`))⟩, ⟨⊥, `mark`, TypePrim("usize")⟩], TypePrim("()")⟩ ⇔ sym = BuiltinModalSym(`Region::reset_to`)
RuntimeSig(sym) = ⟨[⟨⊥, `addr`, TypeRawPtr(`imm`, TypePrim("u8"))⟩], TypePrim("bool")⟩ ⇔ sym = RegionAddrIsActiveSym
RuntimeSig(sym) = ⟨[⟨⊥, `addr`, TypeRawPtr(`imm`, TypePrim("u8"))⟩, ⟨⊥, `base`, TypeRawPtr(`imm`, TypePrim("u8"))⟩], TypePrim("()")⟩ ⇔ sym = RegionAddrTagFromSym
RuntimeSig(sym) = ⟨params, ret⟩ ⇔ sym = BuiltinModalSym(proc) ∧ proc ∉ {`Region::alloc`, `Region::mark`, `Region::reset_to`} ∧ BuiltinModalProcSig(proc) = ⟨params, ret⟩
RuntimeSig(sym) = ⟨params, ret⟩ ⇔ sym = BuiltinSym(method) ∧ BuiltinSig(method) = ⟨params, ret⟩
```

```text
LLVMDecl : Symbol × Sig → LLVMDecl
```

**(RuntimeDecls)**

```text
∀ sym ∈ S, RuntimeSig(sym) = ⟨params, ret⟩    LLVMCallSig(params, ret) ⇓ sig
```

─────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ RuntimeDecls(S) ⇓ [LLVMDecl(sym, sig) | sym ∈ S]
```

```text
DeclAttrs : Symbol → AttrSet
DeclSyms(LLVMIR) = { sym | LLVMDecl(sym, _) ∈ LLVMIR ∨ LLVMDefine(sym, _, _) ∈ LLVMIR }
DeclAttrsOk(sym) ⇔ (sym = PanicSym ⇒ {`noreturn`, `nounwind`} ⊆ DeclAttrs(sym)) ∧ (sym ≠ PanicSym ⇒ `nounwind` ∈ DeclAttrs(sym))
RuntimeDeclsOk(decls) ⇔ ∀ sym ∈ DeclSyms(decls). DeclAttrsOk(sym)
RuntimeDeclsCover(LLVMIR, IR) ⇔ RuntimeRefs(IR) ⊆ DeclSyms(LLVMIR)
```

#### 24.6.4 Network, Heap, and Reactor Host-Primitives

**(Prim-Network-RestrictHost-Runtime)**

```text
Γ ⊢ NetRestrictHost(v_net, host) ⇓ v_net'
```

────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(`Network`, `restrict_to_host`, v_net, [host]) ⇓ Val(v_net')
```

```text
HeapJudg = {HeapWithQuota(v_heap, quota) ⇓ v_heap', HeapAllocRaw(v_heap, count) ⇓ ptr, HeapDeallocRaw(v_heap, ptr, count) ⇓ ok}
```

`HeapWithQuota`, `HeapAllocRaw`, and `HeapDeallocRaw` are runtime host-primitive relations with required semantics.

```text
HeapState(v_h) = ⟨parent_h, quota_h, used_h⟩, where `quota_h = 0` denotes no local quota bound.
Anc(v_h) = [v_h, parent_h, parent(parent_h), ...] truncated at `⊥`.
```

Headroom(v_a) = +∞ if `quota_a = 0`, otherwise `max(quota_a - used_a, 0)`.

A conforming implementation MUST satisfy all of the following:

1. `HeapWithQuota(v_heap, q) ⇓ v_heap'` implies `HeapState(v_heap') = ⟨v_heap, q, 0⟩`.
2. `HeapAllocRaw(v_heap, 0) ⇓ null` and MUST NOT mutate any `HeapState`.
3. For `count > 0`:
   - If `∃ v_a ∈ Anc(v_heap). count > Headroom(v_a)`, then `HeapAllocRaw(v_heap, count) ⇓ null` and MUST NOT mutate any `HeapState`.
   - If quota checks pass but host allocation fails, `HeapAllocRaw(v_heap, count) ⇓ null` and MUST NOT mutate any `HeapState`.
   - Otherwise, `HeapAllocRaw(v_heap, count) ⇓ ptr` with `ptr ≠ null`, and `used_a` MUST increase by `count` for every `v_a ∈ Anc(v_heap)`.
4. `HeapDeallocRaw(v_heap, null, count) ⇓ ok` and MUST NOT mutate any `HeapState`.
5. If `ptr ≠ null` denotes a live allocation previously returned by `HeapAllocRaw` with recorded owner heap `v_owner` and recorded size `n`, then `HeapDeallocRaw(v_heap, ptr, count) ⇓ ok` MUST:
   - free that allocation exactly once, and
   - decrease `used_a` by `n` for every `v_a ∈ Anc(v_owner)`.
6. The `count` argument to `dealloc_raw` is non-authoritative for accounting; accounting MUST use the recorded allocation size.
7. If `ptr` does not denote a live allocation previously returned by `HeapAllocRaw` (including double-free and foreign pointers), behavior is undefined.

**(Prim-Heap-WithQuota)**

```text
Γ ⊢ HeapWithQuota(v_heap, quota) ⇓ v_heap'
```

────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(`HeapAllocator`, `with_quota`, v_heap, [quota]) ⇓ Val(v_heap')
```

**(Prim-Heap-AllocRaw)**

```text
Γ ⊢ HeapAllocRaw(v_heap, count) ⇓ ptr
```

────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(`HeapAllocator`, `alloc_raw`, v_heap, [count]) ⇓ Val(ptr)
```

**(Prim-Heap-DeallocRaw)**

```text
Γ ⊢ HeapDeallocRaw(v_heap, ptr, count) ⇓ ok
```

────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(`HeapAllocator`, `dealloc_raw`, v_heap, [ptr, count]) ⇓ Val(UnitVal)
```

```text
ReactorJudg = {ReactorRun(v_reactor, f) ⇓ r, ReactorRegister(v_reactor, f) ⇓ h}
```

`ReactorRun` and `ReactorRegister` are runtime host-primitive relations that interface the async model (§19) with a concrete event loop.

**(Prim-Reactor-Run)**

```text
Γ ⊢ ReactorRun(v_reactor, f) ⇓ r
```

────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(`Reactor`, `run`, v_reactor, [f]) ⇓ Val(r)
```

**(Prim-Reactor-Register)**

```text
Γ ⊢ ReactorRegister(v_reactor, f) ⇓ h
```

────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PrimCall(`Reactor`, `register`, v_reactor, [f]) ⇓ Val(h)
```

### 24.7 Backend Requirements

This section owns the backend-specific LLVM requirements, IR declaration/instruction lowering, binding storage, ABI call lowering, vtable/literal emission, and poisoning instrumentation used by Chapter 24.

#### 24.7.1 LLVM Module Header

LLVMHeader = [TargetDataLayout(LLVMDataLayout), TargetTriple(LLVMTriple)]

#### 24.7.2 Opaque Pointer Model

AddrSpace(T) =
 0                if T = TypePtr(U, s)
 0                if T = TypeRawPtr(q, U)
 0                if T = TypeFunc(params, R)

```text
 AddrSpace(U)     if T = TypePerm(p, U) ∧ AddrSpace(U) defined
 ⊥                otherwise
```

LLVMPtrTy(T) = `ptr addrspace(AddrSpace(T))` when AddrSpace(T) defined

#### 24.7.3 LLVM Attribute Mapping

```text
LLVMAttrJudg = {PtrStateOf(T) = s, LLVMPtrAttrs(T) ⇓ A, LLVMArgAttrs(T) ⇓ A}
```

**(PtrStateOf-Perm)**
PtrStateOf(T) = s
────────────────────────────────────────────
PtrStateOf(TypePerm(p, T)) = s

**(LLVM-PtrAttrs-Valid)**
StripPerm(T) = TypePtr(U, `Valid`)
───────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LLVMPtrAttrs(T) ⇓ {`nonnull`, `dereferenceable`(sizeof(U)), `align`(alignof(U)), `noundef`}
```

**(LLVM-PtrAttrs-Other)**

```text
StripPerm(T) = TypePtr(U, s)    s ∈ {⊥, `Null`, `Expired`}
```

────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LLVMPtrAttrs(T) ⇓ ∅
```

**(LLVM-PtrAttrs-RawPtr)**
StripPerm(T) = TypeRawPtr(q, U)
────────────────────────────────────────────────

```text
Γ ⊢ LLVMPtrAttrs(T) ⇓ ∅
```

**(LLVM-ArgAttrs-Ptr)**

```text
LLVMArgAttrsPtr(T) = (PermOf(T) = `unique` Sigma {`noalias`} : ∅) ∪ (PermOf(T) = `const` Sigma {`readonly`} : ∅)
StripPerm(T) ∈ {TypePtr(_, _), TypeFunc(_, _)}
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ LLVMArgAttrs(T) ⇓ LLVMArgAttrsPtr(T)
```

**(LLVM-ArgAttrs-RawPtr)**
StripPerm(T) = TypeRawPtr(_, _)
──────────────────────────────────────────────

```text
Γ ⊢ LLVMArgAttrs(T) ⇓ ∅
```

**(LLVM-ArgAttrs-NonPtr)**

```text
StripPerm(T) ∉ {TypePtr(_, _), TypeRawPtr(_, _), TypeFunc(_, _)}
```

──────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LLVMArgAttrs(T) ⇓ ∅
```

NoEscapeParam(x) predicate

```text
NoEscapeParam(x) ⇔ false
OptArgAttrs(x) ⊆ {`nocapture`} ∧ (`nocapture` ∈ OptArgAttrs(x) ⇒ NoEscapeParam(x))
LLVMArgAttrsExt(x, T) = LLVMArgAttrs(T) ∪ OptArgAttrs(x)
```

#### 24.7.4 UB and Poison Avoidance

LLVMInstrs(LLVMIR) = [i_0, …, i_n]
Opcode(i) = op

```text
UsesOpcode(LLVMIR, op) ⇔ ∃ i ∈ LLVMInstrs(LLVMIR). Opcode(i) = op
```

Intrinsic(i) = name

```text
UsesIntrinsic(LLVMIR, name) ⇔ ∃ i ∈ LLVMInstrs(LLVMIR). Intrinsic(i) = name
NoUndefPoison(LLVMIR) ⇔ ¬ UsesOpcode(LLVMIR, `undef`) ∧ ¬ UsesOpcode(LLVMIR, `poison`)
NoNSWNUW(LLVMIR) ⇔ ¬ UsesOpcode(LLVMIR, `nsw`) ∧ ¬ UsesOpcode(LLVMIR, `nuw`)
CheckedOverflow(LLVMIR) ⇔ ¬ UsesOpcode(LLVMIR, `add`) ∧ ¬ UsesOpcode(LLVMIR, `sub`) ∧ ¬ UsesOpcode(LLVMIR, `mul`) ∧ UsesIntrinsic(LLVMIR, `llvm.*.with.overflow`)
CheckedDivRem(LLVMIR) ⇔ UsesIntrinsic(LLVMIR, `llvm.sdiv.with.check`) ∧ UsesIntrinsic(LLVMIR, `llvm.udiv.with.check`)
CheckedShifts(LLVMIR) ⇔ UsesIntrinsic(LLVMIR, `llvm.shift.with.check`)
FrozenPoisonUses(LLVMIR) ⇔ UsesOpcode(LLVMIR, `freeze`)
InboundsGEP(LLVMIR) ⇔ ¬ UsesOpcode(LLVMIR, `getelementptr inbounds`) ∨ UsesOpcode(LLVMIR, `gep.inbounds.checked`)
LLVMUBSafe(LLVMIR) ⇔ NoUndefPoison(LLVMIR) ∧ CheckedOverflow(LLVMIR) ∧ CheckedDivRem(LLVMIR) ∧ CheckedShifts(LLVMIR) ∧ FrozenPoisonUses(LLVMIR) ∧ InboundsGEP(LLVMIR) ∧ NoNSWNUW(LLVMIR)
```

#### 24.7.5 Memory Intrinsics

Memmove(dst, src, n) = [`call` `llvm.memmove`(dst, src, n)]
MemcpyOverlapUnknown(dst, src, n) predicate

```text
MemcpyOverlapUnknown(dst, src, n) ⇔ true
MemcpyAllowed(dst, src, n) ⇔ ¬ MemcpyOverlapUnknown(dst, src, n)
```

AggMemcpy(dst, src, n) =
 Memcpy(dst, src, n)     if MemcpyAllowed(dst, src, n)
 Memmove(dst, src, n)    otherwise
AggZero(dst, n) = Memset(dst, 0, n)

```text
LifetimeOpt(T) ⊆ {`llvm.lifetime.start`(sizeof(T)), `llvm.lifetime.end`(sizeof(T))}
```

#### 24.7.6 LLVM Toolchain Version

LLVMToolchain = "21.1.8"
The hosted compiler MUST be built against an in-process LLVM backend whose version is LLVMToolchain.

#### 24.7.7 LLVM Type Mapping

```text
LLVMTyJudg = {LLVMTy(T) ⇓ τ}
```

LLVMZST = {}
Pad(n) =
 []        if n = 0

```text
 [n × i8]  if n ≠ 0
```

LLVMPrim(name) =

```text
 i8        if name ∈ {i8, u8}
 i16       if name ∈ {i16, u16}
 i32       if name ∈ {i32, u32}
 i64       if name ∈ {i64, u64}
 i128      if name ∈ {i128, u128}
```

 `half`    if name = f16
 `float`   if name = f32
 `double`  if name = f64
 i8        if name = `bool`
 i32       if name = `char`

```text
 i64       if name ∈ {`usize`, `isize`}
 LLVMZST   if name ∈ {`()`, `!`}
 ⊥         otherwise
```

LLVMStruct([t_1, …, t_k]) = { t_1, …, t_k }
LLVMArray(n, t) = [n × t]
LLVMArrayConst(n, t, elems) constructor
SlicePtrTy(T) = LLVMPtrTy(TypeRawPtr(`imm`, T))

StructElems([], [], 0) = []

```text
StructElems([⟨f_1, T_1⟩, …, ⟨f_n, T_n⟩], [o_1, …, o_n], size) = Pad(pad_1) ++ [τ_1] ++ … ++ Pad(pad_n) ++ [τ_n] ++ Pad(pad_tail)
```

pad_1 = o_1
pad_i = o_i - (o_{i-1} + sizeof(T_{i-1}))    for i = 2..n
pad_tail = size - (o_n + sizeof(T_n))
τ_i = LLVMTy(T_i)

TaggedElems(disc, payload_size, payload_align, size) = [LLVMTy(disc)] ++ Pad(pad_mid) ++ [LLVMArray(payload_size, i8)] ++ Pad(pad_tail)
disc_size = sizeof(disc)
payload_off = AlignUp(disc_size, payload_align)
pad_mid = payload_off - disc_size
pad_tail = size - (payload_off + payload_size)

**(LLVMTy-Prim)**
T = TypePrim(name)    LLVMPrim(name) = τ
────────────────────────────────────────────

```text
Γ ⊢ LLVMTy(T) ⇓ τ
```

**(LLVMTy-Perm)**

```text
Γ ⊢ LLVMTy(T) ⇓ τ
```

───────────────────────────────────────────────

```text
Γ ⊢ LLVMTy(TypePerm(p, T)) ⇓ τ
```

**(LLVMTy-Refine)**

```text
Γ ⊢ LLVMTy(T) ⇓ τ
```

───────────────────────────────────────────────

```text
Γ ⊢ LLVMTy(TypeRefine(T, P)) ⇓ τ
```

**(LLVMTy-Ptr)**
T = TypePtr(U, s)    LLVMPtrTy(T) = τ
──────────────────────────────────────────────

```text
Γ ⊢ LLVMTy(T) ⇓ τ
```

**(LLVMTy-RawPtr)**
T = TypeRawPtr(q, U)    LLVMPtrTy(T) = τ
──────────────────────────────────────────────

```text
Γ ⊢ LLVMTy(T) ⇓ τ
```

**(LLVMTy-Func)**
T = TypeFunc(params, R)    LLVMPtrTy(T) = τ
──────────────────────────────────────────────

```text
Γ ⊢ LLVMTy(T) ⇓ τ
```

**(LLVMTy-Closure)**
T = TypeClosure(params, R, deps_opt)
──────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LLVMTy(T) ⇓ LLVMStruct([`ptr`, `ptr`])
```

**(LLVMTy-Alias)**

```text
T = TypePath(p)    AliasBody(p) = ty    Γ ⊢ LLVMTy(ty) ⇓ τ
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ LLVMTy(T) ⇓ τ
```

**(LLVMTy-Record)**

```text
T = TypePath(p)    RecordDecl(p) = R    Fields(R) = fields    RecordLayout(fields) ⇓ ⟨size, _, offsets⟩    StructElems(fields, offsets, size) = elems
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LLVMTy(T) ⇓ LLVMStruct(elems)
```

**(LLVMTy-Tuple)**

```text
TupleLayout([T_1, …, T_n]) ⇓ ⟨size, _, offsets⟩    StructElems([⟨0, T_1⟩, …, ⟨n-1, T_n⟩], offsets, size) = elems
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LLVMTy(TypeTuple([T_1, …, T_n])) ⇓ LLVMStruct(elems)
```

**(LLVMTy-Array)**

```text
T = TypeArray(T_0, e)    Γ ⊢ ConstLen(e) ⇓ n    Γ ⊢ LLVMTy(T_0) ⇓ τ
```

──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LLVMTy(T) ⇓ LLVMArray(n, τ)
```

**(LLVMTy-Slice)**

```text
T = TypeSlice(T_0)    Γ ⊢ LLVMTy(TypePrim("usize")) ⇓ τ_u
```

────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LLVMTy(T) ⇓ LLVMStruct([SlicePtrTy(T_0), τ_u])
```

**(LLVMTy-Range)**

```text
TupleLayout([T_0, T_0]) ⇓ ⟨size, _, offsets⟩    StructElems([⟨0, T_0⟩, ⟨1, T_0⟩], offsets, size) = elems
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LLVMTy(TypeRange(T_0)) ⇓ LLVMStruct(elems)
```

**(LLVMTy-RangeInclusive)**

```text
TupleLayout([T_0, T_0]) ⇓ ⟨size, _, offsets⟩    StructElems([⟨0, T_0⟩, ⟨1, T_0⟩], offsets, size) = elems
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LLVMTy(TypeRangeInclusive(T_0)) ⇓ LLVMStruct(elems)
```

**(LLVMTy-RangeFrom)**

```text
TupleLayout([T_0]) ⇓ ⟨size, _, offsets⟩    StructElems([⟨0, T_0⟩], offsets, size) = elems
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LLVMTy(TypeRangeFrom(T_0)) ⇓ LLVMStruct(elems)
```

**(LLVMTy-RangeTo)**

```text
TupleLayout([T_0]) ⇓ ⟨size, _, offsets⟩    StructElems([⟨0, T_0⟩], offsets, size) = elems
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LLVMTy(TypeRangeTo(T_0)) ⇓ LLVMStruct(elems)
```

**(LLVMTy-RangeToInclusive)**

```text
TupleLayout([T_0]) ⇓ ⟨size, _, offsets⟩    StructElems([⟨0, T_0⟩], offsets, size) = elems
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LLVMTy(TypeRangeToInclusive(T_0)) ⇓ LLVMStruct(elems)
```

**(LLVMTy-RangeFull)**
──────────────────────────────────────────────────────────────

```text
Γ ⊢ LLVMTy(TypeRangeFull) ⇓ LLVMStruct([])
```

**(LLVMTy-Enum)**

```text
T = TypePath(p)    EnumDecl(p) = E    EnumLayout(E) ⇓ ⟨size, _, disc, payload_size⟩    payload_align = PayloadAlign(E)    TaggedElems(disc, payload_size, payload_align, size) = elems
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LLVMTy(T) ⇓ LLVMStruct(elems)
```

**(LLVMTy-Union-Niche)**

```text
T = TypeUnion([T_1, …, T_n])    NicheApplies(T)    PayloadMember(T) = T_p    Γ ⊢ LLVMTy(T_p) ⇓ τ
```

────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LLVMTy(T) ⇓ τ
```

**(LLVMTy-Union-Tagged)**

```text
T = TypeUnion([T_1, …, T_n])    UnionLayout(T) ⇓ ⟨size, _, disc, payload_size⟩    disc ≠ ⊥    payload_align = PayloadAlign(T)    TaggedElems(disc, payload_size, payload_align, size) = elems
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LLVMTy(T) ⇓ LLVMStruct(elems)
```

**(LLVMTy-Modal-Niche)**

```text
T = ModalRefType(modal_ref)    ModalDeclOf(modal_ref) = M    NicheApplies(modal_ref)    PayloadState(modal_ref) = S_p    ModalSingleFieldPayload(modal_ref, S_p) = T_p    Γ ⊢ LLVMTy(T_p) ⇓ τ
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LLVMTy(T) ⇓ τ
```

**(LLVMTy-Modal-Tagged)**

```text
T = ModalRefType(modal_ref)    ModalDeclOf(modal_ref) = M    ModalLayout(modal_ref) ⇓ ⟨size, _, disc, payload_size⟩    disc ≠ ⊥    payload_align = max_{S ∈ States(M)}(StateAlign(modal_ref, S))    TaggedElems(disc, payload_size, payload_align, size) = elems
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LLVMTy(T) ⇓ LLVMStruct(elems)
```

**(LLVMTy-Modal-StringBytes)**

```text
BaseModal(TypeString(⊥)) = TypePath(["string"])
BaseModal(TypeBytes(⊥)) = TypePath(["bytes"])
T ∈ {TypeString(⊥), TypeBytes(⊥)}    ModalLayout(BaseModal(T)) ⇓ ⟨size, _, disc, payload_size⟩    (disc = ⊥ ⇒ PayloadState(BaseModal(T)) = S_p ∧ ModalSingleFieldPayload(BaseModal(T), S_p) = T_p ∧ Γ ⊢ LLVMTy(T_p) ⇓ τ)    (disc ≠ ⊥ ⇒ ModalDeclOf(BaseModal(T)) = M ∧ payload_align = max_{S ∈ States(M)}(StateAlign(BaseModal(T), S)) ∧ TaggedElems(disc, payload_size, payload_align, size) = elems)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LLVMTy(T) ⇓ (τ if disc = ⊥ else LLVMStruct(elems))
```

**(LLVMTy-ModalState)**

```text
T = TypeModalState(modal_ref, S)    ModalDeclOf(modal_ref) = M    S ∈ States(M)    ModalPayload(modal_ref, S) = fields    RecordLayout(fields) ⇓ ⟨size, _, offsets⟩    StructElems(fields, offsets, size) = elems
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LLVMTy(T) ⇓ LLVMStruct(elems)
```

**(LLVMTy-Dynamic)**

```text
DynLayout(Cl) ⇓ ⟨_, _, [⟨`data`, T_d⟩, ⟨`vtable`, T_v⟩]⟩    Γ ⊢ LLVMTy(T_d) ⇓ τ_d    Γ ⊢ LLVMTy(T_v) ⇓ τ_v
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LLVMTy(TypeDynamic(Cl)) ⇓ LLVMStruct([τ_d, τ_v])
```

**(LLVMTy-StringView)**

```text
T = TypeString(`@View`)    Γ ⊢ LLVMTy(TypePrim("usize")) ⇓ τ_u
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LLVMTy(T) ⇓ LLVMStruct([LLVMPtrTy(TypePtr(TypePerm(`const`, TypePrim("u8")), `Valid`)), τ_u])
```

**(LLVMTy-StringManaged)**

```text
T = TypeString(`@Managed`)    Γ ⊢ LLVMTy(TypePrim("usize")) ⇓ τ_u
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LLVMTy(T) ⇓ LLVMStruct([LLVMPtrTy(TypePtr(TypePrim("u8"), `Valid`)), τ_u, τ_u])
```

**(LLVMTy-BytesView)**

```text
T = TypeBytes(`@View`)    Γ ⊢ LLVMTy(TypePrim("usize")) ⇓ τ_u
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LLVMTy(T) ⇓ LLVMStruct([LLVMPtrTy(TypePtr(TypePerm(`const`, TypePrim("u8")), `Valid`)), τ_u])
```

**(LLVMTy-BytesManaged)**

```text
T = TypeBytes(`@Managed`)    Γ ⊢ LLVMTy(TypePrim("usize")) ⇓ τ_u
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LLVMTy(T) ⇓ LLVMStruct([LLVMPtrTy(TypePtr(TypePrim("u8"), `Valid`)), τ_u, τ_u])
```

**(LLVMTy-Err)**
LLVMTy(T) undefined
──────────────────────────────

```text
Γ ⊢ LLVMTy(T) ⇑
```

#### 24.7.8 IR Declaration and Instruction Lowering

```text
LowerIRJudg = {LowerIRDecl(d) ⇓ ll, LowerIRInstr(op) ⇓ ll}
```

LLVMInstrList = [LLVMInstr]

```text
Label(l) ∈ LLVMInstr
Br(l) ∈ LLVMInstr
BrCond(v, l_t, l_f) ∈ LLVMInstr
Phi(τ, inc, v) ∈ LLVMInstr
HasLabel(I, l) ⇔ Label(l) ∈ I
HasBrCond(I, v) ⇔ ∃ l_t, l_f. BrCond(v, l_t, l_f) ∈ I
HasPhi(I, v) ⇔ ∃ τ, inc. Phi(τ, inc, v) ∈ I
FreshLabel(Γ) predicate
FreshSSA(Γ) predicate
```

LLVMSSA = Name
LLVMLabel = Name

```text
FreshLabel(Γ) ∈ LLVMLabel \ dom(Γ)
FreshSSA(Γ) ∈ LLVMSSA \ dom(Γ)
```

```text
IfLabels(Γ) = ⟨l_t, l_f, l_m⟩ ∧ Distinct([l_t, l_f, l_m])
```

```text
LLResult = {⟨I, v⟩ | I ∈ LLVMInstrList ∧ v ∈ LLVMSSA ∪ {⊥}}
SeqLL(⟨I_1, v_1⟩, ⟨I_2, v_2⟩) = ⟨I_1 ++ I_2, v_2⟩
```

**(LowerIRInstr-Empty)**
──────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(ε) ⇓ ⟨[], ⊥⟩
```

**(LowerIRInstr-Seq)**

```text
Γ ⊢ LowerIRInstr(IR_1) ⇓ ll_1    Γ ⊢ LowerIRInstr(IR_2) ⇓ ll_2
```

──────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(SeqIR(IR_1, IR_2)) ⇓ SeqLL(ll_1, ll_2)
```

Load(slot, T) = [`load` LLVMTy(T), slot : LLVMPtrTy(T)]
Store(slot, v, T) = [`store` LLVMTy(T) v, slot : LLVMPtrTy(T)]
Memcpy(dst, src, n) = [`call` `llvm.memcpy`(dst, src, n)]
Memset(dst, 0, n) = [`call` `llvm.memset`(dst, 0, n)]

```text
LoadVal(slot, T) ⇓ ⟨Load(slot, T), v⟩
```

LEValue(bytes) = ∑_{i=0}^{|bytes|-1} bytes[i] · 256^i
ByteInt(bytes) = i{8|bytes|} LEValue(bytes)

```text
AllZero(bytes) ⇔ ∀ b ∈ bytes. b = 0x00
```

ByteArray(bytes) = LLVMArrayConst(|bytes|, i8, bytes)

```text
ConstBytes(τ, bytes) = c ⇔ ∃ T. Γ ⊢ LLVMTy(T) ⇓ τ ∧ |bytes| = sizeof(T) ∧ c = ConstBytesCase(τ, bytes)
```

ConstBytesCase(τ, bytes) =
 `zeroinitializer`    if |bytes| = 0
 ByteArray(bytes)     if τ = LLVMArray(|bytes|, i8)
 ByteInt(bytes)       if τ = i{8|bytes|}

```text
 `bitcast`(ByteInt(bytes) to τ)    if τ ∈ {`half`, `float`, `double`}
 `null`               if τ = LLVMPtrTy(U) ∧ AllZero(bytes)
 ⊥                    otherwise
```

LLVMGlobalZero(sym, τ, align) = LLVMGlobalConst(sym, τ, `zeroinitializer`, align)

StaticType(sym) = TypeArray(TypePrim("u8"), Literal(IntLiteral(|bytes|)))    if sym = Mangle(LiteralData(kind, bytes))

```text
StaticType(sym) = T ⇔ StaticSymPath(path, name) = sym ∧ StaticType(path, name) = T
StateRefJudg = {Γ ⊢ StateRef(sym) ⇓ slot}
```

SessionStateSlot(sym) denotes the addressable storage slot for `sym` in the active hosted session environment.

**(StateRef-Session)**

```text
HostedStateSym(Project(Γ), sym)
```

────────────────────────────────────────────

```text
Γ ⊢ StateRef(sym) ⇓ SessionStateSlot(sym)
```

**(StateRef-Global)**

```text
¬ HostedStateSym(Project(Γ), sym)
```

────────────────────────────────

```text
Γ ⊢ StateRef(sym) ⇓ @sym
```

```text
ProcModule(sym) = m ⇔ ∃ item, p. item ∈ {ProcedureDecl, MethodDecl, ClassMethodDecl, StateMethodDecl, TransitionDecl, DefaultImpl} ∧ ItemPath(item) = p ∧ Γ ⊢ Mangle(item) ⇓ sym ∧ ModuleOfPath(p) = m
```

SigOf(callee) =

```text
 ⟨params, ret⟩    if callee = sym ∧ Γ ⊢ Mangle(d) ⇓ sym ∧ d ∈ {ProcedureDecl, MethodDecl, DefaultImpl} ∧ Sig(d) = ⟨params, ret⟩
 RuntimeSig(sym)  if callee = sym ∧ RuntimeSig(sym) defined
 ⟨params, ret⟩    if ExprType(callee) = TypeFunc(params, ret)
 ⊥                otherwise
LoweredSigOf(callee) = ⟨params', ret⟩ ⇔ ⟨params, ret⟩ = SigOf(callee) ∧ params' = (NeedsPanicOut(callee) Sigma params ++ [PanicOutParam] : params)
```

```text
ParamInitIR(sig, params) = ++_{⟨mode, x, T⟩ ∈ params} ParamInit(sig, params, x, mode, T)
```

ZeroValue(T) = `zeroinitializer` if sizeof(T) = 0
ParamInit(sig, params, x, mode, T) =

```text
 Store(BindSlot(x), LLVMParam(sig, params, x), T)    if ABIParam(mode, T) = `ByValue` ∧ sizeof(T) > 0
 Store(BindSlot(x), ZeroValue(T), T)                 if ABIParam(mode, T) = `ByValue` ∧ sizeof(T) = 0
 ε                                                   if ABIParam(mode, T) = `ByRef`
ParamOrder(params) = [x_i | ⟨mode_i, x_i, T_i⟩ ∈ params ∧ (ABIParam(mode_i, T_i) = `ByRef` ∨ sizeof(T_i) > 0)]
ParamIndex(params, x) = i ⇔ ParamOrder(params)[i] = x
```

LLVMArgs(sig) = sig.llvm_params
LLVMArg(sig, i) = LLVMArgs(sig)[i]
i' = (sig.sretSigma Sigma ParamIndex(params, x) + 1 : ParamIndex(params, x))
LLVMParam(sig, params, x) = LLVMArg(sig, i')

**(LowerIRDecl-Proc-User)**

```text
LLVMCallSig(params, R) ⇓ sig    ProcModule(sym) = m    IR_p = ParamInitIR(sig, params)    IR_0 = (NeedsPanicOut(sym) Sigma SeqIR(ClearPanic, IR) : IR)    IR' = SeqIR(IR_p, CheckPoison(m), IR_0)    Γ ⊢ LowerIRInstr(IR') ⇓ ll
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRDecl(ProcIR(sym, params, R, IR)) ⇓ LLVMDefine(sym, sig, ll)
```

**(LowerIRDecl-Proc-Gen)**

```text
LLVMCallSig(params, R) ⇓ sig    ProcModule(sym) undefined    IR_p = ParamInitIR(sig, params)    Γ ⊢ LowerIRInstr(SeqIR(IR_p, (NeedsPanicOut(sym) Sigma SeqIR(ClearPanic, IR) : IR))) ⇓ ll
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRDecl(ProcIR(sym, params, R, IR)) ⇓ LLVMDefine(sym, sig, ll)
```

**(LowerIRDecl-GlobalConst)**

```text
T = StaticType(sym)    Γ ⊢ LLVMTy(T) ⇓ τ    ConstBytes(τ, bytes) = c
```

────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRDecl(GlobalConst(sym, bytes)) ⇓ LLVMGlobalConst(sym, τ, c, alignof(T))
```

**(LowerIRDecl-GlobalZero)**

```text
T = StaticType(sym)    Γ ⊢ LLVMTy(T) ⇓ τ    size = sizeof(T)
```

───────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRDecl(GlobalZero(sym, size)) ⇓ LLVMGlobalZero(sym, τ, alignof(T))
```

```text
When `HostedStateSym(Project(Γ), sym)` holds, the `GlobalConst(sym, bytes)` and `GlobalZero(sym, size)` judgments above define the initializer template for the per-session slot selected by `StateRef(sym)`, not one shared mutable runtime cell. A conforming backend MAY materialize that template as immutable process-global data, but every runtime load/store routed through `StateRef(sym)` MUST observe the distinct live-session cell required by §24.4.1.
```

**(LowerIRDecl-VTable)**
GlobalVTable(sym, header, slots) = d
──────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRDecl(d) ⇓ LLVMGlobalVTable(sym, header, slots)
```

**(Lower-AllocIR)**

```text
BuiltinModalSym(`Region::alloc`) ⇓ sym    r = InnermostActiveRegion(Γ) if r_opt = ⊥, otherwise r_opt    TypeOf(v) = T    sizeof(T) = n    alignof(T) = a    Γ ⊢ LowerIRInstr(CallIR(sym, [r, IntVal(`usize`, n), IntVal(`usize`, a)])) ⇓ ⟨I_a, p⟩    Store(p, v, T) = I_s
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(AllocIR(r_opt, v)) ⇓ ⟨I_a ++ I_s, p⟩
```

**(Lower-BindVarIR)**

```text
Γ ⊢ BindSlot(x) ⇓ slot    TypeOf(x) = T_x
```

─────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(BindVarIR(x, v)) ⇓ ⟨[Store(slot, v, T_x)], ⊥⟩
```

**(Lower-ReadVarIR)**

```text
Γ ⊢ BindSlot(x) ⇓ slot    TypeOf(x) = T_x    Γ ⊢ BindValid(x) ⇓ `Valid`
```

───────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(ReadVarIR(x)) ⇓ ⟨[Load(slot, T_x)], v⟩
```

**(Lower-ReadVarIR-Err)**

```text
Γ ⊢ BindValid(x) ⇓ s    s ≠ `Valid`
```

───────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(ReadVarIR(x)) ⇑
```

```text
ProcSymbol(sym) ⇔ ∃ item. item ∈ {ProcedureDecl, MethodDecl, ClassMethodDecl, StateMethodDecl, TransitionDecl, DefaultImpl} ∧ Γ ⊢ Mangle(item) ⇓ sym
```

**(Lower-ReadPathIR-Static-User)**

```text
StaticSymPath(path, name) = sym    ProcModule(sym) = m    T = StaticType(sym)    Γ ⊢ StateRef(sym) ⇓ slot    Γ ⊢ LowerIRInstr(CheckPoison(m)) ⇓ ⟨I_p, ⊥⟩
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(ReadPathIR(path, name)) ⇓ ⟨I_p ++ [Load(slot, T)], v⟩
```

**(Lower-ReadPathIR-Static-Gen)**

```text
StaticSymPath(path, name) = sym    ProcModule(sym) undefined    T = StaticType(sym)    Γ ⊢ StateRef(sym) ⇓ slot
```

───────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(ReadPathIR(path, name)) ⇓ ⟨[Load(slot, T)], v⟩
```

**(Lower-ReadPathIR-Proc-User)**

```text
sym = PathSym(path, name)    ProcSymbol(sym)    ProcModule(sym) = m    Γ ⊢ LowerIRInstr(CheckPoison(m)) ⇓ ⟨I_p, ⊥⟩
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(ReadPathIR(path, name)) ⇓ ⟨I_p, sym⟩
```

**(Lower-ReadPathIR-Proc-Gen)**
sym = PathSym(path, name)    ProcSymbol(sym)    ProcModule(sym) undefined
─────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(ReadPathIR(path, name)) ⇓ ⟨ε, sym⟩
```

**(Lower-ReadPathIR-Runtime)**
sym = PathSym(path, name)    RuntimeSig(sym) defined
────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(ReadPathIR(path, name)) ⇓ ⟨ε, sym⟩
```

**(Lower-ReadPathIR-Record)**

```text
p = path ++ [name]    RecordDecl(p) = R    ModuleOfPath(p) = m    Γ ⊢ LowerIRInstr(CheckPoison(m)) ⇓ ⟨I_p, ⊥⟩
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(ReadPathIR(path, name)) ⇓ ⟨I_p, RecordCtor(p)⟩
```

**(Lower-StoreVarIR)**

```text
Γ ⊢ BindSlot(x) ⇓ slot    TypeOf(x) = T_x    Γ ⊢ DropOnAssign(x, slot) ⇓ IR_d
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(StoreVarIR(x, v)) ⇓ ⟨IR_d ++ [Store(slot, v, T_x)], ⊥⟩
```

**(Lower-StoreVarNoDropIR)**

```text
Γ ⊢ BindSlot(x) ⇓ slot    TypeOf(x) = T_x
```

──────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(StoreVarNoDropIR(x, v)) ⇓ ⟨[Store(slot, v, T_x)], ⊥⟩
```

**(Lower-MoveStateIR)**

```text
x = PlaceRoot(p)    Γ ⊢ UpdateValid(x, MoveStateIR(p)) ⇓ v'
```

──────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(MoveStateIR(p)) ⇓ ⟨ε, ⊥⟩
```

**(Lower-StoreGlobal)**

```text
T = StaticType(sym)    Γ ⊢ LLVMTy(T) ⇓ τ    Γ ⊢ StateRef(sym) ⇓ slot
```

────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(StoreGlobal(sym, v)) ⇓ ⟨[Store(slot, v, T)], ⊥⟩
```

**(Lower-ReadPlaceIR)**

```text
Γ ⊢ LowerReadPlace(p) ⇓ ⟨IR_p, v⟩    Γ ⊢ LowerIRInstr(IR_p) ⇓ ll
```

────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(ReadPlaceIR(p)) ⇓ ll
```

**(Lower-WritePlaceIR)**

```text
Γ ⊢ LowerWritePlace(p, v) ⇓ IR_w    Γ ⊢ LowerIRInstr(IR_w) ⇓ ll
```

──────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(WritePlaceIR(p, v)) ⇓ ll
```

```text
PtrType(v) = T ⇔ (∃ e, IR. Γ ⊢ LowerExpr(e) ⇓ ⟨IR, v⟩ ∧ T = ExprType(e)) ∨ (∃ p, IR. Γ ⊢ LowerReadPlace(p) ⇓ ⟨IR, v⟩ ∧ T = ExprType(p))
```

**(Lower-ReadPtrIR)**
PtrType(v_ptr) = TypePtr(T, `Valid`)
──────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(ReadPtrIR(v_ptr)) ⇓ ⟨[Load(PtrAddr(v_ptr), T)], v⟩
```

**(Lower-ReadPtrIR-Raw)**
PtrType(v_ptr) = TypeRawPtr(q, T)
──────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(ReadPtrIR(v_ptr)) ⇓ ⟨[Load(PtrAddr(v_ptr), T)], v⟩
```

**(Lower-ReadPtrIR-Null)**

```text
PtrType(v_ptr) = TypePtr(T, `Null`)    Γ ⊢ LowerIRInstr(LowerPanic(NullDeref)) ⇓ ll
```

──────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(ReadPtrIR(v_ptr)) ⇓ ll
```

**(Lower-ReadPtrIR-Expired)**

```text
PtrType(v_ptr) = TypePtr(T, `Expired`)    Γ ⊢ LowerIRInstr(LowerPanic(ExpiredDeref)) ⇓ ll
```

────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(ReadPtrIR(v_ptr)) ⇓ ll
```

**(Lower-WritePtrIR)**
PtrType(v_ptr) = TypePtr(T, `Valid`)
────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(WritePtrIR(v_ptr, v)) ⇓ ⟨[Store(PtrAddr(v_ptr), v, T)], ⊥⟩
```

**(Lower-WritePtrIR-Null)**

```text
PtrType(v_ptr) = TypePtr(T, `Null`)    Γ ⊢ LowerIRInstr(LowerPanic(NullDeref)) ⇓ ll
```

──────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(WritePtrIR(v_ptr, v)) ⇓ ll
```

**(Lower-WritePtrIR-Expired)**

```text
PtrType(v_ptr) = TypePtr(T, `Expired`)    Γ ⊢ LowerIRInstr(LowerPanic(ExpiredDeref)) ⇓ ll
```

────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(WritePtrIR(v_ptr, v)) ⇓ ll
```

**(Lower-WritePtrIR-Raw)**
PtrType(v_ptr) = TypeRawPtr(`mut`, T)
────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(WritePtrIR(v_ptr, v)) ⇓ ⟨[Store(PtrAddr(v_ptr), v, T)], ⊥⟩
```

**(Lower-WritePtrIR-Raw-Err)**
PtrType(v_ptr) = TypeRawPtr(`imm`, T)
──────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(WritePtrIR(v_ptr, v)) ⇑
```

**(Lower-AddrOfIR)**

```text
Γ ⊢ LowerAddrOf(p) ⇓ ⟨IR_p, addr⟩    Γ ⊢ LowerIRInstr(IR_p) ⇓ ll
```

──────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(AddrOfIR(p)) ⇓ ll
```

CallPoison(f) =
 CheckPoison(m)    if ProcModule(f) = m

```text
 ε                 if ProcModule(f) undefined
```

```text
SRetAlloc(R) ⇓ ⟨[`alloca` LLVMTy(R)], p⟩
```

```text
CallArgs(sig, params, args, R) ⇓ ⟨I_a, vec_a, p_ret⟩ ⇔
 I_a = ε ∧ vec_a = args ∧ p_ret = ⊥    if sig.sretSigma = false
 ∃ p. SRetAlloc(R) ⇓ ⟨I_s, p⟩ ∧ I_a = I_s ∧ vec_a = [p] ++ args ∧ p_ret = p    if sig.sretSigma = true
```

```text
CallInstr(sig, f, vec_a) ⇓ ⟨[`call` sig f(vec_a)], v_c⟩ ⇔
 v_c = (sig.llvm_ret = `void` Sigma ⊥ : call_result)
```

```text
CallResult(sig, R, p_ret, v_c) ⇓ ⟨I_r, v⟩ ⇔
 I_r = ε ∧ v = v_c    if sig.sretSigma = false
 LoadVal(p_ret, R) ⇓ ⟨I_r, v⟩    if sig.sretSigma = true
```

**(Lower-CallIR-Func)**

```text
CallTarget(callee) = f    f ≠ RecordCtor(_)    LoweredSigOf(f) = ⟨params, ret⟩    LLVMCallSig(params, ret) ⇓ sig    CallPoison(f) = IR_p    Γ ⊢ LowerIRInstr(IR_p) ⇓ ⟨I_p, ⊥⟩    CallArgs(sig, params, args, ret) ⇓ ⟨I_a, vec_a, p_ret⟩    CallInstr(sig, f, vec_a) ⇓ ⟨I_c, v_c⟩    CallResult(sig, ret, p_ret, v_c) ⇓ ⟨I_r, v_call⟩
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(CallIR(callee, args)) ⇓ ⟨I_p ++ I_a ++ I_c ++ I_r, v_call⟩
```

```text
DynType(v) = TypeDynamic(Cl) ⇔ (∃ e, IR. Γ ⊢ LowerExpr(e) ⇓ ⟨IR, v⟩ ∧ ExprType(e) = TypeDynamic(Cl)) ∨ (∃ p, IR. Γ ⊢ LowerReadPlace(p) ⇓ ⟨IR, v⟩ ∧ ExprType(p) = TypeDynamic(Cl))
```

DynData(v) = FieldValue(v, `data`) and DynVTable(v) = FieldValue(v, `vtable`)
VTableSlotIndex(i) = i + 3
GEP(ptr, [i_0, …, i_k]) = v_gep
VTableSlotAddr(vt, i) = GEP(vt, [0, VTableSlotIndex(i)])
VTableSlot(vt, i) = Load(VTableSlotAddr(vt, i), TypeRawPtr(`imm`, TypePrim("()")))

**(Lower-CallVTable)**

```text
DynType(base) = TypeDynamic(Cl)    v_d = DynData(base)    v_t = DynVTable(base)    v_s = VTableSlot(v_t, i)    Γ ⊢ LowerIRInstr(CallIR(v_s, [v_d] ++ args)) ⇓ ll
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(CallVTable(base, i, args)) ⇓ ll
```

**(LowerIRInstr-ClearPanic)**

```text
Γ ⊢ ClearPanic ⇓ IR    Γ ⊢ LowerIRInstr(IR) ⇓ ll
```

────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(ClearPanic) ⇓ ll
```

**(LowerIRInstr-PanicCheck)**

```text
Γ ⊢ PanicCheck ⇓ IR    Γ ⊢ LowerIRInstr(IR) ⇓ ll
```

────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(PanicCheck) ⇓ ll
```

**(LowerIRInstr-CheckPoison)**

```text
Γ ⊢ CheckPoison(m) ⇓ IR    Γ ⊢ LowerIRInstr(IR) ⇓ ll
```

────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(CheckPoison(m)) ⇓ ll
```

**(LowerIRInstr-LowerPanic)**

```text
Γ ⊢ LowerPanic(r) ⇓ IR    Γ ⊢ LowerIRInstr(IR) ⇓ ll
```

────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(LowerPanic(r)) ⇓ ll
```

```text
IfPhi(v_t, v_f, l_t, l_f) ⇓ ⟨I_phi, v_phi⟩ ⇔
 I_phi = ε ∧ v_phi = ⊥    if v_t = ⊥ ∨ v_f = ⊥
 ∃ T, τ, inc. ValueType(v_t) = T ∧ ValueType(v_f) = T ∧ Γ ⊢ LLVMTy(T) ⇓ τ ∧ inc = [⟨v_t, l_t⟩, ⟨v_f, l_f⟩] ∧ I_phi = [Phi(τ, inc, v_phi)]    if v_t ≠ ⊥ ∧ v_f ≠ ⊥
```

```text
IfLowerForm(I, v_c, v_t, v_f, v) ⇔ HasBrCond(I, v_c) ∧ ((v_t = ⊥ ∨ v_f = ⊥) ⇒ v = ⊥) ∧ ((v_t ≠ ⊥ ∧ v_f ≠ ⊥) ⇒ HasPhi(I, v))
```

**(Lower-IfIR)**

```text
IfLabels(Γ) = ⟨l_t, l_f, l_m⟩    Γ ⊢ LowerIRInstr(IR_t) ⇓ ⟨I_t, v_t'⟩    Γ ⊢ LowerIRInstr(IR_f) ⇓ ⟨I_f, v_f'⟩    v_t' = v_t    v_f' = v_f    IfPhi(v_t, v_f, l_t, l_f) ⇓ ⟨I_phi, v⟩    I = [BrCond(v_c, l_t, l_f), Label(l_t)] ++ I_t ++ [Br(l_m), Label(l_f)] ++ I_f ++ [Br(l_m), Label(l_m)] ++ I_phi    IfLowerForm(I, v_c, v_t, v_f, v)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(IfIR(v_c, IR_t, v_t, IR_f, v_f)) ⇓ ⟨I, v⟩
```

BlockScope(IR_s, IR_t) = scope

```text
BlockScope(IR_s, IR_t) = scope ⇔ (∃ σ, σ_1, σ_2, out, scope_0. BlockEnter(σ, []) ⇓ (σ_1, scope_0) ∧ ExecBlockBodyIRSigma(IR_s, IR_t, σ_1) ⇓ (out, σ_2)) ∧ (∀ σ, σ_1, σ_2, out, scope_0. BlockEnter(σ, []) ⇓ (σ_1, scope_0) ∧ ExecBlockBodyIRSigma(IR_s, IR_t, σ_1) ⇓ (out, σ_2) ⇒ CurrentScope(σ_2) = scope)
EmitCleanupSpec(cs, IR) ⇔ ∀ σ, Γ ⊢ Cleanup(cs, σ) ⇓ (c, σ') ⇒ (ExecIRSigma(IR, σ) ⇓ (out, σ') ∧ ((c = panic) ⇒ out = Ctrl(Panic)) ∧ ((c = ok) ⇒ out = Val(())))
Γ ⊢ EmitCleanup(cs) ⇓ IR ⇔ EmitCleanupSpec(cs, IR)
```

**(Lower-BlockIR)**

```text
Γ ⊢ LowerIRInstr(IR_s) ⇓ ⟨I_s, ⊥⟩    Γ ⊢ LowerIRInstr(IR_t) ⇓ ⟨I_t, v_t'⟩    v_t' = v_t    BlockScope(IR_s, IR_t) = scope    Γ ⊢ CleanupPlan(scope) ⇓ cs    Γ ⊢ EmitCleanup(cs) ⇓ IR_c    Γ ⊢ LowerIRInstr(IR_c) ⇓ ⟨I_c, ⊥⟩
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(BlockIR(IR_s, IR_t, v_t)) ⇓ ⟨I_s ++ I_t ++ I_c, v_t⟩
```

LoopLowerForm(I, loop, v) predicate
LoopIRForm(loop) predicate
IfCaseLowerForm(I, if_case, v) predicate
IfCaseIRForm(if_case) predicate
RegionLowerForm(I, region, v) predicate
RegionIRForm(region) predicate
FrameLowerForm(I, frame, v) predicate
FrameIRForm(frame) predicate

```text
LoopLowerForm(I, loop, v) ⇔ ⟨I, v⟩ ∈ LLResult
IfCaseLowerForm(I, if_case, v) ⇔ ⟨I, v⟩ ∈ LLResult
RegionLowerForm(I, region, v) ⇔ ⟨I, v⟩ ∈ LLResult
FrameLowerForm(I, frame, v) ⇔ ⟨I, v⟩ ∈ LLResult
LoopIRForm(loop) ⇔ (∃ IR_b, v_b. loop = LoopIR(LoopInfinite, IR_b, v_b)) ∨ (∃ IR_c, v_c, IR_b, v_b. loop = LoopIR(LoopConditional, IR_c, v_c, IR_b, v_b)) ∨ (∃ pat, ty_opt, IR_i, v_iter, IR_b, v_b. loop = LoopIR(LoopIter, pat, ty_opt, IR_i, v_iter, IR_b, v_b))
IfCaseIRForm(if_case) ⇔ ∃ v_s, cases, else_opt. if_case = IfCaseIR(v_s, cases, else_opt)
RegionIRForm(region) ⇔ ∃ v_o, alias_opt, IR_b, v_b. region = RegionIR(v_o, alias_opt, IR_b, v_b)
FrameIRForm(frame) ⇔ ∃ v_r, IR_b, v_b. frame = FrameIR(v_r, IR_b, v_b)
```

**(Lower-LoopIR)**
LoopIRForm(loop)    LoopLowerForm(I, loop, v)
────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(loop) ⇓ ⟨I, v⟩
```

**(Lower-IfCaseIR)**
IfCaseIRForm(if_case)    IfCaseLowerForm(I, if_case, v)
────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(if_case) ⇓ ⟨I, v⟩
```

**(Lower-RegionIR)**
RegionIRForm(region)    RegionLowerForm(I, region, v)
──────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(region) ⇓ ⟨I, v⟩
```

**(Lower-FrameIR)**
FrameIRForm(frame)    FrameLowerForm(I, frame, v)
──────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(frame) ⇓ ⟨I, v⟩
```

```text
BranchLowerForm(I, target) ⇔ Br(target) ∈ I
BranchLowerForm(I, v_c, t, f) ⇔ BrCond(v_c, t, f) ∈ I
```

**(Lower-BranchIR)**
BranchLowerForm(I, target)
────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(BranchIR(target)) ⇓ ⟨I, ⊥⟩
```

BranchLowerForm(I, v_c, t, f)
──────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(BranchIR(v_c, t, f)) ⇓ ⟨I, ⊥⟩
```

```text
PhiLowerForm(I, T, inc, v) ⇔ Γ ⊢ LLVMTy(T) ⇓ τ ∧ I = [Phi(τ, inc, v)]
```

**(Lower-PhiIR)**
PhiLowerForm(I, T, inc, v)
──────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIRInstr(PhiIR(T, inc, v)) ⇓ ⟨I, v⟩
```

**(LowerIRDecl-Err)**

```text
Γ ⊢ LowerIRDecl(d) ⇑
```

────────────────────

```text
Γ ⊢ LowerIRDecl(d) ⇑
```

**(LowerIRInstr-Err)**

```text
Γ ⊢ LowerIRInstr(op) ⇑
```

──────────────────────

```text
Γ ⊢ LowerIRInstr(op) ⇑
```

#### 24.7.9 Binding Storage and Validity

```text
BindStorageJudg = {BindSlot(x) ⇓ slot, BindValid(x) ⇓ v, UpdateValid(x, op) ⇓ v', DropOnAssign(x, slot) ⇓ IR}
TypeOf(x) = T ⇔ Γ; R; L ⊢ Identifier(x) : T
BindInfo(x) = info ⇔ BindState(Γ) = 𝔅 ∧ Lookup_B(𝔅, x) = info
```

```text
ProcParams(Γ) = params ⇔ Γ is lowering ProcIR(_, params, _, _)
ProcRet(Γ) = R ⇔ Γ is lowering ProcIR(_, _, R, _)
ProcSig(Γ) = sig ⇔ Γ ⊢ LLVMCallSig(ProcParams(Γ), ProcRet(Γ)) ⇓ sig
ParamEntry(params, x) = ⟨mode, T⟩ ⇔ ⟨mode, x, T⟩ ∈ params
```

AllocaSlot(T) = LLVMAlloca(LLVMTy(T))
RegionSlot(r, T) = CallIR(BuiltinModalSym(`Region::alloc`), [r, IntVal(`usize`, sizeof(T)), IntVal(`usize`, alignof(T))])

```text
BindState(Γ) = Γ.bind_state
```

```text
ResolveEntry_π([], tag) = ⊥
ResolveEntry_π(⟨tag, target⟩ :: es, t) =
 ⟨tag, target⟩             if t = tag
  ResolveEntry_π(es, t)      otherwise
ResolveTarget_π(⟨Σ_π, RS⟩, tag) = target ⇔ ResolveEntry_π(RS, tag) = ⟨tag, target⟩
BindProv_Γ(x) = π ⇔ Γ has provenance environment Ω ∧ Γ; Ω ⊢ Identifier(x) ⇓ π
BindRegionTarget(x) = r ⇔ BindProv_Γ(x) = π_Region(tag) ∧ ResolveTarget_π(Ω, tag) = r
```

```text
`ResolveTarget_π(Ω, tag)` returns the nearest live target alias recorded for `tag`. For unique region handles, rebinding updates the region-target relation by introducing the new binding name as the nearest alias for that tag.
```

**(BindValid-Sigma)**

```text
BindState(Γ) = 𝔅    Lookup_B(𝔅, x) = ⟨s, _, _, _⟩
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ BindValid(x) ⇓ s
```

**(BindSlot-Param-ByValue)**

```text
ProcParams(Γ) = params    ParamEntry(params, x) = ⟨mode, T⟩    Γ ⊢ ABIParam(mode, T) ⇓ `ByValue`
```

───────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BindSlot(x) ⇓ AllocaSlot(T)
```

**(BindSlot-Param-ByRef)**

```text
ProcParams(Γ) = params    ParamEntry(params, x) = ⟨mode, T⟩    Γ ⊢ ABIParam(mode, T) ⇓ `ByRef`    ProcSig(Γ) = sig
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BindSlot(x) ⇓ LLVMParam(sig, params, x)
```

**(BindSlot-Region)**
BindRegionTarget(x) = r
──────────────────────────────────────────────────────────────

```text
Γ ⊢ BindSlot(x) ⇓ RegionSlot(r, TypeOf(x))
```

**(BindSlot-Local)**

```text
Γ ⊢ ResolveValueName(x) ⇓ ent    ent.origin_opt = ⊥    ParamEntry(ProcParams(Γ), x) undefined
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BindSlot(x) ⇓ AllocaSlot(TypeOf(x))
```

**(BindSlot-Static)**

```text
Γ ⊢ ResolveValueName(x) ⇓ ent    ent.origin_opt = mp    name = (ent.target_opt if present, else x)    PathOfModule(mp) = path    StaticSymPath(path, name) = sym    Γ ⊢ StateRef(sym) ⇓ slot
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BindSlot(x) ⇓ slot
```

**(UpdateValid-BindVar)**
──────────────────────────────────────────────────────────────

```text
Γ ⊢ UpdateValid(x, BindVarIR(x, v)) ⇓ `Valid`
```

**(UpdateValid-StoreVar)**
──────────────────────────────────────────────────────────────

```text
Γ ⊢ UpdateValid(x, StoreVarIR(x, v)) ⇓ `Valid`
```

**(UpdateValid-StoreVarNoDrop)**

```text
Γ ⊢ BindValid(x) ⇓ s
```

──────────────────────────────────────────────────────────────────────

```text
Γ ⊢ UpdateValid(x, StoreVarNoDropIR(x, v)) ⇓ s
```

**(UpdateValid-MoveRoot)**

```text
op = MoveStateIR(p)    PlaceRoot(p) = x    FieldHead(p) = ⊥
```

──────────────────────────────────────────────────────────────────────

```text
Γ ⊢ UpdateValid(x, op) ⇓ Moved
```

**(UpdateValid-PartialMove-Init)**

```text
op = MoveStateIR(p)    PlaceRoot(p) = x    FieldHead(p) = f    BindValid(x) ⇓ `Valid`
```

─────────────────────────────────────────────────────────────────────────────────────────────

```text
UpdateValid(x, op) ⇓ PartiallyMoved({f})
```

**(UpdateValid-PartialMove-Step)**

```text
op = MoveStateIR(p)    PlaceRoot(p) = x    FieldHead(p) = f    BindValid(x) ⇓ PartiallyMoved(F)
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
UpdateValid(x, op) ⇓ PartiallyMoved(F ∪ {f})
```

```text
DropOnAssignApplicable(x) ⇔ BindInfo(x).mov = immov ∧ BindInfo(x).resp = resp
```

FieldsRev(R) = rev(Fields(R))
FieldDropIR(slot, p, f, T) = EmitDrop(T, Load(FieldAddr(TypePath(p), slot, f), T))

```text
FieldDropSeq(slot, p, F) = ++_{⟨f_i, T_i⟩ ∈ FieldsRev(RecordDecl(p)), f_i ∉ F} FieldDropIR(slot, p, f_i, T_i)
```

**(DropOnAssign-NotApplicable)**

```text
¬ DropOnAssignApplicable(x)
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ DropOnAssign(x, slot) ⇓ ε
```

**(DropOnAssign-Record-Valid)**

```text
DropOnAssignApplicable(x)    TypeOf(x) = TypePath(p)    RecordDecl(p) = R    BindValid(x) ⇓ `Valid`
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ DropOnAssign(x, slot) ⇓ EmitDrop(TypePath(p), Load(slot, TypePath(p)))
```

**(DropOnAssign-Record-Partial)**

```text
DropOnAssignApplicable(x)    TypeOf(x) = TypePath(p)    RecordDecl(p) = R    BindValid(x) ⇓ PartiallyMoved(F)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ DropOnAssign(x, slot) ⇓ FieldDropSeq(slot, p, F)
```

**(DropOnAssign-Record-Moved)**

```text
DropOnAssignApplicable(x)    TypeOf(x) = TypePath(p)    RecordDecl(p) = R    BindValid(x) ⇓ Moved
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ DropOnAssign(x, slot) ⇓ ε
```

**(DropOnAssign-Aggregate-Ok)**

```text
DropOnAssignApplicable(x)    TypeOf(x) ∈ {TypeArray(_, _), TypeTuple(_), TypeUnion(_), TypeModalState(_, _)}    BindValid(x) ⇓ s    s ≠ Moved
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ DropOnAssign(x, slot) ⇓ EmitDrop(TypeOf(x), Load(slot, TypeOf(x)))
```

**(DropOnAssign-Aggregate-Moved)**

```text
DropOnAssignApplicable(x)    TypeOf(x) ∈ {TypeArray(_, _), TypeTuple(_), TypeUnion(_), TypeModalState(_, _)}    BindValid(x) ⇓ Moved
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ DropOnAssign(x, slot) ⇓ ε
```

**(BindSlot-Err)**
BindSlot(x) undefined
────────────────────────────

```text
Γ ⊢ BindSlot(x) ⇑
```

**(BindValid-Err)**
BindValid(x) undefined
─────────────────────────────

```text
Γ ⊢ BindValid(x) ⇑
```

**(UpdateValid-Err)**
UpdateValid(x, op) undefined
────────────────────────────────

```text
Γ ⊢ UpdateValid(x, op) ⇑
```

**(DropOnAssign-Err)**
DropOnAssign(x, slot) undefined
──────────────────────────────────

```text
Γ ⊢ DropOnAssign(x, slot) ⇑
```

#### 24.7.10 Call ABI Mapping

```text
LLVMCallJudg = {LLVMCallSig(params, ret) ⇓ sig, LLVMArgLower(x, T, k) ⇓ ll, LLVMRetLower(T, k) ⇓ ll}
```

SigLLVMParams(sig) = llvm_params
SigLLVMRet(sig) = llvm_ret
SigLLVMAttrs(sig) = attrs
SigSRet(sig) = sretSigma

**(LLVMArgLower-ByValue-PtrValid)**

```text
Γ ⊢ LLVMTy(T) ⇓ τ    StripPerm(T) = TypePtr(U, `Valid`)
```

────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LLVMArgLower(x, T, `ByValue`) ⇓ ⟨τ, LLVMArgAttrsExt(x, T) ∪ LLVMPtrAttrs(T)⟩
```

**(LLVMArgLower-ByValue-Other)**

```text
Γ ⊢ LLVMTy(T) ⇓ τ    StripPerm(T) ≠ TypePtr(_, `Valid`)
```

──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LLVMArgLower(x, T, `ByValue`) ⇓ ⟨τ, LLVMArgAttrsExt(x, T)⟩
```

**(LLVMArgLower-ByRef)**

```text
Γ ⊢ LLVMTy(T) ⇓ τ
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LLVMArgLower(x, T, `ByRef`) ⇓ ⟨LLVMPtrTy(TypePtr(TypePerm(`const`, T), `Valid`)), LLVMPtrAttrs(TypePtr(TypePerm(`const`, T), `Valid`)) ∪ LLVMArgAttrsExt(x, T)⟩
```

**(LLVMRetLower-ByValue-ZST)**
sizeof(T) = 0
──────────────────────────────────────────────

```text
Γ ⊢ LLVMRetLower(T, `ByValue`) ⇓ `void`
```

**(LLVMRetLower-ByValue)**

```text
Γ ⊢ LLVMTy(T) ⇓ τ    sizeof(T) > 0
```

─────────────────────────────────────────────

```text
Γ ⊢ LLVMRetLower(T, `ByValue`) ⇓ τ
```

**(LLVMRetLower-SRet)**

```text
Γ ⊢ LLVMTy(T) ⇓ τ
```

──────────────────────────────────────────

```text
Γ ⊢ LLVMRetLower(T, `SRet`) ⇓ `void`
```

```text
ArgInclude(k, T) ⇔ (k = `ByRef`) ∨ (k = `ByValue` ∧ sizeof(T) > 0)
LLVMArgList([⟨m_1, x_1, T_1⟩, …, ⟨m_n, x_n, T_n⟩], [k_1, …, k_n]) = [τ_i | ArgInclude(k_i, T_i) ∧ Γ ⊢ LLVMArgLower(x_i, T_i, k_i) ⇓ ⟨τ_i, A_i⟩]
LLVMAttrList([⟨m_1, x_1, T_1⟩, …, ⟨m_n, x_n, T_n⟩], [k_1, …, k_n]) = [A_i | ArgInclude(k_i, T_i) ∧ Γ ⊢ LLVMArgLower(x_i, T_i, k_i) ⇓ ⟨τ_i, A_i⟩]
```

**(LLVMCall-ByValue)**

```text
⟨[k_1, …, k_n], k_r, sretSigma⟩ = ABICall([⟨m_1, T_1⟩, …, ⟨m_n, T_n⟩], R)    k_r = `ByValue`    ∀ i, Γ ⊢ LLVMArgLower(x_i, T_i, k_i) ⇓ ⟨τ_i, A_i⟩    Γ ⊢ LLVMRetLower(R, `ByValue`) ⇓ τ_r
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LLVMCallSig([⟨m_1, x_1, T_1⟩, …, ⟨m_n, x_n, T_n⟩], R) ⇓ ⟨LLVMArgList([⟨m_1, x_1, T_1⟩, …, ⟨m_n, x_n, T_n⟩], [k_1, …, k_n]), τ_r, LLVMAttrList([⟨m_1, x_1, T_1⟩, …, ⟨m_n, x_n, T_n⟩], [k_1, …, k_n]), false⟩
```

**(LLVMCall-SRet)**

```text
⟨[k_1, …, k_n], k_r, sretSigma⟩ = ABICall([⟨m_1, T_1⟩, …, ⟨m_n, T_n⟩], R)    k_r = `SRet`    sret_param = LLVMPtrTy(TypePtr(TypePerm(`unique`, R), `Valid`))    A_sret = {`sret`, `noalias`} ∪ LLVMPtrAttrs(TypePtr(TypePerm(`unique`, R), `Valid`))    ∀ i, Γ ⊢ LLVMArgLower(x_i, T_i, k_i) ⇓ ⟨τ_i, A_i⟩    Γ ⊢ LLVMRetLower(R, `SRet`) ⇓ `void`
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LLVMCallSig([⟨m_1, x_1, T_1⟩, …, ⟨m_n, x_n, T_n⟩], R) ⇓ ⟨[sret_param] ++ LLVMArgList([⟨m_1, x_1, T_1⟩, …, ⟨m_n, x_n, T_n⟩], [k_1, …, k_n]), `void`, [A_sret] ++ LLVMAttrList([⟨m_1, x_1, T_1⟩, …, ⟨m_n, x_n, T_n⟩], [k_1, …, k_n]), true⟩
```

ByRefAccess(T) =
 `rw`    if PermOf(T) = `unique`
 `ro`    otherwise

**(LLVMArgLower-Err)**
LLVMArgLower(x, T, k) undefined
───────────────────────────────────────

```text
Γ ⊢ LLVMArgLower(x, T, k) ⇑
```

**(LLVMRetLower-Err)**
LLVMRetLower(T, k) undefined
──────────────────────────────────

```text
Γ ⊢ LLVMRetLower(T, k) ⇑
```

**(LLVMCall-Err)**
LLVMCallSig(params, ret) undefined
──────────────────────────────────────

```text
Γ ⊢ LLVMCallSig(params, ret) ⇑
```

#### 24.7.11 VTable Emission

```text
VTableJudg = {EmitVTable(T, Cl) ⇓ IRDecl, EmitDropGlue(T) ⇓ IRDecl, DropGlueSym(T) ⇓ sym}
```

DropGlueSym(T) = PathSig(["ultraviolet", "runtime", "drop"] ++ PathOfType(T))
VTableHeader(T) = [sizeof(T), alignof(T), DropGlueSym(T)]
PtrTy = LLVMPtrTy(TypeRawPtr(`imm`, TypePrim("()")))
k = |VTable(T, Cl)|
VTableTy(Cl) = LLVMStruct([LLVMTy(TypePrim("usize")), LLVMTy(TypePrim("usize")), PtrTy] ++ [PtrTy]^k)

```text
GlobalVTable : Symbol × Header × Slots → IRDecl
LLVMGlobalVTable : Symbol × Header × Slots → LLVMDecl
```

```text
VTableSlots(T, Cl) = [DispatchSym(T, Cl, m.name) | m ∈ VTableEligible(Cl)]
```

```text
DropGlueSpec(T, IR) ⇔ ∀ σ, addr, v. LookupVal(σ, "data") = RawPtr(`imm`, addr) ∧ ReadAddr(σ, addr) = v ⇒ (ExecIRSigma(IR, σ) ⇓ (out, σ') ∧ Γ ⊢ DropValue(T, v, ∅) ⇓ σ')
Γ ⊢ DropGlueIR(T) ⇓ IR ⇔ DropGlueSpec(T, IR)
```

**(EmitDropGlue-Decl)**

```text
Γ ⊢ DropGlueSym(T) ⇓ sym    Γ ⊢ DropGlueIR(T) ⇓ IR_drop
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EmitDropGlue(T) ⇓ ProcIR(sym, [⟨`move`, `data`, TypeRawPtr(`imm`, TypePrim("()"))⟩, PanicOutParam], TypePrim("()"), IR_drop)
```

**(EmitVTable-Err)**
EmitVTable(T, Cl) undefined
──────────────────────────────

```text
Γ ⊢ EmitVTable(T, Cl) ⇑
```

#### 24.7.12 Literal Data Emission

```text
LiteralEmitJudg = {EmitLiteralData(kind, bytes) ⇓ IRDecl, EmitStringLit(lit) ⇓ sym, EmitBytesLit(lit) ⇓ sym}
```

StringBytes(lit) function
EscapeBytes(e) =
  EscapeValue(e)          if e = `"\u{"` h_1 … h_n `"}"`
  [EscapeValue(e)]        otherwise
StringBytesFrom(T, p, q) =
  []                                                        if p = q

```text
  EscapeBytes(Lexeme(T, p, r)) ++ StringBytesFrom(T, r, q)  if p < q ∧ T[p] = `"\\"` ∧ EscapeMatch(T, p, r)
  EncodeUTF8(T[p]) ++ StringBytesFrom(T, p + 1, q)          if p < q ∧ T[p] ≠ `"\\"`
StringBytes(lit) = bytes ⇔ lit.kind = StringLiteral ∧ T = Lexeme(lit) ∧ StringBytesFrom(T, 1, |T|-1) = bytes
RawBytes(lit) = bytes ⇔ lit.kind = BytesLiteral ∧ lit.payload = bytes
RawBytes(lit) = StringBytes(lit) ⇔ lit.kind = StringLiteral
```

**(EmitLiteralData-Decl)**

```text
Γ ⊢ Mangle(LiteralData(kind, bytes)) ⇓ sym
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ EmitLiteralData(kind, bytes) ⇓ GlobalConst(sym, bytes)
```

**(EmitLiteral-String)**

```text
StringBytes(lit) = bytes    Γ ⊢ Mangle(LiteralData("string", bytes)) ⇓ sym
```

────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EmitStringLit(lit) ⇓ sym
StringBytes(lit) = bytes ⇒ Utf8Valid(bytes)
```

**(EmitLiteral-Bytes)**

```text
RawBytes(lit) = bytes    Γ ⊢ Mangle(LiteralData("bytes", bytes)) ⇓ sym
```

──────────────────────────────────────────────────────────────────

```text
Γ ⊢ EmitBytesLit(lit) ⇓ sym
RawBytes(lit) undefined ⇒ EmitBytesLit(lit) undefined
```

**(EmitLiteral-Char)**

```text
T = TypePrim("char")    Γ ⊢ EncodeConst(T, lit) ⇓ bytes
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EmitLiteralData("char", bytes) ⇓ GlobalConst(Mangle(LiteralData("char", bytes)), bytes)
```

**(EmitLiteral-Int)**

```text
T = TypePrim(t)    t ∈ IntTypes    Γ ⊢ EncodeConst(T, lit) ⇓ bytes
```

──────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EmitLiteralData("int", bytes) ⇓ GlobalConst(Mangle(LiteralData("int", bytes)), bytes)
```

**(EmitLiteral-Float)**

```text
T = TypePrim(t)    t ∈ FloatTypes    Γ ⊢ EncodeConst(T, lit) ⇓ bytes
```

────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EmitLiteralData("float", bytes) ⇓ GlobalConst(Mangle(LiteralData("float", bytes)), bytes)
```

**(EmitLiteral-Err)**
EmitLiteralData(kind, bytes) undefined
─────────────────────────────────────────

```text
Γ ⊢ EmitLiteralData(kind, bytes) ⇑
```

#### 24.7.13 Poisoning Instrumentation

```text
PoisonJudg = {PoisonFlag(m) ⇓ sym, CheckPoison(m) ⇓ IR, SetPoison(m) ⇓ IR}
```

```text
PoisonSet(m) = {m} ∪ {x | Reachable(x, m, E_val^{eager})}
```

**(PoisonFlag-Decl)**
──────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PoisonFlag(m) ⇓ PathSig(["ultraviolet", "runtime", "poison"] ++ PathOfModule(m))
```

PoisonFlagDecl(m) = GlobalZero(PoisonFlag(m), sizeof(TypePrim("bool")))
StaticType(PoisonFlag(m)) = TypePrim("bool")

```text
When `HostedStateSym(Project(Γ), PoisonFlag(m))` holds, `PoisonFlagDecl(m)` denotes the per-session poison-flag template for module `m`.
```

**(CheckPoison-Use)**

```text
PoisonFlag(m) ⇓ sym
```

────────────────────────────────────

```text
Γ ⊢ CheckPoison(m) ⇓ IR
Γ ⊢ CheckPoison(m) ⇓ IR ⇔ ∀ σ. (ReadAddr(σ, AddrOfSym(PoisonFlag(m))) ≠ 0 ⇒ ∃ σ'. ExecIRSigma(IR, σ) ⇓ (Ctrl(Panic), σ') ∧ ExecIRSigma(LowerPanic(InitPanic(m)), σ) ⇓ (Ctrl(Panic), σ')) ∧ (ReadAddr(σ, AddrOfSym(PoisonFlag(m))) = 0 ⇒ ExecIRSigma(IR, σ) ⇓ (Val(()), σ))
```

Within hosted-library session execution, the `AddrOfSym(PoisonFlag(m))` and `StoreGlobal(sym_i, 1)` occurrences in this subsection are interpreted by §§24.4.1 and 24.7.8 so that each live hosted session owns an independent poison flag for every hosted-state module.

**(SetPoison-OnInitFail)**

```text
PoisonSet(m) = {m_1, …, m_k}    ∀ i, PoisonFlag(m_i) ⇓ sym_i
```

──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ SetPoison(m) ⇓ SeqIR(StoreGlobal(sym_1, 1), …, StoreGlobal(sym_k, 1))
```

**(PoisonFlag-Err)**
PoisonFlag(m) undefined
──────────────────────────

```text
Γ ⊢ PoisonFlag(m) ⇑
```

**(CheckPoison-Err)**
CheckPoison(m) undefined
──────────────────────────

```text
Γ ⊢ CheckPoison(m) ⇑
```

**(SetPoison-Err)**
SetPoison(m) undefined
───────────────────────

```text
Γ ⊢ SetPoison(m) ⇑
```

### 24.8 Output and Backend Diagnostics

This section owns output-pipeline and backend-emission diagnostics defined by Chapter 24.

| Code         | Severity | Detection    | Condition                                                                |
| ------------ | -------- | ------------ | ------------------------------------------------------------------------ |
| `E-OUT-0401` | Error    | Compile-time | Failed to create output directory                                        |
| `E-OUT-0402` | Error    | Compile-time | Failed to emit object file (codegen or write)                            |
| `E-OUT-0403` | Error    | Compile-time | Failed to emit IR/bitcode (codegen, assemble, tool resolution, or write) |
| `E-OUT-0404` | Error    | Compile-time | Final artifact tool invocation failed                                    |
| `E-OUT-0405` | Error    | Compile-time | Required linker or archiver tool not found                               |
| `E-OUT-0406` | Error    | Compile-time | Output path collision detected                                           |
| `E-OUT-0407` | Error    | Compile-time | Runtime library missing or unreadable                                    |
| `E-OUT-0408` | Error    | Compile-time | Runtime library missing required symbol(s)                               |
| `E-OUT-0409` | Error    | Compile-time | Selected target profile does not support requested final artifact        |
| `E-OUT-0410` | Error    | Compile-time | LLVM type mapping failed                                                 |
| `E-OUT-0411` | Error    | Compile-time | LLVM IR lowering failed                                                  |
| `E-OUT-0412` | Error    | Compile-time | Binding storage/validity lowering failed                                 |
| `E-OUT-0413` | Error    | Compile-time | LLVM call ABI lowering failed                                            |
| `E-OUT-0414` | Error    | Compile-time | VTable emission failed                                                   |
| `E-OUT-0415` | Error    | Compile-time | Literal data emission failed                                             |
| `E-OUT-0416` | Error    | Compile-time | Runtime built-in symbol resolution failed                                |
| `E-OUT-0417` | Error    | Compile-time | Entrypoint or context construction lowering failed                       |
| `E-OUT-0418` | Error    | Compile-time | Poisoning instrumentation failed                                         |
