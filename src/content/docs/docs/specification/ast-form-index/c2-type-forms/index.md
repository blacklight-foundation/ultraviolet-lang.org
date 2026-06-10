---
title: "C.2 Type Forms"
description: "C.2 Type Forms from Appendix C. AST Form Index of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "ast-form-index"
specSection: "c2-type-forms"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/ast-form-index/">Appendix C. AST Form Index</a>
  <span>AST Form Index</span>
</div>

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
