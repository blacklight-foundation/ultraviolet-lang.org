---
title: "21.5 Async-Key Integration"
description: "21.5 Async-Key Integration from 21. Asynchronous Operations of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "asynchronous-operations"
specSection: "215-async-key-integration"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/asynchronous-operations/">21. Asynchronous Operations</a>
  <span>Asynchronous Operations</span>
</div>

## 21.5 Async-Key Integration

### 21.5.1 Syntax

This section introduces no additional surface syntax beyond `wait`, `yield`, `yield from`, `yield release`, closures, and the key forms defined in Chapter 19.

### 21.5.2 Parsing

This section introduces no additional parser productions.

### 21.5.3 AST Representation / Form

Async-key integration is defined over existing forms:

- `WaitExpr(handle)`
- `YieldExpr(release_opt, expr)`
- `YieldFromExpr(release_opt, expr)`
- `ClosureExpr(params, ret_type_opt, body)`

This section introduces no additional AST node variants.

### 21.5.4 Static Semantics

Async key restrictions are:

- `wait` is ill-formed at program point `p` when `Γ_keys(p) ≠ ∅`.
- `yield` is ill-formed at program point `p` when `release_opt = ⊥` and `Γ_keys(p) ≠ ∅`.
- `yield from` is ill-formed at program point `p` when `release_opt = ⊥` and `Γ_keys(p) ≠ ∅`.

Shared-capturing closures that contain `yield` are additionally constrained:

**(A-Closure-Yield-Keys-Err)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{YieldExpr}(\_,\ \_)\ \in \ \mathsf{body}\quad \operatorname{SharedCaptures}(C)\ \ne \ \emptyset \\[0.16em]
\operatorname{YieldExpr}(\bot ,\ \_)\ \mathsf{at}\ \mathsf{program}\ \mathsf{point}\ p\ \mathsf{within}\ \mathsf{body}\quad \Gamma_{\mathsf{keys}} (p)\ \ne \ \emptyset \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ C\ \Uparrow
\end{array}
$$

A closure that captures `shared` bindings and contains `yield` expressions MUST NOT hold keys across the yield point unless the `release` modifier is present.

Bindings derived from shared data before a `yield release` are potentially stale after resumption. The staleness warning defined in Chapter 19 applies unless suppressed by `#stale_ok`.

Async capability requirements are:

| Category      | Capability Required                         |
| ------------- | ------------------------------------------- |
| Pure sequence | None                                        |
| I/O operation | Capability providing the invoked I/O method |
| Timing        | `System`                                    |
| Async runtime | `Reactor`                                   |

### 21.5.5 Dynamic Semantics

At suspension, the task releases access rights. Other tasks MAY acquire keys to the same paths during the suspension period.

For `yield release`, key release and reacquisition are defined by §21.2.5.

Async failure handling is defined by §21.4.5.

### 21.5.6 Lowering

$$
\mathsf{AsyncKeyIR}\ =\ \{\mathsf{SnapshotHeldKeysIR},\ \mathsf{ReleaseHeldKeysIR},\ \mathsf{ReacquireHeldKeysIR},\ \mathsf{StaleValueMarkIR}\}
$$

**(Lower-Wait-Key-Illegal)**

$$
\begin{array}{l}
\operatorname{WaitExpr}(h)\ \mathsf{occurs}\ \mathsf{at}\ \mathsf{program}\ \mathsf{point}\ p\quad \Gamma_{\mathsf{keys}} (p)\ \ne \ \emptyset \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{WaitExpr}(h))\ \Uparrow
\end{array}
$$

**(Lower-Yield-Release-Keys)**

$$
\begin{array}{l}
\operatorname{YieldExpr}(\mathsf{Release},\ e)\ \mathsf{at}\ \mathsf{program}\ \mathsf{point}\ p\quad \Gamma_{\mathsf{keys}} (p)\ =\ \mathsf{keys}\quad \mathsf{keys}\ \ne \ \emptyset \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{Lowering}\ \mathsf{MUST}\ \mathsf{emit}\ \operatorname{SnapshotHeldKeysIR}(\operatorname{CurrentAsyncFrame}(\Gamma )),\ \mathsf{then}\ \operatorname{ReleaseHeldKeysIR}(\operatorname{CurrentAsyncFrame}(\Gamma )),\ \mathsf{then}\ \mathsf{the}\ \mathsf{ordinary}\ \mathsf{yield}\ \mathsf{lowering},\ \mathsf{and}\ \mathsf{MUST}\ \mathsf{prepend}\ \operatorname{ReacquireHeldKeysIR}(\operatorname{CurrentAsyncFrame}(\Gamma ))\ \mathsf{to}\ \mathsf{the}\ \mathsf{resumption}\ \mathsf{target}.
\end{array}
$$

**(Lower-YieldFrom-Release-Keys)**

$$
\begin{array}{l}
\operatorname{YieldFromExpr}(\mathsf{Release},\ e)\ \mathsf{at}\ \mathsf{program}\ \mathsf{point}\ p\quad \Gamma_{\mathsf{keys}} (p)\ =\ \mathsf{keys}\quad \mathsf{keys}\ \ne \ \emptyset \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{Lowering}\ \mathsf{MUST}\ \mathsf{use}\ \mathsf{the}\ \mathsf{same}\ \mathsf{key}\ \mathsf{snapshot},\ \mathsf{release},\ \mathsf{and}\ \mathsf{reacquisition}\ \mathsf{sequence}\ \mathsf{as}\ **(\mathsf{Lower}-\mathsf{Yield}-\mathsf{Release}-\mathsf{Keys})**\ \mathsf{around}\ \mathsf{the}\ \mathsf{delegated}\ \mathsf{async}\ \mathsf{state}\ \mathsf{machine}.
\end{array}
$$

**(Lower-Closure-Yield-Shared)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{SharedCaptures}(C)\ \ne \ \emptyset \quad \operatorname{YieldExpr}(\mathsf{Release},\ \_)\ \in \ \mathsf{body}\ \lor \ \operatorname{YieldFromExpr}(\mathsf{Release},\ \_)\ \in \ \mathsf{body} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{Lowering}\ \mathsf{MUST}\ \mathsf{attach}\ \mathsf{the}\ \mathsf{captured}-\mathsf{key}\ \mathsf{snapshot}\ \mathsf{to}\ \mathsf{the}\ \mathsf{generated}\ \mathsf{closure}\ \mathsf{async}\ \mathsf{frame}\ \mathsf{and}\ \mathsf{MUST}\ \mathsf{emit}\ \mathsf{StaleValueMarkIR}\ \mathsf{for}\ \mathsf{bindings}\ \mathsf{derived}\ \mathsf{from}\ \mathsf{shared}\ \mathsf{captures}\ \mathsf{across}\ \mathsf{the}\ \mathsf{suspension}\ \mathsf{boundary}.
\end{array}
$$

Bindings marked by `StaleValueMarkIR` remain usable but MUST continue to trigger the Chapter 19 staleness warning unless suppressed by `#stale_ok`.

### 21.5.7 Diagnostics

| Code         | Severity | Detection    | Condition                                          |
| ------------ | -------- | ------------ | -------------------------------------------------- |
| `E-CON-0133` | Error    | Compile-time | `wait` while key is held                           |
| `E-CON-0213` | Error    | Compile-time | `yield` while key is held (without `release`)      |
| `E-CON-0224` | Error    | Compile-time | `yield from` while key is held (without `release`) |
