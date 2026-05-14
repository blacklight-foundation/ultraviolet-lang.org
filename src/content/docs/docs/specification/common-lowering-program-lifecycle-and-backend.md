---
title: "Common Lowering, Program Lifecycle, and Backend"
description: "24. Common Lowering, Program Lifecycle, and Backend of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
generatedAt: "2026-05-14T00:55:03.609Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
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
\operatorname{ArgsExprs}([\langle \mathsf{moved},\ e,\ \mathsf{span}\rangle ]\ \mathbin{++} \ \mathsf{rest})\ =\ [e]\ \mathbin{++} \ \operatorname{ArgsExprs}(\mathsf{rest})
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
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle \quad \Gamma \ \vdash \ \operatorname{LowerFieldInits}(\mathsf{fs})\ \Downarrow \ \langle \mathsf{IR}_{s},\ \mathsf{vec}_{f}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerFieldInits}([\langle f,\ e\rangle ]\ \mathbin{++} \ \mathsf{fs})\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{e},\ \mathsf{IR}_{s}),\ [\langle f,\ v\rangle ]\ \mathbin{++} \ \mathsf{vec}_{f}\rangle 
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

## 24.2 Layout and ABI Framework

### 24.2.1 Primitive Layout and Encoding

PtrSize = 8

$$
\mathsf{PointerSize}\ =\ \mathsf{PtrSize}
$$
PtrAlign = 8

$$
\begin{array}{l}
\operatorname{PrimSize}(\texttt{"i8"})\ =\ 1 \\[0.16em]
\operatorname{PrimSize}(\texttt{"i16"})\ =\ 2 \\[0.16em]
\operatorname{PrimSize}(\texttt{"i32"})\ =\ 4 \\[0.16em]
\operatorname{PrimSize}(\texttt{"i64"})\ =\ 8 \\[0.16em]
\operatorname{PrimSize}(\texttt{"i128"})\ =\ 16 \\[0.16em]
\operatorname{PrimSize}(\texttt{"u8"})\ =\ 1 \\[0.16em]
\operatorname{PrimSize}(\texttt{"u16"})\ =\ 2 \\[0.16em]
\operatorname{PrimSize}(\texttt{"u32"})\ =\ 4 \\[0.16em]
\operatorname{PrimSize}(\texttt{"u64"})\ =\ 8 \\[0.16em]
\operatorname{PrimSize}(\texttt{"u128"})\ =\ 16 \\[0.16em]
\operatorname{PrimSize}(\texttt{"f16"})\ =\ 2 \\[0.16em]
\operatorname{PrimSize}(\texttt{"f32"})\ =\ 4 \\[0.16em]
\operatorname{PrimSize}(\texttt{"f64"})\ =\ 8 \\[0.16em]
\operatorname{PrimSize}(\texttt{"bool"})\ =\ 1 \\[0.16em]
\operatorname{PrimSize}(\texttt{"char"})\ =\ 4 \\[0.16em]
\operatorname{PrimSize}(\texttt{"usize"})\ =\ \mathsf{PtrSize} \\[0.16em]
\operatorname{PrimSize}(\texttt{"isize"})\ =\ \mathsf{PtrSize} \\[0.16em]
\operatorname{PrimSize}(\texttt{"()"})\ =\ 0 \\[0.16em]
\operatorname{PrimSize}(\texttt{"!"})\ =\ 0
\end{array}
$$

$$
\begin{array}{l}
\operatorname{PrimAlign}(\texttt{"i8"})\ =\ 1 \\[0.16em]
\operatorname{PrimAlign}(\texttt{"i16"})\ =\ 2 \\[0.16em]
\operatorname{PrimAlign}(\texttt{"i32"})\ =\ 4 \\[0.16em]
\operatorname{PrimAlign}(\texttt{"i64"})\ =\ 8 \\[0.16em]
\operatorname{PrimAlign}(\texttt{"i128"})\ =\ 16 \\[0.16em]
\operatorname{PrimAlign}(\texttt{"u8"})\ =\ 1 \\[0.16em]
\operatorname{PrimAlign}(\texttt{"u16"})\ =\ 2 \\[0.16em]
\operatorname{PrimAlign}(\texttt{"u32"})\ =\ 4 \\[0.16em]
\operatorname{PrimAlign}(\texttt{"u64"})\ =\ 8 \\[0.16em]
\operatorname{PrimAlign}(\texttt{"u128"})\ =\ 16 \\[0.16em]
\operatorname{PrimAlign}(\texttt{"f16"})\ =\ 2 \\[0.16em]
\operatorname{PrimAlign}(\texttt{"f32"})\ =\ 4 \\[0.16em]
\operatorname{PrimAlign}(\texttt{"f64"})\ =\ 8 \\[0.16em]
\operatorname{PrimAlign}(\texttt{"bool"})\ =\ 1 \\[0.16em]
\operatorname{PrimAlign}(\texttt{"char"})\ =\ 4 \\[0.16em]
\operatorname{PrimAlign}(\texttt{"usize"})\ =\ \mathsf{PtrAlign} \\[0.16em]
\operatorname{PrimAlign}(\texttt{"isize"})\ =\ \mathsf{PtrAlign} \\[0.16em]
\operatorname{PrimAlign}(\texttt{"()"})\ =\ 1 \\[0.16em]
\operatorname{PrimAlign}(\texttt{"!"})\ =\ 1
\end{array}
$$

$$
\mathsf{LayoutJudg}\ =\ \{\mathsf{sizeof},\ \mathsf{alignof},\ \mathsf{layout}\}
$$

**(Size-Prim)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePrim}(\mathsf{name})\quad \operatorname{PrimSize}(\mathsf{name})\ =\ n \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ n
\end{array}
$$

**(Align-Prim)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePrim}(\mathsf{name})\quad \operatorname{PrimAlign}(\mathsf{name})\ =\ a \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ a
\end{array}
$$

**(Layout-Prim)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePrim}(\mathsf{name})\quad \operatorname{PrimSize}(\mathsf{name})\ =\ n\quad \operatorname{PrimAlign}(\mathsf{name})\ =\ a \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \langle n,\ a\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LEBytes}(v,\ n)\ =\ \operatorname{LE}(v\ \mathsf{mod}\ 2^\{8n\},\ n) \\[0.16em]
\operatorname{FloatBits_t}(v)\ =\ \operatorname{IEEE754Bits}(t,\ v) \\[0.16em]
\mathsf{EncodeConstJudg}\ =\ \{\mathsf{EncodeConst}\} \\[0.16em]
\operatorname{BoolByte}(\mathsf{false})\ =\ 0\mathsf{x00} \\[0.16em]
\operatorname{BoolByte}(\mathsf{true})\ =\ 0\mathsf{x01}
\end{array}
$$

**(Encode-Bool)**

$$
\begin{array}{l}
\operatorname{LiteralValue}(\mathsf{lit},\ \operatorname{TypePrim}(\texttt{"bool"}))\ =\ b \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EncodeConst}(\operatorname{TypePrim}(\texttt{"bool"}),\ \mathsf{lit})\ \Downarrow \ \operatorname{LEBytes}(\operatorname{BoolByte}(b),\ 1)
\end{array}
$$

**(Encode-Char)**

$$
\begin{array}{l}
\operatorname{LiteralValue}(\mathsf{lit},\ \operatorname{TypePrim}(\texttt{"char"}))\ =\ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EncodeConst}(\operatorname{TypePrim}(\texttt{"char"}),\ \mathsf{lit})\ \Downarrow \ \operatorname{LEBytes}(c,\ 4)
\end{array}
$$

**(Encode-Int)**

$$
\begin{array}{l}
\mathsf{lit}.\mathsf{kind}\ =\ \mathsf{IntLiteral}\quad T\ =\ \operatorname{TypePrim}(t)\quad t\ \in \ \mathsf{IntTypes}\quad v\ =\ \operatorname{LiteralValue}(\mathsf{lit},\ T)\quad x\ =\ \operatorname{IntValValue}(v) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EncodeConst}(T,\ \mathsf{lit})\ \Downarrow \ \operatorname{LEBytes}(x,\ \operatorname{sizeof}(T))
\end{array}
$$

**(Encode-Float)**

$$
\begin{array}{l}
\mathsf{lit}.\mathsf{kind}\ =\ \mathsf{FloatLiteral}\quad T\ =\ \operatorname{TypePrim}(t)\quad t\ \in \ \mathsf{FloatTypes}\quad v\ =\ \operatorname{LiteralValue}(\mathsf{lit},\ T)\quad x\ =\ \operatorname{FloatValValue}(v) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EncodeConst}(T,\ \mathsf{lit})\ \Downarrow \ \operatorname{LEBytes}(\operatorname{FloatBits_t}(x),\ \operatorname{sizeof}(T))
\end{array}
$$

**(Encode-Unit)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePrim}(\texttt{"()"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EncodeConst}(T,\ \mathsf{lit})\ \Downarrow \ []
\end{array}
$$

**(Encode-Never)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePrim}(\texttt{"!"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EncodeConst}(T,\ \mathsf{lit})\ \Downarrow \ []
\end{array}
$$

**(Encode-RawPtr-Null)**

$$
\begin{array}{l}
\mathsf{lit}.\mathsf{kind}\ =\ \mathsf{NullLiteral}\quad T\ =\ \operatorname{TypeRawPtr}(q,\ U) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EncodeConst}(T,\ \mathsf{lit})\ \Downarrow \ \operatorname{LEBytes}(0,\ \operatorname{sizeof}(T))
\end{array}
$$

$$
\mathsf{ValidValueJudg}\ =\ \{\mathsf{ValidValue}\}
$$

**(Valid-Bool)**

$$
\operatorname{ValidValue}(\operatorname{TypePrim}(\texttt{"bool"}),\ \mathsf{bits})\ \Leftrightarrow \ \mathsf{bits}\ \in \ \{[0\mathsf{x00}],\ [0\mathsf{x01}]\}
$$

**(Valid-Char)**

$$
\operatorname{ValidValue}(\operatorname{TypePrim}(\texttt{"char"}),\ \mathsf{bits})\ \Leftrightarrow \ \exists \ c.\ \operatorname{LEBytes}(c,\ 4)\ =\ \mathsf{bits}\ \land \ c\ \in \ \mathsf{UnicodeScalar}
$$

**(Valid-Scalar)**

$$
\begin{array}{l}
\mathsf{ScalarTypes}\ =\ \{\texttt{"i8"},\ \texttt{"i16"},\ \texttt{"i32"},\ \texttt{"i64"},\ \texttt{"i128"},\ \texttt{"u8"},\ \texttt{"u16"},\ \texttt{"u32"},\ \texttt{"u64"},\ \texttt{"u128"},\ \texttt{"f16"},\ \texttt{"f32"},\ \texttt{"f64"},\ \texttt{"usize"},\ \texttt{"isize"}\} \\[0.16em]
\forall \ t\ \in \ \mathsf{ScalarTypes}.\ \operatorname{ValidValue}(\operatorname{TypePrim}(t),\ \mathsf{bits})\ \Leftrightarrow \ \mid \mathsf{bits}\mid \ =\ \operatorname{PrimSize}(t)
\end{array}
$$

**(Valid-Unit)**

$$
\operatorname{ValidValue}(\operatorname{TypePrim}(\texttt{"()"}),\ \mathsf{bits})\ \Leftrightarrow \ \mathsf{bits}\ =\ []
$$

**(Valid-Never)**

$$
\operatorname{ValidValue}(\operatorname{TypePrim}(\texttt{"!"}),\ \mathsf{bits})\ \Leftrightarrow \ \mathsf{false}
$$

$$
\begin{array}{l}
\operatorname{ValidValue}(T,\ \mathsf{bits})\ \Leftrightarrow \ T\ \notin \ \{\operatorname{TypePrim}(\_),\ \operatorname{TypePtr}(\_,\ \_),\ \operatorname{TypeRawPtr}(\_,\ \_)\}\ \land \ \exists \ v.\ \operatorname{ValueBits}(T,\ v)\ =\ \mathsf{bits} \\[0.16em]
\operatorname{ValueBits}(T,\ v)\ =\ \mathsf{bits}\ \Rightarrow \ \operatorname{ValidValue}(T,\ \mathsf{bits})
\end{array}
$$

### 24.2.2 Permission, Pointer, and Function Layout

**(Layout-Perm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ L \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(\operatorname{TypePerm}(p,\ T))\ \Downarrow \ L
\end{array}
$$

**(Size-Perm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ n \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypePerm}(p,\ T))\ =\ n
\end{array}
$$

**(Align-Perm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ a \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypePerm}(p,\ T))\ =\ a
\end{array}
$$

$$
\operatorname{ValueBits}(\operatorname{TypePerm}(p,\ T),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ \operatorname{ValueBits}(T,\ v)\ =\ \mathsf{bits}
$$

**(Size-Ptr)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePtr}(T_{0},\ s) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ \mathsf{PtrSize}
\end{array}
$$

**(Align-Ptr)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePtr}(T_{0},\ s) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{PtrAlign}
\end{array}
$$

**(Layout-Ptr)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePtr}(T_{0},\ s) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \langle \mathsf{PtrSize},\ \mathsf{PtrAlign}\rangle 
\end{array}
$$

**(Size-RawPtr)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRawPtr}(q,\ T_{0}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ \mathsf{PtrSize}
\end{array}
$$

**(Align-RawPtr)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRawPtr}(q,\ T_{0}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{PtrAlign}
\end{array}
$$

**(Layout-RawPtr)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRawPtr}(q,\ T_{0}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \langle \mathsf{PtrSize},\ \mathsf{PtrAlign}\rangle 
\end{array}
$$

**(Size-Func)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeFunc}(\mathsf{params},\ R) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ \mathsf{PtrSize}
\end{array}
$$

**(Align-Func)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeFunc}(\mathsf{params},\ R) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{PtrAlign}
\end{array}
$$

**(Layout-Func)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeFunc}(\mathsf{params},\ R) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \langle \mathsf{PtrSize},\ \mathsf{PtrAlign}\rangle 
\end{array}
$$

### 24.2.3 Default Calling Convention

CallConvDefault = `C`

$$
\mathsf{CallingConvention}\ =\ \{\ \texttt{C},\ \texttt{C-unwind},\ \texttt{system},\ \texttt{stdcall},\ \texttt{fastcall},\ \texttt{vectorcall}\ \}
$$

$$
\begin{array}{l}
\operatorname{ObjFormatOf}(\texttt{x86\_64-sysv})\ =\ \texttt{"ELF"} \\[0.16em]
\operatorname{ObjFormatOf}(\texttt{x86\_64-win64})\ =\ \texttt{"COFF"} \\[0.16em]
\operatorname{ObjFormatOf}(\texttt{aarch64-aapcs64})\ =\ \texttt{"ELF"}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ObjExt}(\texttt{x86\_64-sysv})\ =\ \texttt{".o"} \\[0.16em]
\operatorname{ObjExt}(\texttt{x86\_64-win64})\ =\ \texttt{".obj"} \\[0.16em]
\operatorname{ObjExt}(\texttt{aarch64-aapcs64})\ =\ \texttt{".o"}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ExeSuffix}(\texttt{x86\_64-sysv})\ =\ \texttt{""} \\[0.16em]
\operatorname{ExeSuffix}(\texttt{x86\_64-win64})\ =\ \texttt{".exe"} \\[0.16em]
\operatorname{ExeSuffix}(\texttt{aarch64-aapcs64})\ =\ \texttt{""}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LibraryPrefix}(\texttt{x86\_64-sysv})\ =\ \texttt{"lib"} \\[0.16em]
\operatorname{LibraryPrefix}(\texttt{x86\_64-win64})\ =\ \texttt{""} \\[0.16em]
\operatorname{LibraryPrefix}(\texttt{aarch64-aapcs64})\ =\ \texttt{"lib"}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{SharedLibSuffix}(\texttt{x86\_64-sysv})\ =\ \texttt{".so"} \\[0.16em]
\operatorname{SharedLibSuffix}(\texttt{x86\_64-win64})\ =\ \texttt{".dll"} \\[0.16em]
\operatorname{SharedLibSuffix}(\texttt{aarch64-aapcs64})\ =\ \texttt{".so"}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{StaticLibSuffix}(\texttt{x86\_64-sysv})\ =\ \texttt{".a"} \\[0.16em]
\operatorname{StaticLibSuffix}(\texttt{x86\_64-win64})\ =\ \texttt{".lib"} \\[0.16em]
\operatorname{StaticLibSuffix}(\texttt{aarch64-aapcs64})\ =\ \texttt{".a"}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ImportLibSuffix}(\texttt{x86\_64-sysv})\ =\ \texttt{".so.import"} \\[0.16em]
\operatorname{ImportLibSuffix}(\texttt{x86\_64-win64})\ =\ \texttt{".lib"} \\[0.16em]
\operatorname{ImportLibSuffix}(\texttt{aarch64-aapcs64})\ =\ \texttt{".so.import"}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{EmitsImportLib}(\texttt{x86\_64-sysv})\ \Leftrightarrow \ \mathsf{false} \\[0.16em]
\operatorname{EmitsImportLib}(\texttt{x86\_64-win64})\ \Leftrightarrow \ \mathsf{true} \\[0.16em]
\operatorname{EmitsImportLib}(\texttt{aarch64-aapcs64})\ \Leftrightarrow \ \mathsf{false}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{RuntimeLibNameFor}(\texttt{x86\_64-sysv})\ =\ \texttt{"UltravioletRT.a"} \\[0.16em]
\operatorname{RuntimeLibNameFor}(\texttt{x86\_64-win64})\ =\ \texttt{"UltravioletRT.lib"} \\[0.16em]
\operatorname{RuntimeLibNameFor}(\texttt{aarch64-aapcs64})\ =\ \texttt{"UltravioletRT.a"}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LinkerToolName}(\texttt{x86\_64-sysv})\ =\ \texttt{ld.lld} \\[0.16em]
\operatorname{LinkerToolName}(\texttt{x86\_64-win64})\ =\ \texttt{lld-link} \\[0.16em]
\operatorname{LinkerToolName}(\texttt{aarch64-aapcs64})\ =\ \texttt{ld.lld}
\end{array}
$$

$$
\operatorname{LibraryEntrySym}(\texttt{x86\_64-win64})\ =\ \texttt{"\_\_ultraviolet\_library\_entry"}
$$

$$
\begin{array}{l}
\operatorname{ArchiverToolName}(\texttt{x86\_64-sysv})\ =\ \texttt{llvm-ar} \\[0.16em]
\operatorname{ArchiverToolName}(\texttt{x86\_64-win64})\ =\ \texttt{llvm-lib} \\[0.16em]
\operatorname{ArchiverToolName}(\texttt{aarch64-aapcs64})\ =\ \texttt{llvm-ar}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LinkFlagsFor}(\texttt{x86\_64-sysv},\ \texttt{exe},\ \mathsf{out},\ \_)\ =\ [\texttt{"-o"},\ \mathsf{out},\ \texttt{"--entry=\_start"},\ \texttt{"--nostdlib"},\ \texttt{"--dynamic-linker=/lib64/ld-linux-x86-64.so.2"}] \\[0.16em]
\operatorname{LinkFlagsFor}(\texttt{x86\_64-sysv},\ \texttt{shared},\ \mathsf{out},\ \_)\ =\ [\texttt{"-o"},\ \mathsf{out},\ \texttt{"--shared"},\ \texttt{"--nostdlib"}] \\[0.16em]
\operatorname{LinkFlagsFor}(\texttt{x86\_64-win64},\ \texttt{exe},\ \mathsf{out},\ \_)\ =\ [\texttt{"/OUT:"}\ \mathbin{++} \ \mathsf{out},\ \texttt{"/ENTRY:main"},\ \texttt{"/SUBSYSTEM:CONSOLE"},\ \texttt{"/NODEFAULTLIB"}] \\[0.16em]
\operatorname{LinkFlagsFor}(\texttt{x86\_64-win64},\ \texttt{shared},\ \mathsf{out},\ \mathsf{import}_{\mathsf{lib}})\ =\ [\texttt{"/OUT:"}\ \mathbin{++} \ \mathsf{out},\ \texttt{"/DLL"},\ \texttt{"/ENTRY:"}\ \mathbin{++} \ \operatorname{LibraryEntrySym}(\texttt{x86\_64-win64}),\ \texttt{"/NODEFAULTLIB"},\ \texttt{"/IMPLIB:"}\ \mathbin{++} \ \mathsf{import}_{\mathsf{lib}}] \\[0.16em]
\operatorname{LinkFlagsFor}(\texttt{aarch64-aapcs64},\ \texttt{exe},\ \mathsf{out},\ \_)\ =\ [\texttt{"-o"},\ \mathsf{out},\ \texttt{"--entry=main"},\ \texttt{"--nostdlib"},\ \texttt{"--dynamic-linker=/lib/ld-linux-aarch64.so.1"}] \\[0.16em]
\operatorname{LinkFlagsFor}(\texttt{aarch64-aapcs64},\ \texttt{shared},\ \mathsf{out},\ \_)\ =\ [\texttt{"-o"},\ \mathsf{out},\ \texttt{"--shared"},\ \texttt{"--nostdlib"}]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ArchiveFlagsFor}(\texttt{x86\_64-sysv},\ \mathsf{out})\ =\ [\texttt{"rcs"},\ \mathsf{out}] \\[0.16em]
\operatorname{ArchiveFlagsFor}(\texttt{x86\_64-win64},\ \mathsf{out})\ =\ [\texttt{"/OUT:"}\ \mathbin{++} \ \mathsf{out}] \\[0.16em]
\operatorname{ArchiveFlagsFor}(\texttt{aarch64-aapcs64},\ \mathsf{out})\ =\ [\texttt{"rcs"},\ \mathsf{out}]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LLVMTripleOf}(\texttt{x86\_64-sysv})\ =\ \texttt{"x86\_64-unknown-linux-gnu"} \\[0.16em]
\operatorname{LLVMTripleOf}(\texttt{x86\_64-win64})\ =\ \texttt{"x86\_64-pc-windows-msvc"} \\[0.16em]
\operatorname{LLVMTripleOf}(\texttt{aarch64-aapcs64})\ =\ \texttt{"aarch64-unknown-linux-gnu"}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LLVMDataLayoutOf}(\texttt{x86\_64-sysv})\ =\ \texttt{"e-m:e-p270:32:32-p271:32:32-p272:64:64-i128:128-n8:16:32:64-S128"} \\[0.16em]
\operatorname{LLVMDataLayoutOf}(\texttt{x86\_64-win64})\ =\ \texttt{"e-m:w-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"} \\[0.16em]
\operatorname{LLVMDataLayoutOf}(\texttt{aarch64-aapcs64})\ =\ \texttt{"e-m:e-i8:8:32-i16:16:32-i64:64-i128:128-n32:64-S128"}
\end{array}
$$

$$
\mathsf{ExternAbiSet}\ =\ \{\ \texttt{"C"},\ \texttt{"C-unwind"},\ \texttt{"system"},\ \texttt{"stdcall"},\ \texttt{"fastcall"},\ \texttt{"vectorcall"}\ \}
$$

$$
\mathsf{AbiToConvention}\ :\ \mathsf{String}\ \to \ \mathsf{CallingConvention}
$$

$$
\begin{array}{l}
\operatorname{AbiToConvention}(\texttt{"C"})\ =\ \texttt{C} \\[0.16em]
\operatorname{AbiToConvention}(\texttt{"C-unwind"})\ =\ \texttt{C-unwind} \\[0.16em]
\operatorname{AbiToConvention}(\texttt{"system"})\ =\ \texttt{system} \\[0.16em]
\operatorname{AbiToConvention}(\texttt{"stdcall"})\ =\ \texttt{stdcall} \\[0.16em]
\operatorname{AbiToConvention}(\texttt{"fastcall"})\ =\ \texttt{fastcall} \\[0.16em]
\operatorname{AbiToConvention}(\texttt{"vectorcall"})\ =\ \texttt{vectorcall}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ConventionLayout}(\texttt{x86\_64-sysv},\ \texttt{C})\ =\ \langle  \\[0.16em]
\ \mathsf{param}_{\mathsf{regs}}:\ \langle \mathsf{int}\ =\ [\mathsf{rdi},\ \mathsf{rsi},\ \mathsf{rdx},\ \mathsf{rcx},\ \mathsf{r8},\ \mathsf{r9}],\ \mathsf{float}\ =\ [\mathsf{xmm0},\ \mathsf{xmm1},\ \mathsf{xmm2},\ \mathsf{xmm3},\ \mathsf{xmm4},\ \mathsf{xmm5},\ \mathsf{xmm6},\ \mathsf{xmm7}]\rangle , \\[0.16em]
\ \mathsf{return}_{\mathsf{regs}}:\ \langle \mathsf{int}\ =\ [\mathsf{rax},\ \mathsf{rdx}],\ \mathsf{float}\ =\ [\mathsf{xmm0},\ \mathsf{xmm1}]\rangle , \\[0.16em]
\ \mathsf{stack}_{\mathsf{alignment}}:\ 16, \\[0.16em]
\ \mathsf{callee}_{\mathsf{saved}}:\ [\mathsf{rbx},\ \mathsf{rbp},\ \mathsf{r12},\ \mathsf{r13},\ \mathsf{r14},\ \mathsf{r15}], \\[0.16em]
\ \mathsf{caller}_{\mathsf{saved}}:\ [\mathsf{rax},\ \mathsf{rcx},\ \mathsf{rdx},\ \mathsf{rsi},\ \mathsf{rdi},\ \mathsf{r8},\ \mathsf{r9},\ \mathsf{r10},\ \mathsf{r11}], \\[0.16em]
\ \mathsf{variadic}_{\mathsf{support}}:\ \mathsf{true}, \\[0.16em]
\ \mathsf{unwind}_{\mathsf{support}}:\ \mathsf{false}, \\[0.16em]
\ \mathsf{panic}_{\mathsf{passing}}:\ \texttt{OutParam} \\[0.16em]
\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ConventionLayout}(\texttt{x86\_64-win64},\ \texttt{C})\ =\ \langle  \\[0.16em]
\ \mathsf{param}_{\mathsf{regs}}:\ \langle \mathsf{int}\ =\ [\mathsf{rcx},\ \mathsf{rdx},\ \mathsf{r8},\ \mathsf{r9}],\ \mathsf{float}\ =\ [\mathsf{xmm0},\ \mathsf{xmm1},\ \mathsf{xmm2},\ \mathsf{xmm3}]\rangle , \\[0.16em]
\ \mathsf{return}_{\mathsf{regs}}:\ \langle \mathsf{int}\ =\ [\mathsf{rax}],\ \mathsf{float}\ =\ [\mathsf{xmm0}]\rangle , \\[0.16em]
\ \mathsf{stack}_{\mathsf{alignment}}:\ 16, \\[0.16em]
\ \mathsf{callee}_{\mathsf{saved}}:\ [\mathsf{rbx},\ \mathsf{rbp},\ \mathsf{rdi},\ \mathsf{rsi},\ \mathsf{r12},\ \mathsf{r13},\ \mathsf{r14},\ \mathsf{r15}], \\[0.16em]
\ \mathsf{caller}_{\mathsf{saved}}:\ [\mathsf{rax},\ \mathsf{rcx},\ \mathsf{rdx},\ \mathsf{r8},\ \mathsf{r9},\ \mathsf{r10},\ \mathsf{r11}], \\[0.16em]
\ \mathsf{variadic}_{\mathsf{support}}:\ \mathsf{true}, \\[0.16em]
\ \mathsf{unwind}_{\mathsf{support}}:\ \mathsf{false}, \\[0.16em]
\ \mathsf{panic}_{\mathsf{passing}}:\ \texttt{OutParam} \\[0.16em]
\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ConventionLayout}(\texttt{aarch64-aapcs64},\ \texttt{C})\ =\ \langle  \\[0.16em]
\ \mathsf{param}_{\mathsf{regs}}:\ \langle \mathsf{int}\ =\ [\mathsf{x0},\ \mathsf{x1},\ \mathsf{x2},\ \mathsf{x3},\ \mathsf{x4},\ \mathsf{x5},\ \mathsf{x6},\ \mathsf{x7}],\ \mathsf{float}\ =\ [\mathsf{v0},\ \mathsf{v1},\ \mathsf{v2},\ \mathsf{v3},\ \mathsf{v4},\ \mathsf{v5},\ \mathsf{v6},\ \mathsf{v7}]\rangle , \\[0.16em]
\ \mathsf{return}_{\mathsf{regs}}:\ \langle \mathsf{int}\ =\ [\mathsf{x0},\ \mathsf{x1}],\ \mathsf{float}\ =\ [\mathsf{v0},\ \mathsf{v1}]\rangle , \\[0.16em]
\ \mathsf{stack}_{\mathsf{alignment}}:\ 16, \\[0.16em]
\ \mathsf{callee}_{\mathsf{saved}}:\ [\mathsf{x19},\ \mathsf{x20},\ \mathsf{x21},\ \mathsf{x22},\ \mathsf{x23},\ \mathsf{x24},\ \mathsf{x25},\ \mathsf{x26},\ \mathsf{x27},\ \mathsf{x28},\ \mathsf{x29},\ \mathsf{x30}], \\[0.16em]
\ \mathsf{caller}_{\mathsf{saved}}:\ [\mathsf{x0},\ \mathsf{x1},\ \mathsf{x2},\ \mathsf{x3},\ \mathsf{x4},\ \mathsf{x5},\ \mathsf{x6},\ \mathsf{x7},\ \mathsf{x8},\ \mathsf{x9},\ \mathsf{x10},\ \mathsf{x11},\ \mathsf{x12},\ \mathsf{x13},\ \mathsf{x14},\ \mathsf{x15},\ \mathsf{x16},\ \mathsf{x17},\ \mathsf{x18}], \\[0.16em]
\ \mathsf{variadic}_{\mathsf{support}}:\ \mathsf{true}, \\[0.16em]
\ \mathsf{unwind}_{\mathsf{support}}:\ \mathsf{false}, \\[0.16em]
\ \mathsf{panic}_{\mathsf{passing}}:\ \texttt{OutParam} \\[0.16em]
\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ConventionLayout}(\mathsf{profile},\ \texttt{C-unwind})\ =\ \operatorname{ConventionLayout}(\mathsf{profile},\ \texttt{C})\ \mathsf{with}\ \texttt{unwind\_support := true} \\[0.16em]
\operatorname{ConventionLayout}(\mathsf{profile},\ \texttt{system})\ =\ \operatorname{ConventionLayout}(\mathsf{profile},\ \texttt{C}) \\[0.16em]
\operatorname{ConventionLayout}(\texttt{x86\_64-win64},\ \texttt{stdcall})\ =\ \operatorname{ConventionLayout}(\texttt{x86\_64-win64},\ \texttt{C}) \\[0.16em]
\operatorname{ConventionLayout}(\texttt{x86\_64-win64},\ \texttt{fastcall})\ =\ \operatorname{ConventionLayout}(\texttt{x86\_64-win64},\ \texttt{C}) \\[0.16em]
\operatorname{ConventionLayout}(\texttt{x86\_64-win64},\ \texttt{vectorcall})\ =\ \operatorname{ConventionLayout}(\texttt{x86\_64-win64},\ \texttt{C})\ \mathsf{with}\ \texttt{variadic\_support := false}
\end{array}
$$

$$
\mathsf{AssignParamRegs}\ :\ [\mathsf{ParamType}]\ \times \ \mathsf{CallingConvention}\ \to \ [\mathsf{ParamLocation}]
$$

$$
\begin{array}{l}
\operatorname{AssignParamRegs}(\mathsf{params},\ \mathsf{conv})\ = \\[0.16em]
\ \mathsf{let}\ \mathsf{abi}\ =\ \operatorname{ConventionLayout}(\mathsf{SelectedTargetProfile},\ \mathsf{conv}) \\[0.16em]
\ \mathsf{let}\ (\mathsf{int}_{\mathsf{regs}},\ \mathsf{float}_{\mathsf{regs}})\ =\ (\mathsf{abi}.\mathsf{param}_{\mathsf{regs}}.\mathsf{int},\ \mathsf{abi}.\mathsf{param}_{\mathsf{regs}}.\mathsf{float}) \\[0.16em]
\ \mathsf{let}\ \mathsf{int}_{\mathsf{idx}}\ =\ 0,\ \mathsf{float}_{\mathsf{idx}}\ =\ 0,\ \mathsf{stack}_{\mathsf{offset}}\ =\ 0 \\[0.16em]
\ \mathsf{for}\ \mathsf{each}\ (\mathsf{mode},\ T)\ \mathsf{in}\ \mathsf{params}: \\[0.16em]
\quad \mathsf{if}\ \operatorname{IsFloatType}(T)\ \land \ \mathsf{float}_{\mathsf{idx}}\ <\ \mid \mathsf{float}_{\mathsf{regs}}\mid : \\[0.16em]
\quad \mathsf{assign}\ \mathsf{float}_{\mathsf{regs}}[\mathsf{float}_{\mathsf{idx}}\mathbin{++} ] \\[0.16em]
\quad \mathsf{else}\ \mathsf{if}\ \operatorname{IsIntOrPtrType}(T)\ \land \ \mathsf{int}_{\mathsf{idx}}\ <\ \mid \mathsf{int}_{\mathsf{regs}}\mid : \\[0.16em]
\quad \mathsf{assign}\ \mathsf{int}_{\mathsf{regs}}[\mathsf{int}_{\mathsf{idx}}\mathbin{++} ] \\[0.16em]
\quad \mathsf{else}: \\[0.16em]
\quad \mathsf{assign}\ \operatorname{Stack}(\mathsf{stack}_{\mathsf{offset}}) \\[0.16em]
\quad \mathsf{stack}_{\mathsf{offset}}\ +=\ \operatorname{Align}(\operatorname{sizeof}(T),\ \mathsf{abi}.\mathsf{stack}_{\mathsf{alignment}})
\end{array}
$$

$$
\begin{array}{l}
\mathsf{StackFrame}\ =\ \langle  \\[0.16em]
\ \mathsf{return}_{\mathsf{address}}:\ \mathsf{Offset}, \\[0.16em]
\ \mathsf{saved}_{\mathsf{frame}\_\mathsf{pointer}}:\ \mathsf{Option}<\mathsf{Offset}>, \\[0.16em]
\ \mathsf{callee}_{\mathsf{saved}\_\mathsf{area}}:\ [\langle \mathsf{Register},\ \mathsf{Offset}\rangle ], \\[0.16em]
\ \mathsf{local}_{\mathsf{variables}}:\ [\langle \mathsf{Name},\ \mathsf{Offset},\ \mathsf{Size}\rangle ], \\[0.16em]
\ \mathsf{outgoing}_{\mathsf{args}}:\ \mathsf{Option}<\mathsf{Offset}>, \\[0.16em]
\ \mathsf{alignment}_{\mathsf{padding}}:\ \mathsf{Size} \\[0.16em]
\rangle 
\end{array}
$$

**(StackFrame-Layout)**
procedure f with locals L, max_outgoing_args M

$$
\begin{array}{l}
\mathsf{frame}_{\mathsf{size}}\ =\ \operatorname{Align}(\mid L\mid \ +\ \mid \operatorname{ConventionLayout}(\mathsf{SelectedTargetProfile},\ \mathsf{CallConvDefault}).\mathsf{callee}_{\mathsf{saved}}\mid \ \times \ \mathsf{PtrSize}\ +\ M,\ \operatorname{ConventionLayout}(\mathsf{SelectedTargetProfile},\ \mathsf{CallConvDefault}).\mathsf{stack}_{\mathsf{alignment}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{StackFrameOf}(f)\ =\ \langle \mathsf{frame}_{\mathsf{size}},\ \mathsf{local}_{\mathsf{offsets}},\ \mathsf{callee}_{\mathsf{saved}\_\mathsf{offsets}},\ \mathsf{outgoing}_{\mathsf{offset}}\rangle 
\end{array}
$$

**(Conv-Compatible)**

$$
\begin{array}{l}
\mathsf{CallerConv}\ =\ \mathsf{conv}_{1}\quad \mathsf{CalleeConv}\ =\ \mathsf{conv}_{2}\quad \mathsf{conv}_{1}\ =\ \mathsf{conv}_{2} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ConvCompatible}(\mathsf{conv}_{1},\ \mathsf{conv}_{2})\ =\ \mathsf{true}
\end{array}
$$

**(Conv-FFI-Required)**

$$
\begin{array}{l}
\operatorname{FFIBoundary}(\mathsf{call}_{\mathsf{site}})\quad \operatorname{ExternAbi}(\mathsf{callee})\ =\ \mathsf{abi}_{\mathsf{str}}\quad \operatorname{AbiToConvention}(\mathsf{abi}_{\mathsf{str}})\ =\ \mathsf{conv} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{RequiredConvention}(\mathsf{call}_{\mathsf{site}})\ =\ \mathsf{conv}
\end{array}
$$

### 24.2.4 ABI Type Lowering

$$
\begin{array}{l}
\mathsf{ABIType}\ =\ \{\ \langle \mathsf{size},\ \mathsf{align}\rangle \ \mid \ \mathsf{size}\ \in \ \mathbb{N} \ \land \ \mathsf{align}\ \in \ \mathbb{N} \ \} \\[0.16em]
\mathsf{ABITyJudg}\ =\ \{\mathsf{ABITy}\}
\end{array}
$$

**(ABI-Prim)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypePrim}(\mathsf{name}))\ =\ s\quad \Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypePrim}(\mathsf{name}))\ =\ a \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ABITy}(\operatorname{TypePrim}(\mathsf{name}))\ \Downarrow \ \langle s,\ a\rangle 
\end{array}
$$

**(ABI-Perm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ABITy}(T)\ \Downarrow \ \tau  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ABITy}(\operatorname{TypePerm}(p,\ T))\ \Downarrow \ \tau 
\end{array}
$$

**(ABI-Ptr)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePtr}(U,\ s) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ABITy}(T)\ \Downarrow \ \langle \mathsf{PtrSize},\ \mathsf{PtrAlign}\rangle 
\end{array}
$$

**(ABI-RawPtr)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRawPtr}(q,\ U) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ABITy}(T)\ \Downarrow \ \langle \mathsf{PtrSize},\ \mathsf{PtrAlign}\rangle 
\end{array}
$$

**(ABI-Func)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeFunc}(\mathsf{params},\ R) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ABITy}(T)\ \Downarrow \ \langle \mathsf{PtrSize},\ \mathsf{PtrAlign}\rangle 
\end{array}
$$

**(ABI-Alias)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{AliasBody}(p)\ =\ \mathsf{ty}\quad \Gamma \ \vdash \ \operatorname{ABITy}(\mathsf{ty})\ \Downarrow \ \tau  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ABITy}(T)\ \Downarrow \ \tau 
\end{array}
$$

**(ABI-Record)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \operatorname{Fields}(R)\ =\ \mathsf{fields}\quad \operatorname{RecordLayout}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ABITy}(T)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

**(ABI-Tuple)**

$$
\begin{array}{l}
\operatorname{TupleLayout}([T_{1},\ \ldots ,\ T_{n}])\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ABITy}(\operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}]))\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

**(ABI-Array)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeArray}(T,\ e))\ =\ \mathsf{size}\quad \Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeArray}(T,\ e))\ =\ \mathsf{align} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ABITy}(\operatorname{TypeArray}(T,\ e))\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

**(ABI-Slice)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeSlice}(U) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ABITy}(T)\ \Downarrow \ \langle 2\ \times \ \mathsf{PtrSize},\ \mathsf{PtrAlign}\rangle 
\end{array}
$$

**(ABI-Range)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeRange}(T))\ =\ \mathsf{size}\quad \Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeRange}(T))\ =\ \mathsf{align} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ABITy}(\operatorname{TypeRange}(T))\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

**(ABI-RangeInclusive)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeRangeInclusive}(T))\ =\ \mathsf{size}\quad \Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeRangeInclusive}(T))\ =\ \mathsf{align} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ABITy}(\operatorname{TypeRangeInclusive}(T))\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

**(ABI-RangeFrom)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeRangeFrom}(T))\ =\ \mathsf{size}\quad \Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeRangeFrom}(T))\ =\ \mathsf{align} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ABITy}(\operatorname{TypeRangeFrom}(T))\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

**(ABI-RangeTo)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeRangeTo}(T))\ =\ \mathsf{size}\quad \Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeRangeTo}(T))\ =\ \mathsf{align} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ABITy}(\operatorname{TypeRangeTo}(T))\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

**(ABI-RangeToInclusive)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeRangeToInclusive}(T))\ =\ \mathsf{size}\quad \Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeRangeToInclusive}(T))\ =\ \mathsf{align} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ABITy}(\operatorname{TypeRangeToInclusive}(T))\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

**(ABI-RangeFull)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(\mathsf{TypeRangeFull})\ =\ \mathsf{size}\quad \Gamma \ \vdash \ \operatorname{alignof}(\mathsf{TypeRangeFull})\ =\ \mathsf{align} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ABITy}(\mathsf{TypeRangeFull})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

**(ABI-Enum)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{EnumLayout}(E)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_,\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ABITy}(T)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

**(ABI-Union)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad \operatorname{UnionLayout}(T)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_,\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ABITy}(T)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

**(ABI-Modal)**

$$
\begin{array}{l}
T\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalLayout}(\mathsf{modal}_{\mathsf{ref}})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_,\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ABITy}(T)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

**(ABI-Dynamic)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{DynLayout}(\mathsf{Cl})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ABITy}(\operatorname{TypeDynamic}(\mathsf{Cl}))\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

**(ABI-StringBytes)**

$$
\begin{array}{l}
T\ \in \ \{\operatorname{TypeString}(\texttt{@View}),\ \operatorname{TypeString}(\texttt{@Managed}),\ \operatorname{TypeBytes}(\texttt{@View}),\ \operatorname{TypeBytes}(\texttt{@Managed})\}\quad \Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ \mathsf{size}\quad \Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{align} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ABITy}(T)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

### 24.2.5 ABI Parameter and Return Passing

$$
\begin{array}{l}
\mathsf{PassKind}\ =\ \{\texttt{ByValue},\ \texttt{ByRef},\ \texttt{SRet}\} \\[0.16em]
\mathsf{ByValMax}\ =\ 2\ \times \ \mathsf{PtrSize} \\[0.16em]
\mathsf{ByValAlign}\ =\ \mathsf{PtrAlign} \\[0.16em]
\operatorname{ByValOk}(T)\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ n\ \land \ \Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ a\ \land \ n\ \le \ \mathsf{ByValMax}\ \land \ a\ \le \ \mathsf{ByValAlign} \\[0.16em]
\mathsf{ABIParamJudg}\ =\ \{\mathsf{ABIParam}\} \\[0.16em]
\mathsf{ABIRetJudg}\ =\ \{\mathsf{ABIRet}\} \\[0.16em]
\mathsf{ABICallJudg}\ =\ \{\mathsf{ABICall}\} \\[0.16em]
\mathsf{ForeignABIParamJudg}\ =\ \{\mathsf{ForeignABIParam}\} \\[0.16em]
\mathsf{ForeignABICallJudg}\ =\ \{\mathsf{ForeignABICall}\}
\end{array}
$$

`ForeignABIParam` and `ForeignABICall` MUST be used for foreign-visible ABI boundaries whose signatures do not carry source parameter-mode information.

**(ABI-Param-ByRef-Alias)**

$$
\begin{array}{l}
\mathsf{mode}\ =\ \bot \quad \Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ n \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ABIParam}(\mathsf{mode},\ T)\ \Downarrow \ \texttt{ByRef}
\end{array}
$$

**(ABI-Param-ByValue-Move)**

$$
\begin{array}{l}
\mathsf{mode}\ =\ \texttt{move}\quad \Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ 0\ \lor \ \operatorname{ByValOk}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ABIParam}(\mathsf{mode},\ T)\ \Downarrow \ \texttt{ByValue}
\end{array}
$$

**(ABI-Param-ByRef-Move)**

$$
\begin{array}{l}
\mathsf{mode}\ =\ \texttt{move}\quad \Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ n\quad n\ >\ 0\quad \lnot \ \operatorname{ByValOk}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ABIParam}(\mathsf{mode},\ T)\ \Downarrow \ \texttt{ByRef}
\end{array}
$$

**(ABI-Ret-ByValue)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ 0\ \lor \ \operatorname{ByValOk}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ABIRet}(T)\ \Downarrow \ \texttt{ByValue}
\end{array}
$$

**(ABI-Ret-ByRef)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ n\quad n\ >\ 0\quad \lnot \ \operatorname{ByValOk}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ABIRet}(T)\ \Downarrow \ \texttt{SRet}
\end{array}
$$

**(ABI-Call)**

$$
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{ABIParam}(m_{i},\ T_{i})\ \Downarrow \ k_{i}\quad \Gamma \ \vdash \ \operatorname{ABIRet}(R)\ \Downarrow \ k_{r} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ABICall}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ],\ R)\ \Downarrow \ \langle [k_{1},\ \ldots ,\ k_{n}],\ k_{r},\ (k_{r}\ =\ \texttt{SRet})\rangle 
\end{array}
$$

**(ABI-ForeignParam-ByValue)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ 0\ \lor \ \operatorname{ByValOk}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ForeignABIParam}(T)\ \Downarrow \ \texttt{ByValue}
\end{array}
$$

**(ABI-ForeignParam-ByRef)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ n\quad n\ >\ 0\quad \lnot \ \operatorname{ByValOk}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ForeignABIParam}(T)\ \Downarrow \ \texttt{ByRef}
\end{array}
$$

**(ABI-ForeignCall)**

$$
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{ForeignABIParam}(T_{i})\ \Downarrow \ k_{i}\quad \Gamma \ \vdash \ \operatorname{ABIRet}(R)\ \Downarrow \ k_{r} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ForeignABICall}([T_{1},\ \ldots ,\ T_{n}],\ R)\ \Downarrow \ \langle [k_{1},\ \ldots ,\ k_{n}],\ k_{r},\ (k_{r}\ =\ \texttt{SRet})\rangle 
\end{array}
$$

$$
\begin{array}{l}
\mathsf{PanicRecordFields}\ =\ [\langle \texttt{panic},\ \operatorname{TypePrim}(\texttt{"bool"})\rangle ,\ \langle \texttt{code},\ \operatorname{TypePrim}(\texttt{"u32"})\rangle ] \\[0.16em]
\mathsf{PanicRecordLayout}\ =\ \operatorname{RecordLayout}(\mathsf{PanicRecordFields}) \\[0.16em]
\operatorname{PanicRecordFieldsOf}(\mathsf{PanicRecord})\ =\ \mathsf{PanicRecordFields} \\[0.16em]
\operatorname{PanicRecordLayoutOf}(\mathsf{PanicRecord})\ =\ \mathsf{PanicRecordLayout}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{PanicOutType}\ =\ \operatorname{TypeRawPtr}(\texttt{mut},\ \mathsf{PanicRecord}) \\[0.16em]
\mathsf{PanicOutName}\ =\ \texttt{"\_\_panic"}
\end{array}
$$

$$
\operatorname{NeedsPanicOut}(\mathsf{callee})\ \Leftrightarrow \ \mathsf{callee}\ \ne \ \operatorname{RecordCtor}(\_)\ \land \ \mathsf{callee}\ \ne \ \mathsf{EntrySym}\ \land \ \operatorname{RuntimeSig}(\mathsf{callee})\ \mathsf{undefined}
$$

$$
\begin{array}{l}
\operatorname{PanicOutParams}(\mathsf{params},\ \mathsf{callee})\ = \\[0.16em]
\ \mathsf{params}\ \mathbin{++} \ [\langle \texttt{move},\ \mathsf{PanicOutName},\ \mathsf{PanicOutType}\rangle ]\quad \mathsf{if}\ \operatorname{NeedsPanicOut}(\mathsf{callee}) \\[0.16em]
\ \mathsf{params}\quad \mathsf{otherwise}
\end{array}
$$

## 24.3 Symbols, Mangling, and Linkage

### 24.3.1 Symbol Names and Mangling

$$
\mathsf{MangleJudg}\ =\ \{\mathsf{Mangle}\}
$$
VTableDecl(T, Cl) constructor
LiteralData(kind, contents) constructor
DefaultImpl(T, m) constructor

$$
\begin{array}{l}
\operatorname{Join}(\mathsf{sep},\ [])\ =\ \texttt{"\textbackslash{}""} \\[0.16em]
\operatorname{Join}(\mathsf{sep},\ [s])\ =\ s \\[0.16em]
\operatorname{Join}(\mathsf{sep},\ [s_{1},\ \ldots ,\ s_{n}])\ =\ s_{1}\ \mathbin{++} \ \mathsf{sep}\ \mathbin{++} \ \operatorname{Join}(\mathsf{sep},\ [s_{2},\ \ldots ,\ s_{n}])\quad (n\ \ge \ 2) \\[0.16em]
\operatorname{PathSig}(p)\ =\ \operatorname{mangle}(\operatorname{PathString}(p)) \\[0.16em]
\operatorname{PathSym}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{PathSig}(\mathsf{path}\ \mathbin{++} \ [\mathsf{name}])
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ItemPath}(\mathsf{it})\ =\ \operatorname{PathOfModule}(\operatorname{ModuleOf}(\mathsf{it}))\ \mathbin{++} \ [\mathsf{name}]\ \Leftrightarrow \ \mathsf{it}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_) \\[0.16em]
\operatorname{ItemPath}(\mathsf{it})\ =\ \operatorname{PathOfModule}(\operatorname{ModuleOf}(\mathsf{it}))\ \mathbin{++} \ [\mathsf{name}]\ \Leftrightarrow \ \mathsf{it}\ =\ \operatorname{ExternProcDecl}(\_,\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_) \\[0.16em]
\operatorname{ItemPath}(m)\ =\ \operatorname{RecordPath}(R)\ \mathbin{++} \ [m.\mathsf{name}]\ \Leftrightarrow \ m\ \in \ \operatorname{Methods}(R) \\[0.16em]
\operatorname{ItemPath}(m)\ =\ \operatorname{ClassPath}(\mathsf{Cl})\ \mathbin{++} \ [m.\mathsf{name}]\ \Leftrightarrow \ m\ \in \ \operatorname{ClassMethods}(\mathsf{Cl}) \\[0.16em]
\operatorname{ItemPath}(m)\ =\ \operatorname{ModalPath}(M)\ \mathbin{++} \ [S]\ \mathbin{++} \ [m.\mathsf{name}]\ \Leftrightarrow \ S\ \in \ \operatorname{States}(M)\ \land \ m\ \in \ \operatorname{Methods}(M,\ S) \\[0.16em]
\operatorname{ItemPath}(\mathsf{tr})\ =\ \operatorname{ModalPath}(M)\ \mathbin{++} \ [S]\ \mathbin{++} \ [\mathsf{tr}.\mathsf{name}]\ \Leftrightarrow \ S\ \in \ \operatorname{States}(M)\ \land \ \mathsf{tr}\ \in \ \operatorname{Transitions}(M,\ S) \\[0.16em]
\operatorname{ItemPath}(\mathsf{it})\ =\ \operatorname{PathOfModule}(\operatorname{ModuleOf}(\mathsf{it}))\ \mathbin{++} \ [\operatorname{StaticName}(\mathsf{binding})]\ \Leftrightarrow \ \mathsf{it}\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})\ \land \ \operatorname{StaticName}(\mathsf{binding})\ \ne \ \bot  \\[0.16em]
\operatorname{ItemPath}(\operatorname{StaticBinding}(\operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc}),\ x))\ =\ \operatorname{PathOfModule}(\operatorname{ModuleOf}(\operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})))\ \mathbin{++} \ [x] \\[0.16em]
\operatorname{ItemPath}(\operatorname{VTableDecl}(T,\ \mathsf{Cl}))\ =\ [\texttt{"vtable"}]\ \mathbin{++} \ \operatorname{PathOfType}(T)\ \mathbin{++} \ [\texttt{"cl"}]\ \mathbin{++} \ \operatorname{ClassPath}(\mathsf{Cl}) \\[0.16em]
\operatorname{ItemPath}(\operatorname{DefaultImpl}(T,\ m))\ =\ [\texttt{"default"}]\ \mathbin{++} \ \operatorname{PathOfType}(T)\ \mathbin{++} \ [\texttt{"cl"}]\ \mathbin{++} \ \operatorname{ClassPath}(\mathsf{Cl})\ \mathbin{++} \ [m.\mathsf{name}]\ \Leftrightarrow \ m\ \in \ \operatorname{ClassMethods}(\mathsf{Cl})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{TypeStateName}(\texttt{View})\ =\ \texttt{"view"} \\[0.16em]
\operatorname{TypeStateName}(\texttt{Managed})\ =\ \texttt{"managed"} \\[0.16em]
\operatorname{PathOfType}(\operatorname{TypePrim}(\mathsf{name}))\ =\ [\texttt{"prim"},\ \mathsf{name}] \\[0.16em]
\operatorname{PathOfType}(\operatorname{TypeString}(\mathsf{st}))\ =\ [\texttt{"string"},\ \operatorname{TypeStateName}(\mathsf{st})] \\[0.16em]
\operatorname{PathOfType}(\operatorname{TypeBytes}(\mathsf{st}))\ =\ [\texttt{"bytes"},\ \operatorname{TypeStateName}(\mathsf{st})] \\[0.16em]
\operatorname{PathOfType}(\operatorname{TypePath}(p))\ =\ p \\[0.16em]
\operatorname{PathOfType}(\operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S))\ =\ \operatorname{ModalRefPath}(\mathsf{modal}_{\mathsf{ref}})\ \mathbin{++} \ [S] \\[0.16em]
\operatorname{PathOfType}(T)\ =\ \bot \ \Leftrightarrow \ T\ \notin \ \{\operatorname{TypePrim}(\_),\ \operatorname{TypeString}(\_),\ \operatorname{TypeBytes}(\_),\ \operatorname{TypePath}(\_),\ \operatorname{TypeModalState}(\_,\ \_)\} \\[0.16em]
\operatorname{ClassPath}(\mathsf{Cl})\ =\ p\ \Leftrightarrow \ \Sigma .\mathsf{Classes}[p]\ =\ \mathsf{Cl}
\end{array}
$$

FNVOffset64 = 14695981039346656037
FNVPrime64 = 1099511628211

$$
\begin{array}{l}
\operatorname{FNV1a64}([])\ =\ \mathsf{FNVOffset64} \\[0.16em]
\operatorname{FNV1a64}([b_{1},\ \ldots ,\ b_{n}])\ =\ h_{n}\ \Leftrightarrow \ h_{0}\ =\ \mathsf{FNVOffset64}\ \land \ \forall \ i\ \in \ 0..n-1.\ h\_\{i+1\}\ =\ ((h_{i}\ \oplus \ b\_\{i+1\})\ \times \ \mathsf{FNVPrime64})\ \mathsf{mod}\ 2^64 \\[0.16em]
\operatorname{Hex64}(h)\ =\ \operatorname{Join}(\texttt{"\textbackslash{}""},\ [\operatorname{Hex2}(b_{1}),\ \ldots ,\ \operatorname{Hex2}(b_{8})])\ \Leftrightarrow \ \operatorname{rev}(\operatorname{LEBytes}(h,\ 8))\ =\ [b_{1},\ \ldots ,\ b_{8}] \\[0.16em]
\operatorname{LiteralID}(\mathsf{kind},\ \mathsf{contents})\ =\ \operatorname{mangle}(\mathsf{kind})\ \mathbin{++} \ \texttt{"\_"}\ \mathbin{++} \ \operatorname{Hex64}(\operatorname{FNV1a64}(\mathsf{contents})) \\[0.16em]
\operatorname{LiteralDataSym}(\mathsf{kind},\ \mathsf{bytes})\ =\ \operatorname{Mangle}(\operatorname{LiteralData}(\mathsf{kind},\ \mathsf{bytes}))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ScopedSym}(\mathsf{item})\ =\ \operatorname{PathSig}(\operatorname{ItemPath}(\mathsf{item})) \\[0.16em]
\operatorname{RawSym}(s)\ =\ s \\[0.16em]
\operatorname{HostBodySym}(\mathsf{item})\ =\ \operatorname{PathSig}([\operatorname{ScopedSym}(\mathsf{item}),\ \texttt{"\_\_host\_body"}])\ \Leftrightarrow \ \mathsf{item}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \land \ \operatorname{HostExportAttr}(\mathsf{item})\ \mathsf{defined}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{AttrListOf}(\mathsf{item})\ =\ \mathsf{attrs}\quad \mathsf{if}\ \mathsf{item}.\mathsf{attrs}_{\mathsf{opt}}\ =\ \mathsf{attrs} \\[0.16em]
\operatorname{AttrListOf}(\mathsf{item})\ =\ []\quad \mathsf{if}\ \mathsf{item}.\mathsf{attrs}_{\mathsf{opt}}\ =\ \bot  \\[0.16em]
\operatorname{AttrByName}(\mathsf{item},\ n)\ =\ [a\ \mid \ a\ \in \ \operatorname{AttrListOf}(\mathsf{item})\ \land \ a.\mathsf{name}\ =\ n] \\[0.16em]
\operatorname{MangleAttr}(\mathsf{item})\ =\ \mathsf{mode}\ \Leftrightarrow \ \exists \ a\ \in \ \operatorname{AttrByName}(\mathsf{item},\ \texttt{"mangle"}).\ \operatorname{MangleArgs}(a)\ =\ \mathsf{mode} \\[0.16em]
\operatorname{MangleArgs}(a)\ =\ \texttt{none}\ \Leftrightarrow \ a.\mathsf{args}\ =\ [\operatorname{Identifier}(\texttt{none})] \\[0.16em]
\operatorname{MangleArgs}(a)\ =\ s\quad \Leftrightarrow \ a.\mathsf{args}\ =\ [\operatorname{StringLiteral}(s)] \\[0.16em]
\operatorname{ExportAttr}(\mathsf{item})\ =\ \mathsf{abi}\ \Leftrightarrow \ \exists \ a\ \in \ \operatorname{AttrByName}(\mathsf{item},\ \texttt{"export"}).\ a.\mathsf{args}\ =\ [\operatorname{StringLiteral}(\mathsf{abi})] \\[0.16em]
\operatorname{HostExportAttr}(\mathsf{item})\ =\ \mathsf{abi}\ \Leftrightarrow \ \exists \ a\ \in \ \operatorname{AttrByName}(\mathsf{item},\ \texttt{"host\_export"}).\ a.\mathsf{args}\ =\ [\operatorname{StringLiteral}(\mathsf{abi})]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{StringText}(\mathsf{tok})\ =\ s\ \Leftrightarrow \ \mathsf{tok}.\mathsf{kind}\ =\ \mathsf{StringLiteral}\ \land \ T\ =\ \operatorname{Lexeme}(\mathsf{tok})\ \land \ \operatorname{StringBytesFrom}(T,\ 1,\ \mid T\mid -1)\ =\ \mathsf{bytes}\ \land \ \operatorname{DecodeUTF8}(\mathsf{bytes})\ =\ s \\[0.16em]
\operatorname{ExternAbiName}(\mathsf{abi}_{\mathsf{opt}})\ =\ \texttt{"C"}\quad \mathsf{if}\ \mathsf{abi}_{\mathsf{opt}}\ =\ \bot  \\[0.16em]
\operatorname{ExternAbiName}(\mathsf{abi}_{\mathsf{opt}})\ =\ s\quad \mathsf{if}\ \mathsf{abi}_{\mathsf{opt}}\ =\ \operatorname{IdentAbi}(s) \\[0.16em]
\operatorname{ExternAbiName}(\mathsf{abi}_{\mathsf{opt}})\ =\ s\quad \mathsf{if}\ \mathsf{abi}_{\mathsf{opt}}\ =\ \operatorname{StringAbi}(\mathsf{tok})\ \land \ \operatorname{StringText}(\mathsf{tok})\ =\ s \\[0.16em]
\operatorname{ExternAbiExplicit}(\mathsf{abi}_{\mathsf{opt}})\ \Leftrightarrow \ \mathsf{abi}_{\mathsf{opt}}\ \ne \ \bot  \\[0.16em]
\operatorname{ExternAbiOf}(\mathsf{proc})\ =\ \mathsf{abi}_{\mathsf{opt}}\ \Leftrightarrow \ \operatorname{ExternBlockOf}(\mathsf{proc})\ =\ \operatorname{ExternBlock}(\_,\ \_,\ \mathsf{abi}_{\mathsf{opt}},\ \_,\ \_,\ \_) \\[0.16em]
\operatorname{ExternRawName}(\mathsf{proc})\ \Leftrightarrow \ \mathsf{proc}\ =\ \operatorname{ExternProcDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \land \ \operatorname{ExternAbiName}(\operatorname{ExternAbiOf}(\mathsf{proc}))\ \in \ \{\texttt{"C"},\ \texttt{"C-unwind"}\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LinkName}(\mathsf{item})\ =\ \mathsf{sym}\ \Leftrightarrow  \\[0.16em]
\ \operatorname{MangleAttr}(\mathsf{item})\ =\ \texttt{none}\quad \land \ \mathsf{sym}\ =\ \operatorname{RawSym}(\operatorname{ItemName}(\mathsf{item})) \\[0.16em]
\ \operatorname{MangleAttr}(\mathsf{item})\ =\ s\ \land \ s\ \ne \ \texttt{none}\quad \land \ \mathsf{sym}\ =\ \operatorname{RawSym}(s) \\[0.16em]
\ \operatorname{MangleAttr}(\mathsf{item})\ \mathsf{undefined}\ \land \ \operatorname{ExternRawName}(\mathsf{item})\quad \land \ \mathsf{sym}\ =\ \operatorname{RawSym}(\operatorname{ItemName}(\mathsf{item})) \\[0.16em]
\ \operatorname{MangleAttr}(\mathsf{item})\ \mathsf{undefined}\ \land \ \operatorname{ExportAttr}(\mathsf{item})\ \mathsf{defined}\quad \land \ \mathsf{sym}\ =\ \operatorname{ScopedSym}(\mathsf{item}) \\[0.16em]
\ \operatorname{MangleAttr}(\mathsf{item})\ \mathsf{undefined}\ \land \ \operatorname{ExportAttr}(\mathsf{item})\ \mathsf{undefined}\ \land \ \mathsf{sym}\ =\ \operatorname{ScopedSym}(\mathsf{item})
\end{array}
$$

$$
\operatorname{HostThunkLinkName}(\mathsf{item})\ =\ \mathsf{sym}\ \Leftrightarrow \ \mathsf{item}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \land \ \operatorname{HostExportAttr}(\mathsf{item})\ \mathsf{defined}\ \land \ \operatorname{LinkName}(\mathsf{item})\ =\ \mathsf{sym}
$$

$$
\begin{array}{l}
\operatorname{ItemName}(\mathsf{item})\ =\ \mathsf{name}\ \Leftrightarrow \ \mathsf{item}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_) \\[0.16em]
\operatorname{ItemName}(\mathsf{item})\ =\ \mathsf{name}\ \Leftrightarrow \ \mathsf{item}\ =\ \operatorname{ExternProcDecl}(\_,\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_) \\[0.16em]
\operatorname{ItemName}(\mathsf{item})\ =\ \mathsf{name}\ \Leftrightarrow \ \mathsf{item}\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \langle \operatorname{IdentifierPattern}(\mathsf{name}),\ \_,\ \_,\ \_,\ \_\rangle ,\ \_,\ \_)
\end{array}
$$

**(Mangle-HostExport-Proc)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ProcedureDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\quad \mathsf{name}\ \ne \ \texttt{"main"}\quad \operatorname{HostExportAttr}(\mathsf{item})\ \mathsf{defined}\quad \operatorname{HostBodySym}(\mathsf{item})\ =\ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym}
\end{array}
$$

**(Mangle-Proc)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ProcedureDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\quad \mathsf{name}\ \ne \ \texttt{"main"}\quad \operatorname{HostExportAttr}(\mathsf{item})\ \mathsf{undefined}\quad \operatorname{LinkName}(\mathsf{item})\ =\ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym}
\end{array}
$$

**(Mangle-ExternProc)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ExternProcDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{foreign}_{\mathsf{contracts}\_\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc})\quad \operatorname{LinkName}(\mathsf{item})\ =\ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym}
\end{array}
$$

**(Mangle-Main)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ProcedureDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \texttt{"main"},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\quad \operatorname{MainSigOk}(\mathsf{item})\quad \operatorname{LinkName}(\mathsf{item})\ =\ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym}
\end{array}
$$

**(Mangle-Record-Method)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{MethodDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{override},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{receiver},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \operatorname{ScopedSym}(\mathsf{item})
\end{array}
$$

**(Mangle-Class-Method)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ClassMethodDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{receiver},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \operatorname{ScopedSym}(\mathsf{item})
\end{array}
$$

**(Mangle-State-Method)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StateMethodDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \operatorname{ScopedSym}(\mathsf{item})
\end{array}
$$

**(Mangle-Transition)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{TransitionDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{params},\ \mathsf{target},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \operatorname{ScopedSym}(\mathsf{item})
\end{array}
$$

**(Mangle-Static)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})\quad \operatorname{StaticName}(\mathsf{binding})\ \ne \ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \operatorname{ScopedSym}(\mathsf{item})
\end{array}
$$

**(Mangle-StaticBinding)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticBinding}(\operatorname{StaticDecl}(\_,\ \_,\ \_,\ \mathsf{binding},\ \_,\ \_),\ x) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \operatorname{ScopedSym}(\mathsf{item})
\end{array}
$$

**(Mangle-VTable)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{VTableDecl}(T,\ \mathsf{Cl}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \operatorname{ScopedSym}(\mathsf{item})
\end{array}
$$

**(Mangle-Literal)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{LiteralData}(\mathsf{kind},\ \mathsf{contents})\quad \operatorname{LiteralID}(\mathsf{kind},\ \mathsf{contents})\ =\ \mathsf{id} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"literal"},\ \mathsf{id}])
\end{array}
$$

**(Mangle-DefaultImpl)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{DefaultImpl}(T,\ m) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \operatorname{ScopedSym}(\mathsf{item})
\end{array}
$$

ClosureIndex(C) returns a unique index for closure C within its enclosing scope.

$$
\operatorname{EnclosingSym}(C)\ =\ \mathsf{sym}\ \Leftrightarrow \ \operatorname{EnclosingScope}(C)\ =\ \mathsf{item}\ \land \ \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym}
$$

**(Mangle-Closure)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{EnclosingSym}(C)\ =\ \mathsf{sym}_{\mathsf{enc}}\quad \operatorname{ClosureIndex}(C)\ =\ \mathsf{idx} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Mangle}(C)\ \Downarrow \ \operatorname{PathSig}([\mathsf{sym}_{\mathsf{enc}},\ \texttt{"\_closure"}\ \mathbin{++} \ \operatorname{ToString}(\mathsf{idx})])
\end{array}
$$

**(Mangle-ClosureEnv)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \Gamma \ \vdash \ \operatorname{Mangle}(C)\ \Downarrow \ \mathsf{sym}_{\mathsf{closure}} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{MangleClosureEnv}(C)\ \Downarrow \ \operatorname{PathSig}([\mathsf{sym}_{\mathsf{closure}},\ \texttt{"\_env"}])
\end{array}
$$

$$
\operatorname{ClosureCodeSym}(C)\ =\ \mathsf{sym}\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{Mangle}(C)\ \Downarrow \ \mathsf{sym}
$$

### 24.3.2 Linkage for Generated Symbols

$$
\begin{array}{l}
\mathsf{LinkageKind}\ =\ \{\texttt{internal},\ \texttt{external}\} \\[0.16em]
\mathsf{LinkageJudg}\ =\ \{\mathsf{Linkage}\}
\end{array}
$$

**(Linkage-UserItem)**

$$
\begin{array}{l}
\mathsf{item}\ \in \ \{\mathsf{ProcedureDecl},\ \mathsf{StaticDecl},\ \mathsf{MethodDecl}\}\quad \operatorname{Vis}(\mathsf{item})\ \in \ \{\texttt{public},\ \texttt{internal}\}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{external}
\end{array}
$$

**(Linkage-ExternProc)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ExternProcDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{external}
\end{array}
$$

**(Linkage-UserItem-Internal)**

$$
\begin{array}{l}
\mathsf{item}\ \in \ \{\mathsf{ProcedureDecl},\ \mathsf{StaticDecl},\ \mathsf{MethodDecl}\}\quad \operatorname{Vis}(\mathsf{item})\ =\ \texttt{private}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
$$

**(Linkage-StaticBinding)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticBinding}(\operatorname{StaticDecl}(\_,\ \mathsf{vis},\ \_,\ \_,\ \_,\ \_),\ x)\quad \mathsf{vis}\ \in \ \{\texttt{public},\ \texttt{internal}\}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{external}
\end{array}
$$

**(Linkage-StaticBinding-Internal)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticBinding}(\operatorname{StaticDecl}(\_,\ \mathsf{vis},\ \_,\ \_,\ \_,\ \_),\ x)\quad \mathsf{vis}\ =\ \texttt{private}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
$$

**(Linkage-ClassMethod)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ClassMethodDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{receiver},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}})\quad \mathsf{body}_{\mathsf{opt}}\ \ne \ \bot \quad \operatorname{Vis}(\mathsf{item})\ \in \ \{\texttt{public},\ \texttt{internal}\}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{external}
\end{array}
$$

**(Linkage-ClassMethod-Internal)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ClassMethodDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{receiver},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}})\quad \mathsf{body}_{\mathsf{opt}}\ \ne \ \bot \quad \operatorname{Vis}(\mathsf{item})\ =\ \texttt{private}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
$$

**(Linkage-StateMethod)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StateMethodDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}})\quad \operatorname{Vis}(\mathsf{item})\ \in \ \{\texttt{public},\ \texttt{internal}\}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{external}
\end{array}
$$

**(Linkage-StateMethod-Internal)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StateMethodDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}})\quad \operatorname{Vis}(\mathsf{item})\ =\ \texttt{private}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
$$

**(Linkage-Transition)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{TransitionDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{params},\ \mathsf{target},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}})\quad \operatorname{Vis}(\mathsf{item})\ \in \ \{\texttt{public},\ \texttt{internal}\}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{external}
\end{array}
$$

**(Linkage-Transition-Internal)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{TransitionDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{params},\ \mathsf{target},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}})\quad \operatorname{Vis}(\mathsf{item})\ =\ \texttt{private}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
$$

**(Linkage-InitFn)**

$$
\begin{array}{l}
\operatorname{InitFn}(m)\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
$$

**(Linkage-DeinitFn)**

$$
\begin{array}{l}
\operatorname{DeinitFn}(m)\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
$$

**(Linkage-VTable)**

$$
\begin{array}{l}
\operatorname{Mangle}(\operatorname{VTableDecl}(T,\ \mathsf{Cl}))\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
$$

**(Linkage-LiteralData)**

$$
\begin{array}{l}
\operatorname{Mangle}(\operatorname{LiteralData}(\mathsf{kind},\ \mathsf{contents}))\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
$$

**(Linkage-DropGlue)**

$$
\begin{array}{l}
\operatorname{DropGlueSym}(T)\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
$$

**(Linkage-DefaultImpl)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{DefaultImpl}(T,\ m)\quad \operatorname{Vis}(m)\ \in \ \{\texttt{public},\ \texttt{internal}\}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{external}
\end{array}
$$

**(Linkage-DefaultImpl-Internal)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{DefaultImpl}(T,\ m)\quad \operatorname{Vis}(m)\ =\ \texttt{private}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
$$

**(Linkage-PanicSym)**

$$
\begin{array}{l}
\mathsf{PanicSym}\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
$$

**(Linkage-BuiltinModalSym)**

$$
\begin{array}{l}
\operatorname{BuiltinModalSym}(\mathsf{proc})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
$$

**(Linkage-BuiltinSym)**

$$
\begin{array}{l}
\operatorname{BuiltinSym}(\mathsf{method})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
$$

**(Linkage-EntrySym)**

$$
\begin{array}{l}
\mathsf{EntrySym}\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{external}
\end{array}
$$

## 24.4 Initialization and Program Lifecycle

### 24.4.1 Static Globals and Module Init/Deinit Lowering

$$
\mathsf{GlobalsJudg}\ =\ \{\mathsf{EmitGlobal},\ \mathsf{InitFn},\ \mathsf{DeinitFn},\ \mathsf{Lower}-\mathsf{StaticInit},\ \mathsf{Lower}-\mathsf{StaticInitItem},\ \mathsf{Lower}-\mathsf{StaticInitItems},\ \mathsf{InitCallIR},\ \mathsf{Lower}-\mathsf{StaticDeinit},\ \mathsf{Lower}-\mathsf{StaticDeinitNames},\ \mathsf{Lower}-\mathsf{StaticDeinitItem},\ \mathsf{Lower}-\mathsf{StaticDeinitItems},\ \mathsf{DeinitCallIR},\ \mathsf{EmitInitPlan},\ \mathsf{EmitDeinitPlan},\ \mathsf{EmitStringLit},\ \mathsf{EmitBytesLit},\ \mathsf{InitPanicHandle}\}
$$

$$
\mathsf{ConstInitJudg}\ =\ \{\mathsf{ConstInit}\}
$$

$$
\Gamma \ \vdash \ \operatorname{ConstInit}(e)\ \Downarrow \ \mathsf{bytes}\ \Leftrightarrow \ e\ =\ \operatorname{Literal}(\mathsf{lit})\ \land \ \Gamma \ \vdash \ \operatorname{EncodeConst}(\operatorname{ExprType}(e),\ \mathsf{lit})\ \Downarrow \ \mathsf{bytes}
$$

$$
\begin{array}{l}
\operatorname{StaticName}(\mathsf{binding})\ = \\[0.16em]
\ \mathsf{name}\quad \mathsf{if}\ \mathsf{binding}\ =\ \langle \operatorname{IdentifierPattern}(\mathsf{name}),\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \mathsf{span}\rangle  \\[0.16em]
\ \bot \quad \mathsf{otherwise}
\end{array}
$$

$$
\operatorname{StaticBindTypes}(\mathsf{binding})\ =\ B\ \Leftrightarrow \ \mathsf{binding}\ =\ \langle \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \_\rangle \ \land \ \Gamma \ \vdash \ \mathsf{pat}\ \Leftarrow \ \operatorname{BindType}(\mathsf{binding})\ \dashv \ B
$$

$$
\operatorname{StaticBindList}(\mathsf{binding})\ =\ \operatorname{PatNames}(\mathsf{pat})\ \Leftrightarrow \ \mathsf{binding}\ =\ \langle \mathsf{pat},\ \_,\ \_,\ \_,\ \_\rangle 
$$

$$
\mathsf{StaticBinding}\ :\ \mathsf{StaticDecl}\ \times \ \mathsf{Name}\ \to \ \mathsf{StaticDecl}
$$

$$
\begin{array}{l}
\operatorname{StaticSym}(\operatorname{StaticDecl}(\_,\ \_,\ \_,\ \mathsf{binding},\ \_,\ \_),\ x)\ = \\[0.16em]
\ \operatorname{Mangle}(\operatorname{StaticDecl}(\_,\ \_,\ \_,\ \mathsf{binding},\ \_,\ \_))\quad \mathsf{if}\ \operatorname{StaticName}(\mathsf{binding})\ =\ x \\[0.16em]
\ \operatorname{Mangle}(\operatorname{StaticBinding}(\operatorname{StaticDecl}(\_,\ \_,\ \_,\ \mathsf{binding},\ \_,\ \_),\ x))\quad \mathsf{otherwise}
\end{array}
$$

**(Emit-Static-Const)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})\quad \mathsf{mut}\ =\ \texttt{let}\quad \operatorname{StaticName}(\mathsf{binding})\ =\ \mathsf{name}\quad \mathsf{binding}\ =\ \langle \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \_\rangle \quad \Gamma \ \vdash \ \operatorname{ConstInit}(\mathsf{init})\ \Downarrow \ \mathsf{bytes}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitGlobal}(\mathsf{item})\ \Downarrow \ [\operatorname{GlobalConst}(\mathsf{sym},\ \mathsf{bytes})]
\end{array}
$$

**(Emit-Static-Init)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})\quad \operatorname{StaticName}(\mathsf{binding})\ =\ \mathsf{name}\quad \mathsf{binding}\ =\ \langle \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \_\rangle \quad ((\mathsf{mut}\ =\ \texttt{var})\ \lor \ (\Gamma \ \vdash \ \operatorname{ConstInit}(\mathsf{init})\ \Uparrow ))\quad T\ =\ \operatorname{ExprType}(\mathsf{init})\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitGlobal}(\mathsf{item})\ \Downarrow \ [\operatorname{GlobalZero}(\mathsf{sym},\ \operatorname{sizeof}(T))]
\end{array}
$$

**(Emit-Static-Multi)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})\quad \operatorname{StaticName}(\mathsf{binding})\ =\ \bot \quad \operatorname{StaticBindTypes}(\mathsf{binding})\ =\ B\quad \operatorname{StaticBindList}(\mathsf{binding})\ =\ [x_{1},\ \ldots ,\ x_{k}]\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{Mangle}(\operatorname{StaticBinding}(\mathsf{item},\ x_{i}))\ \Downarrow \ \mathsf{sym}_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitGlobal}(\mathsf{item})\ \Downarrow \ [\operatorname{GlobalZero}(\mathsf{sym}_{1},\ \operatorname{sizeof}(B[x_{1}])),\ \ldots ,\ \operatorname{GlobalZero}(\mathsf{sym}_{k},\ \operatorname{sizeof}(B[x_{k}]))]
\end{array}
$$

$$
\operatorname{InitSym}(m)\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"init"}]\ \mathbin{++} \ \operatorname{PathOfModule}(m))
$$

**(InitFn)**

$$
\begin{array}{l}
\operatorname{InitSym}(m)\ =\ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{InitFn}(m)\ \Downarrow \ \mathsf{sym}
\end{array}
$$

$$
\operatorname{DeinitSym}(m)\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"deinit"}]\ \mathbin{++} \ \operatorname{PathOfModule}(m))
$$

**(DeinitFn)**

$$
\begin{array}{l}
\operatorname{DeinitSym}(m)\ =\ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DeinitFn}(m)\ \Downarrow \ \mathsf{sym}
\end{array}
$$

$$
\operatorname{StaticItems}(P,\ m)\ =\ [\ \mathsf{item}\ \mid \ \mathsf{item}\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \land \ \mathsf{item}\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_)\ ]
$$

$$
\operatorname{StaticItemOf}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{item}\ \Leftrightarrow \ m\ =\ \mathsf{path}\ \land \ \mathsf{item}\ \in \ \operatorname{StaticItems}(\operatorname{Project}(\Gamma ),\ m)\ \land \ \mathsf{item}\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \mathsf{binding},\ \_,\ \_)\ \land \ \mathsf{name}\ \in \ \operatorname{StaticBindList}(\mathsf{binding})\ \land \ \forall \ \mathsf{item}'.\ (\mathsf{item}'\ \in \ \operatorname{StaticItems}(\operatorname{Project}(\Gamma ),\ m)\ \land \ \mathsf{item}'\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \mathsf{binding}',\ \_,\ \_)\ \land \ \mathsf{name}\ \in \ \operatorname{StaticBindList}(\mathsf{binding}'))\ \Rightarrow \ \mathsf{item}'\ =\ \mathsf{item}
$$

$$
\operatorname{StaticSymPath}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{StaticSym}(\mathsf{item},\ \mathsf{name})\ \Leftrightarrow \ \operatorname{StaticItemOf}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{item}
$$

$$
\operatorname{StaticAddr}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{addr}\ \Leftrightarrow \ \exists \ \mathsf{sym}.\ \operatorname{StaticSymPath}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{sym}\ \land \ \operatorname{AddrOfSym}(\mathsf{sym})\ =\ \mathsf{addr}
$$

For hosted-library session execution, §24.4.1 reinterprets the `AddrOfSym(sym)` occurrence above session-locally for every hosted-state symbol.

$$
\mathsf{AddrOfSym}\ :\ \mathsf{Symbol}\ \to \ \mathsf{Addr}
$$

$$
\operatorname{StaticType}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{StaticBindTypes}(\mathsf{binding})[\mathsf{name}]\ \Leftrightarrow \ \operatorname{StaticItemOf}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \mathsf{mut},\ \mathsf{binding},\ \_,\ \_)
$$

$$
\operatorname{StaticBindInfo}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{BindInfoMap}(\lambda \ U.\ \operatorname{RespOfInit}(\mathsf{init}),\ \operatorname{StaticBindTypes}(\mathsf{binding}),\ \operatorname{MovOf}(\mathsf{op}),\ \mathsf{mut})[\mathsf{name}]\ \Leftrightarrow \ \operatorname{StaticItemOf}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \mathsf{mut},\ \mathsf{binding},\ \_,\ \_)\ \land \ \mathsf{binding}\ =\ \langle \_,\ \_,\ \mathsf{op},\ \mathsf{init},\ \_\rangle 
$$

$$
\begin{array}{l}
\operatorname{SeqIRList}([])\ =\ \varepsilon  \\[0.16em]
\operatorname{SeqIRList}([\mathsf{IR}]\ \mathbin{++} \ \mathsf{IRs})\ =\ \operatorname{SeqIR}(\mathsf{IR},\ \operatorname{SeqIRList}(\mathsf{IRs}))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{StaticStoreIR}(\mathsf{item},\ [])\ =\ \varepsilon  \\[0.16em]
\operatorname{StaticStoreIR}(\mathsf{item},\ [\langle x,\ v\rangle ]\ \mathbin{++} \ \mathsf{bs})\ =\ \operatorname{SeqIR}(\operatorname{StoreGlobal}(\operatorname{StaticSym}(\mathsf{item},\ x),\ v),\ \operatorname{StaticStoreIR}(\mathsf{item},\ \mathsf{bs}))
\end{array}
$$

**(Lower-StaticInit-Item)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})\quad \mathsf{binding}\ =\ \langle \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \_\rangle \quad \Gamma \ \vdash \ \operatorname{LowerExpr}(\mathsf{init})\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle \quad \Gamma \ \vdash \ \operatorname{MatchPattern}(\mathsf{pat},\ v)\ \Downarrow \ B\quad \operatorname{BindOrder}(\mathsf{pat},\ B)\ =\ \mathsf{binds}\quad \Gamma \ \vdash \ \operatorname{InitPanicHandle}(m)\ \Downarrow \ \mathsf{IR}_{p} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticInitItem}(m,\ \mathsf{item})\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{e},\ \operatorname{StaticStoreIR}(\mathsf{item},\ \mathsf{binds}),\ \mathsf{IR}_{p})
\end{array}
$$

**(Lower-StaticInitItems-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticInitItems}(m,\ [])\ \Downarrow \ \varepsilon 
\end{array}
$$

**(Lower-StaticInitItems-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticInitItem}(m,\ \mathsf{item})\ \Downarrow \ \mathsf{IR}_{i}\quad \Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticInitItems}(m,\ \mathsf{items})\ \Downarrow \ \mathsf{IR}_{r} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticInitItems}(m,\ [\mathsf{item}]\ \mathbin{++} \ \mathsf{items})\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{i},\ \mathsf{IR}_{r})
\end{array}
$$

**(Lower-StaticInit)**

$$
\begin{array}{l}
\operatorname{StaticItems}(\operatorname{Project}(\Gamma ),\ m)\ =\ \mathsf{items}\quad \Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticInitItems}(m,\ \mathsf{items})\ \Downarrow \ \mathsf{IR} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticInit}(m)\ \Downarrow \ \mathsf{IR}
\end{array}
$$

**(InitCallIR)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{InitFn}(m)\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{InitCallIR}(m)\ \Downarrow \ \operatorname{SeqIR}(\operatorname{CallIR}(\mathsf{sym},\ [\mathsf{PanicOutName}]),\ \mathsf{PanicCheck})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Rev}([])\ =\ [] \\[0.16em]
\operatorname{Rev}([x]\ \mathbin{++} \ \mathsf{xs})\ =\ \operatorname{Rev}(\mathsf{xs})\ \mathbin{++} \ [x]
\end{array}
$$

**(Lower-StaticDeinitNames-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitNames}(\mathsf{path},\ \mathsf{item},\ [])\ \Downarrow \ \varepsilon 
\end{array}
$$

**(Lower-StaticDeinitNames-Cons-Resp)**

$$
\begin{array}{l}
\operatorname{StaticBindInfo}(\mathsf{path},\ x).\mathsf{resp}\ =\ \mathsf{resp}\quad \mathsf{sym}\ =\ \operatorname{StaticSym}(\mathsf{item},\ x)\quad \Gamma \ \vdash \ \operatorname{StateRef}(\mathsf{sym})\ \Downarrow \ \mathsf{slot}\quad \Gamma \ \vdash \ \operatorname{EmitDrop}(\operatorname{StaticType}(\mathsf{path},\ x),\ \operatorname{Load}(\mathsf{slot},\ \operatorname{StaticType}(\mathsf{path},\ x)))\ \Downarrow \ \mathsf{IR}_{d}\quad \Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitNames}(\mathsf{path},\ \mathsf{item},\ \mathsf{xs})\ \Downarrow \ \mathsf{IR}_{r} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitNames}(\mathsf{path},\ \mathsf{item},\ [x]\ \mathbin{++} \ \mathsf{xs})\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{d},\ \mathsf{IR}_{r})
\end{array}
$$

**(Lower-StaticDeinitNames-Cons-NoResp)**

$$
\begin{array}{l}
\operatorname{StaticBindInfo}(\mathsf{path},\ x).\mathsf{resp}\ \ne \ \mathsf{resp}\quad \Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitNames}(\mathsf{path},\ \mathsf{item},\ \mathsf{xs})\ \Downarrow \ \mathsf{IR}_{r} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitNames}(\mathsf{path},\ \mathsf{item},\ [x]\ \mathbin{++} \ \mathsf{xs})\ \Downarrow \ \mathsf{IR}_{r}
\end{array}
$$

**(Lower-StaticDeinit-Item)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})\quad \mathsf{binding}\ =\ \langle \mathsf{pat},\ \_,\ \_,\ \_,\ \_\rangle \quad \mathsf{xs}\ =\ \operatorname{Rev}(\operatorname{StaticBindList}(\mathsf{binding}))\quad \Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitNames}(\operatorname{PathOfModule}(m),\ \mathsf{item},\ \mathsf{xs})\ \Downarrow \ \mathsf{IR} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitItem}(m,\ \mathsf{item})\ \Downarrow \ \mathsf{IR}
\end{array}
$$

**(Lower-StaticDeinitItems-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitItems}(m,\ [])\ \Downarrow \ \varepsilon 
\end{array}
$$

**(Lower-StaticDeinitItems-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitItem}(m,\ \mathsf{item})\ \Downarrow \ \mathsf{IR}_{i}\quad \Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitItems}(m,\ \mathsf{items})\ \Downarrow \ \mathsf{IR}_{r} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitItems}(m,\ [\mathsf{item}]\ \mathbin{++} \ \mathsf{items})\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{i},\ \mathsf{IR}_{r})
\end{array}
$$

**(Lower-StaticDeinit)**

$$
\begin{array}{l}
\operatorname{StaticItems}(\operatorname{Project}(\Gamma ),\ m)\ =\ \mathsf{items}\quad \Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitItems}(m,\ \operatorname{Rev}(\mathsf{items}))\ \Downarrow \ \mathsf{IR} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinit}(m)\ \Downarrow \ \mathsf{IR}
\end{array}
$$

**(DeinitCallIR)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{DeinitFn}(m)\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DeinitCallIR}(m)\ \Downarrow \ \operatorname{SeqIR}(\operatorname{CallIR}(\mathsf{sym},\ [\mathsf{PanicOutName}]),\ \mathsf{PanicCheck})
\end{array}
$$

$$
\begin{array}{l}
\mathsf{AddrOfSessionSym}\ :\ \mathsf{Session}\ \times \ \mathsf{Symbol}\ \to \ \mathsf{Addr} \\[0.16em]
\mathsf{SessionPanicRecordOf}\ :\ \mathsf{Store}\ \times \ \mathsf{Session}\ \to \ \langle \mathsf{pending},\ \mathsf{code}\rangle  \\[0.16em]
\operatorname{SessionPanicRecordInit}(\sigma ,\ h)\ \Leftrightarrow \ \operatorname{SessionPanicRecordOf}(\sigma ,\ h)\ =\ \langle \mathsf{false},\ 0\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{HostedStateSym}(P,\ \mathsf{sym})\ \Leftrightarrow \ \operatorname{HostedLibrary}(P)\ \land \ ((\exists \ m,\ \mathsf{name}.\ m\ \in \ P.\mathsf{modules}\ \land \ \operatorname{StaticSymPath}(m,\ \mathsf{name})\ =\ \mathsf{sym})\ \lor \ (\exists \ m.\ m\ \in \ P.\mathsf{modules}\ \land \ \Gamma \ \vdash \ \operatorname{PoisonFlag}(m)\ \Downarrow \ \mathsf{sym})) \\[0.16em]
\operatorname{SharedLibraryStateSym}(P,\ \mathsf{sym})\ \Leftrightarrow \ \operatorname{SharedLibrary}(P)\ \land \ ((\exists \ m,\ \mathsf{name}.\ m\ \in \ P.\mathsf{modules}\ \land \ \operatorname{StaticSymPath}(m,\ \mathsf{name})\ =\ \mathsf{sym})\ \lor \ (\exists \ m.\ m\ \in \ P.\mathsf{modules}\ \land \ \Gamma \ \vdash \ \operatorname{PoisonFlag}(m)\ \Downarrow \ \mathsf{sym})) \\[0.16em]
\operatorname{RawExportLibrary}(P)\ \Leftrightarrow \ \operatorname{SharedLibrary}(P)\ \land \ \operatorname{RawExports}(P)\ \ne \ []\ \land \ \lnot \ \operatorname{HostedLibrary}(P) \\[0.16em]
\operatorname{RawLibraryStateSym}(P,\ \mathsf{sym})\ \Leftrightarrow \ \operatorname{RawExportLibrary}(P)\ \land \ \operatorname{SharedLibraryStateSym}(P,\ \mathsf{sym}) \\[0.16em]
\mathsf{HostedStateJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{SessionStateInitSigma}(P,\ h,\ \sigma )\ \Downarrow \ \sigma ',\ \Gamma \ \vdash \ \operatorname{SessionStateDestroySigma}(P,\ h,\ \sigma )\ \Downarrow \ \sigma '\}
\end{array}
$$

A conforming implementation MUST ensure that whenever `Γ ⊢ SessionStateInitSigma(P, h, σ) ⇓ σ'`, `ReadAddr(σ', AddrOfSessionSym(h, sym))` is defined for every `sym` satisfying `HostedStateSym(P, sym)`, and the initial contents of that cell equal the value denoted by the `GlobalConst` or `GlobalZero` template emitted for `sym` by §§24.4.1, 24.7.8, and 24.7.13.

A conforming implementation MUST ensure that whenever `Γ ⊢ SessionStateDestroySigma(P, h, σ) ⇓ σ'`, the cells previously reachable at `AddrOfSessionSym(h, sym)` for `HostedStateSym(P, sym)` are no longer live.

For `HostedLibrary(P)` as defined by §23.3.10, every user-static storage cell, poison flag, and boundary panic record consumed by Chapters 6, 24.4, and 24.5 MUST be indexed by the live hosted session within the dynamic extent of `HostSessionInitSigma`, `HostedCallSigma`, and `HostSessionDestroySigma`. Within those hosted-session dynamic extents, every occurrence of `AddrOfSym(sym)` in those rules with `HostedStateSym(P, sym)` MUST be interpreted as `AddrOfSessionSym(h, sym)` for the active hosted session `h`, and every boundary panic-record operation MUST be interpreted through `SessionPanicRecordOf(_, h)`. For `HostedLibrary(P) ∧ SharedLibrary(P)`, when execution occurs outside those hosted-session dynamic extents but within one live loaded library image `i`, every occurrence of `AddrOfSym(sym)` in Chapters 6, 24.4, and 24.5 with `HostedStateSym(P, sym)` MUST instead be interpreted as `AddrOfImageSym(i, sym)`, and every boundary panic-record operation MUST be interpreted through `ImagePanicRecordOf(_, i)`. Executables and libraries that are not shared libraries continue to use the process-global interpretation of `AddrOfSym(sym)` and `PanicRecordOf(_)` outside hosted-session dynamic extents.

### 24.4.2 Initialization Order, Poisoning, and Project Lifecycle

Section §11.5.4 supplies the eager static-initialization dependency graph `G_e`. This section defines only the ordering and execution semantics that consume that graph.

$$
\begin{array}{l}
\operatorname{Vertices}(G_{e})\ =\ V\ \Leftrightarrow \ G_{e}\ =\ \langle V,\ E\rangle  \\[0.16em]
\operatorname{Edges}(G_{e})\ =\ E\ \Leftrightarrow \ G_{e}\ =\ \langle V,\ E\rangle  \\[0.16em]
\operatorname{Index}(L,\ x)\ =\ i\ \Leftrightarrow \ 0\ \le \ i\ <\ \mid L\mid \ \land \ L[i]\ =\ x \\[0.16em]
\operatorname{TopoOrder}(G_{e},\ L)\ \Leftrightarrow \ \operatorname{Distinct}(L)\ \land \ \operatorname{Set}(L)\ =\ \operatorname{Vertices}(G_{e})\ \land \ \forall \ (u,\ v)\ \in \ \operatorname{Edges}(G_{e}).\ \operatorname{Index}(L,\ u)\ <\ \operatorname{Index}(L,\ v) \\[0.16em]
\mathsf{Incomparable}\_\{G_{e}\}(u,\ v)\ \Leftrightarrow \ \lnot \ \operatorname{Reachable}(u,\ v,\ \operatorname{Edges}(G_{e}))\ \land \ \lnot \ \operatorname{Reachable}(v,\ u,\ \operatorname{Edges}(G_{e})) \\[0.16em]
\operatorname{TopoTieBreak}(G_{e},\ L,\ P)\ \Leftrightarrow \ \forall \ u,\ v\ \in \ \operatorname{Vertices}(G_{e}).\ \mathsf{Incomparable}\_\{G_{e}\}(u,\ v)\ \land \ \operatorname{Index}(P.\mathsf{modules},\ u)\ <\ \operatorname{Index}(P.\mathsf{modules},\ v)\ \Rightarrow \ \operatorname{Index}(L,\ u)\ <\ \operatorname{Index}(L,\ v) \\[0.16em]
\operatorname{Cycle}(G_{e})\ \Leftrightarrow \ \exists \ v\ \in \ \operatorname{Vertices}(G_{e}).\ \operatorname{Reachable}(v,\ v,\ \operatorname{Edges}(G_{e}))
\end{array}
$$

**(Topo-Ok)**

$$
\begin{array}{l}
\operatorname{Project}(\Gamma )\ =\ P\quad \Gamma \ \vdash \ G_{e}\ :\ \mathsf{DAG}\quad \operatorname{TopoOrder}(G_{e},\ L)\quad \operatorname{TopoTieBreak}(G_{e},\ L,\ P) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Topo}(G_{e})\ \Downarrow \ L
\end{array}
$$

**(Topo-Cycle)**

$$
\begin{array}{l}
\operatorname{Cycle}(G_{e})\quad c\ =\ \operatorname{Code}(\mathsf{Topo}-\mathsf{Cycle}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Topo}(G_{e})\ \Uparrow \ c
\end{array}
$$

$$
\begin{array}{l}
P\ =\ \operatorname{Project}(\Gamma ) \\[0.16em]
\operatorname{StaticInitOf}(\mathsf{item})\ =\ \mathsf{init}\ \Leftrightarrow \ \mathsf{item}\ =\ \operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})\ \land \ \mathsf{binding}\ =\ \langle \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \mathsf{sp}\rangle  \\[0.16em]
\operatorname{StaticInitOf}(\mathsf{item})\ =\ \bot \ \Leftrightarrow \ \mathsf{item}\ \notin \ \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_) \\[0.16em]
\operatorname{InitList}(m)\ =\ [\ \mathsf{init}\ \mid \ \mathsf{item}\ \in \ \operatorname{Items}(P,\ m)\ \land \ \operatorname{StaticInitOf}(\mathsf{item})\ =\ \mathsf{init}\ ]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{InitOrder}(G_{e})\ =\ L\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{Topo}(G_{e})\ \Downarrow \ L \\[0.16em]
\operatorname{InitPlan}(G_{e})\ =\ \mathbin{++} \_\{m\ \in \ \operatorname{InitOrder}(G_{e})\}\ \operatorname{InitList}(m)
\end{array}
$$

$$
\operatorname{DeinitOrder}(G_{e})\ =\ \operatorname{rev}(\operatorname{InitOrder}(G_{e}))
$$

$$
\operatorname{StaticBindOrder}(m)\ =\ \mathbin{++} \_\{\mathsf{item}\ \in \ \operatorname{StaticItems}(P,\ m),\ \mathsf{item}\ =\ \operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})\}\ [\langle \operatorname{PathOfModule}(m),\ x\rangle \ \mid \ x\ \in \ \operatorname{StaticBindList}(\mathsf{binding})]
$$

$$
\mathsf{GlobalStaticOrder}\ =\ \mathbin{++} \_\{m\ \in \ \operatorname{InitOrder}(G_{e})\}\ \operatorname{StaticBindOrder}(m)
$$

$$
\operatorname{DeinitList}(P)\ =\ \operatorname{rev}([\ \operatorname{DropStatic}(\mathsf{path},\ \mathsf{name})\ \mid \ \langle \mathsf{path},\ \mathsf{name}\rangle \ \in \ \mathsf{GlobalStaticOrder}\ \land \ \operatorname{StaticBindInfo}(\mathsf{path},\ \mathsf{name}).\mathsf{resp}\ =\ \mathsf{resp}\ ])
$$

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Eval}(e,\ \sigma )\ \Downarrow \ v\ \Leftrightarrow \ \exists \ \sigma '.\ \Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma ') \\[0.16em]
\Gamma \ \vdash \ \operatorname{Eval}(e,\ \sigma )\ \Uparrow \ \mathsf{panic}\ \Leftrightarrow \ \exists \ \sigma '.\ \Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma ')
\end{array}
$$

**(EmitInitPlan)**

$$
\begin{array}{l}
\mathsf{InitOrder}\ =\ [m_{1},\ \ldots ,\ m_{k}]\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{InitCallIR}(m_{i})\ \Downarrow \ \mathsf{IR}_{i}\quad \mathsf{IR}_{\mathsf{init}}\ =\ \operatorname{SeqIRList}([\mathsf{IR}_{1},\ \ldots ,\ \mathsf{IR}_{k}]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitInitPlan}(P)\ \Downarrow \ \mathsf{IR}_{\mathsf{init}}
\end{array}
$$

**(EmitInitPlan-Err)**

$$
\begin{array}{l}
\exists \ m\ \in \ \mathsf{InitOrder}.\ \Gamma \ \vdash \ \operatorname{InitFn}(m)\ \Uparrow  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitInitPlan}(P)\ \Uparrow 
\end{array}
$$

**(EmitDeinitPlan)**

$$
\begin{array}{l}
\mathsf{InitOrder}\ =\ [m_{1},\ \ldots ,\ m_{k}]\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{DeinitCallIR}(m_{i})\ \Downarrow \ \mathsf{IR}_{i}\quad \mathsf{IR}_{\mathsf{deinit}}\ =\ \operatorname{SeqIRList}(\operatorname{Rev}([\mathsf{IR}_{1},\ \ldots ,\ \mathsf{IR}_{k}])) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitDeinitPlan}(P)\ \Downarrow \ \mathsf{IR}_{\mathsf{deinit}}
\end{array}
$$

**(EmitDeinitPlan-Err)**

$$
\begin{array}{l}
\exists \ m\ \in \ \mathsf{InitOrder}.\ \Gamma \ \vdash \ \operatorname{DeinitFn}(m)\ \Uparrow  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitDeinitPlan}(P)\ \Uparrow 
\end{array}
$$

$$
\begin{array}{l}
\mathsf{InitState}\ =\ \{\operatorname{InitStart}(G_{e},\ L,\ \sigma ),\ \operatorname{InitMod}(L,\ \mathsf{mi},\ \mathsf{ii},\ P,\ \sigma ),\ \operatorname{InitDone}(\sigma ),\ \operatorname{InitPanic}(P,\ \sigma )\} \\[0.16em]
\operatorname{InitItem}(L,\ \mathsf{mi},\ \mathsf{ii})\ =\ e\ \Leftrightarrow \ \mathsf{mi}\ <\ \mid L\mid \ \land \ L[\mathsf{mi}]\ =\ m\ \land \ \operatorname{InitList}(m)[\mathsf{ii}]\ =\ e \\[0.16em]
\operatorname{InitLen}(L,\ \mathsf{mi})\ =\ k\ \Leftrightarrow \ \mathsf{mi}\ <\ \mid L\mid \ \land \ L[\mathsf{mi}]\ =\ m\ \land \ \mid \operatorname{InitList}(m)\mid \ =\ k
\end{array}
$$

**(Init-Start)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{InitStart}(G_{e},\ L,\ \sigma )\rangle \ \to \ \langle \operatorname{InitMod}(L,\ 0,\ 0,\ \emptyset ,\ \sigma )\rangle 
\end{array}
$$

**(Init-Step)**

$$
\begin{array}{l}
\operatorname{InitItem}(L,\ \mathsf{mi},\ \mathsf{ii})\ =\ e\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{InitMod}(L,\ \mathsf{mi},\ \mathsf{ii},\ P,\ \sigma )\rangle \ \to \ \langle \operatorname{InitMod}(L,\ \mathsf{mi},\ \mathsf{ii}\ +\ 1,\ P,\ \sigma ')\rangle 
\end{array}
$$

**(Init-Next-Module)**

$$
\begin{array}{l}
\operatorname{InitLen}(L,\ \mathsf{mi})\ =\ k\quad \mathsf{ii}\ =\ k \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{InitMod}(L,\ \mathsf{mi},\ \mathsf{ii},\ P,\ \sigma )\rangle \ \to \ \langle \operatorname{InitMod}(L,\ \mathsf{mi}\ +\ 1,\ 0,\ P,\ \sigma )\rangle 
\end{array}
$$

**(Init-Panic)**

$$
\begin{array}{l}
\operatorname{InitItem}(L,\ \mathsf{mi},\ \mathsf{ii})\ =\ e\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma ')\quad L[\mathsf{mi}]\ =\ m\quad P'\ =\ P\ \cup \ \{m\}\ \cup \ \{x\ \mid \ \operatorname{Reachable}(x,\ m,\ E_{\mathsf{val}}^\{\mathsf{eager}\})\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{InitMod}(L,\ \mathsf{mi},\ \mathsf{ii},\ P,\ \sigma )\rangle \ \to \ \langle \operatorname{InitPanic}(P',\ \sigma ')\rangle 
\end{array}
$$

**(Init-Done)**
mi = |L|

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{InitMod}(L,\ \mathsf{mi},\ \mathsf{ii},\ P,\ \sigma )\rangle \ \to \ \langle \operatorname{InitDone}(\sigma )\rangle 
\end{array}
$$

**(Init-Ok)**

$$
\begin{array}{l}
\langle \operatorname{InitStart}(G_{e},\ \operatorname{InitOrder}(G_{e}),\ \sigma )\rangle \ \to *\ \langle \operatorname{InitDone}(\sigma ')\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Init}(G_{e},\ \sigma )\ \Downarrow \ \sigma '
\end{array}
$$

**(Init-Fail)**

$$
\begin{array}{l}
\langle \operatorname{InitStart}(G_{e},\ \operatorname{InitOrder}(G_{e}),\ \sigma )\rangle \ \to *\ \langle \operatorname{InitPanic}(P,\ \sigma ')\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Init}(G_{e},\ \sigma )\ \Uparrow \ \operatorname{panic}(P)
\end{array}
$$

**(Deinit-Ok)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Cleanup}(\operatorname{DeinitList}(P),\ \sigma )\ \Downarrow \ (\mathsf{ok},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Deinit}(P,\ \sigma )\ \Downarrow \ \sigma '
\end{array}
$$

**(Deinit-Panic)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Cleanup}(\operatorname{DeinitList}(P),\ \sigma )\ \Downarrow \ (\mathsf{panic},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Deinit}(P,\ \sigma )\ \Uparrow \ \mathsf{panic}
\end{array}
$$

### 24.4.3 Entry Symbols and Context Construction

$$
\mathsf{EntryJudg}\ =\ \{\mathsf{EntrySym}\ \Downarrow \ \mathsf{sym},\ \mathsf{ContextInitSym}\ \Downarrow \ \mathsf{sym},\ \operatorname{EntryStub}(P)\ \Downarrow \ \mathsf{IRDecl}\}
$$

**(EntrySym-Decl)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{EntrySym}\ \Downarrow \ \operatorname{PathSig}([\texttt{"main"}])
\end{array}
$$

**(ContextInitSym-Decl)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{ContextInitSym}\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"context\_init"}])
\end{array}
$$

$$
\mathsf{ProcessInvocation}\ =\ \langle \mathsf{executable}_{\mathsf{path}},\ \mathsf{arguments},\ \mathsf{current}_{\mathsf{directory}}\rangle 
$$

$$
\begin{array}{l}
\operatorname{ProcessInvocationNormalization}(\mathsf{host})\ \Downarrow \ \mathsf{inv}\ \Leftrightarrow  \\[0.16em]
\ \mathsf{inv}.\mathsf{executable}_{\mathsf{path}}\ \mathsf{is}\ \mathsf{the}\ \mathsf{host}\ \mathsf{executable}\ \mathsf{path}\ \mathsf{normalized}\ \mathsf{to}\ \mathsf{UTF}-8\ \mathsf{text}\ \land  \\[0.16em]
\ \mathsf{inv}.\mathsf{arguments}\ \mathsf{is}\ \mathsf{the}\ \mathsf{ordered}\ \mathsf{list}\ \mathsf{of}\ \mathsf{host}\ \mathsf{command}\ \mathsf{arguments}\ \mathsf{after}\ \mathsf{the}\ \mathsf{executable}\ \mathsf{path}, \\[0.16em]
\quad \mathsf{each}\ \mathsf{normalized}\ \mathsf{to}\ \mathsf{UTF}-8\ \mathsf{text}\ \land  \\[0.16em]
\ \mathsf{inv}.\mathsf{current}_{\mathsf{directory}}\ \mathsf{is}\ \mathsf{the}\ \mathsf{host}\ \mathsf{current}\ \mathsf{working}\ \mathsf{directory}\ \mathsf{normalized}\ \mathsf{to}\ \mathsf{UTF}-8\ \mathsf{text}
\end{array}
$$

A conforming runtime MUST isolate platform-specific process startup, argv, path
encoding, and current-directory acquisition behind the runtime host/platform
boundary. Source programs observe only the normalized `System` methods defined
by `SystemInterface`.

$$
\begin{array}{l}
\operatorname{PanicRecordInit}(\sigma )\ \Leftrightarrow \ \operatorname{PanicRecordOf}(\sigma )\ =\ \langle \mathsf{false},\ 0\rangle  \\[0.16em]
\operatorname{EntryStubSpec}(P,\ \mathsf{IR}_{\mathsf{entry}})\ \Leftrightarrow \ \operatorname{Executable}(P)\ \land \ \exists \ d,\ \mathsf{main}_{\mathsf{sym}}.\ \operatorname{MainDecls}(P)\ =\ [d]\ \land \ \Gamma \ \vdash \ \operatorname{Mangle}(d)\ \Downarrow \ \mathsf{main}_{\mathsf{sym}}\ \land \ \forall \ \sigma .\ \exists \ \mathsf{ctx},\ \mathsf{arg},\ \mathsf{ret},\ c,\ \sigma_{1} ,\ \sigma_{2} ,\ \sigma_{3} . \\[0.16em]
\ \operatorname{ExecIRSigma}(\operatorname{CallIR}(\mathsf{ContextInitSym},\ []),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{ctx}),\ \sigma_{1} )\ \land \ \operatorname{ContextBundleBuild}(\operatorname{StripPerm}(\operatorname{MainArgType}(d)),\ \mathsf{ctx})\ \Downarrow \ \mathsf{arg}\ \land \ \operatorname{PanicRecordInit}(\sigma_{1} )\ \land \ \operatorname{ExecIRSigma}(\operatorname{CallIR}(\mathsf{main}_{\mathsf{sym}},\ [\mathsf{arg},\ \mathsf{PanicOutName}]),\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(\mathsf{ret}),\ \sigma_{2} )\ \land  \\[0.16em]
\ (\operatorname{PanicRecordOf}(\sigma_{2} )\ =\ \langle \mathsf{true},\ c\rangle \ \Rightarrow \ \operatorname{ExecIRSigma}(\operatorname{CallIR}(\mathsf{PanicSym},\ [c]),\ \sigma_{2} )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma_{3} ))\ \land  \\[0.16em]
\ (\operatorname{PanicRecordOf}(\sigma_{2} )\ =\ \langle \mathsf{false},\ c\rangle \ \Rightarrow \ \exists \ \mathsf{IR}_{d}.\ \Gamma \ \vdash \ \operatorname{EmitDeinitPlan}(P)\ \Downarrow \ \mathsf{IR}_{d}\ \land \ \operatorname{ExecIRSigma}(\mathsf{IR}_{d},\ \sigma_{2} )\ \Downarrow \ (\operatorname{Val}(()),\ \sigma_{3} ))\ \land  \\[0.16em]
\ (\operatorname{PanicRecordOf}(\sigma_{2} )\ =\ \langle \mathsf{true},\ c\rangle \ \Rightarrow \ \operatorname{ExecIRSigma}(\mathsf{IR}_{\mathsf{entry}},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma_{3} ))\ \land  \\[0.16em]
\ (\operatorname{PanicRecordOf}(\sigma_{2} )\ =\ \langle \mathsf{false},\ c\rangle \ \Rightarrow \ \operatorname{ExecIRSigma}(\mathsf{IR}_{\mathsf{entry}},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{ret}),\ \sigma_{3} ))
\end{array}
$$

**(EntryStub-Decl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \mathsf{EntrySym}\ \Downarrow \ \mathsf{sym}\quad \operatorname{EntryStubSpec}(P,\ \mathsf{IR}_{\mathsf{entry}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EntryStub}(P)\ \Downarrow \ \operatorname{ProcIR}(\mathsf{sym},\ [],\ \operatorname{TypePrim}(\texttt{"i32"}),\ \mathsf{IR}_{\mathsf{entry}})
\end{array}
$$

**(EntrySym-Err)**
EntrySym undefined

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{EntrySym}\ \Uparrow 
\end{array}
$$

**(EntryStub-Err)**
EntryStub(P) undefined

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EntryStub}(P)\ \Uparrow 
\end{array}
$$

### 24.4.4 Library Images and Hosted Library Sessions

$$
\mathsf{LibraryImageJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{LibraryImageInitSigma}(P,\ i,\ \sigma )\ \Downarrow \ \sigma ',\ \Gamma \ \vdash \ \operatorname{RawLibraryCallSigma}(P,\ i,\ d,\ \mathsf{vs},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma '),\ \Gamma \ \vdash \ \operatorname{LibraryImageDestroySigma}(P,\ i,\ \sigma )\ \Downarrow \ \sigma '\}
$$
LibraryImageHandle(i) is an abstract predicate over loaded shared-library images.

$$
\begin{array}{l}
\operatorname{LibraryImageValid}(P,\ i,\ \sigma )\ \Leftrightarrow \ \operatorname{LibraryImageHandle}(i)\ \land \ \operatorname{LibraryImageOwner}(i)\ =\ P\ \land \ \operatorname{LibraryImageLive}(i,\ \sigma ) \\[0.16em]
\mathsf{LibraryImageOwner}\ :\ \mathsf{LibraryImage}\ \to \ \mathsf{Project} \\[0.16em]
\mathsf{LibraryImageLive}\ :\ \mathsf{LibraryImage}\ \times \ \mathsf{Store}\ \to \ \mathsf{Bool} \\[0.16em]
\mathsf{AddrOfImageSym}\ :\ \mathsf{LibraryImage}\ \times \ \mathsf{Symbol}\ \to \ \mathsf{Addr} \\[0.16em]
\mathsf{ImagePanicRecordOf}\ :\ \mathsf{Store}\ \times \ \mathsf{LibraryImage}\ \to \ \langle \mathsf{pending},\ \mathsf{code}\rangle  \\[0.16em]
\operatorname{ImagePanicRecordInit}(\sigma ,\ i)\ \Leftrightarrow \ \operatorname{ImagePanicRecordOf}(\sigma ,\ i)\ =\ \langle \mathsf{false},\ 0\rangle  \\[0.16em]
\operatorname{DistinctLibraryImageState}(\sigma )\ \Leftrightarrow \ \forall \ i_{1},\ i_{2}.\ i_{1}\ \ne \ i_{2}\ \land \ \operatorname{LibraryImageLive}(i_{1},\ \sigma )\ \land \ \operatorname{LibraryImageLive}(i_{2},\ \sigma )\ \Rightarrow \ \forall \ \mathsf{sym}.\ (\operatorname{SharedLibraryStateSym}(\operatorname{LibraryImageOwner}(i_{1}),\ \mathsf{sym})\ \lor \ \operatorname{SharedLibraryStateSym}(\operatorname{LibraryImageOwner}(i_{2}),\ \mathsf{sym}))\ \Rightarrow \ \operatorname{AddrOfImageSym}(i_{1},\ \mathsf{sym})\ \ne \ \operatorname{AddrOfImageSym}(i_{2},\ \mathsf{sym})
\end{array}
$$

A conforming implementation MUST ensure `DistinctLibraryImageState(σ)` for every store `σ`.
A conforming implementation MUST ensure that every successful `LibraryImageInitSigma(P, i, σ) ⇓ σ'` establishes `LibraryImageLive(i, σ')`, every successful `RawLibraryCallSigma(P, i, d, vs, σ) ⇓ (out, σ')` establishes `LibraryImageLive(i, σ')`, and every successful `LibraryImageDestroySigma(P, i, σ) ⇓ σ'` establishes `¬ LibraryImageLive(i, σ')`.
A conforming implementation MUST ensure that whenever `Γ ⊢ LibraryImageInitSigma(P, i, σ) ⇓ σ'`, `ReadAddr(σ', AddrOfImageSym(i, sym))` is defined for every `sym` satisfying `SharedLibraryStateSym(P, sym)`, and the initial contents of that cell equal the value denoted by the `GlobalConst` or `GlobalZero` template emitted for `sym` by §§24.4.1, 24.7.8, and 24.7.13.
A conforming implementation MUST ensure that whenever `Γ ⊢ LibraryImageDestroySigma(P, i, σ) ⇓ σ'`, the cells previously reachable at `AddrOfImageSym(i, sym)` for `SharedLibraryStateSym(P, sym)` are no longer live.
For `SharedLibrary(P)`, within the dynamic extent of `LibraryImageInitSigma(P, i, σ)` and `LibraryImageDestroySigma(P, i, σ)`, every occurrence of `AddrOfSym(sym)` in Chapters 6, 24.4, and 24.5 with `SharedLibraryStateSym(P, sym)` MUST be interpreted as `AddrOfImageSym(i, sym)` for the active loaded image `i`, and every boundary panic-record operation MUST be interpreted through `ImagePanicRecordOf(_, i)`. For `RawExportLibrary(P)`, that same image interpretation also governs `RawLibraryCallSigma(P, i, d, vs, σ)`.
If initialization of one module `m_j` within `LibraryImageInitSigma(P, i, σ)` or `HostSessionInitSigma(P, σ)` panics after only a strict prefix of that module's responsible static bindings has completed `StaticStoreIR`, cleanup MUST be limited to the successfully initialized prefix. The implementation MUST execute `DropStaticActionOut(m_j, x_t), ..., DropStaticActionOut(m_j, x_1)` only for the completed prefix `[x_1, ..., x_t]` in reverse order, MUST NOT execute the remaining static deinit actions of `m_j`, MUST execute full module deinit only for the earlier modules whose init completed successfully, and MUST NOT deinitialize any later module.

A raw export call from foreign code on `RawExportLibrary(P)` occurs only with one live loaded library image `i` owned by `P`. Before the first raw export call through a newly loaded image, the implementation MUST establish that live image by `LibraryImageInitSigma(P, i, σ)`. Later raw export calls through the same live image MUST reuse that image-owned state. On library unload of that live image, the implementation MUST execute `LibraryImageDestroySigma(P, i, σ)` exactly once.
An ordinary Ultraviolet call that crosses a shared-library link boundary into `SharedLibrary(P)` likewise occurs only with one live loaded library image `i` owned by `P`. Before the first such linked call through a newly loaded image, the implementation MUST establish that live image by `LibraryImageInitSigma(P, i, σ)`. Later linked calls through the same live image MUST reuse that image-owned state. On library unload of that live image, the implementation MUST execute `LibraryImageDestroySigma(P, i, σ)` exactly once.
On targets whose shared-library linker selects one loader entrypoint symbol for process attach/detach, a conforming backend MUST emit exactly one backend-generated loader entrypoint for each linked image of `SharedLibrary(P)`. That loader entrypoint is not a user-declared `ProcedureDecl`. It MUST establish `LibraryImageInitSigma(P, i, σ)` before user code first becomes callable from that image, MUST execute `LibraryImageDestroySigma(P, i, σ)` on image unload, and MUST NOT expose any additional capability-bearing parameter to Ultraviolet user code.

**(LibraryImageInitSigma)**

$$
\begin{array}{l}
\operatorname{SharedLibrary}(P)\quad \operatorname{LibraryImageHandle}(i)\quad \operatorname{LibraryImageOwner}(i)\ =\ P\quad \operatorname{ImagePanicRecordInit}(\sigma ,\ i)\quad \Gamma \ \vdash \ \operatorname{Init}(G_{e},\ \sigma )\ \Downarrow \ \sigma ' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LibraryImageInitSigma}(P,\ i,\ \sigma )\ \Downarrow \ \sigma '
\end{array}
$$

**(RawLibraryCallSigma-Ok)**

$$
\begin{array}{l}
\operatorname{LibraryImageValid}(P,\ i,\ \sigma )\quad \operatorname{RawExportLibrary}(P)\quad d\ \in \ \operatorname{RawExports}(P)\quad \Gamma \ \vdash \ \operatorname{ApplyProcSigma}(d,\ \mathsf{vs},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RawLibraryCallSigma}(P,\ i,\ d,\ \mathsf{vs},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')
\end{array}
$$

**(LibraryImageDestroySigma)**

$$
\begin{array}{l}
\operatorname{LibraryImageValid}(P,\ i,\ \sigma )\quad \operatorname{SharedLibrary}(P)\quad \Gamma \ \vdash \ \operatorname{Deinit}(P,\ \sigma )\ \Downarrow \ \sigma ' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LibraryImageDestroySigma}(P,\ i,\ \sigma )\ \Downarrow \ \sigma '
\end{array}
$$

$$
\mathsf{HostedSessionJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{HostSessionInitSigma}(P,\ \sigma )\ \Downarrow \ (\operatorname{Val}(h),\ \sigma '),\ \Gamma \ \vdash \ \operatorname{HostedCallSigma}(P,\ h,\ d,\ \mathsf{vs},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma '),\ \Gamma \ \vdash \ \operatorname{HostSessionDestroySigma}(P,\ h,\ \sigma )\ \Downarrow \ \sigma '\}
$$
SessionHandle(h) is an abstract predicate over hosted-library session handles. At the foreign ABI, hosted-library session handles are represented as nonzero `usize` tokens.

$$
\begin{array}{l}
\operatorname{SessionValid}(P,\ h,\ \sigma )\ \Leftrightarrow \ \operatorname{SessionHandle}(h)\ \land \ \operatorname{HostedSessionOwner}(h)\ =\ P\ \land \ \operatorname{SessionLive}(h,\ \sigma ) \\[0.16em]
\operatorname{SessionReady}(P,\ h,\ \sigma )\ \Leftrightarrow \ \operatorname{SessionValid}(P,\ h,\ \sigma )\ \land \ \lnot \ \operatorname{SessionBusy}(h,\ \sigma ) \\[0.16em]
\mathsf{HostedSessionOwner}\ :\ \mathsf{Session}\ \to \ \mathsf{Project} \\[0.16em]
\mathsf{SessionContext}\ :\ \mathsf{Session}\ \to \ \mathsf{Value} \\[0.16em]
\mathsf{HostedGrantedCaps}\ :\ \mathsf{Project}\ \times \ \mathsf{Session}\ \to \ \mathcal{P} (\mathsf{CapToken}) \\[0.16em]
\operatorname{HostedGrantVisible}(P,\ h,\ T)\ \Leftrightarrow \ \operatorname{CapInType}(\operatorname{StripPerm}(T))\ \subseteq \ \operatorname{HostedGrantedCaps}(P,\ h) \\[0.16em]
\mathsf{SessionLive}\ :\ \mathsf{Session}\ \times \ \mathsf{Store}\ \to \ \mathsf{Bool} \\[0.16em]
\mathsf{SessionBusy}\ :\ \mathsf{Session}\ \times \ \mathsf{Store}\ \to \ \mathsf{Bool} \\[0.16em]
\operatorname{DistinctHostedState}(\sigma )\ \Leftrightarrow \ \forall \ h_{1},\ h_{2}.\ h_{1}\ \ne \ h_{2}\ \land \ \operatorname{SessionLive}(h_{1},\ \sigma )\ \land \ \operatorname{SessionLive}(h_{2},\ \sigma )\ \Rightarrow \ \forall \ \mathsf{sym}.\ (\operatorname{HostedStateSym}(\operatorname{HostedSessionOwner}(h_{1}),\ \mathsf{sym})\ \lor \ \operatorname{HostedStateSym}(\operatorname{HostedSessionOwner}(h_{2}),\ \mathsf{sym}))\ \Rightarrow \ \operatorname{AddrOfSessionSym}(h_{1},\ \mathsf{sym})\ \ne \ \operatorname{AddrOfSessionSym}(h_{2},\ \mathsf{sym})
\end{array}
$$

A conforming implementation MUST ensure `DistinctHostedState(σ)` for every store `σ`.
A conforming implementation MUST ensure that every successful `HostSessionInitSigma(P, σ) ⇓ (Val(h), σ')` establishes `SessionLive(h, σ') ∧ ¬ SessionBusy(h, σ') ∧ HostedGrantedCaps(P, h) = HostedRootCaps(P)`, every successful `HostedCallSigma(P, h, d, vs, σ) ⇓ (out, σ')` establishes `SessionLive(h, σ') ∧ ¬ SessionBusy(h, σ')`, and every successful `HostSessionDestroySigma(P, h, σ) ⇓ σ'` establishes `¬ SessionLive(h, σ')`.
A hosted-library session MUST NOT be entered concurrently or reentrantly. While one hosted call or destroy operation on `h` is in progress, the implementation MUST treat `SessionBusy(h, _)` as true for that operation and MUST reject any second hosted entry on the same session according to §23.3.12.

**(HostSessionInitSigma)**

$$
\begin{array}{l}
\operatorname{HostedLibrary}(P)\quad \Gamma \ \vdash \ \operatorname{ContextInitSigma}(\sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{ctx}}),\ \sigma_{0} )\quad \operatorname{SessionHandle}(h)\quad \operatorname{HostedSessionOwner}(h)\ =\ P\quad \operatorname{SessionContext}(h)\ =\ v_{\mathsf{ctx}}\quad \operatorname{HostedGrantedCaps}(P,\ h)\ =\ \operatorname{HostedRootCaps}(P)\quad \Gamma \ \vdash \ \operatorname{SessionStateInitSigma}(P,\ h,\ \sigma_{0} )\ \Downarrow \ \sigma_{s} \quad \operatorname{SessionPanicRecordInit}(\sigma_{s} ,\ h)\quad (\forall \ d\ \in \ \operatorname{HostExports}(P).\ \operatorname{HostContextParam}(d)\ =\ \langle \_,\ \_,\ T_{d}\rangle \ \Rightarrow \ \operatorname{HostedGrantVisible}(P,\ h,\ T_{d})\ \land \ \exists \ v_{d}.\ \operatorname{ContextBundleBuild}(\operatorname{StripPerm}(T_{d}),\ v_{\mathsf{ctx}})\ \Downarrow \ v_{d})\quad \Gamma \ \vdash \ \operatorname{Init}(G_{e},\ \sigma_{s} )\ \Downarrow \ \sigma_{1}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{HostSessionInitSigma}(P,\ \sigma )\ \Downarrow \ (\operatorname{Val}(h),\ \sigma_{1} )
\end{array}
$$

**(HostedCallSigma-Ok)**

$$
\begin{array}{l}
\operatorname{SessionReady}(P,\ h,\ \sigma )\quad \operatorname{HostedLibrary}(P)\quad \operatorname{HostExported}(d)\quad d\ \in \ \operatorname{HostExports}(P)\quad \operatorname{HostContextParam}(d)\ =\ \langle \_,\ \_,\ T_{\mathsf{ctx}}\rangle \quad \operatorname{HostedGrantVisible}(P,\ h,\ T_{\mathsf{ctx}})\quad \operatorname{ContextBundleBuild}(\operatorname{StripPerm}(T_{\mathsf{ctx}}),\ \operatorname{SessionContext}(h))\ \Downarrow \ v_{\mathsf{ctx}}\quad \Gamma \ \vdash \ \operatorname{ApplyProcSigma}(d,\ [v_{\mathsf{ctx}}]\ \mathbin{++} \ \mathsf{vs},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{HostedCallSigma}(P,\ h,\ d,\ \mathsf{vs},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')
\end{array}
$$

**(HostSessionDestroySigma)**

$$
\begin{array}{l}
\operatorname{SessionReady}(P,\ h,\ \sigma )\quad \Gamma \ \vdash \ \operatorname{Deinit}(P,\ \sigma )\ \Downarrow \ \sigma_{1} \quad \Gamma \ \vdash \ \operatorname{SessionStateDestroySigma}(P,\ h,\ \sigma_{1} )\ \Downarrow \ \sigma ' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{HostSessionDestroySigma}(P,\ h,\ \sigma )\ \Downarrow \ \sigma '
\end{array}
$$

### 24.4.5 Interpreter Entrypoint

$$
\begin{array}{l}
\mathsf{InterpJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{ContextInitSigma}(\sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{ctx}}),\ \sigma '),\ \Gamma \ \vdash \ \operatorname{InterpretProject}(P,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma '),\ \Gamma \ \vdash \ \operatorname{InterpretProject}(P,\ \sigma )\ \Uparrow \ \operatorname{panic}(P_{s})\} \\[0.16em]
\operatorname{ContextValue}(v)\ \Leftrightarrow \ \exists \ \mathsf{bits}.\ \operatorname{ValueBits}(\operatorname{TypePath}([\texttt{"Context"}]),\ v)\ =\ \mathsf{bits}
\end{array}
$$

**(ContextInitSigma)**
ContextValue(v_ctx)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ContextInitSigma}(\sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{ctx}}),\ \sigma )
\end{array}
$$

**(Interpret-Project-Ok)**

$$
\begin{array}{l}
\operatorname{Executable}(P)\quad \operatorname{MainDecls}(P)\ =\ [d]\quad \operatorname{MainSigOk}(d)\quad \Gamma \ \vdash \ \operatorname{ContextInitSigma}(\sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{ctx}}),\ \sigma_{0} )\quad \Gamma \ \vdash \ \operatorname{Init}(G_{e},\ \sigma_{0} )\ \Downarrow \ \sigma_{1} \quad \operatorname{ContextBundleBuild}(\operatorname{StripPerm}(\operatorname{MainArgType}(d)),\ v_{\mathsf{ctx}})\ \Downarrow \ v_{\mathsf{arg}}\quad \Gamma \ \vdash \ \operatorname{ApplyProcSigma}(d,\ [v_{\mathsf{arg}}],\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{2} )\quad \Gamma \ \vdash \ \operatorname{Deinit}(P,\ \sigma_{2} )\ \Downarrow \ \sigma_{3}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{InterpretProject}(P,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{3} )
\end{array}
$$

**(Interpret-Project-Init-Panic)**

$$
\begin{array}{l}
\operatorname{Executable}(P)\quad \operatorname{MainDecls}(P)\ =\ [d]\quad \operatorname{MainSigOk}(d)\quad \Gamma \ \vdash \ \operatorname{ContextInitSigma}(\sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{ctx}}),\ \sigma_{0} )\quad \Gamma \ \vdash \ \operatorname{Init}(G_{e},\ \sigma_{0} )\ \Uparrow \ \operatorname{panic}(P_{s}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{InterpretProject}(P,\ \sigma )\ \Uparrow \ \operatorname{panic}(P_{s})
\end{array}
$$

**(Interpret-Project-Main-Ctrl)**

$$
\begin{array}{l}
\operatorname{Executable}(P)\quad \operatorname{MainDecls}(P)\ =\ [d]\quad \operatorname{MainSigOk}(d)\quad \Gamma \ \vdash \ \operatorname{ContextInitSigma}(\sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{ctx}}),\ \sigma_{0} )\quad \Gamma \ \vdash \ \operatorname{Init}(G_{e},\ \sigma_{0} )\ \Downarrow \ \sigma_{1} \quad \operatorname{ContextBundleBuild}(\operatorname{StripPerm}(\operatorname{MainArgType}(d)),\ v_{\mathsf{ctx}})\ \Downarrow \ v_{\mathsf{arg}}\quad \Gamma \ \vdash \ \operatorname{ApplyProcSigma}(d,\ [v_{\mathsf{arg}}],\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} )\quad \kappa \ \in \ \{\mathsf{Panic},\ \mathsf{Abort}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{InterpretProject}(P,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} )
\end{array}
$$

**(Interpret-Project-Deinit-Panic)**

$$
\begin{array}{l}
\operatorname{Executable}(P)\quad \operatorname{MainDecls}(P)\ =\ [d]\quad \operatorname{MainSigOk}(d)\quad \Gamma \ \vdash \ \operatorname{ContextInitSigma}(\sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{ctx}}),\ \sigma_{0} )\quad \Gamma \ \vdash \ \operatorname{Init}(G_{e},\ \sigma_{0} )\ \Downarrow \ \sigma_{1} \quad \operatorname{ContextBundleBuild}(\operatorname{StripPerm}(\operatorname{MainArgType}(d)),\ v_{\mathsf{ctx}})\ \Downarrow \ v_{\mathsf{arg}}\quad \Gamma \ \vdash \ \operatorname{ApplyProcSigma}(d,\ [v_{\mathsf{arg}}],\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{2} )\quad \Gamma \ \vdash \ \operatorname{Deinit}(P,\ \sigma_{2} )\ \Uparrow \ \mathsf{panic} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{InterpretProject}(P,\ \sigma )\ \Uparrow \ \mathsf{panic}
\end{array}
$$

## 24.5 Cleanup, Drop, and Unwinding Framework

Dynamic scope-stack, binding-state, and region-stack machinery are defined by Chapter 6. This section defines only the cleanup, panic, drop, and unwinding framework that consumes those runtime structures.

### 24.5.1 Cleanup Lowering Interface

$$
\mathsf{CleanupJudg}\ =\ \{\mathsf{EmitDrop},\ \mathsf{CleanupPlan},\ \mathsf{LowerPanic},\ \mathsf{PanicSym},\ \mathsf{ClearPanic},\ \mathsf{PanicCheck}\}
$$

**(CleanupPlan)**

$$
\begin{array}{l}
\mathsf{cs}\ =\ \operatorname{CleanupList}(\mathsf{scope}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CleanupPlan}(\mathsf{scope})\ \Downarrow \ \mathsf{cs}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{EmitDropSpec}(\Gamma ,\ T,\ v,\ \mathsf{IR})\ \Leftrightarrow \ \forall \ \sigma ,\ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\ \land \ \Gamma \ \vdash \ \operatorname{DropValue}(T,\ v,\ \emptyset )\ \Downarrow \ \sigma ' \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitDrop}(T,\ v)\ \Downarrow \ \mathsf{IR}\ \Leftrightarrow \ \operatorname{EmitDropSpec}(\Gamma ,\ T,\ v,\ \mathsf{IR}).
\end{array}
$$

### 24.5.2 Panic Record and Panic Lowering

$$
\operatorname{PanicOutAddr}(\sigma )\ =\ \mathsf{addr}\ \Leftrightarrow \ \operatorname{LookupVal}(\sigma ,\ \mathsf{PanicOutName})\ =\ \operatorname{RawPtr}(\texttt{mut},\ \mathsf{addr})
$$

$$
\operatorname{PanicRecordOf}(\sigma )\ =\ \langle p,\ c\rangle \ \Leftrightarrow \ \operatorname{PanicOutAddr}(\sigma )\ =\ \mathsf{addr}\ \land \ \operatorname{ReadAddr}(\sigma ,\ \operatorname{FieldAddr}(\mathsf{PanicRecord},\ \mathsf{addr},\ \texttt{"panic"}))\ =\ p\ \land \ \operatorname{ReadAddr}(\sigma ,\ \operatorname{FieldAddr}(\mathsf{PanicRecord},\ \mathsf{addr},\ \texttt{"code"}))\ =\ c
$$

$$
\operatorname{WritePanicRecord}(\sigma ,\ p,\ c)\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{WriteAddr}(\sigma ,\ \operatorname{FieldAddr}(\mathsf{PanicRecord},\ \operatorname{PanicOutAddr}(\sigma ),\ \texttt{"panic"}),\ p)\ \Downarrow \ \sigma_{1} \ \land \ \operatorname{WriteAddr}(\sigma_{1} ,\ \operatorname{FieldAddr}(\mathsf{PanicRecord},\ \operatorname{PanicOutAddr}(\sigma ),\ \texttt{"code"}),\ c)\ \Downarrow \ \sigma '
$$

$$
\Gamma \ \vdash \ \operatorname{InitPanicHandle}(m)\ \Downarrow \ \mathsf{IR}\ \Leftrightarrow \ \forall \ \sigma .\ (\operatorname{PanicRecordOf}(\sigma )\ =\ \langle \mathsf{true},\ c\rangle \ \Rightarrow \ \exists \ \sigma '.\ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma ')\ \land \ \operatorname{ExecIRSigma}(\operatorname{SeqIR}(\operatorname{SetPoison}(m),\ \operatorname{LowerPanic}(\operatorname{InitPanic}(m))),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma '))\ \land \ (\operatorname{PanicRecordOf}(\sigma )\ =\ \langle \mathsf{false},\ c\rangle \ \Rightarrow \ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\operatorname{Val}(()),\ \sigma ))
$$
During lowering of one module-init procedure, the cleanup performed by `InitPanicHandle(m)` MUST be exactly the reverse of the currently completed responsible-static prefix of `m`. `InitPanicHandle(m)` MUST NOT execute the full `DeinitFn(m)` body.

**(PanicSym)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{PanicSym}\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"panic"}])
\end{array}
$$

$$
\mathsf{PanicReason}\ =\ \{\operatorname{ErrorExpr}(\mathsf{span}),\ \operatorname{ErrorStmt}(\mathsf{span}),\ \mathsf{DivZero},\ \mathsf{Overflow},\ \mathsf{Shift},\ \mathsf{Bounds},\ \mathsf{Cast},\ \mathsf{NullDeref},\ \mathsf{ExpiredDeref},\ \operatorname{InitPanic}(m),\ \mathsf{Other}\}.
$$

$$
\begin{array}{l}
\operatorname{PanicCode}(\operatorname{ErrorExpr}(\_))\ =\ 0\mathsf{x0001} \\[0.16em]
\operatorname{PanicCode}(\operatorname{ErrorStmt}(\_))\ =\ 0\mathsf{x0002} \\[0.16em]
\operatorname{PanicCode}(\mathsf{DivZero})\ =\ 0\mathsf{x0003} \\[0.16em]
\operatorname{PanicCode}(\mathsf{Overflow})\ =\ 0\mathsf{x0004} \\[0.16em]
\operatorname{PanicCode}(\mathsf{Shift})\ =\ 0\mathsf{x0005} \\[0.16em]
\operatorname{PanicCode}(\mathsf{Bounds})\ =\ 0\mathsf{x0006} \\[0.16em]
\operatorname{PanicCode}(\mathsf{Cast})\ =\ 0\mathsf{x0007} \\[0.16em]
\operatorname{PanicCode}(\mathsf{NullDeref})\ =\ 0\mathsf{x0008} \\[0.16em]
\operatorname{PanicCode}(\mathsf{ExpiredDeref})\ =\ 0\mathsf{x0009} \\[0.16em]
\operatorname{PanicCode}(\operatorname{InitPanic}(\_))\ =\ 0\mathsf{x000A} \\[0.16em]
\operatorname{PanicCode}(\mathsf{Other})\ =\ 0\mathsf{x00FF}.
\end{array}
$$

$$
\begin{array}{l}
\mathsf{PanicSite}\ =\ \{\mathsf{DivZeroCheck},\ \mathsf{OverflowCheck},\ \mathsf{ShiftCheck},\ \mathsf{BoundsCheck},\ \mathsf{CastCheck},\ \mathsf{NullDerefCheck},\ \mathsf{ExpiredDerefCheck},\ \operatorname{ErrorExprSite}(\mathsf{span}),\ \operatorname{ErrorStmtSite}(\mathsf{span}),\ \operatorname{InitPanicSite}(m),\ \mathsf{OtherSite}\}. \\[0.16em]
\operatorname{PanicReasonOf}(\mathsf{DivZeroCheck})\ =\ \mathsf{DivZero} \\[0.16em]
\operatorname{PanicReasonOf}(\mathsf{OverflowCheck})\ =\ \mathsf{Overflow} \\[0.16em]
\operatorname{PanicReasonOf}(\mathsf{ShiftCheck})\ =\ \mathsf{Shift} \\[0.16em]
\operatorname{PanicReasonOf}(\mathsf{BoundsCheck})\ =\ \mathsf{Bounds} \\[0.16em]
\operatorname{PanicReasonOf}(\mathsf{CastCheck})\ =\ \mathsf{Cast} \\[0.16em]
\operatorname{PanicReasonOf}(\mathsf{NullDerefCheck})\ =\ \mathsf{NullDeref} \\[0.16em]
\operatorname{PanicReasonOf}(\mathsf{ExpiredDerefCheck})\ =\ \mathsf{ExpiredDeref} \\[0.16em]
\operatorname{PanicReasonOf}(\operatorname{ErrorExprSite}(\mathsf{span}))\ =\ \operatorname{ErrorExpr}(\mathsf{span}) \\[0.16em]
\operatorname{PanicReasonOf}(\operatorname{ErrorStmtSite}(\mathsf{span}))\ =\ \operatorname{ErrorStmt}(\mathsf{span}) \\[0.16em]
\operatorname{PanicReasonOf}(\operatorname{InitPanicSite}(m))\ =\ \operatorname{InitPanic}(m) \\[0.16em]
\operatorname{PanicReasonOf}(\mathsf{OtherSite})\ =\ \mathsf{Other}
\end{array}
$$

$$
\Gamma \ \vdash \ \mathsf{ClearPanic}\ \Downarrow \ \mathsf{IR}\ \Leftrightarrow \ \forall \ \sigma ,\ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\ \land \ \operatorname{WritePanicRecord}(\sigma ,\ \mathsf{false},\ 0)\ \Downarrow \ \sigma '
$$

$$
\Gamma \ \vdash \ \mathsf{PanicCheck}\ \Downarrow \ \mathsf{IR}\ \Leftrightarrow \ \forall \ \sigma ,\ (\operatorname{PanicRecordOf}(\sigma )\ =\ \langle \mathsf{true},\ c\rangle \ \Rightarrow \ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma ))\ \land \ (\operatorname{PanicRecordOf}(\sigma )\ =\ \langle \mathsf{false},\ c\rangle \ \Rightarrow \ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\operatorname{Val}(()),\ \sigma )).
$$

$$
\Gamma \ \vdash \ \operatorname{LowerPanic}(\mathsf{reason})\ \Downarrow \ \mathsf{IR}\ \Leftrightarrow \ \forall \ \sigma .\ \exists \ \sigma '.\ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma ')\ \land \ \operatorname{WritePanicRecord}(\sigma ,\ \mathsf{true},\ \operatorname{PanicCode}(\mathsf{reason}))\ \Downarrow \ \sigma '
$$

### 24.5.3 Deterministic Destruction

$$
\operatorname{Responsible}(b)\ \Leftrightarrow \ \operatorname{BindInfo}(b).\mathsf{resp}\ =\ \mathsf{resp}
$$

$$
\begin{array}{l}
\mathsf{CleanupItem}\ \mathbin{::} =\ \operatorname{DropBinding}(b)\ \mid \ \operatorname{DropStatic}(\mathsf{path},\ \mathsf{name})\ \mid \ \operatorname{DeferBlock}(b) \\[0.16em]
\mathsf{DropStatus}\ =\ \{\mathsf{ok},\ \mathsf{panic}\} \\[0.16em]
\mathsf{DropJudg}\ =\ \{\operatorname{DropAction}(b)\ \Downarrow \ \sigma ',\ \operatorname{DropValue}(T,\ v,\ F)\ \Downarrow \ \sigma ',\ \operatorname{DropStaticAction}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ \sigma ',\ \operatorname{DropActionOut}(b)\ \Downarrow \ (c,\ \sigma '),\ \operatorname{DropValueOut}(T,\ v,\ F)\ \Downarrow \ (c,\ \sigma '),\ \operatorname{DropStaticActionOut}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ (c,\ \sigma ')\} \\[0.16em]
\operatorname{DropAction}(b)\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{DropActionOut}(b)\ \Downarrow \ (\mathsf{ok},\ \sigma ') \\[0.16em]
\operatorname{DropValue}(T,\ v,\ F)\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{DropValueOut}(T,\ v,\ F)\ \Downarrow \ (\mathsf{ok},\ \sigma ') \\[0.16em]
\operatorname{DropStaticAction}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{DropStaticActionOut}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ (\mathsf{ok},\ \sigma ') \\[0.16em]
\operatorname{RecordType}(T)\ \Leftrightarrow \ \exists \ p.\ T\ =\ \operatorname{TypePath}(p)\ \land \ \operatorname{RecordDecl}(p)\ \mathsf{defined} \\[0.16em]
\operatorname{DropCall}(T,\ v,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\ \mathsf{relation} \\[0.16em]
\lnot \ \operatorname{DropType}(T)\ \Rightarrow \ \operatorname{DropCall}(T,\ v,\ \sigma )\ \Downarrow \ (\operatorname{Val}(()),\ \sigma ) \\[0.16em]
\operatorname{DropType}(T)\ \land \ \operatorname{BuiltinDropType}(T)\ \land \ T\ =\ \operatorname{TypeString}(\texttt{@Managed})\ \land \ \Gamma \ \vdash \ \mathsf{StringDropSym}\ \Downarrow \ \mathsf{sym}\ \land \ \operatorname{ExecIRSigma}(\operatorname{CallIR}(\mathsf{sym},\ [v]),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\ \Rightarrow \ \operatorname{DropCall}(T,\ v,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\[0.16em]
\operatorname{DropType}(T)\ \land \ \operatorname{BuiltinDropType}(T)\ \land \ T\ =\ \operatorname{TypeBytes}(\texttt{@Managed})\ \land \ \Gamma \ \vdash \ \mathsf{BytesDropSym}\ \Downarrow \ \mathsf{sym}\ \land \ \operatorname{ExecIRSigma}(\operatorname{CallIR}(\mathsf{sym},\ [v]),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\ \Rightarrow \ \operatorname{DropCall}(T,\ v,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\[0.16em]
\operatorname{DropType}(T)\ \land \ \lnot \ \operatorname{BuiltinDropType}(T)\ \land \ \operatorname{LookupMethod}(\operatorname{StripPerm}(T),\ \texttt{"drop"})\ =\ m\ \land \ \operatorname{Sig_T}(\operatorname{StripPerm}(T),\ m)\ =\ \langle \operatorname{TypePerm}(\texttt{unique},\ \operatorname{StripPerm}(T)),\ [],\ \operatorname{TypePrim}(\texttt{"()"})\rangle \ \land \ \operatorname{BindParams}(\operatorname{MethodParamsDecl}(\operatorname{StripPerm}(T),\ m),\ [v])\ =\ \mathsf{binds}\ \land \ \operatorname{BlockEnter}(\sigma ,\ \mathsf{binds})\ \Downarrow \ (\sigma_{1} ,\ \mathsf{scope})\ \land \ \Gamma \ \vdash \ \operatorname{EvalBlockBodySigma}(m.\mathsf{body},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out}_{1},\ \sigma_{2} )\ \land \ \operatorname{BlockExit}(\sigma_{2} ,\ \mathsf{scope},\ \mathsf{out}_{1})\ \Downarrow \ (\mathsf{out}_{2},\ \sigma_{3} )\ \land \ \operatorname{ReturnOut}(\mathsf{out}_{2})\ =\ \mathsf{out}\ \Rightarrow \ \operatorname{DropCall}(T,\ v,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} ) \\[0.16em]
\operatorname{ReleaseValue}(T,\ v,\ \sigma )\ \Downarrow \ \sigma '\ \mathsf{relation} \\[0.16em]
\operatorname{ReleaseValue}(T,\ v,\ \sigma )\ \Downarrow \ \sigma '\ \Leftrightarrow \ \sigma '\ =\ \sigma  \\[0.16em]
\operatorname{DropChildren}(T,\ v,\ F)\ = \\[0.16em]
\ [\langle T_{i},\ v_{i}\rangle \ \mid \ \langle f_{i},\ T_{i}\rangle \ \in \ \operatorname{FieldsRev}(R),\ f_{i}\ \notin \ F,\ \operatorname{FieldValue}(v,\ f_{i})\ =\ v_{i}]\quad \mathsf{if}\ T\ =\ \operatorname{TypePath}(p)\ \land \ \operatorname{RecordDecl}(p)\ =\ R \\[0.16em]
\ [\langle T_{i},\ v_{i}\rangle \ \mid \ T\ =\ \operatorname{TypeTuple}([T_{0},\ \ldots ,\ T\_\{n-1\}]),\ i\ \in \ \operatorname{rev}([0,\ \ldots ,\ n-1]),\ \operatorname{TupleValue}(v,\ i)\ =\ v_{i}]\quad \mathsf{if}\ T\ =\ \operatorname{TypeTuple}(\_) \\[0.16em]
\ [\langle T_{e},\ v_{i}\rangle \ \mid \ T\ =\ \operatorname{TypeArray}(T_{e},\ n),\ i\ \in \ \operatorname{rev}([0,\ \ldots ,\ n-1]),\ \operatorname{IndexValue}(v,\ i)\ =\ v_{i}]\quad \mathsf{if}\ T\ =\ \operatorname{TypeArray}(\_,\ \_) \\[0.16em]
\ [\langle T',\ v'\rangle \ \mid \ \operatorname{UnionCase}(v)\ =\ \langle T',\ v'\rangle ]\quad \mathsf{if}\ T\ =\ \operatorname{TypeUnion}(\_) \\[0.16em]
\ [\langle \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S),\ v_{s}\rangle \ \mid \ v\ =\ \langle S,\ v_{s}\rangle ]\quad \mathsf{if}\ T\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\ \land \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M \\[0.16em]
\ [\langle T_{i},\ v_{i}\rangle \ \mid \ \langle f_{i},\ T_{i}\rangle \ \in \ \operatorname{ModalPayload}(\mathsf{modal}_{\mathsf{ref}},\ S),\ \operatorname{FieldValue}(v,\ f_{i})\ =\ v_{i}]\quad \mathsf{if}\ T\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\ \land \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M \\[0.16em]
\ []\quad \mathsf{otherwise} \\[0.16em]
\operatorname{DropList}([],\ \sigma )\ \Downarrow \ (\mathsf{ok},\ \sigma ) \\[0.16em]
\operatorname{DropList}([\langle T,\ v\rangle ]\ \mathbin{++} \ \mathsf{xs},\ \sigma )\ \Downarrow \ (c,\ \sigma '')\ \Leftrightarrow \ \operatorname{DropValueOut}(T,\ v,\ \emptyset )\ \Downarrow \ (c_{1},\ \sigma ')\ \land \ (c_{1}\ =\ \mathsf{panic}\ \Rightarrow \ c\ =\ \mathsf{panic}\ \land \ \sigma ''\ =\ \sigma ')\ \land \ (c_{1}\ =\ \mathsf{ok}\ \Rightarrow \ \operatorname{DropList}(\mathsf{xs},\ \sigma ')\ \Downarrow \ (c,\ \sigma ''))
\end{array}
$$

**(DropAction-Moved)**

$$
\begin{array}{l}
\operatorname{BindState}(\sigma ,\ b)\ =\ \mathsf{Moved} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DropActionOut}(b)\ \Downarrow \ (\mathsf{ok},\ \sigma )
\end{array}
$$

**(DropAction-Partial)**

$$
\begin{array}{l}
\operatorname{BindState}(\sigma ,\ b)\ =\ \operatorname{PartiallyMoved}(F)\quad \Gamma \ \vdash \ \operatorname{DropValueOut}(\operatorname{TypeOf}(b),\ \operatorname{BindingValue}(\sigma ,\ b),\ F)\ \Downarrow \ (c,\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DropActionOut}(b)\ \Downarrow \ (c,\ \sigma ')
\end{array}
$$

**(DropAction-Valid)**

$$
\begin{array}{l}
\operatorname{BindState}(\sigma ,\ b)\ =\ \texttt{Valid}\quad \Gamma \ \vdash \ \operatorname{DropValueOut}(\operatorname{TypeOf}(b),\ \operatorname{BindingValue}(\sigma ,\ b),\ \emptyset )\ \Downarrow \ (c,\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DropActionOut}(b)\ \Downarrow \ (c,\ \sigma ')
\end{array}
$$

**(DropStaticAction)**

$$
\begin{array}{l}
\operatorname{StaticAddr}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{addr}\quad \operatorname{ReadAddr}(\sigma ,\ \mathsf{addr})\ =\ v\quad \Gamma \ \vdash \ \operatorname{DropValueOut}(\operatorname{StaticType}(\mathsf{path},\ \mathsf{name}),\ v,\ \emptyset )\ \Downarrow \ (c,\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DropStaticActionOut}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ (c,\ \sigma ')
\end{array}
$$

$$
\operatorname{NonRecordFOk}(T,\ F)\ \Leftrightarrow \ \operatorname{RecordType}(T)\ \lor \ F\ =\ \emptyset 
$$

**(DropValueOut-DropPanic)**

$$
\begin{array}{l}
\operatorname{NonRecordFOk}(T,\ F)\quad \operatorname{DropCall}(T,\ v,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DropValueOut}(T,\ v,\ F)\ \Downarrow \ (\mathsf{panic},\ \sigma_{1} )
\end{array}
$$

**(DropValueOut-ChildPanic)**

$$
\begin{array}{l}
\operatorname{NonRecordFOk}(T,\ F)\quad \operatorname{DropCall}(T,\ v,\ \sigma )\ \Downarrow \ (\operatorname{Val}(()),\ \sigma_{1} )\quad \operatorname{DropList}(\operatorname{DropChildren}(T,\ v,\ F),\ \sigma_{1} )\ \Downarrow \ (\mathsf{panic},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DropValueOut}(T,\ v,\ F)\ \Downarrow \ (\mathsf{panic},\ \sigma_{2} )
\end{array}
$$

**(DropValueOut-Ok)**

$$
\begin{array}{l}
\operatorname{NonRecordFOk}(T,\ F)\quad \operatorname{DropCall}(T,\ v,\ \sigma )\ \Downarrow \ (\operatorname{Val}(()),\ \sigma_{1} )\quad \operatorname{DropList}(\operatorname{DropChildren}(T,\ v,\ F),\ \sigma_{1} )\ \Downarrow \ (\mathsf{ok},\ \sigma_{2} )\quad \operatorname{ReleaseValue}(T,\ v,\ \sigma_{2} )\ \Downarrow \ \sigma_{3}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DropValueOut}(T,\ v,\ F)\ \Downarrow \ (\mathsf{ok},\ \sigma_{3} )
\end{array}
$$

### 24.5.4 Cleanup and Unwinding Driver

$$
\begin{array}{l}
\mathsf{CleanupFlag}\ =\ \{\mathsf{ok},\ \mathsf{panic}\} \\[0.16em]
\mathsf{CleanupState}\ =\ \{\operatorname{CleanupLoop}(\mathsf{scope},\ \sigma ,\ c)\ \mid \ c\ \in \ \mathsf{CleanupFlag}\}\ \cup \ \{\operatorname{ExitDone}(c,\ \sigma )\ \mid \ c\ \in \ \mathsf{CleanupFlag}\}\ \cup \ \{\mathsf{Abort}\}
\end{array}
$$

**(Cleanup-Start)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{ExitScope}(\mathsf{scope},\ \sigma )\rangle \ \to \ \langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma ,\ \mathsf{ok})\rangle 
\end{array}
$$

**(Cleanup-Step-Drop-Ok)**

$$
\begin{array}{l}
\operatorname{CleanupList}(\mathsf{scope})\ =\ \mathsf{rest}\ \mathbin{++} \ [\operatorname{DropBinding}(b)]\quad \sigma_{1} \ =\ \operatorname{SetCleanupList}(\mathsf{scope},\ \mathsf{rest},\ \sigma )\quad \Gamma \ \vdash \ \operatorname{DropActionOut}(b)\ \Downarrow \ (\mathsf{ok},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma ,\ c)\rangle \ \to \ \langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma_{2} ,\ c)\rangle 
\end{array}
$$

**(Cleanup-Step-Drop-Panic)**

$$
\begin{array}{l}
\operatorname{CleanupList}(\mathsf{scope})\ =\ \mathsf{rest}\ \mathbin{++} \ [\operatorname{DropBinding}(b)]\quad \sigma_{1} \ =\ \operatorname{SetCleanupList}(\mathsf{scope},\ \mathsf{rest},\ \sigma )\quad \Gamma \ \vdash \ \operatorname{DropActionOut}(b)\ \Downarrow \ (\mathsf{panic},\ \sigma_{2} )\quad c\ =\ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma ,\ c)\rangle \ \to \ \langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma_{2} ,\ \mathsf{panic})\rangle 
\end{array}
$$

**(Cleanup-Step-Drop-Abort)**

$$
\begin{array}{l}
\operatorname{CleanupList}(\mathsf{scope})\ =\ \mathsf{rest}\ \mathbin{++} \ [\operatorname{DropBinding}(b)]\quad \sigma_{1} \ =\ \operatorname{SetCleanupList}(\mathsf{scope},\ \mathsf{rest},\ \sigma )\quad \Gamma \ \vdash \ \operatorname{DropActionOut}(b)\ \Downarrow \ (\mathsf{panic},\ \sigma_{2} )\quad c\ =\ \mathsf{panic} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma ,\ c)\rangle \ \to \ \langle \mathsf{Abort}\rangle 
\end{array}
$$

**(Cleanup-Step-DropStatic-Ok)**

$$
\begin{array}{l}
\operatorname{CleanupList}(\mathsf{scope})\ =\ \mathsf{rest}\ \mathbin{++} \ [\operatorname{DropStatic}(\mathsf{path},\ \mathsf{name})]\quad \sigma_{1} \ =\ \operatorname{SetCleanupList}(\mathsf{scope},\ \mathsf{rest},\ \sigma )\quad \Gamma \ \vdash \ \operatorname{DropStaticActionOut}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ (\mathsf{ok},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma ,\ c)\rangle \ \to \ \langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma_{2} ,\ c)\rangle 
\end{array}
$$

**(Cleanup-Step-DropStatic-Panic)**

$$
\begin{array}{l}
\operatorname{CleanupList}(\mathsf{scope})\ =\ \mathsf{rest}\ \mathbin{++} \ [\operatorname{DropStatic}(\mathsf{path},\ \mathsf{name})]\quad \sigma_{1} \ =\ \operatorname{SetCleanupList}(\mathsf{scope},\ \mathsf{rest},\ \sigma )\quad \Gamma \ \vdash \ \operatorname{DropStaticActionOut}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ (\mathsf{panic},\ \sigma_{2} )\quad c\ =\ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma ,\ c)\rangle \ \to \ \langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma_{2} ,\ \mathsf{panic})\rangle 
\end{array}
$$

**(Cleanup-Step-DropStatic-Abort)**

$$
\begin{array}{l}
\operatorname{CleanupList}(\mathsf{scope})\ =\ \mathsf{rest}\ \mathbin{++} \ [\operatorname{DropStatic}(\mathsf{path},\ \mathsf{name})]\quad \sigma_{1} \ =\ \operatorname{SetCleanupList}(\mathsf{scope},\ \mathsf{rest},\ \sigma )\quad \Gamma \ \vdash \ \operatorname{DropStaticActionOut}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ (\mathsf{panic},\ \sigma_{2} )\quad c\ =\ \mathsf{panic} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma ,\ c)\rangle \ \to \ \langle \mathsf{Abort}\rangle 
\end{array}
$$

**(Cleanup-Step-Defer-Ok)**

$$
\begin{array}{l}
\operatorname{CleanupList}(\mathsf{scope})\ =\ \mathsf{rest}\ \mathbin{++} \ [\operatorname{DeferBlock}(b)]\quad \sigma_{1} \ =\ \operatorname{SetCleanupList}(\mathsf{scope},\ \mathsf{rest},\ \sigma )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(b,\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma ,\ c)\rangle \ \to \ \langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma_{2} ,\ c)\rangle 
\end{array}
$$

**(Cleanup-Step-Defer-Panic)**

$$
\begin{array}{l}
\operatorname{CleanupList}(\mathsf{scope})\ =\ \mathsf{rest}\ \mathbin{++} \ [\operatorname{DeferBlock}(b)]\quad \sigma_{1} \ =\ \operatorname{SetCleanupList}(\mathsf{scope},\ \mathsf{rest},\ \sigma )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(b,\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma_{2} )\quad c\ =\ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma ,\ c)\rangle \ \to \ \langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma_{2} ,\ \mathsf{panic})\rangle 
\end{array}
$$

**(Cleanup-Step-Defer-Abort)**

$$
\begin{array}{l}
\operatorname{CleanupList}(\mathsf{scope})\ =\ \mathsf{rest}\ \mathbin{++} \ [\operatorname{DeferBlock}(b)]\quad \sigma_{1} \ =\ \operatorname{SetCleanupList}(\mathsf{scope},\ \mathsf{rest},\ \sigma )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(b,\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma_{2} )\quad c\ =\ \mathsf{panic} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma ,\ c)\rangle \ \to \ \langle \mathsf{Abort}\rangle 
\end{array}
$$

**(Cleanup-Done)**

$$
\begin{array}{l}
\operatorname{CleanupList}(\mathsf{scope})\ =\ [] \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma ,\ c)\rangle \ \to \ \langle \operatorname{ExitDone}(c,\ \sigma )\rangle 
\end{array}
$$

**(Destroy-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Destroy}([],\ \sigma )\ \Downarrow \ \sigma 
\end{array}
$$

**(Destroy-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{DropAction}(b)\ \Downarrow \ \sigma_{1} \quad \Gamma \ \vdash \ \operatorname{Destroy}(\mathsf{bs},\ \sigma_{1} )\ \Downarrow \ \sigma_{2}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Destroy}(b\mathbin{::} \mathsf{bs},\ \sigma )\ \Downarrow \ \sigma_{2} 
\end{array}
$$

$$
\mathsf{CleanupJudg}_{\mathsf{Dyn}}\ =\ \{\operatorname{Cleanup}(\mathsf{cs},\ \sigma )\ \Downarrow \ (c,\ \sigma ')\}
$$

**(Cleanup-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Cleanup}([],\ \sigma )\ \Downarrow \ (\mathsf{ok},\ \sigma )
\end{array}
$$

**(Cleanup-Cons-Drop)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{DropActionOut}(b)\ \Downarrow \ (\mathsf{ok},\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{Cleanup}(\mathsf{cs},\ \sigma_{1} )\ \Downarrow \ (c,\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Cleanup}(\operatorname{DropBinding}(b)\mathbin{::} \mathsf{cs},\ \sigma )\ \Downarrow \ (c,\ \sigma_{2} )
\end{array}
$$

**(Cleanup-Cons-Drop-Panic)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{DropActionOut}(b)\ \Downarrow \ (\mathsf{panic},\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{Cleanup}(\mathsf{cs},\ \sigma_{1} )\ \Downarrow \ (c,\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Cleanup}(\operatorname{DropBinding}(b)\mathbin{::} \mathsf{cs},\ \sigma )\ \Downarrow \ (\mathsf{panic},\ \sigma_{2} )
\end{array}
$$

**(Cleanup-Cons-DropStatic)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{DropStaticActionOut}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ (\mathsf{ok},\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{Cleanup}(\mathsf{cs},\ \sigma_{1} )\ \Downarrow \ (c,\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Cleanup}(\operatorname{DropStatic}(\mathsf{path},\ \mathsf{name})\mathbin{::} \mathsf{cs},\ \sigma )\ \Downarrow \ (c,\ \sigma_{2} )
\end{array}
$$

**(Cleanup-Cons-DropStatic-Panic)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{DropStaticActionOut}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ (\mathsf{panic},\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{Cleanup}(\mathsf{cs},\ \sigma_{1} )\ \Downarrow \ (c,\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Cleanup}(\operatorname{DropStatic}(\mathsf{path},\ \mathsf{name})\mathbin{::} \mathsf{cs},\ \sigma )\ \Downarrow \ (\mathsf{panic},\ \sigma_{2} )
\end{array}
$$

**(Cleanup-Cons-Defer-Ok)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(b,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{Cleanup}(\mathsf{cs},\ \sigma_{1} )\ \Downarrow \ (c,\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Cleanup}(\operatorname{DeferBlock}(b)\mathbin{::} \mathsf{cs},\ \sigma )\ \Downarrow \ (c,\ \sigma_{2} )
\end{array}
$$

**(Cleanup-Cons-Defer-Panic)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(b,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{Cleanup}(\mathsf{cs},\ \sigma_{1} )\ \Downarrow \ (c,\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Cleanup}(\operatorname{DeferBlock}(b)\mathbin{::} \mathsf{cs},\ \sigma )\ \Downarrow \ (\mathsf{panic},\ \sigma_{2} )
\end{array}
$$

$$
\mathsf{CleanupScopeJudg}\ =\ \{\operatorname{CleanupScope}(\mathsf{scope},\ \sigma )\ \Downarrow \ (c,\ \sigma ')\}
$$

**(CleanupScope-From-SmallStep)**

$$
\begin{array}{l}
\langle \operatorname{ExitScope}(\mathsf{scope},\ \sigma )\rangle \ \to *\ \langle \operatorname{ExitDone}(c,\ \sigma ')\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CleanupScope}(\mathsf{scope},\ \sigma )\ \Downarrow \ (c,\ \sigma ')
\end{array}
$$

**(Unwind-Step)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CleanupScope}(f_{1}.\mathsf{scope},\ \sigma )\ \Downarrow \ (\mathsf{ok},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Unwind}(f_{1}\mathbin{::} \mathsf{fs},\ \sigma )\rangle \ \to \ \langle \operatorname{Unwind}(\mathsf{fs},\ \sigma ')\rangle 
\end{array}
$$

**(Unwind-Abort)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CleanupScope}(f_{1}.\mathsf{scope},\ \sigma )\ \Downarrow \ (\mathsf{panic},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Unwind}(f_{1}\mathbin{::} \mathsf{fs},\ \sigma )\rangle \ \to \ \langle \mathsf{Abort}\rangle 
\end{array}
$$

## 24.6 Runtime Interface

Feature-local runtime behavior remains owned by the feature sections that invoke these built-ins. This section defines only the runtime symbol surface, builtin modal layout hooks, and runtime declaration interface.

### 24.6.1 Built-in Modal Layout and Capability Symbols

$$
\mathsf{RuntimeIfcJudg}\ =\ \{\mathsf{BuiltinModalLayout},\ \mathsf{BuiltinModalSym},\ \mathsf{RegionAddrIsActiveSym},\ \mathsf{RegionAddrTagFromSym},\ \mathsf{BuiltinSym}\}
$$

$$
\operatorname{BuiltinModalLayoutSpec}(\texttt{Region})\ =\ \langle 16,\ 8,\ \mathsf{u8},\ \langle 8,\ 8\rangle \rangle 
$$

**(BuiltinModalLayout)**

$$
\begin{array}{l}
\operatorname{BuiltinModalLayoutSpec}(\mathsf{modal})\ =\ \langle \mathsf{size},\ \mathsf{align},\ \mathsf{disc},\ \mathsf{payload}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinModalLayout}(\mathsf{modal})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ [\langle \texttt{disc},\ \mathsf{disc}\rangle ,\ \langle \texttt{payload},\ \mathsf{payload}\rangle ]\rangle 
\end{array}
$$

$$
\begin{array}{l}
\mathsf{BuiltinModalSymMap}\ =\ [ \\[0.16em]
\ \langle \texttt{Region::new\_scoped},\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"region"},\ \texttt{"new\_scoped"}])\rangle , \\[0.16em]
\ \langle \texttt{Region::alloc},\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"region"},\ \texttt{"alloc"}])\rangle , \\[0.16em]
\ \langle \texttt{Region::mark},\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"region"},\ \texttt{"mark"}])\rangle , \\[0.16em]
\ \langle \texttt{Region::reset\_to},\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"region"},\ \texttt{"reset\_to"}])\rangle , \\[0.16em]
\ \langle \texttt{Region::reset\_unchecked},\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"region"},\ \texttt{"reset\_unchecked"}])\rangle , \\[0.16em]
\ \langle \texttt{Region::freeze},\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"region"},\ \texttt{"freeze"}])\rangle , \\[0.16em]
\ \langle \texttt{Region::thaw},\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"region"},\ \texttt{"thaw"}])\rangle , \\[0.16em]
\ \langle \texttt{Region::free\_unchecked},\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"region"},\ \texttt{"free\_unchecked"}])\rangle , \\[0.16em]
\ \langle \texttt{CancelToken::new},\ \operatorname{PathSig}([\texttt{"CancelToken"},\ \texttt{"new"}])\rangle , \\[0.16em]
\ \langle \texttt{CancelToken::Active::cancel},\ \operatorname{PathSig}([\texttt{"CancelToken"},\ \texttt{"Active"},\ \texttt{"cancel"}])\rangle , \\[0.16em]
\ \langle \texttt{CancelToken::Active::is\_cancelled},\ \operatorname{PathSig}([\texttt{"CancelToken"},\ \texttt{"Active"},\ \texttt{"is\_cancelled"}])\rangle , \\[0.16em]
\ \langle \texttt{CancelToken::Active::child},\ \operatorname{PathSig}([\texttt{"CancelToken"},\ \texttt{"Active"},\ \texttt{"child"}])\rangle , \\[0.16em]
\ \langle \texttt{CancelToken::Active::wait\_cancelled},\ \operatorname{PathSig}([\texttt{"CancelToken"},\ \texttt{"Active"},\ \texttt{"wait\_cancelled"}])\rangle  \\[0.16em]
]
\end{array}
$$

**(BuiltinModalSym)**

$$
\begin{array}{l}
\langle \mathsf{proc},\ \mathsf{sym}\rangle \ \in \ \mathsf{BuiltinModalSymMap} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinModalSym}(\mathsf{proc})\ \Downarrow \ \mathsf{sym}
\end{array}
$$

**(RegionAddr-AddrIsActive)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{RegionAddrIsActiveSym}\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"region"},\ \texttt{"addr\_is\_active"}])
\end{array}
$$

**(RegionAddr-AddrTagFrom)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{RegionAddrTagFromSym}\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"region"},\ \texttt{"addr\_tag\_from"}])
\end{array}
$$

**(BuiltinSym-FileSystem-OpenRead)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::open\_read})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"open\_read"}])
\end{array}
$$

**(BuiltinSym-FileSystem-OpenWrite)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::open\_write})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"open\_write"}])
\end{array}
$$

**(BuiltinSym-FileSystem-OpenAppend)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::open\_append})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"open\_append"}])
\end{array}
$$

**(BuiltinSym-FileSystem-CreateWrite)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::create\_write})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"create\_write"}])
\end{array}
$$

**(BuiltinSym-FileSystem-ReadFile)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::read\_file})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"read\_file"}])
\end{array}
$$

**(BuiltinSym-FileSystem-ReadBytes)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::read\_bytes})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"read\_bytes"}])
\end{array}
$$

**(BuiltinSym-FileSystem-WriteFile)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::write\_file})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"write\_file"}])
\end{array}
$$

**(BuiltinSym-FileSystem-WriteStdout)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::write\_stdout})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"write\_stdout"}])
\end{array}
$$

**(BuiltinSym-FileSystem-WriteStderr)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::write\_stderr})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"write\_stderr"}])
\end{array}
$$

**(BuiltinSym-FileSystem-Exists)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::exists})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"exists"}])
\end{array}
$$

**(BuiltinSym-FileSystem-Remove)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::remove})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"remove"}])
\end{array}
$$

**(BuiltinSym-FileSystem-OpenDir)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::open\_dir})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"open\_dir"}])
\end{array}
$$

**(BuiltinSym-FileSystem-CreateDir)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::create\_dir})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"create\_dir"}])
\end{array}
$$

**(BuiltinSym-FileSystem-EnsureDir)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::ensure\_dir})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"ensure\_dir"}])
\end{array}
$$

**(BuiltinSym-FileSystem-Kind)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::kind})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"kind"}])
\end{array}
$$

**(BuiltinSym-FileSystem-Restrict)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::restrict})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"restrict"}])
\end{array}
$$

**(BuiltinSym-Network-RestrictHost)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{Network::restrict\_to\_host})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"net"},\ \texttt{"restrict\_to\_host"}])
\end{array}
$$

**(BuiltinSym-HeapAllocator-WithQuota)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{HeapAllocator::with\_quota})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"heap"},\ \texttt{"with\_quota"}])
\end{array}
$$

**(BuiltinSym-HeapAllocator-AllocRaw)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{HeapAllocator::alloc\_raw})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"heap"},\ \texttt{"alloc\_raw"}])
\end{array}
$$

**(BuiltinSym-HeapAllocator-DeallocRaw)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{HeapAllocator::dealloc\_raw})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"heap"},\ \texttt{"dealloc\_raw"}])
\end{array}
$$

**(BuiltinSym-Reactor-Run)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{Reactor::run})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"reactor"},\ \texttt{"run"}])
\end{array}
$$

**(BuiltinSym-Reactor-Register)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{Reactor::register})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"reactor"},\ \texttt{"register"}])
\end{array}
$$

**(BuiltinSym-Time-Monotonic)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{Time::monotonic})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"time"},\ \texttt{"monotonic"}])
\end{array}
$$

**(BuiltinSym-Time-Wall)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{Time::wall})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"time"},\ \texttt{"wall"}])
\end{array}
$$

**(BuiltinSym-MonotonicTime-Now)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{MonotonicTime::now})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"time"},\ \texttt{"monotonic\_now"}])
\end{array}
$$

**(BuiltinSym-MonotonicTime-Resolution)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{MonotonicTime::resolution})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"time"},\ \texttt{"monotonic\_resolution"}])
\end{array}
$$

**(BuiltinSym-MonotonicTime-Elapsed)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{MonotonicTime::elapsed})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"time"},\ \texttt{"monotonic\_elapsed"}])
\end{array}
$$

**(BuiltinSym-MonotonicTime-Coarsen)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{MonotonicTime::coarsen})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"time"},\ \texttt{"monotonic\_coarsen"}])
\end{array}
$$

**(BuiltinSym-WallTime-NowUtc)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{WallTime::now\_utc})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"time"},\ \texttt{"wall\_now\_utc"}])
\end{array}
$$

**(BuiltinSym-WallTime-Resolution)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{WallTime::resolution})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"time"},\ \texttt{"wall\_resolution"}])
\end{array}
$$

**(BuiltinSym-WallTime-Coarsen)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{WallTime::coarsen})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"time"},\ \texttt{"wall\_coarsen"}])
\end{array}
$$

**(BuiltinSym-System-Exit)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{System::exit})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"system"},\ \texttt{"exit"}])
\end{array}
$$

**(BuiltinSym-System-GetEnv)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{System::get\_env})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"system"},\ \texttt{"get\_env"}])
\end{array}
$$

**(BuiltinSym-System-ExecutablePath)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{System::executable\_path})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"system"},\ \texttt{"executable\_path"}])
\end{array}
$$

**(BuiltinSym-System-ArgumentCount)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{System::argument\_count})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"system"},\ \texttt{"argument\_count"}])
\end{array}
$$

**(BuiltinSym-System-Argument)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{System::argument})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"system"},\ \texttt{"argument"}])
\end{array}
$$

**(BuiltinSym-System-CurrentDirectory)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{System::current\_directory})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"system"},\ \texttt{"current\_directory"}])
\end{array}
$$

**(BuiltinSym-System-Run)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{System::run})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"system"},\ \texttt{"run"}])
\end{array}
$$

### 24.6.2 Managed String/Bytes Runtime Symbols and Drop Hooks

$$
\mathsf{BuiltinSymJudg}\ =\ \{\operatorname{BuiltinSym}(\mathsf{method})\ \Downarrow \ \mathsf{sym}\}
$$

$$
\begin{array}{l}
\mathsf{StringBuiltins}\ =\ \{\texttt{string::from},\ \texttt{string::as\_view},\ \texttt{string::slice},\ \texttt{string::to\_managed},\ \texttt{string::clone\_with},\ \texttt{string::append},\ \texttt{string::length},\ \texttt{string::is\_empty}\} \\[0.16em]
\mathsf{BytesBuiltins}\ =\ \{\texttt{bytes::with\_capacity},\ \texttt{bytes::from\_slice},\ \texttt{bytes::as\_view},\ \texttt{bytes::as\_slice},\ \texttt{bytes::to\_managed},\ \texttt{bytes::view},\ \texttt{bytes::view\_string},\ \texttt{bytes::append},\ \texttt{bytes::length},\ \texttt{bytes::is\_empty}\} \\[0.16em]
\operatorname{StringMethod}(\mathsf{method})\ \Leftrightarrow \ \exists \ \mathsf{name}.\ \mathsf{method}\ =\ \texttt{string::}\mathsf{name} \\[0.16em]
\operatorname{BytesMethod}(\mathsf{method})\ \Leftrightarrow \ \exists \ \mathsf{name}.\ \mathsf{method}\ =\ \texttt{bytes::}\mathsf{name}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BuiltinSym}(\texttt{string::from})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"string"},\ \texttt{"from"}]) \\[0.16em]
\operatorname{BuiltinSym}(\texttt{string::as\_view})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"string"},\ \texttt{"as\_view"}]) \\[0.16em]
\operatorname{BuiltinSym}(\texttt{string::slice})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"string"},\ \texttt{"slice"}]) \\[0.16em]
\operatorname{BuiltinSym}(\texttt{string::to\_managed})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"string"},\ \texttt{"to\_managed"}]) \\[0.16em]
\operatorname{BuiltinSym}(\texttt{string::clone\_with})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"string"},\ \texttt{"clone\_with"}]) \\[0.16em]
\operatorname{BuiltinSym}(\texttt{string::append})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"string"},\ \texttt{"append"}]) \\[0.16em]
\operatorname{BuiltinSym}(\texttt{string::length})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"string"},\ \texttt{"length"}]) \\[0.16em]
\operatorname{BuiltinSym}(\texttt{string::is\_empty})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"string"},\ \texttt{"is\_empty"}])
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BuiltinSym}(\texttt{bytes::with\_capacity})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"bytes"},\ \texttt{"with\_capacity"}]) \\[0.16em]
\operatorname{BuiltinSym}(\texttt{bytes::from\_slice})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"bytes"},\ \texttt{"from\_slice"}]) \\[0.16em]
\operatorname{BuiltinSym}(\texttt{bytes::as\_view})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"bytes"},\ \texttt{"as\_view"}]) \\[0.16em]
\operatorname{BuiltinSym}(\texttt{bytes::as\_slice})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"bytes"},\ \texttt{"as\_slice"}]) \\[0.16em]
\operatorname{BuiltinSym}(\texttt{bytes::to\_managed})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"bytes"},\ \texttt{"to\_managed"}]) \\[0.16em]
\operatorname{BuiltinSym}(\texttt{bytes::view})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"bytes"},\ \texttt{"view"}]) \\[0.16em]
\operatorname{BuiltinSym}(\texttt{bytes::view\_string})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"bytes"},\ \texttt{"view\_string"}]) \\[0.16em]
\operatorname{BuiltinSym}(\texttt{bytes::append})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"bytes"},\ \texttt{"append"}]) \\[0.16em]
\operatorname{BuiltinSym}(\texttt{bytes::length})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"bytes"},\ \texttt{"length"}]) \\[0.16em]
\operatorname{BuiltinSym}(\texttt{bytes::is\_empty})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"bytes"},\ \texttt{"is\_empty"}])
\end{array}
$$

**(BuiltinSym-String-Err)**

$$
\begin{array}{l}
\operatorname{StringMethod}(\mathsf{method})\quad \mathsf{method}\ \notin \ \mathsf{StringBuiltins} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\mathsf{method})\ \Uparrow 
\end{array}
$$

**(BuiltinSym-Bytes-Err)**

$$
\begin{array}{l}
\operatorname{BytesMethod}(\mathsf{method})\quad \mathsf{method}\ \notin \ \mathsf{BytesBuiltins} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\mathsf{method})\ \Uparrow 
\end{array}
$$

$$
\mathsf{DropHookJudg}\ =\ \{\mathsf{StringDropSym}\ \Downarrow \ \mathsf{sym},\ \mathsf{BytesDropSym}\ \Downarrow \ \mathsf{sym}\}
$$

**(StringDropSym-Decl)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{StringDropSym}\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"string"},\ \texttt{"drop\_managed"}])
\end{array}
$$

**(BytesDropSym-Decl)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{BytesDropSym}\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"bytes"},\ \texttt{"drop\_managed"}])
\end{array}
$$

**(StringDropSym-Err)**
StringDropSym undefined

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{StringDropSym}\ \Uparrow 
\end{array}
$$

**(BytesDropSym-Err)**
BytesDropSym undefined

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{BytesDropSym}\ \Uparrow 
\end{array}
$$

### 24.6.3 Runtime and Built-in Declarations

$$
\mathsf{RuntimeDeclJudg}\ =\ \{\operatorname{RuntimeSig}(\mathsf{sym})\ \Downarrow \ \langle \mathsf{params},\ \mathsf{ret}\rangle ,\ \operatorname{BuiltinSig}(\mathsf{method})\ \Downarrow \ \langle \mathsf{params},\ \mathsf{ret}\rangle ,\ \operatorname{RuntimeDecls}(S)\ \Downarrow \ \mathsf{decls}\}
$$

$$
\begin{array}{l}
\mathsf{FileSystemBuiltinMethods}\ =\ \{\texttt{FileSystem::open\_read},\ \texttt{FileSystem::open\_write},\ \texttt{FileSystem::open\_append},\ \texttt{FileSystem::create\_write},\ \texttt{FileSystem::read\_file},\ \texttt{FileSystem::read\_bytes},\ \texttt{FileSystem::write\_file},\ \texttt{FileSystem::write\_stdout},\ \texttt{FileSystem::write\_stderr},\ \texttt{FileSystem::exists},\ \texttt{FileSystem::remove},\ \texttt{FileSystem::open\_dir},\ \texttt{FileSystem::create\_dir},\ \texttt{FileSystem::ensure\_dir},\ \texttt{FileSystem::kind},\ \texttt{FileSystem::restrict}\} \\[0.16em]
\mathsf{NetworkBuiltinMethods}\ =\ \{\texttt{Network::restrict\_to\_host}\} \\[0.16em]
\mathsf{HeapAllocatorBuiltinMethods}\ =\ \{\texttt{HeapAllocator::with\_quota},\ \texttt{HeapAllocator::alloc\_raw},\ \texttt{HeapAllocator::dealloc\_raw}\} \\[0.16em]
\mathsf{SystemBuiltinMethods}\ =\ \{\texttt{System::name}\ \mid \ \langle \mathsf{name},\ \mathsf{params},\ \mathsf{ret}\rangle \ \in \ \mathsf{SystemInterface}\} \\[0.16em]
\mathsf{ReactorBuiltinMethods}\ =\ \{\texttt{Reactor::run},\ \texttt{Reactor::register}\} \\[0.16em]
\mathsf{TimeBuiltinMethods}\ =\ \{\texttt{Time::monotonic},\ \texttt{Time::wall},\ \texttt{MonotonicTime::now},\ \texttt{MonotonicTime::resolution},\ \texttt{MonotonicTime::elapsed},\ \texttt{MonotonicTime::coarsen},\ \texttt{WallTime::now\_utc},\ \texttt{WallTime::resolution},\ \texttt{WallTime::coarsen}\} \\[0.16em]
\mathsf{BuiltinMethods}\ =\ \mathsf{StringBuiltins}\ \cup \ \mathsf{BytesBuiltins}\ \cup \ \mathsf{FileSystemBuiltinMethods}\ \cup \ \mathsf{NetworkBuiltinMethods}\ \cup \ \mathsf{HeapAllocatorBuiltinMethods}\ \cup \ \mathsf{SystemBuiltinMethods}\ \cup \ \mathsf{ReactorBuiltinMethods}\ \cup \ \mathsf{TimeBuiltinMethods} \\[0.16em]
\mathsf{RuntimeSyms}\ =\ \{\mathsf{PanicSym},\ \mathsf{StringDropSym},\ \mathsf{BytesDropSym},\ \mathsf{ContextInitSym}\}\ \cup \ \{\operatorname{BuiltinModalSym}(\mathsf{proc})\ \mid \ \mathsf{proc}\ \in \ \operatorname{dom}(\mathsf{BuiltinModalSymMap})\}\ \cup \ \{\mathsf{RegionAddrIsActiveSym},\ \mathsf{RegionAddrTagFromSym}\}\ \cup \ \{\operatorname{BuiltinSym}(\mathsf{method})\ \mid \ \mathsf{method}\ \in \ \mathsf{BuiltinMethods}\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BuiltinSig}(\texttt{FileSystem}\mathbin{::} \mathsf{name})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\operatorname{CapRecv}(\texttt{FileSystem},\ \mathsf{name}),\ \operatorname{TypeDynamic}(\texttt{FileSystem}))\rangle ]\ \mathbin{++} \ \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \operatorname{CapMethodSig}(\texttt{FileSystem},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle  \\[0.16em]
\operatorname{BuiltinSig}(\texttt{Network}\mathbin{::} \mathsf{name})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\operatorname{CapRecv}(\texttt{Network},\ \mathsf{name}),\ \operatorname{TypeDynamic}(\texttt{Network}))\rangle ]\ \mathbin{++} \ \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \operatorname{CapMethodSig}(\texttt{Network},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle  \\[0.16em]
\operatorname{BuiltinSig}(\texttt{HeapAllocator}\mathbin{::} \mathsf{name})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\operatorname{CapRecv}(\texttt{HeapAllocator},\ \mathsf{name}),\ \operatorname{TypeDynamic}(\texttt{HeapAllocator}))\rangle ]\ \mathbin{++} \ \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \operatorname{CapMethodSig}(\texttt{HeapAllocator},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle  \\[0.16em]
\operatorname{BuiltinSig}(\texttt{System}\mathbin{::} \mathsf{name})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypePath}([\texttt{"System"}]))\rangle ]\ \mathbin{++} \ \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \operatorname{SystemMethodSig}(\mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle  \\[0.16em]
\operatorname{BuiltinSig}(\texttt{Reactor}\mathbin{::} \mathsf{name})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\operatorname{CapRecv}(\texttt{Reactor},\ \mathsf{name}),\ \operatorname{TypeDynamic}(\texttt{Reactor}))\rangle ]\ \mathbin{++} \ \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \operatorname{CapMethodSig}(\texttt{Reactor},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle  \\[0.16em]
\operatorname{BuiltinSig}(\texttt{Time}\mathbin{::} \mathsf{name})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\operatorname{CapRecv}(\texttt{Time},\ \mathsf{name}),\ \operatorname{TypeDynamic}(\texttt{Time}))\rangle ]\ \mathbin{++} \ \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \operatorname{CapMethodSig}(\texttt{Time},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle  \\[0.16em]
\operatorname{BuiltinSig}(\texttt{MonotonicTime}\mathbin{::} \mathsf{name})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\operatorname{CapRecv}(\texttt{MonotonicTime},\ \mathsf{name}),\ \operatorname{TypeDynamic}(\texttt{MonotonicTime}))\rangle ]\ \mathbin{++} \ \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \operatorname{CapMethodSig}(\texttt{MonotonicTime},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle  \\[0.16em]
\operatorname{BuiltinSig}(\texttt{WallTime}\mathbin{::} \mathsf{name})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\operatorname{CapRecv}(\texttt{WallTime},\ \mathsf{name}),\ \operatorname{TypeDynamic}(\texttt{WallTime}))\rangle ]\ \mathbin{++} \ \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \operatorname{CapMethodSig}(\texttt{WallTime},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle  \\[0.16em]
\operatorname{BuiltinSig}(\mathsf{method})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \operatorname{StringBytesBuiltinSig}(\mathsf{method})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{RuntimeSig}(\mathsf{PanicSym})\ =\ \langle [\langle \bot ,\ \texttt{code},\ \operatorname{TypePrim}(\texttt{"u32"})\rangle ],\ \operatorname{TypePrim}(\texttt{"!"})\rangle  \\[0.16em]
\operatorname{RuntimeSig}(\mathsf{ContextInitSym})\ =\ \langle [],\ \operatorname{TypePath}([\texttt{"Context"}])\rangle  \\[0.16em]
\operatorname{RuntimeSig}(\mathsf{StringDropSym})\ =\ \langle [\langle \texttt{move},\ \texttt{value},\ \operatorname{TypeString}(\texttt{@Managed})\rangle ],\ \operatorname{TypePrim}(\texttt{"()"})\rangle  \\[0.16em]
\operatorname{RuntimeSig}(\mathsf{BytesDropSym})\ =\ \langle [\langle \texttt{move},\ \texttt{value},\ \operatorname{TypeBytes}(\texttt{@Managed})\rangle ],\ \operatorname{TypePrim}(\texttt{"()"})\rangle  \\[0.16em]
\operatorname{BuiltinModalProcSig}(\mathsf{proc})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \mathsf{proc}\ \in \ \mathsf{RegionProcs}\ \land \ \operatorname{RegionProcSig}(\mathsf{proc})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle  \\[0.16em]
\operatorname{BuiltinModalProcSig}(\texttt{CancelToken::new})\ =\ \langle [],\ \operatorname{TypeModalState}([\texttt{"CancelToken"}],\ \texttt{@Active})\rangle  \\[0.16em]
\operatorname{BuiltinModalProcSig}(\texttt{CancelToken::Active::cancel})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{shared},\ \operatorname{TypeModalState}([\texttt{"CancelToken"}],\ \texttt{@Active}))\rangle ],\ \operatorname{TypePrim}(\texttt{"()"})\rangle  \\[0.16em]
\operatorname{BuiltinModalProcSig}(\texttt{CancelToken::Active::is\_cancelled})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeModalState}([\texttt{"CancelToken"}],\ \texttt{@Active}))\rangle ],\ \operatorname{TypePrim}(\texttt{"bool"})\rangle  \\[0.16em]
\operatorname{BuiltinModalProcSig}(\texttt{CancelToken::Active::child})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeModalState}([\texttt{"CancelToken"}],\ \texttt{@Active}))\rangle ],\ \operatorname{TypeModalState}([\texttt{"CancelToken"}],\ \texttt{@Active})\rangle  \\[0.16em]
\operatorname{BuiltinModalProcSig}(\texttt{CancelToken::Active::wait\_cancelled})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeModalState}([\texttt{"CancelToken"}],\ \texttt{@Active}))\rangle ],\ \operatorname{TypePath}([\texttt{"Async"}],\ [\operatorname{TypePrim}(\texttt{"()"})])\rangle  \\[0.16em]
\operatorname{RuntimeSig}(\mathsf{sym})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}([\texttt{"Region"}],\ \texttt{@Active}))\rangle ,\ \langle \bot ,\ \texttt{size},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ,\ \langle \bot ,\ \texttt{align},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ],\ \operatorname{TypeRawPtr}(\texttt{mut},\ \operatorname{TypePrim}(\texttt{"u8"}))\rangle \ \Leftrightarrow \ \mathsf{sym}\ =\ \operatorname{BuiltinModalSym}(\texttt{Region::alloc}) \\[0.16em]
\operatorname{RuntimeSig}(\mathsf{sym})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}([\texttt{"Region"}],\ \texttt{@Active}))\rangle ],\ \operatorname{TypePrim}(\texttt{"usize"})\rangle \ \Leftrightarrow \ \mathsf{sym}\ =\ \operatorname{BuiltinModalSym}(\texttt{Region::mark}) \\[0.16em]
\operatorname{RuntimeSig}(\mathsf{sym})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}([\texttt{"Region"}],\ \texttt{@Active}))\rangle ,\ \langle \bot ,\ \texttt{mark},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ],\ \operatorname{TypePrim}(\texttt{"()"})\rangle \ \Leftrightarrow \ \mathsf{sym}\ =\ \operatorname{BuiltinModalSym}(\texttt{Region::reset\_to}) \\[0.16em]
\operatorname{RuntimeSig}(\mathsf{sym})\ =\ \langle [\langle \bot ,\ \texttt{addr},\ \operatorname{TypeRawPtr}(\texttt{imm},\ \operatorname{TypePrim}(\texttt{"u8"}))\rangle ],\ \operatorname{TypePrim}(\texttt{"bool"})\rangle \ \Leftrightarrow \ \mathsf{sym}\ =\ \mathsf{RegionAddrIsActiveSym} \\[0.16em]
\operatorname{RuntimeSig}(\mathsf{sym})\ =\ \langle [\langle \bot ,\ \texttt{addr},\ \operatorname{TypeRawPtr}(\texttt{imm},\ \operatorname{TypePrim}(\texttt{"u8"}))\rangle ,\ \langle \bot ,\ \texttt{base},\ \operatorname{TypeRawPtr}(\texttt{imm},\ \operatorname{TypePrim}(\texttt{"u8"}))\rangle ],\ \operatorname{TypePrim}(\texttt{"()"})\rangle \ \Leftrightarrow \ \mathsf{sym}\ =\ \mathsf{RegionAddrTagFromSym} \\[0.16em]
\operatorname{RuntimeSig}(\mathsf{sym})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \mathsf{sym}\ =\ \operatorname{BuiltinModalSym}(\mathsf{proc})\ \land \ \mathsf{proc}\ \notin \ \{\texttt{Region::alloc},\ \texttt{Region::mark},\ \texttt{Region::reset\_to}\}\ \land \ \operatorname{BuiltinModalProcSig}(\mathsf{proc})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle  \\[0.16em]
\operatorname{RuntimeSig}(\mathsf{sym})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \mathsf{sym}\ =\ \operatorname{BuiltinSym}(\mathsf{method})\ \land \ \operatorname{BuiltinSig}(\mathsf{method})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle 
\end{array}
$$

$$
\mathsf{LLVMDecl}\ :\ \mathsf{Symbol}\ \times \ \mathsf{Sig}\ \to \ \mathsf{LLVMDecl}
$$

**(RuntimeDecls)**

$$
\begin{array}{l}
\forall \ \mathsf{sym}\ \in \ S,\ \operatorname{RuntimeSig}(\mathsf{sym})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \quad \operatorname{LLVMCallSig}(\mathsf{params},\ \mathsf{ret})\ \Downarrow \ \mathsf{sig} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{RuntimeDecls}(S)\ \Downarrow \ [\operatorname{LLVMDecl}(\mathsf{sym},\ \mathsf{sig})\ \mid \ \mathsf{sym}\ \in \ S]
\end{array}
$$

$$
\begin{array}{l}
\mathsf{DeclAttrs}\ :\ \mathsf{Symbol}\ \to \ \mathsf{AttrSet} \\[0.16em]
\operatorname{DeclSyms}(\mathsf{LLVMIR})\ =\ \{\ \mathsf{sym}\ \mid \ \operatorname{LLVMDecl}(\mathsf{sym},\ \_)\ \in \ \mathsf{LLVMIR}\ \lor \ \operatorname{LLVMDefine}(\mathsf{sym},\ \_,\ \_)\ \in \ \mathsf{LLVMIR}\ \} \\[0.16em]
\operatorname{DeclAttrsOk}(\mathsf{sym})\ \Leftrightarrow \ (\mathsf{sym}\ =\ \mathsf{PanicSym}\ \Rightarrow \ \{\texttt{noreturn},\ \texttt{nounwind}\}\ \subseteq \ \operatorname{DeclAttrs}(\mathsf{sym}))\ \land \ (\mathsf{sym}\ \ne \ \mathsf{PanicSym}\ \Rightarrow \ \texttt{nounwind}\ \in \ \operatorname{DeclAttrs}(\mathsf{sym})) \\[0.16em]
\operatorname{RuntimeDeclsOk}(\mathsf{decls})\ \Leftrightarrow \ \forall \ \mathsf{sym}\ \in \ \operatorname{DeclSyms}(\mathsf{decls}).\ \operatorname{DeclAttrsOk}(\mathsf{sym}) \\[0.16em]
\operatorname{RuntimeDeclsCover}(\mathsf{LLVMIR},\ \mathsf{IR})\ \Leftrightarrow \ \operatorname{RuntimeRefs}(\mathsf{IR})\ \subseteq \ \operatorname{DeclSyms}(\mathsf{LLVMIR})
\end{array}
$$

### 24.6.4 Network, Heap, Reactor, and Time Host-Primitives

**(Prim-Network-RestrictHost-Runtime)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{NetRestrictHost}(v_{\mathsf{net}},\ \mathsf{host})\ \Downarrow \ v_{\mathsf{net}}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{Network},\ \texttt{restrict\_to\_host},\ v_{\mathsf{net}},\ [\mathsf{host}])\ \Downarrow \ \operatorname{Val}(v_{\mathsf{net}}')
\end{array}
$$

$$
\mathsf{HeapJudg}\ =\ \{\operatorname{HeapWithQuota}(v_{\mathsf{heap}},\ \mathsf{quota})\ \Downarrow \ v_{\mathsf{heap}}',\ \operatorname{HeapAllocRaw}(v_{\mathsf{heap}},\ \mathsf{count})\ \Downarrow \ \mathsf{ptr},\ \operatorname{HeapDeallocRaw}(v_{\mathsf{heap}},\ \mathsf{ptr},\ \mathsf{count})\ \Downarrow \ \mathsf{ok}\}
$$

`HeapWithQuota`, `HeapAllocRaw`, and `HeapDeallocRaw` are runtime host-primitive relations with required semantics.

$$
\begin{array}{l}
\operatorname{HeapState}(v_{h})\ =\ \langle \mathsf{parent}_{h},\ \mathsf{quota}_{h},\ \mathsf{used}_{h}\rangle ,\ \mathsf{where}\ \texttt{quota\_h = 0}\ \mathsf{denotes}\ \mathsf{no}\ \mathsf{local}\ \mathsf{quota}\ \mathsf{bound}. \\[0.16em]
\operatorname{Anc}(v_{h})\ =\ [v_{h},\ \mathsf{parent}_{h},\ \operatorname{parent}(\mathsf{parent}_{h}),\ \ldots ]\ \mathsf{truncated}\ \mathsf{at}\ \texttt{bottom}. \\[0.16em]
\operatorname{Headroom}(v_{a})\ =\ +\infty \ \mathsf{if}\ \texttt{quota\_a = 0},\ \mathsf{otherwise}\ \texttt{max(quota\_a - used\_a, 0)}.
\end{array}
$$

A conforming implementation MUST satisfy all of the following:

1. `HeapWithQuota(v_heap, q) ⇓ v_heap'` implies `HeapState(v_heap') = ⟨v_heap, q, 0⟩`.
2. `HeapAllocRaw(v_heap, 0) ⇓ null` and MUST NOT mutate any `HeapState`.
3. For `count > 0`:
   - If `∃ v_a ∈ Anc(v_heap). count > Headroom(v_a)`, then `HeapAllocRaw(v_heap, count) ⇓ null` and MUST NOT mutate any `HeapState`.
   - If quota checks pass but host allocation fails, `HeapAllocRaw(v_heap, count) ⇓ null` and MUST NOT mutate any `HeapState`.
   - Otherwise, `HeapAllocRaw(v_heap, count) ⇓ ptr` with `ptr ≠ null`, and `used_a` MUST increase by `count` for every `v_a ∈ Anc(v_heap)`.
4. `HeapDeallocRaw(v_heap, null, count) ⇓ ok` and MUST NOT mutate any `HeapState`.
5. If `ptr ≠ null` denotes a live allocation previously returned by `HeapAllocRaw` with recorded owner heap `v_owner` and recorded size `n`, then `HeapDeallocRaw(v_heap, ptr, count) ⇓ ok` MUST:
   - free that allocation exactly once, and
   - decrease `used_a` by `n` for every `v_a ∈ Anc(v_owner)`.
6. The `count` argument to `dealloc_raw` is non-authoritative for accounting; accounting MUST use the recorded allocation size.
7. If `ptr` does not denote a live allocation previously returned by `HeapAllocRaw` (including double-free and foreign pointers), behavior is undefined.

**(Prim-Heap-WithQuota)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{HeapWithQuota}(v_{\mathsf{heap}},\ \mathsf{quota})\ \Downarrow \ v_{\mathsf{heap}}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{HeapAllocator},\ \texttt{with\_quota},\ v_{\mathsf{heap}},\ [\mathsf{quota}])\ \Downarrow \ \operatorname{Val}(v_{\mathsf{heap}}')
\end{array}
$$

**(Prim-Heap-AllocRaw)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{HeapAllocRaw}(v_{\mathsf{heap}},\ \mathsf{count})\ \Downarrow \ \mathsf{ptr} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{HeapAllocator},\ \texttt{alloc\_raw},\ v_{\mathsf{heap}},\ [\mathsf{count}])\ \Downarrow \ \operatorname{Val}(\mathsf{ptr})
\end{array}
$$

**(Prim-Heap-DeallocRaw)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{HeapDeallocRaw}(v_{\mathsf{heap}},\ \mathsf{ptr},\ \mathsf{count})\ \Downarrow \ \mathsf{ok} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{HeapAllocator},\ \texttt{dealloc\_raw},\ v_{\mathsf{heap}},\ [\mathsf{ptr},\ \mathsf{count}])\ \Downarrow \ \operatorname{Val}(\mathsf{UnitVal})
\end{array}
$$

$$
\mathsf{ReactorJudg}\ =\ \{\operatorname{ReactorRun}(v_{\mathsf{reactor}},\ f)\ \Downarrow \ r,\ \operatorname{ReactorRegister}(v_{\mathsf{reactor}},\ f)\ \Downarrow \ h\}
$$

`ReactorRun` and `ReactorRegister` are runtime host-primitive relations that interface the async model (§19) with a concrete event loop.

**(Prim-Reactor-Run)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ReactorRun}(v_{\mathsf{reactor}},\ f)\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{Reactor},\ \texttt{run},\ v_{\mathsf{reactor}},\ [f])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-Reactor-Register)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ReactorRegister}(v_{\mathsf{reactor}},\ f)\ \Downarrow \ h \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{Reactor},\ \texttt{register},\ v_{\mathsf{reactor}},\ [f])\ \Downarrow \ \operatorname{Val}(h)
\end{array}
$$

Time host-primitives are defined in §6.2.3.

**(Prim-Time-Monotonic-Runtime)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TimeMonotonic}(v_{\mathsf{time}})\ \Downarrow \ v_{\mathsf{mono}} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{Time},\ \texttt{monotonic},\ v_{\mathsf{time}},\ [])\ \Downarrow \ \operatorname{Val}(v_{\mathsf{mono}})
\end{array}
$$

**(Prim-Time-Wall-Runtime)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TimeWall}(v_{\mathsf{time}})\ \Downarrow \ v_{\mathsf{wall}} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{Time},\ \texttt{wall},\ v_{\mathsf{time}},\ [])\ \Downarrow \ \operatorname{Val}(v_{\mathsf{wall}})
\end{array}
$$

**(Prim-MonotonicTime-Now-Runtime)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MonotonicTimeNow}(v_{\mathsf{mono}})\ \Downarrow \ t \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{MonotonicTime},\ \texttt{now},\ v_{\mathsf{mono}},\ [])\ \Downarrow \ \operatorname{Val}(t)
\end{array}
$$

**(Prim-MonotonicTime-Resolution-Runtime)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MonotonicTimeResolution}(v_{\mathsf{mono}})\ \Downarrow \ d \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{MonotonicTime},\ \texttt{resolution},\ v_{\mathsf{mono}},\ [])\ \Downarrow \ \operatorname{Val}(d)
\end{array}
$$

**(Prim-MonotonicTime-Elapsed-Runtime)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MonotonicTimeElapsed}(v_{\mathsf{mono}},\ \mathsf{start},\ \mathsf{end})\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{MonotonicTime},\ \texttt{elapsed},\ v_{\mathsf{mono}},\ [\mathsf{start},\ \mathsf{end}])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-MonotonicTime-Coarsen-Runtime)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MonotonicTimeCoarsen}(v_{\mathsf{mono}},\ \mathsf{resolution})\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{MonotonicTime},\ \texttt{coarsen},\ v_{\mathsf{mono}},\ [\mathsf{resolution}])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-WallTime-NowUtc-Runtime)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{WallTimeNowUtc}(v_{\mathsf{wall}})\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{WallTime},\ \texttt{now\_utc},\ v_{\mathsf{wall}},\ [])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-WallTime-Resolution-Runtime)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{WallTimeResolution}(v_{\mathsf{wall}})\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{WallTime},\ \texttt{resolution},\ v_{\mathsf{wall}},\ [])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

**(Prim-WallTime-Coarsen-Runtime)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{WallTimeCoarsen}(v_{\mathsf{wall}},\ \mathsf{resolution})\ \Downarrow \ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{WallTime},\ \texttt{coarsen},\ v_{\mathsf{wall}},\ [\mathsf{resolution}])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
$$

## 24.7 Backend Requirements

This section owns the backend-specific LLVM requirements, IR declaration/instruction lowering, binding storage, ABI call lowering, vtable/literal emission, and poisoning instrumentation used by Chapter 24.

### 24.7.1 LLVM Module Header

$$
\mathsf{LLVMHeader}\ =\ [\operatorname{TargetDataLayout}(\mathsf{LLVMDataLayout}),\ \operatorname{TargetTriple}(\mathsf{LLVMTriple})]
$$

### 24.7.2 Opaque Pointer Model

$$
\begin{array}{l}
\operatorname{AddrSpace}(T)\ = \\[0.16em]
\ 0\quad \mathsf{if}\ T\ =\ \operatorname{TypePtr}(U,\ s) \\[0.16em]
\ 0\quad \mathsf{if}\ T\ =\ \operatorname{TypeRawPtr}(q,\ U) \\[0.16em]
\ 0\quad \mathsf{if}\ T\ =\ \operatorname{TypeFunc}(\mathsf{params},\ R) \\[0.16em]
\ \operatorname{AddrSpace}(U)\quad \mathsf{if}\ T\ =\ \operatorname{TypePerm}(p,\ U)\ \land \ \operatorname{AddrSpace}(U)\ \mathsf{defined} \\[0.16em]
\ \bot \quad \mathsf{otherwise}
\end{array}
$$

$$
\operatorname{LLVMPtrTy}(T)\ =\ \texttt{ptr addrspace(AddrSpace(T))}\ \mathsf{when}\ \operatorname{AddrSpace}(T)\ \mathsf{defined}
$$

### 24.7.3 LLVM Attribute Mapping

$$
\mathsf{LLVMAttrJudg}\ =\ \{\operatorname{PtrStateOf}(T)\ =\ s,\ \operatorname{LLVMPtrAttrs}(T)\ \Downarrow \ A,\ \operatorname{LLVMArgAttrs}(T)\ \Downarrow \ A\}
$$

**(PtrStateOf-Perm)**

$$
\begin{array}{l}
\operatorname{PtrStateOf}(T)\ =\ s \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{PtrStateOf}(\operatorname{TypePerm}(p,\ T))\ =\ s
\end{array}
$$

**(LLVM-PtrAttrs-Valid)**

$$
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypePtr}(U,\ \texttt{Valid}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMPtrAttrs}(T)\ \Downarrow \ \{\texttt{nonnull},\ \texttt{dereferenceable}(\operatorname{sizeof}(U)),\ \texttt{align}(\operatorname{alignof}(U)),\ \texttt{noundef}\}
\end{array}
$$

**(LLVM-PtrAttrs-Other)**

$$
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypePtr}(U,\ s)\quad s\ \in \ \{\bot ,\ \texttt{Null},\ \texttt{Expired}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMPtrAttrs}(T)\ \Downarrow \ \emptyset 
\end{array}
$$

**(LLVM-PtrAttrs-RawPtr)**

$$
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypeRawPtr}(q,\ U) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMPtrAttrs}(T)\ \Downarrow \ \emptyset 
\end{array}
$$

**(LLVM-ArgAttrs-Ptr)**

$$
\begin{array}{l}
\operatorname{LLVMArgAttrsPtr}(T)\ =\ (\operatorname{PermOf}(T)\ =\ \texttt{unique}\ \mathsf{Sigma}\ \{\texttt{noalias}\}\ :\ \emptyset )\ \cup \ (\operatorname{PermOf}(T)\ =\ \texttt{const}\ \mathsf{Sigma}\ \{\texttt{readonly}\}\ :\ \emptyset ) \\[0.16em]
\operatorname{StripPerm}(T)\ \in \ \{\operatorname{TypePtr}(\_,\ \_),\ \operatorname{TypeFunc}(\_,\ \_)\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMArgAttrs}(T)\ \Downarrow \ \operatorname{LLVMArgAttrsPtr}(T)
\end{array}
$$

**(LLVM-ArgAttrs-RawPtr)**

$$
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypeRawPtr}(\_,\ \_) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMArgAttrs}(T)\ \Downarrow \ \emptyset 
\end{array}
$$

**(LLVM-ArgAttrs-NonPtr)**

$$
\begin{array}{l}
\operatorname{StripPerm}(T)\ \notin \ \{\operatorname{TypePtr}(\_,\ \_),\ \operatorname{TypeRawPtr}(\_,\ \_),\ \operatorname{TypeFunc}(\_,\ \_)\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMArgAttrs}(T)\ \Downarrow \ \emptyset 
\end{array}
$$

NoEscapeParam(x) predicate

$$
\begin{array}{l}
\operatorname{NoEscapeParam}(x)\ \Leftrightarrow \ \mathsf{false} \\[0.16em]
\operatorname{OptArgAttrs}(x)\ \subseteq \ \{\texttt{nocapture}\}\ \land \ (\texttt{nocapture}\ \in \ \operatorname{OptArgAttrs}(x)\ \Rightarrow \ \operatorname{NoEscapeParam}(x)) \\[0.16em]
\operatorname{LLVMArgAttrsExt}(x,\ T)\ =\ \operatorname{LLVMArgAttrs}(T)\ \cup \ \operatorname{OptArgAttrs}(x)
\end{array}
$$

### 24.7.4 UB and Poison Avoidance

$$
\begin{array}{l}
\operatorname{LLVMInstrs}(\mathsf{LLVMIR})\ =\ [i_{0},\ \ldots ,\ i_{n}] \\[0.16em]
\operatorname{Opcode}(i)\ =\ \mathsf{op} \\[0.16em]
\operatorname{UsesOpcode}(\mathsf{LLVMIR},\ \mathsf{op})\ \Leftrightarrow \ \exists \ i\ \in \ \operatorname{LLVMInstrs}(\mathsf{LLVMIR}).\ \operatorname{Opcode}(i)\ =\ \mathsf{op} \\[0.16em]
\operatorname{Intrinsic}(i)\ =\ \mathsf{name} \\[0.16em]
\operatorname{UsesIntrinsic}(\mathsf{LLVMIR},\ \mathsf{name})\ \Leftrightarrow \ \exists \ i\ \in \ \operatorname{LLVMInstrs}(\mathsf{LLVMIR}).\ \operatorname{Intrinsic}(i)\ =\ \mathsf{name} \\[0.16em]
\operatorname{NoUndefPoison}(\mathsf{LLVMIR})\ \Leftrightarrow \ \lnot \ \operatorname{UsesOpcode}(\mathsf{LLVMIR},\ \texttt{undef})\ \land \ \lnot \ \operatorname{UsesOpcode}(\mathsf{LLVMIR},\ \texttt{poison}) \\[0.16em]
\operatorname{NoNSWNUW}(\mathsf{LLVMIR})\ \Leftrightarrow \ \lnot \ \operatorname{UsesOpcode}(\mathsf{LLVMIR},\ \texttt{nsw})\ \land \ \lnot \ \operatorname{UsesOpcode}(\mathsf{LLVMIR},\ \texttt{nuw}) \\[0.16em]
\operatorname{CheckedOverflow}(\mathsf{LLVMIR})\ \Leftrightarrow \ \lnot \ \operatorname{UsesOpcode}(\mathsf{LLVMIR},\ \texttt{add})\ \land \ \lnot \ \operatorname{UsesOpcode}(\mathsf{LLVMIR},\ \texttt{sub})\ \land \ \lnot \ \operatorname{UsesOpcode}(\mathsf{LLVMIR},\ \texttt{mul})\ \land \ \operatorname{UsesIntrinsic}(\mathsf{LLVMIR},\ \texttt{llvm.*.with.overflow}) \\[0.16em]
\operatorname{CheckedDivRem}(\mathsf{LLVMIR})\ \Leftrightarrow \ \operatorname{UsesIntrinsic}(\mathsf{LLVMIR},\ \texttt{llvm.sdiv.with.check})\ \land \ \operatorname{UsesIntrinsic}(\mathsf{LLVMIR},\ \texttt{llvm.udiv.with.check}) \\[0.16em]
\operatorname{CheckedShifts}(\mathsf{LLVMIR})\ \Leftrightarrow \ \operatorname{UsesIntrinsic}(\mathsf{LLVMIR},\ \texttt{llvm.shift.with.check}) \\[0.16em]
\operatorname{FrozenPoisonUses}(\mathsf{LLVMIR})\ \Leftrightarrow \ \operatorname{UsesOpcode}(\mathsf{LLVMIR},\ \texttt{freeze}) \\[0.16em]
\operatorname{InboundsGEP}(\mathsf{LLVMIR})\ \Leftrightarrow \ \lnot \ \operatorname{UsesOpcode}(\mathsf{LLVMIR},\ \texttt{getelementptr inbounds})\ \lor \ \operatorname{UsesOpcode}(\mathsf{LLVMIR},\ \texttt{gep.inbounds.checked}) \\[0.16em]
\operatorname{LLVMUBSafe}(\mathsf{LLVMIR})\ \Leftrightarrow \ \operatorname{NoUndefPoison}(\mathsf{LLVMIR})\ \land \ \operatorname{CheckedOverflow}(\mathsf{LLVMIR})\ \land \ \operatorname{CheckedDivRem}(\mathsf{LLVMIR})\ \land \ \operatorname{CheckedShifts}(\mathsf{LLVMIR})\ \land \ \operatorname{FrozenPoisonUses}(\mathsf{LLVMIR})\ \land \ \operatorname{InboundsGEP}(\mathsf{LLVMIR})\ \land \ \operatorname{NoNSWNUW}(\mathsf{LLVMIR})
\end{array}
$$

### 24.7.5 Memory Intrinsics

$$
\operatorname{Memmove}(\mathsf{dst},\ \mathsf{src},\ n)\ =\ [\texttt{call}\ \texttt{llvm.memmove}(\mathsf{dst},\ \mathsf{src},\ n)]
$$
MemcpyOverlapUnknown(dst, src, n) predicate

$$
\begin{array}{l}
\operatorname{MemcpyOverlapUnknown}(\mathsf{dst},\ \mathsf{src},\ n)\ \Leftrightarrow \ \mathsf{true} \\[0.16em]
\operatorname{MemcpyAllowed}(\mathsf{dst},\ \mathsf{src},\ n)\ \Leftrightarrow \ \lnot \ \operatorname{MemcpyOverlapUnknown}(\mathsf{dst},\ \mathsf{src},\ n) \\[0.16em]
\operatorname{AggMemcpy}(\mathsf{dst},\ \mathsf{src},\ n)\ = \\[0.16em]
\ \operatorname{Memcpy}(\mathsf{dst},\ \mathsf{src},\ n)\quad \mathsf{if}\ \operatorname{MemcpyAllowed}(\mathsf{dst},\ \mathsf{src},\ n) \\[0.16em]
\ \operatorname{Memmove}(\mathsf{dst},\ \mathsf{src},\ n)\quad \mathsf{otherwise} \\[0.16em]
\operatorname{AggZero}(\mathsf{dst},\ n)\ =\ \operatorname{Memset}(\mathsf{dst},\ 0,\ n) \\[0.16em]
\operatorname{LifetimeOpt}(T)\ \subseteq \ \{\texttt{llvm.lifetime.start}(\operatorname{sizeof}(T)),\ \texttt{llvm.lifetime.end}(\operatorname{sizeof}(T))\}
\end{array}
$$

### 24.7.6 LLVM Toolchain Version

LLVMToolchain = "21.1.8"
The hosted compiler MUST be built against an in-process LLVM backend whose version is LLVMToolchain.

### 24.7.7 LLVM Type Mapping

$$
\mathsf{LLVMTyJudg}\ =\ \{\operatorname{LLVMTy}(T)\ \Downarrow \ \tau \}
$$

$$
\begin{array}{l}
\mathsf{LLVMZST}\ =\ \{\} \\[0.16em]
\operatorname{Pad}(n)\ = \\[0.16em]
\ []\quad \mathsf{if}\ n\ =\ 0 \\[0.16em]
\ [n\ \times \ \mathsf{i8}]\ \mathsf{if}\ n\ \ne \ 0
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LLVMPrim}(\mathsf{name})\ = \\[0.16em]
\ \mathsf{i8}\quad \mathsf{if}\ \mathsf{name}\ \in \ \{\mathsf{i8},\ \mathsf{u8}\} \\[0.16em]
\ \mathsf{i16}\quad \mathsf{if}\ \mathsf{name}\ \in \ \{\mathsf{i16},\ \mathsf{u16}\} \\[0.16em]
\ \mathsf{i32}\quad \mathsf{if}\ \mathsf{name}\ \in \ \{\mathsf{i32},\ \mathsf{u32}\} \\[0.16em]
\ \mathsf{i64}\quad \mathsf{if}\ \mathsf{name}\ \in \ \{\mathsf{i64},\ \mathsf{u64}\} \\[0.16em]
\ \mathsf{i128}\quad \mathsf{if}\ \mathsf{name}\ \in \ \{\mathsf{i128},\ \mathsf{u128}\} \\[0.16em]
\ \texttt{half}\quad \mathsf{if}\ \mathsf{name}\ =\ \mathsf{f16} \\[0.16em]
\ \texttt{float}\ \mathsf{if}\ \mathsf{name}\ =\ \mathsf{f32} \\[0.16em]
\ \texttt{double}\ \mathsf{if}\ \mathsf{name}\ =\ \mathsf{f64} \\[0.16em]
\ \mathsf{i8}\quad \mathsf{if}\ \mathsf{name}\ =\ \texttt{bool} \\[0.16em]
\ \mathsf{i32}\quad \mathsf{if}\ \mathsf{name}\ =\ \texttt{char} \\[0.16em]
\ \mathsf{i64}\quad \mathsf{if}\ \mathsf{name}\ \in \ \{\texttt{usize},\ \texttt{isize}\} \\[0.16em]
\ \mathsf{LLVMZST}\ \mathsf{if}\ \mathsf{name}\ \in \ \{\texttt{()},\ \texttt{!}\} \\[0.16em]
\ \bot \quad \mathsf{otherwise}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LLVMStruct}([t_{1},\ \ldots ,\ t_{k}])\ =\ \{\ t_{1},\ \ldots ,\ t_{k}\ \} \\[0.16em]
\operatorname{LLVMArray}(n,\ t)\ =\ [n\ \times \ t]
\end{array}
$$
LLVMArrayConst(n, t, elems) constructor

$$
\operatorname{SlicePtrTy}(T)\ =\ \operatorname{LLVMPtrTy}(\operatorname{TypeRawPtr}(\texttt{imm},\ T))
$$

$$
\begin{array}{l}
\operatorname{StructElems}([],\ [],\ 0)\ =\ [] \\[0.16em]
\operatorname{StructElems}([\langle f_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle f_{n},\ T_{n}\rangle ],\ [o_{1},\ \ldots ,\ o_{n}],\ \mathsf{size})\ =\ \operatorname{Pad}(\mathsf{pad}_{1})\ \mathbin{++} \ [\tau_{1} ]\ \mathbin{++} \ \ldots \ \mathbin{++} \ \operatorname{Pad}(\mathsf{pad}_{n})\ \mathbin{++} \ [\tau_{n} ]\ \mathbin{++} \ \operatorname{Pad}(\mathsf{pad}_{\mathsf{tail}}) \\[0.16em]
\mathsf{pad}_{1}\ =\ o_{1} \\[0.16em]
\mathsf{pad}_{i}\ =\ o_{i}\ -\ (o\_\{i-1\}\ +\ \operatorname{sizeof}(T\_\{i-1\}))\quad \mathsf{for}\ i\ =\ 2..n \\[0.16em]
\mathsf{pad}_{\mathsf{tail}}\ =\ \mathsf{size}\ -\ (o_{n}\ +\ \operatorname{sizeof}(T_{n})) \\[0.16em]
\tau_{i} \ =\ \operatorname{LLVMTy}(T_{i})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{TaggedElems}(\mathsf{disc},\ \mathsf{payload}_{\mathsf{size}},\ \mathsf{payload}_{\mathsf{align}},\ \mathsf{size})\ =\ [\operatorname{LLVMTy}(\mathsf{disc})]\ \mathbin{++} \ \operatorname{Pad}(\mathsf{pad}_{\mathsf{mid}})\ \mathbin{++} \ [\operatorname{LLVMArray}(\mathsf{payload}_{\mathsf{size}},\ \mathsf{i8})]\ \mathbin{++} \ \operatorname{Pad}(\mathsf{pad}_{\mathsf{tail}}) \\[0.16em]
\mathsf{disc}_{\mathsf{size}}\ =\ \operatorname{sizeof}(\mathsf{disc}) \\[0.16em]
\mathsf{payload}_{\mathsf{off}}\ =\ \operatorname{AlignUp}(\mathsf{disc}_{\mathsf{size}},\ \mathsf{payload}_{\mathsf{align}}) \\[0.16em]
\mathsf{pad}_{\mathsf{mid}}\ =\ \mathsf{payload}_{\mathsf{off}}\ -\ \mathsf{disc}_{\mathsf{size}} \\[0.16em]
\mathsf{pad}_{\mathsf{tail}}\ =\ \mathsf{size}\ -\ (\mathsf{payload}_{\mathsf{off}}\ +\ \mathsf{payload}_{\mathsf{size}})
\end{array}
$$

**(LLVMTy-Prim)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePrim}(\mathsf{name})\quad \operatorname{LLVMPrim}(\mathsf{name})\ =\ \tau  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau 
\end{array}
$$

**(LLVMTy-Perm)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMTy}(\operatorname{TypePerm}(p,\ T))\ \Downarrow \ \tau 
\end{array}
$$

**(LLVMTy-Refine)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMTy}(\operatorname{TypeRefine}(T,\ P))\ \Downarrow \ \tau 
\end{array}
$$

**(LLVMTy-Ptr)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePtr}(U,\ s)\quad \operatorname{LLVMPtrTy}(T)\ =\ \tau  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau 
\end{array}
$$

**(LLVMTy-RawPtr)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeRawPtr}(q,\ U)\quad \operatorname{LLVMPtrTy}(T)\ =\ \tau  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau 
\end{array}
$$

**(LLVMTy-Func)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeFunc}(\mathsf{params},\ R)\quad \operatorname{LLVMPtrTy}(T)\ =\ \tau  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau 
\end{array}
$$

**(LLVMTy-Closure)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeClosure}(\mathsf{params},\ R,\ \mathsf{deps}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \operatorname{LLVMStruct}([\texttt{ptr},\ \texttt{ptr}])
\end{array}
$$

**(LLVMTy-Alias)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{AliasBody}(p)\ =\ \mathsf{ty}\quad \Gamma \ \vdash \ \operatorname{LLVMTy}(\mathsf{ty})\ \Downarrow \ \tau  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau 
\end{array}
$$

**(LLVMTy-Record)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \operatorname{Fields}(R)\ =\ \mathsf{fields}\quad \operatorname{RecordLayout}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \quad \operatorname{StructElems}(\mathsf{fields},\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{elems} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \operatorname{LLVMStruct}(\mathsf{elems})
\end{array}
$$

**(LLVMTy-Tuple)**

$$
\begin{array}{l}
\operatorname{TupleLayout}([T_{1},\ \ldots ,\ T_{n}])\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \quad \operatorname{StructElems}([\langle 0,\ T_{1}\rangle ,\ \ldots ,\ \langle n-1,\ T_{n}\rangle ],\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{elems} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMTy}(\operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}]))\ \Downarrow \ \operatorname{LLVMStruct}(\mathsf{elems})
\end{array}
$$

**(LLVMTy-Array)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeArray}(T_{0},\ e)\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e)\ \Downarrow \ n\quad \Gamma \ \vdash \ \operatorname{LLVMTy}(T_{0})\ \Downarrow \ \tau  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \operatorname{LLVMArray}(n,\ \tau )
\end{array}
$$

**(LLVMTy-Slice)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeSlice}(T_{0})\quad \Gamma \ \vdash \ \operatorname{LLVMTy}(\operatorname{TypePrim}(\texttt{"usize"}))\ \Downarrow \ \tau_{u}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \operatorname{LLVMStruct}([\operatorname{SlicePtrTy}(T_{0}),\ \tau_{u} ])
\end{array}
$$

**(LLVMTy-Range)**

$$
\begin{array}{l}
\operatorname{TupleLayout}([T_{0},\ T_{0}])\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \quad \operatorname{StructElems}([\langle 0,\ T_{0}\rangle ,\ \langle 1,\ T_{0}\rangle ],\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{elems} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMTy}(\operatorname{TypeRange}(T_{0}))\ \Downarrow \ \operatorname{LLVMStruct}(\mathsf{elems})
\end{array}
$$

**(LLVMTy-RangeInclusive)**

$$
\begin{array}{l}
\operatorname{TupleLayout}([T_{0},\ T_{0}])\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \quad \operatorname{StructElems}([\langle 0,\ T_{0}\rangle ,\ \langle 1,\ T_{0}\rangle ],\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{elems} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMTy}(\operatorname{TypeRangeInclusive}(T_{0}))\ \Downarrow \ \operatorname{LLVMStruct}(\mathsf{elems})
\end{array}
$$

**(LLVMTy-RangeFrom)**

$$
\begin{array}{l}
\operatorname{TupleLayout}([T_{0}])\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \quad \operatorname{StructElems}([\langle 0,\ T_{0}\rangle ],\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{elems} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMTy}(\operatorname{TypeRangeFrom}(T_{0}))\ \Downarrow \ \operatorname{LLVMStruct}(\mathsf{elems})
\end{array}
$$

**(LLVMTy-RangeTo)**

$$
\begin{array}{l}
\operatorname{TupleLayout}([T_{0}])\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \quad \operatorname{StructElems}([\langle 0,\ T_{0}\rangle ],\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{elems} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMTy}(\operatorname{TypeRangeTo}(T_{0}))\ \Downarrow \ \operatorname{LLVMStruct}(\mathsf{elems})
\end{array}
$$

**(LLVMTy-RangeToInclusive)**

$$
\begin{array}{l}
\operatorname{TupleLayout}([T_{0}])\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \quad \operatorname{StructElems}([\langle 0,\ T_{0}\rangle ],\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{elems} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMTy}(\operatorname{TypeRangeToInclusive}(T_{0}))\ \Downarrow \ \operatorname{LLVMStruct}(\mathsf{elems})
\end{array}
$$

**(LLVMTy-RangeFull)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMTy}(\mathsf{TypeRangeFull})\ \Downarrow \ \operatorname{LLVMStruct}([])
\end{array}
$$

**(LLVMTy-Enum)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{EnumLayout}(E)\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{disc},\ \mathsf{payload}_{\mathsf{size}}\rangle \quad \mathsf{payload}_{\mathsf{align}}\ =\ \operatorname{PayloadAlign}(E)\quad \operatorname{TaggedElems}(\mathsf{disc},\ \mathsf{payload}_{\mathsf{size}},\ \mathsf{payload}_{\mathsf{align}},\ \mathsf{size})\ =\ \mathsf{elems} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \operatorname{LLVMStruct}(\mathsf{elems})
\end{array}
$$

**(LLVMTy-Union-Niche)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad \operatorname{NicheApplies}(T)\quad \operatorname{PayloadMember}(T)\ =\ T_{p}\quad \Gamma \ \vdash \ \operatorname{LLVMTy}(T_{p})\ \Downarrow \ \tau  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau 
\end{array}
$$

**(LLVMTy-Union-Tagged)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad \operatorname{UnionLayout}(T)\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{disc},\ \mathsf{payload}_{\mathsf{size}}\rangle \quad \mathsf{disc}\ \ne \ \bot \quad \mathsf{payload}_{\mathsf{align}}\ =\ \operatorname{PayloadAlign}(T)\quad \operatorname{TaggedElems}(\mathsf{disc},\ \mathsf{payload}_{\mathsf{size}},\ \mathsf{payload}_{\mathsf{align}},\ \mathsf{size})\ =\ \mathsf{elems} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \operatorname{LLVMStruct}(\mathsf{elems})
\end{array}
$$

**(LLVMTy-Modal-Niche)**

$$
\begin{array}{l}
T\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \operatorname{NicheApplies}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{PayloadState}(\mathsf{modal}_{\mathsf{ref}})\ =\ S_{p}\quad \operatorname{ModalSingleFieldPayload}(\mathsf{modal}_{\mathsf{ref}},\ S_{p})\ =\ T_{p}\quad \Gamma \ \vdash \ \operatorname{LLVMTy}(T_{p})\ \Downarrow \ \tau  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau 
\end{array}
$$

**(LLVMTy-Modal-Tagged)**

$$
\begin{array}{l}
T\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \operatorname{ModalLayout}(\mathsf{modal}_{\mathsf{ref}})\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{disc},\ \mathsf{payload}_{\mathsf{size}}\rangle \quad \mathsf{disc}\ \ne \ \bot \quad \mathsf{payload}_{\mathsf{align}}\ =\ \mathsf{max}\_\{S\ \in \ \operatorname{States}(M)\}(\operatorname{StateAlign}(\mathsf{modal}_{\mathsf{ref}},\ S))\quad \operatorname{TaggedElems}(\mathsf{disc},\ \mathsf{payload}_{\mathsf{size}},\ \mathsf{payload}_{\mathsf{align}},\ \mathsf{size})\ =\ \mathsf{elems} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \operatorname{LLVMStruct}(\mathsf{elems})
\end{array}
$$

**(LLVMTy-Modal-StringBytes)**

$$
\begin{array}{l}
\operatorname{BaseModal}(\operatorname{TypeString}(\bot ))\ =\ \operatorname{TypePath}([\texttt{"string"}]) \\[0.16em]
\operatorname{BaseModal}(\operatorname{TypeBytes}(\bot ))\ =\ \operatorname{TypePath}([\texttt{"bytes"}]) \\[0.16em]
T\ \in \ \{\operatorname{TypeString}(\bot ),\ \operatorname{TypeBytes}(\bot )\}\quad \operatorname{ModalLayout}(\operatorname{BaseModal}(T))\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{disc},\ \mathsf{payload}_{\mathsf{size}}\rangle \quad (\mathsf{disc}\ =\ \bot \ \Rightarrow \ \operatorname{PayloadState}(\operatorname{BaseModal}(T))\ =\ S_{p}\ \land \ \operatorname{ModalSingleFieldPayload}(\operatorname{BaseModal}(T),\ S_{p})\ =\ T_{p}\ \land \ \Gamma \ \vdash \ \operatorname{LLVMTy}(T_{p})\ \Downarrow \ \tau )\quad (\mathsf{disc}\ \ne \ \bot \ \Rightarrow \ \operatorname{ModalDeclOf}(\operatorname{BaseModal}(T))\ =\ M\ \land \ \mathsf{payload}_{\mathsf{align}}\ =\ \mathsf{max}\_\{S\ \in \ \operatorname{States}(M)\}(\operatorname{StateAlign}(\operatorname{BaseModal}(T),\ S))\ \land \ \operatorname{TaggedElems}(\mathsf{disc},\ \mathsf{payload}_{\mathsf{size}},\ \mathsf{payload}_{\mathsf{align}},\ \mathsf{size})\ =\ \mathsf{elems}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ (\tau \ \mathsf{if}\ \mathsf{disc}\ =\ \bot \ \mathsf{else}\ \operatorname{LLVMStruct}(\mathsf{elems}))
\end{array}
$$

**(LLVMTy-ModalState)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad S\ \in \ \operatorname{States}(M)\quad \operatorname{ModalPayload}(\mathsf{modal}_{\mathsf{ref}},\ S)\ =\ \mathsf{fields}\quad \operatorname{RecordLayout}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \quad \operatorname{StructElems}(\mathsf{fields},\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{elems} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \operatorname{LLVMStruct}(\mathsf{elems})
\end{array}
$$

**(LLVMTy-Dynamic)**

$$
\begin{array}{l}
\operatorname{DynLayout}(\mathsf{Cl})\ \Downarrow \ \langle \_,\ \_,\ [\langle \texttt{data},\ T_{d}\rangle ,\ \langle \texttt{vtable},\ T_{v}\rangle ]\rangle \quad \Gamma \ \vdash \ \operatorname{LLVMTy}(T_{d})\ \Downarrow \ \tau_{d} \quad \Gamma \ \vdash \ \operatorname{LLVMTy}(T_{v})\ \Downarrow \ \tau_{v}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMTy}(\operatorname{TypeDynamic}(\mathsf{Cl}))\ \Downarrow \ \operatorname{LLVMStruct}([\tau_{d} ,\ \tau_{v} ])
\end{array}
$$

**(LLVMTy-StringView)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeString}(\texttt{@View})\quad \Gamma \ \vdash \ \operatorname{LLVMTy}(\operatorname{TypePrim}(\texttt{"usize"}))\ \Downarrow \ \tau_{u}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \operatorname{LLVMStruct}([\operatorname{LLVMPtrTy}(\operatorname{TypePtr}(\operatorname{TypePerm}(\texttt{const},\ \operatorname{TypePrim}(\texttt{"u8"})),\ \texttt{Valid})),\ \tau_{u} ])
\end{array}
$$

**(LLVMTy-StringManaged)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeString}(\texttt{@Managed})\quad \Gamma \ \vdash \ \operatorname{LLVMTy}(\operatorname{TypePrim}(\texttt{"usize"}))\ \Downarrow \ \tau_{u}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \operatorname{LLVMStruct}([\operatorname{LLVMPtrTy}(\operatorname{TypePtr}(\operatorname{TypePrim}(\texttt{"u8"}),\ \texttt{Valid})),\ \tau_{u} ,\ \tau_{u} ])
\end{array}
$$

**(LLVMTy-BytesView)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeBytes}(\texttt{@View})\quad \Gamma \ \vdash \ \operatorname{LLVMTy}(\operatorname{TypePrim}(\texttt{"usize"}))\ \Downarrow \ \tau_{u}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \operatorname{LLVMStruct}([\operatorname{LLVMPtrTy}(\operatorname{TypePtr}(\operatorname{TypePerm}(\texttt{const},\ \operatorname{TypePrim}(\texttt{"u8"})),\ \texttt{Valid})),\ \tau_{u} ])
\end{array}
$$

**(LLVMTy-BytesManaged)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeBytes}(\texttt{@Managed})\quad \Gamma \ \vdash \ \operatorname{LLVMTy}(\operatorname{TypePrim}(\texttt{"usize"}))\ \Downarrow \ \tau_{u}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \operatorname{LLVMStruct}([\operatorname{LLVMPtrTy}(\operatorname{TypePtr}(\operatorname{TypePrim}(\texttt{"u8"}),\ \texttt{Valid})),\ \tau_{u} ,\ \tau_{u} ])
\end{array}
$$

**(LLVMTy-Err)**
LLVMTy(T) undefined

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Uparrow 
\end{array}
$$

### 24.7.8 IR Declaration and Instruction Lowering

$$
\mathsf{LowerIRJudg}\ =\ \{\operatorname{LowerIRDecl}(d)\ \Downarrow \ \mathsf{ll},\ \operatorname{LowerIRInstr}(\mathsf{op})\ \Downarrow \ \mathsf{ll}\}
$$

$$
\begin{array}{l}
\mathsf{LLVMInstrList}\ =\ [\mathsf{LLVMInstr}] \\[0.16em]
\operatorname{Label}(l)\ \in \ \mathsf{LLVMInstr} \\[0.16em]
\operatorname{Br}(l)\ \in \ \mathsf{LLVMInstr} \\[0.16em]
\operatorname{BrCond}(v,\ l_{t},\ l_{f})\ \in \ \mathsf{LLVMInstr} \\[0.16em]
\operatorname{Phi}(\tau ,\ \mathsf{inc},\ v)\ \in \ \mathsf{LLVMInstr} \\[0.16em]
\operatorname{HasLabel}(I,\ l)\ \Leftrightarrow \ \operatorname{Label}(l)\ \in \ I \\[0.16em]
\operatorname{HasBrCond}(I,\ v)\ \Leftrightarrow \ \exists \ l_{t},\ l_{f}.\ \operatorname{BrCond}(v,\ l_{t},\ l_{f})\ \in \ I \\[0.16em]
\operatorname{HasPhi}(I,\ v)\ \Leftrightarrow \ \exists \ \tau ,\ \mathsf{inc}.\ \operatorname{Phi}(\tau ,\ \mathsf{inc},\ v)\ \in \ I \\[0.16em]
\operatorname{FreshLabel}(\Gamma )\ \mathsf{predicate} \\[0.16em]
\operatorname{FreshSSA}(\Gamma )\ \mathsf{predicate} \\[0.16em]
\mathsf{LLVMSSA}\ =\ \mathsf{Name} \\[0.16em]
\mathsf{LLVMLabel}\ =\ \mathsf{Name} \\[0.16em]
\operatorname{FreshLabel}(\Gamma )\ \in \ \mathsf{LLVMLabel}\ \setminus \ \operatorname{dom}(\Gamma ) \\[0.16em]
\operatorname{FreshSSA}(\Gamma )\ \in \ \mathsf{LLVMSSA}\ \setminus \ \operatorname{dom}(\Gamma )
\end{array}
$$

$$
\operatorname{IfLabels}(\Gamma )\ =\ \langle l_{t},\ l_{f},\ l_{m}\rangle \ \land \ \operatorname{Distinct}([l_{t},\ l_{f},\ l_{m}])
$$

$$
\begin{array}{l}
\mathsf{LLResult}\ =\ \{\langle I,\ v\rangle \ \mid \ I\ \in \ \mathsf{LLVMInstrList}\ \land \ v\ \in \ \mathsf{LLVMSSA}\ \cup \ \{\bot \}\} \\[0.16em]
\operatorname{SeqLL}(\langle I_{1},\ v_{1}\rangle ,\ \langle I_{2},\ v_{2}\rangle )\ =\ \langle I_{1}\ \mathbin{++} \ I_{2},\ v_{2}\rangle 
\end{array}
$$

**(LowerIRInstr-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\varepsilon )\ \Downarrow \ \langle [],\ \bot \rangle 
\end{array}
$$

**(LowerIRInstr-Seq)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{IR}_{1})\ \Downarrow \ \mathsf{ll}_{1}\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{IR}_{2})\ \Downarrow \ \mathsf{ll}_{2} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{SeqIR}(\mathsf{IR}_{1},\ \mathsf{IR}_{2}))\ \Downarrow \ \operatorname{SeqLL}(\mathsf{ll}_{1},\ \mathsf{ll}_{2})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Load}(\mathsf{slot},\ T)\ =\ [\texttt{load}\ \operatorname{LLVMTy}(T),\ \mathsf{slot}\ :\ \operatorname{LLVMPtrTy}(T)] \\[0.16em]
\operatorname{Store}(\mathsf{slot},\ v,\ T)\ =\ [\texttt{store}\ \operatorname{LLVMTy}(T)\ v,\ \mathsf{slot}\ :\ \operatorname{LLVMPtrTy}(T)] \\[0.16em]
\operatorname{Memcpy}(\mathsf{dst},\ \mathsf{src},\ n)\ =\ [\texttt{call}\ \texttt{llvm.memcpy}(\mathsf{dst},\ \mathsf{src},\ n)] \\[0.16em]
\operatorname{Memset}(\mathsf{dst},\ 0,\ n)\ =\ [\texttt{call}\ \texttt{llvm.memset}(\mathsf{dst},\ 0,\ n)] \\[0.16em]
\operatorname{LoadVal}(\mathsf{slot},\ T)\ \Downarrow \ \langle \operatorname{Load}(\mathsf{slot},\ T),\ v\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LEValue}(\mathsf{bytes})\ =\ \sum \_\{i=0\}^\{\mid \mathsf{bytes}\mid -1\}\ \mathsf{bytes}[i]\ \cdot \ 256^i \\[0.16em]
\operatorname{ByteInt}(\mathsf{bytes})\ =\ i\{8\mid \mathsf{bytes}\mid \}\ \operatorname{LEValue}(\mathsf{bytes})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{AllZero}(\mathsf{bytes})\ \Leftrightarrow \ \forall \ b\ \in \ \mathsf{bytes}.\ b\ =\ 0\mathsf{x00} \\[0.16em]
\operatorname{ByteArray}(\mathsf{bytes})\ =\ \operatorname{LLVMArrayConst}(\mid \mathsf{bytes}\mid ,\ \mathsf{i8},\ \mathsf{bytes}) \\[0.16em]
\operatorname{ConstBytes}(\tau ,\ \mathsf{bytes})\ =\ c\ \Leftrightarrow \ \exists \ T.\ \Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau \ \land \ \mid \mathsf{bytes}\mid \ =\ \operatorname{sizeof}(T)\ \land \ c\ =\ \operatorname{ConstBytesCase}(\tau ,\ \mathsf{bytes}) \\[0.16em]
\operatorname{ConstBytesCase}(\tau ,\ \mathsf{bytes})\ = \\[0.16em]
\ \texttt{zeroinitializer}\quad \mathsf{if}\ \mid \mathsf{bytes}\mid \ =\ 0 \\[0.16em]
\ \operatorname{ByteArray}(\mathsf{bytes})\quad \mathsf{if}\ \tau \ =\ \operatorname{LLVMArray}(\mid \mathsf{bytes}\mid ,\ \mathsf{i8}) \\[0.16em]
\ \operatorname{ByteInt}(\mathsf{bytes})\quad \mathsf{if}\ \tau \ =\ i\{8\mid \mathsf{bytes}\mid \} \\[0.16em]
\ \texttt{bitcast}(\operatorname{ByteInt}(\mathsf{bytes})\ \mathsf{to}\ \tau )\quad \mathsf{if}\ \tau \ \in \ \{\texttt{half},\ \texttt{float},\ \texttt{double}\} \\[0.16em]
\ \texttt{null}\quad \mathsf{if}\ \tau \ =\ \operatorname{LLVMPtrTy}(U)\ \land \ \operatorname{AllZero}(\mathsf{bytes}) \\[0.16em]
\ \bot \quad \mathsf{otherwise} \\[0.16em]
\operatorname{LLVMGlobalZero}(\mathsf{sym},\ \tau ,\ \mathsf{align})\ =\ \operatorname{LLVMGlobalConst}(\mathsf{sym},\ \tau ,\ \texttt{zeroinitializer},\ \mathsf{align})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{StaticType}(\mathsf{sym})\ =\ \operatorname{TypeArray}(\operatorname{TypePrim}(\texttt{"u8"}),\ \operatorname{Literal}(\operatorname{IntLiteral}(\mid \mathsf{bytes}\mid )))\quad \mathsf{if}\ \mathsf{sym}\ =\ \operatorname{Mangle}(\operatorname{LiteralData}(\mathsf{kind},\ \mathsf{bytes})) \\[0.16em]
\operatorname{StaticType}(\mathsf{sym})\ =\ T\ \Leftrightarrow \ \operatorname{StaticSymPath}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{sym}\ \land \ \operatorname{StaticType}(\mathsf{path},\ \mathsf{name})\ =\ T \\[0.16em]
\mathsf{StateRefJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{StateRef}(\mathsf{sym})\ \Downarrow \ \mathsf{slot}\}
\end{array}
$$
SessionStateSlot(sym) denotes the addressable storage slot for `sym` in the active hosted session environment.

**(StateRef-Session)**

$$
\begin{array}{l}
\operatorname{HostedStateSym}(\operatorname{Project}(\Gamma ),\ \mathsf{sym}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{StateRef}(\mathsf{sym})\ \Downarrow \ \operatorname{SessionStateSlot}(\mathsf{sym})
\end{array}
$$

**(StateRef-Global)**

$$
\begin{array}{l}
\lnot \ \operatorname{HostedStateSym}(\operatorname{Project}(\Gamma ),\ \mathsf{sym}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{StateRef}(\mathsf{sym})\ \Downarrow \ @\mathsf{sym}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ProcModule}(\mathsf{sym})\ =\ m\ \Leftrightarrow \ \exists \ \mathsf{item},\ p.\ \mathsf{item}\ \in \ \{\mathsf{ProcedureDecl},\ \mathsf{MethodDecl},\ \mathsf{ClassMethodDecl},\ \mathsf{StateMethodDecl},\ \mathsf{TransitionDecl},\ \mathsf{DefaultImpl}\}\ \land \ \operatorname{ItemPath}(\mathsf{item})\ =\ p\ \land \ \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym}\ \land \ \operatorname{ModuleOfPath}(p)\ =\ m \\[0.16em]
\operatorname{SigOf}(\mathsf{callee})\ = \\[0.16em]
\ \langle \mathsf{params},\ \mathsf{ret}\rangle \quad \mathsf{if}\ \mathsf{callee}\ =\ \mathsf{sym}\ \land \ \Gamma \ \vdash \ \operatorname{Mangle}(d)\ \Downarrow \ \mathsf{sym}\ \land \ d\ \in \ \{\mathsf{ProcedureDecl},\ \mathsf{MethodDecl},\ \mathsf{DefaultImpl}\}\ \land \ \operatorname{Sig}(d)\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle  \\[0.16em]
\ \operatorname{RuntimeSig}(\mathsf{sym})\ \mathsf{if}\ \mathsf{callee}\ =\ \mathsf{sym}\ \land \ \operatorname{RuntimeSig}(\mathsf{sym})\ \mathsf{defined} \\[0.16em]
\ \langle \mathsf{params},\ \mathsf{ret}\rangle \quad \mathsf{if}\ \operatorname{ExprType}(\mathsf{callee})\ =\ \operatorname{TypeFunc}(\mathsf{params},\ \mathsf{ret}) \\[0.16em]
\ \bot \quad \mathsf{otherwise} \\[0.16em]
\operatorname{LoweredSigOf}(\mathsf{callee})\ =\ \langle \mathsf{params}',\ \mathsf{ret}\rangle \ \Leftrightarrow \ \langle \mathsf{params},\ \mathsf{ret}\rangle \ =\ \operatorname{SigOf}(\mathsf{callee})\ \land \ \mathsf{params}'\ =\ (\operatorname{NeedsPanicOut}(\mathsf{callee})\ \mathsf{Sigma}\ \mathsf{params}\ \mathbin{++} \ [\mathsf{PanicOutParam}]\ :\ \mathsf{params})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ParamInitIR}(\mathsf{sig},\ \mathsf{params})\ =\ \mathbin{++} \_\{\langle \mathsf{mode},\ x,\ T\rangle \ \in \ \mathsf{params}\}\ \operatorname{ParamInit}(\mathsf{sig},\ \mathsf{params},\ x,\ \mathsf{mode},\ T) \\[0.16em]
\operatorname{ZeroValue}(T)\ =\ \texttt{zeroinitializer}\ \mathsf{if}\ \operatorname{sizeof}(T)\ =\ 0 \\[0.16em]
\operatorname{ParamInit}(\mathsf{sig},\ \mathsf{params},\ x,\ \mathsf{mode},\ T)\ = \\[0.16em]
\ \operatorname{Store}(\operatorname{BindSlot}(x),\ \operatorname{LLVMParam}(\mathsf{sig},\ \mathsf{params},\ x),\ T)\quad \mathsf{if}\ \operatorname{ABIParam}(\mathsf{mode},\ T)\ =\ \texttt{ByValue}\ \land \ \operatorname{sizeof}(T)\ >\ 0 \\[0.16em]
\ \operatorname{Store}(\operatorname{BindSlot}(x),\ \operatorname{ZeroValue}(T),\ T)\quad \mathsf{if}\ \operatorname{ABIParam}(\mathsf{mode},\ T)\ =\ \texttt{ByValue}\ \land \ \operatorname{sizeof}(T)\ =\ 0 \\[0.16em]
\ \varepsilon \quad \mathsf{if}\ \operatorname{ABIParam}(\mathsf{mode},\ T)\ =\ \texttt{ByRef} \\[0.16em]
\operatorname{ParamOrder}(\mathsf{params})\ =\ [x_{i}\ \mid \ \langle \mathsf{mode}_{i},\ x_{i},\ T_{i}\rangle \ \in \ \mathsf{params}\ \land \ (\operatorname{ABIParam}(\mathsf{mode}_{i},\ T_{i})\ =\ \texttt{ByRef}\ \lor \ \operatorname{sizeof}(T_{i})\ >\ 0)] \\[0.16em]
\operatorname{ParamIndex}(\mathsf{params},\ x)\ =\ i\ \Leftrightarrow \ \operatorname{ParamOrder}(\mathsf{params})[i]\ =\ x \\[0.16em]
\operatorname{LLVMArgs}(\mathsf{sig})\ =\ \mathsf{sig}.\mathsf{llvm}_{\mathsf{params}} \\[0.16em]
\operatorname{LLVMArg}(\mathsf{sig},\ i)\ =\ \operatorname{LLVMArgs}(\mathsf{sig})[i] \\[0.16em]
i'\ =\ (\mathsf{sig}.\mathsf{sretSigma}\ \mathsf{Sigma}\ \operatorname{ParamIndex}(\mathsf{params},\ x)\ +\ 1\ :\ \operatorname{ParamIndex}(\mathsf{params},\ x)) \\[0.16em]
\operatorname{LLVMParam}(\mathsf{sig},\ \mathsf{params},\ x)\ =\ \operatorname{LLVMArg}(\mathsf{sig},\ i')
\end{array}
$$

**(LowerIRDecl-Proc-User)**

$$
\begin{array}{l}
\operatorname{LLVMCallSig}(\mathsf{params},\ R)\ \Downarrow \ \mathsf{sig}\quad \operatorname{ProcModule}(\mathsf{sym})\ =\ m\quad \mathsf{IR}_{p}\ =\ \operatorname{ParamInitIR}(\mathsf{sig},\ \mathsf{params})\quad \mathsf{IR}_{0}\ =\ (\operatorname{NeedsPanicOut}(\mathsf{sym})\ \mathsf{Sigma}\ \operatorname{SeqIR}(\mathsf{ClearPanic},\ \mathsf{IR})\ :\ \mathsf{IR})\quad \mathsf{IR}'\ =\ \operatorname{SeqIR}(\mathsf{IR}_{p},\ \operatorname{CheckPoison}(m),\ \mathsf{IR}_{0})\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{IR}')\ \Downarrow \ \mathsf{ll} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRDecl}(\operatorname{ProcIR}(\mathsf{sym},\ \mathsf{params},\ R,\ \mathsf{IR}))\ \Downarrow \ \operatorname{LLVMDefine}(\mathsf{sym},\ \mathsf{sig},\ \mathsf{ll})
\end{array}
$$

**(LowerIRDecl-Proc-Gen)**

$$
\begin{array}{l}
\operatorname{LLVMCallSig}(\mathsf{params},\ R)\ \Downarrow \ \mathsf{sig}\quad \operatorname{ProcModule}(\mathsf{sym})\ \mathsf{undefined}\quad \mathsf{IR}_{p}\ =\ \operatorname{ParamInitIR}(\mathsf{sig},\ \mathsf{params})\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{SeqIR}(\mathsf{IR}_{p},\ (\operatorname{NeedsPanicOut}(\mathsf{sym})\ \mathsf{Sigma}\ \operatorname{SeqIR}(\mathsf{ClearPanic},\ \mathsf{IR})\ :\ \mathsf{IR})))\ \Downarrow \ \mathsf{ll} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRDecl}(\operatorname{ProcIR}(\mathsf{sym},\ \mathsf{params},\ R,\ \mathsf{IR}))\ \Downarrow \ \operatorname{LLVMDefine}(\mathsf{sym},\ \mathsf{sig},\ \mathsf{ll})
\end{array}
$$

**(LowerIRDecl-GlobalConst)**

$$
\begin{array}{l}
T\ =\ \operatorname{StaticType}(\mathsf{sym})\quad \Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau \quad \operatorname{ConstBytes}(\tau ,\ \mathsf{bytes})\ =\ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRDecl}(\operatorname{GlobalConst}(\mathsf{sym},\ \mathsf{bytes}))\ \Downarrow \ \operatorname{LLVMGlobalConst}(\mathsf{sym},\ \tau ,\ c,\ \operatorname{alignof}(T))
\end{array}
$$

**(LowerIRDecl-GlobalZero)**

$$
\begin{array}{l}
T\ =\ \operatorname{StaticType}(\mathsf{sym})\quad \Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau \quad \mathsf{size}\ =\ \operatorname{sizeof}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRDecl}(\operatorname{GlobalZero}(\mathsf{sym},\ \mathsf{size}))\ \Downarrow \ \operatorname{LLVMGlobalZero}(\mathsf{sym},\ \tau ,\ \operatorname{alignof}(T))
\end{array}
$$

When `HostedStateSym(Project(Γ), sym)` holds, the `GlobalConst(sym, bytes)` and `GlobalZero(sym, size)` judgments above define the initializer template for the per-session slot selected by `StateRef(sym)`, not one shared mutable runtime cell. A conforming backend MAY materialize that template as immutable process-global data, but every runtime load/store routed through `StateRef(sym)` MUST observe the distinct live-session cell required by §24.4.1.

**(LowerIRDecl-VTable)**

$$
\begin{array}{l}
\operatorname{GlobalVTable}(\mathsf{sym},\ \mathsf{header},\ \mathsf{slots})\ =\ d \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRDecl}(d)\ \Downarrow \ \operatorname{LLVMGlobalVTable}(\mathsf{sym},\ \mathsf{header},\ \mathsf{slots})
\end{array}
$$

**(Lower-AllocIR)**

$$
\begin{array}{l}
\operatorname{BuiltinModalSym}(\texttt{Region::alloc})\ \Downarrow \ \mathsf{sym}\quad r\ =\ \operatorname{InnermostActiveRegion}(\Gamma )\ \mathsf{if}\ r_{\mathsf{opt}}\ =\ \bot ,\ \mathsf{otherwise}\ r_{\mathsf{opt}}\quad \operatorname{TypeOf}(v)\ =\ T\quad \operatorname{sizeof}(T)\ =\ n\quad \operatorname{alignof}(T)\ =\ a\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{CallIR}(\mathsf{sym},\ [r,\ \operatorname{IntVal}(\texttt{usize},\ n),\ \operatorname{IntVal}(\texttt{usize},\ a)]))\ \Downarrow \ \langle I_{a},\ p\rangle \quad \operatorname{Store}(p,\ v,\ T)\ =\ I_{s} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{AllocIR}(r_{\mathsf{opt}},\ v))\ \Downarrow \ \langle I_{a}\ \mathbin{++} \ I_{s},\ p\rangle 
\end{array}
$$

**(Lower-BindVarIR)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{BindSlot}(x)\ \Downarrow \ \mathsf{slot}\quad \operatorname{TypeOf}(x)\ =\ T_{x} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{BindVarIR}(x,\ v))\ \Downarrow \ \langle [\operatorname{Store}(\mathsf{slot},\ v,\ T_{x})],\ \bot \rangle 
\end{array}
$$

**(Lower-ReadVarIR)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{BindSlot}(x)\ \Downarrow \ \mathsf{slot}\quad \operatorname{TypeOf}(x)\ =\ T_{x}\quad \Gamma \ \vdash \ \operatorname{BindValid}(x)\ \Downarrow \ \texttt{Valid} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{ReadVarIR}(x))\ \Downarrow \ \langle [\operatorname{Load}(\mathsf{slot},\ T_{x})],\ v\rangle 
\end{array}
$$

**(Lower-ReadVarIR-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{BindValid}(x)\ \Downarrow \ s\quad s\ \ne \ \texttt{Valid} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{ReadVarIR}(x))\ \Uparrow 
\end{array}
$$

$$
\operatorname{ProcSymbol}(\mathsf{sym})\ \Leftrightarrow \ \exists \ \mathsf{item}.\ \mathsf{item}\ \in \ \{\mathsf{ProcedureDecl},\ \mathsf{MethodDecl},\ \mathsf{ClassMethodDecl},\ \mathsf{StateMethodDecl},\ \mathsf{TransitionDecl},\ \mathsf{DefaultImpl}\}\ \land \ \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym}
$$

**(Lower-ReadPathIR-Static-User)**

$$
\begin{array}{l}
\operatorname{StaticSymPath}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{sym}\quad \operatorname{ProcModule}(\mathsf{sym})\ =\ m\quad T\ =\ \operatorname{StaticType}(\mathsf{sym})\quad \Gamma \ \vdash \ \operatorname{StateRef}(\mathsf{sym})\ \Downarrow \ \mathsf{slot}\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{CheckPoison}(m))\ \Downarrow \ \langle I_{p},\ \bot \rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{ReadPathIR}(\mathsf{path},\ \mathsf{name}))\ \Downarrow \ \langle I_{p}\ \mathbin{++} \ [\operatorname{Load}(\mathsf{slot},\ T)],\ v\rangle 
\end{array}
$$

**(Lower-ReadPathIR-Static-Gen)**

$$
\begin{array}{l}
\operatorname{StaticSymPath}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{sym}\quad \operatorname{ProcModule}(\mathsf{sym})\ \mathsf{undefined}\quad T\ =\ \operatorname{StaticType}(\mathsf{sym})\quad \Gamma \ \vdash \ \operatorname{StateRef}(\mathsf{sym})\ \Downarrow \ \mathsf{slot} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{ReadPathIR}(\mathsf{path},\ \mathsf{name}))\ \Downarrow \ \langle [\operatorname{Load}(\mathsf{slot},\ T)],\ v\rangle 
\end{array}
$$

**(Lower-ReadPathIR-Proc-User)**

$$
\begin{array}{l}
\mathsf{sym}\ =\ \operatorname{PathSym}(\mathsf{path},\ \mathsf{name})\quad \operatorname{ProcSymbol}(\mathsf{sym})\quad \operatorname{ProcModule}(\mathsf{sym})\ =\ m\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{CheckPoison}(m))\ \Downarrow \ \langle I_{p},\ \bot \rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{ReadPathIR}(\mathsf{path},\ \mathsf{name}))\ \Downarrow \ \langle I_{p},\ \mathsf{sym}\rangle 
\end{array}
$$

**(Lower-ReadPathIR-Proc-Gen)**

$$
\begin{array}{l}
\mathsf{sym}\ =\ \operatorname{PathSym}(\mathsf{path},\ \mathsf{name})\quad \operatorname{ProcSymbol}(\mathsf{sym})\quad \operatorname{ProcModule}(\mathsf{sym})\ \mathsf{undefined} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{ReadPathIR}(\mathsf{path},\ \mathsf{name}))\ \Downarrow \ \langle \varepsilon ,\ \mathsf{sym}\rangle 
\end{array}
$$

**(Lower-ReadPathIR-Runtime)**

$$
\begin{array}{l}
\mathsf{sym}\ =\ \operatorname{PathSym}(\mathsf{path},\ \mathsf{name})\quad \operatorname{RuntimeSig}(\mathsf{sym})\ \mathsf{defined} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{ReadPathIR}(\mathsf{path},\ \mathsf{name}))\ \Downarrow \ \langle \varepsilon ,\ \mathsf{sym}\rangle 
\end{array}
$$

**(Lower-ReadPathIR-Record)**

$$
\begin{array}{l}
p\ =\ \mathsf{path}\ \mathbin{++} \ [\mathsf{name}]\quad \operatorname{RecordDecl}(p)\ =\ R\quad \operatorname{ModuleOfPath}(p)\ =\ m\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{CheckPoison}(m))\ \Downarrow \ \langle I_{p},\ \bot \rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{ReadPathIR}(\mathsf{path},\ \mathsf{name}))\ \Downarrow \ \langle I_{p},\ \operatorname{RecordCtor}(p)\rangle 
\end{array}
$$

**(Lower-StoreVarIR)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{BindSlot}(x)\ \Downarrow \ \mathsf{slot}\quad \operatorname{TypeOf}(x)\ =\ T_{x}\quad \Gamma \ \vdash \ \operatorname{DropOnAssign}(x,\ \mathsf{slot})\ \Downarrow \ \mathsf{IR}_{d} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{StoreVarIR}(x,\ v))\ \Downarrow \ \langle \mathsf{IR}_{d}\ \mathbin{++} \ [\operatorname{Store}(\mathsf{slot},\ v,\ T_{x})],\ \bot \rangle 
\end{array}
$$

**(Lower-StoreVarNoDropIR)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{BindSlot}(x)\ \Downarrow \ \mathsf{slot}\quad \operatorname{TypeOf}(x)\ =\ T_{x} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{StoreVarNoDropIR}(x,\ v))\ \Downarrow \ \langle [\operatorname{Store}(\mathsf{slot},\ v,\ T_{x})],\ \bot \rangle 
\end{array}
$$

**(Lower-MoveStateIR)**

$$
\begin{array}{l}
x\ =\ \operatorname{PlaceRoot}(p)\quad \Gamma \ \vdash \ \operatorname{UpdateValid}(x,\ \operatorname{MoveStateIR}(p))\ \Downarrow \ v' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{MoveStateIR}(p))\ \Downarrow \ \langle \varepsilon ,\ \bot \rangle 
\end{array}
$$

**(Lower-StoreGlobal)**

$$
\begin{array}{l}
T\ =\ \operatorname{StaticType}(\mathsf{sym})\quad \Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau \quad \Gamma \ \vdash \ \operatorname{StateRef}(\mathsf{sym})\ \Downarrow \ \mathsf{slot} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{StoreGlobal}(\mathsf{sym},\ v))\ \Downarrow \ \langle [\operatorname{Store}(\mathsf{slot},\ v,\ T)],\ \bot \rangle 
\end{array}
$$

**(Lower-ReadPlaceIR)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerReadPlace}(p)\ \Downarrow \ \langle \mathsf{IR}_{p},\ v\rangle \quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{IR}_{p})\ \Downarrow \ \mathsf{ll} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{ReadPlaceIR}(p))\ \Downarrow \ \mathsf{ll}
\end{array}
$$

**(Lower-WritePlaceIR)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerWritePlace}(p,\ v)\ \Downarrow \ \mathsf{IR}_{w}\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{IR}_{w})\ \Downarrow \ \mathsf{ll} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{WritePlaceIR}(p,\ v))\ \Downarrow \ \mathsf{ll}
\end{array}
$$

$$
\operatorname{PtrType}(v)\ =\ T\ \Leftrightarrow \ (\exists \ e,\ \mathsf{IR}.\ \Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle \ \land \ T\ =\ \operatorname{ExprType}(e))\ \lor \ (\exists \ p,\ \mathsf{IR}.\ \Gamma \ \vdash \ \operatorname{LowerReadPlace}(p)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle \ \land \ T\ =\ \operatorname{ExprType}(p))
$$

**(Lower-ReadPtrIR)**

$$
\begin{array}{l}
\operatorname{PtrType}(v_{\mathsf{ptr}})\ =\ \operatorname{TypePtr}(T,\ \texttt{Valid}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{ReadPtrIR}(v_{\mathsf{ptr}}))\ \Downarrow \ \langle [\operatorname{Load}(\operatorname{PtrAddr}(v_{\mathsf{ptr}}),\ T)],\ v\rangle 
\end{array}
$$

**(Lower-ReadPtrIR-Raw)**

$$
\begin{array}{l}
\operatorname{PtrType}(v_{\mathsf{ptr}})\ =\ \operatorname{TypeRawPtr}(q,\ T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{ReadPtrIR}(v_{\mathsf{ptr}}))\ \Downarrow \ \langle [\operatorname{Load}(\operatorname{PtrAddr}(v_{\mathsf{ptr}}),\ T)],\ v\rangle 
\end{array}
$$

**(Lower-ReadPtrIR-Null)**

$$
\begin{array}{l}
\operatorname{PtrType}(v_{\mathsf{ptr}})\ =\ \operatorname{TypePtr}(T,\ \texttt{Null})\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{LowerPanic}(\mathsf{NullDeref}))\ \Downarrow \ \mathsf{ll} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{ReadPtrIR}(v_{\mathsf{ptr}}))\ \Downarrow \ \mathsf{ll}
\end{array}
$$

**(Lower-ReadPtrIR-Expired)**

$$
\begin{array}{l}
\operatorname{PtrType}(v_{\mathsf{ptr}})\ =\ \operatorname{TypePtr}(T,\ \texttt{Expired})\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{LowerPanic}(\mathsf{ExpiredDeref}))\ \Downarrow \ \mathsf{ll} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{ReadPtrIR}(v_{\mathsf{ptr}}))\ \Downarrow \ \mathsf{ll}
\end{array}
$$

**(Lower-WritePtrIR)**

$$
\begin{array}{l}
\operatorname{PtrType}(v_{\mathsf{ptr}})\ =\ \operatorname{TypePtr}(T,\ \texttt{Valid}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{WritePtrIR}(v_{\mathsf{ptr}},\ v))\ \Downarrow \ \langle [\operatorname{Store}(\operatorname{PtrAddr}(v_{\mathsf{ptr}}),\ v,\ T)],\ \bot \rangle 
\end{array}
$$

**(Lower-WritePtrIR-Null)**

$$
\begin{array}{l}
\operatorname{PtrType}(v_{\mathsf{ptr}})\ =\ \operatorname{TypePtr}(T,\ \texttt{Null})\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{LowerPanic}(\mathsf{NullDeref}))\ \Downarrow \ \mathsf{ll} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{WritePtrIR}(v_{\mathsf{ptr}},\ v))\ \Downarrow \ \mathsf{ll}
\end{array}
$$

**(Lower-WritePtrIR-Expired)**

$$
\begin{array}{l}
\operatorname{PtrType}(v_{\mathsf{ptr}})\ =\ \operatorname{TypePtr}(T,\ \texttt{Expired})\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{LowerPanic}(\mathsf{ExpiredDeref}))\ \Downarrow \ \mathsf{ll} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{WritePtrIR}(v_{\mathsf{ptr}},\ v))\ \Downarrow \ \mathsf{ll}
\end{array}
$$

**(Lower-WritePtrIR-Raw)**

$$
\begin{array}{l}
\operatorname{PtrType}(v_{\mathsf{ptr}})\ =\ \operatorname{TypeRawPtr}(\texttt{mut},\ T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{WritePtrIR}(v_{\mathsf{ptr}},\ v))\ \Downarrow \ \langle [\operatorname{Store}(\operatorname{PtrAddr}(v_{\mathsf{ptr}}),\ v,\ T)],\ \bot \rangle 
\end{array}
$$

**(Lower-WritePtrIR-Raw-Err)**

$$
\begin{array}{l}
\operatorname{PtrType}(v_{\mathsf{ptr}})\ =\ \operatorname{TypeRawPtr}(\texttt{imm},\ T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{WritePtrIR}(v_{\mathsf{ptr}},\ v))\ \Uparrow 
\end{array}
$$

**(Lower-AddrOfIR)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerAddrOf}(p)\ \Downarrow \ \langle \mathsf{IR}_{p},\ \mathsf{addr}\rangle \quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{IR}_{p})\ \Downarrow \ \mathsf{ll} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{AddrOfIR}(p))\ \Downarrow \ \mathsf{ll}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{CallPoison}(f)\ = \\[0.16em]
\ \operatorname{CheckPoison}(m)\quad \mathsf{if}\ \operatorname{ProcModule}(f)\ =\ m \\[0.16em]
\ \varepsilon \quad \mathsf{if}\ \operatorname{ProcModule}(f)\ \mathsf{undefined}
\end{array}
$$

$$
\operatorname{SRetAlloc}(R)\ \Downarrow \ \langle [\texttt{alloca}\ \operatorname{LLVMTy}(R)],\ p\rangle 
$$

$$
\begin{array}{l}
\operatorname{CallArgs}(\mathsf{sig},\ \mathsf{params},\ \mathsf{args},\ R)\ \Downarrow \ \langle I_{a},\ \mathsf{vec}_{a},\ p_{\mathsf{ret}}\rangle \ \Leftrightarrow  \\[0.16em]
\ I_{a}\ =\ \varepsilon \ \land \ \mathsf{vec}_{a}\ =\ \mathsf{args}\ \land \ p_{\mathsf{ret}}\ =\ \bot \quad \mathsf{if}\ \mathsf{sig}.\mathsf{sretSigma}\ =\ \mathsf{false} \\[0.16em]
\ \exists \ p.\ \operatorname{SRetAlloc}(R)\ \Downarrow \ \langle I_{s},\ p\rangle \ \land \ I_{a}\ =\ I_{s}\ \land \ \mathsf{vec}_{a}\ =\ [p]\ \mathbin{++} \ \mathsf{args}\ \land \ p_{\mathsf{ret}}\ =\ p\quad \mathsf{if}\ \mathsf{sig}.\mathsf{sretSigma}\ =\ \mathsf{true}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{CallInstr}(\mathsf{sig},\ f,\ \mathsf{vec}_{a})\ \Downarrow \ \langle [\texttt{call}\ \mathsf{sig}\ \operatorname{f}(\mathsf{vec}_{a})],\ v_{c}\rangle \ \Leftrightarrow  \\[0.16em]
\ v_{c}\ =\ (\mathsf{sig}.\mathsf{llvm}_{\mathsf{ret}}\ =\ \texttt{void}\ \mathsf{Sigma}\ \bot \ :\ \mathsf{call}_{\mathsf{result}})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{CallResult}(\mathsf{sig},\ R,\ p_{\mathsf{ret}},\ v_{c})\ \Downarrow \ \langle I_{r},\ v\rangle \ \Leftrightarrow  \\[0.16em]
\ I_{r}\ =\ \varepsilon \ \land \ v\ =\ v_{c}\quad \mathsf{if}\ \mathsf{sig}.\mathsf{sretSigma}\ =\ \mathsf{false} \\[0.16em]
\ \operatorname{LoadVal}(p_{\mathsf{ret}},\ R)\ \Downarrow \ \langle I_{r},\ v\rangle \quad \mathsf{if}\ \mathsf{sig}.\mathsf{sretSigma}\ =\ \mathsf{true}
\end{array}
$$

**(Lower-CallIR-Func)**

$$
\begin{array}{l}
\operatorname{CallTarget}(\mathsf{callee})\ =\ f\quad f\ \ne \ \operatorname{RecordCtor}(\_)\quad \operatorname{LoweredSigOf}(f)\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \quad \operatorname{LLVMCallSig}(\mathsf{params},\ \mathsf{ret})\ \Downarrow \ \mathsf{sig}\quad \operatorname{CallPoison}(f)\ =\ \mathsf{IR}_{p}\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{IR}_{p})\ \Downarrow \ \langle I_{p},\ \bot \rangle \quad \operatorname{CallArgs}(\mathsf{sig},\ \mathsf{params},\ \mathsf{args},\ \mathsf{ret})\ \Downarrow \ \langle I_{a},\ \mathsf{vec}_{a},\ p_{\mathsf{ret}}\rangle \quad \operatorname{CallInstr}(\mathsf{sig},\ f,\ \mathsf{vec}_{a})\ \Downarrow \ \langle I_{c},\ v_{c}\rangle \quad \operatorname{CallResult}(\mathsf{sig},\ \mathsf{ret},\ p_{\mathsf{ret}},\ v_{c})\ \Downarrow \ \langle I_{r},\ v_{\mathsf{call}}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{CallIR}(\mathsf{callee},\ \mathsf{args}))\ \Downarrow \ \langle I_{p}\ \mathbin{++} \ I_{a}\ \mathbin{++} \ I_{c}\ \mathbin{++} \ I_{r},\ v_{\mathsf{call}}\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{DynType}(v)\ =\ \operatorname{TypeDynamic}(\mathsf{Cl})\ \Leftrightarrow \ (\exists \ e,\ \mathsf{IR}.\ \Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle \ \land \ \operatorname{ExprType}(e)\ =\ \operatorname{TypeDynamic}(\mathsf{Cl}))\ \lor \ (\exists \ p,\ \mathsf{IR}.\ \Gamma \ \vdash \ \operatorname{LowerReadPlace}(p)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle \ \land \ \operatorname{ExprType}(p)\ =\ \operatorname{TypeDynamic}(\mathsf{Cl})) \\[0.16em]
\operatorname{DynData}(v)\ =\ \operatorname{FieldValue}(v,\ \texttt{data})\ \mathsf{and}\ \operatorname{DynVTable}(v)\ =\ \operatorname{FieldValue}(v,\ \texttt{vtable}) \\[0.16em]
\operatorname{VTableSlotIndex}(i)\ =\ i\ +\ 3 \\[0.16em]
\operatorname{GEP}(\mathsf{ptr},\ [i_{0},\ \ldots ,\ i_{k}])\ =\ v_{\mathsf{gep}} \\[0.16em]
\operatorname{VTableSlotAddr}(\mathsf{vt},\ i)\ =\ \operatorname{GEP}(\mathsf{vt},\ [0,\ \operatorname{VTableSlotIndex}(i)]) \\[0.16em]
\operatorname{VTableSlot}(\mathsf{vt},\ i)\ =\ \operatorname{Load}(\operatorname{VTableSlotAddr}(\mathsf{vt},\ i),\ \operatorname{TypeRawPtr}(\texttt{imm},\ \operatorname{TypePrim}(\texttt{"()"})))
\end{array}
$$

**(Lower-CallVTable)**

$$
\begin{array}{l}
\operatorname{DynType}(\mathsf{base})\ =\ \operatorname{TypeDynamic}(\mathsf{Cl})\quad v_{d}\ =\ \operatorname{DynData}(\mathsf{base})\quad v_{t}\ =\ \operatorname{DynVTable}(\mathsf{base})\quad v_{s}\ =\ \operatorname{VTableSlot}(v_{t},\ i)\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{CallIR}(v_{s},\ [v_{d}]\ \mathbin{++} \ \mathsf{args}))\ \Downarrow \ \mathsf{ll} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{CallVTable}(\mathsf{base},\ i,\ \mathsf{args}))\ \Downarrow \ \mathsf{ll}
\end{array}
$$

**(LowerIRInstr-ClearPanic)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \mathsf{ClearPanic}\ \Downarrow \ \mathsf{IR}\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{IR})\ \Downarrow \ \mathsf{ll} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{ClearPanic})\ \Downarrow \ \mathsf{ll}
\end{array}
$$

**(LowerIRInstr-PanicCheck)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \mathsf{PanicCheck}\ \Downarrow \ \mathsf{IR}\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{IR})\ \Downarrow \ \mathsf{ll} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{PanicCheck})\ \Downarrow \ \mathsf{ll}
\end{array}
$$

**(LowerIRInstr-CheckPoison)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CheckPoison}(m)\ \Downarrow \ \mathsf{IR}\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{IR})\ \Downarrow \ \mathsf{ll} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{CheckPoison}(m))\ \Downarrow \ \mathsf{ll}
\end{array}
$$

**(LowerIRInstr-LowerPanic)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerPanic}(r)\ \Downarrow \ \mathsf{IR}\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{IR})\ \Downarrow \ \mathsf{ll} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{LowerPanic}(r))\ \Downarrow \ \mathsf{ll}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{IfPhi}(v_{t},\ v_{f},\ l_{t},\ l_{f})\ \Downarrow \ \langle I_{\mathsf{phi}},\ v_{\mathsf{phi}}\rangle \ \Leftrightarrow  \\[0.16em]
\ I_{\mathsf{phi}}\ =\ \varepsilon \ \land \ v_{\mathsf{phi}}\ =\ \bot \quad \mathsf{if}\ v_{t}\ =\ \bot \ \lor \ v_{f}\ =\ \bot  \\[0.16em]
\ \exists \ T,\ \tau ,\ \mathsf{inc}.\ \operatorname{ValueType}(v_{t})\ =\ T\ \land \ \operatorname{ValueType}(v_{f})\ =\ T\ \land \ \Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau \ \land \ \mathsf{inc}\ =\ [\langle v_{t},\ l_{t}\rangle ,\ \langle v_{f},\ l_{f}\rangle ]\ \land \ I_{\mathsf{phi}}\ =\ [\operatorname{Phi}(\tau ,\ \mathsf{inc},\ v_{\mathsf{phi}})]\quad \mathsf{if}\ v_{t}\ \ne \ \bot \ \land \ v_{f}\ \ne \ \bot 
\end{array}
$$

$$
\operatorname{IfLowerForm}(I,\ v_{c},\ v_{t},\ v_{f},\ v)\ \Leftrightarrow \ \operatorname{HasBrCond}(I,\ v_{c})\ \land \ ((v_{t}\ =\ \bot \ \lor \ v_{f}\ =\ \bot )\ \Rightarrow \ v\ =\ \bot )\ \land \ ((v_{t}\ \ne \ \bot \ \land \ v_{f}\ \ne \ \bot )\ \Rightarrow \ \operatorname{HasPhi}(I,\ v))
$$

**(Lower-IfIR)**

$$
\begin{array}{l}
\operatorname{IfLabels}(\Gamma )\ =\ \langle l_{t},\ l_{f},\ l_{m}\rangle \quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{IR}_{t})\ \Downarrow \ \langle I_{t},\ v_{t}'\rangle \quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{IR}_{f})\ \Downarrow \ \langle I_{f},\ v_{f}'\rangle \quad v_{t}'\ =\ v_{t}\quad v_{f}'\ =\ v_{f}\quad \operatorname{IfPhi}(v_{t},\ v_{f},\ l_{t},\ l_{f})\ \Downarrow \ \langle I_{\mathsf{phi}},\ v\rangle \quad I\ =\ [\operatorname{BrCond}(v_{c},\ l_{t},\ l_{f}),\ \operatorname{Label}(l_{t})]\ \mathbin{++} \ I_{t}\ \mathbin{++} \ [\operatorname{Br}(l_{m}),\ \operatorname{Label}(l_{f})]\ \mathbin{++} \ I_{f}\ \mathbin{++} \ [\operatorname{Br}(l_{m}),\ \operatorname{Label}(l_{m})]\ \mathbin{++} \ I_{\mathsf{phi}}\quad \operatorname{IfLowerForm}(I,\ v_{c},\ v_{t},\ v_{f},\ v) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{IfIR}(v_{c},\ \mathsf{IR}_{t},\ v_{t},\ \mathsf{IR}_{f},\ v_{f}))\ \Downarrow \ \langle I,\ v\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BlockScope}(\mathsf{IR}_{s},\ \mathsf{IR}_{t})\ =\ \mathsf{scope} \\[0.16em]
\operatorname{BlockScope}(\mathsf{IR}_{s},\ \mathsf{IR}_{t})\ =\ \mathsf{scope}\ \Leftrightarrow \ (\exists \ \sigma ,\ \sigma_{1} ,\ \sigma_{2} ,\ \mathsf{out},\ \mathsf{scope}_{0}.\ \operatorname{BlockEnter}(\sigma ,\ [])\ \Downarrow \ (\sigma_{1} ,\ \mathsf{scope}_{0})\ \land \ \operatorname{ExecBlockBodyIRSigma}(\mathsf{IR}_{s},\ \mathsf{IR}_{t},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ))\ \land \ (\forall \ \sigma ,\ \sigma_{1} ,\ \sigma_{2} ,\ \mathsf{out},\ \mathsf{scope}_{0}.\ \operatorname{BlockEnter}(\sigma ,\ [])\ \Downarrow \ (\sigma_{1} ,\ \mathsf{scope}_{0})\ \land \ \operatorname{ExecBlockBodyIRSigma}(\mathsf{IR}_{s},\ \mathsf{IR}_{t},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )\ \Rightarrow \ \operatorname{CurrentScope}(\sigma_{2} )\ =\ \mathsf{scope}) \\[0.16em]
\operatorname{EmitCleanupSpec}(\mathsf{cs},\ \mathsf{IR})\ \Leftrightarrow \ \forall \ \sigma ,\ \Gamma \ \vdash \ \operatorname{Cleanup}(\mathsf{cs},\ \sigma )\ \Downarrow \ (c,\ \sigma ')\ \Rightarrow \ (\operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\ \land \ ((c\ =\ \mathsf{panic})\ \Rightarrow \ \mathsf{out}\ =\ \operatorname{Ctrl}(\mathsf{Panic}))\ \land \ ((c\ =\ \mathsf{ok})\ \Rightarrow \ \mathsf{out}\ =\ \operatorname{Val}(()))) \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitCleanup}(\mathsf{cs})\ \Downarrow \ \mathsf{IR}\ \Leftrightarrow \ \operatorname{EmitCleanupSpec}(\mathsf{cs},\ \mathsf{IR})
\end{array}
$$

**(Lower-BlockIR)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{IR}_{s})\ \Downarrow \ \langle I_{s},\ \bot \rangle \quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{IR}_{t})\ \Downarrow \ \langle I_{t},\ v_{t}'\rangle \quad v_{t}'\ =\ v_{t}\quad \operatorname{BlockScope}(\mathsf{IR}_{s},\ \mathsf{IR}_{t})\ =\ \mathsf{scope}\quad \Gamma \ \vdash \ \operatorname{CleanupPlan}(\mathsf{scope})\ \Downarrow \ \mathsf{cs}\quad \Gamma \ \vdash \ \operatorname{EmitCleanup}(\mathsf{cs})\ \Downarrow \ \mathsf{IR}_{c}\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{IR}_{c})\ \Downarrow \ \langle I_{c},\ \bot \rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{BlockIR}(\mathsf{IR}_{s},\ \mathsf{IR}_{t},\ v_{t}))\ \Downarrow \ \langle I_{s}\ \mathbin{++} \ I_{t}\ \mathbin{++} \ I_{c},\ v_{t}\rangle 
\end{array}
$$

LoopLowerForm(I, loop, v) predicate
LoopIRForm(loop) predicate
IfCaseLowerForm(I, if_case, v) predicate
IfCaseIRForm(if_case) predicate
RegionLowerForm(I, region, v) predicate
RegionIRForm(region) predicate
FrameLowerForm(I, frame, v) predicate
FrameIRForm(frame) predicate

$$
\begin{array}{l}
\operatorname{LoopLowerForm}(I,\ \mathsf{loop},\ v)\ \Leftrightarrow \ \langle I,\ v\rangle \ \in \ \mathsf{LLResult} \\[0.16em]
\operatorname{IfCaseLowerForm}(I,\ \mathsf{if}_{\mathsf{case}},\ v)\ \Leftrightarrow \ \langle I,\ v\rangle \ \in \ \mathsf{LLResult} \\[0.16em]
\operatorname{RegionLowerForm}(I,\ \mathsf{region},\ v)\ \Leftrightarrow \ \langle I,\ v\rangle \ \in \ \mathsf{LLResult} \\[0.16em]
\operatorname{FrameLowerForm}(I,\ \mathsf{frame},\ v)\ \Leftrightarrow \ \langle I,\ v\rangle \ \in \ \mathsf{LLResult} \\[0.16em]
\operatorname{LoopIRForm}(\mathsf{loop})\ \Leftrightarrow \ (\exists \ \mathsf{IR}_{b},\ v_{b}.\ \mathsf{loop}\ =\ \operatorname{LoopIR}(\mathsf{LoopInfinite},\ \mathsf{IR}_{b},\ v_{b}))\ \lor \ (\exists \ \mathsf{IR}_{c},\ v_{c},\ \mathsf{IR}_{b},\ v_{b}.\ \mathsf{loop}\ =\ \operatorname{LoopIR}(\mathsf{LoopConditional},\ \mathsf{IR}_{c},\ v_{c},\ \mathsf{IR}_{b},\ v_{b}))\ \lor \ (\exists \ \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{IR}_{i},\ v_{\mathsf{iter}},\ \mathsf{IR}_{b},\ v_{b}.\ \mathsf{loop}\ =\ \operatorname{LoopIR}(\mathsf{LoopIter},\ \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{IR}_{i},\ v_{\mathsf{iter}},\ \mathsf{IR}_{b},\ v_{b})) \\[0.16em]
\operatorname{IfCaseIRForm}(\mathsf{if}_{\mathsf{case}})\ \Leftrightarrow \ \exists \ v_{s},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}}.\ \mathsf{if}_{\mathsf{case}}\ =\ \operatorname{IfCaseIR}(v_{s},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}}) \\[0.16em]
\operatorname{RegionIRForm}(\mathsf{region})\ \Leftrightarrow \ \exists \ v_{o},\ \mathsf{alias}_{\mathsf{opt}},\ \mathsf{IR}_{b},\ v_{b}.\ \mathsf{region}\ =\ \operatorname{RegionIR}(v_{o},\ \mathsf{alias}_{\mathsf{opt}},\ \mathsf{IR}_{b},\ v_{b}) \\[0.16em]
\operatorname{FrameIRForm}(\mathsf{frame})\ \Leftrightarrow \ \exists \ v_{r},\ \mathsf{IR}_{b},\ v_{b}.\ \mathsf{frame}\ =\ \operatorname{FrameIR}(v_{r},\ \mathsf{IR}_{b},\ v_{b})
\end{array}
$$

**(Lower-LoopIR)**
LoopIRForm(loop)    LoopLowerForm(I, loop, v)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{loop})\ \Downarrow \ \langle I,\ v\rangle 
\end{array}
$$

**(Lower-IfCaseIR)**
IfCaseIRForm(if_case)    IfCaseLowerForm(I, if_case, v)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{if}_{\mathsf{case}})\ \Downarrow \ \langle I,\ v\rangle 
\end{array}
$$

**(Lower-RegionIR)**
RegionIRForm(region)    RegionLowerForm(I, region, v)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{region})\ \Downarrow \ \langle I,\ v\rangle 
\end{array}
$$

**(Lower-FrameIR)**
FrameIRForm(frame)    FrameLowerForm(I, frame, v)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{frame})\ \Downarrow \ \langle I,\ v\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BranchLowerForm}(I,\ \mathsf{target})\ \Leftrightarrow \ \operatorname{Br}(\mathsf{target})\ \in \ I \\[0.16em]
\operatorname{BranchLowerForm}(I,\ v_{c},\ t,\ f)\ \Leftrightarrow \ \operatorname{BrCond}(v_{c},\ t,\ f)\ \in \ I
\end{array}
$$

**(Lower-BranchIR)**
BranchLowerForm(I, target)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{BranchIR}(\mathsf{target}))\ \Downarrow \ \langle I,\ \bot \rangle 
\end{array}
$$
BranchLowerForm(I, v_c, t, f)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{BranchIR}(v_{c},\ t,\ f))\ \Downarrow \ \langle I,\ \bot \rangle 
\end{array}
$$

$$
\operatorname{PhiLowerForm}(I,\ T,\ \mathsf{inc},\ v)\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau \ \land \ I\ =\ [\operatorname{Phi}(\tau ,\ \mathsf{inc},\ v)]
$$

**(Lower-PhiIR)**
PhiLowerForm(I, T, inc, v)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{PhiIR}(T,\ \mathsf{inc},\ v))\ \Downarrow \ \langle I,\ v\rangle 
\end{array}
$$

**(LowerIRDecl-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerIRDecl}(d)\ \Uparrow  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRDecl}(d)\ \Uparrow 
\end{array}
$$

**(LowerIRInstr-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{op})\ \Uparrow  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{op})\ \Uparrow 
\end{array}
$$

### 24.7.9 Binding Storage and Validity

$$
\begin{array}{l}
\mathsf{BindStorageJudg}\ =\ \{\operatorname{BindSlot}(x)\ \Downarrow \ \mathsf{slot},\ \operatorname{BindValid}(x)\ \Downarrow \ v,\ \operatorname{UpdateValid}(x,\ \mathsf{op})\ \Downarrow \ v',\ \operatorname{DropOnAssign}(x,\ \mathsf{slot})\ \Downarrow \ \mathsf{IR}\} \\[0.16em]
\operatorname{TypeOf}(x)\ =\ T\ \Leftrightarrow \ \Gamma ;\ R;\ L\ \vdash \ \operatorname{Identifier}(x)\ :\ T \\[0.16em]
\operatorname{BindInfo}(x)\ =\ \mathsf{info}\ \Leftrightarrow \ \operatorname{BindState}(\Gamma )\ =\ \mathfrak{B} \ \land \ \operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \mathsf{info}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ProcParams}(\Gamma )\ =\ \mathsf{params}\ \Leftrightarrow \ \Gamma \ \mathsf{is}\ \mathsf{lowering}\ \operatorname{ProcIR}(\_,\ \mathsf{params},\ \_,\ \_) \\[0.16em]
\operatorname{ProcRet}(\Gamma )\ =\ R\ \Leftrightarrow \ \Gamma \ \mathsf{is}\ \mathsf{lowering}\ \operatorname{ProcIR}(\_,\ \_,\ R,\ \_) \\[0.16em]
\operatorname{ProcSig}(\Gamma )\ =\ \mathsf{sig}\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{LLVMCallSig}(\operatorname{ProcParams}(\Gamma ),\ \operatorname{ProcRet}(\Gamma ))\ \Downarrow \ \mathsf{sig} \\[0.16em]
\operatorname{ParamEntry}(\mathsf{params},\ x)\ =\ \langle \mathsf{mode},\ T\rangle \ \Leftrightarrow \ \langle \mathsf{mode},\ x,\ T\rangle \ \in \ \mathsf{params} \\[0.16em]
\operatorname{AllocaSlot}(T)\ =\ \operatorname{LLVMAlloca}(\operatorname{LLVMTy}(T)) \\[0.16em]
\operatorname{RegionSlot}(r,\ T)\ =\ \operatorname{CallIR}(\operatorname{BuiltinModalSym}(\texttt{Region::alloc}),\ [r,\ \operatorname{IntVal}(\texttt{usize},\ \operatorname{sizeof}(T)),\ \operatorname{IntVal}(\texttt{usize},\ \operatorname{alignof}(T))]) \\[0.16em]
\operatorname{BindState}(\Gamma )\ =\ \Gamma .\mathsf{bind}_{\mathsf{state}}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{ResolveEntry}\_\pi ([],\ \mathsf{tag})\ =\ \bot  \\[0.16em]
\mathsf{ResolveEntry}\_\pi (\langle \mathsf{tag},\ \mathsf{target}\rangle \ \mathbin{::} \ \mathsf{es},\ t)\ = \\[0.16em]
\ \langle \mathsf{tag},\ \mathsf{target}\rangle \quad \mathsf{if}\ t\ =\ \mathsf{tag} \\[0.16em]
\ \mathsf{ResolveEntry}\_\pi (\mathsf{es},\ t)\quad \mathsf{otherwise} \\[0.16em]
\mathsf{ResolveTarget}\_\pi (\langle \Sigma \_\pi ,\ \mathsf{RS}\rangle ,\ \mathsf{tag})\ =\ \mathsf{target}\ \Leftrightarrow \ \mathsf{ResolveEntry}\_\pi (\mathsf{RS},\ \mathsf{tag})\ =\ \langle \mathsf{tag},\ \mathsf{target}\rangle  \\[0.16em]
\mathsf{BindProv}\_\Gamma (x)\ =\ \pi \ \Leftrightarrow \ \Gamma \ \mathsf{has}\ \mathsf{provenance}\ \mathsf{environment}\ \Omega \ \land \ \Gamma ;\ \Omega \ \vdash \ \operatorname{Identifier}(x)\ \Downarrow \ \pi  \\[0.16em]
\operatorname{BindRegionTarget}(x)\ =\ r\ \Leftrightarrow \ \mathsf{BindProv}\_\Gamma (x)\ =\ \pi_{\mathsf{Region}} (\mathsf{tag})\ \land \ \mathsf{ResolveTarget}\_\pi (\Omega ,\ \mathsf{tag})\ =\ r
\end{array}
$$

`ResolveTarget_π(Ω, tag)` returns the nearest live target alias recorded for `tag`. For unique region handles, rebinding updates the region-target relation by introducing the new binding name as the nearest alias for that tag.

**(BindValid-Sigma)**

$$
\begin{array}{l}
\operatorname{BindState}(\Gamma )\ =\ \mathfrak{B} \quad \operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle s,\ \_,\ \_,\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BindValid}(x)\ \Downarrow \ s
\end{array}
$$

**(BindSlot-Param-ByValue)**

$$
\begin{array}{l}
\operatorname{ProcParams}(\Gamma )\ =\ \mathsf{params}\quad \operatorname{ParamEntry}(\mathsf{params},\ x)\ =\ \langle \mathsf{mode},\ T\rangle \quad \Gamma \ \vdash \ \operatorname{ABIParam}(\mathsf{mode},\ T)\ \Downarrow \ \texttt{ByValue} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BindSlot}(x)\ \Downarrow \ \operatorname{AllocaSlot}(T)
\end{array}
$$

**(BindSlot-Param-ByRef)**

$$
\begin{array}{l}
\operatorname{ProcParams}(\Gamma )\ =\ \mathsf{params}\quad \operatorname{ParamEntry}(\mathsf{params},\ x)\ =\ \langle \mathsf{mode},\ T\rangle \quad \Gamma \ \vdash \ \operatorname{ABIParam}(\mathsf{mode},\ T)\ \Downarrow \ \texttt{ByRef}\quad \operatorname{ProcSig}(\Gamma )\ =\ \mathsf{sig} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BindSlot}(x)\ \Downarrow \ \operatorname{LLVMParam}(\mathsf{sig},\ \mathsf{params},\ x)
\end{array}
$$

**(BindSlot-Region)**

$$
\begin{array}{l}
\operatorname{BindRegionTarget}(x)\ =\ r \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BindSlot}(x)\ \Downarrow \ \operatorname{RegionSlot}(r,\ \operatorname{TypeOf}(x))
\end{array}
$$

**(BindSlot-Local)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveValueName}(x)\ \Downarrow \ \mathsf{ent}\quad \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ \bot \quad \operatorname{ParamEntry}(\operatorname{ProcParams}(\Gamma ),\ x)\ \mathsf{undefined} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BindSlot}(x)\ \Downarrow \ \operatorname{AllocaSlot}(\operatorname{TypeOf}(x))
\end{array}
$$

**(BindSlot-Static)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveValueName}(x)\ \Downarrow \ \mathsf{ent}\quad \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ \mathsf{mp}\quad \mathsf{name}\ =\ (\mathsf{ent}.\mathsf{target}_{\mathsf{opt}}\ \mathsf{if}\ \mathsf{present},\ \mathsf{else}\ x)\quad \operatorname{PathOfModule}(\mathsf{mp})\ =\ \mathsf{path}\quad \operatorname{StaticSymPath}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{sym}\quad \Gamma \ \vdash \ \operatorname{StateRef}(\mathsf{sym})\ \Downarrow \ \mathsf{slot} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BindSlot}(x)\ \Downarrow \ \mathsf{slot}
\end{array}
$$

**(UpdateValid-BindVar)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{UpdateValid}(x,\ \operatorname{BindVarIR}(x,\ v))\ \Downarrow \ \texttt{Valid}
\end{array}
$$

**(UpdateValid-StoreVar)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{UpdateValid}(x,\ \operatorname{StoreVarIR}(x,\ v))\ \Downarrow \ \texttt{Valid}
\end{array}
$$

**(UpdateValid-StoreVarNoDrop)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{BindValid}(x)\ \Downarrow \ s \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{UpdateValid}(x,\ \operatorname{StoreVarNoDropIR}(x,\ v))\ \Downarrow \ s
\end{array}
$$

**(UpdateValid-MoveRoot)**

$$
\begin{array}{l}
\mathsf{op}\ =\ \operatorname{MoveStateIR}(p)\quad \operatorname{PlaceRoot}(p)\ =\ x\quad \operatorname{FieldHead}(p)\ =\ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{UpdateValid}(x,\ \mathsf{op})\ \Downarrow \ \mathsf{Moved}
\end{array}
$$

**(UpdateValid-PartialMove-Init)**

$$
\begin{array}{l}
\mathsf{op}\ =\ \operatorname{MoveStateIR}(p)\quad \operatorname{PlaceRoot}(p)\ =\ x\quad \operatorname{FieldHead}(p)\ =\ f\quad \operatorname{BindValid}(x)\ \Downarrow \ \texttt{Valid} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{UpdateValid}(x,\ \mathsf{op})\ \Downarrow \ \operatorname{PartiallyMoved}(\{f\})
\end{array}
$$

**(UpdateValid-PartialMove-Step)**

$$
\begin{array}{l}
\mathsf{op}\ =\ \operatorname{MoveStateIR}(p)\quad \operatorname{PlaceRoot}(p)\ =\ x\quad \operatorname{FieldHead}(p)\ =\ f\quad \operatorname{BindValid}(x)\ \Downarrow \ \operatorname{PartiallyMoved}(F) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{UpdateValid}(x,\ \mathsf{op})\ \Downarrow \ \operatorname{PartiallyMoved}(F\ \cup \ \{f\})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{DropOnAssignApplicable}(x)\ \Leftrightarrow \ \operatorname{BindInfo}(x).\mathsf{mov}\ =\ \mathsf{immov}\ \land \ \operatorname{BindInfo}(x).\mathsf{resp}\ =\ \mathsf{resp} \\[0.16em]
\operatorname{FieldsRev}(R)\ =\ \operatorname{rev}(\operatorname{Fields}(R)) \\[0.16em]
\operatorname{FieldDropIR}(\mathsf{slot},\ p,\ f,\ T)\ =\ \operatorname{EmitDrop}(T,\ \operatorname{Load}(\operatorname{FieldAddr}(\operatorname{TypePath}(p),\ \mathsf{slot},\ f),\ T)) \\[0.16em]
\operatorname{FieldDropSeq}(\mathsf{slot},\ p,\ F)\ =\ \mathbin{++} \_\{\langle f_{i},\ T_{i}\rangle \ \in \ \operatorname{FieldsRev}(\operatorname{RecordDecl}(p)),\ f_{i}\ \notin \ F\}\ \operatorname{FieldDropIR}(\mathsf{slot},\ p,\ f_{i},\ T_{i})
\end{array}
$$

**(DropOnAssign-NotApplicable)**

$$
\begin{array}{l}
\lnot \ \operatorname{DropOnAssignApplicable}(x) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DropOnAssign}(x,\ \mathsf{slot})\ \Downarrow \ \varepsilon 
\end{array}
$$

**(DropOnAssign-Record-Valid)**

$$
\begin{array}{l}
\operatorname{DropOnAssignApplicable}(x)\quad \operatorname{TypeOf}(x)\ =\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \operatorname{BindValid}(x)\ \Downarrow \ \texttt{Valid} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DropOnAssign}(x,\ \mathsf{slot})\ \Downarrow \ \operatorname{EmitDrop}(\operatorname{TypePath}(p),\ \operatorname{Load}(\mathsf{slot},\ \operatorname{TypePath}(p)))
\end{array}
$$

**(DropOnAssign-Record-Partial)**

$$
\begin{array}{l}
\operatorname{DropOnAssignApplicable}(x)\quad \operatorname{TypeOf}(x)\ =\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \operatorname{BindValid}(x)\ \Downarrow \ \operatorname{PartiallyMoved}(F) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DropOnAssign}(x,\ \mathsf{slot})\ \Downarrow \ \operatorname{FieldDropSeq}(\mathsf{slot},\ p,\ F)
\end{array}
$$

**(DropOnAssign-Record-Moved)**

$$
\begin{array}{l}
\operatorname{DropOnAssignApplicable}(x)\quad \operatorname{TypeOf}(x)\ =\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \operatorname{BindValid}(x)\ \Downarrow \ \mathsf{Moved} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DropOnAssign}(x,\ \mathsf{slot})\ \Downarrow \ \varepsilon 
\end{array}
$$

**(DropOnAssign-Aggregate-Ok)**

$$
\begin{array}{l}
\operatorname{DropOnAssignApplicable}(x)\quad \operatorname{TypeOf}(x)\ \in \ \{\operatorname{TypeArray}(\_,\ \_),\ \operatorname{TypeTuple}(\_),\ \operatorname{TypeUnion}(\_),\ \operatorname{TypeModalState}(\_,\ \_)\}\quad \operatorname{BindValid}(x)\ \Downarrow \ s\quad s\ \ne \ \mathsf{Moved} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DropOnAssign}(x,\ \mathsf{slot})\ \Downarrow \ \operatorname{EmitDrop}(\operatorname{TypeOf}(x),\ \operatorname{Load}(\mathsf{slot},\ \operatorname{TypeOf}(x)))
\end{array}
$$

**(DropOnAssign-Aggregate-Moved)**

$$
\begin{array}{l}
\operatorname{DropOnAssignApplicable}(x)\quad \operatorname{TypeOf}(x)\ \in \ \{\operatorname{TypeArray}(\_,\ \_),\ \operatorname{TypeTuple}(\_),\ \operatorname{TypeUnion}(\_),\ \operatorname{TypeModalState}(\_,\ \_)\}\quad \operatorname{BindValid}(x)\ \Downarrow \ \mathsf{Moved} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DropOnAssign}(x,\ \mathsf{slot})\ \Downarrow \ \varepsilon 
\end{array}
$$

**(BindSlot-Err)**
BindSlot(x) undefined

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BindSlot}(x)\ \Uparrow 
\end{array}
$$

**(BindValid-Err)**
BindValid(x) undefined

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BindValid}(x)\ \Uparrow 
\end{array}
$$

**(UpdateValid-Err)**
UpdateValid(x, op) undefined

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{UpdateValid}(x,\ \mathsf{op})\ \Uparrow 
\end{array}
$$

**(DropOnAssign-Err)**
DropOnAssign(x, slot) undefined

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DropOnAssign}(x,\ \mathsf{slot})\ \Uparrow 
\end{array}
$$

### 24.7.10 Call ABI Mapping

$$
\mathsf{LLVMCallJudg}\ =\ \{\operatorname{LLVMCallSig}(\mathsf{params},\ \mathsf{ret})\ \Downarrow \ \mathsf{sig},\ \operatorname{LLVMArgLower}(x,\ T,\ k)\ \Downarrow \ \mathsf{ll},\ \operatorname{LLVMRetLower}(T,\ k)\ \Downarrow \ \mathsf{ll}\}
$$

$$
\begin{array}{l}
\operatorname{SigLLVMParams}(\mathsf{sig})\ =\ \mathsf{llvm}_{\mathsf{params}} \\[0.16em]
\operatorname{SigLLVMRet}(\mathsf{sig})\ =\ \mathsf{llvm}_{\mathsf{ret}} \\[0.16em]
\operatorname{SigLLVMAttrs}(\mathsf{sig})\ =\ \mathsf{attrs} \\[0.16em]
\operatorname{SigSRet}(\mathsf{sig})\ =\ \mathsf{sretSigma}
\end{array}
$$

**(LLVMArgLower-ByValue-PtrValid)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau \quad \operatorname{StripPerm}(T)\ =\ \operatorname{TypePtr}(U,\ \texttt{Valid}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMArgLower}(x,\ T,\ \texttt{ByValue})\ \Downarrow \ \langle \tau ,\ \operatorname{LLVMArgAttrsExt}(x,\ T)\ \cup \ \operatorname{LLVMPtrAttrs}(T)\rangle 
\end{array}
$$

**(LLVMArgLower-ByValue-Other)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau \quad \operatorname{StripPerm}(T)\ \ne \ \operatorname{TypePtr}(\_,\ \texttt{Valid}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMArgLower}(x,\ T,\ \texttt{ByValue})\ \Downarrow \ \langle \tau ,\ \operatorname{LLVMArgAttrsExt}(x,\ T)\rangle 
\end{array}
$$

**(LLVMArgLower-ByRef)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMArgLower}(x,\ T,\ \texttt{ByRef})\ \Downarrow \ \langle \operatorname{LLVMPtrTy}(\operatorname{TypePtr}(\operatorname{TypePerm}(\texttt{const},\ T),\ \texttt{Valid})),\ \operatorname{LLVMPtrAttrs}(\operatorname{TypePtr}(\operatorname{TypePerm}(\texttt{const},\ T),\ \texttt{Valid}))\ \cup \ \operatorname{LLVMArgAttrsExt}(x,\ T)\rangle 
\end{array}
$$

**(LLVMRetLower-ByValue-ZST)**

$$
\begin{array}{l}
\operatorname{sizeof}(T)\ =\ 0 \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMRetLower}(T,\ \texttt{ByValue})\ \Downarrow \ \texttt{void}
\end{array}
$$

**(LLVMRetLower-ByValue)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau \quad \operatorname{sizeof}(T)\ >\ 0 \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMRetLower}(T,\ \texttt{ByValue})\ \Downarrow \ \tau 
\end{array}
$$

**(LLVMRetLower-SRet)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMRetLower}(T,\ \texttt{SRet})\ \Downarrow \ \texttt{void}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ArgInclude}(k,\ T)\ \Leftrightarrow \ (k\ =\ \texttt{ByRef})\ \lor \ (k\ =\ \texttt{ByValue}\ \land \ \operatorname{sizeof}(T)\ >\ 0) \\[0.16em]
\operatorname{LLVMArgList}([\langle m_{1},\ x_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ x_{n},\ T_{n}\rangle ],\ [k_{1},\ \ldots ,\ k_{n}])\ =\ [\tau_{i} \ \mid \ \operatorname{ArgInclude}(k_{i},\ T_{i})\ \land \ \Gamma \ \vdash \ \operatorname{LLVMArgLower}(x_{i},\ T_{i},\ k_{i})\ \Downarrow \ \langle \tau_{i} ,\ A_{i}\rangle ] \\[0.16em]
\operatorname{LLVMAttrList}([\langle m_{1},\ x_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ x_{n},\ T_{n}\rangle ],\ [k_{1},\ \ldots ,\ k_{n}])\ =\ [A_{i}\ \mid \ \operatorname{ArgInclude}(k_{i},\ T_{i})\ \land \ \Gamma \ \vdash \ \operatorname{LLVMArgLower}(x_{i},\ T_{i},\ k_{i})\ \Downarrow \ \langle \tau_{i} ,\ A_{i}\rangle ]
\end{array}
$$

**(LLVMCall-ByValue)**

$$
\begin{array}{l}
\langle [k_{1},\ \ldots ,\ k_{n}],\ k_{r},\ \mathsf{sretSigma}\rangle \ =\ \operatorname{ABICall}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ],\ R)\quad k_{r}\ =\ \texttt{ByValue}\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{LLVMArgLower}(x_{i},\ T_{i},\ k_{i})\ \Downarrow \ \langle \tau_{i} ,\ A_{i}\rangle \quad \Gamma \ \vdash \ \operatorname{LLVMRetLower}(R,\ \texttt{ByValue})\ \Downarrow \ \tau_{r}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMCallSig}([\langle m_{1},\ x_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ x_{n},\ T_{n}\rangle ],\ R)\ \Downarrow \ \langle \operatorname{LLVMArgList}([\langle m_{1},\ x_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ x_{n},\ T_{n}\rangle ],\ [k_{1},\ \ldots ,\ k_{n}]),\ \tau_{r} ,\ \operatorname{LLVMAttrList}([\langle m_{1},\ x_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ x_{n},\ T_{n}\rangle ],\ [k_{1},\ \ldots ,\ k_{n}]),\ \mathsf{false}\rangle 
\end{array}
$$

**(LLVMCall-SRet)**

$$
\begin{array}{l}
\langle [k_{1},\ \ldots ,\ k_{n}],\ k_{r},\ \mathsf{sretSigma}\rangle \ =\ \operatorname{ABICall}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ],\ R)\quad k_{r}\ =\ \texttt{SRet}\quad \mathsf{sret}_{\mathsf{param}}\ =\ \operatorname{LLVMPtrTy}(\operatorname{TypePtr}(\operatorname{TypePerm}(\texttt{unique},\ R),\ \texttt{Valid}))\quad A_{\mathsf{sret}}\ =\ \{\texttt{sret},\ \texttt{noalias}\}\ \cup \ \operatorname{LLVMPtrAttrs}(\operatorname{TypePtr}(\operatorname{TypePerm}(\texttt{unique},\ R),\ \texttt{Valid}))\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{LLVMArgLower}(x_{i},\ T_{i},\ k_{i})\ \Downarrow \ \langle \tau_{i} ,\ A_{i}\rangle \quad \Gamma \ \vdash \ \operatorname{LLVMRetLower}(R,\ \texttt{SRet})\ \Downarrow \ \texttt{void} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMCallSig}([\langle m_{1},\ x_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ x_{n},\ T_{n}\rangle ],\ R)\ \Downarrow \ \langle [\mathsf{sret}_{\mathsf{param}}]\ \mathbin{++} \ \operatorname{LLVMArgList}([\langle m_{1},\ x_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ x_{n},\ T_{n}\rangle ],\ [k_{1},\ \ldots ,\ k_{n}]),\ \texttt{void},\ [A_{\mathsf{sret}}]\ \mathbin{++} \ \operatorname{LLVMAttrList}([\langle m_{1},\ x_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ x_{n},\ T_{n}\rangle ],\ [k_{1},\ \ldots ,\ k_{n}]),\ \mathsf{true}\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ByRefAccess}(T)\ = \\[0.16em]
\ \texttt{rw}\quad \mathsf{if}\ \operatorname{PermOf}(T)\ =\ \texttt{unique} \\[0.16em]
\ \texttt{ro}\quad \mathsf{otherwise}
\end{array}
$$

**(LLVMArgLower-Err)**
LLVMArgLower(x, T, k) undefined

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMArgLower}(x,\ T,\ k)\ \Uparrow 
\end{array}
$$

**(LLVMRetLower-Err)**
LLVMRetLower(T, k) undefined

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMRetLower}(T,\ k)\ \Uparrow 
\end{array}
$$

**(LLVMCall-Err)**
LLVMCallSig(params, ret) undefined

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LLVMCallSig}(\mathsf{params},\ \mathsf{ret})\ \Uparrow 
\end{array}
$$

### 24.7.11 VTable Emission

$$
\mathsf{VTableJudg}\ =\ \{\operatorname{EmitVTable}(T,\ \mathsf{Cl})\ \Downarrow \ \mathsf{IRDecl},\ \operatorname{EmitDropGlue}(T)\ \Downarrow \ \mathsf{IRDecl},\ \operatorname{DropGlueSym}(T)\ \Downarrow \ \mathsf{sym}\}
$$

$$
\begin{array}{l}
\operatorname{DropGlueSym}(T)\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"drop"}]\ \mathbin{++} \ \operatorname{PathOfType}(T)) \\[0.16em]
\operatorname{VTableHeader}(T)\ =\ [\operatorname{sizeof}(T),\ \operatorname{alignof}(T),\ \operatorname{DropGlueSym}(T)] \\[0.16em]
\mathsf{PtrTy}\ =\ \operatorname{LLVMPtrTy}(\operatorname{TypeRawPtr}(\texttt{imm},\ \operatorname{TypePrim}(\texttt{"()"}))) \\[0.16em]
k\ =\ \mid \operatorname{VTable}(T,\ \mathsf{Cl})\mid  \\[0.16em]
\operatorname{VTableTy}(\mathsf{Cl})\ =\ \operatorname{LLVMStruct}([\operatorname{LLVMTy}(\operatorname{TypePrim}(\texttt{"usize"})),\ \operatorname{LLVMTy}(\operatorname{TypePrim}(\texttt{"usize"})),\ \mathsf{PtrTy}]\ \mathbin{++} \ [\mathsf{PtrTy}]^k) \\[0.16em]
\mathsf{GlobalVTable}\ :\ \mathsf{Symbol}\ \times \ \mathsf{Header}\ \times \ \mathsf{Slots}\ \to \ \mathsf{IRDecl} \\[0.16em]
\mathsf{LLVMGlobalVTable}\ :\ \mathsf{Symbol}\ \times \ \mathsf{Header}\ \times \ \mathsf{Slots}\ \to \ \mathsf{LLVMDecl}
\end{array}
$$

$$
\operatorname{VTableSlots}(T,\ \mathsf{Cl})\ =\ [\operatorname{DispatchSym}(T,\ \mathsf{Cl},\ m.\mathsf{name})\ \mid \ m\ \in \ \operatorname{VTableEligible}(\mathsf{Cl})]
$$

$$
\begin{array}{l}
\operatorname{DropGlueSpec}(T,\ \mathsf{IR})\ \Leftrightarrow \ \forall \ \sigma ,\ \mathsf{addr},\ v.\ \operatorname{LookupVal}(\sigma ,\ \texttt{"data"})\ =\ \operatorname{RawPtr}(\texttt{imm},\ \mathsf{addr})\ \land \ \operatorname{ReadAddr}(\sigma ,\ \mathsf{addr})\ =\ v\ \Rightarrow \ (\operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\ \land \ \Gamma \ \vdash \ \operatorname{DropValue}(T,\ v,\ \emptyset )\ \Downarrow \ \sigma ') \\[0.16em]
\Gamma \ \vdash \ \operatorname{DropGlueIR}(T)\ \Downarrow \ \mathsf{IR}\ \Leftrightarrow \ \operatorname{DropGlueSpec}(T,\ \mathsf{IR})
\end{array}
$$

**(EmitDropGlue-Decl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{DropGlueSym}(T)\ \Downarrow \ \mathsf{sym}\quad \Gamma \ \vdash \ \operatorname{DropGlueIR}(T)\ \Downarrow \ \mathsf{IR}_{\mathsf{drop}} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitDropGlue}(T)\ \Downarrow \ \operatorname{ProcIR}(\mathsf{sym},\ [\langle \texttt{move},\ \texttt{data},\ \operatorname{TypeRawPtr}(\texttt{imm},\ \operatorname{TypePrim}(\texttt{"()"}))\rangle ,\ \mathsf{PanicOutParam}],\ \operatorname{TypePrim}(\texttt{"()"}),\ \mathsf{IR}_{\mathsf{drop}})
\end{array}
$$

**(EmitVTable-Err)**
EmitVTable(T, Cl) undefined

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitVTable}(T,\ \mathsf{Cl})\ \Uparrow 
\end{array}
$$

### 24.7.12 Literal Data Emission

$$
\mathsf{LiteralEmitJudg}\ =\ \{\operatorname{EmitLiteralData}(\mathsf{kind},\ \mathsf{bytes})\ \Downarrow \ \mathsf{IRDecl},\ \operatorname{EmitStringLit}(\mathsf{lit})\ \Downarrow \ \mathsf{sym},\ \operatorname{EmitBytesLit}(\mathsf{lit})\ \Downarrow \ \mathsf{sym}\}
$$

StringBytes(lit) function

$$
\begin{array}{l}
\operatorname{EscapeBytes}(e)\ = \\[0.16em]
\ \operatorname{EscapeValue}(e)\quad \mathsf{if}\ e\ =\ \texttt{"\textbackslash{}u\{"}\ h_{1}\ \ldots \ h_{n}\ \texttt{"\}"} \\[0.16em]
\ [\operatorname{EscapeValue}(e)]\quad \mathsf{otherwise} \\[0.16em]
\operatorname{StringBytesFrom}(T,\ p,\ q)\ = \\[0.16em]
\ []\quad \mathsf{if}\ p\ =\ q \\[0.16em]
\ \operatorname{EscapeBytes}(\operatorname{Lexeme}(T,\ p,\ r))\ \mathbin{++} \ \operatorname{StringBytesFrom}(T,\ r,\ q)\ \mathsf{if}\ p\ <\ q\ \land \ T[p]\ =\ \texttt{"\textbackslash{}\textbackslash{}"}\ \land \ \operatorname{EscapeMatch}(T,\ p,\ r) \\[0.16em]
\ \operatorname{EncodeUTF8}(T[p])\ \mathbin{++} \ \operatorname{StringBytesFrom}(T,\ p\ +\ 1,\ q)\quad \mathsf{if}\ p\ <\ q\ \land \ T[p]\ \ne \ \texttt{"\textbackslash{}\textbackslash{}"} \\[0.16em]
\operatorname{StringBytes}(\mathsf{lit})\ =\ \mathsf{bytes}\ \Leftrightarrow \ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{StringLiteral}\ \land \ T\ =\ \operatorname{Lexeme}(\mathsf{lit})\ \land \ \operatorname{StringBytesFrom}(T,\ 1,\ \mid T\mid -1)\ =\ \mathsf{bytes} \\[0.16em]
\operatorname{RawBytes}(\mathsf{lit})\ =\ \mathsf{bytes}\ \Leftrightarrow \ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{BytesLiteral}\ \land \ \mathsf{lit}.\mathsf{payload}\ =\ \mathsf{bytes} \\[0.16em]
\operatorname{RawBytes}(\mathsf{lit})\ =\ \operatorname{StringBytes}(\mathsf{lit})\ \Leftrightarrow \ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{StringLiteral}
\end{array}
$$

**(EmitLiteralData-Decl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Mangle}(\operatorname{LiteralData}(\mathsf{kind},\ \mathsf{bytes}))\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitLiteralData}(\mathsf{kind},\ \mathsf{bytes})\ \Downarrow \ \operatorname{GlobalConst}(\mathsf{sym},\ \mathsf{bytes})
\end{array}
$$

**(EmitLiteral-String)**

$$
\begin{array}{l}
\operatorname{StringBytes}(\mathsf{lit})\ =\ \mathsf{bytes}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\operatorname{LiteralData}(\texttt{"string"},\ \mathsf{bytes}))\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitStringLit}(\mathsf{lit})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\operatorname{StringBytes}(\mathsf{lit})\ =\ \mathsf{bytes}\ \Rightarrow \ \operatorname{Utf8Valid}(\mathsf{bytes})
\end{array}
$$

**(EmitLiteral-Bytes)**

$$
\begin{array}{l}
\operatorname{RawBytes}(\mathsf{lit})\ =\ \mathsf{bytes}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\operatorname{LiteralData}(\texttt{"bytes"},\ \mathsf{bytes}))\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitBytesLit}(\mathsf{lit})\ \Downarrow \ \mathsf{sym} \\[0.16em]
\operatorname{RawBytes}(\mathsf{lit})\ \mathsf{undefined}\ \Rightarrow \ \operatorname{EmitBytesLit}(\mathsf{lit})\ \mathsf{undefined}
\end{array}
$$

**(EmitLiteral-Char)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePrim}(\texttt{"char"})\quad \Gamma \ \vdash \ \operatorname{EncodeConst}(T,\ \mathsf{lit})\ \Downarrow \ \mathsf{bytes} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitLiteralData}(\texttt{"char"},\ \mathsf{bytes})\ \Downarrow \ \operatorname{GlobalConst}(\operatorname{Mangle}(\operatorname{LiteralData}(\texttt{"char"},\ \mathsf{bytes})),\ \mathsf{bytes})
\end{array}
$$

**(EmitLiteral-Int)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePrim}(t)\quad t\ \in \ \mathsf{IntTypes}\quad \Gamma \ \vdash \ \operatorname{EncodeConst}(T,\ \mathsf{lit})\ \Downarrow \ \mathsf{bytes} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitLiteralData}(\texttt{"int"},\ \mathsf{bytes})\ \Downarrow \ \operatorname{GlobalConst}(\operatorname{Mangle}(\operatorname{LiteralData}(\texttt{"int"},\ \mathsf{bytes})),\ \mathsf{bytes})
\end{array}
$$

**(EmitLiteral-Float)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePrim}(t)\quad t\ \in \ \mathsf{FloatTypes}\quad \Gamma \ \vdash \ \operatorname{EncodeConst}(T,\ \mathsf{lit})\ \Downarrow \ \mathsf{bytes} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitLiteralData}(\texttt{"float"},\ \mathsf{bytes})\ \Downarrow \ \operatorname{GlobalConst}(\operatorname{Mangle}(\operatorname{LiteralData}(\texttt{"float"},\ \mathsf{bytes})),\ \mathsf{bytes})
\end{array}
$$

**(EmitLiteral-Err)**
EmitLiteralData(kind, bytes) undefined

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitLiteralData}(\mathsf{kind},\ \mathsf{bytes})\ \Uparrow 
\end{array}
$$

### 24.7.13 Poisoning Instrumentation

$$
\mathsf{PoisonJudg}\ =\ \{\operatorname{PoisonFlag}(m)\ \Downarrow \ \mathsf{sym},\ \operatorname{CheckPoison}(m)\ \Downarrow \ \mathsf{IR},\ \operatorname{SetPoison}(m)\ \Downarrow \ \mathsf{IR}\}
$$

$$
\operatorname{PoisonSet}(m)\ =\ \{m\}\ \cup \ \{x\ \mid \ \operatorname{Reachable}(x,\ m,\ E_{\mathsf{val}}^\{\mathsf{eager}\})\}
$$

**(PoisonFlag-Decl)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PoisonFlag}(m)\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"poison"}]\ \mathbin{++} \ \operatorname{PathOfModule}(m))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{PoisonFlagDecl}(m)\ =\ \operatorname{GlobalZero}(\operatorname{PoisonFlag}(m),\ \operatorname{sizeof}(\operatorname{TypePrim}(\texttt{"bool"}))) \\[0.16em]
\operatorname{StaticType}(\operatorname{PoisonFlag}(m))\ =\ \operatorname{TypePrim}(\texttt{"bool"})
\end{array}
$$

When `HostedStateSym(Project(Γ), PoisonFlag(m))` holds, `PoisonFlagDecl(m)` denotes the per-session poison-flag template for module `m`.

**(CheckPoison-Use)**

$$
\begin{array}{l}
\operatorname{PoisonFlag}(m)\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CheckPoison}(m)\ \Downarrow \ \mathsf{IR} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CheckPoison}(m)\ \Downarrow \ \mathsf{IR}\ \Leftrightarrow \ \forall \ \sigma .\ (\operatorname{ReadAddr}(\sigma ,\ \operatorname{AddrOfSym}(\operatorname{PoisonFlag}(m)))\ \ne \ 0\ \Rightarrow \ \exists \ \sigma '.\ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma ')\ \land \ \operatorname{ExecIRSigma}(\operatorname{LowerPanic}(\operatorname{InitPanic}(m)),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma '))\ \land \ (\operatorname{ReadAddr}(\sigma ,\ \operatorname{AddrOfSym}(\operatorname{PoisonFlag}(m)))\ =\ 0\ \Rightarrow \ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\operatorname{Val}(()),\ \sigma ))
\end{array}
$$

Within hosted-library session execution, the `AddrOfSym(PoisonFlag(m))` and `StoreGlobal(sym_i, 1)` occurrences in this subsection are interpreted by §§24.4.1 and 24.7.8 so that each live hosted session owns an independent poison flag for every hosted-state module.

**(SetPoison-OnInitFail)**

$$
\begin{array}{l}
\operatorname{PoisonSet}(m)\ =\ \{m_{1},\ \ldots ,\ m_{k}\}\quad \forall \ i,\ \operatorname{PoisonFlag}(m_{i})\ \Downarrow \ \mathsf{sym}_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{SetPoison}(m)\ \Downarrow \ \operatorname{SeqIR}(\operatorname{StoreGlobal}(\mathsf{sym}_{1},\ 1),\ \ldots ,\ \operatorname{StoreGlobal}(\mathsf{sym}_{k},\ 1))
\end{array}
$$

**(PoisonFlag-Err)**
PoisonFlag(m) undefined

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PoisonFlag}(m)\ \Uparrow 
\end{array}
$$

**(CheckPoison-Err)**
CheckPoison(m) undefined

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CheckPoison}(m)\ \Uparrow 
\end{array}
$$

**(SetPoison-Err)**
SetPoison(m) undefined

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{SetPoison}(m)\ \Uparrow 
\end{array}
$$

## 24.8 Output and Backend Diagnostics

This section owns output-pipeline and backend-emission diagnostics defined by Chapter 24.

| Code         | Severity | Detection    | Condition                                                                |
| ------------ | -------- | ------------ | ------------------------------------------------------------------------ |
| `E-OUT-0401` | Error    | Compile-time | Failed to create output directory                                        |
| `E-OUT-0402` | Error    | Compile-time | Failed to emit object file (codegen or write)                            |
| `E-OUT-0403` | Error    | Compile-time | Failed to emit IR/bitcode (codegen, assemble, tool resolution, or write) |
| `E-OUT-0404` | Error    | Compile-time | Final artifact tool invocation failed                                    |
| `E-OUT-0405` | Error    | Compile-time | Required linker or archiver tool not found                               |
| `E-OUT-0406` | Error    | Compile-time | Output path collision detected                                           |
| `E-OUT-0407` | Error    | Compile-time | Runtime library missing or unreadable                                    |
| `E-OUT-0408` | Error    | Compile-time | Runtime library missing required symbol(s)                               |
| `E-OUT-0409` | Error    | Compile-time | Selected target profile does not support requested final artifact        |
| `E-OUT-0410` | Error    | Compile-time | LLVM type mapping failed                                                 |
| `E-OUT-0411` | Error    | Compile-time | LLVM IR lowering failed                                                  |
| `E-OUT-0412` | Error    | Compile-time | Binding storage/validity lowering failed                                 |
| `E-OUT-0413` | Error    | Compile-time | LLVM call ABI lowering failed                                            |
| `E-OUT-0414` | Error    | Compile-time | VTable emission failed                                                   |
| `E-OUT-0415` | Error    | Compile-time | Literal data emission failed                                             |
| `E-OUT-0416` | Error    | Compile-time | Runtime built-in symbol resolution failed                                |
| `E-OUT-0417` | Error    | Compile-time | Entrypoint or context construction lowering failed                       |
| `E-OUT-0418` | Error    | Compile-time | Poisoning instrumentation failed                                         |
