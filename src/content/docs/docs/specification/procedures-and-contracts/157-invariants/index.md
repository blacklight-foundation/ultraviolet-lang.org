---
title: "15.7 Invariants"
description: "15.7 Invariants from 15. Procedures and Contracts of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "procedures-and-contracts"
specSection: "157-invariants"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/procedures-and-contracts/">15. Procedures and Contracts</a>
  <span>Procedures and Contracts</span>
</div>

## 15.7 Invariants

### 15.7.1 Syntax

```text
type_invariant ::= "|:" "{" predicate_expr "}"
loop_invariant ::= "|:" "{" predicate_expr "}"
```

### 15.7.2 Parsing

**(Parse-InvariantOpt-None)**

$$
\begin{array}{l}
\lnot \ (\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|:"})\ \land \ \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"\{"})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseInvariantOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-InvariantOpt-Yes)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|:"})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParsePredicateExpr}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ \mathsf{pred})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseInvariantOpt}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \mathsf{pred})
\end{array}
$$

$$
\operatorname{ParseLoopInvariantOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{inv}_{\mathsf{opt}})\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{ParseInvariantOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{inv}_{\mathsf{opt}})
$$

### 15.7.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{Invariant}\ =\ \mathsf{Expr} \\[0.16em]
\mathsf{invariant}_{\mathsf{opt}}\ \in \ \{\bot \}\ \cup \ \mathsf{Invariant}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{RecordDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{implements},\ \mathsf{members},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}\rangle  \\[0.16em]
\mathsf{EnumDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{implements},\ \mathsf{variants},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}\rangle  \\[0.16em]
\mathsf{ModalDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{implements},\ \mathsf{states},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}\rangle 
\end{array}
$$

Loop forms preserve `inv_opt` in their AST representation.

### 15.7.4 Static Semantics

Type invariant context:

1. `self` denotes an instance of the type being defined.
2. Field access on `self` is permitted.
3. Method calls on `self` are permitted only when the method is pure.

Type invariant enforcement points:

1. Post-construction.
2. Before any public receiver-taking procedure call.
3. Before any mutating receiver-taking procedure returns.

Types with type invariants MUST NOT declare public mutable fields.

Private procedures are exempt from the pre-call enforcement point; the invariant is rechecked when control returns to a public caller.

Loop invariant enforcement points:

1. Before the first iteration.
2. At the start of every subsequent iteration.
3. Immediately after loop termination.

Upon successful termination verification, the implementation generates a verification fact for the invariant at loop exit.

Invariant verification follows the same verification-mode rules as contracts in §15.8.

### 15.7.5 Dynamic Semantics

When runtime verification is selected, type invariants are checked at their enforcement points and loop invariants are checked at loop entry and every back-edge, including `continue` paths.

### 15.7.6 Lowering

Lowering preserves every loop `inv_opt` and emits invariant checks only through the insertion rules of §15.8.6.

### 15.7.7 Diagnostics

Diagnostics are defined for invariant predicates that are ill-formed, for types with invariants that expose public mutable fields, and for invariant obligations that fail static or dynamic verification.
