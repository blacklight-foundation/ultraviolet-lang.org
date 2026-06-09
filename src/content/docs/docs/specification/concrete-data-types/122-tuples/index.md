---
title: "12.2 Tuples"
description: "12.2 Tuples from 12. Concrete Data Types of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "concrete-data-types"
specSection: "122-tuples"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
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
\operatorname{TupleScanStep}(\langle p,\ q,\ r\rangle ,\ t)\ =\ \langle p\ +\ \operatorname{ParenDelta}(t),\ \operatorname{max}(0,\ q\ +\ \operatorname{BracketDelta}(t)),\ \operatorname{max}(0,\ r\ +\ \operatorname{BraceDelta}(t))\rangle  \\[0.16em]
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

**(Parse-Tuple-Literal)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\quad \operatorname{TupleParen}(P)\quad \Gamma \ \vdash \ \operatorname{ParseTupleExprElems}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{elems})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{")"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{TupleExpr}(\mathsf{elems}))
\end{array}
$$

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

**(Postfix-TupleIndex)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"."})\quad t\ =\ \operatorname{Tok}(\operatorname{Advance}(P))\quad t.\mathsf{kind}\ =\ \mathsf{IntLiteral}\quad \mathsf{idx}\ =\ \operatorname{IntValue}(t) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PostfixStep}(P,\ e)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P)),\ \operatorname{TupleAccess}(e,\ \mathsf{idx}))
\end{array}
$$

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

**(EvalSigma-TupleAccess)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{base},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{b}),\ \sigma_{1} )\quad \operatorname{TupleValue}(v_{b},\ i)\ =\ v_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{TupleAccess}(\mathsf{base},\ i),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{i}),\ \sigma_{1} )
\end{array}
$$

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
n\ \ge \ 1\quad \operatorname{TupleFields}([T_{1},\ \ldots ,\ T_{n}])\ =\ \mathsf{fields}\quad \operatorname{RecordLayout}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \mathsf{offsets}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TupleLayout}([T_{1},\ \ldots ,\ T_{n}])\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \mathsf{offsets}\rangle 
\end{array}
$$

**(Size-Tuple)**

$$
\begin{array}{l}
\operatorname{TupleLayout}([T_{1},\ \ldots ,\ T_{n}])\ \Downarrow \ \langle \mathsf{size},\ \_,\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}]))\ =\ \mathsf{size}
\end{array}
$$

**(Align-Tuple)**

$$
\begin{array}{l}
\operatorname{TupleLayout}([T_{1},\ \ldots ,\ T_{n}])\ \Downarrow \ \langle \_,\ \mathsf{align},\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}]))\ =\ \mathsf{align}
\end{array}
$$

**(Layout-Tuple)**

$$
\begin{array}{l}
\operatorname{TupleLayout}([T_{1},\ \ldots ,\ T_{n}])\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(\operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}]))\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

$$
\operatorname{ValueBits}(\operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}]),\ (v_{1},\ \ldots ,\ v_{n}))\ =\ \mathsf{bits}\ \Leftrightarrow \ \operatorname{TupleLayout}([T_{1},\ \ldots ,\ T_{n}])\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \ \land \ \operatorname{StructBits}([T_{1},\ \ldots ,\ T_{n}],\ [v_{1},\ \ldots ,\ v_{n}],\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{bits}
$$

**(Lower-Expr-Tuple)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerList}(\mathsf{es})\ \Downarrow \ \langle \mathsf{IR},\ \mathsf{vec}_{v}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{TupleExpr}(\mathsf{es}))\ \Downarrow \ \langle \mathsf{IR},\ (v_{1},\ \ldots ,\ v_{n})\rangle 
\end{array}
$$

### 12.2.7 Diagnostics

| Code         | Severity | Detection    | Condition                                                  |
| ------------ | -------- | ------------ | ---------------------------------------------------------- |
| `E-TYP-1801` | Error    | Compile-time | Tuple index out of bounds                                  |
| `E-TYP-1802` | Error    | Compile-time | Tuple index is not a compile-time constant integer literal |
| `E-TYP-1803` | Error    | Compile-time | Tuple arity mismatch in assignment or pattern              |
| `E-SEM-2524` | Error    | Compile-time | Tuple access on non-tuple                                  |
