---
title: "13.1 Modal Declarations"
description: "13.1 Modal Declarations from 13. Modal and Special Types of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "modal-and-special-types"
specSection: "131-modal-declarations"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/modal-and-special-types/">13. Modal and Special Types</a>
  <span>Modal and Special Types</span>
</div>

## 13.1 Modal Declarations

### 13.1.1 Syntax

```text
modal_decl        ::= attribute_list? visibility? "modal" identifier generic_params? implements_clause? predicate_clause? modal_body invariant_clause?
modal_body        ::= "{" state_block* "}"
state_block       ::= "@" identifier "{" state_member* "}"
state_member      ::= state_field_decl | state_method_def | transition_def
modal_type_ref    ::= type_path generic_args?
modal_state_type  ::= modal_type_ref "@" identifier
modal_state_expr  ::= modal_type_ref "@" identifier "{" field_init_list? "}"
```

### 13.1.2 Parsing

**(Parse-Modal)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{modal})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseGenericParamsOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseImplementsOpt}(P_{3})\ \Downarrow \ (P_{4},\ \mathsf{impls})\quad \Gamma \ \vdash \ \operatorname{ParsePredicateClauseOpt}(P_{4})\ \Downarrow \ (P_{5},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseModalBody}(P_{5})\ \Downarrow \ (P_{6},\ \mathsf{states})\quad \Gamma \ \vdash \ \operatorname{ParseInvariantOpt}(P_{6})\ \Downarrow \ (P_{7},\ \mathsf{invariant}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseItem}(P)\ \Downarrow \ (P_{7},\ \langle \mathsf{ModalDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{impls},\ \mathsf{states},\ \mathsf{invariant}_{\mathsf{opt}},\ \operatorname{SpanBetween}(P,\ P_{7}),\ []\rangle )
\end{array}
$$

**(Parse-ModalBody)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseStateBlockList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{states})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseModalBody}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \mathsf{states})
\end{array}
$$

**(Parse-StateBlock)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"@"})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{name})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseStateMemberList}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{members})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStateBlock}(P)\ \Downarrow \ (\operatorname{Advance}(P_{2}),\ \langle \mathsf{name},\ \mathsf{members},\ \operatorname{SpanBetween}(P,\ P_{2}),\ []\rangle )
\end{array}
$$

**Modal Type References.**

$$
\operatorname{ParseModalTypeRef}(P)\ \Downarrow \ (P_{2},\ \mathsf{tr})\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{ParseTypePath}(P)\ \Downarrow \ (P_{1},\ \mathsf{path})\ \land \ \Gamma \ \vdash \ \operatorname{ParseGenericArgsOpt}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{args}_{\mathsf{opt}})\ \land \ \mathsf{tr}\ =\ (\operatorname{TypePath}(\mathsf{path})\ \mathsf{if}\ \mathsf{args}_{\mathsf{opt}}\ =\ \bot \ \mathsf{else}\ \operatorname{TypeApply}(\mathsf{path},\ \mathsf{args}_{\mathsf{opt}}))
$$

**(Parse-Modal-State-Type)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseModalTypeRef}(P)\ \Downarrow \ (P_{1},\ \mathsf{modal}_{\mathsf{ref}})\quad \operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{"@"})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{state}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseNonPermType}(P)\ \Downarrow \ (P_{2},\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ \mathsf{state}))
\end{array}
$$

**(Parse-Record-Literal-ModalState)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseModalTypeRef}(P)\ \Downarrow \ (P_{1},\ \mathsf{modal}_{\mathsf{ref}})\quad \operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{"@"})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{state})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseFieldInitList}(\operatorname{Advance}(P_{2}))\ \Downarrow \ (P_{3},\ \mathsf{fields})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{3}),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (\operatorname{Advance}(P_{3}),\ \operatorname{RecordExpr}(\operatorname{ModalStateRef}(\mathsf{modal}_{\mathsf{ref}},\ \mathsf{state}),\ \mathsf{fields}))
\end{array}
$$

`ParseStateMember` dispatches to the owning feature parsers in §§13.2.2, 13.3.2, and 13.4.2.

### 13.1.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{ModalDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{implements},\ \mathsf{states},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}\rangle  \\[0.16em]
\mathsf{ModalDecl}.\mathsf{implements}\ \in \ [\mathsf{ClassPath}]
\end{array}
$$

$$
\mathsf{StateBlock}\ =\ \langle \mathsf{name},\ \mathsf{members},\ \mathsf{span},\ \mathsf{doc}\rangle 
$$

$$
\begin{array}{l}
\mathsf{StateMember}\ \in \ \{ \\[0.16em]
\ \mathsf{StateFieldDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{name},\ \mathsf{type},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}\rangle , \\[0.16em]
\ \mathsf{StateMethodDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{receiver},\ \mathsf{params},\ \mathsf{return}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}\rangle , \\[0.16em]
\ \mathsf{TransitionDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{params},\ \mathsf{target}_{\mathsf{state}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}\rangle  \\[0.16em]
\}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{ModalRef}\ =\ \{\operatorname{TypePath}(\mathsf{path}),\ \operatorname{TypeApply}(\mathsf{path},\ \mathsf{args})\} \\[0.16em]
\mathsf{TypeRef}\ =\ \{\operatorname{TypePath}(\mathsf{path}),\ \operatorname{TypeApply}(\mathsf{path},\ \mathsf{args}),\ \operatorname{ModalStateRef}(\mathsf{modal}_{\mathsf{ref}},\ \mathsf{state})\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{StateBlocks}(M)\ =\ M.\mathsf{states} \\[0.16em]
\operatorname{StateList}(M)\ =\ [\ b.\mathsf{name}\ \mid \ b\ \in \ \operatorname{StateBlocks}(M)\ ] \\[0.16em]
\operatorname{StateNames}(M)\ =\ \{\ S\ \mid \ S\ \in \ \operatorname{StateList}(M)\ \} \\[0.16em]
\operatorname{States}(M)\ =\ \operatorname{StateNames}(M) \\[0.16em]
\operatorname{StateBlockOf}(M,\ S)\ =\ b\ \Leftrightarrow \ b\ \in \ \operatorname{StateBlocks}(M)\ \land \ b.\mathsf{name}\ =\ S \\[0.16em]
\operatorname{StateMembers}(M,\ S)\ =\ b.\mathsf{members}\ \Leftrightarrow \ \operatorname{StateBlockOf}(M,\ S)\ =\ b
\end{array}
$$

$$
\operatorname{Payload}(M,\ S)\ =\ [\langle f,\ T\rangle \ \mid \ \operatorname{StateFieldDecl}(\_,\ \_,\ \_,\ f,\ T,\ \_,\ \_)\ \in \ \operatorname{StateMembers}(M,\ S)]
$$

$$
\begin{array}{l}
\mathsf{BuiltinModal}\ =\ \{\texttt{Region},\ \texttt{File},\ \texttt{DirIter},\ \texttt{CancelToken},\ \texttt{Spawned},\ \texttt{Tracked},\ \texttt{Async},\ \texttt{Outcome}\} \\[0.16em]
\operatorname{ModalPath}(M)\ =\ [M.\mathsf{name}]\quad \mathsf{if}\ M.\mathsf{name}\ \in \ \mathsf{BuiltinModal} \\[0.16em]
\operatorname{ModalPath}(M)\ =\ \operatorname{FullPath}(\operatorname{ModuleOf}(M),\ M.\mathsf{name})\quad \mathsf{otherwise}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ModalSelfRef}(M)\ = \\[0.16em]
\ \{\ \operatorname{TypePath}(\operatorname{ModalPath}(M))\quad \mathsf{if}\ \mathsf{params}_{\mathsf{gen}}\ =\ [] \\[0.16em]
\quad \operatorname{TypeApply}(\operatorname{ModalPath}(M),\ [\operatorname{TypePath}([P_{i}.\mathsf{name}])\ \mid \ P_{i}\ \in \ \mathsf{params}_{\mathsf{gen}}])\quad \mathsf{otherwise} \\[0.16em]
\ \}\quad \mathsf{where}\ \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(M.\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ModalSelfType}(M,\ S)\ =\ \operatorname{TypeModalState}(\operatorname{ModalSelfRef}(M),\ S) \\[0.16em]
\operatorname{ModalSelfBase}(M)\ =\ \operatorname{ModalRefType}(\operatorname{ModalSelfRef}(M))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ModalRefPath}(\operatorname{TypePath}(p))\ =\ p \\[0.16em]
\operatorname{ModalRefPath}(\operatorname{TypeApply}(p,\ \_))\ =\ p \\[0.16em]
\operatorname{ModalRefArgs}(\operatorname{TypePath}(\_))\ =\ [] \\[0.16em]
\operatorname{ModalRefArgs}(\operatorname{TypeApply}(\_,\ \mathsf{args}))\ =\ \mathsf{args} \\[0.16em]
\operatorname{ModalRefType}(\operatorname{TypePath}(p))\ =\ \operatorname{TypePath}(p) \\[0.16em]
\operatorname{ModalRefType}(\operatorname{TypeApply}(p,\ \mathsf{args}))\ =\ \operatorname{TypeApply}(p,\ \mathsf{args})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \Leftrightarrow \ \operatorname{ModalRefPath}(\mathsf{modal}_{\mathsf{ref}})\ =\ p\ \land \ \Sigma .\mathsf{Types}[p]\ =\ \texttt{modal}\ M \\[0.16em]
\operatorname{ModalRefSubst}(\mathsf{modal}_{\mathsf{ref}},\ M)\ =\ \theta \ \Leftrightarrow \ \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(M.\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\ \land \ \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \operatorname{ModalRefArgs}(\mathsf{modal}_{\mathsf{ref}}))\ =\ \mathsf{args}'\ \land \ \theta \ =\ [\mathsf{args}'\_i\ /\ \mathsf{params}_{\mathsf{gen}}[i].\mathsf{name}]
\end{array}
$$

$$
\operatorname{ModalPayload}(\mathsf{modal}_{\mathsf{ref}},\ S)\ =\ [\langle f,\ \operatorname{TypeSubst}(\theta ,\ T)\rangle \ \mid \ \langle f,\ T\rangle \ \in \ \operatorname{Payload}(M,\ S)]\ \mathsf{where}\ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \mathsf{and}\ \theta \ =\ \operatorname{ModalRefSubst}(\mathsf{modal}_{\mathsf{ref}},\ M)
$$

$$
\begin{array}{l}
\operatorname{PayloadMap}(M,\ S)\ = \\[0.16em]
\ \{\ f_{i}\ \mapsto \ T_{i}\ \mid \ \langle f_{i},\ T_{i}\rangle \ \in \ \operatorname{Payload}(M,\ S)\ \}\quad \mathsf{if}\ \operatorname{Distinct}([f_{i}\ \mid \ \langle f_{i},\ T_{i}\rangle \ \in \ \operatorname{Payload}(M,\ S)]) \\[0.16em]
\ \bot \quad \mathsf{otherwise}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ModalPayloadMap}(\mathsf{modal}_{\mathsf{ref}},\ S)\ = \\[0.16em]
\ \{\ f_{i}\ \mapsto \ T_{i}\ \mid \ \langle f_{i},\ T_{i}\rangle \ \in \ \operatorname{ModalPayload}(\mathsf{modal}_{\mathsf{ref}},\ S)\ \}\quad \mathsf{if}\ \operatorname{Distinct}([f_{i}\ \mid \ \langle f_{i},\ T_{i}\rangle \ \in \ \operatorname{ModalPayload}(\mathsf{modal}_{\mathsf{ref}},\ S)]) \\[0.16em]
\ \bot \quad \mathsf{otherwise}
\end{array}
$$

### 13.1.4 Static Semantics

**(WF-Modal-Payload)**

$$
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ T_{i}\ \mathsf{wf}\quad \forall \ i\ \ne \ j,\ f_{i}\ \ne \ f_{j} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Payload}(M,\ S)\ \mathsf{wf}
\end{array}
$$

**(Modal-Payload-DupField)**

$$
\begin{array}{l}
\exists \ i\ \ne \ j.\ f_{i}\ =\ f_{j}\quad c\ =\ \operatorname{Code}(\mathsf{Modal}-\mathsf{Payload}-\mathsf{DupField}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Payload}(M,\ S)\ \mathsf{wf}\ \Uparrow \ c
\end{array}
$$

**(WF-ModalState)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad S\ \in \ \operatorname{States}(M)\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(M.\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \operatorname{ModalRefArgs}(\mathsf{modal}_{\mathsf{ref}}))\ =\ \mathsf{args}'\quad \theta \ =\ [\mathsf{args}'\_i\ /\ \mathsf{params}_{\mathsf{gen}}[i].\mathsf{name}]\quad \forall \ i,\ \Gamma \ \vdash \ \mathsf{args}'\_i\ \mathsf{wf}\quad \forall \ i,\ \Gamma \ \vdash \ \mathsf{args}'\_i\ \mathsf{satisfies}\ \operatorname{Bounds}(\mathsf{params}_{\mathsf{gen}}[i])\quad \Gamma \ \vdash \ M.\mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}[\theta ]\ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}
\end{array}
$$

**(WF-ModalState-ArgCount-Err)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(M.\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \operatorname{ModalRefArgs}(\mathsf{modal}_{\mathsf{ref}}))\ =\ \bot \quad c\ =\ \operatorname{Code}(E-\mathsf{TYP}-2303) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}\ \Uparrow \ c
\end{array}
$$

$$
\operatorname{StateMemberVisOk}(M)\ \Leftrightarrow \ \forall \ S\ \in \ \operatorname{States}(M),\ \forall \ m\ \in \ \operatorname{Payload}(M,\ S)\ \cup \ \operatorname{Methods}(M,\ S)\ \cup \ \operatorname{Transitions}(M,\ S).\ \operatorname{VisRank}(m.\mathsf{vis})\ \le \ \operatorname{VisRank}(M.\mathsf{vis})
$$

**(WF-ModalDecl)**

$$
\begin{array}{l}
M\ =\ \operatorname{ModalDecl}(\_,\ \_,\ \_,\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \_,\ \_,\ \_,\ \_,\ \_)\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \mathsf{params}_{\mathsf{gen}}\ =\ [P_{1},\ \ldots ,\ P_{n}]\quad \Gamma \ \vdash \ \langle P_{1};\ \ldots ;\ P_{n}\rangle \ \mathsf{wf}\quad \Gamma_{g} \ =\ \operatorname{BindTypeParams}(\Gamma ,\ \mathsf{params}_{\mathsf{gen}})\quad \Gamma_{g} ;\ \mathsf{params}_{\mathsf{gen}}\ \vdash \ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}\ \mathsf{wf}\quad p\ =\ \operatorname{ModalPath}(M)\quad \Gamma_{g} \ \vdash \ \texttt{modal}\ M\ \mathsf{wf}\quad \operatorname{StateMemberVisOk}(M)\quad \Gamma_{g} \ \vdash \ \operatorname{TypePath}(p)\ :\ \mathsf{ImplementsOk}\quad \forall \ S\ \in \ \operatorname{States}(M),\ \forall \ \mathsf{md}\ \in \ \operatorname{Methods}(M,\ S),\ \Gamma_{g} \ \vdash \ \mathsf{md}\ :\ \operatorname{StateMethodOK}(M,\ S)\quad \Gamma_{g} \ \vdash \ \mathsf{md}\ :\ \operatorname{StateMethodBodyOK}(p,\ S)\quad \forall \ \mathsf{tr}\ \in \ \operatorname{Transitions}(M,\ S),\ \Gamma_{g} \ \vdash \ \mathsf{tr}\ :\ \operatorname{TransitionOK}(M,\ S)\quad \Gamma_{g} \ \vdash \ \mathsf{tr}\ :\ \operatorname{TransitionBodyOK}(p,\ S) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ M\ \mathsf{modal}\ :\ \mathsf{ok}
\end{array}
$$

**(StateMemberVisOk-Err)**

$$
\begin{array}{l}
M\ =\ \operatorname{ModalDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\quad \lnot \ \operatorname{StateMemberVisOk}(M)\quad c\ =\ \operatorname{Code}(\mathsf{StateMemberVisOk}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ M\ \Uparrow \ c
\end{array}
$$

**(Modal-WF)**

$$
\begin{array}{l}
n\ \ge \ 1\quad \forall \ i\ \in \ 1..n,\ S_{i}\ \mathsf{unique}\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{Payload}(M,\ S_{i})\ \mathsf{wf}\quad \forall \ i,\ S_{i}\ \ne \ M \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \texttt{modal}\ M\ \{\ @S_{1}\ \ldots \ @S_{n}\ \}\ \mathsf{wf}
\end{array}
$$

**(Modal-NoStates-Err)**

$$
\begin{array}{l}
n\ =\ 0\quad c\ =\ \operatorname{Code}(\mathsf{Modal}-\mathsf{NoStates}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \texttt{modal}\ M\ \{\ @S_{1}\ \ldots \ @S_{n}\ \}\ \mathsf{wf}\ \Uparrow \ c
\end{array}
$$

**(Modal-DupState-Err)**

$$
\begin{array}{l}
\lnot \ \operatorname{Distinct}([S_{1},\ \ldots ,\ S_{n}])\quad c\ =\ \operatorname{Code}(\mathsf{Modal}-\mathsf{DupState}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \texttt{modal}\ M\ \{\ @S_{1}\ \ldots \ @S_{n}\ \}\ \mathsf{wf}\ \Uparrow \ c
\end{array}
$$

**(Modal-StateName-Err)**

$$
\begin{array}{l}
\exists \ i.\ S_{i}\ =\ M\quad c\ =\ \operatorname{Code}(\mathsf{Modal}-\mathsf{StateName}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \texttt{modal}\ M\ \{\ @S_{1}\ \ldots \ @S_{n}\ \}\ \mathsf{wf}\ \Uparrow \ c
\end{array}
$$

**(State-Specific-WF)**

$$
\begin{array}{l}
S\ \in \ \operatorname{States}(M) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ M@S\ \mathsf{wf}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ModalPayloadNames}(\mathsf{modal}_{\mathsf{ref}},\ S)\ =\ [\ f\ \mid \ \langle f,\ \_\rangle \ \in \ \operatorname{ModalPayload}(\mathsf{modal}_{\mathsf{ref}},\ S)\ ] \\[0.16em]
\operatorname{ModalPayloadNameSet}(\mathsf{modal}_{\mathsf{ref}},\ S)\ =\ \operatorname{Set}(\operatorname{ModalPayloadNames}(\mathsf{modal}_{\mathsf{ref}},\ S))
\end{array}
$$

**(T-Modal-State-Intro)**

$$
\begin{array}{l}
\operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad S\ \in \ \operatorname{States}(M)\quad \operatorname{ModalRefPath}(\mathsf{modal}_{\mathsf{ref}})\ \notin \ \{[\texttt{"File"}],\ [\texttt{"DirIter"}],\ [\texttt{"CancelToken"}],\ [\texttt{"Spawned"}],\ [\texttt{"Tracked"}],\ [\texttt{"Async"}]\}\quad \operatorname{ModalPayloadNameSet}(\mathsf{modal}_{\mathsf{ref}},\ S)\ =\ \operatorname{FieldInitSet}(\mathsf{fields})\quad \operatorname{Distinct}(\operatorname{FieldInitNames}(\mathsf{fields}))\quad \forall \ \langle f,\ e\rangle \ \in \ \mathsf{fields},\ \operatorname{ModalPayloadMap}(\mathsf{modal}_{\mathsf{ref}},\ S)(f)\ =\ T_{f}\ \land \ \Gamma ;\ R;\ L\ \vdash \ e\ \Leftarrow \ T_{f}\ \dashv \ \emptyset  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{RecordExpr}(\operatorname{ModalStateRef}(\mathsf{modal}_{\mathsf{ref}},\ S),\ \mathsf{fields})\ :\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)
\end{array}
$$

If `modal_ref` is `TypeApply(p, args)`, modal state record payload fields are checked
under `DefaultArgs(TypeParamsOf(p), args)` and the constructed expression type keeps the
same applied modal reference.

**(Record-FileDir-Err)**

$$
\begin{array}{l}
\operatorname{ModalRefPath}(\mathsf{modal}_{\mathsf{ref}})\ \in \ \{[\texttt{"File"}],\ [\texttt{"DirIter"}],\ [\texttt{"CancelToken"}],\ [\texttt{"Spawned"}],\ [\texttt{"Tracked"}],\ [\texttt{"Async"}]\}\quad c\ =\ \operatorname{Code}(\mathsf{Record}-\mathsf{FileDir}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{RecordExpr}(\operatorname{ModalStateRef}(\mathsf{modal}_{\mathsf{ref}},\ S),\ \mathsf{fields})\ \Uparrow \ c
\end{array}
$$

**Built-in Modal Declarations.**

$$
\begin{array}{l}
\mathsf{RegionPayloadFields}\ =\ [\langle \texttt{handle},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ] \\[0.16em]
\operatorname{Payload}(\texttt{Region},\ \texttt{@Active})\ =\ \mathsf{RegionPayloadFields} \\[0.16em]
\operatorname{Payload}(\texttt{Region},\ \texttt{@Frozen})\ =\ \mathsf{RegionPayloadFields} \\[0.16em]
\operatorname{Payload}(\texttt{Region},\ \texttt{@Freed})\ =\ \mathsf{RegionPayloadFields}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{RegionProcs}\ =\ \{\texttt{Region::new\_scoped},\ \texttt{Region::alloc},\ \texttt{Region::reset\_unchecked},\ \texttt{Region::freeze},\ \texttt{Region::thaw},\ \texttt{Region::free\_unchecked}\} \\[0.16em]
\operatorname{RegionProcSig}(\texttt{Region::new\_scoped})\ =\ \langle [\langle \bot ,\ \texttt{options},\ \operatorname{TypePath}([\texttt{"RegionOptions"}])\rangle ],\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}([\texttt{"Region"}],\ \texttt{@Active}))\rangle  \\[0.16em]
\operatorname{RegionProcSig}(\texttt{Region::alloc})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}([\texttt{"Region"}],\ \texttt{@Active}))\rangle ,\ \langle \bot ,\ \texttt{value},\ T\rangle ],\ T\_\{\pi_{\mathsf{Region}} (\texttt{self})\}\rangle \quad (T\ \in \ \mathsf{Type}) \\[0.16em]
\operatorname{RegionProcSig}(\texttt{Region::reset\_unchecked})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}([\texttt{"Region"}],\ \texttt{@Active}))\rangle ],\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}([\texttt{"Region"}],\ \texttt{@Active}))\rangle  \\[0.16em]
\operatorname{RegionProcSig}(\texttt{Region::freeze})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}([\texttt{"Region"}],\ \texttt{@Active}))\rangle ],\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}([\texttt{"Region"}],\ \texttt{@Frozen}))\rangle  \\[0.16em]
\operatorname{RegionProcSig}(\texttt{Region::thaw})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}([\texttt{"Region"}],\ \texttt{@Frozen}))\rangle ],\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}([\texttt{"Region"}],\ \texttt{@Active}))\rangle  \\[0.16em]
\operatorname{RegionProcSig}(\texttt{Region::free\_unchecked})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeUnion}([\operatorname{TypeModalState}([\texttt{"Region"}],\ \texttt{@Active}),\ \operatorname{TypeModalState}([\texttt{"Region"}],\ \texttt{@Frozen})]))\rangle ],\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}([\texttt{"Region"}],\ \texttt{@Freed}))\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ProvType}(T,\ \pi )\ =\ T\_\pi  \\[0.16em]
\operatorname{BaseType}(T\_\pi )\ =\ T \\[0.16em]
\operatorname{ProvOf}(T\_\pi )\ =\ \pi 
\end{array}
$$

$$
\lnot \ \operatorname{BitcopyType}(\operatorname{TypePath}([\texttt{"Region"}]))
$$

**Region Arena Requirements.**
1. `Region::alloc` MUST yield a value with provenance `π_Region(tag)`, where `tag` is the region-provenance tag carried by the receiver handle in the current provenance environment. Fresh region tags are introduced by fresh region-creating constructs, including `region` statements and bindings of freshly created `Region@Active` values such as `Region::new_scoped(...)`. Rebinding a `Region@Active` handle MUST preserve the existing region tag and MUST introduce the new binding name as a target alias in the region-target relation.
2. After `Region::reset_unchecked` or `Region::free_unchecked`, any dereference through a `Ptr<T>@Valid` whose address has an inactive `RegionTag` MUST behave as `Expired` per `PtrState` and `ReadPtrSigma`. Uses of non-pointer values with provenance `π_Region(r)` after reset/free are `OutsideConformance`.
3. `Region::free_unchecked` MUST be invoked exactly once on any `Region` that remains in `@Active` or `@Frozen` at scope exit. Implementations MAY invoke `Region::free_unchecked` implicitly during `RegionStmt` cleanup.

**(Region-Unchecked-Unsafe-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{base}\ :\ T\quad \operatorname{StripPerm}(T)\ =\ \operatorname{TypeModalState}([\texttt{"Region"}],\ S)\quad S\ \in \ \{\texttt{Active},\ \texttt{Frozen}\}\quad \mathsf{name}\ \in \ \{\texttt{"reset\_unchecked"},\ \texttt{"free\_unchecked"}\}\quad \lnot \ \operatorname{UnsafeSpan}(\operatorname{span}(\operatorname{MethodCall}(\mathsf{base},\ \mathsf{name},\ \mathsf{args})))\quad c\ =\ \operatorname{Code}(\mathsf{Region}-\mathsf{Unchecked}-\mathsf{Unsafe}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{MethodCall}(\mathsf{base},\ \mathsf{name},\ \mathsf{args})\ \Uparrow \ c
\end{array}
$$

$$
\begin{array}{l}
[\texttt{"CancelToken"}]\ \in \ \operatorname{dom}(\Sigma .\mathsf{Types}) \\[0.16em]
\operatorname{States}(\texttt{CancelToken})\ =\ \{\ \texttt{@Active}\ \}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{CancelTokenFields}\ =\ [\langle \texttt{id},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ] \\[0.16em]
\operatorname{Payload}(\texttt{CancelToken},\ \texttt{@Active})\ =\ \mathsf{CancelTokenFields}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{CancelTokenActiveMembers}\ =\ [ \\[0.16em]
\ \operatorname{StateFieldDecl}(\bot ,\ \texttt{private},\ \mathsf{false},\ \texttt{id},\ \operatorname{TypePrim}(\texttt{"usize"}),\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{StateMethodDecl}(\bot ,\ \texttt{public},\ \texttt{"cancel"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{shared}),\ [],\ \operatorname{TypePrim}(\texttt{"()"}),\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{StateMethodDecl}(\bot ,\ \texttt{public},\ \texttt{"is\_cancelled"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [],\ \operatorname{TypePrim}(\texttt{"bool"}),\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{StateMethodDecl}(\bot ,\ \texttt{public},\ \texttt{"wait\_cancelled"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [],\ \operatorname{TypeApply}([\texttt{"Async"}],\ [\operatorname{TypePrim}(\texttt{"()"})]),\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{StateMethodDecl}(\bot ,\ \texttt{public},\ \texttt{"child"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [],\ \operatorname{TypeModalState}([\texttt{"CancelToken"}],\ \texttt{@Active}),\ \bot ,\ \bot ,\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{CancelTokenStates}\ =\ [ \\[0.16em]
\ \operatorname{StateBlock}(\texttt{@Active},\ \mathsf{CancelTokenActiveMembers},\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{CancelTokenDecl}\ =\ \operatorname{ModalDecl}(\bot ,\ \texttt{public},\ \texttt{CancelToken},\ \bot ,\ \bot ,\ [],\ \mathsf{CancelTokenStates},\ \bot ,\ \bot ,\ \bot )
\end{array}
$$

$$
\Sigma .\mathsf{Types}[\texttt{"CancelToken"}]\ =\ \texttt{modal}\ \mathsf{CancelTokenDecl}
$$

$$
\begin{array}{l}
\mathsf{CancelTokenProcs}\ =\ \{\texttt{CancelToken::new}\} \\[0.16em]
\operatorname{CancelTokenProcSig}(\texttt{CancelToken::new})\ =\ \langle [],\ \operatorname{TypeModalState}([\texttt{"CancelToken"}],\ \texttt{@Active})\rangle 
\end{array}
$$

$$
\begin{array}{l}
[\texttt{"Spawned"}]\ \in \ \operatorname{dom}(\Sigma .\mathsf{Types}) \\[0.16em]
\operatorname{States}(\texttt{Spawned})\ =\ \{\ \texttt{@Pending},\ \texttt{@Ready}\ \}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{SpawnedParams}\ =\ [\langle \texttt{T},\ [],\ \bot ,\ \bot \rangle ] \\[0.16em]
\mathsf{SpawnedReadyFields}\ =\ [\langle \texttt{value},\ \operatorname{TypePath}([\texttt{"T"}])\rangle ]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Payload}(\texttt{Spawned},\ \texttt{@Pending})\ =\ [] \\[0.16em]
\operatorname{Payload}(\texttt{Spawned},\ \texttt{@Ready})\ =\ \mathsf{SpawnedReadyFields}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{SpawnedPendingMembers}\ =\ [] \\[0.16em]
\mathsf{SpawnedReadyMembers}\ =\ [ \\[0.16em]
\ \operatorname{StateFieldDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{value},\ \operatorname{TypePath}([\texttt{"T"}]),\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{SpawnedStates}\ =\ [ \\[0.16em]
\ \operatorname{StateBlock}(\texttt{@Pending},\ \mathsf{SpawnedPendingMembers},\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{StateBlock}(\texttt{@Ready},\ \mathsf{SpawnedReadyMembers},\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{SpawnedDecl}\ =\ \operatorname{ModalDecl}(\bot ,\ \texttt{public},\ \texttt{Spawned},\ \mathsf{SpawnedParams},\ \bot ,\ [],\ \mathsf{SpawnedStates},\ \bot ,\ \bot ,\ \bot )
\end{array}
$$

$$
\Sigma .\mathsf{Types}[\texttt{"Spawned"}]\ =\ \texttt{modal}\ \mathsf{SpawnedDecl}
$$

$$
\begin{array}{l}
[\texttt{"Tracked"}]\ \in \ \operatorname{dom}(\Sigma .\mathsf{Types}) \\[0.16em]
\operatorname{States}(\texttt{Tracked})\ =\ \{\ \texttt{@Pending},\ \texttt{@Ready}\ \}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{TrackedParams}\ =\ [\langle \texttt{T},\ [],\ \bot ,\ \bot \rangle ,\ \langle \texttt{E},\ [],\ \bot ,\ \bot \rangle ] \\[0.16em]
\mathsf{TrackedReadyFields}\ =\ [\langle \texttt{value},\ \operatorname{TypeUnion}([\operatorname{TypePath}([\texttt{"T"}]),\ \operatorname{TypePath}([\texttt{"E"}])])\rangle ]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Payload}(\texttt{Tracked},\ \texttt{@Pending})\ =\ [] \\[0.16em]
\operatorname{Payload}(\texttt{Tracked},\ \texttt{@Ready})\ =\ \mathsf{TrackedReadyFields}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{TrackedPendingMembers}\ =\ [] \\[0.16em]
\mathsf{TrackedReadyMembers}\ =\ [ \\[0.16em]
\ \operatorname{StateFieldDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{value},\ \operatorname{TypeUnion}([\operatorname{TypePath}([\texttt{"T"}]),\ \operatorname{TypePath}([\texttt{"E"}])]),\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{TrackedStates}\ =\ [ \\[0.16em]
\ \operatorname{StateBlock}(\texttt{@Pending},\ \mathsf{TrackedPendingMembers},\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{StateBlock}(\texttt{@Ready},\ \mathsf{TrackedReadyMembers},\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{TrackedDecl}\ =\ \operatorname{ModalDecl}(\bot ,\ \texttt{public},\ \texttt{Tracked},\ \mathsf{TrackedParams},\ \bot ,\ [],\ \mathsf{TrackedStates},\ \bot ,\ \bot ,\ \bot )
\end{array}
$$

$$
\Sigma .\mathsf{Types}[\texttt{"Tracked"}]\ =\ \texttt{modal}\ \mathsf{TrackedDecl}
$$

$$
\begin{array}{l}
[\texttt{"Outcome"}]\ \in \ \operatorname{dom}(\Sigma .\mathsf{Types}) \\[0.16em]
\operatorname{States}(\texttt{Outcome})\ =\ \{\ \texttt{@Value},\ \texttt{@Error}\ \}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{OutcomeParams}\ =\ [\langle \texttt{TValue},\ [],\ \bot ,\ \bot \rangle ,\ \langle \texttt{TError},\ [],\ \bot ,\ \bot \rangle ] \\[0.16em]
\mathsf{OutcomeValueFields}\ =\ [\langle \texttt{value},\ \operatorname{TypePath}([\texttt{"TValue"}])\rangle ] \\[0.16em]
\mathsf{OutcomeErrorFields}\ =\ [\langle \texttt{error},\ \operatorname{TypePath}([\texttt{"TError"}])\rangle ]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Payload}(\texttt{Outcome},\ \texttt{@Value})\ =\ \mathsf{OutcomeValueFields} \\[0.16em]
\operatorname{Payload}(\texttt{Outcome},\ \texttt{@Error})\ =\ \mathsf{OutcomeErrorFields}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{OutcomeValueMembers}\ =\ [ \\[0.16em]
\ \operatorname{StateFieldDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{value},\ \operatorname{TypePath}([\texttt{"TValue"}]),\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{OutcomeErrorMembers}\ =\ [ \\[0.16em]
\ \operatorname{StateFieldDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{error},\ \operatorname{TypePath}([\texttt{"TError"}]),\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{OutcomeStates}\ =\ [ \\[0.16em]
\ \operatorname{StateBlock}(\texttt{@Value},\ \mathsf{OutcomeValueMembers},\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{StateBlock}(\texttt{@Error},\ \mathsf{OutcomeErrorMembers},\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{OutcomeDecl}\ =\ \operatorname{ModalDecl}(\bot ,\ \texttt{public},\ \texttt{Outcome},\ \mathsf{OutcomeParams},\ \bot ,\ [],\ \mathsf{OutcomeStates},\ \bot ,\ \bot ,\ \bot )
\end{array}
$$

$$
\Sigma .\mathsf{Types}[\texttt{"Outcome"}]\ =\ \texttt{modal}\ \mathsf{OutcomeDecl}
$$

$$
\begin{array}{l}
\operatorname{OutcomeSig}(T)\ =\ \langle \mathsf{TValue},\ \mathsf{TError}\rangle \ \Leftrightarrow \ \operatorname{AliasNorm}(T)\ =\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\mathsf{TValue},\ \mathsf{TError}]) \\[0.16em]
\operatorname{OutcomeSig}(T)\ =\ \bot \ \mathsf{otherwise}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{DirIterOpenMembers}\ =\ [ \\[0.16em]
\ \operatorname{StateFieldDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{handle},\ \operatorname{TypePrim}(\texttt{"usize"}),\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{StateMethodDecl}(\bot ,\ \texttt{public},\ \texttt{"next"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypeUnion}([\operatorname{TypePath}([\texttt{"DirEntry"}]),\ \operatorname{TypePrim}(\texttt{"()"})]),\ \operatorname{TypePath}([\texttt{"IoError"}])]),\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{TransitionDecl}(\bot ,\ \texttt{public},\ \texttt{"close"},\ [],\ \texttt{@Closed},\ \bot ,\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{DirIterClosedMembers}\ =\ [] \\[0.16em]
\mathsf{DirIterStates}\ =\ [ \\[0.16em]
\ \operatorname{StateBlock}(\texttt{@Open},\ \mathsf{DirIterOpenMembers},\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{StateBlock}(\texttt{@Closed},\ \mathsf{DirIterClosedMembers},\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{DirIterDecl}\ =\ \operatorname{ModalDecl}(\bot ,\ \texttt{public},\ \texttt{DirIter},\ \bot ,\ \bot ,\ [],\ \mathsf{DirIterStates},\ \bot ,\ \bot ,\ \bot )
\end{array}
$$

$$
\begin{array}{l}
\mathsf{FileReadMembers}\ =\ [ \\[0.16em]
\ \operatorname{StateFieldDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{handle},\ \operatorname{TypePrim}(\texttt{"usize"}),\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{StateMethodDecl}(\bot ,\ \texttt{public},\ \texttt{"read\_all"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeString}(\texttt{@Managed})),\ \operatorname{TypePath}([\texttt{"IoError"}])]),\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{StateMethodDecl}(\bot ,\ \texttt{public},\ \texttt{"read\_all\_bytes"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeBytes}(\texttt{@Managed})),\ \operatorname{TypePath}([\texttt{"IoError"}])]),\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{TransitionDecl}(\bot ,\ \texttt{public},\ \texttt{"close"},\ [],\ \texttt{@Closed},\ \bot ,\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{FileWriteMembers}\ =\ [ \\[0.16em]
\ \operatorname{StateFieldDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{handle},\ \operatorname{TypePrim}(\texttt{"usize"}),\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{StateMethodDecl}(\bot ,\ \texttt{public},\ \texttt{"write"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [\langle \bot ,\ \texttt{data},\ \operatorname{TypeBytes}(\texttt{@View})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePath}([\texttt{"IoError"}])]),\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{StateMethodDecl}(\bot ,\ \texttt{public},\ \texttt{"flush"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePath}([\texttt{"IoError"}])]),\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{TransitionDecl}(\bot ,\ \texttt{public},\ \texttt{"close"},\ [],\ \texttt{@Closed},\ \bot ,\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{FileAppendMembers}\ =\ [ \\[0.16em]
\ \operatorname{StateFieldDecl}(\bot ,\ \texttt{public},\ \mathsf{false},\ \texttt{handle},\ \operatorname{TypePrim}(\texttt{"usize"}),\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{StateMethodDecl}(\bot ,\ \texttt{public},\ \texttt{"write"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [\langle \bot ,\ \texttt{data},\ \operatorname{TypeBytes}(\texttt{@View})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePath}([\texttt{"IoError"}])]),\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{StateMethodDecl}(\bot ,\ \texttt{public},\ \texttt{"flush"},\ \bot ,\ \operatorname{ReceiverShorthand}(\texttt{const}),\ [],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePath}([\texttt{"IoError"}])]),\ \bot ,\ \bot ,\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{TransitionDecl}(\bot ,\ \texttt{public},\ \texttt{"close"},\ [],\ \texttt{@Closed},\ \bot ,\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{FileClosedMembers}\ =\ [] \\[0.16em]
\mathsf{FileStates}\ =\ [ \\[0.16em]
\ \operatorname{StateBlock}(\texttt{@Read},\ \mathsf{FileReadMembers},\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{StateBlock}(\texttt{@Write},\ \mathsf{FileWriteMembers},\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{StateBlock}(\texttt{@Append},\ \mathsf{FileAppendMembers},\ \bot ,\ \bot ), \\[0.16em]
\ \operatorname{StateBlock}(\texttt{@Closed},\ \mathsf{FileClosedMembers},\ \bot ,\ \bot ) \\[0.16em]
] \\[0.16em]
\mathsf{FileDecl}\ =\ \operatorname{ModalDecl}(\bot ,\ \texttt{public},\ \texttt{File},\ \bot ,\ \bot ,\ [],\ \mathsf{FileStates},\ \bot ,\ \bot ,\ \bot )
\end{array}
$$

$$
\begin{array}{l}
\Sigma .\mathsf{Types}[\texttt{"DirIter"}]\ =\ \texttt{modal}\ \mathsf{DirIterDecl} \\[0.16em]
\Sigma .\mathsf{Types}[\texttt{"File"}]\ =\ \texttt{modal}\ \mathsf{FileDecl}
\end{array}
$$

The built-in modal `Async` is defined in Chapter 21. Its declaration, state set, and combinator surface are not duplicated here.

### 13.1.5 Dynamic Semantics

$$
\operatorname{ModalVal}(S,\ v)\ =\ \langle S,\ v\rangle 
$$

$$
\begin{array}{l}
\operatorname{ValueType}(\operatorname{RecordValue}(\operatorname{ModalStateRef}(\mathsf{modal}_{\mathsf{ref}},\ S),\ \mathsf{io}))\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S) \\[0.16em]
\operatorname{ValueType}(\operatorname{ModalVal}(S,\ v_{s}))\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\ \Leftrightarrow \ \operatorname{ValueType}(v_{s})\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)
\end{array}
$$

At runtime, an unreified state value is represented as `RecordValue(ModalStateRef(modal_ref, S), io)`. A widened general modal value is represented as `ModalVal(S, v_s)`. Pattern matching over general modal values is defined in Chapter 17.

### 13.1.6 Lowering

$$
\begin{array}{l}
\operatorname{ModalDiscType}(\mathsf{modal}_{\mathsf{ref}})\ =\ \operatorname{DiscType}(\mid \operatorname{States}(M)\mid \ -\ 1)\ \mathsf{where}\ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M \\[0.16em]
\operatorname{StateSize}(\mathsf{modal}_{\mathsf{ref}},\ S)\ =\ s\ \Leftrightarrow \ \operatorname{RecordLayout}(\operatorname{ModalPayload}(\mathsf{modal}_{\mathsf{ref}},\ S))\ \Downarrow \ \langle s,\ a,\ \_\rangle  \\[0.16em]
\operatorname{StateAlign}(\mathsf{modal}_{\mathsf{ref}},\ S)\ =\ a\ \Leftrightarrow \ \operatorname{RecordLayout}(\operatorname{ModalPayload}(\mathsf{modal}_{\mathsf{ref}},\ S))\ \Downarrow \ \langle s,\ a,\ \_\rangle  \\[0.16em]
\operatorname{SingleFieldPayload}(M,\ S)\ =\ T\ \Leftrightarrow \ \operatorname{Payload}(M,\ S)\ =\ [\langle f,\ T\rangle ] \\[0.16em]
\operatorname{ModalSingleFieldPayload}(\mathsf{modal}_{\mathsf{ref}},\ S)\ =\ T'\ \Leftrightarrow \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ \operatorname{SingleFieldPayload}(M,\ S)\ =\ T\ \land \ \theta \ =\ \operatorname{ModalRefSubst}(\mathsf{modal}_{\mathsf{ref}},\ M)\ \land \ T'\ =\ \operatorname{TypeSubst}(\theta ,\ T) \\[0.16em]
\operatorname{EmptyState}(M,\ S)\ \Leftrightarrow \ \operatorname{Payload}(M,\ S)\ =\ [] \\[0.16em]
\operatorname{PayloadState}(\mathsf{modal}_{\mathsf{ref}})\ =\ S_{p}\ \Leftrightarrow \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ S_{p}\ \in \ \operatorname{States}(M)\ \land \ \operatorname{ModalSingleFieldPayload}(\mathsf{modal}_{\mathsf{ref}},\ S_{p})\ =\ T_{p}\ \land \ \operatorname{NicheCount}(T_{p})\ >\ 0\ \land \ (\forall \ S\ \in \ \operatorname{States}(M).\ S\ \ne \ S_{p}\ \Rightarrow \ \operatorname{EmptyState}(M,\ S))\ \land \ \operatorname{NicheCount}(T_{p})\ \ge \ \mid \operatorname{States}(M)\mid \ -\ 1 \\[0.16em]
\operatorname{NicheApplies}(\mathsf{modal}_{\mathsf{ref}})\ \Leftrightarrow \ \exists \ S_{p}.\ \operatorname{PayloadState}(\mathsf{modal}_{\mathsf{ref}})\ =\ S_{p}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ValueBits}(\operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ S\ \in \ \operatorname{States}(M)\ \land \ v\ =\ \operatorname{RecordValue}(\operatorname{ModalStateRef}(\mathsf{modal}_{\mathsf{ref}},\ S),\ \mathsf{io})\ \land \ \operatorname{ModalPayload}(\mathsf{modal}_{\mathsf{ref}},\ S)\ =\ \mathsf{fields}\ \land \ \operatorname{RecordLayout}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \ \land \ \mathsf{fields}\ =\ [\langle f_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle f_{n},\ T_{n}\rangle ]\ \land \ (\forall \ i.\ \operatorname{FieldValue}(\operatorname{RecordValue}(\operatorname{ModalStateRef}(\mathsf{modal}_{\mathsf{ref}},\ S),\ \mathsf{io}),\ f_{i})\ =\ v_{i})\ \land \ \operatorname{StructBits}([T_{1},\ \ldots ,\ T_{n}],\ [v_{1},\ \ldots ,\ v_{n}],\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{bits} \\[0.16em]
\operatorname{EmptyStates}(M)\ =\ [\ S\ \in \ \operatorname{States}(M)\ \mid \ \operatorname{EmptyState}(M,\ S)\ ] \\[0.16em]
\operatorname{EmptyRecordVal}(v)\ \Leftrightarrow \ \exists \ \mathsf{tr}.\ v\ =\ \operatorname{RecordValue}(\mathsf{tr},\ []) \\[0.16em]
\operatorname{ModalNicheBits}(\mathsf{modal}_{\mathsf{ref}},\ S,\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ \operatorname{NicheApplies}(\mathsf{modal}_{\mathsf{ref}})\ \land \ \operatorname{PayloadState}(\mathsf{modal}_{\mathsf{ref}})\ =\ S_{p}\ \land \ \operatorname{ModalSingleFieldPayload}(\mathsf{modal}_{\mathsf{ref}},\ S_{p})\ =\ T_{p}\ \land \ ((S\ =\ S_{p}\ \land \ \operatorname{ValueBits}(T_{p},\ v)\ =\ \mathsf{bits}\ \land \ \mathsf{bits}\ \notin \ \operatorname{NicheSet}(T_{p}))\ \lor \ (\exists \ i.\ \operatorname{EmptyStates}(M)[i]\ =\ S\ \land \ (v\ =\ ()\ \lor \ \operatorname{EmptyRecordVal}(v))\ \land \ \operatorname{NicheOrder}(T_{p})[i]\ =\ \mathsf{bits})) \\[0.16em]
\operatorname{ModalBits}(\mathsf{modal}_{\mathsf{ref}},\ S,\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ \operatorname{ModalNicheBits}(\mathsf{modal}_{\mathsf{ref}},\ S,\ v)\ =\ \mathsf{bits}\ \lor \ \operatorname{ModalTaggedBits}(\mathsf{modal}_{\mathsf{ref}},\ S,\ v)\ =\ \mathsf{bits} \\[0.16em]
\operatorname{ModalAlign}(\mathsf{modal}_{\mathsf{ref}})\ =\ \operatorname{max}(\operatorname{alignof}(\operatorname{ModalDiscType}(\mathsf{modal}_{\mathsf{ref}})),\ \mathsf{max}\_\{S\ \in \ \operatorname{States}(M)\}(\operatorname{StateAlign}(\mathsf{modal}_{\mathsf{ref}},\ S)))\ \mathsf{where}\ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M \\[0.16em]
\operatorname{ModalSize}(\mathsf{modal}_{\mathsf{ref}})\ =\ \operatorname{AlignUp}(\operatorname{sizeof}(\operatorname{ModalDiscType}(\mathsf{modal}_{\mathsf{ref}}))\ +\ \mathsf{max}\_\{S\ \in \ \operatorname{States}(M)\}(\operatorname{StateSize}(\mathsf{modal}_{\mathsf{ref}},\ S)),\ \operatorname{ModalAlign}(\mathsf{modal}_{\mathsf{ref}}))\ \mathsf{where}\ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M \\[0.16em]
\operatorname{ModalPayloadSize}(\mathsf{modal}_{\mathsf{ref}})\ =\ s\ \Leftrightarrow \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ s\ =\ \mathsf{max}\_\{S\ \in \ \operatorname{States}(M)\}(\operatorname{StateSize}(\mathsf{modal}_{\mathsf{ref}},\ S)) \\[0.16em]
\operatorname{ModalPayloadAlign}(\mathsf{modal}_{\mathsf{ref}})\ =\ a\ \Leftrightarrow \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ a\ =\ \mathsf{max}\_\{S\ \in \ \operatorname{States}(M)\}(\operatorname{StateAlign}(\mathsf{modal}_{\mathsf{ref}},\ S)) \\[0.16em]
\operatorname{StateRecordBits}(\mathsf{modal}_{\mathsf{ref}},\ S,\ v)\ =\ b\ \Leftrightarrow \ \operatorname{ModalPayload}(\mathsf{modal}_{\mathsf{ref}},\ S)\ =\ \mathsf{fields}\ \land \ \operatorname{RecordLayout}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \ \land \ \mathsf{fields}\ =\ [\langle f_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle f_{n},\ T_{n}\rangle ]\ \land \ ((n\ =\ 0\ \land \ (v\ =\ ()\ \lor \ \operatorname{EmptyRecordVal}(v))\ \land \ b\ =\ [])\ \lor \ (n\ >\ 0\ \land \ v\ =\ \operatorname{RecordValue}(\mathsf{tr},\ \mathsf{io})\ \land \ (\forall \ i.\ \operatorname{FieldValue}(\operatorname{RecordValue}(\mathsf{tr},\ \mathsf{io}),\ f_{i})\ =\ v_{i})\ \land \ \operatorname{StructBits}([T_{1},\ \ldots ,\ T_{n}],\ [v_{1},\ \ldots ,\ v_{n}],\ \mathsf{offsets},\ \mathsf{size})\ =\ b)) \\[0.16em]
\operatorname{ModalPayloadBits}(\mathsf{modal}_{\mathsf{ref}},\ S,\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ \operatorname{StateRecordBits}(\mathsf{modal}_{\mathsf{ref}},\ S,\ v)\ =\ b\ \land \ \operatorname{ModalPayloadSize}(\mathsf{modal}_{\mathsf{ref}})\ =\ s\ \land \ \operatorname{PadBytes}(b,\ s)\ =\ \mathsf{bits} \\[0.16em]
\mathsf{ModalLayoutJudg}\ =\ \{\mathsf{ModalLayout}\}
\end{array}
$$

**(Layout-Modal-Niche)**

$$
\begin{array}{l}
\operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \operatorname{NicheApplies}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{PayloadState}(\mathsf{modal}_{\mathsf{ref}})\ =\ S_{p}\quad \operatorname{ModalSingleFieldPayload}(\mathsf{modal}_{\mathsf{ref}},\ S_{p})\ =\ T_{p}\quad \Gamma \ \vdash \ \operatorname{layout}(T_{p})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ModalLayout}(\mathsf{modal}_{\mathsf{ref}})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \bot ,\ \operatorname{layout}(T_{p})\rangle 
\end{array}
$$

**(Layout-Modal-Tagged)**

$$
\begin{array}{l}
\operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \lnot \ \operatorname{NicheApplies}(\mathsf{modal}_{\mathsf{ref}})\quad \mathsf{size}\ =\ \operatorname{ModalSize}(\mathsf{modal}_{\mathsf{ref}})\quad \mathsf{align}\ =\ \operatorname{ModalAlign}(\mathsf{modal}_{\mathsf{ref}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ModalLayout}(\mathsf{modal}_{\mathsf{ref}})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \operatorname{ModalDiscType}(\mathsf{modal}_{\mathsf{ref}}),\ \mathsf{max}\_\{S\ \in \ \operatorname{States}(M)\}(\operatorname{StateSize}(\mathsf{modal}_{\mathsf{ref}},\ S))\rangle 
\end{array}
$$

**(Size-Modal)**

$$
\begin{array}{l}
T\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalLayout}(\mathsf{modal}_{\mathsf{ref}})\ \Downarrow \ \langle \mathsf{size},\ \_,\ \_,\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ \mathsf{size}
\end{array}
$$

**(Align-Modal)**

$$
\begin{array}{l}
T\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalLayout}(\mathsf{modal}_{\mathsf{ref}})\ \Downarrow \ \langle \_,\ \mathsf{align},\ \_,\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{align}
\end{array}
$$

**(Layout-Modal)**

$$
\begin{array}{l}
T\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalLayout}(\mathsf{modal}_{\mathsf{ref}})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_,\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

**(Size-ModalState)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad S\ \in \ \operatorname{States}(M)\quad \operatorname{StateSize}(\mathsf{modal}_{\mathsf{ref}},\ S)\ =\ \mathsf{size} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ \mathsf{size}
\end{array}
$$

**(Align-ModalState)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad S\ \in \ \operatorname{States}(M)\quad \operatorname{StateAlign}(\mathsf{modal}_{\mathsf{ref}},\ S)\ =\ \mathsf{align} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{align}
\end{array}
$$

**(Layout-ModalState)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad S\ \in \ \operatorname{States}(M)\quad \operatorname{StateSize}(\mathsf{modal}_{\mathsf{ref}},\ S)\ =\ \mathsf{size}\quad \operatorname{StateAlign}(\mathsf{modal}_{\mathsf{ref}},\ S)\ =\ \mathsf{align} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{layout}(\operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S))\ =\ \operatorname{layout}(\texttt{record}\ \{\operatorname{ModalPayload}(\mathsf{modal}_{\mathsf{ref}},\ S)\}) \\[0.16em]
\operatorname{ModalPayload}(\mathsf{modal}_{\mathsf{ref}},\ S)\ =\ \emptyset \ \Rightarrow \ \operatorname{sizeof}(\operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S))\ =\ 0 \\[0.16em]
\operatorname{layout}(\operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}}))\ = \\[0.16em]
\ \operatorname{layout}(T_{p})\quad \mathsf{if}\ \operatorname{NicheApplies}(\mathsf{modal}_{\mathsf{ref}})\ \land \ \operatorname{PayloadState}(\mathsf{modal}_{\mathsf{ref}})\ =\ S_{p}\ \land \ \operatorname{ModalSingleFieldPayload}(\mathsf{modal}_{\mathsf{ref}},\ S_{p})\ =\ T_{p} \\[0.16em]
\ \operatorname{layout}(\texttt{enum}\ \{\operatorname{S_1}(\operatorname{ModalPayload}(\mathsf{modal}_{\mathsf{ref}},\ S_{1})),\ \ldots ,\ \operatorname{S_n}(\operatorname{ModalPayload}(\mathsf{modal}_{\mathsf{ref}},\ S_{n}))\})\quad \mathsf{otherwise}
\end{array}
$$

Modal tagged layout is fully defined; all bytes outside the discriminant and payload ranges MUST be zero.

$$
\begin{array}{l}
\operatorname{ModalTaggedBits}(\mathsf{modal}_{\mathsf{ref}},\ S,\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ \lnot \ \operatorname{NicheApplies}(\mathsf{modal}_{\mathsf{ref}})\ \land \ \operatorname{ModalDiscType}(\mathsf{modal}_{\mathsf{ref}})\ =\ D\ \land \ \operatorname{StateIndex}(M,\ S)\ =\ i\ \land \ \operatorname{ValueBits}(D,\ i)\ =\ \mathsf{disc}_{\mathsf{bits}}\ \land \ \operatorname{ModalPayloadBits}(\mathsf{modal}_{\mathsf{ref}},\ S,\ v)\ =\ \mathsf{payload}_{\mathsf{bits}}\ \land \ \operatorname{ModalPayloadSize}(\mathsf{modal}_{\mathsf{ref}})\ =\ \mathsf{psize}\ \land \ \operatorname{ModalPayloadAlign}(\mathsf{modal}_{\mathsf{ref}})\ =\ \mathsf{palign}\ \land \ \operatorname{TaggedBits}(\mathsf{disc}_{\mathsf{bits}},\ \mathsf{payload}_{\mathsf{bits}},\ \operatorname{sizeof}(D),\ \mathsf{psize},\ \mathsf{palign},\ \operatorname{ModalSize}(\mathsf{modal}_{\mathsf{ref}}))\ =\ \mathsf{bits}\ \land \ \mathsf{payload}_{\mathsf{off}}\ =\ \operatorname{AlignUp}(\operatorname{sizeof}(D),\ \mathsf{palign})\ \land \ \forall \ j.\ 0\ \le \ j\ <\ \mid \mathsf{bits}\mid \ \land \ j\ \notin \ [0,\ \operatorname{sizeof}(D))\ \land \ j\ \notin \ [\mathsf{payload}_{\mathsf{off}},\ \mathsf{payload}_{\mathsf{off}}\ +\ \mathsf{psize})\ \Rightarrow \ \mathsf{bits}[j]\ =\ 0\mathsf{x00} \\[0.16em]
\operatorname{ValueBits}(\operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}}),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ v\ =\ \langle S,\ v_{s}\rangle \ \land \ \operatorname{ModalBits}(\mathsf{modal}_{\mathsf{ref}},\ S,\ v_{s})\ =\ \mathsf{bits}
\end{array}
$$

### 13.1.7 Diagnostics

Diagnostics are defined for modal declarations with zero states, duplicate state names, state names equal to the modal name, duplicate payload field names, state-member visibility that exceeds modal visibility, bad generic-argument count on modal-state references, and direct record construction of runtime-backed built-in modal states. Match exhaustiveness for general modal values is defined in Chapter 17.
