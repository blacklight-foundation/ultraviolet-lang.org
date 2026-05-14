---
title: "13.4 Transitions"
description: "13.4 Transitions from 13. Modal and Special Types of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "modal-and-special-types"
specSection: "134-transitions"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/modal-and-special-types/">13. Modal and Special Types</a>
  <span>Modal and Special Types</span>
</div>

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
