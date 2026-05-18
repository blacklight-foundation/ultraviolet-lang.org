---
title: "12.5 Ranges"
description: "12.5 Ranges from 12. Concrete Data Types of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "concrete-data-types"
specSection: "125-ranges"
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

## 12.5 Ranges

### 12.5.1 Syntax

```text
range_expr      ::= ".."
                  | ".." expr
                  | "..=" expr
                  | expr ".."
                  | expr ".." expr
                  | expr "..=" expr
range_type_name ::= "Range" | "RangeInclusive" | "RangeFrom" | "RangeTo" | "RangeToInclusive" | "RangeFull"
```

`Range<T>`, `RangeInclusive<T>`, `RangeFrom<T>`, `RangeTo<T>`, and `RangeToInclusive<T>` use the ordinary `generic_type_use` syntax of §14.2.1. `RangeFull` uses the ordinary nominal type-path syntax. No range-specific type parser is introduced.

### 12.5.2 Parsing

**(Parse-Range-To)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{".."})\quad \Gamma \ \vdash \ \operatorname{ParseAdd}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRange}(P)\ \Downarrow \ (P_{1},\ \operatorname{Range}(\texttt{To},\ \bot ,\ e))
\end{array}
$$

**(Parse-Range-ToInc)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"..="})\quad \Gamma \ \vdash \ \operatorname{ParseAdd}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRange}(P)\ \Downarrow \ (P_{1},\ \operatorname{Range}(\texttt{ToInclusive},\ \bot ,\ e))
\end{array}
$$

**(Parse-Range-Full)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{".."})\quad \operatorname{Tok}(\operatorname{Advance}(P))\ \in \ \mathsf{RangeStop} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRange}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \operatorname{Range}(\texttt{Full},\ \bot ,\ \bot ))
\end{array}
$$

**(Parse-Range-Lhs)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAdd}(P)\ \Downarrow \ (P_{1},\ e_{0})\quad \Gamma \ \vdash \ \operatorname{ParseRangeTail}(P_{1},\ e_{0})\ \Downarrow \ (P_{2},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRange}(P)\ \Downarrow \ (P_{2},\ e)
\end{array}
$$

**(Parse-RangeTail-None)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ \notin \ \{\operatorname{Operator}(\texttt{".."}),\ \operatorname{Operator}(\texttt{"..="})\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRangeTail}(P,\ e_{0})\ \Downarrow \ (P,\ e_{0})
\end{array}
$$

**(Parse-RangeTail-From)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{".."})\quad \operatorname{Tok}(\operatorname{Advance}(P))\ \in \ \mathsf{RangeStop} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRangeTail}(P,\ e_{0})\ \Downarrow \ (\operatorname{Advance}(P),\ \operatorname{Range}(\texttt{From},\ e_{0},\ \bot ))
\end{array}
$$

**(Parse-RangeTail-Exclusive)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{".."})\quad \Gamma \ \vdash \ \operatorname{ParseAdd}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e_{1}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRangeTail}(P,\ e_{0})\ \Downarrow \ (P_{1},\ \operatorname{Range}(\texttt{Exclusive},\ e_{0},\ e_{1}))
\end{array}
$$

**(Parse-RangeTail-Inclusive)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"..="})\quad \Gamma \ \vdash \ \operatorname{ParseAdd}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e_{1}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseRangeTail}(P,\ e_{0})\ \Downarrow \ (P_{1},\ \operatorname{Range}(\texttt{Inclusive},\ e_{0},\ e_{1}))
\end{array}
$$

Range surface types are parsed by the ordinary type parser:

- `Range<T>` elaborates to `TypeRange(T)`
- `RangeInclusive<T>` elaborates to `TypeRangeInclusive(T)`
- `RangeFrom<T>` elaborates to `TypeRangeFrom(T)`
- `RangeTo<T>` elaborates to `TypeRangeTo(T)`
- `RangeToInclusive<T>` elaborates to `TypeRangeToInclusive(T)`
- `RangeFull` elaborates to `TypeRangeFull`

### 12.5.3 AST Representation / Form

$$
\mathsf{RangeType}\ =\ \{\operatorname{TypeRange}(\mathsf{base}),\ \operatorname{TypeRangeInclusive}(\mathsf{base}),\ \operatorname{TypeRangeFrom}(\mathsf{base}),\ \operatorname{TypeRangeTo}(\mathsf{base}),\ \operatorname{TypeRangeToInclusive}(\mathsf{base}),\ \mathsf{TypeRangeFull}\}
$$

$$
\mathsf{RangeExpr}\ =\ \operatorname{Range}(\mathsf{kind},\ \mathsf{lo}_{\mathsf{opt}},\ \mathsf{hi}_{\mathsf{opt}})\ \mathsf{where}\ \mathsf{kind}\ \in \ \{\texttt{Exclusive},\ \texttt{Inclusive},\ \texttt{From},\ \texttt{To},\ \texttt{ToInclusive},\ \texttt{Full}\}
$$

$$
\operatorname{IsRangeType}(T)\ \Leftrightarrow \ T\ =\ \operatorname{TypeRange}(\_)\ \lor \ T\ =\ \operatorname{TypeRangeInclusive}(\_)\ \lor \ T\ =\ \operatorname{TypeRangeFrom}(\_)\ \lor \ T\ =\ \operatorname{TypeRangeTo}(\_)\ \lor \ T\ =\ \operatorname{TypeRangeToInclusive}(\_)\ \lor \ T\ =\ \mathsf{TypeRangeFull}
$$

### 12.5.4 Static Semantics

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Range}(\texttt{Full},\ \bot ,\ \bot )\ :\ \mathsf{Range}\ \Rightarrow \ \operatorname{ExprType}(\operatorname{Range}(\texttt{Full},\ \bot ,\ \bot ))\ =\ \mathsf{TypeRangeFull} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Range}(\texttt{To},\ \bot ,\ e)\ :\ \mathsf{Range}\ \Rightarrow \ \operatorname{ExprType}(\operatorname{Range}(\texttt{To},\ \bot ,\ e))\ =\ \operatorname{TypeRangeTo}(\operatorname{ExprType}(e)) \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Range}(\texttt{ToInclusive},\ \bot ,\ e)\ :\ \mathsf{Range}\ \Rightarrow \ \operatorname{ExprType}(\operatorname{Range}(\texttt{ToInclusive},\ \bot ,\ e))\ =\ \operatorname{TypeRangeToInclusive}(\operatorname{ExprType}(e)) \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Range}(\texttt{From},\ e,\ \bot )\ :\ \mathsf{Range}\ \Rightarrow \ \operatorname{ExprType}(\operatorname{Range}(\texttt{From},\ e,\ \bot ))\ =\ \operatorname{TypeRangeFrom}(\operatorname{ExprType}(e)) \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Range}(\texttt{Exclusive},\ e_{1},\ e_{2})\ :\ \mathsf{Range}\ \Rightarrow \ \operatorname{ExprType}(\operatorname{Range}(\texttt{Exclusive},\ e_{1},\ e_{2}))\ =\ \operatorname{TypeRange}(\operatorname{ExprType}(e_{1})) \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Range}(\texttt{Inclusive},\ e_{1},\ e_{2})\ :\ \mathsf{Range}\ \Rightarrow \ \operatorname{ExprType}(\operatorname{Range}(\texttt{Inclusive},\ e_{1},\ e_{2}))\ =\ \operatorname{TypeRangeInclusive}(\operatorname{ExprType}(e_{1}))
\end{array}
$$

**(T-Range-Lift)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ r\ :\ \mathsf{Range}\quad \operatorname{ExprType}(r)\ =\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ r\ :\ T
\end{array}
$$

**(Range-Full)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Range}(\texttt{Full},\ \bot ,\ \bot )\ :\ \mathsf{Range}
\end{array}
$$

**(Range-To)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Range}(\texttt{To},\ \bot ,\ e)\ :\ \mathsf{Range}
\end{array}
$$

**(Range-ToInclusive)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Range}(\texttt{ToInclusive},\ \bot ,\ e)\ :\ \mathsf{Range}
\end{array}
$$

**(Range-From)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Range}(\texttt{From},\ e,\ \bot )\ :\ \mathsf{Range}
\end{array}
$$

**(Range-Exclusive)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e_{1}\ :\ T\quad \Gamma ;\ R;\ L\ \vdash \ e_{2}\ :\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Range}(\texttt{Exclusive},\ e_{1},\ e_{2})\ :\ \mathsf{Range}
\end{array}
$$

**(Range-Inclusive)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e_{1}\ :\ T\quad \Gamma ;\ R;\ L\ \vdash \ e_{2}\ :\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Range}(\texttt{Inclusive},\ e_{1},\ e_{2})\ :\ \mathsf{Range}
\end{array}
$$

Range-pattern semantics are defined by §17.4.

### 12.5.5 Dynamic Semantics

$$
\begin{array}{l}
\operatorname{ValueType}(\operatorname{RangeVal}(\texttt{Exclusive},\ \mathsf{lo},\ \mathsf{hi}))\ =\ \operatorname{TypeRange}(T)\ \Leftrightarrow \ \operatorname{ValueType}(\mathsf{lo})\ =\ T\ \land \ \operatorname{ValueType}(\mathsf{hi})\ =\ T \\[0.16em]
\operatorname{ValueType}(\operatorname{RangeVal}(\texttt{Inclusive},\ \mathsf{lo},\ \mathsf{hi}))\ =\ \operatorname{TypeRangeInclusive}(T)\ \Leftrightarrow \ \operatorname{ValueType}(\mathsf{lo})\ =\ T\ \land \ \operatorname{ValueType}(\mathsf{hi})\ =\ T \\[0.16em]
\operatorname{ValueType}(\operatorname{RangeVal}(\texttt{From},\ \mathsf{lo},\ \bot ))\ =\ \operatorname{TypeRangeFrom}(T)\ \Leftrightarrow \ \operatorname{ValueType}(\mathsf{lo})\ =\ T \\[0.16em]
\operatorname{ValueType}(\operatorname{RangeVal}(\texttt{To},\ \bot ,\ \mathsf{hi}))\ =\ \operatorname{TypeRangeTo}(T)\ \Leftrightarrow \ \operatorname{ValueType}(\mathsf{hi})\ =\ T \\[0.16em]
\operatorname{ValueType}(\operatorname{RangeVal}(\texttt{ToInclusive},\ \bot ,\ \mathsf{hi}))\ =\ \operatorname{TypeRangeToInclusive}(T)\ \Leftrightarrow \ \operatorname{ValueType}(\mathsf{hi})\ =\ T \\[0.16em]
\operatorname{ValueType}(\operatorname{RangeVal}(\texttt{Full},\ \bot ,\ \bot ))\ =\ \mathsf{TypeRangeFull}
\end{array}
$$

**(EvalSigma-Range)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalOptSigma}(\mathsf{lo}_{\mathsf{opt}},\ \sigma_{0} )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{lo}}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalOptSigma}(\mathsf{hi}_{\mathsf{opt}},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{hi}}),\ \sigma_{2} )\quad r\ =\ \operatorname{RangeVal}(\mathsf{kind},\ v_{\mathsf{lo}},\ v_{\mathsf{hi}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Range}(\mathsf{kind},\ \mathsf{lo}_{\mathsf{opt}},\ \mathsf{hi}_{\mathsf{opt}}),\ \sigma_{0} )\ \Downarrow \ (\operatorname{Val}(r),\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Range-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalOptSigma}(\mathsf{lo}_{\mathsf{opt}},\ \sigma_{0} )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Range}(\mathsf{kind},\ \mathsf{lo}_{\mathsf{opt}},\ \mathsf{hi}_{\mathsf{opt}}),\ \sigma_{0} )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Range-Ctrl-Hi)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalOptSigma}(\mathsf{lo}_{\mathsf{opt}},\ \sigma_{0} )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{lo}}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalOptSigma}(\mathsf{hi}_{\mathsf{opt}},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Range}(\mathsf{kind},\ \mathsf{lo}_{\mathsf{opt}},\ \mathsf{hi}_{\mathsf{opt}}),\ \sigma_{0} )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} )
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Inc}(v)\ =\ v'\ \Leftrightarrow \ v\ =\ \operatorname{IntVal}(t,\ x)\ \land \ x'\ =\ x\ +\ 1\ \land \ \operatorname{InRange}(x',\ t)\ \land \ v'\ =\ \operatorname{IntVal}(t,\ x') \\[0.16em]
\operatorname{SliceBoundsRaw}(\operatorname{RangeVal}(\texttt{Exclusive},\ s,\ e),\ L)\ =\ (\mathsf{start},\ \mathsf{end})\ \Leftrightarrow \ \operatorname{IndexNum}(s)\ =\ \mathsf{start}\ \land \ \operatorname{IndexNum}(e)\ =\ \mathsf{end} \\[0.16em]
\operatorname{SliceBoundsRaw}(\operatorname{RangeVal}(\texttt{Inclusive},\ s,\ e),\ L)\ =\ (\mathsf{start},\ \mathsf{end})\ \Leftrightarrow \ \operatorname{IndexNum}(s)\ =\ \mathsf{start}\ \land \ \operatorname{Inc}(e)\ =\ e'\ \land \ \operatorname{IndexNum}(e')\ =\ \mathsf{end} \\[0.16em]
\operatorname{SliceBoundsRaw}(\operatorname{RangeVal}(\texttt{From},\ s,\ \bot ),\ L)\ =\ (\mathsf{start},\ L)\ \Leftrightarrow \ \operatorname{IndexNum}(s)\ =\ \mathsf{start} \\[0.16em]
\operatorname{SliceBoundsRaw}(\operatorname{RangeVal}(\texttt{To},\ \bot ,\ e),\ L)\ =\ (0,\ \mathsf{end})\ \Leftrightarrow \ \operatorname{IndexNum}(e)\ =\ \mathsf{end} \\[0.16em]
\operatorname{SliceBoundsRaw}(\operatorname{RangeVal}(\texttt{ToInclusive},\ \bot ,\ e),\ L)\ =\ (0,\ \mathsf{end})\ \Leftrightarrow \ \operatorname{Inc}(e)\ =\ e'\ \land \ \operatorname{IndexNum}(e')\ =\ \mathsf{end} \\[0.16em]
\operatorname{SliceBoundsRaw}(\operatorname{RangeVal}(\texttt{Full},\ \bot ,\ \bot ),\ L)\ =\ (0,\ L) \\[0.16em]
\operatorname{SliceBounds}(r,\ L)\ =\ (\mathsf{start},\ \mathsf{end})\ \Leftrightarrow \ \operatorname{SliceBoundsRaw}(r,\ L)\ =\ (\mathsf{start},\ \mathsf{end})\ \land \ 0\ \le \ \mathsf{start}\ \le \ \mathsf{end}\ \le \ L \\[0.16em]
\operatorname{SliceBounds}(r,\ L)\ =\ \bot \ \Leftrightarrow \ \operatorname{SliceBoundsRaw}(r,\ L)\ =\ \bot \ \lor \ (\exists \ \mathsf{start},\ \mathsf{end}.\ \operatorname{SliceBoundsRaw}(r,\ L)\ =\ (\mathsf{start},\ \mathsf{end})\ \land \ \lnot \ (0\ \le \ \mathsf{start}\ \le \ \mathsf{end}\ \le \ L))
\end{array}
$$

### 12.5.6 Lowering

$$
\mathsf{ChecksJudg}\ =\ \{\mathsf{LowerRangeExpr},\ \mathsf{CheckIndex},\ \mathsf{CheckRange},\ \mathsf{LowerTransmute},\ \mathsf{LowerRawDeref}\}
$$

$$
\begin{array}{l}
\operatorname{ValueBits}(\operatorname{TypeRange}(T),\ r)\ =\ \mathsf{bits}\ \Leftrightarrow \ r\ =\ \operatorname{RangeVal}(\texttt{Exclusive},\ v_{\mathsf{lo}},\ v_{\mathsf{hi}})\ \land \ \operatorname{TupleLayout}([T,\ T])\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \ \land \ \operatorname{StructBits}([T,\ T],\ [v_{\mathsf{lo}},\ v_{\mathsf{hi}}],\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{bits} \\[0.16em]
\operatorname{ValueBits}(\operatorname{TypeRangeInclusive}(T),\ r)\ =\ \mathsf{bits}\ \Leftrightarrow \ r\ =\ \operatorname{RangeVal}(\texttt{Inclusive},\ v_{\mathsf{lo}},\ v_{\mathsf{hi}})\ \land \ \operatorname{TupleLayout}([T,\ T])\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \ \land \ \operatorname{StructBits}([T,\ T],\ [v_{\mathsf{lo}},\ v_{\mathsf{hi}}],\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{bits} \\[0.16em]
\operatorname{ValueBits}(\operatorname{TypeRangeFrom}(T),\ r)\ =\ \mathsf{bits}\ \Leftrightarrow \ r\ =\ \operatorname{RangeVal}(\texttt{From},\ v_{\mathsf{lo}},\ \bot )\ \land \ \operatorname{TupleLayout}([T])\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \ \land \ \operatorname{StructBits}([T],\ [v_{\mathsf{lo}}],\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{bits} \\[0.16em]
\operatorname{ValueBits}(\operatorname{TypeRangeTo}(T),\ r)\ =\ \mathsf{bits}\ \Leftrightarrow \ r\ =\ \operatorname{RangeVal}(\texttt{To},\ \bot ,\ v_{\mathsf{hi}})\ \land \ \operatorname{TupleLayout}([T])\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \ \land \ \operatorname{StructBits}([T],\ [v_{\mathsf{hi}}],\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{bits} \\[0.16em]
\operatorname{ValueBits}(\operatorname{TypeRangeToInclusive}(T),\ r)\ =\ \mathsf{bits}\ \Leftrightarrow \ r\ =\ \operatorname{RangeVal}(\texttt{ToInclusive},\ \bot ,\ v_{\mathsf{hi}})\ \land \ \operatorname{TupleLayout}([T])\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \ \land \ \operatorname{StructBits}([T],\ [v_{\mathsf{hi}}],\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{bits} \\[0.16em]
\operatorname{ValueBits}(\mathsf{TypeRangeFull},\ r)\ =\ \mathsf{bits}\ \Leftrightarrow \ r\ =\ \operatorname{RangeVal}(\texttt{Full},\ \bot ,\ \bot )\ \land \ \mathsf{bits}\ =\ []
\end{array}
$$

**(Lower-Range-Full)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerRangeExpr}(\operatorname{Range}(\texttt{Full},\ \bot ,\ \bot ))\ \Downarrow \ \langle \varepsilon ,\ \operatorname{RangeVal}(\texttt{Full},\ \bot ,\ \bot )\rangle 
\end{array}
$$

**(Lower-Range-To)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerRangeExpr}(\operatorname{Range}(\texttt{To},\ \bot ,\ e))\ \Downarrow \ \langle \mathsf{IR}_{e},\ \operatorname{RangeVal}(\texttt{To},\ \bot ,\ v)\rangle 
\end{array}
$$

**(Lower-Range-ToInclusive)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerRangeExpr}(\operatorname{Range}(\texttt{ToInclusive},\ \bot ,\ e))\ \Downarrow \ \langle \mathsf{IR}_{e},\ \operatorname{RangeVal}(\texttt{ToInclusive},\ \bot ,\ v)\rangle 
\end{array}
$$

**(Lower-Range-From)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerRangeExpr}(\operatorname{Range}(\texttt{From},\ e,\ \bot ))\ \Downarrow \ \langle \mathsf{IR}_{e},\ \operatorname{RangeVal}(\texttt{From},\ v,\ \bot )\rangle 
\end{array}
$$

**(Lower-Range-Inclusive)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e_{1})\ \Downarrow \ \langle \mathsf{IR}_{1},\ v_{1}\rangle \quad \Gamma \ \vdash \ \operatorname{LowerExpr}(e_{2})\ \Downarrow \ \langle \mathsf{IR}_{2},\ v_{2}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerRangeExpr}(\operatorname{Range}(\texttt{Inclusive},\ e_{1},\ e_{2}))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{1},\ \mathsf{IR}_{2}),\ \operatorname{RangeVal}(\texttt{Inclusive},\ v_{1},\ v_{2})\rangle 
\end{array}
$$

**(Lower-Range-Exclusive)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e_{1})\ \Downarrow \ \langle \mathsf{IR}_{1},\ v_{1}\rangle \quad \Gamma \ \vdash \ \operatorname{LowerExpr}(e_{2})\ \Downarrow \ \langle \mathsf{IR}_{2},\ v_{2}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerRangeExpr}(\operatorname{Range}(\texttt{Exclusive},\ e_{1},\ e_{2}))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{1},\ \mathsf{IR}_{2}),\ \operatorname{RangeVal}(\texttt{Exclusive},\ v_{1},\ v_{2})\rangle 
\end{array}
$$

**(Size-Range)**

$$
\begin{array}{l}
\operatorname{TupleLayout}([T,\ T])\ \Downarrow \ \langle \mathsf{size},\ \_,\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeRange}(T))\ =\ \mathsf{size}
\end{array}
$$

**(Align-Range)**

$$
\begin{array}{l}
\operatorname{TupleLayout}([T,\ T])\ \Downarrow \ \langle \_,\ \mathsf{align},\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeRange}(T))\ =\ \mathsf{align}
\end{array}
$$

**(Layout-Range)**

$$
\begin{array}{l}
\operatorname{TupleLayout}([T,\ T])\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(\operatorname{TypeRange}(T))\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

**(Size-RangeInclusive)**

$$
\begin{array}{l}
\operatorname{TupleLayout}([T,\ T])\ \Downarrow \ \langle \mathsf{size},\ \_,\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeRangeInclusive}(T))\ =\ \mathsf{size}
\end{array}
$$

**(Align-RangeInclusive)**

$$
\begin{array}{l}
\operatorname{TupleLayout}([T,\ T])\ \Downarrow \ \langle \_,\ \mathsf{align},\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeRangeInclusive}(T))\ =\ \mathsf{align}
\end{array}
$$

**(Layout-RangeInclusive)**

$$
\begin{array}{l}
\operatorname{TupleLayout}([T,\ T])\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(\operatorname{TypeRangeInclusive}(T))\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

**(Size-RangeFrom)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ \mathsf{size} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeRangeFrom}(T))\ =\ \mathsf{size}
\end{array}
$$

**(Align-RangeFrom)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{align} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeRangeFrom}(T))\ =\ \mathsf{align}
\end{array}
$$

**(Layout-RangeFrom)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeRangeFrom}(T))\ =\ \mathsf{size}\quad \Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeRangeFrom}(T))\ =\ \mathsf{align} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(\operatorname{TypeRangeFrom}(T))\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

**(Size-RangeTo)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ \mathsf{size} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeRangeTo}(T))\ =\ \mathsf{size}
\end{array}
$$

**(Align-RangeTo)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{align} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeRangeTo}(T))\ =\ \mathsf{align}
\end{array}
$$

**(Layout-RangeTo)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeRangeTo}(T))\ =\ \mathsf{size}\quad \Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeRangeTo}(T))\ =\ \mathsf{align} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(\operatorname{TypeRangeTo}(T))\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

**(Size-RangeToInclusive)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ \mathsf{size} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeRangeToInclusive}(T))\ =\ \mathsf{size}
\end{array}
$$

**(Align-RangeToInclusive)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{align} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeRangeToInclusive}(T))\ =\ \mathsf{align}
\end{array}
$$

**(Layout-RangeToInclusive)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeRangeToInclusive}(T))\ =\ \mathsf{size}\quad \Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeRangeToInclusive}(T))\ =\ \mathsf{align} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(\operatorname{TypeRangeToInclusive}(T))\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

**(Size-RangeFull)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(\mathsf{TypeRangeFull})\ =\ 0
\end{array}
$$

**(Align-RangeFull)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(\mathsf{TypeRangeFull})\ =\ 1
\end{array}
$$

**(Layout-RangeFull)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(\mathsf{TypeRangeFull})\ \Downarrow \ \langle 0,\ 1\rangle 
\end{array}
$$

### 12.5.7 Diagnostics

Diagnostics are defined for non-constant and empty range patterns in §17.4. Slice-bounds failures induced by ranges panic at runtime when `SliceBounds` is undefined.
