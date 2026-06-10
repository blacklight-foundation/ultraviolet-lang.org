---
title: "17.6 Exhaustiveness and Reachability"
description: "17.6 Exhaustiveness and Reachability from 17. Patterns of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "patterns"
specSection: "176-exhaustiveness-and-reachability"
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

## 17.6 Exhaustiveness and Reachability

### 17.6.1 Syntax

No additional surface syntax is introduced.

### 17.6.2 Parsing

Exhaustiveness and reachability are not parser-owned.

### 17.6.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{AllEq}\_\Gamma ([T_{1},\ \ldots ,\ T_{n}])\ \Leftrightarrow \ \forall \ i.\ \Gamma \ \vdash \ T_{i}\ \equiv \ T_{1} \\[0.16em]
\operatorname{Irrefutable}(\mathsf{pat},\ T)\ \Leftrightarrow \ \mathsf{pat}\ =\ \mathsf{WildcardPattern}\ \lor \ \mathsf{pat}\ =\ \operatorname{IdentifierPattern}(\_)\ \lor \ (\mathsf{pat}\ =\ \operatorname{TypedPattern}(\_,\ T_{a})\ \land \ T_{a}\ =\ \operatorname{StripPerm}(T))\ \lor \ (\mathsf{pat}\ =\ \operatorname{TuplePattern}([p_{1},\ \ldots ,\ p_{n}])\ \land \ \operatorname{StripPerm}(T)\ =\ \operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}])\ \land \ \forall \ i.\ \operatorname{Irrefutable}(p_{i},\ T_{i}))\ \lor \ (\mathsf{pat}\ =\ \operatorname{RecordPattern}(p,\ \mathsf{io})\ \land \ \operatorname{StripPerm}(T)\ =\ \operatorname{TypePath}(p)\ \land \ \operatorname{RecordDecl}(p)\ =\ R\ \land \ \forall \ \mathsf{fp}\ \in \ \mathsf{io}.\ \operatorname{Irrefutable}(\operatorname{PatOf}(\mathsf{fp}),\ \operatorname{FieldType}(R,\ \operatorname{FieldName}(\mathsf{fp})))) \\[0.16em]
\operatorname{HasIrrefutableCase}(\mathsf{cases},\ T)\ \Leftrightarrow \ \exists \ \mathsf{case}\ \in \ \mathsf{cases}.\ \exists \ p,\ b.\ \mathsf{case}\ =\ \langle p,\ b\rangle \ \land \ \operatorname{Irrefutable}(p,\ T)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{CoversVariant}(\operatorname{EnumPattern}(\_,\ v,\ \bot ),\ E,\ v)\ \Leftrightarrow \ \operatorname{VariantPayload}(E,\ v)\ =\ \bot \\[0.16em]
\operatorname{CoversVariant}(\operatorname{EnumPattern}(\_,\ v,\ \operatorname{TuplePayloadPattern}([p_{1},\ \ldots ,\ p_{n}])),\ E,\ v)\ \Leftrightarrow \ \operatorname{VariantPayload}(E,\ v)\ =\ \operatorname{TuplePayload}([T_{1},\ \ldots ,\ T_{n}])\ \land \ \forall \ i.\ \operatorname{Irrefutable}(p_{i},\ T_{i}) \\[0.16em]
\operatorname{CoversVariant}(\operatorname{EnumPattern}(\_,\ v,\ \operatorname{RecordPayloadPattern}(\mathsf{io})),\ E,\ v)\ \Leftrightarrow \ \operatorname{VariantPayload}(E,\ v)\ =\ \operatorname{RecordPayload}(\_)\ \land \ \forall \ \mathsf{fp}\ \in \ \mathsf{io}.\ \operatorname{Irrefutable}(\operatorname{PatOf}(\mathsf{fp}),\ \operatorname{EnumFieldType}(E,\ v,\ \operatorname{FieldName}(\mathsf{fp})))
\end{array}
$$
CoversVariant(p, E, v) does not hold for any other pattern form.

$$
\operatorname{CoversState}(\operatorname{ModalPattern}(S,\ \mathsf{io}),\ \mathsf{modal}_{\mathsf{ref}},\ S)\ \Leftrightarrow \ \forall \ \mathsf{fp}\ \in \ \mathsf{io}.\ \operatorname{Irrefutable}(\operatorname{PatOf}(\mathsf{fp}),\ \operatorname{ModalPayloadMap}(\mathsf{modal}_{\mathsf{ref}},\ S)(\operatorname{FieldName}(\mathsf{fp})))
$$
CoversState(p, modal_ref, S) does not hold for any other pattern form.

$$
\operatorname{CoversMember}(p,\ T)\ \Leftrightarrow \ \operatorname{Irrefutable}(p,\ T)
$$

A case pattern whose payload subpatterns are refutable matches only part of its variant, state, or member and MUST NOT count toward exhaustiveness.

$$
\begin{array}{l}
\operatorname{CaseLabel}(\operatorname{EnumPattern}(\mathsf{path},\ v,\ \_))\ =\ \langle \texttt{enum},\ \mathsf{path},\ v\rangle \\[0.16em]
\operatorname{CaseLabel}(\operatorname{ModalPattern}(s,\ \_))\ =\ \langle \texttt{modal},\ s\rangle \\[0.16em]
\operatorname{CaseLabel}(\operatorname{TypedPattern}(\_,\ T))\ =\ \langle \texttt{union},\ T\rangle \\[0.16em]
\operatorname{CaseLabel}(\_)\ =\ \bot \\[0.16em]
\operatorname{CaseUnreachable}(T,\ \mathsf{cases},\ i)\ \Leftrightarrow \\[0.16em]
\ (\exists \ j.\ 1\ \le \ j\ <\ i\ \land \ \operatorname{Irrefutable}(\mathsf{cases}[j].\mathsf{pat},\ T))\ \lor \\[0.16em]
\ (\operatorname{CaseLabel}(\mathsf{cases}[i].\mathsf{pat})\ \ne \ \bot \ \land \ \exists \ j.\ 1\ \le \ j\ <\ i\ \land \ \operatorname{CaseLabel}(\mathsf{cases}[j].\mathsf{pat})\ =\ \operatorname{CaseLabel}(\mathsf{cases}[i].\mathsf{pat}))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{VariantNames}(E)\ =\ [\ v.\mathsf{name}\ \mid \ v\ \in \ E.\mathsf{variants}\ ] \\[0.16em]
\operatorname{CoveredVariants}(\mathsf{cases},\ E)\ =\ \{\ v\ \mid \ \exists \ p,\ b.\ \langle p,\ b\rangle \ \in \ \mathsf{cases}\ \land \ \operatorname{CoversVariant}(p,\ E,\ v)\ \}
\end{array}
$$

$$
\operatorname{CoveredStates}(\mathsf{cases},\ \mathsf{modal}_{\mathsf{ref}})\ =\ \{\ S\ \mid \ \exists \ p,\ b.\ \langle p,\ b\rangle \ \in \ \mathsf{cases}\ \land \ \operatorname{CoversState}(p,\ \mathsf{modal}_{\mathsf{ref}},\ S)\ \}
$$

$$
\begin{array}{l}
\operatorname{UnionTypes}(U)\ =\ [T_{1},\ \ldots ,\ T_{n}]\ \Leftrightarrow \ U\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}]) \\[0.16em]
\operatorname{CaseUnionTypes}(\mathsf{cases})\ =\ \{\ T\ \mid \ \exists \ p,\ b.\ \langle p,\ b\rangle \ \in \ \mathsf{cases}\ \land \ p\ =\ \operatorname{TypedPattern}(\_,\ T)\ \} \\[0.16em]
\operatorname{UnionTypesExhaustive}(\mathsf{cases},\ \mathsf{types})\ \Leftrightarrow \ \forall \ T\ \in \ \mathsf{types}.\ \exists \ \mathsf{case}\ \in \ \mathsf{cases}.\ \exists \ p,\ b.\ \mathsf{case}\ =\ \langle p,\ b\rangle \ \land \ \operatorname{CoversMember}(p,\ T)
\end{array}
$$

### 17.6.4 Static Semantics

**Enum Case Analysis**

**(T-IfCase-Enum)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \forall \ i,\ \mathsf{case}_{i}\ =\ \langle p_{i},\ b_{i}\rangle \quad \forall \ i,\ \operatorname{CaseScope}(\Gamma ,\ e,\ p_{i},\ \operatorname{TypePath}(p))\ \Downarrow \ \Gamma_{i} \quad \forall \ i,\ \Gamma_{i} ;\ R;\ L\ \vdash \ b_{i}\ :\ T_{r}\quad (\mathsf{else}_{\mathsf{opt}}\ =\ \bot \ \lor \ (\operatorname{CasesElseScope}(\Gamma ,\ e,\ \mathsf{cases},\ \operatorname{TypePath}(p))\ \Downarrow \ \Gamma_{e} \ \land \ \Gamma_{e} ;\ R;\ L\ \vdash \ \mathsf{else}_{\mathsf{opt}}\ :\ T_{r}))\quad (\mathsf{else}_{\mathsf{opt}}\ \ne \ \bot \ \lor \ \operatorname{HasIrrefutableCase}(\mathsf{cases},\ \operatorname{TypePath}(p))\ \lor \ \operatorname{CoveredVariants}(\mathsf{cases},\ E)\ =\ \operatorname{VariantNames}(E)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ :\ T_{r}
\end{array}
$$

**Modal Case Analysis**

**(T-IfCase-Modal)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \forall \ i,\ \mathsf{case}_{i}\ =\ \langle p_{i},\ b_{i}\rangle \quad \forall \ i,\ \operatorname{CaseScope}(\Gamma ,\ e,\ p_{i},\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}}))\ \Downarrow \ \Gamma_{i} \quad \forall \ i,\ \Gamma_{i} ;\ R;\ L\ \vdash \ b_{i}\ :\ T_{r}\quad (\mathsf{else}_{\mathsf{opt}}\ =\ \bot \ \lor \ (\operatorname{CasesElseScope}(\Gamma ,\ e,\ \mathsf{cases},\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}}))\ \Downarrow \ \Gamma_{e} \ \land \ \Gamma_{e} ;\ R;\ L\ \vdash \ \mathsf{else}_{\mathsf{opt}}\ :\ T_{r}))\quad (\mathsf{else}_{\mathsf{opt}}\ \ne \ \bot \ \lor \ \operatorname{HasIrrefutableCase}(\mathsf{cases},\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}}))\ \lor \ \operatorname{CoveredStates}(\mathsf{cases},\ \mathsf{modal}_{\mathsf{ref}})\ =\ \operatorname{States}(M)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ :\ T_{r}
\end{array}
$$

**(IfCase-Modal-NonExhaustive)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \mathsf{else}_{\mathsf{opt}}\ =\ \bot \quad \lnot (\operatorname{HasIrrefutableCase}(\mathsf{cases},\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}}))\ \lor \ \operatorname{CoveredStates}(\mathsf{cases},\ \mathsf{modal}_{\mathsf{ref}})\ =\ \operatorname{States}(M))\quad c\ =\ \operatorname{Code}(\mathsf{IfCase}-\mathsf{Modal}-\mathsf{NonExhaustive}) \\[0.16em]
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
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \forall \ i,\ \mathsf{case}_{i}\ =\ \langle p_{i},\ b_{i}\rangle \quad \forall \ i,\ \operatorname{CaseScope}(\Gamma ,\ e,\ p_{i},\ \operatorname{TypePath}(p))\ \Downarrow \ \Gamma_{i} \quad \forall \ i,\ \Gamma_{i} ;\ R;\ L\ \vdash \ b_{i}\ \Leftarrow \ T\quad (\mathsf{else}_{\mathsf{opt}}\ =\ \bot \ \lor \ (\operatorname{CasesElseScope}(\Gamma ,\ e,\ \mathsf{cases},\ \operatorname{TypePath}(p))\ \Downarrow \ \Gamma_{e} \ \land \ \Gamma_{e} ;\ R;\ L\ \vdash \ \mathsf{else}_{\mathsf{opt}}\ \Leftarrow \ T\ \dashv \ \emptyset ))\quad (\mathsf{else}_{\mathsf{opt}}\ \ne \ \bot \ \lor \ \operatorname{HasIrrefutableCase}(\mathsf{cases},\ \operatorname{TypePath}(p))\ \lor \ \operatorname{CoveredVariants}(\mathsf{cases},\ E)\ =\ \operatorname{VariantNames}(E)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ \Leftarrow \ T\ \dashv \ \emptyset
\end{array}
$$

**(IfCase-Enum-NonExhaustive)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \mathsf{else}_{\mathsf{opt}}\ =\ \bot \quad \lnot (\operatorname{HasIrrefutableCase}(\mathsf{cases},\ \operatorname{TypePath}(p))\ \lor \ \operatorname{CoveredVariants}(\mathsf{cases},\ E)\ =\ \operatorname{VariantNames}(E))\quad c\ =\ \operatorname{Code}(\mathsf{IfCase}-\mathsf{Enum}-\mathsf{NonExhaustive}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ \Uparrow \ c
\end{array}
$$

**(Chk-IfCase-Modal)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \forall \ i,\ \mathsf{case}_{i}\ =\ \langle p_{i},\ b_{i}\rangle \quad \forall \ i,\ \operatorname{CaseScope}(\Gamma ,\ e,\ p_{i},\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}}))\ \Downarrow \ \Gamma_{i} \quad \forall \ i,\ \Gamma_{i} ;\ R;\ L\ \vdash \ b_{i}\ \Leftarrow \ T\quad (\mathsf{else}_{\mathsf{opt}}\ =\ \bot \ \lor \ (\operatorname{CasesElseScope}(\Gamma ,\ e,\ \mathsf{cases},\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}}))\ \Downarrow \ \Gamma_{e} \ \land \ \Gamma_{e} ;\ R;\ L\ \vdash \ \mathsf{else}_{\mathsf{opt}}\ \Leftarrow \ T\ \dashv \ \emptyset ))\quad (\mathsf{else}_{\mathsf{opt}}\ \ne \ \bot \ \lor \ \operatorname{HasIrrefutableCase}(\mathsf{cases},\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}}))\ \lor \ \operatorname{CoveredStates}(\mathsf{cases},\ \mathsf{modal}_{\mathsf{ref}})\ =\ \operatorname{States}(M)) \\[0.16em]
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
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T_{s}\quad \operatorname{CaseScope}(\Gamma ,\ e,\ \mathsf{pat},\ T_{s})\ \Downarrow \ \Gamma_{1} \quad \operatorname{ElseScope}(\Gamma ,\ e,\ \mathsf{pat},\ T_{s})\ \Downarrow \ \Gamma_{2} \quad \Gamma_{1} ;\ R;\ L\ \vdash \ b_{t}\ \Leftarrow \ T\ \dashv \ \emptyset \quad \Gamma_{2} ;\ R;\ L\ \vdash \ b_{f}\ \Leftarrow \ T\ \dashv \ \emptyset \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfIsExpr}(e,\ \mathsf{pat},\ b_{t},\ b_{f})\ \Leftarrow \ T\ \dashv \ \emptyset
\end{array}
$$

**(Chk-IfIs-No-Else)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T_{s}\quad \operatorname{CaseScope}(\Gamma ,\ e,\ \mathsf{pat},\ T_{s})\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} ;\ R;\ L\ \vdash \ b_{t}\ \Leftarrow \ \operatorname{TypePrim}(\texttt{()})\ \dashv \ \emptyset \\[0.16em]
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

Diagnostics are defined for non-exhaustive `if ... is { ... }` case analysis on general modal types, union types, and enum types, and for unreachable case clauses. A case contributes to exhaustiveness only when `CoversVariant`, `CoversState`, or `CoversMember` holds; refutable payload subpatterns never contribute coverage.
