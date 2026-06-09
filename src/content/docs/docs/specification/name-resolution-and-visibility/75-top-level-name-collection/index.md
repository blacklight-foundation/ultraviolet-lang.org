---
title: "7.5 Top-Level Name Collection"
description: "7.5 Top-Level Name Collection from 7. Name Resolution and Visibility of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "name-resolution-and-visibility"
specSection: "75-top-level-name-collection"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/name-resolution-and-visibility/">7. Name Resolution and Visibility</a>
  <span>Name Resolution and Visibility</span>
</div>

## 7.5 Top-Level Name Collection

$$
\forall \ \mathsf{items}'.\ \operatorname{Permutation}(\mathsf{items}',\ \mathsf{items})\ \land \ \Gamma \ \vdash \ \operatorname{CollectNames}(\mathsf{items},\ p,\ \emptyset )\ \Downarrow \ N\ \Rightarrow \ \Gamma \ \vdash \ \operatorname{CollectNames}(\mathsf{items}',\ p,\ \emptyset )\ \Downarrow \ N
$$

$$
\begin{array}{l}
\mathsf{BindKind}\ =\ \{\mathsf{Value},\ \mathsf{Type},\ \mathsf{Class},\ \mathsf{ModuleAlias}\} \\[0.16em]
\mathsf{BindSource}\ =\ \{\mathsf{Decl},\ \mathsf{Using},\ \mathsf{Import}\} \\[0.16em]
\mathsf{NameInfo}\ =\ \langle \mathsf{kind},\ \mathsf{origin},\ \mathsf{target}_{\mathsf{opt}},\ \mathsf{source}\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{NameMap}(P,\ \mathsf{mp})\ =\ N\ \Leftrightarrow \ \operatorname{ModuleMap}(P,\ \mathsf{mp})\ =\ M\ \land \ \Gamma \ \vdash \ \operatorname{CollectNames}(M)\ \Downarrow \ N \\[0.16em]
\operatorname{AliasMap}(m)\ =\ \{\ n\ \mapsto \ \mathsf{origin}\ \mid \ \operatorname{NameMap}(P,\ m)[n].\mathsf{kind}\ =\ \mathsf{ModuleAlias}\ \} \\[0.16em]
\operatorname{UsingMap}(m)\ =\ \{\ n\ \mapsto \ \langle k,\ \mathsf{origin},\ \mathsf{target}_{\mathsf{opt}}\rangle \ \mid \ \operatorname{NameMap}(P,\ m)[n].\mathsf{source}\ =\ \mathsf{Using}\ \land \ \operatorname{NameMap}(P,\ m)[n].\mathsf{kind}\ =\ k\ \land \ k\ \in \ \{\mathsf{Value},\ \mathsf{Type},\ \mathsf{Class}\}\ \} \\[0.16em]
\operatorname{UsingValueMap}(m)\ =\ \{\ n\ \mapsto \ \mathsf{origin}\ \mid \ \operatorname{NameMap}(P,\ m)[n].\mathsf{source}\ =\ \mathsf{Using}\ \land \ \operatorname{NameMap}(P,\ m)[n].\mathsf{kind}\ =\ \mathsf{Value}\ \} \\[0.16em]
\operatorname{UsingTypeMap}(m)\ =\ \{\ n\ \mapsto \ \mathsf{origin}\ \mid \ \operatorname{NameMap}(P,\ m)[n].\mathsf{source}\ =\ \mathsf{Using}\ \land \ \operatorname{NameMap}(P,\ m)[n].\mathsf{kind}\ \in \ \{\mathsf{Type},\ \mathsf{Class}\}\ \} \\[0.16em]
\operatorname{TypeMap}(m)\ =\ \{\ n\ \mapsto \ \mathsf{origin}\ \mid \ \operatorname{NameMap}(P,\ m)[n].\mathsf{kind}\ =\ \mathsf{Type}\ \} \\[0.16em]
\operatorname{ClassMap}(m)\ =\ \{\ n\ \mapsto \ \mathsf{origin}\ \mid \ \operatorname{NameMap}(P,\ m)[n].\mathsf{kind}\ =\ \mathsf{Class}\ \}
\end{array}
$$

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{IdentifierPattern}(x))\ \Downarrow \ [x] \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\mathsf{WildcardPattern})\ \Downarrow \ [] \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{LiteralPattern}(\mathsf{lit}))\ \Downarrow \ [] \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{TypedPattern}(\texttt{"\_"},\ T))\ \Downarrow \ [] \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{TypedPattern}(x,\ T))\ \Downarrow \ [x]\ \Leftrightarrow \ x\ \ne \ \texttt{"\_"}
\end{array}
$$

$$
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{PatNames}(p_{i})\ \Downarrow \ N_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{TuplePattern}([p_{1},\ \ldots ,\ p_{n}]))\ \Downarrow \ N_{1}\ \mathbin{++} \ \cdot \cdot \cdot \ \mathbin{++} \ N_{n}
\end{array}
$$

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{PatNames}(p)\ \Downarrow \ N \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\langle \mathsf{name},\ \mathsf{pattern}_{\mathsf{opt}}\ =\ p,\ \mathsf{span}\rangle )\ \Downarrow \ N
\end{array}
$$

$$
\Gamma \ \vdash \ \operatorname{PatNames}(\langle \mathsf{name},\ \mathsf{pattern}_{\mathsf{opt}}\ =\ \bot ,\ \mathsf{span}\rangle )\ \Downarrow \ [\mathsf{name}]
$$

$$
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{PatNames}(f_{i})\ \Downarrow \ N_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{RecordPattern}(\_,\ [f_{1},\ \ldots ,\ f_{n}]))\ \Downarrow \ N_{1}\ \mathbin{++} \ \cdot \cdot \cdot \ \mathbin{++} \ N_{n}
\end{array}
$$

$$
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{EnumPattern}(\_,\ \_,\ \bot ))\ \Downarrow \ []
$$

$$
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{PatNames}(p_{i})\ \Downarrow \ N_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{EnumPattern}(\_,\ \_,\ \operatorname{TuplePayloadPattern}([p_{1},\ \ldots ,\ p_{n}])))\ \Downarrow \ N_{1}\ \mathbin{++} \ \cdot \cdot \cdot \ \mathbin{++} \ N_{n}
\end{array}
$$

$$
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{PatNames}(f_{i})\ \Downarrow \ N_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{EnumPattern}(\_,\ \_,\ \operatorname{RecordPayloadPattern}([f_{1},\ \ldots ,\ f_{n}])))\ \Downarrow \ N_{1}\ \mathbin{++} \ \cdot \cdot \cdot \ \mathbin{++} \ N_{n}
\end{array}
$$

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{PatNames}(p_{l})\ \Downarrow \ N_{l}\quad \Gamma \ \vdash \ \operatorname{PatNames}(p_{h})\ \Downarrow \ N_{h} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PatNames}(\operatorname{RangePattern}(\_,\ p_{l},\ p_{h}))\ \Downarrow \ N_{l}\ \mathbin{++} \ N_{h}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{AllModuleNames}\ =\ \{\ \operatorname{StringOfPath}(p)\ \mid \ p\ \in \ \operatorname{AllModulePaths}(P)\ \} \\[0.16em]
\operatorname{VisibleModuleNames}(m)\ =\ \{\ \operatorname{StringOfPath}(p)\ \mid \ p\ \in \ \operatorname{VisibleModulePaths}(m)\ \} \\[0.16em]
\operatorname{Last}([c_{1},\ \ldots ,\ c_{n}])\ =\ c_{n}\quad \mathsf{if}\ n\ \ge \ 1 \\[0.16em]
\operatorname{IsModulePath}(\mathsf{path})\ \Leftrightarrow \ \operatorname{StringOfPath}(\mathsf{path})\ \in \ \mathsf{AllModuleNames} \\[0.16em]
\operatorname{SplitLast}(\mathsf{path})\ =\ (\mathsf{mp},\ \mathsf{name})\ \Leftrightarrow \ \mathsf{path}\ =\ \mathsf{mp}\ \mathbin{++} \ [\mathsf{name}]\ \land \ \mid \mathsf{path}\mid \ \ge \ 2 \\[0.16em]
\operatorname{ModuleByPath}(P,\ p)\ =\ m\ \Leftrightarrow \ \operatorname{ASTModule}(P,\ p)\ =\ m
\end{array}
$$

$$
\operatorname{ItemNames}(\mathsf{mp})\ =\ \{\ n\ \mid \ \operatorname{NameMap}(P,\ \mathsf{mp})[n].\mathsf{kind}\ \in \ \{\mathsf{Value},\ \mathsf{Type},\ \mathsf{Class}\}\ \}
$$

$$
\begin{array}{l}
\operatorname{UsingSpecName}(\langle \mathsf{name},\ \mathsf{alias}_{\mathsf{opt}}\rangle )\ = \\[0.16em]
\ \mathsf{alias}_{\mathsf{opt}}\quad \mathsf{if}\ \mathsf{alias}_{\mathsf{opt}}\ \ne \ \bot  \\[0.16em]
\ \mathsf{name}\quad \mathsf{otherwise}
\end{array}
$$

$$
\operatorname{UsingSpecNames}([s_{1},\ \ldots ,\ s_{n}])\ =\ [\operatorname{UsingSpecName}(s_{1}),\ \ldots ,\ \operatorname{UsingSpecName}(s_{n})]
$$

$$
\Gamma \ \vdash \ \operatorname{DeclNames}([],\ p)\ \Downarrow \ \emptyset 
$$

**(DeclNames-Using)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{DeclNames}(\mathsf{rest},\ p)\ \Downarrow \ D \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DeclNames}(\langle \mathsf{UsingDecl},\ \_,\ \_,\ \_,\ \_\rangle \ \mathbin{::} \ \mathsf{rest},\ p)\ \Downarrow \ D
\end{array}
$$

**(DeclNames-Item)**

$$
\begin{array}{l}
\mathsf{it}\ \ne \ \langle \mathsf{UsingDecl},\ \_,\ \_,\ \_,\ \_\rangle \quad \Gamma \ \vdash \ \operatorname{ItemBindings}(\mathsf{it},\ p)\ \Downarrow \ B\quad \Gamma \ \vdash \ \operatorname{DeclNames}(\mathsf{rest},\ p)\ \Downarrow \ D \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DeclNames}(\mathsf{it}\ \mathbin{::} \ \mathsf{rest},\ p)\ \Downarrow \ \operatorname{Names}(B)\ \cup \ D
\end{array}
$$

$$
\operatorname{DeclNames}(m)\ =\ \operatorname{DeclNames}(m.\mathsf{items},\ m.\mathsf{path})
$$

`ResolveImportPath`, `ResolveUsingPath`, `ImportNames`, `UsingNames`, and `ImportOk` remain the canonical judgments of §11.5.4.

**(Bind-Procedure)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ItemBindings}(\langle \mathsf{ProcedureDecl},\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_,\ \_\rangle ,\ p)\ \Downarrow \ [(\mathsf{name},\ \langle \mathsf{Value},\ p,\ \bot ,\ \mathsf{Decl}\rangle )]
\end{array}
$$

**(Bind-ExternBlock)**

$$
\begin{array}{l}
B\ =\ [(\mathsf{name}_{i},\ \langle \mathsf{Value},\ p,\ \bot ,\ \mathsf{Decl}\rangle )\ \mid \ \operatorname{ExternProcDecl}(\_,\ \_,\ \mathsf{name}_{i},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \in \ \mathsf{items}] \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ItemBindings}(\langle \mathsf{ExternBlock},\ \_,\ \_,\ \_,\ \mathsf{items},\ \_,\ \_\rangle ,\ p)\ \Downarrow \ B
\end{array}
$$

**(Bind-Record)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ItemBindings}(\langle \mathsf{RecordDecl},\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_\rangle ,\ p)\ \Downarrow \ [(\mathsf{name},\ \langle \mathsf{Type},\ p,\ \bot ,\ \mathsf{Decl}\rangle )]
\end{array}
$$

**(Bind-Enum)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ItemBindings}(\langle \mathsf{EnumDecl},\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_\rangle ,\ p)\ \Downarrow \ [(\mathsf{name},\ \langle \mathsf{Type},\ p,\ \bot ,\ \mathsf{Decl}\rangle )]
\end{array}
$$

**(Bind-Class)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ItemBindings}(\langle \mathsf{ClassDecl},\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_\rangle ,\ p)\ \Downarrow \ [(\mathsf{name},\ \langle \mathsf{Class},\ p,\ \bot ,\ \mathsf{Decl}\rangle )]
\end{array}
$$

**(Bind-TypeAlias)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ItemBindings}(\langle \mathsf{TypeAliasDecl},\ \_,\ \mathsf{name},\ \_,\ \_,\ \_\rangle ,\ p)\ \Downarrow \ [(\mathsf{name},\ \langle \mathsf{Type},\ p,\ \bot ,\ \mathsf{Decl}\rangle )]
\end{array}
$$

**(Bind-Static)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{PatNames}(\mathsf{pat})\ \Downarrow \ N \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ItemBindings}(\langle \mathsf{StaticDecl},\ \_,\ \_,\ \langle \mathsf{pat},\ \_,\ \_,\ \_,\ \_\rangle ,\ \_,\ \_\rangle ,\ p)\ \Downarrow \ [(n,\ \langle \mathsf{Value},\ p,\ \bot ,\ \mathsf{Decl}\rangle )\ \mid \ n\ \in \ N]
\end{array}
$$

**(Bind-Import)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ImportNames}(u)\ \Downarrow \ B \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ItemBindings}(u,\ p)\ \Downarrow \ B
\end{array}
$$

**(Bind-Import-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ImportNames}(u)\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ItemBindings}(u,\ p)\ \Uparrow \ c
\end{array}
$$

**(Bind-Using)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{UsingNames}(u)\ \Downarrow \ B \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ItemBindings}(u,\ p)\ \Downarrow \ B
\end{array}
$$

**(Bind-Using-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{UsingNames}(u)\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ItemBindings}(u,\ p)\ \Uparrow \ c
\end{array}
$$

**(Bind-ErrorItem)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ItemBindings}(\operatorname{ErrorItem}(\_),\ p)\ \Downarrow \ []
\end{array}
$$

**(Collect-Ok)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CollectNames}(\mathsf{items},\ p,\ \emptyset )\ \Downarrow \ N \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CollectNames}(M)\ \Downarrow \ N
\end{array}
$$

**(Collect-Scan)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ItemBindings}(\mathsf{it},\ p)\ \Downarrow \ B\quad \operatorname{DisjointNames}(B,\ N)\quad \operatorname{NoDup}(B)\quad \Gamma \ \vdash \ \operatorname{CollectNames}(\mathsf{rest},\ p,\ N\ \cup \ B)\ \Downarrow \ N' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CollectNames}(\mathsf{it}\ \mathbin{::} \ \mathsf{rest},\ p,\ N)\ \Downarrow \ N'
\end{array}
$$

**(Collect-Using-Import-Dup)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ItemBindings}(\mathsf{it},\ p)\ \Downarrow \ B\quad (\lnot \ \operatorname{DisjointNames}(B,\ N)\ \lor \ \lnot \ \operatorname{NoDup}(B))\quad \operatorname{UsingImportConflict}(B,\ N)\quad c\ =\ \operatorname{Code}(\mathsf{Import}-\mathsf{Using}-\mathsf{Name}-\mathsf{Conflict}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CollectNames}(\mathsf{it}\ \mathbin{::} \ \mathsf{rest},\ p,\ N)\ \Uparrow \ c
\end{array}
$$

**(Collect-Dup)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ItemBindings}(\mathsf{it},\ p)\ \Downarrow \ B\quad (\lnot \ \operatorname{DisjointNames}(B,\ N)\ \lor \ \lnot \ \operatorname{NoDup}(B))\quad \lnot \ \operatorname{UsingImportConflict}(B,\ N)\quad c\ =\ \operatorname{Code}(\mathsf{Collect}-\mathsf{Dup}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CollectNames}(\mathsf{it}\ \mathbin{::} \ \mathsf{rest},\ p,\ N)\ \Uparrow \ c
\end{array}
$$

**(Collect-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ItemBindings}(\mathsf{it},\ p)\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CollectNames}(\mathsf{it}\ \mathbin{::} \ \mathsf{rest},\ p,\ N)\ \Uparrow \ c
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Names}(B)\ =\ \{\ n\ \mid \ (n,\ \_)\ \in \ B\ \} \\[0.16em]
\operatorname{NoDup}(B)\ \Leftrightarrow \ \operatorname{Distinct}(\operatorname{Names}(B)) \\[0.16em]
\operatorname{DisjointNames}(B,\ N)\ \Leftrightarrow \ \operatorname{Names}(B)\ \cap \ \operatorname{dom}(N)\ =\ \emptyset  \\[0.16em]
N\ \cup \ B\ =\ \{\ (n,\ v)\ \mid \ (n,\ v)\ \in \ N\ \lor \ (n,\ v)\ \in \ B\ \} \\[0.16em]
\operatorname{NameInfoOf}(B,\ n)\ =\ \mathsf{info}\ \Leftrightarrow \ (n,\ \mathsf{info})\ \in \ B \\[0.16em]
\operatorname{NameSource}(B,\ n)\ =\ \mathsf{src}\ \Leftrightarrow \ \operatorname{NameInfoOf}(B,\ n)\ =\ \mathsf{info}\ \land \ \mathsf{info}.\mathsf{source}\ =\ \mathsf{src} \\[0.16em]
\operatorname{NameSource}(N,\ n)\ =\ \mathsf{src}\ \Leftrightarrow \ n\ \in \ \operatorname{dom}(N)\ \land \ N[n].\mathsf{source}\ =\ \mathsf{src} \\[0.16em]
\operatorname{UsingImportConflict}(B,\ N)\ \Leftrightarrow \ \exists \ n.\ n\ \in \ \operatorname{Names}(B)\ \cap \ \operatorname{dom}(N)\ \land \ (\operatorname{NameSource}(B,\ n)\ \in \ \{\mathsf{Using},\ \mathsf{Import}\}\ \lor \ \operatorname{NameSource}(N,\ n)\ \in \ \{\mathsf{Using},\ \mathsf{Import}\})
\end{array}
$$

$$
\mathsf{NamesState}\ =\ \{\operatorname{NamesStart}(M),\ \operatorname{NamesScan}(\mathsf{items},\ p,\ N),\ \operatorname{NamesDone}(N),\ \operatorname{Error}(\mathsf{code})\}
$$

**(Names-Start)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{NamesStart}(M)\rangle \ \to \ \langle \operatorname{NamesScan}(M.\mathsf{items},\ M.\mathsf{path},\ \emptyset )\rangle 
\end{array}
$$

**(Names-Step)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ItemBindings}(\mathsf{it},\ p)\ \Downarrow \ B\quad \operatorname{DisjointNames}(B,\ N)\quad \operatorname{NoDup}(B) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{NamesScan}(\mathsf{it}\ \mathbin{::} \ \mathsf{rest},\ p,\ N)\rangle \ \to \ \langle \operatorname{NamesScan}(\mathsf{rest},\ p,\ N\ \cup \ B)\rangle 
\end{array}
$$

**(Names-Step-Using-Import-Dup)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ItemBindings}(\mathsf{it},\ p)\ \Downarrow \ B\quad (\lnot \ \operatorname{DisjointNames}(B,\ N)\ \lor \ \lnot \ \operatorname{NoDup}(B))\quad \operatorname{UsingImportConflict}(B,\ N) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{NamesScan}(\mathsf{it}\ \mathbin{::} \ \mathsf{rest},\ p,\ N)\rangle \ \to \ \langle \operatorname{Error}(\operatorname{Code}(\mathsf{Import}-\mathsf{Using}-\mathsf{Name}-\mathsf{Conflict}))\rangle 
\end{array}
$$

**(Names-Step-Dup)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ItemBindings}(\mathsf{it},\ p)\ \Downarrow \ B\quad (\lnot \ \operatorname{DisjointNames}(B,\ N)\ \lor \ \lnot \ \operatorname{NoDup}(B))\quad \lnot \ \operatorname{UsingImportConflict}(B,\ N) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{NamesScan}(\mathsf{it}\ \mathbin{::} \ \mathsf{rest},\ p,\ N)\rangle \ \to \ \langle \operatorname{Error}(\operatorname{Code}(\mathsf{Names}-\mathsf{Step}-\mathsf{Dup}))\rangle 
\end{array}
$$

**(Names-Step-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ItemBindings}(\mathsf{it},\ p)\ \Uparrow \ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{NamesScan}(\mathsf{it}\ \mathbin{::} \ \mathsf{rest},\ p,\ N)\rangle \ \to \ \langle \operatorname{Error}(c)\rangle 
\end{array}
$$

**(Names-Done)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{NamesScan}([],\ p,\ N)\rangle \ \to \ \langle \operatorname{NamesDone}(N)\rangle 
\end{array}
$$
