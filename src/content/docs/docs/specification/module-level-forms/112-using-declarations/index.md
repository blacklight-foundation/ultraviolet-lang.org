---
title: "11.2 Using Declarations"
description: "11.2 Using Declarations from 11. Module-Level Forms of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "module-level-forms"
specSection: "112-using-declarations"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/module-level-forms/">11. Module-Level Forms</a>
  <span>Module-Level Forms</span>
</div>

## 11.2 Using Declarations

### 11.2.1 Syntax

```text
using_decl      ::= attribute_list? visibility? "using" using_clause
using_clause    ::= module_path "::" identifier ("as" identifier)?
                  | module_path "::" using_list
                  | module_path "::" "*"
using_list      ::= "{" using_specifier ("," using_specifier)* "}"
using_specifier ::= identifier ("as" identifier)?
```

`module_path` is defined by §11.5.1.

### 11.2.2 Parsing

**(Parse-Using-Wildcard)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{using})\quad \Gamma \ \vdash \ \operatorname{ParseModulePath}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{mp})\quad \operatorname{IsOp}(\operatorname{Tok}(P_{2}),\ \texttt{"::"})\quad \operatorname{IsOp}(\operatorname{Tok}(\operatorname{Advance}(P_{2})),\ \texttt{"*"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseItem}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P_{2})),\ \langle \mathsf{UsingDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \langle \mathsf{UsingWildcard},\ \mathsf{mp}\rangle ,\ \operatorname{SpanBetween}(P,\ \operatorname{Advance}(\operatorname{Advance}(P_{2}))),\ []\rangle )
\end{array}
$$

**(Parse-Using-List)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{using})\quad \Gamma \ \vdash \ \operatorname{ParseModulePath}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{mp})\quad \operatorname{IsOp}(\operatorname{Tok}(P_{2}),\ \texttt{"::"})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P_{2})),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseUsingList}(\operatorname{Advance}(\operatorname{Advance}(P_{2})))\ \Downarrow \ (P_{3},\ \mathsf{specs}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseItem}(P)\ \Downarrow \ (P_{3},\ \langle \mathsf{UsingDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \langle \mathsf{UsingList},\ \mathsf{mp},\ \mathsf{specs}\rangle ,\ \operatorname{SpanBetween}(P,\ P_{3}),\ []\rangle )
\end{array}
$$

**(Parse-Using-Item)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{using})\quad \Gamma \ \vdash \ \operatorname{ParseModulePath}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{mp})\quad \operatorname{IsOp}(\operatorname{Tok}(P_{2}),\ \texttt{"::"})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(P_{2})))\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{2}))\ \Downarrow \ (P_{3},\ \mathsf{id})\quad \Gamma \ \vdash \ \operatorname{ParseAliasOpt}(P_{3})\ \Downarrow \ (P_{4},\ \mathsf{alias}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseItem}(P)\ \Downarrow \ (P_{4},\ \langle \mathsf{UsingDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \langle \mathsf{UsingItem},\ \mathsf{mp},\ \mathsf{id},\ \mathsf{alias}_{\mathsf{opt}}\rangle ,\ \operatorname{SpanBetween}(P,\ P_{4}),\ []\rangle )
\end{array}
$$

**(Parse-UsingSpec)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseIdent}(P)\ \Downarrow \ (P_{1},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseAliasOpt}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{alias}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseUsingSpec}(P)\ \Downarrow \ (P_{2},\ \langle \mathsf{name},\ \mathsf{alias}_{\mathsf{opt}}\rangle )
\end{array}
$$

**(Parse-UsingList-Empty)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseUsingList}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ [])
\end{array}
$$

**(Parse-UsingList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseUsingSpec}(P)\ \Downarrow \ (P_{1},\ s)\quad \Gamma \ \vdash \ \operatorname{ParseUsingListTail}(P_{1},\ [s])\ \Downarrow \ (P_{2},\ \mathsf{specs})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseUsingList}(P)\ \Downarrow \ (\operatorname{Advance}(P_{2}),\ \mathsf{specs})
\end{array}
$$

**(Parse-UsingListTail-End)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseUsingListTail}(P,\ \mathsf{xs})\ \Downarrow \ (P,\ \mathsf{xs})
\end{array}
$$

**(Parse-UsingListTail-TrailingComma)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"\}"})\quad \operatorname{TrailingCommaAllowed}(P_{0},\ P,\ \{\operatorname{Punctuator}(\texttt{"\}"})\}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseUsingListTail}(P,\ \mathsf{xs})\ \Downarrow \ (\operatorname{Advance}(P),\ \mathsf{xs})
\end{array}
$$

**(Parse-UsingListTail-Comma)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParseUsingSpec}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ s)\quad \Gamma \ \vdash \ \operatorname{ParseUsingListTail}(P_{1},\ \mathsf{xs}\ \mathbin{++} \ [s])\ \Downarrow \ (P_{2},\ \mathsf{ys}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseUsingListTail}(P,\ \mathsf{xs})\ \Downarrow \ (P_{2},\ \mathsf{ys})
\end{array}
$$

### 11.2.3 AST Representation / Form

`UsingDecl` is a top-level AST item with one of three clause forms.

$$
\mathsf{UsingDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{clause},\ \mathsf{span},\ \mathsf{doc}\rangle 
$$

$$
\begin{array}{l}
\mathsf{UsingClause}\ \in \ \{ \\[0.16em]
\ \mathsf{UsingItem}\ =\ \langle \mathsf{module}_{\mathsf{path}},\ \mathsf{name},\ \mathsf{alias}_{\mathsf{opt}}\rangle , \\[0.16em]
\ \mathsf{UsingList}\ =\ \langle \mathsf{module}_{\mathsf{path}},\ \mathsf{specs}\rangle , \\[0.16em]
\ \mathsf{UsingWildcard}\ =\ \langle \mathsf{module}_{\mathsf{path}}\rangle  \\[0.16em]
\}
\end{array}
$$

$$
\mathsf{UsingSpec}\ =\ \langle \mathsf{name},\ \mathsf{alias}_{\mathsf{opt}}\rangle \quad \mathsf{name}\ \in \ \mathsf{identifier}
$$

### 11.2.4 Static Semantics

Using-path resolution and import coverage are defined by §11.5.4. Accessibility is defined by Chapter 7. This section defines the bindings produced by each `using` form.

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

**(Using-Item)**

$$
\begin{array}{l}
u\ =\ \langle \mathsf{UsingDecl},\ \mathsf{vis},\ \langle \mathsf{UsingItem},\ \mathsf{mp}_{\mathsf{raw}},\ \mathsf{item},\ \mathsf{alias}_{\mathsf{opt}}\rangle ,\ \_,\ \_\rangle \quad \Gamma \ \vdash \ \operatorname{ResolveUsingPath}(\mathsf{mp}_{\mathsf{raw}}\ \mathbin{++} \ [\mathsf{item}])\ \Downarrow \ \langle \mathsf{mp},\ \mathsf{item}\rangle \quad \Gamma \ \vdash \ \operatorname{ImportOk}(m,\ \mathsf{mp})\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{CanAccess}(m,\ \operatorname{DeclOf}(\mathsf{mp},\ \mathsf{item}))\ \Downarrow \ \mathsf{ok}\quad (\mathsf{vis}\ =\ \texttt{public}\ \Rightarrow \ \operatorname{Vis}(\operatorname{DeclOf}(\mathsf{mp},\ \mathsf{item}))\ =\ \texttt{public})\quad \operatorname{NameMap}(P,\ \mathsf{mp})[\operatorname{IdKey}(\mathsf{item})]\ =\ \langle k,\ \_,\ \_,\ \_\rangle \quad k\ \in \ \{\mathsf{Value},\ \mathsf{Type},\ \mathsf{Class}\}\quad \mathsf{name}\ =\ \mathsf{alias}_{\mathsf{opt}}\ \mathsf{if}\ \mathsf{present},\ \mathsf{else}\ \mathsf{item} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{UsingNames}(u)\ \Downarrow \ [(\mathsf{name},\ \langle k,\ \mathsf{mp},\ \mathsf{item},\ \mathsf{Using}\rangle )]
\end{array}
$$

**(Using-Item-Public-Err)**

$$
\begin{array}{l}
u\ =\ \langle \mathsf{UsingDecl},\ \texttt{public},\ \langle \mathsf{UsingItem},\ \mathsf{mp}_{\mathsf{raw}},\ \mathsf{item},\ \_\rangle ,\ \_,\ \_\rangle \quad \Gamma \ \vdash \ \operatorname{ResolveUsingPath}(\mathsf{mp}_{\mathsf{raw}}\ \mathbin{++} \ [\mathsf{item}])\ \Downarrow \ \langle \mathsf{mp},\ \mathsf{item}\rangle \quad \operatorname{Vis}(\operatorname{DeclOf}(\mathsf{mp},\ \mathsf{item}))\ \ne \ \texttt{public}\quad c\ =\ \operatorname{Code}(\mathsf{Using}-\mathsf{Path}-\mathsf{Item}-\mathsf{Public}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{UsingNames}(u)\ \Uparrow \ c
\end{array}
$$

**(Using-List)**

$$
\begin{array}{l}
u\ =\ \langle \mathsf{UsingDecl},\ \mathsf{vis},\ \langle \mathsf{UsingList},\ \mathsf{mp}_{\mathsf{raw}},\ \mathsf{specs}\rangle ,\ \_,\ \_\rangle \quad \operatorname{Distinct}(\operatorname{UsingSpecNames}(\mathsf{specs}))\quad \Gamma \ \vdash \ \operatorname{ResolveImportPath}(\mathsf{mp}_{\mathsf{raw}})\ \Downarrow \ \mathsf{mp}\quad \Gamma \ \vdash \ \operatorname{ImportOk}(m,\ \mathsf{mp})\ \Downarrow \ \mathsf{ok}\quad \forall \ i,\ s_{i}\ =\ \langle \mathsf{name}_{i},\ \mathsf{alias}_{i}\rangle \quad \operatorname{NameMap}(P,\ \mathsf{mp})[\operatorname{IdKey}(\mathsf{name}_{i})]\ =\ \langle k_{i},\ \_,\ \_,\ \_\rangle \quad k_{i}\ \in \ \{\mathsf{Value},\ \mathsf{Type},\ \mathsf{Class}\}\quad \Gamma \ \vdash \ \operatorname{CanAccess}(m,\ \operatorname{DeclOf}(\mathsf{mp},\ \mathsf{name}_{i}))\ \Downarrow \ \mathsf{ok}\quad (\mathsf{vis}\ =\ \texttt{public}\ \Rightarrow \ \operatorname{Vis}(\operatorname{DeclOf}(\mathsf{mp},\ \mathsf{name}_{i}))\ =\ \texttt{public})\quad \mathsf{bind}_{i}\ =\ \langle \operatorname{UsingSpecName}(s_{i}),\ \langle k_{i},\ \mathsf{mp},\ \mathsf{name}_{i},\ \mathsf{Using}\rangle \rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{UsingNames}(u)\ \Downarrow \ [\mathsf{bind}_{1},\ \ldots ,\ \mathsf{bind}_{n}]
\end{array}
$$

**(Using-Wildcard-Warn)**

$$
\begin{array}{l}
u\ =\ \langle \mathsf{UsingDecl},\ \mathsf{vis},\ \langle \mathsf{UsingWildcard},\ \mathsf{mp}_{\mathsf{raw}}\rangle ,\ \_,\ \_\rangle \quad \Gamma \ \vdash \ \operatorname{ResolveImportPath}(\mathsf{mp}_{\mathsf{raw}})\ \Downarrow \ \mathsf{mp}\quad \Gamma \ \vdash \ \operatorname{ImportOk}(m,\ \mathsf{mp})\ \Downarrow \ \mathsf{ok}\quad \operatorname{PublicAPI}(m)\quad \mathsf{Items}\ =\ \{\ \mathsf{name}\ \mid \ \mathsf{name}\ \in \ \operatorname{ItemNames}(\mathsf{mp})\ \land \ \Gamma \ \vdash \ \operatorname{CanAccess}(m,\ \operatorname{DeclOf}(\mathsf{mp},\ \mathsf{name}))\ \Downarrow \ \mathsf{ok}\ \}\quad (\mathsf{vis}\ =\ \texttt{public}\ \Rightarrow \ \forall \ \mathsf{name}\ \in \ \mathsf{Items}.\ \operatorname{Vis}(\operatorname{DeclOf}(\mathsf{mp},\ \mathsf{name}))\ =\ \texttt{public})\quad \forall \ \mathsf{name}\ \in \ \mathsf{Items},\ \operatorname{NameMap}(P,\ \mathsf{mp})[\operatorname{IdKey}(\mathsf{name})]\ =\ \langle k,\ \_,\ \_,\ \_\rangle \quad k\ \in \ \{\mathsf{Value},\ \mathsf{Type},\ \mathsf{Class}\}\quad \mathsf{bind}_{\mathsf{name}}\ =\ \langle \mathsf{name},\ \langle k,\ \mathsf{mp},\ \mathsf{name},\ \mathsf{Using}\rangle \rangle \quad \Gamma \ \vdash \ \operatorname{Emit}(W-\mathsf{MOD}-1201,\ \bot ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{UsingNames}(u)\ \Downarrow \ [\mathsf{bind}_{\mathsf{name}}\ \mid \ \mathsf{name}\ \in \ \mathsf{Items}]
\end{array}
$$

**(Using-Wildcard)**

$$
\begin{array}{l}
u\ =\ \langle \mathsf{UsingDecl},\ \mathsf{vis},\ \langle \mathsf{UsingWildcard},\ \mathsf{mp}_{\mathsf{raw}}\rangle ,\ \_,\ \_\rangle \quad \Gamma \ \vdash \ \operatorname{ResolveImportPath}(\mathsf{mp}_{\mathsf{raw}})\ \Downarrow \ \mathsf{mp}\quad \Gamma \ \vdash \ \operatorname{ImportOk}(m,\ \mathsf{mp})\ \Downarrow \ \mathsf{ok}\quad \lnot \ \operatorname{PublicAPI}(m)\quad \mathsf{Items}\ =\ \{\ \mathsf{name}\ \mid \ \mathsf{name}\ \in \ \operatorname{ItemNames}(\mathsf{mp})\ \land \ \Gamma \ \vdash \ \operatorname{CanAccess}(m,\ \operatorname{DeclOf}(\mathsf{mp},\ \mathsf{name}))\ \Downarrow \ \mathsf{ok}\ \}\quad (\mathsf{vis}\ =\ \texttt{public}\ \Rightarrow \ \forall \ \mathsf{name}\ \in \ \mathsf{Items}.\ \operatorname{Vis}(\operatorname{DeclOf}(\mathsf{mp},\ \mathsf{name}))\ =\ \texttt{public})\quad \forall \ \mathsf{name}\ \in \ \mathsf{Items},\ \operatorname{NameMap}(P,\ \mathsf{mp})[\operatorname{IdKey}(\mathsf{name})]\ =\ \langle k,\ \_,\ \_,\ \_\rangle \quad k\ \in \ \{\mathsf{Value},\ \mathsf{Type},\ \mathsf{Class}\}\quad \mathsf{bind}_{\mathsf{name}}\ =\ \langle \mathsf{name},\ \langle k,\ \mathsf{mp},\ \mathsf{name},\ \mathsf{Using}\rangle \rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{UsingNames}(u)\ \Downarrow \ [\mathsf{bind}_{\mathsf{name}}\ \mid \ \mathsf{name}\ \in \ \mathsf{Items}]
\end{array}
$$

**(Using-List-Dup)**

$$
\begin{array}{l}
u\ =\ \langle \mathsf{UsingDecl},\ \_,\ \langle \mathsf{UsingList},\ \mathsf{mp},\ \mathsf{specs}\rangle ,\ \_,\ \_\rangle \quad \lnot \ \operatorname{Distinct}(\operatorname{UsingSpecNames}(\mathsf{specs}))\quad c\ =\ \operatorname{Code}(\mathsf{Using}-\mathsf{List}-\mathsf{Dup}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{UsingNames}(u)\ \Uparrow \ c
\end{array}
$$

**(Using-List-Public-Err)**

$$
\begin{array}{l}
u\ =\ \langle \mathsf{UsingDecl},\ \texttt{public},\ \langle \mathsf{UsingList},\ \mathsf{mp}_{\mathsf{raw}},\ \mathsf{specs}\rangle ,\ \_,\ \_\rangle \quad \Gamma \ \vdash \ \operatorname{ResolveImportPath}(\mathsf{mp}_{\mathsf{raw}})\ \Downarrow \ \mathsf{mp}\quad \exists \ s_{i}\ \in \ \mathsf{specs}.\ s_{i}\ =\ \langle \mathsf{name}_{i},\ \_\rangle \ \land \ \operatorname{Vis}(\operatorname{DeclOf}(\mathsf{mp},\ \mathsf{name}_{i}))\ \ne \ \texttt{public}\quad c\ =\ \operatorname{Code}(\mathsf{Using}-\mathsf{List}-\mathsf{Public}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{UsingNames}(u)\ \Uparrow \ c
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

**(ResolveItem-Using)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveItem}(\operatorname{UsingDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{clause},\ \mathsf{span},\ \mathsf{doc}))\ \Downarrow \ \operatorname{UsingDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{clause},\ \mathsf{span},\ \mathsf{doc})
\end{array}
$$

### 11.2.5 Dynamic Semantics

`using` declarations are compile-time only. They introduce no runtime action.

### 11.2.6 Lowering

`using` declarations introduce no construct-specific lowering. Their effects are exhausted by name binding.

### 11.2.7 Diagnostics

| Code         | Severity | Detection    | Condition                                        |
| ------------ | -------- | ------------ | ------------------------------------------------ |
| `E-MOD-1204` | Error    | Compile-time | Using path does not resolve to an item           |
| `E-MOD-1205` | Error    | Compile-time | Attempt to `public using` a non-public item      |
| `E-MOD-1206` | Error    | Compile-time | Duplicate item in a `using` list                 |
| `W-MOD-1201` | Warning  | Compile-time | Wildcard `using` in a module exposing public API |

Missing required cross-assembly imports are owned by §11.5.7.
