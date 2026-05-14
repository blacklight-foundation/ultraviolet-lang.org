---
title: "16.6 Construction Expressions"
description: "16.6 Construction Expressions from 16. Expressions of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "expressions"
specSection: "166-construction-expressions"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/expressions/">16. Expressions</a>
  <span>Expressions</span>
</div>

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
