---
title: "Foreign Function Interface"
description: "23. Foreign Function Interface of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T17:39:45.389Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## 23. Foreign Function Interface

**FFI Boundary.** A call to an `extern` procedure or an invocation of a `[[export]]` or `[[host_export]]` procedure from foreign code crosses the foreign-function boundary.

```text
FFIBoundary(proc) ⇔ proc = ExternProcDecl(_, _, _, _, _, _, _, _, _, _, _) ∨ (proc = ProcedureDecl(_, _, _, _, _, _, _, _, _, _, _) ∧ (ExportAttr(proc) defined ∨ HostExportAttr(proc) defined))
```

### 23.1 FfiSafe

#### 23.1.1 Syntax

This section introduces no additional concrete syntax.

#### 23.1.2 Parsing

This section introduces no additional parsing rules.

#### 23.1.3 AST Representation / Form

`FfiSafeType` is a semantic predicate over existing `Type` forms, including `TypePrim`, `TypeArray`, `TypeFunc`, `TypePerm`, `TypePath`, and `TypeApply`.

#### 23.1.4 Static Semantics

**FfiSafe Predicate.** `FfiSafeType(T)` holds when the runtime representation of `T` is compatible with the platform C ABI.

FfiSafeJudg = {FfiSafeType}

FfiPrimTypes = {`i8`, `i16`, `i32`, `i64`, `i128`, `u8`, `u16`, `u32`, `u64`, `u128`, `isize`, `usize`, `f16`, `f32`, `f64`, `char`, `()`}

```text
HasLayoutC(D) ⇔ `layout(C)` appears in D.attrs_opt
PayloadTypes(v) = []    if v.payload_opt = ⊥
```

PayloadTypes(v) = ts    if v.payload_opt = TuplePayload(ts)

```text
PayloadTypes(v) = [T_f | ⟨_, f, T_f, _, _, _⟩ ∈ fields]    if v.payload_opt = RecordPayload(fields)
```

TypeParamSet(params) = Set(TypeParamNames(params))

```text
AliasParams(p) = gen_params_opt ⇔ Σ.Types[p] = TypeAliasDecl(_, _, _, gen_params_opt, _, _, _, _)
AliasPredicateClause(p) = predicate_clause_opt ⇔ Σ.Types[p] = TypeAliasDecl(_, _, _, _, predicate_clause_opt, _, _, _)
```

```text
TypeSubst(θ, TypePath([x])) = θ(x)    if x ∈ dom(θ)
TypeSubst(θ, TypePath(p)) = TypePath(p)    if p ≠ [x] ∨ x ∉ dom(θ)
TypeSubst(θ, TypeApply(p, args)) = TypeApply(p, [TypeSubst(θ, a) | a ∈ args])
TypeSubst(θ, TypePerm(p, T)) = TypePerm(p, TypeSubst(θ, T))
TypeSubst(θ, TypeTuple(ts)) = TypeTuple([TypeSubst(θ, t) | t ∈ ts])
TypeSubst(θ, TypeArray(T, e)) = TypeArray(TypeSubst(θ, T), e)
TypeSubst(θ, TypeSlice(T)) = TypeSlice(TypeSubst(θ, T))
TypeSubst(θ, TypeUnion(ts)) = TypeUnion([TypeSubst(θ, t) | t ∈ ts])
TypeSubst(θ, TypeFunc(params, R)) = TypeFunc([⟨m, TypeSubst(θ, T)⟩ | ⟨m, T⟩ ∈ params], TypeSubst(θ, R))
TypeSubst(θ, TypePtr(T, s)) = TypePtr(TypeSubst(θ, T), s)
TypeSubst(θ, TypeRawPtr(q, T)) = TypeRawPtr(q, TypeSubst(θ, T))
TypeSubst(θ, TypeString(s)) = TypeString(s)
TypeSubst(θ, TypeBytes(s)) = TypeBytes(s)
ModalRefSubst(θ, TypePath(p)) = TypePath(p)
ModalRefSubst(θ, TypeApply(p, args)) = TypeApply(p, [TypeSubst(θ, a) | a ∈ args])
TypeSubst(θ, TypeModalState(modal_ref, S)) = TypeModalState(ModalRefSubst(θ, modal_ref), S)
TypeSubst(θ, TypeDynamic(p)) = TypeDynamic(p)
TypeSubst(θ, TypeOpaque(p)) = TypeOpaque(p)
TypeSubst(θ, TypePrim(n)) = TypePrim(n)
TypeSubst(θ, TypeRange(base)) = TypeRange(TypeSubst(θ, base))
TypeSubst(θ, TypeRangeInclusive(base)) = TypeRangeInclusive(TypeSubst(θ, base))
TypeSubst(θ, TypeRangeFrom(base)) = TypeRangeFrom(TypeSubst(θ, base))
TypeSubst(θ, TypeRangeTo(base)) = TypeRangeTo(TypeSubst(θ, base))
TypeSubst(θ, TypeRangeToInclusive(base)) = TypeRangeToInclusive(TypeSubst(θ, base))
TypeSubst(θ, TypeRangeFull) = TypeRangeFull
```

```text
TypeParamsIn(TypePath([x]), params) = {x}    if x ∈ TypeParamSet(params)
TypeParamsIn(TypePath(p), params) = ∅        if p ≠ [x] ∨ x ∉ TypeParamSet(params)
TypeParamsIn(TypeApply(_, args), params) = ⋃_{a ∈ args} TypeParamsIn(a, params)
```

TypeParamsIn(TypePerm(_, T), params) = TypeParamsIn(T, params)

```text
TypeParamsIn(TypeTuple(ts), params) = ⋃_{t ∈ ts} TypeParamsIn(t, params)
```

TypeParamsIn(TypeArray(T, _), params) = TypeParamsIn(T, params)
TypeParamsIn(TypeSlice(T), params) = TypeParamsIn(T, params)

```text
TypeParamsIn(TypeUnion(ts), params) = ⋃_{t ∈ ts} TypeParamsIn(t, params)
TypeParamsIn(TypeFunc(params_t, R), params) = ⋃_{⟨_, T⟩ ∈ params_t} TypeParamsIn(T, params) ∪ TypeParamsIn(R, params)
```

TypeParamsIn(TypePtr(T, _), params) = TypeParamsIn(T, params)
TypeParamsIn(TypeRawPtr(_, T), params) = TypeParamsIn(T, params)
TypeParamsInModalRef(TypePath(_), params) = ∅

```text
TypeParamsInModalRef(TypeApply(_, args), params) = ⋃_{a ∈ args} TypeParamsIn(a, params)
```

TypeParamsIn(TypeModalState(modal_ref, _), params) = TypeParamsInModalRef(modal_ref, params)
TypeParamsIn(TypeString(_), params) = ∅
TypeParamsIn(TypeBytes(_), params) = ∅
TypeParamsIn(TypeModalState(_, _), params) = ∅
TypeParamsIn(TypeDynamic(_), params) = ∅
TypeParamsIn(TypeOpaque(_), params) = ∅
TypeParamsIn(TypePrim(_), params) = ∅
TypeParamsIn(TypeRange(base), params) = TypeParamsIn(base, params)
TypeParamsIn(TypeRangeInclusive(base), params) = TypeParamsIn(base, params)
TypeParamsIn(TypeRangeFrom(base), params) = TypeParamsIn(base, params)
TypeParamsIn(TypeRangeTo(base), params) = TypeParamsIn(base, params)
TypeParamsIn(TypeRangeToInclusive(base), params) = TypeParamsIn(base, params)
TypeParamsIn(TypeRangeFull, params) = ∅

```text
TypeParamsInFields(fields, params) = ⋃_{f ∈ fields} TypeParamsIn(f.type, params)
TypeParamsInPayloads(vars, params) = ⋃_{v ∈ vars} ⋃_{T_f ∈ PayloadTypes(v)} TypeParamsIn(T_f, params)
```

```text
HasFfiSafeReq(W, x) ⇔ ∃ wp ∈ PredicateReqs(W). wp = PredicateReq(`FfiSafe`, TypePath([x]))
FfiSafePredicateClauseOk(params, W, Xs) ⇔ ∀ x ∈ Xs. HasFfiSafeReq(W, x)
```

```text
ProhibitedFfiType(T) ⇔
 T = TypePrim("bool") ∨
 T = TypePtr(_, _) ∨
 T = TypeModalState(_, _) ∨
 T = ModalRefType(modal_ref) ∨
 T = TypeDynamic(_) ∨
 T = TypeOpaque(_) ∨
 T = TypeTuple(_) ∨
 T = TypeUnion(_) ∨
 T = TypeSlice(_) ∨
 T = TypeString(_) ∨
 T = TypeBytes(_) ∨
 T = TypeRange(_) ∨
 T = TypeRangeInclusive(_) ∨
 T = TypeRangeFrom(_) ∨
 T = TypeRangeTo(_) ∨
 T = TypeRangeToInclusive(_) ∨
 T = TypeRangeFull ∨
```

 T = TypePath(["Context"])

```text
FfiByValueType(T) ⇔ StripPerm(T) ∉ {TypeRawPtr(_, _), TypePtr(_, _), TypeFunc(_, _)} ∧ StripPerm(T) ≠ TypePrim("()")
FfiPassByValueAttr(T) ⇔ (T = TypePath(p) ∧ RecordDecl(p) = R ∧ AttrByName(R, "ffi_pass_by_value") ≠ []) ∨ (T = TypePath(p) ∧ EnumDecl(p) = E ∧ AttrByName(E, "ffi_pass_by_value") ≠ [])
FfiByValueOk(T) ⇔ ¬(DropType(T) ∧ FfiSafeType(T) ⇓ ok ∧ FfiByValueType(T)) ∨ FfiPassByValueAttr(StripPerm(T))
```

**(FfiSafe-Prim)**

```text
T = TypePrim(t)    t ∈ FfiPrimTypes
```

──────────────────────────────────────────────

```text
Γ ⊢ FfiSafeType(T) ⇓ ok
```

**(FfiSafe-RawPtr)**
T = TypeRawPtr(_, _)
──────────────────────────────────────────────

```text
Γ ⊢ FfiSafeType(T) ⇓ ok
```

**(FfiSafe-Array)**

```text
T = TypeArray(U, n)    Γ ⊢ ConstLen(n) ⇓ _    Γ ⊢ FfiSafeType(U) ⇓ ok
```

────────────────────────────────────────────────────────────

```text
Γ ⊢ FfiSafeType(T) ⇓ ok
```

**(FfiSafe-Func)**

```text
T = TypeFunc(params, R)    ∀ ⟨_, T_i⟩ ∈ params. Γ ⊢ FfiSafeType(T_i) ⇓ ok    Γ ⊢ FfiSafeType(R) ⇓ ok
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ FfiSafeType(T) ⇓ ok
```

**(FfiSafe-Perm)**

```text
T = TypePerm(_, U)    Γ ⊢ FfiSafeType(U) ⇓ ok
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ FfiSafeType(T) ⇓ ok
```

**(FfiSafe-Alias)**

```text
T = TypePath(p)    AliasBody(p) = ty    Γ ⊢ FfiSafeType(ty) ⇓ ok
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ FfiSafeType(T) ⇓ ok
```

**(FfiSafe-Alias-Apply)**

```text
T = TypeApply(p, args)    AliasBody(p) = ty    params_gen = TypeParamsOpt(AliasParams(p))    DefaultArgs(params_gen, args) = args'    θ = [args'_i / params_gen[i].name]    Γ ⊢ AliasPredicateClause(p)[θ] ok    Γ ⊢ FfiSafeType(TypeSubst(θ, ty)) ⇓ ok
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ FfiSafeType(T) ⇓ ok
```

**(FfiSafe-Record)**

```text
T = TypePath(p)    RecordDecl(p) = R    HasLayoutC(R)    TypeParamsOpt(R.gen_params_opt) = []    Γ ⊢ layout(T) ⇓ _    ∀ f : T_f ∈ Fields(R). Γ ⊢ FfiSafeType(T_f) ⇓ ok    FfiSafePredicateClauseOk([], R.predicate_clause_opt, ∅)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ FfiSafeType(T) ⇓ ok
```

**(FfiSafe-Record-Apply)**

```text
T = TypeApply(p, args)    RecordDecl(p) = R    params_gen = TypeParamsOpt(R.gen_params_opt)    DefaultArgs(params_gen, args) = args'    θ = [args'_i / params_gen[i].name]    HasLayoutC(R)    Γ ⊢ layout(T) ⇓ _    Γ ⊢ R.predicate_clause_opt[θ] ok    FfiSafePredicateClauseOk(params_gen, R.predicate_clause_opt, TypeParamsInFields(Fields(R), params_gen))    ∀ f : T_f ∈ Fields(R). Γ ⊢ FfiSafeType(TypeSubst(θ, T_f)) ⇓ ok
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ FfiSafeType(T) ⇓ ok
```

**(FfiSafe-Enum)**

```text
T = TypePath(p)    EnumDecl(p) = E    HasLayoutC(E)    TypeParamsOpt(E.gen_params_opt) = []    Γ ⊢ layout(T) ⇓ _    ∀ v ∈ Variants(E). ∀ T_f ∈ PayloadTypes(v). Γ ⊢ FfiSafeType(T_f) ⇓ ok    FfiSafePredicateClauseOk([], E.predicate_clause_opt, ∅)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ FfiSafeType(T) ⇓ ok
```

**(FfiSafe-Enum-Apply)**

```text
T = TypeApply(p, args)    EnumDecl(p) = E    params_gen = TypeParamsOpt(E.gen_params_opt)    DefaultArgs(params_gen, args) = args'    θ = [args'_i / params_gen[i].name]    HasLayoutC(E)    Γ ⊢ layout(T) ⇓ _    Γ ⊢ E.predicate_clause_opt[θ] ok    FfiSafePredicateClauseOk(params_gen, E.predicate_clause_opt, TypeParamsInPayloads(Variants(E), params_gen))    ∀ v ∈ Variants(E). ∀ T_f ∈ PayloadTypes(v). Γ ⊢ FfiSafeType(TypeSubst(θ, T_f)) ⇓ ok
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ FfiSafeType(T) ⇓ ok
```

**(FfiSafe-Prohibited-Err)**
ProhibitedFfiType(T)    c = Code(FfiSafe-Prohibited-Err)
──────────────────────────────────────────────────────────────

```text
Γ ⊢ FfiSafeType(T) ⇑ c
```

**(FfiSafe-Record-LayoutC-Err)**

```text
(T = TypePath(p) ∨ T = TypeApply(p, _))    RecordDecl(p) = R    ¬ HasLayoutC(R)    c = Code(FfiSafe-Record-LayoutC-Err)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ FfiSafeType(T) ⇑ c
```

**(FfiSafe-Enum-LayoutC-Err)**

```text
(T = TypePath(p) ∨ T = TypeApply(p, _))    EnumDecl(p) = E    ¬ HasLayoutC(E)    c = Code(FfiSafe-Enum-LayoutC-Err)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ FfiSafeType(T) ⇑ c
```

**(FfiSafe-Record-Field-Err)**

```text
T = TypePath(p)    RecordDecl(p) = R    HasLayoutC(R)    ∃ f : T_f ∈ Fields(R). Γ ⊢ FfiSafeType(T_f) ⇑    c = Code(FfiSafe-Record-Field-Err)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ FfiSafeType(T) ⇑ c
```

**(FfiSafe-Record-Field-Apply-Err)**

```text
T = TypeApply(p, args)    RecordDecl(p) = R    params_gen = TypeParamsOpt(R.gen_params_opt)    DefaultArgs(params_gen, args) = args'    θ = [args'_i / params_gen[i].name]    HasLayoutC(R)    ∃ f : T_f ∈ Fields(R). Γ ⊢ FfiSafeType(TypeSubst(θ, T_f)) ⇑    c = Code(FfiSafe-Record-Field-Err)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ FfiSafeType(T) ⇑ c
```

**(FfiSafe-Enum-Field-Err)**

```text
T = TypePath(p)    EnumDecl(p) = E    HasLayoutC(E)    ∃ v ∈ Variants(E). ∃ T_f ∈ PayloadTypes(v). Γ ⊢ FfiSafeType(T_f) ⇑    c = Code(FfiSafe-Enum-Field-Err)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ FfiSafeType(T) ⇑ c
```

**(FfiSafe-Enum-Field-Apply-Err)**

```text
T = TypeApply(p, args)    EnumDecl(p) = E    params_gen = TypeParamsOpt(E.gen_params_opt)    DefaultArgs(params_gen, args) = args'    θ = [args'_i / params_gen[i].name]    HasLayoutC(E)    ∃ v ∈ Variants(E). ∃ T_f ∈ PayloadTypes(v). Γ ⊢ FfiSafeType(TypeSubst(θ, T_f)) ⇑    c = Code(FfiSafe-Enum-Field-Err)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ FfiSafeType(T) ⇑ c
```

**(FfiSafe-Incomplete-Err)**

```text
(T = TypePath(p) ∨ T = TypeApply(p, _))    (RecordDecl(p) = R ∨ EnumDecl(p) = E)    ¬ ∃ τ. Γ ⊢ layout(T) ⇓ τ    c = Code(FfiSafe-Incomplete-Err)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ FfiSafeType(T) ⇑ c
```

**(FfiSafe-Record-Generic-Unbounded-Err)**

```text
T = TypePath(p)    RecordDecl(p) = R    params_gen = TypeParamsOpt(R.gen_params_opt)    params_gen ≠ []    ¬ FfiSafePredicateClauseOk(params_gen, R.predicate_clause_opt, TypeParamsInFields(Fields(R), params_gen))    c = Code(FfiSafe-Generic-Unbounded-Err)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ FfiSafeType(T) ⇑ c
```

**(FfiSafe-Enum-Generic-Unbounded-Err)**

```text
T = TypePath(p)    EnumDecl(p) = E    params_gen = TypeParamsOpt(E.gen_params_opt)    params_gen ≠ []    ¬ FfiSafePredicateClauseOk(params_gen, E.predicate_clause_opt, TypeParamsInPayloads(Variants(E), params_gen))    c = Code(FfiSafe-Generic-Unbounded-Err)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ FfiSafeType(T) ⇑ c
```

**(FfiSafe-Record-Apply-Generic-Unbounded-Err)**

```text
T = TypeApply(p, args)    RecordDecl(p) = R    params_gen = TypeParamsOpt(R.gen_params_opt)    params_gen ≠ []    ¬ FfiSafePredicateClauseOk(params_gen, R.predicate_clause_opt, TypeParamsInFields(Fields(R), params_gen))    c = Code(FfiSafe-Generic-Unbounded-Err)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ FfiSafeType(T) ⇑ c
```

**(FfiSafe-Enum-Apply-Generic-Unbounded-Err)**

```text
T = TypeApply(p, args)    EnumDecl(p) = E    params_gen = TypeParamsOpt(E.gen_params_opt)    params_gen ≠ []    ¬ FfiSafePredicateClauseOk(params_gen, E.predicate_clause_opt, TypeParamsInPayloads(Variants(E), params_gen))    c = Code(FfiSafe-Generic-Unbounded-Err)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ FfiSafeType(T) ⇑ c
```

**Prohibited Categories**

The following type categories MUST NOT satisfy `FfiSafeType`:

- `bool`
- Modal types
- Safe pointers `Ptr<T>`
- Dynamic class object types `TypeDynamic(_)`
- Opaque types
- Tuples
- Unions
- Slices
- String and bytes types
- `Context`
- Range types

**RAII by-value rule.** If a type satisfies both `DropType` and `FfiSafeType`, then any by-value appearance of that type in an FFI signature requires the defining type to carry `[[ffi_pass_by_value]]`.

**Generic Bounds.** Any type parameter that appears in a field type or variant payload of a type satisfying `FfiSafeType` MUST be bounded by a predicate requirement of the form `FfiSafe(X)` in the declaration's `|:` clause.

#### 23.1.5 Dynamic Semantics

This section introduces no additional runtime mechanism. Dynamic boundary behavior is defined by §§23.2, 23.3, and 23.7.

#### 23.1.6 Lowering

`FfiSafeType` constrains which values may be lowered across an FFI boundary. This section introduces no additional feature-local lowering beyond the ABI and boundary rules defined in §§23.2, 23.3, and 23.7.

#### 23.1.7 Diagnostics

| Code         | Severity | Detection    | Condition                                                      |
| ------------ | -------- | ------------ | -------------------------------------------------------------- |
| `E-TYP-2623` | Error    | Compile-time | Prohibited type category in `FfiSafeType`                      |
| `E-TYP-2624` | Error    | Compile-time | `FfiSafeType` record without `[[layout(C)]]`                   |
| `E-TYP-2625` | Error    | Compile-time | `FfiSafeType` enum without `[[layout(C)]]`                     |
| `E-TYP-2626` | Error    | Compile-time | `FfiSafeType` record has non-`FfiSafeType` field               |
| `E-TYP-2627` | Error    | Compile-time | `FfiSafeType` enum has non-`FfiSafeType` payload field         |
| `E-TYP-2628` | Error    | Compile-time | `FfiSafeType` requires complete layout                         |
| `E-TYP-2629` | Error    | Compile-time | Generic `FfiSafeType` with unconstrained parameter             |
| `E-TYP-2630` | Error    | Compile-time | By-value FFI use of `DropType` without `[[ffi_pass_by_value]]` |

### 23.2 Extern Procedures

#### 23.2.1 Syntax

```text
extern_procedure_decl ::= attribute_list? visibility? "procedure" identifier generic_params? signature predicate_clause? contract_clause? foreign_contract_clause_list? terminator
```

#### 23.2.2 Parsing

**(Parse-ExternProcDecl)**

```text
Γ ⊢ ParseAttrListOpt(P) ⇓ (P_0, attrs_opt)    Γ ⊢ ParseVis(P_0) ⇓ (P_1, vis)    IsKw(Tok(P_1), `procedure`)    Γ ⊢ ParseIdent(Advance(P_1)) ⇓ (P_2, name)    Γ ⊢ ParseGenericParamsOpt(P_2) ⇓ (P_3, gen_params_opt)    Γ ⊢ ParseSignature(P_3) ⇓ (P_4, params, ret_opt)    Γ ⊢ ParsePredicateClauseOpt(P_4) ⇓ (P_5, predicate_clause_opt)    Γ ⊢ ParseContractClauseOpt(P_5) ⇓ (P_6, contract_opt)    Γ ⊢ ParseForeignContractClauseListOpt(P_6) ⇓ (P_7, foreign_contracts_opt)    Γ ⊢ ConsumeTerminatorReq(P_7) ⇓ P_8
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseExternProcDecl(P) ⇓ (P_8, ExternProcDecl(attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, params, ret_opt, contract_opt, foreign_contracts_opt, SpanBetween(P, P_8), []))
```

#### 23.2.3 AST Representation / Form

Extern procedure declarations are represented by:

```text
ExternProcDecl = ⟨attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, params, return_type_opt, contract_opt, foreign_contracts_opt, span, doc⟩
```

Extern procedure declarations also admit the derived forms:

```text
ProcName(proc) = name ⇔ proc = ExternProcDecl(_, _, name, _, _, _, _, _, _, _, _)
ExternRawName(proc) ⇔ proc = ExternProcDecl(_, _, _, _, _, _, _, _, _, _, _) ∧ ExternAbiName(ExternAbiOf(proc)) ∈ {"C", "C-unwind"}
```

#### 23.2.4 Static Semantics

**Extern Procedure.** A declaration whose implementation is provided by foreign code.

**ABI Strings**

ExternAbiSet = {"C", "C-unwind", "system", "stdcall", "fastcall", "vectorcall"}
AbiProfileOk("C", profile)
AbiProfileOk("C-unwind", profile)
AbiProfileOk("system", profile)

```text
AbiProfileOk("stdcall", profile) ⇔ profile = `x86_64-win64`
AbiProfileOk("fastcall", profile) ⇔ profile = `x86_64-win64`
AbiProfileOk("vectorcall", profile) ⇔ profile = `x86_64-win64`
ExternAbiOk(abi_opt) ⇔ ExternAbiName(abi_opt) ∈ ExternAbiSet ∧ AbiProfileOk(ExternAbiName(abi_opt), SelectedTargetProfile)
```

**Signature Requirements**

```text
ExternParamTypes(params) = [T_i | ⟨_, _, T_i⟩ ∈ params]
ExternSigOk(params, ret_opt) ⇔
 R = ProcReturn(ret_opt) ∧
 (R = TypePrim("()") ∨ Γ ⊢ FfiSafeType(R) ⇓ ok) ∧
 (∀ T ∈ ExternParamTypes(params). Γ ⊢ FfiSafeType(T) ⇓ ok) ∧
 (∀ T ∈ ExternParamTypes(params). FfiByValueOk(T)) ∧
```

 FfiByValueOk(R)

```text
SparseFuncType(T) ⇔ T = TypeFunc(_, _)
```

**FFI Constraints**

1. Closure types MUST NOT appear in `extern` signatures.
2. Only sparse function pointer types are FFI-safe in `extern` signatures (`SparseFuncType`).
3. Sparse function pointer types in `extern` signatures MUST NOT have generic type parameters.

**Call Safety**

Calls to extern procedures MUST appear within an `unsafe` block.

#### 23.2.5 Dynamic Semantics

Calls to extern procedures transfer control to foreign code. If `UnwindMode(proc) = "catch"`, foreign unwinds are converted to Ultraviolet panics at the boundary as defined in §23.7. If `UnwindMode(proc) = "abort"`, any unwind that attempts to cross the boundary aborts as defined in §23.7.

#### 23.2.6 Lowering

Import-side unwind landing pads are defined in §23.7. This section introduces no additional lowering rules beyond ABI selection and the required unsafe-call boundary.

#### 23.2.7 Diagnostics

| Code         | Severity | Detection    | Condition                                         |
| ------------ | -------- | ------------ | ------------------------------------------------- |
| `E-TYP-2306` | Error    | Compile-time | Generic parameter in `extern` procedure signature |
| `E-TYP-2106` | Error    | Compile-time | Call to `extern` procedure outside `unsafe`       |

Type-admissibility failures in `FfiSafeType` and by-value FFI use are owned by §23.1.7.

### 23.3 Exported Procedures and Hosted Exports

#### 23.3.1 Raw Exported Procedures

A procedure becomes a raw exported procedure when it carries `[[export("abi")]]`. The attribute syntax is defined in §23.4.1.

#### 23.3.2 Parsing

Raw exported procedures are parsed by the ordinary procedure-declaration parser from §15.1.2.

An ordinary `ProcedureDecl` is classified as a raw exported procedure when its attached attribute list contains `[[export("abi")]]` as parsed by §23.4.2.

#### 23.3.3 AST Representation / Form

Raw exported procedures are represented by ordinary `ProcedureDecl(...)` items with `ExportAttr(proc)` defined.

This section introduces no dedicated raw-export AST node beyond `ProcedureDecl` plus the attached `export` attribute.

#### 23.3.4 Static Semantics

**Raw Exported Procedure.** A Ultraviolet procedure made callable from foreign code via `[[export]]`.

**Error Indicator Value.**

ZeroBits(T) = [0x00, …, 0x00] where |ZeroBits(T)| = sizeof(T)

```text
ZeroValue(T) = v ⇔ ValueBits(T, v) = ZeroBits(T) ∧ ∀ v'. (ValueBits(T, v') = ZeroBits(T) ⇒ v' = v)
ZeroableType(T) ⇔ ∃ v. ZeroValue(T) = v
```

ExportSigJudg = {ExportSigOk}

```text
ExportParamTypes(params) = [T_i | ⟨_, _, T_i⟩ ∈ params]
```

**(ExportSig-Ok)**

```text
proc = ProcedureDecl(_, vis, _, _, _, params, ret_opt, _, _, _, _)    vis = `public`    ExportAttr(proc) = ⟨abi, _⟩    abi ∈ ExternAbiSet    AbiProfileOk(abi, SelectedTargetProfile)    R = ProcReturn(ret_opt)    (R = TypePrim("()") ∨ Γ ⊢ FfiSafeType(R) ⇓ ok)    (∀ T ∈ ExportParamTypes(params). Γ ⊢ FfiSafeType(T) ⇓ ok)    (∀ T ∈ ExportParamTypes(params). FfiByValueOk(T))    FfiByValueOk(R)    (UnwindMode(proc) ≠ `catch` ∨ ZeroableType(R))
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ExportSigOk(proc) ⇓ ok
```

#### 23.3.5 Dynamic Semantics

Execution of the body follows ordinary procedure semantics. Boundary panic handling is defined by §23.7. When `UnwindMode(proc) = "catch"`, the boundary MUST return `ZeroValue(R)` for the raw exported procedure's return type `R`.

```text
For a raw exported procedure `proc` owned by a project `P` satisfying `RawExportLibrary(P)`, a boundary call occurs only through one live loaded library image `i` owned by `P`. Before the first raw export call through a newly loaded image, the implementation MUST establish that image by `LibraryImageInitSigma(P, i, σ)` as defined in §24.4.4. Later raw export calls through the same live image MUST reuse the same image-owned static state, poison flags, and boundary panic record until unload. On unload of that live image, the implementation MUST execute `LibraryImageDestroySigma(P, i, σ)` exactly once. User-procedure execution within that live image is governed by `RawLibraryCallSigma(P, i, proc, vs, σ)` in §24.4.4.
```

```text
For any shared library project `P`, an ordinary Ultraviolet call that crosses a shared-library link boundary into one externally linked procedure owned by `P` likewise occurs only through one live loaded library image `i` owned by `P`. Before the first such linked call through a newly loaded image, the implementation MUST establish that image by `LibraryImageInitSigma(P, i, σ)` as defined in §24.4.4. Later linked calls through the same live image MUST reuse the same image-owned static state, poison flags, and boundary panic record until unload. On unload of that live image, the implementation MUST execute `LibraryImageDestroySigma(P, i, σ)` exactly once. User-procedure execution for that linked call continues to follow ordinary `ApplyProcSigma` under the image-state interpretation defined by §24.4.4.
```

#### 23.3.6 Lowering

Export-side unwind frames are defined in §23.7. This section introduces no additional lowering rules beyond export ABI selection and external linkage.

#### 23.3.7 Diagnostics

| Code         | Severity | Detection    | Condition                                        |
| ------------ | -------- | ------------ | ------------------------------------------------ |
| `E-SYS-3353` | Error    | Compile-time | `[[export]]` requires `public` visibility        |
| `E-TYP-2631` | Error    | Compile-time | `[[export]]` catch requires zeroable return type |

Unsupported export-ABI-string rejection is owned by §23.2.7. Type-admissibility failures in `FfiSafeType` and by-value FFI use are owned by §23.1.7.

#### 23.3.8 Hosted Exports

A procedure becomes a hosted export when it carries `[[host_export("abi")]]`. A hosted export is not a raw FFI signature: the foreign-visible signature is derived from the source procedure plus an opaque hosted-library session handle.

#### 23.3.9 Parsing

Hosted exports are parsed by the ordinary procedure-declaration parser from §15.1.2.

An ordinary `ProcedureDecl` is classified as a hosted export when its attached attribute list contains `[[host_export("abi")]]` as parsed by §23.4.2.

#### 23.3.10 AST Representation / Form

Hosted exports are represented by ordinary `ProcedureDecl(...)` items with `HostExportAttr(proc)` defined.

```text
HostExported(proc) ⇔ proc = ProcedureDecl(_, _, _, _, _, _, _, _, _, _, _) ∧ HostExportAttr(proc) defined
HostContextParam(proc) = ⟨mode, name, T_ctx⟩ ⇔ proc = ProcedureDecl(_, _, _, _, _, [⟨mode, name, T_ctx⟩] ++ _, _, _, _, _, _)
HostVisibleParams(proc) = params_vis ⇔ proc = ProcedureDecl(_, _, _, _, _, [ctx_param] ++ params_vis, _, _, _, _, _)
HostVisibleParamTypes(proc) = [T_i | ⟨_, _, T_i⟩ ∈ params_vis] ⇔ HostVisibleParams(proc) = params_vis
HostExports(P) = [d | m ∈ P.modules, d ∈ ASTModule(P, m).items, HostExported(d)]
RawExports(P) = [d | m ∈ P.modules, d ∈ ASTModule(P, m).items, d = ProcedureDecl(_, _, _, _, _, _, _, _, _, _, _) ∧ ExportAttr(d) defined]
HostedLibrary(P) ⇔ Library(P) ∧ HostExports(P) ≠ []
MixedForeignExportModes(P) ⇔ HostedLibrary(P) ∧ RawExports(P) ≠ []
HostedRootCaps(P) = ⋃{CapInType(StripPerm(T_ctx)) | d ∈ HostExports(P) ∧ HostContextParam(d) = ⟨_, _, T_ctx⟩}
HostedContextBundleType(T) ⇔ ContextBundleType(T) ∧ AliasNorm(T) ≠ TypePath(["Context"])
```

HostAbiVersion = 1

```text
HostSessionAbiParam = ⟨`move`, `__ultraviolet_session`, TypePrim("usize")⟩
HostThunkParams(proc) = [HostSessionAbiParam] ++ params_vis ⇔ HostVisibleParams(proc) = params_vis
HostThunkForeignParamTypes(proc) = [TypePrim("usize")] ++ [T_i | ⟨_, _, T_i⟩ ∈ params_vis] ⇔ HostVisibleParams(proc) = params_vis
HostThunkSig(proc) = ⟨HostThunkParams(proc), ProcReturn(ret_opt)⟩ ⇔ proc = ProcedureDecl(_, _, _, _, _, _, ret_opt, _, _, _, _)
```

`HostedRootCaps(P)` is the maximal capability set that may become visible to Ultraviolet user code through hosted exports of `P`.

#### 23.3.11 Static Semantics

**Hosted Export.** A Ultraviolet procedure made callable from foreign code through a hosted-library session.

**Foreign-visible signature.** For a hosted export `proc`, the foreign-visible signature consists of one leading `usize` session-handle parameter followed by the source parameters after the first source parameter. The first source parameter itself is not part of the foreign-visible ABI.

```text
For each visible source parameter `⟨mode_i, _, T_i⟩`, the foreign-visible pass kind MUST be derived by `ForeignABIParam(T_i)` (§24.2.5), independent of source parameter mode.
```

HostExportSigJudg = {HostExportSigOk}

**(HostExportSig-Ok)**

```text
Project(Γ) = P    proc = ProcedureDecl(_, vis, _, gen_params_opt, _, params, ret_opt, _, _, _, _)    vis = `public`    HostExportAttr(proc) = ⟨abi, _⟩    TypeParamsOpt(gen_params_opt) = []    ¬ MixedForeignExportModes(P)    Library(P)    params = [⟨⊥, _, T_ctx⟩] ++ params_vis    HostedContextBundleType(StripPerm(T_ctx))    abi ∈ ExternAbiSet    AbiProfileOk(abi, SelectedTargetProfile)    R = ProcReturn(ret_opt)    (R = TypePrim("()") ∨ Γ ⊢ FfiSafeType(R) ⇓ ok)    (∀ T ∈ HostVisibleParamTypes(proc). Γ ⊢ FfiSafeType(T) ⇓ ok)    (∀ T ∈ HostVisibleParamTypes(proc). CapInType(T) = ∅)    CapInType(R) = ∅    (∀ T ∈ HostVisibleParamTypes(proc). FfiByValueOk(T))    FfiByValueOk(R)    (UnwindMode(proc) ≠ `catch` ∨ ZeroableType(R))
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ HostExportSigOk(proc) ⇓ ok
```

**(HostExport-Library-Err)**

```text
Project(Γ) = P    HostExported(proc)    ¬ Library(P)    c = Code(HostExport-Library-Err)
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ HostExportSigOk(proc) ⇑ c
```

**(HostExport-MixedMode-Err)**

```text
Project(Γ) = P    HostExported(proc)    MixedForeignExportModes(P)    c = Code(HostExport-MixedMode-Err)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ HostExportSigOk(proc) ⇑ c
```

**(HostExport-Generic-Err)**

```text
proc = ProcedureDecl(_, _, _, gen_params_opt, _, _, _, _, _, _, _)    HostExportAttr(proc) = ⟨_, _⟩    TypeParamsOpt(gen_params_opt) ≠ []    c = Code(HostExport-Generic-Err)
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ HostExportSigOk(proc) ⇑ c
```

**(HostExport-Context-Err)**

```text
proc = ProcedureDecl(_, _, _, _, _, params, _, _, _, _, _)    HostExportAttr(proc) = ⟨_, _⟩    (params = [] ∨ (params = [⟨mode, _, T_ctx⟩] ++ _ ∧ ¬ ContextBundleType(StripPerm(T_ctx))))    c = Code(HostExport-Context-Err)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ HostExportSigOk(proc) ⇑ c
```

**(HostExport-Context-Raw-Err)**

```text
proc = ProcedureDecl(_, _, _, _, _, [⟨mode, _, T_ctx⟩] ++ _, _, _, _, _, _)    HostExportAttr(proc) = ⟨_, _⟩    AliasNorm(StripPerm(T_ctx)) = TypePath(["Context"])    c = Code(HostExport-Context-Raw-Err)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ HostExportSigOk(proc) ⇑ c
```

**(HostExport-Context-Move-Err)**

```text
proc = ProcedureDecl(_, _, _, _, _, [⟨`move`, _, T_ctx⟩] ++ _, _, _, _, _, _)    HostExportAttr(proc) = ⟨_, _⟩    ContextBundleType(StripPerm(T_ctx))    c = Code(HostExport-Context-Move-Err)
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ HostExportSigOk(proc) ⇑ c
```

#### 23.3.12 Dynamic Semantics

A hosted export call occurs only with a live, idle hosted-library session `h` owned by the library project `P`. Hosted-export foreign-visible session handles use ABI type `usize`; the value `0` MUST be rejected as invalid.

A conforming implementation MUST ensure that the only capability-bearing value introduced to Ultraviolet user code by the hosted-export boundary is the reconstructed first source argument. Raw `Context` values MUST NOT be exposed directly to hosted-export user code, and the capability roots that become visible across all hosted exports of `P` MUST be a subset of `HostedRootCaps(P)`.

This specification revision defines no foreign-supplied capability adapters or session options. A successful hosted session MUST grant exactly `HostedRootCaps(P)` through runtime-owned standard providers; foreign code does not pass capability values across the hosted-session ABI.

The boundary MUST:

1. validate the foreign-visible session handle;
2. reject any handle that is invalid, not live, or currently busy before any user code executes;
3. recover the session-owned root context carrier for `h`;
4. construct the first source argument `v_ctx` by `ContextBundleBuild(StripPerm(T_ctx), SessionContext(h))`;
5. pass `v_ctx` plus the foreign-visible arguments to the source procedure under ordinary Ultraviolet semantics.

If the supplied handle is invalid, not live, or busy, then the hosted-export boundary MUST:

1. return `ZeroValue(R)` when `UnwindMode(proc) = "catch"`;
2. otherwise terminate the boundary call as `Abort`.

When `UnwindMode(proc) = "catch"`, any boundary failure that occurs before or during hosted-export invocation MUST return `ZeroValue(R)` for the hosted export's return type `R`.

#### 23.3.13 Lowering

Hosted-export lowering MUST preserve the raw-FFI rules of §§23.1–23.5 for the foreign-visible signature while reconstructing the first source parameter internally.

```text
For a hosted export `proc` with `HostExportAttr(proc) = ⟨abi, _⟩` and `HostThunkSig(proc) = ⟨params_thunk, R⟩`, the foreign-visible thunk ABI is determined exactly as follows:
```

1. `Γ ⊢ ForeignABICall(HostThunkForeignParamTypes(proc), R) ⇓ ⟨[k_1, …, k_n], k_r, sretSigma⟩` determines the complete foreign by-value/by-reference parameter classification and indirect-return decision.
2. `ConventionLayout(SelectedTargetProfile, AbiToConvention(abi))` determines the calling-convention layout used by the thunk.
3. `AssignParamRegs(HostThunkForeignParamTypes(proc), AbiToConvention(abi))` determines the thunk's parameter register assignment and stack-slot assignment.
4. The thunk's return-register assignment, indirect-return slot placement, and stack layout MUST be exactly those implied by the same `ForeignABICall`, `ConventionLayout`, and `AssignParamRegs` results for a raw exported procedure whose source signature is `params_thunk -> R`.

HostThunkParamCarrierJudg = {HostThunkParamCarrier}
HostThunkRetCarrierJudg = {HostThunkRetCarrier}

```text
HostThunkParamShape(proc) = [⟨k_i, c_i, τ_i⟩] ⇔
  HostThunkForeignParamTypes(proc) = [T_i] ∧
  HostThunkSig(proc) = ⟨_, R⟩ ∧
  Γ ⊢ ForeignABICall([T_i], R) ⇓ ⟨[k_i], k_r, sretSigma_base⟩ ∧
  ∀ i. Γ ⊢ HostThunkParamCarrier(SelectedTargetProfile, k_i, T_i) ⇓ ⟨c_i, τ_i⟩
HostThunkRetShape(proc) = ⟨k_r, c_r, τ_r, sretSigma⟩ ⇔
  HostThunkSig(proc) = ⟨_, R⟩ ∧
  Γ ⊢ ForeignABICall(HostThunkForeignParamTypes(proc), R) ⇓ ⟨[k_i], k_r, sretSigma_base⟩ ∧
  Γ ⊢ HostThunkRetCarrier(SelectedTargetProfile, k_r, R, sretSigma_base) ⇓ ⟨c_r, τ_r, sretSigma⟩
```

IntLane(1) = `i8`
IntLane(2) = `i16`
IntLane(4) = `i32`
IntLane(8) = `i64`

```text
AggLLVM(T) ⇔ ∃ τ. Γ ⊢ LLVMTy(T) ⇓ τ ∧ (τ is `struct` ∨ τ is `array`)
```

**(HostThunkParamCarrier-ByRef)**
k = `ByRef`
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ HostThunkParamCarrier(profile, k, T) ⇓ ⟨`Direct`, LLVMPtrTy(TypePtr(TypePerm(`const`, T), `Valid`))⟩
```

**(HostThunkParamCarrier-ByValue-Default)**

```text
k = `ByValue`    ¬(profile = `x86_64-win64` ∧ AggLLVM(T))    Γ ⊢ LLVMTy(T) ⇓ τ
```

────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ HostThunkParamCarrier(profile, k, T) ⇓ ⟨`Direct`, τ⟩
```

**(HostThunkParamCarrier-Win64-DirectAgg)**

```text
profile = `x86_64-win64`    k = `ByValue`    AggLLVM(T)    Γ ⊢ sizeof(T) = n    n ∈ {1, 2, 4, 8}
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ HostThunkParamCarrier(profile, k, T) ⇓ ⟨`Direct`, IntLane(n)⟩
```

**(HostThunkParamCarrier-Win64-IndirectAgg)**

```text
profile = `x86_64-win64`    k = `ByValue`    AggLLVM(T)    Γ ⊢ sizeof(T) = n    n > 0    n ∉ {1, 2, 4, 8}
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ HostThunkParamCarrier(profile, k, T) ⇓ ⟨`Indirect`, LLVMPtrTy(TypePtr(TypePerm(`const`, T), `Valid`))⟩
```

**(HostThunkRetCarrier-Default)**

```text
profile ≠ `x86_64-win64` ∨ ¬(k_r = `ByValue` ∧ AggLLVM(R))    Γ ⊢ LLVMRetLower(R, k_r) ⇓ τ_r
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ HostThunkRetCarrier(profile, k_r, R, sretSigma_base) ⇓ ⟨`Direct`, τ_r, sretSigma_base⟩
```

**(HostThunkRetCarrier-Win64-DirectAgg)**

```text
profile = `x86_64-win64`    k_r = `ByValue`    AggLLVM(R)    Γ ⊢ sizeof(R) = n    n ∈ {1, 2, 4, 8}
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ HostThunkRetCarrier(profile, k_r, R, sretSigma_base) ⇓ ⟨`Direct`, IntLane(n), false⟩
```

**(HostThunkRetCarrier-Win64-SRetAgg)**

```text
profile = `x86_64-win64`    k_r = `ByValue`    AggLLVM(R)    Γ ⊢ sizeof(R) = n    n > 0    n ∉ {1, 2, 4, 8}
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ HostThunkRetCarrier(profile, k_r, R, sretSigma_base) ⇓ ⟨`Indirect`, `void`, true⟩
```

For hosted-export thunk lowering, a conforming implementation MUST use `HostThunkParamShape(proc)` and `HostThunkRetShape(proc)` as the foreign ABI shape.

For `SelectedTargetProfile = x86_64-win64`, a conforming implementation MUST NOT split one by-value aggregate source parameter of a hosted export into multiple scalar ABI parameters at the foreign-visible thunk boundary.

No hosted-export-specific ABI rewriting beyond prepending `HostSessionAbiParam` and omitting the first source parameter is permitted.

Hosted thunk foreign parameter classification MUST be mode-independent. Pointer-typed visible parameters therefore use canonical C-style pointer carriers at the foreign boundary.

```text
When `ForeignABIParam(T_i) ≠ ABIParam(mode_i, T_i)`, thunk-to-source call reconstruction MUST preserve source semantics by materializing one temporary storage cell of type `T_i`, storing the incoming foreign value into that cell, and passing that temporary according to `ABIParam(mode_i, T_i)` to the source procedure body.
```

```text
For hosted-library thunk and body emission, loads and stores of `HostedStateSym(Project(Γ), sym)` MUST resolve by full symbol identity `sym` (including cross-module references) and session context, not by module-local global-declaration presence. When `HostedStateSym(Project(Γ), sym)` holds, a conforming implementation MUST NOT substitute `ZeroValue` or any other default value in place of a failed symbol materialization.
```

For every hosted library, a conforming implementation MUST emit foreign-callable lifecycle exports with the following names and ABIs:

1. `__ultraviolet_host_abi_version : () -> u32`, which MUST return `HostAbiVersion`.
2. `__ultraviolet_host_session_create : () -> usize`, which MUST return `0` iff it cannot establish a live hosted session by `HostSessionInitSigma`, MUST leave no live hosted session reachable from foreign code on that failure path, MUST reclaim any partially initialized session state for that failed attempt, and MUST otherwise return one nonzero hosted-session handle token.
3. `__ultraviolet_host_session_destroy : (usize) -> u32`, which MUST return `1` iff it destroys one live idle hosted session by `HostSessionDestroySigma`, MUST return `0` for invalid, non-live, or busy handles, and MUST NOT return any value other than `0` or `1`.

These lifecycle exports are backend-generated boundary declarations. They are not user-declared `ProcedureDecl` items. A conforming backend MUST emit them exactly once in the linked image of each hosted library.

These lifecycle exports MUST NOT propagate `Panic` across the foreign boundary. If hosted-session destruction accepts a live idle handle but user deinitialization panics or session teardown otherwise cannot complete `HostSessionDestroySigma`, `__ultraviolet_host_session_destroy` MUST return `0`, MUST retire the handle so it is no longer live and cannot be reused, and MUST reclaim any remaining session-private runtime state that is not already consumed by the deinitialization steps that completed before the failure.
A hosted-session handle token that has been returned nonzero by `__ultraviolet_host_session_create` MUST NOT be reissued again later in the same process lifetime.

For every hosted export `proc`, a conforming implementation MUST emit one foreign-callable thunk whose link name is selected by `LinkName` and whose foreign-visible ABI:

1. prepends one `usize` session-handle parameter;
2. omits the first source parameter from the foreign-visible ABI;
3. reconstructs the first source parameter from the session-owned `Context` value before entering the user procedure;
4. rejects invalid, non-live, and busy handles according to §23.3.12 before any user code executes;
5. applies the same `[[unwind]]` boundary rules as a raw exported procedure with the derived foreign-visible signature.

```text
These hosted-export thunks are backend-generated boundary declarations. They are not the same declarations as the user-authored source procedures. A conforming backend MUST emit exactly one hosted-export thunk per `proc ∈ HostExports(P)` in the linked image of `P`, and that thunk MUST use `HostThunkLinkName(proc)` as its foreign symbol while calls from Ultraviolet code continue to target the source procedure body symbol `Mangle(proc)`. A conforming implementation MUST NOT expose `Mangle(proc)` itself as the hosted foreign entrypoint for `proc`; foreign code enters only through the generated thunk.
```

#### 23.3.14 Diagnostics

| Code         | Severity | Detection    | Condition                                                                            |
| ------------ | -------- | ------------ | ------------------------------------------------------------------------------------ |
| `E-TYP-2632` | Error    | Compile-time | `[[host_export]]` requires a leading `Context` bundle parameter                      |
| `E-TYP-2633` | Error    | Compile-time | `[[host_export]]` leading `Context` bundle parameter MUST NOT use `move`             |
| `E-TYP-2634` | Error    | Compile-time | Generic `[[host_export]]` procedure                                                  |
| `E-TYP-2635` | Error    | Compile-time | `[[host_export]]` catch requires zeroable return type                                |
| `E-TYP-2636` | Error    | Compile-time | `[[host_export]]` MUST use an explicit projected `Context` bundle, not raw `Context` |

Type-admissibility failures in `FfiSafeType` and by-value FFI use for hosted-export visible parameters and returns are owned by §23.1.7.

### 23.4 FFI Attributes

#### 23.4.1 Syntax

```text
mangle_attribute            ::= "[[" "mangle" "(" mangle_mode ")" "]]"
mangle_mode                 ::= "none" | string_literal

library_attribute           ::= "[[" "library" "(" library_args ")" "]]"
library_args                ::= "name" ":" string_literal ("," "kind" ":" string_literal)?

unwind_attribute            ::= "[[" "unwind" "(" unwind_mode ")" "]]"
unwind_mode                 ::= string_literal

export_attribute            ::= "[[" "export" "(" string_literal ")" "]]"
host_export_attribute       ::= "[[" "host_export" "(" string_literal ")" "]]"

ffi_pass_by_value_attribute ::= "[[" "ffi_pass_by_value" "]]"
```

#### 23.4.2 Parsing

FFI attributes are parsed by the general attribute parser in Chapter 5. Argument classification and target checking are defined by Chapter 9 and the attribute-specific constraints below.

#### 23.4.3 AST Representation / Form

FFI attributes are ordinary attribute-list entries attached to their owning declarations.

| Attribute           | Target Kinds     |
| :------------------ | :--------------- |
| `mangle`            | `Procedure`      |
| `library`           | `ExternBlock`    |
| `unwind`            | `Procedure`      |
| `export`            | `Procedure`      |
| `host_export`       | `Procedure`      |
| `ffi_pass_by_value` | `Record`, `Enum` |

#### 23.4.4 Static Semantics

##### 23.4.4.1 `[[mangle]]`

1. Valid only on extern procedure declarations, raw exported procedures, and hosted exports.
2. `[[mangle(none)]]` sets link name to the declaration identifier (unmangled).
3. `[[mangle("name")]]` sets link name to the exact string.
4. String mode MUST be non-empty and valid for the target linker.
5. On non-FFI procedures, `[[mangle(...)]]` is ill-formed.

##### 23.4.4.2 `[[library]]`

**Link Kinds**

| Kind          | Meaning                   |
| :------------ | :------------------------ |
| `"dylib"`     | Dynamic library (default) |
| `"static"`    | Static library            |
| `"framework"` | macOS framework           |
| `"raw-dylib"` | Windows named DLL import  |

1. Valid only on `extern` blocks.
2. The `name` argument specifies the library name without platform prefix or suffix.
3. If `kind` is omitted, `"dylib"` is assumed.
4. This attribute governs foreign-library resolution only. It is independent of the manifest key `assembly.link_kind` defined in §3.2.
5. Library resolution is:

```text
ResolveLibraryName(`dylib`, name, `x86_64-sysv`) = "lib" ++ name ++ ".so"
ResolveLibraryName(`dylib`, name, `aarch64-aapcs64`) = "lib" ++ name ++ ".so"
ResolveLibraryName(`dylib`, name, `x86_64-win64`) = name ++ ".dll"

ResolveLibraryName(`static`, name, `x86_64-sysv`) = "lib" ++ name ++ ".a"
ResolveLibraryName(`static`, name, `aarch64-aapcs64`) = "lib" ++ name ++ ".a"
ResolveLibraryName(`static`, name, `x86_64-win64`) = name ++ ".lib"

ResolveLibraryName(`raw-dylib`, name, `x86_64-win64`) = name ++ ".dll"

LibraryKindSupported(`framework`, profile) ⇔ false
LibraryKindSupported(`raw-dylib`, profile) ⇔ profile = `x86_64-win64`
LibraryKindSupported(kind, profile) ⇔ kind ∈ {`dylib`, `static`}
```

If `LibraryKindSupported(kind, SelectedTargetProfile)` does not hold, the declaration is ill-formed.

For `raw-dylib` imports, the implementation MUST resolve the named Windows DLL
and foreign symbol using the resolved DLL name and declared foreign symbol
name. Resolution strategy is implementation-defined and MAY be lazy; an
implementation is not required to use PE `/DELAYLOAD`.

##### 23.4.4.3 `[[unwind]]`

**Modes**

| Mode      | Behavior                                                                                                |
| :-------- | :------------------------------------------------------------------------------------------------------ |
| `"abort"` | Any panic or foreign unwind that would cross the boundary aborts.                                       |
| `"catch"` | Unwinding is caught at the boundary. Imported procedures convert foreign unwinds to Ultraviolet panics. |

If `[[unwind]]` is not specified, `"abort"` is assumed.

`[[unwind]]` is valid only on extern procedure declarations, raw exported procedures, and hosted exports.

**Catch ABI Requirement.**

If `UnwindMode(proc) = "catch"`, the ABI at the boundary MUST be `"C-unwind"`:
1. For extern procedures: `ExternAbiName(ExternAbiOf(proc)) = "C-unwind"`.
2. For raw exported procedures: `ExportAttr(proc) = ⟨"C-unwind", _⟩`.
3. For hosted exports: `HostExportAttr(proc) = ⟨"C-unwind", _⟩`.

##### 23.4.4.4 `[[export]]`

1. Valid only on procedure declarations.
2. The procedure MUST be `public`.
3. The ABI string selects the foreign calling convention (see §23.2.4).
4. `[[export]]` implies external linkage.
5. Link name selection is defined by `LinkName` (§24.3) and `[[mangle(...)]]`.
6. Raw export signatures MUST satisfy the FFI safety requirements in §§23.3 and 23.5.

##### 23.4.4.5 `[[host_export]]`

1. Valid only on procedure declarations.
2. The procedure MUST be `public`.
3. The owning assembly MUST be a library assembly.
4. `[[host_export]]` implies external linkage through the hosted-export thunk defined in §23.3.13. The source procedure body continues to use ordinary visibility-based linkage for Ultraviolet calls; `[[host_export]]` alone does not make the source procedure body symbol the foreign entrypoint.
5. The ABI string selects the foreign calling convention (see §23.2.4).
6. Link name selection is defined by `LinkName` (§24.3) and `[[mangle(...)]]`.
7. Hosted-export signatures MUST satisfy the hosted-export rules of §§23.3 and 23.5.
8. `[[host_export]]` and `[[export]]` MUST NOT appear in the same assembly.

##### 23.4.4.6 `[[ffi_pass_by_value]]`

This attribute marks a `record` or `enum` that satisfies both `DropType` and `FfiSafeType` as eligible for by-value passing across the FFI boundary. If a `DropType` + `FfiSafeType` type is passed by value in any FFI signature without this attribute, the program is ill-formed (§23.1.4).

**FFI Attribute Constraints**

1. `[[mangle]]` is valid only on extern procedure declarations, raw exported procedures, or hosted exports.
2. Duplicate symbol names within a compilation unit are ill-formed and MUST be diagnosed at compile-time or link-time.
3. `[[library]]` is valid only on `extern` blocks.
4. Unknown library kinds are ill-formed.
5. `[[mangle(none)]]` on a non-FFI procedure is ill-formed.
6. `[[mangle(none)]]` with `[[export("C")]]` is redundant and SHOULD emit a warning.
7. `[[unwind]]` on a non-FFI procedure is ill-formed.
8. `[[unwind("abort")]]` is redundant and SHOULD emit a warning.
9. `[[host_export]]` requires `assembly.kind = "library"`.
10. `[[host_export]]` and `[[export]]` MUST NOT be mixed in the same assembly.

#### 23.4.5 Dynamic Semantics

FFI attributes do not directly evaluate to runtime values. `[[unwind]]` selects the boundary behavior defined by §23.7. `[[mangle]]`, `[[library]]`, `[[export]]`, `[[host_export]]`, and `[[ffi_pass_by_value]]` have no direct runtime semantics apart from their effects on linkage, signature admissibility, hosted-session lowering, and boundary behavior.

#### 23.4.6 Lowering

`[[mangle]]` selects link names. `[[library]]` contributes library-resolution metadata for extern blocks. `[[export]]` implies external linkage at the raw FFI boundary. `[[host_export]]` selects hosted-library thunk emission and the hosted-session lifecycle exports required by §23.3.13. `[[unwind]]` selects the boundary frame strategy in §23.7. `[[ffi_pass_by_value]]` authorizes by-value ABI lowering for eligible `DropType` + `FfiSafeType` records and enums.

#### 23.4.7 Diagnostics

| Code         | Severity | Detection                 | Condition                                                |
| ------------ | -------- | ------------------------- | -------------------------------------------------------- |
| `E-SYS-3340` | Error    | Compile-time              | `[[mangle(...)]]` on non-FFI procedure                   |
| `E-SYS-3341` | Error    | Compile-time              | Invalid `[[mangle(mode)]]` argument                      |
| `E-SYS-3342` | Error    | Compile-time or Link-time | Duplicate symbol name in compilation unit                |
| `E-SYS-3345` | Error    | Compile-time              | `[[library]]` outside `extern` block                     |
| `E-SYS-3346` | Error    | Compile-time              | Unknown or unsupported library kind                      |
| `E-SYS-3347` | Error    | Link-time                 | Library not found                                        |
| `E-SYS-3350` | Error    | Compile-time              | `[[mangle(none)]]` on non-exportable procedure           |
| `E-SYS-3351` | Error    | Compile-time              | Conflicting explicit mangling directives                 |
| `E-SYS-3355` | Error    | Compile-time              | Unknown unwind mode                                      |
| `E-SYS-3356` | Error    | Compile-time              | `[[unwind]]` on non-FFI procedure                        |
| `E-SYS-3357` | Error    | Compile-time              | `[[host_export]]` requires `assembly.kind = "library"`   |
| `E-SYS-3358` | Error    | Compile-time              | `[[host_export]]` and `[[export]]` mixed in one assembly |
| `E-FFI-0350` | Error    | Compile-time              | Multiple `[[unwind]]` attributes                         |
| `W-SYS-3350` | Warning  | Compile-time              | `[[mangle(none)]]` with `[[export("C")]]` (redundant)    |
| `W-SYS-3355` | Warning  | Compile-time              | `[[unwind("abort")]]` (redundant)                        |

### 23.5 Capability Isolation

#### 23.5.1 Syntax

This section introduces no additional concrete syntax.

#### 23.5.2 Parsing

This section introduces no additional parsing rules.

#### 23.5.3 AST Representation / Form

Capability-isolation checks range over existing FFI signature types and declaration forms; this section introduces no dedicated AST node.

#### 23.5.4 Static Semantics

**Capability Isolation.** Foreign code MUST NOT receive or return capability-bearing values.

1. Any raw FFI signature or hosted-export visible signature containing `Context`, a capability class, or a dynamic class object is ill-formed.
2. A raw pointer derived from region-local storage MUST NOT cross an FFI boundary.

```text
RegionLocalProv(π) ⇔ ∃ tag. π = π_Region(tag)
RawPtrType(T) ⇔ T = TypeRawPtr(_, _)
FFICall(Call(callee, args)) ⇔ CalleeProc(callee) = proc ∧ FFIBoundary(proc)
```

**(FFI-Arg-RegionLocalRawPtr-Err)**
```text
FFICall(Call(callee, args))    ∃ ⟨_, arg, _⟩ ∈ args. Γ; Ω ⊢ arg ⇓ π ∧ RegionLocalProv(π) ∧ RawPtrType(ExprType(arg))
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ; Ω ⊢ Call(callee, args) ⇑
```

**(FFI-Return-RegionLocalRawPtr-Err)**
```text
CurrentProcedure(Γ) = proc    (ExportAttr(proc) defined ∨ HostExportAttr(proc) defined)    Γ; Ω ⊢ e ⇓ π    RegionLocalProv(π)    RawPtrType(ExprType(e))
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ; Ω ⊢ ReturnStmt(e) ⇑
```

#### 23.5.5 Dynamic Semantics

This section introduces no additional runtime mechanism. Ill-formed raw FFI signatures and ill-formed hosted-export visible signatures that would transport capability-bearing values are rejected statically.

#### 23.5.6 Lowering

This section introduces no additional lowering rules beyond the signature-admissibility checks defined by §§23.1–23.4.

#### 23.5.7 Diagnostics

| Code         | Severity | Detection    | Condition                                        |
| ------------ | -------- | ------------ | ------------------------------------------------ |
| `E-SYS-3360` | Error    | Compile-time | Region-local raw pointer crosses an FFI boundary |

Capability-bearing-type violations other than region-local raw-pointer escape are diagnosed by the signature and type-admissibility checks owned by §23.1.7.

### 23.6 Foreign Contracts

#### 23.6.1 Syntax

```text
ffi_verification_attr    ::= "[[" ffi_verification_mode "]]"
ffi_verification_mode    ::= "static" | "dynamic"

foreign_contract         ::= "|:" "@foreign_assumes" "(" predicate_expr ")"
                           | "|:" "@foreign_ensures" "(" ensures_predicate ")"
foreign_contract_clause_list ::= foreign_contract+
ensures_predicate        ::= predicate_expr
                           | "@error" ":" predicate_expr
                           | "@null_result" ":" predicate_expr
```

#### 23.6.2 Parsing

```text
ForeignContractStart(P) ⇔ IsOp(Tok(P), "|:") ∧ IsOp(Tok(Advance(P)), "@") ∧ IsIdent(Tok(Advance(Advance(P)))) ∧ Lexeme(Tok(Advance(Advance(P)))) ∈ {`foreign_assumes`, `foreign_ensures`}
```

**(Parse-ForeignContractClauseListOpt-None)**

```text
¬ ForeignContractStart(P)
```

──────────────────────────────────────────────

```text
Γ ⊢ ParseForeignContractClauseListOpt(P) ⇓ (P, ⊥)
```

**(Parse-ForeignContractClauseListOpt-Yes)**

```text
ForeignContractStart(P)    Γ ⊢ ParseForeignContractClauseList(P) ⇓ (P_1, clauses)
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseForeignContractClauseListOpt(P) ⇓ (P_1, clauses)
```

**(Parse-ForeignContractClauseList-Cons)**

```text
Γ ⊢ ParseForeignContractClause(P) ⇓ (P_1, clause)    Γ ⊢ ParseForeignContractClauseListTail(P_1, [clause]) ⇓ (P_2, clauses)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseForeignContractClauseList(P) ⇓ (P_2, clauses)
```

**(Parse-ForeignContractClauseListTail-End)**

```text
¬ ForeignContractStart(P)
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseForeignContractClauseListTail(P, xs) ⇓ (P, xs)
```

**(Parse-ForeignContractClauseListTail-Cons)**

```text
ForeignContractStart(P)    Γ ⊢ ParseForeignContractClause(P) ⇓ (P_1, clause)    Γ ⊢ ParseForeignContractClauseListTail(P_1, xs ++ [clause]) ⇓ (P_2, ys)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseForeignContractClauseListTail(P, xs) ⇓ (P_2, ys)
```

**(Parse-ForeignContractClause-Assumes)**

```text
IsOp(Tok(P), "|:")    IsOp(Tok(Advance(P)), "@")    IsIdent(Tok(Advance(Advance(P))))    Lexeme(Tok(Advance(Advance(P)))) = `foreign_assumes`    IsPunc(Tok(Advance(Advance(Advance(P)))), "(")    Γ ⊢ ParsePredicateExpr(Advance(Advance(Advance(Advance(P))))) ⇓ (P_1, pred)    IsPunc(Tok(P_1), ")")
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseForeignContractClause(P) ⇓ (Advance(P_1), ForeignContractClause(ForeignAssumes, [pred]))
```

**(Parse-ForeignContractClause-Ensures)**

```text
IsOp(Tok(P), "|:")    IsOp(Tok(Advance(P)), "@")    IsIdent(Tok(Advance(Advance(P))))    Lexeme(Tok(Advance(Advance(P)))) = `foreign_ensures`    IsPunc(Tok(Advance(Advance(Advance(P)))), "(")    Γ ⊢ ParseEnsuresPredicate(Advance(Advance(Advance(Advance(P))))) ⇓ (P_1, epred)    IsPunc(Tok(P_1), ")")
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseForeignContractClause(P) ⇓ (Advance(P_1), ForeignContractClause(ForeignEnsuresKind(epred), [ForeignEnsuresExpr(epred)]))
```

ForeignEnsuresKind(Ensures(pred)) = ForeignEnsures
ForeignEnsuresKind(EnsuresError(pred)) = ForeignEnsuresError
ForeignEnsuresKind(EnsuresNullResult(pred)) = ForeignEnsuresNullResult

ForeignEnsuresExpr(Ensures(pred)) = pred
ForeignEnsuresExpr(EnsuresError(pred)) = pred
ForeignEnsuresExpr(EnsuresNullResult(pred)) = pred

**(Parse-EnsuresPredicate-Error)**

```text
IsOp(Tok(P), "@")    IsIdent(Tok(Advance(P)))    Lexeme(Tok(Advance(P))) = `error`    IsPunc(Tok(Advance(Advance(P))), ":")    Γ ⊢ ParsePredicateExpr(Advance(Advance(Advance(P)))) ⇓ (P_1, pred)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseEnsuresPredicate(P) ⇓ (P_1, EnsuresError(pred))
```

**(Parse-EnsuresPredicate-NullResult)**

```text
IsOp(Tok(P), "@")    IsIdent(Tok(Advance(P)))    Lexeme(Tok(Advance(P))) = `null_result`    IsPunc(Tok(Advance(Advance(P))), ":")    Γ ⊢ ParsePredicateExpr(Advance(Advance(Advance(P)))) ⇓ (P_1, pred)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseEnsuresPredicate(P) ⇓ (P_1, EnsuresNullResult(pred))
```

**(Parse-EnsuresPredicate-Plain)**

```text
Γ ⊢ ParsePredicateExpr(P) ⇓ (P_1, pred)
```

──────────────────────────────────────────────

```text
Γ ⊢ ParseEnsuresPredicate(P) ⇓ (P_1, Ensures(pred))
```

#### 23.6.3 AST Representation / Form

Foreign contracts are attached to extern declarations via `foreign_contracts_opt`.

```text
foreign_contracts_opt ∈ {⊥} ∪ [ForeignContractClause]

ForeignContractKind = {ForeignAssumes, ForeignEnsures, ForeignEnsuresError, ForeignEnsuresNullResult}
EnsuresPredicate = {Ensures(pred), EnsuresError(pred), EnsuresNullResult(pred)}    pred ∈ Expr

ForeignContractClause = ForeignContractClause(kind, preds)
kind ∈ ForeignContractKind    preds ∈ [Expr]
```

Ensures-predicate forms are:

```text
Ensures(pred)
EnsuresError(pred)
EnsuresNullResult(pred)
```
#### 23.6.4 Static Semantics

##### 23.6.4.1 Foreign Preconditions

**Foreign Preconditions.** Conditions that callers must satisfy before invoking foreign procedures, specified using the `@foreign_assumes` clause.

**Predicate Context**

Predicates MAY reference:

- Parameter names from the procedure signature
- Literal constants
- Pure functions and operators
- Fields of parameter values (for record types)

Predicates MUST NOT reference:

- Global mutable state
- Values not in scope at the call site
- Effectful operations

**Verification Modes**

| Mode                   | Behavior                                     |
| :--------------------- | :------------------------------------------- |
| `[[static]]` (default) | Caller must prove predicates at compile time |
| `[[dynamic]]`          | Runtime checks inserted before `unsafe` call |

`[[static]]` uses `StaticProof` as defined in §15.8. `[[dynamic]]` inserts `ContractCheck(P, ForeignPre, s, ρ_emptyset)` immediately before the foreign call.

##### 23.6.4.2 Foreign Postconditions

**Foreign Postconditions.** Conditions that foreign code guarantees upon successful return, specified using the `@foreign_ensures` clause.

**Predicate Bindings**

Postcondition predicates MAY reference:

- `@result`: The return value of the foreign procedure
- Parameter names (for checking output parameters)
- `@error`: Predicates that hold when the call fails
- `@null_result`: Predicates that hold when result is null

**Success, Error, and Null Classification**

Let U be the set of unconditional predicates, E the list of `@error` predicates, and N the list of `@null_result` predicates.

Define:

ErrCond =

```text
 ⋀_(P ∈ E) P    if E ≠ ∅
```

 `false`        otherwise

NullCond = (`@result` == `null`)

```text
SuccessCond = ¬ ErrCond
```

The foreign call is classified as an error iff `ErrCond` holds; otherwise it is classified as success.

Then the foreign postcondition obligations are:

1. For each P ∈ U, require SuccessCond ⇒ P
2. For each P ∈ E, require ErrCond ⇒ P
3. For each P ∈ N, require NullCond ⇒ P

`@null_result` predicates are well-formed only when the return type is a nullable pointer type; otherwise they are invalid. A nullable pointer type is one of:
1. `Ptr<T>@Null`
2. `*imm T`
3. `*mut T`

```text
NullableFfiResult(T) ⇔ T = TypePtr(_, `@Null`) ∨ T = TypeRawPtr(`imm`, _) ∨ T = TypeRawPtr(`mut`, _)
NullResultEnsures(proc) = [pred | clause ∈ proc.foreign_contracts_opt ∧ clause.kind = ForeignEnsures ∧ pred ∈ clause.preds ∧ pred = EnsuresNullResult(_)]
```

**(ForeignEnsures-NullResult-Err)**
```text
proc = ExternProcDecl(_, _, _, _, _, _, ret_opt, _, foreign_contracts_opt, _, _)
NullResultEnsures(proc) ≠ []    R = ProcReturn(ret_opt)    ¬ NullableFfiResult(R)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Γ ⊢ proc ⇑
```

`@error` predicates are well-formed only when the return type is not `()`. Using `@error` on a void-returning foreign procedure is ill-formed.

**Verification Modes**

| Mode                   | Behavior                                                      |
| :--------------------- | :------------------------------------------------------------ |
| `[[static]]` (default) | Postconditions available as assumptions for downstream proofs |
| `[[dynamic]]`          | Runtime assertions after foreign call returns                 |

`[[static]]` uses `StaticProof` as defined in §15.8 with `SuccessCond` and `ErrCond` gating the obligations.

##### 23.6.4.3 Verification Summary

**Verification Summary.** Foreign-contract verification uses the following mode table:

| Level         | Precondition Check | Postcondition Check      |
| :------------ | :----------------- | :----------------------- |
| `[[static]]`  | Compile-time proof | Available as assumptions |
| `[[dynamic]]` | Runtime assertion  | Runtime assertion        |

#### 23.6.5 Dynamic Semantics

For foreign preconditions, a failed `ForeignPre` check triggers a panic.

For foreign postconditions, in `[[dynamic]]` mode, the implementation MUST evaluate `ErrCond` and `NullCond` in left-to-right predicate order and insert runtime checks enforcing the implications above immediately after the foreign call returns. Each inserted check is `ContractCheck(P, ForeignPost, s, ρ_foreign_post)`. A failed runtime check triggers a panic with payload `ContractViolation(ForeignPost, P, s)` at the call site.

#### 23.6.6 Lowering

`[[dynamic]]` lowers foreign contracts by inserting `ContractCheck` before the foreign call for `ForeignPre` and after the foreign call for `ForeignPost`. `[[static]]` introduces no runtime checks.

#### 23.6.7 Diagnostics

| Code         | Severity | Detection    | Condition                                            |
| ------------ | -------- | ------------ | ---------------------------------------------------- |
| `E-SEM-2850` | Error    | Compile-time | Cannot prove `@foreign_assumes` predicate            |
| `E-SEM-2851` | Error    | Compile-time | Invalid predicate in foreign contract                |
| `E-SEM-2852` | Error    | Compile-time | Predicate references out-of-scope value              |
| `E-SEM-2853` | Error    | Compile-time | Invalid predicate in `@foreign_ensures`              |
| `E-SEM-2854` | Error    | Compile-time | `@result` used in non-return context                 |
| `E-SEM-2855` | Error    | Compile-time | `@error` predicate on void-returning procedure       |
| `E-SEM-2856` | Error    | Compile-time | `@null_result` predicate on non-nullable return type |
| `P-SEM-2860` | Panic    | Runtime      | Foreign precondition failed at runtime               |
| `P-SEM-2861` | Panic    | Runtime      | Foreign postcondition failed at runtime              |

### 23.7 Boundary Unwinding

#### 23.7.1 Syntax

The only surface syntax owned by this section is `[[unwind(...)]],` defined in §23.4.1. This section introduces no additional concrete syntax.

#### 23.7.2 Parsing

This section introduces no additional parsing rules.

#### 23.7.3 AST Representation / Form

Boundary unwind policy is derived from the `[[unwind]]` attribute attached to a procedure declaration.

UnwindModeValue = { `abort`, `catch` }

```text
UnwindMode : ProcDecl → UnwindModeValue
```

```text
UnwindMode(proc) = m ⇔ UnwindAttr(proc) = m
UnwindMode(proc) = `abort` ⇔ UnwindAttr(proc) undefined
```

```text
UnwindAttr(proc) = m ⇔ ∃ a ∈ AttrByName(proc, "unwind"). a.args = [StringLiteral(m)] ∧ m ∈ UnwindModeValue
```

#### 23.7.4 Static Semantics

**Formal UnwindMode Determination**

```text
DetermineUnwindMode : ProcDecl → UnwindModeValue
```

```text
DetermineUnwindMode(proc) =
  let attrs = AttrByName(proc, "unwind")
  match attrs {
    []        → `abort`
    [a]       → ParseUnwindArg(a)
    _         → Emit(`E-FFI-0350`)
  }
```

```text
ParseUnwindArg : Attr → UnwindModeValue
```

```text
ParseUnwindArg(a) =
  match a.args {
    [StringLiteral("abort")] → `abort`
    [StringLiteral("catch")] → `catch`
    _                        → Emit(`E-SYS-3355`)
  }
```

**(UnwindMode-Valid)**
```text
UnwindAttr(proc) = m    m ∈ { "abort", "catch" }
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
UnwindMode(proc) = m
```

**(UnwindMode-Invalid-Err)**
```text
UnwindAttr(proc) = m    m ∉ { "abort", "catch" }    c = Code(E-SYS-3355)
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
UnwindMode(proc) ⇑ c
```

#### 23.7.5 Dynamic Semantics

**Boundary Effects.**

1. If a Ultraviolet panic or foreign unwind attempts to cross an FFI boundary with `UnwindMode(proc) = abort`, the program MUST abort.
2. If `UnwindMode(proc) = catch`:
   - imported procedures convert foreign unwinds to Ultraviolet panics;
   - raw exported procedures return `ZeroValue(R)` as defined by §23.3.5;
   - hosted exports return `ZeroValue(R)` as defined by §23.3.12.

General destruction and unwind cleanup semantics remain defined by §24.5.

#### 23.7.6 Lowering

**Code Generation Effects**

The `UnwindMode` affects generated code at FFI boundaries:

| Mode    | Import (calling extern)                                | Export / Hosted Export (called from foreign)                    |
| :------ | :----------------------------------------------------- | :-------------------------------------------------------------- |
| `abort` | Install landing pad that aborts on foreign unwind      | Install frame that aborts if Ultraviolet panic escapes          |
| `catch` | Install landing pad that converts to Ultraviolet panic | Install frame that catches unwind and returns the boundary zero |

**(CodeGen-UnwindAbort-Import)**
```text
UnwindMode(extern_proc) = `abort`    CallSite(extern_proc) at location L
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
EmitAbortLandingPad(L)
```

**(CodeGen-UnwindCatch-Import)**
```text
UnwindMode(extern_proc) = `catch`    CallSite(extern_proc) at location L
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
EmitCatchLandingPad(L, ConvertToUltravioletPanic)
```

**(CodeGen-UnwindAbort-Export)**
```text
UnwindMode(exported_proc) = `abort`    EntryPoint(exported_proc) at location L
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
EmitAbortOnPanicFrame(L)
```

**(CodeGen-UnwindCatch-Export)**
```text
UnwindMode(exported_proc) = `catch`    EntryPoint(exported_proc) at location L
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
EmitCatchExportFrame(L, ReturnZeroValue)
```

#### 23.7.7 Diagnostics

No additional named diagnostics are introduced here.

`[[unwind]]` placement and argument-validation diagnostics are owned by §23.4.7.

### 23.8 FFI Diagnostics Supplement

This section owns FFI diagnostics not already attached to the surface-attribute or foreign-contract subsections.

| Code         | Severity | Detection    | Condition                     |
| ------------ | -------- | ------------ | ----------------------------- |
| `E-SYS-3352` | Error    | Compile-time | Unsupported extern ABI string |
