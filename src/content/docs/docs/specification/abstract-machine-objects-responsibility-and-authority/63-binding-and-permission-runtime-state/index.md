---
title: "6.3 Binding and Permission Runtime State"
description: "6.3 Binding and Permission Runtime State from 6. Abstract Machine, Objects, Responsibility, and Authority of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "abstract-machine-objects-responsibility-and-authority"
specSection: "63-binding-and-permission-runtime-state"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/abstract-machine-objects-responsibility-and-authority/">6. Abstract Machine, Objects, Responsibility, and Authority</a>
  <span>Abstract Machine, Objects, Responsibility, and Authority</span>
</div>

## 6.3 Binding and Permission Runtime State

### 6.3.1 Binding State

$$
\mathsf{BindingState}\ \mathbin{::} =\ \mathsf{Valid}\ \mid \ \mathsf{Moved}\ \mid \ \operatorname{PartiallyMoved}(F)\quad (F\ \subseteq \ \mathsf{Name})
$$

$$
\begin{array}{l}
\mathsf{Movability}\ \mathbin{::} =\ \mathsf{mov}\ \mid \ \mathsf{immov} \\[0.16em]
\mathsf{Responsibility}\ \mathbin{::} =\ \mathsf{resp}\ \mid \ \mathsf{alias} \\[0.16em]
\mathsf{Mutability}\ =\ \{\texttt{let},\ \texttt{var}\} \\[0.16em]
\mathsf{BindInfo}\ \mathbin{::} =\ \langle \mathsf{state},\ \mathsf{mov},\ \mathsf{mut},\ \mathsf{resp}\rangle
\end{array}
$$

$$
\begin{array}{l}
\mathsf{BindScope}\ =\ \operatorname{Map}(\mathsf{Identifier},\ \mathsf{BindInfo}) \\[0.16em]
\mathfrak{B} \ =\ [\mathsf{BindScope}]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{PushScope_B}(\mathfrak{B} )\ =\ [\emptyset ]\ \mathbin{++} \ \mathfrak{B} \\[0.16em]
\operatorname{PopScope_B}([\_]\ \mathbin{++} \ \mathfrak{B} )\ =\ \mathfrak{B}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Lookup_B}([\sigma ]\ \mathbin{++} \ \mathfrak{B} ',\ x)\ = \\[0.16em]
\ \{\ \sigma [x]\quad \mathsf{if}\ x\ \in \ \operatorname{dom}(\sigma ) \\[0.16em]
\quad \operatorname{Lookup_B}(\mathfrak{B} ',\ x)\quad \mathsf{otherwise}\ \} \\[0.16em]
\operatorname{Lookup_B}([],\ x)\ =\ \bot
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Update_B}([\sigma ]\ \mathbin{++} \ \mathfrak{B} ',\ x,\ \mathsf{info})\ = \\[0.16em]
\ \{\ [\sigma [x\ \mapsto \ \mathsf{info}]]\ \mathbin{++} \ \mathfrak{B} '\quad \mathsf{if}\ x\ \in \ \operatorname{dom}(\sigma ) \\[0.16em]
\quad [\sigma ]\ \mathbin{++} \ \operatorname{Update_B}(\mathfrak{B} ',\ x,\ \mathsf{info})\ \mathsf{otherwise}\ \} \\[0.16em]
\operatorname{Update_B}([],\ x,\ \mathsf{info})\ =\ \bot
\end{array}
$$

$$
\operatorname{Intro_B}([\sigma ]\ \mathbin{++} \ \mathfrak{B} ',\ x,\ \mathsf{info})\ =\ [\sigma [x\ \mapsto \ \mathsf{info}]]\ \mathbin{++} \ \mathfrak{B} '
$$

### 6.3.2 Permission Activity State

$$
\begin{array}{l}
\operatorname{PermOf}(\operatorname{TypePerm}(p,\ T))\ =\ p \\[0.16em]
\operatorname{PermOf}(T)\ =\ \texttt{const}\quad \mathsf{if}\ T\ \ne \ \operatorname{TypePerm}(\_,\ \_)
\end{array}
$$

$$
\mathsf{ActiveState}\ \mathbin{::} =\ \mathsf{Active}\ \mid \ \mathsf{Inactive}
$$

$$
\begin{array}{l}
\mathsf{PermKey}\ =\ \mathsf{Identifier}\ \times \ \mathsf{FieldPath} \\[0.16em]
\mathsf{PermScope}\ =\ \operatorname{Map}(\mathsf{PermKey},\ \mathsf{ActiveState}) \\[0.16em]
\Pi \ =\ [\mathsf{PermScope}]
\end{array}
$$

$$
\begin{array}{l}
\mathsf{PushScope}\_\Pi (\Pi )\ =\ [\emptyset ]\ \mathbin{++} \ \Pi \\[0.16em]
\mathsf{PopScope}\_\Pi ([\_]\ \mathbin{++} \ \Pi )\ =\ \Pi
\end{array}
$$

$$
\begin{array}{l}
\mathsf{Lookup}\_\Pi ([\sigma ]\ \mathbin{++} \ \Pi ',\ k)\ = \\[0.16em]
\ \{\ \mathsf{Inactive}\quad \mathsf{if}\ k\ \in \ \operatorname{dom}(\sigma )\ \land \ \sigma [k]\ =\ \mathsf{Inactive} \\[0.16em]
\quad \mathsf{Lookup}\_\Pi (\Pi ',\ k)\quad \mathsf{otherwise}\ \} \\[0.16em]
\mathsf{Lookup}\_\Pi ([],\ k)\ =\ \mathsf{Active}
\end{array}
$$

$$
\mathsf{Update}\_\Pi ([\sigma ]\ \mathbin{++} \ \Pi ',\ k,\ s)\ =\ [\sigma [k\ \mapsto \ s]]\ \mathbin{++} \ \Pi '
$$

### 6.3.3 Join and Transition Operations

$$
\begin{array}{l}
\operatorname{JoinState}(\mathsf{Moved},\ s)\ =\ \mathsf{Moved} \\[0.16em]
\operatorname{JoinState}(s,\ \mathsf{Moved})\ =\ \mathsf{Moved} \\[0.16em]
\operatorname{JoinState}(\operatorname{PartiallyMoved}(F_{1}),\ \operatorname{PartiallyMoved}(F_{2}))\ =\ \operatorname{PartiallyMoved}(F_{1}\ \cup \ F_{2}) \\[0.16em]
\operatorname{JoinState}(\mathsf{Valid},\ \operatorname{PartiallyMoved}(F))\ =\ \operatorname{PartiallyMoved}(F) \\[0.16em]
\operatorname{JoinState}(\operatorname{PartiallyMoved}(F),\ \mathsf{Valid})\ =\ \operatorname{PartiallyMoved}(F) \\[0.16em]
\operatorname{JoinState}(\mathsf{Valid},\ \mathsf{Valid})\ =\ \mathsf{Valid}
\end{array}
$$

$$
\mathsf{StateTransition}\ =\ \mathsf{Valid}\ \to \ \mathsf{Moved}\ \mid \ \mathsf{Valid}\ \to \ \operatorname{PartiallyMoved}(F)\ \mid \ \operatorname{PartiallyMoved}(F)\ \to \ \operatorname{PartiallyMoved}(F\ \cup \ \{f\})\ \mid \ \operatorname{PartiallyMoved}(F)\ \to \ \mathsf{Moved}
$$

**(Trans-Move-Whole)**

$$
\begin{array}{l}
\operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle \mathsf{Valid},\ \mathsf{mv},\ \mathsf{mut},\ \mathsf{resp}\rangle \quad \operatorname{MoveWhole}(x)\ \mathsf{occurs} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{Update_B}(\mathfrak{B} ,\ x,\ \langle \mathsf{Moved},\ \mathsf{mv},\ \mathsf{mut},\ \mathsf{resp}\rangle )
\end{array}
$$

**(Trans-Move-Field)**

$$
\begin{array}{l}
\operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle \mathsf{Valid},\ \mathsf{mv},\ \mathsf{mut},\ \mathsf{resp}\rangle \quad \operatorname{MoveField}(x,\ f)\ \mathsf{occurs} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{Update_B}(\mathfrak{B} ,\ x,\ \langle \operatorname{PartiallyMoved}(\{f\}),\ \mathsf{mv},\ \mathsf{mut},\ \mathsf{resp}\rangle )
\end{array}
$$

**(Trans-Move-Field-Partial)**

$$
\begin{array}{l}
\operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle \operatorname{PartiallyMoved}(F),\ \mathsf{mv},\ \mathsf{mut},\ \mathsf{resp}\rangle \quad \operatorname{MoveField}(x,\ f)\ \mathsf{occurs}\quad f\ \notin \ F \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{Update_B}(\mathfrak{B} ,\ x,\ \langle \operatorname{PartiallyMoved}(F\ \cup \ \{f\}),\ \mathsf{mv},\ \mathsf{mut},\ \mathsf{resp}\rangle )
\end{array}
$$

**(Trans-Partial-To-Moved)**

$$
\begin{array}{l}
\operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle \operatorname{PartiallyMoved}(F),\ \mathsf{mv},\ \mathsf{mut},\ \mathsf{resp}\rangle \quad \operatorname{AllFields}(\operatorname{TypeOf}(x))\ =\ F \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{Update_B}(\mathfrak{B} ,\ x,\ \langle \mathsf{Moved},\ \mathsf{mv},\ \mathsf{mut},\ \mathsf{resp}\rangle )
\end{array}
$$

**(Trans-Reassign)**

$$
\begin{array}{l}
\operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle s,\ \mathsf{mv},\ \texttt{var},\ \mathsf{resp}\rangle \quad \operatorname{Reassign}(x,\ v)\ \mathsf{occurs}\quad s\ \in \ \{\mathsf{Moved},\ \operatorname{PartiallyMoved}(\_)\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{Update_B}(\mathfrak{B} ,\ x,\ \langle \mathsf{Valid},\ \mathsf{mv},\ \texttt{var},\ \mathsf{resp}\rangle )
\end{array}
$$

**(Trans-Moved-NoAccess)**

$$
\begin{array}{l}
\operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle \mathsf{Moved},\ \_,\ \_,\ \_\rangle \quad \operatorname{Read}(x)\ \lor \ \operatorname{Move}(x)\ \mathsf{occurs} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Uparrow \ \operatorname{Code}(\mathsf{Trans}-\mathsf{Moved}-\mathsf{NoAccess})
\end{array}
$$

**(Trans-Partial-NoAccess)**

$$
\begin{array}{l}
\operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle \operatorname{PartiallyMoved}(F),\ \_,\ \_,\ \_\rangle \quad \operatorname{Read}(x.f)\ \lor \ \operatorname{Move}(x.f)\ \mathsf{occurs}\quad f\ \in \ F \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Uparrow \ \operatorname{Code}(\mathsf{Trans}-\mathsf{Partial}-\mathsf{NoAccess})
\end{array}
$$

**(Trans-Let-NoReassign)**

$$
\begin{array}{l}
\operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle s,\ \mathsf{mv},\ \texttt{let},\ \mathsf{resp}\rangle \quad \operatorname{Reassign}(x,\ v)\ \mathsf{occurs}\quad s\ \in \ \{\mathsf{Moved},\ \operatorname{PartiallyMoved}(\_)\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Uparrow \ \operatorname{Code}(\mathsf{Trans}-\mathsf{Let}-\mathsf{NoReassign})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{JoinBindInfo}(\langle s_{1},\ \mathsf{mv}_{1},\ \mathsf{mut}_{1},\ \mathsf{resp}_{1}\rangle ,\ \langle s_{2},\ \mathsf{mv}_{2},\ \mathsf{mut}_{2},\ \mathsf{resp}_{2}\rangle )\ = \\[0.16em]
\ \{\ \langle \operatorname{JoinState}(s_{1},\ s_{2}),\ \mathsf{mv}_{1},\ \mathsf{mut}_{1},\ \mathsf{resp}_{1}\rangle \ \mathsf{if}\ \mathsf{mv}_{1}\ =\ \mathsf{mv}_{2}\ \land \ \mathsf{mut}_{1}\ =\ \mathsf{mut}_{2}\ \land \ \mathsf{resp}_{1}\ =\ \mathsf{resp}_{2} \\[0.16em]
\quad \bot \quad \mathsf{otherwise}\ \}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{JoinScope_B}(B_{1},\ B_{2})\ = \\[0.16em]
\ \{\ \{\ x\ \mapsto \ \operatorname{JoinBindInfo}(B_{1}[x],\ B_{2}[x])\ \mid \ x\ \in \ \operatorname{dom}(B_{1})\ \}\quad \mathsf{if}\ \operatorname{dom}(B_{1})\ =\ \operatorname{dom}(B_{2})\ \land \ \forall \ x\ \in \ \operatorname{dom}(B_{1}).\ \operatorname{JoinBindInfo}(B_{1}[x],\ B_{2}[x])\ \ne \ \bot \\[0.16em]
\quad \bot \quad \mathsf{otherwise}\ \}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Join_B}([],\ [])\ =\ [] \\[0.16em]
\operatorname{Join_B}(B_{1}\ \mathbin{::} \ \mathfrak{B}_{1} ,\ B_{2}\ \mathbin{::} \ \mathfrak{B}_{2} )\ = \\[0.16em]
\ \{\ \operatorname{JoinScope_B}(B_{1},\ B_{2})\ \mathbin{::} \ \operatorname{Join_B}(\mathfrak{B}_{1} ,\ \mathfrak{B}_{2} )\quad \mathsf{if}\ \operatorname{JoinScope_B}(B_{1},\ B_{2})\ \ne \ \bot \ \land \ \operatorname{Join_B}(\mathfrak{B}_{1} ,\ \mathfrak{B}_{2} )\ \ne \ \bot \\[0.16em]
\quad \bot \quad \mathsf{otherwise}\ \} \\[0.16em]
\operatorname{Join_B}(\mathfrak{B}_{1} ,\ \mathfrak{B}_{2} )\ =\ \bot \quad \mathsf{if}\ \mid \mathfrak{B}_{1} \mid \ \ne \ \mid \mathfrak{B}_{2} \mid
\end{array}
$$

$$
\begin{array}{l}
\operatorname{JoinPermState}(\mathsf{Active},\ \mathsf{Active})\ =\ \mathsf{Active} \\[0.16em]
\operatorname{JoinPermState}(\_,\ \_)\ =\ \mathsf{Inactive}\quad \mathsf{otherwise}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{PermAt}(B,\ x)\ = \\[0.16em]
\ \{\ B[x]\quad \mathsf{if}\ x\ \in \ \operatorname{dom}(B) \\[0.16em]
\quad \mathsf{Active}\ \mathsf{otherwise}\ \}
\end{array}
$$

$$
\mathsf{JoinScope}\_\Pi (B_{1},\ B_{2})\ =\ \{\ x\ \mapsto \ \operatorname{JoinPermState}(\operatorname{PermAt}(B_{1},\ x),\ \operatorname{PermAt}(B_{2},\ x))\ \mid \ x\ \in \ \operatorname{dom}(B_{1})\ \cup \ \operatorname{dom}(B_{2})\ \}
$$

$$
\begin{array}{l}
\operatorname{JoinPerm}([],\ [])\ =\ [] \\[0.16em]
\operatorname{JoinPerm}(B_{1}\ \mathbin{::} \ \Pi_{1} ,\ B_{2}\ \mathbin{::} \ \Pi_{2} )\ = \\[0.16em]
\ \{\ \mathsf{JoinScope}\_\Pi (B_{1},\ B_{2})\ \mathbin{::} \ \operatorname{JoinPerm}(\Pi_{1} ,\ \Pi_{2} )\quad \mathsf{if}\ \mathsf{JoinScope}\_\Pi (B_{1},\ B_{2})\ \ne \ \bot \ \land \ \operatorname{JoinPerm}(\Pi_{1} ,\ \Pi_{2} )\ \ne \ \bot \\[0.16em]
\quad \bot \quad \mathsf{otherwise}\ \} \\[0.16em]
\operatorname{JoinPerm}(\Pi_{1} ,\ \Pi_{2} )\ =\ \bot \quad \mathsf{if}\ \mid \Pi_{1} \mid \ \ne \ \mid \Pi_{2} \mid
\end{array}
$$

### 6.3.4 Access and Binding Introduction Helpers

$$
\begin{array}{l}
\operatorname{FieldHead}(\operatorname{Identifier}(x))\ =\ \bot \\[0.16em]
\operatorname{FieldHead}(\operatorname{FieldAccess}(p,\ f))\ = \\[0.16em]
\ \{\ f\quad \mathsf{if}\ \operatorname{FieldHead}(p)\ =\ \bot \\[0.16em]
\quad \operatorname{FieldHead}(p)\quad \mathsf{otherwise}\ \} \\[0.16em]
\operatorname{FieldHead}(\operatorname{TupleAccess}(p,\ \_))\ =\ \operatorname{FieldHead}(p) \\[0.16em]
\operatorname{FieldHead}(\operatorname{IndexAccess}(p,\ \_))\ =\ \operatorname{FieldHead}(p) \\[0.16em]
\operatorname{FieldHead}(\operatorname{Deref}(p))\ =\ \bot
\end{array}
$$

$$
\begin{array}{l}
\mathsf{FieldPath}\ =\ [\mathsf{Name}] \\[0.16em]
\operatorname{FieldPathOf}(\operatorname{Identifier}(x))\ =\ [] \\[0.16em]
\operatorname{FieldPathOf}(\operatorname{FieldAccess}(p,\ f))\ =\ \operatorname{FieldPathOf}(p)\ \mathbin{++} \ [f] \\[0.16em]
\operatorname{FieldPathOf}(\operatorname{TupleAccess}(p,\ \_))\ =\ \operatorname{FieldPathOf}(p) \\[0.16em]
\operatorname{FieldPathOf}(\operatorname{IndexAccess}(p,\ \_))\ =\ \operatorname{FieldPathOf}(p) \\[0.16em]
\operatorname{FieldPathOf}(\operatorname{Deref}(p))\ =\ []
\end{array}
$$

$$
\begin{array}{l}
\operatorname{PlacePath}(p)\ = \\[0.16em]
\ \{\ (\operatorname{PlaceRoot}(p),\ [])\quad \mathsf{if}\ p\ =\ \operatorname{Identifier}(x) \\[0.16em]
\quad (\operatorname{PlaceRoot}(p),\ \operatorname{FieldPathOf}(p))\ \mathsf{otherwise}\ \}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Prefixes}([])\ =\ [[]] \\[0.16em]
\operatorname{Prefixes}([f]\ \mathbin{++} \ \mathsf{io})\ =\ [[]]\ \cup \ \{\ [f]\ \mathbin{++} \ p\ \mid \ p\ \in \ \operatorname{Prefixes}(\mathsf{io})\ \} \\[0.16em]
\operatorname{AncPaths}(p)\ =\ \{\ (\operatorname{PlaceRoot}(p),\ \mathsf{fp})\ \mid \ \mathsf{fp}\ \in \ \operatorname{Prefixes}(\operatorname{FieldPathOf}(p))\ \} \\[0.16em]
\operatorname{AccessPathOk}(\Pi ,\ p)\ \Leftrightarrow \ \forall \ k\ \in \ \operatorname{AncPaths}(p).\ \mathsf{Lookup}\_\Pi (\Pi ,\ k)\ =\ \mathsf{Active} \\[0.16em]
\operatorname{SuspendUniquePath}(\Pi ,\ \mathsf{mode},\ p)\ = \\[0.16em]
\ \{\ \operatorname{SetTop}(\Pi ,\ \operatorname{InactivateScope}(\operatorname{Top}(\Pi ),\ \operatorname{AncPaths}(p)))\quad \mathsf{if}\ \mathsf{mode}\ =\ \bot \ \land \ \operatorname{IsPlace}(p)\ \land \ \operatorname{PermOf}(\operatorname{ExprType}(p))\ =\ \texttt{unique} \\[0.16em]
\quad \Pi \quad \mathsf{otherwise}\ \} \\[0.16em]
\operatorname{SuspendUnique}(\Pi ,\ \mathsf{mode},\ e)\ = \\[0.16em]
\ \{\ \operatorname{SuspendUniquePath}(\Pi ,\ \mathsf{mode},\ e)\quad \mathsf{if}\ \operatorname{IsPlace}(e) \\[0.16em]
\quad \Pi \quad \mathsf{otherwise}\ \} \\[0.16em]
\operatorname{RemoveKeys}(\sigma ,\ D)\ =\ \{\ k\ \mapsto \ \sigma [k]\ \mid \ k\ \in \ \operatorname{dom}(\sigma )\ \land \ k\ \notin \ D\ \} \\[0.16em]
\operatorname{Reactivate}([\sigma ]\ \mathbin{++} \ \Pi ',\ D)\ =\ [\operatorname{RemoveKeys}(\sigma ,\ D)]\ \mathbin{++} \ \Pi ' \\[0.16em]
\mathsf{ArgPassKind}\ =\ \{\texttt{ref},\ \texttt{move},\ \texttt{copy}\} \\[0.16em]
\operatorname{ArgPassExpr}(\mathsf{mode},\ \mathsf{pass},\ e)\ = \\[0.16em]
\ \{\ \operatorname{MoveArgExpr}(e)\quad \mathsf{if}\ \mathsf{mode}\ =\ \texttt{move}\ \land \ \mathsf{pass}\ =\ \texttt{move} \\[0.16em]
\quad \operatorname{CopyArgExpr}(e)\quad \mathsf{if}\ \mathsf{pass}\ =\ \texttt{copy} \\[0.16em]
\quad \operatorname{MoveArgExpr}(\operatorname{CallTemp}(e))\ \mathsf{if}\ \mathsf{mode}\ =\ \texttt{move}\ \land \ \mathsf{pass}\ =\ \texttt{ref}\ \land \ \lnot \ \operatorname{HasSourceProvenance}(e) \\[0.16em]
\quad \operatorname{RefArgExpr}(e)\quad \mathsf{if}\ \mathsf{mode}\ =\ \bot \ \land \ \mathsf{pass}\ =\ \texttt{ref} \\[0.16em]
\quad e\quad \mathsf{otherwise}\ \}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{AccessStateOk}(\mathsf{Valid},\ p)\ =\ \mathsf{true} \\[0.16em]
\operatorname{AccessStateOk}(\operatorname{PartiallyMoved}(F),\ p)\ =\ (\operatorname{FieldHead}(p)\ =\ f\ \land \ f\ \notin \ F) \\[0.16em]
\operatorname{AccessStateOk}(\mathsf{Moved},\ p)\ =\ \mathsf{false} \\[0.16em]
\operatorname{PM}(\mathsf{Valid},\ f)\ =\ \operatorname{PartiallyMoved}(\{f\}) \\[0.16em]
\operatorname{PM}(\operatorname{PartiallyMoved}(F),\ f)\ =\ \operatorname{PartiallyMoved}(F\ \cup \ \{f\}) \\[0.16em]
\operatorname{PM}(\mathsf{Moved},\ f)\ =\ \bot
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ExprType}(e)\ =\ T\ \Leftrightarrow \ \Gamma ;\ R;\ L\ \vdash \ e\ :\ T \\[0.16em]
\operatorname{ExprType}(p)\ =\ T\ \Leftrightarrow \ \operatorname{IsPlace}(p)\ \land \ \Gamma ;\ R;\ L\ \vdash \ p\ :\mathsf{place}\ T
\end{array}
$$

$$
\begin{array}{l}
\operatorname{AccessOk_B}(\mathfrak{B} ,\ p)\ \Leftrightarrow \ x\ =\ \operatorname{PlaceRoot}(p)\ \land \ \operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle s,\ \_,\ \_,\ \_\rangle \ \land \ \operatorname{AccessStateOk}(s,\ p) \\[0.16em]
\mathsf{AccessOk}\_\Pi (\Pi ,\ p)\ \Leftrightarrow \ (\operatorname{PermOf}(\operatorname{ExprType}(p))\ \ne \ \texttt{unique})\ \lor \ \operatorname{AccessPathOk}(\Pi ,\ p) \\[0.16em]
\operatorname{AccessOk}(\mathfrak{B} ,\ \Pi ,\ p)\ \Leftrightarrow \ \operatorname{AccessOk_B}(\mathfrak{B} ,\ p)\ \land \ \mathsf{AccessOk}\_\Pi (\Pi ,\ p)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{MovOf}(\texttt{"="})\ =\ \mathsf{mov} \\[0.16em]
\operatorname{MovOf}(\texttt{":="})\ =\ \mathsf{immov}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{IsMoveExpr}(\operatorname{MoveExpr}(\_))\ =\ \mathsf{true} \\[0.16em]
\operatorname{IsMoveExpr}(\_)\ =\ \mathsf{false}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{IsCopyExpr}(\operatorname{CopyExpr}(\_))\ =\ \mathsf{true} \\[0.16em]
\operatorname{IsCopyExpr}(\_)\ =\ \mathsf{false}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{RespOfInit}(\mathsf{init})\ = \\[0.16em]
\ \{\ \mathsf{resp}\quad \mathsf{if}\ \lnot \ \operatorname{IsPlace}(\mathsf{init}) \\[0.16em]
\quad \mathsf{resp}\quad \mathsf{if}\ \operatorname{IsMoveExpr}(\mathsf{init}) \\[0.16em]
\quad \mathsf{resp}\quad \mathsf{if}\ \operatorname{IsCopyExpr}(\mathsf{init}) \\[0.16em]
\quad \mathsf{alias}\ \mathsf{otherwise}\ \}
\end{array}
$$

**Temporary Lifetime.**

$$
\operatorname{InitExpr}(\langle \_,\ \_,\ \_,\ \mathsf{init},\ \_\rangle )\ =\ \mathsf{init}
$$

$$
\begin{array}{l}
\operatorname{BindInitScope}(e)\ =\ \operatorname{BindScope}(s)\ \Leftrightarrow \\[0.16em]
\ (s\ =\ \operatorname{LetStmt}(\mathsf{binding})\ \land \ \operatorname{InitExpr}(\mathsf{binding})\ =\ e)\ \lor \\[0.16em]
\ (s\ =\ \operatorname{VarStmt}(\mathsf{binding})\ \land \ \operatorname{InitExpr}(\mathsf{binding})\ =\ e)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{TempScope}(e)\ = \\[0.16em]
\ \{\ \operatorname{BindInitScope}(e)\quad \mathsf{if}\ \operatorname{BindInitScope}(e)\ \ne \ \bot \\[0.16em]
\quad \operatorname{StmtScope}(\operatorname{EnclosingStmt}(e))\ \mathsf{otherwise}\ \}
\end{array}
$$

$$
\operatorname{TempValue}(e)\ \Leftrightarrow \ \lnot \ \operatorname{IsPlace}(e)
$$

$$
\begin{array}{l}
\operatorname{TempOrderList}([])\ =\ [] \\[0.16em]
\operatorname{TempOrderList}([e]\ \mathbin{++} \ \mathsf{es})\ =\ \operatorname{TempOrder}(e)\ \mathbin{++} \ \operatorname{TempOrderList}(\mathsf{es})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{TempOrder}(e)\ = \\[0.16em]
\ \{\ \operatorname{TempOrderList}(\operatorname{Children_LTR}(e))\ \mathbin{++} \ [e]\quad \mathsf{if}\ \operatorname{TempValue}(e) \\[0.16em]
\quad \operatorname{TempOrderList}(\operatorname{Children_LTR}(e))\quad \mathsf{otherwise}\ \}
\end{array}
$$

$$
\operatorname{TempOrderStmt}(s)\ =\ \operatorname{TempOrderList}(\operatorname{StmtExprs}(s))
$$

$$
\begin{array}{l}
\operatorname{ControlExpr}(\operatorname{ReturnStmt}(e))\ =\ e \\[0.16em]
\operatorname{ControlExpr}(\operatorname{BreakStmt}(e))\ =\ e \\[0.16em]
\operatorname{ControlExpr}(s)\ =\ \bot \quad \mathsf{if}\ s\ \notin \ \{\operatorname{ReturnStmt}(\_),\ \operatorname{BreakStmt}(\_)\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{TempStmtList}(s)\ =\ [\ e\ \in \ \operatorname{TempOrderStmt}(s)\ \mid \ \operatorname{TempScope}(e)\ =\ \operatorname{StmtScope}(s)\ \land \ e\ \ne \ \operatorname{ControlExpr}(s)\ ] \\[0.16em]
\operatorname{TempDropOrder}(s)\ =\ \operatorname{Rev}(\operatorname{TempStmtList}(s))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{OptList}(\bot )\ =\ [] \\[0.16em]
\operatorname{OptList}(e)\ =\ [e]\quad \mathsf{if}\ e\ \ne \ \bot
\end{array}
$$

$$
\begin{array}{l}
\operatorname{StmtExprs}(\operatorname{LetStmt}(\langle \_,\ \_,\ \_,\ \mathsf{init},\ \_\rangle ))\ =\ [\mathsf{init}] \\[0.16em]
\operatorname{StmtExprs}(\operatorname{VarStmt}(\langle \_,\ \_,\ \_,\ \mathsf{init},\ \_\rangle ))\ =\ [\mathsf{init}] \\[0.16em]
\operatorname{StmtExprs}(\operatorname{UsingLocalStmt}(\_,\ \_,\ \_))\ =\ [] \\[0.16em]
\operatorname{StmtExprs}(\operatorname{AssignStmt}(p,\ e))\ =\ [e,\ p] \\[0.16em]
\operatorname{StmtExprs}(\operatorname{CompoundAssignStmt}(p,\ \_,\ e))\ =\ [p,\ e] \\[0.16em]
\operatorname{StmtExprs}(\operatorname{ExprStmt}(e))\ =\ [e] \\[0.16em]
\operatorname{StmtExprs}(\operatorname{ReturnStmt}(e_{\mathsf{opt}}))\ =\ \operatorname{OptList}(e_{\mathsf{opt}}) \\[0.16em]
\operatorname{StmtExprs}(\operatorname{BreakStmt}(e_{\mathsf{opt}}))\ =\ \operatorname{OptList}(e_{\mathsf{opt}}) \\[0.16em]
\operatorname{StmtExprs}(\mathsf{ContinueStmt})\ =\ [] \\[0.16em]
\operatorname{StmtExprs}(\operatorname{DeferStmt}(\_))\ =\ [] \\[0.16em]
\operatorname{StmtExprs}(\operatorname{UnsafeBlockStmt}(b))\ =\ [b] \\[0.16em]
\operatorname{StmtExprs}(\operatorname{RegionStmt}(\mathsf{opts}_{\mathsf{opt}},\ \_,\ b))\ =\ [\operatorname{RegionOptsExpr}(\mathsf{opts}_{\mathsf{opt}}),\ b] \\[0.16em]
\operatorname{StmtExprs}(\operatorname{FrameStmt}(\_,\ b))\ =\ [b] \\[0.16em]
\operatorname{StmtExprs}(\operatorname{ErrorStmt}(\_))\ =\ []
\end{array}
$$

$$
\begin{array}{l}
\operatorname{StmtScope}(s)\ =\ s \\[0.16em]
\operatorname{BindScope}(s)\ =\ \operatorname{BlockOfStmt}(s) \\[0.16em]
\operatorname{EnclosingStmt}(e)\ =\ s\ \Leftrightarrow \ e\ \in \ \operatorname{SubExprs}(s)\ \land \ \forall \ s'\ \in \ \operatorname{SubStmts}(s).\ e\ \notin \ \operatorname{SubExprs}(s') \\[0.16em]
\operatorname{BlockOfStmt}(s)\ =\ b\ \Leftrightarrow \ s\ \in \ \operatorname{BlockStmts}(b)\ \land \ \forall \ b'\ \in \ \operatorname{SubBlocks}(b).\ s\ \notin \ \operatorname{BlockStmts}(b')
\end{array}
$$

$$
\operatorname{BlockStmts}(\operatorname{BlockExpr}(\mathsf{stmts},\ \_))\ =\ \mathsf{stmts}
$$

$$
\begin{array}{l}
\operatorname{StmtBlocks}(\operatorname{UnsafeBlockStmt}(b))\ =\ [b] \\[0.16em]
\operatorname{StmtBlocks}(\operatorname{DeferStmt}(b))\ =\ [b] \\[0.16em]
\operatorname{StmtBlocks}(\operatorname{RegionStmt}(\_,\ \_,\ b))\ =\ [b] \\[0.16em]
\operatorname{StmtBlocks}(\operatorname{FrameStmt}(\_,\ b))\ =\ [b] \\[0.16em]
\operatorname{StmtBlocks}(s)\ =\ []\quad \mathsf{if}\ s\ \notin \ \{\operatorname{UnsafeBlockStmt}(\_),\ \operatorname{DeferStmt}(\_),\ \operatorname{RegionStmt}(\_,\ \_,\ \_),\ \operatorname{FrameStmt}(\_,\ \_)\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{SubExprs}(s)\ =\ \operatorname{SubExprsList}(\operatorname{StmtExprs}(s)) \\[0.16em]
\operatorname{SubExprsList}([])\ =\ \emptyset \\[0.16em]
\operatorname{SubExprsList}([e]\ \mathbin{++} \ \mathsf{es})\ =\ \{e\}\ \cup \ \operatorname{SubExprsList}(\operatorname{Children_LTR}(e))\ \cup \ \operatorname{SubExprsList}(\mathsf{es})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{SubStmts}(s)\ =\ \operatorname{SubStmtsList}(\operatorname{StmtBlocks}(s)) \\[0.16em]
\operatorname{SubStmtsList}([])\ =\ \emptyset \\[0.16em]
\operatorname{SubStmtsList}([b]\ \mathbin{++} \ \mathsf{bs})\ =\ \operatorname{BlockStmts}(b)\ \cup \ \operatorname{SubStmtsSeq}(\operatorname{BlockStmts}(b))\ \cup \ \operatorname{SubStmtsList}(\mathsf{bs}) \\[0.16em]
\operatorname{SubStmtsSeq}([])\ =\ \emptyset \\[0.16em]
\operatorname{SubStmtsSeq}([s]\ \mathbin{++} \ \mathsf{ss})\ =\ \operatorname{SubStmts}(s)\ \cup \ \operatorname{SubStmtsSeq}(\mathsf{ss})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{SubBlocks}(b)\ =\ \operatorname{SubBlocksSeq}(\operatorname{BlockStmts}(b)) \\[0.16em]
\operatorname{SubBlocksSeq}([])\ =\ \emptyset \\[0.16em]
\operatorname{SubBlocksSeq}([s]\ \mathbin{++} \ \mathsf{ss})\ =\ \operatorname{StmtBlocks}(s)\ \cup \ (\bigcup \_\{b'\ \in \ \operatorname{StmtBlocks}(s)\}\ \operatorname{SubBlocks}(b'))\ \cup \ \operatorname{SubBlocksSeq}(\mathsf{ss})
\end{array}
$$

$$
\operatorname{Entries}(B)\ =\ [\langle x_{1},\ B[x_{1}]\rangle ,\ \ldots ,\ \langle x_{n},\ B[x_{n}]\rangle ]\ \Leftrightarrow \ [x_{1},\ \ldots ,\ x_{n}]\ \mathsf{enumerates}\ \operatorname{dom}(B)\ \mathsf{without}\ \mathsf{repetition}
$$

$$
\operatorname{MapUnion}(M_{1},\ M_{2})\ =\ \{\ x\ \mapsto \ (M_{2}[x]\ \mathsf{if}\ x\ \in \ \operatorname{dom}(M_{2})\ \mathsf{else}\ M_{1}[x])\ \mid \ x\ \in \ \operatorname{dom}(M_{1})\ \cup \ \operatorname{dom}(M_{2})\ \}
$$

$$
\operatorname{IntroAll_B}([\sigma ]\ \mathbin{++} \ \mathfrak{B} ',\ B)\ =\ [\operatorname{MapUnion}(\sigma ,\ B)]\ \mathbin{++} \ \mathfrak{B} '
$$

$$
\operatorname{BindInfoMap}(f,\ B,\ \mathsf{mv},\ \mathsf{mut})\ =\ \{\ x\ \mapsto \ \langle \mathsf{Valid},\ \operatorname{MovEff}(\mathsf{mv},\ \operatorname{f}(B[x])),\ \mathsf{mut},\ \operatorname{f}(B[x])\rangle \ \mid \ x\ \in \ \operatorname{dom}(B)\ \}
$$

$$
\begin{array}{l}
\operatorname{MovEff}(\mathsf{mv},\ \mathsf{resp})\ =\ \mathsf{mv} \\[0.16em]
\operatorname{MovEff}(\mathsf{mv},\ \mathsf{alias})\ =\ \mathsf{immov}
\end{array}
$$

$$
\begin{array}{l}
T_{\mathsf{Region}}\ =\ \operatorname{TypeModalState}([\texttt{Region}],\ \texttt{Active}) \\[0.16em]
\operatorname{RegionBindName}(\Gamma ,\ \mathsf{alias}_{\mathsf{opt}})\ = \\[0.16em]
\ \{\ \mathsf{alias}_{\mathsf{opt}}\quad \mathsf{if}\ \mathsf{alias}_{\mathsf{opt}}\ \ne \ \bot \\[0.16em]
\quad \operatorname{FreshRegion}(\Gamma )\quad \mathsf{otherwise}\ \} \\[0.16em]
\operatorname{RegionBindMap}(\Gamma ,\ \mathsf{alias}_{\mathsf{opt}})\ =\ \{\ r\ \mapsto \ T_{\mathsf{Region}}\ \mid \ r\ =\ \operatorname{RegionBindName}(\Gamma ,\ \mathsf{alias}_{\mathsf{opt}})\ \} \\[0.16em]
\operatorname{RegionBindInfo}(\Gamma ,\ \mathsf{alias}_{\mathsf{opt}})\ =\ \operatorname{BindInfoMap}(\lambda \ U.\ \mathsf{resp},\ \operatorname{RegionBindMap}(\Gamma ,\ \mathsf{alias}_{\mathsf{opt}}),\ \mathsf{mov},\ \texttt{let}) \\[0.16em]
\operatorname{FrameBindInfo}(\Gamma )\ =\ \operatorname{RegionBindInfo}(\Gamma ,\ \bot )
\end{array}
$$

$$
\operatorname{Names}(B)\ =\ \operatorname{dom}(B)
$$

$$
\begin{array}{l}
\operatorname{JoinAll_B}([])\ =\ \bot \\[0.16em]
\operatorname{JoinAll_B}([\mathfrak{B} ])\ =\ \mathfrak{B} \\[0.16em]
\operatorname{JoinAll_B}(\mathfrak{B}_{1} \ \mathbin{::} \ \mathfrak{B}_{2} \ \mathbin{::} \ \mathsf{rest})\ =\ \operatorname{JoinAll_B}([\operatorname{Join_B}(\mathfrak{B}_{1} ,\ \mathfrak{B}_{2} )]\ \mathbin{++} \ \mathsf{rest})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{JoinAllPerm}([])\ =\ \bot \\[0.16em]
\operatorname{JoinAllPerm}([\Pi ])\ =\ \Pi \\[0.16em]
\operatorname{JoinAllPerm}(\Pi_{1} \ \mathbin{::} \ \Pi_{2} \ \mathbin{::} \ \mathsf{rest})\ =\ \operatorname{JoinAllPerm}([\operatorname{JoinPerm}(\Pi_{1} ,\ \Pi_{2} )]\ \mathbin{++} \ \mathsf{rest})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Top}([\sigma ]\ \mathbin{++} \ \Pi ')\ =\ \sigma \\[0.16em]
\operatorname{SetTop}([\sigma ]\ \mathbin{++} \ \Pi ',\ \sigma ')\ =\ [\sigma ']\ \mathbin{++} \ \Pi ' \\[0.16em]
\operatorname{InactivateScope}(\sigma ,\ K)\ =\ \{\ x\ \mapsto \ (\mathsf{Inactive}\ \mathsf{if}\ x\ \in \ K\ \mathsf{else}\ \sigma [x])\ \mid \ x\ \in \ \operatorname{dom}(\sigma )\ \cup \ K\ \} \\[0.16em]
\operatorname{Roots}(\Pi_{2} ,\ \Pi_{1} )\ =\ \{\ k\ \mid \ \operatorname{Top}(\Pi_{2} )[k]\ =\ \mathsf{Inactive}\ \land \ \mathsf{Lookup}\_\Pi (\Pi_{1} ,\ k)\ =\ \mathsf{Active}\ \}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ConsumeOnMove}(\mathfrak{B} ,\ e)\ = \\[0.16em]
\ \{\ \operatorname{Update_B}(\mathfrak{B} ,\ x,\ \langle \mathsf{Moved},\ \mathsf{mv},\ \mathsf{mut},\ \mathsf{resp}\rangle )\quad \mathsf{if}\ \operatorname{IsMoveExpr}(e)\ \land \ x\ =\ \operatorname{PlaceRoot}(\operatorname{MoveInner}(e))\ \land \ \operatorname{Lookup_B}(\mathfrak{B} ,\ x)\ =\ \langle s,\ \mathsf{mv},\ \mathsf{mut},\ \mathsf{resp}\rangle \\[0.16em]
\quad \mathfrak{B} \quad \mathsf{otherwise}\ \}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{MoveInner}(\operatorname{MoveExpr}(p))\ =\ p \\[0.16em]
\operatorname{CopyInner}(\operatorname{CopyExpr}(e))\ =\ e
\end{array}
$$

$$
\mathsf{BJudgment}\ =\ \{\Gamma ;\ \mathfrak{B} ;\ \Pi \ \vdash \ e\ \Rightarrow \ \mathfrak{B} '\ \triangleright \ \Pi ',\ \Gamma ;\ \mathfrak{B} ;\ \Pi \ \vdash \ s\ \Rightarrow \ \mathfrak{B} '\ \triangleright \ \Pi '\}
$$

$$
\begin{array}{l}
\operatorname{StaticBindTypesMod}(P,\ m)\ =\ \mathbin{++} \_\{\mathsf{item}\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items},\ \mathsf{item}\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \mathsf{binding},\ \_,\ \_)\}\ \operatorname{StaticBindTypes}(\mathsf{binding}) \\[0.16em]
\operatorname{StaticBindInfo}(\mathsf{item})\ =\ \operatorname{BindInfoMap}(\lambda \ U.\ \operatorname{RespOfInit}(\mathsf{init}),\ \operatorname{StaticBindTypes}(\mathsf{binding}),\ \operatorname{MovOf}(\mathsf{op}),\ \mathsf{mut})\ \Leftrightarrow \ \mathsf{item}\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \mathsf{mut},\ \mathsf{binding},\ \_,\ \_)\ \land \ \mathsf{binding}\ =\ \langle \_,\ \_,\ \mathsf{op},\ \mathsf{init},\ \_\rangle \\[0.16em]
\operatorname{StaticBindMap}(P,\ m)\ =\ \mathbin{++} \_\{\mathsf{item}\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items},\ \mathsf{item}\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_)\}\ \operatorname{StaticBindInfo}(\mathsf{item})
\end{array}
$$

**Procedure Entry.**

$$
\begin{array}{l}
\mathfrak{B}_{\mathsf{global}} \ =\ \operatorname{IntroAll_B}(\operatorname{PushScope_B}(\mathfrak{B} ),\ \operatorname{StaticBindMap}(\operatorname{Project}(\Gamma ),\ m)) \\[0.16em]
\mathfrak{B}_{\mathsf{proc}} \ =\ \operatorname{IntroAll_B}(\operatorname{PushScope_B}(\mathfrak{B}_{\mathsf{global}} ),\ \operatorname{ParamBindMap}(\mathsf{params})) \\[0.16em]
\operatorname{ParamBindMap}([])\ =\ \emptyset \\[0.16em]
\operatorname{ParamBindMap}([\langle \mathsf{mode},\ x,\ T\rangle ]\ \mathbin{++} \ \mathsf{ps})\ =\ \operatorname{MapUnion}(\operatorname{ParamBindMap}(\mathsf{ps}),\ \{\ x\ \mapsto \ \langle \mathsf{Valid},\ \operatorname{ParamMov}(\mathsf{mode}),\ \texttt{let},\ \operatorname{ParamResp}(\mathsf{mode})\rangle \ \}) \\[0.16em]
\operatorname{MethodParamBindMap}(\mathsf{base},\ \mathsf{name})\ =\ \operatorname{ParamBindMap}(\operatorname{RecvParams}(\mathsf{base},\ \mathsf{name})) \\[0.16em]
\operatorname{ParamTypeMap}([])\ =\ \emptyset \\[0.16em]
\operatorname{ParamTypeMap}([\langle \mathsf{mode},\ x,\ T\rangle ]\ \mathbin{++} \ \mathsf{ps})\ =\ \operatorname{MapUnion}(\operatorname{ParamTypeMap}(\mathsf{ps}),\ \{\ x\ \mapsto \ T\ \}) \\[0.16em]
\operatorname{ParamMov}(\texttt{move})\ =\ \mathsf{mov}\quad \operatorname{ParamMov}(\bot )\ =\ \mathsf{immov} \\[0.16em]
\operatorname{ParamResp}(\texttt{move})\ =\ \mathsf{resp}\quad \operatorname{ParamResp}(\bot )\ =\ \mathsf{alias}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Init_B}(m,\ \mathsf{params})\ =\ \operatorname{IntroAll_B}(\operatorname{PushScope_B}(\operatorname{IntroAll_B}(\operatorname{PushScope_B}([]),\ \operatorname{StaticBindMap}(\operatorname{Project}(\Gamma ),\ m))),\ \operatorname{ParamBindMap}(\mathsf{params})) \\[0.16em]
\mathsf{Init}\_\Pi (m,\ \mathsf{params})\ =\ [\{\ x\ \mapsto \ \mathsf{Active}\ \mid \ (x:T)\ \in \ \operatorname{ParamTypeMap}(\mathsf{params})\ \land \ \operatorname{PermOf}(T)\ =\ \texttt{unique}\ \}]\ \mathbin{++} \ [\{\ x\ \mapsto \ \mathsf{Active}\ \mid \ (x:T)\ \in \ \operatorname{StaticBindTypesMod}(\operatorname{Project}(\Gamma ),\ m)\ \land \ \operatorname{PermOf}(T)\ =\ \texttt{unique}\ \}]
\end{array}
$$

$$
\operatorname{BindCheck}(m,\ \mathsf{params},\ \mathsf{body})\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \Gamma ;\ \operatorname{Init_B}(m,\ \mathsf{params});\ \mathsf{Init}\_\Pi (m,\ \mathsf{params})\ \vdash \ \mathsf{body}\ \Rightarrow \ \mathfrak{B} '\ \triangleright \ \Pi '
$$

$$
\operatorname{ProcBindCheck}(m,\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \mathsf{params},\ \_,\ \_,\ \mathsf{body},\ \_,\ \_))\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \operatorname{BindCheck}(m,\ \mathsf{params},\ \mathsf{body})\ \Downarrow \ \mathsf{ok}
$$

$$
\begin{array}{l}
\operatorname{MethodParamsDecl}(T,\ m)\ =\ [\langle \operatorname{RecvMode}(m.\mathsf{receiver}),\ \texttt{self},\ \operatorname{RecvType}(T,\ m.\mathsf{receiver})\rangle ]\ \mathbin{++} \ m.\mathsf{params} \\[0.16em]
\operatorname{MethodBindCheck}(m,\ T,\ \mathsf{md})\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \mathsf{md}.\mathsf{body}\ =\ \mathsf{body}\ \land \ \operatorname{BindCheck}(m,\ \operatorname{MethodParamsDecl}(T,\ \mathsf{md}),\ \mathsf{body})\ \Downarrow \ \mathsf{ok} \\[0.16em]
\operatorname{ClassMethodBindCheck}(m,\ \mathsf{Cl},\ \mathsf{md})\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \mathsf{md}.\mathsf{body}_{\mathsf{opt}}\ =\ \mathsf{body}\ \land \ \operatorname{BindCheck}(m,\ \operatorname{ClassMethodParams}(\mathsf{Cl},\ \mathsf{md}),\ \mathsf{body})\ \Downarrow \ \mathsf{ok} \\[0.16em]
\operatorname{StateMethodBindCheck}(m,\ M,\ S,\ \mathsf{md})\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \mathsf{md}.\mathsf{body}\ =\ \mathsf{body}\ \land \ \operatorname{BindCheck}(m,\ \operatorname{StateMethodParams}(M,\ S,\ \mathsf{md}),\ \mathsf{body})\ \Downarrow \ \mathsf{ok} \\[0.16em]
\operatorname{TransitionBindCheck}(m,\ M,\ S,\ \mathsf{tr})\ \Downarrow \ \mathsf{ok}\ \Leftrightarrow \ \mathsf{tr}.\mathsf{body}\ =\ \mathsf{body}\ \land \ \operatorname{BindCheck}(m,\ \operatorname{TransitionParams}(M,\ S,\ \mathsf{tr}),\ \mathsf{body})\ \Downarrow \ \mathsf{ok}
\end{array}
$$

$$
\mathsf{BindDiagRefs}\ =\ \{\texttt{"8.2"},\ \texttt{"8.7"},\ \texttt{"8.10"}\}
$$

This chapter defines only the environments and helper operations. Feature-specific `BJudgment` clauses are owned by the consuming chapters.
