---
title: "19.3 Conflict Detection"
description: "19.3 Conflict Detection from 19. Key System of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "key-system"
specSection: "193-conflict-detection"
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

## 19.3 Conflict Detection

### 19.3.1 Syntax

This section introduces no additional surface syntax beyond §19.1.1 and §19.2.1.

### 19.3.2 Parsing

This section introduces no additional parsing rules.

### 19.3.3 AST Representation / Form

$$
\operatorname{Prefix}(p_{1}\ \ldots \ p_{m},\ q_{1}\ \ldots \ q_{n})\ \Leftrightarrow \ m\ \le \ n\ \land \ \forall \ i\ \in \ 1..m,\ p_{i}\ \equiv_{\mathsf{seg}} \ q_{i}
$$

$$
\operatorname{Disjoint}(P,\ Q)\ \Leftrightarrow \ \lnot \ \operatorname{Prefix}(P,\ Q)\ \land \ \lnot \ \operatorname{Prefix}(Q,\ P)
$$

$$
\begin{array}{l}
\operatorname{KeyPathLess}(p_{1},\ p_{2})\ \Leftrightarrow \\[0.16em]
\ \mathsf{segments}_{1}\ =\ \operatorname{PathSegments}(p_{1})\ \land \\[0.16em]
\ \mathsf{segments}_{2}\ =\ \operatorname{PathSegments}(p_{2})\ \land \\[0.16em]
\ \operatorname{LexLess}(\mathsf{segments}_{1},\ \mathsf{segments}_{2},\ \mathsf{SegmentLess})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{SegmentLess}(s_{1},\ s_{2})\ \Leftrightarrow \\[0.16em]
\ (\operatorname{IsIdent}(s_{1})\ \land \ \operatorname{IsIdent}(s_{2})\ \land \ \operatorname{Utf8LexLess}(\operatorname{Name}(s_{1}),\ \operatorname{Name}(s_{2})))\ \lor \\[0.16em]
\ (\operatorname{IsIndex}(s_{1})\ \land \ \operatorname{IsIndex}(s_{2})\ \land \ \operatorname{IndexValue}(s_{1})\ <\ \operatorname{IndexValue}(s_{2}))\ \lor \\[0.16em]
\ (\operatorname{IsIdent}(s_{1})\ \land \ \operatorname{IsIndex}(s_{2}))
\end{array}
$$

$$
\operatorname{LexLess}([],\ [],\ \_)\ =\ \mathsf{false}
$$

$$
\operatorname{LexLess}([],\ \_\mathbin{::} \_,\ \_)\ =\ \mathsf{true}
$$

$$
\operatorname{LexLess}(\_\mathbin{::} \_,\ [],\ \_)\ =\ \mathsf{false}
$$

$$
\operatorname{LexLess}(a\mathbin{::} \mathsf{as},\ b\mathbin{::} \mathsf{bs},\ \mathsf{cmp})\ =\ \operatorname{cmp}(a,\ b)\ \lor \ (a\ =\ b\ \land \ \operatorname{LexLess}(\mathsf{as},\ \mathsf{bs},\ \mathsf{cmp}))
$$

$$
\operatorname{CanonicalOrder}(\mathsf{paths})\ =\ \operatorname{Sort}(\mathsf{paths},\ \mathsf{KeyPathLess})
$$

$$
\operatorname{CanonicalSort}(\mathsf{paths})\ =\ \operatorname{Sort}(\mathsf{paths},\ \mathsf{KeyPathLess})
$$

**Key Compatibility**

$$
\mathsf{Two}\ \mathsf{keys}\ K_{1}\ =\ (P_{1},\ M_{1},\ S_{1})\ \mathsf{and}\ K_{2}\ =\ (P_{2},\ M_{2},\ S_{2})\ \mathsf{are}\ \mathsf{compatible}\ \mathsf{if}\ \mathsf{and}\ \mathsf{only}\ \mathsf{if}:
$$

$$
\operatorname{Compatible}(K_{1},\ K_{2})\ \Leftrightarrow \ \operatorname{Disjoint}(P_{1},\ P_{2})\ \lor \ (M_{1}\ =\ \mathsf{Read}\ \land \ M_{2}\ =\ \mathsf{Read})
$$

$$
\operatorname{KeyModeCompatible}(\mathsf{Read},\ \mathsf{Read})\ =\ \mathsf{true}
$$

$$
\operatorname{KeyModeCompatible}(\mathsf{Read},\ \mathsf{Write})\ =\ \mathsf{false}
$$

$$
\operatorname{KeyModeCompatible}(\mathsf{Write},\ \mathsf{Read})\ =\ \mathsf{false}
$$

$$
\operatorname{KeyModeCompatible}(\mathsf{Write},\ \mathsf{Write})\ =\ \mathsf{false}
$$

$$
\operatorname{KeysOverlap}(p_{1},\ p_{2})\ \Leftrightarrow \ \operatorname{Prefix}(p_{1},\ p_{2})\ \lor \ \operatorname{Prefix}(p_{2},\ p_{1})\ \lor \ p_{1}\ =\ p_{2}
$$

$$
\operatorname{KeyConflict}(\langle p_{1},\ m_{1},\ \_\rangle ,\ \langle p_{2},\ m_{2},\ \_\rangle )\ \Leftrightarrow \ \operatorname{KeysOverlap}(p_{1},\ p_{2})\ \land \ \lnot \operatorname{KeyModeCompatible}(m_{1},\ m_{2})
$$

### 19.3.4 Static Semantics

**Path Prefix and Disjointness**

$$
\texttt{p\_i ==\_seg q\_i}\ \mathsf{iff}\ \texttt{name(p\_i) = name(q\_i)}\ \mathsf{and}\ \texttt{IndexEquiv(p\_i, q\_i)}.
$$

Two index expressions `e_1` and `e_2` are provably equivalent iff one of the following holds:

1. Both are the same integer literal.
2. Both are references to the same `const` binding.
3. Both are references to the same generic const parameter.
4. Both are references to the same variable binding in scope, and the binding is immutable (`let`) or has no intervening mutation between the two references.
5. Both normalize to the same canonical form under constant folding.

These clauses are sufficient proof cases.

An implementation MAY conservatively recognize any sound subset of them. Failure to prove equivalence is treated as inequivalence.

**(K-Disjoint-Safe)**
Disjoint(P, Q)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ConcurrentAccess}(P,\ Q)\ \mathsf{is}\ \mathsf{statically}\ \mathsf{safe}
\end{array}
$$

**(K-Prefix-Coverage)**

$$
\begin{array}{l}
\operatorname{Prefix}(P,\ Q)\quad \operatorname{Held}(P,\ M,\ \Gamma_{\mathsf{keys}} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{Covers}((P,\ M),\ Q)
\end{array}
$$

**Static Conflict Analysis for Dynamic Indices**

Two index expressions are provably disjoint iff one of the following holds:

1. Both are statically resolvable with different values.
2. A verification fact establishes `e_1 ≠ e_2`.
3. A precondition asserts `e_1 ≠ e_2`.
4. A refinement type constrains their relationship.
5. The expressions share a common base and differ by constant offsets.
6. Inside `dispatch`, accesses indexed by the iteration variable are automatically disjoint.
7. Iteration variables from loops with non-overlapping ranges are disjoint.

These clauses are sufficient proof cases.

An implementation MAY conservatively recognize any sound subset of them. Failure to prove disjointness is treated as possible overlap.

**(K-Dynamic-Index-Conflict)**

$$
\begin{array}{l}
P_{1}\ =\ a[e_{1}]\quad P_{2}\ =\ a[e_{2}]\quad S\ =\ \operatorname{StatementOf}(P_{1})\quad S\ =\ \operatorname{StatementOf}(P_{2})\quad (\operatorname{Dynamic}(e_{1})\ \lor \ \operatorname{Dynamic}(e_{2}))\quad \lnot \ \operatorname{ProvablyDisjoint}(e_{1},\ e_{2})\quad c\ =\ \operatorname{Code}(K-\mathsf{Dynamic}-\mathsf{Index}-\mathsf{Conflict}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ S\ \Uparrow \ c
\end{array}
$$

`StatementOf(P)` is the statement containing the access path occurrence `P`.

**Read-Then-Write Prohibition**

$$
\operatorname{ReadThenWrite}(P,\ S)\ \Leftrightarrow \ \exists \ e_{r},\ e_{w}\ \in \ \operatorname{Subexpressions}(S)\ :\ \operatorname{ReadsPath}(e_{r},\ P)\ \land \ \operatorname{WritesPath}(e_{w},\ P)
$$

$$
\operatorname{CompoundRewriteOp}(\mathsf{op})\ \Leftrightarrow \ \mathsf{op}\ \in \ \{\texttt{+},\ \texttt{-},\ \texttt{*},\ \texttt{/},\ \texttt{\%}\}
$$

$$
\operatorname{CompoundRewriteCandidate}(P,\ S)\ \Leftrightarrow \ S\ =\ \operatorname{AssignStmt}(P,\ \operatorname{BinaryExpr}(\mathsf{op},\ P,\ e),\ \mathsf{span})\ \land \ \operatorname{CompoundRewriteOp}(\mathsf{op})
$$

In this chapter, `ReadThenWrite(P, S)` is required to be diagnosed for assignment and compound-assignment statement surfaces that visibly separate a read of `P` from a write of `P`.

Other write forms continue to be governed by `RequiredMode`, `Covered`, and the ordinary key compatibility rules.

**(K-Read-Write-Reject)**

$$
\begin{array}{l}
\Gamma \ \vdash \ P\ :\ \texttt{shared}\ T\quad \operatorname{ReadThenWrite}(P,\ S)\quad \lnot \ \exists \ (Q,\ \mathsf{Write},\ S')\ \in \ \Gamma_{\mathsf{keys}} \ :\ \operatorname{Prefix}(Q,\ P)\quad c\ =\ \operatorname{Code}(K-\mathsf{Read}-\mathsf{Write}-\mathsf{Reject}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ S\ \Uparrow \ c
\end{array}
$$

**(K-RMW-Permitted)**

$$
\begin{array}{l}
\Gamma \ \vdash \ P\ :\ \texttt{shared}\ T\quad \operatorname{ReadThenWrite}(P,\ S)\quad \exists \ (Q,\ \mathsf{Write},\ S')\ \in \ \Gamma_{\mathsf{keys}} \ :\ \operatorname{Prefix}(Q,\ P) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RMWOk}(P,\ S)
\end{array}
$$

**(K-RMW-Explicit-Warn)**

$$
\begin{array}{l}
\Gamma \ \vdash \ P\ :\ \texttt{shared}\ T\quad \operatorname{ReadThenWrite}(P,\ S)\quad \exists \ (Q,\ \mathsf{Write},\ S')\ \in \ \Gamma_{\mathsf{keys}} \ :\ \operatorname{Prefix}(Q,\ P)\quad \operatorname{CompoundRewriteCandidate}(P,\ S)\quad w\ =\ \operatorname{Code}(K-\mathsf{RMW}-\mathsf{Explicit}-\mathsf{Warn}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{WarnRMW}(S)\ \Downarrow \ w
\end{array}
$$

**(K-RMW-Contention-Warn)**

$$
\begin{array}{l}
\Gamma \ \vdash \ P\ :\ \texttt{shared}\ T\quad \operatorname{ReadThenWrite}(P,\ S)\quad \exists \ (Q,\ \mathsf{Write},\ S')\ \in \ \Gamma_{\mathsf{keys}} \ :\ \operatorname{Prefix}(Q,\ P)\quad \lnot \ \operatorname{CompoundRewriteCandidate}(P,\ S)\quad w\ =\ \operatorname{Code}(K-\mathsf{RMW}-\mathsf{Contention}-\mathsf{Warn}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{WarnRMW}(S)\ \Downarrow \ w
\end{array}
$$

$$
\begin{array}{l}
\operatorname{NonIndexShape}(P)\ =\ [\mathsf{seg}\ \mid \ \mathsf{seg}\ \in \ \operatorname{PathSegments}(P)\ \land \ \lnot \ \operatorname{IsIndex}(\mathsf{seg})] \\[0.16em]
\operatorname{OrderedBase}(P)\ =\ \langle \operatorname{Root}(P),\ \operatorname{NonIndexShape}(P)\rangle \\[0.16em]
\operatorname{OrderedComparable}(\mathsf{paths})\ \Leftrightarrow \ \forall \ P,\ Q\ \in \ \mathsf{paths}.\ \operatorname{OrderedBase}(P)\ =\ \operatorname{OrderedBase}(Q) \\[0.16em]
\operatorname{StaticallyComparableIndices}(\mathsf{paths})\ \Leftrightarrow \ \forall \ P,\ Q\ \in \ \mathsf{paths}.\ \operatorname{OrderedBase}(P)\ =\ \operatorname{OrderedBase}(Q)\ \Rightarrow \ \operatorname{PathSegments}(P)\ \mathsf{and}\ \operatorname{PathSegments}(Q)\ \mathsf{differ}\ \mathsf{only}\ \mathsf{at}\ \mathsf{index}\ \mathsf{segments}\ \mathsf{whose}\ \mathsf{values}\ \mathsf{are}\ \mathsf{compile}-\mathsf{time}\ \mathsf{comparable}\ \mathsf{under}\ \texttt{IndexValue}
\end{array}
$$

**(K-Ordered-Ok)**

$$
\begin{array}{l}
\mathsf{options}.\mathsf{ordered}\quad \operatorname{OrderedComparable}([\operatorname{KeyPath}(p)\ \mid \ p\ \in \ \mathsf{paths}]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{OrderedPathsOk}(\operatorname{KeyBlockStmt}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{kind},\ \mathsf{paths},\ \mathsf{mode},\ \mathsf{options},\ \mathsf{body},\ \mathsf{span}))
\end{array}
$$

**(K-Ordered-Base-Err)**

$$
\begin{array}{l}
\mathsf{options}.\mathsf{ordered}\quad \lnot \ \operatorname{OrderedComparable}([\operatorname{KeyPath}(p)\ \mid \ p\ \in \ \mathsf{paths}])\quad c\ =\ \operatorname{Code}(K-\mathsf{Ordered}-\mathsf{Base}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{KeyBlockStmt}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{kind},\ \mathsf{paths},\ \mathsf{mode},\ \mathsf{options},\ \mathsf{body},\ \mathsf{span})\ \Uparrow \ c
\end{array}
$$

**(K-Ordered-Redundant-Warn)**

$$
\begin{array}{l}
\mathsf{options}.\mathsf{ordered}\quad \operatorname{OrderedComparable}([\operatorname{KeyPath}(p)\ \mid \ p\ \in \ \mathsf{paths}])\quad \operatorname{StaticallyComparableIndices}([\operatorname{KeyPath}(p)\ \mid \ p\ \in \ \mathsf{paths}])\quad w\ =\ \operatorname{Code}(K-\mathsf{Ordered}-\mathsf{Redundant}-\mathsf{Warn}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{WarnKeyBlock}(\operatorname{KeyBlockStmt}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{kind},\ \mathsf{paths},\ \mathsf{mode},\ \mathsf{options},\ \mathsf{body},\ \mathsf{span}))\ \Downarrow \ w
\end{array}
$$

### 19.3.5 Dynamic Semantics

`CanonicalOrder` defines the deterministic acquisition order used by §§19.2.5, 19.4.5, and 19.6.5.

`KeyModeCompatible`, `KeysOverlap`, and `KeyConflict` define the runtime compatibility relation for overlapping keys.

### 19.3.6 Lowering

$$
\begin{array}{l}
\operatorname{LowerConflictChecks}(\mathsf{paths},\ \mathsf{mode})\ \Downarrow \ \mathsf{IR}\ \Leftrightarrow \\[0.16em]
\ \Gamma \ \vdash \ \operatorname{LowerKeyPaths}(\mathsf{paths})\ \Downarrow \ \mathsf{Ps}\ \land \\[0.16em]
\ \mathsf{sorted}\ =\ \operatorname{CanonicalSort}(\mathsf{Ps})\ \land \\[0.16em]
\ \mathsf{IR}\ =\ \operatorname{SeqIRList}([\operatorname{CheckConflict}(P_{i},\ \mathsf{mode})\ \mid \ P_{i}\ \in \ \mathsf{sorted}])
\end{array}
$$

**(Lower-Key-ConflictChecks)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerConflictChecks}(\mathsf{paths},\ \mathsf{mode})\ \Downarrow \ \mathsf{IR} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerKeyChecks}(\mathsf{paths},\ \mathsf{mode})\ \Downarrow \ \mathsf{IR}
\end{array}
$$

### 19.3.7 Diagnostics

| Code         | Severity | Detection    | Condition                                                         |
| ------------ | -------- | ------------ | ----------------------------------------------------------------- |
| `E-CON-0005` | Error    | Compile-time | Write access required but only Read available                     |
| `E-CON-0010` | Error    | Compile-time | Potential conflict on dynamic indices (same statement) (`K-Dynamic-Index-Conflict`) |
| `E-CON-0014` | Error    | Compile-time | `ordered` key option on paths with different array bases (`K-Ordered-Base-Err`) |
| `E-CON-0060` | Error    | Compile-time | Read-then-write on same `shared` path without covering Write key (`K-Read-Write-Reject`) |
| `W-CON-0004` | Warning  | Compile-time | Read-then-write may cause contention if parallelized (`K-RMW-Contention-Warn`) |
| `W-CON-0006` | Warning  | Compile-time | Explicit read-then-write form used; compound assignment available (`K-RMW-Explicit-Warn`) |
| `W-CON-0013` | Warning  | Compile-time | `ordered` key option used with statically-comparable indices (`K-Ordered-Redundant-Warn`) |
