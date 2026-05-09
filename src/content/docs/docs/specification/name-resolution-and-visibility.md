---
title: "Name Resolution and Visibility"
description: "7. Name Resolution and Visibility of the Ultraviolet language specification."
specSource: "../../Ultraviolet/SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T14:44:07.538Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## 7. Name Resolution and Visibility

### 7.1 Scope Context and Identifiers

IdKeyRef = {"4.2.8"}

```text
ScopeKey(S) ⇔ dom(S) ⊆ {IdKey(x) | x ∈ Identifier}
```

```text
Σ = ⟨Σ.Mods, Σ.Types, Σ.Classes⟩
Σ.Mods ∈ [ASTModule]
Σ.Types : Path ⇀ TypeDecl
Σ.Classes : Path ⇀ ClassDecl
```

```text
Γ = ⟨P, Σ, m, S⟩
Project(Γ) = P
ResCtx(Γ) = ⟨Σ, m⟩
CurrentModule(Γ) = m
Scopes(Γ) = S
```

EntityKind = {Value, Type, Class, ModuleAlias}
EntitySource = {Decl, Using, RegionAlias}

```text
Entity = ⟨kind, origin_opt, target_opt, source⟩
origin_opt ∈ ModulePath ∪ {⊥}
target_opt ∈ Identifier ∪ {⊥}
```

S : IdKey ⇀ Entity

```text
Scopes(Γ) = [S_1, …, S_k, S_proc, S_module, S_universe]    (k ≥ 0)
LocalScopes(Γ) = [S_1, …, S_k]
ProcScope(Γ) = S_proc
ModuleScope(Γ) = S_module
UniverseScope(Γ) = S_universe
```

```text
UniverseBindings = { IdKey(x) ↦ ⟨Type, ⊥, ⊥, Decl⟩ | x ∈ UniverseProtected } ∪ { IdKey(`ultraviolet`) ↦ ⟨ModuleAlias, `ultraviolet`, ⊥, Decl⟩ }
```

S_universe = UniverseBindings

```text
BytePrefix(p, s) ⇔ ∃ r. s = p ++ r
Prefix(s, p) ⇔ BytePrefix(p, s)
```

```text
ReservedGen(x) ⇔ Prefix(IdKey(x), IdKey(`gen_`))
ReservedUltraviolet(x) ⇔ IdEq(x, `ultraviolet`)
ReservedId(x) ⇔ ReservedGen(x) ∨ ReservedUltraviolet(x)
ReservedModulePath(path) ⇔ (|path| ≥ 1 ∧ IdEq(path[0], `ultraviolet`)) ∨ (∃ i. ReservedGen(path[i]))
```

<!-- Source: "The `ultraviolet::...` namespace prefix is reserved for specification-defined features. User programs and vendor extensions MUST NOT use this namespace." -->

PrimTypeNames = {`i8`, `i16`, `i32`, `i64`, `i128`, `u8`, `u16`, `u32`, `u64`, `u128`, `f16`, `f32`, `f64`, `bool`, `char`, `usize`, `isize`}
SpecialTypeNames = {`Self`, `Drop`, `Bitcopy`, `Clone`, `Eq`, `Hash`, `Hasher`, `Iterator`, `Step`, `FfiSafe`, `string`, `bytes`, `Modal`, `Region`, `RegionOptions`, `CancelToken`, `Context`, `System`, `Network`, `ExecutionDomain`, `CpuSet`, `Priority`, `Reactor`}
AsyncTypeNames = {`Async`, `Future`, `Sequence`, `Stream`, `Pipe`, `Exchange`, `Tracked`}

`Drop`, `Bitcopy`, `Clone`, and `FfiSafe` are reserved predicate names and are included in `SpecialTypeNames`. Reuse of these names at any scope is an error via `(Intro-Outer-Err)` (§7.2), since `UniverseBindings` is the outermost scope and contains these names.

```text
PrimTypeKeys = {IdKey(x) | x ∈ PrimTypeNames}
SpecialTypeKeys = {IdKey(x) | x ∈ SpecialTypeNames}
AsyncTypeKeys = {IdKey(x) | x ∈ AsyncTypeNames}
```

```text
KeywordKey(n) ⇔ ∃ s. n = IdKey(s) ∧ Keyword(s)
```

### 7.2 Name Introduction and Module Validation

dom(S) = keys(S)

```text
Scopes(Γ) = [S_cur] ++ Γ_out
InScope(S, x) ⇔ IdKey(x) ∈ dom(S)
InOuter(Γ, x) ⇔ ∃ S ∈ Γ_out. InScope(S, x)
```

**(Intro-Ok)**

```text
¬ InScope(S_cur, x)    ¬ InOuter(Γ, x)    ¬ ReservedId(x)    Scopes(Γ') = [S_cur[IdKey(x) ↦ ent]] ++ Γ_out    Project(Γ') = Project(Γ)    ResCtx(Γ') = ResCtx(Γ)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Intro(x, ent) ⇓ Γ'
```

**(Intro-Dup)**
InScope(S_cur, x)    c = Code(Intro-Dup)
──────────────────────────────────────────────

```text
Γ ⊢ Intro(x, ent) ⇑ c
```

**(Intro-Outer-Err)**

```text
¬ InScope(S_cur, x)    InOuter(Γ, x)    c = Code(Intro-Outer-Err)
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Intro(x, ent) ⇑ c
```

**(Intro-Reserved-Gen-Err)**
ReservedGen(x)    c = Code(Intro-Reserved-Gen-Err)
──────────────────────────────────────────────────────

```text
Γ ⊢ Intro(x, ent) ⇑ c
```

**(Intro-Reserved-Ultraviolet-Err)**
ReservedUltraviolet(x)    c = Code(Intro-Reserved-Ultraviolet-Err)
──────────────────────────────────────────────────────────

```text
Γ ⊢ Intro(x, ent) ⇑ c
```

When multiple `Intro` rules are simultaneously applicable, a conforming implementation MUST apply the first matching clause in the ordered priority list above.

**Rationale (non-normative).** A binding introduced in an outer scope cannot be reused as the name of a new binding in an inner scope. Users who wish to introduce a new binding under an already-taken name must choose a different name, or introduce their new binding in a separate sibling scope where the outer name is not visible. Users who wish to create a compile-time alternate name for an existing binding should use `using source as alias` (§11.2, §18.3).

#### UsingAlias

`UsingAlias(source_name, alias_name)` binds `alias_name` in the current scope to the same `Entity` that `source_name` resolves to. It introduces no new storage and does not copy the bound entity; the alias and the source are interchangeable references to the same compile-time entity.

**(Using-Alias-Ok)**

```text
Γ ⊢ Lookup(source_name) ⇓ ent    ¬ InScope(S_cur, alias_name)    ¬ InOuter(Γ, alias_name)    ¬ ReservedId(alias_name)    Scopes(Γ') = [S_cur[IdKey(alias_name) ↦ ent]] ++ Γ_out    Project(Γ') = Project(Γ)    ResCtx(Γ') = ResCtx(Γ)
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ UsingAlias(source_name, alias_name) ⇓ Γ'
```

**(Using-Alias-Unresolved)**

```text
Γ ⊢ Lookup(source_name) ↑    c = Code(Using-Alias-Unresolved)
```

─────────────────────────────────────────────────────────────────────

```text
Γ ⊢ UsingAlias(source_name, alias_name) ⇑ c
```

**(Using-Alias-Dup)**

```text
Γ ⊢ Lookup(source_name) ⇓ ent    (InScope(S_cur, alias_name) ∨ InOuter(Γ, alias_name))    c = Code(Using-Alias-Dup)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ UsingAlias(source_name, alias_name) ⇑ c
```

**(Using-Alias-Reserved)**
ReservedId(alias_name)    c = Code(Using-Alias-Reserved)
──────────────────────────────────────────────────────────

```text
Γ ⊢ UsingAlias(source_name, alias_name) ⇑ c
```

When multiple `UsingAlias` rules are simultaneously applicable, a conforming implementation MUST apply the first matching clause in the ordered priority list above.

Names(N) = dom(N)

**(Validate-Module-Ok)**

```text
∀ n ∈ Names(N). ¬ KeywordKey(n)
```

────────────────────────────────────────────

```text
Γ ⊢ ValidateModuleNames(N) ⇓ ok
```

**(Validate-Module-Keyword-Err)**

```text
∃ n ∈ Names(N). KeywordKey(n)    c = Code(Validate-Module-Keyword-Err)
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ValidateModuleNames(N) ⇑ c
```

Reuse of a universe-scope name (primitive, special, or async type) at module scope is not a `ValidateModuleNames` concern — it is handled by `(Intro-Outer-Err)` when the module's bindings are introduced, because `UniverseBindings` is always in the outer scope chain at module scope.

### 7.3 Lookup and Qualified Resolution

```text
Scopes(Γ) = [S_1, …, S_n]
i = min{j | IdKey(x) ∈ dom(S_j)}
```

**(Lookup-Unqualified)**
i defined
──────────────────────────────────────────────

```text
Γ ⊢ Lookup(x) ⇓ S_i[IdKey(x)]
```

**(Lookup-Unqualified-None)**
i undefined
──────────────────────────────────────────────

```text
Γ ⊢ Lookup(x) ↑
```

```text
ValueKind(ent) ⇔ ent.kind = Value
TypeKind(ent) ⇔ ent.kind = Type
ClassKind(ent) ⇔ ent.kind = Class
ModuleKind(ent) ⇔ ent.kind = ModuleAlias
RegionAlias(ent) ⇔ ent.source = RegionAlias
```

```text
RegionAliasName(Γ, x) ⇔ Γ ⊢ ResolveValueName(x) ⇓ ent ∧ RegionAlias(ent)
```

**(Resolve-Value-Name)**

```text
Γ ⊢ Lookup(x) ⇓ ent    ValueKind(ent)
```

──────────────────────────────────────────────

```text
Γ ⊢ ResolveValueName(x) ⇓ ent
```

**(Resolve-Type-Name)**

```text
Γ ⊢ Lookup(x) ⇓ ent    TypeKind(ent)
```

──────────────────────────────────────────────

```text
Γ ⊢ ResolveTypeName(x) ⇓ ent
```

**(Resolve-Class-Name)**

```text
Γ ⊢ Lookup(x) ⇓ ent    ClassKind(ent)
```

──────────────────────────────────────────────

```text
Γ ⊢ ResolveClassName(x) ⇓ ent
```

**(Resolve-Module-Name)**

```text
Γ ⊢ Lookup(x) ⇓ ent    ModuleKind(ent)
```

──────────────────────────────────────────────

```text
Γ ⊢ ResolveModuleName(x) ⇓ ent
```

```text
P = Project(Γ)
m = CurrentModule(Γ)
```

VisibleModulePaths(m), VisibleModuleNames(m), AliasMap(m), ImportOk(m, path), ResolveImportPath(path), ResolveUsingPath(path), ImportNames(u), and UsingNames(u) are defined in §11.5.4. This chapter consumes those judgments but does not redefine them.

ModulePaths = VisibleModulePaths(m)
ModuleNames = VisibleModuleNames(m)
Alias = AliasMap(m)

`ResolveModulePath` is defined canonically by §11.5.4 and consumed here by `ResolveQualified`.

**(Resolve-Qualified)**

```text
Γ ⊢ ResolveModulePath(path, Alias, ModuleNames) ⇓ mp    NameMap(P, mp)[IdKey(name)] = ent    Γ ⊢ CanAccess(m, DeclOf(mp, name)) ⇓ ok    K(ent)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveQualified(path, name, K) ⇓ ent
```

```text
K ∈ {ValueKind, TypeKind, ClassKind, ModuleKind}
```

### 7.4 Visibility and Accessibility

```text
DeclOf(mp, name) = it ⇔ ModuleOf(it) = mp ∧ it ≠ ExternBlock(_, _, _, _, _, _) ∧ IdKey(name) ∈ dom(ItemBindings(it, mp))
DeclOf(mp, name) = proc ⇔ ExternBlockOf(proc) = blk ∧ ModuleOf(blk) = mp ∧ ProcName(proc) = name
```

```text
ModuleOf(it) = p ⇔ it ∈ ASTModule(P, p).items
```

ModuleOf(proc) = ModuleOf(ExternBlockOf(proc))

```text
ExternBlockOf(proc) = blk ⇔ ∃ p. blk ∈ ASTModule(P, p).items ∧ proc ∈ blk.items
ProcName(proc) = name ⇔ proc = ExternProcDecl(_, _, name, _, _, _, _, _, _, _, _)
```

Vis(it) = it.vis

```text
SameAssembly(m_1, m_2) ⇔ AsmOfModule(m_1) = AsmOfModule(m_2)
```

**(Access-Public)**
Vis(it) = `public`
──────────────────────────────────────────────

```text
Γ ⊢ CanAccess(m, it) ⇓ ok
```

**(Access-Internal)**
Vis(it) = `internal`    SameAssembly(ModuleOf(it), m)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ CanAccess(m, it) ⇓ ok
```

**(Access-Private)**
Vis(it) = `private`    ModuleOf(it) = m
──────────────────────────────────────────────────────────────

```text
Γ ⊢ CanAccess(m, it) ⇓ ok
```

**(Access-Internal-Err)**

```text
Vis(it) = `internal`    ¬ SameAssembly(ModuleOf(it), m)    c = Code(Access-Err)
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CanAccess(m, it) ⇑ c
```

**(Access-Err)**

```text
Vis(it) = `private`    ModuleOf(it) ≠ m    c = Code(Access-Err)
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CanAccess(m, it) ⇑ c
```

```text
TopLevelDecl(it) ⇔ it ∈ ASTModule(P, ModuleOf(it)).items
```

**(TopLevelVis-Ok)**
TopLevelDecl(it)
──────────────────────────────────────────────

```text
Γ ⊢ TopLevelVis(it) ⇓ ok
```

### 7.5 Top-Level Name Collection

```text
∀ items'. Permutation(items', items) ∧ Γ ⊢ CollectNames(items, p, ∅) ⇓ N ⇒ Γ ⊢ CollectNames(items', p, ∅) ⇓ N
```

BindKind = {Value, Type, Class, ModuleAlias}
BindSource = {Decl, Using, Import}

```text
NameInfo = ⟨kind, origin, target_opt, source⟩
```

```text
NameMap(P, mp) = N ⇔ ModuleMap(P, mp) = M ∧ Γ ⊢ CollectNames(M) ⇓ N
AliasMap(m) = { n ↦ origin | NameMap(P, m)[n].kind = ModuleAlias }
UsingMap(m) = { n ↦ ⟨k, origin, target_opt⟩ | NameMap(P, m)[n].source = Using ∧ NameMap(P, m)[n].kind = k ∧ k ∈ {Value, Type, Class} }
UsingValueMap(m) = { n ↦ origin | NameMap(P, m)[n].source = Using ∧ NameMap(P, m)[n].kind = Value }
UsingTypeMap(m) = { n ↦ origin | NameMap(P, m)[n].source = Using ∧ NameMap(P, m)[n].kind ∈ {Type, Class} }
TypeMap(m) = { n ↦ origin | NameMap(P, m)[n].kind = Type }
ClassMap(m) = { n ↦ origin | NameMap(P, m)[n].kind = Class }
```

```text
Γ ⊢ PatNames(IdentifierPattern(x)) ⇓ [x]
Γ ⊢ PatNames(WildcardPattern) ⇓ []
Γ ⊢ PatNames(LiteralPattern(lit)) ⇓ []
```

```text
∀ i, Γ ⊢ PatNames(p_i) ⇓ N_i
```

──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PatNames(TuplePattern([p_1, …, p_n])) ⇓ N_1 ++ ··· ++ N_n
```

```text
Γ ⊢ PatNames(p) ⇓ N
```

──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PatNames(⟨name, pattern_opt = p, span⟩) ⇓ N
```

```text
Γ ⊢ PatNames(⟨name, pattern_opt = ⊥, span⟩) ⇓ [name]
```

```text
∀ i, Γ ⊢ PatNames(f_i) ⇓ N_i
```

──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PatNames(RecordPattern(_, [f_1, …, f_n])) ⇓ N_1 ++ ··· ++ N_n
```

```text
Γ ⊢ PatNames(EnumPattern(_, _, ⊥)) ⇓ []
```

```text
∀ i, Γ ⊢ PatNames(p_i) ⇓ N_i
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PatNames(EnumPattern(_, _, TuplePayloadPattern([p_1, …, p_n]))) ⇓ N_1 ++ ··· ++ N_n
```

```text
∀ i, Γ ⊢ PatNames(f_i) ⇓ N_i
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PatNames(EnumPattern(_, _, RecordPayloadPattern([f_1, …, f_n]))) ⇓ N_1 ++ ··· ++ N_n
```

```text
Γ ⊢ PatNames(p_l) ⇓ N_l    Γ ⊢ PatNames(p_h) ⇓ N_h
```

──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PatNames(RangePattern(_, p_l, p_h)) ⇓ N_l ++ N_h
```

```text
AllModuleNames = { StringOfPath(p) | p ∈ AllModulePaths(P) }
VisibleModuleNames(m) = { StringOfPath(p) | p ∈ VisibleModulePaths(m) }
Last([c_1, …, c_n]) = c_n    if n ≥ 1
IsModulePath(path) ⇔ StringOfPath(path) ∈ AllModuleNames
SplitLast(path) = (mp, name) ⇔ path = mp ++ [name] ∧ |path| ≥ 2
ModuleByPath(P, p) = m ⇔ ASTModule(P, p) = m
```

```text
ItemNames(mp) = { n | NameMap(P, mp)[n].kind ∈ {Value, Type, Class} }
```

```text
UsingSpecName(⟨name, alias_opt⟩) =
  alias_opt    if alias_opt ≠ ⊥
```

  name         otherwise

UsingSpecNames([s_1, …, s_n]) = [UsingSpecName(s_1), …, UsingSpecName(s_n)]

```text
Γ ⊢ DeclNames([], p) ⇓ ∅
```

**(DeclNames-Using)**

```text
Γ ⊢ DeclNames(rest, p) ⇓ D
```

────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ DeclNames(⟨UsingDecl, _, _, _, _⟩ :: rest, p) ⇓ D
```

**(DeclNames-Item)**

```text
it ≠ ⟨UsingDecl, _, _, _, _⟩    Γ ⊢ ItemBindings(it, p) ⇓ B    Γ ⊢ DeclNames(rest, p) ⇓ D
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ DeclNames(it :: rest, p) ⇓ Names(B) ∪ D
```

DeclNames(m) = DeclNames(m.items, m.path)

`ResolveImportPath`, `ResolveUsingPath`, `ImportNames`, `UsingNames`, and `ImportOk` remain the canonical judgments of §11.5.4.

**(Bind-Procedure)**
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ItemBindings(⟨ProcedureDecl, _, name, _, _, _, _, _⟩, p) ⇓ [(name, ⟨Value, p, ⊥, Decl⟩)]
```

**(Bind-ExternBlock)**

```text
B = [(name_i, ⟨Value, p, ⊥, Decl⟩) | ExternProcDecl(_, _, name_i, _, _, _, _, _, _, _, _) ∈ items]
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ItemBindings(⟨ExternBlock, _, _, _, items, _, _⟩, p) ⇓ B
```

**(Bind-Record)**
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ItemBindings(⟨RecordDecl, _, name, _, _, _, _⟩, p) ⇓ [(name, ⟨Type, p, ⊥, Decl⟩)]
```

**(Bind-Enum)**
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ItemBindings(⟨EnumDecl, _, name, _, _, _, _⟩, p) ⇓ [(name, ⟨Type, p, ⊥, Decl⟩)]
```

**(Bind-Class)**
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ItemBindings(⟨ClassDecl, _, name, _, _, _, _⟩, p) ⇓ [(name, ⟨Class, p, ⊥, Decl⟩)]
```

**(Bind-TypeAlias)**
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ItemBindings(⟨TypeAliasDecl, _, name, _, _, _⟩, p) ⇓ [(name, ⟨Type, p, ⊥, Decl⟩)]
```

**(Bind-Static)**

```text
Γ ⊢ PatNames(pat) ⇓ N
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ItemBindings(⟨StaticDecl, _, _, ⟨pat, _, _, _, _⟩, _, _⟩, p) ⇓ [(n, ⟨Value, p, ⊥, Decl⟩) | n ∈ N]
```

**(Bind-Import)**

```text
Γ ⊢ ImportNames(u) ⇓ B
```

──────────────────────────────────────────────

```text
Γ ⊢ ItemBindings(u, p) ⇓ B
```

**(Bind-Import-Err)**

```text
Γ ⊢ ImportNames(u) ⇑ c
```

──────────────────────────────────────────────

```text
Γ ⊢ ItemBindings(u, p) ⇑ c
```

**(Bind-Using)**

```text
Γ ⊢ UsingNames(u) ⇓ B
```

──────────────────────────────────────────────

```text
Γ ⊢ ItemBindings(u, p) ⇓ B
```

**(Bind-Using-Err)**

```text
Γ ⊢ UsingNames(u) ⇑ c
```

──────────────────────────────────────────────

```text
Γ ⊢ ItemBindings(u, p) ⇑ c
```

**(Bind-ErrorItem)**
──────────────────────────────────────────────────────────────

```text
Γ ⊢ ItemBindings(ErrorItem(_), p) ⇓ []
```

**(Collect-Ok)**

```text
Γ ⊢ CollectNames(items, p, ∅) ⇓ N
```

──────────────────────────────────────────────

```text
Γ ⊢ CollectNames(M) ⇓ N
```

**(Collect-Scan)**

```text
Γ ⊢ ItemBindings(it, p) ⇓ B    DisjointNames(B, N)    NoDup(B)    Γ ⊢ CollectNames(rest, p, N ∪ B) ⇓ N'
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CollectNames(it :: rest, p, N) ⇓ N'
```

**(Collect-Using-Import-Dup)**

```text
Γ ⊢ ItemBindings(it, p) ⇓ B    (¬ DisjointNames(B, N) ∨ ¬ NoDup(B))    UsingImportConflict(B, N)    c = Code(Import-Using-Name-Conflict)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CollectNames(it :: rest, p, N) ⇑ c
```

**(Collect-Dup)**

```text
Γ ⊢ ItemBindings(it, p) ⇓ B    (¬ DisjointNames(B, N) ∨ ¬ NoDup(B))    ¬ UsingImportConflict(B, N)    c = Code(Collect-Dup)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CollectNames(it :: rest, p, N) ⇑ c
```

**(Collect-Err)**

```text
Γ ⊢ ItemBindings(it, p) ⇑ c
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ CollectNames(it :: rest, p, N) ⇑ c
```

```text
Names(B) = { n | (n, _) ∈ B }
NoDup(B) ⇔ Distinct(Names(B))
DisjointNames(B, N) ⇔ Names(B) ∩ dom(N) = ∅
N ∪ B = { (n, v) | (n, v) ∈ N ∨ (n, v) ∈ B }
NameInfoOf(B, n) = info ⇔ (n, info) ∈ B
NameSource(B, n) = src ⇔ NameInfoOf(B, n) = info ∧ info.source = src
NameSource(N, n) = src ⇔ n ∈ dom(N) ∧ N[n].source = src
UsingImportConflict(B, N) ⇔ ∃ n. n ∈ Names(B) ∩ dom(N) ∧ (NameSource(B, n) ∈ {Using, Import} ∨ NameSource(N, n) ∈ {Using, Import})
```

NamesState = {NamesStart(M), NamesScan(items, p, N), NamesDone(N), Error(code)}

**(Names-Start)**
────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨NamesStart(M)⟩ → ⟨NamesScan(M.items, M.path, ∅)⟩
```

**(Names-Step)**

```text
Γ ⊢ ItemBindings(it, p) ⇓ B    DisjointNames(B, N)    NoDup(B)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨NamesScan(it :: rest, p, N)⟩ → ⟨NamesScan(rest, p, N ∪ B)⟩
```

**(Names-Step-Using-Import-Dup)**

```text
Γ ⊢ ItemBindings(it, p) ⇓ B    (¬ DisjointNames(B, N) ∨ ¬ NoDup(B))    UsingImportConflict(B, N)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨NamesScan(it :: rest, p, N)⟩ → ⟨Error(Code(Import-Using-Name-Conflict))⟩
```

**(Names-Step-Dup)**

```text
Γ ⊢ ItemBindings(it, p) ⇓ B    (¬ DisjointNames(B, N) ∨ ¬ NoDup(B))    ¬ UsingImportConflict(B, N)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨NamesScan(it :: rest, p, N)⟩ → ⟨Error(Code(Names-Step-Dup))⟩
```

**(Names-Step-Err)**

```text
Γ ⊢ ItemBindings(it, p) ⇑ c
```

────────────────────────────────────────────────────────────────

```text
⟨NamesScan(it :: rest, p, N)⟩ → ⟨Error(c)⟩
```

**(Names-Done)**
──────────────────────────────────────────────────────────────

```text
⟨NamesScan([], p, N)⟩ → ⟨NamesDone(N)⟩
```

### 7.6 Qualified Disambiguation

ResolveQualifiedForm : Expr ⇀ Expr
ResolveArgs : [Arg] ⇀ [Arg]
ResolveFieldInits : [FieldInit] ⇀ [FieldInit]
ResolveRecordPath : Path × Identifier ⇀ Path
ResolveEnumUnit : Path × Identifier ⇀ Path
ResolveEnumTuple : Path × Identifier ⇀ Path
ResolveEnumRecord : Path × Identifier ⇀ Path
ResolvePathJudg = {ResolveRecordPath, ResolveEnumUnit, ResolveEnumTuple, ResolveEnumRecord}

**(ResolveArgs-Empty)**
──────────────────────────────────────────────

```text
Γ ⊢ ResolveArgs([]) ⇓ []
```

**(ResolveArgs-Cons)**

```text
Γ ⊢ ResolveExpr(e) ⇓ e'    Γ ⊢ ResolveArgs(rest) ⇓ rest'
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveArgs([⟨moved, e, span⟩] ++ rest) ⇓ [⟨moved, e', span⟩] ++ rest'
```

**(ResolveFieldInits-Empty)**
──────────────────────────────────────────────

```text
Γ ⊢ ResolveFieldInits([]) ⇓ []
```

**(ResolveFieldInits-Cons)**

```text
Γ ⊢ ResolveExpr(e) ⇓ e'    Γ ⊢ ResolveFieldInits(rest) ⇓ rest'
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveFieldInits([⟨f, e⟩] ++ rest) ⇓ [⟨f, e'⟩] ++ rest'
```

**(Resolve-RecordPath)**

```text
Γ ⊢ ResolveTypePath(path ++ [name]) ⇓ p    RecordDecl(p) = R
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveRecordPath(path, name) ⇓ p
```

**(Resolve-EnumUnit)**

```text
Γ ⊢ ResolveTypePath(path) ⇓ p    EnumDecl(p) = E    VariantPayload(E, name) = ⊥
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveEnumUnit(path, name) ⇓ p
```

**(Resolve-EnumTuple)**

```text
Γ ⊢ ResolveTypePath(path) ⇓ p    EnumDecl(p) = E    VariantPayload(E, name) = TuplePayload(_)
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveEnumTuple(path, name) ⇓ p
```

**(Resolve-EnumRecord)**

```text
Γ ⊢ ResolveTypePath(path) ⇓ p    EnumDecl(p) = E    VariantPayload(E, name) = RecordPayload(_)
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveEnumRecord(path, name) ⇓ p
```

```text
BuiltinValuePath(path, name) ⇔ BuiltinModalStaticSig(path, name) defined
```

**(ResolveQual-Name-Builtin)**
BuiltinValuePath(path, name)
──────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveQualifiedForm(QualifiedName(path, name)) ⇓ Path(path, name)
```

**(ResolveQual-Name-Value)**

```text
Γ ⊢ ResolveQualified(path, name, ValueKind) ⇓ ent    ent.origin_opt = mp    name' = (ent.target_opt if present, else name)    PathOfModule(mp) = path'
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveQualifiedForm(QualifiedName(path, name)) ⇓ Path(path', name')
```

**(ResolveQual-Name-Record)**

```text
Γ ⊢ ResolveRecordPath(path, name) ⇓ p    SplitLast(p) = (mp, name')
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveQualifiedForm(QualifiedName(path, name)) ⇓ Path(mp, name')
```

**(ResolveQual-Name-Enum)**

```text
Γ ⊢ ResolveQualified(path, name, ValueKind) ↑    Γ ⊢ ResolveRecordPath(path, name) ↑    Γ ⊢ ResolveEnumUnit(path, name) ⇓ p
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveQualifiedForm(QualifiedName(path, name)) ⇓ EnumLiteral(FullPath(p, name), ⊥)
```

**(ResolveQual-Name-Err)**

```text
Γ ⊢ ResolveQualified(path, name, ValueKind) ↑    Γ ⊢ ResolveRecordPath(path, name) ↑    Γ ⊢ ResolveEnumUnit(path, name) ↑    c = Code(ResolveExpr-Ident-Err)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveQualifiedForm(QualifiedName(path, name)) ⇑ c
```

### 7.7 Shared Resolution Helpers and Resolution Pass

```text
P = Project(Γ)
m = CurrentModule(Γ)
```

M = ASTModule(P, m)

```text
ResolveInputs = ⟨M, ModulePaths, { NameMap(P, p) | p ∈ ModulePaths }⟩
ResolveOutputs = ⟨M'⟩
```

PathOfModuleRef = {"3.4.1"}

```text
TypeParamBindings(params) = { IdKey(p.name) ↦ ⟨Type, ⊥, ⊥, Decl⟩ | p ∈ params }
TypeParamBindings(⊥) = {}
```

```text
Γ ⊢ ResolveGenericParamsOpt(⊥) ⇓ ⊥
Γ ⊢ ResolvePredicateClauseOpt(⊥) ⇓ ⊥
Γ ⊢ ResolveContractClauseOpt(⊥) ⇓ ⊥
Γ ⊢ ResolveInvariantOpt(⊥) ⇓ ⊥
Γ ⊢ ResolveTypeOpt(⊥) ⇓ ⊥
Γ ⊢ ResolveExprOpt(⊥) ⇓ ⊥
ResolveExprOpt(⊥) = ⊥
ResolveExprOpt(e) = e' ⇔ Γ ⊢ ResolveExpr(e) ⇓ e'
```

**(ResolveGenericParamsOpt-Yes)**

```text
Γ ⊢ ResolveTypeParamList(params) ⇓ params'
```

──────────────────────────────────────────────

```text
Γ ⊢ ResolveGenericParamsOpt(params) ⇓ params'
```

**(ResolveTypeParam)**

```text
Γ ⊢ ResolveClassPathList(bounds) ⇓ bounds'    Γ ⊢ ResolveTypeOpt(default_opt) ⇓ default_opt'
```

──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveTypeParam(⟨name, bounds, default_opt, variance⟩) ⇓ ⟨name, bounds', default_opt', variance⟩
```

```text
Γ ⊢ ResolveTypeParamList([]) ⇓ []
```

**(ResolveTypeParamList-Cons)**

```text
Γ ⊢ ResolveTypeParam(p) ⇓ p'    Γ ⊢ ResolveTypeParamList(ps) ⇓ ps'
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveTypeParamList(p :: ps) ⇓ p' :: ps'
```

**(ResolvePredicateClauseOpt-Yes)**

```text
Γ ⊢ ResolvePredicateReqList(preds) ⇓ preds'
```

──────────────────────────────────────────────

```text
Γ ⊢ ResolvePredicateClauseOpt(preds) ⇓ preds'
```

```text
Γ ⊢ ResolvePredicateReqList([]) ⇓ []
```

**(ResolvePredicateReq-Predicate)**

```text
Γ ⊢ ResolveType(ty) ⇓ ty'
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolvePredicateReq(PredicateReq(pred, ty)) ⇓ PredicateReq(pred, ty')
```

**(ResolvePredicateReqList-Cons)**

```text
Γ ⊢ ResolvePredicateReq(p) ⇓ p'    Γ ⊢ ResolvePredicateReqList(ps) ⇓ ps'
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolvePredicateReqList(p :: ps) ⇓ p' :: ps'
```

**(ResolveContractClauseOpt-Yes)**

```text
Γ ⊢ ResolveExprOpt(pre) ⇓ pre'    Γ ⊢ ResolveExprOpt(post) ⇓ post'
```

────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveContractClauseOpt(ContractClause(pre, post)) ⇓ ContractClause(pre', post')
```

**(ResolveInvariantOpt-Yes)**

```text
Γ ⊢ ResolveExpr(inv) ⇓ inv'
```

──────────────────────────────────────────────

```text
Γ ⊢ ResolveInvariantOpt(inv) ⇓ inv'
```

**(ResolveTypePath-Ident)**
|path| = 1    Γ ⊢ ResolveTypeName(path[0]) ⇓ ent    ent.origin_opt = p    name = (ent.target_opt if present, else path[0])
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveTypePath(path) ⇓ FullPath(PathOfModule(p), name)
```

**(ResolveTypePath-Ident-Local)**
|path| = 1    Γ ⊢ ResolveTypeName(path[0]) ⇓ ent    ent.origin_opt = ⊥    name = (ent.target_opt if present, else path[0])
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveTypePath(path) ⇓ [name]
```

**(ResolveTypePath-Qual)**
|path| ≥ 2    path = p ++ [name]    Γ ⊢ ResolveQualified(p, name, TypeKind) ⇓ ent    ent.origin_opt = mp    name' = (ent.target_opt if present, else name)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveTypePath(path) ⇓ FullPath(PathOfModule(mp), name')
```

```text
LocalTypePath(path) ⇔ |path| = 1 ∧ Γ ⊢ ResolveTypeName(path[0]) ⇓ ent ∧ ent.origin_opt = ⊥
```

**(ResolveClassPath-Ident)**
|path| = 1    Γ ⊢ ResolveClassName(path[0]) ⇓ ent    ent.origin_opt = p    name = (ent.target_opt if present, else path[0])
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveClassPath(path) ⇓ FullPath(PathOfModule(p), name)
```

**(ResolveClassPath-Qual)**
|path| ≥ 2    path = p ++ [name]    Γ ⊢ ResolveQualified(p, name, ClassKind) ⇓ ent    ent.origin_opt = mp    name' = (ent.target_opt if present, else name)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveClassPath(path) ⇓ FullPath(PathOfModule(mp), name')
```

**(ResolveType-Path)**

```text
Γ ⊢ ResolveTypePath(path) ⇓ path'
```

──────────────────────────────────────────────

```text
Γ ⊢ ResolveType(TypePath(path)) ⇓ TypePath(path')
```

**(ResolveType-Dynamic)**

```text
Γ ⊢ ResolveClassPath(path) ⇓ path'
```

──────────────────────────────────────────────

```text
Γ ⊢ ResolveType(TypeDynamic(path)) ⇓ TypeDynamic(path')
```

**(ResolveType-Apply)**

```text
Γ ⊢ ResolveTypePath(path) ⇓ path'    Γ ⊢ ResolveTypeList(args) ⇓ args'
```

────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveType(TypeApply(path, args)) ⇓ TypeApply(path', args')
```

**(ResolveType-ModalState)**

```text
Γ ⊢ ResolveModalRef(modal_ref) ⇓ modal_ref'
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveType(TypeModalState(modal_ref, state)) ⇓ TypeModalState(modal_ref', state)
```

```text
ResolveModalRef(modal_ref) ⇓ modal_ref' ⇔
 (modal_ref = TypePath(path) ∧ Γ ⊢ ResolveTypePath(path) ⇓ path' ∧ modal_ref' = TypePath(path')) ∨
 (modal_ref = TypeApply(path, args) ∧ Γ ⊢ ResolveTypePath(path) ⇓ path' ∧ Γ ⊢ ResolveTypeList(args) ⇓ args' ∧ modal_ref' = TypeApply(path', args'))
```

**(ResolveType-Hom)**

```text
∀ i, Γ ⊢ ResolveType(t_i) ⇓ t_i'
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveType(C(t_1, …, t_n)) ⇓ C(t_1', …, t_n')
```

```text
Γ ⊢ ResolveTypeList([]) ⇓ []
```

**(ResolveTypeList-Cons)**

```text
Γ ⊢ ResolveType(t) ⇓ t'    Γ ⊢ ResolveTypeList(ts) ⇓ ts'
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveTypeList(t :: ts) ⇓ t' :: ts'
```

**(ResolveParam)**

```text
Γ ⊢ ResolveType(p.type) ⇓ ty'
```

──────────────────────────────────────────────

```text
Γ ⊢ ResolveParam(p) ⇓ p[type = ty']
```

```text
Γ ⊢ ResolveParams([]) ⇓ []
```

**(ResolveParams-Cons)**

```text
Γ ⊢ ResolveParam(p) ⇓ p'    Γ ⊢ ResolveParams(ps) ⇓ ps'
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveParams(p :: ps) ⇓ p' :: ps'
```

ResolvePattern : Pattern ⇀ Pattern

```text
Γ ⊢ ResolvePattern(WildcardPattern) ⇓ WildcardPattern
Γ ⊢ ResolvePattern(IdentifierPattern(x)) ⇓ IdentifierPattern(x)
Γ ⊢ ResolvePattern(LiteralPattern(lit)) ⇓ LiteralPattern(lit)
```

**(ResolvePat-Tuple)**

```text
Γ ⊢ ResolvePatternList(ps) ⇓ ps'
```

──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolvePattern(TuplePattern(ps)) ⇓ TuplePattern(ps')
```

**(ResolvePat-Record)**

```text
Γ ⊢ ResolveTypePath(tp) ⇓ tp'    Γ ⊢ ResolveFieldPatternList(fs) ⇓ fs'
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolvePattern(RecordPattern(tp, fs)) ⇓ RecordPattern(tp', fs')
```

**(ResolvePat-Enum)**

```text
Γ ⊢ ResolveTypePath(tp) ⇓ tp'    Γ ⊢ ResolveEnumPayloadPattern(payload_opt) ⇓ payload_opt'
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolvePattern(EnumPattern(tp, name, payload_opt)) ⇓ EnumPattern(tp', name, payload_opt')
```

**(ResolvePat-Modal)**

```text
Γ ⊢ ResolveFieldPatternListOpt(fields_opt) ⇓ fields_opt'
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolvePattern(ModalPattern(state, fields_opt)) ⇓ ModalPattern(state, fields_opt')
```

**(ResolvePat-Range)**

```text
Γ ⊢ ResolvePattern(p_l) ⇓ p_l'    Γ ⊢ ResolvePattern(p_h) ⇓ p_h'
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolvePattern(RangePattern(kind, p_l, p_h)) ⇓ RangePattern(kind, p_l', p_h')
```

```text
Γ ⊢ ResolvePatternList([]) ⇓ []
Γ ⊢ ResolveFieldPatternList([]) ⇓ []
```

**(ResolvePatternList-Cons)**

```text
Γ ⊢ ResolvePattern(p) ⇓ p'    Γ ⊢ ResolvePatternList(ps) ⇓ ps'
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolvePatternList(p :: ps) ⇓ p' :: ps'
```

**(ResolveFieldPattern-Implicit)**
──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveFieldPattern(⟨name, ⊥, span⟩) ⇓ ⟨name, ⊥, span⟩
```

**(ResolveFieldPattern-Explicit)**

```text
Γ ⊢ ResolvePattern(p) ⇓ p'
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveFieldPattern(⟨name, p, span⟩) ⇓ ⟨name, p', span⟩
```

**(ResolveFieldPatternList-Cons)**

```text
Γ ⊢ ResolveFieldPattern(f) ⇓ f'    Γ ⊢ ResolveFieldPatternList(fs) ⇓ fs'
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveFieldPatternList(f :: fs) ⇓ f' :: fs'
```

```text
Γ ⊢ ResolveEnumPayloadPattern(⊥) ⇓ ⊥
```

**(ResolveEnumPayloadPattern-Tuple)**

```text
Γ ⊢ ResolvePatternList(ps) ⇓ ps'
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveEnumPayloadPattern(TuplePayloadPattern(ps)) ⇓ TuplePayloadPattern(ps')
```

**(ResolveEnumPayloadPattern-Record)**

```text
Γ ⊢ ResolveFieldPatternList(fs) ⇓ fs'
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveEnumPayloadPattern(RecordPayloadPattern(fs)) ⇓ RecordPayloadPattern(fs')
```

```text
Γ ⊢ ResolveFieldPatternListOpt(⊥) ⇓ ⊥
```

**(ResolveFieldPatternListOpt-Some)**

```text
Γ ⊢ ResolveFieldPatternList(fs) ⇓ fs'
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveFieldPatternListOpt(fs) ⇓ fs'
```

**(ResolveExpr-Ident)**

```text
Γ ⊢ ResolveValueName(x) ⇓ ent
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveExpr(Identifier(x)) ⇓ Identifier(x)
```

**(ResolveExpr-Ident-Err)**

```text
Γ ⊢ ResolveValueName(x) ⇑    c = Code(ResolveExpr-Ident-Err)
```

──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveExpr(Identifier(x)) ⇑ c
```

**(ResolveExpr-Qualified)**

```text
Γ ⊢ ResolveQualifiedForm(e) ⇓ e'
```

──────────────────────────────────────────────

```text
Γ ⊢ ResolveExpr(e) ⇓ e'
```

ResolveArgsRef = {"5.1.6"}
ResolveFieldInitsRef = {"5.1.6"}

```text
Γ ⊢ ResolveExprList([]) ⇓ []
```

**(ResolveExprList-Cons)**

```text
Γ ⊢ ResolveExpr(e) ⇓ e'    Γ ⊢ ResolveExprList(es) ⇓ es'
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveExprList(e :: es) ⇓ e' :: es'
```

ResolveExprListJudg = {ResolveExprList}

ResolveEnumPayloadJudg = {ResolveEnumPayload}

**(ResolveEnumPayload-None)**
────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveEnumPayload(⊥) ⇓ ⊥
```

**(ResolveEnumPayload-Tuple)**

```text
Γ ⊢ ResolveExprList(es) ⇓ es'
```

────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveEnumPayload(Paren(es)) ⇓ Paren(es')
```

**(ResolveEnumPayload-Record)**

```text
Γ ⊢ ResolveFieldInits(fields) ⇓ fields'
```

────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveEnumPayload(Brace(fields)) ⇓ Brace(fields')
```

ResolveKeyPathJudg = {ResolveKeyPathExpr, ResolveKeyPathList, ResolveKeySeg, ResolveKeySegs}

**(ResolveKeySeg-Field)**
seg = Field(marked, name)
──────────────────────────────────────────────

```text
Γ ⊢ ResolveKeySeg(seg) ⇓ seg
```

**(ResolveKeySeg-Index)**

```text
seg = Index(marked, e)    Γ ⊢ ResolveExpr(e) ⇓ e'
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveKeySeg(seg) ⇓ Index(marked, e')
```

**(ResolveKeySegs-Empty)**
──────────────────────────────────────────────

```text
Γ ⊢ ResolveKeySegs([]) ⇓ []
```

**(ResolveKeySegs-Cons)**

```text
Γ ⊢ ResolveKeySeg(s) ⇓ s'    Γ ⊢ ResolveKeySegs(ss) ⇓ ss'
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveKeySegs(s :: ss) ⇓ s' :: ss'
```

**(ResolveKeyPathExpr)**

```text
Γ ⊢ ResolveValueName(root) ⇓ ent    Γ ⊢ ResolveKeySegs(segs) ⇓ segs'
```

────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveKeyPathExpr(⟨root, segs⟩) ⇓ ⟨root, segs'⟩
```

**(ResolveKeyPathExpr-Err)**

```text
Γ ⊢ ResolveValueName(root) ⇑    c = Code(ResolveExpr-Ident-Err)
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveKeyPathExpr(⟨root, segs⟩) ⇑ c
```

**(ResolveKeyPathList-Empty)**
──────────────────────────────────────────────

```text
Γ ⊢ ResolveKeyPathList([]) ⇓ []
```

**(ResolveKeyPathList-Cons)**

```text
Γ ⊢ ResolveKeyPathExpr(kp) ⇓ kp'    Γ ⊢ ResolveKeyPathList(kps) ⇓ kps'
```

────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveKeyPathList(kp :: kps) ⇓ kp' :: kps'
```

ResolveParallelOptJudg = {ResolveParallelOpt, ResolveParallelOpts}

**(ResolveParallelOpt-Cancel)**

```text
Γ ⊢ ResolveExpr(e) ⇓ e'
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveParallelOpt(Cancel(e)) ⇓ Cancel(e')
```

**(ResolveParallelOpt-Name)**
──────────────────────────────────────────────

```text
Γ ⊢ ResolveParallelOpt(Name(s)) ⇓ Name(s)
```

**(ResolveParallelOpts-Empty)**
──────────────────────────────────────────────

```text
Γ ⊢ ResolveParallelOpts([]) ⇓ []
```

**(ResolveParallelOpts-Cons)**

```text
Γ ⊢ ResolveParallelOpt(o) ⇓ o'    Γ ⊢ ResolveParallelOpts(os) ⇓ os'
```

────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveParallelOpts(o :: os) ⇓ o' :: os'
```

ResolveSpawnOptJudg = {ResolveSpawnOpt, ResolveSpawnOpts}

**(ResolveSpawnOpt-Name)**
──────────────────────────────────────────────

```text
Γ ⊢ ResolveSpawnOpt(Name(s)) ⇓ Name(s)
```

**(ResolveSpawnOpt-Affinity)**

```text
Γ ⊢ ResolveExpr(e) ⇓ e'
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveSpawnOpt(Affinity(e)) ⇓ Affinity(e')
```

**(ResolveSpawnOpt-Priority)**

```text
Γ ⊢ ResolveExpr(e) ⇓ e'
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveSpawnOpt(Priority(e)) ⇓ Priority(e')
```

**(ResolveSpawnOpts-Empty)**
──────────────────────────────────────────────

```text
Γ ⊢ ResolveSpawnOpts([]) ⇓ []
```

**(ResolveSpawnOpts-Cons)**

```text
Γ ⊢ ResolveSpawnOpt(o) ⇓ o'    Γ ⊢ ResolveSpawnOpts(os) ⇓ os'
```

────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveSpawnOpts(o :: os) ⇓ o' :: os'
```

ResolveDispatchOptJudg = {ResolveDispatchOpt, ResolveDispatchOpts}

**(ResolveDispatchOpt-Reduce)**
──────────────────────────────────────────────

```text
Γ ⊢ ResolveDispatchOpt(Reduce(op)) ⇓ Reduce(op)
```

**(ResolveDispatchOpt-Ordered)**
──────────────────────────────────────────────

```text
Γ ⊢ ResolveDispatchOpt(Ordered) ⇓ Ordered
```

**(ResolveDispatchOpt-Chunk)**

```text
Γ ⊢ ResolveExpr(e) ⇓ e'
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveDispatchOpt(Chunk(e)) ⇓ Chunk(e')
```

**(ResolveDispatchOpts-Empty)**
──────────────────────────────────────────────

```text
Γ ⊢ ResolveDispatchOpts([]) ⇓ []
```

**(ResolveDispatchOpts-Cons)**

```text
Γ ⊢ ResolveDispatchOpt(o) ⇓ o'    Γ ⊢ ResolveDispatchOpts(os) ⇓ os'
```

────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveDispatchOpts(o :: os) ⇓ o' :: os'
```

ResolveRaceJudg = {ResolveRaceArm, ResolveRaceArms, ResolveRaceHandler}

**(ResolveRaceHandler-Return)**

```text
Γ ⊢ ResolveExpr(e) ⇓ e'
```

──────────────────────────────────────────────

```text
Γ ⊢ ResolveRaceHandler(RaceReturn(e)) ⇓ RaceReturn(e')
```

**(ResolveRaceHandler-Yield)**

```text
Γ ⊢ ResolveExpr(e) ⇓ e'
```

──────────────────────────────────────────────

```text
Γ ⊢ ResolveRaceHandler(RaceYield(e)) ⇓ RaceYield(e')
```

**(ResolveRaceArm)**

```text
Γ ⊢ ResolveExpr(e) ⇓ e'    Γ_0 = PushScope(Γ)    Γ_0 ⊢ ResolvePattern(pat) ⇓ pat'    Γ_0 ⊢ BindPattern(pat') ⇓ Γ_1    Γ_1 ⊢ ResolveRaceHandler(handler) ⇓ handler'
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveRaceArm(⟨e, pat, handler⟩) ⇓ ⟨e', pat', handler'⟩
```

**(ResolveRaceArms-Empty)**
──────────────────────────────────────────────

```text
Γ ⊢ ResolveRaceArms([]) ⇓ []
```

**(ResolveRaceArms-Cons)**

```text
Γ ⊢ ResolveRaceArm(a) ⇓ a'    Γ ⊢ ResolveRaceArms(as) ⇓ as'
```

────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveRaceArms(a :: as) ⇓ a' :: as'
```

ResolveAllExprListJudg = {ResolveAllExprList}

**(ResolveAllExprList-Empty)**
──────────────────────────────────────────────

```text
Γ ⊢ ResolveAllExprList([]) ⇓ []
```

**(ResolveAllExprList-Cons)**

```text
Γ ⊢ ResolveExpr(e) ⇓ e'    Γ ⊢ ResolveAllExprList(es) ⇓ es'
```

────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveAllExprList(e :: es) ⇓ e' :: es'
```

ResolveCalleeJudg = {ResolveCallee}

**(ResolveCallee-Ident-Value)**

```text
Γ ⊢ ResolveValueName(x) ⇓ ent
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveCallee(Identifier(x), args) ⇓ Identifier(x)
```

**(ResolveCallee-Ident-Record)**

```text
Γ ⊢ ResolveValueName(x) ⇑    args = []    Γ ⊢ ResolveTypeName(x) ⇓ ent    ent.origin_opt = p    name = (ent.target_opt if present, else x)    RecordDecl(FullPath(PathOfModule(p), name)) = R
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveCallee(Identifier(x), args) ⇓ Identifier(x)
```

**(ResolveCallee-Path-Value)**

```text
Γ ⊢ ResolveQualified(path, name, ValueKind) ⇓ ent
```

──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveCallee(Path(path, name), args) ⇓ Path(path, name)
```

**(ResolveCallee-Path-Builtin)**
BuiltinValuePath(path, name)
──────────────────────────────────────────────

```text
Γ ⊢ ResolveCallee(Path(path, name), args) ⇓ Path(path, name)
```

**(ResolveCallee-Path-Record)**

```text
Γ ⊢ ResolveRecordPath(path, name) ⇓ p    args = []
```

────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveCallee(Path(path, name), args) ⇓ Path(path, name)
```

**(ResolveCallee-Other)**

```text
Γ ⊢ ResolveExpr(callee) ⇓ callee'
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveCallee(callee, args) ⇓ callee'
```

**(ResolveExpr-Call)**

```text
Γ ⊢ ResolveArgs(args) ⇓ args'    Γ ⊢ ResolveCallee(callee, args') ⇓ callee'
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveExpr(Call(callee, args)) ⇓ Call(callee', args')
```

**(ResolveExpr-Call-TypeArgs)**

```text
Γ ⊢ ResolveTypeList(type_args) ⇓ type_args'    Γ ⊢ ResolveArgs(args) ⇓ args'    Γ ⊢ ResolveCallee(callee, args') ⇓ callee'
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveExpr(CallTypeArgs(callee, type_args, args)) ⇓ CallTypeArgs(callee', type_args', args')
```

**(ResolveExpr-RecordExpr)**

```text
Γ ⊢ ResolveTypeRef(tr) ⇓ tr'    Γ ⊢ ResolveFieldInits(fields) ⇓ fields'
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveExpr(RecordExpr(tr, fields)) ⇓ RecordExpr(tr', fields')
```

**(ResolveExpr-EnumLiteral)**

```text
Γ ⊢ ResolveEnumPayload(payload_opt) ⇓ payload_opt'
```

────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveExpr(EnumLiteral(path, payload_opt)) ⇓ EnumLiteral(path, payload_opt')
```

ResolveIfCaseJudg = {ResolveIfCase, ResolveIfCases, ResolveElseBlockOpt}

**(ResolveIfCase)**

```text
Γ_0 = PushScope(Γ)    Γ_0 ⊢ ResolvePattern(p) ⇓ p'    Γ_0 ⊢ BindPattern(p') ⇓ Γ_1    Γ_1 ⊢ ResolveExpr(b) ⇓ b'
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveIfCase(⟨p, b⟩) ⇓ ⟨p', b'⟩
```

**(ResolveIfCases-Empty)**
────────────────────────────────────────────────

```text
Γ ⊢ ResolveIfCases([]) ⇓ []
```

**(ResolveIfCases-Cons)**

```text
Γ ⊢ ResolveIfCase(a) ⇓ a'    Γ ⊢ ResolveIfCases(as) ⇓ as'
```

────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveIfCases(a :: as) ⇓ a' :: as'
```

**(ResolveElseBlockOpt-None)**
──────────────────────────────────────────────

```text
Γ ⊢ ResolveElseBlockOpt(⊥) ⇓ ⊥
```

**(ResolveElseBlockOpt-Some)**

```text
Γ ⊢ ResolveExpr(b) ⇓ b'
```

──────────────────────────────────────────────

```text
Γ ⊢ ResolveElseBlockOpt(b) ⇓ b'
```

**(ResolveExpr-IfIs)**

```text
Γ ⊢ ResolveExpr(scrutinee) ⇓ scrutinee'    Γ ⊢ ResolvePattern(pat) ⇓ pat'    Γ_0 = PushScope(Γ)    Γ_0 ⊢ BindPattern(pat') ⇓ Γ_1    Γ_1 ⊢ ResolveExpr(then_block) ⇓ then_block'    Γ ⊢ ResolveElseBlockOpt(else_opt) ⇓ else_opt'
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveExpr(IfIsExpr(scrutinee, pat, then_block, else_opt)) ⇓ IfIsExpr(scrutinee', pat', then_block', else_opt')
```

**(ResolveExpr-IfCase)**

```text
Γ ⊢ ResolveExpr(scrutinee) ⇓ scrutinee'    Γ ⊢ ResolveIfCases(cases) ⇓ cases'    Γ ⊢ ResolveElseBlockOpt(else_opt) ⇓ else_opt'
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveExpr(IfCaseExpr(scrutinee, cases, else_opt)) ⇓ IfCaseExpr(scrutinee', cases', else_opt')
```

**(ResolveExpr-LoopInfinite)**

```text
Γ ⊢ ResolveInvariantOpt(inv_opt) ⇓ inv_opt'    Γ ⊢ ResolveExpr(body) ⇓ body'
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveExpr(LoopInfinite(inv_opt, body)) ⇓ LoopInfinite(inv_opt', body')
```

**(ResolveExpr-LoopConditional)**

```text
Γ ⊢ ResolveExpr(cond) ⇓ cond'    Γ ⊢ ResolveInvariantOpt(inv_opt) ⇓ inv_opt'    Γ ⊢ ResolveExpr(body) ⇓ body'
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveExpr(LoopConditional(cond, inv_opt, body)) ⇓ LoopConditional(cond', inv_opt', body')
```

**(ResolveExpr-LoopIter)**

```text
Γ ⊢ ResolvePattern(pat) ⇓ pat'    Γ ⊢ ResolveTypeOpt(ty_opt) ⇓ ty_opt'    Γ ⊢ ResolveExpr(iter) ⇓ iter'    Γ ⊢ ResolveInvariantOpt(inv_opt) ⇓ inv_opt'    Γ_0 = PushScope(Γ)    Γ_0 ⊢ BindPattern(pat') ⇓ Γ_1    Γ_1 ⊢ ResolveExpr(body) ⇓ body'
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveExpr(LoopIter(pat, ty_opt, iter, inv_opt, body)) ⇓ LoopIter(pat', ty_opt', iter', inv_opt', body')
```

**(ResolveExpr-Parallel)**

```text
Γ ⊢ ResolveExpr(domain) ⇓ domain'    Γ ⊢ ResolveParallelOpts(opts) ⇓ opts'    Γ ⊢ ResolveExpr(body) ⇓ body'
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveExpr(ParallelExpr(domain, opts, body)) ⇓ ParallelExpr(domain', opts', body')
```

**(ResolveExpr-Spawn)**

```text
Γ ⊢ ResolveSpawnOpts(opts) ⇓ opts'    Γ ⊢ ResolveExpr(body) ⇓ body'
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveExpr(SpawnExpr(opts, body)) ⇓ SpawnExpr(opts', body')
```

**(ResolveExpr-Wait)**

```text
Γ ⊢ ResolveExpr(handle) ⇓ handle'
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveExpr(WaitExpr(handle)) ⇓ WaitExpr(handle')
```

ResolveKeyClauseJudg = {ResolveKeyClauseOpt}

**(ResolveKeyClauseOpt-None)**

```text
key_clause_opt = ⊥
```

──────────────────────────────────────────────

```text
Γ ⊢ ResolveKeyClauseOpt(key_clause_opt) ⇓ ⊥
```

**(ResolveKeyClauseOpt-Yes)**

```text
key_clause_opt = ⟨path, mode⟩    Γ ⊢ ResolveKeyPathExpr(path) ⇓ path'
```

────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveKeyClauseOpt(key_clause_opt) ⇓ ⟨path', mode⟩
```

**(ResolveExpr-Dispatch)**

```text
Γ ⊢ ResolvePattern(pat) ⇓ pat'    Γ ⊢ ResolveExpr(range) ⇓ range'    Γ ⊢ ResolveKeyClauseOpt(key_clause_opt) ⇓ key_clause_opt'    Γ ⊢ ResolveDispatchOpts(opts) ⇓ opts'    Γ_0 = PushScope(Γ)    Γ_0 ⊢ BindPattern(pat') ⇓ Γ_1    Γ_1 ⊢ ResolveExpr(body) ⇓ body'
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveExpr(DispatchExpr(pat, range, key_clause_opt, opts, body)) ⇓ DispatchExpr(pat', range', key_clause_opt', opts', body')
```

**(ResolveExpr-Yield)**

```text
Γ ⊢ ResolveExpr(e) ⇓ e'
```

──────────────────────────────────────────────

```text
Γ ⊢ ResolveExpr(YieldExpr(release_opt, e)) ⇓ YieldExpr(release_opt, e')
```

**(ResolveExpr-YieldFrom)**

```text
Γ ⊢ ResolveExpr(e) ⇓ e'
```

──────────────────────────────────────────────

```text
Γ ⊢ ResolveExpr(YieldFromExpr(release_opt, e)) ⇓ YieldFromExpr(release_opt, e')
```

**(ResolveExpr-Sync)**

```text
Γ ⊢ ResolveExpr(e) ⇓ e'
```

──────────────────────────────────────────────

```text
Γ ⊢ ResolveExpr(SyncExpr(e)) ⇓ SyncExpr(e')
```

**(ResolveExpr-Race)**

```text
Γ ⊢ ResolveRaceArms(arms) ⇓ arms'
```

──────────────────────────────────────────────

```text
Γ ⊢ ResolveExpr(RaceExpr(arms)) ⇓ RaceExpr(arms')
```

**(ResolveExpr-All)**

```text
Γ ⊢ ResolveAllExprList(es) ⇓ es'
```

──────────────────────────────────────────────

```text
Γ ⊢ ResolveExpr(AllExpr(es)) ⇓ AllExpr(es')
```

**(ResolveExpr-Alloc-Explicit-ByAlias)**

```text
Γ ⊢ ResolveValueName(r) ⇓ ent    RegionAlias(ent)    Γ ⊢ ResolveExpr(e) ⇓ e'
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveExpr(Binary("^", Identifier(r), e)) ⇓ AllocExpr(r, e')
```

ResolveExprRules = {ResolveExpr-Ident, ResolveExpr-Qualified, ResolveExpr-Call, ResolveExpr-Call-TypeArgs, ResolveExpr-RecordExpr, ResolveExpr-EnumLiteral, ResolveExpr-IfCase, ResolveExpr-LoopIter, ResolveExpr-Parallel, ResolveExpr-Spawn, ResolveExpr-Wait, ResolveExpr-Dispatch, ResolveExpr-Yield, ResolveExpr-YieldFrom, ResolveExpr-Sync, ResolveExpr-Race, ResolveExpr-All, ResolveExpr-Alloc-Explicit-ByAlias, ResolveExpr-Hom, ResolveExpr-Alloc-Implicit, ResolveExpr-Alloc-Explicit, ResolveExpr-Block}

```text
NoSpecificResolveExpr(e) ⇔ ¬ ∃ r ∈ ResolveExprRules \ {ResolveExpr-Hom}. PremisesHold(r, e)
```

**(ResolveExpr-Hom)**

```text
NoSpecificResolveExpr(C(e_1, …, e_n))    ∀ i, Γ ⊢ ResolveExpr(e_i) ⇓ e_i'
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveExpr(C(e_1, …, e_n)) ⇓ C(e_1', …, e_n')
```

**(ResolveExpr-Alloc-Implicit)**

```text
Γ ⊢ ResolveExpr(e) ⇓ e'
```

────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveExpr(AllocExpr(⊥, e)) ⇓ AllocExpr(⊥, e')
```

**(ResolveExpr-Alloc-Explicit)**

```text
Γ ⊢ ResolveValueName(r) ⇓ ent    Γ ⊢ ResolveExpr(e) ⇓ e'
```

────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveExpr(AllocExpr(r, e)) ⇓ AllocExpr(r, e')
```

ResolveStmtSeqJudg = {ResolveStmtSeq}

**(ResolveStmtSeq-Empty)**
────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveStmtSeq([]) ⇓ (Γ, [])
```

**(ResolveStmtSeq-Cons)**

```text
Γ ⊢ ResolveStmt(s) ⇓ (Γ_1, s')    Γ_1 ⊢ ResolveStmtSeq(ss) ⇓ (Γ_2, ss')
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveStmtSeq(s :: ss) ⇓ (Γ_2, s' :: ss')
```

**(ResolveExpr-Block)**

```text
Γ_0 = PushScope(Γ)    Γ_0 ⊢ ResolveStmtSeq(stmts) ⇓ (Γ_1, stmts')    (tail_opt = ⊥ ⇒ tail_opt' = ⊥)    (tail_opt = e ⇒ Γ_1 ⊢ ResolveExpr(e) ⇓ e' ∧ tail_opt' = e')
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveExpr(BlockExpr(stmts, tail_opt)) ⇓ BlockExpr(stmts', tail_opt')
```

**(Validate-ModulePath-Ok)**

```text
¬ ReservedModulePath(PathOfModule(p))
```

──────────────────────────────────────────────

```text
Γ ⊢ ValidateModulePath(p) ⇓ ok
```

**(Validate-ModulePath-Reserved-Err)**
ReservedModulePath(PathOfModule(p))    c = Code(Validate-ModulePath-Reserved-Err)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ValidateModulePath(p) ⇑ c
```

`ResolveItem` is a feature-owned judgment. Chapters 11 through 22 define the feature-specific `ResolveItem` clauses; this chapter defines the shared driver and helper relations they consume.

**(ResolveModule-Ok)**

```text
Γ ⊢ CollectNames(M) ⇓ N    Γ ⊢ ValidateModulePath(M.path) ⇓ ok    Γ ⊢ ValidateModuleNames(N) ⇓ ok    S_module = N    Γ_N = [S_module, S_universe]    Γ_N ⊢ ResolveItems(M.items) ⇓ items'
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveModule(M) ⇓ ⟨M.path, items', M.module_doc⟩
```

```text
Γ ⊢ ResolveItems([]) ⇓ []
```

**(ResolveItems-Cons)**

```text
Γ ⊢ TopLevelVis(it) ⇓ ok    Γ ⊢ ResolveItem(it) ⇓ it'    Γ ⊢ ResolveItems(rest) ⇓ rest'
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveItems(it :: rest) ⇓ it' :: rest'
```

ResState = {ResStart(M), ResNames(M, N), ResItems(M, N), ResDone(M'), Error(code)}

**(Res-Start)**
──────────────────────────────────────────────

```text
⟨ResStart(M)⟩ → ⟨ResNames(M, _)⟩
```

**(Res-Names)**

```text
Γ ⊢ CollectNames(M) ⇓ N
```

──────────────────────────────────────────────────────────────

```text
⟨ResNames(M, _)⟩ → ⟨ResItems(M, N)⟩
```

**(Res-Items)**

```text
Γ ⊢ ResolveModule(M) ⇓ M'
```

──────────────────────────────────────────────────────────────

```text
⟨ResItems(M, N)⟩ → ⟨ResDone(M')⟩
```

**ResolveModules (Big-Step).**

**(ResolveModules-Ok)**

```text
Γ ⊢ ParseModules(P) ⇓ [M_1, …, M_k]    ∀ i, Γ ⊢ ResolveModule(M_i) ⇓ M_i'
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveModules(P) ⇓ [M_1', …, M_k']
```

**(ResolveModules-Err-Parse)**

```text
Γ ⊢ ParseModules(P) ⇑ c
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveModules(P) ⇑ c
```

**(ResolveModules-Err-Resolve)**

```text
Γ ⊢ ParseModules(P) ⇓ [M_1, …, M_k]    ∃ i. Γ ⊢ ResolveModule(M_i) ⇑ c
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveModules(P) ⇑ c
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
