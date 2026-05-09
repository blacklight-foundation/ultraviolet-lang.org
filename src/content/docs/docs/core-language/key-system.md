---
title: Key System
description: Language-level synchronization for shared data.
---

The key system coordinates access to `shared` data. It gives generated code a visible synchronization surface and gives reviewers a concrete path to inspect.

## Key paths

A key path identifies the shared place being protected.

```text
key cache.entries#[id] read {
    let value = cache.entries[id]
}
```

The `#` marker identifies the dynamic segment that participates in the key path. The specification allows at most one marker per key path.

## Read and write modes

Shared field reads require read coverage. Shared mutation requires write coverage.

| Operation | Required key mode |
| :-------- | :---------------- |
| Field read | Read |
| Field mutation | Write |
| `~` method call | Read |
| `~%` method call | Write |

## Why keys matter

Keys make synchronization visible at the language level. Generated code has to expose the shared path it is coordinating, and reviewers can inspect the protected path rather than infer it from a library-specific locking convention.

## Concurrency integration

The key system integrates with structured parallelism and async. Shared data access inside parallel, dispatch, or async contexts still has a key path and conflict model.

## Specification

- [19. Key System](/docs/specification/key-system/)
- [20. Structured Parallelism](/docs/specification/structured-parallelism/)
- [21.5 Async-Key Integration](/docs/specification/asynchronous-operations/)
