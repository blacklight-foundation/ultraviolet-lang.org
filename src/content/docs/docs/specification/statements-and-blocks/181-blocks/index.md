---
title: "18.1 Blocks"
description: "18.1 Blocks from 18. Statements and Blocks of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "statements-and-blocks"
specSection: "181-blocks"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/statements-and-blocks/">18. Statements and Blocks</a>
  <span>Statements and Blocks</span>
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
