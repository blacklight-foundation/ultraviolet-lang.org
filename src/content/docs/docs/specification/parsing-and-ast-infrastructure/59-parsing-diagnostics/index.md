---
title: "5.9 Parsing Diagnostics"
description: "5.9 Parsing Diagnostics from 5. Parsing and AST Infrastructure of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "parsing-and-ast-infrastructure"
specSection: "59-parsing-diagnostics"
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
