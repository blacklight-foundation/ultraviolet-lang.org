---
title: Diagnostics
description: Diagnostic records, rendering, and command output.
---

Ultraviolet diagnostics are specified records with severity, message, optional code, and optional source span.

## Diagnostic shape

The specification models diagnostics as:

```text
Diagnostic = <code, severity, message, span>
```

Code-owned diagnostics have a diagnostic code. Auxiliary diagnostics may omit one where the owning feature section allows it.

## Command output

The `uv` command surface renders diagnostics to stderr. Code-bearing diagnostics render the code and severity, then the message and source span when present.

## Why diagnostics matter

Diagnostics are part of the review loop for AI-written code. A generated source change should fail with a clear reason when it violates contracts, permissions, modal state rules, key rules, GPU-safe restrictions, or project configuration rules.

## Specification

- [2. Diagnostic Infrastructure](/docs/specification/diagnostic-infrastructure/)
- [Appendix A. Diagnostic Index](/docs/specification/diagnostic-index/)
