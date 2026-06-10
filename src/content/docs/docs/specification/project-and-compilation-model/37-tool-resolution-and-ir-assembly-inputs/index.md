---
title: "3.7 Tool Resolution and IR Assembly Inputs"
description: "3.7 Tool Resolution and IR Assembly Inputs from 3. Project and Compilation Model of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "project-and-compilation-model"
specSection: "37-tool-resolution-and-ir-assembly-inputs"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/project-and-compilation-model/">3. Project and Compilation Model</a>
  <span>Project and Compilation Model</span>
</div>

## 3.7 Tool Resolution and IR Assembly Inputs

$$
\begin{array}{l}
\operatorname{SearchDirs}(P)\ = \\[0.16em]
\ [\operatorname{ToolchainConfig}(P).\mathsf{llvm}_{\mathsf{bin}}]\ \mathsf{if}\ \operatorname{ToolchainConfig}(P).\mathsf{llvm}_{\mathsf{bin}}\ \ne \ \bot \\[0.16em]
\ [\operatorname{CompilerToolBinDir}(P)]\quad \mathsf{if}\ \operatorname{exists}(\operatorname{CompilerToolBinDir}(P)) \\[0.16em]
\ \mathsf{PATHDirs}\ \mathsf{otherwise}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{CompilerToolBinDir}(P)\ =\ \operatorname{CompilerSupportRoot}(P)\ /\ \texttt{windows}\ /\ \texttt{tools}\quad \mathsf{if}\ \operatorname{ObjectFormatOf}(P)\ =\ \mathsf{Coff}\ \land \ \operatorname{PackagedHostSidecarsBeside}(\operatorname{CompilerSupportRoot}(P)) \\[0.16em]
\ \operatorname{CompilerSupportRoot}(P)\ /\ \texttt{macos}\ /\ \texttt{tools}\quad \mathsf{if}\ \operatorname{ObjectFormatOf}(P)\ =\ \mathsf{MachO}\ \land \ \operatorname{PackagedHostSidecarsBeside}(\operatorname{CompilerSupportRoot}(P)) \\[0.16em]
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
\operatorname{Invoke}(a,\ t)\ \Uparrow \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AssembleIR}(a,\ t)\ \Uparrow
\end{array}
$$
