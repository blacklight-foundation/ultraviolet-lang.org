---
title: "8.4 Metatheoretic Properties"
description: "8.4 Metatheoretic Properties from 8. Type System Core of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "type-system-core"
specSection: "84-metatheoretic-properties"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/type-system-core/">8. Type System Core</a>
  <span>Type System Core</span>
</div>

## 8.4 Metatheoretic Properties

This subsection states the key metatheoretic properties that the Ultraviolet type system is designed to satisfy. Formal proofs are deferred to supplementary materials.

**(Progress)**
If Γ ⊢ e : T and `e` is not a value, then either:
1. `e` can take a step.
2. `e` is blocked on an external operation.
3. `e` panics.

**(Preservation)**
If Γ ⊢ e : T and `e → e'`, then Γ ⊢ e' : T.

**(No-Use-After-Free)**
A binding in state `Moved` or `PartiallyMoved(F)` where `f ∈ F` cannot be read or moved from.

**(No-Double-Free)**
Each responsible binding is dropped exactly once when it goes out of scope.

**(No-Dangling-Pointers)**
A pointer `Ptr<T>@Valid` always references valid storage. A pointer with provenance `π` cannot escape to storage with longer lifetime `π'` where `π < π'`.

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
