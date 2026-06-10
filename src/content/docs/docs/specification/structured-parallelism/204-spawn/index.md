---
title: "20.4 Spawn"
description: "20.4 Spawn from 20. Structured Parallelism of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "structured-parallelism"
specSection: "204-spawn"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/structured-parallelism/">20. Structured Parallelism</a>
  <span>Structured Parallelism</span>
</div>

## 20.4 Spawn

### 20.4.1 Syntax

```text
spawn_expr         ::= "spawn" spawn_option_list? block
spawn_option_list  ::= "[" spawn_option ("," spawn_option)* "]"
spawn_option       ::= "name" ":" string_literal
                     | "affinity" ":" expression
                     | "priority" ":" expression
```

### 20.4.2 Parsing

**(Parse-SpawnOpt-Name)**

$$
\begin{array}{l}
\operatorname{IsCtxIdent}(\operatorname{Tok}(P),\ \texttt{"name"})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{":"})\quad \operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))).\mathsf{kind}\ =\ \mathsf{StringLiteral}\quad s\ =\ \operatorname{StringValue}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P)))) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseSpawnOpt}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P))),\ \operatorname{Name}(s))
\end{array}
$$

**(Parse-SpawnOpt-Affinity)**

$$
\begin{array}{l}
\operatorname{IsCtxIdent}(\operatorname{Tok}(P),\ \texttt{"affinity"})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseSpawnOpt}(P)\ \Downarrow \ (P_{1},\ \operatorname{Affinity}(e))
\end{array}
$$

**(Parse-SpawnOpt-Priority)**

$$
\begin{array}{l}
\operatorname{IsCtxIdent}(\operatorname{Tok}(P),\ \texttt{"priority"})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseSpawnOpt}(P)\ \Downarrow \ (P_{1},\ \operatorname{Priority}(e))
\end{array}
$$

**(Parse-Spawn-Expr)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{"spawn"})\quad \Gamma \ \vdash \ \operatorname{ParseOptListOpt}(\mathsf{ParseSpawnOpt},\ \operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{opts})\quad \Gamma \ \vdash \ \operatorname{ParseBlockExpr}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{body}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimaryExpr}(P)\ \Downarrow \ (P_{2},\ \operatorname{SpawnExpr}(\mathsf{opts},\ \mathsf{body}))
\end{array}
$$

The option-list rules instantiate the shared schema of §5.5 with `El = ParseSpawnOpt`.

### 20.4.3 AST Representation / Form

$$
\mathsf{SpawnOpt}\ =\ \{\operatorname{Name}(\mathsf{str}),\ \operatorname{Affinity}(\mathsf{expr}),\ \operatorname{Priority}(\mathsf{expr})\}
$$

$$
\mathsf{SpawnOpts}\ =\ [\mathsf{SpawnOpt}]
$$

$$
\mathsf{Expr}\ =\ \ldots \ \mid \ \operatorname{SpawnExpr}(\mathsf{opts},\ \mathsf{body})\ \mid \ \ldots
$$

$$
\mathsf{ResolveSpawnOptJudg}\ =\ \{\mathsf{ResolveSpawnOpt},\ \mathsf{ResolveSpawnOpts}\}
$$

$$
\operatorname{SpawnOptExprs}([])\ =\ []
$$

$$
\operatorname{SpawnOptExprs}(\operatorname{Name}(\_)\ \mathbin{::} \ \mathsf{os})\ =\ \operatorname{SpawnOptExprs}(\mathsf{os})
$$

$$
\operatorname{SpawnOptExprs}(\operatorname{Affinity}(e)\ \mathbin{::} \ \mathsf{os})\ =\ [e]\ \mathbin{++} \ \operatorname{SpawnOptExprs}(\mathsf{os})
$$

$$
\operatorname{SpawnOptExprs}(\operatorname{Priority}(e)\ \mathbin{::} \ \mathsf{os})\ =\ [e]\ \mathbin{++} \ \operatorname{SpawnOptExprs}(\mathsf{os})
$$

$$
\operatorname{States}(\texttt{Spawned})\ =\ \{\ \texttt{@Pending},\ \texttt{@Ready}\ \}
$$

See §13.1.4 for the built-in `Spawned<T>` modal declaration, state set, payload, and type registration.

### 20.4.4 Static Semantics

$$
\operatorname{SpawnOptOk}(\operatorname{Name}(\_))\ \Leftrightarrow \ \mathsf{true}
$$

$$
\operatorname{SpawnOptOk}(\operatorname{Affinity}(e))\ \Leftrightarrow \ \Gamma \ \vdash \ e\ :\ \operatorname{TypePath}([\texttt{"CpuSet"}])
$$

$$
\operatorname{SpawnOptOk}(\operatorname{Priority}(e))\ \Leftrightarrow \ \Gamma \ \vdash \ e\ :\ \operatorname{TypePath}([\texttt{"Priority"}])
$$

$$
\operatorname{SpawnOptsOk}(\mathsf{opts})\ \Leftrightarrow \ \forall \ \mathsf{opt}\ \in \ \mathsf{opts}.\ \operatorname{SpawnOptOk}(\mathsf{opt})
$$

An enclosing `parallel_context` is required. The enclosing-context diagnostic is owned by §20.1.7.

**(T-Spawn)**

$$
\begin{array}{l}
\Gamma [\mathsf{parallel}_{\mathsf{context}}]\ =\ D\quad \operatorname{SpawnOptsOk}(\mathsf{opts})\quad \Gamma_{\mathsf{capture}} \ \vdash \ e\ :\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \texttt{spawn}\ \mathsf{opts}\ \{e\}\ :\ \mathsf{Spawned}\langle T\rangle
\end{array}
$$

### 20.4.5 Dynamic Semantics

$$
\mathsf{SpawnHandle}\ =\ \{\mathsf{id}\ :\ \mathbb{N} ,\ \mathsf{state}\ :\ \mathsf{Pending}\ \mid \ \operatorname{Ready}(\mathsf{Value})\ \mid \ \operatorname{Failed}(\mathsf{Panic})\}
$$

$$
\operatorname{CapturedEnv}(e,\ \sigma )\ =\ \{\ x\ \mapsto \ \operatorname{LookupVal}(\sigma ,\ x)\ \mid \ x\ \in \ \operatorname{FreeVars}(e)\ \}
$$

$$
\operatorname{EnqueueWork}(\mathsf{pstate},\ w,\ \mathsf{opts})\ \Downarrow \ \mathsf{pstate}'\ \Leftrightarrow \ \mathsf{pstate}'\ =\ \mathsf{pstate}[\mathsf{Handles}\ :=\ \mathsf{pstate}.\mathsf{Handles}\ \mathbin{++} \ [\operatorname{SpawnedVal}(@\mathsf{Pending},\ w.\mathsf{id})]]\ \mathsf{and}\ \mathsf{work}\ \mathsf{item}\ \texttt{w}\ \mathsf{is}\ \mathsf{submitted}\ \mathsf{to}\ \texttt{pstate.Domain}\ \mathsf{subject}\ \mathsf{to}\ \texttt{opts}
$$

Evaluation of `spawn [opts] { e }`:

1. Capture free variables per §20.3.
2. Package the captured environment and body into a work item.
3. If `affinity` is present, restrict worker selection to CPU indices whose bits are set in the `CpuSet` mask; if the set is empty, use the domain default.
4. If `priority` is present, assign the task the given `Priority`. When multiple tasks are ready, workers MUST select any task of maximal priority among those ready.
5. Enqueue the work item.
6. Return `Spawned<T>@Pending` immediately.

**(EvalSigma-Spawn)**

$$
\begin{array}{l}
\Gamma [\mathsf{parallel}_{\mathsf{context}}]\ =\ \mathsf{pstate}\quad \mathsf{caps}\ =\ \operatorname{CapturedEnv}(e,\ \sigma )\quad w\ =\ \{\mathsf{id}:\ \operatorname{NextWorkId}(\mathsf{pstate}),\ \mathsf{expr}:\ e,\ \mathsf{captures}:\ \mathsf{caps},\ \mathsf{status}:\ \mathsf{Pending}\}\quad \operatorname{EnqueueWork}(\mathsf{pstate},\ w,\ \mathsf{opts})\ \Downarrow \ \mathsf{pstate}'\quad \mathsf{handle}\ =\ \operatorname{SpawnedVal}(@\mathsf{Pending},\ w.\mathsf{id}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{SpawnExpr}(\mathsf{opts},\ e),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{handle}),\ \sigma [\mathsf{parallel}_{\mathsf{context}}\ \mapsto \ \mathsf{pstate}'])
\end{array}
$$

Result retrieval for `Spawned<T>` handles is defined by §21.2.

### 20.4.6 Lowering

**(Lower-Expr-Spawn)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerBlock}(e)\ \Downarrow \ \langle \mathsf{IR}_{b},\ v_{b}\rangle \quad \mathsf{caps}\ =\ \operatorname{CaptureSet}(e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{SpawnExpr}(\mathsf{opts},\ e))\ \Downarrow \ \langle \operatorname{SeqIR}(\operatorname{TaskCreate}(\mathsf{caps},\ \mathsf{opts},\ \mathsf{IR}_{b}),\ \mathsf{TaskEnqueue}),\ \mathsf{SpawnHandleVal}\rangle
\end{array}
$$

### 20.4.7 Diagnostics

| Code         | Severity | Detection    | Condition                    |
| ------------ | -------- | ------------ | ---------------------------- |
| `E-CON-0130` | Error    | Compile-time | Invalid spawn attribute type |
