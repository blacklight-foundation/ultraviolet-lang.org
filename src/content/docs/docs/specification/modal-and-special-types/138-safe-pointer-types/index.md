---
title: "13.8 Safe Pointer Types"
description: "13.8 Safe Pointer Types from 13. Modal and Special Types of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "modal-and-special-types"
specSection: "138-safe-pointer-types"
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

## 13.8 Safe Pointer Types

### 13.8.1 Syntax

```text
safe_ptr_type ::= "Ptr" "<" type ">" ptr_state_opt
ptr_state_opt ::= epsilon | "@" "Valid" | "@" "Null" | "@" "Expired"
```

### 13.8.2 Parsing

**(Parse-Safe-Pointer-Type-ShiftSplit)**

$$
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \operatorname{Lexeme}(\operatorname{Tok}(P))\ =\ \texttt{Ptr}\quad \operatorname{IsOp}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"<"})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ t)\quad \operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{">>"})\quad P_{1}'\ =\ \operatorname{SplitShiftR}(P_{1})\quad \Gamma \ \vdash \ \operatorname{ParsePtrState}(\operatorname{Advance}(P_{1}'))\ \Downarrow \ (P_{2},\ \mathsf{st}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseNonPermType}(P)\ \Downarrow \ (P_{2},\ \operatorname{TypePtr}(t,\ \mathsf{st}_{\mathsf{opt}}))
\end{array}
$$

**(Parse-Safe-Pointer-Type)**

$$
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \operatorname{Lexeme}(\operatorname{Tok}(P))\ =\ \texttt{Ptr}\quad \operatorname{IsOp}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"<"})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ t)\quad \operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{">"})\quad \Gamma \ \vdash \ \operatorname{ParsePtrState}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{st}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseNonPermType}(P)\ \Downarrow \ (P_{2},\ \operatorname{TypePtr}(t,\ \mathsf{st}_{\mathsf{opt}}))
\end{array}
$$

**Pointer State.**

**(Parse-PtrState-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"@"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePtrState}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-PtrState-Valid)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"@"})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(P)))\quad \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(P)))\ =\ \texttt{Valid} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePtrState}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P)),\ \texttt{Valid})
\end{array}
$$

**(Parse-PtrState-Null)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"@"})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(P)))\quad \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(P)))\ =\ \texttt{Null} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePtrState}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P)),\ \texttt{Null})
\end{array}
$$

**(Parse-PtrState-Expired)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"@"})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(P)))\quad \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(P)))\ =\ \texttt{Expired} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePtrState}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P)),\ \texttt{Expired})
\end{array}
$$

### 13.8.3 AST Representation / Form

$$
\mathsf{PtrState}\ =\ \{\texttt{Valid},\ \texttt{Null},\ \texttt{Expired}\}
$$

$$
\begin{array}{l}
\mathsf{Ptr}<T>\ =\ \operatorname{TypePtr}(T,\ \bot ) \\[0.16em]
\mathsf{Ptr}<T>@s\ =\ \operatorname{TypePtr}(T,\ s)\quad (s\ \ne \ \bot )
\end{array}
$$

### 13.8.4 Static Semantics

**(WF-Ptr)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePtr}(T_{0},\ \mathsf{state}_{\mathsf{opt}})\quad \mathsf{state}_{\mathsf{opt}}\ \in \ \{\bot ,\ \texttt{Valid},\ \texttt{Null},\ \texttt{Expired}\}\quad \Gamma \ \vdash \ T_{0}\ \mathsf{wf} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}
\end{array}
$$

BitcopyType(TypePtr(T, s))
CloneType(TypePtr(T, s))

$$
\lnot \ \operatorname{DropType}(\operatorname{TypePtr}(T,\ s))
$$

Rule **(Sub-Ptr-State)** is defined once by §8.2.

### 13.8.5 Dynamic Semantics

$$
\begin{array}{l}
\mathsf{Ptr}@\operatorname{Valid}(\mathsf{addr})\ =\ \operatorname{PtrVal}(\texttt{Valid},\ \mathsf{addr}) \\[0.16em]
\mathsf{Ptr}@\operatorname{Null}(\mathsf{addr})\ =\ \operatorname{PtrVal}(\texttt{Null},\ \mathsf{addr}) \\[0.16em]
\mathsf{Ptr}@\operatorname{Expired}(\mathsf{addr})\ =\ \operatorname{PtrVal}(\texttt{Expired},\ \mathsf{addr})
\end{array}
$$

$$
\operatorname{ValueType}(\operatorname{PtrVal}(s,\ \mathsf{addr}))\ =\ \operatorname{TypePtr}(T,\ s)\ \Leftrightarrow \ T\ \in \ \mathsf{Type}
$$

$$
\begin{array}{l}
\operatorname{PtrState}(\sigma ,\ \mathsf{Ptr}@\operatorname{Null}(\_))\ =\ \texttt{Null} \\[0.16em]
\operatorname{PtrState}(\sigma ,\ \mathsf{Ptr}@\operatorname{Expired}(\_))\ =\ \texttt{Expired} \\[0.16em]
\operatorname{PtrState}(\sigma ,\ \mathsf{Ptr}@\operatorname{Valid}(\mathsf{addr}))\ = \\[0.16em]
\ \texttt{Valid}\quad \mathsf{if}\ \operatorname{AddrTag}(\sigma ,\ \mathsf{addr})\ =\ \bot \\[0.16em]
\ \texttt{Valid}\quad \mathsf{if}\ \operatorname{AddrTag}(\sigma ,\ \mathsf{addr})\ =\ \mathsf{tag}\ \ne \ \bot \ \land \ \operatorname{TagActive}(\sigma ,\ \mathsf{tag}) \\[0.16em]
\ \texttt{Expired}\ \mathsf{if}\ \operatorname{AddrTag}(\sigma ,\ \mathsf{addr})\ =\ \mathsf{tag}\ \ne \ \bot \ \land \ \lnot \ \operatorname{TagActive}(\sigma ,\ \mathsf{tag})
\end{array}
$$

$$
\mathsf{PtrAddrJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{ReadPtrSigma}(v_{\mathsf{ptr}},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma '),\ \Gamma \ \vdash \ \operatorname{WritePtrSigma}(v_{\mathsf{ptr}},\ v,\ \sigma )\ \Downarrow \ (\mathsf{sout},\ \sigma '),\ \Gamma \ \vdash \ \operatorname{AddrOfSigma}(p,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\}
$$

**(ReadPtr-Safe)**

$$
\begin{array}{l}
\operatorname{PtrState}(\sigma ,\ v_{\mathsf{ptr}})\ =\ \texttt{Valid}\quad \operatorname{PtrAddr}(v_{\mathsf{ptr}})\ =\ \mathsf{addr}\quad \operatorname{ReadAddr}(\sigma ,\ \mathsf{addr})\ =\ v \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ReadPtrSigma}(v_{\mathsf{ptr}},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma )
\end{array}
$$

**(WritePtr-Safe)**

$$
\begin{array}{l}
\operatorname{PtrState}(\sigma ,\ v_{\mathsf{ptr}})\ =\ \texttt{Valid}\quad \operatorname{PtrAddr}(v_{\mathsf{ptr}})\ =\ \mathsf{addr}\quad \operatorname{WriteAddr}(\sigma ,\ \mathsf{addr},\ v)\ \Downarrow \ \sigma ' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{WritePtrSigma}(v_{\mathsf{ptr}},\ v,\ \sigma )\ \Downarrow \ (\mathsf{ok},\ \sigma ')
\end{array}
$$

**(ReadPtr-Null)**

$$
\begin{array}{l}
\operatorname{PtrState}(\sigma ,\ v_{\mathsf{ptr}})\ =\ \texttt{Null} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ReadPtrSigma}(v_{\mathsf{ptr}},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma )
\end{array}
$$

**(ReadPtr-Expired)**

$$
\begin{array}{l}
\operatorname{PtrState}(\sigma ,\ v_{\mathsf{ptr}})\ =\ \texttt{Expired} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ReadPtrSigma}(v_{\mathsf{ptr}},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma )
\end{array}
$$

**(WritePtr-Null)**

$$
\begin{array}{l}
\operatorname{PtrState}(\sigma ,\ v_{\mathsf{ptr}})\ =\ \texttt{Null} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{WritePtrSigma}(v_{\mathsf{ptr}},\ v,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma )
\end{array}
$$

**(WritePtr-Expired)**

$$
\begin{array}{l}
\operatorname{PtrState}(\sigma ,\ v_{\mathsf{ptr}})\ =\ \texttt{Expired} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{WritePtrSigma}(v_{\mathsf{ptr}},\ v,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma )
\end{array}
$$

### 13.8.6 Lowering

Rules **(Size-Ptr)**, **(Align-Ptr)**, **(Layout-Ptr)** are defined once by §24.2.2.

$$
\begin{array}{l}
\operatorname{sizeof}(\texttt{Ptr<T>})\ =\ \operatorname{sizeof}(\texttt{usize})\quad \operatorname{alignof}(\texttt{Ptr<T>})\ =\ \operatorname{alignof}(\texttt{usize}) \\[0.16em]
\mathsf{PtrDiagRefs}\ =\ \{\texttt{"8.10"}\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{NicheSet}(T)\ =\ \{\operatorname{LEBytes}(0,\ \mathsf{PtrSize})\}\ \Leftrightarrow \ \exists \ U.\ T\ =\ \operatorname{TypePtr}(U,\ \texttt{Valid}) \\[0.16em]
\operatorname{NicheSet}(T)\ =\ \emptyset \ \Leftrightarrow \ \lnot \ \exists \ U.\ T\ =\ \operatorname{TypePtr}(U,\ \texttt{Valid})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ValidValue}(\operatorname{TypePtr}(T,\ \texttt{Valid}),\ \mathsf{bits})\ \Leftrightarrow \ \mid \mathsf{bits}\mid \ =\ \mathsf{PtrSize}\ \land \ \mathsf{bits}\ \ne \ \operatorname{LEBytes}(0,\ \mathsf{PtrSize}) \\[0.16em]
\operatorname{ValidValue}(\operatorname{TypePtr}(T,\ \texttt{Null}),\ \mathsf{bits})\ \Leftrightarrow \ \mathsf{bits}\ =\ \operatorname{LEBytes}(0,\ \mathsf{PtrSize}) \\[0.16em]
\operatorname{ValidValue}(\operatorname{TypePtr}(T,\ \texttt{Expired}),\ \mathsf{bits})\ \Leftrightarrow \ \mid \mathsf{bits}\mid \ =\ \mathsf{PtrSize} \\[0.16em]
\operatorname{ValidValue}(\operatorname{TypePtr}(T,\ \bot ),\ \mathsf{bits})\ \Leftrightarrow \ \mid \mathsf{bits}\mid \ =\ \mathsf{PtrSize}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ValueBits}(\operatorname{TypePtr}(T,\ \texttt{Valid}),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ v\ =\ \operatorname{PtrVal}(\texttt{Valid},\ \mathsf{addr})\ \land \ \mathsf{addr}\ \ne \ 0\mathsf{x0}\ \land \ \mathsf{bits}\ =\ \operatorname{LEBytes}(\mathsf{addr},\ \mathsf{PtrSize}) \\[0.16em]
\operatorname{ValueBits}(\operatorname{TypePtr}(T,\ \texttt{Null}),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ v\ =\ \operatorname{PtrVal}(\texttt{Null},\ \mathsf{addr})\ \land \ \mathsf{addr}\ =\ 0\mathsf{x0}\ \land \ \mathsf{bits}\ =\ \operatorname{LEBytes}(\mathsf{addr},\ \mathsf{PtrSize}) \\[0.16em]
\operatorname{ValueBits}(\operatorname{TypePtr}(T,\ \texttt{Expired}),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ v\ =\ \operatorname{PtrVal}(\texttt{Expired},\ \mathsf{addr})\ \land \ \mathsf{bits}\ =\ \operatorname{LEBytes}(\mathsf{addr},\ \mathsf{PtrSize}) \\[0.16em]
\operatorname{ValueBits}(\operatorname{TypePtr}(T,\ \bot ),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ \exists \ s.\ s\ \in \ \mathsf{PtrStateSet}\ \land \ \operatorname{ValueBits}(\operatorname{TypePtr}(T,\ s),\ v)\ =\ \mathsf{bits}
\end{array}
$$

### 13.8.7 Diagnostics

Diagnostics are defined for dereference of safe pointers known statically to be in the `@Null` or `@Expired` states. `Ptr::null()` expression diagnostics are owned by §16.1.7.
