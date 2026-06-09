---
title: "24.1 Shared Lowering Judgments"
description: "24.1 Shared Lowering Judgments from 24. Common Lowering, Program Lifecycle, and Backend of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "common-lowering-program-lifecycle-and-backend"
specSection: "241-shared-lowering-judgments"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/common-lowering-program-lifecycle-and-backend/">24. Common Lowering, Program Lifecycle, and Backend</a>
  <span>Common Lowering, Program Lifecycle, and Backend</span>
</div>

## 24.1 Shared Lowering Judgments

Feature-local lowering rules are defined by the owning feature sections in Chapters 12 through 22. This section defines only the shared lowering interface, correctness obligations, and project/module composition rules used by those feature-owned derivations.

### 24.1.1 Codegen Model and Targets

$$
\operatorname{ArtifactsOf}(P)\ =\ \operatorname{Set}(\mathsf{Objs})\ \cup \ \operatorname{Set}(\mathsf{IRs})\ \cup \ (\{\mathsf{Artifact}\}\ \mathsf{if}\ \mathsf{Artifact}\ \ne \ \bot \ \mathsf{else}\ \emptyset )\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{OutputPipeline}(P)\ \Downarrow \ (\mathsf{Objs},\ \mathsf{IRs},\ \mathsf{Artifact})
$$
IRTarget = "LLVM-21.1.8"

$$
\begin{array}{l}
\mathsf{ObjTarget}\ =\ \operatorname{ObjFormatOf}(\mathsf{SelectedTargetProfile}) \\[0.16em]
\mathsf{LLVMValid}_{21}.1.8(L)\ \Leftrightarrow \ L\ \in \ \mathsf{LLVMIR}_{21}.1.8 \\[0.16em]
\forall \ \mathsf{IR},\ L.\ \Gamma \ \vdash \ \operatorname{LowerIR}(\mathsf{IR})\ \Downarrow \ L\ \Rightarrow \ \mathsf{LLVMValid}_{21}.1.8(L)
\end{array}
$$

### 24.1.2 Shared Judgments and Correctness

$$
\mathsf{CodegenJudg}\ =\ \{\mathsf{CodegenProject},\ \mathsf{CodegenModule},\ \mathsf{CodegenItem},\ \mathsf{CodegenExpr},\ \mathsf{CodegenStmt},\ \mathsf{CodegenBlock},\ \mathsf{CodegenPlace}\}
$$

$$
\operatorname{IRDefined}(\mathsf{IR})\ \Leftrightarrow \ \forall \ \sigma .\ \exists \ \mathsf{out},\ \sigma '.\ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')
$$

$$
\begin{array}{l}
\mathsf{CodegenExprValCorrect}\ \Leftrightarrow \ \forall \ e,\ \mathsf{IR},\ v,\ \sigma ,\ v',\ \sigma '.\ (\Gamma \ \vdash \ \operatorname{CodegenExpr}(e)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle \ \land \ \Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma '))\ \Rightarrow \ (\operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma ')\ \land \ v\ =\ v') \\[0.16em]
\mathsf{CodegenExprCtrlCorrect}\ \Leftrightarrow \ \forall \ e,\ \mathsf{IR},\ v,\ \sigma ,\ \kappa ,\ \sigma '.\ (\Gamma \ \vdash \ \operatorname{CodegenExpr}(e)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle \ \land \ \Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma '))\ \Rightarrow \ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma ') \\[0.16em]
\mathsf{CodegenStmtCorrect}\ \Leftrightarrow \ \forall \ s,\ \mathsf{IR},\ \sigma ,\ \mathsf{sout},\ \sigma '.\ (\Gamma \ \vdash \ \operatorname{CodegenStmt}(s)\ \Downarrow \ \mathsf{IR}\ \land \ \Gamma \ \vdash \ \operatorname{ExecSigma}(s,\ \sigma )\ \Downarrow \ (\mathsf{sout},\ \sigma '))\ \Rightarrow \ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\mathsf{sout},\ \sigma ') \\[0.16em]
\mathsf{CodegenBlockValCorrect}\ \Leftrightarrow \ \forall \ b,\ \mathsf{IR},\ v,\ \sigma ,\ v',\ \sigma '.\ (\Gamma \ \vdash \ \operatorname{CodegenBlock}(b)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle \ \land \ \Gamma \ \vdash \ \operatorname{EvalBlockSigma}(b,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma '))\ \Rightarrow \ (\operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma ')\ \land \ v\ =\ v') \\[0.16em]
\mathsf{CodegenBlockCtrlCorrect}\ \Leftrightarrow \ \forall \ b,\ \mathsf{IR},\ v,\ \sigma ,\ \kappa ,\ \sigma '.\ (\Gamma \ \vdash \ \operatorname{CodegenBlock}(b)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle \ \land \ \Gamma \ \vdash \ \operatorname{EvalBlockSigma}(b,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma '))\ \Rightarrow \ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma ')
\end{array}
$$

$$
\begin{array}{l}
\mathsf{CodegenCorrect}\ \Leftrightarrow \ \mathsf{CodegenExprValCorrect}\ \land \ \mathsf{CodegenExprCtrlCorrect}\ \land \ \mathsf{CodegenStmtCorrect}\ \land \ \mathsf{CodegenBlockValCorrect}\ \land \ \mathsf{CodegenBlockCtrlCorrect} \\[0.16em]
\mathsf{CodegenUndefined}\ \Leftrightarrow \ \exists \ e,\ \mathsf{IR},\ v.\ \Gamma \ \vdash \ \operatorname{CodegenExpr}(e)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle \ \land \ \lnot \ \operatorname{IRDefined}(\mathsf{IR})\ \lor \ \exists \ s,\ \mathsf{IR}.\ \Gamma \ \vdash \ \operatorname{CodegenStmt}(s)\ \Downarrow \ \mathsf{IR}\ \land \ \lnot \ \operatorname{IRDefined}(\mathsf{IR})\ \lor \ \exists \ b,\ \mathsf{IR},\ v.\ \Gamma \ \vdash \ \operatorname{CodegenBlock}(b)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle \ \land \ \lnot \ \operatorname{IRDefined}(\mathsf{IR}) \\[0.16em]
\mathsf{CodegenUndefined}\ \Rightarrow \ \mathsf{OutsideConformance}
\end{array}
$$

### 24.1.3 IR Forms and Composition

$$
\begin{array}{l}
\mathsf{IRDecls}\ =\ [\mathsf{IRDecl}] \\[0.16em]
\mathsf{ModuleIR}\ =\ \mathsf{IRDecls} \\[0.16em]
\mathsf{LLVMEmitJudg}\ =\ \{\operatorname{LowerIR}(\mathsf{ModuleIR})\ \Downarrow \ \mathsf{LLVMIR},\ \operatorname{EmitLLVM}(\mathsf{LLVMIR})\ \Downarrow \ \mathsf{bytes},\ \operatorname{EmitObj}(\mathsf{LLVMIR})\ \Downarrow \ \mathsf{bytes}\}
\end{array}
$$

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CodegenItem}(\mathsf{item})\ \Downarrow \ \mathsf{ds}\ \Rightarrow \ \mathsf{ds}\ \in \ \mathsf{IRDecls} \\[0.16em]
\mathsf{ProcIR}\ :\ \mathsf{Symbol}\ \times \ [\mathsf{Param}]\ \times \ \mathsf{Type}\ \times \ \mathsf{IR}\ \to \ \mathsf{IRDecl}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{PanicOutParam}\ =\ \langle \texttt{move},\ \mathsf{PanicOutName},\ \mathsf{PanicOutType}\rangle  \\[0.16em]
\operatorname{CodegenParams}(\mathsf{params})\ =\ \mathsf{params}\ \mathbin{++} \ [\mathsf{PanicOutParam}]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{MethodParams}(R,\ m)\ =\ [\langle \operatorname{RecvMode}(m.\mathsf{receiver}),\ \texttt{self},\ \operatorname{RecvType}(\mathsf{Self}_{R},\ m.\mathsf{receiver})\rangle ]\ \mathbin{++} \ m.\mathsf{params} \\[0.16em]
\operatorname{ClassMethodParams}(\mathsf{Cl},\ m)\ =\ [\langle \operatorname{RecvMode}(m.\mathsf{receiver}),\ \texttt{self},\ \operatorname{RecvType}(\mathsf{SelfVar},\ m.\mathsf{receiver})\rangle ]\ \mathbin{++} \ m.\mathsf{params} \\[0.16em]
\operatorname{ParamList_T}(T,\ \mathsf{params})\ =\ [\langle \mathsf{mode}_{i},\ \mathsf{name}_{i},\ \operatorname{SubstSelf}(T,\ \mathsf{ty}_{i})\rangle \ \mid \ \langle \mathsf{mode}_{i},\ \mathsf{name}_{i},\ \mathsf{ty}_{i}\rangle \ \in \ \mathsf{params}] \\[0.16em]
\operatorname{ClassMethodParams_T}(T,\ m)\ =\ [\langle \operatorname{RecvMode}(m.\mathsf{receiver}),\ \texttt{self},\ \operatorname{RecvType}(T,\ m.\mathsf{receiver})\rangle ]\ \mathbin{++} \ \operatorname{ParamList_T}(T,\ m.\mathsf{params}) \\[0.16em]
\operatorname{StateMethodParams}(M,\ S,\ \mathsf{md})\ =\ [\langle \operatorname{RecvMode}(\mathsf{md}.\mathsf{receiver}),\ \texttt{self},\ \operatorname{RecvType}(\operatorname{TypeModalState}(\operatorname{ModalPath}(M),\ S),\ \mathsf{md}.\mathsf{receiver})\rangle ]\ \mathbin{++} \ \mathsf{md}.\mathsf{params} \\[0.16em]
\operatorname{TransitionParams}(M,\ S,\ \mathsf{tr})\ =\ [\langle \texttt{move},\ \texttt{self},\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}(\operatorname{ModalPath}(M),\ S))\rangle ]\ \mathbin{++} \ \mathsf{tr}.\mathsf{params}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{SeqIR}()\ =\ \varepsilon  \\[0.16em]
\operatorname{SeqIR}(\mathsf{IR})\ =\ \mathsf{IR} \\[0.16em]
\operatorname{SeqIR}(\mathsf{IR}_{1},\ \ldots ,\ \mathsf{IR}_{n})\ =\ \operatorname{SeqIR}(\mathsf{IR}_{1},\ \operatorname{SeqIR}(\mathsf{IR}_{2},\ \ldots ,\ \mathsf{IR}_{n}))\quad (n\ \ge \ 2)
\end{array}
$$

$$
\mathsf{EvalOrderJudg}\ =\ \{\mathsf{Children}_{\mathsf{LTR}}\}
$$

$$
\begin{array}{l}
\operatorname{ArgsExprs}([])\ =\ [] \\[0.16em]
\operatorname{ArgsExprs}([\langle \mathsf{pass},\ e,\ \mathsf{span}\rangle ]\ \mathbin{++} \ \mathsf{rest})\ =\ [e]\ \mathbin{++} \ \operatorname{ArgsExprs}(\mathsf{rest})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{FieldExprs}([])\ =\ [] \\[0.16em]
\operatorname{FieldExprs}([\langle f,\ e\rangle ]\ \mathbin{++} \ \mathsf{rest})\ =\ [e]\ \mathbin{++} \ \operatorname{FieldExprs}(\mathsf{rest})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{OptExprs}(\bot ,\ \bot )\ =\ [] \\[0.16em]
\operatorname{OptExprs}(e,\ \bot )\ =\ [e] \\[0.16em]
\operatorname{OptExprs}(\bot ,\ e)\ =\ [e] \\[0.16em]
\operatorname{OptExprs}(e_{1},\ e_{2})\ =\ [e_{1},\ e_{2}]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ParallelOptExprs}([])\ =\ [] \\[0.16em]
\operatorname{ParallelOptExprs}(\operatorname{Cancel}(e)\ \mathbin{::} \ \mathsf{os})\ =\ [e]\ \mathbin{++} \ \operatorname{ParallelOptExprs}(\mathsf{os}) \\[0.16em]
\operatorname{ParallelOptExprs}(\operatorname{Name}(\_)\ \mathbin{::} \ \mathsf{os})\ =\ \operatorname{ParallelOptExprs}(\mathsf{os})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{SpawnOptExprs}([])\ =\ [] \\[0.16em]
\operatorname{SpawnOptExprs}(\operatorname{Name}(\_)\ \mathbin{::} \ \mathsf{os})\ =\ \operatorname{SpawnOptExprs}(\mathsf{os}) \\[0.16em]
\operatorname{SpawnOptExprs}(\operatorname{Affinity}(e)\ \mathbin{::} \ \mathsf{os})\ =\ [e]\ \mathbin{++} \ \operatorname{SpawnOptExprs}(\mathsf{os}) \\[0.16em]
\operatorname{SpawnOptExprs}(\operatorname{Priority}(e)\ \mathbin{::} \ \mathsf{os})\ =\ [e]\ \mathbin{++} \ \operatorname{SpawnOptExprs}(\mathsf{os})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{DispatchOptExprs}([])\ =\ [] \\[0.16em]
\operatorname{DispatchOptExprs}(\operatorname{Reduce}(\_)\ \mathbin{::} \ \mathsf{os})\ =\ \operatorname{DispatchOptExprs}(\mathsf{os}) \\[0.16em]
\operatorname{DispatchOptExprs}(\mathsf{Ordered}\ \mathbin{::} \ \mathsf{os})\ =\ \operatorname{DispatchOptExprs}(\mathsf{os}) \\[0.16em]
\operatorname{DispatchOptExprs}(\operatorname{Chunk}(e)\ \mathbin{::} \ \mathsf{os})\ =\ [e]\ \mathbin{++} \ \operatorname{DispatchOptExprs}(\mathsf{os})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{KeySegExprs}([])\ =\ [] \\[0.16em]
\operatorname{KeySegExprs}(\operatorname{Field}(\_,\ \_)\ \mathbin{::} \ \mathsf{ss})\ =\ \operatorname{KeySegExprs}(\mathsf{ss}) \\[0.16em]
\operatorname{KeySegExprs}(\operatorname{Index}(\_,\ e)\ \mathbin{::} \ \mathsf{ss})\ =\ [e]\ \mathbin{++} \ \operatorname{KeySegExprs}(\mathsf{ss}) \\[0.16em]
\operatorname{KeyPathExprs}(\langle \mathsf{root},\ \mathsf{segs}\rangle )\ =\ \operatorname{KeySegExprs}(\mathsf{segs}) \\[0.16em]
\operatorname{KeyClauseExprs}(\bot )\ =\ [] \\[0.16em]
\operatorname{KeyClauseExprs}(\langle \mathsf{path},\ \mathsf{mode}\rangle )\ =\ \operatorname{KeyPathExprs}(\mathsf{path})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{RaceArmExprs}([])\ =\ [] \\[0.16em]
\operatorname{RaceArmExprs}(\langle e,\ \_,\ \_\rangle \ \mathbin{::} \ \mathsf{as})\ =\ [e]\ \mathbin{++} \ \operatorname{RaceArmExprs}(\mathsf{as})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Children_LTR}(\operatorname{Literal}(\ell ))\ =\ [] \\[0.16em]
\operatorname{Children_LTR}(\mathsf{PtrNullExpr})\ =\ [] \\[0.16em]
\operatorname{Children_LTR}(\operatorname{Identifier}(x))\ =\ [] \\[0.16em]
\operatorname{Children_LTR}(\operatorname{Path}(\mathsf{path},\ \mathsf{name}))\ =\ [] \\[0.16em]
\operatorname{Children_LTR}(\operatorname{TupleExpr}(\mathsf{es}))\ =\ \mathsf{es} \\[0.16em]
\operatorname{Children_LTR}(\operatorname{ArrayExpr}(\mathsf{es}))\ =\ \mathsf{es} \\[0.16em]
\operatorname{Children_LTR}(\operatorname{RecordExpr}(\mathsf{tr},\ \mathsf{fields}))\ =\ \operatorname{FieldExprs}(\mathsf{fields}) \\[0.16em]
\operatorname{Children_LTR}(\operatorname{EnumLiteral}(\mathsf{path},\ \bot ))\ =\ [] \\[0.16em]
\operatorname{Children_LTR}(\operatorname{EnumLiteral}(\mathsf{path},\ \operatorname{Paren}(\mathsf{es})))\ =\ \mathsf{es} \\[0.16em]
\operatorname{Children_LTR}(\operatorname{EnumLiteral}(\mathsf{path},\ \operatorname{Brace}(\mathsf{fields})))\ =\ \operatorname{FieldExprs}(\mathsf{fields}) \\[0.16em]
\operatorname{Children_LTR}(\operatorname{FieldAccess}(\mathsf{base},\ f))\ =\ [\mathsf{base}] \\[0.16em]
\operatorname{Children_LTR}(\operatorname{TupleAccess}(\mathsf{base},\ i))\ =\ [\mathsf{base}] \\[0.16em]
\operatorname{Children_LTR}(\operatorname{IndexAccess}(\mathsf{base},\ \mathsf{idx}))\ =\ [\mathsf{base},\ \mathsf{idx}] \\[0.16em]
\operatorname{Children_LTR}(\operatorname{Call}(\mathsf{callee},\ \mathsf{args}))\ =\ [\mathsf{callee}]\ \mathbin{++} \ \operatorname{ArgsExprs}(\mathsf{args}) \\[0.16em]
\operatorname{Children_LTR}(\operatorname{CallTypeArgs}(\mathsf{callee},\ \mathsf{type}_{\mathsf{args}},\ \mathsf{args}))\ =\ [\mathsf{callee}]\ \mathbin{++} \ \operatorname{ArgsExprs}(\mathsf{args}) \\[0.16em]
\operatorname{Children_LTR}(\operatorname{MethodCall}(\mathsf{base},\ \mathsf{name},\ \mathsf{args}))\ =\ [\mathsf{base}]\ \mathbin{++} \ \operatorname{ArgsExprs}(\mathsf{args}) \\[0.16em]
\operatorname{Children_LTR}(\operatorname{Unary}(\mathsf{op},\ e))\ =\ [e] \\[0.16em]
\operatorname{Children_LTR}(\operatorname{Binary}(\mathsf{op},\ e_{1},\ e_{2}))\ =\ [e_{1},\ e_{2}] \\[0.16em]
\operatorname{Children_LTR}(\operatorname{Cast}(e,\ T))\ =\ [e] \\[0.16em]
\operatorname{Children_LTR}(\operatorname{TransmuteExpr}(T_{1},\ T_{2},\ e))\ =\ [e] \\[0.16em]
\operatorname{Children_LTR}(\operatorname{Propagate}(e))\ =\ [e] \\[0.16em]
\operatorname{Children_LTR}(\operatorname{Range}(\mathsf{kind},\ \mathsf{lo}_{\mathsf{opt}},\ \mathsf{hi}_{\mathsf{opt}}))\ =\ \operatorname{OptExprs}(\mathsf{lo}_{\mathsf{opt}},\ \mathsf{hi}_{\mathsf{opt}}) \\[0.16em]
\operatorname{Children_LTR}(\operatorname{IfExpr}(\mathsf{cond},\ \mathsf{b1},\ \mathsf{b2}))\ =\ [\mathsf{cond}] \\[0.16em]
\operatorname{Children_LTR}(\operatorname{IfIsExpr}(\mathsf{scrut},\ \_,\ \_,\ \_))\ =\ [\mathsf{scrut}] \\[0.16em]
\operatorname{Children_LTR}(\operatorname{IfCaseExpr}(\mathsf{scrut},\ \_,\ \_))\ =\ [\mathsf{scrut}] \\[0.16em]
\operatorname{LoopInvExprs}(\bot )\ =\ [] \\[0.16em]
\operatorname{LoopInvExprs}(\mathsf{inv})\ =\ [\mathsf{inv}] \\[0.16em]
\operatorname{Children_LTR}(\operatorname{LoopInfinite}(\mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}))\ =\ \operatorname{LoopInvExprs}(\mathsf{inv}_{\mathsf{opt}})\ \mathbin{++} \ [\mathsf{body}] \\[0.16em]
\operatorname{Children_LTR}(\operatorname{LoopConditional}(\mathsf{cond},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}))\ =\ [\mathsf{cond}]\ \mathbin{++} \ \operatorname{LoopInvExprs}(\mathsf{inv}_{\mathsf{opt}})\ \mathbin{++} \ [\mathsf{body}] \\[0.16em]
\operatorname{Children_LTR}(\operatorname{LoopIter}(\mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{iter},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}))\ =\ [\mathsf{iter}]\ \mathbin{++} \ \operatorname{LoopInvExprs}(\mathsf{inv}_{\mathsf{opt}})\ \mathbin{++} \ [\mathsf{body}] \\[0.16em]
\operatorname{Children_LTR}(\operatorname{BlockExpr}(\mathsf{stmts},\ \mathsf{tail}_{\mathsf{opt}}))\ =\ [] \\[0.16em]
\operatorname{Children_LTR}(\operatorname{UnsafeBlockExpr}(b))\ =\ [] \\[0.16em]
\operatorname{Children_LTR}(\operatorname{MoveExpr}(p))\ =\ [] \\[0.16em]
\operatorname{Children_LTR}(\operatorname{AddressOf}(p))\ =\ [] \\[0.16em]
\operatorname{Children_LTR}(\operatorname{Deref}(e))\ =\ [e] \\[0.16em]
\operatorname{Children_LTR}(\operatorname{AllocExpr}(r_{\mathsf{opt}},\ e))\ =\ [e] \\[0.16em]
\operatorname{Children_LTR}(\operatorname{ParallelExpr}(\mathsf{domain},\ \mathsf{opts},\ \mathsf{body}))\ =\ [\mathsf{domain}]\ \mathbin{++} \ \operatorname{ParallelOptExprs}(\mathsf{opts}) \\[0.16em]
\operatorname{Children_LTR}(\operatorname{SpawnExpr}(\mathsf{opts},\ \mathsf{body}))\ =\ \operatorname{SpawnOptExprs}(\mathsf{opts}) \\[0.16em]
\operatorname{Children_LTR}(\operatorname{DispatchExpr}(\mathsf{pat},\ \mathsf{range},\ \mathsf{key}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{opts},\ \mathsf{body}))\ =\ [\mathsf{range}]\ \mathbin{++} \ \operatorname{KeyClauseExprs}(\mathsf{key}_{\mathsf{clause}\_\mathsf{opt}})\ \mathbin{++} \ \operatorname{DispatchOptExprs}(\mathsf{opts})
\end{array}
$$

$$
\mathsf{LowerExprJudg}\ =\ \{\mathsf{LowerExpr},\ \mathsf{LowerUnOp},\ \mathsf{LowerBinOp},\ \mathsf{LowerCast},\ \mathsf{LowerList},\ \mathsf{LowerFieldInits},\ \mathsf{LowerOpt},\ \mathsf{LowerReadPlace},\ \mathsf{LowerWritePlace},\ \mathsf{LowerMovePlace},\ \mathsf{LowerAddrOf},\ \mathsf{LowerPlace}\}
$$

$$
\operatorname{RetType}(\Gamma )\ =\ R\ \Leftrightarrow \ \operatorname{ProcRet}(\Gamma )\ =\ R
$$

**(Lower-Expr-Correctness)**

$$
\begin{array}{l}
\forall \ \sigma ,\ \Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\ \Rightarrow \ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle 
\end{array}
$$

$$
\begin{array}{l}
\mathsf{ExprForms0}\ =\ \{\operatorname{Literal}(\_),\ \mathsf{PtrNullExpr},\ \operatorname{Identifier}(\_),\ \operatorname{Path}(\_,\ \_),\ \operatorname{ErrorExpr}(\_),\ \operatorname{TupleExpr}(\_),\ \operatorname{ArrayExpr}(\_),\ \operatorname{RecordExpr}(\_,\ \_),\ \operatorname{EnumLiteral}(\_,\ \_),\ \operatorname{FieldAccess}(\_,\ \_),\ \operatorname{TupleAccess}(\_,\ \_),\ \operatorname{IndexAccess}(\_,\ \_),\ \operatorname{Call}(\_,\ \_),\ \operatorname{MethodCall}(\_,\ \_,\ \_),\ \operatorname{Unary}(\_,\ \_),\ \operatorname{Binary}(\_,\ \_,\ \_),\ \operatorname{Cast}(\_,\ \_),\ \operatorname{TransmuteExpr}(\_,\ \_,\ \_),\ \operatorname{Propagate}(\_),\ \operatorname{Range}(\_,\ \_,\ \_),\ \operatorname{IfExpr}(\_,\ \_,\ \_),\ \operatorname{IfIsExpr}(\_,\ \_,\ \_,\ \_),\ \operatorname{IfCaseExpr}(\_,\ \_,\ \_),\ \operatorname{LoopInfinite}(\_,\ \_),\ \operatorname{LoopConditional}(\_,\ \_,\ \_),\ \operatorname{LoopIter}(\_,\ \_,\ \_,\ \_,\ \_),\ \operatorname{BlockExpr}(\_,\ \_),\ \operatorname{UnsafeBlockExpr}(\_),\ \operatorname{MoveExpr}(\_),\ \operatorname{AddressOf}(\_),\ \operatorname{Deref}(\_),\ \operatorname{AllocExpr}(\_,\ \_)\} \\[0.16em]
\operatorname{LowerExprTotal}(\Gamma )\ \Leftrightarrow \ \forall \ e.\ e\ \in \ \mathsf{ExprForms0}\ \Rightarrow \ \exists \ \mathsf{IR},\ v.\ \Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle 
\end{array}
$$

$$
\mathsf{ExecIRJudg}\ =\ \{\mathsf{ExecIRSigma},\ \mathsf{MoveStateSigma}\}
$$

**(ExecIR-ReadVar)**

$$
\begin{array}{l}
\operatorname{LookupVal}(\sigma ,\ x)\ =\ v \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ExecIRSigma}(\operatorname{ReadVarIR}(x),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma )
\end{array}
$$

**(ExecIR-ReadPath)**

$$
\begin{array}{l}
\operatorname{LookupValPath}(\sigma ,\ \mathsf{path},\ \mathsf{name})\ =\ v \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ExecIRSigma}(\operatorname{ReadPathIR}(\mathsf{path},\ \mathsf{name}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma )
\end{array}
$$

**(ExecIR-StoreVar)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{WritePlaceSigma}(\operatorname{Identifier}(x),\ v,\ \sigma )\ \Downarrow \ (\mathsf{sout},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ExecIRSigma}(\operatorname{StoreVarIR}(x,\ v),\ \sigma )\ \Downarrow \ (\mathsf{sout},\ \sigma ')
\end{array}
$$

**(ExecIR-StoreVarNoDrop)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{WritePlaceSubSigma}(\operatorname{Identifier}(x),\ v,\ \sigma )\ \Downarrow \ (\mathsf{sout},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ExecIRSigma}(\operatorname{StoreVarNoDropIR}(x,\ v),\ \sigma )\ \Downarrow \ (\mathsf{sout},\ \sigma ')
\end{array}
$$

**(ExecIR-BindVar)**

$$
\begin{array}{l}
\operatorname{BindVal}(\sigma ,\ x,\ v)\ \Downarrow \ (\sigma ',\ b) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ExecIRSigma}(\operatorname{BindVarIR}(x,\ v),\ \sigma )\ \Downarrow \ (\mathsf{ok},\ \sigma ')
\end{array}
$$

**(ExecIR-ReadPtr)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ReadPtrSigma}(v_{\mathsf{ptr}},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ExecIRSigma}(\operatorname{ReadPtrIR}(v_{\mathsf{ptr}}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')
\end{array}
$$

**(ExecIR-WritePtr)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{WritePtrSigma}(v_{\mathsf{ptr}},\ v,\ \sigma )\ \Downarrow \ (\mathsf{sout},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ExecIRSigma}(\operatorname{WritePtrIR}(v_{\mathsf{ptr}},\ v),\ \sigma )\ \Downarrow \ (\mathsf{sout},\ \sigma ')
\end{array}
$$

$$
\begin{array}{l}
\operatorname{AllocTarget}(\sigma ,\ \bot )\ =\ \operatorname{ActiveTarget}(\sigma ) \\[0.16em]
\operatorname{AllocTarget}(\sigma ,\ r)\ =\ \operatorname{ResolveTarget}(\sigma ,\ r)
\end{array}
$$

**(ExecIR-Alloc)**

$$
\begin{array}{l}
\operatorname{AllocTarget}(\sigma ,\ r_{\mathsf{opt}})\ =\ r\quad \operatorname{RegionAlloc}(\sigma ,\ r,\ v)\ \Downarrow \ (\sigma ',\ v') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ExecIRSigma}(\operatorname{AllocIR}(r_{\mathsf{opt}},\ v),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma ')
\end{array}
$$

**(MoveState-Root)**

$$
\begin{array}{l}
\operatorname{PlaceRoot}(p)\ =\ x\quad \operatorname{FieldHead}(p)\ =\ \bot \quad \operatorname{LookupBind}(\sigma ,\ x)\ =\ b\quad \operatorname{SetState}(\sigma ,\ b,\ \mathsf{Moved})\ \Downarrow \ \sigma ' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MoveStateSigma}(p,\ \sigma )\ \Downarrow \ \sigma '
\end{array}
$$

**(MoveState-Field)**

$$
\begin{array}{l}
\operatorname{PlaceRoot}(p)\ =\ x\quad \operatorname{FieldHead}(p)\ =\ f\quad \operatorname{LookupBind}(\sigma ,\ x)\ =\ b\quad \operatorname{BindState}(\sigma ,\ b)\ =\ s\quad \operatorname{PM}(s,\ f)\ =\ s'\quad \operatorname{SetState}(\sigma ,\ b,\ s')\ \Downarrow \ \sigma ' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MoveStateSigma}(p,\ \sigma )\ \Downarrow \ \sigma '
\end{array}
$$

**(ExecIR-MoveState)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MoveStateSigma}(p,\ \sigma )\ \Downarrow \ \sigma ' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ExecIRSigma}(\operatorname{MoveStateIR}(p),\ \sigma )\ \Downarrow \ (\mathsf{ok},\ \sigma ')
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ExecIRSigma}(\operatorname{ReturnIR}(v),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{Return}(v)),\ \sigma ) \\[0.16em]
\operatorname{ExecIRSigma}(\operatorname{TailValueIR}(v),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{TailValue}(v)),\ \sigma ) \\[0.16em]
\operatorname{ExecIRSigma}(\operatorname{BreakIR}(v_{\mathsf{opt}}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{Break}(v_{\mathsf{opt}})),\ \sigma ) \\[0.16em]
\operatorname{ExecIRSigma}(\mathsf{ContinueIR},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Continue}),\ \sigma )
\end{array}
$$

**(ExecIR-Defer)**

$$
\begin{array}{l}
\operatorname{AppendCleanup}(\sigma ,\ \operatorname{DeferBlock}(b))\ \Downarrow \ \sigma ' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ExecIRSigma}(\operatorname{DeferIR}(b),\ \sigma )\ \Downarrow \ (\mathsf{ok},\ \sigma ')
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ExecBlockBodyIRSigma}(\mathsf{IR}_{s},\ \mathsf{IR}_{t},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\ \Leftrightarrow \ \operatorname{ExecIRSigma}(\mathsf{IR}_{s},\ \sigma )\ \Downarrow \ (\mathsf{sout},\ \sigma_{1} )\ \land \ ((\mathsf{sout}\ =\ \mathsf{ok}\ \land \ \mathsf{IR}_{t}\ =\ \varepsilon \ \land \ \mathsf{out}\ =\ \operatorname{Val}(())\ \land \ \sigma '\ =\ \sigma_{1} )\ \lor \ (\mathsf{sout}\ =\ \mathsf{ok}\ \land \ \operatorname{ExecIRSigma}(\mathsf{IR}_{t},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma '))\ \lor \ (\mathsf{sout}\ =\ \operatorname{Ctrl}(\operatorname{TailValue}(v))\ \land \ \mathsf{out}\ =\ \operatorname{Val}(v)\ \land \ \sigma '\ =\ \sigma_{1} )\ \lor \ (\mathsf{sout}\ =\ \operatorname{Ctrl}(\kappa )\ \land \ \kappa \ \ne \ \operatorname{TailValue}(\_)\ \land \ \mathsf{out}\ =\ \operatorname{Ctrl}(\kappa )\ \land \ \sigma '\ =\ \sigma_{1} )) \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecInScopeIRSigma}(\mathsf{IR}_{b},\ \sigma ,\ \mathsf{scope})\ \Downarrow \ (\mathsf{out},\ \sigma ')\ \Leftrightarrow \ \operatorname{CurrentScopeId}(\sigma )\ =\ \mathsf{scope}\ \land \ \operatorname{ExecIRSigma}(\mathsf{IR}_{b},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecBlockBindIRSigma}(\mathsf{pat},\ v,\ \mathsf{IR}_{b},\ \sigma )\ \Downarrow \ (\mathsf{out}',\ \sigma '')\ \Leftrightarrow \ \operatorname{BindPatternVal}(\mathsf{pat},\ v)\ \Downarrow \ B\ \land \ \operatorname{BindOrder}(\mathsf{pat},\ B)\ =\ \mathsf{binds}\ \land \ \operatorname{BlockEnter}(\sigma ,\ \mathsf{binds})\ \Downarrow \ (\sigma_{1} ,\ \mathsf{scope})\ \land \ \operatorname{ExecIRSigma}(\mathsf{IR}_{b},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )\ \land \ \operatorname{BlockExit}(\sigma_{2} ,\ \mathsf{scope},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma '')
\end{array}
$$

**(ExecIR-If-True)**

$$
\begin{array}{l}
v_{c}\ =\ \mathsf{true}\quad \operatorname{ExecIRSigma}(\mathsf{IR}_{t},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ExecIRSigma}(\operatorname{IfIR}(v_{c},\ \mathsf{IR}_{t},\ v_{t},\ \mathsf{IR}_{f},\ v_{f}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')
\end{array}
$$

**(ExecIR-If-False)**

$$
\begin{array}{l}
v_{c}\ =\ \mathsf{false}\quad \operatorname{ExecIRSigma}(\mathsf{IR}_{f},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ExecIRSigma}(\operatorname{IfIR}(v_{c},\ \mathsf{IR}_{t},\ v_{t},\ \mathsf{IR}_{f},\ v_{f}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')
\end{array}
$$

**(ExecIR-Block)**

$$
\begin{array}{l}
\operatorname{BlockEnter}(\sigma ,\ [])\ \Downarrow \ (\sigma_{1} ,\ \mathsf{scope})\quad \operatorname{ExecBlockBodyIRSigma}(\mathsf{IR}_{s},\ \mathsf{IR}_{t},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )\quad \operatorname{BlockExit}(\sigma_{2} ,\ \mathsf{scope},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ExecIRSigma}(\operatorname{BlockIR}(\mathsf{IR}_{s},\ \mathsf{IR}_{t},\ v_{t}),\ \sigma )\ \Downarrow \ (\mathsf{out}',\ \sigma_{3} )
\end{array}
$$

**(ExecIR-IfCase)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalIfCaseListSigma}(\mathsf{cases},\ \mathsf{else}_{\mathsf{opt}},\ v_{s},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ExecIRSigma}(\operatorname{IfCaseIR}(v_{s},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')
\end{array}
$$

**(ExecIR-Loop-Infinite-Step)**

$$
\begin{array}{l}
\operatorname{ExecIRSigma}(\mathsf{IR}_{b},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad \operatorname{ExecIRSigma}(\operatorname{LoopIR}(\mathsf{LoopInfinite},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ExecIRSigma}(\operatorname{LoopIR}(\mathsf{LoopInfinite},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

**(ExecIR-Loop-Infinite-Continue)**

$$
\begin{array}{l}
\operatorname{ExecIRSigma}(\mathsf{IR}_{b},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Continue}),\ \sigma_{1} )\quad \operatorname{ExecIRSigma}(\operatorname{LoopIR}(\mathsf{LoopInfinite},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ExecIRSigma}(\operatorname{LoopIR}(\mathsf{LoopInfinite},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

**(ExecIR-Loop-Infinite-Break)**

$$
\begin{array}{l}
\operatorname{ExecIRSigma}(\mathsf{IR}_{b},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{Break}(v_{\mathsf{opt}})),\ \sigma_{1} )\quad v\ =\ \operatorname{BreakVal}(v_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ExecIRSigma}(\operatorname{LoopIR}(\mathsf{LoopInfinite},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )
\end{array}
$$

**(ExecIR-Loop-Infinite-Ctrl)**

$$
\begin{array}{l}
\operatorname{ExecIRSigma}(\mathsf{IR}_{b},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )\quad \kappa \ \in \ \{\operatorname{Return}(\_),\ \mathsf{Panic},\ \mathsf{Abort}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ExecIRSigma}(\operatorname{LoopIR}(\mathsf{LoopInfinite},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(ExecIR-Loop-Cond-False)**

$$
\begin{array}{l}
\operatorname{ExecIRSigma}(\mathsf{IR}_{c},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{false}),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ExecIRSigma}(\operatorname{LoopIR}(\mathsf{LoopConditional},\ \mathsf{IR}_{c},\ v_{c},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(()),\ \sigma_{1} )
\end{array}
$$

**(ExecIR-Loop-Cond-True-Step)**

$$
\begin{array}{l}
\operatorname{ExecIRSigma}(\mathsf{IR}_{c},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{true}),\ \sigma_{1} )\quad \operatorname{ExecIRSigma}(\mathsf{IR}_{b},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{2} )\quad \operatorname{ExecIRSigma}(\operatorname{LoopIR}(\mathsf{LoopConditional},\ \mathsf{IR}_{c},\ v_{c},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma_{2} )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ExecIRSigma}(\operatorname{LoopIR}(\mathsf{LoopConditional},\ \mathsf{IR}_{c},\ v_{c},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} )
\end{array}
$$

**(ExecIR-Loop-Cond-Continue)**

$$
\begin{array}{l}
\operatorname{ExecIRSigma}(\mathsf{IR}_{c},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{true}),\ \sigma_{1} )\quad \operatorname{ExecIRSigma}(\mathsf{IR}_{b},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Continue}),\ \sigma_{2} )\quad \operatorname{ExecIRSigma}(\operatorname{LoopIR}(\mathsf{LoopConditional},\ \mathsf{IR}_{c},\ v_{c},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma_{2} )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ExecIRSigma}(\operatorname{LoopIR}(\mathsf{LoopConditional},\ \mathsf{IR}_{c},\ v_{c},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} )
\end{array}
$$

**(ExecIR-Loop-Cond-Break)**

$$
\begin{array}{l}
\operatorname{ExecIRSigma}(\mathsf{IR}_{c},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{true}),\ \sigma_{1} )\quad \operatorname{ExecIRSigma}(\mathsf{IR}_{b},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{Break}(v_{\mathsf{opt}})),\ \sigma_{2} )\quad v\ =\ \operatorname{BreakVal}(v_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ExecIRSigma}(\operatorname{LoopIR}(\mathsf{LoopConditional},\ \mathsf{IR}_{c},\ v_{c},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{2} )
\end{array}
$$

**(ExecIR-Loop-Cond-Ctrl)**

$$
\begin{array}{l}
\operatorname{ExecIRSigma}(\mathsf{IR}_{c},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ExecIRSigma}(\operatorname{LoopIR}(\mathsf{LoopConditional},\ \mathsf{IR}_{c},\ v_{c},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(ExecIR-Loop-Cond-Body-Ctrl)**

$$
\begin{array}{l}
\operatorname{ExecIRSigma}(\mathsf{IR}_{c},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{true}),\ \sigma_{1} )\quad \operatorname{ExecIRSigma}(\mathsf{IR}_{b},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} )\quad \kappa \ \in \ \{\operatorname{Return}(\_),\ \mathsf{Panic},\ \mathsf{Abort}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ExecIRSigma}(\operatorname{LoopIR}(\mathsf{LoopConditional},\ \mathsf{IR}_{c},\ v_{c},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} )
\end{array}
$$

$$
\mathsf{LoopIterIRJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{LoopIterExecIRSigma}(\mathsf{pat},\ \mathsf{IR}_{b},\ \mathsf{it},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\}
$$

**(ExecIR-Loop-Iter)**

$$
\begin{array}{l}
\operatorname{ExecIRSigma}(\mathsf{IR}_{i},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{iter}}),\ \sigma_{1} )\quad \operatorname{IterInit}(v_{\mathsf{iter}})\ \Downarrow \ \mathsf{it}\quad \Gamma \ \vdash \ \operatorname{LoopIterExecIRSigma}(\mathsf{pat},\ \mathsf{IR}_{b},\ \mathsf{it},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ExecIRSigma}(\operatorname{LoopIR}(\mathsf{LoopIter},\ \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{IR}_{i},\ v_{\mathsf{iter}},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

**(ExecIR-Loop-Iter-Ctrl)**

$$
\begin{array}{l}
\operatorname{ExecIRSigma}(\mathsf{IR}_{i},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ExecIRSigma}(\operatorname{LoopIR}(\mathsf{LoopIter},\ \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{IR}_{i},\ v_{\mathsf{iter}},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(LoopIterIR-Done)**

$$
\begin{array}{l}
\operatorname{IterNext}(\mathsf{it})\ \Downarrow \ (\bot ,\ \mathsf{it}') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LoopIterExecIRSigma}(\mathsf{pat},\ \mathsf{IR}_{b},\ \mathsf{it},\ \sigma )\ \Downarrow \ (\operatorname{Val}(()),\ \sigma )
\end{array}
$$

**(LoopIterIR-Step-Val)**

$$
\begin{array}{l}
\operatorname{IterNext}(\mathsf{it})\ \Downarrow \ (v,\ \mathsf{it}')\quad \Gamma \ \vdash \ \operatorname{ExecBlockBindIRSigma}(\mathsf{pat},\ v,\ \mathsf{IR}_{b},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{b}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{LoopIterExecIRSigma}(\mathsf{pat},\ \mathsf{IR}_{b},\ \mathsf{it}',\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LoopIterExecIRSigma}(\mathsf{pat},\ \mathsf{IR}_{b},\ \mathsf{it},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

**(LoopIterIR-Step-Continue)**

$$
\begin{array}{l}
\operatorname{IterNext}(\mathsf{it})\ \Downarrow \ (v,\ \mathsf{it}')\quad \Gamma \ \vdash \ \operatorname{ExecBlockBindIRSigma}(\mathsf{pat},\ v,\ \mathsf{IR}_{b},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Continue}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{LoopIterExecIRSigma}(\mathsf{pat},\ \mathsf{IR}_{b},\ \mathsf{it}',\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LoopIterExecIRSigma}(\mathsf{pat},\ \mathsf{IR}_{b},\ \mathsf{it},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

**(LoopIterIR-Step-Break)**

$$
\begin{array}{l}
\operatorname{IterNext}(\mathsf{it})\ \Downarrow \ (v,\ \mathsf{it}')\quad \Gamma \ \vdash \ \operatorname{ExecBlockBindIRSigma}(\mathsf{pat},\ v,\ \mathsf{IR}_{b},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{Break}(v_{\mathsf{opt}})),\ \sigma_{1} )\quad v'\ =\ \operatorname{BreakVal}(v_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LoopIterExecIRSigma}(\mathsf{pat},\ \mathsf{IR}_{b},\ \mathsf{it},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma_{1} )
\end{array}
$$

**(LoopIterIR-Step-Ctrl)**

$$
\begin{array}{l}
\operatorname{IterNext}(\mathsf{it})\ \Downarrow \ (v,\ \mathsf{it}')\quad \Gamma \ \vdash \ \operatorname{ExecBlockBindIRSigma}(\mathsf{pat},\ v,\ \mathsf{IR}_{b},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )\quad \kappa \ \in \ \{\operatorname{Return}(\_),\ \mathsf{Panic},\ \mathsf{Abort}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LoopIterExecIRSigma}(\mathsf{pat},\ \mathsf{IR}_{b},\ \mathsf{it},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(ExecIR-Region)**

$$
\begin{array}{l}
\operatorname{RegionNew}(\sigma ,\ v_{o})\ \Downarrow \ (\sigma_{1} ,\ r,\ \mathsf{scope})\quad \operatorname{BindRegionAlias}(\sigma_{1} ,\ \mathsf{alias}_{\mathsf{opt}},\ r)\ \Downarrow \ \sigma_{2} \quad \Gamma \ \vdash \ \operatorname{ExecInScopeIRSigma}(\mathsf{IR}_{b},\ \sigma_{2} ,\ \mathsf{scope})\ \Downarrow \ (\mathsf{out},\ \sigma_{3} )\quad \operatorname{RegionRelease}(\sigma_{3} ,\ r,\ \mathsf{scope},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma_{4} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ExecIRSigma}(\operatorname{RegionIR}(v_{o},\ \mathsf{alias}_{\mathsf{opt}},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma )\ \Downarrow \ (\operatorname{StmtOutOf}(\mathsf{out}'),\ \sigma_{4} )
\end{array}
$$

**(ExecIR-Frame-Implicit)**

$$
\begin{array}{l}
\operatorname{ActiveTarget}(\sigma )\ =\ r\quad \operatorname{FrameEnter}(\sigma ,\ r)\ \Downarrow \ (\sigma_{1} ,\ F,\ \mathsf{scope},\ \mathsf{mark})\quad \Gamma \ \vdash \ \operatorname{ExecInScopeIRSigma}(\mathsf{IR}_{b},\ \sigma_{1} ,\ \mathsf{scope})\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )\quad \operatorname{FrameReset}(\sigma_{2} ,\ r,\ \mathsf{scope},\ \mathsf{mark},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ExecIRSigma}(\operatorname{FrameIR}(\bot ,\ \mathsf{IR}_{b},\ v_{b}),\ \sigma )\ \Downarrow \ (\operatorname{StmtOutOf}(\mathsf{out}'),\ \sigma_{3} )
\end{array}
$$

**(ExecIR-Frame-Explicit)**

$$
\begin{array}{l}
\operatorname{RegionHandleOf}(v_{r})\ =\ h\quad \operatorname{ResolveTarget}(\sigma ,\ h)\ =\ r_{t}\quad \operatorname{FrameEnter}(\sigma ,\ r_{t})\ \Downarrow \ (\sigma_{1} ,\ F,\ \mathsf{scope},\ \mathsf{mark})\quad \Gamma \ \vdash \ \operatorname{ExecInScopeIRSigma}(\mathsf{IR}_{b},\ \sigma_{1} ,\ \mathsf{scope})\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )\quad \operatorname{FrameReset}(\sigma_{2} ,\ r_{t},\ \mathsf{scope},\ \mathsf{mark},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ExecIRSigma}(\operatorname{FrameIR}(v_{r},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma )\ \Downarrow \ (\operatorname{StmtOutOf}(\mathsf{out}'),\ \sigma_{3} )
\end{array}
$$

**(LowerList-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerList}([])\ \Downarrow \ \langle \varepsilon ,\ []\rangle 
\end{array}
$$

**(LowerList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle \quad \Gamma \ \vdash \ \operatorname{LowerList}(\mathsf{es})\ \Downarrow \ \langle \mathsf{IR}_{s},\ \mathsf{vec}_{v}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerList}(e\mathbin{::} \mathsf{es})\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{e},\ \mathsf{IR}_{s}),\ [v]\ \mathbin{++} \ \mathsf{vec}_{v}\rangle 
\end{array}
$$

**(LowerFieldInits-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerFieldInits}([])\ \Downarrow \ \langle \varepsilon ,\ []\rangle 
\end{array}
$$

**(LowerFieldInits-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle \quad \Gamma \ \vdash \ \operatorname{LowerFieldInits}(\mathsf{io})\ \Downarrow \ \langle \mathsf{IR}_{s},\ \mathsf{vec}_{f}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerFieldInits}([\langle f,\ e\rangle ]\ \mathbin{++} \ \mathsf{io})\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{e},\ \mathsf{IR}_{s}),\ [\langle f,\ v\rangle ]\ \mathbin{++} \ \mathsf{vec}_{f}\rangle 
\end{array}
$$

**(LowerOpt-None)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerOpt}(\bot )\ \Downarrow \ \langle \varepsilon ,\ \bot \rangle 
\end{array}
$$

**(LowerOpt-Some)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerOpt}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle 
\end{array}
$$

$$
\begin{array}{l}
\mathsf{RefSyms}\ :\ \mathsf{IR}\ \to \ \mathcal{P} (\mathsf{Symbol}) \\[0.16em]
\operatorname{RefSyms}([])\ =\ \emptyset  \\[0.16em]
\operatorname{RefSyms}([d]\ \mathbin{++} \ \mathsf{ds})\ =\ \operatorname{RefSyms}(d)\ \cup \ \operatorname{RefSyms}(\mathsf{ds}) \\[0.16em]
\operatorname{RefSyms}(\operatorname{ProcIR}(\_,\ \_,\ \_,\ \mathsf{IR}))\ =\ \operatorname{RefSyms}(\mathsf{IR}) \\[0.16em]
\operatorname{RefSyms}(\operatorname{GlobalConst}(\_,\ \_))\ =\ \emptyset  \\[0.16em]
\operatorname{RefSyms}(\operatorname{GlobalZero}(\_,\ \_))\ =\ \emptyset  \\[0.16em]
\operatorname{RefSyms}(\operatorname{GlobalVTable}(\_,\ \mathsf{header},\ \mathsf{slots}))\ =\ \{\ s\ \mid \ s\ \in \ \mathsf{header}\ \land \ s\ \in \ \mathsf{Symbol}\ \}\ \cup \ \{\ s\ \mid \ s\ \in \ \mathsf{slots}\ \land \ s\ \in \ \mathsf{Symbol}\ \} \\[0.16em]
\operatorname{RefSyms}(\operatorname{EmitVTable}(T,\ \mathsf{Cl}))\ =\ \operatorname{RefSyms}(d)\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{EmitVTable}(T,\ \mathsf{Cl})\ \Downarrow \ d \\[0.16em]
\operatorname{RefSyms}(\operatorname{EmitDropGlue}(T))\ =\ \operatorname{RefSyms}(\mathsf{IR})\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{DropGlueIR}(T)\ \Downarrow \ \mathsf{IR} \\[0.16em]
\operatorname{RefSyms}(\operatorname{EmitLiteralData}(\_,\ \_))\ =\ \emptyset  \\[0.16em]
\operatorname{RefSyms}(\varepsilon )\ =\ \emptyset  \\[0.16em]
\operatorname{RefSyms}(\operatorname{SeqIR}(\mathsf{IR}_{1},\ \mathsf{IR}_{2}))\ =\ \operatorname{RefSyms}(\mathsf{IR}_{1})\ \cup \ \operatorname{RefSyms}(\mathsf{IR}_{2}) \\[0.16em]
\operatorname{RefSyms}(\operatorname{ReadVarIR}(\_))\ =\ \emptyset  \\[0.16em]
\operatorname{RefSyms}(\operatorname{StoreVarIR}(\_,\ \_))\ =\ \emptyset  \\[0.16em]
\operatorname{RefSyms}(\operatorname{StoreVarNoDropIR}(\_,\ \_))\ =\ \emptyset  \\[0.16em]
\operatorname{RefSyms}(\operatorname{BindVarIR}(\_,\ \_))\ =\ \emptyset  \\[0.16em]
\operatorname{RefSyms}(\operatorname{ReadPtrIR}(\_))\ =\ \emptyset  \\[0.16em]
\operatorname{RefSyms}(\operatorname{WritePtrIR}(\_,\ \_))\ =\ \emptyset  \\[0.16em]
\operatorname{RefSyms}(\operatorname{AllocIR}(\_,\ \_))\ =\ \emptyset  \\[0.16em]
\operatorname{RefSyms}(\operatorname{MoveStateIR}(\_))\ =\ \emptyset  \\[0.16em]
\operatorname{RefSyms}(\operatorname{ReturnIR}(\_))\ =\ \emptyset  \\[0.16em]
\operatorname{RefSyms}(\operatorname{TailValueIR}(\_))\ =\ \emptyset  \\[0.16em]
\operatorname{RefSyms}(\operatorname{BreakIR}(\_))\ =\ \emptyset  \\[0.16em]
\operatorname{RefSyms}(\mathsf{ContinueIR})\ =\ \emptyset  \\[0.16em]
\operatorname{RefSyms}(\operatorname{DeferIR}(\_))\ =\ \emptyset  \\[0.16em]
\operatorname{RefSyms}(\operatorname{ReadPathIR}(\mathsf{path},\ \mathsf{name}))\ =\ \{\operatorname{PathSym}(\mathsf{path},\ \mathsf{name})\}\ \cup \ \{\ \mathsf{sym}\ \mid \ \operatorname{StaticSymPath}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{sym}\ \} \\[0.16em]
\operatorname{RefSyms}(\operatorname{StoreGlobal}(\mathsf{sym},\ \_))\ =\ \{\mathsf{sym}\} \\[0.16em]
\operatorname{RefSyms}(\operatorname{CallIR}(\mathsf{callee},\ \_))\ =\ \{\ \mathsf{callee}\ \mid \ \mathsf{callee}\ \in \ \mathsf{Symbol}\ \} \\[0.16em]
\operatorname{RefSyms}(\operatorname{IfIR}(\_,\ \mathsf{IR}_{t},\ \_,\ \mathsf{IR}_{f},\ \_))\ =\ \operatorname{RefSyms}(\mathsf{IR}_{t})\ \cup \ \operatorname{RefSyms}(\mathsf{IR}_{f}) \\[0.16em]
\operatorname{RefSyms}(\operatorname{BlockIR}(\mathsf{IR}_{s},\ \mathsf{IR}_{t},\ \_))\ =\ \operatorname{RefSyms}(\mathsf{IR}_{s})\ \cup \ \operatorname{RefSyms}(\mathsf{IR}_{t}) \\[0.16em]
\operatorname{RefSyms}(\operatorname{IfCaseIR}(\_,\ \_,\ \_))\ =\ \emptyset  \\[0.16em]
\operatorname{RefSyms}(\operatorname{LoopIR}(\mathsf{LoopInfinite},\ \mathsf{IR}_{b},\ \_))\ =\ \operatorname{RefSyms}(\mathsf{IR}_{b}) \\[0.16em]
\operatorname{RefSyms}(\operatorname{LoopIR}(\mathsf{LoopConditional},\ \mathsf{IR}_{c},\ \_,\ \mathsf{IR}_{b},\ \_))\ =\ \operatorname{RefSyms}(\mathsf{IR}_{c})\ \cup \ \operatorname{RefSyms}(\mathsf{IR}_{b}) \\[0.16em]
\operatorname{RefSyms}(\operatorname{LoopIR}(\mathsf{LoopIter},\ \_,\ \_,\ \mathsf{IR}_{i},\ \_,\ \mathsf{IR}_{b},\ \_))\ =\ \operatorname{RefSyms}(\mathsf{IR}_{i})\ \cup \ \operatorname{RefSyms}(\mathsf{IR}_{b}) \\[0.16em]
\operatorname{RefSyms}(\operatorname{RegionIR}(\_,\ \_,\ \mathsf{IR}_{b},\ \_))\ =\ \operatorname{RefSyms}(\mathsf{IR}_{b}) \\[0.16em]
\operatorname{RefSyms}(\operatorname{FrameIR}(\_,\ \mathsf{IR}_{b},\ \_))\ =\ \operatorname{RefSyms}(\mathsf{IR}_{b}) \\[0.16em]
\operatorname{RefSyms}(\operatorname{BranchIR}(\_))\ =\ \emptyset  \\[0.16em]
\operatorname{RefSyms}(\operatorname{BranchIR}(\_,\ \_,\ \_))\ =\ \emptyset  \\[0.16em]
\operatorname{RefSyms}(\operatorname{PhiIR}(\_,\ \_,\ \_))\ =\ \emptyset  \\[0.16em]
\operatorname{RefSyms}(\operatorname{CallVTable}(\_,\ \_,\ \_))\ =\ \emptyset  \\[0.16em]
\operatorname{RefSyms}(\operatorname{AddrOfIR}(p))\ =\ \operatorname{RefSyms}(\mathsf{IR}_{p})\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{LowerAddrOf}(p)\ \Downarrow \ \langle \mathsf{IR}_{p},\ \mathsf{addr}\rangle  \\[0.16em]
\operatorname{RefSyms}(\mathsf{ClearPanic})\ =\ \operatorname{RefSyms}(\mathsf{IR})\ \Leftrightarrow \ \Gamma \ \vdash \ \mathsf{ClearPanic}\ \Downarrow \ \mathsf{IR} \\[0.16em]
\operatorname{RefSyms}(\mathsf{PanicCheck})\ =\ \operatorname{RefSyms}(\mathsf{IR})\ \Leftrightarrow \ \Gamma \ \vdash \ \mathsf{PanicCheck}\ \Downarrow \ \mathsf{IR} \\[0.16em]
\operatorname{RefSyms}(\operatorname{CheckPoison}(m))\ =\ \operatorname{RefSyms}(\mathsf{IR})\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{CheckPoison}(m)\ \Downarrow \ \mathsf{IR} \\[0.16em]
\operatorname{RefSyms}(\operatorname{LowerPanic}(r))\ =\ \operatorname{RefSyms}(\mathsf{IR})\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{LowerPanic}(r)\ \Downarrow \ \mathsf{IR}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{RuntimeRefs}(\mathsf{IR})\ =\ \operatorname{RefSyms}(\mathsf{IR})\ \cap \ \mathsf{RuntimeSyms} \\[0.16em]
\operatorname{LiteralRef}(\mathsf{IR},\ \mathsf{kind},\ \mathsf{bytes})\ \Leftrightarrow \ \operatorname{LiteralDataSym}(\mathsf{kind},\ \mathsf{bytes})\ \in \ \operatorname{RefSyms}(\mathsf{IR}) \\[0.16em]
\operatorname{LiteralRefs}(\mathsf{IR})\ =\ \{\langle \mathsf{kind},\ \mathsf{bytes}\rangle \ \mid \ \operatorname{LiteralRef}(\mathsf{IR},\ \mathsf{kind},\ \mathsf{bytes})\} \\[0.16em]
\operatorname{VTableRefs}(\mathsf{IR})\ =\ \{(T,\ \mathsf{Cl})\ \mid \ \operatorname{DynPack}(T,\ \_)\ \in \ \mathsf{IR}\ \lor \ \operatorname{CallVTable}(\_,\ \_,\ \_)\ \in \ \mathsf{IR}\}
\end{array}
$$

$$
\operatorname{ExpandIR}(\mathsf{IR})\ =\ \mathsf{IR}\ \mathbin{++} \ ((\mathbin{++} \_\{(T,\ \mathsf{Cl})\ \in \ \operatorname{VTableRefs}(\mathsf{IR})\}\ [\operatorname{EmitDropGlue}(T),\ \operatorname{EmitVTable}(T,\ \mathsf{Cl})]))\ \mathbin{++} \ ((\mathbin{++} \_\{\langle \mathsf{kind},\ \mathsf{bytes}\rangle \ \in \ \operatorname{LiteralRefs}(\mathsf{IR})\}\ [\operatorname{EmitLiteralData}(\mathsf{kind},\ \mathsf{bytes})]))
$$

$$
\begin{array}{l}
\operatorname{EmitKey}(d)\ = \\[0.16em]
\ \langle \texttt{vtable},\ T,\ \mathsf{Cl}\rangle \quad \mathsf{if}\ d\ =\ \operatorname{EmitVTable}(T,\ \mathsf{Cl}) \\[0.16em]
\ \langle \texttt{drop},\ T\rangle \quad \mathsf{if}\ d\ =\ \operatorname{EmitDropGlue}(T) \\[0.16em]
\ \langle \texttt{lit},\ \mathsf{kind},\ \mathsf{bytes}\rangle \ \mathsf{if}\ d\ =\ \operatorname{EmitLiteralData}(\mathsf{kind},\ \mathsf{bytes}) \\[0.16em]
\ \bot \quad \mathsf{otherwise}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{EmitKeys}(\mathsf{IR})\ =\ [\operatorname{EmitKey}(d)\ \mid \ d\ \in \ \mathsf{IR}\ \land \ \operatorname{EmitKey}(d)\ \ne \ \bot ] \\[0.16em]
\operatorname{UniqueEmits}(\mathsf{IR})\ \Leftrightarrow \ \operatorname{NoDup}(\operatorname{EmitKeys}(\mathsf{IR}))
\end{array}
$$

### 24.1.4 Project and Module Composition

$$
\operatorname{Items}(P,\ m)\ =\ \operatorname{ASTModule}(P,\ m).\mathsf{items}
$$

**(CG-Project)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{OutputPipeline}(P)\ \Downarrow \ (\mathsf{Objs},\ \mathsf{IRs},\ \mathsf{Artifact}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CodegenProject}(P)\ \Downarrow \ (\operatorname{Set}(\mathsf{Objs})\ \cup \ \operatorname{Set}(\mathsf{IRs})\ \cup \ (\{\mathsf{Artifact}\}\ \mathsf{if}\ \mathsf{Artifact}\ \ne \ \bot \ \mathsf{else}\ \emptyset ))
\end{array}
$$

Feature-local `CodegenItem` rules are defined by the owning feature sections. This section introduces no additional item-specific lowering rules.

**(CG-Module)**

$$
\begin{array}{l}
\operatorname{Items}(\operatorname{Project}(\Gamma ),\ m)\ =\ [i_{1},\ \ldots ,\ i_{k}]\quad \forall \ j,\ \Gamma \ \vdash \ \operatorname{CodegenItem}(i_{j})\ \Downarrow \ \mathsf{ds}_{j}\quad \Gamma \ \vdash \ \operatorname{InitFn}(m)\ \Downarrow \ \mathsf{sym}_{\mathsf{init}}\quad \Gamma \ \vdash \ \operatorname{DeinitFn}(m)\ \Downarrow \ \mathsf{sym}_{\mathsf{deinit}}\quad \Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticInit}(m)\ \Downarrow \ \mathsf{IR}_{\mathsf{init}}\quad \Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinit}(m)\ \Downarrow \ \mathsf{IR}_{\mathsf{deinit}} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CodegenModule}(m)\ \Downarrow \ \mathsf{ds}_{1}\ \mathbin{++} \ \ldots \ \mathbin{++} \ \mathsf{ds}_{k}\ \mathbin{++} \ [\operatorname{ProcIR}(\mathsf{sym}_{\mathsf{init}},\ [\mathsf{PanicOutParam}],\ \operatorname{TypePrim}(\texttt{"()"}),\ \mathsf{IR}_{\mathsf{init}}),\ \operatorname{ProcIR}(\mathsf{sym}_{\mathsf{deinit}},\ [\mathsf{PanicOutParam}],\ \operatorname{TypePrim}(\texttt{"()"}),\ \mathsf{IR}_{\mathsf{deinit}})]
\end{array}
$$

**(CG-Expr)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CodegenExpr}(e)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle 
\end{array}
$$

**(CG-Stmt)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerStmt}(s)\ \Downarrow \ \mathsf{IR} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CodegenStmt}(s)\ \Downarrow \ \mathsf{IR}
\end{array}
$$

**(CG-Block)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerBlock}(b)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CodegenBlock}(b)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle 
\end{array}
$$

**(CG-Place)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerPlace}(p)\ \Downarrow \ l \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CodegenPlace}(p)\ \Downarrow \ l
\end{array}
$$

**(LowerIR-Module)**

$$
\begin{array}{l}
\mathsf{IR}'\ =\ \operatorname{ExpandIR}(\mathsf{IR})\quad \mathsf{IR}'\ =\ [d_{1},\ \ldots ,\ d_{k}]\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{LowerIRDecl}(d_{i})\ \Downarrow \ \mathsf{ll}_{i}\quad \operatorname{RuntimeDecls}(\operatorname{RuntimeRefs}(\mathsf{IR}'))\ =\ \mathsf{ds}\quad \operatorname{RuntimeDeclsOk}(\mathsf{ds})\quad \mathsf{LLVMIR}\ =\ \mathsf{LLVMHeader}\ \mathbin{++} \ \mathsf{ds}\ \mathbin{++} \ \mathsf{ll}_{1}\ \mathbin{++} \ \ldots \ \mathbin{++} \ \mathsf{ll}_{k}\quad \operatorname{LLVMUBSafe}(\mathsf{LLVMIR})\quad \operatorname{RuntimeDeclsCover}(\mathsf{LLVMIR},\ \mathsf{IR}')\quad \operatorname{UniqueEmits}(\mathsf{IR}') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIR}(\mathsf{IR})\ \Downarrow \ \mathsf{LLVMIR}
\end{array}
$$

**(LowerIR-Err)**

$$
\begin{array}{l}
\exists \ i,\ \Gamma \ \vdash \ \operatorname{LowerIRDecl}(d_{i})\ \Uparrow  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIR}(\mathsf{IR})\ \Uparrow 
\end{array}
$$

`LowerIR-Err` is backend evidence. It is verified by valid source reaching semantic
success followed by a deterministic backend harness or injected invalid IR
declaration.

**(EmitLLVM-Ok)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTool}(\texttt{llvm-as})\ \Downarrow \ a\quad \operatorname{RenderLLVM}(\mathsf{LLVMIR},\ a)\ =\ \mathsf{bytes} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitLLVM}(\mathsf{LLVMIR})\ \Downarrow \ \mathsf{bytes}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{LLVMText}_{21}\ =\ \{\ \mathsf{bytes}\ \mid \ \texttt{llvm-as}\_21\ \mathsf{accepts}\ \mathsf{bytes}\ \} \\[0.16em]
\operatorname{RenderLLVM}(\mathsf{LLVMIR},\ a)\ =\ \mathsf{bytes}\ \Rightarrow \ \mathsf{bytes}\ \in \ \mathsf{LLVMText}_{21}
\end{array}
$$

**(EmitLLVM-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTool}(\texttt{llvm-as})\ \Downarrow \ a\quad \operatorname{RenderLLVM}(\mathsf{LLVMIR},\ a)\ \Uparrow  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitLLVM}(\mathsf{LLVMIR})\ \Uparrow 
\end{array}
$$

LLVMText_21 and LLVMObj_21 are defined by LLVM 21.1.8 tool acceptance for textual IR and object emission respectively.
Failure to resolve `llvm-as` is owned by §3.7 `ResolveTool-Err-IR` and the enclosing output rule; it MUST NOT be classified as `EmitLLVM-Err`.

**(EmitObj-Ok)**

$$
\begin{array}{l}
\operatorname{LLVMEmitObj_21}(\mathsf{LLVMIR})\ =\ \mathsf{bytes} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitObj}(\mathsf{LLVMIR})\ \Downarrow \ \mathsf{bytes}
\end{array}
$$

$$
\operatorname{LLVMEmitObj_21}(\mathsf{LLVMIR})\ =\ \mathsf{bytes}\ \Leftrightarrow \ \operatorname{LLVMObj_21}(\mathsf{LLVMIR},\ \mathsf{LLVMHeader})\ =\ \mathsf{bytes}
$$

**(EmitObj-Err)**

$$
\begin{array}{l}
\operatorname{LLVMEmitObj_21}(\mathsf{LLVMIR})\ \Uparrow  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitObj}(\mathsf{LLVMIR})\ \Uparrow 
\end{array}
$$

`EmitObj-Err` is reserved for verifier, target-machine, or object-emission failure
after an LLVM module or LLVM text exists.
