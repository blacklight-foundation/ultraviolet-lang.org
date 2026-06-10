---
title: "1.1 Conformance"
description: "1.1 Conformance from 1. Conformance and Notation of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "conformance-and-notation"
specSection: "11-conformance"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/conformance-and-notation/">1. Conformance and Notation</a>
  <span>Conformance and Notation</span>
</div>

## 1.1 Conformance

**Conforming.**

$$
\operatorname{Conforming}(P)\ \Leftrightarrow \ \operatorname{WF}(P)
$$

**WF.**

$$
\operatorname{WF}(P)\ \Leftrightarrow \ \exists \ \Gamma .\ \operatorname{Project}(\Gamma )\ =\ P\ \land \ \forall \ j\ \in \ \operatorname{ReqJudgments}(P).\ \Gamma \ \vdash \ j\ \Downarrow \ \mathsf{ok}
$$

**ReqJudgments.**

$$
\operatorname{ReqJudgments}(P)\ =\ [\operatorname{Phase1Order}(P),\ \operatorname{Phase2Order}(P),\ \operatorname{Phase3Order}(P),\ \operatorname{Phase4Order}(P)]
$$

**Phase1Order.**

$$
\Gamma \ \vdash \ \operatorname{Phase1Order}(P)\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \exists \ \mathsf{Ms}.\ \Gamma \ \vdash \ \operatorname{ParseModules}(P)\ \Downarrow \ \mathsf{Ms}
$$

**Phase2Order.**

$$
\Gamma \ \vdash \ \operatorname{Phase2Order}(P)\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \exists \ \mathsf{Ms},\ \mathsf{Ms}_{\mathsf{ct}}.\ \Gamma \ \vdash \ \operatorname{ParseModules}(P)\ \Downarrow \ \mathsf{Ms}\ \land \ \Gamma \ \vdash \ \operatorname{ExecuteComptime}(P,\ \mathsf{Ms})\ \Downarrow \ \mathsf{Ms}_{\mathsf{ct}}
$$

$$
\begin{array}{l}
\operatorname{Phase3Checks}(P,\ \mathsf{Ms}_{\mathsf{ct}},\ \mathsf{Ms}_{\mathsf{res}})\ =\ [\Gamma_{\mathsf{ct}} \ \vdash \ \operatorname{ResolveModules}(P_{\mathsf{ct}})\ \Downarrow \ \mathsf{Ms}_{\mathsf{res}},\ \Gamma_{\mathsf{res}} \ \vdash \ \operatorname{DeclTyping}(\mathsf{Ms}_{\mathsf{res}})\ \Downarrow \ \mathsf{ok},\ \Gamma_{\mathsf{res}} \ \vdash \ \operatorname{MainCheck}(P_{\mathsf{res}})\ \Downarrow \ \mathsf{ok}] \\[0.16em]
\ \mathsf{where} \\[0.16em]
\ P_{\mathsf{ct}}\ =\ \operatorname{ProjectView}(P,\ \mathsf{Ms}_{\mathsf{ct}}) \\[0.16em]
\ \Gamma_{\mathsf{ct}} \ =\ \Gamma [\mathsf{project}\ \mapsto \ P_{\mathsf{ct}}] \\[0.16em]
\ P_{\mathsf{res}}\ =\ \operatorname{ProjectView}(P,\ \mathsf{Ms}_{\mathsf{res}}) \\[0.16em]
\ \Gamma_{\mathsf{res}} \ =\ \Gamma [\mathsf{project}\ \mapsto \ P_{\mathsf{res}}] \\[0.16em]
\Gamma \ \vdash \ \operatorname{Phase3Order}(P)\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \exists \ \mathsf{Ms},\ \mathsf{Ms}_{\mathsf{ct}},\ \mathsf{Ms}_{\mathsf{res}}.\ \Gamma \ \vdash \ \operatorname{ParseModules}(P)\ \Downarrow \ \mathsf{Ms}\ \land \ \Gamma \ \vdash \ \operatorname{ExecuteComptime}(P,\ \mathsf{Ms})\ \Downarrow \ \mathsf{Ms}_{\mathsf{ct}}\ \land \ \operatorname{FirstFail}(\operatorname{Phase3Checks}(P,\ \mathsf{Ms}_{\mathsf{ct}},\ \mathsf{Ms}_{\mathsf{res}}))\ =\ \bot
\end{array}
$$

**Phase4Order.**

$$
\Gamma \ \vdash \ \operatorname{Phase4Order}(P)\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \exists \ \mathsf{Ms},\ \mathsf{Ms}_{\mathsf{ct}},\ \mathsf{Ms}_{\mathsf{res}},\ \mathsf{Objs},\ \mathsf{IRs},\ \mathsf{Artifact}.\ \Gamma \ \vdash \ \operatorname{ParseModules}(P)\ \Downarrow \ \mathsf{Ms}\ \land \ \Gamma \ \vdash \ \operatorname{ExecuteComptime}(P,\ \mathsf{Ms})\ \Downarrow \ \mathsf{Ms}_{\mathsf{ct}}\ \land \ \operatorname{FirstFail}(\operatorname{Phase3Checks}(P,\ \mathsf{Ms}_{\mathsf{ct}},\ \mathsf{Ms}_{\mathsf{res}}))\ =\ \bot \ \land \ P_{\mathsf{res}}\ =\ \operatorname{ProjectView}(P,\ \mathsf{Ms}_{\mathsf{res}})\ \land \ \Gamma_{\mathsf{res}} \ =\ \Gamma [\mathsf{project}\ \mapsto \ P_{\mathsf{res}}]\ \land \ \Gamma_{\mathsf{res}} \ \vdash \ \operatorname{OutputPipeline}(P_{\mathsf{res}})\ \Downarrow \ (\mathsf{Objs},\ \mathsf{IRs},\ \mathsf{Artifact})
$$

**Constructs.**

$$
\begin{array}{l}
\operatorname{TypeNodes}(P,\ m)\ =\ \{\ t\ \mid \ t\ \in \ \mathsf{Type}\ \land \ \operatorname{Subnode}(\operatorname{ASTModule}(P,\ m),\ t)\ \} \\[0.16em]
\operatorname{StmtNodes}(P,\ m)\ =\ \{\ s\ \mid \ s\ \in \ \mathsf{Stmt}\ \land \ \operatorname{Subnode}(\operatorname{ASTModule}(P,\ m),\ s)\ \}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ItemKind}(\operatorname{UsingDecl}(\_,\ \_,\ \_,\ \_,\ \_))\ =\ \texttt{using\_decl} \\[0.16em]
\operatorname{ItemKind}(\operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_))\ =\ \texttt{procedure} \\[0.16em]
\operatorname{ItemKind}(\operatorname{RecordDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_))\ =\ \texttt{record} \\[0.16em]
\operatorname{ItemKind}(\operatorname{EnumDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_))\ =\ \texttt{enum} \\[0.16em]
\operatorname{ItemKind}(\operatorname{ModalDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_))\ =\ \texttt{modal} \\[0.16em]
\operatorname{ItemKind}(\operatorname{ClassDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_))\ =\ \texttt{class} \\[0.16em]
\operatorname{ItemKind}(\operatorname{TypeAliasDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_))\ =\ \texttt{type\_alias} \\[0.16em]
\operatorname{ItemKind}(\operatorname{StaticDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_))\ =\ \texttt{static\_decl} \\[0.16em]
\operatorname{ItemKind}(\_)\ =\ \bot
\end{array}
$$

$$
\operatorname{TopDeclConstructs}(P)\ =\ \{\ \operatorname{ItemKind}(\mathsf{it})\ \mid \ m\ \in \ P.\mathsf{modules}\ \land \ \mathsf{it}\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \land \ \operatorname{ItemKind}(\mathsf{it})\ \ne \ \bot \ \}
$$

$$
\begin{array}{l}
\operatorname{TypeCtor}(\operatorname{TypePerm}(\_,\ \mathsf{base}))\ =\ \operatorname{TypeCtor}(\mathsf{base}) \\[0.16em]
\operatorname{TypeCtor}(\operatorname{TypePrim}(\mathsf{name}))\ =\ \{\mathsf{name}\} \\[0.16em]
\operatorname{TypeCtor}(\operatorname{TypeTuple}(\mathsf{elems}))\ =\ \{\texttt{tuple}\}\ \cup \ \bigcup \_\{t\ \in \ \mathsf{elems}\}\ \operatorname{TypeCtor}(t) \\[0.16em]
\operatorname{TypeCtor}(\operatorname{TypeArray}(\mathsf{elem},\ \_))\ =\ \{\texttt{array}\}\ \cup \ \operatorname{TypeCtor}(\mathsf{elem}) \\[0.16em]
\operatorname{TypeCtor}(\operatorname{TypeSlice}(\mathsf{elem}))\ =\ \{\texttt{slice}\}\ \cup \ \operatorname{TypeCtor}(\mathsf{elem}) \\[0.16em]
\operatorname{TypeCtor}(\operatorname{TypeUnion}(\mathsf{members}))\ =\ \{\texttt{union}\}\ \cup \ \bigcup \_\{t\ \in \ \mathsf{members}\}\ \operatorname{TypeCtor}(t) \\[0.16em]
\operatorname{TypeCtor}(\operatorname{TypeFunc}(\mathsf{params},\ \mathsf{ret}))\ =\ \{\texttt{function}\}\ \cup \ \bigcup \_\{\langle \_,\ t\rangle \ \in \ \mathsf{params}\}\ \operatorname{TypeCtor}(t)\ \cup \ \operatorname{TypeCtor}(\mathsf{ret}) \\[0.16em]
\operatorname{TypeCtor}(\operatorname{TypeApply}(\mathsf{path},\ \_))\ =\ \operatorname{TypeCtor}(\operatorname{TypePath}(\mathsf{path})) \\[0.16em]
\operatorname{TypeCtor}(\operatorname{TypePtr}(\mathsf{elem},\ \_))\ =\ \{\texttt{ptr}\}\ \cup \ \operatorname{TypeCtor}(\mathsf{elem}) \\[0.16em]
\operatorname{TypeCtor}(\operatorname{TypeRawPtr}(\_,\ \mathsf{elem}))\ =\ \{\texttt{rawptr}\}\ \cup \ \operatorname{TypeCtor}(\mathsf{elem}) \\[0.16em]
\operatorname{TypeCtor}(\operatorname{TypeString}(\_))\ =\ \{\texttt{string}\} \\[0.16em]
\operatorname{TypeCtor}(\operatorname{TypeBytes}(\_))\ =\ \{\texttt{bytes}\} \\[0.16em]
\operatorname{TypeCtor}(\operatorname{TypeDynamic}(\_))\ =\ \{\texttt{dyn\_class}\} \\[0.16em]
\operatorname{TypeCtor}(\operatorname{TypeOpaque}(\_))\ =\ \{\texttt{opaque}\} \\[0.16em]
\operatorname{TypeCtor}(\operatorname{TypeRefine}(\mathsf{base},\ \_))\ =\ \{\texttt{refinement}\}\ \cup \ \operatorname{TypeCtor}(\mathsf{base}) \\[0.16em]
\operatorname{TypeCtor}(\operatorname{TypeModalState}(\_,\ \_))\ =\ \{\texttt{modal}\} \\[0.16em]
\operatorname{TypeCtor}(\operatorname{TypeRange}(\mathsf{base}))\ =\ \{\texttt{range}\}\ \cup \ \operatorname{TypeCtor}(\mathsf{base}) \\[0.16em]
\operatorname{TypeCtor}(\operatorname{TypeRangeInclusive}(\mathsf{base}))\ =\ \{\texttt{range\_inclusive}\}\ \cup \ \operatorname{TypeCtor}(\mathsf{base}) \\[0.16em]
\operatorname{TypeCtor}(\operatorname{TypeRangeFrom}(\mathsf{base}))\ =\ \{\texttt{range\_from}\}\ \cup \ \operatorname{TypeCtor}(\mathsf{base}) \\[0.16em]
\operatorname{TypeCtor}(\operatorname{TypeRangeTo}(\mathsf{base}))\ =\ \{\texttt{range\_to}\}\ \cup \ \operatorname{TypeCtor}(\mathsf{base}) \\[0.16em]
\operatorname{TypeCtor}(\operatorname{TypeRangeToInclusive}(\mathsf{base}))\ =\ \{\texttt{range\_to\_inclusive}\}\ \cup \ \operatorname{TypeCtor}(\mathsf{base}) \\[0.16em]
\operatorname{TypeCtor}(\mathsf{TypeRangeFull})\ =\ \{\texttt{range\_full}\} \\[0.16em]
\operatorname{TypeCtor}(\operatorname{TypeClosure}(\mathsf{params},\ \mathsf{ret},\ \_))\ =\ \{\texttt{closure}\}\ \cup \ \bigcup \_\{\langle \_,\ t\rangle \ \in \ \mathsf{params}\}\ \operatorname{TypeCtor}(t)\ \cup \ \operatorname{TypeCtor}(\mathsf{ret}) \\[0.16em]
\operatorname{TypeCtor}(\operatorname{TypePath}([\texttt{"Region"}]))\ =\ \{\texttt{region}\} \\[0.16em]
\operatorname{TypeCtor}(\operatorname{TypePath}([\texttt{"RegionOptions"}]))\ =\ \{\texttt{region\_options}\} \\[0.16em]
\operatorname{TypeCtor}(\operatorname{TypePath}(p))\ =\ \{\texttt{record}\}\ \mathsf{if}\ \operatorname{RecordDecl}(p)\ \mathsf{defined} \\[0.16em]
\operatorname{TypeCtor}(\operatorname{TypePath}(p))\ =\ \{\texttt{enum}\}\ \mathsf{if}\ \operatorname{EnumDecl}(p)\ \mathsf{defined} \\[0.16em]
\operatorname{TypeCtor}(\_)\ =\ \emptyset
\end{array}
$$

$$
\operatorname{TypeConstructs}(P)\ =\ \bigcup \_\{m\ \in \ P.\mathsf{modules}\}\ \bigcup \_\{t\ \in \ \operatorname{TypeNodes}(P,\ m)\}\ \operatorname{TypeCtor}(t)
$$

$$
\begin{array}{l}
\operatorname{PermOfType}(\operatorname{TypePerm}(p,\ \_))\ =\ \{p\} \\[0.16em]
\operatorname{PermOfType}(\_)\ =\ \emptyset \\[0.16em]
\operatorname{RecvPerms}(\mathsf{members})\ =\ \{\ p\ \mid \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{ov},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{MethodDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{ov},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\ \in \ \mathsf{members}\ \land \ \mathsf{recv}\ =\ \operatorname{ReceiverShorthand}(p)\ \} \\[0.16em]
\operatorname{ClassRecvPerms}(\mathsf{items})\ =\ \{\ p\ \mid \ \exists \ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}.\ \operatorname{ClassMethodDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\ \in \ \mathsf{items}\ \land \ \mathsf{recv}\ =\ \operatorname{ReceiverShorthand}(p)\ \} \\[0.16em]
\operatorname{StateRecvPerms}(\mathsf{states})\ =\ \{\ p\ \mid \ \exists \ S,\ \mathsf{members},\ \mathsf{span},\ \mathsf{doc},\ \mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body}.\ \operatorname{StateBlock}(S,\ \mathsf{members},\ \mathsf{span},\ \mathsf{doc})\ \in \ \mathsf{states}\ \land \ \operatorname{StateMethodDecl}(\mathsf{attrs},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret},\ \mathsf{contract},\ \mathsf{body},\ \_,\ \_)\ \in \ \mathsf{members}\ \land \ \mathsf{recv}\ =\ \operatorname{ReceiverShorthand}(p)\ \} \\[0.16em]
\operatorname{PermConstructs}(P)\ =\ \bigcup \_\{m\ \in \ P.\mathsf{modules}\}\ \bigcup \_\{t\ \in \ \operatorname{TypeNodes}(P,\ m)\}\ \operatorname{PermOfType}(t)\ \cup \ \bigcup \_\{m\ \in \ P.\mathsf{modules}\}\ \bigcup \_\{\operatorname{RecordDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \mathsf{members},\ \_,\ \_,\ \_)\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\}\ \operatorname{RecvPerms}(\mathsf{members})\ \cup \ \bigcup \_\{m\ \in \ P.\mathsf{modules}\}\ \bigcup \_\{\operatorname{ModalDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \mathsf{states},\ \_,\ \_,\ \_)\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\}\ \operatorname{StateRecvPerms}(\mathsf{states})\ \cup \ \bigcup \_\{m\ \in \ P.\mathsf{modules}\}\ \bigcup \_\{\operatorname{ClassDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \mathsf{items},\ \_,\ \_)\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\}\ \operatorname{ClassRecvPerms}(\mathsf{items})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ExprKind}(\operatorname{Literal}(\_))\ =\ \texttt{literal} \\[0.16em]
\operatorname{ExprKind}(\operatorname{Identifier}(\_))\ =\ \texttt{identifier} \\[0.16em]
\operatorname{ExprKind}(\operatorname{FieldAccess}(\_,\ \_))\ =\ \texttt{field\_access} \\[0.16em]
\operatorname{ExprKind}(\operatorname{TupleAccess}(\_,\ \_))\ =\ \texttt{tuple\_index} \\[0.16em]
\operatorname{ExprKind}(\operatorname{IndexAccess}(\_,\ \_))\ =\ \texttt{index} \\[0.16em]
\operatorname{ExprKind}(\operatorname{IfExpr}(\_,\ \_,\ \_))\ =\ \texttt{if} \\[0.16em]
\operatorname{ExprKind}(\operatorname{IfIsExpr}(\_,\ \_,\ \_,\ \_))\ =\ \texttt{if} \\[0.16em]
\operatorname{ExprKind}(\operatorname{IfCaseExpr}(\_,\ \_,\ \_))\ =\ \texttt{if} \\[0.16em]
\operatorname{ExprKind}(\operatorname{LoopInfinite}(\_,\ \_))\ =\ \texttt{loop} \\[0.16em]
\operatorname{ExprKind}(\operatorname{LoopConditional}(\_,\ \_,\ \_))\ =\ \texttt{loop} \\[0.16em]
\operatorname{ExprKind}(\operatorname{LoopIter}(\_,\ \_,\ \_,\ \_,\ \_))\ =\ \texttt{loop} \\[0.16em]
\operatorname{ExprKind}(\operatorname{MoveExpr}(\_))\ =\ \texttt{move} \\[0.16em]
\operatorname{ExprKind}(\operatorname{Unary}(\texttt{"widen"},\ \_))\ =\ \texttt{widen} \\[0.16em]
\operatorname{ExprKind}(\operatorname{TransmuteExpr}(\_,\ \_,\ \_))\ =\ \texttt{transmute} \\[0.16em]
\operatorname{ExprKind}(\operatorname{UnsafeBlockExpr}(\_))\ =\ \texttt{unsafe} \\[0.16em]
\operatorname{ExprKind}(\operatorname{AllocExpr}(\_,\ \_))\ =\ \texttt{region\_alloc} \\[0.16em]
\operatorname{ExprKind}(\operatorname{MethodCall}(\_,\ \_,\ \_))\ =\ \texttt{method\_call} \\[0.16em]
\operatorname{ExprKind}(\operatorname{Propagate}(\_))\ =\ \texttt{union\_propagate} \\[0.16em]
\operatorname{ExprKind}(\operatorname{ParallelExpr}(\_,\ \_,\ \_))\ =\ \texttt{parallel} \\[0.16em]
\operatorname{ExprKind}(\operatorname{SpawnExpr}(\_,\ \_))\ =\ \texttt{spawn} \\[0.16em]
\operatorname{ExprKind}(\operatorname{DispatchExpr}(\_,\ \_,\ \_,\ \_,\ \_))\ =\ \texttt{dispatch} \\[0.16em]
\operatorname{ExprKind}(\operatorname{WaitExpr}(\_))\ =\ \texttt{wait} \\[0.16em]
\operatorname{ExprKind}(\operatorname{YieldExpr}(\_,\ \_))\ =\ \texttt{yield} \\[0.16em]
\operatorname{ExprKind}(\operatorname{YieldFromExpr}(\_,\ \_))\ =\ \texttt{yield} \\[0.16em]
\operatorname{ExprKind}(\operatorname{SyncExpr}(\_))\ =\ \texttt{sync} \\[0.16em]
\operatorname{ExprKind}(\operatorname{RaceExpr}(\_))\ =\ \texttt{race} \\[0.16em]
\operatorname{ExprKind}(\operatorname{AllExpr}(\_))\ =\ \texttt{all} \\[0.16em]
\operatorname{ExprKind}(\_)\ =\ \bot
\end{array}
$$

$$
\begin{array}{l}
\operatorname{StmtKind}(\operatorname{LetStmt}(\_))\ =\ \texttt{let} \\[0.16em]
\operatorname{StmtKind}(\operatorname{VarStmt}(\_))\ =\ \texttt{var} \\[0.16em]
\operatorname{StmtKind}(\operatorname{UsingLocalStmt}(\_,\ \_,\ \_))\ =\ \texttt{using} \\[0.16em]
\operatorname{StmtKind}(\operatorname{AssignStmt}(\_,\ \_))\ =\ \texttt{assign} \\[0.16em]
\operatorname{StmtKind}(\operatorname{CompoundAssignStmt}(\_,\ \_,\ \_))\ =\ \texttt{compound\_assign} \\[0.16em]
\operatorname{StmtKind}(\operatorname{DeferStmt}(\_))\ =\ \texttt{defer} \\[0.16em]
\operatorname{StmtKind}(\operatorname{RegionStmt}(\_,\ \_,\ \_))\ =\ \texttt{region} \\[0.16em]
\operatorname{StmtKind}(\operatorname{FrameStmt}(\_,\ \_))\ =\ \texttt{frame} \\[0.16em]
\operatorname{StmtKind}(\operatorname{KeyBlockStmt}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_))\ =\ \texttt{key\_block} \\[0.16em]
\operatorname{StmtKind}(\operatorname{ReturnStmt}(\_))\ =\ \texttt{return} \\[0.16em]
\operatorname{StmtKind}(\operatorname{BreakStmt}(\_))\ =\ \texttt{break} \\[0.16em]
\operatorname{StmtKind}(\mathsf{ContinueStmt})\ =\ \texttt{continue} \\[0.16em]
\operatorname{StmtKind}(\operatorname{UnsafeBlockStmt}(\_))\ =\ \texttt{unsafe} \\[0.16em]
\operatorname{StmtKind}(\_)\ =\ \bot
\end{array}
$$

$$
\operatorname{ExprStmtConstructs}(P)\ =\ \{\ \operatorname{ExprKind}(e)\ \mid \ m\ \in \ P.\mathsf{modules}\ \land \ e\ \in \ \operatorname{ExprNodes}(P,\ m)\ \land \ \operatorname{ExprKind}(e)\ \ne \ \bot \ \}\ \cup \ \{\ \operatorname{StmtKind}(s)\ \mid \ m\ \in \ P.\mathsf{modules}\ \land \ s\ \in \ \operatorname{StmtNodes}(P,\ m)\ \land \ \operatorname{StmtKind}(s)\ \ne \ \bot \ \}
$$

$$
\operatorname{CapConstructs}(P)\ =\ \{\ c\ \mid \ (c\ =\ \texttt{Context}\ \lor \ \operatorname{CapClass}(c))\ \land \ \exists \ m,\ t.\ m\ \in \ P.\mathsf{modules}\ \land \ t\ \in \ \operatorname{TypeNodes}(P,\ m)\ \land \ ((c\ =\ \texttt{Context}\ \land \ t\ =\ \operatorname{TypePath}([\texttt{Context}]))\ \lor \ (c\ \ne \ \texttt{Context}\ \land \ t\ =\ \operatorname{TypeDynamic}([c])))\ \}\quad (\mathsf{CapClass}\ \mathsf{per}\ \S 6.1.1)
$$

$$
\operatorname{Constructs}(P)\ =\ \operatorname{TopDeclConstructs}(P)\ \cup \ \operatorname{TypeConstructs}(P)\ \cup \ \operatorname{PermConstructs}(P)\ \cup \ \operatorname{ExprStmtConstructs}(P)\ \cup \ \operatorname{CapConstructs}(P)
$$

**(Reject-IllFormed)**

$$
\begin{array}{l}
\lnot \ \operatorname{Conforming}(P) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Reject}(P)
\end{array}
$$

**TranslationPhases.**

$$
\mathsf{TranslationPhases}\ =\ [\mathsf{Phase1},\ \mathsf{Phase2},\ \mathsf{Phase3},\ \mathsf{Phase4}]
$$
