---
title: "9.4 Optimization Attributes"
description: "9.4 Optimization Attributes from 9. Attributes and Metadata of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "attributes-and-metadata"
specSection: "94-optimization-attributes"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/attributes-and-metadata/">9. Attributes and Metadata</a>
  <span>Attributes and Metadata</span>
</div>

## 9.4 Optimization Attributes

### 9.4.1 Syntax

```text
inline_attribute ::= attr_open "inline" ("(" inline_mode ")")? attr_close
inline_mode      ::= "always" | "never" | "default"

cold_attribute   ::= attr_open "cold" attr_close
```

### 9.4.2 Parsing

Optimization attributes are parsed by the general attribute parser in §9.1.2. This section introduces no additional parsing rules.

### 9.4.3 AST Representation / Form

Optimization attributes are ordinary `AttributeSpec` entries attached to `ProcedureDecl` or `MethodDecl`.

### 9.4.4 Static Semantics

**`[[inline]]`.** The implementation SHOULD inline the procedure at call sites when feasible.

**`[[inline(always)]]`.** The implementation SHOULD inline the procedure at all call sites. If inlining is not possible, such as for reultraviolet procedures or procedures whose address is taken, the implementation SHOULD emit a warning.

**`[[inline(default)]]`.** Equivalent to omitting the attribute.

**`[[inline(never)]]`.** The implementation MUST NOT inline the procedure. The procedure body MUST be emitted as a separate callable unit.

**`[[cold]]`.** Marks a procedure as unlikely to execute during typical runs. The implementation MAY use this as an optimization hint.

### 9.4.5 Dynamic Semantics

Optimization attributes do not change the language-level runtime semantics of the annotated procedure.

### 9.4.6 Lowering

`[[inline(always)]]` and `[[inline(never)]]` constrain procedure inlining decisions during lowering. `[[inline(never)]]` requires emission of a separate callable unit. `[[cold]]` MAY influence code layout or backend optimization heuristics.

### 9.4.7 Diagnostics

| Code         | Severity | Detection    | Condition                            |
| ------------ | -------- | ------------ | ------------------------------------ |
| `W-MOD-2452` | Warning  | Compile-time | `inline(always)` but inlining failed |
