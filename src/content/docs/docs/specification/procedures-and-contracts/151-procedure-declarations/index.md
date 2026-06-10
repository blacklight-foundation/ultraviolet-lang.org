---
title: "15.1 Procedure Declarations"
description: "15.1 Procedure Declarations from 15. Procedures and Contracts of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "procedures-and-contracts"
specSection: "151-procedure-declarations"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/procedures-and-contracts/">15. Procedures and Contracts</a>
  <span>Procedures and Contracts</span>
</div>

## 15.1 Procedure Declarations

### 15.1.1 Syntax

```text
procedure_decl ::= attribute_list? visibility? "procedure" identifier generic_params? signature predicate_clause? contract_clause? block_expr
signature      ::= "(" param_list? ")" ("->" type)?
param_list      ::= param ("," param)*
param           ::= "move"? identifier ":" type
```

`extern` procedure declarations are owned by §23.2.

### 15.1.2 Parsing

**(Parse-Procedure)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{procedure})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseGenericParamsOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseSignature}(P_{3})\ \Downarrow \ (P_{4},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParsePredicateClauseOpt}(P_{4})\ \Downarrow \ (P_{5},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseContractClauseOpt}(P_{5})\ \Downarrow \ (P_{6},\ \mathsf{contract}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(P_{6})\ \Downarrow \ (P_{7},\ \mathsf{body}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseItem}(P)\ \Downarrow \ (P_{7},\ \langle \mathsf{ProcedureDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \operatorname{SpanBetween}(P,\ P_{7}),\ []\rangle )
\end{array}
$$

**(Parse-Signature)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseParamList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{params})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{")"})\quad \Gamma \ \vdash \ \operatorname{ParseReturnOpt}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{ret}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseSignature}(P)\ \Downarrow \ (P_{2},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}})
\end{array}
$$

**(Parse-ParamList-Empty)**
IsPunc(Tok(P), ")")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseParamList}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-ParamList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseParam}(P)\ \Downarrow \ (P_{1},\ \mathsf{param})\quad \Gamma \ \vdash \ \operatorname{ParseParamTail}(P_{1},\ [\mathsf{param}])\ \Downarrow \ (P_{2},\ \mathsf{params}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseParamList}(P)\ \Downarrow \ (P_{2},\ \mathsf{params})
\end{array}
$$

**(Parse-Param)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseParamModeOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{mode})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{name})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P_{2}))\ \Downarrow \ (P_{3},\ \mathsf{ty}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseParam}(P)\ \Downarrow \ (P_{3},\ \langle \mathsf{mode},\ \mathsf{name},\ \mathsf{ty}\rangle )
\end{array}
$$

**(Parse-ParamMode-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{move}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseParamModeOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-ParamMode-Move)**
IsKw(Tok(P), `move`)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseParamModeOpt}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \texttt{move})
\end{array}
$$

**(Parse-ParamTail-End)**
IsPunc(Tok(P), ")")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseParamTail}(P,\ \mathsf{xs})\ \Downarrow \ (P,\ \mathsf{xs})
\end{array}
$$

**(Parse-ParamTail-TrailingComma)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{")"})\quad \operatorname{TrailingCommaAllowed}(P_{0},\ P,\ \{\operatorname{Punctuator}(\texttt{")"})\}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseParamTail}(P,\ \mathsf{xs})\ \Downarrow \ (\operatorname{Advance}(P),\ \mathsf{xs})
\end{array}
$$

**(Parse-ParamTail-Comma)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParseParam}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ p)\quad \Gamma \ \vdash \ \operatorname{ParseParamTail}(P_{1},\ \mathsf{xs}\ \mathbin{++} \ [p])\ \Downarrow \ (P_{2},\ \mathsf{ys}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseParamTail}(P,\ \mathsf{xs})\ \Downarrow \ (P_{2},\ \mathsf{ys})
\end{array}
$$

**(Parse-ReturnOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"->"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseReturnOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-ReturnOpt-Arrow)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"->"})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{ty}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseReturnOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{ty})
\end{array}
$$

### 15.1.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{ProcedureDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{return}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}\rangle \\[0.16em]
\mathsf{Param}\ =\ \langle \mathsf{mode},\ \mathsf{name},\ \mathsf{type}\rangle
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ParamNames}(\mathsf{params})\ =\ [x\ \mid \ \langle \_,\ x,\ \_\rangle \ \in \ \mathsf{params}] \\[0.16em]
\operatorname{ParamBinds}(\mathsf{params})\ =\ [\langle x,\ T\rangle \ \mid \ \langle \_,\ x,\ T\rangle \ \in \ \mathsf{params}]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ProcReturn}(\mathsf{ret}_{\mathsf{opt}})\ = \\[0.16em]
\ \{\ \operatorname{TypePrim}(\texttt{"()"})\ \mathsf{if}\ \mathsf{ret}_{\mathsf{opt}}\ =\ \bot \\[0.16em]
\quad \mathsf{ret}_{\mathsf{opt}}\quad \mathsf{otherwise}\ \}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BodyReturnType}(R)\ = \\[0.16em]
\ \{\ \mathsf{Result}\quad \mathsf{if}\ \operatorname{AsyncSig}(R)\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle \\[0.16em]
\quad R\quad \mathsf{otherwise}\ \}
\end{array}
$$

$$
\operatorname{ExplicitReturn}(\operatorname{BlockExpr}(\mathsf{stmts},\ \mathsf{tail}_{\mathsf{opt}}))\ \Leftrightarrow \ \mathsf{tail}_{\mathsf{opt}}\ =\ \bot \ \land \ \mathsf{stmts}\ \ne \ []\ \land \ \operatorname{LastStmt}(\mathsf{stmts})\ =\ \operatorname{ReturnStmt}(\_)
$$

### 15.1.4 Static Semantics

$$
\operatorname{ReturnAnnOk}(\mathsf{ret}_{\mathsf{opt}})\ \Leftrightarrow \ \mathsf{ret}_{\mathsf{opt}}\ \ne \ \bot
$$

**(WF-ProcedureDecl)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ProcedureDecl}(\_,\ \mathsf{vis},\ \_,\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \_,\ \mathsf{body},\ \_,\ \_)\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \mathsf{params}_{\mathsf{gen}}\ =\ [P_{1},\ \ldots ,\ P_{n}]\quad \Gamma \ \vdash \ \langle P_{1};\ \ldots ;\ P_{n}\rangle \ \mathsf{wf}\quad \Gamma_{g} \ =\ \operatorname{BindTypeParams}(\Gamma ,\ \mathsf{params}_{\mathsf{gen}})\quad \Gamma_{g} ;\ \mathsf{params}_{\mathsf{gen}}\ \vdash \ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}\ \mathsf{wf}\quad \operatorname{Distinct}(\operatorname{ParamNames}(\mathsf{params}))\quad \operatorname{ReturnAnnOk}(\mathsf{ret}_{\mathsf{opt}})\quad R\ =\ \operatorname{ProcReturn}(\mathsf{ret}_{\mathsf{opt}})\quad R_{b}\ =\ \operatorname{BodyReturnType}(R)\quad \forall \ \langle \_,\ x_{i},\ T_{i}\rangle \ \in \ \mathsf{params},\ \Gamma_{g} \ \vdash \ T_{i}\ \mathsf{wf}\quad \Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma_{g} )\quad \operatorname{IntroAll}(\Gamma_{0} ,\ \operatorname{ParamBinds}(\mathsf{params}))\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} ;\ R;\ \bot \ \vdash \ \mathsf{body}\ :\ T_{b}\quad \Gamma_{g} \ \vdash \ T_{b}\ \mathrel{<:} \ R_{b}\quad (R_{b}\ \ne \ \operatorname{TypePrim}(\texttt{"()"})\ \Rightarrow \ \operatorname{ExplicitReturn}(\mathsf{body})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{DeclJudg}\ =\ \{\Gamma \ \vdash \ \mathsf{ProcedureDecl}\ :\ \mathsf{ok},\ \Gamma \ \vdash \ \mathsf{ExternProcDecl}\ :\ \mathsf{ok},\ \Gamma \ \vdash \ \mathsf{ExternBlock}\ :\ \mathsf{ok},\ \Gamma \ \vdash \ \mathsf{StaticDecl}\ :\ \mathsf{ok},\ \Gamma \ \vdash \ \mathsf{RecordDecl}\ :\ \mathsf{ok},\ \Gamma \ \vdash \ \mathsf{EnumDecl}\ :\ \mathsf{ok},\ \Gamma \ \vdash \ \mathsf{ModalDecl}\ :\ \mathsf{ok},\ \Gamma \ \vdash \ \mathsf{ClassDecl}\ :\ \mathsf{ok}\}
\end{array}
$$

**DeclTyping.**

$$
\begin{array}{l}
\operatorname{DeclTyping}(\mathsf{Ms})\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \forall \ M\ \in \ \mathsf{Ms}.\ \Gamma \ \vdash \ \operatorname{DeclTypingMod}(M)\ \Downarrow \ \mathsf{ok} \\[0.16em]
\operatorname{DeclTypingMod}(M)\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \forall \ \mathsf{it}\ \in \ M.\mathsf{items}.\ \Gamma \ \vdash \ \operatorname{DeclTypingItem}(M.\mathsf{path},\ \mathsf{it})\ \Downarrow \ \mathsf{ok}
\end{array}
$$

$$
\operatorname{ProvBindCheck}(\mathsf{params},\ \mathsf{body})\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \mathsf{body}\ =\ \operatorname{BlockExpr}(\mathsf{stmts},\ \mathsf{tail}_{\mathsf{opt}})\ \land \ \exists \ \mathsf{vec}\{\pi \}.\ \mid \mathsf{vec}\{\pi \}\mid \ =\ \mid \mathsf{params}\mid \ \land \ \Gamma ;\ \operatorname{InitProvEnv}(\mathsf{params},\ \mathsf{vec}\{\pi \},\ [])\ \vdash \ \operatorname{BlockProv}(\mathsf{stmts},\ \mathsf{tail}_{\mathsf{opt}})\ \Downarrow \ \pi
$$

$$
\begin{array}{l}
\operatorname{DeclTypingItem}(m,\ \operatorname{ImportDecl}(\_))\ \Downarrow \ \mathsf{ok} \\[0.16em]
\operatorname{DeclTypingItem}(m,\ \operatorname{UsingDecl}(\_))\ \Downarrow \ \mathsf{ok} \\[0.16em]
\operatorname{DeclTypingItem}(m,\ \operatorname{ExternBlock}(\_,\ \_,\ \_,\ \mathsf{items},\ \_,\ \_))\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \Gamma \ \vdash \ \mathsf{ExternBlock}\ :\ \mathsf{ok}\ \land \ \forall \ \mathsf{it}\ \in \ \mathsf{items}.\ \Gamma \ \vdash \ \mathsf{it}\ :\ \mathsf{ok} \\[0.16em]
\operatorname{DeclTypingItem}(m,\ \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_))\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \Gamma \ \vdash \ \mathsf{StaticDecl}\ :\ \mathsf{ok} \\[0.16em]
\operatorname{DeclTypingItem}(m,\ \operatorname{TypeAliasDecl}(\_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_))\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{FullPath}(m,\ \mathsf{name})\ :\ \mathsf{TypeAliasOk} \\[0.16em]
\operatorname{DeclTypingItem}(m,\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \mathsf{params},\ \_,\ \_,\ \mathsf{body},\ \_,\ \_)\ =\ \mathsf{item})\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \Gamma \ \vdash \ \mathsf{ProcedureDecl}\ :\ \mathsf{ok}\ \land \ \operatorname{ProcBindCheck}(m,\ \mathsf{item})\ \Downarrow \ \mathsf{ok}\ \land \ \operatorname{ProvBindCheck}(\mathsf{params},\ \mathsf{body})\ \Downarrow \ \mathsf{ok} \\[0.16em]
\operatorname{DeclTypingItem}(m,\ R)\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ R\ =\ \operatorname{RecordDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \land \ \Gamma \ \vdash \ R\ \mathsf{record}\ :\ \mathsf{ok}\ \land \ \forall \ \mathsf{md}\ \in \ \operatorname{Methods}(R).\ \operatorname{MethodBindCheck}(m,\ \operatorname{TypePath}(\operatorname{RecordPath}(R)),\ \mathsf{md})\ \Downarrow \ \mathsf{ok}\ \land \ \operatorname{ProvBindCheck}(\operatorname{MethodParamsDecl}(\operatorname{TypePath}(\operatorname{RecordPath}(R)),\ \mathsf{md}),\ \mathsf{md}.\mathsf{body})\ \Downarrow \ \mathsf{ok} \\[0.16em]
\operatorname{DeclTypingItem}(m,\ E)\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ E\ =\ \operatorname{EnumDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \land \ \Gamma \ \vdash \ E\ \mathsf{enum}\ :\ \mathsf{ok} \\[0.16em]
\operatorname{DeclTypingItem}(m,\ M)\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ M\ =\ \operatorname{ModalDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \land \ \Gamma \ \vdash \ M\ \mathsf{modal}\ :\ \mathsf{ok}\ \land \ \forall \ S\ \in \ \operatorname{States}(M),\ \forall \ \mathsf{md}\ \in \ \operatorname{Methods}(M,\ S).\ \operatorname{StateMethodBindCheck}(m,\ M,\ S,\ \mathsf{md})\ \Downarrow \ \mathsf{ok}\ \land \ \operatorname{ProvBindCheck}(\operatorname{StateMethodParams}(M,\ S,\ \mathsf{md}),\ \mathsf{md}.\mathsf{body})\ \Downarrow \ \mathsf{ok}\ \land \ \forall \ \mathsf{tr}\ \in \ \operatorname{Transitions}(M,\ S).\ \operatorname{TransitionBindCheck}(m,\ M,\ S,\ \mathsf{tr})\ \Downarrow \ \mathsf{ok}\ \land \ \operatorname{ProvBindCheck}(\operatorname{TransitionParams}(M,\ S,\ \mathsf{tr}),\ \mathsf{tr}.\mathsf{body})\ \Downarrow \ \mathsf{ok} \\[0.16em]
\operatorname{DeclTypingItem}(m,\ \mathsf{Cl})\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \mathsf{Cl}\ =\ \operatorname{ClassDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \land \ \Gamma \ \vdash \ \mathsf{Cl}\ :\ \mathsf{ok}\ \land \ \forall \ \mathsf{md}\ \in \ \operatorname{ClassMethods}(\mathsf{Cl}).\ (\mathsf{md}.\mathsf{body}_{\mathsf{opt}}\ =\ \bot \ \lor \ (\operatorname{ClassMethodBindCheck}(m,\ \mathsf{Cl},\ \mathsf{md})\ \Downarrow \ \mathsf{ok}\ \land \ \operatorname{ProvBindCheck}(\operatorname{ClassMethodParams}(\mathsf{Cl},\ \mathsf{md}),\ \mathsf{md}.\mathsf{body}_{\mathsf{opt}})\ \Downarrow \ \mathsf{ok}))
\end{array}
$$

$$
\Gamma \ \vdash \ \mathsf{ProcedureDecl}\ :\ \mathsf{ok}
$$

**(WF-ProcedureDecl-MissingReturnType)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \mathsf{ret}_{\mathsf{opt}},\ \_,\ \_,\ \_,\ \_)\quad \lnot \ \operatorname{ReturnAnnOk}(\mathsf{ret}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{item}\ \Uparrow
\end{array}
$$

**(WF-ProcBody-ExplicitReturn-Err)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \mathsf{ret}_{\mathsf{opt}},\ \_,\ \mathsf{body},\ \_,\ \_)\quad R\ =\ \operatorname{ProcReturn}(\mathsf{ret}_{\mathsf{opt}})\quad R_{b}\ =\ \operatorname{BodyReturnType}(R)\quad R_{b}\ \ne \ \operatorname{TypePrim}(\texttt{"()"})\quad \lnot \ \operatorname{ExplicitReturn}(\mathsf{body}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{item}\ \Uparrow
\end{array}
$$

If the declaration carries `#export` or `#host_export`, the foreign-callable signature obligations from §23.3 also apply.

**Program Entry Point.**

$$
\begin{array}{l}
\operatorname{MainDecls}(P)\ =\ [\ d\ \mid \ m\ \in \ P.\mathsf{modules},\ d\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items},\ d\ =\ \operatorname{ProcedureDecl}(\_,\ \mathsf{vis},\ \mathsf{name},\ \_,\ \_,\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \_,\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}),\ \mathsf{name}\ =\ \texttt{main}\ ] \\[0.16em]
\operatorname{TypeParams}(\operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_))\ =\ \operatorname{TypeParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}}) \\[0.16em]
\operatorname{MainGeneric}(d)\ \Leftrightarrow \ \operatorname{TypeParams}(d)\ \ne \ [] \\[0.16em]
\operatorname{MainArgType}(d)\ =\ \mathsf{ty}\ \Leftrightarrow \ d\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \texttt{main},\ \_,\ \_,\ [\langle \_,\ \_,\ \mathsf{ty}\rangle ],\ \_,\ \_,\ \_,\ \_,\ \_) \\[0.16em]
\operatorname{MainSigOk}(d)\ \Leftrightarrow \ d\ =\ \operatorname{ProcedureDecl}(\_,\ \mathsf{vis},\ \texttt{main},\ \_,\ \_,\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \_,\ \_,\ \_,\ \_)\ \land \ \mathsf{vis}\ =\ \texttt{public}\ \land \ \mathsf{params}\ =\ [\langle \mathsf{mode},\ \mathsf{name},\ \mathsf{ty}\rangle ]\ \land \ \mathsf{mode}\ \in \ \{\bot ,\ \texttt{move}\}\ \land \ \operatorname{ContextBundleType}(\operatorname{StripPerm}(\mathsf{ty}))\ \land \ \mathsf{ret}_{\mathsf{opt}}\ =\ \operatorname{TypePrim}(\texttt{"i32"})
\end{array}
$$

$$
\mathsf{MainCheck}\ :\ \mathsf{Project}\ \rightharpoonup \ \mathsf{ok}
$$

**(Main-Ok)**

$$
\begin{array}{l}
\operatorname{Executable}(P)\quad \operatorname{MainDecls}(P)\ =\ [d]\quad \lnot \ \operatorname{MainGeneric}(d)\quad \operatorname{MainSigOk}(d) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MainCheck}(P)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(Main-Bypass-NonExecutable)**

$$
\begin{array}{l}
\lnot \ \operatorname{Executable}(P) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MainCheck}(P)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(Main-Multiple)**

$$
\begin{array}{l}
\operatorname{Executable}(P)\quad \mid \operatorname{MainDecls}(P)\mid \ >\ 1\quad c\ =\ \operatorname{Code}(\mathsf{Main}-\mathsf{Multiple}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MainCheck}(P)\ \Uparrow \ c
\end{array}
$$

**(Main-Generic-Err)**

$$
\begin{array}{l}
\operatorname{Executable}(P)\quad \operatorname{MainDecls}(P)\ =\ [d]\quad \operatorname{MainGeneric}(d)\quad c\ =\ \operatorname{Code}(\mathsf{Main}-\mathsf{Generic}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MainCheck}(P)\ \Uparrow \ c
\end{array}
$$

**(Main-Signature-Err)**

$$
\begin{array}{l}
\operatorname{Executable}(P)\quad \operatorname{MainDecls}(P)\ =\ [d]\quad \lnot \ \operatorname{MainSigOk}(d)\quad c\ =\ \operatorname{Code}(\mathsf{Main}-\mathsf{Signature}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MainCheck}(P)\ \Uparrow \ c
\end{array}
$$

**(Main-Missing)**

$$
\begin{array}{l}
\operatorname{Executable}(P)\quad \operatorname{MainDecls}(P)\ =\ []\quad c\ =\ \operatorname{Code}(\mathsf{Main}-\mathsf{Missing}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MainCheck}(P)\ \Uparrow \ c
\end{array}
$$

$$
\mathsf{MainDiagRefs}\ =\ \{\texttt{"8.2"}\}
$$

### 15.1.5 Dynamic Semantics

$$
\operatorname{FuncVal}(\mathsf{sym})\ \mathsf{defined}\ \Leftrightarrow \ \mathsf{sym}\ \in \ \mathsf{Symbol}
$$

$$
\begin{array}{l}
\operatorname{BindParams}([\langle \mathsf{mode}_{1},\ x_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle \mathsf{mode}_{n},\ x_{n},\ T_{n}\rangle ],\ [v_{1},\ \ldots ,\ v_{n}])\ =\ [\langle x_{1},\ v_{1}\rangle ,\ \ldots ,\ \langle x_{n},\ v_{n}\rangle ] \\[0.16em]
\mathsf{ArgPassJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{EvalArgsSigma}(\mathsf{params},\ \mathsf{args},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma '),\ \Gamma \ \vdash \ \operatorname{EvalRecvSigma}(\mathsf{base},\ \mathsf{mode},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\} \\[0.16em]
\mathsf{ArgVal}\ =\ \{v,\ \operatorname{Alias}(\mathsf{addr}),\ \operatorname{Owned}(\mathsf{addr})\}
\end{array}
$$

$$
\mathsf{CallJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{EvalArgsSigma}(\mathsf{params},\ \mathsf{args},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma '),\ \Gamma \ \vdash \ \operatorname{EvalRecvSigma}(\mathsf{base},\ \mathsf{mode},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma '),\ \Gamma \ \vdash \ \operatorname{ApplyRegionProc}(\mathsf{name},\ \mathsf{vec}_{v},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma '),\ \Gamma \ \vdash \ \operatorname{ApplyCancelProc}(\mathsf{name},\ \mathsf{vec}_{v},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma '),\ \Gamma \ \vdash \ \operatorname{ApplyProcSigma}(\mathsf{proc},\ \mathsf{vec}_{v},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma '),\ \Gamma \ \vdash \ \operatorname{ApplyRecordCtorSigma}(p,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma '),\ \Gamma \ \vdash \ \operatorname{ApplyMethodSigma}(\mathsf{base},\ \mathsf{name},\ v_{\mathsf{self}},\ v_{\mathsf{arg}},\ \mathsf{vec}_{v},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\}
$$

$$
\begin{array}{l}
\operatorname{CallTarget}(\operatorname{FuncVal}(\mathsf{sym}))\ =\ \mathsf{proc}\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{proc})\ \Downarrow \ \mathsf{sym}\ \land \ (\mathsf{proc}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \lor \ \mathsf{proc}\ =\ \operatorname{ExternProcDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)) \\[0.16em]
\operatorname{CallTarget}(\operatorname{RecordCtor}(p))\ =\ \operatorname{RecordCtor}(p) \\[0.16em]
\operatorname{MethodTarget}(\operatorname{RecordValue}(\operatorname{TypePath}(p),\ \mathsf{io}),\ \mathsf{name})\ =\ m\ \Leftrightarrow \ \operatorname{LookupMethod}(\operatorname{TypePath}(p),\ \mathsf{name})\ =\ m \\[0.16em]
\operatorname{MethodTarget}(v_{\mathsf{self}},\ \mathsf{name})\ =\ m\ \land \ m.\mathsf{body}\ =\ \bot \ \land \ \lnot \ \exists \ \mathsf{vec}_{v},\ \mathsf{out}.\ \Gamma \ \vdash \ \operatorname{PrimCall}(\operatorname{MethodOwner}(m),\ \operatorname{MethodName}(m),\ v_{\mathsf{self}},\ \mathsf{vec}_{v})\ \Downarrow \ \mathsf{out}\ \Rightarrow \ \operatorname{IllFormed}(\operatorname{MethodTarget}(v_{\mathsf{self}},\ \mathsf{name}))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{RegionProcParams}(\mathsf{name})\ =\ \mathsf{params}\ \Leftrightarrow \ \operatorname{RegionProcSig}(\texttt{Region::}\mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \\[0.16em]
\operatorname{CancelProcParams}(\mathsf{name})\ =\ \mathsf{params}\ \Leftrightarrow \ \operatorname{CancelTokenProcSig}(\texttt{CancelToken::}\mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle
\end{array}
$$

$$
\operatorname{SynthParams}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ])\ =\ [\langle m_{1},\ \bot ,\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ \bot ,\ T_{n}\rangle ]
$$

$$
\begin{array}{l}
\operatorname{CalleeProc}(\operatorname{Identifier}(x))\ =\ \mathsf{proc}\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{ResolveValueName}(x)\ \Downarrow \ \mathsf{ent}\ \land \ \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ \mathsf{mp}\ \land \ \mathsf{name}\ =\ (\mathsf{ent}.\mathsf{target}_{\mathsf{opt}}\ \mathsf{if}\ \mathsf{present},\ \mathsf{else}\ x)\ \land \ \operatorname{DeclOf}(\mathsf{mp},\ \mathsf{name})\ =\ \mathsf{proc}\ \land \ (\mathsf{proc}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \lor \ \mathsf{proc}\ =\ \operatorname{ExternProcDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)) \\[0.16em]
\operatorname{CalleeProc}(\operatorname{Path}(\mathsf{path},\ \mathsf{name}))\ =\ \mathsf{proc}\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{ResolveQualified}(\mathsf{path},\ \mathsf{name},\ \mathsf{ValueKind})\ \Downarrow \ \mathsf{ent}\ \land \ \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ \mathsf{mp}\ \land \ \mathsf{name}'\ =\ (\mathsf{ent}.\mathsf{target}_{\mathsf{opt}}\ \mathsf{if}\ \mathsf{present},\ \mathsf{else}\ \mathsf{name})\ \land \ \operatorname{DeclOf}(\mathsf{mp},\ \mathsf{name}')\ =\ \mathsf{proc}\ \land \ (\mathsf{proc}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \lor \ \mathsf{proc}\ =\ \operatorname{ExternProcDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Params}(\operatorname{Call}(\mathsf{callee},\ \mathsf{args}))\ = \\[0.16em]
\ \{\ \mathsf{proc}.\mathsf{params}\quad \mathsf{if}\ \operatorname{CalleeProc}(\mathsf{callee})\ =\ \mathsf{proc} \\[0.16em]
\quad \operatorname{SynthParams}(\mathsf{params})\quad \mathsf{if}\ \operatorname{ExprType}(\mathsf{callee})\ =\ \operatorname{TypeFunc}(\mathsf{params},\ \_) \\[0.16em]
\quad \bot \quad \mathsf{otherwise}\ \}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ReturnOut}(\operatorname{Val}(v))\ =\ \operatorname{Val}(v) \\[0.16em]
\operatorname{ReturnOut}(\operatorname{Ctrl}(\operatorname{Return}(v)))\ =\ \operatorname{Val}(v) \\[0.16em]
\operatorname{ReturnOut}(\operatorname{Ctrl}(\mathsf{Panic}))\ =\ \operatorname{Ctrl}(\mathsf{Panic}) \\[0.16em]
\operatorname{ReturnOut}(\operatorname{Ctrl}(\mathsf{Abort}))\ =\ \operatorname{Ctrl}(\mathsf{Abort}) \\[0.16em]
\operatorname{ReturnOut}(\operatorname{Ctrl}(\operatorname{Break}(v_{\mathsf{opt}})))\ =\ \bot \\[0.16em]
\operatorname{ReturnOut}(\operatorname{Ctrl}(\mathsf{Continue}))\ =\ \bot \\[0.16em]
\operatorname{ReturnOut}(\mathsf{out})\ =\ \bot \ \Rightarrow \ \operatorname{IllFormed}(\operatorname{ReturnOut}(\mathsf{out}))
\end{array}
$$

**(EvalArgsSigma-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalArgsSigma}([],\ [],\ \sigma )\ \Downarrow \ (\operatorname{Val}([]),\ \sigma )
\end{array}
$$

$$
\begin{array}{l}
\operatorname{CopyValue}(e,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{CopyExpr}(e),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\[0.16em]
\operatorname{MaterializeCallTemp}(v,\ \sigma )\ \Downarrow \ (\mathsf{addr},\ \sigma ')\ \mathsf{relation} \\[0.16em]
\operatorname{TransferArgOwner}(\mathsf{addr},\ \sigma )\ \Downarrow \ \sigma '\ \mathsf{relation}
\end{array}
$$

**(EvalArgsSigma-Cons-Move-Place)**

$$
\begin{array}{l}
\mathsf{pass}\ \in \ \{\texttt{move}\}\quad \Gamma \ \vdash \ \operatorname{AddrOfSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{addr}),\ \sigma_{1} )\quad \operatorname{TransferArgOwner}(\mathsf{addr},\ \sigma_{1} )\ \Downarrow \ \sigma_{2} \quad \Gamma \ \vdash \ \operatorname{EvalArgsSigma}(\mathsf{ps},\ \mathsf{as},\ \sigma_{2} )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{v}),\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalArgsSigma}([\langle \texttt{move},\ x,\ T_{p}\rangle ]\ \mathbin{++} \ \mathsf{ps},\ [\langle \mathsf{pass},\ e,\ \_\rangle ]\ \mathbin{++} \ \mathsf{as},\ \sigma )\ \Downarrow \ (\operatorname{Val}([\operatorname{Owned}(\mathsf{addr})]\ \mathbin{++} \ \mathsf{vec}_{v}),\ \sigma_{3} )
\end{array}
$$

**(EvalArgsSigma-Cons-Move-Copy)**

$$
\begin{array}{l}
\mathsf{pass}\ =\ \texttt{copy}\quad \Gamma \ \vdash \ \operatorname{CopyValue}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad \operatorname{MaterializeCallTemp}(v,\ \sigma_{1} )\ \Downarrow \ (\mathsf{addr},\ \sigma_{2} )\quad \Gamma \ \vdash \ \operatorname{EvalArgsSigma}(\mathsf{ps},\ \mathsf{as},\ \sigma_{2} )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{v}),\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalArgsSigma}([\langle \texttt{move},\ x,\ T_{p}\rangle ]\ \mathbin{++} \ \mathsf{ps},\ [\langle \mathsf{pass},\ e,\ \_\rangle ]\ \mathbin{++} \ \mathsf{as},\ \sigma )\ \Downarrow \ (\operatorname{Val}([\operatorname{Owned}(\mathsf{addr})]\ \mathbin{++} \ \mathsf{vec}_{v}),\ \sigma_{3} )
\end{array}
$$

**(EvalArgsSigma-Cons-Move-Fresh)**

$$
\begin{array}{l}
\mathsf{pass}\ =\ \texttt{ref}\quad \lnot \ \operatorname{HasSourceProvenance}(e)\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad \operatorname{MaterializeCallTemp}(v,\ \sigma_{1} )\ \Downarrow \ (\mathsf{addr},\ \sigma_{2} )\quad \Gamma \ \vdash \ \operatorname{EvalArgsSigma}(\mathsf{ps},\ \mathsf{as},\ \sigma_{2} )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{v}),\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalArgsSigma}([\langle \texttt{move},\ x,\ T_{p}\rangle ]\ \mathbin{++} \ \mathsf{ps},\ [\langle \mathsf{pass},\ e,\ \_\rangle ]\ \mathbin{++} \ \mathsf{as},\ \sigma )\ \Downarrow \ (\operatorname{Val}([\operatorname{Owned}(\mathsf{addr})]\ \mathbin{++} \ \mathsf{vec}_{v}),\ \sigma_{3} )
\end{array}
$$

**(EvalArgsSigma-Cons-Ref)**

$$
\begin{array}{l}
\mathsf{pass}\ =\ \texttt{ref}\quad \Gamma \ \vdash \ \operatorname{AddrOfSigma}(\operatorname{RefArgExpr}(e),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{addr}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalArgsSigma}(\mathsf{ps},\ \mathsf{as},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{v}),\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalArgsSigma}([\langle \bot ,\ x,\ T_{p}\rangle ]\ \mathbin{++} \ \mathsf{ps},\ [\langle \mathsf{pass},\ e,\ \_\rangle ]\ \mathbin{++} \ \mathsf{as},\ \sigma )\ \Downarrow \ (\operatorname{Val}([\operatorname{Alias}(\mathsf{addr})]\ \mathbin{++} \ \mathsf{vec}_{v}),\ \sigma_{2} )
\end{array}
$$

**(EvalArgsSigma-Cons-Ref-Copy)**

$$
\begin{array}{l}
\mathsf{pass}\ =\ \texttt{copy}\quad \Gamma \ \vdash \ \operatorname{CopyValue}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad \operatorname{MaterializeCallTemp}(v,\ \sigma_{1} )\ \Downarrow \ (\mathsf{addr},\ \sigma_{2} )\quad \Gamma \ \vdash \ \operatorname{EvalArgsSigma}(\mathsf{ps},\ \mathsf{as},\ \sigma_{2} )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{v}),\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalArgsSigma}([\langle \bot ,\ x,\ T_{p}\rangle ]\ \mathbin{++} \ \mathsf{ps},\ [\langle \mathsf{pass},\ e,\ \_\rangle ]\ \mathbin{++} \ \mathsf{as},\ \sigma )\ \Downarrow \ (\operatorname{Val}([\operatorname{Alias}(\mathsf{addr})]\ \mathbin{++} \ \mathsf{vec}_{v}),\ \sigma_{3} )
\end{array}
$$

**(EvalArgsSigma-Ctrl-Move)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{ArgPassExpr}(\texttt{move},\ \mathsf{pass},\ e),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalArgsSigma}([\langle \texttt{move},\ x,\ T_{p}\rangle ]\ \mathbin{++} \ \mathsf{ps},\ [\langle \mathsf{pass},\ e,\ \_\rangle ]\ \mathbin{++} \ \mathsf{as},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(EvalArgsSigma-Ctrl-Ref)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{ArgPassExpr}(\bot ,\ \mathsf{pass},\ e),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalArgsSigma}([\langle \bot ,\ x,\ T_{p}\rangle ]\ \mathbin{++} \ \mathsf{ps},\ [\langle \mathsf{pass},\ e,\ \_\rangle ]\ \mathbin{++} \ \mathsf{as},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(ApplyRegionProc-NewScoped)**

$$
\begin{array}{l}
\mathsf{name}\ =\ \texttt{new\_scoped}\quad \mathsf{vec}_{v}\ =\ [\mathsf{opts}]\quad \operatorname{RegionNewScoped}(\sigma ,\ \mathsf{opts})\ \Downarrow \ (\sigma ',\ v) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ApplyRegionProc}(\mathsf{name},\ \mathsf{vec}_{v},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma ')
\end{array}
$$

**(ApplyRegionProc-Alloc)**

$$
\begin{array}{l}
\mathsf{name}\ =\ \texttt{alloc}\quad \mathsf{vec}_{v}\ =\ [v_{r},\ v]\quad \operatorname{RegionAllocProc}(\sigma ,\ v_{r},\ v)\ \Downarrow \ (\sigma ',\ v') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ApplyRegionProc}(\mathsf{name},\ \mathsf{vec}_{v},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma ')
\end{array}
$$

**(ApplyRegionProc-Reset)**

$$
\begin{array}{l}
\mathsf{name}\ =\ \texttt{reset\_unchecked}\quad \mathsf{vec}_{v}\ =\ [v_{r}]\quad \operatorname{RegionResetProc}(\sigma ,\ v_{r})\ \Downarrow \ (\sigma ',\ v') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ApplyRegionProc}(\mathsf{name},\ \mathsf{vec}_{v},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma ')
\end{array}
$$

**(ApplyRegionProc-Freeze)**

$$
\begin{array}{l}
\mathsf{name}\ =\ \texttt{freeze}\quad \mathsf{vec}_{v}\ =\ [v_{r}]\quad \operatorname{RegionFreezeProc}(\sigma ,\ v_{r})\ \Downarrow \ (\sigma ',\ v') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ApplyRegionProc}(\mathsf{name},\ \mathsf{vec}_{v},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma ')
\end{array}
$$

**(ApplyRegionProc-Thaw)**

$$
\begin{array}{l}
\mathsf{name}\ =\ \texttt{thaw}\quad \mathsf{vec}_{v}\ =\ [v_{r}]\quad \operatorname{RegionThawProc}(\sigma ,\ v_{r})\ \Downarrow \ (\sigma ',\ v') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ApplyRegionProc}(\mathsf{name},\ \mathsf{vec}_{v},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma ')
\end{array}
$$

**(ApplyRegionProc-Free)**

$$
\begin{array}{l}
\mathsf{name}\ =\ \texttt{free\_unchecked}\quad \mathsf{vec}_{v}\ =\ [v_{r}]\quad \operatorname{RegionFreeProc}(\sigma ,\ v_{r})\ \Downarrow \ (\sigma ',\ v') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ApplyRegionProc}(\mathsf{name},\ \mathsf{vec}_{v},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma ')
\end{array}
$$

**(ApplyCancelProc-New)**

$$
\begin{array}{l}
\mathsf{name}\ =\ \texttt{new}\quad \mathsf{vec}_{v}\ =\ []\quad \operatorname{CancelNew}()\ \Downarrow \ v \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ApplyCancelProc}(\mathsf{name},\ \mathsf{vec}_{v},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma )
\end{array}
$$

**(ApplyProcSigma)**

$$
\begin{array}{l}
\operatorname{BindParams}(\mathsf{proc}.\mathsf{params},\ \mathsf{vec}_{v})\ =\ \mathsf{binds}\quad \operatorname{BlockEnter}(\sigma ,\ \mathsf{binds})\ \Downarrow \ (\sigma_{1} ,\ \mathsf{scope})\quad \Gamma \ \vdash \ \operatorname{EvalBlockBodySigma}(\mathsf{proc}.\mathsf{body},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )\quad \operatorname{BlockExit}(\sigma_{2} ,\ \mathsf{scope},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ApplyProcSigma}(\mathsf{proc},\ \mathsf{vec}_{v},\ \sigma )\ \Downarrow \ (\operatorname{ReturnOut}(\mathsf{out}'),\ \sigma_{3} )
\end{array}
$$

Rule **(EvalSigma-Call-Proc)** is defined once by §16.3.5.

### 15.1.6 Lowering

**(CG-Item-Procedure)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ProcedureDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\quad R\ =\ \operatorname{ProcReturn}(\mathsf{ret}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{LowerBlock}(\mathsf{body})\ \Downarrow \ \langle \mathsf{IR},\ v\rangle \quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym}\quad \mathsf{params}'\ =\ \operatorname{CodegenParams}(\mathsf{params}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CodegenItem}(\mathsf{item})\ \Downarrow \ [\operatorname{ProcIR}(\mathsf{sym},\ \mathsf{params}',\ R,\ \mathsf{IR})]
\end{array}
$$

Program-entry handling for `main` is owned by §24.4.

### 15.1.7 Diagnostics

Diagnostics are defined for missing explicit return annotations, duplicate parameter names, non-unit procedures without an explicit trailing `return`, and bodies whose result type does not match the declared return type.
