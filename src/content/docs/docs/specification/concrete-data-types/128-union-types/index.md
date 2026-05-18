---
title: "12.8 Union Types"
description: "12.8 Union Types from 12. Concrete Data Types of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "concrete-data-types"
specSection: "128-union-types"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/concrete-data-types/">12. Concrete Data Types</a>
  <span>Concrete Data Types</span>
</div>

## 12.8 Union Types

### 12.8.1 Syntax

```text
union_type ::= non_perm_type ("|" non_perm_type)+
```

Union introduction is semantic: any expression whose type is a member of a union may be typed as that union.

### 12.8.2 Parsing

**(Parse-UnionTail-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseUnionTail}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-UnionTail-Cons)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|"})\quad \Gamma \ \vdash \ \operatorname{ParseNonPermType}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ t_{1})\quad \Gamma \ \vdash \ \operatorname{ParseUnionTail}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{ts}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseUnionTail}(P)\ \Downarrow \ (P_{2},\ [t_{1}]\ \mathbin{++} \ \mathsf{ts})
\end{array}
$$

### 12.8.3 AST Representation / Form

$$
\mathsf{TypeUnion}\ =\ \langle \mathsf{members}\rangle \ \mathsf{where}\ \mathsf{members}\ \in \ [\mathsf{Type}]
$$

$$
\begin{array}{l}
\operatorname{Members}(\operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}]))\ =\ [T_{1},\ \ldots ,\ T_{n}] \\[0.16em]
\operatorname{DistinctMembers}(U)\ =\ [T_{i}\ \in \ \operatorname{Members}(U)\ \mid \ \forall \ j\ <\ i.\ \lnot (\Gamma \ \vdash \ T_{i}\ \equiv \ T_{j})] \\[0.16em]
\operatorname{SetMembers}(U)\ =\ \{\ T\ \mid \ T\ \in \ \operatorname{DistinctMembers}(U)\ \}
\end{array}
$$

### 12.8.4 Static Semantics

**(WF-Union)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad n\ \ge \ 2\quad \forall \ i,\ \Gamma \ \vdash \ T_{i}\ \mathsf{wf} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}
\end{array}
$$

**(WF-Union-TooFew)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad n\ <\ 2\quad c\ =\ \operatorname{Code}(\mathsf{WF}-\mathsf{Union}-\mathsf{TooFew}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathsf{wf}\ \Uparrow \ c
\end{array}
$$

`WF-Union-TooFew` is AST/recovery/reference-model evidence. Source fixtures cover
valid unions and sourceable union diagnostics.

$$
\operatorname{Member}(T,\ U)\ \Leftrightarrow \ U\ =\ \operatorname{TypeUnion}([U_{1},\ \ldots ,\ U_{n}])\ \land \ \exists \ i.\ \Gamma \ \vdash \ T\ \equiv \ U_{i}
$$

**(Sub-Member-Union)**
Member(T, U)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ \mathrel{<:} \ U
\end{array}
$$

**(Sub-Union-Width)**

$$
\begin{array}{l}
U_{1}\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad U_{2}\ =\ \operatorname{TypeUnion}([U_{1}',\ \ldots ,\ U_{m}'])\quad \forall \ i,\ \operatorname{Member}(T_{i},\ U_{2}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ U_{1}\ \mathrel{<:} \ U_{2}
\end{array}
$$

**(T-Union-Intro)**

$$
\begin{array}{l}
\Gamma \ \vdash \ e\ :\ T\quad \operatorname{Member}(T,\ U) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ e\ :\ U
\end{array}
$$

**(Union-DirectAccess-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ U\quad \operatorname{StripPerm}(U)\ =\ \operatorname{TypeUnion}(\_)\quad c\ =\ \operatorname{Code}(\mathsf{Union}-\mathsf{DirectAccess}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{FieldAccess}(e,\ f)\ \Uparrow \ c
\end{array}
$$

Union matching and propagation are defined by §§16.8 and 17.5.

### 12.8.5 Dynamic Semantics

$$
\begin{array}{l}
\mathsf{UnionCaseJudg}\ =\ \{\operatorname{UnionCase}(v)\ =\ \langle T,\ v_{T}\rangle \} \\[0.16em]
\operatorname{UnionCase}(v)\ =\ \langle T,\ v_{T}\rangle \ \Leftrightarrow \ \exists \ U,\ \mathsf{bits}.\ \operatorname{ValueBits}(\operatorname{TypeUnion}(U),\ v)\ =\ \mathsf{bits}\ \land \ \operatorname{UnionBits}(U,\ T,\ v_{T})\ =\ \mathsf{bits}
\end{array}
$$

### 12.8.6 Lowering

$$
\begin{array}{l}
\operatorname{PathOrderKey}(p)\ =\ \langle \operatorname{Fold}(p),\ p\rangle  \\[0.16em]
\operatorname{BitsToUInt}(\mathsf{bits})\ =\ v\ \Leftrightarrow \ \operatorname{LEBytes}(v,\ \mid \mathsf{bits}\mid )\ =\ \mathsf{bits} \\[0.16em]
\mathsf{bits}_{1}\ \prec_{u} \ \mathsf{bits}_{2}\ \Leftrightarrow \ \exists \ v_{1},\ v_{2}.\ \operatorname{BitsToUInt}(\mathsf{bits}_{1})\ =\ v_{1}\ \land \ \operatorname{BitsToUInt}(\mathsf{bits}_{2})\ =\ v_{2}\ \land \ v_{1}\ <\ v_{2} \\[0.16em]
\operatorname{NicheOrder}(T)\ =\ \mathsf{sort}\_\{\prec_{u} \}(\operatorname{NicheSet}(T)) \\[0.16em]
\operatorname{NicheCount}(T)\ =\ \mid \operatorname{NicheSet}(T)\mid  \\[0.16em]
\operatorname{TagKey}(\texttt{prim})\ =\ 0 \\[0.16em]
\operatorname{TagKey}(\texttt{tuple})\ =\ 1 \\[0.16em]
\operatorname{TagKey}(\texttt{array})\ =\ 2 \\[0.16em]
\operatorname{TagKey}(\texttt{slice})\ =\ 3 \\[0.16em]
\operatorname{TagKey}(\texttt{func})\ =\ 4 \\[0.16em]
\operatorname{TagKey}(\texttt{path})\ =\ 5 \\[0.16em]
\operatorname{TagKey}(\texttt{modal\_state})\ =\ 6 \\[0.16em]
\operatorname{TagKey}(\texttt{string})\ =\ 7 \\[0.16em]
\operatorname{TagKey}(\texttt{bytes})\ =\ 8 \\[0.16em]
\operatorname{TagKey}(\texttt{dynamic})\ =\ 9 \\[0.16em]
\operatorname{TagKey}(\texttt{ptr})\ =\ 10 \\[0.16em]
\operatorname{TagKey}(\texttt{rawptr})\ =\ 11 \\[0.16em]
\operatorname{TagKey}(\texttt{union})\ =\ 12 \\[0.16em]
\operatorname{TagKey}(\texttt{perm})\ =\ 13 \\[0.16em]
\operatorname{TagKey}(\texttt{range})\ =\ 14
\end{array}
$$

$$
\begin{array}{l}
\operatorname{PermKey}(\texttt{const})\ =\ 0 \\[0.16em]
\operatorname{PermKey}(\texttt{unique})\ =\ 1 \\[0.16em]
\operatorname{PtrStateKey}(\bot )\ =\ 0 \\[0.16em]
\operatorname{PtrStateKey}(\texttt{Valid})\ =\ 1 \\[0.16em]
\operatorname{PtrStateKey}(\texttt{Null})\ =\ 2 \\[0.16em]
\operatorname{PtrStateKey}(\texttt{Expired})\ =\ 3 \\[0.16em]
\operatorname{QualKey}(\texttt{imm})\ =\ 0 \\[0.16em]
\operatorname{QualKey}(\texttt{mut})\ =\ 1 \\[0.16em]
\operatorname{ModeKey}(\bot )\ =\ 0 \\[0.16em]
\operatorname{ModeKey}(\texttt{move})\ =\ 1 \\[0.16em]
\operatorname{StateKey}(\texttt{View})\ =\ 0 \\[0.16em]
\operatorname{StateKey}(\texttt{Managed})\ =\ 1 \\[0.16em]
\operatorname{StateKey}(\bot )\ =\ 2
\end{array}
$$

$$
\begin{array}{l}
\operatorname{TypeKey}(\operatorname{TypePrim}(\mathsf{name}))\ =\ \langle \operatorname{TagKey}(\texttt{prim}),\ \mathsf{name}\rangle  \\[0.16em]
\operatorname{TypeKey}(\operatorname{TypeRange}(T))\ =\ \langle \operatorname{TagKey}(\texttt{range}),\ 0,\ \operatorname{TypeKey}(T)\rangle  \\[0.16em]
\operatorname{TypeKey}(\operatorname{TypeRangeInclusive}(T))\ =\ \langle \operatorname{TagKey}(\texttt{range}),\ 1,\ \operatorname{TypeKey}(T)\rangle  \\[0.16em]
\operatorname{TypeKey}(\operatorname{TypeRangeFrom}(T))\ =\ \langle \operatorname{TagKey}(\texttt{range}),\ 2,\ \operatorname{TypeKey}(T)\rangle  \\[0.16em]
\operatorname{TypeKey}(\operatorname{TypeRangeTo}(T))\ =\ \langle \operatorname{TagKey}(\texttt{range}),\ 3,\ \operatorname{TypeKey}(T)\rangle  \\[0.16em]
\operatorname{TypeKey}(\operatorname{TypeRangeToInclusive}(T))\ =\ \langle \operatorname{TagKey}(\texttt{range}),\ 4,\ \operatorname{TypeKey}(T)\rangle  \\[0.16em]
\operatorname{TypeKey}(\mathsf{TypeRangeFull})\ =\ \langle \operatorname{TagKey}(\texttt{range}),\ 5\rangle  \\[0.16em]
\operatorname{TypeKey}(\operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}]))\ =\ \langle \operatorname{TagKey}(\texttt{tuple}),\ n,\ \operatorname{TypeKey}(T_{1}),\ \ldots ,\ \operatorname{TypeKey}(T_{n})\rangle  \\[0.16em]
\operatorname{TypeKey}(\operatorname{TypeArray}(T,\ e))\ =\ \langle \operatorname{TagKey}(\texttt{array}),\ \operatorname{TypeKey}(T),\ \operatorname{ArrayLen}(e)\rangle  \\[0.16em]
\operatorname{TypeKey}(\operatorname{TypeSlice}(T))\ =\ \langle \operatorname{TagKey}(\texttt{slice}),\ \operatorname{TypeKey}(T)\rangle  \\[0.16em]
\operatorname{TypeKey}(\operatorname{TypeFunc}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ],\ R))\ =\ \langle \operatorname{TagKey}(\texttt{func}),\ n,\ \operatorname{ModeKey}(m_{1}),\ \operatorname{TypeKey}(T_{1}),\ \ldots ,\ \operatorname{ModeKey}(m_{n}),\ \operatorname{TypeKey}(T_{n}),\ \operatorname{TypeKey}(R)\rangle  \\[0.16em]
\operatorname{TypeKey}(\operatorname{TypePath}(p))\ =\ \langle \operatorname{TagKey}(\texttt{path}),\ \operatorname{PathOrderKey}(p)\rangle  \\[0.16em]
\operatorname{TypeKey}(\operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S))\ =\ \langle \operatorname{TagKey}(\texttt{modal\_state}),\ \operatorname{PathOrderKey}(\operatorname{ModalRefPath}(\mathsf{modal}_{\mathsf{ref}})),\ S\rangle  \\[0.16em]
\operatorname{TypeKey}(\operatorname{TypeString}(\mathsf{st}))\ =\ \langle \operatorname{TagKey}(\texttt{string}),\ \operatorname{StateKey}(\mathsf{st})\rangle  \\[0.16em]
\operatorname{TypeKey}(\operatorname{TypeBytes}(\mathsf{st}))\ =\ \langle \operatorname{TagKey}(\texttt{bytes}),\ \operatorname{StateKey}(\mathsf{st})\rangle  \\[0.16em]
\operatorname{TypeKey}(\operatorname{TypeDynamic}(p))\ =\ \langle \operatorname{TagKey}(\texttt{dynamic}),\ \operatorname{PathOrderKey}(p)\rangle  \\[0.16em]
\operatorname{TypeKey}(\operatorname{TypePtr}(T,\ s))\ =\ \langle \operatorname{TagKey}(\texttt{ptr}),\ \operatorname{PtrStateKey}(s),\ \operatorname{TypeKey}(T)\rangle  \\[0.16em]
\operatorname{TypeKey}(\operatorname{TypeRawPtr}(q,\ T))\ =\ \langle \operatorname{TagKey}(\texttt{rawptr}),\ \operatorname{QualKey}(q),\ \operatorname{TypeKey}(T)\rangle  \\[0.16em]
\operatorname{TypeKey}(\operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}]))\ =\ \langle \operatorname{TagKey}(\texttt{union}),\ \operatorname{Sort}([\operatorname{TypeKey}(T_{1}),\ \ldots ,\ \operatorname{TypeKey}(T_{n})])\rangle  \\[0.16em]
\operatorname{TypeKey}(\operatorname{TypePerm}(p,\ T))\ =\ \langle \operatorname{TagKey}(\texttt{perm}),\ \operatorname{PermKey}(p),\ \operatorname{TypeKey}(T)\rangle 
\end{array}
$$

$$
\begin{array}{l}
\mathsf{Key}\ =\ \{\ \operatorname{TypeKey}(T)\ \mid \ T\ \in \ \mathsf{Type}\ \} \\[0.16em]
\mathsf{KeyList}\ =\ \{\ [k_{1},\ \ldots ,\ k_{n}]\ \mid \ \forall \ i.\ k_{i}\ \in \ \mathsf{Key}\ \} \\[0.16em]
a\ \prec \_\{\mathsf{atom}\}\ b\ \Leftrightarrow \ (a,\ b\ \in \ \mathbb{N} \ \land \ a\ <\ b)\ \lor \ (a,\ b\ \in \ \mathsf{String}\ \land \ \operatorname{Utf8LexLess}(a,\ b))\ \lor \ (a,\ b\ \in \ \mathsf{Key}\ \land \ a\ \prec \_\{\mathsf{key}\}\ b)\ \lor \ (a,\ b\ \in \ \mathsf{KeyList}\ \land \ a\ \prec \_\{\mathsf{keylist}\}\ b) \\[0.16em]
\mathsf{LexLess}\_\{\prec \}(L_{1},\ L_{2})\ \Leftrightarrow \ (\exists \ k.\ 0\ \le \ k\ <\ \mid L_{1}\mid \ \land \ 0\ \le \ k\ <\ \mid L_{2}\mid \ \land \ (\forall \ i.\ 0\ \le \ i\ <\ k\ \Rightarrow \ L_{1}[i]\ =\ L_{2}[i])\ \land \ L_{1}[k]\ \prec \ L_{2}[k])\ \lor \ (\mid L_{1}\mid \ <\ \mid L_{2}\mid \ \land \ \forall \ i.\ 0\ \le \ i\ <\ \mid L_{1}\mid \ \Rightarrow \ L_{1}[i]\ =\ L_{2}[i]) \\[0.16em]
k_{1}\ \prec \_\{\mathsf{key}\}\ k_{2}\ \Leftrightarrow \ \mathsf{LexLess}\_\{\prec \_\{\mathsf{atom}\}\}(k_{1},\ k_{2}) \\[0.16em]
L_{1}\ \prec \_\{\mathsf{keylist}\}\ L_{2}\ \Leftrightarrow \ \mathsf{LexLess}\_\{\prec \_\{\mathsf{key}\}\}(L_{1},\ L_{2}) \\[0.16em]
\mathsf{Sorted}\_\{\prec \}(L)\ \Leftrightarrow \ \forall \ i,\ j.\ 0\ \le \ i\ <\ j\ <\ \mid L\mid \ \Rightarrow \ \lnot (L[j]\ \prec \ L[i]) \\[0.16em]
\operatorname{Sort}(L)\ =\ L'\ \Leftrightarrow \ \operatorname{Permutation}(L',\ L)\ \land \ \mathsf{Sorted}\_\{\prec \_\{\mathsf{key}\}\}(L') \\[0.16em]
T_{1}\ \prec \_\{\mathsf{type}\}\ T_{2}\ \Leftrightarrow \ \operatorname{TypeKey}(T_{1})\ \prec \_\{\mathsf{key}\}\ \operatorname{TypeKey}(T_{2})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{MemberList}(U)\ =\ \operatorname{Sort}(\operatorname{Members}(U)) \\[0.16em]
\operatorname{MemberIndex}(U,\ T)\ =\ i\ \Leftrightarrow \ \operatorname{MemberList}(U)[i]\ \equiv \ T \\[0.16em]
\operatorname{UnionDiscValue}(U,\ T)\ =\ i\ \Leftrightarrow \ \operatorname{MemberIndex}(U,\ T)\ =\ i \\[0.16em]
\operatorname{EmptyMember}(T)\ \Leftrightarrow \ T\ \equiv \ \operatorname{TypePrim}(\texttt{"()"}) \\[0.16em]
\operatorname{EmptyList}(U)\ =\ [\operatorname{MemberList}(U)[i]\ \mid \ 0\ \le \ i\ <\ \mid \operatorname{MemberList}(U)\mid \ \land \ \operatorname{EmptyMember}(\operatorname{MemberList}(U)[i])] \\[0.16em]
\operatorname{PayloadMember}(U)\ =\ T_{p}\ \Leftrightarrow \ \exists \ j.\ \operatorname{MemberList}(U)[j]\ \equiv \ T_{p}\ \land \ \operatorname{NicheCount}(T_{p})\ >\ 0\ \land \ (\forall \ i.\ 0\ \le \ i\ <\ \mid \operatorname{MemberList}(U)\mid \ \land \ i\ \ne \ j\ \Rightarrow \ \operatorname{EmptyMember}(\operatorname{MemberList}(U)[i]))\ \land \ \operatorname{NicheCount}(T_{p})\ \ge \ \mid \operatorname{MemberList}(U)\mid \ -\ 1 \\[0.16em]
\operatorname{NicheApplies}(U)\ \Leftrightarrow \ \exists \ T_{p}.\ \operatorname{PayloadMember}(U)\ =\ T_{p}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{UnionDiscType}(U)\ =\ \operatorname{DiscType}(k)\quad \mathsf{where}\ k\ =\ \mid \operatorname{MemberList}(U)\mid \ -\ 1 \\[0.16em]
\operatorname{PayloadSize}(U)\ =\ \mathsf{max}\_\{T\ \in \ \operatorname{MemberList}(U)\}(\operatorname{sizeof}(T)) \\[0.16em]
\operatorname{PayloadAlign}(U)\ =\ \mathsf{max}\_\{T\ \in \ \operatorname{MemberList}(U)\}(\operatorname{alignof}(T)) \\[0.16em]
\operatorname{UnionAlign}(U)\ =\ \operatorname{max}(\operatorname{alignof}(\operatorname{UnionDiscType}(U)),\ \operatorname{PayloadAlign}(U)) \\[0.16em]
\operatorname{UnionSize}(U)\ =\ \operatorname{AlignUp}(\operatorname{sizeof}(\operatorname{UnionDiscType}(U))\ +\ \operatorname{PayloadSize}(U),\ \operatorname{UnionAlign}(U)) \\[0.16em]
\mathsf{UnionLayoutJudg}\ =\ \{\mathsf{UnionLayout}\}
\end{array}
$$

**(Layout-Union-Niche)**

$$
\begin{array}{l}
\operatorname{NicheApplies}(U)\quad \operatorname{PayloadMember}(U)\ =\ T_{p}\quad \Gamma \ \vdash \ \operatorname{layout}(T_{p})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{UnionLayout}(U)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \bot ,\ \operatorname{layout}(T_{p})\rangle 
\end{array}
$$

**(Layout-Union-Tagged)**

$$
\begin{array}{l}
\lnot \ \operatorname{NicheApplies}(U)\quad \mathsf{size}\ =\ \operatorname{UnionSize}(U)\quad \mathsf{align}\ =\ \operatorname{UnionAlign}(U) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{UnionLayout}(U)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \operatorname{UnionDiscType}(U),\ \operatorname{PayloadSize}(U)\rangle 
\end{array}
$$

**(Size-Union)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad \operatorname{UnionLayout}(T)\ \Downarrow \ \langle \mathsf{size},\ \_,\ \_,\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ \mathsf{size}
\end{array}
$$

**(Align-Union)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad \operatorname{UnionLayout}(T)\ \Downarrow \ \langle \_,\ \mathsf{align},\ \_,\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{alignof}(T)\ =\ \mathsf{align}
\end{array}
$$

**(Layout-Union)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad \operatorname{UnionLayout}(T)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_,\ \_\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{layout}(T)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align}\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{UnionNicheBits}(U,\ T,\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ \operatorname{NicheApplies}(U)\ \land \ \operatorname{PayloadMember}(U)\ =\ T_{p}\ \land \ ((T\ \equiv \ T_{p}\ \land \ \operatorname{ValueBits}(T_{p},\ v)\ =\ \mathsf{bits}\ \land \ \mathsf{bits}\ \notin \ \operatorname{NicheSet}(T_{p}))\ \lor \ (\exists \ i.\ \operatorname{EmptyList}(U)[i]\ \equiv \ T\ \land \ v\ =\ ()\ \land \ \operatorname{NicheOrder}(T_{p})[i]\ =\ \mathsf{bits})) \\[0.16em]
\operatorname{PayloadBits}(U,\ T,\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ \operatorname{ValueBits}(T,\ v)\ =\ b\ \land \ \mid \mathsf{bits}\mid \ =\ \operatorname{PayloadSize}(U)\ \land \ \mathsf{bits}[0..\mid b\mid )\ =\ b \\[0.16em]
\operatorname{TaggedBits}(\mathsf{disc}_{\mathsf{bits}},\ \mathsf{payload}_{\mathsf{bits}},\ \mathsf{disc}_{\mathsf{size}},\ \mathsf{payload}_{\mathsf{size}},\ \mathsf{payload}_{\mathsf{align}},\ \mathsf{size})\ =\ \mathsf{bits}\ \Leftrightarrow \ \mid \mathsf{bits}\mid \ =\ \mathsf{size}\ \land \ \mathsf{payload}_{\mathsf{off}}\ =\ \operatorname{AlignUp}(\mathsf{disc}_{\mathsf{size}},\ \mathsf{payload}_{\mathsf{align}})\ \land \ \mathsf{bits}[0..\mathsf{disc}_{\mathsf{size}})\ =\ \mathsf{disc}_{\mathsf{bits}}\ \land \ \mathsf{bits}[\mathsf{payload}_{\mathsf{off}}..\mathsf{payload}_{\mathsf{off}}\ +\ \mathsf{payload}_{\mathsf{size}})\ =\ \mathsf{payload}_{\mathsf{bits}}
\end{array}
$$

**Informative.** TaggedBits constrains only the discriminant and payload ranges; bytes outside those ranges are unconstrained.

$$
\begin{array}{l}
\operatorname{UnionTaggedBits}(U,\ T,\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ \lnot \ \operatorname{NicheApplies}(U)\ \land \ \operatorname{UnionDiscType}(U)\ =\ D\ \land \ \operatorname{UnionDiscValue}(U,\ T)\ =\ d\ \land \ \operatorname{ValueBits}(D,\ d)\ =\ \mathsf{disc}_{\mathsf{bits}}\ \land \ \operatorname{PayloadBits}(U,\ T,\ v)\ =\ \mathsf{payload}_{\mathsf{bits}}\ \land \ \operatorname{TaggedBits}(\mathsf{disc}_{\mathsf{bits}},\ \mathsf{payload}_{\mathsf{bits}},\ \operatorname{sizeof}(D),\ \operatorname{PayloadSize}(U),\ \operatorname{PayloadAlign}(U),\ \operatorname{UnionSize}(U))\ =\ \mathsf{bits} \\[0.16em]
\operatorname{UnionBits}(U,\ T,\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ \operatorname{UnionNicheBits}(U,\ T,\ v)\ =\ \mathsf{bits}\ \lor \ \operatorname{UnionTaggedBits}(U,\ T,\ v)\ =\ \mathsf{bits} \\[0.16em]
\operatorname{ValueBits}(\operatorname{TypeUnion}(U),\ v)\ =\ \mathsf{bits}\ \Leftrightarrow \ \exists \ T.\ \operatorname{Member}(T,\ \operatorname{TypeUnion}(U))\ \land \ \operatorname{UnionBits}(U,\ T,\ v)\ =\ \mathsf{bits} \\[0.16em]
\operatorname{ValueType}(v)\ =\ U\ \Leftrightarrow \ \exists \ T.\ \operatorname{ValueType}(v)\ =\ T\ \land \ \operatorname{Member}(T,\ U)
\end{array}
$$

### 12.8.7 Diagnostics

Diagnostics are defined for unions with fewer than two member types and for direct field access on union values without prior refinement or pattern matching. Exhaustiveness diagnostics for union `if ... is { ... }` case analysis are defined by §17.6.
