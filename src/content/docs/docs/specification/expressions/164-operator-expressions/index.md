---
title: "16.4 Operator Expressions"
description: "16.4 Operator Expressions from 16. Expressions of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "expressions"
specSection: "164-operator-expressions"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/expressions/">16. Expressions</a>
  <span>Expressions</span>
</div>

## 16.4 Operator Expressions

### 16.4.1 Syntax

```text
range_expression    ::= logical_or_expr ".." logical_or_expr
                      | logical_or_expr "..=" logical_or_expr
                      | logical_or_expr ".."
                      | ".." logical_or_expr
                      | "..=" logical_or_expr
                      | ".."
logical_or_expr     ::= logical_and_expr ("||" logical_and_expr)*
logical_and_expr    ::= comparison_expr ("&&" comparison_expr)*
comparison_expr     ::= bitwise_or_expr (("==" | "!=" | "<" | "<=" | ">" | ">=") bitwise_or_expr)*
bitwise_or_expr     ::= bitwise_xor_expr ("|" bitwise_xor_expr)*
bitwise_xor_expr    ::= bitwise_and_expr ("^" bitwise_and_expr)*
bitwise_and_expr    ::= shift_expr ("&" shift_expr)*
shift_expr          ::= additive_expr (("<<" | ">>") additive_expr)*
additive_expr       ::= multiplicative_expr (("+" | "-") multiplicative_expr)*
multiplicative_expr ::= power_expr (("*" | "/" | "%") power_expr)*
power_expr          ::= unary_expr ("**" power_expr)?
unary_operator      ::= "!" | "-"
```

Cast syntax is owned by §16.5. Dereference and `widen` prefix forms are owned by §§16.8 and 13.5.

### 16.4.2 Parsing

**(Parse-Range-To)**, **(Parse-Range-ToInc)**, **(Parse-Range-Full)**, **(Parse-Range-Lhs)**, **(Parse-RangeTail-None)**, **(Parse-RangeTail-From)**, **(Parse-RangeTail-Excl)**, and **(Parse-RangeTail-Incl)** define the six range-expression forms.

**(Parse-LeftChain)**, **(Parse-LeftChain-Stop)**, and **(Parse-LeftChain-Cons)** define left-associative parsing for logical, comparison, bitwise, shift, additive, and multiplicative chains.

**(Parse-Power)**, **(Parse-PowerTail-None)**, and **(Parse-PowerTail-Cons)** define right-associative exponentiation.

**(Parse-Unary-Prefix)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ =\ \mathsf{op}\ \in \ \{\texttt{"!"},\ \texttt{"-"}\}\quad \Gamma \ \vdash \ \operatorname{ParseUnary}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseUnary}(P)\ \Downarrow \ (P_{1},\ \operatorname{Unary}(\mathsf{op},\ e))
\end{array}
$$

### 16.4.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{RangeKind}\ =\ \{\texttt{To},\ \texttt{ToInclusive},\ \texttt{Full},\ \texttt{From},\ \texttt{Exclusive},\ \texttt{Inclusive}\} \\[0.16em]
\mathsf{Expr}\ =\ \operatorname{Unary}(\mathsf{op},\ \mathsf{expr})\ \mid \ \operatorname{Binary}(\mathsf{op},\ \mathsf{left},\ \mathsf{right})\ \mid \ \operatorname{Range}(\mathsf{kind},\ \mathsf{lo}_{\mathsf{opt}},\ \mathsf{hi}_{\mathsf{opt}})\ \mid \ \ldots 
\end{array}
$$

$$
\begin{array}{l}
\mathsf{ArithOps}\ =\ \{\texttt{"+"},\ \texttt{"-"},\ \texttt{"*"},\ \texttt{"/"},\ \texttt{"\%"},\ \texttt{"**"}\} \\[0.16em]
\mathsf{BitOps}\ =\ \{\texttt{"\&"},\ \texttt{"|"},\ \texttt{"\^{}"}\} \\[0.16em]
\mathsf{ShiftOps}\ =\ \{\texttt{"<<"},\ \texttt{">>"}\} \\[0.16em]
\mathsf{LogicOps}\ =\ \{\texttt{"\&\&"},\ \texttt{"||"}\}
\end{array}
$$

### 16.4.4 Static Semantics

$$
\begin{array}{l}
\operatorname{EqType}(T)\ \Leftrightarrow \ (\operatorname{StripPerm}(T)\ =\ \operatorname{TypePrim}(t)\ \land \ t\ \in \ \mathsf{NumericTypes}\ \cup \ \{\texttt{bool},\ \texttt{char}\})\ \lor \ \operatorname{StripPerm}(T)\ =\ \operatorname{TypePtr}(U,\ s)\ \lor \ \operatorname{StripPerm}(T)\ =\ \operatorname{TypeRawPtr}(q,\ U)\ \lor \ \operatorname{StripPerm}(T)\ =\ \operatorname{TypeString}(\mathsf{st})\ \lor \ \operatorname{StripPerm}(T)\ =\ \operatorname{TypeBytes}(\mathsf{st}) \\[0.16em]
\operatorname{OrdType}(T)\ \Leftrightarrow \ \operatorname{StripPerm}(T)\ =\ \operatorname{TypePrim}(t)\ \land \ t\ \in \ \mathsf{IntTypes}\ \cup \ \mathsf{FloatTypes}\ \cup \ \{\texttt{char}\} \\[0.16em]
\operatorname{IsRangeType}(T)\ \Leftrightarrow \ T\ =\ \operatorname{TypeRange}(\_)\ \lor \ T\ =\ \operatorname{TypeRangeInclusive}(\_)\ \lor \ T\ =\ \operatorname{TypeRangeFrom}(\_)\ \lor \ T\ =\ \operatorname{TypeRangeTo}(\_)\ \lor \ T\ =\ \operatorname{TypeRangeToInclusive}(\_)\ \lor \ T\ =\ \mathsf{TypeRangeFull}
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

**(Range-Full)**, **(Range-To)**, **(Range-ToInclusive)**, **(Range-From)**, **(Range-Exclusive)**, and **(Range-Inclusive)** assign the corresponding range carrier type based on the presence and type of lower and upper bounds.

**(T-Not-Bool)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypePrim}(\texttt{bool}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Unary}(\texttt{"!"},\ e)\ :\ \operatorname{TypePrim}(\texttt{bool})
\end{array}
$$

**(T-Not-Int)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypePrim}(t)\quad t\ \in \ \mathsf{IntTypes} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Unary}(\texttt{"!"},\ e)\ :\ \operatorname{TypePrim}(t)
\end{array}
$$

**(T-Neg)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypePrim}(t)\quad t\ \in \ \mathsf{SignedIntTypes}\ \cup \ \mathsf{FloatTypes} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Unary}(\texttt{"-"},\ e)\ :\ \operatorname{TypePrim}(t)
\end{array}
$$

**(T-Arith)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e_{1}\ :\ T\quad \Gamma ;\ R;\ L\ \vdash \ e_{2}\ :\ T\quad \operatorname{StripPerm}(T)\ =\ \operatorname{TypePrim}(t)\quad t\ \in \ \mathsf{NumericTypes}\quad \mathsf{op}\ \in \ \mathsf{ArithOps} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Binary}(\mathsf{op},\ e_{1},\ e_{2})\ :\ \operatorname{TypePrim}(t)
\end{array}
$$

**(T-Bitwise)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e_{1}\ :\ T\quad \Gamma ;\ R;\ L\ \vdash \ e_{2}\ :\ T\quad \operatorname{StripPerm}(T)\ =\ \operatorname{TypePrim}(t)\quad t\ \in \ \mathsf{IntTypes}\quad \mathsf{op}\ \in \ \mathsf{BitOps} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Binary}(\mathsf{op},\ e_{1},\ e_{2})\ :\ \operatorname{TypePrim}(t)
\end{array}
$$

**(T-Shift)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e_{1}\ :\ T_{1}\quad \Gamma ;\ R;\ L\ \vdash \ e_{2}\ :\ \operatorname{TypePrim}(\texttt{u32})\quad \operatorname{StripPerm}(T_{1})\ =\ \operatorname{TypePrim}(t)\quad t\ \in \ \mathsf{IntTypes}\quad \mathsf{op}\ \in \ \mathsf{ShiftOps} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Binary}(\mathsf{op},\ e_{1},\ e_{2})\ :\ \operatorname{TypePrim}(t)
\end{array}
$$

**(T-Compare-Eq)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e_{1}\ :\ T\quad \Gamma ;\ R;\ L\ \vdash \ e_{2}\ :\ T\quad \operatorname{EqType}(T)\quad \mathsf{op}\ \in \ \{\texttt{"=="},\ \texttt{"!="}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Binary}(\mathsf{op},\ e_{1},\ e_{2})\ :\ \operatorname{TypePrim}(\texttt{bool})
\end{array}
$$

**(T-Compare-Ord)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e_{1}\ :\ T\quad \Gamma ;\ R;\ L\ \vdash \ e_{2}\ :\ T\quad \operatorname{OrdType}(T)\quad \mathsf{op}\ \in \ \{\texttt{"<"},\ \texttt{"<="},\ \texttt{">"},\ \texttt{">="}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Binary}(\mathsf{op},\ e_{1},\ e_{2})\ :\ \operatorname{TypePrim}(\texttt{bool})
\end{array}
$$

**(T-Logical)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e_{1}\ :\ \operatorname{TypePrim}(\texttt{bool})\quad \Gamma ;\ R;\ L\ \vdash \ e_{2}\ :\ \operatorname{TypePrim}(\texttt{bool})\quad \mathsf{op}\ \in \ \mathsf{LogicOps} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Binary}(\mathsf{op},\ e_{1},\ e_{2})\ :\ \operatorname{TypePrim}(\texttt{bool})
\end{array}
$$

### 16.4.5 Dynamic Semantics

$$
\begin{array}{l}
\operatorname{RetType}(\Gamma )\ \in \ \mathsf{Type} \\[0.16em]
\mathsf{OpJudg}\ =\ \{\operatorname{UnOp}(\mathsf{op},\ v)\ \Downarrow \ v',\ \operatorname{BinOp}(\mathsf{op},\ v_{1},\ v_{2})\ \Downarrow \ v\} \\[0.16em]
\operatorname{NumericValue}(v,\ t)\ \Leftrightarrow \ \operatorname{ValueType}(v)\ =\ \operatorname{TypePrim}(t)\ \land \ t\ \in \ \mathsf{NumericTypes} \\[0.16em]
\operatorname{IntValue}(v,\ t)\ \Leftrightarrow \ \operatorname{ValueType}(v)\ =\ \operatorname{TypePrim}(t)\ \land \ t\ \in \ \mathsf{IntTypes} \\[0.16em]
\operatorname{FloatValue}(v,\ t)\ \Leftrightarrow \ \operatorname{ValueType}(v)\ =\ \operatorname{TypePrim}(t)\ \land \ t\ \in \ \mathsf{FloatTypes} \\[0.16em]
\operatorname{SignedIntValue}(v)\ \Leftrightarrow \ \exists \ t.\ t\ \in \ \mathsf{SignedIntTypes}\ \land \ \operatorname{ValueType}(v)\ =\ \operatorname{TypePrim}(t) \\[0.16em]
\operatorname{SignedTypeOf}(v)\ =\ t\ \Leftrightarrow \ t\ \in \ \mathsf{SignedIntTypes}\ \land \ \operatorname{ValueType}(v)\ =\ \operatorname{TypePrim}(t) \\[0.16em]
\operatorname{U32Value}(v)\ \Leftrightarrow \ \operatorname{ValueType}(v)\ =\ \operatorname{TypePrim}(\texttt{"u32"}) \\[0.16em]
\operatorname{EqValue}(v_{1},\ v_{2})\ \Leftrightarrow \ \exists \ T.\ \operatorname{ValueType}(v_{1})\ =\ T\ \land \ \operatorname{ValueType}(v_{2})\ =\ T\ \land \ \operatorname{EqType}(T) \\[0.16em]
\operatorname{OrdValue}(v_{1},\ v_{2})\ \Leftrightarrow \ \exists \ T.\ \operatorname{ValueType}(v_{1})\ =\ T\ \land \ \operatorname{ValueType}(v_{2})\ =\ T\ \land \ \operatorname{OrdType}(T) \\[0.16em]
\operatorname{IsNaN}(t,\ v)\ \Leftrightarrow \ t\ \in \ \mathsf{FloatTypes}\ \land \ v\ =\ \operatorname{FloatVal}(t,\ x)\ \land \ \operatorname{IEEE754Encode}(t,\ x)\ =\ \operatorname{CanonicalNaNBits}(t) \\[0.16em]
\operatorname{OrdScalar}(v)\ =\ x\ \Leftrightarrow \ (\exists \ t.\ v\ =\ \operatorname{IntVal}(t,\ x)\ \land \ t\ \in \ \mathsf{IntTypes})\ \lor \ (\exists \ u.\ v\ =\ \operatorname{CharVal}(u)\ \land \ x\ =\ u) \\[0.16em]
\operatorname{Cmp}(\texttt{"=="},\ v_{1},\ v_{2})\ =\ b\ \Leftrightarrow \ \operatorname{EqValue}(v_{1},\ v_{2})\ \land \ ((\exists \ t.\ \operatorname{FloatValue}(v_{1},\ t)\ \land \ \operatorname{FloatValue}(v_{2},\ t)\ \land \ (\operatorname{IsNaN}(t,\ v_{1})\ \lor \ \operatorname{IsNaN}(t,\ v_{2}))\ \land \ b\ =\ \mathsf{false})\ \lor \ (\lnot \ \exists \ t.\ \operatorname{FloatValue}(v_{1},\ t)\ \land \ \operatorname{FloatValue}(v_{2},\ t)\ \land \ (\operatorname{IsNaN}(t,\ v_{1})\ \lor \ \operatorname{IsNaN}(t,\ v_{2}))\ \land \ b\ =\ (v_{1}\ =\ v_{2}))) \\[0.16em]
\operatorname{Cmp}(\texttt{"!="},\ v_{1},\ v_{2})\ =\ b\ \Leftrightarrow \ \operatorname{EqValue}(v_{1},\ v_{2})\ \land \ ((\exists \ t.\ \operatorname{FloatValue}(v_{1},\ t)\ \land \ \operatorname{FloatValue}(v_{2},\ t)\ \land \ (\operatorname{IsNaN}(t,\ v_{1})\ \lor \ \operatorname{IsNaN}(t,\ v_{2}))\ \land \ b\ =\ \mathsf{true})\ \lor \ (\lnot \ \exists \ t.\ \operatorname{FloatValue}(v_{1},\ t)\ \land \ \operatorname{FloatValue}(v_{2},\ t)\ \land \ (\operatorname{IsNaN}(t,\ v_{1})\ \lor \ \operatorname{IsNaN}(t,\ v_{2}))\ \land \ b\ =\ (v_{1}\ \ne \ v_{2}))) \\[0.16em]
\operatorname{Cmp}(\texttt{"<"},\ v_{1},\ v_{2})\ =\ b\ \Leftrightarrow \ \operatorname{OrdValue}(v_{1},\ v_{2})\ \land \ ((\exists \ t.\ \operatorname{FloatValue}(v_{1},\ t)\ \land \ \operatorname{FloatValue}(v_{2},\ t)\ \land \ ((\operatorname{IsNaN}(t,\ v_{1})\ \lor \ \operatorname{IsNaN}(t,\ v_{2}))\ \land \ b\ =\ \mathsf{false})\ \lor \ (\lnot \ (\operatorname{IsNaN}(t,\ v_{1})\ \lor \ \operatorname{IsNaN}(t,\ v_{2}))\ \land \ x_{1}\ =\ \operatorname{FloatValValue}(v_{1})\ \land \ x_{2}\ =\ \operatorname{FloatValValue}(v_{2})\ \land \ b\ =\ (x_{1}\ <\ x_{2})))\ \lor \ (\exists \ x_{1},\ x_{2}.\ \operatorname{OrdScalar}(v_{1})\ =\ x_{1}\ \land \ \operatorname{OrdScalar}(v_{2})\ =\ x_{2}\ \land \ b\ =\ (x_{1}\ <\ x_{2}))) \\[0.16em]
\operatorname{Cmp}(\texttt{"<="},\ v_{1},\ v_{2})\ =\ b\ \Leftrightarrow \ \operatorname{OrdValue}(v_{1},\ v_{2})\ \land \ ((\exists \ t.\ \operatorname{FloatValue}(v_{1},\ t)\ \land \ \operatorname{FloatValue}(v_{2},\ t)\ \land \ ((\operatorname{IsNaN}(t,\ v_{1})\ \lor \ \operatorname{IsNaN}(t,\ v_{2}))\ \land \ b\ =\ \mathsf{false})\ \lor \ (\lnot \ (\operatorname{IsNaN}(t,\ v_{1})\ \lor \ \operatorname{IsNaN}(t,\ v_{2}))\ \land \ x_{1}\ =\ \operatorname{FloatValValue}(v_{1})\ \land \ x_{2}\ =\ \operatorname{FloatValValue}(v_{2})\ \land \ b\ =\ (x_{1}\ \le \ x_{2})))\ \lor \ (\exists \ x_{1},\ x_{2}.\ \operatorname{OrdScalar}(v_{1})\ =\ x_{1}\ \land \ \operatorname{OrdScalar}(v_{2})\ =\ x_{2}\ \land \ b\ =\ (x_{1}\ \le \ x_{2}))) \\[0.16em]
\operatorname{Cmp}(\texttt{">"},\ v_{1},\ v_{2})\ =\ b\ \Leftrightarrow \ \operatorname{OrdValue}(v_{1},\ v_{2})\ \land \ ((\exists \ t.\ \operatorname{FloatValue}(v_{1},\ t)\ \land \ \operatorname{FloatValue}(v_{2},\ t)\ \land \ ((\operatorname{IsNaN}(t,\ v_{1})\ \lor \ \operatorname{IsNaN}(t,\ v_{2}))\ \land \ b\ =\ \mathsf{false})\ \lor \ (\lnot \ (\operatorname{IsNaN}(t,\ v_{1})\ \lor \ \operatorname{IsNaN}(t,\ v_{2}))\ \land \ x_{1}\ =\ \operatorname{FloatValValue}(v_{1})\ \land \ x_{2}\ =\ \operatorname{FloatValValue}(v_{2})\ \land \ b\ =\ (x_{1}\ >\ x_{2})))\ \lor \ (\exists \ x_{1},\ x_{2}.\ \operatorname{OrdScalar}(v_{1})\ =\ x_{1}\ \land \ \operatorname{OrdScalar}(v_{2})\ =\ x_{2}\ \land \ b\ =\ (x_{1}\ >\ x_{2}))) \\[0.16em]
\operatorname{Cmp}(\texttt{">="},\ v_{1},\ v_{2})\ =\ b\ \Leftrightarrow \ \operatorname{OrdValue}(v_{1},\ v_{2})\ \land \ ((\exists \ t.\ \operatorname{FloatValue}(v_{1},\ t)\ \land \ \operatorname{FloatValue}(v_{2},\ t)\ \land \ ((\operatorname{IsNaN}(t,\ v_{1})\ \lor \ \operatorname{IsNaN}(t,\ v_{2}))\ \land \ b\ =\ \mathsf{false})\ \lor \ (\lnot \ (\operatorname{IsNaN}(t,\ v_{1})\ \lor \ \operatorname{IsNaN}(t,\ v_{2}))\ \land \ x_{1}\ =\ \operatorname{FloatValValue}(v_{1})\ \land \ x_{2}\ =\ \operatorname{FloatValValue}(v_{2})\ \land \ b\ =\ (x_{1}\ \ge \ x_{2})))\ \lor \ (\exists \ x_{1},\ x_{2}.\ \operatorname{OrdScalar}(v_{1})\ =\ x_{1}\ \land \ \operatorname{OrdScalar}(v_{2})\ =\ x_{2}\ \land \ b\ =\ (x_{1}\ \ge \ x_{2}))) \\[0.16em]
\operatorname{BitAt}(u,\ i)\ =\ b\ \Leftrightarrow \ b\ \in \ \{0,\ 1\}\ \land \ \exists \ q,\ r.\ u\ =\ q\ \cdot \ 2^\{i\ +\ 1\}\ +\ b\ \cdot \ 2^i\ +\ r\ \land \ 0\ \le \ r\ <\ 2^i \\[0.16em]
\operatorname{BitNot}(v)\ =\ v'\ \Leftrightarrow \ \exists \ t,\ x,\ w,\ u,\ u'.\ v\ =\ \operatorname{IntVal}(t,\ x)\ \land \ w\ =\ \operatorname{IntWidth}(t)\ \land \ u\ =\ \operatorname{ToUnsigned}(w,\ x)\ \land \ u'\ =\ (2^w\ -\ 1)\ -\ u\ \land \ ((t\ \in \ \mathsf{SignedIntTypes}\ \land \ v'\ =\ \operatorname{IntVal}(t,\ \operatorname{ToSigned}(w,\ u')))\ \lor \ (t\ \in \ \mathsf{UnsignedIntTypes}\ \land \ v'\ =\ \operatorname{IntVal}(t,\ u'))) \\[0.16em]
\operatorname{BitOp}(\mathsf{op},\ t,\ v_{1},\ v_{2})\ =\ v\ \Leftrightarrow \ v_{1}\ =\ \operatorname{IntVal}(t,\ x_{1})\ \land \ v_{2}\ =\ \operatorname{IntVal}(t,\ x_{2})\ \land \ w\ =\ \operatorname{IntWidth}(t)\ \land \ u_{1}\ =\ \operatorname{ToUnsigned}(w,\ x_{1})\ \land \ u_{2}\ =\ \operatorname{ToUnsigned}(w,\ x_{2})\ \land \ u\ =\ \sum \_\{i=0\}^\{w-1\}\ b_{i}\ 2^i\ \land \ \forall \ i.\ 0\ \le \ i\ <\ w\ \Rightarrow \ ((\mathsf{op}\ =\ \texttt{"\&"}\ \land \ b_{i}\ =\ \operatorname{BitAt}(u_{1},\ i)\ \cdot \ \operatorname{BitAt}(u_{2},\ i))\ \lor \ (\mathsf{op}\ =\ \texttt{"|"}\ \land \ b_{i}\ =\ \operatorname{max}(\operatorname{BitAt}(u_{1},\ i),\ \operatorname{BitAt}(u_{2},\ i)))\ \lor \ (\mathsf{op}\ =\ \texttt{"\^{}"}\ \land \ b_{i}\ =\ (\operatorname{BitAt}(u_{1},\ i)\ +\ \operatorname{BitAt}(u_{2},\ i))\ \mathsf{mod}\ 2))\ \land \ ((t\ \in \ \mathsf{SignedIntTypes}\ \land \ v\ =\ \operatorname{IntVal}(t,\ \operatorname{ToSigned}(w,\ u)))\ \lor \ (t\ \in \ \mathsf{UnsignedIntTypes}\ \land \ v\ =\ \operatorname{IntVal}(t,\ u))) \\[0.16em]
\operatorname{ShiftOp}(\mathsf{op},\ t,\ v_{1},\ v_{2})\ =\ v\ \Leftrightarrow \ v_{1}\ =\ \operatorname{IntVal}(t,\ x_{1})\ \land \ v_{2}\ =\ \operatorname{IntVal}(\texttt{"u32"},\ n)\ \land \ w\ =\ \operatorname{IntWidth}(t)\ \land \ 0\ \le \ n\ <\ w\ \land \ u_{1}\ =\ \operatorname{ToUnsigned}(w,\ x_{1})\ \land \ ((\mathsf{op}\ =\ \texttt{"<<"}\ \land \ u\ =\ (u_{1}\ \cdot \ 2^n)\ \mathsf{mod}\ 2^w)\ \lor \ (\mathsf{op}\ =\ \texttt{">>"}\ \land \ u\ =\ \lfloor u_{1}\ /\ 2^n\rfloor ))\ \land \ ((t\ \in \ \mathsf{SignedIntTypes}\ \land \ v\ =\ \operatorname{IntVal}(t,\ \operatorname{ToSigned}(w,\ u)))\ \lor \ (t\ \in \ \mathsf{UnsignedIntTypes}\ \land \ v\ =\ \operatorname{IntVal}(t,\ u))) \\[0.16em]
\operatorname{PowInt}(x,\ n)\ =\ y\ \Leftrightarrow \ n\ \in \ \mathbb{N} \ \land \ ((n\ =\ 0\ \land \ y\ =\ 1)\ \lor \ (n\ >\ 0\ \land \ y\ =\ x\ \cdot \ \operatorname{PowInt}(x,\ n\ -\ 1))) \\[0.16em]
\operatorname{PowFloat}(t,\ x_{1},\ x_{2})\ =\ x\ \Leftrightarrow \ t\ \in \ \mathsf{FloatTypes}\ \land \ x_{1}\ \in \ \operatorname{FloatValueSet}(t)\ \land \ x_{2}\ \in \ \operatorname{FloatValueSet}(t)\ \land \ x\ \mathsf{is}\ \mathsf{the}\ \mathsf{IEEE}\ 754-2019\ \mathsf{pow}\ \mathsf{result}\ \mathsf{of}\ x_{1},\ x_{2}\ \mathsf{in}\ \mathsf{format}\ \operatorname{FloatFormat}(t) \\[0.16em]
\operatorname{IEEEArith}(\mathsf{op},\ t,\ v_{1},\ v_{2})\ =\ v\ \Leftrightarrow \ v_{1}\ =\ \operatorname{FloatVal}(t,\ x_{1})\ \land \ v_{2}\ =\ \operatorname{FloatVal}(t,\ x_{2})\ \land \ \mathsf{op}\ \in \ \mathsf{ArithOps}\ \land \ ((\mathsf{op}\ \in \ \{\texttt{"+"},\ \texttt{"-"},\ \texttt{"*"},\ \texttt{"/"}\}\ \land \ x\ \mathsf{is}\ \mathsf{the}\ \mathsf{IEEE}\ 754-2019\ \mathsf{result}\ \mathsf{of}\ \mathsf{applying}\ \mathsf{op}\ \mathsf{to}\ x_{1},\ x_{2}\ \mathsf{in}\ \mathsf{format}\ \operatorname{FloatFormat}(t))\ \lor \ (\mathsf{op}\ =\ \texttt{"\%"}\ \land \ x\ \mathsf{is}\ \mathsf{the}\ \mathsf{IEEE}\ 754-2019\ \mathsf{remainder}\ \mathsf{of}\ x_{1},\ x_{2}\ \mathsf{in}\ \mathsf{format}\ \operatorname{FloatFormat}(t))\ \lor \ (\mathsf{op}\ =\ \texttt{"**"}\ \land \ \operatorname{PowFloat}(t,\ x_{1},\ x_{2})\ =\ x))\ \land \ v\ =\ \operatorname{FloatVal}(t,\ x) \\[0.16em]
\forall \ t\ \in \ \mathsf{FloatTypes},\ v_{1},\ v_{2},\ \mathsf{op}\ \in \ \mathsf{ArithOps}.\ \exists \ v.\ \operatorname{IEEEArith}(\mathsf{op},\ t,\ v_{1},\ v_{2})\ =\ v \\[0.16em]
\operatorname{UnOp}(\texttt{"!"},\ \mathsf{false})\ \Downarrow \ \mathsf{true} \\[0.16em]
\operatorname{UnOp}(\texttt{"!"},\ \mathsf{true})\ \Downarrow \ \mathsf{false} \\[0.16em]
\operatorname{UnOp}(\texttt{"!"},\ v)\ \Downarrow \ v'\ \Leftrightarrow \ \operatorname{IntValue}(v,\ t)\ \land \ v'\ =\ \operatorname{BitNot}(v) \\[0.16em]
\operatorname{UnOp}(\texttt{"-"},\ v)\ \Downarrow \ v'\ \Leftrightarrow \ v\ =\ \operatorname{IntVal}(t,\ x)\ \land \ t\ \in \ \mathsf{SignedIntTypes}\ \land \ x'\ =\ -x\ \land \ \operatorname{InRange}(x',\ t)\ \land \ v'\ =\ \operatorname{IntVal}(t,\ x') \\[0.16em]
\operatorname{UnOp}(\texttt{"-"},\ v)\ \Downarrow \ v'\ \Leftrightarrow \ v\ =\ \operatorname{FloatVal}(t,\ x)\ \land \ v'\ =\ \operatorname{FloatVal}(t,\ -x) \\[0.16em]
\operatorname{UnOp}(\texttt{"widen"},\ v)\ \Downarrow \ \operatorname{ModalVal}(S,\ v)\ \Leftrightarrow \ v\ =\ \operatorname{RecordValue}(\operatorname{ModalStateRef}(\mathsf{modal}_{\mathsf{ref}},\ S),\ \mathsf{io})
\end{array}
$$

For floating-point operands, unary `-` is total (no overflow panic) and MUST preserve width (`f16`/`f32`/`f64`) while applying IEEE-754 sign negation.

$$
\begin{array}{l}
\operatorname{BinOp}(\mathsf{op},\ v_{1},\ v_{2})\ \Downarrow \ v\ \Leftrightarrow \ \mathsf{op}\ \in \ \mathsf{ArithOps}\ \land \ \operatorname{NumericValue}(v_{1},\ t)\ \land \ \operatorname{NumericValue}(v_{2},\ t)\ \land \ \operatorname{ArithEval}(\mathsf{op},\ t,\ v_{1},\ v_{2})\ \Downarrow \ v \\[0.16em]
\operatorname{BinOp}(\mathsf{op},\ v_{1},\ v_{2})\ \Downarrow \ v\ \Leftrightarrow \ \mathsf{op}\ \in \ \mathsf{BitOps}\ \land \ \operatorname{IntValue}(v_{1},\ t)\ \land \ \operatorname{IntValue}(v_{2},\ t)\ \land \ \operatorname{BitEval}(\mathsf{op},\ t,\ v_{1},\ v_{2})\ \Downarrow \ v \\[0.16em]
\operatorname{BinOp}(\mathsf{op},\ v_{1},\ v_{2})\ \Downarrow \ v\ \Leftrightarrow \ \mathsf{op}\ \in \ \mathsf{ShiftOps}\ \land \ \operatorname{IntValue}(v_{1},\ t)\ \land \ \operatorname{U32Value}(v_{2})\ \land \ \operatorname{ShiftEval}(\mathsf{op},\ t,\ v_{1},\ v_{2})\ \Downarrow \ v \\[0.16em]
\operatorname{BinOp}(\mathsf{op},\ v_{1},\ v_{2})\ \Downarrow \ v\ \Leftrightarrow \ \mathsf{op}\ \in \ \{\texttt{"=="},\ \texttt{"!="}\}\ \land \ \operatorname{EqValue}(v_{1},\ v_{2})\ \land \ v\ =\ \operatorname{Cmp}(\mathsf{op},\ v_{1},\ v_{2}) \\[0.16em]
\operatorname{BinOp}(\mathsf{op},\ v_{1},\ v_{2})\ \Downarrow \ v\ \Leftrightarrow \ \mathsf{op}\ \in \ \{\texttt{"<"},\ \texttt{"<="},\ \texttt{">"},\ \texttt{">="}\}\ \land \ \operatorname{OrdValue}(v_{1},\ v_{2})\ \land \ v\ =\ \operatorname{Cmp}(\mathsf{op},\ v_{1},\ v_{2}) \\[0.16em]
\operatorname{ArithEval}(\mathsf{op},\ t,\ v_{1},\ v_{2})\ \Downarrow \ v\ \Leftrightarrow \ t\ \in \ \mathsf{IntTypes}\ \land \ v_{1}\ =\ \operatorname{IntVal}(t,\ x_{1})\ \land \ v_{2}\ =\ \operatorname{IntVal}(t,\ x_{2})\ \land \ ((\mathsf{op}\ \in \ \{\texttt{"+"},\ \texttt{"-"},\ \texttt{"*"}\}\ \land \ x\ =\ x_{1}\ \mathsf{op}\ x_{2})\ \lor \ (\mathsf{op}\ \in \ \{\texttt{"/"},\ \texttt{"\%"}\}\ \land \ x_{2}\ \ne \ 0\ \land \ x\ =\ x_{1}\ \mathsf{op}\ x_{2})\ \lor \ (\mathsf{op}\ =\ \texttt{"**"}\ \land \ x_{2}\ \ge \ 0\ \land \ \operatorname{PowInt}(x_{1},\ x_{2})\ =\ x))\ \land \ \operatorname{InRange}(x,\ t)\ \land \ v\ =\ \operatorname{IntVal}(t,\ x) \\[0.16em]
\operatorname{ArithEval}(\mathsf{op},\ t,\ v_{1},\ v_{2})\ \Downarrow \ v\ \Leftrightarrow \ t\ \in \ \mathsf{FloatTypes}\ \land \ v\ =\ \operatorname{IEEEArith}(\mathsf{op},\ t,\ v_{1},\ v_{2}) \\[0.16em]
\operatorname{BitEval}(\mathsf{op},\ t,\ v_{1},\ v_{2})\ \Downarrow \ v\ \Leftrightarrow \ t\ \in \ \mathsf{IntTypes}\ \land \ v\ =\ \operatorname{BitOp}(\mathsf{op},\ t,\ v_{1},\ v_{2}) \\[0.16em]
\operatorname{ShiftEval}(\mathsf{op},\ t,\ v_{1},\ v_{2})\ \Downarrow \ v\ \Leftrightarrow \ t\ \in \ \mathsf{IntTypes}\ \land \ v\ =\ \operatorname{ShiftOp}(\mathsf{op},\ t,\ v_{1},\ v_{2})
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

**(EvalSigma-Unary)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad \operatorname{UnOp}(\mathsf{op},\ v)\ \Downarrow \ v' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Unary}(\mathsf{op},\ e),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Bin-And-False)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e_{1},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{false}),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Binary}(\texttt{"\&\&"},\ e_{1},\ e_{2}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{false}),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Bin-And-True)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e_{1},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{true}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(e_{2},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Binary}(\texttt{"\&\&"},\ e_{1},\ e_{2}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Bin-Or-True)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e_{1},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{true}),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Binary}(\texttt{"||"},\ e_{1},\ e_{2}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{true}),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Bin-Or-False)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e_{1},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{false}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(e_{2},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Binary}(\texttt{"||"},\ e_{1},\ e_{2}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Binary)**

$$
\begin{array}{l}
\mathsf{op}\ \notin \ \{\texttt{"\&\&"},\ \texttt{"||"}\}\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(e_{1},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{1}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(e_{2},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(v_{2}),\ \sigma_{2} )\quad \operatorname{BinOp}(\mathsf{op},\ v_{1},\ v_{2})\ \Downarrow \ v \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Binary}(\mathsf{op},\ e_{1},\ e_{2}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{2} )
\end{array}
$$

If `UnOp` or `BinOp` is undefined, evaluation produces `Ctrl(Panic)`. The old draft defines NaN-sensitive comparison behavior through `Cmp`; ordered float comparisons with NaN yield `false`, `==` yields `false`, and `!=` yields `true`.

### 16.4.6 Lowering

**(Lower-Expr-Unary)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerUnOp}(\mathsf{op},\ e)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{Unary}(\mathsf{op},\ e))\ \Downarrow \ \langle \mathsf{IR},\ v\rangle 
\end{array}
$$

**(Lower-Expr-Bin-And)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e_{1})\ \Downarrow \ \langle \mathsf{IR}_{1},\ v_{1}\rangle \quad \Gamma \ \vdash \ \operatorname{LowerExpr}(e_{2})\ \Downarrow \ \langle \mathsf{IR}_{2},\ v_{2}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{Binary}(\texttt{"\&\&"},\ e_{1},\ e_{2}))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{1},\ \operatorname{IfIR}(v_{1},\ \mathsf{IR}_{2},\ v_{2},\ \varepsilon ,\ \mathsf{false})),\ v_{\mathsf{and}}\rangle 
\end{array}
$$

**(Lower-Expr-Bin-Or)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e_{1})\ \Downarrow \ \langle \mathsf{IR}_{1},\ v_{1}\rangle \quad \Gamma \ \vdash \ \operatorname{LowerExpr}(e_{2})\ \Downarrow \ \langle \mathsf{IR}_{2},\ v_{2}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{Binary}(\texttt{"||"},\ e_{1},\ e_{2}))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{1},\ \operatorname{IfIR}(v_{1},\ \varepsilon ,\ \mathsf{true},\ \mathsf{IR}_{2},\ v_{2})),\ v_{\mathsf{or}}\rangle 
\end{array}
$$

**(Lower-Expr-Binary)**

$$
\begin{array}{l}
\mathsf{op}\ \notin \ \{\texttt{"\&\&"},\ \texttt{"||"}\}\quad \Gamma \ \vdash \ \operatorname{LowerBinOp}(\mathsf{op},\ e_{1},\ e_{2})\ \Downarrow \ \langle \mathsf{IR},\ v\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{Binary}(\mathsf{op},\ e_{1},\ e_{2}))\ \Downarrow \ \langle \mathsf{IR},\ v\rangle 
\end{array}
$$

**(Lower-Expr-Range)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerRangeExpr}(\operatorname{Range}(\mathsf{kind},\ \mathsf{lo}_{\mathsf{opt}},\ \mathsf{hi}_{\mathsf{opt}}))\ \Downarrow \ \langle \mathsf{IR},\ v\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{Range}(\mathsf{kind},\ \mathsf{lo}_{\mathsf{opt}},\ \mathsf{hi}_{\mathsf{opt}}))\ \Downarrow \ \langle \mathsf{IR},\ v\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{OpPanicReason}(\texttt{"-"})\ =\ \mathsf{Overflow} \\[0.16em]
\operatorname{NeedsUnOpPanicCheck}(\mathsf{op},\ T)\ \Leftrightarrow \ \mathsf{op}\ =\ \texttt{"-"}\ \land \ \operatorname{StripPerm}(T)\ =\ \operatorname{TypePrim}(t)\ \land \ t\ \in \ \mathsf{SignedIntTypes}
\end{array}
$$

**(Lower-UnOp-Ok)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle \quad T\ =\ \operatorname{ExprType}(e)\quad \lnot \ \operatorname{NeedsUnOpPanicCheck}(\mathsf{op},\ T)\quad v_{r}\ =\ \operatorname{FreshTemp}(\texttt{"unop"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerUnOp}(\mathsf{op},\ e)\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{e},\ \operatorname{UnOpIR}(\mathsf{op},\ v,\ v_{r})),\ v_{r}\rangle 
\end{array}
$$

**(Lower-UnOp-Panic)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle \quad T\ =\ \operatorname{ExprType}(e)\quad \operatorname{NeedsUnOpPanicCheck}(\mathsf{op},\ T)\quad r\ =\ \operatorname{OpPanicReason}(\mathsf{op})\quad v_{r}\ =\ \operatorname{FreshTemp}(\texttt{"unop"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerUnOp}(\mathsf{op},\ e)\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{e},\ \operatorname{CheckOpIR}(\mathsf{op},\ v,\ r),\ \mathsf{PanicCheckIR},\ \operatorname{UnOpIR}(\mathsf{op},\ v,\ v_{r})),\ v_{r}\rangle 
\end{array}
$$

For unary `-`, overflow checks MUST be emitted only when `NeedsUnOpPanicCheck` holds. Unary `-` on floating operands MUST NOT lower an overflow check.

`Lower-BinOp-Ok`, `Lower-BinOp-Panic`, and `Lower-Range-Full` through `Lower-Range-Exclusive` define the remaining panic-triggering and range-value construction behavior.

### 16.4.7 Diagnostics

Diagnostics are defined for operator-operand type mismatches, ill-typed range bounds, and dynamic operator failures that lower to panic when primitive unary or binary evaluation is undefined.
