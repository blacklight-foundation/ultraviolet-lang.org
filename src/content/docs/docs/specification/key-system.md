---
title: "Key System"
description: "19. Key System of the Ultraviolet language specification."
specSource: "../../Ultraviolet/SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T13:48:04.933Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## 19. Key System

### 19.1 Key Paths

#### 19.1.1 Syntax

```text
```

key_path_expr ::= key_root key_seg*
key_root      ::= identifier
key_seg       ::= "." key_field | "[" key_index "]"
key_field     ::= key_marker? identifier
key_index     ::= key_marker? expression
key_marker    ::= "#"
```

#### 19.1.2 Parsing

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

#### 19.1.3 AST Representation / Form

KeySeg = {Field(marked, name), Index(marked, expr)}

```text
KeyPathExpr = ⟨root, segs⟩

ResolveKeyPathJudg = {
  ResolveKeySeg,
  ResolveKeySegs,
  ResolveKeyPathExpr
}

#### 19.1.4 Static Semantics

**Path Well-Formedness**

A key path is well-formed iff each segment is valid for the type of the preceding segment. A key path MUST contain at most one `#` marker.

Key analysis is performed iff the path root has `shared` permission. Paths rooted in `const` or `unique` data do not require keys.

**Path Root Extraction**

Define `Root(e)` for place expressions recursively:

Root(e) =
 x                 if e = x
 Root(e')          if e = e'.f
 Root(e')          if e = e'[i]
 Root(e')          if e = e' ~> m(...)

```text
 ⊥_boundary        if e = (*e')

```text
where `⊥_boundary` denotes a key boundary introduced by pointer dereference.

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

```text
∀ m ∈ DynMethods(Cl). m.receiver = `~`
──────────────────────────────────────────────

```text
Γ ⊢ `shared` $Cl wf

If any method requires `shared` (`~%`) or `unique` (`~!`) receiver permission, `shared $Cl` is ill-formed.

#### 19.1.5 Dynamic Semantics

Runtime key roots derived from `id(r)` MUST satisfy the uniqueness, stability, and opacity constraints of §19.1.4.

For a call `e~>m(args)` where `e : shared $Cl`, the key mode is `Read` and the key path is the root of `e`:

KeyPath(e~>m(...)) = Root(e)

#### 19.1.6 Lowering

KeyLowerJudg = {LowerKeyPath, LowerKeyAccess}

KeyIR = {AcquireKey(path, mode, scope), ReleaseKey(path, scope), CheckConflict(path, mode), FenceIR(order)}

**(Lower-KeyPath)**
KeyPath(e) = P
──────────────────────────────────────────────

```text
Γ ⊢ LowerKeyPath(e) ⇓ P

**(Lower-KeyAccess-Uncovered)**

```text
Γ ⊢ LowerKeyPath(e) ⇓ P    M = RequiredMode(e)    ¬ Covered(P, M, Γ_keys)
────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerKeyAccess(e) ⇓ SeqIR(CheckConflict(P, M), AcquireKey(P, M, CurrentScope))

**(Lower-KeyAccess-Covered)**

```text
Γ ⊢ LowerKeyPath(e) ⇓ P    M = RequiredMode(e)    Covered(P, M, Γ_keys)
────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerKeyAccess(e) ⇓ ε

#### 19.1.7 Diagnostics

| Code         | Severity | Detection    | Condition                                         |
| ------------ | -------- | ------------ | ------------------------------------------------- |
| `E-CON-0002` | Error    | Compile-time | `#` annotation on non-`shared` path               |
| `E-CON-0003` | Error    | Compile-time | Multiple `#` markers in single path expression    |
| `E-CON-0030` | Error    | Compile-time | `#` immediately before method name                |
| `E-CON-0033` | Error    | Compile-time | `#` on field of non-record type                   |
| `E-CON-0034` | Error    | Compile-time | Key path root cannot be derived for shared access |
| `E-CON-0083` | Error    | Compile-time | `shared $Class` where class has `~%`/`~!` methods |

### 19.2 Key Acquisition Blocks

#### 19.2.1 Syntax

```text
```

key_block_stmt ::= "#" key_path_list key_block_mod* key_mode_spec? block_expr
key_path_list  ::= key_path_expr ("," key_path_expr)*
key_block_mod  ::= "dynamic" | "speculative" | "ordered"
key_mode_spec  ::= key_mode | release_modifier
key_mode       ::= "read" | "write"
release_modifier ::= "release" key_mode
```

`ordered` requests the same-base indexed-path checking defined in §19.3.4. Canonical path order remains the deterministic acquisition and conflict-resolution order for key blocks under §§19.2.5 and 19.3.5.

#### 19.2.2 Parsing

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

#### 19.2.3 AST Representation / Form

KeyMode = {Read, Write}

```text
KeyModeOpt ∈ {⊥} ∪ KeyMode

KeyBlockMod = {Dynamic, Speculative, Release, Ordered}

KeyBlockMods = [KeyBlockMod]

KeyPathList = [KeyPathExpr]

```text
KeyBlockStmt = ⟨attrs_opt, paths, mods, mode_opt, body, span⟩

```text
Key = ⟨Path, Mode, Scope⟩

```text
Γ_keys : ProgramPoint → ℘(Key)

```text
Held(P, M, S, Γ_keys, p) ⇔ (P, M, S) ∈ Γ_keys(p)

#### 19.2.4 Static Semantics

**Key Triple**

A key consists of `Path`, `Mode`, and `Scope`.

`Read` permits read-only access. Multiple `Read` keys to overlapping paths MAY coexist.

`Write` permits read and write access. A `Write` key excludes all other keys to overlapping paths.

Mode ordering:

Read < Write

```text
ModeSufficient(M_held, M_required) ⇔ M_required ≤ M_held

```text
BlockMode(KeyBlockStmt(_, _, _, ⊥, _, _)) = Read
BlockMode(KeyBlockStmt(_, _, _, Read, _, _)) = Read
BlockMode(KeyBlockStmt(_, _, _, Write, _, _)) = Write

**(K-Mode-Read)**

```text
Γ ⊢ e : `shared` T    ReadContext(e)
────────────────────────────────────
RequiredMode(e) = Read

**(K-Mode-Write)**

```text
Γ ⊢ e : `shared` T    WriteContext(e)
─────────────────────────────────────
RequiredMode(e) = Write

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

```text
Acquire(P, M, S, Γ_keys) = Γ_keys ∪ {(P, M, S)}

```text
Release(P, Γ_keys) = Γ_keys \ {(P, M, S) : (P, M, S) ∈ Γ_keys}

```text
ReleaseScope(S, Γ_keys) = Γ_keys \ {(P, M, S') : S' = S}

```text
ModeTransition(P, M_new, Γ_keys) = (Γ_keys \ {(P, M_old, S)}) ∪ {(P, M_new, S)}

```text
PanicRelease(S, Γ_keys) = Γ_keys \ {(P, M, S') : S' ≤_nest S}

**Implicit Acquisition**

```text
Covered(Q, M_Q, Γ_keys) ⇔ ∃ (P, M_P, S) ∈ Γ_keys : Prefix(P, Q) ∧ ModeSufficient(M_P, M_Q)

**Valid Key Context**

For an ordinary `shared` access `e`, a valid key context exists iff `KeyPath(e)` and `RequiredMode(e)` are both defined and no Chapter 19 scope/escape rule forbids the access.

```text
If `Covered(KeyPath(e), RequiredMode(e), Γ_keys)` holds, the access reuses the existing key context.

Otherwise the ordinary access establishes an implicit acquisition as defined by **(Lower-KeyAccess-Uncovered)** in §19.1.6.

Being outside an explicit `#` block does not by itself make an ordinary `shared` access invalid.

**(K-Acquire-New)**

```text
Γ ⊢ P : `shared` T    M = RequiredMode(P)    ¬ Covered(P, M, Γ_keys)    S = CurrentScope
──────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ'_keys = Γ_keys ∪ {(P, M, S)}

**(K-Acquire-Covered)**

```text
Γ ⊢ P : `shared` T    M = RequiredMode(P)    Covered(P, M, Γ_keys)
──────────────────────────────────────────────────────────────

```text
Γ'_keys = Γ_keys

Subexpressions are evaluated left-to-right, depth-first. Key acquisition follows evaluation order.

**Explicit `#` Blocks**

**(K-Block-Acquire)**

```text
Γ ⊢ P_1, …, P_m : `shared` T_i    M = BlockMode(B)    (Q_1, …, Q_m) = CanonicalSort(P_1, …, P_m)    S = NewScope
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ'_keys = Γ_keys ∪ {(Q_i, M, S) : i ∈ 1..m}

**(K-Read-Block-No-Write)**

```text
BlockMode(B) = Read    P ∈ KeyedPaths(B)    WriteOf(P) ∈ Body(B)
──────────────────────────────────────────────────────────────────────────────
Reject

**Key Coarsening**

The `#` marker in a path expression sets the acquisition granularity. The key is acquired at the marked position and covers all subsequent segments.

**(K-Coarsen-Inline)**

```text
P = p_1 … p_(k-1).#p_k … p_n    Γ ⊢ P : `shared` T    M = RequiredMode(P)
────────────────────────────────────────────────────────────────────────────

```text
AcquireKey(p_1 … p_k, M, Γ_keys)

A field declaration marked with `#` establishes a permanent key boundary. Key paths truncate at that field boundary.

**Closure Capture of `shared` Bindings**

Dependency-set formation for escaping closures is defined in §16.9.4. Chapter 19 consumes that dependency information for key acquisition.

Let `SharedCaptures(C)` be the set of captured bindings with `shared` permission.

For a local closure, key analysis treats the closure body as executing in the defining scope:

KeyPath(C, x.p) = KeyPath(x.p)

For an escaping closure, key paths are rooted at runtime identities of captured references:

**(K-Closure-Escape-Keys)**

```text
C : |vec_T| → R [`shared`: deps]    Access(x.p, M) ∈ C.body
─────────────────────────────────────────────────────────────────────────────
KeyPath(C, x.p) = id(C.x).p

An escaping closure MUST NOT outlive any captured local `shared` binding.

For correctness, escaping-closure key acquisition is required to cover the runtime identity of the captured reference.

An implementation MAY conservatively coarsen `id(C.x).p` to a stable closure-capture-rooted key prefix, provided the coarsened key soundly covers every runtime identity reachable through `C.x` and preserves observational equivalence.

#### 19.2.5 Dynamic Semantics

**Common Key-Block Execution**

`CanonicalOrder`, `CanonicalSort`, and conflict relations are defined in §19.3.5.

KeyBlockJudg = {AcquireKeysSigma, ReleaseKeysSigma}

```text
AcquireKeysSigma(paths, mode_opt, σ) ⇓ (σ', keys) ⇔
  mode = ModeOf(mode_opt) ∧

```text
  keys = CanonicalOrder([KeyPath(p) | p ∈ paths]) ∧

```text
  ∀ k ∈ keys. AcquireLock(σ, k, mode) ∧

```text
  σ' = σ[held_keys := σ.held_keys ∪ keys]

```text
ReleaseKeysSigma(keys, σ) ⇓ σ' ⇔
  rev = Reverse(keys) ∧

```text
  ∀ k ∈ rev. ReleaseLock(σ, k) ∧

```text
  σ' = σ[held_keys := σ.held_keys ∖ keys]

```text
ModeOf(⊥) = Read

ModeOf(Read) = Read

ModeOf(Write) = Write

**(ExecSigma-KeyBlock)**

```text
Speculative ∉ mods    Release ∉ mods    Γ ⊢ AcquireKeysSigma(paths, mode_opt, σ) ⇓ (σ_1, keys)    Γ ⊢ EvalBlockSigma(body, σ_1) ⇓ (out, σ_2)    Γ ⊢ ReleaseKeysSigma(keys, σ_2) ⇓ σ_3
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ExecSigma(KeyBlockStmt(attrs_opt, paths, mods, mode_opt, body, span), σ) ⇓ (StmtOutOf(out), σ_3)

**(ExecSigma-KeyBlock-Ctrl)**

```text
Speculative ∉ mods    Release ∉ mods    Γ ⊢ AcquireKeysSigma(paths, mode_opt, σ) ⇓ (σ_1, keys)    Γ ⊢ EvalBlockSigma(body, σ_1) ⇓ (Ctrl(κ), σ_2)    Γ ⊢ ReleaseKeysSigma(keys, σ_2) ⇓ σ_3
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ExecSigma(KeyBlockStmt(attrs_opt, paths, mods, mode_opt, body, span), σ) ⇓ (Ctrl(κ), σ_3)

**(Step-Exec-KeyBlock-Enter)**

```text
Speculative ∉ mods    Γ ⊢ AcquireKeysSigma(paths, mode_opt, σ) ⇓ (σ_1, keys)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨Exec(KeyBlockStmt(attrs_opt, paths, mods, mode_opt, body, span), σ)⟩ → ⟨KeyBody(keys, body, σ_1)⟩

**(Step-Exec-KeyBlock-Body)**

```text
Γ ⊢ EvalBlockSigma(body, σ) ⇓ (out, σ_1)
────────────────────────────────────────────────────────────────────

```text
⟨KeyBody(keys, body, σ)⟩ → ⟨KeyExit(keys, out, σ_1)⟩

**(Step-Exec-KeyBlock-Exit-Ok)**

```text
Γ ⊢ ReleaseKeysSigma(keys, σ) ⇓ σ'    StmtOutOf(out) = ok
──────────────────────────────────────────────────────────────────────────────

```text
⟨KeyExit(keys, out, σ)⟩ → ⟨ExecDone(σ')⟩

**(Step-Exec-KeyBlock-Exit-Ctrl)**

```text
Γ ⊢ ReleaseKeysSigma(keys, σ) ⇓ σ'    StmtOutOf(out) = Ctrl(κ)
───────────────────────────────────────────────────────────────────────────────

```text
⟨KeyExit(keys, out, σ)⟩ → ⟨ExecCtrl(κ, σ')⟩

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

#### 19.2.6 Lowering

```text
LowerKeyPaths([]) ⇓ []

```text
LowerKeyPaths([p] ++ ps) ⇓ [P] ++ Ps ⇔ Γ ⊢ LowerKeyPath(p) ⇓ P ∧ Γ ⊢ LowerKeyPaths(ps) ⇓ Ps

**(Lower-Stmt-KeyBlock)**

```text
Speculative ∉ mods    Release ∉ mods    Γ ⊢ LowerKeyPaths(paths) ⇓ Ps    mode = ModeOf(mode_opt)    sorted = CanonicalSort(Ps)    S = CurrentScope

```text
IR_enter = SeqIRList([SeqIR(CheckConflict(P_i, mode), AcquireKey(P_i, mode, S)) | P_i ∈ sorted])

```text
Γ ⊢ LowerBlock(body) ⇓ ⟨IR_b, v_b⟩

```text
IR_exit = SeqIRList([ReleaseKey(P_i, S) | P_i ∈ Reverse(sorted)])
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerStmt(KeyBlockStmt(attrs_opt, paths, mods, mode_opt, body, span)) ⇓ SeqIR(IR_enter, IR_b, IR_exit)

#### 19.2.7 Diagnostics

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

### 19.3 Conflict Detection

#### 19.3.1 Syntax

This section introduces no additional surface syntax beyond §19.1.1 and §19.2.1.

#### 19.3.2 Parsing

This section introduces no additional parsing rules.

#### 19.3.3 AST Representation / Form

```text
Prefix(p_1 … p_m, q_1 … q_n) ⇔ m ≤ n ∧ ∀ i ∈ 1..m, p_i ≡_seg q_i

```text
Disjoint(P, Q) ⇔ ¬ Prefix(P, Q) ∧ ¬ Prefix(Q, P)

```text
KeyPathLess(p_1, p_2) ⇔
  segments_1 = PathSegments(p_1) ∧
  segments_2 = PathSegments(p_2) ∧
  LexLess(segments_1, segments_2, SegmentLess)

```text
SegmentLess(s_1, s_2) ⇔
  (IsIdent(s_1) ∧ IsIdent(s_2) ∧ Utf8LexLess(Name(s_1), Name(s_2))) ∨
  (IsIndex(s_1) ∧ IsIndex(s_2) ∧ IndexValue(s_1) < IndexValue(s_2)) ∨
  (IsIdent(s_1) ∧ IsIndex(s_2))

LexLess([], [], _) = false

LexLess([], _::_, _) = true

LexLess(_::_, [], _) = false

LexLess(a::as, b::bs, cmp) = cmp(a, b) ∨ (a = b ∧ LexLess(as, bs, cmp))

CanonicalOrder(paths) = Sort(paths, KeyPathLess)

CanonicalSort(paths) = Sort(paths, KeyPathLess)

**Key Compatibility**

Two keys K_1 = (P_1, M_1, S_1) and K_2 = (P_2, M_2, S_2) are compatible if and only if:

```text
Compatible(K_1, K_2) ⇔ Disjoint(P_1, P_2) ∨ (M_1 = Read ∧ M_2 = Read)

KeyModeCompatible(Read, Read) = true

KeyModeCompatible(Read, Write) = false

KeyModeCompatible(Write, Read) = false

KeyModeCompatible(Write, Write) = false

```text
KeysOverlap(p_1, p_2) ⇔ Prefix(p_1, p_2) ∨ Prefix(p_2, p_1) ∨ p_1 = p_2

```text
KeyConflict(⟨p_1, m_1, _⟩, ⟨p_2, m_2, _⟩) ⇔ KeysOverlap(p_1, p_2) ∧ ¬KeyModeCompatible(m_1, m_2)

#### 19.3.4 Static Semantics

**Path Prefix and Disjointness**

`p_i ≡_seg q_i` iff `name(p_i) = name(q_i)` and `IndexEquiv(p_i, q_i)`.

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
──────────────────────────────────────────────────
ConcurrentAccess(P, Q) is statically safe

**(K-Prefix-Coverage)**

```text
Prefix(P, Q)    Held(P, M, Γ_keys)
──────────────────────────────────
Covers((P, M), Q)

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
P_1 = a[e_1]    P_2 = a[e_2]    SameStatement(P_1, P_2)    (Dynamic(e_1) ∨ Dynamic(e_2))    ¬ ProvablyDisjoint(e_1, e_2)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Reject

**Read-Then-Write Prohibition**

```text
ReadThenWrite(P, S) ⇔ ∃ e_r, e_w ∈ Subexpressions(S) : ReadsPath(e_r, P) ∧ WritesPath(e_w, P)

```text
CompoundRewriteOp(op) ⇔ op ∈ {`+`, `-`, `*`, `/`, `%`}

```text
CompoundRewriteCandidate(P, S) ⇔ S = AssignStmt(P, BinaryExpr(op, P, e), span) ∧ CompoundRewriteOp(op)

In this chapter, `ReadThenWrite(P, S)` is required to be diagnosed for assignment and compound-assignment statement surfaces that visibly separate a read of `P` from a write of `P`.

Other write forms continue to be governed by `RequiredMode`, `Covered`, and the ordinary key compatibility rules.

**(K-Read-Write-Reject)**

```text
Γ ⊢ P : `shared` T    ReadThenWrite(P, S)    ¬ ∃ (Q, Write, S') ∈ Γ_keys : Prefix(Q, P)
────────────────────────────────────────────────────────────────────────────────────────────────────────────
Reject

**(K-RMW-Permitted)**

```text
Γ ⊢ P : `shared` T    ReadThenWrite(P, S)    ∃ (Q, Write, S') ∈ Γ_keys : Prefix(Q, P)
────────────────────────────────────────────────────────────────────────────────────────────────────────────
Permitted

**(K-RMW-Explicit-Warn)**

```text
Γ ⊢ P : `shared` T    ReadThenWrite(P, S)    ∃ (Q, Write, S') ∈ Γ_keys : Prefix(Q, P)    CompoundRewriteCandidate(P, S)    w = Code(K-RMW-Explicit-Warn)

```text
\rule{18em}{0.4pt}

```text
Γ ⊢ WarnRMW(S) ⇓ w

**(K-RMW-Contention-Warn)**

```text
Γ ⊢ P : `shared` T    ReadThenWrite(P, S)    ∃ (Q, Write, S') ∈ Γ_keys : Prefix(Q, P)    ¬ CompoundRewriteCandidate(P, S)    w = Code(K-RMW-Contention-Warn)

```text
\rule{18em}{0.4pt}

```text
Γ ⊢ WarnRMW(S) ⇓ w

```text
NonIndexShape(P) = [seg | seg ∈ PathSegments(P) ∧ ¬ IsIndex(seg)]

```text
OrderedBase(P) = ⟨Root(P), NonIndexShape(P)⟩

```text
OrderedComparable(paths) ⇔ ∀ P, Q ∈ paths. OrderedBase(P) = OrderedBase(Q)

```text
StaticallyComparableIndices(paths) ⇔ ∀ P, Q ∈ paths. OrderedBase(P) = OrderedBase(Q) ⇒ PathSegments(P) and PathSegments(Q) differ only at index segments whose values are compile-time comparable under `IndexValue`

**(K-Ordered-Ok)**

```text
Ordered ∈ mods    OrderedComparable([KeyPath(p) | p ∈ paths])
────────────────────────────────────────────────────────────────────────────
OrderedPathsOk(KeyBlockStmt(attrs_opt, paths, mods, mode_opt, body, span))

**(K-Ordered-Base-Err)**

```text
Ordered ∈ mods    ¬ OrderedComparable([KeyPath(p) | p ∈ paths])    c = Code(K-Ordered-Base-Err)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ KeyBlockStmt(attrs_opt, paths, mods, mode_opt, body, span) ⇑ c

**(K-Ordered-Redundant-Warn)**

```text
Ordered ∈ mods    OrderedComparable([KeyPath(p) | p ∈ paths])    StaticallyComparableIndices([KeyPath(p) | p ∈ paths])    w = Code(K-Ordered-Redundant-Warn)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ WarnKeyBlock(KeyBlockStmt(attrs_opt, paths, mods, mode_opt, body, span)) ⇓ w

#### 19.3.5 Dynamic Semantics

`CanonicalOrder` defines the deterministic acquisition order used by §§19.2.5, 19.4.5, and 19.6.5.

`KeyModeCompatible`, `KeysOverlap`, and `KeyConflict` define the runtime compatibility relation for overlapping keys.

#### 19.3.6 Lowering

```text
LowerConflictChecks(paths, mode_opt) ⇓ IR ⇔

```text
  Γ ⊢ LowerKeyPaths(paths) ⇓ Ps ∧
  mode = ModeOf(mode_opt) ∧
  sorted = CanonicalSort(Ps) ∧

```text
  IR = SeqIRList([CheckConflict(P_i, mode) | P_i ∈ sorted])

**(Lower-Key-ConflictChecks)**

```text
Γ ⊢ LowerConflictChecks(paths, mode_opt) ⇓ IR
────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerKeyChecks(paths, mode_opt) ⇓ IR

#### 19.3.7 Diagnostics

| Code         | Severity | Detection    | Condition                                                         |
| ------------ | -------- | ------------ | ----------------------------------------------------------------- |
| `E-CON-0005` | Error    | Compile-time | Write access required but only Read available                     |
| `E-CON-0010` | Error    | Compile-time | Potential conflict on dynamic indices (same statement)            |
| `E-CON-0014` | Error    | Compile-time | `ordered` modifier on paths with different array bases            |
| `E-CON-0060` | Error    | Compile-time | Read-then-write on same `shared` path without covering Write key  |
| `W-CON-0004` | Warning  | Compile-time | Read-then-write may cause contention if parallelized              |
| `W-CON-0006` | Warning  | Compile-time | Explicit read-then-write form used; compound assignment available |
| `W-CON-0013` | Warning  | Compile-time | `ordered` modifier used with statically-comparable indices        |

### 19.4 Nested Release

#### 19.4.1 Syntax

This section introduces no additional surface syntax beyond the `release_modifier` form in §19.2.1.

#### 19.4.2 Parsing

This section introduces no additional parsing rules beyond §19.2.2.

#### 19.4.3 AST Representation / Form

```text
Nested release is represented by `KeyBlockStmt(attrs_opt, paths, mods, mode_opt, body, span)` with `Release ∈ mods`.

#### 19.4.4 Static Semantics

**(K-Nested-Same-Path)**

```text
Held(P, M_outer, Γ_keys)    #P M_inner { ... }
──────────────────────────────────────────────────────────────
if M_inner = M_outer:
 Covered

```text
otherwise if M_inner ≠ M_outer ∧ `release` ∈ modifiers:
 Release-and-Reacquire
otherwise:
 Reject

**(K-Reentrant)**

```text
SharedParam(proc, i) ⇔ the i-th formal parameter of proc has type `shared` T for some T

```text
DirectCalleeAccesses(proc) = {⟨i, rel, M⟩ | SharedParam(proc, i) ∧ proc.body contains KeyBlockStmt(attrs_opt, paths, mods, mode_opt, body, span) ∧ q ∈ paths ∧ KeyPath(q) = name(param_i) ++ rel ∧ M = BlockMode(KeyBlockStmt(attrs_opt, paths, mods, mode_opt, body, span))}

```text
CalleeAccessSummary(proc) is the least set A such that DirectCalleeAccesses(proc) ⊆ A and, for every directly resolved call `g(a_1, …, a_n)` in proc.body, every ⟨j, rel, M⟩ ∈ CalleeAccessSummary(g), and every i with SharedParam(proc, i) and KeyPath(a_j) = name(param_i) ++ rel_0, ⟨i, rel_0 ++ rel, M⟩ ∈ A.

```text
InstantiateCalleeAccess(v, ⟨i, rel, M⟩) = ⟨Q, M⟩ ⇔ KeyPath(v) = Q_0 ∧ Q = Q_0 ++ rel

```text
CalleeAccesses(Q) at call site `call(f, a_1, …, a_n)` iff ∃ ⟨i, rel, M⟩ ∈ CalleeAccessSummary(f). InstantiateCalleeAccess(a_i, ⟨i, rel, M⟩) = ⟨Q, M⟩
CalleeCovered(Q) at call site iff the instantiated access for Q has required mode M_Q and Covered(Q, M_Q, G_keys).

Held(P, M, G_keys)    Prefix(P, Q)    CalleeAccesses(Q)

```text
\rule{18em}{0.4pt}
CalleeCovered(Q)

If CalleeAccessSummary(f) cannot be computed because the callee is unresolved, bodyless, dynamically dispatched, or recursively unknown, the compiler MUST emit the unknown-callee-access warning defined in §19.4.7 once per call site whose `shared` actual argument path lies under a currently held prefix. For static analysis, that call site is treated as potentially accessing every subpath of the actual argument path in `Write` mode.

Passing a `shared` value as a procedure argument does not itself acquire a key:

```text
Γ ⊢ f : (`shared` T) → R    Γ ⊢ v : `shared` T

```text
\rule{18em}{0.4pt}

```text
call(f, v) ⇒ no key acquisition at call site

`[[stale_ok]]` suppresses the stale-after-release warning on a binding derived from `shared` data across a `release` boundary. Attribute syntax and attachment are defined in §9.5.

**(K-Release-SameMode-Err)**

```text
Release ∈ modifiers    Held(P, M_outer, Γ_keys)    P ∈ {KeyPath(p) | p ∈ paths}    BlockMode(KeyBlockStmt(attrs_opt, paths, modifiers, mode_opt, body, span)) = M_outer    c = Code(K-Release-SameMode-Err)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ KeyBlockStmt(attrs_opt, paths, modifiers, mode_opt, body, span) ⇑ c

#### 19.4.5 Dynamic Semantics

When entering `#path release <target> { body }`:

1. Release the outer key held by the enclosing block.
2. Acquire the target-mode key for `path`.
3. Execute `body`.
4. Release the inner key.
5. Reacquire the outer-mode key for the remainder of the enclosing scope.

**(K-Release-Sequence)**
Held(P, M_outer, S_outer)    #P `release` M_inner { B }
────────────────────────────────────────────────────────────

```text
Release(P, Γ_keys);
Acquire(P, M_inner, S_inner);
Eval(B);

```text
Release(P, Γ_keys);
Acquire(P, M_outer, S_outer)

Between steps 1 and 2, and between steps 4 and 5, other tasks MAY acquire conflicting keys to the same path.

```text
HeldKeysForPaths(paths, σ) = keys ⇔ keys = [k ∈ σ.held_keys | PathOf(k) ∈ CanonicalOrder([KeyPath(p) | p ∈ paths])]

```text
PathOf(⟨P, _, _⟩) = P

```text
KeyModeOf(⟨_, M, _⟩) = M

```text
KeyScopeOf(⟨_, _, S⟩) = S

```text
MarkKeysReleased(σ, keys) = σ' ⇔ σ' = σ[held_keys := σ.held_keys ∖ keys, released_keys := σ.released_keys ∪ keys]

```text
ClearReleased(σ, keys) = σ' ⇔ σ' = σ[released_keys := σ.released_keys ∖ keys]

```text
ReacquireHeldKeysSigma(keys, σ) ⇓ σ' ⇔

```text
  sorted = CanonicalSort([PathOf(k) | k ∈ keys]) ∧

```text
  ∀ P ∈ sorted. ∃ k ∈ keys. PathOf(k) = P ∧ AcquireLock(σ, P, KeyModeOf(k)) ∧

```text
  σ' = σ[held_keys := σ.held_keys ∪ keys]

**(ExecSigma-KeyBlock-Release)**

```text
Release ∈ mods    outer = HeldKeysForPaths(paths, σ)    Γ ⊢ ReleaseKeysSigma(outer, σ) ⇓ σ_1    σ_2 = MarkKeysReleased(σ_1, outer)    Γ ⊢ AcquireKeysSigma(paths, mode_opt, σ_2) ⇓ (σ_3, inner)    Γ ⊢ EvalBlockSigma(body, σ_3) ⇓ (out, σ_4)    Γ ⊢ ReleaseKeysSigma(inner, σ_4) ⇓ σ_5    σ_6 = ClearReleased(σ_5, outer)    Γ ⊢ ReacquireHeldKeysSigma(outer, σ_6) ⇓ σ_7
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ExecSigma(KeyBlockStmt(attrs_opt, paths, mods, mode_opt, body, span), σ) ⇓ (StmtOutOf(out), σ_7)

#### 19.4.6 Lowering

**(Lower-Stmt-KeyBlock-Release)**

```text
Release ∈ mods    Γ ⊢ LowerKeyPaths(paths) ⇓ Ps    outer = EnclosingHeldKeys(Ps)    mode = ModeOf(mode_opt)    sorted = CanonicalSort(Ps)

```text
IR_release_outer = SeqIRList([ReleaseKey(PathOf(k), KeyScopeOf(k)) | k ∈ Reverse(outer)])

```text
IR_acquire_inner = SeqIRList([SeqIR(CheckConflict(P_i, mode), AcquireKey(P_i, mode, CurrentScope)) | P_i ∈ sorted])

```text
Γ ⊢ LowerBlock(body) ⇓ ⟨IR_b, v_b⟩

```text
IR_release_inner = SeqIRList([ReleaseKey(P_i, CurrentScope) | P_i ∈ Reverse(sorted)])

```text
IR_reacquire_outer = SeqIRList([AcquireKey(PathOf(k), KeyModeOf(k), KeyScopeOf(k)) | k ∈ outer])
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerStmt(KeyBlockStmt(attrs_opt, paths, mods, mode_opt, body, span)) ⇓ SeqIR(IR_release_outer, IR_acquire_inner, IR_b, IR_release_inner, IR_reacquire_outer)

#### 19.4.7 Diagnostics

| Code         | Severity | Detection    | Condition                                           |
| ------------ | -------- | ------------ | --------------------------------------------------- |
| `E-CON-0012` | Error    | Compile-time | Nested mode change without `release` modifier       |
| `E-CON-0018` | Error    | Compile-time | `release` with target mode matching outer mode      |
| `W-CON-0005` | Warning  | Compile-time | Callee access pattern unknown; assuming full access |
| `W-CON-0010` | Warning  | Compile-time | `release` block permits interleaving                |
| `W-CON-0011` | Warning  | Compile-time | Access to potentially stale binding after release   |

### 19.5 Speculative Execution

#### 19.5.1 Syntax

```text
```

speculative_block ::= "#" key_path_list "speculative" "write" block_expr
```

#### 19.5.2 Parsing

Speculative blocks use the key-block parser in §19.2.2 together with `Parse-KeyBlockMod-Speculative` and `Parse-KeyMode-Write`.

#### 19.5.3 AST Representation / Form

```text
Speculative execution is represented by `KeyBlockStmt(attrs_opt, paths, mods, mode_opt, body, span)` with `Speculative ∈ mods`.

ReadSet = ℘(Path × Value)

WriteSet = ℘(Path × Value)

SpecState = {

```text
  SpecStart(paths, body, σ),

```text
  SpecSnapshot(paths, body, R, σ),

```text
  SpecExec(body, R, W, σ),

```text
  SpecCommit(R, W, v, σ),

```text
  SpecRetry(paths, body, n, σ),

```text
  SpecFallback(paths, body, σ),

```text
  SpecDone(v, σ),

```text
  SpecPanic(σ)
}

#### 19.5.4 Static Semantics

**(K-Spec-Write-Required)**

```text
#P `speculative` M {B}    M ≠ `write`
────────────────────────────────────────
Reject

**(K-Spec-Pure-Body)**
#P `speculative write` {B}    Writes(B) ⊄ CoveredPaths(P)
──────────────────────────────────────────────────────────
Reject

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

```text
#P `speculative write` {B}    #Q _ {…} ∈ Subexpressions(B)
──────────────────────────────────────────────────────────
Reject

**(K-Spec-No-Impure-Call)**

```text
#P `speculative write` {B}    ∃ c ∈ Subexpressions(B). IsCallLike(c) ∧ ¬(Γ ⊢ c pure)    c_err = Code(K-Spec-No-Impure-Call)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
G ⊢ KeyBlockStmt(attrs_opt, paths, mods, mode_opt, B, span) ⇑ c_err

**(K-Spec-No-Memory-Ordering)**

```text
#P `speculative write` {B}    ∃ x ∈ Subexpressions(B). (IsMemoryOrderAnnotation(x) ∨ IsFenceExpr(x))
────────────────────────────────────────────────────────────────────────────────────────────────────
Reject

**(K-Spec-No-Wait)**

```text
#P `speculative write` {B}    WaitExpr(_) ∈ Subexpressions(B)    c = Code(K-Spec-No-Wait)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ KeyBlockStmt(attrs_opt, paths, mods, mode_opt, B, span) ⇑ c

**(K-Spec-No-Defer)**

```text
#P `speculative write` {B}    DeferStmt(_) ∈ SubStatements(B)    c = Code(K-Spec-No-Defer)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ KeyBlockStmt(attrs_opt, paths, mods, mode_opt, B, span) ⇑ c

**(K-Spec-No-Release)**

```text
Speculative ∈ mods    Release ∈ mods    c = Code(K-Spec-No-Release)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ KeyBlockStmt(attrs_opt, paths, mods, mode_opt, body, span) ⇑ c

#### 19.5.5 Dynamic Semantics

**Entry Rule**

**(ExecSigma-KeyBlock-Speculative)**

```text
Speculative ∈ mods    retries = 0
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ExecSigma(KeyBlockStmt(attrs_opt, paths, mods, mode_opt, body, span), σ) ⇓ SpecLoop(paths, mods, mode_opt, body, retries, σ)

```text
SpecLoop(paths, mods, mode_opt, body, retries, σ) ⇓ (out, σ') ⇔

```text
  R = SnapshotKeyedPaths(paths, σ) ∧

```text
  Γ ⊢ EvalBlockSigma(body, σ) ⇓ (out_body, σ_1) ∧

```text
  W = CollectWrites(σ, σ_1) ∧

```text
  (SpeculativeCommit(R, W) ⇒ out = out_body ∧ σ' = ApplyWrites(σ, W)) ∧

```text
  (¬SpeculativeCommit(R, W) ∧ retries < MAX_SPECULATIVE_RETRIES ⇒ SpecLoop(paths, mods, mode_opt, body, retries + 1, σ) ⇓ (out, σ')) ∧

```text
  (¬SpeculativeCommit(R, W) ∧ retries = MAX_SPECULATIVE_RETRIES ⇒ Γ ⊢ ExecSigma(KeyBlockStmt(attrs_opt, paths, mods \ {Speculative}, mode_opt, body, span), σ) ⇓ (out, σ'))

**State Machine**

**(Spec-Start)**
────────────────────────────────────────────────────────────────────

```text
⟨SpecStart(paths, body, σ)⟩ → ⟨SpecSnapshot(paths, body, ∅, σ)⟩

**(Spec-Snapshot)**

```text
∀ p ∈ paths. ReadPath(σ, p) = v_p    R = {(p, v_p) | p ∈ paths}
────────────────────────────────────────────────────────────────────

```text
⟨SpecSnapshot(paths, body, ∅, σ)⟩ → ⟨SpecExec(body, R, ∅, σ)⟩

**(Spec-Exec-Ok)**

```text
Γ ⊢ EvalSpeculative(body, σ, R) ⇓ (Val(v), W, σ')
────────────────────────────────────────────────────────────────────

```text
⟨SpecExec(body, R, ∅, σ)⟩ → ⟨SpecCommit(R, W, v, σ')⟩

**(Spec-Exec-Panic)**

```text
Γ ⊢ EvalSpeculative(body, σ, R) ⇓ (Ctrl(Panic), W, σ')
────────────────────────────────────────────────────────────────────

```text
⟨SpecExec(body, R, ∅, σ)⟩ → ⟨SpecPanic(σ')⟩

**(Spec-Commit-Success)**

```text
∀ (p, v) ∈ R. ReadPath(σ, p) = v    ApplyWrites(σ, W) = σ'
────────────────────────────────────────────────────────────────────

```text
⟨SpecCommit(R, W, v, σ)⟩ → ⟨SpecDone(v, σ')⟩

**(Spec-Commit-Fail-Retry)**

```text
∃ (p, v) ∈ R. ReadPath(σ, p) ≠ v    n < MAX_SPECULATIVE_RETRIES
────────────────────────────────────────────────────────────────────

```text
⟨SpecCommit(R, W, v, σ)⟩ → ⟨SpecRetry(paths(R), body, n + 1, σ)⟩

**(Spec-Commit-Fail-Fallback)**

```text
∃ (p, v) ∈ R. ReadPath(σ, p) ≠ v    n ≥ MAX_SPECULATIVE_RETRIES
────────────────────────────────────────────────────────────────────

```text
⟨SpecCommit(R, W, v, σ)⟩ → ⟨SpecFallback(paths(R), body, σ)⟩

**(Spec-Retry)**
────────────────────────────────────────────────────────────────────

```text
⟨SpecRetry(paths, body, n, σ)⟩ → ⟨SpecSnapshot(paths, body, ∅, σ)⟩

**(Spec-Fallback)**

```text
AcquireKey(σ, paths, Write) = σ_k    Γ ⊢ EvalSigma(body, σ_k) ⇓ (Val(v), σ')    ReleaseKey(σ', paths) = σ''
────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨SpecFallback(paths, body, σ)⟩ → ⟨SpecDone(v, σ'')⟩

**(SpecBlock-Ok)**

```text
⟨SpecStart(paths, body, σ)⟩ →* ⟨SpecDone(v, σ')⟩
─────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSpecBlock(paths, body, σ) ⇓ (Val(v), σ')

**(SpecBlock-Panic)**

```text
⟨SpecStart(paths, body, σ)⟩ →* ⟨SpecPanic(σ')⟩
─────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalSpecBlock(paths, body, σ) ⇓ (Ctrl(Panic), σ')

```text
ReadPath(σ, p) = v ⇔ evaluate path expression `p` in state `σ`, returning `v`.

```text
ApplyWrites(σ, W) = σ' ⇔ atomically apply all `(p, v) ∈ W` to `σ`.

```text
paths(R) = {p | (p, _) ∈ R}

```text
EvalSpeculative(body, σ, R) ⇓ (out, W, σ') intercepts writes to paths in `paths(R)` and collects them in `W` instead of applying them to `σ`.

`MAX_SPECULATIVE_RETRIES = 8`.

If a panic occurs during speculative execution, the write set is discarded and the panic propagates.

The snapshot step MUST be observationally equivalent to an atomic snapshot over the keyed set. The commit step MUST be atomic with respect to other key operations on overlapping paths and MUST satisfy `SpeculativeCommit(R, W)`.

The state machine above is an abstract dynamic semantics.

An implementation MAY conservatively realize `# ... speculative write { ... }` by directly selecting the fallback execution path, provided the resulting observable behavior is the same as some execution admitted by the abstract semantics. Such an implementation need not materialize successful speculative commit states at runtime.

#### 19.5.6 Lowering

SpeculativeIR = {SpecSnapshotIR(paths), SpecValidateIR(paths), SpecCommitIR(paths), SpecRetryIR, SpecFallbackIR}

**(Lower-Stmt-KeyBlock-Speculative)**

```text
Speculative ∈ mods    Γ ⊢ LowerKeyPaths(paths) ⇓ Ps    sorted = CanonicalSort(Ps)    Γ ⊢ LowerBlock(body) ⇓ ⟨IR_b, v_b⟩

```text
IR_fallback = SeqIR(SeqIRList([SeqIR(CheckConflict(P_i, Write), AcquireKey(P_i, Write, CurrentScope)) | P_i ∈ sorted]), IR_b, SeqIRList([ReleaseKey(P_i, CurrentScope) | P_i ∈ Reverse(sorted)]))
IR = SpecLoopIR(SpecSnapshotIR(sorted), IR_b, SpecValidateIR(sorted), SpecCommitIR(sorted), SpecRetryIR, SpecFallbackIR(IR_fallback))
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerStmt(KeyBlockStmt(attrs_opt, paths, mods, mode_opt, body, span)) ⇓ IR

#### 19.5.7 Diagnostics

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

### 19.6 Dynamic Key Verification

#### 19.6.1 Syntax

This section introduces no additional surface syntax. `[[dynamic]]` attribute syntax is defined by Chapter 9.

#### 19.6.2 Parsing

This section introduces no additional parsing rules beyond the generic attribute parser in Chapter 9.

#### 19.6.3 AST Representation / Form

StaticallySafe(P) is classified by the following source conditions:

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

#### 19.6.4 Static Semantics

**(K-Static-Safe)**
Access(P, M)    StaticallySafe(P)
────────────────────────────────
NoRuntimeSync(P)

`NoRuntimeSync(P)` means that runtime synchronization is not required for correctness of the access.

An implementation MAY omit runtime synchronization for `P`, or MAY conservatively retain equivalent synchronization, provided observable behavior is preserved.

**(K-Static-Required)**
¬ StaticallySafe(P)    ¬ InDynamicContext
──────────────────────────────────────────
Reject

#### 19.6.5 Dynamic Semantics

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

#### 19.6.6 Lowering

**(K-Dynamic-Permitted)**
¬ StaticallySafe(P)    InDynamicContext
────────────────────────────────────────
EmitRuntimeSync(P)

When `InDynamicContext` and `StaticallySafe(P)` both hold, runtime synchronization is not required. An implementation MAY omit it or conservatively retain equivalent synchronization.

#### 19.6.7 Diagnostics

| Code         | Severity | Detection    | Condition                                                |
| ------------ | -------- | ------------ | -------------------------------------------------------- |
| `E-CON-0020` | Error    | Compile-time | Key safety not statically provable outside `[[dynamic]]` |
| `I-CON-0011` | Info     | Compile-time | Runtime synchronization emitted under `[[dynamic]]`      |
| `I-CON-0013` | Info     | Compile-time | Static key safety proven under `[[dynamic]]`             |

### 19.7 Memory Ordering

#### 19.7.1 Syntax

```text
```

memory_order_attribute ::= "[[" memory_order "]]"
memory_order           ::= "relaxed" | "acquire" | "release" | "acqrel" | "seqcst"
fence_expr             ::= "fence" "(" fence_order ")"
fence_order            ::= "acquire" | "release" | "seqcst"
```

#### 19.7.2 Parsing

Memory-order attributes use the generic attribute parser in Chapter 9.

This section defines the surface grammar `fence_expr ::= "fence" "(" fence_order ")"`. No separate named parser helper beyond ordinary expression parsing is introduced here.

#### 19.7.3 AST Representation / Form

Memory-order attributes are attached through the generic attribute forms owned by Chapter 9.
FenceOrder = {`acquire`, `release`, `seqcst`}
Expr = … | FenceExpr(order) | …

EffectiveOrdering(e) is defined by nearest-override precedence:

1. The nearest enclosing expression-level memory-order attribute on `e`.
2. Else the nearest enclosing key-block default memory-order attribute.
3. Else `seqcst`.

#### 19.7.4 Static Semantics

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

```text
O ∈ {`acquire`, `release`, `seqcst`}
────────────────────────────────────────

```text
Γ ⊢ `fence`(O) : ()

Fence operations MAY appear in runtime expression contexts. They MUST NOT alter the held-key context.

#### 19.7.5 Dynamic Semantics

Evaluation of `fence(O)`:

1. Evaluate `fence(O)` at the current expression evaluation point.
2. Emit ordering event `Fence(O)`.
3. Produce value `()`.

Required ordering constraints:

1. `fence(acquire)`: operations sequenced after the fence MUST NOT be reordered before it.
2. `fence(release)`: operations sequenced before the fence MUST NOT be reordered after it.
3. `fence(seqcst)`: acquire and release constraints both hold, and all `Fence(seqcst)` events and `[[seqcst]]` accesses participate in one global total order consistent with each task's sequenced-before order.

Fence evaluation MUST NOT read or write program-visible storage.

#### 19.7.6 Lowering

**(Lower-Expr-Fence)**
──────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(FenceExpr(order)) ⇓ ⟨FenceIR(order), UnitVal⟩

**(Lower-Ordered-Access)**

```text
ContainsSharedAccess(e)    ord = EffectiveOrdering(e)    Γ ⊢ LowerExprCore(e) ⇓ ⟨IR, v⟩
────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerExpr(e) ⇓ ⟨OrderedAccessIR(ord, IR), v⟩

#### 19.7.7 Diagnostics

No additional named diagnostics are introduced here. The speculative-block restriction on memory-order annotations and fence operations is owned by §19.5.7.
