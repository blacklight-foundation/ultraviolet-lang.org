---
title: "14.4 Implementations"
description: "14.4 Implementations from 14. Abstraction and Polymorphism of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "abstraction-and-polymorphism"
specSection: "144-implementations"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/abstraction-and-polymorphism/">14. Abstraction and Polymorphism</a>
  <span>Abstraction and Polymorphism</span>
</div>

## 14.4 Implementations

### 14.4.1 Syntax

```text
implements_clause ::= "<:" class_path ("," class_path)*
override_method   ::= visibility? "override"? "procedure" identifier signature contract_clause? block
```

Class implementation occurs at the defining record, enum, or modal declaration. Standalone extension implementation blocks are not part of the language.

### 14.4.2 Parsing

**(Parse-Implements-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"<:"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseImplementsOpt}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-Implements-Yes)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"<:"})\quad \Gamma \ \vdash \ \operatorname{ParseClassList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{cls}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseImplementsOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{cls})
\end{array}
$$

**(Parse-ClassList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseClassPath}(P)\ \Downarrow \ (P_{1},\ c_{0})\quad \Gamma \ \vdash \ \operatorname{ParseClassListTail}(P_{1},\ [c_{0}])\ \Downarrow \ (P_{2},\ \mathsf{cs}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClassList}(P)\ \Downarrow \ (P_{2},\ \mathsf{cs})
\end{array}
$$

**(Parse-ClassListTail-End)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClassListTail}(P,\ \mathsf{cs})\ \Downarrow \ (P,\ \mathsf{cs})
\end{array}
$$

**(Parse-ClassListTail-Comma)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParseClassPath}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ c)\quad \Gamma \ \vdash \ \operatorname{ParseClassListTail}(P_{1},\ \mathsf{cs}\ \mathbin{++} \ [c])\ \Downarrow \ (P_{2},\ \mathsf{cs}') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClassListTail}(P,\ \mathsf{cs})\ \Downarrow \ (P_{2},\ \mathsf{cs}')
\end{array}
$$

### 14.4.3 AST Representation / Form

$$
\operatorname{Implements}(T)\ =\ \mathsf{impls}\ \Leftrightarrow \ T\ =\ \operatorname{RecordDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \mathsf{impls},\ \_,\ \_,\ \_,\ \_)\ \lor \ T\ =\ \operatorname{EnumDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \mathsf{impls},\ \_,\ \_,\ \_,\ \_)\ \lor \ T\ =\ \operatorname{ModalDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \mathsf{impls},\ \_,\ \_,\ \_,\ \_)
$$

The surface operator `<:` is overloaded.

1. For records, enums, and modals, `<:` is represented by membership in `Implements(T)`.
2. For classes, `<:` is represented by `Supers(Cl)` together with the superclass rules of §14.3.4.

This section owns only the concrete-implementer relation for records, enums, and modals. Class superclass clauses are not re-encoded as implementation lists here.

$$
\begin{array}{l}
\operatorname{Fields}(T)\ =\ \operatorname{Fields}(R)\ \Leftrightarrow \ T\ =\ \operatorname{TypePath}(p)\ \land \ \operatorname{RecordDecl}(p)\ =\ R \\[0.16em]
\operatorname{Fields}(T)\ =\ []\ \Leftrightarrow \ (T\ =\ \operatorname{TypePath}(p)\ \land \ \operatorname{EnumDecl}(p)\ =\ E)\ \lor \ (T\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}}))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Methods}(T)\ =\ \operatorname{Methods}(R)\ \Leftrightarrow \ T\ =\ \operatorname{TypePath}(p)\ \land \ \operatorname{RecordDecl}(p)\ =\ R \\[0.16em]
\operatorname{Methods}(T)\ =\ []\ \Leftrightarrow \ (T\ =\ \operatorname{TypePath}(p)\ \land \ \operatorname{EnumDecl}(p)\ =\ E)\ \lor \ (T\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}}))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{MethodByName}(T,\ \mathsf{name})\ =\ m'\ \Leftrightarrow \ m'\ \in \ \operatorname{Methods}(T)\ \land \ m'.\mathsf{name}\ =\ \mathsf{name} \\[0.16em]
\operatorname{MethodByName}(T,\ \mathsf{name})\ =\ \bot \ \Leftrightarrow \ \lnot \ \exists \ m'\ \in \ \operatorname{Methods}(T).\ m'.\mathsf{name}\ =\ \mathsf{name}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ClassMethodTable}(\mathsf{Cl})\ =\ \operatorname{EffMethods}(\mathsf{Cl}) \\[0.16em]
\operatorname{ClassFieldTable}(\mathsf{Cl})\ =\ \operatorname{EffFields}(\mathsf{Cl})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ImplModule}(T)\ =\ \operatorname{ModuleOf}(T) \\[0.16em]
\operatorname{ClassModule}(\mathsf{Cl})\ =\ \operatorname{ModuleOf}(\Sigma .\mathsf{Classes}[\mathsf{Cl}])\quad \mathsf{if}\ \mathsf{Cl}\ \in \ \operatorname{dom}(\Sigma .\mathsf{Classes}) \\[0.16em]
\operatorname{ImplOrphanOk}(T,\ \mathsf{Cl})\ \Leftrightarrow \ \operatorname{SameAssembly}(\operatorname{ImplModule}(T),\ \operatorname{CurrentModule}(\Gamma ))\ \lor \ (\mathsf{Cl}\ \in \ \operatorname{dom}(\Sigma .\mathsf{Classes})\ \land \ \operatorname{SameAssembly}(\operatorname{ClassModule}(\mathsf{Cl}),\ \operatorname{CurrentModule}(\Gamma )))
\end{array}
$$

### 14.4.4 Static Semantics

$$
\begin{array}{l}
\operatorname{NoDefaultMethods}(\mathsf{Cl})\ \Leftrightarrow \ \forall \ m\ \in \ \operatorname{ClassMethods}(\mathsf{Cl}).\ m.\mathsf{body}\ =\ \bot  \\[0.16em]
\operatorname{AbstractsImplemented}(T)\ \Leftrightarrow \ \forall \ \mathsf{Cl}\ \in \ \operatorname{Implements}(T).\ \forall \ m\ \in \ \operatorname{ClassMethodTable}(\mathsf{Cl}).\ (m.\mathsf{body}\ =\ \bot \ \Rightarrow \ \operatorname{MethodByName}(T,\ m.\mathsf{name})\ \ne \ \bot )
\end{array}
$$

**(Impl-Abstract-Method)**

$$
\begin{array}{l}
m\ \in \ \operatorname{ClassMethodTable}(\mathsf{Cl})\quad m.\mathsf{body}\ =\ \bot \quad \operatorname{MethodByName}(T,\ m.\mathsf{name})\ =\ m'\quad \operatorname{SigMatch}(T,\ m',\ m)\quad m'.\mathsf{override}\ =\ \mathsf{false} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{implements}\ \mathsf{abstract}\ m
\end{array}
$$

**(Impl-Missing-Method)**

$$
\begin{array}{l}
m\ \in \ \operatorname{ClassMethodTable}(\mathsf{Cl})\quad m.\mathsf{body}\ =\ \bot \quad \operatorname{MethodByName}(T,\ m.\mathsf{name})\ =\ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{ImplementsOk}\ \Uparrow 
\end{array}
$$

**(Impl-AssocType-Missing)**

$$
\begin{array}{l}
a\ \in \ \operatorname{A_abs}(\mathsf{Cl})\quad \lnot (T\ \mathsf{binds}\ a\ \mathsf{for}\ \mathsf{Cl}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{ImplementsOk}\ \Uparrow 
\end{array}
$$

**(Impl-Sig-Err)**

$$
\begin{array}{l}
m\ \in \ \operatorname{ClassMethodTable}(\mathsf{Cl})\quad m.\mathsf{body}\ =\ \bot \quad \operatorname{MethodByName}(T,\ m.\mathsf{name})\ =\ m'\quad \lnot \ \operatorname{SigMatch}(T,\ m',\ m) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{ImplementsOk}\ \Uparrow 
\end{array}
$$

**(Override-Abstract-Err)**

$$
\begin{array}{l}
m\ \in \ \operatorname{ClassMethodTable}(\mathsf{Cl})\quad m.\mathsf{body}\ =\ \bot \quad \operatorname{MethodByName}(T,\ m.\mathsf{name})\ =\ m'\quad \operatorname{SigMatch}(T,\ m',\ m)\quad m'.\mathsf{override}\ =\ \mathsf{true} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{ImplementsOk}\ \Uparrow 
\end{array}
$$

**(Impl-Concrete-Default)**

$$
\begin{array}{l}
m\ \in \ \operatorname{ClassMethodTable}(\mathsf{Cl})\quad m.\mathsf{body}\ \ne \ \bot \quad \operatorname{MethodByName}(T,\ m.\mathsf{name})\ =\ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{uses}\ \mathsf{default}\ m
\end{array}
$$

**(Impl-Concrete-Override)**

$$
\begin{array}{l}
m\ \in \ \operatorname{ClassMethodTable}(\mathsf{Cl})\quad m.\mathsf{body}\ \ne \ \bot \quad \operatorname{MethodByName}(T,\ m.\mathsf{name})\ =\ m'\quad \operatorname{SigMatch}(T,\ m',\ m)\quad m'.\mathsf{override}\ =\ \mathsf{true} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{overrides}\ m
\end{array}
$$

**(Override-Missing-Err)**

$$
\begin{array}{l}
m\ \in \ \operatorname{ClassMethodTable}(\mathsf{Cl})\quad m.\mathsf{body}\ \ne \ \bot \quad \operatorname{MethodByName}(T,\ m.\mathsf{name})\ =\ m'\quad \operatorname{SigMatch}(T,\ m',\ m)\quad m'.\mathsf{override}\ =\ \mathsf{false} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{ImplementsOk}\ \Uparrow 
\end{array}
$$

**(Impl-Sig-Err-Concrete)**

$$
\begin{array}{l}
m\ \in \ \operatorname{ClassMethodTable}(\mathsf{Cl})\quad m.\mathsf{body}\ \ne \ \bot \quad \operatorname{MethodByName}(T,\ m.\mathsf{name})\ =\ m'\quad \lnot \ \operatorname{SigMatch}(T,\ m',\ m) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{ImplementsOk}\ \Uparrow 
\end{array}
$$

**(Override-NoConcrete)**

$$
\begin{array}{l}
m'\ \in \ \operatorname{Methods}(T)\quad m'.\mathsf{override}\ =\ \mathsf{true}\quad \lnot \ \exists \ \mathsf{Cl}\ \in \ \operatorname{Implements}(T).\ \exists \ m\ \in \ \operatorname{ClassMethodTable}(\mathsf{Cl}).\ m.\mathsf{name}\ =\ m'.\mathsf{name}\ \land \ m.\mathsf{body}\ \ne \ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{ImplementsOk}\ \Uparrow 
\end{array}
$$

**(Impl-Field)**

$$
\begin{array}{l}
f\ :\ T_{c}\ \in \ \operatorname{ClassFieldTable}(\mathsf{Cl})\quad f\ :\ T_{i}\ \in \ \operatorname{Fields}(T)\quad T_{i}\ \mathrel{<:} \ T_{c} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{satisfies}\ \mathsf{field}\ f
\end{array}
$$

**(Impl-Field-Missing)**

$$
\begin{array}{l}
f\ :\ T_{c}\ \in \ \operatorname{ClassFieldTable}(\mathsf{Cl})\quad \lnot \ \exists \ T_{i}.\ f\ :\ T_{i}\ \in \ \operatorname{Fields}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{ImplementsOk}\ \Uparrow 
\end{array}
$$

**(Impl-Field-Type-Err)**

$$
\begin{array}{l}
f\ :\ T_{c}\ \in \ \operatorname{ClassFieldTable}(\mathsf{Cl})\quad f\ :\ T_{i}\ \in \ \operatorname{Fields}(T)\quad \lnot (\Gamma \ \vdash \ T_{i}\ \mathrel{<:} \ T_{c}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{ImplementsOk}\ \Uparrow 
\end{array}
$$

**(Impl-Coherence-Err)**

$$
\begin{array}{l}
\lnot \ \operatorname{Distinct}(\operatorname{Implements}(T)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{ImplementsOk}\ \Uparrow 
\end{array}
$$

**(Impl-Orphan-Err)**

$$
\begin{array}{l}
\mathsf{Cl}\ \in \ \operatorname{Implements}(T)\quad \lnot \ \operatorname{ImplOrphanOk}(T,\ \mathsf{Cl}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{ImplementsOk}\ \Uparrow 
\end{array}
$$

**(WF-Impl)**

$$
\begin{array}{l}
\forall \ \mathsf{Cl}\ \in \ \operatorname{Implements}(T),\ \Gamma \ \vdash \ \mathsf{Cl}\ :\ \mathsf{ClassOk}\quad \operatorname{Distinct}(\operatorname{Implements}(T))\quad \forall \ \mathsf{Cl}\ \in \ \operatorname{Implements}(T),\ \operatorname{ImplOrphanOk}(T,\ \mathsf{Cl})\quad \Gamma \ \vdash \ T\ :\ \mathsf{BitcopyDropOk}\quad \forall \ \mathsf{Cl}\ \in \ \operatorname{Implements}(T),\ \forall \ m\ \in \ \operatorname{ClassMethodTable}(\mathsf{Cl}),\ (\Gamma \ \vdash \ T\ \mathsf{implements}\ \mathsf{abstract}\ m\ \lor \ \Gamma \ \vdash \ T\ \mathsf{overrides}\ m\ \lor \ \Gamma \ \vdash \ T\ \mathsf{uses}\ \mathsf{default}\ m)\quad \forall \ \mathsf{Cl}\ \in \ \operatorname{Implements}(T),\ \forall \ f\ \in \ \operatorname{ClassFieldTable}(\mathsf{Cl}),\ \Gamma \ \vdash \ T\ \mathsf{satisfies}\ \mathsf{field}\ f \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{ImplementsOk}
\end{array}
$$

$$
\Gamma \ \vdash \ T\ \mathrel{<:} \ \mathsf{Cl}\ \Leftrightarrow \ \mathsf{Cl}\ \in \ \operatorname{Implements}(T)\ \land \ \Gamma \ \vdash \ T\ :\ \mathsf{ImplementsOk}
$$

A class with abstract states may be implemented only by a modal type.
A type MUST NOT implement the same class more than once.
For every implementation `T <: Cl`, at least one of the implementing declaration `T` or the referenced class `Cl` MUST be defined in the current assembly.

### 14.4.5 Dynamic Semantics

Implementations do not add new runtime state beyond the concrete methods and fields already present on the implementing type. Default-method selection and dynamic dispatch are defined in §14.6.

### 14.4.6 Lowering

Implementation-specific bodies lower exactly as concrete methods on the implementing type. When a required method is satisfied by a class default, lowering reuses the default implementation body as the dispatch target for that `(type, class, method)` triple.

### 14.4.7 Diagnostics

Diagnostics are defined for duplicate implemented classes on a declaration, missing required methods, incompatible method signatures, missing associated-type bindings, misuse of `override`, missing required fields, incompatible field types, and non-modal types attempting to implement modal classes.
