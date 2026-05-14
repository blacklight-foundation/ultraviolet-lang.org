---
title: "AST Form Index"
description: "Appendix C. AST Form Index of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
generatedAt: "2026-05-14T00:55:03.609Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>


Informative. Appendix C catalogs canonical AST ownership in the reorganized draft.

## C.1 Item Forms

| AST Item Form      | Canonical Owner                                                        |
| ------------------ | ---------------------------------------------------------------------- |
| `ImportDecl`       | `11.1 Import Declarations`                                             |
| `UsingDecl`        | `11.2 Using Declarations`                                              |
| `ExternBlock`      | `11.4 Extern Block Shell` and Chapter `23` for extern/export semantics |
| `StaticDecl`       | `11.3 Static Declarations`                                             |
| `ProcedureDecl`    | `15.1 Procedure Declarations`                                          |
| `CtProc`           | `22.1 Compile-Time Forms`                                              |
| `DeriveTargetDecl` | `22.5 Derive Targets and Contracts`                                    |
| `RecordDecl`       | `12.6 Records`                                                         |
| `EnumDecl`         | `12.7 Enums`                                                           |
| `ModalDecl`        | `13.1 Modal Declarations`                                              |
| `ClassDecl`        | `14.3 Classes`                                                         |
| `TypeAliasDecl`    | `12.9 Type Aliases`                                                    |

## C.2 Type Forms

| AST Type Form                                                                                              | Canonical Owner                                                                               |
| ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `TypePerm`                                                                                                 | `10. Permissions and Binding State`                                                           |
| `TypePrim`                                                                                                 | `12.1 Primitive Types`                                                                        |
| `TypeTuple`                                                                                                | `12.2 Tuples`                                                                                 |
| `TypeArray`                                                                                                | `12.3 Arrays`                                                                                 |
| `TypeSlice`                                                                                                | `12.4 Slices`                                                                                 |
| `TypeRange`, `TypeRangeInclusive`, `TypeRangeFrom`, `TypeRangeTo`, `TypeRangeToInclusive`, `TypeRangeFull` | `12.5 Ranges`                                                                                 |
| `TypeUnion`                                                                                                | `12.8 Union Types`                                                                            |
| `TypePath`, `TypeApply`                                                                                    | owner determined by resolved declaration kind; generic-application rules in `14.1` and `14.2` |
| `TypeFunc`                                                                                                 | `13.10 Function Types`                                                                        |
| `TypeClosure`                                                                                              | `13.11 Closure Types`                                                                         |
| `TypePtr`                                                                                                  | `13.8 Safe Pointer Types`                                                                     |
| `TypeRawPtr`                                                                                               | `13.9 Raw Pointer Types`                                                                      |
| `TypeString`                                                                                               | `13.6 String Types`                                                                           |
| `TypeBytes`                                                                                                | `13.7 Bytes Types`                                                                            |
| `TypeModalState`                                                                                           | `13.1 Modal Declarations`                                                                     |
| `TypeDynamic`                                                                                              | `14.6 Dynamic Class Objects`                                                                  |
| `TypeOpaque`                                                                                               | `14.7 Opaque Types`                                                                           |
| `TypeRefine`                                                                                               | `14.8 Refinement Types`                                                                       |

## C.3 Expression, Pattern, and Statement Families

| AST Family                                                                             | Canonical Owner                                  |
| -------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Non-concurrency expressions other than key blocks                                      | `16. Expressions`                                |
| Key-path and key-block expression and statement forms                                  | `19. The Key System`                             |
| `ParallelExpr`, `SpawnExpr`, `DispatchExpr`                                            | `20. Structured Parallelism`                     |
| `WaitExpr`, `YieldExpr`, `YieldFromExpr`, `SyncExpr`, `RaceExpr`, `AllExpr`            | `21. Asynchronous Operations`                    |
| `CtExpr`, `CtStmt`, `CtIf`, `CtLoopIter`, `Type::<...>`, quote forms, and splice forms | `22. Compile-Time Execution and Metaprogramming` |
| All pattern forms                                                                      | `17. Patterns`                                   |
| All statement forms other than key-system-owned statements                             | `18. Statements and Blocks`                      |
