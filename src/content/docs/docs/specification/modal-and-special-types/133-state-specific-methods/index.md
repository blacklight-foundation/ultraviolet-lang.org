---
title: "13.3 State-Specific Methods"
description: "13.3 State-Specific Methods from 13. Modal and Special Types of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "modal-and-special-types"
specSection: "133-state-specific-methods"
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
\operatorname{MethodTarget}(\operatorname{RecordValue}(\operatorname{ModalStateRef}(\mathsf{modal}_{\mathsf{ref}},\ S),\ \mathsf{io}),\ \mathsf{name})\ =\ \mathsf{md}\ \Leftrightarrow \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ \operatorname{LookupStateMethod}(M,\ S,\ \mathsf{name})\ =\ \mathsf{md}
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
