---
title: "2.4 Diagnostic Code Selection"
description: "2.4 Diagnostic Code Selection from 2. Diagnostic Infrastructure of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "diagnostic-infrastructure"
specSection: "24-diagnostic-code-selection"
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

## 2.4 Diagnostic Code Selection

$$
\mathsf{SpecCode}\ :\ \mathsf{DiagId}\ \rightharpoonup \ \mathsf{DiagCode}
$$
SpecCode(id) = c ⇔ the owning construct section of this specification assigns diagnostic code `c` to identifier `id`. A construct section assigns `c` to `id` by listing the backtick-quoted rule label `id` parenthetically in the Condition column of the normative table row for `c`.

$$
\operatorname{SpecCode}(\mathsf{id})\ =\ \bot \ \Leftrightarrow \ \mathsf{no}\ \mathsf{owning}\ \mathsf{construct}\ \mathsf{section}\ \mathsf{of}\ \mathsf{this}\ \mathsf{specification}\ \mathsf{assigns}\ a\ \mathsf{diagnostic}\ \mathsf{code}\ \mathsf{to}\ \texttt{id}.
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
