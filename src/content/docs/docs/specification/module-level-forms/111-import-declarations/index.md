---
title: "11.1 Import Declarations"
description: "11.1 Import Declarations from 11. Module-Level Forms of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "module-level-forms"
specSection: "111-import-declarations"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/module-level-forms/">11. Module-Level Forms</a>
  <span>Module-Level Forms</span>
</div>

## 11.1 Import Declarations

### 11.1.1 Syntax

```text
import_decl ::= attribute_list? visibility? "import" module_path ("as" identifier)?
```

`module_path` is defined by §11.5.1.

### 11.1.2 Parsing

`ImportDecl` is parsed by the item parser using the import-specific branch.

**(Parse-Import)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{import})\quad \Gamma \ \vdash \ \operatorname{ParseModulePath}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{path})\quad \Gamma \ \vdash \ \operatorname{ParseAliasOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{alias}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseItem}(P)\ \Downarrow \ (P_{3},\ \langle \mathsf{ImportDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{path},\ \mathsf{alias}_{\mathsf{opt}},\ \operatorname{SpanBetween}(P,\ P_{3}),\ []\rangle )
\end{array}
$$

### 11.1.3 AST Representation / Form

`ImportDecl` is a top-level AST item.

$$
\mathsf{ImportDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{path},\ \mathsf{alias}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}\rangle 
$$

### 11.1.4 Static Semantics

Import path resolution is defined by §11.5.4. This section defines the binding effect of a successfully resolved `import` declaration.

**(Import-Path)**

$$
\begin{array}{l}
u\ =\ \langle \mathsf{ImportDecl},\ \mathsf{vis},\ \mathsf{path},\ \mathsf{alias}_{\mathsf{opt}},\ \_,\ \_\rangle \quad \Gamma \ \vdash \ \operatorname{ResolveImportPath}(\mathsf{path})\ \Downarrow \ \mathsf{mp}\quad \mathsf{name}\ =\ \mathsf{alias}_{\mathsf{opt}}\ \mathsf{if}\ \mathsf{present},\ \mathsf{else}\ \operatorname{Last}(\mathsf{path}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ImportNames}(u)\ \Downarrow \ [(\mathsf{name},\ \langle \mathsf{ModuleAlias},\ \mathsf{mp},\ \bot ,\ \mathsf{Import}\rangle )]
\end{array}
$$

**(Import-Path-Err)**

$$
\begin{array}{l}
u\ =\ \langle \mathsf{ImportDecl},\ \_,\ \mathsf{path},\ \_,\ \_,\ \_\rangle \quad \Gamma \ \vdash \ \operatorname{ResolveImportPath}(\mathsf{path})\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ImportNames}(u)\ \Uparrow \ c
\end{array}
$$

**(Bind-Import)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ImportNames}(u)\ \Downarrow \ B \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ItemBindings}(u,\ p)\ \Downarrow \ B
\end{array}
$$

**(Bind-Import-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ImportNames}(u)\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ItemBindings}(u,\ p)\ \Uparrow \ c
\end{array}
$$

**(ResolveItem-Import)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveItem}(\operatorname{ImportDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{path},\ \mathsf{alias}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}))\ \Downarrow \ \operatorname{ImportDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{path},\ \mathsf{alias}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc})
\end{array}
$$

### 11.1.5 Dynamic Semantics

`import` declarations are compile-time only. They introduce no runtime action.

### 11.1.6 Lowering

`import` declarations introduce no construct-specific lowering. Their effects are exhausted by name binding and module visibility.

### 11.1.7 Diagnostics

| Code         | Severity | Detection    | Condition                                 |
| ------------ | -------- | ------------ | ----------------------------------------- |
| `E-MOD-1202` | Error    | Compile-time | Import of non-existent assembly or module |

Import-coverage violations are owned by §11.5.7. Accessibility violations are owned by Chapter 7.
