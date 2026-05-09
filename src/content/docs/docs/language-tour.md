---
title: Language Tour
description: Tour of the Ultraviolet language model.
---

Ultraviolet is a general-purpose programming language optimized for generated source and human review. The language keeps effects, authority, movement, execution domain, and runtime opt-ins visible in code.

<aside class="docs-status">
  <strong>Tour status: alpha.</strong>
  <span>This tour introduces the source-level model. Examples will expand as the public compiler and example tree stabilize.</span>
</aside>

## Source and project shape

Ultraviolet source files use the `.uv` extension. Project metadata lives in `Ultraviolet.toml`.

```text
Ultraviolet.toml
src/
  Main.uv
```

```text
public procedure main(
    move ctx: Context
) -> i32 {
    return 0
}
```

## Effects and authority

Effects flow through typed capabilities and procedure signatures. `Context` is the executable entry bundle that lets code receive the authority it needs.

```text
public procedure main(
    move ctx: Context
) -> i32 {
    return 0
}
```

## CPU and GPU execution domains

CPU, GPU, and inline execution are represented as execution domains in the language model. That makes CPU/GPU work a language-level concern instead of a separate programming surface.

```text
let cpu = ctx.cpu()
let gpu = ctx.gpu()
```

## Movement, permission, and responsibility

`move` transfers responsibility. `const`, `shared`, and `unique` describe access permission. Keeping those dimensions separate makes source review more local.

```text
public procedure consume(
    move value: Buffer
) -> i32 {
    return 0
}
```

## Modal types

Modal types model resources, protocols, typestate, and async state with state-specific fields, methods, and transitions.

```text
modal FileSession {
    @Open {
        handle: i32
    }
    @Closed {}
}
```

## Structured parallelism

`parallel`, `spawn`, `dispatch`, `sync`, and `race` are part of one execution model. Reviewers can see where work is started, synchronized, or raced.

```text
parallel ctx.cpu() {
    dispatch item in 0..count {
        process(item)
    }
}
```

## Static by default

Static checking is the default. Runtime checks, synchronization, dispatch, allocation, copying, unsafe behavior, and foreign boundaries require explicit source opt-in.

## Compile-time generation

`comptime`, quote/splice, reflection, and emission support controlled generated source without relying on string rewriting as the language model.
