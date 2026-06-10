---
title: "7.2 Name Introduction and Module Validation"
description: "7.2 Name Introduction and Module Validation from 7. Name Resolution and Visibility of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "name-resolution-and-visibility"
specSection: "72-name-introduction-and-module-validation"
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

## 7.2 Name Introduction and Module Validation

$$
\begin{array}{l}
\operatorname{dom}(S)\ =\ \operatorname{keys}(S) \\[0.16em]
\operatorname{Scopes}(\Gamma )\ =\ [S_{\mathsf{cur}}]\ \mathbin{++} \ \Gamma_{\mathsf{out}} \\[0.16em]
\operatorname{InScope}(S,\ x)\ \Leftrightarrow \ \operatorname{IdKey}(x)\ \in \ \operatorname{dom}(S) \\[0.16em]
\operatorname{InOuter}(\Gamma ,\ x)\ \Leftrightarrow \ \exists \ S\ \in \ \Gamma_{\mathsf{out}} .\ \operatorname{InScope}(S,\ x)
\end{array}
$$

**(Intro-Ok)**

$$
\begin{array}{l}
\lnot \ \operatorname{InScope}(S_{\mathsf{cur}},\ x)\quad \lnot \ \operatorname{InOuter}(\Gamma ,\ x)\quad \lnot \ \operatorname{ReservedId}(x)\quad \operatorname{Scopes}(\Gamma ')\ =\ [S_{\mathsf{cur}}[\operatorname{IdKey}(x)\ \mapsto \ \mathsf{ent}]]\ \mathbin{++} \ \Gamma_{\mathsf{out}} \quad \operatorname{Project}(\Gamma ')\ =\ \operatorname{Project}(\Gamma )\quad \operatorname{ResCtx}(\Gamma ')\ =\ \operatorname{ResCtx}(\Gamma ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Intro}(x,\ \mathsf{ent})\ \Downarrow \ \Gamma '
\end{array}
$$

**(Intro-Dup)**

$$
\begin{array}{l}
\operatorname{InScope}(S_{\mathsf{cur}},\ x)\quad c\ =\ \operatorname{Code}(\mathsf{Intro}-\mathsf{Dup}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Intro}(x,\ \mathsf{ent})\ \Uparrow \ c
\end{array}
$$

**(Intro-Outer-Err)**

$$
\begin{array}{l}
\lnot \ \operatorname{InScope}(S_{\mathsf{cur}},\ x)\quad \operatorname{InOuter}(\Gamma ,\ x)\quad c\ =\ \operatorname{Code}(\mathsf{Intro}-\mathsf{Outer}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Intro}(x,\ \mathsf{ent})\ \Uparrow \ c
\end{array}
$$

**(Intro-Reserved-Gen-Err)**

$$
\begin{array}{l}
\operatorname{ReservedGen}(x)\quad c\ =\ \operatorname{Code}(\mathsf{Intro}-\mathsf{Reserved}-\mathsf{Gen}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Intro}(x,\ \mathsf{ent})\ \Uparrow \ c
\end{array}
$$

**(Intro-Reserved-Ultraviolet-Err)**

$$
\begin{array}{l}
\operatorname{ReservedUltraviolet}(x)\quad c\ =\ \operatorname{Code}(\mathsf{Intro}-\mathsf{Reserved}-\mathsf{Ultraviolet}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Intro}(x,\ \mathsf{ent})\ \Uparrow \ c
\end{array}
$$

When multiple `Intro` rules are simultaneously applicable, a conforming implementation MUST apply the first matching clause in the ordered priority list above.

**Rationale (non-normative).** A binding introduced in an outer scope cannot be reused as the name of a new binding in an inner scope. Users who wish to introduce a new binding under an already-taken name must choose a different name, or introduce their new binding in a separate sibling scope where the outer name is not visible. Users who wish to create a compile-time alternate name for an existing binding should use `using source as alias` (§11.2, §18.3).

### UsingAlias

`UsingAlias(source_name, alias_name)` binds `alias_name` in the current scope to the same `Entity` that `source_name` resolves to. It introduces no new storage and does not copy the bound entity; the alias and the source are interchangeable references to the same compile-time entity.

**(Using-Alias-Ok)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Lookup}(\mathsf{source}_{\mathsf{name}})\ \Downarrow \ \mathsf{ent}\quad \lnot \ \operatorname{InScope}(S_{\mathsf{cur}},\ \mathsf{alias}_{\mathsf{name}})\quad \lnot \ \operatorname{InOuter}(\Gamma ,\ \mathsf{alias}_{\mathsf{name}})\quad \lnot \ \operatorname{ReservedId}(\mathsf{alias}_{\mathsf{name}})\quad \operatorname{Scopes}(\Gamma ')\ =\ [S_{\mathsf{cur}}[\operatorname{IdKey}(\mathsf{alias}_{\mathsf{name}})\ \mapsto \ \mathsf{ent}]]\ \mathbin{++} \ \Gamma_{\mathsf{out}} \quad \operatorname{Project}(\Gamma ')\ =\ \operatorname{Project}(\Gamma )\quad \operatorname{ResCtx}(\Gamma ')\ =\ \operatorname{ResCtx}(\Gamma ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{UsingAlias}(\mathsf{source}_{\mathsf{name}},\ \mathsf{alias}_{\mathsf{name}})\ \Downarrow \ \Gamma '
\end{array}
$$

**(Using-Alias-Unresolved)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Lookup}(\mathsf{source}_{\mathsf{name}})\ \uparrow \quad c\ =\ \operatorname{Code}(\mathsf{Using}-\mathsf{Alias}-\mathsf{Unresolved}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{UsingAlias}(\mathsf{source}_{\mathsf{name}},\ \mathsf{alias}_{\mathsf{name}})\ \Uparrow \ c
\end{array}
$$

**(Using-Alias-Dup)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Lookup}(\mathsf{source}_{\mathsf{name}})\ \Downarrow \ \mathsf{ent}\quad (\operatorname{InScope}(S_{\mathsf{cur}},\ \mathsf{alias}_{\mathsf{name}})\ \lor \ \operatorname{InOuter}(\Gamma ,\ \mathsf{alias}_{\mathsf{name}}))\quad c\ =\ \operatorname{Code}(\mathsf{Using}-\mathsf{Alias}-\mathsf{Dup}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{UsingAlias}(\mathsf{source}_{\mathsf{name}},\ \mathsf{alias}_{\mathsf{name}})\ \Uparrow \ c
\end{array}
$$

**(Using-Alias-Reserved)**

$$
\begin{array}{l}
\operatorname{ReservedId}(\mathsf{alias}_{\mathsf{name}})\quad c\ =\ \operatorname{Code}(\mathsf{Using}-\mathsf{Alias}-\mathsf{Reserved}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{UsingAlias}(\mathsf{source}_{\mathsf{name}},\ \mathsf{alias}_{\mathsf{name}})\ \Uparrow \ c
\end{array}
$$

When multiple `UsingAlias` rules are simultaneously applicable, a conforming implementation MUST apply the first matching clause in the ordered priority list above.

$$
\operatorname{Names}(N)\ =\ \operatorname{dom}(N)
$$

**(Validate-Module-Ok)**

$$
\begin{array}{l}
\forall \ n\ \in \ \operatorname{Names}(N).\ \lnot \ \operatorname{KeywordKey}(n) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ValidateModuleNames}(N)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(Validate-Module-Keyword-Err)**

$$
\begin{array}{l}
\exists \ n\ \in \ \operatorname{Names}(N).\ \operatorname{KeywordKey}(n)\quad c\ =\ \operatorname{Code}(\mathsf{Validate}-\mathsf{Module}-\mathsf{Keyword}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ValidateModuleNames}(N)\ \Uparrow \ c
\end{array}
$$

Reuse of a universe-scope name (primitive, special, or async type) at module scope is not a `ValidateModuleNames` concern — it is handled by `(Intro-Outer-Err)` when the module's bindings are introduced, because `UniverseBindings` is always in the outer scope chain at module scope.
