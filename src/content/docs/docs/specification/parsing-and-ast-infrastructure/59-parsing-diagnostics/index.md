---
title: "5.9 Parsing Diagnostics"
description: "5.9 Parsing Diagnostics from 5. Parsing and AST Infrastructure of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "parsing-and-ast-infrastructure"
specSection: "59-parsing-diagnostics"
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

## 5.9 Parsing Diagnostics

$$
\mathsf{Phase1DiagRules}\ =\ \{\mathsf{Missing}-\mathsf{Terminator}-\mathsf{Err},\ \mathsf{Trailing}-\mathsf{Comma}-\mathsf{Err},\ \mathsf{Parse}-\mathsf{Syntax}-\mathsf{Err}\}
$$

**(Parse-Syntax-Err)**

$$
\mathsf{GenericParseRules}\ =\ \{\mathsf{Parse}-\mathsf{Ident}-\mathsf{Err},\ \mathsf{Parse}-\mathsf{Type}-\mathsf{Err},\ \mathsf{Parse}-\mathsf{Pattern}-\mathsf{Err},\ \mathsf{Parse}-\mathsf{Primary}-\mathsf{Err},\ \mathsf{Parse}-\mathsf{Statement}-\mathsf{Err},\ \mathsf{Parse}-\mathsf{Item}-\mathsf{Err}\}
$$

$$
\begin{array}{l}
r\ \in \ \mathsf{GenericParseRules}\quad \operatorname{PremisesHold}(r,\ P) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Emit}(\operatorname{Code}(\mathsf{Parse}-\mathsf{Syntax}-\mathsf{Err}))
\end{array}
$$
