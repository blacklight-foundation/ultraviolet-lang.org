---
title: "16.2 Access and Place Expressions"
description: "16.2 Access and Place Expressions from 16. Expressions of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "expressions"
specSection: "162-access-and-place-expressions"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/expressions/">16. Expressions</a>
  <span>Expressions</span>
</div>

## 16.2 Access and Place Expressions

### 16.2.1 Syntax

```text
access_suffix ::= "." identifier | "." decimal_literal | "[" expression "]"
place_expr    ::= "*" place_expr | postfix_expr
```

`postfix_expr` is the shared postfix-expression carrier. This section owns the access and place-specific suffix cases only. Call, method-call, and propagation postfix forms are owned by §§16.3 and 16.8.

### 16.2.2 Parsing

**(Postfix-Field)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"."})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(P)))\quad \mathsf{name}\ =\ \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(P))) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PostfixStep}(P,\ e)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P)),\ \operatorname{FieldAccess}(e,\ \mathsf{name}))
\end{array}
$$

**(Postfix-TupleIndex)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"."})\quad t\ =\ \operatorname{Tok}(\operatorname{Advance}(P))\quad t.\mathsf{kind}\ =\ \mathsf{IntLiteral}\quad \mathsf{idx}\ =\ \operatorname{IntValue}(t) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PostfixStep}(P,\ e)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P)),\ \operatorname{TupleAccess}(e,\ \mathsf{idx}))
\end{array}
$$

**(Postfix-Index)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"["})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{idx})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"]"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PostfixStep}(P,\ e)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{IndexAccess}(e,\ \mathsf{idx}))
\end{array}
$$

$$
\operatorname{IsPlace}(e)\ \Leftrightarrow \ e\ \in \ \{\operatorname{Identifier}(\_),\ \operatorname{FieldAccess}(\_,\ \_),\ \operatorname{TupleAccess}(\_,\ \_),\ \operatorname{IndexAccess}(\_,\ \_)\}\ \lor \ (\exists \ p.\ e\ =\ \operatorname{Deref}(p)\ \land \ \operatorname{IsPlace}(p))
$$

**(Parse-Place-Deref)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"*"})\quad \Gamma \ \vdash \ \operatorname{ParsePlace}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ p) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePlace}(P)\ \Downarrow \ (P_{1},\ \operatorname{Deref}(p))
\end{array}
$$

**(Parse-Place-Postfix)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParsePostfix}(P)\ \Downarrow \ (P_{1},\ e)\quad \operatorname{IsPlace}(e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePlace}(P)\ \Downarrow \ (P_{1},\ e)
\end{array}
$$

**(Parse-Place-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParsePostfix}(P)\ \Downarrow \ (P_{1},\ e)\quad \lnot \ \operatorname{IsPlace}(e)\quad c\ =\ \operatorname{Code}(\mathsf{Parse}-\mathsf{Syntax}-\mathsf{Err})\quad \Gamma \ \vdash \ \operatorname{Emit}(c,\ \operatorname{Tok}(P).\mathsf{span})\quad \Gamma \ \vdash \ \operatorname{SyncStmt}(P_{1})\ \Downarrow \ P_{2} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePlace}(P)\ \Downarrow \ (P_{2},\ \operatorname{ErrorExpr}(\operatorname{SpanBetween}(P,\ P_{2})))
\end{array}
$$

### 16.2.3 AST Representation / Form

$$
\mathsf{Expr}\ =\ \operatorname{FieldAccess}(\mathsf{base},\ \mathsf{name})\ \mid \ \operatorname{TupleAccess}(\mathsf{base},\ \mathsf{index})\ \mid \ \operatorname{IndexAccess}(\mathsf{base},\ \mathsf{index}_{\mathsf{expr}})\ \mid \ \operatorname{Deref}(\mathsf{expr})\ \mid \ \ldots
$$

$$
\mathsf{PlaceForms0}\ =\ \{\operatorname{Identifier}(\_),\ \operatorname{FieldAccess}(\_,\ \_),\ \operatorname{TupleAccess}(\_,\ \_),\ \operatorname{IndexAccess}(\_,\ \_),\ \operatorname{Deref}(\_)\}
$$

$$
\begin{array}{l}
\operatorname{FieldVis}(R,\ f)\ =\ \mathsf{vis}\ \Leftrightarrow \ \langle \mathsf{vis},\ f,\ T_{f},\ \_\rangle \ \in \ \operatorname{Fields}(R) \\[0.16em]
\operatorname{FieldVisible}(m,\ R,\ f)\ \Leftrightarrow \ \operatorname{FieldVis}(R,\ f)\ \in \ \{\texttt{public},\ \texttt{internal}\}\ \lor \ (\operatorname{FieldVis}(R,\ f)\ =\ \texttt{private}\ \land \ \operatorname{ModuleOfPath}(\operatorname{RecordPath}(R))\ =\ m)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ConstTupleIndex}(i)\ \Leftrightarrow \ \exists \ n\ \in \ \mathbb{Z} .\ i\ =\ n \\[0.16em]
\operatorname{ConstIndex}(e)\ \Leftrightarrow \ \exists \ n.\ \Gamma \ \vdash \ \operatorname{ConstLen}(e)\ \Downarrow \ n \\[0.16em]
\operatorname{RangeIndexType}(T_{r})\ \Leftrightarrow \ T_{r}\ =\ \operatorname{TypeRange}(\operatorname{TypePrim}(\texttt{usize}))\ \lor \ T_{r}\ =\ \operatorname{TypeRangeInclusive}(\operatorname{TypePrim}(\texttt{usize}))\ \lor \ T_{r}\ =\ \operatorname{TypeRangeFrom}(\operatorname{TypePrim}(\texttt{usize}))\ \lor \ T_{r}\ =\ \operatorname{TypeRangeTo}(\operatorname{TypePrim}(\texttt{usize}))\ \lor \ T_{r}\ =\ \operatorname{TypeRangeToInclusive}(\operatorname{TypePrim}(\texttt{usize}))\ \lor \ T_{r}\ =\ \mathsf{TypeRangeFull}
\end{array}
$$

### 16.2.4 Static Semantics

**(T-Field-Record)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \operatorname{FieldType}(R,\ f)\ =\ T_{f}\quad \operatorname{FieldVisible}(m,\ R,\ f)\quad \operatorname{BitcopyType}(T_{f}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{FieldAccess}(e,\ f)\ :\ T_{f}
\end{array}
$$

**(T-Field-Record-Perm)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypePerm}(p,\ \operatorname{TypePath}(q))\quad \operatorname{RecordDecl}(q)\ =\ R\quad \operatorname{FieldType}(R,\ f)\ =\ T_{f}\quad \operatorname{FieldVisible}(m,\ R,\ f)\quad \operatorname{BitcopyType}(\operatorname{TypePerm}(p,\ T_{f})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{FieldAccess}(e,\ f)\ :\ \operatorname{TypePerm}(p,\ T_{f})
\end{array}
$$

**(P-Field-Record)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\mathsf{place}\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \operatorname{FieldType}(R,\ f)\ =\ T_{f}\quad \operatorname{FieldVisible}(m,\ R,\ f) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{FieldAccess}(e,\ f)\ :\mathsf{place}\ T_{f}
\end{array}
$$

**(P-Field-Record-Perm)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\mathsf{place}\ \operatorname{TypePerm}(p,\ \operatorname{TypePath}(q))\quad \operatorname{RecordDecl}(q)\ =\ R\quad \operatorname{FieldType}(R,\ f)\ =\ T_{f}\quad \operatorname{FieldVisible}(m,\ R,\ f) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{FieldAccess}(e,\ f)\ :\mathsf{place}\ \operatorname{TypePerm}(p,\ T_{f})
\end{array}
$$

**(T-Tuple-Index)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ :\ \operatorname{TypeTuple}([T_{0},\ \ldots ,\ T\_\{n-1\}])\quad 0\ \le \ i\ <\ n\quad \operatorname{BitcopyType}(T_{i}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TupleAccess}(e,\ i)\ :\ T_{i}
\end{array}
$$

**(T-Tuple-Index-Perm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ :\ \operatorname{TypePerm}(p,\ \operatorname{TypeTuple}([T_{0},\ \ldots ,\ T\_\{n-1\}]))\quad 0\ \le \ i\ <\ n\quad \operatorname{BitcopyType}(\operatorname{TypePerm}(p,\ T_{i})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TupleAccess}(e,\ i)\ :\ \operatorname{TypePerm}(p,\ T_{i})
\end{array}
$$

**(P-Tuple-Index)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ :\mathsf{place}\ \operatorname{TypeTuple}([T_{0},\ \ldots ,\ T\_\{n-1\}])\quad 0\ \le \ i\ <\ n \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TupleAccess}(e,\ i)\ :\mathsf{place}\ T_{i}
\end{array}
$$

**(P-Tuple-Index-Perm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ :\mathsf{place}\ \operatorname{TypePerm}(p,\ \operatorname{TypeTuple}([T_{0},\ \ldots ,\ T\_\{n-1\}]))\quad 0\ \le \ i\ <\ n \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TupleAccess}(e,\ i)\ :\mathsf{place}\ \operatorname{TypePerm}(p,\ T_{i})
\end{array}
$$

**(T-Index-Array)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypeArray}(T,\ \mathsf{len})\quad \operatorname{IndexUsizeExpr}(e_{2})\quad \operatorname{ConstIndex}(e_{2})\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e_{2})\ \Downarrow \ i\quad \Gamma \ \vdash \ \operatorname{ConstLen}(\mathsf{len})\ \Downarrow \ n\quad i\ <\ n\quad \operatorname{BitcopyType}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\ T
\end{array}
$$

**(T-Index-Array-Dynamic)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypeArray}(T,\ \mathsf{len})\quad \operatorname{IndexUsizeExpr}(e_{2})\quad \lnot \ \operatorname{ConstIndex}(e_{2})\quad \mathsf{InDynamicContext}\quad \operatorname{BitcopyType}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\ T
\end{array}
$$

**(T-Index-Array-Perm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypePerm}(p,\ \operatorname{TypeArray}(T,\ \mathsf{len}))\quad \operatorname{IndexUsizeExpr}(e_{2})\quad \operatorname{ConstIndex}(e_{2})\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e_{2})\ \Downarrow \ i\quad \Gamma \ \vdash \ \operatorname{ConstLen}(\mathsf{len})\ \Downarrow \ n\quad i\ <\ n\quad \operatorname{BitcopyType}(\operatorname{TypePerm}(p,\ T)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\ \operatorname{TypePerm}(p,\ T)
\end{array}
$$

**(T-Index-Array-Perm-Dynamic)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypePerm}(p,\ \operatorname{TypeArray}(T,\ \mathsf{len}))\quad \operatorname{IndexUsizeExpr}(e_{2})\quad \lnot \ \operatorname{ConstIndex}(e_{2})\quad \mathsf{InDynamicContext}\quad \operatorname{BitcopyType}(\operatorname{TypePerm}(p,\ T)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\ \operatorname{TypePerm}(p,\ T)
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

**(P-Index-Array)**, **(P-Index-Array-Perm)**, **(P-Index-Array-Dynamic)**, **(P-Index-Array-Perm-Dynamic)**, **(P-Index-Slice)**, **(P-Index-Slice-Perm)**, **(P-Slice-From-Array)**, **(P-Slice-From-Array-Perm)**, **(P-Slice-From-Slice)**, and **(P-Slice-From-Slice-Perm)** are the place-typing counterparts of the rules above. They preserve the same index admissibility conditions while returning `:place` judgments.

**(Coerce-Array-Slice)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ :\ \operatorname{TypePerm}(p,\ \operatorname{TypeArray}(T,\ n)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ e\ :\ \operatorname{TypePerm}(p,\ \operatorname{TypeSlice}(T))
\end{array}
$$

ValueCopyContext(e) holds when the enclosing operation must duplicate the value represented by `e`. It includes explicit `copy e`, by-value materialization for Bitcopy-only operations, and array-repeat/value-spread contexts. It does not include `move e`, ownership-return destinations, address formation, or by-reference argument passing.

**(Union-DirectAccess-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ U\quad \operatorname{StripPerm}(U)\ =\ \operatorname{TypeUnion}(\_)\quad c\ =\ \operatorname{Code}(\mathsf{Union}-\mathsf{DirectAccess}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{FieldAccess}(e,\ f)\ \Uparrow \ c
\end{array}
$$

**(ValueUse-NonBitcopyPlace)**

$$
\begin{array}{l}
\operatorname{ValueCopyContext}(e)\quad \operatorname{IsPlace}(e)\quad \lnot \ \operatorname{BitcopyType}(\operatorname{ExprType}(e))\quad c\ =\ \operatorname{Code}(\mathsf{ValueUse}-\mathsf{NonBitcopyPlace}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ e\ \Uparrow \ c
\end{array}
$$

### 16.2.5 Dynamic Semantics

**(EvalSigma-FieldAccess)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{base},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{b}),\ \sigma_{1} )\quad \operatorname{FieldValue}(v_{b},\ f)\ =\ v_{f} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{FieldAccess}(\mathsf{base},\ f),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{f}),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-TupleAccess)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{base},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{b}),\ \sigma_{1} )\quad \operatorname{TupleValue}(v_{b},\ i)\ =\ v_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{TupleAccess}(\mathsf{base},\ i),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{i}),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Index)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{base},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{b}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{idx},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(v_{i}),\ \sigma_{2} )\quad \operatorname{IndexValue}(v_{b},\ v_{i})\ =\ v_{e} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{IndexAccess}(\mathsf{base},\ \mathsf{idx}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{e}),\ \sigma_{2} )
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

**(EvalSigma-FieldAccess-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{base},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{FieldAccess}(\mathsf{base},\ f),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Index-Ctrl-Base)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{base},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{IndexAccess}(\mathsf{base},\ \mathsf{idx}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Index-Ctrl-Idx)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{base},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{b}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{idx},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{IndexAccess}(\mathsf{base},\ \mathsf{idx}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} )
\end{array}
$$

Bounds failures in scalar and range indexing evaluate to `Ctrl(Panic)` as defined by `EvalSigma-Index-OOB` and `EvalSigma-Index-Range-OOB`. Base and index control-flow propagation are defined by `EvalSigma-FieldAccess-Ctrl`, `EvalSigma-TupleAccess-Ctrl` (§12.2.5), `EvalSigma-Index-Ctrl-Base`, and `EvalSigma-Index-Ctrl-Idx`.

### 16.2.6 Lowering

**(Lower-Expr-FieldAccess)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(\mathsf{base})\ \Downarrow \ \langle \mathsf{IR}_{b},\ v_{b}\rangle \quad \operatorname{FieldValue}(v_{b},\ f)\ =\ v_{f} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{FieldAccess}(\mathsf{base},\ f))\ \Downarrow \ \langle \mathsf{IR}_{b},\ v_{f}\rangle
\end{array}
$$

**(Lower-Expr-TupleAccess)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(\mathsf{base})\ \Downarrow \ \langle \mathsf{IR}_{b},\ v_{b}\rangle \quad \operatorname{TupleValue}(v_{b},\ i)\ =\ v_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{TupleAccess}(\mathsf{base},\ i))\ \Downarrow \ \langle \mathsf{IR}_{b},\ v_{i}\rangle
\end{array}
$$

**(Lower-Expr-Index-Scalar-Static)**, **(Lower-Expr-Index-Scalar)**, **(Lower-Expr-Index-Scalar-OOB)**, **(Lower-Expr-Index-Range)**, and **(Lower-Expr-Index-Range-OOB)** lower scalar and slicing access with the required bounds checks.

**(Lower-Place-Ident)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerPlace}(\operatorname{Identifier}(x))\ \Downarrow \ \operatorname{Identifier}(x)
\end{array}
$$

**(Lower-Place-Field)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerPlace}(p)\ \Downarrow \ l \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerPlace}(\operatorname{FieldAccess}(p,\ f))\ \Downarrow \ \operatorname{FieldAccess}(l,\ f)
\end{array}
$$

**(Lower-Place-Tuple)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerPlace}(p)\ \Downarrow \ l \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerPlace}(\operatorname{TupleAccess}(p,\ i))\ \Downarrow \ \operatorname{TupleAccess}(l,\ i)
\end{array}
$$

**(Lower-Place-Index)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerPlace}(p)\ \Downarrow \ l \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerPlace}(\operatorname{IndexAccess}(p,\ \mathsf{idx}))\ \Downarrow \ \operatorname{IndexAccess}(l,\ \mathsf{idx})
\end{array}
$$

**(Lower-Place-Deref)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerPlace}(p)\ \Downarrow \ l \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerPlace}(\operatorname{Deref}(p))\ \Downarrow \ \operatorname{Deref}(l)
\end{array}
$$

`LowerReadPlace`, `LowerWritePlace`, and `LowerWritePlaceSub` preserve the observable read/write behavior of access places. Assignment uses these rules via §18.4; move and address-of wrappers use them via §16.8.

### 16.2.7 Diagnostics

Diagnostics are defined for unknown or inaccessible record fields, tuple indexing on non-tuples, non-constant tuple indices, tuple index out of bounds, non-`usize` array indices, non-constant array indices outside dynamic-checking contexts, out-of-bounds array and slice access, indexing non-indexable values, direct field access on unions, and value-copy use of non-`Bitcopy` places.

Scalar indexing of arrays and slices is governed by `IndexUsizeExpr` from §12.3.4, which contextually checks direct unsuffixed integer literals as `usize` while requiring non-literal expressions to already type as `usize`. Array/slice range indexing is governed by `RangeIndexExpr` from §12.4.4. The corresponding non-`usize` diagnostics are `Index-Array-NonUsize` and `Index-Slice-NonUsize`. Scalar out-of-bounds access and range out-of-bounds slicing lower to panic through `EvalSigma-Index-OOB` and `EvalSigma-Index-Range-OOB`.
