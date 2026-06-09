---
title: "5.9 Parsing Diagnostics"
description: "5.9 Parsing Diagnostics from 5. Parsing and AST Infrastructure of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "parsing-and-ast-infrastructure"
specSection: "59-parsing-diagnostics"
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
