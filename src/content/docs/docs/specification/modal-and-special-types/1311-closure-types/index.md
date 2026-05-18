---
title: "13.11 Closure Types"
description: "13.11 Closure Types from 13. Modal and Special Types of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "modal-and-special-types"
specSection: "1311-closure-types"
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

## 13.11 Closure Types

### 13.11.1 Syntax

```text
closure_type      ::= "|" param_type_list? "|" "->" type closure_deps_opt
closure_deps_opt  ::= epsilon | "[" "shared" ":" "{" shared_dep_list? "}" "]"
shared_dep_list   ::= shared_dep ("," shared_dep)*
shared_dep        ::= identifier ":" type
```

Within `closure_type`, if a parameter type has a top-level `union_type`, it MUST be parenthesized as `("(" type ")")`. This grouped form is permitted only to disambiguate closure parameter types and does not introduce a distinct type constructor.

### 13.11.2 Parsing

**(Parse-Closure-Type)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|"})\quad \Gamma \ \vdash \ \operatorname{ParseClosureParamTypeList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{params})\quad \operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{"|"})\quad \operatorname{IsOp}(\operatorname{Tok}(\operatorname{Advance}(P_{1})),\ \texttt{"->"})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(\operatorname{Advance}(P_{1})))\ \Downarrow \ (P_{2},\ \mathsf{ret})\quad \Gamma \ \vdash \ \operatorname{ParseClosureDepsOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{deps}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseNonPermType}(P)\ \Downarrow \ (P_{3},\ \operatorname{TypeClosure}(\mathsf{params},\ \mathsf{ret},\ \mathsf{deps}_{\mathsf{opt}}))
\end{array}
$$

**(Parse-Closure-Type-Empty)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|"})\quad \operatorname{IsOp}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"|"})\quad \operatorname{IsOp}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))),\ \texttt{"->"})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P))))\ \Downarrow \ (P_{1},\ \mathsf{ret})\quad \Gamma \ \vdash \ \operatorname{ParseClosureDepsOpt}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{deps}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseNonPermType}(P)\ \Downarrow \ (P_{2},\ \operatorname{TypeClosure}([],\ \mathsf{ret},\ \mathsf{deps}_{\mathsf{opt}}))
\end{array}
$$

**(Parse-ClosureParamType-Grouped)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{ty})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{")"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureParamType}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \mathsf{ty})
\end{array}
$$

**(Parse-ClosureParamType-Plain)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseTypeNoUnion}(P)\ \Downarrow \ (P_{1},\ \mathsf{ty}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureParamType}(P)\ \Downarrow \ (P_{1},\ \mathsf{ty})
\end{array}
$$

**(Parse-ClosureParamTypeList-Empty)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureParamTypeList}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-ClosureParamTypeList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseClosureParamType}(P)\ \Downarrow \ (P_{1},\ \mathsf{pt})\quad \Gamma \ \vdash \ \operatorname{ParseClosureParamTypeListTail}(P_{1},\ [\mathsf{pt}])\ \Downarrow \ (P_{2},\ \mathsf{pts}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureParamTypeList}(P)\ \Downarrow \ (P_{2},\ \mathsf{pts})
\end{array}
$$

**(Parse-ClosureParamTypeListTail-End)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureParamTypeListTail}(P,\ \mathsf{ps})\ \Downarrow \ (P,\ \mathsf{ps})
\end{array}
$$

**(Parse-ClosureParamTypeListTail-TrailingComma)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \operatorname{IsOp}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"|"})\quad \operatorname{TrailingCommaAllowed}(P_{0},\ P,\ \{\operatorname{Operator}(\texttt{"|"})\}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureParamTypeListTail}(P,\ \mathsf{ps})\ \Downarrow \ (\operatorname{Advance}(P),\ \mathsf{ps})
\end{array}
$$

**(Parse-ClosureParamTypeListTail-Comma)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParseClosureParamType}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{pt})\quad \Gamma \ \vdash \ \operatorname{ParseClosureParamTypeListTail}(P_{1},\ \mathsf{ps}\ \mathbin{++} \ [\mathsf{pt}])\ \Downarrow \ (P_{2},\ \mathsf{ps}') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureParamTypeListTail}(P,\ \mathsf{ps})\ \Downarrow \ (P_{2},\ \mathsf{ps}')
\end{array}
$$

**(Parse-ClosureDepsOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"["}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureDepsOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-ClosureDepsOpt-Some)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"["})\quad \operatorname{IsKw}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{shared})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))),\ \texttt{":"})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P)))),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseSharedDepList}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P)))))\ \Downarrow \ (P_{1},\ \mathsf{deps})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\}"})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P_{1})),\ \texttt{"]"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureDepsOpt}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P_{1})),\ \langle \mathsf{deps}\rangle )
\end{array}
$$

**(Parse-SharedDepList-Empty)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseSharedDepList}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-SharedDepList-Single)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseSharedDep}(P)\ \Downarrow \ (P_{1},\ \mathsf{dep})\quad \lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{","}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseSharedDepList}(P)\ \Downarrow \ (P_{1},\ [\mathsf{dep}])
\end{array}
$$

**(Parse-SharedDepList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseSharedDep}(P)\ \Downarrow \ (P_{1},\ \mathsf{dep})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParseSharedDepList}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{deps}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseSharedDepList}(P)\ \Downarrow \ (P_{2},\ [\mathsf{dep}]\ \mathbin{++} \ \mathsf{deps})
\end{array}
$$

**(Parse-SharedDep)**

$$
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \mathsf{name}\ =\ \operatorname{Lexeme}(\operatorname{Tok}(P))\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ \mathsf{ty}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseSharedDep}(P)\ \Downarrow \ (P_{1},\ \langle \mathsf{name},\ \mathsf{ty}\rangle )
\end{array}
$$

### 13.11.3 AST Representation / Form

$$
\mathsf{Type}\ =\ \ldots \ \mid \ \operatorname{TypeClosure}(\mathsf{params},\ \mathsf{ret},\ \mathsf{deps}_{\mathsf{opt}})\ \mid \ \ldots 
$$

$$
\mathsf{deps}_{\mathsf{opt}}\ =\ \bot \ \lor \ \mathsf{deps}_{\mathsf{opt}}\ =\ \langle [\langle \mathsf{name}_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle \mathsf{name}_{n},\ T_{n}\rangle ]\rangle 
$$

Closure expressions, capture classification, closure invocation, and pipeline expressions are owned by §16.9. Chapter 19 consumes the dependency information carried by `TypeClosure(..., deps_opt)`.

### 13.11.4 Static Semantics

**(WF-Closure)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeClosure}(\mathsf{params},\ R,\ \mathsf{deps}_{\mathsf{opt}})\quad \forall \ \langle m,\ T_{i}\rangle \ \in \ \mathsf{params},\ \Gamma \ \vdash \ T_{i}\ \mathsf{wf}\quad \Gamma \ \vdash \ R\ \mathsf{wf}\quad (\mathsf{deps}_{\mathsf{opt}}\ =\ \bot \ \lor \ \forall \ d\ \in \ \mathsf{deps}_{\mathsf{opt}},\ \Gamma \ \vdash \ \operatorname{TypeOf}(d)\ \mathsf{wf}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}
\end{array}
$$

**(T-Equiv-Closure)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeClosure}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ],\ R,\ D)\quad U\ =\ \operatorname{TypeClosure}([\langle m_{1},\ U_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ U_{n}\rangle ],\ S,\ D)\quad \forall \ i,\ \Gamma \ \vdash \ T_{i}\ \equiv \ U_{i}\quad \Gamma \ \vdash \ R\ \equiv \ S \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(Sub-Closure)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeClosure}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ],\ R,\ D)\quad U\ =\ \operatorname{TypeClosure}([\langle m_{1},\ U_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ U_{n}\rangle ],\ S,\ D)\quad \forall \ i,\ \Gamma \ \vdash \ U_{i}\ \mathrel{<:} \ T_{i}\quad \Gamma \ \vdash \ R\ \mathrel{<:} \ S \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

Closure-expression typing and dependency-set construction are defined in §16.9.4.

### 13.11.5 Dynamic Semantics

$$
\operatorname{ClosureVal}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{code}_{\mathsf{ptr}})\ \mathsf{defined}\ \Leftrightarrow \ (\mathsf{env}_{\mathsf{ptr}}\ =\ \mathsf{null}\ \lor \ \mathsf{env}_{\mathsf{ptr}}\ \in \ \mathsf{Addr})\ \land \ \mathsf{code}_{\mathsf{ptr}}\ \in \ \mathsf{Symbol}
$$

Creation and invocation of closure values are defined in §16.9.5. Key acquisition for closures that capture `shared` bindings is defined in Chapter 19 and depends on the dependency set carried by `TypeClosure(..., deps_opt)`.

### 13.11.6 Lowering

$$
\mathsf{ClosureRep}\ =\ \langle \mathsf{env}_{\mathsf{ptr}}:\ *\mathsf{imm}\ \mathsf{u8},\ \mathsf{code}_{\mathsf{ptr}}:\ *\mathsf{imm}\ \mathsf{u8}\rangle 
$$

**(Size-Closure)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeClosure}(\mathsf{params},\ R,\ \mathsf{deps}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ 2\ \times \ \mathsf{PtrSize}
\end{array}
$$

**(Align-Closure)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeClosure}(\mathsf{params},\ R,\ \mathsf{deps}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{PtrAlign}
\end{array}
$$

**(Layout-Closure)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeClosure}(\mathsf{params},\ R,\ \mathsf{deps}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \langle 2\ \times \ \mathsf{PtrSize},\ \mathsf{PtrAlign}\rangle 
\end{array}
$$

Closure-expression lowering, closure environment layout, and captured-variable access lowering are defined in §16.9.6.

### 13.11.7 Diagnostics

This section defines no additional named diagnostics beyond failures of closure-type parsing and well-formedness. Closure capture diagnostics are owned by §16.9.7; shared-dependency and closure-key diagnostics are owned by Chapter 19; spawn-body closure diagnostics are owned by Chapter 20.
