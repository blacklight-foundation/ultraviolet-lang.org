---
title: "23.2 Extern Procedures"
description: "23.2 Extern Procedures from 23. Foreign Function Interface of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "foreign-function-interface"
specSection: "232-extern-procedures"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/foreign-function-interface/">23. Foreign Function Interface</a>
  <span>Foreign Function Interface</span>
</div>

## 23.2 Extern Procedures

### 23.2.1 Syntax

```text
extern_procedure_decl ::= attribute_list? visibility? "procedure" identifier generic_params? signature predicate_clause? contract_clause? foreign_contract_clause_list? terminator
```

### 23.2.2 Parsing

**(Parse-ExternProcDecl)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseAttrListOpt}(P)\ \Downarrow \ (P_{0},\ \mathsf{attrs}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseVis}(P_{0})\ \Downarrow \ (P_{1},\ \mathsf{vis})\quad \operatorname{IsKw}(\operatorname{Tok}(P_{1}),\ \texttt{procedure})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P_{1}))\ \Downarrow \ (P_{2},\ \mathsf{name})\quad \Gamma \ \vdash \ \operatorname{ParseGenericParamsOpt}(P_{2})\ \Downarrow \ (P_{3},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseSignature}(P_{3})\ \Downarrow \ (P_{4},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParsePredicateClauseOpt}(P_{4})\ \Downarrow \ (P_{5},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseContractClauseOpt}(P_{5})\ \Downarrow \ (P_{6},\ \mathsf{contract}_{\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ParseForeignContractClauseListOpt}(P_{6})\ \Downarrow \ (P_{7},\ \mathsf{foreign}_{\mathsf{contracts}\_\mathsf{opt}})\quad \Gamma \ \vdash \ \operatorname{ConsumeTerminatorReq}(P_{7})\ \Downarrow \ P_{8} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseExternProcDecl}(P)\ \Downarrow \ (P_{8},\ \operatorname{ExternProcDecl}(\mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{foreign}_{\mathsf{contracts}\_\mathsf{opt}},\ \operatorname{SpanBetween}(P,\ P_{8}),\ []))
\end{array}
$$

### 23.2.3 AST Representation / Form

Extern procedure declarations are represented by:

$$
\mathsf{ExternProcDecl}\ =\ \langle \mathsf{attrs}_{\mathsf{opt}},\ \mathsf{vis},\ \mathsf{name},\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \mathsf{predicate}_{\mathsf{clause}\_\mathsf{opt}},\ \mathsf{params},\ \mathsf{return}_{\mathsf{type}\_\mathsf{opt}},\ \mathsf{contract}_{\mathsf{opt}},\ \mathsf{foreign}_{\mathsf{contracts}\_\mathsf{opt}},\ \mathsf{span},\ \mathsf{doc}\rangle 
$$

Extern procedure declarations also admit the derived forms:

$$
\begin{array}{l}
\operatorname{ProcName}(\mathsf{proc})\ =\ \mathsf{name}\ \Leftrightarrow \ \mathsf{proc}\ =\ \operatorname{ExternProcDecl}(\_,\ \_,\ \mathsf{name},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_) \\[0.16em]
\operatorname{ExternRawName}(\mathsf{proc})\ \Leftrightarrow \ \mathsf{proc}\ =\ \operatorname{ExternProcDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \land \ \operatorname{ExternAbiName}(\operatorname{ExternAbiOf}(\mathsf{proc}))\ \in \ \{\texttt{"C"},\ \texttt{"C-unwind"}\}
\end{array}
$$

### 23.2.4 Static Semantics

**Extern Procedure.** A declaration whose implementation is provided by foreign code.

**ABI Strings**

$$
\mathsf{ExternAbiSet}\ =\ \{\texttt{"C"},\ \texttt{"C-unwind"},\ \texttt{"system"},\ \texttt{"stdcall"},\ \texttt{"fastcall"},\ \texttt{"vectorcall"}\}
$$
AbiProfileOk("C", profile)
AbiProfileOk("C-unwind", profile)
AbiProfileOk("system", profile)

$$
\begin{array}{l}
\operatorname{AbiProfileOk}(\texttt{"stdcall"},\ \mathsf{profile})\ \Leftrightarrow \ \mathsf{profile}\ =\ \texttt{x86\_64-win64} \\[0.16em]
\operatorname{AbiProfileOk}(\texttt{"fastcall"},\ \mathsf{profile})\ \Leftrightarrow \ \mathsf{profile}\ =\ \texttt{x86\_64-win64} \\[0.16em]
\operatorname{AbiProfileOk}(\texttt{"vectorcall"},\ \mathsf{profile})\ \Leftrightarrow \ \mathsf{profile}\ =\ \texttt{x86\_64-win64} \\[0.16em]
\operatorname{ExternAbiOk}(\mathsf{abi}_{\mathsf{opt}})\ \Leftrightarrow \ \operatorname{ExternAbiName}(\mathsf{abi}_{\mathsf{opt}})\ \in \ \mathsf{ExternAbiSet}\ \land \ \operatorname{AbiProfileOk}(\operatorname{ExternAbiName}(\mathsf{abi}_{\mathsf{opt}}),\ \mathsf{SelectedTargetProfile})
\end{array}
$$

**Signature Requirements**

$$
\begin{array}{l}
\operatorname{ExternParamTypes}(\mathsf{params})\ =\ [T_{i}\ \mid \ \langle \_,\ \_,\ T_{i}\rangle \ \in \ \mathsf{params}] \\[0.16em]
\operatorname{ExternSigOk}(\mathsf{params},\ \mathsf{ret}_{\mathsf{opt}})\ \Leftrightarrow  \\[0.16em]
\ R\ =\ \operatorname{ProcReturn}(\mathsf{ret}_{\mathsf{opt}})\ \land  \\[0.16em]
\ (R\ =\ \operatorname{TypePrim}(\texttt{"()"})\ \lor \ \Gamma \ \vdash \ \operatorname{FfiSafeType}(R)\ \Downarrow \ \mathsf{ok})\ \land  \\[0.16em]
\ (\forall \ T\ \in \ \operatorname{ExternParamTypes}(\mathsf{params}).\ \Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Downarrow \ \mathsf{ok})\ \land  \\[0.16em]
\ (\forall \ T\ \in \ \operatorname{ExternParamTypes}(\mathsf{params}).\ \operatorname{FfiByValueOk}(T))\ \land  \\[0.16em]
\ \operatorname{FfiByValueOk}(R)
\end{array}
$$

$$
\operatorname{SparseFuncType}(T)\ \Leftrightarrow \ T\ =\ \operatorname{TypeFunc}(\_,\ \_)
$$

**FFI Constraints**

1. Closure types MUST NOT appear in `extern` signatures.
2. Only sparse function pointer types are FFI-safe in `extern` signatures (`SparseFuncType`).
3. Sparse function pointer types in `extern` signatures MUST NOT have generic type parameters.

**Call Safety**

Calls to extern procedures MUST appear within an `unsafe` block.

### 23.2.5 Dynamic Semantics

Calls to extern procedures transfer control to foreign code. If `UnwindMode(proc) = "catch"`, foreign unwinds are converted to Ultraviolet panics at the boundary as defined in §23.7. If `UnwindMode(proc) = "abort"`, any unwind that attempts to cross the boundary aborts as defined in §23.7.

### 23.2.6 Lowering

Import-side unwind landing pads are defined in §23.7. This section introduces no additional lowering rules beyond ABI selection and the required unsafe-call boundary.

### 23.2.7 Diagnostics

| Code         | Severity | Detection    | Condition                                         |
| ------------ | -------- | ------------ | ------------------------------------------------- |
| `E-TYP-2306` | Error    | Compile-time | Generic parameter in `extern` procedure signature |
| `E-TYP-2106` | Error    | Compile-time | Call to `extern` procedure outside `unsafe`       |

Type-admissibility failures in `FfiSafeType` and by-value FFI use are owned by §23.1.7.
