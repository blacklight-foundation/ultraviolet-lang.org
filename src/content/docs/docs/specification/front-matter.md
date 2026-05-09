---
title: "Front Matter"
description: "0. Front Matter of the Ultraviolet language specification."
specSource: "../../Ultraviolet/SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T14:44:07.538Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## 0. Front Matter

### 0.1 Document Organization

1. This file is the canonical normative language specification.
2. Each feature section MUST have exactly one normative home in this file.
3. Each leaf feature section MUST use this subsection order:
   - `Syntax`
   - `Parsing`
   - `AST Representation / Form`
   - `Static Semantics`
   - `Dynamic Semantics`
   - `Lowering`
   - `Diagnostics`
4. Shared framework material belongs only in infrastructure chapters.

### 0.2 Canonical Chapter Outline

- `0. Front Matter`
- `1. Conformance and Notation`
- `2. Diagnostic Infrastructure`
- `3. Project and Compilation Model`
- `4. Source Text and Lexical Structure`
- `5. Parsing and AST Infrastructure`
- `6. Abstract Machine, Objects, Responsibility, and Authority`
- `7. Name Resolution and Visibility`
- `8. Type System Core`
- `9. Attributes and Metadata`
- `10. Permissions and Binding State`
- `11. Module-Level Forms`
- `12. Concrete Data Types`
- `13. Modal and Special Types`
- `14. Abstraction and Polymorphism`
- `15. Procedures and Contracts`
- `16. Expressions`
- `17. Patterns`
- `18. Statements and Blocks`
- `19. Key System`
- `20. Structured Parallelism`
- `21. Asynchronous Operations`
- `22. Compile-Time Execution and Metaprogramming`
- `23. Foreign Function Interface`
- `24. Common Lowering, Program Lifecycle, and Backend`
- `Appendix A. Diagnostic Index Reference`
- `Appendix B. Complete Grammar Reference`
- `Appendix C. AST Form Index Reference`
- `Appendix D. Layout, ABI, and Runtime Reference`

### 0.3 Required Feature Section Template

| Subsection                  | Required Content                                                              |
| --------------------------- | ----------------------------------------------------------------------------- |
| `Syntax`                    | Concrete grammar and surface-form restrictions                                |
| `Parsing`                   | Parse entry points, disambiguation, recovery, feature-local parse constraints |
| `AST Representation / Form` | AST forms, invariants, normalized forms                                       |
| `Static Semantics`          | Well-formedness, resolution, typing, admissibility, compile-time rejection    |
| `Dynamic Semantics`         | Abstract-machine behavior, runtime transitions, observable effects            |
| `Lowering`                  | Feature-local IR, ABI, layout, and backend mapping rules                      |
| `Diagnostics`               | Diagnostic conditions owned by the feature section                            |


### 0.4 Language Design Contract

Ultraviolet is a general-purpose systems programming language optimized for
machine-generated source code and human review.

A conforming design change SHOULD preserve the following principles:

1. One Correct Way.
   Where possible, each semantic operation in Ultraviolet MUST have exactly one accepted source form.
   
   A language feature SHOULD NOT introduce aliases, shorthand forms, optional equivalent spellings, or syntactic sugar that lower to the same AST form and have identical static and dynamic semantics.
   
   An alternate source form is permitted only when it changes at least one of:
   
   1. static semantics;
   2. dynamic semantics;
   3. authority or capability requirements;
   4. ownership, movement, copying, or responsibility;
   5. synchronization behavior;
   6. suspension behavior;
   7. ABI, layout, or foreign-boundary behavior;
   8. diagnostic behavior in a way that is part of the language contract.
   
   Formatting whitespace and comments are not semantic source forms for this principle, but grammar-level alternatives are.

2. Local Reasoning.
   A reader SHOULD be able to determine the authority, mutability, ownership, copy/move/reference behavior, synchronization behavior, suspension behavior, and dynamic-check behavior of a construct from its local syntactic context and the directly referenced type/procedure signature.

3. Explicit over Implicit.
   Source constructs MUST NOT hide externally observable effects, synchronization, allocation, copying, dynamic verification, suspension, unsafe behavior, or authority acquisition.

4. Static by Default.
   Where both static and runtime mechanisms are possible, the static mechanism is the default. Runtime checks, runtime synchronization, dynamic dispatch, heap allocation, copying, and foreign trust boundaries require explicit source opt-in.
