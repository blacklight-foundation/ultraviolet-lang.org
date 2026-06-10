---
title: "8.4 Metatheoretic Properties"
description: "8.4 Metatheoretic Properties from 8. Type System Core of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "type-system-core"
specSection: "84-metatheoretic-properties"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/type-system-core/">8. Type System Core</a>
  <span>Type System Core</span>
</div>

## 8.4 Metatheoretic Properties

This subsection defines the step relation over which the metatheoretic properties are stated, then states the key properties that the Ultraviolet type system is designed to satisfy. Formal proofs are deferred to supplementary materials.

**The Step Relation.**

$$
\begin{array}{l}
\mathsf{Frame}\ =\ \langle \mathsf{ctor},\ \mathsf{vs},\ \mathsf{es}\rangle \\[0.16em]
\ \mathsf{where}\ \mathsf{ctor}\ \mathsf{is}\ \mathsf{an}\ \mathsf{expression}\ \mathsf{constructor}\ \mathsf{of}\ \mathsf{arity}\ \mid \mathsf{vs}\mid \ +\ 1\ +\ \mid \mathsf{es}\mid , \\[0.16em]
\quad \mathsf{vs}\ \mathsf{are}\ \mathsf{already}-\mathsf{evaluated}\ \mathsf{operand}\ \mathsf{values}\ (\mathsf{left}\ \mathsf{of}\ \mathsf{the}\ \mathsf{hole}), \\[0.16em]
\quad \mathsf{es}\ \mathsf{are}\ \mathsf{pending}\ \mathsf{operand}\ \mathsf{expressions}\ (\mathsf{right}\ \mathsf{of}\ \mathsf{the}\ \mathsf{hole}), \\[0.16em]
\quad \mathsf{and}\ \mathsf{operand}\ \mathsf{order}\ \mathsf{is}\ \mathsf{Children}_{\mathsf{LTR}}\ (\S 24.7.7) \\[0.16em]
\mathsf{ScopeFrame}\ =\ \mathsf{the}\ \mathsf{block},\ \mathsf{key},\ \mathsf{region},\ \mathsf{and}\ \mathsf{frame}\ \mathsf{configurations}\ \mathsf{of}\ \mathsf{ExecState}\ (\S 18.1.5,\ \S 18.7.5,\ \S 18.8.5,\ \S 19.2.5) \\[0.16em]
K\ =\ [\mathsf{Frame}\ \mid \ \mathsf{ScopeFrame}]\quad (\mathsf{continuation}\ \mathsf{stack},\ \mathsf{innermost}\ \mathsf{first}) \\[0.16em]
\mathsf{Config}\ =\ \langle \mathsf{Focus},\ K,\ \sigma \rangle \quad \mathsf{Focus}\ \in \ \mathsf{Expr}\ \cup \ \{\operatorname{Done}(\mathsf{out})\}\quad \mathsf{out}\ \in \ \{\operatorname{Val}(v),\ \operatorname{Ctrl}(\kappa )\}
\end{array}
$$

**(Step-Focus-Down)**

$$
\begin{array}{l}
e\ =\ \operatorname{ctor}(e_{1},\ \ldots ,\ e_{n})\quad n\ \ge \ 1\quad \lnot \ \operatorname{Redex}(e)\quad e_{1}\ \mathsf{not}\ a\ \mathsf{value} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle e,\ K,\ \sigma \rangle \ \to \ \langle e_{1},\ \langle \mathsf{ctor},\ [],\ [e_{2},\ \ldots ,\ e_{n}]\rangle \ \mathbin{::} \ K,\ \sigma \rangle
\end{array}
$$

**(Step-Focus-Next)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Done}(\operatorname{Val}(v)),\ \langle \mathsf{ctor},\ \mathsf{vs},\ [e]\ \mathbin{++} \ \mathsf{es}\rangle \ \mathbin{::} \ K,\ \sigma \rangle \ \to \ \langle e,\ \langle \mathsf{ctor},\ \mathsf{vs}\ \mathbin{++} \ [v],\ \mathsf{es}\rangle \ \mathbin{::} \ K,\ \sigma \rangle
\end{array}
$$

**(Step-Redex)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigmaBase}(\operatorname{ctor}(v_{1},\ \ldots ,\ v_{n}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Done}(\operatorname{Val}(v_{n})),\ \langle \mathsf{ctor},\ [v_{1},\ \ldots ,\ v\_\{n-1\}],\ []\rangle \ \mathbin{::} \ K,\ \sigma \rangle \ \to \ \langle \operatorname{Done}(\mathsf{out}),\ K,\ \sigma '\rangle
\end{array}
$$

**(Step-Ctrl-Unwind)**
F is a Frame (not a ScopeFrame)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Done}(\operatorname{Ctrl}(\kappa )),\ F\ \mathbin{::} \ K,\ \sigma \rangle \ \to \ \langle \operatorname{Done}(\operatorname{Ctrl}(\kappa )),\ K,\ \sigma \rangle
\end{array}
$$

$$
\texttt{Redex(e)}\ \mathsf{holds}\ \mathsf{when}\ \mathsf{every}\ \mathsf{operand}\ \mathsf{position}\ \mathsf{of}\ \texttt{e}\ \mathsf{is}\ a\ \mathsf{value}\ \mathsf{or}\ \texttt{e}\ \mathsf{is}\ a\ \mathsf{leaf}\ \mathsf{form}\ (\mathsf{literals},\ \mathsf{names}).\ \texttt{EvalSigmaBase}\ \mathsf{denotes}\ \mathsf{exactly}\ \mathsf{the}\ \mathsf{base}-\mathsf{case}\ \texttt{EvalSigma}\ \mathsf{and}\ \texttt{ExecSigma}\ \mathsf{rules}\ - \ \mathsf{those}\ \mathsf{whose}\ \mathsf{premises}\ \mathsf{contain}\ \mathsf{no}\ \mathsf{recursive}\ \texttt{EvalSigma}\ \mathsf{on}\ \mathsf{subexpressions}.\ \mathsf{Composite}\ \mathsf{forms}\ \mathsf{with}\ \mathsf{scoped}\ \mathsf{or}\ \mathsf{short}-\mathsf{circuit}\ \mathsf{evaluation}\ (\mathsf{blocks},\ \texttt{if},\ \mathsf{loops},\ \mathsf{calls},\ \mathsf{key},\ \mathsf{region},\ \mathsf{and}\ \mathsf{frame}\ \mathsf{statements},\ \texttt{defer},\ \mathsf{and}\ \mathsf{pattern}\ \mathsf{dispatch})\ \mathsf{do}\ \mathsf{not}\ \mathsf{use}\ \texttt{Step-Focus-Down};\ \mathsf{they}\ \mathsf{push}\ \mathsf{their}\ \mathsf{existing}\ \mathsf{scope}\ \mathsf{configurations}:\ \mathsf{calls}\ \mathsf{push}\ \mathsf{the}\ \mathsf{callee}\ \mathsf{body}\ \mathsf{block}\ \mathsf{via}\ \texttt{BlockEnter},\ \mathsf{and}\ \mathsf{the}\ \texttt{Step-Exec-*}\ \mathsf{rules}\ \mathsf{of}\ \mathsf{Chapters}\ 18\ \mathsf{and}\ 19\ \mathsf{are}\ \mathsf{imported}\ \mathsf{unchanged}\ \mathsf{as}\ \mathsf{steps}\ \mathsf{over}\ \texttt{ScopeFrame}s.\ \texttt{Ctrl(kappa)}\ \mathsf{propagates}\ \mathsf{through}\ \mathsf{value}\ \mathsf{frames}\ \mathsf{by}\ \texttt{Step-Ctrl-Unwind}\ \mathsf{and}\ \mathsf{is}\ \mathsf{intercepted}\ \mathsf{by}\ \mathsf{the}\ \mathsf{innermost}\ \texttt{ScopeFrame}\ \mathsf{whose}\ \mathsf{existing}\ \mathsf{rules}\ \mathsf{handle}\ \mathsf{it}:\ \mathsf{loop}\ \mathsf{frames}\ \mathsf{absorb}\ \texttt{Break}\ \mathsf{and}\ \texttt{Continue};\ \mathsf{cleanup}\ \mathsf{runs}\ \mathsf{per}\ \mathsf{the}\ \texttt{Step-Exec-*-Exit-Ctrl}\ \mathsf{rules}.
$$

$$
\langle e,\ \sigma \rangle \ \to *\ (\mathsf{out},\ \sigma ')\ \Leftrightarrow \ \langle e,\ [],\ \sigma \rangle \ \to *\ \langle \operatorname{Done}(\mathsf{out}),\ [],\ \sigma '\rangle
$$

**(Coherence)** (required metatheorem)

$$
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\ \Leftrightarrow \ \langle e,\ \sigma \rangle \ \to *\ (\mathsf{out},\ \sigma ')
$$

**Config Typing.**

$$
\Gamma ;\ R;\ L\ \vdash \ \langle e,\ K,\ \sigma \rangle \ :\ T\ \mathsf{holds}\ \mathsf{when}\ \Gamma ;\ R;\ L\ \vdash \ e\ :\ T_{e}\ \mathsf{and}\ \texttt{K}\ \mathsf{is}\ a\ \mathsf{well}-\mathsf{typed}\ \mathsf{continuation}\ \mathsf{from}\ \texttt{T\_e}\ \mathsf{to}\ \texttt{T}:\ \mathsf{each}\ \texttt{Frame}'s\ \mathsf{hole}\ \mathsf{type}\ \mathsf{matches}\ \mathsf{the}\ \mathsf{corresponding}\ \mathsf{operand}\ \mathsf{type}\ \mathsf{of}\ \mathsf{its}\ \mathsf{constructor},\ \mathsf{and}\ \texttt{ScopeFrame}s\ \mathsf{type}\ \mathsf{per}\ \mathsf{their}\ \mathsf{owning}\ \mathsf{chapters}.
$$

**(Progress)**
If Γ; R; L ⊢ C : T and C is not ⟨Done(out), [], σ⟩, then C → C' for some C', or C is blocked on a host primitive (§6.2) or a key acquisition (§19.2.5).

**(Preservation)**
If Γ; R; L ⊢ C : T and C → C', then Γ; R; L ⊢ C' : T.

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
