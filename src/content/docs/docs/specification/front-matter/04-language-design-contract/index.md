---
title: "0.4 Language Design Contract"
description: "0.4 Language Design Contract from 0. Front Matter of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "front-matter"
specSection: "04-language-design-contract"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/front-matter/">0. Front Matter</a>
  <span>Front Matter</span>
</div>

## 0.4 Language Design Contract

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
