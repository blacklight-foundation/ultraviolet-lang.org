---
title: "Concrete Data Types"
description: "12. Concrete Data Types of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T19:35:24.518Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>


## 12.1 Primitive Types

### 12.1.1 Syntax

```text
primitive_type  ::= signed_int_type
                  | unsigned_int_type
                  | float_type
                  | "bool"
                  | "char"
                  | "(" ")"
                  | "!"
signed_int_type ::= "i8" | "i16" | "i32" | "i64" | "i128" | "isize"
unsigned_int_type ::= "u8" | "u16" | "u32" | "u64" | "u128" | "usize"
float_type      ::= "f16" | "f32" | "f64"
```

### 12.1.2 Parsing

$$
\mathsf{PrimLexemeSet}\ =\ \{\texttt{i8},\ \texttt{i16},\ \texttt{i32},\ \texttt{i64},\ \texttt{i128},\ \texttt{isize},\ \texttt{u8},\ \texttt{u16},\ \texttt{u32},\ \texttt{u64},\ \texttt{u128},\ \texttt{usize},\ \texttt{f16},\ \texttt{f32},\ \texttt{f64},\ \texttt{bool},\ \texttt{char}\}
$$

**(Parse-Prim-Type)**

$$
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \operatorname{Lexeme}(\operatorname{Tok}(P))\ \in \ \mathsf{PrimLexemeSet} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseNonPermType}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \operatorname{TypePrim}(\operatorname{Lexeme}(\operatorname{Tok}(P))))
\end{array}
$$

**(Parse-Unit-Type)**
IsPunc(Tok(P), "(")    IsPunc(Tok(Advance(P)), ")")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseNonPermType}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P)),\ \operatorname{TypePrim}(\texttt{"()"}))
\end{array}
$$

**(Parse-Never-Type)**
IsOp(Tok(P), "!")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseNonPermType}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \operatorname{TypePrim}(\texttt{"!"}))
\end{array}
$$

### 12.1.3 AST Representation / Form

$$
\mathsf{PrimitiveTypeName}\ =\ \{\texttt{i8},\ \texttt{i16},\ \texttt{i32},\ \texttt{i64},\ \texttt{i128},\ \texttt{isize},\ \texttt{u8},\ \texttt{u16},\ \texttt{u32},\ \texttt{u64},\ \texttt{u128},\ \texttt{usize},\ \texttt{f16},\ \texttt{f32},\ \texttt{f64},\ \texttt{bool},\ \texttt{char},\ \texttt{()},\ \texttt{!}\}
$$

$$
\mathsf{TypePrim}\ =\ \langle \mathsf{name}\rangle \ \mathsf{where}\ \mathsf{name}\ \in \ \mathsf{PrimitiveTypeName}
$$

$$
\begin{array}{l}
\mathsf{IntTypes}\ =\ \{\texttt{i8},\ \texttt{i16},\ \texttt{i32},\ \texttt{i64},\ \texttt{i128},\ \texttt{u8},\ \texttt{u16},\ \texttt{u32},\ \texttt{u64},\ \texttt{u128},\ \texttt{isize},\ \texttt{usize}\} \\
\mathsf{FloatTypes}\ =\ \{\texttt{f16},\ \texttt{f32},\ \texttt{f64}\} \\
\mathsf{SignedIntTypes}\ =\ \{\texttt{i8},\ \texttt{i16},\ \texttt{i32},\ \texttt{i64},\ \texttt{i128},\ \texttt{isize}\} \\
\mathsf{UnsignedIntTypes}\ =\ \{\texttt{u8},\ \texttt{u16},\ \texttt{u32},\ \texttt{u64},\ \texttt{u128},\ \texttt{usize}\} \\
\mathsf{NumericTypes}\ =\ \mathsf{IntTypes}\ \cup \ \mathsf{FloatTypes}
\end{array}
$$

### 12.1.4 Static Semantics

$$
\mathsf{TypeWFJudg}\ =\ \{\Gamma \ \vdash \ T\ \mathsf{wf}\}
$$

**(WF-Prim)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePrim}(\mathsf{name})\quad \mathsf{name}\ \in \ \{\texttt{i8},\ \texttt{i16},\ \texttt{i32},\ \texttt{i64},\ \texttt{i128},\ \texttt{isize},\ \texttt{u8},\ \texttt{u16},\ \texttt{u32},\ \texttt{u64},\ \texttt{u128},\ \texttt{usize},\ \texttt{f16},\ \texttt{f32},\ \texttt{f64},\ \texttt{bool},\ \texttt{char},\ \texttt{()},\ \texttt{!}\} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \mathsf{wf}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{FloatFormat}(\texttt{"f16"})\ =\ \texttt{binary16}\quad \operatorname{FloatFormat}(\texttt{"f32"})\ =\ \texttt{binary32}\quad \operatorname{FloatFormat}(\texttt{"f64"})\ =\ \texttt{binary64} \\
\operatorname{FloatBitWidth}(\texttt{"f16"})\ =\ 16\quad \operatorname{FloatBitWidth}(\texttt{"f32"})\ =\ 32\quad \operatorname{FloatBitWidth}(\texttt{"f64"})\ =\ 64 \\
\operatorname{FloatValueSet}(t)\ =\ \{\ v\ \mid \ v\ \mathsf{is}\ a\ \mathsf{value}\ \mathsf{representable}\ \mathsf{by}\ \mathsf{IEEE}\ 754-2019\ \mathsf{format}\ \operatorname{FloatFormat}(t)\ \} \\
\operatorname{IEEE754Encode}(t,\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ v\ \in \ \operatorname{FloatValueSet}(t)\ \land \ \mathsf{bits}\ \in \ [0,\ 2^\{\operatorname{FloatBitWidth}(t)\}\ -\ 1]\ \land \ ((v\ \mathsf{is}\ \mathsf{NaN}\ \mathsf{in}\ \mathsf{IEEE}\ 754-2019\ \mathsf{format}\ \operatorname{FloatFormat}(t)\ \land \ \mathsf{bits}\ =\ \operatorname{CanonicalNaNBits}(t))\ \lor \ (v\ \mathsf{is}\ \mathsf{not}\ \mathsf{NaN}\ \mathsf{in}\ \mathsf{IEEE}\ 754-2019\ \mathsf{format}\ \operatorname{FloatFormat}(t)\ \land \ \mathsf{bits}\ \mathsf{is}\ \mathsf{the}\ \mathsf{IEEE}\ 754-2019\ \mathsf{encoding}\ \mathsf{of}\ v\ \mathsf{in}\ \mathsf{format}\ \operatorname{FloatFormat}(t))) \\
\operatorname{CanonicalNaNBits}(\texttt{"f16"})\ =\ 0\mathsf{x7E00}\quad \operatorname{CanonicalNaNBits}(\texttt{"f32"})\ =\ 0\mathsf{x7FC00000}\quad \operatorname{CanonicalNaNBits}(\texttt{"f64"})\ =\ 0\mathsf{x7FF8000000000000} \\
\operatorname{CanonicalNaN}(t)\ =\ v\ \Leftrightarrow \ \operatorname{IEEE754Encode}(t,\ v)\ =\ \operatorname{CanonicalNaNBits}(t) \\
\operatorname{NonNaNValueSet}(t)\ =\ \{\ v\ \in \ \operatorname{FloatValueSet}(t)\ \mid \ \operatorname{IEEE754Encode}(t,\ v)\ \ne \ \operatorname{CanonicalNaNBits}(t)\ \} \\
\operatorname{LSB}(n)\ =\ n\ \mathsf{mod}\ 2 \\
\operatorname{EvenSignificandLSB}(t,\ v)\ \Leftrightarrow \ \operatorname{LSB}(\operatorname{IEEE754Encode}(t,\ v))\ =\ 0 \\
\operatorname{IEEE754Bits}(t,\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ v\ \in \ \operatorname{FloatValueSet}(t)\ \land \ \operatorname{IEEE754Encode}(t,\ v)\ =\ \mathsf{bits}
\end{array}
$$

DefaultInt = `i32`
DefaultFloat = `f32`

$$
\begin{array}{l}
\operatorname{IntWidth}(\texttt{i8})\ =\ 8\quad \operatorname{IntWidth}(\texttt{i16})\ =\ 16\quad \operatorname{IntWidth}(\texttt{i32})\ =\ 32\quad \operatorname{IntWidth}(\texttt{i64})\ =\ 64\quad \operatorname{IntWidth}(\texttt{i128})\ =\ 128 \\
\operatorname{IntWidth}(\texttt{u8})\ =\ 8\quad \operatorname{IntWidth}(\texttt{u16})\ =\ 16\quad \operatorname{IntWidth}(\texttt{u32})\ =\ 32\quad \operatorname{IntWidth}(\texttt{u64})\ =\ 64\quad \operatorname{IntWidth}(\texttt{u128})\ =\ 128 \\
\operatorname{IntWidth}(\texttt{isize})\ =\ 8\ \times \ \mathsf{PointerSize}\quad \operatorname{IntWidth}(\texttt{usize})\ =\ 8\ \times \ \mathsf{PointerSize}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{RangeOf}\ :\ \mathsf{PrimitiveTypeName}\ \rightharpoonup \ \wp (ℝ) \\
\operatorname{RangeOf}(t)\ =\ [-2^\{w-1\},\ 2^\{w-1\}\ -\ 1]\ \mathsf{if}\ t\ \in \ \mathsf{SignedIntTypes}\ \land \ w\ =\ \operatorname{IntWidth}(t) \\
\operatorname{RangeOf}(t)\ =\ [0,\ 2^\{w\}\ -\ 1]\ \mathsf{if}\ t\ \in \ \mathsf{UnsignedIntTypes}\ \land \ w\ =\ \operatorname{IntWidth}(t)
\end{array}
$$
RangeOf(t) undefined otherwise

$$
\operatorname{InRange}(v,\ T)\ \Leftrightarrow \ v\ \in \ \operatorname{RangeOf}(T)
$$

### 12.1.5 Dynamic Semantics

$$
\begin{array}{l}
\operatorname{ValueType}(\operatorname{IntVal}(t,\ x))\ =\ \operatorname{TypePrim}(t) \\
\operatorname{ValueType}(\operatorname{FloatVal}(t,\ v))\ =\ \operatorname{TypePrim}(t) \\
\operatorname{ValueType}(v)\ =\ \operatorname{TypePrim}(\texttt{"bool"})\ \Leftrightarrow \ \exists \ b.\ v\ =\ \operatorname{BoolVal}(b) \\
\operatorname{ValueType}(v)\ =\ \operatorname{TypePrim}(\texttt{"char"})\ \Leftrightarrow \ \exists \ u.\ v\ =\ \operatorname{CharVal}(u) \\
\operatorname{ValueType}(\operatorname{BoolVal}(\mathsf{true}))\ =\ \operatorname{TypePrim}(\texttt{"bool"}) \\
\operatorname{ValueType}(\operatorname{BoolVal}(\mathsf{false}))\ =\ \operatorname{TypePrim}(\texttt{"bool"}) \\
\operatorname{ValueType}(\operatorname{CharVal}(u))\ =\ \operatorname{TypePrim}(\texttt{"char"}) \\
\operatorname{ValueType}(\mathsf{UnitVal})\ =\ \operatorname{TypePrim}(\texttt{"()"})
\end{array}
$$

Primitive-operation evaluation is defined by §16.4. This section introduces no additional reduction rules beyond the primitive value domains above.

### 12.1.6 Lowering

$$
\begin{array}{l}
\operatorname{ValueBits}(\operatorname{TypePrim}(\texttt{"bool"}),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ (v\ =\ \operatorname{BoolVal}(\mathsf{true})\ \land \ \mathsf{bits}\ =\ [0\mathsf{x01}])\ \lor \ (v\ =\ \operatorname{BoolVal}(\mathsf{false})\ \land \ \mathsf{bits}\ =\ [0\mathsf{x00}]) \\
\operatorname{ValueBits}(\operatorname{TypePrim}(\texttt{"char"}),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ v\ =\ \operatorname{CharVal}(u)\ \land \ \operatorname{LEBytes}(u,\ 4)\ =\ \mathsf{bits} \\
\operatorname{ValueBits}(\operatorname{TypePrim}(\texttt{"()"}),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ v\ =\ \mathsf{UnitVal}\ \land \ \mathsf{bits}\ =\ [] \\
\operatorname{ValueBits}(\operatorname{TypePrim}(t),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ t\ \in \ \mathsf{IntTypes}\ \land \ v\ =\ \operatorname{IntVal}(t,\ x)\ \land \ \operatorname{LEBytes}(x,\ \operatorname{sizeof}(\operatorname{TypePrim}(t)))\ =\ \mathsf{bits} \\
\operatorname{ValueBits}(\operatorname{TypePrim}(t),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ t\ \in \ \mathsf{FloatTypes}\ \land \ v\ =\ \operatorname{FloatVal}(t,\ x)\ \land \ \operatorname{LEBytes}(\operatorname{IEEE754Bits}(t,\ x),\ \operatorname{sizeof}(\operatorname{TypePrim}(t)))\ =\ \mathsf{bits}
\end{array}
$$

Primitive-type layout and ABI classification are defined by Chapter 24.

### 12.1.7 Diagnostics

Diagnostics are defined for malformed primitive type syntax and for literal-range or suffix mismatches at the primitive use sites defined by §16.1. This section introduces no construct-specific diagnostic beyond primitive-type well-formedness.

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
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseTupleTypeElems}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{elems})\quad \mathsf{elems}\ \ne \ []\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{")"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseNonPermType}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{TypeTuple}(\mathsf{elems}))
\end{array}
$$

**(Parse-TupleTypeElems-Empty)**
IsPunc(Tok(P), ")")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseTupleTypeElems}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-TupleTypeElems-One)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseType}(P)\ \Downarrow \ (P_{1},\ t)\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{";"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseTupleTypeElems}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ [t])
\end{array}
$$

**(Parse-TupleTypeElems-Many)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseType}(P)\ \Downarrow \ (P_{1},\ t_{1})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ t_{2})\quad \Gamma \ \vdash \ \operatorname{ParseTypeListTail}(P_{2},\ [t_{2}])\ \Downarrow \ (P_{3},\ \mathsf{ts}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseTupleTypeElems}(P)\ \Downarrow \ (P_{3},\ [t_{1}]\ \mathbin{++} \ \mathsf{ts})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ParenDelta}(\operatorname{Punctuator}(\texttt{"("}))\ =\ 1 \\
\operatorname{ParenDelta}(\operatorname{Punctuator}(\texttt{")"}))\ =\ -1 \\
\operatorname{ParenDelta}(t)\ =\ 0\ \mathsf{if}\ t.\mathsf{kind}\ \notin \ \{\operatorname{Punctuator}(\texttt{"("}),\ \operatorname{Punctuator}(\texttt{")"})\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BracketDelta}(\operatorname{Punctuator}(\texttt{"["}))\ =\ 1 \\
\operatorname{BracketDelta}(\operatorname{Punctuator}(\texttt{"]"}))\ =\ -1 \\
\operatorname{BracketDelta}(t)\ =\ 0\ \mathsf{if}\ t.\mathsf{kind}\ \notin \ \{\operatorname{Punctuator}(\texttt{"["}),\ \operatorname{Punctuator}(\texttt{"]"})\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BraceDelta}(\operatorname{Punctuator}(\texttt{"\{"}))\ =\ 1 \\
\operatorname{BraceDelta}(\operatorname{Punctuator}(\texttt{"\}"}))\ =\ -1 \\
\operatorname{BraceDelta}(t)\ =\ 0\ \mathsf{if}\ t.\mathsf{kind}\ \notin \ \{\operatorname{Punctuator}(\texttt{"\{"}),\ \operatorname{Punctuator}(\texttt{"\}"})\}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{TupleScanDepth}\ =\ \langle p,\ q,\ r\rangle \ \mathsf{where}\ p,\ q,\ r\ \in \ \mathsf{Nat} \\
\operatorname{TupleScan}(P,\ d)\ \Downarrow \ b\ \Leftrightarrow \ \operatorname{TupleScan}(P,\ \langle d,\ 0,\ 0\rangle )\ \Downarrow \ b \\
\operatorname{TupleScanStep}(\langle p,\ q,\ r\rangle ,\ t)\ =\ \langle p\ +\ \operatorname{ParenDelta}(t),\ \operatorname{max}(0,\ q\ +\ \operatorname{BracketDelta}(t)),\ \operatorname{max}(0,\ r\ +\ \operatorname{BraceDelta}(t))\rangle  \\
\operatorname{TupleScanOuterSep}(\langle p,\ q,\ r\rangle )\ \Leftrightarrow \ p\ =\ 1\ \land \ q\ =\ 0\ \land \ r\ =\ 0 \\
\operatorname{TupleScanSingletonComma}(P)\ \Leftrightarrow \ \operatorname{Tok}(P)\ =\ \operatorname{Punctuator}(\texttt{","})\ \land \ \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{SkipNL}(\operatorname{Advance}(P))),\ \texttt{")"}) \\
\operatorname{TupleScanEndParen}(P,\ \langle p,\ q,\ r\rangle )\ \Leftrightarrow \ \operatorname{Tok}(P)\ =\ \operatorname{Punctuator}(\texttt{")"})\ \land \ p\ =\ 1 \\
\operatorname{TupleScanSep}(P,\ D)\ \Leftrightarrow \ \operatorname{Tok}(P)\ \in \ \{\operatorname{Punctuator}(\texttt{","}),\ \operatorname{Punctuator}(\texttt{";"})\}\ \land \ \operatorname{TupleScanOuterSep}(D) \\
\operatorname{TupleScanAdvance}(P,\ D)\ \Leftrightarrow \ \operatorname{Tok}(P)\ \ne \ \mathsf{EOF}\ \land \ \lnot \ \operatorname{TupleScanEndParen}(P,\ D)\ \land \ \lnot \ \operatorname{TupleScanSep}(P,\ D)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{TupleScan}(P,\ D)\ \Downarrow \ b \\
\operatorname{Tok}(P)\ =\ \mathsf{EOF} \\
\rule{18em}{0.4pt} \\
\operatorname{TupleScan}(P,\ D)\ \Downarrow \ \mathsf{false}
\end{array}
$$
TupleScanEndParen(P, D)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\operatorname{TupleScan}(P,\ D)\ \Downarrow \ \mathsf{false} \\
\operatorname{TupleScanSingletonComma}(P)\ \land \ \operatorname{TupleScanOuterSep}(D) \\
\rule{18em}{0.4pt} \\
\operatorname{TupleScan}(P,\ D)\ \Downarrow \ \mathsf{false} \\
\operatorname{TupleScanSep}(P,\ D)\ \land \ \lnot \ \operatorname{TupleScanSingletonComma}(P) \\
\rule{18em}{0.4pt} \\
\operatorname{TupleScan}(P,\ D)\ \Downarrow \ \mathsf{true} \\
\operatorname{TupleScanAdvance}(P,\ D)\quad \operatorname{TupleScan}(\operatorname{Advance}(P),\ \operatorname{TupleScanStep}(D,\ \operatorname{Tok}(P)))\ \Downarrow \ b \\
\rule{18em}{0.4pt} \\
\operatorname{TupleScan}(P,\ D)\ \Downarrow \ b
\end{array}
$$

$$
\operatorname{TupleParen}(P)\ \Leftrightarrow \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\ \land \ (\operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{")"})\ \lor \ \operatorname{TupleScan}(\operatorname{Advance}(P),\ 1)\ \Downarrow \ \mathsf{true})
$$

**(Parse-Tuple-Literal)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\quad \operatorname{TupleParen}(P)\quad \Gamma \ \vdash \ \operatorname{ParseTupleExprElems}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{elems})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{")"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{TupleExpr}(\mathsf{elems}))
\end{array}
$$

**(Parse-TupleExprElems-Empty)**
IsPunc(Tok(P), ")")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseTupleExprElems}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-TupleExprElems-Single)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseExpr}(P)\ \Downarrow \ (P_{1},\ e)\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{";"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseTupleExprElems}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ [e])
\end{array}
$$

**(Parse-TupleExprElems-Many)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseExpr}(P)\ \Downarrow \ (P_{1},\ e_{1})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ e_{2})\quad \Gamma \ \vdash \ \operatorname{ParseExprListTail}(P_{2},\ [e_{2}])\ \Downarrow \ (P_{3},\ \mathsf{es}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseTupleExprElems}(P)\ \Downarrow \ (P_{3},\ [e_{1}]\ \mathbin{++} \ \mathsf{es})
\end{array}
$$

**(Postfix-TupleIndex)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"."})\quad t\ =\ \operatorname{Tok}(\operatorname{Advance}(P))\quad t.\mathsf{kind}\ =\ \mathsf{IntLiteral}\quad \mathsf{idx}\ =\ \operatorname{IntValue}(t) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{PostfixStep}(P,\ e)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P)),\ \operatorname{TupleAccess}(e,\ \mathsf{idx}))
\end{array}
$$

### 12.2.3 AST Representation / Form

$$
\mathsf{TypeTuple}\ =\ \langle \mathsf{elems}\rangle \ \mathsf{where}\ \mathsf{elems}\ \in \ [\mathsf{Type}]
$$

$$
\begin{array}{l}
\mathsf{TupleExpr}\ =\ \langle \mathsf{elems}\rangle \ \mathsf{where}\ \mathsf{elems}\ \in \ [\mathsf{Expr}] \\
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
T\ =\ \operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}])\quad \forall \ i,\ \Gamma \ \vdash \ T_{i}\ \mathsf{wf} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \mathsf{wf}
\end{array}
$$

**(T-Tuple-Unit)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TupleExpr}([])\ :\ \operatorname{TypePrim}(\texttt{"()"})
\end{array}
$$

**(T-Tuple)**

$$
\begin{array}{l}
n\ \ge \ 1\quad \forall \ i,\ \Gamma \ \vdash \ e_{i}\ :\ T_{i} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TupleExpr}([e_{1},\ \ldots ,\ e_{n}])\ :\ \operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}])
\end{array}
$$

**(T-Tuple-Index)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ :\ \operatorname{TypeTuple}([T_{0},\ \ldots ,\ T\_\{n-1\}])\quad 0\ \le \ i\ <\ n\quad \operatorname{BitcopyType}(T_{i}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TupleAccess}(e,\ i)\ :\ T_{i}
\end{array}
$$

**(T-Tuple-Index-Perm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ :\ \operatorname{TypePerm}(p,\ \operatorname{TypeTuple}([T_{0},\ \ldots ,\ T\_\{n-1\}]))\quad 0\ \le \ i\ <\ n\quad \operatorname{BitcopyType}(\operatorname{TypePerm}(p,\ T_{i})) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TupleAccess}(e,\ i)\ :\ \operatorname{TypePerm}(p,\ T_{i})
\end{array}
$$

**(P-Tuple-Index)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ :\mathsf{place}\ \operatorname{TypeTuple}([T_{0},\ \ldots ,\ T\_\{n-1\}])\quad 0\ \le \ i\ <\ n \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TupleAccess}(e,\ i)\ :\mathsf{place}\ T_{i}
\end{array}
$$

**(P-Tuple-Index-Perm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ :\mathsf{place}\ \operatorname{TypePerm}(p,\ \operatorname{TypeTuple}([T_{0},\ \ldots ,\ T\_\{n-1\}]))\quad 0\ \le \ i\ <\ n \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TupleAccess}(e,\ i)\ :\mathsf{place}\ \operatorname{TypePerm}(p,\ T_{i})
\end{array}
$$

$$
\operatorname{ConstTupleIndex}(i)\ \Leftrightarrow \ \exists \ n\ \in \ \mathbb{Z} .\ i\ =\ n
$$

**(TupleIndex-NonConst)**

$$
\begin{array}{l}
\lnot \ \operatorname{ConstTupleIndex}(i)\quad c\ =\ \operatorname{Code}(\mathsf{TupleIndex}-\mathsf{NonConst}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TupleAccess}(e,\ i)\ \Uparrow \ c
\end{array}
$$

**(TupleIndex-OOB)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ :\ \operatorname{TypeTuple}([T_{0},\ \ldots ,\ T\_\{n-1\}])\quad (i\ <\ 0\ \lor \ i\ \ge \ n)\quad c\ =\ \operatorname{Code}(\mathsf{TupleIndex}-\mathsf{OOB}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TupleAccess}(e,\ i)\ \Uparrow \ c
\end{array}
$$

**(TupleAccess-NotTuple)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ :\ T\quad \operatorname{StripPerm}(T)\ \ne \ \operatorname{TypeTuple}(\_)\quad c\ =\ \operatorname{Code}(\mathsf{TupleAccess}-\mathsf{NotTuple}) \\
\rule{18em}{0.4pt} \\
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
\Gamma \ \vdash \ \operatorname{EvalListSigma}(\mathsf{es},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{v}),\ \sigma_{1} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{TupleExpr}(\mathsf{es}),\ \sigma )\ \Downarrow \ (\operatorname{Val}((v_{1},\ \ldots ,\ v_{n})),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Tuple-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalListSigma}(\mathsf{es},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{TupleExpr}(\mathsf{es}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-TupleAccess)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{base},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{b}),\ \sigma_{1} )\quad \operatorname{TupleValue}(v_{b},\ i)\ =\ v_{i} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{TupleAccess}(\mathsf{base},\ i),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{i}),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-TupleAccess-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{base},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\
\rule{18em}{0.4pt} \\
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
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TupleLayout}([])\ \Downarrow \ \langle 0,\ 1,\ []\rangle 
\end{array}
$$

**(Layout-Tuple-Cons)**

$$
\begin{array}{l}
n\ \ge \ 1\quad \operatorname{TupleFields}([T_{1},\ \ldots ,\ T_{n}])\ =\ \mathsf{fields}\quad \operatorname{RecordLayout}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \mathsf{offsets}\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TupleLayout}([T_{1},\ \ldots ,\ T_{n}])\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \mathsf{offsets}\rangle 
\end{array}
$$

**(Size-Tuple)**

$$
\begin{array}{l}
\operatorname{TupleLayout}([T_{1},\ \ldots ,\ T_{n}])\ \Downarrow \ \langle \mathsf{size},\ \_,\ \_\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}]))\ =\ \mathsf{size}
\end{array}
$$

**(Align-Tuple)**

$$
\begin{array}{l}
\operatorname{TupleLayout}([T_{1},\ \ldots ,\ T_{n}])\ \Downarrow \ \langle \_,\ \mathsf{align},\ \_\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}]))\ =\ \mathsf{align}
\end{array}
$$

**(Layout-Tuple)**

$$
\begin{array}{l}
\operatorname{TupleLayout}([T_{1},\ \ldots ,\ T_{n}])\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{layout}(\operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}]))\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

$$
\operatorname{ValueBits}(\operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}]),\ (v_{1},\ \ldots ,\ v_{n}))\ =\ \mathsf{bits}\ \Leftrightarrow \ \operatorname{TupleLayout}([T_{1},\ \ldots ,\ T_{n}])\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \ \land \ \operatorname{StructBits}([T_{1},\ \ldots ,\ T_{n}],\ [v_{1},\ \ldots ,\ v_{n}],\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{bits}
$$

**(Lower-Expr-Tuple)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerList}(\mathsf{es})\ \Downarrow \ \langle \mathsf{IR},\ \mathsf{vec}_{v}\rangle  \\
\rule{18em}{0.4pt} \\
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
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"["})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ t)\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{";"})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ e)\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{"]"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseNonPermType}(P)\ \Downarrow \ (\operatorname{Advance}(P_{2}),\ \operatorname{TypeArray}(t,\ e))
\end{array}
$$

**(Parse-Array-Segment-Elem)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseExpr}(P)\ \Downarrow \ (P_{1},\ \mathsf{value})\quad \lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{";"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseArraySegment}(P)\ \Downarrow \ (P_{1},\ \operatorname{ArrayElemSegment}(\mathsf{value}))
\end{array}
$$

**(Parse-Array-Segment-Repeat)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseExpr}(P)\ \Downarrow \ (P_{1},\ \mathsf{value})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{";"})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{count}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseArraySegment}(P)\ \Downarrow \ (P_{2},\ \operatorname{ArrayRepeatSegment}(\mathsf{value},\ \mathsf{count}))
\end{array}
$$

**(Parse-Array-Segment-List-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseArraySegmentList}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-Array-Segment-List-Single)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseArraySegment}(P)\ \Downarrow \ (P_{1},\ \mathsf{seg})\quad \lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{","}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseArraySegmentList}(P)\ \Downarrow \ (P_{1},\ [\mathsf{seg}])
\end{array}
$$

**(Parse-Array-Segment-List-Comma)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseArraySegment}(P)\ \Downarrow \ (P_{1},\ \mathsf{seg})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParseArraySegmentList}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{segs}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseArraySegmentList}(P)\ \Downarrow \ (P_{2},\ [\mathsf{seg}]\ \mathbin{++} \ \mathsf{segs})
\end{array}
$$

**(Parse-Array-Literal)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"["})\quad \Gamma \ \vdash \ \operatorname{ParseArraySegmentList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{segs})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"]"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{ArrayExpr}(\mathsf{segs}))
\end{array}
$$

**(Postfix-Index)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"["})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{idx})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"]"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{PostfixStep}(P,\ e)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{IndexAccess}(e,\ \mathsf{idx}))
\end{array}
$$

### 12.3.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{TypeArray}\ =\ \langle \mathsf{elem},\ \mathsf{size}_{\mathsf{expr}}\rangle \ \mathsf{where}\ \mathsf{elem}\ \in \ \mathsf{Type}\ \land \ \mathsf{size}_{\mathsf{expr}}\ \in \ \mathsf{Expr} \\
\mathsf{ArraySegment}\ =\ \operatorname{ArrayElemSegment}(\mathsf{value})\ \mid \ \operatorname{ArrayRepeatSegment}(\mathsf{value},\ \mathsf{count})\ \mathsf{where}\ \mathsf{value}\ \in \ \mathsf{Expr}\ \land \ \mathsf{count}\ \in \ \mathsf{Expr} \\
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
T\ =\ \operatorname{TypeArray}(T_{0},\ e)\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e)\ \Downarrow \ n\quad \Gamma \ \vdash \ T_{0}\ \mathsf{wf} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \mathsf{wf}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{SegLen}(\operatorname{ArrayElemSegment}(\_))\ =\ 1 \\
\operatorname{SegLen}(\operatorname{ArrayRepeatSegment}(\_,\ \mathsf{count}))\ =\ n\ \mathsf{where}\ \Gamma \ \vdash \ \operatorname{ConstLen}(\mathsf{count})\ \Downarrow \ n
\end{array}
$$

**(T-Array-Literal-Segments)**

$$
\begin{array}{l}
\forall \ i, \\
\ (s_{i}\ =\ \operatorname{ArrayElemSegment}(\mathsf{value}_{i})\ \Rightarrow \ \Gamma \ \vdash \ \mathsf{value}_{i}\ :\ T)\ \land  \\
\ (s_{i}\ =\ \operatorname{ArrayRepeatSegment}(\mathsf{value}_{i},\ \mathsf{count}_{i})\ \Rightarrow  \\
\quad \Gamma \ \vdash \ \mathsf{value}_{i}\ :\ T\ \land  \\
\quad \operatorname{BitcopyType}(T)\ \land  \\
\quad \Gamma \ \vdash \ \mathsf{count}_{i}\ :\ U_{i}\ \land  \\
\quad (\operatorname{IntType}(U_{i})\ \lor \ U_{i}\ =\ \operatorname{TypePrim}(\texttt{"usize"}))\ \land  \\
\quad \Gamma \ \vdash \ \operatorname{ConstLen}(\mathsf{count}_{i})\ \Downarrow \ n_{i}) \\
N\ =\ \Sigma_{i} \ \operatorname{SegLen}(s_{i}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ArrayExpr}([s_{1},\ \ldots ,\ s_{k}])\ :\ \operatorname{TypeArray}(T,\ \operatorname{Literal}(\operatorname{IntLiteral}(N)))
\end{array}
$$

**(T-Index-Array)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypeArray}(T,\ \mathsf{len})\quad \Gamma \ \vdash \ e_{2}\ :\ \operatorname{TypePrim}(\texttt{"usize"})\quad \operatorname{ConstIndex}(e_{2})\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e_{2})\ \Downarrow \ i\quad \Gamma \ \vdash \ \operatorname{ConstLen}(\mathsf{len})\ \Downarrow \ n\quad i\ <\ n\quad \operatorname{BitcopyType}(T) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\ T
\end{array}
$$

**(T-Index-Array-Dynamic)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypeArray}(T,\ \mathsf{len})\quad \Gamma \ \vdash \ e_{2}\ :\ \operatorname{TypePrim}(\texttt{"usize"})\quad \lnot \ \operatorname{ConstIndex}(e_{2})\quad \mathsf{InDynamicContext}\quad \operatorname{BitcopyType}(T) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\ T
\end{array}
$$

**(T-Index-Array-Perm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypePerm}(p,\ \operatorname{TypeArray}(T,\ \mathsf{len}))\quad \Gamma \ \vdash \ e_{2}\ :\ \operatorname{TypePrim}(\texttt{"usize"})\quad \operatorname{ConstIndex}(e_{2})\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e_{2})\ \Downarrow \ i\quad \Gamma \ \vdash \ \operatorname{ConstLen}(\mathsf{len})\ \Downarrow \ n\quad i\ <\ n\quad \operatorname{BitcopyType}(\operatorname{TypePerm}(p,\ T)) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\ \operatorname{TypePerm}(p,\ T)
\end{array}
$$

**(T-Index-Array-Perm-Dynamic)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypePerm}(p,\ \operatorname{TypeArray}(T,\ \mathsf{len}))\quad \Gamma \ \vdash \ e_{2}\ :\ \operatorname{TypePrim}(\texttt{"usize"})\quad \lnot \ \operatorname{ConstIndex}(e_{2})\quad \mathsf{InDynamicContext}\quad \operatorname{BitcopyType}(\operatorname{TypePerm}(p,\ T)) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\ \operatorname{TypePerm}(p,\ T)
\end{array}
$$

**(P-Index-Array)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\mathsf{place}\ \operatorname{TypeArray}(T,\ \mathsf{len})\quad \Gamma \ \vdash \ e_{2}\ :\ \operatorname{TypePrim}(\texttt{"usize"})\quad \operatorname{ConstIndex}(e_{2})\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e_{2})\ \Downarrow \ i\quad \Gamma \ \vdash \ \operatorname{ConstLen}(\mathsf{len})\ \Downarrow \ n\quad i\ <\ n \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\mathsf{place}\ T
\end{array}
$$

**(P-Index-Array-Perm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\mathsf{place}\ \operatorname{TypePerm}(p,\ \operatorname{TypeArray}(T,\ \mathsf{len}))\quad \Gamma \ \vdash \ e_{2}\ :\ \operatorname{TypePrim}(\texttt{"usize"})\quad \operatorname{ConstIndex}(e_{2})\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e_{2})\ \Downarrow \ i\quad \Gamma \ \vdash \ \operatorname{ConstLen}(\mathsf{len})\ \Downarrow \ n\quad i\ <\ n \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\mathsf{place}\ \operatorname{TypePerm}(p,\ T)
\end{array}
$$

**(P-Index-Array-Dynamic)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\mathsf{place}\ \operatorname{TypeArray}(T,\ \mathsf{len})\quad \Gamma \ \vdash \ e_{2}\ :\ \operatorname{TypePrim}(\texttt{"usize"})\quad \lnot \ \operatorname{ConstIndex}(e_{2})\quad \mathsf{InDynamicContext} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\mathsf{place}\ T
\end{array}
$$

**(P-Index-Array-Perm-Dynamic)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\mathsf{place}\ \operatorname{TypePerm}(p,\ \operatorname{TypeArray}(T,\ \mathsf{len}))\quad \Gamma \ \vdash \ e_{2}\ :\ \operatorname{TypePrim}(\texttt{"usize"})\quad \lnot \ \operatorname{ConstIndex}(e_{2})\quad \mathsf{InDynamicContext} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\mathsf{place}\ \operatorname{TypePerm}(p,\ T)
\end{array}
$$

**(Index-Array-NonConst-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypeArray}(T,\ \_)\quad \Gamma \ \vdash \ e_{2}\ :\ \operatorname{TypePrim}(\texttt{"usize"})\quad \lnot \ \operatorname{ConstIndex}(e_{2})\quad \lnot \ \mathsf{InDynamicContext}\quad c\ =\ \operatorname{Code}(\mathsf{Index}-\mathsf{Array}-\mathsf{NonConst}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ \Uparrow \ c
\end{array}
$$

**(Index-Array-OOB-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypeArray}(T,\ \mathsf{len})\quad \operatorname{ConstIndex}(e_{2})\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e_{2})\ \Downarrow \ i\quad \Gamma \ \vdash \ \operatorname{ConstLen}(\mathsf{len})\ \Downarrow \ n\quad i\ \ge \ n\quad c\ =\ \operatorname{Code}(\mathsf{Index}-\mathsf{Array}-\mathsf{OOB}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ \Uparrow \ c
\end{array}
$$

**(Index-Array-NonUsize)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypeArray}(T,\ \_)\quad \Gamma \ \vdash \ e_{2}\ :\ T_{i}\quad T_{i}\ \ne \ \operatorname{TypePrim}(\texttt{"usize"})\quad c\ =\ \operatorname{Code}(\mathsf{Index}-\mathsf{Array}-\mathsf{NonUsize}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ \Uparrow \ c
\end{array}
$$

### 12.3.5 Dynamic Semantics

$$
\operatorname{ValueType}([v_{1},\ \ldots ,\ v_{n}])\ =\ \operatorname{TypeArray}(T,\ \operatorname{Literal}(\operatorname{IntLiteral}(n)))\ \Leftrightarrow \ \forall \ i.\ \operatorname{ValueType}(v_{i})\ =\ T
$$

$$
\begin{array}{l}
\operatorname{Len}([v_{0},\ \ldots ,\ v\_\{n-1\}])\ =\ n \\
\operatorname{IndexNum}(v)\ =\ i\ \Leftrightarrow \ v\ =\ \operatorname{IntVal}(\texttt{"usize"},\ i) \\
\operatorname{IndexValue}([v_{0},\ \ldots ,\ v\_\{n-1\}],\ i)\ =\ v_{i}\quad (0\ \le \ i\ <\ n) \\
\operatorname{IndexValue}(v,\ v_{i})\ =\ v_{e}\ \Leftrightarrow \ \operatorname{IndexNum}(v_{i})\ =\ i\ \land \ \operatorname{IndexValue}(v,\ i)\ =\ v_{e}
\end{array}
$$

**(EvalSigma-Array)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalListSigma}(\mathsf{es},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{v}),\ \sigma_{1} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{ArrayExpr}(\mathsf{es}),\ \sigma )\ \Downarrow \ (\operatorname{Val}([v_{1},\ \ldots ,\ v_{n}]),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Array-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalListSigma}(\mathsf{es},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{ArrayExpr}(\mathsf{es}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Index)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{base},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{b}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{idx},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(v_{i}),\ \sigma_{2} )\quad \operatorname{IndexValue}(v_{b},\ v_{i})\ =\ v_{e} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{IndexAccess}(\mathsf{base},\ \mathsf{idx}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{e}),\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Index-OOB)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{base},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{b}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{idx},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(v_{i}),\ \sigma_{2} )\quad \operatorname{IndexNum}(v_{i})\ =\ i\quad \lnot \ (0\ \le \ i\ <\ \operatorname{Len}(v_{b})) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{IndexAccess}(\mathsf{base},\ \mathsf{idx}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma_{2} )
\end{array}
$$

### 12.3.6 Lowering

**(Size-Array)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ConstLen}(e)\ \Downarrow \ n\quad \Gamma \ \vdash \ \operatorname{sizeof}(T_{0})\ =\ s \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeArray}(T_{0},\ e))\ =\ n\ \times \ s
\end{array}
$$

**(Align-Array)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{alignof}(T_{0})\ =\ a \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeArray}(T_{0},\ e))\ =\ a
\end{array}
$$

**(Layout-Array)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeArray}(T_{0},\ e))\ =\ \mathsf{size}\quad \Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeArray}(T_{0},\ e))\ =\ \mathsf{align} \\
\rule{18em}{0.4pt} \\
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
\Gamma \ \vdash \ \operatorname{LowerArraySegments}(\mathsf{segs})\ \Downarrow \ \langle \mathsf{IR},\ \mathsf{vec}_{v}\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{ArrayExpr}(\mathsf{segs}))\ \Downarrow \ \langle \mathsf{IR},\ [v_{1},\ \ldots ,\ v_{n}]\rangle 
\end{array}
$$

### 12.3.7 Diagnostics

Diagnostics are defined for non-constant array indexing outside `[[dynamic]]` scope, out-of-bounds constant indices, and non-`usize` array indices. Runtime out-of-bounds behavior for dynamic indices is defined by the panic behavior of `EvalSigma-Index-OOB`.

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
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"["})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ t)\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"]"}) \\
\rule{18em}{0.4pt} \\
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

**(WF-Slice)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeSlice}(T_{0})\quad \Gamma \ \vdash \ T_{0}\ \mathsf{wf} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \mathsf{wf}
\end{array}
$$

**(T-Index-Slice)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypeSlice}(T)\quad \Gamma \ \vdash \ e_{2}\ :\ \operatorname{TypePrim}(\texttt{"usize"})\quad \operatorname{BitcopyType}(T) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\ T
\end{array}
$$

**(T-Index-Slice-Perm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypePerm}(p,\ \operatorname{TypeSlice}(T))\quad \Gamma \ \vdash \ e_{2}\ :\ \operatorname{TypePrim}(\texttt{"usize"})\quad \operatorname{BitcopyType}(\operatorname{TypePerm}(p,\ T)) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\ \operatorname{TypePerm}(p,\ T)
\end{array}
$$

**(T-Slice-From-Array)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypeArray}(T,\ n)\quad \Gamma ;\ R;\ L\ \vdash \ e_{2}\ :\ \mathsf{Range}\quad \operatorname{RangeIndexType}(\operatorname{ExprType}(e_{2}))\quad \operatorname{BitcopyType}(\operatorname{TypeSlice}(T)) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\ \operatorname{TypeSlice}(T)
\end{array}
$$

**(T-Slice-From-Array-Perm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypePerm}(p,\ \operatorname{TypeArray}(T,\ n))\quad \Gamma ;\ R;\ L\ \vdash \ e_{2}\ :\ \mathsf{Range}\quad \operatorname{RangeIndexType}(\operatorname{ExprType}(e_{2}))\quad \operatorname{BitcopyType}(\operatorname{TypePerm}(p,\ \operatorname{TypeSlice}(T))) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\ \operatorname{TypePerm}(p,\ \operatorname{TypeSlice}(T))
\end{array}
$$

**(T-Slice-From-Slice)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypeSlice}(T)\quad \Gamma ;\ R;\ L\ \vdash \ e_{2}\ :\ \mathsf{Range}\quad \operatorname{RangeIndexType}(\operatorname{ExprType}(e_{2}))\quad \operatorname{BitcopyType}(\operatorname{TypeSlice}(T)) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\ \operatorname{TypeSlice}(T)
\end{array}
$$

**(T-Slice-From-Slice-Perm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypePerm}(p,\ \operatorname{TypeSlice}(T))\quad \Gamma ;\ R;\ L\ \vdash \ e_{2}\ :\ \mathsf{Range}\quad \operatorname{RangeIndexType}(\operatorname{ExprType}(e_{2}))\quad \operatorname{BitcopyType}(\operatorname{TypePerm}(p,\ \operatorname{TypeSlice}(T))) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\ \operatorname{TypePerm}(p,\ \operatorname{TypeSlice}(T))
\end{array}
$$

**(P-Index-Slice)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\mathsf{place}\ \operatorname{TypeSlice}(T)\quad \Gamma \ \vdash \ e_{2}\ :\ \operatorname{TypePrim}(\texttt{"usize"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\mathsf{place}\ T
\end{array}
$$

**(P-Index-Slice-Perm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\mathsf{place}\ \operatorname{TypePerm}(p,\ \operatorname{TypeSlice}(T))\quad \Gamma \ \vdash \ e_{2}\ :\ \operatorname{TypePrim}(\texttt{"usize"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\mathsf{place}\ \operatorname{TypePerm}(p,\ T)
\end{array}
$$

**(P-Slice-From-Array)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\mathsf{place}\ \operatorname{TypeArray}(T,\ n)\quad \Gamma ;\ R;\ L\ \vdash \ e_{2}\ :\ \mathsf{Range}\quad \operatorname{RangeIndexType}(\operatorname{ExprType}(e_{2})) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\mathsf{place}\ \operatorname{TypeSlice}(T)
\end{array}
$$

**(P-Slice-From-Array-Perm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\mathsf{place}\ \operatorname{TypePerm}(p,\ \operatorname{TypeArray}(T,\ n))\quad \Gamma ;\ R;\ L\ \vdash \ e_{2}\ :\ \mathsf{Range}\quad \operatorname{RangeIndexType}(\operatorname{ExprType}(e_{2})) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\mathsf{place}\ \operatorname{TypePerm}(p,\ \operatorname{TypeSlice}(T))
\end{array}
$$

**(P-Slice-From-Slice)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\mathsf{place}\ \operatorname{TypeSlice}(T)\quad \Gamma ;\ R;\ L\ \vdash \ e_{2}\ :\ \mathsf{Range}\quad \operatorname{RangeIndexType}(\operatorname{ExprType}(e_{2})) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\mathsf{place}\ \operatorname{TypeSlice}(T)
\end{array}
$$

**(P-Slice-From-Slice-Perm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\mathsf{place}\ \operatorname{TypePerm}(p,\ \operatorname{TypeSlice}(T))\quad \Gamma ;\ R;\ L\ \vdash \ e_{2}\ :\ \mathsf{Range}\quad \operatorname{RangeIndexType}(\operatorname{ExprType}(e_{2})) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\mathsf{place}\ \operatorname{TypePerm}(p,\ \operatorname{TypeSlice}(T))
\end{array}
$$

**(Coerce-Array-Slice)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ :\ \operatorname{TypePerm}(p,\ \operatorname{TypeArray}(T,\ n)) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ e\ :\ \operatorname{TypePerm}(p,\ \operatorname{TypeSlice}(T))
\end{array}
$$

**(Index-NonIndexable)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ T\quad \operatorname{StripPerm}(T)\ \notin \ \{\operatorname{TypeArray}(\_,\ \_),\ \operatorname{TypeSlice}(\_)\}\quad c\ =\ \operatorname{Code}(\mathsf{Index}-\mathsf{NonIndexable}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ \Uparrow \ c
\end{array}
$$

### 12.4.5 Dynamic Semantics

$$
\operatorname{ValueType}(\operatorname{SliceValue}(v,\ r))\ =\ \operatorname{TypeSlice}(T)\ \Leftrightarrow \ \operatorname{ValueType}(v)\ =\ \operatorname{TypeArray}(T,\ \_)\ \lor \ \operatorname{ValueType}(v)\ =\ \operatorname{TypeSlice}(T)
$$

$$
\begin{array}{l}
\operatorname{Len}(\operatorname{SliceValue}(v,\ r))\ =\ \mathsf{end}\ -\ \mathsf{start}\quad (\operatorname{SliceBounds}(r,\ \operatorname{Len}(v))\ =\ (\mathsf{start},\ \mathsf{end})) \\
\operatorname{IndexValue}(\operatorname{SliceValue}(v,\ r),\ i)\ =\ \operatorname{IndexValue}(v,\ \mathsf{start}\ +\ i)\quad (\operatorname{SliceBounds}(r,\ \operatorname{Len}(v))\ =\ (\mathsf{start},\ \mathsf{end})\ \land \ 0\ \le \ i\ <\ \mathsf{end}\ -\ \mathsf{start})
\end{array}
$$

**(EvalSigma-Index-Range)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{base},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{b}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{idx},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(v_{r}),\ \sigma_{2} )\quad \operatorname{SliceValue}(v_{b},\ v_{r})\ =\ v_{s} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{IndexAccess}(\mathsf{base},\ \mathsf{idx}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{s}),\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Index-Range-OOB)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{base},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{b}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{idx},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(v_{r}),\ \sigma_{2} )\quad \operatorname{SliceBounds}(v_{r},\ \operatorname{Len}(v_{b}))\ =\ \bot  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{IndexAccess}(\mathsf{base},\ \mathsf{idx}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma_{2} )
\end{array}
$$

### 12.4.6 Lowering

**(Size-Slice)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ 2\ \times \ \mathsf{PtrSize}
\end{array}
$$

**(Align-Slice)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{PtrAlign}
\end{array}
$$

**(Layout-Slice)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
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
\Gamma \ \vdash \ e_{1}\ :\ T_{b}\quad \operatorname{StripPerm}(T_{b})\ =\ \operatorname{TypeSlice}(T)\quad \Gamma \ \vdash \ e_{2}\ :\ T_{i}\quad T_{i}\ \ne \ \operatorname{TypePrim}(\texttt{"usize"})\quad c\ =\ \operatorname{Code}(\mathsf{Index}-\mathsf{Slice}-\mathsf{NonUsize}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ \Uparrow \ c
\end{array}
$$

Direct slice indexing follows the same scalar-indexing model as array indexing. Diagnostics are defined for non-`usize` slice indices and non-indexable bases. Runtime slice-bounds failures panic through `EvalSigma-Index-OOB` for scalar indexing and `EvalSigma-Index-Range-OOB` for slicing.

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
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{".."})\quad \Gamma \ \vdash \ \operatorname{ParseAdd}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseRange}(P)\ \Downarrow \ (P_{1},\ \operatorname{Range}(\texttt{To},\ \bot ,\ e))
\end{array}
$$

**(Parse-Range-ToInc)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"..="})\quad \Gamma \ \vdash \ \operatorname{ParseAdd}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseRange}(P)\ \Downarrow \ (P_{1},\ \operatorname{Range}(\texttt{ToInclusive},\ \bot ,\ e))
\end{array}
$$

**(Parse-Range-Full)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{".."})\quad \operatorname{Tok}(\operatorname{Advance}(P))\ \in \ \mathsf{RangeStop} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseRange}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \operatorname{Range}(\texttt{Full},\ \bot ,\ \bot ))
\end{array}
$$

**(Parse-Range-Lhs)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAdd}(P)\ \Downarrow \ (P_{1},\ e_{0})\quad \Gamma \ \vdash \ \operatorname{ParseRangeTail}(P_{1},\ e_{0})\ \Downarrow \ (P_{2},\ e) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseRange}(P)\ \Downarrow \ (P_{2},\ e)
\end{array}
$$

**(Parse-RangeTail-None)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ \notin \ \{\operatorname{Operator}(\texttt{".."}),\ \operatorname{Operator}(\texttt{"..="})\} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseRangeTail}(P,\ e_{0})\ \Downarrow \ (P,\ e_{0})
\end{array}
$$

**(Parse-RangeTail-From)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{".."})\quad \operatorname{Tok}(\operatorname{Advance}(P))\ \in \ \mathsf{RangeStop} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseRangeTail}(P,\ e_{0})\ \Downarrow \ (\operatorname{Advance}(P),\ \operatorname{Range}(\texttt{From},\ e_{0},\ \bot ))
\end{array}
$$

**(Parse-RangeTail-Exclusive)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{".."})\quad \Gamma \ \vdash \ \operatorname{ParseAdd}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e_{1}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseRangeTail}(P,\ e_{0})\ \Downarrow \ (P_{1},\ \operatorname{Range}(\texttt{Exclusive},\ e_{0},\ e_{1}))
\end{array}
$$

**(Parse-RangeTail-Inclusive)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"..="})\quad \Gamma \ \vdash \ \operatorname{ParseAdd}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e_{1}) \\
\rule{18em}{0.4pt} \\
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
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Range}(\texttt{Full},\ \bot ,\ \bot )\ :\ \mathsf{Range}\ \Rightarrow \ \operatorname{ExprType}(\operatorname{Range}(\texttt{Full},\ \bot ,\ \bot ))\ =\ \mathsf{TypeRangeFull} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Range}(\texttt{To},\ \bot ,\ e)\ :\ \mathsf{Range}\ \Rightarrow \ \operatorname{ExprType}(\operatorname{Range}(\texttt{To},\ \bot ,\ e))\ =\ \operatorname{TypeRangeTo}(\operatorname{ExprType}(e)) \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Range}(\texttt{ToInclusive},\ \bot ,\ e)\ :\ \mathsf{Range}\ \Rightarrow \ \operatorname{ExprType}(\operatorname{Range}(\texttt{ToInclusive},\ \bot ,\ e))\ =\ \operatorname{TypeRangeToInclusive}(\operatorname{ExprType}(e)) \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Range}(\texttt{From},\ e,\ \bot )\ :\ \mathsf{Range}\ \Rightarrow \ \operatorname{ExprType}(\operatorname{Range}(\texttt{From},\ e,\ \bot ))\ =\ \operatorname{TypeRangeFrom}(\operatorname{ExprType}(e)) \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Range}(\texttt{Exclusive},\ e_{1},\ e_{2})\ :\ \mathsf{Range}\ \Rightarrow \ \operatorname{ExprType}(\operatorname{Range}(\texttt{Exclusive},\ e_{1},\ e_{2}))\ =\ \operatorname{TypeRange}(\operatorname{ExprType}(e_{1})) \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Range}(\texttt{Inclusive},\ e_{1},\ e_{2})\ :\ \mathsf{Range}\ \Rightarrow \ \operatorname{ExprType}(\operatorname{Range}(\texttt{Inclusive},\ e_{1},\ e_{2}))\ =\ \operatorname{TypeRangeInclusive}(\operatorname{ExprType}(e_{1}))
\end{array}
$$

**(T-Range-Lift)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ r\ :\ \mathsf{Range}\quad \operatorname{ExprType}(r)\ =\ T \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ r\ :\ T
\end{array}
$$

**(Range-Full)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Range}(\texttt{Full},\ \bot ,\ \bot )\ :\ \mathsf{Range}
\end{array}
$$

**(Range-To)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Range}(\texttt{To},\ \bot ,\ e)\ :\ \mathsf{Range}
\end{array}
$$

**(Range-ToInclusive)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Range}(\texttt{ToInclusive},\ \bot ,\ e)\ :\ \mathsf{Range}
\end{array}
$$

**(Range-From)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Range}(\texttt{From},\ e,\ \bot )\ :\ \mathsf{Range}
\end{array}
$$

**(Range-Exclusive)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e_{1}\ :\ T\quad \Gamma ;\ R;\ L\ \vdash \ e_{2}\ :\ T \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Range}(\texttt{Exclusive},\ e_{1},\ e_{2})\ :\ \mathsf{Range}
\end{array}
$$

**(Range-Inclusive)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e_{1}\ :\ T\quad \Gamma ;\ R;\ L\ \vdash \ e_{2}\ :\ T \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Range}(\texttt{Inclusive},\ e_{1},\ e_{2})\ :\ \mathsf{Range}
\end{array}
$$

Range-pattern semantics are defined by §17.4.

### 12.5.5 Dynamic Semantics

$$
\begin{array}{l}
\operatorname{ValueType}(\operatorname{RangeVal}(\texttt{Exclusive},\ \mathsf{lo},\ \mathsf{hi}))\ =\ \operatorname{TypeRange}(T)\ \Leftrightarrow \ \operatorname{ValueType}(\mathsf{lo})\ =\ T\ \land \ \operatorname{ValueType}(\mathsf{hi})\ =\ T \\
\operatorname{ValueType}(\operatorname{RangeVal}(\texttt{Inclusive},\ \mathsf{lo},\ \mathsf{hi}))\ =\ \operatorname{TypeRangeInclusive}(T)\ \Leftrightarrow \ \operatorname{ValueType}(\mathsf{lo})\ =\ T\ \land \ \operatorname{ValueType}(\mathsf{hi})\ =\ T \\
\operatorname{ValueType}(\operatorname{RangeVal}(\texttt{From},\ \mathsf{lo},\ \bot ))\ =\ \operatorname{TypeRangeFrom}(T)\ \Leftrightarrow \ \operatorname{ValueType}(\mathsf{lo})\ =\ T \\
\operatorname{ValueType}(\operatorname{RangeVal}(\texttt{To},\ \bot ,\ \mathsf{hi}))\ =\ \operatorname{TypeRangeTo}(T)\ \Leftrightarrow \ \operatorname{ValueType}(\mathsf{hi})\ =\ T \\
\operatorname{ValueType}(\operatorname{RangeVal}(\texttt{ToInclusive},\ \bot ,\ \mathsf{hi}))\ =\ \operatorname{TypeRangeToInclusive}(T)\ \Leftrightarrow \ \operatorname{ValueType}(\mathsf{hi})\ =\ T \\
\operatorname{ValueType}(\operatorname{RangeVal}(\texttt{Full},\ \bot ,\ \bot ))\ =\ \mathsf{TypeRangeFull}
\end{array}
$$

**(EvalSigma-Range)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalOptSigma}(\mathsf{lo}_{\mathsf{opt}},\ \sigma_{0} )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{lo}}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalOptSigma}(\mathsf{hi}_{\mathsf{opt}},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{hi}}),\ \sigma_{2} )\quad r\ =\ \operatorname{RangeVal}(\mathsf{kind},\ v_{\mathsf{lo}},\ v_{\mathsf{hi}}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Range}(\mathsf{kind},\ \mathsf{lo}_{\mathsf{opt}},\ \mathsf{hi}_{\mathsf{opt}}),\ \sigma_{0} )\ \Downarrow \ (\operatorname{Val}(r),\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Range-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalOptSigma}(\mathsf{lo}_{\mathsf{opt}},\ \sigma_{0} )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Range}(\mathsf{kind},\ \mathsf{lo}_{\mathsf{opt}},\ \mathsf{hi}_{\mathsf{opt}}),\ \sigma_{0} )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Range-Ctrl-Hi)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalOptSigma}(\mathsf{lo}_{\mathsf{opt}},\ \sigma_{0} )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{lo}}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalOptSigma}(\mathsf{hi}_{\mathsf{opt}},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Range}(\mathsf{kind},\ \mathsf{lo}_{\mathsf{opt}},\ \mathsf{hi}_{\mathsf{opt}}),\ \sigma_{0} )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} )
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Inc}(v)\ =\ v'\ \Leftrightarrow \ v\ =\ \operatorname{IntVal}(t,\ x)\ \land \ x'\ =\ x\ +\ 1\ \land \ \operatorname{InRange}(x',\ t)\ \land \ v'\ =\ \operatorname{IntVal}(t,\ x') \\
\operatorname{SliceBoundsRaw}(\operatorname{RangeVal}(\texttt{Exclusive},\ s,\ e),\ L)\ =\ (\mathsf{start},\ \mathsf{end})\ \Leftrightarrow \ \operatorname{IndexNum}(s)\ =\ \mathsf{start}\ \land \ \operatorname{IndexNum}(e)\ =\ \mathsf{end} \\
\operatorname{SliceBoundsRaw}(\operatorname{RangeVal}(\texttt{Inclusive},\ s,\ e),\ L)\ =\ (\mathsf{start},\ \mathsf{end})\ \Leftrightarrow \ \operatorname{IndexNum}(s)\ =\ \mathsf{start}\ \land \ \operatorname{Inc}(e)\ =\ e'\ \land \ \operatorname{IndexNum}(e')\ =\ \mathsf{end} \\
\operatorname{SliceBoundsRaw}(\operatorname{RangeVal}(\texttt{From},\ s,\ \bot ),\ L)\ =\ (\mathsf{start},\ L)\ \Leftrightarrow \ \operatorname{IndexNum}(s)\ =\ \mathsf{start} \\
\operatorname{SliceBoundsRaw}(\operatorname{RangeVal}(\texttt{To},\ \bot ,\ e),\ L)\ =\ (0,\ \mathsf{end})\ \Leftrightarrow \ \operatorname{IndexNum}(e)\ =\ \mathsf{end} \\
\operatorname{SliceBoundsRaw}(\operatorname{RangeVal}(\texttt{ToInclusive},\ \bot ,\ e),\ L)\ =\ (0,\ \mathsf{end})\ \Leftrightarrow \ \operatorname{Inc}(e)\ =\ e'\ \land \ \operatorname{IndexNum}(e')\ =\ \mathsf{end} \\
\operatorname{SliceBoundsRaw}(\operatorname{RangeVal}(\texttt{Full},\ \bot ,\ \bot ),\ L)\ =\ (0,\ L) \\
\operatorname{SliceBounds}(r,\ L)\ =\ (\mathsf{start},\ \mathsf{end})\ \Leftrightarrow \ \operatorname{SliceBoundsRaw}(r,\ L)\ =\ (\mathsf{start},\ \mathsf{end})\ \land \ 0\ \le \ \mathsf{start}\ \le \ \mathsf{end}\ \le \ L \\
\operatorname{SliceBounds}(r,\ L)\ =\ \bot \ \Leftrightarrow \ \operatorname{SliceBoundsRaw}(r,\ L)\ =\ \bot \ \lor \ (\exists \ \mathsf{start},\ \mathsf{end}.\ \operatorname{SliceBoundsRaw}(r,\ L)\ =\ (\mathsf{start},\ \mathsf{end})\ \land \ \lnot \ (0\ \le \ \mathsf{start}\ \le \ \mathsf{end}\ \le \ L))
\end{array}
$$

### 12.5.6 Lowering

$$
\mathsf{ChecksJudg}\ =\ \{\mathsf{LowerRangeExpr},\ \mathsf{CheckIndex},\ \mathsf{CheckRange},\ \mathsf{LowerTransmute},\ \mathsf{LowerRawDeref}\}
$$

$$
\begin{array}{l}
\operatorname{ValueBits}(\operatorname{TypeRange}(T),\ r)\ =\ \mathsf{bits}\ \Leftrightarrow \ r\ =\ \operatorname{RangeVal}(\texttt{Exclusive},\ v_{\mathsf{lo}},\ v_{\mathsf{hi}})\ \land \ \operatorname{TupleLayout}([T,\ T])\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \ \land \ \operatorname{StructBits}([T,\ T],\ [v_{\mathsf{lo}},\ v_{\mathsf{hi}}],\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{bits} \\
\operatorname{ValueBits}(\operatorname{TypeRangeInclusive}(T),\ r)\ =\ \mathsf{bits}\ \Leftrightarrow \ r\ =\ \operatorname{RangeVal}(\texttt{Inclusive},\ v_{\mathsf{lo}},\ v_{\mathsf{hi}})\ \land \ \operatorname{TupleLayout}([T,\ T])\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \ \land \ \operatorname{StructBits}([T,\ T],\ [v_{\mathsf{lo}},\ v_{\mathsf{hi}}],\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{bits} \\
\operatorname{ValueBits}(\operatorname{TypeRangeFrom}(T),\ r)\ =\ \mathsf{bits}\ \Leftrightarrow \ r\ =\ \operatorname{RangeVal}(\texttt{From},\ v_{\mathsf{lo}},\ \bot )\ \land \ \operatorname{TupleLayout}([T])\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \ \land \ \operatorname{StructBits}([T],\ [v_{\mathsf{lo}}],\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{bits} \\
\operatorname{ValueBits}(\operatorname{TypeRangeTo}(T),\ r)\ =\ \mathsf{bits}\ \Leftrightarrow \ r\ =\ \operatorname{RangeVal}(\texttt{To},\ \bot ,\ v_{\mathsf{hi}})\ \land \ \operatorname{TupleLayout}([T])\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \ \land \ \operatorname{StructBits}([T],\ [v_{\mathsf{hi}}],\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{bits} \\
\operatorname{ValueBits}(\operatorname{TypeRangeToInclusive}(T),\ r)\ =\ \mathsf{bits}\ \Leftrightarrow \ r\ =\ \operatorname{RangeVal}(\texttt{ToInclusive},\ \bot ,\ v_{\mathsf{hi}})\ \land \ \operatorname{TupleLayout}([T])\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \ \land \ \operatorname{StructBits}([T],\ [v_{\mathsf{hi}}],\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{bits} \\
\operatorname{ValueBits}(\mathsf{TypeRangeFull},\ r)\ =\ \mathsf{bits}\ \Leftrightarrow \ r\ =\ \operatorname{RangeVal}(\texttt{Full},\ \bot ,\ \bot )\ \land \ \mathsf{bits}\ =\ []
\end{array}
$$

**(Lower-Range-Full)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerRangeExpr}(\operatorname{Range}(\texttt{Full},\ \bot ,\ \bot ))\ \Downarrow \ \langle \varepsilon ,\ \operatorname{RangeVal}(\texttt{Full},\ \bot ,\ \bot )\rangle 
\end{array}
$$

**(Lower-Range-To)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerRangeExpr}(\operatorname{Range}(\texttt{To},\ \bot ,\ e))\ \Downarrow \ \langle \mathsf{IR}_{e},\ \operatorname{RangeVal}(\texttt{To},\ \bot ,\ v)\rangle 
\end{array}
$$

**(Lower-Range-ToInclusive)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerRangeExpr}(\operatorname{Range}(\texttt{ToInclusive},\ \bot ,\ e))\ \Downarrow \ \langle \mathsf{IR}_{e},\ \operatorname{RangeVal}(\texttt{ToInclusive},\ \bot ,\ v)\rangle 
\end{array}
$$

**(Lower-Range-From)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerRangeExpr}(\operatorname{Range}(\texttt{From},\ e,\ \bot ))\ \Downarrow \ \langle \mathsf{IR}_{e},\ \operatorname{RangeVal}(\texttt{From},\ v,\ \bot )\rangle 
\end{array}
$$

**(Lower-Range-Inclusive)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e_{1})\ \Downarrow \ \langle \mathsf{IR}_{1},\ v_{1}\rangle \quad \Gamma \ \vdash \ \operatorname{LowerExpr}(e_{2})\ \Downarrow \ \langle \mathsf{IR}_{2},\ v_{2}\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerRangeExpr}(\operatorname{Range}(\texttt{Inclusive},\ e_{1},\ e_{2}))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{1},\ \mathsf{IR}_{2}),\ \operatorname{RangeVal}(\texttt{Inclusive},\ v_{1},\ v_{2})\rangle 
\end{array}
$$

**(Lower-Range-Exclusive)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e_{1})\ \Downarrow \ \langle \mathsf{IR}_{1},\ v_{1}\rangle \quad \Gamma \ \vdash \ \operatorname{LowerExpr}(e_{2})\ \Downarrow \ \langle \mathsf{IR}_{2},\ v_{2}\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerRangeExpr}(\operatorname{Range}(\texttt{Exclusive},\ e_{1},\ e_{2}))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{1},\ \mathsf{IR}_{2}),\ \operatorname{RangeVal}(\texttt{Exclusive},\ v_{1},\ v_{2})\rangle 
\end{array}
$$

**(Size-Range)**

$$
\begin{array}{l}
\operatorname{TupleLayout}([T,\ T])\ \Downarrow \ \langle \mathsf{size},\ \_,\ \_\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeRange}(T))\ =\ \mathsf{size}
\end{array}
$$

**(Align-Range)**

$$
\begin{array}{l}
\operatorname{TupleLayout}([T,\ T])\ \Downarrow \ \langle \_,\ \mathsf{align},\ \_\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeRange}(T))\ =\ \mathsf{align}
\end{array}
$$

**(Layout-Range)**

$$
\begin{array}{l}
\operatorname{TupleLayout}([T,\ T])\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{layout}(\operatorname{TypeRange}(T))\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

**(Size-RangeInclusive)**

$$
\begin{array}{l}
\operatorname{TupleLayout}([T,\ T])\ \Downarrow \ \langle \mathsf{size},\ \_,\ \_\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeRangeInclusive}(T))\ =\ \mathsf{size}
\end{array}
$$

**(Align-RangeInclusive)**

$$
\begin{array}{l}
\operatorname{TupleLayout}([T,\ T])\ \Downarrow \ \langle \_,\ \mathsf{align},\ \_\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeRangeInclusive}(T))\ =\ \mathsf{align}
\end{array}
$$

**(Layout-RangeInclusive)**

$$
\begin{array}{l}
\operatorname{TupleLayout}([T,\ T])\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{layout}(\operatorname{TypeRangeInclusive}(T))\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

**(Size-RangeFrom)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ \mathsf{size} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeRangeFrom}(T))\ =\ \mathsf{size}
\end{array}
$$

**(Align-RangeFrom)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{align} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeRangeFrom}(T))\ =\ \mathsf{align}
\end{array}
$$

**(Layout-RangeFrom)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeRangeFrom}(T))\ =\ \mathsf{size}\quad \Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeRangeFrom}(T))\ =\ \mathsf{align} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{layout}(\operatorname{TypeRangeFrom}(T))\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

**(Size-RangeTo)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ \mathsf{size} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeRangeTo}(T))\ =\ \mathsf{size}
\end{array}
$$

**(Align-RangeTo)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{align} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeRangeTo}(T))\ =\ \mathsf{align}
\end{array}
$$

**(Layout-RangeTo)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeRangeTo}(T))\ =\ \mathsf{size}\quad \Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeRangeTo}(T))\ =\ \mathsf{align} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{layout}(\operatorname{TypeRangeTo}(T))\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

**(Size-RangeToInclusive)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ \mathsf{size} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeRangeToInclusive}(T))\ =\ \mathsf{size}
\end{array}
$$

**(Align-RangeToInclusive)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{align} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeRangeToInclusive}(T))\ =\ \mathsf{align}
\end{array}
$$

**(Layout-RangeToInclusive)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeRangeToInclusive}(T))\ =\ \mathsf{size}\quad \Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeRangeToInclusive}(T))\ =\ \mathsf{align} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{layout}(\operatorname{TypeRangeToInclusive}(T))\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

**(Size-RangeFull)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{sizeof}(\mathsf{TypeRangeFull})\ =\ 0
\end{array}
$$

**(Align-RangeFull)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{alignof}(\mathsf{TypeRangeFull})\ =\ 1
\end{array}
$$

**(Layout-RangeFull)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{layout}(\mathsf{TypeRangeFull})\ \Downarrow \ \langle 0,\ 1\rangle 
\end{array}
$$

### 12.5.7 Diagnostics

Diagnostics are defined for non-constant and empty range patterns in §17.4. Slice-bounds failures induced by ranges panic at runtime when `SliceBounds` is undefined.

## 12.6 Records

### 12.6.1 Syntax

```text
record_decl     ::= attribute_list? visibility? "record" identifier generic_params? implements_clause? predicate_clause? record_body invariant_clause?
record_body     ::= "{" record_member* "}"
record_field    ::= attribute_list? visibility? key_boundary? identifier ":" type record_field_init_opt
record_literal  ::= identifier "{" field_init_list "}"
default_record  ::= identifier "(" ")"
```

### 12.6.2 Parsing

**(Parse-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{record})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseGenericParamsOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseImplementsOpt}(P_{3})\ \Downarrow \ (P_{4},\ \mathsf{impls})\quad \Gamma \ \vdash \ \operatorname{ParsePredicateClauseOpt}(P_{4})\ \Downarrow \ (P_{5},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseRecordBody}(P_{5})\ \Downarrow \ (P_{6},\ \mathsf{members})\quad \Gamma \ \vdash \ \operatorname{ParseInvariantOpt}(P_{6})\ \Downarrow \ (P_{7},\ \mathsf{invariant}_{\mathsf{opt}}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseItem}(P)\ \Downarrow \ (P_{7},\ \langle \mathsf{RecordDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{impls},\ \mathsf{members},\ \mathsf{invariant}_{\mathsf{opt}},\ \operatorname{SpanBetween}(P,\ P_{7}),\ []\rangle )
\end{array}
$$

**(Parse-RecordBody)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseRecordMemberList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{members})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\}"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseRecordBody}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \mathsf{members})
\end{array}
$$

**(Parse-RecordMemberList-End)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\}"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseRecordMemberList}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-RecordMemberList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseRecordMember}(P)\ \Downarrow \ (P_{1},\ m)\quad \Gamma \ \vdash \ \operatorname{ParseRecordMemberSep}(P_{1})\ \Downarrow \ P_{2}\quad \Gamma \ \vdash \ \operatorname{ParseRecordMemberList}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{ms}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseRecordMemberList}(P)\ \Downarrow \ (P_{3},\ [m]\ \mathbin{++} \ \mathsf{ms})
\end{array}
$$

**(Parse-RecordMember-Method)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{procedure})\quad \Gamma \ \vdash \ \operatorname{ParseMethodDefAfterVis}(P_{1},\ \mathsf{vis},\ \mathsf{attrs}_{\mathsf{opt}})\ \Downarrow \ (P_{2},\ m) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseRecordMember}(P)\ \Downarrow \ (P_{2},\ m)
\end{array}
$$

**(Parse-RecordMember-AssociatedType)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{type})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseAssocTypeDefaultOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{default}_{\mathsf{type}\_\mathsf{opt}}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseRecordMember}(P)\ \Downarrow \ (P_{3},\ \langle \mathsf{AssociatedTypeDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{default}_{\mathsf{type}\_\mathsf{opt}},\ \operatorname{SpanBetween}(P,\ P_{3}),\ []\rangle )
\end{array}
$$

**(Parse-RecordMember-Field)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \lnot \ \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{procedure})\ \land \ \lnot \ \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{type})\quad \Gamma \ \vdash \ \operatorname{ParseRecordFieldDeclAfterVis}(P_{1},\ \mathsf{vis},\ \mathsf{attrs}_{\mathsf{opt}})\ \Downarrow \ (P_{2},\ f) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseRecordMember}(P)\ \Downarrow \ (P_{2},\ f)
\end{array}
$$

**(Parse-RecordFieldDeclAfterVis)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseKeyBoundaryOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{boundary})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{name})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{ty})\quad \Gamma \ \vdash \ \operatorname{ParseRecordFieldInitOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{init}_{\mathsf{opt}}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseRecordFieldDeclAfterVis}(P,\ \mathsf{vis},\ \mathsf{attrs}_{\mathsf{opt}})\ \Downarrow \ (P_{3},\ \langle \mathsf{FieldDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{name},\ \mathsf{ty},\ \mathsf{init}_{\mathsf{opt}},\ \operatorname{SpanBetween}(P,\ P_{3}),\ \bot \rangle )
\end{array}
$$

**(Parse-RecordFieldInitOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"="}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseRecordFieldInitOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-RecordFieldInitOpt-Yes)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"="})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseRecordFieldInitOpt}(P)\ \Downarrow \ (P_{1},\ e)
\end{array}
$$

**(Parse-Record-Literal)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseTypePath}(P)\ \Downarrow \ (P_{1},\ \mathsf{path})\quad \mid \mathsf{path}\mid \ =\ 1\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseFieldInitList}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{fields})\quad \mathsf{fields}\ \ne \ []\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{"\}"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (\operatorname{Advance}(P_{2}),\ \operatorname{RecordExpr}(\operatorname{TypePath}(\mathsf{path}),\ \mathsf{fields}))
\end{array}
$$

### 12.6.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{RecordDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{implements},\ \mathsf{members},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}\rangle  \\
\mathsf{RecordDecl}.\mathsf{implements}\ \in \ [\mathsf{ClassPath}]
\end{array}
$$

$$
\begin{array}{l}
\mathsf{RecordMember}\ \in \ \{ \\
\ \mathsf{FieldDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{name},\ \mathsf{type},\ \mathsf{init}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}\rangle , \\
\ \mathsf{MethodDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{override},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{receiver},\ \mathsf{params},\ \mathsf{return}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}\rangle , \\
\ \mathsf{AssociatedTypeDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{default}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}\rangle  \\
\}
\end{array}
$$

$$
\mathsf{RecordExpr}\ =\ \langle \mathsf{type}_{\mathsf{ref}},\ \mathsf{fields}\rangle \ \mathsf{where}\ \mathsf{type}_{\mathsf{ref}}\ \in \ \{\operatorname{TypePath}(\mathsf{path}),\ \operatorname{ModalStateRef}(\mathsf{modal}_{\mathsf{ref}},\ \mathsf{state})\}
$$

$$
\begin{array}{l}
\operatorname{Fields}(R)\ =\ [\ f\ \mid \ f\ \in \ R.\mathsf{members}\ \land \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{name},\ \mathsf{ty},\ \mathsf{init},\ \mathsf{span},\ \mathsf{doc}.\ f\ =\ \operatorname{FieldDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{name},\ \mathsf{ty},\ \mathsf{init},\ \mathsf{span},\ \mathsf{doc})\ ] \\
\operatorname{Methods}(R)\ =\ [\ m\ \mid \ m\ \in \ R.\mathsf{members}\ \land \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{override},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}.\ m\ =\ \operatorname{MethodDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{override},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\ ]
\end{array}
$$

$$
\begin{array}{l}
\mathsf{BuiltinRecord}\ =\ \{\texttt{RegionOptions},\ \texttt{DirEntry},\ \texttt{Context},\ \texttt{System}\} \\
\operatorname{RecordPath}(R)\ =\ [R.\mathsf{name}]\quad \mathsf{if}\ R.\mathsf{name}\ \in \ \mathsf{BuiltinRecord} \\
\operatorname{RecordPath}(R)\ =\ \operatorname{FullPath}(\operatorname{ModuleOf}(R),\ R.\mathsf{name})\quad \mathsf{otherwise}
\end{array}
$$

### 12.6.4 Static Semantics

**(Bind-Record)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ItemBindings}(\operatorname{RecordDecl}(\_,\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_),\ p)\ \Downarrow \ [(\mathsf{name},\ \langle \mathsf{Type},\ p,\ \bot ,\ \mathsf{Decl}\rangle )]
\end{array}
$$

**(Resolve-RecordPath)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path}\ \mathbin{++} \ [\mathsf{name}])\ \Downarrow \ p\quad \operatorname{RecordDecl}(p)\ =\ R \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveRecordPath}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p
\end{array}
$$

**(ResolveQual-Name-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveRecordPath}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p\quad \operatorname{SplitLast}(p)\ =\ (\mathsf{mp},\ \mathsf{name}') \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveQualifiedForm}(\operatorname{QualifiedName}(\mathsf{path},\ \mathsf{name}))\ \Downarrow \ \operatorname{Path}(\mathsf{mp},\ \mathsf{name}')
\end{array}
$$

**(ResolveQual-Apply-RecordLit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveFieldInits}(\mathsf{fields})\ \Downarrow \ \mathsf{fields}'\quad \Gamma \ \vdash \ \operatorname{ResolveRecordPath}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveQualifiedForm}(\operatorname{QualifiedApply}(\mathsf{path},\ \mathsf{name},\ \operatorname{Brace}(\mathsf{fields})))\ \Downarrow \ \operatorname{RecordExpr}(\operatorname{TypePath}(p),\ \mathsf{fields}')
\end{array}
$$

**(ResolveItem-Record)**

$$
\begin{array}{l}
R\ =\ \operatorname{RecordDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{impls},\ \mathsf{members},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc})\quad S_{\mathsf{gen}}\ =\ \operatorname{TypeParamBindings}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \Gamma_{g} \ =\ [S_{\mathsf{gen}},\ S_{\mathsf{module}},\ S_{\mathsf{universe}}]\quad \Gamma_{g} \ \vdash \ \operatorname{ResolveGenericParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\ \Downarrow \ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}}'\quad \Gamma_{g} \ \vdash \ \operatorname{ResolvePredicateClauseOpt}(\mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}})\ \Downarrow \ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}'\quad \Gamma_{g} \ \vdash \ \operatorname{ResolveClassPathList}(\mathsf{impls})\ \Downarrow \ \mathsf{impls}'\quad \Gamma_{g} \ \vdash \ \operatorname{ResolveRecordMemberList}(R,\ \mathsf{members})\ \Downarrow \ \mathsf{members}'\quad \Gamma_{g} \ \vdash \ \operatorname{ResolveInvariantOpt}(\mathsf{invariant}_{\mathsf{opt}})\ \Downarrow \ \mathsf{invariant}_{\mathsf{opt}}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveItem}(R)\ \Downarrow \ \operatorname{RecordDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}}',\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}',\ \mathsf{impls}',\ \mathsf{members}',\ \mathsf{invariant}_{\mathsf{opt}}',\ \mathsf{span},\ \mathsf{doc})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{InitOk}(f)\ \Leftrightarrow \ f\ =\ \operatorname{FieldDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{name},\ T_{f},\ \mathsf{init}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc})\ \land \ (\mathsf{init}_{\mathsf{opt}}\ =\ \bot )\ \lor \ (\mathsf{init}_{\mathsf{opt}}\ =\ e\ \land \ \Gamma ;\ \bot ;\ \bot \ \vdash \ e\ :\ T\ \land \ \Gamma \ \vdash \ T\ \mathrel{<:} \ T_{f}) \\
\operatorname{VisRank}(\texttt{public})\ =\ 3\quad \operatorname{VisRank}(\texttt{internal})\ =\ 2\quad \operatorname{VisRank}(\texttt{private})\ =\ 1 \\
\operatorname{FieldVisOk}(R)\ \Leftrightarrow \ \forall \ f\ \in \ \operatorname{Fields}(R).\ \operatorname{VisRank}(f.\mathsf{vis})\ \le \ \operatorname{VisRank}(R.\mathsf{vis})
\end{array}
$$

**(WF-Record)**

$$
\begin{array}{l}
\forall \ f\ \in \ \operatorname{Fields}(R),\ \operatorname{InitOk}(f)\quad \forall \ f_{i}\ \ne \ f_{j},\ f_{i}.\mathsf{name}\ \ne \ f_{j}.\mathsf{name} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ R\ \mathsf{record}\ \mathsf{wf}
\end{array}
$$

**(WF-Record-DupField)**

$$
\begin{array}{l}
\exists \ f_{i}\ \ne \ f_{j}.\ f_{i}.\mathsf{name}\ =\ f_{j}.\mathsf{name}\quad c\ =\ \operatorname{Code}(\mathsf{WF}-\mathsf{Record}-\mathsf{DupField}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ R\ \mathsf{record}\ \mathsf{wf}\ \Uparrow \ c
\end{array}
$$

**(WF-RecordDecl)**

$$
\begin{array}{l}
R\ =\ \operatorname{RecordDecl}(\_,\ \_,\ \_,\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \_,\ \_,\ \_,\ \_,\ \_)\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \mathsf{params}_{\mathsf{gen}}\ =\ [P_{1},\ \ldots ,\ P_{n}]\quad \Gamma \ \vdash \ \langle P_{1};\ \ldots ;\ P_{n}\rangle \ \mathsf{wf}\quad \Gamma_{g} \ =\ \operatorname{BindTypeParams}(\Gamma ,\ \mathsf{params}_{\mathsf{gen}})\quad \Gamma_{g} ;\ \mathsf{params}_{\mathsf{gen}}\ \vdash \ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}\ \mathsf{wf}\quad \forall \ f\ \in \ \operatorname{Fields}(R),\ \Gamma_{g} \ \vdash \ f.\mathsf{type}\ \mathsf{wf}\quad \operatorname{FieldVisOk}(R)\quad \Gamma_{g} \ \vdash \ R\ \mathsf{record}\ \mathsf{wf}\quad \Gamma_{g} \ \vdash \ \operatorname{Methods}(R)\ :\ \mathsf{ok}\quad \Gamma_{g} \ \vdash \ \operatorname{TypePath}(\operatorname{RecordPath}(R))\ :\ \mathsf{ImplementsOk} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ R\ \mathsf{record}\ :\ \mathsf{ok}
\end{array}
$$

**(FieldVisOk-Err)**

$$
\begin{array}{l}
R\ =\ \operatorname{RecordDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\quad \lnot \ \operatorname{FieldVisOk}(R)\quad c\ =\ \operatorname{Code}(\mathsf{FieldVisOk}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ R\ \Uparrow \ c
\end{array}
$$

$$
\begin{array}{l}
\operatorname{DefaultConstructible}(R)\ \Leftrightarrow \ \forall \ f\ \in \ \operatorname{Fields}(R).\ f.\mathsf{init}_{\mathsf{opt}}\ \ne \ \bot  \\
\operatorname{RecordCallee}(\mathsf{callee})\ =\ R\ \Leftrightarrow \ (\mathsf{callee}\ =\ \operatorname{Identifier}(\mathsf{name})\ \lor \ \mathsf{callee}\ =\ \operatorname{Path}(\mathsf{path},\ \mathsf{name}))\ \land \ \Gamma \ \vdash \ \operatorname{ResolveTypeName}(\mathsf{name})\ \Downarrow \ \mathsf{ent}\ \land \ \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ \mathsf{mp}\ \land \ \mathsf{name}'\ =\ (\mathsf{ent}.\mathsf{target}_{\mathsf{opt}}\ \mathsf{if}\ \mathsf{present},\ \mathsf{else}\ \mathsf{name})\ \land \ \operatorname{RecordDecl}(\operatorname{FullPath}(\operatorname{PathOfModule}(\mathsf{mp}),\ \mathsf{name}'))\ =\ R
\end{array}
$$

**(T-Record-Default)**

$$
\begin{array}{l}
\operatorname{RecordCallee}(\mathsf{callee})\ =\ R\quad \Gamma \ \vdash \ R\ \mathsf{record}\ \mathsf{wf}\quad \operatorname{DefaultConstructible}(R) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Call}(\mathsf{callee},\ [])\ :\ \operatorname{TypePath}(\operatorname{RecordPath}(R))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{FieldNames}(R)\ =\ [\ f.\mathsf{name}\ \mid \ f\ \in \ \operatorname{Fields}(R)\ ] \\
\operatorname{FieldInitNames}(\mathsf{fields})\ =\ [\ f\ \mid \ \langle f,\ \_\rangle \ \in \ \mathsf{fields}\ ] \\
\operatorname{Set}(\mathsf{xs})\ =\ \{\ x\ \mid \ x\ \in \ \mathsf{xs}\ \} \\
\operatorname{FieldNameSet}(R)\ =\ \operatorname{Set}(\operatorname{FieldNames}(R)) \\
\operatorname{FieldInitSet}(\mathsf{fields})\ =\ \operatorname{Set}(\operatorname{FieldInitNames}(\mathsf{fields})) \\
\operatorname{FieldType}(R,\ f)\ =\ T_{f}\ \Leftrightarrow \ \exists \ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{init}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}.\ \operatorname{FieldDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{boundary},\ f,\ T_{f},\ \mathsf{init}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}})\ \in \ \operatorname{Fields}(R) \\
\operatorname{FieldVis}(R,\ f)\ =\ \mathsf{vis}\ \Leftrightarrow \ \exists \ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{boundary},\ T_{f},\ \mathsf{init}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}.\ \operatorname{FieldDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{boundary},\ f,\ T_{f},\ \mathsf{init}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}})\ \in \ \operatorname{Fields}(R) \\
\operatorname{FieldVisible}(m,\ R,\ f)\ \Leftrightarrow \ \operatorname{FieldVis}(R,\ f)\ \in \ \{\texttt{public},\ \texttt{internal}\}\ \lor \ (\operatorname{FieldVis}(R,\ f)\ =\ \texttt{private}\ \land \ \operatorname{ModuleOfPath}(\operatorname{RecordPath}(R))\ =\ m)
\end{array}
$$

**(T-Record-Literal)**

$$
\begin{array}{l}
\operatorname{RecordDecl}(p)\ =\ R\quad \operatorname{Distinct}(\operatorname{FieldInitNames}(\mathsf{fields}))\quad \operatorname{FieldInitSet}(\mathsf{fields})\ =\ \operatorname{FieldNameSet}(R)\quad \forall \ \langle f,\ e\rangle \ \in \ \mathsf{fields},\ \operatorname{FieldType}(R,\ f)\ =\ T_{f}\ \land \ \operatorname{FieldVisible}(m,\ R,\ f)\ \land \ \Gamma ;\ R;\ L\ \vdash \ e\ \Leftarrow \ T_{f}\ \dashv \ \emptyset  \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{RecordExpr}(\operatorname{TypePath}(p),\ \mathsf{fields})\ :\ \operatorname{TypePath}(p)
\end{array}
$$

### 12.6.5 Dynamic Semantics

$$
\operatorname{ValueType}(\operatorname{RecordValue}(\operatorname{TypePath}(p),\ \mathsf{fs}))\ =\ \operatorname{TypePath}(p)
$$

**(EvalSigma-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalFieldInitsSigma}(\mathsf{fields},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{f}),\ \sigma_{1} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{RecordExpr}(\mathsf{tr},\ \mathsf{fields}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{RecordValue}(\mathsf{tr},\ \mathsf{vec}_{f})),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Record-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalFieldInitsSigma}(\mathsf{fields},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{RecordExpr}(\mathsf{tr},\ \mathsf{fields}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

$$
\operatorname{RecordDefaultInits}(p)\ =\ [\langle f_{1},\ e_{1}\rangle ,\ \ldots ,\ \langle f_{n},\ e_{n}\rangle ]\ \Leftrightarrow \ \operatorname{RecordDecl}(p)\ =\ R\ \land \ \operatorname{Fields}(R)\ =\ [\operatorname{FieldDecl}(\mathsf{attrs}_{1},\ \mathsf{vis}_{1},\ \mathsf{boundary}_{1},\ f_{1},\ T_{1},\ e_{1},\ \mathsf{span}_{1},\ \mathsf{doc}_{1}),\ \ldots ,\ \operatorname{FieldDecl}(\mathsf{attrs}_{n},\ \mathsf{vis}_{n},\ \mathsf{boundary}_{n},\ f_{n},\ T_{n},\ e_{n},\ \mathsf{span}_{n},\ \mathsf{doc}_{n})]\ \land \ \forall \ i.\ e_{i}\ \ne \ \bot 
$$

**(ApplyRecordCtorSigma)**

$$
\begin{array}{l}
\operatorname{RecordDefaultInits}(p)\ =\ \mathsf{fields}\quad \Gamma \ \vdash \ \operatorname{EvalFieldInitsSigma}(\mathsf{fields},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{f}),\ \sigma_{1} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ApplyRecordCtorSigma}(p,\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{RecordValue}(\operatorname{TypePath}(p),\ \mathsf{vec}_{f})),\ \sigma_{1} )
\end{array}
$$

**(ApplyRecordCtorSigma-Ctrl)**

$$
\begin{array}{l}
\operatorname{RecordDefaultInits}(p)\ =\ \mathsf{fields}\quad \Gamma \ \vdash \ \operatorname{EvalFieldInitsSigma}(\mathsf{fields},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ApplyRecordCtorSigma}(p,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

### 12.6.6 Lowering

$$
\begin{array}{l}
\operatorname{AlignUp}(x,\ a)\ =\ \lceil x/a\rceil \ \times \ a\quad \mathsf{where}\ a\ >\ 0 \\
\operatorname{Offsets}([])\ =\ [] \\
\operatorname{Offsets}(\mathsf{fields})\ =\ [\mathsf{offset}_{1},\ \ldots ,\ \mathsf{offset}_{n}]\ \Leftrightarrow \ \mathsf{fields}\ =\ [\langle f_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle f_{n},\ T_{n}\rangle ]\ \land \ n\ \ge \ 1\ \land \ \mathsf{offset}_{1}\ =\ 0\ \land \ \forall \ i\ \in \ \{2,\ \ldots ,\ n\}.\ \mathsf{offset}_{i}\ =\ \operatorname{AlignUp}(\mathsf{offset}\_\{i-1\}\ +\ \operatorname{sizeof}(T\_\{i-1\}),\ \operatorname{alignof}(T_{i})) \\
\operatorname{RecordAlign}([])\ =\ 1 \\
\operatorname{RecordAlign}(\mathsf{fields})\ =\ \mathsf{max}\_\{i\ \in \ \{1,\ \ldots ,\ n\}\}(\operatorname{alignof}(T_{i}))\ \Leftrightarrow \ \mathsf{fields}\ =\ [\langle f_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle f_{n},\ T_{n}\rangle ]\ \land \ n\ \ge \ 1 \\
\operatorname{RecordSize}([])\ =\ 0 \\
\operatorname{RecordSize}(\mathsf{fields})\ =\ \operatorname{AlignUp}(\mathsf{offset}_{n}\ +\ \operatorname{sizeof}(T_{n}),\ \operatorname{RecordAlign}(\mathsf{fields}))\ \Leftrightarrow \ \mathsf{fields}\ =\ [\langle f_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle f_{n},\ T_{n}\rangle ]\ \land \ n\ \ge \ 1\ \land \ \operatorname{Offsets}(\mathsf{fields})\ =\ [\mathsf{offset}_{1},\ \ldots ,\ \mathsf{offset}_{n}] \\
\mathsf{RecordLayoutJudg}\ =\ \{\mathsf{RecordLayout}\}
\end{array}
$$

**(Layout-Record-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{RecordLayout}([])\ \Downarrow \ \langle 0,\ 1,\ []\rangle 
\end{array}
$$

**(Layout-Record-Cons)**

$$
\begin{array}{l}
n\ \ge \ 1\quad \mathsf{offsets}\ =\ [\mathsf{offset}_{1},\ \ldots ,\ \mathsf{offset}_{n}]\quad \mathsf{align}\ =\ \operatorname{RecordAlign}(\mathsf{fields})\quad \mathsf{size}\ =\ \operatorname{RecordSize}(\mathsf{fields}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{RecordLayout}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \mathsf{offsets}\rangle 
\end{array}
$$

**(Size-Record)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \operatorname{Fields}(R)\ =\ \mathsf{fields}\quad \operatorname{RecordLayout}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{size},\ \_,\ \_\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ \mathsf{size}
\end{array}
$$

**(Align-Record)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \operatorname{Fields}(R)\ =\ \mathsf{fields}\quad \operatorname{RecordLayout}(\mathsf{fields})\ \Downarrow \ \langle \_,\ \mathsf{align},\ \_\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{align}
\end{array}
$$

**(Layout-Record)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \operatorname{Fields}(R)\ =\ \mathsf{fields}\quad \operatorname{RecordLayout}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{FieldOffset}(\mathsf{fields},\ f_{i})\ =\ \mathsf{offset}_{i}\ \Leftrightarrow \ \mathsf{fields}\ =\ [\langle f_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle f_{n},\ T_{n}\rangle ]\ \land \ 1\ \le \ i\ \le \ n\ \land \ \operatorname{Offsets}(\mathsf{fields})\ =\ [\mathsf{offset}_{1},\ \ldots ,\ \mathsf{offset}_{n}] \\
\operatorname{FieldValueList}(\mathsf{fs},\ f)\ =\ v\ \Leftrightarrow \ \langle f,\ v\rangle \ \in \ \mathsf{fs} \\
\operatorname{StructBits}([T_{1},\ \ldots ,\ T_{n}],\ [v_{1},\ \ldots ,\ v_{n}],\ [o_{1},\ \ldots ,\ o_{n}],\ \mathsf{size})\ =\ \mathsf{bits}\ \Leftrightarrow \ \mid \mathsf{bits}\mid \ =\ \mathsf{size}\ \land \ \forall \ i.\ \operatorname{ValueBits}(T_{i},\ v_{i})\ =\ b_{i}\ \land \ \mathsf{bits}[o_{i}..o_{i}+\mid b_{i}\mid )\ =\ b_{i}\ \land \ \forall \ j.\ (\forall \ i.\ j\ \notin \ [o_{i},\ o_{i}+\mid b_{i}\mid ))\ \Rightarrow \ \mathsf{bits}[j]\ =\ 0\mathsf{x00} \\
\operatorname{PadBytes}(b,\ \mathsf{size})\ =\ \mathsf{bits}\ \Leftrightarrow \ \mid \mathsf{bits}\mid \ =\ \mathsf{size}\ \land \ \mathsf{bits}[0..\mid b\mid )\ =\ b\ \land \ \forall \ i.\ \mid b\mid \ \le \ i\ <\ \mathsf{size}\ \Rightarrow \ \mathsf{bits}[i]\ =\ 0\mathsf{x00} \\
\operatorname{ValueBits}(\operatorname{TypePath}(p),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ \operatorname{RecordDecl}(p)\ =\ R\ \land \ v\ =\ \operatorname{RecordValue}(\operatorname{TypePath}(p),\ \mathsf{fs})\ \land \ \operatorname{Fields}(R)\ =\ \mathsf{fields}\ \land \ \operatorname{RecordLayout}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \ \land \ \mathsf{fields}\ =\ [\langle f_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle f_{n},\ T_{n}\rangle ]\ \land \ (\forall \ i.\ \operatorname{FieldValue}(\operatorname{RecordValue}(\operatorname{TypePath}(p),\ \mathsf{fs}),\ f_{i})\ =\ v_{i})\ \land \ \operatorname{StructBits}([T_{1},\ \ldots ,\ T_{n}],\ [v_{1},\ \ldots ,\ v_{n}],\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{bits}
\end{array}
$$

**(LowerFieldInits-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerFieldInits}([])\ \Downarrow \ \langle \varepsilon ,\ []\rangle 
\end{array}
$$

**(LowerFieldInits-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle \quad \Gamma \ \vdash \ \operatorname{LowerFieldInits}(\mathsf{fs})\ \Downarrow \ \langle \mathsf{IR}_{s},\ \mathsf{vec}_{f}\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerFieldInits}([\langle f,\ e\rangle ]\ \mathbin{++} \ \mathsf{fs})\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{e},\ \mathsf{IR}_{s}),\ [\langle f,\ v\rangle ]\ \mathbin{++} \ \mathsf{vec}_{f}\rangle 
\end{array}
$$

**(Lower-Expr-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerFieldInits}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{IR},\ \mathsf{vec}_{f}\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{RecordExpr}(\mathsf{tr},\ \mathsf{fields}))\ \Downarrow \ \langle \mathsf{IR},\ \operatorname{RecordValue}(\mathsf{tr},\ \mathsf{vec}_{f})\rangle 
\end{array}
$$

**(Lower-CallIR-RecordCtor)**

$$
\begin{array}{l}
\operatorname{CallTarget}(\mathsf{callee})\ =\ \operatorname{RecordCtor}(p)\quad \mathsf{args}\ =\ []\quad \operatorname{RecordDefaultInits}(p)\ =\ \mathsf{fields}\quad \Gamma \ \vdash \ \operatorname{LowerFieldInits}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{IR}_{f},\ \mathsf{vec}_{f}\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{CallIR}(\mathsf{callee},\ \mathsf{args}))\ \Downarrow \ \langle \mathsf{IR}_{f},\ \operatorname{RecordValue}(\operatorname{TypePath}(p),\ \mathsf{vec}_{f})\rangle 
\end{array}
$$

### 12.6.7 Diagnostics

| Code         | Severity | Detection    | Condition                                                                |
| ------------ | -------- | ------------ | ------------------------------------------------------------------------ |
| `E-TYP-1901` | Error    | Compile-time | Duplicate field name in record declaration                               |
| `E-TYP-1902` | Error    | Compile-time | Missing field initializer in record literal                              |
| `E-TYP-1903` | Error    | Compile-time | Duplicate field initializer in record literal                            |
| `E-TYP-1904` | Error    | Compile-time | Access to nonexistent field                                              |
| `E-TYP-1905` | Error    | Compile-time | Access to field not visible in current scope                             |
| `E-TYP-1906` | Error    | Compile-time | Field visibility exceeds record visibility                               |
| `E-TYP-1907` | Error    | Compile-time | Non-`Bitcopy` field requires move source expression                      |
| `E-TYP-1911` | Error    | Compile-time | Default record construction requires default initializer for every field |

## 12.7 Enums

### 12.7.1 Syntax

```text
enum_decl        ::= attribute_list? visibility? "enum" identifier generic_params? implements_clause? predicate_clause? enum_body invariant_clause?
enum_body        ::= "{" variant_members? "}"
variant_members  ::= variant (terminator variant)* terminator?
variant          ::= identifier variant_payload_opt variant_discriminant_opt
variant_payload  ::= "(" type_list? ")" | "{" field_decl_list? "}"
variant_literal  ::= qualified_variant | qualified_variant "(" arg_exprs? ")" | qualified_variant "{" field_init_list "}"
```

Top-level enum cases are item-separated members. Between top-level enum cases, the implementation MUST accept only statement terminators (`newline` or `;`). A comma MUST NOT be accepted as an enum-case separator.

### 12.7.2 Parsing

**(Parse-Enum)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{enum})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseGenericParamsOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseImplementsOpt}(P_{3})\ \Downarrow \ (P_{4},\ \mathsf{impls})\quad \Gamma \ \vdash \ \operatorname{ParsePredicateClauseOpt}(P_{4})\ \Downarrow \ (P_{5},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseEnumBody}(P_{5})\ \Downarrow \ (P_{6},\ \mathsf{variants})\quad \Gamma \ \vdash \ \operatorname{ParseInvariantOpt}(P_{6})\ \Downarrow \ (P_{7},\ \mathsf{invariant}_{\mathsf{opt}}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseItem}(P)\ \Downarrow \ (P_{7},\ \langle \mathsf{EnumDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{impls},\ \mathsf{variants},\ \mathsf{invariant}_{\mathsf{opt}},\ \operatorname{SpanBetween}(P,\ P_{7}),\ []\rangle )
\end{array}
$$

**(Parse-EnumBody)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseVariantMembers}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{vars})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\}"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseEnumBody}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \mathsf{vars})
\end{array}
$$

**(Parse-VariantMembers-Empty)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\}"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseVariantMembers}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-VariantMembers-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseVariant}(P)\ \Downarrow \ (P_{1},\ v)\quad \Gamma \ \vdash \ \operatorname{ParseVariantSep}(P_{1})\ \Downarrow \ P_{2}\quad \Gamma \ \vdash \ \operatorname{ParseVariantMembers}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{vs}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseVariantMembers}(P)\ \Downarrow \ (P_{3},\ [v]\ \mathbin{++} \ \mathsf{vs})
\end{array}
$$

**(Parse-VariantSep-End)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\}"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseVariantSep}(P)\ \Downarrow \ P
\end{array}
$$

**(Parse-VariantSep-Terminator)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ConsumeTerminatorReq}(P)\ \Downarrow \ P_{1} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseVariantSep}(P)\ \Downarrow \ P_{1}
\end{array}
$$

**(Parse-Variant)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseIdent}(P)\ \Downarrow \ (P_{1},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseVariantPayloadOpt}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{payload}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVariantDiscriminantOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{disc}_{\mathsf{opt}}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseVariant}(P)\ \Downarrow \ (P_{3},\ \langle \mathsf{name},\ \mathsf{payload}_{\mathsf{opt}},\ \mathsf{disc}_{\mathsf{opt}}\rangle )
\end{array}
$$

**(Parse-VariantPayloadOpt-None)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ \notin \ \{\operatorname{Punctuator}(\texttt{"("}),\ \operatorname{Punctuator}(\texttt{"\{"})\} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseVariantPayloadOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-VariantPayloadOpt-Tuple)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseTypeList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{ts})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{")"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseVariantPayloadOpt}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{TuplePayload}(\mathsf{ts}))
\end{array}
$$

**(Parse-VariantPayloadOpt-Record)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseFieldDeclList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{fs})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\}"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseVariantPayloadOpt}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{RecordPayload}(\mathsf{fs}))
\end{array}
$$

**(Parse-VariantDiscriminantOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"="}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseVariantDiscriminantOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-VariantDiscriminantOpt-Yes)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"="})\quad t\ =\ \operatorname{Tok}(\operatorname{Advance}(P))\quad t.\mathsf{kind}\ =\ \mathsf{IntLiteral} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseVariantDiscriminantOpt}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P)),\ t)
\end{array}
$$

Commas are not valid separators between top-level enum variants. Payload forms within a variant continue to use the comma-delimited productions they reference.

Enum literal surface forms are parsed first as qualified names or qualified applies and are resolved to `EnumLiteral` by the static semantics of this section.

### 12.7.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{EnumDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{implements},\ \mathsf{variants},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}\rangle  \\
\mathsf{EnumDecl}.\mathsf{implements}\ \in \ [\mathsf{ClassPath}]
\end{array}
$$

$$
\begin{array}{l}
\mathsf{VariantDecl}\ =\ \langle \mathsf{name},\ \mathsf{payload}_{\mathsf{opt}},\ \mathsf{discriminant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}\rangle  \\
\mathsf{VariantPayload}\ \in \ \{\mathsf{TuplePayload}\ =\ [\mathsf{Type}],\ \mathsf{RecordPayload}\ =\ [\mathsf{FieldDecl}]\} \\
\forall \ f\ \in \ \mathsf{RecordPayload}.\ f.\mathsf{init}_{\mathsf{opt}}\ =\ \bot 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Variants}(E)\ =\ E.\mathsf{variants} \\
\mathsf{BuiltinEnum}\ =\ \{\texttt{FileKind},\ \texttt{IoError},\ \texttt{AllocationError},\ \texttt{Priority}\} \\
\operatorname{EnumPathOf}(E)\ =\ [E.\mathsf{name}]\quad \mathsf{if}\ E.\mathsf{name}\ \in \ \mathsf{BuiltinEnum} \\
\operatorname{EnumPathOf}(E)\ =\ \operatorname{FullPath}(\operatorname{ModuleOf}(E),\ E.\mathsf{name})\quad \mathsf{otherwise} \\
\operatorname{EnumPath}(\mathsf{path})\ =\ p\ \Leftrightarrow \ \operatorname{SplitLast}(\mathsf{path})\ =\ (p,\ n) \\
\operatorname{VariantName}(\mathsf{path})\ =\ n\ \Leftrightarrow \ \operatorname{SplitLast}(\mathsf{path})\ =\ (p,\ n) \\
\operatorname{VariantIndex}(E,\ \mathsf{name})\ =\ i\ \Leftrightarrow \ \operatorname{Variants}(E)\ =\ [v_{0},\ \ldots ,\ v_{k}]\ \land \ v_{i}.\mathsf{name}\ =\ \mathsf{name}
\end{array}
$$

### 12.7.4 Static Semantics

**(Bind-Enum)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ItemBindings}(\operatorname{EnumDecl}(\_,\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_),\ p)\ \Downarrow \ [(\mathsf{name},\ \langle \mathsf{Type},\ p,\ \bot ,\ \mathsf{Decl}\rangle )]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{PayloadOptWF}(\bot ) \\
\operatorname{PayloadOptWF}(\operatorname{TuplePayload}([T_{1},\ \ldots ,\ T_{n}]))\ \Leftrightarrow \ \forall \ i.\ \Gamma \ \vdash \ T_{i}\ \mathsf{wf} \\
\operatorname{PayloadOptWF}(\operatorname{RecordPayload}([\langle f_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle f_{k},\ T_{k}\rangle ]))\ \Leftrightarrow \ \operatorname{Distinct}([f_{1},\ \ldots ,\ f_{k}])\ \land \ \forall \ i.\ \Gamma \ \vdash \ T_{i}\ \mathsf{wf}
\end{array}
$$

$$
\Gamma \ \vdash \ \mathsf{payload}_{\mathsf{opt}}\ \mathsf{wf}\ \Leftrightarrow \ \operatorname{PayloadOptWF}(\mathsf{payload}_{\mathsf{opt}})
$$

**(Resolve-EnumUnit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ p\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{VariantPayload}(E,\ \mathsf{name})\ =\ \bot  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveEnumUnit}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p
\end{array}
$$

**(Resolve-EnumTuple)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ p\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{VariantPayload}(E,\ \mathsf{name})\ =\ \operatorname{TuplePayload}(\_) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveEnumTuple}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p
\end{array}
$$

**(Resolve-EnumRecord)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ p\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{VariantPayload}(E,\ \mathsf{name})\ =\ \operatorname{RecordPayload}(\_) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveEnumRecord}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p
\end{array}
$$

**(ResolveQual-Name-Enum)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveQualified}(\mathsf{path},\ \mathsf{name},\ \mathsf{ValueKind})\ \uparrow \quad \Gamma \ \vdash \ \operatorname{ResolveRecordPath}(\mathsf{path},\ \mathsf{name})\ \uparrow \quad \Gamma \ \vdash \ \operatorname{ResolveEnumUnit}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveQualifiedForm}(\operatorname{QualifiedName}(\mathsf{path},\ \mathsf{name}))\ \Downarrow \ \operatorname{EnumLiteral}(\operatorname{FullPath}(p,\ \mathsf{name}),\ \bot )
\end{array}
$$

**(ResolveQual-Apply-Enum-Tuple)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveArgs}(\mathsf{args})\ \Downarrow \ \mathsf{args}'\quad \Gamma \ \vdash \ \operatorname{ResolveQualified}(\mathsf{path},\ \mathsf{name},\ \mathsf{ValueKind})\ \uparrow \quad \Gamma \ \vdash \ \operatorname{ResolveRecordPath}(\mathsf{path},\ \mathsf{name})\ \uparrow \quad \Gamma \ \vdash \ \operatorname{ResolveEnumTuple}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveQualifiedForm}(\operatorname{QualifiedApply}(\mathsf{path},\ \mathsf{name},\ \operatorname{Paren}(\mathsf{args})))\ \Downarrow \ \operatorname{EnumLiteral}(\operatorname{FullPath}(p,\ \mathsf{name}),\ \operatorname{Paren}(\operatorname{ArgsExprs}(\mathsf{args}')))
\end{array}
$$

**(ResolveQual-Apply-Enum-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveFieldInits}(\mathsf{fields})\ \Downarrow \ \mathsf{fields}'\quad \Gamma \ \vdash \ \operatorname{ResolveRecordPath}(\mathsf{path},\ \mathsf{name})\ \uparrow \quad \Gamma \ \vdash \ \operatorname{ResolveEnumRecord}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveQualifiedForm}(\operatorname{QualifiedApply}(\mathsf{path},\ \mathsf{name},\ \operatorname{Brace}(\mathsf{fields})))\ \Downarrow \ \operatorname{EnumLiteral}(\operatorname{FullPath}(p,\ \mathsf{name}),\ \operatorname{Brace}(\mathsf{fields}'))
\end{array}
$$

**(ResolveItem-Enum)**

$$
\begin{array}{l}
S_{\mathsf{gen}}\ =\ \operatorname{TypeParamBindings}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \Gamma_{g} \ =\ [S_{\mathsf{gen}},\ S_{\mathsf{module}},\ S_{\mathsf{universe}}]\quad \Gamma_{g} \ \vdash \ \operatorname{ResolveGenericParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\ \Downarrow \ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}}'\quad \Gamma_{g} \ \vdash \ \operatorname{ResolvePredicateClauseOpt}(\mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}})\ \Downarrow \ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}'\quad \Gamma_{g} \ \vdash \ \operatorname{ResolveClassPathList}(\mathsf{impls})\ \Downarrow \ \mathsf{impls}'\quad \Gamma_{g} \ \vdash \ \operatorname{ResolveVariantList}(\mathsf{vars})\ \Downarrow \ \mathsf{vars}'\quad \Gamma_{g} \ \vdash \ \operatorname{ResolveInvariantOpt}(\mathsf{invariant}_{\mathsf{opt}})\ \Downarrow \ \mathsf{invariant}_{\mathsf{opt}}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveItem}(\operatorname{EnumDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{impls},\ \mathsf{vars},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}))\ \Downarrow \ \operatorname{EnumDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}}',\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}',\ \mathsf{impls}',\ \mathsf{vars}',\ \mathsf{invariant}_{\mathsf{opt}}',\ \mathsf{span},\ \mathsf{doc})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{DiscOf}(v,\ n)\ = \\
\ n\quad \mathsf{if}\ \operatorname{disc_opt}(v)\ =\ \bot  \\
\ \operatorname{DiscValue}(\mathsf{tok})\quad \mathsf{if}\ \operatorname{disc_opt}(v)\ =\ \mathsf{tok} \\
\operatorname{DiscValue}(\mathsf{tok})\ =\ \operatorname{IntValue}(\mathsf{tok}) \\
\operatorname{DiscSeq}([],\ n)\ =\ [] \\
\operatorname{DiscSeq}(v\mathbin{::} \mathsf{vs},\ n)\ =\ [\operatorname{DiscOf}(v,\ n)]\ \mathbin{++} \ \operatorname{DiscSeq}(\mathsf{vs},\ \operatorname{DiscOf}(v,\ n)\ +\ 1) \\
\operatorname{EnumVariantNames}(E)\ =\ [v.\mathsf{name}\ \mid \ v\ \in \ \operatorname{Variants}(E)]
\end{array}
$$

$$
\operatorname{EnumDiscriminants}(E)\ \Downarrow \ \mathsf{ds}\ \Leftrightarrow \ \mathsf{ds}\ =\ \operatorname{DiscSeq}(\operatorname{Variants}(E),\ 0)\ \land \ \operatorname{Distinct}(\mathsf{ds})\ \land \ \forall \ d\ \in \ \mathsf{ds}.\ d\ \ge \ 0
$$

**(Enum-Disc-NotInt)**

$$
\begin{array}{l}
\exists \ v\ \in \ \operatorname{Variants}(E).\ \operatorname{disc_opt}(v)\ =\ \mathsf{tok}\quad \mathsf{tok}.\mathsf{kind}\ \ne \ \mathsf{IntLiteral}\quad c\ =\ \operatorname{Code}(\mathsf{Enum}-\mathsf{Disc}-\mathsf{NotInt}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EnumDiscriminants}(E)\ \Uparrow \ c
\end{array}
$$

**(Enum-Disc-Invalid)**

$$
\begin{array}{l}
\exists \ v\ \in \ \operatorname{Variants}(E).\ \operatorname{disc_opt}(v)\ =\ \mathsf{tok}\quad \operatorname{DiscValue}(\mathsf{tok})\ \mathsf{undefined}\quad c\ =\ \operatorname{Code}(\mathsf{Enum}-\mathsf{Disc}-\mathsf{Invalid}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EnumDiscriminants}(E)\ \Uparrow \ c
\end{array}
$$

**(Enum-Disc-Negative)**

$$
\begin{array}{l}
\exists \ v\ \in \ \operatorname{Variants}(E).\ \operatorname{disc_opt}(v)\ =\ \mathsf{tok}\quad \operatorname{DiscValue}(\mathsf{tok})\ =\ d\quad d\ <\ 0\quad c\ =\ \operatorname{Code}(\mathsf{Enum}-\mathsf{Disc}-\mathsf{Negative}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EnumDiscriminants}(E)\ \Uparrow \ c
\end{array}
$$

**(Enum-Disc-Dup)**

$$
\begin{array}{l}
\mathsf{ds}\ =\ \operatorname{DiscSeq}(\operatorname{Variants}(E),\ 0)\quad \lnot \ \operatorname{Distinct}(\mathsf{ds})\quad c\ =\ \operatorname{Code}(\mathsf{Enum}-\mathsf{Disc}-\mathsf{Dup}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EnumDiscriminants}(E)\ \Uparrow \ c
\end{array}
$$

**(Enum-Empty-Err)**

$$
\begin{array}{l}
\operatorname{Variants}(E)\ =\ []\quad c\ =\ \operatorname{Code}(\mathsf{Enum}-\mathsf{Empty}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ E\ \mathsf{enum}\ :\ \mathsf{ok}\ \Uparrow \ c
\end{array}
$$

**(Enum-Variant-Dup)**

$$
\begin{array}{l}
\mathsf{names}\ =\ \operatorname{EnumVariantNames}(E)\quad \lnot \ \operatorname{Distinct}(\mathsf{names})\quad c\ =\ \operatorname{Code}(\mathsf{Enum}-\mathsf{Variant}-\mathsf{Dup}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ E\ \mathsf{enum}\ :\ \mathsf{ok}\ \Uparrow \ c
\end{array}
$$

$$
\begin{array}{l}
\operatorname{MaxDisc}(E)\ =\ \operatorname{max}(\mathsf{ds})\ \Leftrightarrow \ \operatorname{EnumDiscriminants}(E)\ \Downarrow \ \mathsf{ds} \\
\operatorname{DiscType}(E)\ = \\
\ \texttt{u8}\quad \mathsf{if}\ 0\ \le \ \operatorname{MaxDisc}(E)\ \le \ 255 \\
\ \texttt{u16}\ \mathsf{if}\ 256\ \le \ \operatorname{MaxDisc}(E)\ \le \ 65,535 \\
\ \texttt{u32}\ \mathsf{if}\ 65,536\ \le \ \operatorname{MaxDisc}(E)\ \le \ 4,294,967,295 \\
\ \texttt{u64}\ \mathsf{otherwise}
\end{array}
$$

**(WF-EnumDecl)**

$$
\begin{array}{l}
E\ =\ \operatorname{EnumDecl}(\_,\ \_,\ \_,\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \_,\ \mathsf{variants},\ \_,\ \_,\ \_)\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \mathsf{params}_{\mathsf{gen}}\ =\ [P_{1},\ \ldots ,\ P_{n}]\quad \Gamma \ \vdash \ \langle P_{1};\ \ldots ;\ P_{n}\rangle \ \mathsf{wf}\quad \Gamma_{g} \ =\ \operatorname{BindTypeParams}(\Gamma ,\ \mathsf{params}_{\mathsf{gen}})\quad \Gamma_{g} ;\ \mathsf{params}_{\mathsf{gen}}\ \vdash \ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}\ \mathsf{wf}\quad \mathsf{variants}\ \ne \ []\quad \operatorname{Distinct}([v.\mathsf{name}\ \mid \ v\ \in \ \mathsf{variants}])\quad \forall \ v\ \in \ \mathsf{variants},\ \Gamma_{g} \ \vdash \ v.\mathsf{payload}_{\mathsf{opt}}\ \mathsf{wf}\quad \operatorname{EnumDiscriminants}(E)\ \Downarrow \ \_\quad \Gamma_{g} \ \vdash \ \operatorname{TypePath}(\operatorname{EnumPathOf}(E))\ :\ \mathsf{ImplementsOk} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ E\ \mathsf{enum}\ :\ \mathsf{ok}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{VariantPayload}(E,\ v)\ =\ \mathsf{payload}_{\mathsf{opt}}\ \Leftrightarrow \ \exists \ \mathsf{disc},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{VariantDecl}(v,\ \mathsf{payload}_{\mathsf{opt}},\ \mathsf{disc},\ \mathsf{span},\ \mathsf{doc})\ \in \ E.\mathsf{variants} \\
\operatorname{VariantFieldNames}(\mathsf{fs})\ =\ [\ f\ \mid \ \operatorname{FieldDecl}(\_,\ \_,\ \_,\ f,\ \_,\ \_,\ \_,\ \_)\ \in \ \mathsf{fs}\ ] \\
\operatorname{VariantFieldNameSet}(\mathsf{fs})\ =\ \operatorname{Set}(\operatorname{VariantFieldNames}(\mathsf{fs})) \\
\operatorname{EnumFieldType}(E,\ v,\ f)\ =\ T_{f}\ \Leftrightarrow \ \operatorname{VariantPayload}(E,\ v)\ =\ \operatorname{RecordPayload}(\mathsf{fs})\ \land \ \exists \ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{init}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}.\ \operatorname{FieldDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{boundary},\ f,\ T_{f},\ \mathsf{init}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}})\ \in \ \mathsf{fs} \\
\operatorname{TuplePayloadArity}(E,\ v)\ =\ n\ \Leftrightarrow \ \operatorname{VariantPayload}(E,\ v)\ =\ \operatorname{TuplePayload}([T_{1},\ \ldots ,\ T_{n}])
\end{array}
$$

**(T-Enum-Lit-Unit)**

$$
\begin{array}{l}
\operatorname{EnumDecl}(\operatorname{EnumPath}(\mathsf{path}))\ =\ E\quad v\ =\ \operatorname{VariantName}(\mathsf{path})\quad \operatorname{VariantPayload}(E,\ v)\ =\ \bot  \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{EnumLiteral}(\mathsf{path},\ \bot )\ :\ \operatorname{TypePath}(\operatorname{EnumPath}(\mathsf{path}))
\end{array}
$$

**(Enum-Lit-Unknown)**

$$
\begin{array}{l}
\operatorname{EnumDecl}(\operatorname{EnumPath}(\mathsf{path}))\ =\ E\quad \operatorname{VariantName}(\mathsf{path})\ \notin \ \operatorname{EnumVariantNames}(E)\quad c\ =\ \operatorname{Code}(\mathsf{Enum}-\mathsf{Lit}-\mathsf{Unknown}) \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{EnumLiteral}(\mathsf{path},\ \mathsf{payload}_{\mathsf{opt}})\ \Uparrow \ c
\end{array}
$$

**(T-Enum-Lit-Tuple)**

$$
\begin{array}{l}
\operatorname{EnumDecl}(\operatorname{EnumPath}(\mathsf{path}))\ =\ E\quad v\ =\ \operatorname{VariantName}(\mathsf{path})\quad \operatorname{VariantPayload}(E,\ v)\ =\ \operatorname{TuplePayload}([T_{1},\ \ldots ,\ T_{n}])\quad \forall \ i,\ \Gamma ;\ R;\ L\ \vdash \ e_{i}\ \Leftarrow \ T_{i}\ \dashv \ \emptyset  \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{EnumLiteral}(\mathsf{path},\ \operatorname{Paren}([e_{1},\ \ldots ,\ e_{n}]))\ :\ \operatorname{TypePath}(\operatorname{EnumPath}(\mathsf{path}))
\end{array}
$$

**(Enum-Lit-Tuple-Arity-Err)**

$$
\begin{array}{l}
\operatorname{EnumDecl}(\operatorname{EnumPath}(\mathsf{path}))\ =\ E\quad v\ =\ \operatorname{VariantName}(\mathsf{path})\quad \operatorname{TuplePayloadArity}(E,\ v)\ =\ n\quad \mid \mathsf{es}\mid \ \ne \ n\quad c\ =\ \operatorname{Code}(\mathsf{Enum}-\mathsf{Lit}-\mathsf{Tuple}-\mathsf{Arity}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{EnumLiteral}(\mathsf{path},\ \operatorname{Paren}(\mathsf{es}))\ \Uparrow \ c
\end{array}
$$

**(T-Enum-Lit-Record)**

$$
\begin{array}{l}
\operatorname{EnumDecl}(\operatorname{EnumPath}(\mathsf{path}))\ =\ E\quad v\ =\ \operatorname{VariantName}(\mathsf{path})\quad \operatorname{VariantPayload}(E,\ v)\ =\ \operatorname{RecordPayload}(\mathsf{fs})\quad \operatorname{Distinct}(\operatorname{FieldInitNames}(\mathsf{fields}))\quad \operatorname{FieldInitSet}(\mathsf{fields})\ =\ \operatorname{VariantFieldNameSet}(\mathsf{fs})\quad \forall \ \langle f,\ e\rangle \ \in \ \mathsf{fields},\ \Gamma ;\ R;\ L\ \vdash \ e\ \Leftarrow \ \operatorname{EnumFieldType}(E,\ v,\ f)\ \dashv \ \emptyset  \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{EnumLiteral}(\mathsf{path},\ \operatorname{Brace}(\mathsf{fields}))\ :\ \operatorname{TypePath}(\operatorname{EnumPath}(\mathsf{path}))
\end{array}
$$

**(Enum-Lit-Record-MissingField)**

$$
\begin{array}{l}
\operatorname{EnumDecl}(\operatorname{EnumPath}(\mathsf{path}))\ =\ E\quad v\ =\ \operatorname{VariantName}(\mathsf{path})\quad \operatorname{VariantPayload}(E,\ v)\ =\ \operatorname{RecordPayload}(\mathsf{fs})\quad \operatorname{FieldInitSet}(\mathsf{fields})\ \subset \ \operatorname{VariantFieldNameSet}(\mathsf{fs})\quad c\ =\ \operatorname{Code}(\mathsf{Enum}-\mathsf{Lit}-\mathsf{Record}-\mathsf{MissingField}) \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{EnumLiteral}(\mathsf{path},\ \operatorname{Brace}(\mathsf{fields}))\ \Uparrow \ c
\end{array}
$$

### 12.7.5 Dynamic Semantics

$$
\operatorname{ValueType}(\operatorname{EnumValue}(\mathsf{path},\ \mathsf{payload}))\ =\ \operatorname{TypePath}(p)\ \Leftrightarrow \ \operatorname{EnumPath}(\mathsf{path})\ =\ p
$$

**(EvalSigma-Enum-Unit)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{EnumLiteral}(\mathsf{path},\ \bot ),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{EnumValue}(\mathsf{path},\ \bot )),\ \sigma )
\end{array}
$$

**(EvalSigma-Enum-Tuple)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalListSigma}(\mathsf{es},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{v}),\ \sigma_{1} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{EnumLiteral}(\mathsf{path},\ \operatorname{Paren}(\mathsf{es})),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{EnumValue}(\mathsf{path},\ \operatorname{TuplePayload}(\mathsf{vec}_{v}))),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Enum-Tuple-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalListSigma}(\mathsf{es},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{EnumLiteral}(\mathsf{path},\ \operatorname{Paren}(\mathsf{es})),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Enum-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalFieldInitsSigma}(\mathsf{fields},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{f}),\ \sigma_{1} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{EnumLiteral}(\mathsf{path},\ \operatorname{Brace}(\mathsf{fields})),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{EnumValue}(\mathsf{path},\ \operatorname{RecordPayload}(\mathsf{vec}_{f}))),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Enum-Record-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalFieldInitsSigma}(\mathsf{fields},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{EnumLiteral}(\mathsf{path},\ \operatorname{Brace}(\mathsf{fields})),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

### 12.7.6 Lowering

$$
\begin{array}{l}
\operatorname{EnumDisc}(E,\ \mathsf{name})\ =\ d\ \Leftrightarrow \ \operatorname{EnumDiscriminants}(E)\ \Downarrow \ \mathsf{ds}\ \land \ \operatorname{VariantIndex}(E,\ \mathsf{name})\ =\ i\ \land \ \mathsf{ds}[i]\ =\ d \\
\operatorname{VariantPayloadOpt}(v)\ =\ \mathsf{payload}_{\mathsf{opt}}\ \Leftrightarrow \ v\ =\ \langle \mathsf{name},\ \mathsf{payload}_{\mathsf{opt}},\ \mathsf{disc}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}\rangle  \\
\operatorname{VariantSize}(v)\ =\ 0\ \Leftrightarrow \ \operatorname{VariantPayloadOpt}(v)\ =\ \bot  \\
\operatorname{VariantAlign}(v)\ =\ 1\ \Leftrightarrow \ \operatorname{VariantPayloadOpt}(v)\ =\ \bot  \\
\operatorname{VariantSize}(v)\ =\ s\ \Leftrightarrow \ \operatorname{VariantPayloadOpt}(v)\ =\ \operatorname{TuplePayload}([T_{1},\ \ldots ,\ T_{k}])\ \land \ \operatorname{TupleLayout}([T_{1},\ \ldots ,\ T_{k}])\ \Downarrow \ \langle s,\ a,\ \_\rangle  \\
\operatorname{VariantAlign}(v)\ =\ a\ \Leftrightarrow \ \operatorname{VariantPayloadOpt}(v)\ =\ \operatorname{TuplePayload}([T_{1},\ \ldots ,\ T_{k}])\ \land \ \operatorname{TupleLayout}([T_{1},\ \ldots ,\ T_{k}])\ \Downarrow \ \langle s,\ a,\ \_\rangle  \\
\operatorname{VariantSize}(v)\ =\ s\ \Leftrightarrow \ \operatorname{VariantPayloadOpt}(v)\ =\ \operatorname{RecordPayload}(\mathsf{fields})\ \land \ \operatorname{RecordLayout}(\mathsf{fields})\ \Downarrow \ \langle s,\ a,\ \_\rangle  \\
\operatorname{VariantAlign}(v)\ =\ a\ \Leftrightarrow \ \operatorname{VariantPayloadOpt}(v)\ =\ \operatorname{RecordPayload}(\mathsf{fields})\ \land \ \operatorname{RecordLayout}(\mathsf{fields})\ \Downarrow \ \langle s,\ a,\ \_\rangle  \\
\operatorname{PayloadSize}(E)\ =\ \mathsf{max}\_\{v\ \in \ \operatorname{Variants}(E)\}(\operatorname{VariantSize}(v)) \\
\operatorname{PayloadAlign}(E)\ =\ \mathsf{max}\_\{v\ \in \ \operatorname{Variants}(E)\}(\operatorname{VariantAlign}(v)) \\
\operatorname{EnumDiscType}(E)\ =\ \operatorname{DiscType}(E) \\
\operatorname{EnumAlign}(E)\ =\ \operatorname{max}(\operatorname{alignof}(\operatorname{EnumDiscType}(E)),\ \operatorname{PayloadAlign}(E)) \\
\operatorname{EnumSize}(E)\ =\ \operatorname{AlignUp}(\operatorname{sizeof}(\operatorname{EnumDiscType}(E))\ +\ \operatorname{PayloadSize}(E),\ \operatorname{EnumAlign}(E)) \\
\mathsf{EnumLayoutJudg}\ =\ \{\mathsf{EnumLayout}\}
\end{array}
$$

**(Layout-Enum-Tagged)**

$$
\begin{array}{l}
\mathsf{size}\ =\ \operatorname{EnumSize}(E)\quad \mathsf{align}\ =\ \operatorname{EnumAlign}(E) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EnumLayout}(E)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \operatorname{EnumDiscType}(E),\ \operatorname{PayloadSize}(E)\rangle 
\end{array}
$$

**(Size-Enum)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{EnumLayout}(E)\ \Downarrow \ \langle \mathsf{size},\ \_,\ \_,\ \_\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ \mathsf{size}
\end{array}
$$

**(Align-Enum)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{EnumLayout}(E)\ \Downarrow \ \langle \_,\ \mathsf{align},\ \_,\ \_\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{align}
\end{array}
$$

**(Layout-Enum)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{EnumLayout}(E)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_,\ \_\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{EnumPayloadBits}(E,\ \mathsf{name},\ \bot )\ =\ \mathsf{bits}\ \Leftrightarrow \ (\exists \ v\ \in \ \operatorname{Variants}(E).\ v.\mathsf{name}\ =\ \mathsf{name}\ \land \ \operatorname{VariantPayloadOpt}(v)\ =\ \bot )\ \land \ \operatorname{PadBytes}([],\ \operatorname{PayloadSize}(E))\ =\ \mathsf{bits} \\
\operatorname{EnumPayloadBits}(E,\ \mathsf{name},\ \operatorname{TuplePayload}([v_{1},\ \ldots ,\ v_{k}]))\ =\ \mathsf{bits}\ \Leftrightarrow \ (\exists \ v\ \in \ \operatorname{Variants}(E).\ v.\mathsf{name}\ =\ \mathsf{name}\ \land \ \operatorname{VariantPayloadOpt}(v)\ =\ \operatorname{TuplePayload}([T_{1},\ \ldots ,\ T_{k}]))\ \land \ \operatorname{ValueBits}(\operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{k}]),\ (v_{1},\ \ldots ,\ v_{k}))\ =\ b\ \land \ \operatorname{PadBytes}(b,\ \operatorname{PayloadSize}(E))\ =\ \mathsf{bits} \\
\operatorname{EnumPayloadBits}(E,\ \mathsf{name},\ \operatorname{RecordPayload}(\mathsf{fs}))\ =\ \mathsf{bits}\ \Leftrightarrow \ (\exists \ v\ \in \ \operatorname{Variants}(E).\ v.\mathsf{name}\ =\ \mathsf{name}\ \land \ \operatorname{VariantPayloadOpt}(v)\ =\ \operatorname{RecordPayload}(\mathsf{fields}))\ \land \ \operatorname{RecordLayout}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \ \land \ \mathsf{fields}\ =\ [\langle f_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle f_{n},\ T_{n}\rangle ]\ \land \ (\forall \ i.\ \operatorname{FieldValueList}(\mathsf{fs},\ f_{i})\ =\ v_{i})\ \land \ \operatorname{StructBits}([T_{1},\ \ldots ,\ T_{n}],\ [v_{1},\ \ldots ,\ v_{n}],\ \mathsf{offsets},\ \mathsf{size})\ =\ b\ \land \ \operatorname{PadBytes}(b,\ \operatorname{PayloadSize}(E))\ =\ \mathsf{bits} \\
\operatorname{ValueBits}(\operatorname{TypePath}(p),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ \operatorname{EnumDecl}(p)\ =\ E\ \land \ v\ =\ \operatorname{EnumValue}(\mathsf{path},\ \mathsf{payload})\ \land \ \operatorname{EnumPath}(\mathsf{path})\ =\ p\ \land \ \mathsf{name}\ =\ \operatorname{VariantName}(\mathsf{path})\ \land \ \operatorname{EnumDisc}(E,\ \mathsf{name})\ =\ d\ \land \ \operatorname{EnumPayloadBits}(E,\ \mathsf{name},\ \mathsf{payload})\ =\ \mathsf{payload}_{\mathsf{bits}}\ \land \ \operatorname{EnumDiscType}(E)\ =\ D\ \land \ D\ =\ \operatorname{TypePrim}(t)\ \land \ \operatorname{ValueBits}(D,\ \operatorname{IntVal}(t,\ d))\ =\ \mathsf{disc}_{\mathsf{bits}}\ \land \ \operatorname{TaggedBits}(\mathsf{disc}_{\mathsf{bits}},\ \mathsf{payload}_{\mathsf{bits}},\ \operatorname{sizeof}(D),\ \operatorname{PayloadSize}(E),\ \operatorname{PayloadAlign}(E),\ \operatorname{EnumSize}(E))\ =\ \mathsf{bits}
\end{array}
$$

**(Lower-Expr-Enum-Unit)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{EnumLiteral}(\mathsf{path},\ \bot ))\ \Downarrow \ \langle \varepsilon ,\ \operatorname{EnumValue}(\mathsf{path},\ \bot )\rangle 
\end{array}
$$

**(Lower-Expr-Enum-Tuple)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerList}(\mathsf{es})\ \Downarrow \ \langle \mathsf{IR},\ \mathsf{vec}_{v}\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{EnumLiteral}(\mathsf{path},\ \operatorname{Paren}(\mathsf{es})))\ \Downarrow \ \langle \mathsf{IR},\ \operatorname{EnumValue}(\mathsf{path},\ \operatorname{TuplePayload}(\mathsf{vec}_{v}))\rangle 
\end{array}
$$

**(Lower-Expr-Enum-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerFieldInits}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{IR},\ \mathsf{vec}_{f}\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{EnumLiteral}(\mathsf{path},\ \operatorname{Brace}(\mathsf{fields})))\ \Downarrow \ \langle \mathsf{IR},\ \operatorname{EnumValue}(\mathsf{path},\ \operatorname{RecordPayload}(\mathsf{vec}_{f}))\rangle 
\end{array}
$$

### 12.7.7 Diagnostics

| Code         | Severity | Detection    | Condition                                        |
| ------------ | -------- | ------------ | ------------------------------------------------ |
| `E-TYP-1920` | Error    | Compile-time | Enum discriminant is not an integer literal      |
| `E-TYP-1921` | Error    | Compile-time | Enum discriminant literal is invalid             |
| `E-TYP-1922` | Error    | Compile-time | Enum discriminant must be non-negative           |
| `E-TYP-1923` | Error    | Compile-time | Duplicate enum discriminant value                |
| `E-TYP-2001` | Error    | Compile-time | Enum declaration contains no variants            |
| `E-TYP-2002` | Error    | Compile-time | Duplicate variant name in enum declaration       |
| `E-TYP-2007` | Error    | Compile-time | Unknown variant name in enum construction        |
| `E-TYP-2008` | Error    | Compile-time | Variant payload arity mismatch                   |
| `E-TYP-2009` | Error    | Compile-time | Missing field initializer in record-like variant |

## 12.8 Union Types

### 12.8.1 Syntax

```text
union_type ::= non_perm_type ("|" non_perm_type)+
```

Union introduction is semantic: any expression whose type is a member of a union may be typed as that union.

### 12.8.2 Parsing

**(Parse-UnionTail-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseUnionTail}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-UnionTail-Cons)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|"})\quad \Gamma \ \vdash \ \operatorname{ParseNonPermType}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ t_{1})\quad \Gamma \ \vdash \ \operatorname{ParseUnionTail}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{ts}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseUnionTail}(P)\ \Downarrow \ (P_{2},\ [t_{1}]\ \mathbin{++} \ \mathsf{ts})
\end{array}
$$

### 12.8.3 AST Representation / Form

$$
\mathsf{TypeUnion}\ =\ \langle \mathsf{members}\rangle \ \mathsf{where}\ \mathsf{members}\ \in \ [\mathsf{Type}]
$$

$$
\begin{array}{l}
\operatorname{Members}(\operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}]))\ =\ [T_{1},\ \ldots ,\ T_{n}] \\
\operatorname{DistinctMembers}(U)\ =\ [T_{i}\ \in \ \operatorname{Members}(U)\ \mid \ \forall \ j\ <\ i.\ \lnot (\Gamma \ \vdash \ T_{i}\ \equiv \ T_{j})] \\
\operatorname{SetMembers}(U)\ =\ \{\ T\ \mid \ T\ \in \ \operatorname{DistinctMembers}(U)\ \}
\end{array}
$$

### 12.8.4 Static Semantics

**(WF-Union)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad n\ \ge \ 2\quad \forall \ i,\ \Gamma \ \vdash \ T_{i}\ \mathsf{wf} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \mathsf{wf}
\end{array}
$$

**(WF-Union-TooFew)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad n\ <\ 2\quad c\ =\ \operatorname{Code}(\mathsf{WF}-\mathsf{Union}-\mathsf{TooFew}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \mathsf{wf}\ \Uparrow \ c
\end{array}
$$

$$
\operatorname{Member}(T,\ U)\ \Leftrightarrow \ U\ =\ \operatorname{TypeUnion}([U_{1},\ \ldots ,\ U_{n}])\ \land \ \exists \ i.\ \Gamma \ \vdash \ T\ \equiv \ U_{i}
$$

**(Sub-Member-Union)**
Member(T, U)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

**(Sub-Union-Width)**

$$
\begin{array}{l}
U_{1}\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad U_{2}\ =\ \operatorname{TypeUnion}([U_{1}',\ \ldots ,\ U_{m}'])\quad \forall \ i,\ \operatorname{Member}(T_{i},\ U_{2}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ U_{1}\ \mathrel{<:} \ U_{2}
\end{array}
$$

**(T-Union-Intro)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ :\ T\quad \operatorname{Member}(T,\ U) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ e\ :\ U
\end{array}
$$

**(Union-DirectAccess-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ U\quad \operatorname{StripPerm}(U)\ =\ \operatorname{TypeUnion}(\_)\quad c\ =\ \operatorname{Code}(\mathsf{Union}-\mathsf{DirectAccess}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{FieldAccess}(e,\ f)\ \Uparrow \ c
\end{array}
$$

Union matching and propagation are defined by §§16.8 and 17.5.

### 12.8.5 Dynamic Semantics

$$
\begin{array}{l}
\mathsf{UnionCaseJudg}\ =\ \{\operatorname{UnionCase}(v)\ =\ \langle T,\ v_{T}\rangle \} \\
\operatorname{UnionCase}(v)\ =\ \langle T,\ v_{T}\rangle \ \Leftrightarrow \ \exists \ U,\ \mathsf{bits}.\ \operatorname{ValueBits}(\operatorname{TypeUnion}(U),\ v)\ =\ \mathsf{bits}\ \land \ \operatorname{UnionBits}(U,\ T,\ v_{T})\ =\ \mathsf{bits}
\end{array}
$$

### 12.8.6 Lowering

$$
\begin{array}{l}
\operatorname{PathOrderKey}(p)\ =\ \langle \operatorname{Fold}(p),\ p\rangle  \\
\operatorname{BitsToUInt}(\mathsf{bits})\ =\ v\ \Leftrightarrow \ \operatorname{LEBytes}(v,\ \mid \mathsf{bits}\mid )\ =\ \mathsf{bits} \\
\mathsf{bits}_{1}\ \prec_{u} \ \mathsf{bits}_{2}\ \Leftrightarrow \ \exists \ v_{1},\ v_{2}.\ \operatorname{BitsToUInt}(\mathsf{bits}_{1})\ =\ v_{1}\ \land \ \operatorname{BitsToUInt}(\mathsf{bits}_{2})\ =\ v_{2}\ \land \ v_{1}\ <\ v_{2} \\
\operatorname{NicheOrder}(T)\ =\ \mathsf{sort}\_\{\prec_{u} \}(\operatorname{NicheSet}(T)) \\
\operatorname{NicheCount}(T)\ =\ \mid \operatorname{NicheSet}(T)\mid  \\
\operatorname{TagKey}(\texttt{prim})\ =\ 0 \\
\operatorname{TagKey}(\texttt{tuple})\ =\ 1 \\
\operatorname{TagKey}(\texttt{array})\ =\ 2 \\
\operatorname{TagKey}(\texttt{slice})\ =\ 3 \\
\operatorname{TagKey}(\texttt{func})\ =\ 4 \\
\operatorname{TagKey}(\texttt{path})\ =\ 5 \\
\operatorname{TagKey}(\texttt{modal\_state})\ =\ 6 \\
\operatorname{TagKey}(\texttt{string})\ =\ 7 \\
\operatorname{TagKey}(\texttt{bytes})\ =\ 8 \\
\operatorname{TagKey}(\texttt{dynamic})\ =\ 9 \\
\operatorname{TagKey}(\texttt{ptr})\ =\ 10 \\
\operatorname{TagKey}(\texttt{rawptr})\ =\ 11 \\
\operatorname{TagKey}(\texttt{union})\ =\ 12 \\
\operatorname{TagKey}(\texttt{perm})\ =\ 13 \\
\operatorname{TagKey}(\texttt{range})\ =\ 14
\end{array}
$$

$$
\begin{array}{l}
\operatorname{PermKey}(\texttt{const})\ =\ 0 \\
\operatorname{PermKey}(\texttt{unique})\ =\ 1 \\
\operatorname{PtrStateKey}(\bot )\ =\ 0 \\
\operatorname{PtrStateKey}(\texttt{Valid})\ =\ 1 \\
\operatorname{PtrStateKey}(\texttt{Null})\ =\ 2 \\
\operatorname{PtrStateKey}(\texttt{Expired})\ =\ 3 \\
\operatorname{QualKey}(\texttt{imm})\ =\ 0 \\
\operatorname{QualKey}(\texttt{mut})\ =\ 1 \\
\operatorname{ModeKey}(\bot )\ =\ 0 \\
\operatorname{ModeKey}(\texttt{move})\ =\ 1 \\
\operatorname{StateKey}(\texttt{View})\ =\ 0 \\
\operatorname{StateKey}(\texttt{Managed})\ =\ 1 \\
\operatorname{StateKey}(\bot )\ =\ 2
\end{array}
$$

$$
\begin{array}{l}
\operatorname{TypeKey}(\operatorname{TypePrim}(\mathsf{name}))\ =\ \langle \operatorname{TagKey}(\texttt{prim}),\ \mathsf{name}\rangle  \\
\operatorname{TypeKey}(\operatorname{TypeRange}(T))\ =\ \langle \operatorname{TagKey}(\texttt{range}),\ 0,\ \operatorname{TypeKey}(T)\rangle  \\
\operatorname{TypeKey}(\operatorname{TypeRangeInclusive}(T))\ =\ \langle \operatorname{TagKey}(\texttt{range}),\ 1,\ \operatorname{TypeKey}(T)\rangle  \\
\operatorname{TypeKey}(\operatorname{TypeRangeFrom}(T))\ =\ \langle \operatorname{TagKey}(\texttt{range}),\ 2,\ \operatorname{TypeKey}(T)\rangle  \\
\operatorname{TypeKey}(\operatorname{TypeRangeTo}(T))\ =\ \langle \operatorname{TagKey}(\texttt{range}),\ 3,\ \operatorname{TypeKey}(T)\rangle  \\
\operatorname{TypeKey}(\operatorname{TypeRangeToInclusive}(T))\ =\ \langle \operatorname{TagKey}(\texttt{range}),\ 4,\ \operatorname{TypeKey}(T)\rangle  \\
\operatorname{TypeKey}(\mathsf{TypeRangeFull})\ =\ \langle \operatorname{TagKey}(\texttt{range}),\ 5\rangle  \\
\operatorname{TypeKey}(\operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}]))\ =\ \langle \operatorname{TagKey}(\texttt{tuple}),\ n,\ \operatorname{TypeKey}(T_{1}),\ \ldots ,\ \operatorname{TypeKey}(T_{n})\rangle  \\
\operatorname{TypeKey}(\operatorname{TypeArray}(T,\ e))\ =\ \langle \operatorname{TagKey}(\texttt{array}),\ \operatorname{TypeKey}(T),\ \operatorname{ArrayLen}(e)\rangle  \\
\operatorname{TypeKey}(\operatorname{TypeSlice}(T))\ =\ \langle \operatorname{TagKey}(\texttt{slice}),\ \operatorname{TypeKey}(T)\rangle  \\
\operatorname{TypeKey}(\operatorname{TypeFunc}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ],\ R))\ =\ \langle \operatorname{TagKey}(\texttt{func}),\ n,\ \operatorname{ModeKey}(m_{1}),\ \operatorname{TypeKey}(T_{1}),\ \ldots ,\ \operatorname{ModeKey}(m_{n}),\ \operatorname{TypeKey}(T_{n}),\ \operatorname{TypeKey}(R)\rangle  \\
\operatorname{TypeKey}(\operatorname{TypePath}(p))\ =\ \langle \operatorname{TagKey}(\texttt{path}),\ \operatorname{PathOrderKey}(p)\rangle  \\
\operatorname{TypeKey}(\operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S))\ =\ \langle \operatorname{TagKey}(\texttt{modal\_state}),\ \operatorname{PathOrderKey}(\operatorname{ModalRefPath}(\mathsf{modal}_{\mathsf{ref}})),\ S\rangle  \\
\operatorname{TypeKey}(\operatorname{TypeString}(\mathsf{st}))\ =\ \langle \operatorname{TagKey}(\texttt{string}),\ \operatorname{StateKey}(\mathsf{st})\rangle  \\
\operatorname{TypeKey}(\operatorname{TypeBytes}(\mathsf{st}))\ =\ \langle \operatorname{TagKey}(\texttt{bytes}),\ \operatorname{StateKey}(\mathsf{st})\rangle  \\
\operatorname{TypeKey}(\operatorname{TypeDynamic}(p))\ =\ \langle \operatorname{TagKey}(\texttt{dynamic}),\ \operatorname{PathOrderKey}(p)\rangle  \\
\operatorname{TypeKey}(\operatorname{TypePtr}(T,\ s))\ =\ \langle \operatorname{TagKey}(\texttt{ptr}),\ \operatorname{PtrStateKey}(s),\ \operatorname{TypeKey}(T)\rangle  \\
\operatorname{TypeKey}(\operatorname{TypeRawPtr}(q,\ T))\ =\ \langle \operatorname{TagKey}(\texttt{rawptr}),\ \operatorname{QualKey}(q),\ \operatorname{TypeKey}(T)\rangle  \\
\operatorname{TypeKey}(\operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}]))\ =\ \langle \operatorname{TagKey}(\texttt{union}),\ \operatorname{Sort}([\operatorname{TypeKey}(T_{1}),\ \ldots ,\ \operatorname{TypeKey}(T_{n})])\rangle  \\
\operatorname{TypeKey}(\operatorname{TypePerm}(p,\ T))\ =\ \langle \operatorname{TagKey}(\texttt{perm}),\ \operatorname{PermKey}(p),\ \operatorname{TypeKey}(T)\rangle 
\end{array}
$$

$$
\begin{array}{l}
\mathsf{Key}\ =\ \{\ \operatorname{TypeKey}(T)\ \mid \ T\ \in \ \mathsf{Type}\ \} \\
\mathsf{KeyList}\ =\ \{\ [k_{1},\ \ldots ,\ k_{n}]\ \mid \ \forall \ i.\ k_{i}\ \in \ \mathsf{Key}\ \} \\
a\ \prec \_\{\mathsf{atom}\}\ b\ \Leftrightarrow \ (a,\ b\ \in \ \mathbb{N} \ \land \ a\ <\ b)\ \lor \ (a,\ b\ \in \ \mathsf{String}\ \land \ \operatorname{Utf8LexLess}(a,\ b))\ \lor \ (a,\ b\ \in \ \mathsf{Key}\ \land \ a\ \prec \_\{\mathsf{key}\}\ b)\ \lor \ (a,\ b\ \in \ \mathsf{KeyList}\ \land \ a\ \prec \_\{\mathsf{keylist}\}\ b) \\
\mathsf{LexLess}\_\{\prec \}(L_{1},\ L_{2})\ \Leftrightarrow \ (\exists \ k.\ 0\ \le \ k\ <\ \mid L_{1}\mid \ \land \ 0\ \le \ k\ <\ \mid L_{2}\mid \ \land \ (\forall \ i.\ 0\ \le \ i\ <\ k\ \Rightarrow \ L_{1}[i]\ =\ L_{2}[i])\ \land \ L_{1}[k]\ \prec \ L_{2}[k])\ \lor \ (\mid L_{1}\mid \ <\ \mid L_{2}\mid \ \land \ \forall \ i.\ 0\ \le \ i\ <\ \mid L_{1}\mid \ \Rightarrow \ L_{1}[i]\ =\ L_{2}[i]) \\
k_{1}\ \prec \_\{\mathsf{key}\}\ k_{2}\ \Leftrightarrow \ \mathsf{LexLess}\_\{\prec \_\{\mathsf{atom}\}\}(k_{1},\ k_{2}) \\
L_{1}\ \prec \_\{\mathsf{keylist}\}\ L_{2}\ \Leftrightarrow \ \mathsf{LexLess}\_\{\prec \_\{\mathsf{key}\}\}(L_{1},\ L_{2}) \\
\mathsf{Sorted}\_\{\prec \}(L)\ \Leftrightarrow \ \forall \ i,\ j.\ 0\ \le \ i\ <\ j\ <\ \mid L\mid \ \Rightarrow \ \lnot (L[j]\ \prec \ L[i]) \\
\operatorname{Sort}(L)\ =\ L'\ \Leftrightarrow \ \operatorname{Permutation}(L',\ L)\ \land \ \mathsf{Sorted}\_\{\prec \_\{\mathsf{key}\}\}(L') \\
T_{1}\ \prec \_\{\mathsf{type}\}\ T_{2}\ \Leftrightarrow \ \operatorname{TypeKey}(T_{1})\ \prec \_\{\mathsf{key}\}\ \operatorname{TypeKey}(T_{2})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{MemberList}(U)\ =\ \operatorname{Sort}(\operatorname{Members}(U)) \\
\operatorname{MemberIndex}(U,\ T)\ =\ i\ \Leftrightarrow \ \operatorname{MemberList}(U)[i]\ \equiv \ T \\
\operatorname{UnionDiscValue}(U,\ T)\ =\ i\ \Leftrightarrow \ \operatorname{MemberIndex}(U,\ T)\ =\ i \\
\operatorname{EmptyMember}(T)\ \Leftrightarrow \ T\ \equiv \ \operatorname{TypePrim}(\texttt{"()"}) \\
\operatorname{EmptyList}(U)\ =\ [\operatorname{MemberList}(U)[i]\ \mid \ 0\ \le \ i\ <\ \mid \operatorname{MemberList}(U)\mid \ \land \ \operatorname{EmptyMember}(\operatorname{MemberList}(U)[i])] \\
\operatorname{PayloadMember}(U)\ =\ T_{p}\ \Leftrightarrow \ \exists \ j.\ \operatorname{MemberList}(U)[j]\ \equiv \ T_{p}\ \land \ \operatorname{NicheCount}(T_{p})\ >\ 0\ \land \ (\forall \ i.\ 0\ \le \ i\ <\ \mid \operatorname{MemberList}(U)\mid \ \land \ i\ \ne \ j\ \Rightarrow \ \operatorname{EmptyMember}(\operatorname{MemberList}(U)[i]))\ \land \ \operatorname{NicheCount}(T_{p})\ \ge \ \mid \operatorname{MemberList}(U)\mid \ -\ 1 \\
\operatorname{NicheApplies}(U)\ \Leftrightarrow \ \exists \ T_{p}.\ \operatorname{PayloadMember}(U)\ =\ T_{p}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{UnionDiscType}(U)\ =\ \operatorname{DiscType}(k)\quad \mathsf{where}\ k\ =\ \mid \operatorname{MemberList}(U)\mid \ -\ 1 \\
\operatorname{PayloadSize}(U)\ =\ \mathsf{max}\_\{T\ \in \ \operatorname{MemberList}(U)\}(\operatorname{sizeof}(T)) \\
\operatorname{PayloadAlign}(U)\ =\ \mathsf{max}\_\{T\ \in \ \operatorname{MemberList}(U)\}(\operatorname{alignof}(T)) \\
\operatorname{UnionAlign}(U)\ =\ \operatorname{max}(\operatorname{alignof}(\operatorname{UnionDiscType}(U)),\ \operatorname{PayloadAlign}(U)) \\
\operatorname{UnionSize}(U)\ =\ \operatorname{AlignUp}(\operatorname{sizeof}(\operatorname{UnionDiscType}(U))\ +\ \operatorname{PayloadSize}(U),\ \operatorname{UnionAlign}(U)) \\
\mathsf{UnionLayoutJudg}\ =\ \{\mathsf{UnionLayout}\}
\end{array}
$$

**(Layout-Union-Niche)**

$$
\begin{array}{l}
\operatorname{NicheApplies}(U)\quad \operatorname{PayloadMember}(U)\ =\ T_{p}\quad \Gamma \ \vdash \ \operatorname{layout}(T_{p})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{UnionLayout}(U)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \bot ,\ \operatorname{layout}(T_{p})\rangle 
\end{array}
$$

**(Layout-Union-Tagged)**

$$
\begin{array}{l}
\lnot \ \operatorname{NicheApplies}(U)\quad \mathsf{size}\ =\ \operatorname{UnionSize}(U)\quad \mathsf{align}\ =\ \operatorname{UnionAlign}(U) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{UnionLayout}(U)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \operatorname{UnionDiscType}(U),\ \operatorname{PayloadSize}(U)\rangle 
\end{array}
$$

**(Size-Union)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad \operatorname{UnionLayout}(T)\ \Downarrow \ \langle \mathsf{size},\ \_,\ \_,\ \_\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ \mathsf{size}
\end{array}
$$

**(Align-Union)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad \operatorname{UnionLayout}(T)\ \Downarrow \ \langle \_,\ \mathsf{align},\ \_,\ \_\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{align}
\end{array}
$$

**(Layout-Union)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad \operatorname{UnionLayout}(T)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_,\ \_\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{UnionNicheBits}(U,\ T,\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ \operatorname{NicheApplies}(U)\ \land \ \operatorname{PayloadMember}(U)\ =\ T_{p}\ \land \ ((T\ \equiv \ T_{p}\ \land \ \operatorname{ValueBits}(T_{p},\ v)\ =\ \mathsf{bits}\ \land \ \mathsf{bits}\ \notin \ \operatorname{NicheSet}(T_{p}))\ \lor \ (\exists \ i.\ \operatorname{EmptyList}(U)[i]\ \equiv \ T\ \land \ v\ =\ ()\ \land \ \operatorname{NicheOrder}(T_{p})[i]\ =\ \mathsf{bits})) \\
\operatorname{PayloadBits}(U,\ T,\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ \operatorname{ValueBits}(T,\ v)\ =\ b\ \land \ \mid \mathsf{bits}\mid \ =\ \operatorname{PayloadSize}(U)\ \land \ \mathsf{bits}[0..\mid b\mid )\ =\ b \\
\operatorname{TaggedBits}(\mathsf{disc}_{\mathsf{bits}},\ \mathsf{payload}_{\mathsf{bits}},\ \mathsf{disc}_{\mathsf{size}},\ \mathsf{payload}_{\mathsf{size}},\ \mathsf{payload}_{\mathsf{align}},\ \mathsf{size})\ =\ \mathsf{bits}\ \Leftrightarrow \ \mid \mathsf{bits}\mid \ =\ \mathsf{size}\ \land \ \mathsf{payload}_{\mathsf{off}}\ =\ \operatorname{AlignUp}(\mathsf{disc}_{\mathsf{size}},\ \mathsf{payload}_{\mathsf{align}})\ \land \ \mathsf{bits}[0..\mathsf{disc}_{\mathsf{size}})\ =\ \mathsf{disc}_{\mathsf{bits}}\ \land \ \mathsf{bits}[\mathsf{payload}_{\mathsf{off}}..\mathsf{payload}_{\mathsf{off}}\ +\ \mathsf{payload}_{\mathsf{size}})\ =\ \mathsf{payload}_{\mathsf{bits}}
\end{array}
$$

**Informative.** TaggedBits constrains only the discriminant and payload ranges; bytes outside those ranges are unconstrained.

$$
\begin{array}{l}
\operatorname{UnionTaggedBits}(U,\ T,\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ \lnot \ \operatorname{NicheApplies}(U)\ \land \ \operatorname{UnionDiscType}(U)\ =\ D\ \land \ \operatorname{UnionDiscValue}(U,\ T)\ =\ d\ \land \ \operatorname{ValueBits}(D,\ d)\ =\ \mathsf{disc}_{\mathsf{bits}}\ \land \ \operatorname{PayloadBits}(U,\ T,\ v)\ =\ \mathsf{payload}_{\mathsf{bits}}\ \land \ \operatorname{TaggedBits}(\mathsf{disc}_{\mathsf{bits}},\ \mathsf{payload}_{\mathsf{bits}},\ \operatorname{sizeof}(D),\ \operatorname{PayloadSize}(U),\ \operatorname{PayloadAlign}(U),\ \operatorname{UnionSize}(U))\ =\ \mathsf{bits} \\
\operatorname{UnionBits}(U,\ T,\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ \operatorname{UnionNicheBits}(U,\ T,\ v)\ =\ \mathsf{bits}\ \lor \ \operatorname{UnionTaggedBits}(U,\ T,\ v)\ =\ \mathsf{bits} \\
\operatorname{ValueBits}(\operatorname{TypeUnion}(U),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ \exists \ T.\ \operatorname{Member}(T,\ \operatorname{TypeUnion}(U))\ \land \ \operatorname{UnionBits}(U,\ T,\ v)\ =\ \mathsf{bits} \\
\operatorname{ValueType}(v)\ =\ U\ \Leftrightarrow \ \exists \ T.\ \operatorname{ValueType}(v)\ =\ T\ \land \ \operatorname{Member}(T,\ U)
\end{array}
$$

### 12.8.7 Diagnostics

Diagnostics are defined for unions with fewer than two member types and for direct field access on union values without prior refinement or pattern matching. Exhaustiveness diagnostics for union `if ... is { ... }` case analysis are defined by §17.6.

## 12.9 Type Aliases

### 12.9.1 Syntax

```text
type_alias_decl ::= attribute_list? visibility? "type" identifier generic_params? predicate_clause? "=" type
```

### 12.9.2 Parsing

**(Parse-Type-Alias)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{type})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseGenericParamsOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParsePredicateClauseOpt}(P_{3})\ \Downarrow \ (P_{4},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}})\quad \operatorname{IsOp}(\operatorname{Tok}(P_{4}),\ \texttt{"="})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P_{4}))\ \Downarrow \ (P_{5},\ \mathsf{ty}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseItem}(P)\ \Downarrow \ (P_{5},\ \langle \mathsf{TypeAliasDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{ty},\ \operatorname{SpanBetween}(P,\ P_{5}),\ []\rangle )
\end{array}
$$

### 12.9.3 AST Representation / Form

$$
\mathsf{TypeAliasDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{type},\ \mathsf{span},\ \mathsf{doc}\rangle 
$$

$$
\begin{array}{l}
\operatorname{AliasBody}(p)\ =\ \mathsf{ty}\ \Leftrightarrow \ \Sigma .\mathsf{Types}[p]\ =\ \operatorname{TypeAliasDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{ty},\ \mathsf{span},\ \mathsf{doc}) \\
\operatorname{AliasParams}(p)\ =\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}}\ \Leftrightarrow \ \Sigma .\mathsf{Types}[p]\ =\ \operatorname{TypeAliasDecl}(\_,\ \_,\ \_,\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \_,\ \_,\ \_,\ \_) \\
\operatorname{AliasPredicateClause}(p)\ =\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}\ \Leftrightarrow \ \Sigma .\mathsf{Types}[p]\ =\ \operatorname{TypeAliasDecl}(\_,\ \_,\ \_,\ \_,\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \_,\ \_,\ \_)
\end{array}
$$

### 12.9.4 Static Semantics

**(Bind-TypeAlias)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ItemBindings}(\operatorname{TypeAliasDecl}(\_,\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_,\ \_),\ p)\ \Downarrow \ [(\mathsf{name},\ \langle \mathsf{Type},\ p,\ \bot ,\ \mathsf{Decl}\rangle )]
\end{array}
$$

**(ResolveItem-TypeAlias)**

$$
\begin{array}{l}
S_{\mathsf{gen}}\ =\ \operatorname{TypeParamBindings}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \Gamma_{g} \ =\ [S_{\mathsf{gen}},\ S_{\mathsf{module}},\ S_{\mathsf{universe}}]\quad \Gamma_{g} \ \vdash \ \operatorname{ResolveGenericParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\ \Downarrow \ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}}'\quad \Gamma_{g} \ \vdash \ \operatorname{ResolvePredicateClauseOpt}(\mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}})\ \Downarrow \ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}'\quad \Gamma_{g} \ \vdash \ \operatorname{ResolveType}(\mathsf{ty})\ \Downarrow \ \mathsf{ty}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveItem}(\operatorname{TypeAliasDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{ty},\ \mathsf{span},\ \mathsf{doc}))\ \Downarrow \ \operatorname{TypeAliasDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}}',\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}',\ \mathsf{ty}',\ \mathsf{span},\ \mathsf{doc})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{AliasStep}(\operatorname{TypePath}(p))\ =\ \operatorname{AliasBody}(p)\ \mathsf{if}\ \mathsf{defined};\ \mathsf{otherwise}\ \operatorname{TypePath}(p) \\
\operatorname{AliasStep}(T)\ =\ T\ \mathsf{if}\ T\ \notin \ \{\operatorname{TypePath}(p)\} \\
\operatorname{AliasNorm}(T)\ = \\
\ \operatorname{TypePerm}(\mathsf{perm},\ \operatorname{AliasNorm}(\mathsf{base}))\ \mathsf{if}\ T\ =\ \operatorname{TypePerm}(\mathsf{perm},\ \mathsf{base}) \\
\ \operatorname{TypeTuple}([\operatorname{AliasNorm}(t)\ \mid \ t\ \in \ \mathsf{elems}])\ \mathsf{if}\ T\ =\ \operatorname{TypeTuple}(\mathsf{elems}) \\
\ \operatorname{TypeArray}(\operatorname{AliasNorm}(\mathsf{elem}),\ \mathsf{size}_{\mathsf{expr}})\ \mathsf{if}\ T\ =\ \operatorname{TypeArray}(\mathsf{elem},\ \mathsf{size}_{\mathsf{expr}}) \\
\ \operatorname{TypeSlice}(\operatorname{AliasNorm}(\mathsf{elem}))\ \mathsf{if}\ T\ =\ \operatorname{TypeSlice}(\mathsf{elem}) \\
\ \operatorname{TypeUnion}([\operatorname{AliasNorm}(t)\ \mid \ t\ \in \ \mathsf{members}])\ \mathsf{if}\ T\ =\ \operatorname{TypeUnion}(\mathsf{members}) \\
\ \operatorname{TypeFunc}([\langle m,\ \operatorname{AliasNorm}(t)\rangle \ \mid \ \langle m,\ t\rangle \ \in \ \mathsf{params}],\ \operatorname{AliasNorm}(\mathsf{ret}))\ \mathsf{if}\ T\ =\ \operatorname{TypeFunc}(\mathsf{params},\ \mathsf{ret}) \\
\ \operatorname{TypeApply}(\operatorname{AliasPath}(\mathsf{path}),\ [\operatorname{AliasNorm}(t)\ \mid \ t\ \in \ \mathsf{args}])\ \mathsf{if}\ T\ =\ \operatorname{TypeApply}(\mathsf{path},\ \mathsf{args}) \\
\ \operatorname{TypeDynamic}(\operatorname{AliasPath}(\mathsf{path}))\ \mathsf{if}\ T\ =\ \operatorname{TypeDynamic}(\mathsf{path}) \\
\ \operatorname{TypeOpaque}(\operatorname{AliasPath}(\mathsf{path}))\ \mathsf{if}\ T\ =\ \operatorname{TypeOpaque}(\mathsf{path}) \\
\ \operatorname{TypeModalState}(\operatorname{AliasModalRef}(\mathsf{modal}_{\mathsf{ref}}),\ \mathsf{state})\ \mathsf{if}\ T\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ \mathsf{state}) \\
\ \operatorname{TypePtr}(\operatorname{AliasNorm}(\mathsf{elem}),\ \mathsf{ptr}_{\mathsf{state}\_\mathsf{opt}})\ \mathsf{if}\ T\ =\ \operatorname{TypePtr}(\mathsf{elem},\ \mathsf{ptr}_{\mathsf{state}\_\mathsf{opt}}) \\
\ \operatorname{TypeRawPtr}(\mathsf{qual},\ \operatorname{AliasNorm}(\mathsf{elem}))\ \mathsf{if}\ T\ =\ \operatorname{TypeRawPtr}(\mathsf{qual},\ \mathsf{elem}) \\
\ \operatorname{TypeRange}(\operatorname{AliasNorm}(\mathsf{base}))\ \mathsf{if}\ T\ =\ \operatorname{TypeRange}(\mathsf{base}) \\
\ \operatorname{TypeRangeInclusive}(\operatorname{AliasNorm}(\mathsf{base}))\ \mathsf{if}\ T\ =\ \operatorname{TypeRangeInclusive}(\mathsf{base}) \\
\ \operatorname{TypeRangeFrom}(\operatorname{AliasNorm}(\mathsf{base}))\ \mathsf{if}\ T\ =\ \operatorname{TypeRangeFrom}(\mathsf{base}) \\
\ \operatorname{TypeRangeTo}(\operatorname{AliasNorm}(\mathsf{base}))\ \mathsf{if}\ T\ =\ \operatorname{TypeRangeTo}(\mathsf{base}) \\
\ \operatorname{TypeRangeToInclusive}(\operatorname{AliasNorm}(\mathsf{base}))\ \mathsf{if}\ T\ =\ \operatorname{TypeRangeToInclusive}(\mathsf{base}) \\
\ \operatorname{TypeRefine}(\operatorname{AliasNorm}(\mathsf{base}),\ \mathsf{pred})\ \mathsf{if}\ T\ =\ \operatorname{TypeRefine}(\mathsf{base},\ \mathsf{pred}) \\
\ \operatorname{AliasNorm}(\operatorname{AliasStep}(T))\ \mathsf{if}\ T\ =\ \operatorname{TypePath}(p) \\
\ T\ \mathsf{otherwise} \\
\operatorname{AliasPath}(p)\ =\ p\ \mathsf{if}\ \operatorname{AliasBody}(p)\ \mathsf{undefined} \\
\operatorname{AliasPath}(p)\ =\ \operatorname{AliasPath}(p')\ \mathsf{if}\ \operatorname{AliasBody}(p)\ =\ \operatorname{TypePath}(p') \\
\operatorname{AliasModalRef}(\operatorname{TypePath}(p))\ =\ \operatorname{TypePath}(\operatorname{AliasPath}(p)) \\
\operatorname{AliasModalRef}(\operatorname{TypeApply}(p,\ \mathsf{args}))\ =\ \operatorname{TypeApply}(\operatorname{AliasPath}(p),\ [\operatorname{AliasNorm}(t)\ \mid \ t\ \in \ \mathsf{args}]) \\
\operatorname{AliasTransparent}(T,\ U)\ \Leftrightarrow \ \operatorname{AliasNorm}(T)\ =\ \operatorname{AliasNorm}(U) \\
\mathsf{AliasGraph}\ =\ \{\ \langle p,\ q\rangle \ \mid \ \operatorname{AliasBody}(p)\ =\ T\ \land \ q\ \in \ \operatorname{TypePaths}(T)\ \} \\
\operatorname{TypePaths}(\operatorname{TypePrim}(\_))\ =\ \emptyset  \\
\operatorname{TypePaths}(\operatorname{TypeRange}(\mathsf{base}))\ =\ \operatorname{TypePaths}(\mathsf{base}) \\
\operatorname{TypePaths}(\operatorname{TypeRangeInclusive}(\mathsf{base}))\ =\ \operatorname{TypePaths}(\mathsf{base}) \\
\operatorname{TypePaths}(\operatorname{TypeRangeFrom}(\mathsf{base}))\ =\ \operatorname{TypePaths}(\mathsf{base}) \\
\operatorname{TypePaths}(\operatorname{TypeRangeTo}(\mathsf{base}))\ =\ \operatorname{TypePaths}(\mathsf{base}) \\
\operatorname{TypePaths}(\operatorname{TypeRangeToInclusive}(\mathsf{base}))\ =\ \operatorname{TypePaths}(\mathsf{base}) \\
\operatorname{TypePaths}(\mathsf{TypeRangeFull})\ =\ \emptyset  \\
\operatorname{TypePaths}(\operatorname{TypePerm}(\_,\ T))\ =\ \operatorname{TypePaths}(T) \\
\operatorname{TypePaths}(\operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}]))\ =\ \bigcup \_\{i=1\}^n\ \operatorname{TypePaths}(T_{i}) \\
\operatorname{TypePaths}(\operatorname{TypeArray}(T,\ \_))\ =\ \operatorname{TypePaths}(T) \\
\operatorname{TypePaths}(\operatorname{TypeSlice}(T))\ =\ \operatorname{TypePaths}(T) \\
\operatorname{TypePaths}(\operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}]))\ =\ \bigcup \_\{i=1\}^n\ \operatorname{TypePaths}(T_{i}) \\
\operatorname{TypePaths}(\operatorname{TypeFunc}([\langle \_,\ T_{1}\rangle ,\ \ldots ,\ \langle \_,\ T_{n}\rangle ],\ R))\ =\ (\bigcup \_\{i=1\}^n\ \operatorname{TypePaths}(T_{i}))\ \cup \ \operatorname{TypePaths}(R) \\
\operatorname{TypePaths}(\operatorname{TypeApply}(p,\ \mathsf{args}))\ =\ \{p\}\ \cup \ (\bigcup \_\{t\ \in \ \mathsf{args}\}\ \operatorname{TypePaths}(t)) \\
\operatorname{TypePaths}(\operatorname{TypePtr}(T,\ \_))\ =\ \operatorname{TypePaths}(T) \\
\operatorname{TypePaths}(\operatorname{TypeRawPtr}(\_,\ T))\ =\ \operatorname{TypePaths}(T) \\
\operatorname{TypePaths}(\operatorname{TypeString}(\_))\ =\ \emptyset  \\
\operatorname{TypePaths}(\operatorname{TypeBytes}(\_))\ =\ \emptyset  \\
\operatorname{TypePaths}(\operatorname{TypeDynamic}(p))\ =\ \{p\} \\
\operatorname{TypePaths}(\operatorname{TypeOpaque}(p))\ =\ \{p\} \\
\operatorname{TypePaths}(\operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ \_))\ =\ \operatorname{TypePathsOfModalRef}(\mathsf{modal}_{\mathsf{ref}}) \\
\operatorname{TypePaths}(\operatorname{TypePath}(p))\ =\ \{p\} \\
\operatorname{TypePaths}(\operatorname{TypeRefine}(\mathsf{base},\ \_))\ =\ \operatorname{TypePaths}(\mathsf{base}) \\
\operatorname{TypePathsOfModalRef}(\operatorname{TypePath}(p))\ =\ \{p\} \\
\operatorname{TypePathsOfModalRef}(\operatorname{TypeApply}(p,\ \mathsf{args}))\ =\ \{p\}\ \cup \ (\bigcup \_\{t\ \in \ \mathsf{args}\}\ \operatorname{TypePaths}(t))
\end{array}
$$

$$
\operatorname{AliasCycle}(p)\ \Leftrightarrow \ p\ \in \ \mathsf{Reach}^+(\mathsf{AliasGraph},\ p)
$$

$$
\begin{array}{l}
\Sigma .\mathsf{Types}[p]\ =\ \operatorname{TypeAliasDecl}(\_,\ \_,\ \_,\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{ty},\ \_,\ \_)\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \mathsf{params}_{\mathsf{gen}}\ =\ [P_{1},\ \ldots ,\ P_{n}]\quad \Gamma \ \vdash \ \langle P_{1};\ \ldots ;\ P_{n}\rangle \ \mathsf{wf}\quad \Gamma_{g} \ =\ \operatorname{BindTypeParams}(\Gamma ,\ \mathsf{params}_{\mathsf{gen}})\quad \Gamma_{g} ;\ \mathsf{params}_{\mathsf{gen}}\ \vdash \ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}\ \mathsf{wf}\quad \Gamma_{g} \ \vdash \ \mathsf{ty}\ \mathsf{wf}\quad \lnot \ \operatorname{AliasCycle}(p) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ p\ :\ \mathsf{TypeAliasOk}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{AliasCycle}(p)\quad c\ =\ \operatorname{Code}(\mathsf{TypeAlias}-\mathsf{Reultraviolet}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ p\ :\ \mathsf{TypeAliasOk}\ \Uparrow \ c
\end{array}
$$

### 12.9.5 Dynamic Semantics

Type aliases introduce no distinct runtime values. Dynamic semantics use the alias body after alias normalization.

### 12.9.6 Lowering

**(Size-Alias)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{AliasBody}(p)\ =\ \mathsf{ty}\quad \Gamma \ \vdash \ \operatorname{sizeof}(\mathsf{ty})\ =\ \mathsf{size} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ \mathsf{size}
\end{array}
$$

**(Align-Alias)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{AliasBody}(p)\ =\ \mathsf{ty}\quad \Gamma \ \vdash \ \operatorname{alignof}(\mathsf{ty})\ =\ \mathsf{align} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{align}
\end{array}
$$

**(Layout-Alias)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{AliasBody}(p)\ =\ \mathsf{ty}\quad \Gamma \ \vdash \ \operatorname{layout}(\mathsf{ty})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

$$
\operatorname{ValueBits}(\operatorname{TypePath}(p),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ \operatorname{AliasBody}(p)\ =\ \mathsf{ty}\ \land \ \operatorname{ValueBits}(\mathsf{ty},\ v)\ =\ \mathsf{bits}
$$

### 12.9.7 Diagnostics

Diagnostics are defined for reultraviolet type aliases. Generic-argument count and bound failures for alias applications are defined by the shared type-application rules in Chapter 14.

## 12.10 Data Type Diagnostics Supplement

This section owns diagnostics for array, slice, and union data-type rules that are shared across the Chapter 12 type forms.

| Code         | Severity | Detection    | Condition                                             |
| ------------ | -------- | ------------ | ----------------------------------------------------- |
| `E-TYP-1810` | Error    | Compile-time | Array length is not a compile-time constant           |
| `E-TYP-1812` | Error    | Compile-time | Array index expression has non-`usize` type           |
| `E-TYP-1820` | Error    | Compile-time | Slice index expression has non-`usize` type           |
| `E-TYP-2201` | Error    | Compile-time | Union type has fewer than two member types            |
| `E-TYP-2202` | Error    | Compile-time | Direct access on union value without pattern matching |
