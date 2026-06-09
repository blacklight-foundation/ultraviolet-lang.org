---
title: "13.5 Modal Widening"
description: "13.5 Modal Widening from 13. Modal and Special Types of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "modal-and-special-types"
specSection: "135-modal-widening"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/modal-and-special-types/">13. Modal and Special Types</a>
  <span>Modal and Special Types</span>
</div>

## 13.5 Modal Widening

### 13.5.1 Syntax

```text
widen_expr ::= "widen" unary_expr
```

### 13.5.2 Parsing

**(Parse-Unary-Widen)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{widen})\quad \Gamma \ \vdash \ \operatorname{ParseUnary}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseUnary}(P)\ \Downarrow \ (P_{1},\ \operatorname{Unary}(\texttt{widen},\ e))
\end{array}
$$

### 13.5.3 AST Representation / Form

$$
\operatorname{ExprKind}(\operatorname{Unary}(\texttt{"widen"},\ \_))\ =\ \texttt{widen}
$$

### 13.5.4 Static Semantics

$$
\mathsf{WIDEN}_{\mathsf{LARGE}\_\mathsf{PAYLOAD}\_\mathsf{THRESHOLD}\_\mathsf{BYTES}}\ =\ 256
$$

**(T-Modal-Widen)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad S\ \in \ \operatorname{States}(M)\quad \Gamma \ \vdash \ \operatorname{WarnWidenLargePayload}(e,\ \mathsf{modal}_{\mathsf{ref}},\ S)\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \texttt{widen}\ e\ :\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})
\end{array}
$$

**(T-Modal-Widen-Perm)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypePerm}(p',\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S))\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad S\ \in \ \operatorname{States}(M)\quad \Gamma \ \vdash \ \operatorname{WarnWidenLargePayload}(e,\ \mathsf{modal}_{\mathsf{ref}},\ S)\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \texttt{widen}\ e\ :\ \operatorname{TypePerm}(p',\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}}))
\end{array}
$$

**(Widen-AlreadyGeneral)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T\quad \operatorname{StripPerm}(T)\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad c\ =\ \operatorname{Code}(\mathsf{Widen}-\mathsf{AlreadyGeneral}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \texttt{widen}\ e\ \Uparrow \ c
\end{array}
$$

**(Widen-NonModal)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T\quad \operatorname{StripPerm}(T)\ =\ U\quad U\ \ne \ \operatorname{TypeModalState}(\_,\ \_)\quad \lnot \ \exists \ \mathsf{modal}_{\mathsf{ref}},\ M.\ (U\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\ \land \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M)\quad c\ =\ \operatorname{Code}(\mathsf{Widen}-\mathsf{NonModal}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \texttt{widen}\ e\ \Uparrow \ c
\end{array}
$$

$$
\operatorname{NicheCompatible}(\mathsf{modal}_{\mathsf{ref}},\ S)\ \Leftrightarrow \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ \operatorname{NicheApplies}(\mathsf{modal}_{\mathsf{ref}})\ \land \ \operatorname{PayloadState}(\mathsf{modal}_{\mathsf{ref}})\ =\ S\ \land \ \operatorname{sizeof}(\operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S))\ =\ \operatorname{sizeof}(\operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}}))\ \land \ \operatorname{alignof}(\operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S))\ =\ \operatorname{alignof}(\operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}}))
$$

**(Chk-Subsumption-Modal-NonNiche)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ \Rightarrow \ S\ \dashv \ C\quad \operatorname{StripPerm}(S)\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S_{s})\quad \operatorname{StripPerm}(T)\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \lnot \ \operatorname{NicheCompatible}(\mathsf{modal}_{\mathsf{ref}},\ S_{s})\quad c\ =\ \operatorname{Code}(\mathsf{Chk}-\mathsf{Subsumption}-\mathsf{Modal}-\mathsf{NonNiche}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ e\ \Leftarrow \ T\ \Uparrow \ c
\end{array}
$$

$$
\operatorname{WidenWarnCond}(\mathsf{modal}_{\mathsf{ref}},\ S)\ \Leftrightarrow \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ \operatorname{sizeof}(\operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S))\ >\ \mathsf{WIDEN}_{\mathsf{LARGE}\_\mathsf{PAYLOAD}\_\mathsf{THRESHOLD}\_\mathsf{BYTES}}\ \land \ \lnot \ \operatorname{NicheCompatible}(\mathsf{modal}_{\mathsf{ref}},\ S)
$$

**(Warn-Widen-LargePayload)**

$$
\begin{array}{l}
\operatorname{WidenWarnCond}(\mathsf{modal}_{\mathsf{ref}},\ S)\quad \mathsf{sp}\ =\ \operatorname{span}(\operatorname{Unary}(\texttt{"widen"},\ e))\quad \Gamma \ \vdash \ \operatorname{Emit}(W-\mathsf{SYS}-4010,\ \mathsf{sp}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{WarnWidenLargePayload}(e,\ \mathsf{modal}_{\mathsf{ref}},\ S)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(Warn-Widen-Ok)**

$$
\begin{array}{l}
\lnot \ \operatorname{WidenWarnCond}(\mathsf{modal}_{\mathsf{ref}},\ S) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{WarnWidenLargePayload}(e,\ \mathsf{modal}_{\mathsf{ref}},\ S)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

### 13.5.5 Dynamic Semantics

$$
\operatorname{UnOp}(\texttt{"widen"},\ v)\ \Downarrow \ \operatorname{ModalVal}(S,\ v)\ \Leftrightarrow \ v\ =\ \operatorname{RecordValue}(\operatorname{ModalStateRef}(\mathsf{modal}_{\mathsf{ref}},\ S),\ \mathsf{io})
$$

### 13.5.6 Lowering

General modal values lower according to `ModalLayout(modal_ref)`. When `NicheCompatible(modal_ref, S)` holds, widening MAY be representation-preserving. Otherwise, lowering MUST materialize the tagged general-modal representation for the source state.

$$
\operatorname{sizeof}(M@S)\ \le \ \operatorname{sizeof}(M)
$$

### 13.5.7 Diagnostics

Diagnostics are defined for applying `widen` to a non-modal operand, applying `widen` to an already-general modal value, implicitly subsuming a concrete modal state to a non-niche-compatible general modal type, and widening a large non-niche payload.
