---
title: "15.9 Behavioral Subtyping"
description: "15.9 Behavioral Subtyping from 15. Procedures and Contracts of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "procedures-and-contracts"
specSection: "159-behavioral-subtyping"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/procedures-and-contracts/">15. Procedures and Contracts</a>
  <span>Procedures and Contracts</span>
</div>

## 15.9 Behavioral Subtyping

### 15.9.1 Syntax

No additional surface syntax is introduced.

### 15.9.2 Parsing

Behavioral subtyping is not parser-owned.

### 15.9.3 AST Representation / Form

Behavioral subtyping constrains the relationship between a class procedure contract and the implementing procedure contract for the same logical operation.

### 15.9.4 Static Semantics

When a type implements a class, its procedure implementations MUST satisfy the Liskov substitution principle with respect to the class-defined contracts.

Precondition rule:

1. An implementation MAY weaken the class precondition.
2. An implementation MUST NOT strengthen the class precondition.

Postcondition rule:

1. An implementation MAY strengthen the class postcondition.
2. An implementation MUST NOT weaken the class postcondition.

Verification strategy:

1. Statically verify that the class precondition implies the implementation precondition.
2. Statically verify that the implementation postcondition implies the class postcondition.

No runtime checks are generated for behavioral-subtyping obligations.

### 15.9.5 Dynamic Semantics

Behavioral subtyping introduces no runtime semantics beyond the contracts already enforced or proven for the selected implementation.

### 15.9.6 Lowering

Lowering assumes behavioral-subtyping obligations have already been discharged statically and emits no extra checks for them.

### 15.9.7 Diagnostics

Diagnostics are defined for implementations that strengthen class preconditions or weaken class postconditions.
