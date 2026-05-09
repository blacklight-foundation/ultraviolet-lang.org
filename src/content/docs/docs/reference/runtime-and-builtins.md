---
title: Runtime and Built-ins
description: Runtime capabilities, built-ins, and lifecycle surfaces.
---

The runtime surface includes capability-bearing values, modal built-ins, memory/runtime support, and program lifecycle behavior.

## Capability-bearing values

`Context` can project standard capability-bearing values:

- `FileSystem`
- `Network`
- `HeapAllocator`
- `ExecutionDomain`
- `Reactor`
- `System`

These values are how effect-bearing operations become visible in source.

## Built-in modal surfaces

The specification defines built-in modal surfaces such as:

- `Region`
- `File`
- `DirIter`
- `CancelToken`
- `Spawned`
- `Tracked`
- `Async`
- `Outcome`

## Runtime source areas

- `Runtime/Context`
- `Runtime/IO`
- `Runtime/Memory`
- `Runtime/Concurrency`
- `Runtime/System`
- `Runtime/Network`
- `Runtime/Host`

## Specification

- [6. Abstract Machine, Objects, Responsibility, and Authority](/docs/specification/abstract-machine-objects-responsibility-and-authority/)
- [13. Modal and Special Types](/docs/specification/modal-and-special-types/)
- [24.6 Runtime Interface](/docs/specification/common-lowering-program-lifecycle-and-backend/)
