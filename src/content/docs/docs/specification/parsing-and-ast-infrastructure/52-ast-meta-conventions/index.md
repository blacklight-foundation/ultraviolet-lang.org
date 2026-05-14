---
title: "5.2 AST Meta-Conventions"
description: "5.2 AST Meta-Conventions from 5. Parsing and AST Infrastructure of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "parsing-and-ast-infrastructure"
specSection: "52-ast-meta-conventions"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/parsing-and-ast-infrastructure/">5. Parsing and AST Infrastructure</a>
  <span>Parsing and AST Infrastructure</span>
</div>

## 5.2 AST Meta-Conventions

$$
\begin{array}{l}
\mathsf{ASTNode}\ =\ \mathsf{ASTItem}\ \cup \ \mathsf{ASTExpr}\ \cup \ \mathsf{ASTPattern}\ \cup \ \mathsf{ASTType}\ \cup \ \mathsf{ASTStmt} \\[0.16em]
\mathsf{SpanOfNode}\ :\ \mathsf{ASTNode}\ \to \ \mathsf{Span} \\[0.16em]
\mathsf{DocOf}\ :\ \mathsf{ASTNode}\ \to \ (\mathsf{DocList}\ \cup \ \{\bot \})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{SpanDefault}(P,\ P')\ =\ \operatorname{SpanBetween}(P,\ P') \\[0.16em]
\mathsf{DocDefault}\ =\ [] \\[0.16em]
\mathsf{DocOptDefault}\ =\ \bot  \\[0.16em]
\operatorname{FillSpan}(n,\ P,\ P')\ = \\[0.16em]
\ n[\mathsf{span}\ :=\ \operatorname{SpanDefault}(P,\ P')]\ \mathsf{if}\ \operatorname{SpanMissing}(n) \\[0.16em]
\ n\quad \mathsf{otherwise} \\[0.16em]
\operatorname{FillDoc}(n)\ = \\[0.16em]
\ n[\mathsf{doc}\ :=\ \mathsf{DocDefault}]\ \mathsf{if}\ \operatorname{DocMissing}(n) \\[0.16em]
\ n\quad \mathsf{otherwise} \\[0.16em]
\operatorname{FillDocOpt}(n)\ = \\[0.16em]
\ n[\mathsf{doc}_{\mathsf{opt}}\ :=\ \mathsf{DocOptDefault}]\ \mathsf{if}\ \operatorname{DocOptMissing}(n) \\[0.16em]
\ n\quad \mathsf{otherwise} \\[0.16em]
\operatorname{ParseCtor}(n,\ P,\ P')\ =\ \operatorname{FillDocOpt}(\operatorname{FillDoc}(\operatorname{FillSpan}(n,\ P,\ P')))
\end{array}
$$

$$
\mathsf{DocList}\ =\ [\mathsf{DocComment}]
$$

$$
\mathsf{ASTItem}\ \in \ \{\mathsf{ImportDecl},\ \mathsf{UsingDecl},\ \mathsf{ExternBlock},\ \mathsf{StaticDecl},\ \mathsf{ProcedureDecl},\ \mathsf{CtProc},\ \mathsf{RecordDecl},\ \mathsf{EnumDecl},\ \mathsf{ModalDecl},\ \mathsf{ClassDecl},\ \mathsf{TypeAliasDecl},\ \mathsf{DeriveTargetDecl},\ \mathsf{ErrorItem}\}
$$

**ErrorItem.**

$$
\begin{array}{l}
\mathsf{ErrorItem}\ =\ \langle \mathsf{span}\rangle  \\[0.16em]
\operatorname{IsDecl}(\operatorname{ErrorItem}(\_))\ =\ \mathsf{false}
\end{array}
$$

**Type.**

$$
\begin{array}{l}
\mathsf{Type}\ =\ \{\operatorname{TypePerm}(\mathsf{perm},\ \mathsf{base}),\ \operatorname{TypePrim}(\mathsf{name}),\ \operatorname{TypeTuple}(\mathsf{elems}),\ \operatorname{TypeArray}(\mathsf{elem},\ \mathsf{size}_{\mathsf{expr}}),\ \operatorname{TypeSlice}(\mathsf{elem}),\ \operatorname{TypeUnion}(\mathsf{members}),\ \operatorname{TypeFunc}(\mathsf{params},\ \mathsf{ret}),\ \operatorname{TypePath}(\mathsf{path}),\ \operatorname{TypeApply}(\mathsf{path},\ \mathsf{args}),\ \operatorname{TypeDynamic}(\mathsf{path}),\ \operatorname{TypeOpaque}(\mathsf{path}),\ \operatorname{TypeRefine}(\mathsf{base},\ \mathsf{pred}),\ \operatorname{TypeString}(\mathsf{string}_{\mathsf{state}\_\mathsf{opt}}),\ \operatorname{TypeBytes}(\mathsf{bytes}_{\mathsf{state}\_\mathsf{opt}}),\ \operatorname{TypeModalState}(\mathsf{modal}_{\mathsf{ref}},\ \mathsf{state}),\ \operatorname{TypePtr}(\mathsf{elem},\ \mathsf{ptr}_{\mathsf{state}\_\mathsf{opt}}),\ \operatorname{TypeRawPtr}(\mathsf{qual},\ \mathsf{elem}),\ \operatorname{TypeRange}(\mathsf{base}),\ \operatorname{TypeRangeInclusive}(\mathsf{base}),\ \operatorname{TypeRangeFrom}(\mathsf{base}),\ \operatorname{TypeRangeTo}(\mathsf{base}),\ \operatorname{TypeRangeToInclusive}(\mathsf{base}),\ \mathsf{TypeRangeFull},\ \operatorname{TypeClosure}(\mathsf{params},\ \mathsf{ret},\ \mathsf{deps}_{\mathsf{opt}})\} \\[0.16em]
\mathsf{TypeApply}\ =\ \langle \mathsf{path},\ \mathsf{args}\rangle  \\[0.16em]
\mathsf{TypeOpaque}\ =\ \langle \mathsf{path}\rangle  \\[0.16em]
\mathsf{TypeRefine}\ =\ \langle \mathsf{base},\ \mathsf{pred}\rangle  \\[0.16em]
\mathsf{TypeClosure}\ =\ \langle \mathsf{params},\ \mathsf{ret},\ \mathsf{deps}_{\mathsf{opt}}\rangle \quad \mathsf{params}\ \in \ [\mathsf{ParamType}],\ \mathsf{ret}\ \in \ \mathsf{Type},\ \mathsf{deps}_{\mathsf{opt}}\ \in \ \{\bot \}\ \cup \ \mathsf{SharedDeps} \\[0.16em]
\mathsf{SharedDep}\ =\ \langle \mathsf{name},\ \mathsf{type}\rangle \ \mathsf{where}\ \mathsf{name}\ \in \ \mathsf{Identifier}\ \land \ \mathsf{type}\ \in \ \mathsf{Type} \\[0.16em]
\mathsf{SharedDeps}\ =\ [\mathsf{SharedDep}] \\[0.16em]
\mathsf{MoveMode}\ =\ \mathsf{ParamMode}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{Perm}\ =\ \{\texttt{const},\ \texttt{unique},\ \texttt{shared}\} \\[0.16em]
\mathsf{Qual}\ =\ \{\texttt{imm},\ \texttt{mut}\} \\[0.16em]
\mathsf{PtrStateOpt}\ =\ \{\bot ,\ \texttt{Valid},\ \texttt{Null},\ \texttt{Expired}\} \\[0.16em]
\mathsf{StringStateOpt}\ =\ \{\bot ,\ \texttt{@Managed},\ \texttt{@View}\} \\[0.16em]
\mathsf{BytesStateOpt}\ =\ \{\bot ,\ \texttt{@Managed},\ \texttt{@View}\} \\[0.16em]
\mathsf{Name}\ \in \ \mathsf{PrimTypeNames}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{ParamMode}\ =\ \{\texttt{move},\ \bot \} \\[0.16em]
\mathsf{ParamType}\ =\ \langle \mathsf{mode},\ \mathsf{type}\rangle \ \mathsf{where}\ \mathsf{mode}\ \in \ \mathsf{ParamMode}\ \land \ \mathsf{type}\ \in \ \mathsf{Type}
\end{array}
$$
