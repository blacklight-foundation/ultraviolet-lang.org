---
title: "19.1 Key Paths"
description: "19.1 Key Paths from 19. Key System of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "key-system"
specSection: "191-key-paths"
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

## 19.1 Key Paths

### 19.1.1 Syntax

```text
key_path_expr ::= key_root key_seg*
key_root      ::= identifier
key_seg       ::= "." key_field | "[" key_index "]"
key_field     ::= key_marker? identifier
key_index     ::= key_marker? expression
key_marker    ::= "#"
```

### 19.1.2 Parsing

**(Parse-KeyMarkerOpt-Yes)**
IsOp(Tok(P), "#")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseKeyMarkerOpt}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \mathsf{true})
\end{array}
$$

**(Parse-KeyMarkerOpt-No)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"\#"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseKeyMarkerOpt}(P)\ \Downarrow \ (P,\ \mathsf{false})
\end{array}
$$

**(Parse-KeyField)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseKeyMarkerOpt}(P)\ \Downarrow \ (P_{1},\ m)\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{name}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseKeyField}(P)\ \Downarrow \ (P_{2},\ \operatorname{Field}(m,\ \mathsf{name}))
\end{array}
$$

**(Parse-KeyIndex)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"["})\quad \Gamma \ \vdash \ \operatorname{ParseKeyMarkerOpt}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ m)\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(P_{1})\ \Downarrow \ (P_{2},\ e)\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{"]"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseKeyIndex}(P)\ \Downarrow \ (\operatorname{Advance}(P_{2}),\ \operatorname{Index}(m,\ e))
\end{array}
$$

**(Parse-KeySegs-Field)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"."})\quad \Gamma \ \vdash \ \operatorname{ParseKeyField}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{seg})\quad \Gamma \ \vdash \ \operatorname{ParseKeySegs}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{segs}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseKeySegs}(P)\ \Downarrow \ (P_{2},\ [\mathsf{seg}]\ \mathbin{++} \ \mathsf{segs})
\end{array}
$$

**(Parse-KeySegs-Index)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"["})\quad \Gamma \ \vdash \ \operatorname{ParseKeyIndex}(P)\ \Downarrow \ (P_{1},\ \mathsf{seg})\quad \Gamma \ \vdash \ \operatorname{ParseKeySegs}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{segs}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseKeySegs}(P)\ \Downarrow \ (P_{2},\ [\mathsf{seg}]\ \mathbin{++} \ \mathsf{segs})
\end{array}
$$

**(Parse-KeySegs-End)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"."})\quad \lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"["}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseKeySegs}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-KeyPathExpr)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseIdent}(P)\ \Downarrow \ (P_{1},\ \mathsf{root})\quad \Gamma \ \vdash \ \operatorname{ParseKeySegs}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{segs}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseKeyPathExpr}(P)\ \Downarrow \ (P_{2},\ \langle \mathsf{root},\ \mathsf{segs}\rangle )
\end{array}
$$

`Parse-KeyPathExpr` parses an identifier root followed by zero or more field or index segments. `#` markers are parsed by `ParseKeyMarkerOpt` inside field and index segments and validated during key-path well-formedness (§19.1.4).

### 19.1.3 AST Representation / Form

$$
\mathsf{KeySeg}\ =\ \{\operatorname{Field}(\mathsf{marked},\ \mathsf{name}),\ \operatorname{Index}(\mathsf{marked},\ \mathsf{expr})\}
$$

$$
\mathsf{KeyPathExpr}\ =\ \langle \mathsf{root},\ \mathsf{segs}\rangle
$$

$$
\begin{array}{l}
\mathsf{ResolveKeyPathJudg}\ =\ \{ \\[0.16em]
\ \mathsf{ResolveKeySeg}, \\[0.16em]
\ \mathsf{ResolveKeySegs}, \\[0.16em]
\ \mathsf{ResolveKeyPathExpr} \\[0.16em]
\}
\end{array}
$$

### 19.1.4 Static Semantics

**Path Well-Formedness**

A key path is well-formed iff each segment is valid for the type of the preceding segment. A key path MUST contain at most one `#` marker.

Key analysis is performed iff the path root has `shared` permission. Paths rooted in `const` or `unique` data do not require keys.

**Path Root Extraction**

$$
\mathsf{Define}\ \texttt{Root(e)}\ \mathsf{for}\ \mathsf{place}\ \mathsf{expressions}\ \mathsf{recursively}:
$$

$$
\begin{array}{l}
\operatorname{Root}(e)\ = \\[0.16em]
\ x\quad \mathsf{if}\ e\ =\ x \\[0.16em]
\ \operatorname{Root}(e')\quad \mathsf{if}\ e\ =\ e'.f \\[0.16em]
\ \operatorname{Root}(e')\quad \mathsf{if}\ e\ =\ e'[i] \\[0.16em]
\ \operatorname{Root}(e')\quad \mathsf{if}\ e\ =\ e'\ \sim{}>\ \operatorname{m}(\ldots ) \\[0.16em]
\ \bot_{\mathsf{boundary}} \quad \mathsf{if}\ e\ =\ (*e')
\end{array}
$$

$$
\mathsf{where}\ \texttt{bottom\_boundary}\ \mathsf{denotes}\ a\ \mathsf{key}\ \mathsf{boundary}\ \mathsf{introduced}\ \mathsf{by}\ \mathsf{pointer}\ \mathsf{dereference}.
$$

**Object Identity**

The identity of a reference or pointer `r`, written `id(r)`, is a unique runtime value denoting the storage location referred to by `r`.

Implementations MUST ensure:

1. `id(r_1) = id(r_2)` iff `r_1` and `r_2` refer to overlapping storage.
2. `id(r)` remains constant for the lifetime of the referent.
3. Identities are not directly observable except through key semantics.

**KeyPath Formation**

Let `e` be a place expression accessing `shared` data and let the field/index tail of `e` be `p_2 ... p_n`.

- If `Root(e) = x`, then `KeyPath(e) = x.p_2 ... p_n`, truncated by any type-level boundary.
- If `Root(e) = ⊥_boundary` and `e = (*e').p_2 ... p_n`, then `KeyPath(e) = id(*e').p_2 ... p_n`, truncated by any type-level boundary.

For `(*e').p` where `e' : shared Ptr<T>@Valid`:

1. Dereferencing `e'` requires a key to `KeyPath(e')` in `Read` mode.
2. Accessing `.p` on the dereferenced value uses a fresh key rooted at `id(*e')`.

**`shared` Dynamic Class Objects**

Dynamic class objects (`$Cl`) MAY be qualified with `shared` permission only if every vtable-eligible procedure in the class, including inherited procedures, has a `const` receiver (`~`).

Let `DynMethods(Cl)` denote the set of procedures callable by vtable dispatch on `$Cl`.

**(K-Witness-Shared-WF)**

$$
\begin{array}{l}
\forall \ m\ \in \ \operatorname{DynMethods}(\mathsf{Cl}).\ m.\mathsf{receiver}\ =\ \texttt{\~{}} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \texttt{shared}\ \$\mathsf{Cl}\ \mathsf{wf}
\end{array}
$$

If any method requires `shared` (`~%`) or `unique` (`~!`) receiver permission, `shared $Cl` is ill-formed.

### 19.1.5 Dynamic Semantics

Runtime key roots derived from `id(r)` MUST satisfy the uniqueness, stability, and opacity constraints of §19.1.4.

For a call `e~>m(args)` where `e : shared $Cl`, the key mode is `Read` and the key path is the root of `e`:

$$
\operatorname{KeyPath}(e\sim{}>\operatorname{m}(\ldots ))\ =\ \operatorname{Root}(e)
$$

### 19.1.6 Lowering

$$
\mathsf{KeyLowerJudg}\ =\ \{\mathsf{LowerKeyPath},\ \mathsf{LowerKeyAccess}\}
$$

$$
\mathsf{KeyIR}\ =\ \{\operatorname{AcquireKey}(\mathsf{path},\ \mathsf{mode},\ \mathsf{scope}),\ \operatorname{ReleaseKey}(\mathsf{path},\ \mathsf{scope}),\ \operatorname{CheckConflict}(\mathsf{path},\ \mathsf{mode}),\ \operatorname{FenceIR}(\mathsf{order})\}
$$

**(Lower-KeyPath)**

$$
\begin{array}{l}
\operatorname{KeyPath}(e)\ =\ P \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerKeyPath}(e)\ \Downarrow \ P
\end{array}
$$

**(Lower-KeyAccess-Uncovered)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerKeyPath}(e)\ \Downarrow \ P\quad M\ =\ \operatorname{RequiredMode}(e)\quad \lnot \ \operatorname{Covered}(P,\ M,\ \Gamma_{\mathsf{keys}} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerKeyAccess}(e)\ \Downarrow \ \operatorname{SeqIR}(\operatorname{CheckConflict}(P,\ M),\ \operatorname{AcquireKey}(P,\ M,\ \mathsf{CurrentScope}))
\end{array}
$$

**(Lower-KeyAccess-Covered)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerKeyPath}(e)\ \Downarrow \ P\quad M\ =\ \operatorname{RequiredMode}(e)\quad \operatorname{Covered}(P,\ M,\ \Gamma_{\mathsf{keys}} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerKeyAccess}(e)\ \Downarrow \ \varepsilon
\end{array}
$$

### 19.1.7 Diagnostics

| Code         | Severity | Detection    | Condition                                         |
| ------------ | -------- | ------------ | ------------------------------------------------- |
| `E-CON-0002` | Error    | Compile-time | `#` annotation on non-`shared` path               |
| `E-CON-0003` | Error    | Compile-time | Multiple `#` markers in single path expression    |
| `E-CON-0030` | Error    | Compile-time | `#` immediately before method name                |
| `E-CON-0033` | Error    | Compile-time | `#` on field of non-record type                   |
| `E-CON-0034` | Error    | Compile-time | Key path root cannot be derived for shared access |
| `E-CON-0083` | Error    | Compile-time | `shared $Class` where class has `~%`/`~!` methods |
