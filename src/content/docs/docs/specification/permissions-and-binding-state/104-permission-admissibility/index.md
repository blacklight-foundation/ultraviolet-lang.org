---
title: "10.4 Permission Admissibility"
description: "10.4 Permission Admissibility from 10. Permissions and Binding State of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "permissions-and-binding-state"
specSection: "104-permission-admissibility"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/permissions-and-binding-state/">10. Permissions and Binding State</a>
  <span>Permissions and Binding State</span>
</div>

## 10.4 Permission Admissibility

### 10.4.1 Syntax

This section introduces no additional concrete syntax beyond permission qualifiers and receiver shorthand.

### 10.4.2 Parsing

This section introduces no additional parsing rules.

### 10.4.3 AST Representation / Form

Permission admissibility is defined over existing permission-qualified types and receiver forms:

- `TypePerm(perm, base)`
- `ReceiverShorthand(perm)`

### 10.4.4 Static Semantics

**Permission Admissibility.** This section defines which caller permissions satisfy a required receiver or non-consuming parameter permission. It does not define type subtyping or coercion.

$$
\mathsf{PermAdmitsJudg}\ =\ \{\mathsf{PermAdmits}\}
$$

$$
\texttt{PermAdmits(P\_caller, P\_req)}\ \mathsf{holds}\ \mathsf{exactly}\ \mathsf{for}:
$$
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

### 10.4.5 Dynamic Semantics

Permission admissibility does not rewrite runtime values or runtime type identity.

For `shared` operations, admissibility determines whether the operation may proceed to key-mediated access; the runtime key behavior itself remains defined by Chapter 19.

### 10.4.6 Lowering

Admissibility is a static gate only. It does not introduce distinct runtime representations or ABI forms.

### 10.4.7 Diagnostics

| Code         | Severity | Detection    | Condition                                                             |
| ------------ | -------- | ------------ | --------------------------------------------------------------------- |
| `E-TYP-1601` | Error    | Compile-time | Mutation through `const` path                                         |
| `E-TYP-1602` | Error    | Compile-time | `unique` exclusion violation (aliasing or inactive use)               |
| `E-TYP-1603` | Error    | Compile-time | Non-`move` argument with source provenance must be a place expression |
| `E-TYP-1604` | Error    | Compile-time | Direct field mutation through `shared` path without key               |
| `E-TYP-1605` | Error    | Compile-time | Receiver permission incompatible with caller                          |
