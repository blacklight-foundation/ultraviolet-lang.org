---
title: "B.14 Region Grammar"
description: "B.14 Region Grammar from Appendix B. Complete Grammar Reference of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "complete-grammar-reference"
specSection: "b14-region-grammar"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/complete-grammar-reference/">Appendix B. Complete Grammar Reference</a>
  <span>Complete Grammar Reference</span>
</div>

## B.14 Region Grammar

```text
region_stmt  ::= "region" region_opts? region_alias? block_expr
region_opts  ::= "(" expression ")"
region_alias ::= "as" identifier
alloc_expr   ::= identifier "^" expression
frame_stmt   ::= "frame" block_expr | identifier "." "frame" block_expr
```
