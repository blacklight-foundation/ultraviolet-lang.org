---
title: "Common Lowering, Program Lifecycle, and Backend"
description: "24. Common Lowering, Program Lifecycle, and Backend of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T18:13:03.158Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## 24. Common Lowering, Program Lifecycle, and Backend

### 24.1 Shared Lowering Judgments

Feature-local lowering rules are defined by the owning feature sections in Chapters 12 through 22. This section defines only the shared lowering interface, correctness obligations, and project/module composition rules used by those feature-owned derivations.

#### 24.1.1 Codegen Model and Targets

```math
\operatorname{ArtifactsOf}(P)\ =\ \operatorname{Set}(\mathsf{Objs})\ \cup \ \operatorname{Set}(\mathsf{IRs})\ \cup \ (\{\mathsf{Artifact}\}\ \mathsf{if}\ \mathsf{Artifact}\ \ne \ \bot \ \mathsf{else}\ \emptyset )\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{OutputPipeline}(P)\ \Downarrow \ (\mathsf{Objs},\ \mathsf{IRs},\ \mathsf{Artifact})
```
IRTarget = "LLVM-21.1.8"

```math
\begin{array}{l}
\mathsf{ObjTarget}\ =\ \operatorname{ObjFormatOf}(\mathsf{SelectedTargetProfile}) \\
\mathsf{LLVMValid}_{21}.1.8(L)\ \Leftrightarrow \ L\ \in \ \mathsf{LLVMIR}_{21}.1.8 \\
\forall \ \mathsf{IR},\ L.\ \Gamma \ \vdash \ \operatorname{LowerIR}(\mathsf{IR})\ \Downarrow \ L\ \Rightarrow \ \mathsf{LLVMValid}_{21}.1.8(L)
\end{array}
```

#### 24.1.2 Shared Judgments and Correctness

```math
\mathsf{CodegenJudg}\ =\ \{\mathsf{CodegenProject},\ \mathsf{CodegenModule},\ \mathsf{CodegenItem},\ \mathsf{CodegenExpr},\ \mathsf{CodegenStmt},\ \mathsf{CodegenBlock},\ \mathsf{CodegenPlace}\}
```

```math
\operatorname{IRDefined}(\mathsf{IR})\ \Leftrightarrow \ \forall \ \sigma .\ \exists \ \mathsf{out},\ \sigma '.\ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')
```

```math
\begin{array}{l}
\mathsf{CodegenExprValCorrect}\ \Leftrightarrow \ \forall \ e,\ \mathsf{IR},\ v,\ \sigma ,\ v',\ \sigma '.\ (\Gamma \ \vdash \ \operatorname{CodegenExpr}(e)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle \ \land \ \Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma '))\ \Rightarrow \ (\operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma ')\ \land \ v\ =\ v') \\
\mathsf{CodegenExprCtrlCorrect}\ \Leftrightarrow \ \forall \ e,\ \mathsf{IR},\ v,\ \sigma ,\ \kappa ,\ \sigma '.\ (\Gamma \ \vdash \ \operatorname{CodegenExpr}(e)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle \ \land \ \Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma '))\ \Rightarrow \ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma ') \\
\mathsf{CodegenStmtCorrect}\ \Leftrightarrow \ \forall \ s,\ \mathsf{IR},\ \sigma ,\ \mathsf{sout},\ \sigma '.\ (\Gamma \ \vdash \ \operatorname{CodegenStmt}(s)\ \Downarrow \ \mathsf{IR}\ \land \ \Gamma \ \vdash \ \operatorname{ExecSigma}(s,\ \sigma )\ \Downarrow \ (\mathsf{sout},\ \sigma '))\ \Rightarrow \ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\mathsf{sout},\ \sigma ') \\
\mathsf{CodegenBlockValCorrect}\ \Leftrightarrow \ \forall \ b,\ \mathsf{IR},\ v,\ \sigma ,\ v',\ \sigma '.\ (\Gamma \ \vdash \ \operatorname{CodegenBlock}(b)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle \ \land \ \Gamma \ \vdash \ \operatorname{EvalBlockSigma}(b,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma '))\ \Rightarrow \ (\operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma ')\ \land \ v\ =\ v') \\
\mathsf{CodegenBlockCtrlCorrect}\ \Leftrightarrow \ \forall \ b,\ \mathsf{IR},\ v,\ \sigma ,\ \kappa ,\ \sigma '.\ (\Gamma \ \vdash \ \operatorname{CodegenBlock}(b)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle \ \land \ \Gamma \ \vdash \ \operatorname{EvalBlockSigma}(b,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma '))\ \Rightarrow \ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma ')
\end{array}
```

```math
\begin{array}{l}
\mathsf{CodegenCorrect}\ \Leftrightarrow \ \mathsf{CodegenExprValCorrect}\ \land \ \mathsf{CodegenExprCtrlCorrect}\ \land \ \mathsf{CodegenStmtCorrect}\ \land \ \mathsf{CodegenBlockValCorrect}\ \land \ \mathsf{CodegenBlockCtrlCorrect} \\
\mathsf{CodegenUndefined}\ \Leftrightarrow \ \exists \ e,\ \mathsf{IR},\ v.\ \Gamma \ \vdash \ \operatorname{CodegenExpr}(e)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle \ \land \ \lnot \ \operatorname{IRDefined}(\mathsf{IR})\ \lor \ \exists \ s,\ \mathsf{IR}.\ \Gamma \ \vdash \ \operatorname{CodegenStmt}(s)\ \Downarrow \ \mathsf{IR}\ \land \ \lnot \ \operatorname{IRDefined}(\mathsf{IR})\ \lor \ \exists \ b,\ \mathsf{IR},\ v.\ \Gamma \ \vdash \ \operatorname{CodegenBlock}(b)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle \ \land \ \lnot \ \operatorname{IRDefined}(\mathsf{IR}) \\
\mathsf{CodegenUndefined}\ \Rightarrow \ \mathsf{OutsideConformance}
\end{array}
```

#### 24.1.3 IR Forms and Composition

```math
\mathsf{IRDecls}\ =\ [\mathsf{IRDecl}]
```
ModuleIR = IRDecls

```math
\mathsf{LLVMEmitJudg}\ =\ \{\operatorname{LowerIR}(\mathsf{ModuleIR})\ \Downarrow \ \mathsf{LLVMIR},\ \operatorname{EmitLLVM}(\mathsf{LLVMIR})\ \Downarrow \ \mathsf{bytes},\ \operatorname{EmitObj}(\mathsf{LLVMIR})\ \Downarrow \ \mathsf{bytes}\}
```

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CodegenItem}(\mathsf{item})\ \Downarrow \ \mathsf{ds}\ \Rightarrow \ \mathsf{ds}\ \in \ \mathsf{IRDecls} \\
\mathsf{ProcIR}\ :\ \mathsf{Symbol}\ \times \ [\mathsf{Param}]\ \times \ \mathsf{Type}\ \times \ \mathsf{IR}\ \to \ \mathsf{IRDecl}
\end{array}
```

```math
\begin{array}{l}
\mathsf{PanicOutParam}\ =\ \langle \texttt{move},\ \mathsf{PanicOutName},\ \mathsf{PanicOutType}\rangle  \\
\operatorname{CodegenParams}(\mathsf{params})\ =\ \mathsf{params}\ \mathbin{++} \ [\mathsf{PanicOutParam}]
\end{array}
```

```math
\begin{array}{l}
\operatorname{MethodParams}(R,\ m)\ =\ [\langle \operatorname{RecvMode}(m.\mathsf{receiver}),\ \texttt{self},\ \operatorname{RecvType}(\mathsf{Self}_{R},\ m.\mathsf{receiver})\rangle ]\ \mathbin{++} \ m.\mathsf{params} \\
\operatorname{ClassMethodParams}(\mathsf{Cl},\ m)\ =\ [\langle \operatorname{RecvMode}(m.\mathsf{receiver}),\ \texttt{self},\ \operatorname{RecvType}(\mathsf{SelfVar},\ m.\mathsf{receiver})\rangle ]\ \mathbin{++} \ m.\mathsf{params} \\
\operatorname{ParamList_T}(T,\ \mathsf{params})\ =\ [\langle \mathsf{mode}_{i},\ \mathsf{name}_{i},\ \operatorname{SubstSelf}(T,\ \mathsf{ty}_{i})\rangle \ \mid \ \langle \mathsf{mode}_{i},\ \mathsf{name}_{i},\ \mathsf{ty}_{i}\rangle \ \in \ \mathsf{params}] \\
\operatorname{ClassMethodParams_T}(T,\ m)\ =\ [\langle \operatorname{RecvMode}(m.\mathsf{receiver}),\ \texttt{self},\ \operatorname{RecvType}(T,\ m.\mathsf{receiver})\rangle ]\ \mathbin{++} \ \operatorname{ParamList_T}(T,\ m.\mathsf{params}) \\
\operatorname{StateMethodParams}(M,\ S,\ \mathsf{md})\ =\ [\langle \operatorname{RecvMode}(\mathsf{md}.\mathsf{receiver}),\ \texttt{self},\ \operatorname{RecvType}(\operatorname{TypeModalState}(\operatorname{ModalPath}(M),\ S),\ \mathsf{md}.\mathsf{receiver})\rangle ]\ \mathbin{++} \ \mathsf{md}.\mathsf{params} \\
\operatorname{TransitionParams}(M,\ S,\ \mathsf{tr})\ =\ [\langle \texttt{move},\ \texttt{self},\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}(\operatorname{ModalPath}(M),\ S))\rangle ]\ \mathbin{++} \ \mathsf{tr}.\mathsf{params}
\end{array}
```

```math
\begin{array}{l}
\operatorname{SeqIR}()\ =\ \varepsilon  \\
\operatorname{SeqIR}(\mathsf{IR})\ =\ \mathsf{IR} \\
\operatorname{SeqIR}(\mathsf{IR}_{1},\ \ldots ,\ \mathsf{IR}_{n})\ =\ \operatorname{SeqIR}(\mathsf{IR}_{1},\ \operatorname{SeqIR}(\mathsf{IR}_{2},\ \ldots ,\ \mathsf{IR}_{n}))\quad (n\ \ge \ 2)
\end{array}
```

```math
\mathsf{EvalOrderJudg}\ =\ \{\mathsf{Children}_{\mathsf{LTR}}\}
```

```math
\begin{array}{l}
\operatorname{ArgsExprs}([])\ =\ [] \\
\operatorname{ArgsExprs}([\langle \mathsf{moved},\ e,\ \mathsf{span}\rangle ]\ \mathbin{++} \ \mathsf{rest})\ =\ [e]\ \mathbin{++} \ \operatorname{ArgsExprs}(\mathsf{rest})
\end{array}
```

```math
\begin{array}{l}
\operatorname{FieldExprs}([])\ =\ [] \\
\operatorname{FieldExprs}([\langle f,\ e\rangle ]\ \mathbin{++} \ \mathsf{rest})\ =\ [e]\ \mathbin{++} \ \operatorname{FieldExprs}(\mathsf{rest})
\end{array}
```

```math
\begin{array}{l}
\operatorname{OptExprs}(\bot ,\ \bot )\ =\ [] \\
\operatorname{OptExprs}(e,\ \bot )\ =\ [e] \\
\operatorname{OptExprs}(\bot ,\ e)\ =\ [e] \\
\operatorname{OptExprs}(e_{1},\ e_{2})\ =\ [e_{1},\ e_{2}]
\end{array}
```

```math
\begin{array}{l}
\operatorname{ParallelOptExprs}([])\ =\ [] \\
\operatorname{ParallelOptExprs}(\operatorname{Cancel}(e)\ \mathbin{::} \ \mathsf{os})\ =\ [e]\ \mathbin{++} \ \operatorname{ParallelOptExprs}(\mathsf{os}) \\
\operatorname{ParallelOptExprs}(\operatorname{Name}(\_)\ \mathbin{::} \ \mathsf{os})\ =\ \operatorname{ParallelOptExprs}(\mathsf{os})
\end{array}
```

```math
\begin{array}{l}
\operatorname{SpawnOptExprs}([])\ =\ [] \\
\operatorname{SpawnOptExprs}(\operatorname{Name}(\_)\ \mathbin{::} \ \mathsf{os})\ =\ \operatorname{SpawnOptExprs}(\mathsf{os}) \\
\operatorname{SpawnOptExprs}(\operatorname{Affinity}(e)\ \mathbin{::} \ \mathsf{os})\ =\ [e]\ \mathbin{++} \ \operatorname{SpawnOptExprs}(\mathsf{os}) \\
\operatorname{SpawnOptExprs}(\operatorname{Priority}(e)\ \mathbin{::} \ \mathsf{os})\ =\ [e]\ \mathbin{++} \ \operatorname{SpawnOptExprs}(\mathsf{os})
\end{array}
```

```math
\begin{array}{l}
\operatorname{DispatchOptExprs}([])\ =\ [] \\
\operatorname{DispatchOptExprs}(\operatorname{Reduce}(\_)\ \mathbin{::} \ \mathsf{os})\ =\ \operatorname{DispatchOptExprs}(\mathsf{os}) \\
\operatorname{DispatchOptExprs}(\mathsf{Ordered}\ \mathbin{::} \ \mathsf{os})\ =\ \operatorname{DispatchOptExprs}(\mathsf{os}) \\
\operatorname{DispatchOptExprs}(\operatorname{Chunk}(e)\ \mathbin{::} \ \mathsf{os})\ =\ [e]\ \mathbin{++} \ \operatorname{DispatchOptExprs}(\mathsf{os})
\end{array}
```

```math
\begin{array}{l}
\operatorname{KeySegExprs}([])\ =\ [] \\
\operatorname{KeySegExprs}(\operatorname{Field}(\_,\ \_)\ \mathbin{::} \ \mathsf{ss})\ =\ \operatorname{KeySegExprs}(\mathsf{ss}) \\
\operatorname{KeySegExprs}(\operatorname{Index}(\_,\ e)\ \mathbin{::} \ \mathsf{ss})\ =\ [e]\ \mathbin{++} \ \operatorname{KeySegExprs}(\mathsf{ss}) \\
\operatorname{KeyPathExprs}(\langle \mathsf{root},\ \mathsf{segs}\rangle )\ =\ \operatorname{KeySegExprs}(\mathsf{segs}) \\
\operatorname{KeyClauseExprs}(\bot )\ =\ [] \\
\operatorname{KeyClauseExprs}(\langle \mathsf{path},\ \mathsf{mode}\rangle )\ =\ \operatorname{KeyPathExprs}(\mathsf{path})
\end{array}
```

```math
\begin{array}{l}
\operatorname{RaceArmExprs}([])\ =\ [] \\
\operatorname{RaceArmExprs}(\langle e,\ \_,\ \_\rangle \ \mathbin{::} \ \mathsf{as})\ =\ [e]\ \mathbin{++} \ \operatorname{RaceArmExprs}(\mathsf{as})
\end{array}
```

```math
\begin{array}{l}
\operatorname{Children_LTR}(\operatorname{Literal}(\ell ))\ =\ [] \\
\operatorname{Children_LTR}(\mathsf{PtrNullExpr})\ =\ [] \\
\operatorname{Children_LTR}(\operatorname{Identifier}(x))\ =\ [] \\
\operatorname{Children_LTR}(\operatorname{Path}(\mathsf{path},\ \mathsf{name}))\ =\ [] \\
\operatorname{Children_LTR}(\operatorname{TupleExpr}(\mathsf{es}))\ =\ \mathsf{es} \\
\operatorname{Children_LTR}(\operatorname{ArrayExpr}(\mathsf{es}))\ =\ \mathsf{es} \\
\operatorname{Children_LTR}(\operatorname{RecordExpr}(\mathsf{tr},\ \mathsf{fields}))\ =\ \operatorname{FieldExprs}(\mathsf{fields}) \\
\operatorname{Children_LTR}(\operatorname{EnumLiteral}(\mathsf{path},\ \bot ))\ =\ [] \\
\operatorname{Children_LTR}(\operatorname{EnumLiteral}(\mathsf{path},\ \operatorname{Paren}(\mathsf{es})))\ =\ \mathsf{es} \\
\operatorname{Children_LTR}(\operatorname{EnumLiteral}(\mathsf{path},\ \operatorname{Brace}(\mathsf{fields})))\ =\ \operatorname{FieldExprs}(\mathsf{fields}) \\
\operatorname{Children_LTR}(\operatorname{FieldAccess}(\mathsf{base},\ f))\ =\ [\mathsf{base}] \\
\operatorname{Children_LTR}(\operatorname{TupleAccess}(\mathsf{base},\ i))\ =\ [\mathsf{base}] \\
\operatorname{Children_LTR}(\operatorname{IndexAccess}(\mathsf{base},\ \mathsf{idx}))\ =\ [\mathsf{base},\ \mathsf{idx}] \\
\operatorname{Children_LTR}(\operatorname{Call}(\mathsf{callee},\ \mathsf{args}))\ =\ [\mathsf{callee}]\ \mathbin{++} \ \operatorname{ArgsExprs}(\mathsf{args}) \\
\operatorname{Children_LTR}(\operatorname{CallTypeArgs}(\mathsf{callee},\ \mathsf{type}_{\mathsf{args}},\ \mathsf{args}))\ =\ [\mathsf{callee}]\ \mathbin{++} \ \operatorname{ArgsExprs}(\mathsf{args}) \\
\operatorname{Children_LTR}(\operatorname{MethodCall}(\mathsf{base},\ \mathsf{name},\ \mathsf{args}))\ =\ [\mathsf{base}]\ \mathbin{++} \ \operatorname{ArgsExprs}(\mathsf{args}) \\
\operatorname{Children_LTR}(\operatorname{Unary}(\mathsf{op},\ e))\ =\ [e] \\
\operatorname{Children_LTR}(\operatorname{Binary}(\mathsf{op},\ e_{1},\ e_{2}))\ =\ [e_{1},\ e_{2}] \\
\operatorname{Children_LTR}(\operatorname{Cast}(e,\ T))\ =\ [e] \\
\operatorname{Children_LTR}(\operatorname{TransmuteExpr}(T_{1},\ T_{2},\ e))\ =\ [e] \\
\operatorname{Children_LTR}(\operatorname{Propagate}(e))\ =\ [e] \\
\operatorname{Children_LTR}(\operatorname{Range}(\mathsf{kind},\ \mathsf{lo}_{\mathsf{opt}},\ \mathsf{hi}_{\mathsf{opt}}))\ =\ \operatorname{OptExprs}(\mathsf{lo}_{\mathsf{opt}},\ \mathsf{hi}_{\mathsf{opt}}) \\
\operatorname{Children_LTR}(\operatorname{IfExpr}(\mathsf{cond},\ \mathsf{b1},\ \mathsf{b2}))\ =\ [\mathsf{cond}] \\
\operatorname{Children_LTR}(\operatorname{IfIsExpr}(\mathsf{scrut},\ \_,\ \_,\ \_))\ =\ [\mathsf{scrut}] \\
\operatorname{Children_LTR}(\operatorname{IfCaseExpr}(\mathsf{scrut},\ \_,\ \_))\ =\ [\mathsf{scrut}] \\
\operatorname{LoopInvExprs}(\bot )\ =\ [] \\
\operatorname{LoopInvExprs}(\mathsf{inv})\ =\ [\mathsf{inv}] \\
\operatorname{Children_LTR}(\operatorname{LoopInfinite}(\mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}))\ =\ \operatorname{LoopInvExprs}(\mathsf{inv}_{\mathsf{opt}})\ \mathbin{++} \ [\mathsf{body}] \\
\operatorname{Children_LTR}(\operatorname{LoopConditional}(\mathsf{cond},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}))\ =\ [\mathsf{cond}]\ \mathbin{++} \ \operatorname{LoopInvExprs}(\mathsf{inv}_{\mathsf{opt}})\ \mathbin{++} \ [\mathsf{body}] \\
\operatorname{Children_LTR}(\operatorname{LoopIter}(\mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{iter},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}))\ =\ [\mathsf{iter}]\ \mathbin{++} \ \operatorname{LoopInvExprs}(\mathsf{inv}_{\mathsf{opt}})\ \mathbin{++} \ [\mathsf{body}] \\
\operatorname{Children_LTR}(\operatorname{BlockExpr}(\mathsf{stmts},\ \mathsf{tail}_{\mathsf{opt}}))\ =\ [] \\
\operatorname{Children_LTR}(\operatorname{UnsafeBlockExpr}(b))\ =\ [] \\
\operatorname{Children_LTR}(\operatorname{MoveExpr}(p))\ =\ [] \\
\operatorname{Children_LTR}(\operatorname{AddressOf}(p))\ =\ [] \\
\operatorname{Children_LTR}(\operatorname{Deref}(e))\ =\ [e] \\
\operatorname{Children_LTR}(\operatorname{AllocExpr}(r_{\mathsf{opt}},\ e))\ =\ [e] \\
\operatorname{Children_LTR}(\operatorname{ParallelExpr}(\mathsf{domain},\ \mathsf{opts},\ \mathsf{body}))\ =\ [\mathsf{domain}]\ \mathbin{++} \ \operatorname{ParallelOptExprs}(\mathsf{opts}) \\
\operatorname{Children_LTR}(\operatorname{SpawnExpr}(\mathsf{opts},\ \mathsf{body}))\ =\ \operatorname{SpawnOptExprs}(\mathsf{opts}) \\
\operatorname{Children_LTR}(\operatorname{DispatchExpr}(\mathsf{pat},\ \mathsf{range},\ \mathsf{key}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{opts},\ \mathsf{body}))\ =\ [\mathsf{range}]\ \mathbin{++} \ \operatorname{KeyClauseExprs}(\mathsf{key}_{\mathsf{clause}\_\mathsf{opt}})\ \mathbin{++} \ \operatorname{DispatchOptExprs}(\mathsf{opts})
\end{array}
```

```math
\mathsf{LowerExprJudg}\ =\ \{\mathsf{LowerExpr},\ \mathsf{LowerUnOp},\ \mathsf{LowerBinOp},\ \mathsf{LowerCast},\ \mathsf{LowerList},\ \mathsf{LowerFieldInits},\ \mathsf{LowerOpt},\ \mathsf{LowerReadPlace},\ \mathsf{LowerWritePlace},\ \mathsf{LowerMovePlace},\ \mathsf{LowerAddrOf},\ \mathsf{LowerPlace}\}
```

```math
\operatorname{RetType}(\Gamma )\ =\ R\ \Leftrightarrow \ \operatorname{ProcRet}(\Gamma )\ =\ R
```

**(Lower-Expr-Correctness)**

```math
\begin{array}{l}
\forall \ \sigma ,\ \Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\ \Rightarrow \ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle 
\end{array}
```

```math
\begin{array}{l}
\mathsf{ExprForms0}\ =\ \{\operatorname{Literal}(\_),\ \mathsf{PtrNullExpr},\ \operatorname{Identifier}(\_),\ \operatorname{Path}(\_,\ \_),\ \operatorname{ErrorExpr}(\_),\ \operatorname{TupleExpr}(\_),\ \operatorname{ArrayExpr}(\_),\ \operatorname{RecordExpr}(\_,\ \_),\ \operatorname{EnumLiteral}(\_,\ \_),\ \operatorname{FieldAccess}(\_,\ \_),\ \operatorname{TupleAccess}(\_,\ \_),\ \operatorname{IndexAccess}(\_,\ \_),\ \operatorname{Call}(\_,\ \_),\ \operatorname{MethodCall}(\_,\ \_,\ \_),\ \operatorname{Unary}(\_,\ \_),\ \operatorname{Binary}(\_,\ \_,\ \_),\ \operatorname{Cast}(\_,\ \_),\ \operatorname{TransmuteExpr}(\_,\ \_,\ \_),\ \operatorname{Propagate}(\_),\ \operatorname{Range}(\_,\ \_,\ \_),\ \operatorname{IfExpr}(\_,\ \_,\ \_),\ \operatorname{IfIsExpr}(\_,\ \_,\ \_,\ \_),\ \operatorname{IfCaseExpr}(\_,\ \_,\ \_),\ \operatorname{LoopInfinite}(\_,\ \_),\ \operatorname{LoopConditional}(\_,\ \_,\ \_),\ \operatorname{LoopIter}(\_,\ \_,\ \_,\ \_,\ \_),\ \operatorname{BlockExpr}(\_,\ \_),\ \operatorname{UnsafeBlockExpr}(\_),\ \operatorname{MoveExpr}(\_),\ \operatorname{AddressOf}(\_),\ \operatorname{Deref}(\_),\ \operatorname{AllocExpr}(\_,\ \_)\} \\
\operatorname{LowerExprTotal}(\Gamma )\ \Leftrightarrow \ \forall \ e.\ e\ \in \ \mathsf{ExprForms0}\ \Rightarrow \ \exists \ \mathsf{IR},\ v.\ \Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle 
\end{array}
```

```math
\mathsf{ExecIRJudg}\ =\ \{\mathsf{ExecIRSigma},\ \mathsf{MoveStateSigma}\}
```

**(ExecIR-ReadVar)**

```math
\begin{array}{l}
\operatorname{LookupVal}(\sigma ,\ x)\ =\ v \\
\rule{18em}{0.4pt} \\
\operatorname{ExecIRSigma}(\operatorname{ReadVarIR}(x),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma )
\end{array}
```

**(ExecIR-ReadPath)**

```math
\begin{array}{l}
\operatorname{LookupValPath}(\sigma ,\ \mathsf{path},\ \mathsf{name})\ =\ v \\
\rule{18em}{0.4pt} \\
\operatorname{ExecIRSigma}(\operatorname{ReadPathIR}(\mathsf{path},\ \mathsf{name}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma )
\end{array}
```

**(ExecIR-StoreVar)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{WritePlaceSigma}(\operatorname{Identifier}(x),\ v,\ \sigma )\ \Downarrow \ (\mathsf{sout},\ \sigma ') \\
\rule{18em}{0.4pt} \\
\operatorname{ExecIRSigma}(\operatorname{StoreVarIR}(x,\ v),\ \sigma )\ \Downarrow \ (\mathsf{sout},\ \sigma ')
\end{array}
```

**(ExecIR-StoreVarNoDrop)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{WritePlaceSubSigma}(\operatorname{Identifier}(x),\ v,\ \sigma )\ \Downarrow \ (\mathsf{sout},\ \sigma ') \\
\rule{18em}{0.4pt} \\
\operatorname{ExecIRSigma}(\operatorname{StoreVarNoDropIR}(x,\ v),\ \sigma )\ \Downarrow \ (\mathsf{sout},\ \sigma ')
\end{array}
```

**(ExecIR-BindVar)**

```math
\begin{array}{l}
\operatorname{BindVal}(\sigma ,\ x,\ v)\ \Downarrow \ (\sigma ',\ b) \\
\rule{18em}{0.4pt} \\
\operatorname{ExecIRSigma}(\operatorname{BindVarIR}(x,\ v),\ \sigma )\ \Downarrow \ (\mathsf{ok},\ \sigma ')
\end{array}
```

**(ExecIR-ReadPtr)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ReadPtrSigma}(v_{\mathsf{ptr}},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\
\rule{18em}{0.4pt} \\
\operatorname{ExecIRSigma}(\operatorname{ReadPtrIR}(v_{\mathsf{ptr}}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')
\end{array}
```

**(ExecIR-WritePtr)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{WritePtrSigma}(v_{\mathsf{ptr}},\ v,\ \sigma )\ \Downarrow \ (\mathsf{sout},\ \sigma ') \\
\rule{18em}{0.4pt} \\
\operatorname{ExecIRSigma}(\operatorname{WritePtrIR}(v_{\mathsf{ptr}},\ v),\ \sigma )\ \Downarrow \ (\mathsf{sout},\ \sigma ')
\end{array}
```

```math
\begin{array}{l}
\operatorname{AllocTarget}(\sigma ,\ \bot )\ =\ \operatorname{ActiveTarget}(\sigma ) \\
\operatorname{AllocTarget}(\sigma ,\ r)\ =\ \operatorname{ResolveTarget}(\sigma ,\ r)
\end{array}
```

**(ExecIR-Alloc)**

```math
\begin{array}{l}
\operatorname{AllocTarget}(\sigma ,\ r_{\mathsf{opt}})\ =\ r\quad \operatorname{RegionAlloc}(\sigma ,\ r,\ v)\ \Downarrow \ (\sigma ',\ v') \\
\rule{18em}{0.4pt} \\
\operatorname{ExecIRSigma}(\operatorname{AllocIR}(r_{\mathsf{opt}},\ v),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma ')
\end{array}
```

**(MoveState-Root)**

```math
\begin{array}{l}
\operatorname{PlaceRoot}(p)\ =\ x\quad \operatorname{FieldHead}(p)\ =\ \bot \quad \operatorname{LookupBind}(\sigma ,\ x)\ =\ b\quad \operatorname{SetState}(\sigma ,\ b,\ \mathsf{Moved})\ \Downarrow \ \sigma ' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{MoveStateSigma}(p,\ \sigma )\ \Downarrow \ \sigma '
\end{array}
```

**(MoveState-Field)**

```math
\begin{array}{l}
\operatorname{PlaceRoot}(p)\ =\ x\quad \operatorname{FieldHead}(p)\ =\ f\quad \operatorname{LookupBind}(\sigma ,\ x)\ =\ b\quad \operatorname{BindState}(\sigma ,\ b)\ =\ s\quad \operatorname{PM}(s,\ f)\ =\ s'\quad \operatorname{SetState}(\sigma ,\ b,\ s')\ \Downarrow \ \sigma ' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{MoveStateSigma}(p,\ \sigma )\ \Downarrow \ \sigma '
\end{array}
```

**(ExecIR-MoveState)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MoveStateSigma}(p,\ \sigma )\ \Downarrow \ \sigma ' \\
\rule{18em}{0.4pt} \\
\operatorname{ExecIRSigma}(\operatorname{MoveStateIR}(p),\ \sigma )\ \Downarrow \ (\mathsf{ok},\ \sigma ')
\end{array}
```

```math
\begin{array}{l}
\operatorname{ExecIRSigma}(\operatorname{ReturnIR}(v),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{Return}(v)),\ \sigma ) \\
\operatorname{ExecIRSigma}(\operatorname{TailValueIR}(v),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{TailValue}(v)),\ \sigma ) \\
\operatorname{ExecIRSigma}(\operatorname{BreakIR}(v_{\mathsf{opt}}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{Break}(v_{\mathsf{opt}})),\ \sigma ) \\
\operatorname{ExecIRSigma}(\mathsf{ContinueIR},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Continue}),\ \sigma )
\end{array}
```

**(ExecIR-Defer)**

```math
\begin{array}{l}
\operatorname{AppendCleanup}(\sigma ,\ \operatorname{DeferBlock}(b))\ \Downarrow \ \sigma ' \\
\rule{18em}{0.4pt} \\
\operatorname{ExecIRSigma}(\operatorname{DeferIR}(b),\ \sigma )\ \Downarrow \ (\mathsf{ok},\ \sigma ')
\end{array}
```

```math
\begin{array}{l}
\operatorname{ExecBlockBodyIRSigma}(\mathsf{IR}_{s},\ \mathsf{IR}_{t},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\ \Leftrightarrow \ \operatorname{ExecIRSigma}(\mathsf{IR}_{s},\ \sigma )\ \Downarrow \ (\mathsf{sout},\ \sigma_{1} )\ \land \ ((\mathsf{sout}\ =\ \mathsf{ok}\ \land \ \mathsf{IR}_{t}\ =\ \varepsilon \ \land \ \mathsf{out}\ =\ \operatorname{Val}(())\ \land \ \sigma '\ =\ \sigma_{1} )\ \lor \ (\mathsf{sout}\ =\ \mathsf{ok}\ \land \ \operatorname{ExecIRSigma}(\mathsf{IR}_{t},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma '))\ \lor \ (\mathsf{sout}\ =\ \operatorname{Ctrl}(\operatorname{TailValue}(v))\ \land \ \mathsf{out}\ =\ \operatorname{Val}(v)\ \land \ \sigma '\ =\ \sigma_{1} )\ \lor \ (\mathsf{sout}\ =\ \operatorname{Ctrl}(\kappa )\ \land \ \kappa \ \ne \ \operatorname{TailValue}(\_)\ \land \ \mathsf{out}\ =\ \operatorname{Ctrl}(\kappa )\ \land \ \sigma '\ =\ \sigma_{1} )) \\
\Gamma \ \vdash \ \operatorname{ExecInScopeIRSigma}(\mathsf{IR}_{b},\ \sigma ,\ \mathsf{scope})\ \Downarrow \ (\mathsf{out},\ \sigma ')\ \Leftrightarrow \ \operatorname{CurrentScopeId}(\sigma )\ =\ \mathsf{scope}\ \land \ \operatorname{ExecIRSigma}(\mathsf{IR}_{b},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\
\Gamma \ \vdash \ \operatorname{ExecBlockBindIRSigma}(\mathsf{pat},\ v,\ \mathsf{IR}_{b},\ \sigma )\ \Downarrow \ (\mathsf{out}',\ \sigma '')\ \Leftrightarrow \ \operatorname{BindPatternVal}(\mathsf{pat},\ v)\ \Downarrow \ B\ \land \ \operatorname{BindOrder}(\mathsf{pat},\ B)\ =\ \mathsf{binds}\ \land \ \operatorname{BlockEnter}(\sigma ,\ \mathsf{binds})\ \Downarrow \ (\sigma_{1} ,\ \mathsf{scope})\ \land \ \operatorname{ExecIRSigma}(\mathsf{IR}_{b},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )\ \land \ \operatorname{BlockExit}(\sigma_{2} ,\ \mathsf{scope},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma '')
\end{array}
```

**(ExecIR-If-True)**

```math
\begin{array}{l}
v_{c}\ =\ \mathsf{true}\quad \operatorname{ExecIRSigma}(\mathsf{IR}_{t},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\
\rule{18em}{0.4pt} \\
\operatorname{ExecIRSigma}(\operatorname{IfIR}(v_{c},\ \mathsf{IR}_{t},\ v_{t},\ \mathsf{IR}_{f},\ v_{f}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')
\end{array}
```

**(ExecIR-If-False)**

```math
\begin{array}{l}
v_{c}\ =\ \mathsf{false}\quad \operatorname{ExecIRSigma}(\mathsf{IR}_{f},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\
\rule{18em}{0.4pt} \\
\operatorname{ExecIRSigma}(\operatorname{IfIR}(v_{c},\ \mathsf{IR}_{t},\ v_{t},\ \mathsf{IR}_{f},\ v_{f}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')
\end{array}
```

**(ExecIR-Block)**

```math
\begin{array}{l}
\operatorname{BlockEnter}(\sigma ,\ [])\ \Downarrow \ (\sigma_{1} ,\ \mathsf{scope})\quad \operatorname{ExecBlockBodyIRSigma}(\mathsf{IR}_{s},\ \mathsf{IR}_{t},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )\quad \operatorname{BlockExit}(\sigma_{2} ,\ \mathsf{scope},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma_{3} ) \\
\rule{18em}{0.4pt} \\
\operatorname{ExecIRSigma}(\operatorname{BlockIR}(\mathsf{IR}_{s},\ \mathsf{IR}_{t},\ v_{t}),\ \sigma )\ \Downarrow \ (\mathsf{out}',\ \sigma_{3} )
\end{array}
```

**(ExecIR-IfCase)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalIfCaseListSigma}(\mathsf{cases},\ \mathsf{else}_{\mathsf{opt}},\ v_{s},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\
\rule{18em}{0.4pt} \\
\operatorname{ExecIRSigma}(\operatorname{IfCaseIR}(v_{s},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')
\end{array}
```

**(ExecIR-Loop-Infinite-Step)**

```math
\begin{array}{l}
\operatorname{ExecIRSigma}(\mathsf{IR}_{b},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad \operatorname{ExecIRSigma}(\operatorname{LoopIR}(\mathsf{LoopInfinite},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\
\rule{18em}{0.4pt} \\
\operatorname{ExecIRSigma}(\operatorname{LoopIR}(\mathsf{LoopInfinite},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
```

**(ExecIR-Loop-Infinite-Continue)**

```math
\begin{array}{l}
\operatorname{ExecIRSigma}(\mathsf{IR}_{b},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Continue}),\ \sigma_{1} )\quad \operatorname{ExecIRSigma}(\operatorname{LoopIR}(\mathsf{LoopInfinite},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\
\rule{18em}{0.4pt} \\
\operatorname{ExecIRSigma}(\operatorname{LoopIR}(\mathsf{LoopInfinite},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
```

**(ExecIR-Loop-Infinite-Break)**

```math
\begin{array}{l}
\operatorname{ExecIRSigma}(\mathsf{IR}_{b},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{Break}(v_{\mathsf{opt}})),\ \sigma_{1} )\quad v\ =\ \operatorname{BreakVal}(v_{\mathsf{opt}}) \\
\rule{18em}{0.4pt} \\
\operatorname{ExecIRSigma}(\operatorname{LoopIR}(\mathsf{LoopInfinite},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )
\end{array}
```

**(ExecIR-Loop-Infinite-Ctrl)**

```math
\begin{array}{l}
\operatorname{ExecIRSigma}(\mathsf{IR}_{b},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )\quad \kappa \ \in \ \{\operatorname{Return}(\_),\ \mathsf{Panic},\ \mathsf{Abort}\} \\
\rule{18em}{0.4pt} \\
\operatorname{ExecIRSigma}(\operatorname{LoopIR}(\mathsf{LoopInfinite},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
```

**(ExecIR-Loop-Cond-False)**

```math
\begin{array}{l}
\operatorname{ExecIRSigma}(\mathsf{IR}_{c},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{false}),\ \sigma_{1} ) \\
\rule{18em}{0.4pt} \\
\operatorname{ExecIRSigma}(\operatorname{LoopIR}(\mathsf{LoopConditional},\ \mathsf{IR}_{c},\ v_{c},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(()),\ \sigma_{1} )
\end{array}
```

**(ExecIR-Loop-Cond-True-Step)**

```math
\begin{array}{l}
\operatorname{ExecIRSigma}(\mathsf{IR}_{c},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{true}),\ \sigma_{1} )\quad \operatorname{ExecIRSigma}(\mathsf{IR}_{b},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{2} )\quad \operatorname{ExecIRSigma}(\operatorname{LoopIR}(\mathsf{LoopConditional},\ \mathsf{IR}_{c},\ v_{c},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma_{2} )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} ) \\
\rule{18em}{0.4pt} \\
\operatorname{ExecIRSigma}(\operatorname{LoopIR}(\mathsf{LoopConditional},\ \mathsf{IR}_{c},\ v_{c},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} )
\end{array}
```

**(ExecIR-Loop-Cond-Continue)**

```math
\begin{array}{l}
\operatorname{ExecIRSigma}(\mathsf{IR}_{c},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{true}),\ \sigma_{1} )\quad \operatorname{ExecIRSigma}(\mathsf{IR}_{b},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Continue}),\ \sigma_{2} )\quad \operatorname{ExecIRSigma}(\operatorname{LoopIR}(\mathsf{LoopConditional},\ \mathsf{IR}_{c},\ v_{c},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma_{2} )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} ) \\
\rule{18em}{0.4pt} \\
\operatorname{ExecIRSigma}(\operatorname{LoopIR}(\mathsf{LoopConditional},\ \mathsf{IR}_{c},\ v_{c},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} )
\end{array}
```

**(ExecIR-Loop-Cond-Break)**

```math
\begin{array}{l}
\operatorname{ExecIRSigma}(\mathsf{IR}_{c},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{true}),\ \sigma_{1} )\quad \operatorname{ExecIRSigma}(\mathsf{IR}_{b},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{Break}(v_{\mathsf{opt}})),\ \sigma_{2} )\quad v\ =\ \operatorname{BreakVal}(v_{\mathsf{opt}}) \\
\rule{18em}{0.4pt} \\
\operatorname{ExecIRSigma}(\operatorname{LoopIR}(\mathsf{LoopConditional},\ \mathsf{IR}_{c},\ v_{c},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{2} )
\end{array}
```

**(ExecIR-Loop-Cond-Ctrl)**

```math
\begin{array}{l}
\operatorname{ExecIRSigma}(\mathsf{IR}_{c},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\
\rule{18em}{0.4pt} \\
\operatorname{ExecIRSigma}(\operatorname{LoopIR}(\mathsf{LoopConditional},\ \mathsf{IR}_{c},\ v_{c},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
```

**(ExecIR-Loop-Cond-Body-Ctrl)**

```math
\begin{array}{l}
\operatorname{ExecIRSigma}(\mathsf{IR}_{c},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{true}),\ \sigma_{1} )\quad \operatorname{ExecIRSigma}(\mathsf{IR}_{b},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} )\quad \kappa \ \in \ \{\operatorname{Return}(\_),\ \mathsf{Panic},\ \mathsf{Abort}\} \\
\rule{18em}{0.4pt} \\
\operatorname{ExecIRSigma}(\operatorname{LoopIR}(\mathsf{LoopConditional},\ \mathsf{IR}_{c},\ v_{c},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} )
\end{array}
```

```math
\mathsf{LoopIterIRJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{LoopIterExecIRSigma}(\mathsf{pat},\ \mathsf{IR}_{b},\ \mathsf{it},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\}
```

**(ExecIR-Loop-Iter)**

```math
\begin{array}{l}
\operatorname{ExecIRSigma}(\mathsf{IR}_{i},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{iter}}),\ \sigma_{1} )\quad \operatorname{IterInit}(v_{\mathsf{iter}})\ \Downarrow \ \mathsf{it}\quad \Gamma \ \vdash \ \operatorname{LoopIterExecIRSigma}(\mathsf{pat},\ \mathsf{IR}_{b},\ \mathsf{it},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\
\rule{18em}{0.4pt} \\
\operatorname{ExecIRSigma}(\operatorname{LoopIR}(\mathsf{LoopIter},\ \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{IR}_{i},\ v_{\mathsf{iter}},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
```

**(ExecIR-Loop-Iter-Ctrl)**

```math
\begin{array}{l}
\operatorname{ExecIRSigma}(\mathsf{IR}_{i},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\
\rule{18em}{0.4pt} \\
\operatorname{ExecIRSigma}(\operatorname{LoopIR}(\mathsf{LoopIter},\ \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{IR}_{i},\ v_{\mathsf{iter}},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
```

**(LoopIterIR-Done)**

```math
\begin{array}{l}
\operatorname{IterNext}(\mathsf{it})\ \Downarrow \ (\bot ,\ \mathsf{it}') \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LoopIterExecIRSigma}(\mathsf{pat},\ \mathsf{IR}_{b},\ \mathsf{it},\ \sigma )\ \Downarrow \ (\operatorname{Val}(()),\ \sigma )
\end{array}
```

**(LoopIterIR-Step-Val)**

```math
\begin{array}{l}
\operatorname{IterNext}(\mathsf{it})\ \Downarrow \ (v,\ \mathsf{it}')\quad \Gamma \ \vdash \ \operatorname{ExecBlockBindIRSigma}(\mathsf{pat},\ v,\ \mathsf{IR}_{b},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{b}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{LoopIterExecIRSigma}(\mathsf{pat},\ \mathsf{IR}_{b},\ \mathsf{it}',\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LoopIterExecIRSigma}(\mathsf{pat},\ \mathsf{IR}_{b},\ \mathsf{it},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
```

**(LoopIterIR-Step-Continue)**

```math
\begin{array}{l}
\operatorname{IterNext}(\mathsf{it})\ \Downarrow \ (v,\ \mathsf{it}')\quad \Gamma \ \vdash \ \operatorname{ExecBlockBindIRSigma}(\mathsf{pat},\ v,\ \mathsf{IR}_{b},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Continue}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{LoopIterExecIRSigma}(\mathsf{pat},\ \mathsf{IR}_{b},\ \mathsf{it}',\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LoopIterExecIRSigma}(\mathsf{pat},\ \mathsf{IR}_{b},\ \mathsf{it},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
```

**(LoopIterIR-Step-Break)**

```math
\begin{array}{l}
\operatorname{IterNext}(\mathsf{it})\ \Downarrow \ (v,\ \mathsf{it}')\quad \Gamma \ \vdash \ \operatorname{ExecBlockBindIRSigma}(\mathsf{pat},\ v,\ \mathsf{IR}_{b},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{Break}(v_{\mathsf{opt}})),\ \sigma_{1} )\quad v'\ =\ \operatorname{BreakVal}(v_{\mathsf{opt}}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LoopIterExecIRSigma}(\mathsf{pat},\ \mathsf{IR}_{b},\ \mathsf{it},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma_{1} )
\end{array}
```

**(LoopIterIR-Step-Ctrl)**

```math
\begin{array}{l}
\operatorname{IterNext}(\mathsf{it})\ \Downarrow \ (v,\ \mathsf{it}')\quad \Gamma \ \vdash \ \operatorname{ExecBlockBindIRSigma}(\mathsf{pat},\ v,\ \mathsf{IR}_{b},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )\quad \kappa \ \in \ \{\operatorname{Return}(\_),\ \mathsf{Panic},\ \mathsf{Abort}\} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LoopIterExecIRSigma}(\mathsf{pat},\ \mathsf{IR}_{b},\ \mathsf{it},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
```

**(ExecIR-Region)**

```math
\begin{array}{l}
\operatorname{RegionNew}(\sigma ,\ v_{o})\ \Downarrow \ (\sigma_{1} ,\ r,\ \mathsf{scope})\quad \operatorname{BindRegionAlias}(\sigma_{1} ,\ \mathsf{alias}_{\mathsf{opt}},\ r)\ \Downarrow \ \sigma_{2} \quad \Gamma \ \vdash \ \operatorname{ExecInScopeIRSigma}(\mathsf{IR}_{b},\ \sigma_{2} ,\ \mathsf{scope})\ \Downarrow \ (\mathsf{out},\ \sigma_{3} )\quad \operatorname{RegionRelease}(\sigma_{3} ,\ r,\ \mathsf{scope},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma_{4} ) \\
\rule{18em}{0.4pt} \\
\operatorname{ExecIRSigma}(\operatorname{RegionIR}(v_{o},\ \mathsf{alias}_{\mathsf{opt}},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma )\ \Downarrow \ (\operatorname{StmtOutOf}(\mathsf{out}'),\ \sigma_{4} )
\end{array}
```

**(ExecIR-Frame-Implicit)**

```math
\begin{array}{l}
\operatorname{ActiveTarget}(\sigma )\ =\ r\quad \operatorname{FrameEnter}(\sigma ,\ r)\ \Downarrow \ (\sigma_{1} ,\ F,\ \mathsf{scope},\ \mathsf{mark})\quad \Gamma \ \vdash \ \operatorname{ExecInScopeIRSigma}(\mathsf{IR}_{b},\ \sigma_{1} ,\ \mathsf{scope})\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )\quad \operatorname{FrameReset}(\sigma_{2} ,\ r,\ \mathsf{scope},\ \mathsf{mark},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma_{3} ) \\
\rule{18em}{0.4pt} \\
\operatorname{ExecIRSigma}(\operatorname{FrameIR}(\bot ,\ \mathsf{IR}_{b},\ v_{b}),\ \sigma )\ \Downarrow \ (\operatorname{StmtOutOf}(\mathsf{out}'),\ \sigma_{3} )
\end{array}
```

**(ExecIR-Frame-Explicit)**

```math
\begin{array}{l}
\operatorname{RegionHandleOf}(v_{r})\ =\ h\quad \operatorname{ResolveTarget}(\sigma ,\ h)\ =\ r_{t}\quad \operatorname{FrameEnter}(\sigma ,\ r_{t})\ \Downarrow \ (\sigma_{1} ,\ F,\ \mathsf{scope},\ \mathsf{mark})\quad \Gamma \ \vdash \ \operatorname{ExecInScopeIRSigma}(\mathsf{IR}_{b},\ \sigma_{1} ,\ \mathsf{scope})\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )\quad \operatorname{FrameReset}(\sigma_{2} ,\ r_{t},\ \mathsf{scope},\ \mathsf{mark},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma_{3} ) \\
\rule{18em}{0.4pt} \\
\operatorname{ExecIRSigma}(\operatorname{FrameIR}(v_{r},\ \mathsf{IR}_{b},\ v_{b}),\ \sigma )\ \Downarrow \ (\operatorname{StmtOutOf}(\mathsf{out}'),\ \sigma_{3} )
\end{array}
```

**(LowerList-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerList}([])\ \Downarrow \ \langle \varepsilon ,\ []\rangle 
\end{array}
```

**(LowerList-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle \quad \Gamma \ \vdash \ \operatorname{LowerList}(\mathsf{es})\ \Downarrow \ \langle \mathsf{IR}_{s},\ \mathsf{vec}_{v}\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerList}(e\mathbin{::} \mathsf{es})\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{e},\ \mathsf{IR}_{s}),\ [v]\ \mathbin{++} \ \mathsf{vec}_{v}\rangle 
\end{array}
```

**(LowerFieldInits-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerFieldInits}([])\ \Downarrow \ \langle \varepsilon ,\ []\rangle 
\end{array}
```

**(LowerFieldInits-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle \quad \Gamma \ \vdash \ \operatorname{LowerFieldInits}(\mathsf{fs})\ \Downarrow \ \langle \mathsf{IR}_{s},\ \mathsf{vec}_{f}\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerFieldInits}([\langle f,\ e\rangle ]\ \mathbin{++} \ \mathsf{fs})\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{e},\ \mathsf{IR}_{s}),\ [\langle f,\ v\rangle ]\ \mathbin{++} \ \mathsf{vec}_{f}\rangle 
\end{array}
```

**(LowerOpt-None)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerOpt}(\bot )\ \Downarrow \ \langle \varepsilon ,\ \bot \rangle 
\end{array}
```

**(LowerOpt-Some)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerOpt}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle 
\end{array}
```

```math
\begin{array}{l}
\mathsf{RefSyms}\ :\ \mathsf{IR}\ \to \ 𝒫(\mathsf{Symbol}) \\
\operatorname{RefSyms}([])\ =\ \emptyset  \\
\operatorname{RefSyms}([d]\ \mathbin{++} \ \mathsf{ds})\ =\ \operatorname{RefSyms}(d)\ \cup \ \operatorname{RefSyms}(\mathsf{ds}) \\
\operatorname{RefSyms}(\operatorname{ProcIR}(\_,\ \_,\ \_,\ \mathsf{IR}))\ =\ \operatorname{RefSyms}(\mathsf{IR}) \\
\operatorname{RefSyms}(\operatorname{GlobalConst}(\_,\ \_))\ =\ \emptyset  \\
\operatorname{RefSyms}(\operatorname{GlobalZero}(\_,\ \_))\ =\ \emptyset  \\
\operatorname{RefSyms}(\operatorname{GlobalVTable}(\_,\ \mathsf{header},\ \mathsf{slots}))\ =\ \{\ s\ \mid \ s\ \in \ \mathsf{header}\ \land \ s\ \in \ \mathsf{Symbol}\ \}\ \cup \ \{\ s\ \mid \ s\ \in \ \mathsf{slots}\ \land \ s\ \in \ \mathsf{Symbol}\ \} \\
\operatorname{RefSyms}(\operatorname{EmitVTable}(T,\ \mathsf{Cl}))\ =\ \operatorname{RefSyms}(d)\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{EmitVTable}(T,\ \mathsf{Cl})\ \Downarrow \ d \\
\operatorname{RefSyms}(\operatorname{EmitDropGlue}(T))\ =\ \operatorname{RefSyms}(\mathsf{IR})\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{DropGlueIR}(T)\ \Downarrow \ \mathsf{IR} \\
\operatorname{RefSyms}(\operatorname{EmitLiteralData}(\_,\ \_))\ =\ \emptyset  \\
\operatorname{RefSyms}(\varepsilon )\ =\ \emptyset  \\
\operatorname{RefSyms}(\operatorname{SeqIR}(\mathsf{IR}_{1},\ \mathsf{IR}_{2}))\ =\ \operatorname{RefSyms}(\mathsf{IR}_{1})\ \cup \ \operatorname{RefSyms}(\mathsf{IR}_{2}) \\
\operatorname{RefSyms}(\operatorname{ReadVarIR}(\_))\ =\ \emptyset  \\
\operatorname{RefSyms}(\operatorname{StoreVarIR}(\_,\ \_))\ =\ \emptyset  \\
\operatorname{RefSyms}(\operatorname{StoreVarNoDropIR}(\_,\ \_))\ =\ \emptyset  \\
\operatorname{RefSyms}(\operatorname{BindVarIR}(\_,\ \_))\ =\ \emptyset  \\
\operatorname{RefSyms}(\operatorname{ReadPtrIR}(\_))\ =\ \emptyset  \\
\operatorname{RefSyms}(\operatorname{WritePtrIR}(\_,\ \_))\ =\ \emptyset  \\
\operatorname{RefSyms}(\operatorname{AllocIR}(\_,\ \_))\ =\ \emptyset  \\
\operatorname{RefSyms}(\operatorname{MoveStateIR}(\_))\ =\ \emptyset  \\
\operatorname{RefSyms}(\operatorname{ReturnIR}(\_))\ =\ \emptyset  \\
\operatorname{RefSyms}(\operatorname{TailValueIR}(\_))\ =\ \emptyset  \\
\operatorname{RefSyms}(\operatorname{BreakIR}(\_))\ =\ \emptyset  \\
\operatorname{RefSyms}(\mathsf{ContinueIR})\ =\ \emptyset  \\
\operatorname{RefSyms}(\operatorname{DeferIR}(\_))\ =\ \emptyset  \\
\operatorname{RefSyms}(\operatorname{ReadPathIR}(\mathsf{path},\ \mathsf{name}))\ =\ \{\operatorname{PathSym}(\mathsf{path},\ \mathsf{name})\}\ \cup \ \{\ \mathsf{sym}\ \mid \ \operatorname{StaticSymPath}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{sym}\ \} \\
\operatorname{RefSyms}(\operatorname{StoreGlobal}(\mathsf{sym},\ \_))\ =\ \{\mathsf{sym}\} \\
\operatorname{RefSyms}(\operatorname{CallIR}(\mathsf{callee},\ \_))\ =\ \{\ \mathsf{callee}\ \mid \ \mathsf{callee}\ \in \ \mathsf{Symbol}\ \} \\
\operatorname{RefSyms}(\operatorname{IfIR}(\_,\ \mathsf{IR}_{t},\ \_,\ \mathsf{IR}_{f},\ \_))\ =\ \operatorname{RefSyms}(\mathsf{IR}_{t})\ \cup \ \operatorname{RefSyms}(\mathsf{IR}_{f}) \\
\operatorname{RefSyms}(\operatorname{BlockIR}(\mathsf{IR}_{s},\ \mathsf{IR}_{t},\ \_))\ =\ \operatorname{RefSyms}(\mathsf{IR}_{s})\ \cup \ \operatorname{RefSyms}(\mathsf{IR}_{t}) \\
\operatorname{RefSyms}(\operatorname{IfCaseIR}(\_,\ \_,\ \_))\ =\ \emptyset  \\
\operatorname{RefSyms}(\operatorname{LoopIR}(\mathsf{LoopInfinite},\ \mathsf{IR}_{b},\ \_))\ =\ \operatorname{RefSyms}(\mathsf{IR}_{b}) \\
\operatorname{RefSyms}(\operatorname{LoopIR}(\mathsf{LoopConditional},\ \mathsf{IR}_{c},\ \_,\ \mathsf{IR}_{b},\ \_))\ =\ \operatorname{RefSyms}(\mathsf{IR}_{c})\ \cup \ \operatorname{RefSyms}(\mathsf{IR}_{b}) \\
\operatorname{RefSyms}(\operatorname{LoopIR}(\mathsf{LoopIter},\ \_,\ \_,\ \mathsf{IR}_{i},\ \_,\ \mathsf{IR}_{b},\ \_))\ =\ \operatorname{RefSyms}(\mathsf{IR}_{i})\ \cup \ \operatorname{RefSyms}(\mathsf{IR}_{b}) \\
\operatorname{RefSyms}(\operatorname{RegionIR}(\_,\ \_,\ \mathsf{IR}_{b},\ \_))\ =\ \operatorname{RefSyms}(\mathsf{IR}_{b}) \\
\operatorname{RefSyms}(\operatorname{FrameIR}(\_,\ \mathsf{IR}_{b},\ \_))\ =\ \operatorname{RefSyms}(\mathsf{IR}_{b}) \\
\operatorname{RefSyms}(\operatorname{BranchIR}(\_))\ =\ \emptyset  \\
\operatorname{RefSyms}(\operatorname{BranchIR}(\_,\ \_,\ \_))\ =\ \emptyset  \\
\operatorname{RefSyms}(\operatorname{PhiIR}(\_,\ \_,\ \_))\ =\ \emptyset  \\
\operatorname{RefSyms}(\operatorname{CallVTable}(\_,\ \_,\ \_))\ =\ \emptyset  \\
\operatorname{RefSyms}(\operatorname{AddrOfIR}(p))\ =\ \operatorname{RefSyms}(\mathsf{IR}_{p})\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{LowerAddrOf}(p)\ \Downarrow \ \langle \mathsf{IR}_{p},\ \mathsf{addr}\rangle  \\
\operatorname{RefSyms}(\mathsf{ClearPanic})\ =\ \operatorname{RefSyms}(\mathsf{IR})\ \Leftrightarrow \ \Gamma \ \vdash \ \mathsf{ClearPanic}\ \Downarrow \ \mathsf{IR} \\
\operatorname{RefSyms}(\mathsf{PanicCheck})\ =\ \operatorname{RefSyms}(\mathsf{IR})\ \Leftrightarrow \ \Gamma \ \vdash \ \mathsf{PanicCheck}\ \Downarrow \ \mathsf{IR} \\
\operatorname{RefSyms}(\operatorname{CheckPoison}(m))\ =\ \operatorname{RefSyms}(\mathsf{IR})\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{CheckPoison}(m)\ \Downarrow \ \mathsf{IR} \\
\operatorname{RefSyms}(\operatorname{LowerPanic}(r))\ =\ \operatorname{RefSyms}(\mathsf{IR})\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{LowerPanic}(r)\ \Downarrow \ \mathsf{IR}
\end{array}
```

```math
\begin{array}{l}
\operatorname{RuntimeRefs}(\mathsf{IR})\ =\ \operatorname{RefSyms}(\mathsf{IR})\ \cap \ \mathsf{RuntimeSyms} \\
\operatorname{LiteralRef}(\mathsf{IR},\ \mathsf{kind},\ \mathsf{bytes})\ \Leftrightarrow \ \operatorname{LiteralDataSym}(\mathsf{kind},\ \mathsf{bytes})\ \in \ \operatorname{RefSyms}(\mathsf{IR}) \\
\operatorname{LiteralRefs}(\mathsf{IR})\ =\ \{\langle \mathsf{kind},\ \mathsf{bytes}\rangle \ \mid \ \operatorname{LiteralRef}(\mathsf{IR},\ \mathsf{kind},\ \mathsf{bytes})\} \\
\operatorname{VTableRefs}(\mathsf{IR})\ =\ \{(T,\ \mathsf{Cl})\ \mid \ \operatorname{DynPack}(T,\ \_)\ \in \ \mathsf{IR}\ \lor \ \operatorname{CallVTable}(\_,\ \_,\ \_)\ \in \ \mathsf{IR}\}
\end{array}
```

```math
\operatorname{ExpandIR}(\mathsf{IR})\ =\ \mathsf{IR}\ \mathbin{++} \ ((\mathbin{++} \_\{(T,\ \mathsf{Cl})\ \in \ \operatorname{VTableRefs}(\mathsf{IR})\}\ [\operatorname{EmitDropGlue}(T),\ \operatorname{EmitVTable}(T,\ \mathsf{Cl})]))\ \mathbin{++} \ ((\mathbin{++} \_\{\langle \mathsf{kind},\ \mathsf{bytes}\rangle \ \in \ \operatorname{LiteralRefs}(\mathsf{IR})\}\ [\operatorname{EmitLiteralData}(\mathsf{kind},\ \mathsf{bytes})]))
```

```math
\begin{array}{l}
\operatorname{EmitKey}(d)\ = \\
\ \langle \texttt{vtable},\ T,\ \mathsf{Cl}\rangle \quad \mathsf{if}\ d\ =\ \operatorname{EmitVTable}(T,\ \mathsf{Cl}) \\
\ \langle \texttt{drop},\ T\rangle \quad \mathsf{if}\ d\ =\ \operatorname{EmitDropGlue}(T) \\
\ \langle \texttt{lit},\ \mathsf{kind},\ \mathsf{bytes}\rangle \ \mathsf{if}\ d\ =\ \operatorname{EmitLiteralData}(\mathsf{kind},\ \mathsf{bytes}) \\
\ \bot \quad \mathsf{otherwise}
\end{array}
```

```math
\begin{array}{l}
\operatorname{EmitKeys}(\mathsf{IR})\ =\ [\operatorname{EmitKey}(d)\ \mid \ d\ \in \ \mathsf{IR}\ \land \ \operatorname{EmitKey}(d)\ \ne \ \bot ] \\
\operatorname{UniqueEmits}(\mathsf{IR})\ \Leftrightarrow \ \operatorname{NoDup}(\operatorname{EmitKeys}(\mathsf{IR}))
\end{array}
```

#### 24.1.4 Project and Module Composition

```math
\operatorname{Items}(P,\ m)\ =\ \operatorname{ASTModule}(P,\ m).\mathsf{items}
```

**(CG-Project)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{OutputPipeline}(P)\ \Downarrow \ (\mathsf{Objs},\ \mathsf{IRs},\ \mathsf{Artifact}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CodegenProject}(P)\ \Downarrow \ (\operatorname{Set}(\mathsf{Objs})\ \cup \ \operatorname{Set}(\mathsf{IRs})\ \cup \ (\{\mathsf{Artifact}\}\ \mathsf{if}\ \mathsf{Artifact}\ \ne \ \bot \ \mathsf{else}\ \emptyset ))
\end{array}
```

Feature-local `CodegenItem` rules are defined by the owning feature sections. This section introduces no additional item-specific lowering rules.

**(CG-Module)**

```math
\begin{array}{l}
\operatorname{Items}(\operatorname{Project}(\Gamma ),\ m)\ =\ [i_{1},\ \ldots ,\ i_{k}]\quad \forall \ j,\ \Gamma \ \vdash \ \operatorname{CodegenItem}(i_{j})\ \Downarrow \ \mathsf{ds}_{j}\quad \Gamma \ \vdash \ \operatorname{InitFn}(m)\ \Downarrow \ \mathsf{sym}_{\mathsf{init}}\quad \Gamma \ \vdash \ \operatorname{DeinitFn}(m)\ \Downarrow \ \mathsf{sym}_{\mathsf{deinit}}\quad \Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticInit}(m)\ \Downarrow \ \mathsf{IR}_{\mathsf{init}}\quad \Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinit}(m)\ \Downarrow \ \mathsf{IR}_{\mathsf{deinit}} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CodegenModule}(m)\ \Downarrow \ \mathsf{ds}_{1}\ \mathbin{++} \ \ldots \ \mathbin{++} \ \mathsf{ds}_{k}\ \mathbin{++} \ [\operatorname{ProcIR}(\mathsf{sym}_{\mathsf{init}},\ [\mathsf{PanicOutParam}],\ \operatorname{TypePrim}(\texttt{"()"}),\ \mathsf{IR}_{\mathsf{init}}),\ \operatorname{ProcIR}(\mathsf{sym}_{\mathsf{deinit}},\ [\mathsf{PanicOutParam}],\ \operatorname{TypePrim}(\texttt{"()"}),\ \mathsf{IR}_{\mathsf{deinit}})]
\end{array}
```

**(CG-Expr)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CodegenExpr}(e)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle 
\end{array}
```

**(CG-Stmt)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerStmt}(s)\ \Downarrow \ \mathsf{IR} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CodegenStmt}(s)\ \Downarrow \ \mathsf{IR}
\end{array}
```

**(CG-Block)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerBlock}(b)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CodegenBlock}(b)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle 
\end{array}
```

**(CG-Place)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerPlace}(p)\ \Downarrow \ l \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CodegenPlace}(p)\ \Downarrow \ l
\end{array}
```

**(LowerIR-Module)**

```math
\begin{array}{l}
\mathsf{IR}'\ =\ \operatorname{ExpandIR}(\mathsf{IR})\quad \mathsf{IR}'\ =\ [d_{1},\ \ldots ,\ d_{k}]\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{LowerIRDecl}(d_{i})\ \Downarrow \ \mathsf{ll}_{i}\quad \operatorname{RuntimeDecls}(\operatorname{RuntimeRefs}(\mathsf{IR}'))\ =\ \mathsf{ds}\quad \operatorname{RuntimeDeclsOk}(\mathsf{ds})\quad \mathsf{LLVMIR}\ =\ \mathsf{LLVMHeader}\ \mathbin{++} \ \mathsf{ds}\ \mathbin{++} \ \mathsf{ll}_{1}\ \mathbin{++} \ \ldots \ \mathbin{++} \ \mathsf{ll}_{k}\quad \operatorname{LLVMUBSafe}(\mathsf{LLVMIR})\quad \operatorname{RuntimeDeclsCover}(\mathsf{LLVMIR},\ \mathsf{IR}')\quad \operatorname{UniqueEmits}(\mathsf{IR}') \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIR}(\mathsf{IR})\ \Downarrow \ \mathsf{LLVMIR}
\end{array}
```

**(LowerIR-Err)**

```math
\begin{array}{l}
\exists \ i,\ \Gamma \ \vdash \ \operatorname{LowerIRDecl}(d_{i})\ \Uparrow  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIR}(\mathsf{IR})\ \Uparrow 
\end{array}
```

**(EmitLLVM-Ok)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTool}(\texttt{llvm-as})\ \Downarrow \ a\quad \operatorname{RenderLLVM}(\mathsf{LLVMIR},\ a)\ =\ \mathsf{bytes} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EmitLLVM}(\mathsf{LLVMIR})\ \Downarrow \ \mathsf{bytes}
\end{array}
```

```math
\begin{array}{l}
\mathsf{LLVMText}_{21}\ =\ \{\ \mathsf{bytes}\ \mid \ \texttt{llvm-as}\_21\ \mathsf{accepts}\ \mathsf{bytes}\ \} \\
\operatorname{RenderLLVM}(\mathsf{LLVMIR},\ a)\ =\ \mathsf{bytes}\ \Rightarrow \ \mathsf{bytes}\ \in \ \mathsf{LLVMText}_{21}
\end{array}
```

**(EmitLLVM-Err)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveTool}(\texttt{llvm-as})\ \Downarrow \ a\quad \operatorname{RenderLLVM}(\mathsf{LLVMIR},\ a)\ \Uparrow  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EmitLLVM}(\mathsf{LLVMIR})\ \Uparrow 
\end{array}
```

LLVMText_21 and LLVMObj_21 are defined by LLVM 21.1.8 tool acceptance for textual IR and object emission respectively.
Failure to resolve `llvm-as` is owned by §3.7 `ResolveTool-Err-IR` and the enclosing output rule; it MUST NOT be classified as `EmitLLVM-Err`.

**(EmitObj-Ok)**

```math
\begin{array}{l}
\operatorname{LLVMEmitObj_21}(\mathsf{LLVMIR})\ =\ \mathsf{bytes} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EmitObj}(\mathsf{LLVMIR})\ \Downarrow \ \mathsf{bytes}
\end{array}
```

```math
\operatorname{LLVMEmitObj_21}(\mathsf{LLVMIR})\ =\ \mathsf{bytes}\ \Leftrightarrow \ \operatorname{LLVMObj_21}(\mathsf{LLVMIR},\ \mathsf{LLVMHeader})\ =\ \mathsf{bytes}
```

**(EmitObj-Err)**

```math
\begin{array}{l}
\operatorname{LLVMEmitObj_21}(\mathsf{LLVMIR})\ \Uparrow  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EmitObj}(\mathsf{LLVMIR})\ \Uparrow 
\end{array}
```

### 24.2 Layout and ABI Framework

#### 24.2.1 Primitive Layout and Encoding

PtrSize = 8
PointerSize = PtrSize
PtrAlign = 8

```math
\begin{array}{l}
\operatorname{PrimSize}(\texttt{"i8"})\ =\ 1 \\
\operatorname{PrimSize}(\texttt{"i16"})\ =\ 2 \\
\operatorname{PrimSize}(\texttt{"i32"})\ =\ 4 \\
\operatorname{PrimSize}(\texttt{"i64"})\ =\ 8 \\
\operatorname{PrimSize}(\texttt{"i128"})\ =\ 16 \\
\operatorname{PrimSize}(\texttt{"u8"})\ =\ 1 \\
\operatorname{PrimSize}(\texttt{"u16"})\ =\ 2 \\
\operatorname{PrimSize}(\texttt{"u32"})\ =\ 4 \\
\operatorname{PrimSize}(\texttt{"u64"})\ =\ 8 \\
\operatorname{PrimSize}(\texttt{"u128"})\ =\ 16 \\
\operatorname{PrimSize}(\texttt{"f16"})\ =\ 2 \\
\operatorname{PrimSize}(\texttt{"f32"})\ =\ 4 \\
\operatorname{PrimSize}(\texttt{"f64"})\ =\ 8 \\
\operatorname{PrimSize}(\texttt{"bool"})\ =\ 1 \\
\operatorname{PrimSize}(\texttt{"char"})\ =\ 4 \\
\operatorname{PrimSize}(\texttt{"usize"})\ =\ \mathsf{PtrSize} \\
\operatorname{PrimSize}(\texttt{"isize"})\ =\ \mathsf{PtrSize} \\
\operatorname{PrimSize}(\texttt{"()"})\ =\ 0 \\
\operatorname{PrimSize}(\texttt{"!"})\ =\ 0
\end{array}
```

```math
\begin{array}{l}
\operatorname{PrimAlign}(\texttt{"i8"})\ =\ 1 \\
\operatorname{PrimAlign}(\texttt{"i16"})\ =\ 2 \\
\operatorname{PrimAlign}(\texttt{"i32"})\ =\ 4 \\
\operatorname{PrimAlign}(\texttt{"i64"})\ =\ 8 \\
\operatorname{PrimAlign}(\texttt{"i128"})\ =\ 16 \\
\operatorname{PrimAlign}(\texttt{"u8"})\ =\ 1 \\
\operatorname{PrimAlign}(\texttt{"u16"})\ =\ 2 \\
\operatorname{PrimAlign}(\texttt{"u32"})\ =\ 4 \\
\operatorname{PrimAlign}(\texttt{"u64"})\ =\ 8 \\
\operatorname{PrimAlign}(\texttt{"u128"})\ =\ 16 \\
\operatorname{PrimAlign}(\texttt{"f16"})\ =\ 2 \\
\operatorname{PrimAlign}(\texttt{"f32"})\ =\ 4 \\
\operatorname{PrimAlign}(\texttt{"f64"})\ =\ 8 \\
\operatorname{PrimAlign}(\texttt{"bool"})\ =\ 1 \\
\operatorname{PrimAlign}(\texttt{"char"})\ =\ 4 \\
\operatorname{PrimAlign}(\texttt{"usize"})\ =\ \mathsf{PtrAlign} \\
\operatorname{PrimAlign}(\texttt{"isize"})\ =\ \mathsf{PtrAlign} \\
\operatorname{PrimAlign}(\texttt{"()"})\ =\ 1 \\
\operatorname{PrimAlign}(\texttt{"!"})\ =\ 1
\end{array}
```

```math
\mathsf{LayoutJudg}\ =\ \{\mathsf{sizeof},\ \mathsf{alignof},\ \mathsf{layout}\}
```

**(Size-Prim)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePrim}(\mathsf{name})\quad \operatorname{PrimSize}(\mathsf{name})\ =\ n \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ n
\end{array}
```

**(Align-Prim)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePrim}(\mathsf{name})\quad \operatorname{PrimAlign}(\mathsf{name})\ =\ a \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ a
\end{array}
```

**(Layout-Prim)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePrim}(\mathsf{name})\quad \operatorname{PrimSize}(\mathsf{name})\ =\ n\quad \operatorname{PrimAlign}(\mathsf{name})\ =\ a \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \langle n,\ a\rangle 
\end{array}
```

```math
\begin{array}{l}
\operatorname{LEBytes}(v,\ n)\ =\ \operatorname{LE}(v\ \mathsf{mod}\ 2^\{8n\},\ n) \\
\operatorname{FloatBits_t}(v)\ =\ \operatorname{IEEE754Bits}(t,\ v) \\
\mathsf{EncodeConstJudg}\ =\ \{\mathsf{EncodeConst}\} \\
\operatorname{BoolByte}(\mathsf{false})\ =\ 0\mathsf{x00} \\
\operatorname{BoolByte}(\mathsf{true})\ =\ 0\mathsf{x01}
\end{array}
```

**(Encode-Bool)**

```math
\begin{array}{l}
\operatorname{LiteralValue}(\mathsf{lit},\ \operatorname{TypePrim}(\texttt{"bool"}))\ =\ b \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EncodeConst}(\operatorname{TypePrim}(\texttt{"bool"}),\ \mathsf{lit})\ \Downarrow \ \operatorname{LEBytes}(\operatorname{BoolByte}(b),\ 1)
\end{array}
```

**(Encode-Char)**

```math
\begin{array}{l}
\operatorname{LiteralValue}(\mathsf{lit},\ \operatorname{TypePrim}(\texttt{"char"}))\ =\ c \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EncodeConst}(\operatorname{TypePrim}(\texttt{"char"}),\ \mathsf{lit})\ \Downarrow \ \operatorname{LEBytes}(c,\ 4)
\end{array}
```

**(Encode-Int)**

```math
\begin{array}{l}
\mathsf{lit}.\mathsf{kind}\ =\ \mathsf{IntLiteral}\quad T\ =\ \operatorname{TypePrim}(t)\quad t\ \in \ \mathsf{IntTypes}\quad v\ =\ \operatorname{LiteralValue}(\mathsf{lit},\ T)\quad x\ =\ \operatorname{IntValValue}(v) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EncodeConst}(T,\ \mathsf{lit})\ \Downarrow \ \operatorname{LEBytes}(x,\ \operatorname{sizeof}(T))
\end{array}
```

**(Encode-Float)**

```math
\begin{array}{l}
\mathsf{lit}.\mathsf{kind}\ =\ \mathsf{FloatLiteral}\quad T\ =\ \operatorname{TypePrim}(t)\quad t\ \in \ \mathsf{FloatTypes}\quad v\ =\ \operatorname{LiteralValue}(\mathsf{lit},\ T)\quad x\ =\ \operatorname{FloatValValue}(v) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EncodeConst}(T,\ \mathsf{lit})\ \Downarrow \ \operatorname{LEBytes}(\operatorname{FloatBits_t}(x),\ \operatorname{sizeof}(T))
\end{array}
```

**(Encode-Unit)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePrim}(\texttt{"()"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EncodeConst}(T,\ \mathsf{lit})\ \Downarrow \ []
\end{array}
```

**(Encode-Never)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePrim}(\texttt{"!"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EncodeConst}(T,\ \mathsf{lit})\ \Downarrow \ []
\end{array}
```

**(Encode-RawPtr-Null)**

```math
\begin{array}{l}
\mathsf{lit}.\mathsf{kind}\ =\ \mathsf{NullLiteral}\quad T\ =\ \operatorname{TypeRawPtr}(q,\ U) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EncodeConst}(T,\ \mathsf{lit})\ \Downarrow \ \operatorname{LEBytes}(0,\ \operatorname{sizeof}(T))
\end{array}
```

```math
\mathsf{ValidValueJudg}\ =\ \{\mathsf{ValidValue}\}
```

**(Valid-Bool)**

```math
\operatorname{ValidValue}(\operatorname{TypePrim}(\texttt{"bool"}),\ \mathsf{bits})\ \Leftrightarrow \ \mathsf{bits}\ \in \ \{[0\mathsf{x00}],\ [0\mathsf{x01}]\}
```

**(Valid-Char)**

```math
\operatorname{ValidValue}(\operatorname{TypePrim}(\texttt{"char"}),\ \mathsf{bits})\ \Leftrightarrow \ \exists \ c.\ \operatorname{LEBytes}(c,\ 4)\ =\ \mathsf{bits}\ \land \ c\ \in \ \mathsf{UnicodeScalar}
```

**(Valid-Scalar)**

```math
\begin{array}{l}
\mathsf{ScalarTypes}\ =\ \{\texttt{"i8"},\ \texttt{"i16"},\ \texttt{"i32"},\ \texttt{"i64"},\ \texttt{"i128"},\ \texttt{"u8"},\ \texttt{"u16"},\ \texttt{"u32"},\ \texttt{"u64"},\ \texttt{"u128"},\ \texttt{"f16"},\ \texttt{"f32"},\ \texttt{"f64"},\ \texttt{"usize"},\ \texttt{"isize"}\} \\
\forall \ t\ \in \ \mathsf{ScalarTypes}.\ \operatorname{ValidValue}(\operatorname{TypePrim}(t),\ \mathsf{bits})\ \Leftrightarrow \ \mid \mathsf{bits}\mid \ =\ \operatorname{PrimSize}(t)
\end{array}
```

**(Valid-Unit)**

```math
\operatorname{ValidValue}(\operatorname{TypePrim}(\texttt{"()"}),\ \mathsf{bits})\ \Leftrightarrow \ \mathsf{bits}\ =\ []
```

**(Valid-Never)**

```math
\operatorname{ValidValue}(\operatorname{TypePrim}(\texttt{"!"}),\ \mathsf{bits})\ \Leftrightarrow \ \mathsf{false}
```

```math
\begin{array}{l}
\operatorname{ValidValue}(T,\ \mathsf{bits})\ \Leftrightarrow \ T\ \notin \ \{\operatorname{TypePrim}(\_),\ \operatorname{TypePtr}(\_,\ \_),\ \operatorname{TypeRawPtr}(\_,\ \_)\}\ \land \ \exists \ v.\ \operatorname{ValueBits}(T,\ v)\ =\ \mathsf{bits} \\
\operatorname{ValueBits}(T,\ v)\ =\ \mathsf{bits}\ \Rightarrow \ \operatorname{ValidValue}(T,\ \mathsf{bits})
\end{array}
```

#### 24.2.2 Permission, Pointer, and Function Layout

**(Layout-Perm)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ L \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{layout}(\operatorname{TypePerm}(p,\ T))\ \Downarrow \ L
\end{array}
```

**(Size-Perm)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ n \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypePerm}(p,\ T))\ =\ n
\end{array}
```

**(Align-Perm)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ a \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypePerm}(p,\ T))\ =\ a
\end{array}
```

```math
\operatorname{ValueBits}(\operatorname{TypePerm}(p,\ T),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ \operatorname{ValueBits}(T,\ v)\ =\ \mathsf{bits}
```

**(Size-Ptr)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePtr}(T_{0},\ s) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ \mathsf{PtrSize}
\end{array}
```

**(Align-Ptr)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePtr}(T_{0},\ s) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{PtrAlign}
\end{array}
```

**(Layout-Ptr)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePtr}(T_{0},\ s) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \langle \mathsf{PtrSize},\ \mathsf{PtrAlign}\rangle 
\end{array}
```

**(Size-RawPtr)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeRawPtr}(q,\ T_{0}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ \mathsf{PtrSize}
\end{array}
```

**(Align-RawPtr)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeRawPtr}(q,\ T_{0}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{PtrAlign}
\end{array}
```

**(Layout-RawPtr)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeRawPtr}(q,\ T_{0}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \langle \mathsf{PtrSize},\ \mathsf{PtrAlign}\rangle 
\end{array}
```

**(Size-Func)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeFunc}(\mathsf{params},\ R) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ \mathsf{PtrSize}
\end{array}
```

**(Align-Func)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeFunc}(\mathsf{params},\ R) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{PtrAlign}
\end{array}
```

**(Layout-Func)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeFunc}(\mathsf{params},\ R) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \langle \mathsf{PtrSize},\ \mathsf{PtrAlign}\rangle 
\end{array}
```

#### 24.2.3 Default Calling Convention

CallConvDefault = `C`

```math
\mathsf{CallingConvention}\ =\ \{\ \texttt{C},\ \texttt{C-unwind},\ \texttt{system},\ \texttt{stdcall},\ \texttt{fastcall},\ \texttt{vectorcall}\ \}
```

```math
\begin{array}{l}
\operatorname{ObjFormatOf}(\texttt{x86\_64-sysv})\ =\ \texttt{"ELF"} \\
\operatorname{ObjFormatOf}(\texttt{x86\_64-win64})\ =\ \texttt{"COFF"} \\
\operatorname{ObjFormatOf}(\texttt{aarch64-aapcs64})\ =\ \texttt{"ELF"}
\end{array}
```

```math
\begin{array}{l}
\operatorname{ObjExt}(\texttt{x86\_64-sysv})\ =\ \texttt{".o"} \\
\operatorname{ObjExt}(\texttt{x86\_64-win64})\ =\ \texttt{".obj"} \\
\operatorname{ObjExt}(\texttt{aarch64-aapcs64})\ =\ \texttt{".o"}
\end{array}
```

```math
\begin{array}{l}
\operatorname{ExeSuffix}(\texttt{x86\_64-sysv})\ =\ \texttt{""} \\
\operatorname{ExeSuffix}(\texttt{x86\_64-win64})\ =\ \texttt{".exe"} \\
\operatorname{ExeSuffix}(\texttt{aarch64-aapcs64})\ =\ \texttt{""}
\end{array}
```

```math
\begin{array}{l}
\operatorname{LibraryPrefix}(\texttt{x86\_64-sysv})\ =\ \texttt{"lib"} \\
\operatorname{LibraryPrefix}(\texttt{x86\_64-win64})\ =\ \texttt{""} \\
\operatorname{LibraryPrefix}(\texttt{aarch64-aapcs64})\ =\ \texttt{"lib"}
\end{array}
```

```math
\begin{array}{l}
\operatorname{SharedLibSuffix}(\texttt{x86\_64-sysv})\ =\ \texttt{".so"} \\
\operatorname{SharedLibSuffix}(\texttt{x86\_64-win64})\ =\ \texttt{".dll"} \\
\operatorname{SharedLibSuffix}(\texttt{aarch64-aapcs64})\ =\ \texttt{".so"}
\end{array}
```

```math
\begin{array}{l}
\operatorname{StaticLibSuffix}(\texttt{x86\_64-sysv})\ =\ \texttt{".a"} \\
\operatorname{StaticLibSuffix}(\texttt{x86\_64-win64})\ =\ \texttt{".lib"} \\
\operatorname{StaticLibSuffix}(\texttt{aarch64-aapcs64})\ =\ \texttt{".a"}
\end{array}
```

```math
\begin{array}{l}
\operatorname{ImportLibSuffix}(\texttt{x86\_64-sysv})\ =\ \texttt{".so.import"} \\
\operatorname{ImportLibSuffix}(\texttt{x86\_64-win64})\ =\ \texttt{".lib"} \\
\operatorname{ImportLibSuffix}(\texttt{aarch64-aapcs64})\ =\ \texttt{".so.import"}
\end{array}
```

```math
\begin{array}{l}
\operatorname{EmitsImportLib}(\texttt{x86\_64-sysv})\ \Leftrightarrow \ \mathsf{false} \\
\operatorname{EmitsImportLib}(\texttt{x86\_64-win64})\ \Leftrightarrow \ \mathsf{true} \\
\operatorname{EmitsImportLib}(\texttt{aarch64-aapcs64})\ \Leftrightarrow \ \mathsf{false}
\end{array}
```

```math
\begin{array}{l}
\operatorname{RuntimeLibNameFor}(\texttt{x86\_64-sysv})\ =\ \texttt{"UltravioletRT.a"} \\
\operatorname{RuntimeLibNameFor}(\texttt{x86\_64-win64})\ =\ \texttt{"UltravioletRT.lib"} \\
\operatorname{RuntimeLibNameFor}(\texttt{aarch64-aapcs64})\ =\ \texttt{"UltravioletRT.a"}
\end{array}
```

```math
\begin{array}{l}
\operatorname{LinkerToolName}(\texttt{x86\_64-sysv})\ =\ \texttt{ld.lld} \\
\operatorname{LinkerToolName}(\texttt{x86\_64-win64})\ =\ \texttt{lld-link} \\
\operatorname{LinkerToolName}(\texttt{aarch64-aapcs64})\ =\ \texttt{ld.lld}
\end{array}
```

```math
\operatorname{LibraryEntrySym}(\texttt{x86\_64-win64})\ =\ \texttt{"\_\_ultraviolet\_library\_entry"}
```

```math
\begin{array}{l}
\operatorname{ArchiverToolName}(\texttt{x86\_64-sysv})\ =\ \texttt{llvm-ar} \\
\operatorname{ArchiverToolName}(\texttt{x86\_64-win64})\ =\ \texttt{llvm-lib} \\
\operatorname{ArchiverToolName}(\texttt{aarch64-aapcs64})\ =\ \texttt{llvm-ar}
\end{array}
```

```math
\begin{array}{l}
\operatorname{LinkFlagsFor}(\texttt{x86\_64-sysv},\ \texttt{exe},\ \mathsf{out},\ \_)\ =\ [\texttt{"-o"},\ \mathsf{out},\ \texttt{"--entry=\_start"},\ \texttt{"--nostdlib"},\ \texttt{"--dynamic-linker=/lib64/ld-linux-x86-64.so.2"}] \\
\operatorname{LinkFlagsFor}(\texttt{x86\_64-sysv},\ \texttt{shared},\ \mathsf{out},\ \_)\ =\ [\texttt{"-o"},\ \mathsf{out},\ \texttt{"--shared"},\ \texttt{"--nostdlib"}] \\
\operatorname{LinkFlagsFor}(\texttt{x86\_64-win64},\ \texttt{exe},\ \mathsf{out},\ \_)\ =\ [\texttt{"/OUT:"}\ \mathbin{++} \ \mathsf{out},\ \texttt{"/ENTRY:main"},\ \texttt{"/SUBSYSTEM:CONSOLE"},\ \texttt{"/NODEFAULTLIB"}] \\
\operatorname{LinkFlagsFor}(\texttt{x86\_64-win64},\ \texttt{shared},\ \mathsf{out},\ \mathsf{import}_{\mathsf{lib}})\ =\ [\texttt{"/OUT:"}\ \mathbin{++} \ \mathsf{out},\ \texttt{"/DLL"},\ \texttt{"/ENTRY:"}\ \mathbin{++} \ \operatorname{LibraryEntrySym}(\texttt{x86\_64-win64}),\ \texttt{"/NODEFAULTLIB"},\ \texttt{"/IMPLIB:"}\ \mathbin{++} \ \mathsf{import}_{\mathsf{lib}}] \\
\operatorname{LinkFlagsFor}(\texttt{aarch64-aapcs64},\ \texttt{exe},\ \mathsf{out},\ \_)\ =\ [\texttt{"-o"},\ \mathsf{out},\ \texttt{"--entry=main"},\ \texttt{"--nostdlib"},\ \texttt{"--dynamic-linker=/lib/ld-linux-aarch64.so.1"}] \\
\operatorname{LinkFlagsFor}(\texttt{aarch64-aapcs64},\ \texttt{shared},\ \mathsf{out},\ \_)\ =\ [\texttt{"-o"},\ \mathsf{out},\ \texttt{"--shared"},\ \texttt{"--nostdlib"}]
\end{array}
```

```math
\begin{array}{l}
\operatorname{ArchiveFlagsFor}(\texttt{x86\_64-sysv},\ \mathsf{out})\ =\ [\texttt{"rcs"},\ \mathsf{out}] \\
\operatorname{ArchiveFlagsFor}(\texttt{x86\_64-win64},\ \mathsf{out})\ =\ [\texttt{"/OUT:"}\ \mathbin{++} \ \mathsf{out}] \\
\operatorname{ArchiveFlagsFor}(\texttt{aarch64-aapcs64},\ \mathsf{out})\ =\ [\texttt{"rcs"},\ \mathsf{out}]
\end{array}
```

```math
\begin{array}{l}
\operatorname{LLVMTripleOf}(\texttt{x86\_64-sysv})\ =\ \texttt{"x86\_64-unknown-linux-gnu"} \\
\operatorname{LLVMTripleOf}(\texttt{x86\_64-win64})\ =\ \texttt{"x86\_64-pc-windows-msvc"} \\
\operatorname{LLVMTripleOf}(\texttt{aarch64-aapcs64})\ =\ \texttt{"aarch64-unknown-linux-gnu"}
\end{array}
```

```math
\begin{array}{l}
\operatorname{LLVMDataLayoutOf}(\texttt{x86\_64-sysv})\ =\ \texttt{"e-m:e-p270:32:32-p271:32:32-p272:64:64-i128:128-n8:16:32:64-S128"} \\
\operatorname{LLVMDataLayoutOf}(\texttt{x86\_64-win64})\ =\ \texttt{"e-m:w-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"} \\
\operatorname{LLVMDataLayoutOf}(\texttt{aarch64-aapcs64})\ =\ \texttt{"e-m:e-i8:8:32-i16:16:32-i64:64-i128:128-n32:64-S128"}
\end{array}
```

```math
\mathsf{ExternAbiSet}\ =\ \{\ \texttt{"C"},\ \texttt{"C-unwind"},\ \texttt{"system"},\ \texttt{"stdcall"},\ \texttt{"fastcall"},\ \texttt{"vectorcall"}\ \}
```

```math
\mathsf{AbiToConvention}\ :\ \mathsf{String}\ \to \ \mathsf{CallingConvention}
```

```math
\begin{array}{l}
\operatorname{AbiToConvention}(\texttt{"C"})\ =\ \texttt{C} \\
\operatorname{AbiToConvention}(\texttt{"C-unwind"})\ =\ \texttt{C-unwind} \\
\operatorname{AbiToConvention}(\texttt{"system"})\ =\ \texttt{system} \\
\operatorname{AbiToConvention}(\texttt{"stdcall"})\ =\ \texttt{stdcall} \\
\operatorname{AbiToConvention}(\texttt{"fastcall"})\ =\ \texttt{fastcall} \\
\operatorname{AbiToConvention}(\texttt{"vectorcall"})\ =\ \texttt{vectorcall}
\end{array}
```

```math
\begin{array}{l}
\operatorname{ConventionLayout}(\texttt{x86\_64-sysv},\ \texttt{C})\ =\ \langle  \\
\ \mathsf{param}_{\mathsf{regs}}:\ \langle \mathsf{int}\ =\ [\mathsf{rdi},\ \mathsf{rsi},\ \mathsf{rdx},\ \mathsf{rcx},\ \mathsf{r8},\ \mathsf{r9}],\ \mathsf{float}\ =\ [\mathsf{xmm0},\ \mathsf{xmm1},\ \mathsf{xmm2},\ \mathsf{xmm3},\ \mathsf{xmm4},\ \mathsf{xmm5},\ \mathsf{xmm6},\ \mathsf{xmm7}]\rangle , \\
\ \mathsf{return}_{\mathsf{regs}}:\ \langle \mathsf{int}\ =\ [\mathsf{rax},\ \mathsf{rdx}],\ \mathsf{float}\ =\ [\mathsf{xmm0},\ \mathsf{xmm1}]\rangle , \\
\ \mathsf{stack}_{\mathsf{alignment}}:\ 16, \\
\ \mathsf{callee}_{\mathsf{saved}}:\ [\mathsf{rbx},\ \mathsf{rbp},\ \mathsf{r12},\ \mathsf{r13},\ \mathsf{r14},\ \mathsf{r15}], \\
\ \mathsf{caller}_{\mathsf{saved}}:\ [\mathsf{rax},\ \mathsf{rcx},\ \mathsf{rdx},\ \mathsf{rsi},\ \mathsf{rdi},\ \mathsf{r8},\ \mathsf{r9},\ \mathsf{r10},\ \mathsf{r11}], \\
\ \mathsf{variadic}_{\mathsf{support}}:\ \mathsf{true}, \\
\ \mathsf{unwind}_{\mathsf{support}}:\ \mathsf{false}, \\
\ \mathsf{panic}_{\mathsf{passing}}:\ \texttt{OutParam} \\
\rangle 
\end{array}
```

```math
\begin{array}{l}
\operatorname{ConventionLayout}(\texttt{x86\_64-win64},\ \texttt{C})\ =\ \langle  \\
\ \mathsf{param}_{\mathsf{regs}}:\ \langle \mathsf{int}\ =\ [\mathsf{rcx},\ \mathsf{rdx},\ \mathsf{r8},\ \mathsf{r9}],\ \mathsf{float}\ =\ [\mathsf{xmm0},\ \mathsf{xmm1},\ \mathsf{xmm2},\ \mathsf{xmm3}]\rangle , \\
\ \mathsf{return}_{\mathsf{regs}}:\ \langle \mathsf{int}\ =\ [\mathsf{rax}],\ \mathsf{float}\ =\ [\mathsf{xmm0}]\rangle , \\
\ \mathsf{stack}_{\mathsf{alignment}}:\ 16, \\
\ \mathsf{callee}_{\mathsf{saved}}:\ [\mathsf{rbx},\ \mathsf{rbp},\ \mathsf{rdi},\ \mathsf{rsi},\ \mathsf{r12},\ \mathsf{r13},\ \mathsf{r14},\ \mathsf{r15}], \\
\ \mathsf{caller}_{\mathsf{saved}}:\ [\mathsf{rax},\ \mathsf{rcx},\ \mathsf{rdx},\ \mathsf{r8},\ \mathsf{r9},\ \mathsf{r10},\ \mathsf{r11}], \\
\ \mathsf{variadic}_{\mathsf{support}}:\ \mathsf{true}, \\
\ \mathsf{unwind}_{\mathsf{support}}:\ \mathsf{false}, \\
\ \mathsf{panic}_{\mathsf{passing}}:\ \texttt{OutParam} \\
\rangle 
\end{array}
```

```math
\begin{array}{l}
\operatorname{ConventionLayout}(\texttt{aarch64-aapcs64},\ \texttt{C})\ =\ \langle  \\
\ \mathsf{param}_{\mathsf{regs}}:\ \langle \mathsf{int}\ =\ [\mathsf{x0},\ \mathsf{x1},\ \mathsf{x2},\ \mathsf{x3},\ \mathsf{x4},\ \mathsf{x5},\ \mathsf{x6},\ \mathsf{x7}],\ \mathsf{float}\ =\ [\mathsf{v0},\ \mathsf{v1},\ \mathsf{v2},\ \mathsf{v3},\ \mathsf{v4},\ \mathsf{v5},\ \mathsf{v6},\ \mathsf{v7}]\rangle , \\
\ \mathsf{return}_{\mathsf{regs}}:\ \langle \mathsf{int}\ =\ [\mathsf{x0},\ \mathsf{x1}],\ \mathsf{float}\ =\ [\mathsf{v0},\ \mathsf{v1}]\rangle , \\
\ \mathsf{stack}_{\mathsf{alignment}}:\ 16, \\
\ \mathsf{callee}_{\mathsf{saved}}:\ [\mathsf{x19},\ \mathsf{x20},\ \mathsf{x21},\ \mathsf{x22},\ \mathsf{x23},\ \mathsf{x24},\ \mathsf{x25},\ \mathsf{x26},\ \mathsf{x27},\ \mathsf{x28},\ \mathsf{x29},\ \mathsf{x30}], \\
\ \mathsf{caller}_{\mathsf{saved}}:\ [\mathsf{x0},\ \mathsf{x1},\ \mathsf{x2},\ \mathsf{x3},\ \mathsf{x4},\ \mathsf{x5},\ \mathsf{x6},\ \mathsf{x7},\ \mathsf{x8},\ \mathsf{x9},\ \mathsf{x10},\ \mathsf{x11},\ \mathsf{x12},\ \mathsf{x13},\ \mathsf{x14},\ \mathsf{x15},\ \mathsf{x16},\ \mathsf{x17},\ \mathsf{x18}], \\
\ \mathsf{variadic}_{\mathsf{support}}:\ \mathsf{true}, \\
\ \mathsf{unwind}_{\mathsf{support}}:\ \mathsf{false}, \\
\ \mathsf{panic}_{\mathsf{passing}}:\ \texttt{OutParam} \\
\rangle 
\end{array}
```

```math
\begin{array}{l}
\operatorname{ConventionLayout}(\mathsf{profile},\ \texttt{C-unwind})\ =\ \operatorname{ConventionLayout}(\mathsf{profile},\ \texttt{C})\ \mathsf{with}\ \texttt{unwind\_support := true} \\
\operatorname{ConventionLayout}(\mathsf{profile},\ \texttt{system})\ =\ \operatorname{ConventionLayout}(\mathsf{profile},\ \texttt{C}) \\
\operatorname{ConventionLayout}(\texttt{x86\_64-win64},\ \texttt{stdcall})\ =\ \operatorname{ConventionLayout}(\texttt{x86\_64-win64},\ \texttt{C}) \\
\operatorname{ConventionLayout}(\texttt{x86\_64-win64},\ \texttt{fastcall})\ =\ \operatorname{ConventionLayout}(\texttt{x86\_64-win64},\ \texttt{C}) \\
\operatorname{ConventionLayout}(\texttt{x86\_64-win64},\ \texttt{vectorcall})\ =\ \operatorname{ConventionLayout}(\texttt{x86\_64-win64},\ \texttt{C})\ \mathsf{with}\ \texttt{variadic\_support := false}
\end{array}
```

```math
\mathsf{AssignParamRegs}\ :\ [\mathsf{ParamType}]\ \times \ \mathsf{CallingConvention}\ \to \ [\mathsf{ParamLocation}]
```

```math
\begin{array}{l}
\operatorname{AssignParamRegs}(\mathsf{params},\ \mathsf{conv})\ = \\
\ \mathsf{let}\ \mathsf{abi}\ =\ \operatorname{ConventionLayout}(\mathsf{SelectedTargetProfile},\ \mathsf{conv}) \\
\ \mathsf{let}\ (\mathsf{int}_{\mathsf{regs}},\ \mathsf{float}_{\mathsf{regs}})\ =\ (\mathsf{abi}.\mathsf{param}_{\mathsf{regs}}.\mathsf{int},\ \mathsf{abi}.\mathsf{param}_{\mathsf{regs}}.\mathsf{float}) \\
\ \mathsf{let}\ \mathsf{int}_{\mathsf{idx}}\ =\ 0,\ \mathsf{float}_{\mathsf{idx}}\ =\ 0,\ \mathsf{stack}_{\mathsf{offset}}\ =\ 0 \\
\ \mathsf{for}\ \mathsf{each}\ (\mathsf{mode},\ T)\ \mathsf{in}\ \mathsf{params}: \\
\quad \mathsf{if}\ \operatorname{IsFloatType}(T)\ \land \ \mathsf{float}_{\mathsf{idx}}\ <\ \mid \mathsf{float}_{\mathsf{regs}}\mid : \\
\quad \mathsf{assign}\ \mathsf{float}_{\mathsf{regs}}[\mathsf{float}_{\mathsf{idx}}\mathbin{++} ] \\
\quad \mathsf{else}\ \mathsf{if}\ \operatorname{IsIntOrPtrType}(T)\ \land \ \mathsf{int}_{\mathsf{idx}}\ <\ \mid \mathsf{int}_{\mathsf{regs}}\mid : \\
\quad \mathsf{assign}\ \mathsf{int}_{\mathsf{regs}}[\mathsf{int}_{\mathsf{idx}}\mathbin{++} ] \\
\quad \mathsf{else}: \\
\quad \mathsf{assign}\ \operatorname{Stack}(\mathsf{stack}_{\mathsf{offset}}) \\
\quad \mathsf{stack}_{\mathsf{offset}}\ +=\ \operatorname{Align}(\operatorname{sizeof}(T),\ \mathsf{abi}.\mathsf{stack}_{\mathsf{alignment}})
\end{array}
```

```math
\begin{array}{l}
\mathsf{StackFrame}\ =\ \langle  \\
\ \mathsf{return}_{\mathsf{address}}:\ \mathsf{Offset}, \\
\ \mathsf{saved}_{\mathsf{frame}\_\mathsf{pointer}}:\ \mathsf{Option}<\mathsf{Offset}>, \\
\ \mathsf{callee}_{\mathsf{saved}\_\mathsf{area}}:\ [\langle \mathsf{Register},\ \mathsf{Offset}\rangle ], \\
\ \mathsf{local}_{\mathsf{variables}}:\ [\langle \mathsf{Name},\ \mathsf{Offset},\ \mathsf{Size}\rangle ], \\
\ \mathsf{outgoing}_{\mathsf{args}}:\ \mathsf{Option}<\mathsf{Offset}>, \\
\ \mathsf{alignment}_{\mathsf{padding}}:\ \mathsf{Size} \\
\rangle 
\end{array}
```

**(StackFrame-Layout)**
procedure f with locals L, max_outgoing_args M

```math
\begin{array}{l}
\mathsf{frame}_{\mathsf{size}}\ =\ \operatorname{Align}(\mid L\mid \ +\ \mid \operatorname{ConventionLayout}(\mathsf{SelectedTargetProfile},\ \mathsf{CallConvDefault}).\mathsf{callee}_{\mathsf{saved}}\mid \ \times \ \mathsf{PtrSize}\ +\ M,\ \operatorname{ConventionLayout}(\mathsf{SelectedTargetProfile},\ \mathsf{CallConvDefault}).\mathsf{stack}_{\mathsf{alignment}}) \\
\rule{18em}{0.4pt} \\
\operatorname{StackFrameOf}(f)\ =\ \langle \mathsf{frame}_{\mathsf{size}},\ \mathsf{local}_{\mathsf{offsets}},\ \mathsf{callee}_{\mathsf{saved}\_\mathsf{offsets}},\ \mathsf{outgoing}_{\mathsf{offset}}\rangle 
\end{array}
```

**(Conv-Compatible)**

```math
\begin{array}{l}
\mathsf{CallerConv}\ =\ \mathsf{conv}_{1}\quad \mathsf{CalleeConv}\ =\ \mathsf{conv}_{2}\quad \mathsf{conv}_{1}\ =\ \mathsf{conv}_{2} \\
\rule{18em}{0.4pt} \\
\operatorname{ConvCompatible}(\mathsf{conv}_{1},\ \mathsf{conv}_{2})\ =\ \mathsf{true}
\end{array}
```

**(Conv-FFI-Required)**

```math
\begin{array}{l}
\operatorname{FFIBoundary}(\mathsf{call}_{\mathsf{site}})\quad \operatorname{ExternAbi}(\mathsf{callee})\ =\ \mathsf{abi}_{\mathsf{str}}\quad \operatorname{AbiToConvention}(\mathsf{abi}_{\mathsf{str}})\ =\ \mathsf{conv} \\
\rule{18em}{0.4pt} \\
\operatorname{RequiredConvention}(\mathsf{call}_{\mathsf{site}})\ =\ \mathsf{conv}
\end{array}
```

#### 24.2.4 ABI Type Lowering

```math
\begin{array}{l}
\mathsf{ABIType}\ =\ \{\ \langle \mathsf{size},\ \mathsf{align}\rangle \ \mid \ \mathsf{size}\ \in \ \mathbb{N} \ \land \ \mathsf{align}\ \in \ \mathbb{N} \ \} \\
\mathsf{ABITyJudg}\ =\ \{\mathsf{ABITy}\}
\end{array}
```

**(ABI-Prim)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypePrim}(\mathsf{name}))\ =\ s\quad \Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypePrim}(\mathsf{name}))\ =\ a \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ABITy}(\operatorname{TypePrim}(\mathsf{name}))\ \Downarrow \ \langle s,\ a\rangle 
\end{array}
```

**(ABI-Perm)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ABITy}(T)\ \Downarrow \ \tau  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ABITy}(\operatorname{TypePerm}(p,\ T))\ \Downarrow \ \tau 
\end{array}
```

**(ABI-Ptr)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePtr}(U,\ s) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ABITy}(T)\ \Downarrow \ \langle \mathsf{PtrSize},\ \mathsf{PtrAlign}\rangle 
\end{array}
```

**(ABI-RawPtr)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeRawPtr}(q,\ U) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ABITy}(T)\ \Downarrow \ \langle \mathsf{PtrSize},\ \mathsf{PtrAlign}\rangle 
\end{array}
```

**(ABI-Func)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeFunc}(\mathsf{params},\ R) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ABITy}(T)\ \Downarrow \ \langle \mathsf{PtrSize},\ \mathsf{PtrAlign}\rangle 
\end{array}
```

**(ABI-Alias)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{AliasBody}(p)\ =\ \mathsf{ty}\quad \Gamma \ \vdash \ \operatorname{ABITy}(\mathsf{ty})\ \Downarrow \ \tau  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ABITy}(T)\ \Downarrow \ \tau 
\end{array}
```

**(ABI-Record)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \operatorname{Fields}(R)\ =\ \mathsf{fields}\quad \operatorname{RecordLayout}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ABITy}(T)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
```

**(ABI-Tuple)**

```math
\begin{array}{l}
\operatorname{TupleLayout}([T_{1},\ \ldots ,\ T_{n}])\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ABITy}(\operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}]))\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
```

**(ABI-Array)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeArray}(T,\ e))\ =\ \mathsf{size}\quad \Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeArray}(T,\ e))\ =\ \mathsf{align} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ABITy}(\operatorname{TypeArray}(T,\ e))\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
```

**(ABI-Slice)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeSlice}(U) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ABITy}(T)\ \Downarrow \ \langle 2\ \times \ \mathsf{PtrSize},\ \mathsf{PtrAlign}\rangle 
\end{array}
```

**(ABI-Range)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeRange}(T))\ =\ \mathsf{size}\quad \Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeRange}(T))\ =\ \mathsf{align} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ABITy}(\operatorname{TypeRange}(T))\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
```

**(ABI-RangeInclusive)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeRangeInclusive}(T))\ =\ \mathsf{size}\quad \Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeRangeInclusive}(T))\ =\ \mathsf{align} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ABITy}(\operatorname{TypeRangeInclusive}(T))\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
```

**(ABI-RangeFrom)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeRangeFrom}(T))\ =\ \mathsf{size}\quad \Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeRangeFrom}(T))\ =\ \mathsf{align} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ABITy}(\operatorname{TypeRangeFrom}(T))\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
```

**(ABI-RangeTo)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeRangeTo}(T))\ =\ \mathsf{size}\quad \Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeRangeTo}(T))\ =\ \mathsf{align} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ABITy}(\operatorname{TypeRangeTo}(T))\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
```

**(ABI-RangeToInclusive)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(\operatorname{TypeRangeToInclusive}(T))\ =\ \mathsf{size}\quad \Gamma \ \vdash \ \operatorname{alignof}(\operatorname{TypeRangeToInclusive}(T))\ =\ \mathsf{align} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ABITy}(\operatorname{TypeRangeToInclusive}(T))\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
```

**(ABI-RangeFull)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(\mathsf{TypeRangeFull})\ =\ \mathsf{size}\quad \Gamma \ \vdash \ \operatorname{alignof}(\mathsf{TypeRangeFull})\ =\ \mathsf{align} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ABITy}(\mathsf{TypeRangeFull})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
```

**(ABI-Enum)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{EnumLayout}(E)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_,\ \_\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ABITy}(T)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
```

**(ABI-Union)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad \operatorname{UnionLayout}(T)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_,\ \_\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ABITy}(T)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
```

**(ABI-Modal)**

```math
\begin{array}{l}
T\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalLayout}(\mathsf{modal}_{\mathsf{ref}})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_,\ \_\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ABITy}(T)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
```

**(ABI-Dynamic)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{DynLayout}(\mathsf{Cl})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ABITy}(\operatorname{TypeDynamic}(\mathsf{Cl}))\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
```

**(ABI-StringBytes)**

```math
\begin{array}{l}
T\ \in \ \{\operatorname{TypeString}(\texttt{@View}),\ \operatorname{TypeString}(\texttt{@Managed}),\ \operatorname{TypeBytes}(\texttt{@View}),\ \operatorname{TypeBytes}(\texttt{@Managed})\}\quad \Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ \mathsf{size}\quad \Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{align} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ABITy}(T)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
```

#### 24.2.5 ABI Parameter and Return Passing

```math
\begin{array}{l}
\mathsf{PassKind}\ =\ \{\texttt{ByValue},\ \texttt{ByRef},\ \texttt{SRet}\} \\
\mathsf{ByValMax}\ =\ 2\ \times \ \mathsf{PtrSize}
\end{array}
```
ByValAlign = PtrAlign

```math
\begin{array}{l}
\operatorname{ByValOk}(T)\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ n\ \land \ \Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ a\ \land \ n\ \le \ \mathsf{ByValMax}\ \land \ a\ \le \ \mathsf{ByValAlign} \\
\mathsf{ABIParamJudg}\ =\ \{\mathsf{ABIParam}\} \\
\mathsf{ABIRetJudg}\ =\ \{\mathsf{ABIRet}\} \\
\mathsf{ABICallJudg}\ =\ \{\mathsf{ABICall}\} \\
\mathsf{ForeignABIParamJudg}\ =\ \{\mathsf{ForeignABIParam}\} \\
\mathsf{ForeignABICallJudg}\ =\ \{\mathsf{ForeignABICall}\}
\end{array}
```

`ForeignABIParam` and `ForeignABICall` MUST be used for foreign-visible ABI boundaries whose signatures do not carry source parameter-mode information.

**(ABI-Param-ByRef-Alias)**

```math
\begin{array}{l}
\mathsf{mode}\ =\ \bot \quad \Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ n \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ABIParam}(\mathsf{mode},\ T)\ \Downarrow \ \texttt{ByRef}
\end{array}
```

**(ABI-Param-ByValue-Move)**

```math
\begin{array}{l}
\mathsf{mode}\ =\ \texttt{move}\quad \Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ 0\ \lor \ \operatorname{ByValOk}(T) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ABIParam}(\mathsf{mode},\ T)\ \Downarrow \ \texttt{ByValue}
\end{array}
```

**(ABI-Param-ByRef-Move)**

```math
\begin{array}{l}
\mathsf{mode}\ =\ \texttt{move}\quad \Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ n\quad n\ >\ 0\quad \lnot \ \operatorname{ByValOk}(T) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ABIParam}(\mathsf{mode},\ T)\ \Downarrow \ \texttt{ByRef}
\end{array}
```

**(ABI-Ret-ByValue)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ 0\ \lor \ \operatorname{ByValOk}(T) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ABIRet}(T)\ \Downarrow \ \texttt{ByValue}
\end{array}
```

**(ABI-Ret-ByRef)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ n\quad n\ >\ 0\quad \lnot \ \operatorname{ByValOk}(T) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ABIRet}(T)\ \Downarrow \ \texttt{SRet}
\end{array}
```

**(ABI-Call)**

```math
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{ABIParam}(m_{i},\ T_{i})\ \Downarrow \ k_{i}\quad \Gamma \ \vdash \ \operatorname{ABIRet}(R)\ \Downarrow \ k_{r} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ABICall}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ],\ R)\ \Downarrow \ \langle [k_{1},\ \ldots ,\ k_{n}],\ k_{r},\ (k_{r}\ =\ \texttt{SRet})\rangle 
\end{array}
```

**(ABI-ForeignParam-ByValue)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ 0\ \lor \ \operatorname{ByValOk}(T) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ForeignABIParam}(T)\ \Downarrow \ \texttt{ByValue}
\end{array}
```

**(ABI-ForeignParam-ByRef)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ n\quad n\ >\ 0\quad \lnot \ \operatorname{ByValOk}(T) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ForeignABIParam}(T)\ \Downarrow \ \texttt{ByRef}
\end{array}
```

**(ABI-ForeignCall)**

```math
\begin{array}{l}
\forall \ i,\ \Gamma \ \vdash \ \operatorname{ForeignABIParam}(T_{i})\ \Downarrow \ k_{i}\quad \Gamma \ \vdash \ \operatorname{ABIRet}(R)\ \Downarrow \ k_{r} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ForeignABICall}([T_{1},\ \ldots ,\ T_{n}],\ R)\ \Downarrow \ \langle [k_{1},\ \ldots ,\ k_{n}],\ k_{r},\ (k_{r}\ =\ \texttt{SRet})\rangle 
\end{array}
```

```math
\begin{array}{l}
\mathsf{PanicRecordFields}\ =\ [\langle \texttt{panic},\ \operatorname{TypePrim}(\texttt{"bool"})\rangle ,\ \langle \texttt{code},\ \operatorname{TypePrim}(\texttt{"u32"})\rangle ] \\
\mathsf{PanicRecordLayout}\ =\ \operatorname{RecordLayout}(\mathsf{PanicRecordFields}) \\
\operatorname{PanicRecordFieldsOf}(\mathsf{PanicRecord})\ =\ \mathsf{PanicRecordFields} \\
\operatorname{PanicRecordLayoutOf}(\mathsf{PanicRecord})\ =\ \mathsf{PanicRecordLayout}
\end{array}
```

```math
\begin{array}{l}
\mathsf{PanicOutType}\ =\ \operatorname{TypeRawPtr}(\texttt{mut},\ \mathsf{PanicRecord}) \\
\mathsf{PanicOutName}\ =\ \texttt{"\_\_panic"}
\end{array}
```

```math
\operatorname{NeedsPanicOut}(\mathsf{callee})\ \Leftrightarrow \ \mathsf{callee}\ \ne \ \operatorname{RecordCtor}(\_)\ \land \ \mathsf{callee}\ \ne \ \mathsf{EntrySym}\ \land \ \operatorname{RuntimeSig}(\mathsf{callee})\ \mathsf{undefined}
```

```math
\begin{array}{l}
\operatorname{PanicOutParams}(\mathsf{params},\ \mathsf{callee})\ = \\
\ \mathsf{params}\ \mathbin{++} \ [\langle \texttt{move},\ \mathsf{PanicOutName},\ \mathsf{PanicOutType}\rangle ]\quad \mathsf{if}\ \operatorname{NeedsPanicOut}(\mathsf{callee}) \\
\ \mathsf{params}\quad \mathsf{otherwise}
\end{array}
```

### 24.3 Symbols, Mangling, and Linkage

#### 24.3.1 Symbol Names and Mangling

```math
\mathsf{MangleJudg}\ =\ \{\mathsf{Mangle}\}
```
VTableDecl(T, Cl) constructor
LiteralData(kind, contents) constructor
DefaultImpl(T, m) constructor

```math
\begin{array}{l}
\operatorname{Join}(\mathsf{sep},\ [])\ =\ \texttt{"\textbackslash{}""} \\
\operatorname{Join}(\mathsf{sep},\ [s])\ =\ s \\
\operatorname{Join}(\mathsf{sep},\ [s_{1},\ \ldots ,\ s_{n}])\ =\ s_{1}\ \mathbin{++} \ \mathsf{sep}\ \mathbin{++} \ \operatorname{Join}(\mathsf{sep},\ [s_{2},\ \ldots ,\ s_{n}])\quad (n\ \ge \ 2) \\
\operatorname{PathSig}(p)\ =\ \operatorname{mangle}(\operatorname{PathString}(p)) \\
\operatorname{PathSym}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{PathSig}(\mathsf{path}\ \mathbin{++} \ [\mathsf{name}])
\end{array}
```

```math
\begin{array}{l}
\operatorname{ItemPath}(\mathsf{it})\ =\ \operatorname{PathOfModule}(\operatorname{ModuleOf}(\mathsf{it}))\ \mathbin{++} \ [\mathsf{name}]\ \Leftrightarrow \ \mathsf{it}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_) \\
\operatorname{ItemPath}(\mathsf{it})\ =\ \operatorname{PathOfModule}(\operatorname{ModuleOf}(\mathsf{it}))\ \mathbin{++} \ [\mathsf{name}]\ \Leftrightarrow \ \mathsf{it}\ =\ \operatorname{ExternProcDecl}(\_,\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_) \\
\operatorname{ItemPath}(m)\ =\ \operatorname{RecordPath}(R)\ \mathbin{++} \ [m.\mathsf{name}]\ \Leftrightarrow \ m\ \in \ \operatorname{Methods}(R) \\
\operatorname{ItemPath}(m)\ =\ \operatorname{ClassPath}(\mathsf{Cl})\ \mathbin{++} \ [m.\mathsf{name}]\ \Leftrightarrow \ m\ \in \ \operatorname{ClassMethods}(\mathsf{Cl}) \\
\operatorname{ItemPath}(m)\ =\ \operatorname{ModalPath}(M)\ \mathbin{++} \ [S]\ \mathbin{++} \ [m.\mathsf{name}]\ \Leftrightarrow \ S\ \in \ \operatorname{States}(M)\ \land \ m\ \in \ \operatorname{Methods}(M,\ S) \\
\operatorname{ItemPath}(\mathsf{tr})\ =\ \operatorname{ModalPath}(M)\ \mathbin{++} \ [S]\ \mathbin{++} \ [\mathsf{tr}.\mathsf{name}]\ \Leftrightarrow \ S\ \in \ \operatorname{States}(M)\ \land \ \mathsf{tr}\ \in \ \operatorname{Transitions}(M,\ S) \\
\operatorname{ItemPath}(\mathsf{it})\ =\ \operatorname{PathOfModule}(\operatorname{ModuleOf}(\mathsf{it}))\ \mathbin{++} \ [\operatorname{StaticName}(\mathsf{binding})]\ \Leftrightarrow \ \mathsf{it}\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})\ \land \ \operatorname{StaticName}(\mathsf{binding})\ \ne \ \bot  \\
\operatorname{ItemPath}(\operatorname{StaticBinding}(\operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc}),\ x))\ =\ \operatorname{PathOfModule}(\operatorname{ModuleOf}(\operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})))\ \mathbin{++} \ [x] \\
\operatorname{ItemPath}(\operatorname{VTableDecl}(T,\ \mathsf{Cl}))\ =\ [\texttt{"vtable"}]\ \mathbin{++} \ \operatorname{PathOfType}(T)\ \mathbin{++} \ [\texttt{"cl"}]\ \mathbin{++} \ \operatorname{ClassPath}(\mathsf{Cl}) \\
\operatorname{ItemPath}(\operatorname{DefaultImpl}(T,\ m))\ =\ [\texttt{"default"}]\ \mathbin{++} \ \operatorname{PathOfType}(T)\ \mathbin{++} \ [\texttt{"cl"}]\ \mathbin{++} \ \operatorname{ClassPath}(\mathsf{Cl})\ \mathbin{++} \ [m.\mathsf{name}]\ \Leftrightarrow \ m\ \in \ \operatorname{ClassMethods}(\mathsf{Cl})
\end{array}
```

```math
\begin{array}{l}
\operatorname{TypeStateName}(\texttt{View})\ =\ \texttt{"view"} \\
\operatorname{TypeStateName}(\texttt{Managed})\ =\ \texttt{"managed"} \\
\operatorname{PathOfType}(\operatorname{TypePrim}(\mathsf{name}))\ =\ [\texttt{"prim"},\ \mathsf{name}] \\
\operatorname{PathOfType}(\operatorname{TypeString}(\mathsf{st}))\ =\ [\texttt{"string"},\ \operatorname{TypeStateName}(\mathsf{st})] \\
\operatorname{PathOfType}(\operatorname{TypeBytes}(\mathsf{st}))\ =\ [\texttt{"bytes"},\ \operatorname{TypeStateName}(\mathsf{st})] \\
\operatorname{PathOfType}(\operatorname{TypePath}(p))\ =\ p \\
\operatorname{PathOfType}(\operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S))\ =\ \operatorname{ModalRefPath}(\mathsf{modal}_{\mathsf{ref}})\ \mathbin{++} \ [S] \\
\operatorname{PathOfType}(T)\ =\ \bot \ \Leftrightarrow \ T\ \notin \ \{\operatorname{TypePrim}(\_),\ \operatorname{TypeString}(\_),\ \operatorname{TypeBytes}(\_),\ \operatorname{TypePath}(\_),\ \operatorname{TypeModalState}(\_,\ \_)\} \\
\operatorname{ClassPath}(\mathsf{Cl})\ =\ p\ \Leftrightarrow \ \Sigma .\mathsf{Classes}[p]\ =\ \mathsf{Cl}
\end{array}
```

FNVOffset64 = 14695981039346656037
FNVPrime64 = 1099511628211

```math
\begin{array}{l}
\operatorname{FNV1a64}([])\ =\ \mathsf{FNVOffset64} \\
\operatorname{FNV1a64}([b_{1},\ \ldots ,\ b_{n}])\ =\ h_{n}\ \Leftrightarrow \ h_{0}\ =\ \mathsf{FNVOffset64}\ \land \ \forall \ i\ \in \ 0..n-1.\ h\_\{i+1\}\ =\ ((h_{i}\ \oplus \ b\_\{i+1\})\ \times \ \mathsf{FNVPrime64})\ \mathsf{mod}\ 2^64 \\
\operatorname{Hex64}(h)\ =\ \operatorname{Join}(\texttt{"\textbackslash{}""},\ [\operatorname{Hex2}(b_{1}),\ \ldots ,\ \operatorname{Hex2}(b_{8})])\ \Leftrightarrow \ \operatorname{rev}(\operatorname{LEBytes}(h,\ 8))\ =\ [b_{1},\ \ldots ,\ b_{8}] \\
\operatorname{LiteralID}(\mathsf{kind},\ \mathsf{contents})\ =\ \operatorname{mangle}(\mathsf{kind})\ \mathbin{++} \ \texttt{"\_"}\ \mathbin{++} \ \operatorname{Hex64}(\operatorname{FNV1a64}(\mathsf{contents})) \\
\operatorname{LiteralDataSym}(\mathsf{kind},\ \mathsf{bytes})\ =\ \operatorname{Mangle}(\operatorname{LiteralData}(\mathsf{kind},\ \mathsf{bytes}))
\end{array}
```

```math
\begin{array}{l}
\operatorname{ScopedSym}(\mathsf{item})\ =\ \operatorname{PathSig}(\operatorname{ItemPath}(\mathsf{item})) \\
\operatorname{RawSym}(s)\ =\ s \\
\operatorname{HostBodySym}(\mathsf{item})\ =\ \operatorname{PathSig}([\operatorname{ScopedSym}(\mathsf{item}),\ \texttt{"\_\_host\_body"}])\ \Leftrightarrow \ \mathsf{item}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \land \ \operatorname{HostExportAttr}(\mathsf{item})\ \mathsf{defined}
\end{array}
```

```math
\begin{array}{l}
\operatorname{AttrListOf}(\mathsf{item})\ =\ \mathsf{attrs}\quad \mathsf{if}\ \mathsf{item}.\mathsf{attrs}_{\mathsf{opt}}\ =\ \mathsf{attrs} \\
\operatorname{AttrListOf}(\mathsf{item})\ =\ []\quad \mathsf{if}\ \mathsf{item}.\mathsf{attrs}_{\mathsf{opt}}\ =\ \bot  \\
\operatorname{AttrByName}(\mathsf{item},\ n)\ =\ [a\ \mid \ a\ \in \ \operatorname{AttrListOf}(\mathsf{item})\ \land \ a.\mathsf{name}\ =\ n] \\
\operatorname{MangleAttr}(\mathsf{item})\ =\ \mathsf{mode}\ \Leftrightarrow \ \exists \ a\ \in \ \operatorname{AttrByName}(\mathsf{item},\ \texttt{"mangle"}).\ \operatorname{MangleArgs}(a)\ =\ \mathsf{mode} \\
\operatorname{MangleArgs}(a)\ =\ \texttt{none}\ \Leftrightarrow \ a.\mathsf{args}\ =\ [\operatorname{Identifier}(\texttt{none})] \\
\operatorname{MangleArgs}(a)\ =\ s\quad \Leftrightarrow \ a.\mathsf{args}\ =\ [\operatorname{StringLiteral}(s)] \\
\operatorname{ExportAttr}(\mathsf{item})\ =\ \mathsf{abi}\ \Leftrightarrow \ \exists \ a\ \in \ \operatorname{AttrByName}(\mathsf{item},\ \texttt{"export"}).\ a.\mathsf{args}\ =\ [\operatorname{StringLiteral}(\mathsf{abi})] \\
\operatorname{HostExportAttr}(\mathsf{item})\ =\ \mathsf{abi}\ \Leftrightarrow \ \exists \ a\ \in \ \operatorname{AttrByName}(\mathsf{item},\ \texttt{"host\_export"}).\ a.\mathsf{args}\ =\ [\operatorname{StringLiteral}(\mathsf{abi})]
\end{array}
```

```math
\begin{array}{l}
\operatorname{StringText}(\mathsf{tok})\ =\ s\ \Leftrightarrow \ \mathsf{tok}.\mathsf{kind}\ =\ \mathsf{StringLiteral}\ \land \ T\ =\ \operatorname{Lexeme}(\mathsf{tok})\ \land \ \operatorname{StringBytesFrom}(T,\ 1,\ \mid T\mid -1)\ =\ \mathsf{bytes}\ \land \ \operatorname{DecodeUTF8}(\mathsf{bytes})\ =\ s \\
\operatorname{ExternAbiName}(\mathsf{abi}_{\mathsf{opt}})\ =\ \texttt{"C"}\quad \mathsf{if}\ \mathsf{abi}_{\mathsf{opt}}\ =\ \bot  \\
\operatorname{ExternAbiName}(\mathsf{abi}_{\mathsf{opt}})\ =\ s\quad \mathsf{if}\ \mathsf{abi}_{\mathsf{opt}}\ =\ \operatorname{IdentAbi}(s) \\
\operatorname{ExternAbiName}(\mathsf{abi}_{\mathsf{opt}})\ =\ s\quad \mathsf{if}\ \mathsf{abi}_{\mathsf{opt}}\ =\ \operatorname{StringAbi}(\mathsf{tok})\ \land \ \operatorname{StringText}(\mathsf{tok})\ =\ s \\
\operatorname{ExternAbiExplicit}(\mathsf{abi}_{\mathsf{opt}})\ \Leftrightarrow \ \mathsf{abi}_{\mathsf{opt}}\ \ne \ \bot  \\
\operatorname{ExternAbiOf}(\mathsf{proc})\ =\ \mathsf{abi}_{\mathsf{opt}}\ \Leftrightarrow \ \operatorname{ExternBlockOf}(\mathsf{proc})\ =\ \operatorname{ExternBlock}(\_,\ \_,\ \mathsf{abi}_{\mathsf{opt}},\ \_,\ \_,\ \_) \\
\operatorname{ExternRawName}(\mathsf{proc})\ \Leftrightarrow \ \mathsf{proc}\ =\ \operatorname{ExternProcDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \land \ \operatorname{ExternAbiName}(\operatorname{ExternAbiOf}(\mathsf{proc}))\ \in \ \{\texttt{"C"},\ \texttt{"C-unwind"}\}
\end{array}
```

```math
\begin{array}{l}
\operatorname{LinkName}(\mathsf{item})\ =\ \mathsf{sym}\ \Leftrightarrow  \\
\ \operatorname{MangleAttr}(\mathsf{item})\ =\ \texttt{none}\quad \land \ \mathsf{sym}\ =\ \operatorname{RawSym}(\operatorname{ItemName}(\mathsf{item})) \\
\ \operatorname{MangleAttr}(\mathsf{item})\ =\ s\ \land \ s\ \ne \ \texttt{none}\quad \land \ \mathsf{sym}\ =\ \operatorname{RawSym}(s) \\
\ \operatorname{MangleAttr}(\mathsf{item})\ \mathsf{undefined}\ \land \ \operatorname{ExternRawName}(\mathsf{item})\quad \land \ \mathsf{sym}\ =\ \operatorname{RawSym}(\operatorname{ItemName}(\mathsf{item})) \\
\ \operatorname{MangleAttr}(\mathsf{item})\ \mathsf{undefined}\ \land \ \operatorname{ExportAttr}(\mathsf{item})\ \mathsf{defined}\quad \land \ \mathsf{sym}\ =\ \operatorname{ScopedSym}(\mathsf{item}) \\
\ \operatorname{MangleAttr}(\mathsf{item})\ \mathsf{undefined}\ \land \ \operatorname{ExportAttr}(\mathsf{item})\ \mathsf{undefined}\ \land \ \mathsf{sym}\ =\ \operatorname{ScopedSym}(\mathsf{item})
\end{array}
```

```math
\operatorname{HostThunkLinkName}(\mathsf{item})\ =\ \mathsf{sym}\ \Leftrightarrow \ \mathsf{item}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \land \ \operatorname{HostExportAttr}(\mathsf{item})\ \mathsf{defined}\ \land \ \operatorname{LinkName}(\mathsf{item})\ =\ \mathsf{sym}
```

```math
\begin{array}{l}
\operatorname{ItemName}(\mathsf{item})\ =\ \mathsf{name}\ \Leftrightarrow \ \mathsf{item}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_) \\
\operatorname{ItemName}(\mathsf{item})\ =\ \mathsf{name}\ \Leftrightarrow \ \mathsf{item}\ =\ \operatorname{ExternProcDecl}(\_,\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_) \\
\operatorname{ItemName}(\mathsf{item})\ =\ \mathsf{name}\ \Leftrightarrow \ \mathsf{item}\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \langle \operatorname{IdentifierPattern}(\mathsf{name}),\ \_,\ \_,\ \_,\ \_\rangle ,\ \_,\ \_)
\end{array}
```

**(Mangle-HostExport-Proc)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ProcedureDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\quad \mathsf{name}\ \ne \ \texttt{"main"}\quad \operatorname{HostExportAttr}(\mathsf{item})\ \mathsf{defined}\quad \operatorname{HostBodySym}(\mathsf{item})\ =\ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym}
\end{array}
```

**(Mangle-Proc)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ProcedureDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\quad \mathsf{name}\ \ne \ \texttt{"main"}\quad \operatorname{HostExportAttr}(\mathsf{item})\ \mathsf{undefined}\quad \operatorname{LinkName}(\mathsf{item})\ =\ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym}
\end{array}
```

**(Mangle-ExternProc)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ExternProcDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{foreign}_{\mathsf{contracts}\_\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc})\quad \operatorname{LinkName}(\mathsf{item})\ =\ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym}
\end{array}
```

**(Mangle-Main)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ProcedureDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \texttt{"main"},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\quad \operatorname{MainSigOk}(\mathsf{item})\quad \operatorname{LinkName}(\mathsf{item})\ =\ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym}
\end{array}
```

**(Mangle-Record-Method)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{MethodDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{override},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{receiver},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \operatorname{ScopedSym}(\mathsf{item})
\end{array}
```

**(Mangle-Class-Method)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ClassMethodDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{receiver},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \operatorname{ScopedSym}(\mathsf{item})
\end{array}
```

**(Mangle-State-Method)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StateMethodDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \operatorname{ScopedSym}(\mathsf{item})
\end{array}
```

**(Mangle-Transition)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{TransitionDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{params},\ \mathsf{target},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \operatorname{ScopedSym}(\mathsf{item})
\end{array}
```

**(Mangle-Static)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})\quad \operatorname{StaticName}(\mathsf{binding})\ \ne \ \bot  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \operatorname{ScopedSym}(\mathsf{item})
\end{array}
```

**(Mangle-StaticBinding)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticBinding}(\operatorname{StaticDecl}(\_,\ \_,\ \_,\ \mathsf{binding},\ \_,\ \_),\ x) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \operatorname{ScopedSym}(\mathsf{item})
\end{array}
```

**(Mangle-VTable)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{VTableDecl}(T,\ \mathsf{Cl}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \operatorname{ScopedSym}(\mathsf{item})
\end{array}
```

**(Mangle-Literal)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{LiteralData}(\mathsf{kind},\ \mathsf{contents})\quad \operatorname{LiteralID}(\mathsf{kind},\ \mathsf{contents})\ =\ \mathsf{id} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"literal"},\ \mathsf{id}])
\end{array}
```

**(Mangle-DefaultImpl)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{DefaultImpl}(T,\ m) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \operatorname{ScopedSym}(\mathsf{item})
\end{array}
```

ClosureIndex(C) returns a unique index for closure C within its enclosing scope.

```math
\operatorname{EnclosingSym}(C)\ =\ \mathsf{sym}\ \Leftrightarrow \ \operatorname{EnclosingScope}(C)\ =\ \mathsf{item}\ \land \ \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym}
```

**(Mangle-Closure)**

```math
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{EnclosingSym}(C)\ =\ \mathsf{sym}_{\mathsf{enc}}\quad \operatorname{ClosureIndex}(C)\ =\ \mathsf{idx} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Mangle}(C)\ \Downarrow \ \operatorname{PathSig}([\mathsf{sym}_{\mathsf{enc}},\ \texttt{"\_closure"}\ \mathbin{++} \ \operatorname{ToString}(\mathsf{idx})])
\end{array}
```

**(Mangle-ClosureEnv)**

```math
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \Gamma \ \vdash \ \operatorname{Mangle}(C)\ \Downarrow \ \mathsf{sym}_{\mathsf{closure}} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{MangleClosureEnv}(C)\ \Downarrow \ \operatorname{PathSig}([\mathsf{sym}_{\mathsf{closure}},\ \texttt{"\_env"}])
\end{array}
```

```math
\operatorname{ClosureCodeSym}(C)\ =\ \mathsf{sym}\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{Mangle}(C)\ \Downarrow \ \mathsf{sym}
```

#### 24.3.2 Linkage for Generated Symbols

```math
\begin{array}{l}
\mathsf{LinkageKind}\ =\ \{\texttt{internal},\ \texttt{external}\} \\
\mathsf{LinkageJudg}\ =\ \{\mathsf{Linkage}\}
\end{array}
```

**(Linkage-UserItem)**

```math
\begin{array}{l}
\mathsf{item}\ \in \ \{\mathsf{ProcedureDecl},\ \mathsf{StaticDecl},\ \mathsf{MethodDecl}\}\quad \operatorname{Vis}(\mathsf{item})\ \in \ \{\texttt{public},\ \texttt{internal}\}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{external}
\end{array}
```

**(Linkage-ExternProc)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ExternProcDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{external}
\end{array}
```

**(Linkage-UserItem-Internal)**

```math
\begin{array}{l}
\mathsf{item}\ \in \ \{\mathsf{ProcedureDecl},\ \mathsf{StaticDecl},\ \mathsf{MethodDecl}\}\quad \operatorname{Vis}(\mathsf{item})\ =\ \texttt{private}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
```

**(Linkage-StaticBinding)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticBinding}(\operatorname{StaticDecl}(\_,\ \mathsf{vis},\ \_,\ \_,\ \_,\ \_),\ x)\quad \mathsf{vis}\ \in \ \{\texttt{public},\ \texttt{internal}\}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{external}
\end{array}
```

**(Linkage-StaticBinding-Internal)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticBinding}(\operatorname{StaticDecl}(\_,\ \mathsf{vis},\ \_,\ \_,\ \_,\ \_),\ x)\quad \mathsf{vis}\ =\ \texttt{private}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
```

**(Linkage-ClassMethod)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ClassMethodDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{receiver},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}})\quad \mathsf{body}_{\mathsf{opt}}\ \ne \ \bot \quad \operatorname{Vis}(\mathsf{item})\ \in \ \{\texttt{public},\ \texttt{internal}\}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{external}
\end{array}
```

**(Linkage-ClassMethod-Internal)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ClassMethodDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{receiver},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body}_{\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}})\quad \mathsf{body}_{\mathsf{opt}}\ \ne \ \bot \quad \operatorname{Vis}(\mathsf{item})\ =\ \texttt{private}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
```

**(Linkage-StateMethod)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StateMethodDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}})\quad \operatorname{Vis}(\mathsf{item})\ \in \ \{\texttt{public},\ \texttt{internal}\}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{external}
\end{array}
```

**(Linkage-StateMethod-Internal)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StateMethodDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{recv},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}})\quad \operatorname{Vis}(\mathsf{item})\ =\ \texttt{private}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
```

**(Linkage-Transition)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{TransitionDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{params},\ \mathsf{target},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}})\quad \operatorname{Vis}(\mathsf{item})\ \in \ \{\texttt{public},\ \texttt{internal}\}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{external}
\end{array}
```

**(Linkage-Transition-Internal)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{TransitionDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{params},\ \mathsf{target},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc}_{\mathsf{opt}})\quad \operatorname{Vis}(\mathsf{item})\ =\ \texttt{private}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
```

**(Linkage-InitFn)**

```math
\begin{array}{l}
\operatorname{InitFn}(m)\ \Downarrow \ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
```

**(Linkage-DeinitFn)**

```math
\begin{array}{l}
\operatorname{DeinitFn}(m)\ \Downarrow \ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
```

**(Linkage-VTable)**

```math
\begin{array}{l}
\operatorname{Mangle}(\operatorname{VTableDecl}(T,\ \mathsf{Cl}))\ \Downarrow \ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
```

**(Linkage-LiteralData)**

```math
\begin{array}{l}
\operatorname{Mangle}(\operatorname{LiteralData}(\mathsf{kind},\ \mathsf{contents}))\ \Downarrow \ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
```

**(Linkage-DropGlue)**

```math
\begin{array}{l}
\operatorname{DropGlueSym}(T)\ \Downarrow \ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
```

**(Linkage-DefaultImpl)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{DefaultImpl}(T,\ m)\quad \operatorname{Vis}(m)\ \in \ \{\texttt{public},\ \texttt{internal}\}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{external}
\end{array}
```

**(Linkage-DefaultImpl-Internal)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{DefaultImpl}(T,\ m)\quad \operatorname{Vis}(m)\ =\ \texttt{private}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
```

**(Linkage-PanicSym)**

```math
\begin{array}{l}
\mathsf{PanicSym}\ \Downarrow \ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
```

**(Linkage-BuiltinModalSym)**

```math
\begin{array}{l}
\operatorname{BuiltinModalSym}(\mathsf{proc})\ \Downarrow \ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
```

**(Linkage-BuiltinSym)**

```math
\begin{array}{l}
\operatorname{BuiltinSym}(\mathsf{method})\ \Downarrow \ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{internal}
\end{array}
```

**(Linkage-EntrySym)**

```math
\begin{array}{l}
\mathsf{EntrySym}\ \Downarrow \ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Linkage}(\mathsf{sym})\ \Downarrow \ \texttt{external}
\end{array}
```

### 24.4 Initialization and Program Lifecycle

#### 24.4.1 Static Globals and Module Init/Deinit Lowering

```math
\mathsf{GlobalsJudg}\ =\ \{\mathsf{EmitGlobal},\ \mathsf{InitFn},\ \mathsf{DeinitFn},\ \mathsf{Lower}-\mathsf{StaticInit},\ \mathsf{Lower}-\mathsf{StaticInitItem},\ \mathsf{Lower}-\mathsf{StaticInitItems},\ \mathsf{InitCallIR},\ \mathsf{Lower}-\mathsf{StaticDeinit},\ \mathsf{Lower}-\mathsf{StaticDeinitNames},\ \mathsf{Lower}-\mathsf{StaticDeinitItem},\ \mathsf{Lower}-\mathsf{StaticDeinitItems},\ \mathsf{DeinitCallIR},\ \mathsf{EmitInitPlan},\ \mathsf{EmitDeinitPlan},\ \mathsf{EmitStringLit},\ \mathsf{EmitBytesLit},\ \mathsf{InitPanicHandle}\}
```

```math
\mathsf{ConstInitJudg}\ =\ \{\mathsf{ConstInit}\}
```

```math
\Gamma \ \vdash \ \operatorname{ConstInit}(e)\ \Downarrow \ \mathsf{bytes}\ \Leftrightarrow \ e\ =\ \operatorname{Literal}(\mathsf{lit})\ \land \ \Gamma \ \vdash \ \operatorname{EncodeConst}(\operatorname{ExprType}(e),\ \mathsf{lit})\ \Downarrow \ \mathsf{bytes}
```

```math
\begin{array}{l}
\operatorname{StaticName}(\mathsf{binding})\ = \\
\ \mathsf{name}\quad \mathsf{if}\ \mathsf{binding}\ =\ \langle \operatorname{IdentifierPattern}(\mathsf{name}),\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \mathsf{span}\rangle  \\
\ \bot \quad \mathsf{otherwise}
\end{array}
```

```math
\operatorname{StaticBindTypes}(\mathsf{binding})\ =\ B\ \Leftrightarrow \ \mathsf{binding}\ =\ \langle \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \_\rangle \ \land \ \Gamma \ \vdash \ \mathsf{pat}\ \Leftarrow \ \operatorname{BindType}(\mathsf{binding})\ \dashv \ B
```

```math
\operatorname{StaticBindList}(\mathsf{binding})\ =\ \operatorname{PatNames}(\mathsf{pat})\ \Leftrightarrow \ \mathsf{binding}\ =\ \langle \mathsf{pat},\ \_,\ \_,\ \_,\ \_\rangle 
```

```math
\mathsf{StaticBinding}\ :\ \mathsf{StaticDecl}\ \times \ \mathsf{Name}\ \to \ \mathsf{StaticDecl}
```

```math
\begin{array}{l}
\operatorname{StaticSym}(\operatorname{StaticDecl}(\_,\ \_,\ \_,\ \mathsf{binding},\ \_,\ \_),\ x)\ = \\
\ \operatorname{Mangle}(\operatorname{StaticDecl}(\_,\ \_,\ \_,\ \mathsf{binding},\ \_,\ \_))\quad \mathsf{if}\ \operatorname{StaticName}(\mathsf{binding})\ =\ x \\
\ \operatorname{Mangle}(\operatorname{StaticBinding}(\operatorname{StaticDecl}(\_,\ \_,\ \_,\ \mathsf{binding},\ \_,\ \_),\ x))\quad \mathsf{otherwise}
\end{array}
```

**(Emit-Static-Const)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})\quad \mathsf{mut}\ =\ \texttt{let}\quad \operatorname{StaticName}(\mathsf{binding})\ =\ \mathsf{name}\quad \mathsf{binding}\ =\ \langle \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \_\rangle \quad \Gamma \ \vdash \ \operatorname{ConstInit}(\mathsf{init})\ \Downarrow \ \mathsf{bytes}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EmitGlobal}(\mathsf{item})\ \Downarrow \ [\operatorname{GlobalConst}(\mathsf{sym},\ \mathsf{bytes})]
\end{array}
```

**(Emit-Static-Init)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})\quad \operatorname{StaticName}(\mathsf{binding})\ =\ \mathsf{name}\quad \mathsf{binding}\ =\ \langle \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \_\rangle \quad ((\mathsf{mut}\ =\ \texttt{var})\ \lor \ (\Gamma \ \vdash \ \operatorname{ConstInit}(\mathsf{init})\ \Uparrow ))\quad T\ =\ \operatorname{ExprType}(\mathsf{init})\quad \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EmitGlobal}(\mathsf{item})\ \Downarrow \ [\operatorname{GlobalZero}(\mathsf{sym},\ \operatorname{sizeof}(T))]
\end{array}
```

**(Emit-Static-Multi)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})\quad \operatorname{StaticName}(\mathsf{binding})\ =\ \bot \quad \operatorname{StaticBindTypes}(\mathsf{binding})\ =\ B\quad \operatorname{StaticBindList}(\mathsf{binding})\ =\ [x_{1},\ \ldots ,\ x_{k}]\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{Mangle}(\operatorname{StaticBinding}(\mathsf{item},\ x_{i}))\ \Downarrow \ \mathsf{sym}_{i} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EmitGlobal}(\mathsf{item})\ \Downarrow \ [\operatorname{GlobalZero}(\mathsf{sym}_{1},\ \operatorname{sizeof}(B[x_{1}])),\ \ldots ,\ \operatorname{GlobalZero}(\mathsf{sym}_{k},\ \operatorname{sizeof}(B[x_{k}]))]
\end{array}
```

```math
\operatorname{InitSym}(m)\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"init"}]\ \mathbin{++} \ \operatorname{PathOfModule}(m))
```

**(InitFn)**

```math
\begin{array}{l}
\operatorname{InitSym}(m)\ =\ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{InitFn}(m)\ \Downarrow \ \mathsf{sym}
\end{array}
```

```math
\operatorname{DeinitSym}(m)\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"deinit"}]\ \mathbin{++} \ \operatorname{PathOfModule}(m))
```

**(DeinitFn)**

```math
\begin{array}{l}
\operatorname{DeinitSym}(m)\ =\ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{DeinitFn}(m)\ \Downarrow \ \mathsf{sym}
\end{array}
```

```math
\operatorname{StaticItems}(P,\ m)\ =\ [\ \mathsf{item}\ \mid \ \mathsf{item}\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \land \ \mathsf{item}\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_)\ ]
```

```math
\operatorname{StaticItemOf}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{item}\ \Leftrightarrow \ m\ =\ \mathsf{path}\ \land \ \mathsf{item}\ \in \ \operatorname{StaticItems}(\operatorname{Project}(\Gamma ),\ m)\ \land \ \mathsf{item}\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \mathsf{binding},\ \_,\ \_)\ \land \ \mathsf{name}\ \in \ \operatorname{StaticBindList}(\mathsf{binding})\ \land \ \forall \ \mathsf{item}'.\ (\mathsf{item}'\ \in \ \operatorname{StaticItems}(\operatorname{Project}(\Gamma ),\ m)\ \land \ \mathsf{item}'\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \mathsf{binding}',\ \_,\ \_)\ \land \ \mathsf{name}\ \in \ \operatorname{StaticBindList}(\mathsf{binding}'))\ \Rightarrow \ \mathsf{item}'\ =\ \mathsf{item}
```

```math
\operatorname{StaticSymPath}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{StaticSym}(\mathsf{item},\ \mathsf{name})\ \Leftrightarrow \ \operatorname{StaticItemOf}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{item}
```

```math
\operatorname{StaticAddr}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{addr}\ \Leftrightarrow \ \exists \ \mathsf{sym}.\ \operatorname{StaticSymPath}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{sym}\ \land \ \operatorname{AddrOfSym}(\mathsf{sym})\ =\ \mathsf{addr}
```

For hosted-library session execution, §24.4.1 reinterprets the `AddrOfSym(sym)` occurrence above session-locally for every hosted-state symbol.

```math
\mathsf{AddrOfSym}\ :\ \mathsf{Symbol}\ \to \ \mathsf{Addr}
```

```math
\operatorname{StaticType}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{StaticBindTypes}(\mathsf{binding})[\mathsf{name}]\ \Leftrightarrow \ \operatorname{StaticItemOf}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \mathsf{mut},\ \mathsf{binding},\ \_,\ \_)
```

```math
\operatorname{StaticBindInfo}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{BindInfoMap}(\lambda \ U.\ \operatorname{RespOfInit}(\mathsf{init}),\ \operatorname{StaticBindTypes}(\mathsf{binding}),\ \operatorname{MovOf}(\mathsf{op}),\ \mathsf{mut})[\mathsf{name}]\ \Leftrightarrow \ \operatorname{StaticItemOf}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \mathsf{mut},\ \mathsf{binding},\ \_,\ \_)\ \land \ \mathsf{binding}\ =\ \langle \_,\ \_,\ \mathsf{op},\ \mathsf{init},\ \_\rangle 
```

```math
\begin{array}{l}
\operatorname{SeqIRList}([])\ =\ \varepsilon  \\
\operatorname{SeqIRList}([\mathsf{IR}]\ \mathbin{++} \ \mathsf{IRs})\ =\ \operatorname{SeqIR}(\mathsf{IR},\ \operatorname{SeqIRList}(\mathsf{IRs}))
\end{array}
```

```math
\begin{array}{l}
\operatorname{StaticStoreIR}(\mathsf{item},\ [])\ =\ \varepsilon  \\
\operatorname{StaticStoreIR}(\mathsf{item},\ [\langle x,\ v\rangle ]\ \mathbin{++} \ \mathsf{bs})\ =\ \operatorname{SeqIR}(\operatorname{StoreGlobal}(\operatorname{StaticSym}(\mathsf{item},\ x),\ v),\ \operatorname{StaticStoreIR}(\mathsf{item},\ \mathsf{bs}))
\end{array}
```

**(Lower-StaticInit-Item)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})\quad \mathsf{binding}\ =\ \langle \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \_\rangle \quad \Gamma \ \vdash \ \operatorname{LowerExpr}(\mathsf{init})\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle \quad \Gamma \ \vdash \ \operatorname{MatchPattern}(\mathsf{pat},\ v)\ \Downarrow \ B\quad \operatorname{BindOrder}(\mathsf{pat},\ B)\ =\ \mathsf{binds}\quad \Gamma \ \vdash \ \operatorname{InitPanicHandle}(m)\ \Downarrow \ \mathsf{IR}_{p} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticInitItem}(m,\ \mathsf{item})\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{e},\ \operatorname{StaticStoreIR}(\mathsf{item},\ \mathsf{binds}),\ \mathsf{IR}_{p})
\end{array}
```

**(Lower-StaticInitItems-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticInitItems}(m,\ [])\ \Downarrow \ \varepsilon 
\end{array}
```

**(Lower-StaticInitItems-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticInitItem}(m,\ \mathsf{item})\ \Downarrow \ \mathsf{IR}_{i}\quad \Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticInitItems}(m,\ \mathsf{items})\ \Downarrow \ \mathsf{IR}_{r} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticInitItems}(m,\ [\mathsf{item}]\ \mathbin{++} \ \mathsf{items})\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{i},\ \mathsf{IR}_{r})
\end{array}
```

**(Lower-StaticInit)**

```math
\begin{array}{l}
\operatorname{StaticItems}(\operatorname{Project}(\Gamma ),\ m)\ =\ \mathsf{items}\quad \Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticInitItems}(m,\ \mathsf{items})\ \Downarrow \ \mathsf{IR} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticInit}(m)\ \Downarrow \ \mathsf{IR}
\end{array}
```

**(InitCallIR)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{InitFn}(m)\ \Downarrow \ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{InitCallIR}(m)\ \Downarrow \ \operatorname{SeqIR}(\operatorname{CallIR}(\mathsf{sym},\ [\mathsf{PanicOutName}]),\ \mathsf{PanicCheck})
\end{array}
```

```math
\begin{array}{l}
\operatorname{Rev}([])\ =\ [] \\
\operatorname{Rev}([x]\ \mathbin{++} \ \mathsf{xs})\ =\ \operatorname{Rev}(\mathsf{xs})\ \mathbin{++} \ [x]
\end{array}
```

**(Lower-StaticDeinitNames-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitNames}(\mathsf{path},\ \mathsf{item},\ [])\ \Downarrow \ \varepsilon 
\end{array}
```

**(Lower-StaticDeinitNames-Cons-Resp)**

```math
\begin{array}{l}
\operatorname{StaticBindInfo}(\mathsf{path},\ x).\mathsf{resp}\ =\ \mathsf{resp}\quad \mathsf{sym}\ =\ \operatorname{StaticSym}(\mathsf{item},\ x)\quad \Gamma \ \vdash \ \operatorname{StateRef}(\mathsf{sym})\ \Downarrow \ \mathsf{slot}\quad \Gamma \ \vdash \ \operatorname{EmitDrop}(\operatorname{StaticType}(\mathsf{path},\ x),\ \operatorname{Load}(\mathsf{slot},\ \operatorname{StaticType}(\mathsf{path},\ x)))\ \Downarrow \ \mathsf{IR}_{d}\quad \Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitNames}(\mathsf{path},\ \mathsf{item},\ \mathsf{xs})\ \Downarrow \ \mathsf{IR}_{r} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitNames}(\mathsf{path},\ \mathsf{item},\ [x]\ \mathbin{++} \ \mathsf{xs})\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{d},\ \mathsf{IR}_{r})
\end{array}
```

**(Lower-StaticDeinitNames-Cons-NoResp)**

```math
\begin{array}{l}
\operatorname{StaticBindInfo}(\mathsf{path},\ x).\mathsf{resp}\ \ne \ \mathsf{resp}\quad \Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitNames}(\mathsf{path},\ \mathsf{item},\ \mathsf{xs})\ \Downarrow \ \mathsf{IR}_{r} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitNames}(\mathsf{path},\ \mathsf{item},\ [x]\ \mathbin{++} \ \mathsf{xs})\ \Downarrow \ \mathsf{IR}_{r}
\end{array}
```

**(Lower-StaticDeinit-Item)**

```math
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})\quad \mathsf{binding}\ =\ \langle \mathsf{pat},\ \_,\ \_,\ \_,\ \_\rangle \quad \mathsf{xs}\ =\ \operatorname{Rev}(\operatorname{StaticBindList}(\mathsf{binding}))\quad \Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitNames}(\operatorname{PathOfModule}(m),\ \mathsf{item},\ \mathsf{xs})\ \Downarrow \ \mathsf{IR} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitItem}(m,\ \mathsf{item})\ \Downarrow \ \mathsf{IR}
\end{array}
```

**(Lower-StaticDeinitItems-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitItems}(m,\ [])\ \Downarrow \ \varepsilon 
\end{array}
```

**(Lower-StaticDeinitItems-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitItem}(m,\ \mathsf{item})\ \Downarrow \ \mathsf{IR}_{i}\quad \Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitItems}(m,\ \mathsf{items})\ \Downarrow \ \mathsf{IR}_{r} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitItems}(m,\ [\mathsf{item}]\ \mathbin{++} \ \mathsf{items})\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{i},\ \mathsf{IR}_{r})
\end{array}
```

**(Lower-StaticDeinit)**

```math
\begin{array}{l}
\operatorname{StaticItems}(\operatorname{Project}(\Gamma ),\ m)\ =\ \mathsf{items}\quad \Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinitItems}(m,\ \operatorname{Rev}(\mathsf{items}))\ \Downarrow \ \mathsf{IR} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{Lower}-\operatorname{StaticDeinit}(m)\ \Downarrow \ \mathsf{IR}
\end{array}
```

**(DeinitCallIR)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{DeinitFn}(m)\ \Downarrow \ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{DeinitCallIR}(m)\ \Downarrow \ \operatorname{SeqIR}(\operatorname{CallIR}(\mathsf{sym},\ [\mathsf{PanicOutName}]),\ \mathsf{PanicCheck})
\end{array}
```

```math
\begin{array}{l}
\mathsf{AddrOfSessionSym}\ :\ \mathsf{Session}\ \times \ \mathsf{Symbol}\ \to \ \mathsf{Addr} \\
\mathsf{SessionPanicRecordOf}\ :\ \mathsf{Store}\ \times \ \mathsf{Session}\ \to \ \langle \mathsf{pending},\ \mathsf{code}\rangle  \\
\operatorname{SessionPanicRecordInit}(\sigma ,\ h)\ \Leftrightarrow \ \operatorname{SessionPanicRecordOf}(\sigma ,\ h)\ =\ \langle \mathsf{false},\ 0\rangle 
\end{array}
```

```math
\begin{array}{l}
\operatorname{HostedStateSym}(P,\ \mathsf{sym})\ \Leftrightarrow \ \operatorname{HostedLibrary}(P)\ \land \ ((\exists \ m,\ \mathsf{name}.\ m\ \in \ P.\mathsf{modules}\ \land \ \operatorname{StaticSymPath}(m,\ \mathsf{name})\ =\ \mathsf{sym})\ \lor \ (\exists \ m.\ m\ \in \ P.\mathsf{modules}\ \land \ \Gamma \ \vdash \ \operatorname{PoisonFlag}(m)\ \Downarrow \ \mathsf{sym})) \\
\operatorname{SharedLibraryStateSym}(P,\ \mathsf{sym})\ \Leftrightarrow \ \operatorname{SharedLibrary}(P)\ \land \ ((\exists \ m,\ \mathsf{name}.\ m\ \in \ P.\mathsf{modules}\ \land \ \operatorname{StaticSymPath}(m,\ \mathsf{name})\ =\ \mathsf{sym})\ \lor \ (\exists \ m.\ m\ \in \ P.\mathsf{modules}\ \land \ \Gamma \ \vdash \ \operatorname{PoisonFlag}(m)\ \Downarrow \ \mathsf{sym})) \\
\operatorname{RawExportLibrary}(P)\ \Leftrightarrow \ \operatorname{SharedLibrary}(P)\ \land \ \operatorname{RawExports}(P)\ \ne \ []\ \land \ \lnot \ \operatorname{HostedLibrary}(P) \\
\operatorname{RawLibraryStateSym}(P,\ \mathsf{sym})\ \Leftrightarrow \ \operatorname{RawExportLibrary}(P)\ \land \ \operatorname{SharedLibraryStateSym}(P,\ \mathsf{sym}) \\
\mathsf{HostedStateJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{SessionStateInitSigma}(P,\ h,\ \sigma )\ \Downarrow \ \sigma ',\ \Gamma \ \vdash \ \operatorname{SessionStateDestroySigma}(P,\ h,\ \sigma )\ \Downarrow \ \sigma '\}
\end{array}
```

```math
A\ \mathsf{conforming}\ \mathsf{implementation}\ \mathsf{MUST}\ \mathsf{ensure}\ \mathsf{that}\ \mathsf{whenever}\ \texttt{Gamma |- SessionStateInitSigma(P, h, sigma) => sigma'},\ \texttt{ReadAddr(sigma', AddrOfSessionSym(h, sym))}\ \mathsf{is}\ \mathsf{defined}\ \mathsf{for}\ \mathsf{every}\ \texttt{sym}\ \mathsf{satisfying}\ \texttt{HostedStateSym(P, sym)},\ \mathsf{and}\ \mathsf{the}\ \mathsf{initial}\ \mathsf{contents}\ \mathsf{of}\ \mathsf{that}\ \mathsf{cell}\ \mathsf{equal}\ \mathsf{the}\ \mathsf{value}\ \mathsf{denoted}\ \mathsf{by}\ \mathsf{the}\ \texttt{GlobalConst}\ \mathsf{or}\ \texttt{GlobalZero}\ \mathsf{template}\ \mathsf{emitted}\ \mathsf{for}\ \texttt{sym}\ \mathsf{by}\ \S \S 24.4.1,\ 24.7.8,\ \mathsf{and}\ 24.7.13.
```

```math
A\ \mathsf{conforming}\ \mathsf{implementation}\ \mathsf{MUST}\ \mathsf{ensure}\ \mathsf{that}\ \mathsf{whenever}\ \texttt{Gamma |- SessionStateDestroySigma(P, h, sigma) => sigma'},\ \mathsf{the}\ \mathsf{cells}\ \mathsf{previously}\ \mathsf{reachable}\ \mathsf{at}\ \texttt{AddrOfSessionSym(h, sym)}\ \mathsf{for}\ \texttt{HostedStateSym(P, sym)}\ \mathsf{are}\ \mathsf{no}\ \mathsf{longer}\ \mathsf{live}.
```

```math
\mathsf{For}\ \texttt{HostedLibrary(P)}\ \mathsf{as}\ \mathsf{defined}\ \mathsf{by}\ \S 23.3.10,\ \mathsf{every}\ \mathsf{user}-\mathsf{static}\ \mathsf{storage}\ \mathsf{cell},\ \mathsf{poison}\ \mathsf{flag},\ \mathsf{and}\ \mathsf{boundary}\ \mathsf{panic}\ \mathsf{record}\ \mathsf{consumed}\ \mathsf{by}\ \mathsf{Chapters}\ 6,\ 24.4,\ \mathsf{and}\ 24.5\ \mathsf{MUST}\ \mathsf{be}\ \mathsf{indexed}\ \mathsf{by}\ \mathsf{the}\ \mathsf{live}\ \mathsf{hosted}\ \mathsf{session}\ \mathsf{within}\ \mathsf{the}\ \mathsf{dynamic}\ \mathsf{extent}\ \mathsf{of}\ \texttt{HostSessionInitSigma},\ \texttt{HostedCallSigma},\ \mathsf{and}\ \texttt{HostSessionDestroySigma}.\ \mathsf{Within}\ \mathsf{those}\ \mathsf{hosted}-\mathsf{session}\ \mathsf{dynamic}\ \mathsf{extents},\ \mathsf{every}\ \mathsf{occurrence}\ \mathsf{of}\ \texttt{AddrOfSym(sym)}\ \mathsf{in}\ \mathsf{those}\ \mathsf{rules}\ \mathsf{with}\ \texttt{HostedStateSym(P, sym)}\ \mathsf{MUST}\ \mathsf{be}\ \mathsf{interpreted}\ \mathsf{as}\ \texttt{AddrOfSessionSym(h, sym)}\ \mathsf{for}\ \mathsf{the}\ \mathsf{active}\ \mathsf{hosted}\ \mathsf{session}\ \texttt{h},\ \mathsf{and}\ \mathsf{every}\ \mathsf{boundary}\ \mathsf{panic}-\mathsf{record}\ \mathsf{operation}\ \mathsf{MUST}\ \mathsf{be}\ \mathsf{interpreted}\ \mathsf{through}\ \texttt{SessionPanicRecordOf(\_, h)}.\ \mathsf{For}\ \texttt{HostedLibrary(P) and SharedLibrary(P)},\ \mathsf{when}\ \mathsf{execution}\ \mathsf{occurs}\ \mathsf{outside}\ \mathsf{those}\ \mathsf{hosted}-\mathsf{session}\ \mathsf{dynamic}\ \mathsf{extents}\ \mathsf{but}\ \mathsf{within}\ \mathsf{one}\ \mathsf{live}\ \mathsf{loaded}\ \mathsf{library}\ \mathsf{image}\ \texttt{i},\ \mathsf{every}\ \mathsf{occurrence}\ \mathsf{of}\ \texttt{AddrOfSym(sym)}\ \mathsf{in}\ \mathsf{Chapters}\ 6,\ 24.4,\ \mathsf{and}\ 24.5\ \mathsf{with}\ \texttt{HostedStateSym(P, sym)}\ \mathsf{MUST}\ \mathsf{instead}\ \mathsf{be}\ \mathsf{interpreted}\ \mathsf{as}\ \texttt{AddrOfImageSym(i, sym)},\ \mathsf{and}\ \mathsf{every}\ \mathsf{boundary}\ \mathsf{panic}-\mathsf{record}\ \mathsf{operation}\ \mathsf{MUST}\ \mathsf{be}\ \mathsf{interpreted}\ \mathsf{through}\ \texttt{ImagePanicRecordOf(\_, i)}.\ \mathsf{Executables}\ \mathsf{and}\ \mathsf{libraries}\ \mathsf{that}\ \mathsf{are}\ \mathsf{not}\ \mathsf{shared}\ \mathsf{libraries}\ \mathsf{continue}\ \mathsf{to}\ \mathsf{use}\ \mathsf{the}\ \mathsf{process}-\mathsf{global}\ \mathsf{interpretation}\ \mathsf{of}\ \texttt{AddrOfSym(sym)}\ \mathsf{and}\ \texttt{PanicRecordOf(\_)}\ \mathsf{outside}\ \mathsf{hosted}-\mathsf{session}\ \mathsf{dynamic}\ \mathsf{extents}.
```

#### 24.4.2 Initialization Order, Poisoning, and Project Lifecycle

Section §11.5.4 supplies the eager static-initialization dependency graph `G_e`. This section defines only the ordering and execution semantics that consume that graph.

```math
\begin{array}{l}
\operatorname{Vertices}(G_{e})\ =\ V\ \Leftrightarrow \ G_{e}\ =\ \langle V,\ E\rangle  \\
\operatorname{Edges}(G_{e})\ =\ E\ \Leftrightarrow \ G_{e}\ =\ \langle V,\ E\rangle  \\
\operatorname{Index}(L,\ x)\ =\ i\ \Leftrightarrow \ 0\ \le \ i\ <\ \mid L\mid \ \land \ L[i]\ =\ x \\
\operatorname{TopoOrder}(G_{e},\ L)\ \Leftrightarrow \ \operatorname{Distinct}(L)\ \land \ \operatorname{Set}(L)\ =\ \operatorname{Vertices}(G_{e})\ \land \ \forall \ (u,\ v)\ \in \ \operatorname{Edges}(G_{e}).\ \operatorname{Index}(L,\ u)\ <\ \operatorname{Index}(L,\ v) \\
\mathsf{Incomparable}\_\{G_{e}\}(u,\ v)\ \Leftrightarrow \ \lnot \ \operatorname{Reachable}(u,\ v,\ \operatorname{Edges}(G_{e}))\ \land \ \lnot \ \operatorname{Reachable}(v,\ u,\ \operatorname{Edges}(G_{e})) \\
\operatorname{TopoTieBreak}(G_{e},\ L,\ P)\ \Leftrightarrow \ \forall \ u,\ v\ \in \ \operatorname{Vertices}(G_{e}).\ \mathsf{Incomparable}\_\{G_{e}\}(u,\ v)\ \land \ \operatorname{Index}(P.\mathsf{modules},\ u)\ <\ \operatorname{Index}(P.\mathsf{modules},\ v)\ \Rightarrow \ \operatorname{Index}(L,\ u)\ <\ \operatorname{Index}(L,\ v) \\
\operatorname{Cycle}(G_{e})\ \Leftrightarrow \ \exists \ v\ \in \ \operatorname{Vertices}(G_{e}).\ \operatorname{Reachable}(v,\ v,\ \operatorname{Edges}(G_{e}))
\end{array}
```

**(Topo-Ok)**

```math
\begin{array}{l}
\operatorname{Project}(\Gamma )\ =\ P\quad \Gamma \ \vdash \ G_{e}\ :\ \mathsf{DAG}\quad \operatorname{TopoOrder}(G_{e},\ L)\quad \operatorname{TopoTieBreak}(G_{e},\ L,\ P) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Topo}(G_{e})\ \Downarrow \ L
\end{array}
```

**(Topo-Cycle)**

```math
\begin{array}{l}
\operatorname{Cycle}(G_{e})\quad c\ =\ \operatorname{Code}(\mathsf{Topo}-\mathsf{Cycle}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Topo}(G_{e})\ \Uparrow \ c
\end{array}
```

```math
\begin{array}{l}
P\ =\ \operatorname{Project}(\Gamma ) \\
\operatorname{StaticInitOf}(\mathsf{item})\ =\ \mathsf{init}\ \Leftrightarrow \ \mathsf{item}\ =\ \operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})\ \land \ \mathsf{binding}\ =\ \langle \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \mathsf{sp}\rangle  \\
\operatorname{StaticInitOf}(\mathsf{item})\ =\ \bot \ \Leftrightarrow \ \mathsf{item}\ \notin \ \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_) \\
\operatorname{InitList}(m)\ =\ [\ \mathsf{init}\ \mid \ \mathsf{item}\ \in \ \operatorname{Items}(P,\ m)\ \land \ \operatorname{StaticInitOf}(\mathsf{item})\ =\ \mathsf{init}\ ]
\end{array}
```

```math
\begin{array}{l}
\operatorname{InitOrder}(G_{e})\ =\ L\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{Topo}(G_{e})\ \Downarrow \ L \\
\operatorname{InitPlan}(G_{e})\ =\ \mathbin{++} \_\{m\ \in \ \operatorname{InitOrder}(G_{e})\}\ \operatorname{InitList}(m)
\end{array}
```

```math
\operatorname{DeinitOrder}(G_{e})\ =\ \operatorname{rev}(\operatorname{InitOrder}(G_{e}))
```

```math
\operatorname{StaticBindOrder}(m)\ =\ \mathbin{++} \_\{\mathsf{item}\ \in \ \operatorname{StaticItems}(P,\ m),\ \mathsf{item}\ =\ \operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc})\}\ [\langle \operatorname{PathOfModule}(m),\ x\rangle \ \mid \ x\ \in \ \operatorname{StaticBindList}(\mathsf{binding})]
```

```math
\mathsf{GlobalStaticOrder}\ =\ \mathbin{++} \_\{m\ \in \ \operatorname{InitOrder}(G_{e})\}\ \operatorname{StaticBindOrder}(m)
```

```math
\operatorname{DeinitList}(P)\ =\ \operatorname{rev}([\ \operatorname{DropStatic}(\mathsf{path},\ \mathsf{name})\ \mid \ \langle \mathsf{path},\ \mathsf{name}\rangle \ \in \ \mathsf{GlobalStaticOrder}\ \land \ \operatorname{StaticBindInfo}(\mathsf{path},\ \mathsf{name}).\mathsf{resp}\ =\ \mathsf{resp}\ ])
```

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Eval}(e,\ \sigma )\ \Downarrow \ v\ \Leftrightarrow \ \exists \ \sigma '.\ \Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma ') \\
\Gamma \ \vdash \ \operatorname{Eval}(e,\ \sigma )\ \Uparrow \ \mathsf{panic}\ \Leftrightarrow \ \exists \ \sigma '.\ \Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma ')
\end{array}
```

**(EmitInitPlan)**

```math
\begin{array}{l}
\mathsf{InitOrder}\ =\ [m_{1},\ \ldots ,\ m_{k}]\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{InitCallIR}(m_{i})\ \Downarrow \ \mathsf{IR}_{i}\quad \mathsf{IR}_{\mathsf{init}}\ =\ \operatorname{SeqIRList}([\mathsf{IR}_{1},\ \ldots ,\ \mathsf{IR}_{k}]) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EmitInitPlan}(P)\ \Downarrow \ \mathsf{IR}_{\mathsf{init}}
\end{array}
```

**(EmitInitPlan-Err)**

```math
\begin{array}{l}
\exists \ m\ \in \ \mathsf{InitOrder}.\ \Gamma \ \vdash \ \operatorname{InitFn}(m)\ \Uparrow  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EmitInitPlan}(P)\ \Uparrow 
\end{array}
```

**(EmitDeinitPlan)**

```math
\begin{array}{l}
\mathsf{InitOrder}\ =\ [m_{1},\ \ldots ,\ m_{k}]\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{DeinitCallIR}(m_{i})\ \Downarrow \ \mathsf{IR}_{i}\quad \mathsf{IR}_{\mathsf{deinit}}\ =\ \operatorname{SeqIRList}(\operatorname{Rev}([\mathsf{IR}_{1},\ \ldots ,\ \mathsf{IR}_{k}])) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EmitDeinitPlan}(P)\ \Downarrow \ \mathsf{IR}_{\mathsf{deinit}}
\end{array}
```

**(EmitDeinitPlan-Err)**

```math
\begin{array}{l}
\exists \ m\ \in \ \mathsf{InitOrder}.\ \Gamma \ \vdash \ \operatorname{DeinitFn}(m)\ \Uparrow  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EmitDeinitPlan}(P)\ \Uparrow 
\end{array}
```

```math
\begin{array}{l}
\mathsf{InitState}\ =\ \{\operatorname{InitStart}(G_{e},\ L,\ \sigma ),\ \operatorname{InitMod}(L,\ \mathsf{mi},\ \mathsf{ii},\ P,\ \sigma ),\ \operatorname{InitDone}(\sigma ),\ \operatorname{InitPanic}(P,\ \sigma )\} \\
\operatorname{InitItem}(L,\ \mathsf{mi},\ \mathsf{ii})\ =\ e\ \Leftrightarrow \ \mathsf{mi}\ <\ \mid L\mid \ \land \ L[\mathsf{mi}]\ =\ m\ \land \ \operatorname{InitList}(m)[\mathsf{ii}]\ =\ e \\
\operatorname{InitLen}(L,\ \mathsf{mi})\ =\ k\ \Leftrightarrow \ \mathsf{mi}\ <\ \mid L\mid \ \land \ L[\mathsf{mi}]\ =\ m\ \land \ \mid \operatorname{InitList}(m)\mid \ =\ k
\end{array}
```

**(Init-Start)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\langle \operatorname{InitStart}(G_{e},\ L,\ \sigma )\rangle \ \to \ \langle \operatorname{InitMod}(L,\ 0,\ 0,\ \emptyset ,\ \sigma )\rangle 
\end{array}
```

**(Init-Step)**

```math
\begin{array}{l}
\operatorname{InitItem}(L,\ \mathsf{mi},\ \mathsf{ii})\ =\ e\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma ') \\
\rule{18em}{0.4pt} \\
\langle \operatorname{InitMod}(L,\ \mathsf{mi},\ \mathsf{ii},\ P,\ \sigma )\rangle \ \to \ \langle \operatorname{InitMod}(L,\ \mathsf{mi},\ \mathsf{ii}\ +\ 1,\ P,\ \sigma ')\rangle 
\end{array}
```

**(Init-Next-Module)**

```math
\begin{array}{l}
\operatorname{InitLen}(L,\ \mathsf{mi})\ =\ k\quad \mathsf{ii}\ =\ k \\
\rule{18em}{0.4pt} \\
\langle \operatorname{InitMod}(L,\ \mathsf{mi},\ \mathsf{ii},\ P,\ \sigma )\rangle \ \to \ \langle \operatorname{InitMod}(L,\ \mathsf{mi}\ +\ 1,\ 0,\ P,\ \sigma )\rangle 
\end{array}
```

**(Init-Panic)**

```math
\begin{array}{l}
\operatorname{InitItem}(L,\ \mathsf{mi},\ \mathsf{ii})\ =\ e\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma ')\quad L[\mathsf{mi}]\ =\ m\quad P'\ =\ P\ \cup \ \{m\}\ \cup \ \{x\ \mid \ \operatorname{Reachable}(x,\ m,\ E_{\mathsf{val}}^\{\mathsf{eager}\})\} \\
\rule{18em}{0.4pt} \\
\langle \operatorname{InitMod}(L,\ \mathsf{mi},\ \mathsf{ii},\ P,\ \sigma )\rangle \ \to \ \langle \operatorname{InitPanic}(P',\ \sigma ')\rangle 
\end{array}
```

**(Init-Done)**
mi = |L|

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\langle \operatorname{InitMod}(L,\ \mathsf{mi},\ \mathsf{ii},\ P,\ \sigma )\rangle \ \to \ \langle \operatorname{InitDone}(\sigma )\rangle 
\end{array}
```

**(Init-Ok)**

```math
\begin{array}{l}
\langle \operatorname{InitStart}(G_{e},\ \operatorname{InitOrder}(G_{e}),\ \sigma )\rangle \ \to *\ \langle \operatorname{InitDone}(\sigma ')\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Init}(G_{e},\ \sigma )\ \Downarrow \ \sigma '
\end{array}
```

**(Init-Fail)**

```math
\begin{array}{l}
\langle \operatorname{InitStart}(G_{e},\ \operatorname{InitOrder}(G_{e}),\ \sigma )\rangle \ \to *\ \langle \operatorname{InitPanic}(P,\ \sigma ')\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Init}(G_{e},\ \sigma )\ \Uparrow \ \operatorname{panic}(P)
\end{array}
```

**(Deinit-Ok)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Cleanup}(\operatorname{DeinitList}(P),\ \sigma )\ \Downarrow \ (\mathsf{ok},\ \sigma ') \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Deinit}(P,\ \sigma )\ \Downarrow \ \sigma '
\end{array}
```

**(Deinit-Panic)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Cleanup}(\operatorname{DeinitList}(P),\ \sigma )\ \Downarrow \ (\mathsf{panic},\ \sigma ') \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Deinit}(P,\ \sigma )\ \Uparrow \ \mathsf{panic}
\end{array}
```

#### 24.4.3 Entry Symbols and Context Construction

```math
\mathsf{EntryJudg}\ =\ \{\mathsf{EntrySym}\ \Downarrow \ \mathsf{sym},\ \mathsf{ContextInitSym}\ \Downarrow \ \mathsf{sym},\ \operatorname{EntryStub}(P)\ \Downarrow \ \mathsf{IRDecl}\}
```

**(EntrySym-Decl)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{EntrySym}\ \Downarrow \ \operatorname{PathSig}([\texttt{"main"}])
\end{array}
```

**(ContextInitSym-Decl)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{ContextInitSym}\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"context\_init"}])
\end{array}
```

```math
\mathsf{ProcessInvocation}\ =\ \langle \mathsf{executable}_{\mathsf{path}},\ \mathsf{arguments},\ \mathsf{current}_{\mathsf{directory}}\rangle 
```

```math
\begin{array}{l}
\operatorname{ProcessInvocationNormalization}(\mathsf{host})\ \Downarrow \ \mathsf{inv}\ \Leftrightarrow  \\
\ \mathsf{inv}.\mathsf{executable}_{\mathsf{path}}\ \mathsf{is}\ \mathsf{the}\ \mathsf{host}\ \mathsf{executable}\ \mathsf{path}\ \mathsf{normalized}\ \mathsf{to}\ \mathsf{UTF}-8\ \mathsf{text}\ \land  \\
\ \mathsf{inv}.\mathsf{arguments}\ \mathsf{is}\ \mathsf{the}\ \mathsf{ordered}\ \mathsf{list}\ \mathsf{of}\ \mathsf{host}\ \mathsf{command}\ \mathsf{arguments}\ \mathsf{after}\ \mathsf{the}\ \mathsf{executable}\ \mathsf{path}, \\
\quad \mathsf{each}\ \mathsf{normalized}\ \mathsf{to}\ \mathsf{UTF}-8\ \mathsf{text}\ \land  \\
\ \mathsf{inv}.\mathsf{current}_{\mathsf{directory}}\ \mathsf{is}\ \mathsf{the}\ \mathsf{host}\ \mathsf{current}\ \mathsf{working}\ \mathsf{directory}\ \mathsf{normalized}\ \mathsf{to}\ \mathsf{UTF}-8\ \mathsf{text}
\end{array}
```

A conforming runtime MUST isolate platform-specific process startup, argv, path
encoding, and current-directory acquisition behind the runtime host/platform
boundary. Source programs observe only the normalized `System` methods defined
by `SystemInterface`.

```math
\begin{array}{l}
\operatorname{PanicRecordInit}(\sigma )\ \Leftrightarrow \ \operatorname{PanicRecordOf}(\sigma )\ =\ \langle \mathsf{false},\ 0\rangle  \\
\operatorname{EntryStubSpec}(P,\ \mathsf{IR}_{\mathsf{entry}})\ \Leftrightarrow \ \operatorname{Executable}(P)\ \land \ \exists \ d,\ \mathsf{main}_{\mathsf{sym}}.\ \operatorname{MainDecls}(P)\ =\ [d]\ \land \ \Gamma \ \vdash \ \operatorname{Mangle}(d)\ \Downarrow \ \mathsf{main}_{\mathsf{sym}}\ \land \ \forall \ \sigma .\ \exists \ \mathsf{ctx},\ \mathsf{arg},\ \mathsf{ret},\ c,\ \sigma_{1} ,\ \sigma_{2} ,\ \sigma_{3} . \\
\ \operatorname{ExecIRSigma}(\operatorname{CallIR}(\mathsf{ContextInitSym},\ []),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{ctx}),\ \sigma_{1} )\ \land \ \operatorname{ContextBundleBuild}(\operatorname{StripPerm}(\operatorname{MainArgType}(d)),\ \mathsf{ctx})\ \Downarrow \ \mathsf{arg}\ \land \ \operatorname{PanicRecordInit}(\sigma_{1} )\ \land \ \operatorname{ExecIRSigma}(\operatorname{CallIR}(\mathsf{main}_{\mathsf{sym}},\ [\mathsf{arg},\ \mathsf{PanicOutName}]),\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(\mathsf{ret}),\ \sigma_{2} )\ \land  \\
\ (\operatorname{PanicRecordOf}(\sigma_{2} )\ =\ \langle \mathsf{true},\ c\rangle \ \Rightarrow \ \operatorname{ExecIRSigma}(\operatorname{CallIR}(\mathsf{PanicSym},\ [c]),\ \sigma_{2} )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma_{3} ))\ \land  \\
\ (\operatorname{PanicRecordOf}(\sigma_{2} )\ =\ \langle \mathsf{false},\ c\rangle \ \Rightarrow \ \exists \ \mathsf{IR}_{d}.\ \Gamma \ \vdash \ \operatorname{EmitDeinitPlan}(P)\ \Downarrow \ \mathsf{IR}_{d}\ \land \ \operatorname{ExecIRSigma}(\mathsf{IR}_{d},\ \sigma_{2} )\ \Downarrow \ (\operatorname{Val}(()),\ \sigma_{3} ))\ \land  \\
\ (\operatorname{PanicRecordOf}(\sigma_{2} )\ =\ \langle \mathsf{true},\ c\rangle \ \Rightarrow \ \operatorname{ExecIRSigma}(\mathsf{IR}_{\mathsf{entry}},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma_{3} ))\ \land  \\
\ (\operatorname{PanicRecordOf}(\sigma_{2} )\ =\ \langle \mathsf{false},\ c\rangle \ \Rightarrow \ \operatorname{ExecIRSigma}(\mathsf{IR}_{\mathsf{entry}},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{ret}),\ \sigma_{3} ))
\end{array}
```

**(EntryStub-Decl)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \mathsf{EntrySym}\ \Downarrow \ \mathsf{sym}\quad \operatorname{EntryStubSpec}(P,\ \mathsf{IR}_{\mathsf{entry}}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EntryStub}(P)\ \Downarrow \ \operatorname{ProcIR}(\mathsf{sym},\ [],\ \operatorname{TypePrim}(\texttt{"i32"}),\ \mathsf{IR}_{\mathsf{entry}})
\end{array}
```

**(EntrySym-Err)**
EntrySym undefined

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{EntrySym}\ \Uparrow 
\end{array}
```

**(EntryStub-Err)**
EntryStub(P) undefined

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EntryStub}(P)\ \Uparrow 
\end{array}
```

#### 24.4.4 Library Images and Hosted Library Sessions

```math
\mathsf{LibraryImageJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{LibraryImageInitSigma}(P,\ i,\ \sigma )\ \Downarrow \ \sigma ',\ \Gamma \ \vdash \ \operatorname{RawLibraryCallSigma}(P,\ i,\ d,\ \mathsf{vs},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma '),\ \Gamma \ \vdash \ \operatorname{LibraryImageDestroySigma}(P,\ i,\ \sigma )\ \Downarrow \ \sigma '\}
```
LibraryImageHandle(i) is an abstract predicate over loaded shared-library images.

```math
\begin{array}{l}
\operatorname{LibraryImageValid}(P,\ i,\ \sigma )\ \Leftrightarrow \ \operatorname{LibraryImageHandle}(i)\ \land \ \operatorname{LibraryImageOwner}(i)\ =\ P\ \land \ \operatorname{LibraryImageLive}(i,\ \sigma ) \\
\mathsf{LibraryImageOwner}\ :\ \mathsf{LibraryImage}\ \to \ \mathsf{Project} \\
\mathsf{LibraryImageLive}\ :\ \mathsf{LibraryImage}\ \times \ \mathsf{Store}\ \to \ \mathsf{Bool} \\
\mathsf{AddrOfImageSym}\ :\ \mathsf{LibraryImage}\ \times \ \mathsf{Symbol}\ \to \ \mathsf{Addr} \\
\mathsf{ImagePanicRecordOf}\ :\ \mathsf{Store}\ \times \ \mathsf{LibraryImage}\ \to \ \langle \mathsf{pending},\ \mathsf{code}\rangle  \\
\operatorname{ImagePanicRecordInit}(\sigma ,\ i)\ \Leftrightarrow \ \operatorname{ImagePanicRecordOf}(\sigma ,\ i)\ =\ \langle \mathsf{false},\ 0\rangle  \\
\operatorname{DistinctLibraryImageState}(\sigma )\ \Leftrightarrow \ \forall \ i_{1},\ i_{2}.\ i_{1}\ \ne \ i_{2}\ \land \ \operatorname{LibraryImageLive}(i_{1},\ \sigma )\ \land \ \operatorname{LibraryImageLive}(i_{2},\ \sigma )\ \Rightarrow \ \forall \ \mathsf{sym}.\ (\operatorname{SharedLibraryStateSym}(\operatorname{LibraryImageOwner}(i_{1}),\ \mathsf{sym})\ \lor \ \operatorname{SharedLibraryStateSym}(\operatorname{LibraryImageOwner}(i_{2}),\ \mathsf{sym}))\ \Rightarrow \ \operatorname{AddrOfImageSym}(i_{1},\ \mathsf{sym})\ \ne \ \operatorname{AddrOfImageSym}(i_{2},\ \mathsf{sym})
\end{array}
```

```math
\begin{array}{l}
A\ \mathsf{conforming}\ \mathsf{implementation}\ \mathsf{MUST}\ \mathsf{ensure}\ \texttt{DistinctLibraryImageState(sigma)}\ \mathsf{for}\ \mathsf{every}\ \mathsf{store}\ \texttt{sigma}. \\
A\ \mathsf{conforming}\ \mathsf{implementation}\ \mathsf{MUST}\ \mathsf{ensure}\ \mathsf{that}\ \mathsf{every}\ \mathsf{successful}\ \texttt{LibraryImageInitSigma(P, i, sigma) => sigma'}\ \mathsf{establishes}\ \texttt{LibraryImageLive(i, sigma')},\ \mathsf{every}\ \mathsf{successful}\ \texttt{RawLibraryCallSigma(P, i, d, vs, sigma) => (out, sigma')}\ \mathsf{establishes}\ \texttt{LibraryImageLive(i, sigma')},\ \mathsf{and}\ \mathsf{every}\ \mathsf{successful}\ \texttt{LibraryImageDestroySigma(P, i, sigma) => sigma'}\ \mathsf{establishes}\ \texttt{not LibraryImageLive(i, sigma')}. \\
A\ \mathsf{conforming}\ \mathsf{implementation}\ \mathsf{MUST}\ \mathsf{ensure}\ \mathsf{that}\ \mathsf{whenever}\ \texttt{Gamma |- LibraryImageInitSigma(P, i, sigma) => sigma'},\ \texttt{ReadAddr(sigma', AddrOfImageSym(i, sym))}\ \mathsf{is}\ \mathsf{defined}\ \mathsf{for}\ \mathsf{every}\ \texttt{sym}\ \mathsf{satisfying}\ \texttt{SharedLibraryStateSym(P, sym)},\ \mathsf{and}\ \mathsf{the}\ \mathsf{initial}\ \mathsf{contents}\ \mathsf{of}\ \mathsf{that}\ \mathsf{cell}\ \mathsf{equal}\ \mathsf{the}\ \mathsf{value}\ \mathsf{denoted}\ \mathsf{by}\ \mathsf{the}\ \texttt{GlobalConst}\ \mathsf{or}\ \texttt{GlobalZero}\ \mathsf{template}\ \mathsf{emitted}\ \mathsf{for}\ \texttt{sym}\ \mathsf{by}\ \S \S 24.4.1,\ 24.7.8,\ \mathsf{and}\ 24.7.13. \\
A\ \mathsf{conforming}\ \mathsf{implementation}\ \mathsf{MUST}\ \mathsf{ensure}\ \mathsf{that}\ \mathsf{whenever}\ \texttt{Gamma |- LibraryImageDestroySigma(P, i, sigma) => sigma'},\ \mathsf{the}\ \mathsf{cells}\ \mathsf{previously}\ \mathsf{reachable}\ \mathsf{at}\ \texttt{AddrOfImageSym(i, sym)}\ \mathsf{for}\ \texttt{SharedLibraryStateSym(P, sym)}\ \mathsf{are}\ \mathsf{no}\ \mathsf{longer}\ \mathsf{live}. \\
\mathsf{For}\ \texttt{SharedLibrary(P)},\ \mathsf{within}\ \mathsf{the}\ \mathsf{dynamic}\ \mathsf{extent}\ \mathsf{of}\ \texttt{LibraryImageInitSigma(P, i, sigma)}\ \mathsf{and}\ \texttt{LibraryImageDestroySigma(P, i, sigma)},\ \mathsf{every}\ \mathsf{occurrence}\ \mathsf{of}\ \texttt{AddrOfSym(sym)}\ \mathsf{in}\ \mathsf{Chapters}\ 6,\ 24.4,\ \mathsf{and}\ 24.5\ \mathsf{with}\ \texttt{SharedLibraryStateSym(P, sym)}\ \mathsf{MUST}\ \mathsf{be}\ \mathsf{interpreted}\ \mathsf{as}\ \texttt{AddrOfImageSym(i, sym)}\ \mathsf{for}\ \mathsf{the}\ \mathsf{active}\ \mathsf{loaded}\ \mathsf{image}\ \texttt{i},\ \mathsf{and}\ \mathsf{every}\ \mathsf{boundary}\ \mathsf{panic}-\mathsf{record}\ \mathsf{operation}\ \mathsf{MUST}\ \mathsf{be}\ \mathsf{interpreted}\ \mathsf{through}\ \texttt{ImagePanicRecordOf(\_, i)}.\ \mathsf{For}\ \texttt{RawExportLibrary(P)},\ \mathsf{that}\ \mathsf{same}\ \mathsf{image}\ \mathsf{interpretation}\ \mathsf{also}\ \mathsf{governs}\ \texttt{RawLibraryCallSigma(P, i, d, vs, sigma)}. \\
\mathsf{If}\ \mathsf{initialization}\ \mathsf{of}\ \mathsf{one}\ \mathsf{module}\ \texttt{m\_j}\ \mathsf{within}\ \texttt{LibraryImageInitSigma(P, i, sigma)}\ \mathsf{or}\ \texttt{HostSessionInitSigma(P, sigma)}\ \mathsf{panics}\ \mathsf{after}\ \mathsf{only}\ a\ \mathsf{strict}\ \mathsf{prefix}\ \mathsf{of}\ \mathsf{that}\ \mathsf{module}'s\ \mathsf{responsible}\ \mathsf{static}\ \mathsf{bindings}\ \mathsf{has}\ \mathsf{completed}\ \texttt{StaticStoreIR},\ \mathsf{cleanup}\ \mathsf{MUST}\ \mathsf{be}\ \mathsf{limited}\ \mathsf{to}\ \mathsf{the}\ \mathsf{successfully}\ \mathsf{initialized}\ \mathsf{prefix}.\ \mathsf{The}\ \mathsf{implementation}\ \mathsf{MUST}\ \mathsf{execute}\ \texttt{DropStaticActionOut(m\_j, x\_t), ..., DropStaticActionOut(m\_j, x\_1)}\ \mathsf{only}\ \mathsf{for}\ \mathsf{the}\ \mathsf{completed}\ \mathsf{prefix}\ \texttt{[x\_1, ..., x\_t]}\ \mathsf{in}\ \mathsf{reverse}\ \mathsf{order},\ \mathsf{MUST}\ \mathsf{NOT}\ \mathsf{execute}\ \mathsf{the}\ \mathsf{remaining}\ \mathsf{static}\ \mathsf{deinit}\ \mathsf{actions}\ \mathsf{of}\ \texttt{m\_j},\ \mathsf{MUST}\ \mathsf{execute}\ \mathsf{full}\ \mathsf{module}\ \mathsf{deinit}\ \mathsf{only}\ \mathsf{for}\ \mathsf{the}\ \mathsf{earlier}\ \mathsf{modules}\ \mathsf{whose}\ \mathsf{init}\ \mathsf{completed}\ \mathsf{successfully},\ \mathsf{and}\ \mathsf{MUST}\ \mathsf{NOT}\ \mathsf{deinitialize}\ \mathsf{any}\ \mathsf{later}\ \mathsf{module}.
\end{array}
```

```math
\begin{array}{l}
A\ \mathsf{raw}\ \mathsf{export}\ \mathsf{call}\ \mathsf{from}\ \mathsf{foreign}\ \mathsf{code}\ \mathsf{on}\ \texttt{RawExportLibrary(P)}\ \mathsf{occurs}\ \mathsf{only}\ \mathsf{with}\ \mathsf{one}\ \mathsf{live}\ \mathsf{loaded}\ \mathsf{library}\ \mathsf{image}\ \texttt{i}\ \mathsf{owned}\ \mathsf{by}\ \texttt{P}.\ \mathsf{Before}\ \mathsf{the}\ \mathsf{first}\ \mathsf{raw}\ \mathsf{export}\ \mathsf{call}\ \mathsf{through}\ a\ \mathsf{newly}\ \mathsf{loaded}\ \mathsf{image},\ \mathsf{the}\ \mathsf{implementation}\ \mathsf{MUST}\ \mathsf{establish}\ \mathsf{that}\ \mathsf{live}\ \mathsf{image}\ \mathsf{by}\ \texttt{LibraryImageInitSigma(P, i, sigma)}.\ \mathsf{Later}\ \mathsf{raw}\ \mathsf{export}\ \mathsf{calls}\ \mathsf{through}\ \mathsf{the}\ \mathsf{same}\ \mathsf{live}\ \mathsf{image}\ \mathsf{MUST}\ \mathsf{reuse}\ \mathsf{that}\ \mathsf{image}-\mathsf{owned}\ \mathsf{state}.\ \mathsf{On}\ \mathsf{library}\ \mathsf{unload}\ \mathsf{of}\ \mathsf{that}\ \mathsf{live}\ \mathsf{image},\ \mathsf{the}\ \mathsf{implementation}\ \mathsf{MUST}\ \mathsf{execute}\ \texttt{LibraryImageDestroySigma(P, i, sigma)}\ \mathsf{exactly}\ \mathsf{once}. \\
\mathsf{An}\ \mathsf{ordinary}\ \mathsf{Ultraviolet}\ \mathsf{call}\ \mathsf{that}\ \mathsf{crosses}\ a\ \mathsf{shared}-\mathsf{library}\ \mathsf{link}\ \mathsf{boundary}\ \mathsf{into}\ \texttt{SharedLibrary(P)}\ \mathsf{likewise}\ \mathsf{occurs}\ \mathsf{only}\ \mathsf{with}\ \mathsf{one}\ \mathsf{live}\ \mathsf{loaded}\ \mathsf{library}\ \mathsf{image}\ \texttt{i}\ \mathsf{owned}\ \mathsf{by}\ \texttt{P}.\ \mathsf{Before}\ \mathsf{the}\ \mathsf{first}\ \mathsf{such}\ \mathsf{linked}\ \mathsf{call}\ \mathsf{through}\ a\ \mathsf{newly}\ \mathsf{loaded}\ \mathsf{image},\ \mathsf{the}\ \mathsf{implementation}\ \mathsf{MUST}\ \mathsf{establish}\ \mathsf{that}\ \mathsf{live}\ \mathsf{image}\ \mathsf{by}\ \texttt{LibraryImageInitSigma(P, i, sigma)}.\ \mathsf{Later}\ \mathsf{linked}\ \mathsf{calls}\ \mathsf{through}\ \mathsf{the}\ \mathsf{same}\ \mathsf{live}\ \mathsf{image}\ \mathsf{MUST}\ \mathsf{reuse}\ \mathsf{that}\ \mathsf{image}-\mathsf{owned}\ \mathsf{state}.\ \mathsf{On}\ \mathsf{library}\ \mathsf{unload}\ \mathsf{of}\ \mathsf{that}\ \mathsf{live}\ \mathsf{image},\ \mathsf{the}\ \mathsf{implementation}\ \mathsf{MUST}\ \mathsf{execute}\ \texttt{LibraryImageDestroySigma(P, i, sigma)}\ \mathsf{exactly}\ \mathsf{once}. \\
\mathsf{On}\ \mathsf{targets}\ \mathsf{whose}\ \mathsf{shared}-\mathsf{library}\ \mathsf{linker}\ \mathsf{selects}\ \mathsf{one}\ \mathsf{loader}\ \mathsf{entrypoint}\ \mathsf{symbol}\ \mathsf{for}\ \mathsf{process}\ \mathsf{attach}/\mathsf{detach},\ a\ \mathsf{conforming}\ \mathsf{backend}\ \mathsf{MUST}\ \mathsf{emit}\ \mathsf{exactly}\ \mathsf{one}\ \mathsf{backend}-\mathsf{generated}\ \mathsf{loader}\ \mathsf{entrypoint}\ \mathsf{for}\ \mathsf{each}\ \mathsf{linked}\ \mathsf{image}\ \mathsf{of}\ \texttt{SharedLibrary(P)}.\ \mathsf{That}\ \mathsf{loader}\ \mathsf{entrypoint}\ \mathsf{is}\ \mathsf{not}\ a\ \mathsf{user}-\mathsf{declared}\ \texttt{ProcedureDecl}.\ \mathsf{It}\ \mathsf{MUST}\ \mathsf{establish}\ \texttt{LibraryImageInitSigma(P, i, sigma)}\ \mathsf{before}\ \mathsf{user}\ \mathsf{code}\ \mathsf{first}\ \mathsf{becomes}\ \mathsf{callable}\ \mathsf{from}\ \mathsf{that}\ \mathsf{image},\ \mathsf{MUST}\ \mathsf{execute}\ \texttt{LibraryImageDestroySigma(P, i, sigma)}\ \mathsf{on}\ \mathsf{image}\ \mathsf{unload},\ \mathsf{and}\ \mathsf{MUST}\ \mathsf{NOT}\ \mathsf{expose}\ \mathsf{any}\ \mathsf{additional}\ \mathsf{capability}-\mathsf{bearing}\ \mathsf{parameter}\ \mathsf{to}\ \mathsf{Ultraviolet}\ \mathsf{user}\ \mathsf{code}.
\end{array}
```

**(LibraryImageInitSigma)**

```math
\begin{array}{l}
\operatorname{SharedLibrary}(P)\quad \operatorname{LibraryImageHandle}(i)\quad \operatorname{LibraryImageOwner}(i)\ =\ P\quad \operatorname{ImagePanicRecordInit}(\sigma ,\ i)\quad \Gamma \ \vdash \ \operatorname{Init}(G_{e},\ \sigma )\ \Downarrow \ \sigma ' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LibraryImageInitSigma}(P,\ i,\ \sigma )\ \Downarrow \ \sigma '
\end{array}
```

**(RawLibraryCallSigma-Ok)**

```math
\begin{array}{l}
\operatorname{LibraryImageValid}(P,\ i,\ \sigma )\quad \operatorname{RawExportLibrary}(P)\quad d\ \in \ \operatorname{RawExports}(P)\quad \Gamma \ \vdash \ \operatorname{ApplyProcSigma}(d,\ \mathsf{vs},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{RawLibraryCallSigma}(P,\ i,\ d,\ \mathsf{vs},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')
\end{array}
```

**(LibraryImageDestroySigma)**

```math
\begin{array}{l}
\operatorname{LibraryImageValid}(P,\ i,\ \sigma )\quad \operatorname{SharedLibrary}(P)\quad \Gamma \ \vdash \ \operatorname{Deinit}(P,\ \sigma )\ \Downarrow \ \sigma ' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LibraryImageDestroySigma}(P,\ i,\ \sigma )\ \Downarrow \ \sigma '
\end{array}
```

```math
\mathsf{HostedSessionJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{HostSessionInitSigma}(P,\ \sigma )\ \Downarrow \ (\operatorname{Val}(h),\ \sigma '),\ \Gamma \ \vdash \ \operatorname{HostedCallSigma}(P,\ h,\ d,\ \mathsf{vs},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma '),\ \Gamma \ \vdash \ \operatorname{HostSessionDestroySigma}(P,\ h,\ \sigma )\ \Downarrow \ \sigma '\}
```
SessionHandle(h) is an abstract predicate over hosted-library session handles. At the foreign ABI, hosted-library session handles are represented as nonzero `usize` tokens.

```math
\begin{array}{l}
\operatorname{SessionValid}(P,\ h,\ \sigma )\ \Leftrightarrow \ \operatorname{SessionHandle}(h)\ \land \ \operatorname{HostedSessionOwner}(h)\ =\ P\ \land \ \operatorname{SessionLive}(h,\ \sigma ) \\
\operatorname{SessionReady}(P,\ h,\ \sigma )\ \Leftrightarrow \ \operatorname{SessionValid}(P,\ h,\ \sigma )\ \land \ \lnot \ \operatorname{SessionBusy}(h,\ \sigma ) \\
\mathsf{HostedSessionOwner}\ :\ \mathsf{Session}\ \to \ \mathsf{Project} \\
\mathsf{SessionContext}\ :\ \mathsf{Session}\ \to \ \mathsf{Value} \\
\mathsf{HostedGrantedCaps}\ :\ \mathsf{Project}\ \times \ \mathsf{Session}\ \to \ 𝒫(\mathsf{CapToken}) \\
\operatorname{HostedGrantVisible}(P,\ h,\ T)\ \Leftrightarrow \ \operatorname{CapInType}(\operatorname{StripPerm}(T))\ \subseteq \ \operatorname{HostedGrantedCaps}(P,\ h) \\
\mathsf{SessionLive}\ :\ \mathsf{Session}\ \times \ \mathsf{Store}\ \to \ \mathsf{Bool} \\
\mathsf{SessionBusy}\ :\ \mathsf{Session}\ \times \ \mathsf{Store}\ \to \ \mathsf{Bool} \\
\operatorname{DistinctHostedState}(\sigma )\ \Leftrightarrow \ \forall \ h_{1},\ h_{2}.\ h_{1}\ \ne \ h_{2}\ \land \ \operatorname{SessionLive}(h_{1},\ \sigma )\ \land \ \operatorname{SessionLive}(h_{2},\ \sigma )\ \Rightarrow \ \forall \ \mathsf{sym}.\ (\operatorname{HostedStateSym}(\operatorname{HostedSessionOwner}(h_{1}),\ \mathsf{sym})\ \lor \ \operatorname{HostedStateSym}(\operatorname{HostedSessionOwner}(h_{2}),\ \mathsf{sym}))\ \Rightarrow \ \operatorname{AddrOfSessionSym}(h_{1},\ \mathsf{sym})\ \ne \ \operatorname{AddrOfSessionSym}(h_{2},\ \mathsf{sym})
\end{array}
```

```math
\begin{array}{l}
A\ \mathsf{conforming}\ \mathsf{implementation}\ \mathsf{MUST}\ \mathsf{ensure}\ \texttt{DistinctHostedState(sigma)}\ \mathsf{for}\ \mathsf{every}\ \mathsf{store}\ \texttt{sigma}. \\
A\ \mathsf{conforming}\ \mathsf{implementation}\ \mathsf{MUST}\ \mathsf{ensure}\ \mathsf{that}\ \mathsf{every}\ \mathsf{successful}\ \texttt{HostSessionInitSigma(P, sigma) => (Val(h), sigma')}\ \mathsf{establishes}\ \texttt{SessionLive(h, sigma') and not SessionBusy(h, sigma') and HostedGrantedCaps(P, h) = HostedRootCaps(P)},\ \mathsf{every}\ \mathsf{successful}\ \texttt{HostedCallSigma(P, h, d, vs, sigma) => (out, sigma')}\ \mathsf{establishes}\ \texttt{SessionLive(h, sigma') and not SessionBusy(h, sigma')},\ \mathsf{and}\ \mathsf{every}\ \mathsf{successful}\ \texttt{HostSessionDestroySigma(P, h, sigma) => sigma'}\ \mathsf{establishes}\ \texttt{not SessionLive(h, sigma')}.
\end{array}
```
A hosted-library session MUST NOT be entered concurrently or reentrantly. While one hosted call or destroy operation on `h` is in progress, the implementation MUST treat `SessionBusy(h, _)` as true for that operation and MUST reject any second hosted entry on the same session according to §23.3.12.

**(HostSessionInitSigma)**

```math
\begin{array}{l}
\operatorname{HostedLibrary}(P)\quad \Gamma \ \vdash \ \operatorname{ContextInitSigma}(\sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{ctx}}),\ \sigma_{0} )\quad \operatorname{SessionHandle}(h)\quad \operatorname{HostedSessionOwner}(h)\ =\ P\quad \operatorname{SessionContext}(h)\ =\ v_{\mathsf{ctx}}\quad \operatorname{HostedGrantedCaps}(P,\ h)\ =\ \operatorname{HostedRootCaps}(P)\quad \Gamma \ \vdash \ \operatorname{SessionStateInitSigma}(P,\ h,\ \sigma_{0} )\ \Downarrow \ \sigma_{s} \quad \operatorname{SessionPanicRecordInit}(\sigma_{s} ,\ h)\quad (\forall \ d\ \in \ \operatorname{HostExports}(P).\ \operatorname{HostContextParam}(d)\ =\ \langle \_,\ \_,\ T_{d}\rangle \ \Rightarrow \ \operatorname{HostedGrantVisible}(P,\ h,\ T_{d})\ \land \ \exists \ v_{d}.\ \operatorname{ContextBundleBuild}(\operatorname{StripPerm}(T_{d}),\ v_{\mathsf{ctx}})\ \Downarrow \ v_{d})\quad \Gamma \ \vdash \ \operatorname{Init}(G_{e},\ \sigma_{s} )\ \Downarrow \ \sigma_{1}  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{HostSessionInitSigma}(P,\ \sigma )\ \Downarrow \ (\operatorname{Val}(h),\ \sigma_{1} )
\end{array}
```

**(HostedCallSigma-Ok)**

```math
\begin{array}{l}
\operatorname{SessionReady}(P,\ h,\ \sigma )\quad \operatorname{HostedLibrary}(P)\quad \operatorname{HostExported}(d)\quad d\ \in \ \operatorname{HostExports}(P)\quad \operatorname{HostContextParam}(d)\ =\ \langle \_,\ \_,\ T_{\mathsf{ctx}}\rangle \quad \operatorname{HostedGrantVisible}(P,\ h,\ T_{\mathsf{ctx}})\quad \operatorname{ContextBundleBuild}(\operatorname{StripPerm}(T_{\mathsf{ctx}}),\ \operatorname{SessionContext}(h))\ \Downarrow \ v_{\mathsf{ctx}}\quad \Gamma \ \vdash \ \operatorname{ApplyProcSigma}(d,\ [v_{\mathsf{ctx}}]\ \mathbin{++} \ \mathsf{vs},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{HostedCallSigma}(P,\ h,\ d,\ \mathsf{vs},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')
\end{array}
```

**(HostSessionDestroySigma)**

```math
\begin{array}{l}
\operatorname{SessionReady}(P,\ h,\ \sigma )\quad \Gamma \ \vdash \ \operatorname{Deinit}(P,\ \sigma )\ \Downarrow \ \sigma_{1} \quad \Gamma \ \vdash \ \operatorname{SessionStateDestroySigma}(P,\ h,\ \sigma_{1} )\ \Downarrow \ \sigma ' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{HostSessionDestroySigma}(P,\ h,\ \sigma )\ \Downarrow \ \sigma '
\end{array}
```

#### 24.4.5 Interpreter Entrypoint

```math
\begin{array}{l}
\mathsf{InterpJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{ContextInitSigma}(\sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{ctx}}),\ \sigma '),\ \Gamma \ \vdash \ \operatorname{InterpretProject}(P,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma '),\ \Gamma \ \vdash \ \operatorname{InterpretProject}(P,\ \sigma )\ \Uparrow \ \operatorname{panic}(P_{s})\} \\
\operatorname{ContextValue}(v)\ \Leftrightarrow \ \exists \ \mathsf{bits}.\ \operatorname{ValueBits}(\operatorname{TypePath}([\texttt{"Context"}]),\ v)\ =\ \mathsf{bits}
\end{array}
```

**(ContextInitSigma)**
ContextValue(v_ctx)

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ContextInitSigma}(\sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{ctx}}),\ \sigma )
\end{array}
```

**(Interpret-Project-Ok)**

```math
\begin{array}{l}
\operatorname{Executable}(P)\quad \operatorname{MainDecls}(P)\ =\ [d]\quad \operatorname{MainSigOk}(d)\quad \Gamma \ \vdash \ \operatorname{ContextInitSigma}(\sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{ctx}}),\ \sigma_{0} )\quad \Gamma \ \vdash \ \operatorname{Init}(G_{e},\ \sigma_{0} )\ \Downarrow \ \sigma_{1} \quad \operatorname{ContextBundleBuild}(\operatorname{StripPerm}(\operatorname{MainArgType}(d)),\ v_{\mathsf{ctx}})\ \Downarrow \ v_{\mathsf{arg}}\quad \Gamma \ \vdash \ \operatorname{ApplyProcSigma}(d,\ [v_{\mathsf{arg}}],\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{2} )\quad \Gamma \ \vdash \ \operatorname{Deinit}(P,\ \sigma_{2} )\ \Downarrow \ \sigma_{3}  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{InterpretProject}(P,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{3} )
\end{array}
```

**(Interpret-Project-Init-Panic)**

```math
\begin{array}{l}
\operatorname{Executable}(P)\quad \operatorname{MainDecls}(P)\ =\ [d]\quad \operatorname{MainSigOk}(d)\quad \Gamma \ \vdash \ \operatorname{ContextInitSigma}(\sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{ctx}}),\ \sigma_{0} )\quad \Gamma \ \vdash \ \operatorname{Init}(G_{e},\ \sigma_{0} )\ \Uparrow \ \operatorname{panic}(P_{s}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{InterpretProject}(P,\ \sigma )\ \Uparrow \ \operatorname{panic}(P_{s})
\end{array}
```

**(Interpret-Project-Main-Ctrl)**

```math
\begin{array}{l}
\operatorname{Executable}(P)\quad \operatorname{MainDecls}(P)\ =\ [d]\quad \operatorname{MainSigOk}(d)\quad \Gamma \ \vdash \ \operatorname{ContextInitSigma}(\sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{ctx}}),\ \sigma_{0} )\quad \Gamma \ \vdash \ \operatorname{Init}(G_{e},\ \sigma_{0} )\ \Downarrow \ \sigma_{1} \quad \operatorname{ContextBundleBuild}(\operatorname{StripPerm}(\operatorname{MainArgType}(d)),\ v_{\mathsf{ctx}})\ \Downarrow \ v_{\mathsf{arg}}\quad \Gamma \ \vdash \ \operatorname{ApplyProcSigma}(d,\ [v_{\mathsf{arg}}],\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} )\quad \kappa \ \in \ \{\mathsf{Panic},\ \mathsf{Abort}\} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{InterpretProject}(P,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} )
\end{array}
```

**(Interpret-Project-Deinit-Panic)**

```math
\begin{array}{l}
\operatorname{Executable}(P)\quad \operatorname{MainDecls}(P)\ =\ [d]\quad \operatorname{MainSigOk}(d)\quad \Gamma \ \vdash \ \operatorname{ContextInitSigma}(\sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{ctx}}),\ \sigma_{0} )\quad \Gamma \ \vdash \ \operatorname{Init}(G_{e},\ \sigma_{0} )\ \Downarrow \ \sigma_{1} \quad \operatorname{ContextBundleBuild}(\operatorname{StripPerm}(\operatorname{MainArgType}(d)),\ v_{\mathsf{ctx}})\ \Downarrow \ v_{\mathsf{arg}}\quad \Gamma \ \vdash \ \operatorname{ApplyProcSigma}(d,\ [v_{\mathsf{arg}}],\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{2} )\quad \Gamma \ \vdash \ \operatorname{Deinit}(P,\ \sigma_{2} )\ \Uparrow \ \mathsf{panic} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{InterpretProject}(P,\ \sigma )\ \Uparrow \ \mathsf{panic}
\end{array}
```

### 24.5 Cleanup, Drop, and Unwinding Framework

Dynamic scope-stack, binding-state, and region-stack machinery are defined by Chapter 6. This section defines only the cleanup, panic, drop, and unwinding framework that consumes those runtime structures.

#### 24.5.1 Cleanup Lowering Interface

```math
\mathsf{CleanupJudg}\ =\ \{\mathsf{EmitDrop},\ \mathsf{CleanupPlan},\ \mathsf{LowerPanic},\ \mathsf{PanicSym},\ \mathsf{ClearPanic},\ \mathsf{PanicCheck}\}
```

**(CleanupPlan)**

```math
\begin{array}{l}
\mathsf{cs}\ =\ \operatorname{CleanupList}(\mathsf{scope}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CleanupPlan}(\mathsf{scope})\ \Downarrow \ \mathsf{cs}
\end{array}
```

```math
\begin{array}{l}
\operatorname{EmitDropSpec}(\Gamma ,\ T,\ v,\ \mathsf{IR})\ \Leftrightarrow \ \forall \ \sigma ,\ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\ \land \ \Gamma \ \vdash \ \operatorname{DropValue}(T,\ v,\ \emptyset )\ \Downarrow \ \sigma ' \\
\Gamma \ \vdash \ \operatorname{EmitDrop}(T,\ v)\ \Downarrow \ \mathsf{IR}\ \Leftrightarrow \ \operatorname{EmitDropSpec}(\Gamma ,\ T,\ v,\ \mathsf{IR}).
\end{array}
```

#### 24.5.2 Panic Record and Panic Lowering

```math
\operatorname{PanicOutAddr}(\sigma )\ =\ \mathsf{addr}\ \Leftrightarrow \ \operatorname{LookupVal}(\sigma ,\ \mathsf{PanicOutName})\ =\ \operatorname{RawPtr}(\texttt{mut},\ \mathsf{addr})
```

```math
\operatorname{PanicRecordOf}(\sigma )\ =\ \langle p,\ c\rangle \ \Leftrightarrow \ \operatorname{PanicOutAddr}(\sigma )\ =\ \mathsf{addr}\ \land \ \operatorname{ReadAddr}(\sigma ,\ \operatorname{FieldAddr}(\mathsf{PanicRecord},\ \mathsf{addr},\ \texttt{"panic"}))\ =\ p\ \land \ \operatorname{ReadAddr}(\sigma ,\ \operatorname{FieldAddr}(\mathsf{PanicRecord},\ \mathsf{addr},\ \texttt{"code"}))\ =\ c
```

```math
\operatorname{WritePanicRecord}(\sigma ,\ p,\ c)\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{WriteAddr}(\sigma ,\ \operatorname{FieldAddr}(\mathsf{PanicRecord},\ \operatorname{PanicOutAddr}(\sigma ),\ \texttt{"panic"}),\ p)\ \Downarrow \ \sigma_{1} \ \land \ \operatorname{WriteAddr}(\sigma_{1} ,\ \operatorname{FieldAddr}(\mathsf{PanicRecord},\ \operatorname{PanicOutAddr}(\sigma ),\ \texttt{"code"}),\ c)\ \Downarrow \ \sigma '
```

```math
\Gamma \ \vdash \ \operatorname{InitPanicHandle}(m)\ \Downarrow \ \mathsf{IR}\ \Leftrightarrow \ \forall \ \sigma .\ (\operatorname{PanicRecordOf}(\sigma )\ =\ \langle \mathsf{true},\ c\rangle \ \Rightarrow \ \exists \ \sigma '.\ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma ')\ \land \ \operatorname{ExecIRSigma}(\operatorname{SeqIR}(\operatorname{SetPoison}(m),\ \operatorname{LowerPanic}(\operatorname{InitPanic}(m))),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma '))\ \land \ (\operatorname{PanicRecordOf}(\sigma )\ =\ \langle \mathsf{false},\ c\rangle \ \Rightarrow \ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\operatorname{Val}(()),\ \sigma ))
```
During lowering of one module-init procedure, the cleanup performed by `InitPanicHandle(m)` MUST be exactly the reverse of the currently completed responsible-static prefix of `m`. `InitPanicHandle(m)` MUST NOT execute the full `DeinitFn(m)` body.

**(PanicSym)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{PanicSym}\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"panic"}])
\end{array}
```

```math
\mathsf{PanicReason}\ =\ \{\operatorname{ErrorExpr}(\mathsf{span}),\ \operatorname{ErrorStmt}(\mathsf{span}),\ \mathsf{DivZero},\ \mathsf{Overflow},\ \mathsf{Shift},\ \mathsf{Bounds},\ \mathsf{Cast},\ \mathsf{NullDeref},\ \mathsf{ExpiredDeref},\ \operatorname{InitPanic}(m),\ \mathsf{Other}\}.
```

```math
\begin{array}{l}
\operatorname{PanicCode}(\operatorname{ErrorExpr}(\_))\ =\ 0\mathsf{x0001} \\
\operatorname{PanicCode}(\operatorname{ErrorStmt}(\_))\ =\ 0\mathsf{x0002} \\
\operatorname{PanicCode}(\mathsf{DivZero})\ =\ 0\mathsf{x0003} \\
\operatorname{PanicCode}(\mathsf{Overflow})\ =\ 0\mathsf{x0004} \\
\operatorname{PanicCode}(\mathsf{Shift})\ =\ 0\mathsf{x0005} \\
\operatorname{PanicCode}(\mathsf{Bounds})\ =\ 0\mathsf{x0006} \\
\operatorname{PanicCode}(\mathsf{Cast})\ =\ 0\mathsf{x0007} \\
\operatorname{PanicCode}(\mathsf{NullDeref})\ =\ 0\mathsf{x0008} \\
\operatorname{PanicCode}(\mathsf{ExpiredDeref})\ =\ 0\mathsf{x0009} \\
\operatorname{PanicCode}(\operatorname{InitPanic}(\_))\ =\ 0\mathsf{x000A} \\
\operatorname{PanicCode}(\mathsf{Other})\ =\ 0\mathsf{x00FF}.
\end{array}
```

```math
\begin{array}{l}
\mathsf{PanicSite}\ =\ \{\mathsf{DivZeroCheck},\ \mathsf{OverflowCheck},\ \mathsf{ShiftCheck},\ \mathsf{BoundsCheck},\ \mathsf{CastCheck},\ \mathsf{NullDerefCheck},\ \mathsf{ExpiredDerefCheck},\ \operatorname{ErrorExprSite}(\mathsf{span}),\ \operatorname{ErrorStmtSite}(\mathsf{span}),\ \operatorname{InitPanicSite}(m),\ \mathsf{OtherSite}\}. \\
\operatorname{PanicReasonOf}(\mathsf{DivZeroCheck})\ =\ \mathsf{DivZero} \\
\operatorname{PanicReasonOf}(\mathsf{OverflowCheck})\ =\ \mathsf{Overflow} \\
\operatorname{PanicReasonOf}(\mathsf{ShiftCheck})\ =\ \mathsf{Shift} \\
\operatorname{PanicReasonOf}(\mathsf{BoundsCheck})\ =\ \mathsf{Bounds} \\
\operatorname{PanicReasonOf}(\mathsf{CastCheck})\ =\ \mathsf{Cast} \\
\operatorname{PanicReasonOf}(\mathsf{NullDerefCheck})\ =\ \mathsf{NullDeref} \\
\operatorname{PanicReasonOf}(\mathsf{ExpiredDerefCheck})\ =\ \mathsf{ExpiredDeref} \\
\operatorname{PanicReasonOf}(\operatorname{ErrorExprSite}(\mathsf{span}))\ =\ \operatorname{ErrorExpr}(\mathsf{span}) \\
\operatorname{PanicReasonOf}(\operatorname{ErrorStmtSite}(\mathsf{span}))\ =\ \operatorname{ErrorStmt}(\mathsf{span}) \\
\operatorname{PanicReasonOf}(\operatorname{InitPanicSite}(m))\ =\ \operatorname{InitPanic}(m) \\
\operatorname{PanicReasonOf}(\mathsf{OtherSite})\ =\ \mathsf{Other}
\end{array}
```

```math
\Gamma \ \vdash \ \mathsf{ClearPanic}\ \Downarrow \ \mathsf{IR}\ \Leftrightarrow \ \forall \ \sigma ,\ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\ \land \ \operatorname{WritePanicRecord}(\sigma ,\ \mathsf{false},\ 0)\ \Downarrow \ \sigma '
```

```math
\Gamma \ \vdash \ \mathsf{PanicCheck}\ \Downarrow \ \mathsf{IR}\ \Leftrightarrow \ \forall \ \sigma ,\ (\operatorname{PanicRecordOf}(\sigma )\ =\ \langle \mathsf{true},\ c\rangle \ \Rightarrow \ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma ))\ \land \ (\operatorname{PanicRecordOf}(\sigma )\ =\ \langle \mathsf{false},\ c\rangle \ \Rightarrow \ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\operatorname{Val}(()),\ \sigma )).
```

```math
\Gamma \ \vdash \ \operatorname{LowerPanic}(\mathsf{reason})\ \Downarrow \ \mathsf{IR}\ \Leftrightarrow \ \forall \ \sigma .\ \exists \ \sigma '.\ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma ')\ \land \ \operatorname{WritePanicRecord}(\sigma ,\ \mathsf{true},\ \operatorname{PanicCode}(\mathsf{reason}))\ \Downarrow \ \sigma '
```

#### 24.5.3 Deterministic Destruction

```math
\operatorname{Responsible}(b)\ \Leftrightarrow \ \operatorname{BindInfo}(b).\mathsf{resp}\ =\ \mathsf{resp}
```

```math
\begin{array}{l}
\mathsf{CleanupItem}\ \mathbin{::} =\ \operatorname{DropBinding}(b)\ \mid \ \operatorname{DropStatic}(\mathsf{path},\ \mathsf{name})\ \mid \ \operatorname{DeferBlock}(b) \\
\mathsf{DropStatus}\ =\ \{\mathsf{ok},\ \mathsf{panic}\} \\
\mathsf{DropJudg}\ =\ \{\operatorname{DropAction}(b)\ \Downarrow \ \sigma ',\ \operatorname{DropValue}(T,\ v,\ F)\ \Downarrow \ \sigma ',\ \operatorname{DropStaticAction}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ \sigma ',\ \operatorname{DropActionOut}(b)\ \Downarrow \ (c,\ \sigma '),\ \operatorname{DropValueOut}(T,\ v,\ F)\ \Downarrow \ (c,\ \sigma '),\ \operatorname{DropStaticActionOut}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ (c,\ \sigma ')\} \\
\operatorname{DropAction}(b)\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{DropActionOut}(b)\ \Downarrow \ (\mathsf{ok},\ \sigma ') \\
\operatorname{DropValue}(T,\ v,\ F)\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{DropValueOut}(T,\ v,\ F)\ \Downarrow \ (\mathsf{ok},\ \sigma ') \\
\operatorname{DropStaticAction}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ \sigma '\ \Leftrightarrow \ \operatorname{DropStaticActionOut}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ (\mathsf{ok},\ \sigma ') \\
\operatorname{RecordType}(T)\ \Leftrightarrow \ \exists \ p.\ T\ =\ \operatorname{TypePath}(p)\ \land \ \operatorname{RecordDecl}(p)\ \mathsf{defined} \\
\operatorname{DropCall}(T,\ v,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\ \mathsf{relation} \\
\lnot \ \operatorname{DropType}(T)\ \Rightarrow \ \operatorname{DropCall}(T,\ v,\ \sigma )\ \Downarrow \ (\operatorname{Val}(()),\ \sigma ) \\
\operatorname{DropType}(T)\ \land \ \operatorname{BuiltinDropType}(T)\ \land \ T\ =\ \operatorname{TypeString}(\texttt{@Managed})\ \land \ \Gamma \ \vdash \ \mathsf{StringDropSym}\ \Downarrow \ \mathsf{sym}\ \land \ \operatorname{ExecIRSigma}(\operatorname{CallIR}(\mathsf{sym},\ [v]),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\ \Rightarrow \ \operatorname{DropCall}(T,\ v,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\
\operatorname{DropType}(T)\ \land \ \operatorname{BuiltinDropType}(T)\ \land \ T\ =\ \operatorname{TypeBytes}(\texttt{@Managed})\ \land \ \Gamma \ \vdash \ \mathsf{BytesDropSym}\ \Downarrow \ \mathsf{sym}\ \land \ \operatorname{ExecIRSigma}(\operatorname{CallIR}(\mathsf{sym},\ [v]),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\ \Rightarrow \ \operatorname{DropCall}(T,\ v,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\
\operatorname{DropType}(T)\ \land \ \lnot \ \operatorname{BuiltinDropType}(T)\ \land \ \operatorname{LookupMethod}(\operatorname{StripPerm}(T),\ \texttt{"drop"})\ =\ m\ \land \ \operatorname{Sig_T}(\operatorname{StripPerm}(T),\ m)\ =\ \langle \operatorname{TypePerm}(\texttt{unique},\ \operatorname{StripPerm}(T)),\ [],\ \operatorname{TypePrim}(\texttt{"()"})\rangle \ \land \ \operatorname{BindParams}(\operatorname{MethodParamsDecl}(\operatorname{StripPerm}(T),\ m),\ [v])\ =\ \mathsf{binds}\ \land \ \operatorname{BlockEnter}(\sigma ,\ \mathsf{binds})\ \Downarrow \ (\sigma_{1} ,\ \mathsf{scope})\ \land \ \Gamma \ \vdash \ \operatorname{EvalBlockBodySigma}(m.\mathsf{body},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out}_{1},\ \sigma_{2} )\ \land \ \operatorname{BlockExit}(\sigma_{2} ,\ \mathsf{scope},\ \mathsf{out}_{1})\ \Downarrow \ (\mathsf{out}_{2},\ \sigma_{3} )\ \land \ \operatorname{ReturnOut}(\mathsf{out}_{2})\ =\ \mathsf{out}\ \Rightarrow \ \operatorname{DropCall}(T,\ v,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} ) \\
\operatorname{ReleaseValue}(T,\ v,\ \sigma )\ \Downarrow \ \sigma '\ \mathsf{relation} \\
\operatorname{ReleaseValue}(T,\ v,\ \sigma )\ \Downarrow \ \sigma '\ \Leftrightarrow \ \sigma '\ =\ \sigma  \\
\operatorname{DropChildren}(T,\ v,\ F)\ = \\
\ [\langle T_{i},\ v_{i}\rangle \ \mid \ \langle f_{i},\ T_{i}\rangle \ \in \ \operatorname{FieldsRev}(R),\ f_{i}\ \notin \ F,\ \operatorname{FieldValue}(v,\ f_{i})\ =\ v_{i}]\quad \mathsf{if}\ T\ =\ \operatorname{TypePath}(p)\ \land \ \operatorname{RecordDecl}(p)\ =\ R \\
\ [\langle T_{i},\ v_{i}\rangle \ \mid \ T\ =\ \operatorname{TypeTuple}([T_{0},\ \ldots ,\ T\_\{n-1\}]),\ i\ \in \ \operatorname{rev}([0,\ \ldots ,\ n-1]),\ \operatorname{TupleValue}(v,\ i)\ =\ v_{i}]\quad \mathsf{if}\ T\ =\ \operatorname{TypeTuple}(\_) \\
\ [\langle T_{e},\ v_{i}\rangle \ \mid \ T\ =\ \operatorname{TypeArray}(T_{e},\ n),\ i\ \in \ \operatorname{rev}([0,\ \ldots ,\ n-1]),\ \operatorname{IndexValue}(v,\ i)\ =\ v_{i}]\quad \mathsf{if}\ T\ =\ \operatorname{TypeArray}(\_,\ \_) \\
\ [\langle T',\ v'\rangle \ \mid \ \operatorname{UnionCase}(v)\ =\ \langle T',\ v'\rangle ]\quad \mathsf{if}\ T\ =\ \operatorname{TypeUnion}(\_) \\
\ [\langle \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S),\ v_{s}\rangle \ \mid \ v\ =\ \langle S,\ v_{s}\rangle ]\quad \mathsf{if}\ T\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\ \land \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M \\
\ [\langle T_{i},\ v_{i}\rangle \ \mid \ \langle f_{i},\ T_{i}\rangle \ \in \ \operatorname{ModalPayload}(\mathsf{modal}_{\mathsf{ref}},\ S),\ \operatorname{FieldValue}(v,\ f_{i})\ =\ v_{i}]\quad \mathsf{if}\ T\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\ \land \ \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M \\
\ []\quad \mathsf{otherwise} \\
\operatorname{DropList}([],\ \sigma )\ \Downarrow \ (\mathsf{ok},\ \sigma ) \\
\operatorname{DropList}([\langle T,\ v\rangle ]\ \mathbin{++} \ \mathsf{xs},\ \sigma )\ \Downarrow \ (c,\ \sigma '')\ \Leftrightarrow \ \operatorname{DropValueOut}(T,\ v,\ \emptyset )\ \Downarrow \ (c_{1},\ \sigma ')\ \land \ (c_{1}\ =\ \mathsf{panic}\ \Rightarrow \ c\ =\ \mathsf{panic}\ \land \ \sigma ''\ =\ \sigma ')\ \land \ (c_{1}\ =\ \mathsf{ok}\ \Rightarrow \ \operatorname{DropList}(\mathsf{xs},\ \sigma ')\ \Downarrow \ (c,\ \sigma ''))
\end{array}
```

**(DropAction-Moved)**

```math
\begin{array}{l}
\operatorname{BindState}(\sigma ,\ b)\ =\ \mathsf{Moved} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{DropActionOut}(b)\ \Downarrow \ (\mathsf{ok},\ \sigma )
\end{array}
```

**(DropAction-Partial)**

```math
\begin{array}{l}
\operatorname{BindState}(\sigma ,\ b)\ =\ \operatorname{PartiallyMoved}(F)\quad \Gamma \ \vdash \ \operatorname{DropValueOut}(\operatorname{TypeOf}(b),\ \operatorname{BindingValue}(\sigma ,\ b),\ F)\ \Downarrow \ (c,\ \sigma ') \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{DropActionOut}(b)\ \Downarrow \ (c,\ \sigma ')
\end{array}
```

**(DropAction-Valid)**

```math
\begin{array}{l}
\operatorname{BindState}(\sigma ,\ b)\ =\ \texttt{Valid}\quad \Gamma \ \vdash \ \operatorname{DropValueOut}(\operatorname{TypeOf}(b),\ \operatorname{BindingValue}(\sigma ,\ b),\ \emptyset )\ \Downarrow \ (c,\ \sigma ') \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{DropActionOut}(b)\ \Downarrow \ (c,\ \sigma ')
\end{array}
```

**(DropStaticAction)**

```math
\begin{array}{l}
\operatorname{StaticAddr}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{addr}\quad \operatorname{ReadAddr}(\sigma ,\ \mathsf{addr})\ =\ v\quad \Gamma \ \vdash \ \operatorname{DropValueOut}(\operatorname{StaticType}(\mathsf{path},\ \mathsf{name}),\ v,\ \emptyset )\ \Downarrow \ (c,\ \sigma ') \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{DropStaticActionOut}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ (c,\ \sigma ')
\end{array}
```

```math
\operatorname{NonRecordFOk}(T,\ F)\ \Leftrightarrow \ \operatorname{RecordType}(T)\ \lor \ F\ =\ \emptyset 
```

**(DropValueOut-DropPanic)**

```math
\begin{array}{l}
\operatorname{NonRecordFOk}(T,\ F)\quad \operatorname{DropCall}(T,\ v,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma_{1} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{DropValueOut}(T,\ v,\ F)\ \Downarrow \ (\mathsf{panic},\ \sigma_{1} )
\end{array}
```

**(DropValueOut-ChildPanic)**

```math
\begin{array}{l}
\operatorname{NonRecordFOk}(T,\ F)\quad \operatorname{DropCall}(T,\ v,\ \sigma )\ \Downarrow \ (\operatorname{Val}(()),\ \sigma_{1} )\quad \operatorname{DropList}(\operatorname{DropChildren}(T,\ v,\ F),\ \sigma_{1} )\ \Downarrow \ (\mathsf{panic},\ \sigma_{2} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{DropValueOut}(T,\ v,\ F)\ \Downarrow \ (\mathsf{panic},\ \sigma_{2} )
\end{array}
```

**(DropValueOut-Ok)**

```math
\begin{array}{l}
\operatorname{NonRecordFOk}(T,\ F)\quad \operatorname{DropCall}(T,\ v,\ \sigma )\ \Downarrow \ (\operatorname{Val}(()),\ \sigma_{1} )\quad \operatorname{DropList}(\operatorname{DropChildren}(T,\ v,\ F),\ \sigma_{1} )\ \Downarrow \ (\mathsf{ok},\ \sigma_{2} )\quad \operatorname{ReleaseValue}(T,\ v,\ \sigma_{2} )\ \Downarrow \ \sigma_{3}  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{DropValueOut}(T,\ v,\ F)\ \Downarrow \ (\mathsf{ok},\ \sigma_{3} )
\end{array}
```

#### 24.5.4 Cleanup and Unwinding Driver

```math
\begin{array}{l}
\mathsf{CleanupFlag}\ =\ \{\mathsf{ok},\ \mathsf{panic}\} \\
\mathsf{CleanupState}\ =\ \{\operatorname{CleanupLoop}(\mathsf{scope},\ \sigma ,\ c)\ \mid \ c\ \in \ \mathsf{CleanupFlag}\}\ \cup \ \{\operatorname{ExitDone}(c,\ \sigma )\ \mid \ c\ \in \ \mathsf{CleanupFlag}\}\ \cup \ \{\mathsf{Abort}\}
\end{array}
```

**(Cleanup-Start)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\langle \operatorname{ExitScope}(\mathsf{scope},\ \sigma )\rangle \ \to \ \langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma ,\ \mathsf{ok})\rangle 
\end{array}
```

**(Cleanup-Step-Drop-Ok)**

```math
\begin{array}{l}
\operatorname{CleanupList}(\mathsf{scope})\ =\ \mathsf{rest}\ \mathbin{++} \ [\operatorname{DropBinding}(b)]\quad \sigma_{1} \ =\ \operatorname{SetCleanupList}(\mathsf{scope},\ \mathsf{rest},\ \sigma )\quad \Gamma \ \vdash \ \operatorname{DropActionOut}(b)\ \Downarrow \ (\mathsf{ok},\ \sigma_{2} ) \\
\rule{18em}{0.4pt} \\
\langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma ,\ c)\rangle \ \to \ \langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma_{2} ,\ c)\rangle 
\end{array}
```

**(Cleanup-Step-Drop-Panic)**

```math
\begin{array}{l}
\operatorname{CleanupList}(\mathsf{scope})\ =\ \mathsf{rest}\ \mathbin{++} \ [\operatorname{DropBinding}(b)]\quad \sigma_{1} \ =\ \operatorname{SetCleanupList}(\mathsf{scope},\ \mathsf{rest},\ \sigma )\quad \Gamma \ \vdash \ \operatorname{DropActionOut}(b)\ \Downarrow \ (\mathsf{panic},\ \sigma_{2} )\quad c\ =\ \mathsf{ok} \\
\rule{18em}{0.4pt} \\
\langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma ,\ c)\rangle \ \to \ \langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma_{2} ,\ \mathsf{panic})\rangle 
\end{array}
```

**(Cleanup-Step-Drop-Abort)**

```math
\begin{array}{l}
\operatorname{CleanupList}(\mathsf{scope})\ =\ \mathsf{rest}\ \mathbin{++} \ [\operatorname{DropBinding}(b)]\quad \sigma_{1} \ =\ \operatorname{SetCleanupList}(\mathsf{scope},\ \mathsf{rest},\ \sigma )\quad \Gamma \ \vdash \ \operatorname{DropActionOut}(b)\ \Downarrow \ (\mathsf{panic},\ \sigma_{2} )\quad c\ =\ \mathsf{panic} \\
\rule{18em}{0.4pt} \\
\langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma ,\ c)\rangle \ \to \ \langle \mathsf{Abort}\rangle 
\end{array}
```

**(Cleanup-Step-DropStatic-Ok)**

```math
\begin{array}{l}
\operatorname{CleanupList}(\mathsf{scope})\ =\ \mathsf{rest}\ \mathbin{++} \ [\operatorname{DropStatic}(\mathsf{path},\ \mathsf{name})]\quad \sigma_{1} \ =\ \operatorname{SetCleanupList}(\mathsf{scope},\ \mathsf{rest},\ \sigma )\quad \Gamma \ \vdash \ \operatorname{DropStaticActionOut}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ (\mathsf{ok},\ \sigma_{2} ) \\
\rule{18em}{0.4pt} \\
\langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma ,\ c)\rangle \ \to \ \langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma_{2} ,\ c)\rangle 
\end{array}
```

**(Cleanup-Step-DropStatic-Panic)**

```math
\begin{array}{l}
\operatorname{CleanupList}(\mathsf{scope})\ =\ \mathsf{rest}\ \mathbin{++} \ [\operatorname{DropStatic}(\mathsf{path},\ \mathsf{name})]\quad \sigma_{1} \ =\ \operatorname{SetCleanupList}(\mathsf{scope},\ \mathsf{rest},\ \sigma )\quad \Gamma \ \vdash \ \operatorname{DropStaticActionOut}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ (\mathsf{panic},\ \sigma_{2} )\quad c\ =\ \mathsf{ok} \\
\rule{18em}{0.4pt} \\
\langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma ,\ c)\rangle \ \to \ \langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma_{2} ,\ \mathsf{panic})\rangle 
\end{array}
```

**(Cleanup-Step-DropStatic-Abort)**

```math
\begin{array}{l}
\operatorname{CleanupList}(\mathsf{scope})\ =\ \mathsf{rest}\ \mathbin{++} \ [\operatorname{DropStatic}(\mathsf{path},\ \mathsf{name})]\quad \sigma_{1} \ =\ \operatorname{SetCleanupList}(\mathsf{scope},\ \mathsf{rest},\ \sigma )\quad \Gamma \ \vdash \ \operatorname{DropStaticActionOut}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ (\mathsf{panic},\ \sigma_{2} )\quad c\ =\ \mathsf{panic} \\
\rule{18em}{0.4pt} \\
\langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma ,\ c)\rangle \ \to \ \langle \mathsf{Abort}\rangle 
\end{array}
```

**(Cleanup-Step-Defer-Ok)**

```math
\begin{array}{l}
\operatorname{CleanupList}(\mathsf{scope})\ =\ \mathsf{rest}\ \mathbin{++} \ [\operatorname{DeferBlock}(b)]\quad \sigma_{1} \ =\ \operatorname{SetCleanupList}(\mathsf{scope},\ \mathsf{rest},\ \sigma )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(b,\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{2} ) \\
\rule{18em}{0.4pt} \\
\langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma ,\ c)\rangle \ \to \ \langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma_{2} ,\ c)\rangle 
\end{array}
```

**(Cleanup-Step-Defer-Panic)**

```math
\begin{array}{l}
\operatorname{CleanupList}(\mathsf{scope})\ =\ \mathsf{rest}\ \mathbin{++} \ [\operatorname{DeferBlock}(b)]\quad \sigma_{1} \ =\ \operatorname{SetCleanupList}(\mathsf{scope},\ \mathsf{rest},\ \sigma )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(b,\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma_{2} )\quad c\ =\ \mathsf{ok} \\
\rule{18em}{0.4pt} \\
\langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma ,\ c)\rangle \ \to \ \langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma_{2} ,\ \mathsf{panic})\rangle 
\end{array}
```

**(Cleanup-Step-Defer-Abort)**

```math
\begin{array}{l}
\operatorname{CleanupList}(\mathsf{scope})\ =\ \mathsf{rest}\ \mathbin{++} \ [\operatorname{DeferBlock}(b)]\quad \sigma_{1} \ =\ \operatorname{SetCleanupList}(\mathsf{scope},\ \mathsf{rest},\ \sigma )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(b,\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma_{2} )\quad c\ =\ \mathsf{panic} \\
\rule{18em}{0.4pt} \\
\langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma ,\ c)\rangle \ \to \ \langle \mathsf{Abort}\rangle 
\end{array}
```

**(Cleanup-Done)**

```math
\begin{array}{l}
\operatorname{CleanupList}(\mathsf{scope})\ =\ [] \\
\rule{18em}{0.4pt} \\
\langle \operatorname{CleanupLoop}(\mathsf{scope},\ \sigma ,\ c)\rangle \ \to \ \langle \operatorname{ExitDone}(c,\ \sigma )\rangle 
\end{array}
```

**(Destroy-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Destroy}([],\ \sigma )\ \Downarrow \ \sigma 
\end{array}
```

**(Destroy-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{DropAction}(b)\ \Downarrow \ \sigma_{1} \quad \Gamma \ \vdash \ \operatorname{Destroy}(\mathsf{bs},\ \sigma_{1} )\ \Downarrow \ \sigma_{2}  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Destroy}(b\mathbin{::} \mathsf{bs},\ \sigma )\ \Downarrow \ \sigma_{2} 
\end{array}
```

```math
\mathsf{CleanupJudg}_{\mathsf{Dyn}}\ =\ \{\operatorname{Cleanup}(\mathsf{cs},\ \sigma )\ \Downarrow \ (c,\ \sigma ')\}
```

**(Cleanup-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Cleanup}([],\ \sigma )\ \Downarrow \ (\mathsf{ok},\ \sigma )
\end{array}
```

**(Cleanup-Cons-Drop)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{DropActionOut}(b)\ \Downarrow \ (\mathsf{ok},\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{Cleanup}(\mathsf{cs},\ \sigma_{1} )\ \Downarrow \ (c,\ \sigma_{2} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Cleanup}(\operatorname{DropBinding}(b)\mathbin{::} \mathsf{cs},\ \sigma )\ \Downarrow \ (c,\ \sigma_{2} )
\end{array}
```

**(Cleanup-Cons-Drop-Panic)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{DropActionOut}(b)\ \Downarrow \ (\mathsf{panic},\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{Cleanup}(\mathsf{cs},\ \sigma_{1} )\ \Downarrow \ (c,\ \sigma_{2} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Cleanup}(\operatorname{DropBinding}(b)\mathbin{::} \mathsf{cs},\ \sigma )\ \Downarrow \ (\mathsf{panic},\ \sigma_{2} )
\end{array}
```

**(Cleanup-Cons-DropStatic)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{DropStaticActionOut}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ (\mathsf{ok},\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{Cleanup}(\mathsf{cs},\ \sigma_{1} )\ \Downarrow \ (c,\ \sigma_{2} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Cleanup}(\operatorname{DropStatic}(\mathsf{path},\ \mathsf{name})\mathbin{::} \mathsf{cs},\ \sigma )\ \Downarrow \ (c,\ \sigma_{2} )
\end{array}
```

**(Cleanup-Cons-DropStatic-Panic)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{DropStaticActionOut}(\mathsf{path},\ \mathsf{name})\ \Downarrow \ (\mathsf{panic},\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{Cleanup}(\mathsf{cs},\ \sigma_{1} )\ \Downarrow \ (c,\ \sigma_{2} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Cleanup}(\operatorname{DropStatic}(\mathsf{path},\ \mathsf{name})\mathbin{::} \mathsf{cs},\ \sigma )\ \Downarrow \ (\mathsf{panic},\ \sigma_{2} )
\end{array}
```

**(Cleanup-Cons-Defer-Ok)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(b,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{Cleanup}(\mathsf{cs},\ \sigma_{1} )\ \Downarrow \ (c,\ \sigma_{2} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Cleanup}(\operatorname{DeferBlock}(b)\mathbin{::} \mathsf{cs},\ \sigma )\ \Downarrow \ (c,\ \sigma_{2} )
\end{array}
```

**(Cleanup-Cons-Defer-Panic)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(b,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{Cleanup}(\mathsf{cs},\ \sigma_{1} )\ \Downarrow \ (c,\ \sigma_{2} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Cleanup}(\operatorname{DeferBlock}(b)\mathbin{::} \mathsf{cs},\ \sigma )\ \Downarrow \ (\mathsf{panic},\ \sigma_{2} )
\end{array}
```

```math
\mathsf{CleanupScopeJudg}\ =\ \{\operatorname{CleanupScope}(\mathsf{scope},\ \sigma )\ \Downarrow \ (c,\ \sigma ')\}
```

**(CleanupScope-From-SmallStep)**

```math
\begin{array}{l}
\langle \operatorname{ExitScope}(\mathsf{scope},\ \sigma )\rangle \ \to *\ \langle \operatorname{ExitDone}(c,\ \sigma ')\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CleanupScope}(\mathsf{scope},\ \sigma )\ \Downarrow \ (c,\ \sigma ')
\end{array}
```

**(Unwind-Step)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CleanupScope}(f_{1}.\mathsf{scope},\ \sigma )\ \Downarrow \ (\mathsf{ok},\ \sigma ') \\
\rule{18em}{0.4pt} \\
\langle \operatorname{Unwind}(f_{1}\mathbin{::} \mathsf{fs},\ \sigma )\rangle \ \to \ \langle \operatorname{Unwind}(\mathsf{fs},\ \sigma ')\rangle 
\end{array}
```

**(Unwind-Abort)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CleanupScope}(f_{1}.\mathsf{scope},\ \sigma )\ \Downarrow \ (\mathsf{panic},\ \sigma ') \\
\rule{18em}{0.4pt} \\
\langle \operatorname{Unwind}(f_{1}\mathbin{::} \mathsf{fs},\ \sigma )\rangle \ \to \ \langle \mathsf{Abort}\rangle 
\end{array}
```

### 24.6 Runtime Interface

Feature-local runtime behavior remains owned by the feature sections that invoke these built-ins. This section defines only the runtime symbol surface, builtin modal layout hooks, and runtime declaration interface.

#### 24.6.1 Built-in Modal Layout and Capability Symbols

```math
\mathsf{RuntimeIfcJudg}\ =\ \{\mathsf{BuiltinModalLayout},\ \mathsf{BuiltinModalSym},\ \mathsf{RegionAddrIsActiveSym},\ \mathsf{RegionAddrTagFromSym},\ \mathsf{BuiltinSym}\}
```

```math
\operatorname{BuiltinModalLayoutSpec}(\texttt{Region})\ =\ \langle 16,\ 8,\ \mathsf{u8},\ \langle 8,\ 8\rangle \rangle 
```

**(BuiltinModalLayout)**

```math
\begin{array}{l}
\operatorname{BuiltinModalLayoutSpec}(\mathsf{modal})\ =\ \langle \mathsf{size},\ \mathsf{align},\ \mathsf{disc},\ \mathsf{payload}\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BuiltinModalLayout}(\mathsf{modal})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ [\langle \texttt{disc},\ \mathsf{disc}\rangle ,\ \langle \texttt{payload},\ \mathsf{payload}\rangle ]\rangle 
\end{array}
```

```math
\begin{array}{l}
\mathsf{BuiltinModalSymMap}\ =\ [ \\
\ \langle \texttt{Region::new\_scoped},\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"region"},\ \texttt{"new\_scoped"}])\rangle , \\
\ \langle \texttt{Region::alloc},\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"region"},\ \texttt{"alloc"}])\rangle , \\
\ \langle \texttt{Region::mark},\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"region"},\ \texttt{"mark"}])\rangle , \\
\ \langle \texttt{Region::reset\_to},\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"region"},\ \texttt{"reset\_to"}])\rangle , \\
\ \langle \texttt{Region::reset\_unchecked},\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"region"},\ \texttt{"reset\_unchecked"}])\rangle , \\
\ \langle \texttt{Region::freeze},\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"region"},\ \texttt{"freeze"}])\rangle , \\
\ \langle \texttt{Region::thaw},\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"region"},\ \texttt{"thaw"}])\rangle , \\
\ \langle \texttt{Region::free\_unchecked},\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"region"},\ \texttt{"free\_unchecked"}])\rangle , \\
\ \langle \texttt{CancelToken::new},\ \operatorname{PathSig}([\texttt{"CancelToken"},\ \texttt{"new"}])\rangle , \\
\ \langle \texttt{CancelToken::Active::cancel},\ \operatorname{PathSig}([\texttt{"CancelToken"},\ \texttt{"Active"},\ \texttt{"cancel"}])\rangle , \\
\ \langle \texttt{CancelToken::Active::is\_cancelled},\ \operatorname{PathSig}([\texttt{"CancelToken"},\ \texttt{"Active"},\ \texttt{"is\_cancelled"}])\rangle , \\
\ \langle \texttt{CancelToken::Active::child},\ \operatorname{PathSig}([\texttt{"CancelToken"},\ \texttt{"Active"},\ \texttt{"child"}])\rangle , \\
\ \langle \texttt{CancelToken::Active::wait\_cancelled},\ \operatorname{PathSig}([\texttt{"CancelToken"},\ \texttt{"Active"},\ \texttt{"wait\_cancelled"}])\rangle 
\end{array}
```
]

**(BuiltinModalSym)**

```math
\begin{array}{l}
\langle \mathsf{proc},\ \mathsf{sym}\rangle \ \in \ \mathsf{BuiltinModalSymMap} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BuiltinModalSym}(\mathsf{proc})\ \Downarrow \ \mathsf{sym}
\end{array}
```

**(RegionAddr-AddrIsActive)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{RegionAddrIsActiveSym}\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"region"},\ \texttt{"addr\_is\_active"}])
\end{array}
```

**(RegionAddr-AddrTagFrom)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{RegionAddrTagFromSym}\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"region"},\ \texttt{"addr\_tag\_from"}])
\end{array}
```

**(BuiltinSym-FileSystem-OpenRead)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::open\_read})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"open\_read"}])
\end{array}
```

**(BuiltinSym-FileSystem-OpenWrite)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::open\_write})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"open\_write"}])
\end{array}
```

**(BuiltinSym-FileSystem-OpenAppend)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::open\_append})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"open\_append"}])
\end{array}
```

**(BuiltinSym-FileSystem-CreateWrite)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::create\_write})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"create\_write"}])
\end{array}
```

**(BuiltinSym-FileSystem-ReadFile)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::read\_file})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"read\_file"}])
\end{array}
```

**(BuiltinSym-FileSystem-ReadBytes)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::read\_bytes})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"read\_bytes"}])
\end{array}
```

**(BuiltinSym-FileSystem-WriteFile)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::write\_file})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"write\_file"}])
\end{array}
```

**(BuiltinSym-FileSystem-WriteStdout)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::write\_stdout})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"write\_stdout"}])
\end{array}
```

**(BuiltinSym-FileSystem-WriteStderr)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::write\_stderr})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"write\_stderr"}])
\end{array}
```

**(BuiltinSym-FileSystem-Exists)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::exists})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"exists"}])
\end{array}
```

**(BuiltinSym-FileSystem-Remove)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::remove})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"remove"}])
\end{array}
```

**(BuiltinSym-FileSystem-OpenDir)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::open\_dir})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"open\_dir"}])
\end{array}
```

**(BuiltinSym-FileSystem-CreateDir)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::create\_dir})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"create\_dir"}])
\end{array}
```

**(BuiltinSym-FileSystem-EnsureDir)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::ensure\_dir})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"ensure\_dir"}])
\end{array}
```

**(BuiltinSym-FileSystem-Kind)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::kind})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"kind"}])
\end{array}
```

**(BuiltinSym-FileSystem-Restrict)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{FileSystem::restrict})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"fs"},\ \texttt{"restrict"}])
\end{array}
```

**(BuiltinSym-Network-RestrictHost)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{Network::restrict\_to\_host})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"net"},\ \texttt{"restrict\_to\_host"}])
\end{array}
```

**(BuiltinSym-HeapAllocator-WithQuota)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{HeapAllocator::with\_quota})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"heap"},\ \texttt{"with\_quota"}])
\end{array}
```

**(BuiltinSym-HeapAllocator-AllocRaw)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{HeapAllocator::alloc\_raw})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"heap"},\ \texttt{"alloc\_raw"}])
\end{array}
```

**(BuiltinSym-HeapAllocator-DeallocRaw)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{HeapAllocator::dealloc\_raw})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"heap"},\ \texttt{"dealloc\_raw"}])
\end{array}
```

**(BuiltinSym-Reactor-Run)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{Reactor::run})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"reactor"},\ \texttt{"run"}])
\end{array}
```

**(BuiltinSym-Reactor-Register)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{Reactor::register})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"reactor"},\ \texttt{"register"}])
\end{array}
```

**(BuiltinSym-System-Exit)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{System::exit})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"system"},\ \texttt{"exit"}])
\end{array}
```

**(BuiltinSym-System-GetEnv)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{System::get\_env})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"system"},\ \texttt{"get\_env"}])
\end{array}
```

**(BuiltinSym-System-ExecutablePath)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{System::executable\_path})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"system"},\ \texttt{"executable\_path"}])
\end{array}
```

**(BuiltinSym-System-ArgumentCount)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{System::argument\_count})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"system"},\ \texttt{"argument\_count"}])
\end{array}
```

**(BuiltinSym-System-Argument)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{System::argument})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"system"},\ \texttt{"argument"}])
\end{array}
```

**(BuiltinSym-System-CurrentDirectory)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{System::current\_directory})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"system"},\ \texttt{"current\_directory"}])
\end{array}
```

**(BuiltinSym-System-Run)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\texttt{System::run})\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"system"},\ \texttt{"run"}])
\end{array}
```

#### 24.6.2 Managed String/Bytes Runtime Symbols and Drop Hooks

```math
\mathsf{BuiltinSymJudg}\ =\ \{\operatorname{BuiltinSym}(\mathsf{method})\ \Downarrow \ \mathsf{sym}\}
```

```math
\begin{array}{l}
\mathsf{StringBuiltins}\ =\ \{\texttt{string::from},\ \texttt{string::as\_view},\ \texttt{string::slice},\ \texttt{string::to\_managed},\ \texttt{string::clone\_with},\ \texttt{string::append},\ \texttt{string::length},\ \texttt{string::is\_empty}\} \\
\mathsf{BytesBuiltins}\ =\ \{\texttt{bytes::with\_capacity},\ \texttt{bytes::from\_slice},\ \texttt{bytes::as\_view},\ \texttt{bytes::as\_slice},\ \texttt{bytes::to\_managed},\ \texttt{bytes::view},\ \texttt{bytes::view\_string},\ \texttt{bytes::append},\ \texttt{bytes::length},\ \texttt{bytes::is\_empty}\} \\
\operatorname{StringMethod}(\mathsf{method})\ \Leftrightarrow \ \exists \ \mathsf{name}.\ \mathsf{method}\ =\ \texttt{string::}\mathsf{name} \\
\operatorname{BytesMethod}(\mathsf{method})\ \Leftrightarrow \ \exists \ \mathsf{name}.\ \mathsf{method}\ =\ \texttt{bytes::}\mathsf{name}
\end{array}
```

```math
\begin{array}{l}
\operatorname{BuiltinSym}(\texttt{string::from})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"string"},\ \texttt{"from"}]) \\
\operatorname{BuiltinSym}(\texttt{string::as\_view})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"string"},\ \texttt{"as\_view"}]) \\
\operatorname{BuiltinSym}(\texttt{string::slice})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"string"},\ \texttt{"slice"}]) \\
\operatorname{BuiltinSym}(\texttt{string::to\_managed})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"string"},\ \texttt{"to\_managed"}]) \\
\operatorname{BuiltinSym}(\texttt{string::clone\_with})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"string"},\ \texttt{"clone\_with"}]) \\
\operatorname{BuiltinSym}(\texttt{string::append})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"string"},\ \texttt{"append"}]) \\
\operatorname{BuiltinSym}(\texttt{string::length})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"string"},\ \texttt{"length"}]) \\
\operatorname{BuiltinSym}(\texttt{string::is\_empty})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"string"},\ \texttt{"is\_empty"}])
\end{array}
```

```math
\begin{array}{l}
\operatorname{BuiltinSym}(\texttt{bytes::with\_capacity})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"bytes"},\ \texttt{"with\_capacity"}]) \\
\operatorname{BuiltinSym}(\texttt{bytes::from\_slice})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"bytes"},\ \texttt{"from\_slice"}]) \\
\operatorname{BuiltinSym}(\texttt{bytes::as\_view})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"bytes"},\ \texttt{"as\_view"}]) \\
\operatorname{BuiltinSym}(\texttt{bytes::as\_slice})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"bytes"},\ \texttt{"as\_slice"}]) \\
\operatorname{BuiltinSym}(\texttt{bytes::to\_managed})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"bytes"},\ \texttt{"to\_managed"}]) \\
\operatorname{BuiltinSym}(\texttt{bytes::view})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"bytes"},\ \texttt{"view"}]) \\
\operatorname{BuiltinSym}(\texttt{bytes::view\_string})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"bytes"},\ \texttt{"view\_string"}]) \\
\operatorname{BuiltinSym}(\texttt{bytes::append})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"bytes"},\ \texttt{"append"}]) \\
\operatorname{BuiltinSym}(\texttt{bytes::length})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"bytes"},\ \texttt{"length"}]) \\
\operatorname{BuiltinSym}(\texttt{bytes::is\_empty})\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"bytes"},\ \texttt{"is\_empty"}])
\end{array}
```

**(BuiltinSym-String-Err)**

```math
\begin{array}{l}
\operatorname{StringMethod}(\mathsf{method})\quad \mathsf{method}\ \notin \ \mathsf{StringBuiltins} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\mathsf{method})\ \Uparrow 
\end{array}
```

**(BuiltinSym-Bytes-Err)**

```math
\begin{array}{l}
\operatorname{BytesMethod}(\mathsf{method})\quad \mathsf{method}\ \notin \ \mathsf{BytesBuiltins} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BuiltinSym}(\mathsf{method})\ \Uparrow 
\end{array}
```

```math
\mathsf{DropHookJudg}\ =\ \{\mathsf{StringDropSym}\ \Downarrow \ \mathsf{sym},\ \mathsf{BytesDropSym}\ \Downarrow \ \mathsf{sym}\}
```

**(StringDropSym-Decl)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{StringDropSym}\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"string"},\ \texttt{"drop\_managed"}])
\end{array}
```

**(BytesDropSym-Decl)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{BytesDropSym}\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"bytes"},\ \texttt{"drop\_managed"}])
\end{array}
```

**(StringDropSym-Err)**
StringDropSym undefined

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{StringDropSym}\ \Uparrow 
\end{array}
```

**(BytesDropSym-Err)**
BytesDropSym undefined

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{BytesDropSym}\ \Uparrow 
\end{array}
```

#### 24.6.3 Runtime and Built-in Declarations

```math
\mathsf{RuntimeDeclJudg}\ =\ \{\operatorname{RuntimeSig}(\mathsf{sym})\ \Downarrow \ \langle \mathsf{params},\ \mathsf{ret}\rangle ,\ \operatorname{BuiltinSig}(\mathsf{method})\ \Downarrow \ \langle \mathsf{params},\ \mathsf{ret}\rangle ,\ \operatorname{RuntimeDecls}(S)\ \Downarrow \ \mathsf{decls}\}
```

```math
\begin{array}{l}
\mathsf{FileSystemBuiltinMethods}\ =\ \{\texttt{FileSystem::open\_read},\ \texttt{FileSystem::open\_write},\ \texttt{FileSystem::open\_append},\ \texttt{FileSystem::create\_write},\ \texttt{FileSystem::read\_file},\ \texttt{FileSystem::read\_bytes},\ \texttt{FileSystem::write\_file},\ \texttt{FileSystem::write\_stdout},\ \texttt{FileSystem::write\_stderr},\ \texttt{FileSystem::exists},\ \texttt{FileSystem::remove},\ \texttt{FileSystem::open\_dir},\ \texttt{FileSystem::create\_dir},\ \texttt{FileSystem::ensure\_dir},\ \texttt{FileSystem::kind},\ \texttt{FileSystem::restrict}\} \\
\mathsf{NetworkBuiltinMethods}\ =\ \{\texttt{Network::restrict\_to\_host}\} \\
\mathsf{HeapAllocatorBuiltinMethods}\ =\ \{\texttt{HeapAllocator::with\_quota},\ \texttt{HeapAllocator::alloc\_raw},\ \texttt{HeapAllocator::dealloc\_raw}\} \\
\mathsf{SystemBuiltinMethods}\ =\ \{\texttt{System::name}\ \mid \ \langle \mathsf{name},\ \mathsf{params},\ \mathsf{ret}\rangle \ \in \ \mathsf{SystemInterface}\} \\
\mathsf{ReactorBuiltinMethods}\ =\ \{\texttt{Reactor::run},\ \texttt{Reactor::register}\} \\
\mathsf{BuiltinMethods}\ =\ \mathsf{StringBuiltins}\ \cup \ \mathsf{BytesBuiltins}\ \cup \ \mathsf{FileSystemBuiltinMethods}\ \cup \ \mathsf{NetworkBuiltinMethods}\ \cup \ \mathsf{HeapAllocatorBuiltinMethods}\ \cup \ \mathsf{SystemBuiltinMethods}\ \cup \ \mathsf{ReactorBuiltinMethods} \\
\mathsf{RuntimeSyms}\ =\ \{\mathsf{PanicSym},\ \mathsf{StringDropSym},\ \mathsf{BytesDropSym},\ \mathsf{ContextInitSym}\}\ \cup \ \{\operatorname{BuiltinModalSym}(\mathsf{proc})\ \mid \ \mathsf{proc}\ \in \ \operatorname{dom}(\mathsf{BuiltinModalSymMap})\}\ \cup \ \{\mathsf{RegionAddrIsActiveSym},\ \mathsf{RegionAddrTagFromSym}\}\ \cup \ \{\operatorname{BuiltinSym}(\mathsf{method})\ \mid \ \mathsf{method}\ \in \ \mathsf{BuiltinMethods}\}
\end{array}
```

```math
\begin{array}{l}
\operatorname{BuiltinSig}(\texttt{FileSystem}\mathbin{::} \mathsf{name})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\operatorname{CapRecv}(\texttt{FileSystem},\ \mathsf{name}),\ \operatorname{TypeDynamic}(\texttt{FileSystem}))\rangle ]\ \mathbin{++} \ \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \operatorname{CapMethodSig}(\texttt{FileSystem},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle  \\
\operatorname{BuiltinSig}(\texttt{Network}\mathbin{::} \mathsf{name})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\operatorname{CapRecv}(\texttt{Network},\ \mathsf{name}),\ \operatorname{TypeDynamic}(\texttt{Network}))\rangle ]\ \mathbin{++} \ \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \operatorname{CapMethodSig}(\texttt{Network},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle  \\
\operatorname{BuiltinSig}(\texttt{HeapAllocator}\mathbin{::} \mathsf{name})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\operatorname{CapRecv}(\texttt{HeapAllocator},\ \mathsf{name}),\ \operatorname{TypeDynamic}(\texttt{HeapAllocator}))\rangle ]\ \mathbin{++} \ \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \operatorname{CapMethodSig}(\texttt{HeapAllocator},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle  \\
\operatorname{BuiltinSig}(\texttt{System}\mathbin{::} \mathsf{name})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypePath}([\texttt{"System"}]))\rangle ]\ \mathbin{++} \ \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \operatorname{SystemMethodSig}(\mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle  \\
\operatorname{BuiltinSig}(\texttt{Reactor}\mathbin{::} \mathsf{name})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\operatorname{CapRecv}(\texttt{Reactor},\ \mathsf{name}),\ \operatorname{TypeDynamic}(\texttt{Reactor}))\rangle ]\ \mathbin{++} \ \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \operatorname{CapMethodSig}(\texttt{Reactor},\ \mathsf{name})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle  \\
\operatorname{BuiltinSig}(\mathsf{method})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \operatorname{StringBytesBuiltinSig}(\mathsf{method})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle 
\end{array}
```

```math
\begin{array}{l}
\operatorname{RuntimeSig}(\mathsf{PanicSym})\ =\ \langle [\langle \bot ,\ \texttt{code},\ \operatorname{TypePrim}(\texttt{"u32"})\rangle ],\ \operatorname{TypePrim}(\texttt{"!"})\rangle  \\
\operatorname{RuntimeSig}(\mathsf{ContextInitSym})\ =\ \langle [],\ \operatorname{TypePath}([\texttt{"Context"}])\rangle  \\
\operatorname{RuntimeSig}(\mathsf{StringDropSym})\ =\ \langle [\langle \texttt{move},\ \texttt{value},\ \operatorname{TypeString}(\texttt{@Managed})\rangle ],\ \operatorname{TypePrim}(\texttt{"()"})\rangle  \\
\operatorname{RuntimeSig}(\mathsf{BytesDropSym})\ =\ \langle [\langle \texttt{move},\ \texttt{value},\ \operatorname{TypeBytes}(\texttt{@Managed})\rangle ],\ \operatorname{TypePrim}(\texttt{"()"})\rangle  \\
\operatorname{BuiltinModalProcSig}(\mathsf{proc})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \mathsf{proc}\ \in \ \mathsf{RegionProcs}\ \land \ \operatorname{RegionProcSig}(\mathsf{proc})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle  \\
\operatorname{BuiltinModalProcSig}(\texttt{CancelToken::new})\ =\ \langle [],\ \operatorname{TypeModalState}([\texttt{"CancelToken"}],\ \texttt{@Active})\rangle  \\
\operatorname{BuiltinModalProcSig}(\texttt{CancelToken::Active::cancel})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{shared},\ \operatorname{TypeModalState}([\texttt{"CancelToken"}],\ \texttt{@Active}))\rangle ],\ \operatorname{TypePrim}(\texttt{"()"})\rangle  \\
\operatorname{BuiltinModalProcSig}(\texttt{CancelToken::Active::is\_cancelled})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeModalState}([\texttt{"CancelToken"}],\ \texttt{@Active}))\rangle ],\ \operatorname{TypePrim}(\texttt{"bool"})\rangle  \\
\operatorname{BuiltinModalProcSig}(\texttt{CancelToken::Active::child})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeModalState}([\texttt{"CancelToken"}],\ \texttt{@Active}))\rangle ],\ \operatorname{TypeModalState}([\texttt{"CancelToken"}],\ \texttt{@Active})\rangle  \\
\operatorname{BuiltinModalProcSig}(\texttt{CancelToken::Active::wait\_cancelled})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeModalState}([\texttt{"CancelToken"}],\ \texttt{@Active}))\rangle ],\ \operatorname{TypePath}([\texttt{"Async"}],\ [\operatorname{TypePrim}(\texttt{"()"})])\rangle  \\
\operatorname{RuntimeSig}(\mathsf{sym})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}([\texttt{"Region"}],\ \texttt{@Active}))\rangle ,\ \langle \bot ,\ \texttt{size},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ,\ \langle \bot ,\ \texttt{align},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ],\ \operatorname{TypeRawPtr}(\texttt{mut},\ \operatorname{TypePrim}(\texttt{"u8"}))\rangle \ \Leftrightarrow \ \mathsf{sym}\ =\ \operatorname{BuiltinModalSym}(\texttt{Region::alloc}) \\
\operatorname{RuntimeSig}(\mathsf{sym})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}([\texttt{"Region"}],\ \texttt{@Active}))\rangle ],\ \operatorname{TypePrim}(\texttt{"usize"})\rangle \ \Leftrightarrow \ \mathsf{sym}\ =\ \operatorname{BuiltinModalSym}(\texttt{Region::mark}) \\
\operatorname{RuntimeSig}(\mathsf{sym})\ =\ \langle [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeModalState}([\texttt{"Region"}],\ \texttt{@Active}))\rangle ,\ \langle \bot ,\ \texttt{mark},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ],\ \operatorname{TypePrim}(\texttt{"()"})\rangle \ \Leftrightarrow \ \mathsf{sym}\ =\ \operatorname{BuiltinModalSym}(\texttt{Region::reset\_to}) \\
\operatorname{RuntimeSig}(\mathsf{sym})\ =\ \langle [\langle \bot ,\ \texttt{addr},\ \operatorname{TypeRawPtr}(\texttt{imm},\ \operatorname{TypePrim}(\texttt{"u8"}))\rangle ],\ \operatorname{TypePrim}(\texttt{"bool"})\rangle \ \Leftrightarrow \ \mathsf{sym}\ =\ \mathsf{RegionAddrIsActiveSym} \\
\operatorname{RuntimeSig}(\mathsf{sym})\ =\ \langle [\langle \bot ,\ \texttt{addr},\ \operatorname{TypeRawPtr}(\texttt{imm},\ \operatorname{TypePrim}(\texttt{"u8"}))\rangle ,\ \langle \bot ,\ \texttt{base},\ \operatorname{TypeRawPtr}(\texttt{imm},\ \operatorname{TypePrim}(\texttt{"u8"}))\rangle ],\ \operatorname{TypePrim}(\texttt{"()"})\rangle \ \Leftrightarrow \ \mathsf{sym}\ =\ \mathsf{RegionAddrTagFromSym} \\
\operatorname{RuntimeSig}(\mathsf{sym})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \mathsf{sym}\ =\ \operatorname{BuiltinModalSym}(\mathsf{proc})\ \land \ \mathsf{proc}\ \notin \ \{\texttt{Region::alloc},\ \texttt{Region::mark},\ \texttt{Region::reset\_to}\}\ \land \ \operatorname{BuiltinModalProcSig}(\mathsf{proc})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle  \\
\operatorname{RuntimeSig}(\mathsf{sym})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \mathsf{sym}\ =\ \operatorname{BuiltinSym}(\mathsf{method})\ \land \ \operatorname{BuiltinSig}(\mathsf{method})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle 
\end{array}
```

```math
\mathsf{LLVMDecl}\ :\ \mathsf{Symbol}\ \times \ \mathsf{Sig}\ \to \ \mathsf{LLVMDecl}
```

**(RuntimeDecls)**

```math
\begin{array}{l}
\forall \ \mathsf{sym}\ \in \ S,\ \operatorname{RuntimeSig}(\mathsf{sym})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \quad \operatorname{LLVMCallSig}(\mathsf{params},\ \mathsf{ret})\ \Downarrow \ \mathsf{sig} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{RuntimeDecls}(S)\ \Downarrow \ [\operatorname{LLVMDecl}(\mathsf{sym},\ \mathsf{sig})\ \mid \ \mathsf{sym}\ \in \ S]
\end{array}
```

```math
\begin{array}{l}
\mathsf{DeclAttrs}\ :\ \mathsf{Symbol}\ \to \ \mathsf{AttrSet} \\
\operatorname{DeclSyms}(\mathsf{LLVMIR})\ =\ \{\ \mathsf{sym}\ \mid \ \operatorname{LLVMDecl}(\mathsf{sym},\ \_)\ \in \ \mathsf{LLVMIR}\ \lor \ \operatorname{LLVMDefine}(\mathsf{sym},\ \_,\ \_)\ \in \ \mathsf{LLVMIR}\ \} \\
\operatorname{DeclAttrsOk}(\mathsf{sym})\ \Leftrightarrow \ (\mathsf{sym}\ =\ \mathsf{PanicSym}\ \Rightarrow \ \{\texttt{noreturn},\ \texttt{nounwind}\}\ \subseteq \ \operatorname{DeclAttrs}(\mathsf{sym}))\ \land \ (\mathsf{sym}\ \ne \ \mathsf{PanicSym}\ \Rightarrow \ \texttt{nounwind}\ \in \ \operatorname{DeclAttrs}(\mathsf{sym})) \\
\operatorname{RuntimeDeclsOk}(\mathsf{decls})\ \Leftrightarrow \ \forall \ \mathsf{sym}\ \in \ \operatorname{DeclSyms}(\mathsf{decls}).\ \operatorname{DeclAttrsOk}(\mathsf{sym}) \\
\operatorname{RuntimeDeclsCover}(\mathsf{LLVMIR},\ \mathsf{IR})\ \Leftrightarrow \ \operatorname{RuntimeRefs}(\mathsf{IR})\ \subseteq \ \operatorname{DeclSyms}(\mathsf{LLVMIR})
\end{array}
```

#### 24.6.4 Network, Heap, and Reactor Host-Primitives

**(Prim-Network-RestrictHost-Runtime)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{NetRestrictHost}(v_{\mathsf{net}},\ \mathsf{host})\ \Downarrow \ v_{\mathsf{net}}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{Network},\ \texttt{restrict\_to\_host},\ v_{\mathsf{net}},\ [\mathsf{host}])\ \Downarrow \ \operatorname{Val}(v_{\mathsf{net}}')
\end{array}
```

```math
\mathsf{HeapJudg}\ =\ \{\operatorname{HeapWithQuota}(v_{\mathsf{heap}},\ \mathsf{quota})\ \Downarrow \ v_{\mathsf{heap}}',\ \operatorname{HeapAllocRaw}(v_{\mathsf{heap}},\ \mathsf{count})\ \Downarrow \ \mathsf{ptr},\ \operatorname{HeapDeallocRaw}(v_{\mathsf{heap}},\ \mathsf{ptr},\ \mathsf{count})\ \Downarrow \ \mathsf{ok}\}
```

`HeapWithQuota`, `HeapAllocRaw`, and `HeapDeallocRaw` are runtime host-primitive relations with required semantics.

```math
\begin{array}{l}
\operatorname{HeapState}(v_{h})\ =\ \langle \mathsf{parent}_{h},\ \mathsf{quota}_{h},\ \mathsf{used}_{h}\rangle ,\ \mathsf{where}\ \texttt{quota\_h = 0}\ \mathsf{denotes}\ \mathsf{no}\ \mathsf{local}\ \mathsf{quota}\ \mathsf{bound}. \\
\operatorname{Anc}(v_{h})\ =\ [v_{h},\ \mathsf{parent}_{h},\ \operatorname{parent}(\mathsf{parent}_{h}),\ \ldots ]\ \mathsf{truncated}\ \mathsf{at}\ \texttt{bottom}. \\
\operatorname{Headroom}(v_{a})\ =\ +\infty \ \mathsf{if}\ \texttt{quota\_a = 0},\ \mathsf{otherwise}\ \texttt{max(quota\_a - used\_a, 0)}.
\end{array}
```

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

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{HeapWithQuota}(v_{\mathsf{heap}},\ \mathsf{quota})\ \Downarrow \ v_{\mathsf{heap}}' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{HeapAllocator},\ \texttt{with\_quota},\ v_{\mathsf{heap}},\ [\mathsf{quota}])\ \Downarrow \ \operatorname{Val}(v_{\mathsf{heap}}')
\end{array}
```

**(Prim-Heap-AllocRaw)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{HeapAllocRaw}(v_{\mathsf{heap}},\ \mathsf{count})\ \Downarrow \ \mathsf{ptr} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{HeapAllocator},\ \texttt{alloc\_raw},\ v_{\mathsf{heap}},\ [\mathsf{count}])\ \Downarrow \ \operatorname{Val}(\mathsf{ptr})
\end{array}
```

**(Prim-Heap-DeallocRaw)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{HeapDeallocRaw}(v_{\mathsf{heap}},\ \mathsf{ptr},\ \mathsf{count})\ \Downarrow \ \mathsf{ok} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{HeapAllocator},\ \texttt{dealloc\_raw},\ v_{\mathsf{heap}},\ [\mathsf{ptr},\ \mathsf{count}])\ \Downarrow \ \operatorname{Val}(\mathsf{UnitVal})
\end{array}
```

```math
\mathsf{ReactorJudg}\ =\ \{\operatorname{ReactorRun}(v_{\mathsf{reactor}},\ f)\ \Downarrow \ r,\ \operatorname{ReactorRegister}(v_{\mathsf{reactor}},\ f)\ \Downarrow \ h\}
```

`ReactorRun` and `ReactorRegister` are runtime host-primitive relations that interface the async model (§19) with a concrete event loop.

**(Prim-Reactor-Run)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ReactorRun}(v_{\mathsf{reactor}},\ f)\ \Downarrow \ r \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{Reactor},\ \texttt{run},\ v_{\mathsf{reactor}},\ [f])\ \Downarrow \ \operatorname{Val}(r)
\end{array}
```

**(Prim-Reactor-Register)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ReactorRegister}(v_{\mathsf{reactor}},\ f)\ \Downarrow \ h \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{PrimCall}(\texttt{Reactor},\ \texttt{register},\ v_{\mathsf{reactor}},\ [f])\ \Downarrow \ \operatorname{Val}(h)
\end{array}
```

### 24.7 Backend Requirements

This section owns the backend-specific LLVM requirements, IR declaration/instruction lowering, binding storage, ABI call lowering, vtable/literal emission, and poisoning instrumentation used by Chapter 24.

#### 24.7.1 LLVM Module Header

```math
\mathsf{LLVMHeader}\ =\ [\operatorname{TargetDataLayout}(\mathsf{LLVMDataLayout}),\ \operatorname{TargetTriple}(\mathsf{LLVMTriple})]
```

#### 24.7.2 Opaque Pointer Model

```math
\begin{array}{l}
\operatorname{AddrSpace}(T)\ = \\
\ 0\quad \mathsf{if}\ T\ =\ \operatorname{TypePtr}(U,\ s) \\
\ 0\quad \mathsf{if}\ T\ =\ \operatorname{TypeRawPtr}(q,\ U) \\
\ 0\quad \mathsf{if}\ T\ =\ \operatorname{TypeFunc}(\mathsf{params},\ R) \\
\ \operatorname{AddrSpace}(U)\quad \mathsf{if}\ T\ =\ \operatorname{TypePerm}(p,\ U)\ \land \ \operatorname{AddrSpace}(U)\ \mathsf{defined} \\
\ \bot \quad \mathsf{otherwise}
\end{array}
```

```math
\operatorname{LLVMPtrTy}(T)\ =\ \texttt{ptr addrspace(AddrSpace(T))}\ \mathsf{when}\ \operatorname{AddrSpace}(T)\ \mathsf{defined}
```

#### 24.7.3 LLVM Attribute Mapping

```math
\mathsf{LLVMAttrJudg}\ =\ \{\operatorname{PtrStateOf}(T)\ =\ s,\ \operatorname{LLVMPtrAttrs}(T)\ \Downarrow \ A,\ \operatorname{LLVMArgAttrs}(T)\ \Downarrow \ A\}
```

**(PtrStateOf-Perm)**

```math
\begin{array}{l}
\operatorname{PtrStateOf}(T)\ =\ s \\
\rule{18em}{0.4pt} \\
\operatorname{PtrStateOf}(\operatorname{TypePerm}(p,\ T))\ =\ s
\end{array}
```

**(LLVM-PtrAttrs-Valid)**

```math
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypePtr}(U,\ \texttt{Valid}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMPtrAttrs}(T)\ \Downarrow \ \{\texttt{nonnull},\ \texttt{dereferenceable}(\operatorname{sizeof}(U)),\ \texttt{align}(\operatorname{alignof}(U)),\ \texttt{noundef}\}
\end{array}
```

**(LLVM-PtrAttrs-Other)**

```math
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypePtr}(U,\ s)\quad s\ \in \ \{\bot ,\ \texttt{Null},\ \texttt{Expired}\} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMPtrAttrs}(T)\ \Downarrow \ \emptyset 
\end{array}
```

**(LLVM-PtrAttrs-RawPtr)**

```math
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypeRawPtr}(q,\ U) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMPtrAttrs}(T)\ \Downarrow \ \emptyset 
\end{array}
```

**(LLVM-ArgAttrs-Ptr)**

```math
\begin{array}{l}
\operatorname{LLVMArgAttrsPtr}(T)\ =\ (\operatorname{PermOf}(T)\ =\ \texttt{unique}\ \mathsf{Sigma}\ \{\texttt{noalias}\}\ :\ \emptyset )\ \cup \ (\operatorname{PermOf}(T)\ =\ \texttt{const}\ \mathsf{Sigma}\ \{\texttt{readonly}\}\ :\ \emptyset ) \\
\operatorname{StripPerm}(T)\ \in \ \{\operatorname{TypePtr}(\_,\ \_),\ \operatorname{TypeFunc}(\_,\ \_)\} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMArgAttrs}(T)\ \Downarrow \ \operatorname{LLVMArgAttrsPtr}(T)
\end{array}
```

**(LLVM-ArgAttrs-RawPtr)**

```math
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypeRawPtr}(\_,\ \_) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMArgAttrs}(T)\ \Downarrow \ \emptyset 
\end{array}
```

**(LLVM-ArgAttrs-NonPtr)**

```math
\begin{array}{l}
\operatorname{StripPerm}(T)\ \notin \ \{\operatorname{TypePtr}(\_,\ \_),\ \operatorname{TypeRawPtr}(\_,\ \_),\ \operatorname{TypeFunc}(\_,\ \_)\} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMArgAttrs}(T)\ \Downarrow \ \emptyset 
\end{array}
```

NoEscapeParam(x) predicate

```math
\begin{array}{l}
\operatorname{NoEscapeParam}(x)\ \Leftrightarrow \ \mathsf{false} \\
\operatorname{OptArgAttrs}(x)\ \subseteq \ \{\texttt{nocapture}\}\ \land \ (\texttt{nocapture}\ \in \ \operatorname{OptArgAttrs}(x)\ \Rightarrow \ \operatorname{NoEscapeParam}(x)) \\
\operatorname{LLVMArgAttrsExt}(x,\ T)\ =\ \operatorname{LLVMArgAttrs}(T)\ \cup \ \operatorname{OptArgAttrs}(x)
\end{array}
```

#### 24.7.4 UB and Poison Avoidance

```math
\begin{array}{l}
\operatorname{LLVMInstrs}(\mathsf{LLVMIR})\ =\ [i_{0},\ \ldots ,\ i_{n}] \\
\operatorname{Opcode}(i)\ =\ \mathsf{op} \\
\operatorname{UsesOpcode}(\mathsf{LLVMIR},\ \mathsf{op})\ \Leftrightarrow \ \exists \ i\ \in \ \operatorname{LLVMInstrs}(\mathsf{LLVMIR}).\ \operatorname{Opcode}(i)\ =\ \mathsf{op} \\
\operatorname{Intrinsic}(i)\ =\ \mathsf{name} \\
\operatorname{UsesIntrinsic}(\mathsf{LLVMIR},\ \mathsf{name})\ \Leftrightarrow \ \exists \ i\ \in \ \operatorname{LLVMInstrs}(\mathsf{LLVMIR}).\ \operatorname{Intrinsic}(i)\ =\ \mathsf{name} \\
\operatorname{NoUndefPoison}(\mathsf{LLVMIR})\ \Leftrightarrow \ \lnot \ \operatorname{UsesOpcode}(\mathsf{LLVMIR},\ \texttt{undef})\ \land \ \lnot \ \operatorname{UsesOpcode}(\mathsf{LLVMIR},\ \texttt{poison}) \\
\operatorname{NoNSWNUW}(\mathsf{LLVMIR})\ \Leftrightarrow \ \lnot \ \operatorname{UsesOpcode}(\mathsf{LLVMIR},\ \texttt{nsw})\ \land \ \lnot \ \operatorname{UsesOpcode}(\mathsf{LLVMIR},\ \texttt{nuw}) \\
\operatorname{CheckedOverflow}(\mathsf{LLVMIR})\ \Leftrightarrow \ \lnot \ \operatorname{UsesOpcode}(\mathsf{LLVMIR},\ \texttt{add})\ \land \ \lnot \ \operatorname{UsesOpcode}(\mathsf{LLVMIR},\ \texttt{sub})\ \land \ \lnot \ \operatorname{UsesOpcode}(\mathsf{LLVMIR},\ \texttt{mul})\ \land \ \operatorname{UsesIntrinsic}(\mathsf{LLVMIR},\ \texttt{llvm.*.with.overflow}) \\
\operatorname{CheckedDivRem}(\mathsf{LLVMIR})\ \Leftrightarrow \ \operatorname{UsesIntrinsic}(\mathsf{LLVMIR},\ \texttt{llvm.sdiv.with.check})\ \land \ \operatorname{UsesIntrinsic}(\mathsf{LLVMIR},\ \texttt{llvm.udiv.with.check}) \\
\operatorname{CheckedShifts}(\mathsf{LLVMIR})\ \Leftrightarrow \ \operatorname{UsesIntrinsic}(\mathsf{LLVMIR},\ \texttt{llvm.shift.with.check}) \\
\operatorname{FrozenPoisonUses}(\mathsf{LLVMIR})\ \Leftrightarrow \ \operatorname{UsesOpcode}(\mathsf{LLVMIR},\ \texttt{freeze}) \\
\operatorname{InboundsGEP}(\mathsf{LLVMIR})\ \Leftrightarrow \ \lnot \ \operatorname{UsesOpcode}(\mathsf{LLVMIR},\ \texttt{getelementptr inbounds})\ \lor \ \operatorname{UsesOpcode}(\mathsf{LLVMIR},\ \texttt{gep.inbounds.checked}) \\
\operatorname{LLVMUBSafe}(\mathsf{LLVMIR})\ \Leftrightarrow \ \operatorname{NoUndefPoison}(\mathsf{LLVMIR})\ \land \ \operatorname{CheckedOverflow}(\mathsf{LLVMIR})\ \land \ \operatorname{CheckedDivRem}(\mathsf{LLVMIR})\ \land \ \operatorname{CheckedShifts}(\mathsf{LLVMIR})\ \land \ \operatorname{FrozenPoisonUses}(\mathsf{LLVMIR})\ \land \ \operatorname{InboundsGEP}(\mathsf{LLVMIR})\ \land \ \operatorname{NoNSWNUW}(\mathsf{LLVMIR})
\end{array}
```

#### 24.7.5 Memory Intrinsics

```math
\operatorname{Memmove}(\mathsf{dst},\ \mathsf{src},\ n)\ =\ [\texttt{call}\ \texttt{llvm.memmove}(\mathsf{dst},\ \mathsf{src},\ n)]
```
MemcpyOverlapUnknown(dst, src, n) predicate

```math
\begin{array}{l}
\operatorname{MemcpyOverlapUnknown}(\mathsf{dst},\ \mathsf{src},\ n)\ \Leftrightarrow \ \mathsf{true} \\
\operatorname{MemcpyAllowed}(\mathsf{dst},\ \mathsf{src},\ n)\ \Leftrightarrow \ \lnot \ \operatorname{MemcpyOverlapUnknown}(\mathsf{dst},\ \mathsf{src},\ n) \\
\operatorname{AggMemcpy}(\mathsf{dst},\ \mathsf{src},\ n)\ = \\
\ \operatorname{Memcpy}(\mathsf{dst},\ \mathsf{src},\ n)\quad \mathsf{if}\ \operatorname{MemcpyAllowed}(\mathsf{dst},\ \mathsf{src},\ n) \\
\ \operatorname{Memmove}(\mathsf{dst},\ \mathsf{src},\ n)\quad \mathsf{otherwise} \\
\operatorname{AggZero}(\mathsf{dst},\ n)\ =\ \operatorname{Memset}(\mathsf{dst},\ 0,\ n) \\
\operatorname{LifetimeOpt}(T)\ \subseteq \ \{\texttt{llvm.lifetime.start}(\operatorname{sizeof}(T)),\ \texttt{llvm.lifetime.end}(\operatorname{sizeof}(T))\}
\end{array}
```

#### 24.7.6 LLVM Toolchain Version

LLVMToolchain = "21.1.8"
The hosted compiler MUST be built against an in-process LLVM backend whose version is LLVMToolchain.

#### 24.7.7 LLVM Type Mapping

```math
\mathsf{LLVMTyJudg}\ =\ \{\operatorname{LLVMTy}(T)\ \Downarrow \ \tau \}
```

```math
\begin{array}{l}
\mathsf{LLVMZST}\ =\ \{\} \\
\operatorname{Pad}(n)\ = \\
\ []\quad \mathsf{if}\ n\ =\ 0 \\
\ [n\ \times \ \mathsf{i8}]\ \mathsf{if}\ n\ \ne \ 0
\end{array}
```

```math
\begin{array}{l}
\operatorname{LLVMPrim}(\mathsf{name})\ = \\
\ \mathsf{i8}\quad \mathsf{if}\ \mathsf{name}\ \in \ \{\mathsf{i8},\ \mathsf{u8}\} \\
\ \mathsf{i16}\quad \mathsf{if}\ \mathsf{name}\ \in \ \{\mathsf{i16},\ \mathsf{u16}\} \\
\ \mathsf{i32}\quad \mathsf{if}\ \mathsf{name}\ \in \ \{\mathsf{i32},\ \mathsf{u32}\} \\
\ \mathsf{i64}\quad \mathsf{if}\ \mathsf{name}\ \in \ \{\mathsf{i64},\ \mathsf{u64}\} \\
\ \mathsf{i128}\quad \mathsf{if}\ \mathsf{name}\ \in \ \{\mathsf{i128},\ \mathsf{u128}\} \\
\ \texttt{half}\quad \mathsf{if}\ \mathsf{name}\ =\ \mathsf{f16} \\
\ \texttt{float}\ \mathsf{if}\ \mathsf{name}\ =\ \mathsf{f32} \\
\ \texttt{double}\ \mathsf{if}\ \mathsf{name}\ =\ \mathsf{f64} \\
\ \mathsf{i8}\quad \mathsf{if}\ \mathsf{name}\ =\ \texttt{bool} \\
\ \mathsf{i32}\quad \mathsf{if}\ \mathsf{name}\ =\ \texttt{char} \\
\ \mathsf{i64}\quad \mathsf{if}\ \mathsf{name}\ \in \ \{\texttt{usize},\ \texttt{isize}\} \\
\ \mathsf{LLVMZST}\ \mathsf{if}\ \mathsf{name}\ \in \ \{\texttt{()},\ \texttt{!}\} \\
\ \bot \quad \mathsf{otherwise}
\end{array}
```

```math
\begin{array}{l}
\operatorname{LLVMStruct}([t_{1},\ \ldots ,\ t_{k}])\ =\ \{\ t_{1},\ \ldots ,\ t_{k}\ \} \\
\operatorname{LLVMArray}(n,\ t)\ =\ [n\ \times \ t]
\end{array}
```
LLVMArrayConst(n, t, elems) constructor

```math
\operatorname{SlicePtrTy}(T)\ =\ \operatorname{LLVMPtrTy}(\operatorname{TypeRawPtr}(\texttt{imm},\ T))
```

```math
\begin{array}{l}
\operatorname{StructElems}([],\ [],\ 0)\ =\ [] \\
\operatorname{StructElems}([\langle f_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle f_{n},\ T_{n}\rangle ],\ [o_{1},\ \ldots ,\ o_{n}],\ \mathsf{size})\ =\ \operatorname{Pad}(\mathsf{pad}_{1})\ \mathbin{++} \ [\tau_{1} ]\ \mathbin{++} \ \ldots \ \mathbin{++} \ \operatorname{Pad}(\mathsf{pad}_{n})\ \mathbin{++} \ [\tau_{n} ]\ \mathbin{++} \ \operatorname{Pad}(\mathsf{pad}_{\mathsf{tail}}) \\
\mathsf{pad}_{1}\ =\ o_{1} \\
\mathsf{pad}_{i}\ =\ o_{i}\ -\ (o\_\{i-1\}\ +\ \operatorname{sizeof}(T\_\{i-1\}))\quad \mathsf{for}\ i\ =\ 2..n \\
\mathsf{pad}_{\mathsf{tail}}\ =\ \mathsf{size}\ -\ (o_{n}\ +\ \operatorname{sizeof}(T_{n})) \\
\tau_{i} \ =\ \operatorname{LLVMTy}(T_{i})
\end{array}
```

```math
\begin{array}{l}
\operatorname{TaggedElems}(\mathsf{disc},\ \mathsf{payload}_{\mathsf{size}},\ \mathsf{payload}_{\mathsf{align}},\ \mathsf{size})\ =\ [\operatorname{LLVMTy}(\mathsf{disc})]\ \mathbin{++} \ \operatorname{Pad}(\mathsf{pad}_{\mathsf{mid}})\ \mathbin{++} \ [\operatorname{LLVMArray}(\mathsf{payload}_{\mathsf{size}},\ \mathsf{i8})]\ \mathbin{++} \ \operatorname{Pad}(\mathsf{pad}_{\mathsf{tail}}) \\
\mathsf{disc}_{\mathsf{size}}\ =\ \operatorname{sizeof}(\mathsf{disc}) \\
\mathsf{payload}_{\mathsf{off}}\ =\ \operatorname{AlignUp}(\mathsf{disc}_{\mathsf{size}},\ \mathsf{payload}_{\mathsf{align}}) \\
\mathsf{pad}_{\mathsf{mid}}\ =\ \mathsf{payload}_{\mathsf{off}}\ -\ \mathsf{disc}_{\mathsf{size}} \\
\mathsf{pad}_{\mathsf{tail}}\ =\ \mathsf{size}\ -\ (\mathsf{payload}_{\mathsf{off}}\ +\ \mathsf{payload}_{\mathsf{size}})
\end{array}
```

**(LLVMTy-Prim)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePrim}(\mathsf{name})\quad \operatorname{LLVMPrim}(\mathsf{name})\ =\ \tau  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau 
\end{array}
```

**(LLVMTy-Perm)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMTy}(\operatorname{TypePerm}(p,\ T))\ \Downarrow \ \tau 
\end{array}
```

**(LLVMTy-Refine)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMTy}(\operatorname{TypeRefine}(T,\ P))\ \Downarrow \ \tau 
\end{array}
```

**(LLVMTy-Ptr)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePtr}(U,\ s)\quad \operatorname{LLVMPtrTy}(T)\ =\ \tau  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau 
\end{array}
```

**(LLVMTy-RawPtr)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeRawPtr}(q,\ U)\quad \operatorname{LLVMPtrTy}(T)\ =\ \tau  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau 
\end{array}
```

**(LLVMTy-Func)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeFunc}(\mathsf{params},\ R)\quad \operatorname{LLVMPtrTy}(T)\ =\ \tau  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau 
\end{array}
```

**(LLVMTy-Closure)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeClosure}(\mathsf{params},\ R,\ \mathsf{deps}_{\mathsf{opt}}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \operatorname{LLVMStruct}([\texttt{ptr},\ \texttt{ptr}])
\end{array}
```

**(LLVMTy-Alias)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{AliasBody}(p)\ =\ \mathsf{ty}\quad \Gamma \ \vdash \ \operatorname{LLVMTy}(\mathsf{ty})\ \Downarrow \ \tau  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau 
\end{array}
```

**(LLVMTy-Record)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \operatorname{Fields}(R)\ =\ \mathsf{fields}\quad \operatorname{RecordLayout}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \quad \operatorname{StructElems}(\mathsf{fields},\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{elems} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \operatorname{LLVMStruct}(\mathsf{elems})
\end{array}
```

**(LLVMTy-Tuple)**

```math
\begin{array}{l}
\operatorname{TupleLayout}([T_{1},\ \ldots ,\ T_{n}])\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \quad \operatorname{StructElems}([\langle 0,\ T_{1}\rangle ,\ \ldots ,\ \langle n-1,\ T_{n}\rangle ],\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{elems} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMTy}(\operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}]))\ \Downarrow \ \operatorname{LLVMStruct}(\mathsf{elems})
\end{array}
```

**(LLVMTy-Array)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeArray}(T_{0},\ e)\quad \Gamma \ \vdash \ \operatorname{ConstLen}(e)\ \Downarrow \ n\quad \Gamma \ \vdash \ \operatorname{LLVMTy}(T_{0})\ \Downarrow \ \tau  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \operatorname{LLVMArray}(n,\ \tau )
\end{array}
```

**(LLVMTy-Slice)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeSlice}(T_{0})\quad \Gamma \ \vdash \ \operatorname{LLVMTy}(\operatorname{TypePrim}(\texttt{"usize"}))\ \Downarrow \ \tau_{u}  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \operatorname{LLVMStruct}([\operatorname{SlicePtrTy}(T_{0}),\ \tau_{u} ])
\end{array}
```

**(LLVMTy-Range)**

```math
\begin{array}{l}
\operatorname{TupleLayout}([T_{0},\ T_{0}])\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \quad \operatorname{StructElems}([\langle 0,\ T_{0}\rangle ,\ \langle 1,\ T_{0}\rangle ],\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{elems} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMTy}(\operatorname{TypeRange}(T_{0}))\ \Downarrow \ \operatorname{LLVMStruct}(\mathsf{elems})
\end{array}
```

**(LLVMTy-RangeInclusive)**

```math
\begin{array}{l}
\operatorname{TupleLayout}([T_{0},\ T_{0}])\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \quad \operatorname{StructElems}([\langle 0,\ T_{0}\rangle ,\ \langle 1,\ T_{0}\rangle ],\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{elems} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMTy}(\operatorname{TypeRangeInclusive}(T_{0}))\ \Downarrow \ \operatorname{LLVMStruct}(\mathsf{elems})
\end{array}
```

**(LLVMTy-RangeFrom)**

```math
\begin{array}{l}
\operatorname{TupleLayout}([T_{0}])\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \quad \operatorname{StructElems}([\langle 0,\ T_{0}\rangle ],\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{elems} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMTy}(\operatorname{TypeRangeFrom}(T_{0}))\ \Downarrow \ \operatorname{LLVMStruct}(\mathsf{elems})
\end{array}
```

**(LLVMTy-RangeTo)**

```math
\begin{array}{l}
\operatorname{TupleLayout}([T_{0}])\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \quad \operatorname{StructElems}([\langle 0,\ T_{0}\rangle ],\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{elems} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMTy}(\operatorname{TypeRangeTo}(T_{0}))\ \Downarrow \ \operatorname{LLVMStruct}(\mathsf{elems})
\end{array}
```

**(LLVMTy-RangeToInclusive)**

```math
\begin{array}{l}
\operatorname{TupleLayout}([T_{0}])\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \quad \operatorname{StructElems}([\langle 0,\ T_{0}\rangle ],\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{elems} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMTy}(\operatorname{TypeRangeToInclusive}(T_{0}))\ \Downarrow \ \operatorname{LLVMStruct}(\mathsf{elems})
\end{array}
```

**(LLVMTy-RangeFull)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMTy}(\mathsf{TypeRangeFull})\ \Downarrow \ \operatorname{LLVMStruct}([])
\end{array}
```

**(LLVMTy-Enum)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{EnumLayout}(E)\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{disc},\ \mathsf{payload}_{\mathsf{size}}\rangle \quad \mathsf{payload}_{\mathsf{align}}\ =\ \operatorname{PayloadAlign}(E)\quad \operatorname{TaggedElems}(\mathsf{disc},\ \mathsf{payload}_{\mathsf{size}},\ \mathsf{payload}_{\mathsf{align}},\ \mathsf{size})\ =\ \mathsf{elems} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \operatorname{LLVMStruct}(\mathsf{elems})
\end{array}
```

**(LLVMTy-Union-Niche)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad \operatorname{NicheApplies}(T)\quad \operatorname{PayloadMember}(T)\ =\ T_{p}\quad \Gamma \ \vdash \ \operatorname{LLVMTy}(T_{p})\ \Downarrow \ \tau  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau 
\end{array}
```

**(LLVMTy-Union-Tagged)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad \operatorname{UnionLayout}(T)\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{disc},\ \mathsf{payload}_{\mathsf{size}}\rangle \quad \mathsf{disc}\ \ne \ \bot \quad \mathsf{payload}_{\mathsf{align}}\ =\ \operatorname{PayloadAlign}(T)\quad \operatorname{TaggedElems}(\mathsf{disc},\ \mathsf{payload}_{\mathsf{size}},\ \mathsf{payload}_{\mathsf{align}},\ \mathsf{size})\ =\ \mathsf{elems} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \operatorname{LLVMStruct}(\mathsf{elems})
\end{array}
```

**(LLVMTy-Modal-Niche)**

```math
\begin{array}{l}
T\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \operatorname{NicheApplies}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{PayloadState}(\mathsf{modal}_{\mathsf{ref}})\ =\ S_{p}\quad \operatorname{ModalSingleFieldPayload}(\mathsf{modal}_{\mathsf{ref}},\ S_{p})\ =\ T_{p}\quad \Gamma \ \vdash \ \operatorname{LLVMTy}(T_{p})\ \Downarrow \ \tau  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau 
\end{array}
```

**(LLVMTy-Modal-Tagged)**

```math
\begin{array}{l}
T\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \operatorname{ModalLayout}(\mathsf{modal}_{\mathsf{ref}})\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{disc},\ \mathsf{payload}_{\mathsf{size}}\rangle \quad \mathsf{disc}\ \ne \ \bot \quad \mathsf{payload}_{\mathsf{align}}\ =\ \mathsf{max}\_\{S\ \in \ \operatorname{States}(M)\}(\operatorname{StateAlign}(\mathsf{modal}_{\mathsf{ref}},\ S))\quad \operatorname{TaggedElems}(\mathsf{disc},\ \mathsf{payload}_{\mathsf{size}},\ \mathsf{payload}_{\mathsf{align}},\ \mathsf{size})\ =\ \mathsf{elems} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \operatorname{LLVMStruct}(\mathsf{elems})
\end{array}
```

**(LLVMTy-Modal-StringBytes)**

```math
\begin{array}{l}
\operatorname{BaseModal}(\operatorname{TypeString}(\bot ))\ =\ \operatorname{TypePath}([\texttt{"string"}]) \\
\operatorname{BaseModal}(\operatorname{TypeBytes}(\bot ))\ =\ \operatorname{TypePath}([\texttt{"bytes"}]) \\
T\ \in \ \{\operatorname{TypeString}(\bot ),\ \operatorname{TypeBytes}(\bot )\}\quad \operatorname{ModalLayout}(\operatorname{BaseModal}(T))\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{disc},\ \mathsf{payload}_{\mathsf{size}}\rangle \quad (\mathsf{disc}\ =\ \bot \ \Rightarrow \ \operatorname{PayloadState}(\operatorname{BaseModal}(T))\ =\ S_{p}\ \land \ \operatorname{ModalSingleFieldPayload}(\operatorname{BaseModal}(T),\ S_{p})\ =\ T_{p}\ \land \ \Gamma \ \vdash \ \operatorname{LLVMTy}(T_{p})\ \Downarrow \ \tau )\quad (\mathsf{disc}\ \ne \ \bot \ \Rightarrow \ \operatorname{ModalDeclOf}(\operatorname{BaseModal}(T))\ =\ M\ \land \ \mathsf{payload}_{\mathsf{align}}\ =\ \mathsf{max}\_\{S\ \in \ \operatorname{States}(M)\}(\operatorname{StateAlign}(\operatorname{BaseModal}(T),\ S))\ \land \ \operatorname{TaggedElems}(\mathsf{disc},\ \mathsf{payload}_{\mathsf{size}},\ \mathsf{payload}_{\mathsf{align}},\ \mathsf{size})\ =\ \mathsf{elems}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ (\tau \ \mathsf{if}\ \mathsf{disc}\ =\ \bot \ \mathsf{else}\ \operatorname{LLVMStruct}(\mathsf{elems}))
\end{array}
```

**(LLVMTy-ModalState)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad S\ \in \ \operatorname{States}(M)\quad \operatorname{ModalPayload}(\mathsf{modal}_{\mathsf{ref}},\ S)\ =\ \mathsf{fields}\quad \operatorname{RecordLayout}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \quad \operatorname{StructElems}(\mathsf{fields},\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{elems} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \operatorname{LLVMStruct}(\mathsf{elems})
\end{array}
```

**(LLVMTy-Dynamic)**

```math
\begin{array}{l}
\operatorname{DynLayout}(\mathsf{Cl})\ \Downarrow \ \langle \_,\ \_,\ [\langle \texttt{data},\ T_{d}\rangle ,\ \langle \texttt{vtable},\ T_{v}\rangle ]\rangle \quad \Gamma \ \vdash \ \operatorname{LLVMTy}(T_{d})\ \Downarrow \ \tau_{d} \quad \Gamma \ \vdash \ \operatorname{LLVMTy}(T_{v})\ \Downarrow \ \tau_{v}  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMTy}(\operatorname{TypeDynamic}(\mathsf{Cl}))\ \Downarrow \ \operatorname{LLVMStruct}([\tau_{d} ,\ \tau_{v} ])
\end{array}
```

**(LLVMTy-StringView)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeString}(\texttt{@View})\quad \Gamma \ \vdash \ \operatorname{LLVMTy}(\operatorname{TypePrim}(\texttt{"usize"}))\ \Downarrow \ \tau_{u}  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \operatorname{LLVMStruct}([\operatorname{LLVMPtrTy}(\operatorname{TypePtr}(\operatorname{TypePerm}(\texttt{const},\ \operatorname{TypePrim}(\texttt{"u8"})),\ \texttt{Valid})),\ \tau_{u} ])
\end{array}
```

**(LLVMTy-StringManaged)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeString}(\texttt{@Managed})\quad \Gamma \ \vdash \ \operatorname{LLVMTy}(\operatorname{TypePrim}(\texttt{"usize"}))\ \Downarrow \ \tau_{u}  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \operatorname{LLVMStruct}([\operatorname{LLVMPtrTy}(\operatorname{TypePtr}(\operatorname{TypePrim}(\texttt{"u8"}),\ \texttt{Valid})),\ \tau_{u} ,\ \tau_{u} ])
\end{array}
```

**(LLVMTy-BytesView)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeBytes}(\texttt{@View})\quad \Gamma \ \vdash \ \operatorname{LLVMTy}(\operatorname{TypePrim}(\texttt{"usize"}))\ \Downarrow \ \tau_{u}  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \operatorname{LLVMStruct}([\operatorname{LLVMPtrTy}(\operatorname{TypePtr}(\operatorname{TypePerm}(\texttt{const},\ \operatorname{TypePrim}(\texttt{"u8"})),\ \texttt{Valid})),\ \tau_{u} ])
\end{array}
```

**(LLVMTy-BytesManaged)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypeBytes}(\texttt{@Managed})\quad \Gamma \ \vdash \ \operatorname{LLVMTy}(\operatorname{TypePrim}(\texttt{"usize"}))\ \Downarrow \ \tau_{u}  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \operatorname{LLVMStruct}([\operatorname{LLVMPtrTy}(\operatorname{TypePtr}(\operatorname{TypePrim}(\texttt{"u8"}),\ \texttt{Valid})),\ \tau_{u} ,\ \tau_{u} ])
\end{array}
```

**(LLVMTy-Err)**
LLVMTy(T) undefined

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Uparrow 
\end{array}
```

#### 24.7.8 IR Declaration and Instruction Lowering

```math
\mathsf{LowerIRJudg}\ =\ \{\operatorname{LowerIRDecl}(d)\ \Downarrow \ \mathsf{ll},\ \operatorname{LowerIRInstr}(\mathsf{op})\ \Downarrow \ \mathsf{ll}\}
```

```math
\begin{array}{l}
\mathsf{LLVMInstrList}\ =\ [\mathsf{LLVMInstr}] \\
\operatorname{Label}(l)\ \in \ \mathsf{LLVMInstr} \\
\operatorname{Br}(l)\ \in \ \mathsf{LLVMInstr} \\
\operatorname{BrCond}(v,\ l_{t},\ l_{f})\ \in \ \mathsf{LLVMInstr} \\
\operatorname{Phi}(\tau ,\ \mathsf{inc},\ v)\ \in \ \mathsf{LLVMInstr} \\
\operatorname{HasLabel}(I,\ l)\ \Leftrightarrow \ \operatorname{Label}(l)\ \in \ I \\
\operatorname{HasBrCond}(I,\ v)\ \Leftrightarrow \ \exists \ l_{t},\ l_{f}.\ \operatorname{BrCond}(v,\ l_{t},\ l_{f})\ \in \ I \\
\operatorname{HasPhi}(I,\ v)\ \Leftrightarrow \ \exists \ \tau ,\ \mathsf{inc}.\ \operatorname{Phi}(\tau ,\ \mathsf{inc},\ v)\ \in \ I \\
\operatorname{FreshLabel}(\Gamma )\ \mathsf{predicate} \\
\operatorname{FreshSSA}(\Gamma )\ \mathsf{predicate}
\end{array}
```
LLVMSSA = Name
LLVMLabel = Name

```math
\begin{array}{l}
\operatorname{FreshLabel}(\Gamma )\ \in \ \mathsf{LLVMLabel}\ \setminus \ \operatorname{dom}(\Gamma ) \\
\operatorname{FreshSSA}(\Gamma )\ \in \ \mathsf{LLVMSSA}\ \setminus \ \operatorname{dom}(\Gamma )
\end{array}
```

```math
\operatorname{IfLabels}(\Gamma )\ =\ \langle l_{t},\ l_{f},\ l_{m}\rangle \ \land \ \operatorname{Distinct}([l_{t},\ l_{f},\ l_{m}])
```

```math
\begin{array}{l}
\mathsf{LLResult}\ =\ \{\langle I,\ v\rangle \ \mid \ I\ \in \ \mathsf{LLVMInstrList}\ \land \ v\ \in \ \mathsf{LLVMSSA}\ \cup \ \{\bot \}\} \\
\operatorname{SeqLL}(\langle I_{1},\ v_{1}\rangle ,\ \langle I_{2},\ v_{2}\rangle )\ =\ \langle I_{1}\ \mathbin{++} \ I_{2},\ v_{2}\rangle 
\end{array}
```

**(LowerIRInstr-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\varepsilon )\ \Downarrow \ \langle [],\ \bot \rangle 
\end{array}
```

**(LowerIRInstr-Seq)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{IR}_{1})\ \Downarrow \ \mathsf{ll}_{1}\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{IR}_{2})\ \Downarrow \ \mathsf{ll}_{2} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{SeqIR}(\mathsf{IR}_{1},\ \mathsf{IR}_{2}))\ \Downarrow \ \operatorname{SeqLL}(\mathsf{ll}_{1},\ \mathsf{ll}_{2})
\end{array}
```

```math
\begin{array}{l}
\operatorname{Load}(\mathsf{slot},\ T)\ =\ [\texttt{load}\ \operatorname{LLVMTy}(T),\ \mathsf{slot}\ :\ \operatorname{LLVMPtrTy}(T)] \\
\operatorname{Store}(\mathsf{slot},\ v,\ T)\ =\ [\texttt{store}\ \operatorname{LLVMTy}(T)\ v,\ \mathsf{slot}\ :\ \operatorname{LLVMPtrTy}(T)] \\
\operatorname{Memcpy}(\mathsf{dst},\ \mathsf{src},\ n)\ =\ [\texttt{call}\ \texttt{llvm.memcpy}(\mathsf{dst},\ \mathsf{src},\ n)] \\
\operatorname{Memset}(\mathsf{dst},\ 0,\ n)\ =\ [\texttt{call}\ \texttt{llvm.memset}(\mathsf{dst},\ 0,\ n)] \\
\operatorname{LoadVal}(\mathsf{slot},\ T)\ \Downarrow \ \langle \operatorname{Load}(\mathsf{slot},\ T),\ v\rangle 
\end{array}
```

```math
\begin{array}{l}
\operatorname{LEValue}(\mathsf{bytes})\ =\ \sum \_\{i=0\}^\{\mid \mathsf{bytes}\mid -1\}\ \mathsf{bytes}[i]\ \cdot \ 256^i \\
\operatorname{ByteInt}(\mathsf{bytes})\ =\ i\{8\mid \mathsf{bytes}\mid \}\ \operatorname{LEValue}(\mathsf{bytes})
\end{array}
```

```math
\begin{array}{l}
\operatorname{AllZero}(\mathsf{bytes})\ \Leftrightarrow \ \forall \ b\ \in \ \mathsf{bytes}.\ b\ =\ 0\mathsf{x00} \\
\operatorname{ByteArray}(\mathsf{bytes})\ =\ \operatorname{LLVMArrayConst}(\mid \mathsf{bytes}\mid ,\ \mathsf{i8},\ \mathsf{bytes}) \\
\operatorname{ConstBytes}(\tau ,\ \mathsf{bytes})\ =\ c\ \Leftrightarrow \ \exists \ T.\ \Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau \ \land \ \mid \mathsf{bytes}\mid \ =\ \operatorname{sizeof}(T)\ \land \ c\ =\ \operatorname{ConstBytesCase}(\tau ,\ \mathsf{bytes}) \\
\operatorname{ConstBytesCase}(\tau ,\ \mathsf{bytes})\ = \\
\ \texttt{zeroinitializer}\quad \mathsf{if}\ \mid \mathsf{bytes}\mid \ =\ 0 \\
\ \operatorname{ByteArray}(\mathsf{bytes})\quad \mathsf{if}\ \tau \ =\ \operatorname{LLVMArray}(\mid \mathsf{bytes}\mid ,\ \mathsf{i8}) \\
\ \operatorname{ByteInt}(\mathsf{bytes})\quad \mathsf{if}\ \tau \ =\ i\{8\mid \mathsf{bytes}\mid \} \\
\ \texttt{bitcast}(\operatorname{ByteInt}(\mathsf{bytes})\ \mathsf{to}\ \tau )\quad \mathsf{if}\ \tau \ \in \ \{\texttt{half},\ \texttt{float},\ \texttt{double}\} \\
\ \texttt{null}\quad \mathsf{if}\ \tau \ =\ \operatorname{LLVMPtrTy}(U)\ \land \ \operatorname{AllZero}(\mathsf{bytes}) \\
\ \bot \quad \mathsf{otherwise} \\
\operatorname{LLVMGlobalZero}(\mathsf{sym},\ \tau ,\ \mathsf{align})\ =\ \operatorname{LLVMGlobalConst}(\mathsf{sym},\ \tau ,\ \texttt{zeroinitializer},\ \mathsf{align})
\end{array}
```

```math
\begin{array}{l}
\operatorname{StaticType}(\mathsf{sym})\ =\ \operatorname{TypeArray}(\operatorname{TypePrim}(\texttt{"u8"}),\ \operatorname{Literal}(\operatorname{IntLiteral}(\mid \mathsf{bytes}\mid )))\quad \mathsf{if}\ \mathsf{sym}\ =\ \operatorname{Mangle}(\operatorname{LiteralData}(\mathsf{kind},\ \mathsf{bytes})) \\
\operatorname{StaticType}(\mathsf{sym})\ =\ T\ \Leftrightarrow \ \operatorname{StaticSymPath}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{sym}\ \land \ \operatorname{StaticType}(\mathsf{path},\ \mathsf{name})\ =\ T \\
\mathsf{StateRefJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{StateRef}(\mathsf{sym})\ \Downarrow \ \mathsf{slot}\}
\end{array}
```
SessionStateSlot(sym) denotes the addressable storage slot for `sym` in the active hosted session environment.

**(StateRef-Session)**

```math
\begin{array}{l}
\operatorname{HostedStateSym}(\operatorname{Project}(\Gamma ),\ \mathsf{sym}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{StateRef}(\mathsf{sym})\ \Downarrow \ \operatorname{SessionStateSlot}(\mathsf{sym})
\end{array}
```

**(StateRef-Global)**

```math
\begin{array}{l}
\lnot \ \operatorname{HostedStateSym}(\operatorname{Project}(\Gamma ),\ \mathsf{sym}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{StateRef}(\mathsf{sym})\ \Downarrow \ @\mathsf{sym}
\end{array}
```

```math
\begin{array}{l}
\operatorname{ProcModule}(\mathsf{sym})\ =\ m\ \Leftrightarrow \ \exists \ \mathsf{item},\ p.\ \mathsf{item}\ \in \ \{\mathsf{ProcedureDecl},\ \mathsf{MethodDecl},\ \mathsf{ClassMethodDecl},\ \mathsf{StateMethodDecl},\ \mathsf{TransitionDecl},\ \mathsf{DefaultImpl}\}\ \land \ \operatorname{ItemPath}(\mathsf{item})\ =\ p\ \land \ \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym}\ \land \ \operatorname{ModuleOfPath}(p)\ =\ m \\
\operatorname{SigOf}(\mathsf{callee})\ = \\
\ \langle \mathsf{params},\ \mathsf{ret}\rangle \quad \mathsf{if}\ \mathsf{callee}\ =\ \mathsf{sym}\ \land \ \Gamma \ \vdash \ \operatorname{Mangle}(d)\ \Downarrow \ \mathsf{sym}\ \land \ d\ \in \ \{\mathsf{ProcedureDecl},\ \mathsf{MethodDecl},\ \mathsf{DefaultImpl}\}\ \land \ \operatorname{Sig}(d)\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle  \\
\ \operatorname{RuntimeSig}(\mathsf{sym})\ \mathsf{if}\ \mathsf{callee}\ =\ \mathsf{sym}\ \land \ \operatorname{RuntimeSig}(\mathsf{sym})\ \mathsf{defined} \\
\ \langle \mathsf{params},\ \mathsf{ret}\rangle \quad \mathsf{if}\ \operatorname{ExprType}(\mathsf{callee})\ =\ \operatorname{TypeFunc}(\mathsf{params},\ \mathsf{ret}) \\
\ \bot \quad \mathsf{otherwise} \\
\operatorname{LoweredSigOf}(\mathsf{callee})\ =\ \langle \mathsf{params}',\ \mathsf{ret}\rangle \ \Leftrightarrow \ \langle \mathsf{params},\ \mathsf{ret}\rangle \ =\ \operatorname{SigOf}(\mathsf{callee})\ \land \ \mathsf{params}'\ =\ (\operatorname{NeedsPanicOut}(\mathsf{callee})\ \mathsf{Sigma}\ \mathsf{params}\ \mathbin{++} \ [\mathsf{PanicOutParam}]\ :\ \mathsf{params})
\end{array}
```

```math
\begin{array}{l}
\operatorname{ParamInitIR}(\mathsf{sig},\ \mathsf{params})\ =\ \mathbin{++} \_\{\langle \mathsf{mode},\ x,\ T\rangle \ \in \ \mathsf{params}\}\ \operatorname{ParamInit}(\mathsf{sig},\ \mathsf{params},\ x,\ \mathsf{mode},\ T) \\
\operatorname{ZeroValue}(T)\ =\ \texttt{zeroinitializer}\ \mathsf{if}\ \operatorname{sizeof}(T)\ =\ 0 \\
\operatorname{ParamInit}(\mathsf{sig},\ \mathsf{params},\ x,\ \mathsf{mode},\ T)\ = \\
\ \operatorname{Store}(\operatorname{BindSlot}(x),\ \operatorname{LLVMParam}(\mathsf{sig},\ \mathsf{params},\ x),\ T)\quad \mathsf{if}\ \operatorname{ABIParam}(\mathsf{mode},\ T)\ =\ \texttt{ByValue}\ \land \ \operatorname{sizeof}(T)\ >\ 0 \\
\ \operatorname{Store}(\operatorname{BindSlot}(x),\ \operatorname{ZeroValue}(T),\ T)\quad \mathsf{if}\ \operatorname{ABIParam}(\mathsf{mode},\ T)\ =\ \texttt{ByValue}\ \land \ \operatorname{sizeof}(T)\ =\ 0 \\
\ \varepsilon \quad \mathsf{if}\ \operatorname{ABIParam}(\mathsf{mode},\ T)\ =\ \texttt{ByRef} \\
\operatorname{ParamOrder}(\mathsf{params})\ =\ [x_{i}\ \mid \ \langle \mathsf{mode}_{i},\ x_{i},\ T_{i}\rangle \ \in \ \mathsf{params}\ \land \ (\operatorname{ABIParam}(\mathsf{mode}_{i},\ T_{i})\ =\ \texttt{ByRef}\ \lor \ \operatorname{sizeof}(T_{i})\ >\ 0)] \\
\operatorname{ParamIndex}(\mathsf{params},\ x)\ =\ i\ \Leftrightarrow \ \operatorname{ParamOrder}(\mathsf{params})[i]\ =\ x \\
\operatorname{LLVMArgs}(\mathsf{sig})\ =\ \mathsf{sig}.\mathsf{llvm}_{\mathsf{params}} \\
\operatorname{LLVMArg}(\mathsf{sig},\ i)\ =\ \operatorname{LLVMArgs}(\mathsf{sig})[i] \\
i'\ =\ (\mathsf{sig}.\mathsf{sretSigma}\ \mathsf{Sigma}\ \operatorname{ParamIndex}(\mathsf{params},\ x)\ +\ 1\ :\ \operatorname{ParamIndex}(\mathsf{params},\ x)) \\
\operatorname{LLVMParam}(\mathsf{sig},\ \mathsf{params},\ x)\ =\ \operatorname{LLVMArg}(\mathsf{sig},\ i')
\end{array}
```

**(LowerIRDecl-Proc-User)**

```math
\begin{array}{l}
\operatorname{LLVMCallSig}(\mathsf{params},\ R)\ \Downarrow \ \mathsf{sig}\quad \operatorname{ProcModule}(\mathsf{sym})\ =\ m\quad \mathsf{IR}_{p}\ =\ \operatorname{ParamInitIR}(\mathsf{sig},\ \mathsf{params})\quad \mathsf{IR}_{0}\ =\ (\operatorname{NeedsPanicOut}(\mathsf{sym})\ \mathsf{Sigma}\ \operatorname{SeqIR}(\mathsf{ClearPanic},\ \mathsf{IR})\ :\ \mathsf{IR})\quad \mathsf{IR}'\ =\ \operatorname{SeqIR}(\mathsf{IR}_{p},\ \operatorname{CheckPoison}(m),\ \mathsf{IR}_{0})\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{IR}')\ \Downarrow \ \mathsf{ll} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRDecl}(\operatorname{ProcIR}(\mathsf{sym},\ \mathsf{params},\ R,\ \mathsf{IR}))\ \Downarrow \ \operatorname{LLVMDefine}(\mathsf{sym},\ \mathsf{sig},\ \mathsf{ll})
\end{array}
```

**(LowerIRDecl-Proc-Gen)**

```math
\begin{array}{l}
\operatorname{LLVMCallSig}(\mathsf{params},\ R)\ \Downarrow \ \mathsf{sig}\quad \operatorname{ProcModule}(\mathsf{sym})\ \mathsf{undefined}\quad \mathsf{IR}_{p}\ =\ \operatorname{ParamInitIR}(\mathsf{sig},\ \mathsf{params})\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{SeqIR}(\mathsf{IR}_{p},\ (\operatorname{NeedsPanicOut}(\mathsf{sym})\ \mathsf{Sigma}\ \operatorname{SeqIR}(\mathsf{ClearPanic},\ \mathsf{IR})\ :\ \mathsf{IR})))\ \Downarrow \ \mathsf{ll} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRDecl}(\operatorname{ProcIR}(\mathsf{sym},\ \mathsf{params},\ R,\ \mathsf{IR}))\ \Downarrow \ \operatorname{LLVMDefine}(\mathsf{sym},\ \mathsf{sig},\ \mathsf{ll})
\end{array}
```

**(LowerIRDecl-GlobalConst)**

```math
\begin{array}{l}
T\ =\ \operatorname{StaticType}(\mathsf{sym})\quad \Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau \quad \operatorname{ConstBytes}(\tau ,\ \mathsf{bytes})\ =\ c \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRDecl}(\operatorname{GlobalConst}(\mathsf{sym},\ \mathsf{bytes}))\ \Downarrow \ \operatorname{LLVMGlobalConst}(\mathsf{sym},\ \tau ,\ c,\ \operatorname{alignof}(T))
\end{array}
```

**(LowerIRDecl-GlobalZero)**

```math
\begin{array}{l}
T\ =\ \operatorname{StaticType}(\mathsf{sym})\quad \Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau \quad \mathsf{size}\ =\ \operatorname{sizeof}(T) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRDecl}(\operatorname{GlobalZero}(\mathsf{sym},\ \mathsf{size}))\ \Downarrow \ \operatorname{LLVMGlobalZero}(\mathsf{sym},\ \tau ,\ \operatorname{alignof}(T))
\end{array}
```

```math
\mathsf{When}\ \texttt{HostedStateSym(Project(Gamma), sym)}\ \mathsf{holds},\ \mathsf{the}\ \texttt{GlobalConst(sym, bytes)}\ \mathsf{and}\ \texttt{GlobalZero(sym, size)}\ \mathsf{judgments}\ \mathsf{above}\ \mathsf{define}\ \mathsf{the}\ \mathsf{initializer}\ \mathsf{template}\ \mathsf{for}\ \mathsf{the}\ \mathsf{per}-\mathsf{session}\ \mathsf{slot}\ \mathsf{selected}\ \mathsf{by}\ \texttt{StateRef(sym)},\ \mathsf{not}\ \mathsf{one}\ \mathsf{shared}\ \mathsf{mutable}\ \mathsf{runtime}\ \mathsf{cell}.\ A\ \mathsf{conforming}\ \mathsf{backend}\ \mathsf{MAY}\ \mathsf{materialize}\ \mathsf{that}\ \mathsf{template}\ \mathsf{as}\ \mathsf{immutable}\ \mathsf{process}-\mathsf{global}\ \mathsf{data},\ \mathsf{but}\ \mathsf{every}\ \mathsf{runtime}\ \mathsf{load}/\mathsf{store}\ \mathsf{routed}\ \mathsf{through}\ \texttt{StateRef(sym)}\ \mathsf{MUST}\ \mathsf{observe}\ \mathsf{the}\ \mathsf{distinct}\ \mathsf{live}-\mathsf{session}\ \mathsf{cell}\ \mathsf{required}\ \mathsf{by}\ \S 24.4.1.
```

**(LowerIRDecl-VTable)**

```math
\begin{array}{l}
\operatorname{GlobalVTable}(\mathsf{sym},\ \mathsf{header},\ \mathsf{slots})\ =\ d \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRDecl}(d)\ \Downarrow \ \operatorname{LLVMGlobalVTable}(\mathsf{sym},\ \mathsf{header},\ \mathsf{slots})
\end{array}
```

**(Lower-AllocIR)**

```math
\begin{array}{l}
\operatorname{BuiltinModalSym}(\texttt{Region::alloc})\ \Downarrow \ \mathsf{sym}\quad r\ =\ \operatorname{InnermostActiveRegion}(\Gamma )\ \mathsf{if}\ r_{\mathsf{opt}}\ =\ \bot ,\ \mathsf{otherwise}\ r_{\mathsf{opt}}\quad \operatorname{TypeOf}(v)\ =\ T\quad \operatorname{sizeof}(T)\ =\ n\quad \operatorname{alignof}(T)\ =\ a\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{CallIR}(\mathsf{sym},\ [r,\ \operatorname{IntVal}(\texttt{usize},\ n),\ \operatorname{IntVal}(\texttt{usize},\ a)]))\ \Downarrow \ \langle I_{a},\ p\rangle \quad \operatorname{Store}(p,\ v,\ T)\ =\ I_{s} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{AllocIR}(r_{\mathsf{opt}},\ v))\ \Downarrow \ \langle I_{a}\ \mathbin{++} \ I_{s},\ p\rangle 
\end{array}
```

**(Lower-BindVarIR)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{BindSlot}(x)\ \Downarrow \ \mathsf{slot}\quad \operatorname{TypeOf}(x)\ =\ T_{x} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{BindVarIR}(x,\ v))\ \Downarrow \ \langle [\operatorname{Store}(\mathsf{slot},\ v,\ T_{x})],\ \bot \rangle 
\end{array}
```

**(Lower-ReadVarIR)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{BindSlot}(x)\ \Downarrow \ \mathsf{slot}\quad \operatorname{TypeOf}(x)\ =\ T_{x}\quad \Gamma \ \vdash \ \operatorname{BindValid}(x)\ \Downarrow \ \texttt{Valid} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{ReadVarIR}(x))\ \Downarrow \ \langle [\operatorname{Load}(\mathsf{slot},\ T_{x})],\ v\rangle 
\end{array}
```

**(Lower-ReadVarIR-Err)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{BindValid}(x)\ \Downarrow \ s\quad s\ \ne \ \texttt{Valid} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{ReadVarIR}(x))\ \Uparrow 
\end{array}
```

```math
\operatorname{ProcSymbol}(\mathsf{sym})\ \Leftrightarrow \ \exists \ \mathsf{item}.\ \mathsf{item}\ \in \ \{\mathsf{ProcedureDecl},\ \mathsf{MethodDecl},\ \mathsf{ClassMethodDecl},\ \mathsf{StateMethodDecl},\ \mathsf{TransitionDecl},\ \mathsf{DefaultImpl}\}\ \land \ \Gamma \ \vdash \ \operatorname{Mangle}(\mathsf{item})\ \Downarrow \ \mathsf{sym}
```

**(Lower-ReadPathIR-Static-User)**

```math
\begin{array}{l}
\operatorname{StaticSymPath}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{sym}\quad \operatorname{ProcModule}(\mathsf{sym})\ =\ m\quad T\ =\ \operatorname{StaticType}(\mathsf{sym})\quad \Gamma \ \vdash \ \operatorname{StateRef}(\mathsf{sym})\ \Downarrow \ \mathsf{slot}\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{CheckPoison}(m))\ \Downarrow \ \langle I_{p},\ \bot \rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{ReadPathIR}(\mathsf{path},\ \mathsf{name}))\ \Downarrow \ \langle I_{p}\ \mathbin{++} \ [\operatorname{Load}(\mathsf{slot},\ T)],\ v\rangle 
\end{array}
```

**(Lower-ReadPathIR-Static-Gen)**

```math
\begin{array}{l}
\operatorname{StaticSymPath}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{sym}\quad \operatorname{ProcModule}(\mathsf{sym})\ \mathsf{undefined}\quad T\ =\ \operatorname{StaticType}(\mathsf{sym})\quad \Gamma \ \vdash \ \operatorname{StateRef}(\mathsf{sym})\ \Downarrow \ \mathsf{slot} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{ReadPathIR}(\mathsf{path},\ \mathsf{name}))\ \Downarrow \ \langle [\operatorname{Load}(\mathsf{slot},\ T)],\ v\rangle 
\end{array}
```

**(Lower-ReadPathIR-Proc-User)**

```math
\begin{array}{l}
\mathsf{sym}\ =\ \operatorname{PathSym}(\mathsf{path},\ \mathsf{name})\quad \operatorname{ProcSymbol}(\mathsf{sym})\quad \operatorname{ProcModule}(\mathsf{sym})\ =\ m\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{CheckPoison}(m))\ \Downarrow \ \langle I_{p},\ \bot \rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{ReadPathIR}(\mathsf{path},\ \mathsf{name}))\ \Downarrow \ \langle I_{p},\ \mathsf{sym}\rangle 
\end{array}
```

**(Lower-ReadPathIR-Proc-Gen)**

```math
\begin{array}{l}
\mathsf{sym}\ =\ \operatorname{PathSym}(\mathsf{path},\ \mathsf{name})\quad \operatorname{ProcSymbol}(\mathsf{sym})\quad \operatorname{ProcModule}(\mathsf{sym})\ \mathsf{undefined} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{ReadPathIR}(\mathsf{path},\ \mathsf{name}))\ \Downarrow \ \langle \varepsilon ,\ \mathsf{sym}\rangle 
\end{array}
```

**(Lower-ReadPathIR-Runtime)**

```math
\begin{array}{l}
\mathsf{sym}\ =\ \operatorname{PathSym}(\mathsf{path},\ \mathsf{name})\quad \operatorname{RuntimeSig}(\mathsf{sym})\ \mathsf{defined} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{ReadPathIR}(\mathsf{path},\ \mathsf{name}))\ \Downarrow \ \langle \varepsilon ,\ \mathsf{sym}\rangle 
\end{array}
```

**(Lower-ReadPathIR-Record)**

```math
\begin{array}{l}
p\ =\ \mathsf{path}\ \mathbin{++} \ [\mathsf{name}]\quad \operatorname{RecordDecl}(p)\ =\ R\quad \operatorname{ModuleOfPath}(p)\ =\ m\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{CheckPoison}(m))\ \Downarrow \ \langle I_{p},\ \bot \rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{ReadPathIR}(\mathsf{path},\ \mathsf{name}))\ \Downarrow \ \langle I_{p},\ \operatorname{RecordCtor}(p)\rangle 
\end{array}
```

**(Lower-StoreVarIR)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{BindSlot}(x)\ \Downarrow \ \mathsf{slot}\quad \operatorname{TypeOf}(x)\ =\ T_{x}\quad \Gamma \ \vdash \ \operatorname{DropOnAssign}(x,\ \mathsf{slot})\ \Downarrow \ \mathsf{IR}_{d} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{StoreVarIR}(x,\ v))\ \Downarrow \ \langle \mathsf{IR}_{d}\ \mathbin{++} \ [\operatorname{Store}(\mathsf{slot},\ v,\ T_{x})],\ \bot \rangle 
\end{array}
```

**(Lower-StoreVarNoDropIR)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{BindSlot}(x)\ \Downarrow \ \mathsf{slot}\quad \operatorname{TypeOf}(x)\ =\ T_{x} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{StoreVarNoDropIR}(x,\ v))\ \Downarrow \ \langle [\operatorname{Store}(\mathsf{slot},\ v,\ T_{x})],\ \bot \rangle 
\end{array}
```

**(Lower-MoveStateIR)**

```math
\begin{array}{l}
x\ =\ \operatorname{PlaceRoot}(p)\quad \Gamma \ \vdash \ \operatorname{UpdateValid}(x,\ \operatorname{MoveStateIR}(p))\ \Downarrow \ v' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{MoveStateIR}(p))\ \Downarrow \ \langle \varepsilon ,\ \bot \rangle 
\end{array}
```

**(Lower-StoreGlobal)**

```math
\begin{array}{l}
T\ =\ \operatorname{StaticType}(\mathsf{sym})\quad \Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau \quad \Gamma \ \vdash \ \operatorname{StateRef}(\mathsf{sym})\ \Downarrow \ \mathsf{slot} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{StoreGlobal}(\mathsf{sym},\ v))\ \Downarrow \ \langle [\operatorname{Store}(\mathsf{slot},\ v,\ T)],\ \bot \rangle 
\end{array}
```

**(Lower-ReadPlaceIR)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerReadPlace}(p)\ \Downarrow \ \langle \mathsf{IR}_{p},\ v\rangle \quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{IR}_{p})\ \Downarrow \ \mathsf{ll} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{ReadPlaceIR}(p))\ \Downarrow \ \mathsf{ll}
\end{array}
```

**(Lower-WritePlaceIR)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerWritePlace}(p,\ v)\ \Downarrow \ \mathsf{IR}_{w}\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{IR}_{w})\ \Downarrow \ \mathsf{ll} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{WritePlaceIR}(p,\ v))\ \Downarrow \ \mathsf{ll}
\end{array}
```

```math
\operatorname{PtrType}(v)\ =\ T\ \Leftrightarrow \ (\exists \ e,\ \mathsf{IR}.\ \Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle \ \land \ T\ =\ \operatorname{ExprType}(e))\ \lor \ (\exists \ p,\ \mathsf{IR}.\ \Gamma \ \vdash \ \operatorname{LowerReadPlace}(p)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle \ \land \ T\ =\ \operatorname{ExprType}(p))
```

**(Lower-ReadPtrIR)**

```math
\begin{array}{l}
\operatorname{PtrType}(v_{\mathsf{ptr}})\ =\ \operatorname{TypePtr}(T,\ \texttt{Valid}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{ReadPtrIR}(v_{\mathsf{ptr}}))\ \Downarrow \ \langle [\operatorname{Load}(\operatorname{PtrAddr}(v_{\mathsf{ptr}}),\ T)],\ v\rangle 
\end{array}
```

**(Lower-ReadPtrIR-Raw)**

```math
\begin{array}{l}
\operatorname{PtrType}(v_{\mathsf{ptr}})\ =\ \operatorname{TypeRawPtr}(q,\ T) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{ReadPtrIR}(v_{\mathsf{ptr}}))\ \Downarrow \ \langle [\operatorname{Load}(\operatorname{PtrAddr}(v_{\mathsf{ptr}}),\ T)],\ v\rangle 
\end{array}
```

**(Lower-ReadPtrIR-Null)**

```math
\begin{array}{l}
\operatorname{PtrType}(v_{\mathsf{ptr}})\ =\ \operatorname{TypePtr}(T,\ \texttt{Null})\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{LowerPanic}(\mathsf{NullDeref}))\ \Downarrow \ \mathsf{ll} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{ReadPtrIR}(v_{\mathsf{ptr}}))\ \Downarrow \ \mathsf{ll}
\end{array}
```

**(Lower-ReadPtrIR-Expired)**

```math
\begin{array}{l}
\operatorname{PtrType}(v_{\mathsf{ptr}})\ =\ \operatorname{TypePtr}(T,\ \texttt{Expired})\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{LowerPanic}(\mathsf{ExpiredDeref}))\ \Downarrow \ \mathsf{ll} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{ReadPtrIR}(v_{\mathsf{ptr}}))\ \Downarrow \ \mathsf{ll}
\end{array}
```

**(Lower-WritePtrIR)**

```math
\begin{array}{l}
\operatorname{PtrType}(v_{\mathsf{ptr}})\ =\ \operatorname{TypePtr}(T,\ \texttt{Valid}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{WritePtrIR}(v_{\mathsf{ptr}},\ v))\ \Downarrow \ \langle [\operatorname{Store}(\operatorname{PtrAddr}(v_{\mathsf{ptr}}),\ v,\ T)],\ \bot \rangle 
\end{array}
```

**(Lower-WritePtrIR-Null)**

```math
\begin{array}{l}
\operatorname{PtrType}(v_{\mathsf{ptr}})\ =\ \operatorname{TypePtr}(T,\ \texttt{Null})\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{LowerPanic}(\mathsf{NullDeref}))\ \Downarrow \ \mathsf{ll} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{WritePtrIR}(v_{\mathsf{ptr}},\ v))\ \Downarrow \ \mathsf{ll}
\end{array}
```

**(Lower-WritePtrIR-Expired)**

```math
\begin{array}{l}
\operatorname{PtrType}(v_{\mathsf{ptr}})\ =\ \operatorname{TypePtr}(T,\ \texttt{Expired})\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{LowerPanic}(\mathsf{ExpiredDeref}))\ \Downarrow \ \mathsf{ll} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{WritePtrIR}(v_{\mathsf{ptr}},\ v))\ \Downarrow \ \mathsf{ll}
\end{array}
```

**(Lower-WritePtrIR-Raw)**

```math
\begin{array}{l}
\operatorname{PtrType}(v_{\mathsf{ptr}})\ =\ \operatorname{TypeRawPtr}(\texttt{mut},\ T) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{WritePtrIR}(v_{\mathsf{ptr}},\ v))\ \Downarrow \ \langle [\operatorname{Store}(\operatorname{PtrAddr}(v_{\mathsf{ptr}}),\ v,\ T)],\ \bot \rangle 
\end{array}
```

**(Lower-WritePtrIR-Raw-Err)**

```math
\begin{array}{l}
\operatorname{PtrType}(v_{\mathsf{ptr}})\ =\ \operatorname{TypeRawPtr}(\texttt{imm},\ T) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{WritePtrIR}(v_{\mathsf{ptr}},\ v))\ \Uparrow 
\end{array}
```

**(Lower-AddrOfIR)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerAddrOf}(p)\ \Downarrow \ \langle \mathsf{IR}_{p},\ \mathsf{addr}\rangle \quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{IR}_{p})\ \Downarrow \ \mathsf{ll} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{AddrOfIR}(p))\ \Downarrow \ \mathsf{ll}
\end{array}
```

```math
\begin{array}{l}
\operatorname{CallPoison}(f)\ = \\
\ \operatorname{CheckPoison}(m)\quad \mathsf{if}\ \operatorname{ProcModule}(f)\ =\ m \\
\ \varepsilon \quad \mathsf{if}\ \operatorname{ProcModule}(f)\ \mathsf{undefined}
\end{array}
```

```math
\operatorname{SRetAlloc}(R)\ \Downarrow \ \langle [\texttt{alloca}\ \operatorname{LLVMTy}(R)],\ p\rangle 
```

```math
\begin{array}{l}
\operatorname{CallArgs}(\mathsf{sig},\ \mathsf{params},\ \mathsf{args},\ R)\ \Downarrow \ \langle I_{a},\ \mathsf{vec}_{a},\ p_{\mathsf{ret}}\rangle \ \Leftrightarrow  \\
\ I_{a}\ =\ \varepsilon \ \land \ \mathsf{vec}_{a}\ =\ \mathsf{args}\ \land \ p_{\mathsf{ret}}\ =\ \bot \quad \mathsf{if}\ \mathsf{sig}.\mathsf{sretSigma}\ =\ \mathsf{false} \\
\ \exists \ p.\ \operatorname{SRetAlloc}(R)\ \Downarrow \ \langle I_{s},\ p\rangle \ \land \ I_{a}\ =\ I_{s}\ \land \ \mathsf{vec}_{a}\ =\ [p]\ \mathbin{++} \ \mathsf{args}\ \land \ p_{\mathsf{ret}}\ =\ p\quad \mathsf{if}\ \mathsf{sig}.\mathsf{sretSigma}\ =\ \mathsf{true}
\end{array}
```

```math
\begin{array}{l}
\operatorname{CallInstr}(\mathsf{sig},\ f,\ \mathsf{vec}_{a})\ \Downarrow \ \langle [\texttt{call}\ \mathsf{sig}\ \operatorname{f}(\mathsf{vec}_{a})],\ v_{c}\rangle \ \Leftrightarrow  \\
\ v_{c}\ =\ (\mathsf{sig}.\mathsf{llvm}_{\mathsf{ret}}\ =\ \texttt{void}\ \mathsf{Sigma}\ \bot \ :\ \mathsf{call}_{\mathsf{result}})
\end{array}
```

```math
\begin{array}{l}
\operatorname{CallResult}(\mathsf{sig},\ R,\ p_{\mathsf{ret}},\ v_{c})\ \Downarrow \ \langle I_{r},\ v\rangle \ \Leftrightarrow  \\
\ I_{r}\ =\ \varepsilon \ \land \ v\ =\ v_{c}\quad \mathsf{if}\ \mathsf{sig}.\mathsf{sretSigma}\ =\ \mathsf{false} \\
\ \operatorname{LoadVal}(p_{\mathsf{ret}},\ R)\ \Downarrow \ \langle I_{r},\ v\rangle \quad \mathsf{if}\ \mathsf{sig}.\mathsf{sretSigma}\ =\ \mathsf{true}
\end{array}
```

**(Lower-CallIR-Func)**

```math
\begin{array}{l}
\operatorname{CallTarget}(\mathsf{callee})\ =\ f\quad f\ \ne \ \operatorname{RecordCtor}(\_)\quad \operatorname{LoweredSigOf}(f)\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \quad \operatorname{LLVMCallSig}(\mathsf{params},\ \mathsf{ret})\ \Downarrow \ \mathsf{sig}\quad \operatorname{CallPoison}(f)\ =\ \mathsf{IR}_{p}\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{IR}_{p})\ \Downarrow \ \langle I_{p},\ \bot \rangle \quad \operatorname{CallArgs}(\mathsf{sig},\ \mathsf{params},\ \mathsf{args},\ \mathsf{ret})\ \Downarrow \ \langle I_{a},\ \mathsf{vec}_{a},\ p_{\mathsf{ret}}\rangle \quad \operatorname{CallInstr}(\mathsf{sig},\ f,\ \mathsf{vec}_{a})\ \Downarrow \ \langle I_{c},\ v_{c}\rangle \quad \operatorname{CallResult}(\mathsf{sig},\ \mathsf{ret},\ p_{\mathsf{ret}},\ v_{c})\ \Downarrow \ \langle I_{r},\ v_{\mathsf{call}}\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{CallIR}(\mathsf{callee},\ \mathsf{args}))\ \Downarrow \ \langle I_{p}\ \mathbin{++} \ I_{a}\ \mathbin{++} \ I_{c}\ \mathbin{++} \ I_{r},\ v_{\mathsf{call}}\rangle 
\end{array}
```

```math
\begin{array}{l}
\operatorname{DynType}(v)\ =\ \operatorname{TypeDynamic}(\mathsf{Cl})\ \Leftrightarrow \ (\exists \ e,\ \mathsf{IR}.\ \Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle \ \land \ \operatorname{ExprType}(e)\ =\ \operatorname{TypeDynamic}(\mathsf{Cl}))\ \lor \ (\exists \ p,\ \mathsf{IR}.\ \Gamma \ \vdash \ \operatorname{LowerReadPlace}(p)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle \ \land \ \operatorname{ExprType}(p)\ =\ \operatorname{TypeDynamic}(\mathsf{Cl})) \\
\operatorname{DynData}(v)\ =\ \operatorname{FieldValue}(v,\ \texttt{data})\ \mathsf{and}\ \operatorname{DynVTable}(v)\ =\ \operatorname{FieldValue}(v,\ \texttt{vtable}) \\
\operatorname{VTableSlotIndex}(i)\ =\ i\ +\ 3 \\
\operatorname{GEP}(\mathsf{ptr},\ [i_{0},\ \ldots ,\ i_{k}])\ =\ v_{\mathsf{gep}} \\
\operatorname{VTableSlotAddr}(\mathsf{vt},\ i)\ =\ \operatorname{GEP}(\mathsf{vt},\ [0,\ \operatorname{VTableSlotIndex}(i)]) \\
\operatorname{VTableSlot}(\mathsf{vt},\ i)\ =\ \operatorname{Load}(\operatorname{VTableSlotAddr}(\mathsf{vt},\ i),\ \operatorname{TypeRawPtr}(\texttt{imm},\ \operatorname{TypePrim}(\texttt{"()"})))
\end{array}
```

**(Lower-CallVTable)**

```math
\begin{array}{l}
\operatorname{DynType}(\mathsf{base})\ =\ \operatorname{TypeDynamic}(\mathsf{Cl})\quad v_{d}\ =\ \operatorname{DynData}(\mathsf{base})\quad v_{t}\ =\ \operatorname{DynVTable}(\mathsf{base})\quad v_{s}\ =\ \operatorname{VTableSlot}(v_{t},\ i)\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{CallIR}(v_{s},\ [v_{d}]\ \mathbin{++} \ \mathsf{args}))\ \Downarrow \ \mathsf{ll} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{CallVTable}(\mathsf{base},\ i,\ \mathsf{args}))\ \Downarrow \ \mathsf{ll}
\end{array}
```

**(LowerIRInstr-ClearPanic)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \mathsf{ClearPanic}\ \Downarrow \ \mathsf{IR}\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{IR})\ \Downarrow \ \mathsf{ll} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{ClearPanic})\ \Downarrow \ \mathsf{ll}
\end{array}
```

**(LowerIRInstr-PanicCheck)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \mathsf{PanicCheck}\ \Downarrow \ \mathsf{IR}\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{IR})\ \Downarrow \ \mathsf{ll} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{PanicCheck})\ \Downarrow \ \mathsf{ll}
\end{array}
```

**(LowerIRInstr-CheckPoison)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CheckPoison}(m)\ \Downarrow \ \mathsf{IR}\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{IR})\ \Downarrow \ \mathsf{ll} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{CheckPoison}(m))\ \Downarrow \ \mathsf{ll}
\end{array}
```

**(LowerIRInstr-LowerPanic)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerPanic}(r)\ \Downarrow \ \mathsf{IR}\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{IR})\ \Downarrow \ \mathsf{ll} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{LowerPanic}(r))\ \Downarrow \ \mathsf{ll}
\end{array}
```

```math
\begin{array}{l}
\operatorname{IfPhi}(v_{t},\ v_{f},\ l_{t},\ l_{f})\ \Downarrow \ \langle I_{\mathsf{phi}},\ v_{\mathsf{phi}}\rangle \ \Leftrightarrow  \\
\ I_{\mathsf{phi}}\ =\ \varepsilon \ \land \ v_{\mathsf{phi}}\ =\ \bot \quad \mathsf{if}\ v_{t}\ =\ \bot \ \lor \ v_{f}\ =\ \bot  \\
\ \exists \ T,\ \tau ,\ \mathsf{inc}.\ \operatorname{ValueType}(v_{t})\ =\ T\ \land \ \operatorname{ValueType}(v_{f})\ =\ T\ \land \ \Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau \ \land \ \mathsf{inc}\ =\ [\langle v_{t},\ l_{t}\rangle ,\ \langle v_{f},\ l_{f}\rangle ]\ \land \ I_{\mathsf{phi}}\ =\ [\operatorname{Phi}(\tau ,\ \mathsf{inc},\ v_{\mathsf{phi}})]\quad \mathsf{if}\ v_{t}\ \ne \ \bot \ \land \ v_{f}\ \ne \ \bot 
\end{array}
```

```math
\operatorname{IfLowerForm}(I,\ v_{c},\ v_{t},\ v_{f},\ v)\ \Leftrightarrow \ \operatorname{HasBrCond}(I,\ v_{c})\ \land \ ((v_{t}\ =\ \bot \ \lor \ v_{f}\ =\ \bot )\ \Rightarrow \ v\ =\ \bot )\ \land \ ((v_{t}\ \ne \ \bot \ \land \ v_{f}\ \ne \ \bot )\ \Rightarrow \ \operatorname{HasPhi}(I,\ v))
```

**(Lower-IfIR)**

```math
\begin{array}{l}
\operatorname{IfLabels}(\Gamma )\ =\ \langle l_{t},\ l_{f},\ l_{m}\rangle \quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{IR}_{t})\ \Downarrow \ \langle I_{t},\ v_{t}'\rangle \quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{IR}_{f})\ \Downarrow \ \langle I_{f},\ v_{f}'\rangle \quad v_{t}'\ =\ v_{t}\quad v_{f}'\ =\ v_{f}\quad \operatorname{IfPhi}(v_{t},\ v_{f},\ l_{t},\ l_{f})\ \Downarrow \ \langle I_{\mathsf{phi}},\ v\rangle \quad I\ =\ [\operatorname{BrCond}(v_{c},\ l_{t},\ l_{f}),\ \operatorname{Label}(l_{t})]\ \mathbin{++} \ I_{t}\ \mathbin{++} \ [\operatorname{Br}(l_{m}),\ \operatorname{Label}(l_{f})]\ \mathbin{++} \ I_{f}\ \mathbin{++} \ [\operatorname{Br}(l_{m}),\ \operatorname{Label}(l_{m})]\ \mathbin{++} \ I_{\mathsf{phi}}\quad \operatorname{IfLowerForm}(I,\ v_{c},\ v_{t},\ v_{f},\ v) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{IfIR}(v_{c},\ \mathsf{IR}_{t},\ v_{t},\ \mathsf{IR}_{f},\ v_{f}))\ \Downarrow \ \langle I,\ v\rangle 
\end{array}
```

```math
\begin{array}{l}
\operatorname{BlockScope}(\mathsf{IR}_{s},\ \mathsf{IR}_{t})\ =\ \mathsf{scope} \\
\operatorname{BlockScope}(\mathsf{IR}_{s},\ \mathsf{IR}_{t})\ =\ \mathsf{scope}\ \Leftrightarrow \ (\exists \ \sigma ,\ \sigma_{1} ,\ \sigma_{2} ,\ \mathsf{out},\ \mathsf{scope}_{0}.\ \operatorname{BlockEnter}(\sigma ,\ [])\ \Downarrow \ (\sigma_{1} ,\ \mathsf{scope}_{0})\ \land \ \operatorname{ExecBlockBodyIRSigma}(\mathsf{IR}_{s},\ \mathsf{IR}_{t},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ))\ \land \ (\forall \ \sigma ,\ \sigma_{1} ,\ \sigma_{2} ,\ \mathsf{out},\ \mathsf{scope}_{0}.\ \operatorname{BlockEnter}(\sigma ,\ [])\ \Downarrow \ (\sigma_{1} ,\ \mathsf{scope}_{0})\ \land \ \operatorname{ExecBlockBodyIRSigma}(\mathsf{IR}_{s},\ \mathsf{IR}_{t},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )\ \Rightarrow \ \operatorname{CurrentScope}(\sigma_{2} )\ =\ \mathsf{scope}) \\
\operatorname{EmitCleanupSpec}(\mathsf{cs},\ \mathsf{IR})\ \Leftrightarrow \ \forall \ \sigma ,\ \Gamma \ \vdash \ \operatorname{Cleanup}(\mathsf{cs},\ \sigma )\ \Downarrow \ (c,\ \sigma ')\ \Rightarrow \ (\operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\ \land \ ((c\ =\ \mathsf{panic})\ \Rightarrow \ \mathsf{out}\ =\ \operatorname{Ctrl}(\mathsf{Panic}))\ \land \ ((c\ =\ \mathsf{ok})\ \Rightarrow \ \mathsf{out}\ =\ \operatorname{Val}(()))) \\
\Gamma \ \vdash \ \operatorname{EmitCleanup}(\mathsf{cs})\ \Downarrow \ \mathsf{IR}\ \Leftrightarrow \ \operatorname{EmitCleanupSpec}(\mathsf{cs},\ \mathsf{IR})
\end{array}
```

**(Lower-BlockIR)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{IR}_{s})\ \Downarrow \ \langle I_{s},\ \bot \rangle \quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{IR}_{t})\ \Downarrow \ \langle I_{t},\ v_{t}'\rangle \quad v_{t}'\ =\ v_{t}\quad \operatorname{BlockScope}(\mathsf{IR}_{s},\ \mathsf{IR}_{t})\ =\ \mathsf{scope}\quad \Gamma \ \vdash \ \operatorname{CleanupPlan}(\mathsf{scope})\ \Downarrow \ \mathsf{cs}\quad \Gamma \ \vdash \ \operatorname{EmitCleanup}(\mathsf{cs})\ \Downarrow \ \mathsf{IR}_{c}\quad \Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{IR}_{c})\ \Downarrow \ \langle I_{c},\ \bot \rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{BlockIR}(\mathsf{IR}_{s},\ \mathsf{IR}_{t},\ v_{t}))\ \Downarrow \ \langle I_{s}\ \mathbin{++} \ I_{t}\ \mathbin{++} \ I_{c},\ v_{t}\rangle 
\end{array}
```

LoopLowerForm(I, loop, v) predicate
LoopIRForm(loop) predicate
IfCaseLowerForm(I, if_case, v) predicate
IfCaseIRForm(if_case) predicate
RegionLowerForm(I, region, v) predicate
RegionIRForm(region) predicate
FrameLowerForm(I, frame, v) predicate
FrameIRForm(frame) predicate

```math
\begin{array}{l}
\operatorname{LoopLowerForm}(I,\ \mathsf{loop},\ v)\ \Leftrightarrow \ \langle I,\ v\rangle \ \in \ \mathsf{LLResult} \\
\operatorname{IfCaseLowerForm}(I,\ \mathsf{if}_{\mathsf{case}},\ v)\ \Leftrightarrow \ \langle I,\ v\rangle \ \in \ \mathsf{LLResult} \\
\operatorname{RegionLowerForm}(I,\ \mathsf{region},\ v)\ \Leftrightarrow \ \langle I,\ v\rangle \ \in \ \mathsf{LLResult} \\
\operatorname{FrameLowerForm}(I,\ \mathsf{frame},\ v)\ \Leftrightarrow \ \langle I,\ v\rangle \ \in \ \mathsf{LLResult} \\
\operatorname{LoopIRForm}(\mathsf{loop})\ \Leftrightarrow \ (\exists \ \mathsf{IR}_{b},\ v_{b}.\ \mathsf{loop}\ =\ \operatorname{LoopIR}(\mathsf{LoopInfinite},\ \mathsf{IR}_{b},\ v_{b}))\ \lor \ (\exists \ \mathsf{IR}_{c},\ v_{c},\ \mathsf{IR}_{b},\ v_{b}.\ \mathsf{loop}\ =\ \operatorname{LoopIR}(\mathsf{LoopConditional},\ \mathsf{IR}_{c},\ v_{c},\ \mathsf{IR}_{b},\ v_{b}))\ \lor \ (\exists \ \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{IR}_{i},\ v_{\mathsf{iter}},\ \mathsf{IR}_{b},\ v_{b}.\ \mathsf{loop}\ =\ \operatorname{LoopIR}(\mathsf{LoopIter},\ \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{IR}_{i},\ v_{\mathsf{iter}},\ \mathsf{IR}_{b},\ v_{b})) \\
\operatorname{IfCaseIRForm}(\mathsf{if}_{\mathsf{case}})\ \Leftrightarrow \ \exists \ v_{s},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}}.\ \mathsf{if}_{\mathsf{case}}\ =\ \operatorname{IfCaseIR}(v_{s},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}}) \\
\operatorname{RegionIRForm}(\mathsf{region})\ \Leftrightarrow \ \exists \ v_{o},\ \mathsf{alias}_{\mathsf{opt}},\ \mathsf{IR}_{b},\ v_{b}.\ \mathsf{region}\ =\ \operatorname{RegionIR}(v_{o},\ \mathsf{alias}_{\mathsf{opt}},\ \mathsf{IR}_{b},\ v_{b}) \\
\operatorname{FrameIRForm}(\mathsf{frame})\ \Leftrightarrow \ \exists \ v_{r},\ \mathsf{IR}_{b},\ v_{b}.\ \mathsf{frame}\ =\ \operatorname{FrameIR}(v_{r},\ \mathsf{IR}_{b},\ v_{b})
\end{array}
```

**(Lower-LoopIR)**
LoopIRForm(loop)    LoopLowerForm(I, loop, v)

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{loop})\ \Downarrow \ \langle I,\ v\rangle 
\end{array}
```

**(Lower-IfCaseIR)**
IfCaseIRForm(if_case)    IfCaseLowerForm(I, if_case, v)

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{if}_{\mathsf{case}})\ \Downarrow \ \langle I,\ v\rangle 
\end{array}
```

**(Lower-RegionIR)**
RegionIRForm(region)    RegionLowerForm(I, region, v)

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{region})\ \Downarrow \ \langle I,\ v\rangle 
\end{array}
```

**(Lower-FrameIR)**
FrameIRForm(frame)    FrameLowerForm(I, frame, v)

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{frame})\ \Downarrow \ \langle I,\ v\rangle 
\end{array}
```

```math
\begin{array}{l}
\operatorname{BranchLowerForm}(I,\ \mathsf{target})\ \Leftrightarrow \ \operatorname{Br}(\mathsf{target})\ \in \ I \\
\operatorname{BranchLowerForm}(I,\ v_{c},\ t,\ f)\ \Leftrightarrow \ \operatorname{BrCond}(v_{c},\ t,\ f)\ \in \ I
\end{array}
```

**(Lower-BranchIR)**
BranchLowerForm(I, target)

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{BranchIR}(\mathsf{target}))\ \Downarrow \ \langle I,\ \bot \rangle 
\end{array}
```
BranchLowerForm(I, v_c, t, f)

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{BranchIR}(v_{c},\ t,\ f))\ \Downarrow \ \langle I,\ \bot \rangle 
\end{array}
```

```math
\operatorname{PhiLowerForm}(I,\ T,\ \mathsf{inc},\ v)\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau \ \land \ I\ =\ [\operatorname{Phi}(\tau ,\ \mathsf{inc},\ v)]
```

**(Lower-PhiIR)**
PhiLowerForm(I, T, inc, v)

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\operatorname{PhiIR}(T,\ \mathsf{inc},\ v))\ \Downarrow \ \langle I,\ v\rangle 
\end{array}
```

**(LowerIRDecl-Err)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerIRDecl}(d)\ \Uparrow  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRDecl}(d)\ \Uparrow 
\end{array}
```

**(LowerIRInstr-Err)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{op})\ \Uparrow  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LowerIRInstr}(\mathsf{op})\ \Uparrow 
\end{array}
```

#### 24.7.9 Binding Storage and Validity

```math
\begin{array}{l}
\mathsf{BindStorageJudg}\ =\ \{\operatorname{BindSlot}(x)\ \Downarrow \ \mathsf{slot},\ \operatorname{BindValid}(x)\ \Downarrow \ v,\ \operatorname{UpdateValid}(x,\ \mathsf{op})\ \Downarrow \ v',\ \operatorname{DropOnAssign}(x,\ \mathsf{slot})\ \Downarrow \ \mathsf{IR}\} \\
\operatorname{TypeOf}(x)\ =\ T\ \Leftrightarrow \ \Gamma ;\ R;\ L\ \vdash \ \operatorname{Identifier}(x)\ :\ T \\
\operatorname{BindInfo}(x)\ =\ \mathsf{info}\ \Leftrightarrow \ \operatorname{BindState}(\Gamma )\ =\ 𝔅\ \land \ \operatorname{Lookup_B}(𝔅,\ x)\ =\ \mathsf{info}
\end{array}
```

```math
\begin{array}{l}
\operatorname{ProcParams}(\Gamma )\ =\ \mathsf{params}\ \Leftrightarrow \ \Gamma \ \mathsf{is}\ \mathsf{lowering}\ \operatorname{ProcIR}(\_,\ \mathsf{params},\ \_,\ \_) \\
\operatorname{ProcRet}(\Gamma )\ =\ R\ \Leftrightarrow \ \Gamma \ \mathsf{is}\ \mathsf{lowering}\ \operatorname{ProcIR}(\_,\ \_,\ R,\ \_) \\
\operatorname{ProcSig}(\Gamma )\ =\ \mathsf{sig}\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{LLVMCallSig}(\operatorname{ProcParams}(\Gamma ),\ \operatorname{ProcRet}(\Gamma ))\ \Downarrow \ \mathsf{sig} \\
\operatorname{ParamEntry}(\mathsf{params},\ x)\ =\ \langle \mathsf{mode},\ T\rangle \ \Leftrightarrow \ \langle \mathsf{mode},\ x,\ T\rangle \ \in \ \mathsf{params} \\
\operatorname{AllocaSlot}(T)\ =\ \operatorname{LLVMAlloca}(\operatorname{LLVMTy}(T)) \\
\operatorname{RegionSlot}(r,\ T)\ =\ \operatorname{CallIR}(\operatorname{BuiltinModalSym}(\texttt{Region::alloc}),\ [r,\ \operatorname{IntVal}(\texttt{usize},\ \operatorname{sizeof}(T)),\ \operatorname{IntVal}(\texttt{usize},\ \operatorname{alignof}(T))]) \\
\operatorname{BindState}(\Gamma )\ =\ \Gamma .\mathsf{bind}_{\mathsf{state}}
\end{array}
```

```math
\begin{array}{l}
\mathsf{ResolveEntry}\_\pi ([],\ \mathsf{tag})\ =\ \bot  \\
\mathsf{ResolveEntry}\_\pi (\langle \mathsf{tag},\ \mathsf{target}\rangle \ \mathbin{::} \ \mathsf{es},\ t)\ = \\
\ \langle \mathsf{tag},\ \mathsf{target}\rangle \quad \mathsf{if}\ t\ =\ \mathsf{tag} \\
\ \mathsf{ResolveEntry}\_\pi (\mathsf{es},\ t)\quad \mathsf{otherwise} \\
\mathsf{ResolveTarget}\_\pi (\langle \Sigma \_\pi ,\ \mathsf{RS}\rangle ,\ \mathsf{tag})\ =\ \mathsf{target}\ \Leftrightarrow \ \mathsf{ResolveEntry}\_\pi (\mathsf{RS},\ \mathsf{tag})\ =\ \langle \mathsf{tag},\ \mathsf{target}\rangle  \\
\mathsf{BindProv}\_\Gamma (x)\ =\ \pi \ \Leftrightarrow \ \Gamma \ \mathsf{has}\ \mathsf{provenance}\ \mathsf{environment}\ \Omega \ \land \ \Gamma ;\ \Omega \ \vdash \ \operatorname{Identifier}(x)\ \Downarrow \ \pi  \\
\operatorname{BindRegionTarget}(x)\ =\ r\ \Leftrightarrow \ \mathsf{BindProv}\_\Gamma (x)\ =\ \pi_{\mathsf{Region}} (\mathsf{tag})\ \land \ \mathsf{ResolveTarget}\_\pi (\Omega ,\ \mathsf{tag})\ =\ r
\end{array}
```

```math
\texttt{ResolveTarget\_pi(Omega, tag)}\ \mathsf{returns}\ \mathsf{the}\ \mathsf{nearest}\ \mathsf{live}\ \mathsf{target}\ \mathsf{alias}\ \mathsf{recorded}\ \mathsf{for}\ \texttt{tag}.\ \mathsf{For}\ \mathsf{unique}\ \mathsf{region}\ \mathsf{handles},\ \mathsf{rebinding}\ \mathsf{updates}\ \mathsf{the}\ \mathsf{region}-\mathsf{target}\ \mathsf{relation}\ \mathsf{by}\ \mathsf{introducing}\ \mathsf{the}\ \mathsf{new}\ \mathsf{binding}\ \mathsf{name}\ \mathsf{as}\ \mathsf{the}\ \mathsf{nearest}\ \mathsf{alias}\ \mathsf{for}\ \mathsf{that}\ \mathsf{tag}.
```

**(BindValid-Sigma)**

```math
\begin{array}{l}
\operatorname{BindState}(\Gamma )\ =\ 𝔅\quad \operatorname{Lookup_B}(𝔅,\ x)\ =\ \langle s,\ \_,\ \_,\ \_\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BindValid}(x)\ \Downarrow \ s
\end{array}
```

**(BindSlot-Param-ByValue)**

```math
\begin{array}{l}
\operatorname{ProcParams}(\Gamma )\ =\ \mathsf{params}\quad \operatorname{ParamEntry}(\mathsf{params},\ x)\ =\ \langle \mathsf{mode},\ T\rangle \quad \Gamma \ \vdash \ \operatorname{ABIParam}(\mathsf{mode},\ T)\ \Downarrow \ \texttt{ByValue} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BindSlot}(x)\ \Downarrow \ \operatorname{AllocaSlot}(T)
\end{array}
```

**(BindSlot-Param-ByRef)**

```math
\begin{array}{l}
\operatorname{ProcParams}(\Gamma )\ =\ \mathsf{params}\quad \operatorname{ParamEntry}(\mathsf{params},\ x)\ =\ \langle \mathsf{mode},\ T\rangle \quad \Gamma \ \vdash \ \operatorname{ABIParam}(\mathsf{mode},\ T)\ \Downarrow \ \texttt{ByRef}\quad \operatorname{ProcSig}(\Gamma )\ =\ \mathsf{sig} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BindSlot}(x)\ \Downarrow \ \operatorname{LLVMParam}(\mathsf{sig},\ \mathsf{params},\ x)
\end{array}
```

**(BindSlot-Region)**

```math
\begin{array}{l}
\operatorname{BindRegionTarget}(x)\ =\ r \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BindSlot}(x)\ \Downarrow \ \operatorname{RegionSlot}(r,\ \operatorname{TypeOf}(x))
\end{array}
```

**(BindSlot-Local)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveValueName}(x)\ \Downarrow \ \mathsf{ent}\quad \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ \bot \quad \operatorname{ParamEntry}(\operatorname{ProcParams}(\Gamma ),\ x)\ \mathsf{undefined} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BindSlot}(x)\ \Downarrow \ \operatorname{AllocaSlot}(\operatorname{TypeOf}(x))
\end{array}
```

**(BindSlot-Static)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveValueName}(x)\ \Downarrow \ \mathsf{ent}\quad \mathsf{ent}.\mathsf{origin}_{\mathsf{opt}}\ =\ \mathsf{mp}\quad \mathsf{name}\ =\ (\mathsf{ent}.\mathsf{target}_{\mathsf{opt}}\ \mathsf{if}\ \mathsf{present},\ \mathsf{else}\ x)\quad \operatorname{PathOfModule}(\mathsf{mp})\ =\ \mathsf{path}\quad \operatorname{StaticSymPath}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{sym}\quad \Gamma \ \vdash \ \operatorname{StateRef}(\mathsf{sym})\ \Downarrow \ \mathsf{slot} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BindSlot}(x)\ \Downarrow \ \mathsf{slot}
\end{array}
```

**(UpdateValid-BindVar)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{UpdateValid}(x,\ \operatorname{BindVarIR}(x,\ v))\ \Downarrow \ \texttt{Valid}
\end{array}
```

**(UpdateValid-StoreVar)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{UpdateValid}(x,\ \operatorname{StoreVarIR}(x,\ v))\ \Downarrow \ \texttt{Valid}
\end{array}
```

**(UpdateValid-StoreVarNoDrop)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{BindValid}(x)\ \Downarrow \ s \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{UpdateValid}(x,\ \operatorname{StoreVarNoDropIR}(x,\ v))\ \Downarrow \ s
\end{array}
```

**(UpdateValid-MoveRoot)**

```math
\begin{array}{l}
\mathsf{op}\ =\ \operatorname{MoveStateIR}(p)\quad \operatorname{PlaceRoot}(p)\ =\ x\quad \operatorname{FieldHead}(p)\ =\ \bot  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{UpdateValid}(x,\ \mathsf{op})\ \Downarrow \ \mathsf{Moved}
\end{array}
```

**(UpdateValid-PartialMove-Init)**

```math
\begin{array}{l}
\mathsf{op}\ =\ \operatorname{MoveStateIR}(p)\quad \operatorname{PlaceRoot}(p)\ =\ x\quad \operatorname{FieldHead}(p)\ =\ f\quad \operatorname{BindValid}(x)\ \Downarrow \ \texttt{Valid} \\
\rule{18em}{0.4pt} \\
\operatorname{UpdateValid}(x,\ \mathsf{op})\ \Downarrow \ \operatorname{PartiallyMoved}(\{f\})
\end{array}
```

**(UpdateValid-PartialMove-Step)**

```math
\begin{array}{l}
\mathsf{op}\ =\ \operatorname{MoveStateIR}(p)\quad \operatorname{PlaceRoot}(p)\ =\ x\quad \operatorname{FieldHead}(p)\ =\ f\quad \operatorname{BindValid}(x)\ \Downarrow \ \operatorname{PartiallyMoved}(F) \\
\rule{18em}{0.4pt} \\
\operatorname{UpdateValid}(x,\ \mathsf{op})\ \Downarrow \ \operatorname{PartiallyMoved}(F\ \cup \ \{f\})
\end{array}
```

```math
\begin{array}{l}
\operatorname{DropOnAssignApplicable}(x)\ \Leftrightarrow \ \operatorname{BindInfo}(x).\mathsf{mov}\ =\ \mathsf{immov}\ \land \ \operatorname{BindInfo}(x).\mathsf{resp}\ =\ \mathsf{resp} \\
\operatorname{FieldsRev}(R)\ =\ \operatorname{rev}(\operatorname{Fields}(R)) \\
\operatorname{FieldDropIR}(\mathsf{slot},\ p,\ f,\ T)\ =\ \operatorname{EmitDrop}(T,\ \operatorname{Load}(\operatorname{FieldAddr}(\operatorname{TypePath}(p),\ \mathsf{slot},\ f),\ T)) \\
\operatorname{FieldDropSeq}(\mathsf{slot},\ p,\ F)\ =\ \mathbin{++} \_\{\langle f_{i},\ T_{i}\rangle \ \in \ \operatorname{FieldsRev}(\operatorname{RecordDecl}(p)),\ f_{i}\ \notin \ F\}\ \operatorname{FieldDropIR}(\mathsf{slot},\ p,\ f_{i},\ T_{i})
\end{array}
```

**(DropOnAssign-NotApplicable)**

```math
\begin{array}{l}
\lnot \ \operatorname{DropOnAssignApplicable}(x) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{DropOnAssign}(x,\ \mathsf{slot})\ \Downarrow \ \varepsilon 
\end{array}
```

**(DropOnAssign-Record-Valid)**

```math
\begin{array}{l}
\operatorname{DropOnAssignApplicable}(x)\quad \operatorname{TypeOf}(x)\ =\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \operatorname{BindValid}(x)\ \Downarrow \ \texttt{Valid} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{DropOnAssign}(x,\ \mathsf{slot})\ \Downarrow \ \operatorname{EmitDrop}(\operatorname{TypePath}(p),\ \operatorname{Load}(\mathsf{slot},\ \operatorname{TypePath}(p)))
\end{array}
```

**(DropOnAssign-Record-Partial)**

```math
\begin{array}{l}
\operatorname{DropOnAssignApplicable}(x)\quad \operatorname{TypeOf}(x)\ =\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \operatorname{BindValid}(x)\ \Downarrow \ \operatorname{PartiallyMoved}(F) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{DropOnAssign}(x,\ \mathsf{slot})\ \Downarrow \ \operatorname{FieldDropSeq}(\mathsf{slot},\ p,\ F)
\end{array}
```

**(DropOnAssign-Record-Moved)**

```math
\begin{array}{l}
\operatorname{DropOnAssignApplicable}(x)\quad \operatorname{TypeOf}(x)\ =\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \operatorname{BindValid}(x)\ \Downarrow \ \mathsf{Moved} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{DropOnAssign}(x,\ \mathsf{slot})\ \Downarrow \ \varepsilon 
\end{array}
```

**(DropOnAssign-Aggregate-Ok)**

```math
\begin{array}{l}
\operatorname{DropOnAssignApplicable}(x)\quad \operatorname{TypeOf}(x)\ \in \ \{\operatorname{TypeArray}(\_,\ \_),\ \operatorname{TypeTuple}(\_),\ \operatorname{TypeUnion}(\_),\ \operatorname{TypeModalState}(\_,\ \_)\}\quad \operatorname{BindValid}(x)\ \Downarrow \ s\quad s\ \ne \ \mathsf{Moved} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{DropOnAssign}(x,\ \mathsf{slot})\ \Downarrow \ \operatorname{EmitDrop}(\operatorname{TypeOf}(x),\ \operatorname{Load}(\mathsf{slot},\ \operatorname{TypeOf}(x)))
\end{array}
```

**(DropOnAssign-Aggregate-Moved)**

```math
\begin{array}{l}
\operatorname{DropOnAssignApplicable}(x)\quad \operatorname{TypeOf}(x)\ \in \ \{\operatorname{TypeArray}(\_,\ \_),\ \operatorname{TypeTuple}(\_),\ \operatorname{TypeUnion}(\_),\ \operatorname{TypeModalState}(\_,\ \_)\}\quad \operatorname{BindValid}(x)\ \Downarrow \ \mathsf{Moved} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{DropOnAssign}(x,\ \mathsf{slot})\ \Downarrow \ \varepsilon 
\end{array}
```

**(BindSlot-Err)**
BindSlot(x) undefined

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BindSlot}(x)\ \Uparrow 
\end{array}
```

**(BindValid-Err)**
BindValid(x) undefined

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{BindValid}(x)\ \Uparrow 
\end{array}
```

**(UpdateValid-Err)**
UpdateValid(x, op) undefined

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{UpdateValid}(x,\ \mathsf{op})\ \Uparrow 
\end{array}
```

**(DropOnAssign-Err)**
DropOnAssign(x, slot) undefined

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{DropOnAssign}(x,\ \mathsf{slot})\ \Uparrow 
\end{array}
```

#### 24.7.10 Call ABI Mapping

```math
\mathsf{LLVMCallJudg}\ =\ \{\operatorname{LLVMCallSig}(\mathsf{params},\ \mathsf{ret})\ \Downarrow \ \mathsf{sig},\ \operatorname{LLVMArgLower}(x,\ T,\ k)\ \Downarrow \ \mathsf{ll},\ \operatorname{LLVMRetLower}(T,\ k)\ \Downarrow \ \mathsf{ll}\}
```

```math
\begin{array}{l}
\operatorname{SigLLVMParams}(\mathsf{sig})\ =\ \mathsf{llvm}_{\mathsf{params}} \\
\operatorname{SigLLVMRet}(\mathsf{sig})\ =\ \mathsf{llvm}_{\mathsf{ret}} \\
\operatorname{SigLLVMAttrs}(\mathsf{sig})\ =\ \mathsf{attrs} \\
\operatorname{SigSRet}(\mathsf{sig})\ =\ \mathsf{sretSigma}
\end{array}
```

**(LLVMArgLower-ByValue-PtrValid)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau \quad \operatorname{StripPerm}(T)\ =\ \operatorname{TypePtr}(U,\ \texttt{Valid}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMArgLower}(x,\ T,\ \texttt{ByValue})\ \Downarrow \ \langle \tau ,\ \operatorname{LLVMArgAttrsExt}(x,\ T)\ \cup \ \operatorname{LLVMPtrAttrs}(T)\rangle 
\end{array}
```

**(LLVMArgLower-ByValue-Other)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau \quad \operatorname{StripPerm}(T)\ \ne \ \operatorname{TypePtr}(\_,\ \texttt{Valid}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMArgLower}(x,\ T,\ \texttt{ByValue})\ \Downarrow \ \langle \tau ,\ \operatorname{LLVMArgAttrsExt}(x,\ T)\rangle 
\end{array}
```

**(LLVMArgLower-ByRef)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMArgLower}(x,\ T,\ \texttt{ByRef})\ \Downarrow \ \langle \operatorname{LLVMPtrTy}(\operatorname{TypePtr}(\operatorname{TypePerm}(\texttt{const},\ T),\ \texttt{Valid})),\ \operatorname{LLVMPtrAttrs}(\operatorname{TypePtr}(\operatorname{TypePerm}(\texttt{const},\ T),\ \texttt{Valid}))\ \cup \ \operatorname{LLVMArgAttrsExt}(x,\ T)\rangle 
\end{array}
```

**(LLVMRetLower-ByValue-ZST)**

```math
\begin{array}{l}
\operatorname{sizeof}(T)\ =\ 0 \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMRetLower}(T,\ \texttt{ByValue})\ \Downarrow \ \texttt{void}
\end{array}
```

**(LLVMRetLower-ByValue)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau \quad \operatorname{sizeof}(T)\ >\ 0 \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMRetLower}(T,\ \texttt{ByValue})\ \Downarrow \ \tau 
\end{array}
```

**(LLVMRetLower-SRet)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMRetLower}(T,\ \texttt{SRet})\ \Downarrow \ \texttt{void}
\end{array}
```

```math
\begin{array}{l}
\operatorname{ArgInclude}(k,\ T)\ \Leftrightarrow \ (k\ =\ \texttt{ByRef})\ \lor \ (k\ =\ \texttt{ByValue}\ \land \ \operatorname{sizeof}(T)\ >\ 0) \\
\operatorname{LLVMArgList}([\langle m_{1},\ x_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ x_{n},\ T_{n}\rangle ],\ [k_{1},\ \ldots ,\ k_{n}])\ =\ [\tau_{i} \ \mid \ \operatorname{ArgInclude}(k_{i},\ T_{i})\ \land \ \Gamma \ \vdash \ \operatorname{LLVMArgLower}(x_{i},\ T_{i},\ k_{i})\ \Downarrow \ \langle \tau_{i} ,\ A_{i}\rangle ] \\
\operatorname{LLVMAttrList}([\langle m_{1},\ x_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ x_{n},\ T_{n}\rangle ],\ [k_{1},\ \ldots ,\ k_{n}])\ =\ [A_{i}\ \mid \ \operatorname{ArgInclude}(k_{i},\ T_{i})\ \land \ \Gamma \ \vdash \ \operatorname{LLVMArgLower}(x_{i},\ T_{i},\ k_{i})\ \Downarrow \ \langle \tau_{i} ,\ A_{i}\rangle ]
\end{array}
```

**(LLVMCall-ByValue)**

```math
\begin{array}{l}
\langle [k_{1},\ \ldots ,\ k_{n}],\ k_{r},\ \mathsf{sretSigma}\rangle \ =\ \operatorname{ABICall}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ],\ R)\quad k_{r}\ =\ \texttt{ByValue}\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{LLVMArgLower}(x_{i},\ T_{i},\ k_{i})\ \Downarrow \ \langle \tau_{i} ,\ A_{i}\rangle \quad \Gamma \ \vdash \ \operatorname{LLVMRetLower}(R,\ \texttt{ByValue})\ \Downarrow \ \tau_{r}  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMCallSig}([\langle m_{1},\ x_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ x_{n},\ T_{n}\rangle ],\ R)\ \Downarrow \ \langle \operatorname{LLVMArgList}([\langle m_{1},\ x_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ x_{n},\ T_{n}\rangle ],\ [k_{1},\ \ldots ,\ k_{n}]),\ \tau_{r} ,\ \operatorname{LLVMAttrList}([\langle m_{1},\ x_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ x_{n},\ T_{n}\rangle ],\ [k_{1},\ \ldots ,\ k_{n}]),\ \mathsf{false}\rangle 
\end{array}
```

**(LLVMCall-SRet)**

```math
\begin{array}{l}
\langle [k_{1},\ \ldots ,\ k_{n}],\ k_{r},\ \mathsf{sretSigma}\rangle \ =\ \operatorname{ABICall}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ],\ R)\quad k_{r}\ =\ \texttt{SRet}\quad \mathsf{sret}_{\mathsf{param}}\ =\ \operatorname{LLVMPtrTy}(\operatorname{TypePtr}(\operatorname{TypePerm}(\texttt{unique},\ R),\ \texttt{Valid}))\quad A_{\mathsf{sret}}\ =\ \{\texttt{sret},\ \texttt{noalias}\}\ \cup \ \operatorname{LLVMPtrAttrs}(\operatorname{TypePtr}(\operatorname{TypePerm}(\texttt{unique},\ R),\ \texttt{Valid}))\quad \forall \ i,\ \Gamma \ \vdash \ \operatorname{LLVMArgLower}(x_{i},\ T_{i},\ k_{i})\ \Downarrow \ \langle \tau_{i} ,\ A_{i}\rangle \quad \Gamma \ \vdash \ \operatorname{LLVMRetLower}(R,\ \texttt{SRet})\ \Downarrow \ \texttt{void} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMCallSig}([\langle m_{1},\ x_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ x_{n},\ T_{n}\rangle ],\ R)\ \Downarrow \ \langle [\mathsf{sret}_{\mathsf{param}}]\ \mathbin{++} \ \operatorname{LLVMArgList}([\langle m_{1},\ x_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ x_{n},\ T_{n}\rangle ],\ [k_{1},\ \ldots ,\ k_{n}]),\ \texttt{void},\ [A_{\mathsf{sret}}]\ \mathbin{++} \ \operatorname{LLVMAttrList}([\langle m_{1},\ x_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ x_{n},\ T_{n}\rangle ],\ [k_{1},\ \ldots ,\ k_{n}]),\ \mathsf{true}\rangle 
\end{array}
```

```math
\begin{array}{l}
\operatorname{ByRefAccess}(T)\ = \\
\ \texttt{rw}\quad \mathsf{if}\ \operatorname{PermOf}(T)\ =\ \texttt{unique} \\
\ \texttt{ro}\quad \mathsf{otherwise}
\end{array}
```

**(LLVMArgLower-Err)**
LLVMArgLower(x, T, k) undefined

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMArgLower}(x,\ T,\ k)\ \Uparrow 
\end{array}
```

**(LLVMRetLower-Err)**
LLVMRetLower(T, k) undefined

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMRetLower}(T,\ k)\ \Uparrow 
\end{array}
```

**(LLVMCall-Err)**
LLVMCallSig(params, ret) undefined

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LLVMCallSig}(\mathsf{params},\ \mathsf{ret})\ \Uparrow 
\end{array}
```

#### 24.7.11 VTable Emission

```math
\mathsf{VTableJudg}\ =\ \{\operatorname{EmitVTable}(T,\ \mathsf{Cl})\ \Downarrow \ \mathsf{IRDecl},\ \operatorname{EmitDropGlue}(T)\ \Downarrow \ \mathsf{IRDecl},\ \operatorname{DropGlueSym}(T)\ \Downarrow \ \mathsf{sym}\}
```

```math
\begin{array}{l}
\operatorname{DropGlueSym}(T)\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"drop"}]\ \mathbin{++} \ \operatorname{PathOfType}(T)) \\
\operatorname{VTableHeader}(T)\ =\ [\operatorname{sizeof}(T),\ \operatorname{alignof}(T),\ \operatorname{DropGlueSym}(T)] \\
\mathsf{PtrTy}\ =\ \operatorname{LLVMPtrTy}(\operatorname{TypeRawPtr}(\texttt{imm},\ \operatorname{TypePrim}(\texttt{"()"}))) \\
k\ =\ \mid \operatorname{VTable}(T,\ \mathsf{Cl})\mid  \\
\operatorname{VTableTy}(\mathsf{Cl})\ =\ \operatorname{LLVMStruct}([\operatorname{LLVMTy}(\operatorname{TypePrim}(\texttt{"usize"})),\ \operatorname{LLVMTy}(\operatorname{TypePrim}(\texttt{"usize"})),\ \mathsf{PtrTy}]\ \mathbin{++} \ [\mathsf{PtrTy}]^k) \\
\mathsf{GlobalVTable}\ :\ \mathsf{Symbol}\ \times \ \mathsf{Header}\ \times \ \mathsf{Slots}\ \to \ \mathsf{IRDecl} \\
\mathsf{LLVMGlobalVTable}\ :\ \mathsf{Symbol}\ \times \ \mathsf{Header}\ \times \ \mathsf{Slots}\ \to \ \mathsf{LLVMDecl}
\end{array}
```

```math
\operatorname{VTableSlots}(T,\ \mathsf{Cl})\ =\ [\operatorname{DispatchSym}(T,\ \mathsf{Cl},\ m.\mathsf{name})\ \mid \ m\ \in \ \operatorname{VTableEligible}(\mathsf{Cl})]
```

```math
\begin{array}{l}
\operatorname{DropGlueSpec}(T,\ \mathsf{IR})\ \Leftrightarrow \ \forall \ \sigma ,\ \mathsf{addr},\ v.\ \operatorname{LookupVal}(\sigma ,\ \texttt{"data"})\ =\ \operatorname{RawPtr}(\texttt{imm},\ \mathsf{addr})\ \land \ \operatorname{ReadAddr}(\sigma ,\ \mathsf{addr})\ =\ v\ \Rightarrow \ (\operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\ \land \ \Gamma \ \vdash \ \operatorname{DropValue}(T,\ v,\ \emptyset )\ \Downarrow \ \sigma ') \\
\Gamma \ \vdash \ \operatorname{DropGlueIR}(T)\ \Downarrow \ \mathsf{IR}\ \Leftrightarrow \ \operatorname{DropGlueSpec}(T,\ \mathsf{IR})
\end{array}
```

**(EmitDropGlue-Decl)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{DropGlueSym}(T)\ \Downarrow \ \mathsf{sym}\quad \Gamma \ \vdash \ \operatorname{DropGlueIR}(T)\ \Downarrow \ \mathsf{IR}_{\mathsf{drop}} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EmitDropGlue}(T)\ \Downarrow \ \operatorname{ProcIR}(\mathsf{sym},\ [\langle \texttt{move},\ \texttt{data},\ \operatorname{TypeRawPtr}(\texttt{imm},\ \operatorname{TypePrim}(\texttt{"()"}))\rangle ,\ \mathsf{PanicOutParam}],\ \operatorname{TypePrim}(\texttt{"()"}),\ \mathsf{IR}_{\mathsf{drop}})
\end{array}
```

**(EmitVTable-Err)**
EmitVTable(T, Cl) undefined

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EmitVTable}(T,\ \mathsf{Cl})\ \Uparrow 
\end{array}
```

#### 24.7.12 Literal Data Emission

```math
\mathsf{LiteralEmitJudg}\ =\ \{\operatorname{EmitLiteralData}(\mathsf{kind},\ \mathsf{bytes})\ \Downarrow \ \mathsf{IRDecl},\ \operatorname{EmitStringLit}(\mathsf{lit})\ \Downarrow \ \mathsf{sym},\ \operatorname{EmitBytesLit}(\mathsf{lit})\ \Downarrow \ \mathsf{sym}\}
```

StringBytes(lit) function

```math
\begin{array}{l}
\operatorname{EscapeBytes}(e)\ = \\
\ \operatorname{EscapeValue}(e)\quad \mathsf{if}\ e\ =\ \texttt{"\textbackslash{}u\{"}\ h_{1}\ \ldots \ h_{n}\ \texttt{"\}"} \\
\ [\operatorname{EscapeValue}(e)]\quad \mathsf{otherwise} \\
\operatorname{StringBytesFrom}(T,\ p,\ q)\ = \\
\ []\quad \mathsf{if}\ p\ =\ q \\
\ \operatorname{EscapeBytes}(\operatorname{Lexeme}(T,\ p,\ r))\ \mathbin{++} \ \operatorname{StringBytesFrom}(T,\ r,\ q)\ \mathsf{if}\ p\ <\ q\ \land \ T[p]\ =\ \texttt{"\textbackslash{}\textbackslash{}"}\ \land \ \operatorname{EscapeMatch}(T,\ p,\ r) \\
\ \operatorname{EncodeUTF8}(T[p])\ \mathbin{++} \ \operatorname{StringBytesFrom}(T,\ p\ +\ 1,\ q)\quad \mathsf{if}\ p\ <\ q\ \land \ T[p]\ \ne \ \texttt{"\textbackslash{}\textbackslash{}"} \\
\operatorname{StringBytes}(\mathsf{lit})\ =\ \mathsf{bytes}\ \Leftrightarrow \ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{StringLiteral}\ \land \ T\ =\ \operatorname{Lexeme}(\mathsf{lit})\ \land \ \operatorname{StringBytesFrom}(T,\ 1,\ \mid T\mid -1)\ =\ \mathsf{bytes} \\
\operatorname{RawBytes}(\mathsf{lit})\ =\ \mathsf{bytes}\ \Leftrightarrow \ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{BytesLiteral}\ \land \ \mathsf{lit}.\mathsf{payload}\ =\ \mathsf{bytes} \\
\operatorname{RawBytes}(\mathsf{lit})\ =\ \operatorname{StringBytes}(\mathsf{lit})\ \Leftrightarrow \ \mathsf{lit}.\mathsf{kind}\ =\ \mathsf{StringLiteral}
\end{array}
```

**(EmitLiteralData-Decl)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Mangle}(\operatorname{LiteralData}(\mathsf{kind},\ \mathsf{bytes}))\ \Downarrow \ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EmitLiteralData}(\mathsf{kind},\ \mathsf{bytes})\ \Downarrow \ \operatorname{GlobalConst}(\mathsf{sym},\ \mathsf{bytes})
\end{array}
```

**(EmitLiteral-String)**

```math
\begin{array}{l}
\operatorname{StringBytes}(\mathsf{lit})\ =\ \mathsf{bytes}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\operatorname{LiteralData}(\texttt{"string"},\ \mathsf{bytes}))\ \Downarrow \ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EmitStringLit}(\mathsf{lit})\ \Downarrow \ \mathsf{sym} \\
\operatorname{StringBytes}(\mathsf{lit})\ =\ \mathsf{bytes}\ \Rightarrow \ \operatorname{Utf8Valid}(\mathsf{bytes})
\end{array}
```

**(EmitLiteral-Bytes)**

```math
\begin{array}{l}
\operatorname{RawBytes}(\mathsf{lit})\ =\ \mathsf{bytes}\quad \Gamma \ \vdash \ \operatorname{Mangle}(\operatorname{LiteralData}(\texttt{"bytes"},\ \mathsf{bytes}))\ \Downarrow \ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EmitBytesLit}(\mathsf{lit})\ \Downarrow \ \mathsf{sym} \\
\operatorname{RawBytes}(\mathsf{lit})\ \mathsf{undefined}\ \Rightarrow \ \operatorname{EmitBytesLit}(\mathsf{lit})\ \mathsf{undefined}
\end{array}
```

**(EmitLiteral-Char)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePrim}(\texttt{"char"})\quad \Gamma \ \vdash \ \operatorname{EncodeConst}(T,\ \mathsf{lit})\ \Downarrow \ \mathsf{bytes} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EmitLiteralData}(\texttt{"char"},\ \mathsf{bytes})\ \Downarrow \ \operatorname{GlobalConst}(\operatorname{Mangle}(\operatorname{LiteralData}(\texttt{"char"},\ \mathsf{bytes})),\ \mathsf{bytes})
\end{array}
```

**(EmitLiteral-Int)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePrim}(t)\quad t\ \in \ \mathsf{IntTypes}\quad \Gamma \ \vdash \ \operatorname{EncodeConst}(T,\ \mathsf{lit})\ \Downarrow \ \mathsf{bytes} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EmitLiteralData}(\texttt{"int"},\ \mathsf{bytes})\ \Downarrow \ \operatorname{GlobalConst}(\operatorname{Mangle}(\operatorname{LiteralData}(\texttt{"int"},\ \mathsf{bytes})),\ \mathsf{bytes})
\end{array}
```

**(EmitLiteral-Float)**

```math
\begin{array}{l}
T\ =\ \operatorname{TypePrim}(t)\quad t\ \in \ \mathsf{FloatTypes}\quad \Gamma \ \vdash \ \operatorname{EncodeConst}(T,\ \mathsf{lit})\ \Downarrow \ \mathsf{bytes} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EmitLiteralData}(\texttt{"float"},\ \mathsf{bytes})\ \Downarrow \ \operatorname{GlobalConst}(\operatorname{Mangle}(\operatorname{LiteralData}(\texttt{"float"},\ \mathsf{bytes})),\ \mathsf{bytes})
\end{array}
```

**(EmitLiteral-Err)**
EmitLiteralData(kind, bytes) undefined

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{EmitLiteralData}(\mathsf{kind},\ \mathsf{bytes})\ \Uparrow 
\end{array}
```

#### 24.7.13 Poisoning Instrumentation

```math
\mathsf{PoisonJudg}\ =\ \{\operatorname{PoisonFlag}(m)\ \Downarrow \ \mathsf{sym},\ \operatorname{CheckPoison}(m)\ \Downarrow \ \mathsf{IR},\ \operatorname{SetPoison}(m)\ \Downarrow \ \mathsf{IR}\}
```

```math
\operatorname{PoisonSet}(m)\ =\ \{m\}\ \cup \ \{x\ \mid \ \operatorname{Reachable}(x,\ m,\ E_{\mathsf{val}}^\{\mathsf{eager}\})\}
```

**(PoisonFlag-Decl)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{PoisonFlag}(m)\ \Downarrow \ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"poison"}]\ \mathbin{++} \ \operatorname{PathOfModule}(m))
\end{array}
```

```math
\begin{array}{l}
\operatorname{PoisonFlagDecl}(m)\ =\ \operatorname{GlobalZero}(\operatorname{PoisonFlag}(m),\ \operatorname{sizeof}(\operatorname{TypePrim}(\texttt{"bool"}))) \\
\operatorname{StaticType}(\operatorname{PoisonFlag}(m))\ =\ \operatorname{TypePrim}(\texttt{"bool"})
\end{array}
```

```math
\mathsf{When}\ \texttt{HostedStateSym(Project(Gamma), PoisonFlag(m))}\ \mathsf{holds},\ \texttt{PoisonFlagDecl(m)}\ \mathsf{denotes}\ \mathsf{the}\ \mathsf{per}-\mathsf{session}\ \mathsf{poison}-\mathsf{flag}\ \mathsf{template}\ \mathsf{for}\ \mathsf{module}\ \texttt{m}.
```

**(CheckPoison-Use)**

```math
\begin{array}{l}
\operatorname{PoisonFlag}(m)\ \Downarrow \ \mathsf{sym} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CheckPoison}(m)\ \Downarrow \ \mathsf{IR} \\
\Gamma \ \vdash \ \operatorname{CheckPoison}(m)\ \Downarrow \ \mathsf{IR}\ \Leftrightarrow \ \forall \ \sigma .\ (\operatorname{ReadAddr}(\sigma ,\ \operatorname{AddrOfSym}(\operatorname{PoisonFlag}(m)))\ \ne \ 0\ \Rightarrow \ \exists \ \sigma '.\ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma ')\ \land \ \operatorname{ExecIRSigma}(\operatorname{LowerPanic}(\operatorname{InitPanic}(m)),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma '))\ \land \ (\operatorname{ReadAddr}(\sigma ,\ \operatorname{AddrOfSym}(\operatorname{PoisonFlag}(m)))\ =\ 0\ \Rightarrow \ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\operatorname{Val}(()),\ \sigma ))
\end{array}
```

Within hosted-library session execution, the `AddrOfSym(PoisonFlag(m))` and `StoreGlobal(sym_i, 1)` occurrences in this subsection are interpreted by §§24.4.1 and 24.7.8 so that each live hosted session owns an independent poison flag for every hosted-state module.

**(SetPoison-OnInitFail)**

```math
\begin{array}{l}
\operatorname{PoisonSet}(m)\ =\ \{m_{1},\ \ldots ,\ m_{k}\}\quad \forall \ i,\ \operatorname{PoisonFlag}(m_{i})\ \Downarrow \ \mathsf{sym}_{i} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{SetPoison}(m)\ \Downarrow \ \operatorname{SeqIR}(\operatorname{StoreGlobal}(\mathsf{sym}_{1},\ 1),\ \ldots ,\ \operatorname{StoreGlobal}(\mathsf{sym}_{k},\ 1))
\end{array}
```

**(PoisonFlag-Err)**
PoisonFlag(m) undefined

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{PoisonFlag}(m)\ \Uparrow 
\end{array}
```

**(CheckPoison-Err)**
CheckPoison(m) undefined

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CheckPoison}(m)\ \Uparrow 
\end{array}
```

**(SetPoison-Err)**
SetPoison(m) undefined

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{SetPoison}(m)\ \Uparrow 
\end{array}
```

### 24.8 Output and Backend Diagnostics

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
