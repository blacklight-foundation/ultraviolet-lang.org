---
title: "Modal and Special Types"
description: "13. Modal and Special Types of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
generatedAt: "2026-05-14T00:55:03.609Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
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
\operatorname{RegionProcSig}(\texttt{Region::reset\_unchecked})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}([\texttt{"Region"}],\ \texttt{@Active}))\rangle ],\ \operatorname{TypeModalState}([\texttt{"Region"}],\ \texttt{@Active})\rangle  \\[0.16em]
\operatorname{RegionProcSig}(\texttt{Region::freeze})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}([\texttt{"Region"}],\ \texttt{@Active}))\rangle ],\ \operatorname{TypeModalState}([\texttt{"Region"}],\ \texttt{@Frozen})\rangle  \\[0.16em]
\operatorname{RegionProcSig}(\texttt{Region::thaw})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}([\texttt{"Region"}],\ \texttt{@Frozen}))\rangle ],\ \operatorname{TypeModalState}([\texttt{"Region"}],\ \texttt{@Active})\rangle  \\[0.16em]
\operatorname{RegionProcSig}(\texttt{Region::free\_unchecked})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeUnion}([\operatorname{TypeModalState}([\texttt{"Region"}],\ \texttt{@Active}),\ \operatorname{TypeModalState}([\texttt{"Region"}],\ \texttt{@Frozen})]))\rangle ],\ \operatorname{TypeModalState}([\texttt{"Region"}],\ \texttt{@Freed})\rangle 
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
\operatorname{ValueType}(\operatorname{RecordValue}(\operatorname{ModalStateRef}(\mathsf{modal}_{\mathsf{ref}},\ S),\ \mathsf{fs}))\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S) \\[0.16em]
\operatorname{ValueType}(\operatorname{ModalVal}(S,\ v_{s}))\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\ \Leftrightarrow \ \operatorname{ValueType}(v_{s})\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)
\end{array}
$$

At runtime, an unreified state value is represented as `RecordValue(ModalStateRef(modal_ref, S), fs)`. A widened general modal value is represented as `ModalVal(S, v_s)`. Pattern matching over general modal values is defined in Chapter 17.

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
\operatorname{ValueBits}(\operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ S\ \in \ \operatorname{States}(M)\ \land \ v\ =\ \operatorname{RecordValue}(\operatorname{ModalStateRef}(\mathsf{modal}_{\mathsf{ref}},\ S),\ \mathsf{fs})\ \land \ \operatorname{ModalPayload}(\mathsf{modal}_{\mathsf{ref}},\ S)\ =\ \mathsf{fields}\ \land \ \operatorname{RecordLayout}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \ \land \ \mathsf{fields}\ =\ [\langle f_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle f_{n},\ T_{n}\rangle ]\ \land \ (\forall \ i.\ \operatorname{FieldValue}(\operatorname{RecordValue}(\operatorname{ModalStateRef}(\mathsf{modal}_{\mathsf{ref}},\ S),\ \mathsf{fs}),\ f_{i})\ =\ v_{i})\ \land \ \operatorname{StructBits}([T_{1},\ \ldots ,\ T_{n}],\ [v_{1},\ \ldots ,\ v_{n}],\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{bits} \\[0.16em]
\operatorname{EmptyStates}(M)\ =\ [\ S\ \in \ \operatorname{States}(M)\ \mid \ \operatorname{EmptyState}(M,\ S)\ ] \\[0.16em]
\operatorname{EmptyRecordVal}(v)\ \Leftrightarrow \ \exists \ \mathsf{tr}.\ v\ =\ \operatorname{RecordValue}(\mathsf{tr},\ []) \\[0.16em]
\operatorname{ModalNicheBits}(\mathsf{modal}_{\mathsf{ref}},\ S,\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ \operatorname{NicheApplies}(\mathsf{modal}_{\mathsf{ref}})\ \land \ \operatorname{PayloadState}(\mathsf{modal}_{\mathsf{ref}})\ =\ S_{p}\ \land \ \operatorname{ModalSingleFieldPayload}(\mathsf{modal}_{\mathsf{ref}},\ S_{p})\ =\ T_{p}\ \land \ ((S\ =\ S_{p}\ \land \ \operatorname{ValueBits}(T_{p},\ v)\ =\ \mathsf{bits}\ \land \ \mathsf{bits}\ \notin \ \operatorname{NicheSet}(T_{p}))\ \lor \ (\exists \ i.\ \operatorname{EmptyStates}(M)[i]\ =\ S\ \land \ (v\ =\ ()\ \lor \ \operatorname{EmptyRecordVal}(v))\ \land \ \operatorname{NicheOrder}(T_{p})[i]\ =\ \mathsf{bits})) \\[0.16em]
\operatorname{ModalBits}(\mathsf{modal}_{\mathsf{ref}},\ S,\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ \operatorname{ModalNicheBits}(\mathsf{modal}_{\mathsf{ref}},\ S,\ v)\ =\ \mathsf{bits}\ \lor \ \operatorname{ModalTaggedBits}(\mathsf{modal}_{\mathsf{ref}},\ S,\ v)\ =\ \mathsf{bits} \\[0.16em]
\operatorname{ModalAlign}(\mathsf{modal}_{\mathsf{ref}})\ =\ \operatorname{max}(\operatorname{alignof}(\operatorname{ModalDiscType}(\mathsf{modal}_{\mathsf{ref}})),\ \mathsf{max}\_\{S\ \in \ \operatorname{States}(M)\}(\operatorname{StateAlign}(\mathsf{modal}_{\mathsf{ref}},\ S)))\ \mathsf{where}\ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M \\[0.16em]
\operatorname{ModalSize}(\mathsf{modal}_{\mathsf{ref}})\ =\ \operatorname{AlignUp}(\operatorname{sizeof}(\operatorname{ModalDiscType}(\mathsf{modal}_{\mathsf{ref}}))\ +\ \mathsf{max}\_\{S\ \in \ \operatorname{States}(M)\}(\operatorname{StateSize}(\mathsf{modal}_{\mathsf{ref}},\ S)),\ \operatorname{ModalAlign}(\mathsf{modal}_{\mathsf{ref}}))\ \mathsf{where}\ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M \\[0.16em]
\operatorname{ModalPayloadSize}(\mathsf{modal}_{\mathsf{ref}})\ =\ s\ \Leftrightarrow \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ s\ =\ \mathsf{max}\_\{S\ \in \ \operatorname{States}(M)\}(\operatorname{StateSize}(\mathsf{modal}_{\mathsf{ref}},\ S)) \\[0.16em]
\operatorname{ModalPayloadAlign}(\mathsf{modal}_{\mathsf{ref}})\ =\ a\ \Leftrightarrow \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ a\ =\ \mathsf{max}\_\{S\ \in \ \operatorname{States}(M)\}(\operatorname{StateAlign}(\mathsf{modal}_{\mathsf{ref}},\ S)) \\[0.16em]
\operatorname{StateRecordBits}(\mathsf{modal}_{\mathsf{ref}},\ S,\ v)\ =\ b\ \Leftrightarrow \ \operatorname{ModalPayload}(\mathsf{modal}_{\mathsf{ref}},\ S)\ =\ \mathsf{fields}\ \land \ \operatorname{RecordLayout}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \ \land \ \mathsf{fields}\ =\ [\langle f_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle f_{n},\ T_{n}\rangle ]\ \land \ ((n\ =\ 0\ \land \ (v\ =\ ()\ \lor \ \operatorname{EmptyRecordVal}(v))\ \land \ b\ =\ [])\ \lor \ (n\ >\ 0\ \land \ v\ =\ \operatorname{RecordValue}(\mathsf{tr},\ \mathsf{fs})\ \land \ (\forall \ i.\ \operatorname{FieldValue}(\operatorname{RecordValue}(\mathsf{tr},\ \mathsf{fs}),\ f_{i})\ =\ v_{i})\ \land \ \operatorname{StructBits}([T_{1},\ \ldots ,\ T_{n}],\ [v_{1},\ \ldots ,\ v_{n}],\ \mathsf{offsets},\ \mathsf{size})\ =\ b)) \\[0.16em]
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

## 13.2 State Fields

### 13.2.1 Syntax

```text
state_field_decl ::= attribute_list? visibility? key_boundary? identifier ":" type
```

### 13.2.2 Parsing

**(Parse-StateMember-Field)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \Gamma \ \vdash \ \operatorname{ParseKeyBoundaryOpt}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{boundary})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{name})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{3}),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P_{3}))\ \Downarrow \ (P_{4},\ \mathsf{ty}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStateMember}(P)\ \Downarrow \ (P_{4},\ \langle \mathsf{StateFieldDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{name},\ \mathsf{ty},\ \operatorname{SpanBetween}(P,\ P_{4}),\ []\rangle )
\end{array}
$$

### 13.2.3 AST Representation / Form

$$
\mathsf{StateFieldDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{name},\ \mathsf{type},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}\rangle 
$$

$$
\begin{array}{l}
\operatorname{PayloadNames}(M,\ S)\ =\ [\ f\ \mid \ \langle f,\ \_\rangle \ \in \ \operatorname{Payload}(M,\ S)\ ] \\[0.16em]
\operatorname{PayloadNameSet}(M,\ S)\ =\ \operatorname{Set}(\operatorname{PayloadNames}(M,\ S))
\end{array}
$$

### 13.2.4 Static Semantics

$$
\operatorname{ModalFieldVisible}(m,\ \mathsf{modal}_{\mathsf{ref}})\ \Leftrightarrow \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ \operatorname{ModuleOfPath}(\operatorname{ModalPath}(M))\ =\ m
$$

**(T-Modal-Field)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \operatorname{ModalPayloadMap}(\mathsf{modal}_{\mathsf{ref}},\ S)(f)\ =\ T\quad \operatorname{ModalFieldVisible}(m,\ \mathsf{modal}_{\mathsf{ref}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ e.f\ :\ T
\end{array}
$$

**(T-Modal-Field-Perm)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypePerm}(p',\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S))\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \operatorname{ModalPayloadMap}(\mathsf{modal}_{\mathsf{ref}},\ S)(f)\ =\ T\quad \operatorname{ModalFieldVisible}(m,\ \mathsf{modal}_{\mathsf{ref}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ e.f\ :\ \operatorname{TypePerm}(p',\ T)
\end{array}
$$

**(Modal-Field-Missing)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \operatorname{ModalPayloadMap}(\mathsf{modal}_{\mathsf{ref}},\ S)(f)\ \mathsf{undefined}\quad c\ =\ \operatorname{Code}(\mathsf{Modal}-\mathsf{Field}-\mathsf{Missing}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ e.f\ \Uparrow \ c
\end{array}
$$

**(Modal-Field-General-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T\quad \operatorname{StripPerm}(T)\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad c\ =\ \operatorname{Code}(\mathsf{Modal}-\mathsf{Field}-\mathsf{General}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ e.f\ \Uparrow \ c
\end{array}
$$

**(Modal-Field-NotVisible)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \operatorname{ModalPayloadMap}(\mathsf{modal}_{\mathsf{ref}},\ S)(f)\ =\ T\quad \lnot \ \operatorname{ModalFieldVisible}(m,\ \mathsf{modal}_{\mathsf{ref}})\quad c\ =\ \operatorname{Code}(\mathsf{Modal}-\mathsf{Field}-\mathsf{NotVisible}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ e.f\ \Uparrow \ c
\end{array}
$$

### 13.2.5 Dynamic Semantics

State-field access on `TypeModalState(modal_ref, S)` reuses ordinary record-field evaluation over the concrete runtime value `RecordValue(ModalStateRef(modal_ref, S), fs)`. No additional abstract-machine rule is introduced for successful access beyond the shared `FieldAccess` rules.

### 13.2.6 Lowering

State-field reads and writes lower exactly as record-payload field accesses over the current state's payload layout. No modal-specific field-access lowering is introduced beyond the general place and field lowering rules.

### 13.2.7 Diagnostics

Diagnostics are defined for missing state fields, field access on a general modal value without first refining to a state, and access to a state field outside the declaring modal's module. Duplicate field names within a single state payload are defined by §13.1.4.

## 13.3 State-Specific Methods

### 13.3.1 Syntax

```text
state_method_def       ::= attribute_list? visibility? "procedure" identifier generic_params? state_method_signature contract_clause? block_expr
state_method_signature ::= "(" receiver method_param_list? ")" return_opt
```

### 13.3.2 Parsing

**(Parse-StateMember-Method)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{procedure})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseGenericParamsOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseStateMethodSignature}(P_{3})\ \Downarrow \ (P_{4},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseContractClauseOpt}(P_{4})\ \Downarrow \ (P_{5},\ \mathsf{contract}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(P_{5})\ \Downarrow \ (P_{6},\ \mathsf{body}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStateMember}(P)\ \Downarrow \ (P_{6},\ \langle \mathsf{StateMethodDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \operatorname{SpanBetween}(P,\ P_{6}),\ []\rangle )
\end{array}
$$

`ParseStateMethodSignature` is defined canonically by the shared method parser in §15.2.2. This section consumes that parser but does not redefine it.

### 13.3.3 AST Representation / Form

$$
\mathsf{StateMethodDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{receiver},\ \mathsf{params},\ \mathsf{return}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}\rangle 
$$

$$
\begin{array}{l}
\operatorname{Methods}(M,\ S)\ =\ [\ m\ \mid \ m\ \in \ \operatorname{StateMembers}(M,\ S)\ \land \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}.\ m\ =\ \operatorname{StateMethodDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\ ] \\[0.16em]
\operatorname{StateMethodNames}(M,\ S)\ =\ [\ m.\mathsf{name}\ \mid \ m\ \in \ \operatorname{Methods}(M,\ S)\ ]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{MethodSig}(M,\ S,\ m).\mathsf{recv}\ =\ \operatorname{RecvType}(\operatorname{ModalSelfType}(M,\ S),\ m.\mathsf{receiver}) \\[0.16em]
\operatorname{MethodSig}(M,\ S,\ m).\mathsf{params}\ =\ m.\mathsf{params} \\[0.16em]
\operatorname{MethodSig}(M,\ S,\ m).\mathsf{ret}\ =\ \operatorname{ReturnType}(m)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LookupStateMethod}(M,\ S,\ \mathsf{name})\ =\ m\ \Leftrightarrow \ m\ \in \ \operatorname{Methods}(M,\ S)\ \land \ m.\mathsf{name}\ =\ \mathsf{name} \\[0.16em]
\operatorname{LookupStateMethod}(M,\ S,\ \mathsf{name})\ =\ \bot \ \Leftrightarrow \ \lnot \ \exists \ m\ \in \ \operatorname{Methods}(M,\ S).\ m.\mathsf{name}\ =\ \mathsf{name}
\end{array}
$$

### 13.3.4 Static Semantics

$$
\operatorname{StateMemberVisible}(\mathsf{mod},\ M,\ \mathsf{vis})\ \Leftrightarrow \ \mathsf{vis}\ \in \ \{\texttt{public},\ \texttt{internal}\}\ \lor \ (\mathsf{vis}\ =\ \texttt{private}\ \land \ \operatorname{ModuleOfPath}(\operatorname{ModalPath}(M))\ =\ \mathsf{mod})
$$

**(StateMethod-Dup)**

$$
\begin{array}{l}
\lnot \ \operatorname{Distinct}(\operatorname{StateMethodNames}(M,\ S))\quad c\ =\ \operatorname{Code}(\mathsf{StateMethod}-\mathsf{Dup}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ S\ \Uparrow \ c
\end{array}
$$

**(WF-State-Method)**

$$
\begin{array}{l}
\mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(\mathsf{md}.\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \mathsf{params}_{\mathsf{gen}}\ =\ [P_{1},\ \ldots ,\ P_{n}]\quad \Gamma \ \vdash \ \langle P_{1};\ \ldots ;\ P_{n}\rangle \ \mathsf{wf}\quad \Gamma_{m} \ =\ \operatorname{BindTypeParams}(\Gamma ,\ \mathsf{params}_{\mathsf{gen}})\quad \Gamma_{m} \ \vdash \ \mathsf{md}.\mathsf{receiver}\ :\ \operatorname{Recv}(\operatorname{ModalSelfType}(M,\ S),\ P,\ \mathsf{mode})\quad \mathsf{self}\ \notin \ \operatorname{ParamNames}(\mathsf{md}.\mathsf{params})\quad \operatorname{Distinct}(\operatorname{ParamNames}(\mathsf{md}.\mathsf{params}))\quad \forall \ \langle \_,\ \_,\ T_{i}\rangle \ \in \ \mathsf{md}.\mathsf{params},\ \Gamma_{m} \ \vdash \ T_{i}\ \mathsf{wf}\quad (\mathsf{md}.\mathsf{return}_{\mathsf{type}\_\mathsf{opt}}\ =\ \bot \ \lor \ \Gamma_{m} \ \vdash \ \mathsf{md}.\mathsf{return}_{\mathsf{type}\_\mathsf{opt}}\ \mathsf{wf}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{md}\ :\ \operatorname{StateMethodOK}(M,\ S)
\end{array}
$$

**(T-Modal-Method)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ P_{\mathsf{caller}}\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \operatorname{LookupStateMethod}(M,\ S,\ m)\ =\ \mathsf{md}\quad P_{\mathsf{method}}\ =\ \operatorname{RecvPerm}(\operatorname{ModalSelfType}(M,\ S),\ \mathsf{md}.\mathsf{receiver})\quad \operatorname{PermAdmits}(P_{\mathsf{caller}},\ P_{\mathsf{method}})\quad \operatorname{StateMemberVisible}(\mathsf{mod},\ M,\ \mathsf{md}.\mathsf{vis})\quad \operatorname{MethodSig}(M,\ S,\ \mathsf{md}).\mathsf{params}\ =\ \mathsf{ps}\quad \Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk}(\mathsf{ps},\ \mathsf{args}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ e\ \sim{}>\ \operatorname{m}(\mathsf{args})\ :\ \operatorname{ReturnType}(\mathsf{md})
\end{array}
$$

**(Modal-Method-RecvPerm-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ P_{\mathsf{caller}}\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \operatorname{LookupStateMethod}(M,\ S,\ m)\ =\ \mathsf{md}\quad P_{\mathsf{method}}\ =\ \operatorname{RecvPerm}(\operatorname{ModalSelfType}(M,\ S),\ \mathsf{md}.\mathsf{receiver})\quad \lnot \ \operatorname{PermAdmits}(P_{\mathsf{caller}},\ P_{\mathsf{method}})\quad c\ =\ \operatorname{Code}(\mathsf{MethodCall}-\mathsf{RecvPerm}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ e\ \sim{}>\ \operatorname{m}(\mathsf{args})\ \Uparrow \ c
\end{array}
$$

**(Modal-Method-NotFound)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ P_{\mathsf{caller}}\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \operatorname{LookupStateMethod}(M,\ S,\ m)\ \mathsf{undefined}\quad c\ =\ \operatorname{Code}(\mathsf{Modal}-\mathsf{Method}-\mathsf{NotFound}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ e\ \sim{}>\ \operatorname{m}(\mathsf{args})\ \Uparrow \ c
\end{array}
$$

**(Modal-Method-NotVisible)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ P_{\mathsf{caller}}\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \operatorname{LookupStateMethod}(M,\ S,\ m)\ =\ \mathsf{md}\quad \lnot \ \operatorname{StateMemberVisible}(\mathsf{mod},\ M,\ \mathsf{md}.\mathsf{vis})\quad c\ =\ \operatorname{Code}(\mathsf{Modal}-\mathsf{Method}-\mathsf{NotVisible}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ e\ \sim{}>\ \operatorname{m}(\mathsf{args})\ \Uparrow \ c
\end{array}
$$

**(T-Modal-Method-Body)**

$$
\begin{array}{l}
\Sigma .\mathsf{Types}[p]\ =\ \texttt{modal}\ M\quad S\ \in \ \operatorname{States}(M)\quad \mathsf{md}\ \in \ \operatorname{Methods}(M,\ S)\quad \mathsf{md}.\mathsf{body}\ =\ \mathsf{body}\quad T_{\mathsf{self}}\ =\ \operatorname{RecvType}(\operatorname{ModalSelfType}(M,\ S),\ \mathsf{md}.\mathsf{receiver})\quad \Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \operatorname{IntroAll}(\Gamma_{0} ,\ [\langle \texttt{self},\ T_{\mathsf{self}}\rangle ]\ \mathbin{++} \ \operatorname{ParamBinds}(\mathsf{md}.\mathsf{params}))\ \Downarrow \ \Gamma_{1} \quad R_{m}\ =\ \operatorname{ReturnType}(\mathsf{md})\quad R_{b}\ =\ \operatorname{BodyReturnType}(R_{m})\quad \Gamma_{1} ;\ R_{m};\ \bot \ \vdash \ \mathsf{body}\ :\ T_{b}\quad \Gamma \ \vdash \ T_{b}\ \mathrel{<:} \ R_{b}\quad (R_{b}\ \ne \ \operatorname{TypePrim}(\texttt{"()"})\ \Rightarrow \ \operatorname{ExplicitReturn}(\mathsf{body})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{md}\ :\ \operatorname{StateMethodBodyOK}(p,\ S)
\end{array}
$$

### 13.3.5 Dynamic Semantics

$$
\operatorname{MethodTarget}(\operatorname{RecordValue}(\operatorname{ModalStateRef}(\mathsf{modal}_{\mathsf{ref}},\ S),\ \mathsf{fs}),\ \mathsf{name})\ =\ \mathsf{md}\ \Leftrightarrow \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ \operatorname{LookupStateMethod}(M,\ S,\ \mathsf{name})\ =\ \mathsf{md}
$$

**(ApplyMethodSigma)**

$$
\begin{array}{l}
m\ =\ \operatorname{MethodTarget}(v_{\mathsf{self}},\ \mathsf{name})\quad \lnot \ \operatorname{IsTransition}(m)\quad \operatorname{BindParams}(\operatorname{RecvParams}(\mathsf{base},\ \mathsf{name}),\ [v_{\mathsf{arg}}]\ \mathbin{++} \ \mathsf{vec}_{v})\ =\ \mathsf{binds}\quad \operatorname{BlockEnter}(\sigma ,\ \mathsf{binds})\ \Downarrow \ (\sigma_{1} ,\ \mathsf{scope})\quad \Gamma \ \vdash \ \operatorname{EvalBlockBodySigma}(m.\mathsf{body},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )\quad \operatorname{BlockExit}(\sigma_{2} ,\ \mathsf{scope},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ApplyMethodSigma}(\mathsf{base},\ \mathsf{name},\ v_{\mathsf{self}},\ v_{\mathsf{arg}},\ \mathsf{vec}_{v},\ \sigma )\ \Downarrow \ (\operatorname{ReturnOut}(\mathsf{out}'),\ \sigma_{3} )
\end{array}
$$

Built-in state methods on `CancelToken`, `File`, `DirIter`, `string`, and `bytes` are defined by their respective primitive relations in this chapter and later capability chapters; they do not introduce a distinct calling convention.

### 13.3.6 Lowering

State-specific method calls lower as ordinary direct method calls specialized to the receiver type `ModalSelfType(M, S)`. No modal tag dispatch is inserted when the receiver type is already a concrete state type.

### 13.3.7 Diagnostics

Diagnostics are defined for duplicate state-method names within a state block, receiver-permission mismatch at method call sites, missing state methods, and state-method visibility failures. Name conflicts with transitions are defined in §13.4.4.

## 13.4 Transitions

### 13.4.1 Syntax

```text
transition_def ::= attribute_list? visibility? "transition" identifier "(" param_list ")" "->" "@" identifier block_expr
```

### 13.4.2 Parsing

**(Parse-StateMember-Transition)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{transition})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{name})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseParamList}(\operatorname{Advance}(P_{2}))\ \Downarrow \ (P_{3},\ \mathsf{params})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{3}),\ \texttt{")"})\quad P_{3}'\ =\ \operatorname{Advance}(P_{3})\quad \operatorname{IsOp}(\operatorname{Tok}(P_{3}'),\ \texttt{"->"})\quad \operatorname{IsOp}(\operatorname{Tok}(\operatorname{Advance}(P_{3}')),\ \texttt{"@"})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(\operatorname{Advance}(P_{3}')))\ \Downarrow \ (P_{4},\ \mathsf{target})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(P_{4})\ \Downarrow \ (P_{5},\ \mathsf{body}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStateMember}(P)\ \Downarrow \ (P_{5},\ \langle \mathsf{TransitionDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{params},\ \mathsf{target},\ \mathsf{body},\ \operatorname{SpanBetween}(P,\ P_{5}),\ []\rangle )
\end{array}
$$

### 13.4.3 AST Representation / Form

$$
\mathsf{TransitionDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{params},\ \mathsf{target}_{\mathsf{state}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}\rangle 
$$

$$
\begin{array}{l}
\operatorname{Transitions}(M,\ S)\ =\ [\ t\ \mid \ t\ \in \ \operatorname{StateMembers}(M,\ S)\ \land \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{params},\ \mathsf{target},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}.\ t\ =\ \operatorname{TransitionDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{params},\ \mathsf{target},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\ ] \\[0.16em]
\operatorname{TransitionNames}(M,\ S)\ =\ [\ t.\mathsf{name}\ \mid \ t\ \in \ \operatorname{Transitions}(M,\ S)\ ] \\[0.16em]
\operatorname{StateMemberNames}(M,\ S)\ =\ \operatorname{StateMethodNames}(M,\ S)\ \mathbin{++} \ \operatorname{TransitionNames}(M,\ S)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LookupTransition}(M,\ S,\ \mathsf{name})\ =\ t\ \Leftrightarrow \ t\ \in \ \operatorname{Transitions}(M,\ S)\ \land \ t.\mathsf{name}\ =\ \mathsf{name} \\[0.16em]
\operatorname{LookupTransition}(M,\ S,\ \mathsf{name})\ =\ \bot \ \Leftrightarrow \ \lnot \ \exists \ t\ \in \ \operatorname{Transitions}(M,\ S).\ t.\mathsf{name}\ =\ \mathsf{name}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{TransitionSig}(M,\ S_{\mathsf{src}},\ t).\mathsf{recv}\ =\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{ModalSelfType}(M,\ S_{\mathsf{src}})) \\[0.16em]
\operatorname{TransitionSig}(M,\ S_{\mathsf{src}},\ t).\mathsf{params}\ =\ t.\mathsf{params} \\[0.16em]
S_{\mathsf{tgt}}\ =\ t.\mathsf{target} \\[0.16em]
\operatorname{TransitionSig}(M,\ S_{\mathsf{src}},\ t).\mathsf{ret}\ =\ \operatorname{ModalSelfType}(M,\ S_{\mathsf{tgt}}) \\[0.16em]
\operatorname{TransitionSig}(M,\ S_{\mathsf{src}},\ t).\mathsf{target}\ =\ S_{\mathsf{tgt}} \\[0.16em]
\operatorname{TransitionSig}(M,\ S_{\mathsf{src}},\ t).\mathsf{mode}\ =\ \texttt{move}
\end{array}
$$

### 13.4.4 Static Semantics

**(Transition-Dup)**

$$
\begin{array}{l}
\lnot \ \operatorname{Distinct}(\operatorname{TransitionNames}(M,\ S))\quad c\ =\ \operatorname{Code}(\mathsf{Transition}-\mathsf{Dup}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ S\ \Uparrow \ c
\end{array}
$$

**(StateMember-Name-Conflict)**

$$
\begin{array}{l}
\lnot \ \operatorname{Disjoint}(\operatorname{StateMethodNames}(M,\ S),\ \operatorname{TransitionNames}(M,\ S))\quad c\ =\ \operatorname{Code}(\mathsf{StateMember}-\mathsf{Name}-\mathsf{Conflict}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ S\ \Uparrow \ c
\end{array}
$$

**(WF-Transition)**

$$
\begin{array}{l}
\mathsf{self}\ \notin \ \operatorname{ParamNames}(\mathsf{tr}.\mathsf{params})\quad \operatorname{Distinct}(\operatorname{ParamNames}(\mathsf{tr}.\mathsf{params}))\quad \forall \ \langle \_,\ \_,\ T_{i}\rangle \ \in \ \mathsf{tr}.\mathsf{params},\ \Gamma \ \vdash \ T_{i}\ \mathsf{wf}\quad \mathsf{tr}.\mathsf{target}\ \in \ \operatorname{States}(M) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{tr}\ :\ \operatorname{TransitionOK}(M,\ S_{\mathsf{src}})
\end{array}
$$

**(Transition-Target-Err)**

$$
\begin{array}{l}
\mathsf{tr}.\mathsf{target}\ \notin \ \operatorname{States}(M)\quad c\ =\ \operatorname{Code}(\mathsf{Transition}-\mathsf{Target}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{tr}\ \Uparrow \ c
\end{array}
$$

**(T-Modal-Transition)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e_{\mathsf{self}}\ :\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S_{\mathsf{src}}))\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \operatorname{LookupTransition}(M,\ S_{\mathsf{src}},\ t)\ =\ \mathsf{tr}\quad \operatorname{StateMemberVisible}(\mathsf{mod},\ M,\ \mathsf{tr}.\mathsf{vis})\quad \operatorname{TransitionSig}(M,\ S_{\mathsf{src}},\ \mathsf{tr}).\mathsf{params}\ =\ \mathsf{ps}\quad \operatorname{TransitionSig}(M,\ S_{\mathsf{src}},\ \mathsf{tr}).\mathsf{target}\ =\ S_{\mathsf{tgt}}\quad \Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk}(\mathsf{ps},\ \mathsf{args})\quad \operatorname{RecvArgOk}(e_{\mathsf{self}},\ \texttt{move}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ e_{\mathsf{self}}\ \sim{}>\ \operatorname{t}(\mathsf{args})\ :\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S_{\mathsf{tgt}})
\end{array}
$$

**(Transition-Source-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e_{\mathsf{self}}\ :\ T\quad (\operatorname{PermOf}(T)\ \ne \ \texttt{unique}\ \lor \ \operatorname{StripPerm}(T)\ \ne \ \operatorname{TypeModalState}(\_,\ \_))\quad c\ =\ \operatorname{Code}(\mathsf{Transition}-\mathsf{Source}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ e_{\mathsf{self}}\ \sim{}>\ \operatorname{t}(\mathsf{args})\ \Uparrow \ c
\end{array}
$$

**(Transition-NotVisible)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e_{\mathsf{self}}\ :\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S_{\mathsf{src}}))\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \operatorname{LookupTransition}(M,\ S_{\mathsf{src}},\ t)\ =\ \mathsf{tr}\quad \lnot \ \operatorname{StateMemberVisible}(\mathsf{mod},\ M,\ \mathsf{tr}.\mathsf{vis})\quad c\ =\ \operatorname{Code}(\mathsf{Transition}-\mathsf{NotVisible}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ e_{\mathsf{self}}\ \sim{}>\ \operatorname{t}(\mathsf{args})\ \Uparrow \ c
\end{array}
$$

**(T-Modal-Transition-Body)**

$$
\begin{array}{l}
\Sigma .\mathsf{Types}[p]\ =\ \texttt{modal}\ M\quad S_{\mathsf{src}}\ \in \ \operatorname{States}(M)\quad \mathsf{tr}\ \in \ \operatorname{Transitions}(M,\ S_{\mathsf{src}})\quad \mathsf{tr}.\mathsf{body}\ =\ \mathsf{body}\quad \mathsf{tr}.\mathsf{target}\ =\ S_{\mathsf{tgt}}\quad S_{\mathsf{tgt}}\ \in \ \operatorname{States}(M)\quad \Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \operatorname{IntroAll}(\Gamma_{0} ,\ [\langle \texttt{self},\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{ModalSelfType}(M,\ S_{\mathsf{src}}))\rangle ]\ \mathbin{++} \ \operatorname{ParamBinds}(\mathsf{tr}.\mathsf{params}))\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} ;\ \operatorname{ModalSelfType}(M,\ S_{\mathsf{tgt}});\ \bot \ \vdash \ \mathsf{body}\ :\ T_{b}\quad \Gamma \ \vdash \ T_{b}\ \mathrel{<:} \ \operatorname{ModalSelfType}(M,\ S_{\mathsf{tgt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{tr}\ :\ \operatorname{TransitionBodyOK}(p,\ S_{\mathsf{src}})
\end{array}
$$

**(Transition-Body-Err)**

$$
\begin{array}{l}
\Sigma .\mathsf{Types}[p]\ =\ \texttt{modal}\ M\quad S_{\mathsf{src}}\ \in \ \operatorname{States}(M)\quad \mathsf{tr}\ \in \ \operatorname{Transitions}(M,\ S_{\mathsf{src}})\quad \mathsf{tr}.\mathsf{body}\ =\ \mathsf{body}\quad \mathsf{tr}.\mathsf{target}\ =\ S_{\mathsf{tgt}}\quad S_{\mathsf{tgt}}\ \in \ \operatorname{States}(M)\quad \Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \operatorname{IntroAll}(\Gamma_{0} ,\ [\langle \texttt{self},\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{ModalSelfType}(M,\ S_{\mathsf{src}}))\rangle ]\ \mathbin{++} \ \operatorname{ParamBinds}(\mathsf{tr}.\mathsf{params}))\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} ;\ \operatorname{ModalSelfType}(M,\ S_{\mathsf{tgt}});\ \bot \ \vdash \ \mathsf{body}\ :\ T_{b}\quad \lnot (\Gamma \ \vdash \ T_{b}\ \mathrel{<:} \ \operatorname{ModalSelfType}(M,\ S_{\mathsf{tgt}}))\quad c\ =\ \operatorname{Code}(\mathsf{Transition}-\mathsf{Body}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{tr}\ \Uparrow \ c
\end{array}
$$

### 13.4.5 Dynamic Semantics

$$
\operatorname{MethodTarget}(\operatorname{RecordValue}(\operatorname{ModalStateRef}(\mathsf{modal}_{\mathsf{ref}},\ S),\ \mathsf{fs}),\ \mathsf{name})\ =\ \mathsf{tr}\ \Leftrightarrow \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ \operatorname{LookupTransition}(M,\ S,\ \mathsf{name})\ =\ \mathsf{tr}
$$

**(ApplyTransitionSigma)**

Modal state transitions consume the source state value and produce a target state value. The transition is identified when `IsTransition(m)` holds.

$$
\begin{array}{l}
\operatorname{IsTransition}(m)\ \Leftrightarrow \ \exists \ M,\ S.\ m\ \in \ \operatorname{Transitions}(M,\ S) \\[0.16em]
\operatorname{TransitionTarget}(m)\ =\ S_{\mathsf{tgt}}\ \Leftrightarrow \ m.\mathsf{target}\ =\ S_{\mathsf{tgt}}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{tr}\ =\ \operatorname{MethodTarget}(v_{\mathsf{self}},\ \mathsf{name})\quad \operatorname{IsTransition}(\mathsf{tr})\quad v_{\mathsf{self}}\ =\ \operatorname{RecordValue}(\operatorname{ModalStateRef}(\mathsf{modal}_{\mathsf{ref}},\ S_{\mathsf{src}}),\ \mathsf{fs}_{\mathsf{src}})\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \mathsf{tr}.\mathsf{target}\ =\ S_{\mathsf{tgt}} \\[0.16em]
\operatorname{BindParams}(\operatorname{TransitionParams}(M,\ S_{\mathsf{src}},\ \mathsf{tr}),\ [v_{\mathsf{arg}}]\ \mathbin{++} \ \mathsf{vec}_{v})\ =\ \mathsf{binds}\quad \operatorname{BlockEnter}(\sigma ,\ \mathsf{binds})\ \Downarrow \ (\sigma_{1} ,\ \mathsf{scope})\quad \Gamma \ \vdash \ \operatorname{EvalBlockBodySigma}(\mathsf{tr}.\mathsf{body},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out}_{\mathsf{body}},\ \sigma_{2} ) \\[0.16em]
v_{\mathsf{tgt}}\ =\ \operatorname{ExtractReturnValue}(\mathsf{out}_{\mathsf{body}})\quad \operatorname{ValidateModalState}(v_{\mathsf{tgt}},\ \mathsf{modal}_{\mathsf{ref}},\ S_{\mathsf{tgt}})\quad \operatorname{BlockExit}(\sigma_{2} ,\ \mathsf{scope},\ \mathsf{out}_{\mathsf{body}})\ \Downarrow \ (\mathsf{out}',\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ApplyMethodSigma}(\mathsf{base},\ \mathsf{name},\ v_{\mathsf{self}},\ v_{\mathsf{arg}},\ \mathsf{vec}_{v},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{tgt}}),\ \sigma_{3} )
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ExtractReturnValue}(\operatorname{Val}(v))\ =\ v \\[0.16em]
\operatorname{ExtractReturnValue}(\operatorname{Ctrl}(\operatorname{Return}(v)))\ =\ v
\end{array}
$$

$$
\operatorname{ValidateModalState}(v,\ \mathsf{modal}_{\mathsf{ref}},\ S)\ \Leftrightarrow \ v\ =\ \operatorname{RecordValue}(\operatorname{ModalStateRef}(\mathsf{modal}_{\mathsf{ref}},\ S),\ \_)
$$

### 13.4.6 Lowering

Transitions lower as direct modal-method bodies with a moved `self` receiver. Lowering does not mutate an in-place state tag; it lowers the transition body that constructs and returns a fresh `RecordValue(ModalStateRef(modal_ref, S_tgt), ...)`.

### 13.4.7 Diagnostics

Diagnostics are defined for duplicate transition names, target states not declared by the modal, transition invocation on a non-`unique` or non-state receiver, transition visibility failures, transition bodies that do not return the declared target state, and name conflicts between transitions and state methods.

## 13.5 Modal Widening

### 13.5.1 Syntax

```text
widen_expr ::= "widen" unary_expr
```

### 13.5.2 Parsing

**(Parse-Unary-Widen)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{widen})\quad \Gamma \ \vdash \ \operatorname{ParseUnary}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseUnary}(P)\ \Downarrow \ (P_{1},\ \operatorname{Unary}(\texttt{widen},\ e))
\end{array}
$$

### 13.5.3 AST Representation / Form

$$
\operatorname{ExprKind}(\operatorname{Unary}(\texttt{"widen"},\ \_))\ =\ \texttt{widen}
$$

### 13.5.4 Static Semantics

$$
\mathsf{WIDEN}_{\mathsf{LARGE}\_\mathsf{PAYLOAD}\_\mathsf{THRESHOLD}\_\mathsf{BYTES}}\ =\ 256
$$

**(T-Modal-Widen)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad S\ \in \ \operatorname{States}(M)\quad \Gamma \ \vdash \ \operatorname{WarnWidenLargePayload}(e,\ \mathsf{modal}_{\mathsf{ref}},\ S)\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \texttt{widen}\ e\ :\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})
\end{array}
$$

**(T-Modal-Widen-Perm)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypePerm}(p',\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S))\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad S\ \in \ \operatorname{States}(M)\quad \Gamma \ \vdash \ \operatorname{WarnWidenLargePayload}(e,\ \mathsf{modal}_{\mathsf{ref}},\ S)\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \texttt{widen}\ e\ :\ \operatorname{TypePerm}(p',\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}}))
\end{array}
$$

**(Widen-AlreadyGeneral)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T\quad \operatorname{StripPerm}(T)\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad c\ =\ \operatorname{Code}(\mathsf{Widen}-\mathsf{AlreadyGeneral}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \texttt{widen}\ e\ \Uparrow \ c
\end{array}
$$

**(Widen-NonModal)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T\quad \operatorname{StripPerm}(T)\ =\ U\quad U\ \ne \ \operatorname{TypeModalState}(\_,\ \_)\quad \lnot \ \exists \ \mathsf{modal}_{\mathsf{ref}},\ M.\ (U\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\ \land \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M)\quad c\ =\ \operatorname{Code}(\mathsf{Widen}-\mathsf{NonModal}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \texttt{widen}\ e\ \Uparrow \ c
\end{array}
$$

$$
\operatorname{NicheCompatible}(\mathsf{modal}_{\mathsf{ref}},\ S)\ \Leftrightarrow \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ \operatorname{NicheApplies}(\mathsf{modal}_{\mathsf{ref}})\ \land \ \operatorname{PayloadState}(\mathsf{modal}_{\mathsf{ref}})\ =\ S\ \land \ \operatorname{sizeof}(\operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S))\ =\ \operatorname{sizeof}(\operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}}))\ \land \ \operatorname{alignof}(\operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S))\ =\ \operatorname{alignof}(\operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}}))
$$

**(Chk-Subsumption-Modal-NonNiche)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ \Rightarrow \ S\ \dashv \ C\quad \operatorname{StripPerm}(S)\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S_{s})\quad \operatorname{StripPerm}(T)\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \lnot \ \operatorname{NicheCompatible}(\mathsf{modal}_{\mathsf{ref}},\ S_{s})\quad c\ =\ \operatorname{Code}(\mathsf{Chk}-\mathsf{Subsumption}-\mathsf{Modal}-\mathsf{NonNiche}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ e\ \Leftarrow \ T\ \Uparrow \ c
\end{array}
$$

$$
\operatorname{WidenWarnCond}(\mathsf{modal}_{\mathsf{ref}},\ S)\ \Leftrightarrow \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ \operatorname{sizeof}(\operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S))\ >\ \mathsf{WIDEN}_{\mathsf{LARGE}\_\mathsf{PAYLOAD}\_\mathsf{THRESHOLD}\_\mathsf{BYTES}}\ \land \ \lnot \ \operatorname{NicheCompatible}(\mathsf{modal}_{\mathsf{ref}},\ S)
$$

**(Warn-Widen-LargePayload)**

$$
\begin{array}{l}
\operatorname{WidenWarnCond}(\mathsf{modal}_{\mathsf{ref}},\ S)\quad \mathsf{sp}\ =\ \operatorname{span}(\operatorname{Unary}(\texttt{"widen"},\ e))\quad \Gamma \ \vdash \ \operatorname{Emit}(W-\mathsf{SYS}-4010,\ \mathsf{sp}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{WarnWidenLargePayload}(e,\ \mathsf{modal}_{\mathsf{ref}},\ S)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(Warn-Widen-Ok)**

$$
\begin{array}{l}
\lnot \ \operatorname{WidenWarnCond}(\mathsf{modal}_{\mathsf{ref}},\ S) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{WarnWidenLargePayload}(e,\ \mathsf{modal}_{\mathsf{ref}},\ S)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

### 13.5.5 Dynamic Semantics

$$
\operatorname{UnOp}(\texttt{"widen"},\ v)\ \Downarrow \ \operatorname{ModalVal}(S,\ v)\ \Leftrightarrow \ v\ =\ \operatorname{RecordValue}(\operatorname{ModalStateRef}(\mathsf{modal}_{\mathsf{ref}},\ S),\ \mathsf{fs})
$$

### 13.5.6 Lowering

General modal values lower according to `ModalLayout(modal_ref)`. When `NicheCompatible(modal_ref, S)` holds, widening MAY be representation-preserving. Otherwise, lowering MUST materialize the tagged general-modal representation for the source state.

$$
\operatorname{sizeof}(M@S)\ \le \ \operatorname{sizeof}(M)
$$

### 13.5.7 Diagnostics

Diagnostics are defined for applying `widen` to a non-modal operand, applying `widen` to an already-general modal value, implicitly subsuming a concrete modal state to a non-niche-compatible general modal type, and widening a large non-niche payload.

## 13.6 String Types

### 13.6.1 Syntax

```text
string_type      ::= "string" string_state_opt
string_state_opt ::= epsilon | "@" "Managed" | "@" "View"
```

### 13.6.2 Parsing

**(Parse-String-Type)**

$$
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \operatorname{Lexeme}(\operatorname{Tok}(P))\ =\ \texttt{string}\quad \Gamma \ \vdash \ \operatorname{ParseStringState}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{st}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseNonPermType}(P)\ \Downarrow \ (P_{1},\ \operatorname{TypeString}(\mathsf{st}_{\mathsf{opt}}))
\end{array}
$$

**String State.**

**(Parse-StringState-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"@"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStringState}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-StringState-Managed)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"@"})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(P)))\quad \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(P)))\ =\ \texttt{Managed} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStringState}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P)),\ \texttt{Managed})
\end{array}
$$

**(Parse-StringState-View)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"@"})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(P)))\quad \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(P)))\ =\ \texttt{View} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStringState}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P)),\ \texttt{View})
\end{array}
$$

### 13.6.3 AST Representation / Form

$$
\begin{array}{l}
\operatorname{TypeString}(\mathsf{state}_{\mathsf{opt}})\quad \mathsf{where}\ \mathsf{state}_{\mathsf{opt}}\ \in \ \{\bot ,\ \texttt{View},\ \texttt{Managed}\} \\[0.16em]
\operatorname{States}(\texttt{string})\ =\ \{\ \texttt{@Managed},\ \texttt{@View}\ \}
\end{array}
$$

StringBuiltinTable =
{

$$
\begin{array}{l}
\ \langle \texttt{string::from},\ [\langle \bot ,\ \texttt{source},\ \operatorname{TypeString}(\texttt{@View})\rangle ,\ \langle \bot ,\ \texttt{heap},\ \operatorname{TypeDynamic}(\texttt{HeapAllocator})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeString}(\texttt{@Managed})),\ \operatorname{TypePath}([\texttt{"AllocationError"}])])\rangle , \\[0.16em]
\ \langle \texttt{string::as\_view},\ [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeString}(\texttt{@Managed}))\rangle ],\ \operatorname{TypeString}(\texttt{@View})\rangle , \\[0.16em]
\ \langle \texttt{string::slice},\ [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeString}(\texttt{@View}))\rangle ,\ \langle \bot ,\ \texttt{start},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ,\ \langle \bot ,\ \texttt{end},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ],\ \operatorname{TypeString}(\texttt{@View})\rangle , \\[0.16em]
\ \langle \texttt{string::to\_managed},\ [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeString}(\texttt{@View}))\rangle ,\ \langle \bot ,\ \texttt{heap},\ \operatorname{TypeDynamic}(\texttt{HeapAllocator})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeString}(\texttt{@Managed})),\ \operatorname{TypePath}([\texttt{"AllocationError"}])])\rangle , \\[0.16em]
\ \langle \texttt{string::clone\_with},\ [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeString}(\texttt{@Managed}))\rangle ,\ \langle \bot ,\ \texttt{heap},\ \operatorname{TypeDynamic}(\texttt{HeapAllocator})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeString}(\texttt{@Managed})),\ \operatorname{TypePath}([\texttt{"AllocationError"}])])\rangle , \\[0.16em]
\ \langle \texttt{string::append},\ [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeString}(\texttt{@Managed}))\rangle ,\ \langle \bot ,\ \texttt{data},\ \operatorname{TypeString}(\texttt{@View})\rangle ,\ \langle \bot ,\ \texttt{heap},\ \operatorname{TypeDynamic}(\texttt{HeapAllocator})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePath}([\texttt{"AllocationError"}])])\rangle , \\[0.16em]
\ \langle \texttt{string::length},\ [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeString}(\texttt{@View}))\rangle ],\ \operatorname{TypePrim}(\texttt{"usize"})\rangle , \\[0.16em]
\ \langle \texttt{string::is\_empty},\ [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeString}(\texttt{@View}))\rangle ],\ \operatorname{TypePrim}(\texttt{"bool"})\rangle  \\[0.16em]
\}
\end{array}
$$

$$
\operatorname{StringBuiltinSig}(\mathsf{method})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \langle \mathsf{method},\ \mathsf{params},\ \mathsf{ret}\rangle \ \in \ \mathsf{StringBuiltinTable}
$$

### 13.6.4 Static Semantics

**(WF-String)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeString}(\mathsf{state}_{\mathsf{opt}})\quad \mathsf{state}_{\mathsf{opt}}\ \in \ \{\bot ,\ \texttt{View},\ \texttt{Managed}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}
\end{array}
$$

$$
\begin{array}{l}
S\ \in \ \{\texttt{@Managed},\ \texttt{@View}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{string}@S\ \mathrel{<:} \ \mathsf{string}
\end{array}
$$

The built-in string operations are typed by `StringBuiltinSig`. Calls to those operations use the ordinary call and method-call rules of Chapter 16.

### 13.6.5 Dynamic Semantics

$$
\operatorname{StringLiteralVal}(\mathsf{lit})\ =\ v\ \Leftrightarrow \ \operatorname{LiteralValue}(\mathsf{lit},\ \operatorname{TypeString}(\texttt{@View}))\ =\ v
$$

$$
\begin{array}{l}
\mathsf{ByteSeq}\ =\ \operatorname{List}(\texttt{u8}) \\[0.16em]
\mathsf{SB}\ =\ \langle \mathsf{StrBuf},\ \mathsf{BytesBuf},\ \mathsf{BytesCap}\rangle  \\[0.16em]
\mathsf{StrBuf}\ :\ \texttt{string@Managed}\ \rightharpoonup \ \mathsf{ByteSeq} \\[0.16em]
\mathsf{BytesBuf}\ :\ \texttt{bytes@Managed}\ \rightharpoonup \ \mathsf{ByteSeq} \\[0.16em]
\mathsf{BytesCap}\ :\ \texttt{bytes@Managed}\ \rightharpoonup \ \texttt{usize}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{ViewBytes}\ :\ (\texttt{string@View}\ \cup \ \texttt{bytes@View})\ \to \ \mathsf{ByteSeq} \\[0.16em]
\operatorname{ByteSeqOf}(\mathsf{SB},\ v)\ = \\[0.16em]
\ \operatorname{StrBuf}(v)\quad \mathsf{if}\ v:\texttt{string@Managed} \\[0.16em]
\ \operatorname{BytesBuf}(v)\ \mathsf{if}\ v:\texttt{bytes@Managed} \\[0.16em]
\ \operatorname{ViewBytes}(v)\ \mathsf{if}\ v:\texttt{string@View}\ \mathsf{or}\ v:\texttt{bytes@View} \\[0.16em]
\operatorname{ByteLen}(\mathsf{SB},\ v)\ =\ \mid \operatorname{ByteSeqOf}(\mathsf{SB},\ v)\mid 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ValueType}(v)\ =\ \operatorname{TypeString}(\texttt{@View})\ \Leftrightarrow \ v\ \in \ \texttt{string@View} \\[0.16em]
\operatorname{ValueType}(v)\ =\ \operatorname{TypeString}(\texttt{@Managed})\ \Leftrightarrow \ v\ \in \ \texttt{string@Managed} \\[0.16em]
\operatorname{ValueType}(v)\ =\ \operatorname{TypeString}(\bot )\ \Leftrightarrow \ \operatorname{ValueType}(v)\ =\ \operatorname{TypeString}(\texttt{@View})\ \lor \ \operatorname{ValueType}(v)\ =\ \operatorname{TypeString}(\texttt{@Managed})
\end{array}
$$

$$
\begin{array}{l}
\mathsf{StringBytesJudg}_{\mathsf{string}}\ =\ \{ \\[0.16em]
\ \operatorname{StringFrom}(\mathsf{SB},\ \mathsf{source},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}'), \\[0.16em]
\ \operatorname{StringAsView}(\mathsf{SB},\ \mathsf{self})\ \Downarrow \ v, \\[0.16em]
\ \operatorname{StringSlice}(\mathsf{SB},\ \mathsf{self},\ \mathsf{start},\ \mathsf{end})\ \Downarrow \ v, \\[0.16em]
\ \operatorname{StringToManaged}(\mathsf{SB},\ \mathsf{self},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}'), \\[0.16em]
\ \operatorname{StringCloneWith}(\mathsf{SB},\ \mathsf{self},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}'), \\[0.16em]
\ \operatorname{StringAppend}(\mathsf{SB},\ \mathsf{self},\ \mathsf{data},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}'), \\[0.16em]
\ \operatorname{StringLength}(\mathsf{SB},\ \mathsf{self})\ \Downarrow \ n, \\[0.16em]
\ \operatorname{StringIsEmpty}(\mathsf{SB},\ \mathsf{self})\ \Downarrow \ b \\[0.16em]
\}
\end{array}
$$

**String Literal Storage.**
For any string literal `lit`, evaluation MUST allocate `StringBytes(lit)` in static, read-only storage. The resulting `string@View` value MUST reference that storage and MUST have length `|StringBytes(lit)|`. The backing storage MUST have static duration and MUST NOT be deallocated.

**(StringFrom-Ok)**

$$
\begin{array}{l}
r\ =\ v\quad \mathsf{SB}'\ =\ \langle \mathsf{StrBuf}[v\ \mapsto \ \operatorname{ByteSeqOf}(\mathsf{SB},\ \mathsf{source})],\ \mathsf{BytesBuf},\ \mathsf{BytesCap}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{StringFrom}(\mathsf{SB},\ \mathsf{source},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}')
\end{array}
$$

**(StringFrom-Err)**

$$
\begin{array}{l}
\operatorname{AllocErrorVal}(r)\quad \mathsf{SB}'\ =\ \mathsf{SB} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{StringFrom}(\mathsf{SB},\ \mathsf{source},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}')
\end{array}
$$

**(StringAsView-Ok)**

$$
\begin{array}{l}
\operatorname{ByteSeqOf}(\mathsf{SB},\ v)\ =\ \operatorname{ByteSeqOf}(\mathsf{SB},\ \mathsf{self}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{StringAsView}(\mathsf{SB},\ \mathsf{self})\ \Downarrow \ v
\end{array}
$$

**(StringSlice-Ok)**

$$
\begin{array}{l}
0\ \le \ \mathsf{start}\ \le \ \mathsf{end}\ \le \ \operatorname{ByteLen}(\mathsf{SB},\ \mathsf{self})\quad \mathsf{start}\ \mathsf{and}\ \mathsf{end}\ \mathsf{are}\ \mathsf{valid}\ \mathsf{UTF}-8\ \mathsf{byte}\ \mathsf{boundaries}\ \mathsf{of}\ \operatorname{ByteSeqOf}(\mathsf{SB},\ \mathsf{self})\quad \operatorname{ByteSeqOf}(\mathsf{SB},\ v)\ =\ \operatorname{ByteSeqOf}(\mathsf{SB},\ \mathsf{self})[\mathsf{start}..\mathsf{end}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{StringSlice}(\mathsf{SB},\ \mathsf{self},\ \mathsf{start},\ \mathsf{end})\ \Downarrow \ v
\end{array}
$$

**(StringToManaged-Ok)**

$$
\begin{array}{l}
r\ =\ v\quad \mathsf{SB}'\ =\ \langle \mathsf{StrBuf}[v\ \mapsto \ \operatorname{ByteSeqOf}(\mathsf{SB},\ \mathsf{self})],\ \mathsf{BytesBuf},\ \mathsf{BytesCap}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{StringToManaged}(\mathsf{SB},\ \mathsf{self},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}')
\end{array}
$$

**(StringToManaged-Err)**

$$
\begin{array}{l}
\operatorname{AllocErrorVal}(r)\quad \mathsf{SB}'\ =\ \mathsf{SB} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{StringToManaged}(\mathsf{SB},\ \mathsf{self},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}')
\end{array}
$$

**(StringCloneWith-Ok)**

$$
\begin{array}{l}
r\ =\ v\quad \mathsf{SB}'\ =\ \langle \mathsf{StrBuf}[v\ \mapsto \ \operatorname{ByteSeqOf}(\mathsf{SB},\ \mathsf{self})],\ \mathsf{BytesBuf},\ \mathsf{BytesCap}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{StringCloneWith}(\mathsf{SB},\ \mathsf{self},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}')
\end{array}
$$

**(StringCloneWith-Err)**

$$
\begin{array}{l}
\operatorname{AllocErrorVal}(r)\quad \mathsf{SB}'\ =\ \mathsf{SB} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{StringCloneWith}(\mathsf{SB},\ \mathsf{self},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}')
\end{array}
$$

**(StringAppend-Ok)**

$$
\begin{array}{l}
r\ =\ ()\quad \mathsf{StrBuf}'\ =\ \mathsf{StrBuf}[\mathsf{self}\ \mapsto \ \operatorname{ByteSeqOf}(\mathsf{SB},\ \mathsf{self})\ \mathbin{++} \ \operatorname{ByteSeqOf}(\mathsf{SB},\ \mathsf{data})]\quad \mathsf{SB}'\ =\ \langle \mathsf{StrBuf}',\ \mathsf{BytesBuf},\ \mathsf{BytesCap}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{StringAppend}(\mathsf{SB},\ \mathsf{self},\ \mathsf{data},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}')
\end{array}
$$

**(StringAppend-Err)**

$$
\begin{array}{l}
\operatorname{AllocErrorVal}(r)\quad \mathsf{SB}'\ =\ \mathsf{SB} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{StringAppend}(\mathsf{SB},\ \mathsf{self},\ \mathsf{data},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}')
\end{array}
$$

**(StringLength)**

$$
\begin{array}{l}
n\ =\ \operatorname{ByteLen}(\mathsf{SB},\ \mathsf{self}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{StringLength}(\mathsf{SB},\ \mathsf{self})\ \Downarrow \ n
\end{array}
$$

**(StringIsEmpty)**

$$
\begin{array}{l}
b\ =\ (\operatorname{ByteLen}(\mathsf{SB},\ \mathsf{self})\ =\ 0) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{StringIsEmpty}(\mathsf{SB},\ \mathsf{self})\ \Downarrow \ b
\end{array}
$$

$$
\begin{array}{l}
\operatorname{StringViewOf}(v_{\mathsf{managed}})\ =\ v_{\mathsf{view}}\ \Leftrightarrow  \\[0.16em]
\ v_{\mathsf{managed}}\ =\ \operatorname{ManagedString}(\mathsf{ptr},\ \mathsf{len},\ \mathsf{cap})\ \land  \\[0.16em]
\ v_{\mathsf{view}}\ =\ \operatorname{ViewString}(\mathsf{ptr},\ \mathsf{len})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{StringLength}(\operatorname{ViewString}(\_,\ \mathsf{len}))\ =\ \mathsf{len} \\[0.16em]
\operatorname{StringLength}(\operatorname{ManagedString}(\_,\ \mathsf{len},\ \_))\ =\ \mathsf{len}
\end{array}
$$

### 13.6.6 Lowering

$$
\begin{array}{l}
\mathsf{StringManagedFields}\ =\ [\langle \texttt{pointer},\ \operatorname{TypePtr}(\operatorname{TypePrim}(\texttt{"u8"}),\ \texttt{Valid})\rangle ,\ \langle \texttt{length},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ,\ \langle \texttt{capacity},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ] \\[0.16em]
\mathsf{StringManagedOffsets}\ =\ [0,\ \mathsf{PtrSize},\ 2\ \times \ \mathsf{PtrSize}] \\[0.16em]
\operatorname{RecordLayout}(\mathsf{StringManagedFields})\ =\ \langle 3\ \times \ \mathsf{PtrSize},\ \mathsf{PtrAlign},\ \mathsf{StringManagedOffsets}\rangle 
\end{array}
$$

$$
\begin{array}{l}
\mathsf{StringViewFields}\ =\ [\langle \texttt{pointer},\ \operatorname{TypePtr}(\operatorname{TypePerm}(\texttt{const},\ \operatorname{TypePrim}(\texttt{"u8"})),\ \texttt{Valid})\rangle ,\ \langle \texttt{length},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ] \\[0.16em]
\mathsf{StringViewOffsets}\ =\ [0,\ \mathsf{PtrSize}] \\[0.16em]
\operatorname{RecordLayout}(\mathsf{StringViewFields})\ =\ \langle 2\ \times \ \mathsf{PtrSize},\ \mathsf{PtrAlign},\ \mathsf{StringViewOffsets}\rangle 
\end{array}
$$

**(Size-String-Managed)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeString}(\texttt{@Managed}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ 3\ \times \ \mathsf{PtrSize}
\end{array}
$$

**(Align-String-Managed)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeString}(\texttt{@Managed}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{PtrAlign}
\end{array}
$$

**(Layout-String-Managed)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeString}(\texttt{@Managed}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \langle 3\ \times \ \mathsf{PtrSize},\ \mathsf{PtrAlign}\rangle 
\end{array}
$$

**(Size-String-View)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeString}(\texttt{@View}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ 2\ \times \ \mathsf{PtrSize}
\end{array}
$$

**(Align-String-View)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeString}(\texttt{@View}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{PtrAlign}
\end{array}
$$

**(Layout-String-View)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeString}(\texttt{@View}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \langle 2\ \times \ \mathsf{PtrSize},\ \mathsf{PtrAlign}\rangle 
\end{array}
$$

**(Size-String-Modal)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeString}(\bot )\quad \Gamma \ \vdash \ \operatorname{ModalLayout}(\texttt{string})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_,\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ \mathsf{size}
\end{array}
$$

**(Align-String-Modal)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeString}(\bot )\quad \Gamma \ \vdash \ \operatorname{ModalLayout}(\texttt{string})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_,\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{align}
\end{array}
$$

$$
\operatorname{ValueBits}(\operatorname{TypeString}(\mathsf{st}),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ \operatorname{ValueType}(v)\ =\ \operatorname{TypeString}(\mathsf{st})\ \land \ \mid \mathsf{bits}\mid \ =\ \operatorname{sizeof}(\operatorname{TypeString}(\mathsf{st}))
$$

$$
\operatorname{DropManaged}(\operatorname{ManagedString}(\mathsf{ptr},\ \_,\ \mathsf{cap}),\ v_{\mathsf{heap}})\ \Leftrightarrow \ \operatorname{HeapDeallocRaw}(v_{\mathsf{heap}},\ \mathsf{ptr},\ \mathsf{cap})
$$

### 13.6.7 Diagnostics

This section introduces no additional diagnostics beyond the shared well-formedness, call typing, and allocation-result rules.

## 13.7 Bytes Types

### 13.7.1 Syntax

```text
bytes_type      ::= "bytes" bytes_state_opt
bytes_state_opt ::= epsilon | "@" "Managed" | "@" "View"
```

### 13.7.2 Parsing

**(Parse-Bytes-Type)**

$$
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \operatorname{Lexeme}(\operatorname{Tok}(P))\ =\ \texttt{bytes}\quad \Gamma \ \vdash \ \operatorname{ParseBytesState}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{st}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseNonPermType}(P)\ \Downarrow \ (P_{1},\ \operatorname{TypeBytes}(\mathsf{st}_{\mathsf{opt}}))
\end{array}
$$

**Bytes State.**

**(Parse-BytesState-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"@"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseBytesState}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-BytesState-Managed)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"@"})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(P)))\quad \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(P)))\ =\ \texttt{Managed} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseBytesState}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P)),\ \texttt{Managed})
\end{array}
$$

**(Parse-BytesState-View)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"@"})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(P)))\quad \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(P)))\ =\ \texttt{View} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseBytesState}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P)),\ \texttt{View})
\end{array}
$$

### 13.7.3 AST Representation / Form

$$
\begin{array}{l}
\operatorname{TypeBytes}(\mathsf{state}_{\mathsf{opt}})\quad \mathsf{where}\ \mathsf{state}_{\mathsf{opt}}\ \in \ \{\bot ,\ \texttt{View},\ \texttt{Managed}\} \\[0.16em]
\operatorname{States}(\texttt{bytes})\ =\ \{\ \texttt{@Managed},\ \texttt{@View}\ \}
\end{array}
$$

BytesBuiltinTable =
{

$$
\begin{array}{l}
\ \langle \texttt{bytes::with\_capacity},\ [\langle \bot ,\ \texttt{cap},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ,\ \langle \bot ,\ \texttt{heap},\ \operatorname{TypeDynamic}(\texttt{HeapAllocator})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeBytes}(\texttt{@Managed})),\ \operatorname{TypePath}([\texttt{"AllocationError"}])])\rangle , \\[0.16em]
\ \langle \texttt{bytes::from\_slice},\ [\langle \bot ,\ \texttt{data},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeSlice}(\operatorname{TypePrim}(\texttt{"u8"})))\rangle ,\ \langle \bot ,\ \texttt{heap},\ \operatorname{TypeDynamic}(\texttt{HeapAllocator})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeBytes}(\texttt{@Managed})),\ \operatorname{TypePath}([\texttt{"AllocationError"}])])\rangle , \\[0.16em]
\ \langle \texttt{bytes::as\_view},\ [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeBytes}(\texttt{@Managed}))\rangle ],\ \operatorname{TypeBytes}(\texttt{@View})\rangle , \\[0.16em]
\ \langle \texttt{bytes::as\_slice},\ [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeBytes}(\texttt{@View}))\rangle ],\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeSlice}(\operatorname{TypePrim}(\texttt{"u8"})))\rangle , \\[0.16em]
\ \langle \texttt{bytes::to\_managed},\ [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeBytes}(\texttt{@View}))\rangle ,\ \langle \bot ,\ \texttt{heap},\ \operatorname{TypeDynamic}(\texttt{HeapAllocator})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeBytes}(\texttt{@Managed})),\ \operatorname{TypePath}([\texttt{"AllocationError"}])])\rangle , \\[0.16em]
\ \langle \texttt{bytes::view},\ [\langle \bot ,\ \texttt{data},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeSlice}(\operatorname{TypePrim}(\texttt{"u8"})))\rangle ],\ \operatorname{TypeBytes}(\texttt{@View})\rangle , \\[0.16em]
\ \langle \texttt{bytes::view\_string},\ [\langle \bot ,\ \texttt{data},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeBytes}(\texttt{@View})\rangle , \\[0.16em]
\ \langle \texttt{bytes::append},\ [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeBytes}(\texttt{@Managed}))\rangle ,\ \langle \bot ,\ \texttt{data},\ \operatorname{TypeBytes}(\texttt{@View})\rangle ,\ \langle \bot ,\ \texttt{heap},\ \operatorname{TypeDynamic}(\texttt{HeapAllocator})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePath}([\texttt{"AllocationError"}])])\rangle , \\[0.16em]
\ \langle \texttt{bytes::length},\ [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeBytes}(\texttt{@View}))\rangle ],\ \operatorname{TypePrim}(\texttt{"usize"})\rangle , \\[0.16em]
\ \langle \texttt{bytes::is\_empty},\ [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeBytes}(\texttt{@View}))\rangle ],\ \operatorname{TypePrim}(\texttt{"bool"})\rangle  \\[0.16em]
\}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{StringBytesBuiltinTable}\ =\ \mathsf{StringBuiltinTable}\ \cup \ \mathsf{BytesBuiltinTable} \\[0.16em]
\operatorname{BytesBuiltinSig}(\mathsf{method})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \langle \mathsf{method},\ \mathsf{params},\ \mathsf{ret}\rangle \ \in \ \mathsf{BytesBuiltinTable} \\[0.16em]
\operatorname{StringBytesBuiltinSig}(\mathsf{method})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \operatorname{StringBuiltinSig}(\mathsf{method})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle  \\[0.16em]
\operatorname{StringBytesBuiltinSig}(\mathsf{method})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \operatorname{BytesBuiltinSig}(\mathsf{method})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle 
\end{array}
$$

### 13.7.4 Static Semantics

**(WF-Bytes)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeBytes}(\mathsf{state}_{\mathsf{opt}})\quad \mathsf{state}_{\mathsf{opt}}\ \in \ \{\bot ,\ \texttt{View},\ \texttt{Managed}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}
\end{array}
$$

$$
\begin{array}{l}
S\ \in \ \{\texttt{@Managed},\ \texttt{@View}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{bytes}@S\ \mathrel{<:} \ \mathsf{bytes}
\end{array}
$$

The built-in bytes operations are typed by `BytesBuiltinSig`. Calls to those operations use the ordinary call and method-call rules of Chapter 16.

### 13.7.5 Dynamic Semantics

$$
\operatorname{SliceBytes}(\mathsf{data})\ =\ [b\ \mid \ b\ \in \ \mathsf{data}]
$$

$$
\begin{array}{l}
\operatorname{ValueType}(v)\ =\ \operatorname{TypeBytes}(\texttt{@View})\ \Leftrightarrow \ v\ \in \ \texttt{bytes@View} \\[0.16em]
\operatorname{ValueType}(v)\ =\ \operatorname{TypeBytes}(\texttt{@Managed})\ \Leftrightarrow \ v\ \in \ \texttt{bytes@Managed} \\[0.16em]
\operatorname{ValueType}(v)\ =\ \operatorname{TypeBytes}(\bot )\ \Leftrightarrow \ \operatorname{ValueType}(v)\ =\ \operatorname{TypeBytes}(\texttt{@View})\ \lor \ \operatorname{ValueType}(v)\ =\ \operatorname{TypeBytes}(\texttt{@Managed})
\end{array}
$$

$$
\begin{array}{l}
\mathsf{StringBytesJudg}_{\mathsf{bytes}}\ =\ \{ \\[0.16em]
\ \operatorname{BytesWithCapacity}(\mathsf{SB},\ \mathsf{cap},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}'), \\[0.16em]
\ \operatorname{BytesFromSlice}(\mathsf{SB},\ \mathsf{data},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}'), \\[0.16em]
\ \operatorname{BytesAsView}(\mathsf{SB},\ \mathsf{self})\ \Downarrow \ v, \\[0.16em]
\ \operatorname{BytesToManaged}(\mathsf{SB},\ \mathsf{self},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}'), \\[0.16em]
\ \operatorname{BytesView}(\mathsf{SB},\ \mathsf{data})\ \Downarrow \ v, \\[0.16em]
\ \operatorname{BytesViewString}(\mathsf{SB},\ \mathsf{data})\ \Downarrow \ v, \\[0.16em]
\ \operatorname{BytesAsSlice}(\mathsf{SB},\ \mathsf{self})\ \Downarrow \ s, \\[0.16em]
\ \operatorname{BytesAppend}(\mathsf{SB},\ \mathsf{self},\ \mathsf{data},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}'), \\[0.16em]
\ \operatorname{BytesLength}(\mathsf{SB},\ \mathsf{self})\ \Downarrow \ n, \\[0.16em]
\ \operatorname{BytesIsEmpty}(\mathsf{SB},\ \mathsf{self})\ \Downarrow \ b \\[0.16em]
\}
\end{array}
$$

$$
\mathsf{StringBytesJudg}\ =\ \mathsf{StringBytesJudg}_{\mathsf{string}}\ \cup \ \mathsf{StringBytesJudg}_{\mathsf{bytes}}
$$

**(BytesWithCapacity-Ok)**

$$
\begin{array}{l}
r\ =\ v\quad \mathsf{BytesBuf}'\ =\ \mathsf{BytesBuf}[v\ \mapsto \ []]\quad \mathsf{BytesCap}'\ =\ \mathsf{BytesCap}[v\ \mapsto \ \mathsf{cap}']\quad \mathsf{cap}'\ \ge \ \mathsf{cap}\quad \mathsf{SB}'\ =\ \langle \mathsf{StrBuf},\ \mathsf{BytesBuf}',\ \mathsf{BytesCap}'\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BytesWithCapacity}(\mathsf{SB},\ \mathsf{cap},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}')
\end{array}
$$

**(BytesWithCapacity-Err)**

$$
\begin{array}{l}
\operatorname{AllocErrorVal}(r)\quad \mathsf{SB}'\ =\ \mathsf{SB} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BytesWithCapacity}(\mathsf{SB},\ \mathsf{cap},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}')
\end{array}
$$

**(BytesFromSlice-Ok)**

$$
\begin{array}{l}
r\ =\ v\quad \mathsf{BytesBuf}'\ =\ \mathsf{BytesBuf}[v\ \mapsto \ \operatorname{SliceBytes}(\mathsf{data})]\quad \mathsf{SB}'\ =\ \langle \mathsf{StrBuf},\ \mathsf{BytesBuf}',\ \mathsf{BytesCap}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BytesFromSlice}(\mathsf{SB},\ \mathsf{data},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}')
\end{array}
$$

**(BytesFromSlice-Err)**

$$
\begin{array}{l}
\operatorname{AllocErrorVal}(r)\quad \mathsf{SB}'\ =\ \mathsf{SB} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BytesFromSlice}(\mathsf{SB},\ \mathsf{data},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}')
\end{array}
$$

**(BytesAsView-Ok)**

$$
\begin{array}{l}
\operatorname{ByteSeqOf}(\mathsf{SB},\ v)\ =\ \operatorname{ByteSeqOf}(\mathsf{SB},\ \mathsf{self}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BytesAsView}(\mathsf{SB},\ \mathsf{self})\ \Downarrow \ v
\end{array}
$$

**(BytesToManaged-Ok)**

$$
\begin{array}{l}
r\ =\ v\quad \mathsf{BytesBuf}'\ =\ \mathsf{BytesBuf}[v\ \mapsto \ \operatorname{ByteSeqOf}(\mathsf{SB},\ \mathsf{self})]\quad \mathsf{SB}'\ =\ \langle \mathsf{StrBuf},\ \mathsf{BytesBuf}',\ \mathsf{BytesCap}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BytesToManaged}(\mathsf{SB},\ \mathsf{self},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}')
\end{array}
$$

**(BytesToManaged-Err)**

$$
\begin{array}{l}
\operatorname{AllocErrorVal}(r)\quad \mathsf{SB}'\ =\ \mathsf{SB} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BytesToManaged}(\mathsf{SB},\ \mathsf{self},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}')
\end{array}
$$

**(BytesView-Ok)**

$$
\begin{array}{l}
\operatorname{ByteSeqOf}(\mathsf{SB},\ v)\ =\ \operatorname{SliceBytes}(\mathsf{data}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BytesView}(\mathsf{SB},\ \mathsf{data})\ \Downarrow \ v
\end{array}
$$

**(BytesViewString-Ok)**

$$
\begin{array}{l}
\operatorname{ByteSeqOf}(\mathsf{SB},\ v)\ =\ \operatorname{ByteSeqOf}(\mathsf{SB},\ \mathsf{data}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BytesViewString}(\mathsf{SB},\ \mathsf{data})\ \Downarrow \ v
\end{array}
$$

**(BytesAsSlice-Ok)**

$$
\begin{array}{l}
\operatorname{SliceBytes}(s)\ =\ \operatorname{ByteSeqOf}(\mathsf{SB},\ \mathsf{self}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BytesAsSlice}(\mathsf{SB},\ \mathsf{self})\ \Downarrow \ s
\end{array}
$$

**(BytesAppend-Ok)**

$$
\begin{array}{l}
r\ =\ ()\quad \mathsf{BytesBuf}'\ =\ \mathsf{BytesBuf}[\mathsf{self}\ \mapsto \ \operatorname{ByteSeqOf}(\mathsf{SB},\ \mathsf{self})\ \mathbin{++} \ \operatorname{ByteSeqOf}(\mathsf{SB},\ \mathsf{data})]\quad \mathsf{SB}'\ =\ \langle \mathsf{StrBuf},\ \mathsf{BytesBuf}',\ \mathsf{BytesCap}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BytesAppend}(\mathsf{SB},\ \mathsf{self},\ \mathsf{data},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}')
\end{array}
$$

**(BytesAppend-Err)**

$$
\begin{array}{l}
\operatorname{AllocErrorVal}(r)\quad \mathsf{SB}'\ =\ \mathsf{SB} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BytesAppend}(\mathsf{SB},\ \mathsf{self},\ \mathsf{data},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}')
\end{array}
$$

**(BytesLength)**

$$
\begin{array}{l}
n\ =\ \operatorname{ByteLen}(\mathsf{SB},\ \mathsf{self}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BytesLength}(\mathsf{SB},\ \mathsf{self})\ \Downarrow \ n
\end{array}
$$

**(BytesIsEmpty)**

$$
\begin{array}{l}
b\ =\ (\operatorname{ByteLen}(\mathsf{SB},\ \mathsf{self})\ =\ 0) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BytesIsEmpty}(\mathsf{SB},\ \mathsf{self})\ \Downarrow \ b
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BytesViewOf}(v_{\mathsf{managed}})\ =\ v_{\mathsf{view}}\ \Leftrightarrow  \\[0.16em]
\ v_{\mathsf{managed}}\ =\ \operatorname{ManagedBytes}(\mathsf{ptr},\ \mathsf{len},\ \mathsf{cap})\ \land  \\[0.16em]
\ v_{\mathsf{view}}\ =\ \operatorname{ViewBytes}(\mathsf{ptr},\ \mathsf{len})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BytesLength}(\operatorname{ViewBytes}(\_,\ \mathsf{len}))\ =\ \mathsf{len} \\[0.16em]
\operatorname{BytesLength}(\operatorname{ManagedBytes}(\_,\ \mathsf{len},\ \_))\ =\ \mathsf{len}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BytesViewFromSlice}(\operatorname{SliceVal}(\mathsf{ptr},\ \mathsf{len}))\ =\ \operatorname{ViewBytes}(\mathsf{ptr},\ \mathsf{len}) \\[0.16em]
\operatorname{BytesViewFromString}(\operatorname{ViewString}(\mathsf{ptr},\ \mathsf{len}))\ =\ \operatorname{ViewBytes}(\mathsf{ptr},\ \mathsf{len})
\end{array}
$$

### 13.7.6 Lowering

$$
\begin{array}{l}
\mathsf{BytesManagedFields}\ =\ [\langle \texttt{pointer},\ \operatorname{TypePtr}(\operatorname{TypePrim}(\texttt{"u8"}),\ \texttt{Valid})\rangle ,\ \langle \texttt{length},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ,\ \langle \texttt{capacity},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ] \\[0.16em]
\mathsf{BytesManagedOffsets}\ =\ [0,\ \mathsf{PtrSize},\ 2\ \times \ \mathsf{PtrSize}] \\[0.16em]
\operatorname{RecordLayout}(\mathsf{BytesManagedFields})\ =\ \langle 3\ \times \ \mathsf{PtrSize},\ \mathsf{PtrAlign},\ \mathsf{BytesManagedOffsets}\rangle 
\end{array}
$$

$$
\begin{array}{l}
\mathsf{BytesViewFields}\ =\ [\langle \texttt{pointer},\ \operatorname{TypePtr}(\operatorname{TypePerm}(\texttt{const},\ \operatorname{TypePrim}(\texttt{"u8"})),\ \texttt{Valid})\rangle ,\ \langle \texttt{length},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ] \\[0.16em]
\mathsf{BytesViewOffsets}\ =\ [0,\ \mathsf{PtrSize}] \\[0.16em]
\operatorname{RecordLayout}(\mathsf{BytesViewFields})\ =\ \langle 2\ \times \ \mathsf{PtrSize},\ \mathsf{PtrAlign},\ \mathsf{BytesViewOffsets}\rangle 
\end{array}
$$

**(Size-Bytes-Managed)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeBytes}(\texttt{@Managed}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ 3\ \times \ \mathsf{PtrSize}
\end{array}
$$

**(Align-Bytes-Managed)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeBytes}(\texttt{@Managed}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{PtrAlign}
\end{array}
$$

**(Layout-Bytes-Managed)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeBytes}(\texttt{@Managed}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \langle 3\ \times \ \mathsf{PtrSize},\ \mathsf{PtrAlign}\rangle 
\end{array}
$$

**(Size-Bytes-View)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeBytes}(\texttt{@View}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ 2\ \times \ \mathsf{PtrSize}
\end{array}
$$

**(Align-Bytes-View)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeBytes}(\texttt{@View}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{PtrAlign}
\end{array}
$$

**(Layout-Bytes-View)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeBytes}(\texttt{@View}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \langle 2\ \times \ \mathsf{PtrSize},\ \mathsf{PtrAlign}\rangle 
\end{array}
$$

**(Size-Bytes-Modal)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeBytes}(\bot )\quad \Gamma \ \vdash \ \operatorname{ModalLayout}(\texttt{bytes})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_,\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ \mathsf{size}
\end{array}
$$

**(Align-Bytes-Modal)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeBytes}(\bot )\quad \Gamma \ \vdash \ \operatorname{ModalLayout}(\texttt{bytes})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_,\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{align}
\end{array}
$$

$$
\operatorname{ValueBits}(\operatorname{TypeBytes}(\mathsf{st}),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ \operatorname{ValueType}(v)\ =\ \operatorname{TypeBytes}(\mathsf{st})\ \land \ \mid \mathsf{bits}\mid \ =\ \operatorname{sizeof}(\operatorname{TypeBytes}(\mathsf{st}))
$$

$$
\operatorname{DropManaged}(\operatorname{ManagedBytes}(\mathsf{ptr},\ \_,\ \mathsf{cap}),\ v_{\mathsf{heap}})\ \Leftrightarrow \ \operatorname{HeapDeallocRaw}(v_{\mathsf{heap}},\ \mathsf{ptr},\ \mathsf{cap})
$$

### 13.7.7 Diagnostics

This section introduces no additional diagnostics beyond the shared well-formedness, call typing, and allocation-result rules.

## 13.8 Safe Pointer Types

### 13.8.1 Syntax

```text
safe_ptr_type ::= "Ptr" "<" type ">" ptr_state_opt
ptr_state_opt ::= epsilon | "@" "Valid" | "@" "Null" | "@" "Expired"
```

### 13.8.2 Parsing

**(Parse-Safe-Pointer-Type-ShiftSplit)**

$$
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \operatorname{Lexeme}(\operatorname{Tok}(P))\ =\ \texttt{Ptr}\quad \operatorname{IsOp}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"<"})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ t)\quad \operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{">>"})\quad P_{1}'\ =\ \operatorname{SplitShiftR}(P_{1})\quad \Gamma \ \vdash \ \operatorname{ParsePtrState}(\operatorname{Advance}(P_{1}'))\ \Downarrow \ (P_{2},\ \mathsf{st}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseNonPermType}(P)\ \Downarrow \ (P_{2},\ \operatorname{TypePtr}(t,\ \mathsf{st}_{\mathsf{opt}}))
\end{array}
$$

**(Parse-Safe-Pointer-Type)**

$$
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \operatorname{Lexeme}(\operatorname{Tok}(P))\ =\ \texttt{Ptr}\quad \operatorname{IsOp}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"<"})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ t)\quad \operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{">"})\quad \Gamma \ \vdash \ \operatorname{ParsePtrState}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{st}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseNonPermType}(P)\ \Downarrow \ (P_{2},\ \operatorname{TypePtr}(t,\ \mathsf{st}_{\mathsf{opt}}))
\end{array}
$$

**Pointer State.**

**(Parse-PtrState-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"@"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePtrState}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-PtrState-Valid)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"@"})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(P)))\quad \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(P)))\ =\ \texttt{Valid} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePtrState}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P)),\ \texttt{Valid})
\end{array}
$$

**(Parse-PtrState-Null)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"@"})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(P)))\quad \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(P)))\ =\ \texttt{Null} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePtrState}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P)),\ \texttt{Null})
\end{array}
$$

**(Parse-PtrState-Expired)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"@"})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(P)))\quad \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(P)))\ =\ \texttt{Expired} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePtrState}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P)),\ \texttt{Expired})
\end{array}
$$

### 13.8.3 AST Representation / Form

$$
\mathsf{PtrState}\ =\ \{\texttt{Valid},\ \texttt{Null},\ \texttt{Expired}\}
$$

$$
\begin{array}{l}
\mathsf{Ptr}<T>\ =\ \operatorname{TypePtr}(T,\ \bot ) \\[0.16em]
\mathsf{Ptr}<T>@s\ =\ \operatorname{TypePtr}(T,\ s)\quad (s\ \ne \ \bot )
\end{array}
$$

### 13.8.4 Static Semantics

**(WF-Ptr)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePtr}(T_{0},\ \mathsf{state}_{\mathsf{opt}})\quad \mathsf{state}_{\mathsf{opt}}\ \in \ \{\bot ,\ \texttt{Valid},\ \texttt{Null},\ \texttt{Expired}\}\quad \Gamma \ \vdash \ T_{0}\ \mathsf{wf} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}
\end{array}
$$

BitcopyType(TypePtr(T, s))
CloneType(TypePtr(T, s))

$$
\lnot \ \operatorname{DropType}(\operatorname{TypePtr}(T,\ s))
$$

**(Sub-Ptr-State)**

$$
\begin{array}{l}
s\ \in \ \{\texttt{Valid},\ \texttt{Null}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypePtr}(T,\ s)\ \mathrel{<:} \ \operatorname{TypePtr}(T,\ \bot )
\end{array}
$$

### 13.8.5 Dynamic Semantics

$$
\begin{array}{l}
\mathsf{Ptr}@\operatorname{Valid}(\mathsf{addr})\ =\ \operatorname{PtrVal}(\texttt{Valid},\ \mathsf{addr}) \\[0.16em]
\mathsf{Ptr}@\operatorname{Null}(\mathsf{addr})\ =\ \operatorname{PtrVal}(\texttt{Null},\ \mathsf{addr}) \\[0.16em]
\mathsf{Ptr}@\operatorname{Expired}(\mathsf{addr})\ =\ \operatorname{PtrVal}(\texttt{Expired},\ \mathsf{addr})
\end{array}
$$

$$
\operatorname{ValueType}(\operatorname{PtrVal}(s,\ \mathsf{addr}))\ =\ \operatorname{TypePtr}(T,\ s)\ \Leftrightarrow \ T\ \in \ \mathsf{Type}
$$

$$
\begin{array}{l}
\operatorname{PtrState}(\sigma ,\ \mathsf{Ptr}@\operatorname{Null}(\_))\ =\ \texttt{Null} \\[0.16em]
\operatorname{PtrState}(\sigma ,\ \mathsf{Ptr}@\operatorname{Expired}(\_))\ =\ \texttt{Expired} \\[0.16em]
\operatorname{PtrState}(\sigma ,\ \mathsf{Ptr}@\operatorname{Valid}(\mathsf{addr}))\ = \\[0.16em]
\ \texttt{Valid}\quad \mathsf{if}\ \operatorname{AddrTag}(\sigma ,\ \mathsf{addr})\ =\ \bot  \\[0.16em]
\ \texttt{Valid}\quad \mathsf{if}\ \operatorname{AddrTag}(\sigma ,\ \mathsf{addr})\ =\ \mathsf{tag}\ \ne \ \bot \ \land \ \operatorname{TagActive}(\sigma ,\ \mathsf{tag}) \\[0.16em]
\ \texttt{Expired}\ \mathsf{if}\ \operatorname{AddrTag}(\sigma ,\ \mathsf{addr})\ =\ \mathsf{tag}\ \ne \ \bot \ \land \ \lnot \ \operatorname{TagActive}(\sigma ,\ \mathsf{tag})
\end{array}
$$

$$
\mathsf{PtrAddrJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{ReadPtrSigma}(v_{\mathsf{ptr}},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma '),\ \Gamma \ \vdash \ \operatorname{WritePtrSigma}(v_{\mathsf{ptr}},\ v,\ \sigma )\ \Downarrow \ (\mathsf{sout},\ \sigma '),\ \Gamma \ \vdash \ \operatorname{AddrOfSigma}(p,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\}
$$

**(ReadPtr-Safe)**

$$
\begin{array}{l}
\operatorname{PtrState}(\sigma ,\ v_{\mathsf{ptr}})\ =\ \texttt{Valid}\quad \operatorname{PtrAddr}(v_{\mathsf{ptr}})\ =\ \mathsf{addr}\quad \operatorname{ReadAddr}(\sigma ,\ \mathsf{addr})\ =\ v \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ReadPtrSigma}(v_{\mathsf{ptr}},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma )
\end{array}
$$

**(WritePtr-Safe)**

$$
\begin{array}{l}
\operatorname{PtrState}(\sigma ,\ v_{\mathsf{ptr}})\ =\ \texttt{Valid}\quad \operatorname{PtrAddr}(v_{\mathsf{ptr}})\ =\ \mathsf{addr}\quad \operatorname{WriteAddr}(\sigma ,\ \mathsf{addr},\ v)\ \Downarrow \ \sigma ' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{WritePtrSigma}(v_{\mathsf{ptr}},\ v,\ \sigma )\ \Downarrow \ (\mathsf{ok},\ \sigma ')
\end{array}
$$

**(ReadPtr-Null)**

$$
\begin{array}{l}
\operatorname{PtrState}(\sigma ,\ v_{\mathsf{ptr}})\ =\ \texttt{Null} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ReadPtrSigma}(v_{\mathsf{ptr}},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma )
\end{array}
$$

**(ReadPtr-Expired)**

$$
\begin{array}{l}
\operatorname{PtrState}(\sigma ,\ v_{\mathsf{ptr}})\ =\ \texttt{Expired} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ReadPtrSigma}(v_{\mathsf{ptr}},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma )
\end{array}
$$

**(WritePtr-Null)**

$$
\begin{array}{l}
\operatorname{PtrState}(\sigma ,\ v_{\mathsf{ptr}})\ =\ \texttt{Null} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{WritePtrSigma}(v_{\mathsf{ptr}},\ v,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma )
\end{array}
$$

**(WritePtr-Expired)**

$$
\begin{array}{l}
\operatorname{PtrState}(\sigma ,\ v_{\mathsf{ptr}})\ =\ \texttt{Expired} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{WritePtrSigma}(v_{\mathsf{ptr}},\ v,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma )
\end{array}
$$

### 13.8.6 Lowering

**(Size-Ptr)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePtr}(T_{0},\ s) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ \mathsf{PtrSize}
\end{array}
$$

**(Align-Ptr)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePtr}(T_{0},\ s) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{PtrAlign}
\end{array}
$$

**(Layout-Ptr)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePtr}(T_{0},\ s) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \langle \mathsf{PtrSize},\ \mathsf{PtrAlign}\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{sizeof}(\texttt{Ptr<T>})\ =\ \operatorname{sizeof}(\texttt{usize})\quad \operatorname{alignof}(\texttt{Ptr<T>})\ =\ \operatorname{alignof}(\texttt{usize}) \\[0.16em]
\mathsf{PtrDiagRefs}\ =\ \{\texttt{"8.10"}\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{NicheSet}(T)\ =\ \{\operatorname{LEBytes}(0,\ \mathsf{PtrSize})\}\ \Leftrightarrow \ \exists \ U.\ T\ =\ \operatorname{TypePtr}(U,\ \texttt{Valid}) \\[0.16em]
\operatorname{NicheSet}(T)\ =\ \emptyset \ \Leftrightarrow \ \lnot \ \exists \ U.\ T\ =\ \operatorname{TypePtr}(U,\ \texttt{Valid})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ValidValue}(\operatorname{TypePtr}(T,\ \texttt{Valid}),\ \mathsf{bits})\ \Leftrightarrow \ \mid \mathsf{bits}\mid \ =\ \mathsf{PtrSize}\ \land \ \mathsf{bits}\ \ne \ \operatorname{LEBytes}(0,\ \mathsf{PtrSize}) \\[0.16em]
\operatorname{ValidValue}(\operatorname{TypePtr}(T,\ \texttt{Null}),\ \mathsf{bits})\ \Leftrightarrow \ \mathsf{bits}\ =\ \operatorname{LEBytes}(0,\ \mathsf{PtrSize}) \\[0.16em]
\operatorname{ValidValue}(\operatorname{TypePtr}(T,\ \texttt{Expired}),\ \mathsf{bits})\ \Leftrightarrow \ \mid \mathsf{bits}\mid \ =\ \mathsf{PtrSize} \\[0.16em]
\operatorname{ValidValue}(\operatorname{TypePtr}(T,\ \bot ),\ \mathsf{bits})\ \Leftrightarrow \ \mid \mathsf{bits}\mid \ =\ \mathsf{PtrSize}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ValueBits}(\operatorname{TypePtr}(T,\ \texttt{Valid}),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ v\ =\ \operatorname{PtrVal}(\texttt{Valid},\ \mathsf{addr})\ \land \ \mathsf{addr}\ \ne \ 0\mathsf{x0}\ \land \ \mathsf{bits}\ =\ \operatorname{LEBytes}(\mathsf{addr},\ \mathsf{PtrSize}) \\[0.16em]
\operatorname{ValueBits}(\operatorname{TypePtr}(T,\ \texttt{Null}),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ v\ =\ \operatorname{PtrVal}(\texttt{Null},\ \mathsf{addr})\ \land \ \mathsf{addr}\ =\ 0\mathsf{x0}\ \land \ \mathsf{bits}\ =\ \operatorname{LEBytes}(\mathsf{addr},\ \mathsf{PtrSize}) \\[0.16em]
\operatorname{ValueBits}(\operatorname{TypePtr}(T,\ \texttt{Expired}),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ v\ =\ \operatorname{PtrVal}(\texttt{Expired},\ \mathsf{addr})\ \land \ \mathsf{bits}\ =\ \operatorname{LEBytes}(\mathsf{addr},\ \mathsf{PtrSize}) \\[0.16em]
\operatorname{ValueBits}(\operatorname{TypePtr}(T,\ \bot ),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ \exists \ s.\ s\ \in \ \mathsf{PtrStateSet}\ \land \ \operatorname{ValueBits}(\operatorname{TypePtr}(T,\ s),\ v)\ =\ \mathsf{bits}
\end{array}
$$

### 13.8.7 Diagnostics

Diagnostics are defined for dereference of safe pointers known statically to be in the `@Null` or `@Expired` states. `Ptr::null()` expression diagnostics are owned by §16.1.7.

## 13.9 Raw Pointer Types

### 13.9.1 Syntax

```text
raw_ptr_type ::= "*" ("imm" | "mut") type
```

### 13.9.2 Parsing

**(Parse-Raw-Pointer-Type)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"*"})\quad \operatorname{IsKw}(\operatorname{Tok}(\operatorname{Advance}(P)),\ q)\quad q\ \in \ \{\texttt{imm},\ \texttt{mut}\}\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ t) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseNonPermType}(P)\ \Downarrow \ (P_{1},\ \operatorname{TypeRawPtr}(q,\ t))
\end{array}
$$

### 13.9.3 AST Representation / Form

$$
\operatorname{TypeRawPtr}(\mathsf{qual},\ \mathsf{elem})\quad \mathsf{where}\ \mathsf{qual}\ \in \ \{\texttt{imm},\ \texttt{mut}\}
$$

### 13.9.4 Static Semantics

**(WF-RawPtr)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRawPtr}(q,\ T_{0})\quad \Gamma \ \vdash \ T_{0}\ \mathsf{wf} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}
\end{array}
$$

**(T-Deref-Raw)**

$$
\begin{array}{l}
\operatorname{UnsafeSpan}(\operatorname{span}(\operatorname{Deref}(e)))\quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypeRawPtr}(q,\ T)\quad \operatorname{BitcopyType}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Deref}(e)\ :\ T
\end{array}
$$

**(P-Deref-Raw-Imm)**

$$
\begin{array}{l}
\operatorname{UnsafeSpan}(\operatorname{span}(\operatorname{Deref}(e)))\quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypeRawPtr}(\texttt{imm},\ T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Deref}(e)\ :\mathsf{place}\ \operatorname{TypePerm}(\texttt{const},\ T)
\end{array}
$$

**(P-Deref-Raw-Mut)**

$$
\begin{array}{l}
\operatorname{UnsafeSpan}(\operatorname{span}(\operatorname{Deref}(e)))\quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypeRawPtr}(\texttt{mut},\ T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Deref}(e)\ :\mathsf{place}\ \operatorname{TypePerm}(\texttt{unique},\ T)
\end{array}
$$

**(Deref-Raw-Unsafe)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypeRawPtr}(q,\ T)\quad \lnot \ \operatorname{UnsafeSpan}(\operatorname{span}(\operatorname{Deref}(e)))\quad c\ =\ \operatorname{Code}(\mathsf{Deref}-\mathsf{Raw}-\mathsf{Unsafe}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Deref}(e)\ \Uparrow \ c
\end{array}
$$

### 13.9.5 Dynamic Semantics

$$
\operatorname{ValueType}(\operatorname{RawPtr}(q,\ \mathsf{addr}))\ =\ \operatorname{TypeRawPtr}(q,\ T)\ \Leftrightarrow \ T\ \in \ \mathsf{Type}
$$

**(ReadPtr-Raw)**

$$
\begin{array}{l}
v_{\mathsf{ptr}}\ =\ \operatorname{RawPtr}(q,\ \mathsf{addr})\quad \operatorname{ReadAddr}(\sigma ,\ \mathsf{addr})\ =\ v \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ReadPtrSigma}(v_{\mathsf{ptr}},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma )
\end{array}
$$

**(WritePtr-Raw)**

$$
\begin{array}{l}
v_{\mathsf{ptr}}\ =\ \operatorname{RawPtr}(\texttt{mut},\ \mathsf{addr})\quad \operatorname{WriteAddr}(\sigma ,\ \mathsf{addr},\ v)\ \Downarrow \ \sigma ' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{WritePtrSigma}(v_{\mathsf{ptr}},\ v,\ \sigma )\ \Downarrow \ (\mathsf{ok},\ \sigma ')
\end{array}
$$

**(ReadPtr-Raw-Invalid)**

$$
\begin{array}{l}
v_{\mathsf{ptr}}\ =\ \operatorname{RawPtr}(q,\ \mathsf{addr})\quad \operatorname{ReadAddr}(\sigma ,\ \mathsf{addr})\ \mathsf{undefined} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ReadPtrSigma}(v_{\mathsf{ptr}},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma )
\end{array}
$$

**(WritePtr-Raw-Imm)**

$$
\begin{array}{l}
v_{\mathsf{ptr}}\ =\ \operatorname{RawPtr}(\texttt{imm},\ \mathsf{addr}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{WritePtrSigma}(v_{\mathsf{ptr}},\ v,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma )
\end{array}
$$

**(WritePtr-Raw-Invalid)**

$$
\begin{array}{l}
v_{\mathsf{ptr}}\ =\ \operatorname{RawPtr}(\texttt{mut},\ \mathsf{addr})\quad \lnot \ \exists \ \sigma '.\ \operatorname{WriteAddr}(\sigma ,\ \mathsf{addr},\ v)\ \Downarrow \ \sigma ' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{WritePtrSigma}(v_{\mathsf{ptr}},\ v,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma )
\end{array}
$$

### 13.9.6 Lowering

**(Size-RawPtr)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRawPtr}(q,\ T_{0}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ \mathsf{PtrSize}
\end{array}
$$

**(Align-RawPtr)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRawPtr}(q,\ T_{0}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{PtrAlign}
\end{array}
$$

**(Layout-RawPtr)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRawPtr}(q,\ T_{0}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \langle \mathsf{PtrSize},\ \mathsf{PtrAlign}\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ValidValue}(\operatorname{TypeRawPtr}(q,\ T),\ \mathsf{bits})\ \Leftrightarrow \ \mid \mathsf{bits}\mid \ =\ \mathsf{PtrSize} \\[0.16em]
\operatorname{ValueBits}(\operatorname{TypeRawPtr}(q,\ T),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ v\ =\ \operatorname{RawPtr}(q,\ \mathsf{addr})\ \land \ \mathsf{bits}\ =\ \operatorname{LEBytes}(\mathsf{addr},\ \mathsf{PtrSize})
\end{array}
$$

Dereference lowering for raw pointers uses the shared `ReadPtrIR` and `WritePtrIR` operations. A raw dereference does not carry pointer-state metadata; invalid-address behavior is therefore observed only dynamically.

### 13.9.7 Diagnostics

Diagnostics are defined for dereference of raw pointers outside `unsafe`. Invalid raw-pointer reads and writes are runtime panic behavior rather than compile-time diagnostics.

## 13.10 Function Types

### 13.10.1 Syntax

```text
func_type       ::= "(" param_type_list? ")" "->" type
param_type_list ::= param_type ("," param_type)* ","?
param_type      ::= "move" type | type
```

Trailing commas in `param_type_list` are permitted only when `TrailingCommaAllowed` (§5.5). A trailing comma does not denote an additional parameter type.

### 13.10.2 Parsing

**(Parse-Func-Type)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseParamTypeList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{params})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{")"})\quad \operatorname{IsOp}(\operatorname{Tok}(\operatorname{Advance}(P_{1})),\ \texttt{"->"})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(\operatorname{Advance}(P_{1})))\ \Downarrow \ (P_{2},\ \mathsf{ret}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseNonPermType}(P)\ \Downarrow \ (P_{2},\ \operatorname{TypeFunc}(\mathsf{params},\ \mathsf{ret}))
\end{array}
$$

**(Parse-ParamType-Move)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{move})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{ty}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseParamType}(P)\ \Downarrow \ (P_{1},\ \langle \texttt{move},\ \mathsf{ty}\rangle )
\end{array}
$$

**(Parse-ParamType-Plain)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{move})\quad \Gamma \ \vdash \ \operatorname{ParseType}(P)\ \Downarrow \ (P_{1},\ \mathsf{ty}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseParamType}(P)\ \Downarrow \ (P_{1},\ \langle \bot ,\ \mathsf{ty}\rangle )
\end{array}
$$

**(Parse-ParamTypeList-Empty)**
IsPunc(Tok(P), ")")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseParamTypeList}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-ParamTypeList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseParamType}(P)\ \Downarrow \ (P_{1},\ \mathsf{pt})\quad \Gamma \ \vdash \ \operatorname{ParseParamTypeListTail}(P_{1},\ [\mathsf{pt}])\ \Downarrow \ (P_{2},\ \mathsf{pts}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseParamTypeList}(P)\ \Downarrow \ (P_{2},\ \mathsf{pts})
\end{array}
$$

**(Parse-ParamTypeListTail-End)**
IsPunc(Tok(P), ")")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseParamTypeListTail}(P,\ \mathsf{ps})\ \Downarrow \ (P,\ \mathsf{ps})
\end{array}
$$

**(Parse-ParamTypeListTail-TrailingComma)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{")"})\quad \operatorname{TrailingCommaAllowed}(P_{0},\ P,\ \{\operatorname{Punctuator}(\texttt{")"})\}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseParamTypeListTail}(P,\ \mathsf{ps})\ \Downarrow \ (\operatorname{Advance}(P),\ \mathsf{ps})
\end{array}
$$

**(Parse-ParamTypeListTail-Cons)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParseParamType}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{pt})\quad \Gamma \ \vdash \ \operatorname{ParseParamTypeListTail}(P_{1},\ \mathsf{ps}\ \mathbin{++} \ [\mathsf{pt}])\ \Downarrow \ (P_{2},\ \mathsf{ps}') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseParamTypeListTail}(P,\ \mathsf{ps})\ \Downarrow \ (P_{2},\ \mathsf{ps}')
\end{array}
$$

### 13.10.3 AST Representation / Form

$$
\operatorname{TypeFunc}([\langle \mathsf{mode}_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle \mathsf{mode}_{n},\ T_{n}\rangle ],\ R)
$$

### 13.10.4 Static Semantics

**(WF-Func)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeFunc}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ],\ R)\quad \Gamma \ \vdash \ R\ \mathsf{wf}\quad \forall \ i,\ \Gamma \ \vdash \ T_{i}\ \mathsf{wf} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}
\end{array}
$$

**(T-Equiv-Func)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeFunc}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ],\ R)\quad U\ =\ \operatorname{TypeFunc}([\langle m_{1},\ U_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ U_{n}\rangle ],\ S)\quad \forall \ i,\ \Gamma \ \vdash \ T_{i}\ \equiv \ U_{i}\quad \Gamma \ \vdash \ R\ \equiv \ S \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(Sub-Func)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeFunc}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ],\ R)\quad U\ =\ \operatorname{TypeFunc}([\langle m_{1},\ U_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ U_{n}\rangle ],\ S)\quad \forall \ i,\ \Gamma \ \vdash \ U_{i}\ \mathrel{<:} \ T_{i}\quad \Gamma \ \vdash \ R\ \mathrel{<:} \ S \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

**(T-Proc-As-Value)**

$$
\begin{array}{l}
\mathsf{procedure}\ \operatorname{f}(m_{1}\ x_{1}\ :\ T_{1},\ \ldots ,\ m_{n}\ x_{n}\ :\ T_{n})\ \to \ R\ \mathsf{declared} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ f\ :\ \operatorname{TypeFunc}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ],\ R)
\end{array}
$$

Call arity, argument typing, and callee-kind diagnostics for `TypeFunc` are owned by Chapter 16.

### 13.10.5 Dynamic Semantics

$$
\operatorname{FuncVal}(\mathsf{sym})\ \mathsf{defined}\ \Leftrightarrow \ \mathsf{sym}\ \in \ \mathsf{Symbol}
$$

**(EvalSigma-Call-Proc)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{callee},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{c}),\ \sigma_{1} )\quad \mathsf{proc}\ =\ \operatorname{CallTarget}(v_{c})\quad \Gamma \ \vdash \ \operatorname{EvalArgsSigma}(\mathsf{proc}.\mathsf{params},\ \mathsf{args},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{v}),\ \sigma_{2} )\quad \Gamma \ \vdash \ \operatorname{ApplyProcSigma}(\mathsf{proc},\ \mathsf{vec}_{v},\ \sigma_{2} )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Call}(\mathsf{callee},\ \mathsf{args}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} )
\end{array}
$$

Named procedures therefore denote first-class callable values of function type.

### 13.10.6 Lowering

**(Size-Func)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeFunc}(\mathsf{params},\ R) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ \mathsf{PtrSize}
\end{array}
$$

**(Align-Func)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeFunc}(\mathsf{params},\ R) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{PtrAlign}
\end{array}
$$

**(Layout-Func)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeFunc}(\mathsf{params},\ R) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \langle \mathsf{PtrSize},\ \mathsf{PtrAlign}\rangle 
\end{array}
$$

Function-type calls are lowered through the ordinary call-lowering and ABI rules of Chapters 16 and 23.

### 13.10.7 Diagnostics

This section introduces no additional diagnostics beyond the shared type well-formedness rules and the call-expression diagnostics owned by Chapter 16.

## 13.11 Closure Types

### 13.11.1 Syntax

```text
closure_type      ::= "|" param_type_list? "|" "->" type closure_deps_opt
closure_deps_opt  ::= epsilon | "[" "shared" ":" "{" shared_dep_list? "}" "]"
shared_dep_list   ::= shared_dep ("," shared_dep)*
shared_dep        ::= identifier ":" type
```

Within `closure_type`, if a parameter type has a top-level `union_type`, it MUST be parenthesized as `("(" type ")")`. This grouped form is permitted only to disambiguate closure parameter types and does not introduce a distinct type constructor.

### 13.11.2 Parsing

**(Parse-Closure-Type)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|"})\quad \Gamma \ \vdash \ \operatorname{ParseClosureParamTypeList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{params})\quad \operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{"|"})\quad \operatorname{IsOp}(\operatorname{Tok}(\operatorname{Advance}(P_{1})),\ \texttt{"->"})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(\operatorname{Advance}(P_{1})))\ \Downarrow \ (P_{2},\ \mathsf{ret})\quad \Gamma \ \vdash \ \operatorname{ParseClosureDepsOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{deps}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseNonPermType}(P)\ \Downarrow \ (P_{3},\ \operatorname{TypeClosure}(\mathsf{params},\ \mathsf{ret},\ \mathsf{deps}_{\mathsf{opt}}))
\end{array}
$$

**(Parse-Closure-Type-Empty)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|"})\quad \operatorname{IsOp}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"|"})\quad \operatorname{IsOp}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))),\ \texttt{"->"})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P))))\ \Downarrow \ (P_{1},\ \mathsf{ret})\quad \Gamma \ \vdash \ \operatorname{ParseClosureDepsOpt}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{deps}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseNonPermType}(P)\ \Downarrow \ (P_{2},\ \operatorname{TypeClosure}([],\ \mathsf{ret},\ \mathsf{deps}_{\mathsf{opt}}))
\end{array}
$$

**(Parse-ClosureParamType-Grouped)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{ty})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{")"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureParamType}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \mathsf{ty})
\end{array}
$$

**(Parse-ClosureParamType-Plain)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseTypeNoUnion}(P)\ \Downarrow \ (P_{1},\ \mathsf{ty}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureParamType}(P)\ \Downarrow \ (P_{1},\ \mathsf{ty})
\end{array}
$$

**(Parse-ClosureParamTypeList-Empty)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureParamTypeList}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-ClosureParamTypeList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseClosureParamType}(P)\ \Downarrow \ (P_{1},\ \mathsf{pt})\quad \Gamma \ \vdash \ \operatorname{ParseClosureParamTypeListTail}(P_{1},\ [\mathsf{pt}])\ \Downarrow \ (P_{2},\ \mathsf{pts}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureParamTypeList}(P)\ \Downarrow \ (P_{2},\ \mathsf{pts})
\end{array}
$$

**(Parse-ClosureParamTypeListTail-End)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureParamTypeListTail}(P,\ \mathsf{ps})\ \Downarrow \ (P,\ \mathsf{ps})
\end{array}
$$

**(Parse-ClosureParamTypeListTail-TrailingComma)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \operatorname{IsOp}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"|"})\quad \operatorname{TrailingCommaAllowed}(P_{0},\ P,\ \{\operatorname{Operator}(\texttt{"|"})\}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureParamTypeListTail}(P,\ \mathsf{ps})\ \Downarrow \ (\operatorname{Advance}(P),\ \mathsf{ps})
\end{array}
$$

**(Parse-ClosureParamTypeListTail-Comma)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParseClosureParamType}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{pt})\quad \Gamma \ \vdash \ \operatorname{ParseClosureParamTypeListTail}(P_{1},\ \mathsf{ps}\ \mathbin{++} \ [\mathsf{pt}])\ \Downarrow \ (P_{2},\ \mathsf{ps}') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureParamTypeListTail}(P,\ \mathsf{ps})\ \Downarrow \ (P_{2},\ \mathsf{ps}')
\end{array}
$$

**(Parse-ClosureDepsOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"["}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureDepsOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-ClosureDepsOpt-Some)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"["})\quad \operatorname{IsKw}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{shared})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))),\ \texttt{":"})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P)))),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseSharedDepList}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P)))))\ \Downarrow \ (P_{1},\ \mathsf{deps})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\}"})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P_{1})),\ \texttt{"]"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureDepsOpt}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P_{1})),\ \langle \mathsf{deps}\rangle )
\end{array}
$$

**(Parse-SharedDepList-Empty)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseSharedDepList}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-SharedDepList-Single)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseSharedDep}(P)\ \Downarrow \ (P_{1},\ \mathsf{dep})\quad \lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{","}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseSharedDepList}(P)\ \Downarrow \ (P_{1},\ [\mathsf{dep}])
\end{array}
$$

**(Parse-SharedDepList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseSharedDep}(P)\ \Downarrow \ (P_{1},\ \mathsf{dep})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParseSharedDepList}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{deps}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseSharedDepList}(P)\ \Downarrow \ (P_{2},\ [\mathsf{dep}]\ \mathbin{++} \ \mathsf{deps})
\end{array}
$$

**(Parse-SharedDep)**

$$
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \mathsf{name}\ =\ \operatorname{Lexeme}(\operatorname{Tok}(P))\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ \mathsf{ty}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseSharedDep}(P)\ \Downarrow \ (P_{1},\ \langle \mathsf{name},\ \mathsf{ty}\rangle )
\end{array}
$$

### 13.11.3 AST Representation / Form

$$
\mathsf{Type}\ =\ \ldots \ \mid \ \operatorname{TypeClosure}(\mathsf{params},\ \mathsf{ret},\ \mathsf{deps}_{\mathsf{opt}})\ \mid \ \ldots 
$$

$$
\mathsf{deps}_{\mathsf{opt}}\ =\ \bot \ \lor \ \mathsf{deps}_{\mathsf{opt}}\ =\ \langle [\langle \mathsf{name}_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle \mathsf{name}_{n},\ T_{n}\rangle ]\rangle 
$$

Closure expressions, capture classification, closure invocation, and pipeline expressions are owned by §16.9. Chapter 19 consumes the dependency information carried by `TypeClosure(..., deps_opt)`.

### 13.11.4 Static Semantics

**(WF-Closure)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeClosure}(\mathsf{params},\ R,\ \mathsf{deps}_{\mathsf{opt}})\quad \forall \ \langle m,\ T_{i}\rangle \ \in \ \mathsf{params},\ \Gamma \ \vdash \ T_{i}\ \mathsf{wf}\quad \Gamma \ \vdash \ R\ \mathsf{wf}\quad (\mathsf{deps}_{\mathsf{opt}}\ =\ \bot \ \lor \ \forall \ d\ \in \ \mathsf{deps}_{\mathsf{opt}},\ \Gamma \ \vdash \ \operatorname{TypeOf}(d)\ \mathsf{wf}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}
\end{array}
$$

**(T-Equiv-Closure)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeClosure}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ],\ R,\ D)\quad U\ =\ \operatorname{TypeClosure}([\langle m_{1},\ U_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ U_{n}\rangle ],\ S,\ D)\quad \forall \ i,\ \Gamma \ \vdash \ T_{i}\ \equiv \ U_{i}\quad \Gamma \ \vdash \ R\ \equiv \ S \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(Sub-Closure)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeClosure}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ],\ R,\ D)\quad U\ =\ \operatorname{TypeClosure}([\langle m_{1},\ U_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ U_{n}\rangle ],\ S,\ D)\quad \forall \ i,\ \Gamma \ \vdash \ U_{i}\ \mathrel{<:} \ T_{i}\quad \Gamma \ \vdash \ R\ \mathrel{<:} \ S \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

Closure-expression typing and dependency-set construction are defined in §16.9.4.

### 13.11.5 Dynamic Semantics

$$
\operatorname{ClosureVal}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{code}_{\mathsf{ptr}})\ \mathsf{defined}\ \Leftrightarrow \ (\mathsf{env}_{\mathsf{ptr}}\ =\ \mathsf{null}\ \lor \ \mathsf{env}_{\mathsf{ptr}}\ \in \ \mathsf{Addr})\ \land \ \mathsf{code}_{\mathsf{ptr}}\ \in \ \mathsf{Symbol}
$$

Creation and invocation of closure values are defined in §16.9.5. Key acquisition for closures that capture `shared` bindings is defined in Chapter 19 and depends on the dependency set carried by `TypeClosure(..., deps_opt)`.

### 13.11.6 Lowering

$$
\mathsf{ClosureRep}\ =\ \langle \mathsf{env}_{\mathsf{ptr}}:\ *\mathsf{imm}\ \mathsf{u8},\ \mathsf{code}_{\mathsf{ptr}}:\ *\mathsf{imm}\ \mathsf{u8}\rangle 
$$

**(Size-Closure)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeClosure}(\mathsf{params},\ R,\ \mathsf{deps}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ 2\ \times \ \mathsf{PtrSize}
\end{array}
$$

**(Align-Closure)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeClosure}(\mathsf{params},\ R,\ \mathsf{deps}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{PtrAlign}
\end{array}
$$

**(Layout-Closure)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeClosure}(\mathsf{params},\ R,\ \mathsf{deps}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \langle 2\ \times \ \mathsf{PtrSize},\ \mathsf{PtrAlign}\rangle 
\end{array}
$$

Closure-expression lowering, closure environment layout, and captured-variable access lowering are defined in §16.9.6.

### 13.11.7 Diagnostics

This section defines no additional named diagnostics beyond failures of closure-type parsing and well-formedness. Closure capture diagnostics are owned by §16.9.7; shared-dependency and closure-key diagnostics are owned by Chapter 19; spawn-body closure diagnostics are owned by Chapter 20.

## 13.12 Modal and Pointer Diagnostics Supplement

This section owns diagnostics for modal-state usage, modal widening, and pointer operations.

| Code         | Severity | Detection    | Condition                                                                                                                |
| ------------ | -------- | ------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `E-TYP-2050` | Error    | Compile-time | Modal type declares zero states                                                                                          |
| `E-TYP-2051` | Error    | Compile-time | Duplicate state name within modal type                                                                                   |
| `E-TYP-2052` | Error    | Compile-time | Field access for field not present in current state's payload                                                            |
| `E-TYP-2053` | Error    | Compile-time | Method invocation for method not available in current state                                                              |
| `E-TYP-2054` | Error    | Compile-time | State name collides with modal type name                                                                                 |
| `E-TYP-2055` | Error    | Compile-time | Transition body returns value not matching declared target state                                                         |
| `E-TYP-2056` | Error    | Compile-time | Transition invoked on value not of declared source state                                                                 |
| `E-TYP-2057` | Error    | Compile-time | Direct field access on general modal type without pattern matching                                                       |
| `E-TYP-2058` | Error    | Compile-time | Duplicate field name in modal state payload                                                                              |
| `E-TYP-2059` | Error    | Compile-time | Transition target state not declared in modal type                                                                       |
| `E-TYP-2060` | Error    | Compile-time | Non-exhaustive `if ... is { ... }` on general modal type                                                                 |
| `E-TYP-2061` | Error    | Compile-time | Duplicate method name in modal state                                                                                     |
| `E-TYP-2062` | Error    | Compile-time | Duplicate transition name in modal state                                                                                 |
| `E-TYP-2063` | Error    | Compile-time | State member visibility exceeds modal visibility                                                                         |
| `E-TYP-2064` | Error    | Compile-time | State member not visible in current scope                                                                                |
| `E-TYP-2065` | Error    | Compile-time | State method name conflicts with transition name in the same modal state                                                 |
| `E-TYP-2070` | Error    | Compile-time | Implicit widening on non-niche-layout-compatible type                                                                    |
| `E-TYP-2071` | Error    | Compile-time | `widen` applied to non-modal type                                                                                        |
| `E-TYP-2072` | Error    | Compile-time | `widen` applied to already-general modal type                                                                            |
| `E-TYP-2073` | Error    | Compile-time | Record literal whose type is `File@S`, `DirIter@S`, or `CancelToken@S` for any state `S` in the corresponding modal type |
| `W-SYS-4010` | Warning  | Compile-time | Modal widening involves large payload copy (>256 bytes)                                                                  |
| `E-TYP-2101` | Error    | Compile-time | Dereference of pointer in `@Null` state                                                                                  |
| `E-TYP-2102` | Error    | Compile-time | Dereference of pointer in `@Expired` state                                                                               |
| `E-TYP-2103` | Error    | Compile-time | Dereference of raw pointer outside `unsafe`                                                                              |
| `E-TYP-2104` | Error    | Compile-time | Address-of applied to non-place expression                                                                               |
