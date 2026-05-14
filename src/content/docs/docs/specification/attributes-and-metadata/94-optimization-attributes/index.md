---
title: "9.4 Optimization Attributes"
description: "9.4 Optimization Attributes from 9. Attributes and Metadata of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "attributes-and-metadata"
specSection: "94-optimization-attributes"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/attributes-and-metadata/">9. Attributes and Metadata</a>
  <span>Attributes and Metadata</span>
</div>

## 9.4 Optimization Attributes

### 9.4.1 Syntax

```text
inline_attribute ::= "[[" "inline" ("(" inline_mode ")")? "]]"
inline_mode      ::= "always" | "never" | "default"

cold_attribute   ::= "[[" "cold" "]]"
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
