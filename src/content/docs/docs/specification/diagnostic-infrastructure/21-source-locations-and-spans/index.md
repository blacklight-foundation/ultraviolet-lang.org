---
title: "2.1 Source Locations and Spans"
description: "2.1 Source Locations and Spans from 2. Diagnostic Infrastructure of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "diagnostic-infrastructure"
specSection: "21-source-locations-and-spans"
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

## 2.1 Source Locations and Spans

**SourceLocation.**

$$
\mathsf{SourceLocation}\ =\ \langle \mathsf{file},\ \mathsf{offset},\ \mathsf{line},\ \mathsf{column}\rangle 
$$

**Span.**

$$
\mathsf{Span}\ =\ \langle \mathsf{file},\ \mathsf{start}_{\mathsf{offset}},\ \mathsf{end}_{\mathsf{offset}},\ \mathsf{start}_{\mathsf{line}},\ \mathsf{start}_{\mathsf{col}},\ \mathsf{end}_{\mathsf{line}},\ \mathsf{end}_{\mathsf{col}}\rangle 
$$

$$
\operatorname{SpanRange}(\mathsf{sp})\ =\ [\mathsf{sp}.\mathsf{start}_{\mathsf{offset}},\ \mathsf{sp}.\mathsf{end}_{\mathsf{offset}})
$$

**(WF-Location)**

$$
\begin{array}{l}
0\ \le \ o\quad \Gamma \ \vdash \ \operatorname{Locate}(S,\ o)\ \Downarrow \ \ell_{\mathsf{loc}}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \ell_{\mathsf{loc}} \ :\ \mathsf{LocationOk}
\end{array}
$$

**(WF-Span)**

$$
\begin{array}{l}
0\ \le \ s\ \le \ e\ \le \ S.\mathsf{byte}_{\mathsf{len}}\quad \Gamma \ \vdash \ \operatorname{Locate}(S,\ s)\ \Downarrow \ \ell_{s} \quad \Gamma \ \vdash \ \operatorname{Locate}(S,\ e)\ \Downarrow \ \ell_{e}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \langle S.\mathsf{path},\ s,\ e,\ \ell_{s} .\mathsf{line},\ \ell_{s} .\mathsf{column},\ \ell_{e} .\mathsf{line},\ \ell_{e} .\mathsf{column}\rangle \ :\ \mathsf{SpanOk}
\end{array}
$$

**Span Construction**

$$
\begin{array}{l}
\operatorname{ClampSpan}(S,\ s,\ e)\ =\ (s',\ e') \\[0.16em]
s'\ =\ \operatorname{min}(s,\ S.\mathsf{byte}_{\mathsf{len}}) \\[0.16em]
e'\ =\ \operatorname{min}(\operatorname{max}(e,\ s'),\ S.\mathsf{byte}_{\mathsf{len}})
\end{array}
$$

**(Span-Of)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ClampSpan}(S,\ s,\ e)\ \Downarrow \ (s',\ e')\quad \Gamma \ \vdash \ \langle S.\mathsf{path},\ s',\ e',\ \mathsf{line}_{s},\ \mathsf{col}_{s},\ \mathsf{line}_{e},\ \mathsf{col}_{e}\rangle \ :\ \mathsf{SpanOk} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{SpanOf}(S,\ s,\ e)\ \Downarrow \ \langle S.\mathsf{path},\ s',\ e',\ \mathsf{line}_{s},\ \mathsf{col}_{s},\ \mathsf{line}_{e},\ \mathsf{col}_{e}\rangle 
\end{array}
$$
