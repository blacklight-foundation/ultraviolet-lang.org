---
title: "19.2 Key Acquisition Blocks"
description: "19.2 Key Acquisition Blocks from 19. Key System of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "key-system"
specSection: "192-key-acquisition-blocks"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/key-system/">19. Key System</a>
  <span>Key System</span>
</div>

## 19.2 Key Acquisition Blocks

### 19.2.1 Syntax

```text
key_block_stmt ::= key_block_head key_path_list key_options? block_expr
key_block_head ::= "%read"
                 | "%write"
                 | "%release" key_mode
                 | "%speculative" "write"
key_mode       ::= "read" | "write"
key_path_list  ::= key_path_expr ("," key_path_expr)*
key_options    ::= "[" key_option ("," key_option)* ","? "]"
key_option     ::= "ordered"
```

The `ordered` option requests the same-base indexed-path checking defined in §19.3.4. It modifies acquisition over the whole parsed path set, not an individual path and not the head mode. Canonical path order remains the deterministic acquisition and conflict-resolution order for key blocks under §§19.2.5 and 19.3.5.

`#dynamic` is an ordinary attribute applied to the key block statement. It is not part of `key_block_head`, `key_path_list`, or `key_options`.

### 19.2.2 Parsing

**(Parse-KeyMode-Read)**
IsCtxIdent(Tok(P), "read")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseKeyMode}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \mathsf{Read})
\end{array}
$$

**(Parse-KeyMode-Write)**
IsCtxIdent(Tok(P), "write")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseKeyMode}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \mathsf{Write})
\end{array}
$$

**(Parse-KeyMode-Err)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsCtxIdent}(\operatorname{Tok}(P),\ \texttt{"read"})\quad \lnot \ \operatorname{IsCtxIdent}(\operatorname{Tok}(P),\ \texttt{"write"})\quad c\ =\ \operatorname{Code}(\mathsf{Parse}-\mathsf{KeyMode}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseKeyMode}(P)\ \Uparrow \ c
\end{array}
$$

**(Parse-KeyBlockHead-Read)**
IsOp(Tok(P), "%")    IsCtxIdent(Tok(Advance(P)), "read")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseKeyBlockHead}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P)),\ \langle \mathsf{Read},\ \bot \rangle )
\end{array}
$$

**(Parse-KeyBlockHead-Write)**
IsOp(Tok(P), "%")    IsCtxIdent(Tok(Advance(P)), "write")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseKeyBlockHead}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P)),\ \langle \mathsf{Write},\ \bot \rangle )
\end{array}
$$

**(Parse-KeyBlockHead-Release)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"\%"})\quad \operatorname{IsCtxIdent}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"release"})\quad \Gamma \ \vdash \ \operatorname{ParseKeyMode}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ \mathsf{mode}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseKeyBlockHead}(P)\ \Downarrow \ (P_{1},\ \langle \mathsf{Release},\ \mathsf{mode}\rangle )
\end{array}
$$

**(Parse-KeyBlockHead-SpeculativeWrite)**
IsOp(Tok(P), "%")    IsCtxIdent(Tok(Advance(P)), "speculative")    IsCtxIdent(Tok(Advance(Advance(P))), "write")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseKeyBlockHead}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P))),\ \langle \mathsf{SpeculativeWrite},\ \bot \rangle )
\end{array}
$$

**(Parse-KeyPathList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseKeyPathExpr}(P)\ \Downarrow \ (P_{1},\ \mathsf{kp})\quad \Gamma \ \vdash \ \operatorname{ParseKeyPathListTail}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{kps}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseKeyPathList}(P)\ \Downarrow \ (P_{2},\ [\mathsf{kp}]\ \mathbin{++} \ \mathsf{kps})
\end{array}
$$

**(Parse-KeyPathListTail-Comma)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParseKeyPathExpr}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{kp})\quad \Gamma \ \vdash \ \operatorname{ParseKeyPathListTail}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{kps}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseKeyPathListTail}(P)\ \Downarrow \ (P_{2},\ [\mathsf{kp}]\ \mathbin{++} \ \mathsf{kps})
\end{array}
$$

**(Parse-KeyPathListTail-End)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseKeyPathListTail}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-KeyOption-Ordered)**
IsCtxIdent(Tok(P), "ordered")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseKeyOption}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \mathsf{Ordered})
\end{array}
$$

**(Parse-KeyOptionsOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"["}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseKeyOptionsOpt}(P)\ \Downarrow \ (P,\ \langle \mathsf{ordered}:\ \mathsf{false}\rangle )
\end{array}
$$

**(Parse-KeyOptionsOpt-Some)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"["})\quad \Gamma \ \vdash \ \operatorname{ParseOptList}(\mathsf{ParseKeyOption},\ \operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{os})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"]"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseKeyOptionsOpt}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \langle \mathsf{ordered}:\ \mathsf{Ordered}\ \in \ \mathsf{os}\rangle )
\end{array}
$$

**(Parse-KeyBlock-Stmt)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseKeyBlockHead}(P)\ \Downarrow \ (P_{1},\ \langle \mathsf{kind},\ \mathsf{mode}\rangle )\quad \Gamma \ \vdash \ \operatorname{ParseKeyPathList}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{paths}) \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseKeyOptionsOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{options})\quad \Gamma \ \vdash \ \operatorname{ParseBlockExpr}(P_{3})\ \Downarrow \ (P_{4},\ \mathsf{body})\quad \mathsf{sp}\ =\ \operatorname{SpanOfTokens}(P,\ P_{4}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStmt}(P)\ \Downarrow \ (P_{4},\ \operatorname{KeyBlockStmt}(\bot ,\ \mathsf{kind},\ \mathsf{paths},\ \mathsf{mode},\ \mathsf{options},\ \mathsf{body},\ \mathsf{sp}))
\end{array}
$$

`SpanOfTokens(P, P')` is the span from the start of `Tok(P)` to the end of the last token consumed before `P'`. `ParseStmt` dispatches to `Parse-KeyBlock-Stmt` when `IsOp(Tok(P), "%")`. `attrs_opt` is populated by the shared attributed-statement mechanism of Chapter 9; `Parse-KeyBlock-Stmt` itself produces `⊥`. The option-list rules instantiate the shared schema of §5.5 with `El = ParseKeyOption`. `Parse-KeyOption-Ordered` consumes `ordered` only inside the bracketed option list following the complete path list. `Parse-KeyBlockHead-Release` consumes `%release` followed by the required target mode. `Parse-KeyBlockHead-SpeculativeWrite` consumes `%speculative write`; any other token after `%speculative` is a syntax error.

### 19.2.3 AST Representation / Form

$$
\mathsf{KeyMode}\ =\ \{\mathsf{Read},\ \mathsf{Write}\}
$$

$$
\mathsf{KeyBlockKind}\ =\ \{\mathsf{Read},\ \mathsf{Write},\ \mathsf{Release},\ \mathsf{SpeculativeWrite}\}
$$

$$
\mathsf{KeyBlockOptions}\ =\ \langle \mathsf{ordered}:\ \mathsf{bool}\rangle
$$

$$
\mathsf{KeyPathList}\ =\ [\mathsf{KeyPathExpr}]
$$

$$
\mathsf{KeyBlockStmt}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{kind},\ \mathsf{paths},\ \mathsf{mode},\ \mathsf{options},\ \mathsf{body},\ \mathsf{span}\rangle
$$

$$
\mathsf{Key}\ =\ \langle \mathsf{Path},\ \mathsf{Mode},\ \mathsf{Scope}\rangle
$$

$$
\Gamma_{\mathsf{keys}} \ :\ \mathsf{ProgramPoint}\ \to \ \wp (\mathsf{Key})
$$

$$
\operatorname{Held}(P,\ M,\ S,\ \Gamma_{\mathsf{keys}} ,\ p)\ \Leftrightarrow \ (P,\ M,\ S)\ \in \ \Gamma_{\mathsf{keys}} (p)
$$

### 19.2.4 Static Semantics

**Key Triple**

A key consists of `Path`, `Mode`, and `Scope`.

`Read` permits read-only access. Multiple `Read` keys to overlapping paths MAY coexist.

`Write` permits read and write access. A `Write` key excludes all other keys to overlapping paths.

Mode ordering:

Read < Write

$$
\begin{array}{l}
\operatorname{ModeSufficient}(M_{\mathsf{held}},\ M_{\mathsf{required}})\ \Leftrightarrow \ M_{\mathsf{required}}\ \le \ M_{\mathsf{held}} \\[0.16em]
\operatorname{BlockMode}(\operatorname{KeyBlockStmt}(\_,\ \_,\ \_,\ \mathsf{Read},\ \_,\ \_,\ \_))\ =\ \mathsf{Read} \\[0.16em]
\operatorname{BlockMode}(\operatorname{KeyBlockStmt}(\_,\ \_,\ \_,\ \mathsf{Write},\ \_,\ \_,\ \_))\ =\ \mathsf{Write}
\end{array}
$$

**(K-Mode-Read)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ :\ \texttt{shared}\ T\quad \operatorname{ReadContext}(e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{RequiredMode}(e)\ =\ \mathsf{Read}
\end{array}
$$

**(K-Mode-Write)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ :\ \texttt{shared}\ T\quad \operatorname{WriteContext}(e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{RequiredMode}(e)\ =\ \mathsf{Write}
\end{array}
$$

If an expression appears in multiple contexts, the more restrictive context applies.

Read contexts:

| Syntactic Position                                                 | Context |
| ------------------------------------------------------------------ | ------- |
| Right-hand side of `let`/`var` initializer                         | Read    |
| Right-hand side of assignment (`=`)                                | Read    |
| Operand of arithmetic/logical operator                             | Read    |
| Argument to `const` or `shared` parameter                          | Read    |
| Condition or case-scrutinee expression (`if`, `if ... is`, `loop`) | Read    |
| Receiver of method with `~` receiver                               | Read    |

Write contexts:

| Syntactic Position                                 | Context |
| -------------------------------------------------- | ------- |
| Left-hand side of assignment (`=`)                 | Write   |
| Left-hand side of compound assignment (`+=`, etc.) | Write   |
| Receiver of method with `~!` receiver              | Write   |
| Receiver of method with `~%` receiver              | Write   |
| Argument to `unique` parameter                     | Write   |

**Key State Context**

$$
\operatorname{Acquire}(P,\ M,\ S,\ \Gamma_{\mathsf{keys}} )\ =\ \Gamma_{\mathsf{keys}} \ \cup \ \{(P,\ M,\ S)\}
$$

$$
\operatorname{Release}(P,\ \Gamma_{\mathsf{keys}} )\ =\ \Gamma_{\mathsf{keys}} \ \setminus \ \{(P,\ M,\ S)\ :\ (P,\ M,\ S)\ \in \ \Gamma_{\mathsf{keys}} \}
$$

$$
\operatorname{ReleaseScope}(S,\ \Gamma_{\mathsf{keys}} )\ =\ \Gamma_{\mathsf{keys}} \ \setminus \ \{(P,\ M,\ S')\ :\ S'\ =\ S\}
$$

$$
\operatorname{ModeTransition}(P,\ M_{\mathsf{new}},\ \Gamma_{\mathsf{keys}} )\ =\ (\Gamma_{\mathsf{keys}} \ \setminus \ \{(P,\ M_{\mathsf{old}},\ S)\})\ \cup \ \{(P,\ M_{\mathsf{new}},\ S)\}
$$

$$
\operatorname{PanicRelease}(S,\ \Gamma_{\mathsf{keys}} )\ =\ \Gamma_{\mathsf{keys}} \ \setminus \ \{(P,\ M,\ S')\ :\ S'\ \le_{\mathsf{nest}} \ S\}
$$

**Implicit Acquisition**

$$
\operatorname{Covered}(Q,\ M_{Q},\ \Gamma_{\mathsf{keys}} )\ \Leftrightarrow \ \exists \ (P,\ M_{P},\ S)\ \in \ \Gamma_{\mathsf{keys}} \ :\ \operatorname{Prefix}(P,\ Q)\ \land \ \operatorname{ModeSufficient}(M_{P},\ M_{Q})
$$

**Valid Key Context**

For an ordinary `shared` access `e`, a valid key context exists iff `KeyPath(e)` and `RequiredMode(e)` are both defined and no Chapter 19 scope/escape rule forbids the access.

If `Covered(KeyPath(e), RequiredMode(e), Γ_keys)` holds, the access reuses the existing key context.

Otherwise the ordinary access establishes an implicit acquisition as defined by **(Lower-KeyAccess-Uncovered)** in §19.1.6.

Being outside an explicit key block does not by itself make an ordinary `shared` access invalid.

**(K-Acquire-New)**

$$
\begin{array}{l}
\Gamma \ \vdash \ P\ :\ \texttt{shared}\ T\quad M\ =\ \operatorname{RequiredMode}(P)\quad \lnot \ \operatorname{Covered}(P,\ M,\ \Gamma_{\mathsf{keys}} )\quad S\ =\ \mathsf{CurrentScope} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma '\_\mathsf{keys}\ =\ \Gamma_{\mathsf{keys}} \ \cup \ \{(P,\ M,\ S)\}
\end{array}
$$

**(K-Acquire-Covered)**

$$
\begin{array}{l}
\Gamma \ \vdash \ P\ :\ \texttt{shared}\ T\quad M\ =\ \operatorname{RequiredMode}(P)\quad \operatorname{Covered}(P,\ M,\ \Gamma_{\mathsf{keys}} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma '\_\mathsf{keys}\ =\ \Gamma_{\mathsf{keys}}
\end{array}
$$

Subexpressions are evaluated left-to-right, depth-first. Key acquisition follows evaluation order.

**Explicit Key Blocks**

**(K-Block-Acquire)**

$$
\begin{array}{l}
\Gamma \ \vdash \ P_{1},\ \ldots ,\ P_{m}\ :\ \texttt{shared}\ T_{i}\quad M\ =\ \operatorname{BlockMode}(B)\quad (Q_{1},\ \ldots ,\ Q_{m})\ =\ \operatorname{CanonicalSort}(P_{1},\ \ldots ,\ P_{m})\quad S\ =\ \mathsf{NewScope} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma '\_\mathsf{keys}\ =\ \Gamma_{\mathsf{keys}} \ \cup \ \{(Q_{i},\ M,\ S)\ :\ i\ \in \ 1..m\}
\end{array}
$$

**(K-Read-Block-No-Write)**

$$
\begin{array}{l}
\operatorname{BlockMode}(B)\ =\ \mathsf{Read}\quad P\ \in \ \operatorname{KeyedPaths}(B)\quad \operatorname{WriteOf}(P)\ \in \ \operatorname{Body}(B) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{Reject}
\end{array}
$$

**Key Coarsening**

The `#` marker in a path expression sets the acquisition granularity. The key is acquired at the marked position and covers all subsequent segments.

**(K-Coarsen-Inline)**

$$
\begin{array}{l}
P\ =\ p_{1}\ \ldots \ p\_(k-1).\#p_{k}\ \ldots \ p_{n}\quad \Gamma \ \vdash \ P\ :\ \texttt{shared}\ T\quad M\ =\ \operatorname{RequiredMode}(P) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{AcquireKey}(p_{1}\ \ldots \ p_{k},\ M,\ \Gamma_{\mathsf{keys}} )
\end{array}
$$

A field declaration marked with `#` establishes a permanent key boundary. Key paths truncate at that field boundary.

**Closure Capture of `shared` Bindings**

Dependency-set formation for escaping closures is defined in §16.9.4. Chapter 19 consumes that dependency information for key acquisition.

Let `SharedCaptures(C)` be the set of captured bindings with `shared` permission.

For a local closure, key analysis treats the closure body as executing in the defining scope:

$$
\operatorname{KeyPath}(C,\ x.p)\ =\ \operatorname{KeyPath}(x.p)
$$

For an escaping closure, key paths are rooted at runtime identities of captured references:

**(K-Closure-Escape-Keys)**

$$
\begin{array}{l}
C\ :\ \mid \mathsf{vec}_{T}\mid \ \to \ R\ [\texttt{shared}:\ \mathsf{deps}]\quad \operatorname{Access}(x.p,\ M)\ \in \ C.\mathsf{body} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{KeyPath}(C,\ x.p)\ =\ \operatorname{id}(C.x).p
\end{array}
$$

An escaping closure MUST NOT outlive any captured local `shared` binding.

For correctness, escaping-closure key acquisition is required to cover the runtime identity of the captured reference.

An implementation MAY conservatively coarsen `id(C.x).p` to a stable closure-capture-rooted key prefix, provided the coarsened key soundly covers every runtime identity reachable through `C.x` and preserves observational equivalence.

### 19.2.5 Dynamic Semantics

**Common Key-Block Execution**

`CanonicalOrder`, `CanonicalSort`, and conflict relations are defined in §19.3.5.

$$
\mathsf{KeyBlockJudg}\ =\ \{\mathsf{AcquireKeysSigma},\ \mathsf{ReleaseKeysSigma}\}
$$

$$
\begin{array}{l}
\operatorname{AcquireKeysSigma}(\mathsf{paths},\ \mathsf{mode},\ \sigma )\ \Downarrow \ (\sigma ',\ \mathsf{keys})\ \Leftrightarrow \\[0.16em]
\ \mathsf{keys}\ =\ \operatorname{CanonicalOrder}([\operatorname{KeyPath}(p)\ \mid \ p\ \in \ \mathsf{paths}])\ \land \\[0.16em]
\ \forall \ k\ \in \ \mathsf{keys}.\ \operatorname{AcquireLock}(\sigma ,\ k,\ \mathsf{mode})\ \land \\[0.16em]
\ \sigma '\ =\ \sigma [\mathsf{held}_{\mathsf{keys}}\ :=\ \sigma .\mathsf{held}_{\mathsf{keys}}\ \cup \ \mathsf{keys}]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ReleaseKeysSigma}(\mathsf{keys},\ \sigma )\ \Downarrow \ \sigma '\ \Leftrightarrow \\[0.16em]
\ \mathsf{rev}\ =\ \operatorname{Reverse}(\mathsf{keys})\ \land \\[0.16em]
\ \forall \ k\ \in \ \mathsf{rev}.\ \operatorname{ReleaseLock}(\sigma ,\ k)\ \land \\[0.16em]
\ \sigma '\ =\ \sigma [\mathsf{held}_{\mathsf{keys}}\ :=\ \sigma .\mathsf{held}_{\mathsf{keys}}\ \setminus \ \mathsf{keys}]
\end{array}
$$

**(ExecSigma-KeyBlock)**

$$
\begin{array}{l}
\mathsf{kind}\ \ne \ \mathsf{SpeculativeWrite}\quad \mathsf{kind}\ \ne \ \mathsf{Release}\quad \Gamma \ \vdash \ \operatorname{AcquireKeysSigma}(\mathsf{paths},\ \mathsf{mode},\ \sigma )\ \Downarrow \ (\sigma_{1} ,\ \mathsf{keys})\quad \Gamma \ \vdash \ \operatorname{EvalBlockSigma}(\mathsf{body},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )\quad \Gamma \ \vdash \ \operatorname{ReleaseKeysSigma}(\mathsf{keys},\ \sigma_{2} )\ \Downarrow \ \sigma_{3} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{KeyBlockStmt}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{kind},\ \mathsf{paths},\ \mathsf{mode},\ \mathsf{options},\ \mathsf{body},\ \mathsf{span}),\ \sigma )\ \Downarrow \ (\operatorname{StmtOutOf}(\mathsf{out}),\ \sigma_{3} )
\end{array}
$$

**(ExecSigma-KeyBlock-Ctrl)**

$$
\begin{array}{l}
\mathsf{kind}\ \ne \ \mathsf{SpeculativeWrite}\quad \mathsf{kind}\ \ne \ \mathsf{Release}\quad \Gamma \ \vdash \ \operatorname{AcquireKeysSigma}(\mathsf{paths},\ \mathsf{mode},\ \sigma )\ \Downarrow \ (\sigma_{1} ,\ \mathsf{keys})\quad \Gamma \ \vdash \ \operatorname{EvalBlockSigma}(\mathsf{body},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} )\quad \Gamma \ \vdash \ \operatorname{ReleaseKeysSigma}(\mathsf{keys},\ \sigma_{2} )\ \Downarrow \ \sigma_{3} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{KeyBlockStmt}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{kind},\ \mathsf{paths},\ \mathsf{mode},\ \mathsf{options},\ \mathsf{body},\ \mathsf{span}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{3} )
\end{array}
$$

**(Step-Exec-KeyBlock-Enter)**

$$
\begin{array}{l}
\mathsf{kind}\ \ne \ \mathsf{SpeculativeWrite}\quad \Gamma \ \vdash \ \operatorname{AcquireKeysSigma}(\mathsf{paths},\ \mathsf{mode},\ \sigma )\ \Downarrow \ (\sigma_{1} ,\ \mathsf{keys}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Exec}(\operatorname{KeyBlockStmt}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{kind},\ \mathsf{paths},\ \mathsf{mode},\ \mathsf{options},\ \mathsf{body},\ \mathsf{span}),\ \sigma )\rangle \ \to \ \langle \operatorname{KeyBody}(\mathsf{keys},\ \mathsf{body},\ \sigma_{1} )\rangle
\end{array}
$$

**(Step-Exec-KeyBlock-Body)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalBlockSigma}(\mathsf{body},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{KeyBody}(\mathsf{keys},\ \mathsf{body},\ \sigma )\rangle \ \to \ \langle \operatorname{KeyExit}(\mathsf{keys},\ \mathsf{out},\ \sigma_{1} )\rangle
\end{array}
$$

**(Step-Exec-KeyBlock-Exit-Ok)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ReleaseKeysSigma}(\mathsf{keys},\ \sigma )\ \Downarrow \ \sigma '\quad \operatorname{StmtOutOf}(\mathsf{out})\ =\ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{KeyExit}(\mathsf{keys},\ \mathsf{out},\ \sigma )\rangle \ \to \ \langle \operatorname{ExecDone}(\sigma ')\rangle
\end{array}
$$

**(Step-Exec-KeyBlock-Exit-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ReleaseKeysSigma}(\mathsf{keys},\ \sigma )\ \Downarrow \ \sigma '\quad \operatorname{StmtOutOf}(\mathsf{out})\ =\ \operatorname{Ctrl}(\kappa ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{KeyExit}(\mathsf{keys},\ \mathsf{out},\ \sigma )\rangle \ \to \ \langle \operatorname{ExecCtrl}(\kappa ,\ \sigma ')\rangle
\end{array}
$$

Keys are released when their defining scope exits, regardless of whether the exit is normal completion, `return`, `break`, `continue`, panic propagation, or task cancellation. Scope-exit key release occurs before drop actions for bindings in the same scope.

**Closure Invocation and `shared` Captures**

For a local closure invocation:

1. Determine accessed `shared` paths in the closure body.
2. Acquire required keys using lexical roots.
3. Execute the closure body.
4. Release keys at invocation end.

For an escaping closure invocation:

1. For each dependency `(x : shared T)` in the closure type, let `r = C.x`.
2. Acquire required keys for paths rooted at `id(r)`.
3. Execute the closure body.
4. Release keys at invocation end.

### 19.2.6 Lowering

$$
\operatorname{LowerKeyPaths}([])\ \Downarrow \ []
$$

$$
\operatorname{LowerKeyPaths}([p]\ \mathbin{++} \ \mathsf{ps})\ \Downarrow \ [P]\ \mathbin{++} \ \mathsf{Ps}\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{LowerKeyPath}(p)\ \Downarrow \ P\ \land \ \Gamma \ \vdash \ \operatorname{LowerKeyPaths}(\mathsf{ps})\ \Downarrow \ \mathsf{Ps}
$$

**(Lower-Stmt-KeyBlock)**

$$
\begin{array}{l}
\mathsf{kind}\ \ne \ \mathsf{SpeculativeWrite}\quad \mathsf{kind}\ \ne \ \mathsf{Release}\quad \Gamma \ \vdash \ \operatorname{LowerKeyPaths}(\mathsf{paths})\ \Downarrow \ \mathsf{Ps}\quad \mathsf{sorted}\ =\ \operatorname{CanonicalSort}(\mathsf{Ps})\quad S\ =\ \mathsf{CurrentScope} \\[0.16em]
\mathsf{IR}_{\mathsf{enter}}\ =\ \operatorname{SeqIRList}([\operatorname{SeqIR}(\operatorname{CheckConflict}(P_{i},\ \mathsf{mode}),\ \operatorname{AcquireKey}(P_{i},\ \mathsf{mode},\ S))\ \mid \ P_{i}\ \in \ \mathsf{sorted}]) \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerBlock}(\mathsf{body})\ \Downarrow \ \langle \mathsf{IR}_{b},\ v_{b}\rangle \\[0.16em]
\mathsf{IR}_{\mathsf{exit}}\ =\ \operatorname{SeqIRList}([\operatorname{ReleaseKey}(P_{i},\ S)\ \mid \ P_{i}\ \in \ \operatorname{Reverse}(\mathsf{sorted})]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{KeyBlockStmt}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{kind},\ \mathsf{paths},\ \mathsf{mode},\ \mathsf{options},\ \mathsf{body},\ \mathsf{span}))\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{\mathsf{enter}},\ \mathsf{IR}_{b},\ \mathsf{IR}_{\mathsf{exit}})
\end{array}
$$

### 19.2.7 Diagnostics

Keys are scope-bound.

An access whose validity depends on a key acquired in scope `S` is well-formed only when the access is guaranteed to execute before `ScopeExit(S)`.

In particular, key-dependent accesses MUST NOT escape through closures, deferred blocks, or suspension/resumption boundaries whose execution may occur after `S` exits.

Acquiring a key inside a `defer` body is always ill-formed because the deferred body executes in the outer scope's exit phase rather than at the lexical point of the `defer` statement.

`W-CON-0001` is advisory only. It is emitted only when the compiler proves that a loop repeatedly acquires fine-grained keys and that a materially coarser legal acquisition boundary exists.

Where a more specific Chapter 19 escape diagnostic applies, it takes precedence over `E-CON-0004`.

| Code         | Severity | Detection    | Condition                                                   |
| ------------ | -------- | ------------ | ----------------------------------------------------------- |
| `E-CON-0001` | Error    | Compile-time | Access to `shared` path outside valid key context           |
| `E-CON-0004` | Error    | Compile-time | Key escapes its defining scope                              |
| `E-CON-0006` | Error    | Compile-time | Key acquisition in `defer` escapes to outer scope           |
| `E-CON-0031` | Error    | Compile-time | Key block path not in scope                                 |
| `E-CON-0032` | Error    | Compile-time | Key block path is not `shared`                              |
| `E-CON-0070` | Error    | Compile-time | Write operation in `%read` key block       |
| `E-CON-0085` | Error    | Compile-time | Escaping closure with `shared` capture lacks dependency set |
| `E-CON-0086` | Error    | Compile-time | Escaping closure outlives captured local `shared` binding (`P-Closure-Escape-Err`) |
| `W-CON-0001` | Warning  | Compile-time | Fine-grained keys in tight loop (performance hint)          |
| `W-CON-0002` | Warning  | Compile-time | Redundant key acquisition (already covered)                 |
| `W-CON-0003` | Warning  | Compile-time | `#` redundant (matches type boundary)                       |
| `W-CON-0009` | Warning  | Compile-time | Closure captures `shared` data                              |
