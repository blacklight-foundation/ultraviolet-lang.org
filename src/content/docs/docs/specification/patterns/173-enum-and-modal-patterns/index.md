---
title: "17.3 Enum and Modal Patterns"
description: "17.3 Enum and Modal Patterns from 17. Patterns of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "patterns"
specSection: "173-enum-and-modal-patterns"
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

Resolution classifies `A::B { ... }` by the resolved declarations. If `A::B`
resolves as a record type path, the pattern is a `RecordPattern`. If `A` resolves
as an enum type and `B` resolves as a record-payload variant, the pattern is an
`EnumPattern` with record payload. If both are available in the same namespace
relation, resolution emits `E-MOD-1307`.

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
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseFieldPatternList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{io})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseEnumPatternPayloadOpt}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{RecordPayloadPattern}(\mathsf{io}))
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
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseFieldPatternList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{io})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseModalPatternPayloadOpt}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{ModalRecordPayload}(\mathsf{io}))
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
\operatorname{StripPerm}(T)\ =\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{VariantPayload}(E,\ v)\ =\ \operatorname{RecordPayload}(\mathsf{io}')\quad \forall \ \mathsf{fp}\ \in \ \mathsf{io},\ \operatorname{EnumFieldType}(E,\ v,\ \operatorname{FieldName}(\mathsf{fp}))\ =\ T_{f}\ \land \ \Gamma \ \vdash \ \operatorname{PatOf}(\mathsf{fp})\ \triangleleft \ T_{f}\ \dashv \ B_{f}\quad B\ =\ \uplus \_\{\mathsf{fp}\ \in \ \mathsf{io}\}\ B_{f} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EnumPattern}(p,\ v,\ \operatorname{RecordPayloadPattern}(\mathsf{io}))\ \triangleleft \ T\ \dashv \ B
\end{array}
$$

**(Pat-Modal-R)**

$$
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad S\ \in \ \operatorname{States}(M)\quad \forall \ \mathsf{fp}\ \in \ \mathsf{io},\ \operatorname{ModalPayloadMap}(\mathsf{modal}_{\mathsf{ref}},\ S)(\operatorname{FieldName}(\mathsf{fp}))\ =\ T_{f}\ \land \ \Gamma \ \vdash \ \operatorname{PatOf}(\mathsf{fp})\ \triangleleft \ T_{f}\ \dashv \ B_{f}\quad B\ =\ \uplus \_\{\mathsf{fp}\ \in \ \mathsf{io}\}\ B_{f} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ModalPattern}(S,\ \mathsf{io})\ \triangleleft \ T\ \dashv \ B
\end{array}
$$

**(Pat-Modal-State-R)**

$$
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \forall \ \mathsf{fp}\ \in \ \mathsf{io},\ \operatorname{ModalPayloadMap}(\mathsf{modal}_{\mathsf{ref}},\ S)(\operatorname{FieldName}(\mathsf{fp}))\ =\ T_{f}\ \land \ \Gamma \ \vdash \ \operatorname{PatOf}(\mathsf{fp})\ \triangleleft \ T_{f}\ \dashv \ B_{f}\quad B\ =\ \uplus \_\{\mathsf{fp}\ \in \ \mathsf{io}\}\ B_{f} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ModalPattern}(S,\ \mathsf{io})\ \triangleleft \ T\ \dashv \ B
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
\Gamma \ \vdash \ \operatorname{MatchRecord}(\mathsf{io},\ v)\ \Downarrow \ B \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MatchModal}(@S\{\mathsf{io}\},\ \langle S,\ v\rangle )\ \Downarrow \ B
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
v\ =\ \operatorname{EnumValue}(\mathsf{path}',\ \operatorname{RecordPayload}(\mathsf{vec}_{f}))\quad \operatorname{EnumPath}(\mathsf{path}')\ =\ \mathsf{path}\quad \operatorname{VariantName}(\mathsf{path}')\ =\ \mathsf{name}\quad \Gamma \ \vdash \ \operatorname{MatchRecord}(\mathsf{io},\ \operatorname{RecordPayload}(\mathsf{vec}_{f}))\ \Downarrow \ B \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MatchPattern}(\operatorname{EnumPattern}(\mathsf{path},\ \mathsf{name},\ \operatorname{RecordPayloadPattern}(\mathsf{io})),\ v)\ \Downarrow \ B
\end{array}
$$

**(Match-Modal-General)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MatchModal}(@S\{\mathsf{io}\},\ \langle S,\ v\rangle )\ \Downarrow \ B \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MatchPattern}(@S\{\mathsf{io}\},\ \langle S,\ v\rangle )\ \Downarrow \ B
\end{array}
$$

**(Match-Modal-State)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MatchRecord}(\mathsf{io},\ v)\ \Downarrow \ B \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MatchPattern}(@S\{\mathsf{io}\},\ v)\ \Downarrow \ B
\end{array}
$$

### 17.3.6 Lowering

Enum and modal patterns use the shared lowering rules in §17.5.6.

### 17.3.7 Diagnostics

No additional named diagnostics are introduced for enum or modal pattern shape checking beyond the typing failures in this section and the exhaustiveness diagnostics in §17.6.
