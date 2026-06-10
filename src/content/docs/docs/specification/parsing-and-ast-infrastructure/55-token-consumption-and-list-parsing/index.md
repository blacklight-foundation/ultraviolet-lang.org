---
title: "5.5 Token Consumption and List Parsing"
description: "5.5 Token Consumption and List Parsing from 5. Parsing and AST Infrastructure of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "parsing-and-ast-infrastructure"
specSection: "55-token-consumption-and-list-parsing"
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

## 5.5 Token Consumption and List Parsing

$$
\begin{array}{l}
\mathsf{ConsumeState}\ =\ \{\operatorname{Consume}(P,\ k),\ \operatorname{ConsumeDone}(P)\} \\[0.16em]
\mathsf{ParseRejectRules}\ =\ \emptyset
\end{array}
$$

**(Tok-Consume-Kind)**

$$
\begin{array}{l}
\operatorname{Tok}(P).\mathsf{kind}\ =\ k \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Consume}(P,\ k)\rangle \ \to \ \langle \operatorname{ConsumeDone}(\operatorname{Advance}(P))\rangle
\end{array}
$$

**(Tok-Consume-Keyword)**
IsKw(Tok(P), s)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Consume}(P,\ \operatorname{Keyword}(s))\rangle \ \to \ \langle \operatorname{ConsumeDone}(\operatorname{Advance}(P))\rangle
\end{array}
$$

**(Tok-Consume-Operator)**
IsOp(Tok(P), s)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Consume}(P,\ \operatorname{Operator}(s))\rangle \ \to \ \langle \operatorname{ConsumeDone}(\operatorname{Advance}(P))\rangle
\end{array}
$$

**(Tok-Consume-Punct)**
IsPunc(Tok(P), s)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Consume}(P,\ \operatorname{Punctuator}(s))\rangle \ \to \ \langle \operatorname{ConsumeDone}(\operatorname{Advance}(P))\rangle
\end{array}
$$

**List Parsing (Small-Step)**

$$
\mathsf{ListState}\ =\ \{\operatorname{ListStart}(P),\ \operatorname{ListScan}(P,\ \mathsf{xs}),\ \operatorname{ListDone}(P,\ \mathsf{xs})\}
$$

**(List-Start)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{ListStart}(P)\rangle \ \to \ \langle \operatorname{ListScan}(P,\ [])\rangle
\end{array}
$$

**(List-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseElem}(P)\ \Downarrow \ (P',\ x) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{ListScan}(P,\ \mathsf{xs})\rangle \ \to \ \langle \operatorname{ListScan}(P',\ \mathsf{xs}\ \mathbin{++} \ [x])\rangle
\end{array}
$$

**(List-Done)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ \in \ \mathsf{EndSet} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{ListScan}(P,\ \mathsf{xs})\rangle \ \to \ \langle \operatorname{ListDone}(P,\ \mathsf{xs})\rangle
\end{array}
$$

$$
\mathsf{EndSet}\ \subseteq \ \mathsf{TokenKind}
$$
In list parsing rules, P_0 denotes the parser state immediately after consuming the list opening delimiter for the list being parsed.

$$
\begin{array}{l}
\operatorname{TrailingComma}(P,\ \mathsf{EndSet})\ \Leftrightarrow \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\ \land \ \operatorname{Tok}(\operatorname{Advance}(P))\ \in \ \mathsf{EndSet} \\[0.16em]
\operatorname{TokensBetween}(P_{0},\ P)\ =\ \langle \operatorname{TokIndex}(P_{0}),\ \operatorname{TokIndex}(P)\rangle \\[0.16em]
\operatorname{TokLine}(t)\ =\ t.\mathsf{span}.\mathsf{start}_{\mathsf{line}} \\[0.16em]
\operatorname{TrailingCommaAllowed}(P_{0},\ P,\ \mathsf{EndSet})\ \Leftrightarrow \ \operatorname{TrailingComma}(P,\ \mathsf{EndSet})\ \land \ \operatorname{TokLine}(\operatorname{Tok}(P))\ <\ \operatorname{TokLine}(\operatorname{Tok}(\operatorname{Advance}(P)))
\end{array}
$$

**(Trailing-Comma-Err)**

$$
\begin{array}{l}
\operatorname{TrailingComma}(P,\ \mathsf{EndSet})\quad \lnot \ \operatorname{TrailingCommaAllowed}(P_{0},\ P,\ \mathsf{EndSet})\quad c\ =\ \operatorname{Code}(\mathsf{Trailing}-\mathsf{Comma}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Emit}(c,\ \operatorname{Tok}(P).\mathsf{span})
\end{array}
$$

**Bracketed Option Lists (Shared Schema).**
The bracketed option lists of §§19.2, 20.1, 20.4, and 20.5 share one parameterized rule family. `El` ranges over option-element parsers; each owning section instantiates the family by substituting its element parser and rule-name prefix.

**(Parse-OptListOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"["}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseOptListOpt}(\mathsf{El},\ P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-OptListOpt-Yes)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"["})\quad \Gamma \ \vdash \ \operatorname{ParseOptList}(\mathsf{El},\ \operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{os})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"]"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseOptListOpt}(\mathsf{El},\ P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \mathsf{os})
\end{array}
$$

**(Parse-OptList-Empty)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"]"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseOptList}(\mathsf{El},\ P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-OptList-Cons)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"]"})\quad \Gamma \ \vdash \ \operatorname{El}(P)\ \Downarrow \ (P_{1},\ o)\quad \Gamma \ \vdash \ \operatorname{ParseOptListTail}(\mathsf{El},\ P_{1})\ \Downarrow \ (P_{2},\ \mathsf{os}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseOptList}(\mathsf{El},\ P)\ \Downarrow \ (P_{2},\ [o]\ \mathbin{++} \ \mathsf{os})
\end{array}
$$

**(Parse-OptListTail-Comma)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \lnot \ \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"]"})\quad \Gamma \ \vdash \ \operatorname{El}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ o)\quad \Gamma \ \vdash \ \operatorname{ParseOptListTail}(\mathsf{El},\ P_{1})\ \Downarrow \ (P_{2},\ \mathsf{os}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseOptListTail}(\mathsf{El},\ P)\ \Downarrow \ (P_{2},\ [o]\ \mathbin{++} \ \mathsf{os})
\end{array}
$$

**(Parse-OptListTail-TrailingComma)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"]"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseOptListTail}(\mathsf{El},\ P)\ \Downarrow \ (\operatorname{Advance}(P),\ [])
\end{array}
$$

**(Parse-OptListTail-End)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseOptListTail}(\mathsf{El},\ P)\ \Downarrow \ (P,\ [])
\end{array}
$$
