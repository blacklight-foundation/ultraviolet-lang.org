---
title: Permissions and Responsibility
description: Access, mutation, aliasing, and responsibility in Ultraviolet.
---

Permissions describe how a binding may access data. Responsibility describes who owns cleanup or transfer. Ultraviolet keeps those concepts visible and separate.

## Permission regimes

| Permission | Read | Write | Aliasing | Synchronization |
| :--------- | :--- | :---- | :------- | :-------------- |
| `const` | Yes | No | Unlimited | N/A |
| `shared` | Yes | Yes | Aliasable | Key-mediated |
| `unique` | Yes | Yes | Exclusive | None |

When no permission is specified, `const` is the default.

## Responsibility transfer

`move` transfers responsibility.

```text
public procedure consume(
    move buffer: Buffer
) -> i32 {
    return 0
}
```

This is separate from `unique`. A `unique` binding grants exclusive access; it does not automatically imply cleanup transfer.

## Binding state

The specification models binding activity as a state machine. A `unique` binding can become inactive while a non-consuming admissible use is live, then return to active when that use ends.

This matters for generated code because accidental reuse after a move or during an incompatible borrow becomes part of the type and binding-state review surface.

## Receiver shorthand

Receiver shorthand maps methods to permission requirements:

| Receiver | Permission |
| :------- | :--------- |
| `~` | `const` |
| `~%` | `shared` |
| `~!` | `unique` |

## Specification

- [10. Permissions and Binding State](/docs/specification/permissions-and-binding-state/)
- [6.3 Binding and Permission Runtime State](/docs/specification/abstract-machine-objects-responsibility-and-authority/)
- [24.2 Layout and ABI Framework](/docs/specification/common-lowering-program-lifecycle-and-backend/)
