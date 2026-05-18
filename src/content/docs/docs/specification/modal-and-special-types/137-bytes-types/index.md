---
title: "13.7 Bytes Types"
description: "13.7 Bytes Types from 13. Modal and Special Types of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "modal-and-special-types"
specSection: "137-bytes-types"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/modal-and-special-types/">13. Modal and Special Types</a>
  <span>Modal and Special Types</span>
</div>

## 13.7 Bytes Types

### 13.7.1 Syntax

```text
bytes_type      ::= "bytes" bytes_state_opt
bytes_state_opt ::= epsilon | "@" "Managed" | "@" "View"
```

### 13.7.2 Parsing

**(Parse-Bytes-Type)**

$$
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \operatorname{Lexeme}(\operatorname{Tok}(P))\ =\ \texttt{bytes}\quad \Gamma \ \vdash \ \operatorname{ParseBytesState}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{st}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseNonPermType}(P)\ \Downarrow \ (P_{1},\ \operatorname{TypeBytes}(\mathsf{st}_{\mathsf{opt}}))
\end{array}
$$

**Bytes State.**

**(Parse-BytesState-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"@"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseBytesState}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-BytesState-Managed)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"@"})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(P)))\quad \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(P)))\ =\ \texttt{Managed} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseBytesState}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P)),\ \texttt{Managed})
\end{array}
$$

**(Parse-BytesState-View)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"@"})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(P)))\quad \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(P)))\ =\ \texttt{View} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseBytesState}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P)),\ \texttt{View})
\end{array}
$$

### 13.7.3 AST Representation / Form

$$
\begin{array}{l}
\operatorname{TypeBytes}(\mathsf{state}_{\mathsf{opt}})\quad \mathsf{where}\ \mathsf{state}_{\mathsf{opt}}\ \in \ \{\bot ,\ \texttt{View},\ \texttt{Managed}\} \\[0.16em]
\operatorname{States}(\texttt{bytes})\ =\ \{\ \texttt{@Managed},\ \texttt{@View}\ \}
\end{array}
$$

BytesBuiltinTable =
{

$$
\begin{array}{l}
\ \langle \texttt{bytes::with\_capacity},\ [\langle \bot ,\ \texttt{cap},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ,\ \langle \bot ,\ \texttt{heap},\ \operatorname{TypeDynamic}(\texttt{HeapAllocator})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeBytes}(\texttt{@Managed})),\ \operatorname{TypePath}([\texttt{"AllocationError"}])])\rangle , \\[0.16em]
\ \langle \texttt{bytes::from\_slice},\ [\langle \bot ,\ \texttt{data},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeSlice}(\operatorname{TypePrim}(\texttt{"u8"})))\rangle ,\ \langle \bot ,\ \texttt{heap},\ \operatorname{TypeDynamic}(\texttt{HeapAllocator})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeBytes}(\texttt{@Managed})),\ \operatorname{TypePath}([\texttt{"AllocationError"}])])\rangle , \\[0.16em]
\ \langle \texttt{bytes::as\_view},\ [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeBytes}(\texttt{@Managed}))\rangle ],\ \operatorname{TypeBytes}(\texttt{@View})\rangle , \\[0.16em]
\ \langle \texttt{bytes::as\_slice},\ [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeBytes}(\texttt{@View}))\rangle ],\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeSlice}(\operatorname{TypePrim}(\texttt{"u8"})))\rangle , \\[0.16em]
\ \langle \texttt{bytes::to\_managed},\ [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeBytes}(\texttt{@View}))\rangle ,\ \langle \bot ,\ \texttt{heap},\ \operatorname{TypeDynamic}(\texttt{HeapAllocator})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeBytes}(\texttt{@Managed})),\ \operatorname{TypePath}([\texttt{"AllocationError"}])])\rangle , \\[0.16em]
\ \langle \texttt{bytes::view},\ [\langle \bot ,\ \texttt{data},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeSlice}(\operatorname{TypePrim}(\texttt{"u8"})))\rangle ],\ \operatorname{TypeBytes}(\texttt{@View})\rangle , \\[0.16em]
\ \langle \texttt{bytes::view\_string},\ [\langle \bot ,\ \texttt{data},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeBytes}(\texttt{@View})\rangle , \\[0.16em]
\ \langle \texttt{bytes::append},\ [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeBytes}(\texttt{@Managed}))\rangle ,\ \langle \bot ,\ \texttt{data},\ \operatorname{TypeBytes}(\texttt{@View})\rangle ,\ \langle \bot ,\ \texttt{heap},\ \operatorname{TypeDynamic}(\texttt{HeapAllocator})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePath}([\texttt{"AllocationError"}])])\rangle , \\[0.16em]
\ \langle \texttt{bytes::length},\ [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeBytes}(\texttt{@View}))\rangle ],\ \operatorname{TypePrim}(\texttt{"usize"})\rangle , \\[0.16em]
\ \langle \texttt{bytes::is\_empty},\ [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeBytes}(\texttt{@View}))\rangle ],\ \operatorname{TypePrim}(\texttt{"bool"})\rangle  \\[0.16em]
\}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{StringBytesBuiltinTable}\ =\ \mathsf{StringBuiltinTable}\ \cup \ \mathsf{BytesBuiltinTable} \\[0.16em]
\operatorname{BytesBuiltinSig}(\mathsf{method})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \langle \mathsf{method},\ \mathsf{params},\ \mathsf{ret}\rangle \ \in \ \mathsf{BytesBuiltinTable} \\[0.16em]
\operatorname{StringBytesBuiltinSig}(\mathsf{method})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \operatorname{StringBuiltinSig}(\mathsf{method})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle  \\[0.16em]
\operatorname{StringBytesBuiltinSig}(\mathsf{method})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \operatorname{BytesBuiltinSig}(\mathsf{method})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle 
\end{array}
$$

### 13.7.4 Static Semantics

**(WF-Bytes)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeBytes}(\mathsf{state}_{\mathsf{opt}})\quad \mathsf{state}_{\mathsf{opt}}\ \in \ \{\bot ,\ \texttt{View},\ \texttt{Managed}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}
\end{array}
$$

$$
\begin{array}{l}
S\ \in \ \{\texttt{@Managed},\ \texttt{@View}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{bytes}@S\ \mathrel{<:} \ \mathsf{bytes}
\end{array}
$$

The built-in bytes operations are typed by `BytesBuiltinSig`. Calls to those operations use the ordinary call and method-call rules of Chapter 16.

### 13.7.5 Dynamic Semantics

$$
\operatorname{SliceBytes}(\mathsf{data})\ =\ [b\ \mid \ b\ \in \ \mathsf{data}]
$$

$$
\begin{array}{l}
\operatorname{ValueType}(v)\ =\ \operatorname{TypeBytes}(\texttt{@View})\ \Leftrightarrow \ v\ \in \ \texttt{bytes@View} \\[0.16em]
\operatorname{ValueType}(v)\ =\ \operatorname{TypeBytes}(\texttt{@Managed})\ \Leftrightarrow \ v\ \in \ \texttt{bytes@Managed} \\[0.16em]
\operatorname{ValueType}(v)\ =\ \operatorname{TypeBytes}(\bot )\ \Leftrightarrow \ \operatorname{ValueType}(v)\ =\ \operatorname{TypeBytes}(\texttt{@View})\ \lor \ \operatorname{ValueType}(v)\ =\ \operatorname{TypeBytes}(\texttt{@Managed})
\end{array}
$$

$$
\begin{array}{l}
\mathsf{StringBytesJudg}_{\mathsf{bytes}}\ =\ \{ \\[0.16em]
\ \operatorname{BytesWithCapacity}(\mathsf{SB},\ \mathsf{cap},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}'), \\[0.16em]
\ \operatorname{BytesFromSlice}(\mathsf{SB},\ \mathsf{data},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}'), \\[0.16em]
\ \operatorname{BytesAsView}(\mathsf{SB},\ \mathsf{self})\ \Downarrow \ v, \\[0.16em]
\ \operatorname{BytesToManaged}(\mathsf{SB},\ \mathsf{self},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}'), \\[0.16em]
\ \operatorname{BytesView}(\mathsf{SB},\ \mathsf{data})\ \Downarrow \ v, \\[0.16em]
\ \operatorname{BytesViewString}(\mathsf{SB},\ \mathsf{data})\ \Downarrow \ v, \\[0.16em]
\ \operatorname{BytesAsSlice}(\mathsf{SB},\ \mathsf{self})\ \Downarrow \ s, \\[0.16em]
\ \operatorname{BytesAppend}(\mathsf{SB},\ \mathsf{self},\ \mathsf{data},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}'), \\[0.16em]
\ \operatorname{BytesLength}(\mathsf{SB},\ \mathsf{self})\ \Downarrow \ n, \\[0.16em]
\ \operatorname{BytesIsEmpty}(\mathsf{SB},\ \mathsf{self})\ \Downarrow \ b \\[0.16em]
\}
\end{array}
$$

$$
\mathsf{StringBytesJudg}\ =\ \mathsf{StringBytesJudg}_{\mathsf{string}}\ \cup \ \mathsf{StringBytesJudg}_{\mathsf{bytes}}
$$

**(BytesWithCapacity-Ok)**

$$
\begin{array}{l}
r\ =\ v\quad \mathsf{BytesBuf}'\ =\ \mathsf{BytesBuf}[v\ \mapsto \ []]\quad \mathsf{BytesCap}'\ =\ \mathsf{BytesCap}[v\ \mapsto \ \mathsf{cap}']\quad \mathsf{cap}'\ \ge \ \mathsf{cap}\quad \mathsf{SB}'\ =\ \langle \mathsf{StrBuf},\ \mathsf{BytesBuf}',\ \mathsf{BytesCap}'\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BytesWithCapacity}(\mathsf{SB},\ \mathsf{cap},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}')
\end{array}
$$

**(BytesWithCapacity-Err)**

$$
\begin{array}{l}
\operatorname{AllocErrorVal}(r)\quad \mathsf{SB}'\ =\ \mathsf{SB} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BytesWithCapacity}(\mathsf{SB},\ \mathsf{cap},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}')
\end{array}
$$

**(BytesFromSlice-Ok)**

$$
\begin{array}{l}
r\ =\ v\quad \mathsf{BytesBuf}'\ =\ \mathsf{BytesBuf}[v\ \mapsto \ \operatorname{SliceBytes}(\mathsf{data})]\quad \mathsf{SB}'\ =\ \langle \mathsf{StrBuf},\ \mathsf{BytesBuf}',\ \mathsf{BytesCap}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BytesFromSlice}(\mathsf{SB},\ \mathsf{data},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}')
\end{array}
$$

**(BytesFromSlice-Err)**

$$
\begin{array}{l}
\operatorname{AllocErrorVal}(r)\quad \mathsf{SB}'\ =\ \mathsf{SB} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BytesFromSlice}(\mathsf{SB},\ \mathsf{data},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}')
\end{array}
$$

**(BytesAsView-Ok)**

$$
\begin{array}{l}
\operatorname{ByteSeqOf}(\mathsf{SB},\ v)\ =\ \operatorname{ByteSeqOf}(\mathsf{SB},\ \mathsf{self}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BytesAsView}(\mathsf{SB},\ \mathsf{self})\ \Downarrow \ v
\end{array}
$$

**(BytesToManaged-Ok)**

$$
\begin{array}{l}
r\ =\ v\quad \mathsf{BytesBuf}'\ =\ \mathsf{BytesBuf}[v\ \mapsto \ \operatorname{ByteSeqOf}(\mathsf{SB},\ \mathsf{self})]\quad \mathsf{SB}'\ =\ \langle \mathsf{StrBuf},\ \mathsf{BytesBuf}',\ \mathsf{BytesCap}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BytesToManaged}(\mathsf{SB},\ \mathsf{self},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}')
\end{array}
$$

**(BytesToManaged-Err)**

$$
\begin{array}{l}
\operatorname{AllocErrorVal}(r)\quad \mathsf{SB}'\ =\ \mathsf{SB} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BytesToManaged}(\mathsf{SB},\ \mathsf{self},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}')
\end{array}
$$

**(BytesView-Ok)**

$$
\begin{array}{l}
\operatorname{ByteSeqOf}(\mathsf{SB},\ v)\ =\ \operatorname{SliceBytes}(\mathsf{data}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BytesView}(\mathsf{SB},\ \mathsf{data})\ \Downarrow \ v
\end{array}
$$

**(BytesViewString-Ok)**

$$
\begin{array}{l}
\operatorname{ByteSeqOf}(\mathsf{SB},\ v)\ =\ \operatorname{ByteSeqOf}(\mathsf{SB},\ \mathsf{data}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BytesViewString}(\mathsf{SB},\ \mathsf{data})\ \Downarrow \ v
\end{array}
$$

**(BytesAsSlice-Ok)**

$$
\begin{array}{l}
\operatorname{SliceBytes}(s)\ =\ \operatorname{ByteSeqOf}(\mathsf{SB},\ \mathsf{self}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BytesAsSlice}(\mathsf{SB},\ \mathsf{self})\ \Downarrow \ s
\end{array}
$$

**(BytesAppend-Ok)**

$$
\begin{array}{l}
r\ =\ ()\quad \mathsf{BytesBuf}'\ =\ \mathsf{BytesBuf}[\mathsf{self}\ \mapsto \ \operatorname{ByteSeqOf}(\mathsf{SB},\ \mathsf{self})\ \mathbin{++} \ \operatorname{ByteSeqOf}(\mathsf{SB},\ \mathsf{data})]\quad \mathsf{SB}'\ =\ \langle \mathsf{StrBuf},\ \mathsf{BytesBuf}',\ \mathsf{BytesCap}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BytesAppend}(\mathsf{SB},\ \mathsf{self},\ \mathsf{data},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}')
\end{array}
$$

**(BytesAppend-Err)**

$$
\begin{array}{l}
\operatorname{AllocErrorVal}(r)\quad \mathsf{SB}'\ =\ \mathsf{SB} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BytesAppend}(\mathsf{SB},\ \mathsf{self},\ \mathsf{data},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}')
\end{array}
$$

**(BytesLength)**

$$
\begin{array}{l}
n\ =\ \operatorname{ByteLen}(\mathsf{SB},\ \mathsf{self}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BytesLength}(\mathsf{SB},\ \mathsf{self})\ \Downarrow \ n
\end{array}
$$

**(BytesIsEmpty)**

$$
\begin{array}{l}
b\ =\ (\operatorname{ByteLen}(\mathsf{SB},\ \mathsf{self})\ =\ 0) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{BytesIsEmpty}(\mathsf{SB},\ \mathsf{self})\ \Downarrow \ b
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BytesViewOf}(v_{\mathsf{managed}})\ =\ v_{\mathsf{view}}\ \Leftrightarrow  \\[0.16em]
\ v_{\mathsf{managed}}\ =\ \operatorname{ManagedBytes}(\mathsf{ptr},\ \mathsf{len},\ \mathsf{cap})\ \land  \\[0.16em]
\ v_{\mathsf{view}}\ =\ \operatorname{ViewBytes}(\mathsf{ptr},\ \mathsf{len})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BytesLength}(\operatorname{ViewBytes}(\_,\ \mathsf{len}))\ =\ \mathsf{len} \\[0.16em]
\operatorname{BytesLength}(\operatorname{ManagedBytes}(\_,\ \mathsf{len},\ \_))\ =\ \mathsf{len}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BytesViewFromSlice}(\operatorname{SliceVal}(\mathsf{ptr},\ \mathsf{len}))\ =\ \operatorname{ViewBytes}(\mathsf{ptr},\ \mathsf{len}) \\[0.16em]
\operatorname{BytesViewFromString}(\operatorname{ViewString}(\mathsf{ptr},\ \mathsf{len}))\ =\ \operatorname{ViewBytes}(\mathsf{ptr},\ \mathsf{len})
\end{array}
$$

### 13.7.6 Lowering

$$
\begin{array}{l}
\mathsf{BytesManagedFields}\ =\ [\langle \texttt{pointer},\ \operatorname{TypePtr}(\operatorname{TypePrim}(\texttt{"u8"}),\ \texttt{Valid})\rangle ,\ \langle \texttt{length},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ,\ \langle \texttt{capacity},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ] \\[0.16em]
\mathsf{BytesManagedOffsets}\ =\ [0,\ \mathsf{PtrSize},\ 2\ \times \ \mathsf{PtrSize}] \\[0.16em]
\operatorname{RecordLayout}(\mathsf{BytesManagedFields})\ =\ \langle 3\ \times \ \mathsf{PtrSize},\ \mathsf{PtrAlign},\ \mathsf{BytesManagedOffsets}\rangle 
\end{array}
$$

$$
\begin{array}{l}
\mathsf{BytesViewFields}\ =\ [\langle \texttt{pointer},\ \operatorname{TypePtr}(\operatorname{TypePerm}(\texttt{const},\ \operatorname{TypePrim}(\texttt{"u8"})),\ \texttt{Valid})\rangle ,\ \langle \texttt{length},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ] \\[0.16em]
\mathsf{BytesViewOffsets}\ =\ [0,\ \mathsf{PtrSize}] \\[0.16em]
\operatorname{RecordLayout}(\mathsf{BytesViewFields})\ =\ \langle 2\ \times \ \mathsf{PtrSize},\ \mathsf{PtrAlign},\ \mathsf{BytesViewOffsets}\rangle 
\end{array}
$$

**(Size-Bytes-Managed)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeBytes}(\texttt{@Managed}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ 3\ \times \ \mathsf{PtrSize}
\end{array}
$$

**(Align-Bytes-Managed)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeBytes}(\texttt{@Managed}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{PtrAlign}
\end{array}
$$

**(Layout-Bytes-Managed)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeBytes}(\texttt{@Managed}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \langle 3\ \times \ \mathsf{PtrSize},\ \mathsf{PtrAlign}\rangle 
\end{array}
$$

**(Size-Bytes-View)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeBytes}(\texttt{@View}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ 2\ \times \ \mathsf{PtrSize}
\end{array}
$$

**(Align-Bytes-View)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeBytes}(\texttt{@View}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{PtrAlign}
\end{array}
$$

**(Layout-Bytes-View)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeBytes}(\texttt{@View}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \langle 2\ \times \ \mathsf{PtrSize},\ \mathsf{PtrAlign}\rangle 
\end{array}
$$

**(Size-Bytes-Modal)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeBytes}(\bot )\quad \Gamma \ \vdash \ \operatorname{ModalLayout}(\texttt{bytes})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_,\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ \mathsf{size}
\end{array}
$$

**(Align-Bytes-Modal)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeBytes}(\bot )\quad \Gamma \ \vdash \ \operatorname{ModalLayout}(\texttt{bytes})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_,\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{align}
\end{array}
$$

$$
\operatorname{ValueBits}(\operatorname{TypeBytes}(\mathsf{st}),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ \operatorname{ValueType}(v)\ =\ \operatorname{TypeBytes}(\mathsf{st})\ \land \ \mid \mathsf{bits}\mid \ =\ \operatorname{sizeof}(\operatorname{TypeBytes}(\mathsf{st}))
$$

$$
\operatorname{DropManaged}(\operatorname{ManagedBytes}(\mathsf{ptr},\ \_,\ \mathsf{cap}),\ v_{\mathsf{heap}})\ \Leftrightarrow \ \operatorname{HeapDeallocRaw}(v_{\mathsf{heap}},\ \mathsf{ptr},\ \mathsf{cap})
$$

### 13.7.7 Diagnostics

This section introduces no additional diagnostics beyond the shared well-formedness, call typing, and allocation-result rules.
