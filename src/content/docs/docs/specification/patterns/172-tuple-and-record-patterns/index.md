---
title: "17.2 Tuple and Record Patterns"
description: "17.2 Tuple and Record Patterns from 17. Patterns of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "patterns"
specSection: "172-tuple-and-record-patterns"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/patterns/">17. Patterns</a>
  <span>Patterns</span>
</div>

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
\Gamma \ \vdash \ \operatorname{ParseFieldPattern}(P)\ \Downarrow \ (P_{1},\ f)\quad \Gamma \ \vdash \ \operatorname{ParseFieldPatternTail}(P_{1},\ [f])\ \Downarrow \ (P_{2},\ \mathsf{io}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseFieldPatternList}(P)\ \Downarrow \ (P_{2},\ \mathsf{io})
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

**(Pat-Tuple-Unit-R)**

$$
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypePrim}(\texttt{"()"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TuplePattern}([])\ \triangleleft \ T\ \dashv \ \emptyset 
\end{array}
$$

**(Pat-Record-R)**

$$
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \forall \ \mathsf{fp}\ \in \ \mathsf{io},\ \operatorname{FieldType}(R,\ \operatorname{FieldName}(\mathsf{fp}))\ =\ T_{f}\ \land \ \operatorname{FieldVisible}(m,\ R,\ \operatorname{FieldName}(\mathsf{fp}))\ \land \ \Gamma \ \vdash \ \operatorname{PatOf}(\mathsf{fp})\ \triangleleft \ T_{f}\ \dashv \ B_{f}\quad B\ =\ \uplus \_\{\mathsf{fp}\ \in \ \mathsf{io}\}\ B_{f} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RecordPattern}(p,\ \mathsf{io})\ \triangleleft \ T\ \dashv \ B
\end{array}
$$

**(RecordPattern-UnknownField)**

$$
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \exists \ \mathsf{fp}\ \in \ \mathsf{io}.\ \operatorname{FieldName}(\mathsf{fp})\ \notin \ \operatorname{FieldNameSet}(R)\quad c\ =\ \operatorname{Code}(\mathsf{RecordPattern}-\mathsf{UnknownField}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RecordPattern}(p,\ \mathsf{io})\ \triangleleft \ T\ \Uparrow \ c
\end{array}
$$

### 17.2.5 Dynamic Semantics

**MatchRecord.**

$$
\mathsf{MatchRecordJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{MatchRecord}(\mathsf{io},\ v)\ \Downarrow \ B\}
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
\operatorname{FieldValue}(v,\ f)\ =\ v_{f}\quad \Gamma \ \vdash \ \operatorname{MatchRecord}(\mathsf{io},\ v)\ \Downarrow \ B \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MatchRecord}([f]\ \mathbin{++} \ \mathsf{io},\ v)\ \Downarrow \ (B\ \uplus \ \{f\ \mapsto \ v_{f}\})
\end{array}
$$

**(MatchRecord-Cons-Explicit)**

$$
\begin{array}{l}
\operatorname{FieldValue}(v,\ f)\ =\ v_{f}\quad \Gamma \ \vdash \ \operatorname{MatchPattern}(p,\ v_{f})\ \Downarrow \ B_{1}\quad \Gamma \ \vdash \ \operatorname{MatchRecord}(\mathsf{io},\ v)\ \Downarrow \ B_{2} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MatchRecord}([\langle f,\ p\rangle ]\ \mathbin{++} \ \mathsf{io},\ v)\ \Downarrow \ (B_{1}\ \uplus \ B_{2})
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
\Gamma \ \vdash \ \operatorname{MatchRecord}(\mathsf{io},\ v)\ \Downarrow \ B \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MatchPattern}(R\{\mathsf{io}\},\ v)\ \Downarrow \ B
\end{array}
$$

### 17.2.6 Lowering

Tuple and record patterns use the shared lowering rules in §17.5.6.

### 17.2.7 Diagnostics

Diagnostics are defined for tuple-pattern arity mismatch and record patterns that reference unknown fields.
