---
title: "16.1 Literal and Name Expressions"
description: "16.1 Literal and Name Expressions from 16. Expressions of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "expressions"
specSection: "161-literal-and-name-expressions"
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

## 16.1 Literal and Name Expressions

### 16.1.1 Syntax

```text
literal_expr        ::= literal
null_ptr_expr       ::= "Ptr" "::" "null" "(" ")"
identifier_expr     ::= identifier
qualified_name_expr ::= path "::" identifier
```

Qualified applications with `(` ... `)` are owned by §16.3. Qualified applications with `{` ... `}` are owned by §16.6.

### 16.1.2 Parsing

**(Parse-Literal-Expr)**

$$
\begin{array}{l}
\operatorname{Tok}(P).\mathsf{kind}\ \in \ \{\mathsf{IntLiteral},\ \mathsf{FloatLiteral},\ \mathsf{StringLiteral},\ \mathsf{CharLiteral},\ \mathsf{BoolLiteral},\ \mathsf{NullLiteral}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \operatorname{Literal}(\operatorname{Tok}(P)))
\end{array}
$$

**(Parse-Null-Ptr)**

$$
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \operatorname{Lexeme}(\operatorname{Tok}(P))\ =\ \texttt{Ptr}\quad \operatorname{IsOp}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"::"})\quad \operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))).\mathsf{kind}\ =\ \mathsf{NullLiteral}\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P)))),\ \texttt{"("})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P))))),\ \texttt{")"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P))))),\ \mathsf{PtrNullExpr})
\end{array}
$$

**(Parse-Identifier-Expr)**

$$
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \lnot \ \operatorname{IsOp}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"::"})\quad \lnot \ \operatorname{IsOp}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"@"})\quad \lnot \ \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"\{"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \operatorname{Identifier}(\operatorname{Lexeme}(\operatorname{Tok}(P))))
\end{array}
$$

**(Parse-Qualified-Name)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseQualifiedHead}(P)\ \Downarrow \ (P_{1},\ \mathsf{path},\ \mathsf{name})\quad \operatorname{Tok}(P_{1})\ \notin \ \{\operatorname{Punctuator}(\texttt{"("}),\ \operatorname{Punctuator}(\texttt{"\{"})\}\quad \lnot \ \operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{"@"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (P_{1},\ \operatorname{QualifiedName}(\mathsf{path},\ \mathsf{name}))
\end{array}
$$

### 16.1.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{LiteralKind}\ =\ \{\mathsf{IntLiteral},\ \mathsf{FloatLiteral},\ \mathsf{StringLiteral},\ \mathsf{CharLiteral},\ \mathsf{BoolLiteral},\ \mathsf{NullLiteral}\} \\[0.16em]
\mathsf{LiteralToken}\ =\ \{\ t\ \in \ \mathsf{Token}\ \mid \ t.\mathsf{kind}\ \in \ \mathsf{LiteralKind}\ \}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{Expr}\ =\ \operatorname{Literal}(\mathsf{lit})\ \mid \ \mathsf{PtrNullExpr}\ \mid \ \operatorname{Identifier}(\mathsf{name})\ \mid \ \operatorname{QualifiedName}(\mathsf{path},\ \mathsf{name})\ \mid \ \operatorname{Path}(\mathsf{path},\ \mathsf{name})\ \mid \ \operatorname{ErrorExpr}(\mathsf{span})\ \mid \ \ldots \\[0.16em]
\mathsf{ExprSpan}\ :\ \mathsf{Expr}\ \to \ \mathsf{Span}
\end{array}
$$

$$
\texttt{QualifiedName(path, name)}\ \mathsf{is}\ a\ \mathsf{pre}-\mathsf{resolution}\ \mathsf{expression}\ \mathsf{form}.\ \mathsf{Resolution}\ \mathsf{rewrites}\ \mathsf{it}\ \mathsf{to}\ \mathsf{one}\ \mathsf{of}:
$$

- `Path(path', name')` for resolved value names
- `EnumLiteral(FullPath(p, name), ⊥)` for resolved unit enum variants

If neither form resolves, the name-resolution pass rejects the expression.

$$
\begin{array}{l}
\mathsf{ValuePathType}\ :\ \mathsf{Path}\ \times \ \mathsf{Ident}\ \rightharpoonup \ \mathsf{Type} \\[0.16em]
\operatorname{BuiltinModalStaticSig}(\mathsf{path},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \\[0.16em]
\ (\mathsf{path}\ =\ [\texttt{"Region"}]\ \land \ \mathsf{name}\ =\ \texttt{new\_scoped}\ \land \ \operatorname{RegionProcSig}(\texttt{Region::new\_scoped})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle )\ \lor \\[0.16em]
\ (\mathsf{path}\ =\ [\texttt{"CancelToken"}]\ \land \ \mathsf{name}\ =\ \texttt{new}\ \land \ \operatorname{BuiltinModalProcSig}(\texttt{CancelToken::new})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle ) \\[0.16em]
\operatorname{ValuePathType}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{StaticType}(\mathsf{path},\ \mathsf{name})\ \mathsf{if}\ \operatorname{StaticType}(\mathsf{path},\ \mathsf{name})\ \mathsf{defined} \\[0.16em]
\operatorname{ValuePathType}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{TypeFunc}([\langle \mathsf{mode},\ T\rangle \ \mid \ \langle \mathsf{mode},\ x,\ T\rangle \ \in \ \mathsf{params}],\ \mathsf{ret})\ \mathsf{if}\ \operatorname{BuiltinModalStaticSig}(\mathsf{path},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \\[0.16em]
\operatorname{ValuePathType}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{TypeFunc}([\langle \mathsf{mode},\ T\rangle \ \mid \ \langle \mathsf{mode},\ x,\ T\rangle \ \in \ \mathsf{params}],\ \operatorname{ProcReturn}(\mathsf{ret}_{\mathsf{opt}}))\ \mathsf{if}\ \operatorname{DeclOf}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \_,\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \_,\ \_,\ \_,\ \_)\ \land \ \operatorname{TypeParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\ =\ [] \\[0.16em]
\operatorname{ValuePathType}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{TypeFunc}([\langle \mathsf{mode},\ T\rangle \ \mid \ \langle \mathsf{mode},\ x,\ T\rangle \ \in \ \mathsf{params}],\ \operatorname{ProcReturn}(\mathsf{ret}_{\mathsf{opt}}))\ \mathsf{if}\ \operatorname{DeclOf}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{ExternProcDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \_,\ \_,\ \_,\ \_)
\end{array}
$$
ValuePathType(path, name) undefined otherwise

### 16.1.4 Static Semantics

$$
\begin{array}{l}
\mathsf{IntTypes}\ =\ \{\texttt{i8},\ \texttt{i16},\ \texttt{i32},\ \texttt{i64},\ \texttt{i128},\ \texttt{u8},\ \texttt{u16},\ \texttt{u32},\ \texttt{u64},\ \texttt{u128},\ \texttt{isize},\ \texttt{usize}\} \\[0.16em]
\mathsf{FloatTypes}\ =\ \{\texttt{f16},\ \texttt{f32},\ \texttt{f64}\} \\[0.16em]
\mathsf{FloatSuffixKinds}\ =\ \mathsf{FloatTypes}\ \cup \ \{\texttt{f}\}
\end{array}
$$
DefaultInt = `i32`
DefaultFloat = `f32`

$$
\begin{array}{l}
\operatorname{IntCore}(s)\ \Leftrightarrow \ s\ \mathsf{matches}\ (\texttt{decimal\_integer}\ \mid \ \texttt{hex\_integer}\ \mid \ \texttt{octal\_integer}\ \mid \ \texttt{binary\_integer}) \\[0.16em]
\operatorname{FloatCore}(s)\ \Leftrightarrow \ s\ \mathsf{matches}\ (\texttt{decimal\_integer}\ \texttt{"."}\ \texttt{decimal\_integer}?\ \texttt{exponent}?) \\[0.16em]
\operatorname{StripIntSuffix}(s)\ =\ \langle \mathsf{core},\ t\rangle \ \Leftrightarrow \ s\ =\ \mathsf{core}\ \mathbin{++} \ t\ \land \ t\ \in \ \mathsf{IntSuffixSet}\ \land \ \operatorname{IntCore}(\mathsf{core}) \\[0.16em]
\operatorname{StripIntSuffix}(s)\ =\ \langle s,\ \bot \rangle \ \Leftrightarrow \ \lnot \ \exists \ t.\ s\ =\ \mathsf{core}\ \mathbin{++} \ t\ \land \ t\ \in \ \mathsf{IntSuffixSet}\ \land \ \operatorname{IntCore}(\mathsf{core}) \\[0.16em]
\operatorname{StripFloatSuffix}(s)\ =\ \langle \mathsf{core},\ t\rangle \ \Leftrightarrow \ s\ =\ \mathsf{core}\ \mathbin{++} \ t\ \land \ t\ \in \ \mathsf{FloatSuffixSet}\ \land \ \operatorname{FloatCore}(\mathsf{core}) \\[0.16em]
\operatorname{StripFloatSuffix}(s)\ =\ \langle s,\ \bot \rangle \ \Leftrightarrow \ \operatorname{FloatCore}(s)\ \land \ \lnot \ \exists \ t.\ s\ =\ \mathsf{core}\ \mathbin{++} \ t\ \land \ t\ \in \ \mathsf{FloatSuffixSet}\ \land \ \operatorname{FloatCore}(\mathsf{core}) \\[0.16em]
\operatorname{IntSuffix}(\mathsf{lit})\ =\ t\ \Leftrightarrow \ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{IntLiteral}\ \land \ \operatorname{StripIntSuffix}(\operatorname{Lexeme}(\mathsf{lit}))\ =\ \langle \_,\ t\rangle \\[0.16em]
\operatorname{FloatSuffix}(\mathsf{lit})\ =\ t\ \Leftrightarrow \ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{FloatLiteral}\ \land \ \operatorname{StripFloatSuffix}(\operatorname{Lexeme}(\mathsf{lit}))\ =\ \langle \_,\ t\rangle \\[0.16em]
\operatorname{NoFloatSuffix}(\mathsf{lit})\ \Leftrightarrow \ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{FloatLiteral}\ \land \ \operatorname{StripFloatSuffix}(\operatorname{Lexeme}(\mathsf{lit}))\ =\ \langle \_,\ \bot \rangle \\[0.16em]
\operatorname{IntValueCore}(s)\ =\ v\ \Leftrightarrow \ (s\ =\ \texttt{"0x"}\ \mathbin{++} \ h\ \land \ v\ =\ \operatorname{HexValue}(\operatorname{Digits}(h)))\ \lor \ (s\ =\ \texttt{"0o"}\ \mathbin{++} \ o\ \land \ v\ =\ \operatorname{OctValue}(\operatorname{Digits}(o)))\ \lor \ (s\ =\ \texttt{"0b"}\ \mathbin{++} \ b\ \land \ v\ =\ \operatorname{BinValue}(\operatorname{Digits}(b)))\ \lor \ (s\ \mathsf{matches}\ \texttt{decimal\_integer}\ \land \ v\ =\ \operatorname{DecValue}(\operatorname{Digits}(s))) \\[0.16em]
\operatorname{IntValue}(\mathsf{lit})\ =\ v\ \Leftrightarrow \ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{IntLiteral}\ \land \ \operatorname{StripIntSuffix}(\operatorname{Lexeme}(\mathsf{lit}))\ =\ \langle \mathsf{core},\ \_\rangle \ \land \ \operatorname{IntValueCore}(\mathsf{core})\ =\ v \\[0.16em]
\operatorname{FloatParts}(s)\ =\ \langle a,\ b,\ e\rangle \ \Leftrightarrow \ s\ =\ a\ \mathbin{++} \ \texttt{"."}\ \mathbin{++} \ b\ \mathbin{++} \ \mathsf{exp}\ \land \ (\mathsf{exp}\ =\ \texttt{""}\ \Rightarrow \ e\ =\ 0)\ \land \ (\mathsf{exp}\ \ne \ \texttt{""}\ \Rightarrow \ \mathsf{exp}\ =\ \texttt{"e"}\ \mathbin{++} \ \mathsf{sign}\ \mathbin{++} \ d\ \lor \ \mathsf{exp}\ =\ \texttt{"E"}\ \mathbin{++} \ \mathsf{sign}\ \mathbin{++} \ d)\ \land \ (\mathsf{sign}\ =\ \texttt{""}\ \Rightarrow \ e\ =\ \operatorname{DecValue}(\operatorname{Digits}(d)))\ \land \ (\mathsf{sign}\ =\ \texttt{"+"}\ \Rightarrow \ e\ =\ \operatorname{DecValue}(\operatorname{Digits}(d)))\ \land \ (\mathsf{sign}\ =\ \texttt{"-"}\ \Rightarrow \ e\ =\ -\operatorname{DecValue}(\operatorname{Digits}(d))) \\[0.16em]
\operatorname{FloatValueCore}(s)\ =\ v\ \Leftrightarrow \ \operatorname{FloatParts}(s)\ =\ \langle a,\ b,\ e\rangle \ \land \ v\ =\ (\operatorname{DecValue}(\operatorname{Digits}(a))\ \cdot \ 10^\{\mid \operatorname{Digits}(b)\mid \}\ +\ \operatorname{DecValue}(\operatorname{Digits}(b)))\ \cdot \ 10^\{e\ -\ \mid \operatorname{Digits}(b)\mid \} \\[0.16em]
\operatorname{FloatValue}(\mathsf{lit})\ =\ v\ \Leftrightarrow \ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{FloatLiteral}\ \land \ \operatorname{StripFloatSuffix}(\operatorname{Lexeme}(\mathsf{lit}))\ =\ \langle \mathsf{core},\ \_\rangle \ \land \ \operatorname{FloatValueCore}(\mathsf{core})\ =\ v \\[0.16em]
\operatorname{InRange}(v,\ T)\ \Leftrightarrow \ v\ \in \ \operatorname{RangeOf}(T)
\end{array}
$$

**(T-Int-Literal-Suffix)**

$$
\begin{array}{l}
\mathsf{lit}.\mathsf{kind}\ =\ \mathsf{IntLiteral}\quad \operatorname{IntSuffix}(\mathsf{lit})\ =\ t\quad \operatorname{InRange}(\operatorname{IntValue}(\mathsf{lit}),\ t) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Literal}(\mathsf{lit})\ :\ \operatorname{TypePrim}(t)
\end{array}
$$

**(T-Int-Literal-Default)**

$$
\begin{array}{l}
\mathsf{lit}.\mathsf{kind}\ =\ \mathsf{IntLiteral}\quad \operatorname{IntSuffix}(\mathsf{lit})\ =\ \bot \quad \operatorname{InRange}(\operatorname{IntValue}(\mathsf{lit}),\ \texttt{i32}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Literal}(\mathsf{lit})\ :\ \operatorname{TypePrim}(\texttt{i32})
\end{array}
$$

**(T-Float-Literal-Explicit)**

$$
\begin{array}{l}
\mathsf{lit}.\mathsf{kind}\ =\ \mathsf{FloatLiteral}\quad \operatorname{FloatSuffix}(\mathsf{lit})\ =\ t\quad t\ \in \ \{\texttt{f16},\ \texttt{f32},\ \texttt{f64}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Literal}(\mathsf{lit})\ :\ \operatorname{TypePrim}(t)
\end{array}
$$

**(T-Float-Literal-Infer)**

$$
\begin{array}{l}
\mathsf{lit}.\mathsf{kind}\ =\ \mathsf{FloatLiteral}\quad (\operatorname{FloatSuffix}(\mathsf{lit})\ =\ \texttt{f}\ \lor \ \operatorname{NoFloatSuffix}(\mathsf{lit})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Literal}(\mathsf{lit})\ :\ \operatorname{TypePrim}(\texttt{f32})
\end{array}
$$

**(T-Bool-Literal)**
lit.kind = BoolLiteral

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Literal}(\mathsf{lit})\ :\ \operatorname{TypePrim}(\texttt{bool})
\end{array}
$$

**(T-Char-Literal)**
lit.kind = CharLiteral

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Literal}(\mathsf{lit})\ :\ \operatorname{TypePrim}(\texttt{char})
\end{array}
$$

**(T-String-Literal)**
lit.kind = StringLiteral

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Literal}(\mathsf{lit})\ :\ \operatorname{TypeString}(\texttt{@View})
\end{array}
$$

**(Syn-Literal)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Literal}(\mathsf{lit})\ :\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Literal}(\mathsf{lit})\ \Rightarrow \ T\ \dashv \ \emptyset
\end{array}
$$

$$
\operatorname{NullLiteralExpected}(T)\ \Leftrightarrow \ T\ =\ \operatorname{TypeRawPtr}(q,\ U)
$$

**(Chk-Int-Literal)**

$$
\begin{array}{l}
\mathsf{lit}.\mathsf{kind}\ =\ \mathsf{IntLiteral}\quad T\ =\ \operatorname{TypePrim}(t)\quad t\ \in \ \mathsf{IntTypes}\quad \operatorname{InRange}(\operatorname{IntValue}(\mathsf{lit}),\ t) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Literal}(\mathsf{lit})\ \Leftarrow \ T\ \dashv \ \emptyset
\end{array}
$$

**(Chk-Float-Literal-Explicit)**

$$
\begin{array}{l}
\mathsf{lit}.\mathsf{kind}\ =\ \mathsf{FloatLiteral}\quad \operatorname{FloatSuffix}(\mathsf{lit})\ =\ s\quad s\ \in \ \{\texttt{f16},\ \texttt{f32},\ \texttt{f64}\}\quad T\ =\ \operatorname{TypePrim}(s) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Literal}(\mathsf{lit})\ \Leftarrow \ T\ \dashv \ \emptyset
\end{array}
$$

**(Chk-Float-Literal-Infer)**

$$
\begin{array}{l}
\mathsf{lit}.\mathsf{kind}\ =\ \mathsf{FloatLiteral}\quad (\operatorname{FloatSuffix}(\mathsf{lit})\ =\ \texttt{f}\ \lor \ \operatorname{NoFloatSuffix}(\mathsf{lit}))\quad T\ =\ \operatorname{TypePrim}(t)\quad t\ \in \ \mathsf{FloatTypes} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Literal}(\mathsf{lit})\ \Leftarrow \ T\ \dashv \ \emptyset
\end{array}
$$

**(Chk-Null-Literal)**

$$
\begin{array}{l}
\mathsf{lit}.\mathsf{kind}\ =\ \mathsf{NullLiteral}\quad T\ =\ \operatorname{TypeRawPtr}(q,\ U) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Literal}(\mathsf{lit})\ \Leftarrow \ T\ \dashv \ \emptyset
\end{array}
$$

$$
\operatorname{PtrNullExpected}(T)\ \Leftrightarrow \ T\ =\ \operatorname{TypePtr}(U,\ s)\ \land \ s\ \in \ \{\texttt{Null},\ \bot \}
$$

Rules **(Chk-Null-Ptr)**, **(Syn-PtrNull-Err)**, **(Chk-PtrNull-Err)** are defined once by §8.3.

**(T-Ident)**

$$
\begin{array}{l}
(x\ :\ T)\ \in \ \Gamma \quad \operatorname{BitcopyType}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Identifier}(x)\ :\ T
\end{array}
$$

**(T-Path-Value)**

$$
\begin{array}{l}
\operatorname{ValuePathType}(\mathsf{path},\ \mathsf{name})\ =\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Path}(\mathsf{path},\ \mathsf{name})\ :\ T
\end{array}
$$

**(Expr-Unresolved-Err)**

$$
\begin{array}{l}
e\ \in \ \{\operatorname{QualifiedName}(\_,\ \_)\}\quad c\ =\ \operatorname{Code}(\mathsf{ResolveExpr}-\mathsf{Ident}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ e\ \Uparrow \ c
\end{array}
$$

`QualifiedName` MUST be eliminated by name resolution before typing continues.

### 16.1.5 Dynamic Semantics

$$
\begin{array}{l}
\mathsf{EvalJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\} \\[0.16em]
\mathsf{EvalOptJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{EvalOptSigma}(e_{\mathsf{opt}},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\} \\[0.16em]
\mathsf{EvalListJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{EvalListSigma}(\mathsf{es},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma '),\ \Gamma \ \vdash \ \operatorname{EvalFieldInitsSigma}(\mathsf{fields},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BoolValue}(\mathsf{lit})\ =\ \mathsf{true}\ \Leftrightarrow \ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{BoolLiteral}\ \land \ \operatorname{Lexeme}(\mathsf{lit})\ =\ \texttt{"true"} \\[0.16em]
\operatorname{BoolValue}(\mathsf{lit})\ =\ \mathsf{false}\ \Leftrightarrow \ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{BoolLiteral}\ \land \ \operatorname{Lexeme}(\mathsf{lit})\ =\ \texttt{"false"} \\[0.16em]
\operatorname{CharValue}(\mathsf{lit})\ =\ u\ \Leftrightarrow \ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{CharLiteral}\ \land \ T\ =\ \operatorname{Lexeme}(\mathsf{lit})\ \land \ \operatorname{StringBytesFrom}(T,\ 1,\ \mid T\mid -1)\ =\ \mathsf{bytes}\ \land \ \operatorname{DecodeUTF8}(\mathsf{bytes})\ =\ [u] \\[0.16em]
\operatorname{LiteralValue}(\ell ,\ \operatorname{TypePrim}(\texttt{"bool"}))\ =\ \operatorname{BoolVal}(b)\ \Leftrightarrow \ \ell .\mathsf{kind}\ =\ \mathsf{BoolLiteral}\ \land \ \operatorname{BoolValue}(\ell )\ =\ b \\[0.16em]
\operatorname{LiteralValue}(\ell ,\ \operatorname{TypePrim}(\texttt{"char"}))\ =\ \operatorname{CharVal}(c)\ \Leftrightarrow \ \ell .\mathsf{kind}\ =\ \mathsf{CharLiteral}\ \land \ \operatorname{CharValue}(\ell )\ =\ c \\[0.16em]
\operatorname{LiteralValue}(\ell ,\ \operatorname{TypeString}(\texttt{@View}))\ =\ v\ \Leftrightarrow \ \ell .\mathsf{kind}\ =\ \mathsf{StringLiteral}\ \land \ \operatorname{ViewBytes}(v)\ =\ \operatorname{StringBytes}(\ell ) \\[0.16em]
\operatorname{LiteralValue}(\ell ,\ \operatorname{TypePrim}(t))\ =\ \operatorname{IntVal}(t,\ x)\ \Leftrightarrow \ \ell .\mathsf{kind}\ =\ \mathsf{IntLiteral}\ \land \ t\ \in \ \mathsf{IntTypes}\ \land \ x\ =\ \operatorname{IntValue}(\ell ) \\[0.16em]
\operatorname{LiteralValue}(\ell ,\ \operatorname{TypePrim}(t))\ =\ \operatorname{FloatVal}(t,\ v)\ \Leftrightarrow \ \ell .\mathsf{kind}\ =\ \mathsf{FloatLiteral}\ \land \ t\ \in \ \mathsf{FloatTypes}\ \land \ v\ =\ \operatorname{FloatValue}(\ell ) \\[0.16em]
\operatorname{LiteralValue}(\ell ,\ \operatorname{TypeRawPtr}(q,\ U))\ =\ \operatorname{RawPtr}(q,\ 0\mathsf{x0})\ \Leftrightarrow \ \ell .\mathsf{kind}\ =\ \mathsf{NullLiteral}
\end{array}
$$

**(EvalSigma-Literal)**

$$
\begin{array}{l}
T\ =\ \operatorname{ExprType}(\operatorname{Literal}(\ell ))\quad \operatorname{LiteralValue}(\ell ,\ T)\ =\ v \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Literal}(\ell ),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma )
\end{array}
$$

**(EvalSigma-PtrNull)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{PtrNullExpr},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{Ptr}@\operatorname{Null}(0\mathsf{x0})),\ \sigma )
\end{array}
$$

**(EvalSigma-Ident)**

$$
\begin{array}{l}
\operatorname{LookupVal}(\sigma ,\ x)\ =\ v \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Identifier}(x),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma )
\end{array}
$$

**(EvalSigma-Path)**

$$
\begin{array}{l}
\operatorname{LookupValPath}(\sigma ,\ \mathsf{path},\ \mathsf{name})\ =\ v \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Path}(\mathsf{path},\ \mathsf{name}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma )
\end{array}
$$

**(EvalSigma-ErrorExpr)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{ErrorExpr}(\_),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma )
\end{array}
$$

Name and path evaluation panics if the referenced module is poisoned:

**(EvalSigma-Ident-Poison)**

$$
\begin{array}{l}
\operatorname{LookupBind}(\sigma ,\ x)\ \mathsf{undefined}\quad \Gamma \ \vdash \ \operatorname{ResolveValueName}(x)\ \Downarrow \ \mathsf{ent}\quad \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ \mathsf{mp}\quad \operatorname{PoisonedModule}(\sigma ,\ \operatorname{PathOfModule}(\mathsf{mp})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Identifier}(x),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma )
\end{array}
$$

**(EvalSigma-Ident-Poison-RecordCtor)**

$$
\begin{array}{l}
\operatorname{LookupBind}(\sigma ,\ x)\ \mathsf{undefined}\quad \Gamma \ \vdash \ \operatorname{ResolveValueName}(x)\ \Uparrow \quad \Gamma \ \vdash \ \operatorname{ResolveRecordPath}([],\ x)\ \Downarrow \ p\quad \operatorname{SplitLast}(p)\ =\ (\mathsf{mp},\ \_)\quad \operatorname{PoisonedModule}(\sigma ,\ \mathsf{mp}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Identifier}(x),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma )
\end{array}
$$

**(EvalSigma-Path-Poison)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveQualified}(\mathsf{path},\ \mathsf{name},\ \mathsf{ValueKind})\ \Downarrow \ \mathsf{ent}\quad \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ \mathsf{mp}\quad \operatorname{PoisonedModule}(\sigma ,\ \operatorname{PathOfModule}(\mathsf{mp})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Path}(\mathsf{path},\ \mathsf{name}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma )
\end{array}
$$

**(EvalSigma-Path-Poison-RecordCtor)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveQualified}(\mathsf{path},\ \mathsf{name},\ \mathsf{ValueKind})\ \Uparrow \quad \Gamma \ \vdash \ \operatorname{ResolveRecordPath}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p\quad \operatorname{SplitLast}(p)\ =\ (\mathsf{mp},\ \_)\quad \operatorname{PoisonedModule}(\sigma ,\ \mathsf{mp}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Path}(\mathsf{path},\ \mathsf{name}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma )
\end{array}
$$

The panic record carries reason `InitPanic(mp)` per §24.5.2; lowering of the poison check is defined by `CheckPoison` (§24.7.13).

### 16.1.6 Lowering

**(Lower-Expr-Literal)**

$$
\begin{array}{l}
T\ =\ \operatorname{ExprType}(\operatorname{Literal}(\ell ))\quad \operatorname{LiteralValue}(\ell ,\ T)\ =\ v \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{Literal}(\ell ))\ \Downarrow \ \langle \varepsilon ,\ v\rangle
\end{array}
$$

**(Lower-Expr-PtrNull)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\mathsf{PtrNullExpr})\ \Downarrow \ \langle \varepsilon ,\ \mathsf{Ptr}@\operatorname{Null}(0\mathsf{x0})\rangle
\end{array}
$$

**(Lower-Expr-Ident-Local)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveValueName}(x)\ \Downarrow \ \mathsf{ent}\quad \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ \bot \quad \Gamma \ \vdash \ \operatorname{LowerReadPlace}(\operatorname{Identifier}(x))\ \Downarrow \ \langle \mathsf{IR},\ v\rangle \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{Identifier}(x))\ \Downarrow \ \langle \mathsf{IR},\ v\rangle
\end{array}
$$

**(Lower-Expr-Ident-Path)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveValueName}(x)\ \Downarrow \ \mathsf{ent}\quad \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ \mathsf{mp}\quad \mathsf{name}\ =\ (\mathsf{ent}.\mathsf{target}_{\mathsf{opt}}\ \mathsf{if}\ \mathsf{present},\ \mathsf{else}\ x)\quad \operatorname{PathOfModule}(\mathsf{mp})\ =\ \mathsf{path} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{Identifier}(x))\ \Downarrow \ \langle \operatorname{ReadPathIR}(\mathsf{path},\ \mathsf{name}),\ v\rangle
\end{array}
$$

**(Lower-Expr-Path)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{Path}(\mathsf{path},\ \mathsf{name}))\ \Downarrow \ \langle \operatorname{ReadPathIR}(\mathsf{path},\ \mathsf{name}),\ v\rangle
\end{array}
$$

**(Lower-Expr-Error)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{ErrorExpr}(\mathsf{span}))\ \Downarrow \ \langle \operatorname{LowerPanic}(\operatorname{ErrorExpr}(\mathsf{span})),\ v_{\mathsf{unreach}}\rangle
\end{array}
$$

### 16.1.7 Diagnostics

Diagnostics are defined for unresolved qualified names, explicit float suffix mismatch during checking, null literals used without an expected raw-pointer type, and literal values that do not fit the required primitive type.
