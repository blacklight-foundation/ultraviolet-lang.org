---
title: "15.6 Postconditions"
description: "15.6 Postconditions from 15. Procedures and Contracts of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "procedures-and-contracts"
specSection: "156-postconditions"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/procedures-and-contracts/">15. Procedures and Contracts</a>
  <span>Procedures and Contracts</span>
</div>

## 15.6 Postconditions

### 15.6.1 Syntax

```text
postcondition_expr ::= predicate_expr
contract_intrinsic ::= "@result" | "@entry" "(" expression ")"
```

### 15.6.2 Parsing

**(Parse-Contract-Result)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"@"})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(P)))\quad \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(P)))\ =\ \texttt{result} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (\operatorname{Advance}(\operatorname{Advance}(P)),\ \mathsf{ContractResult})
\end{array}
$$

**(Parse-Contract-Entry)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"@"})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(P)))\quad \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(P)))\ =\ \texttt{entry}\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P))))\ \Downarrow \ (P_{1},\ e)\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{")"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{ContractEntry}(e))
\end{array}
$$

### 15.6.3 AST Representation / Form

$$
\mathsf{Expr}\ =\ \ldots \ \mid \ \mathsf{ContractResult}\ \mid \ \operatorname{ContractEntry}(\mathsf{expr})\ \mid \ \ldots 
$$

$$
\begin{array}{l}
\operatorname{PostconditionOf}(\mathsf{contract}_{\mathsf{opt}})\ =\ \texttt{true}\quad \mathsf{if}\ \mathsf{contract}_{\mathsf{opt}}\ =\ \bot  \\[0.16em]
\operatorname{PostconditionOf}(\langle \mathsf{pre},\ \mathsf{post}\rangle )\ =\ \texttt{true}\quad \mathsf{if}\ \mathsf{post}\ =\ \bot  \\[0.16em]
\operatorname{PostconditionOf}(\langle \mathsf{pre},\ \mathsf{post}\rangle )\ =\ \mathsf{post}\quad \mathsf{if}\ \mathsf{post}\ \ne \ \bot 
\end{array}
$$

### 15.6.4 Static Semantics

Let `ProofContextAt(r)` denote the active proof context at return point `r` as
defined in SS15.8.4. Postcondition verification at `r` is performed after
binding `@result` to the returned value and uses that proof context.

**(Post-Valid)**

$$
\begin{array}{l}
\operatorname{postcondition}(f)\ =\ P_{\mathsf{post}}\quad \forall \ r\ \in \ \operatorname{ReturnPoints}(f).\ \Gamma_{r} \ \vdash \ P_{\mathsf{post}}\ :\ \mathsf{satisfied} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
f\ :\ \mathsf{postcondition}-\mathsf{valid}
\end{array}
$$

Elision rules:

| Contract Form      | Postcondition |
| ------------------ | ------------- |
| `                  | : P`          | `true` |
| `                  | : P => Q`     | `Q`    |
| `                  | : => Q`       | `Q`    |
| no contract clause | `true`        |

Properties of `@result`:

1. It is available only in postcondition expressions.
2. Its type is the declared return type of the enclosing procedure.
3. For unit-returning procedures, `@result` has type `()`.

**(Result-Union-Type)**

$$
\begin{array}{l}
\operatorname{ReturnType}(f)\ =\ T_{1}\ \mid \ T_{2}\ \mid \ \ldots \ \mid \ T_{n} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma_{\mathsf{post}} \ \vdash \ @\mathsf{result}\ :\ T_{1}\ \mid \ T_{2}\ \mid \ \ldots \ \mid \ T_{n}
\end{array}
$$

**(Result-Is-Predicate)**

$$
\begin{array}{l}
\Gamma_{\mathsf{post}} \ \vdash \ @\mathsf{result}\ :\ T_{\mathsf{union}}\quad T_{\mathsf{variant}}\ \in \ \operatorname{Variants}(T_{\mathsf{union}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma_{\mathsf{post}} \ \vdash \ (@\mathsf{result}\ \mathsf{is}\ T_{\mathsf{variant}})\ :\ \mathsf{bool}
\end{array}
$$

**(Result-Narrowing)**

$$
\begin{array}{l}
(@\mathsf{result}\ \mathsf{is}\ T_{\mathsf{variant}})\ =\ \mathsf{true}\quad \Gamma_{\mathsf{post}} \ \vdash \ @\mathsf{result}\ :\ T_{\mathsf{union}} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma_{\mathsf{post}} \ \vdash \ @\mathsf{result}\ \mathsf{as}\ T_{\mathsf{variant}}\ :\ T_{\mathsf{variant}}
\end{array}
$$

**(Propagate-Postcondition)**

$$
\begin{array}{l}
e?\ \mathsf{propagates}\ \mathsf{error}\ e_{\mathsf{err}}\ \mathsf{at}\ \mathsf{program}\ \mathsf{point}\ p\quad \operatorname{ReturnType}(f)\ =\ T_{\mathsf{success}}\ \mid \ T_{\mathsf{error}} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{Postconditions}\ \mathsf{are}\ \mathsf{evaluated}\ \mathsf{for}\ \mathsf{the}\ \mathsf{propagation}\ \mathsf{return}\ \mathsf{at}\ p\ \mathsf{with}\ @\mathsf{result}\ \mathsf{bound}\ \mathsf{to}\ e_{\mathsf{err}}
\end{array}
$$

**(Result-Modal)**

$$
\begin{array}{l}
\operatorname{ReturnType}(f)\ =\ M@S \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma_{\mathsf{post}} \ \vdash \ @\mathsf{result}\ :\ M@S
\end{array}
$$

**(Result-Generic)**

$$
\begin{array}{l}
\operatorname{ReturnType}(f)\ =\ T\quad T\ \mathsf{is}\ a\ \mathsf{type}\ \mathsf{parameter} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma_{\mathsf{post}} \ \vdash \ @\mathsf{result}\ :\ T
\end{array}
$$

**(Result-Generic-Constraint)**
@result op e in postcondition    op requires class C    T is return type parameter

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
T\ \mathrel{<:} \ C\ \mathsf{required}\ \mathsf{in}\ \mathsf{procedure}\ \mathsf{signature}
\end{array}
$$

$$
\texttt{@entry(expr)}\ \mathsf{constraints}:
$$

1. It is available only in postcondition expressions.
2. `expr` MUST be pure.
3. `expr` MUST reference only parameters and the receiver.
4. The result type of `expr` MUST satisfy `BitcopyType`.

**(Entry-Type)**

$$
\begin{array}{l}
\Gamma_{\mathsf{post}} \ \vdash \ e\ :\ T\quad \operatorname{BitcopyType}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma_{\mathsf{post}} \ \vdash \ @\operatorname{entry}(e)\ :\ T
\end{array}
$$

### 15.6.5 Dynamic Semantics

At each return point `r` with returned value `v_r`, postconditions are evaluated with `@result` bound to `v_r`.

When `@entry(expr)` appears in a postcondition:

1. `expr` is evaluated immediately after parameter binding and successful precondition checking.
2. The result is captured by bitwise copy.
3. Every postcondition check for the invocation reuses the captured value.

Entry-capture timing:

1. Parameter Binding
2. Precondition Check
3. `@entry` Capture
4. Body Execution
5. Postcondition Check
6. Return

**(EntryCapturePhase)**

$$
\begin{array}{l}
\mathsf{entries}\ =\ \operatorname{CollectEntryExprs}(\operatorname{postcondition}(f))\quad \forall \ e_{i}\ \in \ \mathsf{entries}.\ \Gamma_{\mathsf{pre}} \ \vdash \ \operatorname{EvalSigma}(e_{i},\ \sigma_{\mathsf{entry}} )\ \Downarrow \ (\operatorname{Val}(v_{i}),\ \sigma_{\mathsf{entry}} ) \\[0.16em]
\mathsf{captures}\ =\ \{\ e_{i}\ \mapsto \ \operatorname{Capture}(v_{i},\ T_{i})\ \mid \ e_{i}\ \in \ \mathsf{entries}\ \} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{EntryCapturePhase}(f,\ \sigma_{\mathsf{entry}} )\ =\ (\mathsf{captures},\ \sigma_{\mathsf{entry}} )
\end{array}
$$

$$
\operatorname{Capture}(v,\ T)\ =\ v\quad \mathsf{if}\ \operatorname{BitcopyType}(T)
$$

### 15.6.6 Lowering

No standalone representation change is introduced by postconditions. Lowering preserves captured `@entry` values only as inputs to inserted `Post` checks from §15.8.6.

### 15.6.7 Diagnostics

Diagnostics are defined for `@result` outside postconditions, `@entry` expressions whose type is not `BitcopyType`, `@entry` expressions with side effects or capability requirements, and `@entry` references to moved parameters.
