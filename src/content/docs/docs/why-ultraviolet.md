---
title: Why Ultraviolet
description: The language hook and design reason for Ultraviolet.
---

Ultraviolet is built for a practical pressure point: AI agents can produce large amounts of code, but generated code still has to be reviewed, maintained, optimized, and trusted by humans.

The language hook is direct: **make it easier for AI agents to write performant, safe, auditable code, and easier for humans to spot when they do not.**

## What must stay visible

Ultraviolet makes source-level choices visible where reviewers need them:

- which contracts a procedure promises;
- which state a resource or protocol is in;
- which transitions are valid;
- which binding has responsibility for cleanup;
- which permission governs access and mutation;
- which shared access requires a key;
- which work is parallel, async, synchronized, or raced;
- which code runs on CPU or GPU;
- which operations perform effects through capability-bearing values.

The goal is not just to make generated code compile. The goal is generated source that a human can audit locally.

## The programming style

Ultraviolet's primary programming style is **modal programming**.

Modal programming organizes software around states, transitions, contracts, permissions, keys, and execution domains. Where functional programming centers functions and declarative programming centers intent, modal programming centers state, transition, and valid operation.

That style matters for generated code because many real bugs are state bugs: using a closed file, calling a protocol method in the wrong state, mutating shared data without the right synchronization, moving a value after responsibility has transferred, or dispatching work into an execution domain with invalid inputs.

## The main surfaces

The public language model is organized around six main surfaces:

| Surface | Review question |
| :------ | :-------------- |
| Contracts | What does this procedure require and promise? |
| Modals | Which states exist, and which operations are valid in each state? |
| Permissions | Who can read, write, alias, or move this value? |
| Key system | Which shared data is protected, and by which key path? |
| Structured concurrency | Where does work start, synchronize, race, or suspend? |
| CPU/GPU programming | Where does work run, and is it valid for that domain? |

## Design contract

The specification's language design contract requires local reasoning, explicit semantic form, and static defaults. These are not separate marketing bullets; they are the engineering rules that support the generated-code auditability hook.

Use the [Language Tour](/docs/language-tour/) for a guided pass, then read [Modal Programming](/docs/modal-programming/) and the [Specification](/docs/specification/) for exact rules.
