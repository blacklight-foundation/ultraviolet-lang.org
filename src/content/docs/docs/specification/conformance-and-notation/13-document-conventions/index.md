---
title: "1.3 Document Conventions"
description: "1.3 Document Conventions from 1. Conformance and Notation of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "conformance-and-notation"
specSection: "13-document-conventions"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/conformance-and-notation/">1. Conformance and Notation</a>
  <span>Conformance and Notation</span>
</div>

## 1.3 Document Conventions

**NormativeKeywords.**

$$
\mathsf{NormativeKeywords}\ =\ \{\texttt{MUST},\ \texttt{MUST NOT},\ \texttt{SHOULD},\ \texttt{SHOULD NOT},\ \texttt{MAY}\}
$$

**RFC 2119 Interpretation.**
The keywords in NormativeKeywords MUST be interpreted as described in RFC 2119.

**DiagnosticCodeFormat.**

$$
\begin{array}{l}
\mathsf{DiagPrefix}\ =\ \{E,\ W,\ I,\ P\} \\[0.16em]
\mathsf{DiagCategory}\ =\ [A-Z]^3 \\[0.16em]
\mathsf{DiagDigits}\ =\ [0-9]^4 \\[0.16em]
\mathsf{DiagCode}\ =\ \mathsf{DiagPrefix}\ \mathbin{++} \ \texttt{"-"}\ \mathbin{++} \ \mathsf{DiagCategory}\ \mathbin{++} \ \texttt{"-"}\ \mathbin{++} \ \mathsf{DiagDigits} \\[0.16em]
\operatorname{Bucket}(\mathsf{Digits})\ =\ \mathsf{Digits}[0..1] \\[0.16em]
\operatorname{Seq}(\mathsf{Digits})\ =\ \mathsf{Digits}[2..3]
\end{array}
$$
