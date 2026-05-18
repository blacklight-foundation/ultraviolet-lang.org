---
title: "23.3 Exported Procedures and Hosted Exports"
description: "23.3 Exported Procedures and Hosted Exports from 23. Foreign Function Interface of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "foreign-function-interface"
specSection: "233-exported-procedures-and-hosted-exports"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/foreign-function-interface/">23. Foreign Function Interface</a>
  <span>Foreign Function Interface</span>
</div>

## 23.3 Exported Procedures and Hosted Exports

### 23.3.1 Raw Exported Procedures

A procedure becomes a raw exported procedure when it carries `[[export("abi")]]`. The attribute syntax is defined in §23.4.1.

### 23.3.2 Parsing

Raw exported procedures are parsed by the ordinary procedure-declaration parser from §15.1.2.

An ordinary `ProcedureDecl` is classified as a raw exported procedure when its attached attribute list contains `[[export("abi")]]` as parsed by §23.4.2.

### 23.3.3 AST Representation / Form

Raw exported procedures are represented by ordinary `ProcedureDecl(...)` items with `ExportAttr(proc)` defined.

This section introduces no dedicated raw-export AST node beyond `ProcedureDecl` plus the attached `export` attribute.

### 23.3.4 Static Semantics

**Raw Exported Procedure.** A Ultraviolet procedure made callable from foreign code via `[[export]]`.

**Error Indicator Value.**

$$
\begin{array}{l}
\operatorname{ZeroBits}(T)\ =\ [0\mathsf{x00},\ \ldots ,\ 0\mathsf{x00}]\ \mathsf{where}\ \mid \operatorname{ZeroBits}(T)\mid \ =\ \operatorname{sizeof}(T) \\[0.16em]
\operatorname{ZeroValue}(T)\ =\ v\ \Leftrightarrow \ \operatorname{ValueBits}(T,\ v)\ =\ \operatorname{ZeroBits}(T)\ \land \ \forall \ v'.\ (\operatorname{ValueBits}(T,\ v')\ =\ \operatorname{ZeroBits}(T)\ \Rightarrow \ v'\ =\ v) \\[0.16em]
\operatorname{ZeroableType}(T)\ \Leftrightarrow \ \exists \ v.\ \operatorname{ZeroValue}(T)\ =\ v
\end{array}
$$

$$
\begin{array}{l}
\mathsf{ExportSigJudg}\ =\ \{\mathsf{ExportSigOk}\} \\[0.16em]
\operatorname{ExportParamTypes}(\mathsf{params})\ =\ [T_{i}\ \mid \ \langle \_,\ \_,\ T_{i}\rangle \ \in \ \mathsf{params}]
\end{array}
$$

**(ExportSig-Ok)**

$$
\begin{array}{l}
\mathsf{proc}\ =\ \operatorname{ProcedureDecl}(\_,\ \mathsf{vis},\ \_,\ \_,\ \_,\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \_,\ \_,\ \_,\ \_)\quad \mathsf{vis}\ =\ \texttt{public}\quad \operatorname{ExportAttr}(\mathsf{proc})\ =\ \langle \mathsf{abi},\ \_\rangle \quad \mathsf{abi}\ \in \ \mathsf{ExternAbiSet}\quad \operatorname{AbiProfileOk}(\mathsf{abi},\ \mathsf{SelectedTargetProfile})\quad R\ =\ \operatorname{ProcReturn}(\mathsf{ret}_{\mathsf{opt}})\quad (R\ =\ \operatorname{TypePrim}(\texttt{"()"})\ \lor \ \Gamma \ \vdash \ \operatorname{FfiSafeType}(R)\ \Downarrow \ \mathsf{ok})\quad (\forall \ T\ \in \ \operatorname{ExportParamTypes}(\mathsf{params}).\ \Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Downarrow \ \mathsf{ok})\quad (\forall \ T\ \in \ \operatorname{ExportParamTypes}(\mathsf{params}).\ \operatorname{FfiByValueOk}(T))\quad \operatorname{FfiByValueOk}(R)\quad (\operatorname{UnwindMode}(\mathsf{proc})\ \ne \ \texttt{catch}\ \lor \ \operatorname{ZeroableType}(R)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ExportSigOk}(\mathsf{proc})\ \Downarrow \ \mathsf{ok}
\end{array}
$$

### 23.3.5 Dynamic Semantics

Execution of the body follows ordinary procedure semantics. Boundary panic handling is defined by §23.7. When `UnwindMode(proc) = "catch"`, the boundary MUST return `ZeroValue(R)` for the raw exported procedure's return type `R`.

For a raw exported procedure `proc` owned by a project `P` satisfying `RawExportLibrary(P)`, a boundary call occurs only through one live loaded library image `i` owned by `P`. Before the first raw export call through a newly loaded image, the implementation MUST establish that image by `LibraryImageInitSigma(P, i, σ)` as defined in §24.4.4. Later raw export calls through the same live image MUST reuse the same image-owned static state, poison flags, and boundary panic record until unload. On unload of that live image, the implementation MUST execute `LibraryImageDestroySigma(P, i, σ)` exactly once. User-procedure execution within that live image is governed by `RawLibraryCallSigma(P, i, proc, vs, σ)` in §24.4.4.

For any shared library project `P`, an ordinary Ultraviolet call that crosses a shared-library link boundary into one externally linked procedure owned by `P` likewise occurs only through one live loaded library image `i` owned by `P`. Before the first such linked call through a newly loaded image, the implementation MUST establish that image by `LibraryImageInitSigma(P, i, σ)` as defined in §24.4.4. Later linked calls through the same live image MUST reuse the same image-owned static state, poison flags, and boundary panic record until unload. On unload of that live image, the implementation MUST execute `LibraryImageDestroySigma(P, i, σ)` exactly once. User-procedure execution for that linked call continues to follow ordinary `ApplyProcSigma` under the image-state interpretation defined by §24.4.4.

### 23.3.6 Lowering

Export-side unwind frames are defined in §23.7. This section introduces no additional lowering rules beyond export ABI selection and external linkage.

### 23.3.7 Diagnostics

| Code         | Severity | Detection    | Condition                                        |
| ------------ | -------- | ------------ | ------------------------------------------------ |
| `E-SYS-3353` | Error    | Compile-time | `[[export]]` requires `public` visibility        |
| `E-TYP-2631` | Error    | Compile-time | `[[export]]` catch requires zeroable return type |

Unsupported export-ABI-string rejection is owned by §23.2.7. Type-admissibility failures in `FfiSafeType` and by-value FFI use are owned by §23.1.7.

### 23.3.8 Hosted Exports

A procedure becomes a hosted export when it carries `[[host_export("abi")]]`. A hosted export is not a raw FFI signature: the foreign-visible signature is derived from the source procedure plus an opaque hosted-library session handle.

### 23.3.9 Parsing

Hosted exports are parsed by the ordinary procedure-declaration parser from §15.1.2.

An ordinary `ProcedureDecl` is classified as a hosted export when its attached attribute list contains `[[host_export("abi")]]` as parsed by §23.4.2.

### 23.3.10 AST Representation / Form

Hosted exports are represented by ordinary `ProcedureDecl(...)` items with `HostExportAttr(proc)` defined.

$$
\begin{array}{l}
\operatorname{HostExported}(\mathsf{proc})\ \Leftrightarrow \ \mathsf{proc}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \land \ \operatorname{HostExportAttr}(\mathsf{proc})\ \mathsf{defined} \\[0.16em]
\operatorname{HostContextParam}(\mathsf{proc})\ =\ \langle \mathsf{mode},\ \mathsf{name},\ T_{\mathsf{ctx}}\rangle \ \Leftrightarrow \ \mathsf{proc}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ [\langle \mathsf{mode},\ \mathsf{name},\ T_{\mathsf{ctx}}\rangle ]\ \mathbin{++} \ \_,\ \_,\ \_,\ \_,\ \_,\ \_) \\[0.16em]
\operatorname{HostVisibleParams}(\mathsf{proc})\ =\ \mathsf{params}_{\mathsf{vis}}\ \Leftrightarrow \ \mathsf{proc}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ [\mathsf{ctx}_{\mathsf{param}}]\ \mathbin{++} \ \mathsf{params}_{\mathsf{vis}},\ \_,\ \_,\ \_,\ \_,\ \_) \\[0.16em]
\operatorname{HostVisibleParamTypes}(\mathsf{proc})\ =\ [T_{i}\ \mid \ \langle \_,\ \_,\ T_{i}\rangle \ \in \ \mathsf{params}_{\mathsf{vis}}]\ \Leftrightarrow \ \operatorname{HostVisibleParams}(\mathsf{proc})\ =\ \mathsf{params}_{\mathsf{vis}} \\[0.16em]
\operatorname{HostExports}(P)\ =\ [d\ \mid \ m\ \in \ P.\mathsf{modules},\ d\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items},\ \operatorname{HostExported}(d)] \\[0.16em]
\operatorname{RawExports}(P)\ =\ [d\ \mid \ m\ \in \ P.\mathsf{modules},\ d\ \in \ \operatorname{ASTModule}(P,\ m).\mathsf{items},\ d\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\ \land \ \operatorname{ExportAttr}(d)\ \mathsf{defined}] \\[0.16em]
\operatorname{HostedLibrary}(P)\ \Leftrightarrow \ \operatorname{Library}(P)\ \land \ \operatorname{HostExports}(P)\ \ne \ [] \\[0.16em]
\operatorname{MixedForeignExportModes}(P)\ \Leftrightarrow \ \operatorname{HostedLibrary}(P)\ \land \ \operatorname{RawExports}(P)\ \ne \ [] \\[0.16em]
\operatorname{HostedRootCaps}(P)\ =\ \bigcup \{\operatorname{CapInType}(\operatorname{StripPerm}(T_{\mathsf{ctx}}))\ \mid \ d\ \in \ \operatorname{HostExports}(P)\ \land \ \operatorname{HostContextParam}(d)\ =\ \langle \_,\ \_,\ T_{\mathsf{ctx}}\rangle \} \\[0.16em]
\operatorname{HostedContextBundleType}(T)\ \Leftrightarrow \ \operatorname{ContextBundleType}(T)\ \land \ \operatorname{AliasNorm}(T)\ \ne \ \operatorname{TypePath}([\texttt{"Context"}])
\end{array}
$$
HostAbiVersion = 1

$$
\begin{array}{l}
\mathsf{HostSessionAbiParam}\ =\ \langle \texttt{move},\ \texttt{\_\_ultraviolet\_session},\ \operatorname{TypePrim}(\texttt{"usize"})\rangle  \\[0.16em]
\operatorname{HostThunkParams}(\mathsf{proc})\ =\ [\mathsf{HostSessionAbiParam}]\ \mathbin{++} \ \mathsf{params}_{\mathsf{vis}}\ \Leftrightarrow \ \operatorname{HostVisibleParams}(\mathsf{proc})\ =\ \mathsf{params}_{\mathsf{vis}} \\[0.16em]
\operatorname{HostThunkForeignParamTypes}(\mathsf{proc})\ =\ [\operatorname{TypePrim}(\texttt{"usize"})]\ \mathbin{++} \ [T_{i}\ \mid \ \langle \_,\ \_,\ T_{i}\rangle \ \in \ \mathsf{params}_{\mathsf{vis}}]\ \Leftrightarrow \ \operatorname{HostVisibleParams}(\mathsf{proc})\ =\ \mathsf{params}_{\mathsf{vis}} \\[0.16em]
\operatorname{HostThunkSig}(\mathsf{proc})\ =\ \langle \operatorname{HostThunkParams}(\mathsf{proc}),\ \operatorname{ProcReturn}(\mathsf{ret}_{\mathsf{opt}})\rangle \ \Leftrightarrow \ \mathsf{proc}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \mathsf{ret}_{\mathsf{opt}},\ \_,\ \_,\ \_,\ \_)
\end{array}
$$

`HostedRootCaps(P)` is the maximal capability set that may become visible to Ultraviolet user code through hosted exports of `P`.

### 23.3.11 Static Semantics

**Hosted Export.** A Ultraviolet procedure made callable from foreign code through a hosted-library session.

**Foreign-visible signature.** For a hosted export `proc`, the foreign-visible signature consists of one leading `usize` session-handle parameter followed by the source parameters after the first source parameter. The first source parameter itself is not part of the foreign-visible ABI.

For each visible source parameter `⟨mode_i, _, T_i⟩`, the foreign-visible pass kind MUST be derived by `ForeignABIParam(T_i)` (§24.2.5), independent of source parameter mode.

$$
\mathsf{HostExportSigJudg}\ =\ \{\mathsf{HostExportSigOk}\}
$$

**(HostExportSig-Ok)**

$$
\begin{array}{l}
\operatorname{Project}(\Gamma )\ =\ P\quad \mathsf{proc}\ =\ \operatorname{ProcedureDecl}(\_,\ \mathsf{vis},\ \_,\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \_,\ \mathsf{params},\ \mathsf{ret}_{\mathsf{opt}},\ \_,\ \_,\ \_,\ \_)\quad \mathsf{vis}\ =\ \texttt{public}\quad \operatorname{HostExportAttr}(\mathsf{proc})\ =\ \langle \mathsf{abi},\ \_\rangle \quad \operatorname{TypeParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\ =\ []\quad \lnot \ \operatorname{MixedForeignExportModes}(P)\quad \operatorname{Library}(P)\quad \mathsf{params}\ =\ [\langle \bot ,\ \_,\ T_{\mathsf{ctx}}\rangle ]\ \mathbin{++} \ \mathsf{params}_{\mathsf{vis}}\quad \operatorname{HostedContextBundleType}(\operatorname{StripPerm}(T_{\mathsf{ctx}}))\quad \mathsf{abi}\ \in \ \mathsf{ExternAbiSet}\quad \operatorname{AbiProfileOk}(\mathsf{abi},\ \mathsf{SelectedTargetProfile})\quad R\ =\ \operatorname{ProcReturn}(\mathsf{ret}_{\mathsf{opt}})\quad (R\ =\ \operatorname{TypePrim}(\texttt{"()"})\ \lor \ \Gamma \ \vdash \ \operatorname{FfiSafeType}(R)\ \Downarrow \ \mathsf{ok})\quad (\forall \ T\ \in \ \operatorname{HostVisibleParamTypes}(\mathsf{proc}).\ \Gamma \ \vdash \ \operatorname{FfiSafeType}(T)\ \Downarrow \ \mathsf{ok})\quad (\forall \ T\ \in \ \operatorname{HostVisibleParamTypes}(\mathsf{proc}).\ \operatorname{CapInType}(T)\ =\ \emptyset )\quad \operatorname{CapInType}(R)\ =\ \emptyset \quad (\forall \ T\ \in \ \operatorname{HostVisibleParamTypes}(\mathsf{proc}).\ \operatorname{FfiByValueOk}(T))\quad \operatorname{FfiByValueOk}(R)\quad (\operatorname{UnwindMode}(\mathsf{proc})\ \ne \ \texttt{catch}\ \lor \ \operatorname{ZeroableType}(R)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{HostExportSigOk}(\mathsf{proc})\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**(HostExport-Library-Err)**

$$
\begin{array}{l}
\operatorname{Project}(\Gamma )\ =\ P\quad \operatorname{HostExported}(\mathsf{proc})\quad \lnot \ \operatorname{Library}(P)\quad c\ =\ \operatorname{Code}(\mathsf{HostExport}-\mathsf{Library}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{HostExportSigOk}(\mathsf{proc})\ \Uparrow \ c
\end{array}
$$

**(HostExport-MixedMode-Err)**

$$
\begin{array}{l}
\operatorname{Project}(\Gamma )\ =\ P\quad \operatorname{HostExported}(\mathsf{proc})\quad \operatorname{MixedForeignExportModes}(P)\quad c\ =\ \operatorname{Code}(\mathsf{HostExport}-\mathsf{MixedMode}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{HostExportSigOk}(\mathsf{proc})\ \Uparrow \ c
\end{array}
$$

**(HostExport-Generic-Err)**

$$
\begin{array}{l}
\mathsf{proc}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \mathsf{gen}_{\mathsf{params}\_\mathsf{opt}},\ \_,\ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\quad \operatorname{HostExportAttr}(\mathsf{proc})\ =\ \langle \_,\ \_\rangle \quad \operatorname{TypeParamsOpt}(\mathsf{gen}_{\mathsf{params}\_\mathsf{opt}})\ \ne \ []\quad c\ =\ \operatorname{Code}(\mathsf{HostExport}-\mathsf{Generic}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{HostExportSigOk}(\mathsf{proc})\ \Uparrow \ c
\end{array}
$$

**(HostExport-Context-Err)**

$$
\begin{array}{l}
\mathsf{proc}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ \mathsf{params},\ \_,\ \_,\ \_,\ \_,\ \_)\quad \operatorname{HostExportAttr}(\mathsf{proc})\ =\ \langle \_,\ \_\rangle \quad (\mathsf{params}\ =\ []\ \lor \ (\mathsf{params}\ =\ [\langle \mathsf{mode},\ \_,\ T_{\mathsf{ctx}}\rangle ]\ \mathbin{++} \ \_\ \land \ \lnot \ \operatorname{ContextBundleType}(\operatorname{StripPerm}(T_{\mathsf{ctx}}))))\quad c\ =\ \operatorname{Code}(\mathsf{HostExport}-\mathsf{Context}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{HostExportSigOk}(\mathsf{proc})\ \Uparrow \ c
\end{array}
$$

**(HostExport-Context-Raw-Err)**

$$
\begin{array}{l}
\mathsf{proc}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ [\langle \mathsf{mode},\ \_,\ T_{\mathsf{ctx}}\rangle ]\ \mathbin{++} \ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\quad \operatorname{HostExportAttr}(\mathsf{proc})\ =\ \langle \_,\ \_\rangle \quad \operatorname{AliasNorm}(\operatorname{StripPerm}(T_{\mathsf{ctx}}))\ =\ \operatorname{TypePath}([\texttt{"Context"}])\quad c\ =\ \operatorname{Code}(\mathsf{HostExport}-\mathsf{Context}-\mathsf{Raw}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{HostExportSigOk}(\mathsf{proc})\ \Uparrow \ c
\end{array}
$$

**(HostExport-Context-Move-Err)**

$$
\begin{array}{l}
\mathsf{proc}\ =\ \operatorname{ProcedureDecl}(\_,\ \_,\ \_,\ \_,\ \_,\ [\langle \texttt{move},\ \_,\ T_{\mathsf{ctx}}\rangle ]\ \mathbin{++} \ \_,\ \_,\ \_,\ \_,\ \_,\ \_)\quad \operatorname{HostExportAttr}(\mathsf{proc})\ =\ \langle \_,\ \_\rangle \quad \operatorname{ContextBundleType}(\operatorname{StripPerm}(T_{\mathsf{ctx}}))\quad c\ =\ \operatorname{Code}(\mathsf{HostExport}-\mathsf{Context}-\mathsf{Move}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{HostExportSigOk}(\mathsf{proc})\ \Uparrow \ c
\end{array}
$$

### 23.3.12 Dynamic Semantics

A hosted export call occurs only with a live, idle hosted-library session `h` owned by the library project `P`. Hosted-export foreign-visible session handles use ABI type `usize`; the value `0` MUST be rejected as invalid.

A conforming implementation MUST ensure that the only capability-bearing value introduced to Ultraviolet user code by the hosted-export boundary is the reconstructed first source argument. Raw `Context` values MUST NOT be exposed directly to hosted-export user code, and the capability roots that become visible across all hosted exports of `P` MUST be a subset of `HostedRootCaps(P)`.

This specification revision defines no foreign-supplied capability adapters or session options. A successful hosted session MUST grant exactly `HostedRootCaps(P)` through runtime-owned standard providers; foreign code does not pass capability values across the hosted-session ABI.

The boundary MUST:

1. validate the foreign-visible session handle;
2. reject any handle that is invalid, not live, or currently busy before any user code executes;
3. recover the session-owned root context carrier for `h`;
4. construct the first source argument `v_ctx` by `ContextBundleBuild(StripPerm(T_ctx), SessionContext(h))`;
5. pass `v_ctx` plus the foreign-visible arguments to the source procedure under ordinary Ultraviolet semantics.

If the supplied handle is invalid, not live, or busy, then the hosted-export boundary MUST:

1. return `ZeroValue(R)` when `UnwindMode(proc) = "catch"`;
2. otherwise terminate the boundary call as `Abort`.

When `UnwindMode(proc) = "catch"`, any boundary failure that occurs before or during hosted-export invocation MUST return `ZeroValue(R)` for the hosted export's return type `R`.

### 23.3.13 Lowering

Hosted-export lowering MUST preserve the raw-FFI rules of §§23.1–23.5 for the foreign-visible signature while reconstructing the first source parameter internally.

For a hosted export `proc` with `HostExportAttr(proc) = ⟨abi, _⟩` and `HostThunkSig(proc) = ⟨params_thunk, R⟩`, the foreign-visible thunk ABI is determined exactly as follows:

1. `Γ ⊢ ForeignABICall(HostThunkForeignParamTypes(proc), R) ⇓ ⟨[k_1, …, k_n], k_r, sretSigma⟩` determines the complete foreign by-value/by-reference parameter classification and indirect-return decision.
2. `ConventionLayout(SelectedTargetProfile, AbiToConvention(abi))` determines the calling-convention layout used by the thunk.
3. `AssignParamRegs(HostThunkForeignParamTypes(proc), AbiToConvention(abi))` determines the thunk's parameter register assignment and stack-slot assignment.
4. The thunk's return-register assignment, indirect-return slot placement, and stack layout MUST be exactly those implied by the same `ForeignABICall`, `ConventionLayout`, and `AssignParamRegs` results for a raw exported procedure whose source signature is `params_thunk -> R`.

$$
\begin{array}{l}
\mathsf{HostThunkParamCarrierJudg}\ =\ \{\mathsf{HostThunkParamCarrier}\} \\[0.16em]
\mathsf{HostThunkRetCarrierJudg}\ =\ \{\mathsf{HostThunkRetCarrier}\} \\[0.16em]
\operatorname{HostThunkParamShape}(\mathsf{proc})\ =\ [\langle k_{i},\ c_{i},\ \tau_{i} \rangle ]\ \Leftrightarrow  \\[0.16em]
\ \operatorname{HostThunkForeignParamTypes}(\mathsf{proc})\ =\ [T_{i}]\ \land  \\[0.16em]
\ \operatorname{HostThunkSig}(\mathsf{proc})\ =\ \langle \_,\ R\rangle \ \land  \\[0.16em]
\ \Gamma \ \vdash \ \operatorname{ForeignABICall}([T_{i}],\ R)\ \Downarrow \ \langle [k_{i}],\ k_{r},\ \mathsf{sretSigma}_{\mathsf{base}}\rangle \ \land  \\[0.16em]
\ \forall \ i.\ \Gamma \ \vdash \ \operatorname{HostThunkParamCarrier}(\mathsf{SelectedTargetProfile},\ k_{i},\ T_{i})\ \Downarrow \ \langle c_{i},\ \tau_{i} \rangle  \\[0.16em]
\operatorname{HostThunkRetShape}(\mathsf{proc})\ =\ \langle k_{r},\ c_{r},\ \tau_{r} ,\ \mathsf{sretSigma}\rangle \ \Leftrightarrow  \\[0.16em]
\ \operatorname{HostThunkSig}(\mathsf{proc})\ =\ \langle \_,\ R\rangle \ \land  \\[0.16em]
\ \Gamma \ \vdash \ \operatorname{ForeignABICall}(\operatorname{HostThunkForeignParamTypes}(\mathsf{proc}),\ R)\ \Downarrow \ \langle [k_{i}],\ k_{r},\ \mathsf{sretSigma}_{\mathsf{base}}\rangle \ \land  \\[0.16em]
\ \Gamma \ \vdash \ \operatorname{HostThunkRetCarrier}(\mathsf{SelectedTargetProfile},\ k_{r},\ R,\ \mathsf{sretSigma}_{\mathsf{base}})\ \Downarrow \ \langle c_{r},\ \tau_{r} ,\ \mathsf{sretSigma}\rangle  \\[0.16em]
\operatorname{IntLane}(1)\ =\ \texttt{i8} \\[0.16em]
\operatorname{IntLane}(2)\ =\ \texttt{i16} \\[0.16em]
\operatorname{IntLane}(4)\ =\ \texttt{i32} \\[0.16em]
\operatorname{IntLane}(8)\ =\ \texttt{i64} \\[0.16em]
\operatorname{AggLLVM}(T)\ \Leftrightarrow \ \exists \ \tau .\ \Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau \ \land \ (\tau \ \mathsf{is}\ \texttt{struct}\ \lor \ \tau \ \mathsf{is}\ \texttt{array})
\end{array}
$$

**(HostThunkParamCarrier-ByRef)**
k = `ByRef`

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{HostThunkParamCarrier}(\mathsf{profile},\ k,\ T)\ \Downarrow \ \langle \texttt{Direct},\ \operatorname{LLVMPtrTy}(\operatorname{TypePtr}(\operatorname{TypePerm}(\texttt{const},\ T),\ \texttt{Valid}))\rangle 
\end{array}
$$

**(HostThunkParamCarrier-ByValue-Default)**

$$
\begin{array}{l}
k\ =\ \texttt{ByValue}\quad \lnot (\mathsf{profile}\ =\ \texttt{x86\_64-win64}\ \land \ \operatorname{AggLLVM}(T))\quad \Gamma \ \vdash \ \operatorname{LLVMTy}(T)\ \Downarrow \ \tau  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{HostThunkParamCarrier}(\mathsf{profile},\ k,\ T)\ \Downarrow \ \langle \texttt{Direct},\ \tau \rangle 
\end{array}
$$

**(HostThunkParamCarrier-Win64-DirectAgg)**

$$
\begin{array}{l}
\mathsf{profile}\ =\ \texttt{x86\_64-win64}\quad k\ =\ \texttt{ByValue}\quad \operatorname{AggLLVM}(T)\quad \Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ n\quad n\ \in \ \{1,\ 2,\ 4,\ 8\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{HostThunkParamCarrier}(\mathsf{profile},\ k,\ T)\ \Downarrow \ \langle \texttt{Direct},\ \operatorname{IntLane}(n)\rangle 
\end{array}
$$

**(HostThunkParamCarrier-Win64-IndirectAgg)**

$$
\begin{array}{l}
\mathsf{profile}\ =\ \texttt{x86\_64-win64}\quad k\ =\ \texttt{ByValue}\quad \operatorname{AggLLVM}(T)\quad \Gamma \ \vdash \ \operatorname{sizeof}(T)\ =\ n\quad n\ >\ 0\quad n\ \notin \ \{1,\ 2,\ 4,\ 8\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{HostThunkParamCarrier}(\mathsf{profile},\ k,\ T)\ \Downarrow \ \langle \texttt{Indirect},\ \operatorname{LLVMPtrTy}(\operatorname{TypePtr}(\operatorname{TypePerm}(\texttt{const},\ T),\ \texttt{Valid}))\rangle 
\end{array}
$$

**(HostThunkRetCarrier-Default)**

$$
\begin{array}{l}
\mathsf{profile}\ \ne \ \texttt{x86\_64-win64}\ \lor \ \lnot (k_{r}\ =\ \texttt{ByValue}\ \land \ \operatorname{AggLLVM}(R))\quad \Gamma \ \vdash \ \operatorname{LLVMRetLower}(R,\ k_{r})\ \Downarrow \ \tau_{r}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{HostThunkRetCarrier}(\mathsf{profile},\ k_{r},\ R,\ \mathsf{sretSigma}_{\mathsf{base}})\ \Downarrow \ \langle \texttt{Direct},\ \tau_{r} ,\ \mathsf{sretSigma}_{\mathsf{base}}\rangle 
\end{array}
$$

**(HostThunkRetCarrier-Win64-DirectAgg)**

$$
\begin{array}{l}
\mathsf{profile}\ =\ \texttt{x86\_64-win64}\quad k_{r}\ =\ \texttt{ByValue}\quad \operatorname{AggLLVM}(R)\quad \Gamma \ \vdash \ \operatorname{sizeof}(R)\ =\ n\quad n\ \in \ \{1,\ 2,\ 4,\ 8\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{HostThunkRetCarrier}(\mathsf{profile},\ k_{r},\ R,\ \mathsf{sretSigma}_{\mathsf{base}})\ \Downarrow \ \langle \texttt{Direct},\ \operatorname{IntLane}(n),\ \mathsf{false}\rangle 
\end{array}
$$

**(HostThunkRetCarrier-Win64-SRetAgg)**

$$
\begin{array}{l}
\mathsf{profile}\ =\ \texttt{x86\_64-win64}\quad k_{r}\ =\ \texttt{ByValue}\quad \operatorname{AggLLVM}(R)\quad \Gamma \ \vdash \ \operatorname{sizeof}(R)\ =\ n\quad n\ >\ 0\quad n\ \notin \ \{1,\ 2,\ 4,\ 8\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{HostThunkRetCarrier}(\mathsf{profile},\ k_{r},\ R,\ \mathsf{sretSigma}_{\mathsf{base}})\ \Downarrow \ \langle \texttt{Indirect},\ \texttt{void},\ \mathsf{true}\rangle 
\end{array}
$$

For hosted-export thunk lowering, a conforming implementation MUST use `HostThunkParamShape(proc)` and `HostThunkRetShape(proc)` as the foreign ABI shape.

For `SelectedTargetProfile = x86_64-win64`, a conforming implementation MUST NOT split one by-value aggregate source parameter of a hosted export into multiple scalar ABI parameters at the foreign-visible thunk boundary.

No hosted-export-specific ABI rewriting beyond prepending `HostSessionAbiParam` and omitting the first source parameter is permitted.

Hosted thunk foreign parameter classification MUST be mode-independent. Pointer-typed visible parameters therefore use canonical C-style pointer carriers at the foreign boundary.

When `ForeignABIParam(T_i) ≠ ABIParam(mode_i, T_i)`, thunk-to-source call reconstruction MUST preserve source semantics by materializing one temporary storage cell of type `T_i`, storing the incoming foreign value into that cell, and passing that temporary according to `ABIParam(mode_i, T_i)` to the source procedure body.

For hosted-library thunk and body emission, loads and stores of `HostedStateSym(Project(Γ), sym)` MUST resolve by full symbol identity `sym` (including cross-module references) and session context, not by module-local global-declaration presence. When `HostedStateSym(Project(Γ), sym)` holds, a conforming implementation MUST NOT substitute `ZeroValue` or any other default value in place of a failed symbol materialization.

For every hosted library, a conforming implementation MUST emit foreign-callable lifecycle exports with the following names and ABIs:

1. `__ultraviolet_host_abi_version : () -> u32`, which MUST return `HostAbiVersion`.
2. `__ultraviolet_host_session_create : () -> usize`, which MUST return `0` iff it cannot establish a live hosted session by `HostSessionInitSigma`, MUST leave no live hosted session reachable from foreign code on that failure path, MUST reclaim any partially initialized session state for that failed attempt, and MUST otherwise return one nonzero hosted-session handle token.
3. `__ultraviolet_host_session_destroy : (usize) -> u32`, which MUST return `1` iff it destroys one live idle hosted session by `HostSessionDestroySigma`, MUST return `0` for invalid, non-live, or busy handles, and MUST NOT return any value other than `0` or `1`.

These lifecycle exports are backend-generated boundary declarations. They are not user-declared `ProcedureDecl` items. A conforming backend MUST emit them exactly once in the linked image of each hosted library.

These lifecycle exports MUST NOT propagate `Panic` across the foreign boundary. If hosted-session destruction accepts a live idle handle but user deinitialization panics or session teardown otherwise cannot complete `HostSessionDestroySigma`, `__ultraviolet_host_session_destroy` MUST return `0`, MUST retire the handle so it is no longer live and cannot be reused, and MUST reclaim any remaining session-private runtime state that is not already consumed by the deinitialization steps that completed before the failure.
A hosted-session handle token that has been returned nonzero by `__ultraviolet_host_session_create` MUST NOT be reissued again later in the same process lifetime.

For every hosted export `proc`, a conforming implementation MUST emit one foreign-callable thunk whose link name is selected by `LinkName` and whose foreign-visible ABI:

1. prepends one `usize` session-handle parameter;
2. omits the first source parameter from the foreign-visible ABI;
3. reconstructs the first source parameter from the session-owned `Context` value before entering the user procedure;
4. rejects invalid, non-live, and busy handles according to §23.3.12 before any user code executes;
5. applies the same `[[unwind]]` boundary rules as a raw exported procedure with the derived foreign-visible signature.

These hosted-export thunks are backend-generated boundary declarations. They are not the same declarations as the user-authored source procedures. A conforming backend MUST emit exactly one hosted-export thunk per `proc ∈ HostExports(P)` in the linked image of `P`, and that thunk MUST use `HostThunkLinkName(proc)` as its foreign symbol while calls from Ultraviolet code continue to target the source procedure body symbol `Mangle(proc)`. A conforming implementation MUST NOT expose `Mangle(proc)` itself as the hosted foreign entrypoint for `proc`; foreign code enters only through the generated thunk.

### 23.3.14 Diagnostics

| Code         | Severity | Detection    | Condition                                                                            |
| ------------ | -------- | ------------ | ------------------------------------------------------------------------------------ |
| `E-TYP-2632` | Error    | Compile-time | `[[host_export]]` requires a leading `Context` bundle parameter                      |
| `E-TYP-2633` | Error    | Compile-time | `[[host_export]]` leading `Context` bundle parameter MUST NOT use `move`             |
| `E-TYP-2634` | Error    | Compile-time | Generic `[[host_export]]` procedure                                                  |
| `E-TYP-2635` | Error    | Compile-time | `[[host_export]]` catch requires zeroable return type                                |
| `E-TYP-2636` | Error    | Compile-time | `[[host_export]]` MUST use an explicit projected `Context` bundle, not raw `Context` |

Type-admissibility failures in `FfiSafeType` and by-value FFI use for hosted-export visible parameters and returns are owned by §23.1.7.
