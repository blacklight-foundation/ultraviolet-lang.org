---
title: "Asynchronous Operations"
description: "21. Asynchronous Operations of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
generatedAt: "2026-05-14T00:55:03.609Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
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
\quad \operatorname{TypeModalState}(\mathsf{AsyncRef},\ \texttt{@Suspended}), \\[0.16em]
\quad \operatorname{TypeModalState}(\mathsf{AsyncRef},\ \texttt{@Completed}), \\[0.16em]
\quad \operatorname{TypeModalState}(\mathsf{AsyncRef},\ \texttt{@Failed}) \\[0.16em]
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

## 21.2 Suspension Forms

### 21.2.1 Syntax

```text
wait_expr       ::= "wait" expression
yield_expr      ::= "yield" "release"? expression
yield_from_expr ::= "yield" "release"? "from" expression
```

### 21.2.2 Parsing

`wait`, `yield`, and `yield from` are primary expressions.

`wait` is parsed by:

**(Parse-Wait-Expr)**

$$
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \operatorname{Lexeme}(\operatorname{Tok}(P))\ =\ \texttt{wait}\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{handle}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (P_{1},\ \operatorname{WaitExpr}(\mathsf{handle}))
\end{array}
$$

`yield from` is parsed by:

**(Parse-Yield-From-Expr)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{yield})\quad P_{1}\ =\ \operatorname{Advance}(P) \\[0.16em]
(\operatorname{IsIdent}(\operatorname{Tok}(P_{1}))\ \land \ \operatorname{Lexeme}(\operatorname{Tok}(P_{1}))\ =\ \texttt{release}\ \Rightarrow \ \mathsf{release}_{\mathsf{opt}}\ =\ \mathsf{Release}\ \land \ P_{2}\ =\ \operatorname{Advance}(P_{1})) \\[0.16em]
(\lnot (\operatorname{IsIdent}(\operatorname{Tok}(P_{1}))\ \land \ \operatorname{Lexeme}(\operatorname{Tok}(P_{1}))\ =\ \texttt{release})\ \Rightarrow \ \mathsf{release}_{\mathsf{opt}}\ =\ \bot \ \land \ P_{2}\ =\ P_{1}) \\[0.16em]
\operatorname{IsKw}(\operatorname{Tok}(P_{2}),\ \texttt{from})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(P_{2}))\ \Downarrow \ (P_{3},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (P_{3},\ \operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ e))
\end{array}
$$

`yield` is parsed by:

**(Parse-Yield-Expr)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{yield})\quad P_{1}\ =\ \operatorname{Advance}(P) \\[0.16em]
(\operatorname{IsIdent}(\operatorname{Tok}(P_{1}))\ \land \ \operatorname{Lexeme}(\operatorname{Tok}(P_{1}))\ =\ \texttt{release}\ \Rightarrow \ \mathsf{release}_{\mathsf{opt}}\ =\ \mathsf{Release}\ \land \ P_{2}\ =\ \operatorname{Advance}(P_{1})) \\[0.16em]
(\lnot (\operatorname{IsIdent}(\operatorname{Tok}(P_{1}))\ \land \ \operatorname{Lexeme}(\operatorname{Tok}(P_{1}))\ =\ \texttt{release})\ \Rightarrow \ \mathsf{release}_{\mathsf{opt}}\ =\ \bot \ \land \ P_{2}\ =\ P_{1}) \\[0.16em]
\lnot \ \operatorname{IsKw}(\operatorname{Tok}(P_{2}),\ \texttt{from})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(P_{2})\ \Downarrow \ (P_{3},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (P_{3},\ \operatorname{YieldExpr}(\mathsf{release}_{\mathsf{opt}},\ e))
\end{array}
$$

### 21.2.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{YieldReleaseOpt}\ \in \ \{\bot \}\ \cup \ \{\mathsf{Release}\} \\[0.16em]
\mathsf{Expr}\ \mathsf{includes}: \\[0.16em]
\ \operatorname{WaitExpr}(\mathsf{handle}) \\[0.16em]
\ \operatorname{YieldExpr}(\mathsf{release}_{\mathsf{opt}},\ \mathsf{expr}) \\[0.16em]
\ \operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ \mathsf{expr})
\end{array}
$$

Name resolution preserves these forms:

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{WaitExpr}(\mathsf{handle}))\ \Downarrow \ \operatorname{WaitExpr}(\mathsf{handle}') \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{YieldExpr}(\mathsf{release}_{\mathsf{opt}},\ e))\ \Downarrow \ \operatorname{YieldExpr}(\mathsf{release}_{\mathsf{opt}},\ e') \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ e))\ \Downarrow \ \operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ e')
\end{array}
$$

Evaluation order is:

$$
\begin{array}{l}
\operatorname{Children_LTR}(\operatorname{WaitExpr}(\mathsf{handle}))\ =\ [\mathsf{handle}] \\[0.16em]
\operatorname{Children_LTR}(\operatorname{YieldExpr}(\mathsf{release}_{\mathsf{opt}},\ e))\ =\ [e] \\[0.16em]
\operatorname{Children_LTR}(\operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ e))\ =\ [e]
\end{array}
$$

### 21.2.4 Static Semantics

`wait` typing is:

**(T-Wait)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ h\ :\ \operatorname{TypeApply}([\texttt{"Spawned"}],\ [T]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \texttt{wait}\ h\ :\ T
\end{array}
$$

**(T-Wait-Future)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ h\ :\ \operatorname{TypeApply}([\texttt{"Tracked"}],\ [T,\ E]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \texttt{wait}\ h\ :\ \operatorname{TypeUnion}([T,\ E])
\end{array}
$$

**(Wait-Handle-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ h\ :\ T_{h}\quad \operatorname{StripPerm}(T_{h})\ \notin \ \{\operatorname{TypeApply}([\texttt{"Spawned"}],\ [\_]),\ \operatorname{TypeApply}([\texttt{"Tracked"}],\ [\_,\ \_])\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \texttt{wait}\ h\ \Uparrow 
\end{array}
$$

`yield` typing is:

**(T-Yield)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle \quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ T\quad \Gamma \ \vdash \ T\ \mathrel{<:} \ \mathsf{Out} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{YieldExpr}(\mathsf{release}_{\mathsf{opt}},\ e)\ :\ \mathsf{In}
\end{array}
$$

**(Yield-NotAsync-Err)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{YieldExpr}(\mathsf{release}_{\mathsf{opt}},\ e)\ \Uparrow 
\end{array}
$$

**(Yield-Out-Err)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle \quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ T\quad \lnot (\Gamma \ \vdash \ T\ \mathrel{<:} \ \mathsf{Out}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{YieldExpr}(\mathsf{release}_{\mathsf{opt}},\ e)\ \Uparrow 
\end{array}
$$

`yield from` typing is:

**(T-Yield-From)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E_{1}\rangle \quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ T_{e}\quad \operatorname{AsyncSig}(T_{e})\ =\ \langle \mathsf{Out}_{e},\ \mathsf{In}_{e},\ \mathsf{Result}_{e},\ E_{2}\rangle \quad \Gamma \ \vdash \ \mathsf{Out}_{e}\ \equiv \ \mathsf{Out}\quad \Gamma \ \vdash \ \mathsf{In}_{e}\ \equiv \ \mathsf{In}\quad \Gamma \ \vdash \ E_{2}\ \mathrel{<:} \ E_{1} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ e)\ :\ \mathsf{Result}_{e}
\end{array}
$$

**(YieldFrom-NotAsync-Err)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ e)\ \Uparrow 
\end{array}
$$

**(YieldFrom-Out-Err)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E_{1}\rangle \quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ T_{e} \\[0.16em]
(\operatorname{AsyncSig}(T_{e})\ =\ \bot \ \lor \ (\operatorname{AsyncSig}(T_{e})\ =\ \langle \mathsf{Out}_{e},\ \mathsf{In}_{e},\ \mathsf{Result}_{e},\ E_{2}\rangle \ \land \ \lnot (\Gamma \ \vdash \ \mathsf{Out}_{e}\ \equiv \ \mathsf{Out}))) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ e)\ \Uparrow 
\end{array}
$$

**(YieldFrom-In-Err)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E_{1}\rangle \quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ T_{e}\quad \operatorname{AsyncSig}(T_{e})\ =\ \langle \mathsf{Out}_{e},\ \mathsf{In}_{e},\ \mathsf{Result}_{e},\ E_{2}\rangle \quad \Gamma \ \vdash \ \mathsf{Out}_{e}\ \equiv \ \mathsf{Out}\quad \lnot (\Gamma \ \vdash \ \mathsf{In}_{e}\ \equiv \ \mathsf{In}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ e)\ \Uparrow 
\end{array}
$$

**(YieldFrom-ErrType-Err)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E_{1}\rangle \quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ T_{e}\quad \operatorname{AsyncSig}(T_{e})\ =\ \langle \mathsf{Out}_{e},\ \mathsf{In}_{e},\ \mathsf{Result}_{e},\ E_{2}\rangle \quad \Gamma \ \vdash \ \mathsf{Out}_{e}\ \equiv \ \mathsf{Out}\quad \Gamma \ \vdash \ \mathsf{In}_{e}\ \equiv \ \mathsf{In}\quad \lnot (\Gamma \ \vdash \ E_{2}\ \mathrel{<:} \ E_{1}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ e)\ \Uparrow 
\end{array}
$$

Key restrictions for `wait`, `yield`, and `yield from` are defined in §21.5.4.

### 21.2.5 Dynamic Semantics

`wait` retrieves results from `Spawned<T>` and `Tracked<T, E>` handles.

`wait` evaluation is:

1. Evaluate `h`.
2. If the handle is ready, return its settled value.
3. If the handle is pending, block the current task until the handle settles.
4. If a `Spawned<T>` handle settles by panic, that failure is consumed by the enclosing `parallel` panic propagation defined by §20.7.5.

Formal `wait` rules:

$$
\begin{array}{l}
\operatorname{SpawnHandleState}(\operatorname{SpawnedVal}(@\mathsf{Ready}\ \{\ \mathsf{value}\ \},\ \_))\ =\ \operatorname{Ready}(\mathsf{value}) \\[0.16em]
\operatorname{SpawnHandleState}(\operatorname{SpawnedVal}(@\mathsf{Pending},\ \_))\ =\ \mathsf{Pending} \\[0.16em]
\operatorname{TrackedHandleState}(\operatorname{TrackedVal}(@\mathsf{Ready}\ \{\ \mathsf{value}\ \},\ \_))\ =\ \operatorname{Ready}(\mathsf{value}) \\[0.16em]
\operatorname{TrackedHandleState}(\operatorname{TrackedVal}(@\mathsf{Pending},\ \_))\ =\ \mathsf{Pending} \\[0.16em]
\operatorname{BlockUntilSettledSpawned}(\mathsf{handle},\ \sigma )\ \Downarrow \ (\mathsf{handle}',\ \sigma ')\ \Leftrightarrow  \\[0.16em]
\ \sigma '\ \mathsf{extends}\ \sigma \ \mathsf{by}\ \mathsf{abstract}\ \mathsf{scheduler}\ \mathsf{progress}\ \mathsf{until}\ \operatorname{SpawnHandleState}(\mathsf{handle}')\ \in \ \{\operatorname{Ready}(\_),\ \operatorname{Failed}(\_)\} \\[0.16em]
\operatorname{BlockUntilSettledTracked}(\mathsf{handle},\ \sigma )\ \Downarrow \ (\mathsf{handle}',\ \sigma ')\ \Leftrightarrow  \\[0.16em]
\ \sigma '\ \mathsf{extends}\ \sigma \ \mathsf{by}\ \mathsf{abstract}\ \mathsf{scheduler}\ \mathsf{progress}\ \mathsf{until}\ \operatorname{TrackedHandleState}(\mathsf{handle}')\ =\ \operatorname{Ready}(\_)
\end{array}
$$

**(EvalSigma-Wait-Spawned-Ready)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(h,\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{handle}),\ \sigma_{1} )\quad \operatorname{SpawnHandleState}(\mathsf{handle})\ =\ \operatorname{Ready}(v) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{WaitExpr}(h),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Wait-Spawned-Pending)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(h,\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{handle}),\ \sigma_{1} )\quad \operatorname{SpawnHandleState}(\mathsf{handle})\ =\ \mathsf{Pending} \\[0.16em]
\operatorname{BlockUntilSettledSpawned}(\mathsf{handle},\ \sigma_{1} )\ \Downarrow \ (\mathsf{handle}',\ \sigma_{2} )\quad \operatorname{SpawnHandleState}(\mathsf{handle}')\ =\ \operatorname{Ready}(v) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{WaitExpr}(h),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{2} )
\end{array}
$$

Failed `Spawned<T>` settlement is not independently observed by `wait`; it is consumed by the enclosing `AwaitSpawned(...)` / §20.7.5 parallel panic propagation.

**(EvalSigma-Wait-Tracked-Ready)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(h,\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{handle}),\ \sigma_{1} )\quad \operatorname{TrackedHandleState}(\mathsf{handle})\ =\ \operatorname{Ready}(v) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{WaitExpr}(h),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Wait-Tracked-Pending)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(h,\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{handle}),\ \sigma_{1} )\quad \operatorname{TrackedHandleState}(\mathsf{handle})\ =\ \mathsf{Pending} \\[0.16em]
\operatorname{BlockUntilSettledTracked}(\mathsf{handle},\ \sigma_{1} )\ \Downarrow \ (\mathsf{handle}',\ \sigma_{2} )\quad \operatorname{TrackedHandleState}(\mathsf{handle}')\ =\ \operatorname{Ready}(v) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{WaitExpr}(h),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Wait-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(h,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{WaitExpr}(h),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

`yield` suspends the current async computation:

1. Evaluate `e` to `v`.
2. If `release_opt = Release`, release all held keys and record the key set.
3. Transition to `Async@Suspended { output = v }`.
4. On resumption with input `i`, reacquire any recorded keys in canonical order under Chapter 19, bind `i` as the value of the suspended `yield` expression, and continue.

Resumption helpers are:

$$
\begin{array}{l}
\mathsf{ResumptionPoint}\ =\ \langle \mathsf{scope}_{\mathsf{stack}},\ \mathsf{region}_{\mathsf{stack}},\ \mathsf{continuation}\rangle  \\[0.16em]
\operatorname{ReleaseKeys}(\sigma ,\ \mathsf{keys})\ \Downarrow \ \sigma '\ \Leftrightarrow  \\[0.16em]
\ \mathsf{rev}\ =\ \operatorname{CanonicalOrder}(\mathsf{keys})\ \land  \\[0.16em]
\ \forall \ k\ \in \ \operatorname{Reverse}(\mathsf{rev}).\ \operatorname{ReleaseLock}(\sigma ,\ k)\ \land  \\[0.16em]
\ \sigma '\ =\ \sigma [\mathsf{held}_{\mathsf{keys}}\ :=\ \sigma .\mathsf{held}_{\mathsf{keys}}\ \setminus \ \mathsf{keys}] \\[0.16em]
\operatorname{ReacquireKeys}(\sigma ,\ \mathsf{keys})\ \Downarrow \ \sigma '\ \Leftrightarrow  \\[0.16em]
\ \mathsf{sorted}\ =\ \operatorname{CanonicalOrder}(\mathsf{keys})\ \land  \\[0.16em]
\ \forall \ k\ \in \ \mathsf{sorted}.\ \operatorname{AcquireLock}(\sigma ,\ k,\ \operatorname{ModeOf}(k))\ \land  \\[0.16em]
\ \sigma '\ =\ \sigma [\mathsf{held}_{\mathsf{keys}}\ :=\ \sigma .\mathsf{held}_{\mathsf{keys}}\ \cup \ \mathsf{keys}] \\[0.16em]
\operatorname{RestoreResumptionPoint}(\mathsf{rp})\ \Downarrow \ \sigma \ \Leftrightarrow  \\[0.16em]
\ \mathsf{rp}\ =\ \langle \mathsf{scope}_{\mathsf{stack}},\ \mathsf{region}_{\mathsf{stack}},\ \mathsf{continuation}\rangle \ \land  \\[0.16em]
\ \sigma .\mathsf{scope}_{\mathsf{stack}}\ =\ \mathsf{scope}_{\mathsf{stack}}\ \land  \\[0.16em]
\ \sigma .\mathsf{region}_{\mathsf{stack}}\ =\ \mathsf{region}_{\mathsf{stack}}\ \land  \\[0.16em]
\ \sigma .\mathsf{continuation}\ =\ \mathsf{continuation} \\[0.16em]
\Gamma_{\mathsf{keys}} (\sigma )\ =\ \sigma .\mathsf{held}_{\mathsf{keys}}
\end{array}
$$

Formal `yield` rules:

**(EvalSigma-Yield)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad \mathsf{release}_{\mathsf{opt}}\ =\ \bot \quad \Gamma_{\mathsf{keys}} (\sigma_{1} )\ =\ \emptyset  \\[0.16em]
\mathsf{async}_{\mathsf{state}}\ =\ \operatorname{AsyncSuspended}(v,\ \sigma_{1} .\mathsf{resumption}_{\mathsf{point}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{YieldExpr}(\mathsf{release}_{\mathsf{opt}},\ e),\ \sigma )\ \Downarrow \ (\operatorname{Suspend}(\mathsf{async}_{\mathsf{state}}),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Yield-Release)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad \mathsf{release}_{\mathsf{opt}}\ =\ \mathsf{Release}\quad \mathsf{held}\ =\ \Gamma_{\mathsf{keys}} (\sigma_{1} )\quad \operatorname{ReleaseKeys}(\sigma_{1} ,\ \mathsf{held})\ \Downarrow \ \sigma_{2}  \\[0.16em]
\mathsf{async}_{\mathsf{state}}\ =\ \operatorname{AsyncSuspended}(v,\ \sigma_{2} .\mathsf{resumption}_{\mathsf{point}},\ \mathsf{held}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{YieldExpr}(\mathsf{release}_{\mathsf{opt}},\ e),\ \sigma )\ \Downarrow \ (\operatorname{Suspend}(\mathsf{async}_{\mathsf{state}}),\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Yield-Resume)**

$$
\begin{array}{l}
\mathsf{async}_{\mathsf{state}}\ =\ \operatorname{AsyncSuspended}(\_,\ \mathsf{rp},\ \mathsf{held}_{\mathsf{opt}})\quad \mathsf{input}\ =\ i\quad \operatorname{RestoreResumptionPoint}(\mathsf{rp})\ \Downarrow \ \sigma_{0}  \\[0.16em]
\sigma_{1} \ =\ (\mathsf{held}_{\mathsf{opt}}\ \ne \ \bot \ \land \ \operatorname{ReacquireKeys}(\sigma_{0} ,\ \mathsf{held}_{\mathsf{opt}})\ \Downarrow \ \sigma_{1} '\ \to \ \sigma_{1} '\ \mid \ \sigma_{0} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Resume}(\mathsf{async}_{\mathsf{state}},\ i),\ \sigma )\ \Downarrow \ (\operatorname{Val}(i),\ \sigma_{1} )
\end{array}
$$

`yield from` delegates suspension and completion to another async value:

1. Evaluate the source async value.
2. If it is suspended, re-emit its output through the enclosing async, preserving `release_opt`.
3. If it is completed, produce the completed value.
4. If it is failed, propagate the failure.

Formal `yield from` rules:

**(EvalSigma-YieldFrom-Suspended)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{source},\ \sigma )\ \Downarrow \ (\operatorname{Val}(s),\ \sigma_{1} )\quad \operatorname{ModalState}(s)\ =\ @\mathsf{Suspended}\quad s.\mathsf{output}\ =\ v \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{YieldExpr}(\mathsf{release}_{\mathsf{opt}},\ v),\ \sigma_{1} )\ \Downarrow \ (\operatorname{Suspend}(\mathsf{outer}_{\mathsf{state}}),\ \sigma_{2} ) \\[0.16em]
\mathsf{outer}_{\mathsf{state}}'\ =\ \mathsf{outer}_{\mathsf{state}}[\mathsf{inner}_{\mathsf{async}}\ \mapsto \ s] \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ \mathsf{source}),\ \sigma )\ \Downarrow \ (\operatorname{Suspend}(\mathsf{outer}_{\mathsf{state}}'),\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-YieldFrom-Completed)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{source},\ \sigma )\ \Downarrow \ (\operatorname{Val}(s),\ \sigma_{1} )\quad \operatorname{ModalState}(s)\ =\ @\mathsf{Completed}\quad s.\mathsf{value}\ =\ v \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ \mathsf{source}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-YieldFrom-Failed)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{source},\ \sigma )\ \Downarrow \ (\operatorname{Val}(s),\ \sigma_{1} )\quad \operatorname{ModalState}(s)\ =\ @\mathsf{Failed}\quad s.\mathsf{error}\ =\ e \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ \mathsf{source}),\ \sigma )\ \Downarrow \ (\operatorname{Propagate}(e),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-YieldFrom-Resume)**

$$
\begin{array}{l}
\mathsf{outer}_{\mathsf{state}}.\mathsf{inner}_{\mathsf{async}}\ =\ s\quad \mathsf{input}\ =\ i\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Resume}(s,\ i),\ \sigma )\ \Downarrow \ (\operatorname{Val}(s'),\ \sigma_{1} ) \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalYieldFromContinue}(\mathsf{release}_{\mathsf{opt}},\ s',\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Resume}(\mathsf{outer}_{\mathsf{state}},\ i),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

$$
\mathsf{EvalYieldFromContinue}\ :\ \mathsf{ReleaseOpt}\ \times \ \mathsf{AsyncValue}\ \times \ \mathsf{State}\ \to \ \mathsf{EvalOut}\ \times \ \mathsf{State}
$$

**(EvalYieldFromContinue-Suspended)**

$$
\begin{array}{l}
\operatorname{ModalState}(s)\ =\ @\mathsf{Suspended}\quad s.\mathsf{output}\ =\ v \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{YieldExpr}(\mathsf{release}_{\mathsf{opt}},\ v),\ \sigma )\ \Downarrow \ (\operatorname{Suspend}(\mathsf{outer}_{\mathsf{state}}),\ \sigma_{1} ) \\[0.16em]
\mathsf{outer}_{\mathsf{state}}'\ =\ \mathsf{outer}_{\mathsf{state}}[\mathsf{inner}_{\mathsf{async}}\ \mapsto \ s] \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalYieldFromContinue}(\mathsf{release}_{\mathsf{opt}},\ s,\ \sigma )\ \Downarrow \ (\operatorname{Suspend}(\mathsf{outer}_{\mathsf{state}}'),\ \sigma_{1} )
\end{array}
$$

**(EvalYieldFromContinue-Completed)**

$$
\begin{array}{l}
\operatorname{ModalState}(s)\ =\ @\mathsf{Completed}\quad s.\mathsf{value}\ =\ v \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalYieldFromContinue}(\mathsf{release}_{\mathsf{opt}},\ s,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma )
\end{array}
$$

**(EvalYieldFromContinue-Failed)**

$$
\begin{array}{l}
\operatorname{ModalState}(s)\ =\ @\mathsf{Failed}\quad s.\mathsf{error}\ =\ e \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalYieldFromContinue}(\mathsf{release}_{\mathsf{opt}},\ s,\ \sigma )\ \Downarrow \ (\operatorname{Propagate}(e),\ \sigma )
\end{array}
$$

### 21.2.6 Lowering

$$
\mathsf{SuspensionIR}\ =\ \{\mathsf{WaitIR},\ \mathsf{YieldIR},\ \mathsf{YieldFromEnterIR},\ \mathsf{YieldFromResumeIR},\ \mathsf{SnapshotHeldKeysIR},\ \mathsf{ReleaseHeldKeysIR},\ \mathsf{ReacquireHeldKeysIR}\}
$$

$$
\begin{array}{l}
\operatorname{CurrentAsyncFrame}(\Gamma )\ =\ f \\[0.16em]
\operatorname{CurrentGenPoint}(\Gamma )\ =\ g \\[0.16em]
\operatorname{ResumeLabel}(\Gamma ,\ g)\ =\ L \\[0.16em]
\operatorname{WaitResult}(v_{h})\ =\ v_{r}\quad \mathsf{where}\ v_{r}\ \mathsf{is}\ \mathsf{the}\ \mathsf{result}\ \mathsf{value}\ \mathsf{produced}\ \mathsf{by}\ \operatorname{WaitIR}(v_{h}) \\[0.16em]
\operatorname{ResumeInput}(f,\ g)\ =\ v_{i}\ \mathsf{where}\ v_{i}\ \mathsf{is}\ \mathsf{the}\ \mathsf{resume}-\mathsf{input}\ \mathsf{value}\ \mathsf{bound}\ \mathsf{at}\ \operatorname{ResumeLabel}(\Gamma ,\ g)
\end{array}
$$

**(Lower-Wait-Spawned)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(h)\ \Downarrow \ \langle \mathsf{IR}_{h},\ v_{h}\rangle \quad \operatorname{StripPerm}(\operatorname{ExprType}(h))\ =\ \operatorname{TypeApply}([\texttt{"Spawned"}],\ [T]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{WaitExpr}(h))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{h},\ \operatorname{WaitIR}(v_{h})),\ \operatorname{WaitResult}(v_{h})\rangle 
\end{array}
$$

**(Lower-Wait-Tracked)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(h)\ \Downarrow \ \langle \mathsf{IR}_{h},\ v_{h}\rangle \quad \operatorname{StripPerm}(\operatorname{ExprType}(h))\ =\ \operatorname{TypeApply}([\texttt{"Tracked"}],\ [T,\ E]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{WaitExpr}(h))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{h},\ \operatorname{WaitIR}(v_{h})),\ \operatorname{WaitResult}(v_{h})\rangle 
\end{array}
$$

**(Lower-Yield)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle \quad \operatorname{CurrentAsyncFrame}(\Gamma )\ =\ f\quad \operatorname{CurrentGenPoint}(\Gamma )\ =\ g \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{YieldExpr}(\bot ,\ e))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{e},\ \operatorname{YieldIR}(f,\ g,\ v)),\ \operatorname{ResumeInput}(f,\ g)\rangle 
\end{array}
$$

**(Lower-Yield-Release)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle \quad \operatorname{CurrentAsyncFrame}(\Gamma )\ =\ f\quad \operatorname{CurrentGenPoint}(\Gamma )\ =\ g\quad \operatorname{ResumeLabel}(\Gamma ,\ g)\ =\ L \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{YieldExpr}(\mathsf{Release},\ e))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{e},\ \operatorname{SeqIR}(\operatorname{SnapshotHeldKeysIR}(f),\ \operatorname{SeqIR}(\operatorname{ReleaseHeldKeysIR}(f),\ \operatorname{YieldIR}(f,\ g,\ v)))),\ \operatorname{ResumeInput}(f,\ g)\rangle 
\end{array}
$$

For **(Lower-Yield-Release)**, the resumption target `L` MUST begin by executing `ReacquireHeldKeysIR(f)` in canonical key order before control reaches the suspended continuation.

**(Lower-YieldFrom)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(\mathsf{source})\ \Downarrow \ \langle \mathsf{IR}_{s},\ v_{s}\rangle \quad \operatorname{CurrentAsyncFrame}(\Gamma )\ =\ f\quad \operatorname{CurrentGenPoint}(\Gamma )\ =\ g \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ \mathsf{source}))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{s},\ \operatorname{YieldFromEnterIR}(f,\ g,\ \mathsf{release}_{\mathsf{opt}},\ v_{s})),\ \operatorname{YieldFromResumeIR}(f,\ g)\rangle 
\end{array}
$$

`YieldFromEnterIR` MUST lower delegation as a loop over the inner async state:
1. `@Suspended { output = v }` re-enters lowering through the `yield` path using the same `release_opt`,
2. `@Completed { value = v }` returns `v`,
3. `@Failed { error = e }` lowers as async error propagation.

### 21.2.7 Diagnostics

| Code         | Severity | Detection    | Condition                                      |
| ------------ | -------- | ------------ | ---------------------------------------------- |
| `E-CON-0132` | Error    | Compile-time | `wait` operand is not Spawned or Tracked       |
| `E-CON-0210` | Error    | Compile-time | `yield` outside async-returning procedure      |
| `E-CON-0211` | Error    | Compile-time | `yield` operand type does not match `Out`      |
| `E-CON-0220` | Error    | Compile-time | `yield from` outside async-returning procedure |
| `E-CON-0221` | Error    | Compile-time | Incompatible `Out` parameter in `yield from`   |
| `E-CON-0222` | Error    | Compile-time | Incompatible `In` parameter in `yield from`    |
| `E-CON-0225` | Error    | Compile-time | Error type not compatible in `yield from`      |

## 21.3 Composition Forms

### 21.3.1 Syntax

`loop ... in ...` async iteration uses the ordinary loop syntax defined in Chapter 18.

Manual stepping uses ordinary modal-state inspection and method-call syntax.

```text
sync_expr    ::= "sync" expression
race_expr    ::= "race" "{" race_arm ("," race_arm)* "}"
race_arm     ::= expression "->" "|" pattern "|" race_handler
race_handler ::= expression | "yield" expression
all_expr     ::= "all" "{" expression ("," expression)* "}"
```

This section defines the following method-call surfaces:

- `shared_value~>until(pred, action)`
- `a~>map(f)`
- `a~>filter(p)`
- `a~>take(n)`
- `a~>fold(init, f)`
- `a~>chain(f)`

`until` is a source-specified method-call surface on `shared` values. Its type and runtime behavior are defined by this section's static and dynamic semantics.

### 21.3.2 Parsing

`sync`, `race`, and `all` are primary expressions.

`sync` is parsed by:

**(Parse-Sync-Expr)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{sync})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (P_{1},\ \operatorname{SyncExpr}(e))
\end{array}
$$

`race` is parsed by:

**(Parse-Race-Expr)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{race})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseRaceArms}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ \mathsf{arms})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{RaceExpr}(\mathsf{arms}))
\end{array}
$$

Race-arm parsing is:

**(Parse-RaceArms-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseRaceArm}(P)\ \Downarrow \ (P_{1},\ a)\quad \Gamma \ \vdash \ \operatorname{ParseRaceArmsTail}(P_{1},\ [a])\ \Downarrow \ (P_{2},\ \mathsf{arms}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRaceArms}(P)\ \Downarrow \ (P_{2},\ \mathsf{arms})
\end{array}
$$

**(Parse-RaceArm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseExpr}(P)\ \Downarrow \ (P_{1},\ e)\quad \operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{"->"})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P_{1})),\ \texttt{"|"}) \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePattern}(\operatorname{Advance}(\operatorname{Advance}(P_{1})))\ \Downarrow \ (P_{2},\ \mathsf{pat})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{"|"}) \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRaceHandler}(\operatorname{Advance}(P_{2}))\ \Downarrow \ (P_{3},\ \mathsf{handler}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRaceArm}(P)\ \Downarrow \ (P_{3},\ \langle e,\ \mathsf{pat},\ \mathsf{handler}\rangle )
\end{array}
$$

**(Parse-RaceArmsTail-End)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRaceArmsTail}(P,\ \mathsf{xs})\ \Downarrow \ (P,\ \mathsf{xs})
\end{array}
$$

**(Parse-RaceArmsTail-TrailingComma)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRaceArmsTail}(P,\ \mathsf{xs})\ \Downarrow \ (\operatorname{Advance}(P),\ \mathsf{xs})
\end{array}
$$

**(Parse-RaceArmsTail-Comma)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParseRaceArm}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ a)\quad \Gamma \ \vdash \ \operatorname{ParseRaceArmsTail}(P_{1},\ \mathsf{xs}\ \mathbin{++} \ [a])\ \Downarrow \ (P_{2},\ \mathsf{ys}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRaceArmsTail}(P,\ \mathsf{xs})\ \Downarrow \ (P_{2},\ \mathsf{ys})
\end{array}
$$

**(Parse-RaceHandler-Yield)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{yield})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRaceHandler}(P)\ \Downarrow \ (P_{1},\ \operatorname{RaceYield}(e))
\end{array}
$$

**(Parse-RaceHandler-Return)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseExpr}(P)\ \Downarrow \ (P_{1},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRaceHandler}(P)\ \Downarrow \ (P_{1},\ \operatorname{RaceReturn}(e))
\end{array}
$$

`all` is parsed by:

**(Parse-All-Expr)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{all})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseAllExprList}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ \mathsf{es})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{AllExpr}(\mathsf{es}))
\end{array}
$$

`loop ... in ...`, manual stepping, `until`, and async combinators use ordinary parsing for loops, modal-state operations, and method calls.

### 21.3.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{RaceHandler}\ =\ \{\operatorname{RaceReturn}(\mathsf{expr}),\ \operatorname{RaceYield}(\mathsf{expr})\} \\[0.16em]
\mathsf{RaceArm}\ =\ \langle \mathsf{expr},\ \mathsf{pat},\ \mathsf{handler}\rangle \quad \mathsf{handler}\ \in \ \mathsf{RaceHandler} \\[0.16em]
\mathsf{RaceArms}\ =\ [\mathsf{RaceArm}] \\[0.16em]
\mathsf{Expr}\ \mathsf{includes}: \\[0.16em]
\ \operatorname{SyncExpr}(\mathsf{expr}) \\[0.16em]
\ \operatorname{RaceExpr}(\mathsf{arms}) \\[0.16em]
\ \operatorname{AllExpr}(\mathsf{exprs})
\end{array}
$$

Async iteration uses the existing loop form:

```text
LoopIter(pattern, type_opt, iter, inv_opt, body)
```

Manual stepping, `until`, and async combinators use existing `IfCaseExpr`, modal-state forms, and `MethodCall`.

No dedicated AST nodes are introduced for `until` or for async combinators beyond ordinary method calls.

Resolution is:

$$
\begin{array}{l}
\mathsf{ResolveRaceJudg}\ =\ \{\mathsf{ResolveRaceArm},\ \mathsf{ResolveRaceArms},\ \mathsf{ResolveRaceHandler}\} \\[0.16em]
\mathsf{ResolveAllExprListJudg}\ =\ \{\mathsf{ResolveAllExprList}\} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveRaceHandler}(\operatorname{RaceReturn}(e))\ \Downarrow \ \operatorname{RaceReturn}(e') \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveRaceHandler}(\operatorname{RaceYield}(e))\ \Downarrow \ \operatorname{RaceYield}(e') \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveRaceArm}(\langle e,\ \mathsf{pat},\ \mathsf{handler}\rangle )\ \Downarrow \ \langle e',\ \mathsf{pat}',\ \mathsf{handler}'\rangle  \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveRaceArms}([])\ \Downarrow \ [] \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveRaceArms}(a\ \mathbin{::} \ \mathsf{as})\ \Downarrow \ a'\ \mathbin{::} \ \mathsf{as}' \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveAllExprList}([])\ \Downarrow \ [] \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveAllExprList}(e\ \mathbin{::} \ \mathsf{es})\ \Downarrow \ e'\ \mathbin{::} \ \mathsf{es}' \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{SyncExpr}(e))\ \Downarrow \ \operatorname{SyncExpr}(e') \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{RaceExpr}(\mathsf{arms}))\ \Downarrow \ \operatorname{RaceExpr}(\mathsf{arms}') \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{AllExpr}(\mathsf{es}))\ \Downarrow \ \operatorname{AllExpr}(\mathsf{es}')
\end{array}
$$

Evaluation order is:

$$
\begin{array}{l}
\operatorname{RaceArmExprs}([])\ =\ [] \\[0.16em]
\operatorname{RaceArmExprs}(\langle e,\ \_,\ \_\rangle \ \mathbin{::} \ \mathsf{as})\ =\ [e]\ \mathbin{++} \ \operatorname{RaceArmExprs}(\mathsf{as}) \\[0.16em]
\operatorname{Children_LTR}(\operatorname{SyncExpr}(e))\ =\ [e] \\[0.16em]
\operatorname{Children_LTR}(\operatorname{RaceExpr}(\mathsf{arms}))\ =\ \operatorname{RaceArmExprs}(\mathsf{arms}) \\[0.16em]
\operatorname{Children_LTR}(\operatorname{AllExpr}(\mathsf{es}))\ =\ \mathsf{es}
\end{array}
$$

### 21.3.4 Static Semantics

Async iteration over `loop pat in e { body }` is:

**(T-Loop-Iter-Async)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \langle \mathsf{Out}_{r},\ \mathsf{In}_{r},\ \mathsf{Result}_{r},\ E_{r}\rangle \quad \Gamma ;\ R;\ L\ \vdash \ \mathsf{iter}\ :\ T_{\mathsf{iter}}\quad \operatorname{AsyncSig}(T_{\mathsf{iter}})\ =\ \langle \mathsf{Out}_{i},\ \mathsf{In}_{i},\ \mathsf{Result}_{i},\ E_{i}\rangle \quad \mathsf{In}_{i}\ =\ \operatorname{TypePrim}(\texttt{"()"})\quad \Gamma \ \vdash \ E_{i}\ \mathrel{<:} \ E_{r} \\[0.16em]
(\mathsf{ty}_{\mathsf{opt}}\ =\ \bot \ \Rightarrow \ T_{p}\ =\ \mathsf{Out}_{i})\quad (\mathsf{ty}_{\mathsf{opt}}\ =\ T_{a}\ \Rightarrow \ \Gamma \ \vdash \ \mathsf{Out}_{i}\ \mathrel{<:} \ T_{a}\ \land \ T_{p}\ =\ T_{a}) \\[0.16em]
\Gamma \ \vdash \ \mathsf{pat}\ \Leftarrow \ T_{p}\ \dashv \ B\quad \operatorname{Distinct}(\operatorname{PatNames}(\mathsf{pat}))\quad \operatorname{LoopInvOk}(\mathsf{inv}_{\mathsf{opt}}) \\[0.16em]
\Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \operatorname{IntroAll}(\Gamma_{0} ,\ B)\ \Downarrow \ \Gamma_{1}  \\[0.16em]
\Gamma_{1} ;\ R;\ \texttt{loop}\ \vdash \ \operatorname{BlockInfo}(\mathsf{body})\ \Downarrow \ \langle T_{b},\ \mathsf{Brk},\ \mathsf{BrkVoid}\rangle \quad \operatorname{LoopTypeFin}(\mathsf{Brk},\ \mathsf{BrkVoid})\ =\ T_{r} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{LoopIter}(\mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{iter},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body})\ :\ T_{r}
\end{array}
$$

**(Loop-Async-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{iter}\ :\ T_{\mathsf{iter}}\quad \operatorname{AsyncSig}(T_{\mathsf{iter}})\ =\ \langle \mathsf{Out}_{i},\ \mathsf{In}_{i},\ \mathsf{Result}_{i},\ E_{i}\rangle \quad (\operatorname{AsyncSig}(R)\ =\ \bot \ \lor \ \mathsf{In}_{i}\ \ne \ \operatorname{TypePrim}(\texttt{"()"})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{LoopIter}(\mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{iter},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body})\ \Uparrow 
\end{array}
$$

Manual stepping is permitted by ordinary modal-state inspection and `a~>resume(input)`. It is required when an async value has `In ≠ ()`.

`sync` typing is:

$$
\begin{array}{l}
\operatorname{YieldInExpr}(e)\ \Leftrightarrow \ \exists \ e'\ \in \ \operatorname{SubExprsList}([e]).\ e'\ =\ \operatorname{YieldExpr}(\_,\ \_) \\[0.16em]
\operatorname{YieldFromInExpr}(e)\ \Leftrightarrow \ \exists \ e'\ \in \ \operatorname{SubExprsList}([e]).\ e'\ =\ \operatorname{YieldFromExpr}(\_,\ \_)
\end{array}
$$

**(Sync-Yield-Err)**

$$
\begin{array}{l}
\operatorname{YieldInExpr}(e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{SyncExpr}(e)\ \Uparrow 
\end{array}
$$

**(Sync-YieldFrom-Err)**

$$
\begin{array}{l}
\operatorname{YieldFromInExpr}(e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{SyncExpr}(e)\ \Uparrow 
\end{array}
$$

**(T-Sync)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \bot \quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ T_{e}\quad \operatorname{AsyncSig}(T_{e})\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle \quad \mathsf{Out}\ =\ \operatorname{TypePrim}(\texttt{"()"})\quad \mathsf{In}\ =\ \operatorname{TypePrim}(\texttt{"()"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{SyncExpr}(e)\ :\ \operatorname{TypeUnion}([\mathsf{Result},\ E])
\end{array}
$$

**(Sync-Async-Context-Err)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ \ne \ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{SyncExpr}(e)\ \Uparrow 
\end{array}
$$

**(Sync-Out-Err)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \bot \quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ T_{e} \\[0.16em]
(\operatorname{AsyncSig}(T_{e})\ =\ \bot \ \lor \ (\operatorname{AsyncSig}(T_{e})\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle \ \land \ \mathsf{Out}\ \ne \ \operatorname{TypePrim}(\texttt{"()"}))) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{SyncExpr}(e)\ \Uparrow 
\end{array}
$$

**(Sync-In-Err)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \bot \quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ T_{e}\quad \operatorname{AsyncSig}(T_{e})\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle \quad \mathsf{Out}\ =\ \operatorname{TypePrim}(\texttt{"()"})\quad \mathsf{In}\ \ne \ \operatorname{TypePrim}(\texttt{"()"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{SyncExpr}(e)\ \Uparrow 
\end{array}
$$

`race` typing is:

$$
\begin{array}{l}
\operatorname{RaceMode}(\mathsf{arms})\ = \\[0.16em]
\ \{\ \texttt{return}\quad \mathsf{if}\ \forall \ \mathsf{arm}\ \in \ \mathsf{arms}.\ \mathsf{arm}.\mathsf{handler}\ =\ \operatorname{RaceReturn}(\_) \\[0.16em]
\quad \texttt{yield}\quad \mathsf{if}\ \forall \ \mathsf{arm}\ \in \ \mathsf{arms}.\ \mathsf{arm}.\mathsf{handler}\ =\ \operatorname{RaceYield}(\_) \\[0.16em]
\quad \bot \quad \mathsf{otherwise}\ \}
\end{array}
$$

**(T-Race)**

$$
\begin{array}{l}
n\ =\ \mid \mathsf{arms}\mid \quad n\ \ge \ 2\quad \operatorname{RaceMode}(\mathsf{arms})\ =\ \texttt{return} \\[0.16em]
\forall \ i,\ \mathsf{arm}_{i}\ =\ \langle e_{i},\ \mathsf{pat}_{i},\ \operatorname{RaceReturn}(r_{i})\rangle \quad \Gamma ;\ R;\ L\ \vdash \ e_{i}\ :\ T_{i}\quad \operatorname{AsyncSig}(T_{i})\ =\ \langle \mathsf{Out}_{i},\ \mathsf{In}_{i},\ \mathsf{Result}_{i},\ E_{i}\rangle  \\[0.16em]
\mathsf{Out}_{i}\ =\ \operatorname{TypePrim}(\texttt{"()"})\quad \mathsf{In}_{i}\ =\ \operatorname{TypePrim}(\texttt{"()"})\quad \Gamma \ \vdash \ \mathsf{pat}_{i}\ \Leftarrow \ \mathsf{Result}_{i}\ \dashv \ B_{i}\quad \operatorname{Distinct}(\operatorname{PatNames}(\mathsf{pat}_{i})) \\[0.16em]
\Gamma_{i} \ =\ \operatorname{IntroAll}(\Gamma ,\ B_{i})\quad \Gamma_{i} ;\ R;\ L\ \vdash \ r_{i}\ :\ T_{i}^r\quad \mathsf{AllEq}\_\Gamma ([T_{1}^r,\ \ldots ,\ T_{n}^r])\quad T_{r}\ =\ T_{1}^r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{RaceExpr}(\mathsf{arms})\ :\ \operatorname{TypeUnion}([T_{r},\ E_{1},\ \ldots ,\ E_{n}])
\end{array}
$$

**(T-Race-Stream)**

$$
\begin{array}{l}
n\ =\ \mid \mathsf{arms}\mid \quad n\ \ge \ 2\quad \operatorname{RaceMode}(\mathsf{arms})\ =\ \texttt{yield} \\[0.16em]
\forall \ i,\ \mathsf{arm}_{i}\ =\ \langle e_{i},\ \mathsf{pat}_{i},\ \operatorname{RaceYield}(r_{i})\rangle \quad \Gamma ;\ R;\ L\ \vdash \ e_{i}\ :\ T_{i}\quad \operatorname{AsyncSig}(T_{i})\ =\ \langle \mathsf{Out}_{i},\ \mathsf{In}_{i},\ \mathsf{Result}_{i},\ E_{i}\rangle  \\[0.16em]
\mathsf{In}_{i}\ =\ \operatorname{TypePrim}(\texttt{"()"})\quad \Gamma \ \vdash \ \mathsf{pat}_{i}\ \Leftarrow \ \mathsf{Out}_{i}\ \dashv \ B_{i}\quad \operatorname{Distinct}(\operatorname{PatNames}(\mathsf{pat}_{i})) \\[0.16em]
\Gamma_{i} \ =\ \operatorname{IntroAll}(\Gamma ,\ B_{i})\quad \Gamma_{i} ;\ R;\ L\ \vdash \ r_{i}\ :\ U_{i}\quad \mathsf{AllEq}\_\Gamma ([U_{1},\ \ldots ,\ U_{n}])\quad U\ =\ U_{1} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{RaceExpr}(\mathsf{arms})\ :\ \operatorname{TypeApply}([\texttt{"Stream"}],\ [U,\ \operatorname{TypeUnion}([E_{1},\ \ldots ,\ E_{n}])])
\end{array}
$$

**(Race-Arity-Err)**

$$
\begin{array}{l}
n\ =\ \mid \mathsf{arms}\mid \quad n\ <\ 2 \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{RaceExpr}(\mathsf{arms})\ \Uparrow 
\end{array}
$$

**(Race-Handler-Mix-Err)**

$$
\begin{array}{l}
\operatorname{RaceMode}(\mathsf{arms})\ =\ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{RaceExpr}(\mathsf{arms})\ \Uparrow 
\end{array}
$$

**(Race-Operand-Out-Err)**

$$
\begin{array}{l}
\operatorname{RaceMode}(\mathsf{arms})\ =\ \texttt{return} \\[0.16em]
\exists \ i.\ \Gamma ;\ R;\ L\ \vdash \ e_{i}\ :\ T_{i}\ \land \ (\operatorname{AsyncSig}(T_{i})\ =\ \langle \mathsf{Out}_{i},\ \mathsf{In}_{i},\ \mathsf{Result}_{i},\ E_{i}\rangle \ \land \ \mathsf{Out}_{i}\ \ne \ \operatorname{TypePrim}(\texttt{"()"})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{RaceExpr}(\mathsf{arms})\ \Uparrow 
\end{array}
$$

**(Race-Operand-Err)**

$$
\begin{array}{l}
\operatorname{RaceMode}(\mathsf{arms})\ =\ \texttt{return} \\[0.16em]
\exists \ i.\ \Gamma ;\ R;\ L\ \vdash \ e_{i}\ :\ T_{i}\ \land \ (\operatorname{AsyncSig}(T_{i})\ =\ \bot \ \lor \ (\operatorname{AsyncSig}(T_{i})\ =\ \langle \mathsf{Out}_{i},\ \mathsf{In}_{i},\ \mathsf{Result}_{i},\ E_{i}\rangle \ \land \ \mathsf{Out}_{i}\ =\ \operatorname{TypePrim}(\texttt{"()"})\ \land \ \mathsf{In}_{i}\ \ne \ \operatorname{TypePrim}(\texttt{"()"}))) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{RaceExpr}(\mathsf{arms})\ \Uparrow 
\end{array}
$$

**(Race-Stream-Operand-Err)**

$$
\begin{array}{l}
\operatorname{RaceMode}(\mathsf{arms})\ =\ \texttt{yield} \\[0.16em]
\exists \ i.\ \Gamma ;\ R;\ L\ \vdash \ e_{i}\ :\ T_{i}\ \land \ (\operatorname{AsyncSig}(T_{i})\ =\ \bot \ \lor \ (\operatorname{AsyncSig}(T_{i})\ =\ \langle \mathsf{Out}_{i},\ \mathsf{In}_{i},\ \mathsf{Result}_{i},\ E_{i}\rangle \ \land \ \mathsf{In}_{i}\ \ne \ \operatorname{TypePrim}(\texttt{"()"}))) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{RaceExpr}(\mathsf{arms})\ \Uparrow 
\end{array}
$$

**(Race-Handler-Type-Err)**

$$
\begin{array}{l}
n\ =\ \mid \mathsf{arms}\mid \quad n\ \ge \ 2\quad \operatorname{RaceMode}(\mathsf{arms})\ =\ \texttt{return} \\[0.16em]
\forall \ i,\ \mathsf{arm}_{i}\ =\ \langle e_{i},\ \mathsf{pat}_{i},\ \operatorname{RaceReturn}(r_{i})\rangle \quad \Gamma ;\ R;\ L\ \vdash \ e_{i}\ :\ T_{i}\quad \operatorname{AsyncSig}(T_{i})\ =\ \langle \mathsf{Out}_{i},\ \mathsf{In}_{i},\ \mathsf{Result}_{i},\ E_{i}\rangle  \\[0.16em]
\mathsf{Out}_{i}\ =\ \operatorname{TypePrim}(\texttt{"()"})\quad \mathsf{In}_{i}\ =\ \operatorname{TypePrim}(\texttt{"()"})\quad \Gamma \ \vdash \ \mathsf{pat}_{i}\ \Leftarrow \ \mathsf{Result}_{i}\ \dashv \ B_{i}\quad \operatorname{Distinct}(\operatorname{PatNames}(\mathsf{pat}_{i})) \\[0.16em]
\Gamma_{i} \ =\ \operatorname{IntroAll}(\Gamma ,\ B_{i})\quad \Gamma_{i} ;\ R;\ L\ \vdash \ r_{i}\ :\ T_{i}^r\quad \lnot \ \mathsf{AllEq}\_\Gamma ([T_{1}^r,\ \ldots ,\ T_{n}^r]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{RaceExpr}(\mathsf{arms})\ \Uparrow 
\end{array}
$$

**(Race-Stream-Handler-Type-Err)**

$$
\begin{array}{l}
n\ =\ \mid \mathsf{arms}\mid \quad n\ \ge \ 2\quad \operatorname{RaceMode}(\mathsf{arms})\ =\ \texttt{yield} \\[0.16em]
\forall \ i,\ \mathsf{arm}_{i}\ =\ \langle e_{i},\ \mathsf{pat}_{i},\ \operatorname{RaceYield}(r_{i})\rangle \quad \Gamma ;\ R;\ L\ \vdash \ e_{i}\ :\ T_{i}\quad \operatorname{AsyncSig}(T_{i})\ =\ \langle \mathsf{Out}_{i},\ \mathsf{In}_{i},\ \mathsf{Result}_{i},\ E_{i}\rangle  \\[0.16em]
\mathsf{In}_{i}\ =\ \operatorname{TypePrim}(\texttt{"()"})\quad \Gamma \ \vdash \ \mathsf{pat}_{i}\ \Leftarrow \ \mathsf{Out}_{i}\ \dashv \ B_{i}\quad \operatorname{Distinct}(\operatorname{PatNames}(\mathsf{pat}_{i})) \\[0.16em]
\Gamma_{i} \ =\ \operatorname{IntroAll}(\Gamma ,\ B_{i})\quad \Gamma_{i} ;\ R;\ L\ \vdash \ r_{i}\ :\ U_{i}\quad \lnot \ \mathsf{AllEq}\_\Gamma ([U_{1},\ \ldots ,\ U_{n}]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{RaceExpr}(\mathsf{arms})\ \Uparrow 
\end{array}
$$

`all` typing is:

**(T-All)**

$$
\begin{array}{l}
n\ =\ \mid \mathsf{exprs}\mid \quad \forall \ i,\ \Gamma ;\ R;\ L\ \vdash \ e_{i}\ :\ T_{i}\quad \operatorname{AsyncSig}(T_{i})\ =\ \langle \mathsf{Out}_{i},\ \mathsf{In}_{i},\ \mathsf{Result}_{i},\ E_{i}\rangle  \\[0.16em]
\mathsf{Out}_{i}\ =\ \operatorname{TypePrim}(\texttt{"()"})\quad \mathsf{In}_{i}\ =\ \operatorname{TypePrim}(\texttt{"()"})\quad T_{\mathsf{tuple}}\ =\ \operatorname{TypeTuple}([\mathsf{Result}_{1},\ \ldots ,\ \mathsf{Result}_{n}]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{AllExpr}([e_{1},\ \ldots ,\ e_{n}])\ :\ \operatorname{TypeUnion}([T_{\mathsf{tuple}},\ E_{1},\ \ldots ,\ E_{n}])
\end{array}
$$

**(All-Out-Err)**

$$
\begin{array}{l}
\exists \ i.\ \Gamma ;\ R;\ L\ \vdash \ e_{i}\ :\ T_{i}\ \land \ (\operatorname{AsyncSig}(T_{i})\ =\ \bot \ \lor \ (\operatorname{AsyncSig}(T_{i})\ =\ \langle \mathsf{Out}_{i},\ \mathsf{In}_{i},\ \mathsf{Result}_{i},\ E_{i}\rangle \ \land \ \mathsf{Out}_{i}\ \ne \ \operatorname{TypePrim}(\texttt{"()"}))) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{AllExpr}(\mathsf{exprs})\ \Uparrow 
\end{array}
$$

**(All-In-Err)**

$$
\begin{array}{l}
\exists \ i.\ \Gamma ;\ R;\ L\ \vdash \ e_{i}\ :\ T_{i}\ \land \ (\operatorname{AsyncSig}(T_{i})\ =\ \langle \mathsf{Out}_{i},\ \mathsf{In}_{i},\ \mathsf{Result}_{i},\ E_{i}\rangle \ \land \ \mathsf{Out}_{i}\ =\ \operatorname{TypePrim}(\texttt{"()"})\ \land \ \mathsf{In}_{i}\ \ne \ \operatorname{TypePrim}(\texttt{"()"})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{AllExpr}(\mathsf{exprs})\ \Uparrow 
\end{array}
$$

`until` has the source-specified type:

$$
\mathsf{until}\ :\ \mathsf{shared}\ T\ \times \ \operatorname{procedure}(\mathsf{const}\ T)\ \to \ \mathsf{bool}\ \times \ \operatorname{procedure}(\mathsf{unique}\ T)\ \to \ R\ \to \ \mathsf{Future}<R>
$$

Async combinator typing is:

$$
\begin{array}{l}
\mathsf{map}\quad :\ \mathsf{Async}<\mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E>\ \times \ \operatorname{procedure}(\mathsf{Out})\ \to \ U\ \to \ \mathsf{Async}<U,\ \mathsf{In},\ \mathsf{Result},\ E> \\[0.16em]
\mathsf{filter}\ :\ \mathsf{Async}<T,\ (),\ (),\ E>\ \times \ \operatorname{procedure}(\mathsf{const}\ T)\ \to \ \mathsf{bool}\ \to \ \mathsf{Async}<T,\ (),\ (),\ E> \\[0.16em]
\mathsf{take}\ :\ \mathsf{Async}<T,\ (),\ (),\ E>\ \times \ \mathsf{usize}\ \to \ \mathsf{Async}<T,\ (),\ (),\ E> \\[0.16em]
\mathsf{fold}\ :\ \mathsf{Async}<T,\ (),\ (),\ E>\ \times \ A\ \times \ \operatorname{procedure}(A,\ T)\ \to \ A\ \to \ \mathsf{Future}<A,\ E> \\[0.16em]
\mathsf{chain}\ :\ \mathsf{Future}<T,\ E>\ \times \ \operatorname{procedure}(T)\ \to \ \mathsf{Future}<U,\ E>\ \to \ \mathsf{Future}<U,\ E>
\end{array}
$$

For `e~>name(args)`, if `StripPerm(ExprType(e)) = ModalRefType(modal_ref)` and `BuiltinModalGeneralMember(modal_ref, name)`, typing MUST be derived by the async combinator rules in this section.

A conforming implementation MUST resolve `AsyncCombinatorNames` through built-in modal member lookup on `Async` (including aliases normalized via `AsyncSig`) and MUST NOT treat these members as non-modal ad hoc method-call exceptions.

**(T-Async-Map)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ a\ :\ \operatorname{TypeApply}([\texttt{"Async"}],\ [\mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E])\quad \Gamma ;\ R;\ L\ \vdash \ f\ :\ (\mathsf{Out})\ \to \ U \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ a\sim{}>\operatorname{map}(f)\ :\ \operatorname{TypeApply}([\texttt{"Async"}],\ [U,\ \mathsf{In},\ \mathsf{Result},\ E])
\end{array}
$$

**(T-Async-Filter)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ a\ :\ \operatorname{TypeApply}([\texttt{"Async"}],\ [T,\ \operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePrim}(\texttt{"()"}),\ E])\quad \Gamma ;\ R;\ L\ \vdash \ p\ :\ (\operatorname{TypePerm}(\texttt{const},\ T))\ \to \ \operatorname{TypePrim}(\texttt{"bool"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ a\sim{}>\operatorname{filter}(p)\ :\ \operatorname{TypeApply}([\texttt{"Async"}],\ [T,\ \operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePrim}(\texttt{"()"}),\ E])
\end{array}
$$

**(T-Async-Take)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ a\ :\ \operatorname{TypeApply}([\texttt{"Async"}],\ [T,\ \operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePrim}(\texttt{"()"}),\ E])\quad \Gamma ;\ R;\ L\ \vdash \ n\ :\ \operatorname{TypePrim}(\texttt{"usize"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ a\sim{}>\operatorname{take}(n)\ :\ \operatorname{TypeApply}([\texttt{"Async"}],\ [T,\ \operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePrim}(\texttt{"()"}),\ E])
\end{array}
$$

**(T-Async-Fold)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ a\ :\ \operatorname{TypeApply}([\texttt{"Async"}],\ [T,\ \operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePrim}(\texttt{"()"}),\ E])\quad \Gamma ;\ R;\ L\ \vdash \ \mathsf{init}\ :\ A\quad \Gamma ;\ R;\ L\ \vdash \ f\ :\ (A,\ T)\ \to \ A \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ a\sim{}>\operatorname{fold}(\mathsf{init},\ f)\ :\ \operatorname{TypeApply}([\texttt{"Future"}],\ [A,\ E])
\end{array}
$$

**(T-Async-Chain)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ a\ :\ \operatorname{TypeApply}([\texttt{"Future"}],\ [T,\ E])\quad \Gamma ;\ R;\ L\ \vdash \ f\ :\ (T)\ \to \ \operatorname{TypeApply}([\texttt{"Future"}],\ [U,\ E]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ a\sim{}>\operatorname{chain}(f)\ :\ \operatorname{TypeApply}([\texttt{"Future"}],\ [U,\ E])
\end{array}
$$

### 21.3.5 Dynamic Semantics

Async iteration over `loop pat in e { body }` is:

1. Evaluate `e` to `a`.
2. If `a` is `@Suspended { output }`, bind `output` to `pat`, execute `body`, and resume with `()`.
3. If `a` is `@Completed { value }`, terminate the loop.
4. If `a` is `@Failed { error }`, propagate the error from the enclosing async procedure.

Manual stepping advances an async value by inspecting its modal state and invoking `~>resume(input)` on `@Suspended`.

`sync` evaluation is:

1. Evaluate `e` to `a`.
2. While `a` is `@Suspended { output = () }`, set `a := a~>resume(())`.
3. If `a` is `@Completed { value }`, produce `value`.
4. If `a` is `@Failed { error }`, produce the union error value.

Formal `sync` rules:

$$
\mathsf{SyncStep}\ :\ \mathsf{AsyncValue}\ \times \ \mathsf{State}\ \to \ \mathsf{AsyncValue}\ \times \ \mathsf{State}
$$

**(SyncStep-Suspended)**

$$
\begin{array}{l}
\operatorname{ModalState}(a)\ =\ @\mathsf{Suspended}\quad a.\mathsf{output}\ =\ ()\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Resume}(a,\ ()),\ \sigma )\ \Downarrow \ (\operatorname{Val}(a'),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{SyncStep}(a,\ \sigma )\ \Downarrow \ (a',\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Sync-Suspended)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(a),\ \sigma_{1} )\quad \operatorname{ModalState}(a)\ =\ @\mathsf{Suspended}\quad \Gamma \ \vdash \ \operatorname{SyncStep}(a,\ \sigma_{1} )\ \Downarrow \ (a',\ \sigma_{2} ) \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{SyncExpr}(a'),\ \sigma_{2} )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{SyncExpr}(e),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} )
\end{array}
$$

**(EvalSigma-Sync-Completed)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(a),\ \sigma_{1} )\quad \operatorname{ModalState}(a)\ =\ @\mathsf{Completed}\quad a.\mathsf{value}\ =\ v \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{SyncExpr}(e),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Sync-Failed)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(a),\ \sigma_{1} )\quad \operatorname{ModalState}(a)\ =\ @\mathsf{Failed}\quad a.\mathsf{error}\ =\ \mathsf{err} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{SyncExpr}(e),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{err}),\ \sigma_{1} )
\end{array}
$$

`race` return-mode evaluation is:

1. Initiate all async expressions concurrently.
2. When any arm completes or fails, handle that arm.
3. Cancel all remaining arms.
4. Produce the selected handler result or propagated error value.

`race` streaming-mode evaluation is:

1. Initiate all async expressions concurrently.
2. When an arm yields, execute the corresponding handler and emit its value as the next stream output.
3. When an arm completes, remove it from the race.
4. When all arms complete, the stream completes.
5. If any arm fails, propagate the error and cancel remaining arms.

Formal `race` rules:

$$
\begin{array}{l}
\operatorname{SelectReady}(\mathsf{asyncs})\ =\ (\mathsf{index},\ \mathsf{async}_{\mathsf{value}})\ \Leftrightarrow  \\[0.16em]
\ \mathsf{asyncs}\ =\ [a_{1},\ \ldots ,\ a_{n}]\ \land  \\[0.16em]
\ \exists \ i\ \in \ [1..n].\ \operatorname{ModalState}(a_{i})\ =\ @\mathsf{Suspended}\ \land \ \operatorname{IsReady}(a_{i})\ \land  \\[0.16em]
\ (\forall \ j\ <\ i.\ \lnot \operatorname{IsReady}(a_{j})\ \lor \ \operatorname{ModalState}(a_{j})\ \ne \ @\mathsf{Suspended})\ \land  \\[0.16em]
\ \mathsf{index}\ =\ i\ \land  \\[0.16em]
\ \mathsf{async}_{\mathsf{value}}\ =\ a_{i} \\[0.16em]
\operatorname{SelectReadyAny}(\mathsf{asyncs})\ =\ (\mathsf{index},\ \mathsf{async}_{\mathsf{value}})\ \Leftrightarrow  \\[0.16em]
\ \mathsf{asyncs}\ =\ [a_{1},\ \ldots ,\ a_{n}]\ \land  \\[0.16em]
\ \exists \ i\ \in \ [1..n].\ (\operatorname{ModalState}(a_{i})\ =\ @\mathsf{Completed}\ \lor \ \operatorname{ModalState}(a_{i})\ =\ @\mathsf{Failed}\ \lor \ (\operatorname{ModalState}(a_{i})\ =\ @\mathsf{Suspended}\ \land \ \operatorname{IsReady}(a_{i})))\ \land  \\[0.16em]
\ (\forall \ j\ <\ i.\ \operatorname{ModalState}(a_{j})\ =\ @\mathsf{Suspended}\ \land \ \lnot \operatorname{IsReady}(a_{j}))\ \land  \\[0.16em]
\ \mathsf{index}\ =\ i\ \land  \\[0.16em]
\ \mathsf{async}_{\mathsf{value}}\ =\ a_{i} \\[0.16em]
\mathsf{RaceState}\ =\ \{\ \mathsf{active}:\ [\mathsf{AsyncValue}],\ \mathsf{completed}:\ \mathsf{Option}<(\mathsf{Index},\ \mathsf{AsyncValue})>,\ \mathsf{mode}:\ \texttt{return}\ \mid \ \texttt{yield}\ \} \\[0.16em]
\mathsf{InitRace}\ :\ [\mathsf{RaceArm}]\ \times \ \mathsf{State}\ \to \ \mathsf{RaceState}\ \times \ \mathsf{State}
\end{array}
$$

**(InitRace)**

$$
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{arm}_{i}.\mathsf{expr},\ \sigma_{i} )\ \Downarrow \ (\operatorname{Val}(a_{i}),\ \sigma \_\{i+1\})\quad \mathsf{mode}\ =\ \operatorname{RaceMode}(\mathsf{arms}) \\[0.16em]
\mathsf{race}_{\mathsf{state}}\ =\ \{\ \mathsf{active}:\ [a_{1},\ \ldots ,\ a_{n}],\ \mathsf{completed}:\ \bot ,\ \mathsf{mode}:\ \mathsf{mode}\ \} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{InitRace}(\mathsf{arms},\ \sigma_{0} )\ \Downarrow \ (\mathsf{race}_{\mathsf{state}},\ \sigma_{n} )
\end{array}
$$

$$
\mathsf{RaceStepReturn}\ :\ \mathsf{RaceState}\ \times \ [\mathsf{RaceArm}]\ \times \ \mathsf{State}\ \to \ \mathsf{EvalOut}\ \times \ \mathsf{State}
$$

**(RaceStepReturn-Completed)**

$$
\begin{array}{l}
\exists \ i.\ \operatorname{ModalState}(\mathsf{race}_{\mathsf{state}}.\mathsf{active}[i])\ =\ @\mathsf{Completed}\quad a_{i}\ =\ \mathsf{race}_{\mathsf{state}}.\mathsf{active}[i]\quad a_{i}.\mathsf{value}\ =\ v \\[0.16em]
\mathsf{arm}_{i}\ =\ \mathsf{arms}[i]\quad \Gamma \ \vdash \ \operatorname{BindPattern}(\mathsf{arm}_{i}.\mathsf{pat},\ v)\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} \ \vdash \ \operatorname{EvalSigma}(\mathsf{arm}_{i}.\mathsf{handler}.\mathsf{expr},\ \sigma )\ \Downarrow \ (\operatorname{Val}(r),\ \sigma_{1} ) \\[0.16em]
\operatorname{CancelAll}(\mathsf{race}_{\mathsf{state}}.\mathsf{active}\ \setminus \ \{a_{i}\},\ \sigma_{1} )\ \Downarrow \ \sigma_{2}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RaceStepReturn}(\mathsf{race}_{\mathsf{state}},\ \mathsf{arms},\ \sigma )\ \Downarrow \ (\operatorname{Val}(r),\ \sigma_{2} )
\end{array}
$$

**(RaceStepReturn-Failed)**

$$
\begin{array}{l}
\exists \ i.\ \operatorname{ModalState}(\mathsf{race}_{\mathsf{state}}.\mathsf{active}[i])\ =\ @\mathsf{Failed}\quad a_{i}\ =\ \mathsf{race}_{\mathsf{state}}.\mathsf{active}[i]\quad a_{i}.\mathsf{error}\ =\ e \\[0.16em]
\operatorname{CancelAll}(\mathsf{race}_{\mathsf{state}}.\mathsf{active}\ \setminus \ \{a_{i}\},\ \sigma )\ \Downarrow \ \sigma_{1}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RaceStepReturn}(\mathsf{race}_{\mathsf{state}},\ \mathsf{arms},\ \sigma )\ \Downarrow \ (\operatorname{Val}(e),\ \sigma_{1} )
\end{array}
$$

**(RaceStepReturn-Continue)**

$$
\begin{array}{l}
\forall \ i.\ \operatorname{ModalState}(\mathsf{race}_{\mathsf{state}}.\mathsf{active}[i])\ =\ @\mathsf{Suspended} \\[0.16em]
\operatorname{SelectReady}(\mathsf{race}_{\mathsf{state}}.\mathsf{active})\ =\ (j,\ a_{j})\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Resume}(a_{j},\ ()),\ \sigma )\ \Downarrow \ (\operatorname{Val}(a_{j}'),\ \sigma_{1} ) \\[0.16em]
\mathsf{race}_{\mathsf{state}}'\ =\ \mathsf{race}_{\mathsf{state}}[\mathsf{active}[j]\ \mapsto \ a_{j}']\quad \Gamma \ \vdash \ \operatorname{RaceStepReturn}(\mathsf{race}_{\mathsf{state}}',\ \mathsf{arms},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RaceStepReturn}(\mathsf{race}_{\mathsf{state}},\ \mathsf{arms},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Race-Return)**

$$
\begin{array}{l}
\operatorname{RaceMode}(\mathsf{arms})\ =\ \texttt{return}\quad \Gamma \ \vdash \ \operatorname{InitRace}(\mathsf{arms},\ \sigma )\ \Downarrow \ (\mathsf{race}_{\mathsf{state}},\ \sigma_{1} ) \\[0.16em]
\Gamma \ \vdash \ \operatorname{RaceStepReturn}(\mathsf{race}_{\mathsf{state}},\ \mathsf{arms},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{RaceExpr}(\mathsf{arms}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

$$
\mathsf{RaceStepStream}\ :\ \mathsf{RaceState}\ \times \ [\mathsf{RaceArm}]\ \times \ \mathsf{State}\ \to \ \mathsf{EvalOut}\ \times \ \mathsf{State}
$$

**(RaceStepStream-Yield)**

$$
\begin{array}{l}
\exists \ i.\ \operatorname{ModalState}(\mathsf{race}_{\mathsf{state}}.\mathsf{active}[i])\ =\ @\mathsf{Suspended}\quad a_{i}\ =\ \mathsf{race}_{\mathsf{state}}.\mathsf{active}[i]\quad a_{i}.\mathsf{output}\ =\ v \\[0.16em]
\mathsf{arm}_{i}\ =\ \mathsf{arms}[i]\quad \Gamma \ \vdash \ \operatorname{BindPattern}(\mathsf{arm}_{i}.\mathsf{pat},\ v)\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} \ \vdash \ \operatorname{EvalSigma}(\mathsf{arm}_{i}.\mathsf{handler}.\mathsf{expr},\ \sigma )\ \Downarrow \ (\operatorname{Val}(u),\ \sigma_{1} ) \\[0.16em]
\mathsf{stream}_{\mathsf{state}}\ =\ \{\ \mathsf{race}_{\mathsf{state}}:\ \mathsf{race}_{\mathsf{state}},\ \mathsf{pending}_{\mathsf{yield}}:\ (i,\ u)\ \} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RaceStepStream}(\mathsf{race}_{\mathsf{state}},\ \mathsf{arms},\ \sigma )\ \Downarrow \ (\operatorname{Suspend}(\operatorname{AsyncSuspended}(u,\ \mathsf{stream}_{\mathsf{state}})),\ \sigma_{1} )
\end{array}
$$

**(RaceStepStream-AllComplete)**

$$
\begin{array}{l}
\forall \ i.\ \operatorname{ModalState}(\mathsf{race}_{\mathsf{state}}.\mathsf{active}[i])\ =\ @\mathsf{Completed} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RaceStepStream}(\mathsf{race}_{\mathsf{state}},\ \mathsf{arms},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{AsyncCompleted}(())),\ \sigma )
\end{array}
$$

**(RaceStepStream-Failed)**

$$
\begin{array}{l}
\exists \ i.\ \operatorname{ModalState}(\mathsf{race}_{\mathsf{state}}.\mathsf{active}[i])\ =\ @\mathsf{Failed}\quad a_{i}\ =\ \mathsf{race}_{\mathsf{state}}.\mathsf{active}[i]\quad a_{i}.\mathsf{error}\ =\ e \\[0.16em]
\operatorname{CancelAll}(\mathsf{race}_{\mathsf{state}}.\mathsf{active}\ \setminus \ \{a_{i}\},\ \sigma )\ \Downarrow \ \sigma_{1}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RaceStepStream}(\mathsf{race}_{\mathsf{state}},\ \mathsf{arms},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{AsyncFailed}(e)),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Race-Stream)**

$$
\begin{array}{l}
\operatorname{RaceMode}(\mathsf{arms})\ =\ \texttt{yield}\quad \Gamma \ \vdash \ \operatorname{InitRace}(\mathsf{arms},\ \sigma )\ \Downarrow \ (\mathsf{race}_{\mathsf{state}},\ \sigma_{1} ) \\[0.16em]
\Gamma \ \vdash \ \operatorname{RaceStepStream}(\mathsf{race}_{\mathsf{state}},\ \mathsf{arms},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{RaceExpr}(\mathsf{arms}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

$$
\mathsf{CancelAll}\ :\ [\mathsf{AsyncValue}]\ \times \ \mathsf{State}\ \to \ \mathsf{State}
$$

**(CancelAll)**

$$
\begin{array}{l}
\forall \ a\ \in \ \mathsf{asyncs}.\ \operatorname{Cancel}(a)\ \Downarrow \ () \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{CancelAll}(\mathsf{asyncs},\ \sigma )\ \Downarrow \ \sigma 
\end{array}
$$

Streaming-race suspension state is:

$$
\begin{array}{l}
\mathsf{RaceStreamState}\ =\ \{\ \mathsf{race}_{\mathsf{state}}:\ \mathsf{RaceState},\ \mathsf{yielded}_{\mathsf{arm}}:\ \mathsf{Index}\ \} \\[0.16em]
\operatorname{RaceResumeOrder}(\mathsf{state},\ \mathsf{arms})\ =\ [\mathsf{state}.\mathsf{yielded}_{\mathsf{arm}}]\ \mathbin{++} \ [j\ \mid \ 1\ \le \ j\ \le \ \mid \mathsf{arms}\mid \ \land \ j\ \ne \ \mathsf{state}.\mathsf{yielded}_{\mathsf{arm}}\ \land \ \operatorname{ModalState}(\mathsf{state}.\mathsf{race}_{\mathsf{state}}.\mathsf{active}[j])\ \ne \ @\mathsf{Completed}] \\[0.16em]
\operatorname{ResumeRaceArm}(a,\ \sigma )\ \Downarrow \ (a',\ \sigma ')\ \Leftrightarrow \ \operatorname{ModalState}(a)\ =\ @\mathsf{Suspended}\ \land \ \Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Resume}(a,\ ()),\ \sigma )\ \Downarrow \ (\operatorname{Val}(a'),\ \sigma ') \\[0.16em]
\operatorname{ResumeRaceArm}(a,\ \sigma )\ \Downarrow \ (a,\ \sigma )\ \Leftrightarrow \ \operatorname{ModalState}(a)\ =\ @\mathsf{Completed}
\end{array}
$$

**(RaceStepStream-Yield)**

$$
\begin{array}{l}
\exists \ i.\ \operatorname{ModalState}(\mathsf{race}_{\mathsf{state}}.\mathsf{active}[i])\ =\ @\mathsf{Suspended}\quad a_{i}\ =\ \mathsf{race}_{\mathsf{state}}.\mathsf{active}[i]\quad a_{i}.\mathsf{output}\ =\ v \\[0.16em]
\mathsf{arm}_{i}\ =\ \mathsf{arms}[i]\quad \Gamma \ \vdash \ \operatorname{BindPattern}(\mathsf{arm}_{i}.\mathsf{pat},\ v)\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} \ \vdash \ \operatorname{EvalSigma}(\mathsf{arm}_{i}.\mathsf{handler}.\mathsf{expr},\ \sigma )\ \Downarrow \ (\operatorname{Val}(u),\ \sigma_{1} ) \\[0.16em]
\mathsf{stream}_{\mathsf{state}}\ =\ \{\ \mathsf{race}_{\mathsf{state}}:\ \mathsf{race}_{\mathsf{state}},\ \mathsf{yielded}_{\mathsf{arm}}:\ i\ \} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RaceStepStream}(\mathsf{race}_{\mathsf{state}},\ \mathsf{arms},\ \sigma )\ \Downarrow \ (\operatorname{Suspend}(\operatorname{AsyncSuspended}(u,\ \mathsf{stream}_{\mathsf{state}})),\ \sigma_{1} )
\end{array}
$$

**(ResumeRaceState-Step)**

$$
\begin{array}{l}
\mathsf{order}\ =\ [i]\ \mathbin{++} \ \mathsf{rest}\quad a_{i}\ =\ \mathsf{state}.\mathsf{active}[i]\quad \operatorname{ResumeRaceArm}(a_{i},\ \sigma )\ \Downarrow \ (a_{i}',\ \sigma_{1} ) \\[0.16em]
\mathsf{state}'\ =\ \mathsf{state}[\mathsf{active}[i]\ \mapsto \ a_{i}']\quad \Gamma \ \vdash \ \operatorname{ResumeRaceState}(\mathsf{state}',\ \mathsf{rest},\ \sigma_{1} )\ \Downarrow \ (\mathsf{state}'',\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResumeRaceState}(\mathsf{state},\ \mathsf{order},\ \sigma )\ \Downarrow \ (\mathsf{state}'',\ \sigma_{2} )
\end{array}
$$

**(ResumeRaceState-Done)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResumeRaceState}(\mathsf{state},\ [],\ \sigma )\ \Downarrow \ (\mathsf{state},\ \sigma )
\end{array}
$$

**(EvalSigma-Race-Stream-Resume)**

$$
\begin{array}{l}
\mathsf{async}_{\mathsf{state}}\ =\ \operatorname{AsyncSuspended}(\_,\ \mathsf{stream}_{\mathsf{state}})\quad \mathsf{input}\ =\ ()\quad \mathsf{order}\ =\ \operatorname{RaceResumeOrder}(\mathsf{stream}_{\mathsf{state}},\ \mathsf{arms}) \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResumeRaceState}(\mathsf{stream}_{\mathsf{state}}.\mathsf{race}_{\mathsf{state}},\ \mathsf{order},\ \sigma )\ \Downarrow \ (\mathsf{race}_{\mathsf{state}}',\ \sigma_{1} ) \\[0.16em]
\Gamma \ \vdash \ \operatorname{RaceStepStream}(\mathsf{race}_{\mathsf{state}}',\ \mathsf{arms},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Resume}(\mathsf{async}_{\mathsf{state}},\ \mathsf{input}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

On resumption of a streaming `race`, the previously yielded arm MUST resume first. Remaining live arms MUST then resume in arm declaration order. The first resumed arm to yield determines the next stream output. The first resumed arm to fail cancels the remaining live arms and determines the failure result.

`all` evaluation is:

1. Initiate all async expressions concurrently.
2. Wait for all operations to complete.
3. If all succeed, return the result tuple in expression order.
4. If any fails, cancel remaining operations and return the first recorded error value.

Formal `all` rules:

$$
\begin{array}{l}
\mathsf{AllState}\ =\ \{\ \mathsf{active}:\ [\mathsf{AsyncValue}],\ \mathsf{results}:\ [\mathsf{Option}<\mathsf{Value}>],\ \mathsf{failed}:\ \mathsf{Option}<\mathsf{Error}>\ \} \\[0.16em]
\mathsf{InitAll}\ :\ [\mathsf{Expr}]\ \times \ \mathsf{State}\ \to \ \mathsf{AllState}\ \times \ \mathsf{State}
\end{array}
$$

**(InitAll)**

$$
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{EvalSigma}(e_{i},\ \sigma_{i} )\ \Downarrow \ (\operatorname{Val}(a_{i}),\ \sigma \_\{i+1\}) \\[0.16em]
\mathsf{all}_{\mathsf{state}}\ =\ \{\ \mathsf{active}:\ [a_{1},\ \ldots ,\ a_{n}],\ \mathsf{results}:\ [\bot ,\ \ldots ,\ \bot ],\ \mathsf{failed}:\ \bot \ \} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{InitAll}([e_{1},\ \ldots ,\ e_{n}],\ \sigma_{0} )\ \Downarrow \ (\mathsf{all}_{\mathsf{state}},\ \sigma_{n} )
\end{array}
$$

$$
\mathsf{AllStep}\ :\ \mathsf{AllState}\ \times \ \mathsf{State}\ \to \ \mathsf{AllState}\ \times \ \mathsf{State}
$$

**(AllStep-Complete)**

$$
\begin{array}{l}
\exists \ i.\ \operatorname{ModalState}(\mathsf{all}_{\mathsf{state}}.\mathsf{active}[i])\ =\ @\mathsf{Completed}\quad a_{i}\ =\ \mathsf{all}_{\mathsf{state}}.\mathsf{active}[i]\quad a_{i}.\mathsf{value}\ =\ v \\[0.16em]
\mathsf{all}_{\mathsf{state}}'\ =\ \mathsf{all}_{\mathsf{state}}[\mathsf{results}[i]\ \mapsto \ v] \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AllStep}(\mathsf{all}_{\mathsf{state}},\ \sigma )\ \Downarrow \ (\mathsf{all}_{\mathsf{state}}',\ \sigma )
\end{array}
$$

**(AllStep-Failed)**

$$
\begin{array}{l}
\exists \ i.\ \operatorname{ModalState}(\mathsf{all}_{\mathsf{state}}.\mathsf{active}[i])\ =\ @\mathsf{Failed}\quad a_{i}\ =\ \mathsf{all}_{\mathsf{state}}.\mathsf{active}[i]\quad a_{i}.\mathsf{error}\ =\ e\quad \mathsf{all}_{\mathsf{state}}.\mathsf{failed}\ =\ \bot  \\[0.16em]
\mathsf{remaining}\ =\ \{\ a_{j}\ \mid \ j\ \ne \ i\ \land \ \operatorname{ModalState}(a_{j})\ \ne \ @\mathsf{Completed}\ \}\quad \operatorname{CancelAll}(\mathsf{remaining},\ \sigma )\ \Downarrow \ \sigma_{1}  \\[0.16em]
\mathsf{all}_{\mathsf{state}}'\ =\ \mathsf{all}_{\mathsf{state}}[\mathsf{failed}\ \mapsto \ e] \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AllStep}(\mathsf{all}_{\mathsf{state}},\ \sigma )\ \Downarrow \ (\mathsf{all}_{\mathsf{state}}',\ \sigma_{1} )
\end{array}
$$

**(AllStep-Resume)**

$$
\begin{array}{l}
\forall \ i.\ \operatorname{ModalState}(\mathsf{all}_{\mathsf{state}}.\mathsf{active}[i])\ \ne \ @\mathsf{Failed}\quad \exists \ j.\ \mathsf{all}_{\mathsf{state}}.\mathsf{results}[j]\ =\ \bot \ \land \ \operatorname{ModalState}(\mathsf{all}_{\mathsf{state}}.\mathsf{active}[j])\ =\ @\mathsf{Suspended} \\[0.16em]
\operatorname{SelectReady}(\mathsf{all}_{\mathsf{state}}.\mathsf{active})\ =\ (j,\ a_{j})\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Resume}(a_{j},\ ()),\ \sigma )\ \Downarrow \ (\operatorname{Val}(a_{j}'),\ \sigma_{1} ) \\[0.16em]
\mathsf{all}_{\mathsf{state}}'\ =\ \mathsf{all}_{\mathsf{state}}[\mathsf{active}[j]\ \mapsto \ a_{j}'] \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AllStep}(\mathsf{all}_{\mathsf{state}},\ \sigma )\ \Downarrow \ (\mathsf{all}_{\mathsf{state}}',\ \sigma_{1} )
\end{array}
$$

$$
\mathsf{AllLoop}\ :\ \mathsf{AllState}\ \times \ \mathsf{State}\ \to \ \mathsf{EvalOut}\ \times \ \mathsf{State}
$$

**(AllLoop-AllCompleted)**

$$
\begin{array}{l}
\forall \ i.\ \mathsf{all}_{\mathsf{state}}.\mathsf{results}[i]\ \ne \ \bot \quad \mathsf{all}_{\mathsf{state}}.\mathsf{failed}\ =\ \bot \quad \mathsf{tuple}\ =\ (\mathsf{all}_{\mathsf{state}}.\mathsf{results}[1],\ \ldots ,\ \mathsf{all}_{\mathsf{state}}.\mathsf{results}[n]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AllLoop}(\mathsf{all}_{\mathsf{state}},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{tuple}),\ \sigma )
\end{array}
$$

**(AllLoop-Failed)**

$$
\begin{array}{l}
\mathsf{all}_{\mathsf{state}}.\mathsf{failed}\ =\ e\quad e\ \ne \ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AllLoop}(\mathsf{all}_{\mathsf{state}},\ \sigma )\ \Downarrow \ (\operatorname{Val}(e),\ \sigma )
\end{array}
$$

**(AllLoop-Continue)**

$$
\begin{array}{l}
\exists \ i.\ \mathsf{all}_{\mathsf{state}}.\mathsf{results}[i]\ =\ \bot \quad \mathsf{all}_{\mathsf{state}}.\mathsf{failed}\ =\ \bot \quad \Gamma \ \vdash \ \operatorname{AllStep}(\mathsf{all}_{\mathsf{state}},\ \sigma )\ \Downarrow \ (\mathsf{all}_{\mathsf{state}}',\ \sigma_{1} ) \\[0.16em]
\Gamma \ \vdash \ \operatorname{AllLoop}(\mathsf{all}_{\mathsf{state}}',\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AllLoop}(\mathsf{all}_{\mathsf{state}},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-All)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{InitAll}(\mathsf{exprs},\ \sigma )\ \Downarrow \ (\mathsf{all}_{\mathsf{state}},\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{AllLoop}(\mathsf{all}_{\mathsf{state}},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{AllExpr}(\mathsf{exprs}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

`until` evaluation is:

1. If `pred(shared_value)` is true, acquire a Write key for the target path, execute `action(shared_value)`, and complete the future with the result.
2. Otherwise register a waiter record and transition to `@Suspended { output = () }`.
3. On key release, re-evaluate registered waiters and schedule those whose predicates become true.

Async combinators create wrapper async values:

$$
\begin{array}{l}
\mathsf{MappedAsync}\ =\ \langle \mathsf{source},\ f\rangle  \\[0.16em]
\mathsf{FilteredAsync}\ =\ \langle \mathsf{source},\ \mathsf{pred},\ \mathsf{state}\rangle \quad \mathsf{state}\ \in \ \{\mathsf{Pending},\ \mathsf{Done}\} \\[0.16em]
\mathsf{TakeAsync}\ =\ \langle \mathsf{source},\ \mathsf{remaining}\rangle  \\[0.16em]
\mathsf{FoldAsync}\ =\ \langle \mathsf{source},\ \mathsf{acc},\ f\rangle  \\[0.16em]
\mathsf{ChainAsync}\ =\ \langle \mathsf{source},\ f,\ \mathsf{state}\rangle \quad \mathsf{state}\ \in \ \{\mathsf{WaitingSource},\ \operatorname{WaitingChained}(\mathsf{inner})\}
\end{array}
$$

Formal combinator rules:

**(EvalSigma-Map-Create)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(a,\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{src}),\ \sigma ')\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(f,\ \sigma ')\ \Downarrow \ (\operatorname{Val}(\mathsf{fn}),\ \sigma '') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(a\sim{}>\operatorname{map}(f),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{MappedAsync}(\mathsf{src},\ \mathsf{fn})),\ \sigma '')
\end{array}
$$

**(EvalSigma-Map-Resume-Yield)**

$$
\begin{array}{l}
a\ =\ \operatorname{MappedAsync}(\mathsf{src},\ f)\quad \Gamma \ \vdash \ \operatorname{Resume}(\mathsf{src},\ \mathsf{input},\ \sigma )\ \Downarrow \ (@\mathsf{Suspended}\{\mathsf{output}:\ v\},\ \sigma ')\quad \Gamma \ \vdash \ \operatorname{Apply}(f,\ v,\ \sigma ')\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma '') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resume}(a,\ \mathsf{input},\ \sigma )\ \Downarrow \ (@\mathsf{Suspended}\{\mathsf{output}:\ v'\},\ \sigma '')
\end{array}
$$

**(EvalSigma-Map-Resume-Complete)**

$$
\begin{array}{l}
a\ =\ \operatorname{MappedAsync}(\mathsf{src},\ f)\quad \Gamma \ \vdash \ \operatorname{Resume}(\mathsf{src},\ \mathsf{input},\ \sigma )\ \Downarrow \ (@\mathsf{Completed}\{\mathsf{value}:\ v\},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resume}(a,\ \mathsf{input},\ \sigma )\ \Downarrow \ (@\mathsf{Completed}\{\mathsf{value}:\ v\},\ \sigma ')
\end{array}
$$

**(EvalSigma-Map-Resume-Failed)**

$$
\begin{array}{l}
a\ =\ \operatorname{MappedAsync}(\mathsf{src},\ f)\quad \Gamma \ \vdash \ \operatorname{Resume}(\mathsf{src},\ \mathsf{input},\ \sigma )\ \Downarrow \ (@\mathsf{Failed}\{\mathsf{error}:\ e\},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resume}(a,\ \mathsf{input},\ \sigma )\ \Downarrow \ (@\mathsf{Failed}\{\mathsf{error}:\ e\},\ \sigma ')
\end{array}
$$

**(EvalSigma-Filter-Create)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(a,\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{src}),\ \sigma ')\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(p,\ \sigma ')\ \Downarrow \ (\operatorname{Val}(\mathsf{pred}),\ \sigma '') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(a\sim{}>\operatorname{filter}(p),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{FilteredAsync}(\mathsf{src},\ \mathsf{pred},\ \mathsf{Pending})),\ \sigma '')
\end{array}
$$

**(EvalSigma-Filter-Resume-Pass)**

$$
\begin{array}{l}
a\ =\ \operatorname{FilteredAsync}(\mathsf{src},\ \mathsf{pred},\ \mathsf{Pending})\quad \Gamma \ \vdash \ \operatorname{Resume}(\mathsf{src},\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Suspended}\{\mathsf{output}:\ v\},\ \sigma ')\quad \Gamma \ \vdash \ \operatorname{Apply}(\mathsf{pred},\ v,\ \sigma ')\ \Downarrow \ (\operatorname{Val}(\mathsf{true}),\ \sigma '') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resume}(a,\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Suspended}\{\mathsf{output}:\ v\},\ \sigma '')
\end{array}
$$

**(EvalSigma-Filter-Resume-Skip)**

$$
\begin{array}{l}
a\ =\ \operatorname{FilteredAsync}(\mathsf{src},\ \mathsf{pred},\ \mathsf{Pending})\quad \Gamma \ \vdash \ \operatorname{Resume}(\mathsf{src},\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Suspended}\{\mathsf{output}:\ v\},\ \sigma ')\quad \Gamma \ \vdash \ \operatorname{Apply}(\mathsf{pred},\ v,\ \sigma ')\ \Downarrow \ (\operatorname{Val}(\mathsf{false}),\ \sigma '') \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resume}(\operatorname{FilteredAsync}(\mathsf{src},\ \mathsf{pred},\ \mathsf{Pending}),\ (),\ \sigma '')\ \Downarrow \ (\mathsf{out},\ \sigma ''') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resume}(a,\ (),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ''')
\end{array}
$$

**(EvalSigma-Filter-Resume-Complete)**

$$
\begin{array}{l}
a\ =\ \operatorname{FilteredAsync}(\mathsf{src},\ \mathsf{pred},\ \_)\quad \Gamma \ \vdash \ \operatorname{Resume}(\mathsf{src},\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Completed}\{\mathsf{value}:\ v\},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resume}(a,\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Completed}\{\mathsf{value}:\ v\},\ \sigma ')
\end{array}
$$

**(EvalSigma-Take-Create)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(a,\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{src}),\ \sigma ')\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(n,\ \sigma ')\ \Downarrow \ (\operatorname{Val}(\mathsf{count}),\ \sigma '') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(a\sim{}>\operatorname{take}(n),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{TakeAsync}(\mathsf{src},\ \mathsf{count})),\ \sigma '')
\end{array}
$$

**(EvalSigma-Take-Resume-Yield)**

$$
\begin{array}{l}
a\ =\ \operatorname{TakeAsync}(\mathsf{src},\ n)\quad n\ >\ 0\quad \Gamma \ \vdash \ \operatorname{Resume}(\mathsf{src},\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Suspended}\{\mathsf{output}:\ v\},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resume}(a,\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Suspended}\{\mathsf{output}:\ v\},\ \sigma ')\quad \land \ a'\ =\ \operatorname{TakeAsync}(\mathsf{src},\ n\ -\ 1)
\end{array}
$$

**(EvalSigma-Take-Resume-Done)**

$$
\begin{array}{l}
a\ =\ \operatorname{TakeAsync}(\mathsf{src},\ 0) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resume}(a,\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Completed}\{\mathsf{value}:\ ()\},\ \sigma )
\end{array}
$$

**(EvalSigma-Take-Resume-Source-Complete)**

$$
\begin{array}{l}
a\ =\ \operatorname{TakeAsync}(\mathsf{src},\ n)\quad \Gamma \ \vdash \ \operatorname{Resume}(\mathsf{src},\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Completed}\{\mathsf{value}:\ v\},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resume}(a,\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Completed}\{\mathsf{value}:\ ()\},\ \sigma ')
\end{array}
$$

**(EvalSigma-Fold-Create)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(a,\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{src}),\ \sigma ')\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{init},\ \sigma ')\ \Downarrow \ (\operatorname{Val}(\mathsf{acc}),\ \sigma '')\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(f,\ \sigma '')\ \Downarrow \ (\operatorname{Val}(\mathsf{fn}),\ \sigma ''') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(a\sim{}>\operatorname{fold}(\mathsf{init},\ f),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{FoldAsync}(\mathsf{src},\ \mathsf{acc},\ \mathsf{fn})),\ \sigma ''')
\end{array}
$$

**(EvalSigma-Fold-Resume-Accumulate)**

$$
\begin{array}{l}
a\ =\ \operatorname{FoldAsync}(\mathsf{src},\ \mathsf{acc},\ f)\quad \Gamma \ \vdash \ \operatorname{Resume}(\mathsf{src},\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Suspended}\{\mathsf{output}:\ v\},\ \sigma ')\quad \Gamma \ \vdash \ \operatorname{Apply}(f,\ (\mathsf{acc},\ v),\ \sigma ')\ \Downarrow \ (\operatorname{Val}(\mathsf{acc}'),\ \sigma '') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resume}(a,\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Suspended}\{\mathsf{output}:\ ()\},\ \sigma '')\quad \land \ a'\ =\ \operatorname{FoldAsync}(\mathsf{src},\ \mathsf{acc}',\ f)
\end{array}
$$

**(EvalSigma-Fold-Resume-Complete)**

$$
\begin{array}{l}
a\ =\ \operatorname{FoldAsync}(\mathsf{src},\ \mathsf{acc},\ f)\quad \Gamma \ \vdash \ \operatorname{Resume}(\mathsf{src},\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Completed}\{\mathsf{value}:\ \_\},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resume}(a,\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Completed}\{\mathsf{value}:\ \mathsf{acc}\},\ \sigma ')
\end{array}
$$

**(EvalSigma-Fold-Resume-Failed)**

$$
\begin{array}{l}
a\ =\ \operatorname{FoldAsync}(\mathsf{src},\ \mathsf{acc},\ f)\quad \Gamma \ \vdash \ \operatorname{Resume}(\mathsf{src},\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Failed}\{\mathsf{error}:\ e\},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resume}(a,\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Failed}\{\mathsf{error}:\ e\},\ \sigma ')
\end{array}
$$

**(EvalSigma-Chain-Create)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(a,\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{src}),\ \sigma ')\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(f,\ \sigma ')\ \Downarrow \ (\operatorname{Val}(\mathsf{fn}),\ \sigma '') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(a\sim{}>\operatorname{chain}(f),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{ChainAsync}(\mathsf{src},\ \mathsf{fn},\ \mathsf{WaitingSource})),\ \sigma '')
\end{array}
$$

**(EvalSigma-Chain-Resume-Source-Complete)**

$$
\begin{array}{l}
a\ =\ \operatorname{ChainAsync}(\mathsf{src},\ f,\ \mathsf{WaitingSource})\quad \Gamma \ \vdash \ \operatorname{Resume}(\mathsf{src},\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Completed}\{\mathsf{value}:\ v\},\ \sigma ')\quad \Gamma \ \vdash \ \operatorname{Apply}(f,\ v,\ \sigma ')\ \Downarrow \ (\operatorname{Val}(\mathsf{inner}),\ \sigma '') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resume}(a,\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Suspended}\{\mathsf{output}:\ ()\},\ \sigma '')\quad \land \ a'\ =\ \operatorname{ChainAsync}(\mathsf{src},\ f,\ \operatorname{WaitingChained}(\mathsf{inner}))
\end{array}
$$

**(EvalSigma-Chain-Resume-Chained)**

$$
\begin{array}{l}
a\ =\ \operatorname{ChainAsync}(\_,\ \_,\ \operatorname{WaitingChained}(\mathsf{inner}))\quad \Gamma \ \vdash \ \operatorname{Resume}(\mathsf{inner},\ (),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resume}(a,\ (),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')
\end{array}
$$

**(EvalSigma-Chain-Resume-Source-Failed)**

$$
\begin{array}{l}
a\ =\ \operatorname{ChainAsync}(\mathsf{src},\ f,\ \mathsf{WaitingSource})\quad \Gamma \ \vdash \ \operatorname{Resume}(\mathsf{src},\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Failed}\{\mathsf{error}:\ e\},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resume}(a,\ (),\ \sigma )\ \Downarrow \ (@\mathsf{Failed}\{\mathsf{error}:\ e\},\ \sigma ')
\end{array}
$$

### 21.3.6 Lowering

$$
\mathsf{AsyncComposeIR}\ =\ \{\mathsf{SyncLoopIR},\ \mathsf{RaceInitIR},\ \mathsf{RaceSelectIR},\ \mathsf{RaceResumeIR},\ \mathsf{AllInitIR},\ \mathsf{AllJoinIR},\ \mathsf{UntilWaiterIR},\ \mathsf{AsyncMapIR},\ \mathsf{AsyncFilterIR},\ \mathsf{AsyncTakeIR},\ \mathsf{AsyncFoldIR},\ \mathsf{AsyncChainIR}\}
$$

**(Lower-Expr-Sync)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v_{e}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{SyncExpr}(e))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{e},\ \operatorname{SyncLoopIR}(v_{e})),\ \operatorname{SyncResult}(v_{e})\rangle 
\end{array}
$$

`SyncLoopIR(v)` MUST loop on the modal state of `v`, resuming `@Suspended` with input `()`, returning `@Completed.value`, and returning the union error value from `@Failed.error`.

**(Lower-Expr-Race-Return)**

$$
\begin{array}{l}
\operatorname{RaceMode}(\mathsf{arms})\ =\ \texttt{return} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{RaceExpr}(\mathsf{arms}))\ \Downarrow \ \langle \operatorname{RaceInitIR}(\mathsf{arms},\ \texttt{return}),\ \operatorname{RaceSelectIR}(\texttt{return})\rangle 
\end{array}
$$

**(Lower-Expr-Race-Stream)**

$$
\begin{array}{l}
\operatorname{RaceMode}(\mathsf{arms})\ =\ \texttt{yield} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{RaceExpr}(\mathsf{arms}))\ \Downarrow \ \langle \operatorname{RaceInitIR}(\mathsf{arms},\ \texttt{yield}),\ \operatorname{RaceSelectIR}(\texttt{yield})\rangle 
\end{array}
$$

For `RaceInitIR(arms, mode)`, lowering MUST:
1. evaluate all arm expressions left-to-right,
2. store the live arm states in declaration order,
3. for streaming mode, allocate race-stream suspension state containing the live arm vector and the yielded-arm index.

`RaceResumeIR` MUST lower streaming-race resumption according to **(EvalSigma-Race-Stream-Resume)**.

**(Lower-Expr-All)**

$$
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{AllExpr}(\mathsf{exprs}))\ \Downarrow \ \langle \operatorname{AllInitIR}(\mathsf{exprs}),\ \operatorname{AllJoinIR}(\mathsf{exprs})\rangle 
$$

`AllJoinIR` MUST preserve expression order in the result tuple and MUST cancel unfinished operands on the first failure.

Async combinators lower to wrapper async state machines around their source operand:

**(Lower-Async-Map)**

$$
\Gamma \ \vdash \ \operatorname{LowerExpr}(a\sim{}>\operatorname{map}(f))\ \Downarrow \ \langle \operatorname{AsyncMapIR}(a,\ f),\ \operatorname{AsyncMapState}(a,\ f)\rangle 
$$

**(Lower-Async-Filter)**

$$
\Gamma \ \vdash \ \operatorname{LowerExpr}(a\sim{}>\operatorname{filter}(p))\ \Downarrow \ \langle \operatorname{AsyncFilterIR}(a,\ p),\ \operatorname{AsyncFilterState}(a,\ p)\rangle 
$$

**(Lower-Async-Take)**

$$
\Gamma \ \vdash \ \operatorname{LowerExpr}(a\sim{}>\operatorname{take}(n))\ \Downarrow \ \langle \operatorname{AsyncTakeIR}(a,\ n),\ \operatorname{AsyncTakeState}(a,\ n)\rangle 
$$

**(Lower-Async-Fold)**

$$
\Gamma \ \vdash \ \operatorname{LowerExpr}(a\sim{}>\operatorname{fold}(\mathsf{init},\ f))\ \Downarrow \ \langle \operatorname{AsyncFoldIR}(a,\ \mathsf{init},\ f),\ \operatorname{AsyncFoldState}(a,\ \mathsf{init},\ f)\rangle 
$$

**(Lower-Async-Chain)**

$$
\Gamma \ \vdash \ \operatorname{LowerExpr}(a\sim{}>\operatorname{chain}(f))\ \Downarrow \ \langle \operatorname{AsyncChainIR}(a,\ f),\ \operatorname{AsyncChainState}(a,\ f)\rangle 
$$

Each wrapper lowering MUST delegate to the source async via `resume`, store its local wrapper state in the generated async frame, and preserve the dynamic semantics of §21.3.5 exactly.

### 21.3.7 Diagnostics

| Code         | Severity | Detection    | Condition                                   |
| ------------ | -------- | ------------ | ------------------------------------------- |
| `E-CON-0212` | Error    | Compile-time | `yield` inside `sync` expression            |
| `E-CON-0223` | Error    | Compile-time | `yield from` inside `sync` expression       |
| `E-CON-0240` | Error    | Compile-time | Iteration over async with `In ≠ ()`         |
| `E-CON-0250` | Error    | Compile-time | `sync` inside async-returning procedure     |
| `E-CON-0251` | Error    | Compile-time | `sync` operand has `Out ≠ ()`               |
| `E-CON-0252` | Error    | Compile-time | `sync` operand has `In ≠ ()`                |
| `E-CON-0260` | Error    | Compile-time | `race` with fewer than 2 arms               |
| `E-CON-0261` | Error    | Compile-time | `race` arms have incompatible types         |
| `E-CON-0262` | Error    | Compile-time | Non-streaming `race` operand has `Out ≠ ()` |
| `E-CON-0263` | Error    | Compile-time | Mixed yield/non-yield handlers in race      |
| `E-CON-0270` | Error    | Compile-time | `all` operand has `Out ≠ ()`                |
| `E-CON-0271` | Error    | Compile-time | `all` operand has `In ≠ ()`                 |

## 21.4 Async State Machine

### 21.4.1 Syntax

This section introduces no additional surface syntax beyond ordinary procedure declarations, calls, and `resume` method calls on `Async@Suspended`.

An async procedure is any procedure whose declared return type `R` satisfies `AsyncSig(R) ≠ ⊥`.

### 21.4.2 Parsing

This section introduces no additional parser productions beyond ordinary procedure, call, and method-call parsing.

### 21.4.3 AST Representation / Form

Async-state-machine analysis uses the following helper forms:

$$
\begin{array}{l}
\operatorname{SuspendExpr}(e)\ \Leftrightarrow \ e\ =\ \operatorname{YieldExpr}(\_,\ \_)\ \lor \ e\ =\ \operatorname{YieldFromExpr}(\_,\ \_) \\[0.16em]
\operatorname{AsyncCreateExpr}(\operatorname{Call}(\_,\ \_))\ \Leftrightarrow \ \operatorname{AsyncSig}(\operatorname{ExprType}(\operatorname{Call}(\_,\ \_)))\ \ne \ \bot  \\[0.16em]
\operatorname{AsyncCreateExpr}(\operatorname{MethodCall}(\_,\ \_,\ \_))\ \Leftrightarrow \ \operatorname{AsyncSig}(\operatorname{ExprType}(\operatorname{MethodCall}(\_,\ \_,\ \_)))\ \ne \ \bot  \\[0.16em]
\operatorname{AsyncCreateExpr}(\operatorname{RaceExpr}(\_))\ \Leftrightarrow \ \operatorname{AsyncSig}(\operatorname{ExprType}(\operatorname{RaceExpr}(\_)))\ \ne \ \bot  \\[0.16em]
\operatorname{AsyncCreateExpr}(\_)\ \Leftrightarrow \ \mathsf{false} \\[0.16em]
\operatorname{AsyncCaptureArgs}(\operatorname{Call}(\_,\ \mathsf{args}))\ =\ [e\ \mid \ \langle \_,\ e,\ \_\rangle \ \in \ \mathsf{args}] \\[0.16em]
\operatorname{AsyncCaptureArgs}(\operatorname{MethodCall}(\mathsf{base},\ \_,\ \mathsf{args}))\ =\ [\mathsf{base}]\ \mathbin{++} \ [e\ \mid \ \langle \_,\ e,\ \_\rangle \ \in \ \mathsf{args}] \\[0.16em]
\operatorname{AsyncCaptureArgs}(\operatorname{RaceExpr}(\mathsf{arms}))\ =\ [e\ \mid \ \langle e,\ \_,\ \_\rangle \ \in \ \mathsf{arms}] \\[0.16em]
\operatorname{AsyncCaptureArgs}(\_)\ =\ [] \\[0.16em]
\mathsf{ASYNC}_{\mathsf{LARGE}\_\mathsf{CAPTURE}\_\mathsf{THRESHOLD}\_\mathsf{BYTES}}\ =\ \mathsf{WIDEN}_{\mathsf{LARGE}\_\mathsf{PAYLOAD}\_\mathsf{THRESHOLD}\_\mathsf{BYTES}} \\[0.16em]
\operatorname{AsyncCaptureSize}(\mathsf{args})\ =\ \Sigma \_\{e\ \in \ \mathsf{args}\}\ \operatorname{sizeof}(\operatorname{ExprType}(e)) \\[0.16em]
\operatorname{AsyncCaptureWarnCond}(e)\ \Leftrightarrow \ \operatorname{AsyncCreateExpr}(e)\ \land \ \operatorname{AsyncCaptureSize}(\operatorname{AsyncCaptureArgs}(e))\ >\ \mathsf{ASYNC}_{\mathsf{LARGE}\_\mathsf{CAPTURE}\_\mathsf{THRESHOLD}\_\mathsf{BYTES}}
\end{array}
$$

The async frame stores:

- every binding live across suspension,
- the current resumption point,
- implementation fields required by the runtime.

### 21.4.4 Static Semantics

A binding is live across suspension iff there exists a control-flow path from a suspension point to a use of the binding on which the binding is not redefined.

Large capture warning and capture/escape provenance rules are:

**(Warn-Async-LargeCapture)**

$$
\begin{array}{l}
\operatorname{AsyncCaptureWarnCond}(e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{WarnAsyncCapture}(e)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(Warn-Async-LargeCapture-Ok)**

$$
\begin{array}{l}
\lnot \ \operatorname{AsyncCaptureWarnCond}(e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{WarnAsyncCapture}(e)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

When **(Warn-Async-LargeCapture)** applies, emit the warning defined in §21.4.7.

**(Async-Capture-Err)**

$$
\begin{array}{l}
\operatorname{AsyncCreateExpr}(e)\quad \operatorname{AsyncCaptureArgs}(e)\ =\ \mathsf{args}\quad \exists \ e_{i}\ \in \ \mathsf{args}.\ \Gamma ;\ \Omega \ \vdash \ e_{i}\ \Downarrow \ \pi_{i} \ \land \ \pi_{i} \ <\ \operatorname{FrameProv}(\Gamma ,\ \Omega ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \Omega \ \vdash \ e\ \Uparrow 
\end{array}
$$

**(P-Async-Create)**

$$
\begin{array}{l}
\operatorname{AsyncCreateExpr}(e)\quad \operatorname{AsyncCaptureArgs}(e)\ =\ \mathsf{args}\quad \forall \ e_{i}\ \in \ \mathsf{args},\ \Gamma ;\ \Omega \ \vdash \ e_{i}\ \Downarrow \ \pi_{i}  \\[0.16em]
\forall \ e_{i}\ \in \ \mathsf{args},\ \lnot (\pi_{i} \ <\ \operatorname{FrameProv}(\Gamma ,\ \Omega ))\quad \Gamma \ \vdash \ \operatorname{WarnAsyncCapture}(e)\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \Omega \ \vdash \ e\ \Downarrow \ \operatorname{FrameProv}(\Gamma ,\ \Omega )
\end{array}
$$

**(Prov-Async-Escape-Err)**

$$
\begin{array}{l}
\mathsf{stmt}\ \in \ \{\operatorname{AssignStmt}(p,\ e),\ \operatorname{CompoundAssignStmt}(p,\ \_,\ e)\}\quad \Gamma ;\ \Omega \ \vdash \ p\ \Downarrow \ \pi_{x} \quad \Gamma ;\ \Omega \ \vdash \ e\ \Downarrow \ \pi_{e}  \\[0.16em]
\pi_{e} \ <\ \pi_{x} \quad \operatorname{AsyncSig}(\operatorname{ExprType}(e))\ \ne \ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \Omega \ \vdash \ \mathsf{stmt}\ \Uparrow 
\end{array}
$$

Typing of error propagation in async procedures is defined by the async propagate rules in Chapter 16.

### 21.4.5 Dynamic Semantics

Evaluation of a call to an async procedure:

1. Evaluate arguments left-to-right.
2. Allocate a fresh async frame, capturing required arguments and initializing the resumption point to the procedure entry.
3. Execute the body until it suspends, completes, or fails.
4. The call expression evaluates to the produced async modal state.

Settlement rules are:

- `yield` or `yield from` produces `Async@Suspended { output = v }`.
- `return` produces `Async@Completed { value = v }`.
- error propagation via `?` produces `Async@Failed { error = e }`.

Evaluation of `a~>resume(input)` for `a : Async@Suspended`:

1. Resume execution at the stored resumption point with the yielded input value bound to the suspended `yield` expression.
2. Run until the next suspension, completion, or failure, and return the resulting `Async` state.

When an async computation fails:

1. Capture the error value.
2. Execute `defer` blocks in reverse order.
3. Run `Drop` implementations for live bindings.
4. Transition to `@Failed { error }`.

### 21.4.6 Lowering

$$
\begin{array}{l}
\mathsf{AsyncStateMachineJudg}\ =\ \{\mathsf{LowerAsyncProc},\ \mathsf{LowerAsyncResume}\} \\[0.16em]
\mathsf{AsyncProcIR}\ =\ \{\mathsf{AsyncFrameInitIR},\ \mathsf{AsyncResumeSwitchIR},\ \mathsf{AsyncSuspendStateIR},\ \mathsf{AsyncCompleteStateIR},\ \mathsf{AsyncFailStateIR}\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{GenPoints}(\mathsf{proc})\ =\ [g_{0},\ \ldots ,\ g_{n}]\quad \mathsf{where}\ \mathsf{the}\ \mathsf{suspension}\ \mathsf{expressions}\ \mathsf{of}\ \mathsf{proc}\ \mathsf{are}\ \mathsf{listed}\ \mathsf{in}\ \mathsf{source}\ \mathsf{order} \\[0.16em]
\operatorname{FrameSlots}(\mathsf{proc})\ =\ \operatorname{CaptureSet}(\mathsf{proc})\ \cup \ \operatorname{LiveAcrossSuspend}(\mathsf{proc})
\end{array}
$$

**(Lower-Async-Proc)**

$$
\begin{array}{l}
\operatorname{ProcedureDecl}(\_,\ \_,\ \mathsf{name},\ \_,\ \_,\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \_,\ \mathsf{body},\ \_,\ \_)\ =\ \mathsf{proc}\quad \operatorname{AsyncSig}(\operatorname{ProcReturn}(\mathsf{ret}_{\mathsf{opt}}))\ =\ \mathsf{sig} \\[0.16em]
\mathsf{slots}\ =\ \operatorname{FrameSlots}(\mathsf{proc})\quad \mathsf{gen}_{\mathsf{points}}\ =\ \operatorname{GenPoints}(\mathsf{proc}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerAsyncProc}(\mathsf{proc})\ \Downarrow \ \operatorname{ProcIR}(\operatorname{Mangle}(\mathsf{proc}),\ \mathsf{params},\ \operatorname{ProcReturn}(\mathsf{ret}_{\mathsf{opt}}),\ \operatorname{AsyncFrameInitIR}(\mathsf{name},\ \mathsf{sig},\ \mathsf{slots},\ \mathsf{gen}_{\mathsf{points}}))
\end{array}
$$

`AsyncFrameInitIR` MUST:
1. evaluate arguments left-to-right,
2. allocate the async frame,
3. copy or move captured values into `FrameSlots(proc)`,
4. initialize `gen_point` to `g_0`,
5. enter `AsyncResumeSwitchIR`.

**(Lower-Async-Resume)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(\operatorname{ExprType}(a))\ =\ \mathsf{sig}\quad \operatorname{CurrentAsyncFrame}(\Gamma )\ =\ f\quad \operatorname{CurrentProcedure}(\Gamma )\ =\ \mathsf{proc} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerAsyncResume}(a)\ \Downarrow \ \operatorname{AsyncResumeSwitchIR}(f,\ \operatorname{GenPoints}(\mathsf{proc}))
\end{array}
$$

`AsyncResumeSwitchIR` MUST dispatch on the stored `gen_point` and continue execution at the corresponding resumption label.

**(Lower-Async-Suspend)**

$$
\begin{array}{l}
\operatorname{CurrentAsyncFrame}(\Gamma )\ =\ f\quad \operatorname{CurrentGenPoint}(\Gamma )\ =\ g \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{Suspend}(\mathsf{async}_{\mathsf{state}})\ \mathsf{lowers}\ \mathsf{through}\ \operatorname{AsyncSuspendStateIR}(f,\ g)
\end{array}
$$

**(Lower-Async-Complete)**

$$
\begin{array}{l}
\operatorname{CurrentAsyncFrame}(\Gamma )\ =\ f \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{Return}\ \mathsf{from}\ \mathsf{an}\ \mathsf{async}\ \mathsf{procedure}\ \mathsf{lowers}\ \mathsf{through}\ \operatorname{AsyncCompleteStateIR}(f)
\end{array}
$$

**(Lower-Async-Fail)**

$$
\begin{array}{l}
\operatorname{CurrentAsyncFrame}(\Gamma )\ =\ f \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{Async}\ \mathsf{failure}\ \mathsf{lowers}\ \mathsf{through}\ \operatorname{AsyncFailStateIR}(f)
\end{array}
$$

`AsyncFailStateIR(f)` MUST execute `defer` blocks and drop live frame slots in reverse cleanup order before materializing `@Failed { error }`. If `AsyncSig(ProcReturn(ret_opt)).4 = TypePrim("!")`, `AsyncFailStateIR(f)` is unreachable and MUST NOT be emitted.

### 21.4.7 Diagnostics

| Code         | Severity | Detection    | Condition                               |
| ------------ | -------- | ------------ | --------------------------------------- |
| `W-CON-0201` | Warning  | Compile-time | Large captured state (performance)      |
| `E-CON-0280` | Error    | Compile-time | Captured binding does not outlive async |
| `E-CON-0281` | Error    | Compile-time | Async operation escapes its region      |

## 21.5 Async-Key Integration

### 21.5.1 Syntax

This section introduces no additional surface syntax beyond `wait`, `yield`, `yield from`, `yield release`, closures, and the key forms defined in Chapter 19.

### 21.5.2 Parsing

This section introduces no additional parser productions.

### 21.5.3 AST Representation / Form

Async-key integration is defined over existing forms:

- `WaitExpr(handle)`
- `YieldExpr(release_opt, expr)`
- `YieldFromExpr(release_opt, expr)`
- `ClosureExpr(params, ret_type_opt, body)`

This section introduces no additional AST node variants.

### 21.5.4 Static Semantics

Async key restrictions are:

- `wait` is ill-formed at program point `p` when `Γ_keys(p) ≠ ∅`.
- `yield` is ill-formed at program point `p` when `release_opt = ⊥` and `Γ_keys(p) ≠ ∅`.
- `yield from` is ill-formed at program point `p` when `release_opt = ⊥` and `Γ_keys(p) ≠ ∅`.

Shared-capturing closures that contain `yield` are additionally constrained:

**(A-Closure-Yield-Keys-Err)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{YieldExpr}(\_,\ \_)\ \in \ \mathsf{body}\quad \operatorname{SharedCaptures}(C)\ \ne \ \emptyset  \\[0.16em]
\operatorname{YieldExpr}(\bot ,\ \_)\ \mathsf{at}\ \mathsf{program}\ \mathsf{point}\ p\ \mathsf{within}\ \mathsf{body}\quad \Gamma_{\mathsf{keys}} (p)\ \ne \ \emptyset  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ C\ \Uparrow 
\end{array}
$$

A closure that captures `shared` bindings and contains `yield` expressions MUST NOT hold keys across the yield point unless the `release` modifier is present.

Bindings derived from shared data before a `yield release` are potentially stale after resumption. The staleness warning defined in Chapter 19 applies unless suppressed by `[[stale_ok]]`.

Async capability requirements are:

| Category      | Capability Required                         |
| ------------- | ------------------------------------------- |
| Pure sequence | None                                        |
| I/O operation | Capability providing the invoked I/O method |
| Timing        | `System`                                    |
| Async runtime | `Reactor`                                   |

### 21.5.5 Dynamic Semantics

At suspension, the task releases access rights. Other tasks MAY acquire keys to the same paths during the suspension period.

For `yield release`, key release and reacquisition are defined by §21.2.5.

Async failure handling is defined by §21.4.5.

### 21.5.6 Lowering

$$
\mathsf{AsyncKeyIR}\ =\ \{\mathsf{SnapshotHeldKeysIR},\ \mathsf{ReleaseHeldKeysIR},\ \mathsf{ReacquireHeldKeysIR},\ \mathsf{StaleValueMarkIR}\}
$$

**(Lower-Wait-Key-Illegal)**

$$
\begin{array}{l}
\operatorname{WaitExpr}(h)\ \mathsf{occurs}\ \mathsf{at}\ \mathsf{program}\ \mathsf{point}\ p\quad \Gamma_{\mathsf{keys}} (p)\ \ne \ \emptyset  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{WaitExpr}(h))\ \Uparrow 
\end{array}
$$

**(Lower-Yield-Release-Keys)**

$$
\begin{array}{l}
\operatorname{YieldExpr}(\mathsf{Release},\ e)\ \mathsf{at}\ \mathsf{program}\ \mathsf{point}\ p\quad \Gamma_{\mathsf{keys}} (p)\ =\ \mathsf{keys}\quad \mathsf{keys}\ \ne \ \emptyset  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{Lowering}\ \mathsf{MUST}\ \mathsf{emit}\ \operatorname{SnapshotHeldKeysIR}(\operatorname{CurrentAsyncFrame}(\Gamma )),\ \mathsf{then}\ \operatorname{ReleaseHeldKeysIR}(\operatorname{CurrentAsyncFrame}(\Gamma )),\ \mathsf{then}\ \mathsf{the}\ \mathsf{ordinary}\ \mathsf{yield}\ \mathsf{lowering},\ \mathsf{and}\ \mathsf{MUST}\ \mathsf{prepend}\ \operatorname{ReacquireHeldKeysIR}(\operatorname{CurrentAsyncFrame}(\Gamma ))\ \mathsf{to}\ \mathsf{the}\ \mathsf{resumption}\ \mathsf{target}.
\end{array}
$$

**(Lower-YieldFrom-Release-Keys)**

$$
\begin{array}{l}
\operatorname{YieldFromExpr}(\mathsf{Release},\ e)\ \mathsf{at}\ \mathsf{program}\ \mathsf{point}\ p\quad \Gamma_{\mathsf{keys}} (p)\ =\ \mathsf{keys}\quad \mathsf{keys}\ \ne \ \emptyset  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{Lowering}\ \mathsf{MUST}\ \mathsf{use}\ \mathsf{the}\ \mathsf{same}\ \mathsf{key}\ \mathsf{snapshot},\ \mathsf{release},\ \mathsf{and}\ \mathsf{reacquisition}\ \mathsf{sequence}\ \mathsf{as}\ **(\mathsf{Lower}-\mathsf{Yield}-\mathsf{Release}-\mathsf{Keys})**\ \mathsf{around}\ \mathsf{the}\ \mathsf{delegated}\ \mathsf{async}\ \mathsf{state}\ \mathsf{machine}.
\end{array}
$$

**(Lower-Closure-Yield-Shared)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{SharedCaptures}(C)\ \ne \ \emptyset \quad \operatorname{YieldExpr}(\mathsf{Release},\ \_)\ \in \ \mathsf{body}\ \lor \ \operatorname{YieldFromExpr}(\mathsf{Release},\ \_)\ \in \ \mathsf{body} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{Lowering}\ \mathsf{MUST}\ \mathsf{attach}\ \mathsf{the}\ \mathsf{captured}-\mathsf{key}\ \mathsf{snapshot}\ \mathsf{to}\ \mathsf{the}\ \mathsf{generated}\ \mathsf{closure}\ \mathsf{async}\ \mathsf{frame}\ \mathsf{and}\ \mathsf{MUST}\ \mathsf{emit}\ \mathsf{StaleValueMarkIR}\ \mathsf{for}\ \mathsf{bindings}\ \mathsf{derived}\ \mathsf{from}\ \mathsf{shared}\ \mathsf{captures}\ \mathsf{across}\ \mathsf{the}\ \mathsf{suspension}\ \mathsf{boundary}.
\end{array}
$$

Bindings marked by `StaleValueMarkIR` remain usable but MUST continue to trigger the Chapter 19 staleness warning unless suppressed by `[[stale_ok]]`.

### 21.5.7 Diagnostics

| Code         | Severity | Detection    | Condition                                          |
| ------------ | -------- | ------------ | -------------------------------------------------- |
| `E-CON-0133` | Error    | Compile-time | `wait` while key is held                           |
| `E-CON-0213` | Error    | Compile-time | `yield` while key is held (without `release`)      |
| `E-CON-0224` | Error    | Compile-time | `yield from` while key is held (without `release`) |

## 21.6 Async Diagnostics Supplement

This section owns async diagnostics not covered by the syntax-local tables in §§21.1 through 21.5.

| Code         | Severity | Detection    | Condition                                       |
| ------------ | -------- | ------------ | ----------------------------------------------- |
| `E-CON-0203` | Error    | Compile-time | `result` type mismatch with `Result` parameter  |
| `E-CON-0230` | Error    | Compile-time | Error propagation in infallible async procedure |
