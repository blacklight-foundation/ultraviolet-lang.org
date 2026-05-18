---
title: "10.1 Permission Forms"
description: "10.1 Permission Forms from 10. Permissions and Binding State of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "permissions-and-binding-state"
specSection: "101-permission-forms"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/permissions-and-binding-state/">10. Permissions and Binding State</a>
  <span>Permissions and Binding State</span>
</div>

## 10.1 Permission Forms

### 10.1.1 Syntax

```text
permission         ::= "const" | "unique" | "shared"
receiver_shorthand ::= "~" | "~!" | "~%"
```

Permission qualifiers appear in `type ::= permission? non_permission_type refinement_clause?`. Receiver shorthand forms map to receiver permissions as defined by the parser and AST rules in Chapter 5.

### 10.1.2 Parsing

Permission tokens are parsed by `ParsePermOpt` in type position and by `ParseReceiver` in receiver position.

The canonical `ParseReceiver` rules are the token-gated parsing rules in §15.2.2. This section owns only the permission-specific token inventory consumed by those rules.

### 10.1.3 AST Representation / Form

Permission syntax lowers into the following AST forms:

- `Perm` ranges over `{const, unique, shared}`.
- `TypePerm(perm, base)`
- `ReceiverShorthand(perm)`

A permission-qualified type is represented as `TypePerm(P, T)` where `P ∈ Perm` and `T` is the unqualified base type.

### 10.1.4 Static Semantics

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

### 10.1.5 Dynamic Semantics

Permissions do not change the represented value of the underlying object.

- `const` introduces no additional runtime action.
- `unique` introduces no implicit cleanup transfer.
- `shared` access performs implicit key acquisition and release as defined by the key system in Chapter 19.

### 10.1.6 Lowering

Permission qualifiers do not alter value layout:

**(Layout-Perm)**

$$
\Gamma \ \vdash \ \operatorname{layout}(\operatorname{TypePerm}(p,\ T))\ \Downarrow \ L
$$

**(SizeOf-Perm)**

$$
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypePerm}(p,\ T))\ =\ n
$$

**(AlignOf-Perm)**

$$
\Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypePerm}(p,\ T))\ =\ a
$$

ABI and LLVM lowering for permission-qualified types are defined by the shared lowering and ABI framework in Chapter 24.

### 10.1.7 Diagnostics

This section introduces no additional feature-local diagnostics beyond the use-site diagnostics defined by §10.4 and the consuming typing rules.
