---
title: "Statements and Blocks"
description: "18. Statements and Blocks of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
generatedAt: "2026-05-14T00:55:03.609Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>


## 18.1 Blocks

### 18.1.1 Syntax

```text
statement_seq ::= statement* expression?
statement     ::= binding_stmt
                | using_local_stmt
                | assignment_stmt
                | compound_assign
                | expr_stmt
                | defer_stmt
                | region_stmt
                | frame_stmt
                | return_stmt
                | break_stmt
                | continue_stmt
                | unsafe_block
                | key_block_stmt
                | comptime_stmt
block_expr    ::= "{" statement_seq "}"
```

`key_block_stmt` is defined in Chapter 19.
`comptime_stmt` is defined in §22.1.1.

### 18.1.2 Parsing

**Statement Terminators.**

$$
\begin{array}{l}
\mathsf{StmtTerm}\ =\ \{\operatorname{Punctuator}(\texttt{";"}),\ \mathsf{Newline}\} \\[0.16em]
\operatorname{Terminates}(t)\ \Leftrightarrow \ t\ \in \ \mathsf{StmtTerm}
\end{array}
$$

AttachStmtAttrs(⊥, s) = s. When attrs_opt ≠ ⊥, AttachStmtAttrs(attrs_opt, s) denotes the statement obtained by attaching attrs_opt to s according to Chapter 9.

**(Parse-Statement)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseStmtCore}(P_{0})\ \Downarrow \ (P_{1},\ s_{0})\quad s\ =\ \operatorname{AttachStmtAttrs}(\mathsf{attrs}_{\mathsf{opt}},\ s_{0})\quad \Gamma \ \vdash \ \operatorname{ConsumeTerminatorOpt}(P_{1},\ s)\ \Downarrow \ P_{2} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStmt}(P)\ \Downarrow \ (P_{2},\ s)
\end{array}
$$

**(Parse-Statement-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad c\ =\ \operatorname{Code}(\mathsf{Parse}-\mathsf{Syntax}-\mathsf{Err})\quad \Gamma \ \vdash \ \operatorname{Emit}(c,\ \operatorname{Tok}(P_{0}).\mathsf{span})\quad P_{1}\ =\ \operatorname{AdvanceOrEOF}(P_{0})\quad \Gamma \ \vdash \ \operatorname{SyncStmt}(P_{1})\ \Downarrow \ P_{2} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStmt}(P)\ \Downarrow \ (P_{2},\ \operatorname{ErrorStmt}(\operatorname{SpanBetween}(P_{0},\ P_{2})))
\end{array}
$$

**(Parse-Block)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseStmtSeq}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{stmts},\ \mathsf{tail})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseBlock}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{BlockExpr}(\mathsf{stmts},\ \mathsf{tail}))
\end{array}
$$

$$
\operatorname{ReqTerm}(s)\ \Leftrightarrow \ s\ \in \ \{\operatorname{LetStmt}(\_),\ \operatorname{VarStmt}(\_),\ \operatorname{UsingLocalStmt}(\_,\ \_,\ \_),\ \operatorname{AssignStmt}(\_,\ \_),\ \operatorname{CompoundAssignStmt}(\_,\ \_,\ \_),\ \operatorname{ExprStmt}(\_)\}
$$

**(ConsumeTerminatorOpt-Req-Yes)**
ReqTerm(s)    IsTerm(Tok(P))

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ConsumeTerminatorOpt}(P,\ s)\ \Downarrow \ \operatorname{Advance}(P)
\end{array}
$$

**(ConsumeTerminatorOpt-Req-No)**

$$
\begin{array}{l}
\operatorname{ReqTerm}(s)\quad \lnot \ \operatorname{IsTerm}(\operatorname{Tok}(P))\quad \operatorname{Emit}(\operatorname{Code}(\mathsf{Missing}-\mathsf{Terminator}-\mathsf{Err}),\ \mathsf{Span}\ =\ \operatorname{Tok}(P).\mathsf{span})\quad \Gamma \ \vdash \ \operatorname{SyncStmt}(P)\ \Downarrow \ P_{1} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ConsumeTerminatorOpt}(P,\ s)\ \Downarrow \ P_{1}
\end{array}
$$

**(ConsumeTerminatorOpt-Opt-Yes)**

$$
\begin{array}{l}
\lnot \ \operatorname{ReqTerm}(s)\quad \operatorname{IsTerm}(\operatorname{Tok}(P)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ConsumeTerminatorOpt}(P,\ s)\ \Downarrow \ \operatorname{Advance}(P)
\end{array}
$$

**(ConsumeTerminatorOpt-Opt-No)**

$$
\begin{array}{l}
\lnot \ \operatorname{ReqTerm}(s)\quad \lnot \ \operatorname{IsTerm}(\operatorname{Tok}(P)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ConsumeTerminatorOpt}(P,\ s)\ \Downarrow \ P
\end{array}
$$

$$
\begin{array}{l}
\operatorname{SkipNL}(P)\ =\ P\quad \mathsf{if}\ \operatorname{Tok}(P)\ \ne \ \mathsf{Newline} \\[0.16em]
\operatorname{SkipNL}(P)\ =\ \operatorname{SkipNL}(\operatorname{Advance}(P))\quad \mathsf{if}\ \operatorname{Tok}(P)\ =\ \mathsf{Newline}
\end{array}
$$

**(ParseStmtSeq-End)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ =\ \operatorname{Punctuator}(\texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStmtSeq}(P)\ \Downarrow \ (P,\ [],\ \bot )
\end{array}
$$

**(ParseStmtSeq-TailExpr)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ \notin \ \{\operatorname{Punctuator}(\texttt{"\}"})\}\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(P)\ \Downarrow \ (P_{1},\ e)\quad P_{1}'\ =\ \operatorname{SkipNL}(P_{1})\quad \operatorname{Tok}(P_{1}')\ =\ \operatorname{Punctuator}(\texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStmtSeq}(P)\ \Downarrow \ (P_{1}',\ [],\ e)
\end{array}
$$

**(ParseStmtSeq-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseStmt}(P)\ \Downarrow \ (P_{1},\ s)\quad \Gamma \ \vdash \ \operatorname{ParseStmtSeq}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{ss},\ \mathsf{tail}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStmtSeq}(P)\ \Downarrow \ (P_{2},\ [s]\ \mathbin{++} \ \mathsf{ss},\ \mathsf{tail})
\end{array}
$$

$$
\mathsf{SyncStmt}\ =\ \{\operatorname{Punctuator}(\texttt{";"}),\ \mathsf{Newline},\ \operatorname{Punctuator}(\texttt{"\}"}),\ \mathsf{EOF}\}
$$

### 18.1.3 AST Representation / Form

$$
\mathsf{Stmt}\ =\ \{\operatorname{LetStmt}(\mathsf{binding}),\ \operatorname{VarStmt}(\mathsf{binding}),\ \operatorname{ErrorStmt}(\mathsf{span}),\ \operatorname{UsingLocalStmt}(\mathsf{source},\ \mathsf{alias},\ \mathsf{span}),\ \operatorname{AssignStmt}(\mathsf{place},\ \mathsf{expr}),\ \operatorname{CompoundAssignStmt}(\mathsf{place},\ \mathsf{op},\ \mathsf{expr}),\ \operatorname{ExprStmt}(\mathsf{expr}),\ \operatorname{DeferStmt}(\mathsf{block}),\ \operatorname{RegionStmt}(\mathsf{opts}_{\mathsf{opt}},\ \mathsf{alias}_{\mathsf{opt}},\ \mathsf{block}),\ \operatorname{FrameStmt}(\mathsf{target}_{\mathsf{opt}},\ \mathsf{block}),\ \operatorname{KeyBlockStmt}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{paths},\ \mathsf{mods},\ \mathsf{mode}_{\mathsf{opt}},\ \mathsf{block},\ \mathsf{span}),\ \operatorname{ReturnStmt}(\mathsf{expr}_{\mathsf{opt}}),\ \operatorname{BreakStmt}(\mathsf{expr}_{\mathsf{opt}}),\ \mathsf{ContinueStmt},\ \operatorname{UnsafeBlockStmt}(\mathsf{block}),\ \operatorname{CtStmt}(\mathsf{body},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{span})\}
$$

$$
\begin{array}{l}
\operatorname{LastStmt}([])\ =\ \bot  \\[0.16em]
\operatorname{LastStmt}([s_{1},\ \ldots ,\ s_{n}])\ =\ s_{n}\quad (n\ \ge \ 1)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ResType}([T_{1},\ \ldots ,\ T_{n}])\ =\ T\ \Leftrightarrow \ n\ \ge \ 1\ \land \ \forall \ i.\ \Gamma \ \vdash \ T_{i}\ \equiv \ T \\[0.16em]
\operatorname{ResType}([])\ =\ \bot 
\end{array}
$$

### 18.1.4 Static Semantics

$$
\begin{array}{l}
\mathsf{MutKind}\ =\ \{\texttt{let},\ \texttt{var}\} \\[0.16em]
\mathsf{Bind}\ =\ \{\langle \mathsf{mut},\ T\rangle \ \mid \ \mathsf{mut}\ \in \ \mathsf{MutKind}\ \land \ T\ \in \ \mathsf{Type}\} \\[0.16em]
\operatorname{BindOf}(\Gamma ,\ x)\ =\ \langle \mathsf{mut},\ T\rangle \ \Leftrightarrow \ \langle \mathsf{mut},\ T\rangle \ \mathsf{is}\ \mathsf{the}\ \mathsf{binding}\ \mathsf{for}\ x\ \mathsf{in}\ \mathsf{the}\ \mathsf{nearest}\ \mathsf{scope}\ \mathsf{of}\ \operatorname{Scopes}(\Gamma ) \\[0.16em]
(x\ :\ T)\ \in \ \Gamma \ \Leftrightarrow \ \exists \ \mathsf{mut}.\ \operatorname{BindOf}(\Gamma ,\ x)\ =\ \langle \mathsf{mut},\ T\rangle  \\[0.16em]
\operatorname{MutOf}(\Gamma ,\ x)\ =\ \mathsf{mut}\ \Leftrightarrow \ \operatorname{BindOf}(\Gamma ,\ x)\ =\ \langle \mathsf{mut},\ T\rangle 
\end{array}
$$

$$
\mathsf{StmtJudg}\ =\ \{\Gamma ;\ R;\ L\ \vdash \ s\ \Rightarrow \ \Gamma '\ \triangleright \ \langle \mathsf{Res},\ \mathsf{Brk},\ \mathsf{BrkVoid}\rangle ,\ \Gamma ;\ R;\ L\ \vdash \ \mathsf{ss}\ \Rightarrow \ \Gamma '\ \triangleright \ \langle \mathsf{Res},\ \mathsf{Brk},\ \mathsf{BrkVoid}\rangle ,\ \Gamma ;\ R;\ L\ \vdash \ e\ :\ T,\ \Gamma ;\ R;\ L\ \vdash \ b\ :\ T,\ \Gamma ;\ R;\ L\ \vdash \ \operatorname{BlockInfo}(b)\ \Downarrow \ \langle T,\ \mathsf{Brk},\ \mathsf{BrkVoid}\rangle ,\ \Gamma \ \vdash \ \mathsf{pat}\ \Leftarrow \ T\ \dashv \ B\}
$$

$$
\mathsf{LoopFlag}\ =\ \{\bot ,\ \texttt{loop}\}
$$

$$
\begin{array}{l}
\operatorname{PushScope}(\Gamma )\ =\ \Gamma '\ \Leftrightarrow \ \operatorname{Scopes}(\Gamma ')\ =\ [\emptyset ]\ \mathbin{++} \ \operatorname{Scopes}(\Gamma )\ \land \ \operatorname{Project}(\Gamma ')\ =\ \operatorname{Project}(\Gamma )\ \land \ \operatorname{ResCtx}(\Gamma ')\ =\ \operatorname{ResCtx}(\Gamma ) \\[0.16em]
\operatorname{PopScope}(\Gamma ')\ =\ \Gamma \ \Leftrightarrow \ \operatorname{Scopes}(\Gamma ')\ =\ [\_]\ \mathbin{++} \ \operatorname{Scopes}(\Gamma )\ \land \ \operatorname{Project}(\Gamma ')\ =\ \operatorname{Project}(\Gamma )\ \land \ \operatorname{ResCtx}(\Gamma ')\ =\ \operatorname{ResCtx}(\Gamma )
\end{array}
$$

**(T-ErrorStmt)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{ErrorStmt}(\_)\ \Rightarrow \ \Gamma \ \triangleright \ \langle [],\ [],\ \mathsf{false}\rangle 
\end{array}
$$

**(BlockInfo-Res)**

$$
\begin{array}{l}
\Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \Gamma_{0} ;\ R;\ L\ \vdash \ \mathsf{stmts}\ \Rightarrow \ \Gamma_{1} \ \triangleright \ \langle \mathsf{Res},\ \mathsf{Brk},\ \mathsf{BrkVoid}\rangle \quad \Gamma \ \vdash \ \operatorname{WarnResultUnreachable}(\mathsf{stmts})\ \Downarrow \ \mathsf{ok}\quad \operatorname{ResType}(\mathsf{Res})\ =\ T\quad (\mathsf{tail}_{\mathsf{opt}}\ =\ e\ \Rightarrow \ \Gamma_{1} ;\ R;\ L\ \vdash \ e\ :\ T_{e}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{BlockInfo}(\operatorname{BlockExpr}(\mathsf{stmts},\ \mathsf{tail}_{\mathsf{opt}}))\ \Downarrow \ \langle T,\ \mathsf{Brk},\ \mathsf{BrkVoid}\rangle 
\end{array}
$$

**(BlockInfo-Res-Err)**

$$
\begin{array}{l}
\Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \Gamma_{0} ;\ R;\ L\ \vdash \ \mathsf{stmts}\ \Rightarrow \ \Gamma_{1} \ \triangleright \ \langle \mathsf{Res},\ \mathsf{Brk},\ \mathsf{BrkVoid}\rangle \quad \mathsf{Res}\ \ne \ []\quad \lnot \ \exists \ T.\ \operatorname{ResType}(\mathsf{Res})\ =\ T\quad c\ =\ \operatorname{Code}(\mathsf{BlockInfo}-\mathsf{Res}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{BlockInfo}(\operatorname{BlockExpr}(\mathsf{stmts},\ \mathsf{tail}_{\mathsf{opt}}))\ \Uparrow \ c
\end{array}
$$

**(BlockInfo-Tail)**

$$
\begin{array}{l}
\Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \Gamma_{0} ;\ R;\ L\ \vdash \ \mathsf{stmts}\ \Rightarrow \ \Gamma_{1} \ \triangleright \ \langle \mathsf{Res},\ \mathsf{Brk},\ \mathsf{BrkVoid}\rangle \quad \Gamma \ \vdash \ \operatorname{WarnResultUnreachable}(\mathsf{stmts})\ \Downarrow \ \mathsf{ok}\quad \operatorname{ResType}(\mathsf{Res})\ =\ \bot \quad \mathsf{tail}_{\mathsf{opt}}\ =\ e\quad \Gamma_{1} ;\ R;\ L\ \vdash \ e\ :\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{BlockInfo}(\operatorname{BlockExpr}(\mathsf{stmts},\ \mathsf{tail}_{\mathsf{opt}}))\ \Downarrow \ \langle T,\ \mathsf{Brk},\ \mathsf{BrkVoid}\rangle 
\end{array}
$$

**(BlockInfo-ReturnTail)**

$$
\begin{array}{l}
\Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \Gamma_{0} ;\ R;\ L\ \vdash \ \mathsf{stmts}\ \Rightarrow \ \Gamma_{1} \ \triangleright \ \langle \mathsf{Res},\ \mathsf{Brk},\ \mathsf{BrkVoid}\rangle \quad \Gamma \ \vdash \ \operatorname{WarnResultUnreachable}(\mathsf{stmts})\ \Downarrow \ \mathsf{ok}\quad \operatorname{ResType}(\mathsf{Res})\ =\ \bot \quad \mathsf{tail}_{\mathsf{opt}}\ =\ \bot \quad \operatorname{LastStmt}(\mathsf{stmts})\ =\ \operatorname{ReturnStmt}(\_) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{BlockInfo}(\operatorname{BlockExpr}(\mathsf{stmts},\ \bot ))\ \Downarrow \ \langle \operatorname{TypePrim}(\texttt{"!"}),\ \mathsf{Brk},\ \mathsf{BrkVoid}\rangle 
\end{array}
$$

**(BlockInfo-Unit)**

$$
\begin{array}{l}
\Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \Gamma_{0} ;\ R;\ L\ \vdash \ \mathsf{stmts}\ \Rightarrow \ \Gamma_{1} \ \triangleright \ \langle \mathsf{Res},\ \mathsf{Brk},\ \mathsf{BrkVoid}\rangle \quad \Gamma \ \vdash \ \operatorname{WarnResultUnreachable}(\mathsf{stmts})\ \Downarrow \ \mathsf{ok}\quad \operatorname{ResType}(\mathsf{Res})\ =\ \bot \quad \mathsf{tail}_{\mathsf{opt}}\ =\ \bot \quad \operatorname{LastStmt}(\mathsf{stmts})\ \ne \ \operatorname{ReturnStmt}(\_) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{BlockInfo}(\operatorname{BlockExpr}(\mathsf{stmts},\ \bot ))\ \Downarrow \ \langle \operatorname{TypePrim}(\texttt{"()"}),\ \mathsf{Brk},\ \mathsf{BrkVoid}\rangle 
\end{array}
$$

**(T-Block)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \operatorname{BlockInfo}(b)\ \Downarrow \ \langle T,\ \_,\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ b\ :\ T
\end{array}
$$

**(Chk-Block-Tail)**, **(Chk-Block-Return)**, and **(Chk-Block-Unit)** define checking-mode validation for block expressions.

`BlockExpr` is also an expression form in §16.7. The rules above remain the block-local typing rules used there.

### 18.1.5 Dynamic Semantics

$$
\mathsf{ExecJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{ExecSigma}(s,\ \sigma )\ \Downarrow \ (\mathsf{sout},\ \sigma '),\ \Gamma \ \vdash \ \operatorname{ExecSeqSigma}(\mathsf{ss},\ \sigma )\ \Downarrow \ (\mathsf{sout},\ \sigma ')\}
$$

$$
\begin{array}{l}
\mathsf{Ctrl}\ =\ \{\operatorname{Return}(v),\ \operatorname{Result}(v),\ \operatorname{Break}(v_{\mathsf{opt}}),\ \mathsf{Continue},\ \mathsf{Panic},\ \mathsf{Abort}\} \\[0.16em]
\mathsf{StmtOut}\ =\ \{\mathsf{ok}\}\ \cup \ \{\operatorname{Ctrl}(\kappa )\ \mid \ \kappa \ \in \ \mathsf{Ctrl}\} \\[0.16em]
\mathsf{EvalOutcome}\ =\ \{\operatorname{Val}(v)\}\ \cup \ \{\operatorname{Ctrl}(\kappa )\ \mid \ \kappa \ \in \ \mathsf{Ctrl}\} \\[0.16em]
\operatorname{StmtOutOf}(\operatorname{Val}(v))\ =\ \mathsf{ok} \\[0.16em]
\operatorname{StmtOutOf}(\operatorname{Ctrl}(\kappa ))\ =\ \operatorname{Ctrl}(\kappa ) \\[0.16em]
\operatorname{BreakVal}(\bot )\ =\ () \\[0.16em]
\operatorname{BreakVal}(v)\ =\ v
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ExitOutcome}(\mathsf{out},\ \mathsf{ok})\ =\ \mathsf{out} \\[0.16em]
\operatorname{ExitOutcome}(\operatorname{Ctrl}(\mathsf{Abort}),\ c)\ =\ \operatorname{Ctrl}(\mathsf{Abort}) \\[0.16em]
\operatorname{ExitOutcome}(\operatorname{Ctrl}(\mathsf{Panic}),\ \mathsf{panic})\ =\ \operatorname{Ctrl}(\mathsf{Abort}) \\[0.16em]
\operatorname{ExitOutcome}(\mathsf{out},\ \mathsf{panic})\ =\ \operatorname{Ctrl}(\mathsf{Panic})\quad (\mathsf{out}\ \ne \ \operatorname{Ctrl}(\mathsf{Panic})\ \land \ \mathsf{out}\ \ne \ \operatorname{Ctrl}(\mathsf{Abort}))
\end{array}
$$

$$
\operatorname{BlockExit}(\sigma ,\ \mathsf{scope},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma ')\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{CleanupScope}(\mathsf{scope},\ \sigma )\ \Downarrow \ (c,\ \sigma_{1} )\ \land \ \mathsf{out}'\ =\ \operatorname{ExitOutcome}(\mathsf{out},\ c)\ \land \ ((\mathsf{out}'\ =\ \operatorname{Ctrl}(\mathsf{Abort})\ \land \ \sigma '\ =\ \sigma_{1} )\ \lor \ (\mathsf{out}'\ \ne \ \operatorname{Ctrl}(\mathsf{Abort})\ \land \ \mathsf{PopScope}\_\sigma (\sigma_{1} )\ \Downarrow \ (\sigma ',\ \mathsf{scope})))
$$

$$
\begin{array}{l}
\operatorname{EvalBlockBodySigma}(\operatorname{BlockExpr}(\mathsf{stmts},\ \mathsf{tail}_{\mathsf{opt}}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{ExecSeqSigma}(\mathsf{stmts},\ \sigma )\ \Downarrow \ (\mathsf{sout},\ \sigma_{1} )\ \land \ ( \\[0.16em]
\ (\mathsf{sout}\ =\ \mathsf{ok}\ \land \ \mathsf{tail}_{\mathsf{opt}}\ =\ e\ \land \ \Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma '))\ \lor  \\[0.16em]
\ (\mathsf{sout}\ =\ \mathsf{ok}\ \land \ \mathsf{tail}_{\mathsf{opt}}\ =\ \bot \ \land \ \mathsf{out}\ =\ \operatorname{Val}(())\ \land \ \sigma '\ =\ \sigma_{1} )\ \lor  \\[0.16em]
\ (\mathsf{sout}\ =\ \operatorname{Ctrl}(\operatorname{TailValue}(v))\ \land \ \mathsf{out}\ =\ \operatorname{Val}(v)\ \land \ \sigma '\ =\ \sigma_{1} )\ \lor  \\[0.16em]
\ (\mathsf{sout}\ =\ \operatorname{Ctrl}(\kappa )\ \land \ \kappa \ \ne \ \operatorname{TailValue}(\_)\ \land \ \mathsf{out}\ =\ \operatorname{Ctrl}(\kappa )\ \land \ \sigma '\ =\ \sigma_{1} ) \\[0.16em]
)
\end{array}
$$

$$
\operatorname{EvalBlockSigma}(b,\ \sigma )\ \Downarrow \ (\mathsf{out}',\ \sigma '')\ \Leftrightarrow \ \operatorname{BlockEnter}(\sigma ,\ [])\ \Downarrow \ (\sigma_{1} ,\ \mathsf{scope})\ \land \ \operatorname{EvalBlockBodySigma}(b,\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )\ \land \ \operatorname{BlockExit}(\sigma_{2} ,\ \mathsf{scope},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma '')
$$

$$
\operatorname{EvalBlockBindSigma}(p,\ v,\ b,\ \sigma )\ \Downarrow \ (\mathsf{out}',\ \sigma '')\ \Leftrightarrow \ \operatorname{BindPatternVal}(p,\ v)\ \Downarrow \ B\ \land \ \operatorname{BindOrder}(p,\ B)\ =\ \mathsf{binds}\ \land \ \operatorname{BlockEnter}(\sigma ,\ \mathsf{binds})\ \Downarrow \ (\sigma_{1} ,\ \mathsf{scope})\ \land \ \operatorname{EvalBlockBodySigma}(b,\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )\ \land \ \operatorname{BlockExit}(\sigma_{2} ,\ \mathsf{scope},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma '')
$$

$$
\operatorname{EvalInScopeSigma}(b,\ \sigma ,\ \mathsf{scope})\ \Downarrow \ (\mathsf{out},\ \sigma ')\ \Leftrightarrow \ \operatorname{CurrentScopeId}(\sigma )\ =\ \mathsf{scope}\ \land \ \operatorname{EvalBlockBodySigma}(b,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')
$$

**Place Evaluation Helpers.**

**PlaceJudg.**

$$
\mathsf{PlaceJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{ReadPlaceSigma}(p,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma '),\ \Gamma \ \vdash \ \operatorname{WritePlaceSigma}(p,\ v,\ \sigma )\ \Downarrow \ (\mathsf{sout},\ \sigma '),\ \Gamma \ \vdash \ \operatorname{WritePlaceSubSigma}(p,\ v,\ \sigma )\ \Downarrow \ (\mathsf{sout},\ \sigma '),\ \Gamma \ \vdash \ \operatorname{MovePlaceSigma}(p,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\}
$$

**(ExecSeq-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSeqSigma}([],\ \sigma )\ \Downarrow \ (\mathsf{ok},\ \sigma )
\end{array}
$$

**(ExecSeq-Cons-Ok)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ExecSigma}(s,\ \sigma )\ \Downarrow \ (\mathsf{ok},\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{ExecSeqSigma}(\mathsf{ss},\ \sigma_{1} )\ \Downarrow \ (\mathsf{sout},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSeqSigma}(s\mathbin{::} \mathsf{ss},\ \sigma )\ \Downarrow \ (\mathsf{sout},\ \sigma_{2} )
\end{array}
$$

**(ExecSeq-Cons-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ExecSigma}(s,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSeqSigma}(s\mathbin{::} \mathsf{ss},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(ExecSigma-Error)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{ErrorStmt}(\_),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma )
\end{array}
$$

$$
\mathsf{ExecState}\ =\ \{\operatorname{Exec}(s,\ \sigma ),\ \operatorname{ExecSeq}(\mathsf{ss},\ \sigma ),\ \operatorname{ExecCtrl}(\kappa ,\ \sigma ),\ \operatorname{ExecDone}(\sigma ),\ \operatorname{RegionBody}(r,\ \mathsf{scope},\ b,\ \sigma ),\ \operatorname{RegionExit}(r,\ \mathsf{scope},\ \mathsf{out},\ \sigma ),\ \operatorname{FrameBody}(r,\ \mathsf{scope},\ \mathsf{mark},\ b,\ \sigma ),\ \operatorname{FrameExit}(r,\ \mathsf{scope},\ \mathsf{mark},\ \mathsf{out},\ \sigma ),\ \operatorname{KeyBody}(\mathsf{keys},\ b,\ \sigma ),\ \operatorname{KeyExit}(\mathsf{keys},\ \mathsf{out},\ \sigma )\}
$$

**(Step-Exec-Other-Ok)**

$$
\begin{array}{l}
s\ \notin \ \{\operatorname{DeferStmt}(\_),\ \operatorname{RegionStmt}(\_,\ \_,\ \_),\ \operatorname{FrameStmt}(\_,\ \_),\ \operatorname{KeyBlockStmt}(\_,\ \_,\ \_,\ \_,\ \_,\ \_)\}\quad \Gamma \ \vdash \ \operatorname{ExecSigma}(s,\ \sigma )\ \Downarrow \ (\mathsf{ok},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Exec}(s,\ \sigma )\rangle \ \to \ \langle \operatorname{ExecDone}(\sigma ')\rangle 
\end{array}
$$

**(Step-Exec-Other-Ctrl)**

$$
\begin{array}{l}
s\ \notin \ \{\operatorname{DeferStmt}(\_),\ \operatorname{RegionStmt}(\_,\ \_,\ \_),\ \operatorname{FrameStmt}(\_,\ \_),\ \operatorname{KeyBlockStmt}(\_,\ \_,\ \_,\ \_,\ \_,\ \_)\}\quad \Gamma \ \vdash \ \operatorname{ExecSigma}(s,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Exec}(s,\ \sigma )\rangle \ \to \ \langle \operatorname{ExecCtrl}(\kappa ,\ \sigma ')\rangle 
\end{array}
$$

**(Step-ExecSeq-Ok)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ExecSeqSigma}(\mathsf{ss},\ \sigma )\ \Downarrow \ (\mathsf{ok},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{ExecSeq}(\mathsf{ss},\ \sigma )\rangle \ \to \ \langle \operatorname{ExecDone}(\sigma ')\rangle 
\end{array}
$$

**(Step-ExecSeq-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ExecSeqSigma}(\mathsf{ss},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{ExecSeq}(\mathsf{ss},\ \sigma )\rangle \ \to \ \langle \operatorname{ExecCtrl}(\kappa ,\ \sigma ')\rangle 
\end{array}
$$

**(Step-Exec-Defer)**

$$
\begin{array}{l}
\operatorname{AppendCleanup}(\sigma ,\ \operatorname{DeferBlock}(b))\ \Downarrow \ \sigma ' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Exec}(\operatorname{DeferStmt}(b),\ \sigma )\rangle \ \to \ \langle \operatorname{ExecDone}(\sigma ')\rangle 
\end{array}
$$

$$
\texttt{EvalSigma(BlockExpr(stmts, tail\_opt), sigma)}\ \mathsf{is}\ \mathsf{used}\ \mathsf{by}\ \S 16.7.5\ \mathsf{and}\ \mathsf{delegates}\ \mathsf{to}\ \texttt{EvalBlockSigma}.
$$

### 18.1.6 Lowering

$$
\mathsf{LowerStmtJudg}\ =\ \{\mathsf{LowerStmt},\ \mathsf{LowerStmtList},\ \mathsf{LowerBlock},\ \mathsf{LowerLoop}\}
$$

**(Lower-Stmt-Correctness)**

$$
\begin{array}{l}
\forall \ \sigma ,\ \Gamma \ \vdash \ \operatorname{ExecSigma}(s,\ \sigma )\ \Downarrow \ (\mathsf{sout},\ \sigma ')\ \Rightarrow \ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\mathsf{sout},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(s)\ \Downarrow \ \mathsf{IR}
\end{array}
$$

**(Lower-Block-Correctness)**

$$
\begin{array}{l}
\forall \ \sigma ,\ \mathsf{out},\ \sigma '.\ \Gamma \ \vdash \ \operatorname{EvalBlockSigma}(b,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\ \Rightarrow \ (\operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\ \land \ (\mathsf{out}\ =\ \operatorname{Val}(v')\ \Rightarrow \ v\ =\ v')) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerBlock}(b)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle 
\end{array}
$$

$$
\begin{array}{l}
\mathsf{StmtForms0}\ =\ \{\operatorname{LetStmt}(\_),\ \operatorname{VarStmt}(\_),\ \operatorname{UsingLocalStmt}(\_,\ \_,\ \_),\ \operatorname{AssignStmt}(\_,\ \_),\ \operatorname{CompoundAssignStmt}(\_,\ \_,\ \_),\ \operatorname{ExprStmt}(\_),\ \operatorname{DeferStmt}(\_),\ \operatorname{RegionStmt}(\_,\ \_,\ \_),\ \operatorname{FrameStmt}(\_,\ \_),\ \operatorname{ReturnStmt}(\_),\ \operatorname{BreakStmt}(\_),\ \mathsf{ContinueStmt},\ \operatorname{UnsafeBlockStmt}(\_),\ \operatorname{ErrorStmt}(\_)\} \\[0.16em]
\operatorname{LowerStmtTotal}(\Gamma )\ \Leftrightarrow \ \forall \ s.\ s\ \in \ \mathsf{StmtForms0}\ \Rightarrow \ \exists \ \mathsf{IR}.\ \Gamma \ \vdash \ \operatorname{LowerStmt}(s)\ \Downarrow \ \mathsf{IR}
\end{array}
$$

**(Lower-StmtList-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmtList}([])\ \Downarrow \ \varepsilon 
\end{array}
$$

**(Lower-StmtList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerStmt}(s)\ \Downarrow \ \mathsf{IR}_{s}\quad \Gamma \ \vdash \ \operatorname{LowerStmtList}(\mathsf{ss})\ \Downarrow \ \mathsf{IR}_{r} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmtList}(s\mathbin{::} \mathsf{ss})\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{s},\ \mathsf{IR}_{r})
\end{array}
$$

**(Lower-Block-Tail)**

$$
\begin{array}{l}
\mathsf{tail}\ \ne \ \bot \quad \Gamma \ \vdash \ \operatorname{LowerStmtList}(\mathsf{stmts})\ \Downarrow \ \mathsf{IR}_{s}\quad \Gamma \ \vdash \ \operatorname{LowerExpr}(\mathsf{tail})\ \Downarrow \ \langle \mathsf{IR}_{t},\ v_{t}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerBlock}(\operatorname{BlockExpr}(\mathsf{stmts},\ \mathsf{tail}))\ \Downarrow \ \langle \operatorname{BlockIR}(\mathsf{IR}_{s},\ \mathsf{IR}_{t},\ v_{t}),\ v_{\mathsf{block}}\rangle 
\end{array}
$$

**(Lower-Block-Unit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerStmtList}(\mathsf{stmts})\ \Downarrow \ \mathsf{IR}_{s} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerBlock}(\operatorname{BlockExpr}(\mathsf{stmts},\ \bot ))\ \Downarrow \ \langle \operatorname{BlockIR}(\mathsf{IR}_{s},\ \varepsilon ,\ ()),\ v_{\mathsf{block}}\rangle 
\end{array}
$$

**(Lower-Stmt-Error)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{ErrorStmt}(\mathsf{span}))\ \Downarrow \ \operatorname{LowerPanic}(\operatorname{ErrorStmt}(\mathsf{span}))
\end{array}
$$

**Temporary Cleanup in Lowering.**

Let `TempDropOrder(s) = [e_1, …, e_k]`. For each `i`, let

$$
\texttt{Gamma |- LowerExpr(e\_i) => <IR\_i, v\_i>}
$$
denote the unique invocation of `LowerExpr(e_i)` in the derivation of

$$
\texttt{Gamma |- LowerStmt(s) => IR\_s},\ \mathsf{and}\ \mathsf{let}\ \texttt{ExprType(e\_i) = T\_i}.
$$

$$
\begin{array}{l}
\operatorname{TempCleanupIR}(s)\ = \\[0.16em]
\ \{\ \varepsilon \quad \mathsf{if}\ k\ =\ 0 \\[0.16em]
\quad \operatorname{SeqIRList}([\operatorname{EmitDrop}(T_{k},\ v_{k}),\ \ldots ,\ \operatorname{EmitDrop}(T_{1},\ v_{1})])\quad \mathsf{otherwise}\ \}
\end{array}
$$

For `s ∉ {ReturnStmt(_), BreakStmt(_), ContinueStmt}`, the lowering MUST produce

$$
\texttt{Gamma |- LowerStmt(s) => SeqIR(IR\_s, TempCleanupIR(s))}.
$$

For control-flow statements, the lowering MUST emit temporary cleanup immediately before the control transfer:

$$
\begin{array}{l}
\texttt{Gamma |- LowerStmt(ReturnStmt(e)) => SeqIR(IR\_e, TempCleanupIR(s), ReturnIR(v))} \\[0.16em]
\texttt{Gamma |- LowerStmt(BreakStmt(e)) => SeqIR(IR\_e, TempCleanupIR(s), BreakIR(v))} \\[0.16em]
\texttt{Gamma |- LowerStmt(BreakStmt(bottom)) => SeqIR(TempCleanupIR(s), BreakIR(bottom))} \\[0.16em]
\texttt{Gamma |- LowerStmt(ContinueStmt) => SeqIR(TempCleanupIR(s), ContinueIR)}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{BlockForms0}\ =\ \{\operatorname{BlockExpr}(\_,\ \_)\} \\[0.16em]
\mathsf{LoopForms0}\ =\ \{\operatorname{LoopInfinite}(\_,\ \_),\ \operatorname{LoopConditional}(\_,\ \_,\ \_),\ \operatorname{LoopIter}(\_,\ \_,\ \_,\ \_,\ \_)\} \\[0.16em]
\operatorname{LowerBlockTotal}(\Gamma )\ \Leftrightarrow \ \forall \ b.\ b\ \in \ \mathsf{BlockForms0}\ \Rightarrow \ \exists \ \mathsf{IR},\ v.\ \Gamma \ \vdash \ \operatorname{LowerBlock}(b)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle  \\[0.16em]
\operatorname{LowerLoopTotal}(\Gamma )\ \Leftrightarrow \ \forall \ l.\ l\ \in \ \mathsf{LoopForms0}\ \Rightarrow \ \exists \ \mathsf{IR},\ v.\ \Gamma \ \vdash \ \operatorname{LowerLoop}(l)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle 
\end{array}
$$

**(Lower-Loop-Infinite)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerBlock}(\mathsf{body})\ \Downarrow \ \langle \mathsf{IR}_{b},\ v_{b}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerLoop}(\operatorname{LoopInfinite}(\mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}))\ \Downarrow \ \langle \operatorname{LoopIR}(\mathsf{LoopInfinite},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{IR}_{b},\ v_{b}),\ v_{\mathsf{loop}}\rangle 
\end{array}
$$

**(Lower-Loop-Cond)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(\mathsf{cond})\ \Downarrow \ \langle \mathsf{IR}_{c},\ v_{c}\rangle \quad \Gamma \ \vdash \ \operatorname{LowerBlock}(\mathsf{body})\ \Downarrow \ \langle \mathsf{IR}_{b},\ v_{b}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerLoop}(\operatorname{LoopConditional}(\mathsf{cond},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}))\ \Downarrow \ \langle \operatorname{LoopIR}(\mathsf{LoopConditional},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{IR}_{c},\ v_{c},\ \mathsf{IR}_{b},\ v_{b}),\ v_{\mathsf{loop}}\rangle 
\end{array}
$$

**(Lower-Loop-Iter)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(\mathsf{iter})\ \Downarrow \ \langle \mathsf{IR}_{i},\ v_{\mathsf{iter}}\rangle \quad \Gamma \ \vdash \ \operatorname{LowerBlock}(\mathsf{body})\ \Downarrow \ \langle \mathsf{IR}_{b},\ v_{b}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerLoop}(\operatorname{LoopIter}(\mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{iter},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}))\ \Downarrow \ \langle \operatorname{LoopIR}(\mathsf{LoopIter},\ \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{IR}_{i},\ v_{\mathsf{iter}},\ \mathsf{IR}_{b},\ v_{b}),\ v_{\mathsf{loop}}\rangle 
\end{array}
$$

### 18.1.7 Diagnostics

Diagnostics are defined for malformed statements recovered by `Parse-Statement-Err`, missing required statement terminators, and block-expression statement prefixes whose result set has no common type.

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

## 18.3 Local Using Statements

### 18.3.1 Syntax

```text
using_local_stmt ::= "using" identifier "as" identifier terminator
```

### 18.3.2 Parsing

**(Parse-UsingLocal-Stmt)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{using})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{source})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{as})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{alias})\quad s\ =\ \operatorname{UsingLocalStmt}(\mathsf{source},\ \mathsf{alias},\ \operatorname{SpanBetween}(P,\ P_{2})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStmtCore}(P)\ \Downarrow \ (P_{2},\ s)
\end{array}
$$

### 18.3.3 AST Representation / Form

UsingLocalStmt(source, alias, span)

### 18.3.4 Static Semantics

Evaluation of a `UsingLocalStmt` extends the environment via the `UsingAlias` judgment defined in §7.2:

**(T-UsingLocalStmt)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{UsingAlias}(\mathsf{source},\ \mathsf{alias})\ \Downarrow \ \Gamma ' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{UsingLocalStmt}(\mathsf{source},\ \mathsf{alias},\ \_)\ \Rightarrow \ \Gamma '
\end{array}
$$

**(T-UsingLocalStmt-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{UsingAlias}(\mathsf{source},\ \mathsf{alias})\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{UsingLocalStmt}(\mathsf{source},\ \mathsf{alias},\ \_)\ \Uparrow \ c
\end{array}
$$

The alias introduces no new storage; the `Entity` stored under `alias` is the identical `Entity` to which `source` resolves. Aliasing an alias resolves through to the original `Entity`.

### 18.3.5 Dynamic Semantics

**(ExecSigma-UsingLocal)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{UsingLocalStmt}(\_,\ \_,\ \_),\ \sigma )\ \Downarrow \ (\mathsf{ok},\ \sigma )
\end{array}
$$

A `UsingLocalStmt` has no runtime effect: name resolution is compile-time only.

### 18.3.6 Lowering

**(Lower-Stmt-UsingLocal)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{UsingLocalStmt}(\_,\ \_,\ \_))\ \Downarrow \ \mathsf{NoOpIR}
\end{array}
$$

`using` statements produce no runtime IR; they are consumed entirely during resolution.

### 18.3.7 Diagnostics

Diagnostics are defined for duplicate alias names (alias already in any scope), unresolved source names, and use of reserved names as aliases. See §7.2 `Using-Alias-*` rules.

## 18.4 Assignment Statements

### 18.4.1 Syntax

```text
assignment_stmt ::= place_expr "=" expression terminator
compound_assign ::= place_expr compound_op expression terminator
```

### 18.4.2 Parsing

**(Parse-Assign-Stmt)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParsePlace}(P)\ \Downarrow \ (P_{1},\ p)\quad \operatorname{Tok}(P_{1})\ \in \ \{\operatorname{Operator}(\texttt{"="}),\ \operatorname{Operator}(\texttt{"+="}),\ \operatorname{Operator}(\texttt{"-="}),\ \operatorname{Operator}(\texttt{"*="}),\ \operatorname{Operator}(\texttt{"/="}),\ \operatorname{Operator}(\texttt{"\%="})\}\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStmtCore}(P)\ \Downarrow \ (P_{2},\ \operatorname{AssignOrCompound}(P_{1},\ p,\ e))
\end{array}
$$

**(AssignOrCompound-Assign)**

$$
\begin{array}{l}
\operatorname{Tok}(P_{1})\ =\ \operatorname{Operator}(\texttt{"="}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AssignOrCompound}(P_{1},\ p,\ e)\ \Downarrow \ \operatorname{AssignStmt}(p,\ e)
\end{array}
$$

**(AssignOrCompound-Compound)**

$$
\begin{array}{l}
\operatorname{Tok}(P_{1})\ =\ \operatorname{Operator}(\mathsf{op})\quad \mathsf{op}\ \in \ \{\texttt{"+="},\ \texttt{"-="},\ \texttt{"*="},\ \texttt{"/="},\ \texttt{"\%="}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AssignOrCompound}(P_{1},\ p,\ e)\ \Downarrow \ \operatorname{CompoundAssignStmt}(p,\ \mathsf{op},\ e)
\end{array}
$$

### 18.4.3 AST Representation / Form

AssignStmt(place, expr)
CompoundAssignStmt(place, op, expr)

$$
\begin{array}{l}
\operatorname{PlaceRoot}(\operatorname{Identifier}(x))\ =\ x \\[0.16em]
\operatorname{PlaceRoot}(\operatorname{FieldAccess}(p,\ \_))\ =\ \operatorname{PlaceRoot}(p) \\[0.16em]
\operatorname{PlaceRoot}(\operatorname{TupleAccess}(p,\ \_))\ =\ \operatorname{PlaceRoot}(p) \\[0.16em]
\operatorname{PlaceRoot}(\operatorname{IndexAccess}(p,\ \_))\ =\ \operatorname{PlaceRoot}(p) \\[0.16em]
\operatorname{PlaceRoot}(\operatorname{Deref}(p))\ =\ \operatorname{PlaceRoot}(p)
\end{array}
$$

### 18.4.4 Static Semantics

**(T-Assign)**

$$
\begin{array}{l}
\operatorname{IsPlace}(p)\quad \operatorname{PlaceRoot}(p)\ =\ x\quad \operatorname{MutOf}(\Gamma ,\ x)\ =\ \texttt{var}\quad \Gamma ;\ R;\ L\ \vdash \ p\ :\mathsf{place}\ T_{p}\quad \Gamma ;\ R;\ L\ \vdash \ e\ \Leftarrow \ T_{p}\ \dashv \ \emptyset  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{AssignStmt}(p,\ e)\ \Rightarrow \ \Gamma \ \triangleright \ \langle [],\ [],\ \mathsf{false}\rangle 
\end{array}
$$

**(T-CompoundAssign)**

$$
\begin{array}{l}
\operatorname{IsPlace}(p)\quad \operatorname{PlaceRoot}(p)\ =\ x\quad \operatorname{MutOf}(\Gamma ,\ x)\ =\ \texttt{var}\quad \Gamma ;\ R;\ L\ \vdash \ p\ :\mathsf{place}\ T_{p}\quad \operatorname{StripPerm}(T_{p})\ =\ \operatorname{TypePrim}(t)\quad t\ \in \ \mathsf{NumericTypes}\quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ T_{e}\quad \Gamma \ \vdash \ T_{e}\ \mathrel{<:} \ \operatorname{TypePrim}(t) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{CompoundAssignStmt}(p,\ \mathsf{op},\ e)\ \Rightarrow \ \Gamma \ \triangleright \ \langle [],\ [],\ \mathsf{false}\rangle 
\end{array}
$$

**(Assign-NotPlace)**

$$
\begin{array}{l}
\mathsf{stmt}\ \in \ \{\operatorname{AssignStmt}(p,\ e),\ \operatorname{CompoundAssignStmt}(p,\ \mathsf{op},\ e)\}\quad \lnot \ \operatorname{IsPlace}(p)\quad c\ =\ \operatorname{Code}(\mathsf{Assign}-\mathsf{NotPlace}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \mathsf{stmt}\ \Uparrow \ c
\end{array}
$$

**(Assign-Immutable-Err)**

$$
\begin{array}{l}
\mathsf{stmt}\ \in \ \{\operatorname{AssignStmt}(p,\ e),\ \operatorname{CompoundAssignStmt}(p,\ \mathsf{op},\ e)\}\quad \operatorname{IsPlace}(p)\quad \operatorname{PlaceRoot}(p)\ =\ x\quad \operatorname{MutOf}(\Gamma ,\ x)\ =\ \texttt{let}\quad c\ =\ \operatorname{Code}(\mathsf{Assign}-\mathsf{Immutable}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \mathsf{stmt}\ \Uparrow \ c
\end{array}
$$

**(Assign-Type-Err)**

$$
\begin{array}{l}
\mathsf{stmt}\ \in \ \{\operatorname{AssignStmt}(p,\ e),\ \operatorname{CompoundAssignStmt}(p,\ \mathsf{op},\ e)\}\quad \operatorname{IsPlace}(p)\quad \Gamma ;\ R;\ L\ \vdash \ p\ :\mathsf{place}\ T_{p}\quad \Gamma ;\ R;\ L\ \vdash \ e\ \Rightarrow \ T_{e}\ \dashv \ C\quad ((\mathsf{stmt}\ =\ \operatorname{AssignStmt}(p,\ e)\ \land \ \lnot (\Gamma \ \vdash \ T_{e}\ \mathrel{<:} \ T_{p}))\ \lor \ (\mathsf{stmt}\ =\ \operatorname{CompoundAssignStmt}(p,\ \mathsf{op},\ e)\ \land \ (\lnot (\Gamma \ \vdash \ T_{e}\ \mathrel{<:} \ \operatorname{StripPerm}(T_{p}))\ \lor \ \lnot \ \exists \ t.\ \operatorname{StripPerm}(T_{p})\ =\ \operatorname{TypePrim}(t)\ \land \ t\ \in \ \mathsf{NumericTypes})))\quad c\ =\ \operatorname{Code}(\mathsf{Assign}-\mathsf{Type}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \mathsf{stmt}\ \Uparrow \ c
\end{array}
$$

**(Assign-Const-Err)**

$$
\begin{array}{l}
\mathsf{stmt}\ \in \ \{\operatorname{AssignStmt}(p,\ e),\ \operatorname{CompoundAssignStmt}(p,\ \mathsf{op},\ e)\}\quad \Gamma ;\ R;\ L\ \vdash \ p\ :\ \operatorname{TypePerm}(\texttt{const},\ T)\quad c\ =\ \operatorname{Code}(\mathsf{Assign}-\mathsf{Const}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \mathsf{stmt}\ \Uparrow \ c
\end{array}
$$

**(B-Assign-Immutable-Err)**, **(B-Assign)**, and **(B-Assign-Const-Err)** define binding-state effects of assignment.

**(Prov-Assign)** and **(Prov-CompoundAssign)** require the assigned provenance not to escape into a shorter-lived target.

**(Prov-Async-Escape-Err)** and **(Prov-Escape-Err)** define the two escape failures.

### 18.4.5 Dynamic Semantics

$$
\begin{array}{l}
\operatorname{RootBinding}(\mathsf{Sigma},\ p)\ = \\[0.16em]
\ \operatorname{Local}(b)\quad \mathsf{if}\ \operatorname{LookupBind}(\mathsf{Sigma},\ \operatorname{PlaceRoot}(p))\ =\ b
\end{array}
$$
 Static(path, name)    if LookupBind(Sigma, PlaceRoot(p)) undefined ∧ Γ ⊢ ResolveValueName(PlaceRoot(p)) ⇓ ent ∧ ent.origin_opt = mp ∧ name = (ent.target_opt if present, else PlaceRoot(p)) ∧ path = PathOfModule(mp)

$$
\begin{array}{l}
\operatorname{DropOnAssign}(b)\ \Leftrightarrow \ \operatorname{BindInfo}(b).\mathsf{mov}\ =\ \mathsf{immov}\ \land \ \operatorname{BindInfo}(b).\mathsf{resp}\ =\ \mathsf{resp} \\[0.16em]
\operatorname{DropOnAssignStatic}(\mathsf{path},\ \mathsf{name})\ \Leftrightarrow \ \operatorname{StaticBindInfo}(\mathsf{path},\ \mathsf{name}).\mathsf{mov}\ =\ \mathsf{immov}\ \land \ \operatorname{StaticBindInfo}(\mathsf{path},\ \mathsf{name}).\mathsf{resp}\ =\ \mathsf{resp}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{DropOnAssignRoot}(\mathsf{Sigma},\ p)\ \Leftrightarrow \ (\operatorname{RootBinding}(\mathsf{Sigma},\ p)\ =\ \operatorname{Local}(b)\ \land \ \operatorname{DropOnAssign}(b))\ \lor \ (\operatorname{RootBinding}(\mathsf{Sigma},\ p)\ =\ \operatorname{Static}(\mathsf{path},\ \mathsf{name})\ \land \ \operatorname{DropOnAssignStatic}(\mathsf{path},\ \mathsf{name})) \\[0.16em]
\operatorname{RootMoved}(\mathsf{Sigma},\ p)\ \Leftrightarrow \ \operatorname{RootBinding}(\mathsf{Sigma},\ p)\ =\ \operatorname{Local}(b)\ \land \ \operatorname{BindState}(\mathsf{Sigma},\ b)\ =\ \mathsf{Moved}
\end{array}
$$

$$
\mathsf{DropSubvalueJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{DropSubvalue}(p,\ T,\ v,\ \sigma )\ \Downarrow \ \sigma '\}
$$

**(DropSubvalue-Do)**

$$
\begin{array}{l}
\operatorname{DropOnAssignRoot}(\mathsf{Sigma},\ p)\quad \lnot \ \operatorname{RootMoved}(\mathsf{Sigma},\ p)\quad \Gamma \ \vdash \ \operatorname{DropValue}(T,\ v,\ \emptyset )\ \Downarrow \ \mathsf{Sigma}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DropSubvalue}(p,\ T,\ v,\ \mathsf{Sigma})\ \Downarrow \ \mathsf{Sigma}'
\end{array}
$$

**(DropSubvalue-Skip)**

$$
\begin{array}{l}
\lnot \ \operatorname{DropOnAssignRoot}(\mathsf{Sigma},\ p)\ \lor \ \operatorname{RootMoved}(\mathsf{Sigma},\ p) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DropSubvalue}(p,\ T,\ v,\ \mathsf{Sigma})\ \Downarrow \ \mathsf{Sigma}
\end{array}
$$

**(ExecSigma-Assign)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{WritePlaceSigma}(p,\ v,\ \sigma_{1} )\ \Downarrow \ (\mathsf{sout},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{AssignStmt}(p,\ e),\ \sigma )\ \Downarrow \ (\mathsf{sout},\ \sigma_{2} )
\end{array}
$$

**(ExecSigma-Assign-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{AssignStmt}(p,\ e),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(ExecSigma-CompoundAssign)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ReadPlaceSigma}(p,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{p}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(v_{e}),\ \sigma_{2} )\quad \operatorname{BinOp}(\mathsf{op},\ v_{p},\ v_{e})\ \Downarrow \ v\quad \Gamma \ \vdash \ \operatorname{WritePlaceSigma}(p,\ v,\ \sigma_{2} )\ \Downarrow \ (\mathsf{sout},\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{CompoundAssignStmt}(p,\ \mathsf{op},\ e),\ \sigma )\ \Downarrow \ (\mathsf{sout},\ \sigma_{3} )
\end{array}
$$

**(ExecSigma-CompoundAssign-Left-Ctrl)** and **(ExecSigma-CompoundAssign-Right-Ctrl)** define control propagation from the left-hand place read and the right-hand expression.

### 18.4.6 Lowering

**(Lower-Stmt-Assign)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(\mathsf{expr})\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle \quad \Gamma \ \vdash \ \operatorname{LowerWritePlace}(\mathsf{place},\ v)\ \Downarrow \ \mathsf{IR}_{w} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{AssignStmt}(\mathsf{place},\ \mathsf{expr}))\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{e},\ \mathsf{IR}_{w})
\end{array}
$$

**(Lower-Stmt-CompoundAssign)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerReadPlace}(\mathsf{place})\ \Downarrow \ \langle \mathsf{IR}_{p},\ v_{p}\rangle \quad \Gamma \ \vdash \ \operatorname{LowerExpr}(\mathsf{expr})\ \Downarrow \ \langle \mathsf{IR}_{e},\ v_{e}\rangle \quad \operatorname{BinOp}(\mathsf{op},\ v_{p},\ v_{e})\ \Downarrow \ v\quad \Gamma \ \vdash \ \operatorname{LowerWritePlace}(\mathsf{place},\ v)\ \Downarrow \ \mathsf{IR}_{w} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{CompoundAssignStmt}(\mathsf{place},\ \mathsf{op},\ \mathsf{expr}))\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{p},\ \mathsf{IR}_{e},\ \mathsf{IR}_{w})
\end{array}
$$

### 18.4.7 Diagnostics

Diagnostics are defined for non-place assignment targets, assignment to immutable bindings, assignment through `const`, assignment type mismatch, and provenance escapes in assignment.

## 18.5 Expression Statements

### 18.5.1 Syntax

```text
expr_stmt ::= expression terminator
```

### 18.5.2 Parsing

**(Parse-Expr-Stmt)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseExpr}(P)\ \Downarrow \ (P_{1},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStmtCore}(P)\ \Downarrow \ (P_{1},\ \operatorname{ExprStmt}(e))
\end{array}
$$

### 18.5.3 AST Representation / Form

ExprStmt(expr)

### 18.5.4 Static Semantics

**(T-ExprStmt)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{ExprStmt}(e)\ \Rightarrow \ \Gamma \ \triangleright \ \langle [],\ [],\ \mathsf{false}\rangle 
\end{array}
$$

**(B-ExprStmt)** and **(Prov-ExprStmt)** define binding-state and provenance preservation for expression statements.

### 18.5.5 Dynamic Semantics

**(ExecSigma-ExprStmt)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{ExprStmt}(e),\ \sigma )\ \Downarrow \ (\operatorname{StmtOutOf}(\mathsf{out}),\ \sigma_{1} )
\end{array}
$$

### 18.5.6 Lowering

**(Lower-Stmt-Expr)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(\mathsf{expr})\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{ExprStmt}(\mathsf{expr}))\ \Downarrow \ \mathsf{IR}_{e}
\end{array}
$$

### 18.5.7 Diagnostics

No additional named diagnostics are introduced for expression statements beyond the diagnostics of the contained expression and the required terminator diagnostics of §18.1.7.

## 18.6 Defer

### 18.6.1 Syntax

```text
defer_stmt ::= "defer" block_expr
```

### 18.6.2 Parsing

**(Parse-Defer-Stmt)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{defer})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ b) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStmtCore}(P)\ \Downarrow \ (P_{1},\ \operatorname{DeferStmt}(b))
\end{array}
$$

### 18.6.3 AST Representation / Form

DeferStmt(block)

### 18.6.4 Static Semantics

**(T-DeferStmt)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ b\ \Leftarrow \ \operatorname{TypePrim}(\texttt{"()"})\ \dashv \ \emptyset \quad \operatorname{DeferSafe}(b) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{DeferStmt}(b)\ \Rightarrow \ \Gamma \ \triangleright \ \langle [],\ [],\ \mathsf{false}\rangle 
\end{array}
$$

**(Defer-NonUnit-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ b\ :\ T_{b}\quad T_{b}\ \ne \ \operatorname{TypePrim}(\texttt{"()"})\quad c\ =\ \operatorname{Code}(\mathsf{Defer}-\mathsf{NonUnit}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{DeferStmt}(b)\ \Uparrow \ c
\end{array}
$$

**(Defer-NonLocal-Err)**

$$
\begin{array}{l}
\lnot \ \operatorname{DeferSafe}(b)\quad c\ =\ \operatorname{Code}(\mathsf{Defer}-\mathsf{NonLocal}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{DeferStmt}(b)\ \Uparrow \ c
\end{array}
$$

**(HasNonLocalCtrl-Return)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{HasNonLocalCtrl}(\operatorname{ReturnStmt}(\_),\ \mathsf{in}_{\mathsf{loop}})
\end{array}
$$

**(HasNonLocalCtrl-Break)**

$$
\begin{array}{l}
\mathsf{in}_{\mathsf{loop}}\ =\ \mathsf{false} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{HasNonLocalCtrl}(\operatorname{BreakStmt}(\_),\ \mathsf{in}_{\mathsf{loop}})
\end{array}
$$

**(HasNonLocalCtrl-Continue)**

$$
\begin{array}{l}
\mathsf{in}_{\mathsf{loop}}\ =\ \mathsf{false} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{HasNonLocalCtrl}(\mathsf{ContinueStmt},\ \mathsf{in}_{\mathsf{loop}})
\end{array}
$$

**(HasNonLocalCtrl-LoopInfinite)**, **(HasNonLocalCtrl-LoopConditional)**, **(HasNonLocalCtrl-LoopIter)**, and **(HasNonLocalCtrl-Child)** propagate non-local control-flow detection through nested expressions and statements.

$$
\operatorname{DeferSafe}(b)\ \Leftrightarrow \ \lnot \ \operatorname{HasNonLocalCtrl}(b,\ \mathsf{false})
$$

**(B-Defer)** and **(Prov-DeferStmt)** require a deferred block to preserve the current binding-state and provenance environment.

### 18.6.5 Dynamic Semantics

**(ExecSigma-Defer)**

$$
\begin{array}{l}
\operatorname{AppendCleanup}(\sigma ,\ \operatorname{DeferBlock}(b))\ \Downarrow \ \sigma ' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{DeferStmt}(b),\ \sigma )\ \Downarrow \ (\mathsf{ok},\ \sigma ')
\end{array}
$$

**(Cleanup-Step-Defer-Ok)**, **(Cleanup-Step-Defer-Panic)**, and **(Cleanup-Step-Defer-Abort)** define execution of deferred blocks during scope exit.

**(Cleanup-Cons-Defer-Ok)** and **(Cleanup-Cons-Defer-Panic)** define the big-step cleanup view of deferred blocks.

### 18.6.6 Lowering

**(Lower-Stmt-Defer)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{DeferStmt}(\mathsf{block}))\ \Downarrow \ \operatorname{DeferIR}(\mathsf{block})
\end{array}
$$

### 18.6.7 Diagnostics

Diagnostics are defined for defer blocks with non-unit type and for defer blocks that contain non-local control flow.

## 18.7 Region

### 18.7.1 Syntax

```text
region_stmt  ::= "region" region_opts? region_alias? block_expr
region_opts  ::= "(" expression ")"
region_alias ::= "as" identifier
```

### 18.7.2 Parsing

**(Parse-Region-Opts-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRegionOptsOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-Region-Opts-Some)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e)\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{")"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRegionOptsOpt}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ e)
\end{array}
$$

**(Parse-Region-Alias-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{as}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRegionAliasOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-Region-Alias-Some)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{as})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{name}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRegionAliasOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{name})
\end{array}
$$

**(Parse-Region-Stmt)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{region})\quad \Gamma \ \vdash \ \operatorname{ParseRegionOptsOpt}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{opts}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseRegionAliasOpt}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{alias}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(P_{2})\ \Downarrow \ (P_{3},\ b) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStmtCore}(P)\ \Downarrow \ (P_{3},\ \operatorname{RegionStmt}(\mathsf{opts}_{\mathsf{opt}},\ \mathsf{alias}_{\mathsf{opt}},\ b))
\end{array}
$$

### 18.7.3 AST Representation / Form

RegionStmt(opts_opt, alias_opt, block)

$$
\begin{array}{l}
\operatorname{RegionActiveType}(T)\ \Leftrightarrow \ \operatorname{StripPerm}(T)\ =\ \operatorname{TypeModalState}([\texttt{Region}],\ \texttt{Active}) \\[0.16em]
\operatorname{FreshRegion}(\Gamma )\ \in \ \mathsf{Name}\ \setminus \ \operatorname{dom}(\Gamma )
\end{array}
$$

$$
\begin{array}{l}
\operatorname{RegionOptsExpr}(\bot )\ =\ \operatorname{Call}(\operatorname{Identifier}(\texttt{RegionOptions}),\ []) \\[0.16em]
\operatorname{RegionOptsExpr}(e)\ =\ e\quad \mathsf{if}\ e\ \ne \ \bot 
\end{array}
$$

### 18.7.4 Static Semantics

$$
\begin{array}{l}
\operatorname{RegionBind}(\Gamma ,\ \mathsf{alias}_{\mathsf{opt}})\ =\ \Gamma_{r} \ \Leftrightarrow \ r\ = \\[0.16em]
\ \{\ \mathsf{alias}_{\mathsf{opt}}\quad \mathsf{if}\ \mathsf{alias}_{\mathsf{opt}}\ \ne \ \bot  \\[0.16em]
\quad \operatorname{FreshRegion}(\Gamma )\quad \mathsf{otherwise}\ \}\ \land \ \operatorname{IntroAll}(\Gamma ,\ [\langle r,\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}([\texttt{Region}],\ \texttt{Active}))\rangle ])\ \Downarrow \ \Gamma_{r} 
\end{array}
$$

**(T-RegionStmt)**

$$
\begin{array}{l}
\operatorname{RegionOptsExpr}(\mathsf{opts}_{\mathsf{opt}})\ =\ \mathsf{opts}\quad \Gamma ;\ R;\ L\ \vdash \ \mathsf{opts}\ \Leftarrow \ \operatorname{TypePath}([\texttt{RegionOptions}])\ \dashv \ \emptyset \quad \operatorname{RegionBind}(\Gamma ,\ \mathsf{alias}_{\mathsf{opt}})\ =\ \Gamma_{r} \quad \Gamma_{r} ;\ R;\ L\ \vdash \ b\ :\ T_{b} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{RegionStmt}(\mathsf{opts}_{\mathsf{opt}},\ \mathsf{alias}_{\mathsf{opt}},\ b)\ \Rightarrow \ \Gamma \ \triangleright \ \langle [],\ [],\ \mathsf{false}\rangle 
\end{array}
$$

If alias_opt = ⊥, the identifier produced for the region binding MUST be treated as synthetic. It MUST NOT be introduced by name resolution and MUST NOT be referenced by user code.

**(B-RegionStmt)** introduces the region binding into a fresh local scope and pushes the corresponding permission scope.

**(Prov-RegionStmt)** introduces the region provenance tag and pushes `⟨r, r⟩` onto the runtime region stack relation.

### 18.7.5 Dynamic Semantics

$$
\begin{array}{l}
\operatorname{BindRegionAlias}(\sigma ,\ \bot ,\ r)\ \Downarrow \ \sigma  \\[0.16em]
\operatorname{BindRegionAlias}(\sigma ,\ x,\ r)\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{BindVal}(\sigma ,\ x,\ \operatorname{RegionValue}(\texttt{@Active},\ r))\ \Downarrow \ (\sigma ',\ b)
\end{array}
$$

**(ExecSigma-Region)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{opts},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{o}),\ \sigma_{1} )\quad \operatorname{RegionNew}(\sigma_{1} ,\ v_{o})\ \Downarrow \ (\sigma_{2} ,\ r,\ \mathsf{scope})\quad \operatorname{BindRegionAlias}(\sigma_{2} ,\ \mathsf{alias}_{\mathsf{opt}},\ r)\ \Downarrow \ \sigma_{3} \quad \Gamma \ \vdash \ \operatorname{EvalInScopeSigma}(b,\ \sigma_{3} ,\ \mathsf{scope})\ \Downarrow \ (\mathsf{out},\ \sigma_{4} )\quad \operatorname{RegionRelease}(\sigma_{4} ,\ r,\ \mathsf{scope},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma_{5} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{RegionStmt}(\mathsf{opts}_{\mathsf{opt}},\ \mathsf{alias}_{\mathsf{opt}},\ b),\ \sigma )\ \Downarrow \ (\operatorname{StmtOutOf}(\mathsf{out}'),\ \sigma_{5} )
\end{array}
$$

**(ExecSigma-Region-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{opts},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{RegionStmt}(\mathsf{opts}_{\mathsf{opt}},\ \mathsf{alias}_{\mathsf{opt}},\ b),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

$$
\operatorname{RegionRelease}(\Sigma ,\ r,\ \mathsf{scope},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \Sigma ')\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{CleanupScope}(\mathsf{scope},\ \Sigma )\ \Downarrow \ (c,\ \Sigma_{1} )\ \land \ \mathsf{out}'\ =\ \operatorname{ExitOutcome}(\mathsf{out},\ c)\ \land \ ((\mathsf{out}'\ =\ \operatorname{Ctrl}(\mathsf{Abort})\ \land \ \Sigma '\ =\ \Sigma_{1} )\ \lor \ (\mathsf{out}'\ \ne \ \operatorname{Ctrl}(\mathsf{Abort})\ \land \ \operatorname{ReleaseArena}(\Sigma_{1} ,\ r)\ \Downarrow \ \Sigma_{2} \ \land \ \mathsf{PopScope}\_\sigma (\Sigma_{2} )\ \Downarrow \ (\Sigma ',\ \mathsf{scope})))
$$

**(Step-Exec-Region-Enter)**

$$
\begin{array}{l}
\mathsf{opts}\ =\ \operatorname{RegionOptsExpr}(\mathsf{opts}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{opts},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{o}),\ \sigma_{1} )\quad \operatorname{RegionNew}(\sigma_{1} ,\ v_{o})\ \Downarrow \ (\sigma_{2} ,\ r,\ \mathsf{scope})\quad \operatorname{BindRegionAlias}(\sigma_{2} ,\ \mathsf{alias}_{\mathsf{opt}},\ r)\ \Downarrow \ \sigma_{3}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Exec}(\operatorname{RegionStmt}(\mathsf{opts}_{\mathsf{opt}},\ \mathsf{alias}_{\mathsf{opt}},\ b),\ \sigma )\rangle \ \to \ \langle \operatorname{RegionBody}(r,\ \mathsf{scope},\ b,\ \sigma_{3} )\rangle 
\end{array}
$$

**(Step-Exec-Region-Enter-Ctrl)**

$$
\begin{array}{l}
\mathsf{opts}\ =\ \operatorname{RegionOptsExpr}(\mathsf{opts}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{opts},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Exec}(\operatorname{RegionStmt}(\mathsf{opts}_{\mathsf{opt}},\ \mathsf{alias}_{\mathsf{opt}},\ b),\ \sigma )\rangle \ \to \ \langle \operatorname{ExecCtrl}(\kappa ,\ \sigma_{1} )\rangle 
\end{array}
$$

**(Step-Exec-Region-Body)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalInScopeSigma}(b,\ \sigma ,\ \mathsf{scope})\ \Downarrow \ (\mathsf{out},\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{RegionBody}(r,\ \mathsf{scope},\ b,\ \sigma )\rangle \ \to \ \langle \operatorname{RegionExit}(r,\ \mathsf{scope},\ \mathsf{out},\ \sigma_{1} )\rangle 
\end{array}
$$

**(Step-Exec-Region-Exit-Ok)**

$$
\begin{array}{l}
\operatorname{RegionRelease}(\sigma ,\ r,\ \mathsf{scope},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma ')\quad \operatorname{StmtOutOf}(\mathsf{out}')\ =\ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{RegionExit}(r,\ \mathsf{scope},\ \mathsf{out},\ \sigma )\rangle \ \to \ \langle \operatorname{ExecDone}(\sigma ')\rangle 
\end{array}
$$

**(Step-Exec-Region-Exit-Ctrl)**

$$
\begin{array}{l}
\operatorname{RegionRelease}(\sigma ,\ r,\ \mathsf{scope},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma ')\quad \operatorname{StmtOutOf}(\mathsf{out}')\ =\ \operatorname{Ctrl}(\kappa ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{RegionExit}(r,\ \mathsf{scope},\ \mathsf{out},\ \sigma )\rangle \ \to \ \langle \operatorname{ExecCtrl}(\kappa ,\ \sigma ')\rangle 
\end{array}
$$

### 18.7.6 Lowering

**(Lower-Stmt-Region)**

$$
\begin{array}{l}
\mathsf{opts}\ =\ \operatorname{RegionOptsExpr}(\mathsf{opts}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{LowerExpr}(\mathsf{opts})\ \Downarrow \ \langle \mathsf{IR}_{o},\ v_{o}\rangle \quad \Gamma \ \vdash \ \operatorname{LowerBlock}(\mathsf{block})\ \Downarrow \ \langle \mathsf{IR}_{b},\ v_{b}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{RegionStmt}(\mathsf{opts}_{\mathsf{opt}},\ \mathsf{alias}_{\mathsf{opt}},\ \mathsf{block}))\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{o},\ \operatorname{RegionIR}(v_{o},\ \mathsf{alias}_{\mathsf{opt}},\ \mathsf{IR}_{b},\ v_{b}))
\end{array}
$$

### 18.7.7 Diagnostics

No additional named diagnostics are introduced specifically for `region` statements beyond the diagnostics of the options expression, the enclosed block, and the region operations they trigger.

## 18.8 Frame

### 18.8.1 Syntax

```text
frame_stmt ::= "frame" block_expr | identifier "." "frame" block_expr
```

### 18.8.2 Parsing

**(Parse-Frame-Stmt)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{frame})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ b) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStmtCore}(P)\ \Downarrow \ (P_{1},\ \operatorname{FrameStmt}(\bot ,\ b))
\end{array}
$$

**(Parse-Frame-Explicit)**

$$
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"."})\quad \operatorname{IsKw}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))),\ \texttt{frame})\quad \mathsf{name}\ =\ \operatorname{Lexeme}(\operatorname{Tok}(P))\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P))))\ \Downarrow \ (P_{1},\ b) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStmtCore}(P)\ \Downarrow \ (P_{1},\ \operatorname{FrameStmt}(\mathsf{name},\ b))
\end{array}
$$

### 18.8.3 AST Representation / Form

FrameStmt(target_opt, block)

$$
\begin{array}{l}
\operatorname{InnermostActiveRegion}([])\ =\ \bot  \\[0.16em]
\operatorname{InnermostActiveRegion}([\sigma ]\ \mathbin{++} \ \Gamma ')\ = \\[0.16em]
\ \{\ r\quad \mathsf{if}\ \exists \ r.\ r\ \in \ \operatorname{dom}(\sigma )\ \land \ \operatorname{RegionActiveType}(\sigma [r]) \\[0.16em]
\quad \operatorname{InnermostActiveRegion}(\Gamma ')\ \mathsf{otherwise}\ \}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{FrameBind}(\Gamma ,\ \mathsf{target}_{\mathsf{opt}})\ =\ \Gamma_{f} \ \Leftrightarrow \ r\ = \\[0.16em]
\ \{\ \operatorname{InnermostActiveRegion}(\Gamma )\quad \mathsf{if}\ \mathsf{target}_{\mathsf{opt}}\ =\ \bot  \\[0.16em]
\quad \mathsf{target}_{\mathsf{opt}}\quad \mathsf{if}\ \mathsf{target}_{\mathsf{opt}}\ \ne \ \bot \ \land \ \Gamma ;\ R;\ L\ \vdash \ \operatorname{Identifier}(\mathsf{target}_{\mathsf{opt}})\ :\ T_{r}\ \land \ \operatorname{RegionActiveType}(T_{r})\ \}\ \land \ F\ =\ \operatorname{FreshRegion}(\Gamma )\ \land \ \operatorname{IntroAll}(\Gamma ,\ [\langle F,\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}([\texttt{Region}],\ \texttt{Active}))\rangle ])\ \Downarrow \ \Gamma_{f} 
\end{array}
$$

### 18.8.4 Static Semantics

**(T-FrameStmt-Implicit)**

$$
\begin{array}{l}
\operatorname{FrameBind}(\Gamma ,\ \bot )\ =\ \Gamma_{f} \quad \Gamma_{f} ;\ R;\ L\ \vdash \ b\ :\ T_{b} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{FrameStmt}(\bot ,\ b)\ \Rightarrow \ \Gamma \ \triangleright \ \langle [],\ [],\ \mathsf{false}\rangle 
\end{array}
$$

**(T-FrameStmt-Explicit)**

$$
\begin{array}{l}
\operatorname{FrameBind}(\Gamma ,\ r)\ =\ \Gamma_{f} \quad \Gamma_{f} ;\ R;\ L\ \vdash \ b\ :\ T_{b} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{FrameStmt}(r,\ b)\ \Rightarrow \ \Gamma \ \triangleright \ \langle [],\ [],\ \mathsf{false}\rangle 
\end{array}
$$

**(Frame-NoActiveRegion-Err)**

$$
\begin{array}{l}
\operatorname{InnermostActiveRegion}(\Gamma )\ \mathsf{undefined}\quad c\ =\ \operatorname{Code}(\mathsf{Frame}-\mathsf{NoActiveRegion}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{FrameStmt}(\bot ,\ b)\ \Uparrow \ c
\end{array}
$$

**(Frame-Target-NotActive-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Identifier}(r)\ :\ T_{r}\quad \lnot \ \operatorname{RegionActiveType}(T_{r})\quad c\ =\ \operatorname{Code}(\mathsf{Frame}-\mathsf{Target}-\mathsf{NotActive}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{FrameStmt}(r,\ b)\ \Uparrow \ c
\end{array}
$$

FrameBind introduces a fresh synthetic region identifier `F` with the same synthetic-binding restriction as the anonymous `region` binding. `F` is used only for provenance assignment.

**(B-FrameStmt)** pushes a fresh scope, introduces `FrameBindInfo(Γ)`, and evaluates the body in that scope.

**(Prov-FrameStmt)** pushes `⟨F, r⟩` on the runtime region stack relation, where `r` is the resolved target.

### 18.8.5 Dynamic Semantics

$$
\begin{array}{l}
\operatorname{ActiveTarget}(\sigma )\ =\ \mathsf{target}\ \Leftrightarrow \ \operatorname{ActiveEntry}(\sigma )\ =\ e\ \land \ \operatorname{RegionTargetOf}(e)\ =\ \mathsf{target} \\[0.16em]
\operatorname{ResolveTarget}(\sigma ,\ r)\ =\ \mathsf{target}\ \Leftrightarrow \ \operatorname{ResolveEntry}(\operatorname{RegionStack}(\sigma ),\ r)\ =\ e\ \land \ \operatorname{RegionTargetOf}(e)\ =\ \mathsf{target}
\end{array}
$$

$$
\operatorname{FrameEnter}(\sigma ,\ r)\ \Downarrow \ (\sigma ',\ F,\ \mathsf{scope},\ \mathsf{mark})\ \Leftrightarrow \ \mathsf{PushScope}\_\sigma (\sigma )\ \Downarrow \ (\sigma_{1} ,\ \mathsf{scope})\ \land \ F\ =\ \operatorname{FreshTag}(\sigma )\ \land \ \mathsf{mark}\ =\ \operatorname{FrameMark}(\sigma_{1} ,\ r)\ \land \ \operatorname{UpdateRegionStack}(\sigma_{1} ,\ \langle F,\ r,\ \mathsf{scope},\ \mathsf{mark}\rangle \ \mathbin{::} \ \operatorname{RegionStack}(\sigma_{1} ))\ =\ \sigma '
$$

**(ExecSigma-Frame-Implicit)**

$$
\begin{array}{l}
\operatorname{ActiveTarget}(\sigma )\ =\ r\quad \operatorname{FrameEnter}(\sigma ,\ r)\ \Downarrow \ (\sigma_{1} ,\ F,\ \mathsf{scope},\ \mathsf{mark})\quad \Gamma \ \vdash \ \operatorname{EvalInScopeSigma}(b,\ \sigma_{1} ,\ \mathsf{scope})\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )\quad \operatorname{FrameReset}(\sigma_{2} ,\ r,\ \mathsf{scope},\ \mathsf{mark},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{FrameStmt}(\bot ,\ b),\ \sigma )\ \Downarrow \ (\operatorname{StmtOutOf}(\mathsf{out}'),\ \sigma_{3} )
\end{array}
$$

**(ExecSigma-Frame-Explicit)**

$$
\begin{array}{l}
\operatorname{LookupVal}(\sigma ,\ r)\ =\ v_{r}\quad \operatorname{RegionHandleOf}(v_{r})\ =\ h\quad \operatorname{ResolveTarget}(\sigma ,\ h)\ =\ r_{t}\quad \operatorname{FrameEnter}(\sigma ,\ r_{t})\ \Downarrow \ (\sigma_{1} ,\ F,\ \mathsf{scope},\ \mathsf{mark})\quad \Gamma \ \vdash \ \operatorname{EvalInScopeSigma}(b,\ \sigma_{1} ,\ \mathsf{scope})\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )\quad \operatorname{FrameReset}(\sigma_{2} ,\ r_{t},\ \mathsf{scope},\ \mathsf{mark},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{FrameStmt}(r,\ b),\ \sigma )\ \Downarrow \ (\operatorname{StmtOutOf}(\mathsf{out}'),\ \sigma_{3} )
\end{array}
$$

$$
\operatorname{FrameReset}(\Sigma ,\ r,\ \mathsf{scope},\ \mathsf{mark},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \Sigma ')\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{CleanupScope}(\mathsf{scope},\ \Sigma )\ \Downarrow \ (c,\ \Sigma_{1} )\ \land \ \mathsf{out}'\ =\ \operatorname{ExitOutcome}(\mathsf{out},\ c)\ \land \ ((\mathsf{out}'\ =\ \operatorname{Ctrl}(\mathsf{Abort})\ \land \ \Sigma '\ =\ \Sigma_{1} )\ \lor \ (\mathsf{out}'\ \ne \ \operatorname{Ctrl}(\mathsf{Abort})\ \land \ \operatorname{ResetArena}(\Sigma_{1} ,\ r,\ \mathsf{scope},\ \mathsf{mark})\ \Downarrow \ \Sigma_{2} \ \land \ \mathsf{PopScope}\_\sigma (\Sigma_{2} )\ \Downarrow \ (\Sigma ',\ \mathsf{scope})))
$$

**(Step-Exec-Frame-Enter-Implicit)**

$$
\begin{array}{l}
\operatorname{ActiveTarget}(\sigma )\ =\ r\quad \operatorname{FrameEnter}(\sigma ,\ r)\ \Downarrow \ (\sigma_{1} ,\ F,\ \mathsf{scope},\ \mathsf{mark}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Exec}(\operatorname{FrameStmt}(\bot ,\ b),\ \sigma )\rangle \ \to \ \langle \operatorname{FrameBody}(r,\ \mathsf{scope},\ \mathsf{mark},\ b,\ \sigma_{1} )\rangle 
\end{array}
$$

**(Step-Exec-Frame-Enter-Explicit)**

$$
\begin{array}{l}
\operatorname{LookupVal}(\sigma ,\ r)\ =\ v_{r}\quad \operatorname{RegionHandleOf}(v_{r})\ =\ h\quad \operatorname{ResolveTarget}(\sigma ,\ h)\ =\ r_{t}\quad \operatorname{FrameEnter}(\sigma ,\ r_{t})\ \Downarrow \ (\sigma_{1} ,\ F,\ \mathsf{scope},\ \mathsf{mark}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Exec}(\operatorname{FrameStmt}(r,\ b),\ \sigma )\rangle \ \to \ \langle \operatorname{FrameBody}(r_{t},\ \mathsf{scope},\ \mathsf{mark},\ b,\ \sigma_{1} )\rangle 
\end{array}
$$

**(Step-Exec-Frame-Body)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalInScopeSigma}(b,\ \sigma ,\ \mathsf{scope})\ \Downarrow \ (\mathsf{out},\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{FrameBody}(r,\ \mathsf{scope},\ \mathsf{mark},\ b,\ \sigma )\rangle \ \to \ \langle \operatorname{FrameExit}(r,\ \mathsf{scope},\ \mathsf{mark},\ \mathsf{out},\ \sigma_{1} )\rangle 
\end{array}
$$

**(Step-Exec-Frame-Exit-Ok)**

$$
\begin{array}{l}
\operatorname{FrameReset}(\sigma ,\ r,\ \mathsf{scope},\ \mathsf{mark},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma ')\quad \operatorname{StmtOutOf}(\mathsf{out}')\ =\ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{FrameExit}(r,\ \mathsf{scope},\ \mathsf{mark},\ \mathsf{out},\ \sigma )\rangle \ \to \ \langle \operatorname{ExecDone}(\sigma ')\rangle 
\end{array}
$$

**(Step-Exec-Frame-Exit-Ctrl)**

$$
\begin{array}{l}
\operatorname{FrameReset}(\sigma ,\ r,\ \mathsf{scope},\ \mathsf{mark},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma ')\quad \operatorname{StmtOutOf}(\mathsf{out}')\ =\ \operatorname{Ctrl}(\kappa ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{FrameExit}(r,\ \mathsf{scope},\ \mathsf{mark},\ \mathsf{out},\ \sigma )\rangle \ \to \ \langle \operatorname{ExecCtrl}(\kappa ,\ \sigma ')\rangle 
\end{array}
$$

### 18.8.6 Lowering

**(Lower-Stmt-Frame-Implicit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerBlock}(\mathsf{block})\ \Downarrow \ \langle \mathsf{IR}_{b},\ v_{b}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{FrameStmt}(\bot ,\ \mathsf{block}))\ \Downarrow \ \operatorname{FrameIR}(\bot ,\ \mathsf{IR}_{b},\ v_{b})
\end{array}
$$

**(Lower-Stmt-Frame-Explicit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{Identifier}(r))\ \Downarrow \ \langle \mathsf{IR}_{r},\ v_{r}\rangle \quad \Gamma \ \vdash \ \operatorname{LowerBlock}(\mathsf{block})\ \Downarrow \ \langle \mathsf{IR}_{b},\ v_{b}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{FrameStmt}(r,\ \mathsf{block}))\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{r},\ \operatorname{FrameIR}(v_{r},\ \mathsf{IR}_{b},\ v_{b}))
\end{array}
$$

### 18.8.7 Diagnostics

Diagnostics are defined for `frame` used with no active region in scope and for explicit frame targets that are not in `Region@Active` state.

## 18.9 Control-Transfer Statements

### 18.9.1 Syntax

```text
return_stmt   ::= "return" expression? terminator?
break_stmt    ::= "break" expression? terminator?
continue_stmt ::= "continue" terminator?
```

### 18.9.2 Parsing

**(Parse-Return-Stmt)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{return})\quad \Gamma \ \vdash \ \operatorname{ParseExprOpt}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStmtCore}(P)\ \Downarrow \ (P_{1},\ \operatorname{ReturnStmt}(e_{\mathsf{opt}}))
\end{array}
$$

**(Parse-Break-Stmt)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{break})\quad \Gamma \ \vdash \ \operatorname{ParseExprOpt}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStmtCore}(P)\ \Downarrow \ (P_{1},\ \operatorname{BreakStmt}(e_{\mathsf{opt}}))
\end{array}
$$

**(Parse-Continue-Stmt)**
IsKw(Tok(P), `continue`)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStmtCore}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \mathsf{ContinueStmt})
\end{array}
$$

### 18.9.3 AST Representation / Form

ReturnStmt(expr_opt)
BreakStmt(expr_opt)
ContinueStmt

### 18.9.4 Static Semantics

**(T-Return-Value)**

$$
\begin{array}{l}
R_{b}\ =\ \operatorname{BodyReturnType}(R)\quad \Gamma ;\ R;\ L\ \vdash \ e\ \Leftarrow \ R_{b}\ \dashv \ \emptyset  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{ReturnStmt}(e)\ \Rightarrow \ \Gamma \ \triangleright \ \langle [],\ [],\ \mathsf{false}\rangle 
\end{array}
$$

**(T-Return-Unit)**

$$
\begin{array}{l}
R_{b}\ =\ \operatorname{BodyReturnType}(R)\quad R_{b}\ =\ \operatorname{TypePrim}(\texttt{"()"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{ReturnStmt}(\bot )\ \Rightarrow \ \Gamma \ \triangleright \ \langle [],\ [],\ \mathsf{false}\rangle 
\end{array}
$$

**(Return-Async-Type-Err)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle \quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ T\quad \lnot (\Gamma \ \vdash \ T\ \mathrel{<:} \ \mathsf{Result})\quad c\ =\ \operatorname{Code}(E-\mathsf{CON}-0203) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{ReturnStmt}(e)\ \Uparrow \ c
\end{array}
$$

**(Return-Async-Unit-Err)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle \quad \mathsf{Result}\ \ne \ \operatorname{TypePrim}(\texttt{"()"})\quad c\ =\ \operatorname{Code}(E-\mathsf{CON}-0203) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{ReturnStmt}(\bot )\ \Uparrow \ c
\end{array}
$$

**(Return-Type-Err)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \bot \quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ T\quad R_{b}\ =\ \operatorname{BodyReturnType}(R)\quad \lnot (\Gamma \ \vdash \ T\ \mathrel{<:} \ R_{b})\quad c\ =\ \operatorname{Code}(\mathsf{Return}-\mathsf{Type}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{ReturnStmt}(e)\ \Uparrow \ c
\end{array}
$$

**(Return-Unit-Err)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \bot \quad R_{b}\ =\ \operatorname{BodyReturnType}(R)\quad R_{b}\ \ne \ \operatorname{TypePrim}(\texttt{"()"})\quad c\ =\ \operatorname{Code}(\mathsf{Return}-\mathsf{Type}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{ReturnStmt}(\bot )\ \Uparrow \ c
\end{array}
$$

**(T-Break-Value)**

$$
\begin{array}{l}
L\ =\ \texttt{loop}\quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{BreakStmt}(e)\ \Rightarrow \ \Gamma \ \triangleright \ \langle [],\ [T],\ \mathsf{false}\rangle 
\end{array}
$$

**(T-Break-Unit)**
L = `loop`

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{BreakStmt}(\bot )\ \Rightarrow \ \Gamma \ \triangleright \ \langle [],\ [],\ \mathsf{true}\rangle 
\end{array}
$$

**(Break-Outside-Loop)**

$$
\begin{array}{l}
L\ \ne \ \texttt{loop}\quad c\ =\ \operatorname{Code}(\mathsf{Break}-\mathsf{Outside}-\mathsf{Loop}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{BreakStmt}(\_)\ \Uparrow \ c
\end{array}
$$

**(T-Continue)**
L = `loop`

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \mathsf{ContinueStmt}\ \Rightarrow \ \Gamma \ \triangleright \ \langle [],\ [],\ \mathsf{false}\rangle 
\end{array}
$$

**(Continue-Outside-Loop)**

$$
\begin{array}{l}
L\ \ne \ \texttt{loop}\quad c\ =\ \operatorname{Code}(\mathsf{Continue}-\mathsf{Outside}-\mathsf{Loop}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \mathsf{ContinueStmt}\ \Uparrow \ c
\end{array}
$$

**(B-Return)**, **(B-Return-Unit)**, **(B-Break)**, **(B-Break-Unit)**, and **(B-Continue)** define binding-state effects for control transfer.

**(Prov-Return)**, **(Prov-Return-Unit)**, **(Prov-Break)**, **(Prov-Break-Unit)**, and **(Prov-Continue)** define the corresponding provenance effects.

### 18.9.5 Dynamic Semantics

**(ExecSigma-Return)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{ReturnStmt}(e),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{Return}(v)),\ \sigma_{1} )
\end{array}
$$

**(ExecSigma-Return-Unit)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{ReturnStmt}(\bot ),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{Return}(())),\ \sigma )
\end{array}
$$

**(ExecSigma-Return-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{ReturnStmt}(e),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(ExecSigma-Break)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{BreakStmt}(e),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{Break}(v)),\ \sigma_{1} )
\end{array}
$$

**(ExecSigma-Break-Unit)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{BreakStmt}(\bot ),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{Break}(\bot )),\ \sigma )
\end{array}
$$

**(ExecSigma-Break-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{BreakStmt}(e),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(ExecSigma-Continue)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\mathsf{ContinueStmt},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Continue}),\ \sigma )
\end{array}
$$

### 18.9.6 Lowering

**(Lower-Stmt-Return)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{ReturnStmt}(e))\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{e},\ \operatorname{ReturnIR}(v))
\end{array}
$$

**(Lower-Stmt-Return-Unit)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{ReturnStmt}(\bot ))\ \Downarrow \ \operatorname{ReturnIR}(())
\end{array}
$$

**(Lower-Stmt-Break)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{BreakStmt}(e))\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{e},\ \operatorname{BreakIR}(v))
\end{array}
$$

**(Lower-Stmt-Break-Unit)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{BreakStmt}(\bot ))\ \Downarrow \ \operatorname{BreakIR}(\bot )
\end{array}
$$

**(Lower-Stmt-Continue)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\mathsf{ContinueStmt})\ \Downarrow \ \mathsf{ContinueIR}
\end{array}
$$

For control-flow statements, the lowering MUST emit temporary cleanup immediately before the control transfer:

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{ReturnStmt}(e))\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{e},\ \operatorname{TempCleanupIR}(s),\ \operatorname{ReturnIR}(v)) \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{BreakStmt}(e))\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{e},\ \operatorname{TempCleanupIR}(s),\ \operatorname{BreakIR}(v)) \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{BreakStmt}(\bot ))\ \Downarrow \ \operatorname{SeqIR}(\operatorname{TempCleanupIR}(s),\ \operatorname{BreakIR}(\bot )) \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\mathsf{ContinueStmt})\ \Downarrow \ \operatorname{SeqIR}(\operatorname{TempCleanupIR}(s),\ \mathsf{ContinueIR})
\end{array}
$$

### 18.9.7 Diagnostics

Diagnostics are defined for return type mismatch, invalid async return type, `break` outside `loop`, `continue` outside `loop`, and `return` at module scope.

## 18.10 Unsafe Statements

### 18.10.1 Syntax

```text
unsafe_block ::= "unsafe" block_expr
```

### 18.10.2 Parsing

**(Parse-Unsafe-Block)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{unsafe})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ b) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStmtCore}(P)\ \Downarrow \ (P_{1},\ \operatorname{UnsafeBlockStmt}(b))
\end{array}
$$

### 18.10.3 AST Representation / Form

UnsafeBlockStmt(block)

### 18.10.4 Static Semantics

**(T-UnsafeStmt)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ b\ :\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{UnsafeBlockStmt}(b)\ \Rightarrow \ \Gamma \ \triangleright \ \langle [],\ [],\ \mathsf{false}\rangle 
\end{array}
$$

**(B-UnsafeStmt)** and **(Prov-UnsafeStmt)** define binding-state and provenance behavior for unsafe statement blocks.

Unsafe-required operation diagnostics are owned by the constructs that require them, including packed-field references, `transmute`, raw allocator operations, unchecked region operations, and `extern` calls.

### 18.10.5 Dynamic Semantics

**(ExecSigma-UnsafeStmt)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(b,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{UnsafeBlockStmt}(b),\ \sigma )\ \Downarrow \ (\operatorname{StmtOutOf}(\mathsf{out}),\ \sigma_{1} )
\end{array}
$$

### 18.10.6 Lowering

**(Lower-Stmt-UnsafeBlock)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerBlock}(\mathsf{block})\ \Downarrow \ \langle \mathsf{IR}_{b},\ v\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{UnsafeBlockStmt}(\mathsf{block}))\ \Downarrow \ \mathsf{IR}_{b}
\end{array}
$$

### 18.10.7 Diagnostics

No additional named diagnostics are introduced for the `unsafe` statement form itself. Diagnostics for unsafe-required operations remain owned by the specific construct being used.

## 18.11 Statement Diagnostics Supplement

This section owns diagnostics for statement typing, method placement, assignment, `defer`, and control flow.

| Code         | Severity | Detection    | Condition                                   |
| ------------ | -------- | ------------ | ------------------------------------------- |
| `E-MOD-2401` | Error    | Compile-time | Reassignment of immutable `let` binding     |
| `E-SEM-3011` | Error    | Compile-time | Method defined outside of type context      |
| `E-SEM-3012` | Error    | Compile-time | Duplicate method name in type               |
| `E-SEM-3131` | Error    | Compile-time | Assignment target is not a place expression |
| `E-SEM-3132` | Error    | Compile-time | Assignment through `const` permission       |
| `E-SEM-3133` | Error    | Compile-time | Assignment type mismatch                    |
| `E-SEM-3151` | Error    | Compile-time | Defer block has non-unit type               |
| `E-SEM-3152` | Error    | Compile-time | Non-local control flow in defer block       |
| `E-SEM-3161` | Error    | Compile-time | `return` type mismatch with procedure       |
| `E-SEM-3162` | Error    | Compile-time | `break` outside `loop`                      |
| `E-SEM-3163` | Error    | Compile-time | `continue` outside `loop`                   |
| `E-SEM-3165` | Error    | Compile-time | `return` at module scope                    |
