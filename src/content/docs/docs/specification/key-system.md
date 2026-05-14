---
title: "Key System"
description: "19. Key System of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
generatedAt: "2026-05-14T00:55:03.609Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
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

## 19.2 Key Acquisition Blocks

### 19.2.1 Syntax

```text
key_block_stmt ::= "#" key_path_list key_block_mod* key_mode_spec? block_expr
key_path_list  ::= key_path_expr ("," key_path_expr)*
key_block_mod  ::= "dynamic" | "speculative" | "ordered"
key_mode_spec  ::= key_mode | release_modifier
key_mode       ::= "read" | "write"
release_modifier ::= "release" key_mode
```

`ordered` requests the same-base indexed-path checking defined in §19.3.4. Canonical path order remains the deterministic acquisition and conflict-resolution order for key blocks under §§19.2.5 and 19.3.5.

### 19.2.2 Parsing

Key-block parsing is defined by the following source rules:

- `Parse-KeyPathList-Cons`
- `Parse-KeyPathListTail-End`
- `Parse-KeyPathListTail-Comma`
- `Parse-KeyBlockMod-Dynamic`
- `Parse-KeyBlockMod-Ordered`
- `Parse-KeyBlockMod-Speculative`
- `Parse-KeyBlockMod-Release`
- `Parse-KeyBlockModsOpt-None`
- `Parse-KeyBlockModsOpt-Cons`
- `Parse-KeyMode-Read`
- `Parse-KeyMode-Write`
- `Parse-KeyMode-Err`
- `Parse-KeyModeOpt-None`
- `Parse-KeyModeOpt-Some`
- `Parse-KeyBlock-Stmt`

`Parse-KeyBlockMod-Ordered` consumes the keyword `ordered` and contributes `Ordered` to the parsed modifier list. `Parse-KeyBlockMod-Release` consumes `release` followed by the required target mode.

### 19.2.3 AST Representation / Form

$$
\mathsf{KeyMode}\ =\ \{\mathsf{Read},\ \mathsf{Write}\}
$$

$$
\mathsf{KeyModeOpt}\ \in \ \{\bot \}\ \cup \ \mathsf{KeyMode}
$$

$$
\mathsf{KeyBlockMod}\ =\ \{\mathsf{Dynamic},\ \mathsf{Speculative},\ \mathsf{Release},\ \mathsf{Ordered}\}
$$

$$
\mathsf{KeyBlockMods}\ =\ [\mathsf{KeyBlockMod}]
$$

$$
\mathsf{KeyPathList}\ =\ [\mathsf{KeyPathExpr}]
$$

$$
\mathsf{KeyBlockStmt}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{paths},\ \mathsf{mods},\ \mathsf{mode}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span}\rangle 
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
\operatorname{BlockMode}(\operatorname{KeyBlockStmt}(\_,\ \_,\ \_,\ \bot ,\ \_,\ \_))\ =\ \mathsf{Read} \\[0.16em]
\operatorname{BlockMode}(\operatorname{KeyBlockStmt}(\_,\ \_,\ \_,\ \mathsf{Read},\ \_,\ \_))\ =\ \mathsf{Read} \\[0.16em]
\operatorname{BlockMode}(\operatorname{KeyBlockStmt}(\_,\ \_,\ \_,\ \mathsf{Write},\ \_,\ \_))\ =\ \mathsf{Write}
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

Being outside an explicit `#` block does not by itself make an ordinary `shared` access invalid.

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

**Explicit `#` Blocks**

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
\operatorname{AcquireKeysSigma}(\mathsf{paths},\ \mathsf{mode}_{\mathsf{opt}},\ \sigma )\ \Downarrow \ (\sigma ',\ \mathsf{keys})\ \Leftrightarrow  \\[0.16em]
\ \mathsf{mode}\ =\ \operatorname{ModeOf}(\mathsf{mode}_{\mathsf{opt}})\ \land  \\[0.16em]
\ \mathsf{keys}\ =\ \operatorname{CanonicalOrder}([\operatorname{KeyPath}(p)\ \mid \ p\ \in \ \mathsf{paths}])\ \land  \\[0.16em]
\ \forall \ k\ \in \ \mathsf{keys}.\ \operatorname{AcquireLock}(\sigma ,\ k,\ \mathsf{mode})\ \land  \\[0.16em]
\ \sigma '\ =\ \sigma [\mathsf{held}_{\mathsf{keys}}\ :=\ \sigma .\mathsf{held}_{\mathsf{keys}}\ \cup \ \mathsf{keys}]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ReleaseKeysSigma}(\mathsf{keys},\ \sigma )\ \Downarrow \ \sigma '\ \Leftrightarrow  \\[0.16em]
\ \mathsf{rev}\ =\ \operatorname{Reverse}(\mathsf{keys})\ \land  \\[0.16em]
\ \forall \ k\ \in \ \mathsf{rev}.\ \operatorname{ReleaseLock}(\sigma ,\ k)\ \land  \\[0.16em]
\ \sigma '\ =\ \sigma [\mathsf{held}_{\mathsf{keys}}\ :=\ \sigma .\mathsf{held}_{\mathsf{keys}}\ \setminus \ \mathsf{keys}]
\end{array}
$$

$$
\operatorname{ModeOf}(\bot )\ =\ \mathsf{Read}
$$

$$
\operatorname{ModeOf}(\mathsf{Read})\ =\ \mathsf{Read}
$$

$$
\operatorname{ModeOf}(\mathsf{Write})\ =\ \mathsf{Write}
$$

**(ExecSigma-KeyBlock)**

$$
\begin{array}{l}
\mathsf{Speculative}\ \notin \ \mathsf{mods}\quad \mathsf{Release}\ \notin \ \mathsf{mods}\quad \Gamma \ \vdash \ \operatorname{AcquireKeysSigma}(\mathsf{paths},\ \mathsf{mode}_{\mathsf{opt}},\ \sigma )\ \Downarrow \ (\sigma_{1} ,\ \mathsf{keys})\quad \Gamma \ \vdash \ \operatorname{EvalBlockSigma}(\mathsf{body},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )\quad \Gamma \ \vdash \ \operatorname{ReleaseKeysSigma}(\mathsf{keys},\ \sigma_{2} )\ \Downarrow \ \sigma_{3}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{KeyBlockStmt}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{paths},\ \mathsf{mods},\ \mathsf{mode}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span}),\ \sigma )\ \Downarrow \ (\operatorname{StmtOutOf}(\mathsf{out}),\ \sigma_{3} )
\end{array}
$$

**(ExecSigma-KeyBlock-Ctrl)**

$$
\begin{array}{l}
\mathsf{Speculative}\ \notin \ \mathsf{mods}\quad \mathsf{Release}\ \notin \ \mathsf{mods}\quad \Gamma \ \vdash \ \operatorname{AcquireKeysSigma}(\mathsf{paths},\ \mathsf{mode}_{\mathsf{opt}},\ \sigma )\ \Downarrow \ (\sigma_{1} ,\ \mathsf{keys})\quad \Gamma \ \vdash \ \operatorname{EvalBlockSigma}(\mathsf{body},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} )\quad \Gamma \ \vdash \ \operatorname{ReleaseKeysSigma}(\mathsf{keys},\ \sigma_{2} )\ \Downarrow \ \sigma_{3}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{KeyBlockStmt}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{paths},\ \mathsf{mods},\ \mathsf{mode}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{3} )
\end{array}
$$

**(Step-Exec-KeyBlock-Enter)**

$$
\begin{array}{l}
\mathsf{Speculative}\ \notin \ \mathsf{mods}\quad \Gamma \ \vdash \ \operatorname{AcquireKeysSigma}(\mathsf{paths},\ \mathsf{mode}_{\mathsf{opt}},\ \sigma )\ \Downarrow \ (\sigma_{1} ,\ \mathsf{keys}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Exec}(\operatorname{KeyBlockStmt}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{paths},\ \mathsf{mods},\ \mathsf{mode}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span}),\ \sigma )\rangle \ \to \ \langle \operatorname{KeyBody}(\mathsf{keys},\ \mathsf{body},\ \sigma_{1} )\rangle 
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
\mathsf{Speculative}\ \notin \ \mathsf{mods}\quad \mathsf{Release}\ \notin \ \mathsf{mods}\quad \Gamma \ \vdash \ \operatorname{LowerKeyPaths}(\mathsf{paths})\ \Downarrow \ \mathsf{Ps}\quad \mathsf{mode}\ =\ \operatorname{ModeOf}(\mathsf{mode}_{\mathsf{opt}})\quad \mathsf{sorted}\ =\ \operatorname{CanonicalSort}(\mathsf{Ps})\quad S\ =\ \mathsf{CurrentScope} \\[0.16em]
\mathsf{IR}_{\mathsf{enter}}\ =\ \operatorname{SeqIRList}([\operatorname{SeqIR}(\operatorname{CheckConflict}(P_{i},\ \mathsf{mode}),\ \operatorname{AcquireKey}(P_{i},\ \mathsf{mode},\ S))\ \mid \ P_{i}\ \in \ \mathsf{sorted}]) \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerBlock}(\mathsf{body})\ \Downarrow \ \langle \mathsf{IR}_{b},\ v_{b}\rangle  \\[0.16em]
\mathsf{IR}_{\mathsf{exit}}\ =\ \operatorname{SeqIRList}([\operatorname{ReleaseKey}(P_{i},\ S)\ \mid \ P_{i}\ \in \ \operatorname{Reverse}(\mathsf{sorted})]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{KeyBlockStmt}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{paths},\ \mathsf{mods},\ \mathsf{mode}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span}))\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{\mathsf{enter}},\ \mathsf{IR}_{b},\ \mathsf{IR}_{\mathsf{exit}})
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
| `E-CON-0031` | Error    | Compile-time | `#` block path not in scope                                 |
| `E-CON-0032` | Error    | Compile-time | `#` block path is not `shared`                              |
| `E-CON-0070` | Error    | Compile-time | Write operation in `#` block without `write` modifier       |
| `E-CON-0085` | Error    | Compile-time | Escaping closure with `shared` capture lacks dependency set |
| `E-CON-0086` | Error    | Compile-time | Escaping closure outlives captured local `shared` binding   |
| `W-CON-0001` | Warning  | Compile-time | Fine-grained keys in tight loop (performance hint)          |
| `W-CON-0002` | Warning  | Compile-time | Redundant key acquisition (already covered)                 |
| `W-CON-0003` | Warning  | Compile-time | `#` redundant (matches type boundary)                       |
| `W-CON-0009` | Warning  | Compile-time | Closure captures `shared` data                              |

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
\operatorname{KeyPathLess}(p_{1},\ p_{2})\ \Leftrightarrow  \\[0.16em]
\ \mathsf{segments}_{1}\ =\ \operatorname{PathSegments}(p_{1})\ \land  \\[0.16em]
\ \mathsf{segments}_{2}\ =\ \operatorname{PathSegments}(p_{2})\ \land  \\[0.16em]
\ \operatorname{LexLess}(\mathsf{segments}_{1},\ \mathsf{segments}_{2},\ \mathsf{SegmentLess})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{SegmentLess}(s_{1},\ s_{2})\ \Leftrightarrow  \\[0.16em]
\ (\operatorname{IsIdent}(s_{1})\ \land \ \operatorname{IsIdent}(s_{2})\ \land \ \operatorname{Utf8LexLess}(\operatorname{Name}(s_{1}),\ \operatorname{Name}(s_{2})))\ \lor  \\[0.16em]
\ (\operatorname{IsIndex}(s_{1})\ \land \ \operatorname{IsIndex}(s_{2})\ \land \ \operatorname{IndexValue}(s_{1})\ <\ \operatorname{IndexValue}(s_{2}))\ \lor  \\[0.16em]
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
4. Both are references to the same variable binding in scope.
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
P_{1}\ =\ a[e_{1}]\quad P_{2}\ =\ a[e_{2}]\quad \operatorname{SameStatement}(P_{1},\ P_{2})\quad (\operatorname{Dynamic}(e_{1})\ \lor \ \operatorname{Dynamic}(e_{2}))\quad \lnot \ \operatorname{ProvablyDisjoint}(e_{1},\ e_{2}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{Reject}
\end{array}
$$

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
\Gamma \ \vdash \ P\ :\ \texttt{shared}\ T\quad \operatorname{ReadThenWrite}(P,\ S)\quad \lnot \ \exists \ (Q,\ \mathsf{Write},\ S')\ \in \ \Gamma_{\mathsf{keys}} \ :\ \operatorname{Prefix}(Q,\ P) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{Reject}
\end{array}
$$

**(K-RMW-Permitted)**

$$
\begin{array}{l}
\Gamma \ \vdash \ P\ :\ \texttt{shared}\ T\quad \operatorname{ReadThenWrite}(P,\ S)\quad \exists \ (Q,\ \mathsf{Write},\ S')\ \in \ \Gamma_{\mathsf{keys}} \ :\ \operatorname{Prefix}(Q,\ P) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{Permitted}
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
\operatorname{OrderedBase}(P)\ =\ \langle \operatorname{Root}(P),\ \operatorname{NonIndexShape}(P)\rangle  \\[0.16em]
\operatorname{OrderedComparable}(\mathsf{paths})\ \Leftrightarrow \ \forall \ P,\ Q\ \in \ \mathsf{paths}.\ \operatorname{OrderedBase}(P)\ =\ \operatorname{OrderedBase}(Q) \\[0.16em]
\operatorname{StaticallyComparableIndices}(\mathsf{paths})\ \Leftrightarrow \ \forall \ P,\ Q\ \in \ \mathsf{paths}.\ \operatorname{OrderedBase}(P)\ =\ \operatorname{OrderedBase}(Q)\ \Rightarrow \ \operatorname{PathSegments}(P)\ \mathsf{and}\ \operatorname{PathSegments}(Q)\ \mathsf{differ}\ \mathsf{only}\ \mathsf{at}\ \mathsf{index}\ \mathsf{segments}\ \mathsf{whose}\ \mathsf{values}\ \mathsf{are}\ \mathsf{compile}-\mathsf{time}\ \mathsf{comparable}\ \mathsf{under}\ \texttt{IndexValue}
\end{array}
$$

**(K-Ordered-Ok)**

$$
\begin{array}{l}
\mathsf{Ordered}\ \in \ \mathsf{mods}\quad \operatorname{OrderedComparable}([\operatorname{KeyPath}(p)\ \mid \ p\ \in \ \mathsf{paths}]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{OrderedPathsOk}(\operatorname{KeyBlockStmt}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{paths},\ \mathsf{mods},\ \mathsf{mode}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span}))
\end{array}
$$

**(K-Ordered-Base-Err)**

$$
\begin{array}{l}
\mathsf{Ordered}\ \in \ \mathsf{mods}\quad \lnot \ \operatorname{OrderedComparable}([\operatorname{KeyPath}(p)\ \mid \ p\ \in \ \mathsf{paths}])\quad c\ =\ \operatorname{Code}(K-\mathsf{Ordered}-\mathsf{Base}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{KeyBlockStmt}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{paths},\ \mathsf{mods},\ \mathsf{mode}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span})\ \Uparrow \ c
\end{array}
$$

**(K-Ordered-Redundant-Warn)**

$$
\begin{array}{l}
\mathsf{Ordered}\ \in \ \mathsf{mods}\quad \operatorname{OrderedComparable}([\operatorname{KeyPath}(p)\ \mid \ p\ \in \ \mathsf{paths}])\quad \operatorname{StaticallyComparableIndices}([\operatorname{KeyPath}(p)\ \mid \ p\ \in \ \mathsf{paths}])\quad w\ =\ \operatorname{Code}(K-\mathsf{Ordered}-\mathsf{Redundant}-\mathsf{Warn}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{WarnKeyBlock}(\operatorname{KeyBlockStmt}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{paths},\ \mathsf{mods},\ \mathsf{mode}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span}))\ \Downarrow \ w
\end{array}
$$

### 19.3.5 Dynamic Semantics

`CanonicalOrder` defines the deterministic acquisition order used by §§19.2.5, 19.4.5, and 19.6.5.

`KeyModeCompatible`, `KeysOverlap`, and `KeyConflict` define the runtime compatibility relation for overlapping keys.

### 19.3.6 Lowering

$$
\begin{array}{l}
\operatorname{LowerConflictChecks}(\mathsf{paths},\ \mathsf{mode}_{\mathsf{opt}})\ \Downarrow \ \mathsf{IR}\ \Leftrightarrow  \\[0.16em]
\ \Gamma \ \vdash \ \operatorname{LowerKeyPaths}(\mathsf{paths})\ \Downarrow \ \mathsf{Ps}\ \land  \\[0.16em]
\ \mathsf{mode}\ =\ \operatorname{ModeOf}(\mathsf{mode}_{\mathsf{opt}})\ \land  \\[0.16em]
\ \mathsf{sorted}\ =\ \operatorname{CanonicalSort}(\mathsf{Ps})\ \land  \\[0.16em]
\ \mathsf{IR}\ =\ \operatorname{SeqIRList}([\operatorname{CheckConflict}(P_{i},\ \mathsf{mode})\ \mid \ P_{i}\ \in \ \mathsf{sorted}])
\end{array}
$$

**(Lower-Key-ConflictChecks)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerConflictChecks}(\mathsf{paths},\ \mathsf{mode}_{\mathsf{opt}})\ \Downarrow \ \mathsf{IR} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerKeyChecks}(\mathsf{paths},\ \mathsf{mode}_{\mathsf{opt}})\ \Downarrow \ \mathsf{IR}
\end{array}
$$

### 19.3.7 Diagnostics

| Code         | Severity | Detection    | Condition                                                         |
| ------------ | -------- | ------------ | ----------------------------------------------------------------- |
| `E-CON-0005` | Error    | Compile-time | Write access required but only Read available                     |
| `E-CON-0010` | Error    | Compile-time | Potential conflict on dynamic indices (same statement)            |
| `E-CON-0014` | Error    | Compile-time | `ordered` modifier on paths with different array bases            |
| `E-CON-0060` | Error    | Compile-time | Read-then-write on same `shared` path without covering Write key  |
| `W-CON-0004` | Warning  | Compile-time | Read-then-write may cause contention if parallelized              |
| `W-CON-0006` | Warning  | Compile-time | Explicit read-then-write form used; compound assignment available |
| `W-CON-0013` | Warning  | Compile-time | `ordered` modifier used with statically-comparable indices        |

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

## 19.6 Dynamic Key Verification

### 19.6.1 Syntax

This section introduces no additional surface syntax. `[[dynamic]]` attribute syntax is defined by Chapter 9.

### 19.6.2 Parsing

This section introduces no additional parsing rules beyond the generic attribute parser in Chapter 9.

### 19.6.3 AST Representation / Form

$$
\operatorname{StaticallySafe}(P)\ \mathsf{is}\ \mathsf{classified}\ \mathsf{by}\ \mathsf{the}\ \mathsf{following}\ \mathsf{source}\ \mathsf{conditions}:
$$

| Condition            | Description                                                 | Rule   |
| -------------------- | ----------------------------------------------------------- | ------ |
| `No escape`          | `shared` value never escapes to another task                | K-SS-1 |
| `Disjoint paths`     | Concurrent accesses target provably disjoint paths          | K-SS-2 |
| `Sequential context` | No `parallel` block encloses the access                     | K-SS-3 |
| `Unique origin`      | Value is `unique` at origin, temporarily viewed as `shared` | K-SS-4 |
| `Dispatch-indexed`   | Access indexed by `dispatch` iteration variable             | K-SS-5 |
| `Speculative-only`   | All accesses occur within speculative blocks with fallback  | K-SS-6 |

`StaticallySafe(P)` is a conservative compile-time judgment.

The conditions above describe sufficient proof shapes for omitting runtime synchronization.

An implementation MUST treat `StaticallySafe(P)` as false unless it can establish a complete sound proof for the concrete access. Uncertainty is not success.

### 19.6.4 Static Semantics

**(K-Static-Safe)**
Access(P, M)    StaticallySafe(P)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{NoRuntimeSync}(P)
\end{array}
$$

`NoRuntimeSync(P)` means that runtime synchronization is not required for correctness of the access.

An implementation MAY omit runtime synchronization for `P`, or MAY conservatively retain equivalent synchronization, provided observable behavior is preserved.

**(K-Static-Required)**

$$
\begin{array}{l}
\lnot \ \operatorname{StaticallySafe}(P)\quad \lnot \ \mathsf{InDynamicContext} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{Reject}
\end{array}
$$

### 19.6.5 Dynamic Semantics

When runtime synchronization is required:

1. Mutual exclusion is enforced by `KeyConflict` and `KeyModeCompatible` from §19.3.5.
2. Incompatible acquisitions block until release.
3. Keys are released on scope exit, including panic.
4. Implementations MUST guarantee eventual progress when conflicting holders eventually release.

Within `[[dynamic]]`, incomparable dynamic indices require a runtime ordering relation satisfying:

1. Totality.
2. Antisymmetry.
3. Transitivity.
4. Cross-task consistency.
5. Value-determinism.

An implementation MAY conservatively coarsen a non-statically-safe dynamic indexed path to a static prefix that soundly covers every runtime index reachable by the access.

When such conservative coarsening is used, runtime synchronization is performed on the coarsened path rather than on per-index dynamic keys. This is conforming iff the coarsened path preserves mutual exclusion and observational equivalence.

If all tasks acquire keys in `CanonicalOrder`, no circular wait can occur.

If a task waits for a key and all conflicting holders eventually release, the task eventually acquires the key.

Observable behavior under statically-proven key safety and under runtime synchronization MUST be observationally equivalent.

### 19.6.6 Lowering

**(K-Dynamic-Permitted)**

$$
\begin{array}{l}
\lnot \ \operatorname{StaticallySafe}(P)\quad \mathsf{InDynamicContext} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{EmitRuntimeSync}(P)
\end{array}
$$

When `InDynamicContext` and `StaticallySafe(P)` both hold, runtime synchronization is not required. An implementation MAY omit it or conservatively retain equivalent synchronization.

### 19.6.7 Diagnostics

| Code         | Severity | Detection    | Condition                                                |
| ------------ | -------- | ------------ | -------------------------------------------------------- |
| `E-CON-0020` | Error    | Compile-time | Key safety not statically provable outside `[[dynamic]]` |
| `I-CON-0011` | Info     | Compile-time | Runtime synchronization emitted under `[[dynamic]]`      |
| `I-CON-0013` | Info     | Compile-time | Static key safety proven under `[[dynamic]]`             |

## 19.7 Memory Ordering

### 19.7.1 Syntax

```text
memory_order_attribute ::= "[[" memory_order "]]"
memory_order           ::= "relaxed" | "acquire" | "release" | "acqrel" | "seqcst"
fence_expr             ::= "fence" "(" fence_order ")"
fence_order            ::= "acquire" | "release" | "seqcst"
```

### 19.7.2 Parsing

Memory-order attributes use the generic attribute parser in Chapter 9.

This section defines the surface grammar `fence_expr ::= "fence" "(" fence_order ")"`. No separate named parser helper beyond ordinary expression parsing is introduced here.

### 19.7.3 AST Representation / Form

Memory-order attributes are attached through the generic attribute forms owned by Chapter 9.

$$
\begin{array}{l}
\mathsf{FenceOrder}\ =\ \{\texttt{acquire},\ \texttt{release},\ \texttt{seqcst}\} \\[0.16em]
\mathsf{Expr}\ =\ \ldots \ \mid \ \operatorname{FenceExpr}(\mathsf{order})\ \mid \ \ldots 
\end{array}
$$

$$
\operatorname{EffectiveOrdering}(e)\ \mathsf{is}\ \mathsf{defined}\ \mathsf{by}\ \mathsf{nearest}-\mathsf{override}\ \mathsf{precedence}:
$$

1. The nearest enclosing expression-level memory-order attribute on `e`.
2. Else the nearest enclosing key-block default memory-order attribute.
3. Else `seqcst`.

### 19.7.4 Static Semantics

Memory accesses default to sequentially consistent ordering.

Key acquisition uses acquire semantics. Key release uses release semantics.

Ordering levels:

| Ordering  | Guarantee                                 |
| --------- | ----------------------------------------- |
| `relaxed` | Atomicity only; no ordering               |
| `acquire` | Subsequent reads see prior writes         |
| `release` | Prior writes are visible to acquire reads |
| `acqrel`  | Both acquire and release                  |
| `seqcst`  | Total global order                        |

Memory-order attributes MAY be attached to:

1. A key-block statement, establishing a default ordering for keyed or shared accesses in that body.
2. An attributed expression, overriding any enclosing key-block default for that expression subtree.

A key block or attributed expression MUST carry at most one memory-order attribute.

Expression-level memory-order attributes are well-formed only when the attributed expression contains keyed or shared-data access.

Memory-order attributes affect only data-access ordering. They MUST NOT alter key acquire or key release semantics.

Memory-order annotations MUST NOT appear inside speculative blocks.

**(T-Fence)**

$$
\begin{array}{l}
O\ \in \ \{\texttt{acquire},\ \texttt{release},\ \texttt{seqcst}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \texttt{fence}(O)\ :\ ()
\end{array}
$$

Fence operations MAY appear in runtime expression contexts. They MUST NOT alter the held-key context.

### 19.7.5 Dynamic Semantics

Evaluation of `fence(O)`:

1. Evaluate `fence(O)` at the current expression evaluation point.
2. Emit ordering event `Fence(O)`.
3. Produce value `()`.

Required ordering constraints:

1. `fence(acquire)`: operations sequenced after the fence MUST NOT be reordered before it.
2. `fence(release)`: operations sequenced before the fence MUST NOT be reordered after it.
3. `fence(seqcst)`: acquire and release constraints both hold, and all `Fence(seqcst)` events and `[[seqcst]]` accesses participate in one global total order consistent with each task's sequenced-before order.

Fence evaluation MUST NOT read or write program-visible storage.

### 19.7.6 Lowering

**(Lower-Expr-Fence)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{FenceExpr}(\mathsf{order}))\ \Downarrow \ \langle \operatorname{FenceIR}(\mathsf{order}),\ \mathsf{UnitVal}\rangle 
\end{array}
$$

**(Lower-Ordered-Access)**

$$
\begin{array}{l}
\operatorname{ContainsSharedAccess}(e)\quad \mathsf{ord}\ =\ \operatorname{EffectiveOrdering}(e)\quad \Gamma \ \vdash \ \operatorname{LowerExprCore}(e)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \operatorname{OrderedAccessIR}(\mathsf{ord},\ \mathsf{IR}),\ v\rangle 
\end{array}
$$

### 19.7.7 Diagnostics

No additional named diagnostics are introduced here. The speculative-block restriction on memory-order annotations and fence operations is owned by §19.5.7.
