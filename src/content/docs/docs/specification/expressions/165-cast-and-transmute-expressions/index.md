---
title: "16.5 Cast and Transmute Expressions"
description: "16.5 Cast and Transmute Expressions from 16. Expressions of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "expressions"
specSection: "165-cast-and-transmute-expressions"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/expressions/">16. Expressions</a>
  <span>Expressions</span>
</div>

## 16.5 Cast and Transmute Expressions

### 16.5.1 Syntax

```text
cast_expr      ::= unary_expr ("as" type)?
transmute_expr ::= "transmute" "<" type "," type ">" "(" expression ")"
```

The `widen` prefix form is canonically defined in §13.5. This section references it only where cast/transmute expression families need that cross-reference.

### 16.5.2 Parsing

**(Parse-Cast)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseUnary}(P)\ \Downarrow \ (P_{1},\ e)\quad \Gamma \ \vdash \ \operatorname{ParseCastTail}(P_{1},\ e)\ \Downarrow \ (P_{2},\ e') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseCast}(P)\ \Downarrow \ (P_{2},\ e')
\end{array}
$$

**(Parse-CastTail-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{as}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseCastTail}(P,\ e)\ \Downarrow \ (P,\ e)
\end{array}
$$

**(Parse-CastTail-As)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{as})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ t) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseCastTail}(P,\ e)\ \Downarrow \ (P_{1},\ \operatorname{Cast}(e,\ t))
\end{array}
$$

**(Parse-Transmute-Expr-ShiftSplit)** and **(Parse-Transmute-Expr)** parse the two accepted tokenizations of `transmute<T1, T2>(e)`.

`widen` parsing is defined in §13.5.2.

### 16.5.3 AST Representation / Form

$$
\mathsf{Expr}\ =\ \operatorname{Cast}(\mathsf{expr},\ \mathsf{type})\ \mid \ \operatorname{TransmuteExpr}(\mathsf{src}_{\mathsf{type}},\ \mathsf{dst}_{\mathsf{type}},\ \mathsf{expr})\ \mid \ \ldots 
$$

`Unary("widen", e)` is owned by §13.5.3.

### 16.5.4 Static Semantics

$$
\begin{array}{l}
S'\ =\ \operatorname{StripPerm}(S) \\[0.16em]
T'\ =\ \operatorname{StripPerm}(T) \\[0.16em]
\operatorname{CastValid}(S,\ T)\ \Leftrightarrow \ (S'\ =\ \operatorname{TypePrim}(s)\ \land \ T'\ =\ \operatorname{TypePrim}(t)\ \land \ s,\ t\ \in \ \mathsf{NumericTypes})\ \lor \ (S'\ =\ \operatorname{TypePrim}(\texttt{bool})\ \land \ T'\ =\ \operatorname{TypePrim}(t)\ \land \ t\ \in \ \mathsf{IntTypes})\ \lor \ (S'\ =\ \operatorname{TypePrim}(t)\ \land \ t\ \in \ \mathsf{IntTypes}\ \land \ T'\ =\ \operatorname{TypePrim}(\texttt{bool}))\ \lor \ (S'\ =\ \operatorname{TypePrim}(\texttt{char})\ \land \ T'\ =\ \operatorname{TypePrim}(\texttt{u32}))\ \lor \ (S'\ =\ \operatorname{TypePrim}(\texttt{u32})\ \land \ T'\ =\ \operatorname{TypePrim}(\texttt{char}))
\end{array}
$$

**(T-Cast)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ S\quad \operatorname{CastValid}(S,\ T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Cast}(e,\ T)\ :\ T
\end{array}
$$

**(T-Cast-Invalid)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ S\quad \lnot \ \operatorname{CastValid}(S,\ T)\quad c\ =\ \operatorname{Code}(E-\mathsf{SEM}-2528) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Cast}(e,\ T)\ \Uparrow \ c
\end{array}
$$

**(T-Transmute-SizeEq)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(t_{1})\ =\ \operatorname{sizeof}(t_{2}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TransmuteSizeOk}(t_{1},\ t_{2})
\end{array}
$$

**(T-Transmute-AlignEq)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{alignof}(t_{1})\ =\ \operatorname{alignof}(t_{2}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TransmuteAlignOk}(t_{1},\ t_{2})
\end{array}
$$

**(T-Transmute)**

$$
\begin{array}{l}
\operatorname{UnsafeSpan}(\operatorname{span}(\operatorname{TransmuteExpr}(t_{1},\ t_{2},\ e)))\quad \Gamma \ \vdash \ t_{1}\ \mathsf{wf}\quad \Gamma \ \vdash \ t_{2}\ \mathsf{wf}\quad \Gamma \ \vdash \ \operatorname{TransmuteSizeOk}(t_{1},\ t_{2})\quad \Gamma \ \vdash \ \operatorname{TransmuteAlignOk}(t_{1},\ t_{2})\quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ t_{1} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{TransmuteExpr}(t_{1},\ t_{2},\ e)\ :\ t_{2}
\end{array}
$$

**(Transmute-Unsafe-Err)**

$$
\begin{array}{l}
\lnot \ \operatorname{UnsafeSpan}(\operatorname{span}(\operatorname{TransmuteExpr}(t_{1},\ t_{2},\ e)))\quad c\ =\ \operatorname{Code}(\mathsf{Transmute}-\mathsf{Unsafe}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{TransmuteExpr}(t_{1},\ t_{2},\ e)\ \Uparrow \ c
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ValidTransmuteTarget}(T)\ \Leftrightarrow  \\[0.16em]
\ T\ \in \ \{\texttt{i8},\ \texttt{i16},\ \texttt{i32},\ \texttt{i64},\ \texttt{i128},\ \texttt{u8},\ \texttt{u16},\ \texttt{u32},\ \texttt{u64},\ \texttt{u128},\ \texttt{isize},\ \texttt{usize},\ \texttt{f16},\ \texttt{f32},\ \texttt{f64}\}\ \lor  \\[0.16em]
\ T\ =\ \operatorname{TypeRawPtr}(\_,\ \_)\ \lor  \\[0.16em]
\ (T\ =\ \operatorname{TypeArray}(E,\ \_)\ \land \ \operatorname{ValidTransmuteTarget}(E))\ \lor  \\[0.16em]
\ (T\ =\ \operatorname{TypePath}(p)\ \land \ \operatorname{RecordDecl}(p)\ =\ R\ \land \ \operatorname{HasAttribute}(R,\ \texttt{layout(C)})\ \land \ \forall \ f\ \in \ \operatorname{Fields}(R).\ \operatorname{ValidTransmuteTarget}(\operatorname{FieldType}(R,\ f)))
\end{array}
$$

Widen typing, warnings, and diagnostics are defined in §13.5.4 and §13.5.7.

### 16.5.5 Dynamic Semantics

$$
\begin{array}{l}
\mathsf{ExprType}\ :\ \mathsf{Expr}\ \to \ \mathsf{Type} \\[0.16em]
R\ =\ \operatorname{RetType}(\Gamma )
\end{array}
$$

$$
\begin{array}{l}
\mathsf{CastValJudg}\ =\ \{\operatorname{CastVal}(S,\ T,\ v)\ \Downarrow \ v'\} \\[0.16em]
\mathsf{UnsignedIntTypes}\ =\ \{\texttt{u8},\ \texttt{u16},\ \texttt{u32},\ \texttt{u64},\ \texttt{u128},\ \texttt{usize}\} \\[0.16em]
\operatorname{IntWidth}(\texttt{i8})\ =\ 8\quad \operatorname{IntWidth}(\texttt{i16})\ =\ 16\quad \operatorname{IntWidth}(\texttt{i32})\ =\ 32\quad \operatorname{IntWidth}(\texttt{i64})\ =\ 64\quad \operatorname{IntWidth}(\texttt{i128})\ =\ 128 \\[0.16em]
\operatorname{IntWidth}(\texttt{u8})\ =\ 8\quad \operatorname{IntWidth}(\texttt{u16})\ =\ 16\quad \operatorname{IntWidth}(\texttt{u32})\ =\ 32\quad \operatorname{IntWidth}(\texttt{u64})\ =\ 64\quad \operatorname{IntWidth}(\texttt{u128})\ =\ 128 \\[0.16em]
\operatorname{IntWidth}(\texttt{isize})\ =\ 8\ \times \ \mathsf{PointerSize}\quad \operatorname{IntWidth}(\texttt{usize})\ =\ 8\ \times \ \mathsf{PointerSize} \\[0.16em]
\operatorname{Mod_w}(x)\ =\ x\ \mathsf{mod}\ 2^w \\[0.16em]
\operatorname{ToSigned}(w,\ x)\ =\ y\ \Leftrightarrow \ y\ \in \ [-2^\{w-1\},\ 2^\{w-1\}-1]\ \land \ y\ \equiv \ x\ \mathsf{mod}\ 2^w \\[0.16em]
\operatorname{ToUnsigned}(w,\ x)\ =\ y\ \Leftrightarrow \ y\ \in \ [0,\ 2^w-1]\ \land \ y\ \equiv \ x\ \mathsf{mod}\ 2^w \\[0.16em]
\mathsf{CodePoint}\ :\ \texttt{char}\ \to \ \mathbb{N}  \\[0.16em]
\operatorname{IsScalar}(u)\ \Leftrightarrow \ u\ \in \ \mathsf{CharValueRange}
\end{array}
$$
IntToFloat(t, x) function
FloatToFloat(s, t, v) function
Trunc(v) function

$$
\begin{array}{l}
\operatorname{CharOf}(u)\ =\ u\ \Leftrightarrow \ \operatorname{IsScalar}(u) \\[0.16em]
\operatorname{CodePoint}(\operatorname{CharOf}(u))\ =\ u\quad (\operatorname{IsScalar}(u)) \\[0.16em]
\operatorname{IEEE754Bits}(t,\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ v\ \in \ \operatorname{FloatValueSet}(t)\ \land \ \operatorname{IEEE754Encode}(t,\ v)\ =\ \mathsf{bits} \\[0.16em]
\operatorname{IntToFloat}(t,\ x)\ =\ v\ \Leftrightarrow \ v\ \in \ \operatorname{NonNaNValueSet}(t)\ \land \ \forall \ v'\ \in \ \operatorname{NonNaNValueSet}(t).\ \mid v\ -\ x\mid \ <\ \mid v'\ -\ x\mid \ \lor \ (\mid v\ -\ x\mid \ =\ \mid v'\ -\ x\mid \ \land \ \operatorname{EvenSignificandLSB}(t,\ v)) \\[0.16em]
\operatorname{FloatToFloat}(s,\ t,\ v)\ =\ v'\ \Leftrightarrow \ \operatorname{IEEE754Encode}(s,\ v)\ =\ \operatorname{CanonicalNaNBits}(s)\ \land \ v'\ =\ \operatorname{CanonicalNaN}(t) \\[0.16em]
\operatorname{FloatToFloat}(s,\ t,\ v)\ =\ v'\ \Leftrightarrow \ \operatorname{IEEE754Encode}(s,\ v)\ \ne \ \operatorname{CanonicalNaNBits}(s)\ \land \ v'\ \in \ \operatorname{NonNaNValueSet}(t)\ \land \ \forall \ u\ \in \ \operatorname{NonNaNValueSet}(t).\ \mid v'\ -\ v\mid \ <\ \mid u\ -\ v\mid \ \lor \ (\mid v'\ -\ v\mid \ =\ \mid u\ -\ v\mid \ \land \ \operatorname{EvenSignificandLSB}(t,\ v')) \\[0.16em]
\operatorname{Trunc}(v)\ = \\[0.16em]
\ \lfloor v\rfloor \quad \mathsf{if}\ v\ \ge \ 0 \\[0.16em]
\ \lceil v\rceil \quad \mathsf{if}\ v\ <\ 0
\end{array}
$$

**(CastVal-Id)**

$$
\begin{array}{l}
\operatorname{StripPerm}(S)\ =\ \operatorname{StripPerm}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{CastVal}(S,\ T,\ v)\ \Downarrow \ v
\end{array}
$$

**(CastVal-Int-Int-Signed)**

$$
\begin{array}{l}
S'\ =\ \operatorname{StripPerm}(S)\quad T'\ =\ \operatorname{StripPerm}(T)\quad S'\ =\ \operatorname{TypePrim}(s)\quad T'\ =\ \operatorname{TypePrim}(t)\quad s\ \in \ \mathsf{IntTypes}\quad t\ \in \ \mathsf{SignedIntTypes}\quad v\ =\ \operatorname{IntVal}(s,\ x)\quad w\ =\ \operatorname{IntWidth}(t)\quad x'\ =\ \operatorname{ToSigned}(w,\ x)\quad v'\ =\ \operatorname{IntVal}(t,\ x') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{CastVal}(S,\ T,\ v)\ \Downarrow \ v'
\end{array}
$$

**(CastVal-Int-Int-Unsigned)**

$$
\begin{array}{l}
S'\ =\ \operatorname{StripPerm}(S)\quad T'\ =\ \operatorname{StripPerm}(T)\quad S'\ =\ \operatorname{TypePrim}(s)\quad T'\ =\ \operatorname{TypePrim}(t)\quad s\ \in \ \mathsf{IntTypes}\quad t\ \in \ \mathsf{UnsignedIntTypes}\quad v\ =\ \operatorname{IntVal}(s,\ x)\quad w\ =\ \operatorname{IntWidth}(t)\quad x'\ =\ \operatorname{ToUnsigned}(w,\ x)\quad v'\ =\ \operatorname{IntVal}(t,\ x') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{CastVal}(S,\ T,\ v)\ \Downarrow \ v'
\end{array}
$$

**(CastVal-Int-Float)**

$$
\begin{array}{l}
S'\ =\ \operatorname{StripPerm}(S)\quad T'\ =\ \operatorname{StripPerm}(T)\quad S'\ =\ \operatorname{TypePrim}(s)\quad T'\ =\ \operatorname{TypePrim}(t)\quad s\ \in \ \mathsf{IntTypes}\quad t\ \in \ \mathsf{FloatTypes}\quad v\ =\ \operatorname{IntVal}(s,\ x)\quad v'\ =\ \operatorname{FloatVal}(t,\ \operatorname{IntToFloat}(t,\ x)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{CastVal}(S,\ T,\ v)\ \Downarrow \ v'
\end{array}
$$

Lowering and backend emission for `CastVal-Int-Float` MUST preserve source signedness: use signed integer-to-float conversion iff `s ∈ SignedIntTypes`; otherwise use unsigned conversion.

**(CastVal-Float-Float)**

$$
\begin{array}{l}
S'\ =\ \operatorname{StripPerm}(S)\quad T'\ =\ \operatorname{StripPerm}(T)\quad S'\ =\ \operatorname{TypePrim}(s)\quad T'\ =\ \operatorname{TypePrim}(t)\quad s\ \in \ \mathsf{FloatTypes}\quad t\ \in \ \mathsf{FloatTypes}\quad v\ =\ \operatorname{FloatVal}(s,\ x)\quad v'\ =\ \operatorname{FloatVal}(t,\ \operatorname{FloatToFloat}(s,\ t,\ x)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{CastVal}(S,\ T,\ v)\ \Downarrow \ v'
\end{array}
$$

**(CastVal-Float-Int)**

$$
\begin{array}{l}
S'\ =\ \operatorname{StripPerm}(S)\quad T'\ =\ \operatorname{StripPerm}(T)\quad S'\ =\ \operatorname{TypePrim}(s)\quad T'\ =\ \operatorname{TypePrim}(t)\quad s\ \in \ \mathsf{FloatTypes}\quad t\ \in \ \mathsf{IntTypes}\quad v\ =\ \operatorname{FloatVal}(s,\ x)\quad x'\ =\ \operatorname{Trunc}(x)\quad \operatorname{InRange}(x',\ t)\quad v'\ =\ \operatorname{IntVal}(t,\ x') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{CastVal}(S,\ T,\ v)\ \Downarrow \ v'
\end{array}
$$

**(CastVal-Bool-Int)**

$$
\begin{array}{l}
S'\ =\ \operatorname{StripPerm}(S)\quad T'\ =\ \operatorname{StripPerm}(T)\quad S'\ =\ \operatorname{TypePrim}(\texttt{"bool"})\quad T'\ =\ \operatorname{TypePrim}(t)\quad t\ \in \ \mathsf{IntTypes}\quad v'\ = \\[0.16em]
\ \operatorname{IntVal}(t,\ 0)\quad \mathsf{if}\ v\ =\ \mathsf{false} \\[0.16em]
\ \operatorname{IntVal}(t,\ 1)\quad \mathsf{if}\ v\ =\ \mathsf{true} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{CastVal}(S,\ T,\ v)\ \Downarrow \ v'
\end{array}
$$

**(CastVal-Int-Bool)**

$$
\begin{array}{l}
S'\ =\ \operatorname{StripPerm}(S)\quad T'\ =\ \operatorname{StripPerm}(T)\quad S'\ =\ \operatorname{TypePrim}(t)\quad t\ \in \ \mathsf{IntTypes}\quad T'\ =\ \operatorname{TypePrim}(\texttt{"bool"})\quad v\ =\ \operatorname{IntVal}(t,\ x)\quad v'\ = \\[0.16em]
\ \mathsf{false}\quad \mathsf{if}\ x\ =\ 0 \\[0.16em]
\ \mathsf{true}\quad \mathsf{if}\ x\ \ne \ 0 \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{CastVal}(S,\ T,\ v)\ \Downarrow \ v'
\end{array}
$$

**(CastVal-Char-U32)**

$$
\begin{array}{l}
S'\ =\ \operatorname{StripPerm}(S)\quad T'\ =\ \operatorname{StripPerm}(T)\quad S'\ =\ \operatorname{TypePrim}(\texttt{"char"})\quad T'\ =\ \operatorname{TypePrim}(\texttt{"u32"})\quad v'\ =\ \operatorname{IntVal}(\texttt{"u32"},\ \operatorname{CodePoint}(v)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{CastVal}(S,\ T,\ v)\ \Downarrow \ v'
\end{array}
$$

**(CastVal-U32-Char)**

$$
\begin{array}{l}
S'\ =\ \operatorname{StripPerm}(S)\quad T'\ =\ \operatorname{StripPerm}(T)\quad S'\ =\ \operatorname{TypePrim}(\texttt{"u32"})\quad T'\ =\ \operatorname{TypePrim}(\texttt{"char"})\quad v\ =\ \operatorname{IntVal}(\texttt{"u32"},\ x)\quad \operatorname{IsScalar}(x)\quad v'\ =\ \operatorname{CharVal}(\operatorname{CharOf}(x)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{CastVal}(S,\ T,\ v)\ \Downarrow \ v'
\end{array}
$$

**(EvalSigma-Cast)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad S\ =\ \operatorname{ExprType}(e)\quad \operatorname{CastVal}(S,\ T,\ v)\ \Downarrow \ v' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Cast}(e,\ T),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Cast-Panic)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad S\ =\ \operatorname{ExprType}(e)\quad \operatorname{CastVal}(S,\ T,\ v)\ \mathsf{undefined} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Cast}(e,\ T),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma_{1} )
\end{array}
$$

$$
\operatorname{TransmuteVal}(S,\ T,\ v)\ \Downarrow \ v'\ \Leftrightarrow \ \operatorname{ValueBits}(S,\ v)\ =\ \mathsf{bits}\ \land \ \operatorname{ValueBits}(T,\ v')\ =\ \mathsf{bits}
$$

**(EvalSigma-Transmute)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad S\ =\ t_{1}\quad T\ =\ t_{2}\quad \operatorname{TransmuteVal}(S,\ T,\ v)\ \Downarrow \ v' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{TransmuteExpr}(t_{1},\ t_{2},\ e),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Transmute-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{TransmuteExpr}(t_{1},\ t_{2},\ e),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

`widen` dynamic semantics are defined in §13.5.5.

### 16.5.6 Lowering

**(Lower-Expr-Cast)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerCast}(e,\ T)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{Cast}(e,\ T))\ \Downarrow \ \langle \mathsf{IR},\ v\rangle 
\end{array}
$$

**(Lower-Expr-Transmute)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerTransmute}(T_{1},\ T_{2},\ e)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{TransmuteExpr}(T_{1},\ T_{2},\ e))\ \Downarrow \ \langle \mathsf{IR},\ v\rangle 
\end{array}
$$

`Lower-Cast`, `Lower-Cast-Panic`, `Lower-Transmute`, and `Lower-Transmute-Err` define the runtime bit reinterpretation and panic behavior. `widen` lowering is defined in §13.5.6.

### 16.5.7 Diagnostics

Diagnostics are defined for invalid casts, `transmute` outside `unsafe`, `transmute` source/target size mismatch, `transmute` source/target alignment mismatch, and targets with known invalid bit patterns. `widen`-specific diagnostics remain owned by §13.5.7.
