---
title: "13.12 Modal and Pointer Diagnostics Supplement"
description: "13.12 Modal and Pointer Diagnostics Supplement from 13. Modal and Special Types of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "modal-and-special-types"
specSection: "1312-modal-and-pointer-diagnostics-supplement"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/modal-and-special-types/">13. Modal and Special Types</a>
  <span>Modal and Special Types</span>
</div>

## 13.12 Modal and Pointer Diagnostics Supplement

This section owns diagnostics for modal-state usage, modal widening, and pointer operations.

| Code         | Severity | Detection    | Condition                                                                                                                |
| ------------ | -------- | ------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `E-TYP-2050` | Error    | Compile-time | Modal type declares zero states                                                                                          |
| `E-TYP-2051` | Error    | Compile-time | Duplicate state name within modal type                                                                                   |
| `E-TYP-2052` | Error    | Compile-time | Field access for field not present in current state's payload                                                            |
| `E-TYP-2053` | Error    | Compile-time | Method invocation for method not available in current state                                                              |
| `E-TYP-2054` | Error    | Compile-time | State name collides with modal type name                                                                                 |
| `E-TYP-2055` | Error    | Compile-time | Transition body returns value not matching declared target state                                                         |
| `E-TYP-2056` | Error    | Compile-time | Transition invoked on value not of declared source state                                                                 |
| `E-TYP-2057` | Error    | Compile-time | Direct field access on general modal type without pattern matching                                                       |
| `E-TYP-2058` | Error    | Compile-time | Duplicate field name in modal state payload                                                                              |
| `E-TYP-2059` | Error    | Compile-time | Transition target state not declared in modal type                                                                       |
| `E-TYP-2060` | Error    | Compile-time | Non-exhaustive `if ... is { ... }` on general modal type                                                                 |
| `E-TYP-2061` | Error    | Compile-time | Duplicate method name in modal state                                                                                     |
| `E-TYP-2062` | Error    | Compile-time | Duplicate transition name in modal state                                                                                 |
| `E-TYP-2063` | Error    | Compile-time | State member visibility exceeds modal visibility                                                                         |
| `E-TYP-2064` | Error    | Compile-time | State member not visible in current scope                                                                                |
| `E-TYP-2065` | Error    | Compile-time | State method name conflicts with transition name in the same modal state                                                 |
| `E-TYP-2070` | Error    | Compile-time | Implicit widening on non-niche-layout-compatible type                                                                    |
| `E-TYP-2071` | Error    | Compile-time | `widen` applied to non-modal type                                                                                        |
| `E-TYP-2072` | Error    | Compile-time | `widen` applied to already-general modal type                                                                            |
| `E-TYP-2073` | Error    | Compile-time | Record literal whose type is `File@S`, `DirIter@S`, or `CancelToken@S` for any state `S` in the corresponding modal type |
| `W-SYS-4010` | Warning  | Compile-time | Modal widening involves large payload copy (>256 bytes)                                                                  |
| `E-TYP-2101` | Error    | Compile-time | Dereference of pointer in `@Null` state                                                                                  |
| `E-TYP-2102` | Error    | Compile-time | Dereference of pointer in `@Expired` state                                                                               |
| `E-TYP-2103` | Error    | Compile-time | Dereference of raw pointer outside `unsafe`                                                                              |
| `E-TYP-2104` | Error    | Compile-time | Address-of applied to non-place expression                                                                               |
