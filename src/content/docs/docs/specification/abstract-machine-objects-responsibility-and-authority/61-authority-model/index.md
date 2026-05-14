---
title: "6.1 Authority Model"
description: "6.1 Authority Model from 6. Abstract Machine, Objects, Responsibility, and Authority of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "abstract-machine-objects-responsibility-and-authority"
specSection: "61-authority-model"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/">6. Abstract Machine, Objects, Responsibility, and Authority</a>
  <span>Abstract Machine, Objects, Responsibility, and Authority</span>
</div>

## 6.1 Authority Model

The language adopts a no ambient authority discipline: observable external effects are possible only through explicit possession and use of capability values.

### 6.1.1 Capability Universe

$$
\mathsf{CapToken}\ =\ \{\mathsf{FileSystem},\ \mathsf{Network},\ \mathsf{HeapAllocator},\ \mathsf{Reactor},\ \mathsf{ExecutionDomain},\ \mathsf{System},\ \mathsf{Time}\}
$$

$$
\mathsf{CapInType}\ :\ \mathsf{Type}\ \to \ \mathcal{P} (\mathsf{CapToken})
$$

$$
\begin{array}{l}
\operatorname{CapInType}(\operatorname{TypePath}([\texttt{Context}]))\ =\ \{\mathsf{FileSystem},\ \mathsf{Network},\ \mathsf{HeapAllocator},\ \mathsf{Reactor},\ \mathsf{ExecutionDomain},\ \mathsf{System},\ \mathsf{Time}\} \\[0.16em]
\operatorname{CapInType}(\operatorname{TypePath}([\texttt{System}]))\ =\ \{\mathsf{System}\} \\[0.16em]
\operatorname{CapInType}(\operatorname{TypeDynamic}([\texttt{FileSystem}]))\ =\ \{\mathsf{FileSystem}\} \\[0.16em]
\operatorname{CapInType}(\operatorname{TypeDynamic}([\texttt{Network}]))\ =\ \{\mathsf{Network}\} \\[0.16em]
\operatorname{CapInType}(\operatorname{TypeDynamic}([\texttt{HeapAllocator}]))\ =\ \{\mathsf{HeapAllocator}\} \\[0.16em]
\operatorname{CapInType}(\operatorname{TypeDynamic}([\texttt{Reactor}]))\ =\ \{\mathsf{Reactor}\} \\[0.16em]
\operatorname{CapInType}(\operatorname{TypeDynamic}([\texttt{ExecutionDomain}]))\ =\ \{\mathsf{ExecutionDomain}\} \\[0.16em]
\operatorname{CapInType}(\operatorname{TypeDynamic}([\texttt{Time}]))\ =\ \{\mathsf{Time}\} \\[0.16em]
\operatorname{CapInType}(\operatorname{TypeDynamic}([\texttt{MonotonicTime}]))\ =\ \{\mathsf{Time}\} \\[0.16em]
\operatorname{CapInType}(\operatorname{TypeDynamic}([\texttt{WallTime}]))\ =\ \{\mathsf{Time}\} \\[0.16em]
\operatorname{CapInType}(\operatorname{TypePerm}(\_,\ T))\ =\ \operatorname{CapInType}(T) \\[0.16em]
\operatorname{CapInType}(\operatorname{TypeTuple}(\mathsf{Ts}))\ =\ \bigcup \{\operatorname{CapInType}(T)\ \mid \ T\ \in \ \mathsf{Ts}\} \\[0.16em]
\operatorname{CapInType}(\operatorname{TypeArray}(T,\ \_))\ =\ \operatorname{CapInType}(T) \\[0.16em]
\operatorname{CapInType}(\operatorname{TypeSlice}(T))\ =\ \operatorname{CapInType}(T)
\end{array}
$$

CapInType(T) distributes structurally over compound nominal, modal, union, and applied types after alias expansion.

Implementations MAY compute `CapInType` by least fixed-point over nominal and alias expansion. Cycles MUST terminate by memoization or an equivalent visited-node strategy.

### 6.1.2 No Ambient Authority Requirements

**(NAA-1) No implicit capability roots.** A conforming implementation MUST NOT provide any implicit or global binding whose type is capability-bearing under `CapInType`.

**(NAA-2) Context as the sole explicit root carrier.** The only capability roots introduced by the abstract machine at runtime are those contained in `Context` values produced by `ContextInitSigma` in §24.4.5 or by `HostSessionInitSigma` in §24.4.4. A conforming implementation MUST introduce those roots only through the executable entry procedure or a hosted-library session created by the sanctioned hosted-library lifecycle.

**(NAA-3) Effect gating.** Any externally observable effect specified by this document MUST occur only as a consequence of calling:
- a runtime host primitive classified in §6.2, or
- a built-in procedure or method whose receiver is a capability value.

$$
\operatorname{CapReq}(d)\ =\ \bigcup \{\operatorname{CapInType}(T_{i})\ \mid \ T_{i}\ \mathsf{is}\ \mathsf{the}\ \mathsf{type}\ \mathsf{of}\ a\ \mathsf{parameter}\ \mathsf{or}\ \mathsf{receiver}\ \mathsf{of}\ \mathsf{declaration}\ d\}
$$

For every direct call from `d_src` to `d_tgt`, a conforming implementation MUST reject the program unless `CapReq(d_tgt) ⊆ CapReq(d_src)`.

### 6.1.3 Attenuation Requirements

The following operations are attenuation operations:
- `$FileSystem::restrict(root)`
- `$Network::restrict_to_host(host)`
- `$HeapAllocator::with_quota(bytes)`
- `CancelToken@Active::child()`
- `Context::cpu()`
- `Context::gpu()`
- `Context::inline()`
- `$Time::monotonic()`
- `$Time::wall()`
- `$MonotonicTime::coarsen(resolution)`
- `$WallTime::coarsen(resolution)`

A conforming implementation MUST ensure attenuation is monotone: a derived capability MUST NOT grant authority beyond the source capability from which it was derived.

For every attenuation operation `ChildCap = ParentCap~>attenuate(...)`, a conforming implementation MUST enforce all of the following:
- `ChildCap` remains operational only while `ParentCap` remains live.
- Dropping `ChildCap` MUST NOT invalidate or diminish `ParentCap`.
- Dropping `ParentCap` while any derived child capability remains live is ill-formed.
- Any runtime delegation performed by `ChildCap` MUST be routed through `ParentCap` or through an equivalent runtime object that enforces an equal-or-stricter authority subset.

### 6.1.4 Observable Behavior and As-If Rule

$$
\begin{array}{l}
\mathsf{ObservableEffect}\ \in \ \{ \\[0.16em]
\ \operatorname{HostEffect}(\mathsf{proc},\ \mathsf{args}), \\[0.16em]
\ \operatorname{FfiEffect}(\mathsf{proc},\ \mathsf{abi},\ \mathsf{dir}), \\[0.16em]
\ \operatorname{PanicEffect}(\mathsf{kind}), \\[0.16em]
\ \operatorname{DropEffect}(\mathsf{target}), \\[0.16em]
\ \operatorname{KeyEffect}(\mathsf{kind},\ \mathsf{paths}) \\[0.16em]
\}
\end{array}
$$

An event is observable iff it is:
- a runtime host-primitive action from `HostPrimRuntime`;
- transfer across an FFI boundary;
- panic initiation, panic-to-abort escalation, or a caught-unwind boundary result;
- invocation of drop cleanup for a responsible value or static;
- key acquisition, key release, or ordered key-block commit.

The observable behavior of an execution is the ordered trace of its observable events together with its final outcome in `{normal, panic, abort}`.

A conforming implementation MAY apply any transformation whose executions preserve all of the following:
- the same observable-event trace at every sequence point;
- the same relative order of drop actions required by `CleanupScope`, `Unwind`, and `Destroy`;
- the same relative order of capability-mediated host effects and FFI-boundary effects induced by the source semantics;
- the same panic, non-panic, and abort outcomes, including the same `[[unwind]]` boundary behavior;
- the same key-acquisition, key-release, and ordered-commit behavior required by Chapter `19`;
- the same permission, provenance, and responsibility facts required by Chapters `6`, `10`, `18`, `23`, and `24`.

In particular, a conforming implementation MUST NOT:
- eliminate, duplicate, or reorder observable events;
- suppress or invent any `Drop` action required by the cleanup rules;
- reorder host effects or FFI-boundary effects across sequence points;
- transform a panicking execution into a non-panicking execution, or the reverse;
- introduce behavior that violates the key system, provenance rules, or no-ambient-authority rules.

### 6.1.5 Sequence Points

A sequence point is a program point at which:
- all observable effects sequenced before that point are complete;
- no observable effect sequenced after that point has begun; and
- binding-state, provenance, and key-holding state are determined by the rules of the owning chapters.

The canonical sequence points are:
- after each terminated statement;
- after receiver and argument evaluation and before control enters the callee of a call or method call;
- after the left operand of `&&` and `||` and before any right-operand evaluation that follows;
- after the condition of `if` and before the selected branch;
- after the scrutinee of `if ... is` and before pattern selection or selected-body evaluation;
- after key-path evaluation and before a key block acquires or commits keys;
- immediately before scope cleanup begins on ordinary scope exit, `return`, `break`, `continue`, panic unwinding, and FFI-boundary unwinding.

`Children_LTR` in §24.7.7 defines left-to-right subexpression order inside a segment between adjacent sequence points. A conforming implementation MUST preserve that order unless an equivalent transformation preserves the same observable behavior and the same sequence-point boundaries.

### 6.1.6 Unsafe and Foreign Interaction

The no-ambient-authority requirements constrain the safe execution model. `unsafe` operations and the foreign-function interface MAY escape these constraints by design, but capability isolation still applies. See §23.5.
