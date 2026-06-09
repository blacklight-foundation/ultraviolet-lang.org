---
title: "12.6 Records"
description: "12.6 Records from 12. Concrete Data Types of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "concrete-data-types"
specSection: "126-records"
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

## 12.6 Records

### 12.6.1 Syntax

```text
record_decl     ::= attribute_list? visibility? "record" identifier generic_params? implements_clause? predicate_clause? record_body invariant_clause?
record_body     ::= "{" record_member* "}"
record_field    ::= attribute_list? visibility? key_boundary? identifier ":" type record_field_init_opt
record_literal  ::= identifier "{" field_init_list "}"
default_record  ::= identifier "(" ")"
```

### 12.6.2 Parsing

**(Parse-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{record})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseGenericParamsOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseImplementsOpt}(P_{3})\ \Downarrow \ (P_{4},\ \mathsf{impls})\quad \Gamma \ \vdash \ \operatorname{ParsePredicateClauseOpt}(P_{4})\ \Downarrow \ (P_{5},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseRecordBody}(P_{5})\ \Downarrow \ (P_{6},\ \mathsf{members})\quad \Gamma \ \vdash \ \operatorname{ParseInvariantOpt}(P_{6})\ \Downarrow \ (P_{7},\ \mathsf{invariant}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseItem}(P)\ \Downarrow \ (P_{7},\ \langle \mathsf{RecordDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{impls},\ \mathsf{members},\ \mathsf{invariant}_{\mathsf{opt}},\ \operatorname{SpanBetween}(P,\ P_{7}),\ []\rangle )
\end{array}
$$

**(Parse-RecordBody)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseRecordMemberList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{members})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRecordBody}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \mathsf{members})
\end{array}
$$

**(Parse-RecordMemberList-End)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRecordMemberList}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-RecordMemberList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseRecordMember}(P)\ \Downarrow \ (P_{1},\ m)\quad \Gamma \ \vdash \ \operatorname{ParseRecordMemberSep}(P_{1})\ \Downarrow \ P_{2}\quad \Gamma \ \vdash \ \operatorname{ParseRecordMemberList}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{ms}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRecordMemberList}(P)\ \Downarrow \ (P_{3},\ [m]\ \mathbin{++} \ \mathsf{ms})
\end{array}
$$

**(Parse-RecordMember-Method)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{procedure})\quad \Gamma \ \vdash \ \operatorname{ParseMethodDefAfterVis}(P_{1},\ \mathsf{vis},\ \mathsf{attrs}_{\mathsf{opt}})\ \Downarrow \ (P_{2},\ m) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRecordMember}(P)\ \Downarrow \ (P_{2},\ m)
\end{array}
$$

**(Parse-RecordMember-AssociatedType)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{type})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseAssocTypeDefaultOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{default}_{\mathsf{type}\_\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRecordMember}(P)\ \Downarrow \ (P_{3},\ \langle \mathsf{AssociatedTypeDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{default}_{\mathsf{type}\_\mathsf{opt}},\ \operatorname{SpanBetween}(P,\ P_{3}),\ []\rangle )
\end{array}
$$

**(Parse-RecordMember-Field)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \lnot \ \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{procedure})\ \land \ \lnot \ \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{type})\quad \Gamma \ \vdash \ \operatorname{ParseRecordFieldDeclAfterVis}(P_{1},\ \mathsf{vis},\ \mathsf{attrs}_{\mathsf{opt}})\ \Downarrow \ (P_{2},\ f) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRecordMember}(P)\ \Downarrow \ (P_{2},\ f)
\end{array}
$$

**(Parse-RecordFieldDeclAfterVis)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseKeyBoundaryOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{boundary})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{name})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{ty})\quad \Gamma \ \vdash \ \operatorname{ParseRecordFieldInitOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{init}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRecordFieldDeclAfterVis}(P,\ \mathsf{vis},\ \mathsf{attrs}_{\mathsf{opt}})\ \Downarrow \ (P_{3},\ \langle \mathsf{FieldDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{name},\ \mathsf{ty},\ \mathsf{init}_{\mathsf{opt}},\ \operatorname{SpanBetween}(P,\ P_{3}),\ \bot \rangle )
\end{array}
$$

**(Parse-RecordFieldInitOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"="}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRecordFieldInitOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-RecordFieldInitOpt-Yes)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"="})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRecordFieldInitOpt}(P)\ \Downarrow \ (P_{1},\ e)
\end{array}
$$

**(Parse-Record-Literal)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseTypePath}(P)\ \Downarrow \ (P_{1},\ \mathsf{path})\quad \mid \mathsf{path}\mid \ =\ 1\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseFieldInitList}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{fields})\quad \mathsf{fields}\ \ne \ []\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (\operatorname{Advance}(P_{2}),\ \operatorname{RecordExpr}(\operatorname{TypePath}(\mathsf{path}),\ \mathsf{fields}))
\end{array}
$$

### 12.6.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{RecordDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{implements},\ \mathsf{members},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}\rangle  \\[0.16em]
\mathsf{RecordDecl}.\mathsf{implements}\ \in \ [\mathsf{ClassPath}]
\end{array}
$$

$$
\begin{array}{l}
\mathsf{RecordMember}\ \in \ \{ \\[0.16em]
\ \mathsf{FieldDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{name},\ \mathsf{type},\ \mathsf{init}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}\rangle , \\[0.16em]
\ \mathsf{MethodDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{override},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{receiver},\ \mathsf{params},\ \mathsf{return}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}\rangle , \\[0.16em]
\ \mathsf{AssociatedTypeDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{default}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}\rangle  \\[0.16em]
\}
\end{array}
$$

$$
\mathsf{RecordExpr}\ =\ \langle \mathsf{type}_{\mathsf{ref}},\ \mathsf{fields}\rangle \ \mathsf{where}\ \mathsf{type}_{\mathsf{ref}}\ \in \ \{\operatorname{TypePath}(\mathsf{path}),\ \operatorname{ModalStateRef}(\mathsf{modal}_{\mathsf{ref}},\ \mathsf{state})\}
$$

$$
\begin{array}{l}
\operatorname{Fields}(R)\ =\ [\ f\ \mid \ f\ \in \ R.\mathsf{members}\ \land \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{name},\ \mathsf{ty},\ \mathsf{init},\ \mathsf{span},\ \mathsf{doc}.\ f\ =\ \operatorname{FieldDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{name},\ \mathsf{ty},\ \mathsf{init},\ \mathsf{span},\ \mathsf{doc})\ ] \\[0.16em]
\operatorname{Methods}(R)\ =\ [\ m\ \mid \ m\ \in \ R.\mathsf{members}\ \land \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{override},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}.\ m\ =\ \operatorname{MethodDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{override},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\ ]
\end{array}
$$

$$
\begin{array}{l}
\mathsf{BuiltinRecord}\ =\ \{\texttt{RegionOptions},\ \texttt{DirEntry},\ \texttt{Context},\ \texttt{System}\} \\[0.16em]
\operatorname{RecordPath}(R)\ =\ [R.\mathsf{name}]\quad \mathsf{if}\ R.\mathsf{name}\ \in \ \mathsf{BuiltinRecord} \\[0.16em]
\operatorname{RecordPath}(R)\ =\ \operatorname{FullPath}(\operatorname{ModuleOf}(R),\ R.\mathsf{name})\quad \mathsf{otherwise}
\end{array}
$$

### 12.6.4 Static Semantics

**(Bind-Record)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ItemBindings}(\operatorname{RecordDecl}(\_,\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_),\ p)\ \Downarrow \ [(\mathsf{name},\ \langle \mathsf{Type},\ p,\ \bot ,\ \mathsf{Decl}\rangle )]
\end{array}
$$

**(Resolve-RecordPath)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path}\ \mathbin{++} \ [\mathsf{name}])\ \Downarrow \ p\quad \operatorname{RecordDecl}(p)\ =\ R \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveRecordPath}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p
\end{array}
$$

**(ResolveQual-Name-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveRecordPath}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p\quad \operatorname{SplitLast}(p)\ =\ (\mathsf{mp},\ \mathsf{name}') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveQualifiedForm}(\operatorname{QualifiedName}(\mathsf{path},\ \mathsf{name}))\ \Downarrow \ \operatorname{Path}(\mathsf{mp},\ \mathsf{name}')
\end{array}
$$

**(ResolveQual-Apply-RecordLit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveFieldInits}(\mathsf{fields})\ \Downarrow \ \mathsf{fields}'\quad \Gamma \ \vdash \ \operatorname{ResolveRecordPath}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveQualifiedForm}(\operatorname{QualifiedApply}(\mathsf{path},\ \mathsf{name},\ \operatorname{Brace}(\mathsf{fields})))\ \Downarrow \ \operatorname{RecordExpr}(\operatorname{TypePath}(p),\ \mathsf{fields}')
\end{array}
$$

**(ResolveItem-Record)**

$$
\begin{array}{l}
R\ =\ \operatorname{RecordDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{impls},\ \mathsf{members},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc})\quad S_{\mathsf{gen}}\ =\ \operatorname{TypeParamBindings}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \Gamma_{g} \ =\ [S_{\mathsf{gen}},\ S_{\mathsf{module}},\ S_{\mathsf{universe}}]\quad \Gamma_{g} \ \vdash \ \operatorname{ResolveGenericParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\ \Downarrow \ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}}'\quad \Gamma_{g} \ \vdash \ \operatorname{ResolvePredicateClauseOpt}(\mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}})\ \Downarrow \ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}'\quad \Gamma_{g} \ \vdash \ \operatorname{ResolveClassPathList}(\mathsf{impls})\ \Downarrow \ \mathsf{impls}'\quad \Gamma_{g} \ \vdash \ \operatorname{ResolveRecordMemberList}(R,\ \mathsf{members})\ \Downarrow \ \mathsf{members}'\quad \Gamma_{g} \ \vdash \ \operatorname{ResolveInvariantOpt}(\mathsf{invariant}_{\mathsf{opt}})\ \Downarrow \ \mathsf{invariant}_{\mathsf{opt}}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveItem}(R)\ \Downarrow \ \operatorname{RecordDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}}',\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}',\ \mathsf{impls}',\ \mathsf{members}',\ \mathsf{invariant}_{\mathsf{opt}}',\ \mathsf{span},\ \mathsf{doc})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{InitOk}(f)\ \Leftrightarrow \ f\ =\ \operatorname{FieldDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{name},\ T_{f},\ \mathsf{init}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc})\ \land \ (\mathsf{init}_{\mathsf{opt}}\ =\ \bot )\ \lor \ (\mathsf{init}_{\mathsf{opt}}\ =\ e\ \land \ \Gamma ;\ \bot ;\ \bot \ \vdash \ e\ :\ T\ \land \ \Gamma \ \vdash \ T\ \mathrel{<:} \ T_{f}) \\[0.16em]
\operatorname{VisRank}(\texttt{public})\ =\ 3\quad \operatorname{VisRank}(\texttt{internal})\ =\ 2\quad \operatorname{VisRank}(\texttt{private})\ =\ 1 \\[0.16em]
\operatorname{FieldVisOk}(R)\ \Leftrightarrow \ \forall \ f\ \in \ \operatorname{Fields}(R).\ \operatorname{VisRank}(f.\mathsf{vis})\ \le \ \operatorname{VisRank}(R.\mathsf{vis})
\end{array}
$$

**(WF-Record)**

$$
\begin{array}{l}
\forall \ f\ \in \ \operatorname{Fields}(R),\ \operatorname{InitOk}(f)\quad \forall \ f_{i}\ \ne \ f_{j},\ f_{i}.\mathsf{name}\ \ne \ f_{j}.\mathsf{name} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ R\ \mathsf{record}\ \mathsf{wf}
\end{array}
$$

**(WF-Record-DupField)**

$$
\begin{array}{l}
\exists \ f_{i}\ \ne \ f_{j}.\ f_{i}.\mathsf{name}\ =\ f_{j}.\mathsf{name}\quad c\ =\ \operatorname{Code}(\mathsf{WF}-\mathsf{Record}-\mathsf{DupField}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ R\ \mathsf{record}\ \mathsf{wf}\ \Uparrow \ c
\end{array}
$$

**(WF-RecordDecl)**

$$
\begin{array}{l}
R\ =\ \operatorname{RecordDecl}(\_,\ \_,\ \_,\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \_,\ \_,\ \_,\ \_,\ \_)\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \mathsf{params}_{\mathsf{gen}}\ =\ [P_{1},\ \ldots ,\ P_{n}]\quad \Gamma \ \vdash \ \langle P_{1};\ \ldots ;\ P_{n}\rangle \ \mathsf{wf}\quad \Gamma_{g} \ =\ \operatorname{BindTypeParams}(\Gamma ,\ \mathsf{params}_{\mathsf{gen}})\quad \Gamma_{g} ;\ \mathsf{params}_{\mathsf{gen}}\ \vdash \ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}\ \mathsf{wf}\quad \forall \ f\ \in \ \operatorname{Fields}(R),\ \Gamma_{g} \ \vdash \ f.\mathsf{type}\ \mathsf{wf}\quad \operatorname{FieldVisOk}(R)\quad \Gamma_{g} \ \vdash \ R\ \mathsf{record}\ \mathsf{wf}\quad \Gamma_{g} \ \vdash \ \operatorname{Methods}(R)\ :\ \mathsf{ok}\quad \Gamma_{g} \ \vdash \ \operatorname{TypePath}(\operatorname{RecordPath}(R))\ :\ \mathsf{ImplementsOk} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ R\ \mathsf{record}\ :\ \mathsf{ok}
\end{array}
$$

**(FieldVisOk-Err)**

$$
\begin{array}{l}
R\ =\ \operatorname{RecordDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\quad \lnot \ \operatorname{FieldVisOk}(R)\quad c\ =\ \operatorname{Code}(\mathsf{FieldVisOk}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ R\ \Uparrow \ c
\end{array}
$$

$$
\begin{array}{l}
\operatorname{DefaultConstructible}(R)\ \Leftrightarrow \ \forall \ f\ \in \ \operatorname{Fields}(R).\ f.\mathsf{init}_{\mathsf{opt}}\ \ne \ \bot  \\[0.16em]
\operatorname{RecordCallee}(\mathsf{callee})\ =\ R\ \Leftrightarrow \ (\mathsf{callee}\ =\ \operatorname{Identifier}(\mathsf{name})\ \lor \ \mathsf{callee}\ =\ \operatorname{Path}(\mathsf{path},\ \mathsf{name}))\ \land \ \Gamma \ \vdash \ \operatorname{ResolveTypeName}(\mathsf{name})\ \Downarrow \ \mathsf{ent}\ \land \ \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ \mathsf{mp}\ \land \ \mathsf{name}'\ =\ (\mathsf{ent}.\mathsf{target}_{\mathsf{opt}}\ \mathsf{if}\ \mathsf{present},\ \mathsf{else}\ \mathsf{name})\ \land \ \operatorname{RecordDecl}(\operatorname{FullPath}(\operatorname{PathOfModule}(\mathsf{mp}),\ \mathsf{name}'))\ =\ R
\end{array}
$$

**(T-Record-Default)**

$$
\begin{array}{l}
\operatorname{RecordCallee}(\mathsf{callee})\ =\ R\quad \Gamma \ \vdash \ R\ \mathsf{record}\ \mathsf{wf}\quad \operatorname{DefaultConstructible}(R) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Call}(\mathsf{callee},\ [])\ :\ \operatorname{TypePath}(\operatorname{RecordPath}(R))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{FieldNames}(R)\ =\ [\ f.\mathsf{name}\ \mid \ f\ \in \ \operatorname{Fields}(R)\ ] \\[0.16em]
\operatorname{FieldInitNames}(\mathsf{fields})\ =\ [\ f\ \mid \ \langle f,\ \_\rangle \ \in \ \mathsf{fields}\ ] \\[0.16em]
\operatorname{Set}(\mathsf{xs})\ =\ \{\ x\ \mid \ x\ \in \ \mathsf{xs}\ \} \\[0.16em]
\operatorname{FieldNameSet}(R)\ =\ \operatorname{Set}(\operatorname{FieldNames}(R)) \\[0.16em]
\operatorname{FieldInitSet}(\mathsf{fields})\ =\ \operatorname{Set}(\operatorname{FieldInitNames}(\mathsf{fields})) \\[0.16em]
\operatorname{FieldType}(R,\ f)\ =\ T_{f}\ \Leftrightarrow \ \exists \ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{init}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}.\ \operatorname{FieldDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{boundary},\ f,\ T_{f},\ \mathsf{init}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}})\ \in \ \operatorname{Fields}(R) \\[0.16em]
\operatorname{FieldVis}(R,\ f)\ =\ \mathsf{vis}\ \Leftrightarrow \ \exists \ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{boundary},\ T_{f},\ \mathsf{init}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}.\ \operatorname{FieldDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{boundary},\ f,\ T_{f},\ \mathsf{init}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}})\ \in \ \operatorname{Fields}(R) \\[0.16em]
\operatorname{FieldVisible}(m,\ R,\ f)\ \Leftrightarrow \ \operatorname{FieldVis}(R,\ f)\ \in \ \{\texttt{public},\ \texttt{internal}\}\ \lor \ (\operatorname{FieldVis}(R,\ f)\ =\ \texttt{private}\ \land \ \operatorname{ModuleOfPath}(\operatorname{RecordPath}(R))\ =\ m)
\end{array}
$$

**(T-Record-Literal)**

$$
\begin{array}{l}
\operatorname{RecordDecl}(p)\ =\ R\quad \operatorname{Distinct}(\operatorname{FieldInitNames}(\mathsf{fields}))\quad \operatorname{FieldInitSet}(\mathsf{fields})\ =\ \operatorname{FieldNameSet}(R)\quad \forall \ \langle f,\ e\rangle \ \in \ \mathsf{fields},\ \operatorname{FieldType}(R,\ f)\ =\ T_{f}\ \land \ \operatorname{FieldVisible}(m,\ R,\ f)\ \land \ \Gamma ;\ R;\ L\ \vdash \ e\ \Leftarrow \ T_{f}\ \dashv \ \emptyset  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{RecordExpr}(\operatorname{TypePath}(p),\ \mathsf{fields})\ :\ \operatorname{TypePath}(p)
\end{array}
$$

**(T-Record-Literal-ExpectedApply)**

$$
\begin{array}{l}
\mathsf{Expected}\ =\ \operatorname{TypeApply}(p,\ \mathsf{args})\quad \operatorname{RecordDecl}(p)\ =\ R\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(R.\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{args})\ =\ \mathsf{args}'\quad \theta \ =\ [\mathsf{args}'\_i\ /\ \mathsf{params}_{\mathsf{gen}}[i].\mathsf{name}]\quad \operatorname{Distinct}(\operatorname{FieldInitNames}(\mathsf{fields}))\quad \operatorname{FieldInitSet}(\mathsf{fields})\ =\ \operatorname{FieldNameSet}(R)\quad \forall \ \langle f,\ e\rangle \ \in \ \mathsf{fields},\ \operatorname{FieldType}(R,\ f)[\theta ]\ =\ T_{f}\ \land \ \operatorname{FieldVisible}(m,\ R,\ f)\ \land \ \Gamma ;\ R;\ L\ \vdash \ e\ \Leftarrow \ T_{f}\ \dashv \ \emptyset  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{RecordExpr}(\operatorname{TypePath}(p),\ \mathsf{fields})\ \Leftarrow \ \mathsf{Expected}\ :\ \mathsf{Expected}
\end{array}
$$

### 12.6.5 Dynamic Semantics

$$
\operatorname{ValueType}(\operatorname{RecordValue}(\operatorname{TypePath}(p),\ \mathsf{io}))\ =\ \operatorname{TypePath}(p)
$$

**(EvalSigma-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalFieldInitsSigma}(\mathsf{fields},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{f}),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{RecordExpr}(\mathsf{tr},\ \mathsf{fields}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{RecordValue}(\mathsf{tr},\ \mathsf{vec}_{f})),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Record-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalFieldInitsSigma}(\mathsf{fields},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{RecordExpr}(\mathsf{tr},\ \mathsf{fields}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

$$
\operatorname{RecordDefaultInits}(p)\ =\ [\langle f_{1},\ e_{1}\rangle ,\ \ldots ,\ \langle f_{n},\ e_{n}\rangle ]\ \Leftrightarrow \ \operatorname{RecordDecl}(p)\ =\ R\ \land \ \operatorname{Fields}(R)\ =\ [\operatorname{FieldDecl}(\mathsf{attrs}_{1},\ \mathsf{vis}_{1},\ \mathsf{boundary}_{1},\ f_{1},\ T_{1},\ e_{1},\ \mathsf{span}_{1},\ \mathsf{doc}_{1}),\ \ldots ,\ \operatorname{FieldDecl}(\mathsf{attrs}_{n},\ \mathsf{vis}_{n},\ \mathsf{boundary}_{n},\ f_{n},\ T_{n},\ e_{n},\ \mathsf{span}_{n},\ \mathsf{doc}_{n})]\ \land \ \forall \ i.\ e_{i}\ \ne \ \bot 
$$

**(ApplyRecordCtorSigma)**

$$
\begin{array}{l}
\operatorname{RecordDefaultInits}(p)\ =\ \mathsf{fields}\quad \Gamma \ \vdash \ \operatorname{EvalFieldInitsSigma}(\mathsf{fields},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{f}),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ApplyRecordCtorSigma}(p,\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{RecordValue}(\operatorname{TypePath}(p),\ \mathsf{vec}_{f})),\ \sigma_{1} )
\end{array}
$$

**(ApplyRecordCtorSigma-Ctrl)**

$$
\begin{array}{l}
\operatorname{RecordDefaultInits}(p)\ =\ \mathsf{fields}\quad \Gamma \ \vdash \ \operatorname{EvalFieldInitsSigma}(\mathsf{fields},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ApplyRecordCtorSigma}(p,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

### 12.6.6 Lowering

$$
\begin{array}{l}
\operatorname{AlignUp}(x,\ a)\ =\ \lceil x/a\rceil \ \times \ a\quad \mathsf{where}\ a\ >\ 0 \\[0.16em]
\operatorname{Offsets}([])\ =\ [] \\[0.16em]
\operatorname{Offsets}(\mathsf{fields})\ =\ [\mathsf{offset}_{1},\ \ldots ,\ \mathsf{offset}_{n}]\ \Leftrightarrow \ \mathsf{fields}\ =\ [\langle f_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle f_{n},\ T_{n}\rangle ]\ \land \ n\ \ge \ 1\ \land \ \mathsf{offset}_{1}\ =\ 0\ \land \ \forall \ i\ \in \ \{2,\ \ldots ,\ n\}.\ \mathsf{offset}_{i}\ =\ \operatorname{AlignUp}(\mathsf{offset}\_\{i-1\}\ +\ \operatorname{sizeof}(T\_\{i-1\}),\ \operatorname{alignof}(T_{i})) \\[0.16em]
\operatorname{RecordAlign}([])\ =\ 1 \\[0.16em]
\operatorname{RecordAlign}(\mathsf{fields})\ =\ \mathsf{max}\_\{i\ \in \ \{1,\ \ldots ,\ n\}\}(\operatorname{alignof}(T_{i}))\ \Leftrightarrow \ \mathsf{fields}\ =\ [\langle f_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle f_{n},\ T_{n}\rangle ]\ \land \ n\ \ge \ 1 \\[0.16em]
\operatorname{RecordSize}([])\ =\ 0 \\[0.16em]
\operatorname{RecordSize}(\mathsf{fields})\ =\ \operatorname{AlignUp}(\mathsf{offset}_{n}\ +\ \operatorname{sizeof}(T_{n}),\ \operatorname{RecordAlign}(\mathsf{fields}))\ \Leftrightarrow \ \mathsf{fields}\ =\ [\langle f_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle f_{n},\ T_{n}\rangle ]\ \land \ n\ \ge \ 1\ \land \ \operatorname{Offsets}(\mathsf{fields})\ =\ [\mathsf{offset}_{1},\ \ldots ,\ \mathsf{offset}_{n}] \\[0.16em]
\mathsf{RecordLayoutJudg}\ =\ \{\mathsf{RecordLayout}\}
\end{array}
$$

**(Layout-Record-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RecordLayout}([])\ \Downarrow \ \langle 0,\ 1,\ []\rangle 
\end{array}
$$

**(Layout-Record-Cons)**

$$
\begin{array}{l}
n\ \ge \ 1\quad \mathsf{offsets}\ =\ [\mathsf{offset}_{1},\ \ldots ,\ \mathsf{offset}_{n}]\quad \mathsf{align}\ =\ \operatorname{RecordAlign}(\mathsf{fields})\quad \mathsf{size}\ =\ \operatorname{RecordSize}(\mathsf{fields}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RecordLayout}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \mathsf{offsets}\rangle 
\end{array}
$$

**(Size-Record)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \operatorname{Fields}(R)\ =\ \mathsf{fields}\quad \operatorname{RecordLayout}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{size},\ \_,\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ \mathsf{size}
\end{array}
$$

**(Align-Record)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \operatorname{Fields}(R)\ =\ \mathsf{fields}\quad \operatorname{RecordLayout}(\mathsf{fields})\ \Downarrow \ \langle \_,\ \mathsf{align},\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{align}
\end{array}
$$

**(Layout-Record)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \operatorname{Fields}(R)\ =\ \mathsf{fields}\quad \operatorname{RecordLayout}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{FieldOffset}(\mathsf{fields},\ f_{i})\ =\ \mathsf{offset}_{i}\ \Leftrightarrow \ \mathsf{fields}\ =\ [\langle f_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle f_{n},\ T_{n}\rangle ]\ \land \ 1\ \le \ i\ \le \ n\ \land \ \operatorname{Offsets}(\mathsf{fields})\ =\ [\mathsf{offset}_{1},\ \ldots ,\ \mathsf{offset}_{n}] \\[0.16em]
\operatorname{FieldValueList}(\mathsf{io},\ f)\ =\ v\ \Leftrightarrow \ \langle f,\ v\rangle \ \in \ \mathsf{io} \\[0.16em]
\operatorname{StructBits}([T_{1},\ \ldots ,\ T_{n}],\ [v_{1},\ \ldots ,\ v_{n}],\ [o_{1},\ \ldots ,\ o_{n}],\ \mathsf{size})\ =\ \mathsf{bits}\ \Leftrightarrow \ \mid \mathsf{bits}\mid \ =\ \mathsf{size}\ \land \ \forall \ i.\ \operatorname{ValueBits}(T_{i},\ v_{i})\ =\ b_{i}\ \land \ \mathsf{bits}[o_{i}..o_{i}+\mid b_{i}\mid )\ =\ b_{i}\ \land \ \forall \ j.\ (\forall \ i.\ j\ \notin \ [o_{i},\ o_{i}+\mid b_{i}\mid ))\ \Rightarrow \ \mathsf{bits}[j]\ =\ 0\mathsf{x00} \\[0.16em]
\operatorname{PadBytes}(b,\ \mathsf{size})\ =\ \mathsf{bits}\ \Leftrightarrow \ \mid \mathsf{bits}\mid \ =\ \mathsf{size}\ \land \ \mathsf{bits}[0..\mid b\mid )\ =\ b\ \land \ \forall \ i.\ \mid b\mid \ \le \ i\ <\ \mathsf{size}\ \Rightarrow \ \mathsf{bits}[i]\ =\ 0\mathsf{x00} \\[0.16em]
\operatorname{ValueBits}(\operatorname{TypePath}(p),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ \operatorname{RecordDecl}(p)\ =\ R\ \land \ v\ =\ \operatorname{RecordValue}(\operatorname{TypePath}(p),\ \mathsf{io})\ \land \ \operatorname{Fields}(R)\ =\ \mathsf{fields}\ \land \ \operatorname{RecordLayout}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \ \land \ \mathsf{fields}\ =\ [\langle f_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle f_{n},\ T_{n}\rangle ]\ \land \ (\forall \ i.\ \operatorname{FieldValue}(\operatorname{RecordValue}(\operatorname{TypePath}(p),\ \mathsf{io}),\ f_{i})\ =\ v_{i})\ \land \ \operatorname{StructBits}([T_{1},\ \ldots ,\ T_{n}],\ [v_{1},\ \ldots ,\ v_{n}],\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{bits}
\end{array}
$$

**(LowerFieldInits-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerFieldInits}([])\ \Downarrow \ \langle \varepsilon ,\ []\rangle 
\end{array}
$$

**(LowerFieldInits-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle \quad \Gamma \ \vdash \ \operatorname{LowerFieldInits}(\mathsf{io})\ \Downarrow \ \langle \mathsf{IR}_{s},\ \mathsf{vec}_{f}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerFieldInits}([\langle f,\ e\rangle ]\ \mathbin{++} \ \mathsf{io})\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{e},\ \mathsf{IR}_{s}),\ [\langle f,\ v\rangle ]\ \mathbin{++} \ \mathsf{vec}_{f}\rangle 
\end{array}
$$

**(Lower-Expr-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerFieldInits}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{IR},\ \mathsf{vec}_{f}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{RecordExpr}(\mathsf{tr},\ \mathsf{fields}))\ \Downarrow \ \langle \mathsf{IR},\ \operatorname{RecordValue}(\mathsf{tr},\ \mathsf{vec}_{f})\rangle 
\end{array}
$$

**(Lower-CallIR-RecordCtor)**

$$
\begin{array}{l}
\operatorname{CallTarget}(\mathsf{callee})\ =\ \operatorname{RecordCtor}(p)\quad \mathsf{args}\ =\ []\quad \operatorname{RecordDefaultInits}(p)\ =\ \mathsf{fields}\quad \Gamma \ \vdash \ \operatorname{LowerFieldInits}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{IR}_{f},\ \mathsf{vec}_{f}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{CallIR}(\mathsf{callee},\ \mathsf{args}))\ \Downarrow \ \langle \mathsf{IR}_{f},\ \operatorname{RecordValue}(\operatorname{TypePath}(p),\ \mathsf{vec}_{f})\rangle 
\end{array}
$$

### 12.6.7 Diagnostics

| Code         | Severity | Detection    | Condition                                                                |
| ------------ | -------- | ------------ | ------------------------------------------------------------------------ |
| `E-TYP-1901` | Error    | Compile-time | Duplicate field name in record declaration                               |
| `E-TYP-1902` | Error    | Compile-time | Missing field initializer in record literal                              |
| `E-TYP-1903` | Error    | Compile-time | Duplicate field initializer in record literal                            |
| `E-TYP-1904` | Error    | Compile-time | Access to nonexistent field                                              |
| `E-TYP-1905` | Error    | Compile-time | Access to field not visible in current scope                             |
| `E-TYP-1906` | Error    | Compile-time | Field visibility exceeds record visibility                               |
| `E-TYP-1907` | Error    | Compile-time | Non-`Bitcopy` field requires move source expression                      |
| `E-TYP-1911` | Error    | Compile-time | Default record construction requires default initializer for every field |
