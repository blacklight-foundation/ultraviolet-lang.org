---
title: "17.7 Pattern Diagnostics Supplement"
description: "17.7 Pattern Diagnostics Supplement from 17. Patterns of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "patterns"
specSection: "177-pattern-diagnostics-supplement"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/patterns/">17. Patterns</a>
  <span>Patterns</span>
</div>

## 17.7 Pattern Diagnostics Supplement

This section owns diagnostics for pattern exhaustiveness, irrefutability, and pattern-shape validity.

**(IfIs-BareTypePattern-Err)**

$$
\begin{array}{l}
\texttt{if ... is}\ \mathsf{case}\ \mathsf{position}\ \mathsf{contains}\ \operatorname{IdentifierPattern}(x)\quad \operatorname{ResolveTypeName}(\Gamma ,\ x)\ \mathsf{defined}\quad c\ =\ \operatorname{Code}(\mathsf{IfIs}-\mathsf{BareTypePattern}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IfIsCasePattern}(\operatorname{IdentifierPattern}(x))\ \Uparrow \ c
\end{array}
$$

**(IfIs-TypedPattern-Incompatible)**

$$
\begin{array}{l}
\texttt{if ... is}\ \mathsf{case}\ \mathsf{position}\ \mathsf{contains}\ \operatorname{TypedPattern}(x,\ T_{a})\quad \Gamma \ \vdash \ \operatorname{TypedPattern}(x,\ T_{a})\ \triangleleft \ T_{s}\ \mathsf{undefined}\quad c\ =\ \operatorname{Code}(\mathsf{IfIs}-\mathsf{TypedPattern}-\mathsf{Incompatible}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{IfIsCasePattern}(\operatorname{TypedPattern}(x,\ T_{a}),\ T_{s})\ \Uparrow \ c
\end{array}
$$

| Code         | Severity | Detection    | Condition                                                          |
| ------------ | -------- | ------------ | ------------------------------------------------------------------ |
| `E-SEM-2705` | Error    | Compile-time | `if ... is { ... }` case analysis is not exhaustive for union type |
| `E-SEM-2711` | Error    | Compile-time | Refutable pattern in irrefutable context (`let`)                   |
| `E-SEM-2713` | Error    | Compile-time | Duplicate binding identifier within single pattern                 |
| `E-SEM-2721` | Error    | Compile-time | Range pattern bounds are not compile-time constants                |
| `E-SEM-2722` | Error    | Compile-time | Range pattern start exceeds end (empty range)                      |
| `E-SEM-2731` | Error    | Compile-time | Record pattern references non-existent field                       |
| `E-SEM-2741` | Error    | Compile-time | `if ... is { ... }` case analysis is not exhaustive                |
| `E-SEM-2751` | Error    | Compile-time | Case clause is unreachable                                         |
| `E-SEM-2761` | Error    | Compile-time | Bare type name in `if ... is` pattern; use `: T` or `_: T`         |
| `E-SEM-2762` | Error    | Compile-time | Typed `if ... is` pattern is incompatible with the scrutinee type  |
