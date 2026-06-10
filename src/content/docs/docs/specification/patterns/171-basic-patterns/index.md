---
title: "17.1 Basic Patterns"
description: "17.1 Basic Patterns from 17. Patterns of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "patterns"
specSection: "171-basic-patterns"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/patterns/">17. Patterns</a>
  <span>Patterns</span>
</div>

## 17.1 Basic Patterns

### 17.1.1 Syntax

```text
basic_pattern ::= literal | "_" | identifier | typed_pattern
typed_pattern ::= ("_" | identifier) ":" type
```

### 17.1.2 Parsing

**(Parse-Pattern-Literal)**

$$
\begin{array}{l}
\operatorname{Tok}(P).\mathsf{kind}\ \in \ \{\mathsf{IntLiteral},\ \mathsf{FloatLiteral},\ \mathsf{StringLiteral},\ \mathsf{CharLiteral},\ \mathsf{BoolLiteral},\ \mathsf{NullLiteral}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePatternAtom}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \operatorname{LiteralPattern}(\operatorname{Tok}(P)))
\end{array}
$$

**(Parse-Pattern-Wildcard)**

$$
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \operatorname{Lexeme}(\operatorname{Tok}(P))\ =\ \texttt{"\_"} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePatternAtom}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \mathsf{WildcardPattern})
\end{array}
$$

**(Parse-Pattern-Identifier)**
IsIdent(Tok(P))

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePatternAtom}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \operatorname{IdentifierPattern}(\operatorname{Lexeme}(\operatorname{Tok}(P))))
\end{array}
$$

**(Parse-Pattern-Typed)**

$$
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePatternAtom}(P)\ \Downarrow \ (P_{1},\ \operatorname{TypedPattern}(\operatorname{Lexeme}(\operatorname{Tok}(P)),\ T))
\end{array}
$$

### 17.1.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{Pattern}\ =\ \{\operatorname{LiteralPattern}(\mathsf{lit}),\ \mathsf{WildcardPattern},\ \operatorname{IdentifierPattern}(\mathsf{name}),\ \operatorname{TypedPattern}(\mathsf{name},\ \mathsf{type}),\ \operatorname{TuplePattern}(\mathsf{elems}),\ \operatorname{RecordPattern}(\mathsf{type}_{\mathsf{path}},\ \mathsf{fields}),\ \operatorname{EnumPattern}(\mathsf{type}_{\mathsf{path}},\ \mathsf{name},\ \mathsf{payload}_{\mathsf{opt}}),\ \operatorname{ModalPattern}(\mathsf{state}_{\mathsf{name}},\ \mathsf{fields}_{\mathsf{opt}}),\ \operatorname{RangePattern}(\mathsf{kind},\ \mathsf{lo},\ \mathsf{hi})\} \\[0.16em]
\mathsf{PatternSpan}\ :\ \mathsf{Pattern}\ \to \ \mathsf{Span}
\end{array}
$$

### 17.1.4 Static Semantics

$$
\mathsf{CaseJudg}\ =\ \{\Gamma \ \vdash \ \mathsf{pat}\ \triangleleft \ T\ \dashv \ B,\ \Gamma ;\ R;\ L\ \vdash \ \operatorname{CaseBody}(\mathsf{body})\ :\ T,\ \Gamma ;\ R;\ L\ \vdash \ \operatorname{CaseBody}(\mathsf{body})\ \Leftarrow \ T\}
$$

$$
\begin{array}{l}
\operatorname{PermWrap}(T,\ B)\ = \\[0.16em]
\ \{\ \{\ x\ \mapsto \ \operatorname{TypePerm}(p,\ T_{x})\ \mid \ x\ \mapsto \ T_{x}\ \in \ B\ \}\quad \mathsf{if}\ T\ =\ \operatorname{TypePerm}(p,\ U) \\[0.16em]
\quad B\quad \mathsf{otherwise}\ \}
\end{array}
$$

**(Pat-StripPerm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \mathsf{pat}\ \triangleleft \ \operatorname{StripPerm}(T)\ \dashv \ B \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{pat}\ \triangleleft \ T\ \dashv \ \operatorname{PermWrap}(T,\ B)
\end{array}
$$

**Pattern Name Extraction.**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{IdentifierPattern}(x))\ \Downarrow \ [x]
\end{array}
$$

**(Pat-Wild)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\mathsf{WildcardPattern})\ \Downarrow \ []
\end{array}
$$

**(Pat-Lit)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{LiteralPattern}(\mathsf{lit}))\ \Downarrow \ []
\end{array}
$$

**(Pat-Typed-Discard)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{TypedPattern}(\texttt{"\_"},\ T))\ \Downarrow \ []
\end{array}
$$

**(Pat-Typed-Ident)**

$$
\begin{array}{l}
x\ \ne \ \texttt{"\_"} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{TypedPattern}(x,\ T))\ \Downarrow \ [x]
\end{array}
$$

**(Pat-Dup-R-Err)**

$$
\mathsf{PatJudg}\ =\ \{\Gamma \ \vdash \ \mathsf{pat}\ \Leftarrow \ T\ \dashv \ B\}
$$

$$
\begin{array}{l}
\lnot \ \operatorname{Distinct}(\operatorname{PatNames}(\mathsf{pat}))\quad c\ =\ \operatorname{Code}(\mathsf{Pat}-\mathsf{Dup}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{pat}\ \triangleleft \ T\ \Uparrow \ c
\end{array}
$$

**(Pat-Wildcard-R)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \_\ \triangleleft \ T\ \dashv \ \emptyset
\end{array}
$$

**(Pat-Ident-R)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ x\ \triangleleft \ T\ \dashv \ \{x\ \mapsto \ T\}
\end{array}
$$

**(Pat-Literal-R)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Literal}(\mathsf{lit})\ :\ T_{l}\quad \Gamma \ \vdash \ T_{l}\ \mathrel{<:} \ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LiteralPattern}(\mathsf{lit})\ \triangleleft \ T\ \dashv \ \emptyset
\end{array}
$$

**(Pat-Typed-Exact-R)**

$$
\begin{array}{l}
\Gamma \ \vdash \ T_{a}\ \mathsf{type}\quad \Gamma \ \vdash \ T_{a}\ \equiv \ \operatorname{StripPerm}(T)\quad B\ =\ (\{x\ \mapsto \ T_{a}\}\ \mathsf{if}\ x\ \ne \ \texttt{"\_"}\ \mathsf{else}\ \emptyset ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypedPattern}(x,\ T_{a})\ \triangleleft \ T\ \dashv \ B
\end{array}
$$

**(Pat-Typed-Union-R)**

$$
\begin{array}{l}
\Gamma \ \vdash \ T_{a}\ \mathsf{type}\quad \operatorname{StripPerm}(T)\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad \exists \ i.\ \Gamma \ \vdash \ T_{a}\ \equiv \ \operatorname{StripPerm}(T_{i})\quad B\ =\ (\{x\ \mapsto \ T_{a}\}\ \mathsf{if}\ x\ \ne \ \texttt{"\_"}\ \mathsf{else}\ \emptyset ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypedPattern}(x,\ T_{a})\ \triangleleft \ T\ \dashv \ B
\end{array}
$$

### 17.1.5 Dynamic Semantics

$$
\begin{array}{l}
\mathsf{BindEnv}\ =\ \mathsf{Ident}\ \rightharpoonup \ \mathsf{Value} \\[0.16em]
\operatorname{Dom}(B)\ =\ \{x\ \mid \ x\ \in \ \mathsf{Ident}\ \land \ B[x]\ \mathsf{defined}\} \\[0.16em]
B_{1}\ \uplus \ B_{2}\ =\ B\ \Leftrightarrow \ \operatorname{Dom}(B_{1})\ \cap \ \operatorname{Dom}(B_{2})\ =\ \emptyset \ \land \ \forall \ x.\ (x\ \in \ \operatorname{Dom}(B_{1})\ \Rightarrow \ B[x]\ =\ B_{1}[x])\ \land \ (x\ \in \ \operatorname{Dom}(B_{2})\ \Rightarrow \ B[x]\ =\ B_{2}[x])
\end{array}
$$

$$
\begin{array}{l}
\mathsf{MatchPatJudg}\ =\ \{\operatorname{MatchPattern}(p,\ v)\ \Downarrow \ B\} \\[0.16em]
\operatorname{PatType}(\operatorname{LiteralPattern}(\mathsf{lit}))\ = \\[0.16em]
\ \operatorname{TypePrim}(t)\quad \mathsf{if}\ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{IntLiteral}\ \land \ \operatorname{IntSuffix}(\mathsf{lit})\ =\ t \\[0.16em]
\ \operatorname{TypePrim}(\texttt{"i32"})\quad \mathsf{if}\ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{IntLiteral}\ \land \ \operatorname{IntSuffix}(\mathsf{lit})\ =\ \bot \\[0.16em]
\ \operatorname{TypePrim}(t)\quad \mathsf{if}\ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{FloatLiteral}\ \land \ \operatorname{FloatSuffix}(\mathsf{lit})\ =\ t\ \land \ t\ \in \ \{\texttt{"f16"},\ \texttt{"f32"},\ \texttt{"f64"}\} \\[0.16em]
\ \operatorname{TypePrim}(\texttt{"f32"})\quad \mathsf{if}\ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{FloatLiteral}\ \land \ (\operatorname{FloatSuffix}(\mathsf{lit})\ =\ \texttt{"f"}\ \lor \ \operatorname{NoFloatSuffix}(\mathsf{lit})) \\[0.16em]
\ \operatorname{TypePrim}(\texttt{"bool"})\quad \mathsf{if}\ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{BoolLiteral} \\[0.16em]
\ \operatorname{TypePrim}(\texttt{"char"})\quad \mathsf{if}\ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{CharLiteral} \\[0.16em]
\ \operatorname{TypeString}(\texttt{@View})\ \mathsf{if}\ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{StringLiteral} \\[0.16em]
\ \bot \quad \mathsf{if}\ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{NullLiteral}
\end{array}
$$

**(Match-Wildcard)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MatchPattern}(\_,\ v)\ \Downarrow \ \emptyset
\end{array}
$$

**(Match-Ident)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MatchPattern}(x,\ v)\ \Downarrow \ \{x\ \mapsto \ v\}
\end{array}
$$

**(Match-Literal)**

$$
\begin{array}{l}
T\ =\ \operatorname{PatType}(\ell )\quad \operatorname{LiteralValue}(\ell ,\ T)\ =\ v \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MatchPattern}(\ell ,\ v)\ \Downarrow \ \emptyset
\end{array}
$$

**(Match-Typed-Discard)**
RuntimeTypeMember(v, T)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MatchPattern}(\operatorname{TypedPattern}(\texttt{"\_"},\ T),\ v)\ \Downarrow \ \emptyset
\end{array}
$$

**(Match-Typed-Ident)**

$$
\begin{array}{l}
x\ \ne \ \texttt{"\_"}\quad \operatorname{RuntimeTypeMember}(v,\ T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MatchPattern}(\operatorname{TypedPattern}(x,\ T),\ v)\ \Downarrow \ \{x\ \mapsto \ v\}
\end{array}
$$

### 17.1.6 Lowering

No basic-pattern-specific lowering is defined beyond the shared pattern-lowering machinery in §17.5.6.

### 17.1.7 Diagnostics

Diagnostics are defined for duplicate bindings introduced by a single pattern.
