---
title: "Project and Compilation Model"
description: "3. Project and Compilation Model of the Ultraviolet language specification."
specSource: "../../Ultraviolet/SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T14:44:07.538Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## 3. Project and Compilation Model

### 3.1 Core Project Records

AssemblyKind = {`executable`, `library`, `dependency`}
LinkKind = {`shared`, `static`}

```text
Project = ⟨root, assemblies, assembly, source_root, outputs, modules, toolchain, build⟩
```

Assemblies(P) = P.assemblies
Assembly(P) = P.assembly

```text
AsmNames(P) = [A.name | A ∈ Assemblies(P)]
AsmByName(P, n) = A ⇔ A ∈ Assemblies(P) ∧ A.name = n ∧ (∀ B ∈ Assemblies(P). B.name = n ⇒ B = A)
```

```text
Executable(P) ⇔ P.assembly.kind = `executable`
Library(P) ⇔ P.assembly.kind = `library`
Dependency(P) ⇔ P.assembly.kind = `dependency`
Linkable(P) ⇔ Executable(P) ∨ Library(P)
SharedLibrary(P) ⇔ Library(P) ∧ P.assembly.link_kind = `shared`
StaticLibrary(P) ⇔ Library(P) ∧ P.assembly.link_kind = `static`
```

**Build/Project Validation Scope.**
Phase0Checks = RulesIn({"3"})
SourceChecks = RulesIn({"4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"})

```text
Phase0Checks ∩ SourceChecks = ∅
```

**Command-Line Output.**
DumpProject(P, dump) =
 ProjectSummary(P) ++ OutputSummary(P) ++ LinkOutputSummary(P)  if dump = false

```text
 ProjectSummary(P) ++ OutputSummary(P) ++ LinkOutputSummary(P) ++ ["file:" ++ f | A ∈ EmitAssemblies(P), m ∈ A.modules, d = ModuleDirOf(m, A.source_root), f ∈ CompilationUnit(d)]  if dump = true
```

```text
ProjectSummary(P) = [⟨`project_root`, P.root⟩, ⟨`assemblies`, AsmNames(P)⟩, ⟨`assembly_name`, P.assembly.name⟩, ⟨`assembly_kind`, P.assembly.kind⟩, ⟨`link_kind`, P.assembly.link_kind⟩, ⟨`source_root`, P.source_root⟩, ⟨`output_root`, OutputRoot(P)⟩, ⟨`module_list`, ModuleList(P)⟩]
```

```text
OutputSummary(P) = [⟨`module`, m, `obj`, ObjPath(P, m), `ir`, IROpt(P, m)⟩ | m ∈ EmitModuleList(P)]
```

LinkOutputSummary(P) =

```text
 [⟨`artifact`, PrimaryArtifact(P), `import_lib`, ImportLibOpt(P)⟩]  if Linkable(P)
```

 []                                                                 otherwise

IROpt(P, m) =

```text
 IRPath(P, m, P.assembly.emit_ir)  if P.assembly.emit_ir ≠ `none`
 ⊥                                if P.assembly.emit_ir = `none`
```

ImportLibOpt(P) =

```text
 ImportLibPath(P)  if ImportLibPath(P) ≠ ⊥
 ⊥                 otherwise
```

**Command-Line Diagnostics.**
This table owns diagnostics emitted by `uv` command parsing and command-output failure handling before a project-specific diagnostic owner applies.

| Code         | Severity | Detection    | Condition                                    |
| ------------ | -------- | ------------ | -------------------------------------------- |
| `E-CLI-0001` | Error    | Command-line | Unknown `uv` command                         |
| `E-CLI-0002` | Error    | Command-line | Compiler pipeline unavailable for command    |
| `E-CLI-0003` | Error    | Command-line | Failed to write command output or diagnostic |

### 3.2 Project Root and Manifest

**Manifest Parsing (Big-Step)**
ParseTOML : Path ⇀ TOMLTable

**(Parse-Manifest-Ok)**

```text
ParseTOML(R/`Ultraviolet.toml`) ⇓ T
```

────────────────────────────────

```text
Γ ⊢ ParseManifest(R) ⇓ T
```

**(Parse-Manifest-Missing)**

```text
¬ exists(R/`Ultraviolet.toml`)    c = Code(Parse-Manifest-Missing)
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseManifest(R) ⇑ c
```

**(Parse-Manifest-Err)**

```text
ParseTOML(R/`Ultraviolet.toml`) ⇑    c = Code(Parse-Manifest-Err)
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseManifest(R) ⇑ c
```

**Manifest Required (No Single-File Fallback).**

```text
If Γ ⊢ ParseManifest(R) ⇑ c, then Γ ⊢ LoadProject(R, target) ⇑ c and the implementation MUST NOT attempt any single-file or heuristic fallback project construction.
```

**Manifest Path Resolution.**
Manifest lookup MUST use host filesystem path resolution semantics for R/`Ultraviolet.toml` and MUST NOT perform additional case verification.

**Project-Root Discovery From Command-Line Input.**
When project loading begins from one command-line input path `p`, the implementation MUST first resolve any relative `p` against the host current working directory before searching upward for `Ultraviolet.toml`. If that resolved path denotes an existing non-directory, the upward search MUST begin from its parent directory; otherwise the upward search MUST begin from the resolved path itself. `FindProjectRoot(p)` is the nearest searched directory `R` such that `exists(R/`Ultraviolet.toml`)`; if no searched directory satisfies that predicate, `FindProjectRoot(p)` is the search-start directory.

**Manifest Schema**
n = t.name
k = t.kind
r = t.root
o = t.out_dir
e = t.emit_ir
l = t.link_kind

**(WF-Assembly-Name)**

```text
Γ ⊢ n : Identifier    Γ ⊢ n : NotKeyword
```

────────────────────────────────────────

```text
Γ ⊢ n : Name
```

**(WF-Assembly-Name-Err)**

```text
¬(Γ ⊢ n : Identifier ∧ Γ ⊢ n : NotKeyword)    c = Code(WF-Assembly-Name-Err)
```

────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ n : Name ⇑ c
```

**(WF-Assembly-Kind)**

```text
k ∈ AssemblyKind
```

──────────────────

```text
Γ ⊢ k : Kind
```

**(WF-Assembly-Kind-Err)**

```text
k ∉ AssemblyKind    c = Code(WF-Assembly-Kind-Err)
```

──────────────────────────────────────────────────

```text
Γ ⊢ k : Kind ⇑ c
```

**(WF-Assembly-Root-Path)**

```text
Γ ⊢ r : RelPath
```

────────────────

```text
Γ ⊢ r : RootPath
```

**(WF-Assembly-Root-Path-Err)**

```text
¬(Γ ⊢ r : RelPath)    c = Code(WF-Assembly-Root-Path-Err)
```

────────────────────────────────────────────────────────

```text
Γ ⊢ r : RootPath ⇑ c
```

**(WF-Assembly-OutDir-Path)**

```text
o = ⊥ ∨ Γ ⊢ o : RelPath
```

────────────────────────

```text
Γ ⊢ o : OutDirPath
```

**(WF-Assembly-OutDir-Path-Err)**

```text
o ≠ ⊥    ¬(Γ ⊢ o : RelPath)    c = Code(WF-Assembly-OutDir-Path-Err)
```

────────────────────────────────────────────────────────────────────

```text
Γ ⊢ o : OutDirPath ⇑ c
```

**(WF-Assembly-EmitIR)**

```text
e ∈ {⊥, `none`, `ll`, `bc`}
```

───────────────────────────

```text
Γ ⊢ e : EmitIR
```

**(WF-Assembly-EmitIR-Err)**

```text
e ∉ {⊥, `none`, `ll`, `bc`}    c = Code(WF-Assembly-EmitIR-Err)
```

─────────────────────────────────────────────────────────────────

```text
Γ ⊢ e : EmitIR ⇑ c
```

AsmLinkKind(k, l) =

```text
 `shared`  if k = `library` ∧ l = ⊥
 l         if k = `library` ∧ l ∈ LinkKind
 ⊥         otherwise
```

**Manifest Validation (Big-Step)**
Keys(T) = Dom(T)
AsmField(T) = T[`assembly`]
AsmTables(T) =
 [AsmField(T)]  if IsTable(AsmField(T))
 AsmField(T)    if IsArrayTable(AsmField(T))

```text
 ⊥              otherwise
```

TopKeys = {"assembly", "toolchain", "build"}

**(WF-TopKeys)**

```text
Keys(T) ⊆ TopKeys
```

────────────────────────

```text
Γ ⊢ T : TopKeys
```

**(WF-TopKeys-Err)**

```text
¬(Keys(T) ⊆ TopKeys)    c = Code(WF-TopKeys-Err)
```

──────────────────────────────────────────────────

```text
Γ ⊢ T : TopKeys ⇑ c
```

**(WF-Assembly-Table)**

```text
AsmTables(T) ≠ ⊥
```

────────────────────────

```text
Γ ⊢ T : AssemblyTable
```

**(WF-Assembly-Table-Err)**

```text
AsmTables(T) = ⊥    c = Code(WF-Assembly-Table-Err)
```

────────────────────────────────────────────────────

```text
Γ ⊢ T : AssemblyTable ⇑ c
```

**(WF-Assembly-Count)**

```text
AsmTables(T) = Ts    |Ts| ≥ 1
```

────────────────────────────────

```text
Γ ⊢ T : AssemblyCount
```

**(WF-Assembly-Count-Err)**
AsmTables(T) = Ts    |Ts| = 0    c = Code(WF-Assembly-Count-Err)
───────────────────────────────────────────────────────────────

```text
Γ ⊢ T : AssemblyCount ⇑ c
```

**(WF-Assembly-Name-Dup)**

```text
AsmTables(T) = Ts    Distinct([t.name | t ∈ Ts])
```

────────────────────────────────────────────────

```text
Γ ⊢ T : AssemblyNames
```

**(WF-Assembly-Name-Dup-Err)**

```text
AsmTables(T) = Ts    ¬ Distinct([t.name | t ∈ Ts])    c = Code(WF-Assembly-Name-Dup)
```

────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T : AssemblyNames ⇑ c
```

Req = {`name`, `kind`, `root`}
Opt = {`out_dir`, `emit_ir`, `link_kind`}

**(WF-Assembly-Keys)**

```text
Keys(t) ⊆ (Req ∪ Opt)
```

──────────────────────

```text
Γ ⊢ t : KnownKeys
```

**(WF-Assembly-Keys-Err)**

```text
¬(Keys(t) ⊆ (Req ∪ Opt))    c = Code(WF-Assembly-Keys-Err)
```

───────────────────────────────────────────────────────────

```text
Γ ⊢ t : KnownKeys ⇑ c
```

**(WF-Assembly-Required-Types)**

```text
∀ k ∈ Req. IsString(t[k])
```

──────────────────────────

```text
Γ ⊢ t : ReqTypes
```

**(WF-Assembly-Required-Types-Err)**

```text
∃ k ∈ Req. t[k] = ⊥ ∨ ¬ IsString(t[k])    c = Code(WF-Assembly-Required-Types-Err)
```

──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ t : ReqTypes ⇑ c
```

**(WF-Assembly-Optional-Types)**

```text
t[`out_dir`] ∈ {string, ⊥}
```

──────────────────────────

```text
Γ ⊢ t : OutDirType
```

**(WF-Assembly-OutDirType-Err)**

```text
t[`out_dir`] ∉ {string, ⊥}    c = Code(WF-Assembly-OutDirType-Err)
```

──────────────────────────────────────────────────────────────────

```text
Γ ⊢ t : OutDirType ⇑ c
```

```text
t[`emit_ir`] ∈ {string, ⊥}
```

──────────────────────────

```text
Γ ⊢ t : EmitIRType
```

**(WF-Assembly-EmitIRType-Err)**

```text
t[`emit_ir`] ∉ {string, ⊥}    c = Code(WF-Assembly-EmitIRType-Err)
```

──────────────────────────────────────────────────────────────────

```text
Γ ⊢ t : EmitIRType ⇑ c
```

```text
t[`link_kind`] ∈ {string, ⊥}
```

────────────────────────────

```text
Γ ⊢ t : LinkKindType
```

**(WF-Assembly-LinkKindType-Err)**

```text
t[`link_kind`] ∉ {string, ⊥}    c = Code(WF-Assembly-LinkKindType-Err)
```

────────────────────────────────────────────────────────────────────

```text
Γ ⊢ t : LinkKindType ⇑ c
```

**(WF-Assembly-LinkKind)**

```text
(t.kind = `library` ∧ t.link_kind ∈ {⊥, `shared`, `static`}) ∨ (t.kind ∈ {`executable`, `dependency`} ∧ t.link_kind = ⊥)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ t : LinkKindField
```

**(WF-Assembly-LinkKind-Err)**

```text
t.kind = `library`    t.link_kind ∉ {⊥, `shared`, `static`}    c = Code(WF-Assembly-LinkKind-Err)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ t : LinkKindField ⇑ c
```

**(WF-Assembly-LinkKind-Use-Err)**

```text
t.kind ∈ {`executable`, `dependency`}    t.link_kind ≠ ⊥    c = Code(WF-Assembly-LinkKind-Use-Err)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ t : LinkKindField ⇑ c
```

**Toolchain Configuration**
ToolchainKeys = {"llvm_bin", "runtime_lib", "target_profile"}

```text
ToolchainTargetProfileOk(v) ⇔ v = ⊥ ∨ (v : string ∧ v ∈ TargetProfile)
```

**(WF-Toolchain)**

```text
T["toolchain"] = ⊥ ∨ (IsTable(T["toolchain"]) ∧ Keys(T["toolchain"]) ⊆ ToolchainKeys ∧ (T["toolchain"]["llvm_bin"] = ⊥ ∨ T["toolchain"]["llvm_bin"] : string) ∧ (T["toolchain"]["runtime_lib"] = ⊥ ∨ T["toolchain"]["runtime_lib"] : string) ∧ ToolchainTargetProfileOk(T["toolchain"]["target_profile"]))
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T : ToolchainValid
```

**(WF-Toolchain-Err)**

```text
T["toolchain"] ≠ ⊥ ∧ ¬(IsTable(T["toolchain"]) ∧ Keys(T["toolchain"]) ⊆ ToolchainKeys ∧ (T["toolchain"]["llvm_bin"] = ⊥ ∨ T["toolchain"]["llvm_bin"] : string) ∧ (T["toolchain"]["runtime_lib"] = ⊥ ∨ T["toolchain"]["runtime_lib"] : string) ∧ ToolchainTargetProfileOk(T["toolchain"]["target_profile"]))    c = Code(WF-Toolchain-Err)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T : ToolchainValid ⇑ c
```

ToolchainConfig(T) =

```text
 ⟨llvm_bin = T["toolchain"]["llvm_bin"], runtime_lib = T["toolchain"]["runtime_lib"], target_profile = T["toolchain"]["target_profile"]⟩  if T["toolchain"] ≠ ⊥
 ⟨llvm_bin = ⊥, runtime_lib = ⊥, target_profile = ⊥⟩                                                                                otherwise
```

SelectedTargetProfile(cli, T) =

```text
 cli                               if cli ≠ ⊥
 ToolchainConfig(T).target_profile if cli = ⊥ ∧ ToolchainConfig(T).target_profile ≠ ⊥
```

 error                             otherwise

**Build Configuration**
BuildKeys = {"incremental", "progress"}

**(WF-Build)**

```text
T["build"] = ⊥ ∨ (IsTable(T["build"]) ∧ Keys(T["build"]) ⊆ BuildKeys ∧ ∀ k ∈ Keys(T["build"]). T["build"][k] : bool)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T : BuildValid
```

**(WF-Build-Err)**

```text
T["build"] ≠ ⊥ ∧ ¬(IsTable(T["build"]) ∧ Keys(T["build"]) ⊆ BuildKeys ∧ ∀ k ∈ Keys(T["build"]). T["build"][k] : bool)    c = Code(WF-Build-Err)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ T : BuildValid ⇑ c
```

BuildConfig(T) =

```text
 ⟨incremental = false, progress = true⟩                                                                                 if T["build"] = ⊥
 ⟨incremental = T["build"]["incremental"], progress = (T["build"]["progress"] if T["build"]["progress"] ≠ ⊥ else true)⟩  if T["build"] ≠ ⊥ ∧ T["build"]["incremental"] ≠ ⊥
 ⟨incremental = false, progress = (T["build"]["progress"] if T["build"]["progress"] ≠ ⊥ else true)⟩                     otherwise
```

**Path Resolution**
WinSep = {"\\", "/"}

```text
AsciiLetter(c) ⇔ (c ∈ {"A", …, "Z"} ∨ c ∈ {"a", …, "z"})
DriveRooted(p) ⇔ |p| ≥ 3 ∧ AsciiLetter(At(p, 0)) ∧ At(p, 1) = ":" ∧ At(p, 2) ∈ WinSep
UNC(p) ⇔ StartsWith(p, "//") ∨ StartsWith(p, "\\\\")
RootRelative(p) ⇔ (StartsWith(p, "/") ∨ StartsWith(p, "\\")) ∧ ¬ UNC(p) ∧ ¬ DriveRooted(p)
```

RootTag(p) =
 p[0..2)  if DriveRooted(p)
 "//"     if UNC(p)
 "/"      if RootRelative(p)
 "\""     otherwise
Tail(p) =
 p[3..|p|)  if DriveRooted(p)
 p[2..|p|)  if UNC(p)
 p[1..|p|)  if RootRelative(p)
 p         otherwise

```text
Segs(p) = [ p[i..j) | 0 ≤ i < j ≤ |p| ∧ (∀ k ∈ [i, j). At(p, k) ∉ WinSep) ∧ (i = 0 ∨ At(p, i-1) ∈ WinSep) ∧ (j = |p| ∨ At(p, j) ∈ WinSep) ]
```

PathComps(p) =
 Segs(p)  if RootTag(p) = "\""
 [RootTag(p)] ++ Segs(Tail(p))  otherwise
JoinComp([]) = "\""
JoinComp([c]) = c
JoinComp(c::cs) =

```text
 c ++ JoinComp(cs)          if c ∈ {"/", "//"}
```

 c ++ "/" ++ JoinComp(cs)   if DriveRooted(c ++ "/")
 c ++ "/" ++ JoinComp(cs)   otherwise
Join(a, b) =
 b  if AbsPath(b)
 JoinComp(PathComps(a) ++ PathComps(b))  otherwise

```text
AbsPath(p) ⇔ DriveRooted(p) ∨ UNC(p) ∨ RootRelative(p)
is_relative(p) ⇔ ¬ AbsPath(p)
Join : Path × Path → Path
Normalize : Path → Path
```

Canon : Path ⇀ Path

```text
prefix(p, q) ⇔ PathPrefix(PathComps(q), PathComps(p))
Normalize(p) = JoinComp([ c | c ∈ PathComps(p) ∧ c ≠ "." ])
Under(p, O) ⇔ prefix(Normalize(p), Normalize(O))
Canon(p) = ⊥ ⇔ ∃ c ∈ PathComps(Normalize(p)). c = ".."
Canon(p) = Normalize(p) ⇔ ¬ ∃ c ∈ PathComps(Normalize(p)). c = ".."
```

Drop(0, xs) = xs    Drop(n, []) = []    Drop(n, x::xs) = Drop(n-1, xs) (n > 0)

```text
relative(p, base) = rel ⇔ Canon(p) = p' ∧ Canon(base) = b' ∧ PathPrefix(PathComps(b'), PathComps(p')) ∧ rel = JoinComp(Drop(|PathComps(b')|, PathComps(p')))
```

Basename(p) =
 "\""  if |PathComps(p)| = 0
 last(PathComps(p))  otherwise
last([x]) = x    last(x::xs) = last(xs) (|xs| > 0)

b = Basename(p)

```text
D = { j | 0 ≤ j < |b| ∧ b[j] = "." }
```

FileExt(p) =
 "\""  if D = ∅

```text
 "\""  if D ≠ ∅ ∧ max(D) = 0
 b[max(D)..|b|)  if D ≠ ∅ ∧ max(D) > 0
```

**(Resolve-Canonical)**
p' = Normalize(Join(R, p))    Canon(R) = R'    Canon(p') = p''
─────────────────────────────────────────────────────────────

```text
Γ ⊢ Resolve(R, p) ⇓ (R', p'')
```

**(Resolve-Canonical-Err)**

```text
p' = Normalize(Join(R, p))    (Canon(R) = ⊥ ∨ Canon(p') = ⊥)    c = Code(Resolve-Canonical-Err)
```

──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Resolve(R, p) ⇑ c
```

**(WF-RelPath)**

```text
is_relative(p)    Γ ⊢ Resolve(R, p) ⇓ (R', p'')    prefix(p'', R')
```

──────────────────────────────────────────────────────────────────────

```text
Γ ⊢ p : RelPath
```

**(WF-RelPath-Err)**

```text
¬ is_relative(p) ∨ (Γ ⊢ Resolve(R, p) ⇓ (R', p'') ∧ ¬ prefix(p'', R'))    c = Code(WF-RelPath-Err)
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ p : RelPath ⇑ c
```

```text
Project(Γ) = P ⇔ Γ.project = P
```

**(WF-Project-Root)**
exists(`Ultraviolet.toml` at R)
───────────────────────────

```text
⊢ R : ProjectRoot
```

### 3.3 Assemblies and Project Loading

**(WF-Assembly)**

```text
A_0.kind ∈ AssemblyKind
```

────────────────────────

```text
Γ ⊢ A_0 : Assembly
```

**Project Load (Small-Step)**

```text
AssemblyTarget = Name ∪ {⊥}
```

ProjLoadState = {Start(R, target), Parsed(R, target, T), Validated(R, target, T), ProjAsmScan(R, target, T, Ts, As), Discovered(P), Error(code)}

**(Step-Parse)**

```text
Γ ⊢ ParseManifest(R) ⇓ T
```

────────────────────────────────────────────────────────

```text
⟨Start(R, target)⟩ → ⟨Parsed(R, target, T)⟩
```

**(Step-Parse-Err)**

```text
Γ ⊢ ParseManifest(R) ⇑ c
```

──────────────────────────────────────────────

```text
⟨Start(R, target)⟩ → ⟨Error(c)⟩
```

**(Step-Validate)**

```text
Γ ⊢ ValidateManifest(T) ⇓ ok
```

──────────────────────────────────────────────────────────

```text
⟨Parsed(R, target, T)⟩ → ⟨Validated(R, target, T)⟩
```

**(Step-Validate-Err)**

```text
Γ ⊢ ValidateManifest(T) ⇑ c
```

───────────────────────────────────────────────

```text
⟨Parsed(R, target, T)⟩ → ⟨Error(c)⟩
```

**Manifest Validation (Deterministic).**

```text
ChecksAsm(t) = [Γ ⊢ t : KnownKeys, Γ ⊢ t : ReqTypes, Γ ⊢ t : OutDirType, Γ ⊢ t : EmitIRType, Γ ⊢ t : LinkKindType, Γ ⊢ t.name : Name, Γ ⊢ t.kind : Kind, Γ ⊢ t : LinkKindField, Γ ⊢ t.emit_ir : EmitIR, Γ ⊢ t.root : RootPath, Γ ⊢ t.out_dir : OutDirPath]
BaseChecks(T) = [Γ ⊢ T : TopKeys, Γ ⊢ T : AssemblyTable, Γ ⊢ T : AssemblyCount, Γ ⊢ T : AssemblyNames]
```

AsmChecks(T) =

```text
 []  if AsmTables(T) = ⊥
 ++_{t ∈ AsmTables(T)} ChecksAsm(t)  otherwise
```

Checks(T) = BaseChecks(T) ++ AsmChecks(T)

```text
FirstFail([]) = ⊥
FirstFail(J::Js) = c ⇔ Γ ⊢ J ⇑ c
FirstFail(J::Js) = FirstFail(Js) ⇔ Γ ⊢ J ⇓ ok
```

**(ValidateManifest-Ok)**

```text
FirstFail(Checks(T)) = ⊥
```

────────────────────────────────────

```text
Γ ⊢ ValidateManifest(T) ⇓ ok
```

**(ValidateManifest-Err)**
FirstFail(Checks(T)) = c
───────────────────────────────────

```text
Γ ⊢ ValidateManifest(T) ⇑ c
```

**(Step-Asm-Init)**
Ts = AsmTables(T)
──────────────────────────────────────────────────────────

```text
⟨Validated(R, target, T)⟩ → ⟨ProjAsmScan(R, target, T, Ts, [])⟩
```

**(Step-Asm-Cons)**

```text
Γ ⊢ BuildAssembly(R, t_0) ⇓ A
```

────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨ProjAsmScan(R, target, T, t_0::ts, As)⟩ → ⟨ProjAsmScan(R, target, T, ts, As ++ [A])⟩
```

**(Step-Asm-Err)**

```text
Γ ⊢ BuildAssembly(R, t_0) ⇑ c
```

──────────────────────────────────────────────────────────────

```text
⟨ProjAsmScan(R, target, T, t_0::ts, As)⟩ → ⟨Error(c)⟩
```

**(Step-Asm-Done)**

```text
Γ ⊢ OwnAssemblies(As) ⇓ As'    Γ ⊢ SelectAssembly(As', target) ⇓ A_0    P = ⟨root = R, assemblies = As', assembly = A_0, source_root = A_0.source_root, outputs = A_0.outputs, modules = A_0.modules, toolchain = ToolchainConfig(T), build = BuildConfig(T)⟩
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨ProjAsmScan(R, target, T, [], As)⟩ → ⟨Discovered(P)⟩
```

**(Step-Asm-Own-Err)**

```text
Γ ⊢ OwnAssemblies(As) ⇑ c
```

───────────────────────────────────────────────

```text
⟨ProjAsmScan(R, target, T, [], As)⟩ → ⟨Error(c)⟩
```

**(Step-Asm-Done-Err)**

```text
Γ ⊢ OwnAssemblies(As) ⇓ As'    Γ ⊢ SelectAssembly(As', target) ⇑ c
```

────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨ProjAsmScan(R, target, T, [], As)⟩ → ⟨Error(c)⟩
```

**Assembly Selection**

**(Select-Only)**
|As| = 1    target = ⊥    As = [A_0]
──────────────────────────────────────────────

```text
Γ ⊢ SelectAssembly(As, target) ⇓ A_0
```

**(Select-Only-Exe)**
|As| > 1    target = ⊥    |{A ∈ As | A.kind = "executable"}| = 1    A_e ∈ As    A_e.kind = "executable"
────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ SelectAssembly(As, target) ⇓ A_e
```

**(Select-By-Name)**

```text
target ≠ ⊥    A ∈ As    A.name = target
```

──────────────────────────────────────────────

```text
Γ ⊢ SelectAssembly(As, target) ⇓ A
```

**(Select-Err)**

```text
(target = ⊥ ∧ |As| ≠ 1 ∧ |{A ∈ As | A.kind = "executable"}| ≠ 1) ∨ (target ≠ ⊥ ∧ ¬ ∃ A ∈ As. A.name = target)    c = Code(Assembly-Select-Err)
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ SelectAssembly(As, target) ⇑ c
```

**Assembly Build (Big-Step)**

**(BuildAssembly-Ok)**

```text
Γ ⊢ Resolve(R, t.root) ⇓ (R', S)    Γ ⊢ S : SourceRoot    Γ ⊢ Modules(S, t.name) ⇓ M    L = sort_{≺_mod}(M)    A = ⟨name = t.name, kind = t.kind, link_kind = AsmLinkKind(t.kind, t.link_kind), root = t.root, out_dir = t.out_dir, emit_ir = t.emit_ir, source_root = S, outputs = OutputPaths(R, t), modules = L⟩
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuildAssembly(R, t) ⇓ A
```

**(BuildAssembly-Err-Resolve)**

```text
Γ ⊢ Resolve(R, t.root) ⇑ c
```

─────────────────────────────────

```text
Γ ⊢ BuildAssembly(R, t) ⇑ c
```

**(BuildAssembly-Err-Root)**

```text
Γ ⊢ Resolve(R, t.root) ⇓ (R', S)    Γ ⊢ S : SourceRoot ⇑ c
```

─────────────────────────────────────────────────────────────

```text
Γ ⊢ BuildAssembly(R, t) ⇑ c
```

**(BuildAssembly-Err-Modules)**

```text
Γ ⊢ Resolve(R, t.root) ⇓ (R', S)    Γ ⊢ S : SourceRoot    Γ ⊢ Modules(S, t.name) ⇑ c
```

────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuildAssembly(R, t) ⇑ c
```

**Project Load (Big-Step)**

**(LoadProject-Ok)**

```text
Γ ⊢ ParseManifest(R) ⇓ T    Γ ⊢ ValidateManifest(T) ⇓ ok    AsmTables(T) = [t_1, …, t_n]    ∀ i, Γ ⊢ BuildAssembly(R, t_i) ⇓ A_i    As = [A_1, …, A_n]    Γ ⊢ OwnAssemblies(As) ⇓ As'    Γ ⊢ SelectAssembly(As', target) ⇓ A_0    P = ⟨root = R, assemblies = As', assembly = A_0, source_root = A_0.source_root, outputs = A_0.outputs, modules = A_0.modules, toolchain = ToolchainConfig(T), build = BuildConfig(T)⟩
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LoadProject(R, target) ⇓ P
```

**(LoadProject-Err)**

```text
Γ ⊢ LoadProject(R, target) →* ⟨Error(c)⟩
```

────────────────────────────────────────────

```text
Γ ⊢ LoadProject(R, target) ⇑ c
```

**Assembly Graph Constraints**

Let `AsmDeps(A)` be the set of assembly names referenced by the first path segment of each `import` declaration appearing in modules owned by `A`, restricted to names in `AsmNames(P)`.

1. If `B ∈ AsmDeps(A)` and `AsmByName(P, B).kind = "executable"`, the program is ill-formed.
2. Let `G_link` be the directed graph over `{ A ∈ Assemblies(P) | A.kind = "library" }` with edge `A → B` iff `B ∈ AsmDeps(A)` and `AsmByName(P, B).kind = "library"`. If `G_link` contains a cycle, the program is ill-formed.
3. A `dependency` assembly MUST NOT own a final linked artifact. Its modules are emitted into the nearest importing linkable assembly selected by the build graph.

### 3.4 Deterministic Ordering and Case Folding

```text
FoldPath(r) = JoinComp([CaseFold(NFC(c)) | c ∈ PathComps(r)])
```

FileKey(f, d) =

```text
 ⟨FoldPath(rel), rel⟩  if relative(f, d) ⇓ rel
 ⟨⊥, Basename(f)⟩      if relative(f, d) ⇑
```

```text
f_1 ≺_file f_2 ⇔ Utf8LexLess(FileKey(f_1, d), FileKey(f_2, d))
```

**(FileOrder-Rel-Fail)**

```text
relative(f, d) ⇑    c = Code(FileOrder-Rel-Fail)
```

────────────────────────────────────────────────

```text
Γ ⊢ Emit(c)
```

**Fold.**

```text
Fold(p) = [CaseFold(NFC(c)) | c ∈ p]
```

DirKey(d, S) =

```text
 ⟨FoldPath(rel), rel⟩  if relative(d, S) ⇓ rel
 ⟨⊥, Basename(d)⟩      if relative(d, S) ⇑
```

```text
d_1 ≺_dir d_2 ⇔ Utf8LexLess(DirKey(d_1, S), DirKey(d_2, S))
```

DirSeq(S) = sort_{≺_dir}(Dirs(S))

**(DirSeq-Read-Err)**

```text
Dirs(S) ⇑    c = Code(DirSeq-Read-Err)
```

──────────────────────────────────────

```text
Γ ⊢ Emit(c)
```

**(DirSeq-Rel-Fail)**

```text
relative(d, S) ⇑    c = Code(DirSeq-Rel-Fail)
```

──────────────────────────────────────────────

```text
Γ ⊢ Emit(c)
```

### 3.5 Source Roots, Module Directories, and Compilation Units

**Dirs.**

```text
Dirs(S) = { d | is_dir(d) ∧ relative(d, S) ⇓ r }
S ∈ Dirs(S)
```

**(WF-Source-Root)**
is_dir(S)
──────────────

```text
Γ ⊢ S : SourceRoot
```

**(WF-Source-Root-Err)**

```text
¬ is_dir(S)    c = Code(WF-Source-Root-Err)
```

───────────────────────────────────────────

```text
Γ ⊢ S : SourceRoot ⇑ c
```

**(Module-Dir)**

```text
∃ f ∈ Files(d) : FileExt(f) = ".uv"
```

─────────────────────────────────────────

```text
Γ ⊢ d : ModuleDir
```

```text
Files(d) = { f | f ∈ d ∧ FileExt(f) = ".uv" }
```

CompilationUnit(d) = sort_{≺_file}(Files(d))

**(CompilationUnit-Rel-Fail)**

```text
∃ f ∈ Files(d). relative(f, d) ⇑    c = Code(FileOrder-Rel-Fail)
```

─────────────────────────────────────────────────────────────────

```text
Γ ⊢ CompilationUnit(d) ⇑ c
```

Module discovery state transitions and module-path formation are defined by §11.5.4. This chapter defines the filesystem-level relations consumed by those rules and by project loading.

**(Modules-Ok)**

```text
⟨DiscStart(S, A)⟩ →* ⟨DiscDone(M)⟩
```

──────────────────────────────────

```text
Γ ⊢ Modules(S, A) ⇓ M
```

**(Modules-Err)**

```text
⟨DiscStart(S, A)⟩ →* ⟨Error(c)⟩
```

─────────────────────────────────

```text
Γ ⊢ Modules(S, A) ⇑ c
```

```text
AssemblySourceRoots(As) = { A.source_root | A ∈ As }
```

RootDepth(S) = |PathComps(S)|

```text
OwnerRoot(d, Rs) = S_k ⇔ S_k ∈ Rs ∧ prefix(d, S_k) ∧ (∀ S_i ∈ Rs. prefix(d, S_i) ⇒ RootDepth(S_i) ≤ RootDepth(S_k)) ∧ (∀ S_j ∈ Rs. prefix(d, S_j) ∧ RootDepth(S_j) = RootDepth(S_k) ⇒ S_j = S_k)
```

```text
OwnedModules(A, As) = [ m ∈ A.modules | OwnerRoot(ModuleDirOf(m, A.source_root), AssemblySourceRoots(As)) = A.source_root ]
```

**(OwnAssemblies-Ok)**

```text
∀ A ∈ As, ∀ m ∈ A.modules. ∃ S. OwnerRoot(ModuleDirOf(m, A.source_root), AssemblySourceRoots(As)) = S    As = [A_1, …, A_n]    As' = [A_1[modules := OwnedModules(A_1, As)], …, A_n[modules := OwnedModules(A_n, As)]]
```

─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ OwnAssemblies(As) ⇓ As'
```

**(WF-Assembly-Root-Owner-Ambiguous)**

```text
∃ A ∈ As, m ∈ A.modules. ¬ ∃ S. OwnerRoot(ModuleDirOf(m, A.source_root), AssemblySourceRoots(As)) = S    c = Code(WF-Assembly-Root-Owner-Ambiguous)
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ OwnAssemblies(As) ⇑ c
```

### 3.6 Output Artifacts and Linking

AssemblyProject(P, A) = P[assembly := A, source_root := A.source_root, outputs := A.outputs, modules := A.modules]

```text
ModulePaths(A) = { m.path | m ∈ A.modules }
AsmImportGraph(P) = ⟨Assemblies(P), E⟩
E = {⟨A, B⟩ | A ∈ Assemblies(P) ∧ B ∈ Assemblies(P) ∧ A ≠ B ∧ ∃ m ∈ A.modules, attrs_opt, vis, path, alias_opt, span, doc. ImportDecl(attrs_opt, vis, path, alias_opt, span, doc) ∈ ASTModule(AssemblyProject(P, A), m).items ∧ Γ_A ⊢ ResolveImportPath(path) ⇓ mp ∧ mp ∈ ModulePaths(B)}
Γ_A = Γ[project ↦ AssemblyProject(P, A)]
Vertices(⟨V, E⟩) = V
Edges(⟨V, E⟩) = E
```

```text
GraphPath(⟨V, E⟩, [A_0, …, A_n]) ⇔ n ≥ 0 ∧ ∀ i ∈ [0, n). ⟨A_i, A_{i+1}⟩ ∈ E
GraphReach(⟨V, E⟩, A, B) ⇔ ∃ π. GraphPath(⟨V, E⟩, π) ∧ π[0] = A ∧ last(π) = B
NoLibraryInterior([A_0, …, A_n]) ⇔ ∀ i ∈ [1, n). A_i.kind ≠ `library`
LibraryBoundaryCycle(P) ⇔ ∃ π. GraphPath(AsmImportGraph(P), π) ∧ π[0] = last(π) ∧ |π| > 1 ∧ GraphReach(AsmImportGraph(P), P.assembly, π[0]) ∧ ∃ A ∈ π. A.kind = `library`
ImportsExecutable(P) ⇔ ∃ A ∈ Assemblies(P). A ≠ P.assembly ∧ GraphReach(AsmImportGraph(P), P.assembly, A) ∧ A.kind = `executable`
HostedLibraryImportsLinkedLibrary(P) ⇔ HostedLibrary(P) ∧ ∃ A. A ∈ Assemblies(P) ∧ A ≠ P.assembly ∧ GraphReach(AsmImportGraph(P), P.assembly, A) ∧ A.kind = `library`
```

**(Assembly-Graph-Ok)**

```text
¬ ImportsExecutable(P)    ¬ LibraryBoundaryCycle(P)    ¬ HostedLibraryImportsLinkedLibrary(P)
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ AssemblyGraph(P) ⇓ ok
```

**(Assembly-Graph-Err)**

```text
ImportsExecutable(P) ∨ LibraryBoundaryCycle(P)    c = Code(Assembly-Graph-Err)
```

────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ AssemblyGraph(P) ⇑ c
```

**(Assembly-Graph-HostedImport-Err)**
HostedLibraryImportsLinkedLibrary(P)    c = Code(Assembly-Graph-HostedImport-Err)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ AssemblyGraph(P) ⇑ c
```

```text
EmitAssemblies(P) = { A | A = P.assembly ∨ (A.kind = `dependency` ∧ ∃ π. GraphPath(AsmImportGraph(P), π) ∧ π[0] = P.assembly ∧ last(π) = A ∧ NoLibraryInterior(π)) }
ImportedLibraries(P) = { A | A.kind = `library` ∧ GraphReach(AsmImportGraph(P), P.assembly, A) }
```

ImportedLibrariesExSelf(P) = ImportedLibraries(P) \ {P.assembly}

```text
LibraryPred(P, B, A) ⇔ B ∈ ImportedLibrariesExSelf(P) ∧ A ∈ ImportedLibrariesExSelf(P) ∧ B ≠ A ∧ ∃ π. GraphPath(AsmImportGraph(P), π) ∧ π[0] = A ∧ last(π) = B ∧ NoLibraryInterior(π)
```

```text
LibraryReady(P, S, A) ⇔ A ∈ ImportedLibrariesExSelf(P) ∧ (∀ B. LibraryPred(P, B, A) ⇒ B ∈ S)
LibraryTopo(P) = [A_1, …, A_n] ⇔ {A_1, …, A_n} = ImportedLibrariesExSelf(P) ∧ ∀ i. ReadyLexLeast(P, {A_1, …, A_{i-1}}, A_i)
ReadyLexLeast(P, S, A) ⇔ LibraryReady(P, S, A) ∧ ∀ B. LibraryReady(P, S, B) ⇒ Utf8LexLess(A.name, B.name) ∨ A.name = B.name
```

**(EmitModuleList-Ok)**

```text
L = sort_{≺_mod}(⋃_{A ∈ EmitAssemblies(P)} A.modules)
```

────────────────────────────────────────────────────────────

```text
Γ ⊢ EmitModuleList(P) ⇓ L
```

```text
RequiredOutputs(P) = {ObjPath(P, m) | m ∈ EmitModuleList(P)} ∪ IRSet(P) ∪ PrimaryArtifactSet(P) ∪ ImportLibSet(P)
```

IRSet(P) =

```text
 {IRPath(P, m, P.assembly.emit_ir) | m ∈ EmitModuleList(P)}  if P.assembly.emit_ir ∈ {`ll`, `bc`}
```

 ∅                                                      otherwise
PrimaryArtifactSet(P) =
 {PrimaryArtifact(P)}  if Linkable(P)
 ∅                    otherwise
ImportLibSet(P) =

```text
 {ImportLibPath(P)}  if SharedLibrary(P) ∧ EmitsImportLib(SelectedTargetProfile)
```

 ∅                  otherwise

**Output Root.**
O = OutputRoot(P) =
 P.root/P.assembly.out_dir  if provided
 P.root/`build`             otherwise

**Output Hygiene.**

```text
OutputHygiene(P) ⇔ ∀ p ∈ RequiredOutputs(P). Under(p, OutputRoot(P))
```

OutputPaths(R, A).root =
 R/A.out_dir  if provided
 R/`build`    otherwise
OutputPaths(R, A).obj_dir = OutputPaths(R, A).root/`obj`
OutputPaths(R, A).ir_dir = OutputPaths(R, A).root/`ir`
OutputPaths(R, A).bin_dir = OutputPaths(R, A).root/`bin`
OutputPaths(R, A).lib_dir = OutputPaths(R, A).root/`lib`

P.outputs = P.assembly.outputs

**Object File Naming**

```text
PathToPrefix(s) = Concat([BMap(b) | b ∈ Utf8(NFC(s))])
```

BMap(b) =

```text
 chr(b)           if b ∈ [0-9A-Za-z]
```

 "_x" ++ Hex2(b)  otherwise

mangle(s) = PathToPrefix(s)
MangleModulePath(p) = mangle(PathString(PathKey(p)))

obj(m) = O / `obj` / (MangleModulePath(p) ++ ObjExt(SelectedTargetProfile))

**Final Artifact Naming**
libname = LibraryPrefix(SelectedTargetProfile) ++ assembly_name
exe = O / `bin` / (assembly_name ++ ExeSuffix(SelectedTargetProfile))
shared = O / `bin` / (libname ++ SharedLibSuffix(SelectedTargetProfile))
static = O / `lib` / (libname ++ StaticLibSuffix(SelectedTargetProfile))
import = O / `lib` / (libname ++ ImportLibSuffix(SelectedTargetProfile))

**Output and Linking Semantics (Formal Rules)**
path(m) = m.path
S = P.source_root

**Module Emission Order.**

```text
m_1 ≺_mod m_2 ⇔ Utf8LexLess(Fold(path(m_1)), Fold(path(m_2))) ∨ (Fold(path(m_1)) = Fold(path(m_2)) ∧ Utf8LexLess(path(m_1), path(m_2)))
```

```text
Utf8LexLess(a, b) ⇔ LexBytes(Utf8(a), Utf8(b))
```

**(ModuleList-Ok)**
L = sort_{≺_mod}(P.modules)
──────────────────────────────────────────────

```text
Γ ⊢ ModuleList(P) ⇓ L
```

**Output Paths.**
O = OutputRoot(P)
assembly_name = P.assembly.name
ext(e) =
 ".ll"  if e = `ll`
 ".bc"  if e = `bc`

ObjPath(P, m) = O / `obj` / (MangleModulePath(path(m)) ++ ObjExt(SelectedTargetProfile))
IRPath(P, m, e) = O / `ir` / (MangleModulePath(path(m)) ++ ext(e))
ExePath(P) =
 O / `bin` / (assembly_name ++ ExeSuffix(SelectedTargetProfile))  if Executable(P)

```text
 ⊥                                                                otherwise
```

SharedLibPath(P) =
 O / `bin` / ((LibraryPrefix(SelectedTargetProfile) ++ assembly_name) ++ SharedLibSuffix(SelectedTargetProfile))  if SharedLibrary(P)

```text
 ⊥                                                                                                                  otherwise
```

StaticLibPath(P) =
 O / `lib` / ((LibraryPrefix(SelectedTargetProfile) ++ assembly_name) ++ StaticLibSuffix(SelectedTargetProfile))  if StaticLibrary(P)

```text
 ⊥                                                                                                                  otherwise
```

ImportLibPath(P) =

```text
 O / `lib` / ((LibraryPrefix(SelectedTargetProfile) ++ assembly_name) ++ ImportLibSuffix(SelectedTargetProfile))  if SharedLibrary(P) ∧ EmitsImportLib(SelectedTargetProfile)
 ⊥                                                                                                                  otherwise
```

PrimaryArtifact(P) =
 ExePath(P)        if Executable(P)
 SharedLibPath(P)  if SharedLibrary(P)
 StaticLibPath(P)  if StaticLibrary(P)

```text
 ⊥                 otherwise
UsesBinDir(P) ⇔ Executable(P) ∨ SharedLibrary(P)
UsesLibDir(P) ⇔ StaticLibrary(P) ∨ (SharedLibrary(P) ∧ EmitsImportLib(SelectedTargetProfile))
```

```text
ObjPaths(P, ms) = [ObjPath(P, m) | m ∈ ms]
IRPaths(P, ms, e) = [IRPath(P, m, e) | m ∈ ms]
LibraryArtifactInputs(P) = [PrimaryArtifact(AssemblyProject(P, A)) | A ∈ LibraryTopo(P)]
```

**Module Index and Symbol Name.**
EmitModuleList(P) = [m_1, …, m_n]
Index(P, m_i) = i
pad4(i) = PadLeft(Decimal(i), '0', 4)
SymbolName(P, m) =
 "main"  if path(m) = P.assembly.name
 "mod" ++ pad4(Index(P, m))  otherwise

trunc8(s) = PadRight(Take(Utf8(s), 8), 8, 0x00)

**LLVM Target Constants.**
LLVMTriple = LLVMTripleOf(SelectedTargetProfile)
LLVMDataLayout = LLVMDataLayoutOf(SelectedTargetProfile)

```text
IsRootModule(P, m) ⇔ path(m) = P.assembly.name
```

WithEntry(P, m, IR) =

```text
 IR ++ [EntryStub(P)]  if Executable(P) ∧ IsRootModule(P, m)
```

 IR                    otherwise

**(CodegenObj-LLVM)**

```text
Project(Γ) = P    Γ ⊢ CodegenModule(m) ⇓ IR    IR' = WithEntry(P, m, IR)    Γ ⊢ LowerIR(IR') ⇓ L    Γ ⊢ EmitObj(L) ⇓ b
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CodegenObj(m) ⇓ b
```

**(CodegenIR-LLVM)**

```text
Project(Γ) = P    e ∈ {`ll`, `bc`}    Γ ⊢ CodegenModule(m) ⇓ IR    IR' = WithEntry(P, m, IR)    Γ ⊢ LowerIR(IR') ⇓ L    Γ ⊢ EmitLLVM(L) ⇓ b
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ CodegenIR(m, e) ⇓ b
```

**File Emission.**

```text
WriteFileOk(p, b) ⇒ Overwrites(p, b)
Overwrites(p, b) ⇔ ∃ fs, ω, ω'. FSWriteFile(fs, p, b, ω) ⇓ (ok, ω')
```

**Directory Creation.**

```text
EnsureDir(p) ⇓ ok ⇒ IsDir(p)
IsDir(p) ⇔ ∃ fs, ω, ω'. FSKind(fs, p, ω) ⇓ (`Dir`, ω')
IsFile(p) ⇔ FSKind(p) = File
```

**Emit Objects**

**(Emit-Objects-Empty)**
────────────────────────────────────────

```text
Γ ⊢ EmitObjects([], P) ⇓ []
```

**(Emit-Objects-Cons)**

```text
Γ ⊢ CodegenObj(m) ⇓ b    Γ ⊢ WriteFile(ObjPath(P, m), b) ⇓ ok    Γ ⊢ EmitObjects(ms, P) ⇓ L
```

────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EmitObjects(m::ms, P) ⇓ ObjPath(P, m)::L
```

**Emit IR**

**(Emit-IR-None)**
e = `none`
───────────────────────────────

```text
Γ ⊢ EmitIR(ms, P, e) ⇓ []
```

**(Emit-IR-Cons-LL)**

```text
e = `ll`    Γ ⊢ CodegenIR(m, e) ⇓ b    Γ ⊢ WriteFile(IRPath(P, m, e), b) ⇓ ok    Γ ⊢ EmitIR(ms, P, e) ⇓ L
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EmitIR(m::ms, P, e) ⇓ IRPath(P, m, e)::L
```

**(Emit-IR-Cons-BC)**

```text
e = `bc`    Γ ⊢ CodegenIR(m, `ll`) ⇓ t    Γ ⊢ ResolveTool(`llvm-as`) ⇓ a    Γ ⊢ AssembleIR(a, t) ⇓ b    Γ ⊢ WriteFile(IRPath(P, m, e), b) ⇓ ok    Γ ⊢ EmitIR(ms, P, e) ⇓ L
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EmitIR(m::ms, P, e) ⇓ IRPath(P, m, e)::L
```

```text
EmitIRFail(m, P, `ll`) ⇔ Γ ⊢ CodegenIR(m, `ll`) ⇑ ∨ (∃ b. Γ ⊢ CodegenIR(m, `ll`) ⇓ b ∧ Γ ⊢ WriteFile(IRPath(P, m, `ll`), b) ⇑)
EmitIRFail(m, P, `bc`) ⇔
 Γ ⊢ CodegenIR(m, `ll`) ⇑ ∨
 (∃ t. Γ ⊢ CodegenIR(m, `ll`) ⇓ t ∧ Γ ⊢ ResolveTool(`llvm-as`) ⇑) ∨
 (∃ t, a. Γ ⊢ CodegenIR(m, `ll`) ⇓ t ∧ Γ ⊢ ResolveTool(`llvm-as`) ⇓ a ∧ Γ ⊢ AssembleIR(a, t) ⇑) ∨
 (∃ t, a, b. Γ ⊢ CodegenIR(m, `ll`) ⇓ t ∧ Γ ⊢ ResolveTool(`llvm-as`) ⇓ a ∧ Γ ⊢ AssembleIR(a, t) ⇓ b ∧ Γ ⊢ WriteFile(IRPath(P, m, `bc`), b) ⇑)
```

**(Emit-IR-Err)**
EmitIRFail(m, P, e)    c = Code(Out-IR-Err)
────────────────────────────────────────────

```text
Γ ⊢ EmitIR(m::ms, P, e) ⇑ c
```

LinkJudg = {AssemblyGraph, ResolveRuntimeLib, BuildLibrariesSeq, BuildLibraries, Link, Archive, Finalize}
RuntimeLibName = RuntimeLibNameFor(SelectedTargetProfile)
CompilerExecutableDir(P) = DirectoryOf(CurrentCompilerExecutable)

```text
LegacySidecarsBeside(d) ⇔ exists(d / `runtime`) ∨ exists(d / `tools`) ∨ exists(d / `bin`) ∨ exists(d / `lib`)
PackagedHostSidecarsBeside(d) ⇔ exists(d / `windows` / `tools`) ∨ exists(d / `windows` / `bin`) ∨ exists(d / `windows` / `lib`) ∨ exists(d / `linux` / `tools`) ∨ exists(d / `linux` / `bin`) ∨ exists(d / `linux` / `lib`)
```

CompilerSupportRoot(P) = CompilerExecutableDir(P)                  if PackagedHostSidecarsBeside(CompilerExecutableDir(P))
 CompilerExecutableDir(P)                                          if LegacySidecarsBeside(CompilerExecutableDir(P))
 Parent(CompilerExecutableDir(P))                                  if LegacySidecarsBeside(Parent(CompilerExecutableDir(P)))
 CompilerExecutableDir(P)                                          otherwise
CompilerRuntimeLibPath(P) = CompilerExecutableDir(P) / RuntimeLibName    if exists(CompilerExecutableDir(P) / RuntimeLibName)
 CompilerSupportRoot(P) / `runtime` / RuntimeLibName                     otherwise
RuntimeLibPath(P) =

```text
 ToolchainConfig(P).runtime_lib  if ToolchainConfig(P).runtime_lib ≠ ⊥
```

 CompilerRuntimeLibPath(P)      otherwise

**(ResolveRuntimeLib-Ok)**

```text
Γ ⊢ ReadBytes(RuntimeLibPath(P)) ⇓ _
```

──────────────────────────────────────────────

```text
Γ ⊢ ResolveRuntimeLib(P) ⇓ RuntimeLibPath(P)
```

**(ResolveRuntimeLib-Err)**

```text
Γ ⊢ ReadBytes(RuntimeLibPath(P)) ⇑
```

─────────────────────────────────

```text
Γ ⊢ ResolveRuntimeLib(P) ⇑
```

**(Build-LibrariesSeq-Empty)**
───────────────────────────────────────

```text
Γ ⊢ BuildLibrariesSeq([], P) ⇓ ok
```

**(Build-LibrariesSeq-Cons)**

```text
Γ ⊢ OutputPipeline(AssemblyProject(P, A)) ⇓ _    Γ ⊢ BuildLibrariesSeq(As, P) ⇓ ok
```

────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ BuildLibrariesSeq(A::As, P) ⇓ ok
```

**(Build-Libraries-Ok)**

```text
LibraryTopo(P) = As    Γ ⊢ BuildLibrariesSeq(As, P) ⇓ ok
```

─────────────────────────────────────────────────────────────

```text
Γ ⊢ BuildLibraries(P) ⇓ ok
```

LinkerSyms : Path × List(Path) × Path ⇀ ℘(Symbol)
RuntimeRequiredSyms = RuntimeSyms

```text
MissingRuntimeSym(t, L, out) ⇔ RuntimeRequiredSyms ⊈ LinkerSyms(t, L, out)
```

LinkObjs(P) = ObjPaths(P, EmitModuleList(P))
LinkMode(P) =
 `exe`     if Executable(P)
 `shared`  if SharedLibrary(P)

```text
 ⊥         otherwise
```

LinkOutputPath(P) =
 ExePath(P)        if Executable(P)
 SharedLibPath(P)  if SharedLibrary(P)

```text
 ⊥                 otherwise
```

LinkImportLibOpt(P) =

```text
 ImportLibPath(P)  if SharedLibrary(P) ∧ EmitsImportLib(SelectedTargetProfile)
 ⊥                 otherwise
```

LinkInputs(P) = LinkObjs(P) ++ LibraryArtifactInputs(P) ++ [RuntimeLibPath(P)]
ArchiveInputs(P) = LinkObjs(P)
LinkFlags(P) = LinkFlagsFor(SelectedTargetProfile, LinkMode(P), LinkOutputPath(P), LinkImportLibOpt(P))
ArchiveFlags(P) = ArchiveFlagsFor(SelectedTargetProfile, StaticLibPath(P))

```text
LinkArgsOk(P, L, out, imp) ⇔ L = LinkInputs(P) ∧ out = LinkOutputPath(P) ∧ imp = LinkImportLibOpt(P) ∧ LinkFlags(P) = LinkFlagsFor(SelectedTargetProfile, LinkMode(P), LinkOutputPath(P), LinkImportLibOpt(P))
ArchiveArgsOk(P, L, out) ⇔ L = ArchiveInputs(P) ∧ out = StaticLibPath(P) ∧ ArchiveFlags(P) = ArchiveFlagsFor(SelectedTargetProfile, StaticLibPath(P))
```

**(Link-Ok)**

```text
Executable(P) ∨ SharedLibrary(P)    Γ ⊢ AssemblyGraph(P) ⇓ ok    Γ ⊢ BuildLibraries(P) ⇓ ok    Γ ⊢ ResolveTool(LinkerToolName(SelectedTargetProfile)) ⇓ t    Γ ⊢ ResolveRuntimeLib(P) ⇓ lib    LinkArgsOk(P, Objs ++ LibraryArtifactInputs(P) ++ [lib], LinkOutputPath(P), LinkImportLibOpt(P))    Γ ⊢ InvokeLinker(t, Objs ++ LibraryArtifactInputs(P) ++ [lib], LinkOutputPath(P), LinkImportLibOpt(P)) ⇓ ok
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Link(Objs, P) ⇓ ok
```

**(Link-NotFound)**

```text
Executable(P) ∨ SharedLibrary(P)    Γ ⊢ AssemblyGraph(P) ⇓ ok    Γ ⊢ BuildLibraries(P) ⇓ ok    Γ ⊢ ResolveTool(LinkerToolName(SelectedTargetProfile)) ⇑    c = Code(Out-Link-NotFound)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Link(Objs, P) ⇑ c
```

**(Link-Runtime-Missing)**

```text
Executable(P) ∨ SharedLibrary(P)    Γ ⊢ AssemblyGraph(P) ⇓ ok    Γ ⊢ BuildLibraries(P) ⇓ ok    Γ ⊢ ResolveTool(LinkerToolName(SelectedTargetProfile)) ⇓ t    Γ ⊢ ResolveRuntimeLib(P) ⇑    c = Code(Out-Link-Runtime-Missing)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Link(Objs, P) ⇑ c
```

**(Link-Runtime-Incompatible)**

```text
Executable(P) ∨ SharedLibrary(P)    Γ ⊢ AssemblyGraph(P) ⇓ ok    Γ ⊢ BuildLibraries(P) ⇓ ok    Γ ⊢ ResolveTool(LinkerToolName(SelectedTargetProfile)) ⇓ t    Γ ⊢ ResolveRuntimeLib(P) ⇓ lib    LinkArgsOk(P, Objs ++ LibraryArtifactInputs(P) ++ [lib], LinkOutputPath(P), LinkImportLibOpt(P))    MissingRuntimeSym(t, Objs ++ LibraryArtifactInputs(P) ++ [lib], LinkOutputPath(P))    c = Code(Out-Link-Runtime-Incompatible)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Link(Objs, P) ⇑ c
```

**(Link-Fail)**

```text
Executable(P) ∨ SharedLibrary(P)    Γ ⊢ AssemblyGraph(P) ⇓ ok    Γ ⊢ BuildLibraries(P) ⇓ ok    Γ ⊢ ResolveTool(LinkerToolName(SelectedTargetProfile)) ⇓ t    Γ ⊢ ResolveRuntimeLib(P) ⇓ lib    LinkArgsOk(P, Objs ++ LibraryArtifactInputs(P) ++ [lib], LinkOutputPath(P), LinkImportLibOpt(P))    ¬ MissingRuntimeSym(t, Objs ++ LibraryArtifactInputs(P) ++ [lib], LinkOutputPath(P))    Γ ⊢ InvokeLinker(t, Objs ++ LibraryArtifactInputs(P) ++ [lib], LinkOutputPath(P), LinkImportLibOpt(P)) ⇑    c = Code(Out-Link-Fail)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Link(Objs, P) ⇑ c
```

**(Archive-Ok)**

```text
StaticLibrary(P)    Γ ⊢ AssemblyGraph(P) ⇓ ok    Γ ⊢ BuildLibraries(P) ⇓ ok    Γ ⊢ ResolveTool(ArchiverToolName(SelectedTargetProfile)) ⇓ t    ArchiveArgsOk(P, Objs, StaticLibPath(P))    Γ ⊢ InvokeArchiver(t, Objs, StaticLibPath(P)) ⇓ ok
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Archive(Objs, P) ⇓ ok
```

**(Archive-NotFound)**

```text
StaticLibrary(P)    Γ ⊢ AssemblyGraph(P) ⇓ ok    Γ ⊢ BuildLibraries(P) ⇓ ok    Γ ⊢ ResolveTool(ArchiverToolName(SelectedTargetProfile)) ⇑    c = Code(Out-Link-NotFound)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Archive(Objs, P) ⇑ c
```

**(Archive-Fail)**

```text
StaticLibrary(P)    Γ ⊢ AssemblyGraph(P) ⇓ ok    Γ ⊢ BuildLibraries(P) ⇓ ok    Γ ⊢ ResolveTool(ArchiverToolName(SelectedTargetProfile)) ⇓ t    ArchiveArgsOk(P, Objs, StaticLibPath(P))    Γ ⊢ InvokeArchiver(t, Objs, StaticLibPath(P)) ⇑    c = Code(Out-Link-Fail)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Archive(Objs, P) ⇑ c
```

**(Finalize-Link)**

```text
Executable(P) ∨ SharedLibrary(P)    Γ ⊢ Link(Objs, P) ⇓ ok
```

───────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Finalize(Objs, P) ⇓ ok
```

**(Finalize-Archive)**

```text
StaticLibrary(P)    Γ ⊢ Archive(Objs, P) ⇓ ok
```

───────────────────────────────────────────────────────────

```text
Γ ⊢ Finalize(Objs, P) ⇓ ok
```

**Output Pipeline (Big-Step)**
O = OutputRoot(P)
ms = EmitModuleList(P)
e = P.assembly.emit_ir

**(Output-Pipeline-Linkable)**

```text
Linkable(P)    Γ ⊢ EnsureDir(O) ⇓ ok    Γ ⊢ EnsureDir(O / `obj`) ⇓ ok    (¬ UsesBinDir(P) ∨ Γ ⊢ EnsureDir(O / `bin`) ⇓ ok)    (¬ UsesLibDir(P) ∨ Γ ⊢ EnsureDir(O / `lib`) ⇓ ok)    (e = `none` ∨ Γ ⊢ EnsureDir(O / `ir`) ⇓ ok)    Γ ⊢ EmitObjects(ms, P) ⇓ Objs    Γ ⊢ EmitIR(ms, P, e) ⇓ IRs    Γ ⊢ Finalize(Objs, P) ⇓ ok
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ OutputPipeline(P) ⇓ (Objs, IRs, PrimaryArtifact(P))
```

**(Output-Pipeline-Dependency)**

```text
Dependency(P)    Γ ⊢ EnsureDir(O) ⇓ ok    Γ ⊢ EnsureDir(O / `obj`) ⇓ ok    (e = `none` ∨ Γ ⊢ EnsureDir(O / `ir`) ⇓ ok)    Γ ⊢ EmitObjects(ms, P) ⇓ Objs    Γ ⊢ EmitIR(ms, P, e) ⇓ IRs
```

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ OutputPipeline(P) ⇓ (Objs, IRs, ⊥)
```

**(Output-Pipeline-Err)**

```text
⟨OutStart(P)⟩ →* ⟨Error(c)⟩
```

────────────────────────────────

```text
Γ ⊢ OutputPipeline(P) ⇑ c
```

**Output Pipeline (Small-Step)**
OutState = {OutStart(P), OutDirs(P), OutObjs(P, ms, Objs), OutIR(P, ms, Objs, IRs, e), OutFinal(P, Objs, IRs), OutDone(Objs, IRs, Artifact), Error(code)}
O = OutputRoot(P)
ms = EmitModuleList(P)
e = P.assembly.emit_ir

**(Out-Start)**
────────────────────────────────────────

```text
⟨OutStart(P)⟩ → ⟨OutDirs(P)⟩
```

**(Out-Dirs-Ok)**

```text
Γ ⊢ EnsureDir(O) ⇓ ok    Γ ⊢ EnsureDir(O / `obj`) ⇓ ok    (¬ UsesBinDir(P) ∨ Γ ⊢ EnsureDir(O / `bin`) ⇓ ok)    (¬ UsesLibDir(P) ∨ Γ ⊢ EnsureDir(O / `lib`) ⇓ ok)    (e = `none` ∨ Γ ⊢ EnsureDir(O / `ir`) ⇓ ok)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨OutDirs(P)⟩ → ⟨OutObjs(P, ms, [])⟩
```

**(Out-Dirs-Err)**

```text
Γ ⊢ EnsureDir(O) ⇑ ∨ Γ ⊢ EnsureDir(O / `obj`) ⇑ ∨ (UsesBinDir(P) ∧ Γ ⊢ EnsureDir(O / `bin`) ⇑) ∨ (UsesLibDir(P) ∧ Γ ⊢ EnsureDir(O / `lib`) ⇑) ∨ (e ∈ {`ll`, `bc`} ∧ Γ ⊢ EnsureDir(O / `ir`) ⇑)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨OutDirs(P)⟩ → ⟨Error(Code(Out-Dirs-Err))⟩
```

**(Out-Obj-Collision)**

```text
¬ Distinct(L ++ ObjPaths(P, ms))
```

──────────────────────────────────────────────

```text
⟨OutObjs(P, ms, L)⟩ → ⟨Error(Code(Out-Obj-Collision))⟩
```

**(Out-Obj-Cons)**

```text
Γ ⊢ CodegenObj(m) ⇓ b    Γ ⊢ WriteFile(ObjPath(P, m), b) ⇓ ok
```

─────────────────────────────────────────────────────────────────────────────

```text
⟨OutObjs(P, m::ms, L)⟩ → ⟨OutObjs(P, ms, L ++ [ObjPath(P, m)])⟩
```

**(Out-Obj-Err)**

```text
Γ ⊢ CodegenObj(m) ⇑ ∨ (Γ ⊢ CodegenObj(m) ⇓ b ∧ Γ ⊢ WriteFile(ObjPath(P, m), b) ⇑)
```

──────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨OutObjs(P, m::ms, L)⟩ → ⟨Error(Code(Out-Obj-Err))⟩
```

**(Out-Obj-Done)**
────────────────────────────────────────────────────────────────────

```text
⟨OutObjs(P, [], L)⟩ → ⟨OutIR(P, EmitModuleList(P), L, [], e)⟩
```

**(Out-IR-None-Finalize)**
e = `none`    Linkable(P)
──────────────────────────────────────────────────────────────────────

```text
⟨OutIR(P, ms, Objs, IRs, e)⟩ → ⟨OutFinal(P, Objs, IRs)⟩
```

**(Out-IR-None-NoFinalize)**
e = `none`    Dependency(P)
────────────────────────────────────────────────────────────────────────

```text
⟨OutIR(P, ms, Objs, IRs, e)⟩ → ⟨OutDone(Objs, IRs, ⊥)⟩
```

**(Out-IR-Collision)**

```text
e ∈ {`ll`, `bc`}    ¬ Distinct(IRs ++ IRPaths(P, ms, e))
```

──────────────────────────────────────────────────────────────────────────────

```text
⟨OutIR(P, ms, Objs, IRs, e)⟩ → ⟨Error(Code(Out-IR-Collision))⟩
```

**(Out-IR-Cons-LL)**

```text
e = `ll`    Γ ⊢ CodegenIR(m, e) ⇓ b    Γ ⊢ WriteFile(IRPath(P, m, e), b) ⇓ ok
```

────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨OutIR(P, m::ms, Objs, IRs, e)⟩ → ⟨OutIR(P, ms, Objs, IRs ++ [IRPath(P, m, e)], e)⟩
```

**(Out-IR-Cons-BC)**

```text
e = `bc`    Γ ⊢ CodegenIR(m, `ll`) ⇓ t    Γ ⊢ ResolveTool(`llvm-as`) ⇓ a    Γ ⊢ AssembleIR(a, t) ⇓ b    Γ ⊢ WriteFile(IRPath(P, m, e), b) ⇓ ok
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨OutIR(P, m::ms, Objs, IRs, e)⟩ → ⟨OutIR(P, ms, Objs, IRs ++ [IRPath(P, m, e)], e)⟩
```

**(Out-IR-Err)**

```text
(e = `ll` ∧ (Γ ⊢ CodegenIR(m, e) ⇑ ∨ (Γ ⊢ CodegenIR(m, e) ⇓ b ∧ Γ ⊢ WriteFile(IRPath(P, m, e), b) ⇑))) ∨
(e = `bc` ∧ (Γ ⊢ CodegenIR(m, `ll`) ⇑ ∨ (Γ ⊢ CodegenIR(m, `ll`) ⇓ t ∧ Γ ⊢ ResolveTool(`llvm-as`) ⇑) ∨ (Γ ⊢ CodegenIR(m, `ll`) ⇓ t ∧ Γ ⊢ ResolveTool(`llvm-as`) ⇓ a ∧ Γ ⊢ AssembleIR(a, t) ⇑) ∨ (Γ ⊢ CodegenIR(m, `ll`) ⇓ t ∧ Γ ⊢ ResolveTool(`llvm-as`) ⇓ a ∧ Γ ⊢ AssembleIR(a, t) ⇓ b ∧ Γ ⊢ WriteFile(IRPath(P, m, e), b) ⇑)))
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨OutIR(P, m::ms, Objs, IRs, e)⟩ → ⟨Error(Code(Out-IR-Err))⟩
```

**(Out-IR-Done-Finalize)**

```text
e ∈ {`ll`, `bc`}    ms = []    Linkable(P)
```

──────────────────────────────────────────────────────────────────────────────

```text
⟨OutIR(P, ms, Objs, IRs, e)⟩ → ⟨OutFinal(P, Objs, IRs)⟩
```

**(Out-IR-Done-NoFinalize)**

```text
e ∈ {`ll`, `bc`}    ms = []    Dependency(P)
```

────────────────────────────────────────────────────────────────────────────────

```text
⟨OutIR(P, ms, Objs, IRs, e)⟩ → ⟨OutDone(Objs, IRs, ⊥)⟩
```

**(Out-Final-Link-Ok)**

```text
Executable(P) ∨ SharedLibrary(P)    Γ ⊢ Link(Objs, P) ⇓ ok
```

───────────────────────────────────────────────────────────────────────────────

```text
⟨OutFinal(P, Objs, IRs)⟩ → ⟨OutDone(Objs, IRs, PrimaryArtifact(P))⟩
```

**(Out-Final-Link-Err)**

```text
Executable(P) ∨ SharedLibrary(P)    Γ ⊢ Link(Objs, P) ⇑ c
```

────────────────────────────────────────────────────────────────────────

```text
⟨OutFinal(P, Objs, IRs)⟩ → ⟨Error(c)⟩
```

**(Out-Final-Archive-Ok)**

```text
StaticLibrary(P)    Γ ⊢ Archive(Objs, P) ⇓ ok
```

───────────────────────────────────────────────────────────

```text
⟨OutFinal(P, Objs, IRs)⟩ → ⟨OutDone(Objs, IRs, PrimaryArtifact(P))⟩
```

**(Out-Final-Archive-Err)**

```text
StaticLibrary(P)    Γ ⊢ Archive(Objs, P) ⇑ c
```

──────────────────────────────────────────────────────

```text
⟨OutFinal(P, Objs, IRs)⟩ → ⟨Error(c)⟩
```

### 3.7 Tool Resolution and IR Assembly Inputs

SearchDirs(P) =

```text
 [ToolchainConfig(P).llvm_bin]  if ToolchainConfig(P).llvm_bin ≠ ⊥
```

 [CompilerToolBinDir(P)]        if exists(CompilerToolBinDir(P))
 PATHDirs  otherwise

```text
CompilerToolBinDir(P) = CompilerSupportRoot(P) / `windows` / `tools`    if ObjectFormatOf(P) = Coff ∧ PackagedHostSidecarsBeside(CompilerSupportRoot(P))
 CompilerSupportRoot(P) / `linux` / `tools`                             if ObjectFormatOf(P) = Elf ∧ PackagedHostSidecarsBeside(CompilerSupportRoot(P))
```

 CompilerSupportRoot(P) / `tools`                                       otherwise

ToolVersion(t) = v    where invoking t with `--version` reports v

**(ResolveTool-Ok)**

```text
Project(Γ) = P    SearchDirs(P) contains x at t    (x = `llvm-as` ⇒ ToolVersion(t) = LLVMToolchain)
```

───────────────────────────────────────────────

```text
Γ ⊢ ResolveTool(x) ⇓ t
```

**(ResolveTool-Err-Linker)**

```text
Project(Γ) = P    x = LinkerToolName(SelectedTargetProfile)    SearchDirs(P) does not contain x
```

─────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveTool(x) ⇑
```

**(ResolveTool-Err-Archiver)**

```text
Project(Γ) = P    x = ArchiverToolName(SelectedTargetProfile)    SearchDirs(P) does not contain x
```

──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveTool(x) ⇑
```

**(ResolveTool-Err-IR)**

```text
Project(Γ) = P    x = `llvm-as`    ¬∃ t. SearchDirs(P) contains x at t ∧ ToolVersion(t) = LLVMToolchain
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ResolveTool(x) ⇑
```

**(AssembleIR-Ok)**

```text
Invoke(a, t) ⇓ b
```

────────────────────────

```text
Γ ⊢ AssembleIR(a, t) ⇓ b
```

**(AssembleIR-Err)**

```text
Invoke(a, t) ⇑
```

────────────────────────

```text
Γ ⊢ AssembleIR(a, t) ⇑
```

### 3.8 Project Diagnostics

This section owns the manifest, assembly-selection, source-root, deterministic-ordering, and project-discovery diagnostics defined by the project-loading rules in Chapter 3.

| Code         | Severity | Detection    | Condition                                                                                    |
| ------------ | -------- | ------------ | -------------------------------------------------------------------------------------------- |
| `E-PRJ-0101` | Error    | Compile-time | `Ultraviolet.toml` not found at project root                                                 |
| `E-PRJ-0102` | Error    | Compile-time | `Ultraviolet.toml` is not valid TOML                                                         |
| `E-PRJ-0103` | Error    | Compile-time | Missing required `assembly` table, empty assembly list, required keys, or required key type  |
| `E-PRJ-0104` | Error    | Compile-time | Unknown key in `assembly` table or unknown top-level key                                     |
| `E-PRJ-0110` | Error    | Compile-time | Invalid `[toolchain]` section in manifest                                                    |
| `E-PRJ-0111` | Error    | Compile-time | Invalid `[build]` section in manifest                                                        |
| `E-PRJ-0112` | Error    | Compile-time | No target profile was selected by CLI override or `[toolchain].target_profile`               |
| `E-PRJ-0201` | Error    | Compile-time | `assembly.kind` is not in `{ "executable", "library", "dependency" }`                        |
| `E-PRJ-0202` | Error    | Compile-time | Duplicate `assembly.name` values                                                             |
| `E-PRJ-0203` | Error    | Compile-time | `assembly.name` is not a valid identifier                                                    |
| `E-PRJ-0204` | Error    | Compile-time | `emit_ir` has invalid value or type                                                          |
| `E-PRJ-0205` | Error    | Compile-time | Assembly selection failed (missing target or target not found)                               |
| `E-PRJ-0206` | Error    | Compile-time | Ambiguous assembly root ownership for overlapping source roots                               |
| `E-PRJ-0207` | Error    | Compile-time | `link_kind` has invalid value or type                                                        |
| `E-PRJ-0208` | Error    | Compile-time | `link_kind` is only valid when `assembly.kind = "library"`                                   |
| `E-PRJ-0209` | Error    | Compile-time | Assembly dependency graph imports an executable or contains a cycle through linked libraries |
| `E-PRJ-0210` | Error    | Compile-time | Hosted library imports another linked library assembly                                       |
| `E-PRJ-0301` | Error    | Compile-time | `assembly.root` or `out_dir` has invalid type, is absolute, or resolves outside root         |
| `E-PRJ-0302` | Error    | Compile-time | `assembly.root` does not exist or is not a directory                                         |
| `E-PRJ-0303` | Error    | Compile-time | Relative path derivation failed during deterministic ordering (file or directory)            |
| `E-PRJ-0304` | Error    | Compile-time | Path canonicalization or module path derivation failed due to filesystem error               |
| `E-PRJ-0305` | Error    | Compile-time | Directory enumeration failed during module discovery                                         |
