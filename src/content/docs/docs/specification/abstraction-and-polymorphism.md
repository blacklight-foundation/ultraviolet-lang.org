---
title: "Abstraction and Polymorphism"
description: "14. Abstraction and Polymorphism of the Ultraviolet language specification."
specSource: "../../Ultraviolet/SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T13:48:04.933Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## 14. Abstraction and Polymorphism

### 14.1 Generic Parameters and Arguments

#### 14.1.1 Syntax

```text
```

generic_params       ::= "<" generic_param (";" generic_param)* ">"
generic_param        ::= identifier ("<:" class_bound ("," class_bound)*)? ("=" type)?
generic_args         ::= "<" type ("," type)* ","? ">"
predicate_clause     ::= "|:" predicate_req (terminator predicate_req)* terminator?
predicate_req        ::= ("Bitcopy" | "Clone" | "Drop" | "FfiSafe") "(" type ")"
```

Trailing commas in `generic_args` are permitted only when `TrailingCommaAllowed` (§5.5). A trailing comma does not denote an additional type argument.

Inline bounds introduced by `<:` are class bounds only. Predicate requirements belong to `predicate_clause`.

#### 14.1.2 Parsing

**(Parse-GenericArgs)**

```text
IsOp(Tok(P), "<")    Γ ⊢ ParseTypeList(Advance(P)) ⇓ (P_1, args)    IsOp(Tok(P_1), ">")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseGenericArgs(P) ⇓ (Advance(P_1), args)

**(Parse-GenericArgsOpt-None)**
¬ IsOp(Tok(P), "<")
──────────────────────────────────────────────

```text
Γ ⊢ ParseGenericArgsOpt(P) ⇓ (P, ⊥)

**(Parse-GenericArgsOpt-Yes)**

```text
Γ ⊢ ParseGenericArgs(P) ⇓ (P_1, args)
──────────────────────────────────────────────

```text
Γ ⊢ ParseGenericArgsOpt(P) ⇓ (P_1, args)

**(Parse-GenericParamsOpt-None)**
¬ IsOp(Tok(P), "<")
──────────────────────────────────────────────

```text
Γ ⊢ ParseGenericParamsOpt(P) ⇓ (P, ⊥)

**(Parse-GenericParamsOpt-Yes)**

```text
Γ ⊢ ParseGenericParams(P) ⇓ (P_1, params)
──────────────────────────────────────────────

```text
Γ ⊢ ParseGenericParamsOpt(P) ⇓ (P_1, params)

**(Parse-GenericParams)**

```text
IsOp(Tok(P), "<")    Γ ⊢ ParseTypeParam(Advance(P)) ⇓ (P_1, p_1)    Γ ⊢ ParseTypeParamTail(P_1, [p_1]) ⇓ (P_2, ps)    IsOp(Tok(P_2), ">")
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseGenericParams(P) ⇓ (Advance(P_2), ps)

**(Parse-TypeParamTail-End)**
¬ IsPunc(Tok(P), ";")
──────────────────────────────────────────────

```text
Γ ⊢ ParseTypeParamTail(P, ps) ⇓ (P, ps)

**(Parse-TypeParamTail-Cons)**

```text
IsPunc(Tok(P), ";")    Γ ⊢ ParseTypeParam(Advance(P)) ⇓ (P_1, p)    Γ ⊢ ParseTypeParamTail(P_1, ps ++ [p]) ⇓ (P_2, ps')
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseTypeParamTail(P, ps) ⇓ (P_2, ps')

**(Parse-TypeParam)**

```text
Γ ⊢ ParseIdent(P) ⇓ (P_1, name)    Γ ⊢ ParseTypeBoundsOpt(P_1) ⇓ (P_2, bounds)    Γ ⊢ ParseTypeDefaultOpt(P_2) ⇓ (P_3, default_opt)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseTypeParam(P) ⇓ (P_3, ⟨name, bounds, default_opt, ⊥⟩)

**(Parse-TypeBoundsOpt-None)**
¬ IsOp(Tok(P), "<:")
──────────────────────────────────────────────

```text
Γ ⊢ ParseTypeBoundsOpt(P) ⇓ (P, [])

**(Parse-TypeBoundsOpt-Yes)**

```text
IsOp(Tok(P), "<:")    Γ ⊢ ParseClassBoundList(Advance(P)) ⇓ (P_1, bounds)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseTypeBoundsOpt(P) ⇓ (P_1, bounds)

**(Parse-ClassBoundList-Cons)**

```text
Γ ⊢ ParseClassBound(P) ⇓ (P_1, b_1)    Γ ⊢ ParseClassBoundListTail(P_1, [b_1]) ⇓ (P_2, bs)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseClassBoundList(P) ⇓ (P_2, bs)

**(Parse-ClassBoundListTail-End)**
¬ IsPunc(Tok(P), ",")
──────────────────────────────────────────────

```text
Γ ⊢ ParseClassBoundListTail(P, bs) ⇓ (P, bs)

**(Parse-ClassBoundListTail-Cons)**

```text
IsPunc(Tok(P), ",")    Γ ⊢ ParseClassBound(Advance(P)) ⇓ (P_1, b)    Γ ⊢ ParseClassBoundListTail(P_1, bs ++ [b]) ⇓ (P_2, bs')
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseClassBoundListTail(P, bs) ⇓ (P_2, bs')

**(Parse-ClassBound)**

```text
Γ ⊢ ParseTypePath(P) ⇓ (P_1, path)    Γ ⊢ ParseGenericArgsOpt(P_1) ⇓ (P_2, args_opt)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseClassBound(P) ⇓ (P_2, ⟨path, args_opt⟩)

**(Parse-TypeDefaultOpt-None)**
¬ IsOp(Tok(P), "=")
──────────────────────────────────────────────

```text
Γ ⊢ ParseTypeDefaultOpt(P) ⇓ (P, ⊥)

**(Parse-TypeDefaultOpt-Yes)**

```text
IsOp(Tok(P), "=")    Γ ⊢ ParseType(Advance(P)) ⇓ (P_1, ty)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseTypeDefaultOpt(P) ⇓ (P_1, ty)

**(Parse-PredicateClauseOpt-None)**
¬ IsOp(Tok(P), "|:") ∨ IsPunc(Tok(Advance(P)), "{")
──────────────────────────────────────────────

```text
Γ ⊢ ParsePredicateClauseOpt(P) ⇓ (P, ⊥)

**(Parse-PredicateClauseOpt-Yes)**

```text
IsOp(Tok(P), "|:")    ¬ IsPunc(Tok(Advance(P)), "{")    Γ ⊢ ParsePredicateReqList(Advance(P)) ⇓ (P_1, preds)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePredicateClauseOpt(P) ⇓ (P_1, preds)

**(Parse-PredicateReqList-Cons)**

```text
Γ ⊢ ParsePredicateReq(P) ⇓ (P_1, p)    Γ ⊢ ParsePredicateReqListTail(P_1, [p]) ⇓ (P_2, ps)
────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePredicateReqList(P) ⇓ (P_2, ps)

**(Parse-PredicateReqListTail-End)**
¬ IsTerminator(Tok(P))
──────────────────────────────────────────────

```text
Γ ⊢ ParsePredicateReqListTail(P, ps) ⇓ (P, ps)

**(Parse-PredicateReqListTail-TrailingTerminator)**
IsTerminator(Tok(P))    ¬ IsIdent(Tok(Advance(P)))
────────────────────────────────────────────────────

```text
Γ ⊢ ParsePredicateReqListTail(P, ps) ⇓ (Advance(P), ps)

**(Parse-PredicateReqListTail-Cons)**

```text
IsTerminator(Tok(P))    Γ ⊢ ParsePredicateReq(Advance(P)) ⇓ (P_1, p)    Γ ⊢ ParsePredicateReqListTail(P_1, ps ++ [p]) ⇓ (P_2, ps')
──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePredicateReqListTail(P, ps) ⇓ (P_2, ps')

```text
IsPredName(name) ⇔ name ∈ {`Bitcopy`, `Clone`, `Drop`, `FfiSafe`}

**(Parse-PredicateReq-Predicate)**

```text
Γ ⊢ ParseIdent(P) ⇓ (P_1, name)    IsPredName(name)    IsPunc(Tok(P_1), "(")    Γ ⊢ ParseType(Advance(P_1)) ⇓ (P_2, ty)    IsPunc(Tok(P_2), ")")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePredicateReq(P) ⇓ (Advance(P_2), PredicateReq(name, ty))

**(Parse-PredicateReq-Err)**

```text
Γ ⊢ ParseIdent(P) ⇓ (P_1, name)    ¬ (IsPredName(name) ∧ IsPunc(Tok(P_1), "("))
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePredicateReq(P) ⇓ (P_1, PredicateReq(name, TypePrim("!")))

#### 14.1.3 AST Representation / Form

Variance = {Covariant, Contravariant, Invariant, Bivariant}

```text
TypeParam = ⟨name, bounds, default_opt, variance⟩
GenericParams = [TypeParam]
GenericArgs = [Type]

PredicateName = {`Bitcopy`, `Clone`, `Drop`, `FfiSafe`}

```text
PredicateReq = ⟨pred, type⟩
PredicateClause = [PredicateReq]

```text
TypeParamsOpt(⊥) = []
TypeParamsOpt(ps) = ps

```text
PredicateReqs(⊥) = []
PredicateReqs(W) = W

```text
TypeParamNames(params) = [p.name | p ∈ params]

```text
BindTypeParams(Γ, params) = Γ, T_1 : P_1, …, T_n : P_n    iff params = [P_1, …, P_n] ∧ ∀ i. T_i = P_i.name

#### 14.1.4 Static Semantics

```text
DefaultSuffix(params) ⇔ ∀ i < j. (params[i].default_opt ≠ ⊥ ⇒ params[j].default_opt ≠ ⊥)

```text
DefaultRefsOk(params) ⇔ ∀ i. params[i].default_opt = T_i ⇒ TypeParamsIn(T_i, params) ⊆ {params[j].name | j < i}

```text
DefaultWF(Γ, params) ⇔ ∀ i. params[i].default_opt = T_i ⇒ (Γ_i ⊢ T_i wf ∧ Γ_i ⊢ T_i satisfies Bounds(params[i])) where Γ_i = BindTypeParams(Γ, [params[j] | j < i])

**(WF-Generic-Param)**

```text
∀ i ≠ j, name_i ≠ name_j    ∀ i, ∀ B ∈ Bounds_i, Γ ⊢ B : ClassPath    DefaultSuffix([P_1, …, P_n])    DefaultRefsOk([P_1, …, P_n])    DefaultWF(Γ, [P_1, …, P_n])
──────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ⟨P_1; …; P_n⟩ wf

```text
DefaultArgs(params, args) = args' ⇔ params = [P_1, …, P_n] ∧ args = [A_1, …, A_k] ∧ k ≤ n ∧

```text
  (∀ i ≤ k. A_i' = A_i) ∧

```text
  (∀ i ∈ k+1..n. P_i.default_opt = T_i ∧ A_i' = TypeSubst([A_1'/P_1.name, …, A_{i-1}'/P_{i-1}.name], T_i)) ∧
  args' = [A_1', …, A_n']

```text
DefaultArgs(params, args) = ⊥ ⇔ ¬∃ args'. DefaultArgs(params, args) = args'

**(PredicateReq-WF-Predicate)**

```text
wp = PredicateReq(pred, ty)    pred ∈ PredicateName    Γ' = BindTypeParams(Γ, params)    Γ' ⊢ ty wf
──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; params ⊢ wp wf

```text
Γ; params ⊢ W wf ⇔ ∀ wp ∈ PredicateReqs(W). Γ; params ⊢ wp wf

```text
PredOk(`Bitcopy`, T) ⇔ BitcopyType(T)

```text
PredOk(`Clone`, T) ⇔ CloneType(T)

```text
PredOk(`Drop`, T) ⇔ DropType(T)

```text
PredOk(`FfiSafe`, T) ⇔ Γ ⊢ FfiSafeType(T) ⇓ ok

**(T-Constraint-Sat)**

```text
∀ B ∈ Bounds, Γ ⊢ A <: B
─────────────────────────────────────

```text
Γ ⊢ A satisfies Bounds

**(PredicateReq-Predicate)**

```text
wp = ⟨pred, ty⟩    PredOk(pred, ty[θ])
──────────────────────────────────────

```text
Γ ⊢ wp[θ] ok

```text
Γ ⊢ W[θ] ok ⇔ ∀ wp ∈ PredicateReqs(W). Γ ⊢ wp[θ] ok

Inline bounds and predicate-clause requirements are conjunctive. An instantiation satisfies the parameter only when it satisfies both.

#### 14.1.5 Dynamic Semantics

Generic parameter declarations, generic argument lists, class-bound lists, and predicate clauses have no runtime semantics. They are eliminated before abstract-machine evaluation.

#### 14.1.6 Lowering

These forms do not lower directly. Lowering consumes their elaborated substitutions and instantiated declarations as defined in §14.2.

#### 14.1.7 Diagnostics

Diagnostics are defined for duplicate type-parameter names, malformed predicate requirements, invalid class bounds, defaults that refer to later parameters, non-suffix defaults, missing default arguments during instantiation, and type arguments that fail required class or predicate constraints.

### 14.2 Generic Procedures and Types

#### 14.2.1 Syntax

```text
```

generic_procedure ::= "procedure" identifier generic_params? signature predicate_clause? contract_clause? block
generic_call      ::= callee generic_args "(" arg_list? ")"
generic_type_use  ::= type_path generic_args
```

Generic parameters and predicate clauses also appear on nominal type declarations and type aliases in their owning chapters.

#### 14.2.2 Parsing

Generic declaration parsing is delegated to the owning declaration forms, each of which invokes `ParseGenericParamsOpt` and `ParsePredicateClauseOpt` before its body-specific parser.

```text
CallTypeArgsStart(P) ⇔ TypeArgsStartTok(Tok(P)) ∧ (Γ ⊢ ParseGenericArgs(P) ⇓ (P_1, args)) ∧ IsPunc(Tok(P_1), "(")

**(Postfix-Call-TypeArgs)**

```text
CallTypeArgsStart(P)    Γ ⊢ ParseGenericArgs(P) ⇓ (P_1, targs)    IsPunc(Tok(P_1), "(")    Γ ⊢ ParseArgList(Advance(P_1)) ⇓ (P_2, args)    IsPunc(Tok(P_2), ")")
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PostfixStep(P, e) ⇓ (Advance(P_2), CallTypeArgs(e, targs, args))

#### 14.2.3 AST Representation / Form

```text
ProcedureDecl = ⟨attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, params, return_type_opt, contract_opt, body, span, doc⟩

```text
RecordDecl = ⟨attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, implements, members, invariant_opt, span, doc⟩

```text
EnumDecl = ⟨attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, implements, variants, invariant_opt, span, doc⟩

```text
ModalDecl = ⟨attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, implements, states, invariant_opt, span, doc⟩

```text
ClassDecl = ⟨attrs_opt, vis, modal, name, gen_params_opt, predicate_clause_opt, supers, items, span, doc⟩

```text
TypeAliasDecl = ⟨attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, type, span, doc⟩

Type = TypeApply(path, args) | …

```text
TypeApply = ⟨path, args⟩
Expr = CallTypeArgs(callee, type_args, args) | …

TypeParamsOf(p) = params_gen
TypePredicateClauseOf(p) = predicate_clause_opt

#### 14.2.4 Static Semantics

**(WF-Generic-Proc)**

```text
Γ ⊢ ⟨P_1, …, P_n⟩ wf    Γ' = Γ, T_1 : P_1, …, T_n : P_n    Γ' ⊢ signature wf    Γ' ⊢ body wf
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ `procedure` f⟨P_1, …, P_n⟩(...) → R {…} wf

```text
GenericCalleeProc(Identifier(f)) = proc ⇔ Γ ⊢ ResolveValueName(f) ⇓ ent ∧ ent.origin_opt = mp ∧ f' = (ent.target_opt if present, else f) ∧ DeclOf(mp, f') = proc ∧ proc = ProcedureDecl(_, _, _, gen_params_opt, _, _, _, _, _, _, _) ∧ TypeParamsOpt(gen_params_opt) ≠ []

```text
GenericCalleeProc(Path(path, name)) = proc ⇔ Γ ⊢ ResolveQualified(path, name, ValueKind) ⇓ ent ∧ ent.origin_opt = mp ∧ name' = (ent.target_opt if present, else name) ∧ DeclOf(mp, name') = proc ∧ proc = ProcedureDecl(_, _, _, gen_params_opt, _, _, _, _, _, _, _) ∧ TypeParamsOpt(gen_params_opt) ≠ []
GenericCalleeProc(callee) undefined otherwise

FreshTypeArgs([P_1, …, P_n]) = [TVar(α_1), …, TVar(α_n)]    where α_1, …, α_n are pairwise distinct and fresh

```text
SolvedType(T) ⇔ TVars(T) = ∅

```text
InferTypeArgs(params_gen, raw_args) = args' ⇔ params_gen = [P_1, …, P_n] ∧ raw_args = [R_1, …, R_n] ∧

```text
  (∀ i ∈ 1..n.
    ((SolvedType(R_i) ∧ A_i = R_i) ∨
     (¬SolvedType(R_i) ∧ P_i.default_opt = D_i ∧ A_i = TypeSubst([A_1/P_1.name, …, A_{i-1}/P_{i-1}.name], D_i)))) ∧
  args' = [A_1, …, A_n]

```text
InferTypeArgs(params_gen, raw_args) = ⊥ ⇔ ¬ ∃ args'. InferTypeArgs(params_gen, raw_args) = args'

**(GenericCallInference)**
GenericCalleeProc(callee) = ProcedureDecl(_, _, _, gen_params_opt, predicate_clause_opt, params, ret_opt, _, _, _, _)
params_gen = TypeParamsOpt(gen_params_opt)    params_gen = [P_1, …, P_n]
FreshTypeArgs(params_gen) = [X_1, …, X_n]

```text
θ_var = [X_1/P_1.name, …, X_n/P_n.name]

```text
params_i = [⟨mode_j, TypeSubst(θ_var, T_j)⟩ | ⟨mode_j, x_j, T_j⟩ ∈ params]

```text
R_i = TypeSubst(θ_var, ProcReturn(ret_opt))
|params_i| = |args|

```text
C_args = {(ArgType(params_i[j], args[j]), ParamType(params_i[j])) | j ∈ 1..|args|}
C_ret = {(R_i, T_exp)}    if T_exp_opt = T_exp
      ∅                   otherwise

```text
Γ ⊢ Solve(C_args ∪ C_ret) ⇓ θ_s

```text
raw_args = [θ_s(X_1), …, θ_s(X_n)]
InferTypeArgs(params_gen, raw_args) = [A_1, …, A_n]

```text
θ = [A_1/P_1.name, …, A_n/P_n.name]

```text
∀ i ∈ 1..n. Γ ⊢ A_i satisfies Bounds(P_i)

```text
Γ ⊢ predicate_clause_opt[θ] ok
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ GenericCallInference(callee, args, T_exp_opt) ⇓ [A_1, …, A_n]

**(T-Generic-Call)**
GenericCalleeProc(callee) = ProcedureDecl(_, _, _, gen_params_opt, predicate_clause_opt, params, ret_opt, _, _, _, _)
params_gen = TypeParamsOpt(gen_params_opt)    params_gen = [P_1, …, P_n]
DefaultArgs(params_gen, [A_1, …, A_k]) = [A_1', …, A_n']

```text
θ = [A_1'/P_1.name, …, A_n'/P_n.name]

```text
params_θ = [⟨mode_j, TypeSubst(θ, T_j)⟩ | ⟨mode_j, x_j, T_j⟩ ∈ params]

```text
∀ i ∈ 1..n. Γ ⊢ A_i' satisfies Bounds(P_i)

```text
Γ ⊢ predicate_clause_opt[θ] ok

```text
Γ; R; L ⊢ ArgsOk_T(params_θ, args)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ CallTypeArgs(callee, [A_1, …, A_k], args) : ProcReturn(ret_opt)[θ]

**(Generic-Call-ArgCount-Err)**

```text
GenericCalleeProc(callee) = ProcedureDecl(_, _, _, gen_params_opt, _, _, _, _, _, _, _)    params_gen = TypeParamsOpt(gen_params_opt)    DefaultArgs(params_gen, [A_1, …, A_k]) = ⊥
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ CallTypeArgs(callee, [A_1, …, A_k], args) ⇑

**(WF-Path-Generic-Err)**

```text
T = TypePath(p)    p ∈ dom(Σ.Types)    TypeParamsOf(p) ≠ []
────────────────────────────────────────────────────────────────

```text
Γ ⊢ T wf ⇑

**(WF-Apply)**

```text
T = TypeApply(p, args)    p ∈ dom(Σ.Types)    params_gen = TypeParamsOf(p)    DefaultArgs(params_gen, args) = args'    θ = [args'_i / params_gen[i].name]    ∀ i, Γ ⊢ args'_i wf    ∀ i, Γ ⊢ args'_i satisfies Bounds(params_gen[i])    Γ ⊢ TypePredicateClauseOf(p)[θ] ok
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T wf

**(WF-Apply-ArgCount-Err)**

```text
T = TypeApply(p, args)    p ∈ dom(Σ.Types)    params_gen = TypeParamsOf(p)    DefaultArgs(params_gen, args) = ⊥
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T wf ⇑

Type arguments MAY be omitted at generic procedure call sites only when `GenericCallInference` succeeds. A well-typed omitted-type-argument call is elaborated to `CallTypeArgs(callee, inferred_args, args)` before the §14.2.5 monomorphic-call elaboration. Class methods with generic parameter lists are not vtable-eligible and therefore MUST NOT be invoked through dynamic class objects.

#### 14.2.5 Dynamic Semantics

`CallTypeArgs` is elaborated to a monomorphic `Call` after substitution. `TypeApply(path, args)` denotes the specialized declaration obtained by applying the elaborated substitution to the generic declaration named by `path`.

Distinct monomorphic instantiations are distinct declarations and distinct layouts.

#### 14.2.6 Lowering

Monomorphization produces a specialized declaration `D[A_1/T_1, …, A_n/T_n]` for each concrete instantiation.

Lowering requirements:

1. Calls to generic procedures lower to direct static calls to the specialized instantiation.
2. Each distinct instantiation lowers independently.
3. Implementations MUST reject infinite monomorphization recursion.
4. The maximum instantiation depth is 128.

For instantiated nominal types, `sizeof` and `alignof` are those of the substituted body.

#### 14.2.7 Diagnostics

Diagnostics are defined for missing or excess type arguments, omitted-type-argument inference failures, use of a generic nominal declaration without required arguments, generic-call substitution failures, unsatisfied bounds or predicate clauses after substitution, and infinite monomorphization recursion.

### 14.3 Classes

#### 14.3.1 Syntax

```text
```

class_decl   ::= attribute_list? visibility? "modal"? "class" identifier generic_params? ("<:" superclass_bounds)? predicate_clause? "{" class_body? "}"
class_item   ::= class_method | associated_type | abstract_field | abstract_state
abstract_state ::= "@" identifier "{" abstract_field* "}"
abstract_field ::= attribute_list? visibility? key_boundary? identifier ":" type
```

Associated type item syntax is defined canonically in §14.5.

#### 14.3.2 Parsing

**(Parse-Class)**

```text
Γ ⊢ ParseAttrListOpt(P) ⇓ (P_0, attrs_opt)    Γ ⊢ ParseVis(P_0) ⇓ (P_1, vis)    Γ ⊢ ParseModalOpt(P_1) ⇓ (P_2, modal)    IsKw(Tok(P_2), `class`)    Γ ⊢ ParseIdent(Advance(P_2)) ⇓ (P_3, name)    Γ ⊢ ParseGenericParamsOpt(P_3) ⇓ (P_4, gen_params_opt)    Γ ⊢ ParseSuperclassOpt(P_4) ⇓ (P_5, supers)    Γ ⊢ ParsePredicateClauseOpt(P_5) ⇓ (P_6, predicate_clause_opt)    Γ ⊢ ParseClassBody(P_6) ⇓ (P_7, items)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseItem(P) ⇓ (P_7, ⟨ClassDecl, attrs_opt, vis, modal, name, gen_params_opt, predicate_clause_opt, supers, items, SpanBetween(P, P_7), []⟩)

**(Parse-Superclass-None)**
¬ IsOp(Tok(P), "<:")
──────────────────────────────────────────────

```text
Γ ⊢ ParseSuperclassOpt(P) ⇓ (P, [])

**(Parse-Superclass-Yes)**

```text
IsOp(Tok(P), "<:")    Γ ⊢ ParseSuperclassBounds(Advance(P)) ⇓ (P_1, supers)
────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseSuperclassOpt(P) ⇓ (P_1, supers)

**(Parse-SuperclassBounds-Cons)**

```text
Γ ⊢ ParseClassPath(P) ⇓ (P_1, c_0)    Γ ⊢ ParseSuperclassBoundsTail(P_1, [c_0]) ⇓ (P_2, cs)
──────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseSuperclassBounds(P) ⇓ (P_2, cs)

**(Parse-SuperclassBoundsTail-End)**
¬ IsOp(Tok(P), "+")
──────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseSuperclassBoundsTail(P, cs) ⇓ (P, cs)

**(Parse-SuperclassBoundsTail-Plus)**

```text
IsOp(Tok(P), "+")    Γ ⊢ ParseClassPath(Advance(P)) ⇓ (P_1, c)    Γ ⊢ ParseSuperclassBoundsTail(P_1, cs ++ [c]) ⇓ (P_2, cs')
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseSuperclassBoundsTail(P, cs) ⇓ (P_2, cs')

**(Parse-ClassBody)**

```text
IsPunc(Tok(P), "{")    Γ ⊢ ParseClassItemList(Advance(P)) ⇓ (P_1, items)    IsPunc(Tok(P_1), "}")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseClassBody(P) ⇓ (Advance(P_1), items)

**(Parse-ClassItemList-End)**
IsPunc(Tok(P), "}")
────────────────────────────────────────────

```text
Γ ⊢ ParseClassItemList(P) ⇓ (P, [])

**(Parse-ClassItemList-Cons)**

```text
¬ IsPunc(Tok(P), "}")    Γ ⊢ ParseClassItem(P) ⇓ (P_1, it)    Γ ⊢ ParseClassItemList(P_1) ⇓ (P_2, rest)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseClassItemList(P) ⇓ (P_2, [it] ++ rest)

**(Parse-ClassItem-Method)**

```text
Γ ⊢ ParseAttrListOpt(P) ⇓ (P_0, attrs_opt)    Γ ⊢ ParseVis(P_0) ⇓ (P_1, vis)    IsKw(Tok(P_1), `procedure`)    Γ ⊢ ParseIdent(Advance(P_1)) ⇓ (P_2, name)    Γ ⊢ ParseGenericParamsOpt(P_2) ⇓ (P_3, gen_params_opt)    Γ ⊢ ParseMethodSignature(P_3) ⇓ (P_4, receiver, params, ret_opt)    Γ ⊢ ParseContractClauseOpt(P_4) ⇓ (P_5, contract_opt)    Γ ⊢ ParseClassMethodBody(P_5) ⇓ (P_6, body_opt)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseClassItem(P) ⇓ (P_6, ⟨ClassMethodDecl, attrs_opt, vis, name, gen_params_opt, receiver, params, ret_opt, contract_opt, body_opt, SpanBetween(P, P_6), []⟩)

**(Parse-ClassItem-Field)**

```text
Γ ⊢ ParseAttrListOpt(P) ⇓ (P_0, attrs_opt)    Γ ⊢ ParseVis(P_0) ⇓ (P_1, vis)    Γ ⊢ ParseKeyBoundaryOpt(P_1) ⇓ (P_2, boundary)    Γ ⊢ ParseIdent(P_2) ⇓ (P_3, name)    IsPunc(Tok(P_3), ":")    Γ ⊢ ParseType(Advance(P_3)) ⇓ (P_4, ty)    Γ ⊢ ConsumeTerminatorReq(P_4) ⇓ P_5
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseClassItem(P) ⇓ (P_5, ⟨ClassFieldDecl, attrs_opt, vis, boundary, name, ty, SpanBetween(P, P_5), []⟩)

**(Parse-ClassItem-AbstractState)**

```text
Γ ⊢ ParseAttrListOpt(P) ⇓ (P_0, attrs_opt)    Γ ⊢ ParseVis(P_0) ⇓ (P_1, vis)    IsOp(Tok(P_1), "@")    Γ ⊢ ParseIdent(Advance(P_1)) ⇓ (P_2, name)    IsPunc(Tok(P_2), "{")    Γ ⊢ ParseAbstractFieldList(Advance(P_2)) ⇓ (P_3, fields)    IsPunc(Tok(P_3), "}")    Γ ⊢ ConsumeTerminatorOpt(Advance(P_3), ⊥) ⇓ P_4
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseClassItem(P) ⇓ (P_4, ⟨AbstractStateDecl, attrs_opt, vis, name, fields, SpanBetween(P, P_4), []⟩)

**(Parse-ClassMethodBody-Concrete)**

```text
IsPunc(Tok(P), "{")    Γ ⊢ ParseBlock(P) ⇓ (P_1, body)
──────────────────────────────────────────────────────────

```text
Γ ⊢ ParseClassMethodBody(P) ⇓ (P_1, body)

**(Parse-ClassMethodBody-Abstract)**

```text
¬ IsPunc(Tok(P), "{")    Γ ⊢ ConsumeTerminatorReq(P) ⇓ P_1
──────────────────────────────────────────────────────────

```text
Γ ⊢ ParseClassMethodBody(P) ⇓ (P_1, ⊥)

#### 14.3.3 AST Representation / Form

```text
ClassDecl = ⟨attrs_opt, vis, modal, name, gen_params_opt, predicate_clause_opt, supers, items, span, doc⟩

```text
ClassDecl.supers ∈ [ClassPath]

```text
ClassItem ∈ {

```text
  ClassFieldDecl = ⟨attrs_opt, vis, boundary, name, type, span, doc_opt⟩,

```text
  ClassMethodDecl = ⟨attrs_opt, vis, name, gen_params_opt, receiver, params, return_type_opt, contract_opt, body_opt, span, doc_opt⟩,

```text
  AssociatedTypeDecl = ⟨attrs_opt, vis, name, type_opt, span, doc_opt⟩,

```text
  AbstractStateDecl = ⟨attrs_opt, vis, name, fields, span, doc_opt⟩
}

```text
AbstractClassMethod(m) ⇔ ∃ attrs, vis, name, gen_params, recv, params, ret, contract, span, doc. m = ClassMethodDecl(attrs, vis, name, gen_params, recv, params, ret, contract, ⊥, span, doc)

```text
ConcreteClassMethod(m) ⇔ ∃ attrs, vis, name, gen_params, recv, params, ret, contract, body, span, doc. m = ClassMethodDecl(attrs, vis, name, gen_params, recv, params, ret, contract, body, span, doc) ∧ body ≠ ⊥

ClassItems(Cl) = Cl.items

```text
ClassMethods(Cl) = [ m | m ∈ ClassItems(Cl) ∧ m is ClassMethodDecl ]

```text
ClassFields(Cl) = [ f | f ∈ ClassItems(Cl) ∧ f is ClassFieldDecl ]

```text
MethodNames(Cl) = [ m.name | m ∈ ClassMethods(Cl) ]

```text
FieldNames(Cl) = [ f.name | f ∈ ClassFields(Cl) ]

```text
ReturnType(m) = m.return_type_opt    if m.return_type_opt ≠ ⊥

```text
ReturnType(m) = TypePrim("()")       if m.return_type_opt = ⊥

SelfVar = TypePath([`Self`])

#### 14.3.4 Static Semantics

```text
Distinct(xs) ⇔ ∀ i ≠ j. xs[i] ≠ xs[j]

```text
Disjoint(xs, ys) ⇔ ∀ x ∈ xs. x ∉ ys

**(WF-ClassPath)**

```text
p ∈ dom(Σ.Classes)
──────────────────────────────────────────────

```text
Γ ⊢ p : ClassPath

**(WF-ClassPath-Err)**

```text
p ∉ dom(Σ.Classes)
──────────────────────────────────────────────

```text
Γ ⊢ p : ClassPath ⇑

SubstSelf(T, TypePath([`Self`])) = T
SubstSelf(T, TypePerm(p, ty)) = TypePerm(p, SubstSelf(T, ty))
SubstSelf(T, TypeTuple([t_1, …, t_n])) = TypeTuple([SubstSelf(T, t_1), …, SubstSelf(T, t_n)])
SubstSelf(T, TypeArray(ty, e)) = TypeArray(SubstSelf(T, ty), e)
SubstSelf(T, TypeSlice(ty)) = TypeSlice(SubstSelf(T, ty))
SubstSelf(T, TypeUnion([t_1, …, t_n])) = TypeUnion([SubstSelf(T, t_1), …, SubstSelf(T, t_n)])

```text
SubstSelf(T, TypeFunc([⟨m_1, t_1⟩, …, ⟨m_n, t_n⟩], r)) = TypeFunc([⟨m_1, SubstSelf(T, t_1)⟩, …, ⟨m_n, SubstSelf(T, t_n)⟩], SubstSelf(T, r))
SubstSelf(T, TypePtr(ty, s)) = TypePtr(SubstSelf(T, ty), s)
SubstSelf(T, TypeRawPtr(q, ty)) = TypeRawPtr(q, SubstSelf(T, ty))
SubstSelf(T, TypeString(state_opt)) = TypeString(state_opt)
SubstSelf(T, TypeBytes(state_opt)) = TypeBytes(state_opt)
SubstSelf(T, TypeModalState(modal_ref, S)) = TypeModalState(modal_ref, S)
SubstSelf(T, TypeDynamic(p)) = TypeDynamic(p)
SubstSelf(T, TypePrim(n)) = TypePrim(n)

```text
SubstSelf(T, TypePath(p)) = TypePath(p)    if p ≠ [`Self`]

RecvType(T, ReceiverShorthand(`const`)) = TypePerm(`const`, T)
RecvType(T, ReceiverShorthand(`unique`)) = TypePerm(`unique`, T)
RecvType(T, ReceiverShorthand(`shared`)) = TypePerm(`shared`, T)
RecvType(T, ReceiverExplicit(mode_opt, ty)) = SubstSelf(T, ty)

```text
RecvMode(ReceiverShorthand(_)) = ⊥
RecvMode(ReceiverExplicit(mode_opt, _)) = mode_opt

PermOf(TypePerm(p, _)) = p
PermOf(ty) = `const`    otherwise
RecvPerm(T, r) = PermOf(RecvType(T, r))

```text
ParamSig_T(T, params) = [⟨mode, SubstSelf(T, ty)⟩ | ⟨mode, name, ty⟩ ∈ params]

```text
ParamBinds_T(T, params) = [⟨x_1, SubstSelf(T, T_1)⟩, …, ⟨x_n, SubstSelf(T, T_n)⟩]
ReturnType_T(T, m) = SubstSelf(T, ReturnType(m))

```text
Sig_T(T, m) = ⟨RecvType(T, m.receiver), ParamSig_T(T, m.params), SubstSelf(T, ReturnType(m))⟩
SigSelf(m) = Sig_T(SelfVar, m)

```text
SigMatch(T, m_impl, m_decl) ⇔ Sig_T(T, m_impl) = ⟨recv_i, params_i, ret_i⟩ ∧ Sig_T(T, m_decl) = ⟨recv_d, params_d, ret_d⟩ ∧ recv_i = recv_d ∧ params_i = params_d ∧ Γ ⊢ ret_i <: ret_d

Supers(Cl) = Cl.supers

**(T-Superclass)**
class A <: B    T <: A
────────────────────────

```text
Γ ⊢ T <: B

Head(h :: t) = h
Tail([]) = []
Tail(h :: t) = t

```text
HeadOk(h, Ls) ⇔ ∃ L ∈ Ls. L = h :: t ∧ ∀ L' ∈ Ls. h ∉ Tail(L')

```text
SelectHead(Ls) = h ⇔ Ls = [L_1, …, L_n] ∧ L_i = h :: t ∧ HeadOk(h, Ls) ∧ ∀ j < i. ¬ HeadOk(Head(L_j), Ls)

```text
SelectHead(Ls) = ⊥ ⇔ ¬ ∃ h. HeadOk(h, Ls)

```text
PopHead(h, L) = t ⇔ L = h :: t

```text
PopHead(h, L) = L ⇔ ¬(L = h :: t)

```text
PopAll(h, Ls) = [PopHead(h, L) | L ∈ Ls]

**(Lin-Base)**
Supers(Cl) = []
──────────────────────────────────────────────

```text
Γ ⊢ Linearize(Cl) ⇓ [Cl]

**(Merge-Empty)**

```text
∀ L ∈ Ls, L = []
──────────────────────────────────────────────

```text
Γ ⊢ Merge(Ls) ⇓ []

**(Merge-Step)**

```text
SelectHead(Ls) = h    Γ ⊢ Merge(PopAll(h, Ls)) ⇓ L
────────────────────────────────────────────────────────────────

```text
Γ ⊢ Merge(Ls) ⇓ [h] ++ L

**(Merge-Fail)**

```text
¬ ∃ h. HeadOk(h, Ls)
──────────────────────────────────────────────

```text
Γ ⊢ Merge(Ls) ⇑

**(Lin-Ok)**

```text
Γ ⊢ Merge([Linearize(S_1), …, Linearize(S_n), [S_1, …, S_n]]) ⇓ L
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Linearize(Cl) ⇓ [Cl] ++ L

**(Lin-Fail)**

```text
Γ ⊢ Merge(⋯) ⇑
──────────────────────────────────────────────

```text
Γ ⊢ Linearize(Cl) ⇑

**(Superclass-Cycle)**

```text
Γ ⊢ Linearize(Cl) ⇑    c = Code(Superclass-Cycle)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ Cl ⇑ c

Linearize(Cl) = [C_0, C_1, …, C_k] ∧ C_0 = Cl

EffMethods(Cl) = FirstByName(++_{i=0..k} ClassMethods(C_i))    where Linearize(Cl) = [C_0, …, C_k]
EffFields(Cl) = FirstFieldByName(++_{i=0..k} ClassFields(C_i))    where Linearize(Cl) = [C_0, …, C_k]

FirstByName(ms) = FirstByName(ms, ∅)
FirstByName([], Seen) = []
FirstByName(m :: ms, Seen) =

```text
  { m :: FirstByName(ms, Seen ∪ { m.name ↦ SigSelf(m) })    if m.name ∉ dom(Seen)
    FirstByName(ms, Seen)                                  if Seen[m.name] = SigSelf(m)

```text
    ⇑                                                      otherwise }

**(EffMethods-Conflict)**

```text
FirstByName(ms) ⇑    c = Code(EffMethods-Conflict)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ Emit(c)

FieldSig(f) = SubstSelf(SelfVar, f.type)

FirstFieldByName(fs) = FirstFieldByName(fs, ∅)
FirstFieldByName([], Seen) = []
FirstFieldByName(f :: fs, Seen) =

```text
  { f :: FirstFieldByName(fs, Seen ∪ { f.name ↦ FieldSig(f) })    if f.name ∉ dom(Seen)
    FirstFieldByName(fs, Seen)                                   if Seen[f.name] = FieldSig(f)

```text
    ⇑                                                            otherwise }

**(EffFields-Conflict)**

```text
FirstFieldByName(fs) ⇑    c = Code(EffFields-Conflict)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ Emit(c)

```text
SelfTypeClass(ty) ⇔ ty = SelfVar ∨ ∃ p. ty = TypePerm(p, SelfVar)

**(WF-Class-Method)**

```text
params_gen = TypeParamsOpt(gen_params_opt)    params_gen = [P_1, …, P_n]    Γ ⊢ ⟨P_1; …; P_n⟩ wf    Γ_m = BindTypeParams(Γ, params_gen)    (r = ReceiverExplicit(mode_opt, ty) ⇒ SelfTypeClass(ty))    (r = ReceiverShorthand(_) ⇒ true)    Γ_m ⊢ RecvType(SelfVar, r) wf    self ∉ ParamNames(params)    Distinct(ParamNames(params))    ∀ ⟨_, _, T_i⟩ ∈ params, Γ_m ⊢ T_i wf    (return_type_opt = ⊥ ∨ Γ_m ⊢ return_type_opt wf)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ⟨ClassMethodDecl, _, _, name, gen_params_opt, r, params, return_type_opt, _, body_opt, _, _⟩ : ClassMethodOK(Cl)

**(T-Class-Method-Body-Abstract)**

```text
m.body_opt = ⊥
──────────────────────────────────────────────

```text
Γ ⊢ m : ClassMethodBodyOK

**(T-Class-Method-Body)**

```text
m.body_opt = body    T_self = RecvType(SelfVar, m.receiver)    R_m = ReturnType_T(SelfVar, m)    R_b = BodyReturnType(R_m)    Γ_0 = PushScope(Γ)    IntroAll(Γ_0, [⟨`self`, T_self⟩] ++ ParamBinds_T(SelfVar, m.params)) ⇓ Γ_1    Γ_1; R_m; ⊥ ⊢ body : T_b    Γ ⊢ T_b <: R_b    (R_b ≠ TypePrim("()") ⇒ ExplicitReturn(body))
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ m : ClassMethodBodyOK

**(WF-Class)**

```text
Distinct(MethodNames(Cl))    Distinct(FieldNames(Cl))    Disjoint(MethodNames(Cl), FieldNames(Cl))    Distinct(Supers(Cl))    ∀ S ∈ Supers(Cl), Γ ⊢ S : ClassPath    ∀ m ∈ ClassMethods(Cl), Γ ⊢ m : ClassMethodOK(Cl)    Γ ⊢ m : ClassMethodBodyOK    Γ ⊢ Linearize(Cl) ⇓ L
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Cl : ClassOk

#### 14.3.5 Dynamic Semantics

Class declarations do not introduce runtime actions by themselves. Observable behavior arises only when concrete method bodies are invoked or when a class participates in dynamic dispatch as defined in §14.6.

#### 14.3.6 Lowering

Concrete class methods lower as procedures. Abstract methods, abstract fields, abstract states, and superclass lists do not lower to executable code directly.

Default-method reuse and vtable construction are defined in §14.4 and §14.6.

#### 14.3.7 Diagnostics

Diagnostics are defined for duplicate method names, duplicate abstract-field names, class item name conflicts, invalid `Self` receiver forms, undefined superclass paths, superclass linearization cycles, and effective-method or effective-field conflicts introduced by inheritance.

### 14.4 Implementations

#### 14.4.1 Syntax

```text
```

implements_clause ::= "<:" class_path ("," class_path)*
override_method   ::= visibility? "override"? "procedure" identifier signature contract_clause? block
```

Class implementation occurs at the defining record, enum, or modal declaration. Standalone extension implementation blocks are not part of the language.

#### 14.4.2 Parsing

**(Parse-Implements-None)**
¬ IsOp(Tok(P), "<:")
──────────────────────────────────────────────

```text
Γ ⊢ ParseImplementsOpt(P) ⇓ (P, [])

**(Parse-Implements-Yes)**

```text
IsOp(Tok(P), "<:")    Γ ⊢ ParseClassList(Advance(P)) ⇓ (P_1, cls)
───────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseImplementsOpt(P) ⇓ (P_1, cls)

**(Parse-ClassList-Cons)**

```text
Γ ⊢ ParseClassPath(P) ⇓ (P_1, c_0)    Γ ⊢ ParseClassListTail(P_1, [c_0]) ⇓ (P_2, cs)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseClassList(P) ⇓ (P_2, cs)

**(Parse-ClassListTail-End)**
¬ IsPunc(Tok(P), ",")
──────────────────────────────────────────────

```text
Γ ⊢ ParseClassListTail(P, cs) ⇓ (P, cs)

**(Parse-ClassListTail-Comma)**

```text
IsPunc(Tok(P), ",")    Γ ⊢ ParseClassPath(Advance(P)) ⇓ (P_1, c)    Γ ⊢ ParseClassListTail(P_1, cs ++ [c]) ⇓ (P_2, cs')
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseClassListTail(P, cs) ⇓ (P_2, cs')

#### 14.4.3 AST Representation / Form

```text
Implements(T) = impls ⇔ T = RecordDecl(_, _, _, _, _, impls, _, _, _, _) ∨ T = EnumDecl(_, _, _, _, _, impls, _, _, _, _) ∨ T = ModalDecl(_, _, _, _, _, impls, _, _, _, _)

The surface operator `<:` is overloaded.

1. For records, enums, and modals, `<:` is represented by membership in `Implements(T)`.
2. For classes, `<:` is represented by `Supers(Cl)` together with the superclass rules of §14.3.4.

This section owns only the concrete-implementer relation for records, enums, and modals. Class superclass clauses are not re-encoded as implementation lists here.

```text
Fields(T) = Fields(R) ⇔ T = TypePath(p) ∧ RecordDecl(p) = R

```text
Fields(T) = [] ⇔ (T = TypePath(p) ∧ EnumDecl(p) = E) ∨ (T = ModalRefType(modal_ref))

```text
Methods(T) = Methods(R) ⇔ T = TypePath(p) ∧ RecordDecl(p) = R

```text
Methods(T) = [] ⇔ (T = TypePath(p) ∧ EnumDecl(p) = E) ∨ (T = ModalRefType(modal_ref))

```text
MethodByName(T, name) = m' ⇔ m' ∈ Methods(T) ∧ m'.name = name

```text
MethodByName(T, name) = ⊥ ⇔ ¬ ∃ m' ∈ Methods(T). m'.name = name

ClassMethodTable(Cl) = EffMethods(Cl)
ClassFieldTable(Cl) = EffFields(Cl)

ImplModule(T) = ModuleOf(T)

```text
ClassModule(Cl) = ModuleOf(Σ.Classes[Cl])    if Cl ∈ dom(Σ.Classes)

```text
ImplOrphanOk(T, Cl) ⇔ SameAssembly(ImplModule(T), CurrentModule(Γ)) ∨ (Cl ∈ dom(Σ.Classes) ∧ SameAssembly(ClassModule(Cl), CurrentModule(Γ)))

#### 14.4.4 Static Semantics

```text
NoDefaultMethods(Cl) ⇔ ∀ m ∈ ClassMethods(Cl). m.body = ⊥

```text
AbstractsImplemented(T) ⇔ ∀ Cl ∈ Implements(T). ∀ m ∈ ClassMethodTable(Cl). (m.body = ⊥ ⇒ MethodByName(T, m.name) ≠ ⊥)

**(Impl-Abstract-Method)**

```text
m ∈ ClassMethodTable(Cl)    m.body = ⊥    MethodByName(T, m.name) = m'    SigMatch(T, m', m)    m'.override = false
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T implements abstract m

**(Impl-Missing-Method)**

```text
m ∈ ClassMethodTable(Cl)    m.body = ⊥    MethodByName(T, m.name) = ⊥
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T : ImplementsOk ⇑

**(Impl-AssocType-Missing)**

```text
a ∈ A_abs(Cl)    ¬(T binds a for Cl)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T : ImplementsOk ⇑

**(Impl-Sig-Err)**

```text
m ∈ ClassMethodTable(Cl)    m.body = ⊥    MethodByName(T, m.name) = m'    ¬ SigMatch(T, m', m)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T : ImplementsOk ⇑

**(Override-Abstract-Err)**

```text
m ∈ ClassMethodTable(Cl)    m.body = ⊥    MethodByName(T, m.name) = m'    SigMatch(T, m', m)    m'.override = true
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T : ImplementsOk ⇑

**(Impl-Concrete-Default)**

```text
m ∈ ClassMethodTable(Cl)    m.body ≠ ⊥    MethodByName(T, m.name) = ⊥
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T uses default m

**(Impl-Concrete-Override)**

```text
m ∈ ClassMethodTable(Cl)    m.body ≠ ⊥    MethodByName(T, m.name) = m'    SigMatch(T, m', m)    m'.override = true
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T overrides m

**(Override-Missing-Err)**

```text
m ∈ ClassMethodTable(Cl)    m.body ≠ ⊥    MethodByName(T, m.name) = m'    SigMatch(T, m', m)    m'.override = false
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T : ImplementsOk ⇑

**(Impl-Sig-Err-Concrete)**

```text
m ∈ ClassMethodTable(Cl)    m.body ≠ ⊥    MethodByName(T, m.name) = m'    ¬ SigMatch(T, m', m)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T : ImplementsOk ⇑

**(Override-NoConcrete)**

```text
m' ∈ Methods(T)    m'.override = true    ¬ ∃ Cl ∈ Implements(T). ∃ m ∈ ClassMethodTable(Cl). m.name = m'.name ∧ m.body ≠ ⊥
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T : ImplementsOk ⇑

**(Impl-Field)**

```text
f : T_c ∈ ClassFieldTable(Cl)    f : T_i ∈ Fields(T)    T_i <: T_c
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T satisfies field f

**(Impl-Field-Missing)**

```text
f : T_c ∈ ClassFieldTable(Cl)    ¬ ∃ T_i. f : T_i ∈ Fields(T)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T : ImplementsOk ⇑

**(Impl-Field-Type-Err)**

```text
f : T_c ∈ ClassFieldTable(Cl)    f : T_i ∈ Fields(T)    ¬(Γ ⊢ T_i <: T_c)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T : ImplementsOk ⇑

**(Impl-Coherence-Err)**
¬ Distinct(Implements(T))
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T : ImplementsOk ⇑

**(Impl-Orphan-Err)**

```text
Cl ∈ Implements(T)    ¬ ImplOrphanOk(T, Cl)
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T : ImplementsOk ⇑

**(WF-Impl)**

```text
∀ Cl ∈ Implements(T), Γ ⊢ Cl : ClassOk    Distinct(Implements(T))    ∀ Cl ∈ Implements(T), ImplOrphanOk(T, Cl)    Γ ⊢ T : BitcopyDropOk    ∀ Cl ∈ Implements(T), ∀ m ∈ ClassMethodTable(Cl), (Γ ⊢ T implements abstract m ∨ Γ ⊢ T overrides m ∨ Γ ⊢ T uses default m)    ∀ Cl ∈ Implements(T), ∀ f ∈ ClassFieldTable(Cl), Γ ⊢ T satisfies field f
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T : ImplementsOk

```text
Γ ⊢ T <: Cl ⇔ Cl ∈ Implements(T) ∧ Γ ⊢ T : ImplementsOk

A class with abstract states may be implemented only by a modal type.
A type MUST NOT implement the same class more than once.
For every implementation `T <: Cl`, at least one of the implementing declaration `T` or the referenced class `Cl` MUST be defined in the current assembly.

#### 14.4.5 Dynamic Semantics

Implementations do not add new runtime state beyond the concrete methods and fields already present on the implementing type. Default-method selection and dynamic dispatch are defined in §14.6.

#### 14.4.6 Lowering

Implementation-specific bodies lower exactly as concrete methods on the implementing type. When a required method is satisfied by a class default, lowering reuses the default implementation body as the dispatch target for that `(type, class, method)` triple.

#### 14.4.7 Diagnostics

Diagnostics are defined for duplicate implemented classes on a declaration, missing required methods, incompatible method signatures, missing associated-type bindings, misuse of `override`, missing required fields, incompatible field types, and non-modal types attempting to implement modal classes.

### 14.5 Associated Types

#### 14.5.1 Syntax

```text
```

associated_type ::= "type" identifier ("=" type)?
```

In class declarations, the optional `= type` introduces a default. In implementing record bodies, the optional `= type` is the bound associated type body.

#### 14.5.2 Parsing

**(Parse-ClassItem-AssociatedType)**

```text
Γ ⊢ ParseAttrListOpt(P) ⇓ (P_0, attrs_opt)    Γ ⊢ ParseVis(P_0) ⇓ (P_1, vis)    IsKw(Tok(P_1), `type`)    Γ ⊢ ParseIdent(Advance(P_1)) ⇓ (P_2, name)    Γ ⊢ ParseAssocTypeOpt(P_2) ⇓ (P_3, type_opt)    Γ ⊢ ConsumeTerminatorReq(P_3) ⇓ P_4
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseClassItem(P) ⇓ (P_4, ⟨AssociatedTypeDecl, attrs_opt, vis, name, type_opt, SpanBetween(P, P_4), []⟩)

**(Parse-AssocTypeOpt-None)**
¬ IsOp(Tok(P), "=")
──────────────────────────────────────────────

```text
Γ ⊢ ParseAssocTypeOpt(P) ⇓ (P, ⊥)

**(Parse-AssocTypeOpt-Yes)**

```text
IsOp(Tok(P), "=")    Γ ⊢ ParseType(Advance(P)) ⇓ (P_1, ty)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseAssocTypeOpt(P) ⇓ (P_1, ty)

**(Parse-AssocTypeDefaultOpt)**

```text
Γ ⊢ ParseAssocTypeOpt(P) ⇓ (P_1, ty_opt)
──────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseAssocTypeDefaultOpt(P) ⇓ (P_1, ty_opt)

**(Parse-RecordMember-AssociatedType)**

```text
Γ ⊢ ParseAttrListOpt(P) ⇓ (P_0, attrs_opt)    Γ ⊢ ParseVis(P_0) ⇓ (P_1, vis)    IsKw(Tok(P_1), `type`)    Γ ⊢ ParseIdent(Advance(P_1)) ⇓ (P_2, name)    Γ ⊢ ParseAssocTypeDefaultOpt(P_2) ⇓ (P_3, default_type_opt)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseRecordMember(P) ⇓ (P_3, ⟨AssociatedTypeDecl, attrs_opt, vis, name, default_type_opt, SpanBetween(P, P_3), []⟩)

#### 14.5.3 AST Representation / Form

```text
AssociatedTypeDecl = ⟨attrs_opt, vis, name, type_opt_or_default_opt, span, doc_opt⟩

ClassItem ::= … | AssociatedTypeDecl
RecordMember ::= … | AssociatedTypeDecl

```text
An associated type in a class item is abstract when `type_opt = ⊥` and concrete-defaulted when `type_opt ≠ ⊥`.

```text
AssocTypeItems(Cl) = [a | a ∈ ClassItems(Cl) ∧ a is AssociatedTypeDecl]

```text
AssocTypeNames(Cl) = [a.name | a ∈ AssocTypeItems(Cl)]

```text
AssocTypeDefault(Cl, name) = ty ⇔ ∃ a ∈ AssocTypeItems(Cl). a.name = name ∧ a.type_opt_or_default_opt = ty ∧ ty ≠ ⊥

```text
AssocTypeDefault(Cl, name) = ⊥ ⇔ ¬ ∃ ty. AssocTypeDefault(Cl, name) = ty

```text
ImplAssocType(TypePath(p), name) = ty ⇔ RecordDecl(p) = R ∧ ∃ a ∈ R.members. a is AssociatedTypeDecl ∧ a.name = name ∧ a.type_opt_or_default_opt = ty ∧ ty ≠ ⊥

```text
ImplAssocType(T, name) = ⊥ ⇔ ¬ ∃ ty. ImplAssocType(T, name) = ty

```text
A_abs(Cl) = { name | name ∈ AssocTypeNames(Cl) ∧ AssocTypeDefault(Cl, name) = ⊥ }

```text
AssocTypeBinding(T, Cl, name) = ty ⇔ ImplAssocType(T, name) = ty

```text
AssocTypeBinding(T, Cl, name) = ty ⇔ ImplAssocType(T, name) = ⊥ ∧ AssocTypeDefault(Σ.Classes[Cl], name) = ty

```text
AssocTypeBinding(T, Cl, name) = ⊥ ⇔ ImplAssocType(T, name) = ⊥ ∧ AssocTypeDefault(Σ.Classes[Cl], name) = ⊥

```text
T binds name for Cl ⇔ AssocTypeBinding(T, Cl, name) ≠ ⊥

#### 14.5.4 Static Semantics

Generic class parameters are supplied at use sites. Associated types are supplied by the implementing declaration body.

An abstract associated type in a class must be bound by every implementation of that class. A default associated type in a class may be used when the implementing type does not provide an overriding binding.

In a concrete implementing declaration body, an associated-type member is well-formed only in the bound form `type Name = Bound`.

Associated-type lookup order is:

1. implementation binding from the implementing declaration body;
2. class default from the referenced class;
3. missing binding.

**Class Alias Equivalence (T-Alias-Equiv)**
type Alias = A + B
──────────────────────────────────────────────────────────────

```text
Γ ⊢ T <: Alias ⇔ Γ ⊢ T <: A ∧ Γ ⊢ T <: B

#### 14.5.5 Dynamic Semantics

Associated types are compile-time declarations only. They introduce no runtime values and no abstract-machine transitions.

#### 14.5.6 Lowering

Associated types are erased during type elaboration. No feature-specific runtime representation or ABI form is introduced.

#### 14.5.7 Diagnostics

Diagnostics are defined for duplicate associated-type names within a class and for implementations that fail to bind required abstract associated types.

### 14.6 Dynamic Class Objects

#### 14.6.1 Syntax

```text
```

dynamic_type      ::= "$" class_path
dynamic_cast_expr ::= expr "as" dynamic_type
```

Method-call surface syntax on dynamic values is the ordinary `base~>name(args)` form from Chapter 16.

#### 14.6.2 Parsing

**(Parse-Dynamic-Type)**

```text
IsOp(Tok(P), "$")    Γ ⊢ ParseTypePath(Advance(P)) ⇓ (P_1, path)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseNonPermType(P) ⇓ (P_1, TypeDynamic(path))

No feature-specific parse form exists beyond ordinary cast parsing for `expr as $Class`.

#### 14.6.3 AST Representation / Form

Type = TypeDynamic(path) | …

```text
DynFields(Cl) = [⟨`data`, TypeRawPtr(`imm`, TypePrim("()"))⟩, ⟨`vtable`, TypeRawPtr(`imm`, TypePath(["VTable"]))⟩]
DynLayoutJudg = {DynLayout}

Dyn(Cl, RawPtr(`imm`, addr), T) is the runtime value form for a dynamic class object whose hidden concrete type is `T`.

SelfOccurs(TypePath([`Self`])) = true
SelfOccurs(TypePerm(p, ty)) = SelfOccurs(ty)
SelfOccurs(TypeTuple([t_1, …, t_n])) = ∨_i SelfOccurs(t_i)
SelfOccurs(TypeArray(ty, e)) = SelfOccurs(ty)
SelfOccurs(TypeSlice(ty)) = SelfOccurs(ty)
SelfOccurs(TypeUnion([t_1, …, t_n])) = ∨_i SelfOccurs(t_i)

```text
SelfOccurs(TypeFunc([⟨m_1, t_1⟩, …, ⟨m_n, t_n⟩], r)) = (∨_i SelfOccurs(t_i)) ∨ SelfOccurs(r)
SelfOccurs(TypePtr(_, _)) = false
SelfOccurs(TypeRawPtr(_, _)) = false
SelfOccurs(TypeString(_)) = false
SelfOccurs(TypeBytes(_)) = false
SelfOccurs(TypeModalState(_, _)) = false
SelfOccurs(TypeDynamic(_)) = false
SelfOccurs(TypePrim(_)) = false

```text
SelfOccurs(TypePath(p)) = false    if p ≠ [`Self`]

```text
HasReceiver(m) ⇔ m.receiver ≠ ⊥

```text
HasGenericParams(m) ⇔ TypeParamsOpt(m.gen_params_opt) ≠ []

```text
vtable_eligible(m) ⇔ HasReceiver(m) ∧ ¬ HasGenericParams(m) ∧ ¬ SelfOccurs(m)

```text
dispatchable(Cl) ⇔ ∀ m ∈ EffMethods(Cl). vtable_eligible(m)

#### 14.6.4 Static Semantics

**(WF-Dynamic)**

```text
T = TypeDynamic(p)    p ∈ dom(Σ.Classes)
────────────────────────────────────────

```text
Γ ⊢ T wf

**(WF-Dynamic-Err)**

```text
T = TypeDynamic(p)    p ∉ dom(Σ.Classes)
──────────────────────────────────────────────

```text
Γ ⊢ T wf ⇑

**(T-Equiv-Dynamic)**
T = TypeDynamic(p)    U = TypeDynamic(p)
──────────────────────────────────────────────

```text
Γ ⊢ T ≡ U

**(T-Dynamic-Form)**

```text
Γ; R; L ⊢ e :place T    IsPlace(e)    AddrOfOk(e)    Γ ⊢ Cl : ClassPath    Γ ⊢ StripPerm(T) <: Cl    dispatchable(Cl)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ e `as` TypeDynamic(Cl) : TypeDynamic(Cl)

**(Dynamic-NonDispatchable)**

```text
Γ; R; L ⊢ e :place T    IsPlace(e)    Γ ⊢ Cl : ClassPath    Γ ⊢ StripPerm(T) <: Cl    ¬ dispatchable(Cl)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ e `as` TypeDynamic(Cl) ⇑

```text
LookupMethod(T, name) = m ⇔ MethodByName(T, name) = m

```text
LookupMethod(T, name) = m ⇔ MethodByName(T, name) = ⊥ ∧ |ClassDefaults(T, name)| = 1 ∧ m ∈ ClassDefaults(T, name)

```text
LookupMethod(T, name) = ⊥ ⇔ MethodByName(T, name) = ⊥ ∧ (|ClassDefaults(T, name)| = 0 ∨ |ClassDefaults(T, name)| > 1)

**(T-Dynamic-MethodCall)**

```text
RecvBaseType(base, RecvMode(m.receiver)) = P_caller TypeDynamic(Cl)    LookupClassMethod(Cl, name) = m    RecvPerm(SelfVar, m.receiver) = P_method    PermAdmits(P_caller, P_method)    RecvArgOk(base, RecvMode(m.receiver))    Γ; R; L ⊢ ArgsOk(m.params, args)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ MethodCall(base, name, args) : ReturnType(m)

**(LookupClassMethod-NotFound)**

```text
Γ; R; L ⊢ base : TypeDynamic(Cl)    LookupClassMethod(Cl, name) undefined
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ MethodCall(base, name, args) ⇑

Dynamic dispatch is permitted only for dispatchable classes, that is, classes whose effective method set is entirely vtable-eligible.

#### 14.6.5 Dynamic Semantics

ValueType(Dyn(Cl, RawPtr(`imm`, addr), T)) = TypeDynamic(Cl)

**(Eval-Dynamic-Form)**

```text
IsPlace(e)    Γ ⊢ AddrOfSigma(e, σ) ⇓ (Val(addr), σ_1)    T_e = ExprType(e)    T = StripPerm(T_e)    Γ ⊢ T <: Cl
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(e `as` TypeDynamic(Cl), σ) ⇓ (Val(Dyn(Cl, RawPtr(`imm`, addr), T)), σ_1)

**(Eval-Dynamic-Form-Ctrl)**

```text
Γ ⊢ AddrOfSigma(e, σ) ⇓ (Ctrl(κ), σ_1)
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSigma(e `as` TypeDynamic(Cl), σ) ⇓ (Ctrl(κ), σ_1)

```text
Dispatch(T, Cl, name) = m' ⇔ m = LookupClassMethod(Cl, name) ∧ MethodByName(T, name) = m' ∧ SigMatch(T, m', m)

```text
Dispatch(T, Cl, name) = m ⇔ m = LookupClassMethod(Cl, name) ∧ (MethodByName(T, name) = ⊥ ∨ (∃ m'. MethodByName(T, name) = m' ∧ ¬ SigMatch(T, m', m))) ∧ m.body ≠ ⊥

```text
Dispatch(T, Cl, name) = ⊥ ⇔ m = LookupClassMethod(Cl, name) ∧ (MethodByName(T, name) = ⊥ ∨ (∃ m'. MethodByName(T, name) = m' ∧ ¬ SigMatch(T, m', m))) ∧ m.body = ⊥

MethodTarget(Dyn(Cl, RawPtr(`imm`, addr), T), name) = Dispatch(T, Cl, name)

#### 14.6.6 Lowering

**(Layout-DynamicClass)**
───────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ DynLayout(Cl) ⇓ ⟨2 × PtrSize, PtrAlign, DynFields(Cl)⟩

**(Size-DynamicClass)**
T = TypeDynamic(Cl)
────────────────────────────────────────────

```text
Γ ⊢ sizeof(T) = 2 × PtrSize

**(Align-DynamicClass)**
T = TypeDynamic(Cl)
────────────────────────────────────

```text
Γ ⊢ alignof(T) = PtrAlign

**(ABI-Dynamic)**

```text
Γ ⊢ DynLayout(Cl) ⇓ ⟨size, align, _⟩
──────────────────────────────────────────────────────────────

```text
Γ ⊢ ABITy(TypeDynamic(Cl)) ⇓ ⟨size, align⟩

```text
ValueBits(TypeDynamic(Cl), v) = bits ⇔ v = Dyn(Cl, RawPtr(`imm`, addr), T) ∧ sym = ScopedSym(VTableDecl(T, Cl)) ∧ addr_vt = AddrOfSym(sym) ∧ RecordLayout(DynFields(Cl)) ⇓ ⟨size, _, offsets⟩ ∧ StructBits([TypeRawPtr(`imm`, TypePrim("()")), TypeRawPtr(`imm`, TypePath(["VTable"]))], [RawPtr(`imm`, addr), RawPtr(`imm`, addr_vt)], offsets, size) = bits

DynDispatchJudg = {VTable, VSlot, DynPack, LowerDynCall}

```text
VTableEligible(Cl) = [ m ∈ EffMethods(Cl) | vtable_eligible(m) ]

**(DispatchSym-Impl)**

```text
LookupClassMethod(Cl, name) = m    MethodByName(T, name) = m'    SigMatch(T, m', m)    Γ ⊢ Mangle(m') ⇓ sym
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ DispatchSym(T, Cl, name) ⇓ sym

**(DispatchSym-Default-None)**

```text
LookupClassMethod(Cl, name) = m    MethodByName(T, name) = ⊥    m.body_opt ≠ ⊥    Γ ⊢ Mangle(DefaultImpl(T, m)) ⇓ sym
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ DispatchSym(T, Cl, name) ⇓ sym

**(DispatchSym-Default-Mismatch)**

```text
LookupClassMethod(Cl, name) = m    MethodByName(T, name) = m'    ¬ SigMatch(T, m', m)    m.body_opt ≠ ⊥    Γ ⊢ Mangle(DefaultImpl(T, m)) ⇓ sym
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ DispatchSym(T, Cl, name) ⇓ sym

**(VTable-Order)**

```text
VTableEligible(Cl) = [m_1, …, m_k]    ∀ i, DispatchSym(T, Cl, m_i.name) = sym_i
─────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ VTable(T, Cl) ⇓ [sym_1, …, sym_k]

**(VSlot-Entry)**
VTableEligible(Cl) = [m_0, …, m_{k-1}]    m_i.name = method.name
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ VSlot(Cl, method) ⇓ i

**(Lower-Dynamic-Form)**

```text
IsPlace(e)    Γ ⊢ LowerAddrOf(e) ⇓ ⟨IR, addr⟩    T_e = ExprType(e)    T = StripPerm(T_e)    Γ ⊢ T <: Cl
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ DynPack(T, e) ⇓ ⟨RawPtr(`imm`, addr), VTable(T, Cl)⟩

**(Lower-DynCall)**

```text
VSlot(Cl, name) ⇓ i
────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerDynCall(base, name, args) ⇓ SeqIR(CallVTable(base, i, args), PanicCheck)

**(EmitVTable-Decl)**

```text
Mangle(VTableDecl(T, Cl)) ⇓ sym
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EmitVTable(T, Cl) ⇓ GlobalVTable(sym, VTableHeader(T), VTable(T, Cl))

#### 14.6.7 Diagnostics

Diagnostics are defined for dynamic casts to undefined or non-dispatchable classes, dynamic method lookup failures, direct calls to dynamically-dispatched `drop`, and vtable emission failures.

### 14.7 Opaque Types

#### 14.7.1 Syntax

```text
```

opaque_type ::= "opaque" class_path
```

Opaque types are type forms and therefore compose with the ordinary declaration and return-type syntactic positions that accept `type`.

#### 14.7.2 Parsing

**(Parse-Opaque-Type)**

```text
IsIdent(Tok(P))    Lexeme(Tok(P)) = `opaque`    Γ ⊢ ParseTypePath(Advance(P)) ⇓ (P_1, path)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseNonPermType(P) ⇓ (P_1, TypeOpaque(path))

#### 14.7.3 AST Representation / Form

Type = TypeOpaque(path) | …

```text
TypeOpaque = ⟨path⟩

#### 14.7.4 Static Semantics

**(WF-Opaque)**

```text
T = TypeOpaque(path)    path ∈ dom(Σ.Classes)
────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T wf

**(WF-Opaque-Err)**

```text
T = TypeOpaque(path)    path ∉ dom(Σ.Classes)
────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T wf ⇑

**(T-Equiv-Opaque)**
T = TypeOpaque(path)    U = TypeOpaque(path)
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T ≡ U

**(T-Opaque-Return)**

```text
Γ ⊢ body : T    Γ ⊢ T <: Cl    return_type(f) = opaque Cl
───────────────────────────────────────────────────────────────────

```text
Γ ⊢ f : () → opaque Cl

**(T-Opaque-Project)**

```text
Γ ⊢ f() : opaque Cl    m ∈ interface(Cl)
────────────────────────────────────────────

```text
Γ ⊢ f()~>m(args) : R_m

Two opaque types are equivalent exactly when they name the same class path. Opaque values expose only the class interface named by that path.

#### 14.7.5 Dynamic Semantics

Opaque types add no runtime wrapper. The callee returns a concrete value implementing the named class, and the caller observes that value only through the statically-restricted opaque interface.

#### 14.7.6 Lowering

Opaque types incur no distinct runtime representation or ABI form. Lowering uses the underlying concrete type chosen by the defining body.

#### 14.7.7 Diagnostics

Diagnostics are defined for opaque types naming undefined classes, member access outside the named class interface, and assignment or matching between opaque types with incompatible class paths.

### 14.8 Refinement Types

#### 14.8.1 Syntax

```text
```

refinement_type       ::= type "|:" "{" predicate_expr "}"
type_alias_decl       ::= visibility? "type" identifier "=" type "|:" "{" predicate_expr "}"
param_with_constraint ::= identifier ":" type "|:" "{" predicate_expr "}"
```

Within a standalone refinement type, `self` denotes the constrained value.

#### 14.8.2 Parsing

**(Parse-RefinementOpt-None)**
¬ IsOp(Tok(P), "|:")
──────────────────────────────────────────────

```text
Γ ⊢ ParseRefinementOpt(P) ⇓ (P, ⊥)

**(Parse-RefinementOpt-Yes)**

```text
IsOp(Tok(P), "|:")    IsPunc(Tok(Advance(P)), "{")    Γ ⊢ ParsePredicateExpr(Advance(Advance(P))) ⇓ (P_1, pred)    IsPunc(Tok(P_1), "}")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseRefinementOpt(P) ⇓ (Advance(P_1), pred)

```text
ParsePredicateExpr(P) ⇓ (P_1, e) ⇔ Γ ⊢ ParseExpr(P) ⇓ (P_1, e)

#### 14.8.3 AST Representation / Form

Type = TypeRefine(base, pred) | …

```text
TypeRefine = ⟨base, pred⟩

```text
PredicateEquiv(P_1, P_2) ⇔ ∀ σ. (Eval(P_1, σ) = true ⇔ Eval(P_2, σ) = true)

#### 14.8.4 Static Semantics

**(T-Equiv-Refine)**

```text
T = TypeRefine(T_0, P_1)    U = TypeRefine(U_0, P_2)    Γ ⊢ T_0 ≡ U_0    PredicateEquiv(P_1, P_2)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T ≡ U

**(T-Equiv-Refine-Norm)**
T = TypeRefine(TypeRefine(T_0, P_1), P_2)    U = TypeRefine(T_0, P_1 ∧ P_2)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T ≡ U

**(WF-Refine-Type)**

```text
Γ ⊢ T wf    Γ, `self` : T ⊢ P : `bool`    Pure(P)
──────────────────────────────────────────────────────────────

```text
Γ ⊢ (T |: {P}) wf

**(T-Refine-Intro)**

```text
Γ ⊢ e : T    Γ ⊢ F(P[e/`self`], L)    L dominates current location
────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ e : T |: {P}

**(T-Refine-Elim)**

```text
Γ ⊢ e : T |: {P}
────────────────────

```text
Γ ⊢ e : T

Subtyping relations:

```text
Γ ⊢ (T |: {P}) <: T

```text
Γ ⊢ P ⇒ Q
──────────────────────────────────────────────────

```text
Γ ⊢ (T |: {P}) <: (T |: {Q})

Implementations MUST support the following decidable predicate fragment: literal comparisons, bound propagation from control flow, syntactic equality up to alpha-renaming, transitive integer inequalities, and boolean combinations thereof.

Refinement predicates are statically verified by default. If proof fails outside `[[dynamic]]`, the program is ill-formed. If proof fails inside `[[dynamic]]`, lowering inserts a runtime check.

#### 14.8.5 Dynamic Semantics

Refinement types do not alter the underlying value representation. Failed dynamically-inserted refinement checks panic.

#### 14.8.6 Lowering

**(LLVMTy-Refine)**

```text
Γ ⊢ LLVMTy(T) ⇓ τ
───────────────────────────────────────────────

```text
Γ ⊢ LLVMTy(TypeRefine(T, P)) ⇓ τ

Feature-local lowering consists only of optional runtime predicate checks when static verification is not discharged inside `[[dynamic]]` scopes.

#### 14.8.7 Diagnostics

Diagnostics are defined for ill-formed or impure refinement predicates, failed static proof obligations for refinement introduction, and failing dynamic refinement checks.

### 14.9 Capability Classes

#### 14.9.1 Syntax

Capability classes use the ordinary class syntax from §14.3 and dynamic class type syntax from §14.6. No distinct surface grammar is introduced.

#### 14.9.2 Parsing

Capability classes have no feature-specific parser beyond ordinary class parsing and `$Class` type parsing.

#### 14.9.3 AST Representation / Form

CapClass = {`FileSystem`, `Network`, `HeapAllocator`, `ExecutionDomain`, `Reactor`}
CapType(Cl) = TypeDynamic(Cl)

FileSystemInterface =
{

```text
 ⟨"open_read", `const`, [⟨⊥, `path`, TypeString(`@View`)⟩], TypeUnion([TypeModalState(["File"], `@Read`), TypePath(["IoError"])])⟩,

```text
 ⟨"open_write", `const`, [⟨⊥, `path`, TypeString(`@View`)⟩], TypeUnion([TypeModalState(["File"], `@Write`), TypePath(["IoError"])])⟩,

```text
 ⟨"open_append", `const`, [⟨⊥, `path`, TypeString(`@View`)⟩], TypeUnion([TypeModalState(["File"], `@Append`), TypePath(["IoError"])])⟩,

```text
 ⟨"create_write", `const`, [⟨⊥, `path`, TypeString(`@View`)⟩], TypeUnion([TypeModalState(["File"], `@Write`), TypePath(["IoError"])])⟩,

```text
 ⟨"read_file", `const`, [⟨⊥, `path`, TypeString(`@View`)⟩], TypeApply(["Outcome"], [TypePerm(`unique`, TypeString(`@Managed`)), TypePath(["IoError"])])⟩,

```text
 ⟨"read_bytes", `const`, [⟨⊥, `path`, TypeString(`@View`)⟩], TypeApply(["Outcome"], [TypePerm(`unique`, TypeBytes(`@Managed`)), TypePath(["IoError"])])⟩,

```text
 ⟨"write_file", `const`, [⟨⊥, `path`, TypeString(`@View`)⟩, ⟨⊥, `data`, TypeBytes(`@View`)⟩], TypeApply(["Outcome"], [TypePrim("()"), TypePath(["IoError"])])⟩,

```text
 ⟨"write_stdout", `const`, [⟨⊥, `data`, TypeString(`@View`)⟩], TypeApply(["Outcome"], [TypePrim("()"), TypePath(["IoError"])])⟩,

```text
 ⟨"write_stderr", `const`, [⟨⊥, `data`, TypeString(`@View`)⟩], TypeApply(["Outcome"], [TypePrim("()"), TypePath(["IoError"])])⟩,

```text
 ⟨"exists", `const`, [⟨⊥, `path`, TypeString(`@View`)⟩], TypePrim("bool")⟩,

```text
 ⟨"remove", `const`, [⟨⊥, `path`, TypeString(`@View`)⟩], TypeApply(["Outcome"], [TypePrim("()"), TypePath(["IoError"])])⟩,

```text
 ⟨"open_dir", `const`, [⟨⊥, `path`, TypeString(`@View`)⟩], TypeUnion([TypeModalState(["DirIter"], `@Open`), TypePath(["IoError"])])⟩,

```text
 ⟨"create_dir", `const`, [⟨⊥, `path`, TypeString(`@View`)⟩], TypeApply(["Outcome"], [TypePrim("()"), TypePath(["IoError"])])⟩,

```text
 ⟨"ensure_dir", `const`, [⟨⊥, `path`, TypeString(`@View`)⟩], TypeApply(["Outcome"], [TypePrim("()"), TypePath(["IoError"])])⟩,

```text
 ⟨"kind", `const`, [⟨⊥, `path`, TypeString(`@View`)⟩], TypeUnion([TypePath(["FileKind"]), TypePath(["IoError"])])⟩,

```text
 ⟨"restrict", `const`, [⟨⊥, `path`, TypeString(`@View`)⟩], TypeDynamic(`FileSystem`)⟩
}

NetworkInterface =
{

```text
 ⟨"restrict_to_host", `const`, [⟨⊥, `host`, TypeString(`@View`)⟩], TypeDynamic(`Network`)⟩
}

HeapAllocatorInterface =
{

```text
 ⟨"with_quota", `const`, [⟨⊥, `size`, TypePrim("usize")⟩], TypeDynamic(`HeapAllocator`)⟩,

```text
 ⟨"alloc_raw", `const`, [⟨⊥, `count`, TypePrim("usize")⟩], TypeRawPtr(`mut`, TypePrim("u8"))⟩,

```text
 ⟨"dealloc_raw", `const`, [⟨⊥, `ptr`, TypeRawPtr(`mut`, TypePrim("u8"))⟩, ⟨⊥, `count`, TypePrim("usize")⟩], TypePrim("()")⟩
}

FileKindVariants = [

```text
  VariantDecl(`File`, ⊥, ⊥, ⊥, ⊥),

```text
  VariantDecl(`Dir`, ⊥, ⊥, ⊥, ⊥),

```text
  VariantDecl(`Other`, ⊥, ⊥, ⊥, ⊥)
]

```text
FileKindDecl = EnumDecl(⊥, `public`, `FileKind`, ⊥, ⊥, [], FileKindVariants, ⊥, ⊥, ⊥)

IoErrorVariants = [

```text
  VariantDecl(`NotFound`, ⊥, ⊥, ⊥, ⊥),

```text
  VariantDecl(`PermissionDenied`, ⊥, ⊥, ⊥, ⊥),

```text
  VariantDecl(`AlreadyExists`, ⊥, ⊥, ⊥, ⊥),

```text
  VariantDecl(`InvalidPath`, ⊥, ⊥, ⊥, ⊥),

```text
  VariantDecl(`Busy`, ⊥, ⊥, ⊥, ⊥),

```text
  VariantDecl(`IoFailure`, ⊥, ⊥, ⊥, ⊥)
]

```text
IoErrorDecl = EnumDecl(⊥, `public`, `IoError`, ⊥, ⊥, [], IoErrorVariants, ⊥, ⊥, ⊥)

DirEntryFields = [

```text
  ⟨⊥, `public`, false, `name`, TypeString(`@Managed`), ⊥, ⊥, ⊥⟩,

```text
  ⟨⊥, `public`, false, `path`, TypeString(`@Managed`), ⊥, ⊥, ⊥⟩,

```text
  ⟨⊥, `public`, false, `kind`, TypePath(["FileKind"]), ⊥, ⊥, ⊥⟩
]

```text
DirEntryDecl = RecordDecl(⊥, `public`, `DirEntry`, ⊥, ⊥, [], DirEntryFields, ⊥, ⊥, ⊥)

AllocationErrorVariants = [

```text
  VariantDecl(`OutOfMemory`, TuplePayload([TypePrim("usize")]), ⊥, ⊥, ⊥),

```text
  VariantDecl(`QuotaExceeded`, TuplePayload([TypePrim("usize")]), ⊥, ⊥, ⊥)
]

```text
AllocationErrorDecl = EnumDecl(⊥, `public`, `AllocationError`, ⊥, ⊥, [], AllocationErrorVariants, ⊥, ⊥, ⊥)

ContextFields = [

```text
  ⟨⊥, `public`, false, `fs`, TypeDynamic(`FileSystem`), ⊥, ⊥, ⊥⟩,

```text
  ⟨⊥, `public`, false, `net`, TypeDynamic(`Network`), ⊥, ⊥, ⊥⟩,

```text
  ⟨⊥, `public`, false, `heap`, TypeDynamic(`HeapAllocator`), ⊥, ⊥, ⊥⟩,

```text
  ⟨⊥, `public`, false, `sys`, TypePath(["System"]), ⊥, ⊥, ⊥⟩,

```text
  ⟨⊥, `public`, false, `reactor`, TypeDynamic(`Reactor`), ⊥, ⊥, ⊥⟩
]
ContextMethods = [

```text
  MethodDecl(⊥, `public`, false, "cpu", ⊥, ReceiverShorthand(`const`), [], TypeDynamic(`ExecutionDomain`), ⊥, ⊥, ⊥, ⊥),

```text
  MethodDecl(⊥, `public`, false, "gpu", ⊥, ReceiverShorthand(`const`), [], TypeDynamic(`ExecutionDomain`), ⊥, ⊥, ⊥, ⊥),

```text
  MethodDecl(⊥, `public`, false, "inline", ⊥, ReceiverShorthand(`const`), [], TypeDynamic(`ExecutionDomain`), ⊥, ⊥, ⊥, ⊥)
]
ContextMembers = ContextFields ++ ContextMethods

```text
ContextDecl = RecordDecl(⊥, `public`, `Context`, ⊥, ⊥, [], ContextMembers, ⊥, ⊥, ⊥)

SystemInterface =
{

```text
 ⟨"exit", [⟨⊥, `code`, TypePrim("i32")⟩], TypePrim("!")⟩,

```text
 ⟨"get_env", [⟨⊥, `key`, TypeString(`@View`)⟩], TypeString(`@View`)⟩,

```text
 ⟨"executable_path", [], TypeString(`@View`)⟩,

```text
 ⟨"argument_count", [], TypePrim("usize")⟩,

```text
 ⟨"argument", [⟨⊥, `index`, TypePrim("usize")⟩], TypeString(`@View`)⟩,

```text
 ⟨"current_directory", [], TypeString(`@View`)⟩,

```text
 ⟨"run", [⟨⊥, `command`, TypeString(`@View`)⟩], TypePrim("i32")⟩
}
SystemMembers = [

```text
  MethodDecl(⊥, `public`, false, "exit", ⊥, ReceiverShorthand(`const`), [⟨⊥, `code`, TypePrim("i32")⟩], TypePrim("!"), ⊥, ⊥, ⊥, ⊥),

```text
  MethodDecl(⊥, `public`, false, "get_env", ⊥, ReceiverShorthand(`const`), [⟨⊥, `key`, TypeString(`@View`)⟩], TypeString(`@View`), ⊥, ⊥, ⊥, ⊥),

```text
  MethodDecl(⊥, `public`, false, "executable_path", ⊥, ReceiverShorthand(`const`), [], TypeString(`@View`), ⊥, ⊥, ⊥, ⊥),

```text
  MethodDecl(⊥, `public`, false, "argument_count", ⊥, ReceiverShorthand(`const`), [], TypePrim("usize"), ⊥, ⊥, ⊥, ⊥),

```text
  MethodDecl(⊥, `public`, false, "argument", ⊥, ReceiverShorthand(`const`), [⟨⊥, `index`, TypePrim("usize")⟩], TypeString(`@View`), ⊥, ⊥, ⊥, ⊥),

```text
  MethodDecl(⊥, `public`, false, "current_directory", ⊥, ReceiverShorthand(`const`), [], TypeString(`@View`), ⊥, ⊥, ⊥, ⊥),

```text
  MethodDecl(⊥, `public`, false, "run", ⊥, ReceiverShorthand(`const`), [⟨⊥, `command`, TypeString(`@View`)⟩], TypePrim("i32"), ⊥, ⊥, ⊥, ⊥)
]

```text
SystemDecl = RecordDecl(⊥, `public`, `System`, ⊥, ⊥, [], SystemMembers, ⊥, ⊥, ⊥)

```text
CpuSetDecl = TypeAliasDecl(⊥, `public`, `CpuSet`, ⊥, ⊥, TypePrim("u64"), ⊥, ⊥)
PriorityVariants = [

```text
  VariantDecl(`Low`, ⊥, ⊥, ⊥, ⊥),

```text
  VariantDecl(`Normal`, ⊥, ⊥, ⊥, ⊥),

```text
  VariantDecl(`High`, ⊥, ⊥, ⊥, ⊥)
]

```text
PriorityDecl = EnumDecl(⊥, `public`, `Priority`, ⊥, ⊥, [], PriorityVariants, ⊥, ⊥, ⊥)

```text
ReactorMethodParams = [⟨`T`, [], ⊥, ⊥⟩, ⟨`E`, [], ⊥, ⊥⟩]
ReactorMethods = [

```text
  ClassMethodDecl(⊥, `public`, "run", ReactorMethodParams, ReceiverShorthand(`const`), [⟨⊥, `future`, TypeApply(["Future"], [TypePath(["T"]), TypePath(["E"])])⟩], TypeUnion([TypePath(["T"]), TypePath(["E"])]), ⊥, ⊥, ⊥, ⊥),

```text
  ClassMethodDecl(⊥, `public`, "register", ReactorMethodParams, ReceiverShorthand(`const`), [⟨⊥, `future`, TypeApply(["Future"], [TypePath(["T"]), TypePath(["E"])])⟩], TypeApply(["Tracked"], [TypePath(["T"]), TypePath(["E"])]), ⊥, ⊥, ⊥, ⊥)
]

```text
ReactorMethodNames = { m.name | m ∈ ReactorMethods }

```text
ReactorDecl = ClassDecl(⊥, `public`, false, `Reactor`, ⊥, ⊥, [], ReactorMethods, ⊥, ⊥)

```text
Σ.Classes["Reactor"] = ReactorDecl

```text
CapMethodSig(`FileSystem`, name) = ⟨params, ret⟩ ⇔ ⟨name, recv, params, ret⟩ ∈ FileSystemInterface

```text
CapMethodSig(`Network`, name) = ⟨params, ret⟩ ⇔ ⟨name, recv, params, ret⟩ ∈ NetworkInterface

```text
CapMethodSig(`HeapAllocator`, name) = ⟨params, ret⟩ ⇔ ⟨name, recv, params, ret⟩ ∈ HeapAllocatorInterface

```text
CapMethodSig(`Reactor`, name) = ⟨params, ret⟩ ⇔ LookupClassMethod(`Reactor`, name) = m ∧ Sig_T(SelfVar, m) = ⟨_, params, ret⟩

```text
SystemMethodSig(name) = ⟨params, ret⟩ ⇔ ⟨name, params, ret⟩ ∈ SystemInterface

```text
CapRecv(`FileSystem`, name) = recv ⇔ ⟨name, recv, params, ret⟩ ∈ FileSystemInterface

```text
CapRecv(`Network`, name) = recv ⇔ ⟨name, recv, params, ret⟩ ∈ NetworkInterface

```text
CapRecv(`HeapAllocator`, name) = recv ⇔ ⟨name, recv, params, ret⟩ ∈ HeapAllocatorInterface

```text
CapRecv(`Reactor`, name) = recv ⇔ LookupClassMethod(`Reactor`, name) = m ∧ RecvPerm(SelfVar, m.receiver) = recv

LowerCallJudg = {MethodSymbol, BuiltinMethodSym, LowerMethodCall, LowerArgs, LowerRecvArg}

```text
ModalStateOf(T) = TypeModalState(modal_ref, S) ⇔ StripPerm(T) = TypeModalState(modal_ref, S)
BuiltinCapClass = {`FileSystem`, `Network`, `HeapAllocator`, `Reactor`}

#### 14.9.4 Static Semantics

Capability classes are ordinary classes in the type system. A parameter of type `$Class` accepts any concrete type implementing `Class`.

Capability classes MAY be used as generic bounds exactly like any other class bound.

The built-in capability class names `FileSystem`, `Network`, `HeapAllocator`, `ExecutionDomain`, and `Reactor` are reserved. Type-system use of those names is via `CapType(Cl) = TypeDynamic(Cl)`.

Calls to `HeapAllocator.alloc_raw` and `HeapAllocator.dealloc_raw` require `unsafe` context.

**(AllocRaw-Unsafe-Err)**

```text
Γ; R; L ⊢ base : TypeDynamic(`HeapAllocator`)    ¬ UnsafeSpan(span(MethodCall(base, "alloc_raw", args)))    c = Code(AllocRaw-Unsafe-Err)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ MethodCall(base, "alloc_raw", args) ⇑ c

**(DeallocRaw-Unsafe-Err)**

```text
Γ; R; L ⊢ base : TypeDynamic(`HeapAllocator`)    ¬ UnsafeSpan(span(MethodCall(base, "dealloc_raw", args)))    c = Code(DeallocRaw-Unsafe-Err)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ MethodCall(base, "dealloc_raw", args) ⇑ c

BuiltinTypes_FS = {`File`, `DirIter`, `DirEntry`, `FileKind`, `IoError`}

RecordDecl(["DirEntry"]) = DirEntryDecl
RecordDecl(["Context"]) = ContextDecl
RecordDecl(["System"]) = SystemDecl
EnumDecl(["FileKind"]) = FileKindDecl
EnumDecl(["IoError"]) = IoErrorDecl
EnumDecl(["AllocationError"]) = AllocationErrorDecl
EnumDecl(["Priority"]) = PriorityDecl

```text
Σ.Types["DirEntry"] = DirEntryDecl

```text
Σ.Types["FileKind"] = FileKindDecl

```text
Σ.Types["IoError"] = IoErrorDecl

```text
Σ.Types["AllocationError"] = AllocationErrorDecl

```text
Σ.Types["Context"] = ContextDecl

```text
Σ.Types["System"] = SystemDecl

```text
Σ.Types["CpuSet"] = CpuSetDecl

```text
Σ.Types["Priority"] = PriorityDecl

```text
BuiltInContext(T) ⇔ T = TypePath(["Context"]) ∧ RecordDecl(["Context"]) = ContextDecl

ContextBundleFieldType(`fs`) = TypeDynamic(`FileSystem`)
ContextBundleFieldType(`net`) = TypeDynamic(`Network`)
ContextBundleFieldType(`heap`) = TypeDynamic(`HeapAllocator`)
ContextBundleFieldType(`sys`) = TypePath(["System"])
ContextBundleFieldType(`reactor`) = TypeDynamic(`Reactor`)
ContextBundleFieldType(`cpu`) = TypeDynamic(`ExecutionDomain`)
ContextBundleFieldType(`gpu`) = TypeDynamic(`ExecutionDomain`)
ContextBundleFieldType(`inline`) = TypeDynamic(`ExecutionDomain`)

```text
ContextBundleType(T) ⇔ AliasNorm(T) = TypePath(["Context"])

```text
ContextBundleType(T) ⇔ AliasNorm(T) = TypePath(p) ∧ p ≠ ["Context"] ∧ RecordDecl(p) = R ∧ ∀ f ∈ Fields(R). ((∃ T_f. ContextBundleFieldType(f.name) = T_f ∧ StripPerm(f.type) = T_f) ∨ ContextBundleType(StripPerm(f.type)))

```text
ContextBundleFieldValue(v_ctx, `fs`) ⇓ v ⇔ FieldValue(v_ctx, `fs`) = v

```text
ContextBundleFieldValue(v_ctx, `net`) ⇓ v ⇔ FieldValue(v_ctx, `net`) = v

```text
ContextBundleFieldValue(v_ctx, `heap`) ⇓ v ⇔ FieldValue(v_ctx, `heap`) = v

```text
ContextBundleFieldValue(v_ctx, `sys`) ⇓ v ⇔ FieldValue(v_ctx, `sys`) = v

```text
ContextBundleFieldValue(v_ctx, `reactor`) ⇓ v ⇔ FieldValue(v_ctx, `reactor`) = v

```text
ContextBundleFieldValue(v_ctx, `cpu`) ⇓ v ⇔ ContextDomainValue(v_ctx, `cpu`) ⇓ v

```text
ContextBundleFieldValue(v_ctx, `gpu`) ⇓ v ⇔ ContextDomainValue(v_ctx, `gpu`) ⇓ v

```text
ContextBundleFieldValue(v_ctx, `inline`) ⇓ v ⇔ ContextDomainValue(v_ctx, `inline`) ⇓ v

```text
ContextDomainValue(v_ctx, m) ⇓ v ⇔ m ∈ {`cpu`, `gpu`, `inline`} ∧ v is the value denoted by evaluating the corresponding built-in `Context` method on v_ctx

```text
ContextBundleBuild(T, v_ctx) ⇓ v_ctx ⇔ AliasNorm(T) = TypePath(["Context"])

```text
ContextBundleBuild(T, v_ctx) ⇓ RecordValue(TypePath(p), fs_out) ⇔

```text
  AliasNorm(T) = TypePath(p) ∧ p ≠ ["Context"] ∧ RecordDecl(p) = R ∧

```text
  fs_out = [⟨f.name, v_f⟩ | f ∈ Fields(R) ∧ ((∃ T_f. ContextBundleFieldType(f.name) = T_f ∧ StripPerm(f.type) = T_f ∧ ContextBundleFieldValue(v_ctx, f.name) ⇓ v_f) ∨ (ContextBundleType(StripPerm(f.type)) ∧ ContextBundleBuild(StripPerm(f.type), v_ctx) ⇓ v_f))]

```text
AllocErrorVal(r) ⇔ ∃ s. r = EnumValue(["AllocationError", "OutOfMemory"], TuplePayload([s])) ∨ r = EnumValue(["AllocationError", "QuotaExceeded"], TuplePayload([s]))

#### 14.9.5 Dynamic Semantics

Capability classes introduce no separate dispatch model. Built-in capability operations have primitive implementations, but capability values are still expressed through the same dynamic-class-object machinery as other dispatchable classes.

#### 14.9.6 Lowering

Calls on dynamic receivers of builtin capability classes `FileSystem`, `Network`, `HeapAllocator`, and `Reactor` lower to builtin method symbols rather than emitted vtable-call sequences. Other capability classes lower through the ordinary dynamic-dispatch path of §14.6.

#### 14.9.7 Diagnostics

Diagnostics are defined for capability operations that require `unsafe`, including raw allocation and deallocation through `HeapAllocator`.

### 14.10 Foundational Classes and Predicates

#### 14.10.1 Syntax

Foundational classes use ordinary class syntax from §14.3. The foundational names `Bitcopy`, `Clone`, `Drop`, `FfiSafe`, `Eq`, `Hasher`, `Hash`, `Iterator`, and `Step` are reserved.

#### 14.10.2 Parsing

Foundational classes and predicates have no feature-specific parse form beyond ordinary class parsing and predicate-requirement parsing from §14.1.

#### 14.10.3 AST Representation / Form

FoundationalClassName = {`Bitcopy`, `Clone`, `Drop`, `FfiSafe`, `Eq`, `Hasher`, `Hash`, `Iterator`, `Step`}

```text
BitcopyDropJudg = {Γ ⊢ T : BitcopyDropOk}
BitcopyJudg = {BitcopyType}
CloneJudg = {CloneType}
DropJudg = {DropType}

```text
HasCloneMethod(T) ⇔ ∃ p, R, m. T = TypePath(p) ∧ RecordDecl(p) = R ∧ m ∈ Methods(R) ∧ MethodName(m) = `clone` ∧ Sig_T(T, m) = ⟨TypePerm(`const`, T), [], T⟩

```text
HasDropMethod(T) ⇔ ∃ p, R, m. T = TypePath(p) ∧ RecordDecl(p) = R ∧ m ∈ Methods(R) ∧ MethodName(m) = `drop` ∧ Sig_T(T, m) = ⟨TypePerm(`unique`, T), [], TypePrim("()")⟩

```text
CloneType(T) ⇔ BuiltinCloneType(T) ∨ HasCloneMethod(StripPerm(T)) ∨ BitcopyType(T)

```text
DropType(T) ⇔ BuiltinDropType(T) ∨ HasDropMethod(StripPerm(T))

```text
BuiltinStepType(T) ⇔ StripPerm(T) = TypePrim(t) ∧ t ∈ IntTypes ∪ UnsignedIntTypes ∪ {`char`}

```text
ImplementsEq(T) ⇔ EqType(T) ∨ `Eq` ∈ Implements(T)

```text
ImplementsHash(T) ⇔ `Hash` ∈ Implements(T)

```text
ImplementsIterator(T) ⇔ `Iterator` ∈ Implements(T)

```text
ImplementsStep(T) ⇔ BuiltinStepType(T) ∨ `Step` ∈ Implements(T)

```text
ImplementsHasher(T) ⇔ `Hasher` ∈ Implements(T)

#### 14.10.4 Static Semantics

Foundational class bounds for `Bitcopy`, `Clone`, `Drop`, and `FfiSafe` are interpreted by intrinsic satisfaction judgments, not by user-defined class implementation lookup. `Eq` is satisfied intrinsically when `EqType(T)` holds. `Step` is satisfied intrinsically when `BuiltinStepType(T)` holds. Other `Eq` and `Step` obligations are discharged through ordinary class implementation lookup.

**(BitcopyDrop-Ok)**
¬(BitcopyType(T) ∧ DropType(T))
──────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T : BitcopyDropOk

**(BitcopyDrop-Conflict)**
BitcopyType(T) ∧ DropType(T)
─────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T : BitcopyDropOk ⇑

```text
BitcopyType(T) ⇔ BitcopyTypeCore(T)

```text
BitcopyTypeCore(T) ⇔
 false    if T = TypePerm(`unique`, _)

```text
 BitcopyTypeCore(T_0)    if T = TypePerm(p, T_0) ∧ p ≠ `unique`
 BuiltinBitcopyType(T) ∨

```text
 (T = TypeTuple([T_1, …, T_n]) ∧ ∀ i ∈ 1..n, BitcopyType(T_i)) ∨

```text
 (T = TypeArray(T_0, e) ∧ Γ ⊢ ConstLen(e) ⇓ _ ∧ BitcopyType(T_0)) ∨

```text
 (T = TypeUnion([T_1, …, T_n]) ∧ ∀ i ∈ 1..n, BitcopyType(T_i)) ∨

```text
 (T = TypePath(p) ∧ RecordDecl(p) = R ∧ ∀ f : T_f ∈ Fields(R). BitcopyType(T_f)) ∨

```text
 (T = TypePath(p) ∧ EnumDecl(p) = E ∧ ∀ v ∈ Variants(E). ∀ T_f ∈ PayloadTypes(v). BitcopyType(T_f)) ∨

```text
 (T = TypeModalState(modal_ref, S) ∧ ModalDeclOf(modal_ref) = M ∧ ∀ T_f ∈ ModalPayload(modal_ref, S). BitcopyType(T_f)) ∨

```text
 (T = ModalRefType(modal_ref) ∧ ModalDeclOf(modal_ref) = M ∧ ∀ S ∈ States(M). ∀ T_f ∈ ModalPayload(modal_ref, S). BitcopyType(T_f))

```text
BuiltinBitcopyType(T) ⇔

```text
 T = TypePrim(t) ∧ t ∈ PrimTypeNames ∨
 T = TypePtr(U, s) ∨
 T = TypeRawPtr(q, U) ∨
 T = TypeSlice(U) ∨
 T = TypeFunc(ps, R) ∨
 T = TypeDynamic(Cl) ∨
 (T = TypeRange(U) ∧ BitcopyType(U)) ∨
 (T = TypeRangeInclusive(U) ∧ BitcopyType(U)) ∨
 (T = TypeRangeFrom(U) ∧ BitcopyType(U)) ∨
 (T = TypeRangeTo(U) ∧ BitcopyType(U)) ∨
 (T = TypeRangeToInclusive(U) ∧ BitcopyType(U)) ∨
 T = TypeRangeFull ∨
 T = TypeString(`@View`) ∨
 T = TypeBytes(`@View`) ∨
 T = TypePath(["FileKind"]) ∨
 T = TypePath(["IoError"]) ∨
 T = TypePath(["Context"]) ∨
 T = TypePath(["System"])

```text
BuiltinDropType(T) ⇔ T = TypeString(`@Managed`) ∨ T = TypeBytes(`@Managed`)

```text
BuiltinCloneType(T) ⇔ BuiltinBitcopyType(T)

The built-in class signatures are:

- `Eq`: `eq(~, other: const Self) -> bool`
- `Hasher`: `write(~!, data: bytes@View) -> ()`; `finish(~) -> u64`
- `Hash`: `hash(~, hasher: unique Hasher) -> ()`
- `Iterator`: associated type `Item`; `next(~!) -> Self::Item | ()`
- `Step`: `successor(~) -> Self | ()`; `predecessor(~) -> Self | ()`

`Eq::eq` MUST be reflexive, symmetric, and transitive.

`Hash` implementations MUST also implement `Eq`, and equal values MUST produce equal hash results when hashed from identical initial hasher states.

`Iterator::next` returns `Self::Item` while iteration remains, or `()` when exhausted.

`Step::successor` and `Step::predecessor` define a discrete stepping relation and are partial inverses when both are defined.

#### 14.10.5 Dynamic Semantics

`drop` is invoked implicitly by scope exit when `DropType(T)` holds. `clone` on a `BitcopyType` value is equivalent to the implicit bitwise duplication already permitted by that predicate.

`Hasher` maintains an internal `u64` state. `write` appends bytes to the input stream. `finish` returns the FNV-1a 64-bit hash of the concatenated byte stream using `FNVOffset64` and `FNVPrime64`.

```text
For `BuiltinStepType(T)` with `StripPerm(T) = TypePrim(t)` and `t ∈ IntTypes ∪ UnsignedIntTypes`, `Step::successor` returns the least representable value greater than the receiver when one exists, or `()` otherwise; `Step::predecessor` returns the greatest representable value smaller than the receiver when one exists, or `()` otherwise.

```text
For `BuiltinStepType(T)` with `StripPerm(T) = TypePrim(`char`)`, `Step::successor` returns `CharVal(u')` where `u' = min { v ∈ UnicodeScalar | v > u }` for receiver `CharVal(u)` when such `u'` exists, or `()` otherwise; `Step::predecessor` returns `CharVal(u')` where `u' = max { v ∈ UnicodeScalar | v < u }` when such `u'` exists, or `()` otherwise.

#### 14.10.6 Lowering

`Eq::eq` on `EqType(T)` lowers intrinsically to the built-in equality relation for `T`. `Step::successor` and `Step::predecessor` on `BuiltinStepType(T)` lower intrinsically to the built-in stepping relation for `T`. Other `Eq` and `Step` calls lower through ordinary method-call lowering.

These predicates and built-in classes do not introduce a separate representation. They influence lowering indirectly through copy semantics, drop-glue generation, built-in `Eq`/`Step` call selection, and whether a dynamic-class-object vtable header carries a non-null drop entry.

#### 14.10.7 Diagnostics

Diagnostics are defined for types that simultaneously satisfy `BitcopyType` and `DropType`, and for direct user calls to the implicit `drop` protocol on types where destruction is reserved to the language runtime.

### 14.11 Refinement and Polymorphism Diagnostics Supplement

This section owns diagnostics for refinement types, generic instantiation, class implementation, dynamic objects, and foundational predicate requirements.

| Code         | Severity | Detection    | Condition                                                                           |
| ------------ | -------- | ------------ | ----------------------------------------------------------------------------------- |
| `E-TYP-1953` | Error    | Compile-time | Refinement not provable outside `[[dynamic]]` scope                                 |
| `E-TYP-1954` | Error    | Compile-time | Impure expression in refinement predicate                                           |
| `E-TYP-1955` | Error    | Compile-time | Predicate does not evaluate to `bool`                                               |
| `E-TYP-1956` | Error    | Compile-time | `self` used in inline parameter constraint                                          |
| `E-TYP-1957` | Error    | Compile-time | Circular type dependency in refinement predicate                                    |
| `P-TYP-1953` | Panic    | Runtime      | Refinement predicate failed at runtime                                              |
| `E-TYP-2301` | Error    | Compile-time | Type arguments cannot be inferred; explicit instantiation required                  |
| `E-TYP-2302` | Error    | Compile-time | Type argument does not satisfy required class bound or predicate                    |
| `E-TYP-2303` | Error    | Compile-time | Wrong number of type arguments                                                      |
| `E-TYP-2304` | Error    | Compile-time | Duplicate type parameter name in generic declaration                                |
| `E-TYP-2305` | Error    | Compile-time | Class bound references a non-class type                                             |
| `E-TYP-2307` | Error    | Compile-time | Infinite monomorphization recursion                                                 |
| `E-TYP-2308` | Error    | Compile-time | Monomorphization depth limit exceeded                                               |
| `E-TYP-2401` | Error    | Compile-time | Non-modal type implements modal class                                               |
| `E-TYP-2402` | Error    | Compile-time | Implementing type missing required field                                            |
| `E-TYP-2403` | Error    | Compile-time | Implementing modal missing required state                                           |
| `E-TYP-2404` | Error    | Compile-time | Implementing field has incompatible type                                            |
| `E-TYP-2405` | Error    | Compile-time | Implementing state missing required payload field                                   |
| `E-TYP-2406` | Error    | Compile-time | Conflicting field names from multiple classes                                       |
| `E-TYP-2407` | Error    | Compile-time | Conflicting state names from multiple classes                                       |
| `E-TYP-2408` | Error    | Compile-time | Duplicate abstract field name in class                                              |
| `E-TYP-2409` | Error    | Compile-time | Duplicate abstract state name in class                                              |
| `E-TYP-2500` | Error    | Compile-time | Duplicate procedure name in class                                                   |
| `E-TYP-2501` | Error    | Compile-time | `override` used on abstract procedure implementation                                |
| `E-TYP-2502` | Error    | Compile-time | Missing `override` on concrete procedure replacement                                |
| `E-TYP-2503` | Error    | Compile-time | Type does not implement required procedure from class or has incompatible signature |
| `E-TYP-2504` | Error    | Compile-time | Duplicate associated type name in class                                             |
| `E-TYP-2505` | Error    | Compile-time | Name conflict among class members                                                   |
| `E-TYP-2506` | Error    | Compile-time | Coherence violation: duplicate class implementation                                 |
| `E-TYP-2507` | Error    | Compile-time | Orphan rule violation: neither type nor class is local                              |
| `E-TYP-2508` | Error    | Compile-time | Cyclic superclass dependency detected                                               |
| `E-TYP-2509` | Error    | Compile-time | Superclass bound refers to undefined class                                          |
| `E-TYP-2510` | Error    | Compile-time | Accessing member not defined on opaque type's class                                 |
| `E-TYP-2511` | Error    | Compile-time | Opaque return type does not implement required class                                |
| `E-TYP-2512` | Error    | Compile-time | Attempting to assign incompatible opaque types                                      |
| `E-TYP-2530` | Error    | Compile-time | Type argument does not satisfy class constraint                                     |
| `E-TYP-2531` | Error    | Compile-time | Unconstrained type parameter used in class method                                   |
| `E-TYP-2540` | Error    | Compile-time | Non-vtable-eligible procedure called on `$`                                         |
| `E-TYP-2541` | Error    | Compile-time | Dynamic class type created from non-dispatchable class                              |
| `E-TYP-2542` | Error    | Compile-time | Generic procedure in class is not vtable-eligible for `$` dispatch                  |
| `E-TYP-2621` | Error    | Compile-time | Type satisfies both `BitcopyType` and `DropType`                                    |
| `E-TYP-2622` | Error    | Compile-time | `BitcopyType` has non-`BitcopyType` field                                           |
| `E-UNS-0105` | Error    | Compile-time | `override` used with no concrete procedure to override                              |
| `E-UNS-0106` | Error    | Compile-time | Conflicting procedure signatures from multiple classes                              |
