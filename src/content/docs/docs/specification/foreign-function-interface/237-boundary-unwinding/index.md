---
title: "23.7 Boundary Unwinding"
description: "23.7 Boundary Unwinding from 23. Foreign Function Interface of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "foreign-function-interface"
specSection: "237-boundary-unwinding"
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

## 23.7 Boundary Unwinding

### 23.7.1 Syntax

The only surface syntax owned by this section is `[[unwind(...)]],` defined in §23.4.1. This section introduces no additional concrete syntax.

### 23.7.2 Parsing

This section introduces no additional parsing rules.

### 23.7.3 AST Representation / Form

Boundary unwind policy is derived from the `[[unwind]]` attribute attached to a procedure declaration.

$$
\mathsf{UnwindModeValue}\ =\ \{\ \texttt{abort},\ \texttt{catch}\ \}
$$

$$
\mathsf{UnwindMode}\ :\ \mathsf{ProcDecl}\ \to \ \mathsf{UnwindModeValue}
$$

$$
\begin{array}{l}
\operatorname{UnwindMode}(\mathsf{proc})\ =\ m\ \Leftrightarrow \ \operatorname{UnwindAttr}(\mathsf{proc})\ =\ m \\[0.16em]
\operatorname{UnwindMode}(\mathsf{proc})\ =\ \texttt{abort}\ \Leftrightarrow \ \operatorname{UnwindAttr}(\mathsf{proc})\ \mathsf{undefined}
\end{array}
$$

$$
\operatorname{UnwindAttr}(\mathsf{proc})\ =\ m\ \Leftrightarrow \ \exists \ a\ \in \ \operatorname{AttrByName}(\mathsf{proc},\ \texttt{"unwind"}).\ a.\mathsf{args}\ =\ [\operatorname{StringLiteral}(m)]\ \land \ m\ \in \ \mathsf{UnwindModeValue}
$$

### 23.7.4 Static Semantics

**Formal UnwindMode Determination**

$$
\mathsf{DetermineUnwindMode}\ :\ \mathsf{ProcDecl}\ \to \ \mathsf{UnwindModeValue}
$$

$$
\begin{array}{l}
\operatorname{DetermineUnwindMode}(\mathsf{proc})\ = \\[0.16em]
\ \mathsf{let}\ \mathsf{attrs}\ =\ \operatorname{AttrByName}(\mathsf{proc},\ \texttt{"unwind"}) \\[0.16em]
\ \mathsf{match}\ \mathsf{attrs}\ \{ \\[0.16em]
\quad []\quad \to \ \texttt{abort} \\[0.16em]
\quad [a]\quad \to \ \operatorname{ParseUnwindArg}(a) \\[0.16em]
\quad \_\quad \to \ \operatorname{Emit}(\texttt{E-FFI-0350}) \\[0.16em]
\ \}
\end{array}
$$

$$
\mathsf{ParseUnwindArg}\ :\ \mathsf{Attr}\ \to \ \mathsf{UnwindModeValue}
$$

$$
\begin{array}{l}
\operatorname{ParseUnwindArg}(a)\ = \\[0.16em]
\ \mathsf{match}\ a.\mathsf{args}\ \{ \\[0.16em]
\quad [\operatorname{StringLiteral}(\texttt{"abort"})]\ \to \ \texttt{abort} \\[0.16em]
\quad [\operatorname{StringLiteral}(\texttt{"catch"})]\ \to \ \texttt{catch} \\[0.16em]
\quad \_\quad \to \ \operatorname{Emit}(\texttt{E-SYS-3355}) \\[0.16em]
\ \}
\end{array}
$$

**(UnwindMode-Valid)**

$$
\begin{array}{l}
\operatorname{UnwindAttr}(\mathsf{proc})\ =\ m\quad m\ \in \ \{\ \texttt{"abort"},\ \texttt{"catch"}\ \} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{UnwindMode}(\mathsf{proc})\ =\ m
\end{array}
$$

**(UnwindMode-Invalid-Err)**

$$
\begin{array}{l}
\operatorname{UnwindAttr}(\mathsf{proc})\ =\ m\quad m\ \notin \ \{\ \texttt{"abort"},\ \texttt{"catch"}\ \}\quad c\ =\ \operatorname{Code}(E-\mathsf{SYS}-3355) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{UnwindMode}(\mathsf{proc})\ \Uparrow \ c
\end{array}
$$

### 23.7.5 Dynamic Semantics

**Boundary Effects.**

1. If a Ultraviolet panic or foreign unwind attempts to cross an FFI boundary with `UnwindMode(proc) = abort`, the program MUST abort.
2. If `UnwindMode(proc) = catch`:
   - imported procedures convert foreign unwinds to Ultraviolet panics;
   - raw exported procedures return `ZeroValue(R)` as defined by §23.3.5;
   - hosted exports return `ZeroValue(R)` as defined by §23.3.12.

General destruction and unwind cleanup semantics remain defined by §24.5.

### 23.7.6 Lowering

**Code Generation Effects**

The `UnwindMode` affects generated code at FFI boundaries:

| Mode    | Import (calling extern)                                | Export / Hosted Export (called from foreign)                    |
| :------ | :----------------------------------------------------- | :-------------------------------------------------------------- |
| `abort` | Install landing pad that aborts on foreign unwind      | Install frame that aborts if Ultraviolet panic escapes          |
| `catch` | Install landing pad that converts to Ultraviolet panic | Install frame that catches unwind and returns the boundary zero |

**(CodeGen-UnwindAbort-Import)**

$$
\begin{array}{l}
\operatorname{UnwindMode}(\mathsf{extern}_{\mathsf{proc}})\ =\ \texttt{abort}\quad \operatorname{CallSite}(\mathsf{extern}_{\mathsf{proc}})\ \mathsf{at}\ \mathsf{location}\ L \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{EmitAbortLandingPad}(L)
\end{array}
$$

**(CodeGen-UnwindCatch-Import)**

$$
\begin{array}{l}
\operatorname{UnwindMode}(\mathsf{extern}_{\mathsf{proc}})\ =\ \texttt{catch}\quad \operatorname{CallSite}(\mathsf{extern}_{\mathsf{proc}})\ \mathsf{at}\ \mathsf{location}\ L \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{EmitCatchLandingPad}(L,\ \mathsf{ConvertToUltravioletPanic})
\end{array}
$$

**(CodeGen-UnwindAbort-Export)**

$$
\begin{array}{l}
\operatorname{UnwindMode}(\mathsf{exported}_{\mathsf{proc}})\ =\ \texttt{abort}\quad \operatorname{EntryPoint}(\mathsf{exported}_{\mathsf{proc}})\ \mathsf{at}\ \mathsf{location}\ L \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{EmitAbortOnPanicFrame}(L)
\end{array}
$$

**(CodeGen-UnwindCatch-Export)**

$$
\begin{array}{l}
\operatorname{UnwindMode}(\mathsf{exported}_{\mathsf{proc}})\ =\ \texttt{catch}\quad \operatorname{EntryPoint}(\mathsf{exported}_{\mathsf{proc}})\ \mathsf{at}\ \mathsf{location}\ L \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\operatorname{EmitCatchExportFrame}(L,\ \mathsf{ReturnZeroValue})
\end{array}
$$

### 23.7.7 Diagnostics

No additional named diagnostics are introduced here.

`[[unwind]]` placement and argument-validation diagnostics are owned by §23.4.7.
