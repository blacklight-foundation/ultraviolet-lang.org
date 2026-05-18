---
title: "14.8 Refinement Types"
description: "14.8 Refinement Types from 14. Abstraction and Polymorphism of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "abstraction-and-polymorphism"
specSection: "148-refinement-types"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/abstraction-and-polymorphism/">14. Abstraction and Polymorphism</a>
  <span>Abstraction and Polymorphism</span>
</div>

## 14.8 Refinement Types

### 14.8.1 Syntax

```text
refinement_type       ::= type "|:" "{" predicate_expr "}"
type_alias_decl       ::= visibility? "type" identifier "=" type "|:" "{" predicate_expr "}"
param_with_constraint ::= identifier ":" type "|:" "{" predicate_expr "}"
```

Within a standalone refinement type, `self` denotes the constrained value.

### 14.8.2 Parsing

**(Parse-RefinementOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|:"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRefinementOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-RefinementOpt-Yes)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|:"})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParsePredicateExpr}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ \mathsf{pred})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRefinementOpt}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \mathsf{pred})
\end{array}
$$

$$
\operatorname{ParsePredicateExpr}(P)\ \Downarrow \ (P_{1},\ e)\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{ParseExpr}(P)\ \Downarrow \ (P_{1},\ e)
$$

### 14.8.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{Type}\ =\ \operatorname{TypeRefine}(\mathsf{base},\ \mathsf{pred})\ \mid \ \ldots  \\[0.16em]
\mathsf{TypeRefine}\ =\ \langle \mathsf{base},\ \mathsf{pred}\rangle 
\end{array}
$$

$$
\operatorname{PredicateEquiv}(P_{1},\ P_{2})\ \Leftrightarrow \ \forall \ \sigma .\ (\operatorname{Eval}(P_{1},\ \sigma )\ =\ \mathsf{true}\ \Leftrightarrow \ \operatorname{Eval}(P_{2},\ \sigma )\ =\ \mathsf{true})
$$

### 14.8.4 Static Semantics

**(T-Equiv-Refine)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRefine}(T_{0},\ P_{1})\quad U\ =\ \operatorname{TypeRefine}(U_{0},\ P_{2})\quad \Gamma \ \vdash \ T_{0}\ \equiv \ U_{0}\quad \operatorname{PredicateEquiv}(P_{1},\ P_{2}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Equiv-Refine-Norm)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRefine}(\operatorname{TypeRefine}(T_{0},\ P_{1}),\ P_{2})\quad U\ =\ \operatorname{TypeRefine}(T_{0},\ P_{1}\ \land \ P_{2}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(WF-Refine-Type)**

$$
\begin{array}{l}
\Gamma \ \vdash \ T\ \mathsf{wf}\quad \Gamma ,\ \texttt{self}\ :\ T\ \vdash \ P\ :\ \texttt{bool}\quad \operatorname{Pure}(P) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ (T\ \mid :\ \{P\})\ \mathsf{wf}
\end{array}
$$

**(T-Refine-Intro)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ :\ T\quad \Gamma \ \vdash \ \operatorname{F}(P[e/\texttt{self}],\ L)\quad L\ \mathsf{dominates}\ \mathsf{current}\ \mathsf{location} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ e\ :\ T\ \mid :\ \{P\}
\end{array}
$$

**(T-Refine-Elim)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ :\ T\ \mid :\ \{P\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ e\ :\ T
\end{array}
$$

Subtyping relations:

$$
\Gamma \ \vdash \ (T\ \mid :\ \{P\})\ \mathrel{<:} \ T
$$

$$
\begin{array}{l}
\Gamma \ \vdash \ P\ \Rightarrow \ Q \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ (T\ \mid :\ \{P\})\ \mathrel{<:} \ (T\ \mid :\ \{Q\})
\end{array}
$$

Implementations MUST support the following decidable predicate fragment: literal comparisons, bound propagation from control flow, syntactic equality up to alpha-renaming, transitive integer inequalities, and boolean combinations thereof.

Refinement predicates are statically verified by default. If proof fails outside `[[dynamic]]`, the program is ill-formed. If proof fails inside `[[dynamic]]`, lowering inserts a runtime check.

### 14.8.5 Dynamic Semantics

Refinement types do not alter the underlying value representation. Failed dynamically-inserted refinement checks panic.

### 14.8.6 Lowering

**(LLVMTy-Refine)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMTy}(\operatorname{TypeRefine}(T,\ P))\ \Downarrow \ \tau 
\end{array}
$$

Feature-local lowering consists only of optional runtime predicate checks when static verification is not discharged inside `[[dynamic]]` scopes.

### 14.8.7 Diagnostics

Diagnostics are defined for ill-formed or impure refinement predicates, failed static proof obligations for refinement introduction, and failing dynamic refinement checks.
