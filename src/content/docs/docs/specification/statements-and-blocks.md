---
title: "Statements and Blocks"
description: "18. Statements and Blocks of the Ultraviolet language specification."
specSource: "../../Ultraviolet/SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T14:44:07.538Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## 18. Statements and Blocks

### 18.1 Blocks

#### 18.1.1 Syntax

```text
statement_seq ::= statement* expression?
statement     ::= binding_stmt
                | using_local_stmt
                | assignment_stmt
                | compound_assign
                | expr_stmt
                | defer_stmt
                | region_stmt
                | frame_stmt
                | return_stmt
                | break_stmt
                | continue_stmt
                | unsafe_block
                | key_block_stmt
                | comptime_stmt
block_expr    ::= "{" statement_seq "}"
```

`key_block_stmt` is defined in Chapter 19.
`comptime_stmt` is defined in §22.1.1.

#### 18.1.2 Parsing

**Statement Terminators.**
StmtTerm = {Punctuator(";"), Newline}

```text
Terminates(t) ⇔ t ∈ StmtTerm
```

```text
AttachStmtAttrs(⊥, s) = s. When attrs_opt ≠ ⊥, AttachStmtAttrs(attrs_opt, s) denotes the statement obtained by attaching attrs_opt to s according to Chapter 9.
```

**(Parse-Statement)**

```text
Γ ⊢ ParseAttrListOpt(P) ⇓ (P_0, attrs_opt)    Γ ⊢ ParseStmtCore(P_0) ⇓ (P_1, s_0)    s = AttachStmtAttrs(attrs_opt, s_0)    Γ ⊢ ConsumeTerminatorOpt(P_1, s) ⇓ P_2
```

───────────────────────────────────────────────────────

```text
Γ ⊢ ParseStmt(P) ⇓ (P_2, s)
```

**(Parse-Statement-Err)**

```text
Γ ⊢ ParseAttrListOpt(P) ⇓ (P_0, attrs_opt)    c = Code(Parse-Syntax-Err)    Γ ⊢ Emit(c, Tok(P_0).span)    P_1 = AdvanceOrEOF(P_0)    Γ ⊢ SyncStmt(P_1) ⇓ P_2
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseStmt(P) ⇓ (P_2, ErrorStmt(SpanBetween(P_0, P_2)))
```

**(Parse-Block)**

```text
IsPunc(Tok(P), "{")    Γ ⊢ ParseStmtSeq(Advance(P)) ⇓ (P_1, stmts, tail)    IsPunc(Tok(P_1), "}")
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseBlock(P) ⇓ (Advance(P_1), BlockExpr(stmts, tail))
```

```text
ReqTerm(s) ⇔ s ∈ {LetStmt(_), VarStmt(_), UsingLocalStmt(_, _, _), AssignStmt(_, _), CompoundAssignStmt(_, _, _), ExprStmt(_)}
```

**(ConsumeTerminatorOpt-Req-Yes)**
ReqTerm(s)    IsTerm(Tok(P))
──────────────────────────────────────────────

```text
Γ ⊢ ConsumeTerminatorOpt(P, s) ⇓ Advance(P)
```

**(ConsumeTerminatorOpt-Req-No)**

```text
ReqTerm(s)    ¬ IsTerm(Tok(P))    Emit(Code(Missing-Terminator-Err), Span = Tok(P).span)    Γ ⊢ SyncStmt(P) ⇓ P_1
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ConsumeTerminatorOpt(P, s) ⇓ P_1
```

**(ConsumeTerminatorOpt-Opt-Yes)**

```text
¬ ReqTerm(s)    IsTerm(Tok(P))
```

──────────────────────────────────────────────

```text
Γ ⊢ ConsumeTerminatorOpt(P, s) ⇓ Advance(P)
```

**(ConsumeTerminatorOpt-Opt-No)**

```text
¬ ReqTerm(s)    ¬ IsTerm(Tok(P))
```

──────────────────────────────────────────────

```text
Γ ⊢ ConsumeTerminatorOpt(P, s) ⇓ P
```

```text
SkipNL(P) = P    if Tok(P) ≠ Newline
```

SkipNL(P) = SkipNL(Advance(P))    if Tok(P) = Newline

**(ParseStmtSeq-End)**
Tok(P) = Punctuator("}")
──────────────────────────────────────────────

```text
Γ ⊢ ParseStmtSeq(P) ⇓ (P, [], ⊥)
```

**(ParseStmtSeq-TailExpr)**

```text
Tok(P) ∉ {Punctuator("}")}    Γ ⊢ ParseExpr(P) ⇓ (P_1, e)    P_1' = SkipNL(P_1)    Tok(P_1') = Punctuator("}")
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseStmtSeq(P) ⇓ (P_1', [], e)
```

**(ParseStmtSeq-Cons)**

```text
Γ ⊢ ParseStmt(P) ⇓ (P_1, s)    Γ ⊢ ParseStmtSeq(P_1) ⇓ (P_2, ss, tail)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseStmtSeq(P) ⇓ (P_2, [s] ++ ss, tail)
```

SyncStmt = {Punctuator(";"), Newline, Punctuator("}"), EOF}

#### 18.1.3 AST Representation / Form

Stmt = {LetStmt(binding), VarStmt(binding), ErrorStmt(span), UsingLocalStmt(source, alias, span), AssignStmt(place, expr), CompoundAssignStmt(place, op, expr), ExprStmt(expr), DeferStmt(block), RegionStmt(opts_opt, alias_opt, block), FrameStmt(target_opt, block), KeyBlockStmt(attrs_opt, paths, mods, mode_opt, block, span), ReturnStmt(expr_opt), BreakStmt(expr_opt), ContinueStmt, UnsafeBlockStmt(block), CtStmt(body, attrs_opt, span)}

```text
LastStmt([]) = ⊥
LastStmt([s_1, …, s_n]) = s_n    (n ≥ 1)
```

```text
ResType([T_1, …, T_n]) = T ⇔ n ≥ 1 ∧ ∀ i. Γ ⊢ T_i ≡ T
ResType([]) = ⊥
```

#### 18.1.4 Static Semantics

MutKind = {`let`, `var`}

```text
Bind = {⟨mut, T⟩ | mut ∈ MutKind ∧ T ∈ Type}
BindOf(Γ, x) = ⟨mut, T⟩ ⇔ ⟨mut, T⟩ is the binding for x in the nearest scope of Scopes(Γ)
(x : T) ∈ Γ ⇔ ∃ mut. BindOf(Γ, x) = ⟨mut, T⟩
MutOf(Γ, x) = mut ⇔ BindOf(Γ, x) = ⟨mut, T⟩
```

```text
StmtJudg = {Γ; R; L ⊢ s ⇒ Γ' ▷ ⟨Res, Brk, BrkVoid⟩, Γ; R; L ⊢ ss ⇒ Γ' ▷ ⟨Res, Brk, BrkVoid⟩, Γ; R; L ⊢ e : T, Γ; R; L ⊢ b : T, Γ; R; L ⊢ BlockInfo(b) ⇓ ⟨T, Brk, BrkVoid⟩, Γ ⊢ pat ⇐ T ⊣ B}
```

```text
LoopFlag = {⊥, `loop`}
```

```text
PushScope(Γ) = Γ' ⇔ Scopes(Γ') = [∅] ++ Scopes(Γ) ∧ Project(Γ') = Project(Γ) ∧ ResCtx(Γ') = ResCtx(Γ)
PopScope(Γ') = Γ ⇔ Scopes(Γ') = [_] ++ Scopes(Γ) ∧ Project(Γ') = Project(Γ) ∧ ResCtx(Γ') = ResCtx(Γ)
```

**(T-ErrorStmt)**
────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ ErrorStmt(_) ⇒ Γ ▷ ⟨[], [], false⟩
```

**(BlockInfo-Res)**

```text
Γ_0 = PushScope(Γ)    Γ_0; R; L ⊢ stmts ⇒ Γ_1 ▷ ⟨Res, Brk, BrkVoid⟩    Γ ⊢ WarnResultUnreachable(stmts) ⇓ ok    ResType(Res) = T    (tail_opt = e ⇒ Γ_1; R; L ⊢ e : T_e)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ BlockInfo(BlockExpr(stmts, tail_opt)) ⇓ ⟨T, Brk, BrkVoid⟩
```

**(BlockInfo-Res-Err)**

```text
Γ_0 = PushScope(Γ)    Γ_0; R; L ⊢ stmts ⇒ Γ_1 ▷ ⟨Res, Brk, BrkVoid⟩    Res ≠ []    ¬ ∃ T. ResType(Res) = T    c = Code(BlockInfo-Res-Err)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ BlockInfo(BlockExpr(stmts, tail_opt)) ⇑ c
```

**(BlockInfo-Tail)**

```text
Γ_0 = PushScope(Γ)    Γ_0; R; L ⊢ stmts ⇒ Γ_1 ▷ ⟨Res, Brk, BrkVoid⟩    Γ ⊢ WarnResultUnreachable(stmts) ⇓ ok    ResType(Res) = ⊥    tail_opt = e    Γ_1; R; L ⊢ e : T
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ BlockInfo(BlockExpr(stmts, tail_opt)) ⇓ ⟨T, Brk, BrkVoid⟩
```

**(BlockInfo-ReturnTail)**

```text
Γ_0 = PushScope(Γ)    Γ_0; R; L ⊢ stmts ⇒ Γ_1 ▷ ⟨Res, Brk, BrkVoid⟩    Γ ⊢ WarnResultUnreachable(stmts) ⇓ ok    ResType(Res) = ⊥    tail_opt = ⊥    LastStmt(stmts) = ReturnStmt(_)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ BlockInfo(BlockExpr(stmts, ⊥)) ⇓ ⟨TypePrim("!"), Brk, BrkVoid⟩
```

**(BlockInfo-Unit)**

```text
Γ_0 = PushScope(Γ)    Γ_0; R; L ⊢ stmts ⇒ Γ_1 ▷ ⟨Res, Brk, BrkVoid⟩    Γ ⊢ WarnResultUnreachable(stmts) ⇓ ok    ResType(Res) = ⊥    tail_opt = ⊥    LastStmt(stmts) ≠ ReturnStmt(_)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ BlockInfo(BlockExpr(stmts, ⊥)) ⇓ ⟨TypePrim("()"), Brk, BrkVoid⟩
```

**(T-Block)**

```text
Γ; R; L ⊢ BlockInfo(b) ⇓ ⟨T, _, _⟩
```

──────────────────────────────────────────────

```text
Γ; R; L ⊢ b : T
```

**(Chk-Block-Tail)**, **(Chk-Block-Return)**, and **(Chk-Block-Unit)** define checking-mode validation for block expressions.

`BlockExpr` is also an expression form in §16.7. The rules above remain the block-local typing rules used there.

#### 18.1.5 Dynamic Semantics

```text
ExecJudg = {Γ ⊢ ExecSigma(s, σ) ⇓ (sout, σ'), Γ ⊢ ExecSeqSigma(ss, σ) ⇓ (sout, σ')}
```

Ctrl = {Return(v), Result(v), Break(v_opt), Continue, Panic, Abort}

```text
StmtOut = {ok} ∪ {Ctrl(κ) | κ ∈ Ctrl}
EvalOutcome = {Val(v)} ∪ {Ctrl(κ) | κ ∈ Ctrl}
```

StmtOutOf(Val(v)) = ok

```text
StmtOutOf(Ctrl(κ)) = Ctrl(κ)
BreakVal(⊥) = ()
```

BreakVal(v) = v

ExitOutcome(out, ok) = out
ExitOutcome(Ctrl(Abort), c) = Ctrl(Abort)
ExitOutcome(Ctrl(Panic), panic) = Ctrl(Abort)

```text
ExitOutcome(out, panic) = Ctrl(Panic)    (out ≠ Ctrl(Panic) ∧ out ≠ Ctrl(Abort))
```

```text
BlockExit(σ, scope, out) ⇓ (out', σ') ⇔ Γ ⊢ CleanupScope(scope, σ) ⇓ (c, σ_1) ∧ out' = ExitOutcome(out, c) ∧ ((out' = Ctrl(Abort) ∧ σ' = σ_1) ∨ (out' ≠ Ctrl(Abort) ∧ PopScope_σ(σ_1) ⇓ (σ', scope)))
```

```text
EvalBlockBodySigma(BlockExpr(stmts, tail_opt), σ) ⇓ (out, σ') ⇔ Γ ⊢ ExecSeqSigma(stmts, σ) ⇓ (sout, σ_1) ∧ (
 (sout = ok ∧ tail_opt = e ∧ Γ ⊢ EvalSigma(e, σ_1) ⇓ (out, σ')) ∨
 (sout = ok ∧ tail_opt = ⊥ ∧ out = Val(()) ∧ σ' = σ_1) ∨
 (sout = Ctrl(TailValue(v)) ∧ out = Val(v) ∧ σ' = σ_1) ∨
 (sout = Ctrl(κ) ∧ κ ≠ TailValue(_) ∧ out = Ctrl(κ) ∧ σ' = σ_1)
```

)

```text
EvalBlockSigma(b, σ) ⇓ (out', σ'') ⇔ BlockEnter(σ, []) ⇓ (σ_1, scope) ∧ EvalBlockBodySigma(b, σ_1) ⇓ (out, σ_2) ∧ BlockExit(σ_2, scope, out) ⇓ (out', σ'')
```

```text
EvalBlockBindSigma(p, v, b, σ) ⇓ (out', σ'') ⇔ BindPatternVal(p, v) ⇓ B ∧ BindOrder(p, B) = binds ∧ BlockEnter(σ, binds) ⇓ (σ_1, scope) ∧ EvalBlockBodySigma(b, σ_1) ⇓ (out, σ_2) ∧ BlockExit(σ_2, scope, out) ⇓ (out', σ'')
```

```text
EvalInScopeSigma(b, σ, scope) ⇓ (out, σ') ⇔ CurrentScopeId(σ) = scope ∧ EvalBlockBodySigma(b, σ) ⇓ (out, σ')
```

**Place Evaluation Helpers.**

**PlaceJudg.**

```text
PlaceJudg = {Γ ⊢ ReadPlaceSigma(p, σ) ⇓ (out, σ'), Γ ⊢ WritePlaceSigma(p, v, σ) ⇓ (sout, σ'), Γ ⊢ WritePlaceSubSigma(p, v, σ) ⇓ (sout, σ'), Γ ⊢ MovePlaceSigma(p, σ) ⇓ (out, σ')}
```

**(ExecSeq-Empty)**
──────────────────────────────────────────────

```text
Γ ⊢ ExecSeqSigma([], σ) ⇓ (ok, σ)
```

**(ExecSeq-Cons-Ok)**

```text
Γ ⊢ ExecSigma(s, σ) ⇓ (ok, σ_1)    Γ ⊢ ExecSeqSigma(ss, σ_1) ⇓ (sout, σ_2)
```

──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ExecSeqSigma(s::ss, σ) ⇓ (sout, σ_2)
```

**(ExecSeq-Cons-Ctrl)**

```text
Γ ⊢ ExecSigma(s, σ) ⇓ (Ctrl(κ), σ_1)
```

───────────────────────────────────────────────────────────────

```text
Γ ⊢ ExecSeqSigma(s::ss, σ) ⇓ (Ctrl(κ), σ_1)
```

**(ExecSigma-Error)**
──────────────────────────────────────────────────────────

```text
Γ ⊢ ExecSigma(ErrorStmt(_), σ) ⇓ (Ctrl(Panic), σ)
```

```text
ExecState = {Exec(s, σ), ExecSeq(ss, σ), ExecCtrl(κ, σ), ExecDone(σ), RegionBody(r, scope, b, σ), RegionExit(r, scope, out, σ), FrameBody(r, scope, mark, b, σ), FrameExit(r, scope, mark, out, σ), KeyBody(keys, b, σ), KeyExit(keys, out, σ)}
```

**(Step-Exec-Other-Ok)**

```text
s ∉ {DeferStmt(_), RegionStmt(_, _, _), FrameStmt(_, _), KeyBlockStmt(_, _, _, _, _, _)}    Γ ⊢ ExecSigma(s, σ) ⇓ (ok, σ')
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨Exec(s, σ)⟩ → ⟨ExecDone(σ')⟩
```

**(Step-Exec-Other-Ctrl)**

```text
s ∉ {DeferStmt(_), RegionStmt(_, _, _), FrameStmt(_, _), KeyBlockStmt(_, _, _, _, _, _)}    Γ ⊢ ExecSigma(s, σ) ⇓ (Ctrl(κ), σ')
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨Exec(s, σ)⟩ → ⟨ExecCtrl(κ, σ')⟩
```

**(Step-ExecSeq-Ok)**

```text
Γ ⊢ ExecSeqSigma(ss, σ) ⇓ (ok, σ')
```

────────────────────────────────────────────────────────

```text
⟨ExecSeq(ss, σ)⟩ → ⟨ExecDone(σ')⟩
```

**(Step-ExecSeq-Ctrl)**

```text
Γ ⊢ ExecSeqSigma(ss, σ) ⇓ (Ctrl(κ), σ')
```

─────────────────────────────────────────────────────────

```text
⟨ExecSeq(ss, σ)⟩ → ⟨ExecCtrl(κ, σ')⟩
```

**(Step-Exec-Defer)**

```text
AppendCleanup(σ, DeferBlock(b)) ⇓ σ'
```

──────────────────────────────────────────────────────

```text
⟨Exec(DeferStmt(b), σ)⟩ → ⟨ExecDone(σ')⟩
```

```text
`EvalSigma(BlockExpr(stmts, tail_opt), σ)` is used by §16.7.5 and delegates to `EvalBlockSigma`.
```

#### 18.1.6 Lowering

LowerStmtJudg = {LowerStmt, LowerStmtList, LowerBlock, LowerLoop}

**(Lower-Stmt-Correctness)**

```text
∀ σ, Γ ⊢ ExecSigma(s, σ) ⇓ (sout, σ') ⇒ ExecIRSigma(IR, σ) ⇓ (sout, σ')
```

──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerStmt(s) ⇓ IR
```

**(Lower-Block-Correctness)**

```text
∀ σ, out, σ'. Γ ⊢ EvalBlockSigma(b, σ) ⇓ (out, σ') ⇒ (ExecIRSigma(IR, σ) ⇓ (out, σ') ∧ (out = Val(v') ⇒ v = v'))
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerBlock(b) ⇓ ⟨IR, v⟩
```

StmtForms0 = {LetStmt(_), VarStmt(_), UsingLocalStmt(_, _, _), AssignStmt(_, _), CompoundAssignStmt(_, _, _), ExprStmt(_), DeferStmt(_), RegionStmt(_, _, _), FrameStmt(_, _), ReturnStmt(_), BreakStmt(_), ContinueStmt, UnsafeBlockStmt(_), ErrorStmt(_)}

```text
LowerStmtTotal(Γ) ⇔ ∀ s. s ∈ StmtForms0 ⇒ ∃ IR. Γ ⊢ LowerStmt(s) ⇓ IR
```

**(Lower-StmtList-Empty)**
──────────────────────────────────────────────

```text
Γ ⊢ LowerStmtList([]) ⇓ ε
```

**(Lower-StmtList-Cons)**

```text
Γ ⊢ LowerStmt(s) ⇓ IR_s    Γ ⊢ LowerStmtList(ss) ⇓ IR_r
```

─────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerStmtList(s::ss) ⇓ SeqIR(IR_s, IR_r)
```

**(Lower-Block-Tail)**

```text
tail ≠ ⊥    Γ ⊢ LowerStmtList(stmts) ⇓ IR_s    Γ ⊢ LowerExpr(tail) ⇓ ⟨IR_t, v_t⟩
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerBlock(BlockExpr(stmts, tail)) ⇓ ⟨BlockIR(IR_s, IR_t, v_t), v_block⟩
```

**(Lower-Block-Unit)**

```text
Γ ⊢ LowerStmtList(stmts) ⇓ IR_s
```

────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerBlock(BlockExpr(stmts, ⊥)) ⇓ ⟨BlockIR(IR_s, ε, ()), v_block⟩
```

**(Lower-Stmt-Error)**
────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerStmt(ErrorStmt(span)) ⇓ LowerPanic(ErrorStmt(span))
```

**Temporary Cleanup in Lowering.**

Let `TempDropOrder(s) = [e_1, …, e_k]`. For each `i`, let

```text
`Γ ⊢ LowerExpr(e_i) ⇓ ⟨IR_i, v_i⟩`
```

denote the unique invocation of `LowerExpr(e_i)` in the derivation of

```text
`Γ ⊢ LowerStmt(s) ⇓ IR_s`, and let `ExprType(e_i) = T_i`.
```

TempCleanupIR(s) =

```text
  { ε                                                   if k = 0
```

    SeqIRList([EmitDrop(T_k, v_k), …, EmitDrop(T_1, v_1)])    otherwise }

```text
For `s ∉ {ReturnStmt(_), BreakStmt(_), ContinueStmt}`, the lowering MUST produce
`Γ ⊢ LowerStmt(s) ⇓ SeqIR(IR_s, TempCleanupIR(s))`.
```

For control-flow statements, the lowering MUST emit temporary cleanup immediately before the control transfer:

```text
`Γ ⊢ LowerStmt(ReturnStmt(e)) ⇓ SeqIR(IR_e, TempCleanupIR(s), ReturnIR(v))`
`Γ ⊢ LowerStmt(BreakStmt(e)) ⇓ SeqIR(IR_e, TempCleanupIR(s), BreakIR(v))`
`Γ ⊢ LowerStmt(BreakStmt(⊥)) ⇓ SeqIR(TempCleanupIR(s), BreakIR(⊥))`
`Γ ⊢ LowerStmt(ContinueStmt) ⇓ SeqIR(TempCleanupIR(s), ContinueIR)`
```

BlockForms0 = {BlockExpr(_, _)}
LoopForms0 = {LoopInfinite(_, _), LoopConditional(_, _, _), LoopIter(_, _, _, _, _)}

```text
LowerBlockTotal(Γ) ⇔ ∀ b. b ∈ BlockForms0 ⇒ ∃ IR, v. Γ ⊢ LowerBlock(b) ⇓ ⟨IR, v⟩
LowerLoopTotal(Γ) ⇔ ∀ l. l ∈ LoopForms0 ⇒ ∃ IR, v. Γ ⊢ LowerLoop(l) ⇓ ⟨IR, v⟩
```

**(Lower-Loop-Infinite)**

```text
Γ ⊢ LowerBlock(body) ⇓ ⟨IR_b, v_b⟩
```

─────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerLoop(LoopInfinite(inv_opt, body)) ⇓ ⟨LoopIR(LoopInfinite, inv_opt, IR_b, v_b), v_loop⟩
```

**(Lower-Loop-Cond)**

```text
Γ ⊢ LowerExpr(cond) ⇓ ⟨IR_c, v_c⟩    Γ ⊢ LowerBlock(body) ⇓ ⟨IR_b, v_b⟩
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerLoop(LoopConditional(cond, inv_opt, body)) ⇓ ⟨LoopIR(LoopConditional, inv_opt, IR_c, v_c, IR_b, v_b), v_loop⟩
```

**(Lower-Loop-Iter)**

```text
Γ ⊢ LowerExpr(iter) ⇓ ⟨IR_i, v_iter⟩    Γ ⊢ LowerBlock(body) ⇓ ⟨IR_b, v_b⟩
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerLoop(LoopIter(pat, ty_opt, iter, inv_opt, body)) ⇓ ⟨LoopIR(LoopIter, pat, ty_opt, inv_opt, IR_i, v_iter, IR_b, v_b), v_loop⟩
```

#### 18.1.7 Diagnostics

Diagnostics are defined for malformed statements recovered by `Parse-Statement-Err`, missing required statement terminators, and block-expression statement prefixes whose result set has no common type.

### 18.2 Binding Statements

#### 18.2.1 Syntax

```text
binding_stmt ::= ("let" | "var") pattern (":" type)? binding_op expression terminator
binding_op   ::= "=" | ":="
```

#### 18.2.2 Parsing

**(Parse-Binding-Stmt)**

```text
Tok(P) ∈ {Keyword(`let`), Keyword(`var`)}    Γ ⊢ ParseBindingAfterLetVar(P) ⇓ (P_1, bind)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseStmtCore(P) ⇓ (P_1, LetOrVarStmt(P, bind))
```

**(Parse-BindingAfterLetVar)**

```text
Tok(P) = kw ∈ {Keyword(`let`), Keyword(`var`)}    Γ ⊢ ParsePattern(Advance(P)) ⇓ (P_1, pat)    Γ ⊢ ParseTypeAnnotOpt(P_1) ⇓ (P_2, ty_opt)    Tok(P_2) ∈ {Operator("="), Operator(":=")}    op = Tok(P_2)    Γ ⊢ ParseExpr(Advance(P_2)) ⇓ (P_3, init)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseBindingAfterLetVar(P) ⇓ (P_3, ⟨pat, ty_opt, op, init, SpanBetween(P, P_3)⟩)
```

**(LetOrVarStmt-Let)**
Tok(P) = Keyword(`let`)
──────────────────────────────────────────────

```text
Γ ⊢ LetOrVarStmt(P, bind) ⇓ LetStmt(bind)
```

**(LetOrVarStmt-Var)**
Tok(P) = Keyword(`var`)
──────────────────────────────────────────────

```text
Γ ⊢ LetOrVarStmt(P, bind) ⇓ VarStmt(bind)
```

#### 18.2.3 AST Representation / Form

```text
LetOrVarStmt(binding) ∈ {LetStmt(binding), VarStmt(binding)}
```

```text
Binding = ⟨attrs_opt, pat, ty_opt, op, init, span⟩
BindingForm(binding) = ⟨attrs_opt, pat, ty_opt, op, init, _⟩
BindingParts(binding) = ⟨attrs_opt, pat, ty_opt, op, init, span⟩
```

```text
BindType(⟨attrs_opt, pat, ty_opt, op, init, _⟩) = T ⇔ ty_opt = T
BindType(⟨attrs_opt, pat, ⊥, op, init, _⟩) = θ(T_i) ⇔ Γ; R; L ⊢ init ⇒ T_i ⊣ C ∧ Solve(C) ⇓ θ
```

```text
TypeOf(⟨sid, bind_id, x⟩) = TypeOf(x)
BindInfo(⟨sid, bind_id, x⟩) = BindInfo(x)
```

#### 18.2.4 Static Semantics

```text
IntroEnt = ⟨Value, ⊥, ⊥, Decl⟩
```

**(IntroAll-Empty)**
────────────────────────────────────────────────────────────────

```text
IntroAll(Γ, []) ⇓ Γ
```

**(IntroAll-Cons)**

```text
Γ ⊢ Intro(x, IntroEnt) ⇓ Γ_1    IntroAll(Γ_1 ∪ {x ↦ ⟨`let`, T⟩}, rest) ⇓ Γ_2
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
IntroAll(Γ, [(x, T)] ++ rest) ⇓ Γ_2
```

**(IntroAllVar-Empty)**
────────────────────────────────────────────────────────────────

```text
IntroAllVar(Γ, []) ⇓ Γ
```

**(IntroAllVar-Cons)**

```text
Γ ⊢ Intro(x, IntroEnt) ⇓ Γ_1    IntroAllVar(Γ_1 ∪ {x ↦ ⟨`var`, T⟩}, rest) ⇓ Γ_2
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
IntroAllVar(Γ, [(x, T)] ++ rest) ⇓ Γ_2
```

**(T-LetStmt-Ann)**

```text
ty_opt = T_a    Γ; R; L ⊢ init ⇐ T_a ⊣ ∅    Γ ⊢ pat ⇐ T_a ⊣ B    Distinct(PatNames(pat))    IntroAll(Γ, B) ⇓ Γ'
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ LetStmt(binding) ⇒ Γ' ▷ ⟨[], [], false⟩
```

**(T-LetStmt-Ann-Mismatch)**

```text
ty_opt = T_a    Γ; R; L ⊢ init ⇒ T_i ⊣ C    ¬(Γ ⊢ T_i <: T_a)    c = Code(T-LetStmt-Ann-Mismatch)
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ LetStmt(binding) ⇑ c
```

**(T-LetStmt-Infer)**

```text
ty_opt = ⊥    Γ; R; L ⊢ init ⇒ T_i ⊣ C    Solve(C) ⇓ θ    T_b = θ(T_i)    Γ ⊢ pat ⇐ T_b ⊣ B    Distinct(PatNames(pat))    IntroAll(Γ, B) ⇓ Γ'
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ LetStmt(binding) ⇒ Γ' ▷ ⟨[], [], false⟩
```

**(T-LetStmt-Infer-Err)**

```text
ty_opt = ⊥    Γ; R; L ⊢ init ⇒ T_i ⊣ C    Solve(C) ⇑    c = Code(T-LetStmt-Infer-Err)
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ LetStmt(binding) ⇑ c
```

**(T-VarStmt-Ann)**, **(T-VarStmt-Ann-Mismatch)**, **(T-VarStmt-Infer)**, and **(T-VarStmt-Infer-Err)** are identical except that they use `IntroAllVar`.

**(Let-Refutable-Pattern-Err)**

```text
pat ∈ {LiteralPattern(_), EnumPattern(_, _, _), ModalPattern(_, _), RangePattern(_, _, _)}    c = Code(Let-Refutable-Pattern-Err)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ pat ⇐ T ⇑ c
```

**(B-LetVar-UniqueNonMove-Err)**

```text
T_b = BindType(⟨pat, ty_opt, op, init, _⟩)    PermOf(T_b) = `unique`    IsPlace(init)    ¬ IsMoveExpr(init)    c = Code(B-LetVar-UniqueNonMove-Err)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; 𝔅; Π ⊢ LetOrVarStmt(⟨pat, ty_opt, op, init, _⟩) ⇑ c
```

SuspendUniqueBind(Π, init, T_b) =

```text
  { SuspendUniquePath(Π, ⊥, init)    if IsPlace(init) ∧ PermOf(ExprType(init)) = `unique` ∧ PermOf(T_b) = `const`
```

    Π                                otherwise }

**(B-LetVar)**

```text
Γ; 𝔅; Π ⊢ init ⇒ 𝔅_1 ▷ Π_1    T_b = BindType(⟨pat, ty_opt, op, init, _⟩)    Π_2 = SuspendUniqueBind(Π_1, init, T_b)    𝔅_2 = ConsumeOnMove(𝔅_1, init)    Γ ⊢ pat ⇐ T_b ⊣ B    𝔅_3 = IntroAll_B(𝔅_2, BindInfoMap(λ U. RespOfInit(init), B, MovOf(op), mut))
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; 𝔅; Π ⊢ LetOrVarStmt(⟨pat, ty_opt, op, init, _⟩) ⇒ 𝔅_3 ▷ Π_2
```

**(Prov-LetVar-Ordinary)**

```text
binding = ⟨pat, _, _, init, _⟩    Γ; Ω ⊢ init ⇓ π_init    Γ ⊢ PatNames(pat) ⇓ N    π_bind = BindProv(Ω, π_init)    π_bind ≠ π_Region(tag) for every tag    Σ_π' = IntroAll_π(Σ_π, N, π_bind)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; ⟨Σ_π, RS⟩ ⊢ LetOrVarStmt(binding) ⇒ ⟨Σ_π', RS⟩ ▷ ⟨[], [], false⟩
```

**(Prov-LetVar-Region-Alias)**

```text
binding = ⟨pat, _, _, init, _⟩    Γ; Ω ⊢ init ⇓ π_Region(tag)    Γ ⊢ PatNames(pat) ⇓ [x]    Σ_π' = Intro_π(Σ_π, x, π_Region(tag))    IntroRegionAlias_π(⟨Σ_π', RS⟩, tag, x) = Ω'
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; ⟨Σ_π, RS⟩ ⊢ LetOrVarStmt(binding) ⇒ Ω' ▷ ⟨[], [], false⟩
```

**(Prov-LetVar-Region-Fresh)**

```text
binding = ⟨pat, _, _, init, _⟩    FreshRegionExpr(init)    Γ ⊢ PatNames(pat) ⇓ [x]    FreshRegionTag(⟨Σ_π, RS⟩) = tag    Σ_π' = Intro_π(Σ_π, x, π_Region(tag))    IntroRegionAlias_π(⟨Σ_π', RS⟩, tag, x) = Ω'
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; ⟨Σ_π, RS⟩ ⊢ LetOrVarStmt(binding) ⇒ Ω' ▷ ⟨[], [], false⟩
```

#### 18.2.5 Dynamic Semantics

```text
BindVal(σ, x, v) ⇓ (σ', b) ⇔ ScopeStack(σ) = scope :: ss ∧ scope = ⟨sid, cleanup, names, vals, states⟩ ∧ bind_id = FreshBindId(σ) ∧ names' = names[x ↦ (names[x] if present else []) ++ [bind_id]] ∧ vals' = vals[bind_id ↦ v] ∧ states' = states[bind_id ↦ `Valid`] ∧ scope' = ⟨sid, cleanup, names', vals', states'⟩ ∧ UpdateScopeStack(σ, scope' :: ss) = σ_1 ∧ b = ⟨sid, bind_id, x⟩ ∧ ((BindInfo(b).resp = resp ∧ AppendCleanup(σ_1, DropBinding(b)) ⇓ σ') ∨ (BindInfo(b).resp ≠ resp ∧ σ' = σ_1))
```

```text
BindPatternVal(p, v) ⇓ B ⇔ Γ ⊢ MatchPattern(p, v) ⇓ B
BindOrder(p, B) = [⟨x, B[x]⟩ | x ∈ PatNames(p)]
```

**(BindList-Empty)**
────────────────────────────────────────────

```text
BindList(σ, []) ⇓ (σ, [])
```

**(BindList-Cons)**

```text
BindVal(σ, x, v) ⇓ (σ_1, b)    BindList(σ_1, xs) ⇓ (σ_2, bs)
```

──────────────────────────────────────────────────────────────────────────────────────

```text
BindList(σ, [⟨x, v⟩] ++ xs) ⇓ (σ_2, b::bs)
```

```text
BindPattern(σ, p, v) ⇓ (σ', bs) ⇔ BindPatternVal(p, v) ⇓ B ∧ BindOrder(p, B) = binds ∧ BindList(σ, binds) ⇓ (σ', bs)
```

**(ExecSigma-Let)**

```text
BindingForm(binding) = ⟨attrs_opt, pat, ty_opt, op, init, _⟩    Γ ⊢ EvalSigma(init, σ) ⇓ (Val(v), σ_1)    BindPattern(σ_1, pat, v) ⇓ (σ_2, bs)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ExecSigma(LetStmt(binding), σ) ⇓ (ok, σ_2)
```

**(ExecSigma-Let-Ctrl)**

```text
BindingForm(binding) = ⟨attrs_opt, pat, ty_opt, op, init, _⟩    Γ ⊢ EvalSigma(init, σ) ⇓ (Ctrl(κ), σ_1)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ExecSigma(LetStmt(binding), σ) ⇓ (Ctrl(κ), σ_1)
```

**(ExecSigma-Var)** and **(ExecSigma-Var-Ctrl)** are the corresponding rules for `VarStmt(binding)`.

#### 18.2.6 Lowering

**(Lower-Stmt-Let)**

```text
BindingParts(binding) = ⟨attrs_opt, pat, ty_opt, op, init, span⟩    Γ ⊢ LowerExpr(init) ⇓ ⟨IR_i, v⟩    Γ ⊢ LowerBindPattern(pat, v) ⇓ IR_b
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerStmt(LetStmt(binding)) ⇓ SeqIR(IR_i, IR_b)
```

**(Lower-Stmt-Var)**

```text
BindingParts(binding) = ⟨attrs_opt, pat, ty_opt, op, init, span⟩    Γ ⊢ LowerExpr(init) ⇓ ⟨IR_i, v⟩    Γ ⊢ LowerBindPattern(pat, v) ⇓ IR_b
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerStmt(VarStmt(binding)) ⇓ SeqIR(IR_i, IR_b)
```

#### 18.2.7 Diagnostics

Diagnostics are defined for type annotations incompatible with the initializer, inference failure, refutable patterns in `let`, duplicate names introduced by a single binding pattern, and `unique` bindings initialized from a place expression without explicit `move`.

### 18.3 Local Using Statements

#### 18.3.1 Syntax

```text
using_local_stmt ::= "using" identifier "as" identifier terminator
```

#### 18.3.2 Parsing

**(Parse-UsingLocal-Stmt)**

```text
IsKw(Tok(P), `using`)    Γ ⊢ ParseIdent(Advance(P)) ⇓ (P_1, source)    IsKw(Tok(P_1), `as`)    Γ ⊢ ParseIdent(Advance(P_1)) ⇓ (P_2, alias)    s = UsingLocalStmt(source, alias, SpanBetween(P, P_2))
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseStmtCore(P) ⇓ (P_2, s)
```

#### 18.3.3 AST Representation / Form

UsingLocalStmt(source, alias, span)

#### 18.3.4 Static Semantics

Evaluation of a `UsingLocalStmt` extends the environment via the `UsingAlias` judgment defined in §7.2:

**(T-UsingLocalStmt)**

```text
Γ ⊢ UsingAlias(source, alias) ⇓ Γ'
```

────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ UsingLocalStmt(source, alias, _) ⇒ Γ'
```

**(T-UsingLocalStmt-Err)**

```text
Γ ⊢ UsingAlias(source, alias) ⇑ c
```

──────────────────────────────────────────────────────────────────

```text
Γ ⊢ UsingLocalStmt(source, alias, _) ⇑ c
```

The alias introduces no new storage; the `Entity` stored under `alias` is the identical `Entity` to which `source` resolves. Aliasing an alias resolves through to the original `Entity`.

#### 18.3.5 Dynamic Semantics

**(ExecSigma-UsingLocal)**
────────────────────────────────────────────────────────────────

```text
Γ ⊢ ExecSigma(UsingLocalStmt(_, _, _), σ) ⇓ (ok, σ)
```

A `UsingLocalStmt` has no runtime effect: name resolution is compile-time only.

#### 18.3.6 Lowering

**(Lower-Stmt-UsingLocal)**
────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerStmt(UsingLocalStmt(_, _, _)) ⇓ NoOpIR
```

`using` statements produce no runtime IR; they are consumed entirely during resolution.

#### 18.3.7 Diagnostics

Diagnostics are defined for duplicate alias names (alias already in any scope), unresolved source names, and use of reserved names as aliases. See §7.2 `Using-Alias-*` rules.

### 18.4 Assignment Statements

#### 18.4.1 Syntax

```text
assignment_stmt ::= place_expr "=" expression terminator
compound_assign ::= place_expr compound_op expression terminator
```

#### 18.4.2 Parsing

**(Parse-Assign-Stmt)**

```text
Γ ⊢ ParsePlace(P) ⇓ (P_1, p)    Tok(P_1) ∈ {Operator("="), Operator("+="), Operator("-="), Operator("*="), Operator("/="), Operator("%=")}    Γ ⊢ ParseExpr(Advance(P_1)) ⇓ (P_2, e)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseStmtCore(P) ⇓ (P_2, AssignOrCompound(P_1, p, e))
```

**(AssignOrCompound-Assign)**
Tok(P_1) = Operator("=")
──────────────────────────────────────────────

```text
Γ ⊢ AssignOrCompound(P_1, p, e) ⇓ AssignStmt(p, e)
```

**(AssignOrCompound-Compound)**

```text
Tok(P_1) = Operator(op)    op ∈ {"+=", "-=", "*=", "/=", "%="}
```

────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ AssignOrCompound(P_1, p, e) ⇓ CompoundAssignStmt(p, op, e)
```

#### 18.4.3 AST Representation / Form

AssignStmt(place, expr)
CompoundAssignStmt(place, op, expr)

PlaceRoot(Identifier(x)) = x
PlaceRoot(FieldAccess(p, _)) = PlaceRoot(p)
PlaceRoot(TupleAccess(p, _)) = PlaceRoot(p)
PlaceRoot(IndexAccess(p, _)) = PlaceRoot(p)
PlaceRoot(Deref(p)) = PlaceRoot(p)

#### 18.4.4 Static Semantics

**(T-Assign)**

```text
IsPlace(p)    PlaceRoot(p) = x    MutOf(Γ, x) = `var`    Γ; R; L ⊢ p :place T_p    Γ; R; L ⊢ e ⇐ T_p ⊣ ∅
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ AssignStmt(p, e) ⇒ Γ ▷ ⟨[], [], false⟩
```

**(T-CompoundAssign)**

```text
IsPlace(p)    PlaceRoot(p) = x    MutOf(Γ, x) = `var`    Γ; R; L ⊢ p :place T_p    StripPerm(T_p) = TypePrim(t)    t ∈ NumericTypes    Γ; R; L ⊢ e : T_e    Γ ⊢ T_e <: TypePrim(t)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ CompoundAssignStmt(p, op, e) ⇒ Γ ▷ ⟨[], [], false⟩
```

**(Assign-NotPlace)**

```text
stmt ∈ {AssignStmt(p, e), CompoundAssignStmt(p, op, e)}    ¬ IsPlace(p)    c = Code(Assign-NotPlace)
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ stmt ⇑ c
```

**(Assign-Immutable-Err)**

```text
stmt ∈ {AssignStmt(p, e), CompoundAssignStmt(p, op, e)}    IsPlace(p)    PlaceRoot(p) = x    MutOf(Γ, x) = `let`    c = Code(Assign-Immutable-Err)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ stmt ⇑ c
```

**(Assign-Type-Err)**

```text
stmt ∈ {AssignStmt(p, e), CompoundAssignStmt(p, op, e)}    IsPlace(p)    Γ; R; L ⊢ p :place T_p    Γ; R; L ⊢ e ⇒ T_e ⊣ C    ((stmt = AssignStmt(p, e) ∧ ¬(Γ ⊢ T_e <: T_p)) ∨ (stmt = CompoundAssignStmt(p, op, e) ∧ (¬(Γ ⊢ T_e <: StripPerm(T_p)) ∨ ¬ ∃ t. StripPerm(T_p) = TypePrim(t) ∧ t ∈ NumericTypes)))    c = Code(Assign-Type-Err)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ stmt ⇑ c
```

**(Assign-Const-Err)**

```text
stmt ∈ {AssignStmt(p, e), CompoundAssignStmt(p, op, e)}    Γ; R; L ⊢ p : TypePerm(`const`, T)    c = Code(Assign-Const-Err)
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ stmt ⇑ c
```

**(B-Assign-Immutable-Err)**, **(B-Assign)**, and **(B-Assign-Const-Err)** define binding-state effects of assignment.

**(Prov-Assign)** and **(Prov-CompoundAssign)** require the assigned provenance not to escape into a shorter-lived target.

**(Prov-Async-Escape-Err)** and **(Prov-Escape-Err)** define the two escape failures.

#### 18.4.5 Dynamic Semantics

RootBinding(Sigma, p) =
 Local(b)    if LookupBind(Sigma, PlaceRoot(p)) = b

```text
 Static(path, name)    if LookupBind(Sigma, PlaceRoot(p)) undefined ∧ Γ ⊢ ResolveValueName(PlaceRoot(p)) ⇓ ent ∧ ent.origin_opt = mp ∧ name = (ent.target_opt if present, else PlaceRoot(p)) ∧ path = PathOfModule(mp)
```

```text
DropOnAssign(b) ⇔ BindInfo(b).mov = immov ∧ BindInfo(b).resp = resp
DropOnAssignStatic(path, name) ⇔ StaticBindInfo(path, name).mov = immov ∧ StaticBindInfo(path, name).resp = resp
```

```text
DropOnAssignRoot(Sigma, p) ⇔ (RootBinding(Sigma, p) = Local(b) ∧ DropOnAssign(b)) ∨ (RootBinding(Sigma, p) = Static(path, name) ∧ DropOnAssignStatic(path, name))
RootMoved(Sigma, p) ⇔ RootBinding(Sigma, p) = Local(b) ∧ BindState(Sigma, b) = Moved
```

```text
DropSubvalueJudg = {Γ ⊢ DropSubvalue(p, T, v, σ) ⇓ σ'}
```

**(DropSubvalue-Do)**

```text
DropOnAssignRoot(Sigma, p)    ¬ RootMoved(Sigma, p)    Γ ⊢ DropValue(T, v, ∅) ⇓ Sigma'
```

────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ DropSubvalue(p, T, v, Sigma) ⇓ Sigma'
```

**(DropSubvalue-Skip)**

```text
¬ DropOnAssignRoot(Sigma, p) ∨ RootMoved(Sigma, p)
```

────────────────────────────────────────────────────

```text
Γ ⊢ DropSubvalue(p, T, v, Sigma) ⇓ Sigma
```

**(ExecSigma-Assign)**

```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Val(v), σ_1)    Γ ⊢ WritePlaceSigma(p, v, σ_1) ⇓ (sout, σ_2)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ExecSigma(AssignStmt(p, e), σ) ⇓ (sout, σ_2)
```

**(ExecSigma-Assign-Ctrl)**

```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Ctrl(κ), σ_1)
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ ExecSigma(AssignStmt(p, e), σ) ⇓ (Ctrl(κ), σ_1)
```

**(ExecSigma-CompoundAssign)**

```text
Γ ⊢ ReadPlaceSigma(p, σ) ⇓ (Val(v_p), σ_1)    Γ ⊢ EvalSigma(e, σ_1) ⇓ (Val(v_e), σ_2)    BinOp(op, v_p, v_e) ⇓ v    Γ ⊢ WritePlaceSigma(p, v, σ_2) ⇓ (sout, σ_3)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ExecSigma(CompoundAssignStmt(p, op, e), σ) ⇓ (sout, σ_3)
```

**(ExecSigma-CompoundAssign-Left-Ctrl)** and **(ExecSigma-CompoundAssign-Right-Ctrl)** define control propagation from the left-hand place read and the right-hand expression.

#### 18.4.6 Lowering

**(Lower-Stmt-Assign)**

```text
Γ ⊢ LowerExpr(expr) ⇓ ⟨IR_e, v⟩    Γ ⊢ LowerWritePlace(place, v) ⇓ IR_w
```

──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerStmt(AssignStmt(place, expr)) ⇓ SeqIR(IR_e, IR_w)
```

**(Lower-Stmt-CompoundAssign)**

```text
Γ ⊢ LowerReadPlace(place) ⇓ ⟨IR_p, v_p⟩    Γ ⊢ LowerExpr(expr) ⇓ ⟨IR_e, v_e⟩    BinOp(op, v_p, v_e) ⇓ v    Γ ⊢ LowerWritePlace(place, v) ⇓ IR_w
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerStmt(CompoundAssignStmt(place, op, expr)) ⇓ SeqIR(IR_p, IR_e, IR_w)
```

#### 18.4.7 Diagnostics

Diagnostics are defined for non-place assignment targets, assignment to immutable bindings, assignment through `const`, assignment type mismatch, and provenance escapes in assignment.

### 18.5 Expression Statements

#### 18.5.1 Syntax

```text
expr_stmt ::= expression terminator
```

#### 18.5.2 Parsing

**(Parse-Expr-Stmt)**

```text
Γ ⊢ ParseExpr(P) ⇓ (P_1, e)
```

──────────────────────────────────────────────

```text
Γ ⊢ ParseStmtCore(P) ⇓ (P_1, ExprStmt(e))
```

#### 18.5.3 AST Representation / Form

ExprStmt(expr)

#### 18.5.4 Static Semantics

**(T-ExprStmt)**

```text
Γ; R; L ⊢ e : T
```

────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ ExprStmt(e) ⇒ Γ ▷ ⟨[], [], false⟩
```

**(B-ExprStmt)** and **(Prov-ExprStmt)** define binding-state and provenance preservation for expression statements.

#### 18.5.5 Dynamic Semantics

**(ExecSigma-ExprStmt)**

```text
Γ ⊢ EvalSigma(e, σ) ⇓ (out, σ_1)
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ ExecSigma(ExprStmt(e), σ) ⇓ (StmtOutOf(out), σ_1)
```

#### 18.5.6 Lowering

**(Lower-Stmt-Expr)**

```text
Γ ⊢ LowerExpr(expr) ⇓ ⟨IR_e, v⟩
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerStmt(ExprStmt(expr)) ⇓ IR_e
```

#### 18.5.7 Diagnostics

No additional named diagnostics are introduced for expression statements beyond the diagnostics of the contained expression and the required terminator diagnostics of §18.1.7.

### 18.6 Defer

#### 18.6.1 Syntax

```text
defer_stmt ::= "defer" block_expr
```

#### 18.6.2 Parsing

**(Parse-Defer-Stmt)**

```text
IsKw(Tok(P), `defer`)    Γ ⊢ ParseBlock(Advance(P)) ⇓ (P_1, b)
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseStmtCore(P) ⇓ (P_1, DeferStmt(b))
```

#### 18.6.3 AST Representation / Form

DeferStmt(block)

#### 18.6.4 Static Semantics

**(T-DeferStmt)**

```text
Γ; R; L ⊢ b ⇐ TypePrim("()") ⊣ ∅    DeferSafe(b)
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ DeferStmt(b) ⇒ Γ ▷ ⟨[], [], false⟩
```

**(Defer-NonUnit-Err)**

```text
Γ; R; L ⊢ b : T_b    T_b ≠ TypePrim("()")    c = Code(Defer-NonUnit-Err)
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ DeferStmt(b) ⇑ c
```

**(Defer-NonLocal-Err)**

```text
¬ DeferSafe(b)    c = Code(Defer-NonLocal-Err)
```

────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ DeferStmt(b) ⇑ c
```

**(HasNonLocalCtrl-Return)**
────────────────────────────────────────────────────────────────
HasNonLocalCtrl(ReturnStmt(_), in_loop)

**(HasNonLocalCtrl-Break)**
in_loop = false
────────────────────────────────────────────────────────────────
HasNonLocalCtrl(BreakStmt(_), in_loop)

**(HasNonLocalCtrl-Continue)**
in_loop = false
────────────────────────────────────────────────────────────────
HasNonLocalCtrl(ContinueStmt, in_loop)

**(HasNonLocalCtrl-LoopInfinite)**, **(HasNonLocalCtrl-LoopConditional)**, **(HasNonLocalCtrl-LoopIter)**, and **(HasNonLocalCtrl-Child)** propagate non-local control-flow detection through nested expressions and statements.

```text
DeferSafe(b) ⇔ ¬ HasNonLocalCtrl(b, false)
```

**(B-Defer)** and **(Prov-DeferStmt)** require a deferred block to preserve the current binding-state and provenance environment.

#### 18.6.5 Dynamic Semantics

**(ExecSigma-Defer)**

```text
AppendCleanup(σ, DeferBlock(b)) ⇓ σ'
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ ExecSigma(DeferStmt(b), σ) ⇓ (ok, σ')
```

**(Cleanup-Step-Defer-Ok)**, **(Cleanup-Step-Defer-Panic)**, and **(Cleanup-Step-Defer-Abort)** define execution of deferred blocks during scope exit.

**(Cleanup-Cons-Defer-Ok)** and **(Cleanup-Cons-Defer-Panic)** define the big-step cleanup view of deferred blocks.

#### 18.6.6 Lowering

**(Lower-Stmt-Defer)**
────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerStmt(DeferStmt(block)) ⇓ DeferIR(block)
```

#### 18.6.7 Diagnostics

Diagnostics are defined for defer blocks with non-unit type and for defer blocks that contain non-local control flow.

### 18.7 Region

#### 18.7.1 Syntax

```text
region_stmt  ::= "region" region_opts? region_alias? block_expr
region_opts  ::= "(" expression ")"
region_alias ::= "as" identifier
```

#### 18.7.2 Parsing

**(Parse-Region-Opts-None)**

```text
¬ IsPunc(Tok(P), "(")
```

────────────────────────────────────────────────

```text
Γ ⊢ ParseRegionOptsOpt(P) ⇓ (P, ⊥)
```

**(Parse-Region-Opts-Some)**

```text
IsPunc(Tok(P), "(")    Γ ⊢ ParseExpr(Advance(P)) ⇓ (P_1, e)    IsPunc(Tok(P_1), ")")
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseRegionOptsOpt(P) ⇓ (Advance(P_1), e)
```

**(Parse-Region-Alias-None)**

```text
¬ IsKw(Tok(P), `as`)
```

──────────────────────────────────────────────

```text
Γ ⊢ ParseRegionAliasOpt(P) ⇓ (P, ⊥)
```

**(Parse-Region-Alias-Some)**

```text
IsKw(Tok(P), `as`)    Γ ⊢ ParseIdent(Advance(P)) ⇓ (P_1, name)
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseRegionAliasOpt(P) ⇓ (P_1, name)
```

**(Parse-Region-Stmt)**

```text
IsKw(Tok(P), `region`)    Γ ⊢ ParseRegionOptsOpt(Advance(P)) ⇓ (P_1, opts_opt)    Γ ⊢ ParseRegionAliasOpt(P_1) ⇓ (P_2, alias_opt)    Γ ⊢ ParseBlock(P_2) ⇓ (P_3, b)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseStmtCore(P) ⇓ (P_3, RegionStmt(opts_opt, alias_opt, b))
```

#### 18.7.3 AST Representation / Form

RegionStmt(opts_opt, alias_opt, block)

```text
RegionActiveType(T) ⇔ StripPerm(T) = TypeModalState([`Region`], `Active`)
FreshRegion(Γ) ∈ Name \ dom(Γ)
```

```text
RegionOptsExpr(⊥) = Call(Identifier(`RegionOptions`), [])
RegionOptsExpr(e) = e    if e ≠ ⊥
```

#### 18.7.4 Static Semantics

```text
RegionBind(Γ, alias_opt) = Γ_r ⇔ r =
  { alias_opt           if alias_opt ≠ ⊥
    FreshRegion(Γ)      otherwise } ∧ IntroAll(Γ, [⟨r, TypePerm(`unique`, TypeModalState([`Region`], `Active`))⟩]) ⇓ Γ_r
```

**(T-RegionStmt)**

```text
RegionOptsExpr(opts_opt) = opts    Γ; R; L ⊢ opts ⇐ TypePath([`RegionOptions`]) ⊣ ∅    RegionBind(Γ, alias_opt) = Γ_r    Γ_r; R; L ⊢ b : T_b
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ RegionStmt(opts_opt, alias_opt, b) ⇒ Γ ▷ ⟨[], [], false⟩
```

```text
If alias_opt = ⊥, the identifier produced for the region binding MUST be treated as synthetic. It MUST NOT be introduced by name resolution and MUST NOT be referenced by user code.
```

**(B-RegionStmt)** introduces the region binding into a fresh local scope and pushes the corresponding permission scope.

```text
**(Prov-RegionStmt)** introduces the region provenance tag and pushes `⟨r, r⟩` onto the runtime region stack relation.
```

#### 18.7.5 Dynamic Semantics

```text
BindRegionAlias(σ, ⊥, r) ⇓ σ
BindRegionAlias(σ, x, r) ⇓ σ' ⇔ BindVal(σ, x, RegionValue(`@Active`, r)) ⇓ (σ', b)
```

**(ExecSigma-Region)**

```text
Γ ⊢ EvalSigma(opts, σ) ⇓ (Val(v_o), σ_1)    RegionNew(σ_1, v_o) ⇓ (σ_2, r, scope)    BindRegionAlias(σ_2, alias_opt, r) ⇓ σ_3    Γ ⊢ EvalInScopeSigma(b, σ_3, scope) ⇓ (out, σ_4)    RegionRelease(σ_4, r, scope, out) ⇓ (out', σ_5)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ExecSigma(RegionStmt(opts_opt, alias_opt, b), σ) ⇓ (StmtOutOf(out'), σ_5)
```

**(ExecSigma-Region-Ctrl)**

```text
Γ ⊢ EvalSigma(opts, σ) ⇓ (Ctrl(κ), σ_1)
```

───────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ExecSigma(RegionStmt(opts_opt, alias_opt, b), σ) ⇓ (Ctrl(κ), σ_1)
```

```text
RegionRelease(Σ, r, scope, out) ⇓ (out', Σ') ⇔ Γ ⊢ CleanupScope(scope, Σ) ⇓ (c, Σ_1) ∧ out' = ExitOutcome(out, c) ∧ ((out' = Ctrl(Abort) ∧ Σ' = Σ_1) ∨ (out' ≠ Ctrl(Abort) ∧ ReleaseArena(Σ_1, r) ⇓ Σ_2 ∧ PopScope_σ(Σ_2) ⇓ (Σ', scope)))
```

**(Step-Exec-Region-Enter)**

```text
opts = RegionOptsExpr(opts_opt)    Γ ⊢ EvalSigma(opts, σ) ⇓ (Val(v_o), σ_1)    RegionNew(σ_1, v_o) ⇓ (σ_2, r, scope)    BindRegionAlias(σ_2, alias_opt, r) ⇓ σ_3
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨Exec(RegionStmt(opts_opt, alias_opt, b), σ)⟩ → ⟨RegionBody(r, scope, b, σ_3)⟩
```

**(Step-Exec-Region-Enter-Ctrl)**

```text
opts = RegionOptsExpr(opts_opt)    Γ ⊢ EvalSigma(opts, σ) ⇓ (Ctrl(κ), σ_1)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨Exec(RegionStmt(opts_opt, alias_opt, b), σ)⟩ → ⟨ExecCtrl(κ, σ_1)⟩
```

**(Step-Exec-Region-Body)**

```text
Γ ⊢ EvalInScopeSigma(b, σ, scope) ⇓ (out, σ_1)
```

────────────────────────────────────────────────────────────────────────────

```text
⟨RegionBody(r, scope, b, σ)⟩ → ⟨RegionExit(r, scope, out, σ_1)⟩
```

**(Step-Exec-Region-Exit-Ok)**

```text
RegionRelease(σ, r, scope, out) ⇓ (out', σ')    StmtOutOf(out') = ok
```

────────────────────────────────────────────────────────────────────────────────────────

```text
⟨RegionExit(r, scope, out, σ)⟩ → ⟨ExecDone(σ')⟩
```

**(Step-Exec-Region-Exit-Ctrl)**

```text
RegionRelease(σ, r, scope, out) ⇓ (out', σ')    StmtOutOf(out') = Ctrl(κ)
```

───────────────────────────────────────────────────────────────────────────────────────────

```text
⟨RegionExit(r, scope, out, σ)⟩ → ⟨ExecCtrl(κ, σ')⟩
```

#### 18.7.6 Lowering

**(Lower-Stmt-Region)**

```text
opts = RegionOptsExpr(opts_opt)    Γ ⊢ LowerExpr(opts) ⇓ ⟨IR_o, v_o⟩    Γ ⊢ LowerBlock(block) ⇓ ⟨IR_b, v_b⟩
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerStmt(RegionStmt(opts_opt, alias_opt, block)) ⇓ SeqIR(IR_o, RegionIR(v_o, alias_opt, IR_b, v_b))
```

#### 18.7.7 Diagnostics

No additional named diagnostics are introduced specifically for `region` statements beyond the diagnostics of the options expression, the enclosed block, and the region operations they trigger.

### 18.8 Frame

#### 18.8.1 Syntax

```text
frame_stmt ::= "frame" block_expr | identifier "." "frame" block_expr
```

#### 18.8.2 Parsing

**(Parse-Frame-Stmt)**

```text
IsKw(Tok(P), `frame`)    Γ ⊢ ParseBlock(Advance(P)) ⇓ (P_1, b)
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseStmtCore(P) ⇓ (P_1, FrameStmt(⊥, b))
```

**(Parse-Frame-Explicit)**

```text
IsIdent(Tok(P))    IsPunc(Tok(Advance(P)), ".")    IsKw(Tok(Advance(Advance(P))), `frame`)    name = Lexeme(Tok(P))    Γ ⊢ ParseBlock(Advance(Advance(Advance(P)))) ⇓ (P_1, b)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseStmtCore(P) ⇓ (P_1, FrameStmt(name, b))
```

#### 18.8.3 AST Representation / Form

FrameStmt(target_opt, block)

```text
InnermostActiveRegion([]) = ⊥
InnermostActiveRegion([σ] ++ Γ') =
  { r                         if ∃ r. r ∈ dom(σ) ∧ RegionActiveType(σ[r])
    InnermostActiveRegion(Γ')  otherwise }
```

```text
FrameBind(Γ, target_opt) = Γ_f ⇔ r =
  { InnermostActiveRegion(Γ)    if target_opt = ⊥
    target_opt                  if target_opt ≠ ⊥ ∧ Γ; R; L ⊢ Identifier(target_opt) : T_r ∧ RegionActiveType(T_r) } ∧ F = FreshRegion(Γ) ∧ IntroAll(Γ, [⟨F, TypePerm(`unique`, TypeModalState([`Region`], `Active`))⟩]) ⇓ Γ_f
```

#### 18.8.4 Static Semantics

**(T-FrameStmt-Implicit)**

```text
FrameBind(Γ, ⊥) = Γ_f    Γ_f; R; L ⊢ b : T_b
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ FrameStmt(⊥, b) ⇒ Γ ▷ ⟨[], [], false⟩
```

**(T-FrameStmt-Explicit)**

```text
FrameBind(Γ, r) = Γ_f    Γ_f; R; L ⊢ b : T_b
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ FrameStmt(r, b) ⇒ Γ ▷ ⟨[], [], false⟩
```

**(Frame-NoActiveRegion-Err)**

```text
InnermostActiveRegion(Γ) undefined    c = Code(Frame-NoActiveRegion-Err)
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ FrameStmt(⊥, b) ⇑ c
```

**(Frame-Target-NotActive-Err)**

```text
Γ; R; L ⊢ Identifier(r) : T_r    ¬ RegionActiveType(T_r)    c = Code(Frame-Target-NotActive-Err)
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ FrameStmt(r, b) ⇑ c
```

FrameBind introduces a fresh synthetic region identifier `F` with the same synthetic-binding restriction as the anonymous `region` binding. `F` is used only for provenance assignment.

```text
**(B-FrameStmt)** pushes a fresh scope, introduces `FrameBindInfo(Γ)`, and evaluates the body in that scope.
```

```text
**(Prov-FrameStmt)** pushes `⟨F, r⟩` on the runtime region stack relation, where `r` is the resolved target.
```

#### 18.8.5 Dynamic Semantics

```text
ActiveTarget(σ) = target ⇔ ActiveEntry(σ) = e ∧ RegionTargetOf(e) = target
ResolveTarget(σ, r) = target ⇔ ResolveEntry(RegionStack(σ), r) = e ∧ RegionTargetOf(e) = target
```

```text
FrameEnter(σ, r) ⇓ (σ', F, scope, mark) ⇔ PushScope_σ(σ) ⇓ (σ_1, scope) ∧ F = FreshTag(σ) ∧ mark = FrameMark(σ_1, r) ∧ UpdateRegionStack(σ_1, ⟨F, r, scope, mark⟩ :: RegionStack(σ_1)) = σ'
```

**(ExecSigma-Frame-Implicit)**

```text
ActiveTarget(σ) = r    FrameEnter(σ, r) ⇓ (σ_1, F, scope, mark)    Γ ⊢ EvalInScopeSigma(b, σ_1, scope) ⇓ (out, σ_2)    FrameReset(σ_2, r, scope, mark, out) ⇓ (out', σ_3)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ExecSigma(FrameStmt(⊥, b), σ) ⇓ (StmtOutOf(out'), σ_3)
```

**(ExecSigma-Frame-Explicit)**

```text
LookupVal(σ, r) = v_r    RegionHandleOf(v_r) = h    ResolveTarget(σ, h) = r_t    FrameEnter(σ, r_t) ⇓ (σ_1, F, scope, mark)    Γ ⊢ EvalInScopeSigma(b, σ_1, scope) ⇓ (out, σ_2)    FrameReset(σ_2, r_t, scope, mark, out) ⇓ (out', σ_3)
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ExecSigma(FrameStmt(r, b), σ) ⇓ (StmtOutOf(out'), σ_3)
```

```text
FrameReset(Σ, r, scope, mark, out) ⇓ (out', Σ') ⇔ Γ ⊢ CleanupScope(scope, Σ) ⇓ (c, Σ_1) ∧ out' = ExitOutcome(out, c) ∧ ((out' = Ctrl(Abort) ∧ Σ' = Σ_1) ∨ (out' ≠ Ctrl(Abort) ∧ ResetArena(Σ_1, r, scope, mark) ⇓ Σ_2 ∧ PopScope_σ(Σ_2) ⇓ (Σ', scope)))
```

**(Step-Exec-Frame-Enter-Implicit)**

```text
ActiveTarget(σ) = r    FrameEnter(σ, r) ⇓ (σ_1, F, scope, mark)
```

────────────────────────────────────────────────────────────────────────────────

```text
⟨Exec(FrameStmt(⊥, b), σ)⟩ → ⟨FrameBody(r, scope, mark, b, σ_1)⟩
```

**(Step-Exec-Frame-Enter-Explicit)**

```text
LookupVal(σ, r) = v_r    RegionHandleOf(v_r) = h    ResolveTarget(σ, h) = r_t    FrameEnter(σ, r_t) ⇓ (σ_1, F, scope, mark)
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨Exec(FrameStmt(r, b), σ)⟩ → ⟨FrameBody(r_t, scope, mark, b, σ_1)⟩
```

**(Step-Exec-Frame-Body)**

```text
Γ ⊢ EvalInScopeSigma(b, σ, scope) ⇓ (out, σ_1)
```

────────────────────────────────────────────────────────────────────────────

```text
⟨FrameBody(r, scope, mark, b, σ)⟩ → ⟨FrameExit(r, scope, mark, out, σ_1)⟩
```

**(Step-Exec-Frame-Exit-Ok)**

```text
FrameReset(σ, r, scope, mark, out) ⇓ (out', σ')    StmtOutOf(out') = ok
```

──────────────────────────────────────────────────────────────────────────────────────

```text
⟨FrameExit(r, scope, mark, out, σ)⟩ → ⟨ExecDone(σ')⟩
```

**(Step-Exec-Frame-Exit-Ctrl)**

```text
FrameReset(σ, r, scope, mark, out) ⇓ (out', σ')    StmtOutOf(out') = Ctrl(κ)
```

─────────────────────────────────────────────────────────────────────────────────────────

```text
⟨FrameExit(r, scope, mark, out, σ)⟩ → ⟨ExecCtrl(κ, σ')⟩
```

#### 18.8.6 Lowering

**(Lower-Stmt-Frame-Implicit)**

```text
Γ ⊢ LowerBlock(block) ⇓ ⟨IR_b, v_b⟩
```

───────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerStmt(FrameStmt(⊥, block)) ⇓ FrameIR(⊥, IR_b, v_b)
```

**(Lower-Stmt-Frame-Explicit)**

```text
Γ ⊢ LowerExpr(Identifier(r)) ⇓ ⟨IR_r, v_r⟩    Γ ⊢ LowerBlock(block) ⇓ ⟨IR_b, v_b⟩
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerStmt(FrameStmt(r, block)) ⇓ SeqIR(IR_r, FrameIR(v_r, IR_b, v_b))
```

#### 18.8.7 Diagnostics

Diagnostics are defined for `frame` used with no active region in scope and for explicit frame targets that are not in `Region@Active` state.

### 18.9 Control-Transfer Statements

#### 18.9.1 Syntax

```text
return_stmt   ::= "return" expression? terminator?
break_stmt    ::= "break" expression? terminator?
continue_stmt ::= "continue" terminator?
```

#### 18.9.2 Parsing

**(Parse-Return-Stmt)**

```text
IsKw(Tok(P), `return`)    Γ ⊢ ParseExprOpt(Advance(P)) ⇓ (P_1, e_opt)
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseStmtCore(P) ⇓ (P_1, ReturnStmt(e_opt))
```

**(Parse-Break-Stmt)**

```text
IsKw(Tok(P), `break`)    Γ ⊢ ParseExprOpt(Advance(P)) ⇓ (P_1, e_opt)
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseStmtCore(P) ⇓ (P_1, BreakStmt(e_opt))
```

**(Parse-Continue-Stmt)**
IsKw(Tok(P), `continue`)
──────────────────────────────────────────────

```text
Γ ⊢ ParseStmtCore(P) ⇓ (Advance(P), ContinueStmt)
```

#### 18.9.3 AST Representation / Form

ReturnStmt(expr_opt)
BreakStmt(expr_opt)
ContinueStmt

#### 18.9.4 Static Semantics

**(T-Return-Value)**

```text
R_b = BodyReturnType(R)    Γ; R; L ⊢ e ⇐ R_b ⊣ ∅
```

────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ ReturnStmt(e) ⇒ Γ ▷ ⟨[], [], false⟩
```

**(T-Return-Unit)**
R_b = BodyReturnType(R)    R_b = TypePrim("()")
────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ ReturnStmt(⊥) ⇒ Γ ▷ ⟨[], [], false⟩
```

**(Return-Async-Type-Err)**

```text
AsyncSig(R) = ⟨Out, In, Result, E⟩    Γ; R; L ⊢ e : T    ¬(Γ ⊢ T <: Result)    c = Code(E-CON-0203)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ ReturnStmt(e) ⇑ c
```

**(Return-Async-Unit-Err)**

```text
AsyncSig(R) = ⟨Out, In, Result, E⟩    Result ≠ TypePrim("()")    c = Code(E-CON-0203)
```

────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ ReturnStmt(⊥) ⇑ c
```

**(Return-Type-Err)**

```text
AsyncSig(R) = ⊥    Γ; R; L ⊢ e : T    R_b = BodyReturnType(R)    ¬(Γ ⊢ T <: R_b)    c = Code(Return-Type-Err)
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ ReturnStmt(e) ⇑ c
```

**(Return-Unit-Err)**

```text
AsyncSig(R) = ⊥    R_b = BodyReturnType(R)    R_b ≠ TypePrim("()")    c = Code(Return-Type-Err)
```

────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ ReturnStmt(⊥) ⇑ c
```

**(T-Break-Value)**

```text
L = `loop`    Γ; R; L ⊢ e : T
```

────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ BreakStmt(e) ⇒ Γ ▷ ⟨[], [T], false⟩
```

**(T-Break-Unit)**
L = `loop`
────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ BreakStmt(⊥) ⇒ Γ ▷ ⟨[], [], true⟩
```

**(Break-Outside-Loop)**

```text
L ≠ `loop`    c = Code(Break-Outside-Loop)
```

────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ BreakStmt(_) ⇑ c
```

**(T-Continue)**
L = `loop`
────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ ContinueStmt ⇒ Γ ▷ ⟨[], [], false⟩
```

**(Continue-Outside-Loop)**

```text
L ≠ `loop`    c = Code(Continue-Outside-Loop)
```

────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ ContinueStmt ⇑ c
```

**(B-Return)**, **(B-Return-Unit)**, **(B-Break)**, **(B-Break-Unit)**, and **(B-Continue)** define binding-state effects for control transfer.

**(Prov-Return)**, **(Prov-Return-Unit)**, **(Prov-Break)**, **(Prov-Break-Unit)**, and **(Prov-Continue)** define the corresponding provenance effects.

#### 18.9.5 Dynamic Semantics

**(ExecSigma-Return)**

```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Val(v), σ_1)
```

──────────────────────────────────────────────────────────

```text
Γ ⊢ ExecSigma(ReturnStmt(e), σ) ⇓ (Ctrl(Return(v)), σ_1)
```

**(ExecSigma-Return-Unit)**
───────────────────────────────────────────────────────

```text
Γ ⊢ ExecSigma(ReturnStmt(⊥), σ) ⇓ (Ctrl(Return(())), σ)
```

**(ExecSigma-Return-Ctrl)**

```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Ctrl(κ), σ_1)
```

───────────────────────────────────────────────────────

```text
Γ ⊢ ExecSigma(ReturnStmt(e), σ) ⇓ (Ctrl(κ), σ_1)
```

**(ExecSigma-Break)**

```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Val(v), σ_1)
```

──────────────────────────────────────────────────────────

```text
Γ ⊢ ExecSigma(BreakStmt(e), σ) ⇓ (Ctrl(Break(v)), σ_1)
```

**(ExecSigma-Break-Unit)**
───────────────────────────────────────────────────────

```text
Γ ⊢ ExecSigma(BreakStmt(⊥), σ) ⇓ (Ctrl(Break(⊥)), σ)
```

**(ExecSigma-Break-Ctrl)**

```text
Γ ⊢ EvalSigma(e, σ) ⇓ (Ctrl(κ), σ_1)
```

───────────────────────────────────────────────────────

```text
Γ ⊢ ExecSigma(BreakStmt(e), σ) ⇓ (Ctrl(κ), σ_1)
```

**(ExecSigma-Continue)**
──────────────────────────────────────────────────────────

```text
Γ ⊢ ExecSigma(ContinueStmt, σ) ⇓ (Ctrl(Continue), σ)
```

#### 18.9.6 Lowering

**(Lower-Stmt-Return)**

```text
Γ ⊢ LowerExpr(e) ⇓ ⟨IR_e, v⟩
```

──────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerStmt(ReturnStmt(e)) ⇓ SeqIR(IR_e, ReturnIR(v))
```

**(Lower-Stmt-Return-Unit)**
──────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerStmt(ReturnStmt(⊥)) ⇓ ReturnIR(())
```

**(Lower-Stmt-Break)**

```text
Γ ⊢ LowerExpr(e) ⇓ ⟨IR_e, v⟩
```

────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerStmt(BreakStmt(e)) ⇓ SeqIR(IR_e, BreakIR(v))
```

**(Lower-Stmt-Break-Unit)**
─────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerStmt(BreakStmt(⊥)) ⇓ BreakIR(⊥)
```

**(Lower-Stmt-Continue)**
────────────────────────────────────────────────────

```text
Γ ⊢ LowerStmt(ContinueStmt) ⇓ ContinueIR
```

For control-flow statements, the lowering MUST emit temporary cleanup immediately before the control transfer:

```text
Γ ⊢ LowerStmt(ReturnStmt(e)) ⇓ SeqIR(IR_e, TempCleanupIR(s), ReturnIR(v))
Γ ⊢ LowerStmt(BreakStmt(e)) ⇓ SeqIR(IR_e, TempCleanupIR(s), BreakIR(v))
Γ ⊢ LowerStmt(BreakStmt(⊥)) ⇓ SeqIR(TempCleanupIR(s), BreakIR(⊥))
Γ ⊢ LowerStmt(ContinueStmt) ⇓ SeqIR(TempCleanupIR(s), ContinueIR)
```

#### 18.9.7 Diagnostics

Diagnostics are defined for return type mismatch, invalid async return type, `break` outside `loop`, `continue` outside `loop`, and `return` at module scope.

### 18.10 Unsafe Statements

#### 18.10.1 Syntax

```text
unsafe_block ::= "unsafe" block_expr
```

#### 18.10.2 Parsing

**(Parse-Unsafe-Block)**

```text
IsKw(Tok(P), `unsafe`)    Γ ⊢ ParseBlock(Advance(P)) ⇓ (P_1, b)
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseStmtCore(P) ⇓ (P_1, UnsafeBlockStmt(b))
```

#### 18.10.3 AST Representation / Form

UnsafeBlockStmt(block)

#### 18.10.4 Static Semantics

**(T-UnsafeStmt)**

```text
Γ; R; L ⊢ b : T
```

────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ UnsafeBlockStmt(b) ⇒ Γ ▷ ⟨[], [], false⟩
```

**(B-UnsafeStmt)** and **(Prov-UnsafeStmt)** define binding-state and provenance behavior for unsafe statement blocks.

Unsafe-required operation diagnostics are owned by the constructs that require them, including packed-field references, `transmute`, raw allocator operations, unchecked region operations, and `extern` calls.

#### 18.10.5 Dynamic Semantics

**(ExecSigma-UnsafeStmt)**

```text
Γ ⊢ EvalSigma(b, σ) ⇓ (out, σ_1)
```

──────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ExecSigma(UnsafeBlockStmt(b), σ) ⇓ (StmtOutOf(out), σ_1)
```

#### 18.10.6 Lowering

**(Lower-Stmt-UnsafeBlock)**

```text
Γ ⊢ LowerBlock(block) ⇓ ⟨IR_b, v⟩
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerStmt(UnsafeBlockStmt(block)) ⇓ IR_b
```

#### 18.10.7 Diagnostics

No additional named diagnostics are introduced for the `unsafe` statement form itself. Diagnostics for unsafe-required operations remain owned by the specific construct being used.

### 18.11 Statement Diagnostics Supplement

This section owns diagnostics for statement typing, method placement, assignment, `defer`, and control flow.

| Code         | Severity | Detection    | Condition                                   |
| ------------ | -------- | ------------ | ------------------------------------------- |
| `E-MOD-2401` | Error    | Compile-time | Reassignment of immutable `let` binding     |
| `E-SEM-3011` | Error    | Compile-time | Method defined outside of type context      |
| `E-SEM-3012` | Error    | Compile-time | Duplicate method name in type               |
| `E-SEM-3131` | Error    | Compile-time | Assignment target is not a place expression |
| `E-SEM-3132` | Error    | Compile-time | Assignment through `const` permission       |
| `E-SEM-3133` | Error    | Compile-time | Assignment type mismatch                    |
| `E-SEM-3151` | Error    | Compile-time | Defer block has non-unit type               |
| `E-SEM-3152` | Error    | Compile-time | Non-local control flow in defer block       |
| `E-SEM-3161` | Error    | Compile-time | `return` type mismatch with procedure       |
| `E-SEM-3162` | Error    | Compile-time | `break` outside `loop`                      |
| `E-SEM-3163` | Error    | Compile-time | `continue` outside `loop`                   |
| `E-SEM-3165` | Error    | Compile-time | `return` at module scope                    |
