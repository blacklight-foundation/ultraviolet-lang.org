---
title: "3.5 Source Roots, Module Directories, and Compilation Units"
description: "3.5 Source Roots, Module Directories, and Compilation Units from 3. Project and Compilation Model of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "project-and-compilation-model"
specSection: "35-source-roots-module-directories-and-compilation-units"
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
