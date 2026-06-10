---
title: "7.8 Name Resolution and Reserved Name Diagnostics"
description: "7.8 Name Resolution and Reserved Name Diagnostics from 7. Name Resolution and Visibility of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "name-resolution-and-visibility"
specSection: "78-name-resolution-and-reserved-name-diagnostics"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/name-resolution-and-visibility/">7. Name Resolution and Visibility</a>
  <span>Name Resolution and Visibility</span>
</div>

## 7.8 Name Resolution and Reserved Name Diagnostics

This section owns name-resolution, visibility, and reserved-name diagnostics.

| Code         | Severity | Detection    | Condition                                                                                                                                                                                                                                                                                 |
| ------------ | -------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `E-CNF-0406` | Error    | Compile-time | User declaration uses `gen_` prefix (`Intro-Reserved-Gen-Err`) |
| `E-MOD-1203` | Error    | Compile-time | Name introduced by `using` or `import as` conflicts with existing (`Import-Using-Name-Conflict`) |
| `E-MOD-1207` | Error    | Compile-time | Cannot access a non-public item from this scope (`Access-Err`) |
| `E-MOD-1301` | Error    | Compile-time | Unresolved name: identifier not found in any accessible scope (`ResolveExpr-Ident-Err`) |
| `E-MOD-1302` | Error    | Compile-time | Duplicate declaration in module scope (`Collect-Dup`, `Intro-Dup`, `Names-Step-Dup`) |
| `E-MOD-1304` | Error    | Compile-time | Name reuse: identifier already bound in an enclosing scope; choose a different name or use `using source as alias` for a compile-time alias (`Intro-Outer-Err`). When the outer binding is a universe name (primitive, special, or async type), the message SHOULD identify the category. |
| `E-MOD-1307` | Error    | Compile-time | Ambiguous name or method resolution; disambiguation required                                                                                                                                                                                                                              |
| `E-MOD-1308` | Error    | Compile-time | `using source as alias`: `source` does not resolve in any accessible scope (`Using-Alias-Unresolved`)                                                                                                                                                                                     |
| `E-MOD-1309` | Error    | Compile-time | `using source as alias`: `alias` conflicts with an existing binding in this or an enclosing scope (`Using-Alias-Dup`)                                                                                                                                                                     |
| `E-MOD-1310` | Error    | Compile-time | `using source as alias`: `alias` is a reserved identifier (`Using-Alias-Reserved`)                                                                                                                                                                                                        |
