---
title: "15.2 Methods and Receivers"
description: "15.2 Methods and Receivers from 15. Procedures and Contracts of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "procedures-and-contracts"
specSection: "152-methods-and-receivers"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/procedures-and-contracts/">15. Procedures and Contracts</a>
  <span>Procedures and Contracts</span>
</div>

## 15.2 Methods and Receivers

### 15.2.1 Syntax

```text
method_def              ::= visibility? "override"? "procedure" identifier generic_params? "(" receiver ("," param_list)? ")" ("->" type)? contract_clause? block_expr
receiver                ::= "~" | "~!" | "~%" | ("move"? "self" ":" type)
state_method_signature  ::= "(" receiver ("," param_list)? ")" ("->" type)?
```

Class methods and state-specific methods reuse the same receiver and parameter forms. Class-owned additions are in §14.3; modal-state additions are in §13.3.

### 15.2.2 Parsing

**(Parse-MethodDefAfterVis)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseOverrideOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{ov})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{0}),\ \texttt{procedure})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{0}))\ \Downarrow \ (P_{1},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseGenericParamsOpt}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseMethodSignature}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{receiver},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseContractClauseOpt}(P_{3})\ \Downarrow \ (P_{4},\ \mathsf{contract}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(P_{4})\ \Downarrow \ (P_{5},\ \mathsf{body}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseMethodDefAfterVis}(P,\ \mathsf{vis},\ \mathsf{attrs}_{\mathsf{opt}})\ \Downarrow \ (P_{5},\ \langle \mathsf{MethodDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{ov},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{receiver},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \operatorname{SpanBetween}(P,\ P_{5}),\ []\rangle )
\end{array}
$$

**(Parse-Override-Yes)**
IsKw(Tok(P), `override`)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseOverrideOpt}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \mathsf{true})
\end{array}
$$

**(Parse-Override-No)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{override}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseOverrideOpt}(P)\ \Downarrow \ (P,\ \mathsf{false})
\end{array}
$$

**(Parse-MethodSignature)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseReceiver}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ r)\quad \Gamma \ \vdash \ \operatorname{ParseMethodParams}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{params})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{")"})\quad \Gamma \ \vdash \ \operatorname{ParseReturnOpt}(\operatorname{Advance}(P_{2}))\ \Downarrow \ (P_{3},\ \mathsf{ret}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseMethodSignature}(P)\ \Downarrow \ (P_{3},\ r,\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}})
\end{array}
$$

**(Parse-StateMethodSignature-Receiver)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseReceiver}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ r)\quad \Gamma \ \vdash \ \operatorname{ParseMethodParams}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{params})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{")"})\quad \Gamma \ \vdash \ \operatorname{ParseReturnOpt}(\operatorname{Advance}(P_{2}))\ \Downarrow \ (P_{3},\ \mathsf{ret}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStateMethodSignature}(P)\ \Downarrow \ (P_{3},\ r,\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}})
\end{array}
$$

**(Parse-MethodParams-None)**
IsPunc(Tok(P), ")")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseMethodParams}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-MethodParams-Comma)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParseParamList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{params}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseMethodParams}(P)\ \Downarrow \ (P_{1},\ \mathsf{params})
\end{array}
$$

**(Parse-Receiver-Short-Const)**
IsOp(Tok(P), "~")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseReceiver}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \operatorname{ReceiverShorthand}(\texttt{const}))
\end{array}
$$

**(Parse-Receiver-Short-Unique)**
IsOp(Tok(P), "~!")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseReceiver}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \operatorname{ReceiverShorthand}(\texttt{unique}))
\end{array}
$$

**(Parse-Receiver-Short-Shared)**
IsOp(Tok(P), "~%")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseReceiver}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \operatorname{ReceiverShorthand}(\texttt{shared}))
\end{array}
$$

**(Parse-Receiver-Explicit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseParamModeOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{mode})\quad \operatorname{IsIdent}(\operatorname{Tok}(P_{1}))\quad \operatorname{Lexeme}(\operatorname{Tok}(P_{1}))\ =\ \texttt{self}\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P_{1})),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(\operatorname{Advance}(P_{1})))\ \Downarrow \ (P_{2},\ \mathsf{ty}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseReceiver}(P)\ \Downarrow \ (P_{2},\ \operatorname{ReceiverExplicit}(\mathsf{mode},\ \mathsf{ty}))
\end{array}
$$

### 15.2.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{MethodDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{override},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{receiver},\ \mathsf{params},\ \mathsf{return}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}\rangle  \\[0.16em]
\mathsf{Receiver}\ \in \ \{\operatorname{ReceiverShorthand}(\mathsf{perm}),\ \operatorname{ReceiverExplicit}(\mathsf{mode},\ \mathsf{type})\} \\[0.16em]
\mathsf{perm}\ \in \ \{\texttt{const},\ \texttt{unique},\ \texttt{shared}\} \\[0.16em]
\mathsf{mode}\ \in \ \{\texttt{move},\ \bot \}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Fields}(R)\ =\ [\ f\ \mid \ f\ \in \ R.\mathsf{members}\ \land \ f\ \mathsf{is}\ \mathsf{FieldDecl}\ ] \\[0.16em]
\operatorname{Methods}(R)\ =\ [\ m\ \mid \ m\ \in \ R.\mathsf{members}\ \land \ m\ \mathsf{is}\ \mathsf{MethodDecl}\ ] \\[0.16em]
\mathsf{Self}_{R}\ =\ \operatorname{TypePath}(\operatorname{RecordPath}(R))
\end{array}
$$

$$
\operatorname{SelfType}(R,\ \mathsf{ty})\ \Leftrightarrow \ \mathsf{ty}\ =\ \mathsf{Self}_{R}\ \lor \ \exists \ p.\ \mathsf{ty}\ =\ \operatorname{TypePerm}(p,\ \mathsf{Self}_{R})
$$

$$
\begin{array}{l}
\operatorname{RecvType}(T,\ \operatorname{ReceiverShorthand}(\texttt{const}))\ =\ \operatorname{TypePerm}(\texttt{const},\ T) \\[0.16em]
\operatorname{RecvType}(T,\ \operatorname{ReceiverShorthand}(\texttt{unique}))\ =\ \operatorname{TypePerm}(\texttt{unique},\ T) \\[0.16em]
\operatorname{RecvType}(T,\ \operatorname{ReceiverShorthand}(\texttt{shared}))\ =\ \operatorname{TypePerm}(\texttt{shared},\ T) \\[0.16em]
\operatorname{RecvType}(T,\ \operatorname{ReceiverExplicit}(\mathsf{mode},\ \mathsf{ty}))\ =\ \operatorname{SubstSelf}(T,\ \mathsf{ty})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{RecvMode}(\operatorname{ReceiverShorthand}(\_))\ =\ \bot  \\[0.16em]
\operatorname{RecvMode}(\operatorname{ReceiverExplicit}(\mathsf{mode},\ \_))\ =\ \mathsf{mode}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{PermOf}(\operatorname{TypePerm}(p,\ \_))\ =\ p \\[0.16em]
\operatorname{PermOf}(\mathsf{ty})\ =\ \texttt{const}\quad \mathsf{otherwise} \\[0.16em]
\operatorname{RecvPerm}(T,\ r)\ =\ \operatorname{PermOf}(\operatorname{RecvType}(T,\ r))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ParamSig_T}(T,\ \mathsf{params})\ =\ [\langle \mathsf{mode},\ \operatorname{SubstSelf}(T,\ \mathsf{ty})\rangle \ \mid \ \langle \mathsf{mode},\ \mathsf{name},\ \mathsf{ty}\rangle \ \in \ \mathsf{params}] \\[0.16em]
\operatorname{ParamBinds_T}(T,\ \mathsf{params})\ =\ [\langle x_{1},\ \operatorname{SubstSelf}(T,\ T_{1})\rangle ,\ \ldots ,\ \langle x_{n},\ \operatorname{SubstSelf}(T,\ T_{n})\rangle ] \\[0.16em]
\operatorname{ReturnType_T}(T,\ m)\ =\ \operatorname{SubstSelf}(T,\ \operatorname{ReturnType}(m)) \\[0.16em]
\operatorname{Sig_T}(T,\ m)\ =\ \langle \operatorname{RecvType}(T,\ m.\mathsf{receiver}),\ \operatorname{ParamSig_T}(T,\ m.\mathsf{params}),\ \operatorname{SubstSelf}(T,\ \operatorname{ReturnType}(m))\rangle  \\[0.16em]
\operatorname{MethodParamsDecl}(T,\ m)\ =\ [\langle \operatorname{RecvMode}(m.\mathsf{receiver}),\ \texttt{self},\ \operatorname{RecvType}(T,\ m.\mathsf{receiver})\rangle ]\ \mathbin{++} \ m.\mathsf{params}
\end{array}
$$

### 15.2.4 Static Semantics

**(Recv-Explicit)**
SelfType(R, ty)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ReceiverExplicit}(\mathsf{mode},\ \mathsf{ty})\ :\ \operatorname{Recv}(R,\ \operatorname{PermOf}(\mathsf{ty}),\ \mathsf{mode})
\end{array}
$$

**(Record-Method-RecvSelf-Err)**

$$
\begin{array}{l}
\lnot \ \operatorname{SelfType}(R,\ \mathsf{ty}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ReceiverExplicit}(\mathsf{mode},\ \mathsf{ty})\ \Uparrow 
\end{array}
$$

**(Recv-Const)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ReceiverShorthand}(\texttt{const})\ :\ \operatorname{Recv}(R,\ \texttt{const},\ \bot )
\end{array}
$$

**(Recv-Unique)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ReceiverShorthand}(\texttt{unique})\ :\ \operatorname{Recv}(R,\ \texttt{unique},\ \bot )
\end{array}
$$

**(Recv-Shared)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ReceiverShorthand}(\texttt{shared})\ :\ \operatorname{Recv}(R,\ \texttt{shared},\ \bot )
\end{array}
$$

**(WF-Record-Method)**

$$
\begin{array}{l}
\mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \mathsf{params}_{\mathsf{gen}}\ =\ [P_{1},\ \ldots ,\ P_{n}]\quad \Gamma \ \vdash \ \langle P_{1};\ \ldots ;\ P_{n}\rangle \ \mathsf{wf}\quad \Gamma_{m} \ =\ \operatorname{BindTypeParams}(\Gamma ,\ \mathsf{params}_{\mathsf{gen}})\quad \Gamma_{m} \ \vdash \ r\ :\ \operatorname{Recv}(R,\ P,\ \mathsf{mode})\quad \mathsf{self}\ \notin \ \operatorname{ParamNames}(\mathsf{params})\quad \operatorname{Distinct}(\operatorname{ParamNames}(\mathsf{params}))\quad \forall \ \langle \_,\ \_,\ T_{i}\rangle \ \in \ \mathsf{params},\ \Gamma_{m} \ \vdash \ T_{i}\ \mathsf{wf}\quad (\mathsf{return}_{\mathsf{type}\_\mathsf{opt}}\ =\ \bot \ \lor \ \Gamma_{m} \ \vdash \ \mathsf{return}_{\mathsf{type}\_\mathsf{opt}}\ \mathsf{wf}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \langle \mathsf{MethodDecl},\ \_,\ \_,\ \_,\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ r,\ \mathsf{params},\ \mathsf{return}_{\mathsf{type}\_\mathsf{opt}},\ \_,\ \mathsf{body},\ \_,\ \_\rangle \ :\ \operatorname{MethodOK}(R,\ P,\ \mathsf{mode})
\end{array}
$$

**(T-Record-Method-Body)**

$$
\begin{array}{l}
\Gamma \ \vdash \ m\ :\ \operatorname{MethodOK}(R,\ P,\ \mathsf{mode})\quad T_{\mathsf{self}}\ =\ \operatorname{RecvType}(\mathsf{Self}_{R},\ m.\mathsf{receiver})\quad R_{m}\ =\ \operatorname{ReturnType_T}(\mathsf{Self}_{R},\ m)\quad R_{b}\ =\ \operatorname{BodyReturnType}(R_{m})\quad \Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \operatorname{IntroAll}(\Gamma_{0} ,\ [\langle \texttt{self},\ T_{\mathsf{self}}\rangle ]\ \mathbin{++} \ \operatorname{ParamBinds_T}(\mathsf{Self}_{R},\ m.\mathsf{params}))\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} ;\ R_{m};\ \bot \ \vdash \ m.\mathsf{body}\ :\ T_{b}\quad \Gamma \ \vdash \ T_{b}\ \mathrel{<:} \ R_{b}\quad (R_{b}\ \ne \ \operatorname{TypePrim}(\texttt{"()"})\ \Rightarrow \ \operatorname{ExplicitReturn}(m.\mathsf{body})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ m\ :\ \operatorname{MethodBodyOK}(R)
\end{array}
$$

**(WF-Record-Methods)**

$$
\begin{array}{l}
\operatorname{Distinct}(\operatorname{MethodNames}(R))\quad \forall \ m\ \in \ \operatorname{Methods}(R),\ \Gamma \ \vdash \ m\ :\ \operatorname{MethodOK}(R,\ \_,\ \_)\quad \Gamma \ \vdash \ m\ :\ \operatorname{MethodBodyOK}(R) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Methods}(R)\ :\ \mathsf{ok}
\end{array}
$$

**(Record-Method-Dup)**

$$
\begin{array}{l}
\lnot \ \operatorname{Distinct}(\operatorname{MethodNames}(R)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Methods}(R)\ \Uparrow 
\end{array}
$$

$$
\mathsf{ArgsOkJudg}\ =\ \{\Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk}(\mathsf{params},\ \mathsf{args})\}
$$

$$
\operatorname{RecvBaseType}(\mathsf{base},\ \mathsf{mode})\ =\ P\ T\ \Leftrightarrow \ (\mathsf{mode}\ =\ \bot \ \land \ \Gamma ;\ R;\ L\ \vdash \ \operatorname{RefArgExpr}(\mathsf{base})\ :\mathsf{place}\ P\ T)\ \lor \ (\mathsf{mode}\ =\ \texttt{move}\ \land \ \Gamma ;\ R;\ L\ \vdash \ \mathsf{base}\ :\ P\ T)
$$

**(Args-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk}([],\ [])
\end{array}
$$

**(Args-Cons)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \operatorname{ConsumeArgExpr}(\texttt{move},\ \mathsf{pass},\ e)\ \Leftarrow \ T_{p}\ \dashv \ \emptyset \quad \mathsf{pass}\ \in \ \{\texttt{move},\ \texttt{copy}\}\quad \Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk}(\mathsf{ps},\ \mathsf{as}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk}([\langle \texttt{move},\ x,\ T_{p}\rangle ]\ \mathbin{++} \ \mathsf{ps},\ [\langle \mathsf{pass},\ e,\ \_\rangle ]\ \mathbin{++} \ \mathsf{as})
\end{array}
$$

**(Args-Cons-Ref)**

$$
\begin{array}{l}
\operatorname{RefArgOk}(\mathsf{pass},\ e,\ T_{p})\quad \Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk}(\mathsf{ps},\ \mathsf{as}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk}([\langle \bot ,\ x,\ T_{p}\rangle ]\ \mathbin{++} \ \mathsf{ps},\ [\langle \mathsf{pass},\ e,\ \_\rangle ]\ \mathbin{++} \ \mathsf{as})
\end{array}
$$

$$
\operatorname{RecvArgOk}(\mathsf{base},\ \mathsf{mode})\ \Leftrightarrow \ (\mathsf{mode}\ =\ \bot \ \land \ \operatorname{AddrOfOk}(\operatorname{RefArgExpr}(\mathsf{base})))\ \lor \ (\mathsf{mode}\ =\ \texttt{move}\ \land \ \exists \ p.\ \mathsf{base}\ =\ \operatorname{MoveExpr}(p))
$$

**(T-Record-MethodCall)**

$$
\begin{array}{l}
\operatorname{RecvBaseType}(\mathsf{base},\ \operatorname{RecvMode}(m.\mathsf{receiver}))\ =\ P_{\mathsf{caller}}\ R_{\mathsf{rec}}\quad \operatorname{LookupMethod}(R_{\mathsf{rec}},\ \mathsf{name})\ =\ m\quad \operatorname{RecvPerm}(R_{\mathsf{rec}},\ m.\mathsf{receiver})\ =\ P_{\mathsf{method}}\quad \operatorname{PermAdmits}(P_{\mathsf{caller}},\ P_{\mathsf{method}})\quad \operatorname{RecvArgOk}(\mathsf{base},\ \operatorname{RecvMode}(m.\mathsf{receiver}))\quad \Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk}(m.\mathsf{params},\ \mathsf{args}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{MethodCall}(\mathsf{base},\ \mathsf{name},\ \mathsf{args})\ :\ \operatorname{ReturnType}(m)
\end{array}
$$

Class and state-method owners (§14.3 and §13.3) add receiver restrictions specific to `Self` and modal-state receivers, but reuse these common receiver and argument-passing forms.

### 15.2.5 Dynamic Semantics

$$
\begin{array}{l}
\operatorname{RecvArgMode}(\mathsf{base})\ =\ \texttt{move}\ \Leftrightarrow \ \exists \ p.\ \mathsf{base}\ =\ \operatorname{MoveExpr}(p) \\[0.16em]
\operatorname{RecvArgMode}(\mathsf{base})\ =\ \bot \ \Leftrightarrow \ \lnot \ \exists \ p.\ \mathsf{base}\ =\ \operatorname{MoveExpr}(p) \\[0.16em]
\operatorname{MethodOf}(\mathsf{base},\ \mathsf{name})\ =\ \mathsf{md}\ \Leftrightarrow \ \operatorname{StripPerm}(\operatorname{ExprType}(\mathsf{base}))\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\ \land \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ \operatorname{LookupStateMethod}(M,\ S,\ \mathsf{name})\ =\ \mathsf{md} \\[0.16em]
\operatorname{MethodOf}(\mathsf{base},\ \mathsf{name})\ =\ \mathsf{tr}\ \Leftrightarrow \ \operatorname{StripPerm}(\operatorname{ExprType}(\mathsf{base}))\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\ \land \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ \operatorname{LookupTransition}(M,\ S,\ \mathsf{name})\ =\ \mathsf{tr} \\[0.16em]
\operatorname{MethodOf}(\mathsf{base},\ \mathsf{name})\ =\ m\ \Leftrightarrow \ \operatorname{LookupMethod}(\operatorname{StripPerm}(\operatorname{ExprType}(\mathsf{base})),\ \mathsf{name})\ =\ m \\[0.16em]
\operatorname{RecvBase}(\mathsf{base},\ \mathsf{name})\ =\ T\ \Leftrightarrow \ \operatorname{MethodOf}(\mathsf{base},\ \mathsf{name})\ =\ m\ \land \ T\ =\ \operatorname{StripPerm}(\operatorname{ExprType}(\mathsf{base}))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{RecvParams}(\mathsf{base},\ \mathsf{name})\ =\ \operatorname{StateMethodParams}(M,\ S,\ \mathsf{md})\ \Leftrightarrow \ \operatorname{StripPerm}(\operatorname{ExprType}(\mathsf{base}))\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\ \land \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ \operatorname{LookupStateMethod}(M,\ S,\ \mathsf{name})\ =\ \mathsf{md} \\[0.16em]
\operatorname{RecvParams}(\mathsf{base},\ \mathsf{name})\ =\ \operatorname{TransitionParams}(M,\ S,\ \mathsf{tr})\ \Leftrightarrow \ \operatorname{StripPerm}(\operatorname{ExprType}(\mathsf{base}))\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\ \land \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ \operatorname{LookupTransition}(M,\ S,\ \mathsf{name})\ =\ \mathsf{tr} \\[0.16em]
\operatorname{RecvParams}(\mathsf{base},\ \mathsf{name})\ =\ [\langle \operatorname{RecvMode}(m.\mathsf{receiver}),\ \texttt{self},\ \operatorname{RecvType}(T,\ m.\mathsf{receiver})\rangle ]\ \mathbin{++} \ m.\mathsf{params}\ \Leftrightarrow \ \operatorname{LookupMethod}(\operatorname{StripPerm}(\operatorname{ExprType}(\mathsf{base})),\ \mathsf{name})\ =\ m\ \land \ T\ =\ \operatorname{StripPerm}(\operatorname{ExprType}(\mathsf{base}))
\end{array}
$$

**(EvalRecvSigma-Move)**

$$
\begin{array}{l}
\mathsf{mode}\ =\ \texttt{move}\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{base},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{self}}),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalRecvSigma}(\mathsf{base},\ \mathsf{mode},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\langle v_{\mathsf{self}},\ v_{\mathsf{self}}\rangle ),\ \sigma_{1} )
\end{array}
$$

**(EvalRecvSigma-Ref-Dyn)**

$$
\begin{array}{l}
\mathsf{mode}\ =\ \bot \quad \Gamma \ \vdash \ \operatorname{AddrOfSigma}(\operatorname{RefArgExpr}(\mathsf{base}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{addr}),\ \sigma_{1} )\quad \operatorname{ReadAddr}(\sigma_{1} ,\ \mathsf{addr})\ =\ \operatorname{Dyn}(\mathsf{Cl},\ \operatorname{RawPtr}(\texttt{imm},\ \mathsf{addr}_{d}),\ T)\quad \operatorname{DynAddrState}(\sigma_{1} ,\ \mathsf{addr}_{d})\ =\ \texttt{Valid} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalRecvSigma}(\mathsf{base},\ \mathsf{mode},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\langle \operatorname{Dyn}(\mathsf{Cl},\ \operatorname{RawPtr}(\texttt{imm},\ \mathsf{addr}_{d}),\ T),\ \operatorname{Alias}(\mathsf{addr}_{d})\rangle ),\ \sigma_{1} )
\end{array}
$$

**(EvalRecvSigma-Ref-Dyn-Expired)**

$$
\begin{array}{l}
\mathsf{mode}\ =\ \bot \quad \Gamma \ \vdash \ \operatorname{AddrOfSigma}(\operatorname{RefArgExpr}(\mathsf{base}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{addr}),\ \sigma_{1} )\quad \operatorname{ReadAddr}(\sigma_{1} ,\ \mathsf{addr})\ =\ \operatorname{Dyn}(\mathsf{Cl},\ \operatorname{RawPtr}(\texttt{imm},\ \mathsf{addr}_{d}),\ T)\quad \operatorname{DynAddrState}(\sigma_{1} ,\ \mathsf{addr}_{d})\ =\ \texttt{Expired} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalRecvSigma}(\mathsf{base},\ \mathsf{mode},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma_{1} )
\end{array}
$$

**(EvalRecvSigma-Ref)**

$$
\begin{array}{l}
\mathsf{mode}\ =\ \bot \quad \Gamma \ \vdash \ \operatorname{AddrOfSigma}(\operatorname{RefArgExpr}(\mathsf{base}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{addr}),\ \sigma_{1} )\quad \operatorname{ReadAddr}(\sigma_{1} ,\ \mathsf{addr})\ =\ v_{\mathsf{self}}\quad \lnot \ (\exists \ \mathsf{Cl},\ \mathsf{addr}_{d},\ T.\ v_{\mathsf{self}}\ =\ \operatorname{Dyn}(\mathsf{Cl},\ \operatorname{RawPtr}(\texttt{imm},\ \mathsf{addr}_{d}),\ T)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalRecvSigma}(\mathsf{base},\ \mathsf{mode},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\langle v_{\mathsf{self}},\ \operatorname{Alias}(\mathsf{addr})\rangle ),\ \sigma_{1} )
\end{array}
$$

**(EvalRecvSigma-Ctrl-Move)**

$$
\begin{array}{l}
\mathsf{mode}\ =\ \texttt{move}\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{base},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalRecvSigma}(\mathsf{base},\ \mathsf{mode},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(EvalRecvSigma-Ctrl-Ref)**

$$
\begin{array}{l}
\mathsf{mode}\ =\ \bot \quad \Gamma \ \vdash \ \operatorname{AddrOfSigma}(\operatorname{RefArgExpr}(\mathsf{base}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalRecvSigma}(\mathsf{base},\ \mathsf{mode},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

$$
\operatorname{BindParams}(m,\ v_{\mathsf{self}},\ \mathsf{vecv})\ =\ \{\texttt{self}\ \mapsto \ v_{\mathsf{self}}\}\ \cup \ \{\ x_{i}\ \mapsto \ v_{i}\ \mid \ m.\mathsf{params}\ =\ [\langle \_,\ x_{i},\ \_\rangle ],\ \mathsf{vecv}\ =\ [v_{i}]\ \}
$$

**(ApplyMethodSigma-Prim)**

$$
\begin{array}{l}
m\ =\ \operatorname{MethodTarget}(v_{\mathsf{self}},\ \mathsf{name})\quad \operatorname{MethodOwner}(m)\ =\ \mathsf{owner}\quad \operatorname{MethodName}(m)\ =\ \mathsf{name}\quad \Gamma \ \vdash \ \operatorname{PrimCall}(\mathsf{owner},\ \mathsf{name},\ v_{\mathsf{self}},\ \mathsf{vec}_{v})\ \Downarrow \ \mathsf{out} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ApplyMethodSigma}(\mathsf{base},\ \mathsf{name},\ v_{\mathsf{self}},\ v_{\mathsf{arg}},\ \mathsf{vec}_{v},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma )
\end{array}
$$

**(ApplyMethodSigma)**

$$
\begin{array}{l}
m\ =\ \operatorname{MethodTarget}(v_{\mathsf{self}},\ \mathsf{name})\quad \lnot \operatorname{IsTransition}(m)\quad \operatorname{BindParams}(\operatorname{RecvParams}(\mathsf{base},\ \mathsf{name}),\ [v_{\mathsf{arg}}]\ \mathbin{++} \ \mathsf{vec}_{v})\ =\ \mathsf{binds}\quad \operatorname{BlockEnter}(\sigma ,\ \mathsf{binds})\ \Downarrow \ (\sigma_{1} ,\ \mathsf{scope})\quad \Gamma \ \vdash \ \operatorname{EvalBlockBodySigma}(m.\mathsf{body},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )\quad \operatorname{BlockExit}(\sigma_{2} ,\ \mathsf{scope},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ApplyMethodSigma}(\mathsf{base},\ \mathsf{name},\ v_{\mathsf{self}},\ v_{\mathsf{arg}},\ \mathsf{vec}_{v},\ \sigma )\ \Downarrow \ (\operatorname{ReturnOut}(\mathsf{out}'),\ \sigma_{3} )
\end{array}
$$

### 15.2.6 Lowering

Methods lower as procedures whose first lowered parameter is the receiver.

**(Mangle-Record-Method)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{MethodDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{override},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{receiver},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \operatorname{ScopedSym}(\mathsf{item})
\end{array}
$$

**(Mangle-Class-Method)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ClassMethodDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{receiver},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \operatorname{ScopedSym}(\mathsf{item})
\end{array}
$$

**(Mangle-State-Method)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StateMethodDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \operatorname{ScopedSym}(\mathsf{item})
\end{array}
$$

### 15.2.7 Diagnostics

Diagnostics are defined for explicit receivers whose type is not `Self` or a permission-qualified `Self`, duplicate method names, receiver-permission mismatches at call sites, invalid receiver passing mode, and direct user calls to the destructor protocol.
