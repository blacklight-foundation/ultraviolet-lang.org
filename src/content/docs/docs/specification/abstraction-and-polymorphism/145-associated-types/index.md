---
title: "14.5 Associated Types"
description: "14.5 Associated Types from 14. Abstraction and Polymorphism of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "abstraction-and-polymorphism"
specSection: "145-associated-types"
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

## 14.5 Associated Types

### 14.5.1 Syntax

```text
associated_type ::= "type" identifier ("=" type)?
```

In class declarations, the optional `= type` introduces a default. In implementing record bodies, the optional `= type` is the bound associated type body.

### 14.5.2 Parsing

**(Parse-ClassItem-AssociatedType)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{type})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseAssocTypeOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{type}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ConsumeTerminatorReq}(P_{3})\ \Downarrow \ P_{4} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClassItem}(P)\ \Downarrow \ (P_{4},\ \langle \mathsf{AssociatedTypeDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{type}_{\mathsf{opt}},\ \operatorname{SpanBetween}(P,\ P_{4}),\ []\rangle )
\end{array}
$$

**(Parse-AssocTypeOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"="}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseAssocTypeOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-AssocTypeOpt-Yes)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"="})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{ty}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseAssocTypeOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{ty})
\end{array}
$$

**(Parse-AssocTypeDefaultOpt)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAssocTypeOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{ty}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseAssocTypeDefaultOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{ty}_{\mathsf{opt}})
\end{array}
$$

**(Parse-RecordMember-AssociatedType)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{type})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseAssocTypeDefaultOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{default}_{\mathsf{type}\_\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRecordMember}(P)\ \Downarrow \ (P_{3},\ \langle \mathsf{AssociatedTypeDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{default}_{\mathsf{type}\_\mathsf{opt}},\ \operatorname{SpanBetween}(P,\ P_{3}),\ []\rangle )
\end{array}
$$

### 14.5.3 AST Representation / Form

$$
\mathsf{AssociatedTypeDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{type}_{\mathsf{opt}\_\mathsf{or}\_\mathsf{default}\_\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}\rangle 
$$

$$
\begin{array}{l}
\mathsf{ClassItem}\ \mathbin{::} =\ \ldots \ \mid \ \mathsf{AssociatedTypeDecl} \\[0.16em]
\mathsf{RecordMember}\ \mathbin{::} =\ \ldots \ \mid \ \mathsf{AssociatedTypeDecl}
\end{array}
$$

An associated type in a class item is abstract when `type_opt = ⊥` and concrete-defaulted when `type_opt ≠ ⊥`.

$$
\begin{array}{l}
\operatorname{AssocTypeItems}(\mathsf{Cl})\ =\ [a\ \mid \ a\ \in \ \operatorname{ClassItems}(\mathsf{Cl})\ \land \ a\ \mathsf{is}\ \mathsf{AssociatedTypeDecl}] \\[0.16em]
\operatorname{AssocTypeNames}(\mathsf{Cl})\ =\ [a.\mathsf{name}\ \mid \ a\ \in \ \operatorname{AssocTypeItems}(\mathsf{Cl})]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{AssocTypeDefault}(\mathsf{Cl},\ \mathsf{name})\ =\ \mathsf{ty}\ \Leftrightarrow \ \exists \ a\ \in \ \operatorname{AssocTypeItems}(\mathsf{Cl}).\ a.\mathsf{name}\ =\ \mathsf{name}\ \land \ a.\mathsf{type}_{\mathsf{opt}\_\mathsf{or}\_\mathsf{default}\_\mathsf{opt}}\ =\ \mathsf{ty}\ \land \ \mathsf{ty}\ \ne \ \bot  \\[0.16em]
\operatorname{AssocTypeDefault}(\mathsf{Cl},\ \mathsf{name})\ =\ \bot \ \Leftrightarrow \ \lnot \ \exists \ \mathsf{ty}.\ \operatorname{AssocTypeDefault}(\mathsf{Cl},\ \mathsf{name})\ =\ \mathsf{ty}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ImplAssocType}(\operatorname{TypePath}(p),\ \mathsf{name})\ =\ \mathsf{ty}\ \Leftrightarrow \ \operatorname{RecordDecl}(p)\ =\ R\ \land \ \exists \ a\ \in \ R.\mathsf{members}.\ a\ \mathsf{is}\ \mathsf{AssociatedTypeDecl}\ \land \ a.\mathsf{name}\ =\ \mathsf{name}\ \land \ a.\mathsf{type}_{\mathsf{opt}\_\mathsf{or}\_\mathsf{default}\_\mathsf{opt}}\ =\ \mathsf{ty}\ \land \ \mathsf{ty}\ \ne \ \bot  \\[0.16em]
\operatorname{ImplAssocType}(T,\ \mathsf{name})\ =\ \bot \ \Leftrightarrow \ \lnot \ \exists \ \mathsf{ty}.\ \operatorname{ImplAssocType}(T,\ \mathsf{name})\ =\ \mathsf{ty}
\end{array}
$$

$$
\operatorname{A_abs}(\mathsf{Cl})\ =\ \{\ \mathsf{name}\ \mid \ \mathsf{name}\ \in \ \operatorname{AssocTypeNames}(\mathsf{Cl})\ \land \ \operatorname{AssocTypeDefault}(\mathsf{Cl},\ \mathsf{name})\ =\ \bot \ \}
$$

$$
\begin{array}{l}
\operatorname{AssocTypeBinding}(T,\ \mathsf{Cl},\ \mathsf{name})\ =\ \mathsf{ty}\ \Leftrightarrow \ \operatorname{ImplAssocType}(T,\ \mathsf{name})\ =\ \mathsf{ty} \\[0.16em]
\operatorname{AssocTypeBinding}(T,\ \mathsf{Cl},\ \mathsf{name})\ =\ \mathsf{ty}\ \Leftrightarrow \ \operatorname{ImplAssocType}(T,\ \mathsf{name})\ =\ \bot \ \land \ \operatorname{AssocTypeDefault}(\Sigma .\mathsf{Classes}[\mathsf{Cl}],\ \mathsf{name})\ =\ \mathsf{ty} \\[0.16em]
\operatorname{AssocTypeBinding}(T,\ \mathsf{Cl},\ \mathsf{name})\ =\ \bot \ \Leftrightarrow \ \operatorname{ImplAssocType}(T,\ \mathsf{name})\ =\ \bot \ \land \ \operatorname{AssocTypeDefault}(\Sigma .\mathsf{Classes}[\mathsf{Cl}],\ \mathsf{name})\ =\ \bot 
\end{array}
$$

$$
T\ \mathsf{binds}\ \mathsf{name}\ \mathsf{for}\ \mathsf{Cl}\ \Leftrightarrow \ \operatorname{AssocTypeBinding}(T,\ \mathsf{Cl},\ \mathsf{name})\ \ne \ \bot 
$$

### 14.5.4 Static Semantics

Generic class parameters are supplied at use sites. Associated types are supplied by the implementing declaration body.

An abstract associated type in a class must be bound by every implementation of that class. A default associated type in a class may be used when the implementing type does not provide an overriding binding.

$$
\mathsf{In}\ a\ \mathsf{concrete}\ \mathsf{implementing}\ \mathsf{declaration}\ \mathsf{body},\ \mathsf{an}\ \mathsf{associated}-\mathsf{type}\ \mathsf{member}\ \mathsf{is}\ \mathsf{well}-\mathsf{formed}\ \mathsf{only}\ \mathsf{in}\ \mathsf{the}\ \mathsf{bound}\ \mathsf{form}\ \texttt{type Name = Bound}.
$$

Associated-type lookup order is:

1. implementation binding from the implementing declaration body;
2. class default from the referenced class;
3. missing binding.

**Class Alias Equivalence (T-Alias-Equiv)**
type Alias = A + B

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathrel{<:} \ \mathsf{Alias}\ \Leftrightarrow \ \Gamma \ \vdash \ T\ \mathrel{<:} \ A\ \land \ \Gamma \ \vdash \ T\ \mathrel{<:} \ B
\end{array}
$$

### 14.5.5 Dynamic Semantics

Associated types are compile-time declarations only. They introduce no runtime values and no abstract-machine transitions.

### 14.5.6 Lowering

Associated types are erased during type elaboration. No feature-specific runtime representation or ABI form is introduced.

### 14.5.7 Diagnostics

Diagnostics are defined for duplicate associated-type names within a class and for implementations that fail to bind required abstract associated types.
