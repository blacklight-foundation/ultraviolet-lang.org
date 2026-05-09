---
title: "Procedures and Contracts"
description: "15. Procedures and Contracts of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T19:35:24.518Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
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
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{procedure})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseGenericParamsOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseSignature}(P_{3})\ \Downarrow \ (P_{4},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParsePredicateClauseOpt}(P_{4})\ \Downarrow \ (P_{5},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseContractClauseOpt}(P_{5})\ \Downarrow \ (P_{6},\ \mathsf{contract}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(P_{6})\ \Downarrow \ (P_{7},\ \mathsf{body}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseItem}(P)\ \Downarrow \ (P_{7},\ \langle \mathsf{ProcedureDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \operatorname{SpanBetween}(P,\ P_{7}),\ []\rangle )
\end{array}
$$

**(Parse-Signature)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseParamList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{params})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{")"})\quad \Gamma \ \vdash \ \operatorname{ParseReturnOpt}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{ret}_{\mathsf{opt}}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseSignature}(P)\ \Downarrow \ (P_{2},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}})
\end{array}
$$

**(Parse-ParamList-Empty)**
IsPunc(Tok(P), ")")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseParamList}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-ParamList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseParam}(P)\ \Downarrow \ (P_{1},\ \mathsf{param})\quad \Gamma \ \vdash \ \operatorname{ParseParamTail}(P_{1},\ [\mathsf{param}])\ \Downarrow \ (P_{2},\ \mathsf{params}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseParamList}(P)\ \Downarrow \ (P_{2},\ \mathsf{params})
\end{array}
$$

**(Parse-Param)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseParamModeOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{mode})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{name})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P_{2}))\ \Downarrow \ (P_{3},\ \mathsf{ty}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseParam}(P)\ \Downarrow \ (P_{3},\ \langle \mathsf{mode},\ \mathsf{name},\ \mathsf{ty}\rangle )
\end{array}
$$

**(Parse-ParamMode-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{move}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseParamModeOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-ParamMode-Move)**
IsKw(Tok(P), `move`)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseParamModeOpt}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \texttt{move})
\end{array}
$$

**(Parse-ParamTail-End)**
IsPunc(Tok(P), ")")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseParamTail}(P,\ \mathsf{xs})\ \Downarrow \ (P,\ \mathsf{xs})
\end{array}
$$

**(Parse-ParamTail-TrailingComma)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{")"})\quad \operatorname{TrailingCommaAllowed}(P_{0},\ P,\ \{\operatorname{Punctuator}(\texttt{")"})\}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseParamTail}(P,\ \mathsf{xs})\ \Downarrow \ (\operatorname{Advance}(P),\ \mathsf{xs})
\end{array}
$$

**(Parse-ParamTail-Comma)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParseParam}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ p)\quad \Gamma \ \vdash \ \operatorname{ParseParamTail}(P_{1},\ \mathsf{xs}\ \mathbin{++} \ [p])\ \Downarrow \ (P_{2},\ \mathsf{ys}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseParamTail}(P,\ \mathsf{xs})\ \Downarrow \ (P_{2},\ \mathsf{ys})
\end{array}
$$

**(Parse-ReturnOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"->"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseReturnOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-ReturnOpt-Arrow)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"->"})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{ty}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseReturnOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{ty})
\end{array}
$$

### 15.1.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{ProcedureDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{return}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}\rangle  \\
\mathsf{Param}\ =\ \langle \mathsf{mode},\ \mathsf{name},\ \mathsf{type}\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ParamNames}(\mathsf{params})\ =\ [x\ \mid \ \langle \_,\ x,\ \_\rangle \ \in \ \mathsf{params}] \\
\operatorname{ParamBinds}(\mathsf{params})\ =\ [\langle x,\ T\rangle \ \mid \ \langle \_,\ x,\ T\rangle \ \in \ \mathsf{params}]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ProcReturn}(\mathsf{ret}_{\mathsf{opt}})\ = \\
\ \{\ \operatorname{TypePrim}(\texttt{"()"})\ \mathsf{if}\ \mathsf{ret}_{\mathsf{opt}}\ =\ \bot  \\
\quad \mathsf{ret}_{\mathsf{opt}}\quad \mathsf{otherwise}\ \}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BodyReturnType}(R)\ = \\
\ \{\ \mathsf{Result}\quad \mathsf{if}\ \operatorname{AsyncSig}(R)\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle  \\
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
\mathsf{item}\ =\ \operatorname{ProcedureDecl}(\_,\ \mathsf{vis},\ \_,\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \_,\ \mathsf{body},\ \_,\ \_)\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \mathsf{params}_{\mathsf{gen}}\ =\ [P_{1},\ \ldots ,\ P_{n}]\quad \Gamma \ \vdash \ \langle P_{1};\ \ldots ;\ P_{n}\rangle \ \mathsf{wf}\quad \Gamma_{g} \ =\ \operatorname{BindTypeParams}(\Gamma ,\ \mathsf{params}_{\mathsf{gen}})\quad \Gamma_{g} ;\ \mathsf{params}_{\mathsf{gen}}\ \vdash \ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}\ \mathsf{wf}\quad \operatorname{Distinct}(\operatorname{ParamNames}(\mathsf{params}))\quad \operatorname{ReturnAnnOk}(\mathsf{ret}_{\mathsf{opt}})\quad R\ =\ \operatorname{ProcReturn}(\mathsf{ret}_{\mathsf{opt}})\quad R_{b}\ =\ \operatorname{BodyReturnType}(R)\quad \forall \ \langle \_,\ x_{i},\ T_{i}\rangle \ \in \ \mathsf{params},\ \Gamma_{g} \ \vdash \ T_{i}\ \mathsf{wf}\quad \Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma_{g} )\quad \operatorname{IntroAll}(\Gamma_{0} ,\ \operatorname{ParamBinds}(\mathsf{params}))\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} ;\ R;\ \bot \ \vdash \ \mathsf{body}\ :\ T_{b}\quad \Gamma_{g} \ \vdash \ T_{b}\ \mathrel{<:} \ R_{b}\quad (R_{b}\ \ne \ \operatorname{TypePrim}(\texttt{"()"})\ \Rightarrow \ \operatorname{ExplicitReturn}(\mathsf{body})) \\
\rule{18em}{0.4pt} \\
\mathsf{DeclJudg}\ =\ \{\Gamma \ \vdash \ \mathsf{ProcedureDecl}\ :\ \mathsf{ok},\ \Gamma \ \vdash \ \mathsf{ExternProcDecl}\ :\ \mathsf{ok},\ \Gamma \ \vdash \ \mathsf{ExternBlock}\ :\ \mathsf{ok},\ \Gamma \ \vdash \ \mathsf{StaticDecl}\ :\ \mathsf{ok},\ \Gamma \ \vdash \ \mathsf{RecordDecl}\ :\ \mathsf{ok},\ \Gamma \ \vdash \ \mathsf{EnumDecl}\ :\ \mathsf{ok},\ \Gamma \ \vdash \ \mathsf{ModalDecl}\ :\ \mathsf{ok},\ \Gamma \ \vdash \ \mathsf{ClassDecl}\ :\ \mathsf{ok}\}
\end{array}
$$

**DeclTyping.**

$$
\begin{array}{l}
\operatorname{DeclTyping}(\mathsf{Ms})\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \forall \ M\ \in \ \mathsf{Ms}.\ \Gamma \ \vdash \ \operatorname{DeclTypingMod}(M)\ \Downarrow \ \mathsf{ok} \\
\operatorname{DeclTypingMod}(M)\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \forall \ \mathsf{it}\ \in \ M.\mathsf{items}.\ \Gamma \ \vdash \ \operatorname{DeclTypingItem}(M.\mathsf{path},\ \mathsf{it})\ \Downarrow \ \mathsf{ok}
\end{array}
$$

$$
\operatorname{ProvBindCheck}(\mathsf{params},\ \mathsf{body})\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \mathsf{body}\ =\ \operatorname{BlockExpr}(\mathsf{stmts},\ \mathsf{tail}_{\mathsf{opt}})\ \land \ \exists \ \mathsf{vec}\{\pi \}.\ \mid \mathsf{vec}\{\pi \}\mid \ =\ \mid \mathsf{params}\mid \ \land \ \Gamma ;\ \operatorname{InitProvEnv}(\mathsf{params},\ \mathsf{vec}\{\pi \},\ [])\ \vdash \ \operatorname{BlockProv}(\mathsf{stmts},\ \mathsf{tail}_{\mathsf{opt}})\ \Downarrow \ \pi 
$$

$$
\begin{array}{l}
\operatorname{DeclTypingItem}(m,\ \operatorname{ImportDecl}(\_))\ \Downarrow \ \mathsf{ok} \\
\operatorname{DeclTypingItem}(m,\ \operatorname{UsingDecl}(\_))\ \Downarrow \ \mathsf{ok} \\
\operatorname{DeclTypingItem}(m,\ \operatorname{ExternBlock}(\_,\ \_,\ \_,\ \mathsf{items},\ \_,\ \_))\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \Gamma \ \vdash \ \mathsf{ExternBlock}\ :\ \mathsf{ok}\ \land \ \forall \ \mathsf{it}\ \in \ \mathsf{items}.\ \Gamma \ \vdash \ \mathsf{it}\ :\ \mathsf{ok} \\
\operatorname{DeclTypingItem}(m,\ \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_))\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \Gamma \ \vdash \ \mathsf{StaticDecl}\ :\ \mathsf{ok} \\
\operatorname{DeclTypingItem}(m,\ \operatorname{TypeAliasDecl}(\_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_))\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{FullPath}(m,\ \mathsf{name})\ :\ \mathsf{TypeAliasOk} \\
\operatorname{DeclTypingItem}(m,\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \mathsf{params},\ \_,\ \_,\ \mathsf{body},\ \_,\ \_)\ =\ \mathsf{item})\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \Gamma \ \vdash \ \mathsf{ProcedureDecl}\ :\ \mathsf{ok}\ \land \ \operatorname{ProcBindCheck}(m,\ \mathsf{item})\ \Downarrow \ \mathsf{ok}\ \land \ \operatorname{ProvBindCheck}(\mathsf{params},\ \mathsf{body})\ \Downarrow \ \mathsf{ok} \\
\operatorname{DeclTypingItem}(m,\ R)\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ R\ =\ \operatorname{RecordDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \land \ \Gamma \ \vdash \ R\ \mathsf{record}\ :\ \mathsf{ok}\ \land \ \forall \ \mathsf{md}\ \in \ \operatorname{Methods}(R).\ \operatorname{MethodBindCheck}(m,\ \operatorname{TypePath}(\operatorname{RecordPath}(R)),\ \mathsf{md})\ \Downarrow \ \mathsf{ok}\ \land \ \operatorname{ProvBindCheck}(\operatorname{MethodParamsDecl}(\operatorname{TypePath}(\operatorname{RecordPath}(R)),\ \mathsf{md}),\ \mathsf{md}.\mathsf{body})\ \Downarrow \ \mathsf{ok} \\
\operatorname{DeclTypingItem}(m,\ E)\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ E\ =\ \operatorname{EnumDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \land \ \Gamma \ \vdash \ E\ \mathsf{enum}\ :\ \mathsf{ok} \\
\operatorname{DeclTypingItem}(m,\ M)\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ M\ =\ \operatorname{ModalDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \land \ \Gamma \ \vdash \ M\ \mathsf{modal}\ :\ \mathsf{ok}\ \land \ \forall \ S\ \in \ \operatorname{States}(M),\ \forall \ \mathsf{md}\ \in \ \operatorname{Methods}(M,\ S).\ \operatorname{StateMethodBindCheck}(m,\ M,\ S,\ \mathsf{md})\ \Downarrow \ \mathsf{ok}\ \land \ \operatorname{ProvBindCheck}(\operatorname{StateMethodParams}(M,\ S,\ \mathsf{md}),\ \mathsf{md}.\mathsf{body})\ \Downarrow \ \mathsf{ok}\ \land \ \forall \ \mathsf{tr}\ \in \ \operatorname{Transitions}(M,\ S).\ \operatorname{TransitionBindCheck}(m,\ M,\ S,\ \mathsf{tr})\ \Downarrow \ \mathsf{ok}\ \land \ \operatorname{ProvBindCheck}(\operatorname{TransitionParams}(M,\ S,\ \mathsf{tr}),\ \mathsf{tr}.\mathsf{body})\ \Downarrow \ \mathsf{ok} \\
\operatorname{DeclTypingItem}(m,\ \mathsf{Cl})\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \mathsf{Cl}\ =\ \operatorname{ClassDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \land \ \Gamma \ \vdash \ \mathsf{Cl}\ :\ \mathsf{ok}\ \land \ \forall \ \mathsf{md}\ \in \ \operatorname{ClassMethods}(\mathsf{Cl}).\ (\mathsf{md}.\mathsf{body}_{\mathsf{opt}}\ =\ \bot \ \lor \ (\operatorname{ClassMethodBindCheck}(m,\ \mathsf{Cl},\ \mathsf{md})\ \Downarrow \ \mathsf{ok}\ \land \ \operatorname{ProvBindCheck}(\operatorname{ClassMethodParams}(\mathsf{Cl},\ \mathsf{md}),\ \mathsf{md}.\mathsf{body}_{\mathsf{opt}})\ \Downarrow \ \mathsf{ok}))
\end{array}
$$

$$
\Gamma \ \vdash \ \mathsf{ProcedureDecl}\ :\ \mathsf{ok}
$$

**(WF-ProcedureDecl-MissingReturnType)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \mathsf{ret}_{\mathsf{opt}},\ \_,\ \_,\ \_,\ \_)\quad \lnot \ \operatorname{ReturnAnnOk}(\mathsf{ret}_{\mathsf{opt}}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{item}\ \Uparrow 
\end{array}
$$

**(WF-ProcBody-ExplicitReturn-Err)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \mathsf{ret}_{\mathsf{opt}},\ \_,\ \mathsf{body},\ \_,\ \_)\quad R\ =\ \operatorname{ProcReturn}(\mathsf{ret}_{\mathsf{opt}})\quad R_{b}\ =\ \operatorname{BodyReturnType}(R)\quad R_{b}\ \ne \ \operatorname{TypePrim}(\texttt{"()"})\quad \lnot \ \operatorname{ExplicitReturn}(\mathsf{body}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{item}\ \Uparrow 
\end{array}
$$

If the declaration carries `[[export]]` or `[[host_export]]`, the foreign-callable signature obligations from §23.3 also apply.

**Program Entry Point.**

$$
\begin{array}{l}
\operatorname{MainDecls}(P)\ =\ [\ d\ \mid \ m\ \in \ P.\mathsf{modules},\ d\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items},\ d\ =\ \operatorname{ProcedureDecl}(\_,\ \mathsf{vis},\ \mathsf{name},\ \_,\ \_,\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \_,\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}),\ \mathsf{name}\ =\ \texttt{main}\ ] \\
\operatorname{TypeParams}(\operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_))\ =\ \operatorname{TypeParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}}) \\
\operatorname{MainGeneric}(d)\ \Leftrightarrow \ \operatorname{TypeParams}(d)\ \ne \ [] \\
\operatorname{MainArgType}(d)\ =\ \mathsf{ty}\ \Leftrightarrow \ d\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \texttt{main},\ \_,\ \_,\ [\langle \_,\ \_,\ \mathsf{ty}\rangle ],\ \_,\ \_,\ \_,\ \_,\ \_) \\
\operatorname{MainSigOk}(d)\ \Leftrightarrow \ d\ =\ \operatorname{ProcedureDecl}(\_,\ \mathsf{vis},\ \texttt{main},\ \_,\ \_,\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \_,\ \_,\ \_,\ \_)\ \land \ \mathsf{vis}\ =\ \texttt{public}\ \land \ \mathsf{params}\ =\ [\langle \mathsf{mode},\ \mathsf{name},\ \mathsf{ty}\rangle ]\ \land \ \mathsf{mode}\ \in \ \{\bot ,\ \texttt{move}\}\ \land \ \operatorname{ContextBundleType}(\operatorname{StripPerm}(\mathsf{ty}))\ \land \ \mathsf{ret}_{\mathsf{opt}}\ =\ \operatorname{TypePrim}(\texttt{"i32"})
\end{array}
$$

$$
\mathsf{MainCheck}\ :\ \mathsf{Project}\ \rightharpoonup \ \mathsf{ok}
$$

**(Main-Ok)**

$$
\begin{array}{l}
\operatorname{Executable}(P)\quad \operatorname{MainDecls}(P)\ =\ [d]\quad \lnot \ \operatorname{MainGeneric}(d)\quad \operatorname{MainSigOk}(d) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{MainCheck}(P)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(Main-Bypass-NonExecutable)**

$$
\begin{array}{l}
\lnot \ \operatorname{Executable}(P) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{MainCheck}(P)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(Main-Multiple)**

$$
\begin{array}{l}
\operatorname{Executable}(P)\quad \mid \operatorname{MainDecls}(P)\mid \ >\ 1\quad c\ =\ \operatorname{Code}(\mathsf{Main}-\mathsf{Multiple}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{MainCheck}(P)\ \Uparrow \ c
\end{array}
$$

**(Main-Generic-Err)**

$$
\begin{array}{l}
\operatorname{Executable}(P)\quad \operatorname{MainDecls}(P)\ =\ [d]\quad \operatorname{MainGeneric}(d)\quad c\ =\ \operatorname{Code}(\mathsf{Main}-\mathsf{Generic}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{MainCheck}(P)\ \Uparrow \ c
\end{array}
$$

**(Main-Signature-Err)**

$$
\begin{array}{l}
\operatorname{Executable}(P)\quad \operatorname{MainDecls}(P)\ =\ [d]\quad \lnot \ \operatorname{MainSigOk}(d)\quad c\ =\ \operatorname{Code}(\mathsf{Main}-\mathsf{Signature}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{MainCheck}(P)\ \Uparrow \ c
\end{array}
$$

**(Main-Missing)**

$$
\begin{array}{l}
\operatorname{Executable}(P)\quad \operatorname{MainDecls}(P)\ =\ []\quad c\ =\ \operatorname{Code}(\mathsf{Main}-\mathsf{Missing}) \\
\rule{18em}{0.4pt} \\
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
\operatorname{BindParams}([\langle \mathsf{mode}_{1},\ x_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle \mathsf{mode}_{n},\ x_{n},\ T_{n}\rangle ],\ [v_{1},\ \ldots ,\ v_{n}])\ =\ [\langle x_{1},\ v_{1}\rangle ,\ \ldots ,\ \langle x_{n},\ v_{n}\rangle ] \\
\mathsf{ArgPassJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{EvalArgsSigma}(\mathsf{params},\ \mathsf{args},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma '),\ \Gamma \ \vdash \ \operatorname{EvalRecvSigma}(\mathsf{base},\ \mathsf{mode},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\} \\
\mathsf{ArgVal}\ =\ \{v,\ \operatorname{Alias}(\mathsf{addr})\}
\end{array}
$$

$$
\mathsf{CallJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{EvalArgsSigma}(\mathsf{params},\ \mathsf{args},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma '),\ \Gamma \ \vdash \ \operatorname{EvalRecvSigma}(\mathsf{base},\ \mathsf{mode},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma '),\ \Gamma \ \vdash \ \operatorname{ApplyRegionProc}(\mathsf{name},\ \mathsf{vec}_{v},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma '),\ \Gamma \ \vdash \ \operatorname{ApplyCancelProc}(\mathsf{name},\ \mathsf{vec}_{v},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma '),\ \Gamma \ \vdash \ \operatorname{ApplyProcSigma}(\mathsf{proc},\ \mathsf{vec}_{v},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma '),\ \Gamma \ \vdash \ \operatorname{ApplyRecordCtorSigma}(p,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma '),\ \Gamma \ \vdash \ \operatorname{ApplyMethodSigma}(\mathsf{base},\ \mathsf{name},\ v_{\mathsf{self}},\ v_{\mathsf{arg}},\ \mathsf{vec}_{v},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\}
$$

$$
\begin{array}{l}
\operatorname{CallTarget}(\operatorname{FuncVal}(\mathsf{sym}))\ =\ \mathsf{proc}\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{proc})\ \Downarrow \ \mathsf{sym}\ \land \ (\mathsf{proc}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \lor \ \mathsf{proc}\ =\ \operatorname{ExternProcDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)) \\
\operatorname{CallTarget}(\operatorname{RecordCtor}(p))\ =\ \operatorname{RecordCtor}(p) \\
\operatorname{MethodTarget}(\operatorname{RecordValue}(\operatorname{TypePath}(p),\ \mathsf{fs}),\ \mathsf{name})\ =\ m\ \Leftrightarrow \ \operatorname{LookupMethod}(\operatorname{TypePath}(p),\ \mathsf{name})\ =\ m \\
\operatorname{MethodTarget}(v_{\mathsf{self}},\ \mathsf{name})\ =\ m\ \land \ m.\mathsf{body}\ =\ \bot \ \land \ \lnot \ \exists \ \mathsf{vec}_{v},\ \mathsf{out}.\ \Gamma \ \vdash \ \operatorname{PrimCall}(\operatorname{MethodOwner}(m),\ \operatorname{MethodName}(m),\ v_{\mathsf{self}},\ \mathsf{vec}_{v})\ \Downarrow \ \mathsf{out}\ \Rightarrow \ \operatorname{IllFormed}(\operatorname{MethodTarget}(v_{\mathsf{self}},\ \mathsf{name}))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{RegionProcParams}(\mathsf{name})\ =\ \mathsf{params}\ \Leftrightarrow \ \operatorname{RegionProcSig}(\texttt{Region::}\mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle  \\
\operatorname{CancelProcParams}(\mathsf{name})\ =\ \mathsf{params}\ \Leftrightarrow \ \operatorname{CancelTokenProcSig}(\texttt{CancelToken::}\mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle 
\end{array}
$$

$$
\operatorname{SynthParams}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ])\ =\ [\langle m_{1},\ \bot ,\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ \bot ,\ T_{n}\rangle ]
$$

$$
\begin{array}{l}
\operatorname{CalleeProc}(\operatorname{Identifier}(x))\ =\ \mathsf{proc}\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{ResolveValueName}(x)\ \Downarrow \ \mathsf{ent}\ \land \ \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ \mathsf{mp}\ \land \ \mathsf{name}\ =\ (\mathsf{ent}.\mathsf{target}_{\mathsf{opt}}\ \mathsf{if}\ \mathsf{present},\ \mathsf{else}\ x)\ \land \ \operatorname{DeclOf}(\mathsf{mp},\ \mathsf{name})\ =\ \mathsf{proc}\ \land \ (\mathsf{proc}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \lor \ \mathsf{proc}\ =\ \operatorname{ExternProcDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)) \\
\operatorname{CalleeProc}(\operatorname{Path}(\mathsf{path},\ \mathsf{name}))\ =\ \mathsf{proc}\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{ResolveQualified}(\mathsf{path},\ \mathsf{name},\ \mathsf{ValueKind})\ \Downarrow \ \mathsf{ent}\ \land \ \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ \mathsf{mp}\ \land \ \mathsf{name}'\ =\ (\mathsf{ent}.\mathsf{target}_{\mathsf{opt}}\ \mathsf{if}\ \mathsf{present},\ \mathsf{else}\ \mathsf{name})\ \land \ \operatorname{DeclOf}(\mathsf{mp},\ \mathsf{name}')\ =\ \mathsf{proc}\ \land \ (\mathsf{proc}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \lor \ \mathsf{proc}\ =\ \operatorname{ExternProcDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Params}(\operatorname{Call}(\mathsf{callee},\ \mathsf{args}))\ = \\
\ \{\ \mathsf{proc}.\mathsf{params}\quad \mathsf{if}\ \operatorname{CalleeProc}(\mathsf{callee})\ =\ \mathsf{proc} \\
\quad \operatorname{SynthParams}(\mathsf{params})\quad \mathsf{if}\ \operatorname{ExprType}(\mathsf{callee})\ =\ \operatorname{TypeFunc}(\mathsf{params},\ \_) \\
\quad \bot \quad \mathsf{otherwise}\ \}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ReturnOut}(\operatorname{Val}(v))\ =\ \operatorname{Val}(v) \\
\operatorname{ReturnOut}(\operatorname{Ctrl}(\operatorname{Return}(v)))\ =\ \operatorname{Val}(v) \\
\operatorname{ReturnOut}(\operatorname{Ctrl}(\mathsf{Panic}))\ =\ \operatorname{Ctrl}(\mathsf{Panic}) \\
\operatorname{ReturnOut}(\operatorname{Ctrl}(\mathsf{Abort}))\ =\ \operatorname{Ctrl}(\mathsf{Abort}) \\
\operatorname{ReturnOut}(\operatorname{Ctrl}(\operatorname{Break}(v_{\mathsf{opt}})))\ =\ \bot  \\
\operatorname{ReturnOut}(\operatorname{Ctrl}(\mathsf{Continue}))\ =\ \bot  \\
\operatorname{ReturnOut}(\mathsf{out})\ =\ \bot \ \Rightarrow \ \operatorname{IllFormed}(\operatorname{ReturnOut}(\mathsf{out}))
\end{array}
$$

**(EvalArgsSigma-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalArgsSigma}([],\ [],\ \sigma )\ \Downarrow \ (\operatorname{Val}([]),\ \sigma )
\end{array}
$$

**(EvalArgsSigma-Cons-Move)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{MovedArg}(\mathsf{moved},\ e),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalArgsSigma}(\mathsf{ps},\ \mathsf{as},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{v}),\ \sigma_{2} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalArgsSigma}([\langle \texttt{move},\ x,\ T_{p}\rangle ]\ \mathbin{++} \ \mathsf{ps},\ [\langle \mathsf{moved},\ e,\ \_\rangle ]\ \mathbin{++} \ \mathsf{as},\ \sigma )\ \Downarrow \ (\operatorname{Val}([v]\ \mathbin{++} \ \mathsf{vec}_{v}),\ \sigma_{2} )
\end{array}
$$

**(EvalArgsSigma-Cons-Ref)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{AddrOfSigma}(\operatorname{RefArgExpr}(e),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{addr}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalArgsSigma}(\mathsf{ps},\ \mathsf{as},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{v}),\ \sigma_{2} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalArgsSigma}([\langle \bot ,\ x,\ T_{p}\rangle ]\ \mathbin{++} \ \mathsf{ps},\ [\langle \mathsf{moved},\ e,\ \_\rangle ]\ \mathbin{++} \ \mathsf{as},\ \sigma )\ \Downarrow \ (\operatorname{Val}([\operatorname{Alias}(\mathsf{addr})]\ \mathbin{++} \ \mathsf{vec}_{v}),\ \sigma_{2} )
\end{array}
$$

**(EvalArgsSigma-Ctrl-Move)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{MovedArg}(\mathsf{moved},\ e),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalArgsSigma}([\langle \texttt{move},\ x,\ T_{p}\rangle ]\ \mathbin{++} \ \mathsf{ps},\ [\langle \mathsf{moved},\ e,\ \_\rangle ]\ \mathbin{++} \ \mathsf{as},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(EvalArgsSigma-Ctrl-Ref)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{AddrOfSigma}(\operatorname{RefArgExpr}(e),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalArgsSigma}([\langle \bot ,\ x,\ T_{p}\rangle ]\ \mathbin{++} \ \mathsf{ps},\ [\langle \mathsf{moved},\ e,\ \_\rangle ]\ \mathbin{++} \ \mathsf{as},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(ApplyRegionProc-NewScoped)**

$$
\begin{array}{l}
\mathsf{name}\ =\ \texttt{new\_scoped}\quad \mathsf{vec}_{v}\ =\ [\mathsf{opts}]\quad \operatorname{RegionNewScoped}(\sigma ,\ \mathsf{opts})\ \Downarrow \ (\sigma ',\ v) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ApplyRegionProc}(\mathsf{name},\ \mathsf{vec}_{v},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma ')
\end{array}
$$

**(ApplyRegionProc-Alloc)**

$$
\begin{array}{l}
\mathsf{name}\ =\ \texttt{alloc}\quad \mathsf{vec}_{v}\ =\ [v_{r},\ v]\quad \operatorname{RegionAllocProc}(\sigma ,\ v_{r},\ v)\ \Downarrow \ (\sigma ',\ v') \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ApplyRegionProc}(\mathsf{name},\ \mathsf{vec}_{v},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma ')
\end{array}
$$

**(ApplyRegionProc-Reset)**

$$
\begin{array}{l}
\mathsf{name}\ =\ \texttt{reset\_unchecked}\quad \mathsf{vec}_{v}\ =\ [v_{r}]\quad \operatorname{RegionResetProc}(\sigma ,\ v_{r})\ \Downarrow \ (\sigma ',\ v') \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ApplyRegionProc}(\mathsf{name},\ \mathsf{vec}_{v},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma ')
\end{array}
$$

**(ApplyRegionProc-Freeze)**

$$
\begin{array}{l}
\mathsf{name}\ =\ \texttt{freeze}\quad \mathsf{vec}_{v}\ =\ [v_{r}]\quad \operatorname{RegionFreezeProc}(\sigma ,\ v_{r})\ \Downarrow \ (\sigma ',\ v') \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ApplyRegionProc}(\mathsf{name},\ \mathsf{vec}_{v},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma ')
\end{array}
$$

**(ApplyRegionProc-Thaw)**

$$
\begin{array}{l}
\mathsf{name}\ =\ \texttt{thaw}\quad \mathsf{vec}_{v}\ =\ [v_{r}]\quad \operatorname{RegionThawProc}(\sigma ,\ v_{r})\ \Downarrow \ (\sigma ',\ v') \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ApplyRegionProc}(\mathsf{name},\ \mathsf{vec}_{v},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma ')
\end{array}
$$

**(ApplyRegionProc-Free)**

$$
\begin{array}{l}
\mathsf{name}\ =\ \texttt{free\_unchecked}\quad \mathsf{vec}_{v}\ =\ [v_{r}]\quad \operatorname{RegionFreeProc}(\sigma ,\ v_{r})\ \Downarrow \ (\sigma ',\ v') \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ApplyRegionProc}(\mathsf{name},\ \mathsf{vec}_{v},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma ')
\end{array}
$$

**(ApplyCancelProc-New)**

$$
\begin{array}{l}
\mathsf{name}\ =\ \texttt{new}\quad \mathsf{vec}_{v}\ =\ []\quad \operatorname{CancelNew}()\ \Downarrow \ v \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ApplyCancelProc}(\mathsf{name},\ \mathsf{vec}_{v},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma )
\end{array}
$$

**(ApplyProcSigma)**

$$
\begin{array}{l}
\operatorname{BindParams}(\mathsf{proc}.\mathsf{params},\ \mathsf{vec}_{v})\ =\ \mathsf{binds}\quad \operatorname{BlockEnter}(\sigma ,\ \mathsf{binds})\ \Downarrow \ (\sigma_{1} ,\ \mathsf{scope})\quad \Gamma \ \vdash \ \operatorname{EvalBlockBodySigma}(\mathsf{proc}.\mathsf{body},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )\quad \operatorname{BlockExit}(\sigma_{2} ,\ \mathsf{scope},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma_{3} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ApplyProcSigma}(\mathsf{proc},\ \mathsf{vec}_{v},\ \sigma )\ \Downarrow \ (\operatorname{ReturnOut}(\mathsf{out}'),\ \sigma_{3} )
\end{array}
$$

**(EvalSigma-Call-Proc)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{callee},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{c}),\ \sigma_{1} )\quad \mathsf{proc}\ =\ \operatorname{CallTarget}(v_{c})\quad \Gamma \ \vdash \ \operatorname{EvalArgsSigma}(\mathsf{proc}.\mathsf{params},\ \mathsf{args},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{v}),\ \sigma_{2} )\quad \Gamma \ \vdash \ \operatorname{ApplyProcSigma}(\mathsf{proc},\ \mathsf{vec}_{v},\ \sigma_{2} )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Call}(\mathsf{callee},\ \mathsf{args}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} )
\end{array}
$$

### 15.1.6 Lowering

**(CG-Item-Procedure)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ProcedureDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\quad R\ =\ \operatorname{ProcReturn}(\mathsf{ret}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{LowerBlock}(\mathsf{body})\ \Downarrow \ \langle \mathsf{IR},\ v\rangle \quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym}\quad \mathsf{params}'\ =\ \operatorname{CodegenParams}(\mathsf{params}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CodegenItem}(\mathsf{item})\ \Downarrow \ [\operatorname{ProcIR}(\mathsf{sym},\ \mathsf{params}',\ R,\ \mathsf{IR})]
\end{array}
$$

Program-entry handling for `main` is owned by §24.4.

### 15.1.7 Diagnostics

Diagnostics are defined for missing explicit return annotations, duplicate parameter names, non-unit procedures without an explicit trailing `return`, and bodies whose result type does not match the declared return type.

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
\Gamma \ \vdash \ \operatorname{ParseOverrideOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{ov})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{0}),\ \texttt{procedure})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{0}))\ \Downarrow \ (P_{1},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseGenericParamsOpt}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseMethodSignature}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{receiver},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseContractClauseOpt}(P_{3})\ \Downarrow \ (P_{4},\ \mathsf{contract}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(P_{4})\ \Downarrow \ (P_{5},\ \mathsf{body}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseMethodDefAfterVis}(P,\ \mathsf{vis},\ \mathsf{attrs}_{\mathsf{opt}})\ \Downarrow \ (P_{5},\ \langle \mathsf{MethodDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{ov},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{receiver},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \operatorname{SpanBetween}(P,\ P_{5}),\ []\rangle )
\end{array}
$$

**(Parse-Override-Yes)**
IsKw(Tok(P), `override`)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseOverrideOpt}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \mathsf{true})
\end{array}
$$

**(Parse-Override-No)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{override}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseOverrideOpt}(P)\ \Downarrow \ (P,\ \mathsf{false})
\end{array}
$$

**(Parse-MethodSignature)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseReceiver}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ r)\quad \Gamma \ \vdash \ \operatorname{ParseMethodParams}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{params})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{")"})\quad \Gamma \ \vdash \ \operatorname{ParseReturnOpt}(\operatorname{Advance}(P_{2}))\ \Downarrow \ (P_{3},\ \mathsf{ret}_{\mathsf{opt}}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseMethodSignature}(P)\ \Downarrow \ (P_{3},\ r,\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}})
\end{array}
$$

**(Parse-StateMethodSignature-Receiver)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseReceiver}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ r)\quad \Gamma \ \vdash \ \operatorname{ParseMethodParams}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{params})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{")"})\quad \Gamma \ \vdash \ \operatorname{ParseReturnOpt}(\operatorname{Advance}(P_{2}))\ \Downarrow \ (P_{3},\ \mathsf{ret}_{\mathsf{opt}}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseStateMethodSignature}(P)\ \Downarrow \ (P_{3},\ r,\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}})
\end{array}
$$

**(Parse-MethodParams-None)**
IsPunc(Tok(P), ")")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseMethodParams}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-MethodParams-Comma)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParseParamList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{params}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseMethodParams}(P)\ \Downarrow \ (P_{1},\ \mathsf{params})
\end{array}
$$

**(Parse-Receiver-Short-Const)**
IsOp(Tok(P), "~")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseReceiver}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \operatorname{ReceiverShorthand}(\texttt{const}))
\end{array}
$$

**(Parse-Receiver-Short-Unique)**
IsOp(Tok(P), "~!")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseReceiver}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \operatorname{ReceiverShorthand}(\texttt{unique}))
\end{array}
$$

**(Parse-Receiver-Short-Shared)**
IsOp(Tok(P), "~%")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseReceiver}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \operatorname{ReceiverShorthand}(\texttt{shared}))
\end{array}
$$

**(Parse-Receiver-Explicit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseParamModeOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{mode})\quad \operatorname{IsIdent}(\operatorname{Tok}(P_{1}))\quad \operatorname{Lexeme}(\operatorname{Tok}(P_{1}))\ =\ \texttt{self}\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P_{1})),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(\operatorname{Advance}(P_{1})))\ \Downarrow \ (P_{2},\ \mathsf{ty}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseReceiver}(P)\ \Downarrow \ (P_{2},\ \operatorname{ReceiverExplicit}(\mathsf{mode},\ \mathsf{ty}))
\end{array}
$$

### 15.2.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{MethodDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{override},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{receiver},\ \mathsf{params},\ \mathsf{return}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}\rangle  \\
\mathsf{Receiver}\ \in \ \{\operatorname{ReceiverShorthand}(\mathsf{perm}),\ \operatorname{ReceiverExplicit}(\mathsf{mode}_{\mathsf{opt}},\ \mathsf{type})\} \\
\mathsf{perm}\ \in \ \{\texttt{const},\ \texttt{unique},\ \texttt{shared}\} \\
\mathsf{mode}_{\mathsf{opt}}\ \in \ \{\texttt{move},\ \bot \}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Fields}(R)\ =\ [\ f\ \mid \ f\ \in \ R.\mathsf{members}\ \land \ f\ \mathsf{is}\ \mathsf{FieldDecl}\ ] \\
\operatorname{Methods}(R)\ =\ [\ m\ \mid \ m\ \in \ R.\mathsf{members}\ \land \ m\ \mathsf{is}\ \mathsf{MethodDecl}\ ] \\
\mathsf{Self}_{R}\ =\ \operatorname{TypePath}(\operatorname{RecordPath}(R))
\end{array}
$$

$$
\operatorname{SelfType}(R,\ \mathsf{ty})\ \Leftrightarrow \ \mathsf{ty}\ =\ \mathsf{Self}_{R}\ \lor \ \exists \ p.\ \mathsf{ty}\ =\ \operatorname{TypePerm}(p,\ \mathsf{Self}_{R})
$$

$$
\begin{array}{l}
\operatorname{RecvType}(T,\ \operatorname{ReceiverShorthand}(\texttt{const}))\ =\ \operatorname{TypePerm}(\texttt{const},\ T) \\
\operatorname{RecvType}(T,\ \operatorname{ReceiverShorthand}(\texttt{unique}))\ =\ \operatorname{TypePerm}(\texttt{unique},\ T) \\
\operatorname{RecvType}(T,\ \operatorname{ReceiverShorthand}(\texttt{shared}))\ =\ \operatorname{TypePerm}(\texttt{shared},\ T) \\
\operatorname{RecvType}(T,\ \operatorname{ReceiverExplicit}(\mathsf{mode}_{\mathsf{opt}},\ \mathsf{ty}))\ =\ \operatorname{SubstSelf}(T,\ \mathsf{ty})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{RecvMode}(\operatorname{ReceiverShorthand}(\_))\ =\ \bot  \\
\operatorname{RecvMode}(\operatorname{ReceiverExplicit}(\mathsf{mode}_{\mathsf{opt}},\ \_))\ =\ \mathsf{mode}_{\mathsf{opt}}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{PermOf}(\operatorname{TypePerm}(p,\ \_))\ =\ p \\
\operatorname{PermOf}(\mathsf{ty})\ =\ \texttt{const}\quad \mathsf{otherwise} \\
\operatorname{RecvPerm}(T,\ r)\ =\ \operatorname{PermOf}(\operatorname{RecvType}(T,\ r))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ParamSig_T}(T,\ \mathsf{params})\ =\ [\langle \mathsf{mode},\ \operatorname{SubstSelf}(T,\ \mathsf{ty})\rangle \ \mid \ \langle \mathsf{mode},\ \mathsf{name},\ \mathsf{ty}\rangle \ \in \ \mathsf{params}] \\
\operatorname{ParamBinds_T}(T,\ \mathsf{params})\ =\ [\langle x_{1},\ \operatorname{SubstSelf}(T,\ T_{1})\rangle ,\ \ldots ,\ \langle x_{n},\ \operatorname{SubstSelf}(T,\ T_{n})\rangle ] \\
\operatorname{ReturnType_T}(T,\ m)\ =\ \operatorname{SubstSelf}(T,\ \operatorname{ReturnType}(m)) \\
\operatorname{Sig_T}(T,\ m)\ =\ \langle \operatorname{RecvType}(T,\ m.\mathsf{receiver}),\ \operatorname{ParamSig_T}(T,\ m.\mathsf{params}),\ \operatorname{SubstSelf}(T,\ \operatorname{ReturnType}(m))\rangle  \\
\operatorname{MethodParamsDecl}(T,\ m)\ =\ [\langle \operatorname{RecvMode}(m.\mathsf{receiver}),\ \texttt{self},\ \operatorname{RecvType}(T,\ m.\mathsf{receiver})\rangle ]\ \mathbin{++} \ m.\mathsf{params}
\end{array}
$$

### 15.2.4 Static Semantics

**(Recv-Explicit)**
SelfType(R, ty)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ReceiverExplicit}(\mathsf{mode}_{\mathsf{opt}},\ \mathsf{ty})\ :\ \operatorname{Recv}(R,\ \operatorname{PermOf}(\mathsf{ty}),\ \mathsf{mode}_{\mathsf{opt}})
\end{array}
$$

**(Record-Method-RecvSelf-Err)**

$$
\begin{array}{l}
\lnot \ \operatorname{SelfType}(R,\ \mathsf{ty}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ReceiverExplicit}(\mathsf{mode}_{\mathsf{opt}},\ \mathsf{ty})\ \Uparrow 
\end{array}
$$

**(Recv-Const)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ReceiverShorthand}(\texttt{const})\ :\ \operatorname{Recv}(R,\ \texttt{const},\ \bot )
\end{array}
$$

**(Recv-Unique)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ReceiverShorthand}(\texttt{unique})\ :\ \operatorname{Recv}(R,\ \texttt{unique},\ \bot )
\end{array}
$$

**(Recv-Shared)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ReceiverShorthand}(\texttt{shared})\ :\ \operatorname{Recv}(R,\ \texttt{shared},\ \bot )
\end{array}
$$

**(WF-Record-Method)**

$$
\begin{array}{l}
\mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \mathsf{params}_{\mathsf{gen}}\ =\ [P_{1},\ \ldots ,\ P_{n}]\quad \Gamma \ \vdash \ \langle P_{1};\ \ldots ;\ P_{n}\rangle \ \mathsf{wf}\quad \Gamma_{m} \ =\ \operatorname{BindTypeParams}(\Gamma ,\ \mathsf{params}_{\mathsf{gen}})\quad \Gamma_{m} \ \vdash \ r\ :\ \operatorname{Recv}(R,\ P,\ \mathsf{mode})\quad \mathsf{self}\ \notin \ \operatorname{ParamNames}(\mathsf{params})\quad \operatorname{Distinct}(\operatorname{ParamNames}(\mathsf{params}))\quad \forall \ \langle \_,\ \_,\ T_{i}\rangle \ \in \ \mathsf{params},\ \Gamma_{m} \ \vdash \ T_{i}\ \mathsf{wf}\quad (\mathsf{return}_{\mathsf{type}\_\mathsf{opt}}\ =\ \bot \ \lor \ \Gamma_{m} \ \vdash \ \mathsf{return}_{\mathsf{type}\_\mathsf{opt}}\ \mathsf{wf}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \langle \mathsf{MethodDecl},\ \_,\ \_,\ \_,\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ r,\ \mathsf{params},\ \mathsf{return}_{\mathsf{type}\_\mathsf{opt}},\ \_,\ \mathsf{body},\ \_,\ \_\rangle \ :\ \operatorname{MethodOK}(R,\ P,\ \mathsf{mode})
\end{array}
$$

**(T-Record-Method-Body)**

$$
\begin{array}{l}
\Gamma \ \vdash \ m\ :\ \operatorname{MethodOK}(R,\ P,\ \mathsf{mode})\quad T_{\mathsf{self}}\ =\ \operatorname{RecvType}(\mathsf{Self}_{R},\ m.\mathsf{receiver})\quad R_{m}\ =\ \operatorname{ReturnType_T}(\mathsf{Self}_{R},\ m)\quad R_{b}\ =\ \operatorname{BodyReturnType}(R_{m})\quad \Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \operatorname{IntroAll}(\Gamma_{0} ,\ [\langle \texttt{self},\ T_{\mathsf{self}}\rangle ]\ \mathbin{++} \ \operatorname{ParamBinds_T}(\mathsf{Self}_{R},\ m.\mathsf{params}))\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} ;\ R_{m};\ \bot \ \vdash \ m.\mathsf{body}\ :\ T_{b}\quad \Gamma \ \vdash \ T_{b}\ \mathrel{<:} \ R_{b}\quad (R_{b}\ \ne \ \operatorname{TypePrim}(\texttt{"()"})\ \Rightarrow \ \operatorname{ExplicitReturn}(m.\mathsf{body})) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ m\ :\ \operatorname{MethodBodyOK}(R)
\end{array}
$$

**(WF-Record-Methods)**

$$
\begin{array}{l}
\operatorname{Distinct}(\operatorname{MethodNames}(R))\quad \forall \ m\ \in \ \operatorname{Methods}(R),\ \Gamma \ \vdash \ m\ :\ \operatorname{MethodOK}(R,\ \_,\ \_)\quad \Gamma \ \vdash \ m\ :\ \operatorname{MethodBodyOK}(R) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Methods}(R)\ :\ \mathsf{ok}
\end{array}
$$

**(Record-Method-Dup)**

$$
\begin{array}{l}
\lnot \ \operatorname{Distinct}(\operatorname{MethodNames}(R)) \\
\rule{18em}{0.4pt} \\
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
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk}([],\ [])
\end{array}
$$

**(Args-Cons)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \operatorname{MovedArg}(\mathsf{moved},\ e)\ \Leftarrow \ T_{p}\ \dashv \ \emptyset \quad \mathsf{moved}\ =\ \mathsf{true}\quad \Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk}(\mathsf{ps},\ \mathsf{as}) \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk}([\langle \texttt{move},\ x,\ T_{p}\rangle ]\ \mathbin{++} \ \mathsf{ps},\ [\langle \mathsf{moved},\ e,\ \_\rangle ]\ \mathbin{++} \ \mathsf{as})
\end{array}
$$

**(Args-Cons-Ref)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \operatorname{RefArgExpr}(e)\ \Leftarrow_{\mathsf{place}} \ T_{p}\quad \operatorname{AddrOfOk}(\operatorname{RefArgExpr}(e))\quad \mathsf{moved}\ =\ \mathsf{false}\quad \Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk}(\mathsf{ps},\ \mathsf{as}) \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk}([\langle \bot ,\ x,\ T_{p}\rangle ]\ \mathbin{++} \ \mathsf{ps},\ [\langle \mathsf{moved},\ e,\ \_\rangle ]\ \mathbin{++} \ \mathsf{as})
\end{array}
$$

$$
\operatorname{RecvArgOk}(\mathsf{base},\ \mathsf{mode})\ \Leftrightarrow \ (\mathsf{mode}\ =\ \bot \ \land \ \operatorname{AddrOfOk}(\operatorname{RefArgExpr}(\mathsf{base})))\ \lor \ (\mathsf{mode}\ =\ \texttt{move}\ \land \ \exists \ p.\ \mathsf{base}\ =\ \operatorname{MoveExpr}(p))
$$

**(T-Record-MethodCall)**

$$
\begin{array}{l}
\operatorname{RecvBaseType}(\mathsf{base},\ \operatorname{RecvMode}(m.\mathsf{receiver}))\ =\ P_{\mathsf{caller}}\ R_{\mathsf{rec}}\quad \operatorname{LookupMethod}(R_{\mathsf{rec}},\ \mathsf{name})\ =\ m\quad \operatorname{RecvPerm}(R_{\mathsf{rec}},\ m.\mathsf{receiver})\ =\ P_{\mathsf{method}}\quad \operatorname{PermAdmits}(P_{\mathsf{caller}},\ P_{\mathsf{method}})\quad \operatorname{RecvArgOk}(\mathsf{base},\ \operatorname{RecvMode}(m.\mathsf{receiver}))\quad \Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk}(m.\mathsf{params},\ \mathsf{args}) \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{MethodCall}(\mathsf{base},\ \mathsf{name},\ \mathsf{args})\ :\ \operatorname{ReturnType}(m)
\end{array}
$$

Class and state-method owners (§14.3 and §13.3) add receiver restrictions specific to `Self` and modal-state receivers, but reuse these common receiver and argument-passing forms.

### 15.2.5 Dynamic Semantics

$$
\begin{array}{l}
\operatorname{RecvArgMode}(\mathsf{base})\ =\ \texttt{move}\ \Leftrightarrow \ \exists \ p.\ \mathsf{base}\ =\ \operatorname{MoveExpr}(p) \\
\operatorname{RecvArgMode}(\mathsf{base})\ =\ \bot \ \Leftrightarrow \ \lnot \ \exists \ p.\ \mathsf{base}\ =\ \operatorname{MoveExpr}(p) \\
\operatorname{MethodOf}(\mathsf{base},\ \mathsf{name})\ =\ \mathsf{md}\ \Leftrightarrow \ \operatorname{StripPerm}(\operatorname{ExprType}(\mathsf{base}))\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\ \land \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ \operatorname{LookupStateMethod}(M,\ S,\ \mathsf{name})\ =\ \mathsf{md} \\
\operatorname{MethodOf}(\mathsf{base},\ \mathsf{name})\ =\ \mathsf{tr}\ \Leftrightarrow \ \operatorname{StripPerm}(\operatorname{ExprType}(\mathsf{base}))\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\ \land \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ \operatorname{LookupTransition}(M,\ S,\ \mathsf{name})\ =\ \mathsf{tr} \\
\operatorname{MethodOf}(\mathsf{base},\ \mathsf{name})\ =\ m\ \Leftrightarrow \ \operatorname{LookupMethod}(\operatorname{StripPerm}(\operatorname{ExprType}(\mathsf{base})),\ \mathsf{name})\ =\ m \\
\operatorname{RecvBase}(\mathsf{base},\ \mathsf{name})\ =\ T\ \Leftrightarrow \ \operatorname{MethodOf}(\mathsf{base},\ \mathsf{name})\ =\ m\ \land \ T\ =\ \operatorname{StripPerm}(\operatorname{ExprType}(\mathsf{base}))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{RecvParams}(\mathsf{base},\ \mathsf{name})\ =\ \operatorname{StateMethodParams}(M,\ S,\ \mathsf{md})\ \Leftrightarrow \ \operatorname{StripPerm}(\operatorname{ExprType}(\mathsf{base}))\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\ \land \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ \operatorname{LookupStateMethod}(M,\ S,\ \mathsf{name})\ =\ \mathsf{md} \\
\operatorname{RecvParams}(\mathsf{base},\ \mathsf{name})\ =\ \operatorname{TransitionParams}(M,\ S,\ \mathsf{tr})\ \Leftrightarrow \ \operatorname{StripPerm}(\operatorname{ExprType}(\mathsf{base}))\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\ \land \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ \operatorname{LookupTransition}(M,\ S,\ \mathsf{name})\ =\ \mathsf{tr} \\
\operatorname{RecvParams}(\mathsf{base},\ \mathsf{name})\ =\ [\langle \operatorname{RecvMode}(m.\mathsf{receiver}),\ \texttt{self},\ \operatorname{RecvType}(T,\ m.\mathsf{receiver})\rangle ]\ \mathbin{++} \ m.\mathsf{params}\ \Leftrightarrow \ \operatorname{LookupMethod}(\operatorname{StripPerm}(\operatorname{ExprType}(\mathsf{base})),\ \mathsf{name})\ =\ m\ \land \ T\ =\ \operatorname{StripPerm}(\operatorname{ExprType}(\mathsf{base}))
\end{array}
$$

**(EvalRecvSigma-Move)**

$$
\begin{array}{l}
\mathsf{mode}\ =\ \texttt{move}\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{base},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{self}}),\ \sigma_{1} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalRecvSigma}(\mathsf{base},\ \mathsf{mode},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\langle v_{\mathsf{self}},\ v_{\mathsf{self}}\rangle ),\ \sigma_{1} )
\end{array}
$$

**(EvalRecvSigma-Ref-Dyn)**

$$
\begin{array}{l}
\mathsf{mode}\ =\ \bot \quad \Gamma \ \vdash \ \operatorname{AddrOfSigma}(\operatorname{RefArgExpr}(\mathsf{base}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{addr}),\ \sigma_{1} )\quad \operatorname{ReadAddr}(\sigma_{1} ,\ \mathsf{addr})\ =\ \operatorname{Dyn}(\mathsf{Cl},\ \operatorname{RawPtr}(\texttt{imm},\ \mathsf{addr}_{d}),\ T)\quad \operatorname{DynAddrState}(\sigma_{1} ,\ \mathsf{addr}_{d})\ =\ \texttt{Valid} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalRecvSigma}(\mathsf{base},\ \mathsf{mode},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\langle \operatorname{Dyn}(\mathsf{Cl},\ \operatorname{RawPtr}(\texttt{imm},\ \mathsf{addr}_{d}),\ T),\ \operatorname{Alias}(\mathsf{addr}_{d})\rangle ),\ \sigma_{1} )
\end{array}
$$

**(EvalRecvSigma-Ref-Dyn-Expired)**

$$
\begin{array}{l}
\mathsf{mode}\ =\ \bot \quad \Gamma \ \vdash \ \operatorname{AddrOfSigma}(\operatorname{RefArgExpr}(\mathsf{base}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{addr}),\ \sigma_{1} )\quad \operatorname{ReadAddr}(\sigma_{1} ,\ \mathsf{addr})\ =\ \operatorname{Dyn}(\mathsf{Cl},\ \operatorname{RawPtr}(\texttt{imm},\ \mathsf{addr}_{d}),\ T)\quad \operatorname{DynAddrState}(\sigma_{1} ,\ \mathsf{addr}_{d})\ =\ \texttt{Expired} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalRecvSigma}(\mathsf{base},\ \mathsf{mode},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma_{1} )
\end{array}
$$

**(EvalRecvSigma-Ref)**

$$
\begin{array}{l}
\mathsf{mode}\ =\ \bot \quad \Gamma \ \vdash \ \operatorname{AddrOfSigma}(\operatorname{RefArgExpr}(\mathsf{base}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{addr}),\ \sigma_{1} )\quad \operatorname{ReadAddr}(\sigma_{1} ,\ \mathsf{addr})\ =\ v_{\mathsf{self}}\quad \lnot \ (\exists \ \mathsf{Cl},\ \mathsf{addr}_{d},\ T.\ v_{\mathsf{self}}\ =\ \operatorname{Dyn}(\mathsf{Cl},\ \operatorname{RawPtr}(\texttt{imm},\ \mathsf{addr}_{d}),\ T)) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalRecvSigma}(\mathsf{base},\ \mathsf{mode},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\langle v_{\mathsf{self}},\ \operatorname{Alias}(\mathsf{addr})\rangle ),\ \sigma_{1} )
\end{array}
$$

**(EvalRecvSigma-Ctrl-Move)**

$$
\begin{array}{l}
\mathsf{mode}\ =\ \texttt{move}\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{base},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalRecvSigma}(\mathsf{base},\ \mathsf{mode},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(EvalRecvSigma-Ctrl-Ref)**

$$
\begin{array}{l}
\mathsf{mode}\ =\ \bot \quad \Gamma \ \vdash \ \operatorname{AddrOfSigma}(\operatorname{RefArgExpr}(\mathsf{base}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalRecvSigma}(\mathsf{base},\ \mathsf{mode},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

$$
\operatorname{BindParams}(m,\ v_{\mathsf{self}},\ \mathsf{vecv})\ =\ \{\texttt{self}\ \mapsto \ v_{\mathsf{self}}\}\ \cup \ \{\ x_{i}\ \mapsto \ v_{i}\ \mid \ m.\mathsf{params}\ =\ [\langle \_,\ x_{i},\ \_\rangle ],\ \mathsf{vecv}\ =\ [v_{i}]\ \}
$$

**(ApplyMethodSigma-Prim)**

$$
\begin{array}{l}
m\ =\ \operatorname{MethodTarget}(v_{\mathsf{self}},\ \mathsf{name})\quad \operatorname{MethodOwner}(m)\ =\ \mathsf{owner}\quad \operatorname{MethodName}(m)\ =\ \mathsf{name}\quad \Gamma \ \vdash \ \operatorname{PrimCall}(\mathsf{owner},\ \mathsf{name},\ v_{\mathsf{self}},\ \mathsf{vec}_{v})\ \Downarrow \ \mathsf{out} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ApplyMethodSigma}(\mathsf{base},\ \mathsf{name},\ v_{\mathsf{self}},\ v_{\mathsf{arg}},\ \mathsf{vec}_{v},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma )
\end{array}
$$

**(ApplyMethodSigma)**

$$
\begin{array}{l}
m\ =\ \operatorname{MethodTarget}(v_{\mathsf{self}},\ \mathsf{name})\quad \lnot \operatorname{IsTransition}(m)\quad \operatorname{BindParams}(\operatorname{RecvParams}(\mathsf{base},\ \mathsf{name}),\ [v_{\mathsf{arg}}]\ \mathbin{++} \ \mathsf{vec}_{v})\ =\ \mathsf{binds}\quad \operatorname{BlockEnter}(\sigma ,\ \mathsf{binds})\ \Downarrow \ (\sigma_{1} ,\ \mathsf{scope})\quad \Gamma \ \vdash \ \operatorname{EvalBlockBodySigma}(m.\mathsf{body},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )\quad \operatorname{BlockExit}(\sigma_{2} ,\ \mathsf{scope},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma_{3} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ApplyMethodSigma}(\mathsf{base},\ \mathsf{name},\ v_{\mathsf{self}},\ v_{\mathsf{arg}},\ \mathsf{vec}_{v},\ \sigma )\ \Downarrow \ (\operatorname{ReturnOut}(\mathsf{out}'),\ \sigma_{3} )
\end{array}
$$

### 15.2.6 Lowering

Methods lower as procedures whose first lowered parameter is the receiver.

**(Mangle-Record-Method)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{MethodDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{override},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{receiver},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \operatorname{ScopedSym}(\mathsf{item})
\end{array}
$$

**(Mangle-Class-Method)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ClassMethodDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{receiver},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \operatorname{ScopedSym}(\mathsf{item})
\end{array}
$$

**(Mangle-State-Method)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StateMethodDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \operatorname{ScopedSym}(\mathsf{item})
\end{array}
$$

### 15.2.7 Diagnostics

Diagnostics are defined for explicit receivers whose type is not `Self` or a permission-qualified `Self`, duplicate method names, receiver-permission mismatches at call sites, invalid receiver passing mode, and direct user calls to the destructor protocol.

## 15.3 Overloading

### 15.3.1 Syntax

No additional surface syntax is introduced beyond ordinary procedure and method declarations.

### 15.3.2 Parsing

Overload resolution is not a parser concern in this chapter.

### 15.3.3 AST Representation / Form

$$
\begin{array}{l}
\operatorname{ClassDefaults}(T,\ \mathsf{name})\ =\ \{\ m\ \mid \ \exists \ \mathsf{Cl}\ \in \ \operatorname{Implements}(T).\ m\ \in \ \operatorname{ClassMethodTable}(\mathsf{Cl})\ \land \ m.\mathsf{name}\ =\ \mathsf{name}\ \land \ m.\mathsf{body}\ \ne \ \bot \ \} \\
\operatorname{LookupMethod}(T,\ \mathsf{name})\ =\ m\ \Leftrightarrow \ \operatorname{MethodByName}(T,\ \mathsf{name})\ =\ m \\
\operatorname{LookupMethod}(T,\ \mathsf{name})\ =\ m\ \Leftrightarrow \ \operatorname{MethodByName}(T,\ \mathsf{name})\ =\ \bot \ \land \ \mid \operatorname{ClassDefaults}(T,\ \mathsf{name})\mid \ =\ 1\ \land \ m\ \in \ \operatorname{ClassDefaults}(T,\ \mathsf{name}) \\
\operatorname{LookupMethod}(T,\ \mathsf{name})\ =\ \bot \ \Leftrightarrow \ \operatorname{MethodByName}(T,\ \mathsf{name})\ =\ \bot \ \land \ (\mid \operatorname{ClassDefaults}(T,\ \mathsf{name})\mid \ =\ 0\ \lor \ \mid \operatorname{ClassDefaults}(T,\ \mathsf{name})\mid \ >\ 1)
\end{array}
$$

### 15.3.4 Static Semantics

**(LookupMethod-NotFound)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{base}\ :\ T_{b}\quad \operatorname{MethodByName}(\operatorname{StripPerm}(T_{b}),\ \mathsf{name})\ =\ \bot \quad \operatorname{ClassDefaults}(\operatorname{StripPerm}(T_{b}),\ \mathsf{name})\ =\ \emptyset  \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{MethodCall}(\mathsf{base},\ \mathsf{name},\ \mathsf{args})\ \Uparrow 
\end{array}
$$

**(LookupMethod-Ambig)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{base}\ :\ T_{b}\quad \operatorname{MethodByName}(\operatorname{StripPerm}(T_{b}),\ \mathsf{name})\ =\ \bot \quad \mid \operatorname{ClassDefaults}(\operatorname{StripPerm}(T_{b}),\ \mathsf{name})\mid \ >\ 1 \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{MethodCall}(\mathsf{base},\ \mathsf{name},\ \mathsf{args})\ \Uparrow 
\end{array}
$$

Free-procedure overload resolution is complete before ordinary `Call` typing.

For a free call whose callee names an overload set `O`:

1. Candidate selection: retain procedures in `O` whose parameter count equals the argument count.
2. Type filtering: eliminate candidates for which any argument is incompatible with the corresponding parameter under the call-argument compatibility rules of §16.3.4.
3. Exact-match preference: if multiple candidates remain, retain those with the maximal number of exact argument-type matches.
4. Genericity preference: if both generic and non-generic candidates remain, retain only the non-generic candidates.
5. Constraint specificity: if multiple generic candidates remain, retain only those whose bounds and predicate requirements are pointwise at least as specific as every remaining alternative, with at least one strict improvement.
6. If exactly one candidate remains, that candidate is selected.
7. If no candidate remains, the call is ill-formed with `E-SEM-3031`.
8. If multiple candidates remain after all preference stages, the call is ill-formed with `E-SEM-3030`.

Two visible overloads with the same name MUST NOT have identical parameter-mode/type signatures after generic-parameter erasure. Such a declaration set is ill-formed with `E-SEM-3032`.

### 15.3.5 Dynamic Semantics

$$
\mathsf{When}\ \texttt{LookupMethod(T, name) = m},\ \mathsf{execution}\ \mathsf{uses}\ \mathsf{that}\ \mathsf{unique}\ \mathsf{method}\ \mathsf{body}.\ \mathsf{No}\ \mathsf{runtime}\ \mathsf{overload}\ \mathsf{search}\ \mathsf{is}\ \mathsf{performed}.
$$

### 15.3.6 Lowering

Overload resolution is complete before lowering. Lowering consumes the selected procedure or method symbol only.

### 15.3.7 Diagnostics

| Code         | Severity | Detection    | Condition                           |
| ------------ | -------- | ------------ | ----------------------------------- |
| `E-SEM-3030` | Error    | Compile-time | Ambiguous overload resolution       |
| `E-SEM-3031` | Error    | Compile-time | No matching overload found          |
| `E-SEM-3032` | Error    | Compile-time | Duplicate signature in overload set |

Method lookup diagnostics remain defined for missing methods and ambiguous inherited-default method resolution.

## 15.4 Contract Clauses

### 15.4.1 Syntax

```text
contract_clause    ::= "|:" contract_body
contract_body      ::= precondition_expr
                     | precondition_expr "=>" postcondition_expr
                     | "=>" postcondition_expr
precondition_expr  ::= predicate_expr
postcondition_expr ::= predicate_expr
```

### 15.4.2 Parsing

`ForeignContractStart` is defined by §23.6.2 and is used here only to disambiguate ordinary contract clauses from foreign contract clauses.

**(Parse-ContractClauseOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|:"})\ \lor \ \operatorname{ForeignContractStart}(P) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseContractClauseOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-ContractClauseOpt-Yes)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|:"})\quad \Gamma \ \vdash \ \operatorname{ParseContractBody}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{clause}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseContractClauseOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{clause})
\end{array}
$$

**(Parse-ContractBody-PostOnly)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"=>"})\quad \Gamma \ \vdash \ \operatorname{ParsePredicateExpr}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{post}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseContractBody}(P)\ \Downarrow \ (P_{1},\ \langle \bot ,\ \mathsf{post}\rangle )
\end{array}
$$

**(Parse-ContractBody-PrePost)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParsePredicateExpr}(P)\ \Downarrow \ (P_{1},\ \mathsf{pre})\quad \operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{"=>"})\quad \Gamma \ \vdash \ \operatorname{ParsePredicateExpr}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{post}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseContractBody}(P)\ \Downarrow \ (P_{2},\ \langle \mathsf{pre},\ \mathsf{post}\rangle )
\end{array}
$$

**(Parse-ContractBody-PreOnly)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParsePredicateExpr}(P)\ \Downarrow \ (P_{1},\ \mathsf{pre})\quad \lnot \ \operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{"=>"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseContractBody}(P)\ \Downarrow \ (P_{1},\ \langle \mathsf{pre},\ \bot \rangle )
\end{array}
$$

### 15.4.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{ContractClause}\ =\ \langle \mathsf{pre},\ \mathsf{post}\rangle  \\
\mathsf{contract}_{\mathsf{opt}}\ \in \ \{\bot \}\ \cup \ \mathsf{ContractClause}
\end{array}
$$

### 15.4.4 Static Semantics

**(WF-Contract)**

$$
\begin{array}{l}
\Gamma_{\mathsf{pre}} \ \vdash \ P_{\mathsf{pre}}\ :\ \texttt{bool}\quad \operatorname{pure}(P_{\mathsf{pre}}) \\
\Gamma_{\mathsf{post}} \ \vdash \ P_{\mathsf{post}}\ :\ \texttt{bool}\quad \operatorname{pure}(P_{\mathsf{post}}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \texttt{|:}\ P_{\mathsf{pre}}\ \Rightarrow \ P_{\mathsf{post}}\ :\ \mathsf{WF}
\end{array}
$$

The purity judgment for contract expressions is:

**(Pure-Literal)**

$$
\begin{array}{l}
v\ \in \ \mathsf{Literals} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LiteralExpr}(v)\ \mathsf{pure}
\end{array}
$$

**(Pure-Ident)**

$$
\begin{array}{l}
\Gamma (x)\ =\ (T,\ \_) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Ident}(x)\ \mathsf{pure}
\end{array}
$$

**(Pure-Field)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ \mathsf{pure} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{FieldAccess}(e,\ f)\ \mathsf{pure}
\end{array}
$$

**(Pure-Tuple-Access)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ \mathsf{pure} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TupleAccess}(e,\ i)\ \mathsf{pure}
\end{array}
$$

**(Pure-Index)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ \mathsf{pure}\quad \Gamma \ \vdash \ e_{2}\ \mathsf{pure} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ \mathsf{pure}
\end{array}
$$

**(Pure-Unary)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ \mathsf{pure}\quad \mathsf{op}\ \in \ \{\texttt{!},\ \texttt{-},\ \texttt{*}\} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{UnaryExpr}(\mathsf{op},\ e)\ \mathsf{pure}
\end{array}
$$

**(Pure-Binary)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ \mathsf{pure}\quad \Gamma \ \vdash \ e_{2}\ \mathsf{pure}\quad \mathsf{op}\ \in \ \mathsf{PureOps} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BinaryExpr}(\mathsf{op},\ e_{1},\ e_{2})\ \mathsf{pure}
\end{array}
$$

$$
\mathsf{PureOps}\ =\ \{\texttt{+},\ \texttt{-},\ \texttt{*},\ \texttt{/},\ \texttt{\%},\ \texttt{**},\ \texttt{==},\ \texttt{!=},\ \texttt{<},\ \texttt{<=},\ \texttt{>},\ \texttt{>=},\ \texttt{\&\&},\ \texttt{||},\ \texttt{\&},\ \texttt{|},\ \texttt{\^{}},\ \texttt{<<},\ \texttt{>>},\ \texttt{..},\ \texttt{..=}\}
$$

**(Pure-Cast)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ \mathsf{pure} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CastExpr}(e,\ T)\ \mathsf{pure}
\end{array}
$$

**(Pure-If)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{\mathsf{cond}}\ \mathsf{pure}\quad \Gamma \ \vdash \ e_{\mathsf{then}}\ \mathsf{pure}\quad \Gamma \ \vdash \ e_{\mathsf{else}}\ \mathsf{pure} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{IfExpr}(e_{\mathsf{cond}},\ e_{\mathsf{then}},\ e_{\mathsf{else}})\ \mathsf{pure}
\end{array}
$$

**(Pure-If-Is)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ \mathsf{pure}\quad \Gamma ,\ \operatorname{PatternBindings}(\mathsf{pat})\ \vdash \ b_{t}\ \mathsf{pure}\quad \Gamma \ \vdash \ b_{f}\ \mathsf{pure} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{IfIsExpr}(e,\ \mathsf{pat},\ b_{t},\ b_{f})\ \mathsf{pure}
\end{array}
$$

**(Pure-If-Is-No-Else)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ \mathsf{pure}\quad \Gamma ,\ \operatorname{PatternBindings}(\mathsf{pat})\ \vdash \ b_{t}\ \mathsf{pure} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{IfIsExpr}(e,\ \mathsf{pat},\ b_{t},\ \bot )\ \mathsf{pure}
\end{array}
$$

**(Pure-If-Case)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ \mathsf{pure}\quad \forall \ \mathsf{case}\ \in \ \mathsf{cases}.\ \Gamma ,\ \operatorname{PatternBindings}(\mathsf{case}.\mathsf{pat})\ \vdash \ \mathsf{case}.\mathsf{body}\ \mathsf{pure}\quad \Gamma \ \vdash \ b_{f}\ \mathsf{pure} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ b_{f})\ \mathsf{pure}
\end{array}
$$

**(Pure-If-Case-No-Else)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ \mathsf{pure}\quad \forall \ \mathsf{case}\ \in \ \mathsf{cases}.\ \Gamma ,\ \operatorname{PatternBindings}(\mathsf{case}.\mathsf{pat})\ \vdash \ \mathsf{case}.\mathsf{body}\ \mathsf{pure} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ \bot )\ \mathsf{pure}
\end{array}
$$

**(Pure-Block)**

$$
\begin{array}{l}
\forall \ s\ \in \ \mathsf{stmts}.\ \Gamma \ \vdash \ s\ \mathsf{pure}_{\mathsf{stmt}}\quad \Gamma \ \vdash \ e\ \mathsf{pure} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BlockExpr}(\mathsf{stmts},\ e)\ \mathsf{pure}
\end{array}
$$

**(Pure-Tuple)**

$$
\begin{array}{l}
\forall \ i.\ \Gamma \ \vdash \ e_{i}\ \mathsf{pure} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TupleExpr}([e_{1},\ \ldots ,\ e_{n}])\ \mathsf{pure}
\end{array}
$$

**(Pure-Array)**

$$
\begin{array}{l}
\forall \ i.\ \Gamma \ \vdash \ e_{i}\ \mathsf{pure} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ArrayExpr}([e_{1},\ \ldots ,\ e_{n}])\ \mathsf{pure}
\end{array}
$$

**(Pure-Record)**

$$
\begin{array}{l}
\forall \ (f,\ e)\ \in \ \mathsf{fields}.\ \Gamma \ \vdash \ e\ \mathsf{pure} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{RecordExpr}(T,\ \mathsf{fields})\ \mathsf{pure}
\end{array}
$$

**(Pure-Call-Builtin)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ \mathsf{pure}\quad \ldots \quad \Gamma \ \vdash \ e_{n}\ \mathsf{pure}\quad \operatorname{BuiltinPure}(f) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CallExpr}(f,\ [e_{1},\ \ldots ,\ e_{n}])\ \mathsf{pure}
\end{array}
$$

**(Pure-Call-Procedure)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ \mathsf{pure}\quad \ldots \quad \Gamma \ \vdash \ e_{n}\ \mathsf{pure}\quad \operatorname{ProcDecl}(f)\ =\ P\quad \lnot \operatorname{HasCapabilityParams}(P)\quad \operatorname{IsPureProc}(P) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CallExpr}(f,\ [e_{1},\ \ldots ,\ e_{n}])\ \mathsf{pure}
\end{array}
$$

**(Pure-Method-Const)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ \mathsf{pure}\quad \Gamma \ \vdash \ e_{1}\ \mathsf{pure}\quad \ldots \quad \Gamma \ \vdash \ e_{n}\ \mathsf{pure}\quad \operatorname{ReceiverPerm}(m)\ =\ \texttt{const}\quad \lnot \operatorname{HasCapabilityParams}(m)\quad \operatorname{IsPureProc}(m) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{MethodCallExpr}(e,\ m,\ [e_{1},\ \ldots ,\ e_{n}])\ \mathsf{pure}
\end{array}
$$

**(Pure-Comptime)**

$$
\begin{array}{l}
\operatorname{ComptimeProc}(f)\quad \Gamma \ \vdash \ e_{1}\ \mathsf{pure}\quad \ldots \quad \Gamma \ \vdash \ e_{n}\ \mathsf{pure} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CallExpr}(f,\ [e_{1},\ \ldots ,\ e_{n}])\ \mathsf{pure}
\end{array}
$$

**Helper Predicates**

$$
\begin{array}{l}
\operatorname{HasCapabilityParams}(P)\ \Leftrightarrow \ \exists \ \mathsf{param}\ \in \ \operatorname{Params}(P).\ \operatorname{IsCapabilityType}(\operatorname{ParamType}(\mathsf{param})) \\
\operatorname{IsCapabilityType}(T)\ \Leftrightarrow \ \operatorname{CapInType}(T)\ \ne \ \emptyset  \\
\operatorname{ContainsCapability}(T)\ \Leftrightarrow \ \operatorname{CapInType}(T)\ \ne \ \emptyset  \\
\operatorname{BuiltinPure}(f)\ \Leftrightarrow \ f\ \in \ \{\mathsf{sizeof},\ \mathsf{alignof},\ \mathsf{type}_{\mathsf{name}},\ \ldots \} \\
\operatorname{IsPureProc}(P)\ \Leftrightarrow \ \forall \ \mathsf{stmt}\ \in \ \operatorname{Body}(P).\ \Gamma \ \vdash \ \mathsf{stmt}\ \mathsf{pure}_{\mathsf{stmt}}\ \land \ \lnot \operatorname{WritesGlobalState}(P) \\
\operatorname{ComptimeProc}(f)\ \Leftrightarrow \ \operatorname{HasAttribute}(\operatorname{ProcDecl}(f),\ \texttt{comptime})
\end{array}
$$

The following forms are never pure: assignment expressions, mutable method calls, allocation expressions, spawn/dispatch/parallel expressions, yield/wait expressions, procedure calls with capability parameters, and unsafe blocks.

$$
**\mathsf{Precondition}\ \mathsf{Evaluation}\ \mathsf{Context}\ (\Gamma_{\mathsf{pre}} )**\ \mathsf{includes}\ \mathsf{the}\ \mathsf{receiver}\ \mathsf{binding}\ (\mathsf{if}\ \mathsf{present})\ \mathsf{and}\ \mathsf{all}\ \mathsf{procedure}\ \mathsf{parameters}\ \mathsf{at}\ \mathsf{entry}\ \mathsf{state}.\ \mathsf{It}\ \mathsf{excludes}\ \texttt{@result},\ \texttt{@entry},\ \mathsf{module}-\mathsf{scope}\ \mathsf{bindings},\ \mathsf{enclosing}\ \mathsf{locals},\ \mathsf{and}\ \mathsf{body}-\mathsf{local}\ \mathsf{bindings}.
$$

$$
**\mathsf{Postcondition}\ \mathsf{Evaluation}\ \mathsf{Context}\ (\Gamma_{\mathsf{post}} )**\ \mathsf{includes}\ \mathsf{the}\ \mathsf{receiver},\ \mathsf{all}\ \mathsf{procedure}\ \mathsf{parameters},\ \texttt{@result},\ \mathsf{and}\ \texttt{@entry}.\ \mathsf{Mutable}\ \mathsf{parameters}\ \mathsf{and}\ \mathsf{mutable}\ \mathsf{receivers}\ \mathsf{denote}\ \mathsf{post}-\mathsf{state}\ \mathsf{values}\ \mathsf{on}\ \mathsf{the}\ \mathsf{right}\ \mathsf{of}\ \texttt{=>},\ \mathsf{while}\ \texttt{@entry(...)}\ \mathsf{denotes}\ \mathsf{entry}-\mathsf{state}\ \mathsf{values}.
$$

### 15.4.5 Dynamic Semantics

Contract clauses themselves have no independent runtime effect. Their operational impact is through verification and inserted `ContractCheck` forms defined in §15.8.

### 15.4.6 Lowering

No lowering is defined directly for a contract clause. Lowering consumes verification results and, when required, emits checks as defined in §15.8.

### 15.4.7 Diagnostics

Diagnostics are defined for malformed contract clauses and for contract predicates that are ill-typed or impure.

## 15.5 Preconditions

### 15.5.1 Syntax

$$
\mathsf{The}\ \mathsf{precondition}\ \mathsf{is}\ \mathsf{the}\ \mathsf{expression}\ \mathsf{to}\ \mathsf{the}\ \mathsf{left}\ \mathsf{of}\ \texttt{=>}\ \mathsf{in}\ a\ \mathsf{contract}\ \mathsf{clause},\ \mathsf{or}\ \mathsf{the}\ \mathsf{entire}\ \mathsf{contract}\ \mathsf{expression}\ \mathsf{when}\ \texttt{=>}\ \mathsf{is}\ \mathsf{absent}.
$$

### 15.5.2 Parsing

Preconditions are parsed as part of `ParseContractBody` in §15.4.2.

### 15.5.3 AST Representation / Form

$$
\begin{array}{l}
\operatorname{PreconditionOf}(\mathsf{contract}_{\mathsf{opt}})\ =\ \texttt{true}\quad \mathsf{if}\ \mathsf{contract}_{\mathsf{opt}}\ =\ \bot  \\
\operatorname{PreconditionOf}(\langle \mathsf{pre},\ \mathsf{post}\rangle )\ =\ \texttt{true}\quad \mathsf{if}\ \mathsf{pre}\ =\ \bot  \\
\operatorname{PreconditionOf}(\langle \mathsf{pre},\ \mathsf{post}\rangle )\ =\ \mathsf{pre}\quad \mathsf{if}\ \mathsf{pre}\ \ne \ \bot 
\end{array}
$$

### 15.5.4 Static Semantics

Let `S_call` be the call-site program point for the invocation being checked.
In this section, the proof context symbol `Gamma_S` denotes the active
`ProofContextAt(S_call)` defined in SS15.8.4 after actual-parameter
substitution into the callee precondition.

**(Pre-Satisfied)**

$$
\begin{array}{l}
\Gamma \ \vdash \ f\ :\ (T_{1},\ \ldots ,\ T_{n})\ \to \ R\quad \operatorname{precondition}(f)\ =\ P_{\mathsf{pre}}\quad \operatorname{StaticProofAt}(S_{\mathsf{call}},\ \Gamma_{S} ,\ P_{\mathsf{pre}}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{f}(a_{1},\ \ldots ,\ a_{n})\ @\ S\ :\ \mathsf{valid}
\end{array}
$$

Elision rules:

| Contract Form      | Precondition |
| ------------------ | ------------ |
| `                  | : P`         | `P`    |
| `                  | : P => Q`    | `P`    |
| `                  | : => Q`      | `true` |
| no contract clause | `true`       |

The caller is responsible for satisfying the precondition.

### 15.5.5 Dynamic Semantics

When runtime verification is selected, the precondition is evaluated before procedure body execution and before any `@entry` capture.

### 15.5.6 Lowering

Precondition check insertion is defined by `Insert-Precondition-Check` in §15.8.6.

### 15.5.7 Diagnostics

Diagnostics for unsatisfied preconditions are attached to the call site.

## 15.6 Postconditions

### 15.6.1 Syntax

```text
postcondition_expr ::= predicate_expr
contract_intrinsic ::= "@result" | "@entry" "(" expression ")"
```

### 15.6.2 Parsing

**(Parse-Contract-Result)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"@"})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(P)))\quad \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(P)))\ =\ \texttt{result} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P)),\ \mathsf{ContractResult})
\end{array}
$$

**(Parse-Contract-Entry)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"@"})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(P)))\quad \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(P)))\ =\ \texttt{entry}\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P))))\ \Downarrow \ (P_{1},\ e)\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{")"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{ContractEntry}(e))
\end{array}
$$

### 15.6.3 AST Representation / Form

$$
\mathsf{Expr}\ =\ \ldots \ \mid \ \mathsf{ContractResult}\ \mid \ \operatorname{ContractEntry}(\mathsf{expr})\ \mid \ \ldots 
$$

$$
\begin{array}{l}
\operatorname{PostconditionOf}(\mathsf{contract}_{\mathsf{opt}})\ =\ \texttt{true}\quad \mathsf{if}\ \mathsf{contract}_{\mathsf{opt}}\ =\ \bot  \\
\operatorname{PostconditionOf}(\langle \mathsf{pre},\ \mathsf{post}\rangle )\ =\ \texttt{true}\quad \mathsf{if}\ \mathsf{post}\ =\ \bot  \\
\operatorname{PostconditionOf}(\langle \mathsf{pre},\ \mathsf{post}\rangle )\ =\ \mathsf{post}\quad \mathsf{if}\ \mathsf{post}\ \ne \ \bot 
\end{array}
$$

### 15.6.4 Static Semantics

Let `ProofContextAt(r)` denote the active proof context at return point `r` as
defined in SS15.8.4. Postcondition verification at `r` is performed after
binding `@result` to the returned value and uses that proof context.

**(Post-Valid)**

$$
\begin{array}{l}
\operatorname{postcondition}(f)\ =\ P_{\mathsf{post}}\quad \forall \ r\ \in \ \operatorname{ReturnPoints}(f).\ \Gamma_{r} \ \vdash \ P_{\mathsf{post}}\ :\ \mathsf{satisfied} \\
\rule{18em}{0.4pt} \\
f\ :\ \mathsf{postcondition}-\mathsf{valid}
\end{array}
$$

Elision rules:

| Contract Form      | Postcondition |
| ------------------ | ------------- |
| `                  | : P`          | `true` |
| `                  | : P => Q`     | `Q`    |
| `                  | : => Q`       | `Q`    |
| no contract clause | `true`        |

Properties of `@result`:

1. It is available only in postcondition expressions.
2. Its type is the declared return type of the enclosing procedure.
3. For unit-returning procedures, `@result` has type `()`.

**(Result-Union-Type)**

$$
\begin{array}{l}
\operatorname{ReturnType}(f)\ =\ T_{1}\ \mid \ T_{2}\ \mid \ \ldots \ \mid \ T_{n} \\
\rule{18em}{0.4pt} \\
\Gamma_{\mathsf{post}} \ \vdash \ @\mathsf{result}\ :\ T_{1}\ \mid \ T_{2}\ \mid \ \ldots \ \mid \ T_{n}
\end{array}
$$

**(Result-Is-Predicate)**

$$
\begin{array}{l}
\Gamma_{\mathsf{post}} \ \vdash \ @\mathsf{result}\ :\ T_{\mathsf{union}}\quad T_{\mathsf{variant}}\ \in \ \operatorname{Variants}(T_{\mathsf{union}}) \\
\rule{18em}{0.4pt} \\
\Gamma_{\mathsf{post}} \ \vdash \ (@\mathsf{result}\ \mathsf{is}\ T_{\mathsf{variant}})\ :\ \mathsf{bool}
\end{array}
$$

**(Result-Narrowing)**

$$
\begin{array}{l}
(@\mathsf{result}\ \mathsf{is}\ T_{\mathsf{variant}})\ =\ \mathsf{true}\quad \Gamma_{\mathsf{post}} \ \vdash \ @\mathsf{result}\ :\ T_{\mathsf{union}} \\
\rule{18em}{0.4pt} \\
\Gamma_{\mathsf{post}} \ \vdash \ @\mathsf{result}\ \mathsf{as}\ T_{\mathsf{variant}}\ :\ T_{\mathsf{variant}}
\end{array}
$$

**(Propagate-Postcondition)**

$$
\begin{array}{l}
e?\ \mathsf{propagates}\ \mathsf{error}\ e_{\mathsf{err}}\ \mathsf{at}\ \mathsf{program}\ \mathsf{point}\ p\quad \operatorname{ReturnType}(f)\ =\ T_{\mathsf{success}}\ \mid \ T_{\mathsf{error}} \\
\rule{18em}{0.4pt} \\
\mathsf{Postconditions}\ \mathsf{are}\ \mathsf{evaluated}\ \mathsf{for}\ \mathsf{the}\ \mathsf{propagation}\ \mathsf{return}\ \mathsf{at}\ p\ \mathsf{with}\ @\mathsf{result}\ \mathsf{bound}\ \mathsf{to}\ e_{\mathsf{err}}
\end{array}
$$

**(Result-Modal)**

$$
\begin{array}{l}
\operatorname{ReturnType}(f)\ =\ M@S \\
\rule{18em}{0.4pt} \\
\Gamma_{\mathsf{post}} \ \vdash \ @\mathsf{result}\ :\ M@S
\end{array}
$$

**(Result-Generic)**

$$
\begin{array}{l}
\operatorname{ReturnType}(f)\ =\ T\quad T\ \mathsf{is}\ a\ \mathsf{type}\ \mathsf{parameter} \\
\rule{18em}{0.4pt} \\
\Gamma_{\mathsf{post}} \ \vdash \ @\mathsf{result}\ :\ T
\end{array}
$$

**(Result-Generic-Constraint)**
@result op e in postcondition    op requires class C    T is return type parameter

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
T\ \mathrel{<:} \ C\ \mathsf{required}\ \mathsf{in}\ \mathsf{procedure}\ \mathsf{signature}
\end{array}
$$

$$
\texttt{@entry(expr)}\ \mathsf{constraints}:
$$

1. It is available only in postcondition expressions.
2. `expr` MUST be pure.
3. `expr` MUST reference only parameters and the receiver.
4. The result type of `expr` MUST satisfy `BitcopyType`.

**(Entry-Type)**

$$
\begin{array}{l}
\Gamma_{\mathsf{post}} \ \vdash \ e\ :\ T\quad \operatorname{BitcopyType}(T) \\
\rule{18em}{0.4pt} \\
\Gamma_{\mathsf{post}} \ \vdash \ @\operatorname{entry}(e)\ :\ T
\end{array}
$$

### 15.6.5 Dynamic Semantics

At each return point `r` with returned value `v_r`, postconditions are evaluated with `@result` bound to `v_r`.

$$
\mathsf{When}\ \texttt{@entry(expr)}\ \mathsf{appears}\ \mathsf{in}\ a\ \mathsf{postcondition}:
$$

1. `expr` is evaluated immediately after parameter binding and successful precondition checking.
2. The result is captured by bitwise copy.
3. Every postcondition check for the invocation reuses the captured value.

Entry-capture timing:

1. Parameter Binding
2. Precondition Check
3. `@entry` Capture
4. Body Execution
5. Postcondition Check
6. Return

**(EntryCapturePhase)**

$$
\begin{array}{l}
\mathsf{entries}\ =\ \operatorname{CollectEntryExprs}(\operatorname{postcondition}(f))\quad \forall \ e_{i}\ \in \ \mathsf{entries}.\ \Gamma_{\mathsf{pre}} \ \vdash \ \operatorname{EvalSigma}(e_{i},\ \sigma_{\mathsf{entry}} )\ \Downarrow \ (\operatorname{Val}(v_{i}),\ \sigma_{\mathsf{entry}} ) \\
\mathsf{captures}\ =\ \{\ e_{i}\ \mapsto \ \operatorname{Capture}(v_{i},\ T_{i})\ \mid \ e_{i}\ \in \ \mathsf{entries}\ \} \\
\rule{18em}{0.4pt} \\
\operatorname{EntryCapturePhase}(f,\ \sigma_{\mathsf{entry}} )\ =\ (\mathsf{captures},\ \sigma_{\mathsf{entry}} )
\end{array}
$$

$$
\operatorname{Capture}(v,\ T)\ =\ v\quad \mathsf{if}\ \operatorname{BitcopyType}(T)
$$

### 15.6.6 Lowering

No standalone representation change is introduced by postconditions. Lowering preserves captured `@entry` values only as inputs to inserted `Post` checks from §15.8.6.

### 15.6.7 Diagnostics

Diagnostics are defined for `@result` outside postconditions, `@entry` expressions whose type is not `BitcopyType`, `@entry` expressions with side effects or capability requirements, and `@entry` references to moved parameters.

## 15.7 Invariants

### 15.7.1 Syntax

```text
type_invariant ::= "|:" "{" predicate_expr "}"
loop_invariant ::= "|:" "{" predicate_expr "}"
```

### 15.7.2 Parsing

**(Parse-InvariantOpt-None)**

$$
\begin{array}{l}
\lnot \ (\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|:"})\ \land \ \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"\{"})) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseInvariantOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-InvariantOpt-Yes)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|:"})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParsePredicateExpr}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ \mathsf{pred})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\}"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseInvariantOpt}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \mathsf{pred})
\end{array}
$$

$$
\operatorname{ParseLoopInvariantOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{inv}_{\mathsf{opt}})\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{ParseInvariantOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{inv}_{\mathsf{opt}})
$$

### 15.7.3 AST Representation / Form

Invariant = Expr

$$
\mathsf{invariant}_{\mathsf{opt}}\ \in \ \{\bot \}\ \cup \ \mathsf{Invariant}
$$

$$
\begin{array}{l}
\mathsf{RecordDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{implements},\ \mathsf{members},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}\rangle  \\
\mathsf{EnumDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{implements},\ \mathsf{variants},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}\rangle  \\
\mathsf{ModalDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{implements},\ \mathsf{states},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}\rangle 
\end{array}
$$

Loop forms preserve `inv_opt` in their AST representation.

### 15.7.4 Static Semantics

Type invariant context:

1. `self` denotes an instance of the type being defined.
2. Field access on `self` is permitted.
3. Method calls on `self` are permitted only when the method is pure.

Type invariant enforcement points:

1. Post-construction.
2. Before any public receiver-taking procedure call.
3. Before any mutating receiver-taking procedure returns.

Types with type invariants MUST NOT declare public mutable fields.

Private procedures are exempt from the pre-call enforcement point; the invariant is rechecked when control returns to a public caller.

Loop invariant enforcement points:

1. Before the first iteration.
2. At the start of every subsequent iteration.
3. Immediately after loop termination.

Upon successful termination verification, the implementation generates a verification fact for the invariant at loop exit.

Invariant verification follows the same verification-mode rules as contracts in §15.8.

### 15.7.5 Dynamic Semantics

When runtime verification is selected, type invariants are checked at their enforcement points and loop invariants are checked at loop entry and every back-edge, including `continue` paths.

### 15.7.6 Lowering

Lowering preserves every loop `inv_opt` and emits invariant checks only through the insertion rules of §15.8.6.

### 15.7.7 Diagnostics

Diagnostics are defined for invariant predicates that are ill-formed, for types with invariants that expose public mutable fields, and for invariant obligations that fail static or dynamic verification.

## 15.8 Verification Logic

### 15.8.1 Syntax

No surface syntax is introduced by the verification framework.

### 15.8.2 Parsing

Verification logic is not parser-owned.

### 15.8.3 AST Representation / Form

$$
\mathsf{ContractKind}\ =\ \{\mathsf{Pre},\ \mathsf{Post},\ \mathsf{TypeInv},\ \mathsf{LoopInv},\ \mathsf{ForeignPre},\ \mathsf{ForeignPost}\}
$$

$$
\mathsf{VerificationFact}\ =\ \operatorname{F}(P,\ L,\ S)
$$

$$
\mathsf{CheckState}\ =\ \{\operatorname{CheckStart}(P,\ k,\ s,\ \rho ,\ \sigma ),\ \operatorname{CheckDone}(\sigma ),\ \operatorname{CheckPanic}(\sigma )\}
$$

$$
\operatorname{ContractCheck}(P,\ k,\ s,\ \rho )\ =\ \texttt{if}\ !P[\rho ]\ \{\ \texttt{panic}(\operatorname{ContractViolation}(k,\ P,\ s))\ \}
$$

### 15.8.4 Static Semantics

$$
\begin{array}{l}
\operatorname{DynamicScope}(s)\ \Leftrightarrow \ (\exists \ d.\ \operatorname{DynamicDecl}(d)\ \land \ s\ \subseteq \ d.\mathsf{span})\ \lor \ (\exists \ e.\ \operatorname{DynamicExpr}(e)\ \land \ s\ \subseteq \ \operatorname{ExprSpan}(e)) \\
\mathsf{InDynamicContext}\ \Leftrightarrow \ \operatorname{DynamicScope}(s)\ \mathsf{where}\ \texttt{s}\ \mathsf{is}\ \mathsf{the}\ \mathsf{span}\ \mathsf{of}\ \mathsf{the}\ \mathsf{syntactic}\ \mathsf{form}\ \mathsf{currently}\ \mathsf{being}\ \mathsf{verified}\ \mathsf{or}\ \mathsf{type}-\mathsf{checked}.
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ComputeDynamicContext}(s,\ \mathsf{ancestors})\ = \\
\ \mathsf{let}\ \mathsf{enclosing}_{\mathsf{dynamic}}\ =\ \operatorname{FindInnermostDynamic}(s,\ \mathsf{ancestors}) \\
\ \mathsf{match}\ \mathsf{enclosing}_{\mathsf{dynamic}}\ \{ \\
\quad \bot \quad \to \ \mathsf{false} \\
\quad \operatorname{Some}(\_)\ \to \ \mathsf{true} \\
\ \}
\end{array}
$$

**(Contract-Static-OK)**

$$
\begin{array}{l}
\operatorname{StaticProofAt}(S,\ \Gamma_{S} ,\ P) \\
\rule{18em}{0.4pt} \\
P\ :\ \mathsf{verified}
\end{array}
$$

**(Contract-Static-Fail)**

$$
\begin{array}{l}
\lnot \ \operatorname{StaticProofAt}(S,\ \Gamma_{S} ,\ P)\quad \lnot \ \mathsf{InDynamicContext} \\
\rule{18em}{0.4pt} \\
\mathsf{program}\ \mathsf{is}\ \mathsf{ill}-\mathsf{formed}
\end{array}
$$

**(Contract-Dynamic-Elide)**

$$
\begin{array}{l}
\operatorname{StaticProofAt}(S,\ \Gamma_{S} ,\ P) \\
\rule{18em}{0.4pt} \\
P\ :\ \mathsf{verified}
\end{array}
$$

**(Contract-Dynamic-Check)**

$$
\begin{array}{l}
\lnot \ \operatorname{StaticProofAt}(S,\ \Gamma_{S} ,\ P)\quad \mathsf{InDynamicContext} \\
\rule{18em}{0.4pt} \\
\mathsf{emit}\ \mathsf{runtime}\ \mathsf{check}\ \operatorname{ContractCheck}(P,\ k,\ s,\ \rho )
\end{array}
$$

Mandatory proof techniques:

1. Constant propagation
2. Linear integer reasoning
3. Boolean algebra
4. Control flow analysis
5. Type-derived bounds
6. Verification facts

For this section, `Gamma_S` denotes the active proof context at program point
`S`, written `ProofContextAt(S)`.

$$
\mathsf{Let}\ \texttt{FlowFactsAt(S) = \{ P | F(P, L) in Facts and L dom S \}}.
$$

Let `ContractFactsAt(S)` be the set of conjuncts imported from the enclosing
procedure contract precondition that remain in scope at `S`.

$$
\mathsf{Let}\ \texttt{ProofContextAt(S) = FlowFactsAt(S) union ContractFactsAt(S)}.
$$

$$
\texttt{Decidable(P)}\ \mathsf{is}\ \mathsf{the}\ \mathsf{smallest}\ \mathsf{set}\ \mathsf{closed}\ \mathsf{under}:
$$

1. `true`, `false`
2. Comparisons of linear integer expressions over literals and variables
3. Syntactic equality up to alpha-renaming between identifiers and literal constants
4. Boolean combinations using `!`, `&&`, `||`

Entailment:

**(Ent-True)**

$$
\begin{array}{l}
P\ \equiv \ \texttt{true} \\
\rule{18em}{0.4pt} \\
\operatorname{ProofContextAt}(S)\ \vdash \ P
\end{array}
$$

**(Ent-Fact)**

$$
\begin{array}{l}
P\ \in \ \operatorname{ProofContextAt}(S) \\
\rule{18em}{0.4pt} \\
\operatorname{ProofContextAt}(S)\ \vdash \ P
\end{array}
$$

**(Ent-And)**

$$
\begin{array}{l}
\operatorname{ProofContextAt}(S)\ \vdash \ P\quad \operatorname{ProofContextAt}(S)\ \vdash \ Q \\
\rule{18em}{0.4pt} \\
\operatorname{ProofContextAt}(S)\ \vdash \ P\ \land \ Q
\end{array}
$$

**(Ent-Or-L)**

$$
\begin{array}{l}
\operatorname{ProofContextAt}(S)\ \vdash \ P \\
\rule{18em}{0.4pt} \\
\operatorname{ProofContextAt}(S)\ \vdash \ P\ \lor \ Q
\end{array}
$$

**(Ent-Or-R)**

$$
\begin{array}{l}
\operatorname{ProofContextAt}(S)\ \vdash \ Q \\
\rule{18em}{0.4pt} \\
\operatorname{ProofContextAt}(S)\ \vdash \ P\ \lor \ Q
\end{array}
$$

**(Ent-Linear)**
LinearEntails(ProofContextAt(S), P)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\operatorname{ProofContextAt}(S)\ \vdash \ P
\end{array}
$$

**Linear Integer Entailment**

$$
\mathsf{Let}\ \texttt{LinExpr}\ \mathsf{be}\ \mathsf{expressions}\ \mathsf{of}\ \mathsf{the}\ \mathsf{form}\ \texttt{sum\_i a\_i x\_i + c}\ \mathsf{where}\ \texttt{a\_i, c in Z}\ \mathsf{and}\ \mathsf{each}\ \texttt{x\_i}\ \mathsf{is}\ \mathsf{an}\ \mathsf{integer}-\mathsf{typed}\ \mathsf{variable}.
$$

$$
\mathsf{Let}\ \texttt{LinPred}\ \mathsf{be}\ \mathsf{predicates}\ \mathsf{comparing}\ \mathsf{two}\ \texttt{LinExpr}\ \mathsf{with}\ \texttt{==},\ \texttt{!=},\ \texttt{<},\ \texttt{<=},\ \texttt{>},\ \mathsf{or}\ \texttt{>=}.
$$

$$
\mathsf{Define}\ \texttt{LinFactsAt(S) = \{ P in ProofContextAt(S) | P in LinPred \}}.
$$

Then:

$$
\operatorname{LinearEntails}(\operatorname{ProofContextAt}(S),\ P)\ \Leftrightarrow \ P\ \in \ \mathsf{LinPred}\ \land \ \bigwedge \ \operatorname{LinFactsAt}(S)\ \models \_\mathbb{Z} \ P
$$

Implementations MAY use any sound decision procedure; they MUST be complete for `LinPred` entailment.

$$
\operatorname{StaticProofAt}(S,\ \operatorname{ProofContextAt}(S),\ P)\ \Leftrightarrow \ \operatorname{Decidable}(P)\ \land \ \operatorname{ProofContextAt}(S)\ \vdash \ P
$$

$$
\mathsf{Define}\ \texttt{NegFact(P)}\ \mathsf{on}\ \mathsf{simple}\ \mathsf{decidable}\ \mathsf{predicates}\ \mathsf{by}:
$$

1. `NegFact(!P) = P`
2. `NegFact(a < b) = (a >= b)`
3. `NegFact(a <= b) = (a > b)`
4. `NegFact(a > b) = (a <= b)`
5. `NegFact(a >= b) = (a < b)`
6. `NegFact(a == b) = (a != b)`
7. `NegFact(a != b) = (a == b)`
8. `NegFact(P)` is undefined otherwise

Verification facts:

1. Have zero runtime size.
2. Have no runtime representation.
3. MUST NOT be stored, passed, or returned.

**(Fact-Dominate)**

$$
\begin{array}{l}
\operatorname{F}(P,\ L)\ \in \ \mathsf{Facts}\quad L\ \mathsf{dom}\ S\quad L\ \ne \ S \\
\rule{18em}{0.4pt} \\
P\ \mathsf{satisfied}\ \mathsf{at}\ S
\end{array}
$$

Fact generation:

1. `if P { ... }` generates `F(P, _)` on then-branch entry.
2. `if P { ... } else { ... }` generates `F(NegFact(P), _)` on else-branch
   entry whenever `NegFact(P)` is defined.
3. `if P { return ... }`, `if P { break ... }`, and `if P { continue ... }`
   generate `F(NegFact(P), _)` on the subsequent fallthrough path whenever
   `NegFact(P)` is defined.
4. A satisfied `if ... is` pattern generates pattern facts on selected-body entry.
5. A runtime check for `P` generates `F(P, _)` after the check.
6. A verified loop invariant generates `F(Inv, _)` after the loop.

$$
\mathsf{Type}\ \mathsf{narrowing}\ \mathsf{under}\ \mathsf{an}\ \mathsf{active}\ \mathsf{fact}\ \texttt{F(P, L)}\ \mathsf{refines}\ \texttt{typeof(x)}\ \mathsf{to}\ \texttt{typeof(x) |: \{P\}}.
$$

### 15.8.5 Dynamic Semantics

Contract environments:

1. `ρ_emptyset = ∅`
2. `ρ_post = EntryCapture(f, σ_entry) ∪ { @result ↦ v_r }`
3. `ρ_foreign_post = { @result ↦ v_r }`

**(Check-True)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(P[\rho ],\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{true}),\ \sigma ') \\
\rule{18em}{0.4pt} \\
\langle \operatorname{CheckStart}(P,\ k,\ s,\ \rho ,\ \sigma )\rangle \ \to \ \langle \operatorname{CheckDone}(\sigma ')\rangle 
\end{array}
$$

**(Check-False)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(P[\rho ],\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{false}),\ \sigma ') \\
\rule{18em}{0.4pt} \\
\langle \operatorname{CheckStart}(P,\ k,\ s,\ \rho ,\ \sigma )\rangle \ \to \ \langle \operatorname{CheckPanic}(\sigma ')\rangle 
\end{array}
$$

**(Check-Panic)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(P[\rho ],\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma ') \\
\rule{18em}{0.4pt} \\
\langle \operatorname{CheckStart}(P,\ k,\ s,\ \rho ,\ \sigma )\rangle \ \to \ \langle \operatorname{CheckPanic}(\sigma ')\rangle 
\end{array}
$$

**(Check-Ok)**

$$
\begin{array}{l}
\langle \operatorname{CheckStart}(P,\ k,\ s,\ \rho ,\ \sigma )\rangle \ \to *\ \langle \operatorname{CheckDone}(\sigma ')\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ContractCheck}(P,\ k,\ s,\ \rho ,\ \sigma )\ \Downarrow \ \sigma '
\end{array}
$$

**(Check-Fail)**

$$
\begin{array}{l}
\langle \operatorname{CheckStart}(P,\ k,\ s,\ \rho ,\ \sigma )\rangle \ \to *\ \langle \operatorname{CheckPanic}(\sigma ')\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ContractCheck}(P,\ k,\ s,\ \rho ,\ \sigma )\ \Uparrow \ \mathsf{panic}
\end{array}
$$

Successful dynamic checks inject the corresponding verification fact after the inserted check.

### 15.8.6 Lowering

Runtime check insertion points:

**(Insert-Precondition-Check)**

$$
\begin{array}{l}
f\ \mathsf{has}\ \mathsf{contract}\ \mid :\ P\quad \operatorname{InDynamicContext}(f)\quad \lnot \ \operatorname{StaticProof}(\Gamma_{\mathsf{entry}} ,\ P) \\
\rule{18em}{0.4pt} \\
\mathsf{At}\ \mathsf{entry}\ \mathsf{to}\ f,\ \mathsf{insert}:\ \operatorname{ContractCheck}(P,\ \mathsf{Pre},\ \operatorname{span}(\mathsf{contract}),\ \rho_{\mathsf{emptyset}} )
\end{array}
$$

**(Insert-Postcondition-Check)**

$$
\begin{array}{l}
f\ \mathsf{has}\ \mathsf{contract}\ \mid :\ P_{\mathsf{pre}}\ \Rightarrow \ P_{\mathsf{post}}\quad \operatorname{InDynamicContext}(f)\quad \lnot \ \operatorname{StaticProof}(\Gamma_{\mathsf{exit}} ,\ P_{\mathsf{post}}) \\
\rule{18em}{0.4pt} \\
\mathsf{Before}\ \mathsf{each}\ \mathsf{return}\ \mathsf{from}\ f\ \mathsf{with}\ \mathsf{value}\ v,\ \mathsf{insert}:\ \operatorname{ContractCheck}(P_{\mathsf{post}},\ \mathsf{Post},\ \operatorname{span}(\mathsf{contract}),\ \rho_{\mathsf{post}} )
\end{array}
$$

**(Insert-TypeInv-Construction-Check)**

$$
\begin{array}{l}
T\ \mathsf{has}\ \mathsf{invariant}\ \mid :\ \{P\}\quad \operatorname{InDynamicContext}(\mathsf{construction}_{\mathsf{site}})\quad \lnot \ \operatorname{StaticProof}(\Gamma ,\ P[v/\mathsf{self}]) \\
\rule{18em}{0.4pt} \\
\mathsf{After}\ \mathsf{constructing}\ \mathsf{value}\ v\ \mathsf{of}\ \mathsf{type}\ T,\ \mathsf{insert}:\ \operatorname{ContractCheck}(P[v/\mathsf{self}],\ \mathsf{TypeInv},\ \operatorname{span}(\mathsf{invariant}),\ \rho_{\mathsf{emptyset}} )
\end{array}
$$

**(Insert-TypeInv-PreCall-Check)**

$$
\begin{array}{l}
T\ \mathsf{has}\ \mathsf{invariant}\ \mid :\ \{P\}\quad m\ \mathsf{is}\ \mathsf{public}\ \mathsf{method}\ \mathsf{with}\ \mathsf{receiver}\ \sim{}\quad \operatorname{InDynamicContext}(\mathsf{call}_{\mathsf{site}})\quad \lnot \ \operatorname{StaticProof}(\Gamma ,\ P[\mathsf{self}/\mathsf{self}]) \\
\rule{18em}{0.4pt} \\
\mathsf{Before}\ \mathsf{call}\ \mathsf{to}\ \mathsf{self}\sim{}>\operatorname{m}(\ldots ),\ \mathsf{insert}:\ \operatorname{ContractCheck}(P,\ \mathsf{TypeInv},\ \operatorname{span}(\mathsf{invariant}),\ \rho_{\mathsf{emptyset}} )
\end{array}
$$

**(Insert-TypeInv-PostCall-Check)**

$$
\begin{array}{l}
T\ \mathsf{has}\ \mathsf{invariant}\ \mid :\ \{P\}\quad m\ \mathsf{is}\ \mathsf{method}\ \mathsf{with}\ \mathsf{receiver}\ \sim{}!\quad \operatorname{InDynamicContext}(\mathsf{call}_{\mathsf{site}})\quad \lnot \ \operatorname{StaticProof}(\Gamma ,\ P[\mathsf{self}/\mathsf{self}]) \\
\rule{18em}{0.4pt} \\
\mathsf{After}\ \mathsf{return}\ \mathsf{from}\ \mathsf{self}\sim{}>\operatorname{m}(\ldots ),\ \mathsf{insert}:\ \operatorname{ContractCheck}(P,\ \mathsf{TypeInv},\ \operatorname{span}(\mathsf{invariant}),\ \rho_{\mathsf{emptyset}} )
\end{array}
$$

**(Insert-LoopInv-Init-Check)**

$$
\begin{array}{l}
\mathsf{loop}\ \ldots \ \mid :\ \{I\}\quad \operatorname{InDynamicContext}(\mathsf{loop}_{\mathsf{site}})\quad \lnot \ \operatorname{StaticProof}(\Gamma_{\mathsf{loop}} \_\mathsf{entry},\ I) \\
\rule{18em}{0.4pt} \\
\mathsf{Before}\ \mathsf{first}\ \mathsf{iteration},\ \mathsf{insert}:\ \operatorname{ContractCheck}(I,\ \mathsf{LoopInv},\ \operatorname{span}(\mathsf{invariant}),\ \rho_{\mathsf{emptyset}} )
\end{array}
$$

**(Insert-LoopInv-Maintenance-Check)**

$$
\begin{array}{l}
\mathsf{loop}\ \ldots \ \mid :\ \{I\}\quad \operatorname{InDynamicContext}(\mathsf{loop}_{\mathsf{site}})\quad \lnot \ \operatorname{StaticProof}(\Gamma_{\mathsf{loop}} \_\mathsf{body}_{\mathsf{exit}},\ I) \\
\rule{18em}{0.4pt} \\
\mathsf{At}\ \mathsf{end}\ \mathsf{of}\ \mathsf{each}\ \mathsf{iteration},\ \mathsf{insert}:\ \operatorname{ContractCheck}(I,\ \mathsf{LoopInv},\ \operatorname{span}(\mathsf{invariant}),\ \rho_{\mathsf{emptyset}} )
\end{array}
$$

**(Insert-Refinement-Check)**

$$
\begin{array}{l}
e\ :\ T\ \mid :\ \{P\}\quad \operatorname{InDynamicContext}(e)\quad \lnot \ \operatorname{StaticProof}(\Gamma ,\ P[e/\mathsf{self}]) \\
\rule{18em}{0.4pt} \\
\mathsf{After}\ \mathsf{evaluating}\ e,\ \mathsf{insert}:\ \operatorname{ContractCheck}(P[e/\mathsf{self}],\ \mathsf{TypeInv},\ \operatorname{span}(\mathsf{refinement}),\ \rho_{\mathsf{emptyset}} )
\end{array}
$$

### 15.8.7 Diagnostics

Diagnostics are defined for predicates that fail required static proof outside dynamic context and for runtime contract-check failures, including panic payload construction from the contract kind, predicate text, and source span.

## 15.9 Behavioral Subtyping

### 15.9.1 Syntax

No additional surface syntax is introduced.

### 15.9.2 Parsing

Behavioral subtyping is not parser-owned.

### 15.9.3 AST Representation / Form

Behavioral subtyping constrains the relationship between a class procedure contract and the implementing procedure contract for the same logical operation.

### 15.9.4 Static Semantics

When a type implements a class, its procedure implementations MUST satisfy the Liskov substitution principle with respect to the class-defined contracts.

Precondition rule:

1. An implementation MAY weaken the class precondition.
2. An implementation MUST NOT strengthen the class precondition.

Postcondition rule:

1. An implementation MAY strengthen the class postcondition.
2. An implementation MUST NOT weaken the class postcondition.

Verification strategy:

1. Statically verify that the class precondition implies the implementation precondition.
2. Statically verify that the implementation postcondition implies the class postcondition.

No runtime checks are generated for behavioral-subtyping obligations.

### 15.9.5 Dynamic Semantics

Behavioral subtyping introduces no runtime semantics beyond the contracts already enforced or proven for the selected implementation.

### 15.9.6 Lowering

Lowering assumes behavioral-subtyping obligations have already been discharged statically and emits no extra checks for them.

### 15.9.7 Diagnostics

Diagnostics are defined for implementations that strengthen class preconditions or weaken class postconditions.

## 15.10 Procedure, Contract, and Entry Diagnostics Supplement

This section owns diagnostics for procedure declarations, receiver constraints, `main`, and contract verification obligations.

| Code         | Severity | Detection    | Condition                                                                          |
| ------------ | -------- | ------------ | ---------------------------------------------------------------------------------- |
| `E-TYP-1507` | Error    | Compile-time | Procedure with non-unit return type requires explicit return statement             |
| `E-TYP-1912` | Error    | Compile-time | Explicit receiver type must be `Self` for record methods                           |
| `E-MOD-2411` | Error    | Compile-time | Missing move expression at call site for transferring provenance-bearing parameter |
| `E-MOD-2430` | Error    | Compile-time | Multiple `main` procedures defined                                                 |
| `E-MOD-2431` | Error    | Compile-time | Invalid `main` signature                                                           |
| `E-MOD-2432` | Error    | Compile-time | `main` is generic (has type parameters)                                            |
| `E-MOD-2434` | Error    | Compile-time | Missing `main` procedure                                                           |
| `E-CON-0415` | Error    | Compile-time | Capability-requiring operation in `@entry` expression                              |
| `E-CON-0416` | Error    | Compile-time | Side-effecting operation in `@entry` expression                                    |
| `P-SEM-2850` | Panic    | Runtime      | Contract predicate failed at runtime                                               |
| `E-SEM-2801` | Error    | Compile-time | Contract predicate not provable outside `[[dynamic]]` scope                        |
| `E-SEM-2802` | Error    | Compile-time | Impure expression in contract predicate                                            |
| `E-SEM-2803` | Error    | Compile-time | Implementation strengthens class precondition                                      |
| `E-SEM-2804` | Error    | Compile-time | Implementation weakens class postcondition                                         |
| `E-SEM-2805` | Error    | Compile-time | `@entry()` result type not `BitcopyType`                                           |
| `E-SEM-2806` | Error    | Compile-time | `@result` used outside postcondition                                               |
| `E-SEM-2807` | Error    | Compile-time | `@entry()` references parameter whose value is unavailable after binding           |
| `E-SEM-2820` | Error    | Compile-time | Type invariant violated at construction                                            |
| `E-SEM-2821` | Error    | Compile-time | Type invariant violated at public entry                                            |
| `E-SEM-2822` | Error    | Compile-time | Type invariant violated at mutator return                                          |
| `E-SEM-2823` | Error    | Compile-time | Type invariant violated at private-to-public return                                |
| `E-SEM-2824` | Error    | Compile-time | Public mutable field on type with invariant                                        |
| `E-SEM-2830` | Error    | Compile-time | Loop invariant not established at initialization                                   |
| `E-SEM-2831` | Error    | Compile-time | Loop invariant not maintained across iteration                                     |
| `E-SEM-3004` | Error    | Compile-time | Impure expression in contract clause                                               |
