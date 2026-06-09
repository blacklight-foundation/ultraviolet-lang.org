---
title: "18.4 Assignment Statements"
description: "18.4 Assignment Statements from 18. Statements and Blocks of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "statements-and-blocks"
specSection: "184-assignment-statements"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/statements-and-blocks/">18. Statements and Blocks</a>
  <span>Statements and Blocks</span>
</div>

## 18.4 Assignment Statements

### 18.4.1 Syntax

```text
assignment_stmt ::= place_expr "=" expression terminator
compound_assign ::= place_expr compound_op expression terminator
```

### 18.4.2 Parsing

**(Parse-Assign-Stmt)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParsePlace}(P)\ \Downarrow \ (P_{1},\ p)\quad \operatorname{Tok}(P_{1})\ \in \ \{\operatorname{Operator}(\texttt{"="}),\ \operatorname{Operator}(\texttt{"+="}),\ \operatorname{Operator}(\texttt{"-="}),\ \operatorname{Operator}(\texttt{"*="}),\ \operatorname{Operator}(\texttt{"/="}),\ \operatorname{Operator}(\texttt{"\%="})\}\quad \Gamma \ \vdash \ \operatorname{ParseExpr}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ e) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseStmtCore}(P)\ \Downarrow \ (P_{2},\ \operatorname{AssignOrCompound}(P_{1},\ p,\ e))
\end{array}
$$

**(AssignOrCompound-Assign)**

$$
\begin{array}{l}
\operatorname{Tok}(P_{1})\ =\ \operatorname{Operator}(\texttt{"="}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AssignOrCompound}(P_{1},\ p,\ e)\ \Downarrow \ \operatorname{AssignStmt}(p,\ e)
\end{array}
$$

**(AssignOrCompound-Compound)**

$$
\begin{array}{l}
\operatorname{Tok}(P_{1})\ =\ \operatorname{Operator}(\mathsf{op})\quad \mathsf{op}\ \in \ \{\texttt{"+="},\ \texttt{"-="},\ \texttt{"*="},\ \texttt{"/="},\ \texttt{"\%="}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AssignOrCompound}(P_{1},\ p,\ e)\ \Downarrow \ \operatorname{CompoundAssignStmt}(p,\ \mathsf{op},\ e)
\end{array}
$$

### 18.4.3 AST Representation / Form

AssignStmt(place, expr)
CompoundAssignStmt(place, op, expr)

$$
\begin{array}{l}
\operatorname{PlaceRoot}(\operatorname{Identifier}(x))\ =\ x \\[0.16em]
\operatorname{PlaceRoot}(\operatorname{FieldAccess}(p,\ \_))\ =\ \operatorname{PlaceRoot}(p) \\[0.16em]
\operatorname{PlaceRoot}(\operatorname{TupleAccess}(p,\ \_))\ =\ \operatorname{PlaceRoot}(p) \\[0.16em]
\operatorname{PlaceRoot}(\operatorname{IndexAccess}(p,\ \_))\ =\ \operatorname{PlaceRoot}(p) \\[0.16em]
\operatorname{PlaceRoot}(\operatorname{Deref}(p))\ =\ \operatorname{PlaceRoot}(p)
\end{array}
$$

### 18.4.4 Static Semantics

**(T-Assign)**

$$
\begin{array}{l}
\operatorname{IsPlace}(p)\quad \operatorname{PlaceRoot}(p)\ =\ x\quad \operatorname{MutOf}(\Gamma ,\ x)\ =\ \texttt{var}\quad \Gamma ;\ R;\ L\ \vdash \ p\ :\mathsf{place}\ T_{p}\quad \Gamma ;\ R;\ L\ \vdash \ e\ \Leftarrow \ T_{p}\ \dashv \ \emptyset  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{AssignStmt}(p,\ e)\ \Rightarrow \ \Gamma \ \triangleright \ \langle [],\ [],\ \mathsf{false}\rangle 
\end{array}
$$

Direct mutation of a `shared` place is valid when Chapter 19 can form a valid

$$
\texttt{KeyPath(p)}\ \mathsf{with}\ \texttt{RequiredMode(p) = Write}\ \mathsf{and}\ \mathsf{no}\ \mathsf{key}\ \mathsf{scope},\ \mathsf{escape},\ \mathsf{or}\ \mathsf{conflict}
$$
rule forbids the access. If no covering write key is already held, the assignment
implicitly acquires a write key through the ordinary access rules in §19.1.6.
`E-TYP-1604` applies only when no valid key-mediated write context can be formed.

**(T-CompoundAssign)**

$$
\begin{array}{l}
\operatorname{IsPlace}(p)\quad \operatorname{PlaceRoot}(p)\ =\ x\quad \operatorname{MutOf}(\Gamma ,\ x)\ =\ \texttt{var}\quad \Gamma ;\ R;\ L\ \vdash \ p\ :\mathsf{place}\ T_{p}\quad \operatorname{StripPerm}(T_{p})\ =\ \operatorname{TypePrim}(t)\quad t\ \in \ \mathsf{NumericTypes}\quad \Gamma ;\ R;\ L\ \vdash \ e\ :\ T_{e}\quad \Gamma \ \vdash \ T_{e}\ \mathrel{<:} \ \operatorname{TypePrim}(t) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \operatorname{CompoundAssignStmt}(p,\ \mathsf{op},\ e)\ \Rightarrow \ \Gamma \ \triangleright \ \langle [],\ [],\ \mathsf{false}\rangle 
\end{array}
$$

**(Assign-NotPlace)**

$$
\begin{array}{l}
\mathsf{stmt}\ \in \ \{\operatorname{AssignStmt}(p,\ e),\ \operatorname{CompoundAssignStmt}(p,\ \mathsf{op},\ e)\}\quad \lnot \ \operatorname{IsPlace}(p)\quad c\ =\ \operatorname{Code}(\mathsf{Assign}-\mathsf{NotPlace}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \mathsf{stmt}\ \Uparrow \ c
\end{array}
$$

**(Assign-Immutable-Err)**

$$
\begin{array}{l}
\mathsf{stmt}\ \in \ \{\operatorname{AssignStmt}(p,\ e),\ \operatorname{CompoundAssignStmt}(p,\ \mathsf{op},\ e)\}\quad \operatorname{IsPlace}(p)\quad \operatorname{PlaceRoot}(p)\ =\ x\quad \operatorname{MutOf}(\Gamma ,\ x)\ =\ \texttt{let}\quad c\ =\ \operatorname{Code}(\mathsf{Assign}-\mathsf{Immutable}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \mathsf{stmt}\ \Uparrow \ c
\end{array}
$$

**(Assign-Type-Err)**

$$
\begin{array}{l}
\mathsf{stmt}\ \in \ \{\operatorname{AssignStmt}(p,\ e),\ \operatorname{CompoundAssignStmt}(p,\ \mathsf{op},\ e)\}\quad \operatorname{IsPlace}(p)\quad \Gamma ;\ R;\ L\ \vdash \ p\ :\mathsf{place}\ T_{p}\quad \Gamma ;\ R;\ L\ \vdash \ e\ \Rightarrow \ T_{e}\ \dashv \ C\quad ((\mathsf{stmt}\ =\ \operatorname{AssignStmt}(p,\ e)\ \land \ \lnot (\Gamma \ \vdash \ T_{e}\ \mathrel{<:} \ T_{p}))\ \lor \ (\mathsf{stmt}\ =\ \operatorname{CompoundAssignStmt}(p,\ \mathsf{op},\ e)\ \land \ (\lnot (\Gamma \ \vdash \ T_{e}\ \mathrel{<:} \ \operatorname{StripPerm}(T_{p}))\ \lor \ \lnot \ \exists \ t.\ \operatorname{StripPerm}(T_{p})\ =\ \operatorname{TypePrim}(t)\ \land \ t\ \in \ \mathsf{NumericTypes})))\quad c\ =\ \operatorname{Code}(\mathsf{Assign}-\mathsf{Type}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma ;\ R;\ L\ \vdash \ \mathsf{stmt}\ \Uparrow \ c
\end{array}
$$

Assignment and compound assignment targets with effective `const` permission
are rejected by §10.4.7 Permission Admissibility.
The reported diagnostic is `E-TYP-1601` for both root places and subplaces.
Binding restrictions remain owned by the binding-state rules.

**(B-Assign-Immutable-Err)** and **(B-Assign)** define binding-state effects of assignment.

**(Prov-Assign)** and **(Prov-CompoundAssign)** require the assigned provenance not to escape into a shorter-lived target.

**(Prov-Async-Escape-Err)** and **(Prov-Escape-Err)** define the two escape failures.

### 18.4.5 Dynamic Semantics

$$
\begin{array}{l}
\operatorname{RootBinding}(\mathsf{Sigma},\ p)\ = \\[0.16em]
\ \operatorname{Local}(b)\quad \mathsf{if}\ \operatorname{LookupBind}(\mathsf{Sigma},\ \operatorname{PlaceRoot}(p))\ =\ b
\end{array}
$$
 Static(path, name)    if LookupBind(Sigma, PlaceRoot(p)) undefined ∧ Γ ⊢ ResolveValueName(PlaceRoot(p)) ⇓ ent ∧ ent.origin_opt = mp ∧ name = (ent.target_opt if present, else PlaceRoot(p)) ∧ path = PathOfModule(mp)

$$
\begin{array}{l}
\operatorname{DropOnAssign}(b)\ \Leftrightarrow \ \operatorname{BindInfo}(b).\mathsf{mov}\ =\ \mathsf{immov}\ \land \ \operatorname{BindInfo}(b).\mathsf{resp}\ =\ \mathsf{resp} \\[0.16em]
\operatorname{DropOnAssignStatic}(\mathsf{path},\ \mathsf{name})\ \Leftrightarrow \ \operatorname{StaticBindInfo}(\mathsf{path},\ \mathsf{name}).\mathsf{mov}\ =\ \mathsf{immov}\ \land \ \operatorname{StaticBindInfo}(\mathsf{path},\ \mathsf{name}).\mathsf{resp}\ =\ \mathsf{resp}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{DropOnAssignRoot}(\mathsf{Sigma},\ p)\ \Leftrightarrow \ (\operatorname{RootBinding}(\mathsf{Sigma},\ p)\ =\ \operatorname{Local}(b)\ \land \ \operatorname{DropOnAssign}(b))\ \lor \ (\operatorname{RootBinding}(\mathsf{Sigma},\ p)\ =\ \operatorname{Static}(\mathsf{path},\ \mathsf{name})\ \land \ \operatorname{DropOnAssignStatic}(\mathsf{path},\ \mathsf{name})) \\[0.16em]
\operatorname{RootMoved}(\mathsf{Sigma},\ p)\ \Leftrightarrow \ \operatorname{RootBinding}(\mathsf{Sigma},\ p)\ =\ \operatorname{Local}(b)\ \land \ \operatorname{BindState}(\mathsf{Sigma},\ b)\ =\ \mathsf{Moved}
\end{array}
$$

$$
\mathsf{DropSubvalueJudg}\ =\ \{\Gamma \ \vdash \ \operatorname{DropSubvalue}(p,\ T,\ v,\ \sigma )\ \Downarrow \ \sigma '\}
$$

**(DropSubvalue-Do)**

$$
\begin{array}{l}
\operatorname{DropOnAssignRoot}(\mathsf{Sigma},\ p)\quad \lnot \ \operatorname{RootMoved}(\mathsf{Sigma},\ p)\quad \Gamma \ \vdash \ \operatorname{DropValue}(T,\ v,\ \emptyset )\ \Downarrow \ \mathsf{Sigma}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DropSubvalue}(p,\ T,\ v,\ \mathsf{Sigma})\ \Downarrow \ \mathsf{Sigma}'
\end{array}
$$

**(DropSubvalue-Skip)**

$$
\begin{array}{l}
\lnot \ \operatorname{DropOnAssignRoot}(\mathsf{Sigma},\ p)\ \lor \ \operatorname{RootMoved}(\mathsf{Sigma},\ p) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{DropSubvalue}(p,\ T,\ v,\ \mathsf{Sigma})\ \Downarrow \ \mathsf{Sigma}
\end{array}
$$

**(ExecSigma-Assign)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{WritePlaceSigma}(p,\ v,\ \sigma_{1} )\ \Downarrow \ (\mathsf{sout},\ \sigma_{2} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{AssignStmt}(p,\ e),\ \sigma )\ \Downarrow \ (\mathsf{sout},\ \sigma_{2} )
\end{array}
$$

**(ExecSigma-Assign-Ctrl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{AssignStmt}(p,\ e),\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\kappa ),\ \sigma_{1} )
\end{array}
$$

**(ExecSigma-CompoundAssign)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ReadPlaceSigma}(p,\ \sigma )\ \Downarrow \ (\operatorname{Val}(v_{p}),\ \sigma_{1} )\quad \Gamma \ \vdash \ \operatorname{EvalSigma}(e,\ \sigma_{1} )\ \Downarrow \ (\operatorname{Val}(v_{e}),\ \sigma_{2} )\quad \operatorname{BinOp}(\mathsf{op},\ v_{p},\ v_{e})\ \Downarrow \ v\quad \Gamma \ \vdash \ \operatorname{WritePlaceSigma}(p,\ v,\ \sigma_{2} )\ \Downarrow \ (\mathsf{sout},\ \sigma_{3} ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExecSigma}(\operatorname{CompoundAssignStmt}(p,\ \mathsf{op},\ e),\ \sigma )\ \Downarrow \ (\mathsf{sout},\ \sigma_{3} )
\end{array}
$$

**(ExecSigma-CompoundAssign-Left-Ctrl)** and **(ExecSigma-CompoundAssign-Right-Ctrl)** define control propagation from the left-hand place read and the right-hand expression.

### 18.4.6 Lowering

**(Lower-Stmt-Assign)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerExpr}(\mathsf{expr})\ \Downarrow \ \langle \mathsf{IR}_{e},\ v\rangle \quad \Gamma \ \vdash \ \operatorname{LowerWritePlace}(\mathsf{place},\ v)\ \Downarrow \ \mathsf{IR}_{w} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{AssignStmt}(\mathsf{place},\ \mathsf{expr}))\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{e},\ \mathsf{IR}_{w})
\end{array}
$$

**(Lower-Stmt-CompoundAssign)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LowerReadPlace}(\mathsf{place})\ \Downarrow \ \langle \mathsf{IR}_{p},\ v_{p}\rangle \quad \Gamma \ \vdash \ \operatorname{LowerExpr}(\mathsf{expr})\ \Downarrow \ \langle \mathsf{IR}_{e},\ v_{e}\rangle \quad \operatorname{BinOp}(\mathsf{op},\ v_{p},\ v_{e})\ \Downarrow \ v\quad \Gamma \ \vdash \ \operatorname{LowerWritePlace}(\mathsf{place},\ v)\ \Downarrow \ \mathsf{IR}_{w} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LowerStmt}(\operatorname{CompoundAssignStmt}(\mathsf{place},\ \mathsf{op},\ \mathsf{expr}))\ \Downarrow \ \operatorname{SeqIR}(\mathsf{IR}_{p},\ \mathsf{IR}_{e},\ \mathsf{IR}_{w})
\end{array}
$$

### 18.4.7 Diagnostics

Diagnostics are defined for non-place assignment targets, assignment to immutable bindings, assignment type mismatch, and provenance escapes in assignment. Permission-qualified assignment failures are covered by §10.4.7 Permission Admissibility.
