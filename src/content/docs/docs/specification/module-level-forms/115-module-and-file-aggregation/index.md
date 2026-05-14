---
title: "11.5 Module and File Aggregation"
description: "11.5 Module and File Aggregation from 11. Module-Level Forms of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "module-level-forms"
specSection: "115-module-and-file-aggregation"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/module-level-forms/">11. Module-Level Forms</a>
  <span>Module-Level Forms</span>
</div>

## 11.5 Module and File Aggregation

### 11.5.1 Syntax

```text
path        ::= identifier ("::" identifier)*
module_path ::= path
```

Module-to-file mapping is defined by the static semantics of this section and has no independent surface token syntax.

### 11.5.2 Parsing

`module_path` is parsed by the shared path parser.

**(Parse-ModulePath)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseIdent}(P)\ \Downarrow \ (P_{1},\ \mathsf{id})\quad \Gamma \ \vdash \ \operatorname{ParseModulePathTail}(P_{1},\ [\mathsf{id}])\ \Downarrow \ (P_{2},\ \mathsf{path}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseModulePath}(P)\ \Downarrow \ (P_{2},\ \mathsf{path})
\end{array}
$$

**(Parse-ModulePathTail-End)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"::"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseModulePathTail}(P,\ \mathsf{xs})\ \Downarrow \ (P,\ \mathsf{xs})
\end{array}
$$

**(Parse-ModulePathTail-Cons)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"::"})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{id})\quad \Gamma \ \vdash \ \operatorname{ParseModulePathTail}(P_{1},\ \mathsf{xs}\ \mathbin{++} \ [\mathsf{id}])\ \Downarrow \ (P_{2},\ \mathsf{ys}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseModulePathTail}(P,\ \mathsf{xs})\ \Downarrow \ (P_{2},\ \mathsf{ys})
\end{array}
$$

### 11.5.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{Path}\ =\ [\mathsf{identifier}] \\[0.16em]
\mathsf{ModulePath}\ =\ \mathsf{Path} \\[0.16em]
\mathsf{TypePath}\ =\ \mathsf{Path} \\[0.16em]
\mathsf{ClassPath}\ =\ \mathsf{Path} \\[0.16em]
\operatorname{PathString}(p)\ =\ \operatorname{StringOfPath}(p) \\[0.16em]
\mathsf{StringOfPathRef}\ =\ \{\texttt{"3.4.1"}\}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{ASTModule}\ =\ \langle \mathsf{path},\ \mathsf{items},\ \mathsf{module}_{\mathsf{doc}}\rangle  \\[0.16em]
\mathsf{ASTModule}.\mathsf{path}\ \in \ \mathsf{Path} \\[0.16em]
\mathsf{ASTModule}.\mathsf{items}\ \in \ [\mathsf{ASTItem}] \\[0.16em]
\mathsf{ASTModule}.\mathsf{module}_{\mathsf{doc}}\ \in \ \mathsf{DocList}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{ASTFile}\ =\ \langle \mathsf{path},\ \mathsf{items},\ \mathsf{module}_{\mathsf{doc}}\rangle  \\[0.16em]
\mathsf{ASTFile}.\mathsf{path}\ \in \ \mathsf{Path} \\[0.16em]
\mathsf{ASTFile}.\mathsf{items}\ \in \ [\mathsf{ASTItem}] \\[0.16em]
\mathsf{ASTFile}.\mathsf{module}_{\mathsf{doc}}\ \in \ \mathsf{DocList}
\end{array}
$$

### 11.5.4 Static Semantics

This section owns file-to-module mapping, visible module sets, import-coverage checks, and module/item path resolution.

**Module Path.**

**(Module-Path-Root)**

$$
\begin{array}{l}
\operatorname{relative}(d,\ S)\ =\ \varepsilon  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ModulePath}(d,\ S,\ A)\ =\ A
\end{array}
$$

**(Module-Path-Rel)**

$$
\begin{array}{l}
\operatorname{relative}(d,\ S)\ =\ c_{1}\ /\ \ldots \ /\ c_{n} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ModulePath}(d,\ S,\ A)\ =\ A\ \mathbin{::} \ c_{1}\ \mathbin{::} \ \ldots \ \mathbin{::} \ c_{n}
\end{array}
$$

**(Module-Path-Rel-Fail)**

$$
\begin{array}{l}
\operatorname{relative}(d,\ S)\ \Uparrow  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ModulePath}(d,\ S,\ A)\ \Uparrow 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ModuleDirOf}(A,\ S)\ =\ S \\[0.16em]
\operatorname{ModuleDirOf}(A\ \mathbin{::} \ c_{1}\ \mathbin{::} \ \ldots \ \mathbin{::} \ c_{n},\ S)\ =\ S\ /\ c_{1}\ /\ \ldots \ /\ c_{n}\quad n\ \ge \ 1
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ViewPaths}(\mathsf{Ms})\ =\ [M.\mathsf{path}\ \mid \ M\ \in \ \mathsf{Ms}] \\[0.16em]
\operatorname{ViewAssembly}(A,\ P,\ \mathsf{Ms})\ = \\[0.16em]
\ A[\mathsf{modules}\ :=\ \operatorname{ViewPaths}(\mathsf{Ms})]\ \mathsf{if}\ A.\mathsf{name}\ =\ P.\mathsf{assembly}.\mathsf{name} \\[0.16em]
\ A\quad \mathsf{otherwise} \\[0.16em]
\operatorname{ProjectView}(P,\ \mathsf{Ms})\ =\ P[\mathsf{modules}\ :=\ \operatorname{ViewPaths}(\mathsf{Ms}),\ \mathsf{assembly}\ :=\ P.\mathsf{assembly}[\mathsf{modules}\ :=\ \operatorname{ViewPaths}(\mathsf{Ms})],\ \mathsf{assemblies}\ :=\ [\operatorname{ViewAssembly}(A,\ P,\ \mathsf{Ms})\ \mid \ A\ \in \ P.\mathsf{assemblies}]]
\end{array}
$$

$$
\operatorname{SourceRootOfModule}(P,\ p)\ =\ S\ \Leftrightarrow \ \exists \ A\ \in \ P.\mathsf{assemblies}.\ p\ \in \ A.\mathsf{modules}\ \land \ A.\mathsf{name}\ =\ \operatorname{AsmOfPath}(p)\ \land \ S\ =\ A.\mathsf{source}_{\mathsf{root}}
$$

$$
\mathsf{WFModulePathJudg}\ =\ \{\mathsf{WF}-\mathsf{Module}-\mathsf{Path}\}
$$

**(WF-Module-Path-Ok)**

$$
\begin{array}{l}
\forall \ \mathsf{comp}\ \in \ p,\ (\Gamma \ \vdash \ \mathsf{comp}\ :\ \mathsf{Identifier})\ \land \ \lnot \ \operatorname{Keyword}(\mathsf{comp}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{WF}-\mathsf{Module}-\operatorname{Path}(p)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(WF-Module-Path-Reserved)**

$$
\begin{array}{l}
\exists \ \mathsf{comp}\ \in \ p.\ \operatorname{Keyword}(\mathsf{comp})\quad c\ =\ \operatorname{Code}(\mathsf{WF}-\mathsf{Module}-\mathsf{Path}-\mathsf{Reserved}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{WF}-\mathsf{Module}-\operatorname{Path}(p)\ \Uparrow \ c
\end{array}
$$

**(WF-Module-Path-Ident-Err)**

$$
\begin{array}{l}
\exists \ \mathsf{comp}\ \in \ p.\ \lnot (\Gamma \ \vdash \ \mathsf{comp}\ :\ \mathsf{Identifier})\quad c\ =\ \operatorname{Code}(\mathsf{WF}-\mathsf{Module}-\mathsf{Path}-\mathsf{Ident}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{WF}-\mathsf{Module}-\operatorname{Path}(p)\ \Uparrow \ c
\end{array}
$$

**(WF-Module-Path-Collision)**

$$
\begin{array}{l}
p_{1}\ \ne \ p_{2}\quad \operatorname{Fold}(p_{1})\ =\ \operatorname{Fold}(p_{2}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Emit}(\operatorname{Code}(\mathsf{WF}-\mathsf{Module}-\mathsf{Path}-\mathsf{Collision}))\quad \Gamma \ \vdash \ \operatorname{Emit}(W-\mathsf{MOD}-1101,\ \bot )
\end{array}
$$

**Module Discovery (Small-Step)**

$$
\begin{array}{l}
\operatorname{ModuleAggInputs}(P)\ =\ \langle P.\mathsf{modules},\ P.\mathsf{source}_{\mathsf{root}},\ \{\ \operatorname{CompilationUnit}(\operatorname{ModuleDirOf}(p,\ P.\mathsf{source}_{\mathsf{root}}))\ \mid \ p\ \in \ P.\mathsf{modules}\ \}\rangle  \\[0.16em]
\operatorname{ModuleAggOutputs}(P)\ =\ \langle \{\ \operatorname{ASTModule}(P,\ p)\ \mid \ p\ \in \ P.\mathsf{modules}\ \},\ \{\ \operatorname{NameMap}(P,\ p)\ \mid \ p\ \in \ P.\mathsf{modules}\ \},\ G,\ \mathsf{InitOrder},\ \mathsf{InitPlan}\rangle  \\[0.16em]
\operatorname{ModuleMap}(P,\ p)\ =\ M\ \Leftrightarrow \ \operatorname{SourceRootOfModule}(P,\ p)\ =\ S\ \land \ \Gamma \ \vdash \ \operatorname{ParseModule}(p,\ S)\ \Downarrow \ M \\[0.16em]
\operatorname{ASTModule}(P,\ p)\ =\ M\ \Leftrightarrow \ \operatorname{ModuleMap}(P,\ p)\ =\ M \\[0.16em]
\operatorname{PathOfModule}(p)\ =\ [c_{1},\ \ldots ,\ c_{n}]\ \Leftrightarrow \ p\ =\ c_{1}\ \mathbin{::} \ \cdot \cdot \cdot \ \mathbin{::} \ c_{n} \\[0.16em]
\operatorname{NameCollectAfterParse}(P)\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{ParseModules}(P)\ \Downarrow \ \mathsf{Ms}\ \land \ \forall \ M\ \in \ \mathsf{Ms}.\ \exists \ N.\ \Gamma \ \vdash \ \operatorname{CollectNames}(M)\ \Downarrow \ N \\[0.16em]
\mathsf{NameCollectOrderIndepRef}\ =\ \{\texttt{"5.1.5"}\} \\[0.16em]
\mathsf{ForwardRefOrderRef}\ =\ \{\texttt{"5.12"}\}
\end{array}
$$

$$
\mathsf{ParseModule}\ \in \ \operatorname{RulesIn}(\{\texttt{"3.4.1"},\ \texttt{"3.4.2"}\})
$$

**ParseModule (Big-Step).**

$$
\begin{array}{l}
U\ =\ \operatorname{CompilationUnit}(\operatorname{ModuleDirOf}(p,\ S)) \\[0.16em]
U\ =\ [f_{1},\ \ldots ,\ f_{n}] \\[0.16em]
\mathsf{ReadBytes}\ :\ \mathsf{Path}\ \rightharpoonup \ \mathsf{Bytes}
\end{array}
$$

**(ReadBytes-Ok)**

$$
\begin{array}{l}
\operatorname{read_ok}(f)\ =\ B \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ReadBytes}(f)\ \Downarrow \ B
\end{array}
$$

**(ReadBytes-Err)**

$$
\begin{array}{l}
\operatorname{read_ok}(f)\ \Uparrow \quad c\ =\ \operatorname{Code}(\mathsf{ReadBytes}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ReadBytes}(f)\ \Uparrow \ c
\end{array}
$$

$$
\operatorname{Bytes}(f)\ =\ B\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{ReadBytes}(f)\ \Downarrow \ B
$$

**(ParseModule-Ok)**

$$
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{ReadBytes}(f_{i})\ \Downarrow \ B_{i}\quad \Gamma \ \vdash \ \operatorname{LoadSource}(f_{i},\ B_{i})\ \Downarrow \ S_{i}\quad \Gamma \ \vdash \ \operatorname{ParseFile}(S_{i})\ \Downarrow \ F_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseModule}(p,\ S)\ \Downarrow \ \langle p,\ F_{1}.\mathsf{items}\ \mathbin{++} \ \cdot \cdot \cdot \ \mathbin{++} \ F_{n}.\mathsf{items},\ F_{1}.\mathsf{module}_{\mathsf{doc}}\ \mathbin{++} \ \cdot \cdot \cdot \ \mathbin{++} \ F_{n}.\mathsf{module}_{\mathsf{doc}}\rangle 
\end{array}
$$

**(ParseModule-Err-Read)**

$$
\begin{array}{l}
\exists \ i,\ \Gamma \ \vdash \ \operatorname{ReadBytes}(f_{i})\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseModule}(p,\ S)\ \Uparrow \ c
\end{array}
$$

**(ParseModule-Err-Load)**

$$
\begin{array}{l}
\exists \ i,\ \Gamma \ \vdash \ \operatorname{ReadBytes}(f_{i})\ \Downarrow \ B_{i}\quad \Gamma \ \vdash \ \operatorname{LoadSource}(f_{i},\ B_{i})\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseModule}(p,\ S)\ \Uparrow \ c
\end{array}
$$

**LoadSource Short-Circuit.**
If Γ ⊢ LoadSource(f, B) ⇑ c for any file in a compilation unit, ParseModule MUST NOT invoke Tokenize, ParseFile, or subsequent syntactic well-formedness checks for that file.

**(ParseModule-Err-Unit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CompilationUnit}(\operatorname{ModuleDirOf}(p,\ S))\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseModule}(p,\ S)\ \Uparrow \ c
\end{array}
$$

**(ParseModule-Err-Parse)**

$$
\begin{array}{l}
\exists \ i,\ \Gamma \ \vdash \ \operatorname{ReadBytes}(f_{i})\ \Downarrow \ B_{i}\quad \Gamma \ \vdash \ \operatorname{LoadSource}(f_{i},\ B_{i})\ \Downarrow \ S_{i}\quad \Gamma \ \vdash \ \operatorname{ParseFile}(S_{i})\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseModule}(p,\ S)\ \Uparrow \ c
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ParseFileBestEffort}(S)\ \Leftrightarrow \ \exists \ F.\ \Gamma \ \vdash \ \operatorname{ParseFile}(S)\ \Downarrow \ F \\[0.16em]
\operatorname{ParseFileOk}(S)\ \Leftrightarrow \ \operatorname{ParseFileBestEffort}(S)\ \land \ \lnot \ \operatorname{HasError}(\operatorname{ParseFileDiag}(S)) \\[0.16em]
\operatorname{ParseFileDiag}(S)\ =\ \Delta \ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{Tokenize}(S)\ \Downarrow \ (K_{\mathsf{raw}},\ D)\ \land \ K\ =\ \operatorname{Filter}(K_{\mathsf{raw}})\ \land \ P_{0}\ =\ \langle K,\ 0,\ D,\ 0,\ 0,\ []\rangle \ \land \ \Gamma \ \vdash \ \operatorname{ParseItems}(P_{0})\ \Downarrow \ (P_{1},\ I,\ \mathsf{MDoc})\ \land \ \operatorname{DiagStream}(P_{1})\ =\ \Delta  \\[0.16em]
\operatorname{HasError}(\Delta )\ \Leftrightarrow \ \exists \ d\ \in \ \Delta .\ d.\mathsf{severity}\ =\ \mathsf{Error}
\end{array}
$$

**ParseModule (Small-Step).**

$$
\mathsf{ModState}\ =\ \{\operatorname{ModStart}(p,\ S),\ \operatorname{ModScan}(p,\ S,\ U,\ \mathsf{items},\ \mathsf{docs}),\ \operatorname{ModDone}(M),\ \operatorname{Error}(\mathsf{code})\}
$$

**(Mod-Start)**

$$
\begin{array}{l}
U\ =\ \operatorname{CompilationUnit}(\operatorname{ModuleDirOf}(p,\ S)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{ModStart}(p,\ S)\rangle \ \to \ \langle \operatorname{ModScan}(p,\ S,\ U,\ [],\ [])\rangle 
\end{array}
$$

**(Mod-Start-Err-Unit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CompilationUnit}(\operatorname{ModuleDirOf}(p,\ S))\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{ModStart}(p,\ S)\rangle \ \to \ \langle \operatorname{Error}(c)\rangle 
\end{array}
$$

**(Mod-Scan)**

$$
\begin{array}{l}
U\ =\ f\ \mathbin{::} \ \mathsf{fs}\quad \Gamma \ \vdash \ \operatorname{ReadBytes}(f)\ \Downarrow \ B\quad \Gamma \ \vdash \ \operatorname{LoadSource}(f,\ B)\ \Downarrow \ S_{f}\quad \Gamma \ \vdash \ \operatorname{ParseFile}(S_{f})\ \Downarrow \ F \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{ModScan}(p,\ S,\ f\ \mathbin{::} \ \mathsf{fs},\ \mathsf{items},\ \mathsf{docs})\rangle \ \to \ \langle \operatorname{ModScan}(p,\ S,\ \mathsf{fs},\ \mathsf{items}\ \mathbin{++} \ F.\mathsf{items},\ \mathsf{docs}\ \mathbin{++} \ F.\mathsf{module}_{\mathsf{doc}})\rangle 
\end{array}
$$

**(Mod-Scan-Err-Read)**

$$
\begin{array}{l}
U\ =\ f\ \mathbin{::} \ \mathsf{fs}\quad \Gamma \ \vdash \ \operatorname{ReadBytes}(f)\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{ModScan}(p,\ S,\ f\ \mathbin{::} \ \mathsf{fs},\ \mathsf{items},\ \mathsf{docs})\rangle \ \to \ \langle \operatorname{Error}(c)\rangle 
\end{array}
$$

**(Mod-Scan-Err-Load)**

$$
\begin{array}{l}
U\ =\ f\ \mathbin{::} \ \mathsf{fs}\quad \Gamma \ \vdash \ \operatorname{ReadBytes}(f)\ \Downarrow \ B\quad \Gamma \ \vdash \ \operatorname{LoadSource}(f,\ B)\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{ModScan}(p,\ S,\ f\ \mathbin{::} \ \mathsf{fs},\ \mathsf{items},\ \mathsf{docs})\rangle \ \to \ \langle \operatorname{Error}(c)\rangle 
\end{array}
$$

**(Mod-Scan-Err-Parse)**

$$
\begin{array}{l}
U\ =\ f\ \mathbin{::} \ \mathsf{fs}\quad \Gamma \ \vdash \ \operatorname{ReadBytes}(f)\ \Downarrow \ B\quad \Gamma \ \vdash \ \operatorname{LoadSource}(f,\ B)\ \Downarrow \ S_{f}\quad \Gamma \ \vdash \ \operatorname{ParseFile}(S_{f})\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{ModScan}(p,\ S,\ f\ \mathbin{::} \ \mathsf{fs},\ \mathsf{items},\ \mathsf{docs})\rangle \ \to \ \langle \operatorname{Error}(c)\rangle 
\end{array}
$$

**(Mod-Done)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{ModScan}(p,\ S,\ [],\ \mathsf{items},\ \mathsf{docs})\rangle \ \to \ \langle \operatorname{ModDone}(\langle p,\ \mathsf{items},\ \mathsf{docs}\rangle )\rangle 
\end{array}
$$

**ParseModules (Big-Step).**

$$
P.\mathsf{modules}\ =\ [p_{1},\ \ldots ,\ p_{k}]
$$

**(ParseModules-Ok)**

$$
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{ParseModule}(p_{i},\ P.\mathsf{source}_{\mathsf{root}})\ \Downarrow \ M_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseModules}(P)\ \Downarrow \ [M_{1},\ \ldots ,\ M_{k}]
\end{array}
$$

**(ParseModules-Err)**

$$
\begin{array}{l}
\exists \ i,\ \Gamma \ \vdash \ \operatorname{ParseModule}(p_{i},\ P.\mathsf{source}_{\mathsf{root}})\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseModules}(P)\ \Uparrow \ c
\end{array}
$$

$$
\mathsf{DiscState}\ =\ \{\operatorname{DiscStart}(S,\ A),\ \operatorname{DiscScan}(S,\ A,\ \mathsf{Pending},\ M,\ \mathsf{Seen}),\ \operatorname{DiscDone}(M),\ \operatorname{Error}(\mathsf{code})\}
$$

**(Disc-Start)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{DiscStart}(S,\ A)\rangle \ \to \ \langle \operatorname{DiscScan}(S,\ A,\ \operatorname{DirSeq}(S),\ [],\ \emptyset )\rangle 
\end{array}
$$

**(Disc-Skip)**

$$
\begin{array}{l}
\Gamma \ \nvdash \ d\ :\ \mathsf{ModuleDir} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{DiscScan}(S,\ A,\ d\mathbin{::} \mathsf{ds},\ M,\ \mathsf{Seen})\rangle \ \to \ \langle \operatorname{DiscScan}(S,\ A,\ \mathsf{ds},\ M,\ \mathsf{Seen})\rangle 
\end{array}
$$

**(Disc-Add)**

$$
\begin{array}{l}
\Gamma \ \vdash \ d\ :\ \mathsf{ModuleDir}\quad \Gamma \ \vdash \ \operatorname{ModulePath}(d,\ S,\ A)\ =\ p\quad \Gamma \ \vdash \ \mathsf{WF}-\mathsf{Module}-\operatorname{Path}(p)\ \Downarrow \ \mathsf{ok}\quad \operatorname{Fold}(p)\ \notin \ \operatorname{dom}(\mathsf{Seen}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{DiscScan}(S,\ A,\ d\mathbin{::} \mathsf{ds},\ M,\ \mathsf{Seen})\rangle \ \to \ \langle \operatorname{DiscScan}(S,\ A,\ \mathsf{ds},\ M\ \mathbin{++} \ [p],\ \mathsf{Seen}\ \cup \ \{\operatorname{Fold}(p)\ \mapsto \ p\})\rangle 
\end{array}
$$

**(Disc-Collision)**

$$
\begin{array}{l}
\Gamma \ \vdash \ d\ :\ \mathsf{ModuleDir}\quad \Gamma \ \vdash \ \operatorname{ModulePath}(d,\ S,\ A)\ =\ p\quad \Gamma \ \vdash \ \mathsf{WF}-\mathsf{Module}-\operatorname{Path}(p)\ \Downarrow \ \mathsf{ok}\quad \operatorname{Fold}(p)\ \in \ \operatorname{dom}(\mathsf{Seen})\quad \mathsf{Seen}[\operatorname{Fold}(p)]\ \ne \ p \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{DiscScan}(S,\ A,\ d\mathbin{::} \mathsf{ds},\ M,\ \mathsf{Seen})\rangle \ \to \ \langle \operatorname{Error}(\operatorname{Code}(\mathsf{Disc}-\mathsf{Collision}))\rangle 
\end{array}
$$

**(Disc-Invalid-Component)**

$$
\begin{array}{l}
\Gamma \ \vdash \ d\ :\ \mathsf{ModuleDir}\quad \Gamma \ \vdash \ \operatorname{ModulePath}(d,\ S,\ A)\ =\ p\quad \Gamma \ \vdash \ \mathsf{WF}-\mathsf{Module}-\operatorname{Path}(p)\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{DiscScan}(S,\ A,\ d\mathbin{::} \mathsf{ds},\ M,\ \mathsf{Seen})\rangle \ \to \ \langle \operatorname{Error}(c)\rangle 
\end{array}
$$

**(Disc-Rel-Fail)**

$$
\begin{array}{l}
\Gamma \ \vdash \ d\ :\ \mathsf{ModuleDir}\quad \operatorname{relative}(d,\ S)\ \Uparrow  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{DiscScan}(S,\ A,\ d\mathbin{::} \mathsf{ds},\ M,\ \mathsf{Seen})\rangle \ \to \ \langle \operatorname{Error}(\operatorname{Code}(\mathsf{Disc}-\mathsf{Rel}-\mathsf{Fail}))\rangle 
\end{array}
$$

**(Disc-Done)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{DiscScan}(S,\ A,\ [],\ M,\ \mathsf{Seen})\rangle \ \to \ \langle \operatorname{DiscDone}(M)\rangle 
\end{array}
$$

**Qualified Lookup.**

$$
\begin{array}{l}
P\ =\ \operatorname{Project}(\Gamma ) \\[0.16em]
m\ =\ \operatorname{CurrentModule}(\Gamma ) \\[0.16em]
\operatorname{AllModulePaths}(P)\ =\ \bigcup \_\{A\ \in \ P.\mathsf{assemblies}\}\ A.\mathsf{modules} \\[0.16em]
\operatorname{AsmOfPath}(p)\ =\ p[0]\quad \mathsf{if}\ \mid p\mid \ \ge \ 1 \\[0.16em]
\operatorname{AsmOfModule}(m)\ =\ \operatorname{AsmOfPath}(m) \\[0.16em]
\operatorname{ImportDecls}(m)\ =\ [d\ \mid \ d\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \land \ d\ =\ \operatorname{ImportDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_)] \\[0.16em]
\operatorname{ImportPaths}(m)\ =\ [\mathsf{mp}\ \mid \ \operatorname{ImportDecl}(\_,\ \_,\ \mathsf{path},\ \_,\ \_,\ \_)\ \in \ \operatorname{ImportDecls}(m)\ \land \ \Gamma \ \vdash \ \operatorname{ResolveImportPath}(\mathsf{path})\ \Downarrow \ \mathsf{mp}] \\[0.16em]
\operatorname{VisibleAssemblies}(m)\ =\ \{\operatorname{AsmOfModule}(m)\}\ \cup \ \{\operatorname{AsmOfPath}(p)\ \mid \ p\ \in \ \operatorname{ImportPaths}(m)\} \\[0.16em]
\operatorname{PublicAPI}(m)\ \Leftrightarrow \ \exists \ \mathsf{it}\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}.\ \operatorname{Vis}(\mathsf{it})\ =\ \texttt{public} \\[0.16em]
\operatorname{VisibleModulePaths}(m)\ =\ \{\ p\ \mid \ p\ \in \ \operatorname{AllModulePaths}(P)\ \land \ \operatorname{AsmOfPath}(p)\ \in \ \operatorname{VisibleAssemblies}(m)\ \} \\[0.16em]
\mathsf{AllModuleNames}\ =\ \{\ \operatorname{StringOfPath}(p)\ \mid \ p\ \in \ \operatorname{AllModulePaths}(P)\ \} \\[0.16em]
\operatorname{VisibleModuleNames}(m)\ =\ \{\ \operatorname{StringOfPath}(p)\ \mid \ p\ \in \ \operatorname{VisibleModulePaths}(m)\ \} \\[0.16em]
\mathsf{ModulePaths}\ =\ \operatorname{VisibleModulePaths}(m) \\[0.16em]
\mathsf{ModuleNames}\ =\ \operatorname{VisibleModuleNames}(m) \\[0.16em]
\mathsf{Alias}\ =\ \operatorname{AliasMap}(m) \\[0.16em]
\mathsf{AllModules}\ =\ \operatorname{AllModulePaths}(P)
\end{array}
$$

**Module Prefix Resolution.**

$$
\operatorname{ModulePathPrefix}(\mathsf{path},\ \mathsf{pref})\ \Leftrightarrow \ \exists \ \mathsf{rest}.\ \mathsf{path}\ =\ \mathsf{pref}\ \mathbin{++} \ \mathsf{rest}
$$

**(AliasExpand-None)**

$$
\begin{array}{l}
\mathsf{path}\ =\ a\mathbin{::} \mathsf{rest}\quad a\ \notin \ \operatorname{dom}(\mathsf{Alias}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AliasExpand}(\mathsf{path},\ \mathsf{Alias})\ \Downarrow \ \mathsf{path}
\end{array}
$$

**(AliasExpand-Yes)**

$$
\begin{array}{l}
\mathsf{path}\ =\ a\mathbin{::} \mathsf{rest}\quad a\ \in \ \operatorname{dom}(\mathsf{Alias})\quad \mathsf{Alias}[a]\ =\ p_{a} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AliasExpand}(\mathsf{path},\ \mathsf{Alias})\ \Downarrow \ p_{a}\ \mathbin{++} \ \mathsf{rest}
\end{array}
$$

$$
\operatorname{CurrentAsmPath}(m,\ \mathsf{path})\ =\ [\operatorname{AsmOfModule}(m)]\ \mathbin{++} \ \mathsf{path}
$$

**(ModulePrefix-Direct)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{AliasExpand}(\mathsf{path},\ \mathsf{Alias})\ \Downarrow \ \mathsf{path}'\quad \exists \ p\ \in \ \mathsf{AllModules},\ \operatorname{ModulePathPrefix}(\mathsf{path}',\ p)\quad p\ =\ \mathsf{argmax}\_\{q\ \in \ \mathsf{AllModules},\ \operatorname{ModulePathPrefix}(\mathsf{path}',\ q)\}\ \mid q\mid  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ModulePrefix}(\mathsf{path},\ \mathsf{AllModules},\ \mathsf{Alias})\ \Downarrow \ p
\end{array}
$$

**(ModulePrefix-Current)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{AliasExpand}(\mathsf{path},\ \mathsf{Alias})\ \Downarrow \ \mathsf{path}'\quad \lnot \ \exists \ p\ \in \ \mathsf{AllModules}.\ \operatorname{ModulePathPrefix}(\mathsf{path}',\ p)\quad \mathsf{path}''\ =\ \operatorname{CurrentAsmPath}(m,\ \mathsf{path}')\quad \exists \ p\ \in \ \mathsf{AllModules},\ \operatorname{ModulePathPrefix}(\mathsf{path}'',\ p)\quad p\ =\ \mathsf{argmax}\_\{q\ \in \ \mathsf{AllModules},\ \operatorname{ModulePathPrefix}(\mathsf{path}'',\ q)\}\ \mid q\mid  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ModulePrefix}(\mathsf{path},\ \mathsf{AllModules},\ \mathsf{Alias})\ \Downarrow \ p
\end{array}
$$

**(ModulePrefix-None)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{AliasExpand}(\mathsf{path},\ \mathsf{Alias})\ \Downarrow \ \mathsf{path}'\quad \lnot \ \exists \ p\ \in \ \mathsf{AllModules}.\ \operatorname{ModulePathPrefix}(\mathsf{path}',\ p)\quad \mathsf{path}''\ =\ \operatorname{CurrentAsmPath}(m,\ \mathsf{path}')\quad \lnot \ \exists \ p\ \in \ \mathsf{AllModules}.\ \operatorname{ModulePathPrefix}(\mathsf{path}'',\ p) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ModulePrefix}(\mathsf{path},\ \mathsf{AllModules},\ \mathsf{Alias})\ \uparrow 
\end{array}
$$

**(Resolve-ModulePath-Direct)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{AliasExpand}(\mathsf{path},\ \mathsf{Alias})\ \Downarrow \ \mathsf{path}'\quad \operatorname{StringOfPath}(\mathsf{path}')\ \in \ \mathsf{ModuleNames} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveModulePath}(\mathsf{path},\ \mathsf{Alias},\ \mathsf{ModuleNames})\ \Downarrow \ \mathsf{path}'
\end{array}
$$

**(Resolve-ModulePath-Current)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{AliasExpand}(\mathsf{path},\ \mathsf{Alias})\ \Downarrow \ \mathsf{path}'\quad \operatorname{StringOfPath}(\mathsf{path}')\ \notin \ \mathsf{ModuleNames}\quad \mathsf{path}''\ =\ \operatorname{CurrentAsmPath}(m,\ \mathsf{path}')\quad \operatorname{StringOfPath}(\mathsf{path}'')\ \in \ \mathsf{ModuleNames} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveModulePath}(\mathsf{path},\ \mathsf{Alias},\ \mathsf{ModuleNames})\ \Downarrow \ \mathsf{path}''
\end{array}
$$

**(ResolveModulePath-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{AliasExpand}(\mathsf{path},\ \mathsf{Alias})\ \Downarrow \ \mathsf{path}'\quad \operatorname{StringOfPath}(\mathsf{path}')\ \notin \ \mathsf{ModuleNames}\quad \mathsf{path}''\ =\ \operatorname{CurrentAsmPath}(m,\ \mathsf{path}')\quad \operatorname{StringOfPath}(\mathsf{path}'')\ \notin \ \mathsf{ModuleNames}\quad c\ =\ \operatorname{Code}(\mathsf{ResolveModulePath}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveModulePath}(\mathsf{path},\ \mathsf{Alias},\ \mathsf{ModuleNames})\ \Uparrow \ c
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ModuleByPath}(P,\ p)\ =\ m\ \Leftrightarrow \ \operatorname{ASTModule}(P,\ p)\ =\ m \\[0.16em]
\operatorname{ModuleOfPath}(\mathsf{path})\ =\ \mathsf{mp}\ \Leftrightarrow \ \operatorname{SplitLast}(\mathsf{path})\ =\ (\mathsf{mp},\ \mathsf{name})
\end{array}
$$

$$
\operatorname{ItemNames}(\mathsf{mp})\ =\ \{\ n\ \mid \ \operatorname{NameMap}(P,\ \mathsf{mp})[n].\mathsf{kind}\ \in \ \{\mathsf{Value},\ \mathsf{Type},\ \mathsf{Class}\}\ \}
$$

**(ItemOfPath)**
|path| ≥ 2    SplitLast(path) = (mp_raw, name)    Γ ⊢ ResolveImportPath(mp_raw) ⇓ mp    IdKey(name) ∈ ItemNames(mp)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ItemOfPath}(\mathsf{path})\ \Downarrow \ (\mathsf{mp},\ \mathsf{name})
\end{array}
$$

**(ItemOfPath-None)**

$$
\begin{array}{l}
\lnot \ (\mid \mathsf{path}\mid \ \ge \ 2\ \land \ \operatorname{SplitLast}(\mathsf{path})\ =\ (\mathsf{mp}_{\mathsf{raw}},\ \mathsf{name})\ \land \ \Gamma \ \vdash \ \operatorname{ResolveImportPath}(\mathsf{mp}_{\mathsf{raw}})\ \Downarrow \ \mathsf{mp}\ \land \ \operatorname{IdKey}(\mathsf{name})\ \in \ \operatorname{ItemNames}(\mathsf{mp})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ItemOfPath}(\mathsf{path})\ \uparrow 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ImportRequired}(m,\ \mathsf{path})\ \Leftrightarrow \ \operatorname{AsmOfPath}(\mathsf{path})\ \ne \ \operatorname{AsmOfModule}(m) \\[0.16em]
\operatorname{ImportCovers}(m,\ \mathsf{path})\ \Leftrightarrow \ \exists \ p\ \in \ \operatorname{ImportPaths}(m).\ \operatorname{ModulePathPrefix}(p,\ \mathsf{path}) \\[0.16em]
\mathsf{ImportOkJudg}\ =\ \{\mathsf{ImportOk}\}
\end{array}
$$

**(Import-Ok-Local)**

$$
\begin{array}{l}
\lnot \ \operatorname{ImportRequired}(m,\ \mathsf{path}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ImportOk}(m,\ \mathsf{path})\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(Import-Ok-Covered)**
ImportRequired(m, path)    ImportCovers(m, path)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ImportOk}(m,\ \mathsf{path})\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(Import-Ok-Err)**

$$
\begin{array}{l}
\operatorname{ImportRequired}(m,\ \mathsf{path})\quad \lnot \ \operatorname{ImportCovers}(m,\ \mathsf{path})\quad c\ =\ \operatorname{Code}(\mathsf{Import}-\mathsf{Using}-\mathsf{Missing}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ImportOk}(m,\ \mathsf{path})\ \Uparrow \ c
\end{array}
$$

**(Resolve-Import-Direct)**

$$
\begin{array}{l}
\operatorname{StringOfPath}(\mathsf{path})\ \in \ \mathsf{AllModuleNames} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveImportPath}(\mathsf{path})\ \Downarrow \ \mathsf{path}
\end{array}
$$

**(Resolve-Import-Current)**

$$
\begin{array}{l}
\operatorname{StringOfPath}(\mathsf{path})\ \notin \ \mathsf{AllModuleNames}\quad \mathsf{path}'\ =\ \operatorname{CurrentAsmPath}(m,\ \mathsf{path})\quad \operatorname{StringOfPath}(\mathsf{path}')\ \in \ \mathsf{AllModuleNames} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveImportPath}(\mathsf{path})\ \Downarrow \ \mathsf{path}'
\end{array}
$$

**(Resolve-Import-Err)**

$$
\begin{array}{l}
\operatorname{StringOfPath}(\mathsf{path})\ \notin \ \mathsf{AllModuleNames}\quad \mathsf{path}'\ =\ \operatorname{CurrentAsmPath}(m,\ \mathsf{path})\quad \operatorname{StringOfPath}(\mathsf{path}')\ \notin \ \mathsf{AllModuleNames}\quad c\ =\ \operatorname{Code}(\mathsf{Resolve}-\mathsf{Import}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveImportPath}(\mathsf{path})\ \Uparrow \ c
\end{array}
$$

**(Resolve-Using-Ok)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ItemOfPath}(\mathsf{path})\ \Downarrow \ (\mathsf{mp},\ \mathsf{name}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveUsingPath}(\mathsf{path})\ \Downarrow \ \langle \mathsf{mp},\ \mathsf{name}\rangle 
\end{array}
$$

**(Resolve-Using-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ItemOfPath}(\mathsf{path})\ \uparrow \quad c\ =\ \operatorname{Code}(\mathsf{Resolve}-\mathsf{Using}-\mathsf{None}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveUsingPath}(\mathsf{path})\ \Uparrow \ c
\end{array}
$$

Accessibility of resolved items is defined by Chapter 7.

**Initialization Dependency Analysis.**

$$
\mathsf{env}_{m}\ =\ \langle \mathsf{self}\ =\ m,\ \mathsf{Modules}\ =\ \mathsf{AllModules},\ \mathsf{Alias}\ =\ \operatorname{AliasMap}(m),\ \mathsf{UsingValueMap}\ =\ \operatorname{UsingValueMap}(m),\ \mathsf{UsingTypeMap}\ =\ \operatorname{UsingTypeMap}(m)\rangle 
$$

**(Reachable-Edge)**

$$
\begin{array}{l}
(u,\ v)\ \in \ E \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Reachable}(u,\ v,\ E)
\end{array}
$$

**(Reachable-Step)**

$$
\begin{array}{l}
(u,\ w)\ \in \ E\quad \Gamma \ \vdash \ \operatorname{Reachable}(w,\ v,\ E) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Reachable}(u,\ v,\ E)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{FullPath}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{path}\ \mathbin{++} \ [\mathsf{name}] \\[0.16em]
\operatorname{EnumPath}(\mathsf{path})\ =\ p\ \Leftrightarrow \ \operatorname{SplitLast}(\mathsf{path})\ =\ (p,\ n) \\[0.16em]
\operatorname{VariantName}(\mathsf{path})\ =\ n\ \Leftrightarrow \ \operatorname{SplitLast}(\mathsf{path})\ =\ (p,\ n)
\end{array}
$$

$$
\mathsf{TypeRefsJudg}\ =\ \{\mathsf{TypeRefsTy},\ \mathsf{TypeRefsRef},\ \mathsf{TypeRefsExpr},\ \mathsf{TypeRefsPat},\ \mathsf{TypeRefsArgs}\}
$$
Modules = env.Modules
Alias = env.Alias
UsingTypeMap = env.UsingTypeMap

**(TypeRef-Path)**
|path| ≥ 2    Γ ⊢ ModulePrefix(path, Modules, Alias) ⇓ mp    mp ≠ env.self

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypePath}(\mathsf{path}),\ \mathsf{env})\ \Downarrow \ \{\mathsf{mp}\}
\end{array}
$$

**(TypeRef-Using)**

$$
\begin{array}{l}
\mathsf{path}\ =\ [\mathsf{name}]\quad \mathsf{name}\ \in \ \operatorname{dom}(\mathsf{UsingTypeMap})\quad \mathsf{UsingTypeMap}[\mathsf{name}]\ \ne \ \mathsf{env}.\mathsf{self} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypePath}(\mathsf{path}),\ \mathsf{env})\ \Downarrow \ \{\mathsf{UsingTypeMap}[\mathsf{name}]\}
\end{array}
$$

**(TypeRef-Path-Local)**

$$
\begin{array}{l}
(\mid \mathsf{path}\mid \ \ne \ 1\ \lor \ (\mathsf{path}\ =\ [\mathsf{name}]\ \land \ \mathsf{name}\ \notin \ \operatorname{dom}(\mathsf{UsingTypeMap})))\quad (\Gamma \ \vdash \ \operatorname{ModulePrefix}(\mathsf{path},\ \mathsf{Modules},\ \mathsf{Alias})\ \Uparrow \ \lor \ \Gamma \ \vdash \ \operatorname{ModulePrefix}(\mathsf{path},\ \mathsf{Modules},\ \mathsf{Alias})\ \Downarrow \ \mathsf{env}.\mathsf{self}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypePath}(\mathsf{path}),\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
$$

**(TypeRef-Dynamic)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypePath}(\mathsf{path}),\ \mathsf{env})\ \Downarrow \ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeDynamic}(\mathsf{path}),\ \mathsf{env})\ \Downarrow \ T
\end{array}
$$

**(TypeRef-ModalState)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsRef}(\mathsf{modal}_{\mathsf{ref}},\ \mathsf{env})\ \Downarrow \ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ \mathsf{state}),\ \mathsf{env})\ \Downarrow \ T
\end{array}
$$

**(TypeRef-Apply)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypePath}(\mathsf{path}),\ \mathsf{env})\ \Downarrow \ T_{p}\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{TypeRefsTy}(\mathsf{args}_{i},\ \mathsf{env})\ \Downarrow \ T_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeApply}(\mathsf{path},\ \mathsf{args}),\ \mathsf{env})\ \Downarrow \ T_{p}\ \cup \ \bigcup \_\{i=1\}^n\ T_{i}
\end{array}
$$

**(TypeRef-Perm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\mathsf{base},\ \mathsf{env})\ \Downarrow \ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypePerm}(\mathsf{perm},\ \mathsf{base}),\ \mathsf{env})\ \Downarrow \ T
\end{array}
$$

**(TypeRef-Prim)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypePrim}(\_),\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
$$

**(TypeRef-Tuple)**

$$
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{TypeRefsTy}(t_{i},\ \mathsf{env})\ \Downarrow \ T_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeTuple}([t_{1},\ \ldots ,\ t_{n}]),\ \mathsf{env})\ \Downarrow \ \bigcup \_\{i=1\}^n\ T_{i}
\end{array}
$$

**(TypeRef-Array)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\mathsf{elem},\ \mathsf{env})\ \Downarrow \ T_{e}\quad \Gamma \ \vdash \ \operatorname{TypeRefsExpr}(\mathsf{size}_{\mathsf{expr}},\ \mathsf{env})\ \Downarrow \ T_{s} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeArray}(\mathsf{elem},\ \mathsf{size}_{\mathsf{expr}}),\ \mathsf{env})\ \Downarrow \ T_{e}\ \cup \ T_{s}
\end{array}
$$

**(TypeRef-Slice)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\mathsf{elem},\ \mathsf{env})\ \Downarrow \ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeSlice}(\mathsf{elem}),\ \mathsf{env})\ \Downarrow \ T
\end{array}
$$

**(TypeRef-Union)**

$$
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{TypeRefsTy}(t_{i},\ \mathsf{env})\ \Downarrow \ T_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeUnion}([t_{1},\ \ldots ,\ t_{n}]),\ \mathsf{env})\ \Downarrow \ \bigcup \_\{i=1\}^n\ T_{i}
\end{array}
$$

**(TypeRef-Func)**

$$
\begin{array}{l}
\forall \ i,\ \mathsf{params}_{i}\ =\ \langle m_{i},\ t_{i}\rangle \quad \Gamma \ \vdash \ \operatorname{TypeRefsTy}(t_{i},\ \mathsf{env})\ \Downarrow \ T_{i}\quad \Gamma \ \vdash \ \operatorname{TypeRefsTy}(\mathsf{ret},\ \mathsf{env})\ \Downarrow \ T_{r} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeFunc}([\mathsf{params}_{1},\ \ldots ,\ \mathsf{params}_{n}],\ \mathsf{ret}),\ \mathsf{env})\ \Downarrow \ (\bigcup \_\{i=1\}^n\ T_{i})\ \cup \ T_{r}
\end{array}
$$

**(TypeRef-String)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeString}(\_),\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
$$

**(TypeRef-Bytes)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeBytes}(\_),\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
$$

**(TypeRef-Ptr)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\mathsf{elem},\ \mathsf{env})\ \Downarrow \ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypePtr}(\mathsf{elem},\ \_),\ \mathsf{env})\ \Downarrow \ T
\end{array}
$$

**(TypeRef-RawPtr)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\mathsf{elem},\ \mathsf{env})\ \Downarrow \ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeRawPtr}(\_,\ \mathsf{elem}),\ \mathsf{env})\ \Downarrow \ T
\end{array}
$$

**(TypeRef-Range)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\mathsf{base},\ \mathsf{env})\ \Downarrow \ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeRange}(\mathsf{base}),\ \mathsf{env})\ \Downarrow \ T
\end{array}
$$

**(TypeRef-RangeInclusive)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\mathsf{base},\ \mathsf{env})\ \Downarrow \ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeRangeInclusive}(\mathsf{base}),\ \mathsf{env})\ \Downarrow \ T
\end{array}
$$

**(TypeRef-RangeFrom)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\mathsf{base},\ \mathsf{env})\ \Downarrow \ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeRangeFrom}(\mathsf{base}),\ \mathsf{env})\ \Downarrow \ T
\end{array}
$$

**(TypeRef-RangeTo)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\mathsf{base},\ \mathsf{env})\ \Downarrow \ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeRangeTo}(\mathsf{base}),\ \mathsf{env})\ \Downarrow \ T
\end{array}
$$

**(TypeRef-RangeToInclusive)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\mathsf{base},\ \mathsf{env})\ \Downarrow \ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeRangeToInclusive}(\mathsf{base}),\ \mathsf{env})\ \Downarrow \ T
\end{array}
$$

**(TypeRef-RangeFull)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\mathsf{TypeRangeFull},\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
$$

**(TypeRef-Ref-Path)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypePath}(\mathsf{path}),\ \mathsf{env})\ \Downarrow \ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsRef}(\operatorname{TypePath}(\mathsf{path}),\ \mathsf{env})\ \Downarrow \ T
\end{array}
$$

**(TypeRef-Ref-Apply)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeApply}(\mathsf{path},\ \mathsf{args}),\ \mathsf{env})\ \Downarrow \ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsRef}(\operatorname{TypeApply}(\mathsf{path},\ \mathsf{args}),\ \mathsf{env})\ \Downarrow \ T
\end{array}
$$

**(TypeRef-Ref-ModalState)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ \mathsf{state}),\ \mathsf{env})\ \Downarrow \ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsRef}(\operatorname{ModalStateRef}(\mathsf{modal}_{\mathsf{ref}},\ \mathsf{state}),\ \mathsf{env})\ \Downarrow \ T
\end{array}
$$

**(TypeRef-RecordExpr)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsRef}(r,\ \mathsf{env})\ \Downarrow \ T_{t}\quad \Gamma \ \vdash \ \operatorname{TypeRefsExprs}(\mathsf{fields},\ \mathsf{env})\ \Downarrow \ T_{e} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsExpr}(\operatorname{RecordExpr}(r,\ \mathsf{fields}),\ \mathsf{env})\ \Downarrow \ T_{t}\ \cup \ T_{e}
\end{array}
$$

**(TypeRef-EnumLiteral)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypePath}(\operatorname{EnumPath}(\mathsf{path})),\ \mathsf{env})\ \Downarrow \ T_{t}\quad \Gamma \ \vdash \ \operatorname{TypeRefsEnumPayload}(\mathsf{payload}_{\mathsf{opt}},\ \mathsf{env})\ \Downarrow \ T_{p} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsExpr}(\operatorname{EnumLiteral}(\mathsf{path},\ \mathsf{payload}_{\mathsf{opt}}),\ \mathsf{env})\ \Downarrow \ T_{t}\ \cup \ T_{p}
\end{array}
$$

**(TypeRef-QualBrace)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypePath}(\operatorname{FullPath}(\mathsf{path},\ \mathsf{name})),\ \mathsf{env})\ \Downarrow \ T_{t}\quad \Gamma \ \vdash \ \operatorname{TypeRefsExprs}(\mathsf{fields},\ \mathsf{env})\ \Downarrow \ T_{f} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsExpr}(\operatorname{QualifiedApply}(\mathsf{path},\ \mathsf{name},\ \operatorname{Brace}(\mathsf{fields})),\ \mathsf{env})\ \Downarrow \ T_{t}\ \cup \ T_{f}
\end{array}
$$

**(TypeRef-Cast)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsExpr}(e,\ \mathsf{env})\ \Downarrow \ T_{e}\quad \Gamma \ \vdash \ \operatorname{TypeRefsTy}(\mathsf{ty},\ \mathsf{env})\ \Downarrow \ T_{t} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsExpr}(\operatorname{Cast}(e,\ \mathsf{ty}),\ \mathsf{env})\ \Downarrow \ T_{e}\ \cup \ T_{t}
\end{array}
$$

**(TypeRef-Transmute)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsExpr}(e,\ \mathsf{env})\ \Downarrow \ T_{e}\quad \Gamma \ \vdash \ \operatorname{TypeRefsTy}(t_{1},\ \mathsf{env})\ \Downarrow \ T_{1}\quad \Gamma \ \vdash \ \operatorname{TypeRefsTy}(t_{2},\ \mathsf{env})\ \Downarrow \ T_{2} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsExpr}(\operatorname{TransmuteExpr}(t_{1},\ t_{2},\ e),\ \mathsf{env})\ \Downarrow \ T_{e}\ \cup \ T_{1}\ \cup \ T_{2}
\end{array}
$$

**(TypeRef-CallTypeArgs)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsExpr}(\mathsf{callee},\ \mathsf{env})\ \Downarrow \ T_{c}\quad \Gamma \ \vdash \ \operatorname{TypeRefsArgs}(\mathsf{args},\ \mathsf{env})\ \Downarrow \ T_{a}\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{TypeRefsTy}(\mathsf{type}_{\mathsf{args}}[i],\ \mathsf{env})\ \Downarrow \ T_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsExpr}(\operatorname{CallTypeArgs}(\mathsf{callee},\ \mathsf{type}_{\mathsf{args}},\ \mathsf{args}),\ \mathsf{env})\ \Downarrow \ T_{c}\ \cup \ T_{a}\ \cup \ \bigcup \_\{i=1\}^n\ T_{i}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{TypeRefsExprRules}\ =\ \{\mathsf{TypeRef}-\mathsf{RecordExpr},\ \mathsf{TypeRef}-\mathsf{EnumLiteral},\ \mathsf{TypeRef}-\mathsf{QualBrace},\ \mathsf{TypeRef}-\mathsf{Cast},\ \mathsf{TypeRef}-\mathsf{Transmute},\ \mathsf{TypeRef}-\mathsf{CallTypeArgs},\ \mathsf{TypeRef}-\mathsf{Expr}-\mathsf{Sub}\} \\[0.16em]
\operatorname{NoSpecificTypeRefsExpr}(e)\ \Leftrightarrow \ \lnot \ \exists \ r\ \in \ \mathsf{TypeRefsExprRules}\ \setminus \ \{\mathsf{TypeRef}-\mathsf{Expr}-\mathsf{Sub}\}.\ \operatorname{PremisesHold}(r,\ e)
\end{array}
$$

**(TypeRef-Expr-Sub)**

$$
\begin{array}{l}
\operatorname{NoSpecificTypeRefsExpr}(e)\quad \operatorname{Children_LTR}(e)\ =\ [e_{1},\ \ldots ,\ e_{n}]\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{TypeRefsExpr}(e_{i},\ \mathsf{env})\ \Downarrow \ T_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsExpr}(e,\ \mathsf{env})\ \Downarrow \ \bigcup \_\{i=1\}^n\ T_{i}
\end{array}
$$

**(TypeRef-RecordPattern)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypePath}(\mathsf{tp}),\ \mathsf{env})\ \Downarrow \ T_{t}\quad \Gamma \ \vdash \ \operatorname{TypeRefsFields}(\mathsf{fields},\ \mathsf{env})\ \Downarrow \ T_{f} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsPat}(\operatorname{RecordPattern}(\mathsf{tp},\ \mathsf{fields}),\ \mathsf{env})\ \Downarrow \ T_{t}\ \cup \ T_{f}
\end{array}
$$

**(TypeRef-EnumPattern)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(\operatorname{TypePath}(\mathsf{tp}),\ \mathsf{env})\ \Downarrow \ T_{t}\quad \Gamma \ \vdash \ \operatorname{TypeRefsPayload}(\mathsf{payload},\ \mathsf{env})\ \Downarrow \ T_{p} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsPat}(\operatorname{EnumPattern}(\mathsf{tp},\ \_,\ \mathsf{payload}),\ \mathsf{env})\ \Downarrow \ T_{t}\ \cup \ T_{p}
\end{array}
$$

**(TypeRef-LiteralPattern)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsPat}(\operatorname{LiteralPattern}(\_),\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
$$

**(TypeRef-WildcardPattern)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsPat}(\mathsf{WildcardPattern},\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
$$

**(TypeRef-IdentifierPattern)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsPat}(\operatorname{IdentifierPattern}(\_),\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
$$

**(TypeRef-TypedPattern)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsTy}(T,\ \mathsf{env})\ \Downarrow \ T_{\mathsf{refs}} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsPat}(\operatorname{TypedPattern}(\_,\ T),\ \mathsf{env})\ \Downarrow \ T_{\mathsf{refs}}
\end{array}
$$

**(TypeRef-TuplePattern)**

$$
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{TypeRefsPat}(p_{i},\ \mathsf{env})\ \Downarrow \ T_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsPat}(\operatorname{TuplePattern}([p_{1},\ \ldots ,\ p_{n}]),\ \mathsf{env})\ \Downarrow \ \bigcup \_\{i=1\}^n\ T_{i}
\end{array}
$$

**(TypeRef-ModalPattern-None)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsPat}(\operatorname{ModalPattern}(\_,\ \bot ),\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
$$

**(TypeRef-ModalPattern-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsFields}(\mathsf{fields},\ \mathsf{env})\ \Downarrow \ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsPat}(\operatorname{ModalPattern}(\_,\ \operatorname{ModalRecordPayload}(\mathsf{fields})),\ \mathsf{env})\ \Downarrow \ T
\end{array}
$$

**(TypeRef-RangePattern)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsPat}(p_{l},\ \mathsf{env})\ \Downarrow \ T_{l}\quad \Gamma \ \vdash \ \operatorname{TypeRefsPat}(p_{h},\ \mathsf{env})\ \Downarrow \ T_{h} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsPat}(\operatorname{RangePattern}(\_,\ p_{l},\ p_{h}),\ \mathsf{env})\ \Downarrow \ T_{l}\ \cup \ T_{h}
\end{array}
$$

**(TypeRef-Field-Explicit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsPat}(p,\ \mathsf{env})\ \Downarrow \ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsPat}(\langle \mathsf{name},\ \mathsf{pattern}_{\mathsf{opt}}\ =\ p,\ \mathsf{span}\rangle ,\ \mathsf{env})\ \Downarrow \ T
\end{array}
$$

**(TypeRef-Field-Implicit)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsPat}(\langle \mathsf{name},\ \mathsf{pattern}_{\mathsf{opt}}\ =\ \bot ,\ \mathsf{span}\rangle ,\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
$$

**(TypeRefsExprs-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsExprs}([],\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
$$

**(TypeRefsExprs-Cons)**

$$
\begin{array}{l}
f\ =\ \langle \mathsf{name},\ e\rangle \quad \Gamma \ \vdash \ \operatorname{TypeRefsExpr}(e,\ \mathsf{env})\ \Downarrow \ T_{e}\quad \Gamma \ \vdash \ \operatorname{TypeRefsExprs}(\mathsf{fs},\ \mathsf{env})\ \Downarrow \ T_{f} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsExprs}(f\mathbin{::} \mathsf{fs},\ \mathsf{env})\ \Downarrow \ T_{e}\ \cup \ T_{f}
\end{array}
$$

$$
\mathsf{TypeRefsArgsJudg}\ =\ \{\mathsf{TypeRefsArgs}\}
$$

**(TypeRefsArgs-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsArgs}([],\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
$$

**(TypeRefsArgs-Cons)**

$$
\begin{array}{l}
a\ =\ \langle \mathsf{moved},\ e,\ \mathsf{span}\rangle \quad \Gamma \ \vdash \ \operatorname{TypeRefsExpr}(e,\ \mathsf{env})\ \Downarrow \ T_{e}\quad \Gamma \ \vdash \ \operatorname{TypeRefsArgs}(\mathsf{rest},\ \mathsf{env})\ \Downarrow \ T_{r} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsArgs}(a\mathbin{::} \mathsf{rest},\ \mathsf{env})\ \Downarrow \ T_{e}\ \cup \ T_{r}
\end{array}
$$

**(TypeRefsEnumPayload-None)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsEnumPayload}(\bot ,\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
$$

**(TypeRefsEnumPayload-Tuple)**

$$
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{TypeRefsExpr}(e_{i},\ \mathsf{env})\ \Downarrow \ T_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsEnumPayload}(\operatorname{Paren}([e_{1},\ \ldots ,\ e_{n}]),\ \mathsf{env})\ \Downarrow \ \bigcup \_\{i=1\}^n\ T_{i}
\end{array}
$$

**(TypeRefsEnumPayload-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsExprs}(\mathsf{fields},\ \mathsf{env})\ \Downarrow \ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsEnumPayload}(\operatorname{Brace}(\mathsf{fields}),\ \mathsf{env})\ \Downarrow \ T
\end{array}
$$

**(TypeRefsFields-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsFields}([],\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
$$

**(TypeRefsFields-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsPat}(f,\ \mathsf{env})\ \Downarrow \ T_{f}\quad \Gamma \ \vdash \ \operatorname{TypeRefsFields}(\mathsf{fs},\ \mathsf{env})\ \Downarrow \ T_{s} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsFields}(f\mathbin{::} \mathsf{fs},\ \mathsf{env})\ \Downarrow \ T_{f}\ \cup \ T_{s}
\end{array}
$$

**(TypeRefsPayload-None)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsPayload}(\bot ,\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
$$

**(TypeRefsPayload-Tuple)**

$$
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{TypeRefsPat}(p_{i},\ \mathsf{env})\ \Downarrow \ T_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsPayload}(\operatorname{TuplePayloadPattern}([p_{1},\ \ldots ,\ p_{n}]),\ \mathsf{env})\ \Downarrow \ \bigcup \_\{i=1\}^n\ T_{i}
\end{array}
$$

**(TypeRefsPayload-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypeRefsFields}(\mathsf{fields},\ \mathsf{env})\ \Downarrow \ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TypeRefsPayload}(\operatorname{RecordPayloadPattern}(\mathsf{fields}),\ \mathsf{env})\ \Downarrow \ T
\end{array}
$$

UsingValueMap = env.UsingValueMap

$$
\mathsf{ValueRefsJudg}\ =\ \{\mathsf{ValueRefs},\ \mathsf{ValueRefsArgs},\ \mathsf{ValueRefsFields}\}
$$

**(ValueRef-Ident)**

$$
\begin{array}{l}
\mathsf{name}\ \in \ \operatorname{dom}(\mathsf{UsingValueMap})\quad \mathsf{UsingValueMap}[\mathsf{name}]\ \ne \ \mathsf{env}.\mathsf{self} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ValueRefs}(\operatorname{Identifier}(\mathsf{name}),\ \mathsf{env})\ \Downarrow \ \{\mathsf{UsingValueMap}[\mathsf{name}]\}
\end{array}
$$

**(ValueRef-Ident-Local)**

$$
\begin{array}{l}
\mathsf{name}\ \notin \ \operatorname{dom}(\mathsf{UsingValueMap}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ValueRefs}(\operatorname{Identifier}(\mathsf{name}),\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
$$

**(ValueRef-Qual)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ModulePrefix}(\mathsf{path},\ \mathsf{Modules},\ \mathsf{Alias})\ \Downarrow \ \mathsf{mp}\quad \mathsf{mp}\ \ne \ \mathsf{env}.\mathsf{self} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ValueRefs}(\operatorname{QualifiedName}(\mathsf{path},\ \_),\ \mathsf{env})\ \Downarrow \ \{\mathsf{mp}\}
\end{array}
$$

**(ValueRef-Qual-Local)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ModulePrefix}(\mathsf{path},\ \mathsf{Modules},\ \mathsf{Alias})\ \Uparrow \ \lor \ \Gamma \ \vdash \ \operatorname{ModulePrefix}(\mathsf{path},\ \mathsf{Modules},\ \mathsf{Alias})\ \Downarrow \ \mathsf{env}.\mathsf{self} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ValueRefs}(\operatorname{QualifiedName}(\mathsf{path},\ \_),\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
$$

**(ValueRef-QualApply)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ModulePrefix}(\mathsf{path},\ \mathsf{Modules},\ \mathsf{Alias})\ \Downarrow \ \mathsf{mp}\quad \mathsf{mp}\ \ne \ \mathsf{env}.\mathsf{self}\quad \Gamma \ \vdash \ \operatorname{ValueRefsArgs}(\mathsf{args},\ \mathsf{env})\ \Downarrow \ V_{a} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ValueRefs}(\operatorname{QualifiedApply}(\mathsf{path},\ \_,\ \operatorname{Paren}(\mathsf{args})),\ \mathsf{env})\ \Downarrow \ \{\mathsf{mp}\}\ \cup \ V_{a}
\end{array}
$$

**(ValueRef-QualApply-Local)**

$$
\begin{array}{l}
(\Gamma \ \vdash \ \operatorname{ModulePrefix}(\mathsf{path},\ \mathsf{Modules},\ \mathsf{Alias})\ \Uparrow \ \lor \ \Gamma \ \vdash \ \operatorname{ModulePrefix}(\mathsf{path},\ \mathsf{Modules},\ \mathsf{Alias})\ \Downarrow \ \mathsf{env}.\mathsf{self})\quad \Gamma \ \vdash \ \operatorname{ValueRefsArgs}(\mathsf{args},\ \mathsf{env})\ \Downarrow \ V_{a} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ValueRefs}(\operatorname{QualifiedApply}(\mathsf{path},\ \_,\ \operatorname{Paren}(\mathsf{args})),\ \mathsf{env})\ \Downarrow \ V_{a}
\end{array}
$$

**(ValueRef-QualApply-Brace)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ValueRefsFields}(\mathsf{fields},\ \mathsf{env})\ \Downarrow \ V_{f} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ValueRefs}(\operatorname{QualifiedApply}(\mathsf{path},\ \_,\ \operatorname{Brace}(\mathsf{fields})),\ \mathsf{env})\ \Downarrow \ V_{f}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{ValueRefsRules}\ =\ \{\mathsf{ValueRef}-\mathsf{Ident},\ \mathsf{ValueRef}-\mathsf{Ident}-\mathsf{Local},\ \mathsf{ValueRef}-\mathsf{Qual},\ \mathsf{ValueRef}-\mathsf{Qual}-\mathsf{Local},\ \mathsf{ValueRef}-\mathsf{QualApply},\ \mathsf{ValueRef}-\mathsf{QualApply}-\mathsf{Local},\ \mathsf{ValueRef}-\mathsf{QualApply}-\mathsf{Brace},\ \mathsf{ValueRef}-\mathsf{Expr}-\mathsf{Sub}\} \\[0.16em]
\operatorname{NoSpecificValueRefsExpr}(e)\ \Leftrightarrow \ \lnot \ \exists \ r\ \in \ \mathsf{ValueRefsRules}\ \setminus \ \{\mathsf{ValueRef}-\mathsf{Expr}-\mathsf{Sub}\}.\ \operatorname{PremisesHold}(r,\ e)
\end{array}
$$

**(ValueRef-Expr-Sub)**

$$
\begin{array}{l}
\operatorname{NoSpecificValueRefsExpr}(e)\quad \operatorname{Children_LTR}(e)\ =\ [e_{1},\ \ldots ,\ e_{n}]\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{ValueRefs}(e_{i},\ \mathsf{env})\ \Downarrow \ V_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ValueRefs}(e,\ \mathsf{env})\ \Downarrow \ \bigcup \_\{i=1\}^n\ V_{i}
\end{array}
$$

**(ValueRefsArgs-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ValueRefsArgs}([],\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
$$

**(ValueRefsArgs-Cons)**

$$
\begin{array}{l}
a\ =\ \langle \mathsf{moved},\ e,\ \mathsf{span}\rangle \quad \Gamma \ \vdash \ \operatorname{ValueRefs}(e,\ \mathsf{env})\ \Downarrow \ V_{e}\quad \Gamma \ \vdash \ \operatorname{ValueRefsArgs}(\mathsf{args},\ \mathsf{env})\ \Downarrow \ V_{a} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ValueRefsArgs}(a\mathbin{::} \mathsf{args},\ \mathsf{env})\ \Downarrow \ V_{e}\ \cup \ V_{a}
\end{array}
$$

**(ValueRefsFields-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ValueRefsFields}([],\ \mathsf{env})\ \Downarrow \ \emptyset 
\end{array}
$$

**(ValueRefsFields-Cons)**

$$
\begin{array}{l}
f\ =\ \langle \mathsf{name},\ e\rangle \quad \Gamma \ \vdash \ \operatorname{ValueRefs}(e,\ \mathsf{env})\ \Downarrow \ V_{e}\quad \Gamma \ \vdash \ \operatorname{ValueRefsFields}(\mathsf{fs},\ \mathsf{env})\ \Downarrow \ V_{f} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ValueRefsFields}(f\mathbin{::} \mathsf{fs},\ \mathsf{env})\ \Downarrow \ V_{e}\ \cup \ V_{f}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Elems}(v)\ = \\[0.16em]
\ \{v\}\quad \mathsf{if}\ v\ \in \ \mathsf{ASTNode} \\[0.16em]
\ \{x\ \mid \ x\ \in \ v\ \land \ x\ \in \ \mathsf{ASTNode}\}\quad \mathsf{if}\ v\ \in \ [\_] \\[0.16em]
\ \emptyset \quad \mathsf{if}\ v\ =\ \bot  \\[0.16em]
\ \emptyset \quad \mathsf{otherwise}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Child}(x,\ y)\ \Leftrightarrow \ \exists \ C,\ a_{1},\ \ldots ,\ a_{k}.\ x\ =\ \operatorname{C}(a_{1},\ \ldots ,\ a_{k})\ \land \ y\ \in \ \bigcup \_\{i=1\}^k\ \operatorname{Elems}(a_{i}) \\[0.16em]
E_{\mathsf{child}}\ =\ \{\ (x,\ y)\ \mid \ \operatorname{Child}(x,\ y)\ \} \\[0.16em]
\operatorname{Subnode}(x,\ y)\ \Leftrightarrow \ x\ =\ y\ \lor \ \Gamma \ \vdash \ \operatorname{Reachable}(x,\ y,\ E_{\mathsf{child}})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ExprNodes}(P,\ m)\ =\ \{\ e\ \mid \ e\ \in \ \mathsf{Expr}\ \land \ \operatorname{Subnode}(\operatorname{ASTModule}(P,\ m),\ e)\ \} \\[0.16em]
\operatorname{PatNodes}(P,\ m)\ =\ \{\ p\ \mid \ p\ \in \ \mathsf{Pattern}\ \land \ \operatorname{Subnode}(\operatorname{ASTModule}(P,\ m),\ p)\ \} \\[0.16em]
\operatorname{ExprNodesOf}(x)\ =\ \{\ e\ \mid \ e\ \in \ \mathsf{Expr}\ \land \ \operatorname{Subnode}(x,\ e)\ \}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{VariantPayloadTypeSet}(\bot )\ =\ \emptyset  \\[0.16em]
\operatorname{VariantPayloadTypeSet}(\operatorname{TuplePayload}(\mathsf{tys}))\ =\ \{\ t\ \mid \ t\ \in \ \mathsf{tys}\ \} \\[0.16em]
\operatorname{VariantPayloadTypeSet}(\operatorname{RecordPayload}(\mathsf{fields}))\ =\ \{\ t\ \mid \ \exists \ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{name},\ \mathsf{init}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}.\ \operatorname{FieldDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{name},\ t,\ \mathsf{init}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}})\ \in \ \mathsf{fields}\ \} \\[0.16em]
\operatorname{EnumVariantTypeSet}(\mathsf{variants})\ =\ \{\ t\ \mid \ \exists \ \mathsf{name},\ \mathsf{payload}_{\mathsf{opt}},\ \mathsf{disc}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}.\ \operatorname{VariantDecl}(\mathsf{name},\ \mathsf{payload}_{\mathsf{opt}},\ \mathsf{disc}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}})\ \in \ \mathsf{variants}\ \land \ t\ \in \ \operatorname{VariantPayloadTypeSet}(\mathsf{payload}_{\mathsf{opt}})\ \} \\[0.16em]
\operatorname{TypeOptSet}(\bot )\ =\ \emptyset  \\[0.16em]
\operatorname{TypeOptSet}(T)\ =\ \{T\} \\[0.16em]
\operatorname{ParamTypeSet}(\mathsf{params})\ =\ \{\ t\ \mid \ \exists \ \mathsf{mode},\ \mathsf{name}.\ \langle \mathsf{mode},\ \mathsf{name},\ t\rangle \ \in \ \mathsf{params}\ \} \\[0.16em]
\operatorname{RecvTypeSet}(\operatorname{ReceiverExplicit}(\_,\ t))\ =\ \{t\} \\[0.16em]
\operatorname{RecvTypeSet}(\operatorname{ReceiverShorthand}(\_))\ =\ \emptyset  \\[0.16em]
\operatorname{ClassPathTypeSet}(\mathsf{paths})\ =\ \{\ \operatorname{TypePath}(p)\ \mid \ p\ \in \ \mathsf{paths}\ \} \\[0.16em]
\operatorname{RecordFieldTypeSet}(\mathsf{members})\ =\ \{\ t\ \mid \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{name},\ \mathsf{init},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{FieldDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{name},\ t,\ \mathsf{init},\ \mathsf{span},\ \mathsf{doc})\ \in \ \mathsf{members}\ \} \\[0.16em]
\operatorname{RecordMethodRecvTypes}(\mathsf{members})\ =\ \{\ t\ \mid \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{ov},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{MethodDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{ov},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\ \in \ \mathsf{members}\ \land \ t\ \in \ \operatorname{RecvTypeSet}(\mathsf{recv})\ \} \\[0.16em]
\operatorname{RecordMethodParamTypes}(\mathsf{members})\ =\ \{\ t\ \mid \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{ov},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{MethodDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{ov},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\ \in \ \mathsf{members}\ \land \ t\ \in \ \operatorname{ParamTypeSet}(\mathsf{params})\ \} \\[0.16em]
\operatorname{RecordMethodRetTypes}(\mathsf{members})\ =\ \{\ t\ \mid \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{ov},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{MethodDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{ov},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\ \in \ \mathsf{members}\ \land \ t\ \in \ \operatorname{TypeOptSet}(\mathsf{ret})\ \} \\[0.16em]
\operatorname{RecordMemberTypeSet}(\mathsf{members})\ =\ \operatorname{RecordFieldTypeSet}(\mathsf{members})\ \cup \ \operatorname{RecordMethodRecvTypes}(\mathsf{members})\ \cup \ \operatorname{RecordMethodParamTypes}(\mathsf{members})\ \cup \ \operatorname{RecordMethodRetTypes}(\mathsf{members}) \\[0.16em]
\operatorname{ClassFieldTypeSet}(\mathsf{items})\ =\ \{\ t\ \mid \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{name},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{ClassFieldDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{boundary},\ \mathsf{name},\ t,\ \mathsf{span},\ \mathsf{doc})\ \in \ \mathsf{items}\ \} \\[0.16em]
\operatorname{ClassMethodRecvTypes}(\mathsf{items})\ =\ \{\ t\ \mid \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{ClassMethodDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\ \in \ \mathsf{items}\ \land \ t\ \in \ \operatorname{RecvTypeSet}(\mathsf{recv})\ \} \\[0.16em]
\operatorname{ClassMethodParamTypes}(\mathsf{items})\ =\ \{\ t\ \mid \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{ClassMethodDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\ \in \ \mathsf{items}\ \land \ t\ \in \ \operatorname{ParamTypeSet}(\mathsf{params})\ \} \\[0.16em]
\operatorname{ClassMethodRetTypes}(\mathsf{items})\ =\ \{\ t\ \mid \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{ClassMethodDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\ \in \ \mathsf{items}\ \land \ t\ \in \ \operatorname{TypeOptSet}(\mathsf{ret})\ \} \\[0.16em]
\operatorname{ClassItemTypeSet}(\mathsf{items})\ =\ \operatorname{ClassFieldTypeSet}(\mathsf{items})\ \cup \ \operatorname{ClassMethodRecvTypes}(\mathsf{items})\ \cup \ \operatorname{ClassMethodParamTypes}(\mathsf{items})\ \cup \ \operatorname{ClassMethodRetTypes}(\mathsf{items})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{TypePos_Static}(P,\ m)\ =\ \{\ t\ \mid \ \exists \ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{bind},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{bind},\ \mathsf{span},\ \mathsf{doc})\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \land \ \mathsf{bind}.\mathsf{type}_{\mathsf{opt}}\ =\ t\ \land \ t\ \ne \ \bot \ \} \\[0.16em]
\operatorname{TypePos_Proc}(P,\ m)\ =\ \{\ t\ \mid \ \exists \ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{return}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{ProcedureDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{return}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \land \ t\ \in \ (\operatorname{ParamTypeSet}(\mathsf{params})\ \cup \ \operatorname{TypeOptSet}(\mathsf{return}_{\mathsf{type}\_\mathsf{opt}}))\ \} \\[0.16em]
\operatorname{TypePos_Record}(P,\ m)\ =\ \{\ t\ \mid \ \exists \ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{impls},\ \mathsf{members},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{RecordDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{impls},\ \mathsf{members},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc})\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \land \ t\ \in \ (\operatorname{ClassPathTypeSet}(\mathsf{impls})\ \cup \ \operatorname{RecordMemberTypeSet}(\mathsf{members}))\ \} \\[0.16em]
\operatorname{TypePos_Enum}(P,\ m)\ =\ \{\ t\ \mid \ \exists \ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{impls},\ \mathsf{variants},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{EnumDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{impls},\ \mathsf{variants},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc})\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \land \ t\ \in \ (\operatorname{ClassPathTypeSet}(\mathsf{impls})\ \cup \ \operatorname{EnumVariantTypeSet}(\mathsf{variants}))\ \} \\[0.16em]
\operatorname{TypePos_Modal}(P,\ m)\ =\ \{\ t\ \mid \ \exists \ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{impls},\ \mathsf{states},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{ModalDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{impls},\ \mathsf{states},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc})\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \land \ t\ \in \ \operatorname{ClassPathTypeSet}(\mathsf{impls})\ \} \\[0.16em]
\operatorname{TypePos_Class}(P,\ m)\ =\ \{\ t\ \mid \ \exists \ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{modal},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{supers},\ \mathsf{items},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{ClassDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{modal},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{supers},\ \mathsf{items},\ \mathsf{span},\ \mathsf{doc})\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \land \ t\ \in \ (\operatorname{ClassPathTypeSet}(\mathsf{supers})\ \cup \ \operatorname{ClassItemTypeSet}(\mathsf{items}))\ \} \\[0.16em]
\operatorname{TypePos_Alias}(P,\ m)\ =\ \{\ t\ \mid \ \exists \ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{ty},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{TypeAliasDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{ty},\ \mathsf{span},\ \mathsf{doc})\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \land \ t\ =\ \mathsf{ty}\ \} \\[0.16em]
\operatorname{TypePositions}(P,\ m)\ =\ \operatorname{TypePos_Static}(P,\ m)\ \cup \ \operatorname{TypePos_Proc}(P,\ m)\ \cup \ \operatorname{TypePos_Record}(P,\ m)\ \cup \ \operatorname{TypePos_Enum}(P,\ m)\ \cup \ \operatorname{TypePos_Modal}(P,\ m)\ \cup \ \operatorname{TypePos_Class}(P,\ m)\ \cup \ \operatorname{TypePos_Alias}(P,\ m)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ArraySizeExprs}(P,\ m)\ =\ \{\ e\ \mid \ \exists \ \mathsf{elem}.\ \operatorname{TypeArray}(\mathsf{elem},\ e)\ \in \ \operatorname{TypePositions}(P,\ m)\ \} \\[0.16em]
\operatorname{EnumDiscriminantExprs}(P,\ m)\ =\ \{\ e\ \mid \ \exists \ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{impls},\ \mathsf{variants},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{EnumDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{impls},\ \mathsf{variants},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc})\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \land \ \exists \ v.\ v\ =\ \operatorname{VariantDecl}(\_,\ \_,\ e,\ \_,\ \_)\ \in \ \mathsf{variants}\ \land \ e\ \ne \ \bot \ \} \\[0.16em]
\operatorname{TypePosExprs}(P,\ m)\ =\ \operatorname{ArraySizeExprs}(P,\ m)\ \cup \ \operatorname{EnumDiscriminantExprs}(P,\ m)
\end{array}
$$

$$
\operatorname{TypeDeps}(P,\ m)\ =\ \{\ n\ \mid \ \exists \ t\ \in \ \operatorname{TypePositions}(P,\ m).\ \Gamma \ \vdash \ \operatorname{TypeRefsTy}(t,\ \mathsf{env}_{m})\ \Downarrow \ T\ \land \ n\ \in \ T\ \}\ \cup \ \{\ n\ \mid \ \exists \ p\ \in \ \operatorname{PatNodes}(P,\ m).\ \Gamma \ \vdash \ \operatorname{TypeRefsPat}(p,\ \mathsf{env}_{m})\ \Downarrow \ T\ \land \ n\ \in \ T\ \}\ \cup \ \{\ n\ \mid \ \exists \ e\ \in \ (\operatorname{ExprNodes}(P,\ m)\ \cup \ \operatorname{TypePosExprs}(P,\ m)).\ \Gamma \ \vdash \ \operatorname{TypeRefsExpr}(e,\ \mathsf{env}_{m})\ \Downarrow \ T\ \land \ n\ \in \ T\ \}
$$

$$
\begin{array}{l}
\operatorname{StaticInitExprs}(P,\ m)\ =\ \{\ \mathsf{init}\ \mid \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{bind},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{StaticDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{bind},\ \mathsf{span},\ \mathsf{doc})\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \land \ \mathsf{bind}.\mathsf{init}\ =\ \mathsf{init}\ \} \\[0.16em]
\operatorname{RecordFieldInitExprs}(P,\ m)\ =\ \{\ \mathsf{init}\ \mid \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{impls},\ \mathsf{members},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{RecordDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{impls},\ \mathsf{members},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc})\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \land \ \exists \ f.\ f\ =\ \operatorname{FieldDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \mathsf{init},\ \_,\ \_)\ \in \ \mathsf{members}\ \land \ \mathsf{init}\ \ne \ \bot \ \} \\[0.16em]
\operatorname{ProcBodies}(P,\ m)\ =\ \{\ \mathsf{body}\ \mid \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{ProcedureDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \} \\[0.16em]
\operatorname{RecordMethodBodies}(P,\ m)\ =\ \{\ \mathsf{body}\ \mid \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{impls},\ \mathsf{members},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{RecordDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{impls},\ \mathsf{members},\ \mathsf{invariant}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc})\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \land \ \exists \ \mathsf{md}.\ \mathsf{md}\ =\ \operatorname{MethodDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \mathsf{body},\ \_,\ \_)\ \in \ \mathsf{members}\ \} \\[0.16em]
\operatorname{ClassMethodBodies}(P,\ m)\ =\ \{\ \mathsf{body}\ \mid \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{modal},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{supers},\ \mathsf{items},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{ClassDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{modal},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{supers},\ \mathsf{items},\ \mathsf{span},\ \mathsf{doc})\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \land \ \exists \ \mathsf{md}.\ \mathsf{md}\ =\ \operatorname{ClassMethodDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \mathsf{body},\ \_,\ \_)\ \in \ \mathsf{items}\ \land \ \mathsf{body}\ \ne \ \bot \ \}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ValueDepsEager}(P,\ m)\ =\ \{\ n\ \mid \ \exists \ e\ \in \ \operatorname{StaticInitExprs}(P,\ m).\ \Gamma \ \vdash \ \operatorname{ValueRefs}(e,\ \mathsf{env}_{m})\ \Downarrow \ V\ \land \ n\ \in \ V\ \} \\[0.16em]
\operatorname{ValueDepsLazy}(P,\ m)\ =\ \{\ n\ \mid \ \exists \ e\ \in \ \operatorname{RecordFieldInitExprs}(P,\ m)\ \cup \ \bigcup \_\{b\ \in \ (\operatorname{ProcBodies}(P,\ m)\ \cup \ \operatorname{RecordMethodBodies}(P,\ m)\ \cup \ \operatorname{ClassMethodBodies}(P,\ m))\}\ \operatorname{ExprNodesOf}(b).\ \Gamma \ \vdash \ \operatorname{ValueRefs}(e,\ \mathsf{env}_{m})\ \Downarrow \ V\ \land \ n\ \in \ V\ \}
\end{array}
$$

$$
\begin{array}{l}
V\ =\ \mathsf{AllModules} \\[0.16em]
E_{\mathsf{type}}\ =\ \{(m,\ n)\ \mid \ n\ \in \ \operatorname{TypeDeps}(P,\ m)\} \\[0.16em]
E_{\mathsf{val}}^\{\mathsf{eager}\}\ =\ \{(m,\ n)\ \mid \ n\ \in \ \operatorname{ValueDepsEager}(P,\ m)\} \\[0.16em]
E_{\mathsf{val}}^\{\mathsf{lazy}\}\ =\ \{(m,\ n)\ \mid \ n\ \in \ \operatorname{ValueDepsLazy}(P,\ m)\}
\end{array}
$$

$$
\begin{array}{l}
G\ =\ \langle V,\ E_{\mathsf{type}},\ E_{\mathsf{val}}^\{\mathsf{eager}\},\ E_{\mathsf{val}}^\{\mathsf{lazy}\}\rangle  \\[0.16em]
G_{e}\ =\ \langle V,\ E_{\mathsf{val}}^\{\mathsf{eager}\}\rangle 
\end{array}
$$

**(WF-Acyclic-Eager)**

$$
\begin{array}{l}
\forall \ v\ \in \ V.\ \lnot \ \operatorname{Reachable}(v,\ v,\ E_{\mathsf{val}}^\{\mathsf{eager}\}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ G_{e}\ :\ \mathsf{DAG}
\end{array}
$$

### 11.5.5 Dynamic Semantics

This section introduces no direct runtime semantics. Its effects are compile-time only.

### 11.5.6 Lowering

Module aggregation contributes the eager static-initialization dependency graph `G_e` consumed by §24.4.2.

Static initialization ordering, deinitialization ordering, and project lifecycle lowering are defined by §24.4. This section introduces no additional lowering rules.

### 11.5.7 Diagnostics

| Code         | Severity | Detection    | Condition                                                      |
| ------------ | -------- | ------------ | -------------------------------------------------------------- |
| `E-MOD-1104` | Error    | Compile-time | Module path collision after NFC + case folding                 |
| `E-MOD-1105` | Error    | Compile-time | Module path component is a reserved keyword                    |
| `E-MOD-1106` | Error    | Compile-time | Module path component is not a valid identifier                |
| `E-MOD-1201` | Error    | Compile-time | External `using` path without required `import`                |
| `E-MOD-1107` | Error    | Compile-time | Unresolved module: path prefix did not resolve to a module     |
| `W-MOD-1101` | Warning  | Compile-time | Potential module path collision on case-insensitive filesystem |
| `E-MOD-1401` | Error    | Compile-time | Cyclic module dependency detected in eager initializers        |
