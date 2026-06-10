---
title: "5.4 Shared Grammar Policy and Parser Helpers"
description: "5.4 Shared Grammar Policy and Parser Helpers from 5. Parsing and AST Infrastructure of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c"
specChapter: "parsing-and-ast-infrastructure"
specSection: "54-shared-grammar-policy-and-parser-helpers"
generatedAt: "2026-06-10T23:34:49.143Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>7504a51b9ef9be0f46945513a2e5cbc5ed84a20cbefdb34151c6775a4e07196c</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/parsing-and-ast-infrastructure/">5. Parsing and AST Infrastructure</a>
  <span>Parsing and AST Infrastructure</span>
</div>

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
\mathsf{FixedIdent}_{\mathsf{Key}}\ =\ \{\texttt{"read"},\ \texttt{"write"},\ \texttt{"release"},\ \texttt{"speculative"},\ \texttt{"ordered"}\} \\[0.16em]
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

$$
\operatorname{IsCtxIdent}(t,\ s)\ \Leftrightarrow \ t.\mathsf{kind}\ =\ \mathsf{Identifier}\ \land \ t.\mathsf{lexeme}\ =\ s
$$

`IsCtxIdent` recognizes contextual keywords; the recognized lexeme remains an ordinary identifier in every other position.
