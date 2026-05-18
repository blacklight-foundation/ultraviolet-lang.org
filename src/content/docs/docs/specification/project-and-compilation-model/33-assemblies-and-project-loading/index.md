---
title: "3.3 Assemblies and Project Loading"
description: "3.3 Assemblies and Project Loading from 3. Project and Compilation Model of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "project-and-compilation-model"
specSection: "33-assemblies-and-project-loading"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/project-and-compilation-model/">3. Project and Compilation Model</a>
  <span>Project and Compilation Model</span>
</div>

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
