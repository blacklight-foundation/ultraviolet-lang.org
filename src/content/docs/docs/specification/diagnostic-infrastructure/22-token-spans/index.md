---
title: "2.2 Token Spans"
description: "2.2 Token Spans from 2. Diagnostic Infrastructure of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "diagnostic-infrastructure"
specSection: "22-token-spans"
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
