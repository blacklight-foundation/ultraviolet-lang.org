---
title: "6.1 Authority Model"
description: "6.1 Authority Model from 6. Abstract Machine, Objects, Responsibility, and Authority of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "abstract-machine-objects-responsibility-and-authority"
specSection: "61-authority-model"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/">6. Abstract Machine, Objects, Responsibility, and Authority</a>
  <span>Abstract Machine, Objects, Responsibility, and Authority</span>
</div>

## 6.1 Authority Model

The language adopts a no ambient authority discipline: observable external effects are possible only through explicit possession and use of capability values.

### 6.1.1 Capability Universe

$$
\mathsf{BuiltinCapabilityClass}\ =\ \{\mathsf{IO},\ \mathsf{Network},\ \mathsf{HeapAllocator},\ \mathsf{Reactor},\ \mathsf{ExecutionDomain},\ \mathsf{System},\ \mathsf{Time},\ \mathsf{MonotonicTime},\ \mathsf{WallTime}\}
$$

$$
\operatorname{CapClass}(p)\ \Leftrightarrow \ p\ \in \ \mathsf{BuiltinCapabilityClass}\ \lor \ (\operatorname{ClassDecl}(p)\ =\ C\ \land \ \exists \ B\ \in \ \operatorname{SuperclassPaths}(C).\ \operatorname{CapClass}(B))
$$

$$
\mathsf{CapabilityClass}\ =\ \{\ p\ \mid \ \operatorname{CapClass}(p)\ \}
$$

Capability classes are ordinary classes. A user class that declares a capability superclass via `<:` is a capability class; the built-in classes above are the root capability classes.

$$
\begin{array}{l}
\mathsf{CapInType}\ :\ \mathsf{Type}\ \to \ \mathcal{P} (\mathsf{CapabilityClass}) \\[0.16em]
\mathsf{EffectiveCaps}\ :\ \mathsf{Type}\ \to \ \mathcal{P} (\mathsf{CapabilityClass})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{CapInType}(\operatorname{TypePath}([\texttt{Context}]))\ =\ \{\mathsf{IO},\ \mathsf{Network},\ \mathsf{HeapAllocator},\ \mathsf{Reactor},\ \mathsf{ExecutionDomain},\ \mathsf{System},\ \mathsf{Time}\} \\[0.16em]
\operatorname{CapInType}(\operatorname{TypeDynamic}([p]))\ =\ \{p\}\quad \mathsf{if}\ \operatorname{CapClass}(p) \\[0.16em]
\operatorname{CapInType}(\operatorname{TypeDynamic}([p]))\ =\ \emptyset \quad \mathsf{if}\ \lnot \ \operatorname{CapClass}(p) \\[0.16em]
\operatorname{CapInType}(\operatorname{TypePerm}(\_,\ T))\ =\ \operatorname{CapInType}(T) \\[0.16em]
\operatorname{CapInType}(\operatorname{TypeTuple}(\mathsf{Ts}))\ =\ \bigcup \{\operatorname{CapInType}(T)\ \mid \ T\ \in \ \mathsf{Ts}\} \\[0.16em]
\operatorname{CapInType}(\operatorname{TypeArray}(T,\ \_))\ =\ \operatorname{CapInType}(T) \\[0.16em]
\operatorname{CapInType}(\operatorname{TypeSlice}(T))\ =\ \operatorname{CapInType}(T)
\end{array}
$$

CapInType(T) distributes structurally over compound nominal, modal, union, and applied types after alias expansion.

Implementations MAY compute `CapInType` by least fixed-point over nominal and alias expansion. Cycles MUST terminate by memoization or an equivalent visited-node strategy.

$$
\operatorname{CapUp}(c)\ =\ \{c\}\ \cup \ \bigcup \{\ \operatorname{CapUp}(B)\ \mid \ \operatorname{ClassDecl}(c)\ =\ C\ \land \ B\ \in \ \operatorname{SuperclassPaths}(C)\ \land \ \operatorname{CapClass}(B)\ \}
$$

$$
\begin{array}{l}
\operatorname{CapDerive}(c)\ =\ \{c\}\ \cup \ \operatorname{DeriveSet}(c) \\[0.16em]
\operatorname{DeriveSet}(\mathsf{Time})\ =\ \{\mathsf{MonotonicTime},\ \mathsf{WallTime}\} \\[0.16em]
\operatorname{DeriveSet}(c)\ =\ \emptyset \quad \mathsf{for}\ \mathsf{every}\ \mathsf{other}\ \mathsf{built}-\mathsf{in}\ \mathsf{capability}\ \mathsf{class} \\[0.16em]
\operatorname{DeriveSet}(c)\ =\ \bigcup \{\ \operatorname{CapDerive}(c')\ \mid \ c'\ \in \ \operatorname{CapResultClasses}(c)\ \}\quad \mathsf{for}\ \mathsf{user}\ \mathsf{capability}\ \mathsf{classes} \\[0.16em]
\operatorname{CapResultClasses}(c)\ =\ \{\ p\ \mid \ \operatorname{CapClass}(p)\ \land \ \operatorname{TypeDynamic}([p])\ \mathsf{occurs}\ \mathsf{in}\ a\ \mathsf{method}\ \mathsf{result}\ \mathsf{type}\ \mathsf{of}\ \operatorname{ClassDecl}(c)\ \}
\end{array}
$$

$$
\operatorname{EffectiveCaps}(T)\ =\ \bigcup \{\ \operatorname{CapUp}(c)\ \cup \ \operatorname{CapDerive}(c)\ \mid \ c\ \in \ \operatorname{CapInType}(T)\ \}
$$

`CapUp` makes a derived capability satisfy requirements stated against its capability ancestors. `CapDerive` grants what a class's own interface can mint; it generalizes the built-in `Time` derivation of `MonotonicTime` and `WallTime`. Both close under the same least-fixed-point strategy as `CapInType`.

### 6.1.2 No Ambient Authority Requirements

**(NAA-1) No implicit capability roots.** A conforming implementation MUST NOT provide any implicit or global binding whose type is capability-bearing under `CapInType`.

**(NAA-2) Context as the sole explicit root carrier.** The only capability roots introduced by the abstract machine at runtime are those contained in `Context` values produced by `ContextInitSigma` in §24.4.5 or by `HostSessionInitSigma` in §24.4.4. A conforming implementation MUST introduce those roots only through the executable entry procedure or a hosted-library session created by the sanctioned hosted-library lifecycle.

**(NAA-3) Effect gating.** Any externally observable effect specified by this document MUST occur only as a consequence of calling:
- a runtime host primitive classified in §6.2, or
- a built-in procedure or method whose receiver is a capability value.

$$
\begin{array}{l}
\operatorname{CapReq}(d)\ =\ \bigcup \{\operatorname{CapInType}(T_{i})\ \mid \ T_{i}\ \mathsf{is}\ \mathsf{the}\ \mathsf{type}\ \mathsf{of}\ a\ \mathsf{parameter}\ \mathsf{or}\ \mathsf{receiver}\ \mathsf{of}\ \mathsf{declaration}\ d\} \\[0.16em]
\operatorname{EffectiveCapReq}(d)\ =\ \bigcup \{\operatorname{EffectiveCaps}(T_{i})\ \mid \ T_{i}\ \mathsf{is}\ \mathsf{the}\ \mathsf{type}\ \mathsf{of}\ a\ \mathsf{parameter}\ \mathsf{or}\ \mathsf{receiver}\ \mathsf{of}\ \mathsf{declaration}\ d\}
\end{array}
$$

For every direct call from `d_src` to `d_tgt`, a conforming implementation MUST reject the program unless `CapReq(d_tgt) ⊆ EffectiveCapReq(d_src)`.

**(NAA-4) User capabilities confer no new root authority.** Constructing a value of a user-defined capability class requires no ambient grant. A user-defined capability class confers authority only through the built-in capability values it encapsulates; every externally observable effect remains gated by NAA-3. Values of user-defined capability classes are subject to the attenuation requirements of §6.1.3 with respect to the capability values they encapsulate.

### 6.1.3 Attenuation Requirements

The following operations are attenuation operations:
- `$IO::restrict(root)`
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
- the same panic, non-panic, and abort outcomes, including the same `#unwind` boundary behavior;
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
