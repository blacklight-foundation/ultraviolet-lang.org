---
title: Key System
description: Language-level synchronization for shared data in Ultraviolet.
---

The key system is Ultraviolet's synchronization model for `shared` data. A `shared` read or write is associated with a key path, a required mode, and a scope; the compiler uses those facts to prove safety, reuse existing coverage, or lower runtime synchronization where the specification permits it.

<aside class="docs-status">
  <strong>Guide status: specification-facing.</strong>
  <span>This page explains the Chapter 19 language model. The generated specification remains the authoritative source for exact static semantics, dynamic semantics, lowering, and diagnostics.</span>
</aside>

## The model

A key is a triple:

```text
Key = <Path, Mode, Scope>
```

`Path` identifies the `shared` place, `Mode` is `Read` or `Write`, and `Scope` determines when the key is released. `Read` permits read-only access. `Write` permits reads and writes, and excludes other keys to overlapping paths.

The compiler computes two central facts for each ordinary `shared` access:

```text
KeyPath(e)
RequiredMode(e)
```

If the current key context already covers the path and mode, the access reuses that key. Otherwise the ordinary access establishes an implicit acquisition. Being outside an explicit `#` block does not by itself make a valid `shared` access invalid.

Specification anchors: [19.1 Key Paths](/docs/specification/key-system/#191-key-paths), [19.2 Key Acquisition Blocks](/docs/specification/key-system/#192-key-acquisition-blocks), [19.3 Conflict Detection](/docs/specification/key-system/#193-conflict-detection).

## Key paths

A key path starts at an identifier root and then follows fields and indexes:

```text
key_path_expr ::= key_root key_seg*
key_root      ::= identifier
key_seg       ::= "." key_field | "[" key_index "]"
key_field     ::= key_marker? identifier
key_index     ::= key_marker? expression
key_marker    ::= "#"
```

Key analysis applies when the path root has `shared` permission. Paths rooted in `const` or `unique` data do not require keys.

The `#` marker sets acquisition granularity. A marker in `cache.#entries[id]` asks the key system to acquire at `cache.entries`, covering subsequent segments such as `[id]`. The specification allows at most one marker per key path. A field declaration marked with `#` establishes a permanent key boundary, and key paths truncate at that field boundary.

Pointer dereference creates a key boundary. Dereferencing a `shared Ptr<T>@Valid` requires a read key for the pointer path, and access through the dereferenced value uses a fresh key rooted at the runtime identity of the referent.

Specification anchors: [19.1.4 Static Semantics](/docs/specification/key-system/#1914-static-semantics), [19.1.5 Dynamic Semantics](/docs/specification/key-system/#1915-dynamic-semantics).

## Read And Write Modes

The required mode comes from the syntactic context. Reads require `Read`; mutation and exclusive-use contexts require `Write`.

| Operation surface | Required mode |
| :---------------- | :------------ |
| Initializer or assignment right-hand side | `Read` |
| Arithmetic or logical operand | `Read` |
| Condition or case scrutinee | `Read` |
| Argument to `const` or `shared` parameter | `Read` |
| Receiver of `~` method | `Read` |
| Assignment left-hand side | `Write` |
| Compound assignment left-hand side | `Write` |
| Argument to `unique` parameter | `Write` |
| Receiver of `~%` or `~!` method | `Write` |

When an expression appears in multiple contexts, the more restrictive context applies. A held `Write` key is sufficient for both read and write access under the covered path.

Specification anchors: [19.2.4 Static Semantics](/docs/specification/key-system/#1924-static-semantics), [10. Permissions and Binding State](/docs/specification/permissions-and-binding-state/).

## Implicit Acquisition

Ordinary `shared` access has a key context even when the source does not contain an explicit key block. The compiler evaluates subexpressions left-to-right and depth-first; key acquisition follows that evaluation order.

```text
let value = cache.entries[id]
cache.entries[id] = value + 1
```

For the read, `RequiredMode` is `Read`. For the write, `RequiredMode` is `Write`. If an enclosing key already covers the path with a sufficient mode, the access reuses it; otherwise lowering emits conflict checking and key acquisition for the current scope.

Implicit acquisition is the default access model. Explicit key blocks are used to make a wider synchronization scope visible, acquire several paths in canonical order, coarsen path granularity, request ordered dynamic-index handling, or use release/speculative behavior.

Specification anchors: [Implicit Acquisition](/docs/specification/key-system/#1924-static-semantics), [19.1.6 Lowering](/docs/specification/key-system/#1916-lowering).

## Explicit Blocks

An explicit key block acquires one or more key paths for the block body:

```text
# cache.entries[id] read {
    let value = cache.entries[id]
}

# cache.entries[id] write {
    cache.entries[id] = next
}
```

The default block mode is `Read`; `write` requests `Write`. Paths are acquired in canonical order, and keys are released when the block scope exits. Release happens on ordinary completion, `return`, `break`, `continue`, panic propagation, and task cancellation.

Multiple paths can be acquired together:

```text
# accounts[from], accounts[to] ordered write {
    accounts[from].balance -= amount
    accounts[to].balance += amount
}
```

`ordered` requests same-base indexed-path checking. Canonical path order remains the deterministic acquisition and conflict-resolution order for key blocks.

Specification anchors: [19.2 Key Acquisition Blocks](/docs/specification/key-system/#192-key-acquisition-blocks), [19.3 Conflict Detection](/docs/specification/key-system/#193-conflict-detection).

## Conflict Detection

Key conflict is defined by path overlap and mode compatibility. Disjoint paths are compatible. Overlapping reads are compatible. Any overlapping access involving `Write` conflicts.

```text
Compatible(K1, K2) =
  Disjoint(P1, P2) or (M1 = Read and M2 = Read)
```

Prefix coverage matters. A key held for `cache.entries` covers `cache.entries[id]` when its mode is sufficient. That is the mechanism behind coarsening and explicit wide blocks.

Dynamic indexes are statically safe when the compiler can prove equivalence or disjointness. The spec lists sufficient proof shapes, including distinct static values, verification facts, preconditions, refinement types, common-base constant offsets, dispatch iteration variables, and non-overlapping loop ranges.

Specification anchors: [19.3.4 Static Semantics](/docs/specification/key-system/#1934-static-semantics), [19.3.5 Dynamic Semantics](/docs/specification/key-system/#1935-dynamic-semantics).

## Dynamic Verification

`StaticallySafe(P)` is the conservative compile-time judgment for omitting runtime synchronization. The specification recognizes proof shapes such as no escape, disjoint paths, sequential context, unique origin viewed as shared, dispatch-indexed access, and speculative-only access.

When static key safety is not proven, a `[[dynamic]]` context permits runtime synchronization:

```text
[[dynamic]]
procedure update(shared table: Table, id: usize, value: Value) -> () {
    table.entries[id] = value
}
```

Inside `[[dynamic]]`, incomparable dynamic indexes require a runtime ordering relation with totality, antisymmetry, transitivity, cross-task consistency, and value determinism. Implementations may conservatively coarsen a dynamic indexed path to a static prefix when that preserves mutual exclusion and observational equivalence.

Outside `[[dynamic]]`, failure to prove key safety is a compile-time error.

Specification anchors: [19.6 Dynamic Key Verification](/docs/specification/key-system/#196-dynamic-key-verification), [9. Attributes and Metadata](/docs/specification/attributes-and-metadata/).

## Release And Reacquire

Nested key blocks normally reuse compatible coverage. A nested mode change for the same path requires `release`, which temporarily releases the outer key, acquires the target mode, runs the body, releases the inner key, and reacquires the outer key.

```text
# cache write {
    prepare(cache)

    # cache release read {
        publish_read_only_view(cache)
    }

    finish(cache)
}
```

Between release and reacquire, other tasks may acquire conflicting keys for the same path. The compiler warns when a `release` block permits interleaving and when a binding derived from `shared` data may be stale after release. `[[stale_ok]]` suppresses the stale-after-release warning where the source intentionally accepts that risk.

Passing a `shared` value as a procedure argument does not itself acquire a key. When the callee access summary is unknown, the compiler warns and treats the call as potentially writing every subpath of the `shared` actual under the held prefix.

Specification anchors: [19.4 Nested Release](/docs/specification/key-system/#194-nested-release), [19.4.7 Diagnostics](/docs/specification/key-system/#1947-diagnostics).

## Closures And Escapes

Local closures use the defining scope for key analysis. Escaping closures with `shared` captures use runtime identity-rooted key paths for captured references:

```text
KeyPath(C, x.p) = id(C.x).p
```

An escaping closure must not outlive a captured local `shared` binding. For correctness, escaping-closure key acquisition must cover the runtime identity of the captured reference. Implementations may coarsen to a stable closure-capture-rooted prefix when that soundly covers every reachable runtime identity.

Specification anchors: [Closure Capture of shared Bindings](/docs/specification/key-system/#1924-static-semantics), [16.9 Closure and Pipeline Expressions](/docs/specification/expressions/#169-closure-and-pipeline-expressions), [20.3 Capture Semantics](/docs/specification/structured-parallelism/#203-capture-semantics).

## Parallel And Async Integration

`shared` captures are allowed in `spawn` and `dispatch` bodies, and their access synchronization is defined by Chapter 19. `unique` bindings cannot be implicitly captured into `spawn` or `dispatch` bodies. GPU contexts reject key blocks, and GPU capture has its own GPU-safe restrictions.

Inside `dispatch`, accesses indexed by the dispatch iteration variable are one of the specified proof shapes for disjoint dynamic indexed access. That gives data-parallel code a way to be statically safe without per-element runtime synchronization.

Async suspension has explicit key behavior. `yield release` lowers by snapshotting held keys, releasing them before yielding, and reacquiring them in canonical key order before resuming the suspended continuation. Key-dependent accesses must not escape through closures, deferred blocks, or suspension/resumption boundaries that may execute after the defining key scope exits.

Specification anchors: [20.3 Capture Semantics](/docs/specification/structured-parallelism/#203-capture-semantics), [20.5 Dispatch](/docs/specification/structured-parallelism/#205-dispatch), [21.2 Suspension and Resumption](/docs/specification/asynchronous-operations/#212-suspension-and-resumption).

## Speculative Blocks

Speculative key blocks are write blocks with snapshot, validate, commit, retry, and fallback behavior:

```text
# cache.entries[id] speculative write {
    cache.entries[id] = compute_next(cache.entries[id])
}
```

The body may read and write keyed paths, perform pure computation, and call `const` receiver procedures on keyed data. It may not write outside the keyed set, nest key blocks, use `wait`, call impure procedures, use `defer`, or include memory-order annotations or fence operations.

If validation succeeds, writes are committed atomically with respect to other overlapping key operations. If validation fails, the block retries up to `MAX_SPECULATIVE_RETRIES = 8`, then falls back to non-speculative write-key execution. A panic discards the speculative write set and propagates.

Specification anchors: [19.5 Speculative Execution](/docs/specification/key-system/#195-speculative-execution), [19.5.7 Diagnostics](/docs/specification/key-system/#1957-diagnostics).

## Memory Ordering

Key acquisition uses acquire semantics. Key release uses release semantics. Data accesses default to sequentially consistent ordering.

Memory-order attributes may attach to a key block as a default for keyed or shared accesses in that body, or to an attributed expression as a nearer override:

```text
[[acquire]]
# queue.head read {
    let head = queue.head
}

fence(seqcst)
```

Ordering levels are `relaxed`, `acquire`, `release`, `acqrel`, and `seqcst`. Memory-order attributes affect data-access ordering and do not alter key acquire or key release semantics. Fence expressions may appear in runtime expression contexts and do not alter the held-key context.

Specification anchors: [19.7 Memory Ordering](/docs/specification/key-system/#197-memory-ordering).

## Diagnostics

Key diagnostics are grouped around the same model:

| Area | Examples |
| :--- | :------- |
| Path validity | `#` on a non-`shared` path, multiple `#` markers, invalid path root |
| Block validity | path not in scope, path not `shared`, write operation in read block |
| Scope and escape | key escapes defining scope, key acquisition in `defer`, escaping closure with invalid `shared` capture |
| Conflict analysis | dynamic index conflict, read-then-write without a covering write key, ordered-path misuse |
| Release | nested mode change without `release`, release to same mode, stale binding after release |
| Speculative execution | nested key block, outside write, `wait`, `defer`, impure call, memory ordering inside speculative block |
| Dynamic verification | static proof failure outside `[[dynamic]]`, runtime sync emitted under `[[dynamic]]`, static safety proven under `[[dynamic]]` |

Specification anchor: [19. Diagnostics Tables](/docs/specification/key-system/).

## Related Surfaces

- [19. Key System](/docs/specification/key-system/)
- [10. Permissions and Binding State](/docs/specification/permissions-and-binding-state/)
- [16.9 Closure and Pipeline Expressions](/docs/specification/expressions/#169-closure-and-pipeline-expressions)
- [20. Structured Parallelism](/docs/specification/structured-parallelism/)
- [21. Asynchronous Operations](/docs/specification/asynchronous-operations/)
