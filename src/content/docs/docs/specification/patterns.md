---
title: "Patterns"
description: "17. Patterns of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T18:13:03.158Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## 17. Patterns

### 17.1 Basic Patterns

#### 17.1.1 Syntax

```text
basic_pattern ::= literal | "_" | identifier
```

#### 17.1.2 Parsing

**(Parse-Pattern-Literal)**

```math
\begin{array}{l}
\operatorname{Tok}(P).\mathsf{kind}\ \in \ \{\mathsf{IntLiteral},\ \mathsf{FloatLiteral},\ \mathsf{StringLiteral},\ \mathsf{CharLiteral},\ \mathsf{BoolLiteral},\ \mathsf{NullLiteral}\} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParsePatternAtom}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \operatorname{LiteralPattern}(\operatorname{Tok}(P)))
\end{array}
```

**(Parse-Pattern-Wildcard)**

```math
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \operatorname{Lexeme}(\operatorname{Tok}(P))\ =\ \texttt{"\_"} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParsePatternAtom}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \mathsf{WildcardPattern})
\end{array}
```

**(Parse-Pattern-Identifier)**
IsIdent(Tok(P))

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParsePatternAtom}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \operatorname{IdentifierPattern}(\operatorname{Lexeme}(\operatorname{Tok}(P))))
\end{array}
```

#### 17.1.3 AST Representation / Form

```math
\begin{array}{l}
\mathsf{Pattern}\ =\ \{\operatorname{LiteralPattern}(\mathsf{lit}),\ \mathsf{WildcardPattern},\ \operatorname{IdentifierPattern}(\mathsf{name}),\ \operatorname{TuplePattern}(\mathsf{elems}),\ \operatorname{RecordPattern}(\mathsf{type}_{\mathsf{path}},\ \mathsf{fields}),\ \operatorname{EnumPattern}(\mathsf{type}_{\mathsf{path}},\ \mathsf{name},\ \mathsf{payload}_{\mathsf{opt}}),\ \operatorname{ModalPattern}(\mathsf{state}_{\mathsf{name}},\ \mathsf{fields}_{\mathsf{opt}}),\ \operatorname{RangePattern}(\mathsf{kind},\ \mathsf{lo},\ \mathsf{hi})\} \\
\mathsf{PatternSpan}\ :\ \mathsf{Pattern}\ \to \ \mathsf{Span}
\end{array}
```

#### 17.1.4 Static Semantics

```math
\mathsf{CaseJudg}\ =\ \{\Gamma \ \vdash \ \mathsf{pat}\ \triangleleft \ T\ \dashv \ B,\ \Gamma ;\ R;\ L\ \vdash \ \operatorname{CaseBody}(\mathsf{body})\ :\ T,\ \Gamma ;\ R;\ L\ \vdash \ \operatorname{CaseBody}(\mathsf{body})\ \Leftarrow \ T\}
```

```math
\begin{array}{l}
\operatorname{PermWrap}(T,\ B)\ = \\
\ \{\ \{\ x\ \mapsto \ \operatorname{TypePerm}(p,\ T_{x})\ \mid \ x\ \mapsto \ T_{x}\ \in \ B\ \}\quad \mathsf{if}\ T\ =\ \operatorname{TypePerm}(p,\ U) \\
\quad B\quad \mathsf{otherwise}\ \}
\end{array}
```

**(Pat-StripPerm)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \mathsf{pat}\ \triangleleft \ \operatorname{StripPerm}(T)\ \dashv \ B \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{pat}\ \triangleleft \ T\ \dashv \ \operatorname{PermWrap}(T,\ B)
\end{array}
```

**Pattern Name Extraction.**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{IdentifierPattern}(x))\ \Downarrow \ [x]
\end{array}
```

**(Pat-Wild)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{PatNames}(\mathsf{WildcardPattern})\ \Downarrow \ []
\end{array}
```

**(Pat-Lit)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{LiteralPattern}(\mathsf{lit}))\ \Downarrow \ []
\end{array}
```

**(Pat-Dup-R-Err)**

```math
\mathsf{PatJudg}\ =\ \{\Gamma \ \vdash \ \mathsf{pat}\ \Leftarrow \ T\ \dashv \ B\}
```

```math
\begin{array}{l}
\lnot \ \operatorname{Distinct}(\operatorname{PatNames}(\mathsf{pat}))\quad c\ =\ \operatorname{Code}(\mathsf{Pat}-\mathsf{Dup}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{pat}\ \triangleleft \ T\ \Uparrow \ c
\end{array}
```

**(Pat-Wildcard-R)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \_\ \triangleleft \ T\ \dashv \ \emptyset 
\end{array}
```

**(Pat-Ident-R)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ x\ \triangleleft \ T\ \dashv \ \{x\ \mapsto \ T\}
\end{array}
```

**(Pat-Literal-R)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Literal}(\mathsf{lit})\ :\ T_{l}\quad \Gamma \ \vdash \ T_{l}\ \mathrel{<:} \ T \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LiteralPattern}(\mathsf{lit})\ \triangleleft \ T\ \dashv \ \emptyset 
\end{array}
```

#### 17.1.5 Dynamic Semantics

BindEnv = Ident ⇀ Value

```math
\begin{array}{l}
\operatorname{Dom}(B)\ =\ \{x\ \mid \ x\ \in \ \mathsf{Ident}\ \land \ B[x]\ \mathsf{defined}\} \\
B_{1}\ \uplus \ B_{2}\ =\ B\ \Leftrightarrow \ \operatorname{Dom}(B_{1})\ \cap \ \operatorname{Dom}(B_{2})\ =\ \emptyset \ \land \ \forall \ x.\ (x\ \in \ \operatorname{Dom}(B_{1})\ \Rightarrow \ B[x]\ =\ B_{1}[x])\ \land \ (x\ \in \ \operatorname{Dom}(B_{2})\ \Rightarrow \ B[x]\ =\ B_{2}[x])
\end{array}
```

```math
\begin{array}{l}
\mathsf{MatchPatJudg}\ =\ \{\operatorname{MatchPattern}(p,\ v)\ \Downarrow \ B\} \\
\operatorname{PatType}(\operatorname{LiteralPattern}(\mathsf{lit}))\ = \\
\ \operatorname{TypePrim}(t)\quad \mathsf{if}\ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{IntLiteral}\ \land \ \operatorname{IntSuffix}(\mathsf{lit})\ =\ t \\
\ \operatorname{TypePrim}(\texttt{"i32"})\quad \mathsf{if}\ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{IntLiteral}\ \land \ \operatorname{IntSuffix}(\mathsf{lit})\ =\ \bot  \\
\ \operatorname{TypePrim}(t)\quad \mathsf{if}\ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{FloatLiteral}\ \land \ \operatorname{FloatSuffix}(\mathsf{lit})\ =\ t\ \land \ t\ \in \ \{\texttt{"f16"},\ \texttt{"f32"},\ \texttt{"f64"}\} \\
\ \operatorname{TypePrim}(\texttt{"f32"})\quad \mathsf{if}\ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{FloatLiteral}\ \land \ (\operatorname{FloatSuffix}(\mathsf{lit})\ =\ \texttt{"f"}\ \lor \ \operatorname{NoFloatSuffix}(\mathsf{lit})) \\
\ \operatorname{TypePrim}(\texttt{"bool"})\quad \mathsf{if}\ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{BoolLiteral} \\
\ \operatorname{TypePrim}(\texttt{"char"})\quad \mathsf{if}\ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{CharLiteral} \\
\ \operatorname{TypeString}(\texttt{@View})\ \mathsf{if}\ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{StringLiteral} \\
\ \bot \quad \mathsf{if}\ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{NullLiteral}
\end{array}
```

**(Match-Wildcard)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{MatchPattern}(\_,\ v)\ \Downarrow \ \emptyset 
\end{array}
```

**(Match-Ident)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{MatchPattern}(x,\ v)\ \Downarrow \ \{x\ \mapsto \ v\}
\end{array}
```

**(Match-Literal)**

```math
\begin{array}{l}
T\ =\ \operatorname{PatType}(\ell )\quad \operatorname{LiteralValue}(\ell ,\ T)\ =\ v \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{MatchPattern}(\ell ,\ v)\ \Downarrow \ \emptyset 
\end{array}
```

#### 17.1.6 Lowering

No basic-pattern-specific lowering is defined beyond the shared pattern-lowering machinery in §17.5.6.

#### 17.1.7 Diagnostics

Diagnostics are defined for duplicate bindings introduced by a single pattern.

### 17.2 Tuple and Record Patterns

#### 17.2.1 Syntax

```text
tuple_pattern        ::= "(" tuple_pattern_elements? ")"
tuple_pattern_elements ::= pattern ";" | pattern ("," pattern)+ ","?
record_pattern       ::= type_path "{" field_pattern_list? "}"
field_pattern_list   ::= field_pattern ("," field_pattern)* ","?
field_pattern        ::= identifier (":" pattern)?
```

The semicolon form is the only valid single-element tuple-pattern spelling.

#### 17.2.2 Parsing

**(Parse-Pattern-Tuple)**

```math
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseTuplePatternElems}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{elems})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{")"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParsePatternAtom}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{TuplePattern}(\mathsf{elems}))
\end{array}
```

**(Parse-Pattern-Record)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseTypePath}(P)\ \Downarrow \ (P_{1},\ \mathsf{path})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseFieldPatternList}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{fields})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{"\}"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParsePatternAtom}(P)\ \Downarrow \ (\operatorname{Advance}(P_{2}),\ \operatorname{RecordPattern}(\mathsf{path},\ \mathsf{fields}))
\end{array}
```

**(Parse-TuplePatternElems-Empty)**
IsPunc(Tok(P), ")")

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseTuplePatternElems}(P)\ \Downarrow \ (P,\ [])
\end{array}
```

**(Parse-TuplePatternElems-Single)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParsePattern}(P)\ \Downarrow \ (P_{1},\ p)\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{";"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseTuplePatternElems}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ [p])
\end{array}
```

**(Parse-TuplePatternElems-Many)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParsePattern}(P)\ \Downarrow \ (P_{1},\ p_{1})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParsePattern}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ p_{2})\quad \Gamma \ \vdash \ \operatorname{ParsePatternListTail}(P_{2},\ [p_{2}])\ \Downarrow \ (P_{3},\ \mathsf{ps}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseTuplePatternElems}(P)\ \Downarrow \ (P_{3},\ [p_{1}]\ \mathbin{++} \ \mathsf{ps})
\end{array}
```

**(Parse-FieldPatternList-Empty)**

```math
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\}"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseFieldPatternList}(P)\ \Downarrow \ (P,\ [])
\end{array}
```

**(Parse-FieldPatternList-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseFieldPattern}(P)\ \Downarrow \ (P_{1},\ f)\quad \Gamma \ \vdash \ \operatorname{ParseFieldPatternTail}(P_{1},\ [f])\ \Downarrow \ (P_{2},\ \mathsf{fs}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseFieldPatternList}(P)\ \Downarrow \ (P_{2},\ \mathsf{fs})
\end{array}
```

**(Parse-FieldPattern)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseIdent}(P)\ \Downarrow \ (P_{1},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseFieldPatternTailOpt}(P_{1},\ \mathsf{name})\ \Downarrow \ (P_{2},\ \mathsf{pat}_{\mathsf{opt}}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseFieldPattern}(P)\ \Downarrow \ (P_{2},\ \langle \mathsf{name},\ \mathsf{pat}_{\mathsf{opt}},\ \operatorname{SpanBetween}(P,\ P_{2})\rangle )
\end{array}
```

**(Parse-FieldPatternTailOpt-None)**

```math
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{":"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseFieldPatternTailOpt}(P,\ \mathsf{name})\ \Downarrow \ (P,\ \bot )
\end{array}
```

**(Parse-FieldPatternTailOpt-Yes)**

```math
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParsePattern}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{pat}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseFieldPatternTailOpt}(P,\ \mathsf{name})\ \Downarrow \ (P_{1},\ \mathsf{pat})
\end{array}
```

**(Parse-FieldPatternTail-End)**

```math
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\}"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseFieldPatternTail}(P,\ \mathsf{xs})\ \Downarrow \ (P,\ \mathsf{xs})
\end{array}
```

**(Parse-FieldPatternTail-TrailingComma)**

```math
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"\}"})\quad \operatorname{TrailingCommaAllowed}(P_{0},\ P,\ \{\operatorname{Punctuator}(\texttt{"\}"})\}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseFieldPatternTail}(P,\ \mathsf{xs})\ \Downarrow \ (\operatorname{Advance}(P),\ \mathsf{xs})
\end{array}
```

**(Parse-FieldPatternTail-Comma)**

```math
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParseFieldPattern}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ f)\quad \Gamma \ \vdash \ \operatorname{ParseFieldPatternTail}(P_{1},\ \mathsf{xs}\ \mathbin{++} \ [f])\ \Downarrow \ (P_{2},\ \mathsf{ys}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseFieldPatternTail}(P,\ \mathsf{xs})\ \Downarrow \ (P_{2},\ \mathsf{ys})
\end{array}
```

#### 17.2.3 AST Representation / Form

```math
\mathsf{FieldPattern}\ =\ \langle \mathsf{name},\ \mathsf{pattern}_{\mathsf{opt}},\ \mathsf{span}\rangle 
```

```math
\begin{array}{l}
\operatorname{FieldName}(\langle f,\ \_,\ \_\rangle )\ =\ f \\
\operatorname{PatOf}(\langle f,\ \bot ,\ \_\rangle )\ =\ \operatorname{IdentifierPattern}(f) \\
\operatorname{PatOf}(\langle f,\ p,\ \_\rangle )\ =\ p\quad \mathsf{if}\ p\ \ne \ \bot 
\end{array}
```

```math
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{PatNames}(p_{i})\ \Downarrow \ N_{i} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{TuplePattern}([p_{1},\ \ldots ,\ p_{n}]))\ \Downarrow \ N_{1}\ \mathbin{++} \ \cdot \cdot \cdot \ \mathbin{++} \ N_{n}
\end{array}
```

**(Pat-Record-Field-Explicit)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{PatNames}(p)\ \Downarrow \ N \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{PatNames}(\langle \mathsf{name},\ \mathsf{pattern}_{\mathsf{opt}}\ =\ p,\ \mathsf{span}\rangle )\ \Downarrow \ N
\end{array}
```

**(Pat-Record-Field-Implicit)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{PatNames}(\langle \mathsf{name},\ \mathsf{pattern}_{\mathsf{opt}}\ =\ \bot ,\ \mathsf{span}\rangle )\ \Downarrow \ [\mathsf{name}]
\end{array}
```

```math
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{PatNames}(f_{i})\ \Downarrow \ N_{i} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{RecordPattern}(\_,\ [f_{1},\ \ldots ,\ f_{n}]))\ \Downarrow \ N_{1}\ \mathbin{++} \ \cdot \cdot \cdot \ \mathbin{++} \ N_{n}
\end{array}
```

#### 17.2.4 Static Semantics

**(Pat-Tuple-R-Arity-Err)**

```math
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}])\quad \mathsf{ps}\ =\ [p_{1},\ \ldots ,\ p_{m}]\quad m\ \ne \ n\quad c\ =\ \operatorname{Code}(\mathsf{Pat}-\mathsf{Tuple}-\mathsf{Arity}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TuplePattern}(\mathsf{ps})\ \triangleleft \ T\ \Uparrow \ c
\end{array}
```

**(Pat-Tuple-R)**

```math
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}])\quad \forall \ i,\ \Gamma \ \vdash \ p_{i}\ \triangleleft \ T_{i}\ \dashv \ B_{i}\quad B\ =\ \uplus_{i} \ B_{i} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TuplePattern}([p_{1},\ \ldots ,\ p_{n}])\ \triangleleft \ T\ \dashv \ B
\end{array}
```

**(Pat-Record-R)**

```math
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \forall \ \mathsf{fp}\ \in \ \mathsf{fs},\ \operatorname{FieldType}(R,\ \operatorname{FieldName}(\mathsf{fp}))\ =\ T_{f}\ \land \ \operatorname{FieldVisible}(m,\ R,\ \operatorname{FieldName}(\mathsf{fp}))\ \land \ \Gamma \ \vdash \ \operatorname{PatOf}(\mathsf{fp})\ \triangleleft \ T_{f}\ \dashv \ B_{f}\quad B\ =\ \uplus \_\{\mathsf{fp}\ \in \ \mathsf{fs}\}\ B_{f} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{RecordPattern}(p,\ \mathsf{fs})\ \triangleleft \ T\ \dashv \ B
\end{array}
```

**(RecordPattern-UnknownField)**

```math
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \exists \ \mathsf{fp}\ \in \ \mathsf{fs}.\ \operatorname{FieldName}(\mathsf{fp})\ \notin \ \operatorname{FieldNameSet}(R)\quad c\ =\ \operatorname{Code}(\mathsf{RecordPattern}-\mathsf{UnknownField}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{RecordPattern}(p,\ \mathsf{fs})\ \triangleleft \ T\ \Uparrow \ c
\end{array}
```

#### 17.2.5 Dynamic Semantics

**MatchRecord.**

```math
\mathsf{MatchRecordJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{MatchRecord}(\mathsf{fs},\ v)\ \Downarrow \ B\}
```

**(MatchRecord-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{MatchRecord}([],\ v)\ \Downarrow \ \emptyset 
\end{array}
```

**(MatchRecord-Cons-Implicit)**

```math
\begin{array}{l}
\operatorname{FieldValue}(v,\ f)\ =\ v_{f}\quad \Gamma \ \vdash \ \operatorname{MatchRecord}(\mathsf{fs},\ v)\ \Downarrow \ B \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{MatchRecord}([f]\ \mathbin{++} \ \mathsf{fs},\ v)\ \Downarrow \ (B\ \uplus \ \{f\ \mapsto \ v_{f}\})
\end{array}
```

**(MatchRecord-Cons-Explicit)**

```math
\begin{array}{l}
\operatorname{FieldValue}(v,\ f)\ =\ v_{f}\quad \Gamma \ \vdash \ \operatorname{MatchPattern}(p,\ v_{f})\ \Downarrow \ B_{1}\quad \Gamma \ \vdash \ \operatorname{MatchRecord}(\mathsf{fs},\ v)\ \Downarrow \ B_{2} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{MatchRecord}([\langle f,\ p\rangle ]\ \mathbin{++} \ \mathsf{fs},\ v)\ \Downarrow \ (B_{1}\ \uplus \ B_{2})
\end{array}
```

**(Match-Tuple)**

```math
\begin{array}{l}
v\ =\ (v_{1},\ \ldots ,\ v_{n})\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{MatchPattern}(p_{i},\ v_{i})\ \Downarrow \ B_{i}\quad B\ =\ \uplus_{i} \ B_{i} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{MatchPattern}((p_{1},\ \ldots ,\ p_{n}),\ v)\ \Downarrow \ B
\end{array}
```

**(Match-Record)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MatchRecord}(\mathsf{fs},\ v)\ \Downarrow \ B \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{MatchPattern}(R\{\mathsf{fs}\},\ v)\ \Downarrow \ B
\end{array}
```

#### 17.2.6 Lowering

Tuple and record patterns use the shared lowering rules in §17.5.6.

#### 17.2.7 Diagnostics

Diagnostics are defined for tuple-pattern arity mismatch and record patterns that reference unknown fields.

### 17.3 Enum and Modal Patterns

#### 17.3.1 Syntax

```text
enum_pattern                  ::= type_path "::" identifier enum_payload_pattern?
enum_payload_pattern          ::= "(" enum_payload_pattern_elements? ")" | "{" field_pattern_list? "}"
enum_payload_pattern_elements ::= pattern ("," pattern)* ","?
modal_pattern        ::= "@" identifier ("{" field_pattern_list? "}")?
```

A single-element tuple enum payload pattern is written as `(p)`. It MUST NOT use the tuple single-element marker `;`, which remains specific to `tuple_pattern`.

#### 17.3.2 Parsing

**(Parse-Pattern-Enum)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseTypePath}(P)\ \Downarrow \ (P_{1},\ \mathsf{path})\quad \operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{"::"})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseEnumPatternPayloadOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{payload}_{\mathsf{opt}}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParsePatternAtom}(P)\ \Downarrow \ (P_{3},\ \operatorname{EnumPattern}(\mathsf{path},\ \mathsf{name},\ \mathsf{payload}_{\mathsf{opt}}))
\end{array}
```

**(Parse-Pattern-Modal)**

```math
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"@"})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseModalPatternPayloadOpt}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{fields}_{\mathsf{opt}}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParsePatternAtom}(P)\ \Downarrow \ (P_{2},\ \operatorname{ModalPattern}(\mathsf{name},\ \mathsf{fields}_{\mathsf{opt}}))
\end{array}
```

**(Parse-EnumPatternPayloadOpt-None)**

```math
\begin{array}{l}
\operatorname{Tok}(P)\ \notin \ \{\operatorname{Punctuator}(\texttt{"("}),\ \operatorname{Punctuator}(\texttt{"\{"})\} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseEnumPatternPayloadOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
```

**(Parse-EnumPayloadPatternElems-Empty)**
IsPunc(Tok(P), ")")

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseEnumPayloadPatternElems}(P)\ \Downarrow \ (P,\ [])
\end{array}
```

**(Parse-EnumPayloadPatternElems-One)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParsePattern}(P)\ \Downarrow \ (P_{1},\ p)\quad \lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{","}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseEnumPayloadPatternElems}(P)\ \Downarrow \ (P_{1},\ [p])
\end{array}
```

**(Parse-EnumPayloadPatternElems-TrailingComma)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParsePattern}(P)\ \Downarrow \ (P_{1},\ p)\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{","})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P_{1})),\ \texttt{")"})\quad \operatorname{TrailingCommaAllowed}(P_{0},\ P_{1},\ \{\operatorname{Punctuator}(\texttt{")"})\}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseEnumPayloadPatternElems}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ [p])
\end{array}
```

**(Parse-EnumPayloadPatternElems-Many)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParsePattern}(P)\ \Downarrow \ (P_{1},\ p_{1})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParsePattern}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ p_{2})\quad \Gamma \ \vdash \ \operatorname{ParsePatternListTail}(P_{2},\ [p_{2}])\ \Downarrow \ (P_{3},\ \mathsf{ps}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseEnumPayloadPatternElems}(P)\ \Downarrow \ (P_{3},\ [p_{1}]\ \mathbin{++} \ \mathsf{ps})
\end{array}
```

**(Parse-EnumPatternPayloadOpt-Tuple)**

```math
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseEnumPayloadPatternElems}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{ps})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{")"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseEnumPatternPayloadOpt}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{TuplePayloadPattern}(\mathsf{ps}))
\end{array}
```

**(Parse-EnumPatternPayloadOpt-Record)**

```math
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseFieldPatternList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{fs})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\}"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseEnumPatternPayloadOpt}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{RecordPayloadPattern}(\mathsf{fs}))
\end{array}
```

**(Parse-ModalPatternPayloadOpt-None)**

```math
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\{"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseModalPatternPayloadOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
```

**(Parse-ModalPatternPayloadOpt-Record)**

```math
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseFieldPatternList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{fs})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\}"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseModalPatternPayloadOpt}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{ModalRecordPayload}(\mathsf{fs}))
\end{array}
```

#### 17.3.3 AST Representation / Form

```math
\begin{array}{l}
\mathsf{EnumPayloadPattern}\ =\ \{\operatorname{TuplePayloadPattern}([\mathsf{Pattern}]),\ \operatorname{RecordPayloadPattern}([\mathsf{FieldPattern}])\} \\
\mathsf{ModalPayloadPattern}\ =\ \{\operatorname{ModalRecordPayload}([\mathsf{FieldPattern}])\}
\end{array}
```

**(Pat-Enum-None)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{EnumPattern}(\_,\ \_,\ \bot ))\ \Downarrow \ []
\end{array}
```

**(Pat-Enum-Tuple)**

```math
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{PatNames}(p_{i})\ \Downarrow \ N_{i} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{EnumPattern}(\_,\ \_,\ \operatorname{TuplePayloadPattern}([p_{1},\ \ldots ,\ p_{n}])))\ \Downarrow \ N_{1}\ \mathbin{++} \ \cdot \cdot \cdot \ \mathbin{++} \ N_{n}
\end{array}
```

**(Pat-Enum-Record)**

```math
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{PatNames}(f_{i})\ \Downarrow \ N_{i} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{EnumPattern}(\_,\ \_,\ \operatorname{RecordPayloadPattern}([f_{1},\ \ldots ,\ f_{n}])))\ \Downarrow \ N_{1}\ \mathbin{++} \ \cdot \cdot \cdot \ \mathbin{++} \ N_{n}
\end{array}
```

**(Pat-Modal-None)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{ModalPattern}(\_,\ \bot ))\ \Downarrow \ []
\end{array}
```

**(Pat-Modal-Record)**

```math
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{PatNames}(f_{i})\ \Downarrow \ N_{i} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{ModalPattern}(\_,\ \operatorname{ModalRecordPayload}([f_{1},\ \ldots ,\ f_{n}])))\ \Downarrow \ N_{1}\ \mathbin{++} \ \cdot \cdot \cdot \ \mathbin{++} \ N_{n}
\end{array}
```

#### 17.3.4 Static Semantics

**(Pat-Enum-Unit-R)**

```math
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{VariantPayload}(E,\ v)\ =\ \bot  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EnumPattern}(p,\ v,\ \bot )\ \triangleleft \ T\ \dashv \ \emptyset 
\end{array}
```

**(Pat-Enum-Tuple-R)**

```math
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{VariantPayload}(E,\ v)\ =\ \operatorname{TuplePayload}([T_{1},\ \ldots ,\ T_{n}])\quad \forall \ i,\ \Gamma \ \vdash \ p_{i}\ \triangleleft \ T_{i}\ \dashv \ B_{i}\quad B\ =\ \uplus_{i} \ B_{i} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EnumPattern}(p,\ v,\ \operatorname{TuplePayloadPattern}([p_{1},\ \ldots ,\ p_{n}]))\ \triangleleft \ T\ \dashv \ B
\end{array}
```

**(Pat-Enum-Record-R)**

```math
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{VariantPayload}(E,\ v)\ =\ \operatorname{RecordPayload}(\mathsf{fs}')\quad \forall \ \mathsf{fp}\ \in \ \mathsf{fs},\ \operatorname{EnumFieldType}(E,\ v,\ \operatorname{FieldName}(\mathsf{fp}))\ =\ T_{f}\ \land \ \Gamma \ \vdash \ \operatorname{PatOf}(\mathsf{fp})\ \triangleleft \ T_{f}\ \dashv \ B_{f}\quad B\ =\ \uplus \_\{\mathsf{fp}\ \in \ \mathsf{fs}\}\ B_{f} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EnumPattern}(p,\ v,\ \operatorname{RecordPayloadPattern}(\mathsf{fs}))\ \triangleleft \ T\ \dashv \ B
\end{array}
```

**(Pat-Modal-R)**

```math
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad S\ \in \ \operatorname{States}(M)\quad \forall \ \mathsf{fp}\ \in \ \mathsf{fs},\ \operatorname{ModalPayloadMap}(\mathsf{modal}_{\mathsf{ref}},\ S)(\operatorname{FieldName}(\mathsf{fp}))\ =\ T_{f}\ \land \ \Gamma \ \vdash \ \operatorname{PatOf}(\mathsf{fp})\ \triangleleft \ T_{f}\ \dashv \ B_{f}\quad B\ =\ \uplus \_\{\mathsf{fp}\ \in \ \mathsf{fs}\}\ B_{f} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ModalPattern}(S,\ \mathsf{fs})\ \triangleleft \ T\ \dashv \ B
\end{array}
```

**(Pat-Modal-State-R)**

```math
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \forall \ \mathsf{fp}\ \in \ \mathsf{fs},\ \operatorname{ModalPayloadMap}(\mathsf{modal}_{\mathsf{ref}},\ S)(\operatorname{FieldName}(\mathsf{fp}))\ =\ T_{f}\ \land \ \Gamma \ \vdash \ \operatorname{PatOf}(\mathsf{fp})\ \triangleleft \ T_{f}\ \dashv \ B_{f}\quad B\ =\ \uplus \_\{\mathsf{fp}\ \in \ \mathsf{fs}\}\ B_{f} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ModalPattern}(S,\ \mathsf{fs})\ \triangleleft \ T\ \dashv \ B
\end{array}
```

#### 17.3.5 Dynamic Semantics

```math
\mathsf{MatchModalJudg}\ =\ \{\operatorname{MatchModal}(p,\ v)\ \Downarrow \ B\}
```

**(Match-Modal-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{MatchModal}(@S,\ \langle S,\ v\rangle )\ \Downarrow \ \emptyset 
\end{array}
```

**(Match-Modal-Record)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MatchRecord}(\mathsf{fs},\ v)\ \Downarrow \ B \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{MatchModal}(@S\{\mathsf{fs}\},\ \langle S,\ v\rangle )\ \Downarrow \ B
\end{array}
```

**(Match-Enum-Unit)**

```math
\begin{array}{l}
v\ =\ \operatorname{EnumValue}(\mathsf{path}',\ \bot )\quad \operatorname{EnumPath}(\mathsf{path}')\ =\ \mathsf{path}\quad \operatorname{VariantName}(\mathsf{path}')\ =\ \mathsf{name} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{MatchPattern}(\operatorname{EnumPattern}(\mathsf{path},\ \mathsf{name},\ \bot ),\ v)\ \Downarrow \ \emptyset 
\end{array}
```

**(Match-Enum-Tuple)**

```math
\begin{array}{l}
v\ =\ \operatorname{EnumValue}(\mathsf{path}',\ \operatorname{TuplePayload}(\mathsf{vec}_{v}))\quad \operatorname{EnumPath}(\mathsf{path}')\ =\ \mathsf{path}\quad \operatorname{VariantName}(\mathsf{path}')\ =\ \mathsf{name}\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{MatchPattern}(p_{i},\ v_{i})\ \Downarrow \ B_{i}\quad B\ =\ \uplus_{i} \ B_{i} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{MatchPattern}(\operatorname{EnumPattern}(\mathsf{path},\ \mathsf{name},\ \operatorname{TuplePayloadPattern}([p_{1},\ \ldots ,\ p_{n}])),\ v)\ \Downarrow \ B
\end{array}
```

**(Match-Enum-Record)**

```math
\begin{array}{l}
v\ =\ \operatorname{EnumValue}(\mathsf{path}',\ \operatorname{RecordPayload}(\mathsf{vec}_{f}))\quad \operatorname{EnumPath}(\mathsf{path}')\ =\ \mathsf{path}\quad \operatorname{VariantName}(\mathsf{path}')\ =\ \mathsf{name}\quad \Gamma \ \vdash \ \operatorname{MatchRecord}(\mathsf{fs},\ \operatorname{RecordPayload}(\mathsf{vec}_{f}))\ \Downarrow \ B \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{MatchPattern}(\operatorname{EnumPattern}(\mathsf{path},\ \mathsf{name},\ \operatorname{RecordPayloadPattern}(\mathsf{fs})),\ v)\ \Downarrow \ B
\end{array}
```

**(Match-Modal-General)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MatchModal}(@S\{\mathsf{fs}\},\ \langle S,\ v\rangle )\ \Downarrow \ B \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{MatchPattern}(@S\{\mathsf{fs}\},\ \langle S,\ v\rangle )\ \Downarrow \ B
\end{array}
```

**(Match-Modal-State)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MatchRecord}(\mathsf{fs},\ v)\ \Downarrow \ B \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{MatchPattern}(@S\{\mathsf{fs}\},\ v)\ \Downarrow \ B
\end{array}
```

#### 17.3.6 Lowering

Enum and modal patterns use the shared lowering rules in §17.5.6.

#### 17.3.7 Diagnostics

No additional named diagnostics are introduced for enum or modal pattern shape checking beyond the typing failures in this section and the exhaustiveness diagnostics in §17.6.

### 17.4 Range Patterns

#### 17.4.1 Syntax

```text
range_pattern ::= pattern (".." | "..=") pattern
```

#### 17.4.2 Parsing

**(Parse-Pattern)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParsePatternRange}(P)\ \Downarrow \ (P_{1},\ \mathsf{pat}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParsePattern}(P)\ \Downarrow \ (P_{1},\ \mathsf{pat})
\end{array}
```

**(Parse-Pattern-Err)**

```math
\begin{array}{l}
c\ =\ \operatorname{Code}(\mathsf{Parse}-\mathsf{Syntax}-\mathsf{Err})\quad \Gamma \ \vdash \ \operatorname{Emit}(c,\ \operatorname{Tok}(P).\mathsf{span}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParsePattern}(P)\ \Downarrow \ (P,\ \mathsf{WildcardPattern})
\end{array}
```

**(Parse-Pattern-Range-None)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParsePatternAtom}(P)\ \Downarrow \ (P_{1},\ p)\quad \lnot \ (\operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{".."})\ \lor \ \operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{"..="})) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParsePatternRange}(P)\ \Downarrow \ (P_{1},\ p)
\end{array}
```

**(Parse-Pattern-Range)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParsePatternAtom}(P)\ \Downarrow \ (P_{1},\ p_{0})\quad \operatorname{Tok}(P_{1})\ =\ \mathsf{op}\ \in \ \{\texttt{".."},\ \texttt{"..="}\}\quad \Gamma \ \vdash \ \operatorname{ParsePatternAtom}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ p_{1})\quad \mathsf{kind}\ =\ (\texttt{Exclusive}\ \mathsf{if}\ \mathsf{op}\ =\ \texttt{".."}\ \mathsf{else}\ \texttt{Inclusive}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParsePatternRange}(P)\ \Downarrow \ (P_{2},\ \operatorname{RangePattern}(\mathsf{kind},\ p_{0},\ p_{1}))
\end{array}
```

#### 17.4.3 AST Representation / Form

RangePattern(kind, lo, hi)

```math
\operatorname{ConstPatInt}(p)\ =\ n\ \Leftrightarrow \ p\ =\ \operatorname{LiteralPattern}(\operatorname{IntLiteral}(n))
```

#### 17.4.4 Static Semantics

**(Pat-Range-R)**

```math
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypePrim}(t)\quad t\ \in \ \mathsf{IntTypes}\quad \operatorname{ConstPatInt}(p_{l})\ =\ n_{l}\quad \operatorname{ConstPatInt}(p_{h})\ =\ n_{h}\quad (\mathsf{kind}\ =\ \texttt{".."}\ \Rightarrow \ n_{l}\ <\ n_{h})\quad (\mathsf{kind}\ =\ \texttt{"..="}\ \Rightarrow \ n_{l}\ \le \ n_{h}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{RangePattern}(\mathsf{kind},\ p_{l},\ p_{h})\ \triangleleft \ T\ \dashv \ \emptyset 
\end{array}
```

**(RangePattern-NonConst)**

```math
\begin{array}{l}
(\operatorname{ConstPatInt}(p_{l})\ \mathsf{undefined}\ \lor \ \operatorname{ConstPatInt}(p_{h})\ \mathsf{undefined})\quad c\ =\ \operatorname{Code}(\mathsf{RangePattern}-\mathsf{NonConst}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{RangePattern}(\mathsf{kind},\ p_{l},\ p_{h})\ \triangleleft \ T\ \Uparrow \ c
\end{array}
```

**(RangePattern-Empty)**

```math
\begin{array}{l}
\operatorname{ConstPatInt}(p_{l})\ =\ n_{l}\quad \operatorname{ConstPatInt}(p_{h})\ =\ n_{h}\quad ((\mathsf{kind}\ =\ \texttt{".."})\ \Rightarrow \ n_{l}\ \ge \ n_{h})\quad ((\mathsf{kind}\ =\ \texttt{"..="})\ \Rightarrow \ n_{l}\ >\ n_{h})\quad c\ =\ \operatorname{Code}(\mathsf{RangePattern}-\mathsf{Empty}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{RangePattern}(\mathsf{kind},\ p_{l},\ p_{h})\ \triangleleft \ T\ \Uparrow \ c
\end{array}
```

#### 17.4.5 Dynamic Semantics

```math
\operatorname{ConstPat}(p)\ =\ v\ \Leftrightarrow \ p\ =\ \operatorname{LiteralPattern}(\ell )\ \land \ v\ =\ \operatorname{LiteralValue}(\ell ,\ \operatorname{PatType}(p))
```

**(Match-Range)**

```math
\begin{array}{l}
\operatorname{ConstPat}(p_{l})\ =\ v_{l}\quad \operatorname{ConstPat}(p_{h})\ =\ v_{h}\quad v_{l}\ \le \ v\ \le \ v_{h} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{MatchPattern}(p_{l}\ \texttt{..=}\ p_{h},\ v)\ \Downarrow \ \emptyset 
\end{array}
```

```math
\begin{array}{l}
\operatorname{ConstPat}(p_{l})\ =\ v_{l}\quad \operatorname{ConstPat}(p_{h})\ =\ v_{h}\quad v_{l}\ \le \ v\ <\ v_{h} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{MatchPattern}(p_{l}\ \texttt{..}\ p_{h},\ v)\ \Downarrow \ \emptyset 
\end{array}
```

#### 17.4.6 Lowering

Range patterns use the shared lowering rules in §17.5.6.

#### 17.4.7 Diagnostics

Diagnostics are defined for range-pattern bounds that are not compile-time constants and for statically empty ranges.

### 17.5 Case Clauses

#### 17.5.1 Syntax

```text
if_case      ::= pattern block_expr
if_case_else ::= "else" block_expr
```

#### 17.5.2 Parsing

**Case Clauses.**

**(Parse-IfCases-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseIfCase}(P)\ \Downarrow \ (P_{1},\ c)\quad \Gamma \ \vdash \ \operatorname{ParseIfCasesTail}(P_{1},\ [c])\ \Downarrow \ (P_{2},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseIfCases}(P)\ \Downarrow \ (P_{2},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})
\end{array}
```

**(Parse-IfCase)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParsePattern}(P)\ \Downarrow \ (P_{1},\ \mathsf{pat})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{body}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseIfCase}(P)\ \Downarrow \ (P_{2},\ \langle \mathsf{pat},\ \mathsf{body}\rangle )
\end{array}
```

**(Parse-IfCasesTail-End)**

```math
\begin{array}{l}
\operatorname{Tok}(P)\ =\ \operatorname{Punctuator}(\texttt{"\}"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseIfCasesTail}(P,\ \mathsf{xs})\ \Downarrow \ (P,\ \mathsf{xs},\ \bot )
\end{array}
```

**(Parse-IfCasesTail-Else)**

```math
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{else})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ b) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseIfCasesTail}(P,\ \mathsf{xs})\ \Downarrow \ (P_{1},\ \mathsf{xs},\ b)
\end{array}
```

**(Parse-IfCasesTail-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseIfCase}(P)\ \Downarrow \ (P_{1},\ c)\quad \Gamma \ \vdash \ \operatorname{ParseIfCasesTail}(P_{1},\ \mathsf{xs}\ \mathbin{++} \ [c])\ \Downarrow \ (P_{2},\ \mathsf{ys},\ \mathsf{else}_{\mathsf{opt}}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseIfCasesTail}(P,\ \mathsf{xs})\ \Downarrow \ (P_{2},\ \mathsf{ys},\ \mathsf{else}_{\mathsf{opt}})
\end{array}
```

#### 17.5.3 AST Representation / Form

```math
\mathsf{IfCase}\ =\ \langle \mathsf{pat},\ \mathsf{body}\rangle 
```

```math
\operatorname{BindOrder}(p,\ B)\ =\ [\langle x,\ B[x]\rangle \ \mid \ x\ \in \ \operatorname{PatNames}(p)]
```

#### 17.5.4 Static Semantics

```math
\begin{array}{l}
\mathsf{CaseScopeJudg}\ =\ \{\operatorname{CaseScope}(\Gamma ,\ e,\ \mathsf{pat},\ T)\ \Downarrow \ \Gamma_{\mathsf{case}} \} \\
\mathsf{PatternNarrowJudg}\ =\ \{\operatorname{PatternNarrow}(\Gamma ,\ \mathsf{pat},\ T)\ \Downarrow \ T_{n}\}
\end{array}
```

```math
\begin{array}{l}
\operatorname{ScrutineeBinding}(\operatorname{Identifier}(x))\ =\ x \\
\operatorname{ScrutineeBinding}(e)\ =\ \bot \ \Leftrightarrow \ e\ \ne \ \operatorname{Identifier}(\_) \\
\operatorname{RefineBinding}(\Gamma ,\ x,\ T_{n})\ \Downarrow \ \Gamma '\ \Leftrightarrow \ \operatorname{LookupNearestValueBinding}(\Gamma ,\ x)\ =\ b\ \land \ \Gamma '\ =\ \operatorname{ReplaceBindingType}(\Gamma ,\ b,\ T_{n})
\end{array}
```

```math
\begin{array}{l}
\operatorname{UnionOrSingle}([T])\ =\ T \\
\operatorname{UnionOrSingle}([T_{1},\ \ldots ,\ T_{n}])\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\ \Leftrightarrow \ n\ \ge \ 2
\end{array}
```

**(PatternNarrow-Perm)**

```math
\begin{array}{l}
\operatorname{PatternNarrow}(\Gamma ,\ \mathsf{pat},\ T)\ \Downarrow \ T_{n} \\
\rule{18em}{0.4pt} \\
\operatorname{PatternNarrow}(\Gamma ,\ \mathsf{pat},\ \operatorname{TypePerm}(p,\ T))\ \Downarrow \ \operatorname{TypePerm}(p,\ T_{n})
\end{array}
```

**(PatternNarrow-ModalRef)**

```math
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad S\ \in \ \operatorname{States}(M) \\
\rule{18em}{0.4pt} \\
\operatorname{PatternNarrow}(\Gamma ,\ \operatorname{ModalPattern}(S,\ \mathsf{fs}),\ T)\ \Downarrow \ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)
\end{array}
```

**(PatternNarrow-ModalState)**

```math
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M \\
\rule{18em}{0.4pt} \\
\operatorname{PatternNarrow}(\Gamma ,\ \operatorname{ModalPattern}(S,\ \mathsf{fs}),\ T)\ \Downarrow \ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)
\end{array}
```

**(PatternNarrow-Union)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad \mathsf{Ns}\ =\ [N_{i}\ \mid \ 1\ \le \ i\ \le \ n\ \land \ \operatorname{PatternNarrow}(\Gamma ,\ \mathsf{pat},\ T_{i})\ \Downarrow \ N_{i}]\quad \mid \mathsf{Ns}\mid \ \ge \ 1\quad \operatorname{UnionOrSingle}(\mathsf{Ns})\ =\ T_{n} \\
\rule{18em}{0.4pt} \\
\operatorname{PatternNarrow}(\Gamma ,\ \mathsf{pat},\ T)\ \Downarrow \ T_{n}
\end{array}
```

**(CaseScope-Narrow)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \mathsf{pat}\ \triangleleft \ T_{s}\ \dashv \ B\quad \operatorname{Distinct}(\operatorname{PatNames}(\mathsf{pat}))\quad \operatorname{ScrutineeBinding}(e)\ =\ x\quad \operatorname{PatternNarrow}(\Gamma ,\ \mathsf{pat},\ T_{s})\ \Downarrow \ T_{n}\quad \operatorname{RefineBinding}(\Gamma ,\ x,\ T_{n})\ \Downarrow \ \Gamma_{r} \quad \Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma_{r} )\quad \operatorname{IntroAll}(\Gamma_{0} ,\ B)\ \Downarrow \ \Gamma_{\mathsf{case}}  \\
\rule{18em}{0.4pt} \\
\operatorname{CaseScope}(\Gamma ,\ e,\ \mathsf{pat},\ T_{s})\ \Downarrow \ \Gamma_{\mathsf{case}} 
\end{array}
```

**(CaseScope-PatternOnly)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \mathsf{pat}\ \triangleleft \ T_{s}\ \dashv \ B\quad \operatorname{Distinct}(\operatorname{PatNames}(\mathsf{pat}))\quad (\operatorname{ScrutineeBinding}(e)\ =\ \bot \ \lor \ \operatorname{PatternNarrow}(\Gamma ,\ \mathsf{pat},\ T_{s})\ \mathsf{undefined})\quad \Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \operatorname{IntroAll}(\Gamma_{0} ,\ B)\ \Downarrow \ \Gamma_{\mathsf{case}}  \\
\rule{18em}{0.4pt} \\
\operatorname{CaseScope}(\Gamma ,\ e,\ \mathsf{pat},\ T_{s})\ \Downarrow \ \Gamma_{\mathsf{case}} 
\end{array}
```

#### 17.5.5 Dynamic Semantics

```math
\begin{array}{l}
\mathsf{IfCaseJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{EvalIfCaseSigma}(c,\ v,\ \sigma )\ \Downarrow \ (\mathsf{res},\ \sigma ')\} \\
\mathsf{IfCaseListJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{EvalIfCaseListSigma}(\mathsf{cases},\ \mathsf{else}_{\mathsf{opt}},\ v,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\}
\end{array}
```

**(EvalIfCase-Fail)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MatchPattern}(\mathsf{pat},\ v)\ \mathsf{undefined} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalIfCaseSigma}(\langle \mathsf{pat},\ \mathsf{body}\rangle ,\ v,\ \sigma )\ \Downarrow \ (\mathsf{NoMatch},\ \sigma )
\end{array}
```

**(EvalIfCase-Hit)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MatchPattern}(\mathsf{pat},\ v)\ \Downarrow \ B\quad \operatorname{BindOrder}(\mathsf{pat},\ B)\ =\ \mathsf{binds}\quad \operatorname{BlockEnter}(\sigma ,\ \mathsf{binds})\ \Downarrow \ (\sigma_{1} ,\ \mathsf{scope})\quad \Gamma \ \vdash \ \operatorname{EvalBlockSigma}(\mathsf{body},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )\quad \operatorname{BlockExit}(\sigma_{2} ,\ \mathsf{scope},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma_{3} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalIfCaseSigma}(\langle \mathsf{pat},\ \mathsf{body}\rangle ,\ v,\ \sigma )\ \Downarrow \ (\operatorname{Match}(\mathsf{out}'),\ \sigma_{3} )
\end{array}
```

**(EvalIfCases-Head)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalIfCaseSigma}(c,\ v,\ \sigma )\ \Downarrow \ (\operatorname{Match}(\mathsf{out}),\ \sigma_{1} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalIfCaseListSigma}(c\mathbin{::} \mathsf{cs},\ \mathsf{else}_{\mathsf{opt}},\ v,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{1} )
\end{array}
```

**(EvalIfCases-Tail)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalIfCaseSigma}(c,\ v,\ \sigma )\ \Downarrow \ (\mathsf{NoMatch},\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalIfCaseListSigma}(\mathsf{cs},\ \mathsf{else}_{\mathsf{opt}},\ v,\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalIfCaseListSigma}(c\mathbin{::} \mathsf{cs},\ \mathsf{else}_{\mathsf{opt}},\ v,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
```

**(EvalIfCases-Else)**

```math
\begin{array}{l}
\mathsf{else}_{\mathsf{opt}}\ =\ b\quad \Gamma \ \vdash \ \operatorname{EvalBlockSigma}(b,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalIfCaseListSigma}([],\ \mathsf{else}_{\mathsf{opt}},\ v,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')
\end{array}
```

**(EvalIfCases-None)**

```math
\begin{array}{l}
\mathsf{else}_{\mathsf{opt}}\ =\ \bot  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EvalIfCaseListSigma}([],\ \mathsf{else}_{\mathsf{opt}},\ v,\ \sigma )\ \Downarrow \ (\operatorname{Val}(()),\ \sigma )
\end{array}
```

#### 17.5.6 Lowering

```math
\begin{array}{l}
\mathsf{LowerBindJudg}\ =\ \{\mathsf{LowerBindList},\ \mathsf{LowerBindPattern},\ \mathsf{LowerIfCases}\} \\
\mathsf{PatternLowerJudg}\ =\ \{\mathsf{LowerBindPattern},\ \mathsf{LowerBindList},\ \mathsf{LowerIfCases},\ \mathsf{TagOf}\}
\end{array}
```

**(Lower-Pat-Correctness)**

```math
\begin{array}{l}
\forall \ v,\ \Gamma \ \vdash \ \operatorname{MatchPattern}(\mathsf{pat},\ v)\ \Downarrow \ B\ \Rightarrow \ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\mathsf{ok},\ \sigma ') \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerBindPattern}(\mathsf{pat},\ v)\ \Downarrow \ \mathsf{IR} \\
\operatorname{IfCaseValueCorrect}(\Gamma ,\ \mathsf{scrut},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}},\ v)\ \Leftrightarrow \ \forall \ \sigma ,\ v',\ \sigma '.\ \Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{IfCaseExpr}(\mathsf{scrut},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma ')\ \Rightarrow \ v\ =\ v'
\end{array}
```

**(Lower-IfCases-Correctness)**

```math
\begin{array}{l}
\forall \ \sigma ,\ \Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{IfCaseExpr}(\mathsf{scrut},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\ \Rightarrow \ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\quad \operatorname{IfCaseValueCorrect}(\Gamma ,\ \mathsf{scrut},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}},\ v) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIfCases}(\mathsf{scrut},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ \Downarrow \ \langle \mathsf{IR},\ v\rangle 
\end{array}
```

```math
\begin{array}{l}
\operatorname{EnumValuePath}(v)\ =\ \mathsf{path}\ \Leftrightarrow \ v\ =\ \operatorname{EnumValue}(\mathsf{path},\ \mathsf{payload}) \\
\operatorname{VariantIndex}(E,\ \mathsf{name})\ =\ i\ \Leftrightarrow \ \operatorname{Variants}(E)\ =\ [v_{0},\ \ldots ,\ v_{k}]\ \land \ v_{i}.\mathsf{name}\ =\ \mathsf{name} \\
\operatorname{EnumDisc}(E,\ \mathsf{name})\ =\ d\ \Leftrightarrow \ \operatorname{EnumDiscriminants}(E)\ \Downarrow \ \mathsf{ds}\ \land \ \operatorname{VariantIndex}(E,\ \mathsf{name})\ =\ i\ \land \ \mathsf{ds}[i]\ =\ d \\
\operatorname{StateIndex}(M,\ S)\ =\ i\ \Leftrightarrow \ \operatorname{States}(M)\ =\ [S_{0},\ \ldots ,\ S_{k}]\ \land \ S_{i}\ =\ S
\end{array}
```

**(TagOf-Enum)**

```math
\begin{array}{l}
\operatorname{EnumValuePath}(v)\ =\ \mathsf{path}\quad \operatorname{EnumPath}(\mathsf{path})\ =\ p\quad T\ =\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{VariantName}(\mathsf{path})\ =\ \mathsf{name}\quad \operatorname{EnumDisc}(E,\ \mathsf{name})\ =\ d \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TagOf}(v,\ T)\ \Downarrow \ d
\end{array}
```

**(TagOf-Modal)**

```math
\begin{array}{l}
v\ =\ \langle S,\ v_{S}\rangle \quad T\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \operatorname{StateIndex}(M,\ S)\ =\ i \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TagOf}(v,\ T)\ \Downarrow \ i
\end{array}
```

**(Lower-BindList-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerBindList}([])\ \Downarrow \ \varepsilon 
\end{array}
```

**(Lower-BindList-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerBindList}(\mathsf{bs})\ \Downarrow \ \mathsf{IR}_{r} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerBindList}([\langle x,\ v\rangle ]\ \mathbin{++} \ \mathsf{bs})\ \Downarrow \ \operatorname{SeqIR}(\operatorname{BindVarIR}(x,\ v),\ \mathsf{IR}_{r})
\end{array}
```

**(Lower-Pat-General)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MatchPattern}(\mathsf{pat},\ v)\ \Downarrow \ B\quad \operatorname{BindOrder}(\mathsf{pat},\ B)\ =\ \mathsf{binds}\quad \Gamma \ \vdash \ \operatorname{LowerBindList}(\mathsf{binds})\ \Downarrow \ \mathsf{IR} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerBindPattern}(\mathsf{pat},\ v)\ \Downarrow \ \mathsf{IR}
\end{array}
```

**(Lower-Pat-Err)**
MatchPattern(pat, v) undefined

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerBindPattern}(\mathsf{pat},\ v)\ \Uparrow 
\end{array}
```

**(Lower-IfCases)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(\mathsf{scrut})\ \Downarrow \ \langle \mathsf{IR}_{s},\ v_{s}\rangle \quad \Gamma ;\ R;\ L\ \vdash \ \mathsf{scrut}\ :\ T_{s}\quad \forall \ i,\ \mathsf{case}_{i}\ =\ \langle p_{i},\ b_{i}\rangle \quad \forall \ i,\ \operatorname{CaseScope}(\Gamma ,\ \mathsf{scrut},\ p_{i},\ T_{s})\ \Downarrow \ \Gamma_{i}  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIfCases}(\mathsf{scrut},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{s},\ \operatorname{IfCaseIR}(v_{s},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})),\ v_{\mathsf{case}}\rangle 
\end{array}
```

#### 17.5.7 Diagnostics

No additional named diagnostics are introduced for case-clause structure beyond the diagnostics of the contained patterns and the exhaustiveness rules in §17.6.

### 17.6 Exhaustiveness and Reachability

#### 17.6.1 Syntax

No additional surface syntax is introduced.

#### 17.6.2 Parsing

Exhaustiveness and reachability are not parser-owned.

#### 17.6.3 AST Representation / Form

```math
\begin{array}{l}
\mathsf{AllEq}\_\Gamma ([T_{1},\ \ldots ,\ T_{n}])\ \Leftrightarrow \ \forall \ i.\ \Gamma \ \vdash \ T_{i}\ \equiv \ T_{1} \\
\operatorname{Irrefutable}(\mathsf{pat},\ T)\ \Leftrightarrow \ \mathsf{pat}\ =\ \mathsf{WildcardPattern}\ \lor \ \mathsf{pat}\ =\ \operatorname{IdentifierPattern}(\_)\ \lor \ (\mathsf{pat}\ =\ \operatorname{TuplePattern}([p_{1},\ \ldots ,\ p_{n}])\ \land \ \operatorname{StripPerm}(T)\ =\ \operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}])\ \land \ \forall \ i.\ \operatorname{Irrefutable}(p_{i},\ T_{i}))\ \lor \ (\mathsf{pat}\ =\ \operatorname{RecordPattern}(p,\ \mathsf{fs})\ \land \ \operatorname{StripPerm}(T)\ =\ \operatorname{TypePath}(p)\ \land \ \operatorname{RecordDecl}(p)\ =\ R\ \land \ \forall \ \mathsf{fp}\ \in \ \mathsf{fs}.\ \operatorname{Irrefutable}(\operatorname{PatOf}(\mathsf{fp}),\ \operatorname{FieldType}(R,\ \operatorname{FieldName}(\mathsf{fp})))) \\
\operatorname{HasIrrefutableCase}(\mathsf{cases},\ T)\ \Leftrightarrow \ \exists \ \mathsf{case}\ \in \ \mathsf{cases}.\ \exists \ p,\ b.\ \mathsf{case}\ =\ \langle p,\ b\rangle \ \land \ \operatorname{Irrefutable}(p,\ T) \\
\operatorname{CaseLabel}(\operatorname{EnumPattern}(\mathsf{path},\ v,\ \_))\ =\ \langle \texttt{enum},\ \mathsf{path},\ v\rangle  \\
\operatorname{CaseLabel}(\operatorname{ModalPattern}(s,\ \_))\ =\ \langle \texttt{modal},\ s\rangle  \\
\operatorname{CaseLabel}(\mathsf{Pat}-\operatorname{Union}(T,\ \_))\ =\ \langle \texttt{union},\ T\rangle  \\
\operatorname{CaseLabel}(\_)\ =\ \bot  \\
\operatorname{CaseUnreachable}(T,\ \mathsf{cases},\ i)\ \Leftrightarrow  \\
\ (\exists \ j.\ 1\ \le \ j\ <\ i\ \land \ \operatorname{Irrefutable}(\mathsf{cases}[j].\mathsf{pat},\ T))\ \lor  \\
\ (\operatorname{CaseLabel}(\mathsf{cases}[i].\mathsf{pat})\ \ne \ \bot \ \land \ \exists \ j.\ 1\ \le \ j\ <\ i\ \land \ \operatorname{CaseLabel}(\mathsf{cases}[j].\mathsf{pat})\ =\ \operatorname{CaseLabel}(\mathsf{cases}[i].\mathsf{pat}))
\end{array}
```

```math
\begin{array}{l}
\operatorname{VariantNames}(E)\ =\ [\ v.\mathsf{name}\ \mid \ v\ \in \ E.\mathsf{variants}\ ] \\
\operatorname{CaseVariants}(\mathsf{cases})\ =\ \{\ v\ \mid \ \exists \ p,\ b.\ \langle p,\ b\rangle \ \in \ \mathsf{cases}\ \land \ p\ =\ \operatorname{EnumPattern}(\_,\ v,\ \_)\ \}
\end{array}
```

```math
\operatorname{CaseStates}(\mathsf{cases})\ =\ \{\ s\ \mid \ \exists \ p,\ b.\ \langle p,\ b\rangle \ \in \ \mathsf{cases}\ \land \ p\ =\ \operatorname{ModalPattern}(\_,\ s)\ \}
```

```math
\begin{array}{l}
\operatorname{UnionTypes}(U)\ =\ [T_{1},\ \ldots ,\ T_{n}]\ \Leftrightarrow \ U\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}]) \\
\operatorname{CaseUnionTypes}(\mathsf{cases})\ =\ \{\ T\ \mid \ \exists \ p,\ b.\ \langle p,\ b\rangle \ \in \ \mathsf{cases}\ \land \ p\ =\ \mathsf{Pat}-\operatorname{Union}(T,\ \_)\ \} \\
\operatorname{UnionTypesExhaustive}(\mathsf{cases},\ \mathsf{types})\ \Leftrightarrow \ \forall \ T\ \in \ \mathsf{types}.\ \exists \ \mathsf{case}\ \in \ \mathsf{cases}.\ \exists \ p,\ b.\ \mathsf{case}\ =\ \langle p,\ b\rangle \ \land \ p\ =\ \mathsf{Pat}-\operatorname{Union}(T,\ \_)
\end{array}
```

#### 17.6.4 Static Semantics

**Enum Case Analysis**

**(T-IfCase-Enum)**

```math
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \forall \ i,\ \mathsf{case}_{i}\ =\ \langle p_{i},\ b_{i}\rangle \quad \forall \ i,\ \operatorname{CaseScope}(\Gamma ,\ e,\ p_{i},\ \operatorname{TypePath}(p))\ \Downarrow \ \Gamma_{i} \quad \forall \ i,\ \Gamma_{i} ;\ R;\ L\ \vdash \ b_{i}\ :\ T_{r}\quad (\mathsf{else}_{\mathsf{opt}}\ =\ \bot \ \lor \ \Gamma ;\ R;\ L\ \vdash \ \mathsf{else}_{\mathsf{opt}}\ :\ T_{r})\quad (\mathsf{else}_{\mathsf{opt}}\ \ne \ \bot \ \lor \ \operatorname{HasIrrefutableCase}(\mathsf{cases},\ \operatorname{TypePath}(p))\ \lor \ \operatorname{CaseVariants}(\mathsf{cases})\ =\ \operatorname{VariantNames}(E)) \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ :\ T_{r}
\end{array}
```

**Modal Case Analysis**

**(T-IfCase-Modal)**

```math
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \forall \ i,\ \mathsf{case}_{i}\ =\ \langle p_{i},\ b_{i}\rangle \quad \forall \ i,\ \operatorname{CaseScope}(\Gamma ,\ e,\ p_{i},\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}}))\ \Downarrow \ \Gamma_{i} \quad \forall \ i,\ \Gamma_{i} ;\ R;\ L\ \vdash \ b_{i}\ :\ T_{r}\quad (\mathsf{else}_{\mathsf{opt}}\ =\ \bot \ \lor \ \Gamma ;\ R;\ L\ \vdash \ \mathsf{else}_{\mathsf{opt}}\ :\ T_{r})\quad (\mathsf{else}_{\mathsf{opt}}\ \ne \ \bot \ \lor \ \operatorname{HasIrrefutableCase}(\mathsf{cases},\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}}))\ \lor \ \operatorname{CaseStates}(\mathsf{cases})\ =\ \operatorname{States}(M)) \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ :\ T_{r}
\end{array}
```

**(IfCase-Modal-NonExhaustive)**

```math
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \mathsf{else}_{\mathsf{opt}}\ =\ \bot \quad \lnot (\operatorname{HasIrrefutableCase}(\mathsf{cases},\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}}))\ \lor \ \operatorname{CaseStates}(\mathsf{cases})\ =\ \operatorname{States}(M))\quad c\ =\ \operatorname{Code}(\mathsf{IfCase}-\mathsf{Modal}-\mathsf{NonExhaustive}) \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ \Uparrow \ c
\end{array}
```

**Union Case Analysis**

**(T-IfCase-Union)**

```math
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad \forall \ i,\ \mathsf{case}_{i}\ =\ \langle p_{i},\ b_{i}\rangle \quad \forall \ i,\ \operatorname{CaseScope}(\Gamma ,\ e,\ p_{i},\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}]))\ \Downarrow \ \Gamma_{i} \quad \forall \ i,\ \Gamma_{i} ;\ R;\ L\ \vdash \ b_{i}\ :\ T_{r}\quad (\mathsf{else}_{\mathsf{opt}}\ =\ \bot \ \lor \ \Gamma ;\ R;\ L\ \vdash \ \mathsf{else}_{\mathsf{opt}}\ :\ T_{r})\quad (\mathsf{else}_{\mathsf{opt}}\ \ne \ \bot \ \lor \ \operatorname{HasIrrefutableCase}(\mathsf{cases},\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}]))\ \lor \ \operatorname{UnionTypesExhaustive}(\mathsf{cases},\ [T_{1},\ \ldots ,\ T_{n}])) \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ :\ T_{r}
\end{array}
```

**(IfCase-Union-NonExhaustive)**

```math
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad \mathsf{else}_{\mathsf{opt}}\ =\ \bot \quad \lnot (\operatorname{HasIrrefutableCase}(\mathsf{cases},\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}]))\ \lor \ \operatorname{UnionTypesExhaustive}(\mathsf{cases},\ [T_{1},\ \ldots ,\ T_{n}]))\quad c\ =\ \operatorname{Code}(\mathsf{IfCase}-\mathsf{Union}-\mathsf{NonExhaustive}) \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ \Uparrow \ c
\end{array}
```

**(Chk-IfCase-Union)**

```math
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad \forall \ i,\ \mathsf{case}_{i}\ =\ \langle p_{i},\ b_{i}\rangle \quad \forall \ i,\ \operatorname{CaseScope}(\Gamma ,\ e,\ p_{i},\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}]))\ \Downarrow \ \Gamma_{i} \quad \forall \ i,\ \Gamma_{i} ;\ R;\ L\ \vdash \ b_{i}\ \Leftarrow \ T\quad (\mathsf{else}_{\mathsf{opt}}\ =\ \bot \ \lor \ \Gamma ;\ R;\ L\ \vdash \ \mathsf{else}_{\mathsf{opt}}\ \Leftarrow \ T\ \dashv \ \emptyset )\quad (\mathsf{else}_{\mathsf{opt}}\ \ne \ \bot \ \lor \ \operatorname{HasIrrefutableCase}(\mathsf{cases},\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}]))\ \lor \ \operatorname{UnionTypesExhaustive}(\mathsf{cases},\ [T_{1},\ \ldots ,\ T_{n}])) \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ \Leftarrow \ T\ \dashv \ \emptyset 
\end{array}
```

**Other Case Analysis**

**(T-IfCase-Other)**

```math
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T_{s}\quad \forall \ i,\ \mathsf{case}_{i}\ =\ \langle p_{i},\ b_{i}\rangle \quad \forall \ i,\ \operatorname{CaseScope}(\Gamma ,\ e,\ p_{i},\ T_{s})\ \Downarrow \ \Gamma_{i} \quad \forall \ i,\ \Gamma_{i} ;\ R;\ L\ \vdash \ b_{i}\ :\ T_{r}\quad (\mathsf{else}_{\mathsf{opt}}\ =\ \bot \ \lor \ \Gamma ;\ R;\ L\ \vdash \ \mathsf{else}_{\mathsf{opt}}\ :\ T_{r})\quad (\mathsf{else}_{\mathsf{opt}}\ \ne \ \bot \ \lor \ \operatorname{HasIrrefutableCase}(\mathsf{cases},\ T_{s})) \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ :\ T_{r}
\end{array}
```

**(Chk-IfCase-Enum)**

```math
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \forall \ i,\ \mathsf{case}_{i}\ =\ \langle p_{i},\ b_{i}\rangle \quad \forall \ i,\ \operatorname{CaseScope}(\Gamma ,\ e,\ p_{i},\ \operatorname{TypePath}(p))\ \Downarrow \ \Gamma_{i} \quad \forall \ i,\ \Gamma_{i} ;\ R;\ L\ \vdash \ b_{i}\ \Leftarrow \ T\quad (\mathsf{else}_{\mathsf{opt}}\ =\ \bot \ \lor \ \Gamma ;\ R;\ L\ \vdash \ \mathsf{else}_{\mathsf{opt}}\ \Leftarrow \ T\ \dashv \ \emptyset )\quad (\mathsf{else}_{\mathsf{opt}}\ \ne \ \bot \ \lor \ \operatorname{HasIrrefutableCase}(\mathsf{cases},\ \operatorname{TypePath}(p))\ \lor \ \operatorname{CaseVariants}(\mathsf{cases})\ =\ \operatorname{VariantNames}(E)) \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ \Leftarrow \ T\ \dashv \ \emptyset 
\end{array}
```

**(IfCase-Enum-NonExhaustive)**

```math
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \mathsf{else}_{\mathsf{opt}}\ =\ \bot \quad \lnot (\operatorname{HasIrrefutableCase}(\mathsf{cases},\ \operatorname{TypePath}(p))\ \lor \ \operatorname{CaseVariants}(\mathsf{cases})\ =\ \operatorname{VariantNames}(E))\quad c\ =\ \operatorname{Code}(\mathsf{IfCase}-\mathsf{Enum}-\mathsf{NonExhaustive}) \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ \Uparrow \ c
\end{array}
```

**(Chk-IfCase-Modal)**

```math
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \forall \ i,\ \mathsf{case}_{i}\ =\ \langle p_{i},\ b_{i}\rangle \quad \forall \ i,\ \operatorname{CaseScope}(\Gamma ,\ e,\ p_{i},\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}}))\ \Downarrow \ \Gamma_{i} \quad \forall \ i,\ \Gamma_{i} ;\ R;\ L\ \vdash \ b_{i}\ \Leftarrow \ T\quad (\mathsf{else}_{\mathsf{opt}}\ =\ \bot \ \lor \ \Gamma ;\ R;\ L\ \vdash \ \mathsf{else}_{\mathsf{opt}}\ \Leftarrow \ T\ \dashv \ \emptyset )\quad (\mathsf{else}_{\mathsf{opt}}\ \ne \ \bot \ \lor \ \operatorname{HasIrrefutableCase}(\mathsf{cases},\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}}))\ \lor \ \operatorname{CaseStates}(\mathsf{cases})\ =\ \operatorname{States}(M)) \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ \Leftarrow \ T\ \dashv \ \emptyset 
\end{array}
```

**(Chk-IfCase-Other)**

```math
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T_{s}\quad \forall \ i,\ \mathsf{case}_{i}\ =\ \langle p_{i},\ b_{i}\rangle \quad \forall \ i,\ \operatorname{CaseScope}(\Gamma ,\ e,\ p_{i},\ T_{s})\ \Downarrow \ \Gamma_{i} \quad \forall \ i,\ \Gamma_{i} ;\ R;\ L\ \vdash \ b_{i}\ \Leftarrow \ T\quad (\mathsf{else}_{\mathsf{opt}}\ =\ \bot \ \lor \ \Gamma ;\ R;\ L\ \vdash \ \mathsf{else}_{\mathsf{opt}}\ \Leftarrow \ T\ \dashv \ \emptyset )\quad (\mathsf{else}_{\mathsf{opt}}\ \ne \ \bot \ \lor \ \operatorname{HasIrrefutableCase}(\mathsf{cases},\ T_{s})) \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ \Leftarrow \ T\ \dashv \ \emptyset 
\end{array}
```

**(Chk-IfIs)**

```math
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T_{s}\quad \operatorname{CaseScope}(\Gamma ,\ e,\ \mathsf{pat},\ T_{s})\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} ;\ R;\ L\ \vdash \ b_{t}\ \Leftarrow \ T\ \dashv \ \emptyset \quad \Gamma ;\ R;\ L\ \vdash \ b_{f}\ \Leftarrow \ T\ \dashv \ \emptyset  \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfIsExpr}(e,\ \mathsf{pat},\ b_{t},\ b_{f})\ \Leftarrow \ T\ \dashv \ \emptyset 
\end{array}
```

**(Chk-IfIs-No-Else)**

```math
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T_{s}\quad \operatorname{CaseScope}(\Gamma ,\ e,\ \mathsf{pat},\ T_{s})\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} ;\ R;\ L\ \vdash \ b_{t}\ \Leftarrow \ \operatorname{TypePrim}(\texttt{()})\ \dashv \ \emptyset  \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfIsExpr}(e,\ \mathsf{pat},\ b_{t},\ \bot )\ \Leftarrow \ \operatorname{TypePrim}(\texttt{()})\ \dashv \ \emptyset 
\end{array}
```

**(IfCase-Unreachable)**

```math
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T_{s}\quad 1\ \le \ i\ \le \ \mid \mathsf{cases}\mid \quad \operatorname{CaseUnreachable}(T_{s},\ \mathsf{cases},\ i)\quad c\ =\ \operatorname{Code}(\mathsf{IfCase}-\mathsf{Unreachable}) \\
\rule{18em}{0.4pt} \\
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ \Uparrow \ c
\end{array}
```

#### 17.6.5 Dynamic Semantics

No additional dynamic semantics are introduced beyond the case-selection and pattern-matching rules of §17.5.5 and the surrounding `if ... is ...` expression semantics of §16.7.5.

#### 17.6.6 Lowering

No additional lowering is introduced beyond the shared `LowerIfCases` and `LowerBindPattern` rules of §17.5.6.

#### 17.6.7 Diagnostics

Diagnostics are defined for non-exhaustive `if ... is { ... }` case analysis on general modal types, union types, and enum types, and for unreachable case clauses.

### 17.7 Pattern Diagnostics Supplement

This section owns diagnostics for pattern exhaustiveness, irrefutability, and pattern-shape validity.

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
