---
title: "Project and Compilation Model"
description: "3. Project and Compilation Model of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
generatedAt: "2026-05-14T00:55:03.609Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>


## 3.1 Core Project Records

$$
\begin{array}{l}
\mathsf{AssemblyKind}\ =\ \{\texttt{executable},\ \texttt{library},\ \texttt{dependency}\} \\[0.16em]
\mathsf{LinkKind}\ =\ \{\texttt{shared},\ \texttt{static}\}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{Project}\ =\ \langle \mathsf{root},\ \mathsf{assemblies},\ \mathsf{assembly},\ \mathsf{source}_{\mathsf{root}},\ \mathsf{outputs},\ \mathsf{modules},\ \mathsf{toolchain},\ \mathsf{build}\rangle  \\[0.16em]
\operatorname{Assemblies}(P)\ =\ P.\mathsf{assemblies} \\[0.16em]
\operatorname{Assembly}(P)\ =\ P.\mathsf{assembly} \\[0.16em]
\operatorname{AsmNames}(P)\ =\ [A.\mathsf{name}\ \mid \ A\ \in \ \operatorname{Assemblies}(P)] \\[0.16em]
\operatorname{AsmByName}(P,\ n)\ =\ A\ \Leftrightarrow \ A\ \in \ \operatorname{Assemblies}(P)\ \land \ A.\mathsf{name}\ =\ n\ \land \ (\forall \ B\ \in \ \operatorname{Assemblies}(P).\ B.\mathsf{name}\ =\ n\ \Rightarrow \ B\ =\ A)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Executable}(P)\ \Leftrightarrow \ P.\mathsf{assembly}.\mathsf{kind}\ =\ \texttt{executable} \\[0.16em]
\operatorname{Library}(P)\ \Leftrightarrow \ P.\mathsf{assembly}.\mathsf{kind}\ =\ \texttt{library} \\[0.16em]
\operatorname{Dependency}(P)\ \Leftrightarrow \ P.\mathsf{assembly}.\mathsf{kind}\ =\ \texttt{dependency} \\[0.16em]
\operatorname{Linkable}(P)\ \Leftrightarrow \ \operatorname{Executable}(P)\ \lor \ \operatorname{Library}(P) \\[0.16em]
\operatorname{SharedLibrary}(P)\ \Leftrightarrow \ \operatorname{Library}(P)\ \land \ P.\mathsf{assembly}.\mathsf{link}_{\mathsf{kind}}\ =\ \texttt{shared} \\[0.16em]
\operatorname{StaticLibrary}(P)\ \Leftrightarrow \ \operatorname{Library}(P)\ \land \ P.\mathsf{assembly}.\mathsf{link}_{\mathsf{kind}}\ =\ \texttt{static}
\end{array}
$$

**Build/Project Validation Scope.**

$$
\begin{array}{l}
\mathsf{Phase0Checks}\ =\ \operatorname{RulesIn}(\{\texttt{"3"}\}) \\[0.16em]
\mathsf{SourceChecks}\ =\ \operatorname{RulesIn}(\{\texttt{"4"},\ \texttt{"5"},\ \texttt{"6"},\ \texttt{"7"},\ \texttt{"8"},\ \texttt{"9"},\ \texttt{"10"},\ \texttt{"11"},\ \texttt{"12"},\ \texttt{"13"},\ \texttt{"14"},\ \texttt{"15"},\ \texttt{"16"},\ \texttt{"17"},\ \texttt{"18"},\ \texttt{"19"},\ \texttt{"20"},\ \texttt{"21"},\ \texttt{"22"},\ \texttt{"23"}\}) \\[0.16em]
\mathsf{Phase0Checks}\ \cap \ \mathsf{SourceChecks}\ =\ \emptyset 
\end{array}
$$

**Command-Line Output.**

$$
\begin{array}{l}
\operatorname{DumpProject}(P,\ \mathsf{dump})\ = \\[0.16em]
\ \operatorname{ProjectSummary}(P)\ \mathbin{++} \ \operatorname{OutputSummary}(P)\ \mathbin{++} \ \operatorname{LinkOutputSummary}(P)\ \mathsf{if}\ \mathsf{dump}\ =\ \mathsf{false} \\[0.16em]
\ \operatorname{ProjectSummary}(P)\ \mathbin{++} \ \operatorname{OutputSummary}(P)\ \mathbin{++} \ \operatorname{LinkOutputSummary}(P)\ \mathbin{++} \ [\texttt{"file:"}\ \mathbin{++} \ f\ \mid \ A\ \in \ \operatorname{EmitAssemblies}(P),\ m\ \in \ A.\mathsf{modules},\ d\ =\ \operatorname{ModuleDirOf}(m,\ A.\mathsf{source}_{\mathsf{root}}),\ f\ \in \ \operatorname{CompilationUnit}(d)]\ \mathsf{if}\ \mathsf{dump}\ =\ \mathsf{true}
\end{array}
$$

$$
\operatorname{ProjectSummary}(P)\ =\ [\langle \texttt{project\_root},\ P.\mathsf{root}\rangle ,\ \langle \texttt{assemblies},\ \operatorname{AsmNames}(P)\rangle ,\ \langle \texttt{assembly\_name},\ P.\mathsf{assembly}.\mathsf{name}\rangle ,\ \langle \texttt{assembly\_kind},\ P.\mathsf{assembly}.\mathsf{kind}\rangle ,\ \langle \texttt{link\_kind},\ P.\mathsf{assembly}.\mathsf{link}_{\mathsf{kind}}\rangle ,\ \langle \texttt{source\_root},\ P.\mathsf{source}_{\mathsf{root}}\rangle ,\ \langle \texttt{output\_root},\ \operatorname{OutputRoot}(P)\rangle ,\ \langle \texttt{module\_list},\ \operatorname{ModuleList}(P)\rangle ]
$$

$$
\operatorname{OutputSummary}(P)\ =\ [\langle \texttt{module},\ m,\ \texttt{obj},\ \operatorname{ObjPath}(P,\ m),\ \texttt{ir},\ \operatorname{IROpt}(P,\ m)\rangle \ \mid \ m\ \in \ \operatorname{EmitModuleList}(P)]
$$

$$
\begin{array}{l}
\operatorname{LinkOutputSummary}(P)\ = \\[0.16em]
\ [\langle \texttt{artifact},\ \operatorname{PrimaryArtifact}(P),\ \texttt{import\_lib},\ \operatorname{ImportLibOpt}(P)\rangle ]\ \mathsf{if}\ \operatorname{Linkable}(P) \\[0.16em]
\ []\quad \mathsf{otherwise}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{IROpt}(P,\ m)\ = \\[0.16em]
\ \operatorname{IRPath}(P,\ m,\ P.\mathsf{assembly}.\mathsf{emit}_{\mathsf{ir}})\ \mathsf{if}\ P.\mathsf{assembly}.\mathsf{emit}_{\mathsf{ir}}\ \ne \ \texttt{none} \\[0.16em]
\ \bot \quad \mathsf{if}\ P.\mathsf{assembly}.\mathsf{emit}_{\mathsf{ir}}\ =\ \texttt{none}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ImportLibOpt}(P)\ = \\[0.16em]
\ \operatorname{ImportLibPath}(P)\ \mathsf{if}\ \operatorname{ImportLibPath}(P)\ \ne \ \bot  \\[0.16em]
\ \bot \quad \mathsf{otherwise}
\end{array}
$$

**Command-Line Diagnostics.**
This table owns diagnostics emitted by `uv` command parsing and command-output failure handling before a project-specific diagnostic owner applies.

| Code         | Severity | Detection    | Condition                                    |
| ------------ | -------- | ------------ | -------------------------------------------- |
| `E-CLI-0001` | Error    | Command-line | Unknown `uv` command                         |
| `E-CLI-0002` | Error    | Command-line | Compiler pipeline unavailable for command    |
| `E-CLI-0003` | Error    | Command-line | Failed to write command output or diagnostic |

## 3.2 Project Root and Manifest

**Manifest Parsing (Big-Step)**

$$
\mathsf{ParseTOML}\ :\ \mathsf{Path}\ \rightharpoonup \ \mathsf{TOMLTable}
$$

**(Parse-Manifest-Ok)**

$$
\begin{array}{l}
\operatorname{ParseTOML}(R/\texttt{Ultraviolet.toml})\ \Downarrow \ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseManifest}(R)\ \Downarrow \ T
\end{array}
$$

**(Parse-Manifest-Missing)**

$$
\begin{array}{l}
\lnot \ \operatorname{exists}(R/\texttt{Ultraviolet.toml})\quad c\ =\ \operatorname{Code}(\mathsf{Parse}-\mathsf{Manifest}-\mathsf{Missing}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseManifest}(R)\ \Uparrow \ c
\end{array}
$$

**(Parse-Manifest-Err)**

$$
\begin{array}{l}
\operatorname{ParseTOML}(R/\texttt{Ultraviolet.toml})\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{Parse}-\mathsf{Manifest}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseManifest}(R)\ \Uparrow \ c
\end{array}
$$

**Manifest Required (No Single-File Fallback).**
If Γ ⊢ ParseManifest(R) ⇑ c, then Γ ⊢ LoadProject(R, target) ⇑ c and the implementation MUST NOT attempt any single-file or heuristic fallback project construction.

**Manifest Path Resolution.**
Manifest lookup MUST use host filesystem path resolution semantics for R/`Ultraviolet.toml` and MUST NOT perform additional case verification.

**Project-Root Discovery From Command-Line Input.**
When project loading begins from one command-line input path `p`, the implementation MUST first resolve any relative `p` against the host current working directory before searching upward for `Ultraviolet.toml`. If that resolved path denotes an existing non-directory, the upward search MUST begin from its parent directory; otherwise the upward search MUST begin from the resolved path itself. `FindProjectRoot(p)` is the nearest searched directory `R` such that `exists(R/`Ultraviolet.toml`)`; if no searched directory satisfies that predicate, `FindProjectRoot(p)` is the search-start directory.

**Manifest Schema**
n = t.name
k = t.kind
r = t.root

$$
\begin{array}{l}
o\ =\ t.\mathsf{out}_{\mathsf{dir}} \\[0.16em]
e\ =\ t.\mathsf{emit}_{\mathsf{ir}} \\[0.16em]
l\ =\ t.\mathsf{link}_{\mathsf{kind}}
\end{array}
$$

**(WF-Assembly-Name)**

$$
\begin{array}{l}
\Gamma \ \vdash \ n\ :\ \mathsf{Identifier}\quad \Gamma \ \vdash \ n\ :\ \mathsf{NotKeyword} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ n\ :\ \mathsf{Name}
\end{array}
$$

**(WF-Assembly-Name-Err)**

$$
\begin{array}{l}
\lnot (\Gamma \ \vdash \ n\ :\ \mathsf{Identifier}\ \land \ \Gamma \ \vdash \ n\ :\ \mathsf{NotKeyword})\quad c\ =\ \operatorname{Code}(\mathsf{WF}-\mathsf{Assembly}-\mathsf{Name}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ n\ :\ \mathsf{Name}\ \Uparrow \ c
\end{array}
$$

**(WF-Assembly-Kind)**

$$
\begin{array}{l}
k\ \in \ \mathsf{AssemblyKind} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ k\ :\ \mathsf{Kind}
\end{array}
$$

**(WF-Assembly-Kind-Err)**

$$
\begin{array}{l}
k\ \notin \ \mathsf{AssemblyKind}\quad c\ =\ \operatorname{Code}(\mathsf{WF}-\mathsf{Assembly}-\mathsf{Kind}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ k\ :\ \mathsf{Kind}\ \Uparrow \ c
\end{array}
$$

**(WF-Assembly-Root-Path)**

$$
\begin{array}{l}
\Gamma \ \vdash \ r\ :\ \mathsf{RelPath} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ r\ :\ \mathsf{RootPath}
\end{array}
$$

**(WF-Assembly-Root-Path-Err)**

$$
\begin{array}{l}
\lnot (\Gamma \ \vdash \ r\ :\ \mathsf{RelPath})\quad c\ =\ \operatorname{Code}(\mathsf{WF}-\mathsf{Assembly}-\mathsf{Root}-\mathsf{Path}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ r\ :\ \mathsf{RootPath}\ \Uparrow \ c
\end{array}
$$

**(WF-Assembly-OutDir-Path)**

$$
\begin{array}{l}
o\ =\ \bot \ \lor \ \Gamma \ \vdash \ o\ :\ \mathsf{RelPath} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ o\ :\ \mathsf{OutDirPath}
\end{array}
$$

**(WF-Assembly-OutDir-Path-Err)**

$$
\begin{array}{l}
o\ \ne \ \bot \quad \lnot (\Gamma \ \vdash \ o\ :\ \mathsf{RelPath})\quad c\ =\ \operatorname{Code}(\mathsf{WF}-\mathsf{Assembly}-\mathsf{OutDir}-\mathsf{Path}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ o\ :\ \mathsf{OutDirPath}\ \Uparrow \ c
\end{array}
$$

**(WF-Assembly-EmitIR)**

$$
\begin{array}{l}
e\ \in \ \{\bot ,\ \texttt{none},\ \texttt{ll},\ \texttt{bc}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ e\ :\ \mathsf{EmitIR}
\end{array}
$$

**(WF-Assembly-EmitIR-Err)**

$$
\begin{array}{l}
e\ \notin \ \{\bot ,\ \texttt{none},\ \texttt{ll},\ \texttt{bc}\}\quad c\ =\ \operatorname{Code}(\mathsf{WF}-\mathsf{Assembly}-\mathsf{EmitIR}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ e\ :\ \mathsf{EmitIR}\ \Uparrow \ c
\end{array}
$$

$$
\begin{array}{l}
\operatorname{AsmLinkKind}(k,\ l)\ = \\[0.16em]
\ \texttt{shared}\ \mathsf{if}\ k\ =\ \texttt{library}\ \land \ l\ =\ \bot  \\[0.16em]
\ l\quad \mathsf{if}\ k\ =\ \texttt{library}\ \land \ l\ \in \ \mathsf{LinkKind} \\[0.16em]
\ \bot \quad \mathsf{otherwise}
\end{array}
$$

**Manifest Validation (Big-Step)**

$$
\begin{array}{l}
\operatorname{Keys}(T)\ =\ \operatorname{Dom}(T) \\[0.16em]
\operatorname{AsmField}(T)\ =\ T[\texttt{assembly}] \\[0.16em]
\operatorname{AsmTables}(T)\ = \\[0.16em]
\ [\operatorname{AsmField}(T)]\ \mathsf{if}\ \operatorname{IsTable}(\operatorname{AsmField}(T)) \\[0.16em]
\ \operatorname{AsmField}(T)\quad \mathsf{if}\ \operatorname{IsArrayTable}(\operatorname{AsmField}(T)) \\[0.16em]
\ \bot \quad \mathsf{otherwise}
\end{array}
$$

$$
\mathsf{TopKeys}\ =\ \{\texttt{"assembly"},\ \texttt{"toolchain"},\ \texttt{"build"}\}
$$

**(WF-TopKeys)**

$$
\begin{array}{l}
\operatorname{Keys}(T)\ \subseteq \ \mathsf{TopKeys} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{TopKeys}
\end{array}
$$

**(WF-TopKeys-Err)**

$$
\begin{array}{l}
\lnot (\operatorname{Keys}(T)\ \subseteq \ \mathsf{TopKeys})\quad c\ =\ \operatorname{Code}(\mathsf{WF}-\mathsf{TopKeys}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{TopKeys}\ \Uparrow \ c
\end{array}
$$

**(WF-Assembly-Table)**

$$
\begin{array}{l}
\operatorname{AsmTables}(T)\ \ne \ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{AssemblyTable}
\end{array}
$$

**(WF-Assembly-Table-Err)**

$$
\begin{array}{l}
\operatorname{AsmTables}(T)\ =\ \bot \quad c\ =\ \operatorname{Code}(\mathsf{WF}-\mathsf{Assembly}-\mathsf{Table}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{AssemblyTable}\ \Uparrow \ c
\end{array}
$$

**(WF-Assembly-Count)**

$$
\begin{array}{l}
\operatorname{AsmTables}(T)\ =\ \mathsf{Ts}\quad \mid \mathsf{Ts}\mid \ \ge \ 1 \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{AssemblyCount}
\end{array}
$$

**(WF-Assembly-Count-Err)**

$$
\begin{array}{l}
\operatorname{AsmTables}(T)\ =\ \mathsf{Ts}\quad \mid \mathsf{Ts}\mid \ =\ 0\quad c\ =\ \operatorname{Code}(\mathsf{WF}-\mathsf{Assembly}-\mathsf{Count}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{AssemblyCount}\ \Uparrow \ c
\end{array}
$$

**(WF-Assembly-Name-Dup)**

$$
\begin{array}{l}
\operatorname{AsmTables}(T)\ =\ \mathsf{Ts}\quad \operatorname{Distinct}([t.\mathsf{name}\ \mid \ t\ \in \ \mathsf{Ts}]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{AssemblyNames}
\end{array}
$$

**(WF-Assembly-Name-Dup-Err)**

$$
\begin{array}{l}
\operatorname{AsmTables}(T)\ =\ \mathsf{Ts}\quad \lnot \ \operatorname{Distinct}([t.\mathsf{name}\ \mid \ t\ \in \ \mathsf{Ts}])\quad c\ =\ \operatorname{Code}(\mathsf{WF}-\mathsf{Assembly}-\mathsf{Name}-\mathsf{Dup}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{AssemblyNames}\ \Uparrow \ c
\end{array}
$$

$$
\begin{array}{l}
\mathsf{Req}\ =\ \{\texttt{name},\ \texttt{kind},\ \texttt{root}\} \\[0.16em]
\mathsf{Opt}\ =\ \{\texttt{out\_dir},\ \texttt{emit\_ir},\ \texttt{link\_kind}\}
\end{array}
$$

**(WF-Assembly-Keys)**

$$
\begin{array}{l}
\operatorname{Keys}(t)\ \subseteq \ (\mathsf{Req}\ \cup \ \mathsf{Opt}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ t\ :\ \mathsf{KnownKeys}
\end{array}
$$

**(WF-Assembly-Keys-Err)**

$$
\begin{array}{l}
\lnot (\operatorname{Keys}(t)\ \subseteq \ (\mathsf{Req}\ \cup \ \mathsf{Opt}))\quad c\ =\ \operatorname{Code}(\mathsf{WF}-\mathsf{Assembly}-\mathsf{Keys}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ t\ :\ \mathsf{KnownKeys}\ \Uparrow \ c
\end{array}
$$

**(WF-Assembly-Required-Types)**

$$
\begin{array}{l}
\forall \ k\ \in \ \mathsf{Req}.\ \operatorname{IsString}(t[k]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ t\ :\ \mathsf{ReqTypes}
\end{array}
$$

**(WF-Assembly-Required-Types-Err)**

$$
\begin{array}{l}
\exists \ k\ \in \ \mathsf{Req}.\ t[k]\ =\ \bot \ \lor \ \lnot \ \operatorname{IsString}(t[k])\quad c\ =\ \operatorname{Code}(\mathsf{WF}-\mathsf{Assembly}-\mathsf{Required}-\mathsf{Types}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ t\ :\ \mathsf{ReqTypes}\ \Uparrow \ c
\end{array}
$$

**(WF-Assembly-Optional-Types)**

$$
\begin{array}{l}
t[\texttt{out\_dir}]\ \in \ \{\mathsf{string},\ \bot \} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ t\ :\ \mathsf{OutDirType}
\end{array}
$$

**(WF-Assembly-OutDirType-Err)**

$$
\begin{array}{l}
t[\texttt{out\_dir}]\ \notin \ \{\mathsf{string},\ \bot \}\quad c\ =\ \operatorname{Code}(\mathsf{WF}-\mathsf{Assembly}-\mathsf{OutDirType}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ t\ :\ \mathsf{OutDirType}\ \Uparrow \ c
\end{array}
$$

$$
\begin{array}{l}
t[\texttt{emit\_ir}]\ \in \ \{\mathsf{string},\ \bot \} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ t\ :\ \mathsf{EmitIRType}
\end{array}
$$

**(WF-Assembly-EmitIRType-Err)**

$$
\begin{array}{l}
t[\texttt{emit\_ir}]\ \notin \ \{\mathsf{string},\ \bot \}\quad c\ =\ \operatorname{Code}(\mathsf{WF}-\mathsf{Assembly}-\mathsf{EmitIRType}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ t\ :\ \mathsf{EmitIRType}\ \Uparrow \ c
\end{array}
$$

$$
\begin{array}{l}
t[\texttt{link\_kind}]\ \in \ \{\mathsf{string},\ \bot \} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ t\ :\ \mathsf{LinkKindType}
\end{array}
$$

**(WF-Assembly-LinkKindType-Err)**

$$
\begin{array}{l}
t[\texttt{link\_kind}]\ \notin \ \{\mathsf{string},\ \bot \}\quad c\ =\ \operatorname{Code}(\mathsf{WF}-\mathsf{Assembly}-\mathsf{LinkKindType}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ t\ :\ \mathsf{LinkKindType}\ \Uparrow \ c
\end{array}
$$

**(WF-Assembly-LinkKind)**

$$
\begin{array}{l}
(t.\mathsf{kind}\ =\ \texttt{library}\ \land \ t.\mathsf{link}_{\mathsf{kind}}\ \in \ \{\bot ,\ \texttt{shared},\ \texttt{static}\})\ \lor \ (t.\mathsf{kind}\ \in \ \{\texttt{executable},\ \texttt{dependency}\}\ \land \ t.\mathsf{link}_{\mathsf{kind}}\ =\ \bot ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ t\ :\ \mathsf{LinkKindField}
\end{array}
$$

**(WF-Assembly-LinkKind-Err)**

$$
\begin{array}{l}
t.\mathsf{kind}\ =\ \texttt{library}\quad t.\mathsf{link}_{\mathsf{kind}}\ \notin \ \{\bot ,\ \texttt{shared},\ \texttt{static}\}\quad c\ =\ \operatorname{Code}(\mathsf{WF}-\mathsf{Assembly}-\mathsf{LinkKind}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ t\ :\ \mathsf{LinkKindField}\ \Uparrow \ c
\end{array}
$$

**(WF-Assembly-LinkKind-Use-Err)**

$$
\begin{array}{l}
t.\mathsf{kind}\ \in \ \{\texttt{executable},\ \texttt{dependency}\}\quad t.\mathsf{link}_{\mathsf{kind}}\ \ne \ \bot \quad c\ =\ \operatorname{Code}(\mathsf{WF}-\mathsf{Assembly}-\mathsf{LinkKind}-\mathsf{Use}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ t\ :\ \mathsf{LinkKindField}\ \Uparrow \ c
\end{array}
$$

**Toolchain Configuration**

$$
\begin{array}{l}
\mathsf{ToolchainKeys}\ =\ \{\texttt{"llvm\_bin"},\ \texttt{"runtime\_lib"},\ \texttt{"target\_profile"}\} \\[0.16em]
\operatorname{ToolchainTargetProfileOk}(v)\ \Leftrightarrow \ v\ =\ \bot \ \lor \ (v\ :\ \mathsf{string}\ \land \ v\ \in \ \mathsf{TargetProfile})
\end{array}
$$

**(WF-Toolchain)**

$$
\begin{array}{l}
T[\texttt{"toolchain"}]\ =\ \bot \ \lor \ (\operatorname{IsTable}(T[\texttt{"toolchain"}])\ \land \ \operatorname{Keys}(T[\texttt{"toolchain"}])\ \subseteq \ \mathsf{ToolchainKeys}\ \land \ (T[\texttt{"toolchain"}][\texttt{"llvm\_bin"}]\ =\ \bot \ \lor \ T[\texttt{"toolchain"}][\texttt{"llvm\_bin"}]\ :\ \mathsf{string})\ \land \ (T[\texttt{"toolchain"}][\texttt{"runtime\_lib"}]\ =\ \bot \ \lor \ T[\texttt{"toolchain"}][\texttt{"runtime\_lib"}]\ :\ \mathsf{string})\ \land \ \operatorname{ToolchainTargetProfileOk}(T[\texttt{"toolchain"}][\texttt{"target\_profile"}])) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{ToolchainValid}
\end{array}
$$

**(WF-Toolchain-Err)**

$$
\begin{array}{l}
T[\texttt{"toolchain"}]\ \ne \ \bot \ \land \ \lnot (\operatorname{IsTable}(T[\texttt{"toolchain"}])\ \land \ \operatorname{Keys}(T[\texttt{"toolchain"}])\ \subseteq \ \mathsf{ToolchainKeys}\ \land \ (T[\texttt{"toolchain"}][\texttt{"llvm\_bin"}]\ =\ \bot \ \lor \ T[\texttt{"toolchain"}][\texttt{"llvm\_bin"}]\ :\ \mathsf{string})\ \land \ (T[\texttt{"toolchain"}][\texttt{"runtime\_lib"}]\ =\ \bot \ \lor \ T[\texttt{"toolchain"}][\texttt{"runtime\_lib"}]\ :\ \mathsf{string})\ \land \ \operatorname{ToolchainTargetProfileOk}(T[\texttt{"toolchain"}][\texttt{"target\_profile"}]))\quad c\ =\ \operatorname{Code}(\mathsf{WF}-\mathsf{Toolchain}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{ToolchainValid}\ \Uparrow \ c
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ToolchainConfig}(T)\ = \\[0.16em]
\ \langle \mathsf{llvm}_{\mathsf{bin}}\ =\ T[\texttt{"toolchain"}][\texttt{"llvm\_bin"}],\ \mathsf{runtime}_{\mathsf{lib}}\ =\ T[\texttt{"toolchain"}][\texttt{"runtime\_lib"}],\ \mathsf{target}_{\mathsf{profile}}\ =\ T[\texttt{"toolchain"}][\texttt{"target\_profile"}]\rangle \ \mathsf{if}\ T[\texttt{"toolchain"}]\ \ne \ \bot  \\[0.16em]
\ \langle \mathsf{llvm}_{\mathsf{bin}}\ =\ \bot ,\ \mathsf{runtime}_{\mathsf{lib}}\ =\ \bot ,\ \mathsf{target}_{\mathsf{profile}}\ =\ \bot \rangle \quad \mathsf{otherwise}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{SelectedTargetProfile}(\mathsf{cli},\ T)\ = \\[0.16em]
\ \mathsf{cli}\quad \mathsf{if}\ \mathsf{cli}\ \ne \ \bot  \\[0.16em]
\ \operatorname{ToolchainConfig}(T).\mathsf{target}_{\mathsf{profile}}\ \mathsf{if}\ \mathsf{cli}\ =\ \bot \ \land \ \operatorname{ToolchainConfig}(T).\mathsf{target}_{\mathsf{profile}}\ \ne \ \bot  \\[0.16em]
\ \mathsf{error}\quad \mathsf{otherwise}
\end{array}
$$

**Build Configuration**

$$
\mathsf{BuildKeys}\ =\ \{\texttt{"incremental"},\ \texttt{"progress"}\}
$$

**(WF-Build)**

$$
\begin{array}{l}
T[\texttt{"build"}]\ =\ \bot \ \lor \ (\operatorname{IsTable}(T[\texttt{"build"}])\ \land \ \operatorname{Keys}(T[\texttt{"build"}])\ \subseteq \ \mathsf{BuildKeys}\ \land \ \forall \ k\ \in \ \operatorname{Keys}(T[\texttt{"build"}]).\ T[\texttt{"build"}][k]\ :\ \mathsf{bool}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{BuildValid}
\end{array}
$$

**(WF-Build-Err)**

$$
\begin{array}{l}
T[\texttt{"build"}]\ \ne \ \bot \ \land \ \lnot (\operatorname{IsTable}(T[\texttt{"build"}])\ \land \ \operatorname{Keys}(T[\texttt{"build"}])\ \subseteq \ \mathsf{BuildKeys}\ \land \ \forall \ k\ \in \ \operatorname{Keys}(T[\texttt{"build"}]).\ T[\texttt{"build"}][k]\ :\ \mathsf{bool})\quad c\ =\ \operatorname{Code}(\mathsf{WF}-\mathsf{Build}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{BuildValid}\ \Uparrow \ c
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BuildConfig}(T)\ = \\[0.16em]
\ \langle \mathsf{incremental}\ =\ \mathsf{false},\ \mathsf{progress}\ =\ \mathsf{true}\rangle \quad \mathsf{if}\ T[\texttt{"build"}]\ =\ \bot  \\[0.16em]
\ \langle \mathsf{incremental}\ =\ T[\texttt{"build"}][\texttt{"incremental"}],\ \mathsf{progress}\ =\ (T[\texttt{"build"}][\texttt{"progress"}]\ \mathsf{if}\ T[\texttt{"build"}][\texttt{"progress"}]\ \ne \ \bot \ \mathsf{else}\ \mathsf{true})\rangle \ \mathsf{if}\ T[\texttt{"build"}]\ \ne \ \bot \ \land \ T[\texttt{"build"}][\texttt{"incremental"}]\ \ne \ \bot  \\[0.16em]
\ \langle \mathsf{incremental}\ =\ \mathsf{false},\ \mathsf{progress}\ =\ (T[\texttt{"build"}][\texttt{"progress"}]\ \mathsf{if}\ T[\texttt{"build"}][\texttt{"progress"}]\ \ne \ \bot \ \mathsf{else}\ \mathsf{true})\rangle \quad \mathsf{otherwise}
\end{array}
$$

**Path Resolution**

$$
\begin{array}{l}
\mathsf{WinSep}\ =\ \{\texttt{"\textbackslash{}\textbackslash{}", "}/"\} \\[0.16em]
\operatorname{AsciiLetter}(c)\ \Leftrightarrow \ (c\ \in \ \{\texttt{"A"},\ \ldots ,\ \texttt{"Z"}\}\ \lor \ c\ \in \ \{\texttt{"a"},\ \ldots ,\ \texttt{"z"}\}) \\[0.16em]
\operatorname{DriveRooted}(p)\ \Leftrightarrow \ \mid p\mid \ \ge \ 3\ \land \ \operatorname{AsciiLetter}(\operatorname{At}(p,\ 0))\ \land \ \operatorname{At}(p,\ 1)\ =\ \texttt{":"}\ \land \ \operatorname{At}(p,\ 2)\ \in \ \mathsf{WinSep} \\[0.16em]
\operatorname{UNC}(p)\ \Leftrightarrow \ \operatorname{StartsWith}(p,\ \texttt{"//"})\ \lor \ \operatorname{StartsWith}(p,\ "\setminus \setminus \setminus \setminus ") \\[0.16em]
\operatorname{RootRelative}(p)\ \Leftrightarrow \ (\operatorname{StartsWith}(p,\ \texttt{"/"})\ \lor \ \operatorname{StartsWith}(p,\ "\setminus \setminus "))\ \land \ \lnot \ \operatorname{UNC}(p)\ \land \ \lnot \ \operatorname{DriveRooted}(p) \\[0.16em]
\operatorname{RootTag}(p)\ = \\[0.16em]
\ p[0..2)\ \mathsf{if}\ \operatorname{DriveRooted}(p) \\[0.16em]
\ \texttt{"//"}\quad \mathsf{if}\ \operatorname{UNC}(p) \\[0.16em]
\ \texttt{"/"}\quad \mathsf{if}\ \operatorname{RootRelative}(p) \\[0.16em]
\ \texttt{"\textbackslash{}""}\quad \mathsf{otherwise} \\[0.16em]
\operatorname{Tail}(p)\ = \\[0.16em]
\ p[3..\mid p\mid )\ \mathsf{if}\ \operatorname{DriveRooted}(p) \\[0.16em]
\ p[2..\mid p\mid )\ \mathsf{if}\ \operatorname{UNC}(p) \\[0.16em]
\ p[1..\mid p\mid )\ \mathsf{if}\ \operatorname{RootRelative}(p) \\[0.16em]
\ p\quad \mathsf{otherwise} \\[0.16em]
\operatorname{Segs}(p)\ =\ [\ p[i..j)\ \mid \ 0\ \le \ i\ <\ j\ \le \ \mid p\mid \ \land \ (\forall \ k\ \in \ [i,\ j).\ \operatorname{At}(p,\ k)\ \notin \ \mathsf{WinSep})\ \land \ (i\ =\ 0\ \lor \ \operatorname{At}(p,\ i-1)\ \in \ \mathsf{WinSep})\ \land \ (j\ =\ \mid p\mid \ \lor \ \operatorname{At}(p,\ j)\ \in \ \mathsf{WinSep})\ ] \\[0.16em]
\operatorname{PathComps}(p)\ = \\[0.16em]
\ \operatorname{Segs}(p)\ \mathsf{if}\ \operatorname{RootTag}(p)\ =\ \texttt{"\textbackslash{}""} \\[0.16em]
\ [\operatorname{RootTag}(p)]\ \mathbin{++} \ \operatorname{Segs}(\operatorname{Tail}(p))\ \mathsf{otherwise} \\[0.16em]
\operatorname{JoinComp}([])\ =\ \texttt{"\textbackslash{}""} \\[0.16em]
\operatorname{JoinComp}([c])\ =\ c \\[0.16em]
\operatorname{JoinComp}(c\mathbin{::} \mathsf{cs})\ = \\[0.16em]
\ c\ \mathbin{++} \ \operatorname{JoinComp}(\mathsf{cs})\quad \mathsf{if}\ c\ \in \ \{\texttt{"/"},\ \texttt{"//"}\} \\[0.16em]
\ c\ \mathbin{++} \ \texttt{"/"}\ \mathbin{++} \ \operatorname{JoinComp}(\mathsf{cs})\ \mathsf{if}\ \operatorname{DriveRooted}(c\ \mathbin{++} \ \texttt{"/"}) \\[0.16em]
\ c\ \mathbin{++} \ \texttt{"/"}\ \mathbin{++} \ \operatorname{JoinComp}(\mathsf{cs})\ \mathsf{otherwise} \\[0.16em]
\operatorname{Join}(a,\ b)\ = \\[0.16em]
\ b\ \mathsf{if}\ \operatorname{AbsPath}(b) \\[0.16em]
\ \operatorname{JoinComp}(\operatorname{PathComps}(a)\ \mathbin{++} \ \operatorname{PathComps}(b))\ \mathsf{otherwise}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{AbsPath}(p)\ \Leftrightarrow \ \operatorname{DriveRooted}(p)\ \lor \ \operatorname{UNC}(p)\ \lor \ \operatorname{RootRelative}(p) \\[0.16em]
\operatorname{is_relative}(p)\ \Leftrightarrow \ \lnot \ \operatorname{AbsPath}(p) \\[0.16em]
\mathsf{Join}\ :\ \mathsf{Path}\ \times \ \mathsf{Path}\ \to \ \mathsf{Path} \\[0.16em]
\mathsf{Normalize}\ :\ \mathsf{Path}\ \to \ \mathsf{Path} \\[0.16em]
\mathsf{Canon}\ :\ \mathsf{Path}\ \rightharpoonup \ \mathsf{Path} \\[0.16em]
\operatorname{prefix}(p,\ q)\ \Leftrightarrow \ \operatorname{PathPrefix}(\operatorname{PathComps}(q),\ \operatorname{PathComps}(p)) \\[0.16em]
\operatorname{Normalize}(p)\ =\ \operatorname{JoinComp}([\ c\ \mid \ c\ \in \ \operatorname{PathComps}(p)\ \land \ c\ \ne \ \texttt{"."}\ ]) \\[0.16em]
\operatorname{Under}(p,\ O)\ \Leftrightarrow \ \operatorname{prefix}(\operatorname{Normalize}(p),\ \operatorname{Normalize}(O)) \\[0.16em]
\operatorname{Canon}(p)\ =\ \bot \ \Leftrightarrow \ \exists \ c\ \in \ \operatorname{PathComps}(\operatorname{Normalize}(p)).\ c\ =\ \texttt{".."} \\[0.16em]
\operatorname{Canon}(p)\ =\ \operatorname{Normalize}(p)\ \Leftrightarrow \ \lnot \ \exists \ c\ \in \ \operatorname{PathComps}(\operatorname{Normalize}(p)).\ c\ =\ \texttt{".."} \\[0.16em]
\operatorname{Drop}(0,\ \mathsf{xs})\ =\ \mathsf{xs}\quad \operatorname{Drop}(n,\ [])\ =\ []\quad \operatorname{Drop}(n,\ x\mathbin{::} \mathsf{xs})\ =\ \operatorname{Drop}(n-1,\ \mathsf{xs})\ (n\ >\ 0) \\[0.16em]
\operatorname{relative}(p,\ \mathsf{base})\ =\ \mathsf{rel}\ \Leftrightarrow \ \operatorname{Canon}(p)\ =\ p'\ \land \ \operatorname{Canon}(\mathsf{base})\ =\ b'\ \land \ \operatorname{PathPrefix}(\operatorname{PathComps}(b'),\ \operatorname{PathComps}(p'))\ \land \ \mathsf{rel}\ =\ \operatorname{JoinComp}(\operatorname{Drop}(\mid \operatorname{PathComps}(b')\mid ,\ \operatorname{PathComps}(p'))) \\[0.16em]
\operatorname{Basename}(p)\ = \\[0.16em]
\ \texttt{"\textbackslash{}""}\ \mathsf{if}\ \mid \operatorname{PathComps}(p)\mid \ =\ 0 \\[0.16em]
\ \operatorname{last}(\operatorname{PathComps}(p))\ \mathsf{otherwise} \\[0.16em]
\operatorname{last}([x])\ =\ x\quad \operatorname{last}(x\mathbin{::} \mathsf{xs})\ =\ \operatorname{last}(\mathsf{xs})\ (\mid \mathsf{xs}\mid \ >\ 0)
\end{array}
$$

$$
\begin{array}{l}
b\ =\ \operatorname{Basename}(p) \\[0.16em]
D\ =\ \{\ j\ \mid \ 0\ \le \ j\ <\ \mid b\mid \ \land \ b[j]\ =\ \texttt{"."}\ \} \\[0.16em]
\operatorname{FileExt}(p)\ = \\[0.16em]
\ \texttt{"\textbackslash{}""}\ \mathsf{if}\ D\ =\ \emptyset  \\[0.16em]
\ \texttt{"\textbackslash{}""}\ \mathsf{if}\ D\ \ne \ \emptyset \ \land \ \operatorname{max}(D)\ =\ 0 \\[0.16em]
\ b[\operatorname{max}(D)..\mid b\mid )\ \mathsf{if}\ D\ \ne \ \emptyset \ \land \ \operatorname{max}(D)\ >\ 0
\end{array}
$$

**(Resolve-Canonical)**

$$
\begin{array}{l}
p'\ =\ \operatorname{Normalize}(\operatorname{Join}(R,\ p))\quad \operatorname{Canon}(R)\ =\ R'\quad \operatorname{Canon}(p')\ =\ p'' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resolve}(R,\ p)\ \Downarrow \ (R',\ p'')
\end{array}
$$

**(Resolve-Canonical-Err)**

$$
\begin{array}{l}
p'\ =\ \operatorname{Normalize}(\operatorname{Join}(R,\ p))\quad (\operatorname{Canon}(R)\ =\ \bot \ \lor \ \operatorname{Canon}(p')\ =\ \bot )\quad c\ =\ \operatorname{Code}(\mathsf{Resolve}-\mathsf{Canonical}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Resolve}(R,\ p)\ \Uparrow \ c
\end{array}
$$

**(WF-RelPath)**

$$
\begin{array}{l}
\operatorname{is_relative}(p)\quad \Gamma \ \vdash \ \operatorname{Resolve}(R,\ p)\ \Downarrow \ (R',\ p'')\quad \operatorname{prefix}(p'',\ R') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ p\ :\ \mathsf{RelPath}
\end{array}
$$

**(WF-RelPath-Err)**

$$
\begin{array}{l}
\lnot \ \operatorname{is_relative}(p)\ \lor \ (\Gamma \ \vdash \ \operatorname{Resolve}(R,\ p)\ \Downarrow \ (R',\ p'')\ \land \ \lnot \ \operatorname{prefix}(p'',\ R'))\quad c\ =\ \operatorname{Code}(\mathsf{WF}-\mathsf{RelPath}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ p\ :\ \mathsf{RelPath}\ \Uparrow \ c
\end{array}
$$

$$
\operatorname{Project}(\Gamma )\ =\ P\ \Leftrightarrow \ \Gamma .\mathsf{project}\ =\ P
$$

**(WF-Project-Root)**
exists(`Ultraviolet.toml` at R)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\vdash \ R\ :\ \mathsf{ProjectRoot}
\end{array}
$$

## 3.3 Assemblies and Project Loading

**(WF-Assembly)**

$$
\begin{array}{l}
A_{0}.\mathsf{kind}\ \in \ \mathsf{AssemblyKind} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ A_{0}\ :\ \mathsf{Assembly}
\end{array}
$$

**Project Load (Small-Step)**

$$
\begin{array}{l}
\mathsf{AssemblyTarget}\ =\ \mathsf{Name}\ \cup \ \{\bot \} \\[0.16em]
\mathsf{ProjLoadState}\ =\ \{\operatorname{Start}(R,\ \mathsf{target}),\ \operatorname{Parsed}(R,\ \mathsf{target},\ T),\ \operatorname{Validated}(R,\ \mathsf{target},\ T),\ \operatorname{ProjAsmScan}(R,\ \mathsf{target},\ T,\ \mathsf{Ts},\ \mathsf{As}),\ \operatorname{Discovered}(P),\ \operatorname{Error}(\mathsf{code})\}
\end{array}
$$

**(Step-Parse)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseManifest}(R)\ \Downarrow \ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Start}(R,\ \mathsf{target})\rangle \ \to \ \langle \operatorname{Parsed}(R,\ \mathsf{target},\ T)\rangle 
\end{array}
$$

**(Step-Parse-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseManifest}(R)\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Start}(R,\ \mathsf{target})\rangle \ \to \ \langle \operatorname{Error}(c)\rangle 
\end{array}
$$

**(Step-Validate)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ValidateManifest}(T)\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Parsed}(R,\ \mathsf{target},\ T)\rangle \ \to \ \langle \operatorname{Validated}(R,\ \mathsf{target},\ T)\rangle 
\end{array}
$$

**(Step-Validate-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ValidateManifest}(T)\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Parsed}(R,\ \mathsf{target},\ T)\rangle \ \to \ \langle \operatorname{Error}(c)\rangle 
\end{array}
$$

**Manifest Validation (Deterministic).**

$$
\begin{array}{l}
\operatorname{ChecksAsm}(t)\ =\ [\Gamma \ \vdash \ t\ :\ \mathsf{KnownKeys},\ \Gamma \ \vdash \ t\ :\ \mathsf{ReqTypes},\ \Gamma \ \vdash \ t\ :\ \mathsf{OutDirType},\ \Gamma \ \vdash \ t\ :\ \mathsf{EmitIRType},\ \Gamma \ \vdash \ t\ :\ \mathsf{LinkKindType},\ \Gamma \ \vdash \ t.\mathsf{name}\ :\ \mathsf{Name},\ \Gamma \ \vdash \ t.\mathsf{kind}\ :\ \mathsf{Kind},\ \Gamma \ \vdash \ t\ :\ \mathsf{LinkKindField},\ \Gamma \ \vdash \ t.\mathsf{emit}_{\mathsf{ir}}\ :\ \mathsf{EmitIR},\ \Gamma \ \vdash \ t.\mathsf{root}\ :\ \mathsf{RootPath},\ \Gamma \ \vdash \ t.\mathsf{out}_{\mathsf{dir}}\ :\ \mathsf{OutDirPath}] \\[0.16em]
\operatorname{BaseChecks}(T)\ =\ [\Gamma \ \vdash \ T\ :\ \mathsf{TopKeys},\ \Gamma \ \vdash \ T\ :\ \mathsf{AssemblyTable},\ \Gamma \ \vdash \ T\ :\ \mathsf{AssemblyCount},\ \Gamma \ \vdash \ T\ :\ \mathsf{AssemblyNames}] \\[0.16em]
\operatorname{AsmChecks}(T)\ = \\[0.16em]
\ []\ \mathsf{if}\ \operatorname{AsmTables}(T)\ =\ \bot  \\[0.16em]
\ \mathbin{++} \_\{t\ \in \ \operatorname{AsmTables}(T)\}\ \operatorname{ChecksAsm}(t)\ \mathsf{otherwise} \\[0.16em]
\operatorname{Checks}(T)\ =\ \operatorname{BaseChecks}(T)\ \mathbin{++} \ \operatorname{AsmChecks}(T)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{FirstFail}([])\ =\ \bot  \\[0.16em]
\operatorname{FirstFail}(J\mathbin{::} \mathsf{Js})\ =\ c\ \Leftrightarrow \ \Gamma \ \vdash \ J\ \Uparrow \ c \\[0.16em]
\operatorname{FirstFail}(J\mathbin{::} \mathsf{Js})\ =\ \operatorname{FirstFail}(\mathsf{Js})\ \Leftrightarrow \ \Gamma \ \vdash \ J\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(ValidateManifest-Ok)**

$$
\begin{array}{l}
\operatorname{FirstFail}(\operatorname{Checks}(T))\ =\ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ValidateManifest}(T)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(ValidateManifest-Err)**

$$
\begin{array}{l}
\operatorname{FirstFail}(\operatorname{Checks}(T))\ =\ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ValidateManifest}(T)\ \Uparrow \ c
\end{array}
$$

**(Step-Asm-Init)**

$$
\begin{array}{l}
\mathsf{Ts}\ =\ \operatorname{AsmTables}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Validated}(R,\ \mathsf{target},\ T)\rangle \ \to \ \langle \operatorname{ProjAsmScan}(R,\ \mathsf{target},\ T,\ \mathsf{Ts},\ [])\rangle 
\end{array}
$$

**(Step-Asm-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{BuildAssembly}(R,\ t_{0})\ \Downarrow \ A \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{ProjAsmScan}(R,\ \mathsf{target},\ T,\ t_{0}\mathbin{::} \mathsf{ts},\ \mathsf{As})\rangle \ \to \ \langle \operatorname{ProjAsmScan}(R,\ \mathsf{target},\ T,\ \mathsf{ts},\ \mathsf{As}\ \mathbin{++} \ [A])\rangle 
\end{array}
$$

**(Step-Asm-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{BuildAssembly}(R,\ t_{0})\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{ProjAsmScan}(R,\ \mathsf{target},\ T,\ t_{0}\mathbin{::} \mathsf{ts},\ \mathsf{As})\rangle \ \to \ \langle \operatorname{Error}(c)\rangle 
\end{array}
$$

**(Step-Asm-Done)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{OwnAssemblies}(\mathsf{As})\ \Downarrow \ \mathsf{As}'\quad \Gamma \ \vdash \ \operatorname{SelectAssembly}(\mathsf{As}',\ \mathsf{target})\ \Downarrow \ A_{0}\quad P\ =\ \langle \mathsf{root}\ =\ R,\ \mathsf{assemblies}\ =\ \mathsf{As}',\ \mathsf{assembly}\ =\ A_{0},\ \mathsf{source}_{\mathsf{root}}\ =\ A_{0}.\mathsf{source}_{\mathsf{root}},\ \mathsf{outputs}\ =\ A_{0}.\mathsf{outputs},\ \mathsf{modules}\ =\ A_{0}.\mathsf{modules},\ \mathsf{toolchain}\ =\ \operatorname{ToolchainConfig}(T),\ \mathsf{build}\ =\ \operatorname{BuildConfig}(T)\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{ProjAsmScan}(R,\ \mathsf{target},\ T,\ [],\ \mathsf{As})\rangle \ \to \ \langle \operatorname{Discovered}(P)\rangle 
\end{array}
$$

**(Step-Asm-Own-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{OwnAssemblies}(\mathsf{As})\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{ProjAsmScan}(R,\ \mathsf{target},\ T,\ [],\ \mathsf{As})\rangle \ \to \ \langle \operatorname{Error}(c)\rangle 
\end{array}
$$

**(Step-Asm-Done-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{OwnAssemblies}(\mathsf{As})\ \Downarrow \ \mathsf{As}'\quad \Gamma \ \vdash \ \operatorname{SelectAssembly}(\mathsf{As}',\ \mathsf{target})\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{ProjAsmScan}(R,\ \mathsf{target},\ T,\ [],\ \mathsf{As})\rangle \ \to \ \langle \operatorname{Error}(c)\rangle 
\end{array}
$$

**Assembly Selection**

**(Select-Only)**
|As| = 1    target = ⊥    As = [A_0]

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{SelectAssembly}(\mathsf{As},\ \mathsf{target})\ \Downarrow \ A_{0}
\end{array}
$$

**(Select-Only-Exe)**
|As| > 1    target = ⊥    |{A ∈ As | A.kind = "executable"}| = 1    A_e ∈ As    A_e.kind = "executable"

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{SelectAssembly}(\mathsf{As},\ \mathsf{target})\ \Downarrow \ A_{e}
\end{array}
$$

**(Select-By-Name)**

$$
\begin{array}{l}
\mathsf{target}\ \ne \ \bot \quad A\ \in \ \mathsf{As}\quad A.\mathsf{name}\ =\ \mathsf{target} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{SelectAssembly}(\mathsf{As},\ \mathsf{target})\ \Downarrow \ A
\end{array}
$$

**(Select-Err)**
(target = ⊥ ∧ |As| ≠ 1 ∧ |{A ∈ As | A.kind = "executable"}| ≠ 1) ∨ (target ≠ ⊥ ∧ ¬ ∃ A ∈ As. A.name = target)    c = Code(Assembly-Select-Err)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{SelectAssembly}(\mathsf{As},\ \mathsf{target})\ \Uparrow \ c
\end{array}
$$

**Assembly Build (Big-Step)**

**(BuildAssembly-Ok)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Resolve}(R,\ t.\mathsf{root})\ \Downarrow \ (R',\ S)\quad \Gamma \ \vdash \ S\ :\ \mathsf{SourceRoot}\quad \Gamma \ \vdash \ \operatorname{Modules}(S,\ t.\mathsf{name})\ \Downarrow \ M\quad L\ =\ \mathsf{sort}\_\{\prec_{\mathsf{mod}} \}(M)\quad A\ =\ \langle \mathsf{name}\ =\ t.\mathsf{name},\ \mathsf{kind}\ =\ t.\mathsf{kind},\ \mathsf{link}_{\mathsf{kind}}\ =\ \operatorname{AsmLinkKind}(t.\mathsf{kind},\ t.\mathsf{link}_{\mathsf{kind}}),\ \mathsf{root}\ =\ t.\mathsf{root},\ \mathsf{out}_{\mathsf{dir}}\ =\ t.\mathsf{out}_{\mathsf{dir}},\ \mathsf{emit}_{\mathsf{ir}}\ =\ t.\mathsf{emit}_{\mathsf{ir}},\ \mathsf{source}_{\mathsf{root}}\ =\ S,\ \mathsf{outputs}\ =\ \operatorname{OutputPaths}(R,\ t),\ \mathsf{modules}\ =\ L\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuildAssembly}(R,\ t)\ \Downarrow \ A
\end{array}
$$

**(BuildAssembly-Err-Resolve)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Resolve}(R,\ t.\mathsf{root})\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuildAssembly}(R,\ t)\ \Uparrow \ c
\end{array}
$$

**(BuildAssembly-Err-Root)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Resolve}(R,\ t.\mathsf{root})\ \Downarrow \ (R',\ S)\quad \Gamma \ \vdash \ S\ :\ \mathsf{SourceRoot}\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuildAssembly}(R,\ t)\ \Uparrow \ c
\end{array}
$$

**(BuildAssembly-Err-Modules)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Resolve}(R,\ t.\mathsf{root})\ \Downarrow \ (R',\ S)\quad \Gamma \ \vdash \ S\ :\ \mathsf{SourceRoot}\quad \Gamma \ \vdash \ \operatorname{Modules}(S,\ t.\mathsf{name})\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuildAssembly}(R,\ t)\ \Uparrow \ c
\end{array}
$$

**Project Load (Big-Step)**

**(LoadProject-Ok)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseManifest}(R)\ \Downarrow \ T\quad \Gamma \ \vdash \ \operatorname{ValidateManifest}(T)\ \Downarrow \ \mathsf{ok}\quad \operatorname{AsmTables}(T)\ =\ [t_{1},\ \ldots ,\ t_{n}]\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{BuildAssembly}(R,\ t_{i})\ \Downarrow \ A_{i}\quad \mathsf{As}\ =\ [A_{1},\ \ldots ,\ A_{n}]\quad \Gamma \ \vdash \ \operatorname{OwnAssemblies}(\mathsf{As})\ \Downarrow \ \mathsf{As}'\quad \Gamma \ \vdash \ \operatorname{SelectAssembly}(\mathsf{As}',\ \mathsf{target})\ \Downarrow \ A_{0}\quad P\ =\ \langle \mathsf{root}\ =\ R,\ \mathsf{assemblies}\ =\ \mathsf{As}',\ \mathsf{assembly}\ =\ A_{0},\ \mathsf{source}_{\mathsf{root}}\ =\ A_{0}.\mathsf{source}_{\mathsf{root}},\ \mathsf{outputs}\ =\ A_{0}.\mathsf{outputs},\ \mathsf{modules}\ =\ A_{0}.\mathsf{modules},\ \mathsf{toolchain}\ =\ \operatorname{ToolchainConfig}(T),\ \mathsf{build}\ =\ \operatorname{BuildConfig}(T)\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LoadProject}(R,\ \mathsf{target})\ \Downarrow \ P
\end{array}
$$

**(LoadProject-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LoadProject}(R,\ \mathsf{target})\ \to *\ \langle \operatorname{Error}(c)\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LoadProject}(R,\ \mathsf{target})\ \Uparrow \ c
\end{array}
$$

**Assembly Graph Constraints**

Let `AsmDeps(A)` be the set of assembly names referenced by the first path segment of each `import` declaration appearing in modules owned by `A`, restricted to names in `AsmNames(P)`.

1. If `B ∈ AsmDeps(A)` and `AsmByName(P, B).kind = "executable"`, the program is ill-formed.
2. Let `G_link` be the directed graph over `{ A ∈ Assemblies(P) | A.kind = "library" }` with edge `A → B` iff `B ∈ AsmDeps(A)` and `AsmByName(P, B).kind = "library"`. If `G_link` contains a cycle, the program is ill-formed.
3. A `dependency` assembly MUST NOT own a final linked artifact. Its modules are emitted into the nearest importing linkable assembly selected by the build graph.

## 3.4 Deterministic Ordering and Case Folding

$$
\operatorname{FoldPath}(r)\ =\ \operatorname{JoinComp}([\operatorname{CaseFold}(\operatorname{NFC}(c))\ \mid \ c\ \in \ \operatorname{PathComps}(r)])
$$

$$
\begin{array}{l}
\operatorname{FileKey}(f,\ d)\ = \\[0.16em]
\ \langle \operatorname{FoldPath}(\mathsf{rel}),\ \mathsf{rel}\rangle \ \mathsf{if}\ \operatorname{relative}(f,\ d)\ \Downarrow \ \mathsf{rel} \\[0.16em]
\ \langle \bot ,\ \operatorname{Basename}(f)\rangle \quad \mathsf{if}\ \operatorname{relative}(f,\ d)\ \Uparrow 
\end{array}
$$

$$
f_{1}\ \prec_{\mathsf{file}} \ f_{2}\ \Leftrightarrow \ \operatorname{Utf8LexLess}(\operatorname{FileKey}(f_{1},\ d),\ \operatorname{FileKey}(f_{2},\ d))
$$

**(FileOrder-Rel-Fail)**

$$
\begin{array}{l}
\operatorname{relative}(f,\ d)\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{FileOrder}-\mathsf{Rel}-\mathsf{Fail}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Emit}(c)
\end{array}
$$

**Fold.**

$$
\operatorname{Fold}(p)\ =\ [\operatorname{CaseFold}(\operatorname{NFC}(c))\ \mid \ c\ \in \ p]
$$

$$
\begin{array}{l}
\operatorname{DirKey}(d,\ S)\ = \\[0.16em]
\ \langle \operatorname{FoldPath}(\mathsf{rel}),\ \mathsf{rel}\rangle \ \mathsf{if}\ \operatorname{relative}(d,\ S)\ \Downarrow \ \mathsf{rel} \\[0.16em]
\ \langle \bot ,\ \operatorname{Basename}(d)\rangle \quad \mathsf{if}\ \operatorname{relative}(d,\ S)\ \Uparrow 
\end{array}
$$

$$
d_{1}\ \prec_{\mathsf{dir}} \ d_{2}\ \Leftrightarrow \ \operatorname{Utf8LexLess}(\operatorname{DirKey}(d_{1},\ S),\ \operatorname{DirKey}(d_{2},\ S))
$$

$$
\operatorname{DirSeq}(S)\ =\ \mathsf{sort}\_\{\prec_{\mathsf{dir}} \}(\operatorname{Dirs}(S))
$$

**(DirSeq-Read-Err)**

$$
\begin{array}{l}
\operatorname{Dirs}(S)\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{DirSeq}-\mathsf{Read}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Emit}(c)
\end{array}
$$

**(DirSeq-Rel-Fail)**

$$
\begin{array}{l}
\operatorname{relative}(d,\ S)\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{DirSeq}-\mathsf{Rel}-\mathsf{Fail}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Emit}(c)
\end{array}
$$

## 3.5 Source Roots, Module Directories, and Compilation Units

**Dirs.**

$$
\begin{array}{l}
\operatorname{Dirs}(S)\ =\ \{\ d\ \mid \ \operatorname{is_dir}(d)\ \land \ \operatorname{relative}(d,\ S)\ \Downarrow \ r\ \} \\[0.16em]
S\ \in \ \operatorname{Dirs}(S)
\end{array}
$$

**(WF-Source-Root)**
is_dir(S)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ S\ :\ \mathsf{SourceRoot}
\end{array}
$$

**(WF-Source-Root-Err)**

$$
\begin{array}{l}
\lnot \ \operatorname{is_dir}(S)\quad c\ =\ \operatorname{Code}(\mathsf{WF}-\mathsf{Source}-\mathsf{Root}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ S\ :\ \mathsf{SourceRoot}\ \Uparrow \ c
\end{array}
$$

**(Module-Dir)**

$$
\begin{array}{l}
\exists \ f\ \in \ \operatorname{Files}(d)\ :\ \operatorname{FileExt}(f)\ =\ \texttt{".uv"} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ d\ :\ \mathsf{ModuleDir}
\end{array}
$$

$$
\operatorname{Files}(d)\ =\ \{\ f\ \mid \ f\ \in \ d\ \land \ \operatorname{FileExt}(f)\ =\ \texttt{".uv"}\ \}
$$

$$
\operatorname{CompilationUnit}(d)\ =\ \mathsf{sort}\_\{\prec_{\mathsf{file}} \}(\operatorname{Files}(d))
$$

**(CompilationUnit-Rel-Fail)**

$$
\begin{array}{l}
\exists \ f\ \in \ \operatorname{Files}(d).\ \operatorname{relative}(f,\ d)\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{FileOrder}-\mathsf{Rel}-\mathsf{Fail}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CompilationUnit}(d)\ \Uparrow \ c
\end{array}
$$

Module discovery state transitions and module-path formation are defined by §11.5.4. This chapter defines the filesystem-level relations consumed by those rules and by project loading.

**(Modules-Ok)**

$$
\begin{array}{l}
\langle \operatorname{DiscStart}(S,\ A)\rangle \ \to *\ \langle \operatorname{DiscDone}(M)\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Modules}(S,\ A)\ \Downarrow \ M
\end{array}
$$

**(Modules-Err)**

$$
\begin{array}{l}
\langle \operatorname{DiscStart}(S,\ A)\rangle \ \to *\ \langle \operatorname{Error}(c)\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Modules}(S,\ A)\ \Uparrow \ c
\end{array}
$$

$$
\begin{array}{l}
\operatorname{AssemblySourceRoots}(\mathsf{As})\ =\ \{\ A.\mathsf{source}_{\mathsf{root}}\ \mid \ A\ \in \ \mathsf{As}\ \} \\[0.16em]
\operatorname{RootDepth}(S)\ =\ \mid \operatorname{PathComps}(S)\mid 
\end{array}
$$

$$
\operatorname{OwnerRoot}(d,\ \mathsf{Rs})\ =\ S_{k}\ \Leftrightarrow \ S_{k}\ \in \ \mathsf{Rs}\ \land \ \operatorname{prefix}(d,\ S_{k})\ \land \ (\forall \ S_{i}\ \in \ \mathsf{Rs}.\ \operatorname{prefix}(d,\ S_{i})\ \Rightarrow \ \operatorname{RootDepth}(S_{i})\ \le \ \operatorname{RootDepth}(S_{k}))\ \land \ (\forall \ S_{j}\ \in \ \mathsf{Rs}.\ \operatorname{prefix}(d,\ S_{j})\ \land \ \operatorname{RootDepth}(S_{j})\ =\ \operatorname{RootDepth}(S_{k})\ \Rightarrow \ S_{j}\ =\ S_{k})
$$

$$
\operatorname{OwnedModules}(A,\ \mathsf{As})\ =\ [\ m\ \in \ A.\mathsf{modules}\ \mid \ \operatorname{OwnerRoot}(\operatorname{ModuleDirOf}(m,\ A.\mathsf{source}_{\mathsf{root}}),\ \operatorname{AssemblySourceRoots}(\mathsf{As}))\ =\ A.\mathsf{source}_{\mathsf{root}}\ ]
$$

**(OwnAssemblies-Ok)**

$$
\begin{array}{l}
\forall \ A\ \in \ \mathsf{As},\ \forall \ m\ \in \ A.\mathsf{modules}.\ \exists \ S.\ \operatorname{OwnerRoot}(\operatorname{ModuleDirOf}(m,\ A.\mathsf{source}_{\mathsf{root}}),\ \operatorname{AssemblySourceRoots}(\mathsf{As}))\ =\ S\quad \mathsf{As}\ =\ [A_{1},\ \ldots ,\ A_{n}]\quad \mathsf{As}'\ =\ [A_{1}[\mathsf{modules}\ :=\ \operatorname{OwnedModules}(A_{1},\ \mathsf{As})],\ \ldots ,\ A_{n}[\mathsf{modules}\ :=\ \operatorname{OwnedModules}(A_{n},\ \mathsf{As})]] \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{OwnAssemblies}(\mathsf{As})\ \Downarrow \ \mathsf{As}'
\end{array}
$$

**(WF-Assembly-Root-Owner-Ambiguous)**

$$
\begin{array}{l}
\exists \ A\ \in \ \mathsf{As},\ m\ \in \ A.\mathsf{modules}.\ \lnot \ \exists \ S.\ \operatorname{OwnerRoot}(\operatorname{ModuleDirOf}(m,\ A.\mathsf{source}_{\mathsf{root}}),\ \operatorname{AssemblySourceRoots}(\mathsf{As}))\ =\ S\quad c\ =\ \operatorname{Code}(\mathsf{WF}-\mathsf{Assembly}-\mathsf{Root}-\mathsf{Owner}-\mathsf{Ambiguous}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{OwnAssemblies}(\mathsf{As})\ \Uparrow \ c
\end{array}
$$

## 3.6 Output Artifacts and Linking

$$
\begin{array}{l}
\operatorname{AssemblyProject}(P,\ A)\ =\ P[\mathsf{assembly}\ :=\ A,\ \mathsf{source}_{\mathsf{root}}\ :=\ A.\mathsf{source}_{\mathsf{root}},\ \mathsf{outputs}\ :=\ A.\mathsf{outputs},\ \mathsf{modules}\ :=\ A.\mathsf{modules}] \\[0.16em]
\operatorname{ModulePaths}(A)\ =\ \{\ m.\mathsf{path}\ \mid \ m\ \in \ A.\mathsf{modules}\ \} \\[0.16em]
\operatorname{AsmImportGraph}(P)\ =\ \langle \operatorname{Assemblies}(P),\ E\rangle  \\[0.16em]
E\ =\ \{\langle A,\ B\rangle \ \mid \ A\ \in \ \operatorname{Assemblies}(P)\ \land \ B\ \in \ \operatorname{Assemblies}(P)\ \land \ A\ \ne \ B\ \land \ \exists \ m\ \in \ A.\mathsf{modules},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{path},\ \mathsf{alias}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{ImportDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{path},\ \mathsf{alias}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc})\ \in \ \operatorname{ASTModule}(\operatorname{AssemblyProject}(P,\ A),\ m).\mathsf{items}\ \land \ \Gamma_{A} \ \vdash \ \operatorname{ResolveImportPath}(\mathsf{path})\ \Downarrow \ \mathsf{mp}\ \land \ \mathsf{mp}\ \in \ \operatorname{ModulePaths}(B)\} \\[0.16em]
\Gamma_{A} \ =\ \Gamma [\mathsf{project}\ \mapsto \ \operatorname{AssemblyProject}(P,\ A)] \\[0.16em]
\operatorname{Vertices}(\langle V,\ E\rangle )\ =\ V \\[0.16em]
\operatorname{Edges}(\langle V,\ E\rangle )\ =\ E
\end{array}
$$

$$
\begin{array}{l}
\operatorname{GraphPath}(\langle V,\ E\rangle ,\ [A_{0},\ \ldots ,\ A_{n}])\ \Leftrightarrow \ n\ \ge \ 0\ \land \ \forall \ i\ \in \ [0,\ n).\ \langle A_{i},\ A\_\{i+1\}\rangle \ \in \ E \\[0.16em]
\operatorname{GraphReach}(\langle V,\ E\rangle ,\ A,\ B)\ \Leftrightarrow \ \exists \ \pi .\ \operatorname{GraphPath}(\langle V,\ E\rangle ,\ \pi )\ \land \ \pi [0]\ =\ A\ \land \ \operatorname{last}(\pi )\ =\ B \\[0.16em]
\operatorname{NoLibraryInterior}([A_{0},\ \ldots ,\ A_{n}])\ \Leftrightarrow \ \forall \ i\ \in \ [1,\ n).\ A_{i}.\mathsf{kind}\ \ne \ \texttt{library}
\end{array}
$$
LibraryBoundaryCycle(P) ⇔ ∃ π. GraphPath(AsmImportGraph(P), π) ∧ π[0] = last(π) ∧ |π| > 1 ∧ GraphReach(AsmImportGraph(P), P.assembly, π[0]) ∧ ∃ A ∈ π. A.kind = `library`
ImportsExecutable(P) ⇔ ∃ A ∈ Assemblies(P). A ≠ P.assembly ∧ GraphReach(AsmImportGraph(P), P.assembly, A) ∧ A.kind = `executable`
HostedLibraryImportsLinkedLibrary(P) ⇔ HostedLibrary(P) ∧ ∃ A. A ∈ Assemblies(P) ∧ A ≠ P.assembly ∧ GraphReach(AsmImportGraph(P), P.assembly, A) ∧ A.kind = `library`

**(Assembly-Graph-Ok)**

$$
\begin{array}{l}
\lnot \ \operatorname{ImportsExecutable}(P)\quad \lnot \ \operatorname{LibraryBoundaryCycle}(P)\quad \lnot \ \operatorname{HostedLibraryImportsLinkedLibrary}(P) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AssemblyGraph}(P)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(Assembly-Graph-Err)**

$$
\begin{array}{l}
\operatorname{ImportsExecutable}(P)\ \lor \ \operatorname{LibraryBoundaryCycle}(P)\quad c\ =\ \operatorname{Code}(\mathsf{Assembly}-\mathsf{Graph}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AssemblyGraph}(P)\ \Uparrow \ c
\end{array}
$$

**(Assembly-Graph-HostedImport-Err)**

$$
\begin{array}{l}
\operatorname{HostedLibraryImportsLinkedLibrary}(P)\quad c\ =\ \operatorname{Code}(\mathsf{Assembly}-\mathsf{Graph}-\mathsf{HostedImport}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AssemblyGraph}(P)\ \Uparrow \ c
\end{array}
$$

$$
\begin{array}{l}
\operatorname{EmitAssemblies}(P)\ =\ \{\ A\ \mid \ A\ =\ P.\mathsf{assembly}\ \lor \ (A.\mathsf{kind}\ =\ \texttt{dependency}\ \land \ \exists \ \pi .\ \operatorname{GraphPath}(\operatorname{AsmImportGraph}(P),\ \pi )\ \land \ \pi [0]\ =\ P.\mathsf{assembly}\ \land \ \operatorname{last}(\pi )\ =\ A\ \land \ \operatorname{NoLibraryInterior}(\pi ))\ \} \\[0.16em]
\operatorname{ImportedLibraries}(P)\ =\ \{\ A\ \mid \ A.\mathsf{kind}\ =\ \texttt{library}\ \land \ \operatorname{GraphReach}(\operatorname{AsmImportGraph}(P),\ P.\mathsf{assembly},\ A)\ \} \\[0.16em]
\operatorname{ImportedLibrariesExSelf}(P)\ =\ \operatorname{ImportedLibraries}(P)\ \setminus \ \{P.\mathsf{assembly}\} \\[0.16em]
\operatorname{LibraryPred}(P,\ B,\ A)\ \Leftrightarrow \ B\ \in \ \operatorname{ImportedLibrariesExSelf}(P)\ \land \ A\ \in \ \operatorname{ImportedLibrariesExSelf}(P)\ \land \ B\ \ne \ A\ \land \ \exists \ \pi .\ \operatorname{GraphPath}(\operatorname{AsmImportGraph}(P),\ \pi )\ \land \ \pi [0]\ =\ A\ \land \ \operatorname{last}(\pi )\ =\ B\ \land \ \operatorname{NoLibraryInterior}(\pi )
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LibraryReady}(P,\ S,\ A)\ \Leftrightarrow \ A\ \in \ \operatorname{ImportedLibrariesExSelf}(P)\ \land \ (\forall \ B.\ \operatorname{LibraryPred}(P,\ B,\ A)\ \Rightarrow \ B\ \in \ S) \\[0.16em]
\operatorname{LibraryTopo}(P)\ =\ [A_{1},\ \ldots ,\ A_{n}]\ \Leftrightarrow \ \{A_{1},\ \ldots ,\ A_{n}\}\ =\ \operatorname{ImportedLibrariesExSelf}(P)\ \land \ \forall \ i.\ \operatorname{ReadyLexLeast}(P,\ \{A_{1},\ \ldots ,\ A\_\{i-1\}\},\ A_{i}) \\[0.16em]
\operatorname{ReadyLexLeast}(P,\ S,\ A)\ \Leftrightarrow \ \operatorname{LibraryReady}(P,\ S,\ A)\ \land \ \forall \ B.\ \operatorname{LibraryReady}(P,\ S,\ B)\ \Rightarrow \ \operatorname{Utf8LexLess}(A.\mathsf{name},\ B.\mathsf{name})\ \lor \ A.\mathsf{name}\ =\ B.\mathsf{name}
\end{array}
$$

**(EmitModuleList-Ok)**

$$
\begin{array}{l}
L\ =\ \mathsf{sort}\_\{\prec_{\mathsf{mod}} \}(\bigcup \_\{A\ \in \ \operatorname{EmitAssemblies}(P)\}\ A.\mathsf{modules}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitModuleList}(P)\ \Downarrow \ L
\end{array}
$$

$$
\begin{array}{l}
\operatorname{RequiredOutputs}(P)\ =\ \{\operatorname{ObjPath}(P,\ m)\ \mid \ m\ \in \ \operatorname{EmitModuleList}(P)\}\ \cup \ \operatorname{IRSet}(P)\ \cup \ \operatorname{PrimaryArtifactSet}(P)\ \cup \ \operatorname{ImportLibSet}(P) \\[0.16em]
\operatorname{IRSet}(P)\ = \\[0.16em]
\ \{\operatorname{IRPath}(P,\ m,\ P.\mathsf{assembly}.\mathsf{emit}_{\mathsf{ir}})\ \mid \ m\ \in \ \operatorname{EmitModuleList}(P)\}\ \mathsf{if}\ P.\mathsf{assembly}.\mathsf{emit}_{\mathsf{ir}}\ \in \ \{\texttt{ll},\ \texttt{bc}\} \\[0.16em]
\ \emptyset \quad \mathsf{otherwise} \\[0.16em]
\operatorname{PrimaryArtifactSet}(P)\ = \\[0.16em]
\ \{\operatorname{PrimaryArtifact}(P)\}\ \mathsf{if}\ \operatorname{Linkable}(P) \\[0.16em]
\ \emptyset \quad \mathsf{otherwise} \\[0.16em]
\operatorname{ImportLibSet}(P)\ = \\[0.16em]
\ \{\operatorname{ImportLibPath}(P)\}\ \mathsf{if}\ \operatorname{SharedLibrary}(P)\ \land \ \operatorname{EmitsImportLib}(\mathsf{SelectedTargetProfile}) \\[0.16em]
\ \emptyset \quad \mathsf{otherwise}
\end{array}
$$

**Output Root.**

$$
\begin{array}{l}
O\ =\ \operatorname{OutputRoot}(P)\ = \\[0.16em]
\ P.\mathsf{root}/P.\mathsf{assembly}.\mathsf{out}_{\mathsf{dir}}\ \mathsf{if}\ \mathsf{provided} \\[0.16em]
\ P.\mathsf{root}/\texttt{build}\quad \mathsf{otherwise}
\end{array}
$$

**Output Hygiene.**

$$
\operatorname{OutputHygiene}(P)\ \Leftrightarrow \ \forall \ p\ \in \ \operatorname{RequiredOutputs}(P).\ \operatorname{Under}(p,\ \operatorname{OutputRoot}(P))
$$

$$
\begin{array}{l}
\operatorname{OutputPaths}(R,\ A).\mathsf{root}\ = \\[0.16em]
\ R/A.\mathsf{out}_{\mathsf{dir}}\ \mathsf{if}\ \mathsf{provided} \\[0.16em]
\ R/\texttt{build}\quad \mathsf{otherwise} \\[0.16em]
\operatorname{OutputPaths}(R,\ A).\mathsf{obj}_{\mathsf{dir}}\ =\ \operatorname{OutputPaths}(R,\ A).\mathsf{root}/\texttt{obj} \\[0.16em]
\operatorname{OutputPaths}(R,\ A).\mathsf{ir}_{\mathsf{dir}}\ =\ \operatorname{OutputPaths}(R,\ A).\mathsf{root}/\texttt{ir} \\[0.16em]
\operatorname{OutputPaths}(R,\ A).\mathsf{bin}_{\mathsf{dir}}\ =\ \operatorname{OutputPaths}(R,\ A).\mathsf{root}/\texttt{bin} \\[0.16em]
\operatorname{OutputPaths}(R,\ A).\mathsf{lib}_{\mathsf{dir}}\ =\ \operatorname{OutputPaths}(R,\ A).\mathsf{root}/\texttt{lib}
\end{array}
$$

P.outputs = P.assembly.outputs

**Object File Naming**

$$
\begin{array}{l}
\operatorname{PathToPrefix}(s)\ =\ \operatorname{Concat}([\operatorname{BMap}(b)\ \mid \ b\ \in \ \operatorname{Utf8}(\operatorname{NFC}(s))]) \\[0.16em]
\operatorname{BMap}(b)\ = \\[0.16em]
\ \operatorname{chr}(b)\quad \mathsf{if}\ b\ \in \ [0-9A-\mathsf{Za}-z] \\[0.16em]
\ \texttt{"\_x"}\ \mathbin{++} \ \operatorname{Hex2}(b)\ \mathsf{otherwise}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{mangle}(s)\ =\ \operatorname{PathToPrefix}(s) \\[0.16em]
\operatorname{MangleModulePath}(p)\ =\ \operatorname{mangle}(\operatorname{PathString}(\operatorname{PathKey}(p)))
\end{array}
$$

$$
\operatorname{obj}(m)\ =\ O\ /\ \texttt{obj}\ /\ (\operatorname{MangleModulePath}(p)\ \mathbin{++} \ \operatorname{ObjExt}(\mathsf{SelectedTargetProfile}))
$$

**Final Artifact Naming**

$$
\begin{array}{l}
\mathsf{libname}\ =\ \operatorname{LibraryPrefix}(\mathsf{SelectedTargetProfile})\ \mathbin{++} \ \mathsf{assembly}_{\mathsf{name}} \\[0.16em]
\mathsf{exe}\ =\ O\ /\ \texttt{bin}\ /\ (\mathsf{assembly}_{\mathsf{name}}\ \mathbin{++} \ \operatorname{ExeSuffix}(\mathsf{SelectedTargetProfile})) \\[0.16em]
\mathsf{shared}\ =\ O\ /\ \texttt{bin}\ /\ (\mathsf{libname}\ \mathbin{++} \ \operatorname{SharedLibSuffix}(\mathsf{SelectedTargetProfile})) \\[0.16em]
\mathsf{static}\ =\ O\ /\ \texttt{lib}\ /\ (\mathsf{libname}\ \mathbin{++} \ \operatorname{StaticLibSuffix}(\mathsf{SelectedTargetProfile})) \\[0.16em]
\mathsf{import}\ =\ O\ /\ \texttt{lib}\ /\ (\mathsf{libname}\ \mathbin{++} \ \operatorname{ImportLibSuffix}(\mathsf{SelectedTargetProfile}))
\end{array}
$$

**Output and Linking Semantics (Formal Rules)**

$$
\begin{array}{l}
\operatorname{path}(m)\ =\ m.\mathsf{path} \\[0.16em]
S\ =\ P.\mathsf{source}_{\mathsf{root}}
\end{array}
$$

**Module Emission Order.**

$$
m_{1}\ \prec_{\mathsf{mod}} \ m_{2}\ \Leftrightarrow \ \operatorname{Utf8LexLess}(\operatorname{Fold}(\operatorname{path}(m_{1})),\ \operatorname{Fold}(\operatorname{path}(m_{2})))\ \lor \ (\operatorname{Fold}(\operatorname{path}(m_{1}))\ =\ \operatorname{Fold}(\operatorname{path}(m_{2}))\ \land \ \operatorname{Utf8LexLess}(\operatorname{path}(m_{1}),\ \operatorname{path}(m_{2})))
$$

$$
\operatorname{Utf8LexLess}(a,\ b)\ \Leftrightarrow \ \operatorname{LexBytes}(\operatorname{Utf8}(a),\ \operatorname{Utf8}(b))
$$

**(ModuleList-Ok)**

$$
\begin{array}{l}
L\ =\ \mathsf{sort}\_\{\prec_{\mathsf{mod}} \}(P.\mathsf{modules}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ModuleList}(P)\ \Downarrow \ L
\end{array}
$$

**Output Paths.**

$$
\begin{array}{l}
O\ =\ \operatorname{OutputRoot}(P) \\[0.16em]
\mathsf{assembly}_{\mathsf{name}}\ =\ P.\mathsf{assembly}.\mathsf{name} \\[0.16em]
\operatorname{ext}(e)\ = \\[0.16em]
\ \texttt{".ll"}\ \mathsf{if}\ e\ =\ \texttt{ll} \\[0.16em]
\ \texttt{".bc"}\ \mathsf{if}\ e\ =\ \texttt{bc}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ObjPath}(P,\ m)\ =\ O\ /\ \texttt{obj}\ /\ (\operatorname{MangleModulePath}(\operatorname{path}(m))\ \mathbin{++} \ \operatorname{ObjExt}(\mathsf{SelectedTargetProfile})) \\[0.16em]
\operatorname{IRPath}(P,\ m,\ e)\ =\ O\ /\ \texttt{ir}\ /\ (\operatorname{MangleModulePath}(\operatorname{path}(m))\ \mathbin{++} \ \operatorname{ext}(e)) \\[0.16em]
\operatorname{ExePath}(P)\ = \\[0.16em]
\ O\ /\ \texttt{bin}\ /\ (\mathsf{assembly}_{\mathsf{name}}\ \mathbin{++} \ \operatorname{ExeSuffix}(\mathsf{SelectedTargetProfile}))\ \mathsf{if}\ \operatorname{Executable}(P) \\[0.16em]
\ \bot \quad \mathsf{otherwise} \\[0.16em]
\operatorname{SharedLibPath}(P)\ = \\[0.16em]
\ O\ /\ \texttt{bin}\ /\ ((\operatorname{LibraryPrefix}(\mathsf{SelectedTargetProfile})\ \mathbin{++} \ \mathsf{assembly}_{\mathsf{name}})\ \mathbin{++} \ \operatorname{SharedLibSuffix}(\mathsf{SelectedTargetProfile}))\ \mathsf{if}\ \operatorname{SharedLibrary}(P) \\[0.16em]
\ \bot \quad \mathsf{otherwise} \\[0.16em]
\operatorname{StaticLibPath}(P)\ = \\[0.16em]
\ O\ /\ \texttt{lib}\ /\ ((\operatorname{LibraryPrefix}(\mathsf{SelectedTargetProfile})\ \mathbin{++} \ \mathsf{assembly}_{\mathsf{name}})\ \mathbin{++} \ \operatorname{StaticLibSuffix}(\mathsf{SelectedTargetProfile}))\ \mathsf{if}\ \operatorname{StaticLibrary}(P) \\[0.16em]
\ \bot \quad \mathsf{otherwise} \\[0.16em]
\operatorname{ImportLibPath}(P)\ = \\[0.16em]
\ O\ /\ \texttt{lib}\ /\ ((\operatorname{LibraryPrefix}(\mathsf{SelectedTargetProfile})\ \mathbin{++} \ \mathsf{assembly}_{\mathsf{name}})\ \mathbin{++} \ \operatorname{ImportLibSuffix}(\mathsf{SelectedTargetProfile}))\ \mathsf{if}\ \operatorname{SharedLibrary}(P)\ \land \ \operatorname{EmitsImportLib}(\mathsf{SelectedTargetProfile}) \\[0.16em]
\ \bot \quad \mathsf{otherwise} \\[0.16em]
\operatorname{PrimaryArtifact}(P)\ = \\[0.16em]
\ \operatorname{ExePath}(P)\quad \mathsf{if}\ \operatorname{Executable}(P) \\[0.16em]
\ \operatorname{SharedLibPath}(P)\ \mathsf{if}\ \operatorname{SharedLibrary}(P) \\[0.16em]
\ \operatorname{StaticLibPath}(P)\ \mathsf{if}\ \operatorname{StaticLibrary}(P) \\[0.16em]
\ \bot \quad \mathsf{otherwise} \\[0.16em]
\operatorname{UsesBinDir}(P)\ \Leftrightarrow \ \operatorname{Executable}(P)\ \lor \ \operatorname{SharedLibrary}(P) \\[0.16em]
\operatorname{UsesLibDir}(P)\ \Leftrightarrow \ \operatorname{StaticLibrary}(P)\ \lor \ (\operatorname{SharedLibrary}(P)\ \land \ \operatorname{EmitsImportLib}(\mathsf{SelectedTargetProfile}))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ObjPaths}(P,\ \mathsf{ms})\ =\ [\operatorname{ObjPath}(P,\ m)\ \mid \ m\ \in \ \mathsf{ms}] \\[0.16em]
\operatorname{IRPaths}(P,\ \mathsf{ms},\ e)\ =\ [\operatorname{IRPath}(P,\ m,\ e)\ \mid \ m\ \in \ \mathsf{ms}] \\[0.16em]
\operatorname{LibraryArtifactInputs}(P)\ =\ [\operatorname{PrimaryArtifact}(\operatorname{AssemblyProject}(P,\ A))\ \mid \ A\ \in \ \operatorname{LibraryTopo}(P)]
\end{array}
$$

**Module Index and Symbol Name.**

$$
\begin{array}{l}
\operatorname{EmitModuleList}(P)\ =\ [m_{1},\ \ldots ,\ m_{n}] \\[0.16em]
\operatorname{Index}(P,\ m_{i})\ =\ i \\[0.16em]
\operatorname{pad4}(i)\ =\ \operatorname{PadLeft}(\operatorname{Decimal}(i),\ '0',\ 4) \\[0.16em]
\operatorname{SymbolName}(P,\ m)\ = \\[0.16em]
\ \texttt{"main"}\ \mathsf{if}\ \operatorname{path}(m)\ =\ P.\mathsf{assembly}.\mathsf{name} \\[0.16em]
\ \texttt{"mod"}\ \mathbin{++} \ \operatorname{pad4}(\operatorname{Index}(P,\ m))\ \mathsf{otherwise}
\end{array}
$$

$$
\operatorname{trunc8}(s)\ =\ \operatorname{PadRight}(\operatorname{Take}(\operatorname{Utf8}(s),\ 8),\ 8,\ 0\mathsf{x00})
$$

**LLVM Target Constants.**

$$
\begin{array}{l}
\mathsf{LLVMTriple}\ =\ \operatorname{LLVMTripleOf}(\mathsf{SelectedTargetProfile}) \\[0.16em]
\mathsf{LLVMDataLayout}\ =\ \operatorname{LLVMDataLayoutOf}(\mathsf{SelectedTargetProfile})
\end{array}
$$

$$
\operatorname{IsRootModule}(P,\ m)\ \Leftrightarrow \ \operatorname{path}(m)\ =\ P.\mathsf{assembly}.\mathsf{name}
$$

$$
\begin{array}{l}
\operatorname{WithEntry}(P,\ m,\ \mathsf{IR})\ = \\[0.16em]
\ \mathsf{IR}\ \mathbin{++} \ [\operatorname{EntryStub}(P)]\ \mathsf{if}\ \operatorname{Executable}(P)\ \land \ \operatorname{IsRootModule}(P,\ m) \\[0.16em]
\ \mathsf{IR}\quad \mathsf{otherwise}
\end{array}
$$

**(CodegenObj-LLVM)**

$$
\begin{array}{l}
\operatorname{Project}(\Gamma )\ =\ P\quad \Gamma \ \vdash \ \operatorname{CodegenModule}(m)\ \Downarrow \ \mathsf{IR}\quad \mathsf{IR}'\ =\ \operatorname{WithEntry}(P,\ m,\ \mathsf{IR})\quad \Gamma \ \vdash \ \operatorname{LowerIR}(\mathsf{IR}')\ \Downarrow \ L\quad \Gamma \ \vdash \ \operatorname{EmitObj}(L)\ \Downarrow \ b \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CodegenObj}(m)\ \Downarrow \ b
\end{array}
$$

**(CodegenIR-LLVM)**

$$
\begin{array}{l}
\operatorname{Project}(\Gamma )\ =\ P\quad e\ \in \ \{\texttt{ll},\ \texttt{bc}\}\quad \Gamma \ \vdash \ \operatorname{CodegenModule}(m)\ \Downarrow \ \mathsf{IR}\quad \mathsf{IR}'\ =\ \operatorname{WithEntry}(P,\ m,\ \mathsf{IR})\quad \Gamma \ \vdash \ \operatorname{LowerIR}(\mathsf{IR}')\ \Downarrow \ L\quad \Gamma \ \vdash \ \operatorname{EmitLLVM}(L)\ \Downarrow \ b \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CodegenIR}(m,\ e)\ \Downarrow \ b
\end{array}
$$

**File Emission.**

$$
\begin{array}{l}
\operatorname{WriteFileOk}(p,\ b)\ \Rightarrow \ \operatorname{Overwrites}(p,\ b) \\[0.16em]
\operatorname{Overwrites}(p,\ b)\ \Leftrightarrow \ \exists \ \mathsf{fs},\ \omega ,\ \omega '.\ \operatorname{FSWriteFile}(\mathsf{fs},\ p,\ b,\ \omega )\ \Downarrow \ (\mathsf{ok},\ \omega ')
\end{array}
$$

**Directory Creation.**

$$
\begin{array}{l}
\operatorname{EnsureDir}(p)\ \Downarrow \ \mathsf{ok}\ \Rightarrow \ \operatorname{IsDir}(p) \\[0.16em]
\operatorname{IsDir}(p)\ \Leftrightarrow \ \exists \ \mathsf{fs},\ \omega ,\ \omega '.\ \operatorname{FSKind}(\mathsf{fs},\ p,\ \omega )\ \Downarrow \ (\texttt{Dir},\ \omega ') \\[0.16em]
\operatorname{IsFile}(p)\ \Leftrightarrow \ \operatorname{FSKind}(p)\ =\ \mathsf{File}
\end{array}
$$

**Emit Objects**

**(Emit-Objects-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitObjects}([],\ P)\ \Downarrow \ []
\end{array}
$$

**(Emit-Objects-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CodegenObj}(m)\ \Downarrow \ b\quad \Gamma \ \vdash \ \operatorname{WriteFile}(\operatorname{ObjPath}(P,\ m),\ b)\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{EmitObjects}(\mathsf{ms},\ P)\ \Downarrow \ L \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitObjects}(m\mathbin{::} \mathsf{ms},\ P)\ \Downarrow \ \operatorname{ObjPath}(P,\ m)\mathbin{::} L
\end{array}
$$

**Emit IR**

**(Emit-IR-None)**
e = `none`

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitIR}(\mathsf{ms},\ P,\ e)\ \Downarrow \ []
\end{array}
$$

**(Emit-IR-Cons-LL)**

$$
\begin{array}{l}
e\ =\ \texttt{ll}\quad \Gamma \ \vdash \ \operatorname{CodegenIR}(m,\ e)\ \Downarrow \ b\quad \Gamma \ \vdash \ \operatorname{WriteFile}(\operatorname{IRPath}(P,\ m,\ e),\ b)\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{EmitIR}(\mathsf{ms},\ P,\ e)\ \Downarrow \ L \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitIR}(m\mathbin{::} \mathsf{ms},\ P,\ e)\ \Downarrow \ \operatorname{IRPath}(P,\ m,\ e)\mathbin{::} L
\end{array}
$$

**(Emit-IR-Cons-BC)**

$$
\begin{array}{l}
e\ =\ \texttt{bc}\quad \Gamma \ \vdash \ \operatorname{CodegenIR}(m,\ \texttt{ll})\ \Downarrow \ t\quad \Gamma \ \vdash \ \operatorname{ResolveTool}(\texttt{llvm-as})\ \Downarrow \ a\quad \Gamma \ \vdash \ \operatorname{AssembleIR}(a,\ t)\ \Downarrow \ b\quad \Gamma \ \vdash \ \operatorname{WriteFile}(\operatorname{IRPath}(P,\ m,\ e),\ b)\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{EmitIR}(\mathsf{ms},\ P,\ e)\ \Downarrow \ L \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitIR}(m\mathbin{::} \mathsf{ms},\ P,\ e)\ \Downarrow \ \operatorname{IRPath}(P,\ m,\ e)\mathbin{::} L
\end{array}
$$

$$
\begin{array}{l}
\operatorname{EmitIRFail}(m,\ P,\ \texttt{ll})\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{CodegenIR}(m,\ \texttt{ll})\ \Uparrow \ \lor \ (\exists \ b.\ \Gamma \ \vdash \ \operatorname{CodegenIR}(m,\ \texttt{ll})\ \Downarrow \ b\ \land \ \Gamma \ \vdash \ \operatorname{WriteFile}(\operatorname{IRPath}(P,\ m,\ \texttt{ll}),\ b)\ \Uparrow ) \\[0.16em]
\operatorname{EmitIRFail}(m,\ P,\ \texttt{bc})\ \Leftrightarrow  \\[0.16em]
\ \Gamma \ \vdash \ \operatorname{CodegenIR}(m,\ \texttt{ll})\ \Uparrow \ \lor  \\[0.16em]
\ (\exists \ t.\ \Gamma \ \vdash \ \operatorname{CodegenIR}(m,\ \texttt{ll})\ \Downarrow \ t\ \land \ \Gamma \ \vdash \ \operatorname{ResolveTool}(\texttt{llvm-as})\ \Uparrow )\ \lor  \\[0.16em]
\ (\exists \ t,\ a.\ \Gamma \ \vdash \ \operatorname{CodegenIR}(m,\ \texttt{ll})\ \Downarrow \ t\ \land \ \Gamma \ \vdash \ \operatorname{ResolveTool}(\texttt{llvm-as})\ \Downarrow \ a\ \land \ \Gamma \ \vdash \ \operatorname{AssembleIR}(a,\ t)\ \Uparrow )\ \lor  \\[0.16em]
\ (\exists \ t,\ a,\ b.\ \Gamma \ \vdash \ \operatorname{CodegenIR}(m,\ \texttt{ll})\ \Downarrow \ t\ \land \ \Gamma \ \vdash \ \operatorname{ResolveTool}(\texttt{llvm-as})\ \Downarrow \ a\ \land \ \Gamma \ \vdash \ \operatorname{AssembleIR}(a,\ t)\ \Downarrow \ b\ \land \ \Gamma \ \vdash \ \operatorname{WriteFile}(\operatorname{IRPath}(P,\ m,\ \texttt{bc}),\ b)\ \Uparrow )
\end{array}
$$

**(Emit-IR-Err)**

$$
\begin{array}{l}
\operatorname{EmitIRFail}(m,\ P,\ e)\quad c\ =\ \operatorname{Code}(\mathsf{Out}-\mathsf{IR}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitIR}(m\mathbin{::} \mathsf{ms},\ P,\ e)\ \Uparrow \ c
\end{array}
$$

$$
\begin{array}{l}
\mathsf{LinkJudg}\ =\ \{\mathsf{AssemblyGraph},\ \mathsf{ResolveRuntimeLib},\ \mathsf{BuildLibrariesSeq},\ \mathsf{BuildLibraries},\ \mathsf{Link},\ \mathsf{Archive},\ \mathsf{Finalize}\} \\[0.16em]
\mathsf{RuntimeLibName}\ =\ \operatorname{RuntimeLibNameFor}(\mathsf{SelectedTargetProfile}) \\[0.16em]
\operatorname{CompilerExecutableDir}(P)\ =\ \operatorname{DirectoryOf}(\mathsf{CurrentCompilerExecutable}) \\[0.16em]
\operatorname{LegacySidecarsBeside}(d)\ \Leftrightarrow \ \operatorname{exists}(d\ /\ \texttt{runtime})\ \lor \ \operatorname{exists}(d\ /\ \texttt{tools})\ \lor \ \operatorname{exists}(d\ /\ \texttt{bin})\ \lor \ \operatorname{exists}(d\ /\ \texttt{lib}) \\[0.16em]
\operatorname{PackagedHostSidecarsBeside}(d)\ \Leftrightarrow \ \operatorname{exists}(d\ /\ \texttt{windows}\ /\ \texttt{tools})\ \lor \ \operatorname{exists}(d\ /\ \texttt{windows}\ /\ \texttt{bin})\ \lor \ \operatorname{exists}(d\ /\ \texttt{windows}\ /\ \texttt{lib})\ \lor \ \operatorname{exists}(d\ /\ \texttt{linux}\ /\ \texttt{tools})\ \lor \ \operatorname{exists}(d\ /\ \texttt{linux}\ /\ \texttt{bin})\ \lor \ \operatorname{exists}(d\ /\ \texttt{linux}\ /\ \texttt{lib}) \\[0.16em]
\operatorname{CompilerSupportRoot}(P)\ =\ \operatorname{CompilerExecutableDir}(P)\quad \mathsf{if}\ \operatorname{PackagedHostSidecarsBeside}(\operatorname{CompilerExecutableDir}(P)) \\[0.16em]
\ \operatorname{CompilerExecutableDir}(P)\quad \mathsf{if}\ \operatorname{LegacySidecarsBeside}(\operatorname{CompilerExecutableDir}(P)) \\[0.16em]
\ \operatorname{Parent}(\operatorname{CompilerExecutableDir}(P))\quad \mathsf{if}\ \operatorname{LegacySidecarsBeside}(\operatorname{Parent}(\operatorname{CompilerExecutableDir}(P))) \\[0.16em]
\ \operatorname{CompilerExecutableDir}(P)\quad \mathsf{otherwise} \\[0.16em]
\operatorname{CompilerRuntimeLibPath}(P)\ =\ \operatorname{CompilerExecutableDir}(P)\ /\ \mathsf{RuntimeLibName}\quad \mathsf{if}\ \operatorname{exists}(\operatorname{CompilerExecutableDir}(P)\ /\ \mathsf{RuntimeLibName}) \\[0.16em]
\ \operatorname{CompilerSupportRoot}(P)\ /\ \texttt{runtime}\ /\ \mathsf{RuntimeLibName}\quad \mathsf{otherwise} \\[0.16em]
\operatorname{RuntimeLibPath}(P)\ = \\[0.16em]
\ \operatorname{ToolchainConfig}(P).\mathsf{runtime}_{\mathsf{lib}}\ \mathsf{if}\ \operatorname{ToolchainConfig}(P).\mathsf{runtime}_{\mathsf{lib}}\ \ne \ \bot  \\[0.16em]
\ \operatorname{CompilerRuntimeLibPath}(P)\quad \mathsf{otherwise}
\end{array}
$$

**(ResolveRuntimeLib-Ok)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ReadBytes}(\operatorname{RuntimeLibPath}(P))\ \Downarrow \ \_ \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveRuntimeLib}(P)\ \Downarrow \ \operatorname{RuntimeLibPath}(P)
\end{array}
$$

**(ResolveRuntimeLib-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ReadBytes}(\operatorname{RuntimeLibPath}(P))\ \Uparrow  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveRuntimeLib}(P)\ \Uparrow 
\end{array}
$$

**(Build-LibrariesSeq-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuildLibrariesSeq}([],\ P)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(Build-LibrariesSeq-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{OutputPipeline}(\operatorname{AssemblyProject}(P,\ A))\ \Downarrow \ \_\quad \Gamma \ \vdash \ \operatorname{BuildLibrariesSeq}(\mathsf{As},\ P)\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuildLibrariesSeq}(A\mathbin{::} \mathsf{As},\ P)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(Build-Libraries-Ok)**

$$
\begin{array}{l}
\operatorname{LibraryTopo}(P)\ =\ \mathsf{As}\quad \Gamma \ \vdash \ \operatorname{BuildLibrariesSeq}(\mathsf{As},\ P)\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuildLibraries}(P)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{LinkerSyms}\ :\ \mathsf{Path}\ \times \ \operatorname{List}(\mathsf{Path})\ \times \ \mathsf{Path}\ \rightharpoonup \ \wp (\mathsf{Symbol}) \\[0.16em]
\mathsf{RuntimeRequiredSyms}\ =\ \mathsf{RuntimeSyms} \\[0.16em]
\operatorname{MissingRuntimeSym}(t,\ L,\ \mathsf{out})\ \Leftrightarrow \ \mathsf{RuntimeRequiredSyms}\ \nsubseteq \ \operatorname{LinkerSyms}(t,\ L,\ \mathsf{out})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LinkObjs}(P)\ =\ \operatorname{ObjPaths}(P,\ \operatorname{EmitModuleList}(P)) \\[0.16em]
\operatorname{LinkMode}(P)\ = \\[0.16em]
\ \texttt{exe}\quad \mathsf{if}\ \operatorname{Executable}(P) \\[0.16em]
\ \texttt{shared}\ \mathsf{if}\ \operatorname{SharedLibrary}(P) \\[0.16em]
\ \bot \quad \mathsf{otherwise} \\[0.16em]
\operatorname{LinkOutputPath}(P)\ = \\[0.16em]
\ \operatorname{ExePath}(P)\quad \mathsf{if}\ \operatorname{Executable}(P) \\[0.16em]
\ \operatorname{SharedLibPath}(P)\ \mathsf{if}\ \operatorname{SharedLibrary}(P) \\[0.16em]
\ \bot \quad \mathsf{otherwise} \\[0.16em]
\operatorname{LinkImportLibOpt}(P)\ = \\[0.16em]
\ \operatorname{ImportLibPath}(P)\ \mathsf{if}\ \operatorname{SharedLibrary}(P)\ \land \ \operatorname{EmitsImportLib}(\mathsf{SelectedTargetProfile}) \\[0.16em]
\ \bot \quad \mathsf{otherwise} \\[0.16em]
\operatorname{LinkInputs}(P)\ =\ \operatorname{LinkObjs}(P)\ \mathbin{++} \ \operatorname{LibraryArtifactInputs}(P)\ \mathbin{++} \ [\operatorname{RuntimeLibPath}(P)] \\[0.16em]
\operatorname{ArchiveInputs}(P)\ =\ \operatorname{LinkObjs}(P) \\[0.16em]
\operatorname{LinkFlags}(P)\ =\ \operatorname{LinkFlagsFor}(\mathsf{SelectedTargetProfile},\ \operatorname{LinkMode}(P),\ \operatorname{LinkOutputPath}(P),\ \operatorname{LinkImportLibOpt}(P)) \\[0.16em]
\operatorname{ArchiveFlags}(P)\ =\ \operatorname{ArchiveFlagsFor}(\mathsf{SelectedTargetProfile},\ \operatorname{StaticLibPath}(P)) \\[0.16em]
\operatorname{LinkArgsOk}(P,\ L,\ \mathsf{out},\ \mathsf{imp})\ \Leftrightarrow \ L\ =\ \operatorname{LinkInputs}(P)\ \land \ \mathsf{out}\ =\ \operatorname{LinkOutputPath}(P)\ \land \ \mathsf{imp}\ =\ \operatorname{LinkImportLibOpt}(P)\ \land \ \operatorname{LinkFlags}(P)\ =\ \operatorname{LinkFlagsFor}(\mathsf{SelectedTargetProfile},\ \operatorname{LinkMode}(P),\ \operatorname{LinkOutputPath}(P),\ \operatorname{LinkImportLibOpt}(P)) \\[0.16em]
\operatorname{ArchiveArgsOk}(P,\ L,\ \mathsf{out})\ \Leftrightarrow \ L\ =\ \operatorname{ArchiveInputs}(P)\ \land \ \mathsf{out}\ =\ \operatorname{StaticLibPath}(P)\ \land \ \operatorname{ArchiveFlags}(P)\ =\ \operatorname{ArchiveFlagsFor}(\mathsf{SelectedTargetProfile},\ \operatorname{StaticLibPath}(P))
\end{array}
$$

**(Link-Ok)**

$$
\begin{array}{l}
\operatorname{Executable}(P)\ \lor \ \operatorname{SharedLibrary}(P)\quad \Gamma \ \vdash \ \operatorname{AssemblyGraph}(P)\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{BuildLibraries}(P)\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{ResolveTool}(\operatorname{LinkerToolName}(\mathsf{SelectedTargetProfile}))\ \Downarrow \ t\quad \Gamma \ \vdash \ \operatorname{ResolveRuntimeLib}(P)\ \Downarrow \ \mathsf{lib}\quad \operatorname{LinkArgsOk}(P,\ \mathsf{Objs}\ \mathbin{++} \ \operatorname{LibraryArtifactInputs}(P)\ \mathbin{++} \ [\mathsf{lib}],\ \operatorname{LinkOutputPath}(P),\ \operatorname{LinkImportLibOpt}(P))\quad \Gamma \ \vdash \ \operatorname{InvokeLinker}(t,\ \mathsf{Objs}\ \mathbin{++} \ \operatorname{LibraryArtifactInputs}(P)\ \mathbin{++} \ [\mathsf{lib}],\ \operatorname{LinkOutputPath}(P),\ \operatorname{LinkImportLibOpt}(P))\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Link}(\mathsf{Objs},\ P)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(Link-NotFound)**

$$
\begin{array}{l}
\operatorname{Executable}(P)\ \lor \ \operatorname{SharedLibrary}(P)\quad \Gamma \ \vdash \ \operatorname{AssemblyGraph}(P)\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{BuildLibraries}(P)\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{ResolveTool}(\operatorname{LinkerToolName}(\mathsf{SelectedTargetProfile}))\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{Out}-\mathsf{Link}-\mathsf{NotFound}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Link}(\mathsf{Objs},\ P)\ \Uparrow \ c
\end{array}
$$

**(Link-Runtime-Missing)**

$$
\begin{array}{l}
\operatorname{Executable}(P)\ \lor \ \operatorname{SharedLibrary}(P)\quad \Gamma \ \vdash \ \operatorname{AssemblyGraph}(P)\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{BuildLibraries}(P)\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{ResolveTool}(\operatorname{LinkerToolName}(\mathsf{SelectedTargetProfile}))\ \Downarrow \ t\quad \Gamma \ \vdash \ \operatorname{ResolveRuntimeLib}(P)\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{Out}-\mathsf{Link}-\mathsf{Runtime}-\mathsf{Missing}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Link}(\mathsf{Objs},\ P)\ \Uparrow \ c
\end{array}
$$

**(Link-Runtime-Incompatible)**

$$
\begin{array}{l}
\operatorname{Executable}(P)\ \lor \ \operatorname{SharedLibrary}(P)\quad \Gamma \ \vdash \ \operatorname{AssemblyGraph}(P)\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{BuildLibraries}(P)\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{ResolveTool}(\operatorname{LinkerToolName}(\mathsf{SelectedTargetProfile}))\ \Downarrow \ t\quad \Gamma \ \vdash \ \operatorname{ResolveRuntimeLib}(P)\ \Downarrow \ \mathsf{lib}\quad \operatorname{LinkArgsOk}(P,\ \mathsf{Objs}\ \mathbin{++} \ \operatorname{LibraryArtifactInputs}(P)\ \mathbin{++} \ [\mathsf{lib}],\ \operatorname{LinkOutputPath}(P),\ \operatorname{LinkImportLibOpt}(P))\quad \operatorname{MissingRuntimeSym}(t,\ \mathsf{Objs}\ \mathbin{++} \ \operatorname{LibraryArtifactInputs}(P)\ \mathbin{++} \ [\mathsf{lib}],\ \operatorname{LinkOutputPath}(P))\quad c\ =\ \operatorname{Code}(\mathsf{Out}-\mathsf{Link}-\mathsf{Runtime}-\mathsf{Incompatible}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Link}(\mathsf{Objs},\ P)\ \Uparrow \ c
\end{array}
$$

**(Link-Fail)**

$$
\begin{array}{l}
\operatorname{Executable}(P)\ \lor \ \operatorname{SharedLibrary}(P)\quad \Gamma \ \vdash \ \operatorname{AssemblyGraph}(P)\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{BuildLibraries}(P)\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{ResolveTool}(\operatorname{LinkerToolName}(\mathsf{SelectedTargetProfile}))\ \Downarrow \ t\quad \Gamma \ \vdash \ \operatorname{ResolveRuntimeLib}(P)\ \Downarrow \ \mathsf{lib}\quad \operatorname{LinkArgsOk}(P,\ \mathsf{Objs}\ \mathbin{++} \ \operatorname{LibraryArtifactInputs}(P)\ \mathbin{++} \ [\mathsf{lib}],\ \operatorname{LinkOutputPath}(P),\ \operatorname{LinkImportLibOpt}(P))\quad \lnot \ \operatorname{MissingRuntimeSym}(t,\ \mathsf{Objs}\ \mathbin{++} \ \operatorname{LibraryArtifactInputs}(P)\ \mathbin{++} \ [\mathsf{lib}],\ \operatorname{LinkOutputPath}(P))\quad \Gamma \ \vdash \ \operatorname{InvokeLinker}(t,\ \mathsf{Objs}\ \mathbin{++} \ \operatorname{LibraryArtifactInputs}(P)\ \mathbin{++} \ [\mathsf{lib}],\ \operatorname{LinkOutputPath}(P),\ \operatorname{LinkImportLibOpt}(P))\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{Out}-\mathsf{Link}-\mathsf{Fail}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Link}(\mathsf{Objs},\ P)\ \Uparrow \ c
\end{array}
$$

**(Archive-Ok)**

$$
\begin{array}{l}
\operatorname{StaticLibrary}(P)\quad \Gamma \ \vdash \ \operatorname{AssemblyGraph}(P)\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{BuildLibraries}(P)\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{ResolveTool}(\operatorname{ArchiverToolName}(\mathsf{SelectedTargetProfile}))\ \Downarrow \ t\quad \operatorname{ArchiveArgsOk}(P,\ \mathsf{Objs},\ \operatorname{StaticLibPath}(P))\quad \Gamma \ \vdash \ \operatorname{InvokeArchiver}(t,\ \mathsf{Objs},\ \operatorname{StaticLibPath}(P))\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Archive}(\mathsf{Objs},\ P)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(Archive-NotFound)**

$$
\begin{array}{l}
\operatorname{StaticLibrary}(P)\quad \Gamma \ \vdash \ \operatorname{AssemblyGraph}(P)\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{BuildLibraries}(P)\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{ResolveTool}(\operatorname{ArchiverToolName}(\mathsf{SelectedTargetProfile}))\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{Out}-\mathsf{Link}-\mathsf{NotFound}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Archive}(\mathsf{Objs},\ P)\ \Uparrow \ c
\end{array}
$$

**(Archive-Fail)**

$$
\begin{array}{l}
\operatorname{StaticLibrary}(P)\quad \Gamma \ \vdash \ \operatorname{AssemblyGraph}(P)\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{BuildLibraries}(P)\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{ResolveTool}(\operatorname{ArchiverToolName}(\mathsf{SelectedTargetProfile}))\ \Downarrow \ t\quad \operatorname{ArchiveArgsOk}(P,\ \mathsf{Objs},\ \operatorname{StaticLibPath}(P))\quad \Gamma \ \vdash \ \operatorname{InvokeArchiver}(t,\ \mathsf{Objs},\ \operatorname{StaticLibPath}(P))\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{Out}-\mathsf{Link}-\mathsf{Fail}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Archive}(\mathsf{Objs},\ P)\ \Uparrow \ c
\end{array}
$$

**(Finalize-Link)**

$$
\begin{array}{l}
\operatorname{Executable}(P)\ \lor \ \operatorname{SharedLibrary}(P)\quad \Gamma \ \vdash \ \operatorname{Link}(\mathsf{Objs},\ P)\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Finalize}(\mathsf{Objs},\ P)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(Finalize-Archive)**

$$
\begin{array}{l}
\operatorname{StaticLibrary}(P)\quad \Gamma \ \vdash \ \operatorname{Archive}(\mathsf{Objs},\ P)\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Finalize}(\mathsf{Objs},\ P)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**Output Pipeline (Big-Step)**

$$
\begin{array}{l}
O\ =\ \operatorname{OutputRoot}(P) \\[0.16em]
\mathsf{ms}\ =\ \operatorname{EmitModuleList}(P) \\[0.16em]
e\ =\ P.\mathsf{assembly}.\mathsf{emit}_{\mathsf{ir}}
\end{array}
$$

**(Output-Pipeline-Linkable)**

$$
\begin{array}{l}
\operatorname{Linkable}(P)\quad \Gamma \ \vdash \ \operatorname{EnsureDir}(O)\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{obj})\ \Downarrow \ \mathsf{ok}\quad (\lnot \ \operatorname{UsesBinDir}(P)\ \lor \ \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{bin})\ \Downarrow \ \mathsf{ok})\quad (\lnot \ \operatorname{UsesLibDir}(P)\ \lor \ \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{lib})\ \Downarrow \ \mathsf{ok})\quad (e\ =\ \texttt{none}\ \lor \ \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{ir})\ \Downarrow \ \mathsf{ok})\quad \Gamma \ \vdash \ \operatorname{EmitObjects}(\mathsf{ms},\ P)\ \Downarrow \ \mathsf{Objs}\quad \Gamma \ \vdash \ \operatorname{EmitIR}(\mathsf{ms},\ P,\ e)\ \Downarrow \ \mathsf{IRs}\quad \Gamma \ \vdash \ \operatorname{Finalize}(\mathsf{Objs},\ P)\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{OutputPipeline}(P)\ \Downarrow \ (\mathsf{Objs},\ \mathsf{IRs},\ \operatorname{PrimaryArtifact}(P))
\end{array}
$$

**(Output-Pipeline-Dependency)**

$$
\begin{array}{l}
\operatorname{Dependency}(P)\quad \Gamma \ \vdash \ \operatorname{EnsureDir}(O)\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{obj})\ \Downarrow \ \mathsf{ok}\quad (e\ =\ \texttt{none}\ \lor \ \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{ir})\ \Downarrow \ \mathsf{ok})\quad \Gamma \ \vdash \ \operatorname{EmitObjects}(\mathsf{ms},\ P)\ \Downarrow \ \mathsf{Objs}\quad \Gamma \ \vdash \ \operatorname{EmitIR}(\mathsf{ms},\ P,\ e)\ \Downarrow \ \mathsf{IRs} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{OutputPipeline}(P)\ \Downarrow \ (\mathsf{Objs},\ \mathsf{IRs},\ \bot )
\end{array}
$$

**(Output-Pipeline-Err)**

$$
\begin{array}{l}
\langle \operatorname{OutStart}(P)\rangle \ \to *\ \langle \operatorname{Error}(c)\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{OutputPipeline}(P)\ \Uparrow \ c
\end{array}
$$

**Output Pipeline (Small-Step)**

$$
\begin{array}{l}
\mathsf{OutState}\ =\ \{\operatorname{OutStart}(P),\ \operatorname{OutDirs}(P),\ \operatorname{OutObjs}(P,\ \mathsf{ms},\ \mathsf{Objs}),\ \operatorname{OutIR}(P,\ \mathsf{ms},\ \mathsf{Objs},\ \mathsf{IRs},\ e),\ \operatorname{OutFinal}(P,\ \mathsf{Objs},\ \mathsf{IRs}),\ \operatorname{OutDone}(\mathsf{Objs},\ \mathsf{IRs},\ \mathsf{Artifact}),\ \operatorname{Error}(\mathsf{code})\} \\[0.16em]
O\ =\ \operatorname{OutputRoot}(P) \\[0.16em]
\mathsf{ms}\ =\ \operatorname{EmitModuleList}(P) \\[0.16em]
e\ =\ P.\mathsf{assembly}.\mathsf{emit}_{\mathsf{ir}}
\end{array}
$$

**(Out-Start)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{OutStart}(P)\rangle \ \to \ \langle \operatorname{OutDirs}(P)\rangle 
\end{array}
$$

**(Out-Dirs-Ok)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EnsureDir}(O)\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{obj})\ \Downarrow \ \mathsf{ok}\quad (\lnot \ \operatorname{UsesBinDir}(P)\ \lor \ \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{bin})\ \Downarrow \ \mathsf{ok})\quad (\lnot \ \operatorname{UsesLibDir}(P)\ \lor \ \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{lib})\ \Downarrow \ \mathsf{ok})\quad (e\ =\ \texttt{none}\ \lor \ \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{ir})\ \Downarrow \ \mathsf{ok}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{OutDirs}(P)\rangle \ \to \ \langle \operatorname{OutObjs}(P,\ \mathsf{ms},\ [])\rangle 
\end{array}
$$

**(Out-Dirs-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EnsureDir}(O)\ \Uparrow \ \lor \ \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{obj})\ \Uparrow \ \lor \ (\operatorname{UsesBinDir}(P)\ \land \ \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{bin})\ \Uparrow )\ \lor \ (\operatorname{UsesLibDir}(P)\ \land \ \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{lib})\ \Uparrow )\ \lor \ (e\ \in \ \{\texttt{ll},\ \texttt{bc}\}\ \land \ \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{ir})\ \Uparrow ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{OutDirs}(P)\rangle \ \to \ \langle \operatorname{Error}(\operatorname{Code}(\mathsf{Out}-\mathsf{Dirs}-\mathsf{Err}))\rangle 
\end{array}
$$

**(Out-Obj-Collision)**

$$
\begin{array}{l}
\lnot \ \operatorname{Distinct}(L\ \mathbin{++} \ \operatorname{ObjPaths}(P,\ \mathsf{ms})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{OutObjs}(P,\ \mathsf{ms},\ L)\rangle \ \to \ \langle \operatorname{Error}(\operatorname{Code}(\mathsf{Out}-\mathsf{Obj}-\mathsf{Collision}))\rangle 
\end{array}
$$

**(Out-Obj-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CodegenObj}(m)\ \Downarrow \ b\quad \Gamma \ \vdash \ \operatorname{WriteFile}(\operatorname{ObjPath}(P,\ m),\ b)\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{OutObjs}(P,\ m\mathbin{::} \mathsf{ms},\ L)\rangle \ \to \ \langle \operatorname{OutObjs}(P,\ \mathsf{ms},\ L\ \mathbin{++} \ [\operatorname{ObjPath}(P,\ m)])\rangle 
\end{array}
$$

**(Out-Obj-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CodegenObj}(m)\ \Uparrow \ \lor \ (\Gamma \ \vdash \ \operatorname{CodegenObj}(m)\ \Downarrow \ b\ \land \ \Gamma \ \vdash \ \operatorname{WriteFile}(\operatorname{ObjPath}(P,\ m),\ b)\ \Uparrow ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{OutObjs}(P,\ m\mathbin{::} \mathsf{ms},\ L)\rangle \ \to \ \langle \operatorname{Error}(\operatorname{Code}(\mathsf{Out}-\mathsf{Obj}-\mathsf{Err}))\rangle 
\end{array}
$$

**(Out-Obj-Done)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{OutObjs}(P,\ [],\ L)\rangle \ \to \ \langle \operatorname{OutIR}(P,\ \operatorname{EmitModuleList}(P),\ L,\ [],\ e)\rangle 
\end{array}
$$

**(Out-IR-None-Finalize)**

$$
\begin{array}{l}
e\ =\ \texttt{none}\quad \operatorname{Linkable}(P) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{OutIR}(P,\ \mathsf{ms},\ \mathsf{Objs},\ \mathsf{IRs},\ e)\rangle \ \to \ \langle \operatorname{OutFinal}(P,\ \mathsf{Objs},\ \mathsf{IRs})\rangle 
\end{array}
$$

**(Out-IR-None-NoFinalize)**

$$
\begin{array}{l}
e\ =\ \texttt{none}\quad \operatorname{Dependency}(P) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{OutIR}(P,\ \mathsf{ms},\ \mathsf{Objs},\ \mathsf{IRs},\ e)\rangle \ \to \ \langle \operatorname{OutDone}(\mathsf{Objs},\ \mathsf{IRs},\ \bot )\rangle 
\end{array}
$$

**(Out-IR-Collision)**

$$
\begin{array}{l}
e\ \in \ \{\texttt{ll},\ \texttt{bc}\}\quad \lnot \ \operatorname{Distinct}(\mathsf{IRs}\ \mathbin{++} \ \operatorname{IRPaths}(P,\ \mathsf{ms},\ e)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{OutIR}(P,\ \mathsf{ms},\ \mathsf{Objs},\ \mathsf{IRs},\ e)\rangle \ \to \ \langle \operatorname{Error}(\operatorname{Code}(\mathsf{Out}-\mathsf{IR}-\mathsf{Collision}))\rangle 
\end{array}
$$

**(Out-IR-Cons-LL)**

$$
\begin{array}{l}
e\ =\ \texttt{ll}\quad \Gamma \ \vdash \ \operatorname{CodegenIR}(m,\ e)\ \Downarrow \ b\quad \Gamma \ \vdash \ \operatorname{WriteFile}(\operatorname{IRPath}(P,\ m,\ e),\ b)\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{OutIR}(P,\ m\mathbin{::} \mathsf{ms},\ \mathsf{Objs},\ \mathsf{IRs},\ e)\rangle \ \to \ \langle \operatorname{OutIR}(P,\ \mathsf{ms},\ \mathsf{Objs},\ \mathsf{IRs}\ \mathbin{++} \ [\operatorname{IRPath}(P,\ m,\ e)],\ e)\rangle 
\end{array}
$$

**(Out-IR-Cons-BC)**

$$
\begin{array}{l}
e\ =\ \texttt{bc}\quad \Gamma \ \vdash \ \operatorname{CodegenIR}(m,\ \texttt{ll})\ \Downarrow \ t\quad \Gamma \ \vdash \ \operatorname{ResolveTool}(\texttt{llvm-as})\ \Downarrow \ a\quad \Gamma \ \vdash \ \operatorname{AssembleIR}(a,\ t)\ \Downarrow \ b\quad \Gamma \ \vdash \ \operatorname{WriteFile}(\operatorname{IRPath}(P,\ m,\ e),\ b)\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{OutIR}(P,\ m\mathbin{::} \mathsf{ms},\ \mathsf{Objs},\ \mathsf{IRs},\ e)\rangle \ \to \ \langle \operatorname{OutIR}(P,\ \mathsf{ms},\ \mathsf{Objs},\ \mathsf{IRs}\ \mathbin{++} \ [\operatorname{IRPath}(P,\ m,\ e)],\ e)\rangle 
\end{array}
$$

**(Out-IR-Err)**

$$
\begin{array}{l}
(e\ =\ \texttt{ll}\ \land \ (\Gamma \ \vdash \ \operatorname{CodegenIR}(m,\ e)\ \Uparrow \ \lor \ (\Gamma \ \vdash \ \operatorname{CodegenIR}(m,\ e)\ \Downarrow \ b\ \land \ \Gamma \ \vdash \ \operatorname{WriteFile}(\operatorname{IRPath}(P,\ m,\ e),\ b)\ \Uparrow )))\ \lor  \\[0.16em]
(e\ =\ \texttt{bc}\ \land \ (\Gamma \ \vdash \ \operatorname{CodegenIR}(m,\ \texttt{ll})\ \Uparrow \ \lor \ (\Gamma \ \vdash \ \operatorname{CodegenIR}(m,\ \texttt{ll})\ \Downarrow \ t\ \land \ \Gamma \ \vdash \ \operatorname{ResolveTool}(\texttt{llvm-as})\ \Uparrow )\ \lor \ (\Gamma \ \vdash \ \operatorname{CodegenIR}(m,\ \texttt{ll})\ \Downarrow \ t\ \land \ \Gamma \ \vdash \ \operatorname{ResolveTool}(\texttt{llvm-as})\ \Downarrow \ a\ \land \ \Gamma \ \vdash \ \operatorname{AssembleIR}(a,\ t)\ \Uparrow )\ \lor \ (\Gamma \ \vdash \ \operatorname{CodegenIR}(m,\ \texttt{ll})\ \Downarrow \ t\ \land \ \Gamma \ \vdash \ \operatorname{ResolveTool}(\texttt{llvm-as})\ \Downarrow \ a\ \land \ \Gamma \ \vdash \ \operatorname{AssembleIR}(a,\ t)\ \Downarrow \ b\ \land \ \Gamma \ \vdash \ \operatorname{WriteFile}(\operatorname{IRPath}(P,\ m,\ e),\ b)\ \Uparrow ))) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{OutIR}(P,\ m\mathbin{::} \mathsf{ms},\ \mathsf{Objs},\ \mathsf{IRs},\ e)\rangle \ \to \ \langle \operatorname{Error}(\operatorname{Code}(\mathsf{Out}-\mathsf{IR}-\mathsf{Err}))\rangle 
\end{array}
$$

**(Out-IR-Done-Finalize)**

$$
\begin{array}{l}
e\ \in \ \{\texttt{ll},\ \texttt{bc}\}\quad \mathsf{ms}\ =\ []\quad \operatorname{Linkable}(P) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{OutIR}(P,\ \mathsf{ms},\ \mathsf{Objs},\ \mathsf{IRs},\ e)\rangle \ \to \ \langle \operatorname{OutFinal}(P,\ \mathsf{Objs},\ \mathsf{IRs})\rangle 
\end{array}
$$

**(Out-IR-Done-NoFinalize)**

$$
\begin{array}{l}
e\ \in \ \{\texttt{ll},\ \texttt{bc}\}\quad \mathsf{ms}\ =\ []\quad \operatorname{Dependency}(P) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{OutIR}(P,\ \mathsf{ms},\ \mathsf{Objs},\ \mathsf{IRs},\ e)\rangle \ \to \ \langle \operatorname{OutDone}(\mathsf{Objs},\ \mathsf{IRs},\ \bot )\rangle 
\end{array}
$$

**(Out-Final-Link-Ok)**

$$
\begin{array}{l}
\operatorname{Executable}(P)\ \lor \ \operatorname{SharedLibrary}(P)\quad \Gamma \ \vdash \ \operatorname{Link}(\mathsf{Objs},\ P)\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{OutFinal}(P,\ \mathsf{Objs},\ \mathsf{IRs})\rangle \ \to \ \langle \operatorname{OutDone}(\mathsf{Objs},\ \mathsf{IRs},\ \operatorname{PrimaryArtifact}(P))\rangle 
\end{array}
$$

**(Out-Final-Link-Err)**

$$
\begin{array}{l}
\operatorname{Executable}(P)\ \lor \ \operatorname{SharedLibrary}(P)\quad \Gamma \ \vdash \ \operatorname{Link}(\mathsf{Objs},\ P)\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{OutFinal}(P,\ \mathsf{Objs},\ \mathsf{IRs})\rangle \ \to \ \langle \operatorname{Error}(c)\rangle 
\end{array}
$$

**(Out-Final-Archive-Ok)**

$$
\begin{array}{l}
\operatorname{StaticLibrary}(P)\quad \Gamma \ \vdash \ \operatorname{Archive}(\mathsf{Objs},\ P)\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{OutFinal}(P,\ \mathsf{Objs},\ \mathsf{IRs})\rangle \ \to \ \langle \operatorname{OutDone}(\mathsf{Objs},\ \mathsf{IRs},\ \operatorname{PrimaryArtifact}(P))\rangle 
\end{array}
$$

**(Out-Final-Archive-Err)**

$$
\begin{array}{l}
\operatorname{StaticLibrary}(P)\quad \Gamma \ \vdash \ \operatorname{Archive}(\mathsf{Objs},\ P)\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{OutFinal}(P,\ \mathsf{Objs},\ \mathsf{IRs})\rangle \ \to \ \langle \operatorname{Error}(c)\rangle 
\end{array}
$$

## 3.7 Tool Resolution and IR Assembly Inputs

$$
\begin{array}{l}
\operatorname{SearchDirs}(P)\ = \\[0.16em]
\ [\operatorname{ToolchainConfig}(P).\mathsf{llvm}_{\mathsf{bin}}]\ \mathsf{if}\ \operatorname{ToolchainConfig}(P).\mathsf{llvm}_{\mathsf{bin}}\ \ne \ \bot  \\[0.16em]
\ [\operatorname{CompilerToolBinDir}(P)]\quad \mathsf{if}\ \operatorname{exists}(\operatorname{CompilerToolBinDir}(P)) \\[0.16em]
\ \mathsf{PATHDirs}\ \mathsf{otherwise}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{CompilerToolBinDir}(P)\ =\ \operatorname{CompilerSupportRoot}(P)\ /\ \texttt{windows}\ /\ \texttt{tools}\quad \mathsf{if}\ \operatorname{ObjectFormatOf}(P)\ =\ \mathsf{Coff}\ \land \ \operatorname{PackagedHostSidecarsBeside}(\operatorname{CompilerSupportRoot}(P)) \\[0.16em]
\ \operatorname{CompilerSupportRoot}(P)\ /\ \texttt{linux}\ /\ \texttt{tools}\quad \mathsf{if}\ \operatorname{ObjectFormatOf}(P)\ =\ \mathsf{Elf}\ \land \ \operatorname{PackagedHostSidecarsBeside}(\operatorname{CompilerSupportRoot}(P)) \\[0.16em]
\ \operatorname{CompilerSupportRoot}(P)\ /\ \texttt{tools}\quad \mathsf{otherwise}
\end{array}
$$

$$
\operatorname{ToolVersion}(t)\ =\ v\quad \mathsf{where}\ \mathsf{invoking}\ t\ \mathsf{with}\ \texttt{--version}\ \mathsf{reports}\ v
$$

**(ResolveTool-Ok)**

$$
\begin{array}{l}
\operatorname{Project}(\Gamma )\ =\ P\quad \operatorname{SearchDirs}(P)\ \mathsf{contains}\ x\ \mathsf{at}\ t\quad (x\ =\ \texttt{llvm-as}\ \Rightarrow \ \operatorname{ToolVersion}(t)\ =\ \mathsf{LLVMToolchain}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveTool}(x)\ \Downarrow \ t
\end{array}
$$

**(ResolveTool-Err-Linker)**

$$
\begin{array}{l}
\operatorname{Project}(\Gamma )\ =\ P\quad x\ =\ \operatorname{LinkerToolName}(\mathsf{SelectedTargetProfile})\quad \operatorname{SearchDirs}(P)\ \mathsf{does}\ \mathsf{not}\ \mathsf{contain}\ x \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveTool}(x)\ \Uparrow 
\end{array}
$$

**(ResolveTool-Err-Archiver)**

$$
\begin{array}{l}
\operatorname{Project}(\Gamma )\ =\ P\quad x\ =\ \operatorname{ArchiverToolName}(\mathsf{SelectedTargetProfile})\quad \operatorname{SearchDirs}(P)\ \mathsf{does}\ \mathsf{not}\ \mathsf{contain}\ x \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveTool}(x)\ \Uparrow 
\end{array}
$$

**(ResolveTool-Err-IR)**

$$
\begin{array}{l}
\operatorname{Project}(\Gamma )\ =\ P\quad x\ =\ \texttt{llvm-as}\quad \lnot \exists \ t.\ \operatorname{SearchDirs}(P)\ \mathsf{contains}\ x\ \mathsf{at}\ t\ \land \ \operatorname{ToolVersion}(t)\ =\ \mathsf{LLVMToolchain} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveTool}(x)\ \Uparrow 
\end{array}
$$

**(AssembleIR-Ok)**

$$
\begin{array}{l}
\operatorname{Invoke}(a,\ t)\ \Downarrow \ b \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AssembleIR}(a,\ t)\ \Downarrow \ b
\end{array}
$$

**(AssembleIR-Err)**

$$
\begin{array}{l}
\operatorname{Invoke}(a,\ t)\ \Uparrow  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AssembleIR}(a,\ t)\ \Uparrow 
\end{array}
$$

## 3.8 Project Diagnostics

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
