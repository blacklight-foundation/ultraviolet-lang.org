---
title: "22.6 Compile-Time Diagnostics Supplement"
description: "22.6 Compile-Time Diagnostics Supplement from 22. Compile-Time Execution and Metaprogramming of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "compile-time-execution-and-metaprogramming"
specSection: "226-compile-time-diagnostics-supplement"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/compile-time-execution-and-metaprogramming/">22. Compile-Time Execution and Metaprogramming</a>
  <span>Compile-Time Execution and Metaprogramming</span>
</div>

## 22.6 Compile-Time Diagnostics Supplement

This section owns compile-time execution, reflection, quoting, emission, file-access, and derive diagnostics.

| Code         | Severity | Detection    | Condition                                                      |
| ------------ | -------- | ------------ | -------------------------------------------------------------- |
| `E-CTE-0010` | Error    | Compile-time | Non-comptime-available type in compile-time context            |
| `E-CTE-0011` | Error    | Compile-time | Pointer or provenance-bearing type in compile-time context     |
| `E-CTE-0012` | Error    | Compile-time | Capability-bearing type in compile-time context                |
| `E-CTE-0020` | Error    | Compile-time | Compile-time block contains prohibited runtime construct       |
| `E-CTE-0021` | Error    | Compile-time | Compile-time expression has non-comptime-available type        |
| `E-CTE-0022` | Error    | Compile-time | Compile-time evaluation did not terminate                      |
| `E-CTE-0023` | Error    | Compile-time | Compile-time evaluation panicked                               |
| `E-CTE-0030` | Error    | Compile-time | Compile-time procedure parameter type not comptime-available   |
| `E-CTE-0031` | Error    | Compile-time | Compile-time procedure return type not comptime-available      |
| `E-CTE-0032` | Error    | Compile-time | Compile-time procedure body violates compile-time restrictions |
| `E-CTE-0033` | Error    | Compile-time | Compile-time procedure contract predicate evaluates to false   |
| `E-CTE-0034` | Error    | Compile-time | Compile-time procedure referenced from runtime context         |
| `E-CTE-0040` | Error    | Compile-time | Emit operation without `TypeEmitter` capability                |
| `E-CTE-0041` | Error    | Compile-time | `[[emit]]` applied to non-compile-time form                    |
| `E-CTE-0042` | Error    | Compile-time | Emitted AST is ill-formed                                      |
| `E-CTE-0050` | Error    | Compile-time | Reflection `fields` applied to non-record type                 |
| `E-CTE-0051` | Error    | Compile-time | Reflection `variants` applied to non-enum type                 |
| `E-CTE-0052` | Error    | Compile-time | Reflection `states` applied to non-modal type                  |
| `E-CTE-0053` | Error    | Compile-time | Reflection requires incomplete or non-reflectable declaration  |
| `E-CTE-0060` | Error    | Compile-time | File operation without `ProjectFiles` capability               |
| `E-CTE-0061` | Error    | Compile-time | `[[files]]` applied to non-compile-time form                   |
| `E-CTE-0062` | Error    | Compile-time | Compile-time file path escapes project root                    |
| `E-CTE-0063` | Error    | Compile-time | Absolute path used in compile-time file operation              |
| `E-CTE-0064` | Error    | Compile-time | Compile-time file path not found                               |
| `E-CTE-0070` | Error    | Compile-time | Compile-time error emitted by user code                        |
| `W-CTE-0071` | Warning  | Compile-time | Compile-time warning emitted by user code                      |
| `E-CTE-0080` | Error    | Compile-time | `comptime if` condition not compile-time evaluable             |
| `E-CTE-0081` | Error    | Compile-time | `comptime if` condition does not have type `bool`              |
| `E-CTE-0082` | Error    | Compile-time | `comptime loop` source not compile-time evaluable              |
| `E-CTE-0083` | Error    | Compile-time | `comptime loop` source is not a finite iterable                |
| `E-CTE-0210` | Error    | Compile-time | `Ast` value used in runtime context                            |
| `E-CTE-0220` | Error    | Compile-time | Quoted content is syntactically invalid or category-ambiguous  |
| `E-CTE-0221` | Error    | Compile-time | Quote form outside compile-time context                        |
| `E-CTE-0230` | Error    | Compile-time | Splice type incompatible with quote context                    |
| `E-CTE-0231` | Error    | Compile-time | Splice expression not compile-time evaluable                   |
| `E-CTE-0232` | Error    | Compile-time | Invalid identifier string in splice                            |
| `E-CTE-0233` | Error    | Compile-time | Splice appears outside quote context                           |
| `E-CTE-0240` | Error    | Compile-time | Hygienic capture no longer resolves at emission site           |
| `E-CTE-0241` | Error    | Compile-time | Hygiene renaming collision after unhygienic splice             |
| `E-CTE-0250` | Error    | Compile-time | Emit call without `TypeEmitter` capability                     |
| `E-CTE-0251` | Error    | Compile-time | Emitted AST is not an item                                     |
| `E-CTE-0252` | Error    | Compile-time | Emitted AST fails well-formedness after insertion              |
| `E-CTE-0253` | Error    | Compile-time | Type error in emitted code                                     |
| `E-CTE-0310` | Error    | Compile-time | Unknown derive target name                                     |
| `E-CTE-0311` | Error    | Compile-time | `[[derive(... )]]` applied to non-type declaration             |
| `E-CTE-0312` | Error    | Compile-time | Duplicate derive target in one derive attribute                |
| `E-CTE-0320` | Error    | Compile-time | Derive target body violates compile-time restrictions          |
| `E-CTE-0321` | Error    | Compile-time | Derive contract references unknown class                       |
| `E-CTE-0322` | Error    | Compile-time | Derive target declaration has invalid signature                |
| `E-CTE-0330` | Error    | Compile-time | Required class not implemented by derive target subject        |
| `E-CTE-0331` | Error    | Compile-time | Emitted class not implemented by derive target subject         |
| `E-CTE-0340` | Error    | Compile-time | Cyclic derive dependency                                       |
| `E-CTE-0341` | Error    | Compile-time | Derive target execution panicked                               |
| `E-CTE-0410` | Error    | Compile-time | Ill-formed type in `Type::<...>`                               |
| `E-CTE-0411` | Error    | Compile-time | `Type::<...>` used in runtime context                          |
| `E-CTE-0420` | Error    | Compile-time | Reflection category query on incomplete declaration            |
| `E-CTE-0430` | Error    | Compile-time | Reflection `fields` query on non-record type                   |
| `E-CTE-0440` | Error    | Compile-time | Reflection `variants` query on non-enum type                   |
| `E-CTE-0450` | Error    | Compile-time | Reflection `states` query on non-modal type                    |
| `E-CTE-0470` | Error    | Compile-time | Reflection type-predicate query on incomplete declaration      |

`diagnostics.error(msg)` MUST append `⟨`E-CTE-0070`, Error, msg, sp⟩`, where `sp` is the current compile-time site span.
`diagnostics.warning(msg)` MUST append `⟨`W-CTE-0071`, Warning, msg, sp⟩`, where `sp` is the current compile-time site span.
`diagnostics.note(msg)` MUST append `⟨⊥, Note, msg, sp⟩`, where `sp` is the current compile-time site span.
