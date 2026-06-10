---
title: "5.6 ParseFile, Item Sequencing, and Terminators"
description: "5.6 ParseFile, Item Sequencing, and Terminators from 5. Parsing and AST Infrastructure of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "parsing-and-ast-infrastructure"
specSection: "56-parsefile-item-sequencing-and-terminators"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/parsing-and-ast-infrastructure/">5. Parsing and AST Infrastructure</a>
  <span>Parsing and AST Infrastructure</span>
</div>

## 5.6 ParseFile, Item Sequencing, and Terminators

**ParseFile (Big-Step).**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Tokenize}(S)\ \Downarrow \ (K_{\mathsf{raw}},\ D) \\[0.16em]
K\ =\ \operatorname{Filter}(K_{\mathsf{raw}}) \\[0.16em]
P_{0}\ =\ \langle K,\ 0,\ D,\ 0,\ 0,\ []\rangle
\end{array}
$$

**(ParseFile-Ok)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseItems}(P_{0})\ \Downarrow \ (P_{1},\ I,\ \mathsf{MDoc}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseFile}(S)\ \Downarrow \ \langle S.\mathsf{path},\ I,\ \mathsf{MDoc}\rangle
\end{array}
$$

**Item Sequence (Big-Step).**

**(ParseItems-Empty)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ =\ \mathsf{EOF} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseItems}(P)\ \Downarrow \ (P,\ [],\ [])
\end{array}
$$

**(ParseItems-Cons)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ \ne \ \mathsf{EOF}\quad \Gamma \ \vdash \ \operatorname{ParseItem}(P)\ \Downarrow \ (P_{1},\ \mathsf{it})\quad \Gamma \ \vdash \ \operatorname{ParseItems}(P_{1})\ \Downarrow \ (P_{2},\ I,\ M) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseItems}(P)\ \Downarrow \ (P_{2},\ [\mathsf{it}]\ \mathbin{++} \ I,\ M)
\end{array}
$$

**Statement Terminators.**

$$
\begin{array}{l}
\mathsf{StmtTerm}\ =\ \{\operatorname{Punctuator}(\texttt{";"}),\ \mathsf{Newline}\} \\[0.16em]
\operatorname{IsTerm}(t)\ \Leftrightarrow \ t\ \in \ \mathsf{StmtTerm}
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

**(ConsumeTerminatorReq-Yes)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ \in \ \{\operatorname{Punctuator}(\texttt{";"}),\ \mathsf{Newline}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ConsumeTerminatorReq}(P)\ \Downarrow \ \operatorname{Advance}(P)
\end{array}
$$

**(ConsumeTerminatorReq-No)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ \notin \ \{\operatorname{Punctuator}(\texttt{";"}),\ \mathsf{Newline}\}\quad c\ =\ \operatorname{Code}(\mathsf{Missing}-\mathsf{Terminator}-\mathsf{Err})\quad \Gamma \ \vdash \ \operatorname{Emit}(c,\ \operatorname{Tok}(P).\mathsf{span})\quad \Gamma \ \vdash \ \operatorname{SyncStmt}(P)\ \Downarrow \ P_{1} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ConsumeTerminatorReq}(P)\ \Downarrow \ P_{1}
\end{array}
$$
