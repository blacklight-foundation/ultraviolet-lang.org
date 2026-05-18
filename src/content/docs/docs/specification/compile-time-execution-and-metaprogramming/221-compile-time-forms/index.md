---
title: "22.1 Compile-Time Forms"
description: "22.1 Compile-Time Forms from 22. Compile-Time Execution and Metaprogramming of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "compile-time-execution-and-metaprogramming"
specSection: "221-compile-time-forms"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/compile-time-execution-and-metaprogramming/">22. Compile-Time Execution and Metaprogramming</a>
  <span>Compile-Time Execution and Metaprogramming</span>
</div>

## 22.1 Compile-Time Forms

### 22.1.1 Syntax

```text
comptime_stmt           ::= attribute_list? "comptime" block_expr
comptime_expr           ::= attribute_list? "comptime" "{" expression "}"
comptime_if             ::= "comptime" "if" expression block_expr ("else" (comptime_if | block_expr))?
comptime_loop           ::= "comptime" "loop" pattern (":" type)? "in" expression block_expr
comptime_procedure_decl ::= attribute_list? "comptime" visibility? "procedure" identifier generic_params? signature contract_clause? block_expr
type_literal            ::= "Type" "::<" type ">"
```

### 22.1.2 Parsing

$$
\mathsf{CtParseJudg}\ =\ \{\mathsf{ParseCtStmt},\ \mathsf{ParseCtExpr},\ \mathsf{ParseCtIf},\ \mathsf{ParseCtLoopIter},\ \mathsf{ParseCtProc},\ \mathsf{ParseCtElseOpt}\}
$$

**(Parse-CtProc)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{0}),\ \texttt{comptime})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(\operatorname{Advance}(P_{0}))\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{procedure})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseGenericParamsOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseSignature}(P_{3})\ \Downarrow \ (P_{4},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseContractClauseOpt}(P_{4})\ \Downarrow \ (P_{5},\ \mathsf{contract}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(P_{5})\ \Downarrow \ (P_{6},\ \mathsf{body}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseItem}(P)\ \Downarrow \ (P_{6},\ \operatorname{CtProc}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \operatorname{SpanBetween}(P,\ P_{6}),\ []))
\end{array}
$$

**(Parse-CtStmt)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{0}),\ \texttt{comptime})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P_{0})),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(\operatorname{Advance}(P_{0}))\ \Downarrow \ (P_{1},\ \mathsf{body}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStmt}(P)\ \Downarrow \ (P_{1},\ \operatorname{CtStmt}(\mathsf{body},\ \mathsf{attrs}_{\mathsf{opt}},\ \operatorname{SpanBetween}(P,\ P_{1})))
\end{array}
$$

**(Parse-CtExpr)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{0}),\ \texttt{comptime})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P_{0})),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(\operatorname{Advance}(P_{0})))\ \Downarrow \ (P_{1},\ \mathsf{body})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseExpr}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{CtExpr}(\mathsf{body},\ \mathsf{attrs}_{\mathsf{opt}},\ \operatorname{SpanBetween}(P,\ \operatorname{Advance}(P_{1}))))
\end{array}
$$

**(Parse-CtIf)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{comptime})\quad \operatorname{IsKw}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{if})\quad \Gamma \ \vdash \ \operatorname{ParseExpr_NoBrace}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ \mathsf{cond})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{then}_{\mathsf{blk}})\quad \Gamma \ \vdash \ \operatorname{ParseCtElseOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{else}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseExpr}(P)\ \Downarrow \ (P_{3},\ \operatorname{CtIf}(\mathsf{cond},\ \mathsf{then}_{\mathsf{blk}},\ \mathsf{else}_{\mathsf{opt}},\ \operatorname{SpanBetween}(P,\ P_{3})))
\end{array}
$$

**(Parse-CtLoopIter)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{comptime})\quad \operatorname{IsKw}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{loop})\quad \Gamma \ \vdash \ \operatorname{TryParsePatternIn}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ \mathsf{pat})\quad \Gamma \ \vdash \ \operatorname{ParseTypeAnnotOpt}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{ty}_{\mathsf{opt}})\quad \operatorname{Ctx}(\operatorname{Tok}(P_{2}),\ \texttt{"in"})\quad \Gamma \ \vdash \ \operatorname{ParseExpr_NoBrace}(\operatorname{Advance}(P_{2}))\ \Downarrow \ (P_{3},\ \mathsf{src})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(P_{3})\ \Downarrow \ (P_{4},\ \mathsf{body}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseExpr}(P)\ \Downarrow \ (P_{4},\ \operatorname{CtLoopIter}(\mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{src},\ \mathsf{body},\ \operatorname{SpanBetween}(P,\ P_{4})))
\end{array}
$$

**(Parse-CtElseOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{else}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseCtElseOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-CtElseOpt-Block)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{else})\quad \lnot \ \operatorname{IsKw}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{comptime})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{body}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseCtElseOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{body})
\end{array}
$$

**(Parse-CtElseOpt-ElseIf)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{else})\quad \operatorname{IsKw}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{comptime})\quad \operatorname{IsKw}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))),\ \texttt{if})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e_{\mathsf{if}})\quad e_{\mathsf{if}}\ =\ \operatorname{CtIf}(\_,\ \_,\ \_,\ \_) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseCtElseOpt}(P)\ \Downarrow \ (P_{1},\ \operatorname{BlockExpr}([\operatorname{ExprStmt}(e_{\mathsf{if}})],\ \bot ))
\end{array}
$$

### 22.1.3 AST Representation / Form

$$
\mathsf{CtNode}\ =\ \{\mathsf{CtStmt},\ \mathsf{CtExpr},\ \mathsf{CtIf},\ \mathsf{CtLoopIter},\ \mathsf{CtProc}\}
$$

CtStmt(body, attrs_opt, span) is a compile-time statement block.
CtExpr(body, attrs_opt, span) is a compile-time expression.
CtIf(cond, then_blk, else_opt, span) is a compile-time branch.
CtLoopIter(pat, ty_opt, src, body, span) is a compile-time iterator-unrolling form.
CtProc(attrs_opt, vis, name, gen_params_opt, params, ret_opt, contract_opt, body, span, doc) is a compile-time procedure declaration.

$$
\begin{array}{l}
\mathsf{CtSite}\ =\ \langle \mathsf{module}_{\mathsf{path}},\ \mathsf{ordinal},\ \mathsf{span}\rangle  \\[0.16em]
\mathsf{CtEnv}\ =\ \langle \mathsf{vals},\ \mathsf{procs},\ \mathsf{caps},\ \mathsf{site},\ \mathsf{quote}_{\mathsf{ctx}}\rangle  \\[0.16em]
\mathsf{CtMachine}\ =\ \langle \mathsf{files},\ \mathsf{project}_{\mathsf{root}},\ \mathsf{diags},\ \mathsf{pending}_{\mathsf{emits}},\ \mathsf{next}_{\mathsf{hygiene}}\rangle  \\[0.16em]
\mathsf{CtQuoteCtx}\ =\ \bot \ \mid \ \langle \mathsf{kind},\ \mathsf{quote}_{\mathsf{site}}\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{CtVals}(\langle \mathsf{vals},\ \mathsf{procs},\ \mathsf{caps},\ \mathsf{site},\ \mathsf{quote}_{\mathsf{ctx}}\rangle )\ =\ \mathsf{vals} \\[0.16em]
\operatorname{CtProcs}(\langle \mathsf{vals},\ \mathsf{procs},\ \mathsf{caps},\ \mathsf{site},\ \mathsf{quote}_{\mathsf{ctx}}\rangle )\ =\ \mathsf{procs} \\[0.16em]
\operatorname{CtCaps}(\langle \mathsf{vals},\ \mathsf{procs},\ \mathsf{caps},\ \mathsf{site},\ \mathsf{quote}_{\mathsf{ctx}}\rangle )\ =\ \mathsf{caps} \\[0.16em]
\operatorname{CtSiteOf}(\langle \mathsf{vals},\ \mathsf{procs},\ \mathsf{caps},\ \mathsf{site},\ \mathsf{quote}_{\mathsf{ctx}}\rangle )\ =\ \mathsf{site} \\[0.16em]
\operatorname{CtQuoteCtxOf}(\langle \mathsf{vals},\ \mathsf{procs},\ \mathsf{caps},\ \mathsf{site},\ \mathsf{quote}_{\mathsf{ctx}}\rangle )\ =\ \mathsf{quote}_{\mathsf{ctx}}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{CtFiles}(\langle \mathsf{files},\ \mathsf{project}_{\mathsf{root}},\ \mathsf{diags},\ \mathsf{pending}_{\mathsf{emits}},\ \mathsf{next}_{\mathsf{hygiene}}\rangle )\ =\ \mathsf{files} \\[0.16em]
\operatorname{CtProjectRoot}(\langle \mathsf{files},\ \mathsf{project}_{\mathsf{root}},\ \mathsf{diags},\ \mathsf{pending}_{\mathsf{emits}},\ \mathsf{next}_{\mathsf{hygiene}}\rangle )\ =\ \mathsf{project}_{\mathsf{root}} \\[0.16em]
\operatorname{CtDiags}(\langle \mathsf{files},\ \mathsf{project}_{\mathsf{root}},\ \mathsf{diags},\ \mathsf{pending}_{\mathsf{emits}},\ \mathsf{next}_{\mathsf{hygiene}}\rangle )\ =\ \mathsf{diags} \\[0.16em]
\operatorname{CtPendingEmits}(\langle \mathsf{files},\ \mathsf{project}_{\mathsf{root}},\ \mathsf{diags},\ \mathsf{pending}_{\mathsf{emits}},\ \mathsf{next}_{\mathsf{hygiene}}\rangle )\ =\ \mathsf{pending}_{\mathsf{emits}} \\[0.16em]
\operatorname{CtFreshSeed}(\langle \mathsf{files},\ \mathsf{project}_{\mathsf{root}},\ \mathsf{diags},\ \mathsf{pending}_{\mathsf{emits}},\ \mathsf{next}_{\mathsf{hygiene}}\rangle )\ =\ \mathsf{next}_{\mathsf{hygiene}}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{CtAvailableJudg}\ =\ \{\mathsf{CtAvail}\} \\[0.16em]
\mathsf{CtLiteralJudg}\ =\ \{\mathsf{CtLiteralize}\} \\[0.16em]
\mathsf{CtEvalJudg}\ =\ \{\mathsf{CtEval},\ \mathsf{CtExec}\} \\[0.16em]
\mathsf{CtExpandableJudg}\ =\ \{\mathsf{CtExpandExpr},\ \mathsf{CtExpandStmt},\ \mathsf{CtExpandStmtSeq},\ \mathsf{CtExpandBlock},\ \mathsf{CtExpandItem},\ \mathsf{CtExpandItemSeq}\} \\[0.16em]
\mathsf{CtBuiltinCallJudg}\ =\ \{\mathsf{CtBuiltinCall}\} \\[0.16em]
\mathsf{CtOrderJudg}\ =\ \{\mathsf{Phase2ModuleOrder}\} \\[0.16em]
\mathsf{CtPassJudg}\ =\ \{\mathsf{ComptimePass},\ \mathsf{CtExecModule},\ \mathsf{CtExecModuleSeq}\}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{CtValue}\ \mathbin{::} =\ \operatorname{CtPrim}(v)\ \mid \ \operatorname{CtString}(v)\ \mid \ \operatorname{CtBytes}(v)\ \mid \ \operatorname{CtType}(T)\ \mid \ \operatorname{CtAst}(a)\ \mid \ \operatorname{CtTuple}([\mathsf{CtValue}])\ \mid \ \operatorname{CtArray}([\mathsf{CtValue}])\ \mid \ \operatorname{CtSlice}([\mathsf{CtValue}])\ \mid \ \operatorname{CtRecord}(\mathsf{path},\ \mathsf{fields})\ \mid \ \operatorname{CtEnum}(\mathsf{path},\ \mathsf{variant},\ \mathsf{payload}) \\[0.16em]
\mathsf{CtPayload}\ \mathbin{::} =\ \bot \ \mid \ \operatorname{CtTuplePayload}([\mathsf{CtValue}])\ \mid \ \operatorname{CtRecordPayload}([\langle \mathsf{field},\ \mathsf{CtValue}\rangle ]) \\[0.16em]
\operatorname{CtIterable}(v)\ \Leftrightarrow \ v\ =\ \operatorname{CtArray}(\_)\ \lor \ v\ =\ \operatorname{CtSlice}(\_) \\[0.16em]
\operatorname{CtIterableType}(T)\ \Leftrightarrow \ T\ =\ \operatorname{TypeArray}(U,\ \_)\ \lor \ T\ =\ \operatorname{TypeSlice}(U) \\[0.16em]
\operatorname{ElemType}(\operatorname{TypeArray}(U,\ \_))\ =\ U \\[0.16em]
\operatorname{ElemType}(\operatorname{TypeSlice}(U))\ =\ U \\[0.16em]
\operatorname{CtMetaFree}(n)\ \Leftrightarrow \ n\ \mathsf{contains}\ \mathsf{no}\ \mathsf{node}\ \mathsf{owned}\ \mathsf{by}\ \S \S 22.2\ \mathsf{through}\ 22.5
\end{array}
$$

### 22.1.4 Static Semantics

In the rules below, `Γ_ct` denotes the typing environment obtained by extending `Γ` with the local bindings of the current compile-time body, the compile-time procedure bindings introduced earlier in the same Phase 2 source order, and the capability bindings admitted by §22.2 for the current site.

CtAvail(TypePrim(_))
CtAvail(TypeString(`@View`))
CtAvail(TypeString(`@Managed`))
CtAvail(TypeBytes(`@View`))
CtAvail(TypeBytes(`@Managed`))

$$
\begin{array}{l}
\operatorname{CtAvail}(\operatorname{TypePath}([\texttt{Type}])) \\[0.16em]
\operatorname{CtAvail}(\operatorname{TypePath}([\texttt{Ast}])) \\[0.16em]
\operatorname{CtAvail}(\operatorname{TypePath}([\texttt{Ast},\ \texttt{Expr}])) \\[0.16em]
\operatorname{CtAvail}(\operatorname{TypePath}([\texttt{Ast},\ \texttt{Stmt}])) \\[0.16em]
\operatorname{CtAvail}(\operatorname{TypePath}([\texttt{Ast},\ \texttt{Item}])) \\[0.16em]
\operatorname{CtAvail}(\operatorname{TypePath}([\texttt{Ast},\ \texttt{Type}])) \\[0.16em]
\operatorname{CtAvail}(\operatorname{TypePath}([\texttt{Ast},\ \texttt{Pattern}]))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{CtAvail}(\operatorname{TypeTuple}(\mathsf{Ts}))\ \Leftrightarrow \ \forall \ T\ \in \ \mathsf{Ts}.\ \operatorname{CtAvail}(T) \\[0.16em]
\operatorname{CtAvail}(\operatorname{TypeArray}(T,\ \_))\ \Leftrightarrow \ \operatorname{CtAvail}(T) \\[0.16em]
\operatorname{CtAvail}(\operatorname{TypeSlice}(T))\ \Leftrightarrow \ \operatorname{CtAvail}(T) \\[0.16em]
\operatorname{CtAvail}(\operatorname{TypePath}(p))\ \Leftrightarrow \ \operatorname{RecordDecl}(p)\ =\ R\ \land \ \forall \ f\ \in \ \operatorname{Fields}(R).\ \operatorname{CtAvail}(\operatorname{StripPerm}(f.\mathsf{type})) \\[0.16em]
\operatorname{CtAvail}(\operatorname{TypePath}(p))\ \Leftrightarrow \ \operatorname{EnumDecl}(p)\ =\ E\ \land \ \forall \ v\ \in \ \operatorname{Variants}(E).\ \forall \ T\ \in \ \operatorname{PayloadTypes}(v).\ \operatorname{CtAvail}(\operatorname{StripPerm}(T)) \\[0.16em]
\operatorname{CtAvail}(\operatorname{TypePerm}(\_,\ T))\ \Leftrightarrow \ \operatorname{CtAvail}(T)
\end{array}
$$

$$
\operatorname{CtForbiddenType}(T)\ \Leftrightarrow \ \operatorname{CapInType}(T)\ \ne \ \emptyset \ \lor \ \operatorname{StripPerm}(T)\ =\ \operatorname{TypeModalState}(\_,\ \_)\ \lor \ \operatorname{StripPerm}(T)\ =\ \operatorname{TypeDynamic}(\_)\ \lor \ \operatorname{StripPerm}(T)\ =\ \operatorname{TypePtr}(\_,\ \_)\ \lor \ \operatorname{StripPerm}(T)\ =\ \operatorname{TypeRawPtr}(\_,\ \_)\ \lor \ \operatorname{StripPerm}(T)\ =\ \operatorname{TypeFunc}(\_,\ \_)\ \lor \ \operatorname{AliasNorm}(T)\ =\ \operatorname{TypePath}([\texttt{"Context"}])
$$

A conforming implementation MUST reject any compile-time expression, compile-time variable, compile-time procedure parameter, or compile-time procedure return type for which `CtForbiddenType(T)` holds or `CtAvail(T)` does not hold.

The following constructs are prohibited inside compile-time execution:
- region allocation and frame operations
- key acquisition blocks and dynamic key synchronization
- `parallel`, `spawn`, `dispatch`, `wait`, `yield`, `yield from`, `sync`, `race`, and `all`
- raw-pointer dereference, `transmute`, and any `unsafe`-only operation
- any call that crosses an FFI boundary

**(T-CtStmt)**

$$
\begin{array}{l}
\Gamma_{\mathsf{ct}} \ \vdash \ \mathsf{body}\ :\ \operatorname{TypePrim}(\texttt{"()"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtStmt}(\mathsf{body},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{span})\ :\ \operatorname{TypePrim}(\texttt{"()"})
\end{array}
$$

**(T-CtExpr)**

$$
\begin{array}{l}
\Gamma_{\mathsf{ct}} \ \vdash \ \mathsf{body}\ :\ T\quad \operatorname{CtAvail}(T)\quad \lnot \ \operatorname{CtForbiddenType}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtExpr}(\mathsf{body},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{span})\ :\ T
\end{array}
$$

**(T-CtIf)**

$$
\begin{array}{l}
\Gamma_{\mathsf{ct}} \ \vdash \ \mathsf{cond}\ :\ \operatorname{TypePrim}(\texttt{"bool"})\quad \Gamma_{\mathsf{ct}} \ \vdash \ \mathsf{then}_{\mathsf{blk}}\ :\ U\quad \Gamma_{\mathsf{ct}} \ \vdash \ \mathsf{else}_{\mathsf{blk}}\ :\ U \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtIf}(\mathsf{cond},\ \mathsf{then}_{\mathsf{blk}},\ \mathsf{else}_{\mathsf{blk}},\ \mathsf{span})\ :\ U
\end{array}
$$

**(T-CtLoopIter)**

$$
\begin{array}{l}
\Gamma_{\mathsf{ct}} \ \vdash \ \mathsf{src}\ :\ T_{\mathsf{src}}\quad \operatorname{CtIterableType}(T_{\mathsf{src}})\quad (\mathsf{ty}_{\mathsf{opt}}\ =\ \bot \ \Rightarrow \ T_{\mathsf{elem}}\ =\ \operatorname{ElemType}(T_{\mathsf{src}}))\quad (\mathsf{ty}_{\mathsf{opt}}\ =\ T_{\mathsf{ann}}\ \Rightarrow \ \operatorname{ElemType}(T_{\mathsf{src}})\ \mathrel{<:} \ T_{\mathsf{ann}}\ \land \ T_{\mathsf{elem}}\ =\ T_{\mathsf{ann}})\quad \Gamma_{\mathsf{ct}} ,\ \mathsf{pat}\ :\ T_{\mathsf{elem}}\ \vdash \ \mathsf{body}\ :\ \operatorname{TypePrim}(\texttt{"()"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtLoopIter}(\mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{src},\ \mathsf{body},\ \mathsf{span})\ :\ \operatorname{TypePrim}(\texttt{"()"})
\end{array}
$$

**(T-CtProc)**

$$
\begin{array}{l}
\mathsf{proc}\ =\ \operatorname{CtProc}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\quad \forall \ \langle \_,\ \_,\ T\rangle \ \in \ \mathsf{params}.\ \operatorname{CtAvail}(T)\ \land \ \lnot \ \operatorname{CtForbiddenType}(T)\quad \operatorname{CtAvail}(\operatorname{ProcReturn}(\mathsf{ret}_{\mathsf{opt}}))\quad \lnot \ \operatorname{CtForbiddenType}(\operatorname{ProcReturn}(\mathsf{ret}_{\mathsf{opt}}))\quad \Gamma_{\mathsf{ct}} ,\ \mathsf{params}\ \vdash \ \mathsf{body}\ :\ \operatorname{ProcReturn}(\mathsf{ret}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{proc}\ :\ \mathsf{wf}
\end{array}
$$

Compile-time procedure contracts use the ordinary `contract_clause` surface of §14.6. At each compile-time call site, the precondition is evaluated before body execution and the postcondition is evaluated on the returned value. If any evaluated contract predicate is `false`, the call is ill-formed.

Compile-time procedures MUST be callable only from compile-time contexts. Runtime expressions and runtime procedure bodies MUST NOT name, take the address of, store, or call a compile-time procedure.

For `comptime if`, only the selected branch becomes part of the expanded program.
For `comptime loop`, the source value MUST be finite and iteration order MUST equal the canonical element order of the source value.
`comptime loop` imposes no item-kind uniformity constraint across iterations. If loop-body execution emits declarations, the resulting emitted-item sequence is the concatenation of each iteration's emitted items in canonical iteration order.

### 22.1.5 Dynamic Semantics

$$
\operatorname{Phase2ModuleOrder}(P)\ =\ [M_{1},\ \ldots ,\ M_{k}]\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{ParseModules}(P)\ \Downarrow \ [M_{1},\ \ldots ,\ M_{k}]
$$

$$
\begin{array}{l}
\operatorname{CtEmptyEnv}(M)\ =\ \langle \emptyset ,\ \emptyset ,\ \emptyset ,\ \langle M.\mathsf{path},\ 0,\ \bot \rangle ,\ \bot \rangle  \\[0.16em]
\operatorname{WithCtSite}(\Xi ,\ \mathsf{ord},\ \mathsf{sp})\ =\ \Xi '\ \Leftrightarrow \ \operatorname{CtSiteOf}(\Xi )\ =\ \langle \mathsf{mp},\ \_,\ \_\rangle \ \land \ \Xi '\ =\ \langle \operatorname{CtVals}(\Xi ),\ \operatorname{CtProcs}(\Xi ),\ \operatorname{CtCaps}(\Xi ),\ \langle \mathsf{mp},\ \mathsf{ord},\ \mathsf{sp}\rangle ,\ \operatorname{CtQuoteCtxOf}(\Xi )\rangle  \\[0.16em]
\operatorname{BindCtProc}(\Xi ,\ \mathsf{proc})\ =\ \Xi '\ \Leftrightarrow \ \mathsf{proc}\ =\ \operatorname{CtProc}(\_,\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \land \ \Xi '\ =\ \langle \operatorname{CtVals}(\Xi ),\ \operatorname{CtProcs}(\Xi )[\mathsf{name}\ \mapsto \ \mathsf{proc}],\ \operatorname{CtCaps}(\Xi ),\ \operatorname{CtSiteOf}(\Xi ),\ \operatorname{CtQuoteCtxOf}(\Xi )\rangle  \\[0.16em]
\operatorname{UnitBlockStmts}(\operatorname{BlockExpr}(\mathsf{stmts},\ \bot ))\ =\ \mathsf{stmts} \\[0.16em]
\operatorname{UnitBlockStmts}(\operatorname{BlockExpr}(\mathsf{stmts},\ \mathsf{tail}))\ =\ \mathsf{stmts}\ \mathbin{++} \ [\operatorname{ExprStmt}(\mathsf{tail})] \\[0.16em]
\operatorname{ElseBlock}(\mathsf{else}_{\mathsf{opt}})\ =\ \mathsf{else}_{\mathsf{opt}}\quad \mathsf{if}\ \mathsf{else}_{\mathsf{opt}}\ \ne \ \bot  \\[0.16em]
\operatorname{ElseBlock}(\mathsf{else}_{\mathsf{opt}})\ =\ \operatorname{BlockExpr}([],\ \operatorname{TupleExpr}([]))\quad \mathsf{otherwise} \\[0.16em]
\operatorname{CtElems}(\operatorname{CtArray}(\mathsf{vs}))\ =\ \mathsf{vs} \\[0.16em]
\operatorname{CtElems}(\operatorname{CtSlice}(\mathsf{vs}))\ =\ \mathsf{vs} \\[0.16em]
\operatorname{BindPatternCt}(\Xi ,\ \mathsf{pat},\ v)\ =\ \Xi '\ \mathsf{iff}\ \mathsf{the}\ \mathsf{ordinary}\ \mathsf{loop}-\mathsf{pattern}\ \mathsf{binding}\ \mathsf{rules}\ \mathsf{bind}\ \mathsf{the}\ \mathsf{names}\ \mathsf{of}\ \texttt{pat}\ \mathsf{to}\ \texttt{v}\ \mathsf{in}\ \texttt{CtVals(Xi')}\ \mathsf{and}\ \mathsf{leave}\ \texttt{CtProcs},\ \texttt{CtCaps},\ \mathsf{and}\ \texttt{CtSiteOf}\ \mathsf{unchanged}.
\end{array}
$$

A conforming implementation MUST satisfy all of the following:
1. `ComptimePass` evaluates modules in `Phase2ModuleOrder(P)` and no other order.
2. Within one module, compile-time sites execute in source order after earlier emitted declarations from that same module have been incorporated.
3. `CtProc` declarations are Phase 2 bindings only and MUST NOT survive into the expanded Phase 3 module set.
4. `CtStmt` contributes no runtime statement; its only externally relevant effects are declaration emission and diagnostics.
5. `CtExpr` is replaced before Phase 3 by the result of `CtLiteralize` or by the payload of a category-compatible `CtAst`.
6. Any item emitted at a Phase 2 site becomes visible immediately after that site to later Phase 2 execution in the same module and to Phase 3 over the final expanded module set.

For every expression, statement, and block form not introduced by Chapter 22, `CtEval` and `CtExec` use the same child order, scope creation, pattern binding, control propagation, and operator semantics as the corresponding ordinary relations of Chapters 18 through 21, with values ranging over `CtValue` and fixed compile-time bindings dispatched through `CtBuiltinCall`.

For every item, statement, block, or expression constructor not introduced by Chapter 22, the corresponding `CtExpand*` relation recursively expands its direct child nodes in source order, rebuilds the same outer constructor from the expanded children, and concatenates emitted-item lists in that traversal order.

**(ComptimePass-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtExecModuleSeq}([],\ \Phi )\ \Downarrow \ ([],\ \Phi )
\end{array}
$$

**(ComptimePass-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CtExecModule}(M_{1},\ \Phi_{0} )\ \Downarrow \ (M_{1}',\ \Phi_{1} )\quad \Gamma \ \vdash \ \operatorname{CtExecModuleSeq}([M_{2},\ \ldots ,\ M_{k}],\ \Phi_{1} )\ \Downarrow \ ([M_{2}',\ \ldots ,\ M_{k}'],\ \Phi_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtExecModuleSeq}([M_{1},\ \ldots ,\ M_{k}],\ \Phi_{0} )\ \Downarrow \ ([M_{1}',\ M_{2}',\ \ldots ,\ M_{k}'],\ \Phi_{2} )
\end{array}
$$

**(ComptimePass)**

$$
\begin{array}{l}
\operatorname{Phase2ModuleOrder}(P)\ =\ [M_{1},\ \ldots ,\ M_{k}]\quad \mathsf{root}_{0}\ =\ P.\mathsf{root}\quad \Phi_{0} \ =\ \langle \mathsf{files}_{0},\ \mathsf{root}_{0},\ [],\ [],\ 0\rangle \quad \Gamma \ \vdash \ \operatorname{CtExecModuleSeq}([M_{1},\ \ldots ,\ M_{k}],\ \Phi_{0} )\ \Downarrow \ ([M_{1}',\ \ldots ,\ M_{k}'],\ \Phi_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ComptimePass}(P,\ [M_{1},\ \ldots ,\ M_{k}])\ \Downarrow \ [M_{1}',\ \ldots ,\ M_{k}']
\end{array}
$$

where `files_0` is the deterministic project-file snapshot defined by §22.2.5.

**(CtExecModule)**

$$
\begin{array}{l}
\Xi_{0} \ =\ \operatorname{CtEmptyEnv}(M)\quad \Gamma \ \vdash \ \operatorname{CtExpandItemSeq}(M.\mathsf{items},\ \Xi_{0} ,\ \Phi ,\ 0)\ \Downarrow \ (\mathsf{items}',\ \Xi_{1} ,\ \Phi_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtExecModule}(M,\ \Phi )\ \Downarrow \ (\langle M.\mathsf{path},\ \mathsf{items}',\ M.\mathsf{module}_{\mathsf{doc}}\rangle ,\ \Phi_{1} )
\end{array}
$$

**(CtExpandItemSeq-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtExpandItemSeq}([],\ \Xi ,\ \Phi ,\ \mathsf{ord})\ \Downarrow \ ([],\ \Xi ,\ \Phi )
\end{array}
$$

**(CtExpandItemSeq-Cons)**

$$
\begin{array}{l}
\operatorname{WithCtSite}(\Xi ,\ \mathsf{ord},\ \bot )\ =\ \Xi_{0} \quad \Gamma \ \vdash \ \operatorname{CtExpandItem}(\Xi_{0} ,\ \Phi_{0} ,\ \mathsf{it})\ \Downarrow \ (\langle \mathsf{keep}_{\mathsf{items}},\ \mathsf{emit}_{\mathsf{items}}\rangle ,\ \Xi_{1} ,\ \Phi_{1} )\quad \Gamma \ \vdash \ \operatorname{CtExpandItemSeq}(\mathsf{emit}_{\mathsf{items}}\ \mathbin{++} \ \mathsf{rest},\ \Xi_{1} ,\ \Phi_{1} ,\ \mathsf{ord}\ +\ 1)\ \Downarrow \ (\mathsf{rest}',\ \Xi_{2} ,\ \Phi_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtExpandItemSeq}([\mathsf{it}]\ \mathbin{++} \ \mathsf{rest},\ \Xi ,\ \Phi_{0} ,\ \mathsf{ord})\ \Downarrow \ (\mathsf{keep}_{\mathsf{items}}\ \mathbin{++} \ \mathsf{rest}',\ \Xi_{2} ,\ \Phi_{2} )
\end{array}
$$

$$
\texttt{CtExpandItem}\ \mathsf{returns}\ a\ \mathsf{pair}\ \texttt{<keep\_items, emit\_items>},\ \mathsf{where}\ \texttt{keep\_items}\ \mathsf{replaces}\ \mathsf{the}\ \mathsf{current}\ \mathsf{item}\ \mathsf{position}\ \mathsf{and}\ \texttt{emit\_items}\ \mathsf{is}\ \mathsf{inserted}\ \mathsf{immediately}\ \mathsf{after}\ \mathsf{that}\ \mathsf{position}.
$$

Any `CtBuiltinCall` that emits declarations appends them to `CtPendingEmits(Φ)`. Before `CtExpandItem` returns to `CtExpandItemSeq`, it MUST transfer the accumulated `CtPendingEmits(Φ)` into its returned `emit_items` list in append order and clear the pending-emission queue in the resulting `Φ`.

**(CtExpandItem-CtProc)**

$$
\begin{array}{l}
\mathsf{proc}\ =\ \operatorname{CtProc}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\quad \operatorname{BindCtProc}(\Xi ,\ \mathsf{proc})\ =\ \Xi_{1}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtExpandItem}(\Xi ,\ \Phi ,\ \mathsf{proc})\ \Downarrow \ (\langle [],\ []\rangle ,\ \Xi_{1} ,\ \Phi )
\end{array}
$$

**(CtExpandStmtSeq-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtExpandStmtSeq}([],\ \Xi ,\ \Phi )\ \Downarrow \ ([],\ \Xi ,\ \Phi )
\end{array}
$$

**(CtExpandStmtSeq-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CtExpandStmt}(\Xi ,\ \Phi_{0} ,\ s)\ \Downarrow \ (\mathsf{ss}_{0},\ \Xi_{1} ,\ \Phi_{1} )\quad \Gamma \ \vdash \ \operatorname{CtExpandStmtSeq}(\mathsf{rest},\ \Xi_{1} ,\ \Phi_{1} )\ \Downarrow \ (\mathsf{ss}_{1},\ \Xi_{2} ,\ \Phi_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtExpandStmtSeq}([s]\ \mathbin{++} \ \mathsf{rest},\ \Xi ,\ \Phi_{0} )\ \Downarrow \ (\mathsf{ss}_{0}\ \mathbin{++} \ \mathsf{ss}_{1},\ \Xi_{2} ,\ \Phi_{2} )
\end{array}
$$

**(CtExpandBlock)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CtExpandStmtSeq}(\mathsf{stmts},\ \Xi ,\ \Phi_{0} )\ \Downarrow \ (\mathsf{stmts}',\ \Xi_{1} ,\ \Phi_{1} )\quad (\mathsf{tail}_{\mathsf{opt}}\ =\ \bot \ \Rightarrow \ \mathsf{tail}_{\mathsf{opt}}'\ =\ \bot \ \land \ \Xi_{2} \ =\ \Xi_{1} \ \land \ \Phi_{2} \ =\ \Phi_{1} )\quad (\mathsf{tail}_{\mathsf{opt}}\ =\ e\ \Rightarrow \ \Gamma \ \vdash \ \operatorname{CtExpandExpr}(\Xi_{1} ,\ \Phi_{1} ,\ e)\ \Downarrow \ (e',\ \Xi_{2} ,\ \Phi_{2} )\ \land \ \mathsf{tail}_{\mathsf{opt}}'\ =\ e') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtExpandBlock}(\Xi ,\ \Phi_{0} ,\ \operatorname{BlockExpr}(\mathsf{stmts},\ \mathsf{tail}_{\mathsf{opt}}))\ \Downarrow \ (\operatorname{BlockExpr}(\mathsf{stmts}',\ \mathsf{tail}_{\mathsf{opt}}'),\ \Xi_{2} ,\ \Phi_{2} )
\end{array}
$$

**(CtExpandStmt-CtStmt)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CtExec}(\Xi ,\ \Phi_{0} ,\ \mathsf{body})\ \Downarrow \ (\Xi_{1} ,\ \Phi_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtExpandStmt}(\Xi ,\ \Phi_{0} ,\ \operatorname{CtStmt}(\mathsf{body},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{span}))\ \Downarrow \ ([],\ \Xi_{1} ,\ \Phi_{1} )
\end{array}
$$

**(CtExpandExpr-CtExpr)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CtEval}(\Xi ,\ \Phi_{0} ,\ \mathsf{body})\ \Downarrow \ (\mathsf{cv},\ \Xi_{1} ,\ \Phi_{1} )\quad \Gamma \ \vdash \ \operatorname{CtLiteralize}(\mathsf{cv})\ \Downarrow \ e' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtExpandExpr}(\Xi ,\ \Phi_{0} ,\ \operatorname{CtExpr}(\mathsf{body},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{span}))\ \Downarrow \ (e',\ \Xi_{1} ,\ \Phi_{1} )
\end{array}
$$

**(CtExpandExpr-CtIf-True)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CtEval}(\Xi ,\ \Phi_{0} ,\ \mathsf{cond})\ \Downarrow \ (\operatorname{CtPrim}(\mathsf{true}),\ \Xi_{1} ,\ \Phi_{1} )\quad \Gamma \ \vdash \ \operatorname{CtExpandBlock}(\Xi_{1} ,\ \Phi_{1} ,\ \mathsf{then}_{\mathsf{blk}})\ \Downarrow \ (b',\ \Xi_{2} ,\ \Phi_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtExpandExpr}(\Xi ,\ \Phi_{0} ,\ \operatorname{CtIf}(\mathsf{cond},\ \mathsf{then}_{\mathsf{blk}},\ \mathsf{else}_{\mathsf{opt}},\ \mathsf{span}))\ \Downarrow \ (b',\ \Xi_{2} ,\ \Phi_{2} )
\end{array}
$$

**(CtExpandExpr-CtIf-False)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CtEval}(\Xi ,\ \Phi_{0} ,\ \mathsf{cond})\ \Downarrow \ (\operatorname{CtPrim}(\mathsf{false}),\ \Xi_{1} ,\ \Phi_{1} )\quad b\ =\ \operatorname{ElseBlock}(\mathsf{else}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{CtExpandBlock}(\Xi_{1} ,\ \Phi_{1} ,\ b)\ \Downarrow \ (b',\ \Xi_{2} ,\ \Phi_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtExpandExpr}(\Xi ,\ \Phi_{0} ,\ \operatorname{CtIf}(\mathsf{cond},\ \mathsf{then}_{\mathsf{blk}},\ \mathsf{else}_{\mathsf{opt}},\ \mathsf{span}))\ \Downarrow \ (b',\ \Xi_{2} ,\ \Phi_{2} )
\end{array}
$$

**(CtExpandExpr-CtLoopIter)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CtEval}(\Xi ,\ \Phi_{0} ,\ \mathsf{src})\ \Downarrow \ (\mathsf{iter}_{v},\ \Xi_{1} ,\ \Phi_{1} )\quad \operatorname{CtIterable}(\mathsf{iter}_{v})\quad \mathsf{elems}\ =\ \operatorname{CtElems}(\mathsf{iter}_{v})\quad \Gamma \ \vdash \ \operatorname{CtLoopIterUnroll}(\Xi_{1} ,\ \Phi_{1} ,\ \mathsf{pat},\ \mathsf{body},\ \mathsf{elems})\ \Downarrow \ (\mathsf{stmts},\ \Xi_{2} ,\ \Phi_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtExpandExpr}(\Xi ,\ \Phi_{0} ,\ \operatorname{CtLoopIter}(\mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{src},\ \mathsf{body},\ \mathsf{span}))\ \Downarrow \ (\operatorname{BlockExpr}(\mathsf{stmts},\ \operatorname{TupleExpr}([])),\ \Xi_{2} ,\ \Phi_{2} )
\end{array}
$$

**(CtLoopIterUnroll-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtLoopIterUnroll}(\Xi ,\ \Phi ,\ \mathsf{pat},\ \mathsf{body},\ [])\ \Downarrow \ ([],\ \Xi ,\ \Phi )
\end{array}
$$

**(CtLoopIterUnroll-Cons)**

$$
\begin{array}{l}
\operatorname{BindPatternCt}(\Xi ,\ \mathsf{pat},\ v)\ =\ \Xi_{0} \quad \Gamma \ \vdash \ \operatorname{CtExpandBlock}(\Xi_{0} ,\ \Phi_{0} ,\ \mathsf{body})\ \Downarrow \ (b,\ \Xi_{1} ,\ \Phi_{1} )\quad \Gamma \ \vdash \ \operatorname{CtLoopIterUnroll}(\Xi_{1} ,\ \Phi_{1} ,\ \mathsf{pat},\ \mathsf{body},\ \mathsf{rest})\ \Downarrow \ (\mathsf{stmts}_{\mathsf{rest}},\ \Xi_{2} ,\ \Phi_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtLoopIterUnroll}(\Xi ,\ \Phi_{0} ,\ \mathsf{pat},\ \mathsf{body},\ [v]\ \mathbin{++} \ \mathsf{rest})\ \Downarrow \ (\operatorname{UnitBlockStmts}(b)\ \mathbin{++} \ \mathsf{stmts}_{\mathsf{rest}},\ \Xi_{2} ,\ \Phi_{2} )
\end{array}
$$

$$
\begin{array}{l}
\operatorname{CtLiteralize}(\operatorname{CtPrim}(\mathsf{UnitVal}))\ \Downarrow \ \operatorname{TupleExpr}([]) \\[0.16em]
\operatorname{CtLiteralize}(\operatorname{CtPrim}(v))\ \Downarrow \ \operatorname{Literal}(\ell )\ \Leftrightarrow \ v\ \ne \ \mathsf{UnitVal}\ \land \ \exists \ T.\ \operatorname{LiteralValue}(\ell ,\ T)\ =\ v \\[0.16em]
\operatorname{CtLiteralize}(\operatorname{CtString}(v))\ \Downarrow \ \operatorname{Literal}(\ell )\ \Leftrightarrow \ \operatorname{LiteralValue}(\ell ,\ \operatorname{TypeString}(\texttt{@View}))\ =\ v\ \lor \ \operatorname{LiteralValue}(\ell ,\ \operatorname{TypeString}(\texttt{@Managed}))\ =\ v \\[0.16em]
\operatorname{CtLiteralize}(\operatorname{CtTuple}([v_{1},\ \ldots ,\ v_{n}]))\ \Downarrow \ \operatorname{TupleExpr}([e_{1},\ \ldots ,\ e_{n}])\ \Leftrightarrow \ \forall \ i.\ \Gamma \ \vdash \ \operatorname{CtLiteralize}(v_{i})\ \Downarrow \ e_{i} \\[0.16em]
\operatorname{CtLiteralize}(\operatorname{CtArray}([v_{1},\ \ldots ,\ v_{n}]))\ \Downarrow \ \operatorname{ArrayExpr}([e_{1},\ \ldots ,\ e_{n}])\ \Leftrightarrow \ \forall \ i.\ \Gamma \ \vdash \ \operatorname{CtLiteralize}(v_{i})\ \Downarrow \ e_{i} \\[0.16em]
\operatorname{CtLiteralize}(\operatorname{CtRecord}(\mathsf{path},\ [\langle f_{1},\ v_{1}\rangle ,\ \ldots ,\ \langle f_{n},\ v_{n}\rangle ]))\ \Downarrow \ \operatorname{RecordExpr}(\operatorname{TypePath}(\mathsf{path}),\ [\langle f_{1},\ e_{1}\rangle ,\ \ldots ,\ \langle f_{n},\ e_{n}\rangle ])\ \Leftrightarrow \ \forall \ i.\ \Gamma \ \vdash \ \operatorname{CtLiteralize}(v_{i})\ \Downarrow \ e_{i} \\[0.16em]
\operatorname{CtLiteralize}(\operatorname{CtModalState}(\mathsf{modal}_{\mathsf{ref}},\ \mathsf{state},\ [\langle f_{1},\ v_{1}\rangle ,\ \ldots ,\ \langle f_{n},\ v_{n}\rangle ]))\ \Downarrow \ \operatorname{RecordExpr}(\operatorname{ModalStateRef}(\mathsf{modal}_{\mathsf{ref}},\ \mathsf{state}),\ [\langle f_{1},\ e_{1}\rangle ,\ \ldots ,\ \langle f_{n},\ e_{n}\rangle ])\ \Leftrightarrow \ \forall \ i.\ \Gamma \ \vdash \ \operatorname{CtLiteralize}(v_{i})\ \Downarrow \ e_{i} \\[0.16em]
\operatorname{CtLiteralize}(\operatorname{CtEnum}(\mathsf{path},\ \mathsf{variant},\ \bot ))\ \Downarrow \ \operatorname{EnumLiteral}(\mathsf{path}\ \mathbin{++} \ [\mathsf{variant}],\ \bot ) \\[0.16em]
\operatorname{CtLiteralize}(\operatorname{CtEnum}(\mathsf{path},\ \mathsf{variant},\ \operatorname{CtTuplePayload}([v_{1},\ \ldots ,\ v_{n}])))\ \Downarrow \ \operatorname{EnumLiteral}(\mathsf{path}\ \mathbin{++} \ [\mathsf{variant}],\ \operatorname{Paren}([e_{1},\ \ldots ,\ e_{n}]))\ \Leftrightarrow \ \forall \ i.\ \Gamma \ \vdash \ \operatorname{CtLiteralize}(v_{i})\ \Downarrow \ e_{i} \\[0.16em]
\operatorname{CtLiteralize}(\operatorname{CtEnum}(\mathsf{path},\ \mathsf{variant},\ \operatorname{CtRecordPayload}([\langle f_{1},\ v_{1}\rangle ,\ \ldots ,\ \langle f_{n},\ v_{n}\rangle ])))\ \Downarrow \ \operatorname{EnumLiteral}(\mathsf{path}\ \mathbin{++} \ [\mathsf{variant}],\ \operatorname{Brace}([\langle f_{1},\ e_{1}\rangle ,\ \ldots ,\ \langle f_{n},\ e_{n}\rangle ]))\ \Leftrightarrow \ \forall \ i.\ \Gamma \ \vdash \ \operatorname{CtLiteralize}(v_{i})\ \Downarrow \ e_{i} \\[0.16em]
\operatorname{CtLiteralize}(\operatorname{CtAst}(a))\ \Downarrow \ \operatorname{AstPayloadOf}(a)\quad \mathsf{if}\ \operatorname{AstKindOf}(a)\ =\ \texttt{Expr}
\end{array}
$$

### 22.1.6 Lowering

Compile-time execution is complete before Phase 3 typing and Phase 4 lowering. No runtime IR is emitted directly for:
- compile-time procedures
- compile-time statements
- compile-time expressions after literalization or AST substitution

Phase 4 lowers only the expanded program produced by `ExecuteComptime`.

### 22.1.7 Diagnostics

Diagnostics for compile-time forms are defined by §22.6.
