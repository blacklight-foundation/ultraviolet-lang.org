---
title: "2.7 Diagnostics Without Source Spans"
description: "2.7 Diagnostics Without Source Spans from 2. Diagnostic Infrastructure of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "diagnostic-infrastructure"
specSection: "27-diagnostics-without-source-spans"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
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
