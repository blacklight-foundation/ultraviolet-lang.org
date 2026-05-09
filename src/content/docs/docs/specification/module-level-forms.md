---
title: "Module-Level Forms"
description: "11. Module-Level Forms of the Ultraviolet language specification."
specSource: "../../Ultraviolet/SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T13:48:04.933Z"
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
```

import_decl ::= attribute_list? visibility? "import" module_path ("as" identifier)?
```

`module_path` is defined by §11.5.1.

#### 11.1.2 Parsing

`ImportDecl` is parsed by the item parser using the import-specific branch.

**(Parse-Import)**

```text
Γ ⊢ ParseAttrListOpt(P) ⇓ (P_0, attrs_opt)    Γ ⊢ ParseVis(P_0) ⇓ (P_1, vis)    IsKw(Tok(P_1), `import`)    Γ ⊢ ParseModulePath(Advance(P_1)) ⇓ (P_2, path)    Γ ⊢ ParseAliasOpt(P_2) ⇓ (P_3, alias_opt)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseItem(P) ⇓ (P_3, ⟨ImportDecl, attrs_opt, vis, path, alias_opt, SpanBetween(P, P_3), []⟩)

#### 11.1.3 AST Representation / Form

`ImportDecl` is a top-level AST item.

```text
ImportDecl = ⟨attrs_opt, vis, path, alias_opt, span, doc⟩

#### 11.1.4 Static Semantics

Import path resolution is defined by §11.5.4. This section defines the binding effect of a successfully resolved `import` declaration.

**(Import-Path)**

```text
u = ⟨ImportDecl, vis, path, alias_opt, _, _⟩    Γ ⊢ ResolveImportPath(path) ⇓ mp    name = alias_opt if present, else Last(path)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ImportNames(u) ⇓ [(name, ⟨ModuleAlias, mp, ⊥, Import⟩)]

**(Import-Path-Err)**

```text
u = ⟨ImportDecl, _, path, _, _, _⟩    Γ ⊢ ResolveImportPath(path) ⇑ c
────────────────────────────────────────────────────────────────

```text
Γ ⊢ ImportNames(u) ⇑ c

**(Bind-Import)**

```text
Γ ⊢ ImportNames(u) ⇓ B
──────────────────────────────────────────────

```text
Γ ⊢ ItemBindings(u, p) ⇓ B

**(Bind-Import-Err)**

```text
Γ ⊢ ImportNames(u) ⇑ c
──────────────────────────────────────────────

```text
Γ ⊢ ItemBindings(u, p) ⇑ c

**(ResolveItem-Import)**
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveItem(ImportDecl(attrs_opt, vis, path, alias_opt, span, doc)) ⇓ ImportDecl(attrs_opt, vis, path, alias_opt, span, doc)

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
```

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

```text
Γ ⊢ ParseAttrListOpt(P) ⇓ (P_0, attrs_opt)    Γ ⊢ ParseVis(P_0) ⇓ (P_1, vis)    IsKw(Tok(P_1), `using`)    Γ ⊢ ParseModulePath(Advance(P_1)) ⇓ (P_2, mp)    IsOp(Tok(P_2), "::")    IsOp(Tok(Advance(P_2)), "*")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseItem(P) ⇓ (Advance(Advance(P_2)), ⟨UsingDecl, attrs_opt, vis, ⟨UsingWildcard, mp⟩, SpanBetween(P, Advance(Advance(P_2))), []⟩)

**(Parse-Using-List)**

```text
Γ ⊢ ParseAttrListOpt(P) ⇓ (P_0, attrs_opt)    Γ ⊢ ParseVis(P_0) ⇓ (P_1, vis)    IsKw(Tok(P_1), `using`)    Γ ⊢ ParseModulePath(Advance(P_1)) ⇓ (P_2, mp)    IsOp(Tok(P_2), "::")    IsPunc(Tok(Advance(P_2)), "{")    Γ ⊢ ParseUsingList(Advance(Advance(P_2))) ⇓ (P_3, specs)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseItem(P) ⇓ (P_3, ⟨UsingDecl, attrs_opt, vis, ⟨UsingList, mp, specs⟩, SpanBetween(P, P_3), []⟩)

**(Parse-Using-Item)**

```text
Γ ⊢ ParseAttrListOpt(P) ⇓ (P_0, attrs_opt)    Γ ⊢ ParseVis(P_0) ⇓ (P_1, vis)    IsKw(Tok(P_1), `using`)    Γ ⊢ ParseModulePath(Advance(P_1)) ⇓ (P_2, mp)    IsOp(Tok(P_2), "::")    IsIdent(Tok(Advance(P_2)))    Γ ⊢ ParseIdent(Advance(P_2)) ⇓ (P_3, id)    Γ ⊢ ParseAliasOpt(P_3) ⇓ (P_4, alias_opt)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseItem(P) ⇓ (P_4, ⟨UsingDecl, attrs_opt, vis, ⟨UsingItem, mp, id, alias_opt⟩, SpanBetween(P, P_4), []⟩)

**(Parse-UsingSpec)**

```text
Γ ⊢ ParseIdent(P) ⇓ (P_1, name)    Γ ⊢ ParseAliasOpt(P_1) ⇓ (P_2, alias_opt)
──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseUsingSpec(P) ⇓ (P_2, ⟨name, alias_opt⟩)

**(Parse-UsingList-Empty)**
IsPunc(Tok(P), "}")
──────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseUsingList(P) ⇓ (Advance(P), [])

**(Parse-UsingList-Cons)**

```text
Γ ⊢ ParseUsingSpec(P) ⇓ (P_1, s)    Γ ⊢ ParseUsingListTail(P_1, [s]) ⇓ (P_2, specs)    IsPunc(Tok(P_2), "}")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseUsingList(P) ⇓ (Advance(P_2), specs)

**(Parse-UsingListTail-End)**
IsPunc(Tok(P), "}")
──────────────────────────────────────────────

```text
Γ ⊢ ParseUsingListTail(P, xs) ⇓ (P, xs)

**(Parse-UsingListTail-TrailingComma)**
IsPunc(Tok(P), ",")    IsPunc(Tok(Advance(P)), "}")    TrailingCommaAllowed(P_0, P, {Punctuator("}")})
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseUsingListTail(P, xs) ⇓ (Advance(P), xs)

**(Parse-UsingListTail-Comma)**

```text
IsPunc(Tok(P), ",")    Γ ⊢ ParseUsingSpec(Advance(P)) ⇓ (P_1, s)    Γ ⊢ ParseUsingListTail(P_1, xs ++ [s]) ⇓ (P_2, ys)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseUsingListTail(P, xs) ⇓ (P_2, ys)

#### 11.2.3 AST Representation / Form

`UsingDecl` is a top-level AST item with one of three clause forms.

```text
UsingDecl = ⟨attrs_opt, vis, clause, span, doc⟩

```text
UsingClause ∈ {

```text
  UsingItem = ⟨module_path, name, alias_opt⟩,

```text
  UsingList = ⟨module_path, specs⟩,

```text
  UsingWildcard = ⟨module_path⟩
}

```text
UsingSpec = ⟨name, alias_opt⟩    name ∈ identifier

#### 11.2.4 Static Semantics

Using-path resolution and import coverage are defined by §11.5.4. Accessibility is defined by Chapter 7. This section defines the bindings produced by each `using` form.

```text
UsingSpecName(⟨name, alias_opt⟩) =

```text
 alias_opt    if alias_opt ≠ ⊥
 name         otherwise

UsingSpecNames([s_1, …, s_n]) = [UsingSpecName(s_1), …, UsingSpecName(s_n)]

**(Using-Item)**

```text
u = ⟨UsingDecl, vis, ⟨UsingItem, mp_raw, item, alias_opt⟩, _, _⟩    Γ ⊢ ResolveUsingPath(mp_raw ++ [item]) ⇓ ⟨mp, item⟩    Γ ⊢ ImportOk(m, mp) ⇓ ok    Γ ⊢ CanAccess(m, DeclOf(mp, item)) ⇓ ok    (vis = `public` ⇒ Vis(DeclOf(mp, item)) = `public`)    NameMap(P, mp)[IdKey(item)] = ⟨k, _, _, _⟩    k ∈ {Value, Type, Class}    name = alias_opt if present, else item
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ UsingNames(u) ⇓ [(name, ⟨k, mp, item, Using⟩)]

**(Using-Item-Public-Err)**

```text
u = ⟨UsingDecl, `public`, ⟨UsingItem, mp_raw, item, _⟩, _, _⟩    Γ ⊢ ResolveUsingPath(mp_raw ++ [item]) ⇓ ⟨mp, item⟩    Vis(DeclOf(mp, item)) ≠ `public`    c = Code(Using-Path-Item-Public-Err)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ UsingNames(u) ⇑ c

**(Using-List)**

```text
u = ⟨UsingDecl, vis, ⟨UsingList, mp_raw, specs⟩, _, _⟩    Distinct(UsingSpecNames(specs))    Γ ⊢ ResolveImportPath(mp_raw) ⇓ mp    Γ ⊢ ImportOk(m, mp) ⇓ ok    ∀ i, s_i = ⟨name_i, alias_i⟩    NameMap(P, mp)[IdKey(name_i)] = ⟨k_i, _, _, _⟩    k_i ∈ {Value, Type, Class}    Γ ⊢ CanAccess(m, DeclOf(mp, name_i)) ⇓ ok    (vis = `public` ⇒ Vis(DeclOf(mp, name_i)) = `public`)    bind_i = ⟨UsingSpecName(s_i), ⟨k_i, mp, name_i, Using⟩⟩
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ UsingNames(u) ⇓ [bind_1, …, bind_n]

**(Using-Wildcard-Warn)**

```text
u = ⟨UsingDecl, vis, ⟨UsingWildcard, mp_raw⟩, _, _⟩    Γ ⊢ ResolveImportPath(mp_raw) ⇓ mp    Γ ⊢ ImportOk(m, mp) ⇓ ok    PublicAPI(m)    Items = { name | name ∈ ItemNames(mp) ∧ Γ ⊢ CanAccess(m, DeclOf(mp, name)) ⇓ ok }    (vis = `public` ⇒ ∀ name ∈ Items. Vis(DeclOf(mp, name)) = `public`)    ∀ name ∈ Items, NameMap(P, mp)[IdKey(name)] = ⟨k, _, _, _⟩    k ∈ {Value, Type, Class}    bind_name = ⟨name, ⟨k, mp, name, Using⟩⟩    Γ ⊢ Emit(W-MOD-1201, ⊥)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ UsingNames(u) ⇓ [bind_name | name ∈ Items]

**(Using-Wildcard)**

```text
u = ⟨UsingDecl, vis, ⟨UsingWildcard, mp_raw⟩, _, _⟩    Γ ⊢ ResolveImportPath(mp_raw) ⇓ mp    Γ ⊢ ImportOk(m, mp) ⇓ ok    ¬ PublicAPI(m)    Items = { name | name ∈ ItemNames(mp) ∧ Γ ⊢ CanAccess(m, DeclOf(mp, name)) ⇓ ok }    (vis = `public` ⇒ ∀ name ∈ Items. Vis(DeclOf(mp, name)) = `public`)    ∀ name ∈ Items, NameMap(P, mp)[IdKey(name)] = ⟨k, _, _, _⟩    k ∈ {Value, Type, Class}    bind_name = ⟨name, ⟨k, mp, name, Using⟩⟩
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ UsingNames(u) ⇓ [bind_name | name ∈ Items]

**(Using-List-Dup)**

```text
u = ⟨UsingDecl, _, ⟨UsingList, mp, specs⟩, _, _⟩    ¬ Distinct(UsingSpecNames(specs))    c = Code(Using-List-Dup)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ UsingNames(u) ⇑ c

**(Using-List-Public-Err)**

```text
u = ⟨UsingDecl, `public`, ⟨UsingList, mp_raw, specs⟩, _, _⟩    Γ ⊢ ResolveImportPath(mp_raw) ⇓ mp    ∃ s_i ∈ specs. s_i = ⟨name_i, _⟩ ∧ Vis(DeclOf(mp, name_i)) ≠ `public`    c = Code(Using-List-Public-Err)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ UsingNames(u) ⇑ c

**(Bind-Using)**

```text
Γ ⊢ UsingNames(u) ⇓ B
──────────────────────────────────────────────

```text
Γ ⊢ ItemBindings(u, p) ⇓ B

**(Bind-Using-Err)**

```text
Γ ⊢ UsingNames(u) ⇑ c
──────────────────────────────────────────────

```text
Γ ⊢ ItemBindings(u, p) ⇑ c

**(ResolveItem-Using)**
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveItem(UsingDecl(attrs_opt, vis, clause, span, doc)) ⇓ UsingDecl(attrs_opt, vis, clause, span, doc)

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
```

static_decl  ::= attribute_list? visibility? ("let" | "var") binding_decl
binding_decl ::= pattern (":" type)? binding_op expression
```

This chapter uses `StaticDecl` for top-level `let` and `var` items.

#### 11.3.2 Parsing

`StaticDecl` is parsed by the item parser. Pattern and initializer parsing reuse the shared binding parser.

**(Parse-Static-Decl)**

```text
Γ ⊢ ParseAttrListOpt(P) ⇓ (P_0, attrs_opt)    Γ ⊢ ParseVis(P_0) ⇓ (P_1, vis)    Tok(P_1) = Keyword(kw)    kw ∈ {`let`, `var`}    mut = kw    Γ ⊢ ParseBindingAfterLetVar(P_1) ⇓ (P_2, bind)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseItem(P) ⇓ (P_2, ⟨StaticDecl, attrs_opt, vis, mut, bind, SpanBetween(P, P_2), []⟩)

#### 11.3.3 AST Representation / Form

```text
StaticDecl = ⟨attrs_opt, vis, mut, binding, span, doc⟩

```text
mut ∈ {`let`, `var`}

#### 11.3.4 Static Semantics

Top-level `let` and `var` declarations are module-scope bindings. Their names are derived from the bound pattern.

```text
StaticVisOk(vis, mut) ⇔ ¬ (vis = `public` ∧ mut = `var`)

**(Bind-Static)**

```text
Γ ⊢ PatNames(pat) ⇓ N
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ItemBindings(⟨StaticDecl, _, _, ⟨pat, _, _, _, _⟩, _, _⟩, p) ⇓ [(n, ⟨Value, p, ⊥, Decl⟩) | n ∈ N]

**(WF-StaticDecl)**

```text
binding = ⟨pat, ty_opt, op, init, _⟩    StaticVisOk(vis, mut)    ty_opt = T_a    Γ; ⊥; ⊥ ⊢ init ⇐ T_a ⊣ ∅    Γ ⊢ pat ⇐ T_a ⊣ B    Distinct(PatNames(pat))
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ StaticDecl : ok

**(WF-StaticDecl-Ann-Mismatch)**

```text
item = StaticDecl(_, vis, mut, ⟨pat, ty_opt, op, init, _⟩, _, _)    ty_opt = T_a    Γ; ⊥; ⊥ ⊢ init ⇒ T_i ⊣ C    Solve(C) ⇓ θ    ¬(Γ ⊢ θ(T_i) <: T_a)    c = Code(WF-StaticDecl-Ann-Mismatch)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ item ⇑ c

**(WF-StaticDecl-MissingType)**

```text
item = StaticDecl(_, _, _, ⟨pat, ty_opt, op, init, _⟩, _, _)    ty_opt = ⊥    c = Code(WF-StaticDecl-MissingType)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ item ⇑ c

**(StaticVisOk-Err)**
item = StaticDecl(_, vis, mut, _, _, _)    ¬ StaticVisOk(vis, mut)    c = Code(StaticVisOk-Err)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ item ⇑ c

**(ResolveItem-Static)**

```text
Γ ⊢ ResolvePattern(pat) ⇓ pat'    Γ ⊢ ResolveExpr(init) ⇓ init'    Γ ⊢ ResolveTypeOpt(ty_opt) ⇓ ty_opt'
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveItem(StaticDecl(attrs_opt, vis, mut, ⟨pat, ty_opt, op, init, span⟩, span', doc)) ⇓ StaticDecl(attrs_opt, vis, mut, ⟨pat', ty_opt', op, init', span⟩, span', doc)

#### 11.3.5 Dynamic Semantics

`StaticDecl` introduces module-scope storage. Initialization and destruction occur according to the module initialization and deinitialization framework in Chapter 24 and the ordering rules in §11.5.6.

#### 11.3.6 Lowering

ConstInitJudg = {ConstInit}

```text
Γ ⊢ ConstInit(e) ⇓ bytes ⇔ e = Literal(lit) ∧ Γ ⊢ EncodeConst(ExprType(e), lit) ⇓ bytes

StaticName(binding) =

```text
 name    if binding = ⟨IdentifierPattern(name), ty_opt, op, init, span⟩

```text
 ⊥       otherwise

```text
StaticBindTypes(binding) = B ⇔ binding = ⟨pat, ty_opt, op, init, _⟩ ∧ Γ ⊢ pat ⇐ BindType(binding) ⊣ B

```text
StaticBindList(binding) = PatNames(pat) ⇔ binding = ⟨pat, _, _, _, _⟩

StaticBinding : StaticDecl × Name → StaticDecl

StaticSym(StaticDecl(_, _, _, binding, _, _), x) =
 Mangle(StaticDecl(_, _, _, binding, _, _))    if StaticName(binding) = x
 Mangle(StaticBinding(StaticDecl(_, _, _, binding, _, _), x))    otherwise

**(Emit-Static-Const)**

```text
item = StaticDecl(attrs_opt, vis, mut, binding, span, doc)    mut = `let`    StaticName(binding) = name    binding = ⟨pat, ty_opt, op, init, _⟩    Γ ⊢ ConstInit(init) ⇓ bytes    Γ ⊢ Mangle(item) ⇓ sym
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EmitGlobal(item) ⇓ [GlobalConst(sym, bytes)]

**(Emit-Static-Init)**

```text
item = StaticDecl(attrs_opt, vis, mut, binding, span, doc)    StaticName(binding) = name    binding = ⟨pat, ty_opt, op, init, _⟩    ((mut = `var`) ∨ (Γ ⊢ ConstInit(init) ⇑))    T = ExprType(init)    Γ ⊢ Mangle(item) ⇓ sym
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EmitGlobal(item) ⇓ [GlobalZero(sym, sizeof(T))]

**(Emit-Static-Multi)**

```text
item = StaticDecl(attrs_opt, vis, mut, binding, span, doc)    StaticName(binding) = ⊥    StaticBindTypes(binding) = B    StaticBindList(binding) = [x_1, …, x_k]    ∀ i, Γ ⊢ Mangle(StaticBinding(item, x_i)) ⇓ sym_i
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EmitGlobal(item) ⇓ [GlobalZero(sym_1, sizeof(B[x_1])), …, GlobalZero(sym_k, sizeof(B[x_k]))]

InitSym(m) = PathSig(["ultraviolet", "runtime", "init"] ++ PathOfModule(m))

**(InitFn)**
InitSym(m) = sym
──────────────────────────────

```text
Γ ⊢ InitFn(m) ⇓ sym

DeinitSym(m) = PathSig(["ultraviolet", "runtime", "deinit"] ++ PathOfModule(m))

**(DeinitFn)**
DeinitSym(m) = sym
──────────────────────────────

```text
Γ ⊢ DeinitFn(m) ⇓ sym

```text
StaticItems(P, m) = [ item | item ∈ ASTModule(P, m).items ∧ item = StaticDecl(_, _, _, _, _, _) ]

```text
StaticItemOf(path, name) = item ⇔ m = path ∧ item ∈ StaticItems(Project(Γ), m) ∧ item = StaticDecl(_, _, _, binding, _, _) ∧ name ∈ StaticBindList(binding) ∧ ∀ item'. (item' ∈ StaticItems(Project(Γ), m) ∧ item' = StaticDecl(_, _, _, binding', _, _) ∧ name ∈ StaticBindList(binding')) ⇒ item' = item

```text
StaticSymPath(path, name) = StaticSym(item, name) ⇔ StaticItemOf(path, name) = item

```text
StaticAddr(path, name) = addr ⇔ ∃ sym. StaticSymPath(path, name) = sym ∧ AddrOfSym(sym) = addr

For hosted-library session execution, §24.4.1 reinterprets the `AddrOfSym(sym)` occurrence above session-locally for every hosted-state symbol.

AddrOfSym : Symbol → Addr

```text
StaticType(path, name) = StaticBindTypes(binding)[name] ⇔ StaticItemOf(path, name) = StaticDecl(_, _, mut, binding, _, _)

```text
StaticBindInfo(path, name) = BindInfoMap(λ U. RespOfInit(init), StaticBindTypes(binding), MovOf(op), mut)[name] ⇔ StaticItemOf(path, name) = StaticDecl(_, _, mut, binding, _, _) ∧ binding = ⟨_, _, op, init, _⟩

SeqIRList([]) = ε
SeqIRList([IR] ++ IRs) = SeqIR(IR, SeqIRList(IRs))

StaticStoreIR(item, []) = ε

```text
StaticStoreIR(item, [⟨x, v⟩] ++ bs) = SeqIR(StoreGlobal(StaticSym(item, x), v), StaticStoreIR(item, bs))

**(Lower-StaticInit-Item)**

```text
item = StaticDecl(attrs_opt, vis, mut, binding, span, doc)    binding = ⟨pat, ty_opt, op, init, _⟩    Γ ⊢ LowerExpr(init) ⇓ ⟨IR_e, v⟩    Γ ⊢ MatchPattern(pat, v) ⇓ B    BindOrder(pat, B) = binds    Γ ⊢ InitPanicHandle(m) ⇓ IR_p
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Lower-StaticInitItem(m, item) ⇓ SeqIR(IR_e, StaticStoreIR(item, binds), IR_p)

**(Lower-StaticInitItems-Empty)**
──────────────────────────────────────────────────────────

```text
Γ ⊢ Lower-StaticInitItems(m, []) ⇓ ε

**(Lower-StaticInitItems-Cons)**

```text
Γ ⊢ Lower-StaticInitItem(m, item) ⇓ IR_i    Γ ⊢ Lower-StaticInitItems(m, items) ⇓ IR_r
────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Lower-StaticInitItems(m, [item] ++ items) ⇓ SeqIR(IR_i, IR_r)

**(Lower-StaticInit)**

```text
StaticItems(Project(Γ), m) = items    Γ ⊢ Lower-StaticInitItems(m, items) ⇓ IR
──────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Lower-StaticInit(m) ⇓ IR

**(InitCallIR)**

```text
Γ ⊢ InitFn(m) ⇓ sym
────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ InitCallIR(m) ⇓ SeqIR(CallIR(sym, [PanicOutName]), PanicCheck)

Rev([]) = []
Rev([x] ++ xs) = Rev(xs) ++ [x]

**(Lower-StaticDeinitNames-Empty)**
────────────────────────────────────────────────────────────────

```text
Γ ⊢ Lower-StaticDeinitNames(path, item, []) ⇓ ε

**(Lower-StaticDeinitNames-Cons-Resp)**

```text
StaticBindInfo(path, x).resp = resp    sym = StaticSym(item, x)    Γ ⊢ StateRef(sym) ⇓ slot    Γ ⊢ EmitDrop(StaticType(path, x), Load(slot, StaticType(path, x))) ⇓ IR_d    Γ ⊢ Lower-StaticDeinitNames(path, item, xs) ⇓ IR_r
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Lower-StaticDeinitNames(path, item, [x] ++ xs) ⇓ SeqIR(IR_d, IR_r)

**(Lower-StaticDeinitNames-Cons-NoResp)**

```text
StaticBindInfo(path, x).resp ≠ resp    Γ ⊢ Lower-StaticDeinitNames(path, item, xs) ⇓ IR_r
──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Lower-StaticDeinitNames(path, item, [x] ++ xs) ⇓ IR_r

**(Lower-StaticDeinit-Item)**

```text
item = StaticDecl(attrs_opt, vis, mut, binding, span, doc)    binding = ⟨pat, _, _, _, _⟩    xs = Rev(StaticBindList(binding))    Γ ⊢ Lower-StaticDeinitNames(PathOfModule(m), item, xs) ⇓ IR
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Lower-StaticDeinitItem(m, item) ⇓ IR

**(Lower-StaticDeinitItems-Empty)**
────────────────────────────────────────────────────────────

```text
Γ ⊢ Lower-StaticDeinitItems(m, []) ⇓ ε

**(Lower-StaticDeinitItems-Cons)**

```text
Γ ⊢ Lower-StaticDeinitItem(m, item) ⇓ IR_i    Γ ⊢ Lower-StaticDeinitItems(m, items) ⇓ IR_r
────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Lower-StaticDeinitItems(m, [item] ++ items) ⇓ SeqIR(IR_i, IR_r)

**(Lower-StaticDeinit)**

```text
StaticItems(Project(Γ), m) = items    Γ ⊢ Lower-StaticDeinitItems(m, Rev(items)) ⇓ IR
────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Lower-StaticDeinit(m) ⇓ IR

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
```

extern_block ::= attribute_list? visibility? "extern" extern_abi? "{" extern_item* "}"
extern_abi   ::= string_literal | identifier
extern_item  ::= extern_procedure_decl
```

The detailed syntax, parsing, and AST form of `extern_procedure_decl` are defined by §23.2.

#### 11.4.2 Parsing

**(Parse-ExternBlock)**

```text
Γ ⊢ ParseAttrListOpt(P) ⇓ (P_0, attrs_opt)    Γ ⊢ ParseVis(P_0) ⇓ (P_1, vis)    IsKw(Tok(P_1), `extern`)    Γ ⊢ ParseExternAbiOpt(Advance(P_1)) ⇓ (P_2, abi_opt)    IsPunc(Tok(P_2), "{")    Γ ⊢ ParseExternItemList(Advance(P_2)) ⇓ (P_3, items)    IsPunc(Tok(P_3), "}")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseItem(P) ⇓ (Advance(P_3), ⟨ExternBlock, attrs_opt, vis, abi_opt, items, SpanBetween(P, Advance(P_3)), []⟩)

**(Parse-ExternAbiOpt-None)**

```text
Tok(P).kind ∉ {StringLiteral, Identifier}
──────────────────────────────────────────────

```text
Γ ⊢ ParseExternAbiOpt(P) ⇓ (P, ⊥)

**(Parse-ExternAbiOpt-String)**
Tok(P).kind = StringLiteral
──────────────────────────────────────────────

```text
Γ ⊢ ParseExternAbiOpt(P) ⇓ (Advance(P), StringAbi(Tok(P)))

**(Parse-ExternAbiOpt-Ident)**
IsIdent(Tok(P))
──────────────────────────────────────────────

```text
Γ ⊢ ParseExternAbiOpt(P) ⇓ (Advance(P), IdentAbi(Lexeme(Tok(P))))

**(Parse-ExternItemList-End)**
IsPunc(Tok(P), "}")
────────────────────────────────────────────

```text
Γ ⊢ ParseExternItemList(P) ⇓ (P, [])

**(Parse-ExternItemList-Cons)**

```text
¬ IsPunc(Tok(P), "}")    Γ ⊢ ParseExternProcDecl(P) ⇓ (P_1, it)    Γ ⊢ ParseExternItemList(P_1) ⇓ (P_2, rest)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseExternItemList(P) ⇓ (P_2, [it] ++ rest)

#### 11.4.3 AST Representation / Form

```text
ExternBlock = ⟨attrs_opt, vis, abi_opt, items, span, doc⟩

```text
ExternItem ∈ {ExternProcDecl}

```text
abi_opt ∈ {⊥} ∪ ExternAbi

```text
ExternAbi ∈ {StringAbi, IdentAbi}

#### 11.4.4 Static Semantics

Block-level ABI validation and namespace binding are owned by this section. Signature admissibility and FFI boundary rules are defined by Chapter 23. `ExternAbiOk` is defined by §23.2.4.

**(Bind-ExternBlock)**

```text
B = [(name_i, ⟨Value, p, ⊥, Decl⟩) | ExternProcDecl(_, _, name_i, _, _, _, _, _, _, _, _) ∈ items]
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ItemBindings(⟨ExternBlock, _, _, _, items, _, _⟩, p) ⇓ B

**(WF-ExternBlock)**
item = ExternBlock(_, _, abi_opt, _, _, _)    ExternAbiOk(abi_opt)
──────────────────────────────────────────────────────────────

```text
Γ ⊢ ExternBlock : ok

**(ExternAbi-Unknown-Err)**
item = ExternBlock(_, _, abi_opt, _, _, _)    ¬ ExternAbiOk(abi_opt)    c = Code(ExternAbi-Unknown-Err)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ item ⇑ c

**(ResolveItem-ExternBlock)**

```text
Γ ⊢ ResolveExternItemList(items) ⇓ items'
──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveItem(ExternBlock(attrs_opt, vis, abi_opt, items, span, doc)) ⇓ ExternBlock(attrs_opt, vis, abi_opt, items', span, doc)

#### 11.4.5 Dynamic Semantics

`extern` blocks introduce no direct runtime mechanism. Runtime boundary behavior is defined by Chapter 23.

#### 11.4.6 Lowering

`extern` blocks contribute ABI and linkage context for the contained foreign procedures. This section introduces no lowering beyond the block shell; boundary lowering is defined by Chapter 23 and Chapter 24.

#### 11.4.7 Diagnostics

Unsupported extern-ABI-string rejection is owned by §23.2.7. Contained foreign-procedure signature diagnostics are owned by Chapter 23.

### 11.5 Module and File Aggregation

#### 11.5.1 Syntax

```text
```

path        ::= identifier ("::" identifier)*
module_path ::= path
```

Module-to-file mapping is defined by the static semantics of this section and has no independent surface token syntax.

#### 11.5.2 Parsing

`module_path` is parsed by the shared path parser.

**(Parse-ModulePath)**

```text
Γ ⊢ ParseIdent(P) ⇓ (P_1, id)    Γ ⊢ ParseModulePathTail(P_1, [id]) ⇓ (P_2, path)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseModulePath(P) ⇓ (P_2, path)

**(Parse-ModulePathTail-End)**
¬ IsOp(Tok(P), "::")
──────────────────────────────────────────────

```text
Γ ⊢ ParseModulePathTail(P, xs) ⇓ (P, xs)

**(Parse-ModulePathTail-Cons)**

```text
IsOp(Tok(P), "::")    Γ ⊢ ParseIdent(Advance(P)) ⇓ (P_1, id)    Γ ⊢ ParseModulePathTail(P_1, xs ++ [id]) ⇓ (P_2, ys)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseModulePathTail(P, xs) ⇓ (P_2, ys)

#### 11.5.3 AST Representation / Form

Path = [identifier]
ModulePath = Path
TypePath = Path
ClassPath = Path
PathString(p) = StringOfPath(p)
StringOfPathRef = {"3.4.1"}

```text
ASTModule = ⟨path, items, module_doc⟩

```text
ASTModule.path ∈ Path

```text
ASTModule.items ∈ [ASTItem]

```text
ASTModule.module_doc ∈ DocList

```text
ASTFile = ⟨path, items, module_doc⟩

```text
ASTFile.path ∈ Path

```text
ASTFile.items ∈ [ASTItem]

```text
ASTFile.module_doc ∈ DocList

#### 11.5.4 Static Semantics

This section owns file-to-module mapping, visible module sets, import-coverage checks, and module/item path resolution.

**Module Path.**

**(Module-Path-Root)**
relative(d, S) = ε
────────────────────────────

```text
Γ ⊢ ModulePath(d, S, A) = A

**(Module-Path-Rel)**
relative(d, S) = c_1 / … / c_n
──────────────────────────────────────────────

```text
Γ ⊢ ModulePath(d, S, A) = A :: c_1 :: … :: c_n

**(Module-Path-Rel-Fail)**

```text
relative(d, S) ⇑
────────────────────────────────

```text
Γ ⊢ ModulePath(d, S, A) ⇑

ModuleDirOf(A, S) = S

```text
ModuleDirOf(A :: c_1 :: … :: c_n, S) = S / c_1 / … / c_n    n ≥ 1

```text
ViewPaths(Ms) = [M.path | M ∈ Ms]
ViewAssembly(A, P, Ms) =
 A[modules := ViewPaths(Ms)]  if A.name = P.assembly.name
 A                            otherwise

```text
ProjectView(P, Ms) = P[modules := ViewPaths(Ms), assembly := P.assembly[modules := ViewPaths(Ms)], assemblies := [ViewAssembly(A, P, Ms) | A ∈ P.assemblies]]

```text
SourceRootOfModule(P, p) = S ⇔ ∃ A ∈ P.assemblies. p ∈ A.modules ∧ A.name = AsmOfPath(p) ∧ S = A.source_root

WFModulePathJudg = {WF-Module-Path}

**(WF-Module-Path-Ok)**

```text
∀ comp ∈ p, (Γ ⊢ comp : Identifier) ∧ ¬ Keyword(comp)
────────────────────────────────────────────────────────

```text
Γ ⊢ WF-Module-Path(p) ⇓ ok

**(WF-Module-Path-Reserved)**

```text
∃ comp ∈ p. Keyword(comp)    c = Code(WF-Module-Path-Reserved)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ WF-Module-Path(p) ⇑ c

**(WF-Module-Path-Ident-Err)**

```text
∃ comp ∈ p. ¬(Γ ⊢ comp : Identifier)    c = Code(WF-Module-Path-Ident-Err)
──────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ WF-Module-Path(p) ⇑ c

**(WF-Module-Path-Collision)**

```text
p_1 ≠ p_2    Fold(p_1) = Fold(p_2)
────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Emit(Code(WF-Module-Path-Collision))    Γ ⊢ Emit(W-MOD-1101, ⊥)

**Module Discovery (Small-Step)**

```text
ModuleAggInputs(P) = ⟨P.modules, P.source_root, { CompilationUnit(ModuleDirOf(p, P.source_root)) | p ∈ P.modules }⟩

```text
ModuleAggOutputs(P) = ⟨{ ASTModule(P, p) | p ∈ P.modules }, { NameMap(P, p) | p ∈ P.modules }, G, InitOrder, InitPlan⟩

```text
ModuleMap(P, p) = M ⇔ SourceRootOfModule(P, p) = S ∧ Γ ⊢ ParseModule(p, S) ⇓ M

```text
ASTModule(P, p) = M ⇔ ModuleMap(P, p) = M

```text
PathOfModule(p) = [c_1, …, c_n] ⇔ p = c_1 :: ··· :: c_n

```text
NameCollectAfterParse(P) ⇔ Γ ⊢ ParseModules(P) ⇓ Ms ∧ ∀ M ∈ Ms. ∃ N. Γ ⊢ CollectNames(M) ⇓ N
NameCollectOrderIndepRef = {"5.1.5"}
ForwardRefOrderRef = {"5.12"}

```text
ParseModule ∈ RulesIn({"3.4.1", "3.4.2"})

**ParseModule (Big-Step).**
U = CompilationUnit(ModuleDirOf(p, S))
U = [f_1, …, f_n]
ReadBytes : Path ⇀ Bytes

**(ReadBytes-Ok)**
read_ok(f) = B
──────────────────────────────────────────────

```text
Γ ⊢ ReadBytes(f) ⇓ B

**(ReadBytes-Err)**

```text
read_ok(f) ⇑    c = Code(ReadBytes-Err)
──────────────────────────────────────────────

```text
Γ ⊢ ReadBytes(f) ⇑ c

```text
Bytes(f) = B ⇔ Γ ⊢ ReadBytes(f) ⇓ B

**(ParseModule-Ok)**

```text
∀ i, Γ ⊢ ReadBytes(f_i) ⇓ B_i    Γ ⊢ LoadSource(f_i, B_i) ⇓ S_i    Γ ⊢ ParseFile(S_i) ⇓ F_i
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseModule(p, S) ⇓ ⟨p, F_1.items ++ ··· ++ F_n.items, F_1.module_doc ++ ··· ++ F_n.module_doc⟩

**(ParseModule-Err-Read)**

```text
∃ i, Γ ⊢ ReadBytes(f_i) ⇑ c
──────────────────────────────────────────────

```text
Γ ⊢ ParseModule(p, S) ⇑ c

**(ParseModule-Err-Load)**

```text
∃ i, Γ ⊢ ReadBytes(f_i) ⇓ B_i    Γ ⊢ LoadSource(f_i, B_i) ⇑ c
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseModule(p, S) ⇑ c

**LoadSource Short-Circuit.**

```text
If Γ ⊢ LoadSource(f, B) ⇑ c for any file in a compilation unit, ParseModule MUST NOT invoke Tokenize, ParseFile, or subsequent syntactic well-formedness checks for that file.

**(ParseModule-Err-Unit)**

```text
Γ ⊢ CompilationUnit(ModuleDirOf(p, S)) ⇑ c
──────────────────────────────────────────────

```text
Γ ⊢ ParseModule(p, S) ⇑ c

**(ParseModule-Err-Parse)**

```text
∃ i, Γ ⊢ ReadBytes(f_i) ⇓ B_i    Γ ⊢ LoadSource(f_i, B_i) ⇓ S_i    Γ ⊢ ParseFile(S_i) ⇑ c
──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseModule(p, S) ⇑ c

```text
ParseFileBestEffort(S) ⇔ ∃ F. Γ ⊢ ParseFile(S) ⇓ F

```text
ParseFileOk(S) ⇔ ParseFileBestEffort(S) ∧ ¬ HasError(ParseFileDiag(S))

```text
ParseFileDiag(S) = Δ ⇔ Γ ⊢ Tokenize(S) ⇓ (K_raw, D) ∧ K = Filter(K_raw) ∧ P_0 = ⟨K, 0, D, 0, 0, []⟩ ∧ Γ ⊢ ParseItems(P_0) ⇓ (P_1, I, MDoc) ∧ DiagStream(P_1) = Δ

```text
HasError(Δ) ⇔ ∃ d ∈ Δ. d.severity = Error

**ParseModule (Small-Step).**
ModState = {ModStart(p, S), ModScan(p, S, U, items, docs), ModDone(M), Error(code)}

**(Mod-Start)**
U = CompilationUnit(ModuleDirOf(p, S))
──────────────────────────────────────────────

```text
⟨ModStart(p, S)⟩ → ⟨ModScan(p, S, U, [], [])⟩

**(Mod-Start-Err-Unit)**

```text
Γ ⊢ CompilationUnit(ModuleDirOf(p, S)) ⇑ c
──────────────────────────────────────────────

```text
⟨ModStart(p, S)⟩ → ⟨Error(c)⟩

**(Mod-Scan)**

```text
U = f :: fs    Γ ⊢ ReadBytes(f) ⇓ B    Γ ⊢ LoadSource(f, B) ⇓ S_f    Γ ⊢ ParseFile(S_f) ⇓ F
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨ModScan(p, S, f :: fs, items, docs)⟩ → ⟨ModScan(p, S, fs, items ++ F.items, docs ++ F.module_doc)⟩

**(Mod-Scan-Err-Read)**

```text
U = f :: fs    Γ ⊢ ReadBytes(f) ⇑ c
──────────────────────────────────────────────────────────────

```text
⟨ModScan(p, S, f :: fs, items, docs)⟩ → ⟨Error(c)⟩

**(Mod-Scan-Err-Load)**

```text
U = f :: fs    Γ ⊢ ReadBytes(f) ⇓ B    Γ ⊢ LoadSource(f, B) ⇑ c
──────────────────────────────────────────────────────────────────────────────

```text
⟨ModScan(p, S, f :: fs, items, docs)⟩ → ⟨Error(c)⟩

**(Mod-Scan-Err-Parse)**

```text
U = f :: fs    Γ ⊢ ReadBytes(f) ⇓ B    Γ ⊢ LoadSource(f, B) ⇓ S_f    Γ ⊢ ParseFile(S_f) ⇑ c
──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨ModScan(p, S, f :: fs, items, docs)⟩ → ⟨Error(c)⟩

**(Mod-Done)**
──────────────────────────────────────────────────────────────────────────────

```text
⟨ModScan(p, S, [], items, docs)⟩ → ⟨ModDone(⟨p, items, docs⟩)⟩

**ParseModules (Big-Step).**

P.modules = [p_1, …, p_k]

**(ParseModules-Ok)**

```text
∀ i, Γ ⊢ ParseModule(p_i, P.source_root) ⇓ M_i
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseModules(P) ⇓ [M_1, …, M_k]

**(ParseModules-Err)**

```text
∃ i, Γ ⊢ ParseModule(p_i, P.source_root) ⇑ c
──────────────────────────────────────────────

```text
Γ ⊢ ParseModules(P) ⇑ c

DiscState = {DiscStart(S, A), DiscScan(S, A, Pending, M, Seen), DiscDone(M), Error(code)}

**(Disc-Start)**
────────────────────────────────────────────────────────────────────────────

```text
⟨DiscStart(S, A)⟩ → ⟨DiscScan(S, A, DirSeq(S), [], ∅)⟩

**(Disc-Skip)**

```text
Γ ⊬ d : ModuleDir
────────────────────────────────────────────────────────────

```text
⟨DiscScan(S, A, d::ds, M, Seen)⟩ → ⟨DiscScan(S, A, ds, M, Seen)⟩

**(Disc-Add)**

```text
Γ ⊢ d : ModuleDir    Γ ⊢ ModulePath(d, S, A) = p    Γ ⊢ WF-Module-Path(p) ⇓ ok    Fold(p) ∉ dom(Seen)
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨DiscScan(S, A, d::ds, M, Seen)⟩ → ⟨DiscScan(S, A, ds, M ++ [p], Seen ∪ {Fold(p) ↦ p})⟩

**(Disc-Collision)**

```text
Γ ⊢ d : ModuleDir    Γ ⊢ ModulePath(d, S, A) = p    Γ ⊢ WF-Module-Path(p) ⇓ ok    Fold(p) ∈ dom(Seen)    Seen[Fold(p)] ≠ p
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨DiscScan(S, A, d::ds, M, Seen)⟩ → ⟨Error(Code(Disc-Collision))⟩

**(Disc-Invalid-Component)**

```text
Γ ⊢ d : ModuleDir    Γ ⊢ ModulePath(d, S, A) = p    Γ ⊢ WF-Module-Path(p) ⇑ c
────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨DiscScan(S, A, d::ds, M, Seen)⟩ → ⟨Error(c)⟩

**(Disc-Rel-Fail)**

```text
Γ ⊢ d : ModuleDir    relative(d, S) ⇑
────────────────────────────────────────────────────────────────────────────

```text
⟨DiscScan(S, A, d::ds, M, Seen)⟩ → ⟨Error(Code(Disc-Rel-Fail))⟩

**(Disc-Done)**
──────────────────────────────────────────────────────────────

```text
⟨DiscScan(S, A, [], M, Seen)⟩ → ⟨DiscDone(M)⟩

**Qualified Lookup.**

```text
P = Project(Γ)

```text
m = CurrentModule(Γ)

```text
AllModulePaths(P) = ⋃_{A ∈ P.assemblies} A.modules

```text
AsmOfPath(p) = p[0]    if |p| ≥ 1
AsmOfModule(m) = AsmOfPath(m)

```text
ImportDecls(m) = [d | d ∈ ASTModule(P, m).items ∧ d = ImportDecl(_, _, _, _, _, _)]

```text
ImportPaths(m) = [mp | ImportDecl(_, _, path, _, _, _) ∈ ImportDecls(m) ∧ Γ ⊢ ResolveImportPath(path) ⇓ mp]

```text
VisibleAssemblies(m) = {AsmOfModule(m)} ∪ {AsmOfPath(p) | p ∈ ImportPaths(m)}

```text
PublicAPI(m) ⇔ ∃ it ∈ ASTModule(P, m).items. Vis(it) = `public`

```text
VisibleModulePaths(m) = { p | p ∈ AllModulePaths(P) ∧ AsmOfPath(p) ∈ VisibleAssemblies(m) }

```text
AllModuleNames = { StringOfPath(p) | p ∈ AllModulePaths(P) }

```text
VisibleModuleNames(m) = { StringOfPath(p) | p ∈ VisibleModulePaths(m) }
ModulePaths = VisibleModulePaths(m)
ModuleNames = VisibleModuleNames(m)
Alias = AliasMap(m)
AllModules = AllModulePaths(P)

**Module Prefix Resolution.**

```text
ModulePathPrefix(path, pref) ⇔ ∃ rest. path = pref ++ rest

**(AliasExpand-None)**

```text
path = a::rest    a ∉ dom(Alias)
──────────────────────────────────────────────────────────────

```text
Γ ⊢ AliasExpand(path, Alias) ⇓ path

**(AliasExpand-Yes)**

```text
path = a::rest    a ∈ dom(Alias)    Alias[a] = p_a
────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ AliasExpand(path, Alias) ⇓ p_a ++ rest

CurrentAsmPath(m, path) = [AsmOfModule(m)] ++ path

**(ModulePrefix-Direct)**

```text
Γ ⊢ AliasExpand(path, Alias) ⇓ path'    ∃ p ∈ AllModules, ModulePathPrefix(path', p)    p = argmax_{q ∈ AllModules, ModulePathPrefix(path', q)} |q|
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ModulePrefix(path, AllModules, Alias) ⇓ p

**(ModulePrefix-Current)**

```text
Γ ⊢ AliasExpand(path, Alias) ⇓ path'    ¬ ∃ p ∈ AllModules. ModulePathPrefix(path', p)    path'' = CurrentAsmPath(m, path')    ∃ p ∈ AllModules, ModulePathPrefix(path'', p)    p = argmax_{q ∈ AllModules, ModulePathPrefix(path'', q)} |q|
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ModulePrefix(path, AllModules, Alias) ⇓ p

**(ModulePrefix-None)**

```text
Γ ⊢ AliasExpand(path, Alias) ⇓ path'    ¬ ∃ p ∈ AllModules. ModulePathPrefix(path', p)    path'' = CurrentAsmPath(m, path')    ¬ ∃ p ∈ AllModules. ModulePathPrefix(path'', p)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ModulePrefix(path, AllModules, Alias) ↑

**(Resolve-ModulePath-Direct)**

```text
Γ ⊢ AliasExpand(path, Alias) ⇓ path'    StringOfPath(path') ∈ ModuleNames
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveModulePath(path, Alias, ModuleNames) ⇓ path'

**(Resolve-ModulePath-Current)**

```text
Γ ⊢ AliasExpand(path, Alias) ⇓ path'    StringOfPath(path') ∉ ModuleNames    path'' = CurrentAsmPath(m, path')    StringOfPath(path'') ∈ ModuleNames
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveModulePath(path, Alias, ModuleNames) ⇓ path''

**(ResolveModulePath-Err)**

```text
Γ ⊢ AliasExpand(path, Alias) ⇓ path'    StringOfPath(path') ∉ ModuleNames    path'' = CurrentAsmPath(m, path')    StringOfPath(path'') ∉ ModuleNames    c = Code(ResolveModulePath-Err)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveModulePath(path, Alias, ModuleNames) ⇑ c

```text
ModuleByPath(P, p) = m ⇔ ASTModule(P, p) = m

```text
ModuleOfPath(path) = mp ⇔ SplitLast(path) = (mp, name)

```text
ItemNames(mp) = { n | NameMap(P, mp)[n].kind ∈ {Value, Type, Class} }

**(ItemOfPath)**
|path| ≥ 2    SplitLast(path) = (mp_raw, name)    Γ ⊢ ResolveImportPath(mp_raw) ⇓ mp    IdKey(name) ∈ ItemNames(mp)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ItemOfPath(path) ⇓ (mp, name)

**(ItemOfPath-None)**

```text
¬ (|path| ≥ 2 ∧ SplitLast(path) = (mp_raw, name) ∧ Γ ⊢ ResolveImportPath(mp_raw) ⇓ mp ∧ IdKey(name) ∈ ItemNames(mp))
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ItemOfPath(path) ↑

```text
ImportRequired(m, path) ⇔ AsmOfPath(path) ≠ AsmOfModule(m)

```text
ImportCovers(m, path) ⇔ ∃ p ∈ ImportPaths(m). ModulePathPrefix(p, path)
ImportOkJudg = {ImportOk}

**(Import-Ok-Local)**
¬ ImportRequired(m, path)
──────────────────────────────────────────────

```text
Γ ⊢ ImportOk(m, path) ⇓ ok

**(Import-Ok-Covered)**
ImportRequired(m, path)    ImportCovers(m, path)
──────────────────────────────────────────────

```text
Γ ⊢ ImportOk(m, path) ⇓ ok

**(Import-Ok-Err)**
ImportRequired(m, path)    ¬ ImportCovers(m, path)    c = Code(Import-Using-Missing)
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ImportOk(m, path) ⇑ c

**(Resolve-Import-Direct)**

```text
StringOfPath(path) ∈ AllModuleNames
──────────────────────────────────────────────

```text
Γ ⊢ ResolveImportPath(path) ⇓ path

**(Resolve-Import-Current)**

```text
StringOfPath(path) ∉ AllModuleNames    path' = CurrentAsmPath(m, path)    StringOfPath(path') ∈ AllModuleNames
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveImportPath(path) ⇓ path'

**(Resolve-Import-Err)**

```text
StringOfPath(path) ∉ AllModuleNames    path' = CurrentAsmPath(m, path)    StringOfPath(path') ∉ AllModuleNames    c = Code(Resolve-Import-Err)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveImportPath(path) ⇑ c

**(Resolve-Using-Ok)**

```text
Γ ⊢ ItemOfPath(path) ⇓ (mp, name)
──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveUsingPath(path) ⇓ ⟨mp, name⟩

**(Resolve-Using-Err)**

```text
Γ ⊢ ItemOfPath(path) ↑    c = Code(Resolve-Using-None)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveUsingPath(path) ⇑ c

Accessibility of resolved items is defined by Chapter 7.

**Initialization Dependency Analysis.**

```text
env_m = ⟨self = m, Modules = AllModules, Alias = AliasMap(m), UsingValueMap = UsingValueMap(m), UsingTypeMap = UsingTypeMap(m)⟩

**(Reachable-Edge)**

```text
(u, v) ∈ E
──────────────────────────

```text
Γ ⊢ Reachable(u, v, E)

**(Reachable-Step)**

```text
(u, w) ∈ E    Γ ⊢ Reachable(w, v, E)
────────────────────────────────────

```text
Γ ⊢ Reachable(u, v, E)

FullPath(path, name) = path ++ [name]

```text
EnumPath(path) = p ⇔ SplitLast(path) = (p, n)

```text
VariantName(path) = n ⇔ SplitLast(path) = (p, n)

TypeRefsJudg = {TypeRefsTy, TypeRefsRef, TypeRefsExpr, TypeRefsPat, TypeRefsArgs}
Modules = env.Modules
Alias = env.Alias
UsingTypeMap = env.UsingTypeMap

**(TypeRef-Path)**
|path| ≥ 2    Γ ⊢ ModulePrefix(path, Modules, Alias) ⇓ mp    mp ≠ env.self
────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsTy(TypePath(path), env) ⇓ {mp}

**(TypeRef-Using)**

```text
path = [name]    name ∈ dom(UsingTypeMap)    UsingTypeMap[name] ≠ env.self
────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsTy(TypePath(path), env) ⇓ {UsingTypeMap[name]}

**(TypeRef-Path-Local)**

```text
(|path| ≠ 1 ∨ (path = [name] ∧ name ∉ dom(UsingTypeMap)))    (Γ ⊢ ModulePrefix(path, Modules, Alias) ⇑ ∨ Γ ⊢ ModulePrefix(path, Modules, Alias) ⇓ env.self)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsTy(TypePath(path), env) ⇓ ∅

**(TypeRef-Dynamic)**

```text
Γ ⊢ TypeRefsTy(TypePath(path), env) ⇓ T
────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsTy(TypeDynamic(path), env) ⇓ T

**(TypeRef-ModalState)**

```text
Γ ⊢ TypeRefsRef(modal_ref, env) ⇓ T
──────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsTy(TypeModalState(modal_ref, state), env) ⇓ T

**(TypeRef-Apply)**

```text
Γ ⊢ TypeRefsTy(TypePath(path), env) ⇓ T_p    ∀ i, Γ ⊢ TypeRefsTy(args_i, env) ⇓ T_i
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsTy(TypeApply(path, args), env) ⇓ T_p ∪ ⋃_{i=1}^n T_i

**(TypeRef-Perm)**

```text
Γ ⊢ TypeRefsTy(base, env) ⇓ T
────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsTy(TypePerm(perm, base), env) ⇓ T

**(TypeRef-Prim)**
────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsTy(TypePrim(_), env) ⇓ ∅

**(TypeRef-Tuple)**

```text
∀ i, Γ ⊢ TypeRefsTy(t_i, env) ⇓ T_i
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsTy(TypeTuple([t_1, …, t_n]), env) ⇓ ⋃_{i=1}^n T_i

**(TypeRef-Array)**

```text
Γ ⊢ TypeRefsTy(elem, env) ⇓ T_e    Γ ⊢ TypeRefsExpr(size_expr, env) ⇓ T_s
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsTy(TypeArray(elem, size_expr), env) ⇓ T_e ∪ T_s

**(TypeRef-Slice)**

```text
Γ ⊢ TypeRefsTy(elem, env) ⇓ T
────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsTy(TypeSlice(elem), env) ⇓ T

**(TypeRef-Union)**

```text
∀ i, Γ ⊢ TypeRefsTy(t_i, env) ⇓ T_i
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsTy(TypeUnion([t_1, …, t_n]), env) ⇓ ⋃_{i=1}^n T_i

**(TypeRef-Func)**

```text
∀ i, params_i = ⟨m_i, t_i⟩    Γ ⊢ TypeRefsTy(t_i, env) ⇓ T_i    Γ ⊢ TypeRefsTy(ret, env) ⇓ T_r
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsTy(TypeFunc([params_1, …, params_n], ret), env) ⇓ (⋃_{i=1}^n T_i) ∪ T_r

**(TypeRef-String)**
────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsTy(TypeString(_), env) ⇓ ∅

**(TypeRef-Bytes)**
───────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsTy(TypeBytes(_), env) ⇓ ∅

**(TypeRef-Ptr)**

```text
Γ ⊢ TypeRefsTy(elem, env) ⇓ T
────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsTy(TypePtr(elem, _), env) ⇓ T

**(TypeRef-RawPtr)**

```text
Γ ⊢ TypeRefsTy(elem, env) ⇓ T
────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsTy(TypeRawPtr(_, elem), env) ⇓ T

**(TypeRef-Range)**

```text
Γ ⊢ TypeRefsTy(base, env) ⇓ T
────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsTy(TypeRange(base), env) ⇓ T

**(TypeRef-RangeInclusive)**

```text
Γ ⊢ TypeRefsTy(base, env) ⇓ T
────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsTy(TypeRangeInclusive(base), env) ⇓ T

**(TypeRef-RangeFrom)**

```text
Γ ⊢ TypeRefsTy(base, env) ⇓ T
────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsTy(TypeRangeFrom(base), env) ⇓ T

**(TypeRef-RangeTo)**

```text
Γ ⊢ TypeRefsTy(base, env) ⇓ T
────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsTy(TypeRangeTo(base), env) ⇓ T

**(TypeRef-RangeToInclusive)**

```text
Γ ⊢ TypeRefsTy(base, env) ⇓ T
──────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsTy(TypeRangeToInclusive(base), env) ⇓ T

**(TypeRef-RangeFull)**
──────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsTy(TypeRangeFull, env) ⇓ ∅

**(TypeRef-Ref-Path)**

```text
Γ ⊢ TypeRefsTy(TypePath(path), env) ⇓ T
────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsRef(TypePath(path), env) ⇓ T

**(TypeRef-Ref-Apply)**

```text
Γ ⊢ TypeRefsTy(TypeApply(path, args), env) ⇓ T
──────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsRef(TypeApply(path, args), env) ⇓ T

**(TypeRef-Ref-ModalState)**

```text
Γ ⊢ TypeRefsTy(TypeModalState(modal_ref, state), env) ⇓ T
────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsRef(ModalStateRef(modal_ref, state), env) ⇓ T

**(TypeRef-RecordExpr)**

```text
Γ ⊢ TypeRefsRef(r, env) ⇓ T_t    Γ ⊢ TypeRefsExprs(fields, env) ⇓ T_e
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsExpr(RecordExpr(r, fields), env) ⇓ T_t ∪ T_e

**(TypeRef-EnumLiteral)**

```text
Γ ⊢ TypeRefsTy(TypePath(EnumPath(path)), env) ⇓ T_t    Γ ⊢ TypeRefsEnumPayload(payload_opt, env) ⇓ T_p
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsExpr(EnumLiteral(path, payload_opt), env) ⇓ T_t ∪ T_p

**(TypeRef-QualBrace)**

```text
Γ ⊢ TypeRefsTy(TypePath(FullPath(path, name)), env) ⇓ T_t    Γ ⊢ TypeRefsExprs(fields, env) ⇓ T_f
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsExpr(QualifiedApply(path, name, Brace(fields)), env) ⇓ T_t ∪ T_f

**(TypeRef-Cast)**

```text
Γ ⊢ TypeRefsExpr(e, env) ⇓ T_e    Γ ⊢ TypeRefsTy(ty, env) ⇓ T_t
────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsExpr(Cast(e, ty), env) ⇓ T_e ∪ T_t

**(TypeRef-Transmute)**

```text
Γ ⊢ TypeRefsExpr(e, env) ⇓ T_e    Γ ⊢ TypeRefsTy(t_1, env) ⇓ T_1    Γ ⊢ TypeRefsTy(t_2, env) ⇓ T_2
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsExpr(TransmuteExpr(t_1, t_2, e), env) ⇓ T_e ∪ T_1 ∪ T_2

**(TypeRef-CallTypeArgs)**

```text
Γ ⊢ TypeRefsExpr(callee, env) ⇓ T_c    Γ ⊢ TypeRefsArgs(args, env) ⇓ T_a    ∀ i, Γ ⊢ TypeRefsTy(type_args[i], env) ⇓ T_i
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsExpr(CallTypeArgs(callee, type_args, args), env) ⇓ T_c ∪ T_a ∪ ⋃_{i=1}^n T_i

TypeRefsExprRules = {TypeRef-RecordExpr, TypeRef-EnumLiteral, TypeRef-QualBrace, TypeRef-Cast, TypeRef-Transmute, TypeRef-CallTypeArgs, TypeRef-Expr-Sub}

```text
NoSpecificTypeRefsExpr(e) ⇔ ¬ ∃ r ∈ TypeRefsExprRules \ {TypeRef-Expr-Sub}. PremisesHold(r, e)

**(TypeRef-Expr-Sub)**

```text
NoSpecificTypeRefsExpr(e)    Children_LTR(e) = [e_1, …, e_n]    ∀ i, Γ ⊢ TypeRefsExpr(e_i, env) ⇓ T_i
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsExpr(e, env) ⇓ ⋃_{i=1}^n T_i

**(TypeRef-RecordPattern)**

```text
Γ ⊢ TypeRefsTy(TypePath(tp), env) ⇓ T_t    Γ ⊢ TypeRefsFields(fields, env) ⇓ T_f
──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsPat(RecordPattern(tp, fields), env) ⇓ T_t ∪ T_f

**(TypeRef-EnumPattern)**

```text
Γ ⊢ TypeRefsTy(TypePath(tp), env) ⇓ T_t    Γ ⊢ TypeRefsPayload(payload, env) ⇓ T_p
─────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsPat(EnumPattern(tp, _, payload), env) ⇓ T_t ∪ T_p

**(TypeRef-LiteralPattern)**
──────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsPat(LiteralPattern(_), env) ⇓ ∅

**(TypeRef-WildcardPattern)**
───────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsPat(WildcardPattern, env) ⇓ ∅

**(TypeRef-IdentifierPattern)**
───────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsPat(IdentifierPattern(_), env) ⇓ ∅

**(TypeRef-TuplePattern)**

```text
∀ i, Γ ⊢ TypeRefsPat(p_i, env) ⇓ T_i
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsPat(TuplePattern([p_1, …, p_n]), env) ⇓ ⋃_{i=1}^n T_i

**(TypeRef-ModalPattern-None)**
────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsPat(ModalPattern(_, ⊥), env) ⇓ ∅

**(TypeRef-ModalPattern-Record)**

```text
Γ ⊢ TypeRefsFields(fields, env) ⇓ T
────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsPat(ModalPattern(_, ModalRecordPayload(fields)), env) ⇓ T

**(TypeRef-RangePattern)**

```text
Γ ⊢ TypeRefsPat(p_l, env) ⇓ T_l    Γ ⊢ TypeRefsPat(p_h, env) ⇓ T_h
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsPat(RangePattern(_, p_l, p_h), env) ⇓ T_l ∪ T_h

**(TypeRef-Field-Explicit)**

```text
Γ ⊢ TypeRefsPat(p, env) ⇓ T
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsPat(⟨name, pattern_opt = p, span⟩, env) ⇓ T

**(TypeRef-Field-Implicit)**
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsPat(⟨name, pattern_opt = ⊥, span⟩, env) ⇓ ∅

**(TypeRefsExprs-Empty)**
────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsExprs([], env) ⇓ ∅

**(TypeRefsExprs-Cons)**

```text
f = ⟨name, e⟩    Γ ⊢ TypeRefsExpr(e, env) ⇓ T_e    Γ ⊢ TypeRefsExprs(fs, env) ⇓ T_f
────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsExprs(f::fs, env) ⇓ T_e ∪ T_f

TypeRefsArgsJudg = {TypeRefsArgs}

**(TypeRefsArgs-Empty)**
────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsArgs([], env) ⇓ ∅

**(TypeRefsArgs-Cons)**

```text
a = ⟨moved, e, span⟩    Γ ⊢ TypeRefsExpr(e, env) ⇓ T_e    Γ ⊢ TypeRefsArgs(rest, env) ⇓ T_r
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsArgs(a::rest, env) ⇓ T_e ∪ T_r

**(TypeRefsEnumPayload-None)**
──────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsEnumPayload(⊥, env) ⇓ ∅

**(TypeRefsEnumPayload-Tuple)**

```text
∀ i, Γ ⊢ TypeRefsExpr(e_i, env) ⇓ T_i
──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsEnumPayload(Paren([e_1, …, e_n]), env) ⇓ ⋃_{i=1}^n T_i

**(TypeRefsEnumPayload-Record)**

```text
Γ ⊢ TypeRefsExprs(fields, env) ⇓ T
────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsEnumPayload(Brace(fields), env) ⇓ T

**(TypeRefsFields-Empty)**
────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsFields([], env) ⇓ ∅

**(TypeRefsFields-Cons)**

```text
Γ ⊢ TypeRefsPat(f, env) ⇓ T_f    Γ ⊢ TypeRefsFields(fs, env) ⇓ T_s
──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsFields(f::fs, env) ⇓ T_f ∪ T_s

**(TypeRefsPayload-None)**
────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsPayload(⊥, env) ⇓ ∅

**(TypeRefsPayload-Tuple)**

```text
∀ i, Γ ⊢ TypeRefsPat(p_i, env) ⇓ T_i
────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsPayload(TuplePayloadPattern([p_1, …, p_n]), env) ⇓ ⋃_{i=1}^n T_i

**(TypeRefsPayload-Record)**

```text
Γ ⊢ TypeRefsFields(fields, env) ⇓ T
───────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TypeRefsPayload(RecordPayloadPattern(fields), env) ⇓ T

UsingValueMap = env.UsingValueMap
ValueRefsJudg = {ValueRefs, ValueRefsArgs, ValueRefsFields}

**(ValueRef-Ident)**

```text
name ∈ dom(UsingValueMap)    UsingValueMap[name] ≠ env.self
──────────────────────────────────────────────────────────────

```text
Γ ⊢ ValueRefs(Identifier(name), env) ⇓ {UsingValueMap[name]}

**(ValueRef-Ident-Local)**

```text
name ∉ dom(UsingValueMap)
────────────────────────────────────────────────────

```text
Γ ⊢ ValueRefs(Identifier(name), env) ⇓ ∅

**(ValueRef-Qual)**

```text
Γ ⊢ ModulePrefix(path, Modules, Alias) ⇓ mp    mp ≠ env.self
────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ValueRefs(QualifiedName(path, _), env) ⇓ {mp}

**(ValueRef-Qual-Local)**

```text
Γ ⊢ ModulePrefix(path, Modules, Alias) ⇑ ∨ Γ ⊢ ModulePrefix(path, Modules, Alias) ⇓ env.self
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ValueRefs(QualifiedName(path, _), env) ⇓ ∅

**(ValueRef-QualApply)**

```text
Γ ⊢ ModulePrefix(path, Modules, Alias) ⇓ mp    mp ≠ env.self    Γ ⊢ ValueRefsArgs(args, env) ⇓ V_a
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ValueRefs(QualifiedApply(path, _, Paren(args)), env) ⇓ {mp} ∪ V_a

**(ValueRef-QualApply-Local)**

```text
(Γ ⊢ ModulePrefix(path, Modules, Alias) ⇑ ∨ Γ ⊢ ModulePrefix(path, Modules, Alias) ⇓ env.self)    Γ ⊢ ValueRefsArgs(args, env) ⇓ V_a
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ValueRefs(QualifiedApply(path, _, Paren(args)), env) ⇓ V_a

**(ValueRef-QualApply-Brace)**

```text
Γ ⊢ ValueRefsFields(fields, env) ⇓ V_f
────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ValueRefs(QualifiedApply(path, _, Brace(fields)), env) ⇓ V_f

ValueRefsRules = {ValueRef-Ident, ValueRef-Ident-Local, ValueRef-Qual, ValueRef-Qual-Local, ValueRef-QualApply, ValueRef-QualApply-Local, ValueRef-QualApply-Brace, ValueRef-Expr-Sub}

```text
NoSpecificValueRefsExpr(e) ⇔ ¬ ∃ r ∈ ValueRefsRules \ {ValueRef-Expr-Sub}. PremisesHold(r, e)

**(ValueRef-Expr-Sub)**

```text
NoSpecificValueRefsExpr(e)    Children_LTR(e) = [e_1, …, e_n]    ∀ i, Γ ⊢ ValueRefs(e_i, env) ⇓ V_i
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ValueRefs(e, env) ⇓ ⋃_{i=1}^n V_i

**(ValueRefsArgs-Empty)**
────────────────────────────────────────────────────────

```text
Γ ⊢ ValueRefsArgs([], env) ⇓ ∅

**(ValueRefsArgs-Cons)**

```text
a = ⟨moved, e, span⟩    Γ ⊢ ValueRefs(e, env) ⇓ V_e    Γ ⊢ ValueRefsArgs(args, env) ⇓ V_a
────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ValueRefsArgs(a::args, env) ⇓ V_e ∪ V_a

**(ValueRefsFields-Empty)**
────────────────────────────────────────────────────────

```text
Γ ⊢ ValueRefsFields([], env) ⇓ ∅

**(ValueRefsFields-Cons)**

```text
f = ⟨name, e⟩    Γ ⊢ ValueRefs(e, env) ⇓ V_e    Γ ⊢ ValueRefsFields(fs, env) ⇓ V_f
───────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ValueRefsFields(f::fs, env) ⇓ V_e ∪ V_f

Elems(v) =

```text
 {v}    if v ∈ ASTNode

```text
 {x | x ∈ v ∧ x ∈ ASTNode}    if v ∈ [_]

```text
 ∅    if v = ⊥
 ∅    otherwise

```text
Child(x, y) ⇔ ∃ C, a_1, …, a_k. x = C(a_1, …, a_k) ∧ y ∈ ⋃_{i=1}^k Elems(a_i)
E_child = { (x, y) | Child(x, y) }

```text
Subnode(x, y) ⇔ x = y ∨ Γ ⊢ Reachable(x, y, E_child)

```text
ExprNodes(P, m) = { e | e ∈ Expr ∧ Subnode(ASTModule(P, m), e) }

```text
PatNodes(P, m) = { p | p ∈ Pattern ∧ Subnode(ASTModule(P, m), p) }

```text
ExprNodesOf(x) = { e | e ∈ Expr ∧ Subnode(x, e) }

```text
VariantPayloadTypeSet(⊥) = ∅

```text
VariantPayloadTypeSet(TuplePayload(tys)) = { t | t ∈ tys }

```text
VariantPayloadTypeSet(RecordPayload(fields)) = { t | ∃ attrs_opt, vis, boundary, name, init_opt, span, doc_opt. FieldDecl(attrs_opt, vis, boundary, name, t, init_opt, span, doc_opt) ∈ fields }

```text
EnumVariantTypeSet(variants) = { t | ∃ name, payload_opt, disc_opt, span, doc_opt. VariantDecl(name, payload_opt, disc_opt, span, doc_opt) ∈ variants ∧ t ∈ VariantPayloadTypeSet(payload_opt) }

```text
TypeOptSet(⊥) = ∅
TypeOptSet(T) = {T}

```text
ParamTypeSet(params) = { t | ∃ mode, name. ⟨mode, name, t⟩ ∈ params }
RecvTypeSet(ReceiverExplicit(_, t)) = {t}
RecvTypeSet(ReceiverShorthand(_)) = ∅

```text
ClassPathTypeSet(paths) = { TypePath(p) | p ∈ paths }

```text
RecordFieldTypeSet(members) = { t | ∃ attrs, vis, boundary, name, init, span, doc. FieldDecl(attrs, vis, boundary, name, t, init, span, doc) ∈ members }

```text
RecordMethodRecvTypes(members) = { t | ∃ attrs, vis, ov, name, gen_params, recv, params, ret, contract, body, span, doc. MethodDecl(attrs, vis, ov, name, gen_params, recv, params, ret, contract, body, span, doc) ∈ members ∧ t ∈ RecvTypeSet(recv) }

```text
RecordMethodParamTypes(members) = { t | ∃ attrs, vis, ov, name, gen_params, recv, params, ret, contract, body, span, doc. MethodDecl(attrs, vis, ov, name, gen_params, recv, params, ret, contract, body, span, doc) ∈ members ∧ t ∈ ParamTypeSet(params) }

```text
RecordMethodRetTypes(members) = { t | ∃ attrs, vis, ov, name, gen_params, recv, params, ret, contract, body, span, doc. MethodDecl(attrs, vis, ov, name, gen_params, recv, params, ret, contract, body, span, doc) ∈ members ∧ t ∈ TypeOptSet(ret) }
RecordMemberTypeSet(members) = RecordFieldTypeSet(members) ∪ RecordMethodRecvTypes(members) ∪ RecordMethodParamTypes(members) ∪ RecordMethodRetTypes(members)

```text
ClassFieldTypeSet(items) = { t | ∃ attrs, vis, boundary, name, span, doc. ClassFieldDecl(attrs, vis, boundary, name, t, span, doc) ∈ items }

```text
ClassMethodRecvTypes(items) = { t | ∃ attrs, vis, name, gen_params, recv, params, ret, contract, body, span, doc. ClassMethodDecl(attrs, vis, name, gen_params, recv, params, ret, contract, body, span, doc) ∈ items ∧ t ∈ RecvTypeSet(recv) }

```text
ClassMethodParamTypes(items) = { t | ∃ attrs, vis, name, gen_params, recv, params, ret, contract, body, span, doc. ClassMethodDecl(attrs, vis, name, gen_params, recv, params, ret, contract, body, span, doc) ∈ items ∧ t ∈ ParamTypeSet(params) }

```text
ClassMethodRetTypes(items) = { t | ∃ attrs, vis, name, gen_params, recv, params, ret, contract, body, span, doc. ClassMethodDecl(attrs, vis, name, gen_params, recv, params, ret, contract, body, span, doc) ∈ items ∧ t ∈ TypeOptSet(ret) }
ClassItemTypeSet(items) = ClassFieldTypeSet(items) ∪ ClassMethodRecvTypes(items) ∪ ClassMethodParamTypes(items) ∪ ClassMethodRetTypes(items)

```text
TypePos_Static(P, m) = { t | ∃ attrs_opt, vis, mut, bind, span, doc. StaticDecl(attrs_opt, vis, mut, bind, span, doc) ∈ ASTModule(P, m).items ∧ bind.type_opt = t ∧ t ≠ ⊥ }

```text
TypePos_Proc(P, m) = { t | ∃ attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, params, return_type_opt, contract_opt, body, span, doc. ProcedureDecl(attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, params, return_type_opt, contract_opt, body, span, doc) ∈ ASTModule(P, m).items ∧ t ∈ (ParamTypeSet(params) ∪ TypeOptSet(return_type_opt)) }

```text
TypePos_Record(P, m) = { t | ∃ attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, impls, members, invariant_opt, span, doc. RecordDecl(attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, impls, members, invariant_opt, span, doc) ∈ ASTModule(P, m).items ∧ t ∈ (ClassPathTypeSet(impls) ∪ RecordMemberTypeSet(members)) }

```text
TypePos_Enum(P, m) = { t | ∃ attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, impls, variants, invariant_opt, span, doc. EnumDecl(attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, impls, variants, invariant_opt, span, doc) ∈ ASTModule(P, m).items ∧ t ∈ (ClassPathTypeSet(impls) ∪ EnumVariantTypeSet(variants)) }

```text
TypePos_Modal(P, m) = { t | ∃ attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, impls, states, invariant_opt, span, doc. ModalDecl(attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, impls, states, invariant_opt, span, doc) ∈ ASTModule(P, m).items ∧ t ∈ ClassPathTypeSet(impls) }

```text
TypePos_Class(P, m) = { t | ∃ attrs_opt, vis, modal, name, gen_params_opt, predicate_clause_opt, supers, items, span, doc. ClassDecl(attrs_opt, vis, modal, name, gen_params_opt, predicate_clause_opt, supers, items, span, doc) ∈ ASTModule(P, m).items ∧ t ∈ (ClassPathTypeSet(supers) ∪ ClassItemTypeSet(items)) }

```text
TypePos_Alias(P, m) = { t | ∃ attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, ty, span, doc. TypeAliasDecl(attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, ty, span, doc) ∈ ASTModule(P, m).items ∧ t = ty }
TypePositions(P, m) = TypePos_Static(P, m) ∪ TypePos_Proc(P, m) ∪ TypePos_Record(P, m) ∪ TypePos_Enum(P, m) ∪ TypePos_Modal(P, m) ∪ TypePos_Class(P, m) ∪ TypePos_Alias(P, m)

```text
ArraySizeExprs(P, m) = { e | ∃ elem. TypeArray(elem, e) ∈ TypePositions(P, m) }

```text
EnumDiscriminantExprs(P, m) = { e | ∃ attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, impls, variants, invariant_opt, span, doc. EnumDecl(attrs_opt, vis, name, gen_params_opt, predicate_clause_opt, impls, variants, invariant_opt, span, doc) ∈ ASTModule(P, m).items ∧ ∃ v. v = VariantDecl(_, _, e, _, _) ∈ variants ∧ e ≠ ⊥ }
TypePosExprs(P, m) = ArraySizeExprs(P, m) ∪ EnumDiscriminantExprs(P, m)

```text
TypeDeps(P, m) = { n | ∃ t ∈ TypePositions(P, m). Γ ⊢ TypeRefsTy(t, env_m) ⇓ T ∧ n ∈ T } ∪ { n | ∃ p ∈ PatNodes(P, m). Γ ⊢ TypeRefsPat(p, env_m) ⇓ T ∧ n ∈ T } ∪ { n | ∃ e ∈ (ExprNodes(P, m) ∪ TypePosExprs(P, m)). Γ ⊢ TypeRefsExpr(e, env_m) ⇓ T ∧ n ∈ T }

```text
StaticInitExprs(P, m) = { init | ∃ attrs, vis, mut, bind, span, doc. StaticDecl(attrs, vis, mut, bind, span, doc) ∈ ASTModule(P, m).items ∧ bind.init = init }

```text
RecordFieldInitExprs(P, m) = { init | ∃ attrs, vis, name, gen_params_opt, predicate_clause_opt, impls, members, invariant_opt, span, doc. RecordDecl(attrs, vis, name, gen_params_opt, predicate_clause_opt, impls, members, invariant_opt, span, doc) ∈ ASTModule(P, m).items ∧ ∃ f. f = FieldDecl(_, _, _, _, _, init, _, _) ∈ members ∧ init ≠ ⊥ }

```text
ProcBodies(P, m) = { body | ∃ attrs, vis, name, gen_params_opt, predicate_clause_opt, params, ret_opt, contract_opt, body, span, doc. ProcedureDecl(attrs, vis, name, gen_params_opt, predicate_clause_opt, params, ret_opt, contract_opt, body, span, doc) ∈ ASTModule(P, m).items }

```text
RecordMethodBodies(P, m) = { body | ∃ attrs, vis, name, gen_params_opt, predicate_clause_opt, impls, members, invariant_opt, span, doc. RecordDecl(attrs, vis, name, gen_params_opt, predicate_clause_opt, impls, members, invariant_opt, span, doc) ∈ ASTModule(P, m).items ∧ ∃ md. md = MethodDecl(_, _, _, _, _, _, _, _, _, body, _, _) ∈ members }

```text
ClassMethodBodies(P, m) = { body | ∃ attrs, vis, modal, name, gen_params_opt, predicate_clause_opt, supers, items, span, doc. ClassDecl(attrs, vis, modal, name, gen_params_opt, predicate_clause_opt, supers, items, span, doc) ∈ ASTModule(P, m).items ∧ ∃ md. md = ClassMethodDecl(_, _, _, _, _, _, _, _, body, _, _) ∈ items ∧ body ≠ ⊥ }

```text
ValueDepsEager(P, m) = { n | ∃ e ∈ StaticInitExprs(P, m). Γ ⊢ ValueRefs(e, env_m) ⇓ V ∧ n ∈ V }

```text
ValueDepsLazy(P, m) = { n | ∃ e ∈ RecordFieldInitExprs(P, m) ∪ ⋃_{b ∈ (ProcBodies(P, m) ∪ RecordMethodBodies(P, m) ∪ ClassMethodBodies(P, m))} ExprNodesOf(b). Γ ⊢ ValueRefs(e, env_m) ⇓ V ∧ n ∈ V }

V = AllModules

```text
E_type = {(m, n) | n ∈ TypeDeps(P, m)}

```text
E_val^{eager} = {(m, n) | n ∈ ValueDepsEager(P, m)}

```text
E_val^{lazy} = {(m, n) | n ∈ ValueDepsLazy(P, m)}

```text
G = ⟨V, E_type, E_val^{eager}, E_val^{lazy}⟩

```text
G_e = ⟨V, E_val^{eager}⟩

**(WF-Acyclic-Eager)**

```text
∀ v ∈ V. ¬ Reachable(v, v, E_val^{eager})
───────────────────────────────────────────────────────────

```text
Γ ⊢ G_e : DAG

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
