---
title: "5.8 Error Recovery and Synchronization"
description: "5.8 Error Recovery and Synchronization from 5. Parsing and AST Infrastructure of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "parsing-and-ast-infrastructure"
specSection: "58-error-recovery-and-synchronization"
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

## 5.8 Error Recovery and Synchronization

**Statement Synchronization Set.**

$$
\mathsf{SyncStmt}\ =\ \{\operatorname{Punctuator}(\texttt{";"}),\ \mathsf{Newline},\ \operatorname{Punctuator}(\texttt{"\}"}),\ \mathsf{EOF}\}
$$

**Item Synchronization Set.**

$$
\mathsf{SyncItem}\ =\ \{\operatorname{Keyword}(\texttt{procedure}),\ \operatorname{Keyword}(\texttt{record}),\ \operatorname{Keyword}(\texttt{enum}),\ \operatorname{Keyword}(\texttt{modal}),\ \operatorname{Keyword}(\texttt{class}),\ \operatorname{Keyword}(\texttt{type}),\ \operatorname{Keyword}(\texttt{using}),\ \operatorname{Keyword}(\texttt{let}),\ \operatorname{Keyword}(\texttt{var}),\ \operatorname{Punctuator}(\texttt{"\}"}),\ \mathsf{EOF}\}
$$

**Type Synchronization Set.**

$$
\mathsf{SyncType}\ =\ \{\operatorname{Punctuator}(\texttt{","}),\ \operatorname{Punctuator}(\texttt{";"}),\ \mathsf{Newline},\ \operatorname{Punctuator}(\texttt{")"}),\ \operatorname{Punctuator}(\texttt{"]"}),\ \operatorname{Punctuator}(\texttt{"\}"}),\ \mathsf{EOF}\}
$$

**(Sync-Stmt-Stop)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ \in \ \{\operatorname{Punctuator}(\texttt{"\}"}),\ \mathsf{EOF}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{SyncStmt}(P)\ \Downarrow \ P
\end{array}
$$

**(Sync-Stmt-Consume)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ \in \ \{\operatorname{Punctuator}(\texttt{";"}),\ \mathsf{Newline}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{SyncStmt}(P)\ \Downarrow \ \operatorname{Advance}(P)
\end{array}
$$

**(Sync-Stmt-Advance)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ \notin \ \mathsf{SyncStmt} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{SyncStmt}(P)\ \Downarrow \ \operatorname{SyncStmt}(\operatorname{Advance}(P))
\end{array}
$$

**(Sync-Item-Stop)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ \in \ \mathsf{SyncItem} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{SyncItem}(P)\ \Downarrow \ P
\end{array}
$$

**(Sync-Item-Advance)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ \notin \ \mathsf{SyncItem} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{SyncItem}(P)\ \Downarrow \ \operatorname{SyncItem}(\operatorname{Advance}(P))
\end{array}
$$

**(Sync-Type-Stop)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ \in \ \{\operatorname{Punctuator}(\texttt{")"}),\ \operatorname{Punctuator}(\texttt{"]"}),\ \operatorname{Punctuator}(\texttt{"\}"}),\ \mathsf{EOF}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{SyncType}(P)\ \Downarrow \ P
\end{array}
$$

**(Sync-Type-Consume)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ \in \ \{\operatorname{Punctuator}(\texttt{","}),\ \operatorname{Punctuator}(\texttt{";"}),\ \mathsf{Newline}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{SyncType}(P)\ \Downarrow \ \operatorname{Advance}(P)
\end{array}
$$

**(Sync-Type-Advance)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ \notin \ \mathsf{SyncType} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{SyncType}(P)\ \Downarrow \ \operatorname{SyncType}(\operatorname{Advance}(P))
\end{array}
$$

StmtParseErrRule = Parse-Statement-Err
ItemParseErrRule = Parse-Item-Err
