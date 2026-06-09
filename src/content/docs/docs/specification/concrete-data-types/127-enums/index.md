---
title: "12.7 Enums"
description: "12.7 Enums from 12. Concrete Data Types of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "concrete-data-types"
specSection: "127-enums"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/concrete-data-types/">12. Concrete Data Types</a>
  <span>Concrete Data Types</span>
</div>

## 12.7 Enums

### 12.7.1 Syntax

```text
enum_decl        ::= attribute_list? visibility? "enum" identifier generic_params? implements_clause? predicate_clause? enum_body invariant_clause?
enum_body        ::= "{" variant_members? "}"
variant_members  ::= variant (terminator variant)* terminator?
variant          ::= identifier variant_payload_opt variant_discriminant_opt
variant_payload  ::= "(" type_list? ")" | "{" field_decl_list? "}"
variant_literal  ::= qualified_variant | qualified_variant "(" arg_exprs? ")" | qualified_variant "{" field_init_list "}"
```

Top-level enum cases are item-separated members. Between top-level enum cases, the implementation MUST accept only statement terminators (`newline` or `;`). A comma MUST NOT be accepted as an enum-case separator.

### 12.7.2 Parsing

**(Parse-Enum)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{enum})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseGenericParamsOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseImplementsOpt}(P_{3})\ \Downarrow \ (P_{4},\ \mathsf{impls})\quad \Gamma \ \vdash \ \operatorname{ParsePredicateClauseOpt}(P_{4})\ \Downarrow \ (P_{5},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseEnumBody}(P_{5})\ \Downarrow \ (P_{6},\ \mathsf{variants})\quad \Gamma \ \vdash \ \operatorname{ParseInvariantOpt}(P_{6})\ \Downarrow \ (P_{7},\ \mathsf{invariant}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseItem}(P)\ \Downarrow \ (P_{7},\ \langle \mathsf{EnumDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{impls},\ \mathsf{variants},\ \mathsf{invariant}_{\mathsf{opt}},\ \operatorname{SpanBetween}(P,\ P_{7}),\ []\rangle )
\end{array}
$$

**(Parse-EnumBody)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseVariantMembers}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{vars})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseEnumBody}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \mathsf{vars})
\end{array}
$$

**(Parse-VariantMembers-Empty)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseVariantMembers}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-VariantMembers-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseVariant}(P)\ \Downarrow \ (P_{1},\ v)\quad \Gamma \ \vdash \ \operatorname{ParseVariantSep}(P_{1})\ \Downarrow \ P_{2}\quad \Gamma \ \vdash \ \operatorname{ParseVariantMembers}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{vs}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseVariantMembers}(P)\ \Downarrow \ (P_{3},\ [v]\ \mathbin{++} \ \mathsf{vs})
\end{array}
$$

**(Parse-VariantSep-End)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseVariantSep}(P)\ \Downarrow \ P
\end{array}
$$

**(Parse-VariantSep-Terminator)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ConsumeTerminatorReq}(P)\ \Downarrow \ P_{1} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseVariantSep}(P)\ \Downarrow \ P_{1}
\end{array}
$$

**(Parse-Variant)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseIdent}(P)\ \Downarrow \ (P_{1},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseVariantPayloadOpt}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{payload}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVariantDiscriminantOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{disc}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseVariant}(P)\ \Downarrow \ (P_{3},\ \langle \mathsf{name},\ \mathsf{payload}_{\mathsf{opt}},\ \mathsf{disc}_{\mathsf{opt}}\rangle )
\end{array}
$$

**(Parse-VariantPayloadOpt-None)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ \notin \ \{\operatorname{Punctuator}(\texttt{"("}),\ \operatorname{Punctuator}(\texttt{"\{"})\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseVariantPayloadOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-VariantPayloadOpt-Tuple)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseTypeList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{ts})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{")"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseVariantPayloadOpt}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{TuplePayload}(\mathsf{ts}))
\end{array}
$$

**(Parse-VariantPayloadOpt-Record)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseFieldDeclList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{io})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseVariantPayloadOpt}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{RecordPayload}(\mathsf{io}))
\end{array}
$$

**(Parse-VariantDiscriminantOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"="}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseVariantDiscriminantOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-VariantDiscriminantOpt-Yes)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"="})\quad t\ =\ \operatorname{Tok}(\operatorname{Advance}(P))\quad t.\mathsf{kind}\ =\ \mathsf{IntLiteral} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseVariantDiscriminantOpt}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P)),\ t)
\end{array}
$$

Commas are not valid separators between top-level enum variants. Payload forms within a variant continue to use the comma-delimited productions they reference.

Enum literal surface forms are parsed first as qualified names or qualified applies and are resolved to `EnumLiteral` by the static semantics of this section.

### 12.7.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{EnumDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{implements},\ \mathsf{variants},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}\rangle  \\[0.16em]
\mathsf{EnumDecl}.\mathsf{implements}\ \in \ [\mathsf{ClassPath}]
\end{array}
$$

$$
\begin{array}{l}
\mathsf{VariantDecl}\ =\ \langle \mathsf{name},\ \mathsf{payload}_{\mathsf{opt}},\ \mathsf{discriminant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}\rangle  \\[0.16em]
\mathsf{VariantPayload}\ \in \ \{\mathsf{TuplePayload}\ =\ [\mathsf{Type}],\ \mathsf{RecordPayload}\ =\ [\mathsf{FieldDecl}]\} \\[0.16em]
\forall \ f\ \in \ \mathsf{RecordPayload}.\ f.\mathsf{init}_{\mathsf{opt}}\ =\ \bot 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Variants}(E)\ =\ E.\mathsf{variants} \\[0.16em]
\mathsf{BuiltinEnum}\ =\ \{\texttt{FileKind},\ \texttt{IoError},\ \texttt{AllocationError},\ \texttt{Priority}\} \\[0.16em]
\operatorname{EnumPathOf}(E)\ =\ [E.\mathsf{name}]\quad \mathsf{if}\ E.\mathsf{name}\ \in \ \mathsf{BuiltinEnum} \\[0.16em]
\operatorname{EnumPathOf}(E)\ =\ \operatorname{FullPath}(\operatorname{ModuleOf}(E),\ E.\mathsf{name})\quad \mathsf{otherwise} \\[0.16em]
\operatorname{EnumPath}(\mathsf{path})\ =\ p\ \Leftrightarrow \ \operatorname{SplitLast}(\mathsf{path})\ =\ (p,\ n) \\[0.16em]
\operatorname{VariantName}(\mathsf{path})\ =\ n\ \Leftrightarrow \ \operatorname{SplitLast}(\mathsf{path})\ =\ (p,\ n) \\[0.16em]
\operatorname{VariantIndex}(E,\ \mathsf{name})\ =\ i\ \Leftrightarrow \ \operatorname{Variants}(E)\ =\ [v_{0},\ \ldots ,\ v_{k}]\ \land \ v_{i}.\mathsf{name}\ =\ \mathsf{name}
\end{array}
$$

### 12.7.4 Static Semantics

**(Bind-Enum)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ItemBindings}(\operatorname{EnumDecl}(\_,\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_),\ p)\ \Downarrow \ [(\mathsf{name},\ \langle \mathsf{Type},\ p,\ \bot ,\ \mathsf{Decl}\rangle )]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{PayloadOptWF}(\bot ) \\[0.16em]
\operatorname{PayloadOptWF}(\operatorname{TuplePayload}([T_{1},\ \ldots ,\ T_{n}]))\ \Leftrightarrow \ \forall \ i.\ \Gamma \ \vdash \ T_{i}\ \mathsf{wf} \\[0.16em]
\operatorname{PayloadOptWF}(\operatorname{RecordPayload}([\langle f_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle f_{k},\ T_{k}\rangle ]))\ \Leftrightarrow \ \operatorname{Distinct}([f_{1},\ \ldots ,\ f_{k}])\ \land \ \forall \ i.\ \Gamma \ \vdash \ T_{i}\ \mathsf{wf}
\end{array}
$$

$$
\Gamma \ \vdash \ \mathsf{payload}_{\mathsf{opt}}\ \mathsf{wf}\ \Leftrightarrow \ \operatorname{PayloadOptWF}(\mathsf{payload}_{\mathsf{opt}})
$$

**(Resolve-EnumUnit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ p\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{VariantPayload}(E,\ \mathsf{name})\ =\ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveEnumUnit}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p
\end{array}
$$

**(Resolve-EnumTuple)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ p\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{VariantPayload}(E,\ \mathsf{name})\ =\ \operatorname{TuplePayload}(\_) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveEnumTuple}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p
\end{array}
$$

**(Resolve-EnumRecord)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ p\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{VariantPayload}(E,\ \mathsf{name})\ =\ \operatorname{RecordPayload}(\_) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveEnumRecord}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p
\end{array}
$$

When an enum record payload literal is checked against an expected `TypeApply(p, args)`,
the payload field types are checked under `DefaultArgs(TypeParamsOf(p), args)` and the
result expression type is the expected `TypeApply(p, args)`.

**(ResolveQual-Name-Enum)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveQualified}(\mathsf{path},\ \mathsf{name},\ \mathsf{ValueKind})\ \uparrow \quad \Gamma \ \vdash \ \operatorname{ResolveRecordPath}(\mathsf{path},\ \mathsf{name})\ \uparrow \quad \Gamma \ \vdash \ \operatorname{ResolveEnumUnit}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveQualifiedForm}(\operatorname{QualifiedName}(\mathsf{path},\ \mathsf{name}))\ \Downarrow \ \operatorname{EnumLiteral}(\operatorname{FullPath}(p,\ \mathsf{name}),\ \bot )
\end{array}
$$

**(ResolveQual-Apply-Enum-Tuple)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveArgs}(\mathsf{args})\ \Downarrow \ \mathsf{args}'\quad \Gamma \ \vdash \ \operatorname{ResolveQualified}(\mathsf{path},\ \mathsf{name},\ \mathsf{ValueKind})\ \uparrow \quad \Gamma \ \vdash \ \operatorname{ResolveRecordPath}(\mathsf{path},\ \mathsf{name})\ \uparrow \quad \Gamma \ \vdash \ \operatorname{ResolveEnumTuple}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveQualifiedForm}(\operatorname{QualifiedApply}(\mathsf{path},\ \mathsf{name},\ \operatorname{Paren}(\mathsf{args})))\ \Downarrow \ \operatorname{EnumLiteral}(\operatorname{FullPath}(p,\ \mathsf{name}),\ \operatorname{Paren}(\operatorname{ArgsExprs}(\mathsf{args}')))
\end{array}
$$

**(ResolveQual-Apply-Enum-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveFieldInits}(\mathsf{fields})\ \Downarrow \ \mathsf{fields}'\quad \Gamma \ \vdash \ \operatorname{ResolveRecordPath}(\mathsf{path},\ \mathsf{name})\ \uparrow \quad \Gamma \ \vdash \ \operatorname{ResolveEnumRecord}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveQualifiedForm}(\operatorname{QualifiedApply}(\mathsf{path},\ \mathsf{name},\ \operatorname{Brace}(\mathsf{fields})))\ \Downarrow \ \operatorname{EnumLiteral}(\operatorname{FullPath}(p,\ \mathsf{name}),\ \operatorname{Brace}(\mathsf{fields}'))
\end{array}
$$

**(ResolveItem-Enum)**

$$
\begin{array}{l}
S_{\mathsf{gen}}\ =\ \operatorname{TypeParamBindings}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \Gamma_{g} \ =\ [S_{\mathsf{gen}},\ S_{\mathsf{module}},\ S_{\mathsf{universe}}]\quad \Gamma_{g} \ \vdash \ \operatorname{ResolveGenericParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\ \Downarrow \ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}}'\quad \Gamma_{g} \ \vdash \ \operatorname{ResolvePredicateClauseOpt}(\mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}})\ \Downarrow \ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}'\quad \Gamma_{g} \ \vdash \ \operatorname{ResolveClassPathList}(\mathsf{impls})\ \Downarrow \ \mathsf{impls}'\quad \Gamma_{g} \ \vdash \ \operatorname{ResolveVariantList}(\mathsf{vars})\ \Downarrow \ \mathsf{vars}'\quad \Gamma_{g} \ \vdash \ \operatorname{ResolveInvariantOpt}(\mathsf{invariant}_{\mathsf{opt}})\ \Downarrow \ \mathsf{invariant}_{\mathsf{opt}}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveItem}(\operatorname{EnumDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{impls},\ \mathsf{vars},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}))\ \Downarrow \ \operatorname{EnumDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}}',\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}',\ \mathsf{impls}',\ \mathsf{vars}',\ \mathsf{invariant}_{\mathsf{opt}}',\ \mathsf{span},\ \mathsf{doc})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{DiscOf}(v,\ n)\ = \\[0.16em]
\ n\quad \mathsf{if}\ \operatorname{disc_opt}(v)\ =\ \bot  \\[0.16em]
\ \operatorname{DiscValue}(\mathsf{tok})\quad \mathsf{if}\ \operatorname{disc_opt}(v)\ =\ \mathsf{tok} \\[0.16em]
\operatorname{DiscValue}(\mathsf{tok})\ =\ \operatorname{IntValue}(\mathsf{tok}) \\[0.16em]
\operatorname{DiscSeq}([],\ n)\ =\ [] \\[0.16em]
\operatorname{DiscSeq}(v\mathbin{::} \mathsf{vs},\ n)\ =\ [\operatorname{DiscOf}(v,\ n)]\ \mathbin{++} \ \operatorname{DiscSeq}(\mathsf{vs},\ \operatorname{DiscOf}(v,\ n)\ +\ 1) \\[0.16em]
\operatorname{EnumVariantNames}(E)\ =\ [v.\mathsf{name}\ \mid \ v\ \in \ \operatorname{Variants}(E)]
\end{array}
$$

$$
\operatorname{EnumDiscriminants}(E)\ \Downarrow \ \mathsf{ds}\ \Leftrightarrow \ \mathsf{ds}\ =\ \operatorname{DiscSeq}(\operatorname{Variants}(E),\ 0)\ \land \ \operatorname{Distinct}(\mathsf{ds})\ \land \ \forall \ d\ \in \ \mathsf{ds}.\ d\ \ge \ 0
$$

**(Enum-Disc-NotInt)**

$$
\begin{array}{l}
\exists \ v\ \in \ \operatorname{Variants}(E).\ \operatorname{disc_opt}(v)\ =\ \mathsf{tok}\quad \mathsf{tok}.\mathsf{kind}\ \ne \ \mathsf{IntLiteral}\quad c\ =\ \operatorname{Code}(\mathsf{Enum}-\mathsf{Disc}-\mathsf{NotInt}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EnumDiscriminants}(E)\ \Uparrow \ c
\end{array}
$$

`Enum-Disc-NotInt` is AST/recovery/reference-model evidence. Source fixtures cover
parse diagnostics for non-integer spelling and semantic diagnostics reached after
integer tokenization.

**(Enum-Disc-Invalid)**

$$
\begin{array}{l}
\exists \ v\ \in \ \operatorname{Variants}(E).\ \operatorname{disc_opt}(v)\ =\ \mathsf{tok}\quad \operatorname{DiscValue}(\mathsf{tok})\ \mathsf{undefined}\quad c\ =\ \operatorname{Code}(\mathsf{Enum}-\mathsf{Disc}-\mathsf{Invalid}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EnumDiscriminants}(E)\ \Uparrow \ c
\end{array}
$$

**(Enum-Disc-Negative)**

$$
\begin{array}{l}
\exists \ v\ \in \ \operatorname{Variants}(E).\ \operatorname{disc_opt}(v)\ =\ \mathsf{tok}\quad \operatorname{DiscValue}(\mathsf{tok})\ =\ d\quad d\ <\ 0\quad c\ =\ \operatorname{Code}(\mathsf{Enum}-\mathsf{Disc}-\mathsf{Negative}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EnumDiscriminants}(E)\ \Uparrow \ c
\end{array}
$$

`Enum-Disc-Negative` is AST/recovery/reference-model evidence unless the source
grammar is expanded to parse signed discriminants.

**(Enum-Disc-Dup)**

$$
\begin{array}{l}
\mathsf{ds}\ =\ \operatorname{DiscSeq}(\operatorname{Variants}(E),\ 0)\quad \lnot \ \operatorname{Distinct}(\mathsf{ds})\quad c\ =\ \operatorname{Code}(\mathsf{Enum}-\mathsf{Disc}-\mathsf{Dup}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EnumDiscriminants}(E)\ \Uparrow \ c
\end{array}
$$

**(Enum-Empty-Err)**

$$
\begin{array}{l}
\operatorname{Variants}(E)\ =\ []\quad c\ =\ \operatorname{Code}(\mathsf{Enum}-\mathsf{Empty}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ E\ \mathsf{enum}\ :\ \mathsf{ok}\ \Uparrow \ c
\end{array}
$$

**(Enum-Variant-Dup)**

$$
\begin{array}{l}
\mathsf{names}\ =\ \operatorname{EnumVariantNames}(E)\quad \lnot \ \operatorname{Distinct}(\mathsf{names})\quad c\ =\ \operatorname{Code}(\mathsf{Enum}-\mathsf{Variant}-\mathsf{Dup}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ E\ \mathsf{enum}\ :\ \mathsf{ok}\ \Uparrow \ c
\end{array}
$$

$$
\begin{array}{l}
\operatorname{MaxDisc}(E)\ =\ \operatorname{max}(\mathsf{ds})\ \Leftrightarrow \ \operatorname{EnumDiscriminants}(E)\ \Downarrow \ \mathsf{ds} \\[0.16em]
\operatorname{DiscType}(E)\ = \\[0.16em]
\ \texttt{u8}\quad \mathsf{if}\ 0\ \le \ \operatorname{MaxDisc}(E)\ \le \ 255 \\[0.16em]
\ \texttt{u16}\ \mathsf{if}\ 256\ \le \ \operatorname{MaxDisc}(E)\ \le \ 65,535 \\[0.16em]
\ \texttt{u32}\ \mathsf{if}\ 65,536\ \le \ \operatorname{MaxDisc}(E)\ \le \ 4,294,967,295 \\[0.16em]
\ \texttt{u64}\ \mathsf{otherwise}
\end{array}
$$

**(WF-EnumDecl)**

$$
\begin{array}{l}
E\ =\ \operatorname{EnumDecl}(\_,\ \_,\ \_,\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \_,\ \mathsf{variants},\ \_,\ \_,\ \_)\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \mathsf{params}_{\mathsf{gen}}\ =\ [P_{1},\ \ldots ,\ P_{n}]\quad \Gamma \ \vdash \ \langle P_{1};\ \ldots ;\ P_{n}\rangle \ \mathsf{wf}\quad \Gamma_{g} \ =\ \operatorname{BindTypeParams}(\Gamma ,\ \mathsf{params}_{\mathsf{gen}})\quad \Gamma_{g} ;\ \mathsf{params}_{\mathsf{gen}}\ \vdash \ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}\ \mathsf{wf}\quad \mathsf{variants}\ \ne \ []\quad \operatorname{Distinct}([v.\mathsf{name}\ \mid \ v\ \in \ \mathsf{variants}])\quad \forall \ v\ \in \ \mathsf{variants},\ \Gamma_{g} \ \vdash \ v.\mathsf{payload}_{\mathsf{opt}}\ \mathsf{wf}\quad \operatorname{EnumDiscriminants}(E)\ \Downarrow \ \_\quad \Gamma_{g} \ \vdash \ \operatorname{TypePath}(\operatorname{EnumPathOf}(E))\ :\ \mathsf{ImplementsOk} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ E\ \mathsf{enum}\ :\ \mathsf{ok}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{VariantPayload}(E,\ v)\ =\ \mathsf{payload}_{\mathsf{opt}}\ \Leftrightarrow \ \exists \ \mathsf{disc},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{VariantDecl}(v,\ \mathsf{payload}_{\mathsf{opt}},\ \mathsf{disc},\ \mathsf{span},\ \mathsf{doc})\ \in \ E.\mathsf{variants} \\[0.16em]
\operatorname{VariantFieldNames}(\mathsf{io})\ =\ [\ f\ \mid \ \operatorname{FieldDecl}(\_,\ \_,\ \_,\ f,\ \_,\ \_,\ \_,\ \_)\ \in \ \mathsf{io}\ ] \\[0.16em]
\operatorname{VariantFieldNameSet}(\mathsf{io})\ =\ \operatorname{Set}(\operatorname{VariantFieldNames}(\mathsf{io})) \\[0.16em]
\operatorname{EnumFieldType}(E,\ v,\ f)\ =\ T_{f}\ \Leftrightarrow \ \operatorname{VariantPayload}(E,\ v)\ =\ \operatorname{RecordPayload}(\mathsf{io})\ \land \ \exists \ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{init}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}.\ \operatorname{FieldDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{boundary},\ f,\ T_{f},\ \mathsf{init}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}})\ \in \ \mathsf{io} \\[0.16em]
\operatorname{TuplePayloadArity}(E,\ v)\ =\ n\ \Leftrightarrow \ \operatorname{VariantPayload}(E,\ v)\ =\ \operatorname{TuplePayload}([T_{1},\ \ldots ,\ T_{n}])
\end{array}
$$

**(T-Enum-Lit-Unit)**

$$
\begin{array}{l}
\operatorname{EnumDecl}(\operatorname{EnumPath}(\mathsf{path}))\ =\ E\quad v\ =\ \operatorname{VariantName}(\mathsf{path})\quad \operatorname{VariantPayload}(E,\ v)\ =\ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{EnumLiteral}(\mathsf{path},\ \bot )\ :\ \operatorname{TypePath}(\operatorname{EnumPath}(\mathsf{path}))
\end{array}
$$

**(Enum-Lit-Unknown)**

$$
\begin{array}{l}
\operatorname{EnumDecl}(\operatorname{EnumPath}(\mathsf{path}))\ =\ E\quad \operatorname{VariantName}(\mathsf{path})\ \notin \ \operatorname{EnumVariantNames}(E)\quad c\ =\ \operatorname{Code}(\mathsf{Enum}-\mathsf{Lit}-\mathsf{Unknown}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{EnumLiteral}(\mathsf{path},\ \mathsf{payload}_{\mathsf{opt}})\ \Uparrow \ c
\end{array}
$$

**(T-Enum-Lit-Tuple)**

$$
\begin{array}{l}
\operatorname{EnumDecl}(\operatorname{EnumPath}(\mathsf{path}))\ =\ E\quad v\ =\ \operatorname{VariantName}(\mathsf{path})\quad \operatorname{VariantPayload}(E,\ v)\ =\ \operatorname{TuplePayload}([T_{1},\ \ldots ,\ T_{n}])\quad \forall \ i,\ \Gamma ;\ R;\ L\ \vdash \ e_{i}\ \Leftarrow \ T_{i}\ \dashv \ \emptyset  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{EnumLiteral}(\mathsf{path},\ \operatorname{Paren}([e_{1},\ \ldots ,\ e_{n}]))\ :\ \operatorname{TypePath}(\operatorname{EnumPath}(\mathsf{path}))
\end{array}
$$

**(Enum-Lit-Tuple-Arity-Err)**

$$
\begin{array}{l}
\operatorname{EnumDecl}(\operatorname{EnumPath}(\mathsf{path}))\ =\ E\quad v\ =\ \operatorname{VariantName}(\mathsf{path})\quad \operatorname{TuplePayloadArity}(E,\ v)\ =\ n\quad \mid \mathsf{es}\mid \ \ne \ n\quad c\ =\ \operatorname{Code}(\mathsf{Enum}-\mathsf{Lit}-\mathsf{Tuple}-\mathsf{Arity}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{EnumLiteral}(\mathsf{path},\ \operatorname{Paren}(\mathsf{es}))\ \Uparrow \ c
\end{array}
$$

**(T-Enum-Lit-Record)**

$$
\begin{array}{l}
\operatorname{EnumDecl}(\operatorname{EnumPath}(\mathsf{path}))\ =\ E\quad v\ =\ \operatorname{VariantName}(\mathsf{path})\quad \operatorname{VariantPayload}(E,\ v)\ =\ \operatorname{RecordPayload}(\mathsf{io})\quad \operatorname{Distinct}(\operatorname{FieldInitNames}(\mathsf{fields}))\quad \operatorname{FieldInitSet}(\mathsf{fields})\ =\ \operatorname{VariantFieldNameSet}(\mathsf{io})\quad \forall \ \langle f,\ e\rangle \ \in \ \mathsf{fields},\ \Gamma ;\ R;\ L\ \vdash \ e\ \Leftarrow \ \operatorname{EnumFieldType}(E,\ v,\ f)\ \dashv \ \emptyset  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{EnumLiteral}(\mathsf{path},\ \operatorname{Brace}(\mathsf{fields}))\ :\ \operatorname{TypePath}(\operatorname{EnumPath}(\mathsf{path}))
\end{array}
$$

**(Enum-Lit-Record-MissingField)**

$$
\begin{array}{l}
\operatorname{EnumDecl}(\operatorname{EnumPath}(\mathsf{path}))\ =\ E\quad v\ =\ \operatorname{VariantName}(\mathsf{path})\quad \operatorname{VariantPayload}(E,\ v)\ =\ \operatorname{RecordPayload}(\mathsf{io})\quad \operatorname{FieldInitSet}(\mathsf{fields})\ \subset \ \operatorname{VariantFieldNameSet}(\mathsf{io})\quad c\ =\ \operatorname{Code}(\mathsf{Enum}-\mathsf{Lit}-\mathsf{Record}-\mathsf{MissingField}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{EnumLiteral}(\mathsf{path},\ \operatorname{Brace}(\mathsf{fields}))\ \Uparrow \ c
\end{array}
$$

### 12.7.5 Dynamic Semantics

$$
\operatorname{ValueType}(\operatorname{EnumValue}(\mathsf{path},\ \mathsf{payload}))\ =\ \operatorname{TypePath}(p)\ \Leftrightarrow \ \operatorname{EnumPath}(\mathsf{path})\ =\ p
$$

**(EvalSigma-Enum-Unit)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{EnumLiteral}(\mathsf{path},\ \bot ),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{EnumValue}(\mathsf{path},\ \bot )),\ \sigma )
\end{array}
$$

**(EvalSigma-Enum-Tuple)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalListSigma}(\mathsf{es},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{v}),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{EnumLiteral}(\mathsf{path},\ \operatorname{Paren}(\mathsf{es})),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{EnumValue}(\mathsf{path},\ \operatorname{TuplePayload}(\mathsf{vec}_{v}))),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Enum-Tuple-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalListSigma}(\mathsf{es},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{EnumLiteral}(\mathsf{path},\ \operatorname{Paren}(\mathsf{es})),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Enum-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalFieldInitsSigma}(\mathsf{fields},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{f}),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{EnumLiteral}(\mathsf{path},\ \operatorname{Brace}(\mathsf{fields})),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{EnumValue}(\mathsf{path},\ \operatorname{RecordPayload}(\mathsf{vec}_{f}))),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Enum-Record-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalFieldInitsSigma}(\mathsf{fields},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{EnumLiteral}(\mathsf{path},\ \operatorname{Brace}(\mathsf{fields})),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

### 12.7.6 Lowering

$$
\begin{array}{l}
\operatorname{EnumDisc}(E,\ \mathsf{name})\ =\ d\ \Leftrightarrow \ \operatorname{EnumDiscriminants}(E)\ \Downarrow \ \mathsf{ds}\ \land \ \operatorname{VariantIndex}(E,\ \mathsf{name})\ =\ i\ \land \ \mathsf{ds}[i]\ =\ d \\[0.16em]
\operatorname{VariantPayloadOpt}(v)\ =\ \mathsf{payload}_{\mathsf{opt}}\ \Leftrightarrow \ v\ =\ \langle \mathsf{name},\ \mathsf{payload}_{\mathsf{opt}},\ \mathsf{disc}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}\rangle  \\[0.16em]
\operatorname{VariantSize}(v)\ =\ 0\ \Leftrightarrow \ \operatorname{VariantPayloadOpt}(v)\ =\ \bot  \\[0.16em]
\operatorname{VariantAlign}(v)\ =\ 1\ \Leftrightarrow \ \operatorname{VariantPayloadOpt}(v)\ =\ \bot  \\[0.16em]
\operatorname{VariantSize}(v)\ =\ s\ \Leftrightarrow \ \operatorname{VariantPayloadOpt}(v)\ =\ \operatorname{TuplePayload}([T_{1},\ \ldots ,\ T_{k}])\ \land \ \operatorname{TupleLayout}([T_{1},\ \ldots ,\ T_{k}])\ \Downarrow \ \langle s,\ a,\ \_\rangle  \\[0.16em]
\operatorname{VariantAlign}(v)\ =\ a\ \Leftrightarrow \ \operatorname{VariantPayloadOpt}(v)\ =\ \operatorname{TuplePayload}([T_{1},\ \ldots ,\ T_{k}])\ \land \ \operatorname{TupleLayout}([T_{1},\ \ldots ,\ T_{k}])\ \Downarrow \ \langle s,\ a,\ \_\rangle  \\[0.16em]
\operatorname{VariantSize}(v)\ =\ s\ \Leftrightarrow \ \operatorname{VariantPayloadOpt}(v)\ =\ \operatorname{RecordPayload}(\mathsf{fields})\ \land \ \operatorname{RecordLayout}(\mathsf{fields})\ \Downarrow \ \langle s,\ a,\ \_\rangle  \\[0.16em]
\operatorname{VariantAlign}(v)\ =\ a\ \Leftrightarrow \ \operatorname{VariantPayloadOpt}(v)\ =\ \operatorname{RecordPayload}(\mathsf{fields})\ \land \ \operatorname{RecordLayout}(\mathsf{fields})\ \Downarrow \ \langle s,\ a,\ \_\rangle  \\[0.16em]
\operatorname{PayloadSize}(E)\ =\ \mathsf{max}\_\{v\ \in \ \operatorname{Variants}(E)\}(\operatorname{VariantSize}(v)) \\[0.16em]
\operatorname{PayloadAlign}(E)\ =\ \mathsf{max}\_\{v\ \in \ \operatorname{Variants}(E)\}(\operatorname{VariantAlign}(v)) \\[0.16em]
\operatorname{EnumDiscType}(E)\ =\ \operatorname{DiscType}(E) \\[0.16em]
\operatorname{EnumAlign}(E)\ =\ \operatorname{max}(\operatorname{alignof}(\operatorname{EnumDiscType}(E)),\ \operatorname{PayloadAlign}(E)) \\[0.16em]
\operatorname{EnumSize}(E)\ =\ \operatorname{AlignUp}(\operatorname{sizeof}(\operatorname{EnumDiscType}(E))\ +\ \operatorname{PayloadSize}(E),\ \operatorname{EnumAlign}(E)) \\[0.16em]
\mathsf{EnumLayoutJudg}\ =\ \{\mathsf{EnumLayout}\}
\end{array}
$$

**(Layout-Enum-Tagged)**

$$
\begin{array}{l}
\mathsf{size}\ =\ \operatorname{EnumSize}(E)\quad \mathsf{align}\ =\ \operatorname{EnumAlign}(E) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EnumLayout}(E)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \operatorname{EnumDiscType}(E),\ \operatorname{PayloadSize}(E)\rangle 
\end{array}
$$

**(Size-Enum)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{EnumLayout}(E)\ \Downarrow \ \langle \mathsf{size},\ \_,\ \_,\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ \mathsf{size}
\end{array}
$$

**(Align-Enum)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{EnumLayout}(E)\ \Downarrow \ \langle \_,\ \mathsf{align},\ \_,\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{align}
\end{array}
$$

**(Layout-Enum)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{EnumLayout}(E)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_,\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{EnumPayloadBits}(E,\ \mathsf{name},\ \bot )\ =\ \mathsf{bits}\ \Leftrightarrow \ (\exists \ v\ \in \ \operatorname{Variants}(E).\ v.\mathsf{name}\ =\ \mathsf{name}\ \land \ \operatorname{VariantPayloadOpt}(v)\ =\ \bot )\ \land \ \operatorname{PadBytes}([],\ \operatorname{PayloadSize}(E))\ =\ \mathsf{bits} \\[0.16em]
\operatorname{EnumPayloadBits}(E,\ \mathsf{name},\ \operatorname{TuplePayload}([v_{1},\ \ldots ,\ v_{k}]))\ =\ \mathsf{bits}\ \Leftrightarrow \ (\exists \ v\ \in \ \operatorname{Variants}(E).\ v.\mathsf{name}\ =\ \mathsf{name}\ \land \ \operatorname{VariantPayloadOpt}(v)\ =\ \operatorname{TuplePayload}([T_{1},\ \ldots ,\ T_{k}]))\ \land \ \operatorname{ValueBits}(\operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{k}]),\ (v_{1},\ \ldots ,\ v_{k}))\ =\ b\ \land \ \operatorname{PadBytes}(b,\ \operatorname{PayloadSize}(E))\ =\ \mathsf{bits} \\[0.16em]
\operatorname{EnumPayloadBits}(E,\ \mathsf{name},\ \operatorname{RecordPayload}(\mathsf{io}))\ =\ \mathsf{bits}\ \Leftrightarrow \ (\exists \ v\ \in \ \operatorname{Variants}(E).\ v.\mathsf{name}\ =\ \mathsf{name}\ \land \ \operatorname{VariantPayloadOpt}(v)\ =\ \operatorname{RecordPayload}(\mathsf{fields}))\ \land \ \operatorname{RecordLayout}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \ \land \ \mathsf{fields}\ =\ [\langle f_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle f_{n},\ T_{n}\rangle ]\ \land \ (\forall \ i.\ \operatorname{FieldValueList}(\mathsf{io},\ f_{i})\ =\ v_{i})\ \land \ \operatorname{StructBits}([T_{1},\ \ldots ,\ T_{n}],\ [v_{1},\ \ldots ,\ v_{n}],\ \mathsf{offsets},\ \mathsf{size})\ =\ b\ \land \ \operatorname{PadBytes}(b,\ \operatorname{PayloadSize}(E))\ =\ \mathsf{bits} \\[0.16em]
\operatorname{ValueBits}(\operatorname{TypePath}(p),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ \operatorname{EnumDecl}(p)\ =\ E\ \land \ v\ =\ \operatorname{EnumValue}(\mathsf{path},\ \mathsf{payload})\ \land \ \operatorname{EnumPath}(\mathsf{path})\ =\ p\ \land \ \mathsf{name}\ =\ \operatorname{VariantName}(\mathsf{path})\ \land \ \operatorname{EnumDisc}(E,\ \mathsf{name})\ =\ d\ \land \ \operatorname{EnumPayloadBits}(E,\ \mathsf{name},\ \mathsf{payload})\ =\ \mathsf{payload}_{\mathsf{bits}}\ \land \ \operatorname{EnumDiscType}(E)\ =\ D\ \land \ D\ =\ \operatorname{TypePrim}(t)\ \land \ \operatorname{ValueBits}(D,\ \operatorname{IntVal}(t,\ d))\ =\ \mathsf{disc}_{\mathsf{bits}}\ \land \ \operatorname{TaggedBits}(\mathsf{disc}_{\mathsf{bits}},\ \mathsf{payload}_{\mathsf{bits}},\ \operatorname{sizeof}(D),\ \operatorname{PayloadSize}(E),\ \operatorname{PayloadAlign}(E),\ \operatorname{EnumSize}(E))\ =\ \mathsf{bits}
\end{array}
$$

**(Lower-Expr-Enum-Unit)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{EnumLiteral}(\mathsf{path},\ \bot ))\ \Downarrow \ \langle \varepsilon ,\ \operatorname{EnumValue}(\mathsf{path},\ \bot )\rangle 
\end{array}
$$

**(Lower-Expr-Enum-Tuple)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerList}(\mathsf{es})\ \Downarrow \ \langle \mathsf{IR},\ \mathsf{vec}_{v}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{EnumLiteral}(\mathsf{path},\ \operatorname{Paren}(\mathsf{es})))\ \Downarrow \ \langle \mathsf{IR},\ \operatorname{EnumValue}(\mathsf{path},\ \operatorname{TuplePayload}(\mathsf{vec}_{v}))\rangle 
\end{array}
$$

**(Lower-Expr-Enum-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerFieldInits}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{IR},\ \mathsf{vec}_{f}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{EnumLiteral}(\mathsf{path},\ \operatorname{Brace}(\mathsf{fields})))\ \Downarrow \ \langle \mathsf{IR},\ \operatorname{EnumValue}(\mathsf{path},\ \operatorname{RecordPayload}(\mathsf{vec}_{f}))\rangle 
\end{array}
$$

### 12.7.7 Diagnostics

| Code         | Severity | Detection    | Condition                                        |
| ------------ | -------- | ------------ | ------------------------------------------------ |
| `E-TYP-1920` | Error    | Compile-time | Enum discriminant is not an integer literal      |
| `E-TYP-1921` | Error    | Compile-time | Enum discriminant literal is invalid             |
| `E-TYP-1922` | Error    | Compile-time | Enum discriminant must be non-negative           |
| `E-TYP-1923` | Error    | Compile-time | Duplicate enum discriminant value                |
| `E-TYP-2001` | Error    | Compile-time | Enum declaration contains no variants            |
| `E-TYP-2002` | Error    | Compile-time | Duplicate variant name in enum declaration       |
| `E-TYP-2007` | Error    | Compile-time | Unknown variant name in enum construction        |
| `E-TYP-2008` | Error    | Compile-time | Variant payload arity mismatch                   |
| `E-TYP-2009` | Error    | Compile-time | Missing field initializer in record-like variant |
