---
title: "10.3 Binding Activity States"
description: "10.3 Binding Activity States from 10. Permissions and Binding State of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "permissions-and-binding-state"
specSection: "103-binding-activity-states"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/permissions-and-binding-state/">10. Permissions and Binding State</a>
  <span>Permissions and Binding State</span>
</div>

## 10.3 Binding Activity States

### 10.3.1 Syntax

This section introduces no additional concrete syntax.

### 10.3.2 Parsing

This section introduces no additional parsing rules.

### 10.3.3 AST Representation / Form

Binding activity state is a semantic state machine over bindings; it has no dedicated AST node.

### 10.3.4 Static Semantics

A binding `b` with `unique` permission exists in one of two states:

| State    | Definition                                              | Operations Permitted        |
| :------- | :------------------------------------------------------ | :-------------------------- |
| Active   | No suspended admissible uses of `b` are live            | Read, write, move           |
| Inactive | A non-consuming admissible use of `b` is currently live | No direct operations on `b` |

**(Inactive-Enter)**
b : `unique` T    b is Active    non-consuming admissible use of b begins

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
b\ \mathsf{becomes}\ \mathsf{Inactive}
\end{array}
$$

**(Inactive-Exit)**
b is Inactive    all live non-consuming admissible uses of b end

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
b\ \mathsf{becomes}\ \mathsf{Active}\ \mathsf{with}\ \texttt{unique}\ \mathsf{permission}\ \mathsf{preserved}
\end{array}
$$

### 10.3.5 Dynamic Semantics

During the inactive period, the original `unique` binding MUST NOT be read, written, or moved.

Entering or exiting the inactive state does not create a `shared` or `const` alias. It suspends direct use of the `unique` binding while the admissible use remains live.

The transition back to `Active` occurs deterministically when the admissible-use scope ends.

### 10.3.6 Lowering

This section introduces no feature-local lowering. Binding activity is enforced by the static semantics and by the evaluation contexts that consume those judgments.

### 10.3.7 Diagnostics

Violations of binding activity constraints are diagnosed by the consuming typing rules. This section introduces no standalone diagnostic table.
