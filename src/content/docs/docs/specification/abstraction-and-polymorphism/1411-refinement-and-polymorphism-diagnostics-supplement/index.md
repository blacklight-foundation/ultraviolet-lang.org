---
title: "14.11 Refinement and Polymorphism Diagnostics Supplement"
description: "14.11 Refinement and Polymorphism Diagnostics Supplement from 14. Abstraction and Polymorphism of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "abstraction-and-polymorphism"
specSection: "1411-refinement-and-polymorphism-diagnostics-supplement"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/abstraction-and-polymorphism/">14. Abstraction and Polymorphism</a>
  <span>Abstraction and Polymorphism</span>
</div>

## 14.11 Refinement and Polymorphism Diagnostics Supplement

This section owns diagnostics for refinement types, generic instantiation, class implementation, dynamic objects, and foundational predicate requirements.

| Code         | Severity | Detection    | Condition                                                                           |
| ------------ | -------- | ------------ | ----------------------------------------------------------------------------------- |
| `E-TYP-1953` | Error    | Compile-time | Refinement not provable outside `#dynamic` scope                                 |
| `E-TYP-1954` | Error    | Compile-time | Impure expression in refinement predicate                                           |
| `E-TYP-1955` | Error    | Compile-time | Predicate does not evaluate to `bool`                                               |
| `E-TYP-1956` | Error    | Compile-time | `self` used in inline parameter constraint                                          |
| `E-TYP-1957` | Error    | Compile-time | Circular type dependency in refinement predicate                                    |
| `P-TYP-1953` | Panic    | Runtime      | Refinement predicate failed at runtime                                              |
| `E-TYP-1520` | Error    | Compile-time | Invariant type parameter requires exact type match (`Chk-Generic-Invariant-Err`)    |
| `E-TYP-1521` | Error    | Compile-time | Covariant or contravariant generic variance requirement not satisfied (`Chk-Generic-Variance-Err`) |
| `E-TYP-2301` | Error    | Compile-time | Type arguments cannot be inferred; explicit instantiation required                  |
| `E-TYP-2302` | Error    | Compile-time | Type argument does not satisfy required class bound or predicate                    |
| `E-TYP-2303` | Error    | Compile-time | Wrong number of type arguments (`WF-ModalState-ArgCount-Err`) |
| `E-TYP-2304` | Error    | Compile-time | Duplicate type parameter name in generic declaration                                |
| `E-TYP-2305` | Error    | Compile-time | Class bound references a non-class type                                             |
| `E-TYP-2307` | Error    | Compile-time | Infinite monomorphization recursion                                                 |
| `E-TYP-2308` | Error    | Compile-time | Monomorphization depth limit exceeded                                               |
| `E-TYP-2401` | Error    | Compile-time | Non-modal type implements modal class                                               |
| `E-TYP-2402` | Error    | Compile-time | Implementing type missing required field                                            |
| `E-TYP-2403` | Error    | Compile-time | Implementing modal missing required state                                           |
| `E-TYP-2404` | Error    | Compile-time | Implementing field has incompatible type                                            |
| `E-TYP-2405` | Error    | Compile-time | Implementing state missing required payload field                                   |
| `E-TYP-2406` | Error    | Compile-time | Conflicting field names from multiple classes                                       |
| `E-TYP-2407` | Error    | Compile-time | Conflicting state names from multiple classes                                       |
| `E-TYP-2408` | Error    | Compile-time | Duplicate abstract field name in class                                              |
| `E-TYP-2409` | Error    | Compile-time | Duplicate abstract state name in class                                              |
| `E-TYP-2500` | Error    | Compile-time | Duplicate procedure name in class                                                   |
| `E-TYP-2501` | Error    | Compile-time | `override` used on abstract procedure implementation                                |
| `E-TYP-2502` | Error    | Compile-time | Missing `override` on concrete procedure replacement                                |
| `E-TYP-2503` | Error    | Compile-time | Type does not implement required procedure from class or has incompatible signature |
| `E-TYP-2504` | Error    | Compile-time | Duplicate associated type name in class                                             |
| `E-TYP-2505` | Error    | Compile-time | Name conflict among class members (`EffFields-Conflict`, `EffMethods-Conflict`) |
| `E-TYP-2506` | Error    | Compile-time | Coherence violation: duplicate class implementation                                 |
| `E-TYP-2507` | Error    | Compile-time | Orphan rule violation: neither type nor class is local                              |
| `E-TYP-2508` | Error    | Compile-time | Cyclic superclass dependency detected (`Superclass-Cycle`) |
| `E-TYP-2509` | Error    | Compile-time | Superclass bound refers to undefined class                                          |
| `E-TYP-2510` | Error    | Compile-time | Accessing member not defined on opaque type's class                                 |
| `E-TYP-2511` | Error    | Compile-time | Opaque return type does not implement required class                                |
| `E-TYP-2512` | Error    | Compile-time | Attempting to assign incompatible opaque types                                      |
| `E-TYP-2530` | Error    | Compile-time | Type argument does not satisfy class constraint                                     |
| `E-TYP-2531` | Error    | Compile-time | Unconstrained type parameter used in class method                                   |
| `E-TYP-2540` | Error    | Compile-time | Non-vtable-eligible procedure called on `$`                                         |
| `E-TYP-2541` | Error    | Compile-time | Dynamic class type created from non-dispatchable class                              |
| `E-TYP-2542` | Error    | Compile-time | Generic procedure in class is not vtable-eligible for `$` dispatch                  |
| `E-TYP-2621` | Error    | Compile-time | Type satisfies both `BitcopyType` and `DropType`                                    |
| `E-TYP-2622` | Error    | Compile-time | `BitcopyType` has non-`BitcopyType` field                                           |
| `E-UNS-0105` | Error    | Compile-time | `override` used with no concrete procedure to override                              |
| `E-UNS-0106` | Error    | Compile-time | Conflicting procedure signatures from multiple classes                              |
