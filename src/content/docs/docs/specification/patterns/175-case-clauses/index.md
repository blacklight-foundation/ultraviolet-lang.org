---
title: "17.5 Case Clauses"
description: "17.5 Case Clauses from 17. Patterns of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "patterns"
specSection: "175-case-clauses"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/patterns/">17. Patterns</a>
  <span>Patterns</span>
</div>

## 17.5 Case Clauses

### 17.5.1 Syntax

```text
if_case      ::= if_case_pattern block_expr
if_case_pattern ::= pattern | ":" type
if_case_else ::= "else" block_expr
```

### 17.5.2 Parsing

**Case Clauses.**

**(Parse-IfCases-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseIfCase}(P)\ \Downarrow \ (P_{1},\ c)\quad \Gamma \ \vdash \ \operatorname{ParseIfCasesTail}(P_{1},\ [c])\ \Downarrow \ (P_{2},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseIfCases}(P)\ \Downarrow \ (P_{2},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})
\end{array}
$$

**(Parse-IfCase)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseIfCasePattern}(P)\ \Downarrow \ (P_{1},\ \mathsf{pat})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{body}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseIfCase}(P)\ \Downarrow \ (P_{2},\ \langle \mathsf{pat},\ \mathsf{body}\rangle )
\end{array}
$$

**(Parse-IfCase-Pattern)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParsePattern}(P)\ \Downarrow \ (P_{1},\ \mathsf{pat}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseIfCasePattern}(P)\ \Downarrow \ (P_{1},\ \mathsf{pat})
\end{array}
$$

**(Parse-IfCasesTail-End)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ =\ \operatorname{Punctuator}(\texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseIfCasesTail}(P,\ \mathsf{xs})\ \Downarrow \ (P,\ \mathsf{xs},\ \bot )
\end{array}
$$

**(Parse-IfCasesTail-Else)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{else})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ b) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseIfCasesTail}(P,\ \mathsf{xs})\ \Downarrow \ (P_{1},\ \mathsf{xs},\ b)
\end{array}
$$

**(Parse-IfCasesTail-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseIfCase}(P)\ \Downarrow \ (P_{1},\ c)\quad \Gamma \ \vdash \ \operatorname{ParseIfCasesTail}(P_{1},\ \mathsf{xs}\ \mathbin{++} \ [c])\ \Downarrow \ (P_{2},\ \mathsf{ys},\ \mathsf{else}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseIfCasesTail}(P,\ \mathsf{xs})\ \Downarrow \ (P_{2},\ \mathsf{ys},\ \mathsf{else}_{\mathsf{opt}})
\end{array}
$$

### 17.5.3 AST Representation / Form

$$
\mathsf{IfCase}\ =\ \langle \mathsf{pat},\ \mathsf{body}\rangle
$$

$$
\operatorname{BindOrder}(p,\ B)\ =\ [\langle x,\ B[x]\rangle \ \mid \ x\ \in \ \operatorname{PatNames}(p)]
$$

### 17.5.4 Static Semantics

$$
\begin{array}{l}
\mathsf{CaseScopeJudg}\ =\ \{\operatorname{CaseScope}(\Gamma ,\ e,\ \mathsf{pat},\ T)\ \Downarrow \ \Gamma_{\mathsf{case}} ,\ \operatorname{ElseScope}(\Gamma ,\ e,\ \mathsf{pat},\ T)\ \Downarrow \ \Gamma_{\mathsf{else}} ,\ \operatorname{CasesElseScope}(\Gamma ,\ e,\ \mathsf{cases},\ T)\ \Downarrow \ \Gamma_{\mathsf{else}} \} \\[0.16em]
\mathsf{PatternNarrowJudg}\ =\ \{\operatorname{PatternNarrow}(\Gamma ,\ \mathsf{pat},\ T)\ \Downarrow \ T_{n}\} \\[0.16em]
\mathsf{PatternRejectNarrowJudg}\ =\ \{\operatorname{PatternRejectNarrow}(\Gamma ,\ \mathsf{pat},\ T)\ \Downarrow \ T_{r}\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ScrutineeBinding}(\operatorname{Identifier}(x))\ =\ x \\[0.16em]
\operatorname{ScrutineeBinding}(e)\ =\ \bot \ \Leftrightarrow \ e\ \ne \ \operatorname{Identifier}(\_) \\[0.16em]
\operatorname{RefineBinding}(\Gamma ,\ x,\ T_{n})\ \Downarrow \ \Gamma '\ \Leftrightarrow \ \operatorname{LookupNearestValueBinding}(\Gamma ,\ x)\ =\ b\ \land \ \Gamma '\ =\ \operatorname{ReplaceBindingType}(\Gamma ,\ b,\ T_{n})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{UnionOrSingle}([T])\ =\ T \\[0.16em]
\operatorname{UnionOrSingle}([T_{1},\ \ldots ,\ T_{n}])\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\ \Leftrightarrow \ n\ \ge \ 2
\end{array}
$$

**(PatternNarrow-Perm)**

$$
\begin{array}{l}
\operatorname{PatternNarrow}(\Gamma ,\ \mathsf{pat},\ T)\ \Downarrow \ T_{n} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{PatternNarrow}(\Gamma ,\ \mathsf{pat},\ \operatorname{TypePerm}(p,\ T))\ \Downarrow \ \operatorname{TypePerm}(p,\ T_{n})
\end{array}
$$

**(PatternNarrow-ModalRef)**

$$
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad S\ \in \ \operatorname{States}(M) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{PatternNarrow}(\Gamma ,\ \operatorname{ModalPattern}(S,\ \mathsf{io}),\ T)\ \Downarrow \ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)
\end{array}
$$

**(PatternNarrow-ModalState)**

$$
\begin{array}{l}
\operatorname{StripPerm}(T)\ =\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{PatternNarrow}(\Gamma ,\ \operatorname{ModalPattern}(S,\ \mathsf{io}),\ T)\ \Downarrow \ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S)
\end{array}
$$

**(PatternNarrow-Union)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad \mathsf{Ns}\ =\ [N_{i}\ \mid \ 1\ \le \ i\ \le \ n\ \land \ \operatorname{PatternNarrow}(\Gamma ,\ \mathsf{pat},\ T_{i})\ \Downarrow \ N_{i}]\quad \mid \mathsf{Ns}\mid \ \ge \ 1\quad \operatorname{UnionOrSingle}(\mathsf{Ns})\ =\ T_{n} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{PatternNarrow}(\Gamma ,\ \mathsf{pat},\ T)\ \Downarrow \ T_{n}
\end{array}
$$

**(PatternNarrow-Typed)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{TypedPattern}(x,\ T_{a})\ \triangleleft \ T\ \dashv \ B \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{PatternNarrow}(\Gamma ,\ \operatorname{TypedPattern}(x,\ T_{a}),\ T)\ \Downarrow \ T_{a}
\end{array}
$$

**(PatternRejectNarrow-Union)**

$$
\begin{array}{l}
T\ =\ \operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}])\quad \mathsf{Rs}\ =\ [T_{i}\ \mid \ 1\ \le \ i\ \le \ n\ \land \ \operatorname{PatternNarrow}(\Gamma ,\ \mathsf{pat},\ T_{i})\ \mathsf{undefined}]\quad 1\ \le \ \mid \mathsf{Rs}\mid \ <\ n\quad \operatorname{UnionOrSingle}(\mathsf{Rs})\ =\ T_{r} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{PatternRejectNarrow}(\Gamma ,\ \mathsf{pat},\ T)\ \Downarrow \ T_{r}
\end{array}
$$

**(CaseScope-Narrow)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \mathsf{pat}\ \triangleleft \ T_{s}\ \dashv \ B\quad \operatorname{Distinct}(\operatorname{PatNames}(\mathsf{pat}))\quad \operatorname{ScrutineeBinding}(e)\ =\ x\quad \operatorname{PatternNarrow}(\Gamma ,\ \mathsf{pat},\ T_{s})\ \Downarrow \ T_{n}\quad \operatorname{RefineBinding}(\Gamma ,\ x,\ T_{n})\ \Downarrow \ \Gamma_{r} \quad \Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma_{r} )\quad \operatorname{IntroAll}(\Gamma_{0} ,\ B)\ \Downarrow \ \Gamma_{\mathsf{case}} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{CaseScope}(\Gamma ,\ e,\ \mathsf{pat},\ T_{s})\ \Downarrow \ \Gamma_{\mathsf{case}}
\end{array}
$$

**(CaseScope-PatternOnly)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \mathsf{pat}\ \triangleleft \ T_{s}\ \dashv \ B\quad \operatorname{Distinct}(\operatorname{PatNames}(\mathsf{pat}))\quad (\operatorname{ScrutineeBinding}(e)\ =\ \bot \ \lor \ \operatorname{PatternNarrow}(\Gamma ,\ \mathsf{pat},\ T_{s})\ \mathsf{undefined})\quad \Gamma_{0} \ =\ \operatorname{PushScope}(\Gamma )\quad \operatorname{IntroAll}(\Gamma_{0} ,\ B)\ \Downarrow \ \Gamma_{\mathsf{case}} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{CaseScope}(\Gamma ,\ e,\ \mathsf{pat},\ T_{s})\ \Downarrow \ \Gamma_{\mathsf{case}}
\end{array}
$$

**(ElseScope-Narrow)**

$$
\begin{array}{l}
\operatorname{ScrutineeBinding}(e)\ =\ x\quad \operatorname{PatternRejectNarrow}(\Gamma ,\ \mathsf{pat},\ T_{s})\ \Downarrow \ T_{r}\quad \operatorname{RefineBinding}(\Gamma ,\ x,\ T_{r})\ \Downarrow \ \Gamma_{\mathsf{else}} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ElseScope}(\Gamma ,\ e,\ \mathsf{pat},\ T_{s})\ \Downarrow \ \Gamma_{\mathsf{else}}
\end{array}
$$

**(ElseScope-Original)**

$$
\begin{array}{l}
\operatorname{ScrutineeBinding}(e)\ =\ \bot \ \lor \ \operatorname{PatternRejectNarrow}(\Gamma ,\ \mathsf{pat},\ T_{s})\ \mathsf{undefined} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ElseScope}(\Gamma ,\ e,\ \mathsf{pat},\ T_{s})\ \Downarrow \ \Gamma
\end{array}
$$

**(CasesElseScope-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{CasesElseScope}(\Gamma ,\ e,\ [],\ T)\ \Downarrow \ \Gamma
\end{array}
$$

**(CasesElseScope-Cons-Narrow)**

$$
\begin{array}{l}
\operatorname{PatternRejectNarrow}(\Gamma ,\ \mathsf{pat},\ T)\ \Downarrow \ T_{r}\quad \operatorname{ElseScope}(\Gamma ,\ e,\ \mathsf{pat},\ T)\ \Downarrow \ \Gamma_{1} \quad \operatorname{CasesElseScope}(\Gamma_{1} ,\ e,\ \mathsf{cases},\ T_{r})\ \Downarrow \ \Gamma_{2} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{CasesElseScope}(\Gamma ,\ e,\ \langle \mathsf{pat},\ \mathsf{body}\rangle \ \mathbin{::} \ \mathsf{cases},\ T)\ \Downarrow \ \Gamma_{2}
\end{array}
$$

**(CasesElseScope-Cons-Original)**

$$
\begin{array}{l}
\operatorname{PatternRejectNarrow}(\Gamma ,\ \mathsf{pat},\ T)\ \mathsf{undefined}\quad \operatorname{ElseScope}(\Gamma ,\ e,\ \mathsf{pat},\ T)\ \Downarrow \ \Gamma_{1} \quad \operatorname{CasesElseScope}(\Gamma_{1} ,\ e,\ \mathsf{cases},\ T)\ \Downarrow \ \Gamma_{2} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{CasesElseScope}(\Gamma ,\ e,\ \langle \mathsf{pat},\ \mathsf{body}\rangle \ \mathbin{::} \ \mathsf{cases},\ T)\ \Downarrow \ \Gamma_{2}
\end{array}
$$

### 17.5.5 Dynamic Semantics

$$
\begin{array}{l}
\mathsf{IfCaseJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{EvalIfCaseSigma}(c,\ v,\ \sigma )\ \Downarrow \ (\mathsf{res},\ \sigma ')\} \\[0.16em]
\mathsf{IfCaseListJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{EvalIfCaseListSigma}(\mathsf{cases},\ \mathsf{else}_{\mathsf{opt}},\ v,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\}
\end{array}
$$

**(EvalIfCase-Fail)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MatchPattern}(\mathsf{pat},\ v)\ \mathsf{undefined} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalIfCaseSigma}(\langle \mathsf{pat},\ \mathsf{body}\rangle ,\ v,\ \sigma )\ \Downarrow \ (\mathsf{NoMatch},\ \sigma )
\end{array}
$$

**(EvalIfCase-Hit)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MatchPattern}(\mathsf{pat},\ v)\ \Downarrow \ B\quad \operatorname{BindOrder}(\mathsf{pat},\ B)\ =\ \mathsf{binds}\quad \operatorname{BlockEnter}(\sigma ,\ \mathsf{binds})\ \Downarrow \ (\sigma_{1} ,\ \mathsf{scope})\quad \Gamma \ \vdash \ \operatorname{EvalBlockSigma}(\mathsf{body},\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )\quad \operatorname{BlockExit}(\sigma_{2} ,\ \mathsf{scope},\ \mathsf{out})\ \Downarrow \ (\mathsf{out}',\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalIfCaseSigma}(\langle \mathsf{pat},\ \mathsf{body}\rangle ,\ v,\ \sigma )\ \Downarrow \ (\operatorname{Match}(\mathsf{out}'),\ \sigma_{3} )
\end{array}
$$

**(EvalIfCases-Head)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalIfCaseSigma}(c,\ v,\ \sigma )\ \Downarrow \ (\operatorname{Match}(\mathsf{out}),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalIfCaseListSigma}(c\mathbin{::} \mathsf{cs},\ \mathsf{else}_{\mathsf{opt}},\ v,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{1} )
\end{array}
$$

**(EvalIfCases-Tail)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalIfCaseSigma}(c,\ v,\ \sigma )\ \Downarrow \ (\mathsf{NoMatch},\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalIfCaseListSigma}(\mathsf{cs},\ \mathsf{else}_{\mathsf{opt}},\ v,\ \sigma_{1} )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalIfCaseListSigma}(c\mathbin{::} \mathsf{cs},\ \mathsf{else}_{\mathsf{opt}},\ v,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{2} )
\end{array}
$$

**(EvalIfCases-Else)**

$$
\begin{array}{l}
\mathsf{else}_{\mathsf{opt}}\ =\ b\quad \Gamma \ \vdash \ \operatorname{EvalBlockSigma}(b,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalIfCaseListSigma}([],\ \mathsf{else}_{\mathsf{opt}},\ v,\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')
\end{array}
$$

**(EvalIfCases-None)**

$$
\begin{array}{l}
\mathsf{else}_{\mathsf{opt}}\ =\ \bot \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalIfCaseListSigma}([],\ \mathsf{else}_{\mathsf{opt}},\ v,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma )
\end{array}
$$

### 17.5.6 Lowering

$$
\begin{array}{l}
\mathsf{LowerBindJudg}\ =\ \{\mathsf{LowerBindList},\ \mathsf{LowerBindPattern},\ \mathsf{LowerIfCases}\} \\[0.16em]
\mathsf{PatternLowerJudg}\ =\ \{\mathsf{LowerBindPattern},\ \mathsf{LowerBindList},\ \mathsf{LowerIfCases},\ \mathsf{TagOf}\}
\end{array}
$$

When `else_opt = ⊥`, `LowerIfCases` MUST emit a trailing arm that lowers to `LowerPanic(MatchFail)`; the arm is reached only when no case clause matches.

**(Lower-Pat-Correctness)**

$$
\begin{array}{l}
\forall \ v,\ \Gamma \ \vdash \ \operatorname{MatchPattern}(\mathsf{pat},\ v)\ \Downarrow \ B\ \Rightarrow \ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\mathsf{ok},\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerBindPattern}(\mathsf{pat},\ v)\ \Downarrow \ \mathsf{IR} \\[0.16em]
\operatorname{IfCaseValueCorrect}(\Gamma ,\ \mathsf{scrut},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}},\ v)\ \Leftrightarrow \ \forall \ \sigma ,\ v',\ \sigma '.\ \Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{IfCaseExpr}(\mathsf{scrut},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}}),\ \sigma )\ \Downarrow \ (\operatorname{Val}(v'),\ \sigma ')\ \Rightarrow \ v\ =\ v'
\end{array}
$$

**(Lower-IfCases-Correctness)**

$$
\begin{array}{l}
\forall \ \sigma ,\ \Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{IfCaseExpr}(\mathsf{scrut},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\ \Rightarrow \ \operatorname{ExecIRSigma}(\mathsf{IR},\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma ')\quad \operatorname{IfCaseValueCorrect}(\Gamma ,\ \mathsf{scrut},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}},\ v) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIfCases}(\mathsf{scrut},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ \Downarrow \ \langle \mathsf{IR},\ v\rangle
\end{array}
$$

$$
\begin{array}{l}
\operatorname{EnumValuePath}(v)\ =\ \mathsf{path}\ \Leftrightarrow \ v\ =\ \operatorname{EnumValue}(\mathsf{path},\ \mathsf{payload}) \\[0.16em]
\operatorname{VariantIndex}(E,\ \mathsf{name})\ =\ i\ \Leftrightarrow \ \operatorname{Variants}(E)\ =\ [v_{0},\ \ldots ,\ v_{k}]\ \land \ v_{i}.\mathsf{name}\ =\ \mathsf{name} \\[0.16em]
\operatorname{EnumDisc}(E,\ \mathsf{name})\ =\ d\ \Leftrightarrow \ \operatorname{EnumDiscriminants}(E)\ \Downarrow \ \mathsf{ds}\ \land \ \operatorname{VariantIndex}(E,\ \mathsf{name})\ =\ i\ \land \ \mathsf{ds}[i]\ =\ d \\[0.16em]
\operatorname{StateIndex}(M,\ S)\ =\ i\ \Leftrightarrow \ \operatorname{States}(M)\ =\ [S_{0},\ \ldots ,\ S_{k}]\ \land \ S_{i}\ =\ S
\end{array}
$$

**(TagOf-Enum)**

$$
\begin{array}{l}
\operatorname{EnumValuePath}(v)\ =\ \mathsf{path}\quad \operatorname{EnumPath}(\mathsf{path})\ =\ p\quad T\ =\ \operatorname{TypePath}(p)\quad \operatorname{EnumDecl}(p)\ =\ E\quad \operatorname{VariantName}(\mathsf{path})\ =\ \mathsf{name}\quad \operatorname{EnumDisc}(E,\ \mathsf{name})\ =\ d \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TagOf}(v,\ T)\ \Downarrow \ d
\end{array}
$$

**(TagOf-Modal)**

$$
\begin{array}{l}
v\ =\ \langle S,\ v_{S}\rangle \quad T\ =\ \operatorname{ModalRefType}(\mathsf{modal}_{\mathsf{ref}})\quad \operatorname{ModalDeclOf}(\mathsf{modal}_{\mathsf{ref}})\ =\ M\quad \operatorname{StateIndex}(M,\ S)\ =\ i \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{TagOf}(v,\ T)\ \Downarrow \ i
\end{array}
$$

**(Lower-BindList-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerBindList}([])\ \Downarrow \ \varepsilon
\end{array}
$$

**(Lower-BindList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerBindList}(\mathsf{bs})\ \Downarrow \ \mathsf{IR}_{r} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerBindList}([\langle x,\ v\rangle ]\ \mathbin{++} \ \mathsf{bs})\ \Downarrow \ \operatorname{SeqIR}(\operatorname{BindVarIR}(x,\ v),\ \mathsf{IR}_{r})
\end{array}
$$

**(Lower-Pat-General)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{MatchPattern}(\mathsf{pat},\ v)\ \Downarrow \ B\quad \operatorname{BindOrder}(\mathsf{pat},\ B)\ =\ \mathsf{binds}\quad \Gamma \ \vdash \ \operatorname{LowerBindList}(\mathsf{binds})\ \Downarrow \ \mathsf{IR} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerBindPattern}(\mathsf{pat},\ v)\ \Downarrow \ \mathsf{IR}
\end{array}
$$

**(Lower-Pat-Err)**
MatchPattern(pat, v) undefined

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerBindPattern}(\mathsf{pat},\ v)\ \Uparrow
\end{array}
$$

**(Lower-IfCases)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(\mathsf{scrut})\ \Downarrow \ \langle \mathsf{IR}_{s},\ v_{s}\rangle \quad \Gamma ;\ R;\ L\ \vdash \ \mathsf{scrut}\ :\ T_{s}\quad \forall \ i,\ \mathsf{case}_{i}\ =\ \langle p_{i},\ b_{i}\rangle \quad \forall \ i,\ \operatorname{CaseScope}(\Gamma ,\ \mathsf{scrut},\ p_{i},\ T_{s})\ \Downarrow \ \Gamma_{i} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerIfCases}(\mathsf{scrut},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{s},\ \operatorname{IfCaseIR}(v_{s},\ \mathsf{cases},\ \mathsf{else}_{\mathsf{opt}})),\ v_{\mathsf{case}}\rangle
\end{array}
$$

### 17.5.7 Diagnostics

No additional named diagnostics are introduced for case-clause structure beyond the diagnostics of the contained patterns and the exhaustiveness rules in §17.6.
