---
title: "Compile-Time Execution and Metaprogramming"
description: "22. Compile-Time Execution and Metaprogramming of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T17:39:45.389Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## 22. Compile-Time Execution and Metaprogramming

Phase 2 executes compile-time forms over the Phase 1 module set before name resolution and type checking of the expanded program.

### 22.1 Compile-Time Forms

#### 22.1.1 Syntax

```text
comptime_stmt           ::= attribute_list? "comptime" block_expr
comptime_expr           ::= attribute_list? "comptime" "{" expression "}"
comptime_if             ::= "comptime" "if" expression block_expr ("else" (comptime_if | block_expr))?
comptime_loop           ::= "comptime" "loop" pattern (":" type)? "in" expression block_expr
comptime_procedure_decl ::= attribute_list? "comptime" visibility? "procedure" identifier generic_params? signature contract_clause? block_expr
type_literal            ::= "Type" "::<" type ">"
```

#### 22.1.2 Parsing

CtParseJudg = {ParseCtStmt, ParseCtExpr, ParseCtIf, ParseCtLoopIter, ParseCtProc, ParseCtElseOpt}

**(Parse-CtProc)**

```text
Γ ⊢ ParseAttrListOpt(P) ⇓ (P_0, attrs_opt)    IsKw(Tok(P_0), `comptime`)    Γ ⊢ ParseVis(Advance(P_0)) ⇓ (P_1, vis)    IsKw(Tok(P_1), `procedure`)    Γ ⊢ ParseIdent(Advance(P_1)) ⇓ (P_2, name)    Γ ⊢ ParseGenericParamsOpt(P_2) ⇓ (P_3, gen_params_opt)    Γ ⊢ ParseSignature(P_3) ⇓ (P_4, params, ret_opt)    Γ ⊢ ParseContractClauseOpt(P_4) ⇓ (P_5, contract_opt)    Γ ⊢ ParseBlock(P_5) ⇓ (P_6, body)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseItem(P) ⇓ (P_6, CtProc(attrs_opt, vis, name, gen_params_opt, params, ret_opt, contract_opt, body, SpanBetween(P, P_6), []))
```

**(Parse-CtStmt)**

```text
Γ ⊢ ParseAttrListOpt(P) ⇓ (P_0, attrs_opt)    IsKw(Tok(P_0), `comptime`)    IsPunc(Tok(Advance(P_0)), "{")    Γ ⊢ ParseBlock(Advance(P_0)) ⇓ (P_1, body)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseStmt(P) ⇓ (P_1, CtStmt(body, attrs_opt, SpanBetween(P, P_1)))
```

**(Parse-CtExpr)**

```text
Γ ⊢ ParseAttrListOpt(P) ⇓ (P_0, attrs_opt)    IsKw(Tok(P_0), `comptime`)    IsPunc(Tok(Advance(P_0)), "{")    Γ ⊢ ParseExpr(Advance(Advance(P_0))) ⇓ (P_1, body)    IsPunc(Tok(P_1), "}")
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseExpr(P) ⇓ (Advance(P_1), CtExpr(body, attrs_opt, SpanBetween(P, Advance(P_1))))
```

**(Parse-CtIf)**

```text
IsKw(Tok(P), `comptime`)    IsKw(Tok(Advance(P)), `if`)    Γ ⊢ ParseExpr_NoBrace(Advance(Advance(P))) ⇓ (P_1, cond)    Γ ⊢ ParseBlock(P_1) ⇓ (P_2, then_blk)    Γ ⊢ ParseCtElseOpt(P_2) ⇓ (P_3, else_opt)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseExpr(P) ⇓ (P_3, CtIf(cond, then_blk, else_opt, SpanBetween(P, P_3)))
```

**(Parse-CtLoopIter)**

```text
IsKw(Tok(P), `comptime`)    IsKw(Tok(Advance(P)), `loop`)    Γ ⊢ TryParsePatternIn(Advance(Advance(P))) ⇓ (P_1, pat)    Γ ⊢ ParseTypeAnnotOpt(P_1) ⇓ (P_2, ty_opt)    Ctx(Tok(P_2), "in")    Γ ⊢ ParseExpr_NoBrace(Advance(P_2)) ⇓ (P_3, src)    Γ ⊢ ParseBlock(P_3) ⇓ (P_4, body)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseExpr(P) ⇓ (P_4, CtLoopIter(pat, ty_opt, src, body, SpanBetween(P, P_4)))
```

**(Parse-CtElseOpt-None)**

```text
¬ IsKw(Tok(P), `else`)
```

──────────────────────────────────────────────

```text
Γ ⊢ ParseCtElseOpt(P) ⇓ (P, ⊥)
```

**(Parse-CtElseOpt-Block)**

```text
IsKw(Tok(P), `else`)    ¬ IsKw(Tok(Advance(P)), `comptime`)    Γ ⊢ ParseBlock(Advance(P)) ⇓ (P_1, body)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseCtElseOpt(P) ⇓ (P_1, body)
```

**(Parse-CtElseOpt-ElseIf)**

```text
IsKw(Tok(P), `else`)    IsKw(Tok(Advance(P)), `comptime`)    IsKw(Tok(Advance(Advance(P))), `if`)    Γ ⊢ ParseExpr(Advance(P)) ⇓ (P_1, e_if)    e_if = CtIf(_, _, _, _)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseCtElseOpt(P) ⇓ (P_1, BlockExpr([ExprStmt(e_if)], ⊥))
```

#### 22.1.3 AST Representation / Form

CtNode = {CtStmt, CtExpr, CtIf, CtLoopIter, CtProc}

CtStmt(body, attrs_opt, span) is a compile-time statement block.
CtExpr(body, attrs_opt, span) is a compile-time expression.
CtIf(cond, then_blk, else_opt, span) is a compile-time branch.
CtLoopIter(pat, ty_opt, src, body, span) is a compile-time iterator-unrolling form.
CtProc(attrs_opt, vis, name, gen_params_opt, params, ret_opt, contract_opt, body, span, doc) is a compile-time procedure declaration.

```text
CtSite = ⟨module_path, ordinal, span⟩
CtEnv = ⟨vals, procs, caps, site, quote_ctx⟩
CtMachine = ⟨files, project_root, diags, pending_emits, next_hygiene⟩
CtQuoteCtx = ⊥ | ⟨kind, quote_site⟩
```

```text
CtVals(⟨vals, procs, caps, site, quote_ctx⟩) = vals
CtProcs(⟨vals, procs, caps, site, quote_ctx⟩) = procs
CtCaps(⟨vals, procs, caps, site, quote_ctx⟩) = caps
CtSiteOf(⟨vals, procs, caps, site, quote_ctx⟩) = site
CtQuoteCtxOf(⟨vals, procs, caps, site, quote_ctx⟩) = quote_ctx
```

```text
CtFiles(⟨files, project_root, diags, pending_emits, next_hygiene⟩) = files
CtProjectRoot(⟨files, project_root, diags, pending_emits, next_hygiene⟩) = project_root
CtDiags(⟨files, project_root, diags, pending_emits, next_hygiene⟩) = diags
CtPendingEmits(⟨files, project_root, diags, pending_emits, next_hygiene⟩) = pending_emits
CtFreshSeed(⟨files, project_root, diags, pending_emits, next_hygiene⟩) = next_hygiene
```

CtAvailableJudg = {CtAvail}
CtLiteralJudg = {CtLiteralize}
CtEvalJudg = {CtEval, CtExec}
CtExpandableJudg = {CtExpandExpr, CtExpandStmt, CtExpandStmtSeq, CtExpandBlock, CtExpandItem, CtExpandItemSeq}
CtBuiltinCallJudg = {CtBuiltinCall}
CtOrderJudg = {Phase2ModuleOrder}
CtPassJudg = {ComptimePass, CtExecModule, CtExecModuleSeq}

CtValue ::= CtPrim(v) | CtString(v) | CtBytes(v) | CtType(T) | CtAst(a) | CtTuple([CtValue]) | CtArray([CtValue]) | CtSlice([CtValue]) | CtRecord(path, fields) | CtEnum(path, variant, payload)

```text
CtPayload ::= ⊥ | CtTuplePayload([CtValue]) | CtRecordPayload([⟨field, CtValue⟩])
CtIterable(v) ⇔ v = CtArray(_) ∨ v = CtSlice(_)
CtIterableType(T) ⇔ T = TypeArray(U, _) ∨ T = TypeSlice(U)
```

ElemType(TypeArray(U, _)) = U
ElemType(TypeSlice(U)) = U

```text
CtMetaFree(n) ⇔ n contains no node owned by §§22.2 through 22.5
```

#### 22.1.4 Static Semantics

```text
In the rules below, `Γ_ct` denotes the typing environment obtained by extending `Γ` with the local bindings of the current compile-time body, the compile-time procedure bindings introduced earlier in the same Phase 2 source order, and the capability bindings admitted by §22.2 for the current site.
```

CtAvail(TypePrim(_))
CtAvail(TypeString(`@View`))
CtAvail(TypeString(`@Managed`))
CtAvail(TypeBytes(`@View`))
CtAvail(TypeBytes(`@Managed`))
CtAvail(TypePath([`Type`]))
CtAvail(TypePath([`Ast`]))
CtAvail(TypePath([`Ast`, `Expr`]))
CtAvail(TypePath([`Ast`, `Stmt`]))
CtAvail(TypePath([`Ast`, `Item`]))
CtAvail(TypePath([`Ast`, `Type`]))
CtAvail(TypePath([`Ast`, `Pattern`]))

```text
CtAvail(TypeTuple(Ts)) ⇔ ∀ T ∈ Ts. CtAvail(T)
CtAvail(TypeArray(T, _)) ⇔ CtAvail(T)
CtAvail(TypeSlice(T)) ⇔ CtAvail(T)
CtAvail(TypePath(p)) ⇔ RecordDecl(p) = R ∧ ∀ f ∈ Fields(R). CtAvail(StripPerm(f.type))
CtAvail(TypePath(p)) ⇔ EnumDecl(p) = E ∧ ∀ v ∈ Variants(E). ∀ T ∈ PayloadTypes(v). CtAvail(StripPerm(T))
CtAvail(TypePerm(_, T)) ⇔ CtAvail(T)
```

```text
CtForbiddenType(T) ⇔ CapInType(T) ≠ ∅ ∨ StripPerm(T) = TypeModalState(_, _) ∨ StripPerm(T) = TypeDynamic(_) ∨ StripPerm(T) = TypePtr(_, _) ∨ StripPerm(T) = TypeRawPtr(_, _) ∨ StripPerm(T) = TypeFunc(_, _) ∨ AliasNorm(T) = TypePath(["Context"])
```

A conforming implementation MUST reject any compile-time expression, compile-time variable, compile-time procedure parameter, or compile-time procedure return type for which `CtForbiddenType(T)` holds or `CtAvail(T)` does not hold.

The following constructs are prohibited inside compile-time execution:
- region allocation and frame operations
- key acquisition blocks and dynamic key synchronization
- `parallel`, `spawn`, `dispatch`, `wait`, `yield`, `yield from`, `sync`, `race`, and `all`
- raw-pointer dereference, `transmute`, and any `unsafe`-only operation
- any call that crosses an FFI boundary

**(T-CtStmt)**

```text
Γ_ct ⊢ body : TypePrim("()")
```

──────────────────────────────────────────────

```text
Γ ⊢ CtStmt(body, attrs_opt, span) : TypePrim("()")
```

**(T-CtExpr)**

```text
Γ_ct ⊢ body : T    CtAvail(T)    ¬ CtForbiddenType(T)
```

──────────────────────────────────────────────────────

```text
Γ ⊢ CtExpr(body, attrs_opt, span) : T
```

**(T-CtIf)**

```text
Γ_ct ⊢ cond : TypePrim("bool")    Γ_ct ⊢ then_blk : U    Γ_ct ⊢ else_blk : U
```

────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtIf(cond, then_blk, else_blk, span) : U
```

**(T-CtLoopIter)**

```text
Γ_ct ⊢ src : T_src    CtIterableType(T_src)    (ty_opt = ⊥ ⇒ T_elem = ElemType(T_src))    (ty_opt = T_ann ⇒ ElemType(T_src) <: T_ann ∧ T_elem = T_ann)    Γ_ct, pat : T_elem ⊢ body : TypePrim("()")
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtLoopIter(pat, ty_opt, src, body, span) : TypePrim("()")
```

**(T-CtProc)**

```text
proc = CtProc(attrs_opt, vis, name, gen_params_opt, params, ret_opt, contract_opt, body, span, doc)    ∀ ⟨_, _, T⟩ ∈ params. CtAvail(T) ∧ ¬ CtForbiddenType(T)    CtAvail(ProcReturn(ret_opt))    ¬ CtForbiddenType(ProcReturn(ret_opt))    Γ_ct, params ⊢ body : ProcReturn(ret_opt)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ proc : wf
```

Compile-time procedure contracts use the ordinary `contract_clause` surface of §14.6. At each compile-time call site, the precondition is evaluated before body execution and the postcondition is evaluated on the returned value. If any evaluated contract predicate is `false`, the call is ill-formed.

Compile-time procedures MUST be callable only from compile-time contexts. Runtime expressions and runtime procedure bodies MUST NOT name, take the address of, store, or call a compile-time procedure.

For `comptime if`, only the selected branch becomes part of the expanded program.
For `comptime loop`, the source value MUST be finite and iteration order MUST equal the canonical element order of the source value.
`comptime loop` imposes no item-kind uniformity constraint across iterations. If loop-body execution emits declarations, the resulting emitted-item sequence is the concatenation of each iteration's emitted items in canonical iteration order.

#### 22.1.5 Dynamic Semantics

```text
Phase2ModuleOrder(P) = [M_1, …, M_k] ⇔ Γ ⊢ ParseModules(P) ⇓ [M_1, …, M_k]
```

```text
CtEmptyEnv(M) = ⟨∅, ∅, ∅, ⟨M.path, 0, ⊥⟩, ⊥⟩
WithCtSite(Ξ, ord, sp) = Ξ' ⇔ CtSiteOf(Ξ) = ⟨mp, _, _⟩ ∧ Ξ' = ⟨CtVals(Ξ), CtProcs(Ξ), CtCaps(Ξ), ⟨mp, ord, sp⟩, CtQuoteCtxOf(Ξ)⟩
BindCtProc(Ξ, proc) = Ξ' ⇔ proc = CtProc(_, _, name, _, _, _, _, _, _, _) ∧ Ξ' = ⟨CtVals(Ξ), CtProcs(Ξ)[name ↦ proc], CtCaps(Ξ), CtSiteOf(Ξ), CtQuoteCtxOf(Ξ)⟩
UnitBlockStmts(BlockExpr(stmts, ⊥)) = stmts
```

UnitBlockStmts(BlockExpr(stmts, tail)) = stmts ++ [ExprStmt(tail)]

```text
ElseBlock(else_opt) = else_opt    if else_opt ≠ ⊥
```

ElseBlock(else_opt) = BlockExpr([], TupleExpr([]))    otherwise
CtElems(CtArray(vs)) = vs
CtElems(CtSlice(vs)) = vs

```text
BindPatternCt(Ξ, pat, v) = Ξ' iff the ordinary loop-pattern binding rules bind the names of `pat` to `v` in `CtVals(Ξ')` and leave `CtProcs`, `CtCaps`, and `CtSiteOf` unchanged.
```

A conforming implementation MUST satisfy all of the following:
1. `ComptimePass` evaluates modules in `Phase2ModuleOrder(P)` and no other order.
2. Within one module, compile-time sites execute in source order after earlier emitted declarations from that same module have been incorporated.
3. `CtProc` declarations are Phase 2 bindings only and MUST NOT survive into the expanded Phase 3 module set.
4. `CtStmt` contributes no runtime statement; its only externally relevant effects are declaration emission and diagnostics.
5. `CtExpr` is replaced before Phase 3 by the result of `CtLiteralize` or by the payload of a category-compatible `CtAst`.
6. Any item emitted at a Phase 2 site becomes visible immediately after that site to later Phase 2 execution in the same module and to Phase 3 over the final expanded module set.

For every expression, statement, and block form not introduced by Chapter 22, `CtEval` and `CtExec` use the same child order, scope creation, pattern binding, control propagation, and operator semantics as the corresponding ordinary relations of Chapters 18 through 21, with values ranging over `CtValue` and fixed compile-time bindings dispatched through `CtBuiltinCall`.

For every item, statement, block, or expression constructor not introduced by Chapter 22, the corresponding `CtExpand*` relation recursively expands its direct child nodes in source order, rebuilds the same outer constructor from the expanded children, and concatenates emitted-item lists in that traversal order.

**(ComptimePass-Empty)**
──────────────────────────────────────────────

```text
Γ ⊢ CtExecModuleSeq([], Φ) ⇓ ([], Φ)
```

**(ComptimePass-Cons)**

```text
Γ ⊢ CtExecModule(M_1, Φ_0) ⇓ (M_1', Φ_1)    Γ ⊢ CtExecModuleSeq([M_2, …, M_k], Φ_1) ⇓ ([M_2', …, M_k'], Φ_2)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtExecModuleSeq([M_1, …, M_k], Φ_0) ⇓ ([M_1', M_2', …, M_k'], Φ_2)
```

**(ComptimePass)**

```text
Phase2ModuleOrder(P) = [M_1, …, M_k]    root_0 = P.root    Φ_0 = ⟨files_0, root_0, [], [], 0⟩    Γ ⊢ CtExecModuleSeq([M_1, …, M_k], Φ_0) ⇓ ([M_1', …, M_k'], Φ_1)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ComptimePass(P, [M_1, …, M_k]) ⇓ [M_1', …, M_k']
```

where `files_0` is the deterministic project-file snapshot defined by §22.2.5.

**(CtExecModule)**

```text
Ξ_0 = CtEmptyEnv(M)    Γ ⊢ CtExpandItemSeq(M.items, Ξ_0, Φ, 0) ⇓ (items', Ξ_1, Φ_1)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtExecModule(M, Φ) ⇓ (⟨M.path, items', M.module_doc⟩, Φ_1)
```

**(CtExpandItemSeq-Empty)**
──────────────────────────────────────────────

```text
Γ ⊢ CtExpandItemSeq([], Ξ, Φ, ord) ⇓ ([], Ξ, Φ)
```

**(CtExpandItemSeq-Cons)**

```text
WithCtSite(Ξ, ord, ⊥) = Ξ_0    Γ ⊢ CtExpandItem(Ξ_0, Φ_0, it) ⇓ (⟨keep_items, emit_items⟩, Ξ_1, Φ_1)    Γ ⊢ CtExpandItemSeq(emit_items ++ rest, Ξ_1, Φ_1, ord + 1) ⇓ (rest', Ξ_2, Φ_2)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtExpandItemSeq([it] ++ rest, Ξ, Φ_0, ord) ⇓ (keep_items ++ rest', Ξ_2, Φ_2)
```

```text
`CtExpandItem` returns a pair `⟨keep_items, emit_items⟩`, where `keep_items` replaces the current item position and `emit_items` is inserted immediately after that position.
```

Any `CtBuiltinCall` that emits declarations appends them to `CtPendingEmits(Φ)`. Before `CtExpandItem` returns to `CtExpandItemSeq`, it MUST transfer the accumulated `CtPendingEmits(Φ)` into its returned `emit_items` list in append order and clear the pending-emission queue in the resulting `Φ`.

**(CtExpandItem-CtProc)**

```text
proc = CtProc(_, _, _, _, _, _, _, _, _, _)    BindCtProc(Ξ, proc) = Ξ_1
```

────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtExpandItem(Ξ, Φ, proc) ⇓ (⟨[], []⟩, Ξ_1, Φ)
```

**(CtExpandStmtSeq-Empty)**
──────────────────────────────────────────────

```text
Γ ⊢ CtExpandStmtSeq([], Ξ, Φ) ⇓ ([], Ξ, Φ)
```

**(CtExpandStmtSeq-Cons)**

```text
Γ ⊢ CtExpandStmt(Ξ, Φ_0, s) ⇓ (ss_0, Ξ_1, Φ_1)    Γ ⊢ CtExpandStmtSeq(rest, Ξ_1, Φ_1) ⇓ (ss_1, Ξ_2, Φ_2)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtExpandStmtSeq([s] ++ rest, Ξ, Φ_0) ⇓ (ss_0 ++ ss_1, Ξ_2, Φ_2)
```

**(CtExpandBlock)**

```text
Γ ⊢ CtExpandStmtSeq(stmts, Ξ, Φ_0) ⇓ (stmts', Ξ_1, Φ_1)    (tail_opt = ⊥ ⇒ tail_opt' = ⊥ ∧ Ξ_2 = Ξ_1 ∧ Φ_2 = Φ_1)    (tail_opt = e ⇒ Γ ⊢ CtExpandExpr(Ξ_1, Φ_1, e) ⇓ (e', Ξ_2, Φ_2) ∧ tail_opt' = e')
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtExpandBlock(Ξ, Φ_0, BlockExpr(stmts, tail_opt)) ⇓ (BlockExpr(stmts', tail_opt'), Ξ_2, Φ_2)
```

**(CtExpandStmt-CtStmt)**

```text
Γ ⊢ CtExec(Ξ, Φ_0, body) ⇓ (Ξ_1, Φ_1)
```

────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtExpandStmt(Ξ, Φ_0, CtStmt(body, attrs_opt, span)) ⇓ ([], Ξ_1, Φ_1)
```

**(CtExpandExpr-CtExpr)**

```text
Γ ⊢ CtEval(Ξ, Φ_0, body) ⇓ (cv, Ξ_1, Φ_1)    Γ ⊢ CtLiteralize(cv) ⇓ e'
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtExpandExpr(Ξ, Φ_0, CtExpr(body, attrs_opt, span)) ⇓ (e', Ξ_1, Φ_1)
```

**(CtExpandExpr-CtIf-True)**

```text
Γ ⊢ CtEval(Ξ, Φ_0, cond) ⇓ (CtPrim(true), Ξ_1, Φ_1)    Γ ⊢ CtExpandBlock(Ξ_1, Φ_1, then_blk) ⇓ (b', Ξ_2, Φ_2)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtExpandExpr(Ξ, Φ_0, CtIf(cond, then_blk, else_opt, span)) ⇓ (b', Ξ_2, Φ_2)
```

**(CtExpandExpr-CtIf-False)**

```text
Γ ⊢ CtEval(Ξ, Φ_0, cond) ⇓ (CtPrim(false), Ξ_1, Φ_1)    b = ElseBlock(else_opt)    Γ ⊢ CtExpandBlock(Ξ_1, Φ_1, b) ⇓ (b', Ξ_2, Φ_2)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtExpandExpr(Ξ, Φ_0, CtIf(cond, then_blk, else_opt, span)) ⇓ (b', Ξ_2, Φ_2)
```

**(CtExpandExpr-CtLoopIter)**

```text
Γ ⊢ CtEval(Ξ, Φ_0, src) ⇓ (iter_v, Ξ_1, Φ_1)    CtIterable(iter_v)    elems = CtElems(iter_v)    Γ ⊢ CtLoopIterUnroll(Ξ_1, Φ_1, pat, body, elems) ⇓ (stmts, Ξ_2, Φ_2)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtExpandExpr(Ξ, Φ_0, CtLoopIter(pat, ty_opt, src, body, span)) ⇓ (BlockExpr(stmts, TupleExpr([])), Ξ_2, Φ_2)
```

**(CtLoopIterUnroll-Empty)**
──────────────────────────────────────────────

```text
Γ ⊢ CtLoopIterUnroll(Ξ, Φ, pat, body, []) ⇓ ([], Ξ, Φ)
```

**(CtLoopIterUnroll-Cons)**

```text
BindPatternCt(Ξ, pat, v) = Ξ_0    Γ ⊢ CtExpandBlock(Ξ_0, Φ_0, body) ⇓ (b, Ξ_1, Φ_1)    Γ ⊢ CtLoopIterUnroll(Ξ_1, Φ_1, pat, body, rest) ⇓ (stmts_rest, Ξ_2, Φ_2)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtLoopIterUnroll(Ξ, Φ_0, pat, body, [v] ++ rest) ⇓ (UnitBlockStmts(b) ++ stmts_rest, Ξ_2, Φ_2)
```

```text
CtLiteralize(CtPrim(UnitVal)) ⇓ TupleExpr([])
CtLiteralize(CtPrim(v)) ⇓ Literal(ℓ) ⇔ v ≠ UnitVal ∧ ∃ T. LiteralValue(ℓ, T) = v
CtLiteralize(CtString(v)) ⇓ Literal(ℓ) ⇔ LiteralValue(ℓ, TypeString(`@View`)) = v ∨ LiteralValue(ℓ, TypeString(`@Managed`)) = v
CtLiteralize(CtTuple([v_1, …, v_n])) ⇓ TupleExpr([e_1, …, e_n]) ⇔ ∀ i. Γ ⊢ CtLiteralize(v_i) ⇓ e_i
CtLiteralize(CtArray([v_1, …, v_n])) ⇓ ArrayExpr([e_1, …, e_n]) ⇔ ∀ i. Γ ⊢ CtLiteralize(v_i) ⇓ e_i
CtLiteralize(CtRecord(path, [⟨f_1, v_1⟩, …, ⟨f_n, v_n⟩])) ⇓ RecordExpr(TypePath(path), [⟨f_1, e_1⟩, …, ⟨f_n, e_n⟩]) ⇔ ∀ i. Γ ⊢ CtLiteralize(v_i) ⇓ e_i
CtLiteralize(CtModalState(modal_ref, state, [⟨f_1, v_1⟩, …, ⟨f_n, v_n⟩])) ⇓ RecordExpr(ModalStateRef(modal_ref, state), [⟨f_1, e_1⟩, …, ⟨f_n, e_n⟩]) ⇔ ∀ i. Γ ⊢ CtLiteralize(v_i) ⇓ e_i
CtLiteralize(CtEnum(path, variant, ⊥)) ⇓ EnumLiteral(path ++ [variant], ⊥)
CtLiteralize(CtEnum(path, variant, CtTuplePayload([v_1, …, v_n]))) ⇓ EnumLiteral(path ++ [variant], Paren([e_1, …, e_n])) ⇔ ∀ i. Γ ⊢ CtLiteralize(v_i) ⇓ e_i
CtLiteralize(CtEnum(path, variant, CtRecordPayload([⟨f_1, v_1⟩, …, ⟨f_n, v_n⟩]))) ⇓ EnumLiteral(path ++ [variant], Brace([⟨f_1, e_1⟩, …, ⟨f_n, e_n⟩])) ⇔ ∀ i. Γ ⊢ CtLiteralize(v_i) ⇓ e_i
CtLiteralize(CtAst(a)) ⇓ AstPayloadOf(a)    if AstKindOf(a) = `Expr`
```

#### 22.1.6 Lowering

Compile-time execution is complete before Phase 3 typing and Phase 4 lowering. No runtime IR is emitted directly for:
- compile-time procedures
- compile-time statements
- compile-time expressions after literalization or AST substitution

Phase 4 lowers only the expanded program produced by `ExecuteComptime`.

#### 22.1.7 Diagnostics

Diagnostics for compile-time forms are defined by §22.6.

### 22.2 Compile-Time Capabilities

#### 22.2.1 Syntax

This section introduces no additional surface syntax beyond `[[emit]]`, `[[files]]`, and the built-in identifiers available in compile-time contexts.

#### 22.2.2 Parsing

CtCapName = {`emitter`, `introspect`, `files`, `diagnostics`}

**(Parse-CtCapRef)**

```text
IsIdent(Tok(P))    Lexeme(Tok(P)) ∈ CtCapName
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePrimary(P) ⇓ (Advance(P), Identifier(Lexeme(Tok(P))))
```

Capability method calls then use the ordinary call and method-call parsers.

#### 22.2.3 AST Representation / Form

CtCap = {TypeEmitter, Introspect, ProjectFiles, ComptimeDiagnostics}
CtBuiltinType = {`Type`, `Ast`, `Ast::Expr`, `Ast::Stmt`, `Ast::Item`, `Ast::Type`, `Ast::Pattern`, `TypeCategory`, `FieldInfo`, `VariantInfo`, `StateInfo`, `SourceSpan`}
CtCapType(`emitter`) = TypePath(["TypeEmitter"])
CtCapType(`introspect`) = TypePath(["Introspect"])
CtCapType(`files`) = TypePath(["ProjectFiles"])
CtCapType(`diagnostics`) = TypePath(["ComptimeDiagnostics"])

```text
HasCtCap(node, `Introspect`) ⇔ node executes in Phase 2
HasCtCap(node, `ComptimeDiagnostics`) ⇔ node executes in Phase 2
HasCtCap(node, `TypeEmitter`) ⇔ node executes in Phase 2 ∧ (`[[emit]]` applies to node ∨ node is a derive target body)
HasCtCap(node, `ProjectFiles`) ⇔ node executes in Phase 2 ∧ `[[files]]` applies to node
```

```text
SourceSpanFields = [⟨`file`, TypeString(`@Managed`)⟩, ⟨`start_line`, TypePrim("usize")⟩, ⟨`start_col`, TypePrim("usize")⟩, ⟨`end_line`, TypePrim("usize")⟩, ⟨`end_col`, TypePrim("usize")⟩]
FieldInfoFields = [⟨`name`, TypeString(`@Managed`)⟩, ⟨`type`, TypePath(["Type"])⟩, ⟨`visibility`, TypeString(`@Managed`)⟩, ⟨`index`, TypePrim("usize")⟩, ⟨`span`, TypePath(["SourceSpan"])⟩]
VariantInfoFields = [⟨`name`, TypeString(`@Managed`)⟩, ⟨`payload_kind`, TypeString(`@Managed`)⟩, ⟨`payload_types`, TypeSlice(TypePath(["Type"]))⟩, ⟨`field_names`, TypeSlice(TypeString(`@Managed`))⟩, ⟨`span`, TypePath(["SourceSpan"])⟩]
StateInfoFields = [⟨`name`, TypeString(`@Managed`)⟩, ⟨`field_names`, TypeSlice(TypeString(`@Managed`))⟩, ⟨`method_names`, TypeSlice(TypeString(`@Managed`))⟩, ⟨`transition_names`, TypeSlice(TypeString(`@Managed`))⟩, ⟨`span`, TypePath(["SourceSpan"])⟩]
```

ModulePathText(path) = StringOfPath(path)

```text
CtOutcomeValue(T, v) = CtModalState(TypeApply(["Outcome"], [T, TypePath(["IoError"])]), `@Value`, [⟨`value`, v⟩])
CtOutcomeError(T, e) = CtModalState(TypeApply(["Outcome"], [T, TypePath(["IoError"])]), `@Error`, [⟨`error`, CtEnum([`IoError`], IoErrorVariant(e), ⊥)⟩])
CtFileResult(r, T) = CtOutcomeValue(T, CtString(r))    if r ∈ String
CtFileResult(r, T) = CtOutcomeValue(T, CtBytes(r))    if r ∈ Bytes
CtFileResult(r, T) = CtOutcomeValue(T, CtPrim(r))    if r ∈ Bool
CtFileResult(r, T) = CtOutcomeValue(T, CtSlice([CtString(x) | x ∈ r]))    if r ∈ List(String)
CtFileResult(r, T) = CtOutcomeError(T, r)    if r ∈ IoError
```

IoErrorVariant(IoError::NotFound) = `NotFound`
IoErrorVariant(IoError::PermissionDenied) = `PermissionDenied`
IoErrorVariant(IoError::AlreadyExists) = `AlreadyExists`
IoErrorVariant(IoError::InvalidPath) = `InvalidPath`
IoErrorVariant(IoError::Busy) = `Busy`
IoErrorVariant(IoError::IoFailure) = `IoFailure`

```text
SpanValue(sp) = CtRecord([`SourceSpan`], [⟨`file`, CtString(sp.file)⟩, ⟨`start_line`, CtPrim(sp.start_line)⟩, ⟨`start_col`, CtPrim(sp.start_col)⟩, ⟨`end_line`, CtPrim(sp.end_line)⟩, ⟨`end_col`, CtPrim(sp.end_col)⟩])
FieldInfoValue(name, T, vis, index, sp) = CtRecord([`FieldInfo`], [⟨`name`, CtString(name)⟩, ⟨`type`, CtType(T)⟩, ⟨`visibility`, CtString(vis)⟩, ⟨`index`, CtPrim(index)⟩, ⟨`span`, SpanValue(sp)⟩])
VariantInfoValue(name, payload_kind, payload_types, field_names, sp) = CtRecord([`VariantInfo`], [⟨`name`, CtString(name)⟩, ⟨`payload_kind`, CtString(payload_kind)⟩, ⟨`payload_types`, CtSlice([CtType(T) | T ∈ payload_types])⟩, ⟨`field_names`, CtSlice([CtString(f) | f ∈ field_names])⟩, ⟨`span`, SpanValue(sp)⟩])
StateInfoValue(name, field_names, method_names, transition_names, sp) = CtRecord([`StateInfo`], [⟨`name`, CtString(name)⟩, ⟨`field_names`, CtSlice([CtString(f) | f ∈ field_names])⟩, ⟨`method_names`, CtSlice([CtString(m) | m ∈ method_names])⟩, ⟨`transition_names`, CtSlice([CtString(t) | t ∈ transition_names])⟩, ⟨`span`, SpanValue(sp)⟩])
```

TypeEmitterInterface =
{

```text
 ⟨"emit", [⟨⊥, `ast`, TypePath(["Ast"])⟩], TypePrim("()")⟩
```

}

IntrospectInterface =
{

```text
 ⟨"category", [⟨⊥, `ty`, TypePath(["Type"])⟩], TypePath(["TypeCategory"])⟩,
 ⟨"fields", [⟨⊥, `ty`, TypePath(["Type"])⟩], TypeSlice(TypePath(["FieldInfo"]))⟩,
 ⟨"variants", [⟨⊥, `ty`, TypePath(["Type"])⟩], TypeSlice(TypePath(["VariantInfo"]))⟩,
 ⟨"states", [⟨⊥, `ty`, TypePath(["Type"])⟩], TypeSlice(TypePath(["StateInfo"]))⟩,
 ⟨"implements_form", [⟨⊥, `ty`, TypePath(["Type"])⟩, ⟨⊥, `form`, TypePath(["Type"])⟩], TypePrim("bool")⟩,
 ⟨"type_name", [⟨⊥, `ty`, TypePath(["Type"])⟩], TypeString(`@Managed`)⟩,
 ⟨"module_path", [⟨⊥, `ty`, TypePath(["Type"])⟩], TypeString(`@Managed`)⟩
```

}

ProjectFilesInterface =
{

```text
 ⟨"read", [⟨⊥, `path`, TypeString(`@View`)⟩], TypeApply(["Outcome"], [TypePerm(`unique`, TypeString(`@Managed`)), TypePath(["IoError"])])⟩,
 ⟨"read_bytes", [⟨⊥, `path`, TypeString(`@View`)⟩], TypeApply(["Outcome"], [TypePerm(`unique`, TypeBytes(`@Managed`)), TypePath(["IoError"])])⟩,
 ⟨"exists", [⟨⊥, `path`, TypeString(`@View`)⟩], TypeApply(["Outcome"], [TypePrim("bool"), TypePath(["IoError"])])⟩,
 ⟨"list_dir", [⟨⊥, `path`, TypeString(`@View`)⟩], TypeApply(["Outcome"], [TypeSlice(TypeString(`@Managed`)), TypePath(["IoError"])])⟩,
 ⟨"project_root", [], TypeString(`@Managed`)⟩
```

}

ComptimeDiagnosticsInterface =
{

```text
 ⟨"error", [⟨⊥, `message`, TypeString(`@View`)⟩], TypePrim("!")⟩,
 ⟨"warning", [⟨⊥, `message`, TypeString(`@View`)⟩], TypePrim("()")⟩,
 ⟨"note", [⟨⊥, `message`, TypeString(`@View`)⟩], TypePrim("()")⟩,
 ⟨"current_span", [], TypePath(["SourceSpan"])⟩,
 ⟨"current_module", [], TypeString(`@Managed`)⟩
```

}

#### 22.2.4 Static Semantics

`Introspect` and `ComptimeDiagnostics` are available in every compile-time context.

`TypeEmitter` is available only:
- inside a `comptime` form annotated with `[[emit]]`
- inside the body of a derive target declaration

`ProjectFiles` is available only inside a `comptime` form annotated with `[[files]]`.

```text
CtCapBindings(node) = [⟨`introspect`, TypePath(["Introspect"])⟩, ⟨`diagnostics`, TypePath(["ComptimeDiagnostics"])⟩] ++ ([⟨`emitter`, TypePath(["TypeEmitter"])⟩] if HasCtCap(node, `TypeEmitter`), else []) ++ ([⟨`files`, TypePath(["ProjectFiles"])⟩] if HasCtCap(node, `ProjectFiles`), else [])
```

`files.project_root()`, `files.read(path)`, `files.read_bytes(path)`, `files.exists(path)`, and `files.list_dir(path)` MUST use project-root-relative paths. The argument path:
- MUST NOT be absolute
- MUST NOT contain `..` components that escape the project root after normalization
- MUST be resolved against a deterministic Phase 2 snapshot of project files
- If restriction fails, `files.read`, `files.read_bytes`, `files.exists`, and `files.list_dir` MUST return `IoError::InvalidPath`

`emitter.emit(ast)` requires `ast` to have compile-time type `Ast::Item` or `Ast`.

#### 22.2.5 Dynamic Semantics

```text
CtEmitItem(Ξ, Φ, a) = Φ' ⇔ AstKindOf(a) = `Item` ∧ AstHygieneOf(a) = ⟨quote_site, _, _⟩ ∧ HygienizeAst(a, quote_site, CtSiteOf(Ξ), CtFreshSeed(Φ)) ⇓ (a', n') ∧ Φ' = ⟨CtFiles(Φ), CtProjectRoot(Φ), CtDiags(Φ), CtPendingEmits(Φ) ++ [AstPayloadOf(a')], n'⟩
CtProjectPath(Φ, path) = q ⇔ RestrictPath(CtProjectRoot(Φ), path) = q
CtProjectPath(Φ, path) = ⊥ ⇔ RestrictPath(CtProjectRoot(Φ), path) = ⊥
CtDiagAppend(Ξ, Φ, d) = Φ' ⇔ Φ' = ⟨CtFiles(Φ), CtProjectRoot(Φ), CtDiags(Φ) ++ [d], CtPendingEmits(Φ), CtFreshSeed(Φ)⟩
CtUserErrorDiag(Ξ, msg) = d ⇔ CtSiteOf(Ξ) = ⟨_, _, sp⟩ ∧ d = ⟨`E-CTE-0070`, Error, msg, sp⟩
CtUserWarningDiag(Ξ, msg) = d ⇔ CtSiteOf(Ξ) = ⟨_, _, sp⟩ ∧ d = ⟨`W-CTE-0071`, Warning, msg, sp⟩
CtUserNoteDiag(Ξ, msg) = d ⇔ CtSiteOf(Ξ) = ⟨_, _, sp⟩ ∧ d = ⟨⊥, Note, msg, sp⟩
CtListDirResult(fs, q) = CtSlice([CtString(entry.name) | entry ∈ entries]) ⇔ ∃ ω. DirEntries(fs, q, ω) = entries
CtListDirResult(fs, q) = CtEnum([`IoError`], IoErrorVariant(r), ⊥) ⇔ FSOpenDir(fs, q) ⇓ r ∧ r ∈ IoError
CtExistsResult(fs, q) = CtPrim(b) ⇔ FSExists(fs, q) ⇓ b ∧ b ∈ Bool
CtExistsResult(fs, q) = CtEnum([`IoError`], IoErrorVariant(r), ⊥) ⇔ FSExists(fs, q) ⇓ r ∧ r ∈ IoError
```

**(CtBuiltin-Emit)**

```text
owner = `emitter`    name = `emit`    args = [CtAst(a)]    CtEmitItem(Ξ, Φ, a) = Φ'
```

────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtBuiltinCall(Ξ, Φ, owner, name, args) ⇓ (CtPrim(UnitVal), Φ')
```

**(CtBuiltin-ProjectRoot)**
owner = `files`    name = `project_root`
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtBuiltinCall(Ξ, Φ, owner, name, []) ⇓ (CtString(CtProjectRoot(Φ)), Φ)
```

**(CtBuiltin-Read)**

```text
owner = `files`    name = `read`    args = [CtString(path)]    CtProjectPath(Φ, path) = q    FSReadFile(CtFiles(Φ), q) ⇓ r
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtBuiltinCall(Ξ, Φ, owner, name, args) ⇓ (CtFileResult(r, TypePerm(`unique`, TypeString(`@Managed`))), Φ)
```

**(CtBuiltin-Read-InvalidPath)**

```text
owner = `files`    name = `read`    args = [CtString(path)]    CtProjectPath(Φ, path) = ⊥
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtBuiltinCall(Ξ, Φ, owner, name, args) ⇓ (CtOutcomeError(TypePerm(`unique`, TypeString(`@Managed`)), IoError::InvalidPath), Φ)
```

**(CtBuiltin-ReadBytes)**

```text
owner = `files`    name = `read_bytes`    args = [CtString(path)]    CtProjectPath(Φ, path) = q    FSReadBytes(CtFiles(Φ), q) ⇓ r
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtBuiltinCall(Ξ, Φ, owner, name, args) ⇓ (CtFileResult(r, TypePerm(`unique`, TypeBytes(`@Managed`))), Φ)
```

**(CtBuiltin-ReadBytes-InvalidPath)**

```text
owner = `files`    name = `read_bytes`    args = [CtString(path)]    CtProjectPath(Φ, path) = ⊥
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtBuiltinCall(Ξ, Φ, owner, name, args) ⇓ (CtOutcomeError(TypePerm(`unique`, TypeBytes(`@Managed`)), IoError::InvalidPath), Φ)
```

**(CtBuiltin-Exists)**
owner = `files`    name = `exists`    args = [CtString(path)]    CtProjectPath(Φ, path) = q    CtExistsResult(CtFiles(Φ), q) = v
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtBuiltinCall(Ξ, Φ, owner, name, args) ⇓ (CtFileResult(v, TypePrim("bool")), Φ)
```

**(CtBuiltin-Exists-InvalidPath)**

```text
owner = `files`    name = `exists`    args = [CtString(path)]    CtProjectPath(Φ, path) = ⊥
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtBuiltinCall(Ξ, Φ, owner, name, args) ⇓ (CtOutcomeError(TypePrim("bool"), IoError::InvalidPath), Φ)
```

**(CtBuiltin-ListDir)**
owner = `files`    name = `list_dir`    args = [CtString(path)]    CtProjectPath(Φ, path) = q    CtListDirResult(CtFiles(Φ), q) = v
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtBuiltinCall(Ξ, Φ, owner, name, args) ⇓ (CtFileResult(v, TypeSlice(TypeString(`@Managed`))), Φ)
```

**(CtBuiltin-ListDir-InvalidPath)**

```text
owner = `files`    name = `list_dir`    args = [CtString(path)]    CtProjectPath(Φ, path) = ⊥
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtBuiltinCall(Ξ, Φ, owner, name, args) ⇓ (CtOutcomeError(TypeSlice(TypeString(`@Managed`)), IoError::InvalidPath), Φ)
```

**(CtBuiltin-Diagnostics-Error)**

```text
owner = `diagnostics`    name = `error`    args = [CtString(msg)]    CtUserErrorDiag(Ξ, msg) = d    CtDiagAppend(Ξ, Φ, d) = Φ'
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtBuiltinCall(Ξ, Φ, owner, name, args) ⇑ Φ'
```

**(CtBuiltin-Diagnostics-Warning)**

```text
owner = `diagnostics`    name = `warning`    args = [CtString(msg)]    CtUserWarningDiag(Ξ, msg) = d    CtDiagAppend(Ξ, Φ, d) = Φ'
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtBuiltinCall(Ξ, Φ, owner, name, args) ⇓ (CtPrim(UnitVal), Φ')
```

**(CtBuiltin-Diagnostics-Note)**

```text
owner = `diagnostics`    name = `note`    args = [CtString(msg)]    CtUserNoteDiag(Ξ, msg) = d    CtDiagAppend(Ξ, Φ, d) = Φ'
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtBuiltinCall(Ξ, Φ, owner, name, args) ⇓ (CtPrim(UnitVal), Φ')
```

**(CtBuiltin-Diagnostics-CurrentSpan)**

```text
owner = `diagnostics`    name = `current_span`    CtSiteOf(Ξ) = ⟨_, _, sp⟩
```

────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtBuiltinCall(Ξ, Φ, owner, name, []) ⇓ (SpanValue(sp), Φ)
```

**(CtBuiltin-Diagnostics-CurrentModule)**

```text
owner = `diagnostics`    name = `current_module`    CtSiteOf(Ξ) = ⟨mp, _, _⟩
```

────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtBuiltinCall(Ξ, Φ, owner, name, []) ⇓ (CtString(ModulePathText(mp)), Φ)
```

Project-file reads MUST observe the `CtFiles(Φ)` snapshot captured at the start of Phase 2. Host writes during compilation MUST NOT change the values returned by `FSReadFile`, `FSReadBytes`, `FSExists`, or `DirEntries` through that snapshot for the same restricted path.

#### 22.2.6 Lowering

Compile-time capabilities introduce no runtime object layout and no runtime symbol requirement beyond the emitted declarations they produce during Phase 2.

#### 22.2.7 Diagnostics

Diagnostics for compile-time capabilities are defined by §22.6.

### 22.3 Reflection

#### 22.3.1 Syntax

```text
type_literal ::= "Type" "::<" type ">"
```

#### 22.3.2 Parsing

ReflectParseJudg = {ParseTypeLiteral}

**(Parse-TypeLiteral)**

```text
IsIdent(Tok(P))    Lexeme(Tok(P)) = "Type"    IsOp(Tok(Advance(P)), "::")    IsOp(Tok(Advance(Advance(P))), "<")    Γ ⊢ ParseType(Advance(Advance(Advance(P)))) ⇓ (P_1, T)    IsOp(Tok(P_1), ">")
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePrimary(P) ⇓ (Advance(P_1), TypeLiteralExpr(T))
```

#### 22.3.3 AST Representation / Form

```text
Reflectable(TypePerm(_, T)) ⇔ Reflectable(T)
Reflectable(TypeRefine(T, _)) ⇔ Reflectable(T)
Reflectable(TypeModalState(p, args, _)) ⇔ Reflectable(TypeApply(p, args))
Reflectable(TypePath(p)) ⇔ Reflectable(TypeApply(p, []))
Reflectable(TypeApply(p, args)) ⇔
  T = TypePrim(_) ∨ T = TypeTuple(_) ∨ T = TypeArray(_, _) ∨ T = TypeSlice(_) ∨ T = TypeUnion(_)    if TypeAliasDecl(p) = A ∧ AliasBody(A) = T ∧ params_gen = TypeParamsOpt(A.generic_params) ∧ DefaultArgs(params_gen, args) = args' ∧ θ = [args'_i / params_gen[i].name]
Reflectable(TypeApply(p, args)) ⇔
  AttrByName(DeclOf(p), "reflect") ≠ []    if (RecordDecl(p) defined ∨ EnumDecl(p) defined ∨ ModalDecl(p) defined) ∧ params_gen = TypeParamsOpt(DeclOf(p).generic_params) ∧ DefaultArgs(params_gen, args) = args'
Reflectable(TypePrim(_)) ⇔ true
Reflectable(TypeTuple(_)) ⇔ true
Reflectable(TypeArray(_, _)) ⇔ true
Reflectable(TypeSlice(_)) ⇔ true
Reflectable(TypeUnion(_)) ⇔ true
```

ReflectJudg = {ReflectFields, ReflectVariants, ReflectStates, ReflectImplements}
TypeLiteralExpr(T) is the compile-time expression form introduced by `Type::<T>`.

TypeCategory = {`Record`, `Enum`, `Modal`, `Primitive`, `Tuple`, `Array`, `Slice`, `Union`, `Procedure`, `Reference`, `Dynamic`, `Opaque`, `Generic`, `String`, `Bytes`, `Range`}

CategoryOf(TypePrim(_)) = `Primitive`
CategoryOf(TypePerm(_, base)) = CategoryOf(base)
CategoryOf(TypeRefine(base, _)) = CategoryOf(base)
CategoryOf(TypeTuple(_)) = `Tuple`
CategoryOf(TypeArray(_, _)) = `Array`
CategoryOf(TypeSlice(_)) = `Slice`
CategoryOf(TypeUnion(_)) = `Union`
CategoryOf(TypeFunc(_, _)) = `Procedure`
CategoryOf(TypeClosure(_, _, _)) = `Procedure`
CategoryOf(TypePtr(_, _)) = `Reference`
CategoryOf(TypeRawPtr(_, _)) = `Reference`
CategoryOf(TypeDynamic(_)) = `Dynamic`
CategoryOf(TypeOpaque(_)) = `Opaque`
CategoryOf(TypeString(_)) = `String`
CategoryOf(TypeBytes(_)) = `Bytes`
CategoryOf(TypeModalState(_, _)) = `Modal`
CategoryOf(TypePath(p)) = `Record` if RecordDecl(p) defined
CategoryOf(TypePath(p)) = `Enum` if EnumDecl(p) defined
CategoryOf(TypePath(p)) = `Modal` if ModalDecl(p) defined
CategoryOf(TypePath(p)) = `Generic` if p denotes a type parameter
CategoryOf(TypeApply(p, _)) = CategoryOf(TypePath(p))
CategoryOf(TypeRange(_)) = `Range`
CategoryOf(TypeRangeInclusive(_)) = `Range`
CategoryOf(TypeRangeFrom(_)) = `Range`
CategoryOf(TypeRangeTo(_)) = `Range`
CategoryOf(TypeRangeToInclusive(_)) = `Range`
CategoryOf(TypeRangeFull) = `Range`

ReflectFields(TypePerm(_, T)) = ReflectFields(T)
ReflectFields(TypeRefine(T, _)) = ReflectFields(T)
ReflectFields(TypePath(p)) = ReflectFields(TypeApply(p, []))

```text
ReflectFields(TypeApply(p, args)) = ReflectFields(TypeSubst(θ, ty))    if TypeAliasDecl(p) = A ∧ AliasBody(A) = ty ∧ params_gen = TypeParamsOpt(A.generic_params) ∧ DefaultArgs(params_gen, args) = args' ∧ θ = [args'_i / params_gen[i].name]
ReflectFields(TypeApply(p, args)) = [FieldInfoValue(f_i, TypeSubst(θ, T_i), vis_i, i - 1, sp_i) | RecordDecl(p) = R ∧ params_gen = TypeParamsOpt(R.generic_params) ∧ DefaultArgs(params_gen, args) = args' ∧ θ = [args'_j / params_gen[j].name] ∧ Fields(R) = [FieldDecl(_, vis_1, _, f_1, T_1, _, sp_1, _), …, FieldDecl(_, vis_n, _, f_n, T_n, _, sp_n, _)] ∧ 1 ≤ i ≤ n]
```

ReflectVariants(TypePerm(_, T)) = ReflectVariants(T)
ReflectVariants(TypeRefine(T, _)) = ReflectVariants(T)
ReflectVariants(TypePath(p)) = ReflectVariants(TypeApply(p, []))

```text
ReflectVariants(TypeApply(p, args)) = ReflectVariants(TypeSubst(θ, ty))    if TypeAliasDecl(p) = A ∧ AliasBody(A) = ty ∧ params_gen = TypeParamsOpt(A.generic_params) ∧ DefaultArgs(params_gen, args) = args' ∧ θ = [args'_i / params_gen[i].name]
ReflectVariants(TypeApply(p, args)) = [VariantInfoValue(v_i, PayloadKind(payload_i), [TypeSubst(θ, T) | T ∈ PayloadTypesOpt(payload_i)], PayloadFieldNames(payload_i), sp_i) | EnumDecl(p) = E ∧ params_gen = TypeParamsOpt(E.generic_params) ∧ DefaultArgs(params_gen, args) = args' ∧ θ = [args'_j / params_gen[j].name] ∧ Variants(E) = [VariantDecl(v_1, payload_1, _, sp_1, _), …, VariantDecl(v_n, payload_n, _, sp_n, _)] ∧ 1 ≤ i ≤ n]
```

ReflectStates(TypePerm(_, T)) = ReflectStates(T)
ReflectStates(TypeRefine(T, _)) = ReflectStates(T)
ReflectStates(TypeModalState(p, args, _)) = ReflectStates(TypeApply(p, args))
ReflectStates(TypePath(p)) = ReflectStates(TypeApply(p, []))

```text
ReflectStates(TypeApply(p, args)) = ReflectStates(TypeSubst(θ, ty))    if TypeAliasDecl(p) = A ∧ AliasBody(A) = ty ∧ params_gen = TypeParamsOpt(A.generic_params) ∧ DefaultArgs(params_gen, args) = args' ∧ θ = [args'_i / params_gen[i].name]
ReflectStates(TypeApply(p, args)) = [StateInfoValue(S_i, [f | StateFieldDecl(_, _, _, f, _, _, _) ∈ members_i], [MethodName(m) | m ∈ members_i ∧ m = StateMethodDecl(_, _, _, _, _, _, _, _, _, _, _)], [MethodName(t) | t ∈ members_i ∧ t = TransitionDecl(_, _, _, _, _, _, _, _)], sp_i) | ModalDecl(p) = M ∧ params_gen = TypeParamsOpt(M.generic_params) ∧ DefaultArgs(params_gen, args) = args' ∧ States(M) = [StateBlock(S_1, members_1, sp_1, _), …, StateBlock(S_n, members_n, sp_n, _)] ∧ 1 ≤ i ≤ n]
```

```text
PayloadKind(⊥) = "unit"
```

PayloadKind(TuplePayload(_)) = "tuple"
PayloadKind(RecordPayload(_)) = "record"

```text
PayloadTypesOpt(⊥) = []
```

PayloadTypesOpt(TuplePayload(ts)) = ts

```text
PayloadTypesOpt(RecordPayload(fs)) = [T | ⟨f, T⟩ ∈ fs]
PayloadFieldNames(⊥) = []
```

PayloadFieldNames(TuplePayload(_)) = []

```text
PayloadFieldNames(RecordPayload(fs)) = [f | ⟨f, _⟩ ∈ fs]
```

TypeModulePath(TypePath(p)) = mp    if SplitLast(p) = (mp, _)
TypeModulePath(T) = []    otherwise

#### 22.3.4 Static Semantics

**(T-TypeLiteral)**

```text
Γ ⊢ T wf
```

──────────────────────────────────────────────

```text
Γ_ct ⊢ TypeLiteralExpr(T) : TypePath(["Type"])
```

`introspect.category(ty)` is valid for any well-formed `Type` value.

`introspect.fields(ty)` is valid only when `CategoryOf(ty) = Record` and `Reflectable(ty)`.
`introspect.variants(ty)` is valid only when `CategoryOf(ty) = Enum` and `Reflectable(ty)`.
`introspect.states(ty)` is valid only when `CategoryOf(ty) = Modal` and `Reflectable(ty)`.

Reflection order is canonical:
- fields are returned in declaration order
- enum variants are returned in declaration order
- modal states are returned in declaration order

`introspect.implements_form(ty, form)` evaluates the same class-satisfaction judgment used by Phase 3 typing after substituting any monomorphized type arguments of `ty`.

#### 22.3.5 Dynamic Semantics

**(CtEval-TypeLiteral)**

```text
Γ ⊢ T wf
```

──────────────────────────────────────────────

```text
Γ ⊢ CtEval(Ξ, Φ, TypeLiteralExpr(T)) ⇓ (CtType(T), Ξ, Φ)
```

**(CtBuiltin-Reflect-Category)**
owner = `introspect`    name = `category`    args = [CtType(T)]
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtBuiltinCall(Ξ, Φ, owner, name, args) ⇓ (CtEnum([`TypeCategory`], CategoryOf(T), ⊥), Φ)
```

**(CtBuiltin-Reflect-Fields)**
owner = `introspect`    name = `fields`    args = [CtType(T)]    ReflectFields(T) = infos
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtBuiltinCall(Ξ, Φ, owner, name, args) ⇓ (CtSlice(infos), Φ)
```

**(CtBuiltin-Reflect-Variants)**
owner = `introspect`    name = `variants`    args = [CtType(T)]    ReflectVariants(T) = infos
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtBuiltinCall(Ξ, Φ, owner, name, args) ⇓ (CtSlice(infos), Φ)
```

**(CtBuiltin-Reflect-States)**
owner = `introspect`    name = `states`    args = [CtType(T)]    ReflectStates(T) = infos
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtBuiltinCall(Ξ, Φ, owner, name, args) ⇓ (CtSlice(infos), Φ)
```

**(CtBuiltin-Reflect-Form)**
owner = `introspect`    name = `implements_form`    args = [CtType(T), CtType(form)]    b = true iff the ordinary class-satisfaction judgment holds for `T` against `form`
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtBuiltinCall(Ξ, Φ, owner, name, args) ⇓ (CtPrim(b), Φ)
```

**(CtBuiltin-Reflect-TypeName)**
owner = `introspect`    name = `type_name`    args = [CtType(T)]
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtBuiltinCall(Ξ, Φ, owner, name, args) ⇓ (CtString(TypeRender(T)), Φ)
```

**(CtBuiltin-Reflect-ModulePath)**
owner = `introspect`    name = `module_path`    args = [CtType(T)]
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtBuiltinCall(Ξ, Φ, owner, name, args) ⇓ (CtString(ModulePathText(TypeModulePath(T))), Φ)
```

Reflection is pure Phase 2 evaluation. For one `CtMachine`, reflection results are immutable except for visibility of declarations emitted earlier in the same Phase 2 order.

#### 22.3.6 Lowering

Reflection contributes only to Phase 2 evaluation. Reified `Type` values and reflection result arrays do not survive into Phase 4 unless reified into emitted declarations or literalized constants.

#### 22.3.7 Diagnostics

Diagnostics for reflection are defined by §22.6.

### 22.4 Quote, Splice, and Emission

#### 22.4.1 Syntax

```text
quote_expr     ::= "quote" "{" quoted_content "}"
quote_type     ::= "quote" "type" "{" type "}"
quote_pattern  ::= "quote" "pattern" "{" pattern "}"
quoted_content ::= expression | statement | top_level_item
splice_expr    ::= "$(" expression ")"
splice_ident   ::= "$" identifier
```

#### 22.4.2 Parsing

QuoteParseJudg = {ParseQuoteExpr, ParseQuoteType, ParseQuotePattern, CaptureQuotedTokens}

```text
CaptureQuotedTokens(P) ⇓ (P', ts) consumes the balanced token sequence between the opening `{` at `P` and its matching `}` and preserves nested delimiter structure and all splice markers inside that slice.
```

**(Parse-Quote-Raw)**

```text
IsIdent(Tok(P))    Lexeme(Tok(P)) = "quote"    IsPunc(Tok(Advance(P)), "{")    CaptureQuotedTokens(Advance(P)) ⇓ (P_1, ts)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePrimary(P) ⇓ (P_1, QuoteNode(⊥, QuotedRaw(ts), SpanBetween(P, P_1)))
```

**(Parse-Quote-Type)**

```text
IsIdent(Tok(P))    Lexeme(Tok(P)) = "quote"    IsKw(Tok(Advance(P)), `type`)    IsPunc(Tok(Advance(Advance(P))), "{")    CaptureQuotedTokens(Advance(Advance(P))) ⇓ (P_1, ts)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePrimary(P) ⇓ (P_1, QuoteNode(`Type`, QuotedRaw(ts), SpanBetween(P, P_1)))
```

**(Parse-Quote-Pattern)**

```text
IsIdent(Tok(P))    Lexeme(Tok(P)) = "quote"    FixedIdentTok(Tok(Advance(P)), `pattern`)    IsPunc(Tok(Advance(Advance(P))), "{")    CaptureQuotedTokens(Advance(Advance(P))) ⇓ (P_1, ts)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePrimary(P) ⇓ (P_1, QuoteNode(`Pattern`, QuotedRaw(ts), SpanBetween(P, P_1)))
```

#### 22.4.3 AST Representation / Form

AstKind = {`Expr`, `Stmt`, `Item`, `Type`, `Pattern`}
Ast = {AstNode(kind, payload, span, hygiene)}
AstKindOf(AstNode(kind, payload, span, hygiene)) = kind
AstPayloadOf(AstNode(kind, payload, span, hygiene)) = payload
AstSpanOf(AstNode(kind, payload, span, hygiene)) = span
AstHygieneOf(AstNode(kind, payload, span, hygiene)) = hygiene

```text
AstOf(kind, payload) = AstNode(kind, payload, ⊥, ⊥)
```

QuoteNode(kind_opt, body, span)
QuotedBody = QuotedRaw(tokens) | QuotedResolved(kind, payload)
SpliceNode = SpliceExprNode(expr, span) | SpliceIdentNode(name_expr, span)

```text
Hygiene = ⟨quote_site, emit_site, mark⟩
```

`quote_site` is the lexical origin of the quoted fragment. `emit_site` is the insertion site at which the fragment becomes part of the expanded program. `HygienizeAst` is applied when a quoted `Ast` fragment is inserted into the expanded program.

QuoteJudg = {ResolveQuoteKind, ParseQuotedBody, RenderSplice, QuoteBuild, HygienizeAst}

ExpectedAstKind(TypePath([`Ast`, `Expr`])) = `Expr`
ExpectedAstKind(TypePath([`Ast`, `Stmt`])) = `Stmt`
ExpectedAstKind(TypePath([`Ast`, `Item`])) = `Item`
ExpectedAstKind(TypePath([`Ast`, `Type`])) = `Type`
ExpectedAstKind(TypePath([`Ast`, `Pattern`])) = `Pattern`

```text
ExpectedAstKind(TypePath([`Ast`])) = ⊥
```

```text
CtLiteralType(TypePrim(t)) ⇔ t ∈ PrimitiveTypeName \ {`!`}
CtLiteralType(TypeString(st)) ⇔ st ∈ {`@View`, `@Managed`}
CtLiteralType(TypeTuple([T_1, …, T_n])) ⇔ ∀ i. CtLiteralType(T_i)
CtLiteralType(TypeArray(T, _)) ⇔ CtLiteralType(T)
CtLiteralType(TypePerm(_, T)) ⇔ CtLiteralType(T)
CtLiteralType(TypeRefine(T, _)) ⇔ CtLiteralType(T)
CtLiteralType(TypePath(p)) ⇔ RecordDecl(p) = R ∧ ∀ f ∈ Fields(R). CtLiteralType(FieldType(f))
CtLiteralType(TypePath(p)) ⇔ EnumDecl(p) = E ∧ ∀ v ∈ Variants(E). (Payload(v) = ⊥ ∨ (Payload(v) = TuplePayload([T_1, …, T_n]) ∧ ∀ i. CtLiteralType(T_i)) ∨ (Payload(v) = RecordPayload(fs) ∧ ∀ f ∈ fs. CtLiteralType(FieldType(f))))
CtLiteralType(TypeApply(p, [T_1, …, T_n])) ⇔ CtLiteralType(TypePath(p)<T_1, …, T_n>)
```

```text
SpliceCompat(`Expr`, T) ⇔ T = TypePath(["Ast"]) ∨ T = TypePath(["Ast", "Expr"]) ∨ CtLiteralType(T)
SpliceCompat(`Stmt`, T) ⇔ T = TypePath(["Ast", "Stmt"]) ∨ T = TypePath(["Ast", "Expr"])
SpliceCompat(`Item`, T) ⇔ T = TypePath(["Ast", "Item"])
SpliceCompat(`Type`, T) ⇔ T = TypePath(["Ast", "Type"]) ∨ T = TypePath(["Type"])
SpliceCompat(`Pattern`, T) ⇔ T = TypePath(["Ast", "Pattern"])
SpliceCompat(`Identifier`, T) ⇔ T = TypeString(`@Managed`) ∨ T = TypeString(`@View`)
```

#### 22.4.4 Static Semantics

`quote { ... }`, `quote type { ... }`, and `quote pattern { ... }` are valid only in compile-time contexts.

```text
ResolveQuoteKind(QuoteNode(kind, body, span), T_exp) = kind    if kind ≠ ⊥
ResolveQuoteKind(QuoteNode(⊥, body, span), T_exp) = kind    if ExpectedAstKind(T_exp) = kind ∧ kind ≠ ⊥
ResolveQuoteKind(QuoteNode(⊥, body, span), T_exp) = kind    if ExpectedAstKind(T_exp) = ⊥ ∧ `kind` is the unique member of {`Expr`, `Stmt`, `Item`} for which `ParseQuotedBody(kind, body)` succeeds
```

Quoted content MUST be syntactically valid in the resolved category. If `ResolveQuoteKind` is undefined, the quote is ill-formed.

`$(e)` and `$ident` are valid only inside a quoted token slice. The compile-time type of the splice source MUST satisfy `SpliceCompat` for the surrounding quoted position.

`$ident` is an identifier-position splice only. `SpliceIdentNode` MAY occur only in identifier expressions, identifier-pattern bindings, typed-pattern bindings, `using ... as` alias names, `region as` aliases, and procedure or method parameter bindings. `SpliceIdentNode` MUST NOT occur in structural identifier positions, including module or type path segments, field labels, variant names, type-parameter names, item declaration names, or modal state names. In every other quoted position, including quoted type position, splicing MUST use `$(e)`. Ordinary language syntax retains precedence where it already uses `$`; for example, in `quote type { $FileSystem }`, `$FileSystem` is parsed as `TypeDynamic(["FileSystem"])`, not as a splice.

If a string-valued splice occupies identifier position, the resulting identifier is intentionally unhygienic and binds in the emission environment.

`emitter~>emit(ast)` is well-formed only when `emitter` has compile-time type `TypeEmitter` and `ast` has compile-time type `Ast::Item` or `Ast`.

#### 22.4.5 Dynamic Semantics

```text
ParseQuotedBody(`Expr`, QuotedRaw(ts)) ⇓ payload iff the ordinary expression parser, extended with `SpliceExprNode` and `SpliceIdentNode`, parses `ts` as exactly one expression.
ParseQuotedBody(`Stmt`, QuotedRaw(ts)) ⇓ payload iff the ordinary statement parser, extended with `SpliceExprNode` and `SpliceIdentNode`, parses `ts` as exactly one statement.
ParseQuotedBody(`Item`, QuotedRaw(ts)) ⇓ payload iff the ordinary item parser, extended with `SpliceExprNode` and `SpliceIdentNode`, parses `ts` as exactly one top-level item.
ParseQuotedBody(`Type`, QuotedRaw(ts)) ⇓ payload iff the ordinary type parser, extended with `SpliceExprNode` and `SpliceIdentNode`, parses `ts` as exactly one type.
ParseQuotedBody(`Pattern`, QuotedRaw(ts)) ⇓ payload iff the ordinary pattern parser, extended with `SpliceExprNode` and `SpliceIdentNode`, parses `ts` as exactly one pattern.
```

```text
RenderSplice(`Expr`, cv) ⇓ payload    iff (cv = CtAst(a) ∧ AstKindOf(a) = `Expr` ∧ payload = AstPayloadOf(a)) ∨ (cv ≠ CtAst(_) ∧ Γ ⊢ CtLiteralize(cv) ⇓ payload)
RenderSplice(`Stmt`, cv) ⇓ payload    iff cv = CtAst(a) ∧ AstKindOf(a) ∈ {`Stmt`, `Expr`} ∧ payload = AstPayloadOf(a)
RenderSplice(`Item`, cv) ⇓ payload    iff cv = CtAst(a) ∧ AstKindOf(a) = `Item` ∧ payload = AstPayloadOf(a)
RenderSplice(`Type`, cv) ⇓ payload    iff (cv = CtAst(a) ∧ AstKindOf(a) = `Type` ∧ payload = AstPayloadOf(a)) ∨ (cv = CtType(T) ∧ payload = T)
RenderSplice(`Pattern`, cv) ⇓ payload iff cv = CtAst(a) ∧ AstKindOf(a) = `Pattern` ∧ payload = AstPayloadOf(a)
RenderSplice(`Identifier`, cv) ⇓ payload iff cv = CtString(name) ∧ payload = Identifier(name)
```

```text
HygienizeAst(a, quote_site, emit_site, n) ⇓ (a', n') MUST satisfy all of the following:
```

1. Any capture from the quote site resolves to the same binding after emission.
2. Any binder introduced by hygienic quoted content, including top-level declaration names in quoted item fragments, MUST NOT capture names from the emission site unless the splice was string-valued in identifier position.
3. Fresh hygienic marks are deterministic functions of `quote_site`, `emit_site`, and the input counter `n`.

If a reference inside the quoted fragment resolves to a hygienic binder introduced by that same fragment before emission, it MUST resolve to the renamed binding after emission.

For `using` and `import`, only explicit alias names are hygienic binders. Unaliased imported names are preserved as written.

**(CtEval-Quote)**

```text
q = QuoteNode(kind_opt, body, span)    T_q = ExprType(q)    ResolveQuoteKind(q, T_q) = kind    ParseQuotedBody(kind, body) ⇓ payload_0    Γ ⊢ QuoteBuild(Ξ, Φ, kind, payload_0) ⇓ (payload_1, Φ_1)    a = AstNode(kind, payload_1, span, ⟨CtSiteOf(Ξ), CtSiteOf(Ξ), 0⟩)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtEval(Ξ, Φ, q) ⇓ (CtAst(a), Ξ, Φ_1)
```

`QuoteBuild` evaluates splice expressions in left-to-right source order. Each splice value is rendered by `RenderSplice`, substituted into the quoted payload, and the resulting fragment becomes the payload of the returned `Ast`.


Emission order is:
1. derive-generated emissions required by §22.5 for the current declaration
2. explicit `TypeEmitter.emit` calls in source order

#### 22.4.6 Lowering

Quoted and spliced AST fragments affect lowering only through the declarations and expressions present after Phase 2 expansion. No runtime representation of `Ast` survives unless explicitly embedded by emitted declarations.

#### 22.4.7 Diagnostics

Diagnostics for quote, splice, and emission are defined by §22.6.

### 22.5 Derive Targets and Contracts

#### 22.5.1 Syntax

```text
derive_attribute    ::= "[[" "derive" "(" derive_target_list ")" "]]"
derive_target_list  ::= identifier ("," identifier)*
derive_target_decl  ::= "derive" "target" identifier "(" "target" ":" "Type" ")" derive_contract_opt block_expr
derive_contract_opt ::= "|:" derive_clause ("," derive_clause)*
derive_clause       ::= "emits" identifier | "requires" identifier
```

#### 22.5.2 Parsing

DeriveParseJudg = {ParseDeriveAttr, ParseDeriveTargetList, ParseDeriveTargetDecl, ParseDeriveContractOpt, ParseDeriveClauseList, ParseDeriveClauseTail}

`[[derive(... )]]` is parsed by the attribute parser in §9.1.2; the `derive` attribute name and its argument list are interpreted by this section.

**(Parse-DeriveTargetDecl)**

```text
IsIdent(Tok(P))    Lexeme(Tok(P)) = "derive"    FixedIdentTok(Tok(Advance(P)), `target`)    Γ ⊢ ParseIdent(Advance(Advance(P))) ⇓ (P_1, name)    IsPunc(Tok(P_1), "(")    FixedIdentTok(Tok(Advance(P_1)), `target`)    IsPunc(Tok(Advance(Advance(P_1))), ":")    IsIdent(Tok(Advance(Advance(Advance(P_1)))))    Lexeme(Tok(Advance(Advance(Advance(P_1))))) = "Type"    IsPunc(Tok(Advance(Advance(Advance(Advance(P_1))))), ")")    Γ ⊢ ParseDeriveContractOpt(Advance(Advance(Advance(Advance(Advance(P_1)))))) ⇓ (P_2, contract_opt)    Γ ⊢ ParseBlock(P_2) ⇓ (P_3, body)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseItem(P) ⇓ (P_3, DeriveTargetDecl(name, contract_opt, body, SpanBetween(P, P_3), []))
```

**(Parse-DeriveContractOpt-None)**

```text
¬ IsOp(Tok(P), "|:")
```

──────────────────────────────────────────────

```text
Γ ⊢ ParseDeriveContractOpt(P) ⇓ (P, [])
```

**(Parse-DeriveContractOpt-Yes)**

```text
IsOp(Tok(P), "|:")    Γ ⊢ ParseDeriveClauseList(Advance(P)) ⇓ (P_1, clauses)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseDeriveContractOpt(P) ⇓ (P_1, clauses)
```

**(Parse-DeriveClauseList-Cons)**

```text
Γ ⊢ ParseDeriveClause(P) ⇓ (P_1, clause)    Γ ⊢ ParseDeriveClauseTail(P_1, [clause]) ⇓ (P_2, clauses)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseDeriveClauseList(P) ⇓ (P_2, clauses)
```

**(Parse-DeriveClause-Requires)**

```text
FixedIdentTok(Tok(P), `requires`)    Γ ⊢ ParseIdent(Advance(P)) ⇓ (P_1, name)
```

────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseDeriveClause(P) ⇓ (P_1, ⟨`requires`, name⟩)
```

**(Parse-DeriveClause-Emits)**

```text
FixedIdentTok(Tok(P), `emits`)    Γ ⊢ ParseIdent(Advance(P)) ⇓ (P_1, name)
```

────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseDeriveClause(P) ⇓ (P_1, ⟨`emits`, name⟩)
```

**(Parse-DeriveClauseTail-End)**

```text
¬ IsPunc(Tok(P), ",")
```

──────────────────────────────────────────────

```text
Γ ⊢ ParseDeriveClauseTail(P, xs) ⇓ (P, xs)
```

**(Parse-DeriveClauseTail-Comma)**

```text
IsPunc(Tok(P), ",")    Γ ⊢ ParseDeriveClause(Advance(P)) ⇓ (P_1, clause)    Γ ⊢ ParseDeriveClauseTail(P_1, xs ++ [clause]) ⇓ (P_2, ys)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseDeriveClauseTail(P, xs) ⇓ (P_2, ys)
```

#### 22.5.3 AST Representation / Form

DeriveTargetDecl(name, contract_opt, body, span, doc)

```text
DeriveReqs(dt) = { C | `requires` C ∈ contract_opt(dt) }
DeriveEmits(dt) = { C | `emits` C ∈ contract_opt(dt) }
```

DeriveRequest(ty_decl, name) exists when `[[derive(name)]]` is attached to `ty_decl`.

```text
DeriveAnnotated(D) ⇔ ∃ name. DeriveRequest(D, name)
```

DeriveExecJudg = {DeriveGraph, DeriveOrder, RunDeriveTarget, RunDeriveSet}

```text
DeriveEdge(req_i, req_j) ⇔ DeriveReqs(req_i.target) ∩ DeriveEmits(req_j.target) ≠ ∅
DeriveGraph(D) = ⟨V, E⟩ where V = [req | req = DeriveRequest(D, name)] and E = {⟨v_i, v_j⟩ | DeriveEdge(v_i, v_j)}
```

DeriveOrder(D) = order iff StableTopologicalOrder(DeriveGraph(D), [name | `[[derive(name)]]` occurs on `D` in source order]) = order

```text
StableTopologicalOrder(⟨V, E⟩, seed) = order iff `order` is a topological ordering of `⟨V, E⟩` and any two incomparable vertices preserve their relative order from `seed`.
```

TargetTypeOf(D) = TypePath(ItemPath(D))
VisibleDeriveTarget(name, site) = dt iff `dt` is the unique visible `DeriveTargetDecl(name, _, _, _, _)` at `site` under the ordinary item-visibility rules.

```text
DeclaredImplNames(D) = { name | ∃ prefix. prefix ++ [name] ∈ Implements(D) }
```

#### 22.5.4 Static Semantics

`[[derive(... )]]` is valid only on `record`, `enum`, and `modal` declarations.

Every derive target name in `[[derive(... )]]` MUST resolve to exactly one `derive target` declaration visible at the annotated declaration.

Within the body of a derive target declaration, the following bindings are available:
- `target : Type`
- `emitter : TypeEmitter`
- `introspect : Introspect`
- `diagnostics : ComptimeDiagnostics`

The body of a derive target declaration executes under the same restrictions as any other compile-time procedure body.

For one annotated type declaration `D`, derive execution order is the topological order of the graph:
- vertices: all `DeriveRequest(D, name)`
- edge `name_i -> name_j` when `DeriveReqs(name_i) ∩ DeriveEmits(name_j) ≠ ∅`

If multiple derive targets are incomparable in that graph, source order in `[[derive(... )]]` is the tie-breaker.

Before executing derive target `name` for type `D`, every class in `DeriveReqs(name)` MUST belong to `DeclaredImplNames(D)`.

Before executing derive target `name` for type `D`, every class in `DeriveEmits(name)` MUST belong to `DeclaredImplNames(D)`.

`requires` and `emits` participate only in derive ordering and validation against the annotated declaration's explicit `implements` list. They do not add or remove class implementations for `D`.

#### 22.5.5 Dynamic Semantics

`DeriveTargetDecl` is a compile-time-only item. It is visible to later derive lookup in the same Phase 2 module order and MUST NOT survive into the expanded Phase 3 module set.

**(CtExpandItem-DeriveTargetDecl)**
dt = DeriveTargetDecl(_, _, _, _, _)
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtExpandItem(Ξ, Φ, dt) ⇓ (⟨[], []⟩, Ξ, Φ)
```

**(RunDeriveSet-Empty)**
──────────────────────────────────────────────

```text
Γ ⊢ RunDeriveSet(D, [], Ξ, Φ) ⇓ ([], Ξ, Φ)
```

**(RunDeriveSet-Cons)**

```text
VisibleDeriveTarget(name, CtSiteOf(Ξ)) = dt    Γ ⊢ RunDeriveTarget(D, dt, Ξ, Φ_0) ⇓ (items_0, Ξ_1, Φ_1)    Γ ⊢ RunDeriveSet(D, rest, Ξ_1, Φ_1) ⇓ (items_1, Ξ_2, Φ_2)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ RunDeriveSet(D, [name] ++ rest, Ξ, Φ_0) ⇓ (items_0 ++ items_1, Ξ_2, Φ_2)
```

**(RunDeriveTarget)**

```text
dt = DeriveTargetDecl(name, contract_opt, body, span, doc)    Ξ_0 = BindDeriveTargetInputs(Ξ, D)    Γ ⊢ CtExec(Ξ_0, Φ_0, body) ⇓ (Ξ_1, Φ_1)    items = CtPendingEmits(Φ_1)    Φ_2 = ⟨CtFiles(Φ_1), CtProjectRoot(Φ_1), CtDiags(Φ_1), [], CtFreshSeed(Φ_1)⟩
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ RunDeriveTarget(D, dt, Ξ, Φ_0) ⇓ (items, Ξ_1, Φ_2)
```

```text
BindDeriveTargetInputs(Ξ, D) = Ξ' iff `Ξ'` extends `Ξ` with the fixed compile-time bindings required by §22.5.4 for one derive-target execution over `D`: `target = CtType(TargetTypeOf(D))`, plus the `TypeEmitter`, `Introspect`, and `ComptimeDiagnostics` capability bindings visible in derive-target bodies.
```

**(CtExpandItem-DeriveAnnotatedDecl)**

```text
DeriveAnnotated(D)    DeriveOrder(D) = [name_1, …, name_n]    Γ ⊢ RunDeriveSet(D, [name_1, …, name_n], Ξ, Φ_0) ⇓ (emits, Ξ_1, Φ_1)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CtExpandItem(Ξ, Φ_0, D) ⇓ (⟨[D], emits⟩, Ξ_1, Φ_1)
```

Each derive target executes exactly once per annotated declaration, immediately after the annotated declaration has been introduced and before any later source item in the same module is executed.

If a derive target signals `diagnostics.error`, panics, or emits ill-formed declarations, Phase 2 fails and compilation is rejected.

#### 22.5.6 Lowering

Derive targets introduce no runtime dispatch or metadata. Their only lowering consequence is the presence of the declarations emitted during Phase 2.

#### 22.5.7 Diagnostics

Diagnostics for derive targets and derive contracts are defined by §22.6.

### 22.6 Compile-Time Diagnostics Supplement

This section owns compile-time execution, reflection, quoting, emission, file-access, and derive diagnostics.

| Code         | Severity | Detection    | Condition                                                      |
| ------------ | -------- | ------------ | -------------------------------------------------------------- |
| `E-CTE-0010` | Error    | Compile-time | Non-comptime-available type in compile-time context            |
| `E-CTE-0011` | Error    | Compile-time | Pointer or provenance-bearing type in compile-time context     |
| `E-CTE-0012` | Error    | Compile-time | Capability-bearing type in compile-time context                |
| `E-CTE-0020` | Error    | Compile-time | Compile-time block contains prohibited runtime construct       |
| `E-CTE-0021` | Error    | Compile-time | Compile-time expression has non-comptime-available type        |
| `E-CTE-0022` | Error    | Compile-time | Compile-time evaluation did not terminate                      |
| `E-CTE-0023` | Error    | Compile-time | Compile-time evaluation panicked                               |
| `E-CTE-0030` | Error    | Compile-time | Compile-time procedure parameter type not comptime-available   |
| `E-CTE-0031` | Error    | Compile-time | Compile-time procedure return type not comptime-available      |
| `E-CTE-0032` | Error    | Compile-time | Compile-time procedure body violates compile-time restrictions |
| `E-CTE-0033` | Error    | Compile-time | Compile-time procedure contract predicate evaluates to false   |
| `E-CTE-0034` | Error    | Compile-time | Compile-time procedure referenced from runtime context         |
| `E-CTE-0040` | Error    | Compile-time | Emit operation without `TypeEmitter` capability                |
| `E-CTE-0041` | Error    | Compile-time | `[[emit]]` applied to non-compile-time form                    |
| `E-CTE-0042` | Error    | Compile-time | Emitted AST is ill-formed                                      |
| `E-CTE-0050` | Error    | Compile-time | Reflection `fields` applied to non-record type                 |
| `E-CTE-0051` | Error    | Compile-time | Reflection `variants` applied to non-enum type                 |
| `E-CTE-0052` | Error    | Compile-time | Reflection `states` applied to non-modal type                  |
| `E-CTE-0053` | Error    | Compile-time | Reflection requires incomplete or non-reflectable declaration  |
| `E-CTE-0060` | Error    | Compile-time | File operation without `ProjectFiles` capability               |
| `E-CTE-0061` | Error    | Compile-time | `[[files]]` applied to non-compile-time form                   |
| `E-CTE-0062` | Error    | Compile-time | Compile-time file path escapes project root                    |
| `E-CTE-0063` | Error    | Compile-time | Absolute path used in compile-time file operation              |
| `E-CTE-0064` | Error    | Compile-time | Compile-time file path not found                               |
| `E-CTE-0070` | Error    | Compile-time | Compile-time error emitted by user code                        |
| `W-CTE-0071` | Warning  | Compile-time | Compile-time warning emitted by user code                      |
| `E-CTE-0080` | Error    | Compile-time | `comptime if` condition not compile-time evaluable             |
| `E-CTE-0081` | Error    | Compile-time | `comptime if` condition does not have type `bool`              |
| `E-CTE-0082` | Error    | Compile-time | `comptime loop` source not compile-time evaluable              |
| `E-CTE-0083` | Error    | Compile-time | `comptime loop` source is not a finite iterable                |
| `E-CTE-0210` | Error    | Compile-time | `Ast` value used in runtime context                            |
| `E-CTE-0220` | Error    | Compile-time | Quoted content is syntactically invalid or category-ambiguous  |
| `E-CTE-0221` | Error    | Compile-time | Quote form outside compile-time context                        |
| `E-CTE-0230` | Error    | Compile-time | Splice type incompatible with quote context                    |
| `E-CTE-0231` | Error    | Compile-time | Splice expression not compile-time evaluable                   |
| `E-CTE-0232` | Error    | Compile-time | Invalid identifier string in splice                            |
| `E-CTE-0233` | Error    | Compile-time | Splice appears outside quote context                           |
| `E-CTE-0240` | Error    | Compile-time | Hygienic capture no longer resolves at emission site           |
| `E-CTE-0241` | Error    | Compile-time | Hygiene renaming collision after unhygienic splice             |
| `E-CTE-0250` | Error    | Compile-time | Emit call without `TypeEmitter` capability                     |
| `E-CTE-0251` | Error    | Compile-time | Emitted AST is not an item                                     |
| `E-CTE-0252` | Error    | Compile-time | Emitted AST fails well-formedness after insertion              |
| `E-CTE-0253` | Error    | Compile-time | Type error in emitted code                                     |
| `E-CTE-0310` | Error    | Compile-time | Unknown derive target name                                     |
| `E-CTE-0311` | Error    | Compile-time | `[[derive(... )]]` applied to non-type declaration             |
| `E-CTE-0312` | Error    | Compile-time | Duplicate derive target in one derive attribute                |
| `E-CTE-0320` | Error    | Compile-time | Derive target body violates compile-time restrictions          |
| `E-CTE-0321` | Error    | Compile-time | Derive contract references unknown class                       |
| `E-CTE-0322` | Error    | Compile-time | Derive target declaration has invalid signature                |
| `E-CTE-0330` | Error    | Compile-time | Required class not implemented by derive target subject        |
| `E-CTE-0331` | Error    | Compile-time | Emitted class not implemented by derive target subject         |
| `E-CTE-0340` | Error    | Compile-time | Cyclic derive dependency                                       |
| `E-CTE-0341` | Error    | Compile-time | Derive target execution panicked                               |
| `E-CTE-0410` | Error    | Compile-time | Ill-formed type in `Type::<...>`                               |
| `E-CTE-0411` | Error    | Compile-time | `Type::<...>` used in runtime context                          |
| `E-CTE-0420` | Error    | Compile-time | Reflection category query on incomplete declaration            |
| `E-CTE-0430` | Error    | Compile-time | Reflection `fields` query on non-record type                   |
| `E-CTE-0440` | Error    | Compile-time | Reflection `variants` query on non-enum type                   |
| `E-CTE-0450` | Error    | Compile-time | Reflection `states` query on non-modal type                    |
| `E-CTE-0470` | Error    | Compile-time | Reflection type-predicate query on incomplete declaration      |

```text
`diagnostics.error(msg)` MUST append `⟨`E-CTE-0070`, Error, msg, sp⟩`, where `sp` is the current compile-time site span.
`diagnostics.warning(msg)` MUST append `⟨`W-CTE-0071`, Warning, msg, sp⟩`, where `sp` is the current compile-time site span.
`diagnostics.note(msg)` MUST append `⟨⊥, Note, msg, sp⟩`, where `sp` is the current compile-time site span.
```
