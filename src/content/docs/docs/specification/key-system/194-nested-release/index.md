---
title: "19.4 Nested Release"
description: "19.4 Nested Release from 19. Key System of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "key-system"
specSection: "194-nested-release"
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

## 19.4 Nested Release

### 19.4.1 Syntax

This section introduces no additional surface syntax beyond the `release_modifier` form in §19.2.1.

### 19.4.2 Parsing

This section introduces no additional parsing rules beyond §19.2.2.

### 19.4.3 AST Representation / Form

Nested release is represented by `KeyBlockStmt(attrs_opt, paths, mods, mode_opt, body, span)` with `Release ∈ mods`.

### 19.4.4 Static Semantics

**(K-Nested-Same-Path)**

$$
\begin{array}{l}
\operatorname{Held}(P,\ M_{\mathsf{outer}},\ \Gamma_{\mathsf{keys}} )\quad \#P\ M_{\mathsf{inner}}\ \{\ \ldots \ \} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{if}\ M_{\mathsf{inner}}\ =\ M_{\mathsf{outer}}: \\[0.16em]
\ \mathsf{Covered} \\[0.16em]
\mathsf{otherwise}\ \mathsf{if}\ M_{\mathsf{inner}}\ \ne \ M_{\mathsf{outer}}\ \land \ \texttt{release}\ \in \ \mathsf{modifiers}: \\[0.16em]
\ \mathsf{Release}-\mathsf{and}-\mathsf{Reacquire} \\[0.16em]
\mathsf{otherwise}: \\[0.16em]
\ \mathsf{Reject}
\end{array}
$$

**(K-Reentrant)**

$$
\begin{array}{l}
\operatorname{SharedParam}(\mathsf{proc},\ i)\ \Leftrightarrow \ \mathsf{the}\ i-\mathsf{th}\ \mathsf{formal}\ \mathsf{parameter}\ \mathsf{of}\ \mathsf{proc}\ \mathsf{has}\ \mathsf{type}\ \texttt{shared}\ T\ \mathsf{for}\ \mathsf{some}\ T \\[0.16em]
\operatorname{DirectCalleeAccesses}(\mathsf{proc})\ =\ \{\langle i,\ \mathsf{rel},\ M\rangle \ \mid \ \operatorname{SharedParam}(\mathsf{proc},\ i)\ \land \ \mathsf{proc}.\mathsf{body}\ \mathsf{contains}\ \operatorname{KeyBlockStmt}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{paths},\ \mathsf{mods},\ \mathsf{mode}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span})\ \land \ q\ \in \ \mathsf{paths}\ \land \ \operatorname{KeyPath}(q)\ =\ \operatorname{name}(\mathsf{param}_{i})\ \mathbin{++} \ \mathsf{rel}\ \land \ M\ =\ \operatorname{BlockMode}(\operatorname{KeyBlockStmt}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{paths},\ \mathsf{mods},\ \mathsf{mode}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span}))\} \\[0.16em]
\operatorname{CalleeAccessSummary}(\mathsf{proc})\ \mathsf{is}\ \mathsf{the}\ \mathsf{least}\ \mathsf{set}\ A\ \mathsf{such}\ \mathsf{that}\ \operatorname{DirectCalleeAccesses}(\mathsf{proc})\ \subseteq \ A\ \mathsf{and},\ \mathsf{for}\ \mathsf{every}\ \mathsf{directly}\ \mathsf{resolved}\ \mathsf{call}\ \texttt{g(a\_1, ..., a\_n)}\ \mathsf{in}\ \mathsf{proc}.\mathsf{body},\ \mathsf{every}\ \langle j,\ \mathsf{rel},\ M\rangle \ \in \ \operatorname{CalleeAccessSummary}(g),\ \mathsf{and}\ \mathsf{every}\ i\ \mathsf{with}\ \operatorname{SharedParam}(\mathsf{proc},\ i)\ \mathsf{and}\ \operatorname{KeyPath}(a_{j})\ =\ \operatorname{name}(\mathsf{param}_{i})\ \mathbin{++} \ \mathsf{rel}_{0},\ \langle i,\ \mathsf{rel}_{0}\ \mathbin{++} \ \mathsf{rel},\ M\rangle \ \in \ A. \\[0.16em]
\operatorname{InstantiateCalleeAccess}(v,\ \langle i,\ \mathsf{rel},\ M\rangle )\ =\ \langle Q,\ M\rangle \ \Leftrightarrow \ \operatorname{KeyPath}(v)\ =\ Q_{0}\ \land \ Q\ =\ Q_{0}\ \mathbin{++} \ \mathsf{rel} \\[0.16em]
\operatorname{CalleeAccesses}(Q)\ \mathsf{at}\ \mathsf{call}\ \mathsf{site}\ \texttt{call(f, a\_1, ..., a\_n)}\ \mathsf{iff}\ \exists \ \langle i,\ \mathsf{rel},\ M\rangle \ \in \ \operatorname{CalleeAccessSummary}(f).\ \operatorname{InstantiateCalleeAccess}(a_{i},\ \langle i,\ \mathsf{rel},\ M\rangle )\ =\ \langle Q,\ M\rangle 
\end{array}
$$
CalleeCovered(Q) at call site iff the instantiated access for Q has required mode M_Q and Covered(Q, M_Q, G_keys).

Held(P, M, G_keys)    Prefix(P, Q)    CalleeAccesses(Q)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{CalleeCovered}(Q)
\end{array}
$$

If CalleeAccessSummary(f) cannot be computed because the callee is unresolved, bodyless, dynamically dispatched, or recursively unknown, the compiler MUST emit the unknown-callee-access warning defined in §19.4.7 once per call site whose `shared` actual argument path lies under a currently held prefix. For static analysis, that call site is treated as potentially accessing every subpath of the actual argument path in `Write` mode.

Passing a `shared` value as a procedure argument does not itself acquire a key:

$$
\begin{array}{l}
\Gamma \ \vdash \ f\ :\ (\texttt{shared}\ T)\ \to \ R\quad \Gamma \ \vdash \ v\ :\ \texttt{shared}\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{call}(f,\ v)\ \Rightarrow \ \mathsf{no}\ \mathsf{key}\ \mathsf{acquisition}\ \mathsf{at}\ \mathsf{call}\ \mathsf{site}
\end{array}
$$

`[[stale_ok]]` suppresses the stale-after-release warning on a binding derived from `shared` data across a `release` boundary. Attribute syntax and attachment are defined in §9.5.

**(K-Release-SameMode-Err)**

$$
\begin{array}{l}
\mathsf{Release}\ \in \ \mathsf{modifiers}\quad \operatorname{Held}(P,\ M_{\mathsf{outer}},\ \Gamma_{\mathsf{keys}} )\quad P\ \in \ \{\operatorname{KeyPath}(p)\ \mid \ p\ \in \ \mathsf{paths}\}\quad \operatorname{BlockMode}(\operatorname{KeyBlockStmt}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{paths},\ \mathsf{modifiers},\ \mathsf{mode}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span}))\ =\ M_{\mathsf{outer}}\quad c\ =\ \operatorname{Code}(K-\mathsf{Release}-\mathsf{SameMode}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{KeyBlockStmt}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{paths},\ \mathsf{modifiers},\ \mathsf{mode}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span})\ \Uparrow \ c
\end{array}
$$

### 19.4.5 Dynamic Semantics

When entering `#path release <target> { body }`:

1. Release the outer key held by the enclosing block.
2. Acquire the target-mode key for `path`.
3. Execute `body`.
4. Release the inner key.
5. Reacquire the outer-mode key for the remainder of the enclosing scope.

**(K-Release-Sequence)**

$$
\begin{array}{l}
\operatorname{Held}(P,\ M_{\mathsf{outer}},\ S_{\mathsf{outer}})\quad \#P\ \texttt{release}\ M_{\mathsf{inner}}\ \{\ B\ \} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{Release}(P,\ \Gamma_{\mathsf{keys}} );
\end{array}
$$
Acquire(P, M_inner, S_inner);
Eval(B);

$$
\operatorname{Release}(P,\ \Gamma_{\mathsf{keys}} );
$$
Acquire(P, M_outer, S_outer)

Between steps 1 and 2, and between steps 4 and 5, other tasks MAY acquire conflicting keys to the same path.

$$
\begin{array}{l}
\operatorname{HeldKeysForPaths}(\mathsf{paths},\ \sigma )\ =\ \mathsf{keys}\ \Leftrightarrow \ \mathsf{keys}\ =\ [k\ \in \ \sigma .\mathsf{held}_{\mathsf{keys}}\ \mid \ \operatorname{PathOf}(k)\ \in \ \operatorname{CanonicalOrder}([\operatorname{KeyPath}(p)\ \mid \ p\ \in \ \mathsf{paths}])] \\[0.16em]
\operatorname{PathOf}(\langle P,\ \_,\ \_\rangle )\ =\ P \\[0.16em]
\operatorname{KeyModeOf}(\langle \_,\ M,\ \_\rangle )\ =\ M \\[0.16em]
\operatorname{KeyScopeOf}(\langle \_,\ \_,\ S\rangle )\ =\ S
\end{array}
$$

$$
\operatorname{MarkKeysReleased}(\sigma ,\ \mathsf{keys})\ =\ \sigma '\ \Leftrightarrow \ \sigma '\ =\ \sigma [\mathsf{held}_{\mathsf{keys}}\ :=\ \sigma .\mathsf{held}_{\mathsf{keys}}\ \setminus \ \mathsf{keys},\ \mathsf{released}_{\mathsf{keys}}\ :=\ \sigma .\mathsf{released}_{\mathsf{keys}}\ \cup \ \mathsf{keys}]
$$

$$
\operatorname{ClearReleased}(\sigma ,\ \mathsf{keys})\ =\ \sigma '\ \Leftrightarrow \ \sigma '\ =\ \sigma [\mathsf{released}_{\mathsf{keys}}\ :=\ \sigma .\mathsf{released}_{\mathsf{keys}}\ \setminus \ \mathsf{keys}]
$$

$$
\begin{array}{l}
\operatorname{ReacquireHeldKeysSigma}(\mathsf{keys},\ \sigma )\ \Downarrow \ \sigma '\ \Leftrightarrow  \\[0.16em]
\ \mathsf{sorted}\ =\ \operatorname{CanonicalSort}([\operatorname{PathOf}(k)\ \mid \ k\ \in \ \mathsf{keys}])\ \land  \\[0.16em]
\ \forall \ P\ \in \ \mathsf{sorted}.\ \exists \ k\ \in \ \mathsf{keys}.\ \operatorname{PathOf}(k)\ =\ P\ \land \ \operatorname{AcquireLock}(\sigma ,\ P,\ \operatorname{KeyModeOf}(k))\ \land  \\[0.16em]
\ \sigma '\ =\ \sigma [\mathsf{held}_{\mathsf{keys}}\ :=\ \sigma .\mathsf{held}_{\mathsf{keys}}\ \cup \ \mathsf{keys}]
\end{array}
$$

**(ExecSigma-KeyBlock-Release)**

$$
\begin{array}{l}
\mathsf{Release}\ \in \ \mathsf{mods}\quad \mathsf{outer}\ =\ \operatorname{HeldKeysForPaths}(\mathsf{paths},\ \sigma )\quad \Gamma \ \vdash \ \operatorname{ReleaseKeysSigma}(\mathsf{outer},\ \sigma )\ \Downarrow \ \sigma_{1} \quad \sigma_{2} \ =\ \operatorname{MarkKeysReleased}(\sigma_{1} ,\ \mathsf{outer})\quad \Gamma \ \vdash \ \operatorname{AcquireKeysSigma}(\mathsf{paths},\ \mathsf{mode}_{\mathsf{opt}},\ \sigma_{2} )\ \Downarrow \ (\sigma_{3} ,\ \mathsf{inner})\quad \Gamma \ \vdash \ \operatorname{EvalBlockSigma}(\mathsf{body},\ \sigma_{3} )\ \Downarrow \ (\mathsf{out},\ \sigma_{4} )\quad \Gamma \ \vdash \ \operatorname{ReleaseKeysSigma}(\mathsf{inner},\ \sigma_{4} )\ \Downarrow \ \sigma_{5} \quad \sigma_{6} \ =\ \operatorname{ClearReleased}(\sigma_{5} ,\ \mathsf{outer})\quad \Gamma \ \vdash \ \operatorname{ReacquireHeldKeysSigma}(\mathsf{outer},\ \sigma_{6} )\ \Downarrow \ \sigma_{7}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{KeyBlockStmt}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{paths},\ \mathsf{mods},\ \mathsf{mode}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span}),\ \sigma )\ \Downarrow \ (\operatorname{StmtOutOf}(\mathsf{out}),\ \sigma_{7} )
\end{array}
$$

### 19.4.6 Lowering

**(Lower-Stmt-KeyBlock-Release)**

$$
\begin{array}{l}
\mathsf{Release}\ \in \ \mathsf{mods}\quad \Gamma \ \vdash \ \operatorname{LowerKeyPaths}(\mathsf{paths})\ \Downarrow \ \mathsf{Ps}\quad \mathsf{outer}\ =\ \operatorname{EnclosingHeldKeys}(\mathsf{Ps})\quad \mathsf{mode}\ =\ \operatorname{ModeOf}(\mathsf{mode}_{\mathsf{opt}})\quad \mathsf{sorted}\ =\ \operatorname{CanonicalSort}(\mathsf{Ps}) \\[0.16em]
\mathsf{IR}_{\mathsf{release}\_\mathsf{outer}}\ =\ \operatorname{SeqIRList}([\operatorname{ReleaseKey}(\operatorname{PathOf}(k),\ \operatorname{KeyScopeOf}(k))\ \mid \ k\ \in \ \operatorname{Reverse}(\mathsf{outer})]) \\[0.16em]
\mathsf{IR}_{\mathsf{acquire}\_\mathsf{inner}}\ =\ \operatorname{SeqIRList}([\operatorname{SeqIR}(\operatorname{CheckConflict}(P_{i},\ \mathsf{mode}),\ \operatorname{AcquireKey}(P_{i},\ \mathsf{mode},\ \mathsf{CurrentScope}))\ \mid \ P_{i}\ \in \ \mathsf{sorted}]) \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerBlock}(\mathsf{body})\ \Downarrow \ \langle \mathsf{IR}_{b},\ v_{b}\rangle  \\[0.16em]
\mathsf{IR}_{\mathsf{release}\_\mathsf{inner}}\ =\ \operatorname{SeqIRList}([\operatorname{ReleaseKey}(P_{i},\ \mathsf{CurrentScope})\ \mid \ P_{i}\ \in \ \operatorname{Reverse}(\mathsf{sorted})]) \\[0.16em]
\mathsf{IR}_{\mathsf{reacquire}\_\mathsf{outer}}\ =\ \operatorname{SeqIRList}([\operatorname{AcquireKey}(\operatorname{PathOf}(k),\ \operatorname{KeyModeOf}(k),\ \operatorname{KeyScopeOf}(k))\ \mid \ k\ \in \ \mathsf{outer}]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{KeyBlockStmt}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{paths},\ \mathsf{mods},\ \mathsf{mode}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span}))\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{\mathsf{release}\_\mathsf{outer}},\ \mathsf{IR}_{\mathsf{acquire}\_\mathsf{inner}},\ \mathsf{IR}_{b},\ \mathsf{IR}_{\mathsf{release}\_\mathsf{inner}},\ \mathsf{IR}_{\mathsf{reacquire}\_\mathsf{outer}})
\end{array}
$$

### 19.4.7 Diagnostics

| Code         | Severity | Detection    | Condition                                           |
| ------------ | -------- | ------------ | --------------------------------------------------- |
| `E-CON-0012` | Error    | Compile-time | Nested mode change without `release` modifier       |
| `E-CON-0018` | Error    | Compile-time | `release` with target mode matching outer mode      |
| `W-CON-0005` | Warning  | Compile-time | Callee access pattern unknown; assuming full access |
| `W-CON-0010` | Warning  | Compile-time | `release` block permits interleaving                |
| `W-CON-0011` | Warning  | Compile-time | Access to potentially stale binding after release   |
