---
title: CPU/GPU Programming
description: CPU and GPU execution domains in Ultraviolet.
---

CPU/GPU programming is a major Ultraviolet language surface. The goal is one programming language for CPU and GPU work, with execution choice visible in source.

## Execution domains

`Context` exposes execution-domain values:

```text
let cpu = ctx.cpu()
let gpu = ctx.gpu()
let inline = ctx.inline()
```

The specification defines `ctx.cpu()`, `ctx.gpu()`, and `ctx.inline()` as methods returning `$ExecutionDomain`.

## GPU dispatch

```text
parallel ctx.gpu() {
    dispatch index in 0..count {
        output[index] = input[index] * 2
    }
}
```

The execution domain is part of the construct, so a human reviewer can see where generated code intends to run.

## GPU-safe types

The specification defines GPU-safe type rules. Primitive numeric and boolean types are GPU-safe; capability-bearing values, managed strings/bytes, dynamic objects, valid pointers, and modal states are not GPU-safe in GPU work.

That gives generated code a concrete type-level boundary between host behavior and GPU dispatch behavior.

## CPU and GPU nesting

CPU and GPU blocks may nest heterogeneously. GPU parallel blocks may not be nested inside other GPU parallel blocks.

## Why this is a selling point

Ultraviolet is designed so code can express CPU work and GPU work in one language model. That matters for AI-generated code because the execution choice is explicit, typed, and reviewable rather than hidden in a separate kernel language or untyped string boundary.

## Specification

- [20.2 Execution Domains](/docs/specification/structured-parallelism/)
- [20.8 GPU and Ordered Dispatch](/docs/specification/structured-parallelism/)
- [24.6 Runtime Interface](/docs/specification/common-lowering-program-lifecycle-and-backend/)
