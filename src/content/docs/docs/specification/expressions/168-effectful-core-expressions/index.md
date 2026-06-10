---
title: "16.8 Effectful Core Expressions"
description: "16.8 Effectful Core Expressions from 16. Expressions of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "expressions"
specSection: "168-effectful-core-expressions"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/expressions/">16. Expressions</a>
  <span>Expressions</span>
</div>

## 16.8 Effectful Core Expressions

### 16.8.1 Syntax

```text
unsafe_expr     ::= "unsafe" block_expr
address_of_expr ::= "&" place_expr
move_expr       ::= "move" place_expr
copy_expr       ::= "copy" unary_expr
deref_expr      ::= "*" unary_expr
alloc_expr      ::= "^" expression
propagate_expr  ::= postfix_expr "?"
```

After name resolution, `Binary("^", Identifier(r), e)` MAY be rewritten to `AllocExpr(r, e)` when `r` is a region alias.

### 16.8.2 Parsing

**(Parse-Unary-Deref)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"*"})\quad \Gamma \ \vdash \ \operatorname{ParseUnary}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseUnary}(P)\ \Downarrow \ (P_{1},\ \operatorname{Deref}(e))
\end{array}
$$

**(Parse-Unary-AddressOf)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"\&"})\quad \Gamma \ \vdash \ \operatorname{ParsePlace}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ p) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseUnary}(P)\ \Downarrow \ (P_{1},\ \operatorname{AddressOf}(p))
\end{array}
$$

**(Parse-Unary-Move)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{move})\quad \Gamma \ \vdash \ \operatorname{ParsePlace}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ p) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseUnary}(P)\ \Downarrow \ (P_{1},\ \operatorname{MoveExpr}(p))
\end{array}
$$

**(Parse-Unary-Copy)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{copy})\quad \Gamma \ \vdash \ \operatorname{ParseUnary}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseUnary}(P)\ \Downarrow \ (P_{1},\ \operatorname{CopyExpr}(e))
\end{array}
$$

**(Postfix-Propagate)**
IsOp(Tok(P), "?")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PostfixStep}(P,\ e)\ \Downarrow \ (\operatorname{Advance}(P),\ \operatorname{Propagate}(e))
\end{array}
$$

**(Parse-Alloc-Implicit)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"\^{}"})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (P_{1},\ \operatorname{AllocExpr}(\bot ,\ e))
\end{array}
$$

**(Parse-Unsafe-Expr)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{unsafe})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ b) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (P_{1},\ \operatorname{UnsafeBlockExpr}(b))
\end{array}
$$

### 16.8.3 AST Representation / Form

$$
\mathsf{Expr}\ =\ \operatorname{UnsafeBlockExpr}(\mathsf{body})\ \mid \ \operatorname{MoveExpr}(\mathsf{place})\ \mid \ \operatorname{CopyExpr}(\mathsf{expr})\ \mid \ \operatorname{AddressOf}(\mathsf{place})\ \mid \ \operatorname{Deref}(\mathsf{expr})\ \mid \ \operatorname{AllocExpr}(\mathsf{region}_{\mathsf{opt}},\ \mathsf{expr})\ \mid \ \operatorname{Propagate}(\mathsf{expr})\ \mid \ \ldots
$$

ResolveExpr-Alloc-Explicit-ByAlias rewrites:

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveValueName}(r)\ \Downarrow \ \mathsf{ent}\quad \operatorname{RegionAlias}(\mathsf{ent})\quad \Gamma \ \vdash \ \operatorname{ResolveExpr}(e)\ \Downarrow \ e' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveExpr}(\operatorname{Binary}(\texttt{"\^{}"},\ \operatorname{Identifier}(r),\ e))\ \Downarrow \ \operatorname{AllocExpr}(r,\ e')
\end{array}
$$

### 16.8.4 Static Semantics

$$
\begin{array}{l}
\operatorname{HasLayoutPacked}(D)\ \Leftrightarrow \ \texttt{layout(packed)}\ \mathsf{appears}\ \mathsf{in}\ D.\mathsf{attrs}_{\mathsf{opt}} \\[0.16em]
\operatorname{PackedField}(p)\ \Leftrightarrow \ p\ =\ \operatorname{FieldAccess}(\mathsf{base},\ f)\ \land \ \operatorname{StripPerm}(\operatorname{ExprType}(\mathsf{base}))\ =\ \operatorname{TypePath}(\mathsf{path})\ \land \ \operatorname{RecordDecl}(\mathsf{path})\ =\ R\ \land \ \operatorname{HasLayoutPacked}(R) \\[0.16em]
\operatorname{AddrOfOk}(p)\ \Leftrightarrow \ \operatorname{IsPlace}(p)\ \land \ (p\ =\ \operatorname{IndexAccess}(\_,\ \mathsf{idx})\ \Rightarrow \ \Gamma ;\ R;\ L\ \vdash \ \mathsf{idx}\ :\ T_{i}\ \land \ \operatorname{StripPerm}(T_{i})\ =\ \operatorname{TypePrim}(\texttt{usize}))\ \land \ (\operatorname{PackedField}(p)\ \Rightarrow \ \operatorname{UnsafeSpan}(\operatorname{span}(p)))
\end{array}
$$

**(T-Unsafe-Expr)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ b\ :\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{UnsafeBlockExpr}(b)\ :\ T
\end{array}
$$

**(Chk-Unsafe-Expr)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ b\ \Leftarrow \ T\ \dashv \ \emptyset \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{UnsafeBlockExpr}(b)\ \Leftarrow \ T\ \dashv \ \emptyset
\end{array}
$$

**(T-AddrOf)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ p\ :\mathsf{place}\ T\quad \operatorname{AddrOfOk}(p) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{AddressOf}(p)\ :\ \operatorname{TypePtr}(T,\ \texttt{Valid})
\end{array}
$$

**(T-Deref-Ptr)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypePtr}(T,\ \texttt{Valid})\quad \operatorname{BitcopyType}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Deref}(e)\ :\ T
\end{array}
$$

**(T-Deref-Raw)**

$$
\begin{array}{l}
\operatorname{UnsafeSpan}(\operatorname{span}(\operatorname{Deref}(e)))\quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ \operatorname{TypeRawPtr}(q,\ T)\quad \operatorname{BitcopyType}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Deref}(e)\ :\ T
\end{array}
$$

**(P-Deref-Ptr)**, **(P-Deref-Raw-Imm)**, and **(P-Deref-Raw-Mut)** define place typing for safe and raw dereference.

**(T-Move)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ p\ :\mathsf{place}\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{MoveExpr}(p)\ :\ T
\end{array}
$$

**(T-Copy)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T\quad \operatorname{BitcopyType}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{CopyExpr}(e)\ :\ T
\end{array}
$$

**(T-Alloc-Explicit)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T\quad \Gamma ;\ R;\ L\ \vdash \ \operatorname{Identifier}(r)\ :\ T_{r}\quad \operatorname{RegionActiveType}(T_{r}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{AllocExpr}(r,\ e)\ :\ T
\end{array}
$$

**(T-Alloc-Implicit)**

$$
\begin{array}{l}
\operatorname{InnermostActiveRegion}(\Gamma )\ =\ r\quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{AllocExpr}(\bot ,\ e)\ :\ T
\end{array}
$$

$$
\operatorname{SuccessMember}(R,\ U)\ =\ T_{s}\ \Leftrightarrow \ U\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\ \land \ \lnot (\Gamma \ \vdash \ T_{s}\ \mathrel{<:} \ R)\ \land \ \forall \ i\ \ne \ s.\ \Gamma \ \vdash \ T_{i}\ \mathrel{<:} \ R
$$

**(T-Propagate-Outcome)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \bot \quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ U\quad \operatorname{OutcomeSig}(U)\ =\ \langle T_{s},\ E_{s}\rangle \quad \operatorname{OutcomeSig}(R)\ =\ \langle T_{r},\ E_{r}\rangle \quad \Gamma \ \vdash \ E_{s}\ \mathrel{<:} \ E_{r} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Propagate}(e)\ :\ T_{s}
\end{array}
$$

**(T-Propagate)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \bot \quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ U\quad \operatorname{SuccessMember}(R,\ U)\ =\ T_{s} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Propagate}(e)\ :\ T_{s}
\end{array}
$$

$$
\operatorname{SuccessMemberAsync}(E,\ U)\ =\ T_{s}\ \Leftrightarrow \ U\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\ \land \ \lnot (\Gamma \ \vdash \ T_{s}\ \mathrel{<:} \ E)\ \land \ \forall \ i\ \ne \ s.\ \Gamma \ \vdash \ T_{i}\ \mathrel{<:} \ E
$$

**(T-Async-Try-Outcome)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle \quad E\ \ne \ \operatorname{TypePrim}(\texttt{"!"})\quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ U\quad \operatorname{OutcomeSig}(U)\ =\ \langle T_{s},\ E_{s}\rangle \quad \Gamma \ \vdash \ E_{s}\ \mathrel{<:} \ E \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Propagate}(e)\ :\ T_{s}
\end{array}
$$

**(T-Async-Try)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle \quad E\ \ne \ \operatorname{TypePrim}(\texttt{"!"})\quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ U\quad \operatorname{SuccessMemberAsync}(E,\ U)\ =\ T_{s} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Propagate}(e)\ :\ T_{s}
\end{array}
$$

**(Async-Try-Infallible-Err)**

$$
\begin{array}{l}
\operatorname{AsyncSig}(R)\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle \quad E\ =\ \operatorname{TypePrim}(\texttt{"!"})\quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ U\quad c\ =\ \operatorname{Code}(\mathsf{Async}-\mathsf{Try}-\mathsf{Infallible}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Propagate}(e)\ \Uparrow \ c
\end{array}
$$

### 16.8.5 Dynamic Semantics

**(EvalSigma-UnsafeBlock)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalBlockSigma}(b,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{UnsafeBlockExpr}(b),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')
\end{array}
$$

**(EvalSigma-AddressOf)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{AddrOfSigma}(p,\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{addr}),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{AddressOf}(p),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{Ptr}@\operatorname{Valid}(\mathsf{addr})),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Deref)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{ptr}}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{ReadPtrSigma}(v_{\mathsf{ptr}},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Deref}(e),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Move)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MovePlaceSigma}(p,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{MoveExpr}(p),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Copy)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad \operatorname{CopyObject}(\operatorname{ExprType}(e),\ v,\ \sigma_{1} )\ \Downarrow \ (v_{\mathsf{copy}},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{CopyExpr}(e),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{copy}}),\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Copy-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{CopyExpr}(e),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Alloc-Implicit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad \operatorname{ActiveTarget}(\sigma_{1} )\ =\ r\quad \operatorname{RegionAlloc}(\sigma_{1} ,\ r,\ v)\ \Downarrow \ (\sigma_{2} ,\ v') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{AllocExpr}(\bot ,\ e),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Alloc-Implicit-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{AllocExpr}(\bot ,\ e),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Alloc-Explicit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad \operatorname{LookupVal}(\sigma_{1} ,\ r)\ =\ v_{r}\quad \operatorname{RegionHandleOf}(v_{r})\ =\ h\quad \operatorname{ResolveTarget}(\sigma_{1} ,\ h)\ =\ r_{t}\quad \operatorname{RegionAlloc}(\sigma_{1} ,\ r_{t},\ v)\ \Downarrow \ (\sigma_{2} ,\ v') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{AllocExpr}(r,\ e),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Alloc-Explicit-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{AllocExpr}(r,\ e),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Propagate-Success-Outcome)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad U\ =\ \operatorname{ExprType}(e)\quad \operatorname{AsyncSig}(\operatorname{RetType}(\Gamma ))\ =\ \bot \quad \operatorname{OutcomeSig}(U)\ =\ \langle T_{s},\ E_{s}\rangle \quad \operatorname{OutcomeSig}(\operatorname{RetType}(\Gamma ))\ =\ \langle T_{r},\ E_{r}\rangle \quad \operatorname{ModalCase}(v)\ =\ \langle \texttt{@Value},\ v_{s}\rangle \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Propagate}(e),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{FieldValue}(v_{s},\ \texttt{value})),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Propagate-Success-Async-Outcome)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad U\ =\ \operatorname{ExprType}(e)\quad \operatorname{AsyncSig}(\operatorname{RetType}(\Gamma ))\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle \quad \operatorname{OutcomeSig}(U)\ =\ \langle T_{s},\ E_{s}\rangle \quad \operatorname{ModalCase}(v)\ =\ \langle \texttt{@Value},\ v_{s}\rangle \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Propagate}(e),\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{FieldValue}(v_{s},\ \texttt{value})),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Propagate-Error-Outcome)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad U\ =\ \operatorname{ExprType}(e)\quad \operatorname{AsyncSig}(\operatorname{RetType}(\Gamma ))\ =\ \bot \quad \operatorname{OutcomeSig}(U)\ =\ \langle T_{s},\ E_{s}\rangle \quad \operatorname{OutcomeSig}(\operatorname{RetType}(\Gamma ))\ =\ \langle T_{r},\ E_{r}\rangle \quad \operatorname{ModalCase}(v)\ =\ \langle \texttt{@Error},\ v_{e}\rangle \\[0.16em]
\mathsf{out}\ =\ \texttt{Outcome}<T_{r},\ E_{r}>\texttt{@Error}\{\texttt{error}:\ \operatorname{FieldValue}(v_{e},\ \texttt{error})\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Propagate}(e),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{Return}(\mathsf{out})),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Propagate-Error-Async-Outcome)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad U\ =\ \operatorname{ExprType}(e)\quad \operatorname{AsyncSig}(\operatorname{RetType}(\Gamma ))\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle \quad E\ \ne \ \operatorname{TypePrim}(\texttt{"!"})\quad \operatorname{OutcomeSig}(U)\ =\ \langle T_{s},\ E_{s}\rangle \quad \operatorname{ModalCase}(v)\ =\ \langle \texttt{@Error},\ v_{e}\rangle \\[0.16em]
\mathsf{async}_{\mathsf{failed}}\ =\ \operatorname{RecordValue}(\operatorname{ModalStateRef}([\texttt{Async}],\ \texttt{@Failed}),\ [\langle \texttt{error},\ \operatorname{FieldValue}(v_{e},\ \texttt{error})\rangle ]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Propagate}(e),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{Fail}(\mathsf{async}_{\mathsf{failed}})),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Propagate-Success-Union)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad U\ =\ \operatorname{ExprType}(e)\quad \operatorname{AsyncSig}(\operatorname{RetType}(\Gamma ))\ =\ \bot \quad \operatorname{SuccessMember}(\operatorname{RetType}(\Gamma ),\ U)\ =\ T_{s}\quad \operatorname{UnionCase}(v)\ =\ \langle T_{s},\ v_{s}\rangle \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Propagate}(e),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{s}),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Propagate-Success-Async-Union)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad U\ =\ \operatorname{ExprType}(e)\quad \operatorname{AsyncSig}(\operatorname{RetType}(\Gamma ))\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle \quad \operatorname{SuccessMemberAsync}(E,\ U)\ =\ T_{s}\quad \operatorname{UnionCase}(v)\ =\ \langle T_{s},\ v_{s}\rangle \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Propagate}(e),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{s}),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Propagate-Error-Union)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad U\ =\ \operatorname{ExprType}(e)\quad \operatorname{AsyncSig}(\operatorname{RetType}(\Gamma ))\ =\ \bot \quad \operatorname{SuccessMember}(\operatorname{RetType}(\Gamma ),\ U)\ =\ T_{s}\quad \operatorname{UnionCase}(v)\ =\ \langle T_{e},\ v_{e}\rangle \quad T_{e}\ \ne \ T_{s} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Propagate}(e),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{Return}(v_{e})),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Propagate-Error-Async-Union)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad U\ =\ \operatorname{ExprType}(e)\quad \operatorname{AsyncSig}(\operatorname{RetType}(\Gamma ))\ =\ \langle \mathsf{Out},\ \mathsf{In},\ \mathsf{Result},\ E\rangle \quad E\ \ne \ \operatorname{TypePrim}(\texttt{"!"})\quad \operatorname{SuccessMemberAsync}(E,\ U)\ =\ T_{s}\quad \operatorname{UnionCase}(v)\ =\ \langle T_{e},\ v_{e}\rangle \quad T_{e}\ \ne \ T_{s} \\[0.16em]
\mathsf{async}_{\mathsf{failed}}\ =\ \operatorname{RecordValue}(\operatorname{ModalStateRef}([\texttt{Async}],\ \texttt{@Failed}),\ [\langle \texttt{error},\ v_{e}\rangle ]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Propagate}(e),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{Fail}(\mathsf{async}_{\mathsf{failed}})),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Propagate-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Propagate}(e),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

$$
\begin{array}{l}
\mathsf{ExprState}\ =\ \{\langle e,\ \sigma \rangle ,\ \langle \operatorname{Val}(v),\ \sigma \rangle ,\ \langle \operatorname{Ctrl}(\kappa ),\ \sigma \rangle \} \\[0.16em]
\operatorname{TerminalExpr}(\langle \operatorname{Val}(v),\ \sigma \rangle ) \\[0.16em]
\operatorname{TerminalExpr}(\langle \operatorname{Ctrl}(\kappa ),\ \sigma \rangle )
\end{array}
$$

**(StepSigma-Pure)**

$$
\begin{array}{l}
\langle e\rangle \ \to \ \langle e'\rangle \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle e,\ \sigma \rangle \ \to \ \langle e',\ \sigma \rangle
\end{array}
$$

**(StepSigma-Alloc-Implicit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad \operatorname{ActiveTarget}(\sigma_{1} )\ =\ r\quad \operatorname{RegionAlloc}(\sigma_{1} ,\ r,\ v)\ \Downarrow \ (\sigma_{2} ,\ v') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{AllocExpr}(\bot ,\ e),\ \sigma \rangle \ \to \ \langle \operatorname{Val}(v'),\ \sigma_{2} \rangle
\end{array}
$$

**(StepSigma-Alloc-Implicit-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{AllocExpr}(\bot ,\ e),\ \sigma \rangle \ \to \ \langle \operatorname{Ctrl}(\kappa ),\ \sigma_{1} \rangle
\end{array}
$$

**(StepSigma-Alloc-Explicit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad \operatorname{LookupVal}(\sigma_{1} ,\ r)\ =\ v_{r}\quad \operatorname{RegionHandleOf}(v_{r})\ =\ h\quad \operatorname{ResolveTarget}(\sigma_{1} ,\ h)\ =\ r_{t}\quad \operatorname{RegionAlloc}(\sigma_{1} ,\ r_{t},\ v)\ \Downarrow \ (\sigma_{2} ,\ v') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{AllocExpr}(r,\ e),\ \sigma \rangle \ \to \ \langle \operatorname{Val}(v'),\ \sigma_{2} \rangle
\end{array}
$$

**(StepSigma-Alloc-Explicit-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{AllocExpr}(r,\ e),\ \sigma \rangle \ \to \ \langle \operatorname{Ctrl}(\kappa ),\ \sigma_{1} \rangle
\end{array}
$$

**(StepSigma-Block)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalBlockSigma}(\operatorname{BlockExpr}(\mathsf{stmts},\ \mathsf{tail}_{\mathsf{opt}}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{BlockExpr}(\mathsf{stmts},\ \mathsf{tail}_{\mathsf{opt}}),\ \sigma \rangle \ \to \ \langle \mathsf{out},\ \sigma '\rangle
\end{array}
$$

**(StepSigma-UnsafeBlock)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalBlockSigma}(b,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{UnsafeBlockExpr}(b),\ \sigma \rangle \ \to \ \langle \mathsf{out},\ \sigma '\rangle
\end{array}
$$

**(StepSigma-Loop)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\ell ,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\quad \ell \ \in \ \{\operatorname{LoopInfinite}(\_,\ \_),\ \operatorname{LoopConditional}(\_,\ \_,\ \_),\ \operatorname{LoopIter}(\_,\ \_,\ \_,\ \_,\ \_)\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \ell ,\ \sigma \rangle \ \to \ \langle \mathsf{out},\ \sigma '\rangle
\end{array}
$$

**(StepSigma-Stateful-Other)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\quad e\ \notin \ \{\operatorname{AllocExpr}(\_,\ \_),\ \operatorname{BlockExpr}(\_,\ \_),\ \operatorname{UnsafeBlockExpr}(\_),\ \operatorname{LoopInfinite}(\_,\ \_),\ \operatorname{LoopConditional}(\_,\ \_,\ \_),\ \operatorname{LoopIter}(\_,\ \_,\ \_,\ \_,\ \_)\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle e,\ \sigma \rangle \ \to \ \langle \mathsf{out},\ \sigma '\rangle
\end{array}
$$

### 16.8.6 Lowering

**(Lower-Expr-UnsafeBlock)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerBlock}(b)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{UnsafeBlockExpr}(b))\ \Downarrow \ \langle \mathsf{IR},\ v\rangle
\end{array}
$$

**(Lower-Expr-Move)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerMovePlace}(p)\ \Downarrow \ \langle \mathsf{IR},\ v\rangle \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{MoveExpr}(p))\ \Downarrow \ \langle \mathsf{IR},\ v\rangle
\end{array}
$$

**(Lower-Expr-Copy)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle \quad \Gamma \ \vdash \ \operatorname{LowerCopyObject}(\operatorname{ExprType}(e),\ v)\ \Downarrow \ \langle \mathsf{IR}_{c},\ v_{\mathsf{copy}}\rangle \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{CopyExpr}(e))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{e},\ \mathsf{IR}_{c}),\ v_{\mathsf{copy}}\rangle
\end{array}
$$

**(Lower-Expr-AddressOf)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerAddrOf}(p)\ \Downarrow \ \langle \mathsf{IR},\ \mathsf{addr}\rangle \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{AddressOf}(p))\ \Downarrow \ \langle \mathsf{IR},\ \mathsf{Ptr}@\operatorname{Valid}(\mathsf{addr})\rangle
\end{array}
$$

**(Lower-Expr-Deref)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v_{\mathsf{ptr}}\rangle \quad \Gamma \ \vdash \ \operatorname{LowerRawDeref}(v_{\mathsf{ptr}})\ \Downarrow \ \langle \mathsf{IR}_{d},\ v\rangle \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{Deref}(e))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{e},\ \mathsf{IR}_{d}),\ v\rangle
\end{array}
$$

**(Lower-Expr-Alloc)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{AllocExpr}(r_{\mathsf{opt}},\ e))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{e},\ \operatorname{AllocIR}(r_{\mathsf{opt}},\ v)),\ v_{\mathsf{alloc}}\rangle
\end{array}
$$

**(Lower-Expr-Propagate-Success-Outcome)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle \quad U\ =\ \operatorname{ExprType}(e)\quad \operatorname{OutcomeSig}(U)\ =\ \langle T_{s},\ E_{s}\rangle \quad \operatorname{OutcomeState}(v)\ =\ \texttt{@Value}\quad \operatorname{OutcomeField}(v,\ \texttt{value})\ =\ v_{s} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{Propagate}(e))\ \Downarrow \ \langle \mathsf{IR}_{e},\ v_{s}\rangle
\end{array}
$$

**(Lower-Expr-Propagate-Return-Outcome)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle \quad U\ =\ \operatorname{ExprType}(e)\quad \operatorname{OutcomeSig}(U)\ =\ \langle T_{s},\ E_{s}\rangle \quad \operatorname{OutcomeState}(v)\ =\ \texttt{@Error}\quad \operatorname{OutcomeField}(v,\ \texttt{error})\ =\ v_{e} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{Propagate}(e))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{e},\ \operatorname{ReturnIR}(\texttt{Outcome@Error}\{\texttt{error}:\ v_{e}\})),\ v_{\mathsf{unreach}}\rangle
\end{array}
$$

**(Lower-Expr-Propagate-Success-Union)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle \quad U\ =\ \operatorname{ExprType}(e)\quad \operatorname{SuccessMember}(\operatorname{RetType}(\Gamma ),\ U)\ =\ T_{s}\quad \operatorname{UnionCase}(v)\ =\ \langle T_{s},\ v_{s}\rangle \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{Propagate}(e))\ \Downarrow \ \langle \mathsf{IR}_{e},\ v_{s}\rangle
\end{array}
$$

**(Lower-Expr-Propagate-Return-Union)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e)\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle \quad U\ =\ \operatorname{ExprType}(e)\quad \operatorname{SuccessMember}(\operatorname{RetType}(\Gamma ),\ U)\ =\ T_{s}\quad \operatorname{UnionCase}(v)\ =\ \langle T_{e},\ v_{e}\rangle \quad T_{e}\ \ne \ T_{s} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{Propagate}(e))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{e},\ \operatorname{ReturnIR}(v_{e})),\ v_{\mathsf{unreach}}\rangle
\end{array}
$$

`LowerRawDeref`, `LowerAddrOf`, and `LowerMovePlace` define the pointer, address, and move-state mechanics used by these expressions.

### 16.8.7 Diagnostics

Diagnostics are defined for address-of on non-places, address-of of packed fields outside `unsafe`, non-`usize` indexing in address-of contexts, dereference of null or expired safe pointers, raw-pointer dereference outside `unsafe`, explicit allocation through a non-region binding, implicit allocation without an active region, and propagation inside async procedures whose error type is `!`.
