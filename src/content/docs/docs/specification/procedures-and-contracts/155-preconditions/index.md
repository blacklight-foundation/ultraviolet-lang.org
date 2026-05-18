---
title: "15.5 Preconditions"
description: "15.5 Preconditions from 15. Procedures and Contracts of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "procedures-and-contracts"
specSection: "155-preconditions"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/procedures-and-contracts/">15. Procedures and Contracts</a>
  <span>Procedures and Contracts</span>
</div>

## 15.5 Preconditions

### 15.5.1 Syntax

The precondition is the expression to the left of `=>` in a contract clause, or the entire contract expression when `=>` is absent.

### 15.5.2 Parsing

Preconditions are parsed as part of `ParseContractBody` in §15.4.2.

### 15.5.3 AST Representation / Form

$$
\begin{array}{l}
\operatorname{PreconditionOf}(\mathsf{contract}_{\mathsf{opt}})\ =\ \texttt{true}\quad \mathsf{if}\ \mathsf{contract}_{\mathsf{opt}}\ =\ \bot  \\[0.16em]
\operatorname{PreconditionOf}(\langle \mathsf{pre},\ \mathsf{post}\rangle )\ =\ \texttt{true}\quad \mathsf{if}\ \mathsf{pre}\ =\ \bot  \\[0.16em]
\operatorname{PreconditionOf}(\langle \mathsf{pre},\ \mathsf{post}\rangle )\ =\ \mathsf{pre}\quad \mathsf{if}\ \mathsf{pre}\ \ne \ \bot 
\end{array}
$$

### 15.5.4 Static Semantics

Let `S_call` be the call-site program point for the invocation being checked.
In this section, the proof context symbol `Gamma_S` denotes the active
`ProofContextAt(S_call)` defined in SS15.8.4 after actual-parameter
substitution into the callee precondition.

**(Pre-Satisfied)**

$$
\begin{array}{l}
\Gamma \ \vdash \ f\ :\ (T_{1},\ \ldots ,\ T_{n})\ \to \ R\quad \operatorname{precondition}(f)\ =\ P_{\mathsf{pre}}\quad \operatorname{StaticProofAt}(S_{\mathsf{call}},\ \Gamma_{S} ,\ P_{\mathsf{pre}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{f}(a_{1},\ \ldots ,\ a_{n})\ @\ S\ :\ \mathsf{valid}
\end{array}
$$

Elision rules:

| Contract Form      | Precondition |
| ------------------ | ------------ |
| `                  | : P`         | `P`    |
| `                  | : P => Q`    | `P`    |
| `                  | : => Q`      | `true` |
| no contract clause | `true`       |

The caller is responsible for satisfying the precondition.

### 15.5.5 Dynamic Semantics

When runtime verification is selected, the precondition is evaluated before procedure body execution and before any `@entry` capture.

### 15.5.6 Lowering

Precondition check insertion is defined by `Insert-Precondition-Check` in §15.8.6.

### 15.5.7 Diagnostics

Diagnostics for unsatisfied preconditions are attached to the call site.
