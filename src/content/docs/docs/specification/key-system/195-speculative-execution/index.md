---
title: "19.5 Speculative Execution"
description: "19.5 Speculative Execution from 19. Key System of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "key-system"
specSection: "195-speculative-execution"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/key-system/">19. Key System</a>
  <span>Key System</span>
</div>

## 19.5 Speculative Execution

### 19.5.1 Syntax

```text
speculative_block ::= "#" key_path_list "speculative" "write" block_expr
```

### 19.5.2 Parsing

Speculative blocks use the key-block parser in §19.2.2 together with `Parse-KeyBlockMod-Speculative` and `Parse-KeyMode-Write`.

### 19.5.3 AST Representation / Form

Speculative execution is represented by `KeyBlockStmt(attrs_opt, paths, mods, mode_opt, body, span)` with `Speculative ∈ mods`.

$$
\mathsf{ReadSet}\ =\ \wp (\mathsf{Path}\ \times \ \mathsf{Value})
$$

$$
\mathsf{WriteSet}\ =\ \wp (\mathsf{Path}\ \times \ \mathsf{Value})
$$

$$
\begin{array}{l}
\mathsf{SpecState}\ =\ \{ \\[0.16em]
\ \operatorname{SpecStart}(\mathsf{paths},\ \mathsf{body},\ \sigma ), \\[0.16em]
\ \operatorname{SpecSnapshot}(\mathsf{paths},\ \mathsf{body},\ R,\ \sigma ), \\[0.16em]
\ \operatorname{SpecExec}(\mathsf{body},\ R,\ W,\ \sigma ), \\[0.16em]
\ \operatorname{SpecCommit}(R,\ W,\ v,\ \sigma ), \\[0.16em]
\ \operatorname{SpecRetry}(\mathsf{paths},\ \mathsf{body},\ n,\ \sigma ), \\[0.16em]
\ \operatorname{SpecFallback}(\mathsf{paths},\ \mathsf{body},\ \sigma ), \\[0.16em]
\ \operatorname{SpecDone}(v,\ \sigma ), \\[0.16em]
\ \operatorname{SpecPanic}(\sigma ) \\[0.16em]
\}
\end{array}
$$

### 19.5.4 Static Semantics

**(K-Spec-Write-Required)**

$$
\begin{array}{l}
\#P\ \texttt{speculative}\ M\ \{B\}\quad M\ \ne \ \texttt{write} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{Reject}
\end{array}
$$

**(K-Spec-Pure-Body)**

$$
\begin{array}{l}
\#P\ \texttt{speculative write}\ \{B\}\quad \operatorname{Writes}(B)\ \nsubseteq \ \operatorname{CoveredPaths}(P) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{Reject}
\end{array}
$$

Permitted operations:

1. Read from keyed paths.
2. Write to keyed paths.
3. Pure computation.
4. Calls to `const` receiver procedures on keyed data.

Prohibited operations:

1. Write to paths outside the keyed set.
2. Nested key blocks.
3. `wait` expressions.
4. Procedure calls with side effects.
5. `defer` statements.
6. Memory-ordering annotations and fence operations.

`IsCallLike(c)` holds for `CallExpr` and `MethodCallExpr`.

**(K-Spec-No-Nested-Key)**

$$
\begin{array}{l}
\#P\ \texttt{speculative write}\ \{B\}\quad \#Q\ \_\ \{\ldots \}\ \in \ \operatorname{Subexpressions}(B) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{Reject}
\end{array}
$$

**(K-Spec-No-Impure-Call)**

$$
\begin{array}{l}
\#P\ \texttt{speculative write}\ \{B\}\quad \exists \ c\ \in \ \operatorname{Subexpressions}(B).\ \operatorname{IsCallLike}(c)\ \land \ \lnot (\Gamma \ \vdash \ c\ \mathsf{pure})\quad c_{\mathsf{err}}\ =\ \operatorname{Code}(K-\mathsf{Spec}-\mathsf{No}-\mathsf{Impure}-\mathsf{Call}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
G\ \vdash \ \operatorname{KeyBlockStmt}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{paths},\ \mathsf{mods},\ \mathsf{mode}_{\mathsf{opt}},\ B,\ \mathsf{span})\ \Uparrow \ c_{\mathsf{err}}
\end{array}
$$

**(K-Spec-No-Memory-Ordering)**

$$
\begin{array}{l}
\#P\ \texttt{speculative write}\ \{B\}\quad \exists \ x\ \in \ \operatorname{Subexpressions}(B).\ (\operatorname{IsMemoryOrderAnnotation}(x)\ \lor \ \operatorname{IsFenceExpr}(x)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{Reject}
\end{array}
$$

**(K-Spec-No-Wait)**

$$
\begin{array}{l}
\#P\ \texttt{speculative write}\ \{B\}\quad \operatorname{WaitExpr}(\_)\ \in \ \operatorname{Subexpressions}(B)\quad c\ =\ \operatorname{Code}(K-\mathsf{Spec}-\mathsf{No}-\mathsf{Wait}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{KeyBlockStmt}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{paths},\ \mathsf{mods},\ \mathsf{mode}_{\mathsf{opt}},\ B,\ \mathsf{span})\ \Uparrow \ c
\end{array}
$$

**(K-Spec-No-Defer)**

$$
\begin{array}{l}
\#P\ \texttt{speculative write}\ \{B\}\quad \operatorname{DeferStmt}(\_)\ \in \ \operatorname{SubStatements}(B)\quad c\ =\ \operatorname{Code}(K-\mathsf{Spec}-\mathsf{No}-\mathsf{Defer}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{KeyBlockStmt}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{paths},\ \mathsf{mods},\ \mathsf{mode}_{\mathsf{opt}},\ B,\ \mathsf{span})\ \Uparrow \ c
\end{array}
$$

**(K-Spec-No-Release)**

$$
\begin{array}{l}
\mathsf{Speculative}\ \in \ \mathsf{mods}\quad \mathsf{Release}\ \in \ \mathsf{mods}\quad c\ =\ \operatorname{Code}(K-\mathsf{Spec}-\mathsf{No}-\mathsf{Release}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{KeyBlockStmt}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{paths},\ \mathsf{mods},\ \mathsf{mode}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span})\ \Uparrow \ c
\end{array}
$$

### 19.5.5 Dynamic Semantics

**Entry Rule**

**(ExecSigma-KeyBlock-Speculative)**

$$
\begin{array}{l}
\mathsf{Speculative}\ \in \ \mathsf{mods}\quad \mathsf{retries}\ =\ 0 \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{KeyBlockStmt}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{paths},\ \mathsf{mods},\ \mathsf{mode}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span}),\ \sigma )\ \Downarrow \ \operatorname{SpecLoop}(\mathsf{paths},\ \mathsf{mods},\ \mathsf{mode}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{retries},\ \sigma )
\end{array}
$$

$$
\begin{array}{l}
\operatorname{SpecLoop}(\mathsf{paths},\ \mathsf{mods},\ \mathsf{mode}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{retries},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\ \Leftrightarrow  \\[0.16em]
\ R\ =\ \operatorname{SnapshotKeyedPaths}(\mathsf{paths},\ \sigma )\ \land  \\[0.16em]
\ \Gamma \ \vdash \ \operatorname{EvalBlockSigma}(\mathsf{body},\ \sigma )\ \Downarrow \ (\mathsf{out}_{\mathsf{body}},\ \sigma_{1} )\ \land  \\[0.16em]
\ W\ =\ \operatorname{CollectWrites}(\sigma ,\ \sigma_{1} )\ \land  \\[0.16em]
\ (\operatorname{SpeculativeCommit}(R,\ W)\ \Rightarrow \ \mathsf{out}\ =\ \mathsf{out}_{\mathsf{body}}\ \land \ \sigma '\ =\ \operatorname{ApplyWrites}(\sigma ,\ W))\ \land  \\[0.16em]
\ (\lnot \operatorname{SpeculativeCommit}(R,\ W)\ \land \ \mathsf{retries}\ <\ \mathsf{MAX}_{\mathsf{SPECULATIVE}\_\mathsf{RETRIES}}\ \Rightarrow \ \operatorname{SpecLoop}(\mathsf{paths},\ \mathsf{mods},\ \mathsf{mode}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{retries}\ +\ 1,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma '))\ \land  \\[0.16em]
\ (\lnot \operatorname{SpeculativeCommit}(R,\ W)\ \land \ \mathsf{retries}\ =\ \mathsf{MAX}_{\mathsf{SPECULATIVE}\_\mathsf{RETRIES}}\ \Rightarrow \ \Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{KeyBlockStmt}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{paths},\ \mathsf{mods}\ \setminus \ \{\mathsf{Speculative}\},\ \mathsf{mode}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma '))
\end{array}
$$

**State Machine**

**(Spec-Start)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{SpecStart}(\mathsf{paths},\ \mathsf{body},\ \sigma )\rangle \ \to \ \langle \operatorname{SpecSnapshot}(\mathsf{paths},\ \mathsf{body},\ \emptyset ,\ \sigma )\rangle 
\end{array}
$$

**(Spec-Snapshot)**

$$
\begin{array}{l}
\forall \ p\ \in \ \mathsf{paths}.\ \operatorname{ReadPath}(\sigma ,\ p)\ =\ v_{p}\quad R\ =\ \{(p,\ v_{p})\ \mid \ p\ \in \ \mathsf{paths}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{SpecSnapshot}(\mathsf{paths},\ \mathsf{body},\ \emptyset ,\ \sigma )\rangle \ \to \ \langle \operatorname{SpecExec}(\mathsf{body},\ R,\ \emptyset ,\ \sigma )\rangle 
\end{array}
$$

**(Spec-Exec-Ok)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSpeculative}(\mathsf{body},\ \sigma ,\ R)\ \Downarrow \ (\operatorname{Val}(v),\ W,\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{SpecExec}(\mathsf{body},\ R,\ \emptyset ,\ \sigma )\rangle \ \to \ \langle \operatorname{SpecCommit}(R,\ W,\ v,\ \sigma ')\rangle 
\end{array}
$$

**(Spec-Exec-Panic)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSpeculative}(\mathsf{body},\ \sigma ,\ R)\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ W,\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{SpecExec}(\mathsf{body},\ R,\ \emptyset ,\ \sigma )\rangle \ \to \ \langle \operatorname{SpecPanic}(\sigma ')\rangle 
\end{array}
$$

**(Spec-Commit-Success)**

$$
\begin{array}{l}
\forall \ (p,\ v)\ \in \ R.\ \operatorname{ReadPath}(\sigma ,\ p)\ =\ v\quad \operatorname{ApplyWrites}(\sigma ,\ W)\ =\ \sigma ' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{SpecCommit}(R,\ W,\ v,\ \sigma )\rangle \ \to \ \langle \operatorname{SpecDone}(v,\ \sigma ')\rangle 
\end{array}
$$

**(Spec-Commit-Fail-Retry)**

$$
\begin{array}{l}
\exists \ (p,\ v)\ \in \ R.\ \operatorname{ReadPath}(\sigma ,\ p)\ \ne \ v\quad n\ <\ \mathsf{MAX}_{\mathsf{SPECULATIVE}\_\mathsf{RETRIES}} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{SpecCommit}(R,\ W,\ v,\ \sigma )\rangle \ \to \ \langle \operatorname{SpecRetry}(\operatorname{paths}(R),\ \mathsf{body},\ n\ +\ 1,\ \sigma )\rangle 
\end{array}
$$

**(Spec-Commit-Fail-Fallback)**

$$
\begin{array}{l}
\exists \ (p,\ v)\ \in \ R.\ \operatorname{ReadPath}(\sigma ,\ p)\ \ne \ v\quad n\ \ge \ \mathsf{MAX}_{\mathsf{SPECULATIVE}\_\mathsf{RETRIES}} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{SpecCommit}(R,\ W,\ v,\ \sigma )\rangle \ \to \ \langle \operatorname{SpecFallback}(\operatorname{paths}(R),\ \mathsf{body},\ \sigma )\rangle 
\end{array}
$$

**(Spec-Retry)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{SpecRetry}(\mathsf{paths},\ \mathsf{body},\ n,\ \sigma )\rangle \ \to \ \langle \operatorname{SpecSnapshot}(\mathsf{paths},\ \mathsf{body},\ \emptyset ,\ \sigma )\rangle 
\end{array}
$$

**(Spec-Fallback)**

$$
\begin{array}{l}
\operatorname{AcquireKey}(\sigma ,\ \mathsf{paths},\ \mathsf{Write})\ =\ \sigma_{k} \quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{body},\ \sigma_{k} )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma ')\quad \operatorname{ReleaseKey}(\sigma ',\ \mathsf{paths})\ =\ \sigma '' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{SpecFallback}(\mathsf{paths},\ \mathsf{body},\ \sigma )\rangle \ \to \ \langle \operatorname{SpecDone}(v,\ \sigma '')\rangle 
\end{array}
$$

**(SpecBlock-Ok)**

$$
\begin{array}{l}
\langle \operatorname{SpecStart}(\mathsf{paths},\ \mathsf{body},\ \sigma )\rangle \ \to *\ \langle \operatorname{SpecDone}(v,\ \sigma ')\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSpecBlock}(\mathsf{paths},\ \mathsf{body},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma ')
\end{array}
$$

**(SpecBlock-Panic)**

$$
\begin{array}{l}
\langle \operatorname{SpecStart}(\mathsf{paths},\ \mathsf{body},\ \sigma )\rangle \ \to *\ \langle \operatorname{SpecPanic}(\sigma ')\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSpecBlock}(\mathsf{paths},\ \mathsf{body},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma ')
\end{array}
$$

$$
\operatorname{ReadPath}(\sigma ,\ p)\ =\ v\ \Leftrightarrow \ \mathsf{evaluate}\ \mathsf{path}\ \mathsf{expression}\ \texttt{p}\ \mathsf{in}\ \mathsf{state}\ \texttt{sigma},\ \mathsf{returning}\ \texttt{v}.
$$

$$
\operatorname{ApplyWrites}(\sigma ,\ W)\ =\ \sigma '\ \Leftrightarrow \ \mathsf{atomically}\ \mathsf{apply}\ \mathsf{all}\ \texttt{(p, v) in W}\ \mathsf{to}\ \texttt{sigma}.
$$

$$
\operatorname{paths}(R)\ =\ \{p\ \mid \ (p,\ \_)\ \in \ R\}
$$

$$
\operatorname{EvalSpeculative}(\mathsf{body},\ \sigma ,\ R)\ \Downarrow \ (\mathsf{out},\ W,\ \sigma ')\ \mathsf{intercepts}\ \mathsf{writes}\ \mathsf{to}\ \mathsf{paths}\ \mathsf{in}\ \texttt{paths(R)}\ \mathsf{and}\ \mathsf{collects}\ \mathsf{them}\ \mathsf{in}\ \texttt{W}\ \mathsf{instead}\ \mathsf{of}\ \mathsf{applying}\ \mathsf{them}\ \mathsf{to}\ \texttt{sigma}.
$$

$$
\texttt{MAX\_SPECULATIVE\_RETRIES = 8}.
$$

If a panic occurs during speculative execution, the write set is discarded and the panic propagates.

The snapshot step MUST be observationally equivalent to an atomic snapshot over the keyed set. The commit step MUST be atomic with respect to other key operations on overlapping paths and MUST satisfy `SpeculativeCommit(R, W)`.

The state machine above is an abstract dynamic semantics.

An implementation MAY conservatively realize `# ... speculative write { ... }` by directly selecting the fallback execution path, provided the resulting observable behavior is the same as some execution admitted by the abstract semantics. Such an implementation need not materialize successful speculative commit states at runtime.

### 19.5.6 Lowering

$$
\mathsf{SpeculativeIR}\ =\ \{\operatorname{SpecSnapshotIR}(\mathsf{paths}),\ \operatorname{SpecValidateIR}(\mathsf{paths}),\ \operatorname{SpecCommitIR}(\mathsf{paths}),\ \mathsf{SpecRetryIR},\ \mathsf{SpecFallbackIR}\}
$$

**(Lower-Stmt-KeyBlock-Speculative)**

$$
\begin{array}{l}
\mathsf{Speculative}\ \in \ \mathsf{mods}\quad \Gamma \ \vdash \ \operatorname{LowerKeyPaths}(\mathsf{paths})\ \Downarrow \ \mathsf{Ps}\quad \mathsf{sorted}\ =\ \operatorname{CanonicalSort}(\mathsf{Ps})\quad \Gamma \ \vdash \ \operatorname{LowerBlock}(\mathsf{body})\ \Downarrow \ \langle \mathsf{IR}_{b},\ v_{b}\rangle  \\[0.16em]
\mathsf{IR}_{\mathsf{fallback}}\ =\ \operatorname{SeqIR}(\operatorname{SeqIRList}([\operatorname{SeqIR}(\operatorname{CheckConflict}(P_{i},\ \mathsf{Write}),\ \operatorname{AcquireKey}(P_{i},\ \mathsf{Write},\ \mathsf{CurrentScope}))\ \mid \ P_{i}\ \in \ \mathsf{sorted}]),\ \mathsf{IR}_{b},\ \operatorname{SeqIRList}([\operatorname{ReleaseKey}(P_{i},\ \mathsf{CurrentScope})\ \mid \ P_{i}\ \in \ \operatorname{Reverse}(\mathsf{sorted})])) \\[0.16em]
\mathsf{IR}\ =\ \operatorname{SpecLoopIR}(\operatorname{SpecSnapshotIR}(\mathsf{sorted}),\ \mathsf{IR}_{b},\ \operatorname{SpecValidateIR}(\mathsf{sorted}),\ \operatorname{SpecCommitIR}(\mathsf{sorted}),\ \mathsf{SpecRetryIR},\ \operatorname{SpecFallbackIR}(\mathsf{IR}_{\mathsf{fallback}})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{KeyBlockStmt}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{paths},\ \mathsf{mods},\ \mathsf{mode}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span}))\ \Downarrow \ \mathsf{IR}
\end{array}
$$

### 19.5.7 Diagnostics

| Code         | Severity | Detection    | Condition                                                              |
| ------------ | -------- | ------------ | ---------------------------------------------------------------------- |
| `E-CON-0090` | Error    | Compile-time | Nested key block inside speculative block                              |
| `E-CON-0091` | Error    | Compile-time | Write to path outside keyed set in speculative block                   |
| `E-CON-0092` | Error    | Compile-time | `wait` expression inside speculative block                             |
| `E-CON-0093` | Error    | Compile-time | `defer` statement inside speculative block                             |
| `E-CON-0094` | Error    | Compile-time | `speculative` combined with `release`                                  |
| `E-CON-0095` | Error    | Compile-time | `speculative` without `write` modifier                                 |
| `E-CON-0096` | Error    | Compile-time | Memory ordering annotation or fence operation inside speculative block |
| `E-CON-0097` | Error    | Compile-time | Impure procedure call inside speculative block                         |
| `W-CON-0020` | Warning  | Compile-time | Speculative block on large struct (may be inefficient)                 |
| `W-CON-0021` | Warning  | Compile-time | Speculative block body may be expensive to re-execute                  |
