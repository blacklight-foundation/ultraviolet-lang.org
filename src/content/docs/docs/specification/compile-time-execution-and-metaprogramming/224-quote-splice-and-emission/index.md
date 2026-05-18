---
title: "22.4 Quote, Splice, and Emission"
description: "22.4 Quote, Splice, and Emission from 22. Compile-Time Execution and Metaprogramming of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16"
specChapter: "compile-time-execution-and-metaprogramming"
specSection: "224-quote-splice-and-emission"
generatedAt: "2026-05-18T22:15:57.711Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>124e667896a0ef463507ad35c8d3053aa7217019eaeac67ab09630d3939a7c16</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/compile-time-execution-and-metaprogramming/">22. Compile-Time Execution and Metaprogramming</a>
  <span>Compile-Time Execution and Metaprogramming</span>
</div>

## 22.4 Quote, Splice, and Emission

### 22.4.1 Syntax

```text
quote_expr     ::= "quote" "{" quoted_content "}"
quote_type     ::= "quote" "type" "{" type "}"
quote_pattern  ::= "quote" "pattern" "{" pattern "}"
quoted_content ::= expression | statement | top_level_item
splice_expr    ::= "$(" expression ")"
splice_ident   ::= "$" identifier
```

### 22.4.2 Parsing

$$
\mathsf{QuoteParseJudg}\ =\ \{\mathsf{ParseQuoteExpr},\ \mathsf{ParseQuoteType},\ \mathsf{ParseQuotePattern},\ \mathsf{CaptureQuotedTokens}\}
$$

$$
\operatorname{CaptureQuotedTokens}(P)\ \Downarrow \ (P',\ \mathsf{ts})\ \mathsf{consumes}\ \mathsf{the}\ \mathsf{balanced}\ \mathsf{token}\ \mathsf{sequence}\ \mathsf{between}\ \mathsf{the}\ \mathsf{opening}\ \texttt{\{}\ \mathsf{at}\ \texttt{P}\ \mathsf{and}\ \mathsf{its}\ \mathsf{matching}\ \texttt{\}}\ \mathsf{and}\ \mathsf{preserves}\ \mathsf{nested}\ \mathsf{delimiter}\ \mathsf{structure}\ \mathsf{and}\ \mathsf{all}\ \mathsf{splice}\ \mathsf{markers}\ \mathsf{inside}\ \mathsf{that}\ \mathsf{slice}.
$$

**(Parse-Quote-Raw)**

$$
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \operatorname{Lexeme}(\operatorname{Tok}(P))\ =\ \texttt{"quote"}\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{"\{"})\quad \operatorname{CaptureQuotedTokens}(\operatorname{Advance}(P))\ \Downarrow \ (P_{1},\ \mathsf{ts}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (P_{1},\ \operatorname{QuoteNode}(\bot ,\ \operatorname{QuotedRaw}(\mathsf{ts}),\ \operatorname{SpanBetween}(P,\ P_{1})))
\end{array}
$$

**(Parse-Quote-Type)**

$$
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \operatorname{Lexeme}(\operatorname{Tok}(P))\ =\ \texttt{"quote"}\quad \operatorname{IsKw}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{type})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))),\ \texttt{"\{"})\quad \operatorname{CaptureQuotedTokens}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ \mathsf{ts}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (P_{1},\ \operatorname{QuoteNode}(\texttt{Type},\ \operatorname{QuotedRaw}(\mathsf{ts}),\ \operatorname{SpanBetween}(P,\ P_{1})))
\end{array}
$$

**(Parse-Quote-Pattern)**

$$
\begin{array}{l}
\operatorname{IsIdent}(\operatorname{Tok}(P))\quad \operatorname{Lexeme}(\operatorname{Tok}(P))\ =\ \texttt{"quote"}\quad \operatorname{FixedIdentTok}(\operatorname{Tok}(\operatorname{Advance}(P)),\ \texttt{pattern})\quad \operatorname{IsPunc}(\operatorname{Tok}(\operatorname{Advance}(\operatorname{Advance}(P))),\ \texttt{"\{"})\quad \operatorname{CaptureQuotedTokens}(\operatorname{Advance}(\operatorname{Advance}(P)))\ \Downarrow \ (P_{1},\ \mathsf{ts}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{ParsePrimary}(P)\ \Downarrow \ (P_{1},\ \operatorname{QuoteNode}(\texttt{Pattern},\ \operatorname{QuotedRaw}(\mathsf{ts}),\ \operatorname{SpanBetween}(P,\ P_{1})))
\end{array}
$$

### 22.4.3 AST Representation / Form

$$
\begin{array}{l}
\mathsf{AstKind}\ =\ \{\texttt{Expr},\ \texttt{Stmt},\ \texttt{Item},\ \texttt{Type},\ \texttt{Pattern}\} \\[0.16em]
\mathsf{Ast}\ =\ \{\operatorname{AstNode}(\mathsf{kind},\ \mathsf{payload},\ \mathsf{span},\ \mathsf{hygiene})\} \\[0.16em]
\operatorname{AstKindOf}(\operatorname{AstNode}(\mathsf{kind},\ \mathsf{payload},\ \mathsf{span},\ \mathsf{hygiene}))\ =\ \mathsf{kind} \\[0.16em]
\operatorname{AstPayloadOf}(\operatorname{AstNode}(\mathsf{kind},\ \mathsf{payload},\ \mathsf{span},\ \mathsf{hygiene}))\ =\ \mathsf{payload} \\[0.16em]
\operatorname{AstSpanOf}(\operatorname{AstNode}(\mathsf{kind},\ \mathsf{payload},\ \mathsf{span},\ \mathsf{hygiene}))\ =\ \mathsf{span} \\[0.16em]
\operatorname{AstHygieneOf}(\operatorname{AstNode}(\mathsf{kind},\ \mathsf{payload},\ \mathsf{span},\ \mathsf{hygiene}))\ =\ \mathsf{hygiene} \\[0.16em]
\operatorname{AstOf}(\mathsf{kind},\ \mathsf{payload})\ =\ \operatorname{AstNode}(\mathsf{kind},\ \mathsf{payload},\ \bot ,\ \bot )
\end{array}
$$

QuoteNode(kind_opt, body, span)

$$
\begin{array}{l}
\mathsf{QuotedBody}\ =\ \operatorname{QuotedRaw}(\mathsf{tokens})\ \mid \ \operatorname{QuotedResolved}(\mathsf{kind},\ \mathsf{payload}) \\[0.16em]
\mathsf{SpliceNode}\ =\ \operatorname{SpliceExprNode}(\mathsf{expr},\ \mathsf{span})\ \mid \ \operatorname{SpliceIdentNode}(\mathsf{name}_{\mathsf{expr}},\ \mathsf{span}) \\[0.16em]
\mathsf{Hygiene}\ =\ \langle \mathsf{quote}_{\mathsf{site}},\ \mathsf{emit}_{\mathsf{site}},\ \mathsf{mark}\rangle 
\end{array}
$$
`quote_site` is the lexical origin of the quoted fragment. `emit_site` is the insertion site at which the fragment becomes part of the expanded program. `HygienizeAst` is applied when a quoted `Ast` fragment is inserted into the expanded program.

$$
\mathsf{QuoteJudg}\ =\ \{\mathsf{ResolveQuoteKind},\ \mathsf{ParseQuotedBody},\ \mathsf{RenderSplice},\ \mathsf{QuoteBuild},\ \mathsf{HygienizeAst}\}
$$

$$
\begin{array}{l}
\operatorname{ExpectedAstKind}(\operatorname{TypePath}([\texttt{Ast},\ \texttt{Expr}]))\ =\ \texttt{Expr} \\[0.16em]
\operatorname{ExpectedAstKind}(\operatorname{TypePath}([\texttt{Ast},\ \texttt{Stmt}]))\ =\ \texttt{Stmt} \\[0.16em]
\operatorname{ExpectedAstKind}(\operatorname{TypePath}([\texttt{Ast},\ \texttt{Item}]))\ =\ \texttt{Item} \\[0.16em]
\operatorname{ExpectedAstKind}(\operatorname{TypePath}([\texttt{Ast},\ \texttt{Type}]))\ =\ \texttt{Type} \\[0.16em]
\operatorname{ExpectedAstKind}(\operatorname{TypePath}([\texttt{Ast},\ \texttt{Pattern}]))\ =\ \texttt{Pattern} \\[0.16em]
\operatorname{ExpectedAstKind}(\operatorname{TypePath}([\texttt{Ast}]))\ =\ \bot 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{CtLiteralType}(\operatorname{TypePrim}(t))\ \Leftrightarrow \ t\ \in \ \mathsf{PrimitiveTypeName}\ \setminus \ \{\texttt{!}\} \\[0.16em]
\operatorname{CtLiteralType}(\operatorname{TypeString}(\mathsf{st}))\ \Leftrightarrow \ \mathsf{st}\ \in \ \{\texttt{@View},\ \texttt{@Managed}\} \\[0.16em]
\operatorname{CtLiteralType}(\operatorname{TypeTuple}([T_{1},\ \ldots ,\ T_{n}]))\ \Leftrightarrow \ \forall \ i.\ \operatorname{CtLiteralType}(T_{i}) \\[0.16em]
\operatorname{CtLiteralType}(\operatorname{TypeArray}(T,\ \_))\ \Leftrightarrow \ \operatorname{CtLiteralType}(T) \\[0.16em]
\operatorname{CtLiteralType}(\operatorname{TypePerm}(\_,\ T))\ \Leftrightarrow \ \operatorname{CtLiteralType}(T) \\[0.16em]
\operatorname{CtLiteralType}(\operatorname{TypeRefine}(T,\ \_))\ \Leftrightarrow \ \operatorname{CtLiteralType}(T) \\[0.16em]
\operatorname{CtLiteralType}(\operatorname{TypePath}(p))\ \Leftrightarrow \ \operatorname{RecordDecl}(p)\ =\ R\ \land \ \forall \ f\ \in \ \operatorname{Fields}(R).\ \operatorname{CtLiteralType}(\operatorname{FieldType}(f)) \\[0.16em]
\operatorname{CtLiteralType}(\operatorname{TypePath}(p))\ \Leftrightarrow \ \operatorname{EnumDecl}(p)\ =\ E\ \land \ \forall \ v\ \in \ \operatorname{Variants}(E).\ (\operatorname{Payload}(v)\ =\ \bot \ \lor \ (\operatorname{Payload}(v)\ =\ \operatorname{TuplePayload}([T_{1},\ \ldots ,\ T_{n}])\ \land \ \forall \ i.\ \operatorname{CtLiteralType}(T_{i}))\ \lor \ (\operatorname{Payload}(v)\ =\ \operatorname{RecordPayload}(\mathsf{io})\ \land \ \forall \ f\ \in \ \mathsf{io}.\ \operatorname{CtLiteralType}(\operatorname{FieldType}(f)))) \\[0.16em]
\operatorname{CtLiteralType}(\operatorname{TypeApply}(p,\ [T_{1},\ \ldots ,\ T_{n}]))\ \Leftrightarrow \ \operatorname{CtLiteralType}(\operatorname{TypePath}(p)<T_{1},\ \ldots ,\ T_{n}>)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{SpliceCompat}(\texttt{Expr},\ T)\ \Leftrightarrow \ T\ =\ \operatorname{TypePath}([\texttt{"Ast"}])\ \lor \ T\ =\ \operatorname{TypePath}([\texttt{"Ast"},\ \texttt{"Expr"}])\ \lor \ \operatorname{CtLiteralType}(T) \\[0.16em]
\operatorname{SpliceCompat}(\texttt{Stmt},\ T)\ \Leftrightarrow \ T\ =\ \operatorname{TypePath}([\texttt{"Ast"},\ \texttt{"Stmt"}])\ \lor \ T\ =\ \operatorname{TypePath}([\texttt{"Ast"},\ \texttt{"Expr"}]) \\[0.16em]
\operatorname{SpliceCompat}(\texttt{Item},\ T)\ \Leftrightarrow \ T\ =\ \operatorname{TypePath}([\texttt{"Ast"},\ \texttt{"Item"}]) \\[0.16em]
\operatorname{SpliceCompat}(\texttt{Type},\ T)\ \Leftrightarrow \ T\ =\ \operatorname{TypePath}([\texttt{"Ast"},\ \texttt{"Type"}])\ \lor \ T\ =\ \operatorname{TypePath}([\texttt{"Type"}]) \\[0.16em]
\operatorname{SpliceCompat}(\texttt{Pattern},\ T)\ \Leftrightarrow \ T\ =\ \operatorname{TypePath}([\texttt{"Ast"},\ \texttt{"Pattern"}]) \\[0.16em]
\operatorname{SpliceCompat}(\texttt{Identifier},\ T)\ \Leftrightarrow \ T\ =\ \operatorname{TypeString}(\texttt{@Managed})\ \lor \ T\ =\ \operatorname{TypeString}(\texttt{@View})
\end{array}
$$

### 22.4.4 Static Semantics

`quote { ... }`, `quote type { ... }`, and `quote pattern { ... }` are valid only in compile-time contexts.

$$
\begin{array}{l}
\operatorname{ResolveQuoteKind}(\operatorname{QuoteNode}(\mathsf{kind},\ \mathsf{body},\ \mathsf{span}),\ T_{\mathsf{exp}})\ =\ \mathsf{kind}\quad \mathsf{if}\ \mathsf{kind}\ \ne \ \bot  \\[0.16em]
\operatorname{ResolveQuoteKind}(\operatorname{QuoteNode}(\bot ,\ \mathsf{body},\ \mathsf{span}),\ T_{\mathsf{exp}})\ =\ \mathsf{kind}\quad \mathsf{if}\ \operatorname{ExpectedAstKind}(T_{\mathsf{exp}})\ =\ \mathsf{kind}\ \land \ \mathsf{kind}\ \ne \ \bot  \\[0.16em]
\operatorname{ResolveQuoteKind}(\operatorname{QuoteNode}(\bot ,\ \mathsf{body},\ \mathsf{span}),\ T_{\mathsf{exp}})\ =\ \mathsf{kind}\quad \mathsf{if}\ \operatorname{ExpectedAstKind}(T_{\mathsf{exp}})\ =\ \bot \ \land \ \texttt{kind}\ \mathsf{is}\ \mathsf{the}\ \mathsf{unique}\ \mathsf{member}\ \mathsf{of}\ \{\texttt{Expr},\ \texttt{Stmt},\ \texttt{Item}\}\ \mathsf{for}\ \mathsf{which}\ \texttt{ParseQuotedBody(kind, body)}\ \mathsf{succeeds}
\end{array}
$$

Quoted content MUST be syntactically valid in the resolved category. If `ResolveQuoteKind` is undefined, the quote is ill-formed.

`$(e)` and `$ident` are valid only inside a quoted token slice. The compile-time type of the splice source MUST satisfy `SpliceCompat` for the surrounding quoted position.

`$ident` is an identifier-position splice only. `SpliceIdentNode` MAY occur only in identifier expressions, identifier-pattern bindings, typed-pattern bindings, `using ... as` alias names, `region as` aliases, and procedure or method parameter bindings. `SpliceIdentNode` MUST NOT occur in structural identifier positions, including module or type path segments, field labels, variant names, type-parameter names, item declaration names, or modal state names. In every other quoted position, including quoted type position, splicing MUST use `$(e)`. Ordinary language syntax retains precedence where it already uses `$`; for example, in `quote type { $IO }`, `$IO` is parsed as `TypeDynamic(["IO"])`, not as a splice.

If a string-valued splice occupies identifier position, the resulting identifier is intentionally unhygienic and binds in the emission environment.

$$
\texttt{emitter\~{}>emit(ast)}\ \mathsf{is}\ \mathsf{well}-\mathsf{formed}\ \mathsf{only}\ \mathsf{when}\ \texttt{emitter}\ \mathsf{has}\ \mathsf{compile}-\mathsf{time}\ \mathsf{type}\ \texttt{TypeEmitter}\ \mathsf{and}\ \texttt{ast}\ \mathsf{has}\ \mathsf{compile}-\mathsf{time}\ \mathsf{type}\ \texttt{Ast::Item}\ \mathsf{or}\ \texttt{Ast}.
$$

### 22.4.5 Dynamic Semantics

$$
\begin{array}{l}
\operatorname{ParseQuotedBody}(\texttt{Expr},\ \operatorname{QuotedRaw}(\mathsf{ts}))\ \Downarrow \ \mathsf{payload}\ \mathsf{iff}\ \mathsf{the}\ \mathsf{ordinary}\ \mathsf{expression}\ \mathsf{parser},\ \mathsf{extended}\ \mathsf{with}\ \texttt{SpliceExprNode}\ \mathsf{and}\ \texttt{SpliceIdentNode},\ \mathsf{parses}\ \texttt{ts}\ \mathsf{as}\ \mathsf{exactly}\ \mathsf{one}\ \mathsf{expression}. \\[0.16em]
\operatorname{ParseQuotedBody}(\texttt{Stmt},\ \operatorname{QuotedRaw}(\mathsf{ts}))\ \Downarrow \ \mathsf{payload}\ \mathsf{iff}\ \mathsf{the}\ \mathsf{ordinary}\ \mathsf{statement}\ \mathsf{parser},\ \mathsf{extended}\ \mathsf{with}\ \texttt{SpliceExprNode}\ \mathsf{and}\ \texttt{SpliceIdentNode},\ \mathsf{parses}\ \texttt{ts}\ \mathsf{as}\ \mathsf{exactly}\ \mathsf{one}\ \mathsf{statement}. \\[0.16em]
\operatorname{ParseQuotedBody}(\texttt{Item},\ \operatorname{QuotedRaw}(\mathsf{ts}))\ \Downarrow \ \mathsf{payload}\ \mathsf{iff}\ \mathsf{the}\ \mathsf{ordinary}\ \mathsf{item}\ \mathsf{parser},\ \mathsf{extended}\ \mathsf{with}\ \texttt{SpliceExprNode}\ \mathsf{and}\ \texttt{SpliceIdentNode},\ \mathsf{parses}\ \texttt{ts}\ \mathsf{as}\ \mathsf{exactly}\ \mathsf{one}\ \mathsf{top}-\mathsf{level}\ \mathsf{item}. \\[0.16em]
\operatorname{ParseQuotedBody}(\texttt{Type},\ \operatorname{QuotedRaw}(\mathsf{ts}))\ \Downarrow \ \mathsf{payload}\ \mathsf{iff}\ \mathsf{the}\ \mathsf{ordinary}\ \mathsf{type}\ \mathsf{parser},\ \mathsf{extended}\ \mathsf{with}\ \texttt{SpliceExprNode}\ \mathsf{and}\ \texttt{SpliceIdentNode},\ \mathsf{parses}\ \texttt{ts}\ \mathsf{as}\ \mathsf{exactly}\ \mathsf{one}\ \mathsf{type}. \\[0.16em]
\operatorname{ParseQuotedBody}(\texttt{Pattern},\ \operatorname{QuotedRaw}(\mathsf{ts}))\ \Downarrow \ \mathsf{payload}\ \mathsf{iff}\ \mathsf{the}\ \mathsf{ordinary}\ \mathsf{pattern}\ \mathsf{parser},\ \mathsf{extended}\ \mathsf{with}\ \texttt{SpliceExprNode}\ \mathsf{and}\ \texttt{SpliceIdentNode},\ \mathsf{parses}\ \texttt{ts}\ \mathsf{as}\ \mathsf{exactly}\ \mathsf{one}\ \mathsf{pattern}.
\end{array}
$$

$$
\begin{array}{l}
\operatorname{RenderSplice}(\texttt{Expr},\ \mathsf{cv})\ \Downarrow \ \mathsf{payload}\quad \mathsf{iff}\ (\mathsf{cv}\ =\ \operatorname{CtAst}(a)\ \land \ \operatorname{AstKindOf}(a)\ =\ \texttt{Expr}\ \land \ \mathsf{payload}\ =\ \operatorname{AstPayloadOf}(a))\ \lor \ (\mathsf{cv}\ \ne \ \operatorname{CtAst}(\_)\ \land \ \Gamma \ \vdash \ \operatorname{CtLiteralize}(\mathsf{cv})\ \Downarrow \ \mathsf{payload}) \\[0.16em]
\operatorname{RenderSplice}(\texttt{Stmt},\ \mathsf{cv})\ \Downarrow \ \mathsf{payload}\quad \mathsf{iff}\ \mathsf{cv}\ =\ \operatorname{CtAst}(a)\ \land \ \operatorname{AstKindOf}(a)\ \in \ \{\texttt{Stmt},\ \texttt{Expr}\}\ \land \ \mathsf{payload}\ =\ \operatorname{AstPayloadOf}(a) \\[0.16em]
\operatorname{RenderSplice}(\texttt{Item},\ \mathsf{cv})\ \Downarrow \ \mathsf{payload}\quad \mathsf{iff}\ \mathsf{cv}\ =\ \operatorname{CtAst}(a)\ \land \ \operatorname{AstKindOf}(a)\ =\ \texttt{Item}\ \land \ \mathsf{payload}\ =\ \operatorname{AstPayloadOf}(a) \\[0.16em]
\operatorname{RenderSplice}(\texttt{Type},\ \mathsf{cv})\ \Downarrow \ \mathsf{payload}\quad \mathsf{iff}\ (\mathsf{cv}\ =\ \operatorname{CtAst}(a)\ \land \ \operatorname{AstKindOf}(a)\ =\ \texttt{Type}\ \land \ \mathsf{payload}\ =\ \operatorname{AstPayloadOf}(a))\ \lor \ (\mathsf{cv}\ =\ \operatorname{CtType}(T)\ \land \ \mathsf{payload}\ =\ T) \\[0.16em]
\operatorname{RenderSplice}(\texttt{Pattern},\ \mathsf{cv})\ \Downarrow \ \mathsf{payload}\ \mathsf{iff}\ \mathsf{cv}\ =\ \operatorname{CtAst}(a)\ \land \ \operatorname{AstKindOf}(a)\ =\ \texttt{Pattern}\ \land \ \mathsf{payload}\ =\ \operatorname{AstPayloadOf}(a) \\[0.16em]
\operatorname{RenderSplice}(\texttt{Identifier},\ \mathsf{cv})\ \Downarrow \ \mathsf{payload}\ \mathsf{iff}\ \mathsf{cv}\ =\ \operatorname{CtString}(\mathsf{name})\ \land \ \mathsf{payload}\ =\ \operatorname{Identifier}(\mathsf{name})
\end{array}
$$

HygienizeAst(a, quote_site, emit_site, n) ⇓ (a', n') MUST satisfy all of the following:
1. Any capture from the quote site resolves to the same binding after emission.
2. Any binder introduced by hygienic quoted content, including top-level declaration names in quoted item fragments, MUST NOT capture names from the emission site unless the splice was string-valued in identifier position.
3. Fresh hygienic marks are deterministic functions of `quote_site`, `emit_site`, and the input counter `n`.

If a reference inside the quoted fragment resolves to a hygienic binder introduced by that same fragment before emission, it MUST resolve to the renamed binding after emission.

For `using` and `import`, only explicit alias names are hygienic binders. Unaliased imported names are preserved as written.

**(CtEval-Quote)**

$$
\begin{array}{l}
q\ =\ \operatorname{QuoteNode}(\mathsf{kind}_{\mathsf{opt}},\ \mathsf{body},\ \mathsf{span})\quad T_{q}\ =\ \operatorname{ExprType}(q)\quad \operatorname{ResolveQuoteKind}(q,\ T_{q})\ =\ \mathsf{kind}\quad \operatorname{ParseQuotedBody}(\mathsf{kind},\ \mathsf{body})\ \Downarrow \ \mathsf{payload}_{0}\quad \Gamma \ \vdash \ \operatorname{QuoteBuild}(\Xi ,\ \Phi ,\ \mathsf{kind},\ \mathsf{payload}_{0})\ \Downarrow \ (\mathsf{payload}_{1},\ \Phi_{1} )\quad a\ =\ \operatorname{AstNode}(\mathsf{kind},\ \mathsf{payload}_{1},\ \mathsf{span},\ \langle \operatorname{CtSiteOf}(\Xi ),\ \operatorname{CtSiteOf}(\Xi ),\ 0\rangle ) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{CtEval}(\Xi ,\ \Phi ,\ q)\ \Downarrow \ (\operatorname{CtAst}(a),\ \Xi ,\ \Phi_{1} )
\end{array}
$$

`QuoteBuild` evaluates splice expressions in left-to-right source order. Each splice value is rendered by `RenderSplice`, substituted into the quoted payload, and the resulting fragment becomes the payload of the returned `Ast`.


Emission order is:
1. derive-generated emissions required by §22.5 for the current declaration
2. explicit `TypeEmitter.emit` calls in source order

### 22.4.6 Lowering

Quoted and spliced AST fragments affect lowering only through the declarations and expressions present after Phase 2 expansion. No runtime representation of `Ast` survives unless explicitly embedded by emitted declarations.

### 22.4.7 Diagnostics

Diagnostics for quote, splice, and emission are defined by §22.6.
