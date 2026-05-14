---
title: "2.7 Diagnostics Without Source Spans"
description: "2.7 Diagnostics Without Source Spans from 2. Diagnostic Infrastructure of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "diagnostic-infrastructure"
specSection: "27-diagnostics-without-source-spans"
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

## 2.7 Diagnostics Without Source Spans

**(NoSpan-External)**

$$
\begin{array}{l}
\operatorname{Origin}(d)\ =\ \mathsf{External} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ d.\mathsf{span}\ =\ \bot 
\end{array}
$$
