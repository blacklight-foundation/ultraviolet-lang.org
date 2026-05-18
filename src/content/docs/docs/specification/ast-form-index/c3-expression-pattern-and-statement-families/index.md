---
title: "C.3 Expression, Pattern, and Statement Families"
description: "C.3 Expression, Pattern, and Statement Families from Appendix C. AST Form Index of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "ast-form-index"
specSection: "c3-expression-pattern-and-statement-families"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
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
