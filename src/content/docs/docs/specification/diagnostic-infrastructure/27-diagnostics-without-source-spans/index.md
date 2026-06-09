---
title: "2.7 Diagnostics Without Source Spans"
description: "2.7 Diagnostics Without Source Spans from 2. Diagnostic Infrastructure of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "diagnostic-infrastructure"
specSection: "27-diagnostics-without-source-spans"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/diagnostic-infrastructure/">2. Diagnostic Infrastructure</a>
  <span>Diagnostic Infrastructure</span>
</div>

## 2.7 Diagnostics Without Source Spans

**(NoSpan-External)**

$$
\begin{array}{l}
\operatorname{Origin}(d)\ =\ \mathsf{External} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ d.\mathsf{span}\ =\ \bot 
\end{array}
$$
