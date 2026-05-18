---
title: "13.6 String Types"
description: "13.6 String Types from 13. Modal and Special Types of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "modal-and-special-types"
specSection: "136-string-types"
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

## 13.6 String Types

### 13.6.1 Syntax

```text
string_type      ::= "string" string_state_opt
string_state_opt ::= epsilon | "@" "Managed" | "@" "View"
```

### 13.6.2 Parsing

**(Parse-String-Type)**

$$
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \operatorname{Lexeme}(\operatorname{Tok}(P))\ =\ \texttt{string}\quad \Gamma \ \vdash \ \operatorname{ParseStringState}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{st}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseNonPermType}(P)\ \Downarrow \ (P_{1},\ \operatorname{TypeString}(\mathsf{st}_{\mathsf{opt}}))
\end{array}
$$

**String State.**

**(Parse-StringState-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"@"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStringState}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-StringState-Managed)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"@"})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(P)))\quad \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(P)))\ =\ \texttt{Managed} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStringState}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P)),\ \texttt{Managed})
\end{array}
$$

**(Parse-StringState-View)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"@"})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(P)))\quad \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(P)))\ =\ \texttt{View} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStringState}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P)),\ \texttt{View})
\end{array}
$$

### 13.6.3 AST Representation / Form

$$
\begin{array}{l}
\operatorname{TypeString}(\mathsf{state}_{\mathsf{opt}})\quad \mathsf{where}\ \mathsf{state}_{\mathsf{opt}}\ \in \ \{\bot ,\ \texttt{View},\ \texttt{Managed}\} \\[0.16em]
\operatorname{States}(\texttt{string})\ =\ \{\ \texttt{@Managed},\ \texttt{@View}\ \}
\end{array}
$$

StringBuiltinTable =
{

$$
\begin{array}{l}
\ \langle \texttt{string::from},\ [\langle \bot ,\ \texttt{source},\ \operatorname{TypeString}(\texttt{@View})\rangle ,\ \langle \bot ,\ \texttt{heap},\ \operatorname{TypeDynamic}(\texttt{HeapAllocator})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeString}(\texttt{@Managed})),\ \operatorname{TypePath}([\texttt{"AllocationError"}])])\rangle , \\[0.16em]
\ \langle \texttt{string::as\_view},\ [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeString}(\texttt{@Managed}))\rangle ],\ \operatorname{TypeString}(\texttt{@View})\rangle , \\[0.16em]
\ \langle \texttt{string::slice},\ [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeString}(\texttt{@View}))\rangle ,\ \langle \bot ,\ \texttt{start},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ,\ \langle \bot ,\ \texttt{end},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ],\ \operatorname{TypeString}(\texttt{@View})\rangle , \\[0.16em]
\ \langle \texttt{string::to\_managed},\ [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeString}(\texttt{@View}))\rangle ,\ \langle \bot ,\ \texttt{heap},\ \operatorname{TypeDynamic}(\texttt{HeapAllocator})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeString}(\texttt{@Managed})),\ \operatorname{TypePath}([\texttt{"AllocationError"}])])\rangle , \\[0.16em]
\ \langle \texttt{string::clone\_with},\ [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeString}(\texttt{@Managed}))\rangle ,\ \langle \bot ,\ \texttt{heap},\ \operatorname{TypeDynamic}(\texttt{HeapAllocator})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeString}(\texttt{@Managed})),\ \operatorname{TypePath}([\texttt{"AllocationError"}])])\rangle , \\[0.16em]
\ \langle \texttt{string::append},\ [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeString}(\texttt{@Managed}))\rangle ,\ \langle \bot ,\ \texttt{data},\ \operatorname{TypeString}(\texttt{@View})\rangle ,\ \langle \bot ,\ \texttt{heap},\ \operatorname{TypeDynamic}(\texttt{HeapAllocator})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePrim}(\texttt{"()"}),\ \operatorname{TypePath}([\texttt{"AllocationError"}])])\rangle , \\[0.16em]
\ \langle \texttt{string::length},\ [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeString}(\texttt{@View}))\rangle ],\ \operatorname{TypePrim}(\texttt{"usize"})\rangle , \\[0.16em]
\ \langle \texttt{string::is\_empty},\ [\langle \bot ,\ \texttt{self},\ \operatorname{TypePerm}(\texttt{const},\ \operatorname{TypeString}(\texttt{@View}))\rangle ],\ \operatorname{TypePrim}(\texttt{"bool"})\rangle  \\[0.16em]
\}
\end{array}
$$

$$
\operatorname{StringBuiltinSig}(\mathsf{method})\ =\ \langle \mathsf{params},\ \mathsf{ret}\rangle \ \Leftrightarrow \ \langle \mathsf{method},\ \mathsf{params},\ \mathsf{ret}\rangle \ \in \ \mathsf{StringBuiltinTable}
$$

### 13.6.4 Static Semantics

**(WF-String)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeString}(\mathsf{state}_{\mathsf{opt}})\quad \mathsf{state}_{\mathsf{opt}}\ \in \ \{\bot ,\ \texttt{View},\ \texttt{Managed}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}
\end{array}
$$

$$
\begin{array}{l}
S\ \in \ \{\texttt{@Managed},\ \texttt{@View}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{string}@S\ \mathrel{<:} \ \mathsf{string}
\end{array}
$$

The built-in string operations are typed by `StringBuiltinSig`. Calls to those operations use the ordinary call and method-call rules of Chapter 16.

### 13.6.5 Dynamic Semantics

$$
\operatorname{StringLiteralVal}(\mathsf{lit})\ =\ v\ \Leftrightarrow \ \operatorname{LiteralValue}(\mathsf{lit},\ \operatorname{TypeString}(\texttt{@View}))\ =\ v
$$

$$
\begin{array}{l}
\mathsf{ByteSeq}\ =\ \operatorname{List}(\texttt{u8}) \\[0.16em]
\mathsf{SB}\ =\ \langle \mathsf{StrBuf},\ \mathsf{BytesBuf},\ \mathsf{BytesCap}\rangle  \\[0.16em]
\mathsf{StrBuf}\ :\ \texttt{string@Managed}\ \rightharpoonup \ \mathsf{ByteSeq} \\[0.16em]
\mathsf{BytesBuf}\ :\ \texttt{bytes@Managed}\ \rightharpoonup \ \mathsf{ByteSeq} \\[0.16em]
\mathsf{BytesCap}\ :\ \texttt{bytes@Managed}\ \rightharpoonup \ \texttt{usize}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{ViewBytes}\ :\ (\texttt{string@View}\ \cup \ \texttt{bytes@View})\ \to \ \mathsf{ByteSeq} \\[0.16em]
\operatorname{ByteSeqOf}(\mathsf{SB},\ v)\ = \\[0.16em]
\ \operatorname{StrBuf}(v)\quad \mathsf{if}\ v:\texttt{string@Managed} \\[0.16em]
\ \operatorname{BytesBuf}(v)\ \mathsf{if}\ v:\texttt{bytes@Managed} \\[0.16em]
\ \operatorname{ViewBytes}(v)\ \mathsf{if}\ v:\texttt{string@View}\ \mathsf{or}\ v:\texttt{bytes@View} \\[0.16em]
\operatorname{ByteLen}(\mathsf{SB},\ v)\ =\ \mid \operatorname{ByteSeqOf}(\mathsf{SB},\ v)\mid 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ValueType}(v)\ =\ \operatorname{TypeString}(\texttt{@View})\ \Leftrightarrow \ v\ \in \ \texttt{string@View} \\[0.16em]
\operatorname{ValueType}(v)\ =\ \operatorname{TypeString}(\texttt{@Managed})\ \Leftrightarrow \ v\ \in \ \texttt{string@Managed} \\[0.16em]
\operatorname{ValueType}(v)\ =\ \operatorname{TypeString}(\bot )\ \Leftrightarrow \ \operatorname{ValueType}(v)\ =\ \operatorname{TypeString}(\texttt{@View})\ \lor \ \operatorname{ValueType}(v)\ =\ \operatorname{TypeString}(\texttt{@Managed})
\end{array}
$$

$$
\begin{array}{l}
\mathsf{StringBytesJudg}_{\mathsf{string}}\ =\ \{ \\[0.16em]
\ \operatorname{StringFrom}(\mathsf{SB},\ \mathsf{source},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}'), \\[0.16em]
\ \operatorname{StringAsView}(\mathsf{SB},\ \mathsf{self})\ \Downarrow \ v, \\[0.16em]
\ \operatorname{StringSlice}(\mathsf{SB},\ \mathsf{self},\ \mathsf{start},\ \mathsf{end})\ \Downarrow \ v, \\[0.16em]
\ \operatorname{StringToManaged}(\mathsf{SB},\ \mathsf{self},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}'), \\[0.16em]
\ \operatorname{StringCloneWith}(\mathsf{SB},\ \mathsf{self},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}'), \\[0.16em]
\ \operatorname{StringAppend}(\mathsf{SB},\ \mathsf{self},\ \mathsf{data},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}'), \\[0.16em]
\ \operatorname{StringLength}(\mathsf{SB},\ \mathsf{self})\ \Downarrow \ n, \\[0.16em]
\ \operatorname{StringIsEmpty}(\mathsf{SB},\ \mathsf{self})\ \Downarrow \ b \\[0.16em]
\}
\end{array}
$$

**String Literal Storage.**
For any string literal `lit`, evaluation MUST allocate `StringBytes(lit)` in static, read-only storage. The resulting `string@View` value MUST reference that storage and MUST have length `|StringBytes(lit)|`. The backing storage MUST have static duration and MUST NOT be deallocated.

**(StringFrom-Ok)**

$$
\begin{array}{l}
r\ =\ v\quad \mathsf{SB}'\ =\ \langle \mathsf{StrBuf}[v\ \mapsto \ \operatorname{ByteSeqOf}(\mathsf{SB},\ \mathsf{source})],\ \mathsf{BytesBuf},\ \mathsf{BytesCap}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{StringFrom}(\mathsf{SB},\ \mathsf{source},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}')
\end{array}
$$

**(StringFrom-Err)**

$$
\begin{array}{l}
\operatorname{AllocErrorVal}(r)\quad \mathsf{SB}'\ =\ \mathsf{SB} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{StringFrom}(\mathsf{SB},\ \mathsf{source},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}')
\end{array}
$$

**(StringAsView-Ok)**

$$
\begin{array}{l}
\operatorname{ByteSeqOf}(\mathsf{SB},\ v)\ =\ \operatorname{ByteSeqOf}(\mathsf{SB},\ \mathsf{self}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{StringAsView}(\mathsf{SB},\ \mathsf{self})\ \Downarrow \ v
\end{array}
$$

**(StringSlice-Ok)**

$$
\begin{array}{l}
0\ \le \ \mathsf{start}\ \le \ \mathsf{end}\ \le \ \operatorname{ByteLen}(\mathsf{SB},\ \mathsf{self})\quad \mathsf{start}\ \mathsf{and}\ \mathsf{end}\ \mathsf{are}\ \mathsf{valid}\ \mathsf{UTF}-8\ \mathsf{byte}\ \mathsf{boundaries}\ \mathsf{of}\ \operatorname{ByteSeqOf}(\mathsf{SB},\ \mathsf{self})\quad \operatorname{ByteSeqOf}(\mathsf{SB},\ v)\ =\ \operatorname{ByteSeqOf}(\mathsf{SB},\ \mathsf{self})[\mathsf{start}..\mathsf{end}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{StringSlice}(\mathsf{SB},\ \mathsf{self},\ \mathsf{start},\ \mathsf{end})\ \Downarrow \ v
\end{array}
$$

**(StringToManaged-Ok)**

$$
\begin{array}{l}
r\ =\ v\quad \mathsf{SB}'\ =\ \langle \mathsf{StrBuf}[v\ \mapsto \ \operatorname{ByteSeqOf}(\mathsf{SB},\ \mathsf{self})],\ \mathsf{BytesBuf},\ \mathsf{BytesCap}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{StringToManaged}(\mathsf{SB},\ \mathsf{self},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}')
\end{array}
$$

**(StringToManaged-Err)**

$$
\begin{array}{l}
\operatorname{AllocErrorVal}(r)\quad \mathsf{SB}'\ =\ \mathsf{SB} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{StringToManaged}(\mathsf{SB},\ \mathsf{self},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}')
\end{array}
$$

**(StringCloneWith-Ok)**

$$
\begin{array}{l}
r\ =\ v\quad \mathsf{SB}'\ =\ \langle \mathsf{StrBuf}[v\ \mapsto \ \operatorname{ByteSeqOf}(\mathsf{SB},\ \mathsf{self})],\ \mathsf{BytesBuf},\ \mathsf{BytesCap}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{StringCloneWith}(\mathsf{SB},\ \mathsf{self},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}')
\end{array}
$$

**(StringCloneWith-Err)**

$$
\begin{array}{l}
\operatorname{AllocErrorVal}(r)\quad \mathsf{SB}'\ =\ \mathsf{SB} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{StringCloneWith}(\mathsf{SB},\ \mathsf{self},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}')
\end{array}
$$

**(StringAppend-Ok)**

$$
\begin{array}{l}
r\ =\ ()\quad \mathsf{StrBuf}'\ =\ \mathsf{StrBuf}[\mathsf{self}\ \mapsto \ \operatorname{ByteSeqOf}(\mathsf{SB},\ \mathsf{self})\ \mathbin{++} \ \operatorname{ByteSeqOf}(\mathsf{SB},\ \mathsf{data})]\quad \mathsf{SB}'\ =\ \langle \mathsf{StrBuf}',\ \mathsf{BytesBuf},\ \mathsf{BytesCap}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{StringAppend}(\mathsf{SB},\ \mathsf{self},\ \mathsf{data},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}')
\end{array}
$$

**(StringAppend-Err)**

$$
\begin{array}{l}
\operatorname{AllocErrorVal}(r)\quad \mathsf{SB}'\ =\ \mathsf{SB} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{StringAppend}(\mathsf{SB},\ \mathsf{self},\ \mathsf{data},\ \mathsf{heap})\ \Downarrow \ (r,\ \mathsf{SB}')
\end{array}
$$

**(StringLength)**

$$
\begin{array}{l}
n\ =\ \operatorname{ByteLen}(\mathsf{SB},\ \mathsf{self}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{StringLength}(\mathsf{SB},\ \mathsf{self})\ \Downarrow \ n
\end{array}
$$

**(StringIsEmpty)**

$$
\begin{array}{l}
b\ =\ (\operatorname{ByteLen}(\mathsf{SB},\ \mathsf{self})\ =\ 0) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{StringIsEmpty}(\mathsf{SB},\ \mathsf{self})\ \Downarrow \ b
\end{array}
$$

$$
\begin{array}{l}
\operatorname{StringViewOf}(v_{\mathsf{managed}})\ =\ v_{\mathsf{view}}\ \Leftrightarrow  \\[0.16em]
\ v_{\mathsf{managed}}\ =\ \operatorname{ManagedString}(\mathsf{ptr},\ \mathsf{len},\ \mathsf{cap})\ \land  \\[0.16em]
\ v_{\mathsf{view}}\ =\ \operatorname{ViewString}(\mathsf{ptr},\ \mathsf{len})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{StringLength}(\operatorname{ViewString}(\_,\ \mathsf{len}))\ =\ \mathsf{len} \\[0.16em]
\operatorname{StringLength}(\operatorname{ManagedString}(\_,\ \mathsf{len},\ \_))\ =\ \mathsf{len}
\end{array}
$$

### 13.6.6 Lowering

$$
\begin{array}{l}
\mathsf{StringManagedFields}\ =\ [\langle \texttt{pointer},\ \operatorname{TypePtr}(\operatorname{TypePrim}(\texttt{"u8"}),\ \texttt{Valid})\rangle ,\ \langle \texttt{length},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ,\ \langle \texttt{capacity},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ] \\[0.16em]
\mathsf{StringManagedOffsets}\ =\ [0,\ \mathsf{PtrSize},\ 2\ \times \ \mathsf{PtrSize}] \\[0.16em]
\operatorname{RecordLayout}(\mathsf{StringManagedFields})\ =\ \langle 3\ \times \ \mathsf{PtrSize},\ \mathsf{PtrAlign},\ \mathsf{StringManagedOffsets}\rangle 
\end{array}
$$

$$
\begin{array}{l}
\mathsf{StringViewFields}\ =\ [\langle \texttt{pointer},\ \operatorname{TypePtr}(\operatorname{TypePerm}(\texttt{const},\ \operatorname{TypePrim}(\texttt{"u8"})),\ \texttt{Valid})\rangle ,\ \langle \texttt{length},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ] \\[0.16em]
\mathsf{StringViewOffsets}\ =\ [0,\ \mathsf{PtrSize}] \\[0.16em]
\operatorname{RecordLayout}(\mathsf{StringViewFields})\ =\ \langle 2\ \times \ \mathsf{PtrSize},\ \mathsf{PtrAlign},\ \mathsf{StringViewOffsets}\rangle 
\end{array}
$$

**(Size-String-Managed)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeString}(\texttt{@Managed}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ 3\ \times \ \mathsf{PtrSize}
\end{array}
$$

**(Align-String-Managed)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeString}(\texttt{@Managed}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{PtrAlign}
\end{array}
$$

**(Layout-String-Managed)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeString}(\texttt{@Managed}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \langle 3\ \times \ \mathsf{PtrSize},\ \mathsf{PtrAlign}\rangle 
\end{array}
$$

**(Size-String-View)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeString}(\texttt{@View}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ 2\ \times \ \mathsf{PtrSize}
\end{array}
$$

**(Align-String-View)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeString}(\texttt{@View}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{PtrAlign}
\end{array}
$$

**(Layout-String-View)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeString}(\texttt{@View}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \langle 2\ \times \ \mathsf{PtrSize},\ \mathsf{PtrAlign}\rangle 
\end{array}
$$

**(Size-String-Modal)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeString}(\bot )\quad \Gamma \ \vdash \ \operatorname{ModalLayout}(\texttt{string})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_,\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ \mathsf{size}
\end{array}
$$

**(Align-String-Modal)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeString}(\bot )\quad \Gamma \ \vdash \ \operatorname{ModalLayout}(\texttt{string})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_,\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{align}
\end{array}
$$

$$
\operatorname{ValueBits}(\operatorname{TypeString}(\mathsf{st}),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ \operatorname{ValueType}(v)\ =\ \operatorname{TypeString}(\mathsf{st})\ \land \ \mid \mathsf{bits}\mid \ =\ \operatorname{sizeof}(\operatorname{TypeString}(\mathsf{st}))
$$

$$
\operatorname{DropManaged}(\operatorname{ManagedString}(\mathsf{ptr},\ \_,\ \mathsf{cap}),\ v_{\mathsf{heap}})\ \Leftrightarrow \ \operatorname{HeapDeallocRaw}(v_{\mathsf{heap}},\ \mathsf{ptr},\ \mathsf{cap})
$$

### 13.6.7 Diagnostics

This section introduces no additional diagnostics beyond the shared well-formedness, call typing, and allocation-result rules.
