---
title: "3.1 Core Project Records"
description: "3.1 Core Project Records from 3. Project and Compilation Model of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "project-and-compilation-model"
specSection: "31-core-project-records"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/project-and-compilation-model/">3. Project and Compilation Model</a>
  <span>Project and Compilation Model</span>
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
