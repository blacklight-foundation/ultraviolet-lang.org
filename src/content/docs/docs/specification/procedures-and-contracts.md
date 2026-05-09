---
title: "Procedures and Contracts"
description: "15. Procedures and Contracts of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T17:39:45.389Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## 15. Procedures and Contracts

### 15.1 Procedure Declarations

#### 15.1.1 Syntax

```text
procedure_decl ::= attribute_list? visibility? "procedure" identifier generic_params? signature predicate_clause? contract_clause? block_expr
signature      ::= "(" param_list? ")" ("->" type)?
param_list      ::= param ("," param)*
param           ::= "move"? identifier ":" type
```

`extern` procedure declarations are owned by §23.2.

#### 15.1.2 Parsing

**(Parse-Procedure)**

```text
Γ ⊢ ParseAttrListOpt(P) ⇓ (P_0, attrs_opt)    Γ ⊢ ParseVis(P_0) ⇓ (P_1, vis)    IsKw(Tok(P_1), `procedure`)    Γ ⊢ ParseIdent(Advance(P_1)) ⇓ (P_2, name)    Γ ⊢ ParseGenericParamsOpt(P_2) ⇓ (P_3, gen_params_opt)    Γ ⊢ ParseSignature(P_3) ⇓ (P_4, params, ret_opt)    Γ ⊢ ParsePredicateClauseOpt(P_4) ⇓ (P_5, predicate_clause_opt)    Γ ⊢ ParseContractClauseOpt(P_5) ⇓ (P_6, contract_opt)    Γ ⊢ ParseBlock(P_6) ⇓ (P_7, body)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseItem(P) ⇓ (P_7, ⟨ProcedureDecl, attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, params, ret_opt, contract_opt, body, SpanBetween(P, P_7), []⟩)
```

**(Parse-Signature)**

```text
IsPunc(Tok(P), "(")    Γ ⊢ ParseParamList(Advance(P)) ⇓ (P_1, params)    IsPunc(Tok(P_1), ")")    Γ ⊢ ParseReturnOpt(Advance(P_1)) ⇓ (P_2, ret_opt)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseSignature(P) ⇓ (P_2, params, ret_opt)
```

**(Parse-ParamList-Empty)**
IsPunc(Tok(P), ")")
────────────────────────────────────────────

```text
Γ ⊢ ParseParamList(P) ⇓ (P, [])
```

**(Parse-ParamList-Cons)**

```text
Γ ⊢ ParseParam(P) ⇓ (P_1, param)    Γ ⊢ ParseParamTail(P_1, [param]) ⇓ (P_2, params)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseParamList(P) ⇓ (P_2, params)
```

**(Parse-Param)**

```text
Γ ⊢ ParseParamModeOpt(P) ⇓ (P_1, mode)    Γ ⊢ ParseIdent(P_1) ⇓ (P_2, name)    IsPunc(Tok(P_2), ":")    Γ ⊢ ParseType(Advance(P_2)) ⇓ (P_3, ty)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseParam(P) ⇓ (P_3, ⟨mode, name, ty⟩)
```

**(Parse-ParamMode-None)**

```text
¬ IsKw(Tok(P), `move`)
```

──────────────────────────────────────────────

```text
Γ ⊢ ParseParamModeOpt(P) ⇓ (P, ⊥)
```

**(Parse-ParamMode-Move)**
IsKw(Tok(P), `move`)
─────────────────────────────────────────────────

```text
Γ ⊢ ParseParamModeOpt(P) ⇓ (Advance(P), `move`)
```

**(Parse-ParamTail-End)**
IsPunc(Tok(P), ")")
────────────────────────────────────────────

```text
Γ ⊢ ParseParamTail(P, xs) ⇓ (P, xs)
```

**(Parse-ParamTail-TrailingComma)**
IsPunc(Tok(P), ",")    IsPunc(Tok(Advance(P)), ")")    TrailingCommaAllowed(P_0, P, {Punctuator(")")})
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseParamTail(P, xs) ⇓ (Advance(P), xs)
```

**(Parse-ParamTail-Comma)**

```text
IsPunc(Tok(P), ",")    Γ ⊢ ParseParam(Advance(P)) ⇓ (P_1, p)    Γ ⊢ ParseParamTail(P_1, xs ++ [p]) ⇓ (P_2, ys)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseParamTail(P, xs) ⇓ (P_2, ys)
```

**(Parse-ReturnOpt-None)**

```text
¬ IsOp(Tok(P), "->")
```

─────────────────────────────────────────────

```text
Γ ⊢ ParseReturnOpt(P) ⇓ (P, ⊥)
```

**(Parse-ReturnOpt-Arrow)**

```text
IsOp(Tok(P), "->")    Γ ⊢ ParseType(Advance(P)) ⇓ (P_1, ty)
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseReturnOpt(P) ⇓ (P_1, ty)
```

#### 15.1.3 AST Representation / Form

```text
ProcedureDecl = ⟨attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, params, return_type_opt, contract_opt, body, span, doc⟩
Param = ⟨mode, name, type⟩
```

```text
ParamNames(params) = [x | ⟨_, x, _⟩ ∈ params]
ParamBinds(params) = [⟨x, T⟩ | ⟨_, x, T⟩ ∈ params]
```

ProcReturn(ret_opt) =

```text
  { TypePrim("()")   if ret_opt = ⊥
```

    ret_opt          otherwise }

BodyReturnType(R) =

```text
  { Result    if AsyncSig(R) = ⟨Out, In, Result, E⟩
```

    R         otherwise }

```text
ExplicitReturn(BlockExpr(stmts, tail_opt)) ⇔ tail_opt = ⊥ ∧ stmts ≠ [] ∧ LastStmt(stmts) = ReturnStmt(_)
```

#### 15.1.4 Static Semantics

```text
ReturnAnnOk(ret_opt) ⇔ ret_opt ≠ ⊥
```

**(WF-ProcedureDecl)**

```text
item = ProcedureDecl(_, vis, _, gen_params_opt, predicate_clause_opt, params, ret_opt, _, body, _, _)    params_gen = TypeParamsOpt(gen_params_opt)    params_gen = [P_1, …, P_n]    Γ ⊢ ⟨P_1; …; P_n⟩ wf    Γ_g = BindTypeParams(Γ, params_gen)    Γ_g; params_gen ⊢ predicate_clause_opt wf    Distinct(ParamNames(params))    ReturnAnnOk(ret_opt)    R = ProcReturn(ret_opt)    R_b = BodyReturnType(R)    ∀ ⟨_, x_i, T_i⟩ ∈ params, Γ_g ⊢ T_i wf    Γ_0 = PushScope(Γ_g)    IntroAll(Γ_0, ParamBinds(params)) ⇓ Γ_1    Γ_1; R; ⊥ ⊢ body : T_b    Γ_g ⊢ T_b <: R_b    (R_b ≠ TypePrim("()") ⇒ ExplicitReturn(body))
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
DeclJudg = {Γ ⊢ ProcedureDecl : ok, Γ ⊢ ExternProcDecl : ok, Γ ⊢ ExternBlock : ok, Γ ⊢ StaticDecl : ok, Γ ⊢ RecordDecl : ok, Γ ⊢ EnumDecl : ok, Γ ⊢ ModalDecl : ok, Γ ⊢ ClassDecl : ok}
```

**DeclTyping.**

```text
DeclTyping(Ms) ⇓ ok ⇔ ∀ M ∈ Ms. Γ ⊢ DeclTypingMod(M) ⇓ ok
DeclTypingMod(M) ⇓ ok ⇔ ∀ it ∈ M.items. Γ ⊢ DeclTypingItem(M.path, it) ⇓ ok
```

```text
ProvBindCheck(params, body) ⇓ ok ⇔ body = BlockExpr(stmts, tail_opt) ∧ ∃ vec{π}. |vec{π}| = |params| ∧ Γ; InitProvEnv(params, vec{π}, []) ⊢ BlockProv(stmts, tail_opt) ⇓ π
```

```text
DeclTypingItem(m, ImportDecl(_)) ⇓ ok
DeclTypingItem(m, UsingDecl(_)) ⇓ ok
DeclTypingItem(m, ExternBlock(_, _, _, items, _, _)) ⇓ ok ⇔ Γ ⊢ ExternBlock : ok ∧ ∀ it ∈ items. Γ ⊢ it : ok
DeclTypingItem(m, StaticDecl(_, _, _, _, _, _)) ⇓ ok ⇔ Γ ⊢ StaticDecl : ok
DeclTypingItem(m, TypeAliasDecl(_, name, _, _, _, _, _, _)) ⇓ ok ⇔ Γ ⊢ FullPath(m, name) : TypeAliasOk
DeclTypingItem(m, ProcedureDecl(_, _, _, _, _, params, _, _, body, _, _) = item) ⇓ ok ⇔ Γ ⊢ ProcedureDecl : ok ∧ ProcBindCheck(m, item) ⇓ ok ∧ ProvBindCheck(params, body) ⇓ ok
DeclTypingItem(m, R) ⇓ ok ⇔ R = RecordDecl(_, _, _, _, _, _, _, _, _, _) ∧ Γ ⊢ R record : ok ∧ ∀ md ∈ Methods(R). MethodBindCheck(m, TypePath(RecordPath(R)), md) ⇓ ok ∧ ProvBindCheck(MethodParamsDecl(TypePath(RecordPath(R)), md), md.body) ⇓ ok
DeclTypingItem(m, E) ⇓ ok ⇔ E = EnumDecl(_, _, _, _, _, _, _, _, _, _) ∧ Γ ⊢ E enum : ok
DeclTypingItem(m, M) ⇓ ok ⇔ M = ModalDecl(_, _, _, _, _, _, _, _, _, _) ∧ Γ ⊢ M modal : ok ∧ ∀ S ∈ States(M), ∀ md ∈ Methods(M, S). StateMethodBindCheck(m, M, S, md) ⇓ ok ∧ ProvBindCheck(StateMethodParams(M, S, md), md.body) ⇓ ok ∧ ∀ tr ∈ Transitions(M, S). TransitionBindCheck(m, M, S, tr) ⇓ ok ∧ ProvBindCheck(TransitionParams(M, S, tr), tr.body) ⇓ ok
DeclTypingItem(m, Cl) ⇓ ok ⇔ Cl = ClassDecl(_, _, _, _, _, _, _, _, _, _) ∧ Γ ⊢ Cl : ok ∧ ∀ md ∈ ClassMethods(Cl). (md.body_opt = ⊥ ∨ (ClassMethodBindCheck(m, Cl, md) ⇓ ok ∧ ProvBindCheck(ClassMethodParams(Cl, md), md.body_opt) ⇓ ok))
```

```text
Γ ⊢ ProcedureDecl : ok
```

**(WF-ProcedureDecl-MissingReturnType)**

```text
item = ProcedureDecl(_, _, _, _, _, _, ret_opt, _, _, _, _)    ¬ ReturnAnnOk(ret_opt)
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ item ⇑
```

**(WF-ProcBody-ExplicitReturn-Err)**

```text
item = ProcedureDecl(_, _, _, _, _, _, ret_opt, _, body, _, _)    R = ProcReturn(ret_opt)    R_b = BodyReturnType(R)    R_b ≠ TypePrim("()")    ¬ ExplicitReturn(body)
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ item ⇑
```

If the declaration carries `[[export]]` or `[[host_export]]`, the foreign-callable signature obligations from §23.3 also apply.

**Program Entry Point.**

```text
MainDecls(P) = [ d | m ∈ P.modules, d ∈ ASTModule(P, m).items, d = ProcedureDecl(_, vis, name, _, _, params, ret_opt, _, body, span, doc), name = `main` ]
```

TypeParams(ProcedureDecl(_, _, _, gen_params_opt, _, _, _, _, _, _, _)) = TypeParamsOpt(gen_params_opt)

```text
MainGeneric(d) ⇔ TypeParams(d) ≠ []
MainArgType(d) = ty ⇔ d = ProcedureDecl(_, _, `main`, _, _, [⟨_, _, ty⟩], _, _, _, _, _)
MainSigOk(d) ⇔ d = ProcedureDecl(_, vis, `main`, _, _, params, ret_opt, _, _, _, _) ∧ vis = `public` ∧ params = [⟨mode, name, ty⟩] ∧ mode ∈ {⊥, `move`} ∧ ContextBundleType(StripPerm(ty)) ∧ ret_opt = TypePrim("i32")
```

MainCheck : Project ⇀ ok

**(Main-Ok)**

```text
Executable(P)    MainDecls(P) = [d]    ¬ MainGeneric(d)    MainSigOk(d)
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ MainCheck(P) ⇓ ok
```

**(Main-Bypass-NonExecutable)**

```text
¬ Executable(P)
```

──────────────────────────────────────────────

```text
Γ ⊢ MainCheck(P) ⇓ ok
```

**(Main-Multiple)**
Executable(P)    |MainDecls(P)| > 1    c = Code(Main-Multiple)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ MainCheck(P) ⇑ c
```

**(Main-Generic-Err)**
Executable(P)    MainDecls(P) = [d]    MainGeneric(d)    c = Code(Main-Generic-Err)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ MainCheck(P) ⇑ c
```

**(Main-Signature-Err)**

```text
Executable(P)    MainDecls(P) = [d]    ¬ MainSigOk(d)    c = Code(Main-Signature-Err)
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ MainCheck(P) ⇑ c
```

**(Main-Missing)**
Executable(P)    MainDecls(P) = []    c = Code(Main-Missing)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ MainCheck(P) ⇑ c
```

MainDiagRefs = {"8.2"}

#### 15.1.5 Dynamic Semantics

```text
FuncVal(sym) defined ⇔ sym ∈ Symbol
```

```text
BindParams([⟨mode_1, x_1, T_1⟩, …, ⟨mode_n, x_n, T_n⟩], [v_1, …, v_n]) = [⟨x_1, v_1⟩, …, ⟨x_n, v_n⟩]
ArgPassJudg = {Γ ⊢ EvalArgsSigma(params, args, σ) ⇓ (out, σ'), Γ ⊢ EvalRecvSigma(base, mode, σ) ⇓ (out, σ')}
```

ArgVal = {v, Alias(addr)}

```text
CallJudg = {Γ ⊢ EvalArgsSigma(params, args, σ) ⇓ (out, σ'), Γ ⊢ EvalRecvSigma(base, mode, σ) ⇓ (out, σ'), Γ ⊢ ApplyRegionProc(name, vec_v, σ) ⇓ (out, σ'), Γ ⊢ ApplyCancelProc(name, vec_v, σ) ⇓ (out, σ'), Γ ⊢ ApplyProcSigma(proc, vec_v, σ) ⇓ (out, σ'), Γ ⊢ ApplyRecordCtorSigma(p, σ) ⇓ (out, σ'), Γ ⊢ ApplyMethodSigma(base, name, v_self, v_arg, vec_v, σ) ⇓ (out, σ')}
```

```text
CallTarget(FuncVal(sym)) = proc ⇔ Γ ⊢ Mangle(proc) ⇓ sym ∧ (proc = ProcedureDecl(_, _, _, _, _, _, _, _, _, _, _) ∨ proc = ExternProcDecl(_, _, _, _, _, _, _, _, _, _, _))
```

CallTarget(RecordCtor(p)) = RecordCtor(p)

```text
MethodTarget(RecordValue(TypePath(p), fs), name) = m ⇔ LookupMethod(TypePath(p), name) = m
MethodTarget(v_self, name) = m ∧ m.body = ⊥ ∧ ¬ ∃ vec_v, out. Γ ⊢ PrimCall(MethodOwner(m), MethodName(m), v_self, vec_v) ⇓ out ⇒ IllFormed(MethodTarget(v_self, name))
```

```text
RegionProcParams(name) = params ⇔ RegionProcSig(`Region::`name) = ⟨params, ret⟩
CancelProcParams(name) = params ⇔ CancelTokenProcSig(`CancelToken::`name) = ⟨params, ret⟩
```

```text
SynthParams([⟨m_1, T_1⟩, …, ⟨m_n, T_n⟩]) = [⟨m_1, ⊥, T_1⟩, …, ⟨m_n, ⊥, T_n⟩]
```

```text
CalleeProc(Identifier(x)) = proc ⇔ Γ ⊢ ResolveValueName(x) ⇓ ent ∧ ent.origin_opt = mp ∧ name = (ent.target_opt if present, else x) ∧ DeclOf(mp, name) = proc ∧ (proc = ProcedureDecl(_, _, _, _, _, _, _, _, _, _, _) ∨ proc = ExternProcDecl(_, _, _, _, _, _, _, _, _, _, _))
CalleeProc(Path(path, name)) = proc ⇔ Γ ⊢ ResolveQualified(path, name, ValueKind) ⇓ ent ∧ ent.origin_opt = mp ∧ name' = (ent.target_opt if present, else name) ∧ DeclOf(mp, name') = proc ∧ (proc = ProcedureDecl(_, _, _, _, _, _, _, _, _, _, _) ∨ proc = ExternProcDecl(_, _, _, _, _, _, _, _, _, _, _))
```

Params(Call(callee, args)) =
  { proc.params            if CalleeProc(callee) = proc
    SynthParams(params)    if ExprType(callee) = TypeFunc(params, _)

```text
    ⊥                      otherwise }
```

ReturnOut(Val(v)) = Val(v)
ReturnOut(Ctrl(Return(v))) = Val(v)
ReturnOut(Ctrl(Panic)) = Ctrl(Panic)
ReturnOut(Ctrl(Abort)) = Ctrl(Abort)

```text
ReturnOut(Ctrl(Break(v_opt))) = ⊥
ReturnOut(Ctrl(Continue)) = ⊥
ReturnOut(out) = ⊥ ⇒ IllFormed(ReturnOut(out))
```

**(EvalArgsSigma-Empty)**
──────────────────────────────────────────────

```text
Γ ⊢ EvalArgsSigma([], [], σ) ⇓ (Val([]), σ)
```

**(EvalArgsSigma-Cons-Move)**

```text
Γ ⊢ EvalSigma(MovedArg(moved, e), σ) ⇓ (Val(v), σ_1)    Γ ⊢ EvalArgsSigma(ps, as, σ_1) ⇓ (Val(vec_v), σ_2)
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalArgsSigma([⟨`move`, x, T_p⟩] ++ ps, [⟨moved, e, _⟩] ++ as, σ) ⇓ (Val([v] ++ vec_v), σ_2)
```

**(EvalArgsSigma-Cons-Ref)**

```text
Γ ⊢ AddrOfSigma(RefArgExpr(e), σ) ⇓ (Val(addr), σ_1)    Γ ⊢ EvalArgsSigma(ps, as, σ_1) ⇓ (Val(vec_v), σ_2)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalArgsSigma([⟨⊥, x, T_p⟩] ++ ps, [⟨moved, e, _⟩] ++ as, σ) ⇓ (Val([Alias(addr)] ++ vec_v), σ_2)
```

**(EvalArgsSigma-Ctrl-Move)**

```text
Γ ⊢ EvalSigma(MovedArg(moved, e), σ) ⇓ (Ctrl(κ), σ_1)
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalArgsSigma([⟨`move`, x, T_p⟩] ++ ps, [⟨moved, e, _⟩] ++ as, σ) ⇓ (Ctrl(κ), σ_1)
```

**(EvalArgsSigma-Ctrl-Ref)**

```text
Γ ⊢ AddrOfSigma(RefArgExpr(e), σ) ⇓ (Ctrl(κ), σ_1)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalArgsSigma([⟨⊥, x, T_p⟩] ++ ps, [⟨moved, e, _⟩] ++ as, σ) ⇓ (Ctrl(κ), σ_1)
```

**(ApplyRegionProc-NewScoped)**

```text
name = `new_scoped`    vec_v = [opts]    RegionNewScoped(σ, opts) ⇓ (σ', v)
```

──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ApplyRegionProc(name, vec_v, σ) ⇓ (Val(v), σ')
```

**(ApplyRegionProc-Alloc)**

```text
name = `alloc`    vec_v = [v_r, v]    RegionAllocProc(σ, v_r, v) ⇓ (σ', v')
```

───────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ApplyRegionProc(name, vec_v, σ) ⇓ (Val(v'), σ')
```

**(ApplyRegionProc-Reset)**

```text
name = `reset_unchecked`    vec_v = [v_r]    RegionResetProc(σ, v_r) ⇓ (σ', v')
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ApplyRegionProc(name, vec_v, σ) ⇓ (Val(v'), σ')
```

**(ApplyRegionProc-Freeze)**

```text
name = `freeze`    vec_v = [v_r]    RegionFreezeProc(σ, v_r) ⇓ (σ', v')
```

───────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ApplyRegionProc(name, vec_v, σ) ⇓ (Val(v'), σ')
```

**(ApplyRegionProc-Thaw)**

```text
name = `thaw`    vec_v = [v_r]    RegionThawProc(σ, v_r) ⇓ (σ', v')
```

────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ApplyRegionProc(name, vec_v, σ) ⇓ (Val(v'), σ')
```

**(ApplyRegionProc-Free)**

```text
name = `free_unchecked`    vec_v = [v_r]    RegionFreeProc(σ, v_r) ⇓ (σ', v')
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ApplyRegionProc(name, vec_v, σ) ⇓ (Val(v'), σ')
```

**(ApplyCancelProc-New)**

```text
name = `new`    vec_v = []    CancelNew() ⇓ v
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ ApplyCancelProc(name, vec_v, σ) ⇓ (Val(v), σ)
```

**(ApplyProcSigma)**

```text
BindParams(proc.params, vec_v) = binds    BlockEnter(σ, binds) ⇓ (σ_1, scope)    Γ ⊢ EvalBlockBodySigma(proc.body, σ_1) ⇓ (out, σ_2)    BlockExit(σ_2, scope, out) ⇓ (out', σ_3)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ApplyProcSigma(proc, vec_v, σ) ⇓ (ReturnOut(out'), σ_3)
```

**(EvalSigma-Call-Proc)**

```text
Γ ⊢ EvalSigma(callee, σ) ⇓ (Val(v_c), σ_1)    proc = CallTarget(v_c)    Γ ⊢ EvalArgsSigma(proc.params, args, σ_1) ⇓ (Val(vec_v), σ_2)    Γ ⊢ ApplyProcSigma(proc, vec_v, σ_2) ⇓ (out, σ_3)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(Call(callee, args), σ) ⇓ (out, σ_3)
```

#### 15.1.6 Lowering

**(CG-Item-Procedure)**

```text
item = ProcedureDecl(attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, params, ret_opt, contract_opt, body, span, doc)    R = ProcReturn(ret_opt)    Γ ⊢ LowerBlock(body) ⇓ ⟨IR, v⟩    Γ ⊢ Mangle(item) ⇓ sym    params' = CodegenParams(params)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CodegenItem(item) ⇓ [ProcIR(sym, params', R, IR)]
```

Program-entry handling for `main` is owned by §24.4.

#### 15.1.7 Diagnostics

Diagnostics are defined for missing explicit return annotations, duplicate parameter names, non-unit procedures without an explicit trailing `return`, and bodies whose result type does not match the declared return type.

### 15.2 Methods and Receivers

#### 15.2.1 Syntax

```text
method_def              ::= visibility? "override"? "procedure" identifier generic_params? "(" receiver ("," param_list)? ")" ("->" type)? contract_clause? block_expr
receiver                ::= "~" | "~!" | "~%" | ("move"? "self" ":" type)
state_method_signature  ::= "(" receiver ("," param_list)? ")" ("->" type)?
```

Class methods and state-specific methods reuse the same receiver and parameter forms. Class-owned additions are in §14.3; modal-state additions are in §13.3.

#### 15.2.2 Parsing

**(Parse-MethodDefAfterVis)**

```text
Γ ⊢ ParseOverrideOpt(P) ⇓ (P_0, ov)    IsKw(Tok(P_0), `procedure`)    Γ ⊢ ParseIdent(Advance(P_0)) ⇓ (P_1, name)    Γ ⊢ ParseGenericParamsOpt(P_1) ⇓ (P_2, gen_params_opt)    Γ ⊢ ParseMethodSignature(P_2) ⇓ (P_3, receiver, params, ret_opt)    Γ ⊢ ParseContractClauseOpt(P_3) ⇓ (P_4, contract_opt)    Γ ⊢ ParseBlock(P_4) ⇓ (P_5, body)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseMethodDefAfterVis(P, vis, attrs_opt) ⇓ (P_5, ⟨MethodDecl, attrs_opt, vis, ov, name, gen_params_opt, receiver, params, ret_opt, contract_opt, body, SpanBetween(P, P_5), []⟩)
```

**(Parse-Override-Yes)**
IsKw(Tok(P), `override`)
────────────────────────────────────────────

```text
Γ ⊢ ParseOverrideOpt(P) ⇓ (Advance(P), true)
```

**(Parse-Override-No)**

```text
¬ IsKw(Tok(P), `override`)
```

──────────────────────────────────────────

```text
Γ ⊢ ParseOverrideOpt(P) ⇓ (P, false)
```

**(Parse-MethodSignature)**

```text
IsPunc(Tok(P), "(")    Γ ⊢ ParseReceiver(Advance(P)) ⇓ (P_1, r)    Γ ⊢ ParseMethodParams(P_1) ⇓ (P_2, params)    IsPunc(Tok(P_2), ")")    Γ ⊢ ParseReturnOpt(Advance(P_2)) ⇓ (P_3, ret_opt)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseMethodSignature(P) ⇓ (P_3, r, params, ret_opt)
```

**(Parse-StateMethodSignature-Receiver)**

```text
IsPunc(Tok(P), "(")    Γ ⊢ ParseReceiver(Advance(P)) ⇓ (P_1, r)    Γ ⊢ ParseMethodParams(P_1) ⇓ (P_2, params)    IsPunc(Tok(P_2), ")")    Γ ⊢ ParseReturnOpt(Advance(P_2)) ⇓ (P_3, ret_opt)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseStateMethodSignature(P) ⇓ (P_3, r, params, ret_opt)
```

**(Parse-MethodParams-None)**
IsPunc(Tok(P), ")")
────────────────────────────────────────────

```text
Γ ⊢ ParseMethodParams(P) ⇓ (P, [])
```

**(Parse-MethodParams-Comma)**

```text
IsPunc(Tok(P), ",")    Γ ⊢ ParseParamList(Advance(P)) ⇓ (P_1, params)
```

────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseMethodParams(P) ⇓ (P_1, params)
```

**(Parse-Receiver-Short-Const)**
IsOp(Tok(P), "~")
──────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseReceiver(P) ⇓ (Advance(P), ReceiverShorthand(`const`))
```

**(Parse-Receiver-Short-Unique)**
IsOp(Tok(P), "~!")
──────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseReceiver(P) ⇓ (Advance(P), ReceiverShorthand(`unique`))
```

**(Parse-Receiver-Short-Shared)**
IsOp(Tok(P), "~%")
──────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseReceiver(P) ⇓ (Advance(P), ReceiverShorthand(`shared`))
```

**(Parse-Receiver-Explicit)**

```text
Γ ⊢ ParseParamModeOpt(P) ⇓ (P_1, mode)    IsIdent(Tok(P_1))    Lexeme(Tok(P_1)) = `self`    IsPunc(Tok(Advance(P_1)), ":")    Γ ⊢ ParseType(Advance(Advance(P_1))) ⇓ (P_2, ty)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseReceiver(P) ⇓ (P_2, ReceiverExplicit(mode, ty))
```

#### 15.2.3 AST Representation / Form

```text
MethodDecl = ⟨attrs_opt, vis, override, name, gen_params_opt, receiver, params, return_type_opt, contract_opt, body, span, doc_opt⟩
Receiver ∈ {ReceiverShorthand(perm), ReceiverExplicit(mode_opt, type)}
perm ∈ {`const`, `unique`, `shared`}
mode_opt ∈ {`move`, ⊥}
```

```text
Fields(R) = [ f | f ∈ R.members ∧ f is FieldDecl ]
Methods(R) = [ m | m ∈ R.members ∧ m is MethodDecl ]
```

Self_R = TypePath(RecordPath(R))

```text
SelfType(R, ty) ⇔ ty = Self_R ∨ ∃ p. ty = TypePerm(p, Self_R)
```

RecvType(T, ReceiverShorthand(`const`)) = TypePerm(`const`, T)
RecvType(T, ReceiverShorthand(`unique`)) = TypePerm(`unique`, T)
RecvType(T, ReceiverShorthand(`shared`)) = TypePerm(`shared`, T)
RecvType(T, ReceiverExplicit(mode_opt, ty)) = SubstSelf(T, ty)

```text
RecvMode(ReceiverShorthand(_)) = ⊥
```

RecvMode(ReceiverExplicit(mode_opt, _)) = mode_opt

PermOf(TypePerm(p, _)) = p
PermOf(ty) = `const`    otherwise
RecvPerm(T, r) = PermOf(RecvType(T, r))

```text
ParamSig_T(T, params) = [⟨mode, SubstSelf(T, ty)⟩ | ⟨mode, name, ty⟩ ∈ params]
ParamBinds_T(T, params) = [⟨x_1, SubstSelf(T, T_1)⟩, …, ⟨x_n, SubstSelf(T, T_n)⟩]
```

ReturnType_T(T, m) = SubstSelf(T, ReturnType(m))

```text
Sig_T(T, m) = ⟨RecvType(T, m.receiver), ParamSig_T(T, m.params), SubstSelf(T, ReturnType(m))⟩
MethodParamsDecl(T, m) = [⟨RecvMode(m.receiver), `self`, RecvType(T, m.receiver)⟩] ++ m.params
```

#### 15.2.4 Static Semantics

**(Recv-Explicit)**
SelfType(R, ty)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ ReceiverExplicit(mode_opt, ty) : Recv(R, PermOf(ty), mode_opt)
```

**(Record-Method-RecvSelf-Err)**

```text
¬ SelfType(R, ty)
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ ReceiverExplicit(mode_opt, ty) ⇑
```

**(Recv-Const)**
────────────────────────────────────────────────────────────────

```text
Γ ⊢ ReceiverShorthand(`const`) : Recv(R, `const`, ⊥)
```

**(Recv-Unique)**
────────────────────────────────────────────────────────────────

```text
Γ ⊢ ReceiverShorthand(`unique`) : Recv(R, `unique`, ⊥)
```

**(Recv-Shared)**
────────────────────────────────────────────────────────────────

```text
Γ ⊢ ReceiverShorthand(`shared`) : Recv(R, `shared`, ⊥)
```

**(WF-Record-Method)**

```text
params_gen = TypeParamsOpt(gen_params_opt)    params_gen = [P_1, …, P_n]    Γ ⊢ ⟨P_1; …; P_n⟩ wf    Γ_m = BindTypeParams(Γ, params_gen)    Γ_m ⊢ r : Recv(R, P, mode)    self ∉ ParamNames(params)    Distinct(ParamNames(params))    ∀ ⟨_, _, T_i⟩ ∈ params, Γ_m ⊢ T_i wf    (return_type_opt = ⊥ ∨ Γ_m ⊢ return_type_opt wf)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ⟨MethodDecl, _, _, _, name, gen_params_opt, r, params, return_type_opt, _, body, _, _⟩ : MethodOK(R, P, mode)
```

**(T-Record-Method-Body)**

```text
Γ ⊢ m : MethodOK(R, P, mode)    T_self = RecvType(Self_R, m.receiver)    R_m = ReturnType_T(Self_R, m)    R_b = BodyReturnType(R_m)    Γ_0 = PushScope(Γ)    IntroAll(Γ_0, [⟨`self`, T_self⟩] ++ ParamBinds_T(Self_R, m.params)) ⇓ Γ_1    Γ_1; R_m; ⊥ ⊢ m.body : T_b    Γ ⊢ T_b <: R_b    (R_b ≠ TypePrim("()") ⇒ ExplicitReturn(m.body))
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ m : MethodBodyOK(R)
```

**(WF-Record-Methods)**

```text
Distinct(MethodNames(R))    ∀ m ∈ Methods(R), Γ ⊢ m : MethodOK(R, _, _)    Γ ⊢ m : MethodBodyOK(R)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Methods(R) : ok
```

**(Record-Method-Dup)**

```text
¬ Distinct(MethodNames(R))
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ Methods(R) ⇑
```

```text
ArgsOkJudg = {Γ; R; L ⊢ ArgsOk(params, args)}
```

```text
RecvBaseType(base, mode) = P T ⇔ (mode = ⊥ ∧ Γ; R; L ⊢ RefArgExpr(base) :place P T) ∨ (mode = `move` ∧ Γ; R; L ⊢ base : P T)
```

**(Args-Empty)**
──────────────────────────────────────────────

```text
Γ; R; L ⊢ ArgsOk([], [])
```

**(Args-Cons)**

```text
Γ; R; L ⊢ MovedArg(moved, e) ⇐ T_p ⊣ ∅    moved = true    Γ; R; L ⊢ ArgsOk(ps, as)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ ArgsOk([⟨`move`, x, T_p⟩] ++ ps, [⟨moved, e, _⟩] ++ as)
```

**(Args-Cons-Ref)**

```text
Γ; R; L ⊢ RefArgExpr(e) ⇐_place T_p    AddrOfOk(RefArgExpr(e))    moved = false    Γ; R; L ⊢ ArgsOk(ps, as)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ ArgsOk([⟨⊥, x, T_p⟩] ++ ps, [⟨moved, e, _⟩] ++ as)
```

```text
RecvArgOk(base, mode) ⇔ (mode = ⊥ ∧ AddrOfOk(RefArgExpr(base))) ∨ (mode = `move` ∧ ∃ p. base = MoveExpr(p))
```

**(T-Record-MethodCall)**

```text
RecvBaseType(base, RecvMode(m.receiver)) = P_caller R_rec    LookupMethod(R_rec, name) = m    RecvPerm(R_rec, m.receiver) = P_method    PermAdmits(P_caller, P_method)    RecvArgOk(base, RecvMode(m.receiver))    Γ; R; L ⊢ ArgsOk(m.params, args)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ MethodCall(base, name, args) : ReturnType(m)
```

Class and state-method owners (§14.3 and §13.3) add receiver restrictions specific to `Self` and modal-state receivers, but reuse these common receiver and argument-passing forms.

#### 15.2.5 Dynamic Semantics

```text
RecvArgMode(base) = `move` ⇔ ∃ p. base = MoveExpr(p)
RecvArgMode(base) = ⊥ ⇔ ¬ ∃ p. base = MoveExpr(p)
MethodOf(base, name) = md ⇔ StripPerm(ExprType(base)) = TypeModalState(modal_ref, S) ∧ ModalDeclOf(modal_ref) = M ∧ LookupStateMethod(M, S, name) = md
MethodOf(base, name) = tr ⇔ StripPerm(ExprType(base)) = TypeModalState(modal_ref, S) ∧ ModalDeclOf(modal_ref) = M ∧ LookupTransition(M, S, name) = tr
MethodOf(base, name) = m ⇔ LookupMethod(StripPerm(ExprType(base)), name) = m
RecvBase(base, name) = T ⇔ MethodOf(base, name) = m ∧ T = StripPerm(ExprType(base))
```

```text
RecvParams(base, name) = StateMethodParams(M, S, md) ⇔ StripPerm(ExprType(base)) = TypeModalState(modal_ref, S) ∧ ModalDeclOf(modal_ref) = M ∧ LookupStateMethod(M, S, name) = md
RecvParams(base, name) = TransitionParams(M, S, tr) ⇔ StripPerm(ExprType(base)) = TypeModalState(modal_ref, S) ∧ ModalDeclOf(modal_ref) = M ∧ LookupTransition(M, S, name) = tr
RecvParams(base, name) = [⟨RecvMode(m.receiver), `self`, RecvType(T, m.receiver)⟩] ++ m.params ⇔ LookupMethod(StripPerm(ExprType(base)), name) = m ∧ T = StripPerm(ExprType(base))
```

**(EvalRecvSigma-Move)**

```text
mode = `move`    Γ ⊢ EvalSigma(base, σ) ⇓ (Val(v_self), σ_1)
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalRecvSigma(base, mode, σ) ⇓ (Val(⟨v_self, v_self⟩), σ_1)
```

**(EvalRecvSigma-Ref-Dyn)**

```text
mode = ⊥    Γ ⊢ AddrOfSigma(RefArgExpr(base), σ) ⇓ (Val(addr), σ_1)    ReadAddr(σ_1, addr) = Dyn(Cl, RawPtr(`imm`, addr_d), T)    DynAddrState(σ_1, addr_d) = `Valid`
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalRecvSigma(base, mode, σ) ⇓ (Val(⟨Dyn(Cl, RawPtr(`imm`, addr_d), T), Alias(addr_d)⟩), σ_1)
```

**(EvalRecvSigma-Ref-Dyn-Expired)**

```text
mode = ⊥    Γ ⊢ AddrOfSigma(RefArgExpr(base), σ) ⇓ (Val(addr), σ_1)    ReadAddr(σ_1, addr) = Dyn(Cl, RawPtr(`imm`, addr_d), T)    DynAddrState(σ_1, addr_d) = `Expired`
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalRecvSigma(base, mode, σ) ⇓ (Ctrl(Panic), σ_1)
```

**(EvalRecvSigma-Ref)**

```text
mode = ⊥    Γ ⊢ AddrOfSigma(RefArgExpr(base), σ) ⇓ (Val(addr), σ_1)    ReadAddr(σ_1, addr) = v_self    ¬ (∃ Cl, addr_d, T. v_self = Dyn(Cl, RawPtr(`imm`, addr_d), T))
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalRecvSigma(base, mode, σ) ⇓ (Val(⟨v_self, Alias(addr)⟩), σ_1)
```

**(EvalRecvSigma-Ctrl-Move)**

```text
mode = `move`    Γ ⊢ EvalSigma(base, σ) ⇓ (Ctrl(κ), σ_1)
```

──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalRecvSigma(base, mode, σ) ⇓ (Ctrl(κ), σ_1)
```

**(EvalRecvSigma-Ctrl-Ref)**

```text
mode = ⊥    Γ ⊢ AddrOfSigma(RefArgExpr(base), σ) ⇓ (Ctrl(κ), σ_1)
```

──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalRecvSigma(base, mode, σ) ⇓ (Ctrl(κ), σ_1)
```

```text
BindParams(m, v_self, vecv) = {`self` ↦ v_self} ∪ { x_i ↦ v_i | m.params = [⟨_, x_i, _⟩], vecv = [v_i] }
```

**(ApplyMethodSigma-Prim)**

```text
m = MethodTarget(v_self, name)    MethodOwner(m) = owner    MethodName(m) = name    Γ ⊢ PrimCall(owner, name, v_self, vec_v) ⇓ out
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ApplyMethodSigma(base, name, v_self, v_arg, vec_v, σ) ⇓ (out, σ)
```

**(ApplyMethodSigma)**

```text
m = MethodTarget(v_self, name)    ¬IsTransition(m)    BindParams(RecvParams(base, name), [v_arg] ++ vec_v) = binds    BlockEnter(σ, binds) ⇓ (σ_1, scope)    Γ ⊢ EvalBlockBodySigma(m.body, σ_1) ⇓ (out, σ_2)    BlockExit(σ_2, scope, out) ⇓ (out', σ_3)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ApplyMethodSigma(base, name, v_self, v_arg, vec_v, σ) ⇓ (ReturnOut(out'), σ_3)
```

#### 15.2.6 Lowering

Methods lower as procedures whose first lowered parameter is the receiver.

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

#### 15.2.7 Diagnostics

Diagnostics are defined for explicit receivers whose type is not `Self` or a permission-qualified `Self`, duplicate method names, receiver-permission mismatches at call sites, invalid receiver passing mode, and direct user calls to the destructor protocol.

### 15.3 Overloading

#### 15.3.1 Syntax

No additional surface syntax is introduced beyond ordinary procedure and method declarations.

#### 15.3.2 Parsing

Overload resolution is not a parser concern in this chapter.

#### 15.3.3 AST Representation / Form

```text
ClassDefaults(T, name) = { m | ∃ Cl ∈ Implements(T). m ∈ ClassMethodTable(Cl) ∧ m.name = name ∧ m.body ≠ ⊥ }
LookupMethod(T, name) = m ⇔ MethodByName(T, name) = m
LookupMethod(T, name) = m ⇔ MethodByName(T, name) = ⊥ ∧ |ClassDefaults(T, name)| = 1 ∧ m ∈ ClassDefaults(T, name)
LookupMethod(T, name) = ⊥ ⇔ MethodByName(T, name) = ⊥ ∧ (|ClassDefaults(T, name)| = 0 ∨ |ClassDefaults(T, name)| > 1)
```

#### 15.3.4 Static Semantics

**(LookupMethod-NotFound)**

```text
Γ; R; L ⊢ base : T_b    MethodByName(StripPerm(T_b), name) = ⊥    ClassDefaults(StripPerm(T_b), name) = ∅
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ MethodCall(base, name, args) ⇑
```

**(LookupMethod-Ambig)**

```text
Γ; R; L ⊢ base : T_b    MethodByName(StripPerm(T_b), name) = ⊥    |ClassDefaults(StripPerm(T_b), name)| > 1
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ MethodCall(base, name, args) ⇑
```

Free-procedure overload resolution is complete before ordinary `Call` typing.

For a free call whose callee names an overload set `O`:

1. Candidate selection: retain procedures in `O` whose parameter count equals the argument count.
2. Type filtering: eliminate candidates for which any argument is incompatible with the corresponding parameter under the call-argument compatibility rules of §16.3.4.
3. Exact-match preference: if multiple candidates remain, retain those with the maximal number of exact argument-type matches.
4. Genericity preference: if both generic and non-generic candidates remain, retain only the non-generic candidates.
5. Constraint specificity: if multiple generic candidates remain, retain only those whose bounds and predicate requirements are pointwise at least as specific as every remaining alternative, with at least one strict improvement.
6. If exactly one candidate remains, that candidate is selected.
7. If no candidate remains, the call is ill-formed with `E-SEM-3031`.
8. If multiple candidates remain after all preference stages, the call is ill-formed with `E-SEM-3030`.

Two visible overloads with the same name MUST NOT have identical parameter-mode/type signatures after generic-parameter erasure. Such a declaration set is ill-formed with `E-SEM-3032`.

#### 15.3.5 Dynamic Semantics

When `LookupMethod(T, name) = m`, execution uses that unique method body. No runtime overload search is performed.

#### 15.3.6 Lowering

Overload resolution is complete before lowering. Lowering consumes the selected procedure or method symbol only.

#### 15.3.7 Diagnostics

| Code         | Severity | Detection    | Condition                           |
| ------------ | -------- | ------------ | ----------------------------------- |
| `E-SEM-3030` | Error    | Compile-time | Ambiguous overload resolution       |
| `E-SEM-3031` | Error    | Compile-time | No matching overload found          |
| `E-SEM-3032` | Error    | Compile-time | Duplicate signature in overload set |

Method lookup diagnostics remain defined for missing methods and ambiguous inherited-default method resolution.

### 15.4 Contract Clauses

#### 15.4.1 Syntax

```text
contract_clause    ::= "|:" contract_body
contract_body      ::= precondition_expr
                     | precondition_expr "=>" postcondition_expr
                     | "=>" postcondition_expr
precondition_expr  ::= predicate_expr
postcondition_expr ::= predicate_expr
```

#### 15.4.2 Parsing

`ForeignContractStart` is defined by §23.6.2 and is used here only to disambiguate ordinary contract clauses from foreign contract clauses.

**(Parse-ContractClauseOpt-None)**

```text
¬ IsOp(Tok(P), "|:") ∨ ForeignContractStart(P)
```

──────────────────────────────────────────────

```text
Γ ⊢ ParseContractClauseOpt(P) ⇓ (P, ⊥)
```

**(Parse-ContractClauseOpt-Yes)**

```text
IsOp(Tok(P), "|:")    Γ ⊢ ParseContractBody(Advance(P)) ⇓ (P_1, clause)
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseContractClauseOpt(P) ⇓ (P_1, clause)
```

**(Parse-ContractBody-PostOnly)**

```text
IsOp(Tok(P), "=>")    Γ ⊢ ParsePredicateExpr(Advance(P)) ⇓ (P_1, post)
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseContractBody(P) ⇓ (P_1, ⟨⊥, post⟩)
```

**(Parse-ContractBody-PrePost)**

```text
Γ ⊢ ParsePredicateExpr(P) ⇓ (P_1, pre)    IsOp(Tok(P_1), "=>")    Γ ⊢ ParsePredicateExpr(Advance(P_1)) ⇓ (P_2, post)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseContractBody(P) ⇓ (P_2, ⟨pre, post⟩)
```

**(Parse-ContractBody-PreOnly)**

```text
Γ ⊢ ParsePredicateExpr(P) ⇓ (P_1, pre)    ¬ IsOp(Tok(P_1), "=>")
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseContractBody(P) ⇓ (P_1, ⟨pre, ⊥⟩)
```

#### 15.4.3 AST Representation / Form

```text
ContractClause = ⟨pre, post⟩
contract_opt ∈ {⊥} ∪ ContractClause
```

#### 15.4.4 Static Semantics

**(WF-Contract)**

```text
Γ_pre ⊢ P_pre : `bool`    pure(P_pre)
Γ_post ⊢ P_post : `bool`    pure(P_post)
```

────────────────────────────────────────────────────────────

```text
Γ ⊢ `|:` P_pre ⇒ P_post : WF
```

The purity judgment for contract expressions is:

**(Pure-Literal)**

```text
v ∈ Literals
```

────────────────────────────────────────────────────────────

```text
Γ ⊢ LiteralExpr(v) pure
```

**(Pure-Ident)**

```text
Γ(x) = (T, _)
```

────────────────────────────────────────────────────────────

```text
Γ ⊢ Ident(x) pure
```

**(Pure-Field)**

```text
Γ ⊢ e pure
```

────────────────────────────────────────────────────────────

```text
Γ ⊢ FieldAccess(e, f) pure
```

**(Pure-Tuple-Access)**

```text
Γ ⊢ e pure
```

────────────────────────────────────────────────────────────

```text
Γ ⊢ TupleAccess(e, i) pure
```

**(Pure-Index)**

```text
Γ ⊢ e_1 pure    Γ ⊢ e_2 pure
```

────────────────────────────────────────────────────────────

```text
Γ ⊢ IndexAccess(e_1, e_2) pure
```

**(Pure-Unary)**

```text
Γ ⊢ e pure    op ∈ {`!`, `-`, `*`}
```

────────────────────────────────────────────────────────────

```text
Γ ⊢ UnaryExpr(op, e) pure
```

**(Pure-Binary)**

```text
Γ ⊢ e_1 pure    Γ ⊢ e_2 pure    op ∈ PureOps
```

────────────────────────────────────────────────────────────

```text
Γ ⊢ BinaryExpr(op, e_1, e_2) pure
```

PureOps = {`+`, `-`, `*`, `/`, `%`, `**`, `==`, `!=`, `<`, `<=`, `>`, `>=`, `&&`, `||`, `&`, `|`, `^`, `<<`, `>>`, `..`, `..=`}

**(Pure-Cast)**

```text
Γ ⊢ e pure
```

────────────────────────────────────────────────────────────

```text
Γ ⊢ CastExpr(e, T) pure
```

**(Pure-If)**

```text
Γ ⊢ e_cond pure    Γ ⊢ e_then pure    Γ ⊢ e_else pure
```

────────────────────────────────────────────────────────────

```text
Γ ⊢ IfExpr(e_cond, e_then, e_else) pure
```

**(Pure-If-Is)**

```text
Γ ⊢ e pure    Γ, PatternBindings(pat) ⊢ b_t pure    Γ ⊢ b_f pure
```

────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IfIsExpr(e, pat, b_t, b_f) pure
```

**(Pure-If-Is-No-Else)**

```text
Γ ⊢ e pure    Γ, PatternBindings(pat) ⊢ b_t pure
```

────────────────────────────────────────────────────────────

```text
Γ ⊢ IfIsExpr(e, pat, b_t, ⊥) pure
```

**(Pure-If-Case)**

```text
Γ ⊢ e pure    ∀ case ∈ cases. Γ, PatternBindings(case.pat) ⊢ case.body pure    Γ ⊢ b_f pure
```

──────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IfCaseExpr(e, cases, b_f) pure
```

**(Pure-If-Case-No-Else)**

```text
Γ ⊢ e pure    ∀ case ∈ cases. Γ, PatternBindings(case.pat) ⊢ case.body pure
```

────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IfCaseExpr(e, cases, ⊥) pure
```

**(Pure-Block)**

```text
∀ s ∈ stmts. Γ ⊢ s pure_stmt    Γ ⊢ e pure
```

────────────────────────────────────────────────────────────

```text
Γ ⊢ BlockExpr(stmts, e) pure
```

**(Pure-Tuple)**

```text
∀ i. Γ ⊢ e_i pure
```

────────────────────────────────────────────────────────────

```text
Γ ⊢ TupleExpr([e_1, …, e_n]) pure
```

**(Pure-Array)**

```text
∀ i. Γ ⊢ e_i pure
```

────────────────────────────────────────────────────────────

```text
Γ ⊢ ArrayExpr([e_1, …, e_n]) pure
```

**(Pure-Record)**

```text
∀ (f, e) ∈ fields. Γ ⊢ e pure
```

────────────────────────────────────────────────────────────

```text
Γ ⊢ RecordExpr(T, fields) pure
```

**(Pure-Call-Builtin)**

```text
Γ ⊢ e_1 pure    …    Γ ⊢ e_n pure    BuiltinPure(f)
```

────────────────────────────────────────────────────────────

```text
Γ ⊢ CallExpr(f, [e_1, …, e_n]) pure
```

**(Pure-Call-Procedure)**

```text
Γ ⊢ e_1 pure    …    Γ ⊢ e_n pure    ProcDecl(f) = P    ¬HasCapabilityParams(P)    IsPureProc(P)
```

────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CallExpr(f, [e_1, …, e_n]) pure
```

**(Pure-Method-Const)**

```text
Γ ⊢ e pure    Γ ⊢ e_1 pure    …    Γ ⊢ e_n pure    ReceiverPerm(m) = `const`    ¬HasCapabilityParams(m)    IsPureProc(m)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ MethodCallExpr(e, m, [e_1, …, e_n]) pure
```

**(Pure-Comptime)**

```text
ComptimeProc(f)    Γ ⊢ e_1 pure    …    Γ ⊢ e_n pure
```

────────────────────────────────────────────────────────────

```text
Γ ⊢ CallExpr(f, [e_1, …, e_n]) pure
```

**Helper Predicates**

```text
HasCapabilityParams(P) ⇔ ∃ param ∈ Params(P). IsCapabilityType(ParamType(param))
IsCapabilityType(T) ⇔ CapInType(T) ≠ ∅
ContainsCapability(T) ⇔ CapInType(T) ≠ ∅
BuiltinPure(f) ⇔ f ∈ {sizeof, alignof, type_name, …}
IsPureProc(P) ⇔ ∀ stmt ∈ Body(P). Γ ⊢ stmt pure_stmt ∧ ¬WritesGlobalState(P)
ComptimeProc(f) ⇔ HasAttribute(ProcDecl(f), `comptime`)
```

The following forms are never pure: assignment expressions, mutable method calls, allocation expressions, spawn/dispatch/parallel expressions, yield/wait expressions, procedure calls with capability parameters, and unsafe blocks.

```text
**Precondition Evaluation Context (Γ_pre)** includes the receiver binding (if present) and all procedure parameters at entry state. It excludes `@result`, `@entry`, module-scope bindings, enclosing locals, and body-local bindings.
```

```text
**Postcondition Evaluation Context (Γ_post)** includes the receiver, all procedure parameters, `@result`, and `@entry`. Mutable parameters and mutable receivers denote post-state values on the right of `=>`, while `@entry(...)` denotes entry-state values.
```

#### 15.4.5 Dynamic Semantics

Contract clauses themselves have no independent runtime effect. Their operational impact is through verification and inserted `ContractCheck` forms defined in §15.8.

#### 15.4.6 Lowering

No lowering is defined directly for a contract clause. Lowering consumes verification results and, when required, emits checks as defined in §15.8.

#### 15.4.7 Diagnostics

Diagnostics are defined for malformed contract clauses and for contract predicates that are ill-typed or impure.

### 15.5 Preconditions

#### 15.5.1 Syntax

The precondition is the expression to the left of `=>` in a contract clause, or the entire contract expression when `=>` is absent.

#### 15.5.2 Parsing

Preconditions are parsed as part of `ParseContractBody` in §15.4.2.

#### 15.5.3 AST Representation / Form

```text
PreconditionOf(contract_opt) = `true`             if contract_opt = ⊥
PreconditionOf(⟨pre, post⟩) = `true`              if pre = ⊥
PreconditionOf(⟨pre, post⟩) = pre                 if pre ≠ ⊥
```

#### 15.5.4 Static Semantics

Let `S_call` be the call-site program point for the invocation being checked.
In this section, the proof context symbol `Gamma_S` denotes the active
`ProofContextAt(S_call)` defined in SS15.8.4 after actual-parameter
substitution into the callee precondition.

**(Pre-Satisfied)**

```text
Γ ⊢ f : (T_1, …, T_n) → R    precondition(f) = P_pre    StaticProofAt(S_call, Γ_S, P_pre)
```

──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ f(a_1, …, a_n) @ S : valid
```

Elision rules:

| Contract Form      | Precondition |
| ------------------ | ------------ |
| `                  | : P`         | `P`    |
| `                  | : P => Q`    | `P`    |
| `                  | : => Q`      | `true` |
| no contract clause | `true`       |

The caller is responsible for satisfying the precondition.

#### 15.5.5 Dynamic Semantics

When runtime verification is selected, the precondition is evaluated before procedure body execution and before any `@entry` capture.

#### 15.5.6 Lowering

Precondition check insertion is defined by `Insert-Precondition-Check` in §15.8.6.

#### 15.5.7 Diagnostics

Diagnostics for unsatisfied preconditions are attached to the call site.

### 15.6 Postconditions

#### 15.6.1 Syntax

```text
postcondition_expr ::= predicate_expr
contract_intrinsic ::= "@result" | "@entry" "(" expression ")"
```

#### 15.6.2 Parsing

**(Parse-Contract-Result)**
IsOp(Tok(P), "@")    IsIdent(Tok(Advance(P)))    Lexeme(Tok(Advance(P))) = `result`
──────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePrimary(P) ⇓ (Advance(Advance(P)), ContractResult)
```

**(Parse-Contract-Entry)**

```text
IsOp(Tok(P), "@")    IsIdent(Tok(Advance(P)))    Lexeme(Tok(Advance(P))) = `entry`    IsPunc(Tok(Advance(Advance(P))), "(")    Γ ⊢ ParseExpr(Advance(Advance(Advance(P)))) ⇓ (P_1, e)    IsPunc(Tok(P_1), ")")
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePrimary(P) ⇓ (Advance(P_1), ContractEntry(e))
```

#### 15.6.3 AST Representation / Form

Expr = … | ContractResult | ContractEntry(expr) | …

```text
PostconditionOf(contract_opt) = `true`           if contract_opt = ⊥
PostconditionOf(⟨pre, post⟩) = `true`            if post = ⊥
PostconditionOf(⟨pre, post⟩) = post              if post ≠ ⊥
```

#### 15.6.4 Static Semantics

Let `ProofContextAt(r)` denote the active proof context at return point `r` as
defined in SS15.8.4. Postcondition verification at `r` is performed after
binding `@result` to the returned value and uses that proof context.

**(Post-Valid)**

```text
postcondition(f) = P_post    ∀ r ∈ ReturnPoints(f). Γ_r ⊢ P_post : satisfied
```

───────────────────────────────────────────────────────────────────────────
f : postcondition-valid

Elision rules:

| Contract Form      | Postcondition |
| ------------------ | ------------- |
| `                  | : P`          | `true` |
| `                  | : P => Q`     | `Q`    |
| `                  | : => Q`       | `Q`    |
| no contract clause | `true`        |

Properties of `@result`:

1. It is available only in postcondition expressions.
2. Its type is the declared return type of the enclosing procedure.
3. For unit-returning procedures, `@result` has type `()`.

**(Result-Union-Type)**
ReturnType(f) = T_1 | T_2 | ... | T_n
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ_post ⊢ @result : T_1 | T_2 | ... | T_n
```

**(Result-Is-Predicate)**

```text
Γ_post ⊢ @result : T_union    T_variant ∈ Variants(T_union)
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ_post ⊢ (@result is T_variant) : bool
```

**(Result-Narrowing)**

```text
(@result is T_variant) = true    Γ_post ⊢ @result : T_union
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ_post ⊢ @result as T_variant : T_variant
```

**(Propagate-Postcondition)**
e? propagates error e_err at program point p    ReturnType(f) = T_success | T_error
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Postconditions are evaluated for the propagation return at p with @result bound to e_err

**(Result-Modal)**
ReturnType(f) = M@S
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ_post ⊢ @result : M@S
```

**(Result-Generic)**
ReturnType(f) = T    T is a type parameter
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ_post ⊢ @result : T
```

**(Result-Generic-Constraint)**
@result op e in postcondition    op requires class C    T is return type parameter
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
T <: C required in procedure signature

`@entry(expr)` constraints:

1. It is available only in postcondition expressions.
2. `expr` MUST be pure.
3. `expr` MUST reference only parameters and the receiver.
4. The result type of `expr` MUST satisfy `BitcopyType`.

**(Entry-Type)**

```text
Γ_post ⊢ e : T    BitcopyType(T)
```

────────────────────────────────────────────────────────

```text
Γ_post ⊢ @entry(e) : T
```

#### 15.6.5 Dynamic Semantics

At each return point `r` with returned value `v_r`, postconditions are evaluated with `@result` bound to `v_r`.

When `@entry(expr)` appears in a postcondition:

1. `expr` is evaluated immediately after parameter binding and successful precondition checking.
2. The result is captured by bitwise copy.
3. Every postcondition check for the invocation reuses the captured value.

Entry-capture timing:

1. Parameter Binding
2. Precondition Check
3. `@entry` Capture
4. Body Execution
5. Postcondition Check
6. Return

**(EntryCapturePhase)**

```text
entries = CollectEntryExprs(postcondition(f))    ∀ e_i ∈ entries. Γ_pre ⊢ EvalSigma(e_i, σ_entry) ⇓ (Val(v_i), σ_entry)
captures = { e_i ↦ Capture(v_i, T_i) | e_i ∈ entries }
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
EntryCapturePhase(f, σ_entry) = (captures, σ_entry)
```

Capture(v, T) = v    if BitcopyType(T)

#### 15.6.6 Lowering

No standalone representation change is introduced by postconditions. Lowering preserves captured `@entry` values only as inputs to inserted `Post` checks from §15.8.6.

#### 15.6.7 Diagnostics

Diagnostics are defined for `@result` outside postconditions, `@entry` expressions whose type is not `BitcopyType`, `@entry` expressions with side effects or capability requirements, and `@entry` references to moved parameters.

### 15.7 Invariants

#### 15.7.1 Syntax

```text
type_invariant ::= "|:" "{" predicate_expr "}"
loop_invariant ::= "|:" "{" predicate_expr "}"
```

#### 15.7.2 Parsing

**(Parse-InvariantOpt-None)**

```text
¬ (IsOp(Tok(P), "|:") ∧ IsPunc(Tok(Advance(P)), "{"))
```

──────────────────────────────────────────────

```text
Γ ⊢ ParseInvariantOpt(P) ⇓ (P, ⊥)
```

**(Parse-InvariantOpt-Yes)**

```text
IsOp(Tok(P), "|:")    IsPunc(Tok(Advance(P)), "{")    Γ ⊢ ParsePredicateExpr(Advance(Advance(P))) ⇓ (P_1, pred)    IsPunc(Tok(P_1), "}")
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseInvariantOpt(P) ⇓ (Advance(P_1), pred)
```

```text
ParseLoopInvariantOpt(P) ⇓ (P_1, inv_opt) ⇔ Γ ⊢ ParseInvariantOpt(P) ⇓ (P_1, inv_opt)
```

#### 15.7.3 AST Representation / Form

Invariant = Expr

```text
invariant_opt ∈ {⊥} ∪ Invariant
```

```text
RecordDecl = ⟨attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, implements, members, invariant_opt, span, doc⟩
EnumDecl = ⟨attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, implements, variants, invariant_opt, span, doc⟩
ModalDecl = ⟨attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, implements, states, invariant_opt, span, doc⟩
```

Loop forms preserve `inv_opt` in their AST representation.

#### 15.7.4 Static Semantics

Type invariant context:

1. `self` denotes an instance of the type being defined.
2. Field access on `self` is permitted.
3. Method calls on `self` are permitted only when the method is pure.

Type invariant enforcement points:

1. Post-construction.
2. Before any public receiver-taking procedure call.
3. Before any mutating receiver-taking procedure returns.

Types with type invariants MUST NOT declare public mutable fields.

Private procedures are exempt from the pre-call enforcement point; the invariant is rechecked when control returns to a public caller.

Loop invariant enforcement points:

1. Before the first iteration.
2. At the start of every subsequent iteration.
3. Immediately after loop termination.

Upon successful termination verification, the implementation generates a verification fact for the invariant at loop exit.

Invariant verification follows the same verification-mode rules as contracts in §15.8.

#### 15.7.5 Dynamic Semantics

When runtime verification is selected, type invariants are checked at their enforcement points and loop invariants are checked at loop entry and every back-edge, including `continue` paths.

#### 15.7.6 Lowering

Lowering preserves every loop `inv_opt` and emits invariant checks only through the insertion rules of §15.8.6.

#### 15.7.7 Diagnostics

Diagnostics are defined for invariant predicates that are ill-formed, for types with invariants that expose public mutable fields, and for invariant obligations that fail static or dynamic verification.

### 15.8 Verification Logic

#### 15.8.1 Syntax

No surface syntax is introduced by the verification framework.

#### 15.8.2 Parsing

Verification logic is not parser-owned.

#### 15.8.3 AST Representation / Form

ContractKind = {Pre, Post, TypeInv, LoopInv, ForeignPre, ForeignPost}

VerificationFact = F(P, L, S)

```text
CheckState = {CheckStart(P, k, s, ρ, σ), CheckDone(σ), CheckPanic(σ)}
```

ContractCheck(P, k, s, ρ) = `if` !P[ρ] { `panic`(ContractViolation(k, P, s)) }

#### 15.8.4 Static Semantics

```text
DynamicScope(s) ⇔ (∃ d. DynamicDecl(d) ∧ s ⊆ d.span) ∨ (∃ e. DynamicExpr(e) ∧ s ⊆ ExprSpan(e))
InDynamicContext ⇔ DynamicScope(s) where `s` is the span of the syntactic form currently being verified or type-checked.
```

ComputeDynamicContext(s, ancestors) =
  let enclosing_dynamic = FindInnermostDynamic(s, ancestors)
  match enclosing_dynamic {

```text
    ⊥       → false
    Some(_) → true
```

  }

**(Contract-Static-OK)**

```text
StaticProofAt(S, Γ_S, P)
```

──────────────────────────────────────────────
P : verified

**(Contract-Static-Fail)**

```text
¬ StaticProofAt(S, Γ_S, P)    ¬ InDynamicContext
```

──────────────────────────────────────────────
program is ill-formed

**(Contract-Dynamic-Elide)**

```text
StaticProofAt(S, Γ_S, P)
```

──────────────────────────────────────────────
P : verified

**(Contract-Dynamic-Check)**

```text
¬ StaticProofAt(S, Γ_S, P)    InDynamicContext
```

────────────────────────────────────────────────────
emit runtime check ContractCheck(P, k, s, ρ)

Mandatory proof techniques:

1. Constant propagation
2. Linear integer reasoning
3. Boolean algebra
4. Control flow analysis
5. Type-derived bounds
6. Verification facts

For this section, `Gamma_S` denotes the active proof context at program point
`S`, written `ProofContextAt(S)`.

```text
Let `FlowFactsAt(S) = { P | F(P, L) ∈ Facts ∧ L dom S }`.
```

Let `ContractFactsAt(S)` be the set of conjuncts imported from the enclosing
procedure contract precondition that remain in scope at `S`.

```text
Let `ProofContextAt(S) = FlowFactsAt(S) ∪ ContractFactsAt(S)`.
```

`Decidable(P)` is the smallest set closed under:

1. `true`, `false`
2. Comparisons of linear integer expressions over literals and variables
3. Syntactic equality up to alpha-renaming between identifiers and literal constants
4. Boolean combinations using `!`, `&&`, `||`

Entailment:

**(Ent-True)**
P ≡ `true`
──────────────────────────────

```text
ProofContextAt(S) ⊢ P
```

**(Ent-Fact)**

```text
P ∈ ProofContextAt(S)
```

──────────────────────────────

```text
ProofContextAt(S) ⊢ P
```

**(Ent-And)**

```text
ProofContextAt(S) ⊢ P    ProofContextAt(S) ⊢ Q
```

────────────────────────────────────────

```text
ProofContextAt(S) ⊢ P ∧ Q
```

**(Ent-Or-L)**

```text
ProofContextAt(S) ⊢ P
```

────────────────────────

```text
ProofContextAt(S) ⊢ P ∨ Q
```

**(Ent-Or-R)**

```text
ProofContextAt(S) ⊢ Q
```

────────────────────────

```text
ProofContextAt(S) ⊢ P ∨ Q
```

**(Ent-Linear)**
LinearEntails(ProofContextAt(S), P)
─────────────────────────────

```text
ProofContextAt(S) ⊢ P
```

**Linear Integer Entailment**

```text
Let `LinExpr` be expressions of the form `∑_i a_i x_i + c` where `a_i, c ∈ ℤ` and each `x_i` is an integer-typed variable.
```

Let `LinPred` be predicates comparing two `LinExpr` with `==`, `!=`, `<`, `<=`, `>`, or `>=`.

```text
Define `LinFactsAt(S) = { P ∈ ProofContextAt(S) | P ∈ LinPred }`.
```

Then:

```text
LinearEntails(ProofContextAt(S), P) ⇔ P ∈ LinPred ∧ ⋀ LinFactsAt(S) ⊨_ℤ P
```

Implementations MAY use any sound decision procedure; they MUST be complete for `LinPred` entailment.

```text
StaticProofAt(S, ProofContextAt(S), P) ⇔ Decidable(P) ∧ ProofContextAt(S) ⊢ P
```

Define `NegFact(P)` on simple decidable predicates by:

1. `NegFact(!P) = P`
2. `NegFact(a < b) = (a >= b)`
3. `NegFact(a <= b) = (a > b)`
4. `NegFact(a > b) = (a <= b)`
5. `NegFact(a >= b) = (a < b)`
6. `NegFact(a == b) = (a != b)`
7. `NegFact(a != b) = (a == b)`
8. `NegFact(P)` is undefined otherwise

Verification facts:

1. Have zero runtime size.
2. Have no runtime representation.
3. MUST NOT be stored, passed, or returned.

**(Fact-Dominate)**

```text
F(P, L) ∈ Facts    L dom S    L ≠ S
```

────────────────────────────────────
P satisfied at S

Fact generation:

1. `if P { ... }` generates `F(P, _)` on then-branch entry.
2. `if P { ... } else { ... }` generates `F(NegFact(P), _)` on else-branch
   entry whenever `NegFact(P)` is defined.
3. `if P { return ... }`, `if P { break ... }`, and `if P { continue ... }`
   generate `F(NegFact(P), _)` on the subsequent fallthrough path whenever
   `NegFact(P)` is defined.
4. A satisfied `if ... is` pattern generates pattern facts on selected-body entry.
5. A runtime check for `P` generates `F(P, _)` after the check.
6. A verified loop invariant generates `F(Inv, _)` after the loop.

Type narrowing under an active fact `F(P, L)` refines `typeof(x)` to `typeof(x) |: {P}`.

#### 15.8.5 Dynamic Semantics

Contract environments:

1. `ρ_emptyset = ∅`
2. `ρ_post = EntryCapture(f, σ_entry) ∪ { @result ↦ v_r }`
3. `ρ_foreign_post = { @result ↦ v_r }`

**(Check-True)**

```text
Γ ⊢ EvalSigma(P[ρ], σ) ⇓ (Val(true), σ')
```

──────────────────────────────────────────────────────────────────────────────

```text
⟨CheckStart(P, k, s, ρ, σ)⟩ → ⟨CheckDone(σ')⟩
```

**(Check-False)**

```text
Γ ⊢ EvalSigma(P[ρ], σ) ⇓ (Val(false), σ')
```

───────────────────────────────────────────────────────────────────────────────

```text
⟨CheckStart(P, k, s, ρ, σ)⟩ → ⟨CheckPanic(σ')⟩
```

**(Check-Panic)**

```text
Γ ⊢ EvalSigma(P[ρ], σ) ⇓ (Ctrl(Panic), σ')
```

──────────────────────────────────────────────────────────────────────────────

```text
⟨CheckStart(P, k, s, ρ, σ)⟩ → ⟨CheckPanic(σ')⟩
```

**(Check-Ok)**

```text
⟨CheckStart(P, k, s, ρ, σ)⟩ →* ⟨CheckDone(σ')⟩
```

───────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ContractCheck(P, k, s, ρ, σ) ⇓ σ'
```

**(Check-Fail)**

```text
⟨CheckStart(P, k, s, ρ, σ)⟩ →* ⟨CheckPanic(σ')⟩
```

───────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ContractCheck(P, k, s, ρ, σ) ⇑ panic
```

Successful dynamic checks inject the corresponding verification fact after the inserted check.

#### 15.8.6 Lowering

Runtime check insertion points:

**(Insert-Precondition-Check)**

```text
f has contract |: P    InDynamicContext(f)    ¬ StaticProof(Γ_entry, P)
```

────────────────────────────────────────────────────────────────────────────────────────
At entry to f, insert: ContractCheck(P, Pre, span(contract), ρ_emptyset)

**(Insert-Postcondition-Check)**

```text
f has contract |: P_pre => P_post    InDynamicContext(f)    ¬ StaticProof(Γ_exit, P_post)
```

────────────────────────────────────────────────────────────────────────────────────────────────
Before each return from f with value v, insert: ContractCheck(P_post, Post, span(contract), ρ_post)

**(Insert-TypeInv-Construction-Check)**

```text
T has invariant |: {P}    InDynamicContext(construction_site)    ¬ StaticProof(Γ, P[v/self])
```

────────────────────────────────────────────────────────────────────────────────────────────────────
After constructing value v of type T, insert: ContractCheck(P[v/self], TypeInv, span(invariant), ρ_emptyset)

**(Insert-TypeInv-PreCall-Check)**

```text
T has invariant |: {P}    m is public method with receiver ~    InDynamicContext(call_site)    ¬ StaticProof(Γ, P[self/self])
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Before call to self~>m(...), insert: ContractCheck(P, TypeInv, span(invariant), ρ_emptyset)

**(Insert-TypeInv-PostCall-Check)**

```text
T has invariant |: {P}    m is method with receiver ~!    InDynamicContext(call_site)    ¬ StaticProof(Γ, P[self/self])
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
After return from self~>m(...), insert: ContractCheck(P, TypeInv, span(invariant), ρ_emptyset)

**(Insert-LoopInv-Init-Check)**

```text
loop ... |: {I}    InDynamicContext(loop_site)    ¬ StaticProof(Γ_loop_entry, I)
```

────────────────────────────────────────────────────────────────────────────────────────────
Before first iteration, insert: ContractCheck(I, LoopInv, span(invariant), ρ_emptyset)

**(Insert-LoopInv-Maintenance-Check)**

```text
loop ... |: {I}    InDynamicContext(loop_site)    ¬ StaticProof(Γ_loop_body_exit, I)
```

────────────────────────────────────────────────────────────────────────────────────────────────────
At end of each iteration, insert: ContractCheck(I, LoopInv, span(invariant), ρ_emptyset)

**(Insert-Refinement-Check)**

```text
e : T |: {P}    InDynamicContext(e)    ¬ StaticProof(Γ, P[e/self])
```

────────────────────────────────────────────────────────────────────────────────────────────
After evaluating e, insert: ContractCheck(P[e/self], TypeInv, span(refinement), ρ_emptyset)

#### 15.8.7 Diagnostics

Diagnostics are defined for predicates that fail required static proof outside dynamic context and for runtime contract-check failures, including panic payload construction from the contract kind, predicate text, and source span.

### 15.9 Behavioral Subtyping

#### 15.9.1 Syntax

No additional surface syntax is introduced.

#### 15.9.2 Parsing

Behavioral subtyping is not parser-owned.

#### 15.9.3 AST Representation / Form

Behavioral subtyping constrains the relationship between a class procedure contract and the implementing procedure contract for the same logical operation.

#### 15.9.4 Static Semantics

When a type implements a class, its procedure implementations MUST satisfy the Liskov substitution principle with respect to the class-defined contracts.

Precondition rule:

1. An implementation MAY weaken the class precondition.
2. An implementation MUST NOT strengthen the class precondition.

Postcondition rule:

1. An implementation MAY strengthen the class postcondition.
2. An implementation MUST NOT weaken the class postcondition.

Verification strategy:

1. Statically verify that the class precondition implies the implementation precondition.
2. Statically verify that the implementation postcondition implies the class postcondition.

No runtime checks are generated for behavioral-subtyping obligations.

#### 15.9.5 Dynamic Semantics

Behavioral subtyping introduces no runtime semantics beyond the contracts already enforced or proven for the selected implementation.

#### 15.9.6 Lowering

Lowering assumes behavioral-subtyping obligations have already been discharged statically and emits no extra checks for them.

#### 15.9.7 Diagnostics

Diagnostics are defined for implementations that strengthen class preconditions or weaken class postconditions.

### 15.10 Procedure, Contract, and Entry Diagnostics Supplement

This section owns diagnostics for procedure declarations, receiver constraints, `main`, and contract verification obligations.

| Code         | Severity | Detection    | Condition                                                                          |
| ------------ | -------- | ------------ | ---------------------------------------------------------------------------------- |
| `E-TYP-1507` | Error    | Compile-time | Procedure with non-unit return type requires explicit return statement             |
| `E-TYP-1912` | Error    | Compile-time | Explicit receiver type must be `Self` for record methods                           |
| `E-MOD-2411` | Error    | Compile-time | Missing move expression at call site for transferring provenance-bearing parameter |
| `E-MOD-2430` | Error    | Compile-time | Multiple `main` procedures defined                                                 |
| `E-MOD-2431` | Error    | Compile-time | Invalid `main` signature                                                           |
| `E-MOD-2432` | Error    | Compile-time | `main` is generic (has type parameters)                                            |
| `E-MOD-2434` | Error    | Compile-time | Missing `main` procedure                                                           |
| `E-CON-0415` | Error    | Compile-time | Capability-requiring operation in `@entry` expression                              |
| `E-CON-0416` | Error    | Compile-time | Side-effecting operation in `@entry` expression                                    |
| `P-SEM-2850` | Panic    | Runtime      | Contract predicate failed at runtime                                               |
| `E-SEM-2801` | Error    | Compile-time | Contract predicate not provable outside `[[dynamic]]` scope                        |
| `E-SEM-2802` | Error    | Compile-time | Impure expression in contract predicate                                            |
| `E-SEM-2803` | Error    | Compile-time | Implementation strengthens class precondition                                      |
| `E-SEM-2804` | Error    | Compile-time | Implementation weakens class postcondition                                         |
| `E-SEM-2805` | Error    | Compile-time | `@entry()` result type not `BitcopyType`                                           |
| `E-SEM-2806` | Error    | Compile-time | `@result` used outside postcondition                                               |
| `E-SEM-2807` | Error    | Compile-time | `@entry()` references parameter whose value is unavailable after binding           |
| `E-SEM-2820` | Error    | Compile-time | Type invariant violated at construction                                            |
| `E-SEM-2821` | Error    | Compile-time | Type invariant violated at public entry                                            |
| `E-SEM-2822` | Error    | Compile-time | Type invariant violated at mutator return                                          |
| `E-SEM-2823` | Error    | Compile-time | Type invariant violated at private-to-public return                                |
| `E-SEM-2824` | Error    | Compile-time | Public mutable field on type with invariant                                        |
| `E-SEM-2830` | Error    | Compile-time | Loop invariant not established at initialization                                   |
| `E-SEM-2831` | Error    | Compile-time | Loop invariant not maintained across iteration                                     |
| `E-SEM-3004` | Error    | Compile-time | Impure expression in contract clause                                               |
