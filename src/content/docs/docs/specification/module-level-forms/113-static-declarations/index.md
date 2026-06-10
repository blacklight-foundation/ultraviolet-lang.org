---
title: "11.3 Static Declarations"
description: "11.3 Static Declarations from 11. Module-Level Forms of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "module-level-forms"
specSection: "113-static-declarations"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/module-level-forms/">11. Module-Level Forms</a>
  <span>Module-Level Forms</span>
</div>

## 11.3 Static Declarations

### 11.3.1 Syntax

```text
static_decl  ::= attribute_list? visibility? ("let" | "var") binding_decl
binding_decl ::= pattern (":" type)? binding_op expression
```

This chapter uses `StaticDecl` for top-level `let` and `var` items.

### 11.3.2 Parsing

`StaticDecl` is parsed by the item parser. Pattern and initializer parsing reuse the shared binding parser.

**(Parse-Static-Decl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{Tok}(P_{1})\ =\ \operatorname{Keyword}(\mathsf{kw})\quad \mathsf{kw}\ \in \ \{\texttt{let},\ \texttt{var}\}\quad \mathsf{mut}\ =\ \mathsf{kw}\quad \Gamma \ \vdash \ \operatorname{ParseBindingAfterLetVar}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{bind}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseItem}(P)\ \Downarrow \ (P_{2},\ \langle \mathsf{StaticDecl},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{bind},\ \operatorname{SpanBetween}(P,\ P_{2}),\ []\rangle )
\end{array}
$$

### 11.3.3 AST Representation / Form

$$
\mathsf{StaticDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \mathsf{binding},\ \mathsf{span},\ \mathsf{doc}\rangle
$$

$$
\mathsf{mut}\ \in \ \{\texttt{let},\ \texttt{var}\}
$$

### 11.3.4 Static Semantics

Top-level `let` and `var` declarations are module-scope bindings. Their names are derived from the bound pattern.

$$
\operatorname{StaticVisOk}(\mathsf{vis},\ \mathsf{mut})\ \Leftrightarrow \ \lnot \ (\mathsf{vis}\ =\ \texttt{public}\ \land \ \mathsf{mut}\ =\ \texttt{var})
$$

Rule **(Bind-Static)** is defined once by §7.5.

**(WF-StaticDecl)**

$$
\begin{array}{l}
\mathsf{binding}\ =\ \langle \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \_\rangle \quad \operatorname{StaticVisOk}(\mathsf{vis},\ \mathsf{mut})\quad \mathsf{ty}_{\mathsf{opt}}\ =\ T_{a}\quad \Gamma ;\ \bot ;\ \bot \ \vdash \ \mathsf{init}\ \Leftarrow \ T_{a}\ \dashv \ \emptyset \quad \Gamma \ \vdash \ \mathsf{pat}\ \Leftarrow \ T_{a}\ \dashv \ B\quad \operatorname{Distinct}(\operatorname{PatNames}(\mathsf{pat})) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{StaticDecl}\ :\ \mathsf{ok}
\end{array}
$$

**(WF-StaticDecl-Ann-Mismatch)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticDecl}(\_,\ \mathsf{vis},\ \mathsf{mut},\ \langle \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \_\rangle ,\ \_,\ \_)\quad \mathsf{ty}_{\mathsf{opt}}\ =\ T_{a}\quad \Gamma ;\ \bot ;\ \bot \ \vdash \ \mathsf{init}\ \Rightarrow \ T_{i}\ \dashv \ C\quad \operatorname{Solve}(C)\ \Downarrow \ \theta \quad \lnot (\Gamma \ \vdash \ \theta (T_{i})\ \mathrel{<:} \ T_{a})\quad c\ =\ \operatorname{Code}(\mathsf{WF}-\mathsf{StaticDecl}-\mathsf{Ann}-\mathsf{Mismatch}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{item}\ \Uparrow \ c
\end{array}
$$

**(WF-StaticDecl-MissingType)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \langle \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \_\rangle ,\ \_,\ \_)\quad \mathsf{ty}_{\mathsf{opt}}\ =\ \bot \quad c\ =\ \operatorname{Code}(\mathsf{WF}-\mathsf{StaticDecl}-\mathsf{MissingType}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{item}\ \Uparrow \ c
\end{array}
$$

**(StaticVisOk-Err)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{StaticDecl}(\_,\ \mathsf{vis},\ \mathsf{mut},\ \_,\ \_,\ \_)\quad \lnot \ \operatorname{StaticVisOk}(\mathsf{vis},\ \mathsf{mut})\quad c\ =\ \operatorname{Code}(\mathsf{StaticVisOk}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{item}\ \Uparrow \ c
\end{array}
$$

**(ResolveItem-Static)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolvePattern}(\mathsf{pat})\ \Downarrow \ \mathsf{pat}'\quad \Gamma \ \vdash \ \operatorname{ResolveExpr}(\mathsf{init})\ \Downarrow \ \mathsf{init}'\quad \Gamma \ \vdash \ \operatorname{ResolveTypeOpt}(\mathsf{ty}_{\mathsf{opt}})\ \Downarrow \ \mathsf{ty}_{\mathsf{opt}}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveItem}(\operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \langle \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \mathsf{span}\rangle ,\ \mathsf{span}',\ \mathsf{doc}))\ \Downarrow \ \operatorname{StaticDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{mut},\ \langle \mathsf{pat}',\ \mathsf{ty}_{\mathsf{opt}}',\ \mathsf{op},\ \mathsf{init}',\ \mathsf{span}\rangle ,\ \mathsf{span}',\ \mathsf{doc})
\end{array}
$$

### 11.3.5 Dynamic Semantics

`StaticDecl` introduces module-scope storage. Initialization and destruction occur according to the module initialization and deinitialization framework in Chapter 24 and the ordering rules in §11.5.6.

### 11.3.6 Lowering

$$
\mathsf{ConstInitJudg}\ =\ \{\mathsf{ConstInit}\}
$$

$$
\Gamma \ \vdash \ \operatorname{ConstInit}(e)\ \Downarrow \ \mathsf{bytes}\ \Leftrightarrow \ e\ =\ \operatorname{Literal}(\mathsf{lit})\ \land \ \Gamma \ \vdash \ \operatorname{EncodeConst}(\operatorname{ExprType}(e),\ \mathsf{lit})\ \Downarrow \ \mathsf{bytes}
$$

$$
\begin{array}{l}
\operatorname{StaticName}(\mathsf{binding})\ = \\[0.16em]
\ \mathsf{name}\quad \mathsf{if}\ \mathsf{binding}\ =\ \langle \operatorname{IdentifierPattern}(\mathsf{name}),\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \mathsf{span}\rangle \\[0.16em]
\ \bot \quad \mathsf{otherwise}
\end{array}
$$

$$
\operatorname{StaticBindTypes}(\mathsf{binding})\ =\ B\ \Leftrightarrow \ \mathsf{binding}\ =\ \langle \mathsf{pat},\ \mathsf{ty}_{\mathsf{opt}},\ \mathsf{op},\ \mathsf{init},\ \_\rangle \ \land \ \Gamma \ \vdash \ \mathsf{pat}\ \Leftarrow \ \operatorname{BindType}(\mathsf{binding})\ \dashv \ B
$$

$$
\operatorname{StaticBindList}(\mathsf{binding})\ =\ \operatorname{PatNames}(\mathsf{pat})\ \Leftrightarrow \ \mathsf{binding}\ =\ \langle \mathsf{pat},\ \_,\ \_,\ \_,\ \_\rangle
$$

$$
\mathsf{StaticBinding}\ :\ \mathsf{StaticDecl}\ \times \ \mathsf{Name}\ \to \ \mathsf{StaticDecl}
$$

$$
\begin{array}{l}
\operatorname{StaticSym}(\operatorname{StaticDecl}(\_,\ \_,\ \_,\ \mathsf{binding},\ \_,\ \_),\ x)\ = \\[0.16em]
\ \operatorname{Mangle}(\operatorname{StaticDecl}(\_,\ \_,\ \_,\ \mathsf{binding},\ \_,\ \_))\quad \mathsf{if}\ \operatorname{StaticName}(\mathsf{binding})\ =\ x \\[0.16em]
\ \operatorname{Mangle}(\operatorname{StaticBinding}(\operatorname{StaticDecl}(\_,\ \_,\ \_,\ \mathsf{binding},\ \_,\ \_),\ x))\quad \mathsf{otherwise}
\end{array}
$$

Rules **(Emit-Static-Const)**, **(Emit-Static-Init)**, **(Emit-Static-Multi)** are defined once by §24.4.1.

$$
\operatorname{InitSym}(m)\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"init"}]\ \mathbin{++} \ \operatorname{PathOfModule}(m))
$$

Rule **(InitFn)** is defined once by §24.4.1.

$$
\operatorname{DeinitSym}(m)\ =\ \operatorname{PathSig}([\texttt{"ultraviolet"},\ \texttt{"runtime"},\ \texttt{"deinit"}]\ \mathbin{++} \ \operatorname{PathOfModule}(m))
$$

Rule **(DeinitFn)** is defined once by §24.4.1.

$$
\operatorname{StaticItems}(P,\ m)\ =\ [\ \mathsf{item}\ \mid \ \mathsf{item}\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items}\ \land \ \mathsf{item}\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_)\ ]
$$

$$
\operatorname{StaticItemOf}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{item}\ \Leftrightarrow \ m\ =\ \mathsf{path}\ \land \ \mathsf{item}\ \in \ \operatorname{StaticItems}(\operatorname{Project}(\Gamma ),\ m)\ \land \ \mathsf{item}\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \mathsf{binding},\ \_,\ \_)\ \land \ \mathsf{name}\ \in \ \operatorname{StaticBindList}(\mathsf{binding})\ \land \ \forall \ \mathsf{item}'.\ (\mathsf{item}'\ \in \ \operatorname{StaticItems}(\operatorname{Project}(\Gamma ),\ m)\ \land \ \mathsf{item}'\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \_,\ \mathsf{binding}',\ \_,\ \_)\ \land \ \mathsf{name}\ \in \ \operatorname{StaticBindList}(\mathsf{binding}'))\ \Rightarrow \ \mathsf{item}'\ =\ \mathsf{item}
$$

$$
\operatorname{StaticSymPath}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{StaticSym}(\mathsf{item},\ \mathsf{name})\ \Leftrightarrow \ \operatorname{StaticItemOf}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{item}
$$

$$
\operatorname{StaticAddr}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{addr}\ \Leftrightarrow \ \exists \ \mathsf{sym}.\ \operatorname{StaticSymPath}(\mathsf{path},\ \mathsf{name})\ =\ \mathsf{sym}\ \land \ \operatorname{AddrOfSym}(\mathsf{sym})\ =\ \mathsf{addr}
$$

For hosted-library session execution, §24.4.1 reinterprets the `AddrOfSym(sym)` occurrence above session-locally for every hosted-state symbol.

$$
\mathsf{AddrOfSym}\ :\ \mathsf{Symbol}\ \to \ \mathsf{Addr}
$$

$$
\operatorname{StaticType}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{StaticBindTypes}(\mathsf{binding})[\mathsf{name}]\ \Leftrightarrow \ \operatorname{StaticItemOf}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \mathsf{mut},\ \mathsf{binding},\ \_,\ \_)
$$

$$
\operatorname{StaticBindInfo}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{BindInfoMap}(\lambda \ U.\ \operatorname{RespOfInit}(\mathsf{init}),\ \operatorname{StaticBindTypes}(\mathsf{binding}),\ \operatorname{MovOf}(\mathsf{op}),\ \mathsf{mut})[\mathsf{name}]\ \Leftrightarrow \ \operatorname{StaticItemOf}(\mathsf{path},\ \mathsf{name})\ =\ \operatorname{StaticDecl}(\_,\ \_,\ \mathsf{mut},\ \mathsf{binding},\ \_,\ \_)\ \land \ \mathsf{binding}\ =\ \langle \_,\ \_,\ \mathsf{op},\ \mathsf{init},\ \_\rangle
$$

$$
\begin{array}{l}
\operatorname{SeqIRList}([])\ =\ \varepsilon \\[0.16em]
\operatorname{SeqIRList}([\mathsf{IR}]\ \mathbin{++} \ \mathsf{IRs})\ =\ \operatorname{SeqIR}(\mathsf{IR},\ \operatorname{SeqIRList}(\mathsf{IRs}))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{StaticStoreIR}(\mathsf{item},\ [])\ =\ \varepsilon \\[0.16em]
\operatorname{StaticStoreIR}(\mathsf{item},\ [\langle x,\ v\rangle ]\ \mathbin{++} \ \mathsf{bs})\ =\ \operatorname{SeqIR}(\operatorname{StoreGlobal}(\operatorname{StaticSym}(\mathsf{item},\ x),\ v),\ \operatorname{StaticStoreIR}(\mathsf{item},\ \mathsf{bs}))
\end{array}
$$

Rules **(Lower-StaticInit-Item)**, **(Lower-StaticInitItems-Empty)**, **(Lower-StaticInitItems-Cons)**, **(Lower-StaticInit)**, **(InitCallIR)** are defined once by §24.4.1.

$$
\begin{array}{l}
\operatorname{Rev}([])\ =\ [] \\[0.16em]
\operatorname{Rev}([x]\ \mathbin{++} \ \mathsf{xs})\ =\ \operatorname{Rev}(\mathsf{xs})\ \mathbin{++} \ [x]
\end{array}
$$

Rules **(Lower-StaticDeinitNames-Empty)**, **(Lower-StaticDeinitNames-Cons-Resp)**, **(Lower-StaticDeinitNames-Cons-NoResp)**, **(Lower-StaticDeinit-Item)**, **(Lower-StaticDeinitItems-Empty)**, **(Lower-StaticDeinitItems-Cons)**, **(Lower-StaticDeinit)** are defined once by §24.4.1.

### 11.3.7 Diagnostics

| Code         | Severity | Detection    | Condition                                               |
| ------------ | -------- | ------------ | ------------------------------------------------------- |
| `E-TYP-1505` | Error    | Compile-time | Missing required type annotation at module scope (`WF-StaticDecl-MissingType`) |
| `E-MOD-2402` | Error    | Compile-time | Type annotation incompatible with inferred type (`WF-StaticDecl-Ann-Mismatch`) |
| `E-MOD-2433` | Error    | Compile-time | Module-scope `var` declaration with `public` visibility (`StaticVisOk-Err`) |

Initialization-order failures are owned by §11.5.7.
