---
title: "Patterns"
description: "17. Patterns of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
generatedAt: "2026-05-14T00:55:03.609Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
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
\ \operatorname{TypePrim}(\texttt{"i32"})\quad \mathsf{if}\ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{IntLiteral}\ \land \ \operatorname{IntSuffix}(\mathsf{lit})\ =\ \bot  \\[0.16em]
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

## 17.2 Tuple and Record Patterns

### 17.2.1 Syntax

```text
tuple_pattern        ::= "(" tuple_pattern_elements? ")"
tuple_pattern_elements ::= pattern ";" | pattern ("," pattern)+ ","?
record_pattern       ::= type_path "{" field_pattern_list? "}"
field_pattern_list   ::= field_pattern ("," field_pattern)* ","?
field_pattern        ::= identifier (":" pattern)?
```

The semicolon form is the only valid single-element tuple-pattern spelling.

### 17.2.2 Parsing

**(Parse-Pattern-Tuple)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseTuplePatternElems}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{elems})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{")"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePatternAtom}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{TuplePattern}(\mathsf{elems}))
\end{array}
$$

**(Parse-Pattern-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseTypePath}(P)\ \Downarrow \ (P_{1},\ \mathsf{path})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseFieldPatternList}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{fields})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePatternAtom}(P)\ \Downarrow \ (\operatorname{Advance}(P_{2}),\ \operatorname{RecordPattern}(\mathsf{path},\ \mathsf{fields}))
\end{array}
$$

**(Parse-TuplePatternElems-Empty)**
IsPunc(Tok(P), ")")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseTuplePatternElems}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-TuplePatternElems-Single)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParsePattern}(P)\ \Downarrow \ (P_{1},\ p)\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{";"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseTuplePatternElems}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ [p])
\end{array}
$$

**(Parse-TuplePatternElems-Many)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParsePattern}(P)\ \Downarrow \ (P_{1},\ p_{1})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParsePattern}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ p_{2})\quad \Gamma \ \vdash \ \operatorname{ParsePatternListTail}(P_{2},\ [p_{2}])\ \Downarrow \ (P_{3},\ \mathsf{ps}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseTuplePatternElems}(P)\ \Downarrow \ (P_{3},\ [p_{1}]\ \mathbin{++} \ \mathsf{ps})
\end{array}
$$

**(Parse-FieldPatternList-Empty)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseFieldPatternList}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-FieldPatternList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseFieldPattern}(P)\ \Downarrow \ (P_{1},\ f)\quad \Gamma \ \vdash \ \operatorname{ParseFieldPatternTail}(P_{1},\ [f])\ \Downarrow \ (P_{2},\ \mathsf{fs}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseFieldPatternList}(P)\ \Downarrow \ (P_{2},\ \mathsf{fs})
\end{array}
$$

**(Parse-FieldPattern)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseIdent}(P)\ \Downarrow \ (P_{1},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseFieldPatternTailOpt}(P_{1},\ \mathsf{name})\ \Downarrow \ (P_{2},\ \mathsf{pat}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseFieldPattern}(P)\ \Downarrow \ (P_{2},\ \langle \mathsf{name},\ \mathsf{pat}_{\mathsf{opt}},\ \operatorname{SpanBetween}(P,\ P_{2})\rangle )
\end{array}
$$

**(Parse-FieldPatternTailOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{":"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseFieldPatternTailOpt}(P,\ \mathsf{name})\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-FieldPatternTailOpt-Yes)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParsePattern}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{pat}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseFieldPatternTailOpt}(P,\ \mathsf{name})\ \Downarrow \ (P_{1},\ \mathsf{pat})
\end{array}
$$

**(Parse-FieldPatternTail-End)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseFieldPatternTail}(P,\ \mathsf{xs})\ \Downarrow \ (P,\ \mathsf{xs})
\end{array}
$$

**(Parse-FieldPatternTail-TrailingComma)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"\}"})\quad \operatorname{TrailingCommaAllowed}(P_{0},\ P,\ \{\operatorname{Punctuator}(\texttt{"\}"})\}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseFieldPatternTail}(P,\ \mathsf{xs})\ \Downarrow \ (\operatorname{Advance}(P),\ \mathsf{xs})
\end{array}
$$

**(Parse-FieldPatternTail-Comma)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParseFieldPattern}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ f)\quad \Gamma \ \vdash \ \operatorname{ParseFieldPatternTail}(P_{1},\ \mathsf{xs}\ \mathbin{++} \ [f])\ \Downarrow \ (P_{2},\ \mathsf{ys}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseFieldPatternTail}(P,\ \mathsf{xs})\ \Downarrow \ (P_{2},\ \mathsf{ys})
\end{array}
$$

### 17.2.3 AST Representation / Form

$$
\mathsf{FieldPattern}\ =\ \langle \mathsf{name},\ \mathsf{pattern}_{\mathsf{opt}},\ \mathsf{span}\rangle 
$$

$$
\begin{array}{l}
\operatorname{FieldName}(\langle f,\ \_,\ \_\rangle )\ =\ f \\[0.16em]
\operatorname{PatOf}(\langle f,\ \bot ,\ \_\rangle )\ =\ \operatorname{IdentifierPattern}(f) \\[0.16em]
\operatorname{PatOf}(\langle f,\ p,\ \_\rangle )\ =\ p\quad \mathsf{if}\ p\ \ne \ \bot 
\end{array}
$$

$$
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{PatNames}(p_{i})\ \Downarrow \ N_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{TuplePattern}([p_{1},\ \ldots ,\ p_{n}]))\ \Downarrow \ N_{1}\ \mathbin{++} \ \cdot \cdot \cdot \ \mathbin{++} \ N_{n}
\end{array}
$$

**(Pat-Record-Field-Explicit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{PatNames}(p)\ \Downarrow \ N \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\langle \mathsf{name},\ \mathsf{pattern}_{\mathsf{opt}}\ =\ p,\ \mathsf{span}\rangle )\ \Downarrow \ N
\end{array}
$$

**(Pat-Record-Field-Implicit)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\langle \mathsf{name},\ \mathsf{pattern}_{\mathsf{opt}}\ =\ \bot ,\ \mathsf{span}\rangle )\ \Downarrow \ [\mathsf{name}]
\end{array}
$$

$$
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{PatNames}(f_{i})\ \Downarrow \ N_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{RecordPattern}(\_,\ [f_{1},\ \ldots ,\ f_{n}]))\ \Downarrow \ N_{1}\ \mathbin{++} \ \cdot \cdot \cdot \ \mathbin{++} \ N_{n}
\end{array}
$$

### 17.2.4 Static Semantics

**(Pat-Tuple-R-Arity-Err)**

$$
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}])\quad \mathsf{ps}\ =\ [p_{1},\ \ldots ,\ p_{m}]\quad m\ \ne \ n\quad c\ =\ \operatorname{Code}(\mathsf{Pat}-\mathsf{Tuple}-\mathsf{Arity}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TuplePattern}(\mathsf{ps})\ \triangleleft \ T\ \Uparrow \ c
\end{array}
$$

**(Pat-Tuple-R)**

$$
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}])\quad \forall \ i,\ \Gamma \ \vdash \ p_{i}\ \triangleleft \ T_{i}\ \dashv \ B_{i}\quad B\ =\ \uplus_{i} \ B_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TuplePattern}([p_{1},\ \ldots ,\ p_{n}])\ \triangleleft \ T\ \dashv \ B
\end{array}
$$

**(Pat-Record-R)**

$$
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \forall \ \mathsf{fp}\ \in \ \mathsf{fs},\ \operatorname{FieldType}(R,\ \operatorname{FieldName}(\mathsf{fp}))\ =\ T_{f}\ \land \ \operatorname{FieldVisible}(m,\ R,\ \operatorname{FieldName}(\mathsf{fp}))\ \land \ \Gamma \ \vdash \ \operatorname{PatOf}(\mathsf{fp})\ \triangleleft \ T_{f}\ \dashv \ B_{f}\quad B\ =\ \uplus \_\{\mathsf{fp}\ \in \ \mathsf{fs}\}\ B_{f} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RecordPattern}(p,\ \mathsf{fs})\ \triangleleft \ T\ \dashv \ B
\end{array}
$$

**(RecordPattern-UnknownField)**

$$
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \exists \ \mathsf{fp}\ \in \ \mathsf{fs}.\ \operatorname{FieldName}(\mathsf{fp})\ \notin \ \operatorname{FieldNameSet}(R)\quad c\ =\ \operatorname{Code}(\mathsf{RecordPattern}-\mathsf{UnknownField}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RecordPattern}(p,\ \mathsf{fs})\ \triangleleft \ T\ \Uparrow \ c
\end{array}
$$

### 17.2.5 Dynamic Semantics

**MatchRecord.**

$$
\mathsf{MatchRecordJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{MatchRecord}(\mathsf{fs},\ v)\ \Downarrow \ B\}
$$

**(MatchRecord-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MatchRecord}([],\ v)\ \Downarrow \ \emptyset 
\end{array}
$$

**(MatchRecord-Cons-Implicit)**

$$
\begin{array}{l}
\operatorname{FieldValue}(v,\ f)\ =\ v_{f}\quad \Gamma \ \vdash \ \operatorname{MatchRecord}(\mathsf{fs},\ v)\ \Downarrow \ B \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MatchRecord}([f]\ \mathbin{++} \ \mathsf{fs},\ v)\ \Downarrow \ (B\ \uplus \ \{f\ \mapsto \ v_{f}\})
\end{array}
$$

**(MatchRecord-Cons-Explicit)**

$$
\begin{array}{l}
\operatorname{FieldValue}(v,\ f)\ =\ v_{f}\quad \Gamma \ \vdash \ \operatorname{MatchPattern}(p,\ v_{f})\ \Downarrow \ B_{1}\quad \Gamma \ \vdash \ \operatorname{MatchRecord}(\mathsf{fs},\ v)\ \Downarrow \ B_{2} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MatchRecord}([\langle f,\ p\rangle ]\ \mathbin{++} \ \mathsf{fs},\ v)\ \Downarrow \ (B_{1}\ \uplus \ B_{2})
\end{array}
$$

**(Match-Tuple)**

$$
\begin{array}{l}
v\ =\ (v_{1},\ \ldots ,\ v_{n})\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{MatchPattern}(p_{i},\ v_{i})\ \Downarrow \ B_{i}\quad B\ =\ \uplus_{i} \ B_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MatchPattern}((p_{1},\ \ldots ,\ p_{n}),\ v)\ \Downarrow \ B
\end{array}
$$

**(Match-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MatchRecord}(\mathsf{fs},\ v)\ \Downarrow \ B \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MatchPattern}(R\{\mathsf{fs}\},\ v)\ \Downarrow \ B
\end{array}
$$

### 17.2.6 Lowering

Tuple and record patterns use the shared lowering rules in §17.5.6.

### 17.2.7 Diagnostics

Diagnostics are defined for tuple-pattern arity mismatch and record patterns that reference unknown fields.

## 17.3 Enum and Modal Patterns

### 17.3.1 Syntax

```text
enum_pattern                  ::= type_path "::" identifier enum_payload_pattern?
enum_payload_pattern          ::= "(" enum_payload_pattern_elements? ")" | "{" field_pattern_list? "}"
enum_payload_pattern_elements ::= pattern ("," pattern)* ","?
modal_pattern        ::= "@" identifier ("{" field_pattern_list? "}")?
```

A single-element tuple enum payload pattern is written as `(p)`. It MUST NOT use the tuple single-element marker `;`, which remains specific to `tuple_pattern`.

### 17.3.2 Parsing

**(Parse-Pattern-Enum)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseTypePath}(P)\ \Downarrow \ (P_{1},\ \mathsf{path})\quad \operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{"::"})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseEnumPatternPayloadOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{payload}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePatternAtom}(P)\ \Downarrow \ (P_{3},\ \operatorname{EnumPattern}(\mathsf{path},\ \mathsf{name},\ \mathsf{payload}_{\mathsf{opt}}))
\end{array}
$$

**(Parse-Pattern-Modal)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"@"})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseModalPatternPayloadOpt}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{fields}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePatternAtom}(P)\ \Downarrow \ (P_{2},\ \operatorname{ModalPattern}(\mathsf{name},\ \mathsf{fields}_{\mathsf{opt}}))
\end{array}
$$

**(Parse-EnumPatternPayloadOpt-None)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ \notin \ \{\operatorname{Punctuator}(\texttt{"("}),\ \operatorname{Punctuator}(\texttt{"\{"})\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseEnumPatternPayloadOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-EnumPayloadPatternElems-Empty)**
IsPunc(Tok(P), ")")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseEnumPayloadPatternElems}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-EnumPayloadPatternElems-One)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParsePattern}(P)\ \Downarrow \ (P_{1},\ p)\quad \lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{","}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseEnumPayloadPatternElems}(P)\ \Downarrow \ (P_{1},\ [p])
\end{array}
$$

**(Parse-EnumPayloadPatternElems-TrailingComma)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParsePattern}(P)\ \Downarrow \ (P_{1},\ p)\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{","})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P_{1})),\ \texttt{")"})\quad \operatorname{TrailingCommaAllowed}(P_{0},\ P_{1},\ \{\operatorname{Punctuator}(\texttt{")"})\}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseEnumPayloadPatternElems}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ [p])
\end{array}
$$

**(Parse-EnumPayloadPatternElems-Many)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParsePattern}(P)\ \Downarrow \ (P_{1},\ p_{1})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParsePattern}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ p_{2})\quad \Gamma \ \vdash \ \operatorname{ParsePatternListTail}(P_{2},\ [p_{2}])\ \Downarrow \ (P_{3},\ \mathsf{ps}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseEnumPayloadPatternElems}(P)\ \Downarrow \ (P_{3},\ [p_{1}]\ \mathbin{++} \ \mathsf{ps})
\end{array}
$$

**(Parse-EnumPatternPayloadOpt-Tuple)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseEnumPayloadPatternElems}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{ps})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{")"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseEnumPatternPayloadOpt}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{TuplePayloadPattern}(\mathsf{ps}))
\end{array}
$$

**(Parse-EnumPatternPayloadOpt-Record)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseFieldPatternList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{fs})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseEnumPatternPayloadOpt}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{RecordPayloadPattern}(\mathsf{fs}))
\end{array}
$$

**(Parse-ModalPatternPayloadOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\{"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseModalPatternPayloadOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-ModalPatternPayloadOpt-Record)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseFieldPatternList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{fs})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseModalPatternPayloadOpt}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{ModalRecordPayload}(\mathsf{fs}))
\end{array}
$$

### 17.3.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{EnumPayloadPattern}\ =\ \{\operatorname{TuplePayloadPattern}([\mathsf{Pattern}]),\ \operatorname{RecordPayloadPattern}([\mathsf{FieldPattern}])\} \\[0.16em]
\mathsf{ModalPayloadPattern}\ =\ \{\operatorname{ModalRecordPayload}([\mathsf{FieldPattern}])\}
\end{array}
$$

**(Pat-Enum-None)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{EnumPattern}(\_,\ \_,\ \bot ))\ \Downarrow \ []
\end{array}
$$

**(Pat-Enum-Tuple)**

$$
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{PatNames}(p_{i})\ \Downarrow \ N_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{EnumPattern}(\_,\ \_,\ \operatorname{TuplePayloadPattern}([p_{1},\ \ldots ,\ p_{n}])))\ \Downarrow \ N_{1}\ \mathbin{++} \ \cdot \cdot \cdot \ \mathbin{++} \ N_{n}
\end{array}
$$

**(Pat-Enum-Record)**

$$
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{PatNames}(f_{i})\ \Downarrow \ N_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{EnumPattern}(\_,\ \_,\ \operatorname{RecordPayloadPattern}([f_{1},\ \ldots ,\ f_{n}])))\ \Downarrow \ N_{1}\ \mathbin{++} \ \cdot \cdot \cdot \ \mathbin{++} \ N_{n}
\end{array}
$$

**(Pat-Modal-None)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{ModalPattern}(\_,\ \bot ))\ \Downarrow \ []
\end{array}
$$

**(Pat-Modal-Record)**

$$
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{PatNames}(f_{i})\ \Downarrow \ N_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{ModalPattern}(\_,\ \operatorname{ModalRecordPayload}([f_{1},\ \ldots ,\ f_{n}])))\ \Downarrow \ N_{1}\ \mathbin{++} \ \cdot \cdot \cdot \ \mathbin{++} \ N_{n}
\end{array}
$$

### 17.3.4 Static Semantics

**(Pat-Enum-Unit-R)**

$$
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{VariantPayload}(E,\ v)\ =\ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EnumPattern}(p,\ v,\ \bot )\ \triangleleft \ T\ \dashv \ \emptyset 
\end{array}
$$

**(Pat-Enum-Tuple-R)**

$$
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{VariantPayload}(E,\ v)\ =\ \operatorname{TuplePayload}([T_{1},\ \ldots ,\ T_{n}])\quad \forall \ i,\ \Gamma \ \vdash \ p_{i}\ \triangleleft \ T_{i}\ \dashv \ B_{i}\quad B\ =\ \uplus_{i} \ B_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EnumPattern}(p,\ v,\ \operatorname{TuplePayloadPattern}([p_{1},\ \ldots ,\ p_{n}]))\ \triangleleft \ T\ \dashv \ B
\end{array}
$$

**(Pat-Enum-Record-R)**

$$
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{VariantPayload}(E,\ v)\ =\ \operatorname{RecordPayload}(\mathsf{fs}')\quad \forall \ \mathsf{fp}\ \in \ \mathsf{fs},\ \operatorname{EnumFieldType}(E,\ v,\ \operatorname{FieldName}(\mathsf{fp}))\ =\ T_{f}\ \land \ \Gamma \ \vdash \ \operatorname{PatOf}(\mathsf{fp})\ \triangleleft \ T_{f}\ \dashv \ B_{f}\quad B\ =\ \uplus \_\{\mathsf{fp}\ \in \ \mathsf{fs}\}\ B_{f} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EnumPattern}(p,\ v,\ \operatorname{RecordPayloadPattern}(\mathsf{fs}))\ \triangleleft \ T\ \dashv \ B
\end{array}
$$

**(Pat-Modal-R)**

$$
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad S\ \in \ \operatorname{States}(M)\quad \forall \ \mathsf{fp}\ \in \ \mathsf{fs},\ \operatorname{ModalPayloadMap}(\mathsf{modal}_{\mathsf{ref}},\ S)(\operatorname{FieldName}(\mathsf{fp}))\ =\ T_{f}\ \land \ \Gamma \ \vdash \ \operatorname{PatOf}(\mathsf{fp})\ \triangleleft \ T_{f}\ \dashv \ B_{f}\quad B\ =\ \uplus \_\{\mathsf{fp}\ \in \ \mathsf{fs}\}\ B_{f} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ModalPattern}(S,\ \mathsf{fs})\ \triangleleft \ T\ \dashv \ B
\end{array}
$$

**(Pat-Modal-State-R)**

$$
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \forall \ \mathsf{fp}\ \in \ \mathsf{fs},\ \operatorname{ModalPayloadMap}(\mathsf{modal}_{\mathsf{ref}},\ S)(\operatorname{FieldName}(\mathsf{fp}))\ =\ T_{f}\ \land \ \Gamma \ \vdash \ \operatorname{PatOf}(\mathsf{fp})\ \triangleleft \ T_{f}\ \dashv \ B_{f}\quad B\ =\ \uplus \_\{\mathsf{fp}\ \in \ \mathsf{fs}\}\ B_{f} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ModalPattern}(S,\ \mathsf{fs})\ \triangleleft \ T\ \dashv \ B
\end{array}
$$

### 17.3.5 Dynamic Semantics

$$
\mathsf{MatchModalJudg}\ =\ \{\operatorname{MatchModal}(p,\ v)\ \Downarrow \ B\}
$$

**(Match-Modal-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MatchModal}(@S,\ \langle S,\ v\rangle )\ \Downarrow \ \emptyset 
\end{array}
$$

**(Match-Modal-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MatchRecord}(\mathsf{fs},\ v)\ \Downarrow \ B \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MatchModal}(@S\{\mathsf{fs}\},\ \langle S,\ v\rangle )\ \Downarrow \ B
\end{array}
$$

**(Match-Enum-Unit)**

$$
\begin{array}{l}
v\ =\ \operatorname{EnumValue}(\mathsf{path}',\ \bot )\quad \operatorname{EnumPath}(\mathsf{path}')\ =\ \mathsf{path}\quad \operatorname{VariantName}(\mathsf{path}')\ =\ \mathsf{name} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MatchPattern}(\operatorname{EnumPattern}(\mathsf{path},\ \mathsf{name},\ \bot ),\ v)\ \Downarrow \ \emptyset 
\end{array}
$$

**(Match-Enum-Tuple)**

$$
\begin{array}{l}
v\ =\ \operatorname{EnumValue}(\mathsf{path}',\ \operatorname{TuplePayload}(\mathsf{vec}_{v}))\quad \operatorname{EnumPath}(\mathsf{path}')\ =\ \mathsf{path}\quad \operatorname{VariantName}(\mathsf{path}')\ =\ \mathsf{name}\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{MatchPattern}(p_{i},\ v_{i})\ \Downarrow \ B_{i}\quad B\ =\ \uplus_{i} \ B_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MatchPattern}(\operatorname{EnumPattern}(\mathsf{path},\ \mathsf{name},\ \operatorname{TuplePayloadPattern}([p_{1},\ \ldots ,\ p_{n}])),\ v)\ \Downarrow \ B
\end{array}
$$

**(Match-Enum-Record)**

$$
\begin{array}{l}
v\ =\ \operatorname{EnumValue}(\mathsf{path}',\ \operatorname{RecordPayload}(\mathsf{vec}_{f}))\quad \operatorname{EnumPath}(\mathsf{path}')\ =\ \mathsf{path}\quad \operatorname{VariantName}(\mathsf{path}')\ =\ \mathsf{name}\quad \Gamma \ \vdash \ \operatorname{MatchRecord}(\mathsf{fs},\ \operatorname{RecordPayload}(\mathsf{vec}_{f}))\ \Downarrow \ B \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MatchPattern}(\operatorname{EnumPattern}(\mathsf{path},\ \mathsf{name},\ \operatorname{RecordPayloadPattern}(\mathsf{fs})),\ v)\ \Downarrow \ B
\end{array}
$$

**(Match-Modal-General)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MatchModal}(@S\{\mathsf{fs}\},\ \langle S,\ v\rangle )\ \Downarrow \ B \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MatchPattern}(@S\{\mathsf{fs}\},\ \langle S,\ v\rangle )\ \Downarrow \ B
\end{array}
$$

**(Match-Modal-State)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MatchRecord}(\mathsf{fs},\ v)\ \Downarrow \ B \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MatchPattern}(@S\{\mathsf{fs}\},\ v)\ \Downarrow \ B
\end{array}
$$

### 17.3.6 Lowering

Enum and modal patterns use the shared lowering rules in §17.5.6.

### 17.3.7 Diagnostics

No additional named diagnostics are introduced for enum or modal pattern shape checking beyond the typing failures in this section and the exhaustiveness diagnostics in §17.6.

## 17.4 Range Patterns

### 17.4.1 Syntax

```text
range_pattern ::= pattern (".." | "..=") pattern
```

### 17.4.2 Parsing

**(Parse-Pattern)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParsePatternRange}(P)\ \Downarrow \ (P_{1},\ \mathsf{pat}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePattern}(P)\ \Downarrow \ (P_{1},\ \mathsf{pat})
\end{array}
$$

**(Parse-Pattern-Err)**

$$
\begin{array}{l}
c\ =\ \operatorname{Code}(\mathsf{Parse}-\mathsf{Syntax}-\mathsf{Err})\quad \Gamma \ \vdash \ \operatorname{Emit}(c,\ \operatorname{Tok}(P).\mathsf{span}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePattern}(P)\ \Downarrow \ (P,\ \mathsf{WildcardPattern})
\end{array}
$$

**(Parse-Pattern-Range-None)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParsePatternAtom}(P)\ \Downarrow \ (P_{1},\ p)\quad \lnot \ (\operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{".."})\ \lor \ \operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{"..="})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePatternRange}(P)\ \Downarrow \ (P_{1},\ p)
\end{array}
$$

**(Parse-Pattern-Range)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParsePatternAtom}(P)\ \Downarrow \ (P_{1},\ p_{0})\quad \operatorname{Tok}(P_{1})\ =\ \mathsf{op}\ \in \ \{\texttt{".."},\ \texttt{"..="}\}\quad \Gamma \ \vdash \ \operatorname{ParsePatternAtom}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ p_{1})\quad \mathsf{kind}\ =\ (\texttt{Exclusive}\ \mathsf{if}\ \mathsf{op}\ =\ \texttt{".."}\ \mathsf{else}\ \texttt{Inclusive}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePatternRange}(P)\ \Downarrow \ (P_{2},\ \operatorname{RangePattern}(\mathsf{kind},\ p_{0},\ p_{1}))
\end{array}
$$

### 17.4.3 AST Representation / Form

RangePattern(kind, lo, hi)

$$
\operatorname{ConstPatInt}(p)\ =\ n\ \Leftrightarrow \ p\ =\ \operatorname{LiteralPattern}(\operatorname{IntLiteral}(n))
$$

### 17.4.4 Static Semantics

**(Pat-Range-R)**

$$
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypePrim}(t)\quad t\ \in \ \mathsf{IntTypes}\quad \operatorname{ConstPatInt}(p_{l})\ =\ n_{l}\quad \operatorname{ConstPatInt}(p_{h})\ =\ n_{h}\quad (\mathsf{kind}\ =\ \texttt{".."}\ \Rightarrow \ n_{l}\ <\ n_{h})\quad (\mathsf{kind}\ =\ \texttt{"..="}\ \Rightarrow \ n_{l}\ \le \ n_{h}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RangePattern}(\mathsf{kind},\ p_{l},\ p_{h})\ \triangleleft \ T\ \dashv \ \emptyset 
\end{array}
$$

**(RangePattern-NonConst)**

$$
\begin{array}{l}
(\operatorname{ConstPatInt}(p_{l})\ \mathsf{undefined}\ \lor \ \operatorname{ConstPatInt}(p_{h})\ \mathsf{undefined})\quad c\ =\ \operatorname{Code}(\mathsf{RangePattern}-\mathsf{NonConst}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RangePattern}(\mathsf{kind},\ p_{l},\ p_{h})\ \triangleleft \ T\ \Uparrow \ c
\end{array}
$$

**(RangePattern-Empty)**

$$
\begin{array}{l}
\operatorname{ConstPatInt}(p_{l})\ =\ n_{l}\quad \operatorname{ConstPatInt}(p_{h})\ =\ n_{h}\quad ((\mathsf{kind}\ =\ \texttt{".."})\ \Rightarrow \ n_{l}\ \ge \ n_{h})\quad ((\mathsf{kind}\ =\ \texttt{"..="})\ \Rightarrow \ n_{l}\ >\ n_{h})\quad c\ =\ \operatorname{Code}(\mathsf{RangePattern}-\mathsf{Empty}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RangePattern}(\mathsf{kind},\ p_{l},\ p_{h})\ \triangleleft \ T\ \Uparrow \ c
\end{array}
$$

### 17.4.5 Dynamic Semantics

$$
\operatorname{ConstPat}(p)\ =\ v\ \Leftrightarrow \ p\ =\ \operatorname{LiteralPattern}(\ell )\ \land \ v\ =\ \operatorname{LiteralValue}(\ell ,\ \operatorname{PatType}(p))
$$

**(Match-Range)**

$$
\begin{array}{l}
\operatorname{ConstPat}(p_{l})\ =\ v_{l}\quad \operatorname{ConstPat}(p_{h})\ =\ v_{h}\quad v_{l}\ \le \ v\ \le \ v_{h} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MatchPattern}(p_{l}\ \texttt{..=}\ p_{h},\ v)\ \Downarrow \ \emptyset 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ConstPat}(p_{l})\ =\ v_{l}\quad \operatorname{ConstPat}(p_{h})\ =\ v_{h}\quad v_{l}\ \le \ v\ <\ v_{h} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MatchPattern}(p_{l}\ \texttt{..}\ p_{h},\ v)\ \Downarrow \ \emptyset 
\end{array}
$$

### 17.4.6 Lowering

Range patterns use the shared lowering rules in §17.5.6.

### 17.4.7 Diagnostics

Diagnostics are defined for range-pattern bounds that are not compile-time constants and for statically empty ranges.

## 17.5 Case Clauses

### 17.5.1 Syntax

```text
if_case      ::= if_case_pattern block_expr
if_case_pattern ::= pattern | ":" type
if_case_else ::= "else" block_expr
```

### 17.5.2 Parsing

**Case Clauses.**

**(Parse-IfCases-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseIfCase}(P)\ \Downarrow \ (P_{1},\ c)\quad \Gamma \ \vdash \ \operatorname{ParseIfCasesTail}(P_{1},\ [c])\ \Downarrow \ (P_{2},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseIfCases}(P)\ \Downarrow \ (P_{2},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})
\end{array}
$$

**(Parse-IfCase)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseIfCasePattern}(P)\ \Downarrow \ (P_{1},\ \mathsf{pat})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{body}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseIfCase}(P)\ \Downarrow \ (P_{2},\ \langle \mathsf{pat},\ \mathsf{body}\rangle )
\end{array}
$$

**(Parse-IfCase-Pattern)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParsePattern}(P)\ \Downarrow \ (P_{1},\ \mathsf{pat}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseIfCasePattern}(P)\ \Downarrow \ (P_{1},\ \mathsf{pat})
\end{array}
$$

**(Parse-IfCasesTail-End)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ =\ \operatorname{Punctuator}(\texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseIfCasesTail}(P,\ \mathsf{xs})\ \Downarrow \ (P,\ \mathsf{xs},\ \bot )
\end{array}
$$

**(Parse-IfCasesTail-Else)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{else})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ b) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseIfCasesTail}(P,\ \mathsf{xs})\ \Downarrow \ (P_{1},\ \mathsf{xs},\ b)
\end{array}
$$

**(Parse-IfCasesTail-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseIfCase}(P)\ \Downarrow \ (P_{1},\ c)\quad \Gamma \ \vdash \ \operatorname{ParseIfCasesTail}(P_{1},\ \mathsf{xs}\ \mathbin{++} \ [c])\ \Downarrow \ (P_{2},\ \mathsf{ys},\ \mathsf{else}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseIfCasesTail}(P,\ \mathsf{xs})\ \Downarrow \ (P_{2},\ \mathsf{ys},\ \mathsf{else}_{\mathsf{opt}})
\end{array}
$$

### 17.5.3 AST Representation / Form

$$
\mathsf{IfCase}\ =\ \langle \mathsf{pat},\ \mathsf{body}\rangle 
$$

$$
\operatorname{BindOrder}(p,\ B)\ =\ [\langle x,\ B[x]\rangle \ \mid \ x\ \in \ \operatorname{PatNames}(p)]
$$

### 17.5.4 Static Semantics

$$
\begin{array}{l}
\mathsf{CaseScopeJudg}\ =\ \{\operatorname{CaseScope}(\Gamma ,\ e,\ \mathsf{pat},\ T)\ \Downarrow \ \Gamma_{\mathsf{case}} ,\ \operatorname{ElseScope}(\Gamma ,\ e,\ \mathsf{pat},\ T)\ \Downarrow \ \Gamma_{\mathsf{else}} ,\ \operatorname{CasesElseScope}(\Gamma ,\ e,\ \mathsf{cases},\ T)\ \Downarrow \ \Gamma_{\mathsf{else}} \} \\[0.16em]
\mathsf{PatternNarrowJudg}\ =\ \{\operatorname{PatternNarrow}(\Gamma ,\ \mathsf{pat},\ T)\ \Downarrow \ T_{n}\} \\[0.16em]
\mathsf{PatternRejectNarrowJudg}\ =\ \{\operatorname{PatternRejectNarrow}(\Gamma ,\ \mathsf{pat},\ T)\ \Downarrow \ T_{r}\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ScrutineeBinding}(\operatorname{Identifier}(x))\ =\ x \\[0.16em]
\operatorname{ScrutineeBinding}(e)\ =\ \bot \ \Leftrightarrow \ e\ \ne \ \operatorname{Identifier}(\_) \\[0.16em]
\operatorname{RefineBinding}(\Gamma ,\ x,\ T_{n})\ \Downarrow \ \Gamma '\ \Leftrightarrow \ \operatorname{LookupNearestValueBinding}(\Gamma ,\ x)\ =\ b\ \land \ \Gamma '\ =\ \operatorname{ReplaceBindingType}(\Gamma ,\ b,\ T_{n})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{UnionOrSingle}([T])\ =\ T \\[0.16em]
\operatorname{UnionOrSingle}([T_{1},\ \ldots ,\ T_{n}])\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\ \Leftrightarrow \ n\ \ge \ 2
\end{array}
$$

**(PatternNarrow-Perm)**

$$
\begin{array}{l}
\operatorname{PatternNarrow}(\Gamma ,\ \mathsf{pat},\ T)\ \Downarrow \ T_{n} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{PatternNarrow}(\Gamma ,\ \mathsf{pat},\ \operatorname{TypePerm}(p,\ T))\ \Downarrow \ \operatorname{TypePerm}(p,\ T_{n})
\end{array}
$$

**(PatternNarrow-ModalRef)**

$$
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad S\ \in \ \operatorname{States}(M) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{PatternNarrow}(\Gamma ,\ \operatorname{ModalPattern}(S,\ \mathsf{fs}),\ T)\ \Downarrow \ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)
\end{array}
$$

**(PatternNarrow-ModalState)**

$$
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{PatternNarrow}(\Gamma ,\ \operatorname{ModalPattern}(S,\ \mathsf{fs}),\ T)\ \Downarrow \ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)
\end{array}
$$

**(PatternNarrow-Union)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad \mathsf{Ns}\ =\ [N_{i}\ \mid \ 1\ \le \ i\ \le \ n\ \land \ \operatorname{PatternNarrow}(\Gamma ,\ \mathsf{pat},\ T_{i})\ \Downarrow \ N_{i}]\quad \mid \mathsf{Ns}\mid \ \ge \ 1\quad \operatorname{UnionOrSingle}(\mathsf{Ns})\ =\ T_{n} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{PatternNarrow}(\Gamma ,\ \mathsf{pat},\ T)\ \Downarrow \ T_{n}
\end{array}
$$

**(PatternNarrow-Typed)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypedPattern}(x,\ T_{a})\ \triangleleft \ T\ \dashv \ B \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{PatternNarrow}(\Gamma ,\ \operatorname{TypedPattern}(x,\ T_{a}),\ T)\ \Downarrow \ T_{a}
\end{array}
$$

**(PatternRejectNarrow-Union)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad \mathsf{Rs}\ =\ [T_{i}\ \mid \ 1\ \le \ i\ \le \ n\ \land \ \operatorname{PatternNarrow}(\Gamma ,\ \mathsf{pat},\ T_{i})\ \mathsf{undefined}]\quad 1\ \le \ \mid \mathsf{Rs}\mid \ <\ n\quad \operatorname{UnionOrSingle}(\mathsf{Rs})\ =\ T_{r} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{PatternRejectNarrow}(\Gamma ,\ \mathsf{pat},\ T)\ \Downarrow \ T_{r}
\end{array}
$$

**(CaseScope-Narrow)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \mathsf{pat}\ \triangleleft \ T_{s}\ \dashv \ B\quad \operatorname{Distinct}(\operatorname{PatNames}(\mathsf{pat}))\quad \operatorname{ScrutineeBinding}(e)\ =\ x\quad \operatorname{PatternNarrow}(\Gamma ,\ \mathsf{pat},\ T_{s})\ \Downarrow \ T_{n}\quad \operatorname{RefineBinding}(\Gamma ,\ x,\ T_{n})\ \Downarrow \ \Gamma_{r} \quad \Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma_{r} )\quad \operatorname{IntroAll}(\Gamma_{0} ,\ B)\ \Downarrow \ \Gamma_{\mathsf{case}}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{CaseScope}(\Gamma ,\ e,\ \mathsf{pat},\ T_{s})\ \Downarrow \ \Gamma_{\mathsf{case}} 
\end{array}
$$

**(CaseScope-PatternOnly)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \mathsf{pat}\ \triangleleft \ T_{s}\ \dashv \ B\quad \operatorname{Distinct}(\operatorname{PatNames}(\mathsf{pat}))\quad (\operatorname{ScrutineeBinding}(e)\ =\ \bot \ \lor \ \operatorname{PatternNarrow}(\Gamma ,\ \mathsf{pat},\ T_{s})\ \mathsf{undefined})\quad \Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \operatorname{IntroAll}(\Gamma_{0} ,\ B)\ \Downarrow \ \Gamma_{\mathsf{case}}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{CaseScope}(\Gamma ,\ e,\ \mathsf{pat},\ T_{s})\ \Downarrow \ \Gamma_{\mathsf{case}} 
\end{array}
$$

**(ElseScope-Narrow)**

$$
\begin{array}{l}
\operatorname{ScrutineeBinding}(e)\ =\ x\quad \operatorname{PatternRejectNarrow}(\Gamma ,\ \mathsf{pat},\ T_{s})\ \Downarrow \ T_{r}\quad \operatorname{RefineBinding}(\Gamma ,\ x,\ T_{r})\ \Downarrow \ \Gamma_{\mathsf{else}}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ElseScope}(\Gamma ,\ e,\ \mathsf{pat},\ T_{s})\ \Downarrow \ \Gamma_{\mathsf{else}} 
\end{array}
$$

**(ElseScope-Original)**

$$
\begin{array}{l}
\operatorname{ScrutineeBinding}(e)\ =\ \bot \ \lor \ \operatorname{PatternRejectNarrow}(\Gamma ,\ \mathsf{pat},\ T_{s})\ \mathsf{undefined} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ElseScope}(\Gamma ,\ e,\ \mathsf{pat},\ T_{s})\ \Downarrow \ \Gamma 
\end{array}
$$

**(CasesElseScope-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{CasesElseScope}(\Gamma ,\ e,\ [],\ T)\ \Downarrow \ \Gamma 
\end{array}
$$

**(CasesElseScope-Cons-Narrow)**

$$
\begin{array}{l}
\operatorname{PatternRejectNarrow}(\Gamma ,\ \mathsf{pat},\ T)\ \Downarrow \ T_{r}\quad \operatorname{ElseScope}(\Gamma ,\ e,\ \mathsf{pat},\ T)\ \Downarrow \ \Gamma_{1} \quad \operatorname{CasesElseScope}(\Gamma_{1} ,\ e,\ \mathsf{cases},\ T_{r})\ \Downarrow \ \Gamma_{2}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{CasesElseScope}(\Gamma ,\ e,\ \langle \mathsf{pat},\ \mathsf{body}\rangle \ \mathbin{::} \ \mathsf{cases},\ T)\ \Downarrow \ \Gamma_{2} 
\end{array}
$$

**(CasesElseScope-Cons-Original)**

$$
\begin{array}{l}
\operatorname{PatternRejectNarrow}(\Gamma ,\ \mathsf{pat},\ T)\ \mathsf{undefined}\quad \operatorname{ElseScope}(\Gamma ,\ e,\ \mathsf{pat},\ T)\ \Downarrow \ \Gamma_{1} \quad \operatorname{CasesElseScope}(\Gamma_{1} ,\ e,\ \mathsf{cases},\ T)\ \Downarrow \ \Gamma_{2}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{CasesElseScope}(\Gamma ,\ e,\ \langle \mathsf{pat},\ \mathsf{body}\rangle \ \mathbin{::} \ \mathsf{cases},\ T)\ \Downarrow \ \Gamma_{2} 
\end{array}
$$

### 17.5.5 Dynamic Semantics

$$
\begin{array}{l}
\mathsf{IfCaseJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{EvalIfCaseSigma}(c,\ v,\ \sigma )\ \Downarrow \ (\mathsf{res},\ \sigma ')\} \\[0.16em]
\mathsf{IfCaseListJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{EvalIfCaseListSigma}(\mathsf{cases},\ \mathsf{else}_{\mathsf{opt}},\ v,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\}
\end{array}
$$

**(EvalIfCase-Fail)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MatchPattern}(\mathsf{pat},\ v)\ \mathsf{undefined} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalIfCaseSigma}(\langle \mathsf{pat},\ \mathsf{body}\rangle ,\ v,\ \sigma )\ \Downarrow \ (\mathsf{NoMatch},\ \sigma )
\end{array}
$$

**(EvalIfCase-Hit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MatchPattern}(\mathsf{pat},\ v)\ \Downarrow \ B\quad \operatorname{BindOrder}(\mathsf{pat},\ B)\ =\ \mathsf{binds}\quad \operatorname{BlockEnter}(\sigma ,\ \mathsf{binds})\ \Downarrow \ (\sigma_{1} ,\ \mathsf{scope})\quad \Gamma \ \vdash \ \operatorname{EvalBlockSigma}(\mathsf{body},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )\quad \operatorname{BlockExit}(\sigma_{2} ,\ \mathsf{scope},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalIfCaseSigma}(\langle \mathsf{pat},\ \mathsf{body}\rangle ,\ v,\ \sigma )\ \Downarrow \ (\operatorname{Match}(\mathsf{out}'),\ \sigma_{3} )
\end{array}
$$

**(EvalIfCases-Head)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalIfCaseSigma}(c,\ v,\ \sigma )\ \Downarrow \ (\operatorname{Match}(\mathsf{out}),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalIfCaseListSigma}(c\mathbin{::} \mathsf{cs},\ \mathsf{else}_{\mathsf{opt}},\ v,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{1} )
\end{array}
$$

**(EvalIfCases-Tail)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalIfCaseSigma}(c,\ v,\ \sigma )\ \Downarrow \ (\mathsf{NoMatch},\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalIfCaseListSigma}(\mathsf{cs},\ \mathsf{else}_{\mathsf{opt}},\ v,\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalIfCaseListSigma}(c\mathbin{::} \mathsf{cs},\ \mathsf{else}_{\mathsf{opt}},\ v,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

**(EvalIfCases-Else)**

$$
\begin{array}{l}
\mathsf{else}_{\mathsf{opt}}\ =\ b\quad \Gamma \ \vdash \ \operatorname{EvalBlockSigma}(b,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalIfCaseListSigma}([],\ \mathsf{else}_{\mathsf{opt}},\ v,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')
\end{array}
$$

**(EvalIfCases-None)**

$$
\begin{array}{l}
\mathsf{else}_{\mathsf{opt}}\ =\ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalIfCaseListSigma}([],\ \mathsf{else}_{\mathsf{opt}},\ v,\ \sigma )\ \Downarrow \ (\operatorname{Val}(()),\ \sigma )
\end{array}
$$

### 17.5.6 Lowering

$$
\begin{array}{l}
\mathsf{LowerBindJudg}\ =\ \{\mathsf{LowerBindList},\ \mathsf{LowerBindPattern},\ \mathsf{LowerIfCases}\} \\[0.16em]
\mathsf{PatternLowerJudg}\ =\ \{\mathsf{LowerBindPattern},\ \mathsf{LowerBindList},\ \mathsf{LowerIfCases},\ \mathsf{TagOf}\}
\end{array}
$$

**(Lower-Pat-Correctness)**

$$
\begin{array}{l}
\forall \ v,\ \Gamma \ \vdash \ \operatorname{MatchPattern}(\mathsf{pat},\ v)\ \Downarrow \ B\ \Rightarrow \ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\mathsf{ok},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerBindPattern}(\mathsf{pat},\ v)\ \Downarrow \ \mathsf{IR} \\[0.16em]
\operatorname{IfCaseValueCorrect}(\Gamma ,\ \mathsf{scrut},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}},\ v)\ \Leftrightarrow \ \forall \ \sigma ,\ v',\ \sigma '.\ \Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{IfCaseExpr}(\mathsf{scrut},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma ')\ \Rightarrow \ v\ =\ v'
\end{array}
$$

**(Lower-IfCases-Correctness)**

$$
\begin{array}{l}
\forall \ \sigma ,\ \Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{IfCaseExpr}(\mathsf{scrut},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\ \Rightarrow \ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\quad \operatorname{IfCaseValueCorrect}(\Gamma ,\ \mathsf{scrut},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}},\ v) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIfCases}(\mathsf{scrut},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ \Downarrow \ \langle \mathsf{IR},\ v\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{EnumValuePath}(v)\ =\ \mathsf{path}\ \Leftrightarrow \ v\ =\ \operatorname{EnumValue}(\mathsf{path},\ \mathsf{payload}) \\[0.16em]
\operatorname{VariantIndex}(E,\ \mathsf{name})\ =\ i\ \Leftrightarrow \ \operatorname{Variants}(E)\ =\ [v_{0},\ \ldots ,\ v_{k}]\ \land \ v_{i}.\mathsf{name}\ =\ \mathsf{name} \\[0.16em]
\operatorname{EnumDisc}(E,\ \mathsf{name})\ =\ d\ \Leftrightarrow \ \operatorname{EnumDiscriminants}(E)\ \Downarrow \ \mathsf{ds}\ \land \ \operatorname{VariantIndex}(E,\ \mathsf{name})\ =\ i\ \land \ \mathsf{ds}[i]\ =\ d \\[0.16em]
\operatorname{StateIndex}(M,\ S)\ =\ i\ \Leftrightarrow \ \operatorname{States}(M)\ =\ [S_{0},\ \ldots ,\ S_{k}]\ \land \ S_{i}\ =\ S
\end{array}
$$

**(TagOf-Enum)**

$$
\begin{array}{l}
\operatorname{EnumValuePath}(v)\ =\ \mathsf{path}\quad \operatorname{EnumPath}(\mathsf{path})\ =\ p\quad T\ =\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{VariantName}(\mathsf{path})\ =\ \mathsf{name}\quad \operatorname{EnumDisc}(E,\ \mathsf{name})\ =\ d \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TagOf}(v,\ T)\ \Downarrow \ d
\end{array}
$$

**(TagOf-Modal)**

$$
\begin{array}{l}
v\ =\ \langle S,\ v_{S}\rangle \quad T\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \operatorname{StateIndex}(M,\ S)\ =\ i \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TagOf}(v,\ T)\ \Downarrow \ i
\end{array}
$$

**(Lower-BindList-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerBindList}([])\ \Downarrow \ \varepsilon 
\end{array}
$$

**(Lower-BindList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerBindList}(\mathsf{bs})\ \Downarrow \ \mathsf{IR}_{r} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerBindList}([\langle x,\ v\rangle ]\ \mathbin{++} \ \mathsf{bs})\ \Downarrow \ \operatorname{SeqIR}(\operatorname{BindVarIR}(x,\ v),\ \mathsf{IR}_{r})
\end{array}
$$

**(Lower-Pat-General)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MatchPattern}(\mathsf{pat},\ v)\ \Downarrow \ B\quad \operatorname{BindOrder}(\mathsf{pat},\ B)\ =\ \mathsf{binds}\quad \Gamma \ \vdash \ \operatorname{LowerBindList}(\mathsf{binds})\ \Downarrow \ \mathsf{IR} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerBindPattern}(\mathsf{pat},\ v)\ \Downarrow \ \mathsf{IR}
\end{array}
$$

**(Lower-Pat-Err)**
MatchPattern(pat, v) undefined

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerBindPattern}(\mathsf{pat},\ v)\ \Uparrow 
\end{array}
$$

**(Lower-IfCases)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(\mathsf{scrut})\ \Downarrow \ \langle \mathsf{IR}_{s},\ v_{s}\rangle \quad \Gamma ;\ R;\ L\ \vdash \ \mathsf{scrut}\ :\ T_{s}\quad \forall \ i,\ \mathsf{case}_{i}\ =\ \langle p_{i},\ b_{i}\rangle \quad \forall \ i,\ \operatorname{CaseScope}(\Gamma ,\ \mathsf{scrut},\ p_{i},\ T_{s})\ \Downarrow \ \Gamma_{i}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIfCases}(\mathsf{scrut},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{s},\ \operatorname{IfCaseIR}(v_{s},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})),\ v_{\mathsf{case}}\rangle 
\end{array}
$$

### 17.5.7 Diagnostics

No additional named diagnostics are introduced for case-clause structure beyond the diagnostics of the contained patterns and the exhaustiveness rules in §17.6.

## 17.6 Exhaustiveness and Reachability

### 17.6.1 Syntax

No additional surface syntax is introduced.

### 17.6.2 Parsing

Exhaustiveness and reachability are not parser-owned.

### 17.6.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{AllEq}\_\Gamma ([T_{1},\ \ldots ,\ T_{n}])\ \Leftrightarrow \ \forall \ i.\ \Gamma \ \vdash \ T_{i}\ \equiv \ T_{1} \\[0.16em]
\operatorname{Irrefutable}(\mathsf{pat},\ T)\ \Leftrightarrow \ \mathsf{pat}\ =\ \mathsf{WildcardPattern}\ \lor \ \mathsf{pat}\ =\ \operatorname{IdentifierPattern}(\_)\ \lor \ (\mathsf{pat}\ =\ \operatorname{TypedPattern}(\_,\ T_{a})\ \land \ T_{a}\ =\ \operatorname{StripPerm}(T))\ \lor \ (\mathsf{pat}\ =\ \operatorname{TuplePattern}([p_{1},\ \ldots ,\ p_{n}])\ \land \ \operatorname{StripPerm}(T)\ =\ \operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}])\ \land \ \forall \ i.\ \operatorname{Irrefutable}(p_{i},\ T_{i}))\ \lor \ (\mathsf{pat}\ =\ \operatorname{RecordPattern}(p,\ \mathsf{fs})\ \land \ \operatorname{StripPerm}(T)\ =\ \operatorname{TypePath}(p)\ \land \ \operatorname{RecordDecl}(p)\ =\ R\ \land \ \forall \ \mathsf{fp}\ \in \ \mathsf{fs}.\ \operatorname{Irrefutable}(\operatorname{PatOf}(\mathsf{fp}),\ \operatorname{FieldType}(R,\ \operatorname{FieldName}(\mathsf{fp})))) \\[0.16em]
\operatorname{HasIrrefutableCase}(\mathsf{cases},\ T)\ \Leftrightarrow \ \exists \ \mathsf{case}\ \in \ \mathsf{cases}.\ \exists \ p,\ b.\ \mathsf{case}\ =\ \langle p,\ b\rangle \ \land \ \operatorname{Irrefutable}(p,\ T) \\[0.16em]
\operatorname{CaseLabel}(\operatorname{EnumPattern}(\mathsf{path},\ v,\ \_))\ =\ \langle \texttt{enum},\ \mathsf{path},\ v\rangle  \\[0.16em]
\operatorname{CaseLabel}(\operatorname{ModalPattern}(s,\ \_))\ =\ \langle \texttt{modal},\ s\rangle  \\[0.16em]
\operatorname{CaseLabel}(\operatorname{TypedPattern}(\_,\ T))\ =\ \langle \texttt{union},\ T\rangle  \\[0.16em]
\operatorname{CaseLabel}(\_)\ =\ \bot  \\[0.16em]
\operatorname{CaseUnreachable}(T,\ \mathsf{cases},\ i)\ \Leftrightarrow  \\[0.16em]
\ (\exists \ j.\ 1\ \le \ j\ <\ i\ \land \ \operatorname{Irrefutable}(\mathsf{cases}[j].\mathsf{pat},\ T))\ \lor  \\[0.16em]
\ (\operatorname{CaseLabel}(\mathsf{cases}[i].\mathsf{pat})\ \ne \ \bot \ \land \ \exists \ j.\ 1\ \le \ j\ <\ i\ \land \ \operatorname{CaseLabel}(\mathsf{cases}[j].\mathsf{pat})\ =\ \operatorname{CaseLabel}(\mathsf{cases}[i].\mathsf{pat}))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{VariantNames}(E)\ =\ [\ v.\mathsf{name}\ \mid \ v\ \in \ E.\mathsf{variants}\ ] \\[0.16em]
\operatorname{CaseVariants}(\mathsf{cases})\ =\ \{\ v\ \mid \ \exists \ p,\ b.\ \langle p,\ b\rangle \ \in \ \mathsf{cases}\ \land \ p\ =\ \operatorname{EnumPattern}(\_,\ v,\ \_)\ \}
\end{array}
$$

$$
\operatorname{CaseStates}(\mathsf{cases})\ =\ \{\ s\ \mid \ \exists \ p,\ b.\ \langle p,\ b\rangle \ \in \ \mathsf{cases}\ \land \ p\ =\ \operatorname{ModalPattern}(\_,\ s)\ \}
$$

$$
\begin{array}{l}
\operatorname{UnionTypes}(U)\ =\ [T_{1},\ \ldots ,\ T_{n}]\ \Leftrightarrow \ U\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}]) \\[0.16em]
\operatorname{CaseUnionTypes}(\mathsf{cases})\ =\ \{\ T\ \mid \ \exists \ p,\ b.\ \langle p,\ b\rangle \ \in \ \mathsf{cases}\ \land \ p\ =\ \operatorname{TypedPattern}(\_,\ T)\ \} \\[0.16em]
\operatorname{PatternMayMatchType}(\Gamma ,\ p,\ T)\ \Leftrightarrow \ \exists \ B.\ \Gamma \ \vdash \ p\ \triangleleft \ T\ \dashv \ B \\[0.16em]
\operatorname{UnionTypesExhaustive}(\mathsf{cases},\ \mathsf{types})\ \Leftrightarrow \ \forall \ T\ \in \ \mathsf{types}.\ \exists \ \mathsf{case}\ \in \ \mathsf{cases}.\ \exists \ p,\ b.\ \mathsf{case}\ =\ \langle p,\ b\rangle \ \land \ \operatorname{PatternMayMatchType}(\Gamma ,\ p,\ T)
\end{array}
$$

### 17.6.4 Static Semantics

**Enum Case Analysis**

**(T-IfCase-Enum)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \forall \ i,\ \mathsf{case}_{i}\ =\ \langle p_{i},\ b_{i}\rangle \quad \forall \ i,\ \operatorname{CaseScope}(\Gamma ,\ e,\ p_{i},\ \operatorname{TypePath}(p))\ \Downarrow \ \Gamma_{i} \quad \forall \ i,\ \Gamma_{i} ;\ R;\ L\ \vdash \ b_{i}\ :\ T_{r}\quad (\mathsf{else}_{\mathsf{opt}}\ =\ \bot \ \lor \ (\operatorname{CasesElseScope}(\Gamma ,\ e,\ \mathsf{cases},\ \operatorname{TypePath}(p))\ \Downarrow \ \Gamma_{e} \ \land \ \Gamma_{e} ;\ R;\ L\ \vdash \ \mathsf{else}_{\mathsf{opt}}\ :\ T_{r}))\quad (\mathsf{else}_{\mathsf{opt}}\ \ne \ \bot \ \lor \ \operatorname{HasIrrefutableCase}(\mathsf{cases},\ \operatorname{TypePath}(p))\ \lor \ \operatorname{CaseVariants}(\mathsf{cases})\ =\ \operatorname{VariantNames}(E)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ :\ T_{r}
\end{array}
$$

**Modal Case Analysis**

**(T-IfCase-Modal)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \forall \ i,\ \mathsf{case}_{i}\ =\ \langle p_{i},\ b_{i}\rangle \quad \forall \ i,\ \operatorname{CaseScope}(\Gamma ,\ e,\ p_{i},\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}}))\ \Downarrow \ \Gamma_{i} \quad \forall \ i,\ \Gamma_{i} ;\ R;\ L\ \vdash \ b_{i}\ :\ T_{r}\quad (\mathsf{else}_{\mathsf{opt}}\ =\ \bot \ \lor \ (\operatorname{CasesElseScope}(\Gamma ,\ e,\ \mathsf{cases},\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}}))\ \Downarrow \ \Gamma_{e} \ \land \ \Gamma_{e} ;\ R;\ L\ \vdash \ \mathsf{else}_{\mathsf{opt}}\ :\ T_{r}))\quad (\mathsf{else}_{\mathsf{opt}}\ \ne \ \bot \ \lor \ \operatorname{HasIrrefutableCase}(\mathsf{cases},\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}}))\ \lor \ \operatorname{CaseStates}(\mathsf{cases})\ =\ \operatorname{States}(M)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ :\ T_{r}
\end{array}
$$

**(IfCase-Modal-NonExhaustive)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \mathsf{else}_{\mathsf{opt}}\ =\ \bot \quad \lnot (\operatorname{HasIrrefutableCase}(\mathsf{cases},\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}}))\ \lor \ \operatorname{CaseStates}(\mathsf{cases})\ =\ \operatorname{States}(M))\quad c\ =\ \operatorname{Code}(\mathsf{IfCase}-\mathsf{Modal}-\mathsf{NonExhaustive}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ \Uparrow \ c
\end{array}
$$

**Union Case Analysis**

**(T-IfCase-Union)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad \forall \ i,\ \mathsf{case}_{i}\ =\ \langle p_{i},\ b_{i}\rangle \quad \forall \ i,\ \operatorname{CaseScope}(\Gamma ,\ e,\ p_{i},\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}]))\ \Downarrow \ \Gamma_{i} \quad \forall \ i,\ \Gamma_{i} ;\ R;\ L\ \vdash \ b_{i}\ :\ T_{r}\quad (\mathsf{else}_{\mathsf{opt}}\ =\ \bot \ \lor \ (\operatorname{CasesElseScope}(\Gamma ,\ e,\ \mathsf{cases},\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}]))\ \Downarrow \ \Gamma_{e} \ \land \ \Gamma_{e} ;\ R;\ L\ \vdash \ \mathsf{else}_{\mathsf{opt}}\ :\ T_{r}))\quad (\mathsf{else}_{\mathsf{opt}}\ \ne \ \bot \ \lor \ \operatorname{HasIrrefutableCase}(\mathsf{cases},\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}]))\ \lor \ \operatorname{UnionTypesExhaustive}(\mathsf{cases},\ [T_{1},\ \ldots ,\ T_{n}])) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ :\ T_{r}
\end{array}
$$

**(IfCase-Union-NonExhaustive)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad \mathsf{else}_{\mathsf{opt}}\ =\ \bot \quad \lnot (\operatorname{HasIrrefutableCase}(\mathsf{cases},\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}]))\ \lor \ \operatorname{UnionTypesExhaustive}(\mathsf{cases},\ [T_{1},\ \ldots ,\ T_{n}]))\quad c\ =\ \operatorname{Code}(\mathsf{IfCase}-\mathsf{Union}-\mathsf{NonExhaustive}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ \Uparrow \ c
\end{array}
$$

**(Chk-IfCase-Union)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad \forall \ i,\ \mathsf{case}_{i}\ =\ \langle p_{i},\ b_{i}\rangle \quad \forall \ i,\ \operatorname{CaseScope}(\Gamma ,\ e,\ p_{i},\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}]))\ \Downarrow \ \Gamma_{i} \quad \forall \ i,\ \Gamma_{i} ;\ R;\ L\ \vdash \ b_{i}\ \Leftarrow \ T\quad (\mathsf{else}_{\mathsf{opt}}\ =\ \bot \ \lor \ (\operatorname{CasesElseScope}(\Gamma ,\ e,\ \mathsf{cases},\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}]))\ \Downarrow \ \Gamma_{e} \ \land \ \Gamma_{e} ;\ R;\ L\ \vdash \ \mathsf{else}_{\mathsf{opt}}\ \Leftarrow \ T\ \dashv \ \emptyset ))\quad (\mathsf{else}_{\mathsf{opt}}\ \ne \ \bot \ \lor \ \operatorname{HasIrrefutableCase}(\mathsf{cases},\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}]))\ \lor \ \operatorname{UnionTypesExhaustive}(\mathsf{cases},\ [T_{1},\ \ldots ,\ T_{n}])) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ \Leftarrow \ T\ \dashv \ \emptyset 
\end{array}
$$

**Other Case Analysis**

**(T-IfCase-Other)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T_{s}\quad \forall \ i,\ \mathsf{case}_{i}\ =\ \langle p_{i},\ b_{i}\rangle \quad \forall \ i,\ \operatorname{CaseScope}(\Gamma ,\ e,\ p_{i},\ T_{s})\ \Downarrow \ \Gamma_{i} \quad \forall \ i,\ \Gamma_{i} ;\ R;\ L\ \vdash \ b_{i}\ :\ T_{r}\quad (\mathsf{else}_{\mathsf{opt}}\ =\ \bot \ \lor \ (\operatorname{CasesElseScope}(\Gamma ,\ e,\ \mathsf{cases},\ T_{s})\ \Downarrow \ \Gamma_{e} \ \land \ \Gamma_{e} ;\ R;\ L\ \vdash \ \mathsf{else}_{\mathsf{opt}}\ :\ T_{r}))\quad (\mathsf{else}_{\mathsf{opt}}\ \ne \ \bot \ \lor \ \operatorname{HasIrrefutableCase}(\mathsf{cases},\ T_{s})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ :\ T_{r}
\end{array}
$$

**(Chk-IfCase-Enum)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \forall \ i,\ \mathsf{case}_{i}\ =\ \langle p_{i},\ b_{i}\rangle \quad \forall \ i,\ \operatorname{CaseScope}(\Gamma ,\ e,\ p_{i},\ \operatorname{TypePath}(p))\ \Downarrow \ \Gamma_{i} \quad \forall \ i,\ \Gamma_{i} ;\ R;\ L\ \vdash \ b_{i}\ \Leftarrow \ T\quad (\mathsf{else}_{\mathsf{opt}}\ =\ \bot \ \lor \ (\operatorname{CasesElseScope}(\Gamma ,\ e,\ \mathsf{cases},\ \operatorname{TypePath}(p))\ \Downarrow \ \Gamma_{e} \ \land \ \Gamma_{e} ;\ R;\ L\ \vdash \ \mathsf{else}_{\mathsf{opt}}\ \Leftarrow \ T\ \dashv \ \emptyset ))\quad (\mathsf{else}_{\mathsf{opt}}\ \ne \ \bot \ \lor \ \operatorname{HasIrrefutableCase}(\mathsf{cases},\ \operatorname{TypePath}(p))\ \lor \ \operatorname{CaseVariants}(\mathsf{cases})\ =\ \operatorname{VariantNames}(E)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ \Leftarrow \ T\ \dashv \ \emptyset 
\end{array}
$$

**(IfCase-Enum-NonExhaustive)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \mathsf{else}_{\mathsf{opt}}\ =\ \bot \quad \lnot (\operatorname{HasIrrefutableCase}(\mathsf{cases},\ \operatorname{TypePath}(p))\ \lor \ \operatorname{CaseVariants}(\mathsf{cases})\ =\ \operatorname{VariantNames}(E))\quad c\ =\ \operatorname{Code}(\mathsf{IfCase}-\mathsf{Enum}-\mathsf{NonExhaustive}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ \Uparrow \ c
\end{array}
$$

**(Chk-IfCase-Modal)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \forall \ i,\ \mathsf{case}_{i}\ =\ \langle p_{i},\ b_{i}\rangle \quad \forall \ i,\ \operatorname{CaseScope}(\Gamma ,\ e,\ p_{i},\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}}))\ \Downarrow \ \Gamma_{i} \quad \forall \ i,\ \Gamma_{i} ;\ R;\ L\ \vdash \ b_{i}\ \Leftarrow \ T\quad (\mathsf{else}_{\mathsf{opt}}\ =\ \bot \ \lor \ (\operatorname{CasesElseScope}(\Gamma ,\ e,\ \mathsf{cases},\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}}))\ \Downarrow \ \Gamma_{e} \ \land \ \Gamma_{e} ;\ R;\ L\ \vdash \ \mathsf{else}_{\mathsf{opt}}\ \Leftarrow \ T\ \dashv \ \emptyset ))\quad (\mathsf{else}_{\mathsf{opt}}\ \ne \ \bot \ \lor \ \operatorname{HasIrrefutableCase}(\mathsf{cases},\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}}))\ \lor \ \operatorname{CaseStates}(\mathsf{cases})\ =\ \operatorname{States}(M)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ \Leftarrow \ T\ \dashv \ \emptyset 
\end{array}
$$

**(Chk-IfCase-Other)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T_{s}\quad \forall \ i,\ \mathsf{case}_{i}\ =\ \langle p_{i},\ b_{i}\rangle \quad \forall \ i,\ \operatorname{CaseScope}(\Gamma ,\ e,\ p_{i},\ T_{s})\ \Downarrow \ \Gamma_{i} \quad \forall \ i,\ \Gamma_{i} ;\ R;\ L\ \vdash \ b_{i}\ \Leftarrow \ T\quad (\mathsf{else}_{\mathsf{opt}}\ =\ \bot \ \lor \ (\operatorname{CasesElseScope}(\Gamma ,\ e,\ \mathsf{cases},\ T_{s})\ \Downarrow \ \Gamma_{e} \ \land \ \Gamma_{e} ;\ R;\ L\ \vdash \ \mathsf{else}_{\mathsf{opt}}\ \Leftarrow \ T\ \dashv \ \emptyset ))\quad (\mathsf{else}_{\mathsf{opt}}\ \ne \ \bot \ \lor \ \operatorname{HasIrrefutableCase}(\mathsf{cases},\ T_{s})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ \Leftarrow \ T\ \dashv \ \emptyset 
\end{array}
$$

**(Chk-IfIs)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T_{s}\quad \operatorname{CaseScope}(\Gamma ,\ e,\ \mathsf{pat},\ T_{s})\ \Downarrow \ \Gamma_{1} \quad \operatorname{ElseScope}(\Gamma ,\ e,\ \mathsf{pat},\ T_{s})\ \Downarrow \ \Gamma_{2} \quad \Gamma_{1} ;\ R;\ L\ \vdash \ b_{t}\ \Leftarrow \ T\ \dashv \ \emptyset \quad \Gamma_{2} ;\ R;\ L\ \vdash \ b_{f}\ \Leftarrow \ T\ \dashv \ \emptyset  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfIsExpr}(e,\ \mathsf{pat},\ b_{t},\ b_{f})\ \Leftarrow \ T\ \dashv \ \emptyset 
\end{array}
$$

**(Chk-IfIs-No-Else)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T_{s}\quad \operatorname{CaseScope}(\Gamma ,\ e,\ \mathsf{pat},\ T_{s})\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} ;\ R;\ L\ \vdash \ b_{t}\ \Leftarrow \ \operatorname{TypePrim}(\texttt{()})\ \dashv \ \emptyset  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfIsExpr}(e,\ \mathsf{pat},\ b_{t},\ \bot )\ \Leftarrow \ \operatorname{TypePrim}(\texttt{()})\ \dashv \ \emptyset 
\end{array}
$$

**(IfCase-Unreachable)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T_{s}\quad 1\ \le \ i\ \le \ \mid \mathsf{cases}\mid \quad \operatorname{CaseUnreachable}(T_{s},\ \mathsf{cases},\ i)\quad c\ =\ \operatorname{Code}(\mathsf{IfCase}-\mathsf{Unreachable}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ \Uparrow \ c
\end{array}
$$

### 17.6.5 Dynamic Semantics

No additional dynamic semantics are introduced beyond the case-selection and pattern-matching rules of §17.5.5 and the surrounding `if ... is ...` expression semantics of §16.7.5.

### 17.6.6 Lowering

No additional lowering is introduced beyond the shared `LowerIfCases` and `LowerBindPattern` rules of §17.5.6.

### 17.6.7 Diagnostics

Diagnostics are defined for non-exhaustive `if ... is { ... }` case analysis on general modal types, union types, and enum types, and for unreachable case clauses.

## 17.7 Pattern Diagnostics Supplement

This section owns diagnostics for pattern exhaustiveness, irrefutability, and pattern-shape validity.

**(IfIs-BareTypePattern-Err)**

$$
\begin{array}{l}
\texttt{if ... is}\ \mathsf{case}\ \mathsf{position}\ \mathsf{contains}\ \operatorname{IdentifierPattern}(x)\quad \operatorname{ResolveTypeName}(\Gamma ,\ x)\ \mathsf{defined}\quad c\ =\ \operatorname{Code}(\mathsf{IfIs}-\mathsf{BareTypePattern}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IfIsCasePattern}(\operatorname{IdentifierPattern}(x))\ \Uparrow \ c
\end{array}
$$

**(IfIs-TypedPattern-Incompatible)**

$$
\begin{array}{l}
\texttt{if ... is}\ \mathsf{case}\ \mathsf{position}\ \mathsf{contains}\ \operatorname{TypedPattern}(x,\ T_{a})\quad \Gamma \ \vdash \ \operatorname{TypedPattern}(x,\ T_{a})\ \triangleleft \ T_{s}\ \mathsf{undefined}\quad c\ =\ \operatorname{Code}(\mathsf{IfIs}-\mathsf{TypedPattern}-\mathsf{Incompatible}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IfIsCasePattern}(\operatorname{TypedPattern}(x,\ T_{a}),\ T_{s})\ \Uparrow \ c
\end{array}
$$

| Code         | Severity | Detection    | Condition                                                          |
| ------------ | -------- | ------------ | ------------------------------------------------------------------ |
| `E-SEM-2705` | Error    | Compile-time | `if ... is { ... }` case analysis is not exhaustive for union type |
| `E-SEM-2711` | Error    | Compile-time | Refutable pattern in irrefutable context (`let`)                   |
| `E-SEM-2713` | Error    | Compile-time | Duplicate binding identifier within single pattern                 |
| `E-SEM-2721` | Error    | Compile-time | Range pattern bounds are not compile-time constants                |
| `E-SEM-2722` | Error    | Compile-time | Range pattern start exceeds end (empty range)                      |
| `E-SEM-2731` | Error    | Compile-time | Record pattern references non-existent field                       |
| `E-SEM-2741` | Error    | Compile-time | `if ... is { ... }` case analysis is not exhaustive                |
| `E-SEM-2751` | Error    | Compile-time | Case clause is unreachable                                         |
| `E-SEM-2761` | Error    | Compile-time | Bare type name in `if ... is` pattern; use `: T` or `_: T`         |
| `E-SEM-2762` | Error    | Compile-time | Typed `if ... is` pattern is incompatible with the scrutinee type  |
