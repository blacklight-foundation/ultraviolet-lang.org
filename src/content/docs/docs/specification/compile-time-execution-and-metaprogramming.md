---
title: "Compile-Time Execution and Metaprogramming"
description: "22. Compile-Time Execution and Metaprogramming of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T18:13:03.158Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## 22. Compile-Time Execution and Metaprogramming

Phase 2 executes compile-time forms over the Phase 1 module set before name resolution and type checking of the expanded program.

### 22.1 Compile-Time Forms

#### 22.1.1 Syntax

```text
comptime_stmt           ::= attribute_list? "comptime" block_expr
comptime_expr           ::= attribute_list? "comptime" "{" expression "}"
comptime_if             ::= "comptime" "if" expression block_expr ("else" (comptime_if | block_expr))?
comptime_loop           ::= "comptime" "loop" pattern (":" type)? "in" expression block_expr
comptime_procedure_decl ::= attribute_list? "comptime" visibility? "procedure" identifier generic_params? signature contract_clause? block_expr
type_literal            ::= "Type" "::<" type ">"
```

#### 22.1.2 Parsing

```math
\mathsf{CtParseJudg}\ =\ \{\mathsf{ParseCtStmt},\ \mathsf{ParseCtExpr},\ \mathsf{ParseCtIf},\ \mathsf{ParseCtLoopIter},\ \mathsf{ParseCtProc},\ \mathsf{ParseCtElseOpt}\}
```

**(Parse-CtProc)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{0}),\ \texttt{comptime})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(\operatorname{Advance}(P_{0}))\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{procedure})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseGenericParamsOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseSignature}(P_{3})\ \Downarrow \ (P_{4},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseContractClauseOpt}(P_{4})\ \Downarrow \ (P_{5},\ \mathsf{contract}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(P_{5})\ \Downarrow \ (P_{6},\ \mathsf{body}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseItem}(P)\ \Downarrow \ (P_{6},\ \operatorname{CtProc}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \operatorname{SpanBetween}(P,\ P_{6}),\ []))
\end{array}
```

**(Parse-CtStmt)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{0}),\ \texttt{comptime})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P_{0})),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(\operatorname{Advance}(P_{0}))\ \Downarrow \ (P_{1},\ \mathsf{body}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseStmt}(P)\ \Downarrow \ (P_{1},\ \operatorname{CtStmt}(\mathsf{body},\ \mathsf{attrs}_{\mathsf{opt}},\ \operatorname{SpanBetween}(P,\ P_{1})))
\end{array}
```

**(Parse-CtExpr)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{0}),\ \texttt{comptime})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P_{0})),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(\operatorname{Advance}(P_{0})))\ \Downarrow \ (P_{1},\ \mathsf{body})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"\}"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseExpr}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{CtExpr}(\mathsf{body},\ \mathsf{attrs}_{\mathsf{opt}},\ \operatorname{SpanBetween}(P,\ \operatorname{Advance}(P_{1}))))
\end{array}
```

**(Parse-CtIf)**

```math
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{comptime})\quad \operatorname{IsKw}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{if})\quad \Gamma \ \vdash \ \operatorname{ParseExpr_NoBrace}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ \mathsf{cond})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{then}_{\mathsf{blk}})\quad \Gamma \ \vdash \ \operatorname{ParseCtElseOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{else}_{\mathsf{opt}}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseExpr}(P)\ \Downarrow \ (P_{3},\ \operatorname{CtIf}(\mathsf{cond},\ \mathsf{then}_{\mathsf{blk}},\ \mathsf{else}_{\mathsf{opt}},\ \operatorname{SpanBetween}(P,\ P_{3})))
\end{array}
```

**(Parse-CtLoopIter)**

```math
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{comptime})\quad \operatorname{IsKw}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{loop})\quad \Gamma \ \vdash \ \operatorname{TryParsePatternIn}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ \mathsf{pat})\quad \Gamma \ \vdash \ \operatorname{ParseTypeAnnotOpt}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{ty}_{\mathsf{opt}})\quad \operatorname{Ctx}(\operatorname{Tok}(P_{2}),\ \texttt{"in"})\quad \Gamma \ \vdash \ \operatorname{ParseExpr_NoBrace}(\operatorname{Advance}(P_{2}))\ \Downarrow \ (P_{3},\ \mathsf{src})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(P_{3})\ \Downarrow \ (P_{4},\ \mathsf{body}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseExpr}(P)\ \Downarrow \ (P_{4},\ \operatorname{CtLoopIter}(\mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{src},\ \mathsf{body},\ \operatorname{SpanBetween}(P,\ P_{4})))
\end{array}
```

**(Parse-CtElseOpt-None)**

```math
\begin{array}{l}
\lnot \ \operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{else}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseCtElseOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
```

**(Parse-CtElseOpt-Block)**

```math
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{else})\quad \lnot \ \operatorname{IsKw}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{comptime})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{body}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseCtElseOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{body})
\end{array}
```

**(Parse-CtElseOpt-ElseIf)**

```math
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{else})\quad \operatorname{IsKw}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{comptime})\quad \operatorname{IsKw}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))),\ \texttt{if})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e_{\mathsf{if}})\quad e_{\mathsf{if}}\ =\ \operatorname{CtIf}(\_,\ \_,\ \_,\ \_) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseCtElseOpt}(P)\ \Downarrow \ (P_{1},\ \operatorname{BlockExpr}([\operatorname{ExprStmt}(e_{\mathsf{if}})],\ \bot ))
\end{array}
```

#### 22.1.3 AST Representation / Form

```math
\mathsf{CtNode}\ =\ \{\mathsf{CtStmt},\ \mathsf{CtExpr},\ \mathsf{CtIf},\ \mathsf{CtLoopIter},\ \mathsf{CtProc}\}
```

CtStmt(body, attrs_opt, span) is a compile-time statement block.
CtExpr(body, attrs_opt, span) is a compile-time expression.
CtIf(cond, then_blk, else_opt, span) is a compile-time branch.
CtLoopIter(pat, ty_opt, src, body, span) is a compile-time iterator-unrolling form.
CtProc(attrs_opt, vis, name, gen_params_opt, params, ret_opt, contract_opt, body, span, doc) is a compile-time procedure declaration.

```math
\begin{array}{l}
\mathsf{CtSite}\ =\ \langle \mathsf{module}_{\mathsf{path}},\ \mathsf{ordinal},\ \mathsf{span}\rangle  \\
\mathsf{CtEnv}\ =\ \langle \mathsf{vals},\ \mathsf{procs},\ \mathsf{caps},\ \mathsf{site},\ \mathsf{quote}_{\mathsf{ctx}}\rangle  \\
\mathsf{CtMachine}\ =\ \langle \mathsf{files},\ \mathsf{project}_{\mathsf{root}},\ \mathsf{diags},\ \mathsf{pending}_{\mathsf{emits}},\ \mathsf{next}_{\mathsf{hygiene}}\rangle  \\
\mathsf{CtQuoteCtx}\ =\ \bot \ \mid \ \langle \mathsf{kind},\ \mathsf{quote}_{\mathsf{site}}\rangle 
\end{array}
```

```math
\begin{array}{l}
\operatorname{CtVals}(\langle \mathsf{vals},\ \mathsf{procs},\ \mathsf{caps},\ \mathsf{site},\ \mathsf{quote}_{\mathsf{ctx}}\rangle )\ =\ \mathsf{vals} \\
\operatorname{CtProcs}(\langle \mathsf{vals},\ \mathsf{procs},\ \mathsf{caps},\ \mathsf{site},\ \mathsf{quote}_{\mathsf{ctx}}\rangle )\ =\ \mathsf{procs} \\
\operatorname{CtCaps}(\langle \mathsf{vals},\ \mathsf{procs},\ \mathsf{caps},\ \mathsf{site},\ \mathsf{quote}_{\mathsf{ctx}}\rangle )\ =\ \mathsf{caps} \\
\operatorname{CtSiteOf}(\langle \mathsf{vals},\ \mathsf{procs},\ \mathsf{caps},\ \mathsf{site},\ \mathsf{quote}_{\mathsf{ctx}}\rangle )\ =\ \mathsf{site} \\
\operatorname{CtQuoteCtxOf}(\langle \mathsf{vals},\ \mathsf{procs},\ \mathsf{caps},\ \mathsf{site},\ \mathsf{quote}_{\mathsf{ctx}}\rangle )\ =\ \mathsf{quote}_{\mathsf{ctx}}
\end{array}
```

```math
\begin{array}{l}
\operatorname{CtFiles}(\langle \mathsf{files},\ \mathsf{project}_{\mathsf{root}},\ \mathsf{diags},\ \mathsf{pending}_{\mathsf{emits}},\ \mathsf{next}_{\mathsf{hygiene}}\rangle )\ =\ \mathsf{files} \\
\operatorname{CtProjectRoot}(\langle \mathsf{files},\ \mathsf{project}_{\mathsf{root}},\ \mathsf{diags},\ \mathsf{pending}_{\mathsf{emits}},\ \mathsf{next}_{\mathsf{hygiene}}\rangle )\ =\ \mathsf{project}_{\mathsf{root}} \\
\operatorname{CtDiags}(\langle \mathsf{files},\ \mathsf{project}_{\mathsf{root}},\ \mathsf{diags},\ \mathsf{pending}_{\mathsf{emits}},\ \mathsf{next}_{\mathsf{hygiene}}\rangle )\ =\ \mathsf{diags} \\
\operatorname{CtPendingEmits}(\langle \mathsf{files},\ \mathsf{project}_{\mathsf{root}},\ \mathsf{diags},\ \mathsf{pending}_{\mathsf{emits}},\ \mathsf{next}_{\mathsf{hygiene}}\rangle )\ =\ \mathsf{pending}_{\mathsf{emits}} \\
\operatorname{CtFreshSeed}(\langle \mathsf{files},\ \mathsf{project}_{\mathsf{root}},\ \mathsf{diags},\ \mathsf{pending}_{\mathsf{emits}},\ \mathsf{next}_{\mathsf{hygiene}}\rangle )\ =\ \mathsf{next}_{\mathsf{hygiene}}
\end{array}
```

```math
\begin{array}{l}
\mathsf{CtAvailableJudg}\ =\ \{\mathsf{CtAvail}\} \\
\mathsf{CtLiteralJudg}\ =\ \{\mathsf{CtLiteralize}\} \\
\mathsf{CtEvalJudg}\ =\ \{\mathsf{CtEval},\ \mathsf{CtExec}\} \\
\mathsf{CtExpandableJudg}\ =\ \{\mathsf{CtExpandExpr},\ \mathsf{CtExpandStmt},\ \mathsf{CtExpandStmtSeq},\ \mathsf{CtExpandBlock},\ \mathsf{CtExpandItem},\ \mathsf{CtExpandItemSeq}\} \\
\mathsf{CtBuiltinCallJudg}\ =\ \{\mathsf{CtBuiltinCall}\} \\
\mathsf{CtOrderJudg}\ =\ \{\mathsf{Phase2ModuleOrder}\} \\
\mathsf{CtPassJudg}\ =\ \{\mathsf{ComptimePass},\ \mathsf{CtExecModule},\ \mathsf{CtExecModuleSeq}\}
\end{array}
```

```math
\begin{array}{l}
\mathsf{CtValue}\ \mathbin{::} =\ \operatorname{CtPrim}(v)\ \mid \ \operatorname{CtString}(v)\ \mid \ \operatorname{CtBytes}(v)\ \mid \ \operatorname{CtType}(T)\ \mid \ \operatorname{CtAst}(a)\ \mid \ \operatorname{CtTuple}([\mathsf{CtValue}])\ \mid \ \operatorname{CtArray}([\mathsf{CtValue}])\ \mid \ \operatorname{CtSlice}([\mathsf{CtValue}])\ \mid \ \operatorname{CtRecord}(\mathsf{path},\ \mathsf{fields})\ \mid \ \operatorname{CtEnum}(\mathsf{path},\ \mathsf{variant},\ \mathsf{payload}) \\
\mathsf{CtPayload}\ \mathbin{::} =\ \bot \ \mid \ \operatorname{CtTuplePayload}([\mathsf{CtValue}])\ \mid \ \operatorname{CtRecordPayload}([\langle \mathsf{field},\ \mathsf{CtValue}\rangle ]) \\
\operatorname{CtIterable}(v)\ \Leftrightarrow \ v\ =\ \operatorname{CtArray}(\_)\ \lor \ v\ =\ \operatorname{CtSlice}(\_) \\
\operatorname{CtIterableType}(T)\ \Leftrightarrow \ T\ =\ \operatorname{TypeArray}(U,\ \_)\ \lor \ T\ =\ \operatorname{TypeSlice}(U) \\
\operatorname{ElemType}(\operatorname{TypeArray}(U,\ \_))\ =\ U \\
\operatorname{ElemType}(\operatorname{TypeSlice}(U))\ =\ U \\
\operatorname{CtMetaFree}(n)\ \Leftrightarrow \ n\ \mathsf{contains}\ \mathsf{no}\ \mathsf{node}\ \mathsf{owned}\ \mathsf{by}\ \S \S 22.2\ \mathsf{through}\ 22.5
\end{array}
```

#### 22.1.4 Static Semantics

```math
\mathsf{In}\ \mathsf{the}\ \mathsf{rules}\ \mathsf{below},\ \texttt{Gamma\_ct}\ \mathsf{denotes}\ \mathsf{the}\ \mathsf{typing}\ \mathsf{environment}\ \mathsf{obtained}\ \mathsf{by}\ \mathsf{extending}\ \texttt{Gamma}\ \mathsf{with}\ \mathsf{the}\ \mathsf{local}\ \mathsf{bindings}\ \mathsf{of}\ \mathsf{the}\ \mathsf{current}\ \mathsf{compile}-\mathsf{time}\ \mathsf{body},\ \mathsf{the}\ \mathsf{compile}-\mathsf{time}\ \mathsf{procedure}\ \mathsf{bindings}\ \mathsf{introduced}\ \mathsf{earlier}\ \mathsf{in}\ \mathsf{the}\ \mathsf{same}\ \mathsf{Phase}\ 2\ \mathsf{source}\ \mathsf{order},\ \mathsf{and}\ \mathsf{the}\ \mathsf{capability}\ \mathsf{bindings}\ \mathsf{admitted}\ \mathsf{by}\ \S 22.2\ \mathsf{for}\ \mathsf{the}\ \mathsf{current}\ \mathsf{site}.
```

CtAvail(TypePrim(_))
CtAvail(TypeString(`@View`))
CtAvail(TypeString(`@Managed`))
CtAvail(TypeBytes(`@View`))
CtAvail(TypeBytes(`@Managed`))

```math
\begin{array}{l}
\operatorname{CtAvail}(\operatorname{TypePath}([\texttt{Type}])) \\
\operatorname{CtAvail}(\operatorname{TypePath}([\texttt{Ast}])) \\
\operatorname{CtAvail}(\operatorname{TypePath}([\texttt{Ast},\ \texttt{Expr}])) \\
\operatorname{CtAvail}(\operatorname{TypePath}([\texttt{Ast},\ \texttt{Stmt}])) \\
\operatorname{CtAvail}(\operatorname{TypePath}([\texttt{Ast},\ \texttt{Item}])) \\
\operatorname{CtAvail}(\operatorname{TypePath}([\texttt{Ast},\ \texttt{Type}])) \\
\operatorname{CtAvail}(\operatorname{TypePath}([\texttt{Ast},\ \texttt{Pattern}]))
\end{array}
```

```math
\begin{array}{l}
\operatorname{CtAvail}(\operatorname{TypeTuple}(\mathsf{Ts}))\ \Leftrightarrow \ \forall \ T\ \in \ \mathsf{Ts}.\ \operatorname{CtAvail}(T) \\
\operatorname{CtAvail}(\operatorname{TypeArray}(T,\ \_))\ \Leftrightarrow \ \operatorname{CtAvail}(T) \\
\operatorname{CtAvail}(\operatorname{TypeSlice}(T))\ \Leftrightarrow \ \operatorname{CtAvail}(T) \\
\operatorname{CtAvail}(\operatorname{TypePath}(p))\ \Leftrightarrow \ \operatorname{RecordDecl}(p)\ =\ R\ \land \ \forall \ f\ \in \ \operatorname{Fields}(R).\ \operatorname{CtAvail}(\operatorname{StripPerm}(f.\mathsf{type})) \\
\operatorname{CtAvail}(\operatorname{TypePath}(p))\ \Leftrightarrow \ \operatorname{EnumDecl}(p)\ =\ E\ \land \ \forall \ v\ \in \ \operatorname{Variants}(E).\ \forall \ T\ \in \ \operatorname{PayloadTypes}(v).\ \operatorname{CtAvail}(\operatorname{StripPerm}(T)) \\
\operatorname{CtAvail}(\operatorname{TypePerm}(\_,\ T))\ \Leftrightarrow \ \operatorname{CtAvail}(T)
\end{array}
```

```math
\operatorname{CtForbiddenType}(T)\ \Leftrightarrow \ \operatorname{CapInType}(T)\ \ne \ \emptyset \ \lor \ \operatorname{StripPerm}(T)\ =\ \operatorname{TypeModalState}(\_,\ \_)\ \lor \ \operatorname{StripPerm}(T)\ =\ \operatorname{TypeDynamic}(\_)\ \lor \ \operatorname{StripPerm}(T)\ =\ \operatorname{TypePtr}(\_,\ \_)\ \lor \ \operatorname{StripPerm}(T)\ =\ \operatorname{TypeRawPtr}(\_,\ \_)\ \lor \ \operatorname{StripPerm}(T)\ =\ \operatorname{TypeFunc}(\_,\ \_)\ \lor \ \operatorname{AliasNorm}(T)\ =\ \operatorname{TypePath}([\texttt{"Context"}])
```

A conforming implementation MUST reject any compile-time expression, compile-time variable, compile-time procedure parameter, or compile-time procedure return type for which `CtForbiddenType(T)` holds or `CtAvail(T)` does not hold.

The following constructs are prohibited inside compile-time execution:
- region allocation and frame operations
- key acquisition blocks and dynamic key synchronization
- `parallel`, `spawn`, `dispatch`, `wait`, `yield`, `yield from`, `sync`, `race`, and `all`
- raw-pointer dereference, `transmute`, and any `unsafe`-only operation
- any call that crosses an FFI boundary

**(T-CtStmt)**

```math
\begin{array}{l}
\Gamma_{\mathsf{ct}} \ \vdash \ \mathsf{body}\ :\ \operatorname{TypePrim}(\texttt{"()"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtStmt}(\mathsf{body},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{span})\ :\ \operatorname{TypePrim}(\texttt{"()"})
\end{array}
```

**(T-CtExpr)**

```math
\begin{array}{l}
\Gamma_{\mathsf{ct}} \ \vdash \ \mathsf{body}\ :\ T\quad \operatorname{CtAvail}(T)\quad \lnot \ \operatorname{CtForbiddenType}(T) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtExpr}(\mathsf{body},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{span})\ :\ T
\end{array}
```

**(T-CtIf)**

```math
\begin{array}{l}
\Gamma_{\mathsf{ct}} \ \vdash \ \mathsf{cond}\ :\ \operatorname{TypePrim}(\texttt{"bool"})\quad \Gamma_{\mathsf{ct}} \ \vdash \ \mathsf{then}_{\mathsf{blk}}\ :\ U\quad \Gamma_{\mathsf{ct}} \ \vdash \ \mathsf{else}_{\mathsf{blk}}\ :\ U \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtIf}(\mathsf{cond},\ \mathsf{then}_{\mathsf{blk}},\ \mathsf{else}_{\mathsf{blk}},\ \mathsf{span})\ :\ U
\end{array}
```

**(T-CtLoopIter)**

```math
\begin{array}{l}
\Gamma_{\mathsf{ct}} \ \vdash \ \mathsf{src}\ :\ T_{\mathsf{src}}\quad \operatorname{CtIterableType}(T_{\mathsf{src}})\quad (\mathsf{ty}_{\mathsf{opt}}\ =\ \bot \ \Rightarrow \ T_{\mathsf{elem}}\ =\ \operatorname{ElemType}(T_{\mathsf{src}}))\quad (\mathsf{ty}_{\mathsf{opt}}\ =\ T_{\mathsf{ann}}\ \Rightarrow \ \operatorname{ElemType}(T_{\mathsf{src}})\ \mathrel{<:} \ T_{\mathsf{ann}}\ \land \ T_{\mathsf{elem}}\ =\ T_{\mathsf{ann}})\quad \Gamma_{\mathsf{ct}} ,\ \mathsf{pat}\ :\ T_{\mathsf{elem}}\ \vdash \ \mathsf{body}\ :\ \operatorname{TypePrim}(\texttt{"()"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtLoopIter}(\mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{src},\ \mathsf{body},\ \mathsf{span})\ :\ \operatorname{TypePrim}(\texttt{"()"})
\end{array}
```

**(T-CtProc)**

```math
\begin{array}{l}
\mathsf{proc}\ =\ \operatorname{CtProc}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\quad \forall \ \langle \_,\ \_,\ T\rangle \ \in \ \mathsf{params}.\ \operatorname{CtAvail}(T)\ \land \ \lnot \ \operatorname{CtForbiddenType}(T)\quad \operatorname{CtAvail}(\operatorname{ProcReturn}(\mathsf{ret}_{\mathsf{opt}}))\quad \lnot \ \operatorname{CtForbiddenType}(\operatorname{ProcReturn}(\mathsf{ret}_{\mathsf{opt}}))\quad \Gamma_{\mathsf{ct}} ,\ \mathsf{params}\ \vdash \ \mathsf{body}\ :\ \operatorname{ProcReturn}(\mathsf{ret}_{\mathsf{opt}}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \mathsf{proc}\ :\ \mathsf{wf}
\end{array}
```

Compile-time procedure contracts use the ordinary `contract_clause` surface of §14.6. At each compile-time call site, the precondition is evaluated before body execution and the postcondition is evaluated on the returned value. If any evaluated contract predicate is `false`, the call is ill-formed.

Compile-time procedures MUST be callable only from compile-time contexts. Runtime expressions and runtime procedure bodies MUST NOT name, take the address of, store, or call a compile-time procedure.

For `comptime if`, only the selected branch becomes part of the expanded program.
For `comptime loop`, the source value MUST be finite and iteration order MUST equal the canonical element order of the source value.
`comptime loop` imposes no item-kind uniformity constraint across iterations. If loop-body execution emits declarations, the resulting emitted-item sequence is the concatenation of each iteration's emitted items in canonical iteration order.

#### 22.1.5 Dynamic Semantics

```math
\operatorname{Phase2ModuleOrder}(P)\ =\ [M_{1},\ \ldots ,\ M_{k}]\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{ParseModules}(P)\ \Downarrow \ [M_{1},\ \ldots ,\ M_{k}]
```

```math
\begin{array}{l}
\operatorname{CtEmptyEnv}(M)\ =\ \langle \emptyset ,\ \emptyset ,\ \emptyset ,\ \langle M.\mathsf{path},\ 0,\ \bot \rangle ,\ \bot \rangle  \\
\operatorname{WithCtSite}(\Xi ,\ \mathsf{ord},\ \mathsf{sp})\ =\ \Xi '\ \Leftrightarrow \ \operatorname{CtSiteOf}(\Xi )\ =\ \langle \mathsf{mp},\ \_,\ \_\rangle \ \land \ \Xi '\ =\ \langle \operatorname{CtVals}(\Xi ),\ \operatorname{CtProcs}(\Xi ),\ \operatorname{CtCaps}(\Xi ),\ \langle \mathsf{mp},\ \mathsf{ord},\ \mathsf{sp}\rangle ,\ \operatorname{CtQuoteCtxOf}(\Xi )\rangle  \\
\operatorname{BindCtProc}(\Xi ,\ \mathsf{proc})\ =\ \Xi '\ \Leftrightarrow \ \mathsf{proc}\ =\ \operatorname{CtProc}(\_,\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \land \ \Xi '\ =\ \langle \operatorname{CtVals}(\Xi ),\ \operatorname{CtProcs}(\Xi )[\mathsf{name}\ \mapsto \ \mathsf{proc}],\ \operatorname{CtCaps}(\Xi ),\ \operatorname{CtSiteOf}(\Xi ),\ \operatorname{CtQuoteCtxOf}(\Xi )\rangle  \\
\operatorname{UnitBlockStmts}(\operatorname{BlockExpr}(\mathsf{stmts},\ \bot ))\ =\ \mathsf{stmts} \\
\operatorname{UnitBlockStmts}(\operatorname{BlockExpr}(\mathsf{stmts},\ \mathsf{tail}))\ =\ \mathsf{stmts}\ \mathbin{++} \ [\operatorname{ExprStmt}(\mathsf{tail})] \\
\operatorname{ElseBlock}(\mathsf{else}_{\mathsf{opt}})\ =\ \mathsf{else}_{\mathsf{opt}}\quad \mathsf{if}\ \mathsf{else}_{\mathsf{opt}}\ \ne \ \bot  \\
\operatorname{ElseBlock}(\mathsf{else}_{\mathsf{opt}})\ =\ \operatorname{BlockExpr}([],\ \operatorname{TupleExpr}([]))\quad \mathsf{otherwise} \\
\operatorname{CtElems}(\operatorname{CtArray}(\mathsf{vs}))\ =\ \mathsf{vs} \\
\operatorname{CtElems}(\operatorname{CtSlice}(\mathsf{vs}))\ =\ \mathsf{vs} \\
\operatorname{BindPatternCt}(\Xi ,\ \mathsf{pat},\ v)\ =\ \Xi '\ \mathsf{iff}\ \mathsf{the}\ \mathsf{ordinary}\ \mathsf{loop}-\mathsf{pattern}\ \mathsf{binding}\ \mathsf{rules}\ \mathsf{bind}\ \mathsf{the}\ \mathsf{names}\ \mathsf{of}\ \texttt{pat}\ \mathsf{to}\ \texttt{v}\ \mathsf{in}\ \texttt{CtVals(Xi')}\ \mathsf{and}\ \mathsf{leave}\ \texttt{CtProcs},\ \texttt{CtCaps},\ \mathsf{and}\ \texttt{CtSiteOf}\ \mathsf{unchanged}.
\end{array}
```

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

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtExecModuleSeq}([],\ \Phi )\ \Downarrow \ ([],\ \Phi )
\end{array}
```

**(ComptimePass-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CtExecModule}(M_{1},\ \Phi_{0} )\ \Downarrow \ (M_{1}',\ \Phi_{1} )\quad \Gamma \ \vdash \ \operatorname{CtExecModuleSeq}([M_{2},\ \ldots ,\ M_{k}],\ \Phi_{1} )\ \Downarrow \ ([M_{2}',\ \ldots ,\ M_{k}'],\ \Phi_{2} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtExecModuleSeq}([M_{1},\ \ldots ,\ M_{k}],\ \Phi_{0} )\ \Downarrow \ ([M_{1}',\ M_{2}',\ \ldots ,\ M_{k}'],\ \Phi_{2} )
\end{array}
```

**(ComptimePass)**

```math
\begin{array}{l}
\operatorname{Phase2ModuleOrder}(P)\ =\ [M_{1},\ \ldots ,\ M_{k}]\quad \mathsf{root}_{0}\ =\ P.\mathsf{root}\quad \Phi_{0} \ =\ \langle \mathsf{files}_{0},\ \mathsf{root}_{0},\ [],\ [],\ 0\rangle \quad \Gamma \ \vdash \ \operatorname{CtExecModuleSeq}([M_{1},\ \ldots ,\ M_{k}],\ \Phi_{0} )\ \Downarrow \ ([M_{1}',\ \ldots ,\ M_{k}'],\ \Phi_{1} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ComptimePass}(P,\ [M_{1},\ \ldots ,\ M_{k}])\ \Downarrow \ [M_{1}',\ \ldots ,\ M_{k}']
\end{array}
```

where `files_0` is the deterministic project-file snapshot defined by §22.2.5.

**(CtExecModule)**

```math
\begin{array}{l}
\Xi_{0} \ =\ \operatorname{CtEmptyEnv}(M)\quad \Gamma \ \vdash \ \operatorname{CtExpandItemSeq}(M.\mathsf{items},\ \Xi_{0} ,\ \Phi ,\ 0)\ \Downarrow \ (\mathsf{items}',\ \Xi_{1} ,\ \Phi_{1} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtExecModule}(M,\ \Phi )\ \Downarrow \ (\langle M.\mathsf{path},\ \mathsf{items}',\ M.\mathsf{module}_{\mathsf{doc}}\rangle ,\ \Phi_{1} )
\end{array}
```

**(CtExpandItemSeq-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtExpandItemSeq}([],\ \Xi ,\ \Phi ,\ \mathsf{ord})\ \Downarrow \ ([],\ \Xi ,\ \Phi )
\end{array}
```

**(CtExpandItemSeq-Cons)**

```math
\begin{array}{l}
\operatorname{WithCtSite}(\Xi ,\ \mathsf{ord},\ \bot )\ =\ \Xi_{0} \quad \Gamma \ \vdash \ \operatorname{CtExpandItem}(\Xi_{0} ,\ \Phi_{0} ,\ \mathsf{it})\ \Downarrow \ (\langle \mathsf{keep}_{\mathsf{items}},\ \mathsf{emit}_{\mathsf{items}}\rangle ,\ \Xi_{1} ,\ \Phi_{1} )\quad \Gamma \ \vdash \ \operatorname{CtExpandItemSeq}(\mathsf{emit}_{\mathsf{items}}\ \mathbin{++} \ \mathsf{rest},\ \Xi_{1} ,\ \Phi_{1} ,\ \mathsf{ord}\ +\ 1)\ \Downarrow \ (\mathsf{rest}',\ \Xi_{2} ,\ \Phi_{2} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtExpandItemSeq}([\mathsf{it}]\ \mathbin{++} \ \mathsf{rest},\ \Xi ,\ \Phi_{0} ,\ \mathsf{ord})\ \Downarrow \ (\mathsf{keep}_{\mathsf{items}}\ \mathbin{++} \ \mathsf{rest}',\ \Xi_{2} ,\ \Phi_{2} )
\end{array}
```

```math
\texttt{CtExpandItem}\ \mathsf{returns}\ a\ \mathsf{pair}\ \texttt{<keep\_items, emit\_items>},\ \mathsf{where}\ \texttt{keep\_items}\ \mathsf{replaces}\ \mathsf{the}\ \mathsf{current}\ \mathsf{item}\ \mathsf{position}\ \mathsf{and}\ \texttt{emit\_items}\ \mathsf{is}\ \mathsf{inserted}\ \mathsf{immediately}\ \mathsf{after}\ \mathsf{that}\ \mathsf{position}.
```

Any `CtBuiltinCall` that emits declarations appends them to `CtPendingEmits(Φ)`. Before `CtExpandItem` returns to `CtExpandItemSeq`, it MUST transfer the accumulated `CtPendingEmits(Φ)` into its returned `emit_items` list in append order and clear the pending-emission queue in the resulting `Φ`.

**(CtExpandItem-CtProc)**

```math
\begin{array}{l}
\mathsf{proc}\ =\ \operatorname{CtProc}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\quad \operatorname{BindCtProc}(\Xi ,\ \mathsf{proc})\ =\ \Xi_{1}  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtExpandItem}(\Xi ,\ \Phi ,\ \mathsf{proc})\ \Downarrow \ (\langle [],\ []\rangle ,\ \Xi_{1} ,\ \Phi )
\end{array}
```

**(CtExpandStmtSeq-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtExpandStmtSeq}([],\ \Xi ,\ \Phi )\ \Downarrow \ ([],\ \Xi ,\ \Phi )
\end{array}
```

**(CtExpandStmtSeq-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CtExpandStmt}(\Xi ,\ \Phi_{0} ,\ s)\ \Downarrow \ (\mathsf{ss}_{0},\ \Xi_{1} ,\ \Phi_{1} )\quad \Gamma \ \vdash \ \operatorname{CtExpandStmtSeq}(\mathsf{rest},\ \Xi_{1} ,\ \Phi_{1} )\ \Downarrow \ (\mathsf{ss}_{1},\ \Xi_{2} ,\ \Phi_{2} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtExpandStmtSeq}([s]\ \mathbin{++} \ \mathsf{rest},\ \Xi ,\ \Phi_{0} )\ \Downarrow \ (\mathsf{ss}_{0}\ \mathbin{++} \ \mathsf{ss}_{1},\ \Xi_{2} ,\ \Phi_{2} )
\end{array}
```

**(CtExpandBlock)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CtExpandStmtSeq}(\mathsf{stmts},\ \Xi ,\ \Phi_{0} )\ \Downarrow \ (\mathsf{stmts}',\ \Xi_{1} ,\ \Phi_{1} )\quad (\mathsf{tail}_{\mathsf{opt}}\ =\ \bot \ \Rightarrow \ \mathsf{tail}_{\mathsf{opt}}'\ =\ \bot \ \land \ \Xi_{2} \ =\ \Xi_{1} \ \land \ \Phi_{2} \ =\ \Phi_{1} )\quad (\mathsf{tail}_{\mathsf{opt}}\ =\ e\ \Rightarrow \ \Gamma \ \vdash \ \operatorname{CtExpandExpr}(\Xi_{1} ,\ \Phi_{1} ,\ e)\ \Downarrow \ (e',\ \Xi_{2} ,\ \Phi_{2} )\ \land \ \mathsf{tail}_{\mathsf{opt}}'\ =\ e') \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtExpandBlock}(\Xi ,\ \Phi_{0} ,\ \operatorname{BlockExpr}(\mathsf{stmts},\ \mathsf{tail}_{\mathsf{opt}}))\ \Downarrow \ (\operatorname{BlockExpr}(\mathsf{stmts}',\ \mathsf{tail}_{\mathsf{opt}}'),\ \Xi_{2} ,\ \Phi_{2} )
\end{array}
```

**(CtExpandStmt-CtStmt)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CtExec}(\Xi ,\ \Phi_{0} ,\ \mathsf{body})\ \Downarrow \ (\Xi_{1} ,\ \Phi_{1} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtExpandStmt}(\Xi ,\ \Phi_{0} ,\ \operatorname{CtStmt}(\mathsf{body},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{span}))\ \Downarrow \ ([],\ \Xi_{1} ,\ \Phi_{1} )
\end{array}
```

**(CtExpandExpr-CtExpr)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CtEval}(\Xi ,\ \Phi_{0} ,\ \mathsf{body})\ \Downarrow \ (\mathsf{cv},\ \Xi_{1} ,\ \Phi_{1} )\quad \Gamma \ \vdash \ \operatorname{CtLiteralize}(\mathsf{cv})\ \Downarrow \ e' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtExpandExpr}(\Xi ,\ \Phi_{0} ,\ \operatorname{CtExpr}(\mathsf{body},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{span}))\ \Downarrow \ (e',\ \Xi_{1} ,\ \Phi_{1} )
\end{array}
```

**(CtExpandExpr-CtIf-True)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CtEval}(\Xi ,\ \Phi_{0} ,\ \mathsf{cond})\ \Downarrow \ (\operatorname{CtPrim}(\mathsf{true}),\ \Xi_{1} ,\ \Phi_{1} )\quad \Gamma \ \vdash \ \operatorname{CtExpandBlock}(\Xi_{1} ,\ \Phi_{1} ,\ \mathsf{then}_{\mathsf{blk}})\ \Downarrow \ (b',\ \Xi_{2} ,\ \Phi_{2} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtExpandExpr}(\Xi ,\ \Phi_{0} ,\ \operatorname{CtIf}(\mathsf{cond},\ \mathsf{then}_{\mathsf{blk}},\ \mathsf{else}_{\mathsf{opt}},\ \mathsf{span}))\ \Downarrow \ (b',\ \Xi_{2} ,\ \Phi_{2} )
\end{array}
```

**(CtExpandExpr-CtIf-False)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CtEval}(\Xi ,\ \Phi_{0} ,\ \mathsf{cond})\ \Downarrow \ (\operatorname{CtPrim}(\mathsf{false}),\ \Xi_{1} ,\ \Phi_{1} )\quad b\ =\ \operatorname{ElseBlock}(\mathsf{else}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{CtExpandBlock}(\Xi_{1} ,\ \Phi_{1} ,\ b)\ \Downarrow \ (b',\ \Xi_{2} ,\ \Phi_{2} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtExpandExpr}(\Xi ,\ \Phi_{0} ,\ \operatorname{CtIf}(\mathsf{cond},\ \mathsf{then}_{\mathsf{blk}},\ \mathsf{else}_{\mathsf{opt}},\ \mathsf{span}))\ \Downarrow \ (b',\ \Xi_{2} ,\ \Phi_{2} )
\end{array}
```

**(CtExpandExpr-CtLoopIter)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{CtEval}(\Xi ,\ \Phi_{0} ,\ \mathsf{src})\ \Downarrow \ (\mathsf{iter}_{v},\ \Xi_{1} ,\ \Phi_{1} )\quad \operatorname{CtIterable}(\mathsf{iter}_{v})\quad \mathsf{elems}\ =\ \operatorname{CtElems}(\mathsf{iter}_{v})\quad \Gamma \ \vdash \ \operatorname{CtLoopIterUnroll}(\Xi_{1} ,\ \Phi_{1} ,\ \mathsf{pat},\ \mathsf{body},\ \mathsf{elems})\ \Downarrow \ (\mathsf{stmts},\ \Xi_{2} ,\ \Phi_{2} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtExpandExpr}(\Xi ,\ \Phi_{0} ,\ \operatorname{CtLoopIter}(\mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{src},\ \mathsf{body},\ \mathsf{span}))\ \Downarrow \ (\operatorname{BlockExpr}(\mathsf{stmts},\ \operatorname{TupleExpr}([])),\ \Xi_{2} ,\ \Phi_{2} )
\end{array}
```

**(CtLoopIterUnroll-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtLoopIterUnroll}(\Xi ,\ \Phi ,\ \mathsf{pat},\ \mathsf{body},\ [])\ \Downarrow \ ([],\ \Xi ,\ \Phi )
\end{array}
```

**(CtLoopIterUnroll-Cons)**

```math
\begin{array}{l}
\operatorname{BindPatternCt}(\Xi ,\ \mathsf{pat},\ v)\ =\ \Xi_{0} \quad \Gamma \ \vdash \ \operatorname{CtExpandBlock}(\Xi_{0} ,\ \Phi_{0} ,\ \mathsf{body})\ \Downarrow \ (b,\ \Xi_{1} ,\ \Phi_{1} )\quad \Gamma \ \vdash \ \operatorname{CtLoopIterUnroll}(\Xi_{1} ,\ \Phi_{1} ,\ \mathsf{pat},\ \mathsf{body},\ \mathsf{rest})\ \Downarrow \ (\mathsf{stmts}_{\mathsf{rest}},\ \Xi_{2} ,\ \Phi_{2} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtLoopIterUnroll}(\Xi ,\ \Phi_{0} ,\ \mathsf{pat},\ \mathsf{body},\ [v]\ \mathbin{++} \ \mathsf{rest})\ \Downarrow \ (\operatorname{UnitBlockStmts}(b)\ \mathbin{++} \ \mathsf{stmts}_{\mathsf{rest}},\ \Xi_{2} ,\ \Phi_{2} )
\end{array}
```

```math
\begin{array}{l}
\operatorname{CtLiteralize}(\operatorname{CtPrim}(\mathsf{UnitVal}))\ \Downarrow \ \operatorname{TupleExpr}([]) \\
\operatorname{CtLiteralize}(\operatorname{CtPrim}(v))\ \Downarrow \ \operatorname{Literal}(\ell )\ \Leftrightarrow \ v\ \ne \ \mathsf{UnitVal}\ \land \ \exists \ T.\ \operatorname{LiteralValue}(\ell ,\ T)\ =\ v \\
\operatorname{CtLiteralize}(\operatorname{CtString}(v))\ \Downarrow \ \operatorname{Literal}(\ell )\ \Leftrightarrow \ \operatorname{LiteralValue}(\ell ,\ \operatorname{TypeString}(\texttt{@View}))\ =\ v\ \lor \ \operatorname{LiteralValue}(\ell ,\ \operatorname{TypeString}(\texttt{@Managed}))\ =\ v \\
\operatorname{CtLiteralize}(\operatorname{CtTuple}([v_{1},\ \ldots ,\ v_{n}]))\ \Downarrow \ \operatorname{TupleExpr}([e_{1},\ \ldots ,\ e_{n}])\ \Leftrightarrow \ \forall \ i.\ \Gamma \ \vdash \ \operatorname{CtLiteralize}(v_{i})\ \Downarrow \ e_{i} \\
\operatorname{CtLiteralize}(\operatorname{CtArray}([v_{1},\ \ldots ,\ v_{n}]))\ \Downarrow \ \operatorname{ArrayExpr}([e_{1},\ \ldots ,\ e_{n}])\ \Leftrightarrow \ \forall \ i.\ \Gamma \ \vdash \ \operatorname{CtLiteralize}(v_{i})\ \Downarrow \ e_{i} \\
\operatorname{CtLiteralize}(\operatorname{CtRecord}(\mathsf{path},\ [\langle f_{1},\ v_{1}\rangle ,\ \ldots ,\ \langle f_{n},\ v_{n}\rangle ]))\ \Downarrow \ \operatorname{RecordExpr}(\operatorname{TypePath}(\mathsf{path}),\ [\langle f_{1},\ e_{1}\rangle ,\ \ldots ,\ \langle f_{n},\ e_{n}\rangle ])\ \Leftrightarrow \ \forall \ i.\ \Gamma \ \vdash \ \operatorname{CtLiteralize}(v_{i})\ \Downarrow \ e_{i} \\
\operatorname{CtLiteralize}(\operatorname{CtModalState}(\mathsf{modal}_{\mathsf{ref}},\ \mathsf{state},\ [\langle f_{1},\ v_{1}\rangle ,\ \ldots ,\ \langle f_{n},\ v_{n}\rangle ]))\ \Downarrow \ \operatorname{RecordExpr}(\operatorname{ModalStateRef}(\mathsf{modal}_{\mathsf{ref}},\ \mathsf{state}),\ [\langle f_{1},\ e_{1}\rangle ,\ \ldots ,\ \langle f_{n},\ e_{n}\rangle ])\ \Leftrightarrow \ \forall \ i.\ \Gamma \ \vdash \ \operatorname{CtLiteralize}(v_{i})\ \Downarrow \ e_{i} \\
\operatorname{CtLiteralize}(\operatorname{CtEnum}(\mathsf{path},\ \mathsf{variant},\ \bot ))\ \Downarrow \ \operatorname{EnumLiteral}(\mathsf{path}\ \mathbin{++} \ [\mathsf{variant}],\ \bot ) \\
\operatorname{CtLiteralize}(\operatorname{CtEnum}(\mathsf{path},\ \mathsf{variant},\ \operatorname{CtTuplePayload}([v_{1},\ \ldots ,\ v_{n}])))\ \Downarrow \ \operatorname{EnumLiteral}(\mathsf{path}\ \mathbin{++} \ [\mathsf{variant}],\ \operatorname{Paren}([e_{1},\ \ldots ,\ e_{n}]))\ \Leftrightarrow \ \forall \ i.\ \Gamma \ \vdash \ \operatorname{CtLiteralize}(v_{i})\ \Downarrow \ e_{i} \\
\operatorname{CtLiteralize}(\operatorname{CtEnum}(\mathsf{path},\ \mathsf{variant},\ \operatorname{CtRecordPayload}([\langle f_{1},\ v_{1}\rangle ,\ \ldots ,\ \langle f_{n},\ v_{n}\rangle ])))\ \Downarrow \ \operatorname{EnumLiteral}(\mathsf{path}\ \mathbin{++} \ [\mathsf{variant}],\ \operatorname{Brace}([\langle f_{1},\ e_{1}\rangle ,\ \ldots ,\ \langle f_{n},\ e_{n}\rangle ]))\ \Leftrightarrow \ \forall \ i.\ \Gamma \ \vdash \ \operatorname{CtLiteralize}(v_{i})\ \Downarrow \ e_{i} \\
\operatorname{CtLiteralize}(\operatorname{CtAst}(a))\ \Downarrow \ \operatorname{AstPayloadOf}(a)\quad \mathsf{if}\ \operatorname{AstKindOf}(a)\ =\ \texttt{Expr}
\end{array}
```

#### 22.1.6 Lowering

Compile-time execution is complete before Phase 3 typing and Phase 4 lowering. No runtime IR is emitted directly for:
- compile-time procedures
- compile-time statements
- compile-time expressions after literalization or AST substitution

Phase 4 lowers only the expanded program produced by `ExecuteComptime`.

#### 22.1.7 Diagnostics

Diagnostics for compile-time forms are defined by §22.6.

### 22.2 Compile-Time Capabilities

#### 22.2.1 Syntax

This section introduces no additional surface syntax beyond `[[emit]]`, `[[files]]`, and the built-in identifiers available in compile-time contexts.

#### 22.2.2 Parsing

```math
\mathsf{CtCapName}\ =\ \{\texttt{emitter},\ \texttt{introspect},\ \texttt{files},\ \texttt{diagnostics}\}
```

**(Parse-CtCapRef)**

```math
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \operatorname{Lexeme}(\operatorname{Tok}(P))\ \in \ \mathsf{CtCapName} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \operatorname{Identifier}(\operatorname{Lexeme}(\operatorname{Tok}(P))))
\end{array}
```

Capability method calls then use the ordinary call and method-call parsers.

#### 22.2.3 AST Representation / Form

```math
\begin{array}{l}
\mathsf{CtCap}\ =\ \{\mathsf{TypeEmitter},\ \mathsf{Introspect},\ \mathsf{ProjectFiles},\ \mathsf{ComptimeDiagnostics}\} \\
\mathsf{CtBuiltinType}\ =\ \{\texttt{Type},\ \texttt{Ast},\ \texttt{Ast::Expr},\ \texttt{Ast::Stmt},\ \texttt{Ast::Item},\ \texttt{Ast::Type},\ \texttt{Ast::Pattern},\ \texttt{TypeCategory},\ \texttt{FieldInfo},\ \texttt{VariantInfo},\ \texttt{StateInfo},\ \texttt{SourceSpan}\} \\
\operatorname{CtCapType}(\texttt{emitter})\ =\ \operatorname{TypePath}([\texttt{"TypeEmitter"}]) \\
\operatorname{CtCapType}(\texttt{introspect})\ =\ \operatorname{TypePath}([\texttt{"Introspect"}]) \\
\operatorname{CtCapType}(\texttt{files})\ =\ \operatorname{TypePath}([\texttt{"ProjectFiles"}]) \\
\operatorname{CtCapType}(\texttt{diagnostics})\ =\ \operatorname{TypePath}([\texttt{"ComptimeDiagnostics"}])
\end{array}
```

```math
\begin{array}{l}
\operatorname{HasCtCap}(\mathsf{node},\ \texttt{Introspect})\ \Leftrightarrow \ \mathsf{node}\ \mathsf{executes}\ \mathsf{in}\ \mathsf{Phase}\ 2 \\
\operatorname{HasCtCap}(\mathsf{node},\ \texttt{ComptimeDiagnostics})\ \Leftrightarrow \ \mathsf{node}\ \mathsf{executes}\ \mathsf{in}\ \mathsf{Phase}\ 2 \\
\operatorname{HasCtCap}(\mathsf{node},\ \texttt{TypeEmitter})\ \Leftrightarrow \ \mathsf{node}\ \mathsf{executes}\ \mathsf{in}\ \mathsf{Phase}\ 2\ \land \ (\texttt{[[emit]]}\ \mathsf{applies}\ \mathsf{to}\ \mathsf{node}\ \lor \ \mathsf{node}\ \mathsf{is}\ a\ \mathsf{derive}\ \mathsf{target}\ \mathsf{body}) \\
\operatorname{HasCtCap}(\mathsf{node},\ \texttt{ProjectFiles})\ \Leftrightarrow \ \mathsf{node}\ \mathsf{executes}\ \mathsf{in}\ \mathsf{Phase}\ 2\ \land \ \texttt{[[files]]}\ \mathsf{applies}\ \mathsf{to}\ \mathsf{node}
\end{array}
```

```math
\begin{array}{l}
\mathsf{SourceSpanFields}\ =\ [\langle \texttt{file},\ \operatorname{TypeString}(\texttt{@Managed})\rangle ,\ \langle \texttt{start\_line},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ,\ \langle \texttt{start\_col},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ,\ \langle \texttt{end\_line},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ,\ \langle \texttt{end\_col},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ] \\
\mathsf{FieldInfoFields}\ =\ [\langle \texttt{name},\ \operatorname{TypeString}(\texttt{@Managed})\rangle ,\ \langle \texttt{type},\ \operatorname{TypePath}([\texttt{"Type"}])\rangle ,\ \langle \texttt{visibility},\ \operatorname{TypeString}(\texttt{@Managed})\rangle ,\ \langle \texttt{index},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle ,\ \langle \texttt{span},\ \operatorname{TypePath}([\texttt{"SourceSpan"}])\rangle ] \\
\mathsf{VariantInfoFields}\ =\ [\langle \texttt{name},\ \operatorname{TypeString}(\texttt{@Managed})\rangle ,\ \langle \texttt{payload\_kind},\ \operatorname{TypeString}(\texttt{@Managed})\rangle ,\ \langle \texttt{payload\_types},\ \operatorname{TypeSlice}(\operatorname{TypePath}([\texttt{"Type"}]))\rangle ,\ \langle \texttt{field\_names},\ \operatorname{TypeSlice}(\operatorname{TypeString}(\texttt{@Managed}))\rangle ,\ \langle \texttt{span},\ \operatorname{TypePath}([\texttt{"SourceSpan"}])\rangle ] \\
\mathsf{StateInfoFields}\ =\ [\langle \texttt{name},\ \operatorname{TypeString}(\texttt{@Managed})\rangle ,\ \langle \texttt{field\_names},\ \operatorname{TypeSlice}(\operatorname{TypeString}(\texttt{@Managed}))\rangle ,\ \langle \texttt{method\_names},\ \operatorname{TypeSlice}(\operatorname{TypeString}(\texttt{@Managed}))\rangle ,\ \langle \texttt{transition\_names},\ \operatorname{TypeSlice}(\operatorname{TypeString}(\texttt{@Managed}))\rangle ,\ \langle \texttt{span},\ \operatorname{TypePath}([\texttt{"SourceSpan"}])\rangle ]
\end{array}
```

```math
\begin{array}{l}
\operatorname{ModulePathText}(\mathsf{path})\ =\ \operatorname{StringOfPath}(\mathsf{path}) \\
\operatorname{CtOutcomeValue}(T,\ v)\ =\ \operatorname{CtModalState}(\operatorname{TypeApply}([\texttt{"Outcome"}],\ [T,\ \operatorname{TypePath}([\texttt{"IoError"}])]),\ \texttt{@Value},\ [\langle \texttt{value},\ v\rangle ]) \\
\operatorname{CtOutcomeError}(T,\ e)\ =\ \operatorname{CtModalState}(\operatorname{TypeApply}([\texttt{"Outcome"}],\ [T,\ \operatorname{TypePath}([\texttt{"IoError"}])]),\ \texttt{@Error},\ [\langle \texttt{error},\ \operatorname{CtEnum}([\texttt{IoError}],\ \operatorname{IoErrorVariant}(e),\ \bot )\rangle ]) \\
\operatorname{CtFileResult}(r,\ T)\ =\ \operatorname{CtOutcomeValue}(T,\ \operatorname{CtString}(r))\quad \mathsf{if}\ r\ \in \ \mathsf{String} \\
\operatorname{CtFileResult}(r,\ T)\ =\ \operatorname{CtOutcomeValue}(T,\ \operatorname{CtBytes}(r))\quad \mathsf{if}\ r\ \in \ \mathsf{Bytes} \\
\operatorname{CtFileResult}(r,\ T)\ =\ \operatorname{CtOutcomeValue}(T,\ \operatorname{CtPrim}(r))\quad \mathsf{if}\ r\ \in \ \mathsf{Bool} \\
\operatorname{CtFileResult}(r,\ T)\ =\ \operatorname{CtOutcomeValue}(T,\ \operatorname{CtSlice}([\operatorname{CtString}(x)\ \mid \ x\ \in \ r]))\quad \mathsf{if}\ r\ \in \ \operatorname{List}(\mathsf{String}) \\
\operatorname{CtFileResult}(r,\ T)\ =\ \operatorname{CtOutcomeError}(T,\ r)\quad \mathsf{if}\ r\ \in \ \mathsf{IoError} \\
\operatorname{IoErrorVariant}(\mathsf{IoError}\mathbin{::} \mathsf{NotFound})\ =\ \texttt{NotFound} \\
\operatorname{IoErrorVariant}(\mathsf{IoError}\mathbin{::} \mathsf{PermissionDenied})\ =\ \texttt{PermissionDenied} \\
\operatorname{IoErrorVariant}(\mathsf{IoError}\mathbin{::} \mathsf{AlreadyExists})\ =\ \texttt{AlreadyExists} \\
\operatorname{IoErrorVariant}(\mathsf{IoError}\mathbin{::} \mathsf{InvalidPath})\ =\ \texttt{InvalidPath} \\
\operatorname{IoErrorVariant}(\mathsf{IoError}\mathbin{::} \mathsf{Busy})\ =\ \texttt{Busy} \\
\operatorname{IoErrorVariant}(\mathsf{IoError}\mathbin{::} \mathsf{IoFailure})\ =\ \texttt{IoFailure} \\
\operatorname{SpanValue}(\mathsf{sp})\ =\ \operatorname{CtRecord}([\texttt{SourceSpan}],\ [\langle \texttt{file},\ \operatorname{CtString}(\mathsf{sp}.\mathsf{file})\rangle ,\ \langle \texttt{start\_line},\ \operatorname{CtPrim}(\mathsf{sp}.\mathsf{start}_{\mathsf{line}})\rangle ,\ \langle \texttt{start\_col},\ \operatorname{CtPrim}(\mathsf{sp}.\mathsf{start}_{\mathsf{col}})\rangle ,\ \langle \texttt{end\_line},\ \operatorname{CtPrim}(\mathsf{sp}.\mathsf{end}_{\mathsf{line}})\rangle ,\ \langle \texttt{end\_col},\ \operatorname{CtPrim}(\mathsf{sp}.\mathsf{end}_{\mathsf{col}})\rangle ]) \\
\operatorname{FieldInfoValue}(\mathsf{name},\ T,\ \mathsf{vis},\ \mathsf{index},\ \mathsf{sp})\ =\ \operatorname{CtRecord}([\texttt{FieldInfo}],\ [\langle \texttt{name},\ \operatorname{CtString}(\mathsf{name})\rangle ,\ \langle \texttt{type},\ \operatorname{CtType}(T)\rangle ,\ \langle \texttt{visibility},\ \operatorname{CtString}(\mathsf{vis})\rangle ,\ \langle \texttt{index},\ \operatorname{CtPrim}(\mathsf{index})\rangle ,\ \langle \texttt{span},\ \operatorname{SpanValue}(\mathsf{sp})\rangle ]) \\
\operatorname{VariantInfoValue}(\mathsf{name},\ \mathsf{payload}_{\mathsf{kind}},\ \mathsf{payload}_{\mathsf{types}},\ \mathsf{field}_{\mathsf{names}},\ \mathsf{sp})\ =\ \operatorname{CtRecord}([\texttt{VariantInfo}],\ [\langle \texttt{name},\ \operatorname{CtString}(\mathsf{name})\rangle ,\ \langle \texttt{payload\_kind},\ \operatorname{CtString}(\mathsf{payload}_{\mathsf{kind}})\rangle ,\ \langle \texttt{payload\_types},\ \operatorname{CtSlice}([\operatorname{CtType}(T)\ \mid \ T\ \in \ \mathsf{payload}_{\mathsf{types}}])\rangle ,\ \langle \texttt{field\_names},\ \operatorname{CtSlice}([\operatorname{CtString}(f)\ \mid \ f\ \in \ \mathsf{field}_{\mathsf{names}}])\rangle ,\ \langle \texttt{span},\ \operatorname{SpanValue}(\mathsf{sp})\rangle ]) \\
\operatorname{StateInfoValue}(\mathsf{name},\ \mathsf{field}_{\mathsf{names}},\ \mathsf{method}_{\mathsf{names}},\ \mathsf{transition}_{\mathsf{names}},\ \mathsf{sp})\ =\ \operatorname{CtRecord}([\texttt{StateInfo}],\ [\langle \texttt{name},\ \operatorname{CtString}(\mathsf{name})\rangle ,\ \langle \texttt{field\_names},\ \operatorname{CtSlice}([\operatorname{CtString}(f)\ \mid \ f\ \in \ \mathsf{field}_{\mathsf{names}}])\rangle ,\ \langle \texttt{method\_names},\ \operatorname{CtSlice}([\operatorname{CtString}(m)\ \mid \ m\ \in \ \mathsf{method}_{\mathsf{names}}])\rangle ,\ \langle \texttt{transition\_names},\ \operatorname{CtSlice}([\operatorname{CtString}(t)\ \mid \ t\ \in \ \mathsf{transition}_{\mathsf{names}}])\rangle ,\ \langle \texttt{span},\ \operatorname{SpanValue}(\mathsf{sp})\rangle ])
\end{array}
```

TypeEmitterInterface =
{

```math
\ \langle \texttt{"emit"},\ [\langle \bot ,\ \texttt{ast},\ \operatorname{TypePath}([\texttt{"Ast"}])\rangle ],\ \operatorname{TypePrim}(\texttt{"()"})\rangle 
```
}

IntrospectInterface =
{

```math
\begin{array}{l}
\ \langle \texttt{"category"},\ [\langle \bot ,\ \texttt{ty},\ \operatorname{TypePath}([\texttt{"Type"}])\rangle ],\ \operatorname{TypePath}([\texttt{"TypeCategory"}])\rangle , \\
\ \langle \texttt{"fields"},\ [\langle \bot ,\ \texttt{ty},\ \operatorname{TypePath}([\texttt{"Type"}])\rangle ],\ \operatorname{TypeSlice}(\operatorname{TypePath}([\texttt{"FieldInfo"}]))\rangle , \\
\ \langle \texttt{"variants"},\ [\langle \bot ,\ \texttt{ty},\ \operatorname{TypePath}([\texttt{"Type"}])\rangle ],\ \operatorname{TypeSlice}(\operatorname{TypePath}([\texttt{"VariantInfo"}]))\rangle , \\
\ \langle \texttt{"states"},\ [\langle \bot ,\ \texttt{ty},\ \operatorname{TypePath}([\texttt{"Type"}])\rangle ],\ \operatorname{TypeSlice}(\operatorname{TypePath}([\texttt{"StateInfo"}]))\rangle , \\
\ \langle \texttt{"implements\_form"},\ [\langle \bot ,\ \texttt{ty},\ \operatorname{TypePath}([\texttt{"Type"}])\rangle ,\ \langle \bot ,\ \texttt{form},\ \operatorname{TypePath}([\texttt{"Type"}])\rangle ],\ \operatorname{TypePrim}(\texttt{"bool"})\rangle , \\
\ \langle \texttt{"type\_name"},\ [\langle \bot ,\ \texttt{ty},\ \operatorname{TypePath}([\texttt{"Type"}])\rangle ],\ \operatorname{TypeString}(\texttt{@Managed})\rangle , \\
\ \langle \texttt{"module\_path"},\ [\langle \bot ,\ \texttt{ty},\ \operatorname{TypePath}([\texttt{"Type"}])\rangle ],\ \operatorname{TypeString}(\texttt{@Managed})\rangle 
\end{array}
```
}

ProjectFilesInterface =
{

```math
\begin{array}{l}
\ \langle \texttt{"read"},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeString}(\texttt{@Managed})),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\
\ \langle \texttt{"read\_bytes"},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeBytes}(\texttt{@Managed})),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\
\ \langle \texttt{"exists"},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypePrim}(\texttt{"bool"}),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\
\ \langle \texttt{"list\_dir"},\ [\langle \bot ,\ \texttt{path},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypeApply}([\texttt{"Outcome"}],\ [\operatorname{TypeSlice}(\operatorname{TypeString}(\texttt{@Managed})),\ \operatorname{TypePath}([\texttt{"IoError"}])])\rangle , \\
\ \langle \texttt{"project\_root"},\ [],\ \operatorname{TypeString}(\texttt{@Managed})\rangle 
\end{array}
```
}

ComptimeDiagnosticsInterface =
{

```math
\begin{array}{l}
\ \langle \texttt{"error"},\ [\langle \bot ,\ \texttt{message},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypePrim}(\texttt{"!"})\rangle , \\
\ \langle \texttt{"warning"},\ [\langle \bot ,\ \texttt{message},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypePrim}(\texttt{"()"})\rangle , \\
\ \langle \texttt{"note"},\ [\langle \bot ,\ \texttt{message},\ \operatorname{TypeString}(\texttt{@View})\rangle ],\ \operatorname{TypePrim}(\texttt{"()"})\rangle , \\
\ \langle \texttt{"current\_span"},\ [],\ \operatorname{TypePath}([\texttt{"SourceSpan"}])\rangle , \\
\ \langle \texttt{"current\_module"},\ [],\ \operatorname{TypeString}(\texttt{@Managed})\rangle 
\end{array}
```
}

#### 22.2.4 Static Semantics

`Introspect` and `ComptimeDiagnostics` are available in every compile-time context.

`TypeEmitter` is available only:
- inside a `comptime` form annotated with `[[emit]]`
- inside the body of a derive target declaration

`ProjectFiles` is available only inside a `comptime` form annotated with `[[files]]`.

```math
\operatorname{CtCapBindings}(\mathsf{node})\ =\ [\langle \texttt{introspect},\ \operatorname{TypePath}([\texttt{"Introspect"}])\rangle ,\ \langle \texttt{diagnostics},\ \operatorname{TypePath}([\texttt{"ComptimeDiagnostics"}])\rangle ]\ \mathbin{++} \ ([\langle \texttt{emitter},\ \operatorname{TypePath}([\texttt{"TypeEmitter"}])\rangle ]\ \mathsf{if}\ \operatorname{HasCtCap}(\mathsf{node},\ \texttt{TypeEmitter}),\ \mathsf{else}\ [])\ \mathbin{++} \ ([\langle \texttt{files},\ \operatorname{TypePath}([\texttt{"ProjectFiles"}])\rangle ]\ \mathsf{if}\ \operatorname{HasCtCap}(\mathsf{node},\ \texttt{ProjectFiles}),\ \mathsf{else}\ [])
```

```math
\texttt{files.project\_root()},\ \texttt{files.read(path)},\ \texttt{files.read\_bytes(path)},\ \texttt{files.exists(path)},\ \mathsf{and}\ \texttt{files.list\_dir(path)}\ \mathsf{MUST}\ \mathsf{use}\ \mathsf{project}-\mathsf{root}-\mathsf{relative}\ \mathsf{paths}.\ \mathsf{The}\ \mathsf{argument}\ \mathsf{path}:
```
- MUST NOT be absolute
- MUST NOT contain `..` components that escape the project root after normalization
- MUST be resolved against a deterministic Phase 2 snapshot of project files
- If restriction fails, `files.read`, `files.read_bytes`, `files.exists`, and `files.list_dir` MUST return `IoError::InvalidPath`

```math
\texttt{emitter.emit(ast)}\ \mathsf{requires}\ \texttt{ast}\ \mathsf{to}\ \mathsf{have}\ \mathsf{compile}-\mathsf{time}\ \mathsf{type}\ \texttt{Ast::Item}\ \mathsf{or}\ \texttt{Ast}.
```

#### 22.2.5 Dynamic Semantics

```math
\begin{array}{l}
\operatorname{CtEmitItem}(\Xi ,\ \Phi ,\ a)\ =\ \Phi '\ \Leftrightarrow \ \operatorname{AstKindOf}(a)\ =\ \texttt{Item}\ \land \ \operatorname{AstHygieneOf}(a)\ =\ \langle \mathsf{quote}_{\mathsf{site}},\ \_,\ \_\rangle \ \land \ \operatorname{HygienizeAst}(a,\ \mathsf{quote}_{\mathsf{site}},\ \operatorname{CtSiteOf}(\Xi ),\ \operatorname{CtFreshSeed}(\Phi ))\ \Downarrow \ (a',\ n')\ \land \ \Phi '\ =\ \langle \operatorname{CtFiles}(\Phi ),\ \operatorname{CtProjectRoot}(\Phi ),\ \operatorname{CtDiags}(\Phi ),\ \operatorname{CtPendingEmits}(\Phi )\ \mathbin{++} \ [\operatorname{AstPayloadOf}(a')],\ n'\rangle  \\
\operatorname{CtProjectPath}(\Phi ,\ \mathsf{path})\ =\ q\ \Leftrightarrow \ \operatorname{RestrictPath}(\operatorname{CtProjectRoot}(\Phi ),\ \mathsf{path})\ =\ q \\
\operatorname{CtProjectPath}(\Phi ,\ \mathsf{path})\ =\ \bot \ \Leftrightarrow \ \operatorname{RestrictPath}(\operatorname{CtProjectRoot}(\Phi ),\ \mathsf{path})\ =\ \bot  \\
\operatorname{CtDiagAppend}(\Xi ,\ \Phi ,\ d)\ =\ \Phi '\ \Leftrightarrow \ \Phi '\ =\ \langle \operatorname{CtFiles}(\Phi ),\ \operatorname{CtProjectRoot}(\Phi ),\ \operatorname{CtDiags}(\Phi )\ \mathbin{++} \ [d],\ \operatorname{CtPendingEmits}(\Phi ),\ \operatorname{CtFreshSeed}(\Phi )\rangle  \\
\operatorname{CtUserErrorDiag}(\Xi ,\ \mathsf{msg})\ =\ d\ \Leftrightarrow \ \operatorname{CtSiteOf}(\Xi )\ =\ \langle \_,\ \_,\ \mathsf{sp}\rangle \ \land \ d\ =\ \langle \texttt{E-CTE-0070},\ \mathsf{Error},\ \mathsf{msg},\ \mathsf{sp}\rangle  \\
\operatorname{CtUserWarningDiag}(\Xi ,\ \mathsf{msg})\ =\ d\ \Leftrightarrow \ \operatorname{CtSiteOf}(\Xi )\ =\ \langle \_,\ \_,\ \mathsf{sp}\rangle \ \land \ d\ =\ \langle \texttt{W-CTE-0071},\ \mathsf{Warning},\ \mathsf{msg},\ \mathsf{sp}\rangle  \\
\operatorname{CtUserNoteDiag}(\Xi ,\ \mathsf{msg})\ =\ d\ \Leftrightarrow \ \operatorname{CtSiteOf}(\Xi )\ =\ \langle \_,\ \_,\ \mathsf{sp}\rangle \ \land \ d\ =\ \langle \bot ,\ \mathsf{Note},\ \mathsf{msg},\ \mathsf{sp}\rangle  \\
\operatorname{CtListDirResult}(\mathsf{fs},\ q)\ =\ \operatorname{CtSlice}([\operatorname{CtString}(\mathsf{entry}.\mathsf{name})\ \mid \ \mathsf{entry}\ \in \ \mathsf{entries}])\ \Leftrightarrow \ \exists \ \omega .\ \operatorname{DirEntries}(\mathsf{fs},\ q,\ \omega )\ =\ \mathsf{entries} \\
\operatorname{CtListDirResult}(\mathsf{fs},\ q)\ =\ \operatorname{CtEnum}([\texttt{IoError}],\ \operatorname{IoErrorVariant}(r),\ \bot )\ \Leftrightarrow \ \operatorname{FSOpenDir}(\mathsf{fs},\ q)\ \Downarrow \ r\ \land \ r\ \in \ \mathsf{IoError} \\
\operatorname{CtExistsResult}(\mathsf{fs},\ q)\ =\ \operatorname{CtPrim}(b)\ \Leftrightarrow \ \operatorname{FSExists}(\mathsf{fs},\ q)\ \Downarrow \ b\ \land \ b\ \in \ \mathsf{Bool} \\
\operatorname{CtExistsResult}(\mathsf{fs},\ q)\ =\ \operatorname{CtEnum}([\texttt{IoError}],\ \operatorname{IoErrorVariant}(r),\ \bot )\ \Leftrightarrow \ \operatorname{FSExists}(\mathsf{fs},\ q)\ \Downarrow \ r\ \land \ r\ \in \ \mathsf{IoError}
\end{array}
```

**(CtBuiltin-Emit)**

```math
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{emitter}\quad \mathsf{name}\ =\ \texttt{emit}\quad \mathsf{args}\ =\ [\operatorname{CtAst}(a)]\quad \operatorname{CtEmitItem}(\Xi ,\ \Phi ,\ a)\ =\ \Phi ' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtPrim}(\mathsf{UnitVal}),\ \Phi ')
\end{array}
```

**(CtBuiltin-ProjectRoot)**

```math
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{files}\quad \mathsf{name}\ =\ \texttt{project\_root} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ [])\ \Downarrow \ (\operatorname{CtString}(\operatorname{CtProjectRoot}(\Phi )),\ \Phi )
\end{array}
```

**(CtBuiltin-Read)**

```math
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{files}\quad \mathsf{name}\ =\ \texttt{read}\quad \mathsf{args}\ =\ [\operatorname{CtString}(\mathsf{path})]\quad \operatorname{CtProjectPath}(\Phi ,\ \mathsf{path})\ =\ q\quad \operatorname{FSReadFile}(\operatorname{CtFiles}(\Phi ),\ q)\ \Downarrow \ r \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtFileResult}(r,\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeString}(\texttt{@Managed}))),\ \Phi )
\end{array}
```

**(CtBuiltin-Read-InvalidPath)**

```math
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{files}\quad \mathsf{name}\ =\ \texttt{read}\quad \mathsf{args}\ =\ [\operatorname{CtString}(\mathsf{path})]\quad \operatorname{CtProjectPath}(\Phi ,\ \mathsf{path})\ =\ \bot  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtOutcomeError}(\operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeString}(\texttt{@Managed})),\ \mathsf{IoError}\mathbin{::} \mathsf{InvalidPath}),\ \Phi )
\end{array}
```

**(CtBuiltin-ReadBytes)**

```math
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{files}\quad \mathsf{name}\ =\ \texttt{read\_bytes}\quad \mathsf{args}\ =\ [\operatorname{CtString}(\mathsf{path})]\quad \operatorname{CtProjectPath}(\Phi ,\ \mathsf{path})\ =\ q\quad \operatorname{FSReadBytes}(\operatorname{CtFiles}(\Phi ),\ q)\ \Downarrow \ r \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtFileResult}(r,\ \operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeBytes}(\texttt{@Managed}))),\ \Phi )
\end{array}
```

**(CtBuiltin-ReadBytes-InvalidPath)**

```math
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{files}\quad \mathsf{name}\ =\ \texttt{read\_bytes}\quad \mathsf{args}\ =\ [\operatorname{CtString}(\mathsf{path})]\quad \operatorname{CtProjectPath}(\Phi ,\ \mathsf{path})\ =\ \bot  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtOutcomeError}(\operatorname{TypePerm}(\texttt{unique},\ \operatorname{TypeBytes}(\texttt{@Managed})),\ \mathsf{IoError}\mathbin{::} \mathsf{InvalidPath}),\ \Phi )
\end{array}
```

**(CtBuiltin-Exists)**

```math
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{files}\quad \mathsf{name}\ =\ \texttt{exists}\quad \mathsf{args}\ =\ [\operatorname{CtString}(\mathsf{path})]\quad \operatorname{CtProjectPath}(\Phi ,\ \mathsf{path})\ =\ q\quad \operatorname{CtExistsResult}(\operatorname{CtFiles}(\Phi ),\ q)\ =\ v \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtFileResult}(v,\ \operatorname{TypePrim}(\texttt{"bool"})),\ \Phi )
\end{array}
```

**(CtBuiltin-Exists-InvalidPath)**

```math
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{files}\quad \mathsf{name}\ =\ \texttt{exists}\quad \mathsf{args}\ =\ [\operatorname{CtString}(\mathsf{path})]\quad \operatorname{CtProjectPath}(\Phi ,\ \mathsf{path})\ =\ \bot  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtOutcomeError}(\operatorname{TypePrim}(\texttt{"bool"}),\ \mathsf{IoError}\mathbin{::} \mathsf{InvalidPath}),\ \Phi )
\end{array}
```

**(CtBuiltin-ListDir)**

```math
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{files}\quad \mathsf{name}\ =\ \texttt{list\_dir}\quad \mathsf{args}\ =\ [\operatorname{CtString}(\mathsf{path})]\quad \operatorname{CtProjectPath}(\Phi ,\ \mathsf{path})\ =\ q\quad \operatorname{CtListDirResult}(\operatorname{CtFiles}(\Phi ),\ q)\ =\ v \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtFileResult}(v,\ \operatorname{TypeSlice}(\operatorname{TypeString}(\texttt{@Managed}))),\ \Phi )
\end{array}
```

**(CtBuiltin-ListDir-InvalidPath)**

```math
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{files}\quad \mathsf{name}\ =\ \texttt{list\_dir}\quad \mathsf{args}\ =\ [\operatorname{CtString}(\mathsf{path})]\quad \operatorname{CtProjectPath}(\Phi ,\ \mathsf{path})\ =\ \bot  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtOutcomeError}(\operatorname{TypeSlice}(\operatorname{TypeString}(\texttt{@Managed})),\ \mathsf{IoError}\mathbin{::} \mathsf{InvalidPath}),\ \Phi )
\end{array}
```

**(CtBuiltin-Diagnostics-Error)**

```math
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{diagnostics}\quad \mathsf{name}\ =\ \texttt{error}\quad \mathsf{args}\ =\ [\operatorname{CtString}(\mathsf{msg})]\quad \operatorname{CtUserErrorDiag}(\Xi ,\ \mathsf{msg})\ =\ d\quad \operatorname{CtDiagAppend}(\Xi ,\ \Phi ,\ d)\ =\ \Phi ' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Uparrow \ \Phi '
\end{array}
```

**(CtBuiltin-Diagnostics-Warning)**

```math
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{diagnostics}\quad \mathsf{name}\ =\ \texttt{warning}\quad \mathsf{args}\ =\ [\operatorname{CtString}(\mathsf{msg})]\quad \operatorname{CtUserWarningDiag}(\Xi ,\ \mathsf{msg})\ =\ d\quad \operatorname{CtDiagAppend}(\Xi ,\ \Phi ,\ d)\ =\ \Phi ' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtPrim}(\mathsf{UnitVal}),\ \Phi ')
\end{array}
```

**(CtBuiltin-Diagnostics-Note)**

```math
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{diagnostics}\quad \mathsf{name}\ =\ \texttt{note}\quad \mathsf{args}\ =\ [\operatorname{CtString}(\mathsf{msg})]\quad \operatorname{CtUserNoteDiag}(\Xi ,\ \mathsf{msg})\ =\ d\quad \operatorname{CtDiagAppend}(\Xi ,\ \Phi ,\ d)\ =\ \Phi ' \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtPrim}(\mathsf{UnitVal}),\ \Phi ')
\end{array}
```

**(CtBuiltin-Diagnostics-CurrentSpan)**

```math
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{diagnostics}\quad \mathsf{name}\ =\ \texttt{current\_span}\quad \operatorname{CtSiteOf}(\Xi )\ =\ \langle \_,\ \_,\ \mathsf{sp}\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ [])\ \Downarrow \ (\operatorname{SpanValue}(\mathsf{sp}),\ \Phi )
\end{array}
```

**(CtBuiltin-Diagnostics-CurrentModule)**

```math
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{diagnostics}\quad \mathsf{name}\ =\ \texttt{current\_module}\quad \operatorname{CtSiteOf}(\Xi )\ =\ \langle \mathsf{mp},\ \_,\ \_\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ [])\ \Downarrow \ (\operatorname{CtString}(\operatorname{ModulePathText}(\mathsf{mp})),\ \Phi )
\end{array}
```

Project-file reads MUST observe the `CtFiles(Φ)` snapshot captured at the start of Phase 2. Host writes during compilation MUST NOT change the values returned by `FSReadFile`, `FSReadBytes`, `FSExists`, or `DirEntries` through that snapshot for the same restricted path.

#### 22.2.6 Lowering

Compile-time capabilities introduce no runtime object layout and no runtime symbol requirement beyond the emitted declarations they produce during Phase 2.

#### 22.2.7 Diagnostics

Diagnostics for compile-time capabilities are defined by §22.6.

### 22.3 Reflection

#### 22.3.1 Syntax

```text
type_literal ::= "Type" "::<" type ">"
```

#### 22.3.2 Parsing

```math
\mathsf{ReflectParseJudg}\ =\ \{\mathsf{ParseTypeLiteral}\}
```

**(Parse-TypeLiteral)**

```math
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \operatorname{Lexeme}(\operatorname{Tok}(P))\ =\ \texttt{"Type"}\quad \operatorname{IsOp}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"::"})\quad \operatorname{IsOp}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))),\ \texttt{"<"})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P))))\ \Downarrow \ (P_{1},\ T)\quad \operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{">"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{TypeLiteralExpr}(T))
\end{array}
```

#### 22.3.3 AST Representation / Form

```math
\begin{array}{l}
\operatorname{Reflectable}(\operatorname{TypePerm}(\_,\ T))\ \Leftrightarrow \ \operatorname{Reflectable}(T) \\
\operatorname{Reflectable}(\operatorname{TypeRefine}(T,\ \_))\ \Leftrightarrow \ \operatorname{Reflectable}(T) \\
\operatorname{Reflectable}(\operatorname{TypeModalState}(p,\ \mathsf{args},\ \_))\ \Leftrightarrow \ \operatorname{Reflectable}(\operatorname{TypeApply}(p,\ \mathsf{args})) \\
\operatorname{Reflectable}(\operatorname{TypePath}(p))\ \Leftrightarrow \ \operatorname{Reflectable}(\operatorname{TypeApply}(p,\ [])) \\
\operatorname{Reflectable}(\operatorname{TypeApply}(p,\ \mathsf{args}))\ \Leftrightarrow  \\
\ T\ =\ \operatorname{TypePrim}(\_)\ \lor \ T\ =\ \operatorname{TypeTuple}(\_)\ \lor \ T\ =\ \operatorname{TypeArray}(\_,\ \_)\ \lor \ T\ =\ \operatorname{TypeSlice}(\_)\ \lor \ T\ =\ \operatorname{TypeUnion}(\_)\quad \mathsf{if}\ \operatorname{TypeAliasDecl}(p)\ =\ A\ \land \ \operatorname{AliasBody}(A)\ =\ T\ \land \ \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(A.\mathsf{generic}_{\mathsf{params}})\ \land \ \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{args})\ =\ \mathsf{args}'\ \land \ \theta \ =\ [\mathsf{args}'\_i\ /\ \mathsf{params}_{\mathsf{gen}}[i].\mathsf{name}] \\
\operatorname{Reflectable}(\operatorname{TypeApply}(p,\ \mathsf{args}))\ \Leftrightarrow  \\
\ \operatorname{AttrByName}(\operatorname{DeclOf}(p),\ \texttt{"reflect"})\ \ne \ []\quad \mathsf{if}\ (\operatorname{RecordDecl}(p)\ \mathsf{defined}\ \lor \ \operatorname{EnumDecl}(p)\ \mathsf{defined}\ \lor \ \operatorname{ModalDecl}(p)\ \mathsf{defined})\ \land \ \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(\operatorname{DeclOf}(p).\mathsf{generic}_{\mathsf{params}})\ \land \ \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{args})\ =\ \mathsf{args}' \\
\operatorname{Reflectable}(\operatorname{TypePrim}(\_))\ \Leftrightarrow \ \mathsf{true} \\
\operatorname{Reflectable}(\operatorname{TypeTuple}(\_))\ \Leftrightarrow \ \mathsf{true} \\
\operatorname{Reflectable}(\operatorname{TypeArray}(\_,\ \_))\ \Leftrightarrow \ \mathsf{true} \\
\operatorname{Reflectable}(\operatorname{TypeSlice}(\_))\ \Leftrightarrow \ \mathsf{true} \\
\operatorname{Reflectable}(\operatorname{TypeUnion}(\_))\ \Leftrightarrow \ \mathsf{true}
\end{array}
```

```math
\begin{array}{l}
\mathsf{ReflectJudg}\ =\ \{\mathsf{ReflectFields},\ \mathsf{ReflectVariants},\ \mathsf{ReflectStates},\ \mathsf{ReflectImplements}\} \\
\operatorname{TypeLiteralExpr}(T)\ \mathsf{is}\ \mathsf{the}\ \mathsf{compile}-\mathsf{time}\ \mathsf{expression}\ \mathsf{form}\ \mathsf{introduced}\ \mathsf{by}\ \texttt{Type::<T>}.
\end{array}
```

```math
\mathsf{TypeCategory}\ =\ \{\texttt{Record},\ \texttt{Enum},\ \texttt{Modal},\ \texttt{Primitive},\ \texttt{Tuple},\ \texttt{Array},\ \texttt{Slice},\ \texttt{Union},\ \texttt{Procedure},\ \texttt{Reference},\ \texttt{Dynamic},\ \texttt{Opaque},\ \texttt{Generic},\ \texttt{String},\ \texttt{Bytes},\ \texttt{Range}\}
```

```math
\begin{array}{l}
\operatorname{CategoryOf}(\operatorname{TypePrim}(\_))\ =\ \texttt{Primitive} \\
\operatorname{CategoryOf}(\operatorname{TypePerm}(\_,\ \mathsf{base}))\ =\ \operatorname{CategoryOf}(\mathsf{base}) \\
\operatorname{CategoryOf}(\operatorname{TypeRefine}(\mathsf{base},\ \_))\ =\ \operatorname{CategoryOf}(\mathsf{base}) \\
\operatorname{CategoryOf}(\operatorname{TypeTuple}(\_))\ =\ \texttt{Tuple} \\
\operatorname{CategoryOf}(\operatorname{TypeArray}(\_,\ \_))\ =\ \texttt{Array} \\
\operatorname{CategoryOf}(\operatorname{TypeSlice}(\_))\ =\ \texttt{Slice} \\
\operatorname{CategoryOf}(\operatorname{TypeUnion}(\_))\ =\ \texttt{Union} \\
\operatorname{CategoryOf}(\operatorname{TypeFunc}(\_,\ \_))\ =\ \texttt{Procedure} \\
\operatorname{CategoryOf}(\operatorname{TypeClosure}(\_,\ \_,\ \_))\ =\ \texttt{Procedure} \\
\operatorname{CategoryOf}(\operatorname{TypePtr}(\_,\ \_))\ =\ \texttt{Reference} \\
\operatorname{CategoryOf}(\operatorname{TypeRawPtr}(\_,\ \_))\ =\ \texttt{Reference} \\
\operatorname{CategoryOf}(\operatorname{TypeDynamic}(\_))\ =\ \texttt{Dynamic} \\
\operatorname{CategoryOf}(\operatorname{TypeOpaque}(\_))\ =\ \texttt{Opaque} \\
\operatorname{CategoryOf}(\operatorname{TypeString}(\_))\ =\ \texttt{String} \\
\operatorname{CategoryOf}(\operatorname{TypeBytes}(\_))\ =\ \texttt{Bytes} \\
\operatorname{CategoryOf}(\operatorname{TypeModalState}(\_,\ \_))\ =\ \texttt{Modal} \\
\operatorname{CategoryOf}(\operatorname{TypePath}(p))\ =\ \texttt{Record}\ \mathsf{if}\ \operatorname{RecordDecl}(p)\ \mathsf{defined} \\
\operatorname{CategoryOf}(\operatorname{TypePath}(p))\ =\ \texttt{Enum}\ \mathsf{if}\ \operatorname{EnumDecl}(p)\ \mathsf{defined} \\
\operatorname{CategoryOf}(\operatorname{TypePath}(p))\ =\ \texttt{Modal}\ \mathsf{if}\ \operatorname{ModalDecl}(p)\ \mathsf{defined} \\
\operatorname{CategoryOf}(\operatorname{TypePath}(p))\ =\ \texttt{Generic}\ \mathsf{if}\ p\ \mathsf{denotes}\ a\ \mathsf{type}\ \mathsf{parameter} \\
\operatorname{CategoryOf}(\operatorname{TypeApply}(p,\ \_))\ =\ \operatorname{CategoryOf}(\operatorname{TypePath}(p)) \\
\operatorname{CategoryOf}(\operatorname{TypeRange}(\_))\ =\ \texttt{Range} \\
\operatorname{CategoryOf}(\operatorname{TypeRangeInclusive}(\_))\ =\ \texttt{Range} \\
\operatorname{CategoryOf}(\operatorname{TypeRangeFrom}(\_))\ =\ \texttt{Range} \\
\operatorname{CategoryOf}(\operatorname{TypeRangeTo}(\_))\ =\ \texttt{Range} \\
\operatorname{CategoryOf}(\operatorname{TypeRangeToInclusive}(\_))\ =\ \texttt{Range} \\
\operatorname{CategoryOf}(\mathsf{TypeRangeFull})\ =\ \texttt{Range}
\end{array}
```

```math
\begin{array}{l}
\operatorname{ReflectFields}(\operatorname{TypePerm}(\_,\ T))\ =\ \operatorname{ReflectFields}(T) \\
\operatorname{ReflectFields}(\operatorname{TypeRefine}(T,\ \_))\ =\ \operatorname{ReflectFields}(T) \\
\operatorname{ReflectFields}(\operatorname{TypePath}(p))\ =\ \operatorname{ReflectFields}(\operatorname{TypeApply}(p,\ [])) \\
\operatorname{ReflectFields}(\operatorname{TypeApply}(p,\ \mathsf{args}))\ =\ \operatorname{ReflectFields}(\operatorname{TypeSubst}(\theta ,\ \mathsf{ty}))\quad \mathsf{if}\ \operatorname{TypeAliasDecl}(p)\ =\ A\ \land \ \operatorname{AliasBody}(A)\ =\ \mathsf{ty}\ \land \ \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(A.\mathsf{generic}_{\mathsf{params}})\ \land \ \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{args})\ =\ \mathsf{args}'\ \land \ \theta \ =\ [\mathsf{args}'\_i\ /\ \mathsf{params}_{\mathsf{gen}}[i].\mathsf{name}] \\
\operatorname{ReflectFields}(\operatorname{TypeApply}(p,\ \mathsf{args}))\ =\ [\operatorname{FieldInfoValue}(f_{i},\ \operatorname{TypeSubst}(\theta ,\ T_{i}),\ \mathsf{vis}_{i},\ i\ -\ 1,\ \mathsf{sp}_{i})\ \mid \ \operatorname{RecordDecl}(p)\ =\ R\ \land \ \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(R.\mathsf{generic}_{\mathsf{params}})\ \land \ \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{args})\ =\ \mathsf{args}'\ \land \ \theta \ =\ [\mathsf{args}'\_j\ /\ \mathsf{params}_{\mathsf{gen}}[j].\mathsf{name}]\ \land \ \operatorname{Fields}(R)\ =\ [\operatorname{FieldDecl}(\_,\ \mathsf{vis}_{1},\ \_,\ f_{1},\ T_{1},\ \_,\ \mathsf{sp}_{1},\ \_),\ \ldots ,\ \operatorname{FieldDecl}(\_,\ \mathsf{vis}_{n},\ \_,\ f_{n},\ T_{n},\ \_,\ \mathsf{sp}_{n},\ \_)]\ \land \ 1\ \le \ i\ \le \ n]
\end{array}
```

```math
\begin{array}{l}
\operatorname{ReflectVariants}(\operatorname{TypePerm}(\_,\ T))\ =\ \operatorname{ReflectVariants}(T) \\
\operatorname{ReflectVariants}(\operatorname{TypeRefine}(T,\ \_))\ =\ \operatorname{ReflectVariants}(T) \\
\operatorname{ReflectVariants}(\operatorname{TypePath}(p))\ =\ \operatorname{ReflectVariants}(\operatorname{TypeApply}(p,\ [])) \\
\operatorname{ReflectVariants}(\operatorname{TypeApply}(p,\ \mathsf{args}))\ =\ \operatorname{ReflectVariants}(\operatorname{TypeSubst}(\theta ,\ \mathsf{ty}))\quad \mathsf{if}\ \operatorname{TypeAliasDecl}(p)\ =\ A\ \land \ \operatorname{AliasBody}(A)\ =\ \mathsf{ty}\ \land \ \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(A.\mathsf{generic}_{\mathsf{params}})\ \land \ \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{args})\ =\ \mathsf{args}'\ \land \ \theta \ =\ [\mathsf{args}'\_i\ /\ \mathsf{params}_{\mathsf{gen}}[i].\mathsf{name}] \\
\operatorname{ReflectVariants}(\operatorname{TypeApply}(p,\ \mathsf{args}))\ =\ [\operatorname{VariantInfoValue}(v_{i},\ \operatorname{PayloadKind}(\mathsf{payload}_{i}),\ [\operatorname{TypeSubst}(\theta ,\ T)\ \mid \ T\ \in \ \operatorname{PayloadTypesOpt}(\mathsf{payload}_{i})],\ \operatorname{PayloadFieldNames}(\mathsf{payload}_{i}),\ \mathsf{sp}_{i})\ \mid \ \operatorname{EnumDecl}(p)\ =\ E\ \land \ \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(E.\mathsf{generic}_{\mathsf{params}})\ \land \ \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{args})\ =\ \mathsf{args}'\ \land \ \theta \ =\ [\mathsf{args}'\_j\ /\ \mathsf{params}_{\mathsf{gen}}[j].\mathsf{name}]\ \land \ \operatorname{Variants}(E)\ =\ [\operatorname{VariantDecl}(v_{1},\ \mathsf{payload}_{1},\ \_,\ \mathsf{sp}_{1},\ \_),\ \ldots ,\ \operatorname{VariantDecl}(v_{n},\ \mathsf{payload}_{n},\ \_,\ \mathsf{sp}_{n},\ \_)]\ \land \ 1\ \le \ i\ \le \ n]
\end{array}
```

```math
\begin{array}{l}
\operatorname{ReflectStates}(\operatorname{TypePerm}(\_,\ T))\ =\ \operatorname{ReflectStates}(T) \\
\operatorname{ReflectStates}(\operatorname{TypeRefine}(T,\ \_))\ =\ \operatorname{ReflectStates}(T) \\
\operatorname{ReflectStates}(\operatorname{TypeModalState}(p,\ \mathsf{args},\ \_))\ =\ \operatorname{ReflectStates}(\operatorname{TypeApply}(p,\ \mathsf{args})) \\
\operatorname{ReflectStates}(\operatorname{TypePath}(p))\ =\ \operatorname{ReflectStates}(\operatorname{TypeApply}(p,\ [])) \\
\operatorname{ReflectStates}(\operatorname{TypeApply}(p,\ \mathsf{args}))\ =\ \operatorname{ReflectStates}(\operatorname{TypeSubst}(\theta ,\ \mathsf{ty}))\quad \mathsf{if}\ \operatorname{TypeAliasDecl}(p)\ =\ A\ \land \ \operatorname{AliasBody}(A)\ =\ \mathsf{ty}\ \land \ \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(A.\mathsf{generic}_{\mathsf{params}})\ \land \ \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{args})\ =\ \mathsf{args}'\ \land \ \theta \ =\ [\mathsf{args}'\_i\ /\ \mathsf{params}_{\mathsf{gen}}[i].\mathsf{name}] \\
\operatorname{ReflectStates}(\operatorname{TypeApply}(p,\ \mathsf{args}))\ =\ [\operatorname{StateInfoValue}(S_{i},\ [f\ \mid \ \operatorname{StateFieldDecl}(\_,\ \_,\ \_,\ f,\ \_,\ \_,\ \_)\ \in \ \mathsf{members}_{i}],\ [\operatorname{MethodName}(m)\ \mid \ m\ \in \ \mathsf{members}_{i}\ \land \ m\ =\ \operatorname{StateMethodDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)],\ [\operatorname{MethodName}(t)\ \mid \ t\ \in \ \mathsf{members}_{i}\ \land \ t\ =\ \operatorname{TransitionDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)],\ \mathsf{sp}_{i})\ \mid \ \operatorname{ModalDecl}(p)\ =\ M\ \land \ \mathsf{params}_{\mathsf{gen}}\ =\ \operatorname{TypeParamsOpt}(M.\mathsf{generic}_{\mathsf{params}})\ \land \ \operatorname{DefaultArgs}(\mathsf{params}_{\mathsf{gen}},\ \mathsf{args})\ =\ \mathsf{args}'\ \land \ \operatorname{States}(M)\ =\ [\operatorname{StateBlock}(S_{1},\ \mathsf{members}_{1},\ \mathsf{sp}_{1},\ \_),\ \ldots ,\ \operatorname{StateBlock}(S_{n},\ \mathsf{members}_{n},\ \mathsf{sp}_{n},\ \_)]\ \land \ 1\ \le \ i\ \le \ n]
\end{array}
```

```math
\begin{array}{l}
\operatorname{PayloadKind}(\bot )\ =\ \texttt{"unit"} \\
\operatorname{PayloadKind}(\operatorname{TuplePayload}(\_))\ =\ \texttt{"tuple"} \\
\operatorname{PayloadKind}(\operatorname{RecordPayload}(\_))\ =\ \texttt{"record"} \\
\operatorname{PayloadTypesOpt}(\bot )\ =\ [] \\
\operatorname{PayloadTypesOpt}(\operatorname{TuplePayload}(\mathsf{ts}))\ =\ \mathsf{ts} \\
\operatorname{PayloadTypesOpt}(\operatorname{RecordPayload}(\mathsf{fs}))\ =\ [T\ \mid \ \langle f,\ T\rangle \ \in \ \mathsf{fs}] \\
\operatorname{PayloadFieldNames}(\bot )\ =\ [] \\
\operatorname{PayloadFieldNames}(\operatorname{TuplePayload}(\_))\ =\ [] \\
\operatorname{PayloadFieldNames}(\operatorname{RecordPayload}(\mathsf{fs}))\ =\ [f\ \mid \ \langle f,\ \_\rangle \ \in \ \mathsf{fs}] \\
\operatorname{TypeModulePath}(\operatorname{TypePath}(p))\ =\ \mathsf{mp}\quad \mathsf{if}\ \operatorname{SplitLast}(p)\ =\ (\mathsf{mp},\ \_) \\
\operatorname{TypeModulePath}(T)\ =\ []\quad \mathsf{otherwise}
\end{array}
```

#### 22.3.4 Static Semantics

**(T-TypeLiteral)**

```math
\begin{array}{l}
\Gamma \ \vdash \ T\ \mathsf{wf} \\
\rule{18em}{0.4pt} \\
\Gamma_{\mathsf{ct}} \ \vdash \ \operatorname{TypeLiteralExpr}(T)\ :\ \operatorname{TypePath}([\texttt{"Type"}])
\end{array}
```

`introspect.category(ty)` is valid for any well-formed `Type` value.

```math
\begin{array}{l}
\texttt{introspect.fields(ty)}\ \mathsf{is}\ \mathsf{valid}\ \mathsf{only}\ \mathsf{when}\ \texttt{CategoryOf(ty) = Record}\ \mathsf{and}\ \texttt{Reflectable(ty)}. \\
\texttt{introspect.variants(ty)}\ \mathsf{is}\ \mathsf{valid}\ \mathsf{only}\ \mathsf{when}\ \texttt{CategoryOf(ty) = Enum}\ \mathsf{and}\ \texttt{Reflectable(ty)}. \\
\texttt{introspect.states(ty)}\ \mathsf{is}\ \mathsf{valid}\ \mathsf{only}\ \mathsf{when}\ \texttt{CategoryOf(ty) = Modal}\ \mathsf{and}\ \texttt{Reflectable(ty)}.
\end{array}
```

Reflection order is canonical:
- fields are returned in declaration order
- enum variants are returned in declaration order
- modal states are returned in declaration order

`introspect.implements_form(ty, form)` evaluates the same class-satisfaction judgment used by Phase 3 typing after substituting any monomorphized type arguments of `ty`.

#### 22.3.5 Dynamic Semantics

**(CtEval-TypeLiteral)**

```math
\begin{array}{l}
\Gamma \ \vdash \ T\ \mathsf{wf} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtEval}(\Xi ,\ \Phi ,\ \operatorname{TypeLiteralExpr}(T))\ \Downarrow \ (\operatorname{CtType}(T),\ \Xi ,\ \Phi )
\end{array}
```

**(CtBuiltin-Reflect-Category)**

```math
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{introspect}\quad \mathsf{name}\ =\ \texttt{category}\quad \mathsf{args}\ =\ [\operatorname{CtType}(T)] \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtEnum}([\texttt{TypeCategory}],\ \operatorname{CategoryOf}(T),\ \bot ),\ \Phi )
\end{array}
```

**(CtBuiltin-Reflect-Fields)**

```math
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{introspect}\quad \mathsf{name}\ =\ \texttt{fields}\quad \mathsf{args}\ =\ [\operatorname{CtType}(T)]\quad \operatorname{ReflectFields}(T)\ =\ \mathsf{infos} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtSlice}(\mathsf{infos}),\ \Phi )
\end{array}
```

**(CtBuiltin-Reflect-Variants)**

```math
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{introspect}\quad \mathsf{name}\ =\ \texttt{variants}\quad \mathsf{args}\ =\ [\operatorname{CtType}(T)]\quad \operatorname{ReflectVariants}(T)\ =\ \mathsf{infos} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtSlice}(\mathsf{infos}),\ \Phi )
\end{array}
```

**(CtBuiltin-Reflect-States)**

```math
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{introspect}\quad \mathsf{name}\ =\ \texttt{states}\quad \mathsf{args}\ =\ [\operatorname{CtType}(T)]\quad \operatorname{ReflectStates}(T)\ =\ \mathsf{infos} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtSlice}(\mathsf{infos}),\ \Phi )
\end{array}
```

**(CtBuiltin-Reflect-Form)**

```math
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{introspect}\quad \mathsf{name}\ =\ \texttt{implements\_form}\quad \mathsf{args}\ =\ [\operatorname{CtType}(T),\ \operatorname{CtType}(\mathsf{form})]\quad b\ =\ \mathsf{true}\ \mathsf{iff}\ \mathsf{the}\ \mathsf{ordinary}\ \mathsf{class}-\mathsf{satisfaction}\ \mathsf{judgment}\ \mathsf{holds}\ \mathsf{for}\ \texttt{T}\ \mathsf{against}\ \texttt{form} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtPrim}(b),\ \Phi )
\end{array}
```

**(CtBuiltin-Reflect-TypeName)**

```math
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{introspect}\quad \mathsf{name}\ =\ \texttt{type\_name}\quad \mathsf{args}\ =\ [\operatorname{CtType}(T)] \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtString}(\operatorname{TypeRender}(T)),\ \Phi )
\end{array}
```

**(CtBuiltin-Reflect-ModulePath)**

```math
\begin{array}{l}
\mathsf{owner}\ =\ \texttt{introspect}\quad \mathsf{name}\ =\ \texttt{module\_path}\quad \mathsf{args}\ =\ [\operatorname{CtType}(T)] \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtBuiltinCall}(\Xi ,\ \Phi ,\ \mathsf{owner},\ \mathsf{name},\ \mathsf{args})\ \Downarrow \ (\operatorname{CtString}(\operatorname{ModulePathText}(\operatorname{TypeModulePath}(T))),\ \Phi )
\end{array}
```

Reflection is pure Phase 2 evaluation. For one `CtMachine`, reflection results are immutable except for visibility of declarations emitted earlier in the same Phase 2 order.

#### 22.3.6 Lowering

Reflection contributes only to Phase 2 evaluation. Reified `Type` values and reflection result arrays do not survive into Phase 4 unless reified into emitted declarations or literalized constants.

#### 22.3.7 Diagnostics

Diagnostics for reflection are defined by §22.6.

### 22.4 Quote, Splice, and Emission

#### 22.4.1 Syntax

```text
quote_expr     ::= "quote" "{" quoted_content "}"
quote_type     ::= "quote" "type" "{" type "}"
quote_pattern  ::= "quote" "pattern" "{" pattern "}"
quoted_content ::= expression | statement | top_level_item
splice_expr    ::= "$(" expression ")"
splice_ident   ::= "$" identifier
```

#### 22.4.2 Parsing

```math
\mathsf{QuoteParseJudg}\ =\ \{\mathsf{ParseQuoteExpr},\ \mathsf{ParseQuoteType},\ \mathsf{ParseQuotePattern},\ \mathsf{CaptureQuotedTokens}\}
```

```math
\operatorname{CaptureQuotedTokens}(P)\ \Downarrow \ (P',\ \mathsf{ts})\ \mathsf{consumes}\ \mathsf{the}\ \mathsf{balanced}\ \mathsf{token}\ \mathsf{sequence}\ \mathsf{between}\ \mathsf{the}\ \mathsf{opening}\ \texttt{\{}\ \mathsf{at}\ \texttt{P}\ \mathsf{and}\ \mathsf{its}\ \mathsf{matching}\ \texttt{\}}\ \mathsf{and}\ \mathsf{preserves}\ \mathsf{nested}\ \mathsf{delimiter}\ \mathsf{structure}\ \mathsf{and}\ \mathsf{all}\ \mathsf{splice}\ \mathsf{markers}\ \mathsf{inside}\ \mathsf{that}\ \mathsf{slice}.
```

**(Parse-Quote-Raw)**

```math
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \operatorname{Lexeme}(\operatorname{Tok}(P))\ =\ \texttt{"quote"}\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"\{"})\quad \operatorname{CaptureQuotedTokens}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{ts}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (P_{1},\ \operatorname{QuoteNode}(\bot ,\ \operatorname{QuotedRaw}(\mathsf{ts}),\ \operatorname{SpanBetween}(P,\ P_{1})))
\end{array}
```

**(Parse-Quote-Type)**

```math
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \operatorname{Lexeme}(\operatorname{Tok}(P))\ =\ \texttt{"quote"}\quad \operatorname{IsKw}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{type})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))),\ \texttt{"\{"})\quad \operatorname{CaptureQuotedTokens}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ \mathsf{ts}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (P_{1},\ \operatorname{QuoteNode}(\texttt{Type},\ \operatorname{QuotedRaw}(\mathsf{ts}),\ \operatorname{SpanBetween}(P,\ P_{1})))
\end{array}
```

**(Parse-Quote-Pattern)**

```math
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \operatorname{Lexeme}(\operatorname{Tok}(P))\ =\ \texttt{"quote"}\quad \operatorname{FixedIdentTok}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{pattern})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))),\ \texttt{"\{"})\quad \operatorname{CaptureQuotedTokens}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ \mathsf{ts}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (P_{1},\ \operatorname{QuoteNode}(\texttt{Pattern},\ \operatorname{QuotedRaw}(\mathsf{ts}),\ \operatorname{SpanBetween}(P,\ P_{1})))
\end{array}
```

#### 22.4.3 AST Representation / Form

```math
\begin{array}{l}
\mathsf{AstKind}\ =\ \{\texttt{Expr},\ \texttt{Stmt},\ \texttt{Item},\ \texttt{Type},\ \texttt{Pattern}\} \\
\mathsf{Ast}\ =\ \{\operatorname{AstNode}(\mathsf{kind},\ \mathsf{payload},\ \mathsf{span},\ \mathsf{hygiene})\} \\
\operatorname{AstKindOf}(\operatorname{AstNode}(\mathsf{kind},\ \mathsf{payload},\ \mathsf{span},\ \mathsf{hygiene}))\ =\ \mathsf{kind} \\
\operatorname{AstPayloadOf}(\operatorname{AstNode}(\mathsf{kind},\ \mathsf{payload},\ \mathsf{span},\ \mathsf{hygiene}))\ =\ \mathsf{payload} \\
\operatorname{AstSpanOf}(\operatorname{AstNode}(\mathsf{kind},\ \mathsf{payload},\ \mathsf{span},\ \mathsf{hygiene}))\ =\ \mathsf{span} \\
\operatorname{AstHygieneOf}(\operatorname{AstNode}(\mathsf{kind},\ \mathsf{payload},\ \mathsf{span},\ \mathsf{hygiene}))\ =\ \mathsf{hygiene} \\
\operatorname{AstOf}(\mathsf{kind},\ \mathsf{payload})\ =\ \operatorname{AstNode}(\mathsf{kind},\ \mathsf{payload},\ \bot ,\ \bot )
\end{array}
```

QuoteNode(kind_opt, body, span)

```math
\begin{array}{l}
\mathsf{QuotedBody}\ =\ \operatorname{QuotedRaw}(\mathsf{tokens})\ \mid \ \operatorname{QuotedResolved}(\mathsf{kind},\ \mathsf{payload}) \\
\mathsf{SpliceNode}\ =\ \operatorname{SpliceExprNode}(\mathsf{expr},\ \mathsf{span})\ \mid \ \operatorname{SpliceIdentNode}(\mathsf{name}_{\mathsf{expr}},\ \mathsf{span}) \\
\mathsf{Hygiene}\ =\ \langle \mathsf{quote}_{\mathsf{site}},\ \mathsf{emit}_{\mathsf{site}},\ \mathsf{mark}\rangle 
\end{array}
```
`quote_site` is the lexical origin of the quoted fragment. `emit_site` is the insertion site at which the fragment becomes part of the expanded program. `HygienizeAst` is applied when a quoted `Ast` fragment is inserted into the expanded program.

```math
\mathsf{QuoteJudg}\ =\ \{\mathsf{ResolveQuoteKind},\ \mathsf{ParseQuotedBody},\ \mathsf{RenderSplice},\ \mathsf{QuoteBuild},\ \mathsf{HygienizeAst}\}
```

```math
\begin{array}{l}
\operatorname{ExpectedAstKind}(\operatorname{TypePath}([\texttt{Ast},\ \texttt{Expr}]))\ =\ \texttt{Expr} \\
\operatorname{ExpectedAstKind}(\operatorname{TypePath}([\texttt{Ast},\ \texttt{Stmt}]))\ =\ \texttt{Stmt} \\
\operatorname{ExpectedAstKind}(\operatorname{TypePath}([\texttt{Ast},\ \texttt{Item}]))\ =\ \texttt{Item} \\
\operatorname{ExpectedAstKind}(\operatorname{TypePath}([\texttt{Ast},\ \texttt{Type}]))\ =\ \texttt{Type} \\
\operatorname{ExpectedAstKind}(\operatorname{TypePath}([\texttt{Ast},\ \texttt{Pattern}]))\ =\ \texttt{Pattern} \\
\operatorname{ExpectedAstKind}(\operatorname{TypePath}([\texttt{Ast}]))\ =\ \bot 
\end{array}
```

```math
\begin{array}{l}
\operatorname{CtLiteralType}(\operatorname{TypePrim}(t))\ \Leftrightarrow \ t\ \in \ \mathsf{PrimitiveTypeName}\ \setminus \ \{\texttt{!}\} \\
\operatorname{CtLiteralType}(\operatorname{TypeString}(\mathsf{st}))\ \Leftrightarrow \ \mathsf{st}\ \in \ \{\texttt{@View},\ \texttt{@Managed}\} \\
\operatorname{CtLiteralType}(\operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}]))\ \Leftrightarrow \ \forall \ i.\ \operatorname{CtLiteralType}(T_{i}) \\
\operatorname{CtLiteralType}(\operatorname{TypeArray}(T,\ \_))\ \Leftrightarrow \ \operatorname{CtLiteralType}(T) \\
\operatorname{CtLiteralType}(\operatorname{TypePerm}(\_,\ T))\ \Leftrightarrow \ \operatorname{CtLiteralType}(T) \\
\operatorname{CtLiteralType}(\operatorname{TypeRefine}(T,\ \_))\ \Leftrightarrow \ \operatorname{CtLiteralType}(T) \\
\operatorname{CtLiteralType}(\operatorname{TypePath}(p))\ \Leftrightarrow \ \operatorname{RecordDecl}(p)\ =\ R\ \land \ \forall \ f\ \in \ \operatorname{Fields}(R).\ \operatorname{CtLiteralType}(\operatorname{FieldType}(f)) \\
\operatorname{CtLiteralType}(\operatorname{TypePath}(p))\ \Leftrightarrow \ \operatorname{EnumDecl}(p)\ =\ E\ \land \ \forall \ v\ \in \ \operatorname{Variants}(E).\ (\operatorname{Payload}(v)\ =\ \bot \ \lor \ (\operatorname{Payload}(v)\ =\ \operatorname{TuplePayload}([T_{1},\ \ldots ,\ T_{n}])\ \land \ \forall \ i.\ \operatorname{CtLiteralType}(T_{i}))\ \lor \ (\operatorname{Payload}(v)\ =\ \operatorname{RecordPayload}(\mathsf{fs})\ \land \ \forall \ f\ \in \ \mathsf{fs}.\ \operatorname{CtLiteralType}(\operatorname{FieldType}(f)))) \\
\operatorname{CtLiteralType}(\operatorname{TypeApply}(p,\ [T_{1},\ \ldots ,\ T_{n}]))\ \Leftrightarrow \ \operatorname{CtLiteralType}(\operatorname{TypePath}(p)<T_{1},\ \ldots ,\ T_{n}>)
\end{array}
```

```math
\begin{array}{l}
\operatorname{SpliceCompat}(\texttt{Expr},\ T)\ \Leftrightarrow \ T\ =\ \operatorname{TypePath}([\texttt{"Ast"}])\ \lor \ T\ =\ \operatorname{TypePath}([\texttt{"Ast"},\ \texttt{"Expr"}])\ \lor \ \operatorname{CtLiteralType}(T) \\
\operatorname{SpliceCompat}(\texttt{Stmt},\ T)\ \Leftrightarrow \ T\ =\ \operatorname{TypePath}([\texttt{"Ast"},\ \texttt{"Stmt"}])\ \lor \ T\ =\ \operatorname{TypePath}([\texttt{"Ast"},\ \texttt{"Expr"}]) \\
\operatorname{SpliceCompat}(\texttt{Item},\ T)\ \Leftrightarrow \ T\ =\ \operatorname{TypePath}([\texttt{"Ast"},\ \texttt{"Item"}]) \\
\operatorname{SpliceCompat}(\texttt{Type},\ T)\ \Leftrightarrow \ T\ =\ \operatorname{TypePath}([\texttt{"Ast"},\ \texttt{"Type"}])\ \lor \ T\ =\ \operatorname{TypePath}([\texttt{"Type"}]) \\
\operatorname{SpliceCompat}(\texttt{Pattern},\ T)\ \Leftrightarrow \ T\ =\ \operatorname{TypePath}([\texttt{"Ast"},\ \texttt{"Pattern"}]) \\
\operatorname{SpliceCompat}(\texttt{Identifier},\ T)\ \Leftrightarrow \ T\ =\ \operatorname{TypeString}(\texttt{@Managed})\ \lor \ T\ =\ \operatorname{TypeString}(\texttt{@View})
\end{array}
```

#### 22.4.4 Static Semantics

`quote { ... }`, `quote type { ... }`, and `quote pattern { ... }` are valid only in compile-time contexts.

```math
\begin{array}{l}
\operatorname{ResolveQuoteKind}(\operatorname{QuoteNode}(\mathsf{kind},\ \mathsf{body},\ \mathsf{span}),\ T_{\mathsf{exp}})\ =\ \mathsf{kind}\quad \mathsf{if}\ \mathsf{kind}\ \ne \ \bot  \\
\operatorname{ResolveQuoteKind}(\operatorname{QuoteNode}(\bot ,\ \mathsf{body},\ \mathsf{span}),\ T_{\mathsf{exp}})\ =\ \mathsf{kind}\quad \mathsf{if}\ \operatorname{ExpectedAstKind}(T_{\mathsf{exp}})\ =\ \mathsf{kind}\ \land \ \mathsf{kind}\ \ne \ \bot  \\
\operatorname{ResolveQuoteKind}(\operatorname{QuoteNode}(\bot ,\ \mathsf{body},\ \mathsf{span}),\ T_{\mathsf{exp}})\ =\ \mathsf{kind}\quad \mathsf{if}\ \operatorname{ExpectedAstKind}(T_{\mathsf{exp}})\ =\ \bot \ \land \ \texttt{kind}\ \mathsf{is}\ \mathsf{the}\ \mathsf{unique}\ \mathsf{member}\ \mathsf{of}\ \{\texttt{Expr},\ \texttt{Stmt},\ \texttt{Item}\}\ \mathsf{for}\ \mathsf{which}\ \texttt{ParseQuotedBody(kind, body)}\ \mathsf{succeeds}
\end{array}
```

Quoted content MUST be syntactically valid in the resolved category. If `ResolveQuoteKind` is undefined, the quote is ill-formed.

`$(e)` and `$ident` are valid only inside a quoted token slice. The compile-time type of the splice source MUST satisfy `SpliceCompat` for the surrounding quoted position.

```math
\texttt{\$ident}\ \mathsf{is}\ \mathsf{an}\ \mathsf{identifier}-\mathsf{position}\ \mathsf{splice}\ \mathsf{only}.\ \texttt{SpliceIdentNode}\ \mathsf{MAY}\ \mathsf{occur}\ \mathsf{only}\ \mathsf{in}\ \mathsf{identifier}\ \mathsf{expressions},\ \mathsf{identifier}-\mathsf{pattern}\ \mathsf{bindings},\ \mathsf{typed}-\mathsf{pattern}\ \mathsf{bindings},\ \texttt{using ... as}\ \mathsf{alias}\ \mathsf{names},\ \texttt{region as}\ \mathsf{aliases},\ \mathsf{and}\ \mathsf{procedure}\ \mathsf{or}\ \mathsf{method}\ \mathsf{parameter}\ \mathsf{bindings}.\ \texttt{SpliceIdentNode}\ \mathsf{MUST}\ \mathsf{NOT}\ \mathsf{occur}\ \mathsf{in}\ \mathsf{structural}\ \mathsf{identifier}\ \mathsf{positions},\ \mathsf{including}\ \mathsf{module}\ \mathsf{or}\ \mathsf{type}\ \mathsf{path}\ \mathsf{segments},\ \mathsf{field}\ \mathsf{labels},\ \mathsf{variant}\ \mathsf{names},\ \mathsf{type}-\mathsf{parameter}\ \mathsf{names},\ \mathsf{item}\ \mathsf{declaration}\ \mathsf{names},\ \mathsf{or}\ \mathsf{modal}\ \mathsf{state}\ \mathsf{names}.\ \mathsf{In}\ \mathsf{every}\ \mathsf{other}\ \mathsf{quoted}\ \mathsf{position},\ \mathsf{including}\ \mathsf{quoted}\ \mathsf{type}\ \mathsf{position},\ \mathsf{splicing}\ \mathsf{MUST}\ \mathsf{use}\ \texttt{\$(e)}.\ \mathsf{Ordinary}\ \mathsf{language}\ \mathsf{syntax}\ \mathsf{retains}\ \mathsf{precedence}\ \mathsf{where}\ \mathsf{it}\ \mathsf{already}\ \mathsf{uses}\ \texttt{\$};\ \mathsf{for}\ \mathsf{example},\ \mathsf{in}\ \texttt{quote type \{ \$FileSystem \}},\ \texttt{\$FileSystem}\ \mathsf{is}\ \mathsf{parsed}\ \mathsf{as}\ \texttt{TypeDynamic(["FileSystem"])},\ \mathsf{not}\ \mathsf{as}\ a\ \mathsf{splice}.
```

If a string-valued splice occupies identifier position, the resulting identifier is intentionally unhygienic and binds in the emission environment.

```math
\texttt{emitter\~{}>emit(ast)}\ \mathsf{is}\ \mathsf{well}-\mathsf{formed}\ \mathsf{only}\ \mathsf{when}\ \texttt{emitter}\ \mathsf{has}\ \mathsf{compile}-\mathsf{time}\ \mathsf{type}\ \texttt{TypeEmitter}\ \mathsf{and}\ \texttt{ast}\ \mathsf{has}\ \mathsf{compile}-\mathsf{time}\ \mathsf{type}\ \texttt{Ast::Item}\ \mathsf{or}\ \texttt{Ast}.
```

#### 22.4.5 Dynamic Semantics

```math
\begin{array}{l}
\operatorname{ParseQuotedBody}(\texttt{Expr},\ \operatorname{QuotedRaw}(\mathsf{ts}))\ \Downarrow \ \mathsf{payload}\ \mathsf{iff}\ \mathsf{the}\ \mathsf{ordinary}\ \mathsf{expression}\ \mathsf{parser},\ \mathsf{extended}\ \mathsf{with}\ \texttt{SpliceExprNode}\ \mathsf{and}\ \texttt{SpliceIdentNode},\ \mathsf{parses}\ \texttt{ts}\ \mathsf{as}\ \mathsf{exactly}\ \mathsf{one}\ \mathsf{expression}. \\
\operatorname{ParseQuotedBody}(\texttt{Stmt},\ \operatorname{QuotedRaw}(\mathsf{ts}))\ \Downarrow \ \mathsf{payload}\ \mathsf{iff}\ \mathsf{the}\ \mathsf{ordinary}\ \mathsf{statement}\ \mathsf{parser},\ \mathsf{extended}\ \mathsf{with}\ \texttt{SpliceExprNode}\ \mathsf{and}\ \texttt{SpliceIdentNode},\ \mathsf{parses}\ \texttt{ts}\ \mathsf{as}\ \mathsf{exactly}\ \mathsf{one}\ \mathsf{statement}. \\
\operatorname{ParseQuotedBody}(\texttt{Item},\ \operatorname{QuotedRaw}(\mathsf{ts}))\ \Downarrow \ \mathsf{payload}\ \mathsf{iff}\ \mathsf{the}\ \mathsf{ordinary}\ \mathsf{item}\ \mathsf{parser},\ \mathsf{extended}\ \mathsf{with}\ \texttt{SpliceExprNode}\ \mathsf{and}\ \texttt{SpliceIdentNode},\ \mathsf{parses}\ \texttt{ts}\ \mathsf{as}\ \mathsf{exactly}\ \mathsf{one}\ \mathsf{top}-\mathsf{level}\ \mathsf{item}. \\
\operatorname{ParseQuotedBody}(\texttt{Type},\ \operatorname{QuotedRaw}(\mathsf{ts}))\ \Downarrow \ \mathsf{payload}\ \mathsf{iff}\ \mathsf{the}\ \mathsf{ordinary}\ \mathsf{type}\ \mathsf{parser},\ \mathsf{extended}\ \mathsf{with}\ \texttt{SpliceExprNode}\ \mathsf{and}\ \texttt{SpliceIdentNode},\ \mathsf{parses}\ \texttt{ts}\ \mathsf{as}\ \mathsf{exactly}\ \mathsf{one}\ \mathsf{type}. \\
\operatorname{ParseQuotedBody}(\texttt{Pattern},\ \operatorname{QuotedRaw}(\mathsf{ts}))\ \Downarrow \ \mathsf{payload}\ \mathsf{iff}\ \mathsf{the}\ \mathsf{ordinary}\ \mathsf{pattern}\ \mathsf{parser},\ \mathsf{extended}\ \mathsf{with}\ \texttt{SpliceExprNode}\ \mathsf{and}\ \texttt{SpliceIdentNode},\ \mathsf{parses}\ \texttt{ts}\ \mathsf{as}\ \mathsf{exactly}\ \mathsf{one}\ \mathsf{pattern}.
\end{array}
```

```math
\begin{array}{l}
\operatorname{RenderSplice}(\texttt{Expr},\ \mathsf{cv})\ \Downarrow \ \mathsf{payload}\quad \mathsf{iff}\ (\mathsf{cv}\ =\ \operatorname{CtAst}(a)\ \land \ \operatorname{AstKindOf}(a)\ =\ \texttt{Expr}\ \land \ \mathsf{payload}\ =\ \operatorname{AstPayloadOf}(a))\ \lor \ (\mathsf{cv}\ \ne \ \operatorname{CtAst}(\_)\ \land \ \Gamma \ \vdash \ \operatorname{CtLiteralize}(\mathsf{cv})\ \Downarrow \ \mathsf{payload}) \\
\operatorname{RenderSplice}(\texttt{Stmt},\ \mathsf{cv})\ \Downarrow \ \mathsf{payload}\quad \mathsf{iff}\ \mathsf{cv}\ =\ \operatorname{CtAst}(a)\ \land \ \operatorname{AstKindOf}(a)\ \in \ \{\texttt{Stmt},\ \texttt{Expr}\}\ \land \ \mathsf{payload}\ =\ \operatorname{AstPayloadOf}(a) \\
\operatorname{RenderSplice}(\texttt{Item},\ \mathsf{cv})\ \Downarrow \ \mathsf{payload}\quad \mathsf{iff}\ \mathsf{cv}\ =\ \operatorname{CtAst}(a)\ \land \ \operatorname{AstKindOf}(a)\ =\ \texttt{Item}\ \land \ \mathsf{payload}\ =\ \operatorname{AstPayloadOf}(a) \\
\operatorname{RenderSplice}(\texttt{Type},\ \mathsf{cv})\ \Downarrow \ \mathsf{payload}\quad \mathsf{iff}\ (\mathsf{cv}\ =\ \operatorname{CtAst}(a)\ \land \ \operatorname{AstKindOf}(a)\ =\ \texttt{Type}\ \land \ \mathsf{payload}\ =\ \operatorname{AstPayloadOf}(a))\ \lor \ (\mathsf{cv}\ =\ \operatorname{CtType}(T)\ \land \ \mathsf{payload}\ =\ T) \\
\operatorname{RenderSplice}(\texttt{Pattern},\ \mathsf{cv})\ \Downarrow \ \mathsf{payload}\ \mathsf{iff}\ \mathsf{cv}\ =\ \operatorname{CtAst}(a)\ \land \ \operatorname{AstKindOf}(a)\ =\ \texttt{Pattern}\ \land \ \mathsf{payload}\ =\ \operatorname{AstPayloadOf}(a) \\
\operatorname{RenderSplice}(\texttt{Identifier},\ \mathsf{cv})\ \Downarrow \ \mathsf{payload}\ \mathsf{iff}\ \mathsf{cv}\ =\ \operatorname{CtString}(\mathsf{name})\ \land \ \mathsf{payload}\ =\ \operatorname{Identifier}(\mathsf{name})
\end{array}
```

```math
\operatorname{HygienizeAst}(a,\ \mathsf{quote}_{\mathsf{site}},\ \mathsf{emit}_{\mathsf{site}},\ n)\ \Downarrow \ (a',\ n')\ \mathsf{MUST}\ \mathsf{satisfy}\ \mathsf{all}\ \mathsf{of}\ \mathsf{the}\ \mathsf{following}:
```
1. Any capture from the quote site resolves to the same binding after emission.
2. Any binder introduced by hygienic quoted content, including top-level declaration names in quoted item fragments, MUST NOT capture names from the emission site unless the splice was string-valued in identifier position.
3. Fresh hygienic marks are deterministic functions of `quote_site`, `emit_site`, and the input counter `n`.

If a reference inside the quoted fragment resolves to a hygienic binder introduced by that same fragment before emission, it MUST resolve to the renamed binding after emission.

For `using` and `import`, only explicit alias names are hygienic binders. Unaliased imported names are preserved as written.

**(CtEval-Quote)**

```math
\begin{array}{l}
q\ =\ \operatorname{QuoteNode}(\mathsf{kind}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span})\quad T_{q}\ =\ \operatorname{ExprType}(q)\quad \operatorname{ResolveQuoteKind}(q,\ T_{q})\ =\ \mathsf{kind}\quad \operatorname{ParseQuotedBody}(\mathsf{kind},\ \mathsf{body})\ \Downarrow \ \mathsf{payload}_{0}\quad \Gamma \ \vdash \ \operatorname{QuoteBuild}(\Xi ,\ \Phi ,\ \mathsf{kind},\ \mathsf{payload}_{0})\ \Downarrow \ (\mathsf{payload}_{1},\ \Phi_{1} )\quad a\ =\ \operatorname{AstNode}(\mathsf{kind},\ \mathsf{payload}_{1},\ \mathsf{span},\ \langle \operatorname{CtSiteOf}(\Xi ),\ \operatorname{CtSiteOf}(\Xi ),\ 0\rangle ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtEval}(\Xi ,\ \Phi ,\ q)\ \Downarrow \ (\operatorname{CtAst}(a),\ \Xi ,\ \Phi_{1} )
\end{array}
```

`QuoteBuild` evaluates splice expressions in left-to-right source order. Each splice value is rendered by `RenderSplice`, substituted into the quoted payload, and the resulting fragment becomes the payload of the returned `Ast`.


Emission order is:
1. derive-generated emissions required by §22.5 for the current declaration
2. explicit `TypeEmitter.emit` calls in source order

#### 22.4.6 Lowering

Quoted and spliced AST fragments affect lowering only through the declarations and expressions present after Phase 2 expansion. No runtime representation of `Ast` survives unless explicitly embedded by emitted declarations.

#### 22.4.7 Diagnostics

Diagnostics for quote, splice, and emission are defined by §22.6.

### 22.5 Derive Targets and Contracts

#### 22.5.1 Syntax

```text
derive_attribute    ::= "[[" "derive" "(" derive_target_list ")" "]]"
derive_target_list  ::= identifier ("," identifier)*
derive_target_decl  ::= "derive" "target" identifier "(" "target" ":" "Type" ")" derive_contract_opt block_expr
derive_contract_opt ::= "|:" derive_clause ("," derive_clause)*
derive_clause       ::= "emits" identifier | "requires" identifier
```

#### 22.5.2 Parsing

```math
\mathsf{DeriveParseJudg}\ =\ \{\mathsf{ParseDeriveAttr},\ \mathsf{ParseDeriveTargetList},\ \mathsf{ParseDeriveTargetDecl},\ \mathsf{ParseDeriveContractOpt},\ \mathsf{ParseDeriveClauseList},\ \mathsf{ParseDeriveClauseTail}\}
```

```math
\texttt{[[derive(... )]]}\ \mathsf{is}\ \mathsf{parsed}\ \mathsf{by}\ \mathsf{the}\ \mathsf{attribute}\ \mathsf{parser}\ \mathsf{in}\ \S 9.1.2;\ \mathsf{the}\ \texttt{derive}\ \mathsf{attribute}\ \mathsf{name}\ \mathsf{and}\ \mathsf{its}\ \mathsf{argument}\ \mathsf{list}\ \mathsf{are}\ \mathsf{interpreted}\ \mathsf{by}\ \mathsf{this}\ \mathsf{section}.
```

**(Parse-DeriveTargetDecl)**

```math
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \operatorname{Lexeme}(\operatorname{Tok}(P))\ =\ \texttt{"derive"}\quad \operatorname{FixedIdentTok}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{target})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ \mathsf{name})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"("})\quad \operatorname{FixedIdentTok}(\operatorname{Tok}(\operatorname{Advance}(P_{1})),\ \texttt{target})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P_{1}))),\ \texttt{":"})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P_{1})))))\quad \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P_{1})))))\ =\ \texttt{"Type"}\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P_{1}))))),\ \texttt{")"})\quad \Gamma \ \vdash \ \operatorname{ParseDeriveContractOpt}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P_{1}))))))\ \Downarrow \ (P_{2},\ \mathsf{contract}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{body}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseItem}(P)\ \Downarrow \ (P_{3},\ \operatorname{DeriveTargetDecl}(\mathsf{name},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \operatorname{SpanBetween}(P,\ P_{3}),\ []))
\end{array}
```

**(Parse-DeriveContractOpt-None)**

```math
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|:"}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseDeriveContractOpt}(P)\ \Downarrow \ (P,\ [])
\end{array}
```

**(Parse-DeriveContractOpt-Yes)**

```math
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|:"})\quad \Gamma \ \vdash \ \operatorname{ParseDeriveClauseList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{clauses}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseDeriveContractOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{clauses})
\end{array}
```

**(Parse-DeriveClauseList-Cons)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseDeriveClause}(P)\ \Downarrow \ (P_{1},\ \mathsf{clause})\quad \Gamma \ \vdash \ \operatorname{ParseDeriveClauseTail}(P_{1},\ [\mathsf{clause}])\ \Downarrow \ (P_{2},\ \mathsf{clauses}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseDeriveClauseList}(P)\ \Downarrow \ (P_{2},\ \mathsf{clauses})
\end{array}
```

**(Parse-DeriveClause-Requires)**

```math
\begin{array}{l}
\operatorname{FixedIdentTok}(\operatorname{Tok}(P),\ \texttt{requires})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{name}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseDeriveClause}(P)\ \Downarrow \ (P_{1},\ \langle \texttt{requires},\ \mathsf{name}\rangle )
\end{array}
```

**(Parse-DeriveClause-Emits)**

```math
\begin{array}{l}
\operatorname{FixedIdentTok}(\operatorname{Tok}(P),\ \texttt{emits})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{name}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseDeriveClause}(P)\ \Downarrow \ (P_{1},\ \langle \texttt{emits},\ \mathsf{name}\rangle )
\end{array}
```

**(Parse-DeriveClauseTail-End)**

```math
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseDeriveClauseTail}(P,\ \mathsf{xs})\ \Downarrow \ (P,\ \mathsf{xs})
\end{array}
```

**(Parse-DeriveClauseTail-Comma)**

```math
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParseDeriveClause}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{clause})\quad \Gamma \ \vdash \ \operatorname{ParseDeriveClauseTail}(P_{1},\ \mathsf{xs}\ \mathbin{++} \ [\mathsf{clause}])\ \Downarrow \ (P_{2},\ \mathsf{ys}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ParseDeriveClauseTail}(P,\ \mathsf{xs})\ \Downarrow \ (P_{2},\ \mathsf{ys})
\end{array}
```

#### 22.5.3 AST Representation / Form

DeriveTargetDecl(name, contract_opt, body, span, doc)

```math
\begin{array}{l}
\operatorname{DeriveReqs}(\mathsf{dt})\ =\ \{\ C\ \mid \ \texttt{requires}\ C\ \in \ \operatorname{contract_opt}(\mathsf{dt})\ \} \\
\operatorname{DeriveEmits}(\mathsf{dt})\ =\ \{\ C\ \mid \ \texttt{emits}\ C\ \in \ \operatorname{contract_opt}(\mathsf{dt})\ \}
\end{array}
```

```math
\begin{array}{l}
\operatorname{DeriveRequest}(\mathsf{ty}_{\mathsf{decl}},\ \mathsf{name})\ \mathsf{exists}\ \mathsf{when}\ \texttt{[[derive(name)]]}\ \mathsf{is}\ \mathsf{attached}\ \mathsf{to}\ \texttt{ty\_decl}. \\
\operatorname{DeriveAnnotated}(D)\ \Leftrightarrow \ \exists \ \mathsf{name}.\ \operatorname{DeriveRequest}(D,\ \mathsf{name}) \\
\mathsf{DeriveExecJudg}\ =\ \{\mathsf{DeriveGraph},\ \mathsf{DeriveOrder},\ \mathsf{RunDeriveTarget},\ \mathsf{RunDeriveSet}\} \\
\operatorname{DeriveEdge}(\mathsf{req}_{i},\ \mathsf{req}_{j})\ \Leftrightarrow \ \operatorname{DeriveReqs}(\mathsf{req}_{i}.\mathsf{target})\ \cap \ \operatorname{DeriveEmits}(\mathsf{req}_{j}.\mathsf{target})\ \ne \ \emptyset  \\
\operatorname{DeriveGraph}(D)\ =\ \langle V,\ E\rangle \ \mathsf{where}\ V\ =\ [\mathsf{req}\ \mid \ \mathsf{req}\ =\ \operatorname{DeriveRequest}(D,\ \mathsf{name})]\ \mathsf{and}\ E\ =\ \{\langle v_{i},\ v_{j}\rangle \ \mid \ \operatorname{DeriveEdge}(v_{i},\ v_{j})\} \\
\operatorname{DeriveOrder}(D)\ =\ \mathsf{order}\ \mathsf{iff}\ \operatorname{StableTopologicalOrder}(\operatorname{DeriveGraph}(D),\ [\mathsf{name}\ \mid \ \texttt{[[derive(name)]]}\ \mathsf{occurs}\ \mathsf{on}\ \texttt{D}\ \mathsf{in}\ \mathsf{source}\ \mathsf{order}])\ =\ \mathsf{order} \\
\operatorname{StableTopologicalOrder}(\langle V,\ E\rangle ,\ \mathsf{seed})\ =\ \mathsf{order}\ \mathsf{iff}\ \texttt{order}\ \mathsf{is}\ a\ \mathsf{topological}\ \mathsf{ordering}\ \mathsf{of}\ \texttt{<V, E>}\ \mathsf{and}\ \mathsf{any}\ \mathsf{two}\ \mathsf{incomparable}\ \mathsf{vertices}\ \mathsf{preserve}\ \mathsf{their}\ \mathsf{relative}\ \mathsf{order}\ \mathsf{from}\ \texttt{seed}. \\
\operatorname{TargetTypeOf}(D)\ =\ \operatorname{TypePath}(\operatorname{ItemPath}(D)) \\
\operatorname{VisibleDeriveTarget}(\mathsf{name},\ \mathsf{site})\ =\ \mathsf{dt}\ \mathsf{iff}\ \texttt{dt}\ \mathsf{is}\ \mathsf{the}\ \mathsf{unique}\ \mathsf{visible}\ \texttt{DeriveTargetDecl(name, \_, \_, \_, \_)}\ \mathsf{at}\ \texttt{site}\ \mathsf{under}\ \mathsf{the}\ \mathsf{ordinary}\ \mathsf{item}-\mathsf{visibility}\ \mathsf{rules}. \\
\operatorname{DeclaredImplNames}(D)\ =\ \{\ \mathsf{name}\ \mid \ \exists \ \mathsf{prefix}.\ \mathsf{prefix}\ \mathbin{++} \ [\mathsf{name}]\ \in \ \operatorname{Implements}(D)\ \}
\end{array}
```

#### 22.5.4 Static Semantics

```math
\texttt{[[derive(... )]]}\ \mathsf{is}\ \mathsf{valid}\ \mathsf{only}\ \mathsf{on}\ \texttt{record},\ \texttt{enum},\ \mathsf{and}\ \texttt{modal}\ \mathsf{declarations}.
```

```math
\mathsf{Every}\ \mathsf{derive}\ \mathsf{target}\ \mathsf{name}\ \mathsf{in}\ \texttt{[[derive(... )]]}\ \mathsf{MUST}\ \mathsf{resolve}\ \mathsf{to}\ \mathsf{exactly}\ \mathsf{one}\ \texttt{derive target}\ \mathsf{declaration}\ \mathsf{visible}\ \mathsf{at}\ \mathsf{the}\ \mathsf{annotated}\ \mathsf{declaration}.
```

Within the body of a derive target declaration, the following bindings are available:
- `target : Type`
- `emitter : TypeEmitter`
- `introspect : Introspect`
- `diagnostics : ComptimeDiagnostics`

The body of a derive target declaration executes under the same restrictions as any other compile-time procedure body.

For one annotated type declaration `D`, derive execution order is the topological order of the graph:
- vertices: all `DeriveRequest(D, name)`
- edge `name_i -> name_j` when `DeriveReqs(name_i) ∩ DeriveEmits(name_j) ≠ ∅`

```math
\mathsf{If}\ \mathsf{multiple}\ \mathsf{derive}\ \mathsf{targets}\ \mathsf{are}\ \mathsf{incomparable}\ \mathsf{in}\ \mathsf{that}\ \mathsf{graph},\ \mathsf{source}\ \mathsf{order}\ \mathsf{in}\ \texttt{[[derive(... )]]}\ \mathsf{is}\ \mathsf{the}\ \mathsf{tie}-\mathsf{breaker}.
```

Before executing derive target `name` for type `D`, every class in `DeriveReqs(name)` MUST belong to `DeclaredImplNames(D)`.

Before executing derive target `name` for type `D`, every class in `DeriveEmits(name)` MUST belong to `DeclaredImplNames(D)`.

`requires` and `emits` participate only in derive ordering and validation against the annotated declaration's explicit `implements` list. They do not add or remove class implementations for `D`.

#### 22.5.5 Dynamic Semantics

`DeriveTargetDecl` is a compile-time-only item. It is visible to later derive lookup in the same Phase 2 module order and MUST NOT survive into the expanded Phase 3 module set.

**(CtExpandItem-DeriveTargetDecl)**

```math
\begin{array}{l}
\mathsf{dt}\ =\ \operatorname{DeriveTargetDecl}(\_,\ \_,\ \_,\ \_,\ \_) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtExpandItem}(\Xi ,\ \Phi ,\ \mathsf{dt})\ \Downarrow \ (\langle [],\ []\rangle ,\ \Xi ,\ \Phi )
\end{array}
```

**(RunDeriveSet-Empty)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{RunDeriveSet}(D,\ [],\ \Xi ,\ \Phi )\ \Downarrow \ ([],\ \Xi ,\ \Phi )
\end{array}
```

**(RunDeriveSet-Cons)**

```math
\begin{array}{l}
\operatorname{VisibleDeriveTarget}(\mathsf{name},\ \operatorname{CtSiteOf}(\Xi ))\ =\ \mathsf{dt}\quad \Gamma \ \vdash \ \operatorname{RunDeriveTarget}(D,\ \mathsf{dt},\ \Xi ,\ \Phi_{0} )\ \Downarrow \ (\mathsf{items}_{0},\ \Xi_{1} ,\ \Phi_{1} )\quad \Gamma \ \vdash \ \operatorname{RunDeriveSet}(D,\ \mathsf{rest},\ \Xi_{1} ,\ \Phi_{1} )\ \Downarrow \ (\mathsf{items}_{1},\ \Xi_{2} ,\ \Phi_{2} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{RunDeriveSet}(D,\ [\mathsf{name}]\ \mathbin{++} \ \mathsf{rest},\ \Xi ,\ \Phi_{0} )\ \Downarrow \ (\mathsf{items}_{0}\ \mathbin{++} \ \mathsf{items}_{1},\ \Xi_{2} ,\ \Phi_{2} )
\end{array}
```

**(RunDeriveTarget)**

```math
\begin{array}{l}
\mathsf{dt}\ =\ \operatorname{DeriveTargetDecl}(\mathsf{name},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span},\ \mathsf{doc})\quad \Xi_{0} \ =\ \operatorname{BindDeriveTargetInputs}(\Xi ,\ D)\quad \Gamma \ \vdash \ \operatorname{CtExec}(\Xi_{0} ,\ \Phi_{0} ,\ \mathsf{body})\ \Downarrow \ (\Xi_{1} ,\ \Phi_{1} )\quad \mathsf{items}\ =\ \operatorname{CtPendingEmits}(\Phi_{1} )\quad \Phi_{2} \ =\ \langle \operatorname{CtFiles}(\Phi_{1} ),\ \operatorname{CtProjectRoot}(\Phi_{1} ),\ \operatorname{CtDiags}(\Phi_{1} ),\ [],\ \operatorname{CtFreshSeed}(\Phi_{1} )\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{RunDeriveTarget}(D,\ \mathsf{dt},\ \Xi ,\ \Phi_{0} )\ \Downarrow \ (\mathsf{items},\ \Xi_{1} ,\ \Phi_{2} )
\end{array}
```

```math
\operatorname{BindDeriveTargetInputs}(\Xi ,\ D)\ =\ \Xi '\ \mathsf{iff}\ \texttt{Xi'}\ \mathsf{extends}\ \texttt{Xi}\ \mathsf{with}\ \mathsf{the}\ \mathsf{fixed}\ \mathsf{compile}-\mathsf{time}\ \mathsf{bindings}\ \mathsf{required}\ \mathsf{by}\ \S 22.5.4\ \mathsf{for}\ \mathsf{one}\ \mathsf{derive}-\mathsf{target}\ \mathsf{execution}\ \mathsf{over}\ \texttt{D}:\ \texttt{target = CtType(TargetTypeOf(D))},\ \mathsf{plus}\ \mathsf{the}\ \texttt{TypeEmitter},\ \texttt{Introspect},\ \mathsf{and}\ \texttt{ComptimeDiagnostics}\ \mathsf{capability}\ \mathsf{bindings}\ \mathsf{visible}\ \mathsf{in}\ \mathsf{derive}-\mathsf{target}\ \mathsf{bodies}.
```

**(CtExpandItem-DeriveAnnotatedDecl)**

```math
\begin{array}{l}
\operatorname{DeriveAnnotated}(D)\quad \operatorname{DeriveOrder}(D)\ =\ [\mathsf{name}_{1},\ \ldots ,\ \mathsf{name}_{n}]\quad \Gamma \ \vdash \ \operatorname{RunDeriveSet}(D,\ [\mathsf{name}_{1},\ \ldots ,\ \mathsf{name}_{n}],\ \Xi ,\ \Phi_{0} )\ \Downarrow \ (\mathsf{emits},\ \Xi_{1} ,\ \Phi_{1} ) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CtExpandItem}(\Xi ,\ \Phi_{0} ,\ D)\ \Downarrow \ (\langle [D],\ \mathsf{emits}\rangle ,\ \Xi_{1} ,\ \Phi_{1} )
\end{array}
```

Each derive target executes exactly once per annotated declaration, immediately after the annotated declaration has been introduced and before any later source item in the same module is executed.

If a derive target signals `diagnostics.error`, panics, or emits ill-formed declarations, Phase 2 fails and compilation is rejected.

#### 22.5.6 Lowering

Derive targets introduce no runtime dispatch or metadata. Their only lowering consequence is the presence of the declarations emitted during Phase 2.

#### 22.5.7 Diagnostics

Diagnostics for derive targets and derive contracts are defined by §22.6.

### 22.6 Compile-Time Diagnostics Supplement

This section owns compile-time execution, reflection, quoting, emission, file-access, and derive diagnostics.

| Code         | Severity | Detection    | Condition                                                      |
| ------------ | -------- | ------------ | -------------------------------------------------------------- |
| `E-CTE-0010` | Error    | Compile-time | Non-comptime-available type in compile-time context            |
| `E-CTE-0011` | Error    | Compile-time | Pointer or provenance-bearing type in compile-time context     |
| `E-CTE-0012` | Error    | Compile-time | Capability-bearing type in compile-time context                |
| `E-CTE-0020` | Error    | Compile-time | Compile-time block contains prohibited runtime construct       |
| `E-CTE-0021` | Error    | Compile-time | Compile-time expression has non-comptime-available type        |
| `E-CTE-0022` | Error    | Compile-time | Compile-time evaluation did not terminate                      |
| `E-CTE-0023` | Error    | Compile-time | Compile-time evaluation panicked                               |
| `E-CTE-0030` | Error    | Compile-time | Compile-time procedure parameter type not comptime-available   |
| `E-CTE-0031` | Error    | Compile-time | Compile-time procedure return type not comptime-available      |
| `E-CTE-0032` | Error    | Compile-time | Compile-time procedure body violates compile-time restrictions |
| `E-CTE-0033` | Error    | Compile-time | Compile-time procedure contract predicate evaluates to false   |
| `E-CTE-0034` | Error    | Compile-time | Compile-time procedure referenced from runtime context         |
| `E-CTE-0040` | Error    | Compile-time | Emit operation without `TypeEmitter` capability                |
| `E-CTE-0041` | Error    | Compile-time | `[[emit]]` applied to non-compile-time form                    |
| `E-CTE-0042` | Error    | Compile-time | Emitted AST is ill-formed                                      |
| `E-CTE-0050` | Error    | Compile-time | Reflection `fields` applied to non-record type                 |
| `E-CTE-0051` | Error    | Compile-time | Reflection `variants` applied to non-enum type                 |
| `E-CTE-0052` | Error    | Compile-time | Reflection `states` applied to non-modal type                  |
| `E-CTE-0053` | Error    | Compile-time | Reflection requires incomplete or non-reflectable declaration  |
| `E-CTE-0060` | Error    | Compile-time | File operation without `ProjectFiles` capability               |
| `E-CTE-0061` | Error    | Compile-time | `[[files]]` applied to non-compile-time form                   |
| `E-CTE-0062` | Error    | Compile-time | Compile-time file path escapes project root                    |
| `E-CTE-0063` | Error    | Compile-time | Absolute path used in compile-time file operation              |
| `E-CTE-0064` | Error    | Compile-time | Compile-time file path not found                               |
| `E-CTE-0070` | Error    | Compile-time | Compile-time error emitted by user code                        |
| `W-CTE-0071` | Warning  | Compile-time | Compile-time warning emitted by user code                      |
| `E-CTE-0080` | Error    | Compile-time | `comptime if` condition not compile-time evaluable             |
| `E-CTE-0081` | Error    | Compile-time | `comptime if` condition does not have type `bool`              |
| `E-CTE-0082` | Error    | Compile-time | `comptime loop` source not compile-time evaluable              |
| `E-CTE-0083` | Error    | Compile-time | `comptime loop` source is not a finite iterable                |
| `E-CTE-0210` | Error    | Compile-time | `Ast` value used in runtime context                            |
| `E-CTE-0220` | Error    | Compile-time | Quoted content is syntactically invalid or category-ambiguous  |
| `E-CTE-0221` | Error    | Compile-time | Quote form outside compile-time context                        |
| `E-CTE-0230` | Error    | Compile-time | Splice type incompatible with quote context                    |
| `E-CTE-0231` | Error    | Compile-time | Splice expression not compile-time evaluable                   |
| `E-CTE-0232` | Error    | Compile-time | Invalid identifier string in splice                            |
| `E-CTE-0233` | Error    | Compile-time | Splice appears outside quote context                           |
| `E-CTE-0240` | Error    | Compile-time | Hygienic capture no longer resolves at emission site           |
| `E-CTE-0241` | Error    | Compile-time | Hygiene renaming collision after unhygienic splice             |
| `E-CTE-0250` | Error    | Compile-time | Emit call without `TypeEmitter` capability                     |
| `E-CTE-0251` | Error    | Compile-time | Emitted AST is not an item                                     |
| `E-CTE-0252` | Error    | Compile-time | Emitted AST fails well-formedness after insertion              |
| `E-CTE-0253` | Error    | Compile-time | Type error in emitted code                                     |
| `E-CTE-0310` | Error    | Compile-time | Unknown derive target name                                     |
| `E-CTE-0311` | Error    | Compile-time | `[[derive(... )]]` applied to non-type declaration             |
| `E-CTE-0312` | Error    | Compile-time | Duplicate derive target in one derive attribute                |
| `E-CTE-0320` | Error    | Compile-time | Derive target body violates compile-time restrictions          |
| `E-CTE-0321` | Error    | Compile-time | Derive contract references unknown class                       |
| `E-CTE-0322` | Error    | Compile-time | Derive target declaration has invalid signature                |
| `E-CTE-0330` | Error    | Compile-time | Required class not implemented by derive target subject        |
| `E-CTE-0331` | Error    | Compile-time | Emitted class not implemented by derive target subject         |
| `E-CTE-0340` | Error    | Compile-time | Cyclic derive dependency                                       |
| `E-CTE-0341` | Error    | Compile-time | Derive target execution panicked                               |
| `E-CTE-0410` | Error    | Compile-time | Ill-formed type in `Type::<...>`                               |
| `E-CTE-0411` | Error    | Compile-time | `Type::<...>` used in runtime context                          |
| `E-CTE-0420` | Error    | Compile-time | Reflection category query on incomplete declaration            |
| `E-CTE-0430` | Error    | Compile-time | Reflection `fields` query on non-record type                   |
| `E-CTE-0440` | Error    | Compile-time | Reflection `variants` query on non-enum type                   |
| `E-CTE-0450` | Error    | Compile-time | Reflection `states` query on non-modal type                    |
| `E-CTE-0470` | Error    | Compile-time | Reflection type-predicate query on incomplete declaration      |

```math
\begin{array}{l}
\texttt{diagnostics.error(msg)}\ \mathsf{MUST}\ \mathsf{append}\ \texttt{<}E-\mathsf{CTE}-0070\texttt{, Error, msg, sp>},\ \mathsf{where}\ \texttt{sp}\ \mathsf{is}\ \mathsf{the}\ \mathsf{current}\ \mathsf{compile}-\mathsf{time}\ \mathsf{site}\ \mathsf{span}. \\
\texttt{diagnostics.warning(msg)}\ \mathsf{MUST}\ \mathsf{append}\ \texttt{<}W-\mathsf{CTE}-0071\texttt{, Warning, msg, sp>},\ \mathsf{where}\ \texttt{sp}\ \mathsf{is}\ \mathsf{the}\ \mathsf{current}\ \mathsf{compile}-\mathsf{time}\ \mathsf{site}\ \mathsf{span}. \\
\texttt{diagnostics.note(msg)}\ \mathsf{MUST}\ \mathsf{append}\ \texttt{<bottom, Note, msg, sp>},\ \mathsf{where}\ \texttt{sp}\ \mathsf{is}\ \mathsf{the}\ \mathsf{current}\ \mathsf{compile}-\mathsf{time}\ \mathsf{site}\ \mathsf{span}.
\end{array}
```
