---
title: "14.7 Opaque Types"
description: "14.7 Opaque Types from 14. Abstraction and Polymorphism of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "abstraction-and-polymorphism"
specSection: "147-opaque-types"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/abstraction-and-polymorphism/">14. Abstraction and Polymorphism</a>
  <span>Abstraction and Polymorphism</span>
</div>

## 14.7 Opaque Types

### 14.7.1 Syntax

```text
opaque_type ::= "opaque" class_path
```

Opaque types are type forms and therefore compose with the ordinary declaration and return-type syntactic positions that accept `type`.

### 14.7.2 Parsing

**(Parse-Opaque-Type)**

$$
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \operatorname{Lexeme}(\operatorname{Tok}(P))\ =\ \texttt{opaque}\quad \Gamma \ \vdash \ \operatorname{ParseTypePath}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{path}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseNonPermType}(P)\ \Downarrow \ (P_{1},\ \operatorname{TypeOpaque}(\mathsf{path}))
\end{array}
$$

### 14.7.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{Type}\ =\ \operatorname{TypeOpaque}(\mathsf{path})\ \mid \ \ldots \\[0.16em]
\mathsf{TypeOpaque}\ =\ \langle \mathsf{path}\rangle
\end{array}
$$

### 14.7.4 Static Semantics

**(WF-Opaque)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeOpaque}(\mathsf{path})\quad \mathsf{path}\ \in \ \operatorname{dom}(\Sigma .\mathsf{Classes}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}
\end{array}
$$

**(WF-Opaque-Err)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeOpaque}(\mathsf{path})\quad \mathsf{path}\ \notin \ \operatorname{dom}(\Sigma .\mathsf{Classes}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}\ \Uparrow
\end{array}
$$

Rule **(T-Equiv-Opaque)** is defined once by §8.1.

**(T-Opaque-Return)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \mathsf{body}\ :\ T\quad \Gamma \ \vdash \ T\ \mathrel{<:} \ \mathsf{Cl}\quad \operatorname{return_type}(f)\ =\ \mathsf{opaque}\ \mathsf{Cl} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ f\ :\ ()\ \to \ \mathsf{opaque}\ \mathsf{Cl}
\end{array}
$$

**(T-Opaque-Project)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{f}()\ :\ \mathsf{opaque}\ \mathsf{Cl}\quad m\ \in \ \operatorname{interface}(\mathsf{Cl}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{f}()\sim{}>\operatorname{m}(\mathsf{args})\ :\ R_{m}
\end{array}
$$

Two opaque types are equivalent exactly when they name the same class path. Opaque values expose only the class interface named by that path.

### 14.7.5 Dynamic Semantics

Opaque types add no runtime wrapper. The callee returns a concrete value implementing the named class, and the caller observes that value only through the statically-restricted opaque interface.

### 14.7.6 Lowering

Opaque types incur no distinct runtime representation or ABI form. Lowering uses the underlying concrete type chosen by the defining body.

### 14.7.7 Diagnostics

Diagnostics are defined for opaque types naming undefined classes, member access outside the named class interface, and assignment or matching between opaque types with incompatible class paths.
