---
title: Language Tour
description: Tour of Ultraviolet's main language surfaces.
---

Ultraviolet is a general-purpose programming language for AI-written code that humans can review. The language makes contracts, states, permissions, keys, concurrency, and CPU/GPU execution choices visible in source.

<aside class="docs-status">
  <strong>Tour status: alpha.</strong>
  <span>This tour explains the specified language model. Compiler support is being built toward the specification.</span>
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

`Context` is the executable entry capability bundle. Passing it explicitly keeps effect-bearing operations reviewable in the procedure signature.

## Modal programming

Modal programming is Ultraviolet's primary programming style. You model resources, protocols, async work, and execution lifecycles as explicit states with checked transitions.

```text
modal FileSession {
    @Open {
        handle: i32

        public transition close() -> @Closed {
            return FileSession@Closed {}
        }
    }

    @Closed {}
}
```

A reviewer can see which state carries which fields, which methods are available, and which transitions are valid.

## Contracts

Contracts specify what procedures require and promise.

```text
public procedure clamp(value: i32, min: i32, max: i32) -> i32
|: min <= max => @result >= min && @result <= max
{
    if (value < min) {
        return min
    }
    if (value > max) {
        return max
    }
    return value
}
```

Contract expressions are pure boolean predicates in the specification. They are part of the source form reviewers inspect before trusting generated code.

## Permissions and responsibility

Permissions describe access, mutation, aliasing, and synchronization. Responsibility transfer is expressed separately with `move`.

```text
public procedure consume(
    move buffer: Buffer
) -> i32 {
    return 0
}
```

`const` reads, `unique` grants exclusive read-write access, and `shared` grants key-mediated synchronized access.

## Key system

The key system coordinates access to `shared` data. Shared reads and writes are associated with key paths, and the compiler/runtime model can reason about conflicts.

```text
key cache.entries#[id] read {
    let value = cache.entries[id]
}
```

Keys make shared access visible in source instead of burying synchronization in conventions.

## Structured concurrency

`parallel`, `spawn`, `dispatch`, `sync`, and `race` are part of one structured execution model.

```text
parallel ctx.cpu() {
    dispatch item in 0..count {
        process(item)
    }
}
```

Reviewers can see where work starts, where it joins, and which execution domain owns it.

## CPU and GPU programming

CPU, GPU, and inline execution domains are language-level values. Ultraviolet is designed so one programming language can express both CPU and GPU work.

```text
let cpu = ctx.cpu()
let gpu = ctx.gpu()

parallel gpu {
    dispatch index in 0..count {
        output[index] = input[index] * 2
    }
}
```

The specification defines GPU-safe type rules and dispatch behavior so generated code has a clear review surface for where work runs.

## Explicit effects and authority

Externally visible effects flow through capability-bearing values such as `Context`, `FileSystem`, `System`, `Network`, `HeapAllocator`, `ExecutionDomain`, and `Reactor`.

```text
public procedure main(
    move ctx: Context
) -> i32 {
    let system = ctx.sys
    return system~>argument_count() as i32
}
```

Effects are reviewable because the relevant capability appears in the value flow.

## Compile-time generation

`comptime`, quote/splice, reflection, and emission support generated source without reducing the language model to string rewriting.

Generated code still has to pass the same contracts, modal state rules, permission rules, key rules, and execution-domain checks as handwritten code.
