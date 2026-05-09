---
title: "Name Resolution and Visibility"
description: "7. Name Resolution and Visibility of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T18:13:03.158Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## 7. Name Resolution and Visibility

### 7.1 Scope Context and Identifiers

```math
\begin{array}{l}
\mathsf{IdKeyRef}\ =\ \{\texttt{"4.2.8"}\} \\
\operatorname{ScopeKey}(S)\ \Leftrightarrow \ \operatorname{dom}(S)\ \subseteq \ \{\operatorname{IdKey}(x)\ \mid \ x\ \in \ \mathsf{Identifier}\}
\end{array}
```

```math
\begin{array}{l}
\Sigma \ =\ \langle \Sigma .\mathsf{Mods},\ \Sigma .\mathsf{Types},\ \Sigma .\mathsf{Classes}\rangle  \\
\Sigma .\mathsf{Mods}\ \in \ [\mathsf{ASTModule}] \\
\Sigma .\mathsf{Types}\ :\ \mathsf{Path}\ \rightharpoonup \ \mathsf{TypeDecl} \\
\Sigma .\mathsf{Classes}\ :\ \mathsf{Path}\ \rightharpoonup \ \mathsf{ClassDecl}
\end{array}
```

```math
\begin{array}{l}
\Gamma \ =\ \langle P,\ \Sigma ,\ m,\ S\rangle  \\
\operatorname{Project}(\Gamma )\ =\ P \\
\operatorname{ResCtx}(\Gamma )\ =\ \langle \Sigma ,\ m\rangle  \\
\operatorname{CurrentModule}(\Gamma )\ =\ m \\
\operatorname{Scopes}(\Gamma )\ =\ S
\end{array}
```

```math
\begin{array}{l}
\mathsf{EntityKind}\ =\ \{\mathsf{Value},\ \mathsf{Type},\ \mathsf{Class},\ \mathsf{ModuleAlias}\} \\
\mathsf{EntitySource}\ =\ \{\mathsf{Decl},\ \mathsf{Using},\ \mathsf{RegionAlias}\} \\
\mathsf{Entity}\ =\ \langle \mathsf{kind},\ \mathsf{origin}_{\mathsf{opt}},\ \mathsf{target}_{\mathsf{opt}},\ \mathsf{source}\rangle  \\
\mathsf{origin}_{\mathsf{opt}}\ \in \ \mathsf{ModulePath}\ \cup \ \{\bot \} \\
\mathsf{target}_{\mathsf{opt}}\ \in \ \mathsf{Identifier}\ \cup \ \{\bot \}
\end{array}
```

S : IdKey ⇀ Entity

```math
\begin{array}{l}
\operatorname{Scopes}(\Gamma )\ =\ [S_{1},\ \ldots ,\ S_{k},\ S_{\mathsf{proc}},\ S_{\mathsf{module}},\ S_{\mathsf{universe}}]\quad (k\ \ge \ 0) \\
\operatorname{LocalScopes}(\Gamma )\ =\ [S_{1},\ \ldots ,\ S_{k}] \\
\operatorname{ProcScope}(\Gamma )\ =\ S_{\mathsf{proc}} \\
\operatorname{ModuleScope}(\Gamma )\ =\ S_{\mathsf{module}} \\
\operatorname{UniverseScope}(\Gamma )\ =\ S_{\mathsf{universe}}
\end{array}
```

```math
\begin{array}{l}
\mathsf{UniverseBindings}\ =\ \{\ \operatorname{IdKey}(x)\ \mapsto \ \langle \mathsf{Type},\ \bot ,\ \bot ,\ \mathsf{Decl}\rangle \ \mid \ x\ \in \ \mathsf{UniverseProtected}\ \}\ \cup \ \{\ \operatorname{IdKey}(\texttt{ultraviolet})\ \mapsto \ \langle \mathsf{ModuleAlias},\ \texttt{ultraviolet},\ \bot ,\ \mathsf{Decl}\rangle \ \} \\
S_{\mathsf{universe}}\ =\ \mathsf{UniverseBindings}
\end{array}
```

```math
\begin{array}{l}
\operatorname{BytePrefix}(p,\ s)\ \Leftrightarrow \ \exists \ r.\ s\ =\ p\ \mathbin{++} \ r \\
\operatorname{Prefix}(s,\ p)\ \Leftrightarrow \ \operatorname{BytePrefix}(p,\ s)
\end{array}
```

```math
\begin{array}{l}
\operatorname{ReservedGen}(x)\ \Leftrightarrow \ \operatorname{Prefix}(\operatorname{IdKey}(x),\ \operatorname{IdKey}(\texttt{gen\_})) \\
\operatorname{ReservedUltraviolet}(x)\ \Leftrightarrow \ \operatorname{IdEq}(x,\ \texttt{ultraviolet}) \\
\operatorname{ReservedId}(x)\ \Leftrightarrow \ \operatorname{ReservedGen}(x)\ \lor \ \operatorname{ReservedUltraviolet}(x) \\
\operatorname{ReservedModulePath}(\mathsf{path})\ \Leftrightarrow \ (\mid \mathsf{path}\mid \ \ge \ 1\ \land \ \operatorname{IdEq}(\mathsf{path}[0],\ \texttt{ultraviolet}))\ \lor \ (\exists \ i.\ \operatorname{ReservedGen}(\mathsf{path}[i]))
\end{array}
```

```math
<!--\ \mathsf{Source}:\ \texttt{"The `ultraviolet::...` namespace prefix is reserved for specification-defined features. User programs and vendor extensions MUST NOT use this namespace."}\ -\to 
```

```math
\begin{array}{l}
\mathsf{PrimTypeNames}\ =\ \{\texttt{i8},\ \texttt{i16},\ \texttt{i32},\ \texttt{i64},\ \texttt{i128},\ \texttt{u8},\ \texttt{u16},\ \texttt{u32},\ \texttt{u64},\ \texttt{u128},\ \texttt{f16},\ \texttt{f32},\ \texttt{f64},\ \texttt{bool},\ \texttt{char},\ \texttt{usize},\ \texttt{isize}\} \\
\mathsf{SpecialTypeNames}\ =\ \{\texttt{Self},\ \texttt{Drop},\ \texttt{Bitcopy},\ \texttt{Clone},\ \texttt{Eq},\ \texttt{Hash},\ \texttt{Hasher},\ \texttt{Iterator},\ \texttt{Step},\ \texttt{FfiSafe},\ \texttt{string},\ \texttt{bytes},\ \texttt{Modal},\ \texttt{Region},\ \texttt{RegionOptions},\ \texttt{CancelToken},\ \texttt{Context},\ \texttt{System},\ \texttt{Network},\ \texttt{ExecutionDomain},\ \texttt{CpuSet},\ \texttt{Priority},\ \texttt{Reactor}\} \\
\mathsf{AsyncTypeNames}\ =\ \{\texttt{Async},\ \texttt{Future},\ \texttt{Sequence},\ \texttt{Stream},\ \texttt{Pipe},\ \texttt{Exchange},\ \texttt{Tracked}\}
\end{array}
```

`Drop`, `Bitcopy`, `Clone`, and `FfiSafe` are reserved predicate names and are included in `SpecialTypeNames`. Reuse of these names at any scope is an error via `(Intro-Outer-Err)` (§7.2), since `UniverseBindings` is the outermost scope and contains these names.

```math
\begin{array}{l}
\mathsf{PrimTypeKeys}\ =\ \{\operatorname{IdKey}(x)\ \mid \ x\ \in \ \mathsf{PrimTypeNames}\} \\
\mathsf{SpecialTypeKeys}\ =\ \{\operatorname{IdKey}(x)\ \mid \ x\ \in \ \mathsf{SpecialTypeNames}\} \\
\mathsf{AsyncTypeKeys}\ =\ \{\operatorname{IdKey}(x)\ \mid \ x\ \in \ \mathsf{AsyncTypeNames}\}
\end{array}
```

```math
\operatorname{KeywordKey}(n)\ \Leftrightarrow \ \exists \ s.\ n\ =\ \operatorname{IdKey}(s)\ \land \ \operatorname{Keyword}(s)
```

### 7.2 Name Introduction and Module Validation

```math
\begin{array}{l}
\operatorname{dom}(S)\ =\ \operatorname{keys}(S) \\
\operatorname{Scopes}(\Gamma )\ =\ [S_{\mathsf{cur}}]\ \mathbin{++} \ \Gamma_{\mathsf{out}}  \\
\operatorname{InScope}(S,\ x)\ \Leftrightarrow \ \operatorname{IdKey}(x)\ \in \ \operatorname{dom}(S) \\
\operatorname{InOuter}(\Gamma ,\ x)\ \Leftrightarrow \ \exists \ S\ \in \ \Gamma_{\mathsf{out}} .\ \operatorname{InScope}(S,\ x)
\end{array}
```

**(Intro-Ok)**

```math
\begin{array}{l}
\lnot \ \operatorname{InScope}(S_{\mathsf{cur}},\ x)\quad \lnot \ \operatorname{InOuter}(\Gamma ,\ x)\quad \lnot \ \operatorname{ReservedId}(x)\quad \operatorname{Scopes}(\Gamma ')\ =\ [S_{\mathsf{cur}}[\operatorname{IdKey}(x)\ \mapsto \ \mathsf{ent}]]\ \mathbin{++} \ \Gamma_{\mathsf{out}} \quad \operatorname{Project}(\Gamma ')\ =\ \operatorname{Project}(\Gamma )\quad \operatorname{ResCtx}(\Gamma ')\ =\ \operatorname{ResCtx}(\Gamma ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Intro}(x,\ \mathsf{ent})\ \Downarrow \ \Gamma '
\end{array}
```

**(Intro-Dup)**

```math
\begin{array}{l}
\operatorname{InScope}(S_{\mathsf{cur}},\ x)\quad c\ =\ \operatorname{Code}(\mathsf{Intro}-\mathsf{Dup}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Intro}(x,\ \mathsf{ent})\ \Uparrow \ c
\end{array}
```

**(Intro-Outer-Err)**

```math
\begin{array}{l}
\lnot \ \operatorname{InScope}(S_{\mathsf{cur}},\ x)\quad \operatorname{InOuter}(\Gamma ,\ x)\quad c\ =\ \operatorname{Code}(\mathsf{Intro}-\mathsf{Outer}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Intro}(x,\ \mathsf{ent})\ \Uparrow \ c
\end{array}
```

**(Intro-Reserved-Gen-Err)**

```math
\begin{array}{l}
\operatorname{ReservedGen}(x)\quad c\ =\ \operatorname{Code}(\mathsf{Intro}-\mathsf{Reserved}-\mathsf{Gen}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Intro}(x,\ \mathsf{ent})\ \Uparrow \ c
\end{array}
```

**(Intro-Reserved-Ultraviolet-Err)**

```math
\begin{array}{l}
\operatorname{ReservedUltraviolet}(x)\quad c\ =\ \operatorname{Code}(\mathsf{Intro}-\mathsf{Reserved}-\mathsf{Ultraviolet}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Intro}(x,\ \mathsf{ent})\ \Uparrow \ c
\end{array}
```

When multiple `Intro` rules are simultaneously applicable, a conforming implementation MUST apply the first matching clause in the ordered priority list above.

**Rationale (non-normative).** A binding introduced in an outer scope cannot be reused as the name of a new binding in an inner scope. Users who wish to introduce a new binding under an already-taken name must choose a different name, or introduce their new binding in a separate sibling scope where the outer name is not visible. Users who wish to create a compile-time alternate name for an existing binding should use `using source as alias` (§11.2, §18.3).

#### UsingAlias

`UsingAlias(source_name, alias_name)` binds `alias_name` in the current scope to the same `Entity` that `source_name` resolves to. It introduces no new storage and does not copy the bound entity; the alias and the source are interchangeable references to the same compile-time entity.

**(Using-Alias-Ok)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Lookup}(\mathsf{source}_{\mathsf{name}})\ \Downarrow \ \mathsf{ent}\quad \lnot \ \operatorname{InScope}(S_{\mathsf{cur}},\ \mathsf{alias}_{\mathsf{name}})\quad \lnot \ \operatorname{InOuter}(\Gamma ,\ \mathsf{alias}_{\mathsf{name}})\quad \lnot \ \operatorname{ReservedId}(\mathsf{alias}_{\mathsf{name}})\quad \operatorname{Scopes}(\Gamma ')\ =\ [S_{\mathsf{cur}}[\operatorname{IdKey}(\mathsf{alias}_{\mathsf{name}})\ \mapsto \ \mathsf{ent}]]\ \mathbin{++} \ \Gamma_{\mathsf{out}} \quad \operatorname{Project}(\Gamma ')\ =\ \operatorname{Project}(\Gamma )\quad \operatorname{ResCtx}(\Gamma ')\ =\ \operatorname{ResCtx}(\Gamma ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{UsingAlias}(\mathsf{source}_{\mathsf{name}},\ \mathsf{alias}_{\mathsf{name}})\ \Downarrow \ \Gamma '
\end{array}
```

**(Using-Alias-Unresolved)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Lookup}(\mathsf{source}_{\mathsf{name}})\ \uparrow \quad c\ =\ \operatorname{Code}(\mathsf{Using}-\mathsf{Alias}-\mathsf{Unresolved}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{UsingAlias}(\mathsf{source}_{\mathsf{name}},\ \mathsf{alias}_{\mathsf{name}})\ \Uparrow \ c
\end{array}
```

**(Using-Alias-Dup)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Lookup}(\mathsf{source}_{\mathsf{name}})\ \Downarrow \ \mathsf{ent}\quad (\operatorname{InScope}(S_{\mathsf{cur}},\ \mathsf{alias}_{\mathsf{name}})\ \lor \ \operatorname{InOuter}(\Gamma ,\ \mathsf{alias}_{\mathsf{name}}))\quad c\ =\ \operatorname{Code}(\mathsf{Using}-\mathsf{Alias}-\mathsf{Dup}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{UsingAlias}(\mathsf{source}_{\mathsf{name}},\ \mathsf{alias}_{\mathsf{name}})\ \Uparrow \ c
\end{array}
```

**(Using-Alias-Reserved)**

```math
\begin{array}{l}
\operatorname{ReservedId}(\mathsf{alias}_{\mathsf{name}})\quad c\ =\ \operatorname{Code}(\mathsf{Using}-\mathsf{Alias}-\mathsf{Reserved}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{UsingAlias}(\mathsf{source}_{\mathsf{name}},\ \mathsf{alias}_{\mathsf{name}})\ \Uparrow \ c
\end{array}
```

When multiple `UsingAlias` rules are simultaneously applicable, a conforming implementation MUST apply the first matching clause in the ordered priority list above.

```math
\operatorname{Names}(N)\ =\ \operatorname{dom}(N)
```

**(Validate-Module-Ok)**

```math
\begin{array}{l}
\forall \ n\ \in \ \operatorname{Names}(N).\ \lnot \ \operatorname{KeywordKey}(n) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ValidateModuleNames}(N)\ \Downarrow \ \mathsf{ok}
\end{array}
```

**(Validate-Module-Keyword-Err)**

```math
\begin{array}{l}
\exists \ n\ \in \ \operatorname{Names}(N).\ \operatorname{KeywordKey}(n)\quad c\ =\ \operatorname{Code}(\mathsf{Validate}-\mathsf{Module}-\mathsf{Keyword}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ValidateModuleNames}(N)\ \Uparrow \ c
\end{array}
```

Reuse of a universe-scope name (primitive, special, or async type) at module scope is not a `ValidateModuleNames` concern — it is handled by `(Intro-Outer-Err)` when the module's bindings are introduced, because `UniverseBindings` is always in the outer scope chain at module scope.

### 7.3 Lookup and Qualified Resolution

```math
\begin{array}{l}
\operatorname{Scopes}(\Gamma )\ =\ [S_{1},\ \ldots ,\ S_{n}] \\
i\ =\ \mathsf{min}\{j\ \mid \ \operatorname{IdKey}(x)\ \in \ \operatorname{dom}(S_{j})\}
\end{array}
```

**(Lookup-Unqualified)**
i defined

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Lookup}(x)\ \Downarrow \ S_{i}[\operatorname{IdKey}(x)]
\end{array}
```

**(Lookup-Unqualified-None)**
i undefined

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Lookup}(x)\ \uparrow 
\end{array}
```

```math
\begin{array}{l}
\operatorname{ValueKind}(\mathsf{ent})\ \Leftrightarrow \ \mathsf{ent}.\mathsf{kind}\ =\ \mathsf{Value} \\
\operatorname{TypeKind}(\mathsf{ent})\ \Leftrightarrow \ \mathsf{ent}.\mathsf{kind}\ =\ \mathsf{Type} \\
\operatorname{ClassKind}(\mathsf{ent})\ \Leftrightarrow \ \mathsf{ent}.\mathsf{kind}\ =\ \mathsf{Class} \\
\operatorname{ModuleKind}(\mathsf{ent})\ \Leftrightarrow \ \mathsf{ent}.\mathsf{kind}\ =\ \mathsf{ModuleAlias} \\
\operatorname{RegionAlias}(\mathsf{ent})\ \Leftrightarrow \ \mathsf{ent}.\mathsf{source}\ =\ \mathsf{RegionAlias}
\end{array}
```

```math
\operatorname{RegionAliasName}(\Gamma ,\ x)\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{ResolveValueName}(x)\ \Downarrow \ \mathsf{ent}\ \land \ \operatorname{RegionAlias}(\mathsf{ent})
```

**(Resolve-Value-Name)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Lookup}(x)\ \Downarrow \ \mathsf{ent}\quad \operatorname{ValueKind}(\mathsf{ent}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveValueName}(x)\ \Downarrow \ \mathsf{ent}
\end{array}
```

**(Resolve-Type-Name)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Lookup}(x)\ \Downarrow \ \mathsf{ent}\quad \operatorname{TypeKind}(\mathsf{ent}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveTypeName}(x)\ \Downarrow \ \mathsf{ent}
\end{array}
```

**(Resolve-Class-Name)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Lookup}(x)\ \Downarrow \ \mathsf{ent}\quad \operatorname{ClassKind}(\mathsf{ent}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveClassName}(x)\ \Downarrow \ \mathsf{ent}
\end{array}
```

**(Resolve-Module-Name)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Lookup}(x)\ \Downarrow \ \mathsf{ent}\quad \operatorname{ModuleKind}(\mathsf{ent}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveModuleName}(x)\ \Downarrow \ \mathsf{ent}
\end{array}
```

```math
\begin{array}{l}
P\ =\ \operatorname{Project}(\Gamma ) \\
m\ =\ \operatorname{CurrentModule}(\Gamma )
\end{array}
```

VisibleModulePaths(m), VisibleModuleNames(m), AliasMap(m), ImportOk(m, path), ResolveImportPath(path), ResolveUsingPath(path), ImportNames(u), and UsingNames(u) are defined in §11.5.4. This chapter consumes those judgments but does not redefine them.

```math
\begin{array}{l}
\mathsf{ModulePaths}\ =\ \operatorname{VisibleModulePaths}(m) \\
\mathsf{ModuleNames}\ =\ \operatorname{VisibleModuleNames}(m) \\
\mathsf{Alias}\ =\ \operatorname{AliasMap}(m)
\end{array}
```

`ResolveModulePath` is defined canonically by §11.5.4 and consumed here by `ResolveQualified`.

**(Resolve-Qualified)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveModulePath}(\mathsf{path},\ \mathsf{Alias},\ \mathsf{ModuleNames})\ \Downarrow \ \mathsf{mp}\quad \operatorname{NameMap}(P,\ \mathsf{mp})[\operatorname{IdKey}(\mathsf{name})]\ =\ \mathsf{ent}\quad \Gamma \ \vdash \ \operatorname{CanAccess}(m,\ \operatorname{DeclOf}(\mathsf{mp},\ \mathsf{name}))\ \Downarrow \ \mathsf{ok}\quad \operatorname{K}(\mathsf{ent}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveQualified}(\mathsf{path},\ \mathsf{name},\ K)\ \Downarrow \ \mathsf{ent}
\end{array}
```

```math
K\ \in \ \{\mathsf{ValueKind},\ \mathsf{TypeKind},\ \mathsf{ClassKind},\ \mathsf{ModuleKind}\}
```

### 7.4 Visibility and Accessibility

```math
\begin{array}{l}
\operatorname{DeclOf}(\mathsf{mp},\ \mathsf{name})\ =\ \mathsf{it}\ \Leftrightarrow \ \operatorname{ModuleOf}(\mathsf{it})\ =\ \mathsf{mp}\ \land \ \mathsf{it}\ \ne \ \operatorname{ExternBlock}(\_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \land \ \operatorname{IdKey}(\mathsf{name})\ \in \ \operatorname{dom}(\operatorname{ItemBindings}(\mathsf{it},\ \mathsf{mp})) \\
\operatorname{DeclOf}(\mathsf{mp},\ \mathsf{name})\ =\ \mathsf{proc}\ \Leftrightarrow \ \operatorname{ExternBlockOf}(\mathsf{proc})\ =\ \mathsf{blk}\ \land \ \operatorname{ModuleOf}(\mathsf{blk})\ =\ \mathsf{mp}\ \land \ \operatorname{ProcName}(\mathsf{proc})\ =\ \mathsf{name}
\end{array}
```

```math
\begin{array}{l}
\operatorname{ModuleOf}(\mathsf{it})\ =\ p\ \Leftrightarrow \ \mathsf{it}\ \in \ \operatorname{ASTModule}(P,\ p).\mathsf{items} \\
\operatorname{ModuleOf}(\mathsf{proc})\ =\ \operatorname{ModuleOf}(\operatorname{ExternBlockOf}(\mathsf{proc})) \\
\operatorname{ExternBlockOf}(\mathsf{proc})\ =\ \mathsf{blk}\ \Leftrightarrow \ \exists \ p.\ \mathsf{blk}\ \in \ \operatorname{ASTModule}(P,\ p).\mathsf{items}\ \land \ \mathsf{proc}\ \in \ \mathsf{blk}.\mathsf{items} \\
\operatorname{ProcName}(\mathsf{proc})\ =\ \mathsf{name}\ \Leftrightarrow \ \mathsf{proc}\ =\ \operatorname{ExternProcDecl}(\_,\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_) \\
\operatorname{Vis}(\mathsf{it})\ =\ \mathsf{it}.\mathsf{vis} \\
\operatorname{SameAssembly}(m_{1},\ m_{2})\ \Leftrightarrow \ \operatorname{AsmOfModule}(m_{1})\ =\ \operatorname{AsmOfModule}(m_{2})
\end{array}
```

**(Access-Public)**

```math
\begin{array}{l}
\operatorname{Vis}(\mathsf{it})\ =\ \texttt{public} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CanAccess}(m,\ \mathsf{it})\ \Downarrow \ \mathsf{ok}
\end{array}
```

**(Access-Internal)**

```math
\begin{array}{l}
\operatorname{Vis}(\mathsf{it})\ =\ \texttt{internal}\quad \operatorname{SameAssembly}(\operatorname{ModuleOf}(\mathsf{it}),\ m) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CanAccess}(m,\ \mathsf{it})\ \Downarrow \ \mathsf{ok}
\end{array}
```

**(Access-Private)**

```math
\begin{array}{l}
\operatorname{Vis}(\mathsf{it})\ =\ \texttt{private}\quad \operatorname{ModuleOf}(\mathsf{it})\ =\ m \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CanAccess}(m,\ \mathsf{it})\ \Downarrow \ \mathsf{ok}
\end{array}
```

**(Access-Internal-Err)**

```math
\begin{array}{l}
\operatorname{Vis}(\mathsf{it})\ =\ \texttt{internal}\quad \lnot \ \operatorname{SameAssembly}(\operatorname{ModuleOf}(\mathsf{it}),\ m)\quad c\ =\ \operatorname{Code}(\mathsf{Access}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CanAccess}(m,\ \mathsf{it})\ \Uparrow \ c
\end{array}
```

**(Access-Err)**

```math
\begin{array}{l}
\operatorname{Vis}(\mathsf{it})\ =\ \texttt{private}\quad \operatorname{ModuleOf}(\mathsf{it})\ \ne \ m\quad c\ =\ \operatorname{Code}(\mathsf{Access}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CanAccess}(m,\ \mathsf{it})\ \Uparrow \ c
\end{array}
```

```math
\operatorname{TopLevelDecl}(\mathsf{it})\ \Leftrightarrow \ \mathsf{it}\ \in \ \operatorname{ASTModule}(P,\ \operatorname{ModuleOf}(\mathsf{it})).\mathsf{items}
```

**(TopLevelVis-Ok)**
TopLevelDecl(it)

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TopLevelVis}(\mathsf{it})\ \Downarrow \ \mathsf{ok}
\end{array}
```

### 7.5 Top-Level Name Collection

```math
\forall \ \mathsf{items}'.\ \operatorname{Permutation}(\mathsf{items}',\ \mathsf{items})\ \land \ \Gamma \ \vdash \ \operatorname{CollectNames}(\mathsf{items},\ p,\ \emptyset )\ \Downarrow \ N\ \Rightarrow \ \Gamma \ \vdash \ \operatorname{CollectNames}(\mathsf{items}',\ p,\ \emptyset )\ \Downarrow \ N
```

```math
\begin{array}{l}
\mathsf{BindKind}\ =\ \{\mathsf{Value},\ \mathsf{Type},\ \mathsf{Class},\ \mathsf{ModuleAlias}\} \\
\mathsf{BindSource}\ =\ \{\mathsf{Decl},\ \mathsf{Using},\ \mathsf{Import}\} \\
\mathsf{NameInfo}\ =\ \langle \mathsf{kind},\ \mathsf{origin},\ \mathsf{target}_{\mathsf{opt}},\ \mathsf{source}\rangle 
\end{array}
```

```math
\begin{array}{l}
\operatorname{NameMap}(P,\ \mathsf{mp})\ =\ N\ \Leftrightarrow \ \operatorname{ModuleMap}(P,\ \mathsf{mp})\ =\ M\ \land \ \Gamma \ \vdash \ \operatorname{CollectNames}(M)\ \Downarrow \ N \\
\operatorname{AliasMap}(m)\ =\ \{\ n\ \mapsto \ \mathsf{origin}\ \mid \ \operatorname{NameMap}(P,\ m)[n].\mathsf{kind}\ =\ \mathsf{ModuleAlias}\ \} \\
\operatorname{UsingMap}(m)\ =\ \{\ n\ \mapsto \ \langle k,\ \mathsf{origin},\ \mathsf{target}_{\mathsf{opt}}\rangle \ \mid \ \operatorname{NameMap}(P,\ m)[n].\mathsf{source}\ =\ \mathsf{Using}\ \land \ \operatorname{NameMap}(P,\ m)[n].\mathsf{kind}\ =\ k\ \land \ k\ \in \ \{\mathsf{Value},\ \mathsf{Type},\ \mathsf{Class}\}\ \} \\
\operatorname{UsingValueMap}(m)\ =\ \{\ n\ \mapsto \ \mathsf{origin}\ \mid \ \operatorname{NameMap}(P,\ m)[n].\mathsf{source}\ =\ \mathsf{Using}\ \land \ \operatorname{NameMap}(P,\ m)[n].\mathsf{kind}\ =\ \mathsf{Value}\ \} \\
\operatorname{UsingTypeMap}(m)\ =\ \{\ n\ \mapsto \ \mathsf{origin}\ \mid \ \operatorname{NameMap}(P,\ m)[n].\mathsf{source}\ =\ \mathsf{Using}\ \land \ \operatorname{NameMap}(P,\ m)[n].\mathsf{kind}\ \in \ \{\mathsf{Type},\ \mathsf{Class}\}\ \} \\
\operatorname{TypeMap}(m)\ =\ \{\ n\ \mapsto \ \mathsf{origin}\ \mid \ \operatorname{NameMap}(P,\ m)[n].\mathsf{kind}\ =\ \mathsf{Type}\ \} \\
\operatorname{ClassMap}(m)\ =\ \{\ n\ \mapsto \ \mathsf{origin}\ \mid \ \operatorname{NameMap}(P,\ m)[n].\mathsf{kind}\ =\ \mathsf{Class}\ \}
\end{array}
```

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{IdentifierPattern}(x))\ \Downarrow \ [x] \\
\Gamma \ \vdash \ \operatorname{PatNames}(\mathsf{WildcardPattern})\ \Downarrow \ [] \\
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{LiteralPattern}(\mathsf{lit}))\ \Downarrow \ []
\end{array}
```

```math
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{PatNames}(p_{i})\ \Downarrow \ N_{i} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{TuplePattern}([p_{1},\ \ldots ,\ p_{n}]))\ \Downarrow \ N_{1}\ \mathbin{++} \ \cdot \cdot \cdot \ \mathbin{++} \ N_{n}
\end{array}
```

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{PatNames}(p)\ \Downarrow \ N \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{PatNames}(\langle \mathsf{name},\ \mathsf{pattern}_{\mathsf{opt}}\ =\ p,\ \mathsf{span}\rangle )\ \Downarrow \ N
\end{array}
```

```math
\Gamma \ \vdash \ \operatorname{PatNames}(\langle \mathsf{name},\ \mathsf{pattern}_{\mathsf{opt}}\ =\ \bot ,\ \mathsf{span}\rangle )\ \Downarrow \ [\mathsf{name}]
```

```math
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{PatNames}(f_{i})\ \Downarrow \ N_{i} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{RecordPattern}(\_,\ [f_{1},\ \ldots ,\ f_{n}]))\ \Downarrow \ N_{1}\ \mathbin{++} \ \cdot \cdot \cdot \ \mathbin{++} \ N_{n}
\end{array}
```

```math
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{EnumPattern}(\_,\ \_,\ \bot ))\ \Downarrow \ []
```

```math
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{PatNames}(p_{i})\ \Downarrow \ N_{i} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{EnumPattern}(\_,\ \_,\ \operatorname{TuplePayloadPattern}([p_{1},\ \ldots ,\ p_{n}])))\ \Downarrow \ N_{1}\ \mathbin{++} \ \cdot \cdot \cdot \ \mathbin{++} \ N_{n}
\end{array}
```

```math
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{PatNames}(f_{i})\ \Downarrow \ N_{i} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{EnumPattern}(\_,\ \_,\ \operatorname{RecordPayloadPattern}([f_{1},\ \ldots ,\ f_{n}])))\ \Downarrow \ N_{1}\ \mathbin{++} \ \cdot \cdot \cdot \ \mathbin{++} \ N_{n}
\end{array}
```

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{PatNames}(p_{l})\ \Downarrow \ N_{l}\quad \Gamma \ \vdash \ \operatorname{PatNames}(p_{h})\ \Downarrow \ N_{h} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{RangePattern}(\_,\ p_{l},\ p_{h}))\ \Downarrow \ N_{l}\ \mathbin{++} \ N_{h}
\end{array}
```

```math
\begin{array}{l}
\mathsf{AllModuleNames}\ =\ \{\ \operatorname{StringOfPath}(p)\ \mid \ p\ \in \ \operatorname{AllModulePaths}(P)\ \} \\
\operatorname{VisibleModuleNames}(m)\ =\ \{\ \operatorname{StringOfPath}(p)\ \mid \ p\ \in \ \operatorname{VisibleModulePaths}(m)\ \} \\
\operatorname{Last}([c_{1},\ \ldots ,\ c_{n}])\ =\ c_{n}\quad \mathsf{if}\ n\ \ge \ 1 \\
\operatorname{IsModulePath}(\mathsf{path})\ \Leftrightarrow \ \operatorname{StringOfPath}(\mathsf{path})\ \in \ \mathsf{AllModuleNames} \\
\operatorname{SplitLast}(\mathsf{path})\ =\ (\mathsf{mp},\ \mathsf{name})\ \Leftrightarrow \ \mathsf{path}\ =\ \mathsf{mp}\ \mathbin{++} \ [\mathsf{name}]\ \land \ \mid \mathsf{path}\mid \ \ge \ 2 \\
\operatorname{ModuleByPath}(P,\ p)\ =\ m\ \Leftrightarrow \ \operatorname{ASTModule}(P,\ p)\ =\ m
\end{array}
```

```math
\operatorname{ItemNames}(\mathsf{mp})\ =\ \{\ n\ \mid \ \operatorname{NameMap}(P,\ \mathsf{mp})[n].\mathsf{kind}\ \in \ \{\mathsf{Value},\ \mathsf{Type},\ \mathsf{Class}\}\ \}
```

```math
\begin{array}{l}
\operatorname{UsingSpecName}(\langle \mathsf{name},\ \mathsf{alias}_{\mathsf{opt}}\rangle )\ = \\
\ \mathsf{alias}_{\mathsf{opt}}\quad \mathsf{if}\ \mathsf{alias}_{\mathsf{opt}}\ \ne \ \bot  \\
\ \mathsf{name}\quad \mathsf{otherwise}
\end{array}
```

```math
\operatorname{UsingSpecNames}([s_{1},\ \ldots ,\ s_{n}])\ =\ [\operatorname{UsingSpecName}(s_{1}),\ \ldots ,\ \operatorname{UsingSpecName}(s_{n})]
```

```math
\Gamma \ \vdash \ \operatorname{DeclNames}([],\ p)\ \Downarrow \ \emptyset 
```

**(DeclNames-Using)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{DeclNames}(\mathsf{rest},\ p)\ \Downarrow \ D \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{DeclNames}(\langle \mathsf{UsingDecl},\ \_,\ \_,\ \_,\ \_\rangle \ \mathbin{::} \ \mathsf{rest},\ p)\ \Downarrow \ D
\end{array}
```

**(DeclNames-Item)**

```math
\begin{array}{l}
\mathsf{it}\ \ne \ \langle \mathsf{UsingDecl},\ \_,\ \_,\ \_,\ \_\rangle \quad \Gamma \ \vdash \ \operatorname{ItemBindings}(\mathsf{it},\ p)\ \Downarrow \ B\quad \Gamma \ \vdash \ \operatorname{DeclNames}(\mathsf{rest},\ p)\ \Downarrow \ D \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{DeclNames}(\mathsf{it}\ \mathbin{::} \ \mathsf{rest},\ p)\ \Downarrow \ \operatorname{Names}(B)\ \cup \ D
\end{array}
```

```math
\operatorname{DeclNames}(m)\ =\ \operatorname{DeclNames}(m.\mathsf{items},\ m.\mathsf{path})
```

`ResolveImportPath`, `ResolveUsingPath`, `ImportNames`, `UsingNames`, and `ImportOk` remain the canonical judgments of §11.5.4.

**(Bind-Procedure)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ItemBindings}(\langle \mathsf{ProcedureDecl},\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_,\ \_\rangle ,\ p)\ \Downarrow \ [(\mathsf{name},\ \langle \mathsf{Value},\ p,\ \bot ,\ \mathsf{Decl}\rangle )]
\end{array}
```

**(Bind-ExternBlock)**

```math
\begin{array}{l}
B\ =\ [(\mathsf{name}_{i},\ \langle \mathsf{Value},\ p,\ \bot ,\ \mathsf{Decl}\rangle )\ \mid \ \operatorname{ExternProcDecl}(\_,\ \_,\ \mathsf{name}_{i},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \in \ \mathsf{items}] \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ItemBindings}(\langle \mathsf{ExternBlock},\ \_,\ \_,\ \_,\ \mathsf{items},\ \_,\ \_\rangle ,\ p)\ \Downarrow \ B
\end{array}
```

**(Bind-Record)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ItemBindings}(\langle \mathsf{RecordDecl},\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_\rangle ,\ p)\ \Downarrow \ [(\mathsf{name},\ \langle \mathsf{Type},\ p,\ \bot ,\ \mathsf{Decl}\rangle )]
\end{array}
```

**(Bind-Enum)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ItemBindings}(\langle \mathsf{EnumDecl},\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_\rangle ,\ p)\ \Downarrow \ [(\mathsf{name},\ \langle \mathsf{Type},\ p,\ \bot ,\ \mathsf{Decl}\rangle )]
\end{array}
```

**(Bind-Class)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ItemBindings}(\langle \mathsf{ClassDecl},\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_\rangle ,\ p)\ \Downarrow \ [(\mathsf{name},\ \langle \mathsf{Class},\ p,\ \bot ,\ \mathsf{Decl}\rangle )]
\end{array}
```

**(Bind-TypeAlias)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ItemBindings}(\langle \mathsf{TypeAliasDecl},\ \_,\ \mathsf{name},\ \_,\ \_,\ \_\rangle ,\ p)\ \Downarrow \ [(\mathsf{name},\ \langle \mathsf{Type},\ p,\ \bot ,\ \mathsf{Decl}\rangle )]
\end{array}
```

**(Bind-Static)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{PatNames}(\mathsf{pat})\ \Downarrow \ N \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ItemBindings}(\langle \mathsf{StaticDecl},\ \_,\ \_,\ \langle \mathsf{pat},\ \_,\ \_,\ \_,\ \_\rangle ,\ \_,\ \_\rangle ,\ p)\ \Downarrow \ [(n,\ \langle \mathsf{Value},\ p,\ \bot ,\ \mathsf{Decl}\rangle )\ \mid \ n\ \in \ N]
\end{array}
```

**(Bind-Import)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ImportNames}(u)\ \Downarrow \ B \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ItemBindings}(u,\ p)\ \Downarrow \ B
\end{array}
```

**(Bind-Import-Err)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ImportNames}(u)\ \Uparrow \ c \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ItemBindings}(u,\ p)\ \Uparrow \ c
\end{array}
```

**(Bind-Using)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{UsingNames}(u)\ \Downarrow \ B \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ItemBindings}(u,\ p)\ \Downarrow \ B
\end{array}
```

**(Bind-Using-Err)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{UsingNames}(u)\ \Uparrow \ c \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ItemBindings}(u,\ p)\ \Uparrow \ c
\end{array}
```

**(Bind-ErrorItem)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ItemBindings}(\operatorname{ErrorItem}(\_),\ p)\ \Downarrow \ []
\end{array}
```

**(Collect-Ok)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CollectNames}(\mathsf{items},\ p,\ \emptyset )\ \Downarrow \ N \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CollectNames}(M)\ \Downarrow \ N
\end{array}
```

**(Collect-Scan)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ItemBindings}(\mathsf{it},\ p)\ \Downarrow \ B\quad \operatorname{DisjointNames}(B,\ N)\quad \operatorname{NoDup}(B)\quad \Gamma \ \vdash \ \operatorname{CollectNames}(\mathsf{rest},\ p,\ N\ \cup \ B)\ \Downarrow \ N' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CollectNames}(\mathsf{it}\ \mathbin{::} \ \mathsf{rest},\ p,\ N)\ \Downarrow \ N'
\end{array}
```

**(Collect-Using-Import-Dup)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ItemBindings}(\mathsf{it},\ p)\ \Downarrow \ B\quad (\lnot \ \operatorname{DisjointNames}(B,\ N)\ \lor \ \lnot \ \operatorname{NoDup}(B))\quad \operatorname{UsingImportConflict}(B,\ N)\quad c\ =\ \operatorname{Code}(\mathsf{Import}-\mathsf{Using}-\mathsf{Name}-\mathsf{Conflict}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CollectNames}(\mathsf{it}\ \mathbin{::} \ \mathsf{rest},\ p,\ N)\ \Uparrow \ c
\end{array}
```

**(Collect-Dup)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ItemBindings}(\mathsf{it},\ p)\ \Downarrow \ B\quad (\lnot \ \operatorname{DisjointNames}(B,\ N)\ \lor \ \lnot \ \operatorname{NoDup}(B))\quad \lnot \ \operatorname{UsingImportConflict}(B,\ N)\quad c\ =\ \operatorname{Code}(\mathsf{Collect}-\mathsf{Dup}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CollectNames}(\mathsf{it}\ \mathbin{::} \ \mathsf{rest},\ p,\ N)\ \Uparrow \ c
\end{array}
```

**(Collect-Err)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ItemBindings}(\mathsf{it},\ p)\ \Uparrow \ c \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CollectNames}(\mathsf{it}\ \mathbin{::} \ \mathsf{rest},\ p,\ N)\ \Uparrow \ c
\end{array}
```

```math
\begin{array}{l}
\operatorname{Names}(B)\ =\ \{\ n\ \mid \ (n,\ \_)\ \in \ B\ \} \\
\operatorname{NoDup}(B)\ \Leftrightarrow \ \operatorname{Distinct}(\operatorname{Names}(B)) \\
\operatorname{DisjointNames}(B,\ N)\ \Leftrightarrow \ \operatorname{Names}(B)\ \cap \ \operatorname{dom}(N)\ =\ \emptyset  \\
N\ \cup \ B\ =\ \{\ (n,\ v)\ \mid \ (n,\ v)\ \in \ N\ \lor \ (n,\ v)\ \in \ B\ \} \\
\operatorname{NameInfoOf}(B,\ n)\ =\ \mathsf{info}\ \Leftrightarrow \ (n,\ \mathsf{info})\ \in \ B \\
\operatorname{NameSource}(B,\ n)\ =\ \mathsf{src}\ \Leftrightarrow \ \operatorname{NameInfoOf}(B,\ n)\ =\ \mathsf{info}\ \land \ \mathsf{info}.\mathsf{source}\ =\ \mathsf{src} \\
\operatorname{NameSource}(N,\ n)\ =\ \mathsf{src}\ \Leftrightarrow \ n\ \in \ \operatorname{dom}(N)\ \land \ N[n].\mathsf{source}\ =\ \mathsf{src} \\
\operatorname{UsingImportConflict}(B,\ N)\ \Leftrightarrow \ \exists \ n.\ n\ \in \ \operatorname{Names}(B)\ \cap \ \operatorname{dom}(N)\ \land \ (\operatorname{NameSource}(B,\ n)\ \in \ \{\mathsf{Using},\ \mathsf{Import}\}\ \lor \ \operatorname{NameSource}(N,\ n)\ \in \ \{\mathsf{Using},\ \mathsf{Import}\})
\end{array}
```

```math
\mathsf{NamesState}\ =\ \{\operatorname{NamesStart}(M),\ \operatorname{NamesScan}(\mathsf{items},\ p,\ N),\ \operatorname{NamesDone}(N),\ \operatorname{Error}(\mathsf{code})\}
```

**(Names-Start)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\langle \operatorname{NamesStart}(M)\rangle \ \to \ \langle \operatorname{NamesScan}(M.\mathsf{items},\ M.\mathsf{path},\ \emptyset )\rangle 
\end{array}
```

**(Names-Step)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ItemBindings}(\mathsf{it},\ p)\ \Downarrow \ B\quad \operatorname{DisjointNames}(B,\ N)\quad \operatorname{NoDup}(B) \\
\rule{18em}{0.4pt} \\
\langle \operatorname{NamesScan}(\mathsf{it}\ \mathbin{::} \ \mathsf{rest},\ p,\ N)\rangle \ \to \ \langle \operatorname{NamesScan}(\mathsf{rest},\ p,\ N\ \cup \ B)\rangle 
\end{array}
```

**(Names-Step-Using-Import-Dup)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ItemBindings}(\mathsf{it},\ p)\ \Downarrow \ B\quad (\lnot \ \operatorname{DisjointNames}(B,\ N)\ \lor \ \lnot \ \operatorname{NoDup}(B))\quad \operatorname{UsingImportConflict}(B,\ N) \\
\rule{18em}{0.4pt} \\
\langle \operatorname{NamesScan}(\mathsf{it}\ \mathbin{::} \ \mathsf{rest},\ p,\ N)\rangle \ \to \ \langle \operatorname{Error}(\operatorname{Code}(\mathsf{Import}-\mathsf{Using}-\mathsf{Name}-\mathsf{Conflict}))\rangle 
\end{array}
```

**(Names-Step-Dup)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ItemBindings}(\mathsf{it},\ p)\ \Downarrow \ B\quad (\lnot \ \operatorname{DisjointNames}(B,\ N)\ \lor \ \lnot \ \operatorname{NoDup}(B))\quad \lnot \ \operatorname{UsingImportConflict}(B,\ N) \\
\rule{18em}{0.4pt} \\
\langle \operatorname{NamesScan}(\mathsf{it}\ \mathbin{::} \ \mathsf{rest},\ p,\ N)\rangle \ \to \ \langle \operatorname{Error}(\operatorname{Code}(\mathsf{Names}-\mathsf{Step}-\mathsf{Dup}))\rangle 
\end{array}
```

**(Names-Step-Err)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ItemBindings}(\mathsf{it},\ p)\ \Uparrow \ c \\
\rule{18em}{0.4pt} \\
\langle \operatorname{NamesScan}(\mathsf{it}\ \mathbin{::} \ \mathsf{rest},\ p,\ N)\rangle \ \to \ \langle \operatorname{Error}(c)\rangle 
\end{array}
```

**(Names-Done)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\langle \operatorname{NamesScan}([],\ p,\ N)\rangle \ \to \ \langle \operatorname{NamesDone}(N)\rangle 
\end{array}
```

### 7.6 Qualified Disambiguation

ResolveQualifiedForm : Expr ⇀ Expr
ResolveArgs : [Arg] ⇀ [Arg]
ResolveFieldInits : [FieldInit] ⇀ [FieldInit]

```math
\begin{array}{l}
\mathsf{ResolveRecordPath}\ :\ \mathsf{Path}\ \times \ \mathsf{Identifier}\ \rightharpoonup \ \mathsf{Path} \\
\mathsf{ResolveEnumUnit}\ :\ \mathsf{Path}\ \times \ \mathsf{Identifier}\ \rightharpoonup \ \mathsf{Path} \\
\mathsf{ResolveEnumTuple}\ :\ \mathsf{Path}\ \times \ \mathsf{Identifier}\ \rightharpoonup \ \mathsf{Path} \\
\mathsf{ResolveEnumRecord}\ :\ \mathsf{Path}\ \times \ \mathsf{Identifier}\ \rightharpoonup \ \mathsf{Path} \\
\mathsf{ResolvePathJudg}\ =\ \{\mathsf{ResolveRecordPath},\ \mathsf{ResolveEnumUnit},\ \mathsf{ResolveEnumTuple},\ \mathsf{ResolveEnumRecord}\}
\end{array}
```

**(ResolveArgs-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveArgs}([])\ \Downarrow \ []
\end{array}
```

**(ResolveArgs-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e'\quad \Gamma \ \vdash \ \operatorname{ResolveArgs}(\mathsf{rest})\ \Downarrow \ \mathsf{rest}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveArgs}([\langle \mathsf{moved},\ e,\ \mathsf{span}\rangle ]\ \mathbin{++} \ \mathsf{rest})\ \Downarrow \ [\langle \mathsf{moved},\ e',\ \mathsf{span}\rangle ]\ \mathbin{++} \ \mathsf{rest}'
\end{array}
```

**(ResolveFieldInits-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveFieldInits}([])\ \Downarrow \ []
\end{array}
```

**(ResolveFieldInits-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e'\quad \Gamma \ \vdash \ \operatorname{ResolveFieldInits}(\mathsf{rest})\ \Downarrow \ \mathsf{rest}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveFieldInits}([\langle f,\ e\rangle ]\ \mathbin{++} \ \mathsf{rest})\ \Downarrow \ [\langle f,\ e'\rangle ]\ \mathbin{++} \ \mathsf{rest}'
\end{array}
```

**(Resolve-RecordPath)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path}\ \mathbin{++} \ [\mathsf{name}])\ \Downarrow \ p\quad \operatorname{RecordDecl}(p)\ =\ R \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveRecordPath}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p
\end{array}
```

**(Resolve-EnumUnit)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ p\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{VariantPayload}(E,\ \mathsf{name})\ =\ \bot  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveEnumUnit}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p
\end{array}
```

**(Resolve-EnumTuple)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ p\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{VariantPayload}(E,\ \mathsf{name})\ =\ \operatorname{TuplePayload}(\_) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveEnumTuple}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p
\end{array}
```

**(Resolve-EnumRecord)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ p\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{VariantPayload}(E,\ \mathsf{name})\ =\ \operatorname{RecordPayload}(\_) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveEnumRecord}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p
\end{array}
```

```math
\operatorname{BuiltinValuePath}(\mathsf{path},\ \mathsf{name})\ \Leftrightarrow \ \operatorname{BuiltinModalStaticSig}(\mathsf{path},\ \mathsf{name})\ \mathsf{defined}
```

**(ResolveQual-Name-Builtin)**
BuiltinValuePath(path, name)

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveQualifiedForm}(\operatorname{QualifiedName}(\mathsf{path},\ \mathsf{name}))\ \Downarrow \ \operatorname{Path}(\mathsf{path},\ \mathsf{name})
\end{array}
```

**(ResolveQual-Name-Value)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveQualified}(\mathsf{path},\ \mathsf{name},\ \mathsf{ValueKind})\ \Downarrow \ \mathsf{ent}\quad \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ \mathsf{mp}\quad \mathsf{name}'\ =\ (\mathsf{ent}.\mathsf{target}_{\mathsf{opt}}\ \mathsf{if}\ \mathsf{present},\ \mathsf{else}\ \mathsf{name})\quad \operatorname{PathOfModule}(\mathsf{mp})\ =\ \mathsf{path}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveQualifiedForm}(\operatorname{QualifiedName}(\mathsf{path},\ \mathsf{name}))\ \Downarrow \ \operatorname{Path}(\mathsf{path}',\ \mathsf{name}')
\end{array}
```

**(ResolveQual-Name-Record)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveRecordPath}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p\quad \operatorname{SplitLast}(p)\ =\ (\mathsf{mp},\ \mathsf{name}') \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveQualifiedForm}(\operatorname{QualifiedName}(\mathsf{path},\ \mathsf{name}))\ \Downarrow \ \operatorname{Path}(\mathsf{mp},\ \mathsf{name}')
\end{array}
```

**(ResolveQual-Name-Enum)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveQualified}(\mathsf{path},\ \mathsf{name},\ \mathsf{ValueKind})\ \uparrow \quad \Gamma \ \vdash \ \operatorname{ResolveRecordPath}(\mathsf{path},\ \mathsf{name})\ \uparrow \quad \Gamma \ \vdash \ \operatorname{ResolveEnumUnit}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveQualifiedForm}(\operatorname{QualifiedName}(\mathsf{path},\ \mathsf{name}))\ \Downarrow \ \operatorname{EnumLiteral}(\operatorname{FullPath}(p,\ \mathsf{name}),\ \bot )
\end{array}
```

**(ResolveQual-Name-Err)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveQualified}(\mathsf{path},\ \mathsf{name},\ \mathsf{ValueKind})\ \uparrow \quad \Gamma \ \vdash \ \operatorname{ResolveRecordPath}(\mathsf{path},\ \mathsf{name})\ \uparrow \quad \Gamma \ \vdash \ \operatorname{ResolveEnumUnit}(\mathsf{path},\ \mathsf{name})\ \uparrow \quad c\ =\ \operatorname{Code}(\mathsf{ResolveExpr}-\mathsf{Ident}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveQualifiedForm}(\operatorname{QualifiedName}(\mathsf{path},\ \mathsf{name}))\ \Uparrow \ c
\end{array}
```

### 7.7 Shared Resolution Helpers and Resolution Pass

```math
\begin{array}{l}
P\ =\ \operatorname{Project}(\Gamma ) \\
m\ =\ \operatorname{CurrentModule}(\Gamma ) \\
M\ =\ \operatorname{ASTModule}(P,\ m) \\
\mathsf{ResolveInputs}\ =\ \langle M,\ \mathsf{ModulePaths},\ \{\ \operatorname{NameMap}(P,\ p)\ \mid \ p\ \in \ \mathsf{ModulePaths}\ \}\rangle  \\
\mathsf{ResolveOutputs}\ =\ \langle M'\rangle  \\
\mathsf{PathOfModuleRef}\ =\ \{\texttt{"3.4.1"}\}
\end{array}
```

```math
\begin{array}{l}
\operatorname{TypeParamBindings}(\mathsf{params})\ =\ \{\ \operatorname{IdKey}(p.\mathsf{name})\ \mapsto \ \langle \mathsf{Type},\ \bot ,\ \bot ,\ \mathsf{Decl}\rangle \ \mid \ p\ \in \ \mathsf{params}\ \} \\
\operatorname{TypeParamBindings}(\bot )\ =\ \{\}
\end{array}
```

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveGenericParamsOpt}(\bot )\ \Downarrow \ \bot  \\
\Gamma \ \vdash \ \operatorname{ResolvePredicateClauseOpt}(\bot )\ \Downarrow \ \bot  \\
\Gamma \ \vdash \ \operatorname{ResolveContractClauseOpt}(\bot )\ \Downarrow \ \bot  \\
\Gamma \ \vdash \ \operatorname{ResolveInvariantOpt}(\bot )\ \Downarrow \ \bot  \\
\Gamma \ \vdash \ \operatorname{ResolveTypeOpt}(\bot )\ \Downarrow \ \bot  \\
\Gamma \ \vdash \ \operatorname{ResolveExprOpt}(\bot )\ \Downarrow \ \bot  \\
\operatorname{ResolveExprOpt}(\bot )\ =\ \bot  \\
\operatorname{ResolveExprOpt}(e)\ =\ e'\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e'
\end{array}
```

**(ResolveGenericParamsOpt-Yes)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypeParamList}(\mathsf{params})\ \Downarrow \ \mathsf{params}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveGenericParamsOpt}(\mathsf{params})\ \Downarrow \ \mathsf{params}'
\end{array}
```

**(ResolveTypeParam)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveClassPathList}(\mathsf{bounds})\ \Downarrow \ \mathsf{bounds}'\quad \Gamma \ \vdash \ \operatorname{ResolveTypeOpt}(\mathsf{default}_{\mathsf{opt}})\ \Downarrow \ \mathsf{default}_{\mathsf{opt}}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveTypeParam}(\langle \mathsf{name},\ \mathsf{bounds},\ \mathsf{default}_{\mathsf{opt}},\ \mathsf{variance}\rangle )\ \Downarrow \ \langle \mathsf{name},\ \mathsf{bounds}',\ \mathsf{default}_{\mathsf{opt}}',\ \mathsf{variance}\rangle 
\end{array}
```

```math
\Gamma \ \vdash \ \operatorname{ResolveTypeParamList}([])\ \Downarrow \ []
```

**(ResolveTypeParamList-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypeParam}(p)\ \Downarrow \ p'\quad \Gamma \ \vdash \ \operatorname{ResolveTypeParamList}(\mathsf{ps})\ \Downarrow \ \mathsf{ps}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveTypeParamList}(p\ \mathbin{::} \ \mathsf{ps})\ \Downarrow \ p'\ \mathbin{::} \ \mathsf{ps}'
\end{array}
```

**(ResolvePredicateClauseOpt-Yes)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePredicateReqList}(\mathsf{preds})\ \Downarrow \ \mathsf{preds}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolvePredicateClauseOpt}(\mathsf{preds})\ \Downarrow \ \mathsf{preds}'
\end{array}
```

```math
\Gamma \ \vdash \ \operatorname{ResolvePredicateReqList}([])\ \Downarrow \ []
```

**(ResolvePredicateReq-Predicate)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveType}(\mathsf{ty})\ \Downarrow \ \mathsf{ty}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolvePredicateReq}(\operatorname{PredicateReq}(\mathsf{pred},\ \mathsf{ty}))\ \Downarrow \ \operatorname{PredicateReq}(\mathsf{pred},\ \mathsf{ty}')
\end{array}
```

**(ResolvePredicateReqList-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePredicateReq}(p)\ \Downarrow \ p'\quad \Gamma \ \vdash \ \operatorname{ResolvePredicateReqList}(\mathsf{ps})\ \Downarrow \ \mathsf{ps}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolvePredicateReqList}(p\ \mathbin{::} \ \mathsf{ps})\ \Downarrow \ p'\ \mathbin{::} \ \mathsf{ps}'
\end{array}
```

**(ResolveContractClauseOpt-Yes)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExprOpt}(\mathsf{pre})\ \Downarrow \ \mathsf{pre}'\quad \Gamma \ \vdash \ \operatorname{ResolveExprOpt}(\mathsf{post})\ \Downarrow \ \mathsf{post}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveContractClauseOpt}(\operatorname{ContractClause}(\mathsf{pre},\ \mathsf{post}))\ \Downarrow \ \operatorname{ContractClause}(\mathsf{pre}',\ \mathsf{post}')
\end{array}
```

**(ResolveInvariantOpt-Yes)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{inv})\ \Downarrow \ \mathsf{inv}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveInvariantOpt}(\mathsf{inv})\ \Downarrow \ \mathsf{inv}'
\end{array}
```

**(ResolveTypePath-Ident)**
|path| = 1    Γ ⊢ ResolveTypeName(path[0]) ⇓ ent    ent.origin_opt = p    name = (ent.target_opt if present, else path[0])

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ \operatorname{FullPath}(\operatorname{PathOfModule}(p),\ \mathsf{name})
\end{array}
```

**(ResolveTypePath-Ident-Local)**
|path| = 1    Γ ⊢ ResolveTypeName(path[0]) ⇓ ent    ent.origin_opt = ⊥    name = (ent.target_opt if present, else path[0])

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ [\mathsf{name}]
\end{array}
```

**(ResolveTypePath-Qual)**
|path| ≥ 2    path = p ++ [name]    Γ ⊢ ResolveQualified(p, name, TypeKind) ⇓ ent    ent.origin_opt = mp    name' = (ent.target_opt if present, else name)

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ \operatorname{FullPath}(\operatorname{PathOfModule}(\mathsf{mp}),\ \mathsf{name}')
\end{array}
```

```math
\operatorname{LocalTypePath}(\mathsf{path})\ \Leftrightarrow \ \mid \mathsf{path}\mid \ =\ 1\ \land \ \Gamma \ \vdash \ \operatorname{ResolveTypeName}(\mathsf{path}[0])\ \Downarrow \ \mathsf{ent}\ \land \ \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ \bot 
```

**(ResolveClassPath-Ident)**
|path| = 1    Γ ⊢ ResolveClassName(path[0]) ⇓ ent    ent.origin_opt = p    name = (ent.target_opt if present, else path[0])

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveClassPath}(\mathsf{path})\ \Downarrow \ \operatorname{FullPath}(\operatorname{PathOfModule}(p),\ \mathsf{name})
\end{array}
```

**(ResolveClassPath-Qual)**
|path| ≥ 2    path = p ++ [name]    Γ ⊢ ResolveQualified(p, name, ClassKind) ⇓ ent    ent.origin_opt = mp    name' = (ent.target_opt if present, else name)

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveClassPath}(\mathsf{path})\ \Downarrow \ \operatorname{FullPath}(\operatorname{PathOfModule}(\mathsf{mp}),\ \mathsf{name}')
\end{array}
```

**(ResolveType-Path)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ \mathsf{path}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveType}(\operatorname{TypePath}(\mathsf{path}))\ \Downarrow \ \operatorname{TypePath}(\mathsf{path}')
\end{array}
```

**(ResolveType-Dynamic)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveClassPath}(\mathsf{path})\ \Downarrow \ \mathsf{path}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveType}(\operatorname{TypeDynamic}(\mathsf{path}))\ \Downarrow \ \operatorname{TypeDynamic}(\mathsf{path}')
\end{array}
```

**(ResolveType-Apply)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ \mathsf{path}'\quad \Gamma \ \vdash \ \operatorname{ResolveTypeList}(\mathsf{args})\ \Downarrow \ \mathsf{args}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveType}(\operatorname{TypeApply}(\mathsf{path},\ \mathsf{args}))\ \Downarrow \ \operatorname{TypeApply}(\mathsf{path}',\ \mathsf{args}')
\end{array}
```

**(ResolveType-ModalState)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveModalRef}(\mathsf{modal}_{\mathsf{ref}})\ \Downarrow \ \mathsf{modal}_{\mathsf{ref}}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveType}(\operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ \mathsf{state}))\ \Downarrow \ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}}',\ \mathsf{state})
\end{array}
```

```math
\begin{array}{l}
\operatorname{ResolveModalRef}(\mathsf{modal}_{\mathsf{ref}})\ \Downarrow \ \mathsf{modal}_{\mathsf{ref}}'\ \Leftrightarrow  \\
\ (\mathsf{modal}_{\mathsf{ref}}\ =\ \operatorname{TypePath}(\mathsf{path})\ \land \ \Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ \mathsf{path}'\ \land \ \mathsf{modal}_{\mathsf{ref}}'\ =\ \operatorname{TypePath}(\mathsf{path}'))\ \lor  \\
\ (\mathsf{modal}_{\mathsf{ref}}\ =\ \operatorname{TypeApply}(\mathsf{path},\ \mathsf{args})\ \land \ \Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{path})\ \Downarrow \ \mathsf{path}'\ \land \ \Gamma \ \vdash \ \operatorname{ResolveTypeList}(\mathsf{args})\ \Downarrow \ \mathsf{args}'\ \land \ \mathsf{modal}_{\mathsf{ref}}'\ =\ \operatorname{TypeApply}(\mathsf{path}',\ \mathsf{args}'))
\end{array}
```

**(ResolveType-Hom)**

```math
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{ResolveType}(t_{i})\ \Downarrow \ t_{i}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveType}(\operatorname{C}(t_{1},\ \ldots ,\ t_{n}))\ \Downarrow \ \operatorname{C}(t_{1}',\ \ldots ,\ t_{n}')
\end{array}
```

```math
\Gamma \ \vdash \ \operatorname{ResolveTypeList}([])\ \Downarrow \ []
```

**(ResolveTypeList-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveType}(t)\ \Downarrow \ t'\quad \Gamma \ \vdash \ \operatorname{ResolveTypeList}(\mathsf{ts})\ \Downarrow \ \mathsf{ts}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveTypeList}(t\ \mathbin{::} \ \mathsf{ts})\ \Downarrow \ t'\ \mathbin{::} \ \mathsf{ts}'
\end{array}
```

**(ResolveParam)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveType}(p.\mathsf{type})\ \Downarrow \ \mathsf{ty}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveParam}(p)\ \Downarrow \ p[\mathsf{type}\ =\ \mathsf{ty}']
\end{array}
```

```math
\Gamma \ \vdash \ \operatorname{ResolveParams}([])\ \Downarrow \ []
```

**(ResolveParams-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveParam}(p)\ \Downarrow \ p'\quad \Gamma \ \vdash \ \operatorname{ResolveParams}(\mathsf{ps})\ \Downarrow \ \mathsf{ps}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveParams}(p\ \mathbin{::} \ \mathsf{ps})\ \Downarrow \ p'\ \mathbin{::} \ \mathsf{ps}'
\end{array}
```

ResolvePattern : Pattern ⇀ Pattern

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePattern}(\mathsf{WildcardPattern})\ \Downarrow \ \mathsf{WildcardPattern} \\
\Gamma \ \vdash \ \operatorname{ResolvePattern}(\operatorname{IdentifierPattern}(x))\ \Downarrow \ \operatorname{IdentifierPattern}(x) \\
\Gamma \ \vdash \ \operatorname{ResolvePattern}(\operatorname{LiteralPattern}(\mathsf{lit}))\ \Downarrow \ \operatorname{LiteralPattern}(\mathsf{lit})
\end{array}
```

**(ResolvePat-Tuple)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePatternList}(\mathsf{ps})\ \Downarrow \ \mathsf{ps}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolvePattern}(\operatorname{TuplePattern}(\mathsf{ps}))\ \Downarrow \ \operatorname{TuplePattern}(\mathsf{ps}')
\end{array}
```

**(ResolvePat-Record)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{tp})\ \Downarrow \ \mathsf{tp}'\quad \Gamma \ \vdash \ \operatorname{ResolveFieldPatternList}(\mathsf{fs})\ \Downarrow \ \mathsf{fs}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolvePattern}(\operatorname{RecordPattern}(\mathsf{tp},\ \mathsf{fs}))\ \Downarrow \ \operatorname{RecordPattern}(\mathsf{tp}',\ \mathsf{fs}')
\end{array}
```

**(ResolvePat-Enum)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypePath}(\mathsf{tp})\ \Downarrow \ \mathsf{tp}'\quad \Gamma \ \vdash \ \operatorname{ResolveEnumPayloadPattern}(\mathsf{payload}_{\mathsf{opt}})\ \Downarrow \ \mathsf{payload}_{\mathsf{opt}}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolvePattern}(\operatorname{EnumPattern}(\mathsf{tp},\ \mathsf{name},\ \mathsf{payload}_{\mathsf{opt}}))\ \Downarrow \ \operatorname{EnumPattern}(\mathsf{tp}',\ \mathsf{name},\ \mathsf{payload}_{\mathsf{opt}}')
\end{array}
```

**(ResolvePat-Modal)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveFieldPatternListOpt}(\mathsf{fields}_{\mathsf{opt}})\ \Downarrow \ \mathsf{fields}_{\mathsf{opt}}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolvePattern}(\operatorname{ModalPattern}(\mathsf{state},\ \mathsf{fields}_{\mathsf{opt}}))\ \Downarrow \ \operatorname{ModalPattern}(\mathsf{state},\ \mathsf{fields}_{\mathsf{opt}}')
\end{array}
```

**(ResolvePat-Range)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePattern}(p_{l})\ \Downarrow \ p_{l}'\quad \Gamma \ \vdash \ \operatorname{ResolvePattern}(p_{h})\ \Downarrow \ p_{h}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolvePattern}(\operatorname{RangePattern}(\mathsf{kind},\ p_{l},\ p_{h}))\ \Downarrow \ \operatorname{RangePattern}(\mathsf{kind},\ p_{l}',\ p_{h}')
\end{array}
```

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePatternList}([])\ \Downarrow \ [] \\
\Gamma \ \vdash \ \operatorname{ResolveFieldPatternList}([])\ \Downarrow \ []
\end{array}
```

**(ResolvePatternList-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePattern}(p)\ \Downarrow \ p'\quad \Gamma \ \vdash \ \operatorname{ResolvePatternList}(\mathsf{ps})\ \Downarrow \ \mathsf{ps}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolvePatternList}(p\ \mathbin{::} \ \mathsf{ps})\ \Downarrow \ p'\ \mathbin{::} \ \mathsf{ps}'
\end{array}
```

**(ResolveFieldPattern-Implicit)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveFieldPattern}(\langle \mathsf{name},\ \bot ,\ \mathsf{span}\rangle )\ \Downarrow \ \langle \mathsf{name},\ \bot ,\ \mathsf{span}\rangle 
\end{array}
```

**(ResolveFieldPattern-Explicit)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePattern}(p)\ \Downarrow \ p' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveFieldPattern}(\langle \mathsf{name},\ p,\ \mathsf{span}\rangle )\ \Downarrow \ \langle \mathsf{name},\ p',\ \mathsf{span}\rangle 
\end{array}
```

**(ResolveFieldPatternList-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveFieldPattern}(f)\ \Downarrow \ f'\quad \Gamma \ \vdash \ \operatorname{ResolveFieldPatternList}(\mathsf{fs})\ \Downarrow \ \mathsf{fs}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveFieldPatternList}(f\ \mathbin{::} \ \mathsf{fs})\ \Downarrow \ f'\ \mathbin{::} \ \mathsf{fs}'
\end{array}
```

```math
\Gamma \ \vdash \ \operatorname{ResolveEnumPayloadPattern}(\bot )\ \Downarrow \ \bot 
```

**(ResolveEnumPayloadPattern-Tuple)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePatternList}(\mathsf{ps})\ \Downarrow \ \mathsf{ps}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveEnumPayloadPattern}(\operatorname{TuplePayloadPattern}(\mathsf{ps}))\ \Downarrow \ \operatorname{TuplePayloadPattern}(\mathsf{ps}')
\end{array}
```

**(ResolveEnumPayloadPattern-Record)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveFieldPatternList}(\mathsf{fs})\ \Downarrow \ \mathsf{fs}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveEnumPayloadPattern}(\operatorname{RecordPayloadPattern}(\mathsf{fs}))\ \Downarrow \ \operatorname{RecordPayloadPattern}(\mathsf{fs}')
\end{array}
```

```math
\Gamma \ \vdash \ \operatorname{ResolveFieldPatternListOpt}(\bot )\ \Downarrow \ \bot 
```

**(ResolveFieldPatternListOpt-Some)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveFieldPatternList}(\mathsf{fs})\ \Downarrow \ \mathsf{fs}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveFieldPatternListOpt}(\mathsf{fs})\ \Downarrow \ \mathsf{fs}'
\end{array}
```

**(ResolveExpr-Ident)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveValueName}(x)\ \Downarrow \ \mathsf{ent} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{Identifier}(x))\ \Downarrow \ \operatorname{Identifier}(x)
\end{array}
```

**(ResolveExpr-Ident-Err)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveValueName}(x)\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{ResolveExpr}-\mathsf{Ident}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{Identifier}(x))\ \Uparrow \ c
\end{array}
```

**(ResolveExpr-Qualified)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveQualifiedForm}(e)\ \Downarrow \ e' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e'
\end{array}
```

```math
\begin{array}{l}
\mathsf{ResolveArgsRef}\ =\ \{\texttt{"5.1.6"}\} \\
\mathsf{ResolveFieldInitsRef}\ =\ \{\texttt{"5.1.6"}\}
\end{array}
```

```math
\Gamma \ \vdash \ \operatorname{ResolveExprList}([])\ \Downarrow \ []
```

**(ResolveExprList-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e'\quad \Gamma \ \vdash \ \operatorname{ResolveExprList}(\mathsf{es})\ \Downarrow \ \mathsf{es}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveExprList}(e\ \mathbin{::} \ \mathsf{es})\ \Downarrow \ e'\ \mathbin{::} \ \mathsf{es}'
\end{array}
```

```math
\mathsf{ResolveExprListJudg}\ =\ \{\mathsf{ResolveExprList}\}
```

```math
\mathsf{ResolveEnumPayloadJudg}\ =\ \{\mathsf{ResolveEnumPayload}\}
```

**(ResolveEnumPayload-None)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveEnumPayload}(\bot )\ \Downarrow \ \bot 
\end{array}
```

**(ResolveEnumPayload-Tuple)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExprList}(\mathsf{es})\ \Downarrow \ \mathsf{es}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveEnumPayload}(\operatorname{Paren}(\mathsf{es}))\ \Downarrow \ \operatorname{Paren}(\mathsf{es}')
\end{array}
```

**(ResolveEnumPayload-Record)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveFieldInits}(\mathsf{fields})\ \Downarrow \ \mathsf{fields}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveEnumPayload}(\operatorname{Brace}(\mathsf{fields}))\ \Downarrow \ \operatorname{Brace}(\mathsf{fields}')
\end{array}
```

```math
\mathsf{ResolveKeyPathJudg}\ =\ \{\mathsf{ResolveKeyPathExpr},\ \mathsf{ResolveKeyPathList},\ \mathsf{ResolveKeySeg},\ \mathsf{ResolveKeySegs}\}
```

**(ResolveKeySeg-Field)**

```math
\begin{array}{l}
\mathsf{seg}\ =\ \operatorname{Field}(\mathsf{marked},\ \mathsf{name}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveKeySeg}(\mathsf{seg})\ \Downarrow \ \mathsf{seg}
\end{array}
```

**(ResolveKeySeg-Index)**

```math
\begin{array}{l}
\mathsf{seg}\ =\ \operatorname{Index}(\mathsf{marked},\ e)\quad \Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveKeySeg}(\mathsf{seg})\ \Downarrow \ \operatorname{Index}(\mathsf{marked},\ e')
\end{array}
```

**(ResolveKeySegs-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveKeySegs}([])\ \Downarrow \ []
\end{array}
```

**(ResolveKeySegs-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveKeySeg}(s)\ \Downarrow \ s'\quad \Gamma \ \vdash \ \operatorname{ResolveKeySegs}(\mathsf{ss})\ \Downarrow \ \mathsf{ss}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveKeySegs}(s\ \mathbin{::} \ \mathsf{ss})\ \Downarrow \ s'\ \mathbin{::} \ \mathsf{ss}'
\end{array}
```

**(ResolveKeyPathExpr)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveValueName}(\mathsf{root})\ \Downarrow \ \mathsf{ent}\quad \Gamma \ \vdash \ \operatorname{ResolveKeySegs}(\mathsf{segs})\ \Downarrow \ \mathsf{segs}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveKeyPathExpr}(\langle \mathsf{root},\ \mathsf{segs}\rangle )\ \Downarrow \ \langle \mathsf{root},\ \mathsf{segs}'\rangle 
\end{array}
```

**(ResolveKeyPathExpr-Err)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveValueName}(\mathsf{root})\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{ResolveExpr}-\mathsf{Ident}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveKeyPathExpr}(\langle \mathsf{root},\ \mathsf{segs}\rangle )\ \Uparrow \ c
\end{array}
```

**(ResolveKeyPathList-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveKeyPathList}([])\ \Downarrow \ []
\end{array}
```

**(ResolveKeyPathList-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveKeyPathExpr}(\mathsf{kp})\ \Downarrow \ \mathsf{kp}'\quad \Gamma \ \vdash \ \operatorname{ResolveKeyPathList}(\mathsf{kps})\ \Downarrow \ \mathsf{kps}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveKeyPathList}(\mathsf{kp}\ \mathbin{::} \ \mathsf{kps})\ \Downarrow \ \mathsf{kp}'\ \mathbin{::} \ \mathsf{kps}'
\end{array}
```

```math
\mathsf{ResolveParallelOptJudg}\ =\ \{\mathsf{ResolveParallelOpt},\ \mathsf{ResolveParallelOpts}\}
```

**(ResolveParallelOpt-Cancel)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveParallelOpt}(\operatorname{Cancel}(e))\ \Downarrow \ \operatorname{Cancel}(e')
\end{array}
```

**(ResolveParallelOpt-Name)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveParallelOpt}(\operatorname{Name}(s))\ \Downarrow \ \operatorname{Name}(s)
\end{array}
```

**(ResolveParallelOpts-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveParallelOpts}([])\ \Downarrow \ []
\end{array}
```

**(ResolveParallelOpts-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveParallelOpt}(o)\ \Downarrow \ o'\quad \Gamma \ \vdash \ \operatorname{ResolveParallelOpts}(\mathsf{os})\ \Downarrow \ \mathsf{os}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveParallelOpts}(o\ \mathbin{::} \ \mathsf{os})\ \Downarrow \ o'\ \mathbin{::} \ \mathsf{os}'
\end{array}
```

```math
\mathsf{ResolveSpawnOptJudg}\ =\ \{\mathsf{ResolveSpawnOpt},\ \mathsf{ResolveSpawnOpts}\}
```

**(ResolveSpawnOpt-Name)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveSpawnOpt}(\operatorname{Name}(s))\ \Downarrow \ \operatorname{Name}(s)
\end{array}
```

**(ResolveSpawnOpt-Affinity)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveSpawnOpt}(\operatorname{Affinity}(e))\ \Downarrow \ \operatorname{Affinity}(e')
\end{array}
```

**(ResolveSpawnOpt-Priority)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveSpawnOpt}(\operatorname{Priority}(e))\ \Downarrow \ \operatorname{Priority}(e')
\end{array}
```

**(ResolveSpawnOpts-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveSpawnOpts}([])\ \Downarrow \ []
\end{array}
```

**(ResolveSpawnOpts-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveSpawnOpt}(o)\ \Downarrow \ o'\quad \Gamma \ \vdash \ \operatorname{ResolveSpawnOpts}(\mathsf{os})\ \Downarrow \ \mathsf{os}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveSpawnOpts}(o\ \mathbin{::} \ \mathsf{os})\ \Downarrow \ o'\ \mathbin{::} \ \mathsf{os}'
\end{array}
```

```math
\mathsf{ResolveDispatchOptJudg}\ =\ \{\mathsf{ResolveDispatchOpt},\ \mathsf{ResolveDispatchOpts}\}
```

**(ResolveDispatchOpt-Reduce)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveDispatchOpt}(\operatorname{Reduce}(\mathsf{op}))\ \Downarrow \ \operatorname{Reduce}(\mathsf{op})
\end{array}
```

**(ResolveDispatchOpt-Ordered)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveDispatchOpt}(\mathsf{Ordered})\ \Downarrow \ \mathsf{Ordered}
\end{array}
```

**(ResolveDispatchOpt-Chunk)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveDispatchOpt}(\operatorname{Chunk}(e))\ \Downarrow \ \operatorname{Chunk}(e')
\end{array}
```

**(ResolveDispatchOpts-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveDispatchOpts}([])\ \Downarrow \ []
\end{array}
```

**(ResolveDispatchOpts-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveDispatchOpt}(o)\ \Downarrow \ o'\quad \Gamma \ \vdash \ \operatorname{ResolveDispatchOpts}(\mathsf{os})\ \Downarrow \ \mathsf{os}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveDispatchOpts}(o\ \mathbin{::} \ \mathsf{os})\ \Downarrow \ o'\ \mathbin{::} \ \mathsf{os}'
\end{array}
```

```math
\mathsf{ResolveRaceJudg}\ =\ \{\mathsf{ResolveRaceArm},\ \mathsf{ResolveRaceArms},\ \mathsf{ResolveRaceHandler}\}
```

**(ResolveRaceHandler-Return)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveRaceHandler}(\operatorname{RaceReturn}(e))\ \Downarrow \ \operatorname{RaceReturn}(e')
\end{array}
```

**(ResolveRaceHandler-Yield)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveRaceHandler}(\operatorname{RaceYield}(e))\ \Downarrow \ \operatorname{RaceYield}(e')
\end{array}
```

**(ResolveRaceArm)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e'\quad \Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \Gamma_{0} \ \vdash \ \operatorname{ResolvePattern}(\mathsf{pat})\ \Downarrow \ \mathsf{pat}'\quad \Gamma_{0} \ \vdash \ \operatorname{BindPattern}(\mathsf{pat}')\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} \ \vdash \ \operatorname{ResolveRaceHandler}(\mathsf{handler})\ \Downarrow \ \mathsf{handler}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveRaceArm}(\langle e,\ \mathsf{pat},\ \mathsf{handler}\rangle )\ \Downarrow \ \langle e',\ \mathsf{pat}',\ \mathsf{handler}'\rangle 
\end{array}
```

**(ResolveRaceArms-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveRaceArms}([])\ \Downarrow \ []
\end{array}
```

**(ResolveRaceArms-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveRaceArm}(a)\ \Downarrow \ a'\quad \Gamma \ \vdash \ \operatorname{ResolveRaceArms}(\mathsf{as})\ \Downarrow \ \mathsf{as}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveRaceArms}(a\ \mathbin{::} \ \mathsf{as})\ \Downarrow \ a'\ \mathbin{::} \ \mathsf{as}'
\end{array}
```

```math
\mathsf{ResolveAllExprListJudg}\ =\ \{\mathsf{ResolveAllExprList}\}
```

**(ResolveAllExprList-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveAllExprList}([])\ \Downarrow \ []
\end{array}
```

**(ResolveAllExprList-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e'\quad \Gamma \ \vdash \ \operatorname{ResolveAllExprList}(\mathsf{es})\ \Downarrow \ \mathsf{es}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveAllExprList}(e\ \mathbin{::} \ \mathsf{es})\ \Downarrow \ e'\ \mathbin{::} \ \mathsf{es}'
\end{array}
```

```math
\mathsf{ResolveCalleeJudg}\ =\ \{\mathsf{ResolveCallee}\}
```

**(ResolveCallee-Ident-Value)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveValueName}(x)\ \Downarrow \ \mathsf{ent} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveCallee}(\operatorname{Identifier}(x),\ \mathsf{args})\ \Downarrow \ \operatorname{Identifier}(x)
\end{array}
```

**(ResolveCallee-Ident-Record)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveValueName}(x)\ \Uparrow \quad \mathsf{args}\ =\ []\quad \Gamma \ \vdash \ \operatorname{ResolveTypeName}(x)\ \Downarrow \ \mathsf{ent}\quad \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ p\quad \mathsf{name}\ =\ (\mathsf{ent}.\mathsf{target}_{\mathsf{opt}}\ \mathsf{if}\ \mathsf{present},\ \mathsf{else}\ x)\quad \operatorname{RecordDecl}(\operatorname{FullPath}(\operatorname{PathOfModule}(p),\ \mathsf{name}))\ =\ R \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveCallee}(\operatorname{Identifier}(x),\ \mathsf{args})\ \Downarrow \ \operatorname{Identifier}(x)
\end{array}
```

**(ResolveCallee-Path-Value)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveQualified}(\mathsf{path},\ \mathsf{name},\ \mathsf{ValueKind})\ \Downarrow \ \mathsf{ent} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveCallee}(\operatorname{Path}(\mathsf{path},\ \mathsf{name}),\ \mathsf{args})\ \Downarrow \ \operatorname{Path}(\mathsf{path},\ \mathsf{name})
\end{array}
```

**(ResolveCallee-Path-Builtin)**
BuiltinValuePath(path, name)

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveCallee}(\operatorname{Path}(\mathsf{path},\ \mathsf{name}),\ \mathsf{args})\ \Downarrow \ \operatorname{Path}(\mathsf{path},\ \mathsf{name})
\end{array}
```

**(ResolveCallee-Path-Record)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveRecordPath}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ p\quad \mathsf{args}\ =\ [] \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveCallee}(\operatorname{Path}(\mathsf{path},\ \mathsf{name}),\ \mathsf{args})\ \Downarrow \ \operatorname{Path}(\mathsf{path},\ \mathsf{name})
\end{array}
```

**(ResolveCallee-Other)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{callee})\ \Downarrow \ \mathsf{callee}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveCallee}(\mathsf{callee},\ \mathsf{args})\ \Downarrow \ \mathsf{callee}'
\end{array}
```

**(ResolveExpr-Call)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveArgs}(\mathsf{args})\ \Downarrow \ \mathsf{args}'\quad \Gamma \ \vdash \ \operatorname{ResolveCallee}(\mathsf{callee},\ \mathsf{args}')\ \Downarrow \ \mathsf{callee}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{Call}(\mathsf{callee},\ \mathsf{args}))\ \Downarrow \ \operatorname{Call}(\mathsf{callee}',\ \mathsf{args}')
\end{array}
```

**(ResolveExpr-Call-TypeArgs)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypeList}(\mathsf{type}_{\mathsf{args}})\ \Downarrow \ \mathsf{type}_{\mathsf{args}}'\quad \Gamma \ \vdash \ \operatorname{ResolveArgs}(\mathsf{args})\ \Downarrow \ \mathsf{args}'\quad \Gamma \ \vdash \ \operatorname{ResolveCallee}(\mathsf{callee},\ \mathsf{args}')\ \Downarrow \ \mathsf{callee}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{CallTypeArgs}(\mathsf{callee},\ \mathsf{type}_{\mathsf{args}},\ \mathsf{args}))\ \Downarrow \ \operatorname{CallTypeArgs}(\mathsf{callee}',\ \mathsf{type}_{\mathsf{args}}',\ \mathsf{args}')
\end{array}
```

**(ResolveExpr-RecordExpr)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTypeRef}(\mathsf{tr})\ \Downarrow \ \mathsf{tr}'\quad \Gamma \ \vdash \ \operatorname{ResolveFieldInits}(\mathsf{fields})\ \Downarrow \ \mathsf{fields}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{RecordExpr}(\mathsf{tr},\ \mathsf{fields}))\ \Downarrow \ \operatorname{RecordExpr}(\mathsf{tr}',\ \mathsf{fields}')
\end{array}
```

**(ResolveExpr-EnumLiteral)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveEnumPayload}(\mathsf{payload}_{\mathsf{opt}})\ \Downarrow \ \mathsf{payload}_{\mathsf{opt}}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{EnumLiteral}(\mathsf{path},\ \mathsf{payload}_{\mathsf{opt}}))\ \Downarrow \ \operatorname{EnumLiteral}(\mathsf{path},\ \mathsf{payload}_{\mathsf{opt}}')
\end{array}
```

```math
\mathsf{ResolveIfCaseJudg}\ =\ \{\mathsf{ResolveIfCase},\ \mathsf{ResolveIfCases},\ \mathsf{ResolveElseBlockOpt}\}
```

**(ResolveIfCase)**

```math
\begin{array}{l}
\Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \Gamma_{0} \ \vdash \ \operatorname{ResolvePattern}(p)\ \Downarrow \ p'\quad \Gamma_{0} \ \vdash \ \operatorname{BindPattern}(p')\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} \ \vdash \ \operatorname{ResolveExpr}(b)\ \Downarrow \ b' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveIfCase}(\langle p,\ b\rangle )\ \Downarrow \ \langle p',\ b'\rangle 
\end{array}
```

**(ResolveIfCases-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveIfCases}([])\ \Downarrow \ []
\end{array}
```

**(ResolveIfCases-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveIfCase}(a)\ \Downarrow \ a'\quad \Gamma \ \vdash \ \operatorname{ResolveIfCases}(\mathsf{as})\ \Downarrow \ \mathsf{as}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveIfCases}(a\ \mathbin{::} \ \mathsf{as})\ \Downarrow \ a'\ \mathbin{::} \ \mathsf{as}'
\end{array}
```

**(ResolveElseBlockOpt-None)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveElseBlockOpt}(\bot )\ \Downarrow \ \bot 
\end{array}
```

**(ResolveElseBlockOpt-Some)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(b)\ \Downarrow \ b' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveElseBlockOpt}(b)\ \Downarrow \ b'
\end{array}
```

**(ResolveExpr-IfIs)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{scrutinee})\ \Downarrow \ \mathsf{scrutinee}'\quad \Gamma \ \vdash \ \operatorname{ResolvePattern}(\mathsf{pat})\ \Downarrow \ \mathsf{pat}'\quad \Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \Gamma_{0} \ \vdash \ \operatorname{BindPattern}(\mathsf{pat}')\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} \ \vdash \ \operatorname{ResolveExpr}(\mathsf{then}_{\mathsf{block}})\ \Downarrow \ \mathsf{then}_{\mathsf{block}}'\quad \Gamma \ \vdash \ \operatorname{ResolveElseBlockOpt}(\mathsf{else}_{\mathsf{opt}})\ \Downarrow \ \mathsf{else}_{\mathsf{opt}}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{IfIsExpr}(\mathsf{scrutinee},\ \mathsf{pat},\ \mathsf{then}_{\mathsf{block}},\ \mathsf{else}_{\mathsf{opt}}))\ \Downarrow \ \operatorname{IfIsExpr}(\mathsf{scrutinee}',\ \mathsf{pat}',\ \mathsf{then}_{\mathsf{block}}',\ \mathsf{else}_{\mathsf{opt}}')
\end{array}
```

**(ResolveExpr-IfCase)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{scrutinee})\ \Downarrow \ \mathsf{scrutinee}'\quad \Gamma \ \vdash \ \operatorname{ResolveIfCases}(\mathsf{cases})\ \Downarrow \ \mathsf{cases}'\quad \Gamma \ \vdash \ \operatorname{ResolveElseBlockOpt}(\mathsf{else}_{\mathsf{opt}})\ \Downarrow \ \mathsf{else}_{\mathsf{opt}}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{IfCaseExpr}(\mathsf{scrutinee},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}}))\ \Downarrow \ \operatorname{IfCaseExpr}(\mathsf{scrutinee}',\ \mathsf{cases}',\ \mathsf{else}_{\mathsf{opt}}')
\end{array}
```

**(ResolveExpr-LoopInfinite)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveInvariantOpt}(\mathsf{inv}_{\mathsf{opt}})\ \Downarrow \ \mathsf{inv}_{\mathsf{opt}}'\quad \Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{body})\ \Downarrow \ \mathsf{body}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{LoopInfinite}(\mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}))\ \Downarrow \ \operatorname{LoopInfinite}(\mathsf{inv}_{\mathsf{opt}}',\ \mathsf{body}')
\end{array}
```

**(ResolveExpr-LoopConditional)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{cond})\ \Downarrow \ \mathsf{cond}'\quad \Gamma \ \vdash \ \operatorname{ResolveInvariantOpt}(\mathsf{inv}_{\mathsf{opt}})\ \Downarrow \ \mathsf{inv}_{\mathsf{opt}}'\quad \Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{body})\ \Downarrow \ \mathsf{body}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{LoopConditional}(\mathsf{cond},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}))\ \Downarrow \ \operatorname{LoopConditional}(\mathsf{cond}',\ \mathsf{inv}_{\mathsf{opt}}',\ \mathsf{body}')
\end{array}
```

**(ResolveExpr-LoopIter)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePattern}(\mathsf{pat})\ \Downarrow \ \mathsf{pat}'\quad \Gamma \ \vdash \ \operatorname{ResolveTypeOpt}(\mathsf{ty}_{\mathsf{opt}})\ \Downarrow \ \mathsf{ty}_{\mathsf{opt}}'\quad \Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{iter})\ \Downarrow \ \mathsf{iter}'\quad \Gamma \ \vdash \ \operatorname{ResolveInvariantOpt}(\mathsf{inv}_{\mathsf{opt}})\ \Downarrow \ \mathsf{inv}_{\mathsf{opt}}'\quad \Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \Gamma_{0} \ \vdash \ \operatorname{BindPattern}(\mathsf{pat}')\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} \ \vdash \ \operatorname{ResolveExpr}(\mathsf{body})\ \Downarrow \ \mathsf{body}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{LoopIter}(\mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{iter},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}))\ \Downarrow \ \operatorname{LoopIter}(\mathsf{pat}',\ \mathsf{ty}_{\mathsf{opt}}',\ \mathsf{iter}',\ \mathsf{inv}_{\mathsf{opt}}',\ \mathsf{body}')
\end{array}
```

**(ResolveExpr-Parallel)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{domain})\ \Downarrow \ \mathsf{domain}'\quad \Gamma \ \vdash \ \operatorname{ResolveParallelOpts}(\mathsf{opts})\ \Downarrow \ \mathsf{opts}'\quad \Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{body})\ \Downarrow \ \mathsf{body}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{ParallelExpr}(\mathsf{domain},\ \mathsf{opts},\ \mathsf{body}))\ \Downarrow \ \operatorname{ParallelExpr}(\mathsf{domain}',\ \mathsf{opts}',\ \mathsf{body}')
\end{array}
```

**(ResolveExpr-Spawn)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveSpawnOpts}(\mathsf{opts})\ \Downarrow \ \mathsf{opts}'\quad \Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{body})\ \Downarrow \ \mathsf{body}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{SpawnExpr}(\mathsf{opts},\ \mathsf{body}))\ \Downarrow \ \operatorname{SpawnExpr}(\mathsf{opts}',\ \mathsf{body}')
\end{array}
```

**(ResolveExpr-Wait)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{handle})\ \Downarrow \ \mathsf{handle}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{WaitExpr}(\mathsf{handle}))\ \Downarrow \ \operatorname{WaitExpr}(\mathsf{handle}')
\end{array}
```

```math
\mathsf{ResolveKeyClauseJudg}\ =\ \{\mathsf{ResolveKeyClauseOpt}\}
```

**(ResolveKeyClauseOpt-None)**

```math
\begin{array}{l}
\mathsf{key}_{\mathsf{clause}\_\mathsf{opt}}\ =\ \bot  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveKeyClauseOpt}(\mathsf{key}_{\mathsf{clause}\_\mathsf{opt}})\ \Downarrow \ \bot 
\end{array}
```

**(ResolveKeyClauseOpt-Yes)**

```math
\begin{array}{l}
\mathsf{key}_{\mathsf{clause}\_\mathsf{opt}}\ =\ \langle \mathsf{path},\ \mathsf{mode}\rangle \quad \Gamma \ \vdash \ \operatorname{ResolveKeyPathExpr}(\mathsf{path})\ \Downarrow \ \mathsf{path}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveKeyClauseOpt}(\mathsf{key}_{\mathsf{clause}\_\mathsf{opt}})\ \Downarrow \ \langle \mathsf{path}',\ \mathsf{mode}\rangle 
\end{array}
```

**(ResolveExpr-Dispatch)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePattern}(\mathsf{pat})\ \Downarrow \ \mathsf{pat}'\quad \Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{range})\ \Downarrow \ \mathsf{range}'\quad \Gamma \ \vdash \ \operatorname{ResolveKeyClauseOpt}(\mathsf{key}_{\mathsf{clause}\_\mathsf{opt}})\ \Downarrow \ \mathsf{key}_{\mathsf{clause}\_\mathsf{opt}}'\quad \Gamma \ \vdash \ \operatorname{ResolveDispatchOpts}(\mathsf{opts})\ \Downarrow \ \mathsf{opts}'\quad \Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \Gamma_{0} \ \vdash \ \operatorname{BindPattern}(\mathsf{pat}')\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} \ \vdash \ \operatorname{ResolveExpr}(\mathsf{body})\ \Downarrow \ \mathsf{body}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{DispatchExpr}(\mathsf{pat},\ \mathsf{range},\ \mathsf{key}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{opts},\ \mathsf{body}))\ \Downarrow \ \operatorname{DispatchExpr}(\mathsf{pat}',\ \mathsf{range}',\ \mathsf{key}_{\mathsf{clause}\_\mathsf{opt}}',\ \mathsf{opts}',\ \mathsf{body}')
\end{array}
```

**(ResolveExpr-Yield)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{YieldExpr}(\mathsf{release}_{\mathsf{opt}},\ e))\ \Downarrow \ \operatorname{YieldExpr}(\mathsf{release}_{\mathsf{opt}},\ e')
\end{array}
```

**(ResolveExpr-YieldFrom)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ e))\ \Downarrow \ \operatorname{YieldFromExpr}(\mathsf{release}_{\mathsf{opt}},\ e')
\end{array}
```

**(ResolveExpr-Sync)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{SyncExpr}(e))\ \Downarrow \ \operatorname{SyncExpr}(e')
\end{array}
```

**(ResolveExpr-Race)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveRaceArms}(\mathsf{arms})\ \Downarrow \ \mathsf{arms}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{RaceExpr}(\mathsf{arms}))\ \Downarrow \ \operatorname{RaceExpr}(\mathsf{arms}')
\end{array}
```

**(ResolveExpr-All)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveAllExprList}(\mathsf{es})\ \Downarrow \ \mathsf{es}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{AllExpr}(\mathsf{es}))\ \Downarrow \ \operatorname{AllExpr}(\mathsf{es}')
\end{array}
```

**(ResolveExpr-Alloc-Explicit-ByAlias)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveValueName}(r)\ \Downarrow \ \mathsf{ent}\quad \operatorname{RegionAlias}(\mathsf{ent})\quad \Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{Binary}(\texttt{"\^{}"},\ \operatorname{Identifier}(r),\ e))\ \Downarrow \ \operatorname{AllocExpr}(r,\ e')
\end{array}
```

```math
\mathsf{ResolveExprRules}\ =\ \{\mathsf{ResolveExpr}-\mathsf{Ident},\ \mathsf{ResolveExpr}-\mathsf{Qualified},\ \mathsf{ResolveExpr}-\mathsf{Call},\ \mathsf{ResolveExpr}-\mathsf{Call}-\mathsf{TypeArgs},\ \mathsf{ResolveExpr}-\mathsf{RecordExpr},\ \mathsf{ResolveExpr}-\mathsf{EnumLiteral},\ \mathsf{ResolveExpr}-\mathsf{IfCase},\ \mathsf{ResolveExpr}-\mathsf{LoopIter},\ \mathsf{ResolveExpr}-\mathsf{Parallel},\ \mathsf{ResolveExpr}-\mathsf{Spawn},\ \mathsf{ResolveExpr}-\mathsf{Wait},\ \mathsf{ResolveExpr}-\mathsf{Dispatch},\ \mathsf{ResolveExpr}-\mathsf{Yield},\ \mathsf{ResolveExpr}-\mathsf{YieldFrom},\ \mathsf{ResolveExpr}-\mathsf{Sync},\ \mathsf{ResolveExpr}-\mathsf{Race},\ \mathsf{ResolveExpr}-\mathsf{All},\ \mathsf{ResolveExpr}-\mathsf{Alloc}-\mathsf{Explicit}-\mathsf{ByAlias},\ \mathsf{ResolveExpr}-\mathsf{Hom},\ \mathsf{ResolveExpr}-\mathsf{Alloc}-\mathsf{Implicit},\ \mathsf{ResolveExpr}-\mathsf{Alloc}-\mathsf{Explicit},\ \mathsf{ResolveExpr}-\mathsf{Block}\}
```

```math
\operatorname{NoSpecificResolveExpr}(e)\ \Leftrightarrow \ \lnot \ \exists \ r\ \in \ \mathsf{ResolveExprRules}\ \setminus \ \{\mathsf{ResolveExpr}-\mathsf{Hom}\}.\ \operatorname{PremisesHold}(r,\ e)
```

**(ResolveExpr-Hom)**

```math
\begin{array}{l}
\operatorname{NoSpecificResolveExpr}(\operatorname{C}(e_{1},\ \ldots ,\ e_{n}))\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{ResolveExpr}(e_{i})\ \Downarrow \ e_{i}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{C}(e_{1},\ \ldots ,\ e_{n}))\ \Downarrow \ \operatorname{C}(e_{1}',\ \ldots ,\ e_{n}')
\end{array}
```

**(ResolveExpr-Alloc-Implicit)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{AllocExpr}(\bot ,\ e))\ \Downarrow \ \operatorname{AllocExpr}(\bot ,\ e')
\end{array}
```

**(ResolveExpr-Alloc-Explicit)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveValueName}(r)\ \Downarrow \ \mathsf{ent}\quad \Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{AllocExpr}(r,\ e))\ \Downarrow \ \operatorname{AllocExpr}(r,\ e')
\end{array}
```

```math
\mathsf{ResolveStmtSeqJudg}\ =\ \{\mathsf{ResolveStmtSeq}\}
```

**(ResolveStmtSeq-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveStmtSeq}([])\ \Downarrow \ (\Gamma ,\ [])
\end{array}
```

**(ResolveStmtSeq-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveStmt}(s)\ \Downarrow \ (\Gamma_{1} ,\ s')\quad \Gamma_{1} \ \vdash \ \operatorname{ResolveStmtSeq}(\mathsf{ss})\ \Downarrow \ (\Gamma_{2} ,\ \mathsf{ss}') \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveStmtSeq}(s\ \mathbin{::} \ \mathsf{ss})\ \Downarrow \ (\Gamma_{2} ,\ s'\ \mathbin{::} \ \mathsf{ss}')
\end{array}
```

**(ResolveExpr-Block)**

```math
\begin{array}{l}
\Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \Gamma_{0} \ \vdash \ \operatorname{ResolveStmtSeq}(\mathsf{stmts})\ \Downarrow \ (\Gamma_{1} ,\ \mathsf{stmts}')\quad (\mathsf{tail}_{\mathsf{opt}}\ =\ \bot \ \Rightarrow \ \mathsf{tail}_{\mathsf{opt}}'\ =\ \bot )\quad (\mathsf{tail}_{\mathsf{opt}}\ =\ e\ \Rightarrow \ \Gamma_{1} \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e'\ \land \ \mathsf{tail}_{\mathsf{opt}}'\ =\ e') \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{BlockExpr}(\mathsf{stmts},\ \mathsf{tail}_{\mathsf{opt}}))\ \Downarrow \ \operatorname{BlockExpr}(\mathsf{stmts}',\ \mathsf{tail}_{\mathsf{opt}}')
\end{array}
```

**(Validate-ModulePath-Ok)**

```math
\begin{array}{l}
\lnot \ \operatorname{ReservedModulePath}(\operatorname{PathOfModule}(p)) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ValidateModulePath}(p)\ \Downarrow \ \mathsf{ok}
\end{array}
```

**(Validate-ModulePath-Reserved-Err)**

```math
\begin{array}{l}
\operatorname{ReservedModulePath}(\operatorname{PathOfModule}(p))\quad c\ =\ \operatorname{Code}(\mathsf{Validate}-\mathsf{ModulePath}-\mathsf{Reserved}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ValidateModulePath}(p)\ \Uparrow \ c
\end{array}
```

`ResolveItem` is a feature-owned judgment. Chapters 11 through 22 define the feature-specific `ResolveItem` clauses; this chapter defines the shared driver and helper relations they consume.

**(ResolveModule-Ok)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CollectNames}(M)\ \Downarrow \ N\quad \Gamma \ \vdash \ \operatorname{ValidateModulePath}(M.\mathsf{path})\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{ValidateModuleNames}(N)\ \Downarrow \ \mathsf{ok}\quad S_{\mathsf{module}}\ =\ N\quad \Gamma_{N} \ =\ [S_{\mathsf{module}},\ S_{\mathsf{universe}}]\quad \Gamma_{N} \ \vdash \ \operatorname{ResolveItems}(M.\mathsf{items})\ \Downarrow \ \mathsf{items}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveModule}(M)\ \Downarrow \ \langle M.\mathsf{path},\ \mathsf{items}',\ M.\mathsf{module}_{\mathsf{doc}}\rangle 
\end{array}
```

```math
\Gamma \ \vdash \ \operatorname{ResolveItems}([])\ \Downarrow \ []
```

**(ResolveItems-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TopLevelVis}(\mathsf{it})\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{ResolveItem}(\mathsf{it})\ \Downarrow \ \mathsf{it}'\quad \Gamma \ \vdash \ \operatorname{ResolveItems}(\mathsf{rest})\ \Downarrow \ \mathsf{rest}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveItems}(\mathsf{it}\ \mathbin{::} \ \mathsf{rest})\ \Downarrow \ \mathsf{it}'\ \mathbin{::} \ \mathsf{rest}'
\end{array}
```

```math
\mathsf{ResState}\ =\ \{\operatorname{ResStart}(M),\ \operatorname{ResNames}(M,\ N),\ \operatorname{ResItems}(M,\ N),\ \operatorname{ResDone}(M'),\ \operatorname{Error}(\mathsf{code})\}
```

**(Res-Start)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\langle \operatorname{ResStart}(M)\rangle \ \to \ \langle \operatorname{ResNames}(M,\ \_)\rangle 
\end{array}
```

**(Res-Names)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CollectNames}(M)\ \Downarrow \ N \\
\rule{18em}{0.4pt} \\
\langle \operatorname{ResNames}(M,\ \_)\rangle \ \to \ \langle \operatorname{ResItems}(M,\ N)\rangle 
\end{array}
```

**(Res-Items)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveModule}(M)\ \Downarrow \ M' \\
\rule{18em}{0.4pt} \\
\langle \operatorname{ResItems}(M,\ N)\rangle \ \to \ \langle \operatorname{ResDone}(M')\rangle 
\end{array}
```

**ResolveModules (Big-Step).**

**(ResolveModules-Ok)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseModules}(P)\ \Downarrow \ [M_{1},\ \ldots ,\ M_{k}]\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{ResolveModule}(M_{i})\ \Downarrow \ M_{i}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveModules}(P)\ \Downarrow \ [M_{1}',\ \ldots ,\ M_{k}']
\end{array}
```

**(ResolveModules-Err-Parse)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseModules}(P)\ \Uparrow \ c \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveModules}(P)\ \Uparrow \ c
\end{array}
```

**(ResolveModules-Err-Resolve)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseModules}(P)\ \Downarrow \ [M_{1},\ \ldots ,\ M_{k}]\quad \exists \ i.\ \Gamma \ \vdash \ \operatorname{ResolveModule}(M_{i})\ \Uparrow \ c \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveModules}(P)\ \Uparrow \ c
\end{array}
```

### 7.8 Name Resolution and Reserved Name Diagnostics

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
