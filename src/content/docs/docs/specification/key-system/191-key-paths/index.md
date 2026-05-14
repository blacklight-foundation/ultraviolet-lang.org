---
title: "19.1 Key Paths"
description: "19.1 Key Paths from 19. Key System of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "key-system"
specSection: "191-key-paths"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
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

Key-path parsing is defined by the following source rules:

- `Parse-KeyMarkerOpt-Yes`
- `Parse-KeyMarkerOpt-No`
- `Parse-KeyField`
- `Parse-KeyIndex`
- `Parse-KeySegs-End`
- `Parse-KeySegs-Field`
- `Parse-KeySegs-Index`
- `Parse-KeyPathExpr`

`Parse-KeyPathExpr` parses an identifier root followed by zero or more field or index segments. `#` markers are parsed by `Parse-KeyMarkerOpt-*` and validated during key-path well-formedness.

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
