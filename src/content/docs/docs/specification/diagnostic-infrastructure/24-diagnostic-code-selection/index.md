---
title: "2.4 Diagnostic Code Selection"
description: "2.4 Diagnostic Code Selection from 2. Diagnostic Infrastructure of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "diagnostic-infrastructure"
specSection: "24-diagnostic-code-selection"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
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
