---
title: "5.3 Parser State and Judgments"
description: "5.3 Parser State and Judgments from 5. Parsing and AST Infrastructure of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "parsing-and-ast-infrastructure"
specSection: "53-parser-state-and-judgments"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/parsing-and-ast-infrastructure/">5. Parsing and AST Infrastructure</a>
  <span>Parsing and AST Infrastructure</span>
</div>

## 5.3 Parser State and Judgments

**Parser State.**

$$
\mathsf{PState}\ =\ \langle K,\ i,\ D,\ j,\ d,\ \Delta \rangle 
$$

$$
\begin{array}{l}
\operatorname{TokStream}(P)\ =\ K \\[0.16em]
\operatorname{TokIndex}(P)\ =\ i \\[0.16em]
\operatorname{DocStream}(P)\ =\ D \\[0.16em]
\operatorname{DocIndex}(P)\ =\ j \\[0.16em]
\operatorname{Depth}(P)\ =\ d \\[0.16em]
\operatorname{DiagStream}(P)\ =\ \Delta 
\end{array}
$$

**Helper Functions.**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ = \\[0.16em]
\ K[i]\quad \mathsf{if}\ i\ <\ \mid K\mid  \\[0.16em]
\ \langle \mathsf{EOF},\ \varepsilon ,\ \operatorname{EOFSpan}(K)\rangle \quad \mathsf{if}\ i\ =\ \mid K\mid 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{SourceOf}(K)\ =\ S\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{Tokenize}(S)\ \Downarrow \ (K_{\mathsf{raw}},\ D)\ \land \ K\ =\ \operatorname{Filter}(K_{\mathsf{raw}}) \\[0.16em]
\operatorname{EOFSpan}(K)\ =\ \operatorname{EOFSpan}(\operatorname{SourceOf}(K))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Advance}(P)\ =\ \langle K,\ i+1,\ D,\ j,\ d,\ \Delta \rangle  \\[0.16em]
\operatorname{Clone}(P)\ =\ \langle K,\ i,\ D,\ j,\ d,\ []\rangle  \\[0.16em]
\operatorname{MergeDiag}(P_{b},\ P_{d},\ P_{s})\ =\ \langle \operatorname{TokStream}(P_{s}),\ \operatorname{TokIndex}(P_{s}),\ \operatorname{DocStream}(P_{s}),\ \operatorname{DocIndex}(P_{s}),\ \operatorname{Depth}(P_{s}),\ \operatorname{DiagStream}(P_{b})\ \mathbin{++} \ \operatorname{DiagStream}(P_{d})\rangle 
\end{array}
$$

**Parser Index Invariant.**

$$
\operatorname{PStateOk}(P)\ \Leftrightarrow \ 0\ \le \ i\ \le \ \mid K\mid 
$$

$$
\begin{array}{l}
\operatorname{AdvanceOrEOF}(P)\ = \\[0.16em]
\ \operatorname{Advance}(P)\ \mathsf{if}\ i\ <\ \mid K\mid  \\[0.16em]
\ P\quad \mathsf{if}\ i\ =\ \mid K\mid 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LastConsumed}(P,\ P')\ = \\[0.16em]
\ K[i'-1]\ \mathsf{if}\ i'\ >\ i \\[0.16em]
\ \operatorname{Tok}(P)\ \mathsf{if}\ i'\ =\ i
\end{array}
$$

$$
\operatorname{SpanBetween}(P,\ P')\ =\ \operatorname{SpanFrom}(\operatorname{Tok}(P),\ \operatorname{LastConsumed}(P,\ P'))
$$

$$
\begin{array}{l}
\operatorname{SplitSpan2}(\mathsf{sp})\ =\ (\mathsf{sp}_{L},\ \mathsf{sp}_{R})\ \mathsf{where} \\[0.16em]
\ \mathsf{sp}_{L}.\mathsf{file}\ =\ \mathsf{sp}.\mathsf{file}\ \land \ \mathsf{sp}_{R}.\mathsf{file}\ =\ \mathsf{sp}.\mathsf{file} \\[0.16em]
\ \mathsf{sp}_{L}.\mathsf{start}_{\mathsf{offset}}\ =\ \mathsf{sp}.\mathsf{start}_{\mathsf{offset}}\ \land \ \mathsf{sp}_{L}.\mathsf{end}_{\mathsf{offset}}\ =\ \mathsf{sp}.\mathsf{start}_{\mathsf{offset}}\ +\ 1 \\[0.16em]
\ \mathsf{sp}_{R}.\mathsf{start}_{\mathsf{offset}}\ =\ \mathsf{sp}.\mathsf{start}_{\mathsf{offset}}\ +\ 1\ \land \ \mathsf{sp}_{R}.\mathsf{end}_{\mathsf{offset}}\ =\ \mathsf{sp}.\mathsf{start}_{\mathsf{offset}}\ +\ 2 \\[0.16em]
\ \mathsf{sp}_{L}.\mathsf{start}_{\mathsf{line}}\ =\ \mathsf{sp}.\mathsf{start}_{\mathsf{line}}\ \land \ \mathsf{sp}_{L}.\mathsf{end}_{\mathsf{line}}\ =\ \mathsf{sp}.\mathsf{start}_{\mathsf{line}} \\[0.16em]
\ \mathsf{sp}_{R}.\mathsf{start}_{\mathsf{line}}\ =\ \mathsf{sp}.\mathsf{start}_{\mathsf{line}}\ \land \ \mathsf{sp}_{R}.\mathsf{end}_{\mathsf{line}}\ =\ \mathsf{sp}.\mathsf{start}_{\mathsf{line}} \\[0.16em]
\ \mathsf{sp}_{L}.\mathsf{start}_{\mathsf{col}}\ =\ \mathsf{sp}.\mathsf{start}_{\mathsf{col}}\ \land \ \mathsf{sp}_{L}.\mathsf{end}_{\mathsf{col}}\ =\ \mathsf{sp}.\mathsf{start}_{\mathsf{col}}\ +\ 1 \\[0.16em]
\ \mathsf{sp}_{R}.\mathsf{start}_{\mathsf{col}}\ =\ \mathsf{sp}.\mathsf{start}_{\mathsf{col}}\ +\ 1\ \land \ \mathsf{sp}_{R}.\mathsf{end}_{\mathsf{col}}\ =\ \mathsf{sp}.\mathsf{start}_{\mathsf{col}}\ +\ 2
\end{array}
$$

$$
\begin{array}{l}
\operatorname{SplitShiftR}(P)\ =\ \langle K',\ i,\ D,\ j,\ d,\ \Delta \rangle  \\[0.16em]
\mathsf{where}\ \operatorname{Tok}(P)\ =\ \langle \operatorname{Operator}(\texttt{">>"}),\ \texttt{">>"},\ \mathsf{sp}\rangle \ \land \ (\mathsf{sp}_{L},\ \mathsf{sp}_{R})\ =\ \operatorname{SplitSpan2}(\mathsf{sp}) \\[0.16em]
K'\ =\ K[0..i)\ \mathbin{++} \ [\langle \operatorname{Operator}(\texttt{">"}),\ \texttt{">"},\ \mathsf{sp}_{L}\rangle ,\ \langle \operatorname{Operator}(\texttt{">"}),\ \texttt{">"},\ \mathsf{sp}_{R}\rangle ]\ \mathbin{++} \ K[i+1..]
\end{array}
$$

**Judgments (Big-Step).**

$$
\mathsf{ParseJudgment}\ =\ \{\mathsf{ParseFile},\ \mathsf{ParseModule},\ \mathsf{ParseItem},\ \mathsf{ParseStmt},\ \mathsf{ParseExpr},\ \mathsf{ParsePattern},\ \mathsf{ParseType}\}
$$
