---
title: "B.14 Region Grammar"
description: "B.14 Region Grammar from Appendix B. Complete Grammar Reference of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "complete-grammar-reference"
specSection: "b14-region-grammar"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
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
