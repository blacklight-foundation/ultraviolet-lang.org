---
title: "15.10 Procedure, Contract, and Entry Diagnostics Supplement"
description: "15.10 Procedure, Contract, and Entry Diagnostics Supplement from 15. Procedures and Contracts of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "procedures-and-contracts"
specSection: "1510-procedure-contract-and-entry-diagnostics-supplement"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/procedures-and-contracts/">15. Procedures and Contracts</a>
  <span>Procedures and Contracts</span>
</div>

## 15.10 Procedure, Contract, and Entry Diagnostics Supplement

This section owns diagnostics for procedure declarations, receiver constraints, `main`, and contract verification obligations.

| Code         | Severity | Detection    | Condition                                                                          |
| ------------ | -------- | ------------ | ---------------------------------------------------------------------------------- |
| `E-TYP-1507` | Error    | Compile-time | Procedure with non-unit return type requires explicit return statement             |
| `E-TYP-1508` | Error    | Compile-time | Procedure declaration requires explicit return type annotation                     |
| `E-TYP-1912` | Error    | Compile-time | Explicit receiver type must be `Self` for record methods                           |
| `E-MOD-2411` | Error    | Compile-time | Missing move expression at call site for transferring provenance-bearing parameter |
| `E-MOD-2430` | Error    | Compile-time | Multiple `main` procedures defined (`Main-Multiple`) |
| `E-MOD-2431` | Error    | Compile-time | Invalid `main` signature (`Main-Signature-Err`) |
| `E-MOD-2432` | Error    | Compile-time | `main` is generic (has type parameters) (`Main-Generic-Err`) |
| `E-MOD-2434` | Error    | Compile-time | Missing `main` procedure (`Main-Missing`) |
| `E-CON-0415` | Error    | Compile-time | Capability-requiring operation in `@entry` expression                              |
| `E-CON-0416` | Error    | Compile-time | Side-effecting operation in `@entry` expression                                    |
| `P-SEM-2850` | Panic    | Runtime      | Contract predicate failed at runtime                                               |
| `E-SEM-2801` | Error    | Compile-time | Contract predicate not provable outside `#dynamic` scope                        |
| `E-SEM-2802` | Error    | Compile-time | Impure expression in contract predicate                                            |
| `E-SEM-2803` | Error    | Compile-time | Implementation strengthens class precondition                                      |
| `E-SEM-2804` | Error    | Compile-time | Implementation weakens class postcondition                                         |
| `E-SEM-2805` | Error    | Compile-time | `@entry()` result type not `BitcopyType`                                           |
| `E-SEM-2806` | Error    | Compile-time | `@result` used outside postcondition                                               |
| `E-SEM-2807` | Error    | Compile-time | `@entry()` references parameter whose value is unavailable after binding           |
| `E-SEM-2808` | Error    | Compile-time | Contract predicate must have type `bool`                                           |
| `E-SEM-2820` | Error    | Compile-time | Type invariant violated at construction                                            |
| `E-SEM-2821` | Error    | Compile-time | Type invariant violated at public entry                                            |
| `E-SEM-2822` | Error    | Compile-time | Type invariant violated at mutator return                                          |
| `E-SEM-2823` | Error    | Compile-time | Type invariant violated at private-to-public return                                |
| `E-SEM-2824` | Error    | Compile-time | Public mutable field on type with invariant                                        |
| `E-SEM-2830` | Error    | Compile-time | Loop invariant not established at initialization                                   |
| `E-SEM-2831` | Error    | Compile-time | Loop invariant not maintained across iteration                                     |
| `E-SEM-3004` | Error    | Compile-time | Impure expression in contract clause                                               |
