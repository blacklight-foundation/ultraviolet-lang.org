---
title: "5.7 Doc Comment Association"
description: "5.7 Doc Comment Association from 5. Parsing and AST Infrastructure of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "parsing-and-ast-infrastructure"
specSection: "57-doc-comment-association"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/parsing-and-ast-infrastructure/">5. Parsing and AST Infrastructure</a>
  <span>Parsing and AST Infrastructure</span>
</div>

## 5.7 Doc Comment Association

$$
\begin{array}{l}
\operatorname{DocSeq}(D)\ =\ D \\[0.16em]
\operatorname{ItemSeq}(\mathsf{Items})\ =\ \mathsf{Items}
\end{array}
$$

**(Attach-Doc-Line)**

$$
\begin{array}{l}
d.\mathsf{kind}\ =\ \mathsf{LineDoc}\quad \mathsf{Items}\ =\ [i_{1},\ \ldots ,\ i_{k}]\quad j\ =\ \mathsf{min}\{\ t\ \mid \ d.\mathsf{span}.\mathsf{end}_{\mathsf{offset}}\ \le \ i_{t}.\mathsf{span}.\mathsf{start}_{\mathsf{offset}}\ \} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AttachDoc}(d,\ i_{j})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LineDocTarget}(d,\ \mathsf{Items})\ =\ i_{j}\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{AttachDoc}(d,\ i_{j}) \\[0.16em]
\operatorname{LineDocsFor}(i,\ D,\ \mathsf{Items})\ =\ [d\ \in \ D\ \mid \ d.\mathsf{kind}\ =\ \mathsf{LineDoc}\ \land \ \operatorname{LineDocTarget}(d,\ \mathsf{Items})\ =\ i]
\end{array}
$$

**(Attach-Doc-Module)**
d.kind = ModuleDoc

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AttachModuleDoc}(d)
\end{array}
$$

$$
\operatorname{ModuleDocs}(D)\ =\ [d\ \in \ D\ \mid \ d.\mathsf{kind}\ =\ \mathsf{ModuleDoc}]
$$
