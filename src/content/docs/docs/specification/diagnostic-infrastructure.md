---
title: "Diagnostic Infrastructure"
description: "2. Diagnostic Infrastructure of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T18:13:03.158Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## 2. Diagnostic Infrastructure

### 2.1 Source Locations and Spans

**SourceLocation.**

```math
\mathsf{SourceLocation}\ =\ \langle \mathsf{file},\ \mathsf{offset},\ \mathsf{line},\ \mathsf{column}\rangle 
```

**Span.**

```math
\mathsf{Span}\ =\ \langle \mathsf{file},\ \mathsf{start}_{\mathsf{offset}},\ \mathsf{end}_{\mathsf{offset}},\ \mathsf{start}_{\mathsf{line}},\ \mathsf{start}_{\mathsf{col}},\ \mathsf{end}_{\mathsf{line}},\ \mathsf{end}_{\mathsf{col}}\rangle 
```

```math
\operatorname{SpanRange}(\mathsf{sp})\ =\ [\mathsf{sp}.\mathsf{start}_{\mathsf{offset}},\ \mathsf{sp}.\mathsf{end}_{\mathsf{offset}})
```

**(WF-Location)**

```math
\begin{array}{l}
0\ \le \ o\quad \Gamma \ \vdash \ \operatorname{Locate}(S,\ o)\ \Downarrow \ \ell_{\mathsf{loc}}  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \ell_{\mathsf{loc}} \ :\ \mathsf{LocationOk}
\end{array}
```

**(WF-Span)**

```math
\begin{array}{l}
0\ \le \ s\ \le \ e\ \le \ S.\mathsf{byte}_{\mathsf{len}}\quad \Gamma \ \vdash \ \operatorname{Locate}(S,\ s)\ \Downarrow \ \ell_{s} \quad \Gamma \ \vdash \ \operatorname{Locate}(S,\ e)\ \Downarrow \ \ell_{e}  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \langle S.\mathsf{path},\ s,\ e,\ \ell_{s} .\mathsf{line},\ \ell_{s} .\mathsf{column},\ \ell_{e} .\mathsf{line},\ \ell_{e} .\mathsf{column}\rangle \ :\ \mathsf{SpanOk}
\end{array}
```

**Span Construction**

```math
\begin{array}{l}
\operatorname{ClampSpan}(S,\ s,\ e)\ =\ (s',\ e') \\
s'\ =\ \operatorname{min}(s,\ S.\mathsf{byte}_{\mathsf{len}}) \\
e'\ =\ \operatorname{min}(\operatorname{max}(e,\ s'),\ S.\mathsf{byte}_{\mathsf{len}})
\end{array}
```

**(Span-Of)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ClampSpan}(S,\ s,\ e)\ \Downarrow \ (s',\ e')\quad \Gamma \ \vdash \ \langle S.\mathsf{path},\ s',\ e',\ \mathsf{line}_{s},\ \mathsf{col}_{s},\ \mathsf{line}_{e},\ \mathsf{col}_{e}\rangle \ :\ \mathsf{SpanOk} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{SpanOf}(S,\ s,\ e)\ \Downarrow \ \langle S.\mathsf{path},\ s',\ e',\ \mathsf{line}_{s},\ \mathsf{col}_{s},\ \mathsf{line}_{e},\ \mathsf{col}_{e}\rangle 
\end{array}
```

### 2.2 Token Spans

**TokenKind.**

```math
\mathsf{TokenKind}\ =\ \mathsf{TokenKind}\_(\S 4.2.4)\ \cup \ \{\mathsf{Unknown}\}
```

**(No-Unknown-Ok)**

```math
\begin{array}{l}
\forall \ t\ \in \ K.\ t.\mathsf{kind}\ \ne \ \mathsf{Unknown} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ K\ :\ \mathsf{TokenStreamOk}
\end{array}
```

**RawToken.**

```math
\mathsf{RawToken}\ =\ \langle \mathsf{kind},\ \mathsf{lexeme},\ s,\ e\rangle 
```

**Token.**

```math
\mathsf{Token}\ =\ \langle \mathsf{kind},\ \mathsf{lexeme},\ \mathsf{span}\rangle 
```

**(Attach-Token-Ok)**

```math
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{SpanOf}(S,\ s,\ e)\ \Downarrow \ \mathsf{sp} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{AttachSpan}(S,\ \langle k,\ \ell ,\ s,\ e\rangle )\ \Downarrow \ \langle k,\ \ell ,\ \mathsf{sp}\rangle 
\end{array}
```

**Token Stream Attachment (Big-Step)**

**(Attach-Tokens-Ok)**

```math
\begin{array}{l}
\forall \ r\ \in \ \mathsf{rs},\ \Gamma \ \vdash \ \operatorname{AttachSpan}(S,\ r)\ \Downarrow \ t\quad \mathsf{ts}\ =\ [t\ \mid \ r\ \in \ \mathsf{rs}] \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{AttachSpans}(S,\ \mathsf{rs})\ \Downarrow \ \mathsf{ts}
\end{array}
```

### 2.3 Diagnostic Records and Emission

**Diagnostic.**

```math
\begin{array}{l}
\mathsf{Severity}\ =\ \{\mathsf{Error},\ \mathsf{Warning},\ \mathsf{Info},\ \mathsf{Panic},\ \mathsf{Note}\} \\
\mathsf{DiagCodeOpt}\ =\ \mathsf{DiagCode}\ \cup \ \{\bot \} \\
\mathsf{Diagnostic}\ =\ \langle \mathsf{code},\ \mathsf{severity},\ \mathsf{message},\ \mathsf{span}\rangle \quad \mathsf{where}\ \mathsf{code}\ \in \ \mathsf{DiagCodeOpt}\ \land \ \mathsf{severity}\ \in \ \mathsf{Severity}
\end{array}
```

```math
\mathsf{Normative}\ \mathsf{diagnostic}\ \mathsf{tables}\ \mathsf{define}\ \mathsf{only}\ \mathsf{code}-\mathsf{owned}\ \mathsf{diagnostics}.\ A\ \mathsf{diagnostic}\ \texttt{d}\ \mathsf{is}\ \mathsf{code}-\mathsf{owned}\ \mathsf{iff}\ \texttt{d.code != bottom}.\ \mathsf{Auxiliary}\ \mathsf{diagnostics}\ \mathsf{use}\ \texttt{d.code = bottom};\ \mathsf{they}\ \mathsf{are}\ \mathsf{admitted}\ \mathsf{only}\ \mathsf{where}\ a\ \mathsf{feature}\ \mathsf{section}\ \mathsf{defines}\ \mathsf{them}\ \mathsf{explicitly}.
```

**Diagnostic Stream.**
Δ = [d_1, …, d_n]

**(Emit-Append)**

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Emit}(\Delta ,\ d)\ \Downarrow \ (\Delta \ \mathbin{++} \ [d])
\end{array}
```

**Emit (Implicit).**

```math
\begin{array}{l}
\mathsf{SeverityColumn}\ :\ \mathsf{DiagCode}\ \to \ \mathsf{Severity} \\
\mathsf{ConditionColumn}\ :\ \mathsf{DiagCode}\ \to \ \mathsf{String}
\end{array}
```

```math
\begin{array}{l}
\operatorname{SeverityColumn}(c)\ =\ \mathsf{sev}\ \Leftrightarrow \ a\ \mathsf{normative}\ \mathsf{diagnostic}\ \mathsf{table}\ \mathsf{in}\ \mathsf{this}\ \mathsf{specification}\ \mathsf{defines}\ \mathsf{code}\ \texttt{c}\ \mathsf{with}\ \mathsf{severity}\ \texttt{sev}. \\
\operatorname{ConditionColumn}(c)\ =\ \mathsf{cond}\ \Leftrightarrow \ a\ \mathsf{normative}\ \mathsf{diagnostic}\ \mathsf{table}\ \mathsf{in}\ \mathsf{this}\ \mathsf{specification}\ \mathsf{defines}\ \mathsf{code}\ \texttt{c}\ \mathsf{with}\ \mathsf{condition}\ \mathsf{text}\ \texttt{cond}.
\end{array}
```

```math
\begin{array}{l}
\operatorname{Emit}(c)\ =\ \operatorname{Emit}(\Delta ,\ \langle c,\ \operatorname{Severity}(c),\ \operatorname{Message}(c),\ \bot \rangle ) \\
\operatorname{Emit}(c,\ \mathsf{sp})\ =\ \operatorname{Emit}(\Delta ,\ \langle c,\ \operatorname{Severity}(c),\ \operatorname{Message}(c),\ \mathsf{sp}\rangle ) \\
\operatorname{EmitList}([])\ =\ \mathsf{ok} \\
\operatorname{EmitList}([d]\ \mathbin{++} \ \mathsf{ds})\ =\ (\Gamma \ \vdash \ \operatorname{Emit}(d))\ \land \ \operatorname{EmitList}(\mathsf{ds})
\end{array}
```

```math
\begin{array}{l}
\operatorname{Severity}(c)\ =\ \operatorname{SeverityColumn}(c) \\
\operatorname{Message}(c)\ =\ \operatorname{ConditionColumn}(c)
\end{array}
```

```math
\begin{array}{l}
\operatorname{CompileStatus}(\Delta )\ = \\
\ \mathsf{fail}\ \mathsf{if}\ \operatorname{HasError}(\Delta ) \\
\ \mathsf{ok}\quad \mathsf{otherwise}
\end{array}
```

### 2.4 Diagnostic Code Selection

SpecCode : DiagId ⇀ DiagCode

```math
\begin{array}{l}
\operatorname{SpecCode}(\mathsf{id})\ =\ c\ \Leftrightarrow \ \mathsf{the}\ \mathsf{owning}\ \mathsf{construct}\ \mathsf{section}\ \mathsf{of}\ \mathsf{this}\ \mathsf{specification}\ \mathsf{assigns}\ \mathsf{diagnostic}\ \mathsf{code}\ \texttt{c}\ \mathsf{to}\ \mathsf{identifier}\ \texttt{id}. \\
\operatorname{SpecCode}(\mathsf{id})\ =\ \bot \ \Leftrightarrow \ \mathsf{no}\ \mathsf{owning}\ \mathsf{construct}\ \mathsf{section}\ \mathsf{of}\ \mathsf{this}\ \mathsf{specification}\ \mathsf{assigns}\ a\ \mathsf{diagnostic}\ \mathsf{code}\ \mathsf{to}\ \texttt{id}.
\end{array}
```

**(Code)**

```math
\begin{array}{l}
\operatorname{SpecCode}(\mathsf{id})\ =\ c \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Code}(\mathsf{id})\ \Downarrow \ c
\end{array}
```

Appendix A is informative only. It MUST NOT define `SpecCode`, `SeverityColumn`, or `ConditionColumn`.

**DiagId-Code Mapping.**
id emits a diagnostic

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Emit}(\operatorname{Code}(\mathsf{id})) \\
\Uparrow \ \equiv \ \Uparrow \ \operatorname{Code}(\mathsf{id})
\end{array}
```

**Resolution Failure.**
NoDiag(↑)

### 2.5 Diagnostic Ordering

**(Order)**
Δ = [d_1, d_2, …, d_n]

```math
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Order}(\Delta )\ \Downarrow \ [d_{1},\ d_{2},\ \ldots ,\ d_{n}]
\end{array}
```

### 2.6 Diagnostic Rendering

```math
\begin{array}{l}
\operatorname{Render}(d)\ = \\
\ \mathsf{head}\ \mathbin{++} \ \mathsf{msg}\ \mathbin{++} \ \texttt{" @"}\ \mathbin{++} \ \mathsf{loc}\ \mathsf{if}\ d.\mathsf{span}\ \ne \ \bot  \\
\ \mathsf{head}\ \mathbin{++} \ \mathsf{msg}\quad \mathsf{if}\ d.\mathsf{span}\ =\ \bot 
\end{array}
```

head =

```math
\begin{array}{l}
\ d.\mathsf{code}\ \mathbin{++} \ \texttt{" ("}\ \mathbin{++} \ \mathsf{sev}\ \mathbin{++} \ \texttt{")"}\ \mathsf{if}\ d.\mathsf{code}\ \ne \ \bot  \\
\ \mathsf{sev}\quad \mathsf{if}\ d.\mathsf{code}\ =\ \bot 
\end{array}
```
sev =
 "error"   if d.severity = Error
 "warning" if d.severity = Warning
 "info"    if d.severity = Info
 "panic"   if d.severity = Panic
 "note"    if d.severity = Note
msg =
 ""        if d.message = ""

```math
\begin{array}{l}
\ \texttt{": "}\ \mathbin{++} \ d.\mathsf{message}\ \mathsf{otherwise} \\
\mathsf{loc}\ =\ d.\mathsf{span}.\mathsf{file}\ \mathbin{++} \ \texttt{":"}\ \mathbin{++} \ d.\mathsf{span}.\mathsf{start}_{\mathsf{line}}\ \mathbin{++} \ \texttt{":"}\ \mathbin{++} \ d.\mathsf{span}.\mathsf{start}_{\mathsf{col}}
\end{array}
```

```math
\begin{array}{l}
\operatorname{RenderRich}(d,\ S)\ = \\
\ \mathsf{head}_{\mathsf{rich}}\ \mathbin{++} \ \mathsf{msg}\ \mathbin{++} \ \texttt{"\textbackslash{}n"} \\
\ \mathbin{++} \ \texttt{"  --> "}\ \mathbin{++} \ \mathsf{loc}\ \mathbin{++} \ \texttt{"\textbackslash{}n"} \\
\ \mathbin{++} \ \mathsf{gutter}\ \mathbin{++} \ \texttt{" | "}\ \mathbin{++} \ \operatorname{SourceLine}(S,\ d.\mathsf{span})\ \mathbin{++} \ \texttt{"\textbackslash{}n"} \\
\ \mathbin{++} \ \mathsf{gutter}\ \mathbin{++} \ \texttt{" | "}\ \mathbin{++} \ \operatorname{Underline}(d.\mathsf{span}) \\
\quad \mathsf{if}\ d.\mathsf{span}\ \ne \ \bot \ \land \ \operatorname{S}(d.\mathsf{span}.\mathsf{file})\ \ne \ \bot  \\
\ \mathsf{head}_{\mathsf{rich}}\ \mathbin{++} \ \mathsf{msg} \\
\quad \mathsf{otherwise}
\end{array}
```

```math
\begin{array}{l}
\mathsf{head}_{\mathsf{rich}}\ = \\
\ \mathsf{sev}\ \mathbin{++} \ \texttt{"["}\ \mathbin{++} \ d.\mathsf{code}\ \mathbin{++} \ \texttt{"]"}\ \mathsf{if}\ d.\mathsf{code}\ \ne \ \bot  \\
\ \mathsf{sev}\quad \mathsf{if}\ d.\mathsf{code}\ =\ \bot 
\end{array}
```

```math
\begin{array}{l}
\operatorname{SourceLine}(S,\ \mathsf{span})\ =\ \operatorname{Line}(\operatorname{S}(\mathsf{span}.\mathsf{file}),\ \mathsf{span}.\mathsf{start}_{\mathsf{line}}) \\
\operatorname{Underline}(\mathsf{span})\ =\ \operatorname{Spaces}(\mathsf{span}.\mathsf{start}_{\mathsf{col}}\ -\ 1)\ \mathbin{++} \ \operatorname{Repeat}(\texttt{"\^{}"},\ \mathsf{span}.\mathsf{end}_{\mathsf{col}}\ -\ \mathsf{span}.\mathsf{start}_{\mathsf{col}}) \\
\mathsf{gutter}\ =\ \operatorname{PadLeft}(\mathsf{span}.\mathsf{start}_{\mathsf{line}},\ \mathsf{gutterWidth})\ \mathbin{++} \ \texttt{" "} \\
\operatorname{PermLexeme}(\mathsf{const})\ =\ \texttt{"const"} \\
\operatorname{PermLexeme}(\mathsf{unique})\ =\ \texttt{"unique"} \\
\operatorname{PermLexeme}(\mathsf{shared})\ =\ \texttt{"shared"} \\
\operatorname{QualLexeme}(\mathsf{imm})\ =\ \texttt{"imm"} \\
\operatorname{QualLexeme}(\mathsf{mut})\ =\ \texttt{"mut"} \\
\operatorname{PtrStateSuffix}(\bot )\ =\ \texttt{""} \\
\operatorname{PtrStateSuffix}(\mathsf{Valid})\ =\ \texttt{"@Valid"} \\
\operatorname{PtrStateSuffix}(\mathsf{Null})\ =\ \texttt{"@Null"} \\
\operatorname{PtrStateSuffix}(\mathsf{Expired})\ =\ \texttt{"@Expired"} \\
\operatorname{StringStateSuffix}(\bot )\ =\ \texttt{""} \\
\operatorname{StringStateSuffix}(\mathsf{View})\ =\ \texttt{"@View"} \\
\operatorname{StringStateSuffix}(\mathsf{Managed})\ =\ \texttt{"@Managed"} \\
\operatorname{BytesStateSuffix}(\bot )\ =\ \texttt{""} \\
\operatorname{BytesStateSuffix}(\mathsf{View})\ =\ \texttt{"@View"} \\
\operatorname{BytesStateSuffix}(\mathsf{Managed})\ =\ \texttt{"@Managed"} \\
\operatorname{ParamRender}(\langle \bot ,\ T\rangle )\ =\ \operatorname{TypeRender}(T) \\
\operatorname{ParamRender}(\langle \mathsf{move},\ T\rangle )\ =\ \texttt{"move "}\ \mathbin{++} \ \operatorname{TypeRender}(T) \\
\operatorname{TypeRender}(\operatorname{TypePrim}(\mathsf{name}))\ =\ \mathsf{name} \\
\operatorname{TypeRender}(\operatorname{TypeRange}(\mathsf{base}))\ =\ \texttt{"Range<"}\ \mathbin{++} \ \operatorname{TypeRender}(\mathsf{base})\ \mathbin{++} \ \texttt{">"} \\
\operatorname{TypeRender}(\operatorname{TypeRangeInclusive}(\mathsf{base}))\ =\ \texttt{"RangeInclusive<"}\ \mathbin{++} \ \operatorname{TypeRender}(\mathsf{base})\ \mathbin{++} \ \texttt{">"} \\
\operatorname{TypeRender}(\operatorname{TypeRangeFrom}(\mathsf{base}))\ =\ \texttt{"RangeFrom<"}\ \mathbin{++} \ \operatorname{TypeRender}(\mathsf{base})\ \mathbin{++} \ \texttt{">"} \\
\operatorname{TypeRender}(\operatorname{TypeRangeTo}(\mathsf{base}))\ =\ \texttt{"RangeTo<"}\ \mathbin{++} \ \operatorname{TypeRender}(\mathsf{base})\ \mathbin{++} \ \texttt{">"} \\
\operatorname{TypeRender}(\operatorname{TypeRangeToInclusive}(\mathsf{base}))\ =\ \texttt{"RangeToInclusive<"}\ \mathbin{++} \ \operatorname{TypeRender}(\mathsf{base})\ \mathbin{++} \ \texttt{">"} \\
\operatorname{TypeRender}(\mathsf{TypeRangeFull})\ =\ \texttt{"RangeFull"} \\
\operatorname{TypeRender}(\operatorname{TypePerm}(p,\ T))\ =\ \operatorname{PermLexeme}(p)\ \mathbin{++} \ \texttt{" "}\ \mathbin{++} \ \operatorname{TypeRender}(T) \\
\operatorname{TypeRender}(\operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}]))\ =\ \operatorname{Join}(\texttt{" | "},\ [\operatorname{TypeRender}(T_{1}),\ \ldots ,\ \operatorname{TypeRender}(T_{n})]) \\
\operatorname{TypeRender}(\operatorname{TypeFunc}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ],\ R))\ =\ \texttt{"("}\ \mathbin{++} \ \operatorname{Join}(\texttt{", "},\ [\operatorname{ParamRender}(\langle m_{1},\ T_{1}\rangle ),\ \ldots ,\ \operatorname{ParamRender}(\langle m_{n},\ T_{n}\rangle )])\ \mathbin{++} \ \texttt{") -> "}\ \mathbin{++} \ \operatorname{TypeRender}(R) \\
\operatorname{TypeRender}(\operatorname{TypeTuple}([]))\ =\ \texttt{"()"} \\
\operatorname{TypeRender}(\operatorname{TypeTuple}([T]))\ =\ \texttt{"("}\ \mathbin{++} \ \operatorname{TypeRender}(T)\ \mathbin{++} \ \texttt{";)"} \\
\operatorname{TypeRender}(\operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}]))\ =\ \texttt{"("}\ \mathbin{++} \ \operatorname{Join}(\texttt{", "},\ [\operatorname{TypeRender}(T_{1}),\ \ldots ,\ \operatorname{TypeRender}(T_{n})])\ \mathbin{++} \ \texttt{")"} \\
\operatorname{TypeRender}(\operatorname{TypeArray}(T,\ e))\ =\ \texttt{"["}\ \mathbin{++} \ \operatorname{TypeRender}(T)\ \mathbin{++} \ \texttt{"; "}\ \mathbin{++} \ \operatorname{ArrayLen}(e)\ \mathbin{++} \ \texttt{"]"} \\
\operatorname{TypeRender}(\operatorname{TypeSlice}(T))\ =\ \texttt{"["}\ \mathbin{++} \ \operatorname{TypeRender}(T)\ \mathbin{++} \ \texttt{"]"} \\
\operatorname{TypeRender}(\operatorname{TypePtr}(T,\ s))\ =\ \texttt{"Ptr<"}\ \mathbin{++} \ \operatorname{TypeRender}(T)\ \mathbin{++} \ \texttt{">"}\ \mathbin{++} \ \operatorname{PtrStateSuffix}(s) \\
\operatorname{TypeRender}(\operatorname{TypeRawPtr}(q,\ T))\ =\ \texttt{"* "}\ \mathbin{++} \ \operatorname{QualLexeme}(q)\ \mathbin{++} \ \texttt{" "}\ \mathbin{++} \ \operatorname{TypeRender}(T) \\
\operatorname{TypeRender}(\operatorname{TypeString}(\mathsf{st}))\ =\ \texttt{"string"}\ \mathbin{++} \ \operatorname{StringStateSuffix}(\mathsf{st}) \\
\operatorname{TypeRender}(\operatorname{TypeBytes}(\mathsf{st}))\ =\ \texttt{"bytes"}\ \mathbin{++} \ \operatorname{BytesStateSuffix}(\mathsf{st}) \\
\operatorname{TypeRender}(\operatorname{TypeDynamic}(p))\ =\ \texttt{"\$"}\ \mathbin{++} \ \operatorname{StringOfPath}(p) \\
\operatorname{TypeRender}(\operatorname{TypeApply}(p,\ \mathsf{args}))\ =\ \operatorname{StringOfPath}(p)\ \mathbin{++} \ \texttt{"<"}\ \mathbin{++} \ \operatorname{Join}(\texttt{", "},\ [\operatorname{TypeRender}(a)\ \mid \ a\ \in \ \mathsf{args}])\ \mathbin{++} \ \texttt{">"} \\
\operatorname{TypeRender}(\operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S))\ =\ \operatorname{ModalRefRender}(\mathsf{modal}_{\mathsf{ref}})\ \mathbin{++} \ \texttt{"@"}\ \mathbin{++} \ S \\
\operatorname{TypeRender}(\operatorname{TypePath}(p))\ =\ \operatorname{StringOfPath}(p) \\
\operatorname{ModalRefRender}(\operatorname{TypePath}(p))\ =\ \operatorname{StringOfPath}(p) \\
\operatorname{ModalRefRender}(\operatorname{TypeApply}(p,\ \mathsf{args}))\ =\ \operatorname{StringOfPath}(p)\ \mathbin{++} \ \texttt{"<"}\ \mathbin{++} \ \operatorname{Join}(\texttt{", "},\ [\operatorname{TypeRender}(a)\ \mid \ a\ \in \ \mathsf{args}])\ \mathbin{++} \ \texttt{">"}
\end{array}
```

### 2.7 Diagnostics Without Source Spans

**(NoSpan-External)**

```math
\begin{array}{l}
\operatorname{Origin}(d)\ =\ \mathsf{External} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ d.\mathsf{span}\ =\ \bot 
\end{array}
```
