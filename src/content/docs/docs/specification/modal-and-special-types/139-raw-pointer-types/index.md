---
title: "13.9 Raw Pointer Types"
description: "13.9 Raw Pointer Types from 13. Modal and Special Types of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "modal-and-special-types"
specSection: "139-raw-pointer-types"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/modal-and-special-types/">13. Modal and Special Types</a>
  <span>Modal and Special Types</span>
</div>

## 13.9 Raw Pointer Types

### 13.9.1 Syntax

```text
raw_ptr_type ::= "*" ("imm" | "mut") type
```

### 13.9.2 Parsing

**(Parse-Raw-Pointer-Type)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"*"})\quad \operatorname{IsKw}(\operatorname{Tok}(\operatorname{Advance}(P)),\ q)\quad q\ \in \ \{\texttt{imm},\ \texttt{mut}\}\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ t) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseNonPermType}(P)\ \Downarrow \ (P_{1},\ \operatorname{TypeRawPtr}(q,\ t))
\end{array}
$$

### 13.9.3 AST Representation / Form

$$
\operatorname{TypeRawPtr}(\mathsf{qual},\ \mathsf{elem})\quad \mathsf{where}\ \mathsf{qual}\ \in \ \{\texttt{imm},\ \texttt{mut}\}
$$

### 13.9.4 Static Semantics

**(WF-RawPtr)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRawPtr}(q,\ T_{0})\quad \Gamma \ \vdash \ T_{0}\ \mathsf{wf} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}
\end{array}
$$

Rule **(T-Deref-Raw)** is defined once by §16.8.4.

**(P-Deref-Raw-Imm)**

$$
\begin{array}{l}
\operatorname{UnsafeSpan}(\operatorname{span}(\operatorname{Deref}(e)))\quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypeRawPtr}(\texttt{imm},\ T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Deref}(e)\ :\mathsf{place}\ \operatorname{TypePerm}(\texttt{const},\ T)
\end{array}
$$

**(P-Deref-Raw-Mut)**

$$
\begin{array}{l}
\operatorname{UnsafeSpan}(\operatorname{span}(\operatorname{Deref}(e)))\quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypeRawPtr}(\texttt{mut},\ T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Deref}(e)\ :\mathsf{place}\ \operatorname{TypePerm}(\texttt{unique},\ T)
\end{array}
$$

**(Deref-Raw-Unsafe)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypeRawPtr}(q,\ T)\quad \lnot \ \operatorname{UnsafeSpan}(\operatorname{span}(\operatorname{Deref}(e)))\quad c\ =\ \operatorname{Code}(\mathsf{Deref}-\mathsf{Raw}-\mathsf{Unsafe}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Deref}(e)\ \Uparrow \ c
\end{array}
$$

### 13.9.5 Dynamic Semantics

$$
\operatorname{ValueType}(\operatorname{RawPtr}(q,\ \mathsf{addr}))\ =\ \operatorname{TypeRawPtr}(q,\ T)\ \Leftrightarrow \ T\ \in \ \mathsf{Type}
$$

**(ReadPtr-Raw)**

$$
\begin{array}{l}
v_{\mathsf{ptr}}\ =\ \operatorname{RawPtr}(q,\ \mathsf{addr})\quad \operatorname{ReadAddr}(\sigma ,\ \mathsf{addr})\ =\ v \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ReadPtrSigma}(v_{\mathsf{ptr}},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma )
\end{array}
$$

**(WritePtr-Raw)**

$$
\begin{array}{l}
v_{\mathsf{ptr}}\ =\ \operatorname{RawPtr}(\texttt{mut},\ \mathsf{addr})\quad \operatorname{WriteAddr}(\sigma ,\ \mathsf{addr},\ v)\ \Downarrow \ \sigma ' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{WritePtrSigma}(v_{\mathsf{ptr}},\ v,\ \sigma )\ \Downarrow \ (\mathsf{ok},\ \sigma ')
\end{array}
$$

**(ReadPtr-Raw-Invalid)**

$$
\begin{array}{l}
v_{\mathsf{ptr}}\ =\ \operatorname{RawPtr}(q,\ \mathsf{addr})\quad \operatorname{ReadAddr}(\sigma ,\ \mathsf{addr})\ \mathsf{undefined} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ReadPtrSigma}(v_{\mathsf{ptr}},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma )
\end{array}
$$

**(WritePtr-Raw-Imm)**

$$
\begin{array}{l}
v_{\mathsf{ptr}}\ =\ \operatorname{RawPtr}(\texttt{imm},\ \mathsf{addr}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{WritePtrSigma}(v_{\mathsf{ptr}},\ v,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma )
\end{array}
$$

**(WritePtr-Raw-Invalid)**

$$
\begin{array}{l}
v_{\mathsf{ptr}}\ =\ \operatorname{RawPtr}(\texttt{mut},\ \mathsf{addr})\quad \lnot \ \exists \ \sigma '.\ \operatorname{WriteAddr}(\sigma ,\ \mathsf{addr},\ v)\ \Downarrow \ \sigma ' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{WritePtrSigma}(v_{\mathsf{ptr}},\ v,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma )
\end{array}
$$

### 13.9.6 Lowering

Rules **(Size-RawPtr)**, **(Align-RawPtr)**, **(Layout-RawPtr)** are defined once by §24.2.2.

$$
\begin{array}{l}
\operatorname{ValidValue}(\operatorname{TypeRawPtr}(q,\ T),\ \mathsf{bits})\ \Leftrightarrow \ \mid \mathsf{bits}\mid \ =\ \mathsf{PtrSize} \\[0.16em]
\operatorname{ValueBits}(\operatorname{TypeRawPtr}(q,\ T),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ v\ =\ \operatorname{RawPtr}(q,\ \mathsf{addr})\ \land \ \mathsf{bits}\ =\ \operatorname{LEBytes}(\mathsf{addr},\ \mathsf{PtrSize})
\end{array}
$$

Dereference lowering for raw pointers uses the shared `ReadPtrIR` and `WritePtrIR` operations. A raw dereference does not carry pointer-state metadata; invalid-address behavior is therefore observed only dynamically.

### 13.9.7 Diagnostics

Diagnostics are defined for dereference of raw pointers outside `unsafe`. Invalid raw-pointer reads and writes are runtime panic behavior rather than compile-time diagnostics.
