---
title: "11.4 Extern Block Shell"
description: "11.4 Extern Block Shell from 11. Module-Level Forms of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "module-level-forms"
specSection: "114-extern-block-shell"
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

## 11.4 Extern Block Shell

### 11.4.1 Syntax

```text
extern_block ::= attribute_list? visibility? "extern" extern_abi? "{" extern_item* "}"
extern_abi   ::= string_literal | identifier
extern_item  ::= extern_procedure_decl
```

The detailed syntax, parsing, and AST form of `extern_procedure_decl` are defined by §23.2.

### 11.4.2 Parsing

**(Parse-ExternBlock)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{extern})\quad \Gamma \ \vdash \ \operatorname{ParseExternAbiOpt}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{abi}_{\mathsf{opt}})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{2}),\ \texttt{"\{"})\quad \Gamma \ \vdash \ \operatorname{ParseExternItemList}(\operatorname{Advance}(P_{2}))\ \Downarrow \ (P_{3},\ \mathsf{items})\quad \operatorname{IsPunc}(\operatorname{Tok}(P_{3}),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseItem}(P)\ \Downarrow \ (\operatorname{Advance}(P_{3}),\ \langle \mathsf{ExternBlock},\ \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{abi}_{\mathsf{opt}},\ \mathsf{items},\ \operatorname{SpanBetween}(P,\ \operatorname{Advance}(P_{3})),\ []\rangle )
\end{array}
$$

**(Parse-ExternAbiOpt-None)**

$$
\begin{array}{l}
\operatorname{Tok}(P).\mathsf{kind}\ \notin \ \{\mathsf{StringLiteral},\ \mathsf{Identifier}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseExternAbiOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-ExternAbiOpt-String)**

$$
\begin{array}{l}
\operatorname{Tok}(P).\mathsf{kind}\ =\ \mathsf{StringLiteral} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseExternAbiOpt}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \operatorname{StringAbi}(\operatorname{Tok}(P)))
\end{array}
$$

**(Parse-ExternAbiOpt-Ident)**
IsIdent(Tok(P))

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseExternAbiOpt}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \operatorname{IdentAbi}(\operatorname{Lexeme}(\operatorname{Tok}(P))))
\end{array}
$$

**(Parse-ExternItemList-End)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\}"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseExternItemList}(P)\ \Downarrow \ (P,\ [])
\end{array}
$$

**(Parse-ExternItemList-Cons)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{"\}"})\quad \Gamma \ \vdash \ \operatorname{ParseExternProcDecl}(P)\ \Downarrow \ (P_{1},\ \mathsf{it})\quad \Gamma \ \vdash \ \operatorname{ParseExternItemList}(P_{1})\ \Downarrow \ (P_{2},\ \mathsf{rest}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseExternItemList}(P)\ \Downarrow \ (P_{2},\ [\mathsf{it}]\ \mathbin{++} \ \mathsf{rest})
\end{array}
$$

### 11.4.3 AST Representation / Form

$$
\mathsf{ExternBlock}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{abi}_{\mathsf{opt}},\ \mathsf{items},\ \mathsf{span},\ \mathsf{doc}\rangle
$$

$$
\mathsf{ExternItem}\ \in \ \{\mathsf{ExternProcDecl}\}
$$

$$
\begin{array}{l}
\mathsf{abi}_{\mathsf{opt}}\ \in \ \{\bot \}\ \cup \ \mathsf{ExternAbi} \\[0.16em]
\mathsf{ExternAbi}\ \in \ \{\mathsf{StringAbi},\ \mathsf{IdentAbi}\}
\end{array}
$$

### 11.4.4 Static Semantics

Block-level ABI validation and namespace binding are owned by this section. Signature admissibility and FFI boundary rules are defined by Chapter 23. `ExternAbiOk` is defined by §23.2.4.

Rule **(Bind-ExternBlock)** is defined once by §7.5.

**(WF-ExternBlock)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ExternBlock}(\_,\ \_,\ \mathsf{abi}_{\mathsf{opt}},\ \_,\ \_,\ \_)\quad \operatorname{ExternAbiOk}(\mathsf{abi}_{\mathsf{opt}}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{ExternBlock}\ :\ \mathsf{ok}
\end{array}
$$

**(ExternAbi-Unknown-Err)**

$$
\begin{array}{l}
\mathsf{item}\ =\ \operatorname{ExternBlock}(\_,\ \_,\ \mathsf{abi}_{\mathsf{opt}},\ \_,\ \_,\ \_)\quad \lnot \ \operatorname{ExternAbiOk}(\mathsf{abi}_{\mathsf{opt}})\quad c\ =\ \operatorname{Code}(\mathsf{ExternAbi}-\mathsf{Unknown}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \mathsf{item}\ \Uparrow \ c
\end{array}
$$

**(ResolveItem-ExternBlock)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ResolveExternItemList}(\mathsf{items})\ \Downarrow \ \mathsf{items}' \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ResolveItem}(\operatorname{ExternBlock}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{abi}_{\mathsf{opt}},\ \mathsf{items},\ \mathsf{span},\ \mathsf{doc}))\ \Downarrow \ \operatorname{ExternBlock}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{abi}_{\mathsf{opt}},\ \mathsf{items}',\ \mathsf{span},\ \mathsf{doc})
\end{array}
$$

### 11.4.5 Dynamic Semantics

`extern` blocks introduce no direct runtime mechanism. Runtime boundary behavior is defined by Chapter 23.

### 11.4.6 Lowering

`extern` blocks contribute ABI and linkage context for the contained foreign procedures. This section introduces no lowering beyond the block shell; boundary lowering is defined by Chapter 23 and Chapter 24.

### 11.4.7 Diagnostics

Unsupported extern-ABI-string rejection is owned by §23.2.7. Contained foreign-procedure signature diagnostics are owned by Chapter 23.
