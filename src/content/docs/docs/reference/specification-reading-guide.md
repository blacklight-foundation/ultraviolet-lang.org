---
title: Specification Reading Guide
description: How to read the generated Ultraviolet language specification.
---

The generated specification is the authoritative reference for Ultraviolet language behavior. Guide pages explain the model for learning and review; when a guide and the generated specification disagree, the specification controls until the documentation is corrected.

## What each section means

Each feature chapter follows the same structure:

| Section | Role |
| :------ | :--- |
| Syntax | Surface grammar accepted by the language |
| Parsing | Parser rules and recovery behavior for the surface |
| AST Representation / Form | Internal forms and judgments used by later rules |
| Static Semantics | Compile-time typing, permission, key, authority, proof, and well-formedness rules |
| Dynamic Semantics | Runtime behavior admitted by the language |
| Lowering | Required compiler lowering shape or observable lowering obligations |
| Diagnostics | Named errors, warnings, and informational diagnostics owned by the feature |

Use the guide pages for a readable pass through the design. Use the generated specification when checking exact rule ownership, diagnostic conditions, or whether a guide statement is precise enough.

## Correctness workflow

For language documentation updates:

1. Find the generated specification chapter that owns the behavior.
2. Write guide text using the same feature names and rule boundaries.
3. Link the guide text to the owning specification chapter or subsection.
4. Treat unclear specification text as a specification issue rather than inventing behavior in the guide.
5. Regenerate and check the specification pages after source-spec changes.

## Key specification anchors

- [Generated Specification](/docs/specification/)
- [Conformance and Notation](/docs/specification/conformance-and-notation/)
- [Permissions and Binding State](/docs/specification/permissions-and-binding-state/)
- [Key System](/docs/specification/key-system/)
- [Structured Parallelism](/docs/specification/structured-parallelism/)
- [Asynchronous Operations](/docs/specification/asynchronous-operations/)
- [Diagnostic Index](/docs/specification/diagnostic-index/)
