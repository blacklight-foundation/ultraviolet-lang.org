---
title: "C.3 Expression, Pattern, and Statement Families"
description: "C.3 Expression, Pattern, and Statement Families from Appendix C. AST Form Index of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "ast-form-index"
specSection: "c3-expression-pattern-and-statement-families"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/ast-form-index/">Appendix C. AST Form Index</a>
  <span>AST Form Index</span>
</div>

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
