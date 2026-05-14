---
title: "23.6 Foreign Contracts"
description: "23.6 Foreign Contracts from 23. Foreign Function Interface of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "foreign-function-interface"
specSection: "236-foreign-contracts"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/foreign-function-interface/">23. Foreign Function Interface</a>
  <span>Foreign Function Interface</span>
</div>

## 23.6 Foreign Contracts

### 23.6.1 Syntax

```text
ffi_verification_attr    ::= "[[" ffi_verification_mode "]]"
ffi_verification_mode    ::= "static" | "dynamic"

foreign_contract         ::= "|:" "@foreign_assumes" "(" predicate_expr ")"
                           | "|:" "@foreign_ensures" "(" ensures_predicate ")"
foreign_contract_clause_list ::= foreign_contract+
ensures_predicate        ::= predicate_expr
                           | "@error" ":" predicate_expr
                           | "@null_result" ":" predicate_expr
```

### 23.6.2 Parsing

$$
\operatorname{ForeignContractStart}(P)\ \Leftrightarrow \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|:"})\ \land \ \operatorname{IsOp}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"@"})\ \land \ \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))))\ \land \ \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))))\ \in \ \{\texttt{foreign\_assumes},\ \texttt{foreign\_ensures}\}
$$

**(Parse-ForeignContractClauseListOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{ForeignContractStart}(P) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseForeignContractClauseListOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-ForeignContractClauseListOpt-Yes)**

$$
\begin{array}{l}
\operatorname{ForeignContractStart}(P)\quad \Gamma \ \vdash \ \operatorname{ParseForeignContractClauseList}(P)\ \Downarrow \ (P_{1},\ \mathsf{clauses}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseForeignContractClauseListOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{clauses})
\end{array}
$$

**(Parse-ForeignContractClauseList-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseForeignContractClause}(P)\ \Downarrow \ (P_{1},\ \mathsf{clause})\quad \Gamma \ \vdash \ \operatorname{ParseForeignContractClauseListTail}(P_{1},\ [\mathsf{clause}])\ \Downarrow \ (P_{2},\ \mathsf{clauses}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseForeignContractClauseList}(P)\ \Downarrow \ (P_{2},\ \mathsf{clauses})
\end{array}
$$

**(Parse-ForeignContractClauseListTail-End)**

$$
\begin{array}{l}
\lnot \ \operatorname{ForeignContractStart}(P) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseForeignContractClauseListTail}(P,\ \mathsf{xs})\ \Downarrow \ (P,\ \mathsf{xs})
\end{array}
$$

**(Parse-ForeignContractClauseListTail-Cons)**

$$
\begin{array}{l}
\operatorname{ForeignContractStart}(P)\quad \Gamma \ \vdash \ \operatorname{ParseForeignContractClause}(P)\ \Downarrow \ (P_{1},\ \mathsf{clause})\quad \Gamma \ \vdash \ \operatorname{ParseForeignContractClauseListTail}(P_{1},\ \mathsf{xs}\ \mathbin{++} \ [\mathsf{clause}])\ \Downarrow \ (P_{2},\ \mathsf{ys}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseForeignContractClauseListTail}(P,\ \mathsf{xs})\ \Downarrow \ (P_{2},\ \mathsf{ys})
\end{array}
$$

**(Parse-ForeignContractClause-Assumes)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|:"})\quad \operatorname{IsOp}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"@"})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))))\quad \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))))\ =\ \texttt{foreign\_assumes}\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P)))),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParsePredicateExpr}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P)))))\ \Downarrow \ (P_{1},\ \mathsf{pred})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{")"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseForeignContractClause}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{ForeignContractClause}(\mathsf{ForeignAssumes},\ [\mathsf{pred}]))
\end{array}
$$

**(Parse-ForeignContractClause-Ensures)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"|:"})\quad \operatorname{IsOp}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"@"})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))))\quad \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))))\ =\ \texttt{foreign\_ensures}\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P)))),\ \texttt{"("})\quad \Gamma \ \vdash \ \operatorname{ParseEnsuresPredicate}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P)))))\ \Downarrow \ (P_{1},\ \mathsf{epred})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{1}),\ \texttt{")"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseForeignContractClause}(P)\ \Downarrow \ (\operatorname{Advance}(P_{1}),\ \operatorname{ForeignContractClause}(\operatorname{ForeignEnsuresKind}(\mathsf{epred}),\ [\operatorname{ForeignEnsuresExpr}(\mathsf{epred})]))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ForeignEnsuresKind}(\operatorname{Ensures}(\mathsf{pred}))\ =\ \mathsf{ForeignEnsures} \\[0.16em]
\operatorname{ForeignEnsuresKind}(\operatorname{EnsuresError}(\mathsf{pred}))\ =\ \mathsf{ForeignEnsuresError} \\[0.16em]
\operatorname{ForeignEnsuresKind}(\operatorname{EnsuresNullResult}(\mathsf{pred}))\ =\ \mathsf{ForeignEnsuresNullResult}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ForeignEnsuresExpr}(\operatorname{Ensures}(\mathsf{pred}))\ =\ \mathsf{pred} \\[0.16em]
\operatorname{ForeignEnsuresExpr}(\operatorname{EnsuresError}(\mathsf{pred}))\ =\ \mathsf{pred} \\[0.16em]
\operatorname{ForeignEnsuresExpr}(\operatorname{EnsuresNullResult}(\mathsf{pred}))\ =\ \mathsf{pred}
\end{array}
$$

**(Parse-EnsuresPredicate-Error)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"@"})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(P)))\quad \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(P)))\ =\ \texttt{error}\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParsePredicateExpr}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P))))\ \Downarrow \ (P_{1},\ \mathsf{pred}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseEnsuresPredicate}(P)\ \Downarrow \ (P_{1},\ \operatorname{EnsuresError}(\mathsf{pred}))
\end{array}
$$

**(Parse-EnsuresPredicate-NullResult)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"@"})\quad \operatorname{IsIdent}(\operatorname{Tok}(\operatorname{Advance}(P)))\quad \operatorname{Lexeme}(\operatorname{Tok}(\operatorname{Advance}(P)))\ =\ \texttt{null\_result}\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParsePredicateExpr}(\operatorname{Advance}(\operatorname{Advance}(\operatorname{Advance}(P))))\ \Downarrow \ (P_{1},\ \mathsf{pred}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseEnsuresPredicate}(P)\ \Downarrow \ (P_{1},\ \operatorname{EnsuresNullResult}(\mathsf{pred}))
\end{array}
$$

**(Parse-EnsuresPredicate-Plain)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParsePredicateExpr}(P)\ \Downarrow \ (P_{1},\ \mathsf{pred}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseEnsuresPredicate}(P)\ \Downarrow \ (P_{1},\ \operatorname{Ensures}(\mathsf{pred}))
\end{array}
$$
### 23.6.3 AST Representation / Form

Foreign contracts are attached to extern declarations via `foreign_contracts_opt`.

$$
\begin{array}{l}
\mathsf{foreign}_{\mathsf{contracts}\_\mathsf{opt}}\ \in \ \{\bot \}\ \cup \ [\mathsf{ForeignContractClause}] \\[0.16em]
\mathsf{ForeignContractKind}\ =\ \{\mathsf{ForeignAssumes},\ \mathsf{ForeignEnsures},\ \mathsf{ForeignEnsuresError},\ \mathsf{ForeignEnsuresNullResult}\} \\[0.16em]
\mathsf{EnsuresPredicate}\ =\ \{\operatorname{Ensures}(\mathsf{pred}),\ \operatorname{EnsuresError}(\mathsf{pred}),\ \operatorname{EnsuresNullResult}(\mathsf{pred})\}\quad \mathsf{pred}\ \in \ \mathsf{Expr} \\[0.16em]
\mathsf{ForeignContractClause}\ =\ \operatorname{ForeignContractClause}(\mathsf{kind},\ \mathsf{preds}) \\[0.16em]
\mathsf{kind}\ \in \ \mathsf{ForeignContractKind}\quad \mathsf{preds}\ \in \ [\mathsf{Expr}]
\end{array}
$$

Ensures-predicate forms are:

```text
Ensures(pred)
EnsuresError(pred)
EnsuresNullResult(pred)
```
### 23.6.4 Static Semantics

#### 23.6.4.1 Foreign Preconditions

**Foreign Preconditions.** Conditions that callers must satisfy before invoking foreign procedures, specified using the `@foreign_assumes` clause.

**Predicate Context**

Predicates MAY reference:

- Parameter names from the procedure signature
- Literal constants
- Pure functions and operators
- Fields of parameter values (for record types)

Predicates MUST NOT reference:

- Global mutable state
- Values not in scope at the call site
- Effectful operations

**Verification Modes**

| Mode                   | Behavior                                     |
| :--------------------- | :------------------------------------------- |
| `[[static]]` (default) | Caller must prove predicates at compile time |
| `[[dynamic]]`          | Runtime checks inserted before `unsafe` call |

$$
\texttt{[[static]]}\ \mathsf{uses}\ \texttt{StaticProof}\ \mathsf{as}\ \mathsf{defined}\ \mathsf{in}\ \S 15.8.\ \texttt{[[dynamic]]}\ \mathsf{inserts}\ \texttt{ContractCheck(P, ForeignPre, s, rho\_emptyset)}\ \mathsf{immediately}\ \mathsf{before}\ \mathsf{the}\ \mathsf{foreign}\ \mathsf{call}.
$$

#### 23.6.4.2 Foreign Postconditions

**Foreign Postconditions.** Conditions that foreign code guarantees upon successful return, specified using the `@foreign_ensures` clause.

**Predicate Bindings**

Postcondition predicates MAY reference:

- `@result`: The return value of the foreign procedure
- Parameter names (for checking output parameters)
- `@error`: Predicates that hold when the call fails
- `@null_result`: Predicates that hold when result is null

**Success, Error, and Null Classification**

Let U be the set of unconditional predicates, E the list of `@error` predicates, and N the list of `@null_result` predicates.

Define:

ErrCond =

$$
\begin{array}{l}
\ \bigwedge \_(P\ \in \ E)\ P\quad \mathsf{if}\ E\ \ne \ \emptyset  \\[0.16em]
\ \texttt{false}\quad \mathsf{otherwise}
\end{array}
$$

$$
\mathsf{NullCond}\ =\ (\texttt{@result}\ =\ \texttt{null})
$$

$$
\mathsf{SuccessCond}\ =\ \lnot \ \mathsf{ErrCond}
$$

The foreign call is classified as an error iff `ErrCond` holds; otherwise it is classified as success.

Then the foreign postcondition obligations are:

1. For each P ∈ U, require SuccessCond ⇒ P
2. For each P ∈ E, require ErrCond ⇒ P
3. For each P ∈ N, require NullCond ⇒ P

`@null_result` predicates are well-formed only when the return type is a nullable pointer type; otherwise they are invalid. A nullable pointer type is one of:
1. `Ptr<T>@Null`
2. `*imm T`
3. `*mut T`

$$
\begin{array}{l}
\operatorname{NullableFfiResult}(T)\ \Leftrightarrow \ T\ =\ \operatorname{TypePtr}(\_,\ \texttt{@Null})\ \lor \ T\ =\ \operatorname{TypeRawPtr}(\texttt{imm},\ \_)\ \lor \ T\ =\ \operatorname{TypeRawPtr}(\texttt{mut},\ \_) \\[0.16em]
\operatorname{NullResultEnsures}(\mathsf{proc})\ =\ [\mathsf{pred}\ \mid \ \mathsf{clause}\ \in \ \mathsf{proc}.\mathsf{foreign}_{\mathsf{contracts}\_\mathsf{opt}}\ \land \ \mathsf{clause}.\mathsf{kind}\ =\ \mathsf{ForeignEnsures}\ \land \ \mathsf{pred}\ \in \ \mathsf{clause}.\mathsf{preds}\ \land \ \mathsf{pred}\ =\ \operatorname{EnsuresNullResult}(\_)]
\end{array}
$$

**(ForeignEnsures-NullResult-Err)**

$$
\begin{array}{l}
\mathsf{proc}\ =\ \operatorname{ExternProcDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \mathsf{ret}_{\mathsf{opt}},\ \_,\ \mathsf{foreign}_{\mathsf{contracts}\_\mathsf{opt}},\ \_,\ \_) \\[0.16em]
\operatorname{NullResultEnsures}(\mathsf{proc})\ \ne \ []\quad R\ =\ \operatorname{ProcReturn}(\mathsf{ret}_{\mathsf{opt}})\quad \lnot \ \operatorname{NullableFfiResult}(R) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{proc}\ \Uparrow 
\end{array}
$$

`@error` predicates are well-formed only when the return type is not `()`. Using `@error` on a void-returning foreign procedure is ill-formed.

**Verification Modes**

| Mode                   | Behavior                                                      |
| :--------------------- | :------------------------------------------------------------ |
| `[[static]]` (default) | Postconditions available as assumptions for downstream proofs |
| `[[dynamic]]`          | Runtime assertions after foreign call returns                 |

`[[static]]` uses `StaticProof` as defined in §15.8 with `SuccessCond` and `ErrCond` gating the obligations.

#### 23.6.4.3 Verification Summary

**Verification Summary.** Foreign-contract verification uses the following mode table:

| Level         | Precondition Check | Postcondition Check      |
| :------------ | :----------------- | :----------------------- |
| `[[static]]`  | Compile-time proof | Available as assumptions |
| `[[dynamic]]` | Runtime assertion  | Runtime assertion        |

### 23.6.5 Dynamic Semantics

For foreign preconditions, a failed `ForeignPre` check triggers a panic.

For foreign postconditions, in `[[dynamic]]` mode, the implementation MUST evaluate `ErrCond` and `NullCond` in left-to-right predicate order and insert runtime checks enforcing the implications above immediately after the foreign call returns. Each inserted check is `ContractCheck(P, ForeignPost, s, ρ_foreign_post)`. A failed runtime check triggers a panic with payload `ContractViolation(ForeignPost, P, s)` at the call site.

### 23.6.6 Lowering

`[[dynamic]]` lowers foreign contracts by inserting `ContractCheck` before the foreign call for `ForeignPre` and after the foreign call for `ForeignPost`. `[[static]]` introduces no runtime checks.

### 23.6.7 Diagnostics

| Code         | Severity | Detection    | Condition                                            |
| ------------ | -------- | ------------ | ---------------------------------------------------- |
| `E-SEM-2850` | Error    | Compile-time | Cannot prove `@foreign_assumes` predicate            |
| `E-SEM-2851` | Error    | Compile-time | Invalid predicate in foreign contract                |
| `E-SEM-2852` | Error    | Compile-time | Predicate references out-of-scope value              |
| `E-SEM-2853` | Error    | Compile-time | Invalid predicate in `@foreign_ensures`              |
| `E-SEM-2854` | Error    | Compile-time | `@result` used in non-return context                 |
| `E-SEM-2855` | Error    | Compile-time | `@error` predicate on void-returning procedure       |
| `E-SEM-2856` | Error    | Compile-time | `@null_result` predicate on non-nullable return type |
| `P-SEM-2860` | Panic    | Runtime      | Foreign precondition failed at runtime               |
| `P-SEM-2861` | Panic    | Runtime      | Foreign postcondition failed at runtime              |
