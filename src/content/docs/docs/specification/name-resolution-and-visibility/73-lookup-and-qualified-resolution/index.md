---
title: "7.3 Lookup and Qualified Resolution"
description: "7.3 Lookup and Qualified Resolution from 7. Name Resolution and Visibility of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "name-resolution-and-visibility"
specSection: "73-lookup-and-qualified-resolution"
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

## 7.3 Lookup and Qualified Resolution

$$
\begin{array}{l}
\operatorname{Scopes}(\Gamma )\ =\ [S_{1},\ \ldots ,\ S_{n}] \\[0.16em]
i\ =\ \mathsf{min}\{j\ \mid \ \operatorname{IdKey}(x)\ \in \ \operatorname{dom}(S_{j})\}
\end{array}
$$

**(Lookup-Unqualified)**
i defined

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Lookup}(x)\ \Downarrow \ S_{i}[\operatorname{IdKey}(x)]
\end{array}
$$

**(Lookup-Unqualified-None)**
i undefined

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Lookup}(x)\ \uparrow
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ValueKind}(\mathsf{ent})\ \Leftrightarrow \ \mathsf{ent}.\mathsf{kind}\ =\ \mathsf{Value} \\[0.16em]
\operatorname{TypeKind}(\mathsf{ent})\ \Leftrightarrow \ \mathsf{ent}.\mathsf{kind}\ =\ \mathsf{Type} \\[0.16em]
\operatorname{ClassKind}(\mathsf{ent})\ \Leftrightarrow \ \mathsf{ent}.\mathsf{kind}\ =\ \mathsf{Class} \\[0.16em]
\operatorname{ModuleKind}(\mathsf{ent})\ \Leftrightarrow \ \mathsf{ent}.\mathsf{kind}\ =\ \mathsf{ModuleAlias} \\[0.16em]
\operatorname{RegionAlias}(\mathsf{ent})\ \Leftrightarrow \ \mathsf{ent}.\mathsf{source}\ =\ \mathsf{RegionAlias}
\end{array}
$$

$$
\operatorname{RegionAliasName}(\Gamma ,\ x)\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{ResolveValueName}(x)\ \Downarrow \ \mathsf{ent}\ \land \ \operatorname{RegionAlias}(\mathsf{ent})
$$

**(Resolve-Value-Name)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Lookup}(x)\ \Downarrow \ \mathsf{ent}\quad \operatorname{ValueKind}(\mathsf{ent}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveValueName}(x)\ \Downarrow \ \mathsf{ent}
\end{array}
$$

**(Resolve-Type-Name)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Lookup}(x)\ \Downarrow \ \mathsf{ent}\quad \operatorname{TypeKind}(\mathsf{ent}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveTypeName}(x)\ \Downarrow \ \mathsf{ent}
\end{array}
$$

**(Resolve-Class-Name)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Lookup}(x)\ \Downarrow \ \mathsf{ent}\quad \operatorname{ClassKind}(\mathsf{ent}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveClassName}(x)\ \Downarrow \ \mathsf{ent}
\end{array}
$$

**(Resolve-Module-Name)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Lookup}(x)\ \Downarrow \ \mathsf{ent}\quad \operatorname{ModuleKind}(\mathsf{ent}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveModuleName}(x)\ \Downarrow \ \mathsf{ent}
\end{array}
$$

$$
\begin{array}{l}
P\ =\ \operatorname{Project}(\Gamma ) \\[0.16em]
m\ =\ \operatorname{CurrentModule}(\Gamma )
\end{array}
$$

VisibleModulePaths(m), VisibleModuleNames(m), AliasMap(m), ImportOk(m, path), ResolveImportPath(path), ResolveUsingPath(path), ImportNames(u), and UsingNames(u) are defined in §11.5.4. This chapter consumes those judgments but does not redefine them.

$$
\begin{array}{l}
\mathsf{ModulePaths}\ =\ \operatorname{VisibleModulePaths}(m) \\[0.16em]
\mathsf{ModuleNames}\ =\ \operatorname{VisibleModuleNames}(m) \\[0.16em]
\mathsf{Alias}\ =\ \operatorname{AliasMap}(m)
\end{array}
$$

`ResolveModulePath` is defined canonically by §11.5.4 and consumed here by `ResolveQualified`.

**(Resolve-Qualified)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveModulePath}(\mathsf{path},\ \mathsf{Alias},\ \mathsf{ModuleNames})\ \Downarrow \ \mathsf{mp}\quad \operatorname{NameMap}(P,\ \mathsf{mp})[\operatorname{IdKey}(\mathsf{name})]\ =\ \mathsf{ent}\quad \Gamma \ \vdash \ \operatorname{CanAccess}(m,\ \operatorname{DeclOf}(\mathsf{mp},\ \mathsf{name}))\ \Downarrow \ \mathsf{ok}\quad \operatorname{K}(\mathsf{ent}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveQualified}(\mathsf{path},\ \mathsf{name},\ K)\ \Downarrow \ \mathsf{ent}
\end{array}
$$

$$
K\ \in \ \{\mathsf{ValueKind},\ \mathsf{TypeKind},\ \mathsf{ClassKind},\ \mathsf{ModuleKind}\}
$$
