---
title: "15.8 Verification Logic"
description: "15.8 Verification Logic from 15. Procedures and Contracts of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "procedures-and-contracts"
specSection: "158-verification-logic"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/procedures-and-contracts/">15. Procedures and Contracts</a>
  <span>Procedures and Contracts</span>
</div>

## 15.8 Verification Logic

### 15.8.1 Syntax

No surface syntax is introduced by the verification framework.

### 15.8.2 Parsing

Verification logic is not parser-owned.

### 15.8.3 AST Representation / Form

$$
\mathsf{ContractKind}\ =\ \{\mathsf{Pre},\ \mathsf{Post},\ \mathsf{TypeInv},\ \mathsf{LoopInv},\ \mathsf{ForeignPre},\ \mathsf{ForeignPost}\}
$$

$$
\mathsf{VerificationFact}\ =\ \operatorname{F}(P,\ L,\ S)
$$

$$
\mathsf{CheckState}\ =\ \{\operatorname{CheckStart}(P,\ k,\ s,\ \rho ,\ \sigma ),\ \operatorname{CheckDone}(\sigma ),\ \operatorname{CheckPanic}(\sigma )\}
$$

$$
\operatorname{ContractCheck}(P,\ k,\ s,\ \rho )\ =\ \texttt{if}\ !P[\rho ]\ \{\ \texttt{panic}(\operatorname{ContractViolation}(k,\ P,\ s))\ \}
$$

### 15.8.4 Static Semantics

$$
\begin{array}{l}
\operatorname{DynamicScope}(s)\ \Leftrightarrow \ (\exists \ d.\ \operatorname{DynamicDecl}(d)\ \land \ s\ \subseteq \ d.\mathsf{span})\ \lor \ (\exists \ e.\ \operatorname{DynamicExpr}(e)\ \land \ s\ \subseteq \ \operatorname{ExprSpan}(e)) \\[0.16em]
\mathsf{InDynamicContext}\ \Leftrightarrow \ \operatorname{DynamicScope}(s)\ \mathsf{where}\ \texttt{s}\ \mathsf{is}\ \mathsf{the}\ \mathsf{span}\ \mathsf{of}\ \mathsf{the}\ \mathsf{syntactic}\ \mathsf{form}\ \mathsf{currently}\ \mathsf{being}\ \mathsf{verified}\ \mathsf{or}\ \mathsf{type}-\mathsf{checked}.
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ComputeDynamicContext}(s,\ \mathsf{ancestors})\ = \\[0.16em]
\ \mathsf{let}\ \mathsf{enclosing}_{\mathsf{dynamic}}\ =\ \operatorname{FindInnermostDynamic}(s,\ \mathsf{ancestors}) \\[0.16em]
\ \mathsf{match}\ \mathsf{enclosing}_{\mathsf{dynamic}}\ \{ \\[0.16em]
\quad \bot \quad \to \ \mathsf{false} \\[0.16em]
\quad \operatorname{Some}(\_)\ \to \ \mathsf{true} \\[0.16em]
\ \}
\end{array}
$$

**(Contract-Static-OK)**

$$
\begin{array}{l}
\operatorname{StaticProofAt}(S,\ \Gamma_{S} ,\ P) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
P\ :\ \mathsf{verified}
\end{array}
$$

**(Contract-Static-Fail)**

$$
\begin{array}{l}
\lnot \ \operatorname{StaticProofAt}(S,\ \Gamma_{S} ,\ P)\quad \lnot \ \mathsf{InDynamicContext} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{program}\ \mathsf{is}\ \mathsf{ill}-\mathsf{formed}
\end{array}
$$

**(Contract-Dynamic-Elide)**

$$
\begin{array}{l}
\operatorname{StaticProofAt}(S,\ \Gamma_{S} ,\ P) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
P\ :\ \mathsf{verified}
\end{array}
$$

**(Contract-Dynamic-Check)**

$$
\begin{array}{l}
\lnot \ \operatorname{StaticProofAt}(S,\ \Gamma_{S} ,\ P)\quad \mathsf{InDynamicContext} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{emit}\ \mathsf{runtime}\ \mathsf{check}\ \operatorname{ContractCheck}(P,\ k,\ s,\ \rho )
\end{array}
$$

Mandatory proof techniques:

1. Constant propagation
2. Linear integer reasoning
3. Boolean algebra
4. Control flow analysis
5. Type-derived bounds
6. Verification facts

For this section, `Gamma_S` denotes the active proof context at program point
`S`, written `ProofContextAt(S)`.

Let `FlowFactsAt(S) = { P | F(P, L) ∈ Facts ∧ L dom S }`.

Let `ContractFactsAt(S)` be the set of conjuncts imported from the enclosing
procedure contract precondition that remain in scope at `S`.

Let `ProofContextAt(S) = FlowFactsAt(S) ∪ ContractFactsAt(S)`.

**(Fact-Call-Postcondition)**

$$
\begin{array}{l}
\operatorname{StaticallyResolvedCall}(c,\ f)\quad f.\mathsf{postcondition}\ =\ P_{\mathsf{post}}\quad \operatorname{CallReturnsNormally}(c)\quad \operatorname{StableSubst}(c.\mathsf{args},\ f.\mathsf{params},\ \theta )\quad \operatorname{ResultSubst}(c,\ @\mathsf{result},\ \theta )\ =\ \theta ' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ProofContextAfter}(c)\ =\ \operatorname{ProofContextBefore}(c)\ \cup \ \operatorname{Facts}(P_{\mathsf{post}}[\theta '])
\end{array}
$$

Dynamic contract checks establish runtime behavior on the checked execution path.
They create compile-time facts for later proof only through
`Fact-Call-Postcondition`, which requires static callee identity, stable
substitutions, and normal return.

$$
\texttt{Decidable(P)}\ \mathsf{is}\ \mathsf{the}\ \mathsf{smallest}\ \mathsf{set}\ \mathsf{closed}\ \mathsf{under}:
$$

1. `true`, `false`
2. Comparisons of linear integer expressions over literals and variables
3. Syntactic equality up to alpha-renaming between identifiers and literal constants
4. Boolean combinations using `!`, `&&`, `||`

Entailment:

**(Ent-True)**

$$
\begin{array}{l}
P\ \equiv \ \texttt{true} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ProofContextAt}(S)\ \vdash \ P
\end{array}
$$

**(Ent-Fact)**

$$
\begin{array}{l}
P\ \in \ \operatorname{ProofContextAt}(S) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ProofContextAt}(S)\ \vdash \ P
\end{array}
$$

**(Ent-And)**

$$
\begin{array}{l}
\operatorname{ProofContextAt}(S)\ \vdash \ P\quad \operatorname{ProofContextAt}(S)\ \vdash \ Q \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ProofContextAt}(S)\ \vdash \ P\ \land \ Q
\end{array}
$$

**(Ent-Or-L)**

$$
\begin{array}{l}
\operatorname{ProofContextAt}(S)\ \vdash \ P \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ProofContextAt}(S)\ \vdash \ P\ \lor \ Q
\end{array}
$$

**(Ent-Or-R)**

$$
\begin{array}{l}
\operatorname{ProofContextAt}(S)\ \vdash \ Q \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ProofContextAt}(S)\ \vdash \ P\ \lor \ Q
\end{array}
$$

**(Ent-Linear)**
LinearEntails(ProofContextAt(S), P)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{ProofContextAt}(S)\ \vdash \ P
\end{array}
$$

**Linear Integer Entailment**

Let `LinExpr` be expressions of the form `∑_i a_i x_i + c` where `a_i, c ∈ ℤ` and each `x_i` is an integer-typed variable.

Let `LinPred` be predicates comparing two `LinExpr` with `==`, `!=`, `<`, `<=`, `>`, or `>=`.

$$
\mathsf{Define}\ \texttt{LinFactsAt(S) = \{ P in ProofContextAt(S) | P in LinPred \}}.
$$

Then:

$$
\operatorname{LinearEntails}(\operatorname{ProofContextAt}(S),\ P)\ \Leftrightarrow \ P\ \in \ \mathsf{LinPred}\ \land \ \bigwedge \ \operatorname{LinFactsAt}(S)\ \models \_\mathbb{Z} \ P
$$

Implementations MAY use any sound decision procedure; they MUST be complete for `LinPred` entailment.

$$
\operatorname{StaticProofAt}(S,\ \operatorname{ProofContextAt}(S),\ P)\ \Leftrightarrow \ \operatorname{Decidable}(P)\ \land \ \operatorname{ProofContextAt}(S)\ \vdash \ P
$$

$$
\mathsf{Define}\ \texttt{NegFact(P)}\ \mathsf{on}\ \mathsf{simple}\ \mathsf{decidable}\ \mathsf{predicates}\ \mathsf{by}:
$$

1. `NegFact(!P) = P`
2. `NegFact(a < b) = (a >= b)`
3. `NegFact(a <= b) = (a > b)`
4. `NegFact(a > b) = (a <= b)`
5. `NegFact(a >= b) = (a < b)`
6. `NegFact(a == b) = (a != b)`
7. `NegFact(a != b) = (a == b)`
8. `NegFact(P)` is undefined otherwise

Verification facts:

1. Have zero runtime size.
2. Have no runtime representation.
3. MUST NOT be stored, passed, or returned.

**(Fact-Dominate)**

$$
\begin{array}{l}
\operatorname{F}(P,\ L)\ \in \ \mathsf{Facts}\quad L\ \mathsf{dom}\ S\quad L\ \ne \ S \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
P\ \mathsf{satisfied}\ \mathsf{at}\ S
\end{array}
$$

Fact generation:

1. `if P { ... }` generates `F(P, _)` on then-branch entry.
2. `if P { ... } else { ... }` generates `F(NegFact(P), _)` on else-branch
   entry whenever `NegFact(P)` is defined.
3. `if P { return ... }`, `if P { break ... }`, and `if P { continue ... }`
   generate `F(NegFact(P), _)` on the subsequent fallthrough path whenever
   `NegFact(P)` is defined.
4. A satisfied `if ... is` pattern generates pattern facts on selected-body entry.
5. A runtime check for `P` generates `F(P, _)` after the check.
6. A verified loop invariant generates `F(Inv, _)` after the loop.

Type narrowing under an active fact `F(P, L)` refines `typeof(x)` to `typeof(x) |: {P}`.

### 15.8.5 Dynamic Semantics

Contract environments:

1. `ρ_emptyset = ∅`
2. `ρ_post = EntryCapture(f, σ_entry) ∪ { @result ↦ v_r }`
3. `ρ_foreign_post = { @result ↦ v_r }`

**(Check-True)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(P[\rho ],\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{true}),\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{CheckStart}(P,\ k,\ s,\ \rho ,\ \sigma )\rangle \ \to \ \langle \operatorname{CheckDone}(\sigma ')\rangle 
\end{array}
$$

**(Check-False)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(P[\rho ],\ \sigma )\ \Downarrow \ (\operatorname{Val}(\mathsf{false}),\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{CheckStart}(P,\ k,\ s,\ \rho ,\ \sigma )\rangle \ \to \ \langle \operatorname{CheckPanic}(\sigma ')\rangle 
\end{array}
$$

**(Check-Panic)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{EvalSigma}(P[\rho ],\ \sigma )\ \Downarrow \ (\operatorname{Ctrl}(\mathsf{Panic}),\ \sigma ') \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{CheckStart}(P,\ k,\ s,\ \rho ,\ \sigma )\rangle \ \to \ \langle \operatorname{CheckPanic}(\sigma ')\rangle 
\end{array}
$$

**(Check-Ok)**

$$
\begin{array}{l}
\langle \operatorname{CheckStart}(P,\ k,\ s,\ \rho ,\ \sigma )\rangle \ \to *\ \langle \operatorname{CheckDone}(\sigma ')\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ContractCheck}(P,\ k,\ s,\ \rho ,\ \sigma )\ \Downarrow \ \sigma '
\end{array}
$$

**(Check-Fail)**

$$
\begin{array}{l}
\langle \operatorname{CheckStart}(P,\ k,\ s,\ \rho ,\ \sigma )\rangle \ \to *\ \langle \operatorname{CheckPanic}(\sigma ')\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ContractCheck}(P,\ k,\ s,\ \rho ,\ \sigma )\ \Uparrow \ \mathsf{panic}
\end{array}
$$

Successful dynamic checks inject the corresponding verification fact after the inserted check.

### 15.8.6 Lowering

Runtime check insertion points:

**(Insert-Precondition-Check)**

$$
\begin{array}{l}
f\ \mathsf{has}\ \mathsf{contract}\ \mid :\ P\quad \operatorname{InDynamicContext}(f)\quad \lnot \ \operatorname{StaticProof}(\Gamma_{\mathsf{entry}} ,\ P) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{At}\ \mathsf{entry}\ \mathsf{to}\ f,\ \mathsf{insert}:\ \operatorname{ContractCheck}(P,\ \mathsf{Pre},\ \operatorname{span}(\mathsf{contract}),\ \rho_{\mathsf{emptyset}} )
\end{array}
$$

**(Insert-Postcondition-Check)**

$$
\begin{array}{l}
f\ \mathsf{has}\ \mathsf{contract}\ \mid :\ P_{\mathsf{pre}}\ \mid =\ P_{\mathsf{post}}\quad \operatorname{InDynamicContext}(f)\quad \lnot \ \operatorname{StaticProof}(\Gamma_{\mathsf{exit}} ,\ P_{\mathsf{post}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{Before}\ \mathsf{each}\ \mathsf{return}\ \mathsf{from}\ f\ \mathsf{with}\ \mathsf{value}\ v,\ \mathsf{insert}:\ \operatorname{ContractCheck}(P_{\mathsf{post}},\ \mathsf{Post},\ \operatorname{span}(\mathsf{contract}),\ \rho_{\mathsf{post}} )
\end{array}
$$

**(Insert-TypeInv-Construction-Check)**

$$
\begin{array}{l}
T\ \mathsf{has}\ \mathsf{invariant}\ \mid :\ \{P\}\quad \operatorname{InDynamicContext}(\mathsf{construction}_{\mathsf{site}})\quad \lnot \ \operatorname{StaticProof}(\Gamma ,\ P[v/\mathsf{self}]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{After}\ \mathsf{constructing}\ \mathsf{value}\ v\ \mathsf{of}\ \mathsf{type}\ T,\ \mathsf{insert}:\ \operatorname{ContractCheck}(P[v/\mathsf{self}],\ \mathsf{TypeInv},\ \operatorname{span}(\mathsf{invariant}),\ \rho_{\mathsf{emptyset}} )
\end{array}
$$

**(Insert-TypeInv-PreCall-Check)**

$$
\begin{array}{l}
T\ \mathsf{has}\ \mathsf{invariant}\ \mid :\ \{P\}\quad m\ \mathsf{is}\ \mathsf{public}\ \mathsf{method}\ \mathsf{with}\ \mathsf{receiver}\ \sim{}\quad \operatorname{InDynamicContext}(\mathsf{call}_{\mathsf{site}})\quad \lnot \ \operatorname{StaticProof}(\Gamma ,\ P[\mathsf{self}/\mathsf{self}]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{Before}\ \mathsf{call}\ \mathsf{to}\ \mathsf{self}\sim{}>\operatorname{m}(\ldots ),\ \mathsf{insert}:\ \operatorname{ContractCheck}(P,\ \mathsf{TypeInv},\ \operatorname{span}(\mathsf{invariant}),\ \rho_{\mathsf{emptyset}} )
\end{array}
$$

**(Insert-TypeInv-PostCall-Check)**

$$
\begin{array}{l}
T\ \mathsf{has}\ \mathsf{invariant}\ \mid :\ \{P\}\quad m\ \mathsf{is}\ \mathsf{method}\ \mathsf{with}\ \mathsf{receiver}\ \sim{}!\quad \operatorname{InDynamicContext}(\mathsf{call}_{\mathsf{site}})\quad \lnot \ \operatorname{StaticProof}(\Gamma ,\ P[\mathsf{self}/\mathsf{self}]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{After}\ \mathsf{return}\ \mathsf{from}\ \mathsf{self}\sim{}>\operatorname{m}(\ldots ),\ \mathsf{insert}:\ \operatorname{ContractCheck}(P,\ \mathsf{TypeInv},\ \operatorname{span}(\mathsf{invariant}),\ \rho_{\mathsf{emptyset}} )
\end{array}
$$

**(Insert-LoopInv-Init-Check)**

$$
\begin{array}{l}
\mathsf{loop}\ \ldots \ \mid :\ \{I\}\quad \operatorname{InDynamicContext}(\mathsf{loop}_{\mathsf{site}})\quad \lnot \ \operatorname{StaticProof}(\Gamma_{\mathsf{loop}} \_\mathsf{entry},\ I) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{Before}\ \mathsf{first}\ \mathsf{iteration},\ \mathsf{insert}:\ \operatorname{ContractCheck}(I,\ \mathsf{LoopInv},\ \operatorname{span}(\mathsf{invariant}),\ \rho_{\mathsf{emptyset}} )
\end{array}
$$

**(Insert-LoopInv-Maintenance-Check)**

$$
\begin{array}{l}
\mathsf{loop}\ \ldots \ \mid :\ \{I\}\quad \operatorname{InDynamicContext}(\mathsf{loop}_{\mathsf{site}})\quad \lnot \ \operatorname{StaticProof}(\Gamma_{\mathsf{loop}} \_\mathsf{body}_{\mathsf{exit}},\ I) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{At}\ \mathsf{end}\ \mathsf{of}\ \mathsf{each}\ \mathsf{iteration},\ \mathsf{insert}:\ \operatorname{ContractCheck}(I,\ \mathsf{LoopInv},\ \operatorname{span}(\mathsf{invariant}),\ \rho_{\mathsf{emptyset}} )
\end{array}
$$

**(Insert-Refinement-Check)**

$$
\begin{array}{l}
e\ :\ T\ \mid :\ \{P\}\quad \operatorname{InDynamicContext}(e)\quad \lnot \ \operatorname{StaticProof}(\Gamma ,\ P[e/\mathsf{self}]) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\mathsf{After}\ \mathsf{evaluating}\ e,\ \mathsf{insert}:\ \operatorname{ContractCheck}(P[e/\mathsf{self}],\ \mathsf{TypeInv},\ \operatorname{span}(\mathsf{refinement}),\ \rho_{\mathsf{emptyset}} )
\end{array}
$$

### 15.8.7 Diagnostics

Diagnostics are defined for predicates that fail required static proof outside dynamic context and for runtime contract-check failures, including panic payload construction from the contract kind, predicate text, and source span.
