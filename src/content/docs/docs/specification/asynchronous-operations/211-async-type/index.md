---
title: "21.1 Async Type"
description: "21.1 Async Type from 21. Asynchronous Operations of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "asynchronous-operations"
specSection: "211-async-type"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/asynchronous-operations/">21. Asynchronous Operations</a>
  <span>Asynchronous Operations</span>
</div>

## 21.1 Async Type

### 21.1.1 Syntax

This section introduces no additional concrete type grammar beyond ordinary type-application syntax and modal-state type syntax.

The following built-in async type constructors and aliases are reserved:

- `Async<Out, In, Result, E>`
- `Sequence<T>`
- `Future<T, E>`
- `Stream<T, E>`
- `Pipe<In, Out>`
- `Exchange<T>`

Parameter defaults are applied by `AsyncSig` in §21.1.4.

The following built-in async states are reserved and use ordinary modal-state type syntax:

- `Async@Suspended`
- `Async@Completed`
- `Async@Failed`

### 21.1.2 Parsing

`Async`, `Sequence`, `Future`, `Stream`, `Pipe`, and `Exchange` use ordinary path and type-application parsing.

`Async@Suspended`, `Async@Completed`, and `Async@Failed` use ordinary modal-state type parsing.

`TypePath(["Async"])` MAY be parsed by the general type parser; rejection of unapplied `Async` is a static-semantic rule of this section.

### 21.1.3 AST Representation / Form

`Async` is a built-in modal declaration:

$$
\begin{array}{l}
\operatorname{States}(\texttt{Async})\ =\ \{\ \texttt{@Suspended},\ \texttt{@Completed},\ \texttt{@Failed}\ \} \\[0.16em]
\mathsf{AsyncParams}\ =\ [ \\[0.16em]
\ \langle \texttt{Out},\ [],\ \bot ,\ \bot \rangle , \\[0.16em]
\ \langle \texttt{In},\ [],\ \operatorname{TypePrim}(\texttt{"()"}),\ \bot \rangle , \\[0.16em]
\ \langle \texttt{Result},\ [],\ \operatorname{TypePrim}(\texttt{"()"}),\ \bot \rangle , \\[0.16em]
\ \langle \texttt{E},\ [],\ \operatorname{TypePrim}(\texttt{"!"}),\ \bot \rangle  \\[0.16em]
] \\[0.16em]
\mathsf{AsyncRef}\ =\ \operatorname{TypeApply}([\texttt{"Async"}],\ [\operatorname{TypePath}([\texttt{"Out"}]),\ \operatorname{TypePath}([\texttt{"In"}]),\ \operatorname{TypePath}([\texttt{"Result"}]),\ \operatorname{TypePath}([\texttt{"E"}])]) \\[0.16em]
\mathsf{AsyncSuspendedFields}\ =\ [\langle \texttt{output},\ \operatorname{TypePath}([\texttt{"Out"}])\rangle ] \\[0.16em]
\mathsf{AsyncCompletedFields}\ =\ [\langle \texttt{value},\ \operatorname{TypePath}([\texttt{"Result"}])\rangle ] \\[0.16em]
\mathsf{AsyncFailedFields}\ =\ [\langle \texttt{error},\ \operatorname{TypePath}([\texttt{"E"}])\rangle ] \\[0.16em]
\operatorname{Payload}(\texttt{Async},\ \texttt{@Suspended})\ =\ \mathsf{AsyncSuspendedFields} \\[0.16em]
\operatorname{Payload}(\texttt{Async},\ \texttt{@Completed})\ =\ \mathsf{AsyncCompletedFields} \\[0.16em]
\operatorname{Payload}(\texttt{Async},\ \texttt{@Failed})\ =\ \mathsf{AsyncFailedFields} \\[0.16em]
\mathsf{AsyncSuspendedMembers}\ =\ [ \\[0.16em]
\ \operatorname{StateFieldDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{output},\ \operatorname{TypePath}([\texttt{"Out"}]),\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{StateMethodDecl}( \\[0.16em]
\quad \bot , \\[0.16em]
\quad \texttt{public}, \\[0.16em]
\quad \texttt{"resume"}, \\[0.16em]
\quad \bot , \\[0.16em]
\quad \operatorname{ReceiverShorthand}(\texttt{unique}), \\[0.16em]
\quad [\langle \bot ,\ \texttt{input},\ \operatorname{TypePath}([\texttt{"In"}])\rangle ], \\[0.16em]
\quad \operatorname{TypeUnion}([ \\[0.16em]
\quad \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}(\mathsf{AsyncRef},\ \texttt{@Suspended})), \\[0.16em]
\quad \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}(\mathsf{AsyncRef},\ \texttt{@Completed})), \\[0.16em]
\quad \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}(\mathsf{AsyncRef},\ \texttt{@Failed})) \\[0.16em]
\quad ]), \\[0.16em]
\quad \bot , \\[0.16em]
\quad \bot , \\[0.16em]
\quad \bot , \\[0.16em]
\quad \bot  \\[0.16em]
\ ) \\[0.16em]
] \\[0.16em]
\mathsf{AsyncCompletedMembers}\ =\ [ \\[0.16em]
\ \operatorname{StateFieldDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{value},\ \operatorname{TypePath}([\texttt{"Result"}]),\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{AsyncFailedMembers}\ =\ [ \\[0.16em]
\ \operatorname{StateFieldDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{error},\ \operatorname{TypePath}([\texttt{"E"}]),\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{AsyncStates}\ =\ [ \\[0.16em]
\ \operatorname{StateBlock}(\texttt{@Suspended},\ \mathsf{AsyncSuspendedMembers},\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{StateBlock}(\texttt{@Completed},\ \mathsf{AsyncCompletedMembers},\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{StateBlock}(\texttt{@Failed},\ \mathsf{AsyncFailedMembers},\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{AsyncDecl}\ =\ \operatorname{ModalDecl}(\bot ,\ \texttt{public},\ \texttt{Async},\ \mathsf{AsyncParams},\ \bot ,\ [],\ \mathsf{AsyncStates},\ \bot ,\ \bot ,\ \bot )
\end{array}
$$

The following built-in aliases are defined:

$$
\begin{array}{l}
\mathsf{SequenceDecl}\ =\ \operatorname{TypeAliasDecl}(\bot ,\ \texttt{public},\ \texttt{Sequence},\ [\langle \texttt{T},\ [],\ \bot ,\ \bot \rangle ],\ \bot ,\ \operatorname{TypeApply}([\texttt{"Async"}],\ [\operatorname{TypePath}([\texttt{"T"}]),\ \operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePrim}(\texttt{"!"})]),\ \bot ,\ \bot ) \\[0.16em]
\mathsf{FutureDecl}\ =\ \operatorname{TypeAliasDecl}(\bot ,\ \texttt{public},\ \texttt{Future},\ [\langle \texttt{T},\ [],\ \bot ,\ \bot \rangle ,\ \langle \texttt{E},\ [],\ \operatorname{TypePrim}(\texttt{"!"}),\ \bot \rangle ],\ \bot ,\ \operatorname{TypeApply}([\texttt{"Async"}],\ [\operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePath}([\texttt{"T"}]),\ \operatorname{TypePath}([\texttt{"E"}])]),\ \bot ,\ \bot ) \\[0.16em]
\mathsf{StreamDecl}\ =\ \operatorname{TypeAliasDecl}(\bot ,\ \texttt{public},\ \texttt{Stream},\ [\langle \texttt{T},\ [],\ \bot ,\ \bot \rangle ,\ \langle \texttt{E},\ [],\ \bot ,\ \bot \rangle ],\ \bot ,\ \operatorname{TypeApply}([\texttt{"Async"}],\ [\operatorname{TypePath}([\texttt{"T"}]),\ \operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePath}([\texttt{"E"}])]),\ \bot ,\ \bot ) \\[0.16em]
\mathsf{PipeDecl}\ =\ \operatorname{TypeAliasDecl}(\bot ,\ \texttt{public},\ \texttt{Pipe},\ [\langle \texttt{In},\ [],\ \bot ,\ \bot \rangle ,\ \langle \texttt{Out},\ [],\ \bot ,\ \bot \rangle ],\ \bot ,\ \operatorname{TypeApply}([\texttt{"Async"}],\ [\operatorname{TypePath}([\texttt{"Out"}]),\ \operatorname{TypePath}([\texttt{"In"}]),\ \operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePrim}(\texttt{"!"})]),\ \bot ,\ \bot ) \\[0.16em]
\mathsf{ExchangeDecl}\ =\ \operatorname{TypeAliasDecl}(\bot ,\ \texttt{public},\ \texttt{Exchange},\ [\langle \texttt{T},\ [],\ \bot ,\ \bot \rangle ],\ \bot ,\ \operatorname{TypeApply}([\texttt{"Async"}],\ [\operatorname{TypePath}([\texttt{"T"}]),\ \operatorname{TypePath}([\texttt{"T"}]),\ \operatorname{TypePath}([\texttt{"T"}]),\ \operatorname{TypePrim}(\texttt{"!"})]),\ \bot ,\ \bot )
\end{array}
$$

The built-in async combinator member set is:

$$
\begin{array}{l}
\mathsf{AsyncCombinatorNames}\ =\ \{\texttt{map},\ \texttt{filter},\ \texttt{take},\ \texttt{fold},\ \texttt{chain}\} \\[0.16em]
\operatorname{BuiltinModalGeneralMember}(\mathsf{modal}_{\mathsf{ref}},\ \mathsf{name})\ \Leftrightarrow \ \operatorname{ModalRefPath}(\mathsf{modal}_{\mathsf{ref}})\ =\ [\texttt{"Async"}]\ \land \ \mathsf{name}\ \in \ \mathsf{AsyncCombinatorNames}
\end{array}
$$

### 21.1.4 Static Semantics

Alias normalization over built-in async aliases is defined by:

$$
\begin{array}{l}
\operatorname{AsyncSig}(T)\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle \ \Leftrightarrow  \\[0.16em]
\ \operatorname{AliasNorm}(T)\ =\ \operatorname{TypeApply}([\texttt{"Async"}],\ \mathsf{args})\ \land  \\[0.16em]
\ \operatorname{DefaultArgs}(\mathsf{AsyncParams},\ \mathsf{args})\ =\ [\mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E] \\[0.16em]
\operatorname{AsyncSig}(T)\ =\ \bot \quad \mathsf{otherwise} \\[0.16em]
\operatorname{BodyReturnType}(R)\ = \\[0.16em]
\ \{\ \mathsf{Result}\quad \mathsf{if}\ \operatorname{AsyncSig}(R)\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle  \\[0.16em]
\quad R\quad \mathsf{otherwise}\ \}
\end{array}
$$

An async creation expression may be checked against

$$
\texttt{TypePerm(p, TypeModalState(TypeApply(["Async"], args), state))}\ \mathsf{when}\ \texttt{p}\ \mathsf{is}
$$
supplied by the expected type and the ordinary permission rules allow introducing a
fresh value at that permission. Manual `resume` consumes a `unique` suspended async
receiver and returns a `unique` async state value.

`Async` subtyping is:

**(Sub-Async)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(T)\ =\ \langle \mathsf{Out}_{1},\ \mathsf{In}_{1},\ \mathsf{Result}_{1},\ E_{1}\rangle \quad \operatorname{AsyncSig}(U)\ =\ \langle \mathsf{Out}_{2},\ \mathsf{In}_{2},\ \mathsf{Result}_{2},\ E_{2}\rangle  \\[0.16em]
\Gamma \ \vdash \ \mathsf{Out}_{1}\ \mathrel{<:} \ \mathsf{Out}_{2}\quad \Gamma \ \vdash \ \mathsf{In}_{2}\ \mathrel{<:} \ \mathsf{In}_{1}\quad \Gamma \ \vdash \ \mathsf{Result}_{1}\ \mathrel{<:} \ \mathsf{Result}_{2}\quad \Gamma \ \vdash \ E_{1}\ \mathrel{<:} \ E_{2} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

`Async` well-formedness is:

**(WF-Async)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeApply}([\texttt{"Async"}],\ \mathsf{args})\quad \operatorname{DefaultArgs}(\mathsf{AsyncParams},\ \mathsf{args})\ =\ \mathsf{args}'\quad \forall \ i,\ \Gamma \ \vdash \ \mathsf{args}'\_i\ \mathsf{wf} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}
\end{array}
$$

**(WF-Async-ArgCount-Err)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeApply}([\texttt{"Async"}],\ \mathsf{args})\quad \operatorname{DefaultArgs}(\mathsf{AsyncParams},\ \mathsf{args})\ =\ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}\ \Uparrow 
\end{array}
$$

**(WF-Async-Arg-WF-Err)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeApply}([\texttt{"Async"}],\ \mathsf{args})\quad \operatorname{DefaultArgs}(\mathsf{AsyncParams},\ \mathsf{args})\ =\ \mathsf{args}'\quad \exists \ i.\ \Gamma \ \vdash \ \mathsf{args}'\_i\ \mathsf{wf}\ \Uparrow  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}\ \Uparrow 
\end{array}
$$

**(WF-Async-Path-Err)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}([\texttt{"Async"}]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}\ \Uparrow 
\end{array}
$$

When `E = !`, values of `Async@Failed` are uninhabited.

### 21.1.5 Dynamic Semantics

This section introduces no independent evaluation relation beyond the ordinary modal-state value model.

Construction, suspension, resumption, and settlement of `Async` values are defined in §§21.2 through 21.4.

### 21.1.6 Lowering

$$
\mathsf{AsyncTypeLowerJudg}\ =\ \{\mathsf{LowerAsyncType}\}
$$

$$
\begin{array}{l}
\operatorname{AsyncLoweredStates}(\langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ \operatorname{TypePrim}(\texttt{"!"})\rangle )\ =\ [\texttt{@Suspended},\ \texttt{@Completed}] \\[0.16em]
\operatorname{AsyncLoweredStates}(\langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle )\ =\ [\texttt{@Suspended},\ \texttt{@Completed},\ \texttt{@Failed}]\quad \mathsf{if}\ E\ \ne \ \operatorname{TypePrim}(\texttt{"!"}) \\[0.16em]
\operatorname{AsyncResumeType}(\langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ \operatorname{TypePrim}(\texttt{"!"})\rangle )\ = \\[0.16em]
\ \operatorname{TypeUnion}([ \\[0.16em]
\quad \operatorname{TypeModalState}(\operatorname{TypeApply}([\texttt{"Async"}],\ [\mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ \operatorname{TypePrim}(\texttt{"!"})]),\ \texttt{@Suspended}), \\[0.16em]
\quad \operatorname{TypeModalState}(\operatorname{TypeApply}([\texttt{"Async"}],\ [\mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ \operatorname{TypePrim}(\texttt{"!"})]),\ \texttt{@Completed}) \\[0.16em]
\ ]) \\[0.16em]
\operatorname{AsyncResumeType}(\langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle )\ = \\[0.16em]
\ \operatorname{TypeUnion}([ \\[0.16em]
\quad \operatorname{TypeModalState}(\operatorname{TypeApply}([\texttt{"Async"}],\ [\mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E]),\ \texttt{@Suspended}), \\[0.16em]
\quad \operatorname{TypeModalState}(\operatorname{TypeApply}([\texttt{"Async"}],\ [\mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E]),\ \texttt{@Completed}), \\[0.16em]
\quad \operatorname{TypeModalState}(\operatorname{TypeApply}([\texttt{"Async"}],\ [\mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E]),\ \texttt{@Failed}) \\[0.16em]
\ ])\quad \mathsf{if}\ E\ \ne \ \operatorname{TypePrim}(\texttt{"!"})
\end{array}
$$

When `E = !`, lowering MUST omit the `@Failed` state from concrete storage layouts and from the concrete resume-result tag space. The semantic state `@Failed` remains uninhabited and lowering MUST emit no failed-state variant.

**(Lower-Async-Type)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(T)\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle \quad \mathsf{sig}\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle \quad \mathsf{states}\ =\ \operatorname{AsyncLoweredStates}(\mathsf{sig})\quad \mathsf{resume}_{\mathsf{ty}}\ =\ \operatorname{AsyncResumeType}(\mathsf{sig}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerAsyncType}(T)\ \Downarrow \ \langle \operatorname{AsyncStateTagIR}(\mathsf{states}),\ \operatorname{AsyncResumeSigIR}(\mathsf{In},\ \mathsf{resume}_{\mathsf{ty}})\rangle 
\end{array}
$$

Built-in aliases lower through their normalized `Async` body:

**(Lower-Async-Alias)**

$$
\begin{array}{l}
\operatorname{AliasNorm}(T)\ =\ T'\quad \operatorname{AsyncSig}(T')\ =\ \mathsf{sig}\quad \Gamma \ \vdash \ \operatorname{LowerAsyncType}(T')\ \Downarrow \ \mathsf{out} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerAsyncType}(T)\ \Downarrow \ \mathsf{out}
\end{array}
$$

### 21.1.7 Diagnostics

| Code         | Severity | Detection    | Condition                                 |
| ------------ | -------- | ------------ | ----------------------------------------- |
| `E-CON-0201` | Error    | Compile-time | `Async` type parameter is not well-formed |
