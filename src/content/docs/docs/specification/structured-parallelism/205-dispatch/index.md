---
title: "20.5 Dispatch"
description: "20.5 Dispatch from 20. Structured Parallelism of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "structured-parallelism"
specSection: "205-dispatch"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/structured-parallelism/">20. Structured Parallelism</a>
  <span>Structured Parallelism</span>
</div>

## 20.5 Dispatch

### 20.5.1 Syntax

```text
dispatch_expr         ::= "dispatch" pattern "in" range_expression key_clause? dispatch_option_list? block
key_clause            ::= "key" key_path_expr key_mode
key_mode              ::= "read" | "write"
dispatch_option_list  ::= "[" dispatch_option ("," dispatch_option)* "]"
dispatch_option       ::= "reduce" ":" reduce_op
                        | "ordered"
                        | "chunk" ":" expression
                        | "workgroup" ":" dim3_const
reduce_op             ::= "+" | "*" | "min" | "max" | "and" | "or" | identifier
```

### 20.5.2 Parsing

Dispatch parsing is defined by the following source rules:

- `Parse-Dispatch-Expr`
- `Parse-KeyClauseOpt-None`
- `Parse-KeyClauseOpt-Yes`
- `Parse-DispatchOptsOpt-None`
- `Parse-DispatchOptsOpt-Yes`
- `Parse-DispatchOptList-Empty`
- `Parse-DispatchOptList-Cons`
- `Parse-DispatchOptListTail-End`
- `Parse-DispatchOptListTail-TrailingComma`
- `Parse-DispatchOptListTail-Comma`
- `Parse-ReduceOp-Op`
- `Parse-ReduceOp-Ident`
- `Parse-DispatchOpt-Reduce`
- `Parse-DispatchOpt-Ordered`
- `Parse-DispatchOpt-Chunk`
- `Parse-DispatchOpt-Workgroup`

The fixed identifiers `min`, `max`, `and`, and `or` are tokenized as identifiers by Chapter 4 and are accepted in dispatch position by `Parse-ReduceOp-Ident`.

### 20.5.3 AST Representation / Form

$$
\mathsf{ReduceOp}\ =\ \{\texttt{+},\ \texttt{*},\ \texttt{min},\ \texttt{max},\ \texttt{and},\ \texttt{or}\}\ \cup \ \mathsf{Identifier}
$$

$$
\mathsf{DispatchOpt}\ =\ \{\operatorname{Reduce}(\mathsf{op}),\ \mathsf{Ordered},\ \operatorname{Chunk}(\mathsf{expr}),\ \operatorname{Workgroup}(\mathsf{dim3})\}\quad \mathsf{op}\ \in \ \mathsf{ReduceOp}
$$

$$
\mathsf{DispatchOpts}\ =\ [\mathsf{DispatchOpt}]
$$

$$
\mathsf{KeyClause}\ =\ \langle \mathsf{path},\ \mathsf{mode}\rangle 
$$

$$
\mathsf{KeyClauseOpt}\ =\ \{\bot \}\ \cup \ \mathsf{KeyClause}
$$

$$
\mathsf{Expr}\ =\ \ldots \ \mid \ \operatorname{DispatchExpr}(\mathsf{pat},\ \mathsf{range},\ \mathsf{key}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{opts},\ \mathsf{body})\ \mid \ \ldots 
$$

$$
\mathsf{ResolveKeyClauseJudg}\ =\ \{\mathsf{ResolveKeyClauseOpt}\}
$$

$$
\mathsf{ResolveDispatchOptJudg}\ =\ \{\mathsf{ResolveDispatchOpt},\ \mathsf{ResolveDispatchOpts}\}
$$

$$
\operatorname{DispatchOptExprs}([])\ =\ []
$$

$$
\operatorname{DispatchOptExprs}(\operatorname{Reduce}(\_)\ \mathbin{::} \ \mathsf{os})\ =\ \operatorname{DispatchOptExprs}(\mathsf{os})
$$

$$
\operatorname{DispatchOptExprs}(\mathsf{Ordered}\ \mathbin{::} \ \mathsf{os})\ =\ \operatorname{DispatchOptExprs}(\mathsf{os})
$$

$$
\operatorname{DispatchOptExprs}(\operatorname{Chunk}(e)\ \mathbin{::} \ \mathsf{os})\ =\ [e]\ \mathbin{++} \ \operatorname{DispatchOptExprs}(\mathsf{os})
$$

$$
\operatorname{DispatchOptExprs}(\operatorname{Workgroup}(e)\ \mathbin{::} \ \mathsf{os})\ =\ [e]\ \mathbin{++} \ \operatorname{DispatchOptExprs}(\mathsf{os})
$$

$$
\mathsf{DispatchAccess}\ =\ \langle \mathsf{schema},\ \mathsf{mode}\rangle \quad \mathsf{mode}\ \in \ \{\mathsf{Read},\ \mathsf{Write}\}
$$

$$
\mathsf{DispatchAccessSet}\ =\ [\mathsf{DispatchAccess}]
$$

### 20.5.4 Static Semantics

An enclosing `parallel_context` is required. The enclosing-context diagnostics are owned by §§20.1.7 and 20.5.7.

**(T-Dispatch)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \mathsf{range}\ :\ \mathsf{Range}<I>\quad \Gamma ,\ i\ :\ I\ \vdash \ B\ :\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \texttt{dispatch}\ i\ \texttt{in range}\ \{B\}\ :\ ()
\end{array}
$$

**(T-Dispatch-Reduce)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \mathsf{range}\ :\ \mathsf{Range}<I>\quad \Gamma ,\ i\ :\ I\ \vdash \ B\ :\ T\quad \Gamma \ \vdash \ \mathsf{op}\ :\ (T,\ T)\ \to \ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \texttt{dispatch}\ i\ \texttt{in range [reduce: op]}\ \{B\}\ :\ T
\end{array}
$$

**(T-GPU-Dispatch)**

$$
\begin{array}{l}
\operatorname{GpuContext}(\Gamma )\quad \Gamma \ \vdash \ \mathsf{range}\ :\ \mathsf{Range}<I>\quad \Gamma ,\ i\ :\ I\ \vdash \ B\ :\ T\quad \mathsf{topology}\ =\ \operatorname{ComputeTopologyDispatch}(\operatorname{RangeBounds}(\mathsf{range}),\ \mathsf{opts})\quad \operatorname{TopologyValid}(\mathsf{topology})\quad \forall \ x\ \in \ \operatorname{FreeVars}(B).\ \operatorname{GpuCaptureOk}(\Gamma ,\ x,\ \Gamma [x].\mathsf{type}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DispatchExpr}(i,\ \mathsf{range},\ \bot ,\ \mathsf{opts},\ B)\ :\ ()
\end{array}
$$

**(T-GPU-Dispatch-Reduce)**

$$
\begin{array}{l}
\operatorname{GpuContext}(\Gamma )\quad \Gamma \ \vdash \ \mathsf{range}\ :\ \mathsf{Range}<I>\quad \Gamma ,\ i\ :\ I\ \vdash \ B\ :\ T\quad \Gamma \ \vdash \ \mathsf{op}\ :\ (T,\ T)\ \to \ T\quad \operatorname{GpuSafeType}(T)\quad \mathsf{topology}\ =\ \operatorname{ComputeTopologyDispatch}(\operatorname{RangeBounds}(\mathsf{range}),\ \mathsf{opts})\quad \operatorname{TopologyValid}(\mathsf{topology})\quad \forall \ x\ \in \ \operatorname{FreeVars}(B).\ \operatorname{GpuCaptureOk}(\Gamma ,\ x,\ \Gamma [x].\mathsf{type}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DispatchExpr}(i,\ \mathsf{range},\ \operatorname{Reduce}(\mathsf{op}),\ \mathsf{opts},\ B)\ :\ T
\end{array}
$$

$$
\operatorname{DispatchPatternVars}(\mathsf{pat})\ =\ \operatorname{PatNames}(\mathsf{pat})
$$

$$
\operatorname{PathRootVar}(\mathsf{expr})\ =\ x\ \Leftrightarrow \ \operatorname{KeyPath}(\mathsf{expr})\ \mathsf{is}\ \mathsf{rooted}\ \mathsf{at}\ \mathsf{binding}\ \texttt{x}
$$

$$
\operatorname{DispatchInvariant}(\mathsf{expr},\ \mathsf{pat})\ \Leftrightarrow \ \operatorname{FreeVars}(\mathsf{expr})\ \setminus \ \{\operatorname{PathRootVar}(\mathsf{expr})\}\ \subseteq \ \operatorname{DispatchPatternVars}(\mathsf{pat})\ \cup \ \{\ x\ \mid \ x\ \in \ \operatorname{dom}(\Gamma )\ \land \ \Gamma [x]\ =\ \operatorname{TypePerm}(\texttt{const},\ \_)\ \}
$$

$$
\operatorname{InsideKeyBlock}(B,\ e)\ \Leftrightarrow \ \exists \ K.\ K\ \mathsf{is}\ a\ \mathsf{key}\ \mathsf{block}\ \mathsf{in}\ \texttt{B}\ \mathsf{and}\ \texttt{e}\ \mathsf{is}\ a\ \mathsf{proper}\ \mathsf{subexpression}\ \mathsf{of}\ \texttt{K.body}
$$

$$
\begin{array}{l}
\operatorname{ImplicitDispatchUse}(B,\ e)\ \Leftrightarrow  \\[0.16em]
\ e\ \in \ \operatorname{Subexpressions}(B)\ \land  \\[0.16em]
\ \lnot \operatorname{InsideKeyBlock}(B,\ e)\ \land  \\[0.16em]
\ (\exists \ T.\ \Gamma \ \vdash \ e\ :\ \operatorname{TypePerm}(\texttt{shared},\ T)\ \lor \ \Gamma \ \vdash \ e\ :\mathsf{place}\ \operatorname{TypePerm}(\texttt{shared},\ T))\ \land  \\[0.16em]
\ \operatorname{KeyPath}(e)\ \mathsf{is}\ \mathsf{defined}\ \land  \\[0.16em]
\ \operatorname{RequiredMode}(e)\ \mathsf{is}\ \mathsf{defined}
\end{array}
$$

$$
\operatorname{SchemaOf}(\mathsf{pat},\ e)\ =\ S\ \Leftrightarrow \ S\ \mathsf{is}\ \texttt{KeyPath(e)}\ \mathsf{with}\ \mathsf{occurrences}\ \mathsf{of}\ \mathsf{bindings}\ \mathsf{in}\ \texttt{DispatchPatternVars(pat)}\ \mathsf{left}\ \mathsf{symbolic}\ \mathsf{and}\ \mathsf{all}\ \mathsf{other}\ \mathsf{subexpressions}\ \mathsf{preserved}
$$

$$
\operatorname{JoinDispatchMode}(\mathsf{Read},\ \mathsf{Read})\ =\ \mathsf{Read}
$$

$$
\operatorname{JoinDispatchMode}(\_,\ \_)\ =\ \mathsf{Write}
$$

$$
\operatorname{MergeDispatchAccesses}(\mathsf{raw})\ =\ \mathsf{merged}\ \mathsf{where}\ \texttt{merged}\ \mathsf{contains}\ \mathsf{one}\ \mathsf{entry}\ \mathsf{per}\ \mathsf{distinct}\ \mathsf{schema}\ \mathsf{and}\ \mathsf{the}\ \mathsf{mode}\ \mathsf{for}\ \mathsf{each}\ \mathsf{schema}\ \mathsf{is}\ \mathsf{the}\ \mathsf{join}\ \mathsf{of}\ \mathsf{all}\ \mathsf{modes}\ \mathsf{attached}\ \mathsf{to}\ \mathsf{that}\ \mathsf{schema}\ \mathsf{in}\ \texttt{raw}
$$

$$
\begin{array}{l}
\operatorname{InferDispatchAccesses}(\mathsf{pat},\ B)\ =\ \mathsf{merged}\ \Leftrightarrow  \\[0.16em]
\ \mathsf{raw}\ =\ [\langle \operatorname{SchemaOf}(\mathsf{pat},\ e),\ \operatorname{RequiredMode}(e)\rangle \ \mid \ e\ \in \ \operatorname{Subexpressions}(B)\ \land \ \operatorname{ImplicitDispatchUse}(B,\ e)\ \land \ \operatorname{DispatchInvariant}(\operatorname{KeyPath}(e),\ \mathsf{pat})]\ \land  \\[0.16em]
\ \operatorname{MergeDispatchAccesses}(\mathsf{raw})\ =\ \mathsf{merged}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ChunkExpr}(\mathsf{opts})\ =\ e\ \Leftrightarrow \ \operatorname{Chunk}(e)\ \in \ \mathsf{opts} \\[0.16em]
\operatorname{ChunkExpr}(\mathsf{opts})\ =\ \bot \ \Leftrightarrow \ \forall \ o\ \in \ \mathsf{opts}.\ o\ \ne \ \operatorname{Chunk}(\_) \\[0.16em]
\operatorname{AssociativeReduce}(\texttt{+})\ \Leftrightarrow \ \mathsf{true} \\[0.16em]
\operatorname{AssociativeReduce}(\texttt{*})\ \Leftrightarrow \ \mathsf{true} \\[0.16em]
\operatorname{AssociativeReduce}(\texttt{min})\ \Leftrightarrow \ \mathsf{true} \\[0.16em]
\operatorname{AssociativeReduce}(\texttt{max})\ \Leftrightarrow \ \mathsf{true} \\[0.16em]
\operatorname{AssociativeReduce}(\texttt{and})\ \Leftrightarrow \ \mathsf{true} \\[0.16em]
\operatorname{AssociativeReduce}(\texttt{or})\ \Leftrightarrow \ \mathsf{true} \\[0.16em]
\operatorname{AssociativeReduce}(\_)\ \Leftrightarrow \ \mathsf{false} \\[0.16em]
\operatorname{DispatchStaticIndexExpr}(\mathsf{pat},\ e)\ \Leftrightarrow  \\[0.16em]
\ e\ \mathsf{is}\ a\ \mathsf{compile}-\mathsf{time}\ \mathsf{constant}\ \mathsf{expression}\ \lor  \\[0.16em]
\ (e\ =\ x\ \land \ x\ \in \ \operatorname{DispatchPatternVars}(\mathsf{pat}))\ \lor  \\[0.16em]
\ (e\ =\ e_{0}.f\ \land \ \operatorname{DispatchStaticIndexExpr}(\mathsf{pat},\ e_{0}))\ \lor  \\[0.16em]
\ (e\ =\ e_{0}.n\ \land \ \operatorname{DispatchStaticIndexExpr}(\mathsf{pat},\ e_{0}))\ \lor  \\[0.16em]
\ (e\ =\ e_{0}[e_{1}]\ \land \ \operatorname{DispatchStaticIndexExpr}(\mathsf{pat},\ e_{0})\ \land \ \operatorname{DispatchStaticIndexExpr}(\mathsf{pat},\ e_{1}))\ \lor  \\[0.16em]
\ (e\ =\ \mathsf{op}\ e_{0}\ \land \ \operatorname{DispatchStaticIndexExpr}(\mathsf{pat},\ e_{0}))\ \lor  \\[0.16em]
\ (e\ =\ e_{0}\ \mathsf{op}\ e_{1}\ \land \ \operatorname{DispatchStaticIndexExpr}(\mathsf{pat},\ e_{0})\ \land \ \operatorname{DispatchStaticIndexExpr}(\mathsf{pat},\ e_{1}))\ \lor  \\[0.16em]
\ (e\ =\ \operatorname{cast}(e_{0},\ \_)\ \land \ \operatorname{DispatchStaticIndexExpr}(\mathsf{pat},\ e_{0})) \\[0.16em]
\operatorname{DynamicKeyPattern}(\mathsf{pat},\ \mathsf{spec})\ \Leftrightarrow \ \exists \ \langle S,\ \_\rangle \ \in \ \mathsf{spec}.\ S\ \mathsf{contains}\ \mathsf{an}\ \mathsf{index}\ \mathsf{expression}\ e\ \land \ \lnot \ \operatorname{DispatchStaticIndexExpr}(\mathsf{pat},\ e)
\end{array}
$$

**(Dispatch-Infer-Err)**

$$
\begin{array}{l}
e\ \in \ \operatorname{Subexpressions}(B)\quad \operatorname{ImplicitDispatchUse}(B,\ e)\quad \lnot \ \operatorname{DispatchInvariant}(\operatorname{KeyPath}(e),\ \mathsf{pat}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{Reject}
\end{array}
$$

**(Dispatch-Outside-Err)**

$$
\begin{array}{l}
\Gamma [\mathsf{parallel}_{\mathsf{context}}]\ =\ \bot \quad c\ =\ \operatorname{Code}(\mathsf{Dispatch}-\mathsf{Outside}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DispatchExpr}(\mathsf{pat},\ \mathsf{range},\ \mathsf{key}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{opts},\ \mathsf{body})\ \Uparrow \ c
\end{array}
$$

**(Dispatch-Chunk-Type-Err)**

$$
\begin{array}{l}
\operatorname{Chunk}(e)\ \in \ \mathsf{opts}\quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ T\quad T\ \ne \ \operatorname{TypePrim}(\texttt{"usize"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DispatchExpr}(\mathsf{pat},\ \mathsf{range},\ \mathsf{key}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{opts},\ \mathsf{body})\ \Uparrow 
\end{array}
$$

**(Dispatch-Dependency-Err)**

$$
\begin{array}{l}
\operatorname{InferDispatchAccesses}(\mathsf{pat},\ B)\ =\ \mathsf{spec}\quad \exists \ \langle S_{a},\ M_{a}\rangle ,\ \langle S_{b},\ M_{b}\rangle \ \in \ \mathsf{spec}.\ \lnot \ \operatorname{ProvablyDisjointPath}(S_{a},\ S_{b})\ \land \ \lnot \ \operatorname{KeyModeCompatible}(M_{a},\ M_{b})\quad c\ =\ \operatorname{Code}(\mathsf{Dispatch}-\mathsf{Dependency}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DispatchExpr}(\mathsf{pat},\ \mathsf{range},\ \mathsf{key}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{opts},\ \mathsf{body})\ \Uparrow \ c
\end{array}
$$

**(Dispatch-Reduce-Assoc-Err)**

$$
\begin{array}{l}
\operatorname{Reduce}(\mathsf{op})\ \in \ \mathsf{opts}\quad \mathsf{Ordered}\ \notin \ \mathsf{opts}\quad \lnot \ \operatorname{AssociativeReduce}(\mathsf{op})\quad c\ =\ \operatorname{Code}(\mathsf{Dispatch}-\mathsf{Reduce}-\mathsf{Assoc}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DispatchExpr}(\mathsf{pat},\ \mathsf{range},\ \mathsf{key}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{opts},\ \mathsf{body})\ \Uparrow \ c
\end{array}
$$

**(Dispatch-DynamicKey-Warn)**

$$
\begin{array}{l}
\operatorname{DispatchPartitionSpec}(\mathsf{pat},\ \mathsf{key}_{\mathsf{clause}\_\mathsf{opt}},\ B)\ =\ \mathsf{spec}\quad \operatorname{DynamicKeyPattern}(\mathsf{pat},\ \mathsf{spec})\quad w\ =\ \operatorname{Code}(\mathsf{Dispatch}-\mathsf{DynamicKey}-\mathsf{Warn}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{WarnDispatch}(\operatorname{DispatchExpr}(\mathsf{pat},\ \mathsf{range},\ \mathsf{key}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{opts},\ \mathsf{body}))\ \Downarrow \ w
\end{array}
$$

When no explicit `key` clause is present, the implementation MUST infer a dispatch partition summary using `InferDispatchAccesses`.

`dispatch` v `in` r { … a[v] … }

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\forall \ v_{1},\ v_{2}\ \in \ r,\ v_{1}\ \ne \ v_{2}\ \Rightarrow \ \operatorname{ProvablyDisjoint}(a[v_{1}],\ a[v_{2}])
\end{array}
$$

Reduction operators MUST be associative unless `[ordered]` is present.

`chunk: e` is evaluated exactly once before partitioning. `e` MUST have type `usize`. The resulting positive integer partitions each post-key-partition group into contiguous chunks of at most that size.

### 20.5.5 Dynamic Semantics

$$
\operatorname{DispatchPartitionSpec}(\mathsf{pat},\ \mathsf{key}_{\mathsf{clause}},\ B)\ =\ [\langle \operatorname{SchemaOf}(\mathsf{pat},\ \mathsf{key}_{e}),\ \operatorname{ModeOf}(\mathsf{key}_{\mathsf{clause}})\rangle ]\ \Leftrightarrow \ \mathsf{key}_{\mathsf{clause}}\ =\ \texttt{key}\ \mathsf{key}_{e}\ \mathsf{mode}
$$

$$
\operatorname{DispatchPartitionSpec}(\mathsf{pat},\ \bot ,\ B)\ =\ \mathsf{ks}\ \Leftrightarrow \ \operatorname{InferDispatchAccesses}(\mathsf{pat},\ B)\ =\ \mathsf{ks}
$$

$$
\operatorname{InstantiateSchema}(S,\ v)\ =\ P\ \Leftrightarrow \ \texttt{P}\ \mathsf{is}\ \mathsf{obtained}\ \mathsf{by}\ \mathsf{substituting}\ \texttt{v}\ \mathsf{for}\ \mathsf{the}\ \mathsf{dispatch}-\mathsf{pattern}\ \mathsf{bindings}\ \mathsf{in}\ \texttt{S}
$$

IdxNorm(e) is `e` with harmless parentheses and expression attributes removed

$$
e_{1}\ \equiv_{\mathsf{idx}} \ e_{2}\ \Leftrightarrow \ \operatorname{IdxNorm}(e_{1})\ \mathsf{and}\ \operatorname{IdxNorm}(e_{2})\ \mathsf{are}\ \mathsf{syntactically}\ \mathsf{identical}
$$

$$
\begin{array}{l}
\operatorname{AffineDispatchIndex}(e)\ =\ \langle x,\ k\rangle \ \Leftrightarrow  \\[0.16em]
\ (e\ =\ x\ \land \ k\ =\ 0)\ \lor  \\[0.16em]
\ (e\ =\ x\ +\ n\ \land \ n\ \mathsf{is}\ a\ \mathsf{compile}-\mathsf{time}\ \mathsf{constant}\ \mathsf{integer}\ \mathsf{expression}\ \mathsf{with}\ \mathsf{value}\ k)\ \lor  \\[0.16em]
\ (e\ =\ x\ -\ n\ \land \ n\ \mathsf{is}\ a\ \mathsf{compile}-\mathsf{time}\ \mathsf{constant}\ \mathsf{integer}\ \mathsf{expression}\ \mathsf{with}\ \mathsf{value}\ n_{0}\ \land \ k\ =\ -n_{0})\ \lor  \\[0.16em]
\ (e\ =\ n\ +\ x\ \land \ n\ \mathsf{is}\ a\ \mathsf{compile}-\mathsf{time}\ \mathsf{constant}\ \mathsf{integer}\ \mathsf{expression}\ \mathsf{with}\ \mathsf{value}\ k)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ProvablyDisjoint}(e_{1},\ e_{2})\ \Leftrightarrow  \\[0.16em]
\ (e_{1}\ \mathsf{and}\ e_{2}\ \mathsf{are}\ \mathsf{distinct}\ \mathsf{integer}\ \mathsf{literals})\ \lor  \\[0.16em]
\ (\operatorname{AffineDispatchIndex}(e_{1})\ =\ \langle x,\ k_{1}\rangle \ \land \ \operatorname{AffineDispatchIndex}(e_{2})\ =\ \langle x,\ k_{2}\rangle \ \land \ k_{1}\ \ne \ k_{2})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ProvablyDisjointPath}(P,\ Q)\ \Leftrightarrow \ \exists \ k.\ \operatorname{PrefixEqThrough}(P,\ Q,\ k-1)\ \land \ \operatorname{SegmentProvablyDisjoint}(P[k],\ Q[k]) \\[0.16em]
\operatorname{PrefixEqThrough}(P,\ Q,\ 0)\ \Leftrightarrow \ \mathsf{true} \\[0.16em]
\operatorname{PrefixEqThrough}(P,\ Q,\ k)\ \Leftrightarrow \ \forall \ r\ \in \ 1..k.\ \operatorname{SegEqForDispatch}(P[r],\ Q[r])
\end{array}
$$

$$
\operatorname{SegEqForDispatch}(\operatorname{Root}(x),\ \operatorname{Root}(y))\ \Leftrightarrow \ x\ =\ y
$$

$$
\operatorname{SegEqForDispatch}(\operatorname{Field}(\_,\ f),\ \operatorname{Field}(\_,\ g))\ \Leftrightarrow \ f\ =\ g
$$

$$
\operatorname{SegEqForDispatch}(\operatorname{Index}(\_,\ e_{1}),\ \operatorname{Index}(\_,\ e_{2}))\ \Leftrightarrow \ e_{1}\ \equiv_{\mathsf{idx}} \ e_{2}
$$

$$
\operatorname{SegmentProvablyDisjoint}(\operatorname{Root}(x),\ \operatorname{Root}(y))\ \Leftrightarrow \ x\ \ne \ y
$$

$$
\operatorname{SegmentProvablyDisjoint}(\operatorname{Field}(\_,\ f),\ \operatorname{Field}(\_,\ g))\ \Leftrightarrow \ f\ \ne \ g
$$

$$
\operatorname{SegmentProvablyDisjoint}(\operatorname{Index}(\_,\ e_{1}),\ \operatorname{Index}(\_,\ e_{2}))\ \Leftrightarrow \ \operatorname{ProvablyDisjoint}(e_{1},\ e_{2})
$$

$$
\begin{array}{l}
\operatorname{PartitionByKey}(\mathsf{range},\ \mathsf{key}_{\mathsf{spec}})\ =\ [\mathsf{Group}_{1},\ \ldots ,\ \mathsf{Group}_{k}]\ \Leftrightarrow  \\[0.16em]
\ \operatorname{IterBounds}(\mathsf{range})\ =\ (\mathsf{start},\ \mathsf{end})\ \land  \\[0.16em]
\ \mathsf{indices}\ =\ [\mathsf{start},\ \mathsf{start}+1,\ \ldots ,\ \mathsf{end}-1]\ \land  \\[0.16em]
\ \operatorname{Conflict}(i,\ j)\ \Leftrightarrow \ i\ \ne \ j\ \land \ (\exists \ \langle S_{a},\ M_{a}\rangle \ \in \ \mathsf{key}_{\mathsf{spec}},\ \langle S_{b},\ M_{b}\rangle \ \in \ \mathsf{key}_{\mathsf{spec}}.\ P_{i}\ =\ \operatorname{InstantiateSchema}(S_{a},\ i)\ \land \ P_{j}\ =\ \operatorname{InstantiateSchema}(S_{b},\ j)\ \land \ \lnot \ \operatorname{ProvablyDisjointPath}(P_{i},\ P_{j})\ \land \ \lnot \ \operatorname{KeyModeCompatible}(M_{a},\ M_{b}))\ \land  \\[0.16em]
\ \operatorname{ConnectedComponents}(\mathsf{indices},\ \mathsf{Conflict})\ =\ [\mathsf{Group}_{1},\ \ldots ,\ \mathsf{Group}_{k}]\ \land  \\[0.16em]
\ \operatorname{OrderedByLeastMember}([\mathsf{Group}_{1},\ \ldots ,\ \mathsf{Group}_{k}])
\end{array}
$$

$$
\begin{array}{l}
\operatorname{DispatchPartition}(\mathsf{pat},\ \mathsf{range},\ \mathsf{key}_{\mathsf{clause}},\ B)\ =\ [\mathsf{Group}_{1},\ \ldots ,\ \mathsf{Group}_{k}]\ \Leftrightarrow \ \operatorname{DispatchPartitionSpec}(\mathsf{pat},\ \mathsf{key}_{\mathsf{clause}},\ B)\ =\ \mathsf{key}_{\mathsf{spec}}\ \land \ \operatorname{PartitionByKey}(\mathsf{range},\ \mathsf{key}_{\mathsf{spec}})\ =\ [\mathsf{Group}_{1},\ \ldots ,\ \mathsf{Group}_{k}] \\[0.16em]
\operatorname{TotalIterations}([\mathsf{Group}_{1},\ \ldots ,\ \mathsf{Group}_{k}])\ =\ \Sigma \_\{i=1..k\}\ \mid \mathsf{Group}_{i}\mid 
\end{array}
$$

$$
\operatorname{ReduceOpOf}(\mathsf{attrs})\ =\ \mathsf{op}\ \Leftrightarrow \ \operatorname{Reduce}(\mathsf{op})\ \in \ \mathsf{attrs}
$$

$$
\operatorname{ReduceOpOf}(\mathsf{attrs})\ =\ \bot \ \Leftrightarrow \ \forall \ a\ \in \ \mathsf{attrs}.\ a\ \ne \ \operatorname{Reduce}(\_)
$$

$$
\begin{array}{l}
\operatorname{ChunkSizeOf}(\mathsf{attrs},\ \sigma )\ \Downarrow \ (n,\ \sigma ')\ \Leftrightarrow \ \operatorname{ChunkExpr}(\mathsf{attrs})\ =\ \bot \ \land \ n\ =\ 1\ \land \ \sigma '\ =\ \sigma  \\[0.16em]
\operatorname{ChunkSizeOf}(\mathsf{attrs},\ \sigma )\ \Downarrow \ (n,\ \sigma_{1} )\ \Leftrightarrow \ \operatorname{ChunkExpr}(\mathsf{attrs})\ =\ e\ \land \ \Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{IntVal}(\texttt{"usize"},\ n)),\ \sigma_{1} )\ \land \ n\ >\ 0
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ContiguousChunks}([],\ n)\ =\ [] \\[0.16em]
\operatorname{ContiguousChunks}([i_{1},\ \ldots ,\ i_{k}],\ n)\ =\ [[i_{1},\ \ldots ,\ i_{m}]]\ \mathbin{++} \ \operatorname{ContiguousChunks}([i\_\{m+1\},\ \ldots ,\ i_{k}],\ n)\ \mathsf{where}\ m\ =\ \operatorname{min}(n,\ k) \\[0.16em]
\operatorname{ChunkGroups}(\mathsf{groups},\ n)\ =\ \operatorname{concat}([\operatorname{ContiguousChunks}(G,\ n)\ \mid \ G\ \in \ \mathsf{groups}])
\end{array}
$$

**(EvalSigma-Dispatch)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{range},\ \sigma )\ \Downarrow \ (\operatorname{Val}(r),\ \sigma_{1} )\quad \operatorname{ChunkSizeOf}(\mathsf{attrs},\ \sigma_{1} )\ \Downarrow \ (n,\ \sigma_{2} )\quad \operatorname{DispatchPartition}(\mathsf{pat},\ r,\ \mathsf{key}_{\mathsf{opt}},\ B)\ =\ \mathsf{groups}_{0}\quad \mathsf{groups}\ =\ \operatorname{ChunkGroups}(\mathsf{groups}_{0},\ n)\quad \operatorname{ReduceOpOf}(\mathsf{attrs})\ =\ \mathsf{reduce}_{\mathsf{opt}}\quad \Gamma \ \vdash \ \operatorname{DispatchRun}(\mathsf{pat},\ B,\ \mathsf{groups},\ \mathsf{reduce}_{\mathsf{opt}},\ \sigma_{2} )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{DispatchExpr}(\mathsf{pat},\ \mathsf{range},\ \mathsf{key}_{\mathsf{opt}},\ \mathsf{attrs},\ B),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} )
\end{array}
$$

**(EvalSigma-Dispatch-Range-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{range},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{DispatchExpr}(\mathsf{pat},\ \mathsf{range},\ \mathsf{key}_{\mathsf{opt}},\ \mathsf{attrs},\ B),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Dispatch-Chunk-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{range},\ \sigma )\ \Downarrow \ (\operatorname{Val}(r),\ \sigma_{1} )\quad \operatorname{ChunkExpr}(\mathsf{attrs})\ =\ e\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{DispatchExpr}(\mathsf{pat},\ \mathsf{range},\ \mathsf{key}_{\mathsf{opt}},\ \mathsf{attrs},\ B),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} )
\end{array}
$$

$$
\operatorname{DispatchRun}(\mathsf{pat},\ B,\ \mathsf{groups},\ \bot ,\ \sigma )\ \Downarrow \ (\operatorname{Val}(()),\ \sigma ')\ \Leftrightarrow \ \mathsf{all}\ \mathsf{groups}\ \mathsf{execute}\ \mathsf{to}\ \mathsf{completion}\ \mathsf{without}\ \mathsf{panic}\ \mathsf{and}\ \mathsf{every}\ \mathsf{iteration}\ \mathsf{result}\ \mathsf{is}\ \mathsf{discarded}
$$

$$
\operatorname{DispatchRun}(\mathsf{pat},\ B,\ \mathsf{groups},\ \mathsf{op},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma ')\ \Leftrightarrow \ \mathsf{all}\ \mathsf{groups}\ \mathsf{execute}\ \mathsf{to}\ \mathsf{completion}\ \mathsf{without}\ \mathsf{panic}\ \mathsf{and}\ \texttt{v}\ \mathsf{is}\ \mathsf{the}\ \mathsf{deterministic}\ \mathsf{reduction}\ \mathsf{of}\ \mathsf{all}\ \mathsf{iteration}\ \mathsf{results}\ \mathsf{under}\ \texttt{op}
$$

$$
\operatorname{DispatchRun}(\mathsf{pat},\ B,\ \mathsf{groups},\ \mathsf{reduce}_{\mathsf{opt}},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma ')\ \Leftrightarrow \ \mathsf{some}\ \mathsf{iteration}\ \mathsf{panics}\ \mathsf{and}\ \mathsf{all}\ \mathsf{started}\ \mathsf{iterations}\ \mathsf{settle}\ \mathsf{before}\ \mathsf{panic}\ \mathsf{propagation}
$$

$$
\operatorname{DispatchRun}(\mathsf{pat},\ B,\ \mathsf{groups},\ \mathsf{op},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma )\ \Leftrightarrow \ \mathsf{op}\ \ne \ \bot \ \land \ \operatorname{TotalIterations}(\mathsf{groups})\ =\ 0
$$

### 20.5.6 Lowering

**(Lower-Expr-Dispatch)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(\mathsf{range})\ \Downarrow \ \langle \mathsf{IR}_{r},\ v_{r}\rangle \quad \mathsf{key}_{\mathsf{spec}}\ =\ \operatorname{DispatchPartitionSpec}(\mathsf{pat},\ \mathsf{key}_{\mathsf{opt}},\ \mathsf{body})\quad \Gamma \ \vdash \ \operatorname{LowerBlock}(\mathsf{body})\ \Downarrow \ \langle \mathsf{IR}_{b},\ v_{b}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{DispatchExpr}(\mathsf{pat},\ \mathsf{range},\ \mathsf{key}_{\mathsf{opt}},\ \mathsf{attrs},\ \mathsf{body}))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{r},\ \operatorname{DispatchPartition}(\mathsf{key}_{\mathsf{spec}},\ \mathsf{attrs}),\ \operatorname{DispatchReduce}(\mathsf{attrs},\ \mathsf{IR}_{b}),\ \mathsf{ParallelJoin}),\ \mathsf{DispatchResultVal}\rangle 
\end{array}
$$

### 20.5.7 Diagnostics

| Code         | Severity | Detection    | Condition                                     |
| ------------ | -------- | ------------ | --------------------------------------------- |
| `E-CON-0140` | Error    | Compile-time | Dispatch outside parallel block               |
| `E-CON-0141` | Error    | Compile-time | Key inference failed; explicit key required   |
| `E-CON-0142` | Error    | Compile-time | Cross-iteration dependency detected           |
| `E-CON-0143` | Error    | Compile-time | Non-associative reduction without `[ordered]` |
| `W-CON-0140` | Warning  | Compile-time | Dynamic key pattern; runtime serialization    |
