---
title: "5.1 Parsing Inputs, Outputs, and Invariants"
description: "5.1 Parsing Inputs, Outputs, and Invariants from 5. Parsing and AST Infrastructure of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "parsing-and-ast-infrastructure"
specSection: "51-parsing-inputs-outputs-and-invariants"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/parsing-and-ast-infrastructure/">5. Parsing and AST Infrastructure</a>
  <span>Parsing and AST Infrastructure</span>
</div>

## 5.1 Parsing Inputs, Outputs, and Invariants

$$
\begin{array}{l}
\operatorname{ParseInputs}(S,\ K_{\mathsf{raw}},\ D,\ K)\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{Tokenize}(S)\ \Downarrow \ (K_{\mathsf{raw}},\ D)\ \land \ K\ =\ \operatorname{Filter}(K_{\mathsf{raw}}) \\[0.16em]
\operatorname{ParseOutputs}(S,\ F)\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{ParseFile}(S)\ \Downarrow \ F
\end{array}
$$

**Parsing Phase Invariants.**

**(Phase1-File)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseFile}(S)\ \Downarrow \ F \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePhase}(S)\ \Downarrow \ F
\end{array}
$$

**(Phase1-Forward-Refs)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePhase}(S)\ \Downarrow \ \mathsf{NoResolutionConstraints}
\end{array}
$$

Construct-specific `ParseItem`, `ParseExpr`, `ParsePattern`, `ParseType`, and `ParseStmt` rules are defined by the owning feature chapters. `ParseModule` and `ParseModules` are defined by §11.5.4.
