---
title: AI-Written Code Review
description: How Ultraviolet makes generated code easier to audit.
---

Ultraviolet is designed for AI agents that generate source and humans who have to review it. The language makes the high-risk parts of generated code explicit: state, transition, permission, synchronization, execution domain, contract, and effect.

## Review model

A human reviewer should be able to answer these questions from local source:

- What must be true before this procedure runs?
- What does it promise when it returns?
- Which state is this value in?
- Which operations are valid in that state?
- Who owns cleanup responsibility?
- Which bindings may alias or mutate the same storage?
- Which shared paths require keys?
- Where does parallel or async work begin and end?
- Does this work run on CPU, GPU, or inline?
- Which capability-bearing value permits the effect?

The specification formalizes that expectation in the language design contract.

## Why AI agents need this shape

Generated code can look plausible while hiding the mistake that matters: an operation in the wrong state, a missing synchronization boundary, a moved value used again, a GPU dispatch that captures an invalid type, or a contract that fails to express the intended guarantee.

Ultraviolet's source model is shaped so those decisions have visible syntax and type-level consequences.

## Documentation path

Read these pages in order:

1. [Why Ultraviolet](/docs/why-ultraviolet/)
2. [Modal Programming](/docs/modal-programming/)
3. [Contracts](/docs/core-language/contracts/)
4. [Permissions](/docs/core-language/permissions/)
5. [Key System](/docs/core-language/key-system/)
6. [Structured Concurrency](/docs/core-language/structured-concurrency/)
7. [CPU/GPU Programming](/docs/core-language/cpu-gpu-programming/)

The full formal rules are in the [generated specification](/docs/specification/).
