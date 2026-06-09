---
title: "16.9 Closure and Pipeline Expressions"
description: "16.9 Closure and Pipeline Expressions from 16. Expressions of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "expressions"
specSection: "169-closure-and-pipeline-expressions"
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

## 16.9 Closure and Pipeline Expressions

### 16.9.1 Syntax

```text
pipeline_expr      ::= base_postfix_expr ("=>" base_postfix_expr)*
closure_expr       ::= "|" closure_param_list? "|" ("->" type)? closure_body
closure_param_list ::= closure_param ("," closure_param)* ","?
closure_param      ::= "move"? identifier (":" type)?
closure_body       ::= expression | block_expr
```

Trailing commas in `closure_param_list` are permitted only when `TrailingCommaAllowed` (§5.5). A trailing comma does not denote an additional parameter.

Within `closure_expr`, if a typed parameter annotation has a top-level `union_type`, it MUST be parenthesized as `("(" type ")")`. This grouped form is permitted only to disambiguate closure parameter annotations and does not introduce a distinct type constructor.

Closure invocation uses ordinary call syntax; the closure-specific rules for that call form are owned by this section.

### 16.9.2 Parsing

**(Parse-Pipeline)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseBasePostfix}(P)\ \Downarrow \ (P_{1},\ e_{0})\quad \Gamma \ \vdash \ \operatorname{ParsePipelineTail}(P_{1},\ e_{0})\ \Downarrow \ (P_{2},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePipeline}(P)\ \Downarrow \ (P_{2},\ e)
\end{array}
$$

**(Parse-PipelineTail-Stop)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"=>"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePipelineTail}(P,\ e)\ \Downarrow \ (P,\ e)
\end{array}
$$

**(Parse-PipelineTail-Cons)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"=>"})\quad \Gamma \ \vdash \ \operatorname{ParseBasePostfix}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ e_{1})\quad \Gamma \ \vdash \ \operatorname{ParsePipelineTail}(P_{1},\ \operatorname{PipelineExpr}(e,\ e_{1}))\ \Downarrow \ (P_{2},\ e_{2}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePipelineTail}(P,\ e)\ \Downarrow \ (P_{2},\ e_{2})
\end{array}
$$

**(Parse-Closure-Expr)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|"})\quad \Gamma \ \vdash \ \operatorname{ParseClosureParams}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{params})\quad \operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{"|"})\quad \Gamma \ \vdash \ \operatorname{ParseClosureRetOpt}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{ret}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseClosureBody}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{body}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (P_{3},\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{body}))
\end{array}
$$

**(Parse-Closure-Expr-Empty)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|"})\quad \operatorname{IsOp}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"|"})\quad \Gamma \ \vdash \ \operatorname{ParseClosureRetOpt}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ \mathsf{ret}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseClosureBody}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{body}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (P_{2},\ \operatorname{ClosureExpr}([],\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{body}))
\end{array}
$$

**(Parse-ClosureParams-Single)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseClosureParam}(P)\ \Downarrow \ (P_{1},\ p)\quad \lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{","}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureParams}(P)\ \Downarrow \ (P_{1},\ [p])
\end{array}
$$

**(Parse-ClosureParams-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseClosureParam}(P)\ \Downarrow \ (P_{1},\ p)\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{","})\quad \Gamma \ \vdash \ \operatorname{ParseClosureParams}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{ps}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureParams}(P)\ \Downarrow \ (P_{2},\ [p]\ \mathbin{++} \ \mathsf{ps})
\end{array}
$$

**(Parse-ClosureParamType-Grouped)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{ty})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{")"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureParamType}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \mathsf{ty})
\end{array}
$$

**(Parse-ClosureParamType-Plain)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseTypeNoUnion}(P)\ \Downarrow \ (P_{1},\ \mathsf{ty}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureParamType}(P)\ \Downarrow \ (P_{1},\ \mathsf{ty})
\end{array}
$$

**(Parse-ClosureParam-MoveTyped)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{move})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(P)))\quad \mathsf{name}\ =\ \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(P)))\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParseClosureParamType}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P))))\ \Downarrow \ (P_{1},\ \mathsf{ty}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureParam}(P)\ \Downarrow \ (P_{1},\ \langle \mathsf{true},\ \mathsf{name},\ \mathsf{ty}\rangle )
\end{array}
$$

**(Parse-ClosureParam-MoveUntyped)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{move})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(P)))\quad \mathsf{name}\ =\ \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(P)))\quad \lnot \ \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))),\ \texttt{":"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureParam}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P)),\ \langle \mathsf{true},\ \mathsf{name},\ \bot \rangle )
\end{array}
$$

**(Parse-ClosureParam-Typed)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{move})\quad \operatorname{IsIdent}(\operatorname{Tok}(P))\quad \mathsf{name}\ =\ \operatorname{Lexeme}(\operatorname{Tok}(P))\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParseClosureParamType}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ \mathsf{ty}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureParam}(P)\ \Downarrow \ (P_{1},\ \langle \mathsf{false},\ \mathsf{name},\ \mathsf{ty}\rangle )
\end{array}
$$

**(Parse-ClosureParam-Untyped)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{move})\quad \operatorname{IsIdent}(\operatorname{Tok}(P))\quad \mathsf{name}\ =\ \operatorname{Lexeme}(\operatorname{Tok}(P))\quad \lnot \ \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{":"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureParam}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \langle \mathsf{false},\ \mathsf{name},\ \bot \rangle )
\end{array}
$$

**(Parse-ClosureRetOpt-Some)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"->"})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{ty}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureRetOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{ty})
\end{array}
$$

**(Parse-ClosureRetOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"->"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureRetOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-ClosureBody-Block)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseBlock}(P)\ \Downarrow \ (P_{1},\ b) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureBody}(P)\ \Downarrow \ (P_{1},\ \operatorname{BlockExpr}(b))
\end{array}
$$

**(Parse-ClosureBody-Expr)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(P)\ \Downarrow \ (P_{1},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClosureBody}(P)\ \Downarrow \ (P_{1},\ e)
\end{array}
$$

### 16.9.3 AST Representation / Form

$$
\mathsf{Expr}\ =\ \operatorname{PipelineExpr}(\mathsf{left},\ \mathsf{right})\ \mid \ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\ \mid \ \ldots 
$$

$$
\begin{array}{l}
\mathsf{ClosureParam}\ =\ \langle \mathsf{move}_{\mathsf{opt}},\ \mathsf{name},\ \mathsf{type}_{\mathsf{opt}}\rangle \quad \mathsf{move}_{\mathsf{opt}}\ \in \ \{\mathsf{true},\ \mathsf{false}\}\quad \mathsf{type}_{\mathsf{opt}}\ \in \ \{\bot \}\ \cup \ \mathsf{Type} \\[0.16em]
\mathsf{ClosureParams}\ =\ [\mathsf{ClosureParam}] \\[0.16em]
\mathsf{ClosureBody}\ =\ \mathsf{Expr}
\end{array}
$$

### 16.9.4 Static Semantics

$$
\begin{array}{l}
\operatorname{FreeVars}(e)\ =\ \{\ x\ \mid \ x\ \in \ \mathsf{Identifier}\ \land \ \operatorname{Bound}(x,\ e)\ \land \ \lnot \ \operatorname{LocallyBound}(x,\ e)\ \} \\[0.16em]
\operatorname{CaptureSet}(C)\ =\ \operatorname{FreeVars}(C.\mathsf{body})\ \setminus \ \{\ p.\mathsf{name}\ \mid \ p\ \in \ C.\mathsf{params}\ \} \\[0.16em]
\operatorname{MoveCaptureSet}(C)\ =\ \{\ x\ \mid \ x\ \in \ \operatorname{CaptureSet}(C)\ \land \ (\exists \ p\ \in \ C.\mathsf{params}.\ p\ =\ \langle \mathsf{true},\ x,\ \_\rangle )\ \} \\[0.16em]
\quad \cup \ \{\ x\ \mid \ x\ \in \ \operatorname{CaptureSet}(C)\ \land \ \operatorname{MoveExpr}(e)\ \in \ C.\mathsf{body}\ \land \ \operatorname{PlaceRoot}(e)\ =\ x\ \} \\[0.16em]
\operatorname{RefCaptureSet}(C)\ =\ \operatorname{CaptureSet}(C)\ \setminus \ \operatorname{MoveCaptureSet}(C) \\[0.16em]
\operatorname{SharedCaptures}(C)\ =\ \{\ x\ \mid \ x\ \in \ \operatorname{CaptureSet}(C)\ \land \ \Gamma (x)\ =\ \operatorname{TypePerm}(\texttt{shared},\ \_)\ \} \\[0.16em]
\operatorname{ConstCaptures}(C)\ =\ \{\ x\ \mid \ x\ \in \ \operatorname{CaptureSet}(C)\ \land \ \Gamma (x)\ =\ \operatorname{TypePerm}(\texttt{const},\ \_)\ \} \\[0.16em]
\operatorname{UniqueCaptures}(C)\ =\ \{\ x\ \mid \ x\ \in \ \operatorname{CaptureSet}(C)\ \land \ \Gamma (x)\ =\ \operatorname{TypePerm}(\texttt{unique},\ \_)\ \}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{IsEscaping}(C)\ \Leftrightarrow \ \operatorname{ExpectedType}(C)\ \ne \ \bot \ \land \ \operatorname{CanEscape}(\operatorname{ExpectedType}(C)) \\[0.16em]
\operatorname{CanEscape}(T)\ \Leftrightarrow \ T\ =\ \operatorname{TypeClosure}(\_,\ \_,\ \_)\ \lor \ (\operatorname{IsGenericType}(T)\ \land \ \lnot \ \operatorname{LocalBound}(T)) \\[0.16em]
\operatorname{IsLocalClosure}(C)\ \Leftrightarrow \ \lnot \ \operatorname{IsEscaping}(C)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Params}(C)\ =\ C.\mathsf{params} \\[0.16em]
\operatorname{Annot}(p)\ =\ p.\mathsf{type}_{\mathsf{opt}}
\end{array}
$$

**(T-Closure-NonCapturing)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{body})\quad \operatorname{CaptureSet}(C)\ =\ \emptyset  \\[0.16em]
\forall \ i.\ \operatorname{ParamType}(\mathsf{params}[i])\ =\ T_{i}\quad (\mathsf{ret}_{\mathsf{opt}}\ \ne \ \bot \ \Rightarrow \ R\ =\ \mathsf{ret}_{\mathsf{opt}})\quad (\mathsf{ret}_{\mathsf{opt}}\ =\ \bot \ \Rightarrow \ \Gamma '\ \vdash \ \mathsf{body}\ :\ R) \\[0.16em]
\Gamma '\ =\ \Gamma \ \cup \ \{\ \mathsf{params}[i].\mathsf{name}\ \mapsto \ T_{i}\ \mid \ i\ \in \ 1..\mid \mathsf{params}\mid \ \}\quad \Gamma '\ \vdash \ \mathsf{body}\ :\ R \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ C\ :\ \operatorname{TypeFunc}([\langle \mathsf{params}[i].\mathsf{move}_{\mathsf{opt}},\ T_{i}\rangle \ \mid \ i\ \in \ 1..\mid \mathsf{params}\mid ],\ R)
\end{array}
$$

**(T-Closure-NonCapturing-Expected)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{body})\quad \operatorname{CaptureSet}(C)\ =\ \emptyset \quad \operatorname{ExpectedType}(C)\ =\ \operatorname{TypeClosure}(P,\ R_{e},\ D)\quad \operatorname{ParamsCompatible}(\mathsf{params},\ P)\quad \Gamma '\ \vdash \ \mathsf{body}\ \Leftarrow \ R_{e} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ C\ \Leftarrow \ \operatorname{TypeClosure}(P,\ R_{e},\ D)\ :\ \operatorname{TypeClosure}(P,\ R_{e},\ D)
\end{array}
$$

**(T-Closure-Capturing)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{body})\quad \operatorname{CaptureSet}(C)\ \ne \ \emptyset \quad \operatorname{IsLocalClosure}(C) \\[0.16em]
\forall \ i.\ \operatorname{ParamType}(\mathsf{params}[i])\ =\ T_{i}\quad (\mathsf{ret}_{\mathsf{opt}}\ \ne \ \bot \ \Rightarrow \ R\ =\ \mathsf{ret}_{\mathsf{opt}})\quad (\mathsf{ret}_{\mathsf{opt}}\ =\ \bot \ \Rightarrow \ \Gamma '\ \vdash \ \mathsf{body}\ :\ R) \\[0.16em]
\operatorname{UniqueCaptures}(C)\ =\ \emptyset  \\[0.16em]
\Gamma '\ =\ \Gamma \ \cup \ \{\ \mathsf{params}[i].\mathsf{name}\ \mapsto \ T_{i}\ \mid \ i\ \in \ 1..\mid \mathsf{params}\mid \ \}\quad \Gamma '\ \vdash \ \mathsf{body}\ :\ R \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ C\ :\ \operatorname{TypeClosure}([\langle \mathsf{params}[i].\mathsf{move}_{\mathsf{opt}},\ T_{i}\rangle \ \mid \ i\ \in \ 1..\mid \mathsf{params}\mid ],\ R,\ \bot )
\end{array}
$$

**(T-Closure-Escaping)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{body})\quad \operatorname{CaptureSet}(C)\ \ne \ \emptyset \quad \operatorname{IsEscaping}(C) \\[0.16em]
\forall \ i.\ \operatorname{ParamType}(\mathsf{params}[i])\ =\ T_{i}\quad (\mathsf{ret}_{\mathsf{opt}}\ \ne \ \bot \ \Rightarrow \ R\ =\ \mathsf{ret}_{\mathsf{opt}})\quad (\mathsf{ret}_{\mathsf{opt}}\ =\ \bot \ \Rightarrow \ \Gamma '\ \vdash \ \mathsf{body}\ :\ R) \\[0.16em]
\operatorname{UniqueCaptures}(C)\ =\ \emptyset  \\[0.16em]
\operatorname{SharedCaptures}(C)\ =\ \{x_{1},\ \ldots ,\ x_{k}\}\quad \mathsf{deps}\ =\ [(x_{j},\ \Gamma (x_{j}))\ \mid \ j\ \in \ 1..k] \\[0.16em]
\Gamma '\ =\ \Gamma \ \cup \ \{\ \mathsf{params}[i].\mathsf{name}\ \mapsto \ T_{i}\ \mid \ i\ \in \ 1..\mid \mathsf{params}\mid \ \}\quad \Gamma '\ \vdash \ \mathsf{body}\ :\ R \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ C\ :\ \operatorname{TypeClosure}([\langle \mathsf{params}[i].\mathsf{move}_{\mathsf{opt}},\ T_{i}\rangle \ \mid \ i\ \in \ 1..\mid \mathsf{params}\mid ],\ R,\ \langle \mathsf{deps}\rangle )
\end{array}
$$

**(K-Closure-Escape-Type)**

$$
\begin{array}{l}
C\ \mathsf{is}\ \mathsf{escaping}\quad \operatorname{SharedCaptures}(C)\ =\ \{x_{1},\ \ldots ,\ x_{n}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{Type}(C)\ =\ \mid \mathsf{vec}_{T}\mid \ \to \ R\ [\texttt{shared}:\ \{x_{1}\ :\ \texttt{shared}\ T_{1},\ \ldots ,\ x_{n}\ :\ \texttt{shared}\ T_{n}\}]
\end{array}
$$

**(Capture-Const)**

$$
\begin{array}{l}
x\ \in \ \operatorname{ConstCaptures}(C) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{CaptureMode}(C,\ x)\ =\ \mathsf{ByRef}
\end{array}
$$

**(Capture-Shared)**

$$
\begin{array}{l}
x\ \in \ \operatorname{SharedCaptures}(C) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{CaptureMode}(C,\ x)\ =\ \mathsf{ByRef}
\end{array}
$$

**(Capture-Unique-Err)**

$$
\begin{array}{l}
x\ \in \ \operatorname{UniqueCaptures}(C)\quad c\ =\ \operatorname{Code}(E-\mathsf{CON}-0120) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ C\ \Uparrow \ c
\end{array}
$$

**(T-ClosureCall)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ \mathsf{callee}\ :\ \operatorname{TypeClosure}(\mathsf{params},\ R_{c},\ \_)\quad \Gamma ;\ R;\ L\ \vdash \ \operatorname{ArgsOk_T}(\mathsf{params},\ \mathsf{args}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{Call}(\mathsf{callee},\ \mathsf{args})\ :\ R_{c}
\end{array}
$$

**(Infer-Closure-Params)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ C\ \Leftarrow \ \operatorname{TypeFunc}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ],\ R_{t})\ \dashv \ \emptyset \quad \operatorname{Params}(C)\ =\ [p_{1},\ \ldots ,\ p_{n}]\quad \forall \ i.\ (\operatorname{Annot}(p_{i})\ =\ \bot \ \Rightarrow \ \operatorname{ParamType}(p_{i})\ =\ T_{i})\ \land \ (\operatorname{Annot}(p_{i})\ =\ T_{i}'\ \Rightarrow \ \Gamma \ \vdash \ T_{i}'\ \equiv \ T_{i}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{InferClosureParams}(C)\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(Infer-Closure-Params-Err)**

$$
\begin{array}{l}
\exists \ i.\ \operatorname{Annot}(\operatorname{Params}(C)\_i)\ =\ \bot \quad \operatorname{ExpectedType}(C)\ =\ \bot \quad c\ =\ \operatorname{Code}(E-\mathsf{SEM}-2591) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{InferClosureParams}(C)\ \Uparrow \ c
\end{array}
$$

**(Infer-Closure-Return)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \bot ,\ \mathsf{body})\quad \Gamma '\ =\ \Gamma \ \cup \ \{\ \mathsf{params}[i].\mathsf{name}\ \mapsto \ \operatorname{ParamType}(\mathsf{params}[i])\ \mid \ i\ \in \ 1..\mid \mathsf{params}\mid \ \}\quad \Gamma '\ \vdash \ \mathsf{body}\ :\ R \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{InferClosureReturn}(C)\ \Downarrow \ R
\end{array}
$$

The shared dependency set MAY be inferred when the closure is checked against an expected closure type. Otherwise it MUST be written explicitly.

$$
\begin{array}{l}
\operatorname{ClosureMoveCaptures}(C)\ =\ \operatorname{MoveCaptureSet}(C) \\[0.16em]
\operatorname{ClosureRefCaptures}(C)\ =\ \operatorname{RefCaptureSet}(C)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{MoveCaptureValid}(\mathfrak{B} ,\ x)\ \Leftrightarrow \ \operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle \mathsf{Valid},\ \mathsf{mov},\ \_,\ \_\rangle \ \land \ \mathsf{mov}\ =\ \mathsf{mov} \\[0.16em]
\operatorname{MoveCaptureErr}(\mathfrak{B} ,\ x)\ \Leftrightarrow \ \operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle s,\ \mathsf{mv},\ \_,\ \_\rangle \ \land \ (s\ \ne \ \mathsf{Valid}\ \lor \ \mathsf{mv}\ =\ \mathsf{immov})
\end{array}
$$

$$
\operatorname{RefCaptureValid}(\mathfrak{B} ,\ x)\ \Leftrightarrow \ \operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle s,\ \_,\ \_,\ \_\rangle \ \land \ s\ =\ \mathsf{Valid}
$$

$$
\operatorname{ApplyMoveCapture}(\mathfrak{B} ,\ x)\ =\ \operatorname{Update_B}(\mathfrak{B} ,\ x,\ \langle \mathsf{Moved},\ \mathsf{mv},\ m,\ r\rangle )\ \mathsf{where}\ \operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle \_,\ \mathsf{mv},\ m,\ r\rangle 
$$

$$
\begin{array}{l}
\operatorname{ApplyMoveCaptures}(\mathfrak{B} ,\ [])\ =\ \mathfrak{B}  \\[0.16em]
\operatorname{ApplyMoveCaptures}(\mathfrak{B} ,\ [x]\ \mathbin{++} \ \mathsf{xs})\ =\ \operatorname{ApplyMoveCaptures}(\operatorname{ApplyMoveCapture}(\mathfrak{B} ,\ x),\ \mathsf{xs})
\end{array}
$$

**(B-Closure-NonCapturing)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{CaptureSet}(C)\ =\ \emptyset  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \mathfrak{B} ;\ \Pi \ \vdash \ C\ \Rightarrow \ \mathfrak{B} \ \triangleright \ \Pi 
\end{array}
$$

**(B-Closure-Capturing)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{CaptureSet}(C)\ \ne \ \emptyset  \\[0.16em]
\mathsf{MoveCaps}\ =\ \operatorname{ClosureMoveCaptures}(C)\quad \mathsf{RefCaps}\ =\ \operatorname{ClosureRefCaptures}(C) \\[0.16em]
\forall \ x\ \in \ \mathsf{MoveCaps}.\ \operatorname{MoveCaptureValid}(\mathfrak{B} ,\ x)\quad \forall \ x\ \in \ \mathsf{RefCaps}.\ \operatorname{RefCaptureValid}(\mathfrak{B} ,\ x) \\[0.16em]
\mathfrak{B} '\ =\ \operatorname{ApplyMoveCaptures}(\mathfrak{B} ,\ \mathsf{MoveCaps}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \mathfrak{B} ;\ \Pi \ \vdash \ C\ \Rightarrow \ \mathfrak{B} '\ \triangleright \ \Pi 
\end{array}
$$

**(B-Closure-MoveCapture-Moved-Err)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \mathsf{MoveCaps}\ =\ \operatorname{ClosureMoveCaptures}(C) \\[0.16em]
\exists \ x\ \in \ \mathsf{MoveCaps}.\ \operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle s,\ \mathsf{mov},\ \_,\ \_\rangle \ \land \ s\ \ne \ \mathsf{Valid}\ \land \ \mathsf{mov}\ =\ \mathsf{mov}\quad c\ =\ \operatorname{Code}(E-\mathsf{CON}-0121) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \mathfrak{B} ;\ \Pi \ \vdash \ C\ \Uparrow \ c
\end{array}
$$

**(B-Closure-MoveCapture-Immovable-Err)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \mathsf{MoveCaps}\ =\ \operatorname{ClosureMoveCaptures}(C) \\[0.16em]
\exists \ x\ \in \ \mathsf{MoveCaps}.\ \operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle \_,\ \mathsf{mv},\ \_,\ \_\rangle \ \land \ \mathsf{mv}\ =\ \mathsf{immov}\quad c\ =\ \operatorname{Code}(E-\mathsf{MEM}-3006) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \mathfrak{B} ;\ \Pi \ \vdash \ C\ \Uparrow \ c
\end{array}
$$

**(B-Closure-RefCapture-Moved-Err)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \mathsf{RefCaps}\ =\ \operatorname{ClosureRefCaptures}(C) \\[0.16em]
\exists \ x\ \in \ \mathsf{RefCaps}.\ \operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle s,\ \_,\ \_,\ \_\rangle \ \land \ s\ \ne \ \mathsf{Valid}\quad c\ =\ \operatorname{Code}(E-\mathsf{MEM}-3001) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \mathfrak{B} ;\ \Pi \ \vdash \ C\ \Uparrow \ c
\end{array}
$$

**(T-Pipeline)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e_{1}\ :\ T_{1}\quad \Gamma ;\ R;\ L\ \vdash \ e_{2}\ :\ T_{f} \\[0.16em]
(T_{f}\ =\ \operatorname{TypeFunc}([(m,\ T_{p})],\ R_{f})\ \lor \ T_{f}\ =\ \operatorname{TypeClosure}([(m,\ T_{p})],\ R_{f},\ \_)) \\[0.16em]
\Gamma \ \vdash \ T_{1}\ \mathrel{<:} \ T_{p} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{PipelineExpr}(e_{1},\ e_{2})\ :\ R_{f}
\end{array}
$$

**(T-Pipeline-NotCallable-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e_{1}\ :\ T_{1}\quad \Gamma ;\ R;\ L\ \vdash \ e_{2}\ :\ T_{f} \\[0.16em]
T_{f}\ \ne \ \operatorname{TypeFunc}(\_,\ \_)\quad T_{f}\ \ne \ \operatorname{TypeClosure}(\_,\ \_,\ \_)\quad c\ =\ \operatorname{Code}(E-\mathsf{SEM}-2538) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{PipelineExpr}(e_{1},\ e_{2})\ \Uparrow \ c
\end{array}
$$

**(T-Pipeline-TypeMismatch-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e_{1}\ :\ T_{1}\quad \Gamma ;\ R;\ L\ \vdash \ e_{2}\ :\ T_{f} \\[0.16em]
(T_{f}\ =\ \operatorname{TypeFunc}([(m,\ T_{p})],\ \_)\ \lor \ T_{f}\ =\ \operatorname{TypeClosure}([(m,\ T_{p})],\ \_,\ \_)) \\[0.16em]
\lnot (\Gamma \ \vdash \ T_{1}\ \mathrel{<:} \ T_{p})\quad c\ =\ \operatorname{Code}(E-\mathsf{SEM}-2539) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{PipelineExpr}(e_{1},\ e_{2})\ \Uparrow \ c
\end{array}
$$

**(T-Pipeline-ArgCount-Err)**

$$
\begin{array}{l}
\Gamma ;\ R;\ L\ \vdash \ e_{1}\ :\ T_{1}\quad \Gamma ;\ R;\ L\ \vdash \ e_{2}\ :\ T_{f} \\[0.16em]
(T_{f}\ =\ \operatorname{TypeFunc}(\mathsf{params},\ \_)\ \lor \ T_{f}\ =\ \operatorname{TypeClosure}(\mathsf{params},\ \_,\ \_))\quad \mid \mathsf{params}\mid \ \ne \ 1\quad c\ =\ \operatorname{Code}(E-\mathsf{SEM}-2539) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{PipelineExpr}(e_{1},\ e_{2})\ \Uparrow \ c
\end{array}
$$

**(B-Pipeline)**

$$
\begin{array}{l}
\Gamma ;\ \mathfrak{B} ;\ \Pi \ \vdash \ e_{1}\ \Rightarrow \ \mathfrak{B}_{1} \ \triangleright \ \Pi_{1} \quad \Gamma ;\ \mathfrak{B}_{1} ;\ \Pi_{1} \ \vdash \ e_{2}\ \Rightarrow \ \mathfrak{B}_{2} \ \triangleright \ \Pi_{2}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ \mathfrak{B} ;\ \Pi \ \vdash \ \operatorname{PipelineExpr}(e_{1},\ e_{2})\ \Rightarrow \ \mathfrak{B}_{2} \ \triangleright \ \Pi_{2} 
\end{array}
$$

If a closure parameter lacks an annotation and no expected function type is available, inference fails.

The shared dependency set MAY be inferred when the closure is checked against an expected closure type. Otherwise it MUST be written explicitly.

### 16.9.5 Dynamic Semantics

$$
\operatorname{BuildClosureEnv}(\sigma ,\ C)\ =\ \mathsf{env}\ \Leftrightarrow \ \mathsf{env}\ =\ \{\ x\ \mapsto \ \operatorname{CaptureVal}(\sigma ,\ C,\ x)\ \mid \ x\ \in \ \operatorname{CaptureSet}(C)\ \}
$$

$$
\begin{array}{l}
\operatorname{CaptureVal}(\sigma ,\ C,\ x)\ =\ \mathsf{Ptr}@\operatorname{Valid}(\operatorname{AddrOfBind}(x))\quad \mathsf{if}\ x\ \in \ \operatorname{RefCaptureSet}(C) \\[0.16em]
\operatorname{CaptureVal}(\sigma ,\ C,\ x)\ =\ \operatorname{MoveVal}(\sigma ,\ x)\quad \mathsf{if}\ x\ \in \ \operatorname{MoveCaptureSet}(C)
\end{array}
$$

$$
\operatorname{AllocEnv}(\sigma ,\ \mathsf{env})\ =\ (\sigma ',\ \mathsf{env}_{\mathsf{ptr}})\ \Leftrightarrow \ \mathsf{env}_{\mathsf{ptr}}\ =\ \operatorname{Alloc}(\operatorname{EnvSize}(\mathsf{env}))\ \land \ \sigma '\ =\ \operatorname{StoreEnv}(\sigma ,\ \mathsf{env}_{\mathsf{ptr}},\ \mathsf{env})
$$

$$
\begin{array}{l}
\operatorname{BindEnv}(\sigma ,\ \mathsf{env}_{\mathsf{ptr}})\ =\ \sigma '\ \Leftrightarrow  \\[0.16em]
\ C\ =\ \operatorname{ClosureOf}(\mathsf{env}_{\mathsf{ptr}})\ \land  \\[0.16em]
\ \mathsf{env}\ =\ \operatorname{LoadEnv}(\sigma ,\ \mathsf{env}_{\mathsf{ptr}})\ \land  \\[0.16em]
\ \operatorname{BindCapturedList}(\sigma ,\ C,\ [\langle x,\ \mathsf{env}[x]\rangle \ \mid \ x\ \in \ \operatorname{CaptureList}(C)])\ \Downarrow \ (\sigma ',\ \mathsf{bs})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LoadEnv}(\sigma ,\ \mathsf{env}_{\mathsf{ptr}})\ =\ \mathsf{env}\ \Leftrightarrow  \\[0.16em]
\ \forall \ (x,\ \mathsf{offset})\ \in \ \operatorname{EnvOffsets}(\mathsf{env}_{\mathsf{ptr}}).\ \mathsf{env}[x]\ =\ \operatorname{ReadAddr}(\sigma ,\ \operatorname{GEP}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{offset}))
\end{array}
$$

$$
\operatorname{EnvOffsets}(\mathsf{env}_{\mathsf{ptr}})\ =\ [(x_{i},\ \mathsf{offset}_{i})\ \mid \ C\ =\ \operatorname{ClosureOf}(\mathsf{env}_{\mathsf{ptr}})\ \land \ \Gamma \ \vdash \ \operatorname{ClosureEnvLayout}(C)\ \Downarrow \ \langle \_,\ \_,\ \mathsf{offsets}\rangle \ \land \ \operatorname{CaptureSet}(C)\ =\ [x_{1},\ \ldots ,\ x_{n}]\ \land \ \mathsf{offsets}\ =\ [\mathsf{offset}_{1},\ \ldots ,\ \mathsf{offset}_{n}]]
$$

$$
\begin{array}{l}
\operatorname{BindCapturedList}(\sigma ,\ C,\ [])\ \Downarrow \ (\sigma ,\ []) \\[0.16em]
\operatorname{BindCapturedList}(\sigma ,\ C,\ [\langle x,\ v\rangle ]\ \mathbin{++} \ \mathsf{xs})\ \Downarrow \ (\sigma_{2} ,\ b\ \mathbin{::} \ \mathsf{bs})\ \Leftrightarrow \ \operatorname{BindCaptured}(\sigma ,\ C,\ x,\ v)\ \Downarrow \ (\sigma_{1} ,\ b)\ \land \ \operatorname{BindCapturedList}(\sigma_{1} ,\ C,\ \mathsf{xs})\ \Downarrow \ (\sigma_{2} ,\ \mathsf{bs})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BindCaptured}(\sigma ,\ C,\ x,\ \mathsf{Ptr}@\operatorname{Valid}(\mathsf{addr}))\ \Downarrow \ (\sigma ',\ b)\ \Leftrightarrow \ x\ \in \ \operatorname{RefCaptureSet}(C)\ \land \ \operatorname{BindVal}(\sigma ,\ x,\ \operatorname{Alias}(\mathsf{addr}))\ \Downarrow \ (\sigma ',\ b) \\[0.16em]
\operatorname{BindCaptured}(\sigma ,\ C,\ x,\ v)\ \Downarrow \ (\sigma ',\ b)\ \Leftrightarrow \ x\ \in \ \operatorname{MoveCaptureSet}(C)\ \land \ \operatorname{BindVal}(\sigma ,\ x,\ v)\ \Downarrow \ (\sigma ',\ b)
\end{array}
$$

$$
\operatorname{EnvSize}(\mathsf{env})\ =\ \mathsf{size}\quad \Leftrightarrow \ \operatorname{ClosureEnvLayout}(\operatorname{ClosureOf}(\mathsf{env}))\ \Downarrow \ \langle \mathsf{size},\ \_,\ \_\rangle 
$$

**(EvalSigma-Closure-NonCapturing)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{CaptureSet}(C)\ =\ \emptyset \quad \Gamma \ \vdash \ \operatorname{Mangle}(C)\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(C,\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{ClosureVal}(\mathsf{null},\ \mathsf{sym})),\ \sigma )
\end{array}
$$

**(EvalSigma-Closure-Capturing)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{CaptureSet}(C)\ \ne \ \emptyset \quad \Gamma \ \vdash \ \operatorname{Mangle}(C)\ \Downarrow \ \mathsf{sym} \\[0.16em]
\operatorname{BuildClosureEnv}(\sigma ,\ C)\ =\ \mathsf{env}\quad \operatorname{AllocEnv}(\sigma ,\ \mathsf{env})\ =\ (\sigma_{1} ,\ \mathsf{env}_{\mathsf{ptr}}) \\[0.16em]
\operatorname{MarkMoved}(\sigma_{1} ,\ \operatorname{MoveCaptureSet}(C))\ =\ \sigma_{2}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(C,\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{ClosureVal}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{sym})),\ \sigma_{2} )
\end{array}
$$

$$
\begin{array}{l}
\operatorname{MarkMoved}(\sigma ,\ [])\ =\ \sigma  \\[0.16em]
\operatorname{MarkMoved}(\sigma ,\ [x]\ \mathbin{++} \ \mathsf{xs})\ =\ \operatorname{MarkMoved}(\operatorname{SetMoved}(\sigma ,\ x),\ \mathsf{xs})
\end{array}
$$

**(EvalSigma-ClosureCall)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e_{c},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{ClosureVal}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{code}_{\mathsf{ptr}})),\ \sigma_{1} ) \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalArgsSigma}(\operatorname{ClosureParams}(\operatorname{ExprType}(e_{c})),\ \mathsf{args},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(\mathsf{vec}_{v}),\ \sigma_{2} ) \\[0.16em]
\Gamma \ \vdash \ \operatorname{ApplyClosureSigma}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{code}_{\mathsf{ptr}},\ \mathsf{vec}_{v},\ \sigma_{2} )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{ClosureCall}(e_{c},\ \mathsf{args}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} )
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ClosureParams}(\operatorname{TypeClosure}(\mathsf{params},\ R,\ \mathsf{deps}_{\mathsf{opt}}))\ =\ \mathsf{params} \\[0.16em]
\operatorname{ClosureParams}(\operatorname{TypeFunc}(\mathsf{params},\ R))\ =\ \mathsf{params}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ApplyClosureSigma}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{code}_{\mathsf{ptr}},\ \mathsf{vec}_{v},\ \sigma )\ =\ (\mathsf{out},\ \sigma ')\ \Leftrightarrow  \\[0.16em]
\ \mathsf{body}\ =\ \operatorname{CodeBody}(\mathsf{code}_{\mathsf{ptr}})\ \land  \\[0.16em]
\ \mathsf{params}\ =\ \operatorname{CodeParams}(\mathsf{code}_{\mathsf{ptr}})\ \land  \\[0.16em]
\ \sigma_{1} \ =\ \operatorname{BindParams}(\sigma ,\ \mathsf{params},\ \mathsf{vec}_{v})\ \land  \\[0.16em]
\ (\mathsf{env}_{\mathsf{ptr}}\ \ne \ \mathsf{null}\ \Rightarrow \ \sigma_{2} \ =\ \operatorname{BindEnv}(\sigma_{1} ,\ \mathsf{env}_{\mathsf{ptr}}))\ \land  \\[0.16em]
\ (\mathsf{env}_{\mathsf{ptr}}\ =\ \mathsf{null}\ \Rightarrow \ \sigma_{2} \ =\ \sigma_{1} )\ \land  \\[0.16em]
\ \Gamma \ \vdash \ \operatorname{EvalSigma}(\mathsf{body},\ \sigma_{2} )\ \Downarrow \ (\mathsf{out},\ \sigma ')
\end{array}
$$

**(EvalSigma-ClosureCall-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e_{c},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{ClosureCall}(e_{c},\ \mathsf{args}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-ClosureCall-Ctrl-Args)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e_{c},\ \sigma )\ \Downarrow \ (\operatorname{Val}(\operatorname{ClosureVal}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{code}_{\mathsf{ptr}})),\ \sigma_{1} ) \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalArgsSigma}(\operatorname{ClosureParams}(\operatorname{ExprType}(e_{c})),\ \mathsf{args},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{ClosureCall}(e_{c},\ \mathsf{args}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} )
\end{array}
$$

`ClosureCall(e_c, args)` is the resolved internal call form for an ordinary source call `Call(callee, args)` whose callee has closure type. §16.3.5 bridges the source call form to this internal dynamic-semantic form.

Pipeline expressions desugar to function or closure application: `e_1 => e_2 ≡ e_2(e_1)`.

**(EvalSigma-Pipeline-Func)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e_{1},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{1}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(e_{2},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(\operatorname{FuncVal}(\mathsf{sym})),\ \sigma_{2} ) \\[0.16em]
\Gamma \ \vdash \ \operatorname{ApplyProcSigma}(\mathsf{sym},\ [v_{1}],\ \sigma_{2} )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{PipelineExpr}(e_{1},\ e_{2}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} )
\end{array}
$$

**(EvalSigma-Pipeline-Closure)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e_{1},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{1}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(e_{2},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(\operatorname{ClosureVal}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{code}_{\mathsf{ptr}})),\ \sigma_{2} ) \\[0.16em]
\Gamma \ \vdash \ \operatorname{ApplyClosureSigma}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{code}_{\mathsf{ptr}},\ [v_{1}],\ \sigma_{2} )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{PipelineExpr}(e_{1},\ e_{2}),\ \sigma )\ \Downarrow \ (\mathsf{out},\ \sigma_{3} )
\end{array}
$$

**(EvalSigma-Pipeline-Ctrl-Left)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e_{1},\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{PipelineExpr}(e_{1},\ e_{2}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(EvalSigma-Pipeline-Ctrl-Right)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e_{1},\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{1}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(e_{2},\ \sigma_{1} )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{EvalSigma}(\operatorname{PipelineExpr}(e_{1},\ e_{2}),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{2} )
\end{array}
$$

### 16.9.6 Lowering

$$
\operatorname{ClosureEnvFields}(C)\ =\ [(x_{i},\ T_{i})\ \mid \ x_{i}\ \in \ \operatorname{CaptureSet}(C)\ \land \ \operatorname{CaptureType}(C,\ x_{i})\ =\ T_{i}]
$$

$$
\begin{array}{l}
\operatorname{CaptureType}(C,\ x)\ =\ \mathsf{Ptr}<T_{x}>@\mathsf{Valid}\ \Leftrightarrow \ x\ \in \ \operatorname{RefCaptureSet}(C)\ \land \ \Gamma (x)\ =\ T_{x} \\[0.16em]
\operatorname{CaptureType}(C,\ x)\ =\ T_{x}\ \Leftrightarrow \ x\ \in \ \operatorname{MoveCaptureSet}(C)\ \land \ \Gamma (x)\ =\ T_{x}
\end{array}
$$

$$
\operatorname{ConstCaptures}(C)\ \subseteq \ \operatorname{RefCaptureSet}(C)\ \mathsf{and}\ \operatorname{SharedCaptures}(C)\ \subseteq \ \operatorname{RefCaptureSet}(C).\ \mathsf{Const}\ \mathsf{and}\ \mathsf{shared}\ \mathsf{captures}\ \mathsf{therefore}\ \mathsf{use}\ \mathsf{the}\ \mathsf{reference}-\mathsf{capture}\ \mathsf{environment}\ \mathsf{representation};\ \mathsf{their}\ \mathsf{additional}\ \mathsf{permission}\ \mathsf{and}\ \mathsf{key}-\mathsf{acquisition}\ \mathsf{constraints}\ \mathsf{are}\ \mathsf{defined}\ \mathsf{by}\ \S 16.9.4\ \mathsf{and}\ \mathsf{Chapter}\ 19.
$$

**(Layout-ClosureEnv)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{ClosureEnvFields}(C)\ =\ \mathsf{fields}\quad \operatorname{RecordLayout}(\mathsf{fields})\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \mathsf{offsets}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ClosureEnvLayout}(C)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \mathsf{offsets}\rangle 
\end{array}
$$

**(Layout-ClosureEnv-Empty)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{CaptureSet}(C)\ =\ \emptyset  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ClosureEnvLayout}(C)\ \Downarrow \ \langle 0,\ 1,\ []\rangle 
\end{array}
$$

**(Lower-Expr-Closure-NonCapturing)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{CaptureSet}(C)\ =\ \emptyset \quad \Gamma \ \vdash \ \operatorname{ClosureCodeSym}(C)\ \Downarrow \ \mathsf{sym} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(C)\ \Downarrow \ \langle \mathsf{EmptyIR},\ \operatorname{ClosureVal}(\mathsf{null},\ \mathsf{sym})\rangle 
\end{array}
$$

**(Lower-Expr-Closure-Capturing)**

$$
\begin{array}{l}
C\ =\ \operatorname{ClosureExpr}(\mathsf{params},\ \mathsf{ret}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{body})\quad \operatorname{CaptureSet}(C)\ \ne \ \emptyset  \\[0.16em]
\Gamma \ \vdash \ \operatorname{ClosureCodeSym}(C)\ \Downarrow \ \mathsf{sym}\quad \Gamma \ \vdash \ \operatorname{ClosureEnvLayout}(C)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \mathsf{offsets}\rangle  \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerCaptureEnv}(C,\ \mathsf{offsets})\ \Downarrow \ \langle \mathsf{IR}_{\mathsf{env}},\ \mathsf{env}_{\mathsf{ptr}}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(C)\ \Downarrow \ \langle \mathsf{IR}_{\mathsf{env}},\ \operatorname{ClosureVal}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{sym})\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LowerCaptureEnv}(C,\ \mathsf{offsets})\ \Downarrow \ \langle \mathsf{IR},\ \mathsf{env}_{\mathsf{ptr}}\rangle \ \Leftrightarrow  \\[0.16em]
\ \mathsf{captures}\ =\ \operatorname{CaptureSet}(C)\ \land  \\[0.16em]
\ \Gamma \ \vdash \ \operatorname{ClosureEnvLayout}(C)\ \Downarrow \ \langle \mathsf{size},\ \mathsf{align},\ \_\rangle \ \land  \\[0.16em]
\ \mathsf{env}_{\mathsf{ptr}}\ =\ \operatorname{Alloc}(\mathsf{size},\ \mathsf{align})\ \land  \\[0.16em]
\ \mathsf{IR}\ =\ \operatorname{SeqIR}(\operatorname{AllocIR}(\mathsf{size},\ \mathsf{align}),\ [\operatorname{StoreCapture}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{offsets}[i],\ x_{i})\ \mid \ x_{i}\ \in \ \mathsf{captures},\ i\ \in \ 1..\mid \mathsf{captures}\mid ])
\end{array}
$$

$$
\begin{array}{l}
\operatorname{StoreCapture}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{offset},\ x)\ =\ \operatorname{StoreIR}(\operatorname{GEP}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{offset}),\ \mathsf{Ptr}@\operatorname{Valid}(\operatorname{AddrOfBind}(x)))\quad \mathsf{if}\ x\ \in \ \operatorname{RefCaptureSet}(C) \\[0.16em]
\operatorname{StoreCapture}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{offset},\ x)\ =\ \operatorname{MoveIR}(\operatorname{GEP}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{offset}),\ x)\quad \mathsf{if}\ x\ \in \ \operatorname{MoveCaptureSet}(C)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{IsCaptured}(C,\ x)\ \Leftrightarrow \ x\ \in \ \operatorname{CaptureSet}(C) \\[0.16em]
\operatorname{CaptureOffset}(C,\ x)\ =\ \mathsf{offset}_{i}\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{ClosureEnvLayout}(C)\ \Downarrow \ \langle \_,\ \_,\ \mathsf{offsets}\rangle \ \land \ \operatorname{CaptureList}(C)\ =\ [x_{1},\ \ldots ,\ x_{n}]\ \land \ x\ =\ x_{i}\ \land \ \mathsf{offsets}\ =\ [\mathsf{offset}_{1},\ \ldots ,\ \mathsf{offset}_{n}] \\[0.16em]
\operatorname{CaptureList}(C)\ =\ [x\ \mid \ x\ \in \ \operatorname{CaptureSet}(C)]\quad (\mathsf{deterministic}\ \mathsf{ordering}\ \mathsf{by}\ \mathsf{lexicographic}\ \mathsf{name})
\end{array}
$$

**(Lower-CapturedIdent-Ref)**

$$
\begin{array}{l}
\operatorname{InClosureBody}(C)\quad \operatorname{IsCaptured}(C,\ x)\quad x\ \in \ \operatorname{RefCaptureSet}(C)\quad \operatorname{CaptureOffset}(C,\ x)\ =\ \mathsf{offset} \\[0.16em]
\mathsf{env}_{\mathsf{param}}\ =\ \mathsf{ClosureEnvParam}\quad \Gamma (x)\ =\ T_{x} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{Identifier}(x))\ \Downarrow \ \langle \operatorname{SeqIR}(\operatorname{LoadIR}(\operatorname{GEP}(\mathsf{env}_{\mathsf{param}},\ \mathsf{offset}),\ \mathsf{Ptr}<T_{x}>@\mathsf{Valid}),\ \operatorname{LoadIR}(p_{\mathsf{capture}},\ T_{x})),\ v_{\mathsf{capture}}\rangle 
\end{array}
$$

where `p_capture` is the result of the first load and `v_capture` is the result of the second load.

**(Lower-CapturedIdent-Move)**

$$
\begin{array}{l}
\operatorname{InClosureBody}(C)\quad \operatorname{IsCaptured}(C,\ x)\quad x\ \in \ \operatorname{MoveCaptureSet}(C)\quad \operatorname{CaptureOffset}(C,\ x)\ =\ \mathsf{offset} \\[0.16em]
\mathsf{env}_{\mathsf{param}}\ =\ \mathsf{ClosureEnvParam}\quad \Gamma (x)\ =\ T_{x} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{Identifier}(x))\ \Downarrow \ \langle \operatorname{LoadIR}(\operatorname{GEP}(\mathsf{env}_{\mathsf{param}},\ \mathsf{offset}),\ T_{x}),\ v_{\mathsf{capture}}\rangle 
\end{array}
$$

$$
\mathsf{ClosureEnvParam}\ =\ \mathsf{first}\ \mathsf{parameter}\ \mathsf{of}\ \mathsf{closure}\ \mathsf{code}\ \mathsf{function}\ (\mathsf{the}\ \mathsf{environment}\ \mathsf{pointer})
$$

$$
\begin{array}{l}
\operatorname{ClosureCodeSig}(C)\ =\ (\mathsf{params}',\ R)\ \Leftrightarrow  \\[0.16em]
\ C.\mathsf{params}\ =\ \mathsf{params}\ \land  \\[0.16em]
\ C.\mathsf{ret}_{\mathsf{type}\_\mathsf{opt}}\ =\ R_{\mathsf{opt}}\ \land  \\[0.16em]
\ R\ =\ (R_{\mathsf{opt}}\ \mathsf{if}\ R_{\mathsf{opt}}\ \ne \ \bot \ \mathsf{else}\ \operatorname{InferRetType}(C.\mathsf{body}))\ \land  \\[0.16em]
\ \mathsf{params}'\ =\ \operatorname{CodegenParams}([\langle \bot ,\ \texttt{\_\_env},\ \operatorname{TypeRawPtr}(\texttt{imm},\ \operatorname{TypePrim}(\texttt{"u8"}))\rangle ]\ \mathbin{++} \ \mathsf{params})
\end{array}
$$

**(Lower-Closure-Call)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e_{\mathsf{closure}})\ \Downarrow \ \langle \mathsf{IR}_{c},\ v_{\mathsf{closure}}\rangle  \\[0.16em]
v_{\mathsf{closure}}\ =\ \operatorname{ClosureVal}(\mathsf{env}_{\mathsf{ptr}},\ \mathsf{code}_{\mathsf{ptr}}) \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerArgs}(\mathsf{args})\ \Downarrow \ \langle \mathsf{IR}_{\mathsf{args}},\ \mathsf{vs}\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerClosureCall}(e_{\mathsf{closure}},\ \mathsf{args})\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{c},\ \mathsf{IR}_{\mathsf{args}}),\ \operatorname{IndirectCall}(\mathsf{code}_{\mathsf{ptr}},\ [\mathsf{env}_{\mathsf{ptr}}]\ \mathbin{++} \ \mathsf{vs})\rangle 
\end{array}
$$

`LowerClosureCall(e_closure, args)` is the resolved internal lowering form for an ordinary source call `Call(callee, args)` whose callee has closure type. §16.3.6 bridges the source call form to this internal lowering form.

**(Lower-Expr-Pipeline)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(e_{1})\ \Downarrow \ \langle \mathsf{IR}_{1},\ v_{1}\rangle \quad \Gamma \ \vdash \ \operatorname{LowerExpr}(e_{2})\ \Downarrow \ \langle \mathsf{IR}_{2},\ v_{2}\rangle  \\[0.16em]
\operatorname{IsFunc}(\operatorname{ExprType}(e_{2}))\ \Rightarrow \ \mathsf{IR}_{\mathsf{call}}\ =\ \operatorname{CallIR}(v_{2},\ [v_{1}]) \\[0.16em]
\operatorname{IsClosure}(\operatorname{ExprType}(e_{2}))\ \Rightarrow \ v_{2}\ =\ \operatorname{ClosureVal}(\mathsf{env},\ \mathsf{code})\ \land \ \mathsf{IR}_{\mathsf{call}}\ =\ \operatorname{IndirectCall}(\mathsf{code},\ [\mathsf{env},\ v_{1}]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerExpr}(\operatorname{PipelineExpr}(e_{1},\ e_{2}))\ \Downarrow \ \langle \operatorname{SeqIR}(\mathsf{IR}_{1},\ \mathsf{IR}_{2},\ \mathsf{IR}_{\mathsf{call}}),\ v_{\mathsf{result}}\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{IsFunc}(\operatorname{TypeFunc}(\_,\ \_))\ \Leftrightarrow \ \mathsf{true} \\[0.16em]
\operatorname{IsFunc}(\_)\ \Leftrightarrow \ \mathsf{false} \\[0.16em]
\operatorname{IsClosure}(\operatorname{TypeClosure}(\_,\ \_,\ \_))\ \Leftrightarrow \ \mathsf{true} \\[0.16em]
\operatorname{IsClosure}(\_)\ \Leftrightarrow \ \mathsf{false}
\end{array}
$$

### 16.9.7 Diagnostics

Diagnostics are defined for unique captures, closure parameters whose types cannot be inferred, move-capturing a moved binding, move-capturing an immovable binding, reference-capturing a moved binding, pipeline right-hand sides that are not callable, pipeline type mismatch, and pipeline targets that do not accept exactly one argument.
