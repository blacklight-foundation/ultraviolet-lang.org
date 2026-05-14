---
title: "14.2 Generic Procedures and Types"
description: "14.2 Generic Procedures and Types from 14. Abstraction and Polymorphism of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "abstraction-and-polymorphism"
specSection: "142-generic-procedures-and-types"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/abstraction-and-polymorphism/">14. Abstraction and Polymorphism</a>
  <span>Abstraction and Polymorphism</span>
</div>

## 14.2 Generic Procedures and Types

### 14.2.1 Syntax

```text
generic_procedure ::= "procedure" identifier generic_params? signature predicate_clause? contract_clause? block
generic_call      ::= callee generic_args "(" arg_list? ")"
generic_type_use  ::= type_path generic_args
```

Generic parameters and predicate clauses also appear on nominal type declarations and type aliases in their owning chapters.

### 14.2.2 Parsing

Generic declaration parsing is delegated to the owning declaration forms, each of which invokes `ParseGenericParamsOpt` and `ParsePredicateClauseOpt` before its body-specific parser.

$$
\operatorname{CallTypeArgsStart}(P)\ \Leftrightarrow \ \operatorname{TypeArgsStartTok}(\operatorname{Tok}(P))\ \land \ (\Gamma \ \vdash \ \operatorname{ParseGenericArgs}(P)\ \Downarrow \ (P_{1},\ \mathsf{args}))\ \land \ \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"("})
$$

**(Postfix-Call-TypeArgs)**

$$
\begin{array}{l}
\operatorname{CallTypeArgsStart}(P)\quad \Gamma \ \vdash \ \operatorname{ParseGenericArgs}(P)\ \Downarrow \ (P_{1},\ \mathsf{targs})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseArgList}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{args})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{")"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PostfixStep}(P,\ e)\ \Downarrow \ (\operatorname{Advance}(P_{2}),\ \operatorname{CallTypeArgs}(e,\ \mathsf{targs},\ \mathsf{args}))
\end{array}
$$

### 14.2.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{ProcedureDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{return}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}\rangle  \\[0.16em]
\mathsf{RecordDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{implements},\ \mathsf{members},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}\rangle  \\[0.16em]
\mathsf{EnumDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{implements},\ \mathsf{variants},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}\rangle  \\[0.16em]
\mathsf{ModalDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{implements},\ \mathsf{states},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}\rangle  \\[0.16em]
\mathsf{ClassDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{modal},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{supers},\ \mathsf{items},\ \mathsf{span},\ \mathsf{doc}\rangle  \\[0.16em]
\mathsf{TypeAliasDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{type},\ \mathsf{span},\ \mathsf{doc}\rangle 
\end{array}
$$

$$
\begin{array}{l}
\mathsf{Type}\ =\ \operatorname{TypeApply}(\mathsf{path},\ \mathsf{args})\ \mid \ \ldots  \\[0.16em]
\mathsf{TypeApply}\ =\ \langle \mathsf{path},\ \mathsf{args}\rangle  \\[0.16em]
\mathsf{Expr}\ =\ \operatorname{CallTypeArgs}(\mathsf{callee},\ \mathsf{type}_{\mathsf{args}},\ \mathsf{args})\ \mid \ \ldots 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{TypeParamsOf}(p)\ =\ \mathsf{params}_{\mathsf{gen}} \\[0.16em]
\operatorname{TypePredicateClauseOf}(p)\ =\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}
\end{array}
$$

### 14.2.4 Static Semantics

**(WF-Generic-Proc)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \langle P_{1},\ \ldots ,\ P_{n}\rangle \ \mathsf{wf}\quad \Gamma '\ =\ \Gamma ,\ T_{1}\ :\ P_{1},\ \ldots ,\ T_{n}\ :\ P_{n}\quad \Gamma '\ \vdash \ \mathsf{signature}\ \mathsf{wf}\quad \Gamma '\ \vdash \ \mathsf{body}\ \mathsf{wf} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \texttt{procedure}\ f\langle P_{1},\ \ldots ,\ P_{n}\rangle (\ldots )\ \to \ R\ \{\ldots \}\ \mathsf{wf}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{GenericCalleeProc}(\operatorname{Identifier}(f))\ =\ \mathsf{proc}\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{ResolveValueName}(f)\ \Downarrow \ \mathsf{ent}\ \land \ \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ \mathsf{mp}\ \land \ f'\ =\ (\mathsf{ent}.\mathsf{target}_{\mathsf{opt}}\ \mathsf{if}\ \mathsf{present},\ \mathsf{else}\ f)\ \land \ \operatorname{DeclOf}(\mathsf{mp},\ f')\ =\ \mathsf{proc}\ \land \ \mathsf{proc}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \land \ \operatorname{TypeParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\ \ne \ [] \\[0.16em]
\operatorname{GenericCalleeProc}(\operatorname{Path}(\mathsf{path},\ \mathsf{name}))\ =\ \mathsf{proc}\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{ResolveQualified}(\mathsf{path},\ \mathsf{name},\ \mathsf{ValueKind})\ \Downarrow \ \mathsf{ent}\ \land \ \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ \mathsf{mp}\ \land \ \mathsf{name}'\ =\ (\mathsf{ent}.\mathsf{target}_{\mathsf{opt}}\ \mathsf{if}\ \mathsf{present},\ \mathsf{else}\ \mathsf{name})\ \land \ \operatorname{DeclOf}(\mathsf{mp},\ \mathsf{name}')\ =\ \mathsf{proc}\ \land \ \mathsf{proc}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \land \ \operatorname{TypeParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\ \ne \ []
\end{array}
$$
GenericCalleeProc(callee) undefined otherwise

$$
\begin{array}{l}
\operatorname{FreshTypeArgs}([P_{1},\ \ldots ,\ P_{n}])\ =\ [\operatorname{TVar}(\alpha_{1} ),\ \ldots ,\ \operatorname{TVar}(\alpha_{n} )]\quad \mathsf{where}\ \alpha_{1} ,\ \ldots ,\ \alpha_{n} \ \mathsf{are}\ \mathsf{pairwise}\ \mathsf{distinct}\ \mathsf{and}\ \mathsf{fresh} \\[0.16em]
\operatorname{SolvedType}(T)\ \Leftrightarrow \ \operatorname{TVars}(T)\ =\ \emptyset 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{InferTypeArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{raw}_{\mathsf{args}})\ =\ \mathsf{args}'\ \Leftrightarrow \ \mathsf{params}_{\mathsf{gen}}\ =\ [P_{1},\ \ldots ,\ P_{n}]\ \land \ \mathsf{raw}_{\mathsf{args}}\ =\ [R_{1},\ \ldots ,\ R_{n}]\ \land  \\[0.16em]
\ (\forall \ i\ \in \ 1..n. \\[0.16em]
\quad ((\operatorname{SolvedType}(R_{i})\ \land \ A_{i}\ =\ R_{i})\ \lor  \\[0.16em]
\quad (\lnot \operatorname{SolvedType}(R_{i})\ \land \ P_{i}.\mathsf{default}_{\mathsf{opt}}\ =\ D_{i}\ \land \ A_{i}\ =\ \operatorname{TypeSubst}([A_{1}/P_{1}.\mathsf{name},\ \ldots ,\ A\_\{i-1\}/P\_\{i-1\}.\mathsf{name}],\ D_{i}))))\ \land  \\[0.16em]
\ \mathsf{args}'\ =\ [A_{1},\ \ldots ,\ A_{n}]
\end{array}
$$

$$
\operatorname{InferTypeArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{raw}_{\mathsf{args}})\ =\ \bot \ \Leftrightarrow \ \lnot \ \exists \ \mathsf{args}'.\ \operatorname{InferTypeArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{raw}_{\mathsf{args}})\ =\ \mathsf{args}'
$$

**(GenericCallInference)**

$$
\begin{array}{l}
\operatorname{GenericCalleeProc}(\mathsf{callee})\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \_,\ \_,\ \_,\ \_) \\[0.16em]
\mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \mathsf{params}_{\mathsf{gen}}\ =\ [P_{1},\ \ldots ,\ P_{n}] \\[0.16em]
\operatorname{FreshTypeArgs}(\mathsf{params}_{\mathsf{gen}})\ =\ [X_{1},\ \ldots ,\ X_{n}] \\[0.16em]
\theta_{\mathsf{var}} \ =\ [X_{1}/P_{1}.\mathsf{name},\ \ldots ,\ X_{n}/P_{n}.\mathsf{name}] \\[0.16em]
\mathsf{params}_{i}\ =\ [\langle \mathsf{mode}_{j},\ \operatorname{TypeSubst}(\theta_{\mathsf{var}} ,\ T_{j})\rangle \ \mid \ \langle \mathsf{mode}_{j},\ x_{j},\ T_{j}\rangle \ \in \ \mathsf{params}] \\[0.16em]
R_{i}\ =\ \operatorname{TypeSubst}(\theta_{\mathsf{var}} ,\ \operatorname{ProcReturn}(\mathsf{ret}_{\mathsf{opt}}))
\end{array}
$$
|params_i| = |args|

$$
\begin{array}{l}
C_{\mathsf{args}}\ =\ \{(\operatorname{ArgType}(\mathsf{params}_{i}[j],\ \mathsf{args}[j]),\ \operatorname{ParamType}(\mathsf{params}_{i}[j]))\ \mid \ j\ \in \ 1..\mid \mathsf{args}\mid \} \\[0.16em]
C_{\mathsf{ret}}\ =\ \{(R_{i},\ T_{\mathsf{exp}})\}\quad \mathsf{if}\ T_{\mathsf{exp}\_\mathsf{opt}}\ =\ T_{\mathsf{exp}} \\[0.16em]
\quad \emptyset \quad \mathsf{otherwise} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Solve}(C_{\mathsf{args}}\ \cup \ C_{\mathsf{ret}})\ \Downarrow \ \theta_{s}  \\[0.16em]
\mathsf{raw}_{\mathsf{args}}\ =\ [\theta_{s} (X_{1}),\ \ldots ,\ \theta_{s} (X_{n})] \\[0.16em]
\operatorname{InferTypeArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{raw}_{\mathsf{args}})\ =\ [A_{1},\ \ldots ,\ A_{n}] \\[0.16em]
\theta \ =\ [A_{1}/P_{1}.\mathsf{name},\ \ldots ,\ A_{n}/P_{n}.\mathsf{name}] \\[0.16em]
\forall \ i\ \in \ 1..n.\ \Gamma \ \vdash \ A_{i}\ \mathsf{satisfies}\ \operatorname{Bounds}(P_{i}) \\[0.16em]
\Gamma \ \vdash \ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}[\theta ]\ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{GenericCallInference}(\mathsf{callee},\ \mathsf{args},\ T_{\mathsf{exp}\_\mathsf{opt}})\ \Downarrow \ [A_{1},\ \ldots ,\ A_{n}]
\end{array}
$$

**(T-Generic-Call)**

$$
\begin{array}{l}
\operatorname{GenericCalleeProc}(\mathsf{callee})\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \_,\ \_,\ \_,\ \_) \\[0.16em]
\mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \mathsf{params}_{\mathsf{gen}}\ =\ [P_{1},\ \ldots ,\ P_{n}] \\[0.16em]
\operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ [A_{1},\ \ldots ,\ A_{k}])\ =\ [A_{1}',\ \ldots ,\ A_{n}'] \\[0.16em]
\theta \ =\ [A_{1}'/P_{1}.\mathsf{name},\ \ldots ,\ A_{n}'/P_{n}.\mathsf{name}] \\[0.16em]
\mathsf{params}\_\theta \ =\ [\langle \mathsf{mode}_{j},\ \operatorname{TypeSubst}(\theta ,\ T_{j})\rangle \ \mid \ \langle \mathsf{mode}_{j},\ x_{j},\ T_{j}\rangle \ \in \ \mathsf{params}] \\[0.16em]
\forall \ i\ \in \ 1..n.\ \Gamma \ \vdash \ A_{i}'\ \mathsf{satisfies}\ \operatorname{Bounds}(P_{i}) \\[0.16em]
\Gamma \ \vdash \ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}}[\theta ]\ \mathsf{ok} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk_T}(\mathsf{params}\_\theta ,\ \mathsf{args}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{CallTypeArgs}(\mathsf{callee},\ [A_{1},\ \ldots ,\ A_{k}],\ \mathsf{args})\ :\ \operatorname{ProcReturn}(\mathsf{ret}_{\mathsf{opt}})[\theta ]
\end{array}
$$

**(Generic-Call-ArgCount-Err)**

$$
\begin{array}{l}
\operatorname{GenericCalleeProc}(\mathsf{callee})\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ [A_{1},\ \ldots ,\ A_{k}])\ =\ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{CallTypeArgs}(\mathsf{callee},\ [A_{1},\ \ldots ,\ A_{k}],\ \mathsf{args})\ \Uparrow 
\end{array}
$$

**(WF-Path-Generic-Err)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad p\ \in \ \operatorname{dom}(\Sigma .\mathsf{Types})\quad \operatorname{TypeParamsOf}(p)\ \ne \ [] \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}\ \Uparrow 
\end{array}
$$

**(WF-Apply)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeApply}(p,\ \mathsf{args})\quad p\ \in \ \operatorname{dom}(\Sigma .\mathsf{Types})\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOf}(p)\quad \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{args})\ =\ \mathsf{args}'\quad \theta \ =\ [\mathsf{args}'\_i\ /\ \mathsf{params}_{\mathsf{gen}}[i].\mathsf{name}]\quad \forall \ i,\ \Gamma \ \vdash \ \mathsf{args}'\_i\ \mathsf{wf}\quad \forall \ i,\ \Gamma \ \vdash \ \mathsf{args}'\_i\ \mathsf{satisfies}\ \operatorname{Bounds}(\mathsf{params}_{\mathsf{gen}}[i])\quad \Gamma \ \vdash \ \operatorname{TypePredicateClauseOf}(p)[\theta ]\ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}
\end{array}
$$

**(WF-Apply-ArgCount-Err)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeApply}(p,\ \mathsf{args})\quad p\ \in \ \operatorname{dom}(\Sigma .\mathsf{Types})\quad \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOf}(p)\quad \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{args})\ =\ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}\ \Uparrow 
\end{array}
$$

Type arguments MAY be omitted at generic procedure call sites only when `GenericCallInference` succeeds. A well-typed omitted-type-argument call is elaborated to `CallTypeArgs(callee, inferred_args, args)` before the §14.2.5 monomorphic-call elaboration. Class methods with generic parameter lists are not vtable-eligible and therefore MUST NOT be invoked through dynamic class objects.

### 14.2.5 Dynamic Semantics

`CallTypeArgs` is elaborated to a monomorphic `Call` after substitution. `TypeApply(path, args)` denotes the specialized declaration obtained by applying the elaborated substitution to the generic declaration named by `path`.

Distinct monomorphic instantiations are distinct declarations and distinct layouts.

### 14.2.6 Lowering

Monomorphization produces a specialized declaration `D[A_1/T_1, …, A_n/T_n]` for each concrete instantiation.

Lowering requirements:

1. Calls to generic procedures lower to direct static calls to the specialized instantiation.
2. Each distinct instantiation lowers independently.
3. Implementations MUST reject infinite monomorphization recursion.
4. The maximum instantiation depth is 128.

For instantiated nominal types, `sizeof` and `alignof` are those of the substituted body.

### 14.2.7 Diagnostics

Diagnostics are defined for missing or excess type arguments, omitted-type-argument inference failures, use of a generic nominal declaration without required arguments, generic-call substitution failures, unsatisfied bounds or predicate clauses after substitution, and infinite monomorphization recursion.
