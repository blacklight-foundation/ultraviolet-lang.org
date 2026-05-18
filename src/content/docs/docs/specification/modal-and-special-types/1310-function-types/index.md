---
title: "13.10 Function Types"
description: "13.10 Function Types from 13. Modal and Special Types of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "modal-and-special-types"
specSection: "1310-function-types"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/modal-and-special-types/">13. Modal and Special Types</a>
  <span>Modal and Special Types</span>
</div>

## 13.10 Function Types

### 13.10.1 Syntax

```text
func_type       ::= "(" param_type_list? ")" "->" type
param_type_list ::= param_type ("," param_type)* ","?
param_type      ::= "move" type | type
```

Trailing commas in `param_type_list` are permitted only when `TrailingCommaAllowed` (§5.5). A trailing comma does not denote an additional parameter type.

### 13.10.2 Parsing

**(Parse-Func-Type)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseParamTypeList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{params})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{")"})\quad \operatorname{IsOp}(\operatorname{Tok}(\operatorname{Advance}(P_{1})),\ \texttt{"->"})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(\operatorname{Advance}(P_{1})))\ \Downarrow \ (P_{2},\ \mathsf{ret}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseNonPermType}(P)\ \Downarrow \ (P_{2},\ \operatorname{TypeFunc}(\mathsf{params},\ \mathsf{ret}))
\end{array}
$$

**(Parse-ParamType-Move)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{move})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{ty}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseParamType}(P)\ \Downarrow \ (P_{1},\ \langle \texttt{move},\ \mathsf{ty}\rangle )
\end{array}
$$

**(Parse-ParamType-Plain)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{move})\quad \Gamma \ \vdash \ \operatorname{ParseType}(P)\ \Downarrow \ (P_{1},\ \mathsf{ty}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseParamType}(P)\ \Downarrow \ (P_{1},\ \langle \bot ,\ \mathsf{ty}\rangle )
\end{array}
$$

**(Parse-ParamTypeList-Empty)**
IsPunc(Tok(P), ")")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseParamTypeList}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-ParamTypeList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseParamType}(P)\ \Downarrow \ (P_{1},\ \mathsf{pt})\quad \Gamma \ \vdash \ \operatorname{ParseParamTypeListTail}(P_{1},\ [\mathsf{pt}])\ \Downarrow \ (P_{2},\ \mathsf{pts}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseParamTypeList}(P)\ \Downarrow \ (P_{2},\ \mathsf{pts})
\end{array}
$$

**(Parse-ParamTypeListTail-End)**
IsPunc(Tok(P), ")")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseParamTypeListTail}(P,\ \mathsf{ps})\ \Downarrow \ (P,\ \mathsf{ps})
\end{array}
$$

**(Parse-ParamTypeListTail-TrailingComma)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{")"})\quad \operatorname{TrailingCommaAllowed}(P_{0},\ P,\ \{\operatorname{Punctuator}(\texttt{")"})\}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseParamTypeListTail}(P,\ \mathsf{ps})\ \Downarrow \ (\operatorname{Advance}(P),\ \mathsf{ps})
\end{array}
$$

**(Parse-ParamTypeListTail-Cons)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParseParamType}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{pt})\quad \Gamma \ \vdash \ \operatorname{ParseParamTypeListTail}(P_{1},\ \mathsf{ps}\ \mathbin{++} \ [\mathsf{pt}])\ \Downarrow \ (P_{2},\ \mathsf{ps}') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseParamTypeListTail}(P,\ \mathsf{ps})\ \Downarrow \ (P_{2},\ \mathsf{ps}')
\end{array}
$$

### 13.10.3 AST Representation / Form

$$
\operatorname{TypeFunc}([\langle \mathsf{mode}_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle \mathsf{mode}_{n},\ T_{n}\rangle ],\ R)
$$

### 13.10.4 Static Semantics

**(WF-Func)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeFunc}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ],\ R)\quad \Gamma \ \vdash \ R\ \mathsf{wf}\quad \forall \ i,\ \Gamma \ \vdash \ T_{i}\ \mathsf{wf} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}
\end{array}
$$

**(T-Equiv-Func)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeFunc}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ],\ R)\quad U\ =\ \operatorname{TypeFunc}([\langle m_{1},\ U_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ U_{n}\rangle ],\ S)\quad \forall \ i,\ \Gamma \ \vdash \ T_{i}\ \equiv \ U_{i}\quad \Gamma \ \vdash \ R\ \equiv \ S \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(Sub-Func)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeFunc}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ],\ R)\quad U\ =\ \operatorname{TypeFunc}([\langle m_{1},\ U_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ U_{n}\rangle ],\ S)\quad \forall \ i,\ \Gamma \ \vdash \ U_{i}\ \mathrel{<:} \ T_{i}\quad \Gamma \ \vdash \ R\ \mathrel{<:} \ S \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

**(T-Proc-As-Value)**

$$
\begin{array}{l}
\mathsf{procedure}\ \operatorname{f}(m_{1}\ x_{1}\ :\ T_{1},\ \ldots ,\ m_{n}\ x_{n}\ :\ T_{n})\ \to \ R\ \mathsf{declared} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ f\ :\ \operatorname{TypeFunc}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ],\ R)
\end{array}
$$

Call arity, argument typing, and callee-kind diagnostics for `TypeFunc` are owned by Chapter 16.

### 13.10.5 Dynamic Semantics

$$
\operatorname{FuncVal}(\mathsf{sym})\ \mathsf{defined}\ \Leftrightarrow \ \mathsf{sym}\ \in \ \mathsf{Symbol}
$$

**(EvalSigma-Call-Proc)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{callee},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{c}),\ \sigma_{1} )\quad \mathsf{proc}\ =\ \operatorname{CallTarget}(v_{c})\quad \Gamma \ \vdash \ \operatorname{EvalArgsSigma}(\mathsf{proc}.\mathsf{params},\ \mathsf{args},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{v}),\ \sigma_{2} )\quad \Gamma \ \vdash \ \operatorname{ApplyProcSigma}(\mathsf{proc},\ \mathsf{vec}_{v},\ \sigma_{2} )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Call}(\mathsf{callee},\ \mathsf{args}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} )
\end{array}
$$

Named procedures therefore denote first-class callable values of function type.

### 13.10.6 Lowering

**(Size-Func)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeFunc}(\mathsf{params},\ R) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ \mathsf{PtrSize}
\end{array}
$$

**(Align-Func)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeFunc}(\mathsf{params},\ R) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{PtrAlign}
\end{array}
$$

**(Layout-Func)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeFunc}(\mathsf{params},\ R) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \langle \mathsf{PtrSize},\ \mathsf{PtrAlign}\rangle 
\end{array}
$$

Function-type calls are lowered through the ordinary call-lowering and ABI rules of Chapters 16 and 23.

### 13.10.7 Diagnostics

This section introduces no additional diagnostics beyond the shared type well-formedness rules and the call-expression diagnostics owned by Chapter 16.
