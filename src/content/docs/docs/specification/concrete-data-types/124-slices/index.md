---
title: "12.4 Slices"
description: "12.4 Slices from 12. Concrete Data Types of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "concrete-data-types"
specSection: "124-slices"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/concrete-data-types/">12. Concrete Data Types</a>
  <span>Concrete Data Types</span>
</div>

## 12.4 Slices

### 12.4.1 Syntax

```text
slice_type  ::= "[" type "]"
slice_expr  ::= postfix_expr "[" expr "]"
coercion    ::= array_expr_as_slice
```

Array-to-slice coercion is semantic rather than surface-syntactic.

### 12.4.2 Parsing

**(Parse-Slice-Type)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"["})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ t)\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"]"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseNonPermType}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{TypeSlice}(t))
\end{array}
$$

`IndexAccess(base, idx)` is parsed by `Postfix-Index` in §12.3.2. This section owns the cases where the base type is `TypeSlice`.

### 12.4.3 AST Representation / Form

$$
\mathsf{TypeSlice}\ =\ \langle \mathsf{elem}\rangle \ \mathsf{where}\ \mathsf{elem}\ \in \ \mathsf{Type}
$$

`IndexAccess(base, idx)` denotes either direct slice indexing or slice-producing range selection when the base type is `TypeSlice`.

### 12.4.4 Static Semantics

$$
\operatorname{RangeIndexType}(T_{r})\ \Leftrightarrow \ T_{r}\ =\ \operatorname{TypeRange}(\operatorname{TypePrim}(\texttt{"usize"}))\ \lor \ T_{r}\ =\ \operatorname{TypeRangeInclusive}(\operatorname{TypePrim}(\texttt{"usize"}))\ \lor \ T_{r}\ =\ \operatorname{TypeRangeFrom}(\operatorname{TypePrim}(\texttt{"usize"}))\ \lor \ T_{r}\ =\ \operatorname{TypeRangeTo}(\operatorname{TypePrim}(\texttt{"usize"}))\ \lor \ T_{r}\ =\ \operatorname{TypeRangeToInclusive}(\operatorname{TypePrim}(\texttt{"usize"}))\ \lor \ T_{r}\ =\ \mathsf{TypeRangeFull}
$$

$$
\operatorname{RangeIndexExpr}(r)\ \Leftrightarrow \ (\Gamma ;\ R;\ L\ \vdash \ r\ :\ \mathsf{Range}\ \land \ \operatorname{RangeIndexType}(\operatorname{ExprType}(r)))\ \lor \ r\ =\ \operatorname{Range}(\texttt{Full},\ \bot ,\ \bot )\ \lor \ (r\ =\ \operatorname{Range}(\texttt{To},\ \bot ,\ e)\ \land \ \operatorname{IndexUsizeExpr}(e))\ \lor \ (r\ =\ \operatorname{Range}(\texttt{ToInclusive},\ \bot ,\ e)\ \land \ \operatorname{IndexUsizeExpr}(e))\ \lor \ (r\ =\ \operatorname{Range}(\texttt{From},\ e,\ \bot )\ \land \ \operatorname{IndexUsizeExpr}(e))\ \lor \ (r\ =\ \operatorname{Range}(\texttt{Exclusive},\ e_{1},\ e_{2})\ \land \ \operatorname{IndexUsizeExpr}(e_{1})\ \land \ \operatorname{IndexUsizeExpr}(e_{2}))\ \lor \ (r\ =\ \operatorname{Range}(\texttt{Inclusive},\ e_{1},\ e_{2})\ \land \ \operatorname{IndexUsizeExpr}(e_{1})\ \land \ \operatorname{IndexUsizeExpr}(e_{2}))
$$

`RangeIndexExpr` is a contextual array/slice slicing relation. It preserves already-typed `usize` range carriers and additionally accepts direct range expressions whose explicit bounds satisfy `IndexUsizeExpr`. Standalone range expressions still synthesize their ordinary range types under §12.5.4.

**(WF-Slice)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeSlice}(T_{0})\quad \Gamma \ \vdash \ T_{0}\ \mathsf{wf} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}
\end{array}
$$

**(T-Index-Slice)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypeSlice}(T)\quad \operatorname{IndexUsizeExpr}(e_{2})\quad \operatorname{BitcopyType}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\ T
\end{array}
$$

**(T-Index-Slice-Perm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypePerm}(p,\ \operatorname{TypeSlice}(T))\quad \operatorname{IndexUsizeExpr}(e_{2})\quad \operatorname{BitcopyType}(\operatorname{TypePerm}(p,\ T)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\ \operatorname{TypePerm}(p,\ T)
\end{array}
$$

**(T-Slice-From-Array)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypeArray}(T,\ n)\quad \operatorname{RangeIndexExpr}(e_{2})\quad \operatorname{BitcopyType}(\operatorname{TypeSlice}(T)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\ \operatorname{TypeSlice}(T)
\end{array}
$$

**(T-Slice-From-Array-Perm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypePerm}(p,\ \operatorname{TypeArray}(T,\ n))\quad \operatorname{RangeIndexExpr}(e_{2})\quad \operatorname{BitcopyType}(\operatorname{TypePerm}(p,\ \operatorname{TypeSlice}(T))) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\ \operatorname{TypePerm}(p,\ \operatorname{TypeSlice}(T))
\end{array}
$$

**(T-Slice-From-Slice)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypeSlice}(T)\quad \operatorname{RangeIndexExpr}(e_{2})\quad \operatorname{BitcopyType}(\operatorname{TypeSlice}(T)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\ \operatorname{TypeSlice}(T)
\end{array}
$$

**(T-Slice-From-Slice-Perm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypePerm}(p,\ \operatorname{TypeSlice}(T))\quad \operatorname{RangeIndexExpr}(e_{2})\quad \operatorname{BitcopyType}(\operatorname{TypePerm}(p,\ \operatorname{TypeSlice}(T))) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\ \operatorname{TypePerm}(p,\ \operatorname{TypeSlice}(T))
\end{array}
$$

**(P-Index-Slice)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\mathsf{place}\ \operatorname{TypeSlice}(T)\quad \operatorname{IndexUsizeExpr}(e_{2}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\mathsf{place}\ T
\end{array}
$$

**(P-Index-Slice-Perm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\mathsf{place}\ \operatorname{TypePerm}(p,\ \operatorname{TypeSlice}(T))\quad \operatorname{IndexUsizeExpr}(e_{2}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\mathsf{place}\ \operatorname{TypePerm}(p,\ T)
\end{array}
$$

**(P-Slice-From-Array)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\mathsf{place}\ \operatorname{TypeArray}(T,\ n)\quad \operatorname{RangeIndexExpr}(e_{2}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\mathsf{place}\ \operatorname{TypeSlice}(T)
\end{array}
$$

**(P-Slice-From-Array-Perm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\mathsf{place}\ \operatorname{TypePerm}(p,\ \operatorname{TypeArray}(T,\ n))\quad \operatorname{RangeIndexExpr}(e_{2}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\mathsf{place}\ \operatorname{TypePerm}(p,\ \operatorname{TypeSlice}(T))
\end{array}
$$

**(P-Slice-From-Slice)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\mathsf{place}\ \operatorname{TypeSlice}(T)\quad \operatorname{RangeIndexExpr}(e_{2}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\mathsf{place}\ \operatorname{TypeSlice}(T)
\end{array}
$$

**(P-Slice-From-Slice-Perm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\mathsf{place}\ \operatorname{TypePerm}(p,\ \operatorname{TypeSlice}(T))\quad \operatorname{RangeIndexExpr}(e_{2}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\mathsf{place}\ \operatorname{TypePerm}(p,\ \operatorname{TypeSlice}(T))
\end{array}
$$

**(Coerce-Array-Slice)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ :\ \operatorname{TypePerm}(p,\ \operatorname{TypeArray}(T,\ n)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ e\ :\ \operatorname{TypePerm}(p,\ \operatorname{TypeSlice}(T))
\end{array}
$$

**(Index-NonIndexable)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ T\quad \operatorname{StripPerm}(T)\ \notin \ \{\operatorname{TypeArray}(\_,\ \_),\ \operatorname{TypeSlice}(\_)\}\quad c\ =\ \operatorname{Code}(\mathsf{Index}-\mathsf{NonIndexable}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ \Uparrow \ c
\end{array}
$$

### 12.4.5 Dynamic Semantics

$$
\operatorname{ValueType}(\operatorname{SliceValue}(v,\ r))\ =\ \operatorname{TypeSlice}(T)\ \Leftrightarrow \ \operatorname{ValueType}(v)\ =\ \operatorname{TypeArray}(T,\ \_)\ \lor \ \operatorname{ValueType}(v)\ =\ \operatorname{TypeSlice}(T)
$$

$$
\begin{array}{l}
\operatorname{Len}(\operatorname{SliceValue}(v,\ r))\ =\ \mathsf{end}\ -\ \mathsf{start}\quad (\operatorname{SliceBounds}(r,\ \operatorname{Len}(v))\ =\ (\mathsf{start},\ \mathsf{end})) \\[0.16em]
\operatorname{IndexValue}(\operatorname{SliceValue}(v,\ r),\ i)\ =\ \operatorname{IndexValue}(v,\ \mathsf{start}\ +\ i)\quad (\operatorname{SliceBounds}(r,\ \operatorname{Len}(v))\ =\ (\mathsf{start},\ \mathsf{end})\ \land \ 0\ \le \ i\ <\ \mathsf{end}\ -\ \mathsf{start})
\end{array}
$$

**(EvalSigma-Index-Range)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{base},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{b}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{idx},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(v_{r}),\ \sigma_{2} )\quad \operatorname{SliceValue}(v_{b},\ v_{r})\ =\ v_{s} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{IndexAccess}(\mathsf{base},\ \mathsf{idx}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{s}),\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Index-Range-OOB)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{base},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{b}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{idx},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(v_{r}),\ \sigma_{2} )\quad \operatorname{SliceBounds}(v_{r},\ \operatorname{Len}(v_{b}))\ =\ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{IndexAccess}(\mathsf{base},\ \mathsf{idx}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma_{2} )
\end{array}
$$

### 12.4.6 Lowering

**(Size-Slice)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ 2\ \times \ \mathsf{PtrSize}
\end{array}
$$

**(Align-Slice)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{PtrAlign}
\end{array}
$$

**(Layout-Slice)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \langle 2\ \times \ \mathsf{PtrSize},\ \mathsf{PtrAlign}\rangle 
\end{array}
$$

$$
\operatorname{ValueBits}(\operatorname{TypeSlice}(T),\ \operatorname{SliceValue}(v,\ r))\ =\ \mathsf{bits}\ \Leftrightarrow \ \operatorname{SliceBounds}(r,\ \operatorname{Len}(v))\ =\ (\mathsf{start},\ \mathsf{end})\ \land \ n\ =\ \mathsf{end}\ -\ \mathsf{start}\ \land \ \exists \ \mathsf{addr}.\ \operatorname{ValueBits}(\operatorname{TypeRawPtr}(\texttt{imm},\ T),\ \operatorname{RawPtr}(\texttt{imm},\ \mathsf{addr}))\ =\ b_{\mathsf{ptr}}\ \land \ \operatorname{ValueBits}(\operatorname{TypePrim}(\texttt{"usize"}),\ \operatorname{IntVal}(\texttt{"usize"},\ n))\ =\ b_{\mathsf{len}}\ \land \ \mathsf{bits}\ =\ b_{\mathsf{ptr}}\ \mathbin{++} \ b_{\mathsf{len}}
$$

$$
\operatorname{IndexUpdate}(\operatorname{SliceValue}(v_{b},\ r),\ i,\ v_{e})\ =\ \operatorname{SliceValue}(v_{b}',\ r)\quad (\operatorname{SliceBounds}(r,\ \operatorname{Len}(v_{b}))\ =\ (\mathsf{start},\ \mathsf{end})\ \land \ 0\ \le \ i\ <\ \mathsf{end}\ -\ \mathsf{start}\ \land \ \operatorname{IndexUpdate}(v_{b},\ \mathsf{start}\ +\ i,\ v_{e})\ =\ v_{b}')
$$

### 12.4.7 Diagnostics

**(Index-Slice-NonUsize)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ T_{b}\quad \operatorname{StripPerm}(T_{b})\ =\ \operatorname{TypeSlice}(T)\quad \lnot \ \operatorname{IndexUsizeExpr}(e_{2})\quad c\ =\ \operatorname{Code}(\mathsf{Index}-\mathsf{Slice}-\mathsf{NonUsize}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ \Uparrow \ c
\end{array}
$$

Direct slice indexing follows the same scalar-indexing model as array indexing. Diagnostics are defined for non-`usize` slice indices and non-indexable bases. Runtime slice-bounds failures panic through `EvalSigma-Index-OOB` for scalar indexing and `EvalSigma-Index-Range-OOB` for slicing.
