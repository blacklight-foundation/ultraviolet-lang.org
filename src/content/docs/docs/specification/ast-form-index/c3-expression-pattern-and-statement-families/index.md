---
title: "C.3 Expression, Pattern, and Statement Families"
description: "C.3 Expression, Pattern, and Statement Families from Appendix C. AST Form Index of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "ast-form-index"
specSection: "c3-expression-pattern-and-statement-families"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
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
