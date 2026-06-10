---
title: "22.3 Reflection"
description: "22.3 Reflection from 22. Compile-Time Execution and Metaprogramming of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "compile-time-execution-and-metaprogramming"
specSection: "223-reflection"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/compile-time-execution-and-metaprogramming/">22. Compile-Time Execution and Metaprogramming</a>
  <span>Compile-Time Execution and Metaprogramming</span>
</div>

## 22.3 Reflection

### 22.3.1 Syntax

```text
type_literal ::= "Type" "::<" type ">"
```

### 22.3.2 Parsing

$$
\mathsf{ReflectParseJudg}\ =\ \{\mathsf{ParseTypeLiteral}\}
$$

**(Parse-TypeLiteral)**

$$
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \operatorname{Lexeme}(\operatorname{Tok}(P))\ =\ \texttt{"Type"}\quad \operatorname{IsOp}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"::"})\quad \operatorname{IsOp}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))),\ \texttt{"<"})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P))))\ \Downarrow \ (P_{1},\ T)\quad \operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{">"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{TypeLiteralExpr}(T))
\end{array}
$$

### 22.3.3 AST Representation / Form

$$
\begin{array}{l}
\operatorname{Reflectable}(\operatorname{TypePerm}(\_,\ T))\ \Leftrightarrow \ \operatorname{Reflectable}(T) \\[0.16em]
\operatorname{Reflectable}(\operatorname{TypeRefine}(T,\ \_))\ \Leftrightarrow \ \operatorname{Reflectable}(T) \\[0.16em]
\operatorname{Reflectable}(\operatorname{TypeModalState}(p,\ \mathsf{args},\ \_))\ \Leftrightarrow \ \operatorname{Reflectable}(\operatorname{TypeApply}(p,\ \mathsf{args})) \\[0.16em]
\operatorname{Reflectable}(\operatorname{TypePath}(p))\ \Leftrightarrow \ \operatorname{Reflectable}(\operatorname{TypeApply}(p,\ [])) \\[0.16em]
\operatorname{Reflectable}(\operatorname{TypeApply}(p,\ \mathsf{args}))\ \Leftrightarrow \\[0.16em]
\ T\ =\ \operatorname{TypePrim}(\_)\ \lor \ T\ =\ \operatorname{TypeTuple}(\_)\ \lor \ T\ =\ \operatorname{TypeArray}(\_,\ \_)\ \lor \ T\ =\ \operatorname{TypeSlice}(\_)\ \lor \ T\ =\ \operatorname{TypeUnion}(\_)\quad \mathsf{if}\ \operatorname{TypeAliasDecl}(p)\ =\ A\ \land \ \operatorname{AliasBody}(A)\ =\ T\ \land \ \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(A.\mathsf{generic}_{\mathsf{params}})\ \land \ \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{args})\ =\ \mathsf{args}'\ \land \ \theta \ =\ [\mathsf{args}'\_i\ /\ \mathsf{params}_{\mathsf{gen}}[i].\mathsf{name}] \\[0.16em]
\operatorname{Reflectable}(\operatorname{TypeApply}(p,\ \mathsf{args}))\ \Leftrightarrow \\[0.16em]
\ \operatorname{AttrByName}(\operatorname{DeclOf}(p),\ \texttt{"reflect"})\ \ne \ []\quad \mathsf{if}\ (\operatorname{RecordDecl}(p)\ \mathsf{defined}\ \lor \ \operatorname{EnumDecl}(p)\ \mathsf{defined}\ \lor \ \operatorname{ModalDecl}(p)\ \mathsf{defined})\ \land \ \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(\operatorname{DeclOf}(p).\mathsf{generic}_{\mathsf{params}})\ \land \ \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{args})\ =\ \mathsf{args}' \\[0.16em]
\operatorname{Reflectable}(\operatorname{TypePrim}(\_))\ \Leftrightarrow \ \mathsf{true} \\[0.16em]
\operatorname{Reflectable}(\operatorname{TypeTuple}(\_))\ \Leftrightarrow \ \mathsf{true} \\[0.16em]
\operatorname{Reflectable}(\operatorname{TypeArray}(\_,\ \_))\ \Leftrightarrow \ \mathsf{true} \\[0.16em]
\operatorname{Reflectable}(\operatorname{TypeSlice}(\_))\ \Leftrightarrow \ \mathsf{true} \\[0.16em]
\operatorname{Reflectable}(\operatorname{TypeUnion}(\_))\ \Leftrightarrow \ \mathsf{true}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{ReflectJudg}\ =\ \{\mathsf{ReflectFields},\ \mathsf{ReflectVariants},\ \mathsf{ReflectStates},\ \mathsf{ReflectImplements}\} \\[0.16em]
\operatorname{TypeLiteralExpr}(T)\ \mathsf{is}\ \mathsf{the}\ \mathsf{compile}-\mathsf{time}\ \mathsf{expression}\ \mathsf{form}\ \mathsf{introduced}\ \mathsf{by}\ \texttt{Type::<T>}.
\end{array}
$$

$$
\mathsf{TypeCategory}\ =\ \{\texttt{Record},\ \texttt{Enum},\ \texttt{Modal},\ \texttt{Primitive},\ \texttt{Tuple},\ \texttt{Array},\ \texttt{Slice},\ \texttt{Union},\ \texttt{Procedure},\ \texttt{Reference},\ \texttt{Dynamic},\ \texttt{Opaque},\ \texttt{Generic},\ \texttt{String},\ \texttt{Bytes},\ \texttt{Range}\}
$$

$$
\begin{array}{l}
\operatorname{CategoryOf}(\operatorname{TypePrim}(\_))\ =\ \texttt{Primitive} \\[0.16em]
\operatorname{CategoryOf}(\operatorname{TypePerm}(\_,\ \mathsf{base}))\ =\ \operatorname{CategoryOf}(\mathsf{base}) \\[0.16em]
\operatorname{CategoryOf}(\operatorname{TypeRefine}(\mathsf{base},\ \_))\ =\ \operatorname{CategoryOf}(\mathsf{base}) \\[0.16em]
\operatorname{CategoryOf}(\operatorname{TypeTuple}(\_))\ =\ \texttt{Tuple} \\[0.16em]
\operatorname{CategoryOf}(\operatorname{TypeArray}(\_,\ \_))\ =\ \texttt{Array} \\[0.16em]
\operatorname{CategoryOf}(\operatorname{TypeSlice}(\_))\ =\ \texttt{Slice} \\[0.16em]
\operatorname{CategoryOf}(\operatorname{TypeUnion}(\_))\ =\ \texttt{Union} \\[0.16em]
\operatorname{CategoryOf}(\operatorname{TypeFunc}(\_,\ \_))\ =\ \texttt{Procedure} \\[0.16em]
\operatorname{CategoryOf}(\operatorname{TypeClosure}(\_,\ \_,\ \_))\ =\ \texttt{Procedure} \\[0.16em]
\operatorname{CategoryOf}(\operatorname{TypePtr}(\_,\ \_))\ =\ \texttt{Reference} \\[0.16em]
\operatorname{CategoryOf}(\operatorname{TypeRawPtr}(\_,\ \_))\ =\ \texttt{Reference} \\[0.16em]
\operatorname{CategoryOf}(\operatorname{TypeDynamic}(\_))\ =\ \texttt{Dynamic} \\[0.16em]
\operatorname{CategoryOf}(\operatorname{TypeOpaque}(\_))\ =\ \texttt{Opaque} \\[0.16em]
\operatorname{CategoryOf}(\operatorname{TypeString}(\_))\ =\ \texttt{String} \\[0.16em]
\operatorname{CategoryOf}(\operatorname{TypeBytes}(\_))\ =\ \texttt{Bytes} \\[0.16em]
\operatorname{CategoryOf}(\operatorname{TypeModalState}(\_,\ \_))\ =\ \texttt{Modal} \\[0.16em]
\operatorname{CategoryOf}(\operatorname{TypePath}(p))\ =\ \texttt{Record}\ \mathsf{if}\ \operatorname{RecordDecl}(p)\ \mathsf{defined} \\[0.16em]
\operatorname{CategoryOf}(\operatorname{TypePath}(p))\ =\ \texttt{Enum}\ \mathsf{if}\ \operatorname{EnumDecl}(p)\ \mathsf{defined} \\[0.16em]
\operatorname{CategoryOf}(\operatorname{TypePath}(p))\ =\ \texttt{Modal}\ \mathsf{if}\ \operatorname{ModalDecl}(p)\ \mathsf{defined} \\[0.16em]
\operatorname{CategoryOf}(\operatorname{TypePath}(p))\ =\ \texttt{Generic}\ \mathsf{if}\ p\ \mathsf{denotes}\ a\ \mathsf{type}\ \mathsf{parameter} \\[0.16em]
\operatorname{CategoryOf}(\operatorname{TypeApply}(p,\ \_))\ =\ \operatorname{CategoryOf}(\operatorname{TypePath}(p)) \\[0.16em]
\operatorname{CategoryOf}(\operatorname{TypeRange}(\_))\ =\ \texttt{Range} \\[0.16em]
\operatorname{CategoryOf}(\operatorname{TypeRangeInclusive}(\_))\ =\ \texttt{Range} \\[0.16em]
\operatorname{CategoryOf}(\operatorname{TypeRangeFrom}(\_))\ =\ \texttt{Range} \\[0.16em]
\operatorname{CategoryOf}(\operatorname{TypeRangeTo}(\_))\ =\ \texttt{Range} \\[0.16em]
\operatorname{CategoryOf}(\operatorname{TypeRangeToInclusive}(\_))\ =\ \texttt{Range} \\[0.16em]
\operatorname{CategoryOf}(\mathsf{TypeRangeFull})\ =\ \texttt{Range}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ReflectFields}(\operatorname{TypePerm}(\_,\ T))\ =\ \operatorname{ReflectFields}(T) \\[0.16em]
\operatorname{ReflectFields}(\operatorname{TypeRefine}(T,\ \_))\ =\ \operatorname{ReflectFields}(T) \\[0.16em]
\operatorname{ReflectFields}(\operatorname{TypePath}(p))\ =\ \operatorname{ReflectFields}(\operatorname{TypeApply}(p,\ [])) \\[0.16em]
\operatorname{ReflectFields}(\operatorname{TypeApply}(p,\ \mathsf{args}))\ =\ \operatorname{ReflectFields}(\operatorname{TypeSubst}(\theta ,\ \mathsf{ty}))\quad \mathsf{if}\ \operatorname{TypeAliasDecl}(p)\ =\ A\ \land \ \operatorname{AliasBody}(A)\ =\ \mathsf{ty}\ \land \ \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(A.\mathsf{generic}_{\mathsf{params}})\ \land \ \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{args})\ =\ \mathsf{args}'\ \land \ \theta \ =\ [\mathsf{args}'\_i\ /\ \mathsf{params}_{\mathsf{gen}}[i].\mathsf{name}] \\[0.16em]
\operatorname{ReflectFields}(\operatorname{TypeApply}(p,\ \mathsf{args}))\ =\ [\operatorname{FieldInfoValue}(f_{i},\ \operatorname{TypeSubst}(\theta ,\ T_{i}),\ \mathsf{vis}_{i},\ i\ -\ 1,\ \mathsf{sp}_{i})\ \mid \ \operatorname{RecordDecl}(p)\ =\ R\ \land \ \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(R.\mathsf{generic}_{\mathsf{params}})\ \land \ \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{args})\ =\ \mathsf{args}'\ \land \ \theta \ =\ [\mathsf{args}'\_j\ /\ \mathsf{params}_{\mathsf{gen}}[j].\mathsf{name}]\ \land \ \operatorname{Fields}(R)\ =\ [\operatorname{FieldDecl}(\_,\ \mathsf{vis}_{1},\ \_,\ f_{1},\ T_{1},\ \_,\ \mathsf{sp}_{1},\ \_),\ \ldots ,\ \operatorname{FieldDecl}(\_,\ \mathsf{vis}_{n},\ \_,\ f_{n},\ T_{n},\ \_,\ \mathsf{sp}_{n},\ \_)]\ \land \ 1\ \le \ i\ \le \ n]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ReflectVariants}(\operatorname{TypePerm}(\_,\ T))\ =\ \operatorname{ReflectVariants}(T) \\[0.16em]
\operatorname{ReflectVariants}(\operatorname{TypeRefine}(T,\ \_))\ =\ \operatorname{ReflectVariants}(T) \\[0.16em]
\operatorname{ReflectVariants}(\operatorname{TypePath}(p))\ =\ \operatorname{ReflectVariants}(\operatorname{TypeApply}(p,\ [])) \\[0.16em]
\operatorname{ReflectVariants}(\operatorname{TypeApply}(p,\ \mathsf{args}))\ =\ \operatorname{ReflectVariants}(\operatorname{TypeSubst}(\theta ,\ \mathsf{ty}))\quad \mathsf{if}\ \operatorname{TypeAliasDecl}(p)\ =\ A\ \land \ \operatorname{AliasBody}(A)\ =\ \mathsf{ty}\ \land \ \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(A.\mathsf{generic}_{\mathsf{params}})\ \land \ \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{args})\ =\ \mathsf{args}'\ \land \ \theta \ =\ [\mathsf{args}'\_i\ /\ \mathsf{params}_{\mathsf{gen}}[i].\mathsf{name}] \\[0.16em]
\operatorname{ReflectVariants}(\operatorname{TypeApply}(p,\ \mathsf{args}))\ =\ [\operatorname{VariantInfoValue}(v_{i},\ \operatorname{PayloadKind}(\mathsf{payload}_{i}),\ [\operatorname{TypeSubst}(\theta ,\ T)\ \mid \ T\ \in \ \operatorname{PayloadTypesOpt}(\mathsf{payload}_{i})],\ \operatorname{PayloadFieldNames}(\mathsf{payload}_{i}),\ \mathsf{sp}_{i})\ \mid \ \operatorname{EnumDecl}(p)\ =\ E\ \land \ \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(E.\mathsf{generic}_{\mathsf{params}})\ \land \ \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{args})\ =\ \mathsf{args}'\ \land \ \theta \ =\ [\mathsf{args}'\_j\ /\ \mathsf{params}_{\mathsf{gen}}[j].\mathsf{name}]\ \land \ \operatorname{Variants}(E)\ =\ [\operatorname{VariantDecl}(v_{1},\ \mathsf{payload}_{1},\ \_,\ \mathsf{sp}_{1},\ \_),\ \ldots ,\ \operatorname{VariantDecl}(v_{n},\ \mathsf{payload}_{n},\ \_,\ \mathsf{sp}_{n},\ \_)]\ \land \ 1\ \le \ i\ \le \ n]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ReflectStates}(\operatorname{TypePerm}(\_,\ T))\ =\ \operatorname{ReflectStates}(T) \\[0.16em]
\operatorname{ReflectStates}(\operatorname{TypeRefine}(T,\ \_))\ =\ \operatorname{ReflectStates}(T) \\[0.16em]
\operatorname{ReflectStates}(\operatorname{TypeModalState}(p,\ \mathsf{args},\ \_))\ =\ \operatorname{ReflectStates}(\operatorname{TypeApply}(p,\ \mathsf{args})) \\[0.16em]
\operatorname{ReflectStates}(\operatorname{TypePath}(p))\ =\ \operatorname{ReflectStates}(\operatorname{TypeApply}(p,\ [])) \\[0.16em]
\operatorname{ReflectStates}(\operatorname{TypeApply}(p,\ \mathsf{args}))\ =\ \operatorname{ReflectStates}(\operatorname{TypeSubst}(\theta ,\ \mathsf{ty}))\quad \mathsf{if}\ \operatorname{TypeAliasDecl}(p)\ =\ A\ \land \ \operatorname{AliasBody}(A)\ =\ \mathsf{ty}\ \land \ \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(A.\mathsf{generic}_{\mathsf{params}})\ \land \ \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{args})\ =\ \mathsf{args}'\ \land \ \theta \ =\ [\mathsf{args}'\_i\ /\ \mathsf{params}_{\mathsf{gen}}[i].\mathsf{name}] \\[0.16em]
\operatorname{ReflectStates}(\operatorname{TypeApply}(p,\ \mathsf{args}))\ =\ [\operatorname{StateInfoValue}(S_{i},\ [f\ \mid \ \operatorname{StateFieldDecl}(\_,\ \_,\ \_,\ f,\ \_,\ \_,\ \_)\ \in \ \mathsf{members}_{i}],\ [\operatorname{MethodName}(m)\ \mid \ m\ \in \ \mathsf{members}_{i}\ \land \ m\ =\ \operatorname{StateMethodDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)],\ [\operatorname{MethodName}(t)\ \mid \ t\ \in \ \mathsf{members}_{i}\ \land \ t\ =\ \operatorname{TransitionDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)],\ \mathsf{sp}_{i})\ \mid \ \operatorname{ModalDecl}(p)\ =\ M\ \land \ \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(M.\mathsf{generic}_{\mathsf{params}})\ \land \ \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{args})\ =\ \mathsf{args}'\ \land \ \operatorname{States}(M)\ =\ [\operatorname{StateBlock}(S_{1},\ \mathsf{members}_{1},\ \mathsf{sp}_{1},\ \_),\ \ldots ,\ \operatorname{StateBlock}(S_{n},\ \mathsf{members}_{n},\ \mathsf{sp}_{n},\ \_)]\ \land \ 1\ \le \ i\ \le \ n]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{PayloadKind}(\bot )\ =\ \texttt{"unit"} \\[0.16em]
\operatorname{PayloadKind}(\operatorname{TuplePayload}(\_))\ =\ \texttt{"tuple"} \\[0.16em]
\operatorname{PayloadKind}(\operatorname{RecordPayload}(\_))\ =\ \texttt{"record"} \\[0.16em]
\operatorname{PayloadTypesOpt}(\bot )\ =\ [] \\[0.16em]
\operatorname{PayloadTypesOpt}(\operatorname{TuplePayload}(\mathsf{ts}))\ =\ \mathsf{ts} \\[0.16em]
\operatorname{PayloadTypesOpt}(\operatorname{RecordPayload}(\mathsf{io}))\ =\ [T\ \mid \ \langle f,\ T\rangle \ \in \ \mathsf{io}] \\[0.16em]
\operatorname{PayloadFieldNames}(\bot )\ =\ [] \\[0.16em]
\operatorname{PayloadFieldNames}(\operatorname{TuplePayload}(\_))\ =\ [] \\[0.16em]
\operatorname{PayloadFieldNames}(\operatorname{RecordPayload}(\mathsf{io}))\ =\ [f\ \mid \ \langle f,\ \_\rangle \ \in \ \mathsf{io}] \\[0.16em]
\operatorname{TypeModulePath}(\operatorname{TypePath}(p))\ =\ \mathsf{mp}\quad \mathsf{if}\ \operatorname{SplitLast}(p)\ =\ (\mathsf{mp},\ \_) \\[0.16em]
\operatorname{TypeModulePath}(T)\ =\ []\quad \mathsf{otherwise}
\end{array}
$$

### 22.3.4 Static Semantics

**(T-TypeLiteral)**

$$
\begin{array}{l}
\Gamma \ \vdash \ T\ \mathsf{wf} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma_{\mathsf{ct}} \ \vdash \ \operatorname{TypeLiteralExpr}(T)\ :\ \operatorname{TypePath}([\texttt{"Type"}])
\end{array}
$$

`introspect.category(ty)` is valid for any well-formed `Type` value.

$$
\begin{array}{l}
\texttt{introspect.fields(ty)}\ \mathsf{is}\ \mathsf{valid}\ \mathsf{only}\ \mathsf{when}\ \texttt{CategoryOf(ty) = Record}\ \mathsf{and}\ \texttt{Reflectable(ty)}. \\[0.16em]
\texttt{introspect.variants(ty)}\ \mathsf{is}\ \mathsf{valid}\ \mathsf{only}\ \mathsf{when}\ \texttt{CategoryOf(ty) = Enum}\ \mathsf{and}\ \texttt{Reflectable(ty)}. \\[0.16em]
\texttt{introspect.states(ty)}\ \mathsf{is}\ \mathsf{valid}\ \mathsf{only}\ \mathsf{when}\ \texttt{CategoryOf(ty) = Modal}\ \mathsf{and}\ \texttt{Reflectable(ty)}.
\end{array}
$$

Reflection order is canonical:
- fields are returned in declaration order
- enum variants are returned in declaration order
- modal states are returned in declaration order

`introspect.implements_form(ty, form)` evaluates the same class-satisfaction judgment used by Phase 3 typing after substituting any monomorphized type arguments of `ty`.

### 22.3.5 Dynamic Semantics

**(CtEval-TypeLiteral)**

$$
\begin{array}{l}
\Gamma \ \vdash \ T\ \mathsf{wf} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtEval}(\Xi ,\ \Phi ,\ \operatorname{TypeLiteralExpr}(T))\ \Downarrow \ (\operatorname{CtType}(T),\ \Xi ,\ \Phi )
\end{array}
$$

**(CtBuiltin-Reflect-Category)**

$$
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{introspect}\quad \mathsf{name}\ =\ \texttt{category}\quad \mathsf{args}\ =\ [\operatorname{CtType}(T)] \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtEnum}([\texttt{TypeCategory}],\ \operatorname{CategoryOf}(T),\ \bot ),\ \Phi )
\end{array}
$$

**(CtBuiltin-Reflect-Fields)**

$$
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{introspect}\quad \mathsf{name}\ =\ \texttt{fields}\quad \mathsf{args}\ =\ [\operatorname{CtType}(T)]\quad \operatorname{ReflectFields}(T)\ =\ \mathsf{infos} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtSlice}(\mathsf{infos}),\ \Phi )
\end{array}
$$

**(CtBuiltin-Reflect-Variants)**

$$
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{introspect}\quad \mathsf{name}\ =\ \texttt{variants}\quad \mathsf{args}\ =\ [\operatorname{CtType}(T)]\quad \operatorname{ReflectVariants}(T)\ =\ \mathsf{infos} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtSlice}(\mathsf{infos}),\ \Phi )
\end{array}
$$

**(CtBuiltin-Reflect-States)**

$$
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{introspect}\quad \mathsf{name}\ =\ \texttt{states}\quad \mathsf{args}\ =\ [\operatorname{CtType}(T)]\quad \operatorname{ReflectStates}(T)\ =\ \mathsf{infos} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtSlice}(\mathsf{infos}),\ \Phi )
\end{array}
$$

**(CtBuiltin-Reflect-Form)**

$$
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{introspect}\quad \mathsf{name}\ =\ \texttt{implements\_form}\quad \mathsf{args}\ =\ [\operatorname{CtType}(T),\ \operatorname{CtType}(\mathsf{form})]\quad b\ =\ \mathsf{true}\ \mathsf{iff}\ \mathsf{the}\ \mathsf{ordinary}\ \mathsf{class}-\mathsf{satisfaction}\ \mathsf{judgment}\ \mathsf{holds}\ \mathsf{for}\ \texttt{T}\ \mathsf{against}\ \texttt{form} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtPrim}(b),\ \Phi )
\end{array}
$$

**(CtBuiltin-Reflect-TypeName)**

$$
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{introspect}\quad \mathsf{name}\ =\ \texttt{type\_name}\quad \mathsf{args}\ =\ [\operatorname{CtType}(T)] \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtString}(\operatorname{TypeRender}(T)),\ \Phi )
\end{array}
$$

**(CtBuiltin-Reflect-ModulePath)**

$$
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{introspect}\quad \mathsf{name}\ =\ \texttt{module\_path}\quad \mathsf{args}\ =\ [\operatorname{CtType}(T)] \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtString}(\operatorname{ModulePathText}(\operatorname{TypeModulePath}(T))),\ \Phi )
\end{array}
$$

Reflection is pure Phase 2 evaluation. For one `CtMachine`, reflection results are immutable except for visibility of declarations emitted earlier in the same Phase 2 order.

### 22.3.6 Lowering

Reflection contributes only to Phase 2 evaluation. Reified `Type` values and reflection result arrays do not survive into Phase 4 unless reified into emitted declarations or literalized constants.

### 22.3.7 Diagnostics

Diagnostics for reflection are defined by §22.6.
