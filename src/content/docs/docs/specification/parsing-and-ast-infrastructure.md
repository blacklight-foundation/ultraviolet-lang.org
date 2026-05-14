---
title: "Parsing and AST Infrastructure"
description: "5. Parsing and AST Infrastructure of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
generatedAt: "2026-05-14T00:55:03.609Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>


## 5.1 Parsing Inputs, Outputs, and Invariants

$$
\begin{array}{l}
\operatorname{ParseInputs}(S,\ K_{\mathsf{raw}},\ D,\ K)\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{Tokenize}(S)\ \Downarrow \ (K_{\mathsf{raw}},\ D)\ \land \ K\ =\ \operatorname{Filter}(K_{\mathsf{raw}}) \\[0.16em]
\operatorname{ParseOutputs}(S,\ F)\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{ParseFile}(S)\ \Downarrow \ F
\end{array}
$$

**Parsing Phase Invariants.**

**(Phase1-File)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseFile}(S)\ \Downarrow \ F \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePhase}(S)\ \Downarrow \ F
\end{array}
$$

**(Phase1-Forward-Refs)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePhase}(S)\ \Downarrow \ \mathsf{NoResolutionConstraints}
\end{array}
$$

Construct-specific `ParseItem`, `ParseExpr`, `ParsePattern`, `ParseType`, and `ParseStmt` rules are defined by the owning feature chapters. `ParseModule` and `ParseModules` are defined by §11.5.4.

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

## 5.3 Parser State and Judgments

**Parser State.**

$$
\mathsf{PState}\ =\ \langle K,\ i,\ D,\ j,\ d,\ \Delta \rangle 
$$

$$
\begin{array}{l}
\operatorname{TokStream}(P)\ =\ K \\[0.16em]
\operatorname{TokIndex}(P)\ =\ i \\[0.16em]
\operatorname{DocStream}(P)\ =\ D \\[0.16em]
\operatorname{DocIndex}(P)\ =\ j \\[0.16em]
\operatorname{Depth}(P)\ =\ d \\[0.16em]
\operatorname{DiagStream}(P)\ =\ \Delta 
\end{array}
$$

**Helper Functions.**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ = \\[0.16em]
\ K[i]\quad \mathsf{if}\ i\ <\ \mid K\mid  \\[0.16em]
\ \langle \mathsf{EOF},\ \varepsilon ,\ \operatorname{EOFSpan}(K)\rangle \quad \mathsf{if}\ i\ =\ \mid K\mid 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{SourceOf}(K)\ =\ S\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{Tokenize}(S)\ \Downarrow \ (K_{\mathsf{raw}},\ D)\ \land \ K\ =\ \operatorname{Filter}(K_{\mathsf{raw}}) \\[0.16em]
\operatorname{EOFSpan}(K)\ =\ \operatorname{EOFSpan}(\operatorname{SourceOf}(K))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Advance}(P)\ =\ \langle K,\ i+1,\ D,\ j,\ d,\ \Delta \rangle  \\[0.16em]
\operatorname{Clone}(P)\ =\ \langle K,\ i,\ D,\ j,\ d,\ []\rangle  \\[0.16em]
\operatorname{MergeDiag}(P_{b},\ P_{d},\ P_{s})\ =\ \langle \operatorname{TokStream}(P_{s}),\ \operatorname{TokIndex}(P_{s}),\ \operatorname{DocStream}(P_{s}),\ \operatorname{DocIndex}(P_{s}),\ \operatorname{Depth}(P_{s}),\ \operatorname{DiagStream}(P_{b})\ \mathbin{++} \ \operatorname{DiagStream}(P_{d})\rangle 
\end{array}
$$

**Parser Index Invariant.**

$$
\operatorname{PStateOk}(P)\ \Leftrightarrow \ 0\ \le \ i\ \le \ \mid K\mid 
$$

$$
\begin{array}{l}
\operatorname{AdvanceOrEOF}(P)\ = \\[0.16em]
\ \operatorname{Advance}(P)\ \mathsf{if}\ i\ <\ \mid K\mid  \\[0.16em]
\ P\quad \mathsf{if}\ i\ =\ \mid K\mid 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LastConsumed}(P,\ P')\ = \\[0.16em]
\ K[i'-1]\ \mathsf{if}\ i'\ >\ i \\[0.16em]
\ \operatorname{Tok}(P)\ \mathsf{if}\ i'\ =\ i
\end{array}
$$

$$
\operatorname{SpanBetween}(P,\ P')\ =\ \operatorname{SpanFrom}(\operatorname{Tok}(P),\ \operatorname{LastConsumed}(P,\ P'))
$$

$$
\begin{array}{l}
\operatorname{SplitSpan2}(\mathsf{sp})\ =\ (\mathsf{sp}_{L},\ \mathsf{sp}_{R})\ \mathsf{where} \\[0.16em]
\ \mathsf{sp}_{L}.\mathsf{file}\ =\ \mathsf{sp}.\mathsf{file}\ \land \ \mathsf{sp}_{R}.\mathsf{file}\ =\ \mathsf{sp}.\mathsf{file} \\[0.16em]
\ \mathsf{sp}_{L}.\mathsf{start}_{\mathsf{offset}}\ =\ \mathsf{sp}.\mathsf{start}_{\mathsf{offset}}\ \land \ \mathsf{sp}_{L}.\mathsf{end}_{\mathsf{offset}}\ =\ \mathsf{sp}.\mathsf{start}_{\mathsf{offset}}\ +\ 1 \\[0.16em]
\ \mathsf{sp}_{R}.\mathsf{start}_{\mathsf{offset}}\ =\ \mathsf{sp}.\mathsf{start}_{\mathsf{offset}}\ +\ 1\ \land \ \mathsf{sp}_{R}.\mathsf{end}_{\mathsf{offset}}\ =\ \mathsf{sp}.\mathsf{start}_{\mathsf{offset}}\ +\ 2 \\[0.16em]
\ \mathsf{sp}_{L}.\mathsf{start}_{\mathsf{line}}\ =\ \mathsf{sp}.\mathsf{start}_{\mathsf{line}}\ \land \ \mathsf{sp}_{L}.\mathsf{end}_{\mathsf{line}}\ =\ \mathsf{sp}.\mathsf{start}_{\mathsf{line}} \\[0.16em]
\ \mathsf{sp}_{R}.\mathsf{start}_{\mathsf{line}}\ =\ \mathsf{sp}.\mathsf{start}_{\mathsf{line}}\ \land \ \mathsf{sp}_{R}.\mathsf{end}_{\mathsf{line}}\ =\ \mathsf{sp}.\mathsf{start}_{\mathsf{line}} \\[0.16em]
\ \mathsf{sp}_{L}.\mathsf{start}_{\mathsf{col}}\ =\ \mathsf{sp}.\mathsf{start}_{\mathsf{col}}\ \land \ \mathsf{sp}_{L}.\mathsf{end}_{\mathsf{col}}\ =\ \mathsf{sp}.\mathsf{start}_{\mathsf{col}}\ +\ 1 \\[0.16em]
\ \mathsf{sp}_{R}.\mathsf{start}_{\mathsf{col}}\ =\ \mathsf{sp}.\mathsf{start}_{\mathsf{col}}\ +\ 1\ \land \ \mathsf{sp}_{R}.\mathsf{end}_{\mathsf{col}}\ =\ \mathsf{sp}.\mathsf{start}_{\mathsf{col}}\ +\ 2
\end{array}
$$

$$
\begin{array}{l}
\operatorname{SplitShiftR}(P)\ =\ \langle K',\ i,\ D,\ j,\ d,\ \Delta \rangle  \\[0.16em]
\mathsf{where}\ \operatorname{Tok}(P)\ =\ \langle \operatorname{Operator}(\texttt{">>"}),\ \texttt{">>"},\ \mathsf{sp}\rangle \ \land \ (\mathsf{sp}_{L},\ \mathsf{sp}_{R})\ =\ \operatorname{SplitSpan2}(\mathsf{sp}) \\[0.16em]
K'\ =\ K[0..i)\ \mathbin{++} \ [\langle \operatorname{Operator}(\texttt{">"}),\ \texttt{">"},\ \mathsf{sp}_{L}\rangle ,\ \langle \operatorname{Operator}(\texttt{">"}),\ \texttt{">"},\ \mathsf{sp}_{R}\rangle ]\ \mathbin{++} \ K[i+1..]
\end{array}
$$

**Judgments (Big-Step).**

$$
\mathsf{ParseJudgment}\ =\ \{\mathsf{ParseFile},\ \mathsf{ParseModule},\ \mathsf{ParseItem},\ \mathsf{ParseStmt},\ \mathsf{ParseExpr},\ \mathsf{ParsePattern},\ \mathsf{ParseType}\}
$$

## 5.4 Shared Grammar Policy and Parser Helpers

**Lexeme Predicates.**

$$
\begin{array}{l}
\operatorname{IsIdent}(t)\ \Leftrightarrow \ t.\mathsf{kind}\ =\ \mathsf{Identifier} \\[0.16em]
\operatorname{IsKw}(t,\ s)\ \Leftrightarrow \ t.\mathsf{kind}\ =\ \operatorname{Keyword}(s) \\[0.16em]
\operatorname{IsOp}(t,\ s)\ \Leftrightarrow \ t.\mathsf{kind}\ =\ \operatorname{Operator}(s) \\[0.16em]
\operatorname{IsPunc}(t,\ s)\ \Leftrightarrow \ t.\mathsf{kind}\ =\ \operatorname{Punctuator}(s) \\[0.16em]
\operatorname{Lexeme}(t)\ =\ t.\mathsf{lexeme}
\end{array}
$$

**Contextual Keywords.**

$$
\begin{array}{l}
\mathsf{CtxKeyword}\ =\ \{\texttt{"in"},\ \texttt{"key"},\ \texttt{"wait"}\} \\[0.16em]
\operatorname{Ctx}(t,\ s)\ \Leftrightarrow \ \operatorname{IsIdent}(t)\ \land \ \operatorname{Lexeme}(t)\ =\ s\ \land \ s\ \in \ \mathsf{CtxKeyword} \\[0.16em]
\lnot \ \operatorname{Ctx}(t,\ \texttt{"as"})\ \land \ \lnot \ \operatorname{Ctx}(t,\ \texttt{"move"})
\end{array}
$$

**Fixed Identifier Lexemes.**

$$
\begin{array}{l}
\mathsf{FixedIdent}_{\mathsf{Key}}\ =\ \{\texttt{"read"},\ \texttt{"write"},\ \texttt{"dynamic"},\ \texttt{"speculative"},\ \texttt{"release"}\} \\[0.16em]
\mathsf{FixedIdent}_{\mathsf{Parallel}}\ =\ \{\texttt{"cancel"},\ \texttt{"name"},\ \texttt{"workgroup"},\ \texttt{"workgroups"}\} \\[0.16em]
\mathsf{FixedIdent}_{\mathsf{Spawn}}\ =\ \{\texttt{"name"},\ \texttt{"affinity"},\ \texttt{"priority"}\} \\[0.16em]
\mathsf{FixedIdent}_{\mathsf{Dispatch}}\ =\ \{\texttt{"reduce"},\ \texttt{"ordered"},\ \texttt{"chunk"},\ \texttt{"workgroup"},\ \texttt{"min"},\ \texttt{"max"},\ \texttt{"and"},\ \texttt{"or"}\} \\[0.16em]
\mathsf{FixedIdent}_{\mathsf{Meta}}\ =\ \{\texttt{"pattern"},\ \texttt{"target"},\ \texttt{"requires"},\ \texttt{"emits"}\} \\[0.16em]
\mathsf{FixedIdent}\ =\ \mathsf{FixedIdent}_{\mathsf{Key}}\ \cup \ \mathsf{FixedIdent}_{\mathsf{Parallel}}\ \cup \ \mathsf{FixedIdent}_{\mathsf{Spawn}}\ \cup \ \mathsf{FixedIdent}_{\mathsf{Dispatch}}\ \cup \ \mathsf{FixedIdent}_{\mathsf{Meta}} \\[0.16em]
\operatorname{FixedIdentTok}(t,\ s)\ \Leftrightarrow \ \operatorname{IsIdent}(t)\ \land \ \operatorname{Lexeme}(t)\ =\ s\ \land \ s\ \in \ \mathsf{FixedIdent}
\end{array}
$$
Fixed identifiers MUST be tokenized as identifiers and are disambiguated by syntactic position.

**Union Propagation.**

$$
\begin{array}{l}
\operatorname{UnionPropTok}(t)\ \Leftrightarrow \ \operatorname{IsOp}(t,\ \texttt{"?"}) \\[0.16em]
\operatorname{UnionPropForm}(e)\ \Leftrightarrow \ \exists \ e_{0}.\ e\ =\ \operatorname{Propagate}(e_{0})
\end{array}
$$

**Type Tokens.**

$$
\begin{array}{l}
\operatorname{TypePredicateTok}(t)\ \Leftrightarrow \ \operatorname{IsOp}(t,\ \texttt{"|:"}) \\[0.16em]
\operatorname{OpaqueTypeTok}(t)\ \Leftrightarrow \ \operatorname{IsIdent}(t)\ \land \ \operatorname{Lexeme}(t)\ =\ \texttt{"opaque"} \\[0.16em]
\operatorname{TypeArgsStartTok}(t)\ \Leftrightarrow \ \operatorname{IsOp}(t,\ \texttt{"<"})
\end{array}
$$

Trailing comma rules are defined by §5.5.

**(Parse-Ident)**
IsIdent(Tok(P))

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseIdent}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \operatorname{Lexeme}(\operatorname{Tok}(P)))
\end{array}
$$

**(Parse-Ident-Err)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsIdent}(\operatorname{Tok}(P))\quad c\ =\ \operatorname{Code}(\mathsf{Parse}-\mathsf{Syntax}-\mathsf{Err})\quad \Gamma \ \vdash \ \operatorname{Emit}(c,\ \operatorname{Tok}(P).\mathsf{span}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseIdent}(P)\ \Downarrow \ (P,\ \texttt{"\_"})
\end{array}
$$

**(Parse-TypePath)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseIdent}(P)\ \Downarrow \ (P_{1},\ \mathsf{id})\quad \Gamma \ \vdash \ \operatorname{ParseTypePathTail}(P_{1},\ [\mathsf{id}])\ \Downarrow \ (P_{2},\ \mathsf{path}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseTypePath}(P)\ \Downarrow \ (P_{2},\ \mathsf{path})
\end{array}
$$

**(Parse-ClassPath)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseTypePath}(P)\ \Downarrow \ (P_{1},\ \mathsf{path}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseClassPath}(P)\ \Downarrow \ (P_{1},\ \mathsf{path})
\end{array}
$$

**(Parse-TypePathTail-End)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"::"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseTypePathTail}(P,\ \mathsf{xs})\ \Downarrow \ (P,\ \mathsf{xs})
\end{array}
$$

**(Parse-TypePathTail-Cons)**

$$
\begin{array}{l}
\operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"::"})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{id})\quad \Gamma \ \vdash \ \operatorname{ParseTypePathTail}(P_{1},\ \mathsf{xs}\ \mathbin{++} \ [\mathsf{id}])\ \Downarrow \ (P_{2},\ \mathsf{ys}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseTypePathTail}(P,\ \mathsf{xs})\ \Downarrow \ (P_{2},\ \mathsf{ys})
\end{array}
$$

**(Parse-QualifiedHead)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseIdent}(P)\ \Downarrow \ (P_{1},\ \mathsf{id}_{0})\quad \operatorname{IsOp}(\operatorname{Tok}(P_{1}),\ \texttt{"::"})\quad \Gamma \ \vdash \ \operatorname{ParseModulePathTail}(P_{1},\ [\mathsf{id}_{0}])\ \Downarrow \ (P_{2},\ \mathsf{xs})\quad \mathsf{xs}\ =\ \mathsf{ys}\ \mathbin{++} \ [\mathsf{name}]\quad \mid \mathsf{xs}\mid \ \ge \ 2 \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseQualifiedHead}(P)\ \Downarrow \ (P_{2},\ \mathsf{ys},\ \mathsf{name})
\end{array}
$$

**(Parse-Vis-Opt)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ v)\quad v\ \in \ \{\texttt{public},\ \texttt{internal},\ \texttt{private}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseVis}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ v)
\end{array}
$$

**(Parse-Vis-Default)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsKw}(\operatorname{Tok}(P),\ v) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseVis}(P)\ \Downarrow \ (P,\ \texttt{internal})
\end{array}
$$

**(Parse-ModalOpt-Yes)**
IsKw(Tok(P), `modal`)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseModalOpt}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \mathsf{true})
\end{array}
$$

**(Parse-ModalOpt-No)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{modal}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseModalOpt}(P)\ \Downarrow \ (P,\ \mathsf{false})
\end{array}
$$

**(Parse-AliasOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{as}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseAliasOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-AliasOpt-Yes)**

$$
\begin{array}{l}
\operatorname{IsKw}(\operatorname{Tok}(P),\ \texttt{as})\quad \Gamma \ \vdash \ \operatorname{ParseIdent}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{id}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseAliasOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{id})
\end{array}
$$

**(Parse-TypeAnnotOpt-None)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{":"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseTypeAnnotOpt}(P)\ \Downarrow \ (P,\ \bot )
\end{array}
$$

**(Parse-TypeAnnotOpt-Yes)**

$$
\begin{array}{l}
\operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{":"})\quad \Gamma \ \vdash \ \operatorname{ParseType}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{ty}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseTypeAnnotOpt}(P)\ \Downarrow \ (P_{1},\ \mathsf{ty})
\end{array}
$$

**(Parse-KeyBoundaryOpt-Yes)**
IsOp(Tok(P), "#")

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseKeyBoundaryOpt}(P)\ \Downarrow \ (\operatorname{Advance}(P),\ \mathsf{true})
\end{array}
$$

**(Parse-KeyBoundaryOpt-No)**

$$
\begin{array}{l}
\lnot \ \operatorname{IsOp}(\operatorname{Tok}(P),\ \texttt{"\#"}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseKeyBoundaryOpt}(P)\ \Downarrow \ (P,\ \mathsf{false})
\end{array}
$$

## 5.5 Token Consumption and List Parsing

$$
\begin{array}{l}
\mathsf{ConsumeState}\ =\ \{\operatorname{Consume}(P,\ k),\ \operatorname{ConsumeDone}(P)\} \\[0.16em]
\mathsf{ParseRejectRules}\ =\ \emptyset 
\end{array}
$$

**(Tok-Consume-Kind)**

$$
\begin{array}{l}
\operatorname{Tok}(P).\mathsf{kind}\ =\ k \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Consume}(P,\ k)\rangle \ \to \ \langle \operatorname{ConsumeDone}(\operatorname{Advance}(P))\rangle 
\end{array}
$$

**(Tok-Consume-Keyword)**
IsKw(Tok(P), s)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Consume}(P,\ \operatorname{Keyword}(s))\rangle \ \to \ \langle \operatorname{ConsumeDone}(\operatorname{Advance}(P))\rangle 
\end{array}
$$

**(Tok-Consume-Operator)**
IsOp(Tok(P), s)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Consume}(P,\ \operatorname{Operator}(s))\rangle \ \to \ \langle \operatorname{ConsumeDone}(\operatorname{Advance}(P))\rangle 
\end{array}
$$

**(Tok-Consume-Punct)**
IsPunc(Tok(P), s)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Consume}(P,\ \operatorname{Punctuator}(s))\rangle \ \to \ \langle \operatorname{ConsumeDone}(\operatorname{Advance}(P))\rangle 
\end{array}
$$

**List Parsing (Small-Step)**

$$
\mathsf{ListState}\ =\ \{\operatorname{ListStart}(P),\ \operatorname{ListScan}(P,\ \mathsf{xs}),\ \operatorname{ListDone}(P,\ \mathsf{xs})\}
$$

**(List-Start)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{ListStart}(P)\rangle \ \to \ \langle \operatorname{ListScan}(P,\ [])\rangle 
\end{array}
$$

**(List-Cons)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseElem}(P)\ \Downarrow \ (P',\ x) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{ListScan}(P,\ \mathsf{xs})\rangle \ \to \ \langle \operatorname{ListScan}(P',\ \mathsf{xs}\ \mathbin{++} \ [x])\rangle 
\end{array}
$$

**(List-Done)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ \in \ \mathsf{EndSet} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{ListScan}(P,\ \mathsf{xs})\rangle \ \to \ \langle \operatorname{ListDone}(P,\ \mathsf{xs})\rangle 
\end{array}
$$

$$
\mathsf{EndSet}\ \subseteq \ \mathsf{TokenKind}
$$
In list parsing rules, P_0 denotes the parser state immediately after consuming the list opening delimiter for the list being parsed.

$$
\begin{array}{l}
\operatorname{TrailingComma}(P,\ \mathsf{EndSet})\ \Leftrightarrow \ \operatorname{IsPunc}(\operatorname{Tok}(P),\ \texttt{","})\ \land \ \operatorname{Tok}(\operatorname{Advance}(P))\ \in \ \mathsf{EndSet} \\[0.16em]
\operatorname{TokensBetween}(P_{0},\ P)\ =\ \langle \operatorname{TokIndex}(P_{0}),\ \operatorname{TokIndex}(P)\rangle  \\[0.16em]
\operatorname{TokLine}(t)\ =\ t.\mathsf{span}.\mathsf{start}_{\mathsf{line}} \\[0.16em]
\operatorname{TrailingCommaAllowed}(P_{0},\ P,\ \mathsf{EndSet})\ \Leftrightarrow \ \operatorname{TrailingComma}(P,\ \mathsf{EndSet})\ \land \ \operatorname{TokLine}(\operatorname{Tok}(P))\ <\ \operatorname{TokLine}(\operatorname{Tok}(\operatorname{Advance}(P)))
\end{array}
$$

**(Trailing-Comma-Err)**

$$
\begin{array}{l}
\operatorname{TrailingComma}(P,\ \mathsf{EndSet})\quad \lnot \ \operatorname{TrailingCommaAllowed}(P_{0},\ P,\ \mathsf{EndSet})\quad c\ =\ \operatorname{Code}(\mathsf{Trailing}-\mathsf{Comma}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Emit}(c,\ \operatorname{Tok}(P).\mathsf{span})
\end{array}
$$

## 5.6 ParseFile, Item Sequencing, and Terminators

**ParseFile (Big-Step).**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Tokenize}(S)\ \Downarrow \ (K_{\mathsf{raw}},\ D) \\[0.16em]
K\ =\ \operatorname{Filter}(K_{\mathsf{raw}}) \\[0.16em]
P_{0}\ =\ \langle K,\ 0,\ D,\ 0,\ 0,\ []\rangle 
\end{array}
$$

**(ParseFile-Ok)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ParseItems}(P_{0})\ \Downarrow \ (P_{1},\ I,\ \mathsf{MDoc}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseFile}(S)\ \Downarrow \ \langle S.\mathsf{path},\ I,\ \mathsf{MDoc}\rangle 
\end{array}
$$

**Item Sequence (Big-Step).**

**(ParseItems-Empty)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ =\ \mathsf{EOF} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseItems}(P)\ \Downarrow \ (P,\ [],\ [])
\end{array}
$$

**(ParseItems-Cons)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ \ne \ \mathsf{EOF}\quad \Gamma \ \vdash \ \operatorname{ParseItem}(P)\ \Downarrow \ (P_{1},\ \mathsf{it})\quad \Gamma \ \vdash \ \operatorname{ParseItems}(P_{1})\ \Downarrow \ (P_{2},\ I,\ M) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParseItems}(P)\ \Downarrow \ (P_{2},\ [\mathsf{it}]\ \mathbin{++} \ I,\ M)
\end{array}
$$

**Statement Terminators.**

$$
\begin{array}{l}
\mathsf{StmtTerm}\ =\ \{\operatorname{Punctuator}(\texttt{";"}),\ \mathsf{Newline}\} \\[0.16em]
\operatorname{IsTerm}(t)\ \Leftrightarrow \ t\ \in \ \mathsf{StmtTerm}
\end{array}
$$

$$
\operatorname{ReqTerm}(s)\ \Leftrightarrow \ s\ \in \ \{\operatorname{LetStmt}(\_),\ \operatorname{VarStmt}(\_),\ \operatorname{UsingLocalStmt}(\_,\ \_,\ \_),\ \operatorname{AssignStmt}(\_,\ \_),\ \operatorname{CompoundAssignStmt}(\_,\ \_,\ \_),\ \operatorname{ExprStmt}(\_)\}
$$

**(ConsumeTerminatorOpt-Req-Yes)**
ReqTerm(s)    IsTerm(Tok(P))

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ConsumeTerminatorOpt}(P,\ s)\ \Downarrow \ \operatorname{Advance}(P)
\end{array}
$$

**(ConsumeTerminatorOpt-Req-No)**

$$
\begin{array}{l}
\operatorname{ReqTerm}(s)\quad \lnot \ \operatorname{IsTerm}(\operatorname{Tok}(P))\quad \operatorname{Emit}(\operatorname{Code}(\mathsf{Missing}-\mathsf{Terminator}-\mathsf{Err}),\ \mathsf{Span}\ =\ \operatorname{Tok}(P).\mathsf{span})\quad \Gamma \ \vdash \ \operatorname{SyncStmt}(P)\ \Downarrow \ P_{1} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ConsumeTerminatorOpt}(P,\ s)\ \Downarrow \ P_{1}
\end{array}
$$

**(ConsumeTerminatorOpt-Opt-Yes)**

$$
\begin{array}{l}
\lnot \ \operatorname{ReqTerm}(s)\quad \operatorname{IsTerm}(\operatorname{Tok}(P)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ConsumeTerminatorOpt}(P,\ s)\ \Downarrow \ \operatorname{Advance}(P)
\end{array}
$$

**(ConsumeTerminatorOpt-Opt-No)**

$$
\begin{array}{l}
\lnot \ \operatorname{ReqTerm}(s)\quad \lnot \ \operatorname{IsTerm}(\operatorname{Tok}(P)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ConsumeTerminatorOpt}(P,\ s)\ \Downarrow \ P
\end{array}
$$

**(ConsumeTerminatorReq-Yes)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ \in \ \{\operatorname{Punctuator}(\texttt{";"}),\ \mathsf{Newline}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ConsumeTerminatorReq}(P)\ \Downarrow \ \operatorname{Advance}(P)
\end{array}
$$

**(ConsumeTerminatorReq-No)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ \notin \ \{\operatorname{Punctuator}(\texttt{";"}),\ \mathsf{Newline}\}\quad c\ =\ \operatorname{Code}(\mathsf{Missing}-\mathsf{Terminator}-\mathsf{Err})\quad \Gamma \ \vdash \ \operatorname{Emit}(c,\ \operatorname{Tok}(P).\mathsf{span})\quad \Gamma \ \vdash \ \operatorname{SyncStmt}(P)\ \Downarrow \ P_{1} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ConsumeTerminatorReq}(P)\ \Downarrow \ P_{1}
\end{array}
$$

## 5.7 Doc Comment Association

$$
\begin{array}{l}
\operatorname{DocSeq}(D)\ =\ D \\[0.16em]
\operatorname{ItemSeq}(\mathsf{Items})\ =\ \mathsf{Items}
\end{array}
$$

**(Attach-Doc-Line)**

$$
\begin{array}{l}
d.\mathsf{kind}\ =\ \mathsf{LineDoc}\quad \mathsf{Items}\ =\ [i_{1},\ \ldots ,\ i_{k}]\quad j\ =\ \mathsf{min}\{\ t\ \mid \ d.\mathsf{span}.\mathsf{end}_{\mathsf{offset}}\ \le \ i_{t}.\mathsf{span}.\mathsf{start}_{\mathsf{offset}}\ \} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AttachDoc}(d,\ i_{j})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LineDocTarget}(d,\ \mathsf{Items})\ =\ i_{j}\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{AttachDoc}(d,\ i_{j}) \\[0.16em]
\operatorname{LineDocsFor}(i,\ D,\ \mathsf{Items})\ =\ [d\ \in \ D\ \mid \ d.\mathsf{kind}\ =\ \mathsf{LineDoc}\ \land \ \operatorname{LineDocTarget}(d,\ \mathsf{Items})\ =\ i]
\end{array}
$$

**(Attach-Doc-Module)**
d.kind = ModuleDoc

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{AttachModuleDoc}(d)
\end{array}
$$

$$
\operatorname{ModuleDocs}(D)\ =\ [d\ \in \ D\ \mid \ d.\mathsf{kind}\ =\ \mathsf{ModuleDoc}]
$$

## 5.8 Error Recovery and Synchronization

**Statement Synchronization Set.**

$$
\mathsf{SyncStmt}\ =\ \{\operatorname{Punctuator}(\texttt{";"}),\ \mathsf{Newline},\ \operatorname{Punctuator}(\texttt{"\}"}),\ \mathsf{EOF}\}
$$

**Item Synchronization Set.**

$$
\mathsf{SyncItem}\ =\ \{\operatorname{Keyword}(\texttt{procedure}),\ \operatorname{Keyword}(\texttt{record}),\ \operatorname{Keyword}(\texttt{enum}),\ \operatorname{Keyword}(\texttt{modal}),\ \operatorname{Keyword}(\texttt{class}),\ \operatorname{Keyword}(\texttt{type}),\ \operatorname{Keyword}(\texttt{using}),\ \operatorname{Keyword}(\texttt{let}),\ \operatorname{Keyword}(\texttt{var}),\ \operatorname{Punctuator}(\texttt{"\}"}),\ \mathsf{EOF}\}
$$

**Type Synchronization Set.**

$$
\mathsf{SyncType}\ =\ \{\operatorname{Punctuator}(\texttt{","}),\ \operatorname{Punctuator}(\texttt{";"}),\ \mathsf{Newline},\ \operatorname{Punctuator}(\texttt{")"}),\ \operatorname{Punctuator}(\texttt{"]"}),\ \operatorname{Punctuator}(\texttt{"\}"}),\ \mathsf{EOF}\}
$$

**(Sync-Stmt-Stop)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ \in \ \{\operatorname{Punctuator}(\texttt{"\}"}),\ \mathsf{EOF}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{SyncStmt}(P)\ \Downarrow \ P
\end{array}
$$

**(Sync-Stmt-Consume)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ \in \ \{\operatorname{Punctuator}(\texttt{";"}),\ \mathsf{Newline}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{SyncStmt}(P)\ \Downarrow \ \operatorname{Advance}(P)
\end{array}
$$

**(Sync-Stmt-Advance)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ \notin \ \mathsf{SyncStmt} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{SyncStmt}(P)\ \Downarrow \ \operatorname{SyncStmt}(\operatorname{Advance}(P))
\end{array}
$$

**(Sync-Item-Stop)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ \in \ \mathsf{SyncItem} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{SyncItem}(P)\ \Downarrow \ P
\end{array}
$$

**(Sync-Item-Advance)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ \notin \ \mathsf{SyncItem} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{SyncItem}(P)\ \Downarrow \ \operatorname{SyncItem}(\operatorname{Advance}(P))
\end{array}
$$

**(Sync-Type-Stop)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ \in \ \{\operatorname{Punctuator}(\texttt{")"}),\ \operatorname{Punctuator}(\texttt{"]"}),\ \operatorname{Punctuator}(\texttt{"\}"}),\ \mathsf{EOF}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{SyncType}(P)\ \Downarrow \ P
\end{array}
$$

**(Sync-Type-Consume)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ \in \ \{\operatorname{Punctuator}(\texttt{","}),\ \operatorname{Punctuator}(\texttt{";"}),\ \mathsf{Newline}\} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{SyncType}(P)\ \Downarrow \ \operatorname{Advance}(P)
\end{array}
$$

**(Sync-Type-Advance)**

$$
\begin{array}{l}
\operatorname{Tok}(P)\ \notin \ \mathsf{SyncType} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{SyncType}(P)\ \Downarrow \ \operatorname{SyncType}(\operatorname{Advance}(P))
\end{array}
$$

StmtParseErrRule = Parse-Statement-Err
ItemParseErrRule = Parse-Item-Err

## 5.9 Parsing Diagnostics

$$
\mathsf{Phase1DiagRules}\ =\ \{\mathsf{Missing}-\mathsf{Terminator}-\mathsf{Err},\ \mathsf{Trailing}-\mathsf{Comma}-\mathsf{Err},\ \mathsf{Parse}-\mathsf{Syntax}-\mathsf{Err}\}
$$

**(Parse-Syntax-Err)**

$$
\mathsf{GenericParseRules}\ =\ \{\mathsf{Parse}-\mathsf{Ident}-\mathsf{Err},\ \mathsf{Parse}-\mathsf{Type}-\mathsf{Err},\ \mathsf{Parse}-\mathsf{Pattern}-\mathsf{Err},\ \mathsf{Parse}-\mathsf{Primary}-\mathsf{Err},\ \mathsf{Parse}-\mathsf{Statement}-\mathsf{Err},\ \mathsf{Parse}-\mathsf{Item}-\mathsf{Err}\}
$$

$$
\begin{array}{l}
r\ \in \ \mathsf{GenericParseRules}\quad \operatorname{PremisesHold}(r,\ P) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Emit}(\operatorname{Code}(\mathsf{Parse}-\mathsf{Syntax}-\mathsf{Err}))
\end{array}
$$

## 5.10 Parsing Diagnostics Supplement

This section owns parser-level diagnostics that are shared across feature chapters and therefore are not duplicated in feature-local diagnostic tables.

| Code         | Severity | Detection    | Condition                               |
| ------------ | -------- | ------------ | --------------------------------------- |
| `E-CNF-0401` | Error    | Compile-time | Reserved keyword used as identifier     |
| `E-SRC-0510` | Error    | Compile-time | Missing statement terminator            |
| `E-SRC-0520` | Error    | Compile-time | Generic syntax error (unexpected token) |
| `E-SRC-0521` | Error    | Compile-time | Trailing comma in single-line list      |
