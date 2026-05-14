---
title: "14.6 Dynamic Class Objects"
description: "14.6 Dynamic Class Objects from 14. Abstraction and Polymorphism of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "abstraction-and-polymorphism"
specSection: "146-dynamic-class-objects"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/abstraction-and-polymorphism/">14. Abstraction and Polymorphism</a>
  <span>Abstraction and Polymorphism</span>
</div>

## 14.6 Dynamic Class Objects

### 14.6.1 Syntax

```text
dynamic_type      ::= "$" class_path
dynamic_cast_expr ::= expr "as" dynamic_type
```

Method-call surface syntax on dynamic values is the ordinary `base~>name(args)` form from Chapter 16.

### 14.6.2 Parsing

**(Parse-Dynamic-Type)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"\$"})\quad \Gamma \ \vdash \ \operatorname{ParseTypePath}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{path}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseNonPermType}(P)\ \Downarrow \ (P_{1},\ \operatorname{TypeDynamic}(\mathsf{path}))
\end{array}
$$

No feature-specific parse form exists beyond ordinary cast parsing for `expr as $Class`.

### 14.6.3 AST Representation / Form

$$
\mathsf{Type}\ =\ \operatorname{TypeDynamic}(\mathsf{path})\ \mid \ \ldots 
$$

$$
\begin{array}{l}
\operatorname{DynFields}(\mathsf{Cl})\ =\ [\langle \texttt{data},\ \operatorname{TypeRawPtr}(\texttt{imm},\ \operatorname{TypePrim}(\texttt{"()"}))\rangle ,\ \langle \texttt{vtable},\ \operatorname{TypeRawPtr}(\texttt{imm},\ \operatorname{TypePath}([\texttt{"VTable"}]))\rangle ] \\[0.16em]
\mathsf{DynLayoutJudg}\ =\ \{\mathsf{DynLayout}\}
\end{array}
$$

Dyn(Cl, RawPtr(`imm`, addr), T) is the runtime value form for a dynamic class object whose hidden concrete type is `T`.

$$
\begin{array}{l}
\operatorname{SelfOccurs}(\operatorname{TypePath}([\texttt{Self}]))\ =\ \mathsf{true} \\[0.16em]
\operatorname{SelfOccurs}(\operatorname{TypePerm}(p,\ \mathsf{ty}))\ =\ \operatorname{SelfOccurs}(\mathsf{ty}) \\[0.16em]
\operatorname{SelfOccurs}(\operatorname{TypeTuple}([t_{1},\ \ldots ,\ t_{n}]))\ =\ \lor_{i} \ \operatorname{SelfOccurs}(t_{i}) \\[0.16em]
\operatorname{SelfOccurs}(\operatorname{TypeArray}(\mathsf{ty},\ e))\ =\ \operatorname{SelfOccurs}(\mathsf{ty}) \\[0.16em]
\operatorname{SelfOccurs}(\operatorname{TypeSlice}(\mathsf{ty}))\ =\ \operatorname{SelfOccurs}(\mathsf{ty}) \\[0.16em]
\operatorname{SelfOccurs}(\operatorname{TypeUnion}([t_{1},\ \ldots ,\ t_{n}]))\ =\ \lor_{i} \ \operatorname{SelfOccurs}(t_{i}) \\[0.16em]
\operatorname{SelfOccurs}(\operatorname{TypeFunc}([\langle m_{1},\ t_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ t_{n}\rangle ],\ r))\ =\ (\lor_{i} \ \operatorname{SelfOccurs}(t_{i}))\ \lor \ \operatorname{SelfOccurs}(r) \\[0.16em]
\operatorname{SelfOccurs}(\operatorname{TypePtr}(\_,\ \_))\ =\ \mathsf{false} \\[0.16em]
\operatorname{SelfOccurs}(\operatorname{TypeRawPtr}(\_,\ \_))\ =\ \mathsf{false} \\[0.16em]
\operatorname{SelfOccurs}(\operatorname{TypeString}(\_))\ =\ \mathsf{false} \\[0.16em]
\operatorname{SelfOccurs}(\operatorname{TypeBytes}(\_))\ =\ \mathsf{false} \\[0.16em]
\operatorname{SelfOccurs}(\operatorname{TypeModalState}(\_,\ \_))\ =\ \mathsf{false} \\[0.16em]
\operatorname{SelfOccurs}(\operatorname{TypeDynamic}(\_))\ =\ \mathsf{false} \\[0.16em]
\operatorname{SelfOccurs}(\operatorname{TypePrim}(\_))\ =\ \mathsf{false} \\[0.16em]
\operatorname{SelfOccurs}(\operatorname{TypePath}(p))\ =\ \mathsf{false}\quad \mathsf{if}\ p\ \ne \ [\texttt{Self}]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{HasReceiver}(m)\ \Leftrightarrow \ m.\mathsf{receiver}\ \ne \ \bot  \\[0.16em]
\operatorname{HasGenericParams}(m)\ \Leftrightarrow \ \operatorname{TypeParamsOpt}(m.\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\ \ne \ [] \\[0.16em]
\operatorname{vtable_eligible}(m)\ \Leftrightarrow \ \operatorname{HasReceiver}(m)\ \land \ \lnot \ \operatorname{HasGenericParams}(m)\ \land \ \lnot \ \operatorname{SelfOccurs}(m) \\[0.16em]
\operatorname{dispatchable}(\mathsf{Cl})\ \Leftrightarrow \ \forall \ m\ \in \ \operatorname{EffMethods}(\mathsf{Cl}).\ \operatorname{vtable_eligible}(m)
\end{array}
$$

### 14.6.4 Static Semantics

**(WF-Dynamic)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeDynamic}(p)\quad p\ \in \ \operatorname{dom}(\Sigma .\mathsf{Classes}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}
\end{array}
$$

**(WF-Dynamic-Err)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeDynamic}(p)\quad p\ \notin \ \operatorname{dom}(\Sigma .\mathsf{Classes}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}\ \Uparrow 
\end{array}
$$

**(T-Equiv-Dynamic)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeDynamic}(p)\quad U\ =\ \operatorname{TypeDynamic}(p) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \equiv \ U
\end{array}
$$

**(T-Dynamic-Form)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\mathsf{place}\ T\quad \operatorname{IsPlace}(e)\quad \operatorname{AddrOfOk}(e)\quad \Gamma \ \vdash \ \mathsf{Cl}\ :\ \mathsf{ClassPath}\quad \Gamma \ \vdash \ \operatorname{StripPerm}(T)\ \mathrel{<:} \ \mathsf{Cl}\quad \operatorname{dispatchable}(\mathsf{Cl}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ e\ \texttt{as}\ \operatorname{TypeDynamic}(\mathsf{Cl})\ :\ \operatorname{TypeDynamic}(\mathsf{Cl})
\end{array}
$$

**(Dynamic-NonDispatchable)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\mathsf{place}\ T\quad \operatorname{IsPlace}(e)\quad \Gamma \ \vdash \ \mathsf{Cl}\ :\ \mathsf{ClassPath}\quad \Gamma \ \vdash \ \operatorname{StripPerm}(T)\ \mathrel{<:} \ \mathsf{Cl}\quad \lnot \ \operatorname{dispatchable}(\mathsf{Cl}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ e\ \texttt{as}\ \operatorname{TypeDynamic}(\mathsf{Cl})\ \Uparrow 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LookupMethod}(T,\ \mathsf{name})\ =\ m\ \Leftrightarrow \ \operatorname{MethodByName}(T,\ \mathsf{name})\ =\ m \\[0.16em]
\operatorname{LookupMethod}(T,\ \mathsf{name})\ =\ m\ \Leftrightarrow \ \operatorname{MethodByName}(T,\ \mathsf{name})\ =\ \bot \ \land \ \mid \operatorname{ClassDefaults}(T,\ \mathsf{name})\mid \ =\ 1\ \land \ m\ \in \ \operatorname{ClassDefaults}(T,\ \mathsf{name}) \\[0.16em]
\operatorname{LookupMethod}(T,\ \mathsf{name})\ =\ \bot \ \Leftrightarrow \ \operatorname{MethodByName}(T,\ \mathsf{name})\ =\ \bot \ \land \ (\mid \operatorname{ClassDefaults}(T,\ \mathsf{name})\mid \ =\ 0\ \lor \ \mid \operatorname{ClassDefaults}(T,\ \mathsf{name})\mid \ >\ 1)
\end{array}
$$

**(T-Dynamic-MethodCall)**

$$
\begin{array}{l}
\operatorname{RecvBaseType}(\mathsf{base},\ \operatorname{RecvMode}(m.\mathsf{receiver}))\ =\ P_{\mathsf{caller}}\ \operatorname{TypeDynamic}(\mathsf{Cl})\quad \operatorname{LookupClassMethod}(\mathsf{Cl},\ \mathsf{name})\ =\ m\quad \operatorname{RecvPerm}(\mathsf{SelfVar},\ m.\mathsf{receiver})\ =\ P_{\mathsf{method}}\quad \operatorname{PermAdmits}(P_{\mathsf{caller}},\ P_{\mathsf{method}})\quad \operatorname{RecvArgOk}(\mathsf{base},\ \operatorname{RecvMode}(m.\mathsf{receiver}))\quad \Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk}(m.\mathsf{params},\ \mathsf{args}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{MethodCall}(\mathsf{base},\ \mathsf{name},\ \mathsf{args})\ :\ \operatorname{ReturnType}(m)
\end{array}
$$

**(LookupClassMethod-NotFound)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{base}\ :\ \operatorname{TypeDynamic}(\mathsf{Cl})\quad \operatorname{LookupClassMethod}(\mathsf{Cl},\ \mathsf{name})\ \mathsf{undefined} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{MethodCall}(\mathsf{base},\ \mathsf{name},\ \mathsf{args})\ \Uparrow 
\end{array}
$$

Dynamic dispatch is permitted only for dispatchable classes, that is, classes whose effective method set is entirely vtable-eligible.

### 14.6.5 Dynamic Semantics

$$
\operatorname{ValueType}(\operatorname{Dyn}(\mathsf{Cl},\ \operatorname{RawPtr}(\texttt{imm},\ \mathsf{addr}),\ T))\ =\ \operatorname{TypeDynamic}(\mathsf{Cl})
$$

**(Eval-Dynamic-Form)**

$$
\begin{array}{l}
\operatorname{IsPlace}(e)\quad \Gamma \ \vdash \ \operatorname{AddrOfSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{addr}),\ \sigma_{1} )\quad T_{e}\ =\ \operatorname{ExprType}(e)\quad T\ =\ \operatorname{StripPerm}(T_{e})\quad \Gamma \ \vdash \ T\ \mathrel{<:} \ \mathsf{Cl} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(e\ \texttt{as}\ \operatorname{TypeDynamic}(\mathsf{Cl}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{Dyn}(\mathsf{Cl},\ \operatorname{RawPtr}(\texttt{imm},\ \mathsf{addr}),\ T)),\ \sigma_{1} )
\end{array}
$$

**(Eval-Dynamic-Form-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{AddrOfSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(e\ \texttt{as}\ \operatorname{TypeDynamic}(\mathsf{Cl}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Dispatch}(T,\ \mathsf{Cl},\ \mathsf{name})\ =\ m'\ \Leftrightarrow \ m\ =\ \operatorname{LookupClassMethod}(\mathsf{Cl},\ \mathsf{name})\ \land \ \operatorname{MethodByName}(T,\ \mathsf{name})\ =\ m'\ \land \ \operatorname{SigMatch}(T,\ m',\ m) \\[0.16em]
\operatorname{Dispatch}(T,\ \mathsf{Cl},\ \mathsf{name})\ =\ m\ \Leftrightarrow \ m\ =\ \operatorname{LookupClassMethod}(\mathsf{Cl},\ \mathsf{name})\ \land \ (\operatorname{MethodByName}(T,\ \mathsf{name})\ =\ \bot \ \lor \ (\exists \ m'.\ \operatorname{MethodByName}(T,\ \mathsf{name})\ =\ m'\ \land \ \lnot \ \operatorname{SigMatch}(T,\ m',\ m)))\ \land \ m.\mathsf{body}\ \ne \ \bot  \\[0.16em]
\operatorname{Dispatch}(T,\ \mathsf{Cl},\ \mathsf{name})\ =\ \bot \ \Leftrightarrow \ m\ =\ \operatorname{LookupClassMethod}(\mathsf{Cl},\ \mathsf{name})\ \land \ (\operatorname{MethodByName}(T,\ \mathsf{name})\ =\ \bot \ \lor \ (\exists \ m'.\ \operatorname{MethodByName}(T,\ \mathsf{name})\ =\ m'\ \land \ \lnot \ \operatorname{SigMatch}(T,\ m',\ m)))\ \land \ m.\mathsf{body}\ =\ \bot 
\end{array}
$$

$$
\operatorname{MethodTarget}(\operatorname{Dyn}(\mathsf{Cl},\ \operatorname{RawPtr}(\texttt{imm},\ \mathsf{addr}),\ T),\ \mathsf{name})\ =\ \operatorname{Dispatch}(T,\ \mathsf{Cl},\ \mathsf{name})
$$

### 14.6.6 Lowering

**(Layout-DynamicClass)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DynLayout}(\mathsf{Cl})\ \Downarrow \ \langle 2\ \times \ \mathsf{PtrSize},\ \mathsf{PtrAlign},\ \operatorname{DynFields}(\mathsf{Cl})\rangle 
\end{array}
$$

**(Size-DynamicClass)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeDynamic}(\mathsf{Cl}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ 2\ \times \ \mathsf{PtrSize}
\end{array}
$$

**(Align-DynamicClass)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeDynamic}(\mathsf{Cl}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{PtrAlign}
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

$$
\operatorname{ValueBits}(\operatorname{TypeDynamic}(\mathsf{Cl}),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ v\ =\ \operatorname{Dyn}(\mathsf{Cl},\ \operatorname{RawPtr}(\texttt{imm},\ \mathsf{addr}),\ T)\ \land \ \mathsf{sym}\ =\ \operatorname{ScopedSym}(\operatorname{VTableDecl}(T,\ \mathsf{Cl}))\ \land \ \mathsf{addr}_{\mathsf{vt}}\ =\ \operatorname{AddrOfSym}(\mathsf{sym})\ \land \ \operatorname{RecordLayout}(\operatorname{DynFields}(\mathsf{Cl}))\ \Downarrow \ \langle \mathsf{size},\ \_,\ \mathsf{offsets}\rangle \ \land \ \operatorname{StructBits}([\operatorname{TypeRawPtr}(\texttt{imm},\ \operatorname{TypePrim}(\texttt{"()"})),\ \operatorname{TypeRawPtr}(\texttt{imm},\ \operatorname{TypePath}([\texttt{"VTable"}]))],\ [\operatorname{RawPtr}(\texttt{imm},\ \mathsf{addr}),\ \operatorname{RawPtr}(\texttt{imm},\ \mathsf{addr}_{\mathsf{vt}})],\ \mathsf{offsets},\ \mathsf{size})\ =\ \mathsf{bits}
$$

$$
\begin{array}{l}
\mathsf{DynDispatchJudg}\ =\ \{\mathsf{VTable},\ \mathsf{VSlot},\ \mathsf{DynPack},\ \mathsf{LowerDynCall}\} \\[0.16em]
\operatorname{VTableEligible}(\mathsf{Cl})\ =\ [\ m\ \in \ \operatorname{EffMethods}(\mathsf{Cl})\ \mid \ \operatorname{vtable_eligible}(m)\ ]
\end{array}
$$

**(DispatchSym-Impl)**

$$
\begin{array}{l}
\operatorname{LookupClassMethod}(\mathsf{Cl},\ \mathsf{name})\ =\ m\quad \operatorname{MethodByName}(T,\ \mathsf{name})\ =\ m'\quad \operatorname{SigMatch}(T,\ m',\ m)\quad \Gamma \ \vdash \ \operatorname{Mangle}(m')\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DispatchSym}(T,\ \mathsf{Cl},\ \mathsf{name})\ \Downarrow \ \mathsf{sym}
\end{array}
$$

**(DispatchSym-Default-None)**

$$
\begin{array}{l}
\operatorname{LookupClassMethod}(\mathsf{Cl},\ \mathsf{name})\ =\ m\quad \operatorname{MethodByName}(T,\ \mathsf{name})\ =\ \bot \quad m.\mathsf{body}_{\mathsf{opt}}\ \ne \ \bot \quad \Gamma \ \vdash \ \operatorname{Mangle}(\operatorname{DefaultImpl}(T,\ m))\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DispatchSym}(T,\ \mathsf{Cl},\ \mathsf{name})\ \Downarrow \ \mathsf{sym}
\end{array}
$$

**(DispatchSym-Default-Mismatch)**

$$
\begin{array}{l}
\operatorname{LookupClassMethod}(\mathsf{Cl},\ \mathsf{name})\ =\ m\quad \operatorname{MethodByName}(T,\ \mathsf{name})\ =\ m'\quad \lnot \ \operatorname{SigMatch}(T,\ m',\ m)\quad m.\mathsf{body}_{\mathsf{opt}}\ \ne \ \bot \quad \Gamma \ \vdash \ \operatorname{Mangle}(\operatorname{DefaultImpl}(T,\ m))\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DispatchSym}(T,\ \mathsf{Cl},\ \mathsf{name})\ \Downarrow \ \mathsf{sym}
\end{array}
$$

**(VTable-Order)**

$$
\begin{array}{l}
\operatorname{VTableEligible}(\mathsf{Cl})\ =\ [m_{1},\ \ldots ,\ m_{k}]\quad \forall \ i,\ \operatorname{DispatchSym}(T,\ \mathsf{Cl},\ m_{i}.\mathsf{name})\ =\ \mathsf{sym}_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{VTable}(T,\ \mathsf{Cl})\ \Downarrow \ [\mathsf{sym}_{1},\ \ldots ,\ \mathsf{sym}_{k}]
\end{array}
$$

**(VSlot-Entry)**

$$
\begin{array}{l}
\operatorname{VTableEligible}(\mathsf{Cl})\ =\ [m_{0},\ \ldots ,\ m\_\{k-1\}]\quad m_{i}.\mathsf{name}\ =\ \mathsf{method}.\mathsf{name} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{VSlot}(\mathsf{Cl},\ \mathsf{method})\ \Downarrow \ i
\end{array}
$$

**(Lower-Dynamic-Form)**

$$
\begin{array}{l}
\operatorname{IsPlace}(e)\quad \Gamma \ \vdash \ \operatorname{LowerAddrOf}(e)\ \Downarrow \ \langle \mathsf{IR},\ \mathsf{addr}\rangle \quad T_{e}\ =\ \operatorname{ExprType}(e)\quad T\ =\ \operatorname{StripPerm}(T_{e})\quad \Gamma \ \vdash \ T\ \mathrel{<:} \ \mathsf{Cl} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DynPack}(T,\ e)\ \Downarrow \ \langle \operatorname{RawPtr}(\texttt{imm},\ \mathsf{addr}),\ \operatorname{VTable}(T,\ \mathsf{Cl})\rangle 
\end{array}
$$

**(Lower-DynCall)**

$$
\begin{array}{l}
\operatorname{VSlot}(\mathsf{Cl},\ \mathsf{name})\ \Downarrow \ i \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerDynCall}(\mathsf{base},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ \operatorname{SeqIR}(\operatorname{CallVTable}(\mathsf{base},\ i,\ \mathsf{args}),\ \mathsf{PanicCheck})
\end{array}
$$

**(EmitVTable-Decl)**

$$
\begin{array}{l}
\operatorname{Mangle}(\operatorname{VTableDecl}(T,\ \mathsf{Cl}))\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EmitVTable}(T,\ \mathsf{Cl})\ \Downarrow \ \operatorname{GlobalVTable}(\mathsf{sym},\ \operatorname{VTableHeader}(T),\ \operatorname{VTable}(T,\ \mathsf{Cl}))
\end{array}
$$

### 14.6.7 Diagnostics

Diagnostics are defined for dynamic casts to undefined or non-dispatchable classes, dynamic method lookup failures, direct calls to dynamically-dispatched `drop`, and vtable emission failures.
