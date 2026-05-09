---
title: "Type System Core"
description: "8. Type System Core of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T17:39:45.389Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## 8. Type System Core

### 8.1 Type Equivalence

TypeEqJudg = {≡}
ConstLenJudg = {ConstLen}

**(ConstLen-Lit)**
e = Literal(lit)    lit.kind = IntLiteral    InRange(IntValue(lit), "usize")    n = IntValue(lit)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ConstLen(e) ⇓ n
```

**(ConstLen-Path)**

```text
e = Path(path, name)    ValuePathType(path, name) = T    StaticDecl(_, _, _, ⟨IdentPattern(name), _, "=", init, _⟩, _, _) ∈ Γ    Γ ⊢ ConstLen(init) ⇓ n
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ConstLen(e) ⇓ n
```

**(ConstLen-Err)**

```text
¬ ∃ n. Γ ⊢ ConstLen(e) ⇓ n    c = Code(ConstLen-Err)
```

────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ConstLen(e) ⇑ c
```

```text
MembersEq([T_1, …, T_n], [U_1, …, U_n]) ⇔ ∃ U'. Permutation(U', [U_1, …, U_n]) ∧ ∀ i. 0 ≤ i < n ⇒ Γ ⊢ T_i ≡ U'[i]
```

**(T-Equiv-Prim)**
T = TypePrim(n)    U = TypePrim(n)
──────────────────────────────────────────────

```text
Γ ⊢ T ≡ U
```

**(T-Equiv-Perm)**

```text
T = TypePerm(p, T_0)    U = TypePerm(p, U_0)    Γ ⊢ T_0 ≡ U_0
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ T ≡ U
```

**(T-Equiv-Tuple)**

```text
T = TypeTuple([T_1, …, T_n])    U = TypeTuple([U_1, …, U_n])    ∀ i, Γ ⊢ T_i ≡ U_i
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T ≡ U
```

**(T-Equiv-Array)**

```text
T = TypeArray(T_0, e_0)    U = TypeArray(U_0, e_1)    Γ ⊢ ConstLen(e_0) ⇓ n    Γ ⊢ ConstLen(e_1) ⇓ n    Γ ⊢ T_0 ≡ U_0
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T ≡ U
```

**(T-Equiv-Slice)**

```text
T = TypeSlice(T_0)    U = TypeSlice(U_0)    Γ ⊢ T_0 ≡ U_0
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ T ≡ U
```

**(T-Equiv-Func)**

```text
T = TypeFunc([⟨m_1, T_1⟩, …, ⟨m_n, T_n⟩], R)    U = TypeFunc([⟨m_1, U_1⟩, …, ⟨m_n, U_n⟩], S)    ∀ i, Γ ⊢ T_i ≡ U_i    Γ ⊢ R ≡ S
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T ≡ U
```

**(T-Equiv-Closure)**

```text
T = TypeClosure([⟨m_1, T_1⟩, …, ⟨m_n, T_n⟩], R, D)    U = TypeClosure([⟨m_1, U_1⟩, …, ⟨m_n, U_n⟩], S, D)    ∀ i, Γ ⊢ T_i ≡ U_i    Γ ⊢ R ≡ S
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T ≡ U
```

**(T-Equiv-Union)**
T = TypeUnion([T_1, …, T_n])    U = TypeUnion([U_1, …, U_n])    MembersEq([T_1, …, T_n], [U_1, …, U_n])
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T ≡ U
```

**(T-Equiv-Path)**
T = TypePath(p)    U = TypePath(p)
──────────────────────────────────────────────

```text
Γ ⊢ T ≡ U
```

**(T-Equiv-ModalState)**
T = TypeModalState(modal_ref, S)    U = TypeModalState(modal_ref, S)
──────────────────────────────────────────────────────────────

```text
Γ ⊢ T ≡ U
```

**(T-Equiv-String)**
T = TypeString(st)    U = TypeString(st)
──────────────────────────────────────────────

```text
Γ ⊢ T ≡ U
```

**(T-Equiv-Bytes)**
T = TypeBytes(st)    U = TypeBytes(st)
──────────────────────────────────────────────

```text
Γ ⊢ T ≡ U
```

**(T-Equiv-Range)**

```text
T = TypeRange(T_0)    U = TypeRange(U_0)    Γ ⊢ T_0 ≡ U_0
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ T ≡ U
```

**(T-Equiv-RangeInclusive)**

```text
T = TypeRangeInclusive(T_0)    U = TypeRangeInclusive(U_0)    Γ ⊢ T_0 ≡ U_0
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T ≡ U
```

**(T-Equiv-RangeFrom)**

```text
T = TypeRangeFrom(T_0)    U = TypeRangeFrom(U_0)    Γ ⊢ T_0 ≡ U_0
```

────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T ≡ U
```

**(T-Equiv-RangeTo)**

```text
T = TypeRangeTo(T_0)    U = TypeRangeTo(U_0)    Γ ⊢ T_0 ≡ U_0
```

────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T ≡ U
```

**(T-Equiv-RangeToInclusive)**

```text
T = TypeRangeToInclusive(T_0)    U = TypeRangeToInclusive(U_0)    Γ ⊢ T_0 ≡ U_0
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T ≡ U
```

**(T-Equiv-RangeFull)**
T = TypeRangeFull    U = TypeRangeFull
────────────────────────────────────────────────────────

```text
Γ ⊢ T ≡ U
```

**(T-Equiv-Ptr)**

```text
T = TypePtr(T_0, s)    U = TypePtr(U_0, s)    Γ ⊢ T_0 ≡ U_0
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ T ≡ U
```

**(T-Equiv-RawPtr)**

```text
T = TypeRawPtr(q, T_0)    U = TypeRawPtr(q, U_0)    Γ ⊢ T_0 ≡ U_0
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ T ≡ U
```

**(T-Equiv-Dynamic)**
T = TypeDynamic(p)    U = TypeDynamic(p)
──────────────────────────────────────────────

```text
Γ ⊢ T ≡ U
```

**(T-Equiv-Apply)**

```text
T = TypeApply(path, [T_1, …, T_n])    U = TypeApply(path, [U_1, …, U_n])    ∀ i, Γ ⊢ T_i ≡ U_i
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T ≡ U
```

**(T-Equiv-Opaque)**
T = TypeOpaque(path)    U = TypeOpaque(path)
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T ≡ U
```

**(T-Equiv-Refine)**

```text
T = TypeRefine(T_0, P_1)    U = TypeRefine(U_0, P_2)    Γ ⊢ T_0 ≡ U_0    PredicateEquiv(P_1, P_2)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T ≡ U
```

```text
PredicateEquiv(P_1, P_2) ⇔ ∀ σ. (Eval(P_1, σ) = true ⇔ Eval(P_2, σ) = true)
```

**(T-Equiv-Refine-Norm)**

```text
T = TypeRefine(TypeRefine(T_0, P_1), P_2)    U = TypeRefine(T_0, P_1 ∧ P_2)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T ≡ U
```

**(T-Equiv-Refl)**

```text
T ∈ 𝒯
```

──────────────────────────────────────────────

```text
Γ ⊢ T ≡ T
```

**(T-Equiv-Sym)**

```text
Γ ⊢ T ≡ U
```

──────────────────────────────────────────────

```text
Γ ⊢ U ≡ T
```

**(T-Equiv-Trans)**

```text
Γ ⊢ T ≡ U    Γ ⊢ U ≡ V
```

──────────────────────────────────────────────

```text
Γ ⊢ T ≡ V
```

### 8.2 Subtyping

SubtypingJudg = {<:}

```text
∀ T, U ∈ IntTypes. T ≠ U ⇒ ¬(Γ ⊢ T <: U)
∀ T, U ∈ FloatTypes. T ≠ U ⇒ ¬(Γ ⊢ T <: U)
```

Permission admissibility is defined by Chapter 10. This chapter defines only type subtyping. For permission-qualified types, general subtyping requires permission equality.

**(Sub-Perm)**

```text
T = TypePerm(p, T_0)    U = TypePerm(q, U_0)    p = q    Γ ⊢ T_0 <: U_0
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T <: U
```

**(Sub-Never)**

```text
T ∈ 𝒯
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ TypePrim("!") <: T
```

**(Sub-Tuple)**

```text
T = TypeTuple([T_1, …, T_n])    U = TypeTuple([U_1, …, U_n])    ∀ i, Γ ⊢ T_i <: U_i
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T <: U
```

**(Sub-Array)**

```text
T = TypeArray(T_0, e_0)    U = TypeArray(U_0, e_1)    Γ ⊢ ConstLen(e_0) ⇓ n    Γ ⊢ ConstLen(e_1) ⇓ n    Γ ⊢ T_0 ≡ U_0
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T <: U
```

**(Sub-Slice)**

```text
T = TypeSlice(T_0)    U = TypeSlice(U_0)    Γ ⊢ T_0 ≡ U_0
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ T <: U
```

**(Sub-Range)**

```text
T = TypeRange(T_0)    U = TypeRange(U_0)    Γ ⊢ T_0 <: U_0
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ T <: U
```

**(Sub-RangeInclusive)**

```text
T = TypeRangeInclusive(T_0)    U = TypeRangeInclusive(U_0)    Γ ⊢ T_0 <: U_0
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T <: U
```

**(Sub-RangeFrom)**

```text
T = TypeRangeFrom(T_0)    U = TypeRangeFrom(U_0)    Γ ⊢ T_0 <: U_0
```

────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T <: U
```

**(Sub-RangeTo)**

```text
T = TypeRangeTo(T_0)    U = TypeRangeTo(U_0)    Γ ⊢ T_0 <: U_0
```

────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T <: U
```

**(Sub-RangeToInclusive)**

```text
T = TypeRangeToInclusive(T_0)    U = TypeRangeToInclusive(U_0)    Γ ⊢ T_0 <: U_0
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T <: U
```

**(Sub-RangeFull)**
T = TypeRangeFull    U = TypeRangeFull
────────────────────────────────────────────────────────

```text
Γ ⊢ T <: U
```

**(Sub-Ptr-State)**

```text
s ∈ {`Valid`, `Null`}
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ TypePtr(T, s) <: TypePtr(T, ⊥)
```

**(Sub-Modal-Niche)**

```text
ModalDeclOf(modal_ref) = M    S ∈ States(M)    NicheCompatible(modal_ref, S)
```

────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeModalState(modal_ref, S) <: ModalRefType(modal_ref)
```

**(Sub-Func)**

```text
T = TypeFunc([⟨m_1, T_1⟩, …, ⟨m_n, T_n⟩], R)    U = TypeFunc([⟨m_1, U_1⟩, …, ⟨m_n, U_n⟩], S)    ∀ i, Γ ⊢ U_i <: T_i    Γ ⊢ R <: S
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T <: U
```

**(Sub-Closure)**

```text
T = TypeClosure([⟨m_1, T_1⟩, …, ⟨m_n, T_n⟩], R, D)    U = TypeClosure([⟨m_1, U_1⟩, …, ⟨m_n, U_n⟩], S, D)    ∀ i, Γ ⊢ U_i <: T_i    Γ ⊢ R <: S
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T <: U
```

**(Sub-Async)**

```text
AsyncSig(T) = ⟨Out_1, In_1, Result_1, E_1⟩    AsyncSig(U) = ⟨Out_2, In_2, Result_2, E_2⟩
Γ ⊢ Out_1 <: Out_2    Γ ⊢ In_2 <: In_1    Γ ⊢ Result_1 <: Result_2    Γ ⊢ E_1 <: E_2
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T <: U
```

```text
Member(T, U) ⇔ U = TypeUnion([U_1, …, U_n]) ∧ ∃ i. Γ ⊢ T ≡ U_i
```

**(Sub-Member-Union)**
Member(T, U)
──────────────────────────────────────────────

```text
Γ ⊢ T <: U
```

**(Sub-Union-Width)**

```text
U_1 = TypeUnion([T_1, …, T_n])    U_2 = TypeUnion([U_1', …, U_m'])    ∀ i, Member(T_i, U_2)
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ U_1 <: U_2
```

Variance = {`+`, `-`, `=`, `±`}

```text
VarianceOf : TypePath × ℕ → Variance
VarianceOf(path, i) = v ⇔ GenericDecl(path) = ⟨params, _⟩ ∧ params[i].variance = v
```

```text
VarianceSatisfied(v, T, U) ⇔
  (v = `+` ∧ Γ ⊢ T <: U) ∨
  (v = `-` ∧ Γ ⊢ U <: T) ∨
  (v = `=` ∧ Γ ⊢ T ≡ U) ∨
```

  (v = `±`)

**(Sub-Generic)**

```text
T = TypeApply(path, [T_1, …, T_n])    U = TypeApply(path, [U_1, …, U_n])    ∀ i, VarianceSatisfied(VarianceOf(path, i), T_i, U_i)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T <: U
```

**(Sub-Generic-Invariant-Err)**

```text
T = TypeApply(path, [T_1, …, T_n])    U = TypeApply(path, [U_1, …, U_n])    ∃ i, VarianceOf(path, i) = `=` ∧ ¬(Γ ⊢ T_i ≡ U_i)    c = Code(E-TYP-1520)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T <: U ⇑ c
```

**(Sub-Generic-Covariant-Err)**

```text
T = TypeApply(path, [T_1, …, T_n])    U = TypeApply(path, [U_1, …, U_n])    ∃ i, VarianceOf(path, i) = `+` ∧ ¬(Γ ⊢ T_i <: U_i)    c = Code(E-TYP-1521)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T <: U ⇑ c
```

**(Sub-Generic-Contravariant-Err)**

```text
T = TypeApply(path, [T_1, …, T_n])    U = TypeApply(path, [U_1, …, U_n])    ∃ i, VarianceOf(path, i) = `-` ∧ ¬(Γ ⊢ U_i <: T_i)    c = Code(E-TYP-1521)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T <: U ⇑ c
```

**(Sub-Refl)**

```text
T ∈ 𝒯
```

──────────────────────────────────────────────

```text
Γ ⊢ T <: T
```

**(Sub-Trans)**

```text
Γ ⊢ T <: U    Γ ⊢ U <: V
```

──────────────────────────────────────────────

```text
Γ ⊢ T <: V
```

### 8.3 Type Inference

```text
TypeInfJudg = {⇒, ⇐, Solve}
```

Constraint = Type × Type
ConstraintSet = ℘(Constraint)

Constraint generation is feature-local. This chapter defines only the shared equality-constraint domain, substitution machinery, and solver consumed by those rules. Rules that generate no additional equalities yield `∅`.

TVar = {α, β, γ, ...}
TVars(T) = set of type variables occurring in T

Subst = TVar ⇀ Type

```text
Dom(θ) = {α | θ(α) defined}
```

Id = ∅

```text
θ(TypePrim(p)) = TypePrim(p)
θ(TVar(α)) = θ(α) if α ∈ Dom(θ), else TVar(α)
θ(TypeTuple(Ts)) = TypeTuple([θ(T) | T ∈ Ts])
θ(TypeArray(T, n)) = TypeArray(θ(T), n)
θ(TypeSlice(T)) = TypeSlice(θ(T))
θ(TypeUnion(Ts)) = TypeUnion([θ(T) | T ∈ Ts])
θ(TypeFunc(ps, R)) = TypeFunc([(m, θ(T)) | (m, T) ∈ ps], θ(R))
θ(TypePtr(T, s)) = TypePtr(θ(T), s)
θ(TypePerm(p, T)) = TypePerm(p, θ(T))
θ(TypeApply(path, args)) = TypeApply(path, [θ(T) | T ∈ args])
θ distributes over all remaining type constructors.
```

```text
θ₁ ∘ θ₂ = λα. θ₁(θ₂(α))
```

```text
UnifyState = {UnifyStart(C), UnifyStep(C, θ), UnifyDone(θ), UnifyFail}
```

**(Unify-Empty)**
────────────────────────────────────

```text
⟨UnifyStart(∅)⟩ → ⟨UnifyDone(Id)⟩
```

**(Unify-Eq)**
T = U
────────────────────────────────────────────────────────

```text
⟨UnifyStep({(T, U)} ∪ C, θ)⟩ → ⟨UnifyStep(C, θ)⟩
```

**(Unify-Var-L)**

```text
T = TVar(α)    α ∉ TVars(U)
```

────────────────────────────────────────────────────────────────────

```text
⟨UnifyStep({(T, U)} ∪ C, θ)⟩ → ⟨UnifyStep([α ↦ U]C, [α ↦ U] ∘ θ)⟩
```

**(Unify-Var-R)**

```text
U = TVar(α)    α ∉ TVars(T)
```

────────────────────────────────────────────────────────────────────

```text
⟨UnifyStep({(T, U)} ∪ C, θ)⟩ → ⟨UnifyStep([α ↦ T]C, [α ↦ T] ∘ θ)⟩
```

**(Unify-Occurs-Fail)**

```text
T = TVar(α)    α ∈ TVars(U)    T ≠ U
```

────────────────────────────────────────────────────────────────────

```text
⟨UnifyStep({(T, U)} ∪ C, θ)⟩ → ⟨UnifyFail⟩
```

**(Unify-Tuple)**
T = TypeTuple([T_1, …, T_n])    U = TypeTuple([U_1, …, U_n])
────────────────────────────────────────────────────────────────────────────

```text
⟨UnifyStep({(T, U)} ∪ C, θ)⟩ → ⟨UnifyStep({(T_1, U_1), …, (T_n, U_n)} ∪ C, θ)⟩
```

**(Unify-Tuple-Fail)**

```text
T = TypeTuple([T_1, …, T_n])    U = TypeTuple([U_1, …, U_m])    n ≠ m
```

────────────────────────────────────────────────────────────────────────────

```text
⟨UnifyStep({(T, U)} ∪ C, θ)⟩ → ⟨UnifyFail⟩
```

**(Unify-Array)**

```text
T = TypeArray(T_0, e_0)    U = TypeArray(U_0, e_1)    Γ ⊢ ConstLen(e_0) ⇓ n    Γ ⊢ ConstLen(e_1) ⇓ n
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨UnifyStep({(T, U)} ∪ C, θ)⟩ → ⟨UnifyStep({(T_0, U_0)} ∪ C, θ)⟩
```

**(Unify-Array-Len-Fail)**

```text
T = TypeArray(T_0, e_0)    U = TypeArray(U_0, e_1)    Γ ⊢ ConstLen(e_0) ⇓ n_0    Γ ⊢ ConstLen(e_1) ⇓ n_1    n_0 ≠ n_1
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨UnifyStep({(T, U)} ∪ C, θ)⟩ → ⟨UnifyFail⟩
```

**(Unify-Slice)**
T = TypeSlice(T_0)    U = TypeSlice(U_0)
────────────────────────────────────────────────────────────────────────────

```text
⟨UnifyStep({(T, U)} ∪ C, θ)⟩ → ⟨UnifyStep({(T_0, U_0)} ∪ C, θ)⟩
```

**(Unify-Perm)**
T = TypePerm(p, T_0)    U = TypePerm(p, U_0)
────────────────────────────────────────────────────────────────────────────

```text
⟨UnifyStep({(T, U)} ∪ C, θ)⟩ → ⟨UnifyStep({(T_0, U_0)} ∪ C, θ)⟩
```

**(Unify-Perm-Fail)**

```text
T = TypePerm(p, T_0)    U = TypePerm(q, U_0)    p ≠ q
```

────────────────────────────────────────────────────────────────────────────

```text
⟨UnifyStep({(T, U)} ∪ C, θ)⟩ → ⟨UnifyFail⟩
```

**(Unify-Func)**
T = TypeFunc([(m_1, T_1), …, (m_n, T_n)], R_T)
U = TypeFunc([(m_1, U_1), …, (m_n, U_n)], R_U)
────────────────────────────────────────────────────────────────────────────

```text
⟨UnifyStep({(T, U)} ∪ C, θ)⟩ → ⟨UnifyStep({(T_1, U_1), …, (T_n, U_n), (R_T, R_U)} ∪ C, θ)⟩
```

**(Unify-Func-Fail)**

```text
T = TypeFunc(ps_T, R_T)    U = TypeFunc(ps_U, R_U)    ¬ ∃ n, vec{m}, vec{T}, vec{U}. ps_T = [(m_1, T_1), …, (m_n, T_n)] ∧ ps_U = [(m_1, U_1), …, (m_n, U_n)]
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨UnifyStep({(T, U)} ∪ C, θ)⟩ → ⟨UnifyFail⟩
```

**(Unify-Closure)**
T = TypeClosure([(m_1, T_1), …, (m_n, T_n)], R_T, D)    U = TypeClosure([(m_1, U_1), …, (m_n, U_n)], R_U, D)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨UnifyStep({(T, U)} ∪ C, θ)⟩ → ⟨UnifyStep({(T_1, U_1), …, (T_n, U_n), (R_T, R_U)} ∪ C, θ)⟩
```

**(Unify-Closure-Fail)**

```text
T = TypeClosure(ps_T, R_T, D_T)    U = TypeClosure(ps_U, R_U, D_U)    (D_T ≠ D_U ∨ ¬ ∃ n, vec{m}, vec{T}, vec{U}. ps_T = [(m_1, T_1), …, (m_n, T_n)] ∧ ps_U = [(m_1, U_1), …, (m_n, U_n)])
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨UnifyStep({(T, U)} ∪ C, θ)⟩ → ⟨UnifyFail⟩
```

**(Unify-Ptr)**
T = TypePtr(T_0, s)    U = TypePtr(U_0, s)
────────────────────────────────────────────────────────────────────────────

```text
⟨UnifyStep({(T, U)} ∪ C, θ)⟩ → ⟨UnifyStep({(T_0, U_0)} ∪ C, θ)⟩
```

**(Unify-Ptr-State-Fail)**

```text
T = TypePtr(T_0, s_0)    U = TypePtr(U_0, s_1)    s_0 ≠ s_1
```

────────────────────────────────────────────────────────────────────────────

```text
⟨UnifyStep({(T, U)} ∪ C, θ)⟩ → ⟨UnifyFail⟩
```

**(Unify-RawPtr)**
T = TypeRawPtr(q, T_0)    U = TypeRawPtr(q, U_0)
────────────────────────────────────────────────────────────────────────────

```text
⟨UnifyStep({(T, U)} ∪ C, θ)⟩ → ⟨UnifyStep({(T_0, U_0)} ∪ C, θ)⟩
```

**(Unify-RawPtr-Qual-Fail)**

```text
T = TypeRawPtr(q_0, T_0)    U = TypeRawPtr(q_1, U_0)    q_0 ≠ q_1
```

────────────────────────────────────────────────────────────────────────────

```text
⟨UnifyStep({(T, U)} ∪ C, θ)⟩ → ⟨UnifyFail⟩
```

**(Unify-Apply)**
T = TypeApply(path, [T_1, …, T_n])    U = TypeApply(path, [U_1, …, U_n])
────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨UnifyStep({(T, U)} ∪ C, θ)⟩ → ⟨UnifyStep({(T_1, U_1), …, (T_n, U_n)} ∪ C, θ)⟩
```

**(Unify-Apply-Fail)**

```text
T = TypeApply(path_T, Ts)    U = TypeApply(path_U, Us)    (path_T ≠ path_U ∨ |Ts| ≠ |Us|)
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨UnifyStep({(T, U)} ∪ C, θ)⟩ → ⟨UnifyFail⟩
```

**(Unify-Range)**
T = TypeRange(T_0)    U = TypeRange(U_0)
────────────────────────────────────────────────────────────────────────────

```text
⟨UnifyStep({(T, U)} ∪ C, θ)⟩ → ⟨UnifyStep({(T_0, U_0)} ∪ C, θ)⟩
```

**(Unify-RangeInclusive)**
T = TypeRangeInclusive(T_0)    U = TypeRangeInclusive(U_0)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨UnifyStep({(T, U)} ∪ C, θ)⟩ → ⟨UnifyStep({(T_0, U_0)} ∪ C, θ)⟩
```

**(Unify-RangeFrom)**
T = TypeRangeFrom(T_0)    U = TypeRangeFrom(U_0)
────────────────────────────────────────────────────────────────────────────────────

```text
⟨UnifyStep({(T, U)} ∪ C, θ)⟩ → ⟨UnifyStep({(T_0, U_0)} ∪ C, θ)⟩
```

**(Unify-RangeTo)**
T = TypeRangeTo(T_0)    U = TypeRangeTo(U_0)
────────────────────────────────────────────────────────────────────────────────

```text
⟨UnifyStep({(T, U)} ∪ C, θ)⟩ → ⟨UnifyStep({(T_0, U_0)} ∪ C, θ)⟩
```

**(Unify-RangeToInclusive)**
T = TypeRangeToInclusive(T_0)    U = TypeRangeToInclusive(U_0)
────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨UnifyStep({(T, U)} ∪ C, θ)⟩ → ⟨UnifyStep({(T_0, U_0)} ∪ C, θ)⟩
```

**(Unify-Refine)**
T = TypeRefine(T_0, pred)    U = TypeRefine(U_0, pred)
────────────────────────────────────────────────────────────────────────────

```text
⟨UnifyStep({(T, U)} ∪ C, θ)⟩ → ⟨UnifyStep({(T_0, U_0)} ∪ C, θ)⟩
```

**(Unify-Refine-Pred-Fail)**

```text
T = TypeRefine(T_0, pred_T)    U = TypeRefine(U_0, pred_U)    pred_T ≠ pred_U
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨UnifyStep({(T, U)} ∪ C, θ)⟩ → ⟨UnifyFail⟩
```

**(Unify-Prim-Fail)**

```text
T = TypePrim(p_T)    U = TypePrim(p_U)    p_T ≠ p_U
```

────────────────────────────────────────────────────────────────────────────

```text
⟨UnifyStep({(T, U)} ∪ C, θ)⟩ → ⟨UnifyFail⟩
```

**(Unify-Rigid-Fail)**

```text
((T = TypeUnion(_) ∧ U = TypeUnion(_)) ∨
 (T = TypePath(_) ∧ U = TypePath(_)) ∨
 (T = TypeString(_) ∧ U = TypeString(_)) ∨
 (T = TypeBytes(_) ∧ U = TypeBytes(_)) ∨
 (T = TypeDynamic(_) ∧ U = TypeDynamic(_)) ∨
 (T = TypeOpaque(_) ∧ U = TypeOpaque(_)) ∨
 (T = TypeModalState(_, _) ∧ U = TypeModalState(_, _)) ∨
 (T = TypeRangeFull ∧ U = TypeRangeFull))    T ≠ U
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨UnifyStep({(T, U)} ∪ C, θ)⟩ → ⟨UnifyFail⟩
```

**(Unify-Ctor-Mismatch)**

```text
TypeCtor(T) ≠ TypeCtor(U)    T ∉ TVar    U ∉ TVar
```

────────────────────────────────────────────────────────────────────────────

```text
⟨UnifyStep({(T, U)} ∪ C, θ)⟩ → ⟨UnifyFail⟩
```

**(Unify-Ok)**

```text
⟨UnifyStart(C)⟩ →* ⟨UnifyDone(θ)⟩
```

─────────────────────────────────────

```text
Γ ⊢ Unify(C) ⇓ θ
```

**(Unify-Err)**

```text
⟨UnifyStart(C)⟩ →* ⟨UnifyFail⟩    c = Code(Unify-Fail)
```

────────────────────────────────────────────────────────

```text
Γ ⊢ Unify(C) ⇑ c
```

**(Solve-Unify)**

```text
Γ ⊢ Unify(C) ⇓ θ
```

───────────────────────

```text
Γ ⊢ Solve(C) ⇓ θ
```

**(Solve-Fail)**

```text
Γ ⊢ Unify(C) ⇑ c
```

─────────────────────────

```text
Γ ⊢ Solve(C) ⇑ c
```

**(Syn-Expr)**

```text
Γ; R; L ⊢ e : T
```

──────────────────────────────────────────────

```text
Γ; R; L ⊢ e ⇒ T ⊣ ∅
```

**(Syn-Ident)**

```text
(x : T) ∈ Γ
```

──────────────────────────────────────────────

```text
Γ; R; L ⊢ Identifier(x) ⇒ T ⊣ ∅
```

**(Syn-Unit)**
────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ TupleExpr([]) ⇒ TypePrim("()") ⊣ ∅
```

**(Syn-Tuple)**

```text
n ≥ 1    ∀ i, Γ; R; L ⊢ e_i ⇒ T_i ⊣ C_i
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ TupleExpr([e_1, …, e_n]) ⇒ TypeTuple([T_1, …, T_n]) ⊣ ⋃_i C_i
```

**(Syn-Call)**

```text
Γ; R; L ⊢ callee ⇒ TypeFunc(params, R_c) ⊣ C_0    Γ; R; L ⊢ ArgsOk_T(params, args)
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Call(callee, args) ⇒ R_c ⊣ C_0
```

**(Syn-Call-Err)**

```text
Γ; R; L ⊢ Call(callee, args) ⇑ c
```

────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ Call(callee, args) ⇒ T ⊣ C ⇑ c
```

**(Chk-Subsumption-Modal-NonNiche)**

```text
Γ; R; L ⊢ e ⇒ S ⊣ C    StripPerm(S) = TypeModalState(modal_ref, S_s)    StripPerm(T) = ModalRefType(modal_ref)    ModalDeclOf(modal_ref) = M    ¬ NicheCompatible(modal_ref, S_s)    c = Code(Chk-Subsumption-Modal-NonNiche)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ e ⇐ T ⇑ c
```

**(Chk-Subsumption)**

```text
Γ; R; L ⊢ e ⇒ S ⊣ C    Γ ⊢ S <: T
```

────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ e ⇐ T ⊣ C
```

**(Chk-Null-Ptr)**

```text
T = TypePtr(U, s)    s ∈ {`Null`, ⊥}
```

────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ PtrNullExpr ⇐ T ⊣ ∅
```

```text
PtrNullExpected(T) ⇔ T = TypePtr(U, s) ∧ s ∈ {`Null`, ⊥}
```

**(Syn-PtrNull-Err)**
c = Code(PtrNull-Infer-Err)
────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ PtrNullExpr ⇒ T ⊣ C ⇑ c
```

**(Chk-PtrNull-Err)**

```text
¬ PtrNullExpected(T)    c = Code(PtrNull-Infer-Err)
```

────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ PtrNullExpr ⇐ T ⊣ C ⇑ c
```

Feature-local synthesis and checking rules are owned by the corresponding feature chapters. This chapter owns the shared unification, substitution, and judgment framework those rules consume.

### 8.4 Metatheoretic Properties

This subsection states the key metatheoretic properties that the Ultraviolet type system is designed to satisfy. Formal proofs are deferred to supplementary materials.

**(Progress)**

```text
If Γ ⊢ e : T and `e` is not a value, then either:
```

1. `e` can take a step.
2. `e` is blocked on an external operation.
3. `e` panics.

**(Preservation)**

```text
If Γ ⊢ e : T and `e → e'`, then Γ ⊢ e' : T.
```

**(No-Use-After-Free)**

```text
A binding in state `Moved` or `PartiallyMoved(F)` where `f ∈ F` cannot be read or moved from.
```

**(No-Double-Free)**
Each responsible binding is dropped exactly once when it goes out of scope.

**(No-Dangling-Pointers)**

```text
A pointer `Ptr<T>@Valid` always references valid storage. A pointer with provenance `π` cannot escape to storage with longer lifetime `π'` where `π < π'`.
```

**(Exclusivity-Invariant)**
If a binding `x` has permission `unique` and is in state `Active`, then no other live path exists to the same storage location.

**(Permission-Preservation)**
Permissions are preserved as permission regimes. Admissibility at a use site MUST NOT create a weaker alias or convert a `unique` binding into `shared` or `const`.

**(State-Determinism)**
At each program point, every binding has exactly one state in `{Valid, Moved, PartiallyMoved(F)}`.

**(No-Resurrection)**
A binding in state `Moved` cannot transition back to `Valid` except through reassignment of a `var` binding.

**(Data-Race-Freedom)**
Concurrent accesses to `shared` data are serialized through the key system.

**(Fork-Join-Guarantee)**
All work items spawned within a `parallel` block complete before the block exits.

**(Key-Serialization)**
If two tasks hold keys `K₁` and `K₂` to overlapping paths with incompatible modes, the key system ensures they do not execute concurrently.

**(Async-Key-Safety)**
Keys cannot be held across `yield` or `wait` suspension points unless the `release` modifier is used.

### 8.5 Core Type Diagnostics

This section owns core type-inference and alias-cycle diagnostics that are not specific to a single feature chapter.

| Code         | Severity | Detection    | Condition                                                  |
| ------------ | -------- | ------------ | ---------------------------------------------------------- |
| `E-TYP-1506` | Error    | Compile-time | Type alias cycle detected                                  |
| `E-TYP-1520` | Error    | Compile-time | Variance violation in generic type instantiation           |
| `E-TYP-1521` | Error    | Compile-time | Invariant type parameter requires exact type match         |
| `E-TYP-1530` | Error    | Compile-time | Type inference failed; unable to determine type            |
| `E-TYP-1531` | Error    | Compile-time | Float literal explicit suffix does not match expected type |
