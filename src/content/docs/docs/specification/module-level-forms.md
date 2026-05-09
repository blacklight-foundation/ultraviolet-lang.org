---
title: "Module-Level Forms"
description: "11. Module-Level Forms of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T18:13:03.158Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## 11. Module-Level Forms

### 11.1 Import Declarations

#### 11.1.1 Syntax

```text
import_decl ::= attribute_list? visibility? "import" module_path ("as" identifier)?
```

`module_path` is defined by §11.5.1.

#### 11.1.2 Parsing

`ImportDecl` is parsed by the item parser using the import-specific branch.

**(Parse-Import)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{import})\quad \Gamma \ \vdash \ \operatorname{ParseModulePath}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{path})\quad \Gamma \ \vdash \ \operatorname{ParseAliasOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{alias}_{\mathsf{opt}}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseItem}(P)\ \Downarrow \ (P_{3},\ \langle \mathsf{ImportDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{path},\ \mathsf{alias}_{\mathsf{opt}},\ \operatorname{SpanBetween}(P,\ P_{3}),\ []\rangle )
\end{array}
```

#### 11.1.3 AST Representation / Form

`ImportDecl` is a top-level AST item.

```math
\mathsf{ImportDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{path},\ \mathsf{alias}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}\rangle 
```

#### 11.1.4 Static Semantics

Import path resolution is defined by §11.5.4. This section defines the binding effect of a successfully resolved `import` declaration.

**(Import-Path)**

```math
\begin{array}{l}
u\ =\ \langle \mathsf{ImportDecl},\ \mathsf{vis},\ \mathsf{path},\ \mathsf{alias}_{\mathsf{opt}},\ \_,\ \_\rangle \quad \Gamma \ \vdash \ \operatorname{ResolveImportPath}(\mathsf{path})\ \Downarrow \ \mathsf{mp}\quad \mathsf{name}\ =\ \mathsf{alias}_{\mathsf{opt}}\ \mathsf{if}\ \mathsf{present},\ \mathsf{else}\ \operatorname{Last}(\mathsf{path}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ImportNames}(u)\ \Downarrow \ [(\mathsf{name},\ \langle \mathsf{ModuleAlias},\ \mathsf{mp},\ \bot ,\ \mathsf{Import}\rangle )]
\end{array}
```

**(Import-Path-Err)**

```math
\begin{array}{l}
u\ =\ \langle \mathsf{ImportDecl},\ \_,\ \mathsf{path},\ \_,\ \_,\ \_\rangle \quad \Gamma \ \vdash \ \operatorname{ResolveImportPath}(\mathsf{path})\ \Uparrow \ c \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ImportNames}(u)\ \Uparrow \ c
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

**(ResolveItem-Import)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveItem}(\operatorname{ImportDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{path},\ \mathsf{alias}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}))\ \Downarrow \ \operatorname{ImportDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{path},\ \mathsf{alias}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc})
\end{array}
```

#### 11.1.5 Dynamic Semantics

`import` declarations are compile-time only. They introduce no runtime action.

#### 11.1.6 Lowering

`import` declarations introduce no construct-specific lowering. Their effects are exhausted by name binding and module visibility.

#### 11.1.7 Diagnostics

| Code         | Severity | Detection    | Condition                                 |
| ------------ | -------- | ------------ | ----------------------------------------- |
| `E-MOD-1202` | Error    | Compile-time | Import of non-existent assembly or module |

Import-coverage violations are owned by §11.5.7. Accessibility violations are owned by Chapter 7.

### 11.2 Using Declarations

#### 11.2.1 Syntax

```text
using_decl      ::= attribute_list? visibility? "using" using_clause
using_clause    ::= module_path "::" identifier ("as" identifier)?
                  | module_path "::" using_list
                  | module_path "::" "*"
using_list      ::= "{" using_specifier ("," using_specifier)* "}"
using_specifier ::= identifier ("as" identifier)?
```

`module_path` is defined by §11.5.1.

#### 11.2.2 Parsing

**(Parse-Using-Wildcard)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{using})\quad \Gamma \ \vdash \ \operatorname{ParseModulePath}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{mp})\quad \operatorname{IsOp}(\operatorname{Tok}(P_{2}),\ \texttt{"::"})\quad \operatorname{IsOp}(\operatorname{Tok}(\operatorname{Advance}(P_{2})),\ \texttt{"*"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseItem}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P_{2})),\ \langle \mathsf{UsingDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \langle \mathsf{UsingWildcard},\ \mathsf{mp}\rangle ,\ \operatorname{SpanBetween}(P,\ \operatorname{Advance}(\operatorname{Advance}(P_{2}))),\ []\rangle )
\end{array}
```

**(Parse-Using-List)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{using})\quad \Gamma \ \vdash \ \operatorname{ParseModulePath}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{mp})\quad \operatorname{IsOp}(\operatorname{Tok}(P_{2}),\ \texttt{"::"})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P_{2})),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseUsingList}(\operatorname{Advance}(\operatorname{Advance}(P_{2})))\ \Downarrow \ (P_{3},\ \mathsf{specs}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseItem}(P)\ \Downarrow \ (P_{3},\ \langle \mathsf{UsingDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \langle \mathsf{UsingList},\ \mathsf{mp},\ \mathsf{specs}\rangle ,\ \operatorname{SpanBetween}(P,\ P_{3}),\ []\rangle )
\end{array}
```

**(Parse-Using-Item)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{using})\quad \Gamma \ \vdash \ \operatorname{ParseModulePath}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{mp})\quad \operatorname{IsOp}(\operatorname{Tok}(P_{2}),\ \texttt{"::"})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(P_{2})))\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{2}))\ \Downarrow \ (P_{3},\ \mathsf{id})\quad \Gamma \ \vdash \ \operatorname{ParseAliasOpt}(P_{3})\ \Downarrow \ (P_{4},\ \mathsf{alias}_{\mathsf{opt}}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseItem}(P)\ \Downarrow \ (P_{4},\ \langle \mathsf{UsingDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \langle \mathsf{UsingItem},\ \mathsf{mp},\ \mathsf{id},\ \mathsf{alias}_{\mathsf{opt}}\rangle ,\ \operatorname{SpanBetween}(P,\ P_{4}),\ []\rangle )
\end{array}
```

**(Parse-UsingSpec)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseIdent}(P)\ \Downarrow \ (P_{1},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseAliasOpt}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{alias}_{\mathsf{opt}}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseUsingSpec}(P)\ \Downarrow \ (P_{2},\ \langle \mathsf{name},\ \mathsf{alias}_{\mathsf{opt}}\rangle )
\end{array}
```

**(Parse-UsingList-Empty)**

```math
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\}"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseUsingList}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ [])
\end{array}
```

**(Parse-UsingList-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseUsingSpec}(P)\ \Downarrow \ (P_{1},\ s)\quad \Gamma \ \vdash \ \operatorname{ParseUsingListTail}(P_{1},\ [s])\ \Downarrow \ (P_{2},\ \mathsf{specs})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{"\}"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseUsingList}(P)\ \Downarrow \ (\operatorname{Advance}(P_{2}),\ \mathsf{specs})
\end{array}
```

**(Parse-UsingListTail-End)**

```math
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\}"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseUsingListTail}(P,\ \mathsf{xs})\ \Downarrow \ (P,\ \mathsf{xs})
\end{array}
```

**(Parse-UsingListTail-TrailingComma)**

```math
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"\}"})\quad \operatorname{TrailingCommaAllowed}(P_{0},\ P,\ \{\operatorname{Punctuator}(\texttt{"\}"})\}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseUsingListTail}(P,\ \mathsf{xs})\ \Downarrow \ (\operatorname{Advance}(P),\ \mathsf{xs})
\end{array}
```

**(Parse-UsingListTail-Comma)**

```math
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParseUsingSpec}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ s)\quad \Gamma \ \vdash \ \operatorname{ParseUsingListTail}(P_{1},\ \mathsf{xs}\ \mathbin{++} \ [s])\ \Downarrow \ (P_{2},\ \mathsf{ys}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseUsingListTail}(P,\ \mathsf{xs})\ \Downarrow \ (P_{2},\ \mathsf{ys})
\end{array}
```

#### 11.2.3 AST Representation / Form

`UsingDecl` is a top-level AST item with one of three clause forms.

```math
\mathsf{UsingDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{clause},\ \mathsf{span},\ \mathsf{doc}\rangle 
```

```math
\begin{array}{l}
\mathsf{UsingClause}\ \in \ \{ \\
\ \mathsf{UsingItem}\ =\ \langle \mathsf{module}_{\mathsf{path}},\ \mathsf{name},\ \mathsf{alias}_{\mathsf{opt}}\rangle , \\
\ \mathsf{UsingList}\ =\ \langle \mathsf{module}_{\mathsf{path}},\ \mathsf{specs}\rangle , \\
\ \mathsf{UsingWildcard}\ =\ \langle \mathsf{module}_{\mathsf{path}}\rangle 
\end{array}
```
}

```math
\mathsf{UsingSpec}\ =\ \langle \mathsf{name},\ \mathsf{alias}_{\mathsf{opt}}\rangle \quad \mathsf{name}\ \in \ \mathsf{identifier}
```

#### 11.2.4 Static Semantics

Using-path resolution and import coverage are defined by §11.5.4. Accessibility is defined by Chapter 7. This section defines the bindings produced by each `using` form.

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

**(Using-Item)**

```math
\begin{array}{l}
u\ =\ \langle \mathsf{UsingDecl},\ \mathsf{vis},\ \langle \mathsf{UsingItem},\ \mathsf{mp}_{\mathsf{raw}},\ \mathsf{item},\ \mathsf{alias}_{\mathsf{opt}}\rangle ,\ \_,\ \_\rangle \quad \Gamma \ \vdash \ \operatorname{ResolveUsingPath}(\mathsf{mp}_{\mathsf{raw}}\ \mathbin{++} \ [\mathsf{item}])\ \Downarrow \ \langle \mathsf{mp},\ \mathsf{item}\rangle \quad \Gamma \ \vdash \ \operatorname{ImportOk}(m,\ \mathsf{mp})\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{CanAccess}(m,\ \operatorname{DeclOf}(\mathsf{mp},\ \mathsf{item}))\ \Downarrow \ \mathsf{ok}\quad (\mathsf{vis}\ =\ \texttt{public}\ \Rightarrow \ \operatorname{Vis}(\operatorname{DeclOf}(\mathsf{mp},\ \mathsf{item}))\ =\ \texttt{public})\quad \operatorname{NameMap}(P,\ \mathsf{mp})[\operatorname{IdKey}(\mathsf{item})]\ =\ \langle k,\ \_,\ \_,\ \_\rangle \quad k\ \in \ \{\mathsf{Value},\ \mathsf{Type},\ \mathsf{Class}\}\quad \mathsf{name}\ =\ \mathsf{alias}_{\mathsf{opt}}\ \mathsf{if}\ \mathsf{present},\ \mathsf{else}\ \mathsf{item} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{UsingNames}(u)\ \Downarrow \ [(\mathsf{name},\ \langle k,\ \mathsf{mp},\ \mathsf{item},\ \mathsf{Using}\rangle )]
\end{array}
```

**(Using-Item-Public-Err)**

```math
\begin{array}{l}
u\ =\ \langle \mathsf{UsingDecl},\ \texttt{public},\ \langle \mathsf{UsingItem},\ \mathsf{mp}_{\mathsf{raw}},\ \mathsf{item},\ \_\rangle ,\ \_,\ \_\rangle \quad \Gamma \ \vdash \ \operatorname{ResolveUsingPath}(\mathsf{mp}_{\mathsf{raw}}\ \mathbin{++} \ [\mathsf{item}])\ \Downarrow \ \langle \mathsf{mp},\ \mathsf{item}\rangle \quad \operatorname{Vis}(\operatorname{DeclOf}(\mathsf{mp},\ \mathsf{item}))\ \ne \ \texttt{public}\quad c\ =\ \operatorname{Code}(\mathsf{Using}-\mathsf{Path}-\mathsf{Item}-\mathsf{Public}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{UsingNames}(u)\ \Uparrow \ c
\end{array}
```

**(Using-List)**

```math
\begin{array}{l}
u\ =\ \langle \mathsf{UsingDecl},\ \mathsf{vis},\ \langle \mathsf{UsingList},\ \mathsf{mp}_{\mathsf{raw}},\ \mathsf{specs}\rangle ,\ \_,\ \_\rangle \quad \operatorname{Distinct}(\operatorname{UsingSpecNames}(\mathsf{specs}))\quad \Gamma \ \vdash \ \operatorname{ResolveImportPath}(\mathsf{mp}_{\mathsf{raw}})\ \Downarrow \ \mathsf{mp}\quad \Gamma \ \vdash \ \operatorname{ImportOk}(m,\ \mathsf{mp})\ \Downarrow \ \mathsf{ok}\quad \forall \ i,\ s_{i}\ =\ \langle \mathsf{name}_{i},\ \mathsf{alias}_{i}\rangle \quad \operatorname{NameMap}(P,\ \mathsf{mp})[\operatorname{IdKey}(\mathsf{name}_{i})]\ =\ \langle k_{i},\ \_,\ \_,\ \_\rangle \quad k_{i}\ \in \ \{\mathsf{Value},\ \mathsf{Type},\ \mathsf{Class}\}\quad \Gamma \ \vdash \ \operatorname{CanAccess}(m,\ \operatorname{DeclOf}(\mathsf{mp},\ \mathsf{name}_{i}))\ \Downarrow \ \mathsf{ok}\quad (\mathsf{vis}\ =\ \texttt{public}\ \Rightarrow \ \operatorname{Vis}(\operatorname{DeclOf}(\mathsf{mp},\ \mathsf{name}_{i}))\ =\ \texttt{public})\quad \mathsf{bind}_{i}\ =\ \langle \operatorname{UsingSpecName}(s_{i}),\ \langle k_{i},\ \mathsf{mp},\ \mathsf{name}_{i},\ \mathsf{Using}\rangle \rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{UsingNames}(u)\ \Downarrow \ [\mathsf{bind}_{1},\ \ldots ,\ \mathsf{bind}_{n}]
\end{array}
```

**(Using-Wildcard-Warn)**

```math
\begin{array}{l}
u\ =\ \langle \mathsf{UsingDecl},\ \mathsf{vis},\ \langle \mathsf{UsingWildcard},\ \mathsf{mp}_{\mathsf{raw}}\rangle ,\ \_,\ \_\rangle \quad \Gamma \ \vdash \ \operatorname{ResolveImportPath}(\mathsf{mp}_{\mathsf{raw}})\ \Downarrow \ \mathsf{mp}\quad \Gamma \ \vdash \ \operatorname{ImportOk}(m,\ \mathsf{mp})\ \Downarrow \ \mathsf{ok}\quad \operatorname{PublicAPI}(m)\quad \mathsf{Items}\ =\ \{\ \mathsf{name}\ \mid \ \mathsf{name}\ \in \ \operatorname{ItemNames}(\mathsf{mp})\ \land \ \Gamma \ \vdash \ \operatorname{CanAccess}(m,\ \operatorname{DeclOf}(\mathsf{mp},\ \mathsf{name}))\ \Downarrow \ \mathsf{ok}\ \}\quad (\mathsf{vis}\ =\ \texttt{public}\ \Rightarrow \ \forall \ \mathsf{name}\ \in \ \mathsf{Items}.\ \operatorname{Vis}(\operatorname{DeclOf}(\mathsf{mp},\ \mathsf{name}))\ =\ \texttt{public})\quad \forall \ \mathsf{name}\ \in \ \mathsf{Items},\ \operatorname{NameMap}(P,\ \mathsf{mp})[\operatorname{IdKey}(\mathsf{name})]\ =\ \langle k,\ \_,\ \_,\ \_\rangle \quad k\ \in \ \{\mathsf{Value},\ \mathsf{Type},\ \mathsf{Class}\}\quad \mathsf{bind}_{\mathsf{name}}\ =\ \langle \mathsf{name},\ \langle k,\ \mathsf{mp},\ \mathsf{name},\ \mathsf{Using}\rangle \rangle \quad \Gamma \ \vdash \ \operatorname{Emit}(W-\mathsf{MOD}-1201,\ \bot ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{UsingNames}(u)\ \Downarrow \ [\mathsf{bind}_{\mathsf{name}}\ \mid \ \mathsf{name}\ \in \ \mathsf{Items}]
\end{array}
```

**(Using-Wildcard)**

```math
\begin{array}{l}
u\ =\ \langle \mathsf{UsingDecl},\ \mathsf{vis},\ \langle \mathsf{UsingWildcard},\ \mathsf{mp}_{\mathsf{raw}}\rangle ,\ \_,\ \_\rangle \quad \Gamma \ \vdash \ \operatorname{ResolveImportPath}(\mathsf{mp}_{\mathsf{raw}})\ \Downarrow \ \mathsf{mp}\quad \Gamma \ \vdash \ \operatorname{ImportOk}(m,\ \mathsf{mp})\ \Downarrow \ \mathsf{ok}\quad \lnot \ \operatorname{PublicAPI}(m)\quad \mathsf{Items}\ =\ \{\ \mathsf{name}\ \mid \ \mathsf{name}\ \in \ \operatorname{ItemNames}(\mathsf{mp})\ \land \ \Gamma \ \vdash \ \operatorname{CanAccess}(m,\ \operatorname{DeclOf}(\mathsf{mp},\ \mathsf{name}))\ \Downarrow \ \mathsf{ok}\ \}\quad (\mathsf{vis}\ =\ \texttt{public}\ \Rightarrow \ \forall \ \mathsf{name}\ \in \ \mathsf{Items}.\ \operatorname{Vis}(\operatorname{DeclOf}(\mathsf{mp},\ \mathsf{name}))\ =\ \texttt{public})\quad \forall \ \mathsf{name}\ \in \ \mathsf{Items},\ \operatorname{NameMap}(P,\ \mathsf{mp})[\operatorname{IdKey}(\mathsf{name})]\ =\ \langle k,\ \_,\ \_,\ \_\rangle \quad k\ \in \ \{\mathsf{Value},\ \mathsf{Type},\ \mathsf{Class}\}\quad \mathsf{bind}_{\mathsf{name}}\ =\ \langle \mathsf{name},\ \langle k,\ \mathsf{mp},\ \mathsf{name},\ \mathsf{Using}\rangle \rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{UsingNames}(u)\ \Downarrow \ [\mathsf{bind}_{\mathsf{name}}\ \mid \ \mathsf{name}\ \in \ \mathsf{Items}]
\end{array}
```

**(Using-List-Dup)**

```math
\begin{array}{l}
u\ =\ \langle \mathsf{UsingDecl},\ \_,\ \langle \mathsf{UsingList},\ \mathsf{mp},\ \mathsf{specs}\rangle ,\ \_,\ \_\rangle \quad \lnot \ \operatorname{Distinct}(\operatorname{UsingSpecNames}(\mathsf{specs}))\quad c\ =\ \operatorname{Code}(\mathsf{Using}-\mathsf{List}-\mathsf{Dup}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{UsingNames}(u)\ \Uparrow \ c
\end{array}
```

**(Using-List-Public-Err)**

```math
\begin{array}{l}
u\ =\ \langle \mathsf{UsingDecl},\ \texttt{public},\ \langle \mathsf{UsingList},\ \mathsf{mp}_{\mathsf{raw}},\ \mathsf{specs}\rangle ,\ \_,\ \_\rangle \quad \Gamma \ \vdash \ \operatorname{ResolveImportPath}(\mathsf{mp}_{\mathsf{raw}})\ \Downarrow \ \mathsf{mp}\quad \exists \ s_{i}\ \in \ \mathsf{specs}.\ s_{i}\ =\ \langle \mathsf{name}_{i},\ \_\rangle \ \land \ \operatorname{Vis}(\operatorname{DeclOf}(\mathsf{mp},\ \mathsf{name}_{i}))\ \ne \ \texttt{public}\quad c\ =\ \operatorname{Code}(\mathsf{Using}-\mathsf{List}-\mathsf{Public}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{UsingNames}(u)\ \Uparrow \ c
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

**(ResolveItem-Using)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveItem}(\operatorname{UsingDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{clause},\ \mathsf{span},\ \mathsf{doc}))\ \Downarrow \ \operatorname{UsingDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{clause},\ \mathsf{span},\ \mathsf{doc})
\end{array}
```

#### 11.2.5 Dynamic Semantics

`using` declarations are compile-time only. They introduce no runtime action.

#### 11.2.6 Lowering

`using` declarations introduce no construct-specific lowering. Their effects are exhausted by name binding.

#### 11.2.7 Diagnostics

| Code         | Severity | Detection    | Condition                                        |
| ------------ | -------- | ------------ | ------------------------------------------------ |
| `E-MOD-1204` | Error    | Compile-time | Using path does not resolve to an item           |
| `E-MOD-1205` | Error    | Compile-time | Attempt to `public using` a non-public item      |
| `E-MOD-1206` | Error    | Compile-time | Duplicate item in a `using` list                 |
| `W-MOD-1201` | Warning  | Compile-time | Wildcard `using` in a module exposing public API |

Missing required cross-assembly imports are owned by §11.5.7.

### 11.3 Static Declarations

#### 11.3.1 Syntax

```text
static_decl  ::= attribute_list? visibility? ("let" | "var") binding_decl
binding_decl ::= pattern (":" type)? binding_op expression
```

This chapter uses `StaticDecl` for top-level `let` and `var` items.

#### 11.3.2 Parsing

`StaticDecl` is parsed by the item parser. Pattern and initializer parsing reuse the shared binding parser.

**(Parse-Static-Decl)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{Tok}(P_{1})\ =\ \operatorname{Keyword}(\mathsf{kw})\quad \mathsf{kw}\ \in \ \{\texttt{let},\ \texttt{var}\}\quad \mathsf{mut}\ =\ \mathsf{kw}\quad \Gamma \ \vdash \ \operatorname{ParseBindingAfterLetVar}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{bind}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseItem}(P)\ \Downarrow \ (P_{2},\ \langle \mathsf{StaticDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{bind},\ \operatorname{SpanBetween}(P,\ P_{2}),\ []\rangle )
\end{array}
```

#### 11.3.3 AST Representation / Form

```math
\mathsf{StaticDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc}\rangle 
```

```math
\mathsf{mut}\ \in \ \{\texttt{let},\ \texttt{var}\}
```

#### 11.3.4 Static Semantics

Top-level `let` and `var` declarations are module-scope bindings. Their names are derived from the bound pattern.

```math
\operatorname{StaticVisOk}(\mathsf{vis},\ \mathsf{mut})\ \Leftrightarrow \ \lnot \ (\mathsf{vis}\ =\ \texttt{public}\ \land \ \mathsf{mut}\ =\ \texttt{var})
```

**(Bind-Static)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{PatNames}(\mathsf{pat})\ \Downarrow \ N \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ItemBindings}(\langle \mathsf{StaticDecl},\ \_,\ \_,\ \langle \mathsf{pat},\ \_,\ \_,\ \_,\ \_\rangle ,\ \_,\ \_\rangle ,\ p)\ \Downarrow \ [(n,\ \langle \mathsf{Value},\ p,\ \bot ,\ \mathsf{Decl}\rangle )\ \mid \ n\ \in \ N]
\end{array}
```

**(WF-StaticDecl)**

```math
\begin{array}{l}
\mathsf{binding}\ =\ \langle \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \_\rangle \quad \operatorname{StaticVisOk}(\mathsf{vis},\ \mathsf{mut})\quad \mathsf{ty}_{\mathsf{opt}}\ =\ T_{a}\quad \Gamma ;\ \bot ;\ \bot \ \vdash \ \mathsf{init}\ \Leftarrow \ T_{a}\ \dashv \ \emptyset \quad \Gamma \ \vdash \ \mathsf{pat}\ \Leftarrow \ T_{a}\ \dashv \ B\quad \operatorname{Distinct}(\operatorname{PatNames}(\mathsf{pat})) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{StaticDecl}\ :\ \mathsf{ok}
\end{array}
```

**(WF-StaticDecl-Ann-Mismatch)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticDecl}(\_,\ \mathsf{vis},\ \mathsf{mut},\ \langle \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \_\rangle ,\ \_,\ \_)\quad \mathsf{ty}_{\mathsf{opt}}\ =\ T_{a}\quad \Gamma ;\ \bot ;\ \bot \ \vdash \ \mathsf{init}\ \Rightarrow \ T_{i}\ \dashv \ C\quad \operatorname{Solve}(C)\ \Downarrow \ \theta \quad \lnot (\Gamma \ \vdash \ \theta (T_{i})\ \mathrel{<:} \ T_{a})\quad c\ =\ \operatorname{Code}(\mathsf{WF}-\mathsf{StaticDecl}-\mathsf{Ann}-\mathsf{Mismatch}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{item}\ \Uparrow \ c
\end{array}
```

**(WF-StaticDecl-MissingType)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \langle \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \_\rangle ,\ \_,\ \_)\quad \mathsf{ty}_{\mathsf{opt}}\ =\ \bot \quad c\ =\ \operatorname{Code}(\mathsf{WF}-\mathsf{StaticDecl}-\mathsf{MissingType}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{item}\ \Uparrow \ c
\end{array}
```

**(StaticVisOk-Err)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticDecl}(\_,\ \mathsf{vis},\ \mathsf{mut},\ \_,\ \_,\ \_)\quad \lnot \ \operatorname{StaticVisOk}(\mathsf{vis},\ \mathsf{mut})\quad c\ =\ \operatorname{Code}(\mathsf{StaticVisOk}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{item}\ \Uparrow \ c
\end{array}
```

**(ResolveItem-Static)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePattern}(\mathsf{pat})\ \Downarrow \ \mathsf{pat}'\quad \Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{init})\ \Downarrow \ \mathsf{init}'\quad \Gamma \ \vdash \ \operatorname{ResolveTypeOpt}(\mathsf{ty}_{\mathsf{opt}})\ \Downarrow \ \mathsf{ty}_{\mathsf{opt}}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveItem}(\operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \langle \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \mathsf{span}\rangle ,\ \mathsf{span}',\ \mathsf{doc}))\ \Downarrow \ \operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \langle \mathsf{pat}',\ \mathsf{ty}_{\mathsf{opt}}',\ \mathsf{op},\ \mathsf{init}',\ \mathsf{span}\rangle ,\ \mathsf{span}',\ \mathsf{doc})
\end{array}
```

#### 11.3.5 Dynamic Semantics

`StaticDecl` introduces module-scope storage. Initialization and destruction occur according to the module initialization and deinitialization framework in Chapter 24 and the ordering rules in §11.5.6.

#### 11.3.6 Lowering

```math
\mathsf{ConstInitJudg}\ =\ \{\mathsf{ConstInit}\}
```

```math
\Gamma \ \vdash \ \operatorname{ConstInit}(e)\ \Downarrow \ \mathsf{bytes}\ \Leftrightarrow \ e\ =\ \operatorname{Literal}(\mathsf{lit})\ \land \ \Gamma \ \vdash \ \operatorname{EncodeConst}(\operatorname{ExprType}(e),\ \mathsf{lit})\ \Downarrow \ \mathsf{bytes}
```

```math
\begin{array}{l}
\operatorname{StaticName}(\mathsf{binding})\ = \\
\ \mathsf{name}\quad \mathsf{if}\ \mathsf{binding}\ =\ \langle \operatorname{IdentifierPattern}(\mathsf{name}),\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \mathsf{span}\rangle  \\
\ \bot \quad \mathsf{otherwise}
\end{array}
```

```math
\operatorname{StaticBindTypes}(\mathsf{binding})\ =\ B\ \Leftrightarrow \ \mathsf{binding}\ =\ \langle \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \_\rangle \ \land \ \Gamma \ \vdash \ \mathsf{pat}\ \Leftarrow \ \operatorname{BindType}(\mathsf{binding})\ \dashv \ B
```

```math
\operatorname{StaticBindList}(\mathsf{binding})\ =\ \operatorname{PatNames}(\mathsf{pat})\ \Leftrightarrow \ \mathsf{binding}\ =\ \langle \mathsf{pat},\ \_,\ \_,\ \_,\ \_\rangle 
```

```math
\mathsf{StaticBinding}\ :\ \mathsf{StaticDecl}\ \times \ \mathsf{Name}\ \to \ \mathsf{StaticDecl}
```

```math
\begin{array}{l}
\operatorname{StaticSym}(\operatorname{StaticDecl}(\_,\ \_,\ \_,\ \mathsf{binding},\ \_,\ \_),\ x)\ = \\
\ \operatorname{Mangle}(\operatorname{StaticDecl}(\_,\ \_,\ \_,\ \mathsf{binding},\ \_,\ \_))\quad \mathsf{if}\ \operatorname{StaticName}(\mathsf{binding})\ =\ x \\
\ \operatorname{Mangle}(\operatorname{StaticBinding}(\operatorname{StaticDecl}(\_,\ \_,\ \_,\ \mathsf{binding},\ \_,\ \_),\ x))\quad \mathsf{otherwise}
\end{array}
```

**(Emit-Static-Const)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})\quad \mathsf{mut}\ =\ \texttt{let}\quad \operatorname{StaticName}(\mathsf{binding})\ =\ \mathsf{name}\quad \mathsf{binding}\ =\ \langle \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \_\rangle \quad \Gamma \ \vdash \ \operatorname{ConstInit}(\mathsf{init})\ \Downarrow \ \mathsf{bytes}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EmitGlobal}(\mathsf{item})\ \Downarrow \ [\operatorname{GlobalConst}(\mathsf{sym},\ \mathsf{bytes})]
\end{array}
```

**(Emit-Static-Init)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})\quad \operatorname{StaticName}(\mathsf{binding})\ =\ \mathsf{name}\quad \mathsf{binding}\ =\ \langle \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \_\rangle \quad ((\mathsf{mut}\ =\ \texttt{var})\ \lor \ (\Gamma \ \vdash \ \operatorname{ConstInit}(\mathsf{init})\ \Uparrow ))\quad T\ =\ \operatorname{ExprType}(\mathsf{init})\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EmitGlobal}(\mathsf{item})\ \Downarrow \ [\operatorname{GlobalZero}(\mathsf{sym},\ \operatorname{sizeof}(T))]
\end{array}
```

**(Emit-Static-Multi)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})\quad \operatorname{StaticName}(\mathsf{binding})\ =\ \bot \quad \operatorname{StaticBindTypes}(\mathsf{binding})\ =\ B\quad \operatorname{StaticBindList}(\mathsf{binding})\ =\ [x_{1},\ \ldots ,\ x_{k}]\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{Mangle}(\operatorname{StaticBinding}(\mathsf{item},\ x_{i}))\ \Downarrow \ \mathsf{sym}_{i} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EmitGlobal}(\mathsf{item})\ \Downarrow \ [\operatorname{GlobalZero}(\mathsf{sym}_{1},\ \operatorname{sizeof}(B[x_{1}])),\ \ldots ,\ \operatorname{GlobalZero}(\mathsf{sym}_{k},\ \operatorname{sizeof}(B[x_{k}]))]
\end{array}
```

```math
\operatorname{InitSym}(m)\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"init"}]\ \mathbin{++} \ \operatorname{PathOfModule}(m))
```

**(InitFn)**

```math
\begin{array}{l}
\operatorname{InitSym}(m)\ =\ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{InitFn}(m)\ \Downarrow \ \mathsf{sym}
\end{array}
```

```math
\operatorname{DeinitSym}(m)\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"deinit"}]\ \mathbin{++} \ \operatorname{PathOfModule}(m))
```

**(DeinitFn)**

```math
\begin{array}{l}
\operatorname{DeinitSym}(m)\ =\ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{DeinitFn}(m)\ \Downarrow \ \mathsf{sym}
\end{array}
```

```math
\operatorname{StaticItems}(P,\ m)\ =\ [\ \mathsf{item}\ \mid \ \mathsf{item}\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \land \ \mathsf{item}\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_)\ ]
```

```math
\operatorname{StaticItemOf}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{item}\ \Leftrightarrow \ m\ =\ \mathsf{path}\ \land \ \mathsf{item}\ \in \ \operatorname{StaticItems}(\operatorname{Project}(\Gamma ),\ m)\ \land \ \mathsf{item}\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \mathsf{binding},\ \_,\ \_)\ \land \ \mathsf{name}\ \in \ \operatorname{StaticBindList}(\mathsf{binding})\ \land \ \forall \ \mathsf{item}'.\ (\mathsf{item}'\ \in \ \operatorname{StaticItems}(\operatorname{Project}(\Gamma ),\ m)\ \land \ \mathsf{item}'\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \mathsf{binding}',\ \_,\ \_)\ \land \ \mathsf{name}\ \in \ \operatorname{StaticBindList}(\mathsf{binding}'))\ \Rightarrow \ \mathsf{item}'\ =\ \mathsf{item}
```

```math
\operatorname{StaticSymPath}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{StaticSym}(\mathsf{item},\ \mathsf{name})\ \Leftrightarrow \ \operatorname{StaticItemOf}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{item}
```

```math
\operatorname{StaticAddr}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{addr}\ \Leftrightarrow \ \exists \ \mathsf{sym}.\ \operatorname{StaticSymPath}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{sym}\ \land \ \operatorname{AddrOfSym}(\mathsf{sym})\ =\ \mathsf{addr}
```

For hosted-library session execution, §24.4.1 reinterprets the `AddrOfSym(sym)` occurrence above session-locally for every hosted-state symbol.

```math
\mathsf{AddrOfSym}\ :\ \mathsf{Symbol}\ \to \ \mathsf{Addr}
```

```math
\operatorname{StaticType}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{StaticBindTypes}(\mathsf{binding})[\mathsf{name}]\ \Leftrightarrow \ \operatorname{StaticItemOf}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \mathsf{mut},\ \mathsf{binding},\ \_,\ \_)
```

```math
\operatorname{StaticBindInfo}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{BindInfoMap}(\lambda \ U.\ \operatorname{RespOfInit}(\mathsf{init}),\ \operatorname{StaticBindTypes}(\mathsf{binding}),\ \operatorname{MovOf}(\mathsf{op}),\ \mathsf{mut})[\mathsf{name}]\ \Leftrightarrow \ \operatorname{StaticItemOf}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \mathsf{mut},\ \mathsf{binding},\ \_,\ \_)\ \land \ \mathsf{binding}\ =\ \langle \_,\ \_,\ \mathsf{op},\ \mathsf{init},\ \_\rangle 
```

```math
\begin{array}{l}
\operatorname{SeqIRList}([])\ =\ \varepsilon  \\
\operatorname{SeqIRList}([\mathsf{IR}]\ \mathbin{++} \ \mathsf{IRs})\ =\ \operatorname{SeqIR}(\mathsf{IR},\ \operatorname{SeqIRList}(\mathsf{IRs}))
\end{array}
```

```math
\begin{array}{l}
\operatorname{StaticStoreIR}(\mathsf{item},\ [])\ =\ \varepsilon  \\
\operatorname{StaticStoreIR}(\mathsf{item},\ [\langle x,\ v\rangle ]\ \mathbin{++} \ \mathsf{bs})\ =\ \operatorname{SeqIR}(\operatorname{StoreGlobal}(\operatorname{StaticSym}(\mathsf{item},\ x),\ v),\ \operatorname{StaticStoreIR}(\mathsf{item},\ \mathsf{bs}))
\end{array}
```

**(Lower-StaticInit-Item)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})\quad \mathsf{binding}\ =\ \langle \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \_\rangle \quad \Gamma \ \vdash \ \operatorname{LowerExpr}(\mathsf{init})\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle \quad \Gamma \ \vdash \ \operatorname{MatchPattern}(\mathsf{pat},\ v)\ \Downarrow \ B\quad \operatorname{BindOrder}(\mathsf{pat},\ B)\ =\ \mathsf{binds}\quad \Gamma \ \vdash \ \operatorname{InitPanicHandle}(m)\ \Downarrow \ \mathsf{IR}_{p} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticInitItem}(m,\ \mathsf{item})\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{e},\ \operatorname{StaticStoreIR}(\mathsf{item},\ \mathsf{binds}),\ \mathsf{IR}_{p})
\end{array}
```

**(Lower-StaticInitItems-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticInitItems}(m,\ [])\ \Downarrow \ \varepsilon 
\end{array}
```

**(Lower-StaticInitItems-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticInitItem}(m,\ \mathsf{item})\ \Downarrow \ \mathsf{IR}_{i}\quad \Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticInitItems}(m,\ \mathsf{items})\ \Downarrow \ \mathsf{IR}_{r} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticInitItems}(m,\ [\mathsf{item}]\ \mathbin{++} \ \mathsf{items})\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{i},\ \mathsf{IR}_{r})
\end{array}
```

**(Lower-StaticInit)**

```math
\begin{array}{l}
\operatorname{StaticItems}(\operatorname{Project}(\Gamma ),\ m)\ =\ \mathsf{items}\quad \Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticInitItems}(m,\ \mathsf{items})\ \Downarrow \ \mathsf{IR} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticInit}(m)\ \Downarrow \ \mathsf{IR}
\end{array}
```

**(InitCallIR)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{InitFn}(m)\ \Downarrow \ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{InitCallIR}(m)\ \Downarrow \ \operatorname{SeqIR}(\operatorname{CallIR}(\mathsf{sym},\ [\mathsf{PanicOutName}]),\ \mathsf{PanicCheck})
\end{array}
```

```math
\begin{array}{l}
\operatorname{Rev}([])\ =\ [] \\
\operatorname{Rev}([x]\ \mathbin{++} \ \mathsf{xs})\ =\ \operatorname{Rev}(\mathsf{xs})\ \mathbin{++} \ [x]
\end{array}
```

**(Lower-StaticDeinitNames-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitNames}(\mathsf{path},\ \mathsf{item},\ [])\ \Downarrow \ \varepsilon 
\end{array}
```

**(Lower-StaticDeinitNames-Cons-Resp)**

```math
\begin{array}{l}
\operatorname{StaticBindInfo}(\mathsf{path},\ x).\mathsf{resp}\ =\ \mathsf{resp}\quad \mathsf{sym}\ =\ \operatorname{StaticSym}(\mathsf{item},\ x)\quad \Gamma \ \vdash \ \operatorname{StateRef}(\mathsf{sym})\ \Downarrow \ \mathsf{slot}\quad \Gamma \ \vdash \ \operatorname{EmitDrop}(\operatorname{StaticType}(\mathsf{path},\ x),\ \operatorname{Load}(\mathsf{slot},\ \operatorname{StaticType}(\mathsf{path},\ x)))\ \Downarrow \ \mathsf{IR}_{d}\quad \Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitNames}(\mathsf{path},\ \mathsf{item},\ \mathsf{xs})\ \Downarrow \ \mathsf{IR}_{r} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitNames}(\mathsf{path},\ \mathsf{item},\ [x]\ \mathbin{++} \ \mathsf{xs})\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{d},\ \mathsf{IR}_{r})
\end{array}
```

**(Lower-StaticDeinitNames-Cons-NoResp)**

```math
\begin{array}{l}
\operatorname{StaticBindInfo}(\mathsf{path},\ x).\mathsf{resp}\ \ne \ \mathsf{resp}\quad \Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitNames}(\mathsf{path},\ \mathsf{item},\ \mathsf{xs})\ \Downarrow \ \mathsf{IR}_{r} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitNames}(\mathsf{path},\ \mathsf{item},\ [x]\ \mathbin{++} \ \mathsf{xs})\ \Downarrow \ \mathsf{IR}_{r}
\end{array}
```

**(Lower-StaticDeinit-Item)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})\quad \mathsf{binding}\ =\ \langle \mathsf{pat},\ \_,\ \_,\ \_,\ \_\rangle \quad \mathsf{xs}\ =\ \operatorname{Rev}(\operatorname{StaticBindList}(\mathsf{binding}))\quad \Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitNames}(\operatorname{PathOfModule}(m),\ \mathsf{item},\ \mathsf{xs})\ \Downarrow \ \mathsf{IR} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitItem}(m,\ \mathsf{item})\ \Downarrow \ \mathsf{IR}
\end{array}
```

**(Lower-StaticDeinitItems-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitItems}(m,\ [])\ \Downarrow \ \varepsilon 
\end{array}
```

**(Lower-StaticDeinitItems-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitItem}(m,\ \mathsf{item})\ \Downarrow \ \mathsf{IR}_{i}\quad \Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitItems}(m,\ \mathsf{items})\ \Downarrow \ \mathsf{IR}_{r} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitItems}(m,\ [\mathsf{item}]\ \mathbin{++} \ \mathsf{items})\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{i},\ \mathsf{IR}_{r})
\end{array}
```

**(Lower-StaticDeinit)**

```math
\begin{array}{l}
\operatorname{StaticItems}(\operatorname{Project}(\Gamma ),\ m)\ =\ \mathsf{items}\quad \Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitItems}(m,\ \operatorname{Rev}(\mathsf{items}))\ \Downarrow \ \mathsf{IR} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinit}(m)\ \Downarrow \ \mathsf{IR}
\end{array}
```

#### 11.3.7 Diagnostics

| Code         | Severity | Detection    | Condition                                               |
| ------------ | -------- | ------------ | ------------------------------------------------------- |
| `E-TYP-1505` | Error    | Compile-time | Missing required type annotation at module scope        |
| `E-MOD-2402` | Error    | Compile-time | Type annotation incompatible with inferred type         |
| `E-MOD-2433` | Error    | Compile-time | Module-scope `var` declaration with `public` visibility |

Initialization-order failures are owned by §11.5.7.

### 11.4 Extern Block Shell

#### 11.4.1 Syntax

```text
extern_block ::= attribute_list? visibility? "extern" extern_abi? "{" extern_item* "}"
extern_abi   ::= string_literal | identifier
extern_item  ::= extern_procedure_decl
```

The detailed syntax, parsing, and AST form of `extern_procedure_decl` are defined by §23.2.

#### 11.4.2 Parsing

**(Parse-ExternBlock)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{extern})\quad \Gamma \ \vdash \ \operatorname{ParseExternAbiOpt}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{abi}_{\mathsf{opt}})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseExternItemList}(\operatorname{Advance}(P_{2}))\ \Downarrow \ (P_{3},\ \mathsf{items})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{3}),\ \texttt{"\}"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseItem}(P)\ \Downarrow \ (\operatorname{Advance}(P_{3}),\ \langle \mathsf{ExternBlock},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{abi}_{\mathsf{opt}},\ \mathsf{items},\ \operatorname{SpanBetween}(P,\ \operatorname{Advance}(P_{3})),\ []\rangle )
\end{array}
```

**(Parse-ExternAbiOpt-None)**

```math
\begin{array}{l}
\operatorname{Tok}(P).\mathsf{kind}\ \notin \ \{\mathsf{StringLiteral},\ \mathsf{Identifier}\} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseExternAbiOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
```

**(Parse-ExternAbiOpt-String)**

```math
\begin{array}{l}
\operatorname{Tok}(P).\mathsf{kind}\ =\ \mathsf{StringLiteral} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseExternAbiOpt}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \operatorname{StringAbi}(\operatorname{Tok}(P)))
\end{array}
```

**(Parse-ExternAbiOpt-Ident)**
IsIdent(Tok(P))

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseExternAbiOpt}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \operatorname{IdentAbi}(\operatorname{Lexeme}(\operatorname{Tok}(P))))
\end{array}
```

**(Parse-ExternItemList-End)**

```math
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\}"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseExternItemList}(P)\ \Downarrow \ (P,\ [])
\end{array}
```

**(Parse-ExternItemList-Cons)**

```math
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\}"})\quad \Gamma \ \vdash \ \operatorname{ParseExternProcDecl}(P)\ \Downarrow \ (P_{1},\ \mathsf{it})\quad \Gamma \ \vdash \ \operatorname{ParseExternItemList}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{rest}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseExternItemList}(P)\ \Downarrow \ (P_{2},\ [\mathsf{it}]\ \mathbin{++} \ \mathsf{rest})
\end{array}
```

#### 11.4.3 AST Representation / Form

```math
\mathsf{ExternBlock}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{abi}_{\mathsf{opt}},\ \mathsf{items},\ \mathsf{span},\ \mathsf{doc}\rangle 
```

```math
\mathsf{ExternItem}\ \in \ \{\mathsf{ExternProcDecl}\}
```

```math
\begin{array}{l}
\mathsf{abi}_{\mathsf{opt}}\ \in \ \{\bot \}\ \cup \ \mathsf{ExternAbi} \\
\mathsf{ExternAbi}\ \in \ \{\mathsf{StringAbi},\ \mathsf{IdentAbi}\}
\end{array}
```

#### 11.4.4 Static Semantics

Block-level ABI validation and namespace binding are owned by this section. Signature admissibility and FFI boundary rules are defined by Chapter 23. `ExternAbiOk` is defined by §23.2.4.

**(Bind-ExternBlock)**

```math
\begin{array}{l}
B\ =\ [(\mathsf{name}_{i},\ \langle \mathsf{Value},\ p,\ \bot ,\ \mathsf{Decl}\rangle )\ \mid \ \operatorname{ExternProcDecl}(\_,\ \_,\ \mathsf{name}_{i},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \in \ \mathsf{items}] \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ItemBindings}(\langle \mathsf{ExternBlock},\ \_,\ \_,\ \_,\ \mathsf{items},\ \_,\ \_\rangle ,\ p)\ \Downarrow \ B
\end{array}
```

**(WF-ExternBlock)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ExternBlock}(\_,\ \_,\ \mathsf{abi}_{\mathsf{opt}},\ \_,\ \_,\ \_)\quad \operatorname{ExternAbiOk}(\mathsf{abi}_{\mathsf{opt}}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{ExternBlock}\ :\ \mathsf{ok}
\end{array}
```

**(ExternAbi-Unknown-Err)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ExternBlock}(\_,\ \_,\ \mathsf{abi}_{\mathsf{opt}},\ \_,\ \_,\ \_)\quad \lnot \ \operatorname{ExternAbiOk}(\mathsf{abi}_{\mathsf{opt}})\quad c\ =\ \operatorname{Code}(\mathsf{ExternAbi}-\mathsf{Unknown}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{item}\ \Uparrow \ c
\end{array}
```

**(ResolveItem-ExternBlock)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExternItemList}(\mathsf{items})\ \Downarrow \ \mathsf{items}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveItem}(\operatorname{ExternBlock}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{abi}_{\mathsf{opt}},\ \mathsf{items},\ \mathsf{span},\ \mathsf{doc}))\ \Downarrow \ \operatorname{ExternBlock}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{abi}_{\mathsf{opt}},\ \mathsf{items}',\ \mathsf{span},\ \mathsf{doc})
\end{array}
```

#### 11.4.5 Dynamic Semantics

`extern` blocks introduce no direct runtime mechanism. Runtime boundary behavior is defined by Chapter 23.

#### 11.4.6 Lowering

`extern` blocks contribute ABI and linkage context for the contained foreign procedures. This section introduces no lowering beyond the block shell; boundary lowering is defined by Chapter 23 and Chapter 24.

#### 11.4.7 Diagnostics

Unsupported extern-ABI-string rejection is owned by §23.2.7. Contained foreign-procedure signature diagnostics are owned by Chapter 23.

### 11.5 Module and File Aggregation

#### 11.5.1 Syntax

```text
path        ::= identifier ("::" identifier)*
module_path ::= path
```

Module-to-file mapping is defined by the static semantics of this section and has no independent surface token syntax.

#### 11.5.2 Parsing

`module_path` is parsed by the shared path parser.

**(Parse-ModulePath)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseIdent}(P)\ \Downarrow \ (P_{1},\ \mathsf{id})\quad \Gamma \ \vdash \ \operatorname{ParseModulePathTail}(P_{1},\ [\mathsf{id}])\ \Downarrow \ (P_{2},\ \mathsf{path}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseModulePath}(P)\ \Downarrow \ (P_{2},\ \mathsf{path})
\end{array}
```

**(Parse-ModulePathTail-End)**

```math
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"::"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseModulePathTail}(P,\ \mathsf{xs})\ \Downarrow \ (P,\ \mathsf{xs})
\end{array}
```

**(Parse-ModulePathTail-Cons)**

```math
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"::"})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{id})\quad \Gamma \ \vdash \ \operatorname{ParseModulePathTail}(P_{1},\ \mathsf{xs}\ \mathbin{++} \ [\mathsf{id}])\ \Downarrow \ (P_{2},\ \mathsf{ys}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseModulePathTail}(P,\ \mathsf{xs})\ \Downarrow \ (P_{2},\ \mathsf{ys})
\end{array}
```

#### 11.5.3 AST Representation / Form

```math
\mathsf{Path}\ =\ [\mathsf{identifier}]
```
ModulePath = Path
TypePath = Path
ClassPath = Path

```math
\begin{array}{l}
\operatorname{PathString}(p)\ =\ \operatorname{StringOfPath}(p) \\
\mathsf{StringOfPathRef}\ =\ \{\texttt{"3.4.1"}\}
\end{array}
```

```math
\begin{array}{l}
\mathsf{ASTModule}\ =\ \langle \mathsf{path},\ \mathsf{items},\ \mathsf{module}_{\mathsf{doc}}\rangle  \\
\mathsf{ASTModule}.\mathsf{path}\ \in \ \mathsf{Path} \\
\mathsf{ASTModule}.\mathsf{items}\ \in \ [\mathsf{ASTItem}] \\
\mathsf{ASTModule}.\mathsf{module}_{\mathsf{doc}}\ \in \ \mathsf{DocList}
\end{array}
```

```math
\begin{array}{l}
\mathsf{ASTFile}\ =\ \langle \mathsf{path},\ \mathsf{items},\ \mathsf{module}_{\mathsf{doc}}\rangle  \\
\mathsf{ASTFile}.\mathsf{path}\ \in \ \mathsf{Path} \\
\mathsf{ASTFile}.\mathsf{items}\ \in \ [\mathsf{ASTItem}] \\
\mathsf{ASTFile}.\mathsf{module}_{\mathsf{doc}}\ \in \ \mathsf{DocList}
\end{array}
```

#### 11.5.4 Static Semantics

This section owns file-to-module mapping, visible module sets, import-coverage checks, and module/item path resolution.

**Module Path.**

**(Module-Path-Root)**

```math
\begin{array}{l}
\operatorname{relative}(d,\ S)\ =\ \varepsilon  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ModulePath}(d,\ S,\ A)\ =\ A
\end{array}
```

**(Module-Path-Rel)**

```math
\begin{array}{l}
\operatorname{relative}(d,\ S)\ =\ c_{1}\ /\ \ldots \ /\ c_{n} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ModulePath}(d,\ S,\ A)\ =\ A\ \mathbin{::} \ c_{1}\ \mathbin{::} \ \ldots \ \mathbin{::} \ c_{n}
\end{array}
```

**(Module-Path-Rel-Fail)**

```math
\begin{array}{l}
\operatorname{relative}(d,\ S)\ \Uparrow  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ModulePath}(d,\ S,\ A)\ \Uparrow 
\end{array}
```

```math
\begin{array}{l}
\operatorname{ModuleDirOf}(A,\ S)\ =\ S \\
\operatorname{ModuleDirOf}(A\ \mathbin{::} \ c_{1}\ \mathbin{::} \ \ldots \ \mathbin{::} \ c_{n},\ S)\ =\ S\ /\ c_{1}\ /\ \ldots \ /\ c_{n}\quad n\ \ge \ 1
\end{array}
```

```math
\begin{array}{l}
\operatorname{ViewPaths}(\mathsf{Ms})\ =\ [M.\mathsf{path}\ \mid \ M\ \in \ \mathsf{Ms}] \\
\operatorname{ViewAssembly}(A,\ P,\ \mathsf{Ms})\ = \\
\ A[\mathsf{modules}\ :=\ \operatorname{ViewPaths}(\mathsf{Ms})]\ \mathsf{if}\ A.\mathsf{name}\ =\ P.\mathsf{assembly}.\mathsf{name} \\
\ A\quad \mathsf{otherwise} \\
\operatorname{ProjectView}(P,\ \mathsf{Ms})\ =\ P[\mathsf{modules}\ :=\ \operatorname{ViewPaths}(\mathsf{Ms}),\ \mathsf{assembly}\ :=\ P.\mathsf{assembly}[\mathsf{modules}\ :=\ \operatorname{ViewPaths}(\mathsf{Ms})],\ \mathsf{assemblies}\ :=\ [\operatorname{ViewAssembly}(A,\ P,\ \mathsf{Ms})\ \mid \ A\ \in \ P.\mathsf{assemblies}]]
\end{array}
```

```math
\operatorname{SourceRootOfModule}(P,\ p)\ =\ S\ \Leftrightarrow \ \exists \ A\ \in \ P.\mathsf{assemblies}.\ p\ \in \ A.\mathsf{modules}\ \land \ A.\mathsf{name}\ =\ \operatorname{AsmOfPath}(p)\ \land \ S\ =\ A.\mathsf{source}_{\mathsf{root}}
```

```math
\mathsf{WFModulePathJudg}\ =\ \{\mathsf{WF}-\mathsf{Module}-\mathsf{Path}\}
```

**(WF-Module-Path-Ok)**

```math
\begin{array}{l}
\forall \ \mathsf{comp}\ \in \ p,\ (\Gamma \ \vdash \ \mathsf{comp}\ :\ \mathsf{Identifier})\ \land \ \lnot \ \operatorname{Keyword}(\mathsf{comp}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{WF}-\mathsf{Module}-\operatorname{Path}(p)\ \Downarrow \ \mathsf{ok}
\end{array}
```

**(WF-Module-Path-Reserved)**

```math
\begin{array}{l}
\exists \ \mathsf{comp}\ \in \ p.\ \operatorname{Keyword}(\mathsf{comp})\quad c\ =\ \operatorname{Code}(\mathsf{WF}-\mathsf{Module}-\mathsf{Path}-\mathsf{Reserved}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{WF}-\mathsf{Module}-\operatorname{Path}(p)\ \Uparrow \ c
\end{array}
```

**(WF-Module-Path-Ident-Err)**

```math
\begin{array}{l}
\exists \ \mathsf{comp}\ \in \ p.\ \lnot (\Gamma \ \vdash \ \mathsf{comp}\ :\ \mathsf{Identifier})\quad c\ =\ \operatorname{Code}(\mathsf{WF}-\mathsf{Module}-\mathsf{Path}-\mathsf{Ident}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{WF}-\mathsf{Module}-\operatorname{Path}(p)\ \Uparrow \ c
\end{array}
```

**(WF-Module-Path-Collision)**

```math
\begin{array}{l}
p_{1}\ \ne \ p_{2}\quad \operatorname{Fold}(p_{1})\ =\ \operatorname{Fold}(p_{2}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Emit}(\operatorname{Code}(\mathsf{WF}-\mathsf{Module}-\mathsf{Path}-\mathsf{Collision}))\quad \Gamma \ \vdash \ \operatorname{Emit}(W-\mathsf{MOD}-1101,\ \bot )
\end{array}
```

**Module Discovery (Small-Step)**

```math
\begin{array}{l}
\operatorname{ModuleAggInputs}(P)\ =\ \langle P.\mathsf{modules},\ P.\mathsf{source}_{\mathsf{root}},\ \{\ \operatorname{CompilationUnit}(\operatorname{ModuleDirOf}(p,\ P.\mathsf{source}_{\mathsf{root}}))\ \mid \ p\ \in \ P.\mathsf{modules}\ \}\rangle  \\
\operatorname{ModuleAggOutputs}(P)\ =\ \langle \{\ \operatorname{ASTModule}(P,\ p)\ \mid \ p\ \in \ P.\mathsf{modules}\ \},\ \{\ \operatorname{NameMap}(P,\ p)\ \mid \ p\ \in \ P.\mathsf{modules}\ \},\ G,\ \mathsf{InitOrder},\ \mathsf{InitPlan}\rangle  \\
\operatorname{ModuleMap}(P,\ p)\ =\ M\ \Leftrightarrow \ \operatorname{SourceRootOfModule}(P,\ p)\ =\ S\ \land \ \Gamma \ \vdash \ \operatorname{ParseModule}(p,\ S)\ \Downarrow \ M \\
\operatorname{ASTModule}(P,\ p)\ =\ M\ \Leftrightarrow \ \operatorname{ModuleMap}(P,\ p)\ =\ M \\
\operatorname{PathOfModule}(p)\ =\ [c_{1},\ \ldots ,\ c_{n}]\ \Leftrightarrow \ p\ =\ c_{1}\ \mathbin{::} \ \cdot \cdot \cdot \ \mathbin{::} \ c_{n} \\
\operatorname{NameCollectAfterParse}(P)\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{ParseModules}(P)\ \Downarrow \ \mathsf{Ms}\ \land \ \forall \ M\ \in \ \mathsf{Ms}.\ \exists \ N.\ \Gamma \ \vdash \ \operatorname{CollectNames}(M)\ \Downarrow \ N \\
\mathsf{NameCollectOrderIndepRef}\ =\ \{\texttt{"5.1.5"}\} \\
\mathsf{ForwardRefOrderRef}\ =\ \{\texttt{"5.12"}\}
\end{array}
```

```math
\mathsf{ParseModule}\ \in \ \operatorname{RulesIn}(\{\texttt{"3.4.1"},\ \texttt{"3.4.2"}\})
```

**ParseModule (Big-Step).**

```math
\begin{array}{l}
U\ =\ \operatorname{CompilationUnit}(\operatorname{ModuleDirOf}(p,\ S)) \\
U\ =\ [f_{1},\ \ldots ,\ f_{n}]
\end{array}
```
ReadBytes : Path ⇀ Bytes

**(ReadBytes-Ok)**

```math
\begin{array}{l}
\operatorname{read_ok}(f)\ =\ B \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ReadBytes}(f)\ \Downarrow \ B
\end{array}
```

**(ReadBytes-Err)**

```math
\begin{array}{l}
\operatorname{read_ok}(f)\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{ReadBytes}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ReadBytes}(f)\ \Uparrow \ c
\end{array}
```

```math
\operatorname{Bytes}(f)\ =\ B\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{ReadBytes}(f)\ \Downarrow \ B
```

**(ParseModule-Ok)**

```math
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{ReadBytes}(f_{i})\ \Downarrow \ B_{i}\quad \Gamma \ \vdash \ \operatorname{LoadSource}(f_{i},\ B_{i})\ \Downarrow \ S_{i}\quad \Gamma \ \vdash \ \operatorname{ParseFile}(S_{i})\ \Downarrow \ F_{i} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseModule}(p,\ S)\ \Downarrow \ \langle p,\ F_{1}.\mathsf{items}\ \mathbin{++} \ \cdot \cdot \cdot \ \mathbin{++} \ F_{n}.\mathsf{items},\ F_{1}.\mathsf{module}_{\mathsf{doc}}\ \mathbin{++} \ \cdot \cdot \cdot \ \mathbin{++} \ F_{n}.\mathsf{module}_{\mathsf{doc}}\rangle 
\end{array}
```

**(ParseModule-Err-Read)**

```math
\begin{array}{l}
\exists \ i,\ \Gamma \ \vdash \ \operatorname{ReadBytes}(f_{i})\ \Uparrow \ c \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseModule}(p,\ S)\ \Uparrow \ c
\end{array}
```

**(ParseModule-Err-Load)**

```math
\begin{array}{l}
\exists \ i,\ \Gamma \ \vdash \ \operatorname{ReadBytes}(f_{i})\ \Downarrow \ B_{i}\quad \Gamma \ \vdash \ \operatorname{LoadSource}(f_{i},\ B_{i})\ \Uparrow \ c \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseModule}(p,\ S)\ \Uparrow \ c
\end{array}
```

**LoadSource Short-Circuit.**

```math
\mathsf{If}\ \Gamma \ \vdash \ \operatorname{LoadSource}(f,\ B)\ \Uparrow \ c\ \mathsf{for}\ \mathsf{any}\ \mathsf{file}\ \mathsf{in}\ a\ \mathsf{compilation}\ \mathsf{unit},\ \mathsf{ParseModule}\ \mathsf{MUST}\ \mathsf{NOT}\ \mathsf{invoke}\ \mathsf{Tokenize},\ \mathsf{ParseFile},\ \mathsf{or}\ \mathsf{subsequent}\ \mathsf{syntactic}\ \mathsf{well}-\mathsf{formedness}\ \mathsf{checks}\ \mathsf{for}\ \mathsf{that}\ \mathsf{file}.
```

**(ParseModule-Err-Unit)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CompilationUnit}(\operatorname{ModuleDirOf}(p,\ S))\ \Uparrow \ c \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseModule}(p,\ S)\ \Uparrow \ c
\end{array}
```

**(ParseModule-Err-Parse)**

```math
\begin{array}{l}
\exists \ i,\ \Gamma \ \vdash \ \operatorname{ReadBytes}(f_{i})\ \Downarrow \ B_{i}\quad \Gamma \ \vdash \ \operatorname{LoadSource}(f_{i},\ B_{i})\ \Downarrow \ S_{i}\quad \Gamma \ \vdash \ \operatorname{ParseFile}(S_{i})\ \Uparrow \ c \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseModule}(p,\ S)\ \Uparrow \ c
\end{array}
```

```math
\begin{array}{l}
\operatorname{ParseFileBestEffort}(S)\ \Leftrightarrow \ \exists \ F.\ \Gamma \ \vdash \ \operatorname{ParseFile}(S)\ \Downarrow \ F \\
\operatorname{ParseFileOk}(S)\ \Leftrightarrow \ \operatorname{ParseFileBestEffort}(S)\ \land \ \lnot \ \operatorname{HasError}(\operatorname{ParseFileDiag}(S)) \\
\operatorname{ParseFileDiag}(S)\ =\ \Delta \ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{Tokenize}(S)\ \Downarrow \ (K_{\mathsf{raw}},\ D)\ \land \ K\ =\ \operatorname{Filter}(K_{\mathsf{raw}})\ \land \ P_{0}\ =\ \langle K,\ 0,\ D,\ 0,\ 0,\ []\rangle \ \land \ \Gamma \ \vdash \ \operatorname{ParseItems}(P_{0})\ \Downarrow \ (P_{1},\ I,\ \mathsf{MDoc})\ \land \ \operatorname{DiagStream}(P_{1})\ =\ \Delta  \\
\operatorname{HasError}(\Delta )\ \Leftrightarrow \ \exists \ d\ \in \ \Delta .\ d.\mathsf{severity}\ =\ \mathsf{Error}
\end{array}
```

**ParseModule (Small-Step).**

```math
\mathsf{ModState}\ =\ \{\operatorname{ModStart}(p,\ S),\ \operatorname{ModScan}(p,\ S,\ U,\ \mathsf{items},\ \mathsf{docs}),\ \operatorname{ModDone}(M),\ \operatorname{Error}(\mathsf{code})\}
```

**(Mod-Start)**

```math
\begin{array}{l}
U\ =\ \operatorname{CompilationUnit}(\operatorname{ModuleDirOf}(p,\ S)) \\
\rule{18em}{0.4pt} \\
\langle \operatorname{ModStart}(p,\ S)\rangle \ \to \ \langle \operatorname{ModScan}(p,\ S,\ U,\ [],\ [])\rangle 
\end{array}
```

**(Mod-Start-Err-Unit)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CompilationUnit}(\operatorname{ModuleDirOf}(p,\ S))\ \Uparrow \ c \\
\rule{18em}{0.4pt} \\
\langle \operatorname{ModStart}(p,\ S)\rangle \ \to \ \langle \operatorname{Error}(c)\rangle 
\end{array}
```

**(Mod-Scan)**

```math
\begin{array}{l}
U\ =\ f\ \mathbin{::} \ \mathsf{fs}\quad \Gamma \ \vdash \ \operatorname{ReadBytes}(f)\ \Downarrow \ B\quad \Gamma \ \vdash \ \operatorname{LoadSource}(f,\ B)\ \Downarrow \ S_{f}\quad \Gamma \ \vdash \ \operatorname{ParseFile}(S_{f})\ \Downarrow \ F \\
\rule{18em}{0.4pt} \\
\langle \operatorname{ModScan}(p,\ S,\ f\ \mathbin{::} \ \mathsf{fs},\ \mathsf{items},\ \mathsf{docs})\rangle \ \to \ \langle \operatorname{ModScan}(p,\ S,\ \mathsf{fs},\ \mathsf{items}\ \mathbin{++} \ F.\mathsf{items},\ \mathsf{docs}\ \mathbin{++} \ F.\mathsf{module}_{\mathsf{doc}})\rangle 
\end{array}
```

**(Mod-Scan-Err-Read)**

```math
\begin{array}{l}
U\ =\ f\ \mathbin{::} \ \mathsf{fs}\quad \Gamma \ \vdash \ \operatorname{ReadBytes}(f)\ \Uparrow \ c \\
\rule{18em}{0.4pt} \\
\langle \operatorname{ModScan}(p,\ S,\ f\ \mathbin{::} \ \mathsf{fs},\ \mathsf{items},\ \mathsf{docs})\rangle \ \to \ \langle \operatorname{Error}(c)\rangle 
\end{array}
```

**(Mod-Scan-Err-Load)**

```math
\begin{array}{l}
U\ =\ f\ \mathbin{::} \ \mathsf{fs}\quad \Gamma \ \vdash \ \operatorname{ReadBytes}(f)\ \Downarrow \ B\quad \Gamma \ \vdash \ \operatorname{LoadSource}(f,\ B)\ \Uparrow \ c \\
\rule{18em}{0.4pt} \\
\langle \operatorname{ModScan}(p,\ S,\ f\ \mathbin{::} \ \mathsf{fs},\ \mathsf{items},\ \mathsf{docs})\rangle \ \to \ \langle \operatorname{Error}(c)\rangle 
\end{array}
```

**(Mod-Scan-Err-Parse)**

```math
\begin{array}{l}
U\ =\ f\ \mathbin{::} \ \mathsf{fs}\quad \Gamma \ \vdash \ \operatorname{ReadBytes}(f)\ \Downarrow \ B\quad \Gamma \ \vdash \ \operatorname{LoadSource}(f,\ B)\ \Downarrow \ S_{f}\quad \Gamma \ \vdash \ \operatorname{ParseFile}(S_{f})\ \Uparrow \ c \\
\rule{18em}{0.4pt} \\
\langle \operatorname{ModScan}(p,\ S,\ f\ \mathbin{::} \ \mathsf{fs},\ \mathsf{items},\ \mathsf{docs})\rangle \ \to \ \langle \operatorname{Error}(c)\rangle 
\end{array}
```

**(Mod-Done)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\langle \operatorname{ModScan}(p,\ S,\ [],\ \mathsf{items},\ \mathsf{docs})\rangle \ \to \ \langle \operatorname{ModDone}(\langle p,\ \mathsf{items},\ \mathsf{docs}\rangle )\rangle 
\end{array}
```

**ParseModules (Big-Step).**

```math
P.\mathsf{modules}\ =\ [p_{1},\ \ldots ,\ p_{k}]
```

**(ParseModules-Ok)**

```math
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{ParseModule}(p_{i},\ P.\mathsf{source}_{\mathsf{root}})\ \Downarrow \ M_{i} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseModules}(P)\ \Downarrow \ [M_{1},\ \ldots ,\ M_{k}]
\end{array}
```

**(ParseModules-Err)**

```math
\begin{array}{l}
\exists \ i,\ \Gamma \ \vdash \ \operatorname{ParseModule}(p_{i},\ P.\mathsf{source}_{\mathsf{root}})\ \Uparrow \ c \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseModules}(P)\ \Uparrow \ c
\end{array}
```

```math
\mathsf{DiscState}\ =\ \{\operatorname{DiscStart}(S,\ A),\ \operatorname{DiscScan}(S,\ A,\ \mathsf{Pending},\ M,\ \mathsf{Seen}),\ \operatorname{DiscDone}(M),\ \operatorname{Error}(\mathsf{code})\}
```

**(Disc-Start)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\langle \operatorname{DiscStart}(S,\ A)\rangle \ \to \ \langle \operatorname{DiscScan}(S,\ A,\ \operatorname{DirSeq}(S),\ [],\ \emptyset )\rangle 
\end{array}
```

**(Disc-Skip)**

```math
\begin{array}{l}
\Gamma \ \nvdash \ d\ :\ \mathsf{ModuleDir} \\
\rule{18em}{0.4pt} \\
\langle \operatorname{DiscScan}(S,\ A,\ d\mathbin{::} \mathsf{ds},\ M,\ \mathsf{Seen})\rangle \ \to \ \langle \operatorname{DiscScan}(S,\ A,\ \mathsf{ds},\ M,\ \mathsf{Seen})\rangle 
\end{array}
```

**(Disc-Add)**

```math
\begin{array}{l}
\Gamma \ \vdash \ d\ :\ \mathsf{ModuleDir}\quad \Gamma \ \vdash \ \operatorname{ModulePath}(d,\ S,\ A)\ =\ p\quad \Gamma \ \vdash \ \mathsf{WF}-\mathsf{Module}-\operatorname{Path}(p)\ \Downarrow \ \mathsf{ok}\quad \operatorname{Fold}(p)\ \notin \ \operatorname{dom}(\mathsf{Seen}) \\
\rule{18em}{0.4pt} \\
\langle \operatorname{DiscScan}(S,\ A,\ d\mathbin{::} \mathsf{ds},\ M,\ \mathsf{Seen})\rangle \ \to \ \langle \operatorname{DiscScan}(S,\ A,\ \mathsf{ds},\ M\ \mathbin{++} \ [p],\ \mathsf{Seen}\ \cup \ \{\operatorname{Fold}(p)\ \mapsto \ p\})\rangle 
\end{array}
```

**(Disc-Collision)**

```math
\begin{array}{l}
\Gamma \ \vdash \ d\ :\ \mathsf{ModuleDir}\quad \Gamma \ \vdash \ \operatorname{ModulePath}(d,\ S,\ A)\ =\ p\quad \Gamma \ \vdash \ \mathsf{WF}-\mathsf{Module}-\operatorname{Path}(p)\ \Downarrow \ \mathsf{ok}\quad \operatorname{Fold}(p)\ \in \ \operatorname{dom}(\mathsf{Seen})\quad \mathsf{Seen}[\operatorname{Fold}(p)]\ \ne \ p \\
\rule{18em}{0.4pt} \\
\langle \operatorname{DiscScan}(S,\ A,\ d\mathbin{::} \mathsf{ds},\ M,\ \mathsf{Seen})\rangle \ \to \ \langle \operatorname{Error}(\operatorname{Code}(\mathsf{Disc}-\mathsf{Collision}))\rangle 
\end{array}
```

**(Disc-Invalid-Component)**

```math
\begin{array}{l}
\Gamma \ \vdash \ d\ :\ \mathsf{ModuleDir}\quad \Gamma \ \vdash \ \operatorname{ModulePath}(d,\ S,\ A)\ =\ p\quad \Gamma \ \vdash \ \mathsf{WF}-\mathsf{Module}-\operatorname{Path}(p)\ \Uparrow \ c \\
\rule{18em}{0.4pt} \\
\langle \operatorname{DiscScan}(S,\ A,\ d\mathbin{::} \mathsf{ds},\ M,\ \mathsf{Seen})\rangle \ \to \ \langle \operatorname{Error}(c)\rangle 
\end{array}
```

**(Disc-Rel-Fail)**

```math
\begin{array}{l}
\Gamma \ \vdash \ d\ :\ \mathsf{ModuleDir}\quad \operatorname{relative}(d,\ S)\ \Uparrow  \\
\rule{18em}{0.4pt} \\
\langle \operatorname{DiscScan}(S,\ A,\ d\mathbin{::} \mathsf{ds},\ M,\ \mathsf{Seen})\rangle \ \to \ \langle \operatorname{Error}(\operatorname{Code}(\mathsf{Disc}-\mathsf{Rel}-\mathsf{Fail}))\rangle 
\end{array}
```

**(Disc-Done)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\langle \operatorname{DiscScan}(S,\ A,\ [],\ M,\ \mathsf{Seen})\rangle \ \to \ \langle \operatorname{DiscDone}(M)\rangle 
\end{array}
```

**Qualified Lookup.**

```math
\begin{array}{l}
P\ =\ \operatorname{Project}(\Gamma ) \\
m\ =\ \operatorname{CurrentModule}(\Gamma ) \\
\operatorname{AllModulePaths}(P)\ =\ \bigcup \_\{A\ \in \ P.\mathsf{assemblies}\}\ A.\mathsf{modules} \\
\operatorname{AsmOfPath}(p)\ =\ p[0]\quad \mathsf{if}\ \mid p\mid \ \ge \ 1 \\
\operatorname{AsmOfModule}(m)\ =\ \operatorname{AsmOfPath}(m) \\
\operatorname{ImportDecls}(m)\ =\ [d\ \mid \ d\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \land \ d\ =\ \operatorname{ImportDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_)] \\
\operatorname{ImportPaths}(m)\ =\ [\mathsf{mp}\ \mid \ \operatorname{ImportDecl}(\_,\ \_,\ \mathsf{path},\ \_,\ \_,\ \_)\ \in \ \operatorname{ImportDecls}(m)\ \land \ \Gamma \ \vdash \ \operatorname{ResolveImportPath}(\mathsf{path})\ \Downarrow \ \mathsf{mp}] \\
\operatorname{VisibleAssemblies}(m)\ =\ \{\operatorname{AsmOfModule}(m)\}\ \cup \ \{\operatorname{AsmOfPath}(p)\ \mid \ p\ \in \ \operatorname{ImportPaths}(m)\} \\
\operatorname{PublicAPI}(m)\ \Leftrightarrow \ \exists \ \mathsf{it}\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}.\ \operatorname{Vis}(\mathsf{it})\ =\ \texttt{public} \\
\operatorname{VisibleModulePaths}(m)\ =\ \{\ p\ \mid \ p\ \in \ \operatorname{AllModulePaths}(P)\ \land \ \operatorname{AsmOfPath}(p)\ \in \ \operatorname{VisibleAssemblies}(m)\ \} \\
\mathsf{AllModuleNames}\ =\ \{\ \operatorname{StringOfPath}(p)\ \mid \ p\ \in \ \operatorname{AllModulePaths}(P)\ \} \\
\operatorname{VisibleModuleNames}(m)\ =\ \{\ \operatorname{StringOfPath}(p)\ \mid \ p\ \in \ \operatorname{VisibleModulePaths}(m)\ \} \\
\mathsf{ModulePaths}\ =\ \operatorname{VisibleModulePaths}(m) \\
\mathsf{ModuleNames}\ =\ \operatorname{VisibleModuleNames}(m) \\
\mathsf{Alias}\ =\ \operatorname{AliasMap}(m) \\
\mathsf{AllModules}\ =\ \operatorname{AllModulePaths}(P)
\end{array}
```

**Module Prefix Resolution.**

```math
\operatorname{ModulePathPrefix}(\mathsf{path},\ \mathsf{pref})\ \Leftrightarrow \ \exists \ \mathsf{rest}.\ \mathsf{path}\ =\ \mathsf{pref}\ \mathbin{++} \ \mathsf{rest}
```

**(AliasExpand-None)**

```math
\begin{array}{l}
\mathsf{path}\ =\ a\mathbin{::} \mathsf{rest}\quad a\ \notin \ \operatorname{dom}(\mathsf{Alias}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{AliasExpand}(\mathsf{path},\ \mathsf{Alias})\ \Downarrow \ \mathsf{path}
\end{array}
```

**(AliasExpand-Yes)**

```math
\begin{array}{l}
\mathsf{path}\ =\ a\mathbin{::} \mathsf{rest}\quad a\ \in \ \operatorname{dom}(\mathsf{Alias})\quad \mathsf{Alias}[a]\ =\ p_{a} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{AliasExpand}(\mathsf{path},\ \mathsf{Alias})\ \Downarrow \ p_{a}\ \mathbin{++} \ \mathsf{rest}
\end{array}
```

```math
\operatorname{CurrentAsmPath}(m,\ \mathsf{path})\ =\ [\operatorname{AsmOfModule}(m)]\ \mathbin{++} \ \mathsf{path}
```

**(ModulePrefix-Direct)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{AliasExpand}(\mathsf{path},\ \mathsf{Alias})\ \Downarrow \ \mathsf{path}'\quad \exists \ p\ \in \ \mathsf{AllModules},\ \operatorname{ModulePathPrefix}(\mathsf{path}',\ p)\quad p\ =\ \mathsf{argmax}\_\{q\ \in \ \mathsf{AllModules},\ \operatorname{ModulePathPrefix}(\mathsf{path}',\ q)\}\ \mid q\mid  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ModulePrefix}(\mathsf{path},\ \mathsf{AllModules},\ \mathsf{Alias})\ \Downarrow \ p
\end{array}
```

**(ModulePrefix-Current)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{AliasExpand}(\mathsf{path},\ \mathsf{Alias})\ \Downarrow \ \mathsf{path}'\quad \lnot \ \exists \ p\ \in \ \mathsf{AllModules}.\ \operatorname{ModulePathPrefix}(\mathsf{path}',\ p)\quad \mathsf{path}''\ =\ \operatorname{CurrentAsmPath}(m,\ \mathsf{path}')\quad \exists \ p\ \in \ \mathsf{AllModules},\ \operatorname{ModulePathPrefix}(\mathsf{path}'',\ p)\quad p\ =\ \mathsf{argmax}\_\{q\ \in \ \mathsf{AllModules},\ \operatorname{ModulePathPrefix}(\mathsf{path}'',\ q)\}\ \mid q\mid  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ModulePrefix}(\mathsf{path},\ \mathsf{AllModules},\ \mathsf{Alias})\ \Downarrow \ p
\end{array}
```

**(ModulePrefix-None)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{AliasExpand}(\mathsf{path},\ \mathsf{Alias})\ \Downarrow \ \mathsf{path}'\quad \lnot \ \exists \ p\ \in \ \mathsf{AllModules}.\ \operatorname{ModulePathPrefix}(\mathsf{path}',\ p)\quad \mathsf{path}''\ =\ \operatorname{CurrentAsmPath}(m,\ \mathsf{path}')\quad \lnot \ \exists \ p\ \in \ \mathsf{AllModules}.\ \operatorname{ModulePathPrefix}(\mathsf{path}'',\ p) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ModulePrefix}(\mathsf{path},\ \mathsf{AllModules},\ \mathsf{Alias})\ \uparrow 
\end{array}
```

**(Resolve-ModulePath-Direct)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{AliasExpand}(\mathsf{path},\ \mathsf{Alias})\ \Downarrow \ \mathsf{path}'\quad \operatorname{StringOfPath}(\mathsf{path}')\ \in \ \mathsf{ModuleNames} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveModulePath}(\mathsf{path},\ \mathsf{Alias},\ \mathsf{ModuleNames})\ \Downarrow \ \mathsf{path}'
\end{array}
```

**(Resolve-ModulePath-Current)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{AliasExpand}(\mathsf{path},\ \mathsf{Alias})\ \Downarrow \ \mathsf{path}'\quad \operatorname{StringOfPath}(\mathsf{path}')\ \notin \ \mathsf{ModuleNames}\quad \mathsf{path}''\ =\ \operatorname{CurrentAsmPath}(m,\ \mathsf{path}')\quad \operatorname{StringOfPath}(\mathsf{path}'')\ \in \ \mathsf{ModuleNames} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveModulePath}(\mathsf{path},\ \mathsf{Alias},\ \mathsf{ModuleNames})\ \Downarrow \ \mathsf{path}''
\end{array}
```

**(ResolveModulePath-Err)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{AliasExpand}(\mathsf{path},\ \mathsf{Alias})\ \Downarrow \ \mathsf{path}'\quad \operatorname{StringOfPath}(\mathsf{path}')\ \notin \ \mathsf{ModuleNames}\quad \mathsf{path}''\ =\ \operatorname{CurrentAsmPath}(m,\ \mathsf{path}')\quad \operatorname{StringOfPath}(\mathsf{path}'')\ \notin \ \mathsf{ModuleNames}\quad c\ =\ \operatorname{Code}(\mathsf{ResolveModulePath}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveModulePath}(\mathsf{path},\ \mathsf{Alias},\ \mathsf{ModuleNames})\ \Uparrow \ c
\end{array}
```

```math
\begin{array}{l}
\operatorname{ModuleByPath}(P,\ p)\ =\ m\ \Leftrightarrow \ \operatorname{ASTModule}(P,\ p)\ =\ m \\
\operatorname{ModuleOfPath}(\mathsf{path})\ =\ \mathsf{mp}\ \Leftrightarrow \ \operatorname{SplitLast}(\mathsf{path})\ =\ (\mathsf{mp},\ \mathsf{name})
\end{array}
```

```math
\operatorname{ItemNames}(\mathsf{mp})\ =\ \{\ n\ \mid \ \operatorname{NameMap}(P,\ \mathsf{mp})[n].\mathsf{kind}\ \in \ \{\mathsf{Value},\ \mathsf{Type},\ \mathsf{Class}\}\ \}
```

**(ItemOfPath)**
|path| ≥ 2    SplitLast(path) = (mp_raw, name)    Γ ⊢ ResolveImportPath(mp_raw) ⇓ mp    IdKey(name) ∈ ItemNames(mp)

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ItemOfPath}(\mathsf{path})\ \Downarrow \ (\mathsf{mp},\ \mathsf{name})
\end{array}
```

**(ItemOfPath-None)**

```math
\begin{array}{l}
\lnot \ (\mid \mathsf{path}\mid \ \ge \ 2\ \land \ \operatorname{SplitLast}(\mathsf{path})\ =\ (\mathsf{mp}_{\mathsf{raw}},\ \mathsf{name})\ \land \ \Gamma \ \vdash \ \operatorname{ResolveImportPath}(\mathsf{mp}_{\mathsf{raw}})\ \Downarrow \ \mathsf{mp}\ \land \ \operatorname{IdKey}(\mathsf{name})\ \in \ \operatorname{ItemNames}(\mathsf{mp})) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ItemOfPath}(\mathsf{path})\ \uparrow 
\end{array}
```

```math
\begin{array}{l}
\operatorname{ImportRequired}(m,\ \mathsf{path})\ \Leftrightarrow \ \operatorname{AsmOfPath}(\mathsf{path})\ \ne \ \operatorname{AsmOfModule}(m) \\
\operatorname{ImportCovers}(m,\ \mathsf{path})\ \Leftrightarrow \ \exists \ p\ \in \ \operatorname{ImportPaths}(m).\ \operatorname{ModulePathPrefix}(p,\ \mathsf{path}) \\
\mathsf{ImportOkJudg}\ =\ \{\mathsf{ImportOk}\}
\end{array}
```

**(Import-Ok-Local)**

```math
\begin{array}{l}
\lnot \ \operatorname{ImportRequired}(m,\ \mathsf{path}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ImportOk}(m,\ \mathsf{path})\ \Downarrow \ \mathsf{ok}
\end{array}
```

**(Import-Ok-Covered)**
ImportRequired(m, path)    ImportCovers(m, path)

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ImportOk}(m,\ \mathsf{path})\ \Downarrow \ \mathsf{ok}
\end{array}
```

**(Import-Ok-Err)**

```math
\begin{array}{l}
\operatorname{ImportRequired}(m,\ \mathsf{path})\quad \lnot \ \operatorname{ImportCovers}(m,\ \mathsf{path})\quad c\ =\ \operatorname{Code}(\mathsf{Import}-\mathsf{Using}-\mathsf{Missing}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ImportOk}(m,\ \mathsf{path})\ \Uparrow \ c
\end{array}
```

**(Resolve-Import-Direct)**

```math
\begin{array}{l}
\operatorname{StringOfPath}(\mathsf{path})\ \in \ \mathsf{AllModuleNames} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveImportPath}(\mathsf{path})\ \Downarrow \ \mathsf{path}
\end{array}
```

**(Resolve-Import-Current)**

```math
\begin{array}{l}
\operatorname{StringOfPath}(\mathsf{path})\ \notin \ \mathsf{AllModuleNames}\quad \mathsf{path}'\ =\ \operatorname{CurrentAsmPath}(m,\ \mathsf{path})\quad \operatorname{StringOfPath}(\mathsf{path}')\ \in \ \mathsf{AllModuleNames} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveImportPath}(\mathsf{path})\ \Downarrow \ \mathsf{path}'
\end{array}
```

**(Resolve-Import-Err)**

```math
\begin{array}{l}
\operatorname{StringOfPath}(\mathsf{path})\ \notin \ \mathsf{AllModuleNames}\quad \mathsf{path}'\ =\ \operatorname{CurrentAsmPath}(m,\ \mathsf{path})\quad \operatorname{StringOfPath}(\mathsf{path}')\ \notin \ \mathsf{AllModuleNames}\quad c\ =\ \operatorname{Code}(\mathsf{Resolve}-\mathsf{Import}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveImportPath}(\mathsf{path})\ \Uparrow \ c
\end{array}
```

**(Resolve-Using-Ok)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ItemOfPath}(\mathsf{path})\ \Downarrow \ (\mathsf{mp},\ \mathsf{name}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveUsingPath}(\mathsf{path})\ \Downarrow \ \langle \mathsf{mp},\ \mathsf{name}\rangle 
\end{array}
```

**(Resolve-Using-Err)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ItemOfPath}(\mathsf{path})\ \uparrow \quad c\ =\ \operatorname{Code}(\mathsf{Resolve}-\mathsf{Using}-\mathsf{None}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ResolveUsingPath}(\mathsf{path})\ \Uparrow \ c
\end{array}
```

Accessibility of resolved items is defined by Chapter 7.

**Initialization Dependency Analysis.**

```math
\mathsf{env}_{m}\ =\ \langle \mathsf{self}\ =\ m,\ \mathsf{Modules}\ =\ \mathsf{AllModules},\ \mathsf{Alias}\ =\ \operatorname{AliasMap}(m),\ \mathsf{UsingValueMap}\ =\ \operatorname{UsingValueMap}(m),\ \mathsf{UsingTypeMap}\ =\ \operatorname{UsingTypeMap}(m)\rangle 
```

**(Reachable-Edge)**

```math
\begin{array}{l}
(u,\ v)\ \in \ E \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Reachable}(u,\ v,\ E)
\end{array}
```

**(Reachable-Step)**

```math
\begin{array}{l}
(u,\ w)\ \in \ E\quad \Gamma \ \vdash \ \operatorname{Reachable}(w,\ v,\ E) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Reachable}(u,\ v,\ E)
\end{array}
```

```math
\begin{array}{l}
\operatorname{FullPath}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{path}\ \mathbin{++} \ [\mathsf{name}] \\
\operatorname{EnumPath}(\mathsf{path})\ =\ p\ \Leftrightarrow \ \operatorname{SplitLast}(\mathsf{path})\ =\ (p,\ n) \\
\operatorname{VariantName}(\mathsf{path})\ =\ n\ \Leftrightarrow \ \operatorname{SplitLast}(\mathsf{path})\ =\ (p,\ n)
\end{array}
```

```math
\mathsf{TypeRefsJudg}\ =\ \{\mathsf{TypeRefsTy},\ \mathsf{TypeRefsRef},\ \mathsf{TypeRefsExpr},\ \mathsf{TypeRefsPat},\ \mathsf{TypeRefsArgs}\}
```
Modules = env.Modules
Alias = env.Alias
UsingTypeMap = env.UsingTypeMap

**(TypeRef-Path)**
|path| ≥ 2    Γ ⊢ ModulePrefix(path, Modules, Alias) ⇓ mp    mp ≠ env.self

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypePath}(\mathsf{path}),\ \mathsf{env})\ \Downarrow \ \{\mathsf{mp}\}
\end{array}
```

**(TypeRef-Using)**

```math
\begin{array}{l}
\mathsf{path}\ =\ [\mathsf{name}]\quad \mathsf{name}\ \in \ \operatorname{dom}(\mathsf{UsingTypeMap})\quad \mathsf{UsingTypeMap}[\mathsf{name}]\ \ne \ \mathsf{env}.\mathsf{self} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypePath}(\mathsf{path}),\ \mathsf{env})\ \Downarrow \ \{\mathsf{UsingTypeMap}[\mathsf{name}]\}
\end{array}
```

**(TypeRef-Path-Local)**

```math
\begin{array}{l}
(\mid \mathsf{path}\mid \ \ne \ 1\ \lor \ (\mathsf{path}\ =\ [\mathsf{name}]\ \land \ \mathsf{name}\ \notin \ \operatorname{dom}(\mathsf{UsingTypeMap})))\quad (\Gamma \ \vdash \ \operatorname{ModulePrefix}(\mathsf{path},\ \mathsf{Modules},\ \mathsf{Alias})\ \Uparrow \ \lor \ \Gamma \ \vdash \ \operatorname{ModulePrefix}(\mathsf{path},\ \mathsf{Modules},\ \mathsf{Alias})\ \Downarrow \ \mathsf{env}.\mathsf{self}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypePath}(\mathsf{path}),\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
```

**(TypeRef-Dynamic)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypePath}(\mathsf{path}),\ \mathsf{env})\ \Downarrow \ T \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeDynamic}(\mathsf{path}),\ \mathsf{env})\ \Downarrow \ T
\end{array}
```

**(TypeRef-ModalState)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsRef}(\mathsf{modal}_{\mathsf{ref}},\ \mathsf{env})\ \Downarrow \ T \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ \mathsf{state}),\ \mathsf{env})\ \Downarrow \ T
\end{array}
```

**(TypeRef-Apply)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypePath}(\mathsf{path}),\ \mathsf{env})\ \Downarrow \ T_{p}\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{TypeRefsTy}(\mathsf{args}_{i},\ \mathsf{env})\ \Downarrow \ T_{i} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeApply}(\mathsf{path},\ \mathsf{args}),\ \mathsf{env})\ \Downarrow \ T_{p}\ \cup \ \bigcup \_\{i=1\}^n\ T_{i}
\end{array}
```

**(TypeRef-Perm)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\mathsf{base},\ \mathsf{env})\ \Downarrow \ T \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypePerm}(\mathsf{perm},\ \mathsf{base}),\ \mathsf{env})\ \Downarrow \ T
\end{array}
```

**(TypeRef-Prim)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypePrim}(\_),\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
```

**(TypeRef-Tuple)**

```math
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{TypeRefsTy}(t_{i},\ \mathsf{env})\ \Downarrow \ T_{i} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeTuple}([t_{1},\ \ldots ,\ t_{n}]),\ \mathsf{env})\ \Downarrow \ \bigcup \_\{i=1\}^n\ T_{i}
\end{array}
```

**(TypeRef-Array)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\mathsf{elem},\ \mathsf{env})\ \Downarrow \ T_{e}\quad \Gamma \ \vdash \ \operatorname{TypeRefsExpr}(\mathsf{size}_{\mathsf{expr}},\ \mathsf{env})\ \Downarrow \ T_{s} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeArray}(\mathsf{elem},\ \mathsf{size}_{\mathsf{expr}}),\ \mathsf{env})\ \Downarrow \ T_{e}\ \cup \ T_{s}
\end{array}
```

**(TypeRef-Slice)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\mathsf{elem},\ \mathsf{env})\ \Downarrow \ T \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeSlice}(\mathsf{elem}),\ \mathsf{env})\ \Downarrow \ T
\end{array}
```

**(TypeRef-Union)**

```math
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{TypeRefsTy}(t_{i},\ \mathsf{env})\ \Downarrow \ T_{i} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeUnion}([t_{1},\ \ldots ,\ t_{n}]),\ \mathsf{env})\ \Downarrow \ \bigcup \_\{i=1\}^n\ T_{i}
\end{array}
```

**(TypeRef-Func)**

```math
\begin{array}{l}
\forall \ i,\ \mathsf{params}_{i}\ =\ \langle m_{i},\ t_{i}\rangle \quad \Gamma \ \vdash \ \operatorname{TypeRefsTy}(t_{i},\ \mathsf{env})\ \Downarrow \ T_{i}\quad \Gamma \ \vdash \ \operatorname{TypeRefsTy}(\mathsf{ret},\ \mathsf{env})\ \Downarrow \ T_{r} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeFunc}([\mathsf{params}_{1},\ \ldots ,\ \mathsf{params}_{n}],\ \mathsf{ret}),\ \mathsf{env})\ \Downarrow \ (\bigcup \_\{i=1\}^n\ T_{i})\ \cup \ T_{r}
\end{array}
```

**(TypeRef-String)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeString}(\_),\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
```

**(TypeRef-Bytes)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeBytes}(\_),\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
```

**(TypeRef-Ptr)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\mathsf{elem},\ \mathsf{env})\ \Downarrow \ T \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypePtr}(\mathsf{elem},\ \_),\ \mathsf{env})\ \Downarrow \ T
\end{array}
```

**(TypeRef-RawPtr)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\mathsf{elem},\ \mathsf{env})\ \Downarrow \ T \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeRawPtr}(\_,\ \mathsf{elem}),\ \mathsf{env})\ \Downarrow \ T
\end{array}
```

**(TypeRef-Range)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\mathsf{base},\ \mathsf{env})\ \Downarrow \ T \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeRange}(\mathsf{base}),\ \mathsf{env})\ \Downarrow \ T
\end{array}
```

**(TypeRef-RangeInclusive)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\mathsf{base},\ \mathsf{env})\ \Downarrow \ T \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeRangeInclusive}(\mathsf{base}),\ \mathsf{env})\ \Downarrow \ T
\end{array}
```

**(TypeRef-RangeFrom)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\mathsf{base},\ \mathsf{env})\ \Downarrow \ T \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeRangeFrom}(\mathsf{base}),\ \mathsf{env})\ \Downarrow \ T
\end{array}
```

**(TypeRef-RangeTo)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\mathsf{base},\ \mathsf{env})\ \Downarrow \ T \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeRangeTo}(\mathsf{base}),\ \mathsf{env})\ \Downarrow \ T
\end{array}
```

**(TypeRef-RangeToInclusive)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\mathsf{base},\ \mathsf{env})\ \Downarrow \ T \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeRangeToInclusive}(\mathsf{base}),\ \mathsf{env})\ \Downarrow \ T
\end{array}
```

**(TypeRef-RangeFull)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\mathsf{TypeRangeFull},\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
```

**(TypeRef-Ref-Path)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypePath}(\mathsf{path}),\ \mathsf{env})\ \Downarrow \ T \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsRef}(\operatorname{TypePath}(\mathsf{path}),\ \mathsf{env})\ \Downarrow \ T
\end{array}
```

**(TypeRef-Ref-Apply)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeApply}(\mathsf{path},\ \mathsf{args}),\ \mathsf{env})\ \Downarrow \ T \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsRef}(\operatorname{TypeApply}(\mathsf{path},\ \mathsf{args}),\ \mathsf{env})\ \Downarrow \ T
\end{array}
```

**(TypeRef-Ref-ModalState)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ \mathsf{state}),\ \mathsf{env})\ \Downarrow \ T \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsRef}(\operatorname{ModalStateRef}(\mathsf{modal}_{\mathsf{ref}},\ \mathsf{state}),\ \mathsf{env})\ \Downarrow \ T
\end{array}
```

**(TypeRef-RecordExpr)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsRef}(r,\ \mathsf{env})\ \Downarrow \ T_{t}\quad \Gamma \ \vdash \ \operatorname{TypeRefsExprs}(\mathsf{fields},\ \mathsf{env})\ \Downarrow \ T_{e} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsExpr}(\operatorname{RecordExpr}(r,\ \mathsf{fields}),\ \mathsf{env})\ \Downarrow \ T_{t}\ \cup \ T_{e}
\end{array}
```

**(TypeRef-EnumLiteral)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypePath}(\operatorname{EnumPath}(\mathsf{path})),\ \mathsf{env})\ \Downarrow \ T_{t}\quad \Gamma \ \vdash \ \operatorname{TypeRefsEnumPayload}(\mathsf{payload}_{\mathsf{opt}},\ \mathsf{env})\ \Downarrow \ T_{p} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsExpr}(\operatorname{EnumLiteral}(\mathsf{path},\ \mathsf{payload}_{\mathsf{opt}}),\ \mathsf{env})\ \Downarrow \ T_{t}\ \cup \ T_{p}
\end{array}
```

**(TypeRef-QualBrace)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypePath}(\operatorname{FullPath}(\mathsf{path},\ \mathsf{name})),\ \mathsf{env})\ \Downarrow \ T_{t}\quad \Gamma \ \vdash \ \operatorname{TypeRefsExprs}(\mathsf{fields},\ \mathsf{env})\ \Downarrow \ T_{f} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsExpr}(\operatorname{QualifiedApply}(\mathsf{path},\ \mathsf{name},\ \operatorname{Brace}(\mathsf{fields})),\ \mathsf{env})\ \Downarrow \ T_{t}\ \cup \ T_{f}
\end{array}
```

**(TypeRef-Cast)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsExpr}(e,\ \mathsf{env})\ \Downarrow \ T_{e}\quad \Gamma \ \vdash \ \operatorname{TypeRefsTy}(\mathsf{ty},\ \mathsf{env})\ \Downarrow \ T_{t} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsExpr}(\operatorname{Cast}(e,\ \mathsf{ty}),\ \mathsf{env})\ \Downarrow \ T_{e}\ \cup \ T_{t}
\end{array}
```

**(TypeRef-Transmute)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsExpr}(e,\ \mathsf{env})\ \Downarrow \ T_{e}\quad \Gamma \ \vdash \ \operatorname{TypeRefsTy}(t_{1},\ \mathsf{env})\ \Downarrow \ T_{1}\quad \Gamma \ \vdash \ \operatorname{TypeRefsTy}(t_{2},\ \mathsf{env})\ \Downarrow \ T_{2} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsExpr}(\operatorname{TransmuteExpr}(t_{1},\ t_{2},\ e),\ \mathsf{env})\ \Downarrow \ T_{e}\ \cup \ T_{1}\ \cup \ T_{2}
\end{array}
```

**(TypeRef-CallTypeArgs)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsExpr}(\mathsf{callee},\ \mathsf{env})\ \Downarrow \ T_{c}\quad \Gamma \ \vdash \ \operatorname{TypeRefsArgs}(\mathsf{args},\ \mathsf{env})\ \Downarrow \ T_{a}\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{TypeRefsTy}(\mathsf{type}_{\mathsf{args}}[i],\ \mathsf{env})\ \Downarrow \ T_{i} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsExpr}(\operatorname{CallTypeArgs}(\mathsf{callee},\ \mathsf{type}_{\mathsf{args}},\ \mathsf{args}),\ \mathsf{env})\ \Downarrow \ T_{c}\ \cup \ T_{a}\ \cup \ \bigcup \_\{i=1\}^n\ T_{i}
\end{array}
```

```math
\begin{array}{l}
\mathsf{TypeRefsExprRules}\ =\ \{\mathsf{TypeRef}-\mathsf{RecordExpr},\ \mathsf{TypeRef}-\mathsf{EnumLiteral},\ \mathsf{TypeRef}-\mathsf{QualBrace},\ \mathsf{TypeRef}-\mathsf{Cast},\ \mathsf{TypeRef}-\mathsf{Transmute},\ \mathsf{TypeRef}-\mathsf{CallTypeArgs},\ \mathsf{TypeRef}-\mathsf{Expr}-\mathsf{Sub}\} \\
\operatorname{NoSpecificTypeRefsExpr}(e)\ \Leftrightarrow \ \lnot \ \exists \ r\ \in \ \mathsf{TypeRefsExprRules}\ \setminus \ \{\mathsf{TypeRef}-\mathsf{Expr}-\mathsf{Sub}\}.\ \operatorname{PremisesHold}(r,\ e)
\end{array}
```

**(TypeRef-Expr-Sub)**

```math
\begin{array}{l}
\operatorname{NoSpecificTypeRefsExpr}(e)\quad \operatorname{Children_LTR}(e)\ =\ [e_{1},\ \ldots ,\ e_{n}]\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{TypeRefsExpr}(e_{i},\ \mathsf{env})\ \Downarrow \ T_{i} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsExpr}(e,\ \mathsf{env})\ \Downarrow \ \bigcup \_\{i=1\}^n\ T_{i}
\end{array}
```

**(TypeRef-RecordPattern)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypePath}(\mathsf{tp}),\ \mathsf{env})\ \Downarrow \ T_{t}\quad \Gamma \ \vdash \ \operatorname{TypeRefsFields}(\mathsf{fields},\ \mathsf{env})\ \Downarrow \ T_{f} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsPat}(\operatorname{RecordPattern}(\mathsf{tp},\ \mathsf{fields}),\ \mathsf{env})\ \Downarrow \ T_{t}\ \cup \ T_{f}
\end{array}
```

**(TypeRef-EnumPattern)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypePath}(\mathsf{tp}),\ \mathsf{env})\ \Downarrow \ T_{t}\quad \Gamma \ \vdash \ \operatorname{TypeRefsPayload}(\mathsf{payload},\ \mathsf{env})\ \Downarrow \ T_{p} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsPat}(\operatorname{EnumPattern}(\mathsf{tp},\ \_,\ \mathsf{payload}),\ \mathsf{env})\ \Downarrow \ T_{t}\ \cup \ T_{p}
\end{array}
```

**(TypeRef-LiteralPattern)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsPat}(\operatorname{LiteralPattern}(\_),\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
```

**(TypeRef-WildcardPattern)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsPat}(\mathsf{WildcardPattern},\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
```

**(TypeRef-IdentifierPattern)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsPat}(\operatorname{IdentifierPattern}(\_),\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
```

**(TypeRef-TuplePattern)**

```math
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{TypeRefsPat}(p_{i},\ \mathsf{env})\ \Downarrow \ T_{i} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsPat}(\operatorname{TuplePattern}([p_{1},\ \ldots ,\ p_{n}]),\ \mathsf{env})\ \Downarrow \ \bigcup \_\{i=1\}^n\ T_{i}
\end{array}
```

**(TypeRef-ModalPattern-None)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsPat}(\operatorname{ModalPattern}(\_,\ \bot ),\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
```

**(TypeRef-ModalPattern-Record)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsFields}(\mathsf{fields},\ \mathsf{env})\ \Downarrow \ T \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsPat}(\operatorname{ModalPattern}(\_,\ \operatorname{ModalRecordPayload}(\mathsf{fields})),\ \mathsf{env})\ \Downarrow \ T
\end{array}
```

**(TypeRef-RangePattern)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsPat}(p_{l},\ \mathsf{env})\ \Downarrow \ T_{l}\quad \Gamma \ \vdash \ \operatorname{TypeRefsPat}(p_{h},\ \mathsf{env})\ \Downarrow \ T_{h} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsPat}(\operatorname{RangePattern}(\_,\ p_{l},\ p_{h}),\ \mathsf{env})\ \Downarrow \ T_{l}\ \cup \ T_{h}
\end{array}
```

**(TypeRef-Field-Explicit)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsPat}(p,\ \mathsf{env})\ \Downarrow \ T \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsPat}(\langle \mathsf{name},\ \mathsf{pattern}_{\mathsf{opt}}\ =\ p,\ \mathsf{span}\rangle ,\ \mathsf{env})\ \Downarrow \ T
\end{array}
```

**(TypeRef-Field-Implicit)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsPat}(\langle \mathsf{name},\ \mathsf{pattern}_{\mathsf{opt}}\ =\ \bot ,\ \mathsf{span}\rangle ,\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
```

**(TypeRefsExprs-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsExprs}([],\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
```

**(TypeRefsExprs-Cons)**

```math
\begin{array}{l}
f\ =\ \langle \mathsf{name},\ e\rangle \quad \Gamma \ \vdash \ \operatorname{TypeRefsExpr}(e,\ \mathsf{env})\ \Downarrow \ T_{e}\quad \Gamma \ \vdash \ \operatorname{TypeRefsExprs}(\mathsf{fs},\ \mathsf{env})\ \Downarrow \ T_{f} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsExprs}(f\mathbin{::} \mathsf{fs},\ \mathsf{env})\ \Downarrow \ T_{e}\ \cup \ T_{f}
\end{array}
```

```math
\mathsf{TypeRefsArgsJudg}\ =\ \{\mathsf{TypeRefsArgs}\}
```

**(TypeRefsArgs-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsArgs}([],\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
```

**(TypeRefsArgs-Cons)**

```math
\begin{array}{l}
a\ =\ \langle \mathsf{moved},\ e,\ \mathsf{span}\rangle \quad \Gamma \ \vdash \ \operatorname{TypeRefsExpr}(e,\ \mathsf{env})\ \Downarrow \ T_{e}\quad \Gamma \ \vdash \ \operatorname{TypeRefsArgs}(\mathsf{rest},\ \mathsf{env})\ \Downarrow \ T_{r} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsArgs}(a\mathbin{::} \mathsf{rest},\ \mathsf{env})\ \Downarrow \ T_{e}\ \cup \ T_{r}
\end{array}
```

**(TypeRefsEnumPayload-None)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsEnumPayload}(\bot ,\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
```

**(TypeRefsEnumPayload-Tuple)**

```math
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{TypeRefsExpr}(e_{i},\ \mathsf{env})\ \Downarrow \ T_{i} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsEnumPayload}(\operatorname{Paren}([e_{1},\ \ldots ,\ e_{n}]),\ \mathsf{env})\ \Downarrow \ \bigcup \_\{i=1\}^n\ T_{i}
\end{array}
```

**(TypeRefsEnumPayload-Record)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsExprs}(\mathsf{fields},\ \mathsf{env})\ \Downarrow \ T \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsEnumPayload}(\operatorname{Brace}(\mathsf{fields}),\ \mathsf{env})\ \Downarrow \ T
\end{array}
```

**(TypeRefsFields-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsFields}([],\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
```

**(TypeRefsFields-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsPat}(f,\ \mathsf{env})\ \Downarrow \ T_{f}\quad \Gamma \ \vdash \ \operatorname{TypeRefsFields}(\mathsf{fs},\ \mathsf{env})\ \Downarrow \ T_{s} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsFields}(f\mathbin{::} \mathsf{fs},\ \mathsf{env})\ \Downarrow \ T_{f}\ \cup \ T_{s}
\end{array}
```

**(TypeRefsPayload-None)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsPayload}(\bot ,\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
```

**(TypeRefsPayload-Tuple)**

```math
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{TypeRefsPat}(p_{i},\ \mathsf{env})\ \Downarrow \ T_{i} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsPayload}(\operatorname{TuplePayloadPattern}([p_{1},\ \ldots ,\ p_{n}]),\ \mathsf{env})\ \Downarrow \ \bigcup \_\{i=1\}^n\ T_{i}
\end{array}
```

**(TypeRefsPayload-Record)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsFields}(\mathsf{fields},\ \mathsf{env})\ \Downarrow \ T \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{TypeRefsPayload}(\operatorname{RecordPayloadPattern}(\mathsf{fields}),\ \mathsf{env})\ \Downarrow \ T
\end{array}
```

UsingValueMap = env.UsingValueMap

```math
\mathsf{ValueRefsJudg}\ =\ \{\mathsf{ValueRefs},\ \mathsf{ValueRefsArgs},\ \mathsf{ValueRefsFields}\}
```

**(ValueRef-Ident)**

```math
\begin{array}{l}
\mathsf{name}\ \in \ \operatorname{dom}(\mathsf{UsingValueMap})\quad \mathsf{UsingValueMap}[\mathsf{name}]\ \ne \ \mathsf{env}.\mathsf{self} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ValueRefs}(\operatorname{Identifier}(\mathsf{name}),\ \mathsf{env})\ \Downarrow \ \{\mathsf{UsingValueMap}[\mathsf{name}]\}
\end{array}
```

**(ValueRef-Ident-Local)**

```math
\begin{array}{l}
\mathsf{name}\ \notin \ \operatorname{dom}(\mathsf{UsingValueMap}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ValueRefs}(\operatorname{Identifier}(\mathsf{name}),\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
```

**(ValueRef-Qual)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ModulePrefix}(\mathsf{path},\ \mathsf{Modules},\ \mathsf{Alias})\ \Downarrow \ \mathsf{mp}\quad \mathsf{mp}\ \ne \ \mathsf{env}.\mathsf{self} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ValueRefs}(\operatorname{QualifiedName}(\mathsf{path},\ \_),\ \mathsf{env})\ \Downarrow \ \{\mathsf{mp}\}
\end{array}
```

**(ValueRef-Qual-Local)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ModulePrefix}(\mathsf{path},\ \mathsf{Modules},\ \mathsf{Alias})\ \Uparrow \ \lor \ \Gamma \ \vdash \ \operatorname{ModulePrefix}(\mathsf{path},\ \mathsf{Modules},\ \mathsf{Alias})\ \Downarrow \ \mathsf{env}.\mathsf{self} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ValueRefs}(\operatorname{QualifiedName}(\mathsf{path},\ \_),\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
```

**(ValueRef-QualApply)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ModulePrefix}(\mathsf{path},\ \mathsf{Modules},\ \mathsf{Alias})\ \Downarrow \ \mathsf{mp}\quad \mathsf{mp}\ \ne \ \mathsf{env}.\mathsf{self}\quad \Gamma \ \vdash \ \operatorname{ValueRefsArgs}(\mathsf{args},\ \mathsf{env})\ \Downarrow \ V_{a} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ValueRefs}(\operatorname{QualifiedApply}(\mathsf{path},\ \_,\ \operatorname{Paren}(\mathsf{args})),\ \mathsf{env})\ \Downarrow \ \{\mathsf{mp}\}\ \cup \ V_{a}
\end{array}
```

**(ValueRef-QualApply-Local)**

```math
\begin{array}{l}
(\Gamma \ \vdash \ \operatorname{ModulePrefix}(\mathsf{path},\ \mathsf{Modules},\ \mathsf{Alias})\ \Uparrow \ \lor \ \Gamma \ \vdash \ \operatorname{ModulePrefix}(\mathsf{path},\ \mathsf{Modules},\ \mathsf{Alias})\ \Downarrow \ \mathsf{env}.\mathsf{self})\quad \Gamma \ \vdash \ \operatorname{ValueRefsArgs}(\mathsf{args},\ \mathsf{env})\ \Downarrow \ V_{a} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ValueRefs}(\operatorname{QualifiedApply}(\mathsf{path},\ \_,\ \operatorname{Paren}(\mathsf{args})),\ \mathsf{env})\ \Downarrow \ V_{a}
\end{array}
```

**(ValueRef-QualApply-Brace)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ValueRefsFields}(\mathsf{fields},\ \mathsf{env})\ \Downarrow \ V_{f} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ValueRefs}(\operatorname{QualifiedApply}(\mathsf{path},\ \_,\ \operatorname{Brace}(\mathsf{fields})),\ \mathsf{env})\ \Downarrow \ V_{f}
\end{array}
```

```math
\begin{array}{l}
\mathsf{ValueRefsRules}\ =\ \{\mathsf{ValueRef}-\mathsf{Ident},\ \mathsf{ValueRef}-\mathsf{Ident}-\mathsf{Local},\ \mathsf{ValueRef}-\mathsf{Qual},\ \mathsf{ValueRef}-\mathsf{Qual}-\mathsf{Local},\ \mathsf{ValueRef}-\mathsf{QualApply},\ \mathsf{ValueRef}-\mathsf{QualApply}-\mathsf{Local},\ \mathsf{ValueRef}-\mathsf{QualApply}-\mathsf{Brace},\ \mathsf{ValueRef}-\mathsf{Expr}-\mathsf{Sub}\} \\
\operatorname{NoSpecificValueRefsExpr}(e)\ \Leftrightarrow \ \lnot \ \exists \ r\ \in \ \mathsf{ValueRefsRules}\ \setminus \ \{\mathsf{ValueRef}-\mathsf{Expr}-\mathsf{Sub}\}.\ \operatorname{PremisesHold}(r,\ e)
\end{array}
```

**(ValueRef-Expr-Sub)**

```math
\begin{array}{l}
\operatorname{NoSpecificValueRefsExpr}(e)\quad \operatorname{Children_LTR}(e)\ =\ [e_{1},\ \ldots ,\ e_{n}]\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{ValueRefs}(e_{i},\ \mathsf{env})\ \Downarrow \ V_{i} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ValueRefs}(e,\ \mathsf{env})\ \Downarrow \ \bigcup \_\{i=1\}^n\ V_{i}
\end{array}
```

**(ValueRefsArgs-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ValueRefsArgs}([],\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
```

**(ValueRefsArgs-Cons)**

```math
\begin{array}{l}
a\ =\ \langle \mathsf{moved},\ e,\ \mathsf{span}\rangle \quad \Gamma \ \vdash \ \operatorname{ValueRefs}(e,\ \mathsf{env})\ \Downarrow \ V_{e}\quad \Gamma \ \vdash \ \operatorname{ValueRefsArgs}(\mathsf{args},\ \mathsf{env})\ \Downarrow \ V_{a} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ValueRefsArgs}(a\mathbin{::} \mathsf{args},\ \mathsf{env})\ \Downarrow \ V_{e}\ \cup \ V_{a}
\end{array}
```

**(ValueRefsFields-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ValueRefsFields}([],\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
```

**(ValueRefsFields-Cons)**

```math
\begin{array}{l}
f\ =\ \langle \mathsf{name},\ e\rangle \quad \Gamma \ \vdash \ \operatorname{ValueRefs}(e,\ \mathsf{env})\ \Downarrow \ V_{e}\quad \Gamma \ \vdash \ \operatorname{ValueRefsFields}(\mathsf{fs},\ \mathsf{env})\ \Downarrow \ V_{f} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ValueRefsFields}(f\mathbin{::} \mathsf{fs},\ \mathsf{env})\ \Downarrow \ V_{e}\ \cup \ V_{f}
\end{array}
```

```math
\begin{array}{l}
\operatorname{Elems}(v)\ = \\
\ \{v\}\quad \mathsf{if}\ v\ \in \ \mathsf{ASTNode} \\
\ \{x\ \mid \ x\ \in \ v\ \land \ x\ \in \ \mathsf{ASTNode}\}\quad \mathsf{if}\ v\ \in \ [\_] \\
\ \emptyset \quad \mathsf{if}\ v\ =\ \bot  \\
\ \emptyset \quad \mathsf{otherwise}
\end{array}
```

```math
\begin{array}{l}
\operatorname{Child}(x,\ y)\ \Leftrightarrow \ \exists \ C,\ a_{1},\ \ldots ,\ a_{k}.\ x\ =\ \operatorname{C}(a_{1},\ \ldots ,\ a_{k})\ \land \ y\ \in \ \bigcup \_\{i=1\}^k\ \operatorname{Elems}(a_{i}) \\
E_{\mathsf{child}}\ =\ \{\ (x,\ y)\ \mid \ \operatorname{Child}(x,\ y)\ \} \\
\operatorname{Subnode}(x,\ y)\ \Leftrightarrow \ x\ =\ y\ \lor \ \Gamma \ \vdash \ \operatorname{Reachable}(x,\ y,\ E_{\mathsf{child}})
\end{array}
```

```math
\begin{array}{l}
\operatorname{ExprNodes}(P,\ m)\ =\ \{\ e\ \mid \ e\ \in \ \mathsf{Expr}\ \land \ \operatorname{Subnode}(\operatorname{ASTModule}(P,\ m),\ e)\ \} \\
\operatorname{PatNodes}(P,\ m)\ =\ \{\ p\ \mid \ p\ \in \ \mathsf{Pattern}\ \land \ \operatorname{Subnode}(\operatorname{ASTModule}(P,\ m),\ p)\ \} \\
\operatorname{ExprNodesOf}(x)\ =\ \{\ e\ \mid \ e\ \in \ \mathsf{Expr}\ \land \ \operatorname{Subnode}(x,\ e)\ \}
\end{array}
```

```math
\begin{array}{l}
\operatorname{VariantPayloadTypeSet}(\bot )\ =\ \emptyset  \\
\operatorname{VariantPayloadTypeSet}(\operatorname{TuplePayload}(\mathsf{tys}))\ =\ \{\ t\ \mid \ t\ \in \ \mathsf{tys}\ \} \\
\operatorname{VariantPayloadTypeSet}(\operatorname{RecordPayload}(\mathsf{fields}))\ =\ \{\ t\ \mid \ \exists \ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{name},\ \mathsf{init}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}.\ \operatorname{FieldDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{name},\ t,\ \mathsf{init}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}})\ \in \ \mathsf{fields}\ \} \\
\operatorname{EnumVariantTypeSet}(\mathsf{variants})\ =\ \{\ t\ \mid \ \exists \ \mathsf{name},\ \mathsf{payload}_{\mathsf{opt}},\ \mathsf{disc}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}.\ \operatorname{VariantDecl}(\mathsf{name},\ \mathsf{payload}_{\mathsf{opt}},\ \mathsf{disc}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}})\ \in \ \mathsf{variants}\ \land \ t\ \in \ \operatorname{VariantPayloadTypeSet}(\mathsf{payload}_{\mathsf{opt}})\ \} \\
\operatorname{TypeOptSet}(\bot )\ =\ \emptyset  \\
\operatorname{TypeOptSet}(T)\ =\ \{T\} \\
\operatorname{ParamTypeSet}(\mathsf{params})\ =\ \{\ t\ \mid \ \exists \ \mathsf{mode},\ \mathsf{name}.\ \langle \mathsf{mode},\ \mathsf{name},\ t\rangle \ \in \ \mathsf{params}\ \} \\
\operatorname{RecvTypeSet}(\operatorname{ReceiverExplicit}(\_,\ t))\ =\ \{t\} \\
\operatorname{RecvTypeSet}(\operatorname{ReceiverShorthand}(\_))\ =\ \emptyset  \\
\operatorname{ClassPathTypeSet}(\mathsf{paths})\ =\ \{\ \operatorname{TypePath}(p)\ \mid \ p\ \in \ \mathsf{paths}\ \} \\
\operatorname{RecordFieldTypeSet}(\mathsf{members})\ =\ \{\ t\ \mid \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{name},\ \mathsf{init},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{FieldDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{name},\ t,\ \mathsf{init},\ \mathsf{span},\ \mathsf{doc})\ \in \ \mathsf{members}\ \} \\
\operatorname{RecordMethodRecvTypes}(\mathsf{members})\ =\ \{\ t\ \mid \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{ov},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{MethodDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{ov},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\ \in \ \mathsf{members}\ \land \ t\ \in \ \operatorname{RecvTypeSet}(\mathsf{recv})\ \} \\
\operatorname{RecordMethodParamTypes}(\mathsf{members})\ =\ \{\ t\ \mid \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{ov},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{MethodDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{ov},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\ \in \ \mathsf{members}\ \land \ t\ \in \ \operatorname{ParamTypeSet}(\mathsf{params})\ \} \\
\operatorname{RecordMethodRetTypes}(\mathsf{members})\ =\ \{\ t\ \mid \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{ov},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{MethodDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{ov},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\ \in \ \mathsf{members}\ \land \ t\ \in \ \operatorname{TypeOptSet}(\mathsf{ret})\ \} \\
\operatorname{RecordMemberTypeSet}(\mathsf{members})\ =\ \operatorname{RecordFieldTypeSet}(\mathsf{members})\ \cup \ \operatorname{RecordMethodRecvTypes}(\mathsf{members})\ \cup \ \operatorname{RecordMethodParamTypes}(\mathsf{members})\ \cup \ \operatorname{RecordMethodRetTypes}(\mathsf{members}) \\
\operatorname{ClassFieldTypeSet}(\mathsf{items})\ =\ \{\ t\ \mid \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{name},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{ClassFieldDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{name},\ t,\ \mathsf{span},\ \mathsf{doc})\ \in \ \mathsf{items}\ \} \\
\operatorname{ClassMethodRecvTypes}(\mathsf{items})\ =\ \{\ t\ \mid \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{ClassMethodDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\ \in \ \mathsf{items}\ \land \ t\ \in \ \operatorname{RecvTypeSet}(\mathsf{recv})\ \} \\
\operatorname{ClassMethodParamTypes}(\mathsf{items})\ =\ \{\ t\ \mid \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{ClassMethodDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\ \in \ \mathsf{items}\ \land \ t\ \in \ \operatorname{ParamTypeSet}(\mathsf{params})\ \} \\
\operatorname{ClassMethodRetTypes}(\mathsf{items})\ =\ \{\ t\ \mid \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{ClassMethodDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\ \in \ \mathsf{items}\ \land \ t\ \in \ \operatorname{TypeOptSet}(\mathsf{ret})\ \} \\
\operatorname{ClassItemTypeSet}(\mathsf{items})\ =\ \operatorname{ClassFieldTypeSet}(\mathsf{items})\ \cup \ \operatorname{ClassMethodRecvTypes}(\mathsf{items})\ \cup \ \operatorname{ClassMethodParamTypes}(\mathsf{items})\ \cup \ \operatorname{ClassMethodRetTypes}(\mathsf{items})
\end{array}
```

```math
\begin{array}{l}
\operatorname{TypePos_Static}(P,\ m)\ =\ \{\ t\ \mid \ \exists \ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{bind},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{bind},\ \mathsf{span},\ \mathsf{doc})\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \land \ \mathsf{bind}.\mathsf{type}_{\mathsf{opt}}\ =\ t\ \land \ t\ \ne \ \bot \ \} \\
\operatorname{TypePos_Proc}(P,\ m)\ =\ \{\ t\ \mid \ \exists \ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{return}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{ProcedureDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{return}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \land \ t\ \in \ (\operatorname{ParamTypeSet}(\mathsf{params})\ \cup \ \operatorname{TypeOptSet}(\mathsf{return}_{\mathsf{type}\_\mathsf{opt}}))\ \} \\
\operatorname{TypePos_Record}(P,\ m)\ =\ \{\ t\ \mid \ \exists \ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{impls},\ \mathsf{members},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{RecordDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{impls},\ \mathsf{members},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc})\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \land \ t\ \in \ (\operatorname{ClassPathTypeSet}(\mathsf{impls})\ \cup \ \operatorname{RecordMemberTypeSet}(\mathsf{members}))\ \} \\
\operatorname{TypePos_Enum}(P,\ m)\ =\ \{\ t\ \mid \ \exists \ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{impls},\ \mathsf{variants},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{EnumDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{impls},\ \mathsf{variants},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc})\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \land \ t\ \in \ (\operatorname{ClassPathTypeSet}(\mathsf{impls})\ \cup \ \operatorname{EnumVariantTypeSet}(\mathsf{variants}))\ \} \\
\operatorname{TypePos_Modal}(P,\ m)\ =\ \{\ t\ \mid \ \exists \ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{impls},\ \mathsf{states},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{ModalDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{impls},\ \mathsf{states},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc})\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \land \ t\ \in \ \operatorname{ClassPathTypeSet}(\mathsf{impls})\ \} \\
\operatorname{TypePos_Class}(P,\ m)\ =\ \{\ t\ \mid \ \exists \ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{modal},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{supers},\ \mathsf{items},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{ClassDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{modal},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{supers},\ \mathsf{items},\ \mathsf{span},\ \mathsf{doc})\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \land \ t\ \in \ (\operatorname{ClassPathTypeSet}(\mathsf{supers})\ \cup \ \operatorname{ClassItemTypeSet}(\mathsf{items}))\ \} \\
\operatorname{TypePos_Alias}(P,\ m)\ =\ \{\ t\ \mid \ \exists \ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{ty},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{TypeAliasDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{ty},\ \mathsf{span},\ \mathsf{doc})\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \land \ t\ =\ \mathsf{ty}\ \} \\
\operatorname{TypePositions}(P,\ m)\ =\ \operatorname{TypePos_Static}(P,\ m)\ \cup \ \operatorname{TypePos_Proc}(P,\ m)\ \cup \ \operatorname{TypePos_Record}(P,\ m)\ \cup \ \operatorname{TypePos_Enum}(P,\ m)\ \cup \ \operatorname{TypePos_Modal}(P,\ m)\ \cup \ \operatorname{TypePos_Class}(P,\ m)\ \cup \ \operatorname{TypePos_Alias}(P,\ m)
\end{array}
```

```math
\begin{array}{l}
\operatorname{ArraySizeExprs}(P,\ m)\ =\ \{\ e\ \mid \ \exists \ \mathsf{elem}.\ \operatorname{TypeArray}(\mathsf{elem},\ e)\ \in \ \operatorname{TypePositions}(P,\ m)\ \} \\
\operatorname{EnumDiscriminantExprs}(P,\ m)\ =\ \{\ e\ \mid \ \exists \ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{impls},\ \mathsf{variants},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{EnumDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{impls},\ \mathsf{variants},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc})\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \land \ \exists \ v.\ v\ =\ \operatorname{VariantDecl}(\_,\ \_,\ e,\ \_,\ \_)\ \in \ \mathsf{variants}\ \land \ e\ \ne \ \bot \ \} \\
\operatorname{TypePosExprs}(P,\ m)\ =\ \operatorname{ArraySizeExprs}(P,\ m)\ \cup \ \operatorname{EnumDiscriminantExprs}(P,\ m)
\end{array}
```

```math
\operatorname{TypeDeps}(P,\ m)\ =\ \{\ n\ \mid \ \exists \ t\ \in \ \operatorname{TypePositions}(P,\ m).\ \Gamma \ \vdash \ \operatorname{TypeRefsTy}(t,\ \mathsf{env}_{m})\ \Downarrow \ T\ \land \ n\ \in \ T\ \}\ \cup \ \{\ n\ \mid \ \exists \ p\ \in \ \operatorname{PatNodes}(P,\ m).\ \Gamma \ \vdash \ \operatorname{TypeRefsPat}(p,\ \mathsf{env}_{m})\ \Downarrow \ T\ \land \ n\ \in \ T\ \}\ \cup \ \{\ n\ \mid \ \exists \ e\ \in \ (\operatorname{ExprNodes}(P,\ m)\ \cup \ \operatorname{TypePosExprs}(P,\ m)).\ \Gamma \ \vdash \ \operatorname{TypeRefsExpr}(e,\ \mathsf{env}_{m})\ \Downarrow \ T\ \land \ n\ \in \ T\ \}
```

```math
\begin{array}{l}
\operatorname{StaticInitExprs}(P,\ m)\ =\ \{\ \mathsf{init}\ \mid \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{bind},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{StaticDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{bind},\ \mathsf{span},\ \mathsf{doc})\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \land \ \mathsf{bind}.\mathsf{init}\ =\ \mathsf{init}\ \} \\
\operatorname{RecordFieldInitExprs}(P,\ m)\ =\ \{\ \mathsf{init}\ \mid \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{impls},\ \mathsf{members},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{RecordDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{impls},\ \mathsf{members},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc})\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \land \ \exists \ f.\ f\ =\ \operatorname{FieldDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \mathsf{init},\ \_,\ \_)\ \in \ \mathsf{members}\ \land \ \mathsf{init}\ \ne \ \bot \ \} \\
\operatorname{ProcBodies}(P,\ m)\ =\ \{\ \mathsf{body}\ \mid \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{ProcedureDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \} \\
\operatorname{RecordMethodBodies}(P,\ m)\ =\ \{\ \mathsf{body}\ \mid \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{impls},\ \mathsf{members},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{RecordDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{impls},\ \mathsf{members},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc})\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \land \ \exists \ \mathsf{md}.\ \mathsf{md}\ =\ \operatorname{MethodDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \mathsf{body},\ \_,\ \_)\ \in \ \mathsf{members}\ \} \\
\operatorname{ClassMethodBodies}(P,\ m)\ =\ \{\ \mathsf{body}\ \mid \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{modal},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{supers},\ \mathsf{items},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{ClassDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{modal},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{supers},\ \mathsf{items},\ \mathsf{span},\ \mathsf{doc})\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \land \ \exists \ \mathsf{md}.\ \mathsf{md}\ =\ \operatorname{ClassMethodDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \mathsf{body},\ \_,\ \_)\ \in \ \mathsf{items}\ \land \ \mathsf{body}\ \ne \ \bot \ \}
\end{array}
```

```math
\begin{array}{l}
\operatorname{ValueDepsEager}(P,\ m)\ =\ \{\ n\ \mid \ \exists \ e\ \in \ \operatorname{StaticInitExprs}(P,\ m).\ \Gamma \ \vdash \ \operatorname{ValueRefs}(e,\ \mathsf{env}_{m})\ \Downarrow \ V\ \land \ n\ \in \ V\ \} \\
\operatorname{ValueDepsLazy}(P,\ m)\ =\ \{\ n\ \mid \ \exists \ e\ \in \ \operatorname{RecordFieldInitExprs}(P,\ m)\ \cup \ \bigcup \_\{b\ \in \ (\operatorname{ProcBodies}(P,\ m)\ \cup \ \operatorname{RecordMethodBodies}(P,\ m)\ \cup \ \operatorname{ClassMethodBodies}(P,\ m))\}\ \operatorname{ExprNodesOf}(b).\ \Gamma \ \vdash \ \operatorname{ValueRefs}(e,\ \mathsf{env}_{m})\ \Downarrow \ V\ \land \ n\ \in \ V\ \}
\end{array}
```

V = AllModules

```math
\begin{array}{l}
E_{\mathsf{type}}\ =\ \{(m,\ n)\ \mid \ n\ \in \ \operatorname{TypeDeps}(P,\ m)\} \\
E_{\mathsf{val}}^\{\mathsf{eager}\}\ =\ \{(m,\ n)\ \mid \ n\ \in \ \operatorname{ValueDepsEager}(P,\ m)\} \\
E_{\mathsf{val}}^\{\mathsf{lazy}\}\ =\ \{(m,\ n)\ \mid \ n\ \in \ \operatorname{ValueDepsLazy}(P,\ m)\}
\end{array}
```

```math
\begin{array}{l}
G\ =\ \langle V,\ E_{\mathsf{type}},\ E_{\mathsf{val}}^\{\mathsf{eager}\},\ E_{\mathsf{val}}^\{\mathsf{lazy}\}\rangle  \\
G_{e}\ =\ \langle V,\ E_{\mathsf{val}}^\{\mathsf{eager}\}\rangle 
\end{array}
```

**(WF-Acyclic-Eager)**

```math
\begin{array}{l}
\forall \ v\ \in \ V.\ \lnot \ \operatorname{Reachable}(v,\ v,\ E_{\mathsf{val}}^\{\mathsf{eager}\}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ G_{e}\ :\ \mathsf{DAG}
\end{array}
```

#### 11.5.5 Dynamic Semantics

This section introduces no direct runtime semantics. Its effects are compile-time only.

#### 11.5.6 Lowering

Module aggregation contributes the eager static-initialization dependency graph `G_e` consumed by §24.4.2.

Static initialization ordering, deinitialization ordering, and project lifecycle lowering are defined by §24.4. This section introduces no additional lowering rules.

#### 11.5.7 Diagnostics

| Code         | Severity | Detection    | Condition                                                      |
| ------------ | -------- | ------------ | -------------------------------------------------------------- |
| `E-MOD-1104` | Error    | Compile-time | Module path collision after NFC + case folding                 |
| `E-MOD-1105` | Error    | Compile-time | Module path component is a reserved keyword                    |
| `E-MOD-1106` | Error    | Compile-time | Module path component is not a valid identifier                |
| `E-MOD-1201` | Error    | Compile-time | External `using` path without required `import`                |
| `E-MOD-1304` | Error    | Compile-time | Unresolved module: path prefix did not resolve to a module     |
| `W-MOD-1101` | Warning  | Compile-time | Potential module path collision on case-insensitive filesystem |
| `E-MOD-1401` | Error    | Compile-time | Cyclic module dependency detected in eager initializers        |
