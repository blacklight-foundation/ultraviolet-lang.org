---
title: "12.2 Tuples"
description: "12.2 Tuples from 12. Concrete Data Types of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "concrete-data-types"
specSection: "122-tuples"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/concrete-data-types/">12. Concrete Data Types</a>
  <span>Concrete Data Types</span>
</div>

## 12.2 Tuples

### 12.2.1 Syntax

```text
tuple_type       ::= "(" ")"
                   | "(" type ";)"
                   | "(" type ("," type)+ trailing_comma? ")"
tuple_expr       ::= "(" ")"
                   | "(" expr ";)"
                   | "(" expr ("," expr)+ trailing_comma? ")"
tuple_projection ::= postfix_expr "." int_literal
```

The singleton comma forms `("(" type ",)")` and `("(" expr ",)")` are ill-formed. A trailing comma denotes continuation only and does not create a one-element tuple.

### 12.2.2 Parsing

**(Parse-Tuple-Type)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseTupleTypeElems}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{elems})\quad \mathsf{elems}\ \ne \ []\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{")"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseNonPermType}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{TypeTuple}(\mathsf{elems}))
\end{array}
$$

**(Parse-TupleTypeElems-Empty)**
IsPunc(Tok(P), ")")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseTupleTypeElems}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-TupleTypeElems-One)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseType}(P)\ \Downarrow \ (P_{1},\ t)\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{";"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseTupleTypeElems}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ [t])
\end{array}
$$

**(Parse-TupleTypeElems-Many)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseType}(P)\ \Downarrow \ (P_{1},\ t_{1})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ t_{2})\quad \Gamma \ \vdash \ \operatorname{ParseTypeListTail}(P_{2},\ [t_{2}])\ \Downarrow \ (P_{3},\ \mathsf{ts}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseTupleTypeElems}(P)\ \Downarrow \ (P_{3},\ [t_{1}]\ \mathbin{++} \ \mathsf{ts})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ParenDelta}(\operatorname{Punctuator}(\texttt{"("}))\ =\ 1 \\[0.16em]
\operatorname{ParenDelta}(\operatorname{Punctuator}(\texttt{")"}))\ =\ -1 \\[0.16em]
\operatorname{ParenDelta}(t)\ =\ 0\ \mathsf{if}\ t.\mathsf{kind}\ \notin \ \{\operatorname{Punctuator}(\texttt{"("}),\ \operatorname{Punctuator}(\texttt{")"})\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BracketDelta}(\operatorname{Punctuator}(\texttt{"["}))\ =\ 1 \\[0.16em]
\operatorname{BracketDelta}(\operatorname{Punctuator}(\texttt{"]"}))\ =\ -1 \\[0.16em]
\operatorname{BracketDelta}(t)\ =\ 0\ \mathsf{if}\ t.\mathsf{kind}\ \notin \ \{\operatorname{Punctuator}(\texttt{"["}),\ \operatorname{Punctuator}(\texttt{"]"})\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BraceDelta}(\operatorname{Punctuator}(\texttt{"\{"}))\ =\ 1 \\[0.16em]
\operatorname{BraceDelta}(\operatorname{Punctuator}(\texttt{"\}"}))\ =\ -1 \\[0.16em]
\operatorname{BraceDelta}(t)\ =\ 0\ \mathsf{if}\ t.\mathsf{kind}\ \notin \ \{\operatorname{Punctuator}(\texttt{"\{"}),\ \operatorname{Punctuator}(\texttt{"\}"})\}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{TupleScanDepth}\ =\ \langle p,\ q,\ r\rangle \ \mathsf{where}\ p,\ q,\ r\ \in \ \mathsf{Nat} \\[0.16em]
\operatorname{TupleScan}(P,\ d)\ \Downarrow \ b\ \Leftrightarrow \ \operatorname{TupleScan}(P,\ \langle d,\ 0,\ 0\rangle )\ \Downarrow \ b \\[0.16em]
\operatorname{TupleScanStep}(\langle p,\ q,\ r\rangle ,\ t)\ =\ \langle p\ +\ \operatorname{ParenDelta}(t),\ \operatorname{max}(0,\ q\ +\ \operatorname{BracketDelta}(t)),\ \operatorname{max}(0,\ r\ +\ \operatorname{BraceDelta}(t))\rangle \\[0.16em]
\operatorname{TupleScanOuterSep}(\langle p,\ q,\ r\rangle )\ \Leftrightarrow \ p\ =\ 1\ \land \ q\ =\ 0\ \land \ r\ =\ 0 \\[0.16em]
\operatorname{TupleScanSingletonComma}(P)\ \Leftrightarrow \ \operatorname{Tok}(P)\ =\ \operatorname{Punctuator}(\texttt{","})\ \land \ \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{SkipNL}(\operatorname{Advance}(P))),\ \texttt{")"}) \\[0.16em]
\operatorname{TupleScanEndParen}(P,\ \langle p,\ q,\ r\rangle )\ \Leftrightarrow \ \operatorname{Tok}(P)\ =\ \operatorname{Punctuator}(\texttt{")"})\ \land \ p\ =\ 1 \\[0.16em]
\operatorname{TupleScanSep}(P,\ D)\ \Leftrightarrow \ \operatorname{Tok}(P)\ \in \ \{\operatorname{Punctuator}(\texttt{","}),\ \operatorname{Punctuator}(\texttt{";"})\}\ \land \ \operatorname{TupleScanOuterSep}(D) \\[0.16em]
\operatorname{TupleScanAdvance}(P,\ D)\ \Leftrightarrow \ \operatorname{Tok}(P)\ \ne \ \mathsf{EOF}\ \land \ \lnot \ \operatorname{TupleScanEndParen}(P,\ D)\ \land \ \lnot \ \operatorname{TupleScanSep}(P,\ D)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{TupleScan}(P,\ D)\ \Downarrow \ b \\[0.16em]
\operatorname{Tok}(P)\ =\ \mathsf{EOF} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{TupleScan}(P,\ D)\ \Downarrow \ \mathsf{false}
\end{array}
$$
TupleScanEndParen(P, D)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{TupleScan}(P,\ D)\ \Downarrow \ \mathsf{false} \\[0.16em]
\operatorname{TupleScanSingletonComma}(P)\ \land \ \operatorname{TupleScanOuterSep}(D) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{TupleScan}(P,\ D)\ \Downarrow \ \mathsf{false} \\[0.16em]
\operatorname{TupleScanSep}(P,\ D)\ \land \ \lnot \ \operatorname{TupleScanSingletonComma}(P) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{TupleScan}(P,\ D)\ \Downarrow \ \mathsf{true} \\[0.16em]
\operatorname{TupleScanAdvance}(P,\ D)\quad \operatorname{TupleScan}(\operatorname{Advance}(P),\ \operatorname{TupleScanStep}(D,\ \operatorname{Tok}(P)))\ \Downarrow \ b \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{TupleScan}(P,\ D)\ \Downarrow \ b
\end{array}
$$

$$
\operatorname{TupleParen}(P)\ \Leftrightarrow \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\ \land \ (\operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{")"})\ \lor \ \operatorname{TupleScan}(\operatorname{Advance}(P),\ 1)\ \Downarrow \ \mathsf{true})
$$

Rule **(Parse-Tuple-Literal)** is defined once by §16.6.2.

**(Parse-TupleExprElems-Empty)**
IsPunc(Tok(P), ")")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseTupleExprElems}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-TupleExprElems-Single)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseExpr}(P)\ \Downarrow \ (P_{1},\ e)\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{";"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseTupleExprElems}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ [e])
\end{array}
$$

**(Parse-TupleExprElems-Many)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseExpr}(P)\ \Downarrow \ (P_{1},\ e_{1})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ e_{2})\quad \Gamma \ \vdash \ \operatorname{ParseExprListTail}(P_{2},\ [e_{2}])\ \Downarrow \ (P_{3},\ \mathsf{es}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseTupleExprElems}(P)\ \Downarrow \ (P_{3},\ [e_{1}]\ \mathbin{++} \ \mathsf{es})
\end{array}
$$

Rule **(Postfix-TupleIndex)** is defined once by §16.2.2.

### 12.2.3 AST Representation / Form

$$
\mathsf{TypeTuple}\ =\ \langle \mathsf{elems}\rangle \ \mathsf{where}\ \mathsf{elems}\ \in \ [\mathsf{Type}]
$$

$$
\begin{array}{l}
\mathsf{TupleExpr}\ =\ \langle \mathsf{elems}\rangle \ \mathsf{where}\ \mathsf{elems}\ \in \ [\mathsf{Expr}] \\[0.16em]
\mathsf{TupleAccess}\ =\ \langle \mathsf{base},\ \mathsf{index}\rangle \ \mathsf{where}\ \mathsf{base}\ \in \ \mathsf{Expr}\ \land \ \mathsf{index}\ \in \ \mathbb{Z}
\end{array}
$$

$$
\operatorname{TupleFields}([T_{1},\ \ldots ,\ T_{n}])\ =\ [\langle 0,\ T_{1}\rangle ,\ \ldots ,\ \langle n-1,\ T_{n}\rangle ]
$$

### 12.2.4 Static Semantics

**(WF-Tuple)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}])\quad \forall \ i,\ \Gamma \ \vdash \ T_{i}\ \mathsf{wf} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}
\end{array}
$$

**(T-Tuple-Unit)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TupleExpr}([])\ :\ \operatorname{TypePrim}(\texttt{"()"})
\end{array}
$$

**(T-Tuple)**

$$
\begin{array}{l}
n\ \ge \ 1\quad \forall \ i,\ \Gamma \ \vdash \ e_{i}\ :\ T_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TupleExpr}([e_{1},\ \ldots ,\ e_{n}])\ :\ \operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}])
\end{array}
$$

Rules **(T-Tuple-Index)**, **(T-Tuple-Index-Perm)**, **(P-Tuple-Index)**, **(P-Tuple-Index-Perm)** are defined once by §16.2.4.

$$
\operatorname{ConstTupleIndex}(i)\ \Leftrightarrow \ \exists \ n\ \in \ \mathbb{Z} .\ i\ =\ n
$$

**(TupleIndex-NonConst)**

$$
\begin{array}{l}
\lnot \ \operatorname{ConstTupleIndex}(i)\quad c\ =\ \operatorname{Code}(\mathsf{TupleIndex}-\mathsf{NonConst}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TupleAccess}(e,\ i)\ \Uparrow \ c
\end{array}
$$

`TupleIndex-NonConst` is AST/recovery/reference-model evidence. Source dynamic
indexing uses array or slice indexing.

**(TupleIndex-OOB)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ :\ \operatorname{TypeTuple}([T_{0},\ \ldots ,\ T\_\{n-1\}])\quad (i\ <\ 0\ \lor \ i\ \ge \ n)\quad c\ =\ \operatorname{Code}(\mathsf{TupleIndex}-\mathsf{OOB}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TupleAccess}(e,\ i)\ \Uparrow \ c
\end{array}
$$

**(TupleAccess-NotTuple)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ :\ T\quad \operatorname{StripPerm}(T)\ \ne \ \operatorname{TypeTuple}(\_)\quad c\ =\ \operatorname{Code}(\mathsf{TupleAccess}-\mathsf{NotTuple}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TupleAccess}(e,\ i)\ \Uparrow \ c
\end{array}
$$

Tuple-type pattern rules are defined by §17.2.

### 12.2.5 Dynamic Semantics

$$
\operatorname{ValueType}((v_{1},\ \ldots ,\ v_{n}))\ =\ \operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}])\ \Leftrightarrow \ \forall \ i.\ \operatorname{ValueType}(v_{i})\ =\ T_{i}
$$

**(EvalSigma-Tuple)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalListSigma}(\mathsf{es},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{v}),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{TupleExpr}(\mathsf{es}),\ \sigma )\ \Downarrow \ (\operatorname{Val}((v_{1},\ \ldots ,\ v_{n})),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Tuple-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalListSigma}(\mathsf{es},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{TupleExpr}(\mathsf{es}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

Rule **(EvalSigma-TupleAccess)** is defined once by §16.2.5.

**(EvalSigma-TupleAccess-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{base},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{TupleAccess}(\mathsf{base},\ i),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

### 12.2.6 Lowering

$$
\mathsf{TupleLayoutJudg}\ =\ \{\mathsf{TupleLayout}\}
$$

**(Layout-Tuple-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TupleLayout}([])\ \Downarrow \ \langle 0,\ 1,\ []\rangle
\end{array}
$$

**(Layout-Tuple-Cons)**

$$
\begin{array}{l}
n\ \ge \ 1\quad \operatorname{TupleFields}([T_{1},\ \ldots ,\ T_{n}])\ =\ \mathsf{fields}\quad \operatorname{RecordLayout}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \mathsf{offsets}\rangle \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TupleLayout}([T_{1},\ \ldots ,\ T_{n}])\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \mathsf{offsets}\rangle
\end{array}
$$

**(Size-Tuple)**

$$
\begin{array}{l}
\operatorname{TupleLayout}([T_{1},\ \ldots ,\ T_{n}])\ \Downarrow \ \langle \mathsf{size},\ \_,\ \_\rangle \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}]))\ =\ \mathsf{size}
\end{array}
$$

**(Align-Tuple)**

$$
\begin{array}{l}
\operatorname{TupleLayout}([T_{1},\ \ldots ,\ T_{n}])\ \Downarrow \ \langle \_,\ \mathsf{align},\ \_\rangle \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}]))\ =\ \mathsf{align}
\end{array}
$$

**(Layout-Tuple)**

$$
\begin{array}{l}
\operatorname{TupleLayout}([T_{1},\ \ldots ,\ T_{n}])\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_\rangle \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(\operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}]))\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle
\end{array}
$$

$$
\operatorname{ValueBits}(\operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}]),\ (v_{1},\ \ldots ,\ v_{n}))\ =\ \mathsf{bits}\ \Leftrightarrow \ \operatorname{TupleLayout}([T_{1},\ \ldots ,\ T_{n}])\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \ \land \ \operatorname{StructBits}([T_{1},\ \ldots ,\ T_{n}],\ [v_{1},\ \ldots ,\ v_{n}],\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{bits}
$$

Rule **(Lower-Expr-Tuple)** is defined once by §16.6.6.

### 12.2.7 Diagnostics

| Code         | Severity | Detection    | Condition                                                  |
| ------------ | -------- | ------------ | ---------------------------------------------------------- |
| `E-TYP-1801` | Error    | Compile-time | Tuple index out of bounds (`TupleIndex-OOB`) |
| `E-TYP-1802` | Error    | Compile-time | Tuple index is not a compile-time constant integer literal (`TupleIndex-NonConst`) |
| `E-TYP-1803` | Error    | Compile-time | Tuple arity mismatch in assignment or pattern (`Pat-Tuple-Arity-Err`) |
| `E-SEM-2524` | Error    | Compile-time | Tuple access on non-tuple (`TupleAccess-NotTuple`) |
