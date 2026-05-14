---
title: "3.2 Project Root and Manifest"
description: "3.2 Project Root and Manifest from 3. Project and Compilation Model of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "project-and-compilation-model"
specSection: "32-project-root-and-manifest"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/project-and-compilation-model/">3. Project and Compilation Model</a>
  <span>Project and Compilation Model</span>
</div>

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
