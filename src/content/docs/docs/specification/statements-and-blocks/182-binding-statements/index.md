---
title: "18.2 Binding Statements"
description: "18.2 Binding Statements from 18. Statements and Blocks of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "statements-and-blocks"
specSection: "182-binding-statements"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/statements-and-blocks/">18. Statements and Blocks</a>
  <span>Statements and Blocks</span>
</div>

## 18.2 Binding Statements

### 18.2.1 Syntax

```text
binding_stmt ::= ("let" | "var") pattern (":" type)? binding_op expression terminator
binding_op   ::= "=" | ":="
```

### 18.2.2 Parsing

**(Parse-Binding-Stmt)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ \in \ \{\operatorname{Keyword}(\texttt{let}),\ \operatorname{Keyword}(\texttt{var})\}\quad \Gamma \ \vdash \ \operatorname{ParseBindingAfterLetVar}(P)\ \Downarrow \ (P_{1},\ \mathsf{bind}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStmtCore}(P)\ \Downarrow \ (P_{1},\ \operatorname{LetOrVarStmt}(P,\ \mathsf{bind}))
\end{array}
$$

**(Parse-BindingAfterLetVar)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ =\ \mathsf{kw}\ \in \ \{\operatorname{Keyword}(\texttt{let}),\ \operatorname{Keyword}(\texttt{var})\}\quad \Gamma \ \vdash \ \operatorname{ParsePattern}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{pat})\quad \Gamma \ \vdash \ \operatorname{ParseTypeAnnotOpt}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{ty}_{\mathsf{opt}})\quad \operatorname{Tok}(P_{2})\ \in \ \{\operatorname{Operator}(\texttt{"="}),\ \operatorname{Operator}(\texttt{":="})\}\quad \mathsf{op}\ =\ \operatorname{Tok}(P_{2})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(P_{2}))\ \Downarrow \ (P_{3},\ \mathsf{init}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseBindingAfterLetVar}(P)\ \Downarrow \ (P_{3},\ \langle \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \operatorname{SpanBetween}(P,\ P_{3})\rangle )
\end{array}
$$

**(LetOrVarStmt-Let)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ =\ \operatorname{Keyword}(\texttt{let}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LetOrVarStmt}(P,\ \mathsf{bind})\ \Downarrow \ \operatorname{LetStmt}(\mathsf{bind})
\end{array}
$$

**(LetOrVarStmt-Var)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ =\ \operatorname{Keyword}(\texttt{var}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LetOrVarStmt}(P,\ \mathsf{bind})\ \Downarrow \ \operatorname{VarStmt}(\mathsf{bind})
\end{array}
$$

### 18.2.3 AST Representation / Form

$$
\operatorname{LetOrVarStmt}(\mathsf{binding})\ \in \ \{\operatorname{LetStmt}(\mathsf{binding}),\ \operatorname{VarStmt}(\mathsf{binding})\}
$$

$$
\begin{array}{l}
\mathsf{Binding}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \mathsf{span}\rangle  \\[0.16em]
\operatorname{BindingForm}(\mathsf{binding})\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \_\rangle  \\[0.16em]
\operatorname{BindingParts}(\mathsf{binding})\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \mathsf{span}\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BindType}(\langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \_\rangle )\ =\ T\ \Leftrightarrow \ \mathsf{ty}_{\mathsf{opt}}\ =\ T \\[0.16em]
\operatorname{BindType}(\langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{pat},\ \bot ,\ \mathsf{op},\ \mathsf{init},\ \_\rangle )\ =\ \theta (T_{i})\ \Leftrightarrow \ \Gamma ;\ R;\ L\ \vdash \ \mathsf{init}\ \Rightarrow \ T_{i}\ \dashv \ C\ \land \ \operatorname{Solve}(C)\ \Downarrow \ \theta 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{TypeOf}(\langle \mathsf{sid},\ \mathsf{bind}_{\mathsf{id}},\ x\rangle )\ =\ \operatorname{TypeOf}(x) \\[0.16em]
\operatorname{BindInfo}(\langle \mathsf{sid},\ \mathsf{bind}_{\mathsf{id}},\ x\rangle )\ =\ \operatorname{BindInfo}(x)
\end{array}
$$

### 18.2.4 Static Semantics

$$
\mathsf{IntroEnt}\ =\ \langle \mathsf{Value},\ \bot ,\ \bot ,\ \mathsf{Decl}\rangle 
$$

**(IntroAll-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{IntroAll}(\Gamma ,\ [])\ \Downarrow \ \Gamma 
\end{array}
$$

**(IntroAll-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Intro}(x,\ \mathsf{IntroEnt})\ \Downarrow \ \Gamma_{1} \quad \operatorname{IntroAll}(\Gamma_{1} \ \cup \ \{x\ \mapsto \ \langle \texttt{let},\ T\rangle \},\ \mathsf{rest})\ \Downarrow \ \Gamma_{2}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{IntroAll}(\Gamma ,\ [(x,\ T)]\ \mathbin{++} \ \mathsf{rest})\ \Downarrow \ \Gamma_{2} 
\end{array}
$$

**(IntroAllVar-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{IntroAllVar}(\Gamma ,\ [])\ \Downarrow \ \Gamma 
\end{array}
$$

**(IntroAllVar-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Intro}(x,\ \mathsf{IntroEnt})\ \Downarrow \ \Gamma_{1} \quad \operatorname{IntroAllVar}(\Gamma_{1} \ \cup \ \{x\ \mapsto \ \langle \texttt{var},\ T\rangle \},\ \mathsf{rest})\ \Downarrow \ \Gamma_{2}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{IntroAllVar}(\Gamma ,\ [(x,\ T)]\ \mathbin{++} \ \mathsf{rest})\ \Downarrow \ \Gamma_{2} 
\end{array}
$$

**(T-LetStmt-Ann)**

$$
\begin{array}{l}
\mathsf{ty}_{\mathsf{opt}}\ =\ T_{a}\quad \Gamma ;\ R;\ L\ \vdash \ \mathsf{init}\ \Leftarrow \ T_{a}\ \dashv \ \emptyset \quad \Gamma \ \vdash \ \mathsf{pat}\ \Leftarrow \ T_{a}\ \dashv \ B\quad \operatorname{Distinct}(\operatorname{PatNames}(\mathsf{pat}))\quad \operatorname{IntroAll}(\Gamma ,\ B)\ \Downarrow \ \Gamma ' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{LetStmt}(\mathsf{binding})\ \Rightarrow \ \Gamma '\ \triangleright \ \langle [],\ [],\ \mathsf{false}\rangle 
\end{array}
$$

**(T-LetStmt-Ann-Mismatch)**

$$
\begin{array}{l}
\mathsf{ty}_{\mathsf{opt}}\ =\ T_{a}\quad \Gamma ;\ R;\ L\ \vdash \ \mathsf{init}\ \Rightarrow \ T_{i}\ \dashv \ C\quad \lnot (\Gamma \ \vdash \ T_{i}\ \mathrel{<:} \ T_{a})\quad c\ =\ \operatorname{Code}(T-\mathsf{LetStmt}-\mathsf{Ann}-\mathsf{Mismatch}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{LetStmt}(\mathsf{binding})\ \Uparrow \ c
\end{array}
$$

**(T-LetStmt-Infer)**

$$
\begin{array}{l}
\mathsf{ty}_{\mathsf{opt}}\ =\ \bot \quad \Gamma ;\ R;\ L\ \vdash \ \mathsf{init}\ \Rightarrow \ T_{i}\ \dashv \ C\quad \operatorname{Solve}(C)\ \Downarrow \ \theta \quad T_{b}\ =\ \theta (T_{i})\quad \Gamma \ \vdash \ \mathsf{pat}\ \Leftarrow \ T_{b}\ \dashv \ B\quad \operatorname{Distinct}(\operatorname{PatNames}(\mathsf{pat}))\quad \operatorname{IntroAll}(\Gamma ,\ B)\ \Downarrow \ \Gamma ' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{LetStmt}(\mathsf{binding})\ \Rightarrow \ \Gamma '\ \triangleright \ \langle [],\ [],\ \mathsf{false}\rangle 
\end{array}
$$

**(T-LetStmt-Infer-Err)**

$$
\begin{array}{l}
\mathsf{ty}_{\mathsf{opt}}\ =\ \bot \quad \Gamma ;\ R;\ L\ \vdash \ \mathsf{init}\ \Rightarrow \ T_{i}\ \dashv \ C\quad \operatorname{Solve}(C)\ \Uparrow \quad c\ =\ \operatorname{Code}(T-\mathsf{LetStmt}-\mathsf{Infer}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{LetStmt}(\mathsf{binding})\ \Uparrow \ c
\end{array}
$$

**(T-VarStmt-Ann)**, **(T-VarStmt-Ann-Mismatch)**, **(T-VarStmt-Infer)**, and **(T-VarStmt-Infer-Err)** are identical except that they use `IntroAllVar`.

**(Let-Refutable-Pattern-Err)**

$$
\begin{array}{l}
\mathsf{pat}\ \in \ \{\operatorname{LiteralPattern}(\_),\ \operatorname{EnumPattern}(\_,\ \_,\ \_),\ \operatorname{ModalPattern}(\_,\ \_),\ \operatorname{RangePattern}(\_,\ \_,\ \_)\}\quad c\ =\ \operatorname{Code}(\mathsf{Let}-\mathsf{Refutable}-\mathsf{Pattern}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{pat}\ \Leftarrow \ T\ \Uparrow \ c
\end{array}
$$

**(B-LetVar-UniqueNonMove-Err)**

$$
\begin{array}{l}
T_{b}\ =\ \operatorname{BindType}(\langle \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \_\rangle )\quad \operatorname{PermOf}(T_{b})\ =\ \texttt{unique}\quad \operatorname{IsPlace}(\mathsf{init})\quad \lnot \ \operatorname{IsMoveExpr}(\mathsf{init})\quad c\ =\ \operatorname{Code}(B-\mathsf{LetVar}-\mathsf{UniqueNonMove}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \mathfrak{B} ;\ \Pi \ \vdash \ \operatorname{LetOrVarStmt}(\langle \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \_\rangle )\ \Uparrow \ c
\end{array}
$$

$$
\begin{array}{l}
\operatorname{SuspendUniqueBind}(\Pi ,\ \mathsf{init},\ T_{b})\ = \\[0.16em]
\ \{\ \operatorname{SuspendUniquePath}(\Pi ,\ \bot ,\ \mathsf{init})\quad \mathsf{if}\ \operatorname{IsPlace}(\mathsf{init})\ \land \ \operatorname{PermOf}(\operatorname{ExprType}(\mathsf{init}))\ =\ \texttt{unique}\ \land \ \operatorname{PermOf}(T_{b})\ =\ \texttt{const} \\[0.16em]
\quad \Pi \quad \mathsf{otherwise}\ \}
\end{array}
$$

**(B-LetVar)**

$$
\begin{array}{l}
\Gamma ;\ \mathfrak{B} ;\ \Pi \ \vdash \ \mathsf{init}\ \Rightarrow \ \mathfrak{B}_{1} \ \triangleright \ \Pi_{1} \quad T_{b}\ =\ \operatorname{BindType}(\langle \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \_\rangle )\quad \Pi_{2} \ =\ \operatorname{SuspendUniqueBind}(\Pi_{1} ,\ \mathsf{init},\ T_{b})\quad \mathfrak{B}_{2} \ =\ \operatorname{ConsumeOnMove}(\mathfrak{B}_{1} ,\ \mathsf{init})\quad \Gamma \ \vdash \ \mathsf{pat}\ \Leftarrow \ T_{b}\ \dashv \ B\quad \mathfrak{B}_{3} \ =\ \operatorname{IntroAll_B}(\mathfrak{B}_{2} ,\ \operatorname{BindInfoMap}(\lambda \ U.\ \operatorname{RespOfInit}(\mathsf{init}),\ B,\ \operatorname{MovOf}(\mathsf{op}),\ \mathsf{mut})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \mathfrak{B} ;\ \Pi \ \vdash \ \operatorname{LetOrVarStmt}(\langle \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \_\rangle )\ \Rightarrow \ \mathfrak{B}_{3} \ \triangleright \ \Pi_{2} 
\end{array}
$$

**(Prov-LetVar-Ordinary)**

$$
\begin{array}{l}
\mathsf{binding}\ =\ \langle \mathsf{pat},\ \_,\ \_,\ \mathsf{init},\ \_\rangle \quad \Gamma ;\ \Omega \ \vdash \ \mathsf{init}\ \Downarrow \ \pi_{\mathsf{init}} \quad \Gamma \ \vdash \ \operatorname{PatNames}(\mathsf{pat})\ \Downarrow \ N\quad \pi_{\mathsf{bind}} \ =\ \operatorname{BindProv}(\Omega ,\ \pi_{\mathsf{init}} )\quad \pi_{\mathsf{bind}} \ \ne \ \pi_{\mathsf{Region}} (\mathsf{tag})\ \mathsf{for}\ \mathsf{every}\ \mathsf{tag}\quad \Sigma \_\pi '\ =\ \mathsf{IntroAll}\_\pi (\Sigma \_\pi ,\ N,\ \pi_{\mathsf{bind}} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \langle \Sigma \_\pi ,\ \mathsf{RS}\rangle \ \vdash \ \operatorname{LetOrVarStmt}(\mathsf{binding})\ \Rightarrow \ \langle \Sigma \_\pi ',\ \mathsf{RS}\rangle \ \triangleright \ \langle [],\ [],\ \mathsf{false}\rangle 
\end{array}
$$

**(Prov-LetVar-Region-Alias)**

$$
\begin{array}{l}
\mathsf{binding}\ =\ \langle \mathsf{pat},\ \_,\ \_,\ \mathsf{init},\ \_\rangle \quad \Gamma ;\ \Omega \ \vdash \ \mathsf{init}\ \Downarrow \ \pi_{\mathsf{Region}} (\mathsf{tag})\quad \Gamma \ \vdash \ \operatorname{PatNames}(\mathsf{pat})\ \Downarrow \ [x]\quad \Sigma \_\pi '\ =\ \mathsf{Intro}\_\pi (\Sigma \_\pi ,\ x,\ \pi_{\mathsf{Region}} (\mathsf{tag}))\quad \mathsf{IntroRegionAlias}\_\pi (\langle \Sigma \_\pi ',\ \mathsf{RS}\rangle ,\ \mathsf{tag},\ x)\ =\ \Omega ' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \langle \Sigma \_\pi ,\ \mathsf{RS}\rangle \ \vdash \ \operatorname{LetOrVarStmt}(\mathsf{binding})\ \Rightarrow \ \Omega '\ \triangleright \ \langle [],\ [],\ \mathsf{false}\rangle 
\end{array}
$$

**(Prov-LetVar-Region-Fresh)**

$$
\begin{array}{l}
\mathsf{binding}\ =\ \langle \mathsf{pat},\ \_,\ \_,\ \mathsf{init},\ \_\rangle \quad \operatorname{FreshRegionExpr}(\mathsf{init})\quad \Gamma \ \vdash \ \operatorname{PatNames}(\mathsf{pat})\ \Downarrow \ [x]\quad \operatorname{FreshRegionTag}(\langle \Sigma \_\pi ,\ \mathsf{RS}\rangle )\ =\ \mathsf{tag}\quad \Sigma \_\pi '\ =\ \mathsf{Intro}\_\pi (\Sigma \_\pi ,\ x,\ \pi_{\mathsf{Region}} (\mathsf{tag}))\quad \mathsf{IntroRegionAlias}\_\pi (\langle \Sigma \_\pi ',\ \mathsf{RS}\rangle ,\ \mathsf{tag},\ x)\ =\ \Omega ' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \langle \Sigma \_\pi ,\ \mathsf{RS}\rangle \ \vdash \ \operatorname{LetOrVarStmt}(\mathsf{binding})\ \Rightarrow \ \Omega '\ \triangleright \ \langle [],\ [],\ \mathsf{false}\rangle 
\end{array}
$$

### 18.2.5 Dynamic Semantics

$$
\operatorname{BindVal}(\sigma ,\ x,\ v)\ \Downarrow \ (\sigma ',\ b)\ \Leftrightarrow \ \operatorname{ScopeStack}(\sigma )\ =\ \mathsf{scope}\ \mathbin{::} \ \mathsf{ss}\ \land \ \mathsf{scope}\ =\ \langle \mathsf{sid},\ \mathsf{cleanup},\ \mathsf{names},\ \mathsf{vals},\ \mathsf{states}\rangle \ \land \ \mathsf{bind}_{\mathsf{id}}\ =\ \operatorname{FreshBindId}(\sigma )\ \land \ \mathsf{names}'\ =\ \mathsf{names}[x\ \mapsto \ (\mathsf{names}[x]\ \mathsf{if}\ \mathsf{present}\ \mathsf{else}\ [])\ \mathbin{++} \ [\mathsf{bind}_{\mathsf{id}}]]\ \land \ \mathsf{vals}'\ =\ \mathsf{vals}[\mathsf{bind}_{\mathsf{id}}\ \mapsto \ v]\ \land \ \mathsf{states}'\ =\ \mathsf{states}[\mathsf{bind}_{\mathsf{id}}\ \mapsto \ \texttt{Valid}]\ \land \ \mathsf{scope}'\ =\ \langle \mathsf{sid},\ \mathsf{cleanup},\ \mathsf{names}',\ \mathsf{vals}',\ \mathsf{states}'\rangle \ \land \ \operatorname{UpdateScopeStack}(\sigma ,\ \mathsf{scope}'\ \mathbin{::} \ \mathsf{ss})\ =\ \sigma_{1} \ \land \ b\ =\ \langle \mathsf{sid},\ \mathsf{bind}_{\mathsf{id}},\ x\rangle \ \land \ ((\operatorname{BindInfo}(b).\mathsf{resp}\ =\ \mathsf{resp}\ \land \ \operatorname{AppendCleanup}(\sigma_{1} ,\ \operatorname{DropBinding}(b))\ \Downarrow \ \sigma ')\ \lor \ (\operatorname{BindInfo}(b).\mathsf{resp}\ \ne \ \mathsf{resp}\ \land \ \sigma '\ =\ \sigma_{1} ))
$$

$$
\begin{array}{l}
\operatorname{BindPatternVal}(p,\ v)\ \Downarrow \ B\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{MatchPattern}(p,\ v)\ \Downarrow \ B \\[0.16em]
\operatorname{BindOrder}(p,\ B)\ =\ [\langle x,\ B[x]\rangle \ \mid \ x\ \in \ \operatorname{PatNames}(p)]
\end{array}
$$

**(BindList-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{BindList}(\sigma ,\ [])\ \Downarrow \ (\sigma ,\ [])
\end{array}
$$

**(BindList-Cons)**

$$
\begin{array}{l}
\operatorname{BindVal}(\sigma ,\ x,\ v)\ \Downarrow \ (\sigma_{1} ,\ b)\quad \operatorname{BindList}(\sigma_{1} ,\ \mathsf{xs})\ \Downarrow \ (\sigma_{2} ,\ \mathsf{bs}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{BindList}(\sigma ,\ [\langle x,\ v\rangle ]\ \mathbin{++} \ \mathsf{xs})\ \Downarrow \ (\sigma_{2} ,\ b\mathbin{::} \mathsf{bs})
\end{array}
$$

$$
\operatorname{BindPattern}(\sigma ,\ p,\ v)\ \Downarrow \ (\sigma ',\ \mathsf{bs})\ \Leftrightarrow \ \operatorname{BindPatternVal}(p,\ v)\ \Downarrow \ B\ \land \ \operatorname{BindOrder}(p,\ B)\ =\ \mathsf{binds}\ \land \ \operatorname{BindList}(\sigma ,\ \mathsf{binds})\ \Downarrow \ (\sigma ',\ \mathsf{bs})
$$

**(ExecSigma-Let)**

$$
\begin{array}{l}
\operatorname{BindingForm}(\mathsf{binding})\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \_\rangle \quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{init},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad \operatorname{BindPattern}(\sigma_{1} ,\ \mathsf{pat},\ v)\ \Downarrow \ (\sigma_{2} ,\ \mathsf{bs}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{LetStmt}(\mathsf{binding}),\ \sigma )\ \Downarrow \ (\mathsf{ok},\ \sigma_{2} )
\end{array}
$$

**(ExecSigma-Let-Ctrl)**

$$
\begin{array}{l}
\operatorname{BindingForm}(\mathsf{binding})\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \_\rangle \quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{init},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{LetStmt}(\mathsf{binding}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(ExecSigma-Var)** and **(ExecSigma-Var-Ctrl)** are the corresponding rules for `VarStmt(binding)`.

### 18.2.6 Lowering

**(Lower-Stmt-Let)**

$$
\begin{array}{l}
\operatorname{BindingParts}(\mathsf{binding})\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \mathsf{span}\rangle \quad \Gamma \ \vdash \ \operatorname{LowerExpr}(\mathsf{init})\ \Downarrow \ \langle \mathsf{IR}_{i},\ v\rangle \quad \Gamma \ \vdash \ \operatorname{LowerBindPattern}(\mathsf{pat},\ v)\ \Downarrow \ \mathsf{IR}_{b} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{LetStmt}(\mathsf{binding}))\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{i},\ \mathsf{IR}_{b})
\end{array}
$$

**(Lower-Stmt-Var)**

$$
\begin{array}{l}
\operatorname{BindingParts}(\mathsf{binding})\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \mathsf{span}\rangle \quad \Gamma \ \vdash \ \operatorname{LowerExpr}(\mathsf{init})\ \Downarrow \ \langle \mathsf{IR}_{i},\ v\rangle \quad \Gamma \ \vdash \ \operatorname{LowerBindPattern}(\mathsf{pat},\ v)\ \Downarrow \ \mathsf{IR}_{b} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{VarStmt}(\mathsf{binding}))\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{i},\ \mathsf{IR}_{b})
\end{array}
$$

### 18.2.7 Diagnostics

Diagnostics are defined for type annotations incompatible with the initializer, inference failure, refutable patterns in `let`, duplicate names introduced by a single binding pattern, and `unique` bindings initialized from a place expression without explicit `move`.
