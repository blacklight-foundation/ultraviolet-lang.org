---
title: "4.1 Source Loading and Normalization"
description: "4.1 Source Loading and Normalization from 4. Source Text and Lexical Structure of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a"
specChapter: "source-text-and-lexical-structure"
specSection: "41-source-loading-and-normalization"
generatedAt: "2026-05-14T07:35:34.990Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>ee95a2fbe369aa37741c11b97965a47120059090e499b53494a1b62608558a2a</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/source-text-and-lexical-structure/">4. Source Text and Lexical Structure</a>
  <span>Source Text and Lexical Structure</span>
</div>

## 4.1 Source Loading and Normalization

**Source File Record.**

$$
\mathsf{SourceFile}\ =\ \langle \mathsf{path},\ \mathsf{bytes},\ \mathsf{scalars},\ \mathsf{text},\ \mathsf{byte}_{\mathsf{len}},\ \mathsf{line}_{\mathsf{starts}},\ \mathsf{line}_{\mathsf{count}}\rangle 
$$

$$
\begin{array}{l}
S.\mathsf{text}\ =\ \operatorname{EncodeUTF8}(S.\mathsf{scalars}) \\[0.16em]
S.\mathsf{byte}_{\mathsf{len}}\ =\ \operatorname{ByteLen}(S.\mathsf{text}) \\[0.16em]
S.\mathsf{line}_{\mathsf{count}}\ =\ \mid S.\mathsf{line}_{\mathsf{starts}}\mid 
\end{array}
$$

**Unicode Scalars and UTF-8.**

$$
\begin{array}{l}
\mathsf{Byte}\ =\ \{\ n\ \in \ \mathbb{N} \ \mid \ 0\ \le \ n\ \le \ 255\ \} \\[0.16em]
\mathsf{Bytes}\ =\ [\mathsf{Byte}] \\[0.16em]
\mathsf{UnicodeScalar}\ =\ \{\ u\ \in \ \mathbb{N} \ \mid \ 0\ \le \ u\ \le \ 0\mathsf{x10FFFF}\ \land \ u\ \notin \ [0\mathsf{xD800},\ 0\mathsf{xDFFF}]\ \} \\[0.16em]
\mathsf{Scalars}\ =\ [\mathsf{UnicodeScalar}] \\[0.16em]
\mathsf{String}\ =\ \mathsf{Scalars} \\[0.16em]
\operatorname{Utf8Len}(u)\ = \\[0.16em]
\ 1\ \mathsf{if}\ 0\ \le \ u\ \le \ 0\mathsf{x7F} \\[0.16em]
\ 2\ \mathsf{if}\ 0\mathsf{x80}\ \le \ u\ \le \ 0\mathsf{x7FF} \\[0.16em]
\ 3\ \mathsf{if}\ 0\mathsf{x800}\ \le \ u\ \le \ 0\mathsf{xFFFF} \\[0.16em]
\ 4\ \mathsf{if}\ 0\mathsf{x10000}\ \le \ u\ \le \ 0\mathsf{x10FFFF} \\[0.16em]
\operatorname{EncodeUTF8}(u)\ = \\[0.16em]
\ [u]\ \mathsf{if}\ 0\ \le \ u\ \le \ 0\mathsf{x7F} \\[0.16em]
\ [0\mathsf{xC0}\ \lor \ (u\ >>\ 6),\ 0\mathsf{x80}\ \lor \ (u\ \&\ 0\mathsf{x3F})]\ \mathsf{if}\ 0\mathsf{x80}\ \le \ u\ \le \ 0\mathsf{x7FF} \\[0.16em]
\ [0\mathsf{xE0}\ \lor \ (u\ >>\ 12),\ 0\mathsf{x80}\ \lor \ ((u\ >>\ 6)\ \&\ 0\mathsf{x3F}),\ 0\mathsf{x80}\ \lor \ (u\ \&\ 0\mathsf{x3F})]\ \mathsf{if}\ 0\mathsf{x800}\ \le \ u\ \le \ 0\mathsf{xFFFF} \\[0.16em]
\ [0\mathsf{xF0}\ \lor \ (u\ >>\ 18),\ 0\mathsf{x80}\ \lor \ ((u\ >>\ 12)\ \&\ 0\mathsf{x3F}),\ 0\mathsf{x80}\ \lor \ ((u\ >>\ 6)\ \&\ 0\mathsf{x3F}),\ 0\mathsf{x80}\ \lor \ (u\ \&\ 0\mathsf{x3F})]\ \mathsf{if}\ 0\mathsf{x10000}\ \le \ u\ \le \ 0\mathsf{x10FFFF} \\[0.16em]
\operatorname{EncodeUTF8}([])\ =\ [] \\[0.16em]
\operatorname{EncodeUTF8}(u\mathbin{::} U)\ =\ \operatorname{EncodeUTF8}(u)\ \mathbin{++} \ \operatorname{EncodeUTF8}(U) \\[0.16em]
\operatorname{DecodeUTF8}(B)\ =\ U\ \Leftrightarrow \ \operatorname{EncodeUTF8}(U)\ =\ B \\[0.16em]
\operatorname{Utf8Valid}(B)\ \Leftrightarrow \ \exists \ U.\ \operatorname{DecodeUTF8}(B)\ =\ U \\[0.16em]
\operatorname{Utf8}(s)\ =\ \operatorname{EncodeUTF8}(s)
\end{array}
$$

### 4.1.1 Unicode Normalization Outside Identifiers

$$
\begin{array}{l}
\mathsf{NormalizeOutsideIdentifiers}\ :\ \mathsf{Scalars}\ \to \ \mathsf{Scalars} \\[0.16em]
\operatorname{NormalizeOutsideIdentifiers}(T)\ =\ T
\end{array}
$$

### 4.1.2 Lexically Sensitive Unicode Enforcement

T = S.scalars

$$
\begin{array}{l}
\operatorname{LexSensitivePos}(S)\ =\ [\ p\ \mid \ 0\ \le \ p\ <\ \mid T\mid \ \land \ \operatorname{Sensitive}(T[p])\ \land \ \lnot \ \operatorname{InsideLiteralOrComment}(p)\ ] \\[0.16em]
\Gamma \ \vdash \ \operatorname{LexSecure}(S,\ K,\ \operatorname{LexSensitivePos}(S))\ \Downarrow \ \mathsf{ok}
\end{array}
$$

### 4.1.3 UTF-8 Decoding and BOM Handling

**(Decode-Ok)**

$$
\begin{array}{l}
\operatorname{DecodeUTF8}(B)\ \Downarrow \ U \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Decode}(B)\ \Downarrow \ U
\end{array}
$$

**(Decode-Err)**

$$
\begin{array}{l}
\operatorname{DecodeUTF8}(B)\ \Uparrow  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Decode}(B)\ \Uparrow 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{StripLeadBOM}([])\ =\ [] \\[0.16em]
\operatorname{StripLeadBOM}(U+\mathsf{FEFF}\mathbin{::} U)\ =\ U \\[0.16em]
\operatorname{StripLeadBOM}(u\mathbin{::} U)\ =\ u\mathbin{::} U\ \mathsf{if}\ u\ \ne \ U+\mathsf{FEFF}
\end{array}
$$

**(StripBOM-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{StripBOM}([])\ \Downarrow \ ([],\ \mathsf{false},\ \bot )
\end{array}
$$

**(StripBOM-None)**

$$
\begin{array}{l}
U\ =\ u_{0}\mathbin{::} u_{1}\mathbin{::} \ldots \quad u_{0}\ \ne \ U+\mathsf{FEFF}\quad \forall \ i\ >\ 0,\ u_{i}\ \ne \ U+\mathsf{FEFF} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{StripBOM}(U)\ \Downarrow \ (U,\ \mathsf{false},\ \bot )
\end{array}
$$

**(StripBOM-Start)**

$$
\begin{array}{l}
U\ =\ U+\mathsf{FEFF}\mathbin{::} U_{1}\quad \forall \ i,\ U_{1}[i]\ \ne \ U+\mathsf{FEFF} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{StripBOM}(U)\ \Downarrow \ (U_{1},\ \mathsf{true},\ \bot )
\end{array}
$$

**(StripBOM-Embedded)**

$$
\begin{array}{l}
U'\ =\ \operatorname{StripLeadBOM}(U)\quad b\ =\ (U\ \ne \ []\ \land \ U[0]\ =\ U+\mathsf{FEFF})\quad i\ =\ \mathsf{min}\{\ p\ \mid \ 0\ \le \ p\ <\ \mid U'\mid \ \land \ U'[p]\ =\ U+\mathsf{FEFF}\ \} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{StripBOM}(U)\ \Downarrow \ (U',\ b,\ i)
\end{array}
$$

### 4.1.4 Line Ending Normalization and Logical Lines

CR = U+000D
LF = U+000A

**(Norm-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{NormalizeLF}([])\ \Downarrow \ []
\end{array}
$$

**(Norm-CRLF)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{NormalizeLF}(U)\ \Downarrow \ V \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{NormalizeLF}([\mathsf{CR},\ \mathsf{LF}]\ \mathbin{++} \ U)\ \Downarrow \ [\mathsf{LF}]\ \mathbin{++} \ V
\end{array}
$$

**(Norm-CR)**

$$
\begin{array}{l}
U\ =\ []\ \lor \ U[0]\ \ne \ \mathsf{LF}\quad \Gamma \ \vdash \ \operatorname{NormalizeLF}(U)\ \Downarrow \ V \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{NormalizeLF}([\mathsf{CR}]\ \mathbin{++} \ U)\ \Downarrow \ [\mathsf{LF}]\ \mathbin{++} \ V
\end{array}
$$

**(Norm-LF)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{NormalizeLF}(U)\ \Downarrow \ V \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{NormalizeLF}([\mathsf{LF}]\ \mathbin{++} \ U)\ \Downarrow \ [\mathsf{LF}]\ \mathbin{++} \ V
\end{array}
$$

**(Norm-Other)**

$$
\begin{array}{l}
c\ \ne \ \mathsf{CR}\quad c\ \ne \ \mathsf{LF}\quad \Gamma \ \vdash \ \operatorname{NormalizeLF}(U)\ \Downarrow \ V \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{NormalizeLF}([c]\ \mathbin{++} \ U)\ \Downarrow \ [c]\ \mathbin{++} \ V
\end{array}
$$

**Logical Line Map.**

$$
\begin{array}{l}
\operatorname{Utf8Offsets}([])\ =\ [0] \\[0.16em]
\operatorname{Utf8Offsets}(c\mathbin{::} \mathsf{cs})\ =\ [0]\ \mathbin{++} \ [o\ +\ \operatorname{Utf8Len}(c)\ \mid \ o\ \in \ \operatorname{Utf8Offsets}(\mathsf{cs})]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LineStarts}(T)\ =\ [0]\ \mathbin{++} \ [\operatorname{Utf8Offsets}(T)[i]\ +\ 1\ \mid \ 0\ \le \ i\ <\ \mid T\mid \ \land \ T[i]\ =\ \mathsf{LF}] \\[0.16em]
\operatorname{LineCount}(T)\ =\ \mid \operatorname{LineStarts}(T)\mid 
\end{array}
$$

**Locate (Line/Column).**

$$
\begin{array}{l}
L\ =\ S.\mathsf{line}_{\mathsf{starts}} \\[0.16em]
o'\ =\ \operatorname{min}(o,\ S.\mathsf{byte}_{\mathsf{len}}) \\[0.16em]
k\ =\ \mathsf{max}\{\ j\ \mid \ L[j]\ \le \ o'\ \}
\end{array}
$$

$$
\Gamma \ \vdash \ \operatorname{Locate}(S,\ o)\ \Downarrow \ \langle \mathsf{file}\ =\ S.\mathsf{path},\ \mathsf{offset}\ =\ o',\ \mathsf{line}\ =\ k\ +\ 1,\ \mathsf{col}\ =\ o'\ -\ L[k]\ +\ 1\rangle 
$$

### 4.1.5 Prohibited Code Points

$$
\operatorname{Prohibited}(c)\ \Leftrightarrow \ \operatorname{General_Category}(c)\ =\ \mathsf{Cc}\ \land \ c\ \notin \ \{U+0009,\ U+000A,\ U+000C,\ U+000D\}
$$

$$
\operatorname{LiteralSpan}(T)\ =\ \bigcup \ \{\ [\operatorname{ByteOf}(T,\ i),\ \operatorname{ByteOf}(T,\ j))\ \mid \ \operatorname{StringRange}(T,\ i,\ j)\ \lor \ \operatorname{CharRange}(T,\ i,\ j)\ \}
$$

**(WF-Prohibited)**

$$
\begin{array}{l}
\forall \ i,\ \operatorname{Prohibited}(T[i])\ \Rightarrow \ \operatorname{ByteOf}(T,\ i)\ \in \ \operatorname{LiteralSpan}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ T\ :\ \mathsf{NoProhibited}
\end{array}
$$

### 4.1.6 NFC Normalization for Identifiers and Module Paths

$$
\operatorname{NFC}(s)\ =\ \mathsf{UnicodeNFC}\_\{15.0.0\}(s)
$$

$$
\operatorname{CaseFold}(s)\ =\ \mathsf{UnicodeCaseFold}\_\{15.0.0\}(s)
$$

**Totality.**
The functions NFC and CaseFold are total on sequences of Unicode scalar values. All inputs to IdKey and PathKey MUST be Unicode scalar sequences; inputs are produced by LoadSource, which rejects invalid UTF-8.

$$
\begin{array}{l}
\operatorname{IdKey}(s)\ =\ \operatorname{NFC}(s) \\[0.16em]
\operatorname{IdEq}(s_{1},\ s_{2})\ \Leftrightarrow \ \operatorname{IdKey}(s_{1})\ =\ \operatorname{IdKey}(s_{2})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{PathKey}(p)\ =\ [\operatorname{NFC}(c_{1}),\ \ldots ,\ \operatorname{NFC}(c_{n})] \\[0.16em]
\operatorname{PathEq}(p,\ q)\ \Leftrightarrow \ \operatorname{PathKey}(p)\ =\ \operatorname{PathKey}(q)
\end{array}
$$

### 4.1.7 Newline Tokens and Statement Termination

$$
\begin{array}{l}
\mathsf{Tokenize}\ :\ \mathsf{SourceFile}\ \rightharpoonup \ (\mathsf{Token}*\ \times \ \mathsf{DocComment}*) \\[0.16em]
\operatorname{Tokenize}(S)\ =\ (K,\ D)\ \Rightarrow \ \operatorname{LexNewline}(K,\ S)\ \land \ \operatorname{LexNoComments}(K,\ S)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Depth}(K,\ 0)\ =\ 0 \\[0.16em]
\operatorname{Depth}(K,\ i+1)\ =\ \operatorname{Depth}(K,\ i)\ +\ \delta (K[i]) \\[0.16em]
\delta (t)\ = \\[0.16em]
\ 1\ \mathsf{if}\ t\ \in \ \{\operatorname{Punctuator}(\texttt{"("}),\ \operatorname{Punctuator}(\texttt{"["})\} \\[0.16em]
\ -1\ \mathsf{if}\ t\ \in \ \{\operatorname{Punctuator}(\texttt{")"}),\ \operatorname{Punctuator}(\texttt{"]"})\} \\[0.16em]
\ 0\ \mathsf{otherwise}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Prev}(K,\ i)\ =\ \bot \ \Leftrightarrow \ \{\ j\ \mid \ j\ <\ i\ \land \ K[j].\mathsf{kind}\ \ne \ \mathsf{newline}\ \land \ \forall \ k.\ j\ <\ k\ <\ i\ \Rightarrow \ K[k].\mathsf{kind}\ \ne \ \mathsf{newline}\ \}\ =\ \emptyset  \\[0.16em]
\operatorname{Prev}(K,\ i)\ =\ K[j]\ \Leftrightarrow \ j\ =\ \mathsf{max}\{\ j\ \mid \ j\ <\ i\ \land \ K[j].\mathsf{kind}\ \ne \ \mathsf{newline}\ \land \ \forall \ k.\ j\ <\ k\ <\ i\ \Rightarrow \ K[k].\mathsf{kind}\ \ne \ \mathsf{newline}\ \} \\[0.16em]
\operatorname{Next}(K,\ i)\ =\ \bot \ \Leftrightarrow \ \{\ j\ \mid \ j\ >\ i\ \land \ K[j].\mathsf{kind}\ \ne \ \mathsf{newline}\ \}\ =\ \emptyset  \\[0.16em]
\operatorname{Next}(K,\ i)\ =\ K[j]\ \Leftrightarrow \ j\ =\ \mathsf{min}\{\ j\ \mid \ j\ >\ i\ \land \ K[j].\mathsf{kind}\ \ne \ \mathsf{newline}\ \}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{Ambig}\ =\ \{\texttt{"+"},\ \texttt{"-"},\ \texttt{"*"},\ \texttt{"\&"},\ \texttt{"|"}\} \\[0.16em]
\mathsf{RangeCont}\ =\ \{\texttt{".."},\ \texttt{"..="}\} \\[0.16em]
\operatorname{BeginsOperand}(t)\ \Leftrightarrow \ t.\mathsf{kind}\ \in \ \{\mathsf{Identifier},\ \mathsf{IntLiteral},\ \mathsf{FloatLiteral},\ \mathsf{StringLiteral},\ \mathsf{CharLiteral},\ \mathsf{BoolLiteral},\ \mathsf{NullLiteral}\}\ \lor \ (t.\mathsf{kind}\ =\ \mathsf{Punctuator}\ \land \ t.\mathsf{lexeme}\ \in \ \{\texttt{"("},\ \texttt{"["},\ \texttt{"\{"}\})\ \lor \ (t.\mathsf{kind}\ =\ \mathsf{Operator}\ \land \ t.\mathsf{lexeme}\ \in \ \{\texttt{"!"},\ \texttt{"-"},\ \texttt{"\&"},\ \texttt{"*"},\ \texttt{"\^{}"}\})\ \lor \ (t.\mathsf{kind}\ =\ \mathsf{Keyword}\ \land \ t.\mathsf{lexeme}\ \in \ \{\texttt{"if"},\ \texttt{"loop"},\ \texttt{"unsafe"},\ \texttt{"comptime"},\ \texttt{"quote"},\ \texttt{"move"},\ \texttt{"transmute"},\ \texttt{"widen"},\ \texttt{"parallel"},\ \texttt{"spawn"},\ \texttt{"dispatch"},\ \texttt{"yield"},\ \texttt{"sync"},\ \texttt{"race"},\ \texttt{"all"}\}) \\[0.16em]
\mathsf{UnaryOnly}\ =\ \{\texttt{"!"},\ \texttt{"\~{}"},\ \texttt{"?"}\} \\[0.16em]
\operatorname{AttrClose}(t)\ \Leftrightarrow \ t.\mathsf{kind}\ =\ \mathsf{Punctuator}\ \land \ t.\mathsf{lexeme}\ =\ \texttt{"]]"}
\end{array}
$$

$$
\operatorname{Continue}(K,\ i)\ \Leftrightarrow \ \operatorname{Depth}(K,\ i)\ >\ 0\ \lor \ (\exists \ t.\ \operatorname{Prev}(K,\ i)\ =\ t\ \land \ (t.\mathsf{lexeme}\ =\ \texttt{","}\ \lor \ (t.\mathsf{kind}\ =\ \mathsf{Operator}\ \land \ ((((t.\mathsf{lexeme}\ \in \ \mathsf{Ambig}\ \lor \ t.\mathsf{lexeme}\ \in \ \mathsf{RangeCont})\ \land \ \exists \ u.\ \operatorname{Next}(K,\ i)\ =\ u\ \land \ \operatorname{BeginsOperand}(u))\ \lor \ (t.\mathsf{lexeme}\ \notin \ \mathsf{UnaryOnly}\ \land \ t.\mathsf{lexeme}\ \notin \ \mathsf{RangeCont}))))))\ \lor \ (\exists \ u.\ \operatorname{Next}(K,\ i)\ =\ u\ \land \ u.\mathsf{lexeme}\ \in \ \{\texttt{"."},\ \texttt{"::"},\ \texttt{"\~{}>"}\})\ \lor \ (\exists \ t,\ u.\ \operatorname{Prev}(K,\ i)\ =\ t\ \land \ \operatorname{AttrClose}(t)\ \land \ \operatorname{Next}(K,\ i)\ =\ u\ \land \ \operatorname{BeginsOperand}(u))
$$

For `t.lexeme ∈ RangeCont`, continuation across newline MUST require `Next(K, i)` to begin an operand. This permits split forms like `a .. \n b` and `.. \n b`, while allowing newline termination after complete `a ..` and `..` forms.

$$
\operatorname{Filter}(K)\ =\ [\ K[i]\ \mid \ K[i].\mathsf{kind}\ \ne \ \mathsf{newline}\ \lor \ \lnot \ \operatorname{Continue}(K,\ i)\ ]
$$

$$
\begin{array}{l}
\operatorname{IsTerminator}(t)\ \Leftrightarrow \ t\ =\ \operatorname{Punctuator}(\texttt{";"})\ \lor \ t.\mathsf{kind}\ =\ \mathsf{newline} \\[0.16em]
\operatorname{BoundaryTokens}(K,\ i)\ =\ \{\ t\ \mid \ t\ =\ K[i]\ \lor \ t\ =\ \operatorname{Prev}(K,\ i)\ \lor \ t\ =\ \operatorname{Next}(K,\ i)\ \}\ \setminus \ \{\bot \} \\[0.16em]
\operatorname{HasTerminator}(F,\ i)\ \Leftrightarrow \ \exists \ t\ \in \ \operatorname{BoundaryTokens}(F,\ i).\ \operatorname{IsTerminator}(t)
\end{array}
$$
A newline inside `{ ... }` MUST use `Continue(K, i)` without modification; the depth disjunct and non-depth disjuncts apply uniformly inside and outside braces.
Commas are separators within a single statement and are never statement terminators. A comma MUST appear only between elements of a comma-delimited production. Item-separated bodies use statement terminators instead and MUST NOT use commas as top-level separators unless their local grammar explicitly permits them. Trailing commas are permitted only when TrailingCommaAllowed (§5.5); otherwise they are ill-formed. A permitted trailing comma does not introduce an empty list element.

$$
\begin{array}{l}
\mathsf{RequiredTerminator}\ :\ \mathsf{Token}*\ \times \ \mathbb{N} \ \to \ \mathsf{Bool} \\[0.16em]
\mathsf{ContinuesLine}\ :\ \mathsf{Token}*\ \times \ \mathbb{N} \ \to \ \mathsf{Bool} \\[0.16em]
\operatorname{ContinuesLine}(K,\ i)\ \Leftrightarrow \ K[i].\mathsf{kind}\ =\ \mathsf{newline}\ \land \ \operatorname{Continue}(K,\ i) \\[0.16em]
\operatorname{RequiredTerminator}(K,\ i)\ \Leftrightarrow \ K[i].\mathsf{kind}\ =\ \mathsf{newline}\ \land \ \lnot \ \operatorname{ContinuesLine}(K,\ i)
\end{array}
$$

**(Missing-Terminator-Err)**

$$
\begin{array}{l}
\operatorname{RequiredTerminator}(K,\ i)\quad \lnot \ \operatorname{HasTerminator}(\operatorname{Filter}(K),\ i)\quad c\ =\ \operatorname{Code}(\mathsf{Missing}-\mathsf{Terminator}-\mathsf{Err}) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Emit}(c)
\end{array}
$$

### 4.1.8 Source Loading Pipeline

$$
\begin{array}{l}
\mathsf{SourceLoadState}\ =\ \{\operatorname{Start}(f,\ B),\ \operatorname{Sized}(f,\ B),\ \operatorname{Decoded}(f,\ B,\ U),\ \operatorname{BomStripped}(f,\ B,\ U,\ b,\ j),\ \operatorname{Normalized}(f,\ B,\ T,\ j),\ \operatorname{LineMapped}(f,\ B,\ T,\ L),\ \operatorname{Validated}(S),\ \operatorname{Error}(\mathsf{code})\} \\[0.16em]
B\ \in \ \mathsf{Bytes} \\[0.16em]
U\ \in \ \mathsf{Scalars} \\[0.16em]
T\ \in \ \mathsf{Scalars} \\[0.16em]
L\ =\ \operatorname{LineStarts}(T) \\[0.16em]
j\ \in \ \mathbb{N} \ \cup \ \{\bot \}
\end{array}
$$

**(Step-Size)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Start}(f,\ B)\rangle \ \to \ \langle \operatorname{Sized}(f,\ B)\rangle 
\end{array}
$$

**(Step-Decode)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Decode}(B)\ \Downarrow \ U \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Sized}(f,\ B)\rangle \ \to \ \langle \operatorname{Decoded}(f,\ B,\ U)\rangle 
\end{array}
$$

**(Step-Decode-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Decode}(B)\ \Uparrow  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Sized}(f,\ B)\rangle \ \to \ \langle \operatorname{Error}(\operatorname{Code}(\mathsf{Step}-\mathsf{Decode}-\mathsf{Err}))\rangle 
\end{array}
$$

**(Step-BOM)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{StripBOM}(U)\ \Downarrow \ (U',\ b,\ j) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Decoded}(f,\ B,\ U)\rangle \ \to \ \langle \operatorname{BomStripped}(f,\ B,\ U',\ b,\ j)\rangle 
\end{array}
$$

**(Step-Norm)**

$$
\begin{array}{l}
T\ =\ \operatorname{NormalizeOutsideIdentifiers}(U)\quad \Gamma \ \vdash \ \operatorname{NormalizeLF}(T)\ \Downarrow \ V \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{BomStripped}(f,\ B,\ U,\ b,\ j)\rangle \ \to \ \langle \operatorname{Normalized}(f,\ B,\ V,\ j)\rangle 
\end{array}
$$

**(Step-EmbeddedBOM-Err)**

$$
\begin{array}{l}
j\ \ne \ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Normalized}(f,\ B,\ T,\ j)\rangle \ \to \ \langle \operatorname{Error}(\operatorname{Code}(\mathsf{Step}-\mathsf{EmbeddedBOM}-\mathsf{Err}))\rangle 
\end{array}
$$

**(Step-LineMap)**

$$
\begin{array}{l}
j\ =\ \bot \quad L\ =\ \operatorname{LineStarts}(T) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{Normalized}(f,\ B,\ T,\ j)\rangle \ \to \ \langle \operatorname{LineMapped}(f,\ B,\ T,\ L)\rangle 
\end{array}
$$

**(Step-Prohibited)**

$$
\begin{array}{l}
\Gamma \ \vdash \ T\ :\ \mathsf{NoProhibited}\quad S\ =\ \langle \mathsf{path}\ =\ f,\ \mathsf{bytes}\ =\ B,\ \mathsf{scalars}\ =\ T,\ \mathsf{text}\ =\ \operatorname{EncodeUTF8}(T),\ \mathsf{byte}_{\mathsf{len}}\ =\ \operatorname{ByteLen}(T),\ \mathsf{line}_{\mathsf{starts}}\ =\ L,\ \mathsf{line}_{\mathsf{count}}\ =\ \mid L\mid \rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{LineMapped}(f,\ B,\ T,\ L)\rangle \ \to \ \langle \operatorname{Validated}(S)\rangle 
\end{array}
$$

**(Step-Prohibited-Err)**

$$
\begin{array}{l}
\Gamma \ \nvdash \ T\ :\ \mathsf{NoProhibited} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\langle \operatorname{LineMapped}(f,\ B,\ T,\ L)\rangle \ \to \ \langle \operatorname{Error}(\operatorname{Code}(\mathsf{Step}-\mathsf{Prohibited}-\mathsf{Err}))\rangle 
\end{array}
$$

**Source Load (Big-Step)**

**(LoadSource-Ok)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Decode}(B)\ \Downarrow \ U\quad \Gamma \ \vdash \ \operatorname{StripBOM}(U)\ \Downarrow \ (U',\ b,\ \bot )\quad \Gamma \ \vdash \ \operatorname{NormalizeLF}(\operatorname{NormalizeOutsideIdentifiers}(U'))\ \Downarrow \ T\quad L\ =\ \operatorname{LineStarts}(T)\quad \Gamma \ \vdash \ T\ :\ \mathsf{NoProhibited}\quad S\ =\ \langle \mathsf{path}\ =\ f,\ \mathsf{bytes}\ =\ B,\ \mathsf{scalars}\ =\ T,\ \mathsf{text}\ =\ \operatorname{EncodeUTF8}(T),\ \mathsf{byte}_{\mathsf{len}}\ =\ \operatorname{ByteLen}(T),\ \mathsf{line}_{\mathsf{starts}}\ =\ L,\ \mathsf{line}_{\mathsf{count}}\ =\ \mid L\mid \rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LoadSource}(f,\ B)\ \Downarrow \ S
\end{array}
$$

**(LoadSource-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LoadSource}(f,\ B)\ \to *\ \langle \operatorname{Error}(c)\rangle  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{LoadSource}(f,\ B)\ \Uparrow \ c
\end{array}
$$

### 4.1.9 Diagnostic Spans for Source Loading

$$
S_{\mathsf{tmp}}\ =\ \langle \mathsf{path}\ =\ f,\ \mathsf{bytes}\ =\ B,\ \mathsf{text}\ =\ \operatorname{EncodeUTF8}(T),\ \mathsf{byte}_{\mathsf{len}}\ =\ \operatorname{ByteLen}(T),\ \mathsf{line}_{\mathsf{starts}}\ =\ \operatorname{LineStarts}(T),\ \mathsf{line}_{\mathsf{count}}\ =\ \mid \operatorname{LineStarts}(T)\mid \rangle 
$$

$$
\begin{array}{l}
O\ =\ \operatorname{Utf8Offsets}(T) \\[0.16em]
O[\mid T\mid ]\ =\ \operatorname{ByteLen}(T)
\end{array}
$$

$$
\operatorname{SpanAtIndex}(T,\ i)\ =\ \operatorname{SpanOf}(S_{\mathsf{tmp}},\ O[i],\ O[i+1])
$$

$$
\operatorname{SpanAtLineStart}(T,\ k)\ =\ \operatorname{SpanOf}(S_{\mathsf{tmp}},\ s,\ e)
$$
s =

$$
\begin{array}{l}
\ \operatorname{LineStarts}(T)[k]\ \mathsf{if}\ k\ <\ \mid \operatorname{LineStarts}(T)\mid  \\[0.16em]
\ \operatorname{ByteLen}(T)\quad \mathsf{otherwise} \\[0.16em]
e\ =\ \operatorname{min}(s\ +\ 1,\ \operatorname{ByteLen}(T))
\end{array}
$$

If b = true, the warning W-SRC-0101 MUST be emitted even if LoadSource ultimately fails.

**(Span-BOM-Warn)**

$$
\begin{array}{l}
b\ =\ \mathsf{true}\quad e\ =\ \operatorname{min}(1,\ \operatorname{ByteLen}(T)) \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Emit}(W-\mathsf{SRC}-0101,\ \operatorname{SpanOf}(S_{\mathsf{tmp}},\ 0,\ e))
\end{array}
$$

**(Span-BOM-Embedded)**

$$
\begin{array}{l}
j\ \ne \ \bot \quad i\ =\ \mathsf{min}\{\ p\ \mid \ 0\ \le \ p\ <\ \mid T\mid \ \land \ T[p]\ =\ U+\mathsf{FEFF}\ \} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Emit}(E-\mathsf{SRC}-0103,\ \operatorname{SpanAtIndex}(T,\ i))
\end{array}
$$

**(Span-Prohibited)**

$$
\begin{array}{l}
i\ =\ \mathsf{min}\{\ p\ \mid \ 0\ \le \ p\ <\ \mid T\mid \ \land \ \operatorname{Prohibited}(T[p])\ \land \ O[p]\ \notin \ \operatorname{LiteralSpan}(T)\ \} \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Emit}(E-\mathsf{SRC}-0104,\ \operatorname{SpanAtIndex}(T,\ i))
\end{array}
$$

**(NoSpan-Decode)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ \operatorname{Emit}(E-\mathsf{SRC}-0101,\ \bot )
\end{array}
$$
