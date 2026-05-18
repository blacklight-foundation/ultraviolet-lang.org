---
title: "2.7 Diagnostics Without Source Spans"
description: "2.7 Diagnostics Without Source Spans from 2. Diagnostic Infrastructure of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "diagnostic-infrastructure"
specSection: "27-diagnostics-without-source-spans"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
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
