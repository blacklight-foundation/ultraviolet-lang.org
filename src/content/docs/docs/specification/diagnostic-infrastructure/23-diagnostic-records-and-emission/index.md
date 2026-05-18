---
title: "2.3 Diagnostic Records and Emission"
description: "2.3 Diagnostic Records and Emission from 2. Diagnostic Infrastructure of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "diagnostic-infrastructure"
specSection: "23-diagnostic-records-and-emission"
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

## 2.3 Diagnostic Records and Emission

**Diagnostic.**

$$
\begin{array}{l}
\mathsf{Severity}\ =\ \{\mathsf{Error},\ \mathsf{Warning},\ \mathsf{Info},\ \mathsf{Panic},\ \mathsf{Note}\} \\[0.16em]
\mathsf{DiagCodeOpt}\ =\ \mathsf{DiagCode}\ \cup \ \{\bot \} \\[0.16em]
\mathsf{Diagnostic}\ =\ \langle \mathsf{code},\ \mathsf{severity},\ \mathsf{message},\ \mathsf{span}\rangle \quad \mathsf{where}\ \mathsf{code}\ \in \ \mathsf{DiagCodeOpt}\ \land \ \mathsf{severity}\ \in \ \mathsf{Severity}
\end{array}
$$

Normative diagnostic tables define only code-owned diagnostics. A diagnostic `d` is code-owned iff `d.code ≠ ⊥`. Auxiliary diagnostics use `d.code = ⊥`; they are admitted only where a feature section defines them explicitly.

**Diagnostic Stream.**

$$
\Delta \ =\ [d_{1},\ \ldots ,\ d_{n}]
$$

**(Emit-Append)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Emit}(\Delta ,\ d)\ \Downarrow \ (\Delta \ \mathbin{++} \ [d])
\end{array}
$$

**Emit (Implicit).**

$$
\begin{array}{l}
\mathsf{SeverityColumn}\ :\ \mathsf{DiagCode}\ \to \ \mathsf{Severity} \\[0.16em]
\mathsf{ConditionColumn}\ :\ \mathsf{DiagCode}\ \to \ \mathsf{String}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{SeverityColumn}(c)\ =\ \mathsf{sev}\ \Leftrightarrow \ a\ \mathsf{normative}\ \mathsf{diagnostic}\ \mathsf{table}\ \mathsf{in}\ \mathsf{this}\ \mathsf{specification}\ \mathsf{defines}\ \mathsf{code}\ \texttt{c}\ \mathsf{with}\ \mathsf{severity}\ \texttt{sev}. \\[0.16em]
\operatorname{ConditionColumn}(c)\ =\ \mathsf{cond}\ \Leftrightarrow \ a\ \mathsf{normative}\ \mathsf{diagnostic}\ \mathsf{table}\ \mathsf{in}\ \mathsf{this}\ \mathsf{specification}\ \mathsf{defines}\ \mathsf{code}\ \texttt{c}\ \mathsf{with}\ \mathsf{condition}\ \mathsf{text}\ \texttt{cond}.
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Emit}(c)\ =\ \operatorname{Emit}(\Delta ,\ \langle c,\ \operatorname{Severity}(c),\ \operatorname{Message}(c),\ \bot \rangle ) \\[0.16em]
\operatorname{Emit}(c,\ \mathsf{sp})\ =\ \operatorname{Emit}(\Delta ,\ \langle c,\ \operatorname{Severity}(c),\ \operatorname{Message}(c),\ \mathsf{sp}\rangle ) \\[0.16em]
\operatorname{EmitList}([])\ =\ \mathsf{ok} \\[0.16em]
\operatorname{EmitList}([d]\ \mathbin{++} \ \mathsf{ds})\ =\ (\Gamma \ \vdash \ \operatorname{Emit}(d))\ \land \ \operatorname{EmitList}(\mathsf{ds})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Severity}(c)\ =\ \operatorname{SeverityColumn}(c) \\[0.16em]
\operatorname{Message}(c)\ =\ \operatorname{ConditionColumn}(c)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{CompileStatus}(\Delta )\ = \\[0.16em]
\ \mathsf{fail}\ \mathsf{if}\ \operatorname{HasError}(\Delta ) \\[0.16em]
\ \mathsf{ok}\quad \mathsf{otherwise}
\end{array}
$$
