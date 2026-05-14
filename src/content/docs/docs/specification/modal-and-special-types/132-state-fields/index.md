---
title: "13.2 State Fields"
description: "13.2 State Fields from 13. Modal and Special Types of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "modal-and-special-types"
specSection: "132-state-fields"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/modal-and-special-types/">13. Modal and Special Types</a>
  <span>Modal and Special Types</span>
</div>

## 13.2 State Fields

### 13.2.1 Syntax

```text
state_field_decl ::= attribute_list? visibility? key_boundary? identifier ":" type
```

### 13.2.2 Parsing

**(Parse-StateMember-Field)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \Gamma \ \vdash \ \operatorname{ParseKeyBoundaryOpt}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{boundary})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{name})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{3}),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P_{3}))\ \Downarrow \ (P_{4},\ \mathsf{ty}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStateMember}(P)\ \Downarrow \ (P_{4},\ \langle \mathsf{StateFieldDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{name},\ \mathsf{ty},\ \operatorname{SpanBetween}(P,\ P_{4}),\ []\rangle )
\end{array}
$$

### 13.2.3 AST Representation / Form

$$
\mathsf{StateFieldDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{name},\ \mathsf{type},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}\rangle 
$$

$$
\begin{array}{l}
\operatorname{PayloadNames}(M,\ S)\ =\ [\ f\ \mid \ \langle f,\ \_\rangle \ \in \ \operatorname{Payload}(M,\ S)\ ] \\[0.16em]
\operatorname{PayloadNameSet}(M,\ S)\ =\ \operatorname{Set}(\operatorname{PayloadNames}(M,\ S))
\end{array}
$$

### 13.2.4 Static Semantics

$$
\operatorname{ModalFieldVisible}(m,\ \mathsf{modal}_{\mathsf{ref}})\ \Leftrightarrow \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\ \land \ \operatorname{ModuleOfPath}(\operatorname{ModalPath}(M))\ =\ m
$$

**(T-Modal-Field)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \operatorname{ModalPayloadMap}(\mathsf{modal}_{\mathsf{ref}},\ S)(f)\ =\ T\quad \operatorname{ModalFieldVisible}(m,\ \mathsf{modal}_{\mathsf{ref}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ e.f\ :\ T
\end{array}
$$

**(T-Modal-Field-Perm)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypePerm}(p',\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S))\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \operatorname{ModalPayloadMap}(\mathsf{modal}_{\mathsf{ref}},\ S)(f)\ =\ T\quad \operatorname{ModalFieldVisible}(m,\ \mathsf{modal}_{\mathsf{ref}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ e.f\ :\ \operatorname{TypePerm}(p',\ T)
\end{array}
$$

**(Modal-Field-Missing)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \operatorname{ModalPayloadMap}(\mathsf{modal}_{\mathsf{ref}},\ S)(f)\ \mathsf{undefined}\quad c\ =\ \operatorname{Code}(\mathsf{Modal}-\mathsf{Field}-\mathsf{Missing}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ e.f\ \Uparrow \ c
\end{array}
$$

**(Modal-Field-General-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T\quad \operatorname{StripPerm}(T)\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad c\ =\ \operatorname{Code}(\mathsf{Modal}-\mathsf{Field}-\mathsf{General}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ e.f\ \Uparrow \ c
\end{array}
$$

**(Modal-Field-NotVisible)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \operatorname{ModalPayloadMap}(\mathsf{modal}_{\mathsf{ref}},\ S)(f)\ =\ T\quad \lnot \ \operatorname{ModalFieldVisible}(m,\ \mathsf{modal}_{\mathsf{ref}})\quad c\ =\ \operatorname{Code}(\mathsf{Modal}-\mathsf{Field}-\mathsf{NotVisible}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ e.f\ \Uparrow \ c
\end{array}
$$

### 13.2.5 Dynamic Semantics

State-field access on `TypeModalState(modal_ref, S)` reuses ordinary record-field evaluation over the concrete runtime value `RecordValue(ModalStateRef(modal_ref, S), fs)`. No additional abstract-machine rule is introduced for successful access beyond the shared `FieldAccess` rules.

### 13.2.6 Lowering

State-field reads and writes lower exactly as record-payload field accesses over the current state's payload layout. No modal-specific field-access lowering is introduced beyond the general place and field lowering rules.

### 13.2.7 Diagnostics

Diagnostics are defined for missing state fields, field access on a general modal value without first refining to a state, and access to a state field outside the declaring modal's module. Duplicate field names within a single state payload are defined by §13.1.4.
