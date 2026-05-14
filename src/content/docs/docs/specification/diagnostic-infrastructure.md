---
title: "Diagnostic Infrastructure"
description: "2. Diagnostic Infrastructure of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
generatedAt: "2026-05-14T00:55:03.609Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>


## 2.1 Source Locations and Spans

**SourceLocation.**

$$
\mathsf{SourceLocation}\ =\ \langle \mathsf{file},\ \mathsf{offset},\ \mathsf{line},\ \mathsf{column}\rangle 
$$

**Span.**

$$
\mathsf{Span}\ =\ \langle \mathsf{file},\ \mathsf{start}_{\mathsf{offset}},\ \mathsf{end}_{\mathsf{offset}},\ \mathsf{start}_{\mathsf{line}},\ \mathsf{start}_{\mathsf{col}},\ \mathsf{end}_{\mathsf{line}},\ \mathsf{end}_{\mathsf{col}}\rangle 
$$

$$
\operatorname{SpanRange}(\mathsf{sp})\ =\ [\mathsf{sp}.\mathsf{start}_{\mathsf{offset}},\ \mathsf{sp}.\mathsf{end}_{\mathsf{offset}})
$$

**(WF-Location)**

$$
\begin{array}{l}
0\ \le \ o\quad \Gamma \ \vdash \ \operatorname{Locate}(S,\ o)\ \Downarrow \ \ell_{\mathsf{loc}}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \ell_{\mathsf{loc}} \ :\ \mathsf{LocationOk}
\end{array}
$$

**(WF-Span)**

$$
\begin{array}{l}
0\ \le \ s\ \le \ e\ \le \ S.\mathsf{byte}_{\mathsf{len}}\quad \Gamma \ \vdash \ \operatorname{Locate}(S,\ s)\ \Downarrow \ \ell_{s} \quad \Gamma \ \vdash \ \operatorname{Locate}(S,\ e)\ \Downarrow \ \ell_{e}  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \langle S.\mathsf{path},\ s,\ e,\ \ell_{s} .\mathsf{line},\ \ell_{s} .\mathsf{column},\ \ell_{e} .\mathsf{line},\ \ell_{e} .\mathsf{column}\rangle \ :\ \mathsf{SpanOk}
\end{array}
$$

**Span Construction**

$$
\begin{array}{l}
\operatorname{ClampSpan}(S,\ s,\ e)\ =\ (s',\ e') \\[0.16em]
s'\ =\ \operatorname{min}(s,\ S.\mathsf{byte}_{\mathsf{len}}) \\[0.16em]
e'\ =\ \operatorname{min}(\operatorname{max}(e,\ s'),\ S.\mathsf{byte}_{\mathsf{len}})
\end{array}
$$

**(Span-Of)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ClampSpan}(S,\ s,\ e)\ \Downarrow \ (s',\ e')\quad \Gamma \ \vdash \ \langle S.\mathsf{path},\ s',\ e',\ \mathsf{line}_{s},\ \mathsf{col}_{s},\ \mathsf{line}_{e},\ \mathsf{col}_{e}\rangle \ :\ \mathsf{SpanOk} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{SpanOf}(S,\ s,\ e)\ \Downarrow \ \langle S.\mathsf{path},\ s',\ e',\ \mathsf{line}_{s},\ \mathsf{col}_{s},\ \mathsf{line}_{e},\ \mathsf{col}_{e}\rangle 
\end{array}
$$

## 2.2 Token Spans

**TokenKind.**

$$
\mathsf{TokenKind}\ =\ \mathsf{TokenKind}\_(\S 4.2.4)\ \cup \ \{\mathsf{Unknown}\}
$$

**(No-Unknown-Ok)**

$$
\begin{array}{l}
\forall \ t\ \in \ K.\ t.\mathsf{kind}\ \ne \ \mathsf{Unknown} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ K\ :\ \mathsf{TokenStreamOk}
\end{array}
$$

**RawToken.**

$$
\mathsf{RawToken}\ =\ \langle \mathsf{kind},\ \mathsf{lexeme},\ s,\ e\rangle 
$$

**Token.**

$$
\mathsf{Token}\ =\ \langle \mathsf{kind},\ \mathsf{lexeme},\ \mathsf{span}\rangle 
$$

**(Attach-Token-Ok)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{SpanOf}(S,\ s,\ e)\ \Downarrow \ \mathsf{sp} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AttachSpan}(S,\ \langle k,\ \ell ,\ s,\ e\rangle )\ \Downarrow \ \langle k,\ \ell ,\ \mathsf{sp}\rangle 
\end{array}
$$

**Token Stream Attachment (Big-Step)**

**(Attach-Tokens-Ok)**

$$
\begin{array}{l}
\forall \ r\ \in \ \mathsf{rs},\ \Gamma \ \vdash \ \operatorname{AttachSpan}(S,\ r)\ \Downarrow \ t\quad \mathsf{ts}\ =\ [t\ \mid \ r\ \in \ \mathsf{rs}] \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AttachSpans}(S,\ \mathsf{rs})\ \Downarrow \ \mathsf{ts}
\end{array}
$$

## 2.3 Diagnostic Records and Emission

**Diagnostic.**

$$
\begin{array}{l}
\mathsf{Severity}\ =\ \{\mathsf{Error},\ \mathsf{Warning},\ \mathsf{Info},\ \mathsf{Panic},\ \mathsf{Note}\} \\[0.16em]
\mathsf{DiagCodeOpt}\ =\ \mathsf{DiagCode}\ \cup \ \{\bot \} \\[0.16em]
\mathsf{Diagnostic}\ =\ \langle \mathsf{code},\ \mathsf{severity},\ \mathsf{message},\ \mathsf{span}\rangle \quad \mathsf{where}\ \mathsf{code}\ \in \ \mathsf{DiagCodeOpt}\ \land \ \mathsf{severity}\ \in \ \mathsf{Severity}
\end{array}
$$

Normative diagnostic tables define only code-owned diagnostics. A diagnostic `d` is code-owned iff `d.code ≠ ⊥`. Auxiliary diagnostics use `d.code = ⊥`; they are admitted only where a feature section defines them explicitly.

**Diagnostic Stream.**

$$
\Delta \ =\ [d_{1},\ \ldots ,\ d_{n}]
$$

**(Emit-Append)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Emit}(\Delta ,\ d)\ \Downarrow \ (\Delta \ \mathbin{++} \ [d])
\end{array}
$$

**Emit (Implicit).**

$$
\begin{array}{l}
\mathsf{SeverityColumn}\ :\ \mathsf{DiagCode}\ \to \ \mathsf{Severity} \\[0.16em]
\mathsf{ConditionColumn}\ :\ \mathsf{DiagCode}\ \to \ \mathsf{String}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{SeverityColumn}(c)\ =\ \mathsf{sev}\ \Leftrightarrow \ a\ \mathsf{normative}\ \mathsf{diagnostic}\ \mathsf{table}\ \mathsf{in}\ \mathsf{this}\ \mathsf{specification}\ \mathsf{defines}\ \mathsf{code}\ \texttt{c}\ \mathsf{with}\ \mathsf{severity}\ \texttt{sev}. \\[0.16em]
\operatorname{ConditionColumn}(c)\ =\ \mathsf{cond}\ \Leftrightarrow \ a\ \mathsf{normative}\ \mathsf{diagnostic}\ \mathsf{table}\ \mathsf{in}\ \mathsf{this}\ \mathsf{specification}\ \mathsf{defines}\ \mathsf{code}\ \texttt{c}\ \mathsf{with}\ \mathsf{condition}\ \mathsf{text}\ \texttt{cond}.
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Emit}(c)\ =\ \operatorname{Emit}(\Delta ,\ \langle c,\ \operatorname{Severity}(c),\ \operatorname{Message}(c),\ \bot \rangle ) \\[0.16em]
\operatorname{Emit}(c,\ \mathsf{sp})\ =\ \operatorname{Emit}(\Delta ,\ \langle c,\ \operatorname{Severity}(c),\ \operatorname{Message}(c),\ \mathsf{sp}\rangle ) \\[0.16em]
\operatorname{EmitList}([])\ =\ \mathsf{ok} \\[0.16em]
\operatorname{EmitList}([d]\ \mathbin{++} \ \mathsf{ds})\ =\ (\Gamma \ \vdash \ \operatorname{Emit}(d))\ \land \ \operatorname{EmitList}(\mathsf{ds})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Severity}(c)\ =\ \operatorname{SeverityColumn}(c) \\[0.16em]
\operatorname{Message}(c)\ =\ \operatorname{ConditionColumn}(c)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{CompileStatus}(\Delta )\ = \\[0.16em]
\ \mathsf{fail}\ \mathsf{if}\ \operatorname{HasError}(\Delta ) \\[0.16em]
\ \mathsf{ok}\quad \mathsf{otherwise}
\end{array}
$$

## 2.4 Diagnostic Code Selection

$$
\begin{array}{l}
\mathsf{SpecCode}\ :\ \mathsf{DiagId}\ \rightharpoonup \ \mathsf{DiagCode} \\[0.16em]
\operatorname{SpecCode}(\mathsf{id})\ =\ c\ \Leftrightarrow \ \mathsf{the}\ \mathsf{owning}\ \mathsf{construct}\ \mathsf{section}\ \mathsf{of}\ \mathsf{this}\ \mathsf{specification}\ \mathsf{assigns}\ \mathsf{diagnostic}\ \mathsf{code}\ \texttt{c}\ \mathsf{to}\ \mathsf{identifier}\ \texttt{id}. \\[0.16em]
\operatorname{SpecCode}(\mathsf{id})\ =\ \bot \ \Leftrightarrow \ \mathsf{no}\ \mathsf{owning}\ \mathsf{construct}\ \mathsf{section}\ \mathsf{of}\ \mathsf{this}\ \mathsf{specification}\ \mathsf{assigns}\ a\ \mathsf{diagnostic}\ \mathsf{code}\ \mathsf{to}\ \texttt{id}.
\end{array}
$$

**(Code)**

$$
\begin{array}{l}
\operatorname{SpecCode}(\mathsf{id})\ =\ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Code}(\mathsf{id})\ \Downarrow \ c
\end{array}
$$

Appendix A is informative only. It MUST NOT define `SpecCode`, `SeverityColumn`, or `ConditionColumn`.

**DiagId-Code Mapping.**
id emits a diagnostic

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Emit}(\operatorname{Code}(\mathsf{id})) \\[0.16em]
\Uparrow \ \equiv \ \Uparrow \ \operatorname{Code}(\mathsf{id})
\end{array}
$$

**Resolution Failure.**

$$
\operatorname{NoDiag}(\uparrow )
$$

## 2.5 Diagnostic Ordering

**(Order)**

$$
\begin{array}{l}
\Delta \ =\ [d_{1},\ d_{2},\ \ldots ,\ d_{n}] \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Order}(\Delta )\ \Downarrow \ [d_{1},\ d_{2},\ \ldots ,\ d_{n}]
\end{array}
$$

## 2.6 Diagnostic Rendering

$$
\begin{array}{l}
\operatorname{Render}(d)\ = \\[0.16em]
\ \mathsf{head}\ \mathbin{++} \ \mathsf{msg}\ \mathbin{++} \ \texttt{" @"}\ \mathbin{++} \ \mathsf{loc}\ \mathsf{if}\ d.\mathsf{span}\ \ne \ \bot  \\[0.16em]
\ \mathsf{head}\ \mathbin{++} \ \mathsf{msg}\quad \mathsf{if}\ d.\mathsf{span}\ =\ \bot 
\end{array}
$$

head =

$$
\begin{array}{l}
\ d.\mathsf{code}\ \mathbin{++} \ \texttt{" ("}\ \mathbin{++} \ \mathsf{sev}\ \mathbin{++} \ \texttt{")"}\ \mathsf{if}\ d.\mathsf{code}\ \ne \ \bot  \\[0.16em]
\ \mathsf{sev}\quad \mathsf{if}\ d.\mathsf{code}\ =\ \bot 
\end{array}
$$
sev =
 "error"   if d.severity = Error
 "warning" if d.severity = Warning
 "info"    if d.severity = Info
 "panic"   if d.severity = Panic
 "note"    if d.severity = Note
msg =
 ""        if d.message = ""

$$
\begin{array}{l}
\ \texttt{": "}\ \mathbin{++} \ d.\mathsf{message}\ \mathsf{otherwise} \\[0.16em]
\mathsf{loc}\ =\ d.\mathsf{span}.\mathsf{file}\ \mathbin{++} \ \texttt{":"}\ \mathbin{++} \ d.\mathsf{span}.\mathsf{start}_{\mathsf{line}}\ \mathbin{++} \ \texttt{":"}\ \mathbin{++} \ d.\mathsf{span}.\mathsf{start}_{\mathsf{col}}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{RenderRich}(d,\ S)\ = \\[0.16em]
\ \mathsf{head}_{\mathsf{rich}}\ \mathbin{++} \ \mathsf{msg}\ \mathbin{++} \ \texttt{"\textbackslash{}n"} \\[0.16em]
\ \mathbin{++} \ \texttt{"  --> "}\ \mathbin{++} \ \mathsf{loc}\ \mathbin{++} \ \texttt{"\textbackslash{}n"} \\[0.16em]
\ \mathbin{++} \ \mathsf{gutter}\ \mathbin{++} \ \texttt{" | "}\ \mathbin{++} \ \operatorname{SourceLine}(S,\ d.\mathsf{span})\ \mathbin{++} \ \texttt{"\textbackslash{}n"} \\[0.16em]
\ \mathbin{++} \ \mathsf{gutter}\ \mathbin{++} \ \texttt{" | "}\ \mathbin{++} \ \operatorname{Underline}(d.\mathsf{span}) \\[0.16em]
\quad \mathsf{if}\ d.\mathsf{span}\ \ne \ \bot \ \land \ \operatorname{S}(d.\mathsf{span}.\mathsf{file})\ \ne \ \bot  \\[0.16em]
\ \mathsf{head}_{\mathsf{rich}}\ \mathbin{++} \ \mathsf{msg} \\[0.16em]
\quad \mathsf{otherwise}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{head}_{\mathsf{rich}}\ = \\[0.16em]
\ \mathsf{sev}\ \mathbin{++} \ \texttt{"["}\ \mathbin{++} \ d.\mathsf{code}\ \mathbin{++} \ \texttt{"]"}\ \mathsf{if}\ d.\mathsf{code}\ \ne \ \bot  \\[0.16em]
\ \mathsf{sev}\quad \mathsf{if}\ d.\mathsf{code}\ =\ \bot 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{SourceLine}(S,\ \mathsf{span})\ =\ \operatorname{Line}(\operatorname{S}(\mathsf{span}.\mathsf{file}),\ \mathsf{span}.\mathsf{start}_{\mathsf{line}}) \\[0.16em]
\operatorname{Underline}(\mathsf{span})\ =\ \operatorname{Spaces}(\mathsf{span}.\mathsf{start}_{\mathsf{col}}\ -\ 1)\ \mathbin{++} \ \operatorname{Repeat}(\texttt{"\^{}"},\ \mathsf{span}.\mathsf{end}_{\mathsf{col}}\ -\ \mathsf{span}.\mathsf{start}_{\mathsf{col}}) \\[0.16em]
\mathsf{gutter}\ =\ \operatorname{PadLeft}(\mathsf{span}.\mathsf{start}_{\mathsf{line}},\ \mathsf{gutterWidth})\ \mathbin{++} \ \texttt{" "} \\[0.16em]
\operatorname{PermLexeme}(\mathsf{const})\ =\ \texttt{"const"} \\[0.16em]
\operatorname{PermLexeme}(\mathsf{unique})\ =\ \texttt{"unique"} \\[0.16em]
\operatorname{PermLexeme}(\mathsf{shared})\ =\ \texttt{"shared"} \\[0.16em]
\operatorname{QualLexeme}(\mathsf{imm})\ =\ \texttt{"imm"} \\[0.16em]
\operatorname{QualLexeme}(\mathsf{mut})\ =\ \texttt{"mut"} \\[0.16em]
\operatorname{PtrStateSuffix}(\bot )\ =\ \texttt{""} \\[0.16em]
\operatorname{PtrStateSuffix}(\mathsf{Valid})\ =\ \texttt{"@Valid"} \\[0.16em]
\operatorname{PtrStateSuffix}(\mathsf{Null})\ =\ \texttt{"@Null"} \\[0.16em]
\operatorname{PtrStateSuffix}(\mathsf{Expired})\ =\ \texttt{"@Expired"} \\[0.16em]
\operatorname{StringStateSuffix}(\bot )\ =\ \texttt{""} \\[0.16em]
\operatorname{StringStateSuffix}(\mathsf{View})\ =\ \texttt{"@View"} \\[0.16em]
\operatorname{StringStateSuffix}(\mathsf{Managed})\ =\ \texttt{"@Managed"} \\[0.16em]
\operatorname{BytesStateSuffix}(\bot )\ =\ \texttt{""} \\[0.16em]
\operatorname{BytesStateSuffix}(\mathsf{View})\ =\ \texttt{"@View"} \\[0.16em]
\operatorname{BytesStateSuffix}(\mathsf{Managed})\ =\ \texttt{"@Managed"} \\[0.16em]
\operatorname{ParamRender}(\langle \bot ,\ T\rangle )\ =\ \operatorname{TypeRender}(T) \\[0.16em]
\operatorname{ParamRender}(\langle \mathsf{move},\ T\rangle )\ =\ \texttt{"move "}\ \mathbin{++} \ \operatorname{TypeRender}(T) \\[0.16em]
\operatorname{TypeRender}(\operatorname{TypePrim}(\mathsf{name}))\ =\ \mathsf{name} \\[0.16em]
\operatorname{TypeRender}(\operatorname{TypeRange}(\mathsf{base}))\ =\ \texttt{"Range<"}\ \mathbin{++} \ \operatorname{TypeRender}(\mathsf{base})\ \mathbin{++} \ \texttt{">"} \\[0.16em]
\operatorname{TypeRender}(\operatorname{TypeRangeInclusive}(\mathsf{base}))\ =\ \texttt{"RangeInclusive<"}\ \mathbin{++} \ \operatorname{TypeRender}(\mathsf{base})\ \mathbin{++} \ \texttt{">"} \\[0.16em]
\operatorname{TypeRender}(\operatorname{TypeRangeFrom}(\mathsf{base}))\ =\ \texttt{"RangeFrom<"}\ \mathbin{++} \ \operatorname{TypeRender}(\mathsf{base})\ \mathbin{++} \ \texttt{">"} \\[0.16em]
\operatorname{TypeRender}(\operatorname{TypeRangeTo}(\mathsf{base}))\ =\ \texttt{"RangeTo<"}\ \mathbin{++} \ \operatorname{TypeRender}(\mathsf{base})\ \mathbin{++} \ \texttt{">"} \\[0.16em]
\operatorname{TypeRender}(\operatorname{TypeRangeToInclusive}(\mathsf{base}))\ =\ \texttt{"RangeToInclusive<"}\ \mathbin{++} \ \operatorname{TypeRender}(\mathsf{base})\ \mathbin{++} \ \texttt{">"} \\[0.16em]
\operatorname{TypeRender}(\mathsf{TypeRangeFull})\ =\ \texttt{"RangeFull"} \\[0.16em]
\operatorname{TypeRender}(\operatorname{TypePerm}(p,\ T))\ =\ \operatorname{PermLexeme}(p)\ \mathbin{++} \ \texttt{" "}\ \mathbin{++} \ \operatorname{TypeRender}(T) \\[0.16em]
\operatorname{TypeRender}(\operatorname{TypeUnion}([T_{1},\ \ldots ,\ T_{n}]))\ =\ \operatorname{Join}(\texttt{" | "},\ [\operatorname{TypeRender}(T_{1}),\ \ldots ,\ \operatorname{TypeRender}(T_{n})]) \\[0.16em]
\operatorname{TypeRender}(\operatorname{TypeFunc}([\langle m_{1},\ T_{1}\rangle ,\ \ldots ,\ \langle m_{n},\ T_{n}\rangle ],\ R))\ =\ \texttt{"("}\ \mathbin{++} \ \operatorname{Join}(\texttt{", "},\ [\operatorname{ParamRender}(\langle m_{1},\ T_{1}\rangle ),\ \ldots ,\ \operatorname{ParamRender}(\langle m_{n},\ T_{n}\rangle )])\ \mathbin{++} \ \texttt{") -> "}\ \mathbin{++} \ \operatorname{TypeRender}(R) \\[0.16em]
\operatorname{TypeRender}(\operatorname{TypeTuple}([]))\ =\ \texttt{"()"} \\[0.16em]
\operatorname{TypeRender}(\operatorname{TypeTuple}([T]))\ =\ \texttt{"("}\ \mathbin{++} \ \operatorname{TypeRender}(T)\ \mathbin{++} \ \texttt{";)"} \\[0.16em]
\operatorname{TypeRender}(\operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}]))\ =\ \texttt{"("}\ \mathbin{++} \ \operatorname{Join}(\texttt{", "},\ [\operatorname{TypeRender}(T_{1}),\ \ldots ,\ \operatorname{TypeRender}(T_{n})])\ \mathbin{++} \ \texttt{")"} \\[0.16em]
\operatorname{TypeRender}(\operatorname{TypeArray}(T,\ e))\ =\ \texttt{"["}\ \mathbin{++} \ \operatorname{TypeRender}(T)\ \mathbin{++} \ \texttt{"; "}\ \mathbin{++} \ \operatorname{ArrayLen}(e)\ \mathbin{++} \ \texttt{"]"} \\[0.16em]
\operatorname{TypeRender}(\operatorname{TypeSlice}(T))\ =\ \texttt{"["}\ \mathbin{++} \ \operatorname{TypeRender}(T)\ \mathbin{++} \ \texttt{"]"} \\[0.16em]
\operatorname{TypeRender}(\operatorname{TypePtr}(T,\ s))\ =\ \texttt{"Ptr<"}\ \mathbin{++} \ \operatorname{TypeRender}(T)\ \mathbin{++} \ \texttt{">"}\ \mathbin{++} \ \operatorname{PtrStateSuffix}(s) \\[0.16em]
\operatorname{TypeRender}(\operatorname{TypeRawPtr}(q,\ T))\ =\ \texttt{"* "}\ \mathbin{++} \ \operatorname{QualLexeme}(q)\ \mathbin{++} \ \texttt{" "}\ \mathbin{++} \ \operatorname{TypeRender}(T) \\[0.16em]
\operatorname{TypeRender}(\operatorname{TypeString}(\mathsf{st}))\ =\ \texttt{"string"}\ \mathbin{++} \ \operatorname{StringStateSuffix}(\mathsf{st}) \\[0.16em]
\operatorname{TypeRender}(\operatorname{TypeBytes}(\mathsf{st}))\ =\ \texttt{"bytes"}\ \mathbin{++} \ \operatorname{BytesStateSuffix}(\mathsf{st}) \\[0.16em]
\operatorname{TypeRender}(\operatorname{TypeDynamic}(p))\ =\ \texttt{"\$"}\ \mathbin{++} \ \operatorname{StringOfPath}(p) \\[0.16em]
\operatorname{TypeRender}(\operatorname{TypeApply}(p,\ \mathsf{args}))\ =\ \operatorname{StringOfPath}(p)\ \mathbin{++} \ \texttt{"<"}\ \mathbin{++} \ \operatorname{Join}(\texttt{", "},\ [\operatorname{TypeRender}(a)\ \mid \ a\ \in \ \mathsf{args}])\ \mathbin{++} \ \texttt{">"} \\[0.16em]
\operatorname{TypeRender}(\operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ S))\ =\ \operatorname{ModalRefRender}(\mathsf{modal}_{\mathsf{ref}})\ \mathbin{++} \ \texttt{"@"}\ \mathbin{++} \ S \\[0.16em]
\operatorname{TypeRender}(\operatorname{TypePath}(p))\ =\ \operatorname{StringOfPath}(p) \\[0.16em]
\operatorname{ModalRefRender}(\operatorname{TypePath}(p))\ =\ \operatorname{StringOfPath}(p) \\[0.16em]
\operatorname{ModalRefRender}(\operatorname{TypeApply}(p,\ \mathsf{args}))\ =\ \operatorname{StringOfPath}(p)\ \mathbin{++} \ \texttt{"<"}\ \mathbin{++} \ \operatorname{Join}(\texttt{", "},\ [\operatorname{TypeRender}(a)\ \mid \ a\ \in \ \mathsf{args}])\ \mathbin{++} \ \texttt{">"}
\end{array}
$$

## 2.7 Diagnostics Without Source Spans

**(NoSpan-External)**

$$
\begin{array}{l}
\operatorname{Origin}(d)\ =\ \mathsf{External} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ d.\mathsf{span}\ =\ \bot 
\end{array}
$$
