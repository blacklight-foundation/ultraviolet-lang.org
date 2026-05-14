---
title: "C.2 Type Forms"
description: "C.2 Type Forms from Appendix C. AST Form Index of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "ast-form-index"
specSection: "c2-type-forms"
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
