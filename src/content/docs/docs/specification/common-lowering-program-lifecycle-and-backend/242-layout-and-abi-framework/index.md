---
title: "24.2 Layout and ABI Framework"
description: "24.2 Layout and ABI Framework from 24. Common Lowering, Program Lifecycle, and Backend of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "common-lowering-program-lifecycle-and-backend"
specSection: "242-layout-and-abi-framework"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/common-lowering-program-lifecycle-and-backend/">24. Common Lowering, Program Lifecycle, and Backend</a>
  <span>Common Lowering, Program Lifecycle, and Backend</span>
</div>

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
\operatorname{ObjFormatOf}(\texttt{aarch64-aapcs64})\ =\ \texttt{"ELF"} \\[0.16em]
\operatorname{ObjFormatOf}(\texttt{aarch64-darwin})\ =\ \texttt{"MachO"}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ObjExt}(\texttt{x86\_64-sysv})\ =\ \texttt{".o"} \\[0.16em]
\operatorname{ObjExt}(\texttt{x86\_64-win64})\ =\ \texttt{".obj"} \\[0.16em]
\operatorname{ObjExt}(\texttt{aarch64-aapcs64})\ =\ \texttt{".o"} \\[0.16em]
\operatorname{ObjExt}(\texttt{aarch64-darwin})\ =\ \texttt{".o"}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ExeSuffix}(\texttt{x86\_64-sysv})\ =\ \texttt{""} \\[0.16em]
\operatorname{ExeSuffix}(\texttt{x86\_64-win64})\ =\ \texttt{".exe"} \\[0.16em]
\operatorname{ExeSuffix}(\texttt{aarch64-aapcs64})\ =\ \texttt{""} \\[0.16em]
\operatorname{ExeSuffix}(\texttt{aarch64-darwin})\ =\ \texttt{""}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LibraryPrefix}(\texttt{x86\_64-sysv})\ =\ \texttt{"lib"} \\[0.16em]
\operatorname{LibraryPrefix}(\texttt{x86\_64-win64})\ =\ \texttt{""} \\[0.16em]
\operatorname{LibraryPrefix}(\texttt{aarch64-aapcs64})\ =\ \texttt{"lib"} \\[0.16em]
\operatorname{LibraryPrefix}(\texttt{aarch64-darwin})\ =\ \texttt{"lib"}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{SharedLibSuffix}(\texttt{x86\_64-sysv})\ =\ \texttt{".so"} \\[0.16em]
\operatorname{SharedLibSuffix}(\texttt{x86\_64-win64})\ =\ \texttt{".dll"} \\[0.16em]
\operatorname{SharedLibSuffix}(\texttt{aarch64-aapcs64})\ =\ \texttt{".so"} \\[0.16em]
\operatorname{SharedLibSuffix}(\texttt{aarch64-darwin})\ =\ \texttt{".dylib"}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{StaticLibSuffix}(\texttt{x86\_64-sysv})\ =\ \texttt{".a"} \\[0.16em]
\operatorname{StaticLibSuffix}(\texttt{x86\_64-win64})\ =\ \texttt{".lib"} \\[0.16em]
\operatorname{StaticLibSuffix}(\texttt{aarch64-aapcs64})\ =\ \texttt{".a"} \\[0.16em]
\operatorname{StaticLibSuffix}(\texttt{aarch64-darwin})\ =\ \texttt{".a"}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ImportLibSuffix}(\texttt{x86\_64-sysv})\ =\ \texttt{".so.import"} \\[0.16em]
\operatorname{ImportLibSuffix}(\texttt{x86\_64-win64})\ =\ \texttt{".lib"} \\[0.16em]
\operatorname{ImportLibSuffix}(\texttt{aarch64-aapcs64})\ =\ \texttt{".so.import"} \\[0.16em]
\operatorname{ImportLibSuffix}(\texttt{aarch64-darwin})\ =\ \texttt{".dylib.import"}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{EmitsImportLib}(\texttt{x86\_64-sysv})\ \Leftrightarrow \ \mathsf{false} \\[0.16em]
\operatorname{EmitsImportLib}(\texttt{x86\_64-win64})\ \Leftrightarrow \ \mathsf{true} \\[0.16em]
\operatorname{EmitsImportLib}(\texttt{aarch64-aapcs64})\ \Leftrightarrow \ \mathsf{false} \\[0.16em]
\operatorname{EmitsImportLib}(\texttt{aarch64-darwin})\ \Leftrightarrow \ \mathsf{false}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{RuntimeLibNameFor}(\texttt{x86\_64-sysv})\ =\ \texttt{"UltravioletRT.a"} \\[0.16em]
\operatorname{RuntimeLibNameFor}(\texttt{x86\_64-win64})\ =\ \texttt{"UltravioletRT.lib"} \\[0.16em]
\operatorname{RuntimeLibNameFor}(\texttt{aarch64-aapcs64})\ =\ \texttt{"UltravioletRT.a"} \\[0.16em]
\operatorname{RuntimeLibNameFor}(\texttt{aarch64-darwin})\ =\ \texttt{"UltravioletRT.a"}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LinkerToolName}(\texttt{x86\_64-sysv})\ =\ \texttt{ld.lld} \\[0.16em]
\operatorname{LinkerToolName}(\texttt{x86\_64-win64})\ =\ \texttt{lld-link} \\[0.16em]
\operatorname{LinkerToolName}(\texttt{aarch64-aapcs64})\ =\ \texttt{ld.lld} \\[0.16em]
\operatorname{LinkerToolName}(\texttt{aarch64-darwin})\ =\ \texttt{clang++}
\end{array}
$$

$$
\operatorname{LibraryEntrySym}(\texttt{x86\_64-win64})\ =\ \texttt{"\_\_ultraviolet\_library\_entry"}
$$

$$
\begin{array}{l}
\operatorname{ArchiverToolName}(\texttt{x86\_64-sysv})\ =\ \texttt{llvm-ar} \\[0.16em]
\operatorname{ArchiverToolName}(\texttt{x86\_64-win64})\ =\ \texttt{llvm-lib} \\[0.16em]
\operatorname{ArchiverToolName}(\texttt{aarch64-aapcs64})\ =\ \texttt{llvm-ar} \\[0.16em]
\operatorname{ArchiverToolName}(\texttt{aarch64-darwin})\ =\ \texttt{llvm-ar}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LinkFlagsFor}(\texttt{x86\_64-sysv},\ \texttt{exe},\ \mathsf{out},\ \_)\ =\ [\texttt{"-o"},\ \mathsf{out},\ \texttt{"--entry=\_start"},\ \texttt{"--nostdlib"},\ \texttt{"--dynamic-linker=/lib64/ld-linux-x86-64.so.2"}] \\[0.16em]
\operatorname{LinkFlagsFor}(\texttt{x86\_64-sysv},\ \texttt{shared},\ \mathsf{out},\ \_)\ =\ [\texttt{"-o"},\ \mathsf{out},\ \texttt{"--shared"},\ \texttt{"--nostdlib"}] \\[0.16em]
\operatorname{LinkFlagsFor}(\texttt{x86\_64-win64},\ \texttt{exe},\ \mathsf{out},\ \_)\ =\ [\texttt{"/OUT:"}\ \mathbin{++} \ \mathsf{out},\ \texttt{"/ENTRY:main"},\ \texttt{"/SUBSYSTEM:CONSOLE"},\ \texttt{"/NODEFAULTLIB"}] \\[0.16em]
\operatorname{LinkFlagsFor}(\texttt{x86\_64-win64},\ \texttt{shared},\ \mathsf{out},\ \mathsf{import}_{\mathsf{lib}})\ =\ [\texttt{"/OUT:"}\ \mathbin{++} \ \mathsf{out},\ \texttt{"/DLL"},\ \texttt{"/ENTRY:"}\ \mathbin{++} \ \operatorname{LibraryEntrySym}(\texttt{x86\_64-win64}),\ \texttt{"/NODEFAULTLIB"},\ \texttt{"/IMPLIB:"}\ \mathbin{++} \ \mathsf{import}_{\mathsf{lib}}] \\[0.16em]
\operatorname{LinkFlagsFor}(\texttt{aarch64-aapcs64},\ \texttt{exe},\ \mathsf{out},\ \_)\ =\ [\texttt{"-o"},\ \mathsf{out},\ \texttt{"--entry=main"},\ \texttt{"--nostdlib"},\ \texttt{"--dynamic-linker=/lib/ld-linux-aarch64.so.1"}] \\[0.16em]
\operatorname{LinkFlagsFor}(\texttt{aarch64-aapcs64},\ \texttt{shared},\ \mathsf{out},\ \_)\ =\ [\texttt{"-o"},\ \mathsf{out},\ \texttt{"--shared"},\ \texttt{"--nostdlib"}] \\[0.16em]
\operatorname{LinkFlagsFor}(\texttt{aarch64-darwin},\ \texttt{exe},\ \mathsf{out},\ \_)\ = \\[0.16em]
\ [\texttt{"-target"},\ \texttt{"arm64-apple-macosx14.0.0"},\ \texttt{"-mmacosx-version-min=14.0"},\ \texttt{"-o"},\ \mathsf{out},\ \texttt{"-Wl,-rpath,@executable\_path"},\ \texttt{"-Wl,-rpath,@loader\_path"}] \\[0.16em]
\operatorname{LinkFlagsFor}(\texttt{aarch64-darwin},\ \texttt{shared},\ \mathsf{out},\ \_)\ = \\[0.16em]
\ [\texttt{"-dynamiclib"},\ \texttt{"-target"},\ \texttt{"arm64-apple-macosx14.0.0"},\ \texttt{"-mmacosx-version-min=14.0"},\ \texttt{"-install\_name"},\ \texttt{"@rpath/"}\ \mathbin{++} \ \operatorname{basename}(\mathsf{out}),\ \texttt{"-o"},\ \mathsf{out},\ \texttt{"-Wl,-rpath,@loader\_path"}]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ArchiveFlagsFor}(\texttt{x86\_64-sysv},\ \mathsf{out})\ =\ [\texttt{"rcs"},\ \mathsf{out}] \\[0.16em]
\operatorname{ArchiveFlagsFor}(\texttt{x86\_64-win64},\ \mathsf{out})\ =\ [\texttt{"/OUT:"}\ \mathbin{++} \ \mathsf{out}] \\[0.16em]
\operatorname{ArchiveFlagsFor}(\texttt{aarch64-aapcs64},\ \mathsf{out})\ =\ [\texttt{"rcs"},\ \mathsf{out}] \\[0.16em]
\operatorname{ArchiveFlagsFor}(\texttt{aarch64-darwin},\ \mathsf{out})\ =\ [\texttt{"rcs"},\ \mathsf{out}]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LLVMTripleOf}(\texttt{x86\_64-sysv})\ =\ \texttt{"x86\_64-unknown-linux-gnu"} \\[0.16em]
\operatorname{LLVMTripleOf}(\texttt{x86\_64-win64})\ =\ \texttt{"x86\_64-pc-windows-msvc"} \\[0.16em]
\operatorname{LLVMTripleOf}(\texttt{aarch64-aapcs64})\ =\ \texttt{"aarch64-unknown-linux-gnu"} \\[0.16em]
\operatorname{LLVMTripleOf}(\texttt{aarch64-darwin})\ =\ \texttt{"arm64-apple-macosx14.0.0"}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LLVMDataLayoutOf}(\texttt{x86\_64-sysv})\ =\ \texttt{"e-m:e-p270:32:32-p271:32:32-p272:64:64-i128:128-n8:16:32:64-S128"} \\[0.16em]
\operatorname{LLVMDataLayoutOf}(\texttt{x86\_64-win64})\ =\ \texttt{"e-m:w-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"} \\[0.16em]
\operatorname{LLVMDataLayoutOf}(\texttt{aarch64-aapcs64})\ =\ \texttt{"e-m:e-i8:8:32-i16:16:32-i64:64-i128:128-n32:64-S128"} \\[0.16em]
\operatorname{LLVMDataLayoutOf}(\texttt{aarch64-darwin})\ =\ \texttt{"e-m:o-p270:32:32-p271:32:32-p272:64:64-i64:64-i128:128-n32:64-S128-Fn32"}
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
\operatorname{ConventionLayout}(\texttt{x86\_64-sysv},\ \texttt{C})\ =\ \langle \\[0.16em]
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
\operatorname{ConventionLayout}(\texttt{x86\_64-win64},\ \texttt{C})\ =\ \langle \\[0.16em]
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
\operatorname{ConventionLayout}(\texttt{aarch64-aapcs64},\ \texttt{C})\ =\ \langle \\[0.16em]
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
\operatorname{ConventionLayout}(\texttt{aarch64-darwin},\ \texttt{C})\ =\ \langle \\[0.16em]
\ \mathsf{param}_{\mathsf{regs}}:\ \langle \mathsf{int}\ =\ [\mathsf{x0},\ \mathsf{x1},\ \mathsf{x2},\ \mathsf{x3},\ \mathsf{x4},\ \mathsf{x5},\ \mathsf{x6},\ \mathsf{x7}],\ \mathsf{float}\ =\ [\mathsf{v0},\ \mathsf{v1},\ \mathsf{v2},\ \mathsf{v3},\ \mathsf{v4},\ \mathsf{v5},\ \mathsf{v6},\ \mathsf{v7}]\rangle , \\[0.16em]
\ \mathsf{return}_{\mathsf{regs}}:\ \langle \mathsf{int}\ =\ [\mathsf{x0},\ \mathsf{x1}],\ \mathsf{float}\ =\ [\mathsf{v0},\ \mathsf{v1}]\rangle , \\[0.16em]
\ \mathsf{stack}_{\mathsf{alignment}}:\ 16, \\[0.16em]
\ \mathsf{callee}_{\mathsf{saved}}:\ [\mathsf{x19},\ \mathsf{x20},\ \mathsf{x21},\ \mathsf{x22},\ \mathsf{x23},\ \mathsf{x24},\ \mathsf{x25},\ \mathsf{x26},\ \mathsf{x27},\ \mathsf{x28},\ \mathsf{x29},\ \mathsf{x30}], \\[0.16em]
\ \mathsf{caller}_{\mathsf{saved}}:\ [\mathsf{x0},\ \mathsf{x1},\ \mathsf{x2},\ \mathsf{x3},\ \mathsf{x4},\ \mathsf{x5},\ \mathsf{x6},\ \mathsf{x7},\ \mathsf{x8},\ \mathsf{x9},\ \mathsf{x10},\ \mathsf{x11},\ \mathsf{x12},\ \mathsf{x13},\ \mathsf{x14},\ \mathsf{x15},\ \mathsf{x16},\ \mathsf{x17}], \\[0.16em]
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
\mathsf{StackFrame}\ =\ \langle \\[0.16em]
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
\Gamma \ \vdash \ \operatorname{ABITy}(T)\ \Downarrow \ \tau \\[0.16em]
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
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{AliasBody}(p)\ =\ \mathsf{ty}\quad \Gamma \ \vdash \ \operatorname{ABITy}(\mathsf{ty})\ \Downarrow \ \tau \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ABITy}(T)\ \Downarrow \ \tau
\end{array}
$$

**(ABI-Record)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{RecordDecl}(p)\ =\ R\quad \operatorname{Fields}(R)\ =\ \mathsf{fields}\quad \operatorname{RecordLayout}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_\rangle \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ABITy}(T)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle
\end{array}
$$

**(ABI-Tuple)**

$$
\begin{array}{l}
\operatorname{TupleLayout}([T_{1},\ \ldots ,\ T_{n}])\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_\rangle \\[0.16em]
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
T\ =\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{EnumLayout}(E)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_,\ \_\rangle \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ABITy}(T)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle
\end{array}
$$

**(ABI-Union)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad \operatorname{UnionLayout}(T)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_,\ \_\rangle \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ABITy}(T)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle
\end{array}
$$

**(ABI-Modal)**

$$
\begin{array}{l}
T\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalLayout}(\mathsf{modal}_{\mathsf{ref}})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_,\ \_\rangle \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ABITy}(T)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle
\end{array}
$$

**(ABI-Dynamic)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{DynLayout}(\mathsf{Cl})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_\rangle \\[0.16em]
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

**(ABI-Param-ByRef-Move)**

$$
\begin{array}{l}
\mathsf{mode}\ =\ \texttt{move}\quad \Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ n \\[0.16em]
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
