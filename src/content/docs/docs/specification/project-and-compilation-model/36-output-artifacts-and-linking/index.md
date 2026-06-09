---
title: "3.6 Output Artifacts and Linking"
description: "3.6 Output Artifacts and Linking from 3. Project and Compilation Model of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "project-and-compilation-model"
specSection: "36-output-artifacts-and-linking"
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
\ P.\mathsf{root}/\texttt{Build}\quad \mathsf{otherwise}
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
\ R/\texttt{Build}\quad \mathsf{otherwise} \\[0.16em]
\operatorname{OutputPaths}(R,\ A).\mathsf{intermediate}_{\mathsf{dir}}\ =\ \operatorname{OutputPaths}(R,\ A).\mathsf{root}/\texttt{Intermediate} \\[0.16em]
\operatorname{OutputPaths}(R,\ A).\mathsf{obj}_{\mathsf{dir}}\ =\ \operatorname{OutputPaths}(R,\ A).\mathsf{intermediate}_{\mathsf{dir}}/\texttt{Obj} \\[0.16em]
\operatorname{OutputPaths}(R,\ A).\mathsf{ir}_{\mathsf{dir}}\ =\ \operatorname{OutputPaths}(R,\ A).\mathsf{intermediate}_{\mathsf{dir}}/\texttt{IR} \\[0.16em]
\operatorname{OutputPaths}(R,\ A).\mathsf{bin}_{\mathsf{dir}}\ =\ \operatorname{OutputPaths}(R,\ A).\mathsf{root}/\texttt{Binary} \\[0.16em]
\operatorname{OutputPaths}(R,\ A).\mathsf{lib}_{\mathsf{dir}}\ =\ \operatorname{OutputPaths}(R,\ A).\mathsf{root}/\texttt{Library} \\[0.16em]
\operatorname{OutputPaths}(R,\ A).\mathsf{logs}_{\mathsf{dir}}\ =\ \operatorname{OutputPaths}(R,\ A).\mathsf{root}/\texttt{Logs} \\[0.16em]
\operatorname{OutputPaths}(R,\ A).\mathsf{incremental}_{\mathsf{dir}}\ =\ \operatorname{OutputPaths}(R,\ A).\mathsf{intermediate}_{\mathsf{dir}}/\texttt{Incremental}
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
\operatorname{MangleModulePath}(p)\ =\ \operatorname{mangle}(\operatorname{PathString}(\operatorname{PathKey}(p))) \\[0.16em]
\operatorname{ModuleOutputRel}(P,\ m)\ =\ \operatorname{Rel}(\operatorname{ModuleDirOf}(m,\ P.\mathsf{source}_{\mathsf{root}}),\ P.\mathsf{root})
\end{array}
$$

$$
\operatorname{obj}(m)\ =\ O\ /\ \texttt{Intermediate}\ /\ \texttt{Obj}\ /\ \operatorname{ModuleOutputRel}(P,\ m)\ /\ (\operatorname{MangleModulePath}(p)\ \mathbin{++} \ \operatorname{ObjExt}(\mathsf{SelectedTargetProfile}))
$$

**Final Artifact Naming**

$$
\begin{array}{l}
\mathsf{libname}\ =\ \operatorname{LibraryPrefix}(\mathsf{SelectedTargetProfile})\ \mathbin{++} \ \mathsf{assembly}_{\mathsf{name}} \\[0.16em]
\mathsf{exe}\ =\ O\ /\ \texttt{Binary}\ /\ (\mathsf{assembly}_{\mathsf{name}}\ \mathbin{++} \ \operatorname{ExeSuffix}(\mathsf{SelectedTargetProfile})) \\[0.16em]
\mathsf{shared}\ =\ O\ /\ \texttt{Binary}\ /\ (\mathsf{libname}\ \mathbin{++} \ \operatorname{SharedLibSuffix}(\mathsf{SelectedTargetProfile})) \\[0.16em]
\mathsf{static}\ =\ O\ /\ \texttt{Library}\ /\ (\mathsf{libname}\ \mathbin{++} \ \operatorname{StaticLibSuffix}(\mathsf{SelectedTargetProfile})) \\[0.16em]
\mathsf{import}\ =\ O\ /\ \texttt{Library}\ /\ (\mathsf{libname}\ \mathbin{++} \ \operatorname{ImportLibSuffix}(\mathsf{SelectedTargetProfile}))
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
\operatorname{ObjPath}(P,\ m)\ =\ O\ /\ \texttt{Intermediate}\ /\ \texttt{Obj}\ /\ \operatorname{ModuleOutputRel}(P,\ m)\ /\ (\operatorname{MangleModulePath}(\operatorname{path}(m))\ \mathbin{++} \ \operatorname{ObjExt}(\mathsf{SelectedTargetProfile})) \\[0.16em]
\operatorname{IRPath}(P,\ m,\ e)\ =\ O\ /\ \texttt{Intermediate}\ /\ \texttt{IR}\ /\ \operatorname{ModuleOutputRel}(P,\ m)\ /\ (\operatorname{MangleModulePath}(\operatorname{path}(m))\ \mathbin{++} \ \operatorname{ext}(e)) \\[0.16em]
\operatorname{ExePath}(P)\ = \\[0.16em]
\ O\ /\ \texttt{Binary}\ /\ (\mathsf{assembly}_{\mathsf{name}}\ \mathbin{++} \ \operatorname{ExeSuffix}(\mathsf{SelectedTargetProfile}))\ \mathsf{if}\ \operatorname{Executable}(P) \\[0.16em]
\ \bot \quad \mathsf{otherwise} \\[0.16em]
\operatorname{SharedLibPath}(P)\ = \\[0.16em]
\ O\ /\ \texttt{Binary}\ /\ ((\operatorname{LibraryPrefix}(\mathsf{SelectedTargetProfile})\ \mathbin{++} \ \mathsf{assembly}_{\mathsf{name}})\ \mathbin{++} \ \operatorname{SharedLibSuffix}(\mathsf{SelectedTargetProfile}))\ \mathsf{if}\ \operatorname{SharedLibrary}(P) \\[0.16em]
\ \bot \quad \mathsf{otherwise} \\[0.16em]
\operatorname{StaticLibPath}(P)\ = \\[0.16em]
\ O\ /\ \texttt{Library}\ /\ ((\operatorname{LibraryPrefix}(\mathsf{SelectedTargetProfile})\ \mathbin{++} \ \mathsf{assembly}_{\mathsf{name}})\ \mathbin{++} \ \operatorname{StaticLibSuffix}(\mathsf{SelectedTargetProfile}))\ \mathsf{if}\ \operatorname{StaticLibrary}(P) \\[0.16em]
\ \bot \quad \mathsf{otherwise} \\[0.16em]
\operatorname{ImportLibPath}(P)\ = \\[0.16em]
\ O\ /\ \texttt{Library}\ /\ ((\operatorname{LibraryPrefix}(\mathsf{SelectedTargetProfile})\ \mathbin{++} \ \mathsf{assembly}_{\mathsf{name}})\ \mathbin{++} \ \operatorname{ImportLibSuffix}(\mathsf{SelectedTargetProfile}))\ \mathsf{if}\ \operatorname{SharedLibrary}(P)\ \land \ \operatorname{EmitsImportLib}(\mathsf{SelectedTargetProfile}) \\[0.16em]
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
\operatorname{Overwrites}(p,\ b)\ \Leftrightarrow \ \exists \ \mathsf{io},\ \omega ,\ \omega '.\ \operatorname{IOWriteFile}(\mathsf{io},\ p,\ b,\ \omega )\ \Downarrow \ (\mathsf{ok},\ \omega ')
\end{array}
$$

**Directory Creation.**

$$
\begin{array}{l}
\operatorname{EnsureDir}(p)\ \Downarrow \ \mathsf{ok}\ \Rightarrow \ \operatorname{IsDir}(p) \\[0.16em]
\operatorname{IsDir}(p)\ \Leftrightarrow \ \exists \ \mathsf{io},\ \omega ,\ \omega '.\ \operatorname{IOKind}(\mathsf{io},\ p,\ \omega )\ \Downarrow \ (\texttt{Dir},\ \omega ') \\[0.16em]
\operatorname{IsFile}(p)\ \Leftrightarrow \ \operatorname{IOKind}(p)\ =\ \mathsf{File}
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
\operatorname{Linkable}(P)\quad \Gamma \ \vdash \ \operatorname{EnsureDir}(O)\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{Intermediate})\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{Logs})\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{Intermediate}\ /\ \texttt{Obj})\ \Downarrow \ \mathsf{ok}\quad (\lnot \ \operatorname{UsesBinDir}(P)\ \lor \ \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{Binary})\ \Downarrow \ \mathsf{ok})\quad (\lnot \ \operatorname{UsesLibDir}(P)\ \lor \ \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{Library})\ \Downarrow \ \mathsf{ok})\quad (e\ =\ \texttt{none}\ \lor \ \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{Intermediate}\ /\ \texttt{IR})\ \Downarrow \ \mathsf{ok})\quad \Gamma \ \vdash \ \operatorname{EmitObjects}(\mathsf{ms},\ P)\ \Downarrow \ \mathsf{Objs}\quad \Gamma \ \vdash \ \operatorname{EmitIR}(\mathsf{ms},\ P,\ e)\ \Downarrow \ \mathsf{IRs}\quad \Gamma \ \vdash \ \operatorname{Finalize}(\mathsf{Objs},\ P)\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{OutputPipeline}(P)\ \Downarrow \ (\mathsf{Objs},\ \mathsf{IRs},\ \operatorname{PrimaryArtifact}(P))
\end{array}
$$

**(Output-Pipeline-Dependency)**

$$
\begin{array}{l}
\operatorname{Dependency}(P)\quad \Gamma \ \vdash \ \operatorname{EnsureDir}(O)\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{Intermediate})\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{Logs})\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{Intermediate}\ /\ \texttt{Obj})\ \Downarrow \ \mathsf{ok}\quad (e\ =\ \texttt{none}\ \lor \ \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{Intermediate}\ /\ \texttt{IR})\ \Downarrow \ \mathsf{ok})\quad \Gamma \ \vdash \ \operatorname{EmitObjects}(\mathsf{ms},\ P)\ \Downarrow \ \mathsf{Objs}\quad \Gamma \ \vdash \ \operatorname{EmitIR}(\mathsf{ms},\ P,\ e)\ \Downarrow \ \mathsf{IRs} \\[0.16em]
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
\Gamma \ \vdash \ \operatorname{EnsureDir}(O)\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{Intermediate})\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{Logs})\ \Downarrow \ \mathsf{ok}\quad \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{Intermediate}\ /\ \texttt{Obj})\ \Downarrow \ \mathsf{ok}\quad (\lnot \ \operatorname{UsesBinDir}(P)\ \lor \ \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{Binary})\ \Downarrow \ \mathsf{ok})\quad (\lnot \ \operatorname{UsesLibDir}(P)\ \lor \ \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{Library})\ \Downarrow \ \mathsf{ok})\quad (e\ =\ \texttt{none}\ \lor \ \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{Intermediate}\ /\ \texttt{IR})\ \Downarrow \ \mathsf{ok}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{OutDirs}(P)\rangle \ \to \ \langle \operatorname{OutObjs}(P,\ \mathsf{ms},\ [])\rangle 
\end{array}
$$

**(Out-Dirs-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EnsureDir}(O)\ \Uparrow \ \lor \ \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{Intermediate})\ \Uparrow \ \lor \ \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{Logs})\ \Uparrow \ \lor \ \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{Intermediate}\ /\ \texttt{Obj})\ \Uparrow \ \lor \ (\operatorname{UsesBinDir}(P)\ \land \ \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{Binary})\ \Uparrow )\ \lor \ (\operatorname{UsesLibDir}(P)\ \land \ \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{Library})\ \Uparrow )\ \lor \ (e\ \in \ \{\texttt{ll},\ \texttt{bc}\}\ \land \ \Gamma \ \vdash \ \operatorname{EnsureDir}(O\ /\ \texttt{Intermediate}\ /\ \texttt{IR})\ \Uparrow ) \\[0.16em]
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
