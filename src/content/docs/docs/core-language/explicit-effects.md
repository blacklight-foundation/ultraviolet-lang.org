---
title: Explicit Effects and Authority
description: Capability-mediated effects in Ultraviolet.
---

Ultraviolet makes effect-bearing operations visible through explicit value flow. Externally visible effects occur through capability-bearing values such as `Context`, `FileSystem`, `System`, `Network`, `HeapAllocator`, `ExecutionDomain`, and `Reactor`.

## Context

Executable entrypoints receive `Context` explicitly.

```text
public procedure main(
    move ctx: Context
) -> i32 {
    let count = ctx.sys~>argument_count()
    return count as i32
}
```

`Context` is the root bundle for standard capability-bearing values available to executable code.

## Review model

The reviewer should be able to trace:

- where the capability came from;
- which procedure signature accepts it;
- which method performs the effect;
- which contract or permission governs the operation;
- which execution domain owns the work, when relevant.

This is part of the larger AI-written-code auditability hook. Generated code should expose the authority it uses.

## Specification

- [6. Abstract Machine, Objects, Responsibility, and Authority](/docs/specification/abstract-machine-objects-responsibility-and-authority/)
- [23. Foreign Function Interface](/docs/specification/foreign-function-interface/)
- [24. Common Lowering, Program Lifecycle, and Backend](/docs/specification/common-lowering-program-lifecycle-and-backend/)
