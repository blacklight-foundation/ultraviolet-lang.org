---
title: "Name Resolution and Visibility"
description: "7. Name Resolution and Visibility of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
generatedAt: "2026-05-14T00:55:03.609Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>


## 7.1 Scope Context and Identifiers

$$
\begin{array}{l}
\mathsf{IdKeyRef}\ =\ \{\texttt{"4.2.8"}\} \\[0.16em]
\operatorname{ScopeKey}(S)\ \Leftrightarrow \ \operatorname{dom}(S)\ \subseteq \ \{\operatorname{IdKey}(x)\ \mid \ x\ \in \ \mathsf{Identifier}\}
\end{array}
$$

$$
\begin{array}{l}
\Sigma \ =\ \langle \Sigma .\mathsf{Mods},\ \Sigma .\mathsf{Types},\ \Sigma .\mathsf{Classes}\rangle  \\[0.16em]
\Sigma .\mathsf{Mods}\ \in \ [\mathsf{ASTModule}] \\[0.16em]
\Sigma .\mathsf{Types}\ :\ \mathsf{Path}\ \rightharpoonup \ \mathsf{TypeDecl} \\[0.16em]
\Sigma .\mathsf{Classes}\ :\ \mathsf{Path}\ \rightharpoonup \ \mathsf{ClassDecl}
\end{array}
$$

$$
\begin{array}{l}
\Gamma \ =\ \langle P,\ \Sigma ,\ m,\ S\rangle  \\[0.16em]
\operatorname{Project}(\Gamma )\ =\ P \\[0.16em]
\operatorname{ResCtx}(\Gamma )\ =\ \langle \Sigma ,\ m\rangle  \\[0.16em]
\operatorname{CurrentModule}(\Gamma )\ =\ m \\[0.16em]
\operatorname{Scopes}(\Gamma )\ =\ S
\end{array}
$$

$$
\begin{array}{l}
\mathsf{EntityKind}\ =\ \{\mathsf{Value},\ \mathsf{Type},\ \mathsf{Class},\ \mathsf{ModuleAlias}\} \\[0.16em]
\mathsf{EntitySource}\ =\ \{\mathsf{Decl},\ \mathsf{Using},\ \mathsf{RegionAlias}\} \\[0.16em]
\mathsf{Entity}\ =\ \langle \mathsf{kind},\ \mathsf{origin}_{\mathsf{opt}},\ \mathsf{target}_{\mathsf{opt}},\ \mathsf{source}\rangle  \\[0.16em]
\mathsf{origin}_{\mathsf{opt}}\ \in \ \mathsf{ModulePath}\ \cup \ \{\bot \} \\[0.16em]
\mathsf{target}_{\mathsf{opt}}\ \in \ \mathsf{Identifier}\ \cup \ \{\bot \}
\end{array}
$$

$$
S\ :\ \mathsf{IdKey}\ \rightharpoonup \ \mathsf{Entity}
$$

$$
\begin{array}{l}
\operatorname{Scopes}(\Gamma )\ =\ [S_{1},\ \ldots ,\ S_{k},\ S_{\mathsf{proc}},\ S_{\mathsf{module}},\ S_{\mathsf{universe}}]\quad (k\ \ge \ 0) \\[0.16em]
\operatorname{LocalScopes}(\Gamma )\ =\ [S_{1},\ \ldots ,\ S_{k}] \\[0.16em]
\operatorname{ProcScope}(\Gamma )\ =\ S_{\mathsf{proc}} \\[0.16em]
\operatorname{ModuleScope}(\Gamma )\ =\ S_{\mathsf{module}} \\[0.16em]
\operatorname{UniverseScope}(\Gamma )\ =\ S_{\mathsf{universe}}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{UniverseBindings}\ =\ \{\ \operatorname{IdKey}(x)\ \mapsto \ \langle \mathsf{Type},\ \bot ,\ \bot ,\ \mathsf{Decl}\rangle \ \mid \ x\ \in \ \mathsf{UniverseProtected}\ \}\ \cup \ \{\ \operatorname{IdKey}(\texttt{ultraviolet})\ \mapsto \ \langle \mathsf{ModuleAlias},\ \texttt{ultraviolet},\ \bot ,\ \mathsf{Decl}\rangle \ \} \\[0.16em]
S_{\mathsf{universe}}\ =\ \mathsf{UniverseBindings}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BytePrefix}(p,\ s)\ \Leftrightarrow \ \exists \ r.\ s\ =\ p\ \mathbin{++} \ r \\[0.16em]
\operatorname{Prefix}(s,\ p)\ \Leftrightarrow \ \operatorname{BytePrefix}(p,\ s)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ReservedGen}(x)\ \Leftrightarrow \ \operatorname{Prefix}(\operatorname{IdKey}(x),\ \operatorname{IdKey}(\texttt{gen\_})) \\[0.16em]
\operatorname{ReservedUltraviolet}(x)\ \Leftrightarrow \ \operatorname{IdEq}(x,\ \texttt{ultraviolet}) \\[0.16em]
\operatorname{ReservedId}(x)\ \Leftrightarrow \ \operatorname{ReservedGen}(x)\ \lor \ \operatorname{ReservedUltraviolet}(x) \\[0.16em]
\operatorname{ReservedModulePath}(\mathsf{path})\ \Leftrightarrow \ (\mid \mathsf{path}\mid \ \ge \ 1\ \land \ \operatorname{IdEq}(\mathsf{path}[0],\ \texttt{ultraviolet}))\ \lor \ (\exists \ i.\ \operatorname{ReservedGen}(\mathsf{path}[i]))
\end{array}
$$


$$
\begin{array}{l}
\mathsf{PrimTypeNames}\ =\ \{\texttt{i8},\ \texttt{i16},\ \texttt{i32},\ \texttt{i64},\ \texttt{i128},\ \texttt{u8},\ \texttt{u16},\ \texttt{u32},\ \texttt{u64},\ \texttt{u128},\ \texttt{f16},\ \texttt{f32},\ \texttt{f64},\ \texttt{bool},\ \texttt{char},\ \texttt{usize},\ \texttt{isize}\} \\[0.16em]
\mathsf{SpecialTypeNames}\ =\ \{\texttt{Self},\ \texttt{Drop},\ \texttt{Bitcopy},\ \texttt{Clone},\ \texttt{Eq},\ \texttt{Hash},\ \texttt{Hasher},\ \texttt{Iterator},\ \texttt{Step},\ \texttt{FfiSafe},\ \texttt{string},\ \texttt{bytes},\ \texttt{Modal},\ \texttt{Region},\ \texttt{RegionOptions},\ \texttt{CancelToken},\ \texttt{Context},\ \texttt{System},\ \texttt{Network},\ \texttt{ExecutionDomain},\ \texttt{CpuSet},\ \texttt{Priority},\ \texttt{Reactor},\ \texttt{Time},\ \texttt{MonotonicTime},\ \texttt{WallTime},\ \texttt{Duration},\ \texttt{MonotonicInstant},\ \texttt{UtcInstant},\ \texttt{TimeError}\} \\[0.16em]
\mathsf{AsyncTypeNames}\ =\ \{\texttt{Async},\ \texttt{Future},\ \texttt{Sequence},\ \texttt{Stream},\ \texttt{Pipe},\ \texttt{Exchange},\ \texttt{Tracked}\}
\end{array}
$$

`Drop`, `Bitcopy`, `Clone`, and `FfiSafe` are reserved predicate names and are included in `SpecialTypeNames`. Reuse of these names at any scope is an error via `(Intro-Outer-Err)` (§7.2), since `UniverseBindings` is the outermost scope and contains these names.

$$
\begin{array}{l}
\mathsf{PrimTypeKeys}\ =\ \{\operatorname{IdKey}(x)\ \mid \ x\ \in \ \mathsf{PrimTypeNames}\} \\[0.16em]
\mathsf{SpecialTypeKeys}\ =\ \{\operatorname{IdKey}(x)\ \mid \ x\ \in \ \mathsf{SpecialTypeNames}\} \\[0.16em]
\mathsf{AsyncTypeKeys}\ =\ \{\operatorname{IdKey}(x)\ \mid \ x\ \in \ \mathsf{AsyncTypeNames}\}
\end{array}
$$

$$
\operatorname{KeywordKey}(n)\ \Leftrightarrow \ \exists \ s.\ n\ =\ \operatorname{IdKey}(s)\ \land \ \operatorname{Keyword}(s)
$$

## 7.2 Name Introduction and Module Validation

$$
\begin{array}{l}
\operatorname{dom}(S)\ =\ \operatorname{keys}(S) \\[0.16em]
\operatorname{Scopes}(\Gamma )\ =\ [S_{\mathsf{cur}}]\ \mathbin{++} \ \Gamma_{\mathsf{out}}  \\[0.16em]
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

## 7.4 Visibility and Accessibility

$$
\begin{array}{l}
\operatorname{DeclOf}(\mathsf{mp},\ \mathsf{name})\ =\ \mathsf{it}\ \Leftrightarrow \ \operatorname{ModuleOf}(\mathsf{it})\ =\ \mathsf{mp}\ \land \ \mathsf{it}\ \ne \ \operatorname{ExternBlock}(\_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \land \ \operatorname{IdKey}(\mathsf{name})\ \in \ \operatorname{dom}(\operatorname{ItemBindings}(\mathsf{it},\ \mathsf{mp})) \\[0.16em]
\operatorname{DeclOf}(\mathsf{mp},\ \mathsf{name})\ =\ \mathsf{proc}\ \Leftrightarrow \ \operatorname{ExternBlockOf}(\mathsf{proc})\ =\ \mathsf{blk}\ \land \ \operatorname{ModuleOf}(\mathsf{blk})\ =\ \mathsf{mp}\ \land \ \operatorname{ProcName}(\mathsf{proc})\ =\ \mathsf{name}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ModuleOf}(\mathsf{it})\ =\ p\ \Leftrightarrow \ \mathsf{it}\ \in \ \operatorname{ASTModule}(P,\ p).\mathsf{items} \\[0.16em]
\operatorname{ModuleOf}(\mathsf{proc})\ =\ \operatorname{ModuleOf}(\operatorname{ExternBlockOf}(\mathsf{proc})) \\[0.16em]
\operatorname{ExternBlockOf}(\mathsf{proc})\ =\ \mathsf{blk}\ \Leftrightarrow \ \exists \ p.\ \mathsf{blk}\ \in \ \operatorname{ASTModule}(P,\ p).\mathsf{items}\ \land \ \mathsf{proc}\ \in \ \mathsf{blk}.\mathsf{items} \\[0.16em]
\operatorname{ProcName}(\mathsf{proc})\ =\ \mathsf{name}\ \Leftrightarrow \ \mathsf{proc}\ =\ \operatorname{ExternProcDecl}(\_,\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_) \\[0.16em]
\operatorname{Vis}(\mathsf{it})\ =\ \mathsf{it}.\mathsf{vis} \\[0.16em]
\operatorname{SameAssembly}(m_{1},\ m_{2})\ \Leftrightarrow \ \operatorname{AsmOfModule}(m_{1})\ =\ \operatorname{AsmOfModule}(m_{2})
\end{array}
$$

**(Access-Public)**

$$
\begin{array}{l}
\operatorname{Vis}(\mathsf{it})\ =\ \texttt{public} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CanAccess}(m,\ \mathsf{it})\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(Access-Internal)**

$$
\begin{array}{l}
\operatorname{Vis}(\mathsf{it})\ =\ \texttt{internal}\quad \operatorname{SameAssembly}(\operatorname{ModuleOf}(\mathsf{it}),\ m) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CanAccess}(m,\ \mathsf{it})\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(Access-Private)**

$$
\begin{array}{l}
\operatorname{Vis}(\mathsf{it})\ =\ \texttt{private}\quad \operatorname{ModuleOf}(\mathsf{it})\ =\ m \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CanAccess}(m,\ \mathsf{it})\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(Access-Internal-Err)**

$$
\begin{array}{l}
\operatorname{Vis}(\mathsf{it})\ =\ \texttt{internal}\quad \lnot \ \operatorname{SameAssembly}(\operatorname{ModuleOf}(\mathsf{it}),\ m)\quad c\ =\ \operatorname{Code}(\mathsf{Access}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CanAccess}(m,\ \mathsf{it})\ \Uparrow \ c
\end{array}
$$

**(Access-Err)**

$$
\begin{array}{l}
\operatorname{Vis}(\mathsf{it})\ =\ \texttt{private}\quad \operatorname{ModuleOf}(\mathsf{it})\ \ne \ m\quad c\ =\ \operatorname{Code}(\mathsf{Access}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CanAccess}(m,\ \mathsf{it})\ \Uparrow \ c
\end{array}
$$

$$
\operatorname{TopLevelDecl}(\mathsf{it})\ \Leftrightarrow \ \mathsf{it}\ \in \ \operatorname{ASTModule}(P,\ \operatorname{ModuleOf}(\mathsf{it})).\mathsf{items}
$$

**(TopLevelVis-Ok)**
TopLevelDecl(it)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TopLevelVis}(\mathsf{it})\ \Downarrow \ \mathsf{ok}
\end{array}
$$

## 7.5 Top-Level Name Collection

$$
\forall \ \mathsf{items}'.\ \operatorname{Permutation}(\mathsf{items}',\ \mathsf{items})\ \land \ \Gamma \ \vdash \ \operatorname{CollectNames}(\mathsf{items},\ p,\ \emptyset )\ \Downarrow \ N\ \Rightarrow \ \Gamma \ \vdash \ \operatorname{CollectNames}(\mathsf{items}',\ p,\ \emptyset )\ \Downarrow \ N
$$

$$
\begin{array}{l}
\mathsf{BindKind}\ =\ \{\mathsf{Value},\ \mathsf{Type},\ \mathsf{Class},\ \mathsf{ModuleAlias}\} \\[0.16em]
\mathsf{BindSource}\ =\ \{\mathsf{Decl},\ \mathsf{Using},\ \mathsf{Import}\} \\[0.16em]
\mathsf{NameInfo}\ =\ \langle \mathsf{kind},\ \mathsf{origin},\ \mathsf{target}_{\mathsf{opt}},\ \mathsf{source}\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{NameMap}(P,\ \mathsf{mp})\ =\ N\ \Leftrightarrow \ \operatorname{ModuleMap}(P,\ \mathsf{mp})\ =\ M\ \land \ \Gamma \ \vdash \ \operatorname{CollectNames}(M)\ \Downarrow \ N \\[0.16em]
\operatorname{AliasMap}(m)\ =\ \{\ n\ \mapsto \ \mathsf{origin}\ \mid \ \operatorname{NameMap}(P,\ m)[n].\mathsf{kind}\ =\ \mathsf{ModuleAlias}\ \} \\[0.16em]
\operatorname{UsingMap}(m)\ =\ \{\ n\ \mapsto \ \langle k,\ \mathsf{origin},\ \mathsf{target}_{\mathsf{opt}}\rangle \ \mid \ \operatorname{NameMap}(P,\ m)[n].\mathsf{source}\ =\ \mathsf{Using}\ \land \ \operatorname{NameMap}(P,\ m)[n].\mathsf{kind}\ =\ k\ \land \ k\ \in \ \{\mathsf{Value},\ \mathsf{Type},\ \mathsf{Class}\}\ \} \\[0.16em]
\operatorname{UsingValueMap}(m)\ =\ \{\ n\ \mapsto \ \mathsf{origin}\ \mid \ \operatorname{NameMap}(P,\ m)[n].\mathsf{source}\ =\ \mathsf{Using}\ \land \ \operatorname{NameMap}(P,\ m)[n].\mathsf{kind}\ =\ \mathsf{Value}\ \} \\[0.16em]
\operatorname{UsingTypeMap}(m)\ =\ \{\ n\ \mapsto \ \mathsf{origin}\ \mid \ \operatorname{NameMap}(P,\ m)[n].\mathsf{source}\ =\ \mathsf{Using}\ \land \ \operatorname{NameMap}(P,\ m)[n].\mathsf{kind}\ \in \ \{\mathsf{Type},\ \mathsf{Class}\}\ \} \\[0.16em]
\operatorname{TypeMap}(m)\ =\ \{\ n\ \mapsto \ \mathsf{origin}\ \mid \ \operatorname{NameMap}(P,\ m)[n].\mathsf{kind}\ =\ \mathsf{Type}\ \} \\[0.16em]
\operatorname{ClassMap}(m)\ =\ \{\ n\ \mapsto \ \mathsf{origin}\ \mid \ \operatorname{NameMap}(P,\ m)[n].\mathsf{kind}\ =\ \mathsf{Class}\ \}
\end{array}
$$

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{IdentifierPattern}(x))\ \Downarrow \ [x] \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\mathsf{WildcardPattern})\ \Downarrow \ [] \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{LiteralPattern}(\mathsf{lit}))\ \Downarrow \ [] \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{TypedPattern}(\texttt{"\_"},\ T))\ \Downarrow \ [] \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{TypedPattern}(x,\ T))\ \Downarrow \ [x]\ \Leftrightarrow \ x\ \ne \ \texttt{"\_"}
\end{array}
$$

$$
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{PatNames}(p_{i})\ \Downarrow \ N_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{TuplePattern}([p_{1},\ \ldots ,\ p_{n}]))\ \Downarrow \ N_{1}\ \mathbin{++} \ \cdot \cdot \cdot \ \mathbin{++} \ N_{n}
\end{array}
$$

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{PatNames}(p)\ \Downarrow \ N \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\langle \mathsf{name},\ \mathsf{pattern}_{\mathsf{opt}}\ =\ p,\ \mathsf{span}\rangle )\ \Downarrow \ N
\end{array}
$$

$$
\Gamma \ \vdash \ \operatorname{PatNames}(\langle \mathsf{name},\ \mathsf{pattern}_{\mathsf{opt}}\ =\ \bot ,\ \mathsf{span}\rangle )\ \Downarrow \ [\mathsf{name}]
$$

$$
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{PatNames}(f_{i})\ \Downarrow \ N_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{RecordPattern}(\_,\ [f_{1},\ \ldots ,\ f_{n}]))\ \Downarrow \ N_{1}\ \mathbin{++} \ \cdot \cdot \cdot \ \mathbin{++} \ N_{n}
\end{array}
$$

$$
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{EnumPattern}(\_,\ \_,\ \bot ))\ \Downarrow \ []
$$

$$
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{PatNames}(p_{i})\ \Downarrow \ N_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{EnumPattern}(\_,\ \_,\ \operatorname{TuplePayloadPattern}([p_{1},\ \ldots ,\ p_{n}])))\ \Downarrow \ N_{1}\ \mathbin{++} \ \cdot \cdot \cdot \ \mathbin{++} \ N_{n}
\end{array}
$$

$$
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{PatNames}(f_{i})\ \Downarrow \ N_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{EnumPattern}(\_,\ \_,\ \operatorname{RecordPayloadPattern}([f_{1},\ \ldots ,\ f_{n}])))\ \Downarrow \ N_{1}\ \mathbin{++} \ \cdot \cdot \cdot \ \mathbin{++} \ N_{n}
\end{array}
$$

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{PatNames}(p_{l})\ \Downarrow \ N_{l}\quad \Gamma \ \vdash \ \operatorname{PatNames}(p_{h})\ \Downarrow \ N_{h} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{RangePattern}(\_,\ p_{l},\ p_{h}))\ \Downarrow \ N_{l}\ \mathbin{++} \ N_{h}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{AllModuleNames}\ =\ \{\ \operatorname{StringOfPath}(p)\ \mid \ p\ \in \ \operatorname{AllModulePaths}(P)\ \} \\[0.16em]
\operatorname{VisibleModuleNames}(m)\ =\ \{\ \operatorname{StringOfPath}(p)\ \mid \ p\ \in \ \operatorname{VisibleModulePaths}(m)\ \} \\[0.16em]
\operatorname{Last}([c_{1},\ \ldots ,\ c_{n}])\ =\ c_{n}\quad \mathsf{if}\ n\ \ge \ 1 \\[0.16em]
\operatorname{IsModulePath}(\mathsf{path})\ \Leftrightarrow \ \operatorname{StringOfPath}(\mathsf{path})\ \in \ \mathsf{AllModuleNames} \\[0.16em]
\operatorname{SplitLast}(\mathsf{path})\ =\ (\mathsf{mp},\ \mathsf{name})\ \Leftrightarrow \ \mathsf{path}\ =\ \mathsf{mp}\ \mathbin{++} \ [\mathsf{name}]\ \land \ \mid \mathsf{path}\mid \ \ge \ 2 \\[0.16em]
\operatorname{ModuleByPath}(P,\ p)\ =\ m\ \Leftrightarrow \ \operatorname{ASTModule}(P,\ p)\ =\ m
\end{array}
$$

$$
\operatorname{ItemNames}(\mathsf{mp})\ =\ \{\ n\ \mid \ \operatorname{NameMap}(P,\ \mathsf{mp})[n].\mathsf{kind}\ \in \ \{\mathsf{Value},\ \mathsf{Type},\ \mathsf{Class}\}\ \}
$$

$$
\begin{array}{l}
\operatorname{UsingSpecName}(\langle \mathsf{name},\ \mathsf{alias}_{\mathsf{opt}}\rangle )\ = \\[0.16em]
\ \mathsf{alias}_{\mathsf{opt}}\quad \mathsf{if}\ \mathsf{alias}_{\mathsf{opt}}\ \ne \ \bot  \\[0.16em]
\ \mathsf{name}\quad \mathsf{otherwise}
\end{array}
$$

$$
\operatorname{UsingSpecNames}([s_{1},\ \ldots ,\ s_{n}])\ =\ [\operatorname{UsingSpecName}(s_{1}),\ \ldots ,\ \operatorname{UsingSpecName}(s_{n})]
$$

$$
\Gamma \ \vdash \ \operatorname{DeclNames}([],\ p)\ \Downarrow \ \emptyset 
$$

**(DeclNames-Using)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{DeclNames}(\mathsf{rest},\ p)\ \Downarrow \ D \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DeclNames}(\langle \mathsf{UsingDecl},\ \_,\ \_,\ \_,\ \_\rangle \ \mathbin{::} \ \mathsf{rest},\ p)\ \Downarrow \ D
\end{array}
$$

**(DeclNames-Item)**

$$
\begin{array}{l}
\mathsf{it}\ \ne \ \langle \mathsf{UsingDecl},\ \_,\ \_,\ \_,\ \_\rangle \quad \Gamma \ \vdash \ \operatorname{ItemBindings}(\mathsf{it},\ p)\ \Downarrow \ B\quad \Gamma \ \vdash \ \operatorname{DeclNames}(\mathsf{rest},\ p)\ \Downarrow \ D \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DeclNames}(\mathsf{it}\ \mathbin{::} \ \mathsf{rest},\ p)\ \Downarrow \ \operatorname{Names}(B)\ \cup \ D
\end{array}
$$

$$
\operatorname{DeclNames}(m)\ =\ \operatorname{DeclNames}(m.\mathsf{items},\ m.\mathsf{path})
$$

`ResolveImportPath`, `ResolveUsingPath`, `ImportNames`, `UsingNames`, and `ImportOk` remain the canonical judgments of §11.5.4.

**(Bind-Procedure)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ItemBindings}(\langle \mathsf{ProcedureDecl},\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_,\ \_\rangle ,\ p)\ \Downarrow \ [(\mathsf{name},\ \langle \mathsf{Value},\ p,\ \bot ,\ \mathsf{Decl}\rangle )]
\end{array}
$$

**(Bind-ExternBlock)**

$$
\begin{array}{l}
B\ =\ [(\mathsf{name}_{i},\ \langle \mathsf{Value},\ p,\ \bot ,\ \mathsf{Decl}\rangle )\ \mid \ \operatorname{ExternProcDecl}(\_,\ \_,\ \mathsf{name}_{i},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \in \ \mathsf{items}] \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ItemBindings}(\langle \mathsf{ExternBlock},\ \_,\ \_,\ \_,\ \mathsf{items},\ \_,\ \_\rangle ,\ p)\ \Downarrow \ B
\end{array}
$$

**(Bind-Record)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ItemBindings}(\langle \mathsf{RecordDecl},\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_\rangle ,\ p)\ \Downarrow \ [(\mathsf{name},\ \langle \mathsf{Type},\ p,\ \bot ,\ \mathsf{Decl}\rangle )]
\end{array}
$$

**(Bind-Enum)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ItemBindings}(\langle \mathsf{EnumDecl},\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_\rangle ,\ p)\ \Downarrow \ [(\mathsf{name},\ \langle \mathsf{Type},\ p,\ \bot ,\ \mathsf{Decl}\rangle )]
\end{array}
$$

**(Bind-Class)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ItemBindings}(\langle \mathsf{ClassDecl},\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_\rangle ,\ p)\ \Downarrow \ [(\mathsf{name},\ \langle \mathsf{Class},\ p,\ \bot ,\ \mathsf{Decl}\rangle )]
\end{array}
$$

**(Bind-TypeAlias)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ItemBindings}(\langle \mathsf{TypeAliasDecl},\ \_,\ \mathsf{name},\ \_,\ \_,\ \_\rangle ,\ p)\ \Downarrow \ [(\mathsf{name},\ \langle \mathsf{Type},\ p,\ \bot ,\ \mathsf{Decl}\rangle )]
\end{array}
$$

**(Bind-Static)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{PatNames}(\mathsf{pat})\ \Downarrow \ N \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ItemBindings}(\langle \mathsf{StaticDecl},\ \_,\ \_,\ \langle \mathsf{pat},\ \_,\ \_,\ \_,\ \_\rangle ,\ \_,\ \_\rangle ,\ p)\ \Downarrow \ [(n,\ \langle \mathsf{Value},\ p,\ \bot ,\ \mathsf{Decl}\rangle )\ \mid \ n\ \in \ N]
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

**(Bind-Using)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{UsingNames}(u)\ \Downarrow \ B \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ItemBindings}(u,\ p)\ \Downarrow \ B
\end{array}
$$

**(Bind-Using-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{UsingNames}(u)\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ItemBindings}(u,\ p)\ \Uparrow \ c
\end{array}
$$

**(Bind-ErrorItem)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ItemBindings}(\operatorname{ErrorItem}(\_),\ p)\ \Downarrow \ []
\end{array}
$$

**(Collect-Ok)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CollectNames}(\mathsf{items},\ p,\ \emptyset )\ \Downarrow \ N \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CollectNames}(M)\ \Downarrow \ N
\end{array}
$$

**(Collect-Scan)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ItemBindings}(\mathsf{it},\ p)\ \Downarrow \ B\quad \operatorname{DisjointNames}(B,\ N)\quad \operatorname{NoDup}(B)\quad \Gamma \ \vdash \ \operatorname{CollectNames}(\mathsf{rest},\ p,\ N\ \cup \ B)\ \Downarrow \ N' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CollectNames}(\mathsf{it}\ \mathbin{::} \ \mathsf{rest},\ p,\ N)\ \Downarrow \ N'
\end{array}
$$

**(Collect-Using-Import-Dup)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ItemBindings}(\mathsf{it},\ p)\ \Downarrow \ B\quad (\lnot \ \operatorname{DisjointNames}(B,\ N)\ \lor \ \lnot \ \operatorname{NoDup}(B))\quad \operatorname{UsingImportConflict}(B,\ N)\quad c\ =\ \operatorname{Code}(\mathsf{Import}-\mathsf{Using}-\mathsf{Name}-\mathsf{Conflict}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CollectNames}(\mathsf{it}\ \mathbin{::} \ \mathsf{rest},\ p,\ N)\ \Uparrow \ c
\end{array}
$$

**(Collect-Dup)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ItemBindings}(\mathsf{it},\ p)\ \Downarrow \ B\quad (\lnot \ \operatorname{DisjointNames}(B,\ N)\ \lor \ \lnot \ \operatorname{NoDup}(B))\quad \lnot \ \operatorname{UsingImportConflict}(B,\ N)\quad c\ =\ \operatorname{Code}(\mathsf{Collect}-\mathsf{Dup}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CollectNames}(\mathsf{it}\ \mathbin{::} \ \mathsf{rest},\ p,\ N)\ \Uparrow \ c
\end{array}
$$

**(Collect-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ItemBindings}(\mathsf{it},\ p)\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CollectNames}(\mathsf{it}\ \mathbin{::} \ \mathsf{rest},\ p,\ N)\ \Uparrow \ c
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Names}(B)\ =\ \{\ n\ \mid \ (n,\ \_)\ \in \ B\ \} \\[0.16em]
\operatorname{NoDup}(B)\ \Leftrightarrow \ \operatorname{Distinct}(\operatorname{Names}(B)) \\[0.16em]
\operatorname{DisjointNames}(B,\ N)\ \Leftrightarrow \ \operatorname{Names}(B)\ \cap \ \operatorname{dom}(N)\ =\ \emptyset  \\[0.16em]
N\ \cup \ B\ =\ \{\ (n,\ v)\ \mid \ (n,\ v)\ \in \ N\ \lor \ (n,\ v)\ \in \ B\ \} \\[0.16em]
\operatorname{NameInfoOf}(B,\ n)\ =\ \mathsf{info}\ \Leftrightarrow \ (n,\ \mathsf{info})\ \in \ B \\[0.16em]
\operatorname{NameSource}(B,\ n)\ =\ \mathsf{src}\ \Leftrightarrow \ \operatorname{NameInfoOf}(B,\ n)\ =\ \mathsf{info}\ \land \ \mathsf{info}.\mathsf{source}\ =\ \mathsf{src} \\[0.16em]
\operatorname{NameSource}(N,\ n)\ =\ \mathsf{src}\ \Leftrightarrow \ n\ \in \ \operatorname{dom}(N)\ \land \ N[n].\mathsf{source}\ =\ \mathsf{src} \\[0.16em]
\operatorname{UsingImportConflict}(B,\ N)\ \Leftrightarrow \ \exists \ n.\ n\ \in \ \operatorname{Names}(B)\ \cap \ \operatorname{dom}(N)\ \land \ (\operatorname{NameSource}(B,\ n)\ \in \ \{\mathsf{Using},\ \mathsf{Import}\}\ \lor \ \operatorname{NameSource}(N,\ n)\ \in \ \{\mathsf{Using},\ \mathsf{Import}\})
\end{array}
$$

$$
\mathsf{NamesState}\ =\ \{\operatorname{NamesStart}(M),\ \operatorname{NamesScan}(\mathsf{items},\ p,\ N),\ \operatorname{NamesDone}(N),\ \operatorname{Error}(\mathsf{code})\}
$$

**(Names-Start)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{NamesStart}(M)\rangle \ \to \ \langle \operatorname{NamesScan}(M.\mathsf{items},\ M.\mathsf{path},\ \emptyset )\rangle 
\end{array}
$$

**(Names-Step)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ItemBindings}(\mathsf{it},\ p)\ \Downarrow \ B\quad \operatorname{DisjointNames}(B,\ N)\quad \operatorname{NoDup}(B) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{NamesScan}(\mathsf{it}\ \mathbin{::} \ \mathsf{rest},\ p,\ N)\rangle \ \to \ \langle \operatorname{NamesScan}(\mathsf{rest},\ p,\ N\ \cup \ B)\rangle 
\end{array}
$$

**(Names-Step-Using-Import-Dup)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ItemBindings}(\mathsf{it},\ p)\ \Downarrow \ B\quad (\lnot \ \operatorname{DisjointNames}(B,\ N)\ \lor \ \lnot \ \operatorname{NoDup}(B))\quad \operatorname{UsingImportConflict}(B,\ N) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{NamesScan}(\mathsf{it}\ \mathbin{::} \ \mathsf{rest},\ p,\ N)\rangle \ \to \ \langle \operatorname{Error}(\operatorname{Code}(\mathsf{Import}-\mathsf{Using}-\mathsf{Name}-\mathsf{Conflict}))\rangle 
\end{array}
$$

**(Names-Step-Dup)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ItemBindings}(\mathsf{it},\ p)\ \Downarrow \ B\quad (\lnot \ \operatorname{DisjointNames}(B,\ N)\ \lor \ \lnot \ \operatorname{NoDup}(B))\quad \lnot \ \operatorname{UsingImportConflict}(B,\ N) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{NamesScan}(\mathsf{it}\ \mathbin{::} \ \mathsf{rest},\ p,\ N)\rangle \ \to \ \langle \operatorname{Error}(\operatorname{Code}(\mathsf{Names}-\mathsf{Step}-\mathsf{Dup}))\rangle 
\end{array}
$$

**(Names-Step-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ItemBindings}(\mathsf{it},\ p)\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{NamesScan}(\mathsf{it}\ \mathbin{::} \ \mathsf{rest},\ p,\ N)\rangle \ \to \ \langle \operatorname{Error}(c)\rangle 
\end{array}
$$

**(Names-Done)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{NamesScan}([],\ p,\ N)\rangle \ \to \ \langle \operatorname{NamesDone}(N)\rangle 
\end{array}
$$

## 7.6 Qualified Disambiguation

$$
\begin{array}{l}
\mathsf{ResolveQualifiedForm}\ :\ \mathsf{Expr}\ \rightharpoonup \ \mathsf{Expr} \\[0.16em]
\mathsf{ResolveArgs}\ :\ [\mathsf{Arg}]\ \rightharpoonup \ [\mathsf{Arg}] \\[0.16em]
\mathsf{ResolveFieldInits}\ :\ [\mathsf{FieldInit}]\ \rightharpoonup \ [\mathsf{FieldInit}] \\[0.16em]
\mathsf{ResolveRecordPath}\ :\ \mathsf{Path}\ \times \ \mathsf{Identifier}\ \rightharpoonup \ \mathsf{Path} \\[0.16em]
\mathsf{ResolveEnumUnit}\ :\ \mathsf{Path}\ \times \ \mathsf{Identifier}\ \rightharpoonup \ \mathsf{Path} \\[0.16em]
\mathsf{ResolveEnumTuple}\ :\ \mathsf{Path}\ \times \ \mathsf{Identifier}\ \rightharpoonup \ \mathsf{Path} \\[0.16em]
\mathsf{ResolveEnumRecord}\ :\ \mathsf{Path}\ \times \ \mathsf{Identifier}\ \rightharpoonup \ \mathsf{Path} \\[0.16em]
\mathsf{ResolvePathJudg}\ =\ \{\mathsf{ResolveRecordPath},\ \mathsf{ResolveEnumUnit},\ \mathsf{ResolveEnumTuple},\ \mathsf{ResolveEnumRecord}\}
\end{array}
$$

**(ResolveArgs-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveArgs}([])\ \Downarrow \ []
\end{array}
$$

**(ResolveArgs-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e'\quad \Gamma \ \vdash \ \operatorname{ResolveArgs}(\mathsf{rest})\ \Downarrow \ \mathsf{rest}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveArgs}([\langle \mathsf{moved},\ e,\ \mathsf{span}\rangle ]\ \mathbin{++} \ \mathsf{rest})\ \Downarrow \ [\langle \mathsf{moved},\ e',\ \mathsf{span}\rangle ]\ \mathbin{++} \ \mathsf{rest}'
\end{array}
$$

**(ResolveFieldInits-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveFieldInits}([])\ \Downarrow \ []
\end{array}
$$

**(ResolveFieldInits-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e'\quad \Gamma \ \vdash \ \operatorname{ResolveFieldInits}(\mathsf{rest})\ \Downarrow \ \mathsf{rest}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveFieldInits}([\langle f,\ e\rangle ]\ \mathbin{++} \ \mathsf{rest})\ \Downarrow \ [\langle f,\ e'\rangle ]\ \mathbin{++} \ \mathsf{rest}'
\end{array}
$$

**(Resolve-RecordPath)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path}\ \mathbin{++} \ [\mathsf{name}])\ \Downarrow \ p\quad \operatorname{RecordDecl}(p)\ =\ R \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveRecordPath}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p
\end{array}
$$

**(Resolve-EnumUnit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ p\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{VariantPayload}(E,\ \mathsf{name})\ =\ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveEnumUnit}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p
\end{array}
$$

**(Resolve-EnumTuple)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ p\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{VariantPayload}(E,\ \mathsf{name})\ =\ \operatorname{TuplePayload}(\_) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveEnumTuple}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p
\end{array}
$$

**(Resolve-EnumRecord)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ p\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{VariantPayload}(E,\ \mathsf{name})\ =\ \operatorname{RecordPayload}(\_) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveEnumRecord}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p
\end{array}
$$

$$
\operatorname{BuiltinValuePath}(\mathsf{path},\ \mathsf{name})\ \Leftrightarrow \ \operatorname{BuiltinModalStaticSig}(\mathsf{path},\ \mathsf{name})\ \mathsf{defined}
$$

**(ResolveQual-Name-Builtin)**
BuiltinValuePath(path, name)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveQualifiedForm}(\operatorname{QualifiedName}(\mathsf{path},\ \mathsf{name}))\ \Downarrow \ \operatorname{Path}(\mathsf{path},\ \mathsf{name})
\end{array}
$$

**(ResolveQual-Name-Value)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveQualified}(\mathsf{path},\ \mathsf{name},\ \mathsf{ValueKind})\ \Downarrow \ \mathsf{ent}\quad \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ \mathsf{mp}\quad \mathsf{name}'\ =\ (\mathsf{ent}.\mathsf{target}_{\mathsf{opt}}\ \mathsf{if}\ \mathsf{present},\ \mathsf{else}\ \mathsf{name})\quad \operatorname{PathOfModule}(\mathsf{mp})\ =\ \mathsf{path}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveQualifiedForm}(\operatorname{QualifiedName}(\mathsf{path},\ \mathsf{name}))\ \Downarrow \ \operatorname{Path}(\mathsf{path}',\ \mathsf{name}')
\end{array}
$$

**(ResolveQual-Name-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveRecordPath}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p\quad \operatorname{SplitLast}(p)\ =\ (\mathsf{mp},\ \mathsf{name}') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveQualifiedForm}(\operatorname{QualifiedName}(\mathsf{path},\ \mathsf{name}))\ \Downarrow \ \operatorname{Path}(\mathsf{mp},\ \mathsf{name}')
\end{array}
$$

**(ResolveQual-Name-Enum)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveQualified}(\mathsf{path},\ \mathsf{name},\ \mathsf{ValueKind})\ \uparrow \quad \Gamma \ \vdash \ \operatorname{ResolveRecordPath}(\mathsf{path},\ \mathsf{name})\ \uparrow \quad \Gamma \ \vdash \ \operatorname{ResolveEnumUnit}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveQualifiedForm}(\operatorname{QualifiedName}(\mathsf{path},\ \mathsf{name}))\ \Downarrow \ \operatorname{EnumLiteral}(\operatorname{FullPath}(p,\ \mathsf{name}),\ \bot )
\end{array}
$$

**(ResolveQual-Name-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveQualified}(\mathsf{path},\ \mathsf{name},\ \mathsf{ValueKind})\ \uparrow \quad \Gamma \ \vdash \ \operatorname{ResolveRecordPath}(\mathsf{path},\ \mathsf{name})\ \uparrow \quad \Gamma \ \vdash \ \operatorname{ResolveEnumUnit}(\mathsf{path},\ \mathsf{name})\ \uparrow \quad c\ =\ \operatorname{Code}(\mathsf{ResolveExpr}-\mathsf{Ident}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveQualifiedForm}(\operatorname{QualifiedName}(\mathsf{path},\ \mathsf{name}))\ \Uparrow \ c
\end{array}
$$

## 7.7 Shared Resolution Helpers and Resolution Pass

$$
\begin{array}{l}
P\ =\ \operatorname{Project}(\Gamma ) \\[0.16em]
m\ =\ \operatorname{CurrentModule}(\Gamma ) \\[0.16em]
M\ =\ \operatorname{ASTModule}(P,\ m) \\[0.16em]
\mathsf{ResolveInputs}\ =\ \langle M,\ \mathsf{ModulePaths},\ \{\ \operatorname{NameMap}(P,\ p)\ \mid \ p\ \in \ \mathsf{ModulePaths}\ \}\rangle  \\[0.16em]
\mathsf{ResolveOutputs}\ =\ \langle M'\rangle  \\[0.16em]
\mathsf{PathOfModuleRef}\ =\ \{\texttt{"3.4.1"}\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{TypeParamBindings}(\mathsf{params})\ =\ \{\ \operatorname{IdKey}(p.\mathsf{name})\ \mapsto \ \langle \mathsf{Type},\ \bot ,\ \bot ,\ \mathsf{Decl}\rangle \ \mid \ p\ \in \ \mathsf{params}\ \} \\[0.16em]
\operatorname{TypeParamBindings}(\bot )\ =\ \{\}
\end{array}
$$

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveGenericParamsOpt}(\bot )\ \Downarrow \ \bot  \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolvePredicateClauseOpt}(\bot )\ \Downarrow \ \bot  \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveContractClauseOpt}(\bot )\ \Downarrow \ \bot  \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveInvariantOpt}(\bot )\ \Downarrow \ \bot  \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveTypeOpt}(\bot )\ \Downarrow \ \bot  \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExprOpt}(\bot )\ \Downarrow \ \bot  \\[0.16em]
\operatorname{ResolveExprOpt}(\bot )\ =\ \bot  \\[0.16em]
\operatorname{ResolveExprOpt}(e)\ =\ e'\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e'
\end{array}
$$

**(ResolveGenericParamsOpt-Yes)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypeParamList}(\mathsf{params})\ \Downarrow \ \mathsf{params}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveGenericParamsOpt}(\mathsf{params})\ \Downarrow \ \mathsf{params}'
\end{array}
$$

**(ResolveTypeParam)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveClassPathList}(\mathsf{bounds})\ \Downarrow \ \mathsf{bounds}'\quad \Gamma \ \vdash \ \operatorname{ResolveTypeOpt}(\mathsf{default}_{\mathsf{opt}})\ \Downarrow \ \mathsf{default}_{\mathsf{opt}}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveTypeParam}(\langle \mathsf{name},\ \mathsf{bounds},\ \mathsf{default}_{\mathsf{opt}},\ \mathsf{variance}\rangle )\ \Downarrow \ \langle \mathsf{name},\ \mathsf{bounds}',\ \mathsf{default}_{\mathsf{opt}}',\ \mathsf{variance}\rangle 
\end{array}
$$

$$
\Gamma \ \vdash \ \operatorname{ResolveTypeParamList}([])\ \Downarrow \ []
$$

**(ResolveTypeParamList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypeParam}(p)\ \Downarrow \ p'\quad \Gamma \ \vdash \ \operatorname{ResolveTypeParamList}(\mathsf{ps})\ \Downarrow \ \mathsf{ps}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveTypeParamList}(p\ \mathbin{::} \ \mathsf{ps})\ \Downarrow \ p'\ \mathbin{::} \ \mathsf{ps}'
\end{array}
$$

**(ResolvePredicateClauseOpt-Yes)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePredicateReqList}(\mathsf{preds})\ \Downarrow \ \mathsf{preds}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolvePredicateClauseOpt}(\mathsf{preds})\ \Downarrow \ \mathsf{preds}'
\end{array}
$$

$$
\Gamma \ \vdash \ \operatorname{ResolvePredicateReqList}([])\ \Downarrow \ []
$$

**(ResolvePredicateReq-Predicate)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveType}(\mathsf{ty})\ \Downarrow \ \mathsf{ty}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolvePredicateReq}(\operatorname{PredicateReq}(\mathsf{pred},\ \mathsf{ty}))\ \Downarrow \ \operatorname{PredicateReq}(\mathsf{pred},\ \mathsf{ty}')
\end{array}
$$

**(ResolvePredicateReqList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePredicateReq}(p)\ \Downarrow \ p'\quad \Gamma \ \vdash \ \operatorname{ResolvePredicateReqList}(\mathsf{ps})\ \Downarrow \ \mathsf{ps}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolvePredicateReqList}(p\ \mathbin{::} \ \mathsf{ps})\ \Downarrow \ p'\ \mathbin{::} \ \mathsf{ps}'
\end{array}
$$

**(ResolveContractClauseOpt-Yes)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExprOpt}(\mathsf{pre})\ \Downarrow \ \mathsf{pre}'\quad \Gamma \ \vdash \ \operatorname{ResolveExprOpt}(\mathsf{post})\ \Downarrow \ \mathsf{post}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveContractClauseOpt}(\operatorname{ContractClause}(\mathsf{pre},\ \mathsf{post}))\ \Downarrow \ \operatorname{ContractClause}(\mathsf{pre}',\ \mathsf{post}')
\end{array}
$$

**(ResolveInvariantOpt-Yes)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{inv})\ \Downarrow \ \mathsf{inv}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveInvariantOpt}(\mathsf{inv})\ \Downarrow \ \mathsf{inv}'
\end{array}
$$

**(ResolveTypePath-Ident)**
|path| = 1    Γ ⊢ ResolveTypeName(path[0]) ⇓ ent    ent.origin_opt = p    name = (ent.target_opt if present, else path[0])

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ \operatorname{FullPath}(\operatorname{PathOfModule}(p),\ \mathsf{name})
\end{array}
$$

**(ResolveTypePath-Ident-Local)**
|path| = 1    Γ ⊢ ResolveTypeName(path[0]) ⇓ ent    ent.origin_opt = ⊥    name = (ent.target_opt if present, else path[0])

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ [\mathsf{name}]
\end{array}
$$

**(ResolveTypePath-Qual)**
|path| ≥ 2    path = p ++ [name]    Γ ⊢ ResolveQualified(p, name, TypeKind) ⇓ ent    ent.origin_opt = mp    name' = (ent.target_opt if present, else name)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ \operatorname{FullPath}(\operatorname{PathOfModule}(\mathsf{mp}),\ \mathsf{name}')
\end{array}
$$

$$
\operatorname{LocalTypePath}(\mathsf{path})\ \Leftrightarrow \ \mid \mathsf{path}\mid \ =\ 1\ \land \ \Gamma \ \vdash \ \operatorname{ResolveTypeName}(\mathsf{path}[0])\ \Downarrow \ \mathsf{ent}\ \land \ \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ \bot 
$$

**(ResolveClassPath-Ident)**
|path| = 1    Γ ⊢ ResolveClassName(path[0]) ⇓ ent    ent.origin_opt = p    name = (ent.target_opt if present, else path[0])

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveClassPath}(\mathsf{path})\ \Downarrow \ \operatorname{FullPath}(\operatorname{PathOfModule}(p),\ \mathsf{name})
\end{array}
$$

**(ResolveClassPath-Qual)**
|path| ≥ 2    path = p ++ [name]    Γ ⊢ ResolveQualified(p, name, ClassKind) ⇓ ent    ent.origin_opt = mp    name' = (ent.target_opt if present, else name)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveClassPath}(\mathsf{path})\ \Downarrow \ \operatorname{FullPath}(\operatorname{PathOfModule}(\mathsf{mp}),\ \mathsf{name}')
\end{array}
$$

**(ResolveType-Path)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ \mathsf{path}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveType}(\operatorname{TypePath}(\mathsf{path}))\ \Downarrow \ \operatorname{TypePath}(\mathsf{path}')
\end{array}
$$

**(ResolveType-Dynamic)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveClassPath}(\mathsf{path})\ \Downarrow \ \mathsf{path}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveType}(\operatorname{TypeDynamic}(\mathsf{path}))\ \Downarrow \ \operatorname{TypeDynamic}(\mathsf{path}')
\end{array}
$$

**(ResolveType-Apply)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ \mathsf{path}'\quad \Gamma \ \vdash \ \operatorname{ResolveTypeList}(\mathsf{args})\ \Downarrow \ \mathsf{args}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveType}(\operatorname{TypeApply}(\mathsf{path},\ \mathsf{args}))\ \Downarrow \ \operatorname{TypeApply}(\mathsf{path}',\ \mathsf{args}')
\end{array}
$$

**(ResolveType-ModalState)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveModalRef}(\mathsf{modal}_{\mathsf{ref}})\ \Downarrow \ \mathsf{modal}_{\mathsf{ref}}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveType}(\operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ \mathsf{state}))\ \Downarrow \ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}}',\ \mathsf{state})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ResolveModalRef}(\mathsf{modal}_{\mathsf{ref}})\ \Downarrow \ \mathsf{modal}_{\mathsf{ref}}'\ \Leftrightarrow  \\[0.16em]
\ (\mathsf{modal}_{\mathsf{ref}}\ =\ \operatorname{TypePath}(\mathsf{path})\ \land \ \Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ \mathsf{path}'\ \land \ \mathsf{modal}_{\mathsf{ref}}'\ =\ \operatorname{TypePath}(\mathsf{path}'))\ \lor  \\[0.16em]
\ (\mathsf{modal}_{\mathsf{ref}}\ =\ \operatorname{TypeApply}(\mathsf{path},\ \mathsf{args})\ \land \ \Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ \mathsf{path}'\ \land \ \Gamma \ \vdash \ \operatorname{ResolveTypeList}(\mathsf{args})\ \Downarrow \ \mathsf{args}'\ \land \ \mathsf{modal}_{\mathsf{ref}}'\ =\ \operatorname{TypeApply}(\mathsf{path}',\ \mathsf{args}'))
\end{array}
$$

**(ResolveType-Hom)**

$$
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{ResolveType}(t_{i})\ \Downarrow \ t_{i}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveType}(\operatorname{C}(t_{1},\ \ldots ,\ t_{n}))\ \Downarrow \ \operatorname{C}(t_{1}',\ \ldots ,\ t_{n}')
\end{array}
$$

$$
\Gamma \ \vdash \ \operatorname{ResolveTypeList}([])\ \Downarrow \ []
$$

**(ResolveTypeList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveType}(t)\ \Downarrow \ t'\quad \Gamma \ \vdash \ \operatorname{ResolveTypeList}(\mathsf{ts})\ \Downarrow \ \mathsf{ts}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveTypeList}(t\ \mathbin{::} \ \mathsf{ts})\ \Downarrow \ t'\ \mathbin{::} \ \mathsf{ts}'
\end{array}
$$

**(ResolveParam)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveType}(p.\mathsf{type})\ \Downarrow \ \mathsf{ty}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveParam}(p)\ \Downarrow \ p[\mathsf{type}\ =\ \mathsf{ty}']
\end{array}
$$

$$
\Gamma \ \vdash \ \operatorname{ResolveParams}([])\ \Downarrow \ []
$$

**(ResolveParams-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveParam}(p)\ \Downarrow \ p'\quad \Gamma \ \vdash \ \operatorname{ResolveParams}(\mathsf{ps})\ \Downarrow \ \mathsf{ps}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveParams}(p\ \mathbin{::} \ \mathsf{ps})\ \Downarrow \ p'\ \mathbin{::} \ \mathsf{ps}'
\end{array}
$$

$$
\mathsf{ResolvePattern}\ :\ \mathsf{Pattern}\ \rightharpoonup \ \mathsf{Pattern}
$$

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePattern}(\mathsf{WildcardPattern})\ \Downarrow \ \mathsf{WildcardPattern} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolvePattern}(\operatorname{IdentifierPattern}(x))\ \Downarrow \ \operatorname{IdentifierPattern}(x) \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolvePattern}(\operatorname{LiteralPattern}(\mathsf{lit}))\ \Downarrow \ \operatorname{LiteralPattern}(\mathsf{lit})
\end{array}
$$

**(ResolvePat-Tuple)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePatternList}(\mathsf{ps})\ \Downarrow \ \mathsf{ps}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolvePattern}(\operatorname{TuplePattern}(\mathsf{ps}))\ \Downarrow \ \operatorname{TuplePattern}(\mathsf{ps}')
\end{array}
$$

**(ResolvePat-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{tp})\ \Downarrow \ \mathsf{tp}'\quad \Gamma \ \vdash \ \operatorname{ResolveFieldPatternList}(\mathsf{fs})\ \Downarrow \ \mathsf{fs}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolvePattern}(\operatorname{RecordPattern}(\mathsf{tp},\ \mathsf{fs}))\ \Downarrow \ \operatorname{RecordPattern}(\mathsf{tp}',\ \mathsf{fs}')
\end{array}
$$

**(ResolvePat-Enum)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{tp})\ \Downarrow \ \mathsf{tp}'\quad \Gamma \ \vdash \ \operatorname{ResolveEnumPayloadPattern}(\mathsf{payload}_{\mathsf{opt}})\ \Downarrow \ \mathsf{payload}_{\mathsf{opt}}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolvePattern}(\operatorname{EnumPattern}(\mathsf{tp},\ \mathsf{name},\ \mathsf{payload}_{\mathsf{opt}}))\ \Downarrow \ \operatorname{EnumPattern}(\mathsf{tp}',\ \mathsf{name},\ \mathsf{payload}_{\mathsf{opt}}')
\end{array}
$$

**(ResolvePat-Modal)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveFieldPatternListOpt}(\mathsf{fields}_{\mathsf{opt}})\ \Downarrow \ \mathsf{fields}_{\mathsf{opt}}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolvePattern}(\operatorname{ModalPattern}(\mathsf{state},\ \mathsf{fields}_{\mathsf{opt}}))\ \Downarrow \ \operatorname{ModalPattern}(\mathsf{state},\ \mathsf{fields}_{\mathsf{opt}}')
\end{array}
$$

**(ResolvePat-Range)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePattern}(p_{l})\ \Downarrow \ p_{l}'\quad \Gamma \ \vdash \ \operatorname{ResolvePattern}(p_{h})\ \Downarrow \ p_{h}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolvePattern}(\operatorname{RangePattern}(\mathsf{kind},\ p_{l},\ p_{h}))\ \Downarrow \ \operatorname{RangePattern}(\mathsf{kind},\ p_{l}',\ p_{h}')
\end{array}
$$

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePatternList}([])\ \Downarrow \ [] \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveFieldPatternList}([])\ \Downarrow \ []
\end{array}
$$

**(ResolvePatternList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePattern}(p)\ \Downarrow \ p'\quad \Gamma \ \vdash \ \operatorname{ResolvePatternList}(\mathsf{ps})\ \Downarrow \ \mathsf{ps}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolvePatternList}(p\ \mathbin{::} \ \mathsf{ps})\ \Downarrow \ p'\ \mathbin{::} \ \mathsf{ps}'
\end{array}
$$

**(ResolveFieldPattern-Implicit)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveFieldPattern}(\langle \mathsf{name},\ \bot ,\ \mathsf{span}\rangle )\ \Downarrow \ \langle \mathsf{name},\ \bot ,\ \mathsf{span}\rangle 
\end{array}
$$

**(ResolveFieldPattern-Explicit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePattern}(p)\ \Downarrow \ p' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveFieldPattern}(\langle \mathsf{name},\ p,\ \mathsf{span}\rangle )\ \Downarrow \ \langle \mathsf{name},\ p',\ \mathsf{span}\rangle 
\end{array}
$$

**(ResolveFieldPatternList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveFieldPattern}(f)\ \Downarrow \ f'\quad \Gamma \ \vdash \ \operatorname{ResolveFieldPatternList}(\mathsf{fs})\ \Downarrow \ \mathsf{fs}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveFieldPatternList}(f\ \mathbin{::} \ \mathsf{fs})\ \Downarrow \ f'\ \mathbin{::} \ \mathsf{fs}'
\end{array}
$$

$$
\Gamma \ \vdash \ \operatorname{ResolveEnumPayloadPattern}(\bot )\ \Downarrow \ \bot 
$$

**(ResolveEnumPayloadPattern-Tuple)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePatternList}(\mathsf{ps})\ \Downarrow \ \mathsf{ps}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveEnumPayloadPattern}(\operatorname{TuplePayloadPattern}(\mathsf{ps}))\ \Downarrow \ \operatorname{TuplePayloadPattern}(\mathsf{ps}')
\end{array}
$$

**(ResolveEnumPayloadPattern-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveFieldPatternList}(\mathsf{fs})\ \Downarrow \ \mathsf{fs}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveEnumPayloadPattern}(\operatorname{RecordPayloadPattern}(\mathsf{fs}))\ \Downarrow \ \operatorname{RecordPayloadPattern}(\mathsf{fs}')
\end{array}
$$

$$
\Gamma \ \vdash \ \operatorname{ResolveFieldPatternListOpt}(\bot )\ \Downarrow \ \bot 
$$

**(ResolveFieldPatternListOpt-Some)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveFieldPatternList}(\mathsf{fs})\ \Downarrow \ \mathsf{fs}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveFieldPatternListOpt}(\mathsf{fs})\ \Downarrow \ \mathsf{fs}'
\end{array}
$$

**(ResolveExpr-Ident)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveValueName}(x)\ \Downarrow \ \mathsf{ent} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{Identifier}(x))\ \Downarrow \ \operatorname{Identifier}(x)
\end{array}
$$

**(ResolveExpr-Ident-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveValueName}(x)\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{ResolveExpr}-\mathsf{Ident}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{Identifier}(x))\ \Uparrow \ c
\end{array}
$$

**(ResolveExpr-Qualified)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveQualifiedForm}(e)\ \Downarrow \ e' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e'
\end{array}
$$

$$
\begin{array}{l}
\mathsf{ResolveArgsRef}\ =\ \{\texttt{"5.1.6"}\} \\[0.16em]
\mathsf{ResolveFieldInitsRef}\ =\ \{\texttt{"5.1.6"}\}
\end{array}
$$

$$
\Gamma \ \vdash \ \operatorname{ResolveExprList}([])\ \Downarrow \ []
$$

**(ResolveExprList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e'\quad \Gamma \ \vdash \ \operatorname{ResolveExprList}(\mathsf{es})\ \Downarrow \ \mathsf{es}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExprList}(e\ \mathbin{::} \ \mathsf{es})\ \Downarrow \ e'\ \mathbin{::} \ \mathsf{es}'
\end{array}
$$

$$
\mathsf{ResolveExprListJudg}\ =\ \{\mathsf{ResolveExprList}\}
$$

$$
\mathsf{ResolveEnumPayloadJudg}\ =\ \{\mathsf{ResolveEnumPayload}\}
$$

**(ResolveEnumPayload-None)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveEnumPayload}(\bot )\ \Downarrow \ \bot 
\end{array}
$$

**(ResolveEnumPayload-Tuple)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExprList}(\mathsf{es})\ \Downarrow \ \mathsf{es}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveEnumPayload}(\operatorname{Paren}(\mathsf{es}))\ \Downarrow \ \operatorname{Paren}(\mathsf{es}')
\end{array}
$$

**(ResolveEnumPayload-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveFieldInits}(\mathsf{fields})\ \Downarrow \ \mathsf{fields}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveEnumPayload}(\operatorname{Brace}(\mathsf{fields}))\ \Downarrow \ \operatorname{Brace}(\mathsf{fields}')
\end{array}
$$

$$
\mathsf{ResolveKeyPathJudg}\ =\ \{\mathsf{ResolveKeyPathExpr},\ \mathsf{ResolveKeyPathList},\ \mathsf{ResolveKeySeg},\ \mathsf{ResolveKeySegs}\}
$$

**(ResolveKeySeg-Field)**

$$
\begin{array}{l}
\mathsf{seg}\ =\ \operatorname{Field}(\mathsf{marked},\ \mathsf{name}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveKeySeg}(\mathsf{seg})\ \Downarrow \ \mathsf{seg}
\end{array}
$$

**(ResolveKeySeg-Index)**

$$
\begin{array}{l}
\mathsf{seg}\ =\ \operatorname{Index}(\mathsf{marked},\ e)\quad \Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveKeySeg}(\mathsf{seg})\ \Downarrow \ \operatorname{Index}(\mathsf{marked},\ e')
\end{array}
$$

**(ResolveKeySegs-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveKeySegs}([])\ \Downarrow \ []
\end{array}
$$

**(ResolveKeySegs-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveKeySeg}(s)\ \Downarrow \ s'\quad \Gamma \ \vdash \ \operatorname{ResolveKeySegs}(\mathsf{ss})\ \Downarrow \ \mathsf{ss}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveKeySegs}(s\ \mathbin{::} \ \mathsf{ss})\ \Downarrow \ s'\ \mathbin{::} \ \mathsf{ss}'
\end{array}
$$

**(ResolveKeyPathExpr)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveValueName}(\mathsf{root})\ \Downarrow \ \mathsf{ent}\quad \Gamma \ \vdash \ \operatorname{ResolveKeySegs}(\mathsf{segs})\ \Downarrow \ \mathsf{segs}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveKeyPathExpr}(\langle \mathsf{root},\ \mathsf{segs}\rangle )\ \Downarrow \ \langle \mathsf{root},\ \mathsf{segs}'\rangle 
\end{array}
$$

**(ResolveKeyPathExpr-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveValueName}(\mathsf{root})\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{ResolveExpr}-\mathsf{Ident}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveKeyPathExpr}(\langle \mathsf{root},\ \mathsf{segs}\rangle )\ \Uparrow \ c
\end{array}
$$

**(ResolveKeyPathList-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveKeyPathList}([])\ \Downarrow \ []
\end{array}
$$

**(ResolveKeyPathList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveKeyPathExpr}(\mathsf{kp})\ \Downarrow \ \mathsf{kp}'\quad \Gamma \ \vdash \ \operatorname{ResolveKeyPathList}(\mathsf{kps})\ \Downarrow \ \mathsf{kps}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveKeyPathList}(\mathsf{kp}\ \mathbin{::} \ \mathsf{kps})\ \Downarrow \ \mathsf{kp}'\ \mathbin{::} \ \mathsf{kps}'
\end{array}
$$

$$
\mathsf{ResolveParallelOptJudg}\ =\ \{\mathsf{ResolveParallelOpt},\ \mathsf{ResolveParallelOpts}\}
$$

**(ResolveParallelOpt-Cancel)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveParallelOpt}(\operatorname{Cancel}(e))\ \Downarrow \ \operatorname{Cancel}(e')
\end{array}
$$

**(ResolveParallelOpt-Name)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveParallelOpt}(\operatorname{Name}(s))\ \Downarrow \ \operatorname{Name}(s)
\end{array}
$$

**(ResolveParallelOpts-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveParallelOpts}([])\ \Downarrow \ []
\end{array}
$$

**(ResolveParallelOpts-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveParallelOpt}(o)\ \Downarrow \ o'\quad \Gamma \ \vdash \ \operatorname{ResolveParallelOpts}(\mathsf{os})\ \Downarrow \ \mathsf{os}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveParallelOpts}(o\ \mathbin{::} \ \mathsf{os})\ \Downarrow \ o'\ \mathbin{::} \ \mathsf{os}'
\end{array}
$$

$$
\mathsf{ResolveSpawnOptJudg}\ =\ \{\mathsf{ResolveSpawnOpt},\ \mathsf{ResolveSpawnOpts}\}
$$

**(ResolveSpawnOpt-Name)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveSpawnOpt}(\operatorname{Name}(s))\ \Downarrow \ \operatorname{Name}(s)
\end{array}
$$

**(ResolveSpawnOpt-Affinity)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveSpawnOpt}(\operatorname{Affinity}(e))\ \Downarrow \ \operatorname{Affinity}(e')
\end{array}
$$

**(ResolveSpawnOpt-Priority)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveSpawnOpt}(\operatorname{Priority}(e))\ \Downarrow \ \operatorname{Priority}(e')
\end{array}
$$

**(ResolveSpawnOpts-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveSpawnOpts}([])\ \Downarrow \ []
\end{array}
$$

**(ResolveSpawnOpts-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveSpawnOpt}(o)\ \Downarrow \ o'\quad \Gamma \ \vdash \ \operatorname{ResolveSpawnOpts}(\mathsf{os})\ \Downarrow \ \mathsf{os}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveSpawnOpts}(o\ \mathbin{::} \ \mathsf{os})\ \Downarrow \ o'\ \mathbin{::} \ \mathsf{os}'
\end{array}
$$

$$
\mathsf{ResolveDispatchOptJudg}\ =\ \{\mathsf{ResolveDispatchOpt},\ \mathsf{ResolveDispatchOpts}\}
$$

**(ResolveDispatchOpt-Reduce)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveDispatchOpt}(\operatorname{Reduce}(\mathsf{op}))\ \Downarrow \ \operatorname{Reduce}(\mathsf{op})
\end{array}
$$

**(ResolveDispatchOpt-Ordered)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveDispatchOpt}(\mathsf{Ordered})\ \Downarrow \ \mathsf{Ordered}
\end{array}
$$

**(ResolveDispatchOpt-Chunk)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveDispatchOpt}(\operatorname{Chunk}(e))\ \Downarrow \ \operatorname{Chunk}(e')
\end{array}
$$

**(ResolveDispatchOpts-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveDispatchOpts}([])\ \Downarrow \ []
\end{array}
$$

**(ResolveDispatchOpts-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveDispatchOpt}(o)\ \Downarrow \ o'\quad \Gamma \ \vdash \ \operatorname{ResolveDispatchOpts}(\mathsf{os})\ \Downarrow \ \mathsf{os}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveDispatchOpts}(o\ \mathbin{::} \ \mathsf{os})\ \Downarrow \ o'\ \mathbin{::} \ \mathsf{os}'
\end{array}
$$

$$
\mathsf{ResolveRaceJudg}\ =\ \{\mathsf{ResolveRaceArm},\ \mathsf{ResolveRaceArms},\ \mathsf{ResolveRaceHandler}\}
$$

**(ResolveRaceHandler-Return)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveRaceHandler}(\operatorname{RaceReturn}(e))\ \Downarrow \ \operatorname{RaceReturn}(e')
\end{array}
$$

**(ResolveRaceHandler-Yield)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveRaceHandler}(\operatorname{RaceYield}(e))\ \Downarrow \ \operatorname{RaceYield}(e')
\end{array}
$$

**(ResolveRaceArm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e'\quad \Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \Gamma_{0} \ \vdash \ \operatorname{ResolvePattern}(\mathsf{pat})\ \Downarrow \ \mathsf{pat}'\quad \Gamma_{0} \ \vdash \ \operatorname{BindPattern}(\mathsf{pat}')\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} \ \vdash \ \operatorname{ResolveRaceHandler}(\mathsf{handler})\ \Downarrow \ \mathsf{handler}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveRaceArm}(\langle e,\ \mathsf{pat},\ \mathsf{handler}\rangle )\ \Downarrow \ \langle e',\ \mathsf{pat}',\ \mathsf{handler}'\rangle 
\end{array}
$$

**(ResolveRaceArms-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveRaceArms}([])\ \Downarrow \ []
\end{array}
$$

**(ResolveRaceArms-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveRaceArm}(a)\ \Downarrow \ a'\quad \Gamma \ \vdash \ \operatorname{ResolveRaceArms}(\mathsf{as})\ \Downarrow \ \mathsf{as}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveRaceArms}(a\ \mathbin{::} \ \mathsf{as})\ \Downarrow \ a'\ \mathbin{::} \ \mathsf{as}'
\end{array}
$$

$$
\mathsf{ResolveAllExprListJudg}\ =\ \{\mathsf{ResolveAllExprList}\}
$$

**(ResolveAllExprList-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveAllExprList}([])\ \Downarrow \ []
\end{array}
$$

**(ResolveAllExprList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e'\quad \Gamma \ \vdash \ \operatorname{ResolveAllExprList}(\mathsf{es})\ \Downarrow \ \mathsf{es}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveAllExprList}(e\ \mathbin{::} \ \mathsf{es})\ \Downarrow \ e'\ \mathbin{::} \ \mathsf{es}'
\end{array}
$$

$$
\mathsf{ResolveCalleeJudg}\ =\ \{\mathsf{ResolveCallee}\}
$$

**(ResolveCallee-Ident-Value)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveValueName}(x)\ \Downarrow \ \mathsf{ent} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveCallee}(\operatorname{Identifier}(x),\ \mathsf{args})\ \Downarrow \ \operatorname{Identifier}(x)
\end{array}
$$

**(ResolveCallee-Ident-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveValueName}(x)\ \Uparrow \quad \mathsf{args}\ =\ []\quad \Gamma \ \vdash \ \operatorname{ResolveTypeName}(x)\ \Downarrow \ \mathsf{ent}\quad \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ p\quad \mathsf{name}\ =\ (\mathsf{ent}.\mathsf{target}_{\mathsf{opt}}\ \mathsf{if}\ \mathsf{present},\ \mathsf{else}\ x)\quad \operatorname{RecordDecl}(\operatorname{FullPath}(\operatorname{PathOfModule}(p),\ \mathsf{name}))\ =\ R \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveCallee}(\operatorname{Identifier}(x),\ \mathsf{args})\ \Downarrow \ \operatorname{Identifier}(x)
\end{array}
$$

**(ResolveCallee-Path-Value)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveQualified}(\mathsf{path},\ \mathsf{name},\ \mathsf{ValueKind})\ \Downarrow \ \mathsf{ent} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveCallee}(\operatorname{Path}(\mathsf{path},\ \mathsf{name}),\ \mathsf{args})\ \Downarrow \ \operatorname{Path}(\mathsf{path},\ \mathsf{name})
\end{array}
$$

**(ResolveCallee-Path-Builtin)**
BuiltinValuePath(path, name)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveCallee}(\operatorname{Path}(\mathsf{path},\ \mathsf{name}),\ \mathsf{args})\ \Downarrow \ \operatorname{Path}(\mathsf{path},\ \mathsf{name})
\end{array}
$$

**(ResolveCallee-Path-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveRecordPath}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p\quad \mathsf{args}\ =\ [] \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveCallee}(\operatorname{Path}(\mathsf{path},\ \mathsf{name}),\ \mathsf{args})\ \Downarrow \ \operatorname{Path}(\mathsf{path},\ \mathsf{name})
\end{array}
$$

**(ResolveCallee-Other)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{callee})\ \Downarrow \ \mathsf{callee}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveCallee}(\mathsf{callee},\ \mathsf{args})\ \Downarrow \ \mathsf{callee}'
\end{array}
$$

**(ResolveExpr-Call)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveArgs}(\mathsf{args})\ \Downarrow \ \mathsf{args}'\quad \Gamma \ \vdash \ \operatorname{ResolveCallee}(\mathsf{callee},\ \mathsf{args}')\ \Downarrow \ \mathsf{callee}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{Call}(\mathsf{callee},\ \mathsf{args}))\ \Downarrow \ \operatorname{Call}(\mathsf{callee}',\ \mathsf{args}')
\end{array}
$$

**(ResolveExpr-Call-TypeArgs)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypeList}(\mathsf{type}_{\mathsf{args}})\ \Downarrow \ \mathsf{type}_{\mathsf{args}}'\quad \Gamma \ \vdash \ \operatorname{ResolveArgs}(\mathsf{args})\ \Downarrow \ \mathsf{args}'\quad \Gamma \ \vdash \ \operatorname{ResolveCallee}(\mathsf{callee},\ \mathsf{args}')\ \Downarrow \ \mathsf{callee}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{CallTypeArgs}(\mathsf{callee},\ \mathsf{type}_{\mathsf{args}},\ \mathsf{args}))\ \Downarrow \ \operatorname{CallTypeArgs}(\mathsf{callee}',\ \mathsf{type}_{\mathsf{args}}',\ \mathsf{args}')
\end{array}
$$

**(ResolveExpr-RecordExpr)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypeRef}(\mathsf{tr})\ \Downarrow \ \mathsf{tr}'\quad \Gamma \ \vdash \ \operatorname{ResolveFieldInits}(\mathsf{fields})\ \Downarrow \ \mathsf{fields}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{RecordExpr}(\mathsf{tr},\ \mathsf{fields}))\ \Downarrow \ \operatorname{RecordExpr}(\mathsf{tr}',\ \mathsf{fields}')
\end{array}
$$

**(ResolveExpr-EnumLiteral)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveEnumPayload}(\mathsf{payload}_{\mathsf{opt}})\ \Downarrow \ \mathsf{payload}_{\mathsf{opt}}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{EnumLiteral}(\mathsf{path},\ \mathsf{payload}_{\mathsf{opt}}))\ \Downarrow \ \operatorname{EnumLiteral}(\mathsf{path},\ \mathsf{payload}_{\mathsf{opt}}')
\end{array}
$$

$$
\mathsf{ResolveIfCaseJudg}\ =\ \{\mathsf{ResolveIfCase},\ \mathsf{ResolveIfCases},\ \mathsf{ResolveElseBlockOpt}\}
$$

**(ResolveIfCase)**

$$
\begin{array}{l}
\Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \Gamma_{0} \ \vdash \ \operatorname{ResolvePattern}(p)\ \Downarrow \ p'\quad \Gamma_{0} \ \vdash \ \operatorname{BindPattern}(p')\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} \ \vdash \ \operatorname{ResolveExpr}(b)\ \Downarrow \ b' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveIfCase}(\langle p,\ b\rangle )\ \Downarrow \ \langle p',\ b'\rangle 
\end{array}
$$

**(ResolveIfCases-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveIfCases}([])\ \Downarrow \ []
\end{array}
$$

**(ResolveIfCases-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveIfCase}(a)\ \Downarrow \ a'\quad \Gamma \ \vdash \ \operatorname{ResolveIfCases}(\mathsf{as})\ \Downarrow \ \mathsf{as}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveIfCases}(a\ \mathbin{::} \ \mathsf{as})\ \Downarrow \ a'\ \mathbin{::} \ \mathsf{as}'
\end{array}
$$

**(ResolveElseBlockOpt-None)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveElseBlockOpt}(\bot )\ \Downarrow \ \bot 
\end{array}
$$

**(ResolveElseBlockOpt-Some)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(b)\ \Downarrow \ b' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveElseBlockOpt}(b)\ \Downarrow \ b'
\end{array}
$$

**(ResolveExpr-IfIs)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{scrutinee})\ \Downarrow \ \mathsf{scrutinee}'\quad \Gamma \ \vdash \ \operatorname{ResolvePattern}(\mathsf{pat})\ \Downarrow \ \mathsf{pat}'\quad \Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \Gamma_{0} \ \vdash \ \operatorname{BindPattern}(\mathsf{pat}')\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} \ \vdash \ \operatorname{ResolveExpr}(\mathsf{then}_{\mathsf{block}})\ \Downarrow \ \mathsf{then}_{\mathsf{block}}'\quad \Gamma \ \vdash \ \operatorname{ResolveElseBlockOpt}(\mathsf{else}_{\mathsf{opt}})\ \Downarrow \ \mathsf{else}_{\mathsf{opt}}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{IfIsExpr}(\mathsf{scrutinee},\ \mathsf{pat},\ \mathsf{then}_{\mathsf{block}},\ \mathsf{else}_{\mathsf{opt}}))\ \Downarrow \ \operatorname{IfIsExpr}(\mathsf{scrutinee}',\ \mathsf{pat}',\ \mathsf{then}_{\mathsf{block}}',\ \mathsf{else}_{\mathsf{opt}}')
\end{array}
$$

**(ResolveExpr-IfCase)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{scrutinee})\ \Downarrow \ \mathsf{scrutinee}'\quad \Gamma \ \vdash \ \operatorname{ResolveIfCases}(\mathsf{cases})\ \Downarrow \ \mathsf{cases}'\quad \Gamma \ \vdash \ \operatorname{ResolveElseBlockOpt}(\mathsf{else}_{\mathsf{opt}})\ \Downarrow \ \mathsf{else}_{\mathsf{opt}}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{IfCaseExpr}(\mathsf{scrutinee},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}}))\ \Downarrow \ \operatorname{IfCaseExpr}(\mathsf{scrutinee}',\ \mathsf{cases}',\ \mathsf{else}_{\mathsf{opt}}')
\end{array}
$$

**(ResolveExpr-LoopInfinite)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveInvariantOpt}(\mathsf{inv}_{\mathsf{opt}})\ \Downarrow \ \mathsf{inv}_{\mathsf{opt}}'\quad \Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{body})\ \Downarrow \ \mathsf{body}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{LoopInfinite}(\mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}))\ \Downarrow \ \operatorname{LoopInfinite}(\mathsf{inv}_{\mathsf{opt}}',\ \mathsf{body}')
\end{array}
$$

**(ResolveExpr-LoopConditional)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{cond})\ \Downarrow \ \mathsf{cond}'\quad \Gamma \ \vdash \ \operatorname{ResolveInvariantOpt}(\mathsf{inv}_{\mathsf{opt}})\ \Downarrow \ \mathsf{inv}_{\mathsf{opt}}'\quad \Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{body})\ \Downarrow \ \mathsf{body}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{LoopConditional}(\mathsf{cond},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}))\ \Downarrow \ \operatorname{LoopConditional}(\mathsf{cond}',\ \mathsf{inv}_{\mathsf{opt}}',\ \mathsf{body}')
\end{array}
$$

**(ResolveExpr-LoopIter)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePattern}(\mathsf{pat})\ \Downarrow \ \mathsf{pat}'\quad \Gamma \ \vdash \ \operatorname{ResolveTypeOpt}(\mathsf{ty}_{\mathsf{opt}})\ \Downarrow \ \mathsf{ty}_{\mathsf{opt}}'\quad \Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{iter})\ \Downarrow \ \mathsf{iter}'\quad \Gamma \ \vdash \ \operatorname{ResolveInvariantOpt}(\mathsf{inv}_{\mathsf{opt}})\ \Downarrow \ \mathsf{inv}_{\mathsf{opt}}'\quad \Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \Gamma_{0} \ \vdash \ \operatorname{BindPattern}(\mathsf{pat}')\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} \ \vdash \ \operatorname{ResolveExpr}(\mathsf{body})\ \Downarrow \ \mathsf{body}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{LoopIter}(\mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{iter},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}))\ \Downarrow \ \operatorname{LoopIter}(\mathsf{pat}',\ \mathsf{ty}_{\mathsf{opt}}',\ \mathsf{iter}',\ \mathsf{inv}_{\mathsf{opt}}',\ \mathsf{body}')
\end{array}
$$

**(ResolveExpr-Parallel)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{domain})\ \Downarrow \ \mathsf{domain}'\quad \Gamma \ \vdash \ \operatorname{ResolveParallelOpts}(\mathsf{opts})\ \Downarrow \ \mathsf{opts}'\quad \Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{body})\ \Downarrow \ \mathsf{body}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{ParallelExpr}(\mathsf{domain},\ \mathsf{opts},\ \mathsf{body}))\ \Downarrow \ \operatorname{ParallelExpr}(\mathsf{domain}',\ \mathsf{opts}',\ \mathsf{body}')
\end{array}
$$

**(ResolveExpr-Spawn)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveSpawnOpts}(\mathsf{opts})\ \Downarrow \ \mathsf{opts}'\quad \Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{body})\ \Downarrow \ \mathsf{body}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{SpawnExpr}(\mathsf{opts},\ \mathsf{body}))\ \Downarrow \ \operatorname{SpawnExpr}(\mathsf{opts}',\ \mathsf{body}')
\end{array}
$$

**(ResolveExpr-Wait)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{handle})\ \Downarrow \ \mathsf{handle}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{WaitExpr}(\mathsf{handle}))\ \Downarrow \ \operatorname{WaitExpr}(\mathsf{handle}')
\end{array}
$$

$$
\mathsf{ResolveKeyClauseJudg}\ =\ \{\mathsf{ResolveKeyClauseOpt}\}
$$

**(ResolveKeyClauseOpt-None)**

$$
\begin{array}{l}
\mathsf{key}_{\mathsf{clause}\_\mathsf{opt}}\ =\ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveKeyClauseOpt}(\mathsf{key}_{\mathsf{clause}\_\mathsf{opt}})\ \Downarrow \ \bot 
\end{array}
$$

**(ResolveKeyClauseOpt-Yes)**

$$
\begin{array}{l}
\mathsf{key}_{\mathsf{clause}\_\mathsf{opt}}\ =\ \langle \mathsf{path},\ \mathsf{mode}\rangle \quad \Gamma \ \vdash \ \operatorname{ResolveKeyPathExpr}(\mathsf{path})\ \Downarrow \ \mathsf{path}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveKeyClauseOpt}(\mathsf{key}_{\mathsf{clause}\_\mathsf{opt}})\ \Downarrow \ \langle \mathsf{path}',\ \mathsf{mode}\rangle 
\end{array}
$$

**(ResolveExpr-Dispatch)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePattern}(\mathsf{pat})\ \Downarrow \ \mathsf{pat}'\quad \Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{range})\ \Downarrow \ \mathsf{range}'\quad \Gamma \ \vdash \ \operatorname{ResolveKeyClauseOpt}(\mathsf{key}_{\mathsf{clause}\_\mathsf{opt}})\ \Downarrow \ \mathsf{key}_{\mathsf{clause}\_\mathsf{opt}}'\quad \Gamma \ \vdash \ \operatorname{ResolveDispatchOpts}(\mathsf{opts})\ \Downarrow \ \mathsf{opts}'\quad \Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \Gamma_{0} \ \vdash \ \operatorname{BindPattern}(\mathsf{pat}')\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} \ \vdash \ \operatorname{ResolveExpr}(\mathsf{body})\ \Downarrow \ \mathsf{body}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{DispatchExpr}(\mathsf{pat},\ \mathsf{range},\ \mathsf{key}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{opts},\ \mathsf{body}))\ \Downarrow \ \operatorname{DispatchExpr}(\mathsf{pat}',\ \mathsf{range}',\ \mathsf{key}_{\mathsf{clause}\_\mathsf{opt}}',\ \mathsf{opts}',\ \mathsf{body}')
\end{array}
$$

**(ResolveExpr-Yield)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{YieldExpr}(\mathsf{release}_{\mathsf{opt}},\ e))\ \Downarrow \ \operatorname{YieldExpr}(\mathsf{release}_{\mathsf{opt}},\ e')
\end{array}
$$

**(ResolveExpr-YieldFrom)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ e))\ \Downarrow \ \operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ e')
\end{array}
$$

**(ResolveExpr-Sync)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{SyncExpr}(e))\ \Downarrow \ \operatorname{SyncExpr}(e')
\end{array}
$$

**(ResolveExpr-Race)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveRaceArms}(\mathsf{arms})\ \Downarrow \ \mathsf{arms}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{RaceExpr}(\mathsf{arms}))\ \Downarrow \ \operatorname{RaceExpr}(\mathsf{arms}')
\end{array}
$$

**(ResolveExpr-All)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveAllExprList}(\mathsf{es})\ \Downarrow \ \mathsf{es}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{AllExpr}(\mathsf{es}))\ \Downarrow \ \operatorname{AllExpr}(\mathsf{es}')
\end{array}
$$

**(ResolveExpr-Alloc-Explicit-ByAlias)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveValueName}(r)\ \Downarrow \ \mathsf{ent}\quad \operatorname{RegionAlias}(\mathsf{ent})\quad \Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{Binary}(\texttt{"\^{}"},\ \operatorname{Identifier}(r),\ e))\ \Downarrow \ \operatorname{AllocExpr}(r,\ e')
\end{array}
$$

$$
\mathsf{ResolveExprRules}\ =\ \{\mathsf{ResolveExpr}-\mathsf{Ident},\ \mathsf{ResolveExpr}-\mathsf{Qualified},\ \mathsf{ResolveExpr}-\mathsf{Call},\ \mathsf{ResolveExpr}-\mathsf{Call}-\mathsf{TypeArgs},\ \mathsf{ResolveExpr}-\mathsf{RecordExpr},\ \mathsf{ResolveExpr}-\mathsf{EnumLiteral},\ \mathsf{ResolveExpr}-\mathsf{IfCase},\ \mathsf{ResolveExpr}-\mathsf{LoopIter},\ \mathsf{ResolveExpr}-\mathsf{Parallel},\ \mathsf{ResolveExpr}-\mathsf{Spawn},\ \mathsf{ResolveExpr}-\mathsf{Wait},\ \mathsf{ResolveExpr}-\mathsf{Dispatch},\ \mathsf{ResolveExpr}-\mathsf{Yield},\ \mathsf{ResolveExpr}-\mathsf{YieldFrom},\ \mathsf{ResolveExpr}-\mathsf{Sync},\ \mathsf{ResolveExpr}-\mathsf{Race},\ \mathsf{ResolveExpr}-\mathsf{All},\ \mathsf{ResolveExpr}-\mathsf{Alloc}-\mathsf{Explicit}-\mathsf{ByAlias},\ \mathsf{ResolveExpr}-\mathsf{Hom},\ \mathsf{ResolveExpr}-\mathsf{Alloc}-\mathsf{Implicit},\ \mathsf{ResolveExpr}-\mathsf{Alloc}-\mathsf{Explicit},\ \mathsf{ResolveExpr}-\mathsf{Block}\}
$$

$$
\operatorname{NoSpecificResolveExpr}(e)\ \Leftrightarrow \ \lnot \ \exists \ r\ \in \ \mathsf{ResolveExprRules}\ \setminus \ \{\mathsf{ResolveExpr}-\mathsf{Hom}\}.\ \operatorname{PremisesHold}(r,\ e)
$$

**(ResolveExpr-Hom)**

$$
\begin{array}{l}
\operatorname{NoSpecificResolveExpr}(\operatorname{C}(e_{1},\ \ldots ,\ e_{n}))\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{ResolveExpr}(e_{i})\ \Downarrow \ e_{i}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{C}(e_{1},\ \ldots ,\ e_{n}))\ \Downarrow \ \operatorname{C}(e_{1}',\ \ldots ,\ e_{n}')
\end{array}
$$

**(ResolveExpr-Alloc-Implicit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{AllocExpr}(\bot ,\ e))\ \Downarrow \ \operatorname{AllocExpr}(\bot ,\ e')
\end{array}
$$

**(ResolveExpr-Alloc-Explicit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveValueName}(r)\ \Downarrow \ \mathsf{ent}\quad \Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{AllocExpr}(r,\ e))\ \Downarrow \ \operatorname{AllocExpr}(r,\ e')
\end{array}
$$

$$
\mathsf{ResolveStmtSeqJudg}\ =\ \{\mathsf{ResolveStmtSeq}\}
$$

**(ResolveStmtSeq-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveStmtSeq}([])\ \Downarrow \ (\Gamma ,\ [])
\end{array}
$$

**(ResolveStmtSeq-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveStmt}(s)\ \Downarrow \ (\Gamma_{1} ,\ s')\quad \Gamma_{1} \ \vdash \ \operatorname{ResolveStmtSeq}(\mathsf{ss})\ \Downarrow \ (\Gamma_{2} ,\ \mathsf{ss}') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveStmtSeq}(s\ \mathbin{::} \ \mathsf{ss})\ \Downarrow \ (\Gamma_{2} ,\ s'\ \mathbin{::} \ \mathsf{ss}')
\end{array}
$$

**(ResolveExpr-Block)**

$$
\begin{array}{l}
\Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \Gamma_{0} \ \vdash \ \operatorname{ResolveStmtSeq}(\mathsf{stmts})\ \Downarrow \ (\Gamma_{1} ,\ \mathsf{stmts}')\quad (\mathsf{tail}_{\mathsf{opt}}\ =\ \bot \ \Rightarrow \ \mathsf{tail}_{\mathsf{opt}}'\ =\ \bot )\quad (\mathsf{tail}_{\mathsf{opt}}\ =\ e\ \Rightarrow \ \Gamma_{1} \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e'\ \land \ \mathsf{tail}_{\mathsf{opt}}'\ =\ e') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{BlockExpr}(\mathsf{stmts},\ \mathsf{tail}_{\mathsf{opt}}))\ \Downarrow \ \operatorname{BlockExpr}(\mathsf{stmts}',\ \mathsf{tail}_{\mathsf{opt}}')
\end{array}
$$

**(Validate-ModulePath-Ok)**

$$
\begin{array}{l}
\lnot \ \operatorname{ReservedModulePath}(\operatorname{PathOfModule}(p)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ValidateModulePath}(p)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(Validate-ModulePath-Reserved-Err)**

$$
\begin{array}{l}
\operatorname{ReservedModulePath}(\operatorname{PathOfModule}(p))\quad c\ =\ \operatorname{Code}(\mathsf{Validate}-\mathsf{ModulePath}-\mathsf{Reserved}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ValidateModulePath}(p)\ \Uparrow \ c
\end{array}
$$

`ResolveItem` is a feature-owned judgment. Chapters 11 through 22 define the feature-specific `ResolveItem` clauses; this chapter defines the shared driver and helper relations they consume.

**(ResolveModule-Ok)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CollectNames}(M)\ \Downarrow \ N\quad \Gamma \ \vdash \ \operatorname{ValidateModulePath}(M.\mathsf{path})\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{ValidateModuleNames}(N)\ \Downarrow \ \mathsf{ok}\quad S_{\mathsf{module}}\ =\ N\quad \Gamma_{N} \ =\ [S_{\mathsf{module}},\ S_{\mathsf{universe}}]\quad \Gamma_{N} \ \vdash \ \operatorname{ResolveItems}(M.\mathsf{items})\ \Downarrow \ \mathsf{items}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveModule}(M)\ \Downarrow \ \langle M.\mathsf{path},\ \mathsf{items}',\ M.\mathsf{module}_{\mathsf{doc}}\rangle 
\end{array}
$$

$$
\Gamma \ \vdash \ \operatorname{ResolveItems}([])\ \Downarrow \ []
$$

**(ResolveItems-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TopLevelVis}(\mathsf{it})\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{ResolveItem}(\mathsf{it})\ \Downarrow \ \mathsf{it}'\quad \Gamma \ \vdash \ \operatorname{ResolveItems}(\mathsf{rest})\ \Downarrow \ \mathsf{rest}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveItems}(\mathsf{it}\ \mathbin{::} \ \mathsf{rest})\ \Downarrow \ \mathsf{it}'\ \mathbin{::} \ \mathsf{rest}'
\end{array}
$$

$$
\mathsf{ResState}\ =\ \{\operatorname{ResStart}(M),\ \operatorname{ResNames}(M,\ N),\ \operatorname{ResItems}(M,\ N),\ \operatorname{ResDone}(M'),\ \operatorname{Error}(\mathsf{code})\}
$$

**(Res-Start)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{ResStart}(M)\rangle \ \to \ \langle \operatorname{ResNames}(M,\ \_)\rangle 
\end{array}
$$

**(Res-Names)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CollectNames}(M)\ \Downarrow \ N \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{ResNames}(M,\ \_)\rangle \ \to \ \langle \operatorname{ResItems}(M,\ N)\rangle 
\end{array}
$$

**(Res-Items)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveModule}(M)\ \Downarrow \ M' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{ResItems}(M,\ N)\rangle \ \to \ \langle \operatorname{ResDone}(M')\rangle 
\end{array}
$$

**ResolveModules (Big-Step).**

**(ResolveModules-Ok)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseModules}(P)\ \Downarrow \ [M_{1},\ \ldots ,\ M_{k}]\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{ResolveModule}(M_{i})\ \Downarrow \ M_{i}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveModules}(P)\ \Downarrow \ [M_{1}',\ \ldots ,\ M_{k}']
\end{array}
$$

**(ResolveModules-Err-Parse)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseModules}(P)\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveModules}(P)\ \Uparrow \ c
\end{array}
$$

**(ResolveModules-Err-Resolve)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseModules}(P)\ \Downarrow \ [M_{1},\ \ldots ,\ M_{k}]\quad \exists \ i.\ \Gamma \ \vdash \ \operatorname{ResolveModule}(M_{i})\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveModules}(P)\ \Uparrow \ c
\end{array}
$$

## 7.8 Name Resolution and Reserved Name Diagnostics

This section owns name-resolution, visibility, and reserved-name diagnostics.

| Code         | Severity | Detection    | Condition                                                                                                                                                                                                                                                                                 |
| ------------ | -------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `E-CNF-0406` | Error    | Compile-time | User declaration uses `gen_` prefix                                                                                                                                                                                                                                                       |
| `E-MOD-1203` | Error    | Compile-time | Name introduced by `using` or `import as` conflicts with existing                                                                                                                                                                                                                         |
| `E-MOD-1207` | Error    | Compile-time | Cannot access a non-public item from this scope                                                                                                                                                                                                                                           |
| `E-MOD-1301` | Error    | Compile-time | Unresolved name: identifier not found in any accessible scope                                                                                                                                                                                                                             |
| `E-MOD-1302` | Error    | Compile-time | Duplicate declaration in module scope                                                                                                                                                                                                                                                     |
| `E-MOD-1304` | Error    | Compile-time | Name reuse: identifier already bound in an enclosing scope; choose a different name or use `using source as alias` for a compile-time alias (`Intro-Outer-Err`). When the outer binding is a universe name (primitive, special, or async type), the message SHOULD identify the category. |
| `E-MOD-1307` | Error    | Compile-time | Ambiguous method resolution; disambiguation required                                                                                                                                                                                                                                      |
| `E-MOD-1308` | Error    | Compile-time | `using source as alias`: `source` does not resolve in any accessible scope (`Using-Alias-Unresolved`)                                                                                                                                                                                     |
| `E-MOD-1309` | Error    | Compile-time | `using source as alias`: `alias` conflicts with an existing binding in this or an enclosing scope (`Using-Alias-Dup`)                                                                                                                                                                     |
| `E-MOD-1310` | Error    | Compile-time | `using source as alias`: `alias` is a reserved identifier (`Using-Alias-Reserved`)                                                                                                                                                                                                        |
