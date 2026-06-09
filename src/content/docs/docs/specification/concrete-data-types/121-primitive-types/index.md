---
title: "12.1 Primitive Types"
description: "12.1 Primitive Types from 12. Concrete Data Types of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "concrete-data-types"
specSection: "121-primitive-types"
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
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \operatorname{Lexeme}(\operatorname{Tok}(P))\ \in \ \mathsf{PrimLexemeSet} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseNonPermType}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \operatorname{TypePrim}(\operatorname{Lexeme}(\operatorname{Tok}(P))))
\end{array}
$$

**(Parse-Unit-Type)**
IsPunc(Tok(P), "(")    IsPunc(Tok(Advance(P)), ")")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseNonPermType}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P)),\ \operatorname{TypePrim}(\texttt{"()"}))
\end{array}
$$

**(Parse-Never-Type)**
IsOp(Tok(P), "!")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
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
\mathsf{IntTypes}\ =\ \{\texttt{i8},\ \texttt{i16},\ \texttt{i32},\ \texttt{i64},\ \texttt{i128},\ \texttt{u8},\ \texttt{u16},\ \texttt{u32},\ \texttt{u64},\ \texttt{u128},\ \texttt{isize},\ \texttt{usize}\} \\[0.16em]
\mathsf{FloatTypes}\ =\ \{\texttt{f16},\ \texttt{f32},\ \texttt{f64}\} \\[0.16em]
\mathsf{SignedIntTypes}\ =\ \{\texttt{i8},\ \texttt{i16},\ \texttt{i32},\ \texttt{i64},\ \texttt{i128},\ \texttt{isize}\} \\[0.16em]
\mathsf{UnsignedIntTypes}\ =\ \{\texttt{u8},\ \texttt{u16},\ \texttt{u32},\ \texttt{u64},\ \texttt{u128},\ \texttt{usize}\} \\[0.16em]
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
T\ =\ \operatorname{TypePrim}(\mathsf{name})\quad \mathsf{name}\ \in \ \{\texttt{i8},\ \texttt{i16},\ \texttt{i32},\ \texttt{i64},\ \texttt{i128},\ \texttt{isize},\ \texttt{u8},\ \texttt{u16},\ \texttt{u32},\ \texttt{u64},\ \texttt{u128},\ \texttt{usize},\ \texttt{f16},\ \texttt{f32},\ \texttt{f64},\ \texttt{bool},\ \texttt{char},\ \texttt{()},\ \texttt{!}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{FloatFormat}(\texttt{"f16"})\ =\ \texttt{binary16}\quad \operatorname{FloatFormat}(\texttt{"f32"})\ =\ \texttt{binary32}\quad \operatorname{FloatFormat}(\texttt{"f64"})\ =\ \texttt{binary64} \\[0.16em]
\operatorname{FloatBitWidth}(\texttt{"f16"})\ =\ 16\quad \operatorname{FloatBitWidth}(\texttt{"f32"})\ =\ 32\quad \operatorname{FloatBitWidth}(\texttt{"f64"})\ =\ 64 \\[0.16em]
\operatorname{FloatValueSet}(t)\ =\ \{\ v\ \mid \ v\ \mathsf{is}\ a\ \mathsf{value}\ \mathsf{representable}\ \mathsf{by}\ \mathsf{IEEE}\ 754-2019\ \mathsf{format}\ \operatorname{FloatFormat}(t)\ \} \\[0.16em]
\operatorname{IEEE754Encode}(t,\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ v\ \in \ \operatorname{FloatValueSet}(t)\ \land \ \mathsf{bits}\ \in \ [0,\ 2^\{\operatorname{FloatBitWidth}(t)\}\ -\ 1]\ \land \ ((v\ \mathsf{is}\ \mathsf{NaN}\ \mathsf{in}\ \mathsf{IEEE}\ 754-2019\ \mathsf{format}\ \operatorname{FloatFormat}(t)\ \land \ \mathsf{bits}\ =\ \operatorname{CanonicalNaNBits}(t))\ \lor \ (v\ \mathsf{is}\ \mathsf{not}\ \mathsf{NaN}\ \mathsf{in}\ \mathsf{IEEE}\ 754-2019\ \mathsf{format}\ \operatorname{FloatFormat}(t)\ \land \ \mathsf{bits}\ \mathsf{is}\ \mathsf{the}\ \mathsf{IEEE}\ 754-2019\ \mathsf{encoding}\ \mathsf{of}\ v\ \mathsf{in}\ \mathsf{format}\ \operatorname{FloatFormat}(t))) \\[0.16em]
\operatorname{CanonicalNaNBits}(\texttt{"f16"})\ =\ 0\mathsf{x7E00}\quad \operatorname{CanonicalNaNBits}(\texttt{"f32"})\ =\ 0\mathsf{x7FC00000}\quad \operatorname{CanonicalNaNBits}(\texttt{"f64"})\ =\ 0\mathsf{x7FF8000000000000} \\[0.16em]
\operatorname{CanonicalNaN}(t)\ =\ v\ \Leftrightarrow \ \operatorname{IEEE754Encode}(t,\ v)\ =\ \operatorname{CanonicalNaNBits}(t) \\[0.16em]
\operatorname{NonNaNValueSet}(t)\ =\ \{\ v\ \in \ \operatorname{FloatValueSet}(t)\ \mid \ \operatorname{IEEE754Encode}(t,\ v)\ \ne \ \operatorname{CanonicalNaNBits}(t)\ \} \\[0.16em]
\operatorname{LSB}(n)\ =\ n\ \mathsf{mod}\ 2 \\[0.16em]
\operatorname{EvenSignificandLSB}(t,\ v)\ \Leftrightarrow \ \operatorname{LSB}(\operatorname{IEEE754Encode}(t,\ v))\ =\ 0 \\[0.16em]
\operatorname{IEEE754Bits}(t,\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ v\ \in \ \operatorname{FloatValueSet}(t)\ \land \ \operatorname{IEEE754Encode}(t,\ v)\ =\ \mathsf{bits}
\end{array}
$$

DefaultInt = `i32`
DefaultFloat = `f32`

$$
\begin{array}{l}
\operatorname{IntWidth}(\texttt{i8})\ =\ 8\quad \operatorname{IntWidth}(\texttt{i16})\ =\ 16\quad \operatorname{IntWidth}(\texttt{i32})\ =\ 32\quad \operatorname{IntWidth}(\texttt{i64})\ =\ 64\quad \operatorname{IntWidth}(\texttt{i128})\ =\ 128 \\[0.16em]
\operatorname{IntWidth}(\texttt{u8})\ =\ 8\quad \operatorname{IntWidth}(\texttt{u16})\ =\ 16\quad \operatorname{IntWidth}(\texttt{u32})\ =\ 32\quad \operatorname{IntWidth}(\texttt{u64})\ =\ 64\quad \operatorname{IntWidth}(\texttt{u128})\ =\ 128 \\[0.16em]
\operatorname{IntWidth}(\texttt{isize})\ =\ 8\ \times \ \mathsf{PointerSize}\quad \operatorname{IntWidth}(\texttt{usize})\ =\ 8\ \times \ \mathsf{PointerSize}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{RangeOf}\ :\ \mathsf{PrimitiveTypeName}\ \rightharpoonup \ \wp (\mathbb{R} ) \\[0.16em]
\operatorname{RangeOf}(t)\ =\ [-2^\{w-1\},\ 2^\{w-1\}\ -\ 1]\ \mathsf{if}\ t\ \in \ \mathsf{SignedIntTypes}\ \land \ w\ =\ \operatorname{IntWidth}(t) \\[0.16em]
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
\operatorname{ValueType}(\operatorname{IntVal}(t,\ x))\ =\ \operatorname{TypePrim}(t) \\[0.16em]
\operatorname{ValueType}(\operatorname{FloatVal}(t,\ v))\ =\ \operatorname{TypePrim}(t) \\[0.16em]
\operatorname{ValueType}(v)\ =\ \operatorname{TypePrim}(\texttt{"bool"})\ \Leftrightarrow \ \exists \ b.\ v\ =\ \operatorname{BoolVal}(b) \\[0.16em]
\operatorname{ValueType}(v)\ =\ \operatorname{TypePrim}(\texttt{"char"})\ \Leftrightarrow \ \exists \ u.\ v\ =\ \operatorname{CharVal}(u) \\[0.16em]
\operatorname{ValueType}(\operatorname{BoolVal}(\mathsf{true}))\ =\ \operatorname{TypePrim}(\texttt{"bool"}) \\[0.16em]
\operatorname{ValueType}(\operatorname{BoolVal}(\mathsf{false}))\ =\ \operatorname{TypePrim}(\texttt{"bool"}) \\[0.16em]
\operatorname{ValueType}(\operatorname{CharVal}(u))\ =\ \operatorname{TypePrim}(\texttt{"char"}) \\[0.16em]
\operatorname{ValueType}(\mathsf{UnitVal})\ =\ \operatorname{TypePrim}(\texttt{"()"})
\end{array}
$$

Primitive-operation evaluation is defined by §16.4. This section introduces no additional reduction rules beyond the primitive value domains above.

### 12.1.6 Lowering

$$
\begin{array}{l}
\operatorname{ValueBits}(\operatorname{TypePrim}(\texttt{"bool"}),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ (v\ =\ \operatorname{BoolVal}(\mathsf{true})\ \land \ \mathsf{bits}\ =\ [0\mathsf{x01}])\ \lor \ (v\ =\ \operatorname{BoolVal}(\mathsf{false})\ \land \ \mathsf{bits}\ =\ [0\mathsf{x00}]) \\[0.16em]
\operatorname{ValueBits}(\operatorname{TypePrim}(\texttt{"char"}),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ v\ =\ \operatorname{CharVal}(u)\ \land \ \operatorname{LEBytes}(u,\ 4)\ =\ \mathsf{bits} \\[0.16em]
\operatorname{ValueBits}(\operatorname{TypePrim}(\texttt{"()"}),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ v\ =\ \mathsf{UnitVal}\ \land \ \mathsf{bits}\ =\ [] \\[0.16em]
\operatorname{ValueBits}(\operatorname{TypePrim}(t),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ t\ \in \ \mathsf{IntTypes}\ \land \ v\ =\ \operatorname{IntVal}(t,\ x)\ \land \ \operatorname{LEBytes}(x,\ \operatorname{sizeof}(\operatorname{TypePrim}(t)))\ =\ \mathsf{bits} \\[0.16em]
\operatorname{ValueBits}(\operatorname{TypePrim}(t),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ t\ \in \ \mathsf{FloatTypes}\ \land \ v\ =\ \operatorname{FloatVal}(t,\ x)\ \land \ \operatorname{LEBytes}(\operatorname{IEEE754Bits}(t,\ x),\ \operatorname{sizeof}(\operatorname{TypePrim}(t)))\ =\ \mathsf{bits}
\end{array}
$$

Primitive-type layout and ABI classification are defined by Chapter 24.

### 12.1.7 Diagnostics

Diagnostics are defined for malformed primitive type syntax and for literal-range or suffix mismatches at the primitive use sites defined by §16.1. This section introduces no construct-specific diagnostic beyond primitive-type well-formedness.
