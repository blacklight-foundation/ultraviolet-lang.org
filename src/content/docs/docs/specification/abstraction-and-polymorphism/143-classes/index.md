---
title: "14.3 Classes"
description: "14.3 Classes from 14. Abstraction and Polymorphism of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "abstraction-and-polymorphism"
specSection: "143-classes"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/abstraction-and-polymorphism/">14. Abstraction and Polymorphism</a>
  <span>Abstraction and Polymorphism</span>
</div>

## 14.3 Classes

### 14.3.1 Syntax

```text
class_decl   ::= attribute_list? visibility? "modal"? "class" identifier generic_params? ("<:" superclass_bounds)? predicate_clause? "{" class_body? "}"
class_item   ::= class_method | associated_type | abstract_field | abstract_state
abstract_state ::= "@" identifier "{" abstract_field* "}"
abstract_field ::= attribute_list? visibility? key_boundary? identifier ":" type
```

Associated type item syntax is defined canonically in §14.5.

### 14.3.2 Parsing

**(Parse-Class)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \Gamma \ \vdash \ \operatorname{ParseModalOpt}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{modal})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{2}),\ \texttt{class})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{2}))\ \Downarrow \ (P_{3},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseGenericParamsOpt}(P_{3})\ \Downarrow \ (P_{4},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseSuperclassOpt}(P_{4})\ \Downarrow \ (P_{5},\ \mathsf{supers})\quad \Gamma \ \vdash \ \operatorname{ParsePredicateClauseOpt}(P_{5})\ \Downarrow \ (P_{6},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseClassBody}(P_{6})\ \Downarrow \ (P_{7},\ \mathsf{items}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseItem}(P)\ \Downarrow \ (P_{7},\ \langle \mathsf{ClassDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{modal},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{supers},\ \mathsf{items},\ \operatorname{SpanBetween}(P,\ P_{7}),\ []\rangle )
\end{array}
$$

**(Parse-Superclass-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"<:"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseSuperclassOpt}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-Superclass-Yes)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"<:"})\quad \Gamma \ \vdash \ \operatorname{ParseSuperclassBounds}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{supers}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseSuperclassOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{supers})
\end{array}
$$

**(Parse-SuperclassBounds-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseClassPath}(P)\ \Downarrow \ (P_{1},\ c_{0})\quad \Gamma \ \vdash \ \operatorname{ParseSuperclassBoundsTail}(P_{1},\ [c_{0}])\ \Downarrow \ (P_{2},\ \mathsf{cs}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseSuperclassBounds}(P)\ \Downarrow \ (P_{2},\ \mathsf{cs})
\end{array}
$$

**(Parse-SuperclassBoundsTail-End)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"+"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseSuperclassBoundsTail}(P,\ \mathsf{cs})\ \Downarrow \ (P,\ \mathsf{cs})
\end{array}
$$

**(Parse-SuperclassBoundsTail-Plus)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"+"})\quad \Gamma \ \vdash \ \operatorname{ParseClassPath}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ c)\quad \Gamma \ \vdash \ \operatorname{ParseSuperclassBoundsTail}(P_{1},\ \mathsf{cs}\ \mathbin{++} \ [c])\ \Downarrow \ (P_{2},\ \mathsf{cs}') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseSuperclassBoundsTail}(P,\ \mathsf{cs})\ \Downarrow \ (P_{2},\ \mathsf{cs}')
\end{array}
$$

**(Parse-ClassBody)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseClassItemList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{items})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClassBody}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \mathsf{items})
\end{array}
$$

**(Parse-ClassItemList-End)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClassItemList}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-ClassItemList-Cons)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\}"})\quad \Gamma \ \vdash \ \operatorname{ParseClassItem}(P)\ \Downarrow \ (P_{1},\ \mathsf{it})\quad \Gamma \ \vdash \ \operatorname{ParseClassItemList}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{rest}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClassItemList}(P)\ \Downarrow \ (P_{2},\ [\mathsf{it}]\ \mathbin{++} \ \mathsf{rest})
\end{array}
$$

**(Parse-ClassItem-Method)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{procedure})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseGenericParamsOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseMethodSignature}(P_{3})\ \Downarrow \ (P_{4},\ \mathsf{receiver},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseContractClauseOpt}(P_{4})\ \Downarrow \ (P_{5},\ \mathsf{contract}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseClassMethodBody}(P_{5})\ \Downarrow \ (P_{6},\ \mathsf{body}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClassItem}(P)\ \Downarrow \ (P_{6},\ \langle \mathsf{ClassMethodDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{receiver},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body}_{\mathsf{opt}},\ \operatorname{SpanBetween}(P,\ P_{6}),\ []\rangle )
\end{array}
$$

**(Parse-ClassItem-Field)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \Gamma \ \vdash \ \operatorname{ParseKeyBoundaryOpt}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{boundary})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{name})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{3}),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P_{3}))\ \Downarrow \ (P_{4},\ \mathsf{ty})\quad \Gamma \ \vdash \ \operatorname{ConsumeTerminatorReq}(P_{4})\ \Downarrow \ P_{5} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClassItem}(P)\ \Downarrow \ (P_{5},\ \langle \mathsf{ClassFieldDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{name},\ \mathsf{ty},\ \operatorname{SpanBetween}(P,\ P_{5}),\ []\rangle )
\end{array}
$$

**(Parse-ClassItem-AbstractState)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{"@"})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{name})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseAbstractFieldList}(\operatorname{Advance}(P_{2}))\ \Downarrow \ (P_{3},\ \mathsf{fields})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{3}),\ \texttt{"\}"})\quad \Gamma \ \vdash \ \operatorname{ConsumeTerminatorOpt}(\operatorname{Advance}(P_{3}),\ \bot )\ \Downarrow \ P_{4} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClassItem}(P)\ \Downarrow \ (P_{4},\ \langle \mathsf{AbstractStateDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{fields},\ \operatorname{SpanBetween}(P,\ P_{4}),\ []\rangle )
\end{array}
$$

**(Parse-ClassMethodBody-Concrete)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(P)\ \Downarrow \ (P_{1},\ \mathsf{body}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClassMethodBody}(P)\ \Downarrow \ (P_{1},\ \mathsf{body})
\end{array}
$$

**(Parse-ClassMethodBody-Abstract)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ConsumeTerminatorReq}(P)\ \Downarrow \ P_{1} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClassMethodBody}(P)\ \Downarrow \ (P_{1},\ \bot )
\end{array}
$$

### 14.3.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{ClassDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{modal},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{supers},\ \mathsf{items},\ \mathsf{span},\ \mathsf{doc}\rangle  \\[0.16em]
\mathsf{ClassDecl}.\mathsf{supers}\ \in \ [\mathsf{ClassPath}]
\end{array}
$$

$$
\begin{array}{l}
\mathsf{ClassItem}\ \in \ \{ \\[0.16em]
\ \mathsf{ClassFieldDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{name},\ \mathsf{type},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}\rangle , \\[0.16em]
\ \mathsf{ClassMethodDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{receiver},\ \mathsf{params},\ \mathsf{return}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}\rangle , \\[0.16em]
\ \mathsf{AssociatedTypeDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{type}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}\rangle , \\[0.16em]
\ \mathsf{AbstractStateDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{fields},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}\rangle  \\[0.16em]
\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{AbstractClassMethod}(m)\ \Leftrightarrow \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{span},\ \mathsf{doc}.\ m\ =\ \operatorname{ClassMethodDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \bot ,\ \mathsf{span},\ \mathsf{doc}) \\[0.16em]
\operatorname{ConcreteClassMethod}(m)\ \Leftrightarrow \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}.\ m\ =\ \operatorname{ClassMethodDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\ \land \ \mathsf{body}\ \ne \ \bot 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ClassItems}(\mathsf{Cl})\ =\ \mathsf{Cl}.\mathsf{items} \\[0.16em]
\operatorname{ClassMethods}(\mathsf{Cl})\ =\ [\ m\ \mid \ m\ \in \ \operatorname{ClassItems}(\mathsf{Cl})\ \land \ m\ \mathsf{is}\ \mathsf{ClassMethodDecl}\ ] \\[0.16em]
\operatorname{ClassFields}(\mathsf{Cl})\ =\ [\ f\ \mid \ f\ \in \ \operatorname{ClassItems}(\mathsf{Cl})\ \land \ f\ \mathsf{is}\ \mathsf{ClassFieldDecl}\ ] \\[0.16em]
\operatorname{MethodNames}(\mathsf{Cl})\ =\ [\ m.\mathsf{name}\ \mid \ m\ \in \ \operatorname{ClassMethods}(\mathsf{Cl})\ ] \\[0.16em]
\operatorname{FieldNames}(\mathsf{Cl})\ =\ [\ f.\mathsf{name}\ \mid \ f\ \in \ \operatorname{ClassFields}(\mathsf{Cl})\ ]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ReturnType}(m)\ =\ m.\mathsf{return}_{\mathsf{type}\_\mathsf{opt}}\quad \mathsf{if}\ m.\mathsf{return}_{\mathsf{type}\_\mathsf{opt}}\ \ne \ \bot  \\[0.16em]
\operatorname{ReturnType}(m)\ =\ \operatorname{TypePrim}(\texttt{"()"})\quad \mathsf{if}\ m.\mathsf{return}_{\mathsf{type}\_\mathsf{opt}}\ =\ \bot 
\end{array}
$$

$$
\mathsf{SelfVar}\ =\ \operatorname{TypePath}([\texttt{Self}])
$$

### 14.3.4 Static Semantics

$$
\begin{array}{l}
\operatorname{Distinct}(\mathsf{xs})\ \Leftrightarrow \ \forall \ i\ \ne \ j.\ \mathsf{xs}[i]\ \ne \ \mathsf{xs}[j] \\[0.16em]
\operatorname{Disjoint}(\mathsf{xs},\ \mathsf{ys})\ \Leftrightarrow \ \forall \ x\ \in \ \mathsf{xs}.\ x\ \notin \ \mathsf{ys}
\end{array}
$$

**(WF-ClassPath)**

$$
\begin{array}{l}
p\ \in \ \operatorname{dom}(\Sigma .\mathsf{Classes}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ p\ :\ \mathsf{ClassPath}
\end{array}
$$

**(WF-ClassPath-Err)**

$$
\begin{array}{l}
p\ \notin \ \operatorname{dom}(\Sigma .\mathsf{Classes}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ p\ :\ \mathsf{ClassPath}\ \Uparrow 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{SubstSelf}(T,\ \operatorname{TypePath}([\texttt{Self}]))\ =\ T \\[0.16em]
\operatorname{SubstSelf}(T,\ \operatorname{TypePerm}(p,\ \mathsf{ty}))\ =\ \operatorname{TypePerm}(p,\ \operatorname{SubstSelf}(T,\ \mathsf{ty})) \\[0.16em]
\operatorname{SubstSelf}(T,\ \operatorname{TypeTuple}([t_{1},\ \ldots ,\ t_{n}]))\ =\ \operatorname{TypeTuple}([\operatorname{SubstSelf}(T,\ t_{1}),\ \ldots ,\ \operatorname{SubstSelf}(T,\ t_{n})]) \\[0.16em]
\operatorname{SubstSelf}(T,\ \operatorname{TypeArray}(\mathsf{ty},\ e))\ =\ \operatorname{TypeArray}(\operatorname{SubstSelf}(T,\ \mathsf{ty}),\ e) \\[0.16em]
\operatorname{SubstSelf}(T,\ \operatorname{TypeSlice}(\mathsf{ty}))\ =\ \operatorname{TypeSlice}(\operatorname{SubstSelf}(T,\ \mathsf{ty})) \\[0.16em]
\operatorname{SubstSelf}(T,\ \operatorname{TypeUnion}([t_{1},\ \ldots ,\ t_{n}]))\ =\ \operatorname{TypeUnion}([\operatorname{SubstSelf}(T,\ t_{1}),\ \ldots ,\ \operatorname{SubstSelf}(T,\ t_{n})]) \\[0.16em]
\operatorname{SubstSelf}(T,\ \operatorname{TypeFunc}([\langle m_{1},\ t_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ t_{n}\rangle ],\ r))\ =\ \operatorname{TypeFunc}([\langle m_{1},\ \operatorname{SubstSelf}(T,\ t_{1})\rangle ,\ \ldots ,\ \langle m_{n},\ \operatorname{SubstSelf}(T,\ t_{n})\rangle ],\ \operatorname{SubstSelf}(T,\ r)) \\[0.16em]
\operatorname{SubstSelf}(T,\ \operatorname{TypePtr}(\mathsf{ty},\ s))\ =\ \operatorname{TypePtr}(\operatorname{SubstSelf}(T,\ \mathsf{ty}),\ s) \\[0.16em]
\operatorname{SubstSelf}(T,\ \operatorname{TypeRawPtr}(q,\ \mathsf{ty}))\ =\ \operatorname{TypeRawPtr}(q,\ \operatorname{SubstSelf}(T,\ \mathsf{ty})) \\[0.16em]
\operatorname{SubstSelf}(T,\ \operatorname{TypeString}(\mathsf{state}_{\mathsf{opt}}))\ =\ \operatorname{TypeString}(\mathsf{state}_{\mathsf{opt}}) \\[0.16em]
\operatorname{SubstSelf}(T,\ \operatorname{TypeBytes}(\mathsf{state}_{\mathsf{opt}}))\ =\ \operatorname{TypeBytes}(\mathsf{state}_{\mathsf{opt}}) \\[0.16em]
\operatorname{SubstSelf}(T,\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S))\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S) \\[0.16em]
\operatorname{SubstSelf}(T,\ \operatorname{TypeDynamic}(p))\ =\ \operatorname{TypeDynamic}(p) \\[0.16em]
\operatorname{SubstSelf}(T,\ \operatorname{TypePrim}(n))\ =\ \operatorname{TypePrim}(n) \\[0.16em]
\operatorname{SubstSelf}(T,\ \operatorname{TypePath}(p))\ =\ \operatorname{TypePath}(p)\quad \mathsf{if}\ p\ \ne \ [\texttt{Self}]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{RecvType}(T,\ \operatorname{ReceiverShorthand}(\texttt{const}))\ =\ \operatorname{TypePerm}(\texttt{const},\ T) \\[0.16em]
\operatorname{RecvType}(T,\ \operatorname{ReceiverShorthand}(\texttt{unique}))\ =\ \operatorname{TypePerm}(\texttt{unique},\ T) \\[0.16em]
\operatorname{RecvType}(T,\ \operatorname{ReceiverShorthand}(\texttt{shared}))\ =\ \operatorname{TypePerm}(\texttt{shared},\ T) \\[0.16em]
\operatorname{RecvType}(T,\ \operatorname{ReceiverExplicit}(\mathsf{mode},\ \mathsf{ty}))\ =\ \operatorname{SubstSelf}(T,\ \mathsf{ty})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{RecvMode}(\operatorname{ReceiverShorthand}(\_))\ =\ \bot  \\[0.16em]
\operatorname{RecvMode}(\operatorname{ReceiverExplicit}(\mathsf{mode},\ \_))\ =\ \mathsf{mode}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{PermOf}(\operatorname{TypePerm}(p,\ \_))\ =\ p \\[0.16em]
\operatorname{PermOf}(\mathsf{ty})\ =\ \texttt{const}\quad \mathsf{otherwise} \\[0.16em]
\operatorname{RecvPerm}(T,\ r)\ =\ \operatorname{PermOf}(\operatorname{RecvType}(T,\ r))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ParamSig_T}(T,\ \mathsf{params})\ =\ [\langle \mathsf{mode},\ \operatorname{SubstSelf}(T,\ \mathsf{ty})\rangle \ \mid \ \langle \mathsf{mode},\ \mathsf{name},\ \mathsf{ty}\rangle \ \in \ \mathsf{params}] \\[0.16em]
\operatorname{ParamBinds_T}(T,\ \mathsf{params})\ =\ [\langle x_{1},\ \operatorname{SubstSelf}(T,\ T_{1})\rangle ,\ \ldots ,\ \langle x_{n},\ \operatorname{SubstSelf}(T,\ T_{n})\rangle ] \\[0.16em]
\operatorname{ReturnType_T}(T,\ m)\ =\ \operatorname{SubstSelf}(T,\ \operatorname{ReturnType}(m)) \\[0.16em]
\operatorname{Sig_T}(T,\ m)\ =\ \langle \operatorname{RecvType}(T,\ m.\mathsf{receiver}),\ \operatorname{ParamSig_T}(T,\ m.\mathsf{params}),\ \operatorname{SubstSelf}(T,\ \operatorname{ReturnType}(m))\rangle  \\[0.16em]
\operatorname{SigSelf}(m)\ =\ \operatorname{Sig_T}(\mathsf{SelfVar},\ m) \\[0.16em]
\operatorname{SigMatch}(T,\ m_{\mathsf{impl}},\ m_{\mathsf{decl}})\ \Leftrightarrow \ \operatorname{Sig_T}(T,\ m_{\mathsf{impl}})\ =\ \langle \mathsf{recv}_{i},\ \mathsf{params}_{i},\ \mathsf{ret}_{i}\rangle \ \land \ \operatorname{Sig_T}(T,\ m_{\mathsf{decl}})\ =\ \langle \mathsf{recv}_{d},\ \mathsf{params}_{d},\ \mathsf{ret}_{d}\rangle \ \land \ \mathsf{recv}_{i}\ =\ \mathsf{recv}_{d}\ \land \ \mathsf{params}_{i}\ =\ \mathsf{params}_{d}\ \land \ \Gamma \ \vdash \ \mathsf{ret}_{i}\ \mathrel{<:} \ \mathsf{ret}_{d}
\end{array}
$$

$$
\operatorname{Supers}(\mathsf{Cl})\ =\ \mathsf{Cl}.\mathsf{supers}
$$

**(T-Superclass)**

$$
\begin{array}{l}
\mathsf{class}\ A\ \mathrel{<:} \ B\quad T\ \mathrel{<:} \ A \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathrel{<:} \ B
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Head}(h\ \mathbin{::} \ t)\ =\ h \\[0.16em]
\operatorname{Tail}([])\ =\ [] \\[0.16em]
\operatorname{Tail}(h\ \mathbin{::} \ t)\ =\ t \\[0.16em]
\operatorname{HeadOk}(h,\ \mathsf{Ls})\ \Leftrightarrow \ \exists \ L\ \in \ \mathsf{Ls}.\ L\ =\ h\ \mathbin{::} \ t\ \land \ \forall \ L'\ \in \ \mathsf{Ls}.\ h\ \notin \ \operatorname{Tail}(L') \\[0.16em]
\operatorname{SelectHead}(\mathsf{Ls})\ =\ h\ \Leftrightarrow \ \mathsf{Ls}\ =\ [L_{1},\ \ldots ,\ L_{n}]\ \land \ L_{i}\ =\ h\ \mathbin{::} \ t\ \land \ \operatorname{HeadOk}(h,\ \mathsf{Ls})\ \land \ \forall \ j\ <\ i.\ \lnot \ \operatorname{HeadOk}(\operatorname{Head}(L_{j}),\ \mathsf{Ls}) \\[0.16em]
\operatorname{SelectHead}(\mathsf{Ls})\ =\ \bot \ \Leftrightarrow \ \lnot \ \exists \ h.\ \operatorname{HeadOk}(h,\ \mathsf{Ls}) \\[0.16em]
\operatorname{PopHead}(h,\ L)\ =\ t\ \Leftrightarrow \ L\ =\ h\ \mathbin{::} \ t \\[0.16em]
\operatorname{PopHead}(h,\ L)\ =\ L\ \Leftrightarrow \ \lnot (L\ =\ h\ \mathbin{::} \ t) \\[0.16em]
\operatorname{PopAll}(h,\ \mathsf{Ls})\ =\ [\operatorname{PopHead}(h,\ L)\ \mid \ L\ \in \ \mathsf{Ls}]
\end{array}
$$

**(Lin-Base)**

$$
\begin{array}{l}
\operatorname{Supers}(\mathsf{Cl})\ =\ [] \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linearize}(\mathsf{Cl})\ \Downarrow \ [\mathsf{Cl}]
\end{array}
$$

**(Merge-Empty)**

$$
\begin{array}{l}
\forall \ L\ \in \ \mathsf{Ls},\ L\ =\ [] \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Merge}(\mathsf{Ls})\ \Downarrow \ []
\end{array}
$$

**(Merge-Step)**

$$
\begin{array}{l}
\operatorname{SelectHead}(\mathsf{Ls})\ =\ h\quad \Gamma \ \vdash \ \operatorname{Merge}(\operatorname{PopAll}(h,\ \mathsf{Ls}))\ \Downarrow \ L \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Merge}(\mathsf{Ls})\ \Downarrow \ [h]\ \mathbin{++} \ L
\end{array}
$$

**(Merge-Fail)**

$$
\begin{array}{l}
\lnot \ \exists \ h.\ \operatorname{HeadOk}(h,\ \mathsf{Ls}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Merge}(\mathsf{Ls})\ \Uparrow 
\end{array}
$$

**(Lin-Ok)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Merge}([\operatorname{Linearize}(S_{1}),\ \ldots ,\ \operatorname{Linearize}(S_{n}),\ [S_{1},\ \ldots ,\ S_{n}]])\ \Downarrow \ L \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linearize}(\mathsf{Cl})\ \Downarrow \ [\mathsf{Cl}]\ \mathbin{++} \ L
\end{array}
$$

**(Lin-Fail)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Merge}(\cdots )\ \Uparrow  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linearize}(\mathsf{Cl})\ \Uparrow 
\end{array}
$$

**(Superclass-Cycle)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Linearize}(\mathsf{Cl})\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{Superclass}-\mathsf{Cycle}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{Cl}\ \Uparrow \ c
\end{array}
$$

$$
\operatorname{Linearize}(\mathsf{Cl})\ =\ [C_{0},\ C_{1},\ \ldots ,\ C_{k}]\ \land \ C_{0}\ =\ \mathsf{Cl}
$$

$$
\begin{array}{l}
\operatorname{EffMethods}(\mathsf{Cl})\ =\ \operatorname{FirstByName}(\mathbin{++} \_\{i=0..k\}\ \operatorname{ClassMethods}(C_{i}))\quad \mathsf{where}\ \operatorname{Linearize}(\mathsf{Cl})\ =\ [C_{0},\ \ldots ,\ C_{k}] \\[0.16em]
\operatorname{EffFields}(\mathsf{Cl})\ =\ \operatorname{FirstFieldByName}(\mathbin{++} \_\{i=0..k\}\ \operatorname{ClassFields}(C_{i}))\quad \mathsf{where}\ \operatorname{Linearize}(\mathsf{Cl})\ =\ [C_{0},\ \ldots ,\ C_{k}]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{FirstByName}(\mathsf{ms})\ =\ \operatorname{FirstByName}(\mathsf{ms},\ \emptyset ) \\[0.16em]
\operatorname{FirstByName}([],\ \mathsf{Seen})\ =\ [] \\[0.16em]
\operatorname{FirstByName}(m\ \mathbin{::} \ \mathsf{ms},\ \mathsf{Seen})\ = \\[0.16em]
\ \{\ m\ \mathbin{::} \ \operatorname{FirstByName}(\mathsf{ms},\ \mathsf{Seen}\ \cup \ \{\ m.\mathsf{name}\ \mapsto \ \operatorname{SigSelf}(m)\ \})\quad \mathsf{if}\ m.\mathsf{name}\ \notin \ \operatorname{dom}(\mathsf{Seen}) \\[0.16em]
\quad \operatorname{FirstByName}(\mathsf{ms},\ \mathsf{Seen})\quad \mathsf{if}\ \mathsf{Seen}[m.\mathsf{name}]\ =\ \operatorname{SigSelf}(m) \\[0.16em]
\quad \Uparrow \quad \mathsf{otherwise}\ \}
\end{array}
$$

**(EffMethods-Conflict)**

$$
\begin{array}{l}
\operatorname{FirstByName}(\mathsf{ms})\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{EffMethods}-\mathsf{Conflict}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Emit}(c)
\end{array}
$$

$$
\operatorname{FieldSig}(f)\ =\ \operatorname{SubstSelf}(\mathsf{SelfVar},\ f.\mathsf{type})
$$

$$
\begin{array}{l}
\operatorname{FirstFieldByName}(\mathsf{io})\ =\ \operatorname{FirstFieldByName}(\mathsf{io},\ \emptyset ) \\[0.16em]
\operatorname{FirstFieldByName}([],\ \mathsf{Seen})\ =\ [] \\[0.16em]
\operatorname{FirstFieldByName}(f\ \mathbin{::} \ \mathsf{io},\ \mathsf{Seen})\ = \\[0.16em]
\ \{\ f\ \mathbin{::} \ \operatorname{FirstFieldByName}(\mathsf{io},\ \mathsf{Seen}\ \cup \ \{\ f.\mathsf{name}\ \mapsto \ \operatorname{FieldSig}(f)\ \})\quad \mathsf{if}\ f.\mathsf{name}\ \notin \ \operatorname{dom}(\mathsf{Seen}) \\[0.16em]
\quad \operatorname{FirstFieldByName}(\mathsf{io},\ \mathsf{Seen})\quad \mathsf{if}\ \mathsf{Seen}[f.\mathsf{name}]\ =\ \operatorname{FieldSig}(f) \\[0.16em]
\quad \Uparrow \quad \mathsf{otherwise}\ \}
\end{array}
$$

**(EffFields-Conflict)**

$$
\begin{array}{l}
\operatorname{FirstFieldByName}(\mathsf{io})\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{EffFields}-\mathsf{Conflict}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Emit}(c)
\end{array}
$$

$$
\operatorname{SelfTypeClass}(\mathsf{ty})\ \Leftrightarrow \ \mathsf{ty}\ =\ \mathsf{SelfVar}\ \lor \ \exists \ p.\ \mathsf{ty}\ =\ \operatorname{TypePerm}(p,\ \mathsf{SelfVar})
$$

**(WF-Class-Method)**

$$
\begin{array}{l}
\mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \mathsf{params}_{\mathsf{gen}}\ =\ [P_{1},\ \ldots ,\ P_{n}]\quad \Gamma \ \vdash \ \langle P_{1};\ \ldots ;\ P_{n}\rangle \ \mathsf{wf}\quad \Gamma_{m} \ =\ \operatorname{BindTypeParams}(\Gamma ,\ \mathsf{params}_{\mathsf{gen}})\quad (r\ =\ \operatorname{ReceiverExplicit}(\mathsf{mode},\ \mathsf{ty})\ \Rightarrow \ \operatorname{SelfTypeClass}(\mathsf{ty}))\quad (r\ =\ \operatorname{ReceiverShorthand}(\_)\ \Rightarrow \ \mathsf{true})\quad \Gamma_{m} \ \vdash \ \operatorname{RecvType}(\mathsf{SelfVar},\ r)\ \mathsf{wf}\quad \mathsf{self}\ \notin \ \operatorname{ParamNames}(\mathsf{params})\quad \operatorname{Distinct}(\operatorname{ParamNames}(\mathsf{params}))\quad \forall \ \langle \_,\ \_,\ T_{i}\rangle \ \in \ \mathsf{params},\ \Gamma_{m} \ \vdash \ T_{i}\ \mathsf{wf}\quad (\mathsf{return}_{\mathsf{type}\_\mathsf{opt}}\ =\ \bot \ \lor \ \Gamma_{m} \ \vdash \ \mathsf{return}_{\mathsf{type}\_\mathsf{opt}}\ \mathsf{wf}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \langle \mathsf{ClassMethodDecl},\ \_,\ \_,\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ r,\ \mathsf{params},\ \mathsf{return}_{\mathsf{type}\_\mathsf{opt}},\ \_,\ \mathsf{body}_{\mathsf{opt}},\ \_,\ \_\rangle \ :\ \operatorname{ClassMethodOK}(\mathsf{Cl})
\end{array}
$$

**(T-Class-Method-Body-Abstract)**

$$
\begin{array}{l}
m.\mathsf{body}_{\mathsf{opt}}\ =\ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ m\ :\ \mathsf{ClassMethodBodyOK}
\end{array}
$$

**(T-Class-Method-Body)**

$$
\begin{array}{l}
m.\mathsf{body}_{\mathsf{opt}}\ =\ \mathsf{body}\quad T_{\mathsf{self}}\ =\ \operatorname{RecvType}(\mathsf{SelfVar},\ m.\mathsf{receiver})\quad R_{m}\ =\ \operatorname{ReturnType_T}(\mathsf{SelfVar},\ m)\quad R_{b}\ =\ \operatorname{BodyReturnType}(R_{m})\quad \Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \operatorname{IntroAll}(\Gamma_{0} ,\ [\langle \texttt{self},\ T_{\mathsf{self}}\rangle ]\ \mathbin{++} \ \operatorname{ParamBinds_T}(\mathsf{SelfVar},\ m.\mathsf{params}))\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} ;\ R_{m};\ \bot \ \vdash \ \mathsf{body}\ :\ T_{b}\quad \Gamma \ \vdash \ T_{b}\ \mathrel{<:} \ R_{b}\quad (R_{b}\ \ne \ \operatorname{TypePrim}(\texttt{"()"})\ \Rightarrow \ \operatorname{ExplicitReturn}(\mathsf{body})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ m\ :\ \mathsf{ClassMethodBodyOK}
\end{array}
$$

**(WF-Class)**

$$
\begin{array}{l}
\operatorname{Distinct}(\operatorname{MethodNames}(\mathsf{Cl}))\quad \operatorname{Distinct}(\operatorname{FieldNames}(\mathsf{Cl}))\quad \operatorname{Disjoint}(\operatorname{MethodNames}(\mathsf{Cl}),\ \operatorname{FieldNames}(\mathsf{Cl}))\quad \operatorname{Distinct}(\operatorname{Supers}(\mathsf{Cl}))\quad \forall \ S\ \in \ \operatorname{Supers}(\mathsf{Cl}),\ \Gamma \ \vdash \ S\ :\ \mathsf{ClassPath}\quad \forall \ m\ \in \ \operatorname{ClassMethods}(\mathsf{Cl}),\ \Gamma \ \vdash \ m\ :\ \operatorname{ClassMethodOK}(\mathsf{Cl})\quad \Gamma \ \vdash \ m\ :\ \mathsf{ClassMethodBodyOK}\quad \Gamma \ \vdash \ \operatorname{Linearize}(\mathsf{Cl})\ \Downarrow \ L \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{Cl}\ :\ \mathsf{ClassOk}
\end{array}
$$

### 14.3.5 Dynamic Semantics

Class declarations do not introduce runtime actions by themselves. Observable behavior arises only when concrete method bodies are invoked or when a class participates in dynamic dispatch as defined in §14.6.

### 14.3.6 Lowering

Concrete class methods lower as procedures. Abstract methods, abstract fields, abstract states, and superclass lists do not lower to executable code directly.

Default-method reuse and vtable construction are defined in §14.4 and §14.6.

### 14.3.7 Diagnostics

Diagnostics are defined for duplicate method names, duplicate abstract-field names, class item name conflicts, invalid `Self` receiver forms, undefined superclass paths, superclass linearization cycles, and effective-method or effective-field conflicts introduced by inheritance.
