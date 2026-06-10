---
title: "2.2 Token Spans"
description: "2.2 Token Spans from 2. Diagnostic Infrastructure of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "diagnostic-infrastructure"
specSection: "22-token-spans"
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

## 2.2 Token Spans

**TokenKind.**

$$
\mathsf{TokenKind}\ =\ \mathsf{TokenKind}\_(\S 4.2.4)\ \cup \ \{\mathsf{Unknown}\}
$$

**(No-Unknown-Ok)**

$$
\begin{array}{l}
\forall \ t\ \in \ K.\ t.\mathsf{kind}\ \ne \ \mathsf{Unknown} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ K\ :\ \mathsf{TokenStreamOk}
\end{array}
$$

**RawToken.**

$$
\mathsf{RawToken}\ =\ \langle \mathsf{kind},\ \mathsf{lexeme},\ s,\ e\rangle
$$

**Token.**

$$
\mathsf{Token}\ =\ \langle \mathsf{kind},\ \mathsf{lexeme},\ \mathsf{span}\rangle
$$

**(Attach-Token-Ok)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{SpanOf}(S,\ s,\ e)\ \Downarrow \ \mathsf{sp} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AttachSpan}(S,\ \langle k,\ \ell ,\ s,\ e\rangle )\ \Downarrow \ \langle k,\ \ell ,\ \mathsf{sp}\rangle
\end{array}
$$

**Token Stream Attachment (Big-Step)**

**(Attach-Tokens-Ok)**

$$
\begin{array}{l}
\forall \ r\ \in \ \mathsf{rs},\ \Gamma \ \vdash \ \operatorname{AttachSpan}(S,\ r)\ \Downarrow \ t\quad \mathsf{ts}\ =\ [t\ \mid \ r\ \in \ \mathsf{rs}] \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AttachSpans}(S,\ \mathsf{rs})\ \Downarrow \ \mathsf{ts}
\end{array}
$$
