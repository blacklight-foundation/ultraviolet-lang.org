---
title: "Conformance and Notation"
description: "1. Conformance and Notation of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T18:13:03.158Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## 1. Conformance and Notation

### 1.1 Conformance

**Conforming.**

```math
\operatorname{Conforming}(P)\ \Leftrightarrow \ \operatorname{WF}(P)
```

**WF.**

```math
\operatorname{WF}(P)\ \Leftrightarrow \ \exists \ \Gamma .\ \operatorname{Project}(\Gamma )\ =\ P\ \land \ \forall \ j\ \in \ \operatorname{ReqJudgments}(P).\ \Gamma \ \vdash \ j\ \Downarrow \ \mathsf{ok}
```

**ReqJudgments.**

```math
\operatorname{ReqJudgments}(P)\ =\ [\operatorname{Phase1Order}(P),\ \operatorname{Phase2Order}(P),\ \operatorname{Phase3Order}(P),\ \operatorname{Phase4Order}(P)]
```

**Phase1Order.**

```math
\Gamma \ \vdash \ \operatorname{Phase1Order}(P)\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \exists \ \mathsf{Ms}.\ \Gamma \ \vdash \ \operatorname{ParseModules}(P)\ \Downarrow \ \mathsf{Ms}
```

**Phase2Order.**

```math
\Gamma \ \vdash \ \operatorname{Phase2Order}(P)\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \exists \ \mathsf{Ms},\ \mathsf{Ms}_{\mathsf{ct}}.\ \Gamma \ \vdash \ \operatorname{ParseModules}(P)\ \Downarrow \ \mathsf{Ms}\ \land \ \Gamma \ \vdash \ \operatorname{ExecuteComptime}(P,\ \mathsf{Ms})\ \Downarrow \ \mathsf{Ms}_{\mathsf{ct}}
```

```math
\begin{array}{l}
\operatorname{Phase3Checks}(P,\ \mathsf{Ms}_{\mathsf{ct}},\ \mathsf{Ms}_{\mathsf{res}})\ =\ [\Gamma_{\mathsf{ct}} \ \vdash \ \operatorname{ResolveModules}(P_{\mathsf{ct}})\ \Downarrow \ \mathsf{Ms}_{\mathsf{res}},\ \Gamma_{\mathsf{res}} \ \vdash \ \operatorname{DeclTyping}(\mathsf{Ms}_{\mathsf{res}})\ \Downarrow \ \mathsf{ok},\ \Gamma_{\mathsf{res}} \ \vdash \ \operatorname{MainCheck}(P_{\mathsf{res}})\ \Downarrow \ \mathsf{ok}] \\
\ \mathsf{where} \\
\ P_{\mathsf{ct}}\ =\ \operatorname{ProjectView}(P,\ \mathsf{Ms}_{\mathsf{ct}}) \\
\ \Gamma_{\mathsf{ct}} \ =\ \Gamma [\mathsf{project}\ \mapsto \ P_{\mathsf{ct}}] \\
\ P_{\mathsf{res}}\ =\ \operatorname{ProjectView}(P,\ \mathsf{Ms}_{\mathsf{res}}) \\
\ \Gamma_{\mathsf{res}} \ =\ \Gamma [\mathsf{project}\ \mapsto \ P_{\mathsf{res}}] \\
\operatorname{Phase3Order}(P)\ \Leftrightarrow \ \exists \ \mathsf{Ms},\ \mathsf{Ms}_{\mathsf{ct}},\ \mathsf{Ms}_{\mathsf{res}}.\ \Gamma \ \vdash \ \operatorname{ParseModules}(P)\ \Downarrow \ \mathsf{Ms}\ \land \ \Gamma \ \vdash \ \operatorname{ExecuteComptime}(P,\ \mathsf{Ms})\ \Downarrow \ \mathsf{Ms}_{\mathsf{ct}}\ \land \ \operatorname{FirstFail}(\operatorname{Phase3Checks}(P,\ \mathsf{Ms}_{\mathsf{ct}},\ \mathsf{Ms}_{\mathsf{res}}))\ =\ \bot 
\end{array}
```

**Phase4Order.**

```math
\Gamma \ \vdash \ \operatorname{Phase4Order}(P)\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \exists \ \mathsf{Ms},\ \mathsf{Ms}_{\mathsf{ct}},\ \mathsf{Ms}_{\mathsf{res}},\ \mathsf{Objs},\ \mathsf{IRs},\ \mathsf{Artifact}.\ \Gamma \ \vdash \ \operatorname{ParseModules}(P)\ \Downarrow \ \mathsf{Ms}\ \land \ \Gamma \ \vdash \ \operatorname{ExecuteComptime}(P,\ \mathsf{Ms})\ \Downarrow \ \mathsf{Ms}_{\mathsf{ct}}\ \land \ \operatorname{FirstFail}(\operatorname{Phase3Checks}(P,\ \mathsf{Ms}_{\mathsf{ct}},\ \mathsf{Ms}_{\mathsf{res}}))\ =\ \bot \ \land \ P_{\mathsf{res}}\ =\ \operatorname{ProjectView}(P,\ \mathsf{Ms}_{\mathsf{res}})\ \land \ \Gamma_{\mathsf{res}} \ =\ \Gamma [\mathsf{project}\ \mapsto \ P_{\mathsf{res}}]\ \land \ \Gamma_{\mathsf{res}} \ \vdash \ \operatorname{OutputPipeline}(P_{\mathsf{res}})\ \Downarrow \ (\mathsf{Objs},\ \mathsf{IRs},\ \mathsf{Artifact})
```

**Constructs.**

```math
\begin{array}{l}
\operatorname{TypeNodes}(P,\ m)\ =\ \{\ t\ \mid \ t\ \in \ \mathsf{Type}\ \land \ \operatorname{Subnode}(\operatorname{ASTModule}(P,\ m),\ t)\ \} \\
\operatorname{StmtNodes}(P,\ m)\ =\ \{\ s\ \mid \ s\ \in \ \mathsf{Stmt}\ \land \ \operatorname{Subnode}(\operatorname{ASTModule}(P,\ m),\ s)\ \}
\end{array}
```

```math
\begin{array}{l}
\operatorname{ItemKind}(\operatorname{UsingDecl}(\_,\ \_,\ \_,\ \_,\ \_))\ =\ \texttt{using\_decl} \\
\operatorname{ItemKind}(\operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_))\ =\ \texttt{procedure} \\
\operatorname{ItemKind}(\operatorname{RecordDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_))\ =\ \texttt{record} \\
\operatorname{ItemKind}(\operatorname{EnumDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_))\ =\ \texttt{enum} \\
\operatorname{ItemKind}(\operatorname{ModalDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_))\ =\ \texttt{modal} \\
\operatorname{ItemKind}(\operatorname{ClassDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_))\ =\ \texttt{class} \\
\operatorname{ItemKind}(\operatorname{TypeAliasDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_))\ =\ \texttt{type\_alias} \\
\operatorname{ItemKind}(\operatorname{StaticDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_))\ =\ \texttt{static\_decl} \\
\operatorname{ItemKind}(\_)\ =\ \bot 
\end{array}
```

```math
\operatorname{TopDeclConstructs}(P)\ =\ \{\ \operatorname{ItemKind}(\mathsf{it})\ \mid \ m\ \in \ P.\mathsf{modules}\ \land \ \mathsf{it}\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \land \ \operatorname{ItemKind}(\mathsf{it})\ \ne \ \bot \ \}
```

```math
\begin{array}{l}
\operatorname{TypeCtor}(\operatorname{TypePerm}(\_,\ \mathsf{base}))\ =\ \operatorname{TypeCtor}(\mathsf{base}) \\
\operatorname{TypeCtor}(\operatorname{TypePrim}(\mathsf{name}))\ =\ \{\mathsf{name}\} \\
\operatorname{TypeCtor}(\operatorname{TypeTuple}(\mathsf{elems}))\ =\ \{\texttt{tuple}\}\ \cup \ \bigcup \_\{t\ \in \ \mathsf{elems}\}\ \operatorname{TypeCtor}(t) \\
\operatorname{TypeCtor}(\operatorname{TypeArray}(\mathsf{elem},\ \_))\ =\ \{\texttt{array}\}\ \cup \ \operatorname{TypeCtor}(\mathsf{elem}) \\
\operatorname{TypeCtor}(\operatorname{TypeSlice}(\mathsf{elem}))\ =\ \{\texttt{slice}\}\ \cup \ \operatorname{TypeCtor}(\mathsf{elem}) \\
\operatorname{TypeCtor}(\operatorname{TypeUnion}(\mathsf{members}))\ =\ \{\texttt{union}\}\ \cup \ \bigcup \_\{t\ \in \ \mathsf{members}\}\ \operatorname{TypeCtor}(t) \\
\operatorname{TypeCtor}(\operatorname{TypeFunc}(\mathsf{params},\ \mathsf{ret}))\ =\ \{\texttt{function}\}\ \cup \ \bigcup \_\{\langle \_,\ t\rangle \ \in \ \mathsf{params}\}\ \operatorname{TypeCtor}(t)\ \cup \ \operatorname{TypeCtor}(\mathsf{ret}) \\
\operatorname{TypeCtor}(\operatorname{TypeApply}(\mathsf{path},\ \_))\ =\ \operatorname{TypeCtor}(\operatorname{TypePath}(\mathsf{path})) \\
\operatorname{TypeCtor}(\operatorname{TypePtr}(\mathsf{elem},\ \_))\ =\ \{\texttt{ptr}\}\ \cup \ \operatorname{TypeCtor}(\mathsf{elem}) \\
\operatorname{TypeCtor}(\operatorname{TypeRawPtr}(\_,\ \mathsf{elem}))\ =\ \{\texttt{rawptr}\}\ \cup \ \operatorname{TypeCtor}(\mathsf{elem}) \\
\operatorname{TypeCtor}(\operatorname{TypeString}(\_))\ =\ \{\texttt{string}\} \\
\operatorname{TypeCtor}(\operatorname{TypeBytes}(\_))\ =\ \{\texttt{bytes}\} \\
\operatorname{TypeCtor}(\operatorname{TypeDynamic}(\_))\ =\ \{\texttt{dyn\_class}\} \\
\operatorname{TypeCtor}(\operatorname{TypeOpaque}(\_))\ =\ \{\texttt{opaque}\} \\
\operatorname{TypeCtor}(\operatorname{TypeRefine}(\mathsf{base},\ \_))\ =\ \{\texttt{refinement}\}\ \cup \ \operatorname{TypeCtor}(\mathsf{base}) \\
\operatorname{TypeCtor}(\operatorname{TypeModalState}(\_,\ \_))\ =\ \{\texttt{modal}\} \\
\operatorname{TypeCtor}(\operatorname{TypeRange}(\mathsf{base}))\ =\ \{\texttt{range}\}\ \cup \ \operatorname{TypeCtor}(\mathsf{base}) \\
\operatorname{TypeCtor}(\operatorname{TypeRangeInclusive}(\mathsf{base}))\ =\ \{\texttt{range\_inclusive}\}\ \cup \ \operatorname{TypeCtor}(\mathsf{base}) \\
\operatorname{TypeCtor}(\operatorname{TypeRangeFrom}(\mathsf{base}))\ =\ \{\texttt{range\_from}\}\ \cup \ \operatorname{TypeCtor}(\mathsf{base}) \\
\operatorname{TypeCtor}(\operatorname{TypeRangeTo}(\mathsf{base}))\ =\ \{\texttt{range\_to}\}\ \cup \ \operatorname{TypeCtor}(\mathsf{base}) \\
\operatorname{TypeCtor}(\operatorname{TypeRangeToInclusive}(\mathsf{base}))\ =\ \{\texttt{range\_to\_inclusive}\}\ \cup \ \operatorname{TypeCtor}(\mathsf{base}) \\
\operatorname{TypeCtor}(\mathsf{TypeRangeFull})\ =\ \{\texttt{range\_full}\} \\
\operatorname{TypeCtor}(\operatorname{TypeClosure}(\mathsf{params},\ \mathsf{ret},\ \_))\ =\ \{\texttt{closure}\}\ \cup \ \bigcup \_\{\langle \_,\ t\rangle \ \in \ \mathsf{params}\}\ \operatorname{TypeCtor}(t)\ \cup \ \operatorname{TypeCtor}(\mathsf{ret}) \\
\operatorname{TypeCtor}(\operatorname{TypePath}([\texttt{"Region"}]))\ =\ \{\texttt{region}\} \\
\operatorname{TypeCtor}(\operatorname{TypePath}([\texttt{"RegionOptions"}]))\ =\ \{\texttt{region\_options}\} \\
\operatorname{TypeCtor}(\operatorname{TypePath}(p))\ =\ \{\texttt{record}\}\ \mathsf{if}\ \operatorname{RecordDecl}(p)\ \mathsf{defined} \\
\operatorname{TypeCtor}(\operatorname{TypePath}(p))\ =\ \{\texttt{enum}\}\ \mathsf{if}\ \operatorname{EnumDecl}(p)\ \mathsf{defined} \\
\operatorname{TypeCtor}(\_)\ =\ \emptyset 
\end{array}
```

```math
\operatorname{TypeConstructs}(P)\ =\ \bigcup \_\{m\ \in \ P.\mathsf{modules}\}\ \bigcup \_\{t\ \in \ \operatorname{TypeNodes}(P,\ m)\}\ \operatorname{TypeCtor}(t)
```

```math
\begin{array}{l}
\operatorname{PermOfType}(\operatorname{TypePerm}(p,\ \_))\ =\ \{p\} \\
\operatorname{PermOfType}(\_)\ =\ \emptyset  \\
\operatorname{RecvPerms}(\mathsf{members})\ =\ \{\ p\ \mid \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{ov},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{MethodDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{ov},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\ \in \ \mathsf{members}\ \land \ \mathsf{recv}\ =\ \operatorname{ReceiverShorthand}(p)\ \} \\
\operatorname{ClassRecvPerms}(\mathsf{items})\ =\ \{\ p\ \mid \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{ClassMethodDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\ \in \ \mathsf{items}\ \land \ \mathsf{recv}\ =\ \operatorname{ReceiverShorthand}(p)\ \} \\
\operatorname{StateRecvPerms}(\mathsf{states})\ =\ \{\ p\ \mid \ \exists \ S,\ \mathsf{members},\ \mathsf{span},\ \mathsf{doc},\ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body}.\ \operatorname{StateBlock}(S,\ \mathsf{members},\ \mathsf{span},\ \mathsf{doc})\ \in \ \mathsf{states}\ \land \ \operatorname{StateMethodDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \_,\ \_)\ \in \ \mathsf{members}\ \land \ \mathsf{recv}\ =\ \operatorname{ReceiverShorthand}(p)\ \} \\
\operatorname{PermConstructs}(P)\ =\ \bigcup \_\{m\ \in \ P.\mathsf{modules}\}\ \bigcup \_\{t\ \in \ \operatorname{TypeNodes}(P,\ m)\}\ \operatorname{PermOfType}(t)\ \cup \ \bigcup \_\{m\ \in \ P.\mathsf{modules}\}\ \bigcup \_\{\operatorname{RecordDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \mathsf{members},\ \_,\ \_,\ \_)\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\}\ \operatorname{RecvPerms}(\mathsf{members})\ \cup \ \bigcup \_\{m\ \in \ P.\mathsf{modules}\}\ \bigcup \_\{\operatorname{ModalDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \mathsf{states},\ \_,\ \_,\ \_)\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\}\ \operatorname{StateRecvPerms}(\mathsf{states})\ \cup \ \bigcup \_\{m\ \in \ P.\mathsf{modules}\}\ \bigcup \_\{\operatorname{ClassDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \mathsf{items},\ \_,\ \_)\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\}\ \operatorname{ClassRecvPerms}(\mathsf{items})
\end{array}
```

```math
\begin{array}{l}
\operatorname{ExprKind}(\operatorname{Literal}(\_))\ =\ \texttt{literal} \\
\operatorname{ExprKind}(\operatorname{Identifier}(\_))\ =\ \texttt{identifier} \\
\operatorname{ExprKind}(\operatorname{FieldAccess}(\_,\ \_))\ =\ \texttt{field\_access} \\
\operatorname{ExprKind}(\operatorname{TupleAccess}(\_,\ \_))\ =\ \texttt{tuple\_index} \\
\operatorname{ExprKind}(\operatorname{IndexAccess}(\_,\ \_))\ =\ \texttt{index} \\
\operatorname{ExprKind}(\operatorname{IfExpr}(\_,\ \_,\ \_))\ =\ \texttt{if} \\
\operatorname{ExprKind}(\operatorname{IfIsExpr}(\_,\ \_,\ \_,\ \_))\ =\ \texttt{if} \\
\operatorname{ExprKind}(\operatorname{IfCaseExpr}(\_,\ \_,\ \_))\ =\ \texttt{if} \\
\operatorname{ExprKind}(\operatorname{LoopInfinite}(\_,\ \_))\ =\ \texttt{loop} \\
\operatorname{ExprKind}(\operatorname{LoopConditional}(\_,\ \_,\ \_))\ =\ \texttt{loop} \\
\operatorname{ExprKind}(\operatorname{LoopIter}(\_,\ \_,\ \_,\ \_,\ \_))\ =\ \texttt{loop} \\
\operatorname{ExprKind}(\operatorname{MoveExpr}(\_))\ =\ \texttt{move} \\
\operatorname{ExprKind}(\operatorname{Unary}(\texttt{"widen"},\ \_))\ =\ \texttt{widen} \\
\operatorname{ExprKind}(\operatorname{TransmuteExpr}(\_,\ \_,\ \_))\ =\ \texttt{transmute} \\
\operatorname{ExprKind}(\operatorname{UnsafeBlockExpr}(\_))\ =\ \texttt{unsafe} \\
\operatorname{ExprKind}(\operatorname{AllocExpr}(\_,\ \_))\ =\ \texttt{region\_alloc} \\
\operatorname{ExprKind}(\operatorname{MethodCall}(\_,\ \_,\ \_))\ =\ \texttt{method\_call} \\
\operatorname{ExprKind}(\operatorname{Propagate}(\_))\ =\ \texttt{union\_propagate} \\
\operatorname{ExprKind}(\operatorname{ParallelExpr}(\_,\ \_,\ \_))\ =\ \texttt{parallel} \\
\operatorname{ExprKind}(\operatorname{SpawnExpr}(\_,\ \_))\ =\ \texttt{spawn} \\
\operatorname{ExprKind}(\operatorname{DispatchExpr}(\_,\ \_,\ \_,\ \_,\ \_))\ =\ \texttt{dispatch} \\
\operatorname{ExprKind}(\operatorname{WaitExpr}(\_))\ =\ \texttt{wait} \\
\operatorname{ExprKind}(\operatorname{YieldExpr}(\_,\ \_))\ =\ \texttt{yield} \\
\operatorname{ExprKind}(\operatorname{YieldFromExpr}(\_,\ \_))\ =\ \texttt{yield} \\
\operatorname{ExprKind}(\operatorname{SyncExpr}(\_))\ =\ \texttt{sync} \\
\operatorname{ExprKind}(\operatorname{RaceExpr}(\_))\ =\ \texttt{race} \\
\operatorname{ExprKind}(\operatorname{AllExpr}(\_))\ =\ \texttt{all} \\
\operatorname{ExprKind}(\_)\ =\ \bot 
\end{array}
```

```math
\begin{array}{l}
\operatorname{StmtKind}(\operatorname{LetStmt}(\_))\ =\ \texttt{let} \\
\operatorname{StmtKind}(\operatorname{VarStmt}(\_))\ =\ \texttt{var} \\
\operatorname{StmtKind}(\operatorname{UsingLocalStmt}(\_,\ \_,\ \_))\ =\ \texttt{using} \\
\operatorname{StmtKind}(\operatorname{AssignStmt}(\_,\ \_))\ =\ \texttt{assign} \\
\operatorname{StmtKind}(\operatorname{CompoundAssignStmt}(\_,\ \_,\ \_))\ =\ \texttt{compound\_assign} \\
\operatorname{StmtKind}(\operatorname{DeferStmt}(\_))\ =\ \texttt{defer} \\
\operatorname{StmtKind}(\operatorname{RegionStmt}(\_,\ \_,\ \_))\ =\ \texttt{region} \\
\operatorname{StmtKind}(\operatorname{FrameStmt}(\_,\ \_))\ =\ \texttt{frame} \\
\operatorname{StmtKind}(\operatorname{KeyBlockStmt}(\_,\ \_,\ \_,\ \_,\ \_,\ \_))\ =\ \texttt{key\_block} \\
\operatorname{StmtKind}(\operatorname{ReturnStmt}(\_))\ =\ \texttt{return} \\
\operatorname{StmtKind}(\operatorname{BreakStmt}(\_))\ =\ \texttt{break} \\
\operatorname{StmtKind}(\mathsf{ContinueStmt})\ =\ \texttt{continue} \\
\operatorname{StmtKind}(\operatorname{UnsafeBlockStmt}(\_))\ =\ \texttt{unsafe} \\
\operatorname{StmtKind}(\_)\ =\ \bot 
\end{array}
```

```math
\operatorname{ExprStmtConstructs}(P)\ =\ \{\ \operatorname{ExprKind}(e)\ \mid \ m\ \in \ P.\mathsf{modules}\ \land \ e\ \in \ \operatorname{ExprNodes}(P,\ m)\ \land \ \operatorname{ExprKind}(e)\ \ne \ \bot \ \}\ \cup \ \{\ \operatorname{StmtKind}(s)\ \mid \ m\ \in \ P.\mathsf{modules}\ \land \ s\ \in \ \operatorname{StmtNodes}(P,\ m)\ \land \ \operatorname{StmtKind}(s)\ \ne \ \bot \ \}
```

```math
\operatorname{CapConstructs}(P)\ =\ \{\ c\ \mid \ c\ \in \ \{\texttt{Context},\ \texttt{FileSystem},\ \texttt{Network},\ \texttt{HeapAllocator},\ \texttt{ExecutionDomain},\ \texttt{Reactor}\}\ \land \ \exists \ m,\ t.\ m\ \in \ P.\mathsf{modules}\ \land \ t\ \in \ \operatorname{TypeNodes}(P,\ m)\ \land \ t\ =\ \operatorname{TypePath}([c])\ \}
```

```math
\operatorname{Constructs}(P)\ =\ \operatorname{TopDeclConstructs}(P)\ \cup \ \operatorname{TypeConstructs}(P)\ \cup \ \operatorname{PermConstructs}(P)\ \cup \ \operatorname{ExprStmtConstructs}(P)\ \cup \ \operatorname{CapConstructs}(P)
```

**(Reject-IllFormed)**

```math
\begin{array}{l}
\lnot \ \operatorname{Conforming}(P) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Reject}(P)
\end{array}
```

**TranslationPhases.**

```math
\mathsf{TranslationPhases}\ =\ [\mathsf{Phase1},\ \mathsf{Phase2},\ \mathsf{Phase3},\ \mathsf{Phase4}]
```

### 1.2 Behavior Types

**IllFormed.**

```math
\begin{array}{l}
\mathsf{StaticJudgSet}\ =\ \mathsf{WFModulePathJudg}\ \cup \ \mathsf{LinkJudg}\ \cup \ \mathsf{ParseJudgment}\ \cup \ \mathsf{ResolvePathJudg}\ \cup \ \mathsf{ResolveExprListJudg}\ \cup \ \mathsf{ResolveEnumPayloadJudg}\ \cup \ \mathsf{ResolveCalleeJudg}\ \cup \ \mathsf{ResolveIfCaseJudg}\ \cup \ \mathsf{ResolveStmtSeqJudg}\ \cup \ \mathsf{TypeEqJudg}\ \cup \ \mathsf{ConstLenJudg}\ \cup \ \mathsf{SubtypingJudg}\ \cup \ \mathsf{PermAdmitsJudg}\ \cup \ \mathsf{ArgsOkTJudg}\ \cup \ \mathsf{TypeInfJudg}\ \cup \ \mathsf{StmtJudg}\ \cup \ \mathsf{PatJudg}\ \cup \ \mathsf{ExprJudg}\ \cup \ \mathsf{CaseJudg}\ \cup \ \mathsf{DeclJudg}\ \cup \ \mathsf{BJudgment}\ \cup \ \mathsf{ArgPassJudg}\ \cup \ \mathsf{ProvPlaceJudg}\ \cup \ \mathsf{ProvExprJudg}\ \cup \ \mathsf{ProvStmtJudg}\ \cup \ \mathsf{BlockProvJudg}\ \cup \ \mathsf{ArgsOkJudg}\ \cup \ \mathsf{TypeWFJudg}\ \cup \ \mathsf{StringBytesJudg}\ \cup \ \mathsf{BitcopyDropJudg}\ \cup \ \mathsf{BitcopyJudg}\ \cup \ \mathsf{CloneJudg}\ \cup \ \mathsf{DropJudg}\ \cup \ \mathsf{FfiSafeJudg}\ \cup \ \mathsf{TypeRefsJudg}\ \cup \ \mathsf{ValueRefsJudg}\ \cup \ \mathsf{CodegenJudg}\ \cup \ \mathsf{LayoutJudg}\ \cup \ \mathsf{EncodeConstJudg}\ \cup \ \mathsf{ValidValueJudg}\ \cup \ \mathsf{RecordLayoutJudg}\ \cup \ \mathsf{UnionLayoutJudg}\ \cup \ \mathsf{TupleLayoutJudg}\ \cup \ \mathsf{RangeLayoutJudg}\ \cup \ \mathsf{EnumLayoutJudg}\ \cup \ \mathsf{ModalLayoutJudg}\ \cup \ \mathsf{DynLayoutJudg}\ \cup \ \mathsf{ABITyJudg}\ \cup \ \mathsf{ABIParamJudg}\ \cup \ \mathsf{ABIRetJudg}\ \cup \ \mathsf{ABICallJudg}\ \cup \ \mathsf{LowerCallJudg}\ \cup \ \mathsf{MangleJudg}\ \cup \ \mathsf{LinkageJudg}\ \cup \ \mathsf{EvalOrderJudg}\ \cup \ \mathsf{LowerExprJudg}\ \cup \ \mathsf{LowerStmtJudg}\ \cup \ \mathsf{PatternLowerJudg}\ \cup \ \mathsf{LowerBindJudg}\ \cup \ \mathsf{GlobalsJudg}\ \cup \ \mathsf{ConstInitJudg}\ \cup \ \mathsf{CleanupJudg}\ \cup \ \mathsf{RuntimeIfcJudg}\ \cup \ \mathsf{DynDispatchJudg}\ \cup \ \mathsf{ChecksJudg}\ \cup \ \mathsf{LLVMAttrJudg}\ \cup \ \mathsf{RuntimeDeclJudg}\ \cup \ \mathsf{LLVMTyJudg}\ \cup \ \mathsf{LLVMEmitJudg}\ \cup \ \mathsf{LowerIRJudg}\ \cup \ \mathsf{BindStorageJudg}\ \cup \ \mathsf{LLVMCallJudg}\ \cup \ \mathsf{VTableJudg}\ \cup \ \mathsf{LiteralEmitJudg}\ \cup \ \mathsf{BuiltinSymJudg}\ \cup \ \mathsf{DropHookJudg}\ \cup \ \mathsf{EntryJudg}\ \cup \ \mathsf{PoisonJudg} \\
\mathsf{StaticRuleSet}\ =\ \{\ r\ \mid \ \operatorname{Conclusion}(r)\ \in \ \mathsf{StaticJudgSet}\ \} \\
\operatorname{Conclusion}(r)\ =\ J\quad (r\ \mathsf{is}\ \mathsf{written}\ (\pi_{1} \ \ldots \ \pi_{k} )\ /\ J) \\
\operatorname{Premises}(r)\ =\ [\pi_{1} ,\ \ldots ,\ \pi_{k} ]\quad (r\ \mathsf{is}\ \mathsf{written}\ (\pi_{1} \ \ldots \ \pi_{k} )\ /\ \_) \\
\operatorname{Subject}(\Gamma \ \vdash \ j)\ =\ j_{0}\ \mathsf{where}\ j_{0}\ \mathsf{is}\ \mathsf{the}\ \mathsf{leftmost}\ \mathsf{term}\ \mathsf{to}\ \mathsf{the}\ \mathsf{right}\ \mathsf{of}\ \vdash  \\
\operatorname{EnvOf}(\Gamma \ \vdash \ j)\ =\ \Gamma  \\
\theta \ \mathsf{ranges}\ \mathsf{over}\ \mathsf{substitutions}\ \mathsf{of}\ \mathsf{metavariables}\ \mathsf{in}\ r \\
\operatorname{Applies}(r,\ x)\ \Leftrightarrow \ \exists \ \theta .\ \operatorname{Subject}(\operatorname{Conclusion}(r)[\theta ])\ =\ x \\
\operatorname{PremisesHold}(r,\ x)\ \Leftrightarrow \ \exists \ \theta .\ \operatorname{Subject}(\operatorname{Conclusion}(r)[\theta ])\ =\ x\ \land \ \Gamma_{r} \ =\ \operatorname{EnvOf}(\operatorname{Conclusion}(r)[\theta ])\ \land \ \forall \ \pi \ \in \ \operatorname{Premises}(r)[\theta ].\ \pi \ \ne \ \bot \ \land \ (\pi \ \mathsf{is}\ a\ \mathsf{judgment}\ \Rightarrow \ \Gamma_{r} \ \vdash \ \pi ) \\
\operatorname{IllFormed}(x)\ \Leftrightarrow \ \exists \ r\ \in \ \mathsf{StaticRuleSet}.\ \operatorname{Applies}(r,\ x)\ \land \ \lnot \ \operatorname{PremisesHold}(r,\ x)
\end{array}
```

**Undefinedness Policy.**

```math
\operatorname{StaticUndefined}(J)\ \Leftrightarrow \ \exists \ r.\ \operatorname{Conclusion}(r)\ =\ J\ \land \ \exists \ \pi \ \in \ \operatorname{Premises}(r).\ \pi \ =\ \bot 
```

```math
\begin{array}{l}
\operatorname{RuleId}(r)\ =\ \mathsf{id}\ \Leftrightarrow \ r\ \mathsf{is}\ \mathsf{labeled}\ (\mathsf{id}) \\
\operatorname{DiagIdOf}(J)\ =\ \mathsf{id}\ \Leftrightarrow \ \exists \ r.\ \operatorname{Conclusion}(r)\ =\ J\ \land \ \operatorname{RuleId}(r)\ =\ \mathsf{id} \\
\operatorname{DiagIdOf}(J)\ =\ \bot \ \Leftrightarrow \ \lnot \ \exists \ r.\ \operatorname{Conclusion}(r)\ =\ J\ \land \ \operatorname{RuleId}(r)\ \mathsf{defined} \\
\operatorname{SectionId}(r)\ \in \ \mathsf{String} \\
\operatorname{RulesIn}(\Sigma )\ =\ \{\ r\ \mid \ \operatorname{SectionId}(r)\ \in \ \Sigma \ \}
\end{array}
```

**(Static-Undefined)**

```math
\begin{array}{l}
\operatorname{StaticUndefined}(J)\quad \operatorname{Code}(\operatorname{DiagIdOf}(J))\ =\ c \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ J\ \Uparrow \ c
\end{array}
```

**(Static-Undefined-NoCode)**

```math
\begin{array}{l}
\operatorname{StaticUndefined}(J)\quad \operatorname{Code}(\operatorname{DiagIdOf}(J))\ =\ \bot  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ J\ \Uparrow 
\end{array}
```

**OutsideConformance.**
If OutsideConformance holds, this specification imposes no requirements on observable behavior, diagnostics, or termination. Implementations MAY exhibit any behavior.

**Static vs. Runtime Checks.**

```math
\mathsf{CheckKind}\ =\ \{\mathsf{PatternExhaustiveness},\ \mathsf{TypeCompatibility},\ \mathsf{PermissionViolations},\ \mathsf{ProvenanceEscape},\ \mathsf{ArrayBounds},\ \mathsf{SafePointerValidity},\ \mathsf{IntegerOverflow},\ \mathsf{SliceBounds},\ \mathsf{IntDivisionByZero}\}
```

```math
\begin{array}{l}
\mathsf{StaticCheck}\ =\ \{\mathsf{PatternExhaustiveness},\ \mathsf{TypeCompatibility},\ \mathsf{PermissionViolations},\ \mathsf{ProvenanceEscape},\ \mathsf{ArrayBounds},\ \mathsf{SafePointerValidity}\} \\
\mathsf{RuntimeCheck}\ =\ \{\mathsf{IntegerOverflow},\ \mathsf{SliceBounds},\ \mathsf{IntDivisionByZero}\}
\end{array}
```

```math
\begin{array}{l}
\operatorname{RuntimeBehavior}(\mathsf{IntegerOverflow})\ =\ \mathsf{Panic} \\
\operatorname{RuntimeBehavior}(\mathsf{SliceBounds})\ =\ \mathsf{Panic} \\
\operatorname{RuntimeBehavior}(\mathsf{IntDivisionByZero})\ =\ \mathsf{Panic}
\end{array}
```

```math
\mathsf{ResourceExhaustion}\ \Rightarrow \ \mathsf{OutsideConformance}
```

**Error Recovery.**
LexRecovery = SkipToNextTokenStart

```math
\mathsf{ParseRecovery}\ =\ \operatorname{SyncSet}(\{\texttt{;},\ \texttt{\}},\ \texttt{EOF}\})
```
TypeRecovery = ContinueDecls

```math
\mathsf{MaxErrorCount}\ \in \ \mathbb{N} \ \cup \ \{\infty \}
```
SuggestedMaxErrorCount = 100

```math
\operatorname{AbortOnErrorCount}(n)\ \Leftrightarrow \ n\ \ge \ \mathsf{MaxErrorCount}
```

### 1.3 Document Conventions

**NormativeKeywords.**

```math
\mathsf{NormativeKeywords}\ =\ \{\texttt{MUST},\ \texttt{MUST NOT},\ \texttt{SHOULD},\ \texttt{SHOULD NOT},\ \texttt{MAY}\}
```

**RFC 2119 Interpretation.**
The keywords in NormativeKeywords MUST be interpreted as described in RFC 2119.

**DiagnosticCodeFormat.**

```math
\begin{array}{l}
\mathsf{DiagPrefix}\ =\ \{E,\ W,\ I,\ P\} \\
\mathsf{DiagCategory}\ =\ [A-Z]^3 \\
\mathsf{DiagDigits}\ =\ [0-9]^4 \\
\mathsf{DiagCode}\ =\ \mathsf{DiagPrefix}\ \mathbin{++} \ \texttt{"-"}\ \mathbin{++} \ \mathsf{DiagCategory}\ \mathbin{++} \ \texttt{"-"}\ \mathbin{++} \ \mathsf{DiagDigits} \\
\operatorname{Bucket}(\mathsf{Digits})\ =\ \mathsf{Digits}[0..1] \\
\operatorname{Seq}(\mathsf{Digits})\ =\ \mathsf{Digits}[2..3]
\end{array}
```

### 1.4 Normative References

**NormativeRefs.**
This specification relies on the following external documents:

| Reference | Document                                                           | Usage                                                                                     |
| --------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| [RFC2119] | RFC 2119: Key words for use in RFCs to Indicate Requirement Levels | Normative keyword interpretation (§1.3)                                                   |
| [UNICODE] | The Unicode Standard, Version 15.0.0                               | Source text encoding (§4.1), identifier normalization (§4.1.6), escape sequences (§4.2.6) |
| [IEEE754] | IEEE 754-2019: Standard for Floating-Point Arithmetic              | Float literal semantics (§16.1), float type representation (§24.2.1)                      |
| [LLVM21]  | LLVM Language Reference Manual, Version 21                         | Backend target and IR requirements (§24.1, §24.7)                                         |

**Reference Details.**
[RFC2119] Bradner, S., "Key words for use in RFCs to Indicate Requirement Levels", BCP 14, RFC 2119, March 1997. https://www.rfc-editor.org/rfc/rfc2119

[UNICODE] The Unicode Consortium. The Unicode Standard, Version 15.0.0, (Mountain View, CA: The Unicode Consortium, 2022). https://www.unicode.org/versions/Unicode15.0.0/

[IEEE754] IEEE. "IEEE Standard for Floating-Point Arithmetic," IEEE Std 754-2019, July 2019.

[LLVM21] LLVM Project. "LLVM Language Reference Manual," Version 21. https://llvm.org/docs/LangRef.html

**Conformance.**
A conforming implementation MUST implement the features of the referenced standards as specified in this document. Where this specification differs from a referenced standard, this specification takes precedence.

### 1.5 Compile-Time Execution and Phase Ordering

```math
\mathsf{TranslationPhases}\ =\ [\mathsf{Phase1},\ \mathsf{Phase2},\ \mathsf{Phase3},\ \mathsf{Phase4}]
```
Phase1 = ParseAndAggregate
Phase2 = ExecuteComptime
Phase3 = ResolveAndTypecheck
Phase4 = LowerAndEmit

```math
\Gamma \ \vdash \ \operatorname{ExecuteComptime}(P,\ \mathsf{Ms})\ \Downarrow \ \mathsf{Ms}_{\mathsf{ct}}\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{ComptimePass}(P,\ \mathsf{Ms})\ \Downarrow \ \mathsf{Ms}_{\mathsf{ct}}
```

1. Phase 1 MUST parse and aggregate all modules before Phase 2 begins.
2. Phase 2 MUST execute all compile-time forms over the Phase 1 module set in deterministic dependency order.
3. Any declaration emitted during Phase 2 MUST be incorporated into the module set before Phase 3 begins.
4. Phase 3 MUST resolve names and discharge static semantics against the Phase 2-expanded module set.
5. Phase 4 MUST lower and emit only the program accepted by Phase 3.

The syntax and semantics of compile-time forms are defined by Chapter 22.

### 1.6 Target and ABI Assumptions

```math
\begin{array}{l}
\mathsf{TargetProfile}\ =\ \{\texttt{x86\_64-sysv},\ \texttt{x86\_64-win64},\ \texttt{aarch64-aapcs64}\} \\
\mathsf{SelectedTargetProfile}\ \in \ \mathsf{TargetProfile}
\end{array}
```
The selected target profile is resolved once per compilation invocation.
Resolution order is:
1. the explicit CLI target-profile override, if provided;
2. otherwise `toolchain.target_profile` from `Ultraviolet.toml`, if provided;
3. otherwise the compilation invocation is ill-formed.
A conforming implementation MUST NOT silently infer `SelectedTargetProfile` from the host platform.

```math
\begin{array}{l}
\operatorname{TargetArch}(\texttt{x86\_64-sysv})\ =\ \texttt{x86\_64} \\
\operatorname{TargetArch}(\texttt{x86\_64-win64})\ =\ \texttt{x86\_64} \\
\operatorname{TargetArch}(\texttt{aarch64-aapcs64})\ =\ \texttt{aarch64}
\end{array}
```

Endianness = Little
PtrSizeBytes = PtrSize

```math
\begin{array}{l}
\operatorname{Target}(\texttt{x86\_64-sysv})\ =\ \texttt{"x86\_64-unknown-linux-gnu"} \\
\operatorname{Target}(\texttt{x86\_64-win64})\ =\ \texttt{"x86\_64-pc-windows-msvc"} \\
\operatorname{Target}(\texttt{aarch64-aapcs64})\ =\ \texttt{"aarch64-unknown-linux-gnu"}
\end{array}
```

Layout and ABI requirements are defined only by their canonical owner sections in this document, especially Chapters 12, 13, 14.6, and 23.2. The source-draft bundle name `LayoutSpec` is not a separate normative relation in this reorganization.
