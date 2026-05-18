---
title: "2.4 Diagnostic Code Selection"
description: "2.4 Diagnostic Code Selection from 2. Diagnostic Infrastructure of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "diagnostic-infrastructure"
specSection: "24-diagnostic-code-selection"
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

## 2.4 Diagnostic Code Selection

$$
\begin{array}{l}
\mathsf{SpecCode}\ :\ \mathsf{DiagId}\ \rightharpoonup \ \mathsf{DiagCode} \\[0.16em]
\operatorname{SpecCode}(\mathsf{id})\ =\ c\ \Leftrightarrow \ \mathsf{the}\ \mathsf{owning}\ \mathsf{construct}\ \mathsf{section}\ \mathsf{of}\ \mathsf{this}\ \mathsf{specification}\ \mathsf{assigns}\ \mathsf{diagnostic}\ \mathsf{code}\ \texttt{c}\ \mathsf{to}\ \mathsf{identifier}\ \texttt{id}. \\[0.16em]
\operatorname{SpecCode}(\mathsf{id})\ =\ \bot \ \Leftrightarrow \ \mathsf{no}\ \mathsf{owning}\ \mathsf{construct}\ \mathsf{section}\ \mathsf{of}\ \mathsf{this}\ \mathsf{specification}\ \mathsf{assigns}\ a\ \mathsf{diagnostic}\ \mathsf{code}\ \mathsf{to}\ \texttt{id}.
\end{array}
$$

**(Code)**

$$
\begin{array}{l}
\operatorname{SpecCode}(\mathsf{id})\ =\ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Code}(\mathsf{id})\ \Downarrow \ c
\end{array}
$$

Appendix A is informative only. It MUST NOT define `SpecCode`, `SeverityColumn`, or `ConditionColumn`.

**DiagId-Code Mapping.**
id emits a diagnostic

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Emit}(\operatorname{Code}(\mathsf{id})) \\[0.16em]
\Uparrow \ \equiv \ \Uparrow \ \operatorname{Code}(\mathsf{id})
\end{array}
$$

**Resolution Failure.**

$$
\operatorname{NoDiag}(\uparrow )
$$
