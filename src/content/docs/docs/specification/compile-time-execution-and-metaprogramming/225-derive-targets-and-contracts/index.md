---
title: "22.5 Derive Targets and Contracts"
description: "22.5 Derive Targets and Contracts from 22. Compile-Time Execution and Metaprogramming of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "compile-time-execution-and-metaprogramming"
specSection: "225-derive-targets-and-contracts"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/compile-time-execution-and-metaprogramming/">22. Compile-Time Execution and Metaprogramming</a>
  <span>Compile-Time Execution and Metaprogramming</span>
</div>

## 22.5 Derive Targets and Contracts

### 22.5.1 Syntax

```text
derive_attribute    ::= attr_open "derive" "(" derive_target_list ")" attr_close
derive_target_list  ::= identifier ("," identifier)*
derive_target_decl  ::= "derive" "target" identifier "(" "target" ":" "Type" ")" derive_contract_opt block_expr
derive_contract_opt ::= "|:" derive_clause ("," derive_clause)*
derive_clause       ::= "emits" identifier | "requires" identifier
```

### 22.5.2 Parsing

$$
\mathsf{DeriveParseJudg}\ =\ \{\mathsf{ParseDeriveAttr},\ \mathsf{ParseDeriveTargetList},\ \mathsf{ParseDeriveTargetDecl},\ \mathsf{ParseDeriveContractOpt},\ \mathsf{ParseDeriveClauseList},\ \mathsf{ParseDeriveClauseTail}\}
$$

`#derive(... )` is parsed by the attribute parser in §9.1.2; the `derive` attribute name and its argument list are interpreted by this section.

**(Parse-DeriveTargetDecl)**

$$
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \operatorname{Lexeme}(\operatorname{Tok}(P))\ =\ \texttt{"derive"}\quad \operatorname{FixedIdentTok}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{target})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ \mathsf{name})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"("})\quad \operatorname{FixedIdentTok}(\operatorname{Tok}(\operatorname{Advance}(P_{1})),\ \texttt{target})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P_{1}))),\ \texttt{":"})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P_{1})))))\quad \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P_{1})))))\ =\ \texttt{"Type"}\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P_{1}))))),\ \texttt{")"})\quad \Gamma \ \vdash \ \operatorname{ParseDeriveContractOpt}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P_{1}))))))\ \Downarrow \ (P_{2},\ \mathsf{contract}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{body}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseItem}(P)\ \Downarrow \ (P_{3},\ \operatorname{DeriveTargetDecl}(\mathsf{name},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \operatorname{SpanBetween}(P,\ P_{3}),\ []))
\end{array}
$$

**(Parse-DeriveContractOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|:"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseDeriveContractOpt}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-DeriveContractOpt-Yes)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|:"})\quad \Gamma \ \vdash \ \operatorname{ParseDeriveClauseList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{clauses}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseDeriveContractOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{clauses})
\end{array}
$$

**(Parse-DeriveClauseList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseDeriveClause}(P)\ \Downarrow \ (P_{1},\ \mathsf{clause})\quad \Gamma \ \vdash \ \operatorname{ParseDeriveClauseTail}(P_{1},\ [\mathsf{clause}])\ \Downarrow \ (P_{2},\ \mathsf{clauses}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseDeriveClauseList}(P)\ \Downarrow \ (P_{2},\ \mathsf{clauses})
\end{array}
$$

**(Parse-DeriveClause-Requires)**

$$
\begin{array}{l}
\operatorname{FixedIdentTok}(\operatorname{Tok}(P),\ \texttt{requires})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{name}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseDeriveClause}(P)\ \Downarrow \ (P_{1},\ \langle \texttt{requires},\ \mathsf{name}\rangle )
\end{array}
$$

**(Parse-DeriveClause-Emits)**

$$
\begin{array}{l}
\operatorname{FixedIdentTok}(\operatorname{Tok}(P),\ \texttt{emits})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{name}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseDeriveClause}(P)\ \Downarrow \ (P_{1},\ \langle \texttt{emits},\ \mathsf{name}\rangle )
\end{array}
$$

**(Parse-DeriveClauseTail-End)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseDeriveClauseTail}(P,\ \mathsf{xs})\ \Downarrow \ (P,\ \mathsf{xs})
\end{array}
$$

**(Parse-DeriveClauseTail-Comma)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParseDeriveClause}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{clause})\quad \Gamma \ \vdash \ \operatorname{ParseDeriveClauseTail}(P_{1},\ \mathsf{xs}\ \mathbin{++} \ [\mathsf{clause}])\ \Downarrow \ (P_{2},\ \mathsf{ys}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseDeriveClauseTail}(P,\ \mathsf{xs})\ \Downarrow \ (P_{2},\ \mathsf{ys})
\end{array}
$$

### 22.5.3 AST Representation / Form

DeriveTargetDecl(name, contract_opt, body, span, doc)

$$
\begin{array}{l}
\operatorname{DeriveReqs}(\mathsf{dt})\ =\ \{\ C\ \mid \ \texttt{requires}\ C\ \in \ \operatorname{contract_opt}(\mathsf{dt})\ \} \\[0.16em]
\operatorname{DeriveEmits}(\mathsf{dt})\ =\ \{\ C\ \mid \ \texttt{emits}\ C\ \in \ \operatorname{contract_opt}(\mathsf{dt})\ \}
\end{array}
$$

DeriveRequest(ty_decl, name) exists when `#derive(name)` is attached to `ty_decl`.

$$
\begin{array}{l}
\operatorname{DeriveAnnotated}(D)\ \Leftrightarrow \ \exists \ \mathsf{name}.\ \operatorname{DeriveRequest}(D,\ \mathsf{name}) \\[0.16em]
\mathsf{DeriveExecJudg}\ =\ \{\mathsf{DeriveGraph},\ \mathsf{DeriveOrder},\ \mathsf{RunDeriveTarget},\ \mathsf{RunDeriveSet}\} \\[0.16em]
\operatorname{DeriveEdge}(\mathsf{req}_{i},\ \mathsf{req}_{j})\ \Leftrightarrow \ \operatorname{DeriveReqs}(\mathsf{req}_{i}.\mathsf{target})\ \cap \ \operatorname{DeriveEmits}(\mathsf{req}_{j}.\mathsf{target})\ \ne \ \emptyset  \\[0.16em]
\operatorname{DeriveGraph}(D)\ =\ \langle V,\ E\rangle \ \mathsf{where}\ V\ =\ [\mathsf{req}\ \mid \ \mathsf{req}\ =\ \operatorname{DeriveRequest}(D,\ \mathsf{name})]\ \mathsf{and}\ E\ =\ \{\langle v_{i},\ v_{j}\rangle \ \mid \ \operatorname{DeriveEdge}(v_{i},\ v_{j})\} \\[0.16em]
\operatorname{DeriveOrder}(D)\ =\ \mathsf{order}\ \mathsf{iff}\ \operatorname{StableTopologicalOrder}(\operatorname{DeriveGraph}(D),\ [\mathsf{name}\ \mid \ \texttt{\#derive(name)}\ \mathsf{occurs}\ \mathsf{on}\ \texttt{D}\ \mathsf{in}\ \mathsf{source}\ \mathsf{order}])\ =\ \mathsf{order} \\[0.16em]
\operatorname{StableTopologicalOrder}(\langle V,\ E\rangle ,\ \mathsf{seed})\ =\ \mathsf{order}\ \mathsf{iff}\ \texttt{order}\ \mathsf{is}\ a\ \mathsf{topological}\ \mathsf{ordering}\ \mathsf{of}\ \texttt{<V, E>}\ \mathsf{and}\ \mathsf{any}\ \mathsf{two}\ \mathsf{incomparable}\ \mathsf{vertices}\ \mathsf{preserve}\ \mathsf{their}\ \mathsf{relative}\ \mathsf{order}\ \mathsf{from}\ \texttt{seed}. \\[0.16em]
\operatorname{TargetTypeOf}(D)\ =\ \operatorname{TypePath}(\operatorname{ItemPath}(D)) \\[0.16em]
\operatorname{VisibleDeriveTarget}(\mathsf{name},\ \mathsf{site})\ =\ \mathsf{dt}\ \mathsf{iff}\ \texttt{dt}\ \mathsf{is}\ \mathsf{the}\ \mathsf{unique}\ \mathsf{visible}\ \texttt{DeriveTargetDecl(name, \_, \_, \_, \_)}\ \mathsf{at}\ \texttt{site}\ \mathsf{under}\ \mathsf{the}\ \mathsf{ordinary}\ \mathsf{item}-\mathsf{visibility}\ \mathsf{rules}. \\[0.16em]
\operatorname{DeclaredImplNames}(D)\ =\ \{\ \mathsf{name}\ \mid \ \exists \ \mathsf{prefix}.\ \mathsf{prefix}\ \mathbin{++} \ [\mathsf{name}]\ \in \ \operatorname{Implements}(D)\ \}
\end{array}
$$

### 22.5.4 Static Semantics

`#derive(... )` is valid only on `record`, `enum`, and `modal` declarations.

Every derive target name in `#derive(... )` MUST resolve to exactly one `derive target` declaration visible at the annotated declaration.

Within the body of a derive target declaration, the following bindings are available:
- `target : Type`
- `emitter : TypeEmitter`
- `introspect : Introspect`
- `diagnostics : ComptimeDiagnostics`

The body of a derive target declaration executes under the same restrictions as any other compile-time procedure body.

For one annotated type declaration `D`, derive execution order is the topological order of the graph:
- vertices: all `DeriveRequest(D, name)`
- edge `name_i -> name_j` when `DeriveReqs(name_i) ∩ DeriveEmits(name_j) ≠ ∅`

If multiple derive targets are incomparable in that graph, source order in `#derive(... )` is the tie-breaker.

Before executing derive target `name` for type `D`, every class in `DeriveReqs(name)` MUST belong to `DeclaredImplNames(D)`.

Before executing derive target `name` for type `D`, every class in `DeriveEmits(name)` MUST belong to `DeclaredImplNames(D)`.

`requires` and `emits` participate only in derive ordering and validation against the annotated declaration's explicit `implements` list. They do not add or remove class implementations for `D`.

### 22.5.5 Dynamic Semantics

`DeriveTargetDecl` is a compile-time-only item. It is visible to later derive lookup in the same Phase 2 module order and MUST NOT survive into the expanded Phase 3 module set.

**(CtExpandItem-DeriveTargetDecl)**

$$
\begin{array}{l}
\mathsf{dt}\ =\ \operatorname{DeriveTargetDecl}(\_,\ \_,\ \_,\ \_,\ \_) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtExpandItem}(\Xi ,\ \Phi ,\ \mathsf{dt})\ \Downarrow \ (\langle [],\ []\rangle ,\ \Xi ,\ \Phi )
\end{array}
$$

**(RunDeriveSet-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RunDeriveSet}(D,\ [],\ \Xi ,\ \Phi )\ \Downarrow \ ([],\ \Xi ,\ \Phi )
\end{array}
$$

**(RunDeriveSet-Cons)**

$$
\begin{array}{l}
\operatorname{VisibleDeriveTarget}(\mathsf{name},\ \operatorname{CtSiteOf}(\Xi ))\ =\ \mathsf{dt}\quad \Gamma \ \vdash \ \operatorname{RunDeriveTarget}(D,\ \mathsf{dt},\ \Xi ,\ \Phi_{0} )\ \Downarrow \ (\mathsf{items}_{0},\ \Xi_{1} ,\ \Phi_{1} )\quad \Gamma \ \vdash \ \operatorname{RunDeriveSet}(D,\ \mathsf{rest},\ \Xi_{1} ,\ \Phi_{1} )\ \Downarrow \ (\mathsf{items}_{1},\ \Xi_{2} ,\ \Phi_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RunDeriveSet}(D,\ [\mathsf{name}]\ \mathbin{++} \ \mathsf{rest},\ \Xi ,\ \Phi_{0} )\ \Downarrow \ (\mathsf{items}_{0}\ \mathbin{++} \ \mathsf{items}_{1},\ \Xi_{2} ,\ \Phi_{2} )
\end{array}
$$

**(RunDeriveTarget)**

$$
\begin{array}{l}
\mathsf{dt}\ =\ \operatorname{DeriveTargetDecl}(\mathsf{name},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\quad \Xi_{0} \ =\ \operatorname{BindDeriveTargetInputs}(\Xi ,\ D)\quad \Gamma \ \vdash \ \operatorname{CtExec}(\Xi_{0} ,\ \Phi_{0} ,\ \mathsf{body})\ \Downarrow \ (\Xi_{1} ,\ \Phi_{1} )\quad \mathsf{items}\ =\ \operatorname{CtPendingEmits}(\Phi_{1} )\quad \Phi_{2} \ =\ \langle \operatorname{CtFiles}(\Phi_{1} ),\ \operatorname{CtProjectRoot}(\Phi_{1} ),\ \operatorname{CtDiags}(\Phi_{1} ),\ [],\ \operatorname{CtFreshSeed}(\Phi_{1} )\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RunDeriveTarget}(D,\ \mathsf{dt},\ \Xi ,\ \Phi_{0} )\ \Downarrow \ (\mathsf{items},\ \Xi_{1} ,\ \Phi_{2} )
\end{array}
$$

$$
\operatorname{BindDeriveTargetInputs}(\Xi ,\ D)\ =\ \Xi '\ \mathsf{iff}\ \texttt{Xi'}\ \mathsf{extends}\ \texttt{Xi}\ \mathsf{with}\ \mathsf{the}\ \mathsf{fixed}\ \mathsf{compile}-\mathsf{time}\ \mathsf{bindings}\ \mathsf{required}\ \mathsf{by}\ \S 22.5.4\ \mathsf{for}\ \mathsf{one}\ \mathsf{derive}-\mathsf{target}\ \mathsf{execution}\ \mathsf{over}\ \texttt{D}:\ \texttt{target = CtType(TargetTypeOf(D))},\ \mathsf{plus}\ \mathsf{the}\ \texttt{TypeEmitter},\ \texttt{Introspect},\ \mathsf{and}\ \texttt{ComptimeDiagnostics}\ \mathsf{capability}\ \mathsf{bindings}\ \mathsf{visible}\ \mathsf{in}\ \mathsf{derive}-\mathsf{target}\ \mathsf{bodies}.
$$

**(CtExpandItem-DeriveAnnotatedDecl)**

$$
\begin{array}{l}
\operatorname{DeriveAnnotated}(D)\quad \operatorname{DeriveOrder}(D)\ =\ [\mathsf{name}_{1},\ \ldots ,\ \mathsf{name}_{n}]\quad \Gamma \ \vdash \ \operatorname{RunDeriveSet}(D,\ [\mathsf{name}_{1},\ \ldots ,\ \mathsf{name}_{n}],\ \Xi ,\ \Phi_{0} )\ \Downarrow \ (\mathsf{emits},\ \Xi_{1} ,\ \Phi_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtExpandItem}(\Xi ,\ \Phi_{0} ,\ D)\ \Downarrow \ (\langle [D],\ \mathsf{emits}\rangle ,\ \Xi_{1} ,\ \Phi_{1} )
\end{array}
$$

Each derive target executes exactly once per annotated declaration, immediately after the annotated declaration has been introduced and before any later source item in the same module is executed.

If a derive target signals `diagnostics.error`, panics, or emits ill-formed declarations, Phase 2 fails and compilation is rejected.

### 22.5.6 Lowering

Derive targets introduce no runtime dispatch or metadata. Their only lowering consequence is the presence of the declarations emitted during Phase 2.

### 22.5.7 Diagnostics

Diagnostics for derive targets and derive contracts are defined by §22.6.
