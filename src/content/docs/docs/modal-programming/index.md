---
title: Modal Programming
description: Ultraviolet's state-and-transition programming style.
---

Modal programming is Ultraviolet's primary programming style. It organizes software around states, transitions, contracts, permissions, keys, and execution domains.

Where functional programming centers functions and declarative programming centers intent, modal programming centers **state, transition, and valid operation**.

## The idea

A modal value has a current state. Each state can have its own fields, methods, and transitions. Operations that are valid in one state are not automatically valid in another.

This gives generated code an explicit review surface for lifecycle and protocol rules:

- a file can be open, readable, writable, appendable, or closed;
- a region can be active or unavailable;
- async work can be pending, running, completed, cancelled, or failed;
- a protocol session can expose different operations after each transition.

## Modal declaration shape

```text
modal Session {
    @Disconnected {
        public transition connect() -> @Connected {
            return Session@Connected {}
        }
    }

    @Connected {
        public transition close() -> @Disconnected {
            return Session@Disconnected {}
        }
    }
}
```

The state name appears in the type surface as `Session@Disconnected` or `Session@Connected`.

## Why it matters for generated code

Generated source often fails at lifecycle boundaries. Modal programming gives the agent a structured way to express the lifecycle and gives a reviewer concrete syntax to inspect.

The relevant questions become local:

- Which state is this value in now?
- Which transition changes that state?
- Which fields exist only in this state?
- Which methods are callable from this state?
- Which contracts and permissions govern the transition?

## Relationship to typestate

Typestate is established prior art for tracking valid operations as program state changes. Ultraviolet's modal programming style builds on that family of ideas and expands the review surface to include contracts, permissions, key-mediated sharing, structured concurrency, async state, and CPU/GPU execution domains.

## Specification

- [13. Modal and Special Types](/docs/specification/modal-and-special-types/)
- [21. Asynchronous Operations](/docs/specification/asynchronous-operations/)
- [24.6 Runtime Interface](/docs/specification/common-lowering-program-lifecycle-and-backend/)
