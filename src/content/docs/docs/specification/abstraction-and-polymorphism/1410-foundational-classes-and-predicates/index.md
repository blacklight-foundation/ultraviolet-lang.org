---
title: "14.10 Foundational Classes and Predicates"
description: "14.10 Foundational Classes and Predicates from 14. Abstraction and Polymorphism of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "abstraction-and-polymorphism"
specSection: "1410-foundational-classes-and-predicates"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/abstraction-and-polymorphism/">14. Abstraction and Polymorphism</a>
  <span>Abstraction and Polymorphism</span>
</div>

## 14.10 Foundational Classes and Predicates

### 14.10.1 Syntax

Foundational classes use ordinary class syntax from §14.3. The foundational names `Bitcopy`, `Clone`, `Drop`, `FfiSafe`, `Eq`, `Hasher`, `Hash`, `Iterator`, and `Step` are reserved.

### 14.10.2 Parsing

Foundational classes and predicates have no feature-specific parse form beyond ordinary class parsing and predicate-requirement parsing from §14.1.

### 14.10.3 AST Representation / Form

$$
\mathsf{FoundationalClassName}\ =\ \{\texttt{Bitcopy},\ \texttt{Clone},\ \texttt{Drop},\ \texttt{FfiSafe},\ \texttt{Eq},\ \texttt{Hasher},\ \texttt{Hash},\ \texttt{Iterator},\ \texttt{Step}\}
$$

$$
\begin{array}{l}
\mathsf{BitcopyDropJudg}\ =\ \{\Gamma \ \vdash \ T\ :\ \mathsf{BitcopyDropOk}\} \\[0.16em]
\mathsf{BitcopyJudg}\ =\ \{\mathsf{BitcopyType}\} \\[0.16em]
\mathsf{CloneJudg}\ =\ \{\mathsf{CloneType}\} \\[0.16em]
\mathsf{DropJudg}\ =\ \{\mathsf{DropType}\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{HasCloneMethod}(T)\ \Leftrightarrow \ \exists \ p,\ R,\ m.\ T\ =\ \operatorname{TypePath}(p)\ \land \ \operatorname{RecordDecl}(p)\ =\ R\ \land \ m\ \in \ \operatorname{Methods}(R)\ \land \ \operatorname{MethodName}(m)\ =\ \texttt{clone}\ \land \ \operatorname{Sig_T}(T,\ m)\ =\ \langle \operatorname{TypePerm}(\texttt{const},\ T),\ [],\ T\rangle  \\[0.16em]
\operatorname{HasDropMethod}(T)\ \Leftrightarrow \ \exists \ p,\ R,\ m.\ T\ =\ \operatorname{TypePath}(p)\ \land \ \operatorname{RecordDecl}(p)\ =\ R\ \land \ m\ \in \ \operatorname{Methods}(R)\ \land \ \operatorname{MethodName}(m)\ =\ \texttt{drop}\ \land \ \operatorname{Sig_T}(T,\ m)\ =\ \langle \operatorname{TypePerm}(\texttt{unique},\ T),\ [],\ \operatorname{TypePrim}(\texttt{"()"})\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{CloneType}(T)\ \Leftrightarrow \ \operatorname{BuiltinCloneType}(T)\ \lor \ \operatorname{HasCloneMethod}(\operatorname{StripPerm}(T))\ \lor \ \operatorname{BitcopyType}(T) \\[0.16em]
\operatorname{DropType}(T)\ \Leftrightarrow \ \operatorname{BuiltinDropType}(T)\ \lor \ \operatorname{HasDropMethod}(\operatorname{StripPerm}(T))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BuiltinStepType}(T)\ \Leftrightarrow \ \operatorname{StripPerm}(T)\ =\ \operatorname{TypePrim}(t)\ \land \ t\ \in \ \mathsf{IntTypes}\ \cup \ \mathsf{UnsignedIntTypes}\ \cup \ \{\texttt{char}\} \\[0.16em]
\operatorname{ImplementsEq}(T)\ \Leftrightarrow \ \operatorname{EqType}(T)\ \lor \ \texttt{Eq}\ \in \ \operatorname{Implements}(T) \\[0.16em]
\operatorname{ImplementsHash}(T)\ \Leftrightarrow \ \texttt{Hash}\ \in \ \operatorname{Implements}(T) \\[0.16em]
\operatorname{ImplementsIterator}(T)\ \Leftrightarrow \ \texttt{Iterator}\ \in \ \operatorname{Implements}(T) \\[0.16em]
\operatorname{ImplementsStep}(T)\ \Leftrightarrow \ \operatorname{BuiltinStepType}(T)\ \lor \ \texttt{Step}\ \in \ \operatorname{Implements}(T) \\[0.16em]
\operatorname{ImplementsHasher}(T)\ \Leftrightarrow \ \texttt{Hasher}\ \in \ \operatorname{Implements}(T)
\end{array}
$$

### 14.10.4 Static Semantics

Foundational class bounds for `Bitcopy`, `Clone`, `Drop`, and `FfiSafe` are interpreted by intrinsic satisfaction judgments, not by user-defined class implementation lookup. `Eq` is satisfied intrinsically when `EqType(T)` holds. `Step` is satisfied intrinsically when `BuiltinStepType(T)` holds. Other `Eq` and `Step` obligations are discharged through ordinary class implementation lookup.

**(BitcopyDrop-Ok)**

$$
\begin{array}{l}
\lnot (\operatorname{BitcopyType}(T)\ \land \ \operatorname{DropType}(T)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{BitcopyDropOk}
\end{array}
$$

**(BitcopyDrop-Conflict)**

$$
\begin{array}{l}
\operatorname{BitcopyType}(T)\ \land \ \operatorname{DropType}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{BitcopyDropOk}\ \Uparrow 
\end{array}
$$

$$
\operatorname{BitcopyType}(T)\ \Leftrightarrow \ \operatorname{BitcopyTypeCore}(T)
$$

$$
\begin{array}{l}
\operatorname{BitcopyTypeCore}(T)\ \Leftrightarrow  \\[0.16em]
\ \mathsf{false}\quad \mathsf{if}\ T\ =\ \operatorname{TypePerm}(\texttt{unique},\ \_) \\[0.16em]
\ \operatorname{BitcopyTypeCore}(T_{0})\quad \mathsf{if}\ T\ =\ \operatorname{TypePerm}(p,\ T_{0})\ \land \ p\ \ne \ \texttt{unique} \\[0.16em]
\ \operatorname{BuiltinBitcopyType}(T)\ \lor  \\[0.16em]
\ (T\ =\ \operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}])\ \land \ \forall \ i\ \in \ 1..n,\ \operatorname{BitcopyType}(T_{i}))\ \lor  \\[0.16em]
\ (T\ =\ \operatorname{TypeArray}(T_{0},\ e)\ \land \ \Gamma \ \vdash \ \operatorname{ConstLen}(e)\ \Downarrow \ \_\ \land \ \operatorname{BitcopyType}(T_{0}))\ \lor  \\[0.16em]
\ (T\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\ \land \ \forall \ i\ \in \ 1..n,\ \operatorname{BitcopyType}(T_{i}))\ \lor  \\[0.16em]
\ (T\ =\ \operatorname{TypePath}(p)\ \land \ \operatorname{RecordDecl}(p)\ =\ R\ \land \ \forall \ f\ :\ T_{f}\ \in \ \operatorname{Fields}(R).\ \operatorname{BitcopyType}(T_{f}))\ \lor  \\[0.16em]
\ (T\ =\ \operatorname{TypePath}(p)\ \land \ \operatorname{EnumDecl}(p)\ =\ E\ \land \ \forall \ v\ \in \ \operatorname{Variants}(E).\ \forall \ T_{f}\ \in \ \operatorname{PayloadTypes}(v).\ \operatorname{BitcopyType}(T_{f}))\ \lor  \\[0.16em]
\ (T\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\ \land \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ \forall \ T_{f}\ \in \ \operatorname{ModalPayload}(\mathsf{modal}_{\mathsf{ref}},\ S).\ \operatorname{BitcopyType}(T_{f}))\ \lor  \\[0.16em]
\ (T\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\ \land \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ \forall \ S\ \in \ \operatorname{States}(M).\ \forall \ T_{f}\ \in \ \operatorname{ModalPayload}(\mathsf{modal}_{\mathsf{ref}},\ S).\ \operatorname{BitcopyType}(T_{f}))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BuiltinBitcopyType}(T)\ \Leftrightarrow  \\[0.16em]
\ T\ =\ \operatorname{TypePrim}(t)\ \land \ t\ \in \ \mathsf{PrimTypeNames}\ \lor  \\[0.16em]
\ T\ =\ \operatorname{TypePtr}(U,\ s)\ \lor  \\[0.16em]
\ T\ =\ \operatorname{TypeRawPtr}(q,\ U)\ \lor  \\[0.16em]
\ T\ =\ \operatorname{TypeSlice}(U)\ \lor  \\[0.16em]
\ T\ =\ \operatorname{TypeFunc}(\mathsf{ps},\ R)\ \lor  \\[0.16em]
\ T\ =\ \operatorname{TypeDynamic}(\mathsf{Cl})\ \lor  \\[0.16em]
\ (T\ =\ \operatorname{TypeRange}(U)\ \land \ \operatorname{BitcopyType}(U))\ \lor  \\[0.16em]
\ (T\ =\ \operatorname{TypeRangeInclusive}(U)\ \land \ \operatorname{BitcopyType}(U))\ \lor  \\[0.16em]
\ (T\ =\ \operatorname{TypeRangeFrom}(U)\ \land \ \operatorname{BitcopyType}(U))\ \lor  \\[0.16em]
\ (T\ =\ \operatorname{TypeRangeTo}(U)\ \land \ \operatorname{BitcopyType}(U))\ \lor  \\[0.16em]
\ (T\ =\ \operatorname{TypeRangeToInclusive}(U)\ \land \ \operatorname{BitcopyType}(U))\ \lor  \\[0.16em]
\ T\ =\ \mathsf{TypeRangeFull}\ \lor  \\[0.16em]
\ T\ =\ \operatorname{TypeString}(\texttt{@View})\ \lor  \\[0.16em]
\ T\ =\ \operatorname{TypeBytes}(\texttt{@View})\ \lor  \\[0.16em]
\ T\ =\ \operatorname{TypePath}([\texttt{"FileKind"}])\ \lor  \\[0.16em]
\ T\ =\ \operatorname{TypePath}([\texttt{"IoError"}])\ \lor  \\[0.16em]
\ T\ =\ \operatorname{TypePath}([\texttt{"Context"}])\ \lor  \\[0.16em]
\ T\ =\ \operatorname{TypePath}([\texttt{"System"}])
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BuiltinDropType}(T)\ \Leftrightarrow \ T\ =\ \operatorname{TypeString}(\texttt{@Managed})\ \lor \ T\ =\ \operatorname{TypeBytes}(\texttt{@Managed}) \\[0.16em]
\operatorname{BuiltinCloneType}(T)\ \Leftrightarrow \ \operatorname{BuiltinBitcopyType}(T)
\end{array}
$$

The built-in class signatures are:

- `Eq`: `eq(~, other: const Self) -> bool`
- `Hasher`: `write(~!, data: bytes@View) -> ()`; `finish(~) -> u64`
- `Hash`: `hash(~, hasher: unique Hasher) -> ()`
- `Iterator`: associated type `Item`; `next(~!) -> Self::Item | ()`
- `Step`: `successor(~) -> Self | ()`; `predecessor(~) -> Self | ()`

`Eq::eq` MUST be reflexive, symmetric, and transitive.

`Hash` implementations MUST also implement `Eq`, and equal values MUST produce equal hash results when hashed from identical initial hasher states.

$$
\texttt{Iterator::next}\ \mathsf{returns}\ \texttt{Self::Item}\ \mathsf{while}\ \mathsf{iteration}\ \mathsf{remains},\ \mathsf{or}\ \texttt{()}\ \mathsf{when}\ \mathsf{exhausted}.
$$

$$
\texttt{Step::successor}\ \mathsf{and}\ \texttt{Step::predecessor}\ \mathsf{define}\ a\ \mathsf{discrete}\ \mathsf{stepping}\ \mathsf{relation}\ \mathsf{and}\ \mathsf{are}\ \mathsf{partial}\ \mathsf{inverses}\ \mathsf{when}\ \mathsf{both}\ \mathsf{are}\ \mathsf{defined}.
$$

### 14.10.5 Dynamic Semantics

Scope exit runs the cleanup actions for bindings that still own their provenance/allocation domain. A moved-out binding has transferred that domain and is skipped at its original scope exit. At the final owning scope exit, `drop` is invoked when `DropType(T)` holds, owned children are cleaned in reverse construction order, and the provenance/allocation domain is released. For types without `drop`, no type-specific destructor is invoked; domain release still occurs, and cleanup is a no-op when the value has no owned children and no domain storage to release.

`copy e` is the explicit object-duplication operation. It requires `BitcopyType(ExprType(e))`, duplicates the object bits, and materializes a fresh provenance/allocation domain for the duplicate. The original value and its cleanup responsibility remain with the original owner.

`clone` on a `BitcopyType` value is equivalent to `copy` for the value-level duplication it performs.

`Hasher` maintains an internal `u64` state. `write` appends bytes to the input stream. `finish` returns the FNV-1a 64-bit hash of the concatenated byte stream using `FNVOffset64` and `FNVPrime64`.

For `BuiltinStepType(T)` with `StripPerm(T) = TypePrim(t)` and `t ∈ IntTypes ∪ UnsignedIntTypes`, `Step::successor` returns the least representable value greater than the receiver when one exists, or `()` otherwise; `Step::predecessor` returns the greatest representable value smaller than the receiver when one exists, or `()` otherwise.

For `BuiltinStepType(T)` with `StripPerm(T) = TypePrim(`char`)`, `Step::successor` returns `CharVal(u')` where `u' = min { v ∈ UnicodeScalar | v > u }` for receiver `CharVal(u)` when such `u'` exists, or `()` otherwise; `Step::predecessor` returns `CharVal(u')` where `u' = max { v ∈ UnicodeScalar | v < u }` when such `u'` exists, or `()` otherwise.

### 14.10.6 Lowering

$$
\texttt{Eq::eq}\ \mathsf{on}\ \texttt{EqType(T)}\ \mathsf{lowers}\ \mathsf{intrinsically}\ \mathsf{to}\ \mathsf{the}\ \mathsf{built}-\mathsf{in}\ \mathsf{equality}\ \mathsf{relation}\ \mathsf{for}\ \texttt{T}.\ \texttt{Step::successor}\ \mathsf{and}\ \texttt{Step::predecessor}\ \mathsf{on}\ \texttt{BuiltinStepType(T)}\ \mathsf{lower}\ \mathsf{intrinsically}\ \mathsf{to}\ \mathsf{the}\ \mathsf{built}-\mathsf{in}\ \mathsf{stepping}\ \mathsf{relation}\ \mathsf{for}\ \texttt{T}.\ \mathsf{Other}\ \texttt{Eq}\ \mathsf{and}\ \texttt{Step}\ \mathsf{calls}\ \mathsf{lower}\ \mathsf{through}\ \mathsf{ordinary}\ \mathsf{method}-\mathsf{call}\ \mathsf{lowering}.
$$

These predicates and built-in classes do not introduce a separate representation. They influence lowering indirectly through copy semantics, drop-glue generation, built-in `Eq`/`Step` call selection, and whether a dynamic-class-object vtable header carries a non-null drop entry.

### 14.10.7 Diagnostics

Diagnostics are defined for types that simultaneously satisfy `BitcopyType` and `DropType`, and for direct user calls to the implicit `drop` protocol on types where destruction is reserved to the language runtime.
