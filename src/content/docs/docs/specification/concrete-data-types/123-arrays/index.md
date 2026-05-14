---
title: "12.3 Arrays"
description: "12.3 Arrays from 12. Concrete Data Types of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "concrete-data-types"
specSection: "123-arrays"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/concrete-data-types/">12. Concrete Data Types</a>
  <span>Concrete Data Types</span>
</div>

## 12.3 Arrays

### 12.3.1 Syntax

```text
array_type    ::= "[" type ";" expr "]"
array_expr    ::= "[" array_segment_list? "]"
array_segment_list ::= array_segment ("," array_segment)*
array_segment ::= expr | expr ";" expr
index_expr    ::= postfix_expr "[" expr "]"
```

### 12.3.2 Parsing

**(Parse-Array-Type)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"["})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ t)\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{";"})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ e)\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{"]"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseNonPermType}(P)\ \Downarrow \ (\operatorname{Advance}(P_{2}),\ \operatorname{TypeArray}(t,\ e))
\end{array}
$$

**(Parse-Array-Segment-Elem)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseExpr}(P)\ \Downarrow \ (P_{1},\ \mathsf{value})\quad \lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{";"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseArraySegment}(P)\ \Downarrow \ (P_{1},\ \operatorname{ArrayElemSegment}(\mathsf{value}))
\end{array}
$$

**(Parse-Array-Segment-Repeat)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseExpr}(P)\ \Downarrow \ (P_{1},\ \mathsf{value})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{";"})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{count}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseArraySegment}(P)\ \Downarrow \ (P_{2},\ \operatorname{ArrayRepeatSegment}(\mathsf{value},\ \mathsf{count}))
\end{array}
$$

**(Parse-Array-Segment-List-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseArraySegmentList}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-Array-Segment-List-Single)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseArraySegment}(P)\ \Downarrow \ (P_{1},\ \mathsf{seg})\quad \lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{","}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseArraySegmentList}(P)\ \Downarrow \ (P_{1},\ [\mathsf{seg}])
\end{array}
$$

**(Parse-Array-Segment-List-Comma)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseArraySegment}(P)\ \Downarrow \ (P_{1},\ \mathsf{seg})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParseArraySegmentList}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{segs}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseArraySegmentList}(P)\ \Downarrow \ (P_{2},\ [\mathsf{seg}]\ \mathbin{++} \ \mathsf{segs})
\end{array}
$$

**(Parse-Array-Literal)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"["})\quad \Gamma \ \vdash \ \operatorname{ParseArraySegmentList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{segs})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"]"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{ArrayExpr}(\mathsf{segs}))
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

### 12.3.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{TypeArray}\ =\ \langle \mathsf{elem},\ \mathsf{size}_{\mathsf{expr}}\rangle \ \mathsf{where}\ \mathsf{elem}\ \in \ \mathsf{Type}\ \land \ \mathsf{size}_{\mathsf{expr}}\ \in \ \mathsf{Expr} \\[0.16em]
\mathsf{ArraySegment}\ =\ \operatorname{ArrayElemSegment}(\mathsf{value})\ \mid \ \operatorname{ArrayRepeatSegment}(\mathsf{value},\ \mathsf{count})\ \mathsf{where}\ \mathsf{value}\ \in \ \mathsf{Expr}\ \land \ \mathsf{count}\ \in \ \mathsf{Expr} \\[0.16em]
\mathsf{ArrayExpr}\ =\ \langle \mathsf{segments}\rangle \ \mathsf{where}\ \mathsf{segments}\ \in \ [\mathsf{ArraySegment}]
\end{array}
$$

IndexAccess is shared by arrays and slices. This section owns the cases where the base type is `TypeArray`.

### 12.3.4 Static Semantics

$$
\operatorname{ConstIndex}(e)\ \Leftrightarrow \ \exists \ n.\ \Gamma \ \vdash \ \operatorname{ConstLen}(e)\ \Downarrow \ n
$$

**(WF-Array)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeArray}(T_{0},\ e)\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e)\ \Downarrow \ n\quad \Gamma \ \vdash \ T_{0}\ \mathsf{wf} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{SegLen}(\operatorname{ArrayElemSegment}(\_))\ =\ 1 \\[0.16em]
\operatorname{SegLen}(\operatorname{ArrayRepeatSegment}(\_,\ \mathsf{count}))\ =\ n\ \mathsf{where}\ \Gamma \ \vdash \ \operatorname{ConstLen}(\mathsf{count})\ \Downarrow \ n
\end{array}
$$

**(T-Array-Literal-Segments)**

$$
\begin{array}{l}
\forall \ i, \\[0.16em]
\ (s_{i}\ =\ \operatorname{ArrayElemSegment}(\mathsf{value}_{i})\ \Rightarrow \ \Gamma \ \vdash \ \mathsf{value}_{i}\ :\ T)\ \land  \\[0.16em]
\ (s_{i}\ =\ \operatorname{ArrayRepeatSegment}(\mathsf{value}_{i},\ \mathsf{count}_{i})\ \Rightarrow  \\[0.16em]
\quad \Gamma \ \vdash \ \mathsf{value}_{i}\ :\ T\ \land  \\[0.16em]
\quad \operatorname{BitcopyType}(T)\ \land  \\[0.16em]
\quad \Gamma \ \vdash \ \mathsf{count}_{i}\ :\ U_{i}\ \land  \\[0.16em]
\quad (\operatorname{IntType}(U_{i})\ \lor \ U_{i}\ =\ \operatorname{TypePrim}(\texttt{"usize"}))\ \land  \\[0.16em]
\quad \Gamma \ \vdash \ \operatorname{ConstLen}(\mathsf{count}_{i})\ \Downarrow \ n_{i}) \\[0.16em]
N\ =\ \Sigma_{i} \ \operatorname{SegLen}(s_{i}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ArrayExpr}([s_{1},\ \ldots ,\ s_{k}])\ :\ \operatorname{TypeArray}(T,\ \operatorname{Literal}(\operatorname{IntLiteral}(N)))
\end{array}
$$

**(T-Index-Array)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypeArray}(T,\ \mathsf{len})\quad \Gamma \ \vdash \ e_{2}\ :\ \operatorname{TypePrim}(\texttt{"usize"})\quad \operatorname{ConstIndex}(e_{2})\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e_{2})\ \Downarrow \ i\quad \Gamma \ \vdash \ \operatorname{ConstLen}(\mathsf{len})\ \Downarrow \ n\quad i\ <\ n\quad \operatorname{BitcopyType}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\ T
\end{array}
$$

**(T-Index-Array-Dynamic)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypeArray}(T,\ \mathsf{len})\quad \Gamma \ \vdash \ e_{2}\ :\ \operatorname{TypePrim}(\texttt{"usize"})\quad \lnot \ \operatorname{ConstIndex}(e_{2})\quad \mathsf{InDynamicContext}\quad \operatorname{BitcopyType}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\ T
\end{array}
$$

**(T-Index-Array-Perm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypePerm}(p,\ \operatorname{TypeArray}(T,\ \mathsf{len}))\quad \Gamma \ \vdash \ e_{2}\ :\ \operatorname{TypePrim}(\texttt{"usize"})\quad \operatorname{ConstIndex}(e_{2})\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e_{2})\ \Downarrow \ i\quad \Gamma \ \vdash \ \operatorname{ConstLen}(\mathsf{len})\ \Downarrow \ n\quad i\ <\ n\quad \operatorname{BitcopyType}(\operatorname{TypePerm}(p,\ T)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\ \operatorname{TypePerm}(p,\ T)
\end{array}
$$

**(T-Index-Array-Perm-Dynamic)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypePerm}(p,\ \operatorname{TypeArray}(T,\ \mathsf{len}))\quad \Gamma \ \vdash \ e_{2}\ :\ \operatorname{TypePrim}(\texttt{"usize"})\quad \lnot \ \operatorname{ConstIndex}(e_{2})\quad \mathsf{InDynamicContext}\quad \operatorname{BitcopyType}(\operatorname{TypePerm}(p,\ T)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\ \operatorname{TypePerm}(p,\ T)
\end{array}
$$

**(P-Index-Array)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\mathsf{place}\ \operatorname{TypeArray}(T,\ \mathsf{len})\quad \Gamma \ \vdash \ e_{2}\ :\ \operatorname{TypePrim}(\texttt{"usize"})\quad \operatorname{ConstIndex}(e_{2})\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e_{2})\ \Downarrow \ i\quad \Gamma \ \vdash \ \operatorname{ConstLen}(\mathsf{len})\ \Downarrow \ n\quad i\ <\ n \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\mathsf{place}\ T
\end{array}
$$

**(P-Index-Array-Perm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\mathsf{place}\ \operatorname{TypePerm}(p,\ \operatorname{TypeArray}(T,\ \mathsf{len}))\quad \Gamma \ \vdash \ e_{2}\ :\ \operatorname{TypePrim}(\texttt{"usize"})\quad \operatorname{ConstIndex}(e_{2})\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e_{2})\ \Downarrow \ i\quad \Gamma \ \vdash \ \operatorname{ConstLen}(\mathsf{len})\ \Downarrow \ n\quad i\ <\ n \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\mathsf{place}\ \operatorname{TypePerm}(p,\ T)
\end{array}
$$

**(P-Index-Array-Dynamic)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\mathsf{place}\ \operatorname{TypeArray}(T,\ \mathsf{len})\quad \Gamma \ \vdash \ e_{2}\ :\ \operatorname{TypePrim}(\texttt{"usize"})\quad \lnot \ \operatorname{ConstIndex}(e_{2})\quad \mathsf{InDynamicContext} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\mathsf{place}\ T
\end{array}
$$

**(P-Index-Array-Perm-Dynamic)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\mathsf{place}\ \operatorname{TypePerm}(p,\ \operatorname{TypeArray}(T,\ \mathsf{len}))\quad \Gamma \ \vdash \ e_{2}\ :\ \operatorname{TypePrim}(\texttt{"usize"})\quad \lnot \ \operatorname{ConstIndex}(e_{2})\quad \mathsf{InDynamicContext} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\mathsf{place}\ \operatorname{TypePerm}(p,\ T)
\end{array}
$$

**(Index-Array-NonConst-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypeArray}(T,\ \_)\quad \Gamma \ \vdash \ e_{2}\ :\ \operatorname{TypePrim}(\texttt{"usize"})\quad \lnot \ \operatorname{ConstIndex}(e_{2})\quad \lnot \ \mathsf{InDynamicContext}\quad c\ =\ \operatorname{Code}(\mathsf{Index}-\mathsf{Array}-\mathsf{NonConst}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ \Uparrow \ c
\end{array}
$$

**(Index-Array-OOB-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypeArray}(T,\ \mathsf{len})\quad \operatorname{ConstIndex}(e_{2})\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e_{2})\ \Downarrow \ i\quad \Gamma \ \vdash \ \operatorname{ConstLen}(\mathsf{len})\ \Downarrow \ n\quad i\ \ge \ n\quad c\ =\ \operatorname{Code}(\mathsf{Index}-\mathsf{Array}-\mathsf{OOB}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ \Uparrow \ c
\end{array}
$$

**(Index-Array-NonUsize)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypeArray}(T,\ \_)\quad \Gamma \ \vdash \ e_{2}\ :\ T_{i}\quad T_{i}\ \ne \ \operatorname{TypePrim}(\texttt{"usize"})\quad c\ =\ \operatorname{Code}(\mathsf{Index}-\mathsf{Array}-\mathsf{NonUsize}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ \Uparrow \ c
\end{array}
$$

### 12.3.5 Dynamic Semantics

$$
\operatorname{ValueType}([v_{1},\ \ldots ,\ v_{n}])\ =\ \operatorname{TypeArray}(T,\ \operatorname{Literal}(\operatorname{IntLiteral}(n)))\ \Leftrightarrow \ \forall \ i.\ \operatorname{ValueType}(v_{i})\ =\ T
$$

$$
\begin{array}{l}
\operatorname{Len}([v_{0},\ \ldots ,\ v\_\{n-1\}])\ =\ n \\[0.16em]
\operatorname{IndexNum}(v)\ =\ i\ \Leftrightarrow \ v\ =\ \operatorname{IntVal}(\texttt{"usize"},\ i) \\[0.16em]
\operatorname{IndexValue}([v_{0},\ \ldots ,\ v\_\{n-1\}],\ i)\ =\ v_{i}\quad (0\ \le \ i\ <\ n) \\[0.16em]
\operatorname{IndexValue}(v,\ v_{i})\ =\ v_{e}\ \Leftrightarrow \ \operatorname{IndexNum}(v_{i})\ =\ i\ \land \ \operatorname{IndexValue}(v,\ i)\ =\ v_{e}
\end{array}
$$

**(EvalSigma-Array)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalListSigma}(\mathsf{es},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{v}),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{ArrayExpr}(\mathsf{es}),\ \sigma )\ \Downarrow \ (\operatorname{Val}([v_{1},\ \ldots ,\ v_{n}]),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Array-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalListSigma}(\mathsf{es},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{ArrayExpr}(\mathsf{es}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
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

**(EvalSigma-Index-OOB)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{base},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{b}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{idx},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(v_{i}),\ \sigma_{2} )\quad \operatorname{IndexNum}(v_{i})\ =\ i\quad \lnot \ (0\ \le \ i\ <\ \operatorname{Len}(v_{b})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{IndexAccess}(\mathsf{base},\ \mathsf{idx}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma_{2} )
\end{array}
$$

### 12.3.6 Lowering

**(Size-Array)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ConstLen}(e)\ \Downarrow \ n\quad \Gamma \ \vdash \ \operatorname{sizeof}(T_{0})\ =\ s \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeArray}(T_{0},\ e))\ =\ n\ \times \ s
\end{array}
$$

**(Align-Array)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{alignof}(T_{0})\ =\ a \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeArray}(T_{0},\ e))\ =\ a
\end{array}
$$

**(Layout-Array)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeArray}(T_{0},\ e))\ =\ \mathsf{size}\quad \Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeArray}(T_{0},\ e))\ =\ \mathsf{align} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(\operatorname{TypeArray}(T_{0},\ e))\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

$$
\operatorname{ArrayLen}(e)\ =\ n\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{ConstLen}(e)\ \Downarrow \ n
$$

$$
\operatorname{ValueBits}(\operatorname{TypeArray}(T,\ e),\ [v_{0},\ \ldots ,\ v\_\{n-1\}])\ =\ \mathsf{bits}\ \Leftrightarrow \ \operatorname{ArrayLen}(e)\ =\ n\ \land \ s\ =\ \operatorname{sizeof}(T)\ \land \ \mid \mathsf{bits}\mid \ =\ n\ \times \ s\ \land \ \forall \ i.\ 0\ \le \ i\ <\ n\ \Rightarrow \ (\operatorname{ValueBits}(T,\ v_{i})\ =\ b_{i}\ \land \ \mathsf{bits}[i\ \times \ s\ ..\ i\ \times \ s\ +\ \mid b_{i}\mid )\ =\ b_{i})
$$

**(Lower-Expr-Array)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerArraySegments}(\mathsf{segs})\ \Downarrow \ \langle \mathsf{IR},\ \mathsf{vec}_{v}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{ArrayExpr}(\mathsf{segs}))\ \Downarrow \ \langle \mathsf{IR},\ [v_{1},\ \ldots ,\ v_{n}]\rangle 
\end{array}
$$

### 12.3.7 Diagnostics

Diagnostics are defined for non-constant array indexing outside `[[dynamic]]` scope, out-of-bounds constant indices, and non-`usize` array indices. Runtime out-of-bounds behavior for dynamic indices is defined by the panic behavior of `EvalSigma-Index-OOB`.
