---
title: "2.6 Diagnostic Rendering"
description: "2.6 Diagnostic Rendering from 2. Diagnostic Infrastructure of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "diagnostic-infrastructure"
specSection: "26-diagnostic-rendering"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/diagnostic-infrastructure/">2. Diagnostic Infrastructure</a>
  <span>Diagnostic Infrastructure</span>
</div>

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
