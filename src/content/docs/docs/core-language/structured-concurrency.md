---
title: Structured Concurrency
description: Parallel, async, dispatch, synchronization, and race behavior in Ultraviolet.
---

Ultraviolet keeps concurrent work structured in source. `parallel`, `spawn`, `dispatch`, `sync`, and `race` are language constructs with specified capture, synchronization, cancellation, panic, and result behavior.

## Parallel blocks

```text
parallel ctx.cpu() {
    dispatch item in 0..count {
        process(item)
    }
}
```

The execution domain is part of the source form. A reviewer can see whether work runs on CPU, GPU, or inline execution. `shared` captures remain governed by Chapter 19 key rules.

## Dispatch

`dispatch` expresses data-parallel work over a range.

```text
parallel ctx.gpu() {
    dispatch index in 0..count {
        output[index] = input[index] * 2
    }
}
```

The specification defines dispatch behavior, ordered dispatch, GPU-safe restrictions, and nesting rules. Dispatch-indexed access is one of the key-system proof shapes for statically safe disjoint `shared` access.

## Async as modal state

Async values are modeled as modal state machines with explicit suspension, resumption, completion, cancellation, and failure behavior.

That keeps async lifecycle visible in the same modal programming style used for resources and protocols. `yield release` has specified key behavior: held keys are snapshotted, released before yielding, and reacquired in canonical key order before the continuation resumes.

## Keys in concurrent code

Bindings with `shared` permission may be captured by reference into `spawn` and `dispatch` bodies; access synchronization is defined by the key system. Bindings with `unique` permission are not implicitly captured into `spawn` or `dispatch` bodies. GPU contexts reject key blocks and apply the GPU-safe type and capture rules.

## Specification

- [20. Structured Parallelism](/docs/specification/structured-parallelism/)
- [21. Asynchronous Operations](/docs/specification/asynchronous-operations/)
- [19. Key System](/docs/specification/key-system/)
