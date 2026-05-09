---
title: Structured Concurrency
description: Parallel, async, dispatch, synchronization, and race behavior in Ultraviolet.
---

Ultraviolet keeps concurrent work structured in source. `parallel`, `spawn`, `dispatch`, `sync`, and `race` are language constructs rather than hidden scheduling conventions.

## Parallel blocks

```text
parallel ctx.cpu() {
    dispatch item in 0..count {
        process(item)
    }
}
```

The execution domain is part of the source form. A reviewer can see whether work runs on CPU, GPU, or inline execution.

## Dispatch

`dispatch` expresses data-parallel work over a range.

```text
parallel ctx.gpu() {
    dispatch index in 0..count {
        output[index] = input[index] * 2
    }
}
```

The specification defines dispatch behavior, ordered dispatch, GPU-safe restrictions, and nesting rules.

## Async as modal state

Async values are modeled as modal state machines with explicit suspension, resumption, completion, cancellation, and failure behavior.

That keeps async lifecycle visible in the same modal programming style used for resources and protocols.

## Specification

- [20. Structured Parallelism](/docs/specification/structured-parallelism/)
- [21. Asynchronous Operations](/docs/specification/asynchronous-operations/)
- [19. Key System](/docs/specification/key-system/)
