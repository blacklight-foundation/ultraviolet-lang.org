---
title: "Expressions"
description: "16. Expressions of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
generatedAt: "2026-05-14T00:55:03.609Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
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
\mathsf{Expr}\ =\ \operatorname{Literal}(\mathsf{lit})\ \mid \ \mathsf{PtrNullExpr}\ \mid \ \operatorname{Identifier}(\mathsf{name})\ \mid \ \operatorname{QualifiedName}(\mathsf{path},\ \mathsf{name})\ \mid \ \operatorname{Path}(\mathsf{path},\ \mathsf{name})\ \mid \ \operatorname{ErrorExpr}(\mathsf{span})\ \mid \ \ldots  \\[0.16em]
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
\operatorname{BuiltinModalStaticSig}(\mathsf{path},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow  \\[0.16em]
\ (\mathsf{path}\ =\ [\texttt{"Region"}]\ \land \ \mathsf{name}\ =\ \texttt{new\_scoped}\ \land \ \operatorname{RegionProcSig}(\texttt{Region::new\_scoped})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle )\ \lor  \\[0.16em]
\ (\mathsf{path}\ =\ [\texttt{"CancelToken"}]\ \land \ \mathsf{name}\ =\ \texttt{new}\ \land \ \operatorname{BuiltinModalProcSig}(\texttt{CancelToken::new})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle ) \\[0.16em]
\operatorname{ValuePathType}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{StaticType}(\mathsf{path},\ \mathsf{name})\ \mathsf{if}\ \operatorname{StaticType}(\mathsf{path},\ \mathsf{name})\ \mathsf{defined} \\[0.16em]
\operatorname{ValuePathType}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{TypeFunc}([\langle \mathsf{mode},\ T\rangle \ \mid \ \langle \mathsf{mode},\ x,\ T\rangle \ \in \ \mathsf{params}],\ \mathsf{ret})\ \mathsf{if}\ \operatorname{BuiltinModalStaticSig}(\mathsf{path},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle  \\[0.16em]
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
\operatorname{IntSuffix}(\mathsf{lit})\ =\ t\ \Leftrightarrow \ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{IntLiteral}\ \land \ \operatorname{StripIntSuffix}(\operatorname{Lexeme}(\mathsf{lit}))\ =\ \langle \_,\ t\rangle  \\[0.16em]
\operatorname{FloatSuffix}(\mathsf{lit})\ =\ t\ \Leftrightarrow \ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{FloatLiteral}\ \land \ \operatorname{StripFloatSuffix}(\operatorname{Lexeme}(\mathsf{lit}))\ =\ \langle \_,\ t\rangle  \\[0.16em]
\operatorname{NoFloatSuffix}(\mathsf{lit})\ \Leftrightarrow \ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{FloatLiteral}\ \land \ \operatorname{StripFloatSuffix}(\operatorname{Lexeme}(\mathsf{lit}))\ =\ \langle \_,\ \bot \rangle  \\[0.16em]
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

**(Chk-Null-Ptr)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePtr}(U,\ s)\quad s\ \in \ \{\texttt{Null},\ \bot \} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \mathsf{PtrNullExpr}\ \Leftarrow \ T\ \dashv \ \emptyset 
\end{array}
$$

**(Syn-PtrNull-Err)**

$$
\begin{array}{l}
c\ =\ \operatorname{Code}(\mathsf{PtrNull}-\mathsf{Infer}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \mathsf{PtrNullExpr}\ \Rightarrow \ T\ \dashv \ C\ \Uparrow \ c
\end{array}
$$

**(Chk-PtrNull-Err)**

$$
\begin{array}{l}
\lnot \ \operatorname{PtrNullExpected}(T)\quad c\ =\ \operatorname{Code}(\mathsf{PtrNull}-\mathsf{Infer}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \mathsf{PtrNullExpr}\ \Leftarrow \ T\ \dashv \ C\ \Uparrow \ c
\end{array}
$$

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

Name and path evaluation MAY panic if the referenced module is poisoned. The poisoned-module cases are defined by `EvalSigma-Ident-Poison`, `EvalSigma-Ident-Poison-RecordCtor`, `EvalSigma-Path-Poison`, and `EvalSigma-Path-Poison-RecordCtor`.

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
\Gamma \ \vdash \ \operatorname{ResolveValueName}(x)\ \Downarrow \ \mathsf{ent}\quad \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ \bot \quad \Gamma \ \vdash \ \operatorname{LowerReadPlace}(\operatorname{Identifier}(x))\ \Downarrow \ \langle \mathsf{IR},\ v\rangle  \\[0.16em]
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
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypeArray}(T,\ \mathsf{len})\quad \Gamma \ \vdash \ e_{2}\ :\ \operatorname{TypePrim}(\texttt{usize})\quad \operatorname{ConstIndex}(e_{2})\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e_{2})\ \Downarrow \ i\quad \Gamma \ \vdash \ \operatorname{ConstLen}(\mathsf{len})\ \Downarrow \ n\quad i\ <\ n\quad \operatorname{BitcopyType}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\ T
\end{array}
$$

**(T-Index-Array-Dynamic)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypeArray}(T,\ \mathsf{len})\quad \Gamma \ \vdash \ e_{2}\ :\ \operatorname{TypePrim}(\texttt{usize})\quad \lnot \ \operatorname{ConstIndex}(e_{2})\quad \mathsf{InDynamicContext}\quad \operatorname{BitcopyType}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\ T
\end{array}
$$

**(T-Index-Array-Perm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypePerm}(p,\ \operatorname{TypeArray}(T,\ \mathsf{len}))\quad \Gamma \ \vdash \ e_{2}\ :\ \operatorname{TypePrim}(\texttt{usize})\quad \operatorname{ConstIndex}(e_{2})\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e_{2})\ \Downarrow \ i\quad \Gamma \ \vdash \ \operatorname{ConstLen}(\mathsf{len})\ \Downarrow \ n\quad i\ <\ n\quad \operatorname{BitcopyType}(\operatorname{TypePerm}(p,\ T)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\ \operatorname{TypePerm}(p,\ T)
\end{array}
$$

**(T-Index-Array-Perm-Dynamic)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypePerm}(p,\ \operatorname{TypeArray}(T,\ \mathsf{len}))\quad \Gamma \ \vdash \ e_{2}\ :\ \operatorname{TypePrim}(\texttt{usize})\quad \lnot \ \operatorname{ConstIndex}(e_{2})\quad \mathsf{InDynamicContext}\quad \operatorname{BitcopyType}(\operatorname{TypePerm}(p,\ T)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\ \operatorname{TypePerm}(p,\ T)
\end{array}
$$

**(T-Index-Slice)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypeSlice}(T)\quad \Gamma \ \vdash \ e_{2}\ :\ \operatorname{TypePrim}(\texttt{usize})\quad \operatorname{BitcopyType}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\ T
\end{array}
$$

**(T-Index-Slice-Perm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypePerm}(p,\ \operatorname{TypeSlice}(T))\quad \Gamma \ \vdash \ e_{2}\ :\ \operatorname{TypePrim}(\texttt{usize})\quad \operatorname{BitcopyType}(\operatorname{TypePerm}(p,\ T)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\ \operatorname{TypePerm}(p,\ T)
\end{array}
$$

**(T-Slice-From-Array)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypeArray}(T,\ n)\quad \Gamma ;\ R;\ L\ \vdash \ e_{2}\ :\ \mathsf{Range}\quad \operatorname{RangeIndexType}(\operatorname{ExprType}(e_{2}))\quad \operatorname{BitcopyType}(\operatorname{TypeSlice}(T)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\ \operatorname{TypeSlice}(T)
\end{array}
$$

**(T-Slice-From-Array-Perm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypePerm}(p,\ \operatorname{TypeArray}(T,\ n))\quad \Gamma ;\ R;\ L\ \vdash \ e_{2}\ :\ \mathsf{Range}\quad \operatorname{RangeIndexType}(\operatorname{ExprType}(e_{2}))\quad \operatorname{BitcopyType}(\operatorname{TypePerm}(p,\ \operatorname{TypeSlice}(T))) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\ \operatorname{TypePerm}(p,\ \operatorname{TypeSlice}(T))
\end{array}
$$

**(T-Slice-From-Slice)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypeSlice}(T)\quad \Gamma ;\ R;\ L\ \vdash \ e_{2}\ :\ \mathsf{Range}\quad \operatorname{RangeIndexType}(\operatorname{ExprType}(e_{2}))\quad \operatorname{BitcopyType}(\operatorname{TypeSlice}(T)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IndexAccess}(e_{1},\ e_{2})\ :\ \operatorname{TypeSlice}(T)
\end{array}
$$

**(T-Slice-From-Slice-Perm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e_{1}\ :\ \operatorname{TypePerm}(p,\ \operatorname{TypeSlice}(T))\quad \Gamma ;\ R;\ L\ \vdash \ e_{2}\ :\ \mathsf{Range}\quad \operatorname{RangeIndexType}(\operatorname{ExprType}(e_{2}))\quad \operatorname{BitcopyType}(\operatorname{TypePerm}(p,\ \operatorname{TypeSlice}(T))) \\[0.16em]
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
\operatorname{IsPlace}(e)\quad \lnot \ \operatorname{BitcopyType}(\operatorname{ExprType}(e))\quad c\ =\ \operatorname{Code}(\mathsf{ValueUse}-\mathsf{NonBitcopyPlace}) \\[0.16em]
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

Bounds failures in scalar and range indexing evaluate to `Ctrl(Panic)` as defined by `EvalSigma-Index-OOB` and `EvalSigma-Index-Range-OOB`. Base and index control-flow propagation are defined by `EvalSigma-FieldAccess-Ctrl`, `EvalSigma-TupleAccess-Ctrl`, `EvalSigma-Index-Ctrl-Base`, and `EvalSigma-Index-Ctrl-Idx`.

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

Diagnostics are defined for unknown or inaccessible record fields, tuple indexing on non-tuples, non-constant tuple indices, tuple index out of bounds, non-`usize` array indices, non-constant array indices outside dynamic-checking contexts, out-of-bounds array and slice access, indexing non-indexable values, direct field access on unions, and value use of non-`Bitcopy` places.

Scalar indexing of arrays and slices is governed by the `TypePrim(`usize`)` requirement in §12.4.4. The corresponding non-`usize` diagnostics are `Index-Array-NonUsize` and `Index-Slice-NonUsize`. Scalar out-of-bounds access and range out-of-bounds slicing lower to panic through `EvalSigma-Index-OOB` and `EvalSigma-Index-Range-OOB`.

## 16.3 Call Expressions

### 16.3.1 Syntax

```text
call_expr         ::= postfix_expr "(" argument_list? ")"
generic_call_expr ::= postfix_expr generic_args "(" argument_list? ")"
method_call_expr  ::= postfix_expr "~>" identifier "(" argument_list? ")"
argument_list     ::= argument ("," argument)*
argument          ::= "move"? expression
```

Qualified applications with parenthesized arguments parse before name resolution as `QualifiedApply(path, name, Paren(args))`.

### 16.3.2 Parsing

**(Postfix-Call)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseArgList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{args})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{")"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PostfixStep}(P,\ e)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{Call}(e,\ \mathsf{args}))
\end{array}
$$

**(Postfix-Call-TypeArgs)**

$$
\begin{array}{l}
\operatorname{CallTypeArgsStart}(P)\quad \Gamma \ \vdash \ \operatorname{ParseGenericArgs}(P)\ \Downarrow \ (P_{1},\ \mathsf{targs})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseArgList}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{args})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{")"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PostfixStep}(P,\ e)\ \Downarrow \ (\operatorname{Advance}(P_{2}),\ \operatorname{CallTypeArgs}(e,\ \mathsf{targs},\ \mathsf{args}))
\end{array}
$$

**(Postfix-MethodCall)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"\~{}>"})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{name})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseArgList}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{args})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{")"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PostfixStep}(P,\ e)\ \Downarrow \ (\operatorname{Advance}(P_{2}),\ \operatorname{MethodCall}(e,\ \mathsf{name},\ \mathsf{args}))
\end{array}
$$

**(Parse-Qualified-Apply-Paren)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseQualifiedHead}(P)\ \Downarrow \ (P_{1},\ \mathsf{path},\ \mathsf{name})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseArgList}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{args})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{")"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (\operatorname{Advance}(P_{2}),\ \operatorname{QualifiedApply}(\mathsf{path},\ \mathsf{name},\ \operatorname{Paren}(\mathsf{args})))
\end{array}
$$

**(Parse-ArgList-Empty)**, **(Parse-ArgList-Cons)**, **(Parse-Arg)**, **(Parse-ArgMoveOpt-None)**, **(Parse-ArgMoveOpt-Yes)**, **(Parse-ArgTail-End)**, **(Parse-ArgTail-TrailingComma)**, and **(Parse-ArgTail-Comma)** define argument-list parsing and move-mark parsing.

### 16.3.3 AST Representation / Form

$$
\mathsf{Arg}\ =\ \langle \mathsf{moved},\ \mathsf{expr},\ \mathsf{span}\rangle \quad \mathsf{moved}\ \in \ \{\mathsf{true},\ \mathsf{false}\}
$$

$$
\mathsf{Expr}\ =\ \operatorname{Call}(\mathsf{callee},\ \mathsf{args})\ \mid \ \operatorname{CallTypeArgs}(\mathsf{callee},\ \mathsf{type}_{\mathsf{args}},\ \mathsf{args})\ \mid \ \operatorname{MethodCall}(\mathsf{base},\ \mathsf{name},\ \mathsf{args})\ \mid \ \operatorname{QualifiedApply}(\mathsf{path},\ \mathsf{name},\ \operatorname{Paren}(\mathsf{args}))\ \mid \ \ldots 
$$

$$
\begin{array}{l}
\operatorname{ArgMoved}(\langle \mathsf{moved},\ e,\ \mathsf{span}\rangle )\ =\ \mathsf{moved} \\[0.16em]
\operatorname{ArgExpr}(\langle \mathsf{moved},\ e,\ \mathsf{span}\rangle )\ =\ e
\end{array}
$$

$$
\begin{array}{l}
\operatorname{MovedArg}(\mathsf{moved},\ e)\ = \\[0.16em]
\ \{\ \operatorname{MoveExpr}(e)\ \mathsf{if}\ \mathsf{moved}\ =\ \mathsf{true}\ \land \ \operatorname{IsPlace}(e) \\[0.16em]
\quad e\quad \mathsf{otherwise}\ \}
\end{array}
$$

Qualified parenthesized applications are pre-resolution forms. Name resolution rewrites them to:

- `Call(Path(path', name'), args')` for value and built-in paths
- `Call(Path(mp, name'), args')` for record default-constructor references
- `EnumLiteral(FullPath(p, name), Paren(ArgsExprs(args')))` for tuple enum constructors

### 16.3.4 Static Semantics

$$
\begin{array}{l}
\mathsf{UnresolvedExpr}\ =\ \{\operatorname{QualifiedName}(\_,\ \_),\ \operatorname{QualifiedApply}(\_,\ \_,\ \_)\} \\[0.16em]
\mathsf{ExprJudg}\ =\ \{\Gamma ;\ R;\ L\ \vdash \ e\ :\ T,\ \Gamma ;\ R;\ L\ \vdash \ e\ \Leftarrow \ T\ \dashv \ C,\ \Gamma ;\ R;\ L\ \vdash \ p\ :\mathsf{place}\ T,\ \Gamma ;\ R;\ L\ \vdash \ p\ \Leftarrow_{\mathsf{place}} \ T,\ \Gamma ;\ R;\ L\ \vdash \ r\ :\ \mathsf{Range}\} \\[0.16em]
\mathsf{ArgsOkTJudg}\ =\ \{\mathsf{ArgsOk}_{T}\} \\[0.16em]
\operatorname{ParamMode}(\langle \mathsf{mode},\ T\rangle )\ =\ \mathsf{mode} \\[0.16em]
\operatorname{ParamType}(\langle \mathsf{mode},\ T\rangle )\ =\ T \\[0.16em]
\operatorname{PlaceType}(p)\ =\ T\ \Leftrightarrow \ \Gamma ;\ R;\ L\ \vdash \ p\ :\mathsf{place}\ T \\[0.16em]
\operatorname{HasSourceProvenance}(e)\ \Leftrightarrow \ (\exists \ \pi .\ \Gamma ;\ \Omega \ \vdash \ e\ \Downarrow \ \pi \ \land \ \pi \ \ne \ \bot ) \\[0.16em]
\operatorname{CallTemp}(e)\ =\ p_{\mathsf{tmp}}\ \mathsf{where}\ \lnot \ \operatorname{HasSourceProvenance}(e)\ \land \ \operatorname{Lifetime}(p_{\mathsf{tmp}})\ =\ \mathsf{CallExtent}\ \land \ \operatorname{ValueOf}(p_{\mathsf{tmp}})\ =\ e \\[0.16em]
\operatorname{RefArgExpr}(e)\ =\ \{\ e\ \mathsf{if}\ \operatorname{HasSourceProvenance}(e)\ ;\ \operatorname{CallTemp}(e)\ \mathsf{otherwise}\ \} \\[0.16em]
\operatorname{ConsumeArgExpr}(\mathsf{mode},\ \mathsf{moved},\ e)\ = \\[0.16em]
\ \{\ \operatorname{MovedArg}(\mathsf{moved},\ e)\quad \mathsf{if}\ \mathsf{mode}\ =\ \texttt{move}\ \land \ \mathsf{moved}\ =\ \mathsf{true} \\[0.16em]
\quad \operatorname{MovedArg}(\mathsf{true},\ \operatorname{CallTemp}(e))\ \mathsf{if}\ \mathsf{mode}\ =\ \texttt{move}\ \land \ \mathsf{moved}\ =\ \mathsf{false}\ \land \ \lnot \ \operatorname{HasSourceProvenance}(e) \\[0.16em]
\quad e\quad \mathsf{otherwise}\ \} \\[0.16em]
\operatorname{ArgType}(p,\ a)\ = \\[0.16em]
\ \{\ \operatorname{ExprType}(\operatorname{ConsumeArgExpr}(\operatorname{ParamMode}(p),\ \operatorname{ArgMoved}(a),\ \operatorname{ArgExpr}(a)))\quad \mathsf{if}\ \operatorname{ParamMode}(p)\ =\ \texttt{move} \\[0.16em]
\quad \operatorname{PlaceType}(\operatorname{RefArgExpr}(\operatorname{ArgExpr}(a)))\quad \mathsf{if}\ \operatorname{ParamMode}(p)\ =\ \bot \ \}
\end{array}
$$

**(ArgsT-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk_T}([],\ [])
\end{array}
$$

**(ArgsT-Cons)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \operatorname{ConsumeArgExpr}(\texttt{move},\ \mathsf{moved},\ e)\ \Leftarrow \ T_{p}\ \dashv \ \emptyset \quad (\mathsf{moved}\ =\ \mathsf{true}\ \lor \ (\mathsf{moved}\ =\ \mathsf{false}\ \land \ \lnot \ \operatorname{HasSourceProvenance}(e)))\quad \Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk_T}(\mathsf{ps},\ \mathsf{as}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk_T}([\langle \texttt{move},\ T_{p}\rangle ]\ \mathbin{++} \ \mathsf{ps},\ [\langle \mathsf{moved},\ e,\ \_\rangle ]\ \mathbin{++} \ \mathsf{as})
\end{array}
$$

**(ArgsT-Cons-Ref)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \operatorname{RefArgExpr}(e)\ \Leftarrow_{\mathsf{place}} \ T_{p}\quad \operatorname{AddrOfOk}(\operatorname{RefArgExpr}(e))\quad \mathsf{moved}\ =\ \mathsf{false}\quad \Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk_T}(\mathsf{ps},\ \mathsf{as}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk_T}([\langle \bot ,\ T_{p}\rangle ]\ \mathbin{++} \ \mathsf{ps},\ [\langle \mathsf{moved},\ e,\ \_\rangle ]\ \mathbin{++} \ \mathsf{as})
\end{array}
$$

**(T-Call-Generic-Infer)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \operatorname{GenericCallInference}(\mathsf{callee},\ \mathsf{args},\ \bot )\ \Downarrow \ [A_{1},\ \ldots ,\ A_{n}]\quad \Gamma ;\ R;\ L\ \vdash \ \operatorname{CallTypeArgs}(\mathsf{callee},\ [A_{1},\ \ldots ,\ A_{n}],\ \mathsf{args})\ :\ R_{c} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Call}(\mathsf{callee},\ \mathsf{args})\ :\ R_{c}
\end{array}
$$

**(T-Call)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{callee}\ :\ \operatorname{TypeFunc}(\mathsf{params},\ R_{c})\quad \Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk_T}(\mathsf{params},\ \mathsf{args}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Call}(\mathsf{callee},\ \mathsf{args})\ :\ R_{c}
\end{array}
$$

**(Call-Callee-NotFunc)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{callee}\ :\ T\quad T\ \ne \ \operatorname{TypeFunc}(\_,\ \_)\quad \lnot (\operatorname{RecordCallee}(\mathsf{callee})\ \land \ \mathsf{args}\ =\ [])\quad c\ =\ \operatorname{Code}(\mathsf{Call}-\mathsf{Callee}-\mathsf{NotFunc}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Call}(\mathsf{callee},\ \mathsf{args})\ \Uparrow \ c
\end{array}
$$

**(Call-ArgCount-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{callee}\ :\ \operatorname{TypeFunc}(\mathsf{params},\ \_)\quad \mid \mathsf{params}\mid \ \ne \ \mid \mathsf{args}\mid \quad c\ =\ \operatorname{Code}(\mathsf{Call}-\mathsf{ArgCount}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Call}(\mathsf{callee},\ \mathsf{args})\ \Uparrow \ c
\end{array}
$$

**(Call-ArgType-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{callee}\ :\ \operatorname{TypeFunc}(\mathsf{params},\ \_)\quad \exists \ i.\ \lnot (\Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgType}(\mathsf{params}[i],\ \mathsf{args}[i])\ \mathrel{<:} \ \operatorname{ParamType}(\mathsf{params}[i]))\quad c\ =\ \operatorname{Code}(\mathsf{Call}-\mathsf{ArgType}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Call}(\mathsf{callee},\ \mathsf{args})\ \Uparrow \ c
\end{array}
$$

**(Call-Move-Missing)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{callee}\ :\ \operatorname{TypeFunc}(\mathsf{params},\ \_)\quad \exists \ i.\ \operatorname{ParamMode}(\mathsf{params}[i])\ =\ \texttt{move}\ \land \ \operatorname{ArgMoved}(\mathsf{args}[i])\ =\ \mathsf{false}\ \land \ \operatorname{HasSourceProvenance}(\operatorname{ArgExpr}(\mathsf{args}[i]))\quad c\ =\ \operatorname{Code}(\mathsf{Call}-\mathsf{Move}-\mathsf{Missing}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Call}(\mathsf{callee},\ \mathsf{args})\ \Uparrow \ c
\end{array}
$$

**(Call-Move-Unexpected)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{callee}\ :\ \operatorname{TypeFunc}(\mathsf{params},\ \_)\quad \exists \ i.\ \operatorname{ParamMode}(\mathsf{params}[i])\ =\ \bot \ \land \ \operatorname{ArgMoved}(\mathsf{args}[i])\ =\ \mathsf{true}\quad c\ =\ \operatorname{Code}(\mathsf{Call}-\mathsf{Move}-\mathsf{Unexpected}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Call}(\mathsf{callee},\ \mathsf{args})\ \Uparrow \ c
\end{array}
$$

**(Call-Arg-Packed-Unsafe-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{callee}\ :\ \operatorname{TypeFunc}(\mathsf{params},\ \_)\quad \exists \ i.\ \operatorname{ParamMode}(\mathsf{params}[i])\ =\ \bot \ \land \ \operatorname{PackedField}(\operatorname{ArgExpr}(\mathsf{args}[i]))\ \land \ \lnot \ \operatorname{UnsafeSpan}(\operatorname{span}(\operatorname{ArgExpr}(\mathsf{args}[i])))\quad c\ =\ \operatorname{Code}(\mathsf{Packed}-\mathsf{Field}-\mathsf{Unsafe}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Call}(\mathsf{callee},\ \mathsf{args})\ \Uparrow \ c
\end{array}
$$

**(Call-Arg-NotPlace)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{callee}\ :\ \operatorname{TypeFunc}(\mathsf{params},\ \_)\quad \exists \ i.\ \operatorname{ParamMode}(\mathsf{params}[i])\ =\ \bot \ \land \ \operatorname{HasSourceProvenance}(\operatorname{ArgExpr}(\mathsf{args}[i]))\ \land \ \lnot \ \operatorname{IsPlace}(\operatorname{ArgExpr}(\mathsf{args}[i]))\quad c\ =\ \operatorname{Code}(\mathsf{Call}-\mathsf{Arg}-\mathsf{NotPlace}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Call}(\mathsf{callee},\ \mathsf{args})\ \Uparrow \ c
\end{array}
$$

**(Chk-Call-Generic-Infer)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \operatorname{GenericCallInference}(\mathsf{callee},\ \mathsf{args},\ T_{\mathsf{exp}})\ \Downarrow \ [A_{1},\ \ldots ,\ A_{n}]\quad \Gamma ;\ R;\ L\ \vdash \ \operatorname{CallTypeArgs}(\mathsf{callee},\ [A_{1},\ \ldots ,\ A_{n}],\ \mathsf{args})\ :\ R_{c}\quad \Gamma \ \vdash \ R_{c}\ \mathrel{<:} \ T_{\mathsf{exp}} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Call}(\mathsf{callee},\ \mathsf{args})\ \Leftarrow \ T_{\mathsf{exp}}\ \dashv \ \emptyset 
\end{array}
$$

Explicit and inferred type-argument calls use `CallTypeArgs`. Their bound checking, defaulted argument completion, omitted-argument inference, and elaboration to monomorphic `Call` are defined in §14.2.4.

Method-call typing is defined in §15.2.4 for concrete receivers and in §14.6.4 for dynamic `$Class` receivers. Record-default construction via `Call(callee, [])` is defined in §16.6.4. Calls whose callee has closure type are defined in §16.9.4.

Calls to `extern` procedures outside `unsafe` are rejected by the FFI boundary rule in §23.2.4.

### 16.3.5 Dynamic Semantics

**(EvalSigma-Call-Closure)**

$$
\begin{array}{l}
\operatorname{ExprType}(\mathsf{callee})\ =\ \operatorname{TypeClosure}(\_,\ \_,\ \_)\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{ClosureCall}(\mathsf{callee},\ \mathsf{args}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Call}(\mathsf{callee},\ \mathsf{args}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Call-RegionProc)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{callee},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{FuncVal}(\mathsf{sym})),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{BuiltinModalSym}(\texttt{Region::}\mathsf{name})\ \Downarrow \ \mathsf{sym}\quad \operatorname{RegionProcParams}(\mathsf{name})\ =\ \mathsf{params}\quad \Gamma \ \vdash \ \operatorname{EvalArgsSigma}(\mathsf{params},\ \mathsf{args},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{v}),\ \sigma_{2} )\quad \Gamma \ \vdash \ \operatorname{ApplyRegionProc}(\mathsf{name},\ \mathsf{vec}_{v},\ \sigma_{2} )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Call}(\mathsf{callee},\ \mathsf{args}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} )
\end{array}
$$

**(EvalSigma-Call-RegionProc-Ctrl-Args)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{callee},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{FuncVal}(\mathsf{sym})),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{BuiltinModalSym}(\texttt{Region::}\mathsf{name})\ \Downarrow \ \mathsf{sym}\quad \operatorname{RegionProcParams}(\mathsf{name})\ =\ \mathsf{params}\quad \Gamma \ \vdash \ \operatorname{EvalArgsSigma}(\mathsf{params},\ \mathsf{args},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Call}(\mathsf{callee},\ \mathsf{args}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Call-CancelProc)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{callee},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{FuncVal}(\mathsf{sym})),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{BuiltinModalSym}(\texttt{CancelToken::}\mathsf{name})\ \Downarrow \ \mathsf{sym}\quad \operatorname{CancelProcParams}(\mathsf{name})\ =\ \mathsf{params}\quad \Gamma \ \vdash \ \operatorname{EvalArgsSigma}(\mathsf{params},\ \mathsf{args},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{v}),\ \sigma_{2} )\quad \Gamma \ \vdash \ \operatorname{ApplyCancelProc}(\mathsf{name},\ \mathsf{vec}_{v},\ \sigma_{2} )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Call}(\mathsf{callee},\ \mathsf{args}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} )
\end{array}
$$

**(EvalSigma-Call-CancelProc-Ctrl-Args)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{callee},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{FuncVal}(\mathsf{sym})),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{BuiltinModalSym}(\texttt{CancelToken::}\mathsf{name})\ \Downarrow \ \mathsf{sym}\quad \operatorname{CancelProcParams}(\mathsf{name})\ =\ \mathsf{params}\quad \Gamma \ \vdash \ \operatorname{EvalArgsSigma}(\mathsf{params},\ \mathsf{args},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Call}(\mathsf{callee},\ \mathsf{args}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Call-Proc)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{callee},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{c}),\ \sigma_{1} )\quad \mathsf{proc}\ =\ \operatorname{CallTarget}(v_{c})\quad \Gamma \ \vdash \ \operatorname{EvalArgsSigma}(\mathsf{proc}.\mathsf{params},\ \mathsf{args},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{v}),\ \sigma_{2} )\quad \Gamma \ \vdash \ \operatorname{ApplyProcSigma}(\mathsf{proc},\ \mathsf{vec}_{v},\ \sigma_{2} )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Call}(\mathsf{callee},\ \mathsf{args}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} )
\end{array}
$$

**(EvalSigma-Call-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{callee},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{c}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalArgsSigma}([],\ \mathsf{args},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{v}),\ \sigma_{2} )\quad \mathsf{vec}_{v}\ =\ []\quad \operatorname{RecordCtor}(p)\ =\ \operatorname{CallTarget}(v_{c})\quad \Gamma \ \vdash \ \operatorname{ApplyRecordCtorSigma}(p,\ \sigma_{2} )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Call}(\mathsf{callee},\ \mathsf{args}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} )
\end{array}
$$

**(EvalSigma-MethodCall)**

$$
\begin{array}{l}
\mathsf{mode}\ =\ \operatorname{RecvArgMode}(\mathsf{base})\quad \Gamma \ \vdash \ \operatorname{EvalRecvSigma}(\mathsf{base},\ \mathsf{mode},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\langle v_{\mathsf{self}},\ v_{\mathsf{arg}}\rangle ),\ \sigma_{1} )\quad m\ =\ \operatorname{MethodTarget}(v_{\mathsf{self}},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{EvalArgsSigma}(m.\mathsf{params},\ \mathsf{args},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{v}),\ \sigma_{2} )\quad \Gamma \ \vdash \ \operatorname{ApplyMethodSigma}(\mathsf{base},\ \mathsf{name},\ v_{\mathsf{self}},\ v_{\mathsf{arg}},\ \mathsf{vec}_{v},\ \sigma_{2} )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{MethodCall}(\mathsf{base},\ \mathsf{name},\ \mathsf{args}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} )
\end{array}
$$

**(EvalSigma-Call-Ctrl)** and **(EvalSigma-Call-Ctrl-Args)** propagate control results from callee and argument evaluation.

**(EvalSigma-MethodCall-Ctrl)** and **(EvalSigma-MethodCall-Ctrl-Args)** propagate control results from receiver evaluation and argument evaluation.

`CallTypeArgs` is elaborated to `Call` before evaluation. Closure-typed calls use the closure-application rules owned by §16.9.5.

### 16.3.6 Lowering

**(Lower-Args-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerArgs}([],\ [])\ \Downarrow \ \langle \varepsilon ,\ []\rangle 
\end{array}
$$

**(Lower-Args-Cons-Move)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{MovedArg}(\mathsf{moved},\ e))\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle \quad \Gamma \ \vdash \ \operatorname{LowerArgs}(\mathsf{ps},\ \mathsf{as})\ \Downarrow \ \langle \mathsf{IR}_{a},\ \mathsf{vec}_{v}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerArgs}([\langle \texttt{move},\ x,\ T_{p}\rangle ]\ \mathbin{++} \ \mathsf{ps},\ [\langle \mathsf{moved},\ e,\ \_\rangle ]\ \mathbin{++} \ \mathsf{as})\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{e},\ \mathsf{IR}_{a}),\ [v]\ \mathbin{++} \ \mathsf{vec}_{v}\rangle 
\end{array}
$$

**(Lower-Args-Cons-Ref)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerAddrOf}(\operatorname{RefArgExpr}(e))\ \Downarrow \ \langle \mathsf{IR}_{e},\ \mathsf{addr}\rangle \quad \Gamma \ \vdash \ \operatorname{LowerArgs}(\mathsf{ps},\ \mathsf{as})\ \Downarrow \ \langle \mathsf{IR}_{a},\ \mathsf{vec}_{v}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerArgs}([\langle \bot ,\ x,\ T_{p}\rangle ]\ \mathbin{++} \ \mathsf{ps},\ [\langle \mathsf{moved},\ e,\ \_\rangle ]\ \mathbin{++} \ \mathsf{as})\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{e},\ \mathsf{IR}_{a}),\ [\mathsf{Ptr}@\operatorname{Valid}(\mathsf{addr})]\ \mathbin{++} \ \mathsf{vec}_{v}\rangle 
\end{array}
$$

**(Lower-Expr-Call-Closure)**

$$
\begin{array}{l}
\operatorname{ExprType}(\mathsf{callee})\ =\ \operatorname{TypeClosure}(\_,\ \_,\ \_)\quad \Gamma \ \vdash \ \operatorname{LowerClosureCall}(\mathsf{callee},\ \mathsf{args})\ \Downarrow \ \langle \mathsf{IR},\ v\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{Call}(\mathsf{callee},\ \mathsf{args}))\ \Downarrow \ \langle \mathsf{IR},\ v\rangle 
\end{array}
$$

**(Lower-Expr-Call-PanicOut)** and **(Lower-Expr-Call-NoPanicOut)** lower ordinary calls after callee and argument evaluation.

**(Lower-MethodCall-Static-PanicOut)**, **(Lower-MethodCall-Static-NoPanicOut)**, **(Lower-MethodCall-Capability)**, and **(Lower-MethodCall-Dynamic)** lower concrete, capability, and dynamic dispatch method calls.

`CallTypeArgs` does not survive lowering; §14.2.6 requires elaboration to monomorphic `Call` first. Closure-call lowering is owned by §16.9.6.

### 16.3.7 Diagnostics

Diagnostics are defined for non-callable callees, wrong argument count, wrong argument type, missing `move` at consuming call sites, unexpected `move` on by-reference parameters, non-place reference arguments, packed-field by-reference arguments outside `unsafe`, calls to `extern` procedures outside `unsafe`, unresolved qualified parenthesized applications, and the closure-specific conditions owned by §16.9.7.

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
\operatorname{UnOp}(\texttt{"widen"},\ v)\ \Downarrow \ \operatorname{ModalVal}(S,\ v)\ \Leftrightarrow \ v\ =\ \operatorname{RecordValue}(\operatorname{ModalStateRef}(\mathsf{modal}_{\mathsf{ref}},\ S),\ \mathsf{fs})
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

## 16.6 Construction Expressions

### 16.6.1 Syntax

```text
tuple_literal       ::= "(" tuple_expr_elements? ")"
tuple_expr_elements ::= expression ";" | expression ("," expression)+
array_literal       ::= "[" array_segment_list? "]"
array_segment_list  ::= array_segment ("," array_segment)*
array_segment       ::= expression | expression ";" expression
record_literal      ::= identifier "{" field_init_list "}" | state_specific_type "{" field_init_list? "}"
field_init_list     ::= field_init ("," field_init)*
field_init          ::= identifier ":" expression | identifier
```

Unit enum constructors and tuple/record enum constructors arise after name resolution from qualified forms. Zero-argument record default construction uses ordinary call syntax and is specified in this section.

### 16.6.2 Parsing

**(Parse-Tuple-Literal)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\quad \operatorname{TupleParen}(P)\quad \Gamma \ \vdash \ \operatorname{ParseTupleExprElems}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{elems})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{")"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{TupleExpr}(\mathsf{elems}))
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

**(Parse-Record-Literal-ModalState)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseModalTypeRef}(P)\ \Downarrow \ (P_{1},\ \mathsf{modal}_{\mathsf{ref}})\quad \operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{"@"})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{state})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseFieldInitList}(\operatorname{Advance}(P_{2}))\ \Downarrow \ (P_{3},\ \mathsf{fields})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{3}),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (\operatorname{Advance}(P_{3}),\ \operatorname{RecordExpr}(\operatorname{ModalStateRef}(\mathsf{modal}_{\mathsf{ref}},\ \mathsf{state}),\ \mathsf{fields}))
\end{array}
$$

**(Parse-Record-Literal)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseTypePath}(P)\ \Downarrow \ (P_{1},\ \mathsf{path})\quad \mid \mathsf{path}\mid \ =\ 1\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseFieldInitList}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{fields})\quad \mathsf{fields}\ \ne \ []\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (\operatorname{Advance}(P_{2}),\ \operatorname{RecordExpr}(\operatorname{TypePath}(\mathsf{path}),\ \mathsf{fields}))
\end{array}
$$

**(Parse-Qualified-Apply-Brace)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseQualifiedHead}(P)\ \Downarrow \ (P_{1},\ \mathsf{path},\ \mathsf{name})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseFieldInitList}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{fields})\quad \mathsf{fields}\ \ne \ []\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (\operatorname{Advance}(P_{2}),\ \operatorname{QualifiedApply}(\mathsf{path},\ \mathsf{name},\ \operatorname{Brace}(\mathsf{fields})))
\end{array}
$$

**(Parse-TupleExprElems-Empty)**, **(Parse-TupleExprElems-Single)**, **(Parse-TupleExprElems-Many)**, **(Parse-ExprList-Cons)**, **(Parse-ExprList-Empty)**, **(Parse-ExprListTail-End)**, **(Parse-ExprListTail-TrailingComma)**, **(Parse-ExprListTail-Comma)**, **(Parse-FieldInitList-Empty)**, **(Parse-FieldInitList-Cons)**, **(Parse-FieldInit-Explicit)**, **(Parse-FieldInit-Shorthand)**, **(Parse-FieldInitTail-End)**, **(Parse-FieldInitTail-TrailingComma)**, and **(Parse-FieldInitTail-Comma)** define the list and shorthand parsing behavior.

### 16.6.3 AST Representation / Form

$$
\mathsf{FieldInit}\ =\ \langle \mathsf{name},\ \mathsf{expr}\rangle 
$$

$$
\mathsf{Expr}\ =\ \operatorname{TupleExpr}(\mathsf{elems})\ \mid \ \operatorname{ArrayExpr}(\mathsf{segments})\ \mid \ \operatorname{RecordExpr}(\mathsf{type}_{\mathsf{ref}},\ \mathsf{fields})\ \mid \ \operatorname{EnumLiteral}(\mathsf{path},\ \mathsf{payload}_{\mathsf{opt}})\ \mid \ \operatorname{QualifiedApply}(\mathsf{path},\ \mathsf{name},\ \operatorname{Brace}(\mathsf{fields}))\ \mid \ \ldots 
$$

$$
\begin{array}{l}
\operatorname{FieldInitNames}(\mathsf{fields})\ =\ [\ f\ \mid \ \langle f,\ \_\rangle \ \in \ \mathsf{fields}\ ] \\[0.16em]
\operatorname{FieldInitSet}(\mathsf{fields})\ =\ \{\ x\ \mid \ x\ \in \ \operatorname{FieldInitNames}(\mathsf{fields})\ \}
\end{array}
$$

Qualified brace applications are pre-resolution forms. After name resolution they become:

- `RecordExpr(TypePath(p), fields')`
- `EnumLiteral(FullPath(p, name), Brace(fields'))`

Qualified parenthesized applications become tuple-enum construction or ordinary calls as determined by name resolution.

### 16.6.4 Static Semantics

**(T-Unit-Literal)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TupleExpr}([])\ :\ \operatorname{TypePrim}(\texttt{()})
\end{array}
$$

**(T-Tuple-Literal)**

$$
\begin{array}{l}
n\ \ge \ 1\quad \forall \ i,\ \Gamma \ \vdash \ e_{i}\ :\ T_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TupleExpr}([e_{1},\ \ldots ,\ e_{n}])\ :\ \operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}])
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


$$
\begin{array}{l}
\operatorname{FieldNames}(R)\ =\ [\ f.\mathsf{name}\ \mid \ f\ \in \ \operatorname{Fields}(R)\ ] \\[0.16em]
\operatorname{FieldNameSet}(R)\ =\ \{\ x\ \mid \ x\ \in \ \operatorname{FieldNames}(R)\ \}
\end{array}
$$

**(T-Record-Literal)**

$$
\begin{array}{l}
\operatorname{RecordDecl}(p)\ =\ R\quad \operatorname{Distinct}(\operatorname{FieldInitNames}(\mathsf{fields}))\quad \operatorname{FieldInitSet}(\mathsf{fields})\ =\ \operatorname{FieldNameSet}(R)\quad \forall \ \langle f,\ e\rangle \ \in \ \mathsf{fields},\ \operatorname{FieldType}(R,\ f)\ =\ T_{f}\ \land \ \operatorname{FieldVisible}(m,\ R,\ f)\ \land \ \Gamma ;\ R;\ L\ \vdash \ e\ \Leftarrow \ T_{f}\ \dashv \ \emptyset  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{RecordExpr}(\operatorname{TypePath}(p),\ \mathsf{fields})\ :\ \operatorname{TypePath}(p)
\end{array}
$$

**(Record-FieldInit-Dup)**

$$
\begin{array}{l}
\operatorname{RecordDecl}(p)\ =\ R\quad \lnot \ \operatorname{Distinct}(\operatorname{FieldInitNames}(\mathsf{fields}))\quad c\ =\ \operatorname{Code}(\mathsf{Record}-\mathsf{FieldInit}-\mathsf{Dup}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{RecordExpr}(\operatorname{TypePath}(p),\ \mathsf{fields})\ \Uparrow \ c
\end{array}
$$

**(Record-FieldInit-Missing)**

$$
\begin{array}{l}
\operatorname{RecordDecl}(p)\ =\ R\quad \operatorname{FieldInitSet}(\mathsf{fields})\ \ne \ \operatorname{FieldNameSet}(R)\quad c\ =\ \operatorname{Code}(\mathsf{Record}-\mathsf{FieldInit}-\mathsf{Missing}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{RecordExpr}(\operatorname{TypePath}(p),\ \mathsf{fields})\ \Uparrow \ c
\end{array}
$$

**(Record-Field-Unknown)** and **(Record-Field-NotVisible)** reject unknown or inaccessible record fields.

**(Record-Field-NonBitcopy-Move)**

$$
\begin{array}{l}
\operatorname{RecordDecl}(p)\ =\ R\quad \exists \ \langle f,\ e\rangle \ \in \ \mathsf{fields}.\ \operatorname{FieldType}(R,\ f)\ =\ T_{f}\ \land \ \lnot \ \operatorname{BitcopyType}(T_{f})\ \land \ \operatorname{IsPlace}(e)\ \land \ e\ \ne \ \operatorname{MoveExpr}(\_)\quad c\ =\ \operatorname{Code}(\mathsf{Record}-\mathsf{Field}-\mathsf{NonBitcopy}-\mathsf{Move}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{RecordExpr}(\operatorname{TypePath}(p),\ \mathsf{fields})\ \Uparrow \ c
\end{array}
$$

**(T-Enum-Lit-Unit)**, **(T-Enum-Lit-Tuple)**, and **(T-Enum-Lit-Record)** type unit, tuple-payload, and record-payload enum constructors after name resolution has identified the target variant and payload shape.

$$
\begin{array}{l}
\operatorname{RecordCallee}(\mathsf{callee})\ =\ R\ \Leftrightarrow \ (\mathsf{callee}\ =\ \operatorname{Identifier}(\mathsf{name})\ \lor \ \mathsf{callee}\ =\ \operatorname{Path}(\mathsf{path},\ \mathsf{name}))\ \land \ \Gamma \ \vdash \ \operatorname{ResolveTypeName}(\mathsf{name})\ \Downarrow \ \mathsf{ent}\ \land \ \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ \mathsf{mp}\ \land \ \mathsf{name}'\ =\ (\mathsf{ent}.\mathsf{target}_{\mathsf{opt}}\ \mathsf{if}\ \mathsf{present},\ \mathsf{else}\ \mathsf{name})\ \land \ \operatorname{RecordDecl}(\operatorname{FullPath}(\operatorname{PathOfModule}(\mathsf{mp}),\ \mathsf{name}'))\ =\ R \\[0.16em]
\operatorname{DefaultConstructible}(R)\ \Leftrightarrow \ \forall \ f\ \in \ \operatorname{Fields}(R).\ f.\mathsf{init}_{\mathsf{opt}}\ \ne \ \bot 
\end{array}
$$

**(T-Record-Default)**

$$
\begin{array}{l}
\operatorname{RecordCallee}(\mathsf{callee})\ =\ R\quad \Gamma \ \vdash \ R\ \mathsf{record}\ \mathsf{wf}\quad \operatorname{DefaultConstructible}(R) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Call}(\mathsf{callee},\ [])\ :\ \operatorname{TypePath}(\operatorname{RecordPath}(R))
\end{array}
$$

**(Record-Default-Init-Err)**

$$
\begin{array}{l}
\operatorname{RecordCallee}(\mathsf{callee})\ =\ R\quad \lnot \ \operatorname{DefaultConstructible}(R)\quad c\ =\ \operatorname{Code}(\mathsf{Record}-\mathsf{Default}-\mathsf{Init}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Call}(\mathsf{callee},\ [])\ \Uparrow \ c
\end{array}
$$

### 16.6.5 Dynamic Semantics

**(EvalSigma-Tuple)** and **(EvalSigma-Tuple-Ctrl)** evaluate tuple elements left to right and produce tuple values.

**(EvalSigma-Array)** and **(EvalSigma-Array-Ctrl)** evaluate array elements left to right and produce array values.

**(EvalSigma-Record)** and **(EvalSigma-Record-Ctrl)** evaluate record field initializers left to right and produce `RecordValue`.

**(EvalSigma-Enum-Unit)**, **(EvalSigma-Enum-Tuple)**, **(EvalSigma-Enum-Tuple-Ctrl)**, **(EvalSigma-Enum-Record)**, and **(EvalSigma-Enum-Record-Ctrl)** evaluate enum payloads and construct `EnumValue`.

Zero-argument default record construction uses `EvalSigma-Call-Record` from §16.3.5.

### 16.6.6 Lowering

**(Lower-Expr-Tuple)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerList}(\mathsf{es})\ \Downarrow \ \langle \mathsf{IR},\ \mathsf{vec}_{v}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{TupleExpr}(\mathsf{es}))\ \Downarrow \ \langle \mathsf{IR},\ (v_{1},\ \ldots ,\ v_{n})\rangle 
\end{array}
$$

**(Lower-Expr-Array)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerArraySegments}(\mathsf{segs})\ \Downarrow \ \langle \mathsf{IR},\ \mathsf{vec}_{v}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{ArrayExpr}(\mathsf{segs}))\ \Downarrow \ \langle \mathsf{IR},\ [v_{1},\ \ldots ,\ v_{n}]\rangle 
\end{array}
$$

**(Lower-Expr-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerFieldInits}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{IR},\ \mathsf{vec}_{f}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{RecordExpr}(\mathsf{tr},\ \mathsf{fields}))\ \Downarrow \ \langle \mathsf{IR},\ \operatorname{RecordValue}(\mathsf{tr},\ \mathsf{vec}_{f})\rangle 
\end{array}
$$

**(Lower-Expr-Enum-Unit)**, **(Lower-Expr-Enum-Tuple)**, and **(Lower-Expr-Enum-Record)** lower the three enum-construction forms.

**(Lower-CallIR-RecordCtor)**

$$
\begin{array}{l}
\operatorname{CallTarget}(\mathsf{callee})\ =\ \operatorname{RecordCtor}(p)\quad \mathsf{args}\ =\ []\quad \operatorname{RecordDefaultInits}(p)\ =\ \mathsf{fields}\quad \Gamma \ \vdash \ \operatorname{LowerFieldInits}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{IR}_{f},\ \mathsf{vec}_{f}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{CallIR}(\mathsf{callee},\ \mathsf{args}))\ \Downarrow \ \langle \mathsf{IR}_{f},\ \operatorname{RecordValue}(\operatorname{TypePath}(p),\ \mathsf{vec}_{f})\rangle 
\end{array}
$$

### 16.6.7 Diagnostics

Diagnostics are defined for duplicate record-field initializers, missing record-field initializers, unknown or inaccessible record fields, non-`move` construction from non-`Bitcopy` place expressions, unresolved qualified brace constructors, and zero-argument record construction when some fields lack defaults.

## 16.7 Control Expressions

### 16.7.1 Syntax

```text
if_expr        ::= "if" expression if_tail
if_tail        ::= block_expr ("else" (block_expr | if_expr))?
                 | "is" if_case_pattern block_expr ("else" (block_expr | if_expr))?
                 | "is" "{" if_case+ if_case_else? "}"
if_case        ::= if_case_pattern block_expr
if_case_pattern ::= pattern | ":" type
if_case_else   ::= "else" block_expr
loop_expr      ::= "loop" loop_condition? loop_invariant? block_expr
loop_condition ::= expression | pattern (":" type)? "in" expression
loop_invariant ::= "|:" "{" predicate_expr "}"
block_expr     ::= "{" statement* expression? "}"
```

Pattern forms, case-clause parsing, and exhaustiveness notions are owned by Chapter 17. In an `if ... is` case position, `: T` is a type-test pattern shorthand and elaborates to the discard typed pattern `_: T`; it is not general pattern syntax outside `if_case_pattern`. Loop-invariant obligations are owned by §15.7.
Block structure, statement sequencing, terminator handling, and block-local typing are owned by §18.1.

### 16.7.2 Parsing

**(Parse-If-Expr)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{if})\quad \Gamma \ \vdash \ \operatorname{ParseExpr_NoBrace}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ c)\quad \lnot \ \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{is})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{b1})\quad \Gamma \ \vdash \ \operatorname{ParseElseOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{b2}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (P_{3},\ \operatorname{IfExpr}(c,\ \mathsf{b1},\ \mathsf{b2}))
\end{array}
$$

**(Parse-If-Is-Single)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{if})\quad \Gamma \ \vdash \ \operatorname{ParseExpr_NoBrace}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e)\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{is})\quad \lnot \ \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P_{1})),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseIfCasePattern}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{pat})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{b1})\quad \Gamma \ \vdash \ \operatorname{ParseElseOpt}(P_{3})\ \Downarrow \ (P_{4},\ \mathsf{b2}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (P_{4},\ \operatorname{IfIsExpr}(e,\ \mathsf{pat},\ \mathsf{b1},\ \mathsf{b2}))
\end{array}
$$

**(Parse-If-Is-TypeTest)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseIfCasePattern}(P)\ \Downarrow \ (P_{1},\ \operatorname{TypedPattern}(\texttt{"\_"},\ T))
\end{array}
$$

**(Parse-If-Is-CaseList)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{if})\quad \Gamma \ \vdash \ \operatorname{ParseExpr_NoBrace}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e)\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{is})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P_{1})),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseIfCases}(\operatorname{Advance}(\operatorname{Advance}(P_{1})))\ \Downarrow \ (P_{2},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (\operatorname{Advance}(P_{2}),\ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}}))
\end{array}
$$

**(Parse-Loop-Expr)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{loop})\quad \Gamma \ \vdash \ \operatorname{ParseLoopTail}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{loop}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (P_{1},\ \mathsf{loop})
\end{array}
$$

**(Parse-Block-Expr)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(P)\ \Downarrow \ (P_{1},\ b) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (P_{1},\ b)
\end{array}
$$

**(Parse-IfCases-Cons)**, **(Parse-IfCase)**, **(Parse-IfCasesTail-End)**, **(Parse-IfCasesTail-Else)**, **(Parse-IfCasesTail-Cons)**, **(Parse-LoopTail-Infinite)**, **(Parse-LoopTail-Iter)**, **(Parse-LoopTail-Cond)**, **(TryParsePatternIn-Ok)**, **(TryParsePatternIn-Fail)**, **(Parse-ElseOpt-None)**, **(Parse-ElseOpt-If)**, and **(Parse-ElseOpt-Block)** define the remaining control-expression parsing details.

### 16.7.3 AST Representation / Form

$$
\mathsf{Expr}\ =\ \operatorname{IfExpr}(\mathsf{cond},\ \mathsf{then}_{\mathsf{block}},\ \mathsf{else}_{\mathsf{opt}})\ \mid \ \operatorname{IfIsExpr}(\mathsf{scrutinee},\ \mathsf{pattern},\ \mathsf{then}_{\mathsf{block}},\ \mathsf{else}_{\mathsf{opt}})\ \mid \ \operatorname{IfCaseExpr}(\mathsf{scrutinee},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ \mid \ \operatorname{LoopInfinite}(\mathsf{inv}_{\mathsf{opt}},\ \mathsf{body})\ \mid \ \operatorname{LoopConditional}(\mathsf{cond},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body})\ \mid \ \operatorname{LoopIter}(\mathsf{pattern},\ \mathsf{type}_{\mathsf{opt}},\ \mathsf{iter},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body})\ \mid \ \operatorname{BlockExpr}(\mathsf{stmts},\ \mathsf{tail}_{\mathsf{opt}})\ \mid \ \ldots 
$$

$$
\begin{array}{l}
\mathsf{LoopInvariantOpt}\ \in \ \{\bot \}\ \cup \ \mathsf{Expr} \\[0.16em]
\mathsf{IfCase}\ =\ \langle \mathsf{pattern},\ \mathsf{body}\rangle 
\end{array}
$$

`if_case_pattern` does not add a distinct AST node. `: T` MUST be represented as `TypedPattern("_", T)` before semantic analysis.

$$
\begin{array}{l}
\operatorname{LoopTypeInf}(\mathsf{Brk},\ \mathsf{BrkVoid})\ = \\[0.16em]
\ \{\ \operatorname{TypePrim}(\texttt{!})\quad \mathsf{if}\ \mathsf{Brk}\ =\ []\ \land \ \mathsf{BrkVoid}\ =\ \mathsf{false} \\[0.16em]
\quad \operatorname{TypePrim}(\texttt{()})\ \mathsf{if}\ \mathsf{Brk}\ =\ []\ \land \ \mathsf{BrkVoid}\ =\ \mathsf{true} \\[0.16em]
\quad T\quad \mathsf{if}\ \mathsf{BrkVoid}\ =\ \mathsf{false}\ \land \ \operatorname{ResType}(\mathsf{Brk})\ =\ T \\[0.16em]
\quad \bot \quad \mathsf{otherwise}\ \}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LoopTypeFin}(\mathsf{Brk},\ \mathsf{BrkVoid})\ = \\[0.16em]
\ \{\ \operatorname{TypePrim}(\texttt{()})\ \mathsf{if}\ \mathsf{Brk}\ =\ [] \\[0.16em]
\quad T\quad \mathsf{if}\ \mathsf{BrkVoid}\ =\ \mathsf{false}\ \land \ \operatorname{ResType}(\mathsf{Brk})\ =\ T \\[0.16em]
\quad \bot \quad \mathsf{otherwise}\ \}
\end{array}
$$

### 16.7.4 Static Semantics

Block typing and checking are owned by §18.1.4:

- `BlockInfo(BlockExpr(stmts, tail_opt)) ⇓ ⟨T, Brk, BrkVoid⟩`
- `T-Block`
- `Chk-Block-Tail`
- `Chk-Block-Return`
- `Chk-Block-Unit`

**(T-If)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ c\ :\ \operatorname{TypePrim}(\texttt{bool})\quad \Gamma ;\ R;\ L\ \vdash \ b_{t}\ :\ T\quad \Gamma ;\ R;\ L\ \vdash \ b_{f}\ :\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfExpr}(c,\ b_{t},\ b_{f})\ :\ T
\end{array}
$$

**(T-If-No-Else)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ c\ :\ \operatorname{TypePrim}(\texttt{bool})\quad \Gamma ;\ R;\ L\ \vdash \ b_{t}\ :\ \operatorname{TypePrim}(\texttt{()}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfExpr}(c,\ b_{t},\ \bot )\ :\ \operatorname{TypePrim}(\texttt{()})
\end{array}
$$

**(Chk-If)** and **(Chk-If-No-Else)** define checking-mode validation for the same two forms.

Pattern typing uses Chapter 17 pattern judgments:

- `Γ ⊢ pat ◁ T ⊣ B` for case binding
- `CaseScope(Γ, e, pat, T)` for pattern bindings and scrutinee narrowing
- `HasIrrefutableCase(cases, T)` and the exhaustiveness conditions from §17.6

**(T-If-Is)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T_{s}\quad \operatorname{CaseScope}(\Gamma ,\ e,\ \mathsf{pat},\ T_{s})\ \Downarrow \ \Gamma_{1} \quad \operatorname{ElseScope}(\Gamma ,\ e,\ \mathsf{pat},\ T_{s})\ \Downarrow \ \Gamma_{2} \quad \Gamma_{1} ;\ R;\ L\ \vdash \ b_{t}\ :\ T\quad \Gamma_{2} ;\ R;\ L\ \vdash \ b_{f}\ :\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfIsExpr}(e,\ \mathsf{pat},\ b_{t},\ b_{f})\ :\ T
\end{array}
$$

**(T-If-Is-No-Else)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T_{s}\quad \operatorname{CaseScope}(\Gamma ,\ e,\ \mathsf{pat},\ T_{s})\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} ;\ R;\ L\ \vdash \ b_{t}\ :\ \operatorname{TypePrim}(\texttt{()}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfIsExpr}(e,\ \mathsf{pat},\ b_{t},\ \bot )\ :\ \operatorname{TypePrim}(\texttt{()})
\end{array}
$$

`T-IfCase-Other` types case analysis when all case bodies synthesize the same type and the case set is exhaustive or a fallback block is present. `T-IfCase-Enum`, `T-IfCase-Modal`, and `T-IfCase-Union` are the specialized forms for enum, modal, and union scrutinees.

**(Chk-IfIs)** and **(Chk-IfIs-No-Else)** define checking-mode validation for single-case `if ... is ...`.
**(Chk-IfCase-Other)**, **(Chk-IfCase-Enum)**, **(Chk-IfCase-Modal)**, and **(Chk-IfCase-Union)** define checking-mode validation for `if ... is { ... }`.

Loop invariants use `LoopInvOk` from §15.7.4.

**(T-Loop-Infinite)**

$$
\begin{array}{l}
\operatorname{LoopInvOk}(\mathsf{inv}_{\mathsf{opt}})\quad \Gamma ;\ R;\ \texttt{loop}\ \vdash \ \operatorname{BlockInfo}(\mathsf{body})\ \Downarrow \ \langle T_{b},\ \mathsf{Brk},\ \mathsf{BrkVoid}\rangle \quad \operatorname{LoopTypeInf}(\mathsf{Brk},\ \mathsf{BrkVoid})\ =\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LoopInfinite}(\mathsf{inv}_{\mathsf{opt}},\ \mathsf{body})\ :\ T
\end{array}
$$

**(T-Loop-Conditional)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{cond}\ :\ \operatorname{TypePrim}(\texttt{bool})\quad \operatorname{LoopInvOk}(\mathsf{inv}_{\mathsf{opt}})\quad \Gamma ;\ R;\ \texttt{loop}\ \vdash \ \operatorname{BlockInfo}(\mathsf{body})\ \Downarrow \ \langle T_{b},\ \mathsf{Brk},\ \mathsf{BrkVoid}\rangle \quad \operatorname{LoopTypeFin}(\mathsf{Brk},\ \mathsf{BrkVoid})\ =\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LoopConditional}(\mathsf{cond},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body})\ :\ T
\end{array}
$$

**(T-Loop-Iter)**

$$
\begin{array}{l}
(\Gamma ;\ R;\ L\ \vdash \ \mathsf{iter}\ :\ T_{\mathsf{iter}})\quad \operatorname{LoopIterableType}(T_{\mathsf{iter}},\ T)\quad (\operatorname{RangeLoopType}(T_{\mathsf{iter}},\ T)\ \Rightarrow \ \operatorname{ImplementsStep}(T))\quad (\operatorname{BoundedRangeLoopType}(T_{\mathsf{iter}},\ T)\ \Rightarrow \ \operatorname{ImplementsEq}(T))\quad (\mathsf{ty}_{\mathsf{opt}}\ =\ \bot \ \Rightarrow \ T_{p}\ =\ T)\quad (\mathsf{ty}_{\mathsf{opt}}\ =\ T_{a}\ \Rightarrow \ \Gamma \ \vdash \ T\ \mathrel{<:} \ T_{a}\ \land \ T_{p}\ =\ T_{a})\quad \Gamma \ \vdash \ \mathsf{pat}\ \Leftarrow \ T_{p}\ \dashv \ B\quad \operatorname{Distinct}(\operatorname{PatNames}(\mathsf{pat}))\quad \operatorname{LoopInvOk}(\mathsf{inv}_{\mathsf{opt}})\quad \Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \operatorname{IntroAll}(\Gamma_{0} ,\ B)\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} ;\ R;\ \texttt{loop}\ \vdash \ \operatorname{BlockInfo}(\mathsf{body})\ \Downarrow \ \langle T_{b},\ \mathsf{Brk},\ \mathsf{BrkVoid}\rangle \quad \operatorname{LoopTypeFin}(\mathsf{Brk},\ \mathsf{BrkVoid})\ =\ T_{r} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LoopIter}(\mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{iter},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body})\ :\ T_{r}
\end{array}
$$

**(T-Loop-Iter-Async)** and **(Loop-Async-Err)** define the async-iterator case and its rejection when the enclosing return type is not compatible. Async-specific composition semantics remain in Chapter 21.

### 16.7.5 Dynamic Semantics

**(EvalSigma-If-True)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{cond},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{true}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{then}_{\mathsf{block}},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{IfExpr}(\mathsf{cond},\ \mathsf{then}_{\mathsf{block}},\ \mathsf{else}_{\mathsf{opt}}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-If-False-None)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{cond},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{false}),\ \sigma_{1} )\quad \mathsf{else}_{\mathsf{opt}}\ =\ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{IfExpr}(\mathsf{cond},\ \mathsf{then}_{\mathsf{block}},\ \mathsf{else}_{\mathsf{opt}}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(()),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-If-False-Some)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{cond},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{false}),\ \sigma_{1} )\quad \mathsf{else}_{\mathsf{opt}}\ =\ e\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{IfExpr}(\mathsf{cond},\ \mathsf{then}_{\mathsf{block}},\ \mathsf{else}_{\mathsf{opt}}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-If-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{cond},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{IfExpr}(\mathsf{cond},\ \mathsf{then}_{\mathsf{block}},\ \mathsf{else}_{\mathsf{opt}}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-If-Is)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{scrutinee},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{s}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalIfCaseListSigma}([\langle \mathsf{pat},\ \mathsf{then}_{\mathsf{block}}\rangle ],\ \mathsf{else}_{\mathsf{opt}},\ v_{s},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{IfIsExpr}(\mathsf{scrutinee},\ \mathsf{pat},\ \mathsf{then}_{\mathsf{block}},\ \mathsf{else}_{\mathsf{opt}}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-If-Is-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{scrutinee},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{IfIsExpr}(\mathsf{scrutinee},\ \mathsf{pat},\ \mathsf{then}_{\mathsf{block}},\ \mathsf{else}_{\mathsf{opt}}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-If-Cases)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{scrutinee},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{s}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalIfCaseListSigma}(\mathsf{cases},\ \mathsf{else}_{\mathsf{opt}},\ v_{s},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{IfCaseExpr}(\mathsf{scrutinee},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-If-Cases-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{scrutinee},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{IfCaseExpr}(\mathsf{scrutinee},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(EvalIfCase-Fail)**, **(EvalIfCase-Hit)**, **(EvalIfCases-Head)**, **(EvalIfCases-Tail)**, **(EvalIfCases-Else)**, and **(EvalIfCases-None)** define left-to-right matching of case clauses against the scrutinee.

**(EvalSigma-Block)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalBlockSigma}(\operatorname{BlockExpr}(\mathsf{stmts},\ \mathsf{tail}_{\mathsf{opt}}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{BlockExpr}(\mathsf{stmts},\ \mathsf{tail}_{\mathsf{opt}}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LoopIterableType}(T_{\mathsf{iter}},\ T)\ \Leftrightarrow \ T_{\mathsf{iter}}\ =\ \operatorname{TypeSlice}(T)\ \lor \ T_{\mathsf{iter}}\ =\ \operatorname{TypeArray}(T,\ n)\ \lor \ T_{\mathsf{iter}}\ =\ \operatorname{TypeRange}(T)\ \lor \ T_{\mathsf{iter}}\ =\ \operatorname{TypeRangeInclusive}(T)\ \lor \ T_{\mathsf{iter}}\ =\ \operatorname{TypeRangeFrom}(T) \\[0.16em]
\operatorname{LoopIterableType}(\operatorname{TypePerm}(p,\ T_{\mathsf{iter}}),\ T)\ \Leftrightarrow \ \operatorname{LoopIterableType}(T_{\mathsf{iter}},\ T) \\[0.16em]
\operatorname{RangeLoopType}(T_{\mathsf{iter}},\ T)\ \Leftrightarrow \ T_{\mathsf{iter}}\ =\ \operatorname{TypeRange}(T)\ \lor \ T_{\mathsf{iter}}\ =\ \operatorname{TypeRangeInclusive}(T)\ \lor \ T_{\mathsf{iter}}\ =\ \operatorname{TypeRangeFrom}(T) \\[0.16em]
\operatorname{RangeLoopType}(\operatorname{TypePerm}(p,\ T_{\mathsf{iter}}),\ T)\ \Leftrightarrow \ \operatorname{RangeLoopType}(T_{\mathsf{iter}},\ T) \\[0.16em]
\operatorname{BoundedRangeLoopType}(T_{\mathsf{iter}},\ T)\ \Leftrightarrow \ T_{\mathsf{iter}}\ =\ \operatorname{TypeRange}(T)\ \lor \ T_{\mathsf{iter}}\ =\ \operatorname{TypeRangeInclusive}(T) \\[0.16em]
\operatorname{BoundedRangeLoopType}(\operatorname{TypePerm}(p,\ T_{\mathsf{iter}}),\ T)\ \Leftrightarrow \ \operatorname{BoundedRangeLoopType}(T_{\mathsf{iter}},\ T)
\end{array}
$$

$$
\begin{array}{l}
\mathsf{IterJudg}\ =\ \{\operatorname{IterInit}(v)\ \Downarrow \ \mathsf{it},\ \operatorname{IterNext}(\mathsf{it})\ \Downarrow \ (\operatorname{opt}(v),\ \mathsf{it}')\} \\[0.16em]
\mathsf{Iter}\ =\ \{\operatorname{SeqIter}(v,\ i)\ \mid \ \operatorname{Len}(v)\ \mathsf{defined}\ \land \ i\ \in \ \mathbb{N} \}\ \cup \ \{\operatorname{RangeIterExclusive}(\mathsf{cur},\ \mathsf{hi})\}\ \cup \ \{\operatorname{RangeIterInclusive}(\mathsf{cur},\ \mathsf{hi})\}\ \cup \ \{\operatorname{RangeIterFrom}(\mathsf{cur})\}\ \cup \ \{\mathsf{IterDone}\} \\[0.16em]
\operatorname{Successor}(v)\ \Downarrow \ v'\ \Leftrightarrow \ \texttt{Step::successor}\ \mathsf{applied}\ \mathsf{to}\ v\ \mathsf{returns}\ v' \\[0.16em]
\operatorname{EqHolds}(v_{1},\ v_{2})\ \Leftrightarrow \ \texttt{Eq::eq}\ \mathsf{applied}\ \mathsf{to}\ \langle v_{1},\ v_{2}\rangle \ \mathsf{returns}\ \texttt{true}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{IterInit}(v)\ \Downarrow \ \operatorname{SeqIter}(v,\ 0)\ \Leftrightarrow \ \operatorname{Len}(v)\ \mathsf{defined} \\[0.16em]
\operatorname{IterInit}(\operatorname{RangeVal}(\texttt{Exclusive},\ \mathsf{lo},\ \mathsf{hi}))\ \Downarrow \ \operatorname{RangeIterExclusive}(\mathsf{lo},\ \mathsf{hi}) \\[0.16em]
\operatorname{IterInit}(\operatorname{RangeVal}(\texttt{Inclusive},\ \mathsf{lo},\ \mathsf{hi}))\ \Downarrow \ \operatorname{RangeIterInclusive}(\mathsf{lo},\ \mathsf{hi}) \\[0.16em]
\operatorname{IterInit}(\operatorname{RangeVal}(\texttt{From},\ \mathsf{lo},\ \bot ))\ \Downarrow \ \operatorname{RangeIterFrom}(\mathsf{lo})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{IterNext}(\operatorname{SeqIter}(v,\ i))\ \Downarrow \ (\bot ,\ \mathsf{IterDone})\ \Leftrightarrow \ \lnot \ (0\ \le \ i\ <\ \operatorname{Len}(v)) \\[0.16em]
\operatorname{IterNext}(\operatorname{SeqIter}(v,\ i))\ \Downarrow \ (v_{i},\ \operatorname{SeqIter}(v,\ i\ +\ 1))\ \Leftrightarrow \ 0\ \le \ i\ <\ \operatorname{Len}(v)\ \land \ \operatorname{IndexValue}(v,\ i)\ =\ v_{i} \\[0.16em]
\operatorname{IterNext}(\operatorname{RangeIterExclusive}(\mathsf{cur},\ \mathsf{hi}))\ \Downarrow \ (\bot ,\ \mathsf{IterDone})\ \Leftrightarrow \ \operatorname{EqHolds}(\mathsf{cur},\ \mathsf{hi}) \\[0.16em]
\operatorname{IterNext}(\operatorname{RangeIterExclusive}(\mathsf{cur},\ \mathsf{hi}))\ \Downarrow \ (\mathsf{cur},\ \operatorname{RangeIterExclusive}(\mathsf{cur}',\ \mathsf{hi}))\ \Leftrightarrow \ \lnot \ \operatorname{EqHolds}(\mathsf{cur},\ \mathsf{hi})\ \land \ \operatorname{Successor}(\mathsf{cur})\ \Downarrow \ \mathsf{cur}' \\[0.16em]
\operatorname{IterNext}(\operatorname{RangeIterExclusive}(\mathsf{cur},\ \mathsf{hi}))\ \Downarrow \ (\mathsf{cur},\ \mathsf{IterDone})\ \Leftrightarrow \ \lnot \ \operatorname{EqHolds}(\mathsf{cur},\ \mathsf{hi})\ \land \ \lnot \ \exists \ \mathsf{cur}'.\ \operatorname{Successor}(\mathsf{cur})\ \Downarrow \ \mathsf{cur}' \\[0.16em]
\operatorname{IterNext}(\operatorname{RangeIterInclusive}(\mathsf{cur},\ \mathsf{hi}))\ \Downarrow \ (\mathsf{cur},\ \mathsf{IterDone})\ \Leftrightarrow \ \operatorname{EqHolds}(\mathsf{cur},\ \mathsf{hi}) \\[0.16em]
\operatorname{IterNext}(\operatorname{RangeIterInclusive}(\mathsf{cur},\ \mathsf{hi}))\ \Downarrow \ (\mathsf{cur},\ \operatorname{RangeIterInclusive}(\mathsf{cur}',\ \mathsf{hi}))\ \Leftrightarrow \ \lnot \ \operatorname{EqHolds}(\mathsf{cur},\ \mathsf{hi})\ \land \ \operatorname{Successor}(\mathsf{cur})\ \Downarrow \ \mathsf{cur}' \\[0.16em]
\operatorname{IterNext}(\operatorname{RangeIterInclusive}(\mathsf{cur},\ \mathsf{hi}))\ \Downarrow \ (\mathsf{cur},\ \mathsf{IterDone})\ \Leftrightarrow \ \lnot \ \operatorname{EqHolds}(\mathsf{cur},\ \mathsf{hi})\ \land \ \lnot \ \exists \ \mathsf{cur}'.\ \operatorname{Successor}(\mathsf{cur})\ \Downarrow \ \mathsf{cur}' \\[0.16em]
\operatorname{IterNext}(\operatorname{RangeIterFrom}(\mathsf{cur}))\ \Downarrow \ (\mathsf{cur},\ \operatorname{RangeIterFrom}(\mathsf{cur}'))\ \Leftrightarrow \ \operatorname{Successor}(\mathsf{cur})\ \Downarrow \ \mathsf{cur}' \\[0.16em]
\operatorname{IterNext}(\operatorname{RangeIterFrom}(\mathsf{cur}))\ \Downarrow \ (\mathsf{cur},\ \mathsf{IterDone})\ \Leftrightarrow \ \lnot \ \exists \ \mathsf{cur}'.\ \operatorname{Successor}(\mathsf{cur})\ \Downarrow \ \mathsf{cur}' \\[0.16em]
\operatorname{IterNext}(\mathsf{IterDone})\ \Downarrow \ (\bot ,\ \mathsf{IterDone})
\end{array}
$$

$$
\mathsf{LoopIterJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{LoopIterExec}(\mathsf{pat},\ \mathsf{body},\ \mathsf{it},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\}
$$

**(EvalSigma-Loop-Infinite-Step)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{body},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{LoopInfinite}(\mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}),\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{LoopInfinite}(\mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Loop-Infinite-Continue)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{body},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Continue}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{LoopInfinite}(\mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}),\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{LoopInfinite}(\mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Loop-Infinite-Break)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{body},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{Break}(v_{\mathsf{opt}})),\ \sigma_{1} )\quad v\ =\ \operatorname{BreakVal}(v_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{LoopInfinite}(\mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Loop-Infinite-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{body},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )\quad \kappa \ \in \ \{\operatorname{Return}(\_),\ \mathsf{Panic},\ \mathsf{Abort}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{LoopInfinite}(\mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Loop-Cond-False)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{cond},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{false}),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{LoopConditional}(\mathsf{cond},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(()),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Loop-Cond-True-Step)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{cond},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{true}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{body},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{2} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{LoopConditional}(\mathsf{cond},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}),\ \sigma_{2} )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{LoopConditional}(\mathsf{cond},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} )
\end{array}
$$

**(EvalSigma-Loop-Cond-Continue)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{cond},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{true}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{body},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Continue}),\ \sigma_{2} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{LoopConditional}(\mathsf{cond},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}),\ \sigma_{2} )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{LoopConditional}(\mathsf{cond},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} )
\end{array}
$$

**(EvalSigma-Loop-Cond-Break)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{cond},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{true}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{body},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{Break}(v_{\mathsf{opt}})),\ \sigma_{2} )\quad v\ =\ \operatorname{BreakVal}(v_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{LoopConditional}(\mathsf{cond},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Loop-Cond-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{cond},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{LoopConditional}(\mathsf{cond},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Loop-Cond-Body-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{cond},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{true}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{body},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} )\quad \kappa \ \in \ \{\operatorname{Return}(\_),\ \mathsf{Panic},\ \mathsf{Abort}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{LoopConditional}(\mathsf{cond},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Loop-Iter)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{iter},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{iter}}),\ \sigma_{1} )\quad \operatorname{IterInit}(v_{\mathsf{iter}})\ \Downarrow \ \mathsf{it}\quad \Gamma \ \vdash \ \operatorname{LoopIterExec}(\mathsf{pat},\ \mathsf{body},\ \mathsf{it},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{LoopIter}(\mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{iter},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Loop-Iter-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{iter},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{LoopIter}(\mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{iter},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(LoopIter-Done)**

$$
\begin{array}{l}
\operatorname{IterNext}(\mathsf{it})\ \Downarrow \ (\bot ,\ \mathsf{it}') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LoopIterExec}(\mathsf{pat},\ \mathsf{body},\ \mathsf{it},\ \sigma )\ \Downarrow \ (\operatorname{Val}(()),\ \sigma )
\end{array}
$$

**(LoopIter-Step-Val)**

$$
\begin{array}{l}
\operatorname{IterNext}(\mathsf{it})\ \Downarrow \ (v,\ \mathsf{it}')\quad \Gamma \ \vdash \ \operatorname{EvalBlockBindSigma}(\mathsf{pat},\ v,\ \mathsf{body},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{b}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{LoopIterExec}(\mathsf{pat},\ \mathsf{body},\ \mathsf{it}',\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LoopIterExec}(\mathsf{pat},\ \mathsf{body},\ \mathsf{it},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

**(LoopIter-Step-Continue)**

$$
\begin{array}{l}
\operatorname{IterNext}(\mathsf{it})\ \Downarrow \ (v,\ \mathsf{it}')\quad \Gamma \ \vdash \ \operatorname{EvalBlockBindSigma}(\mathsf{pat},\ v,\ \mathsf{body},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Continue}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{LoopIterExec}(\mathsf{pat},\ \mathsf{body},\ \mathsf{it}',\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LoopIterExec}(\mathsf{pat},\ \mathsf{body},\ \mathsf{it},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

**(LoopIter-Step-Break)**

$$
\begin{array}{l}
\operatorname{IterNext}(\mathsf{it})\ \Downarrow \ (v,\ \mathsf{it}')\quad \Gamma \ \vdash \ \operatorname{EvalBlockBindSigma}(\mathsf{pat},\ v,\ \mathsf{body},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{Break}(v_{\mathsf{opt}})),\ \sigma_{1} )\quad v'\ =\ \operatorname{BreakVal}(v_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LoopIterExec}(\mathsf{pat},\ \mathsf{body},\ \mathsf{it},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma_{1} )
\end{array}
$$

**(LoopIter-Step-Ctrl)**

$$
\begin{array}{l}
\operatorname{IterNext}(\mathsf{it})\ \Downarrow \ (v,\ \mathsf{it}')\quad \Gamma \ \vdash \ \operatorname{EvalBlockBindSigma}(\mathsf{pat},\ v,\ \mathsf{body},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )\quad \kappa \ \in \ \{\operatorname{Return}(\_),\ \mathsf{Panic},\ \mathsf{Abort}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LoopIterExec}(\mathsf{pat},\ \mathsf{body},\ \mathsf{it},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

### 16.7.6 Lowering

**(Lower-Expr-If)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(\mathsf{cond})\ \Downarrow \ \langle \mathsf{IR}_{c},\ v_{c}\rangle \quad \Gamma \ \vdash \ \operatorname{LowerBlock}(b_{1})\ \Downarrow \ \langle \mathsf{IR}_{1},\ v_{1}\rangle \quad \Gamma \ \vdash \ \operatorname{LowerBlock}(b_{2})\ \Downarrow \ \langle \mathsf{IR}_{2},\ v_{2}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{IfExpr}(\mathsf{cond},\ b_{1},\ b_{2}))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{c},\ \operatorname{IfIR}(v_{c},\ \mathsf{IR}_{1},\ v_{1},\ \mathsf{IR}_{2},\ v_{2})),\ v_{\mathsf{if}}\rangle 
\end{array}
$$

**(Lower-Expr-If-Is)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerIfCases}(\mathsf{scrut},\ [\langle \mathsf{pat},\ b_{t}\rangle ],\ \mathsf{else}_{\mathsf{opt}})\ \Downarrow \ \langle \mathsf{IR},\ v\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{IfIsExpr}(\mathsf{scrut},\ \mathsf{pat},\ b_{t},\ \mathsf{else}_{\mathsf{opt}}))\ \Downarrow \ \langle \mathsf{IR},\ v\rangle 
\end{array}
$$

**(Lower-Expr-If-Cases)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerIfCases}(\mathsf{scrut},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ \Downarrow \ \langle \mathsf{IR},\ v\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{IfCaseExpr}(\mathsf{scrut},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}}))\ \Downarrow \ \langle \mathsf{IR},\ v\rangle 
\end{array}
$$

**(Lower-Expr-LoopInf)**, **(Lower-Expr-LoopCond)**, and **(Lower-Expr-LoopIter)** delegate to `LowerLoop`.

**(Lower-Expr-Block)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerBlock}(\operatorname{BlockExpr}(\mathsf{stmts},\ \mathsf{tail}_{\mathsf{opt}}))\ \Downarrow \ \langle \mathsf{IR},\ v\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{BlockExpr}(\mathsf{stmts},\ \mathsf{tail}_{\mathsf{opt}}))\ \Downarrow \ \langle \mathsf{IR},\ v\rangle 
\end{array}
$$

`LowerBlock`, `Lower-Block-Tail`, and `Lower-Block-Unit` are owned by §18.1.6. **(Lower-Loop-Infinite)**, **(Lower-Loop-Cond)**, and **(Lower-Loop-Iter)** define loop lowering. **(Lower-IfCases)** lowers case-analysis scrutinee evaluation to `IfCaseIR`.

### 16.7.7 Diagnostics

Diagnostics are defined for non-`bool` `if` and conditional-loop conditions, ill-typed `if ... is` case bodies, ill-typed loop iterators, and async iterator loops that violate the enclosing async return/error constraints.

Pattern exhaustiveness and reachability diagnostics for `if ... is { ... }` are owned by §17.6. Loop-invariant diagnostics are owned by §15.7.
Block-expression parse, terminator, and result-join diagnostics are owned by §18.1.7.

## 16.8 Effectful Core Expressions

### 16.8.1 Syntax

```text
unsafe_expr     ::= "unsafe" block_expr
address_of_expr ::= "&" place_expr
move_expr       ::= "move" place_expr
deref_expr      ::= "*" unary_expr
alloc_expr      ::= "^" expression
propagate_expr  ::= postfix_expr "?"
```

After name resolution, `Binary("^", Identifier(r), e)` MAY be rewritten to `AllocExpr(r, e)` when `r` is a region alias.

### 16.8.2 Parsing

**(Parse-Unary-Deref)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"*"})\quad \Gamma \ \vdash \ \operatorname{ParseUnary}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseUnary}(P)\ \Downarrow \ (P_{1},\ \operatorname{Deref}(e))
\end{array}
$$

**(Parse-Unary-AddressOf)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"\&"})\quad \Gamma \ \vdash \ \operatorname{ParsePlace}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ p) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseUnary}(P)\ \Downarrow \ (P_{1},\ \operatorname{AddressOf}(p))
\end{array}
$$

**(Parse-Unary-Move)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{move})\quad \Gamma \ \vdash \ \operatorname{ParsePlace}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ p) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseUnary}(P)\ \Downarrow \ (P_{1},\ \operatorname{MoveExpr}(p))
\end{array}
$$

**(Postfix-Propagate)**
IsOp(Tok(P), "?")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PostfixStep}(P,\ e)\ \Downarrow \ (\operatorname{Advance}(P),\ \operatorname{Propagate}(e))
\end{array}
$$

**(Parse-Alloc-Implicit)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"\^{}"})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (P_{1},\ \operatorname{AllocExpr}(\bot ,\ e))
\end{array}
$$

**(Parse-Unsafe-Expr)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{unsafe})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ b) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (P_{1},\ \operatorname{UnsafeBlockExpr}(b))
\end{array}
$$

### 16.8.3 AST Representation / Form

$$
\mathsf{Expr}\ =\ \operatorname{UnsafeBlockExpr}(\mathsf{body})\ \mid \ \operatorname{MoveExpr}(\mathsf{place})\ \mid \ \operatorname{AddressOf}(\mathsf{place})\ \mid \ \operatorname{Deref}(\mathsf{expr})\ \mid \ \operatorname{AllocExpr}(\mathsf{region}_{\mathsf{opt}},\ \mathsf{expr})\ \mid \ \operatorname{Propagate}(\mathsf{expr})\ \mid \ \ldots 
$$

ResolveExpr-Alloc-Explicit-ByAlias rewrites:

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveValueName}(r)\ \Downarrow \ \mathsf{ent}\quad \operatorname{RegionAlias}(\mathsf{ent})\quad \Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{Binary}(\texttt{"\^{}"},\ \operatorname{Identifier}(r),\ e))\ \Downarrow \ \operatorname{AllocExpr}(r,\ e')
\end{array}
$$

### 16.8.4 Static Semantics

$$
\begin{array}{l}
\operatorname{HasLayoutPacked}(D)\ \Leftrightarrow \ \texttt{layout(packed)}\ \mathsf{appears}\ \mathsf{in}\ D.\mathsf{attrs}_{\mathsf{opt}} \\[0.16em]
\operatorname{PackedField}(p)\ \Leftrightarrow \ p\ =\ \operatorname{FieldAccess}(\mathsf{base},\ f)\ \land \ \operatorname{StripPerm}(\operatorname{ExprType}(\mathsf{base}))\ =\ \operatorname{TypePath}(\mathsf{path})\ \land \ \operatorname{RecordDecl}(\mathsf{path})\ =\ R\ \land \ \operatorname{HasLayoutPacked}(R) \\[0.16em]
\operatorname{AddrOfOk}(p)\ \Leftrightarrow \ \operatorname{IsPlace}(p)\ \land \ (p\ =\ \operatorname{IndexAccess}(\_,\ \mathsf{idx})\ \Rightarrow \ \Gamma ;\ R;\ L\ \vdash \ \mathsf{idx}\ :\ T_{i}\ \land \ \operatorname{StripPerm}(T_{i})\ =\ \operatorname{TypePrim}(\texttt{usize}))\ \land \ (\operatorname{PackedField}(p)\ \Rightarrow \ \operatorname{UnsafeSpan}(\operatorname{span}(p)))
\end{array}
$$

**(T-Unsafe-Expr)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ b\ :\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{UnsafeBlockExpr}(b)\ :\ T
\end{array}
$$

**(Chk-Unsafe-Expr)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ b\ \Leftarrow \ T\ \dashv \ \emptyset  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{UnsafeBlockExpr}(b)\ \Leftarrow \ T\ \dashv \ \emptyset 
\end{array}
$$

**(T-AddrOf)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ p\ :\mathsf{place}\ T\quad \operatorname{AddrOfOk}(p) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{AddressOf}(p)\ :\ \operatorname{TypePtr}(T,\ \texttt{Valid})
\end{array}
$$

**(T-Deref-Ptr)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypePtr}(T,\ \texttt{Valid})\quad \operatorname{BitcopyType}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Deref}(e)\ :\ T
\end{array}
$$

**(T-Deref-Raw)**

$$
\begin{array}{l}
\operatorname{UnsafeSpan}(\operatorname{span}(\operatorname{Deref}(e)))\quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypeRawPtr}(q,\ T)\quad \operatorname{BitcopyType}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Deref}(e)\ :\ T
\end{array}
$$

**(P-Deref-Ptr)**, **(P-Deref-Raw-Imm)**, and **(P-Deref-Raw-Mut)** define place typing for safe and raw dereference.

**(T-Move)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ p\ :\mathsf{place}\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{MoveExpr}(p)\ :\ T
\end{array}
$$

**(T-Alloc-Explicit)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T\quad \Gamma ;\ R;\ L\ \vdash \ \operatorname{Identifier}(r)\ :\ T_{r}\quad \operatorname{RegionActiveType}(T_{r}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{AllocExpr}(r,\ e)\ :\ T
\end{array}
$$

**(T-Alloc-Implicit)**

$$
\begin{array}{l}
\operatorname{InnermostActiveRegion}(\Gamma )\ =\ r\quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{AllocExpr}(\bot ,\ e)\ :\ T
\end{array}
$$

$$
\operatorname{SuccessMember}(R,\ U)\ =\ T_{s}\ \Leftrightarrow \ U\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\ \land \ \lnot (\Gamma \ \vdash \ T_{s}\ \mathrel{<:} \ R)\ \land \ \forall \ i\ \ne \ s.\ \Gamma \ \vdash \ T_{i}\ \mathrel{<:} \ R
$$

**(T-Propagate-Outcome)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \bot \quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ U\quad \operatorname{OutcomeSig}(U)\ =\ \langle T_{s},\ E_{s}\rangle \quad \operatorname{OutcomeSig}(R)\ =\ \langle T_{r},\ E_{r}\rangle \quad \Gamma \ \vdash \ E_{s}\ \mathrel{<:} \ E_{r} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Propagate}(e)\ :\ T_{s}
\end{array}
$$

**(T-Propagate)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \bot \quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ U\quad \operatorname{SuccessMember}(R,\ U)\ =\ T_{s} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Propagate}(e)\ :\ T_{s}
\end{array}
$$

$$
\operatorname{SuccessMemberAsync}(E,\ U)\ =\ T_{s}\ \Leftrightarrow \ U\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\ \land \ \lnot (\Gamma \ \vdash \ T_{s}\ \mathrel{<:} \ E)\ \land \ \forall \ i\ \ne \ s.\ \Gamma \ \vdash \ T_{i}\ \mathrel{<:} \ E
$$

**(T-Async-Try-Outcome)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle \quad E\ \ne \ \operatorname{TypePrim}(\texttt{"!"})\quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ U\quad \operatorname{OutcomeSig}(U)\ =\ \langle T_{s},\ E_{s}\rangle \quad \Gamma \ \vdash \ E_{s}\ \mathrel{<:} \ E \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Propagate}(e)\ :\ T_{s}
\end{array}
$$

**(T-Async-Try)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle \quad E\ \ne \ \operatorname{TypePrim}(\texttt{"!"})\quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ U\quad \operatorname{SuccessMemberAsync}(E,\ U)\ =\ T_{s} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Propagate}(e)\ :\ T_{s}
\end{array}
$$

**(Async-Try-Infallible-Err)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle \quad E\ =\ \operatorname{TypePrim}(\texttt{"!"})\quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ U\quad c\ =\ \operatorname{Code}(E-\mathsf{CON}-0230) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Propagate}(e)\ \Uparrow \ c
\end{array}
$$

### 16.8.5 Dynamic Semantics

**(EvalSigma-UnsafeBlock)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalBlockSigma}(b,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{UnsafeBlockExpr}(b),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')
\end{array}
$$

**(EvalSigma-AddressOf)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{AddrOfSigma}(p,\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{addr}),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{AddressOf}(p),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{Ptr}@\operatorname{Valid}(\mathsf{addr})),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Deref)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{ptr}}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{ReadPtrSigma}(v_{\mathsf{ptr}},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Deref}(e),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Move)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MovePlaceSigma}(p,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{MoveExpr}(p),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Alloc-Implicit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad \operatorname{ActiveTarget}(\sigma_{1} )\ =\ r\quad \operatorname{RegionAlloc}(\sigma_{1} ,\ r,\ v)\ \Downarrow \ (\sigma_{2} ,\ v') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{AllocExpr}(\bot ,\ e),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Alloc-Implicit-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{AllocExpr}(\bot ,\ e),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Alloc-Explicit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad \operatorname{LookupVal}(\sigma_{1} ,\ r)\ =\ v_{r}\quad \operatorname{RegionHandleOf}(v_{r})\ =\ h\quad \operatorname{ResolveTarget}(\sigma_{1} ,\ h)\ =\ r_{t}\quad \operatorname{RegionAlloc}(\sigma_{1} ,\ r_{t},\ v)\ \Downarrow \ (\sigma_{2} ,\ v') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{AllocExpr}(r,\ e),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Alloc-Explicit-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{AllocExpr}(r,\ e),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Propagate-Success-Outcome)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad U\ =\ \operatorname{ExprType}(e)\quad \operatorname{AsyncSig}(\operatorname{RetType}(\Gamma ))\ =\ \bot \quad \operatorname{OutcomeSig}(U)\ =\ \langle T_{s},\ E_{s}\rangle \quad \operatorname{OutcomeSig}(\operatorname{RetType}(\Gamma ))\ =\ \langle T_{r},\ E_{r}\rangle \quad \operatorname{ModalCase}(v)\ =\ \langle \texttt{@Value},\ v_{s}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Propagate}(e),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{FieldValue}(v_{s},\ \texttt{value})),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Propagate-Success-Async-Outcome)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad U\ =\ \operatorname{ExprType}(e)\quad \operatorname{AsyncSig}(\operatorname{RetType}(\Gamma ))\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle \quad \operatorname{OutcomeSig}(U)\ =\ \langle T_{s},\ E_{s}\rangle \quad \operatorname{ModalCase}(v)\ =\ \langle \texttt{@Value},\ v_{s}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Propagate}(e),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{FieldValue}(v_{s},\ \texttt{value})),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Propagate-Error-Outcome)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad U\ =\ \operatorname{ExprType}(e)\quad \operatorname{AsyncSig}(\operatorname{RetType}(\Gamma ))\ =\ \bot \quad \operatorname{OutcomeSig}(U)\ =\ \langle T_{s},\ E_{s}\rangle \quad \operatorname{OutcomeSig}(\operatorname{RetType}(\Gamma ))\ =\ \langle T_{r},\ E_{r}\rangle \quad \operatorname{ModalCase}(v)\ =\ \langle \texttt{@Error},\ v_{e}\rangle  \\[0.16em]
\mathsf{out}\ =\ \texttt{Outcome}<T_{r},\ E_{r}>\texttt{@Error}\{\texttt{error}:\ \operatorname{FieldValue}(v_{e},\ \texttt{error})\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Propagate}(e),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{Return}(\mathsf{out})),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Propagate-Error-Async-Outcome)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad U\ =\ \operatorname{ExprType}(e)\quad \operatorname{AsyncSig}(\operatorname{RetType}(\Gamma ))\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle \quad E\ \ne \ \operatorname{TypePrim}(\texttt{"!"})\quad \operatorname{OutcomeSig}(U)\ =\ \langle T_{s},\ E_{s}\rangle \quad \operatorname{ModalCase}(v)\ =\ \langle \texttt{@Error},\ v_{e}\rangle  \\[0.16em]
\mathsf{async}_{\mathsf{failed}}\ =\ \operatorname{RecordValue}(\operatorname{ModalStateRef}([\texttt{Async}],\ \texttt{@Failed}),\ [\langle \texttt{error},\ \operatorname{FieldValue}(v_{e},\ \texttt{error})\rangle ]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Propagate}(e),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{Fail}(\mathsf{async}_{\mathsf{failed}})),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Propagate-Success-Union)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad U\ =\ \operatorname{ExprType}(e)\quad \operatorname{AsyncSig}(\operatorname{RetType}(\Gamma ))\ =\ \bot \quad \operatorname{SuccessMember}(\operatorname{RetType}(\Gamma ),\ U)\ =\ T_{s}\quad \operatorname{UnionCase}(v)\ =\ \langle T_{s},\ v_{s}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Propagate}(e),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{s}),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Propagate-Success-Async-Union)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad U\ =\ \operatorname{ExprType}(e)\quad \operatorname{AsyncSig}(\operatorname{RetType}(\Gamma ))\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle \quad \operatorname{SuccessMemberAsync}(E,\ U)\ =\ T_{s}\quad \operatorname{UnionCase}(v)\ =\ \langle T_{s},\ v_{s}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Propagate}(e),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{s}),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Propagate-Error-Union)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad U\ =\ \operatorname{ExprType}(e)\quad \operatorname{AsyncSig}(\operatorname{RetType}(\Gamma ))\ =\ \bot \quad \operatorname{SuccessMember}(\operatorname{RetType}(\Gamma ),\ U)\ =\ T_{s}\quad \operatorname{UnionCase}(v)\ =\ \langle T_{e},\ v_{e}\rangle \quad T_{e}\ \ne \ T_{s} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Propagate}(e),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{Return}(v_{e})),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Propagate-Error-Async-Union)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad U\ =\ \operatorname{ExprType}(e)\quad \operatorname{AsyncSig}(\operatorname{RetType}(\Gamma ))\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle \quad E\ \ne \ \operatorname{TypePrim}(\texttt{"!"})\quad \operatorname{SuccessMemberAsync}(E,\ U)\ =\ T_{s}\quad \operatorname{UnionCase}(v)\ =\ \langle T_{e},\ v_{e}\rangle \quad T_{e}\ \ne \ T_{s} \\[0.16em]
\mathsf{async}_{\mathsf{failed}}\ =\ \operatorname{RecordValue}(\operatorname{ModalStateRef}([\texttt{Async}],\ \texttt{@Failed}),\ [\langle \texttt{error},\ v_{e}\rangle ]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Propagate}(e),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{Fail}(\mathsf{async}_{\mathsf{failed}})),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Propagate-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Propagate}(e),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

$$
\begin{array}{l}
\mathsf{ExprState}\ =\ \{\langle e,\ \sigma \rangle ,\ \langle \operatorname{Val}(v),\ \sigma \rangle ,\ \langle \operatorname{Ctrl}(\kappa ),\ \sigma \rangle \} \\[0.16em]
\operatorname{TerminalExpr}(\langle \operatorname{Val}(v),\ \sigma \rangle ) \\[0.16em]
\operatorname{TerminalExpr}(\langle \operatorname{Ctrl}(\kappa ),\ \sigma \rangle )
\end{array}
$$

**(StepSigma-Pure)**

$$
\begin{array}{l}
\langle e\rangle \ \to \ \langle e'\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle e,\ \sigma \rangle \ \to \ \langle e',\ \sigma \rangle 
\end{array}
$$

**(StepSigma-Alloc-Implicit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad \operatorname{ActiveTarget}(\sigma_{1} )\ =\ r\quad \operatorname{RegionAlloc}(\sigma_{1} ,\ r,\ v)\ \Downarrow \ (\sigma_{2} ,\ v') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{AllocExpr}(\bot ,\ e),\ \sigma \rangle \ \to \ \langle \operatorname{Val}(v'),\ \sigma_{2} \rangle 
\end{array}
$$

**(StepSigma-Alloc-Implicit-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{AllocExpr}(\bot ,\ e),\ \sigma \rangle \ \to \ \langle \operatorname{Ctrl}(\kappa ),\ \sigma_{1} \rangle 
\end{array}
$$

**(StepSigma-Alloc-Explicit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad \operatorname{LookupVal}(\sigma_{1} ,\ r)\ =\ v_{r}\quad \operatorname{RegionHandleOf}(v_{r})\ =\ h\quad \operatorname{ResolveTarget}(\sigma_{1} ,\ h)\ =\ r_{t}\quad \operatorname{RegionAlloc}(\sigma_{1} ,\ r_{t},\ v)\ \Downarrow \ (\sigma_{2} ,\ v') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{AllocExpr}(r,\ e),\ \sigma \rangle \ \to \ \langle \operatorname{Val}(v'),\ \sigma_{2} \rangle 
\end{array}
$$

**(StepSigma-Alloc-Explicit-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{AllocExpr}(r,\ e),\ \sigma \rangle \ \to \ \langle \operatorname{Ctrl}(\kappa ),\ \sigma_{1} \rangle 
\end{array}
$$

**(StepSigma-Block)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalBlockSigma}(\operatorname{BlockExpr}(\mathsf{stmts},\ \mathsf{tail}_{\mathsf{opt}}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{BlockExpr}(\mathsf{stmts},\ \mathsf{tail}_{\mathsf{opt}}),\ \sigma \rangle \ \to \ \langle \mathsf{out},\ \sigma '\rangle 
\end{array}
$$

**(StepSigma-UnsafeBlock)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalBlockSigma}(b,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnsafeBlockExpr}(b),\ \sigma \rangle \ \to \ \langle \mathsf{out},\ \sigma '\rangle 
\end{array}
$$

**(StepSigma-Loop)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\ell ,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\quad \ell \ \in \ \{\operatorname{LoopInfinite}(\_,\ \_),\ \operatorname{LoopConditional}(\_,\ \_,\ \_),\ \operatorname{LoopIter}(\_,\ \_,\ \_,\ \_,\ \_)\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \ell ,\ \sigma \rangle \ \to \ \langle \mathsf{out},\ \sigma '\rangle 
\end{array}
$$

**(StepSigma-Stateful-Other)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\quad e\ \notin \ \{\operatorname{AllocExpr}(\_,\ \_),\ \operatorname{BlockExpr}(\_,\ \_),\ \operatorname{UnsafeBlockExpr}(\_),\ \operatorname{LoopInfinite}(\_,\ \_),\ \operatorname{LoopConditional}(\_,\ \_,\ \_),\ \operatorname{LoopIter}(\_,\ \_,\ \_,\ \_,\ \_)\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle e,\ \sigma \rangle \ \to \ \langle \mathsf{out},\ \sigma '\rangle 
\end{array}
$$

### 16.8.6 Lowering

**(Lower-Expr-UnsafeBlock)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerBlock}(b)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{UnsafeBlockExpr}(b))\ \Downarrow \ \langle \mathsf{IR},\ v\rangle 
\end{array}
$$

**(Lower-Expr-Move)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerMovePlace}(p)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{MoveExpr}(p))\ \Downarrow \ \langle \mathsf{IR},\ v\rangle 
\end{array}
$$

**(Lower-Expr-AddressOf)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerAddrOf}(p)\ \Downarrow \ \langle \mathsf{IR},\ \mathsf{addr}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{AddressOf}(p))\ \Downarrow \ \langle \mathsf{IR},\ \mathsf{Ptr}@\operatorname{Valid}(\mathsf{addr})\rangle 
\end{array}
$$

**(Lower-Expr-Deref)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v_{\mathsf{ptr}}\rangle \quad \Gamma \ \vdash \ \operatorname{LowerRawDeref}(v_{\mathsf{ptr}})\ \Downarrow \ \langle \mathsf{IR}_{d},\ v\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{Deref}(e))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{e},\ \mathsf{IR}_{d}),\ v\rangle 
\end{array}
$$

**(Lower-Expr-Alloc)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{AllocExpr}(r_{\mathsf{opt}},\ e))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{e},\ \operatorname{AllocIR}(r_{\mathsf{opt}},\ v)),\ v_{\mathsf{alloc}}\rangle 
\end{array}
$$

**(Lower-Expr-Propagate-Success-Outcome)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle \quad U\ =\ \operatorname{ExprType}(e)\quad \operatorname{OutcomeSig}(U)\ =\ \langle T_{s},\ E_{s}\rangle \quad \operatorname{OutcomeState}(v)\ =\ \texttt{@Value}\quad \operatorname{OutcomeField}(v,\ \texttt{value})\ =\ v_{s} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{Propagate}(e))\ \Downarrow \ \langle \mathsf{IR}_{e},\ v_{s}\rangle 
\end{array}
$$

**(Lower-Expr-Propagate-Return-Outcome)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle \quad U\ =\ \operatorname{ExprType}(e)\quad \operatorname{OutcomeSig}(U)\ =\ \langle T_{s},\ E_{s}\rangle \quad \operatorname{OutcomeState}(v)\ =\ \texttt{@Error}\quad \operatorname{OutcomeField}(v,\ \texttt{error})\ =\ v_{e} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{Propagate}(e))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{e},\ \operatorname{ReturnIR}(\texttt{Outcome@Error}\{\texttt{error}:\ v_{e}\})),\ v_{\mathsf{unreach}}\rangle 
\end{array}
$$

**(Lower-Expr-Propagate-Success-Union)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle \quad U\ =\ \operatorname{ExprType}(e)\quad \operatorname{SuccessMember}(\operatorname{RetType}(\Gamma ),\ U)\ =\ T_{s}\quad \operatorname{UnionCase}(v)\ =\ \langle T_{s},\ v_{s}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{Propagate}(e))\ \Downarrow \ \langle \mathsf{IR}_{e},\ v_{s}\rangle 
\end{array}
$$

**(Lower-Expr-Propagate-Return-Union)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle \quad U\ =\ \operatorname{ExprType}(e)\quad \operatorname{SuccessMember}(\operatorname{RetType}(\Gamma ),\ U)\ =\ T_{s}\quad \operatorname{UnionCase}(v)\ =\ \langle T_{e},\ v_{e}\rangle \quad T_{e}\ \ne \ T_{s} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{Propagate}(e))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{e},\ \operatorname{ReturnIR}(v_{e})),\ v_{\mathsf{unreach}}\rangle 
\end{array}
$$

`LowerRawDeref`, `LowerAddrOf`, and `LowerMovePlace` define the pointer, address, and move-state mechanics used by these expressions.

### 16.8.7 Diagnostics

Diagnostics are defined for address-of on non-places, address-of of packed fields outside `unsafe`, non-`usize` indexing in address-of contexts, dereference of null or expired safe pointers, raw-pointer dereference outside `unsafe`, explicit allocation through a non-region binding, implicit allocation without an active region, and propagation inside async procedures whose error type is `!`.

## 16.9 Closure and Pipeline Expressions

### 16.9.1 Syntax

```text
pipeline_expr      ::= base_postfix_expr ("=>" base_postfix_expr)*
closure_expr       ::= "|" closure_param_list? "|" ("->" type)? closure_body
closure_param_list ::= closure_param ("," closure_param)* ","?
closure_param      ::= "move"? identifier (":" type)?
closure_body       ::= expression | block_expr
```

Trailing commas in `closure_param_list` are permitted only when `TrailingCommaAllowed` (§5.5). A trailing comma does not denote an additional parameter.

Within `closure_expr`, if a typed parameter annotation has a top-level `union_type`, it MUST be parenthesized as `("(" type ")")`. This grouped form is permitted only to disambiguate closure parameter annotations and does not introduce a distinct type constructor.

Closure invocation uses ordinary call syntax; the closure-specific rules for that call form are owned by this section.

### 16.9.2 Parsing

**(Parse-Pipeline)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseBasePostfix}(P)\ \Downarrow \ (P_{1},\ e_{0})\quad \Gamma \ \vdash \ \operatorname{ParsePipelineTail}(P_{1},\ e_{0})\ \Downarrow \ (P_{2},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePipeline}(P)\ \Downarrow \ (P_{2},\ e)
\end{array}
$$

**(Parse-PipelineTail-Stop)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"=>"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePipelineTail}(P,\ e)\ \Downarrow \ (P,\ e)
\end{array}
$$

**(Parse-PipelineTail-Cons)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"=>"})\quad \Gamma \ \vdash \ \operatorname{ParseBasePostfix}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e_{1})\quad \Gamma \ \vdash \ \operatorname{ParsePipelineTail}(P_{1},\ \operatorname{PipelineExpr}(e,\ e_{1}))\ \Downarrow \ (P_{2},\ e_{2}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePipelineTail}(P,\ e)\ \Downarrow \ (P_{2},\ e_{2})
\end{array}
$$

**(Parse-Closure-Expr)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|"})\quad \Gamma \ \vdash \ \operatorname{ParseClosureParams}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{params})\quad \operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{"|"})\quad \Gamma \ \vdash \ \operatorname{ParseClosureRetOpt}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{ret}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseClosureBody}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{body}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (P_{3},\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{body}))
\end{array}
$$

**(Parse-Closure-Expr-Empty)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|"})\quad \operatorname{IsOp}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"|"})\quad \Gamma \ \vdash \ \operatorname{ParseClosureRetOpt}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ \mathsf{ret}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseClosureBody}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{body}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (P_{2},\ \operatorname{ClosureExpr}([],\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{body}))
\end{array}
$$

**(Parse-ClosureParams-Single)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseClosureParam}(P)\ \Downarrow \ (P_{1},\ p)\quad \lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{","}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureParams}(P)\ \Downarrow \ (P_{1},\ [p])
\end{array}
$$

**(Parse-ClosureParams-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseClosureParam}(P)\ \Downarrow \ (P_{1},\ p)\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParseClosureParams}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{ps}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureParams}(P)\ \Downarrow \ (P_{2},\ [p]\ \mathbin{++} \ \mathsf{ps})
\end{array}
$$

**(Parse-ClosureParamType-Grouped)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{ty})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{")"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureParamType}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \mathsf{ty})
\end{array}
$$

**(Parse-ClosureParamType-Plain)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseTypeNoUnion}(P)\ \Downarrow \ (P_{1},\ \mathsf{ty}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureParamType}(P)\ \Downarrow \ (P_{1},\ \mathsf{ty})
\end{array}
$$

**(Parse-ClosureParam-MoveTyped)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{move})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(P)))\quad \mathsf{name}\ =\ \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(P)))\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParseClosureParamType}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P))))\ \Downarrow \ (P_{1},\ \mathsf{ty}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureParam}(P)\ \Downarrow \ (P_{1},\ \langle \mathsf{true},\ \mathsf{name},\ \mathsf{ty}\rangle )
\end{array}
$$

**(Parse-ClosureParam-MoveUntyped)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{move})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(P)))\quad \mathsf{name}\ =\ \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(P)))\quad \lnot \ \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))),\ \texttt{":"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureParam}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P)),\ \langle \mathsf{true},\ \mathsf{name},\ \bot \rangle )
\end{array}
$$

**(Parse-ClosureParam-Typed)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{move})\quad \operatorname{IsIdent}(\operatorname{Tok}(P))\quad \mathsf{name}\ =\ \operatorname{Lexeme}(\operatorname{Tok}(P))\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParseClosureParamType}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ \mathsf{ty}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureParam}(P)\ \Downarrow \ (P_{1},\ \langle \mathsf{false},\ \mathsf{name},\ \mathsf{ty}\rangle )
\end{array}
$$

**(Parse-ClosureParam-Untyped)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{move})\quad \operatorname{IsIdent}(\operatorname{Tok}(P))\quad \mathsf{name}\ =\ \operatorname{Lexeme}(\operatorname{Tok}(P))\quad \lnot \ \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{":"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureParam}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \langle \mathsf{false},\ \mathsf{name},\ \bot \rangle )
\end{array}
$$

**(Parse-ClosureRetOpt-Some)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"->"})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{ty}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureRetOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{ty})
\end{array}
$$

**(Parse-ClosureRetOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"->"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureRetOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-ClosureBody-Block)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(P)\ \Downarrow \ (P_{1},\ b) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureBody}(P)\ \Downarrow \ (P_{1},\ \operatorname{BlockExpr}(b))
\end{array}
$$

**(Parse-ClosureBody-Expr)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(P)\ \Downarrow \ (P_{1},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureBody}(P)\ \Downarrow \ (P_{1},\ e)
\end{array}
$$

### 16.9.3 AST Representation / Form

$$
\mathsf{Expr}\ =\ \operatorname{PipelineExpr}(\mathsf{left},\ \mathsf{right})\ \mid \ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\ \mid \ \ldots 
$$

$$
\begin{array}{l}
\mathsf{ClosureParam}\ =\ \langle \mathsf{move}_{\mathsf{opt}},\ \mathsf{name},\ \mathsf{type}_{\mathsf{opt}}\rangle \quad \mathsf{move}_{\mathsf{opt}}\ \in \ \{\mathsf{true},\ \mathsf{false}\}\quad \mathsf{type}_{\mathsf{opt}}\ \in \ \{\bot \}\ \cup \ \mathsf{Type} \\[0.16em]
\mathsf{ClosureParams}\ =\ [\mathsf{ClosureParam}] \\[0.16em]
\mathsf{ClosureBody}\ =\ \mathsf{Expr}
\end{array}
$$

### 16.9.4 Static Semantics

$$
\begin{array}{l}
\operatorname{FreeVars}(e)\ =\ \{\ x\ \mid \ x\ \in \ \mathsf{Identifier}\ \land \ \operatorname{Bound}(x,\ e)\ \land \ \lnot \ \operatorname{LocallyBound}(x,\ e)\ \} \\[0.16em]
\operatorname{CaptureSet}(C)\ =\ \operatorname{FreeVars}(C.\mathsf{body})\ \setminus \ \{\ p.\mathsf{name}\ \mid \ p\ \in \ C.\mathsf{params}\ \} \\[0.16em]
\operatorname{MoveCaptureSet}(C)\ =\ \{\ x\ \mid \ x\ \in \ \operatorname{CaptureSet}(C)\ \land \ (\exists \ p\ \in \ C.\mathsf{params}.\ p\ =\ \langle \mathsf{true},\ x,\ \_\rangle )\ \} \\[0.16em]
\quad \cup \ \{\ x\ \mid \ x\ \in \ \operatorname{CaptureSet}(C)\ \land \ \operatorname{MoveExpr}(e)\ \in \ C.\mathsf{body}\ \land \ \operatorname{PlaceRoot}(e)\ =\ x\ \} \\[0.16em]
\operatorname{RefCaptureSet}(C)\ =\ \operatorname{CaptureSet}(C)\ \setminus \ \operatorname{MoveCaptureSet}(C) \\[0.16em]
\operatorname{SharedCaptures}(C)\ =\ \{\ x\ \mid \ x\ \in \ \operatorname{CaptureSet}(C)\ \land \ \Gamma (x)\ =\ \operatorname{TypePerm}(\texttt{shared},\ \_)\ \} \\[0.16em]
\operatorname{ConstCaptures}(C)\ =\ \{\ x\ \mid \ x\ \in \ \operatorname{CaptureSet}(C)\ \land \ \Gamma (x)\ =\ \operatorname{TypePerm}(\texttt{const},\ \_)\ \} \\[0.16em]
\operatorname{UniqueCaptures}(C)\ =\ \{\ x\ \mid \ x\ \in \ \operatorname{CaptureSet}(C)\ \land \ \Gamma (x)\ =\ \operatorname{TypePerm}(\texttt{unique},\ \_)\ \}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{IsEscaping}(C)\ \Leftrightarrow \ \operatorname{ExpectedType}(C)\ \ne \ \bot \ \land \ \operatorname{CanEscape}(\operatorname{ExpectedType}(C)) \\[0.16em]
\operatorname{CanEscape}(T)\ \Leftrightarrow \ T\ =\ \operatorname{TypeClosure}(\_,\ \_,\ \_)\ \lor \ (\operatorname{IsGenericType}(T)\ \land \ \lnot \ \operatorname{LocalBound}(T)) \\[0.16em]
\operatorname{IsLocalClosure}(C)\ \Leftrightarrow \ \lnot \ \operatorname{IsEscaping}(C)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Params}(C)\ =\ C.\mathsf{params} \\[0.16em]
\operatorname{Annot}(p)\ =\ p.\mathsf{type}_{\mathsf{opt}}
\end{array}
$$

**(T-Closure-NonCapturing)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{body})\quad \operatorname{CaptureSet}(C)\ =\ \emptyset  \\[0.16em]
\forall \ i.\ \operatorname{ParamType}(\mathsf{params}[i])\ =\ T_{i}\quad (\mathsf{ret}_{\mathsf{opt}}\ \ne \ \bot \ \Rightarrow \ R\ =\ \mathsf{ret}_{\mathsf{opt}})\quad (\mathsf{ret}_{\mathsf{opt}}\ =\ \bot \ \Rightarrow \ \Gamma '\ \vdash \ \mathsf{body}\ :\ R) \\[0.16em]
\Gamma '\ =\ \Gamma \ \cup \ \{\ \mathsf{params}[i].\mathsf{name}\ \mapsto \ T_{i}\ \mid \ i\ \in \ 1..\mid \mathsf{params}\mid \ \}\quad \Gamma '\ \vdash \ \mathsf{body}\ :\ R \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ C\ :\ \operatorname{TypeFunc}([\langle \mathsf{params}[i].\mathsf{move}_{\mathsf{opt}},\ T_{i}\rangle \ \mid \ i\ \in \ 1..\mid \mathsf{params}\mid ],\ R)
\end{array}
$$

**(T-Closure-Capturing)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{body})\quad \operatorname{CaptureSet}(C)\ \ne \ \emptyset \quad \operatorname{IsLocalClosure}(C) \\[0.16em]
\forall \ i.\ \operatorname{ParamType}(\mathsf{params}[i])\ =\ T_{i}\quad (\mathsf{ret}_{\mathsf{opt}}\ \ne \ \bot \ \Rightarrow \ R\ =\ \mathsf{ret}_{\mathsf{opt}})\quad (\mathsf{ret}_{\mathsf{opt}}\ =\ \bot \ \Rightarrow \ \Gamma '\ \vdash \ \mathsf{body}\ :\ R) \\[0.16em]
\operatorname{UniqueCaptures}(C)\ =\ \emptyset  \\[0.16em]
\Gamma '\ =\ \Gamma \ \cup \ \{\ \mathsf{params}[i].\mathsf{name}\ \mapsto \ T_{i}\ \mid \ i\ \in \ 1..\mid \mathsf{params}\mid \ \}\quad \Gamma '\ \vdash \ \mathsf{body}\ :\ R \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ C\ :\ \operatorname{TypeClosure}([\langle \mathsf{params}[i].\mathsf{move}_{\mathsf{opt}},\ T_{i}\rangle \ \mid \ i\ \in \ 1..\mid \mathsf{params}\mid ],\ R,\ \bot )
\end{array}
$$

**(T-Closure-Escaping)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{body})\quad \operatorname{CaptureSet}(C)\ \ne \ \emptyset \quad \operatorname{IsEscaping}(C) \\[0.16em]
\forall \ i.\ \operatorname{ParamType}(\mathsf{params}[i])\ =\ T_{i}\quad (\mathsf{ret}_{\mathsf{opt}}\ \ne \ \bot \ \Rightarrow \ R\ =\ \mathsf{ret}_{\mathsf{opt}})\quad (\mathsf{ret}_{\mathsf{opt}}\ =\ \bot \ \Rightarrow \ \Gamma '\ \vdash \ \mathsf{body}\ :\ R) \\[0.16em]
\operatorname{UniqueCaptures}(C)\ =\ \emptyset  \\[0.16em]
\operatorname{SharedCaptures}(C)\ =\ \{x_{1},\ \ldots ,\ x_{k}\}\quad \mathsf{deps}\ =\ [(x_{j},\ \Gamma (x_{j}))\ \mid \ j\ \in \ 1..k] \\[0.16em]
\Gamma '\ =\ \Gamma \ \cup \ \{\ \mathsf{params}[i].\mathsf{name}\ \mapsto \ T_{i}\ \mid \ i\ \in \ 1..\mid \mathsf{params}\mid \ \}\quad \Gamma '\ \vdash \ \mathsf{body}\ :\ R \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ C\ :\ \operatorname{TypeClosure}([\langle \mathsf{params}[i].\mathsf{move}_{\mathsf{opt}},\ T_{i}\rangle \ \mid \ i\ \in \ 1..\mid \mathsf{params}\mid ],\ R,\ \langle \mathsf{deps}\rangle )
\end{array}
$$

**(K-Closure-Escape-Type)**

$$
\begin{array}{l}
C\ \mathsf{is}\ \mathsf{escaping}\quad \operatorname{SharedCaptures}(C)\ =\ \{x_{1},\ \ldots ,\ x_{n}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{Type}(C)\ =\ \mid \mathsf{vec}_{T}\mid \ \to \ R\ [\texttt{shared}:\ \{x_{1}\ :\ \texttt{shared}\ T_{1},\ \ldots ,\ x_{n}\ :\ \texttt{shared}\ T_{n}\}]
\end{array}
$$

**(Capture-Const)**

$$
\begin{array}{l}
x\ \in \ \operatorname{ConstCaptures}(C) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{CaptureMode}(C,\ x)\ =\ \mathsf{ByRef}
\end{array}
$$

**(Capture-Shared)**

$$
\begin{array}{l}
x\ \in \ \operatorname{SharedCaptures}(C) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{CaptureMode}(C,\ x)\ =\ \mathsf{ByRef}
\end{array}
$$

**(Capture-Unique-Err)**

$$
\begin{array}{l}
x\ \in \ \operatorname{UniqueCaptures}(C)\quad c\ =\ \operatorname{Code}(E-\mathsf{CON}-0120) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ C\ \Uparrow \ c
\end{array}
$$

**(T-ClosureCall)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{callee}\ :\ \operatorname{TypeClosure}(\mathsf{params},\ R_{c},\ \_)\quad \Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk_T}(\mathsf{params},\ \mathsf{args}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Call}(\mathsf{callee},\ \mathsf{args})\ :\ R_{c}
\end{array}
$$

**(Infer-Closure-Params)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ C\ \Leftarrow \ \operatorname{TypeFunc}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ],\ R_{t})\ \dashv \ \emptyset \quad \operatorname{Params}(C)\ =\ [p_{1},\ \ldots ,\ p_{n}]\quad \forall \ i.\ (\operatorname{Annot}(p_{i})\ =\ \bot \ \Rightarrow \ \operatorname{ParamType}(p_{i})\ =\ T_{i})\ \land \ (\operatorname{Annot}(p_{i})\ =\ T_{i}'\ \Rightarrow \ \Gamma \ \vdash \ T_{i}'\ \equiv \ T_{i}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{InferClosureParams}(C)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(Infer-Closure-Params-Err)**

$$
\begin{array}{l}
\exists \ i.\ \operatorname{Annot}(\operatorname{Params}(C)\_i)\ =\ \bot \quad \operatorname{ExpectedType}(C)\ =\ \bot \quad c\ =\ \operatorname{Code}(E-\mathsf{SEM}-2591) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{InferClosureParams}(C)\ \Uparrow \ c
\end{array}
$$

**(Infer-Closure-Return)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \bot ,\ \mathsf{body})\quad \Gamma '\ =\ \Gamma \ \cup \ \{\ \mathsf{params}[i].\mathsf{name}\ \mapsto \ \operatorname{ParamType}(\mathsf{params}[i])\ \mid \ i\ \in \ 1..\mid \mathsf{params}\mid \ \}\quad \Gamma '\ \vdash \ \mathsf{body}\ :\ R \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{InferClosureReturn}(C)\ \Downarrow \ R
\end{array}
$$

The shared dependency set MAY be inferred when the closure is checked against an expected closure type. Otherwise it MUST be written explicitly.

$$
\begin{array}{l}
\operatorname{ClosureMoveCaptures}(C)\ =\ \operatorname{MoveCaptureSet}(C) \\[0.16em]
\operatorname{ClosureRefCaptures}(C)\ =\ \operatorname{RefCaptureSet}(C)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{MoveCaptureValid}(\mathfrak{B} ,\ x)\ \Leftrightarrow \ \operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle \mathsf{Valid},\ \mathsf{mov},\ \_,\ \_\rangle \ \land \ \mathsf{mov}\ =\ \mathsf{mov} \\[0.16em]
\operatorname{MoveCaptureErr}(\mathfrak{B} ,\ x)\ \Leftrightarrow \ \operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle s,\ \mathsf{mv},\ \_,\ \_\rangle \ \land \ (s\ \ne \ \mathsf{Valid}\ \lor \ \mathsf{mv}\ =\ \mathsf{immov})
\end{array}
$$

$$
\operatorname{RefCaptureValid}(\mathfrak{B} ,\ x)\ \Leftrightarrow \ \operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle s,\ \_,\ \_,\ \_\rangle \ \land \ s\ =\ \mathsf{Valid}
$$

$$
\operatorname{ApplyMoveCapture}(\mathfrak{B} ,\ x)\ =\ \operatorname{Update_B}(\mathfrak{B} ,\ x,\ \langle \mathsf{Moved},\ \mathsf{mv},\ m,\ r\rangle )\ \mathsf{where}\ \operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle \_,\ \mathsf{mv},\ m,\ r\rangle 
$$

$$
\begin{array}{l}
\operatorname{ApplyMoveCaptures}(\mathfrak{B} ,\ [])\ =\ \mathfrak{B}  \\[0.16em]
\operatorname{ApplyMoveCaptures}(\mathfrak{B} ,\ [x]\ \mathbin{++} \ \mathsf{xs})\ =\ \operatorname{ApplyMoveCaptures}(\operatorname{ApplyMoveCapture}(\mathfrak{B} ,\ x),\ \mathsf{xs})
\end{array}
$$

**(B-Closure-NonCapturing)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{CaptureSet}(C)\ =\ \emptyset  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \mathfrak{B} ;\ \Pi \ \vdash \ C\ \Rightarrow \ \mathfrak{B} \ \triangleright \ \Pi 
\end{array}
$$

**(B-Closure-Capturing)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{CaptureSet}(C)\ \ne \ \emptyset  \\[0.16em]
\mathsf{MoveCaps}\ =\ \operatorname{ClosureMoveCaptures}(C)\quad \mathsf{RefCaps}\ =\ \operatorname{ClosureRefCaptures}(C) \\[0.16em]
\forall \ x\ \in \ \mathsf{MoveCaps}.\ \operatorname{MoveCaptureValid}(\mathfrak{B} ,\ x)\quad \forall \ x\ \in \ \mathsf{RefCaps}.\ \operatorname{RefCaptureValid}(\mathfrak{B} ,\ x) \\[0.16em]
\mathfrak{B} '\ =\ \operatorname{ApplyMoveCaptures}(\mathfrak{B} ,\ \mathsf{MoveCaps}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \mathfrak{B} ;\ \Pi \ \vdash \ C\ \Rightarrow \ \mathfrak{B} '\ \triangleright \ \Pi 
\end{array}
$$

**(B-Closure-MoveCapture-Moved-Err)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \mathsf{MoveCaps}\ =\ \operatorname{ClosureMoveCaptures}(C) \\[0.16em]
\exists \ x\ \in \ \mathsf{MoveCaps}.\ \operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle s,\ \mathsf{mov},\ \_,\ \_\rangle \ \land \ s\ \ne \ \mathsf{Valid}\ \land \ \mathsf{mov}\ =\ \mathsf{mov}\quad c\ =\ \operatorname{Code}(E-\mathsf{CON}-0121) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \mathfrak{B} ;\ \Pi \ \vdash \ C\ \Uparrow \ c
\end{array}
$$

**(B-Closure-MoveCapture-Immovable-Err)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \mathsf{MoveCaps}\ =\ \operatorname{ClosureMoveCaptures}(C) \\[0.16em]
\exists \ x\ \in \ \mathsf{MoveCaps}.\ \operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle \_,\ \mathsf{mv},\ \_,\ \_\rangle \ \land \ \mathsf{mv}\ =\ \mathsf{immov}\quad c\ =\ \operatorname{Code}(E-\mathsf{MEM}-3006) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \mathfrak{B} ;\ \Pi \ \vdash \ C\ \Uparrow \ c
\end{array}
$$

**(B-Closure-RefCapture-Moved-Err)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \mathsf{RefCaps}\ =\ \operatorname{ClosureRefCaptures}(C) \\[0.16em]
\exists \ x\ \in \ \mathsf{RefCaps}.\ \operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle s,\ \_,\ \_,\ \_\rangle \ \land \ s\ \ne \ \mathsf{Valid}\quad c\ =\ \operatorname{Code}(E-\mathsf{MEM}-3001) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \mathfrak{B} ;\ \Pi \ \vdash \ C\ \Uparrow \ c
\end{array}
$$

**(T-Pipeline)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e_{1}\ :\ T_{1}\quad \Gamma ;\ R;\ L\ \vdash \ e_{2}\ :\ T_{f} \\[0.16em]
(T_{f}\ =\ \operatorname{TypeFunc}([(m,\ T_{p})],\ R_{f})\ \lor \ T_{f}\ =\ \operatorname{TypeClosure}([(m,\ T_{p})],\ R_{f},\ \_)) \\[0.16em]
\Gamma \ \vdash \ T_{1}\ \mathrel{<:} \ T_{p} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{PipelineExpr}(e_{1},\ e_{2})\ :\ R_{f}
\end{array}
$$

**(T-Pipeline-NotCallable-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e_{1}\ :\ T_{1}\quad \Gamma ;\ R;\ L\ \vdash \ e_{2}\ :\ T_{f} \\[0.16em]
T_{f}\ \ne \ \operatorname{TypeFunc}(\_,\ \_)\quad T_{f}\ \ne \ \operatorname{TypeClosure}(\_,\ \_,\ \_)\quad c\ =\ \operatorname{Code}(E-\mathsf{SEM}-2538) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{PipelineExpr}(e_{1},\ e_{2})\ \Uparrow \ c
\end{array}
$$

**(T-Pipeline-TypeMismatch-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e_{1}\ :\ T_{1}\quad \Gamma ;\ R;\ L\ \vdash \ e_{2}\ :\ T_{f} \\[0.16em]
(T_{f}\ =\ \operatorname{TypeFunc}([(m,\ T_{p})],\ \_)\ \lor \ T_{f}\ =\ \operatorname{TypeClosure}([(m,\ T_{p})],\ \_,\ \_)) \\[0.16em]
\lnot (\Gamma \ \vdash \ T_{1}\ \mathrel{<:} \ T_{p})\quad c\ =\ \operatorname{Code}(E-\mathsf{SEM}-2539) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{PipelineExpr}(e_{1},\ e_{2})\ \Uparrow \ c
\end{array}
$$

**(T-Pipeline-ArgCount-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e_{1}\ :\ T_{1}\quad \Gamma ;\ R;\ L\ \vdash \ e_{2}\ :\ T_{f} \\[0.16em]
(T_{f}\ =\ \operatorname{TypeFunc}(\mathsf{params},\ \_)\ \lor \ T_{f}\ =\ \operatorname{TypeClosure}(\mathsf{params},\ \_,\ \_))\quad \mid \mathsf{params}\mid \ \ne \ 1\quad c\ =\ \operatorname{Code}(E-\mathsf{SEM}-2539) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{PipelineExpr}(e_{1},\ e_{2})\ \Uparrow \ c
\end{array}
$$

**(B-Pipeline)**

$$
\begin{array}{l}
\Gamma ;\ \mathfrak{B} ;\ \Pi \ \vdash \ e_{1}\ \Rightarrow \ \mathfrak{B}_{1} \ \triangleright \ \Pi_{1} \quad \Gamma ;\ \mathfrak{B}_{1} ;\ \Pi_{1} \ \vdash \ e_{2}\ \Rightarrow \ \mathfrak{B}_{2} \ \triangleright \ \Pi_{2}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \mathfrak{B} ;\ \Pi \ \vdash \ \operatorname{PipelineExpr}(e_{1},\ e_{2})\ \Rightarrow \ \mathfrak{B}_{2} \ \triangleright \ \Pi_{2} 
\end{array}
$$

If a closure parameter lacks an annotation and no expected function type is available, inference fails.

The shared dependency set MAY be inferred when the closure is checked against an expected closure type. Otherwise it MUST be written explicitly.

### 16.9.5 Dynamic Semantics

$$
\operatorname{BuildClosureEnv}(\sigma ,\ C)\ =\ \mathsf{env}\ \Leftrightarrow \ \mathsf{env}\ =\ \{\ x\ \mapsto \ \operatorname{CaptureVal}(\sigma ,\ C,\ x)\ \mid \ x\ \in \ \operatorname{CaptureSet}(C)\ \}
$$

$$
\begin{array}{l}
\operatorname{CaptureVal}(\sigma ,\ C,\ x)\ =\ \mathsf{Ptr}@\operatorname{Valid}(\operatorname{AddrOfBind}(x))\quad \mathsf{if}\ x\ \in \ \operatorname{RefCaptureSet}(C) \\[0.16em]
\operatorname{CaptureVal}(\sigma ,\ C,\ x)\ =\ \operatorname{MoveVal}(\sigma ,\ x)\quad \mathsf{if}\ x\ \in \ \operatorname{MoveCaptureSet}(C)
\end{array}
$$

$$
\operatorname{AllocEnv}(\sigma ,\ \mathsf{env})\ =\ (\sigma ',\ \mathsf{env}_{\mathsf{ptr}})\ \Leftrightarrow \ \mathsf{env}_{\mathsf{ptr}}\ =\ \operatorname{Alloc}(\operatorname{EnvSize}(\mathsf{env}))\ \land \ \sigma '\ =\ \operatorname{StoreEnv}(\sigma ,\ \mathsf{env}_{\mathsf{ptr}},\ \mathsf{env})
$$

$$
\begin{array}{l}
\operatorname{BindEnv}(\sigma ,\ \mathsf{env}_{\mathsf{ptr}})\ =\ \sigma '\ \Leftrightarrow  \\[0.16em]
\ C\ =\ \operatorname{ClosureOf}(\mathsf{env}_{\mathsf{ptr}})\ \land  \\[0.16em]
\ \mathsf{env}\ =\ \operatorname{LoadEnv}(\sigma ,\ \mathsf{env}_{\mathsf{ptr}})\ \land  \\[0.16em]
\ \operatorname{BindCapturedList}(\sigma ,\ C,\ [\langle x,\ \mathsf{env}[x]\rangle \ \mid \ x\ \in \ \operatorname{CaptureList}(C)])\ \Downarrow \ (\sigma ',\ \mathsf{bs})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LoadEnv}(\sigma ,\ \mathsf{env}_{\mathsf{ptr}})\ =\ \mathsf{env}\ \Leftrightarrow  \\[0.16em]
\ \forall \ (x,\ \mathsf{offset})\ \in \ \operatorname{EnvOffsets}(\mathsf{env}_{\mathsf{ptr}}).\ \mathsf{env}[x]\ =\ \operatorname{ReadAddr}(\sigma ,\ \operatorname{GEP}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{offset}))
\end{array}
$$

$$
\operatorname{EnvOffsets}(\mathsf{env}_{\mathsf{ptr}})\ =\ [(x_{i},\ \mathsf{offset}_{i})\ \mid \ C\ =\ \operatorname{ClosureOf}(\mathsf{env}_{\mathsf{ptr}})\ \land \ \Gamma \ \vdash \ \operatorname{ClosureEnvLayout}(C)\ \Downarrow \ \langle \_,\ \_,\ \mathsf{offsets}\rangle \ \land \ \operatorname{CaptureSet}(C)\ =\ [x_{1},\ \ldots ,\ x_{n}]\ \land \ \mathsf{offsets}\ =\ [\mathsf{offset}_{1},\ \ldots ,\ \mathsf{offset}_{n}]]
$$

$$
\begin{array}{l}
\operatorname{BindCapturedList}(\sigma ,\ C,\ [])\ \Downarrow \ (\sigma ,\ []) \\[0.16em]
\operatorname{BindCapturedList}(\sigma ,\ C,\ [\langle x,\ v\rangle ]\ \mathbin{++} \ \mathsf{xs})\ \Downarrow \ (\sigma_{2} ,\ b\ \mathbin{::} \ \mathsf{bs})\ \Leftrightarrow \ \operatorname{BindCaptured}(\sigma ,\ C,\ x,\ v)\ \Downarrow \ (\sigma_{1} ,\ b)\ \land \ \operatorname{BindCapturedList}(\sigma_{1} ,\ C,\ \mathsf{xs})\ \Downarrow \ (\sigma_{2} ,\ \mathsf{bs})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BindCaptured}(\sigma ,\ C,\ x,\ \mathsf{Ptr}@\operatorname{Valid}(\mathsf{addr}))\ \Downarrow \ (\sigma ',\ b)\ \Leftrightarrow \ x\ \in \ \operatorname{RefCaptureSet}(C)\ \land \ \operatorname{BindVal}(\sigma ,\ x,\ \operatorname{Alias}(\mathsf{addr}))\ \Downarrow \ (\sigma ',\ b) \\[0.16em]
\operatorname{BindCaptured}(\sigma ,\ C,\ x,\ v)\ \Downarrow \ (\sigma ',\ b)\ \Leftrightarrow \ x\ \in \ \operatorname{MoveCaptureSet}(C)\ \land \ \operatorname{BindVal}(\sigma ,\ x,\ v)\ \Downarrow \ (\sigma ',\ b)
\end{array}
$$

$$
\operatorname{EnvSize}(\mathsf{env})\ =\ \mathsf{size}\quad \Leftrightarrow \ \operatorname{ClosureEnvLayout}(\operatorname{ClosureOf}(\mathsf{env}))\ \Downarrow \ \langle \mathsf{size},\ \_,\ \_\rangle 
$$

**(EvalSigma-Closure-NonCapturing)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{CaptureSet}(C)\ =\ \emptyset \quad \Gamma \ \vdash \ \operatorname{Mangle}(C)\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(C,\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{ClosureVal}(\mathsf{null},\ \mathsf{sym})),\ \sigma )
\end{array}
$$

**(EvalSigma-Closure-Capturing)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{CaptureSet}(C)\ \ne \ \emptyset \quad \Gamma \ \vdash \ \operatorname{Mangle}(C)\ \Downarrow \ \mathsf{sym} \\[0.16em]
\operatorname{BuildClosureEnv}(\sigma ,\ C)\ =\ \mathsf{env}\quad \operatorname{AllocEnv}(\sigma ,\ \mathsf{env})\ =\ (\sigma_{1} ,\ \mathsf{env}_{\mathsf{ptr}}) \\[0.16em]
\operatorname{MarkMoved}(\sigma_{1} ,\ \operatorname{MoveCaptureSet}(C))\ =\ \sigma_{2}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(C,\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{ClosureVal}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{sym})),\ \sigma_{2} )
\end{array}
$$

$$
\begin{array}{l}
\operatorname{MarkMoved}(\sigma ,\ [])\ =\ \sigma  \\[0.16em]
\operatorname{MarkMoved}(\sigma ,\ [x]\ \mathbin{++} \ \mathsf{xs})\ =\ \operatorname{MarkMoved}(\operatorname{SetMoved}(\sigma ,\ x),\ \mathsf{xs})
\end{array}
$$

**(EvalSigma-ClosureCall)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e_{c},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{ClosureVal}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{code}_{\mathsf{ptr}})),\ \sigma_{1} ) \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalArgsSigma}(\operatorname{ClosureParams}(\operatorname{ExprType}(e_{c})),\ \mathsf{args},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{v}),\ \sigma_{2} ) \\[0.16em]
\Gamma \ \vdash \ \operatorname{ApplyClosureSigma}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{code}_{\mathsf{ptr}},\ \mathsf{vec}_{v},\ \sigma_{2} )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{ClosureCall}(e_{c},\ \mathsf{args}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} )
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ClosureParams}(\operatorname{TypeClosure}(\mathsf{params},\ R,\ \mathsf{deps}_{\mathsf{opt}}))\ =\ \mathsf{params} \\[0.16em]
\operatorname{ClosureParams}(\operatorname{TypeFunc}(\mathsf{params},\ R))\ =\ \mathsf{params}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ApplyClosureSigma}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{code}_{\mathsf{ptr}},\ \mathsf{vec}_{v},\ \sigma )\ =\ (\mathsf{out},\ \sigma ')\ \Leftrightarrow  \\[0.16em]
\ \mathsf{body}\ =\ \operatorname{CodeBody}(\mathsf{code}_{\mathsf{ptr}})\ \land  \\[0.16em]
\ \mathsf{params}\ =\ \operatorname{CodeParams}(\mathsf{code}_{\mathsf{ptr}})\ \land  \\[0.16em]
\ \sigma_{1} \ =\ \operatorname{BindParams}(\sigma ,\ \mathsf{params},\ \mathsf{vec}_{v})\ \land  \\[0.16em]
\ (\mathsf{env}_{\mathsf{ptr}}\ \ne \ \mathsf{null}\ \Rightarrow \ \sigma_{2} \ =\ \operatorname{BindEnv}(\sigma_{1} ,\ \mathsf{env}_{\mathsf{ptr}}))\ \land  \\[0.16em]
\ (\mathsf{env}_{\mathsf{ptr}}\ =\ \mathsf{null}\ \Rightarrow \ \sigma_{2} \ =\ \sigma_{1} )\ \land  \\[0.16em]
\ \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{body},\ \sigma_{2} )\ \Downarrow \ (\mathsf{out},\ \sigma ')
\end{array}
$$

**(EvalSigma-ClosureCall-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e_{c},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{ClosureCall}(e_{c},\ \mathsf{args}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-ClosureCall-Ctrl-Args)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e_{c},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{ClosureVal}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{code}_{\mathsf{ptr}})),\ \sigma_{1} ) \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalArgsSigma}(\operatorname{ClosureParams}(\operatorname{ExprType}(e_{c})),\ \mathsf{args},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{ClosureCall}(e_{c},\ \mathsf{args}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} )
\end{array}
$$

`ClosureCall(e_c, args)` is the resolved internal call form for an ordinary source call `Call(callee, args)` whose callee has closure type. §16.3.5 bridges the source call form to this internal dynamic-semantic form.

Pipeline expressions desugar to function or closure application: `e_1 => e_2 ≡ e_2(e_1)`.

**(EvalSigma-Pipeline-Func)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e_{1},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{1}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(e_{2},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(\operatorname{FuncVal}(\mathsf{sym})),\ \sigma_{2} ) \\[0.16em]
\Gamma \ \vdash \ \operatorname{ApplyProcSigma}(\mathsf{sym},\ [v_{1}],\ \sigma_{2} )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{PipelineExpr}(e_{1},\ e_{2}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} )
\end{array}
$$

**(EvalSigma-Pipeline-Closure)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e_{1},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{1}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(e_{2},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(\operatorname{ClosureVal}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{code}_{\mathsf{ptr}})),\ \sigma_{2} ) \\[0.16em]
\Gamma \ \vdash \ \operatorname{ApplyClosureSigma}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{code}_{\mathsf{ptr}},\ [v_{1}],\ \sigma_{2} )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{PipelineExpr}(e_{1},\ e_{2}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} )
\end{array}
$$

**(EvalSigma-Pipeline-Ctrl-Left)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e_{1},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{PipelineExpr}(e_{1},\ e_{2}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Pipeline-Ctrl-Right)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e_{1},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{1}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(e_{2},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{PipelineExpr}(e_{1},\ e_{2}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} )
\end{array}
$$

### 16.9.6 Lowering

$$
\operatorname{ClosureEnvFields}(C)\ =\ [(x_{i},\ T_{i})\ \mid \ x_{i}\ \in \ \operatorname{CaptureSet}(C)\ \land \ \operatorname{CaptureType}(C,\ x_{i})\ =\ T_{i}]
$$

$$
\begin{array}{l}
\operatorname{CaptureType}(C,\ x)\ =\ \mathsf{Ptr}<T_{x}>@\mathsf{Valid}\ \Leftrightarrow \ x\ \in \ \operatorname{ConstCaptures}(C)\ \cup \ \operatorname{SharedCaptures}(C)\ \land \ \Gamma (x)\ =\ T_{x} \\[0.16em]
\operatorname{CaptureType}(C,\ x)\ =\ T_{x}\ \Leftrightarrow \ x\ \in \ \operatorname{MoveCaptureSet}(C)\ \land \ \Gamma (x)\ =\ T_{x}
\end{array}
$$

**(Layout-ClosureEnv)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{ClosureEnvFields}(C)\ =\ \mathsf{fields}\quad \operatorname{RecordLayout}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \mathsf{offsets}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ClosureEnvLayout}(C)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \mathsf{offsets}\rangle 
\end{array}
$$

**(Layout-ClosureEnv-Empty)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{CaptureSet}(C)\ =\ \emptyset  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ClosureEnvLayout}(C)\ \Downarrow \ \langle 0,\ 1,\ []\rangle 
\end{array}
$$

**(Lower-Expr-Closure-NonCapturing)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{CaptureSet}(C)\ =\ \emptyset \quad \Gamma \ \vdash \ \operatorname{ClosureCodeSym}(C)\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(C)\ \Downarrow \ \langle \mathsf{EmptyIR},\ \operatorname{ClosureVal}(\mathsf{null},\ \mathsf{sym})\rangle 
\end{array}
$$

**(Lower-Expr-Closure-Capturing)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{CaptureSet}(C)\ \ne \ \emptyset  \\[0.16em]
\Gamma \ \vdash \ \operatorname{ClosureCodeSym}(C)\ \Downarrow \ \mathsf{sym}\quad \Gamma \ \vdash \ \operatorname{ClosureEnvLayout}(C)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \mathsf{offsets}\rangle  \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerCaptureEnv}(C,\ \mathsf{offsets})\ \Downarrow \ \langle \mathsf{IR}_{\mathsf{env}},\ \mathsf{env}_{\mathsf{ptr}}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(C)\ \Downarrow \ \langle \mathsf{IR}_{\mathsf{env}},\ \operatorname{ClosureVal}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{sym})\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LowerCaptureEnv}(C,\ \mathsf{offsets})\ \Downarrow \ \langle \mathsf{IR},\ \mathsf{env}_{\mathsf{ptr}}\rangle \ \Leftrightarrow  \\[0.16em]
\ \mathsf{captures}\ =\ \operatorname{CaptureSet}(C)\ \land  \\[0.16em]
\ \Gamma \ \vdash \ \operatorname{ClosureEnvLayout}(C)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_\rangle \ \land  \\[0.16em]
\ \mathsf{env}_{\mathsf{ptr}}\ =\ \operatorname{Alloc}(\mathsf{size},\ \mathsf{align})\ \land  \\[0.16em]
\ \mathsf{IR}\ =\ \operatorname{SeqIR}(\operatorname{AllocIR}(\mathsf{size},\ \mathsf{align}),\ [\operatorname{StoreCapture}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{offsets}[i],\ x_{i})\ \mid \ x_{i}\ \in \ \mathsf{captures},\ i\ \in \ 1..\mid \mathsf{captures}\mid ])
\end{array}
$$

$$
\begin{array}{l}
\operatorname{StoreCapture}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{offset},\ x)\ =\ \operatorname{StoreIR}(\operatorname{GEP}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{offset}),\ \operatorname{LoadLocal}(x))\quad \mathsf{if}\ x\ \in \ \operatorname{RefCaptureSet}(C) \\[0.16em]
\operatorname{StoreCapture}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{offset},\ x)\ =\ \operatorname{MoveIR}(\operatorname{GEP}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{offset}),\ x)\quad \mathsf{if}\ x\ \in \ \operatorname{MoveCaptureSet}(C)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{IsCaptured}(C,\ x)\ \Leftrightarrow \ x\ \in \ \operatorname{CaptureSet}(C) \\[0.16em]
\operatorname{CaptureOffset}(C,\ x)\ =\ \mathsf{offset}_{i}\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{ClosureEnvLayout}(C)\ \Downarrow \ \langle \_,\ \_,\ \mathsf{offsets}\rangle \ \land \ \operatorname{CaptureList}(C)\ =\ [x_{1},\ \ldots ,\ x_{n}]\ \land \ x\ =\ x_{i}\ \land \ \mathsf{offsets}\ =\ [\mathsf{offset}_{1},\ \ldots ,\ \mathsf{offset}_{n}] \\[0.16em]
\operatorname{CaptureList}(C)\ =\ [x\ \mid \ x\ \in \ \operatorname{CaptureSet}(C)]\quad (\mathsf{deterministic}\ \mathsf{ordering}\ \mathsf{by}\ \mathsf{lexicographic}\ \mathsf{name})
\end{array}
$$

**(Lower-CapturedIdent-Ref)**

$$
\begin{array}{l}
\operatorname{InClosureBody}(C)\quad \operatorname{IsCaptured}(C,\ x)\quad x\ \in \ \operatorname{RefCaptureSet}(C)\quad \operatorname{CaptureOffset}(C,\ x)\ =\ \mathsf{offset} \\[0.16em]
\mathsf{env}_{\mathsf{param}}\ =\ \mathsf{ClosureEnvParam}\quad \Gamma (x)\ =\ T_{x} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{Identifier}(x))\ \Downarrow \ \langle \operatorname{SeqIR}(\operatorname{LoadIR}(\operatorname{GEP}(\mathsf{env}_{\mathsf{param}},\ \mathsf{offset}),\ \mathsf{Ptr}<T_{x}>@\mathsf{Valid}),\ \operatorname{LoadIR}(p_{\mathsf{capture}},\ T_{x})),\ v_{\mathsf{capture}}\rangle 
\end{array}
$$

where `p_capture` is the result of the first load and `v_capture` is the result of the second load.

**(Lower-CapturedIdent-Move)**

$$
\begin{array}{l}
\operatorname{InClosureBody}(C)\quad \operatorname{IsCaptured}(C,\ x)\quad x\ \in \ \operatorname{MoveCaptureSet}(C)\quad \operatorname{CaptureOffset}(C,\ x)\ =\ \mathsf{offset} \\[0.16em]
\mathsf{env}_{\mathsf{param}}\ =\ \mathsf{ClosureEnvParam}\quad \Gamma (x)\ =\ T_{x} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{Identifier}(x))\ \Downarrow \ \langle \operatorname{LoadIR}(\operatorname{GEP}(\mathsf{env}_{\mathsf{param}},\ \mathsf{offset}),\ T_{x}),\ v_{\mathsf{capture}}\rangle 
\end{array}
$$

$$
\mathsf{ClosureEnvParam}\ =\ \mathsf{first}\ \mathsf{parameter}\ \mathsf{of}\ \mathsf{closure}\ \mathsf{code}\ \mathsf{function}\ (\mathsf{the}\ \mathsf{environment}\ \mathsf{pointer})
$$

$$
\begin{array}{l}
\operatorname{ClosureCodeSig}(C)\ =\ (\mathsf{params}',\ R)\ \Leftrightarrow  \\[0.16em]
\ C.\mathsf{params}\ =\ \mathsf{params}\ \land  \\[0.16em]
\ C.\mathsf{ret}_{\mathsf{type}\_\mathsf{opt}}\ =\ R_{\mathsf{opt}}\ \land  \\[0.16em]
\ R\ =\ (R_{\mathsf{opt}}\ \mathsf{if}\ R_{\mathsf{opt}}\ \ne \ \bot \ \mathsf{else}\ \operatorname{InferRetType}(C.\mathsf{body}))\ \land  \\[0.16em]
\ \mathsf{params}'\ =\ \operatorname{CodegenParams}([\langle \bot ,\ \texttt{\_\_env},\ \operatorname{TypeRawPtr}(\texttt{imm},\ \operatorname{TypePrim}(\texttt{"u8"}))\rangle ]\ \mathbin{++} \ \mathsf{params})
\end{array}
$$

**(Lower-Closure-Call)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e_{\mathsf{closure}})\ \Downarrow \ \langle \mathsf{IR}_{c},\ v_{\mathsf{closure}}\rangle  \\[0.16em]
v_{\mathsf{closure}}\ =\ \operatorname{ClosureVal}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{code}_{\mathsf{ptr}}) \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerArgs}(\mathsf{args})\ \Downarrow \ \langle \mathsf{IR}_{\mathsf{args}},\ \mathsf{vs}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerClosureCall}(e_{\mathsf{closure}},\ \mathsf{args})\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{c},\ \mathsf{IR}_{\mathsf{args}}),\ \operatorname{IndirectCall}(\mathsf{code}_{\mathsf{ptr}},\ [\mathsf{env}_{\mathsf{ptr}}]\ \mathbin{++} \ \mathsf{vs})\rangle 
\end{array}
$$

`LowerClosureCall(e_closure, args)` is the resolved internal lowering form for an ordinary source call `Call(callee, args)` whose callee has closure type. §16.3.6 bridges the source call form to this internal lowering form.

**(Lower-Expr-Pipeline)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e_{1})\ \Downarrow \ \langle \mathsf{IR}_{1},\ v_{1}\rangle \quad \Gamma \ \vdash \ \operatorname{LowerExpr}(e_{2})\ \Downarrow \ \langle \mathsf{IR}_{2},\ v_{2}\rangle  \\[0.16em]
\operatorname{IsFunc}(\operatorname{ExprType}(e_{2}))\ \Rightarrow \ \mathsf{IR}_{\mathsf{call}}\ =\ \operatorname{CallIR}(v_{2},\ [v_{1}]) \\[0.16em]
\operatorname{IsClosure}(\operatorname{ExprType}(e_{2}))\ \Rightarrow \ v_{2}\ =\ \operatorname{ClosureVal}(\mathsf{env},\ \mathsf{code})\ \land \ \mathsf{IR}_{\mathsf{call}}\ =\ \operatorname{IndirectCall}(\mathsf{code},\ [\mathsf{env},\ v_{1}]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{PipelineExpr}(e_{1},\ e_{2}))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{1},\ \mathsf{IR}_{2},\ \mathsf{IR}_{\mathsf{call}}),\ v_{\mathsf{result}}\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{IsFunc}(\operatorname{TypeFunc}(\_,\ \_))\ \Leftrightarrow \ \mathsf{true} \\[0.16em]
\operatorname{IsFunc}(\_)\ \Leftrightarrow \ \mathsf{false} \\[0.16em]
\operatorname{IsClosure}(\operatorname{TypeClosure}(\_,\ \_,\ \_))\ \Leftrightarrow \ \mathsf{true} \\[0.16em]
\operatorname{IsClosure}(\_)\ \Leftrightarrow \ \mathsf{false}
\end{array}
$$

### 16.9.7 Diagnostics

Diagnostics are defined for unique captures, closure parameters whose types cannot be inferred, move-capturing a moved binding, move-capturing an immovable binding, reference-capturing a moved binding, pipeline right-hand sides that are not callable, pipeline type mismatch, and pipeline targets that do not accept exactly one argument.

## 16.10 Expression Diagnostics Supplement

This section owns diagnostics for general expression typing, calls, indexing restrictions, and `transmute`.

| Code          | Severity | Detection    | Condition                                                                           |
| ------------- | -------- | ------------ | ----------------------------------------------------------------------------------- |
| `E-SEM-2525`  | Error    | Compile-time | Operator operands are not compatible with the operator's type requirements          |
| `E-SEM-2526`  | Error    | Compile-time | Expression type incompatible with expected type                                     |
| `E-SEM-2527`  | Error    | Compile-time | Indexing applied to non-indexable type                                              |
| `E-SEM-2528`  | Error    | Compile-time | Invalid cast                                                                        |
| `E-SEM-2531`  | Error    | Compile-time | Callee expression is not of FUNCTION type                                           |
| `E-SEM-2532`  | Error    | Compile-time | Argument count mismatch                                                             |
| `E-SEM-2533`  | Error    | Compile-time | Argument type incompatible with parameter type                                      |
| `E-SEM-2534`  | Error    | Compile-time | `move` argument required but not provided for provenance-bearing consuming argument |
| `E-SEM-2535`  | Error    | Compile-time | `move` argument provided but parameter is not `move`                                |
| `E-SEM-2536`  | Error    | Compile-time | Method not found for receiver type                                                  |
| `E-SEM-2538`  | Error    | Compile-time | Pipeline RHS is not callable                                                        |
| `E-SEM-2539`  | Error    | Compile-time | Pipeline argument type mismatch                                                     |
| `E-SEM-2591`  | Error    | Compile-time | Closure parameter type cannot be inferred                                           |
| `E-MEM-3031`  | Error    | Compile-time | `transmute` source and target sizes differ                                          |
| `E-UNS-0102`  | Error    | Compile-time | Array index must be a compile-time constant outside `[[dynamic]]` scope             |
| `E-UNS-0103`  | Error    | Compile-time | Array index out of bounds                                                           |
| `E-UNS-0104`  | Error    | Compile-time | `transmute` source and target alignments differ                                     |
| `E-UNS-0107`  | Error    | Compile-time | Non-`Bitcopy` place expression used as value                                        |
| `W-SAFE-0100` | Warning  | Compile-time | `transmute` target type is known to admit invalid bit patterns                      |
