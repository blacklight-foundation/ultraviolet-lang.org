---
title: "10.2 Alias and Exclusivity Rules"
description: "10.2 Alias and Exclusivity Rules from 10. Permissions and Binding State of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "permissions-and-binding-state"
specSection: "102-alias-and-exclusivity-rules"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/permissions-and-binding-state/">10. Permissions and Binding State</a>
  <span>Permissions and Binding State</span>
</div>

## 10.2 Alias and Exclusivity Rules

### 10.2.1 Syntax

This section introduces no additional concrete syntax.

### 10.2.2 Parsing

This section introduces no additional parsing rules.

### 10.2.3 AST Representation / Form

This section introduces no additional AST forms beyond permission-qualified types and place/path forms defined elsewhere.

### 10.2.4 Static Semantics

**Aliasing.** Two paths alias when they refer to overlapping storage locations:

$$
\operatorname{aliases}(p_{1},\ p_{2})\ \Leftrightarrow \ \operatorname{storage}(p_{1})\ \cap \ \operatorname{storage}(p_{2})\ \ne \ \emptyset 
$$

**Exclusivity Invariant.**

$$
\forall \ p_{1},\ p_{2}\ \in \ \mathsf{Paths}.\ (\operatorname{perm}(p_{1})\ =\ \texttt{unique}\ \land \ \operatorname{overlaps}(p_{1},\ p_{2}))\ \Rightarrow \ p_{1}\ =\ p_{2}
$$

**Coexistence Matrix**

| Existing Permission | May Add `unique` | May Add `shared` | May Add `const` |
| :------------------ | :--------------- | :--------------- | :-------------- |
| `unique`            | No               | No               | No              |
| `shared`            | No               | Yes              | Yes             |
| `const`             | No               | No               | Yes             |

### 10.2.5 Dynamic Semantics

This section introduces no additional runtime mechanism beyond the key-mediated synchronization required for `shared` accesses and the scope-based binding activity rules in §10.3.

### 10.2.6 Lowering

This section introduces no lowering rules beyond the permission-qualified layout and ABI rules in §10.1.6.

### 10.2.7 Diagnostics

Violations of these rules are diagnosed by the consuming typing and use-site rules. This section introduces no standalone diagnostic table.
