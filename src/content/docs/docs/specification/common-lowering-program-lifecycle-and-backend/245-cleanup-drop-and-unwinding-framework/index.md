---
title: "24.5 Cleanup, Drop, and Unwinding Framework"
description: "24.5 Cleanup, Drop, and Unwinding Framework from 24. Common Lowering, Program Lifecycle, and Backend of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "common-lowering-program-lifecycle-and-backend"
specSection: "245-cleanup-drop-and-unwinding-framework"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/common-lowering-program-lifecycle-and-backend/">24. Common Lowering, Program Lifecycle, and Backend</a>
  <span>Common Lowering, Program Lifecycle, and Backend</span>
</div>

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
