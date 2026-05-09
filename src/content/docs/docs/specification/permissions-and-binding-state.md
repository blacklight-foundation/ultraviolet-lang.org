---
title: "Permissions and Binding State"
description: "10. Permissions and Binding State of the Ultraviolet language specification."
specSource: "../../Ultraviolet/SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T14:44:07.538Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## 10. Permissions and Binding State

### 10.1 Permission Forms

#### 10.1.1 Syntax

```text
permission         ::= "const" | "unique" | "shared"
receiver_shorthand ::= "~" | "~!" | "~%"
```

Permission qualifiers appear in `type ::= permission? non_permission_type refinement_clause?`. Receiver shorthand forms map to receiver permissions as defined by the parser and AST rules in Chapter 5.

#### 10.1.2 Parsing

Permission tokens are parsed by `ParsePermOpt` in type position and by `ParseReceiver` in receiver position.

The canonical `ParseReceiver` rules are the token-gated parsing rules in §15.2.2. This section owns only the permission-specific token inventory consumed by those rules.

#### 10.1.3 AST Representation / Form

Permission syntax lowers into the following AST forms:

- `Perm` ranges over `{const, unique, shared}`.
- `TypePerm(perm, base)`
- `ReceiverShorthand(perm)`

```text
A permission-qualified type is represented as `TypePerm(P, T)` where `P ∈ Perm` and `T` is the unqualified base type.
```

#### 10.1.4 Static Semantics

**Permission.** A type qualifier governing access, mutation, and aliasing of data referenced by a binding. When no permission is specified, `const` is the default.

**Permission Regimes.** `const`, `shared`, and `unique` are distinct permission regimes. They are not ordered by implicit subtype or coercion.

The following properties define the regimes:

| Permission | Read | Write | Aliasing  | Synchronization |
| :--------- | :--- | :---- | :-------- | :-------------- |
| `const`    | Yes  | No    | Unlimited | N/A             |
| `shared`   | Yes  | Yes   | Aliasable | Key-mediated    |
| `unique`   | Yes  | Yes   | Exclusive | None            |

Additional regime-specific constraints:

- `const` forbids mutation through the qualified path.
- `unique` grants exclusive read-write access and does not imply cleanup responsibility.
- `shared` grants synchronized access and does not imply cleanup responsibility.

For `shared`, the permitted operations are:

| Operation                   | Permitted | Key Mode  |
| :-------------------------- | :-------- | :-------- |
| Field read                  | Yes       | Read key  |
| Field mutation              | Yes       | Write key |
| Method call (`~` receiver)  | Yes       | Read key  |
| Method call (`~%` receiver) | Yes       | Write key |
| Method call (`~!` receiver) | No        | N/A       |

#### 10.1.5 Dynamic Semantics

Permissions do not change the represented value of the underlying object.

- `const` introduces no additional runtime action.
- `unique` introduces no implicit cleanup transfer.
- `shared` access performs implicit key acquisition and release as defined by the key system in Chapter 19.

#### 10.1.6 Lowering

Permission qualifiers do not alter value layout:

**(Layout-Perm)**

```text
Γ ⊢ layout(TypePerm(p, T)) ⇓ L
```

**(SizeOf-Perm)**

```text
Γ ⊢ sizeof(TypePerm(p, T)) = n
```

**(AlignOf-Perm)**

```text
Γ ⊢ alignof(TypePerm(p, T)) = a
```

ABI and LLVM lowering for permission-qualified types are defined by the shared lowering and ABI framework in Chapter 24.

#### 10.1.7 Diagnostics

This section introduces no additional feature-local diagnostics beyond the use-site diagnostics defined by §10.4 and the consuming typing rules.

### 10.2 Alias and Exclusivity Rules

#### 10.2.1 Syntax

This section introduces no additional concrete syntax.

#### 10.2.2 Parsing

This section introduces no additional parsing rules.

#### 10.2.3 AST Representation / Form

This section introduces no additional AST forms beyond permission-qualified types and place/path forms defined elsewhere.

#### 10.2.4 Static Semantics

**Aliasing.** Two paths alias when they refer to overlapping storage locations:

```text
aliases(p_1, p_2) ⇔ storage(p_1) ∩ storage(p_2) ≠ ∅
```

**Exclusivity Invariant.**

```text
∀ p_1, p_2 ∈ Paths. (perm(p_1) = `unique` ∧ overlaps(p_1, p_2)) ⇒ p_1 = p_2
```

**Coexistence Matrix**

| Existing Permission | May Add `unique` | May Add `shared` | May Add `const` |
| :------------------ | :--------------- | :--------------- | :-------------- |
| `unique`            | No               | No               | No              |
| `shared`            | No               | Yes              | Yes             |
| `const`             | No               | No               | Yes             |

#### 10.2.5 Dynamic Semantics

This section introduces no additional runtime mechanism beyond the key-mediated synchronization required for `shared` accesses and the scope-based binding activity rules in §10.3.

#### 10.2.6 Lowering

This section introduces no lowering rules beyond the permission-qualified layout and ABI rules in §10.1.6.

#### 10.2.7 Diagnostics

Violations of these rules are diagnosed by the consuming typing and use-site rules. This section introduces no standalone diagnostic table.

### 10.3 Binding Activity States

#### 10.3.1 Syntax

This section introduces no additional concrete syntax.

#### 10.3.2 Parsing

This section introduces no additional parsing rules.

#### 10.3.3 AST Representation / Form

Binding activity state is a semantic state machine over bindings; it has no dedicated AST node.

#### 10.3.4 Static Semantics

A binding `b` with `unique` permission exists in one of two states:

| State    | Definition                                              | Operations Permitted        |
| :------- | :------------------------------------------------------ | :-------------------------- |
| Active   | No suspended admissible uses of `b` are live            | Read, write, move           |
| Inactive | A non-consuming admissible use of `b` is currently live | No direct operations on `b` |

**(Inactive-Enter)**
b : `unique` T    b is Active    non-consuming admissible use of b begins
──────────────────────────────────────────────────────────────────────────────
b becomes Inactive

**(Inactive-Exit)**
b is Inactive    all live non-consuming admissible uses of b end
──────────────────────────────────────────────────────────────────────────────
b becomes Active with `unique` permission preserved

#### 10.3.5 Dynamic Semantics

During the inactive period, the original `unique` binding MUST NOT be read, written, or moved.

Entering or exiting the inactive state does not create a `shared` or `const` alias. It suspends direct use of the `unique` binding while the admissible use remains live.

The transition back to `Active` occurs deterministically when the admissible-use scope ends.

#### 10.3.6 Lowering

This section introduces no feature-local lowering. Binding activity is enforced by the static semantics and by the evaluation contexts that consume those judgments.

#### 10.3.7 Diagnostics

Violations of binding activity constraints are diagnosed by the consuming typing rules. This section introduces no standalone diagnostic table.

### 10.4 Permission Admissibility

#### 10.4.1 Syntax

This section introduces no additional concrete syntax beyond permission qualifiers and receiver shorthand.

#### 10.4.2 Parsing

This section introduces no additional parsing rules.

#### 10.4.3 AST Representation / Form

Permission admissibility is defined over existing permission-qualified types and receiver forms:

- `TypePerm(perm, base)`
- `ReceiverShorthand(perm)`

#### 10.4.4 Static Semantics

**Permission Admissibility.** This section defines which caller permissions satisfy a required receiver or non-consuming parameter permission. It does not define type subtyping or coercion.

PermAdmitsJudg = {PermAdmits}

`PermAdmits(P_caller, P_req)` holds exactly for:
- `PermAdmits(const, const)`
- `PermAdmits(shared, const)`
- `PermAdmits(shared, shared)`
- `PermAdmits(unique, const)`
- `PermAdmits(unique, shared)`
- `PermAdmits(unique, unique)`

`PermAdmits` MUST be used for receiver checking, key-mediated operation checking, and non-consuming argument passing. It MUST NOT rewrite the static type of the caller expression.

**Method Receiver Permissions**

A method with receiver permission `P_method` is callable through a path with permission `P_caller` iff:

PermAdmits(P_caller, P_method)

| Caller Permission | May Call `~` | May Call `~%` | May Call `~!` |
| :---------------- | :----------- | :------------ | :------------ |
| `const`           | Yes          | No            | No            |
| `shared`          | Yes          | Yes           | No            |
| `unique`          | Yes          | Yes           | Yes           |

**Constraints**

1. No implicit conversion, coercion, rebinding, or alias creation from `unique T` to `shared T` or `const T` exists.
2. General subtyping of permission-qualified types is defined by the type-system core in Chapter 8 and requires permission equality.

#### 10.4.5 Dynamic Semantics

Permission admissibility does not rewrite runtime values or runtime type identity.

For `shared` operations, admissibility determines whether the operation may proceed to key-mediated access; the runtime key behavior itself remains defined by Chapter 19.

#### 10.4.6 Lowering

Admissibility is a static gate only. It does not introduce distinct runtime representations or ABI forms.

#### 10.4.7 Diagnostics

| Code         | Severity | Detection    | Condition                                                             |
| ------------ | -------- | ------------ | --------------------------------------------------------------------- |
| `E-TYP-1601` | Error    | Compile-time | Mutation through `const` path                                         |
| `E-TYP-1602` | Error    | Compile-time | `unique` exclusion violation (aliasing or inactive use)               |
| `E-TYP-1603` | Error    | Compile-time | Non-`move` argument with source provenance must be a place expression |
| `E-TYP-1604` | Error    | Compile-time | Direct field mutation through `shared` path without key               |
| `E-TYP-1605` | Error    | Compile-time | Receiver permission incompatible with caller                          |
