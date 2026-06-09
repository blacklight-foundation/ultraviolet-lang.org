---
title: "24.7 Backend Requirements"
description: "24.7 Backend Requirements from 24. Common Lowering, Program Lifecycle, and Backend of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "common-lowering-program-lifecycle-and-backend"
specSection: "247-backend-requirements"
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
