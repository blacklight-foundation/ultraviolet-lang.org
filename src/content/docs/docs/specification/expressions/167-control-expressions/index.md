---
title: "16.7 Control Expressions"
description: "16.7 Control Expressions from 16. Expressions of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "expressions"
specSection: "167-control-expressions"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/expressions/">16. Expressions</a>
  <span>Expressions</span>
</div>

## 16.7 Control Expressions

### 16.7.1 Syntax

```text
if_expr        ::= "if" expression if_tail
if_tail        ::= block_expr ("else" (block_expr | if_expr))?
                 | "is" if_case_pattern block_expr ("else" (block_expr | if_expr))?
                 | "is" "{" if_case+ if_case_else? "}"
if_case        ::= if_case_pattern block_expr
if_case_pattern ::= pattern | ":" type
if_case_else   ::= "else" block_expr
loop_expr      ::= "loop" loop_condition? loop_invariant? block_expr
loop_condition ::= expression | pattern (":" type)? "in" expression
loop_invariant ::= "|:" "{" predicate_expr "}"
block_expr     ::= "{" statement* expression? "}"
```

Pattern forms, case-clause parsing, and exhaustiveness notions are owned by Chapter 17. In an `if ... is` case position, `: T` is a type-test pattern shorthand and elaborates to the discard typed pattern `_: T`; it is not general pattern syntax outside `if_case_pattern`. Loop-invariant obligations are owned by §15.7.
Block structure, statement sequencing, terminator handling, and block-local typing are owned by §18.1.

### 16.7.2 Parsing

**(Parse-If-Expr)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{if})\quad \Gamma \ \vdash \ \operatorname{ParseExpr_NoBrace}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ c)\quad \lnot \ \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{is})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{b1})\quad \Gamma \ \vdash \ \operatorname{ParseElseOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{b2}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (P_{3},\ \operatorname{IfExpr}(c,\ \mathsf{b1},\ \mathsf{b2}))
\end{array}
$$

**(Parse-If-Is-Single)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{if})\quad \Gamma \ \vdash \ \operatorname{ParseExpr_NoBrace}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e)\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{is})\quad \lnot \ \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P_{1})),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseIfCasePattern}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{pat})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{b1})\quad \Gamma \ \vdash \ \operatorname{ParseElseOpt}(P_{3})\ \Downarrow \ (P_{4},\ \mathsf{b2}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (P_{4},\ \operatorname{IfIsExpr}(e,\ \mathsf{pat},\ \mathsf{b1},\ \mathsf{b2}))
\end{array}
$$

**(Parse-If-Is-TypeTest)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseIfCasePattern}(P)\ \Downarrow \ (P_{1},\ \operatorname{TypedPattern}(\texttt{"\_"},\ T))
\end{array}
$$

**(Parse-If-Is-CaseList)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{if})\quad \Gamma \ \vdash \ \operatorname{ParseExpr_NoBrace}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e)\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{is})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P_{1})),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseIfCases}(\operatorname{Advance}(\operatorname{Advance}(P_{1})))\ \Downarrow \ (P_{2},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (\operatorname{Advance}(P_{2}),\ \operatorname{IfCaseExpr}(e,\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}}))
\end{array}
$$

**(Parse-Loop-Expr)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{loop})\quad \Gamma \ \vdash \ \operatorname{ParseLoopTail}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{loop}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (P_{1},\ \mathsf{loop})
\end{array}
$$

**(Parse-Block-Expr)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(P)\ \Downarrow \ (P_{1},\ b) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (P_{1},\ b)
\end{array}
$$

**(Parse-IfCases-Cons)**, **(Parse-IfCase)**, **(Parse-IfCasesTail-End)**, **(Parse-IfCasesTail-Else)**, **(Parse-IfCasesTail-Cons)**, **(Parse-LoopTail-Infinite)**, **(Parse-LoopTail-Iter)**, **(Parse-LoopTail-Cond)**, **(TryParsePatternIn-Ok)**, **(TryParsePatternIn-Fail)**, **(Parse-ElseOpt-None)**, **(Parse-ElseOpt-If)**, and **(Parse-ElseOpt-Block)** define the remaining control-expression parsing details.

### 16.7.3 AST Representation / Form

$$
\mathsf{Expr}\ =\ \operatorname{IfExpr}(\mathsf{cond},\ \mathsf{then}_{\mathsf{block}},\ \mathsf{else}_{\mathsf{opt}})\ \mid \ \operatorname{IfIsExpr}(\mathsf{scrutinee},\ \mathsf{pattern},\ \mathsf{then}_{\mathsf{block}},\ \mathsf{else}_{\mathsf{opt}})\ \mid \ \operatorname{IfCaseExpr}(\mathsf{scrutinee},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ \mid \ \operatorname{LoopInfinite}(\mathsf{inv}_{\mathsf{opt}},\ \mathsf{body})\ \mid \ \operatorname{LoopConditional}(\mathsf{cond},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body})\ \mid \ \operatorname{LoopIter}(\mathsf{pattern},\ \mathsf{type}_{\mathsf{opt}},\ \mathsf{iter},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body})\ \mid \ \operatorname{BlockExpr}(\mathsf{stmts},\ \mathsf{tail}_{\mathsf{opt}})\ \mid \ \ldots 
$$

$$
\begin{array}{l}
\mathsf{LoopInvariantOpt}\ \in \ \{\bot \}\ \cup \ \mathsf{Expr} \\[0.16em]
\mathsf{IfCase}\ =\ \langle \mathsf{pattern},\ \mathsf{body}\rangle 
\end{array}
$$

`if_case_pattern` does not add a distinct AST node. `: T` MUST be represented as `TypedPattern("_", T)` before semantic analysis.

$$
\begin{array}{l}
\operatorname{LoopTypeInf}(\mathsf{Brk},\ \mathsf{BrkVoid})\ = \\[0.16em]
\ \{\ \operatorname{TypePrim}(\texttt{!})\quad \mathsf{if}\ \mathsf{Brk}\ =\ []\ \land \ \mathsf{BrkVoid}\ =\ \mathsf{false} \\[0.16em]
\quad \operatorname{TypePrim}(\texttt{()})\ \mathsf{if}\ \mathsf{Brk}\ =\ []\ \land \ \mathsf{BrkVoid}\ =\ \mathsf{true} \\[0.16em]
\quad T\quad \mathsf{if}\ \mathsf{BrkVoid}\ =\ \mathsf{false}\ \land \ \operatorname{ResType}(\mathsf{Brk})\ =\ T \\[0.16em]
\quad \bot \quad \mathsf{otherwise}\ \}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LoopTypeFin}(\mathsf{Brk},\ \mathsf{BrkVoid})\ = \\[0.16em]
\ \{\ \operatorname{TypePrim}(\texttt{()})\ \mathsf{if}\ \mathsf{Brk}\ =\ [] \\[0.16em]
\quad T\quad \mathsf{if}\ \mathsf{BrkVoid}\ =\ \mathsf{false}\ \land \ \operatorname{ResType}(\mathsf{Brk})\ =\ T \\[0.16em]
\quad \bot \quad \mathsf{otherwise}\ \}
\end{array}
$$

### 16.7.4 Static Semantics

Block typing and checking are owned by §18.1.4:

- `BlockInfo(BlockExpr(stmts, tail_opt)) ⇓ ⟨T, Brk, BrkVoid⟩`
- `T-Block`
- `Chk-Block-Tail`
- `Chk-Block-Return`
- `Chk-Block-Unit`

**(T-If)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ c\ :\ \operatorname{TypePrim}(\texttt{bool})\quad \Gamma ;\ R;\ L\ \vdash \ b_{t}\ :\ T\quad \Gamma ;\ R;\ L\ \vdash \ b_{f}\ :\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfExpr}(c,\ b_{t},\ b_{f})\ :\ T
\end{array}
$$

**(T-If-No-Else)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ c\ :\ \operatorname{TypePrim}(\texttt{bool})\quad \Gamma ;\ R;\ L\ \vdash \ b_{t}\ :\ \operatorname{TypePrim}(\texttt{()}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfExpr}(c,\ b_{t},\ \bot )\ :\ \operatorname{TypePrim}(\texttt{()})
\end{array}
$$

**(Chk-If)** and **(Chk-If-No-Else)** define checking-mode validation for the same two forms.

Pattern typing uses Chapter 17 pattern judgments:

- `Γ ⊢ pat ◁ T ⊣ B` for case binding
- `CaseScope(Γ, e, pat, T)` for pattern bindings and scrutinee narrowing
- `HasIrrefutableCase(cases, T)` and the exhaustiveness conditions from §17.6

**(T-If-Is)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T_{s}\quad \operatorname{CaseScope}(\Gamma ,\ e,\ \mathsf{pat},\ T_{s})\ \Downarrow \ \Gamma_{1} \quad \operatorname{ElseScope}(\Gamma ,\ e,\ \mathsf{pat},\ T_{s})\ \Downarrow \ \Gamma_{2} \quad \Gamma_{1} ;\ R;\ L\ \vdash \ b_{t}\ :\ T\quad \Gamma_{2} ;\ R;\ L\ \vdash \ b_{f}\ :\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfIsExpr}(e,\ \mathsf{pat},\ b_{t},\ b_{f})\ :\ T
\end{array}
$$

**(T-If-Is-No-Else)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e\ :\ T_{s}\quad \operatorname{CaseScope}(\Gamma ,\ e,\ \mathsf{pat},\ T_{s})\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} ;\ R;\ L\ \vdash \ b_{t}\ :\ \operatorname{TypePrim}(\texttt{()}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{IfIsExpr}(e,\ \mathsf{pat},\ b_{t},\ \bot )\ :\ \operatorname{TypePrim}(\texttt{()})
\end{array}
$$

`T-IfCase-Other` types case analysis when all case bodies synthesize the same type and the case set is exhaustive or a fallback block is present. `T-IfCase-Enum`, `T-IfCase-Modal`, and `T-IfCase-Union` are the specialized forms for enum, modal, and union scrutinees.

**(Chk-IfIs)** and **(Chk-IfIs-No-Else)** define checking-mode validation for single-case `if ... is ...`.
**(Chk-IfCase-Other)**, **(Chk-IfCase-Enum)**, **(Chk-IfCase-Modal)**, and **(Chk-IfCase-Union)** define checking-mode validation for `if ... is { ... }`.

Loop invariants use `LoopInvOk` from §15.7.4.

**(T-Loop-Infinite)**

$$
\begin{array}{l}
\operatorname{LoopInvOk}(\mathsf{inv}_{\mathsf{opt}})\quad \Gamma ;\ R;\ \texttt{loop}\ \vdash \ \operatorname{BlockInfo}(\mathsf{body})\ \Downarrow \ \langle T_{b},\ \mathsf{Brk},\ \mathsf{BrkVoid}\rangle \quad \operatorname{LoopTypeInf}(\mathsf{Brk},\ \mathsf{BrkVoid})\ =\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LoopInfinite}(\mathsf{inv}_{\mathsf{opt}},\ \mathsf{body})\ :\ T
\end{array}
$$

**(T-Loop-Conditional)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{cond}\ :\ \operatorname{TypePrim}(\texttt{bool})\quad \operatorname{LoopInvOk}(\mathsf{inv}_{\mathsf{opt}})\quad \Gamma ;\ R;\ \texttt{loop}\ \vdash \ \operatorname{BlockInfo}(\mathsf{body})\ \Downarrow \ \langle T_{b},\ \mathsf{Brk},\ \mathsf{BrkVoid}\rangle \quad \operatorname{LoopTypeFin}(\mathsf{Brk},\ \mathsf{BrkVoid})\ =\ T \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LoopConditional}(\mathsf{cond},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body})\ :\ T
\end{array}
$$

**(T-Loop-Iter)**

$$
\begin{array}{l}
(\Gamma ;\ R;\ L\ \vdash \ \mathsf{iter}\ :\ T_{\mathsf{iter}})\quad \operatorname{LoopIterableType}(T_{\mathsf{iter}},\ T)\quad (\operatorname{RangeLoopType}(T_{\mathsf{iter}},\ T)\ \Rightarrow \ \operatorname{ImplementsStep}(T))\quad (\operatorname{BoundedRangeLoopType}(T_{\mathsf{iter}},\ T)\ \Rightarrow \ \operatorname{ImplementsEq}(T))\quad (\mathsf{ty}_{\mathsf{opt}}\ =\ \bot \ \Rightarrow \ T_{p}\ =\ T)\quad (\mathsf{ty}_{\mathsf{opt}}\ =\ T_{a}\ \Rightarrow \ \Gamma \ \vdash \ T\ \mathrel{<:} \ T_{a}\ \land \ T_{p}\ =\ T_{a})\quad \Gamma \ \vdash \ \mathsf{pat}\ \Leftarrow \ T_{p}\ \dashv \ B\quad \operatorname{Distinct}(\operatorname{PatNames}(\mathsf{pat}))\quad \operatorname{LoopInvOk}(\mathsf{inv}_{\mathsf{opt}})\quad \Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \operatorname{IntroAll}(\Gamma_{0} ,\ B)\ \Downarrow \ \Gamma_{1} \quad \Gamma_{1} ;\ R;\ \texttt{loop}\ \vdash \ \operatorname{BlockInfo}(\mathsf{body})\ \Downarrow \ \langle T_{b},\ \mathsf{Brk},\ \mathsf{BrkVoid}\rangle \quad \operatorname{LoopTypeFin}(\mathsf{Brk},\ \mathsf{BrkVoid})\ =\ T_{r} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LoopIter}(\mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{iter},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body})\ :\ T_{r}
\end{array}
$$

**(T-Loop-Iter-Async)** and **(Loop-Async-Err)** define the async-iterator case and its rejection when the enclosing return type is not compatible. Async-specific composition semantics remain in Chapter 21.

### 16.7.5 Dynamic Semantics

**(EvalSigma-If-True)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{cond},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{true}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{then}_{\mathsf{block}},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{IfExpr}(\mathsf{cond},\ \mathsf{then}_{\mathsf{block}},\ \mathsf{else}_{\mathsf{opt}}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-If-False-None)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{cond},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{false}),\ \sigma_{1} )\quad \mathsf{else}_{\mathsf{opt}}\ =\ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{IfExpr}(\mathsf{cond},\ \mathsf{then}_{\mathsf{block}},\ \mathsf{else}_{\mathsf{opt}}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(()),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-If-False-Some)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{cond},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{false}),\ \sigma_{1} )\quad \mathsf{else}_{\mathsf{opt}}\ =\ e\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{IfExpr}(\mathsf{cond},\ \mathsf{then}_{\mathsf{block}},\ \mathsf{else}_{\mathsf{opt}}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-If-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{cond},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{IfExpr}(\mathsf{cond},\ \mathsf{then}_{\mathsf{block}},\ \mathsf{else}_{\mathsf{opt}}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-If-Is)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{scrutinee},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{s}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalIfCaseListSigma}([\langle \mathsf{pat},\ \mathsf{then}_{\mathsf{block}}\rangle ],\ \mathsf{else}_{\mathsf{opt}},\ v_{s},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{IfIsExpr}(\mathsf{scrutinee},\ \mathsf{pat},\ \mathsf{then}_{\mathsf{block}},\ \mathsf{else}_{\mathsf{opt}}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-If-Is-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{scrutinee},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{IfIsExpr}(\mathsf{scrutinee},\ \mathsf{pat},\ \mathsf{then}_{\mathsf{block}},\ \mathsf{else}_{\mathsf{opt}}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-If-Cases)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{scrutinee},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{s}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalIfCaseListSigma}(\mathsf{cases},\ \mathsf{else}_{\mathsf{opt}},\ v_{s},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{IfCaseExpr}(\mathsf{scrutinee},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-If-Cases-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{scrutinee},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{IfCaseExpr}(\mathsf{scrutinee},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(EvalIfCase-Fail)**, **(EvalIfCase-Hit)**, **(EvalIfCases-Head)**, **(EvalIfCases-Tail)**, **(EvalIfCases-Else)**, and **(EvalIfCases-None)** define left-to-right matching of case clauses against the scrutinee.

**(EvalSigma-Block)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalBlockSigma}(\operatorname{BlockExpr}(\mathsf{stmts},\ \mathsf{tail}_{\mathsf{opt}}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{BlockExpr}(\mathsf{stmts},\ \mathsf{tail}_{\mathsf{opt}}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LoopIterableType}(T_{\mathsf{iter}},\ T)\ \Leftrightarrow \ T_{\mathsf{iter}}\ =\ \operatorname{TypeSlice}(T)\ \lor \ T_{\mathsf{iter}}\ =\ \operatorname{TypeArray}(T,\ n)\ \lor \ T_{\mathsf{iter}}\ =\ \operatorname{TypeRange}(T)\ \lor \ T_{\mathsf{iter}}\ =\ \operatorname{TypeRangeInclusive}(T)\ \lor \ T_{\mathsf{iter}}\ =\ \operatorname{TypeRangeFrom}(T) \\[0.16em]
\operatorname{LoopIterableType}(\operatorname{TypePerm}(p,\ T_{\mathsf{iter}}),\ T)\ \Leftrightarrow \ \operatorname{LoopIterableType}(T_{\mathsf{iter}},\ T) \\[0.16em]
\operatorname{RangeLoopType}(T_{\mathsf{iter}},\ T)\ \Leftrightarrow \ T_{\mathsf{iter}}\ =\ \operatorname{TypeRange}(T)\ \lor \ T_{\mathsf{iter}}\ =\ \operatorname{TypeRangeInclusive}(T)\ \lor \ T_{\mathsf{iter}}\ =\ \operatorname{TypeRangeFrom}(T) \\[0.16em]
\operatorname{RangeLoopType}(\operatorname{TypePerm}(p,\ T_{\mathsf{iter}}),\ T)\ \Leftrightarrow \ \operatorname{RangeLoopType}(T_{\mathsf{iter}},\ T) \\[0.16em]
\operatorname{BoundedRangeLoopType}(T_{\mathsf{iter}},\ T)\ \Leftrightarrow \ T_{\mathsf{iter}}\ =\ \operatorname{TypeRange}(T)\ \lor \ T_{\mathsf{iter}}\ =\ \operatorname{TypeRangeInclusive}(T) \\[0.16em]
\operatorname{BoundedRangeLoopType}(\operatorname{TypePerm}(p,\ T_{\mathsf{iter}}),\ T)\ \Leftrightarrow \ \operatorname{BoundedRangeLoopType}(T_{\mathsf{iter}},\ T)
\end{array}
$$

$$
\begin{array}{l}
\mathsf{IterJudg}\ =\ \{\operatorname{IterInit}(v)\ \Downarrow \ \mathsf{it},\ \operatorname{IterNext}(\mathsf{it})\ \Downarrow \ (\operatorname{opt}(v),\ \mathsf{it}')\} \\[0.16em]
\mathsf{Iter}\ =\ \{\operatorname{SeqIter}(v,\ i)\ \mid \ \operatorname{Len}(v)\ \mathsf{defined}\ \land \ i\ \in \ \mathbb{N} \}\ \cup \ \{\operatorname{RangeIterExclusive}(\mathsf{cur},\ \mathsf{hi})\}\ \cup \ \{\operatorname{RangeIterInclusive}(\mathsf{cur},\ \mathsf{hi})\}\ \cup \ \{\operatorname{RangeIterFrom}(\mathsf{cur})\}\ \cup \ \{\mathsf{IterDone}\} \\[0.16em]
\operatorname{Successor}(v)\ \Downarrow \ v'\ \Leftrightarrow \ \texttt{Step::successor}\ \mathsf{applied}\ \mathsf{to}\ v\ \mathsf{returns}\ v' \\[0.16em]
\operatorname{EqHolds}(v_{1},\ v_{2})\ \Leftrightarrow \ \texttt{Eq::eq}\ \mathsf{applied}\ \mathsf{to}\ \langle v_{1},\ v_{2}\rangle \ \mathsf{returns}\ \texttt{true}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{IterInit}(v)\ \Downarrow \ \operatorname{SeqIter}(v,\ 0)\ \Leftrightarrow \ \operatorname{Len}(v)\ \mathsf{defined} \\[0.16em]
\operatorname{IterInit}(\operatorname{RangeVal}(\texttt{Exclusive},\ \mathsf{lo},\ \mathsf{hi}))\ \Downarrow \ \operatorname{RangeIterExclusive}(\mathsf{lo},\ \mathsf{hi}) \\[0.16em]
\operatorname{IterInit}(\operatorname{RangeVal}(\texttt{Inclusive},\ \mathsf{lo},\ \mathsf{hi}))\ \Downarrow \ \operatorname{RangeIterInclusive}(\mathsf{lo},\ \mathsf{hi}) \\[0.16em]
\operatorname{IterInit}(\operatorname{RangeVal}(\texttt{From},\ \mathsf{lo},\ \bot ))\ \Downarrow \ \operatorname{RangeIterFrom}(\mathsf{lo})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{IterNext}(\operatorname{SeqIter}(v,\ i))\ \Downarrow \ (\bot ,\ \mathsf{IterDone})\ \Leftrightarrow \ \lnot \ (0\ \le \ i\ <\ \operatorname{Len}(v)) \\[0.16em]
\operatorname{IterNext}(\operatorname{SeqIter}(v,\ i))\ \Downarrow \ (v_{i},\ \operatorname{SeqIter}(v,\ i\ +\ 1))\ \Leftrightarrow \ 0\ \le \ i\ <\ \operatorname{Len}(v)\ \land \ \operatorname{IndexValue}(v,\ i)\ =\ v_{i} \\[0.16em]
\operatorname{IterNext}(\operatorname{RangeIterExclusive}(\mathsf{cur},\ \mathsf{hi}))\ \Downarrow \ (\bot ,\ \mathsf{IterDone})\ \Leftrightarrow \ \operatorname{EqHolds}(\mathsf{cur},\ \mathsf{hi}) \\[0.16em]
\operatorname{IterNext}(\operatorname{RangeIterExclusive}(\mathsf{cur},\ \mathsf{hi}))\ \Downarrow \ (\mathsf{cur},\ \operatorname{RangeIterExclusive}(\mathsf{cur}',\ \mathsf{hi}))\ \Leftrightarrow \ \lnot \ \operatorname{EqHolds}(\mathsf{cur},\ \mathsf{hi})\ \land \ \operatorname{Successor}(\mathsf{cur})\ \Downarrow \ \mathsf{cur}' \\[0.16em]
\operatorname{IterNext}(\operatorname{RangeIterExclusive}(\mathsf{cur},\ \mathsf{hi}))\ \Downarrow \ (\mathsf{cur},\ \mathsf{IterDone})\ \Leftrightarrow \ \lnot \ \operatorname{EqHolds}(\mathsf{cur},\ \mathsf{hi})\ \land \ \lnot \ \exists \ \mathsf{cur}'.\ \operatorname{Successor}(\mathsf{cur})\ \Downarrow \ \mathsf{cur}' \\[0.16em]
\operatorname{IterNext}(\operatorname{RangeIterInclusive}(\mathsf{cur},\ \mathsf{hi}))\ \Downarrow \ (\mathsf{cur},\ \mathsf{IterDone})\ \Leftrightarrow \ \operatorname{EqHolds}(\mathsf{cur},\ \mathsf{hi}) \\[0.16em]
\operatorname{IterNext}(\operatorname{RangeIterInclusive}(\mathsf{cur},\ \mathsf{hi}))\ \Downarrow \ (\mathsf{cur},\ \operatorname{RangeIterInclusive}(\mathsf{cur}',\ \mathsf{hi}))\ \Leftrightarrow \ \lnot \ \operatorname{EqHolds}(\mathsf{cur},\ \mathsf{hi})\ \land \ \operatorname{Successor}(\mathsf{cur})\ \Downarrow \ \mathsf{cur}' \\[0.16em]
\operatorname{IterNext}(\operatorname{RangeIterInclusive}(\mathsf{cur},\ \mathsf{hi}))\ \Downarrow \ (\mathsf{cur},\ \mathsf{IterDone})\ \Leftrightarrow \ \lnot \ \operatorname{EqHolds}(\mathsf{cur},\ \mathsf{hi})\ \land \ \lnot \ \exists \ \mathsf{cur}'.\ \operatorname{Successor}(\mathsf{cur})\ \Downarrow \ \mathsf{cur}' \\[0.16em]
\operatorname{IterNext}(\operatorname{RangeIterFrom}(\mathsf{cur}))\ \Downarrow \ (\mathsf{cur},\ \operatorname{RangeIterFrom}(\mathsf{cur}'))\ \Leftrightarrow \ \operatorname{Successor}(\mathsf{cur})\ \Downarrow \ \mathsf{cur}' \\[0.16em]
\operatorname{IterNext}(\operatorname{RangeIterFrom}(\mathsf{cur}))\ \Downarrow \ (\mathsf{cur},\ \mathsf{IterDone})\ \Leftrightarrow \ \lnot \ \exists \ \mathsf{cur}'.\ \operatorname{Successor}(\mathsf{cur})\ \Downarrow \ \mathsf{cur}' \\[0.16em]
\operatorname{IterNext}(\mathsf{IterDone})\ \Downarrow \ (\bot ,\ \mathsf{IterDone})
\end{array}
$$

$$
\mathsf{LoopIterJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{LoopIterExec}(\mathsf{pat},\ \mathsf{body},\ \mathsf{it},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\}
$$

**(EvalSigma-Loop-Infinite-Step)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{body},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{LoopInfinite}(\mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}),\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{LoopInfinite}(\mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Loop-Infinite-Continue)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{body},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Continue}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{LoopInfinite}(\mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}),\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{LoopInfinite}(\mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Loop-Infinite-Break)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{body},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{Break}(v_{\mathsf{opt}})),\ \sigma_{1} )\quad v\ =\ \operatorname{BreakVal}(v_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{LoopInfinite}(\mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Loop-Infinite-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{body},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )\quad \kappa \ \in \ \{\operatorname{Return}(\_),\ \mathsf{Panic},\ \mathsf{Abort}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{LoopInfinite}(\mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Loop-Cond-False)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{cond},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{false}),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{LoopConditional}(\mathsf{cond},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(()),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Loop-Cond-True-Step)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{cond},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{true}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{body},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{2} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{LoopConditional}(\mathsf{cond},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}),\ \sigma_{2} )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{LoopConditional}(\mathsf{cond},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} )
\end{array}
$$

**(EvalSigma-Loop-Cond-Continue)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{cond},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{true}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{body},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Continue}),\ \sigma_{2} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{LoopConditional}(\mathsf{cond},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}),\ \sigma_{2} )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{LoopConditional}(\mathsf{cond},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} )
\end{array}
$$

**(EvalSigma-Loop-Cond-Break)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{cond},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{true}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{body},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{Break}(v_{\mathsf{opt}})),\ \sigma_{2} )\quad v\ =\ \operatorname{BreakVal}(v_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{LoopConditional}(\mathsf{cond},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Loop-Cond-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{cond},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{LoopConditional}(\mathsf{cond},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Loop-Cond-Body-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{cond},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{true}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{body},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} )\quad \kappa \ \in \ \{\operatorname{Return}(\_),\ \mathsf{Panic},\ \mathsf{Abort}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{LoopConditional}(\mathsf{cond},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Loop-Iter)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{iter},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{\mathsf{iter}}),\ \sigma_{1} )\quad \operatorname{IterInit}(v_{\mathsf{iter}})\ \Downarrow \ \mathsf{it}\quad \Gamma \ \vdash \ \operatorname{LoopIterExec}(\mathsf{pat},\ \mathsf{body},\ \mathsf{it},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{LoopIter}(\mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{iter},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Loop-Iter-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{iter},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{LoopIter}(\mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{iter},\ \mathsf{inv}_{\mathsf{opt}},\ \mathsf{body}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(LoopIter-Done)**

$$
\begin{array}{l}
\operatorname{IterNext}(\mathsf{it})\ \Downarrow \ (\bot ,\ \mathsf{it}') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LoopIterExec}(\mathsf{pat},\ \mathsf{body},\ \mathsf{it},\ \sigma )\ \Downarrow \ (\operatorname{Val}(()),\ \sigma )
\end{array}
$$

**(LoopIter-Step-Val)**

$$
\begin{array}{l}
\operatorname{IterNext}(\mathsf{it})\ \Downarrow \ (v,\ \mathsf{it}')\quad \Gamma \ \vdash \ \operatorname{EvalBlockBindSigma}(\mathsf{pat},\ v,\ \mathsf{body},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{b}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{LoopIterExec}(\mathsf{pat},\ \mathsf{body},\ \mathsf{it}',\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LoopIterExec}(\mathsf{pat},\ \mathsf{body},\ \mathsf{it},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

**(LoopIter-Step-Continue)**

$$
\begin{array}{l}
\operatorname{IterNext}(\mathsf{it})\ \Downarrow \ (v,\ \mathsf{it}')\quad \Gamma \ \vdash \ \operatorname{EvalBlockBindSigma}(\mathsf{pat},\ v,\ \mathsf{body},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Continue}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{LoopIterExec}(\mathsf{pat},\ \mathsf{body},\ \mathsf{it}',\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LoopIterExec}(\mathsf{pat},\ \mathsf{body},\ \mathsf{it},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

**(LoopIter-Step-Break)**

$$
\begin{array}{l}
\operatorname{IterNext}(\mathsf{it})\ \Downarrow \ (v,\ \mathsf{it}')\quad \Gamma \ \vdash \ \operatorname{EvalBlockBindSigma}(\mathsf{pat},\ v,\ \mathsf{body},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\operatorname{Break}(v_{\mathsf{opt}})),\ \sigma_{1} )\quad v'\ =\ \operatorname{BreakVal}(v_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LoopIterExec}(\mathsf{pat},\ \mathsf{body},\ \mathsf{it},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma_{1} )
\end{array}
$$

**(LoopIter-Step-Ctrl)**

$$
\begin{array}{l}
\operatorname{IterNext}(\mathsf{it})\ \Downarrow \ (v,\ \mathsf{it}')\quad \Gamma \ \vdash \ \operatorname{EvalBlockBindSigma}(\mathsf{pat},\ v,\ \mathsf{body},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )\quad \kappa \ \in \ \{\operatorname{Return}(\_),\ \mathsf{Panic},\ \mathsf{Abort}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LoopIterExec}(\mathsf{pat},\ \mathsf{body},\ \mathsf{it},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

### 16.7.6 Lowering

**(Lower-Expr-If)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(\mathsf{cond})\ \Downarrow \ \langle \mathsf{IR}_{c},\ v_{c}\rangle \quad \Gamma \ \vdash \ \operatorname{LowerBlock}(b_{1})\ \Downarrow \ \langle \mathsf{IR}_{1},\ v_{1}\rangle \quad \Gamma \ \vdash \ \operatorname{LowerBlock}(b_{2})\ \Downarrow \ \langle \mathsf{IR}_{2},\ v_{2}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{IfExpr}(\mathsf{cond},\ b_{1},\ b_{2}))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{c},\ \operatorname{IfIR}(v_{c},\ \mathsf{IR}_{1},\ v_{1},\ \mathsf{IR}_{2},\ v_{2})),\ v_{\mathsf{if}}\rangle 
\end{array}
$$

**(Lower-Expr-If-Is)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerIfCases}(\mathsf{scrut},\ [\langle \mathsf{pat},\ b_{t}\rangle ],\ \mathsf{else}_{\mathsf{opt}})\ \Downarrow \ \langle \mathsf{IR},\ v\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{IfIsExpr}(\mathsf{scrut},\ \mathsf{pat},\ b_{t},\ \mathsf{else}_{\mathsf{opt}}))\ \Downarrow \ \langle \mathsf{IR},\ v\rangle 
\end{array}
$$

**(Lower-Expr-If-Cases)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerIfCases}(\mathsf{scrut},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ \Downarrow \ \langle \mathsf{IR},\ v\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{IfCaseExpr}(\mathsf{scrut},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}}))\ \Downarrow \ \langle \mathsf{IR},\ v\rangle 
\end{array}
$$

**(Lower-Expr-LoopInf)**, **(Lower-Expr-LoopCond)**, and **(Lower-Expr-LoopIter)** delegate to `LowerLoop`.

**(Lower-Expr-Block)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerBlock}(\operatorname{BlockExpr}(\mathsf{stmts},\ \mathsf{tail}_{\mathsf{opt}}))\ \Downarrow \ \langle \mathsf{IR},\ v\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{BlockExpr}(\mathsf{stmts},\ \mathsf{tail}_{\mathsf{opt}}))\ \Downarrow \ \langle \mathsf{IR},\ v\rangle 
\end{array}
$$

`LowerBlock`, `Lower-Block-Tail`, and `Lower-Block-Unit` are owned by §18.1.6. **(Lower-Loop-Infinite)**, **(Lower-Loop-Cond)**, and **(Lower-Loop-Iter)** define loop lowering. **(Lower-IfCases)** lowers case-analysis scrutinee evaluation to `IfCaseIR`.

### 16.7.7 Diagnostics

Diagnostics are defined for non-`bool` `if` and conditional-loop conditions, ill-typed `if ... is` case bodies, ill-typed loop iterators, and async iterator loops that violate the enclosing async return/error constraints.

Pattern exhaustiveness and reachability diagnostics for `if ... is { ... }` are owned by §17.6. Loop-invariant diagnostics are owned by §15.7.
Block-expression parse, terminator, and result-join diagnostics are owned by §18.1.7.
