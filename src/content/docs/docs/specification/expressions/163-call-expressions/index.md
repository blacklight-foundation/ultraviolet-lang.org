---
title: "16.3 Call Expressions"
description: "16.3 Call Expressions from 16. Expressions of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "expressions"
specSection: "163-call-expressions"
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

## 16.3 Call Expressions

### 16.3.1 Syntax

```text
call_expr         ::= postfix_expr "(" argument_list? ")"
generic_call_expr ::= postfix_expr generic_args "(" argument_list? ")"
method_call_expr  ::= postfix_expr "~>" identifier "(" argument_list? ")"
argument_list     ::= argument ("," argument)*
argument          ::= ("move" | "copy")? expression
```

Qualified applications with parenthesized arguments parse before name resolution as `QualifiedApply(path, name, Paren(args))`.

### 16.3.2 Parsing

**(Postfix-Call)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseArgList}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{args})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{")"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PostfixStep}(P,\ e)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{Call}(e,\ \mathsf{args}))
\end{array}
$$

**(Postfix-Call-TypeArgs)**

$$
\begin{array}{l}
\operatorname{CallTypeArgsStart}(P)\quad \Gamma \ \vdash \ \operatorname{ParseGenericArgs}(P)\ \Downarrow \ (P_{1},\ \mathsf{targs})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseArgList}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{args})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{")"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PostfixStep}(P,\ e)\ \Downarrow \ (\operatorname{Advance}(P_{2}),\ \operatorname{CallTypeArgs}(e,\ \mathsf{targs},\ \mathsf{args}))
\end{array}
$$

**(Postfix-MethodCall)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"\~{}>"})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{name})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseArgList}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{args})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{")"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{PostfixStep}(P,\ e)\ \Downarrow \ (\operatorname{Advance}(P_{2}),\ \operatorname{MethodCall}(e,\ \mathsf{name},\ \mathsf{args}))
\end{array}
$$

**(Parse-Qualified-Apply-Paren)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseQualifiedHead}(P)\ \Downarrow \ (P_{1},\ \mathsf{path},\ \mathsf{name})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseArgList}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{args})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{")"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (\operatorname{Advance}(P_{2}),\ \operatorname{QualifiedApply}(\mathsf{path},\ \mathsf{name},\ \operatorname{Paren}(\mathsf{args})))
\end{array}
$$

**(Parse-ArgList-Empty)**, **(Parse-ArgList-Cons)**, **(Parse-Arg)**, **(Parse-ArgPassOpt-None)**, **(Parse-ArgPassOpt-Move)**, **(Parse-ArgPassOpt-Copy)**, **(Parse-ArgTail-End)**, **(Parse-ArgTail-TrailingComma)**, and **(Parse-ArgTail-Comma)** define argument-list parsing and pass-kind parsing.

### 16.3.3 AST Representation / Form

$$
\mathsf{Arg}\ =\ \langle \mathsf{pass},\ \mathsf{expr},\ \mathsf{span}\rangle \quad \mathsf{pass}\ \in \ \mathsf{ArgPassKind}
$$

$$
\mathsf{Expr}\ =\ \operatorname{Call}(\mathsf{callee},\ \mathsf{args})\ \mid \ \operatorname{CallTypeArgs}(\mathsf{callee},\ \mathsf{type}_{\mathsf{args}},\ \mathsf{args})\ \mid \ \operatorname{MethodCall}(\mathsf{base},\ \mathsf{name},\ \mathsf{args})\ \mid \ \operatorname{QualifiedApply}(\mathsf{path},\ \mathsf{name},\ \operatorname{Paren}(\mathsf{args}))\ \mid \ \ldots 
$$

$$
\begin{array}{l}
\operatorname{ArgPass}(\langle \mathsf{pass},\ e,\ \mathsf{span}\rangle )\ =\ \mathsf{pass} \\[0.16em]
\operatorname{ArgExpr}(\langle \mathsf{pass},\ e,\ \mathsf{span}\rangle )\ =\ e
\end{array}
$$

$$
\begin{array}{l}
\operatorname{MoveArgExpr}(e)\ = \\[0.16em]
\ \{\ \operatorname{MoveExpr}(e)\ \mathsf{if}\ \operatorname{IsPlace}(e) \\[0.16em]
\quad e\quad \mathsf{otherwise}\ \}
\end{array}
$$

$$
\operatorname{CopyArgExpr}(e)\ =\ \operatorname{CopyExpr}(e)
$$

Qualified parenthesized applications are pre-resolution forms. Name resolution rewrites them to:

- `Call(Path(path', name'), args')` for value and built-in paths
- `Call(Path(mp, name'), args')` for record default-constructor references
- `EnumLiteral(FullPath(p, name), Paren(ArgsExprs(args')))` for tuple enum constructors

### 16.3.4 Static Semantics

$$
\begin{array}{l}
\mathsf{UnresolvedExpr}\ =\ \{\operatorname{QualifiedName}(\_,\ \_),\ \operatorname{QualifiedApply}(\_,\ \_,\ \_)\} \\[0.16em]
\mathsf{ExprJudg}\ =\ \{\Gamma ;\ R;\ L\ \vdash \ e\ :\ T,\ \Gamma ;\ R;\ L\ \vdash \ e\ \Leftarrow \ T\ \dashv \ C,\ \Gamma ;\ R;\ L\ \vdash \ p\ :\mathsf{place}\ T,\ \Gamma ;\ R;\ L\ \vdash \ p\ \Leftarrow_{\mathsf{place}} \ T,\ \Gamma ;\ R;\ L\ \vdash \ r\ :\ \mathsf{Range}\} \\[0.16em]
\mathsf{ArgsOkTJudg}\ =\ \{\mathsf{ArgsOk}_{T}\} \\[0.16em]
\operatorname{ParamMode}(\langle \mathsf{mode},\ T\rangle )\ =\ \mathsf{mode} \\[0.16em]
\operatorname{ParamType}(\langle \mathsf{mode},\ T\rangle )\ =\ T \\[0.16em]
\operatorname{PlaceType}(p)\ =\ T\ \Leftrightarrow \ \Gamma ;\ R;\ L\ \vdash \ p\ :\mathsf{place}\ T \\[0.16em]
\operatorname{HasSourceProvenance}(e)\ \Leftrightarrow \ (\exists \ \pi .\ \Gamma ;\ \Omega \ \vdash \ e\ \Downarrow \ \pi \ \land \ \pi \ \ne \ \bot ) \\[0.16em]
\operatorname{CallTemp}(e)\ =\ p_{\mathsf{tmp}}\ \mathsf{where}\ \lnot \ \operatorname{HasSourceProvenance}(e)\ \land \ \operatorname{Lifetime}(p_{\mathsf{tmp}})\ =\ \mathsf{CallExtent}\ \land \ \operatorname{ValueOf}(p_{\mathsf{tmp}})\ =\ e \\[0.16em]
\operatorname{RefArgExpr}(e)\ =\ \{\ e\ \mathsf{if}\ \operatorname{HasSourceProvenance}(e)\ ;\ \operatorname{CallTemp}(e)\ \mathsf{otherwise}\ \} \\[0.16em]
\operatorname{ConsumeArgExpr}(\mathsf{mode},\ \mathsf{pass},\ e)\ = \\[0.16em]
\ \{\ \operatorname{MoveArgExpr}(e)\quad \mathsf{if}\ \mathsf{mode}\ =\ \texttt{move}\ \land \ \mathsf{pass}\ =\ \texttt{move} \\[0.16em]
\quad \operatorname{CopyArgExpr}(e)\quad \mathsf{if}\ \mathsf{pass}\ =\ \texttt{copy} \\[0.16em]
\quad \operatorname{MoveArgExpr}(\operatorname{CallTemp}(e))\ \mathsf{if}\ \mathsf{mode}\ =\ \texttt{move}\ \land \ \mathsf{pass}\ =\ \texttt{ref}\ \land \ \lnot \ \operatorname{HasSourceProvenance}(e) \\[0.16em]
\quad e\quad \mathsf{otherwise}\ \} \\[0.16em]
\operatorname{RefArgOk}(\mathsf{pass},\ e,\ T_{p})\ \Leftrightarrow  \\[0.16em]
\ (\mathsf{pass}\ =\ \texttt{ref}\ \land \ \Gamma ;\ R;\ L\ \vdash \ \operatorname{RefArgExpr}(e)\ \Leftarrow_{\mathsf{place}} \ T_{p}\ \land \ \operatorname{AddrOfOk}(\operatorname{RefArgExpr}(e)))\ \lor  \\[0.16em]
\ (\mathsf{pass}\ =\ \texttt{copy}\ \land \ \Gamma ;\ R;\ L\ \vdash \ \operatorname{CopyArgExpr}(e)\ \Leftarrow \ T_{p}\ \dashv \ \emptyset ) \\[0.16em]
\operatorname{ArgType}(p,\ a)\ = \\[0.16em]
\ \{\ \operatorname{ExprType}(\operatorname{ConsumeArgExpr}(\operatorname{ParamMode}(p),\ \operatorname{ArgPass}(a),\ \operatorname{ArgExpr}(a)))\quad \mathsf{if}\ \operatorname{ParamMode}(p)\ =\ \texttt{move} \\[0.16em]
\quad \operatorname{ExprType}(\operatorname{CopyArgExpr}(\operatorname{ArgExpr}(a)))\quad \mathsf{if}\ \operatorname{ParamMode}(p)\ =\ \bot \ \land \ \operatorname{ArgPass}(a)\ =\ \texttt{copy} \\[0.16em]
\quad \operatorname{PlaceType}(\operatorname{RefArgExpr}(\operatorname{ArgExpr}(a)))\quad \mathsf{if}\ \operatorname{ParamMode}(p)\ =\ \bot \ \land \ \operatorname{ArgPass}(a)\ =\ \texttt{ref}\ \}
\end{array}
$$

**(ArgsT-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk_T}([],\ [])
\end{array}
$$

**(ArgsT-Cons)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \operatorname{ConsumeArgExpr}(\texttt{move},\ \mathsf{pass},\ e)\ \Leftarrow \ T_{p}\ \dashv \ \emptyset \quad (\mathsf{pass}\ \in \ \{\texttt{move},\ \texttt{copy}\}\ \lor \ (\mathsf{pass}\ =\ \texttt{ref}\ \land \ \lnot \ \operatorname{HasSourceProvenance}(e)))\quad \Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk_T}(\mathsf{ps},\ \mathsf{as}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk_T}([\langle \texttt{move},\ T_{p}\rangle ]\ \mathbin{++} \ \mathsf{ps},\ [\langle \mathsf{pass},\ e,\ \_\rangle ]\ \mathbin{++} \ \mathsf{as})
\end{array}
$$

**(ArgsT-Cons-Ref)**

$$
\begin{array}{l}
\operatorname{RefArgOk}(\mathsf{pass},\ e,\ T_{p})\quad \Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk_T}(\mathsf{ps},\ \mathsf{as}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk_T}([\langle \bot ,\ T_{p}\rangle ]\ \mathbin{++} \ \mathsf{ps},\ [\langle \mathsf{pass},\ e,\ \_\rangle ]\ \mathbin{++} \ \mathsf{as})
\end{array}
$$

**(T-Call-Generic-Infer)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \operatorname{GenericCallInference}(\mathsf{callee},\ \mathsf{args},\ \bot )\ \Downarrow \ [A_{1},\ \ldots ,\ A_{n}]\quad \Gamma ;\ R;\ L\ \vdash \ \operatorname{CallTypeArgs}(\mathsf{callee},\ [A_{1},\ \ldots ,\ A_{n}],\ \mathsf{args})\ :\ R_{c} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Call}(\mathsf{callee},\ \mathsf{args})\ :\ R_{c}
\end{array}
$$

**(T-Call)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{callee}\ :\ \operatorname{TypeFunc}(\mathsf{params},\ R_{c})\quad \Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk_T}(\mathsf{params},\ \mathsf{args}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Call}(\mathsf{callee},\ \mathsf{args})\ :\ R_{c}
\end{array}
$$

**(Call-Callee-NotFunc)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{callee}\ :\ T\quad T\ \ne \ \operatorname{TypeFunc}(\_,\ \_)\quad \lnot (\operatorname{RecordCallee}(\mathsf{callee})\ \land \ \mathsf{args}\ =\ [])\quad c\ =\ \operatorname{Code}(\mathsf{Call}-\mathsf{Callee}-\mathsf{NotFunc}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Call}(\mathsf{callee},\ \mathsf{args})\ \Uparrow \ c
\end{array}
$$

**(Call-ArgCount-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{callee}\ :\ \operatorname{TypeFunc}(\mathsf{params},\ \_)\quad \mid \mathsf{params}\mid \ \ne \ \mid \mathsf{args}\mid \quad c\ =\ \operatorname{Code}(\mathsf{Call}-\mathsf{ArgCount}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Call}(\mathsf{callee},\ \mathsf{args})\ \Uparrow \ c
\end{array}
$$

**(Call-ArgType-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{callee}\ :\ \operatorname{TypeFunc}(\mathsf{params},\ \_)\quad \exists \ i.\ \lnot (\Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgType}(\mathsf{params}[i],\ \mathsf{args}[i])\ \mathrel{<:} \ \operatorname{ParamType}(\mathsf{params}[i]))\quad c\ =\ \operatorname{Code}(\mathsf{Call}-\mathsf{ArgType}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Call}(\mathsf{callee},\ \mathsf{args})\ \Uparrow \ c
\end{array}
$$

**(Call-Move-Missing)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{callee}\ :\ \operatorname{TypeFunc}(\mathsf{params},\ \_)\quad \exists \ i.\ \operatorname{ParamMode}(\mathsf{params}[i])\ =\ \texttt{move}\ \land \ \operatorname{ArgPass}(\mathsf{args}[i])\ =\ \texttt{ref}\ \land \ \operatorname{HasSourceProvenance}(\operatorname{ArgExpr}(\mathsf{args}[i]))\quad c\ =\ \operatorname{Code}(\mathsf{Call}-\mathsf{Move}-\mathsf{Missing}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Call}(\mathsf{callee},\ \mathsf{args})\ \Uparrow \ c
\end{array}
$$

**(Call-Move-Unexpected)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{callee}\ :\ \operatorname{TypeFunc}(\mathsf{params},\ \_)\quad \exists \ i.\ \operatorname{ParamMode}(\mathsf{params}[i])\ =\ \bot \ \land \ \operatorname{ArgPass}(\mathsf{args}[i])\ =\ \texttt{move}\quad c\ =\ \operatorname{Code}(\mathsf{Call}-\mathsf{Move}-\mathsf{Unexpected}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Call}(\mathsf{callee},\ \mathsf{args})\ \Uparrow \ c
\end{array}
$$

**(Call-Arg-Packed-Unsafe-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{callee}\ :\ \operatorname{TypeFunc}(\mathsf{params},\ \_)\quad \exists \ i.\ \operatorname{ParamMode}(\mathsf{params}[i])\ =\ \bot \ \land \ \operatorname{PackedField}(\operatorname{ArgExpr}(\mathsf{args}[i]))\ \land \ \lnot \ \operatorname{UnsafeSpan}(\operatorname{span}(\operatorname{ArgExpr}(\mathsf{args}[i])))\quad c\ =\ \operatorname{Code}(\mathsf{Packed}-\mathsf{Field}-\mathsf{Unsafe}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Call}(\mathsf{callee},\ \mathsf{args})\ \Uparrow \ c
\end{array}
$$

**(Call-Arg-NotPlace)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{callee}\ :\ \operatorname{TypeFunc}(\mathsf{params},\ \_)\quad \exists \ i.\ \operatorname{ParamMode}(\mathsf{params}[i])\ =\ \bot \ \land \ \operatorname{ArgPass}(\mathsf{args}[i])\ =\ \texttt{ref}\ \land \ \operatorname{HasSourceProvenance}(\operatorname{ArgExpr}(\mathsf{args}[i]))\ \land \ \lnot \ \operatorname{IsPlace}(\operatorname{ArgExpr}(\mathsf{args}[i]))\quad c\ =\ \operatorname{Code}(\mathsf{Call}-\mathsf{Arg}-\mathsf{NotPlace}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Call}(\mathsf{callee},\ \mathsf{args})\ \Uparrow \ c
\end{array}
$$

**(Chk-Call-Generic-Infer)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \operatorname{GenericCallInference}(\mathsf{callee},\ \mathsf{args},\ T_{\mathsf{exp}})\ \Downarrow \ [A_{1},\ \ldots ,\ A_{n}]\quad \Gamma ;\ R;\ L\ \vdash \ \operatorname{CallTypeArgs}(\mathsf{callee},\ [A_{1},\ \ldots ,\ A_{n}],\ \mathsf{args})\ :\ R_{c}\quad \Gamma \ \vdash \ R_{c}\ \mathrel{<:} \ T_{\mathsf{exp}} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Call}(\mathsf{callee},\ \mathsf{args})\ \Leftarrow \ T_{\mathsf{exp}}\ \dashv \ \emptyset 
\end{array}
$$

Explicit and inferred type-argument calls use `CallTypeArgs`. Their bound checking, defaulted argument completion, omitted-argument inference, and elaboration to monomorphic `Call` are defined in §14.2.4.

Method-call typing is defined in §15.2.4 for concrete receivers and in §14.6.4 for dynamic `$Class` receivers. Record-default construction via `Call(callee, [])` is defined in §16.6.4. Calls whose callee has closure type are defined in §16.9.4.

Calls to `extern` procedures outside `unsafe` are rejected by the FFI boundary rule in §23.2.4.

### 16.3.5 Dynamic Semantics

**(EvalSigma-Call-Closure)**

$$
\begin{array}{l}
\operatorname{ExprType}(\mathsf{callee})\ =\ \operatorname{TypeClosure}(\_,\ \_,\ \_)\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{ClosureCall}(\mathsf{callee},\ \mathsf{args}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Call}(\mathsf{callee},\ \mathsf{args}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Call-RegionProc)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{callee},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{FuncVal}(\mathsf{sym})),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{BuiltinModalSym}(\texttt{Region::}\mathsf{name})\ \Downarrow \ \mathsf{sym}\quad \operatorname{RegionProcParams}(\mathsf{name})\ =\ \mathsf{params}\quad \Gamma \ \vdash \ \operatorname{EvalArgsSigma}(\mathsf{params},\ \mathsf{args},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{v}),\ \sigma_{2} )\quad \Gamma \ \vdash \ \operatorname{ApplyRegionProc}(\mathsf{name},\ \mathsf{vec}_{v},\ \sigma_{2} )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Call}(\mathsf{callee},\ \mathsf{args}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} )
\end{array}
$$

**(EvalSigma-Call-RegionProc-Ctrl-Args)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{callee},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{FuncVal}(\mathsf{sym})),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{BuiltinModalSym}(\texttt{Region::}\mathsf{name})\ \Downarrow \ \mathsf{sym}\quad \operatorname{RegionProcParams}(\mathsf{name})\ =\ \mathsf{params}\quad \Gamma \ \vdash \ \operatorname{EvalArgsSigma}(\mathsf{params},\ \mathsf{args},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Call}(\mathsf{callee},\ \mathsf{args}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Call-CancelProc)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{callee},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{FuncVal}(\mathsf{sym})),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{BuiltinModalSym}(\texttt{CancelToken::}\mathsf{name})\ \Downarrow \ \mathsf{sym}\quad \operatorname{CancelProcParams}(\mathsf{name})\ =\ \mathsf{params}\quad \Gamma \ \vdash \ \operatorname{EvalArgsSigma}(\mathsf{params},\ \mathsf{args},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{v}),\ \sigma_{2} )\quad \Gamma \ \vdash \ \operatorname{ApplyCancelProc}(\mathsf{name},\ \mathsf{vec}_{v},\ \sigma_{2} )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Call}(\mathsf{callee},\ \mathsf{args}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} )
\end{array}
$$

**(EvalSigma-Call-CancelProc-Ctrl-Args)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{callee},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{FuncVal}(\mathsf{sym})),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{BuiltinModalSym}(\texttt{CancelToken::}\mathsf{name})\ \Downarrow \ \mathsf{sym}\quad \operatorname{CancelProcParams}(\mathsf{name})\ =\ \mathsf{params}\quad \Gamma \ \vdash \ \operatorname{EvalArgsSigma}(\mathsf{params},\ \mathsf{args},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Call}(\mathsf{callee},\ \mathsf{args}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} )
\end{array}
$$

**(EvalSigma-Call-Proc)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{callee},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{c}),\ \sigma_{1} )\quad \mathsf{proc}\ =\ \operatorname{CallTarget}(v_{c})\quad \Gamma \ \vdash \ \operatorname{EvalArgsSigma}(\mathsf{proc}.\mathsf{params},\ \mathsf{args},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{v}),\ \sigma_{2} )\quad \Gamma \ \vdash \ \operatorname{ApplyProcSigma}(\mathsf{proc},\ \mathsf{vec}_{v},\ \sigma_{2} )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Call}(\mathsf{callee},\ \mathsf{args}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} )
\end{array}
$$

**(EvalSigma-Call-Record)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{callee},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{c}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalArgsSigma}([],\ \mathsf{args},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{v}),\ \sigma_{2} )\quad \mathsf{vec}_{v}\ =\ []\quad \operatorname{RecordCtor}(p)\ =\ \operatorname{CallTarget}(v_{c})\quad \Gamma \ \vdash \ \operatorname{ApplyRecordCtorSigma}(p,\ \sigma_{2} )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{Call}(\mathsf{callee},\ \mathsf{args}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} )
\end{array}
$$

**(EvalSigma-MethodCall)**

$$
\begin{array}{l}
\mathsf{mode}\ =\ \operatorname{RecvArgMode}(\mathsf{base})\quad \Gamma \ \vdash \ \operatorname{EvalRecvSigma}(\mathsf{base},\ \mathsf{mode},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\langle v_{\mathsf{self}},\ v_{\mathsf{arg}}\rangle ),\ \sigma_{1} )\quad m\ =\ \operatorname{MethodTarget}(v_{\mathsf{self}},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{EvalArgsSigma}(m.\mathsf{params},\ \mathsf{args},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{v}),\ \sigma_{2} )\quad \Gamma \ \vdash \ \operatorname{ApplyMethodSigma}(\mathsf{base},\ \mathsf{name},\ v_{\mathsf{self}},\ v_{\mathsf{arg}},\ \mathsf{vec}_{v},\ \sigma_{2} )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{MethodCall}(\mathsf{base},\ \mathsf{name},\ \mathsf{args}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} )
\end{array}
$$

**(EvalSigma-Call-Ctrl)** and **(EvalSigma-Call-Ctrl-Args)** propagate control results from callee and argument evaluation.

**(EvalSigma-MethodCall-Ctrl)** and **(EvalSigma-MethodCall-Ctrl-Args)** propagate control results from receiver evaluation and argument evaluation.

`CallTypeArgs` is elaborated to `Call` before evaluation. Closure-typed calls use the closure-application rules owned by §16.9.5.

### 16.3.6 Lowering

**(Lower-Args-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerArgs}([],\ [])\ \Downarrow \ \langle \varepsilon ,\ []\rangle 
\end{array}
$$

**(Lower-Args-Cons-Move)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerMoveArg}(\mathsf{pass},\ e,\ T_{p})\ \Downarrow \ \langle \mathsf{IR}_{e},\ \mathsf{owned}_{\mathsf{ref}}\rangle \quad \Gamma \ \vdash \ \operatorname{LowerArgs}(\mathsf{ps},\ \mathsf{as})\ \Downarrow \ \langle \mathsf{IR}_{a},\ \mathsf{vec}_{v}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerArgs}([\langle \texttt{move},\ x,\ T_{p}\rangle ]\ \mathbin{++} \ \mathsf{ps},\ [\langle \mathsf{pass},\ e,\ \_\rangle ]\ \mathbin{++} \ \mathsf{as})\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{e},\ \mathsf{IR}_{a}),\ [\mathsf{owned}_{\mathsf{ref}}]\ \mathbin{++} \ \mathsf{vec}_{v}\rangle 
\end{array}
$$

**(Lower-Args-Cons-Ref)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerRefArg}(\mathsf{pass},\ e,\ T_{p})\ \Downarrow \ \langle \mathsf{IR}_{e},\ \mathsf{addr}\rangle \quad \Gamma \ \vdash \ \operatorname{LowerArgs}(\mathsf{ps},\ \mathsf{as})\ \Downarrow \ \langle \mathsf{IR}_{a},\ \mathsf{vec}_{v}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerArgs}([\langle \bot ,\ x,\ T_{p}\rangle ]\ \mathbin{++} \ \mathsf{ps},\ [\langle \mathsf{pass},\ e,\ \_\rangle ]\ \mathbin{++} \ \mathsf{as})\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{e},\ \mathsf{IR}_{a}),\ [\mathsf{Ptr}@\operatorname{Valid}(\mathsf{addr})]\ \mathbin{++} \ \mathsf{vec}_{v}\rangle 
\end{array}
$$

**(Lower-Expr-Call-Closure)**

$$
\begin{array}{l}
\operatorname{ExprType}(\mathsf{callee})\ =\ \operatorname{TypeClosure}(\_,\ \_,\ \_)\quad \Gamma \ \vdash \ \operatorname{LowerClosureCall}(\mathsf{callee},\ \mathsf{args})\ \Downarrow \ \langle \mathsf{IR},\ v\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{Call}(\mathsf{callee},\ \mathsf{args}))\ \Downarrow \ \langle \mathsf{IR},\ v\rangle 
\end{array}
$$

**(Lower-Expr-Call-PanicOut)** and **(Lower-Expr-Call-NoPanicOut)** lower ordinary calls after callee and argument evaluation.

**(Lower-MethodCall-Static-PanicOut)**, **(Lower-MethodCall-Static-NoPanicOut)**, **(Lower-MethodCall-Capability)**, and **(Lower-MethodCall-Dynamic)** lower concrete, capability, and dynamic dispatch method calls.

`CallTypeArgs` does not survive lowering; §14.2.6 requires elaboration to monomorphic `Call` first. Closure-call lowering is owned by §16.9.6.

### 16.3.7 Diagnostics

Diagnostics are defined for non-callable callees, wrong argument count, wrong argument type, missing explicit transfer/copy at consuming call sites, unexpected `move` on by-reference parameters, non-place reference arguments, packed-field by-reference arguments outside `unsafe`, calls to `extern` procedures outside `unsafe`, unresolved qualified parenthesized applications, and the closure-specific conditions owned by §16.9.7.
