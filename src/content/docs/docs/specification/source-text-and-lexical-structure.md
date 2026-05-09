---
title: "Source Text and Lexical Structure"
description: "4. Source Text and Lexical Structure of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T19:35:24.518Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>


## 4.1 Source Loading and Normalization

**Source File Record.**

$$
\mathsf{SourceFile}\ =\ \langle \mathsf{path},\ \mathsf{bytes},\ \mathsf{scalars},\ \mathsf{text},\ \mathsf{byte}_{\mathsf{len}},\ \mathsf{line}_{\mathsf{starts}},\ \mathsf{line}_{\mathsf{count}}\rangle 
$$

$$
\begin{array}{l}
S.\mathsf{text}\ =\ \operatorname{EncodeUTF8}(S.\mathsf{scalars}) \\
S.\mathsf{byte}_{\mathsf{len}}\ =\ \operatorname{ByteLen}(S.\mathsf{text}) \\
S.\mathsf{line}_{\mathsf{count}}\ =\ \mid S.\mathsf{line}_{\mathsf{starts}}\mid 
\end{array}
$$

**Unicode Scalars and UTF-8.**

$$
\begin{array}{l}
\mathsf{Byte}\ =\ \{\ n\ \in \ \mathbb{N} \ \mid \ 0\ \le \ n\ \le \ 255\ \} \\
\mathsf{Bytes}\ =\ [\mathsf{Byte}] \\
\mathsf{UnicodeScalar}\ =\ \{\ u\ \in \ \mathbb{N} \ \mid \ 0\ \le \ u\ \le \ 0\mathsf{x10FFFF}\ \land \ u\ \notin \ [0\mathsf{xD800},\ 0\mathsf{xDFFF}]\ \} \\
\mathsf{Scalars}\ =\ [\mathsf{UnicodeScalar}]
\end{array}
$$
String = Scalars

$$
\begin{array}{l}
\operatorname{Utf8Len}(u)\ = \\
\ 1\ \mathsf{if}\ 0\ \le \ u\ \le \ 0\mathsf{x7F} \\
\ 2\ \mathsf{if}\ 0\mathsf{x80}\ \le \ u\ \le \ 0\mathsf{x7FF} \\
\ 3\ \mathsf{if}\ 0\mathsf{x800}\ \le \ u\ \le \ 0\mathsf{xFFFF} \\
\ 4\ \mathsf{if}\ 0\mathsf{x10000}\ \le \ u\ \le \ 0\mathsf{x10FFFF} \\
\operatorname{EncodeUTF8}(u)\ = \\
\ [u]\ \mathsf{if}\ 0\ \le \ u\ \le \ 0\mathsf{x7F} \\
\ [0\mathsf{xC0}\ \lor \ (u\ >>\ 6),\ 0\mathsf{x80}\ \lor \ (u\ \&\ 0\mathsf{x3F})]\ \mathsf{if}\ 0\mathsf{x80}\ \le \ u\ \le \ 0\mathsf{x7FF} \\
\ [0\mathsf{xE0}\ \lor \ (u\ >>\ 12),\ 0\mathsf{x80}\ \lor \ ((u\ >>\ 6)\ \&\ 0\mathsf{x3F}),\ 0\mathsf{x80}\ \lor \ (u\ \&\ 0\mathsf{x3F})]\ \mathsf{if}\ 0\mathsf{x800}\ \le \ u\ \le \ 0\mathsf{xFFFF} \\
\ [0\mathsf{xF0}\ \lor \ (u\ >>\ 18),\ 0\mathsf{x80}\ \lor \ ((u\ >>\ 12)\ \&\ 0\mathsf{x3F}),\ 0\mathsf{x80}\ \lor \ ((u\ >>\ 6)\ \&\ 0\mathsf{x3F}),\ 0\mathsf{x80}\ \lor \ (u\ \&\ 0\mathsf{x3F})]\ \mathsf{if}\ 0\mathsf{x10000}\ \le \ u\ \le \ 0\mathsf{x10FFFF} \\
\operatorname{EncodeUTF8}([])\ =\ [] \\
\operatorname{EncodeUTF8}(u\mathbin{::} U)\ =\ \operatorname{EncodeUTF8}(u)\ \mathbin{++} \ \operatorname{EncodeUTF8}(U) \\
\operatorname{DecodeUTF8}(B)\ =\ U\ \Leftrightarrow \ \operatorname{EncodeUTF8}(U)\ =\ B \\
\operatorname{Utf8Valid}(B)\ \Leftrightarrow \ \exists \ U.\ \operatorname{DecodeUTF8}(B)\ =\ U \\
\operatorname{Utf8}(s)\ =\ \operatorname{EncodeUTF8}(s)
\end{array}
$$

### 4.1.1 Unicode Normalization Outside Identifiers

$$
\begin{array}{l}
\mathsf{NormalizeOutsideIdentifiers}\ :\ \mathsf{Scalars}\ \to \ \mathsf{Scalars} \\
\operatorname{NormalizeOutsideIdentifiers}(T)\ =\ T
\end{array}
$$

### 4.1.2 Lexically Sensitive Unicode Enforcement

T = S.scalars

$$
\begin{array}{l}
\operatorname{LexSensitivePos}(S)\ =\ [\ p\ \mid \ 0\ \le \ p\ <\ \mid T\mid \ \land \ \operatorname{Sensitive}(T[p])\ \land \ \lnot \ \operatorname{InsideLiteralOrComment}(p)\ ] \\
\Gamma \ \vdash \ \operatorname{LexSecure}(S,\ K,\ \operatorname{LexSensitivePos}(S))\ \Downarrow \ \mathsf{ok}
\end{array}
$$

### 4.1.3 UTF-8 Decoding and BOM Handling

**(Decode-Ok)**

$$
\begin{array}{l}
\operatorname{DecodeUTF8}(B)\ \Downarrow \ U \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Decode}(B)\ \Downarrow \ U
\end{array}
$$

**(Decode-Err)**

$$
\begin{array}{l}
\operatorname{DecodeUTF8}(B)\ \Uparrow  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Decode}(B)\ \Uparrow 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{StripLeadBOM}([])\ =\ [] \\
\operatorname{StripLeadBOM}(U+\mathsf{FEFF}\mathbin{::} U)\ =\ U \\
\operatorname{StripLeadBOM}(u\mathbin{::} U)\ =\ u\mathbin{::} U\ \mathsf{if}\ u\ \ne \ U+\mathsf{FEFF}
\end{array}
$$

**(StripBOM-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{StripBOM}([])\ \Downarrow \ ([],\ \mathsf{false},\ \bot )
\end{array}
$$

**(StripBOM-None)**

$$
\begin{array}{l}
U\ =\ u_{0}\mathbin{::} u_{1}\mathbin{::} \ldots \quad u_{0}\ \ne \ U+\mathsf{FEFF}\quad \forall \ i\ >\ 0,\ u_{i}\ \ne \ U+\mathsf{FEFF} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{StripBOM}(U)\ \Downarrow \ (U,\ \mathsf{false},\ \bot )
\end{array}
$$

**(StripBOM-Start)**

$$
\begin{array}{l}
U\ =\ U+\mathsf{FEFF}\mathbin{::} U_{1}\quad \forall \ i,\ U_{1}[i]\ \ne \ U+\mathsf{FEFF} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{StripBOM}(U)\ \Downarrow \ (U_{1},\ \mathsf{true},\ \bot )
\end{array}
$$

**(StripBOM-Embedded)**

$$
\begin{array}{l}
U'\ =\ \operatorname{StripLeadBOM}(U)\quad b\ =\ (U\ \ne \ []\ \land \ U[0]\ =\ U+\mathsf{FEFF})\quad i\ =\ \mathsf{min}\{\ p\ \mid \ 0\ \le \ p\ <\ \mid U'\mid \ \land \ U'[p]\ =\ U+\mathsf{FEFF}\ \} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{StripBOM}(U)\ \Downarrow \ (U',\ b,\ i)
\end{array}
$$

### 4.1.4 Line Ending Normalization and Logical Lines

CR = U+000D
LF = U+000A

**(Norm-Empty)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{NormalizeLF}([])\ \Downarrow \ []
\end{array}
$$

**(Norm-CRLF)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{NormalizeLF}(U)\ \Downarrow \ V \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{NormalizeLF}([\mathsf{CR},\ \mathsf{LF}]\ \mathbin{++} \ U)\ \Downarrow \ [\mathsf{LF}]\ \mathbin{++} \ V
\end{array}
$$

**(Norm-CR)**

$$
\begin{array}{l}
U\ =\ []\ \lor \ U[0]\ \ne \ \mathsf{LF}\quad \Gamma \ \vdash \ \operatorname{NormalizeLF}(U)\ \Downarrow \ V \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{NormalizeLF}([\mathsf{CR}]\ \mathbin{++} \ U)\ \Downarrow \ [\mathsf{LF}]\ \mathbin{++} \ V
\end{array}
$$

**(Norm-LF)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{NormalizeLF}(U)\ \Downarrow \ V \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{NormalizeLF}([\mathsf{LF}]\ \mathbin{++} \ U)\ \Downarrow \ [\mathsf{LF}]\ \mathbin{++} \ V
\end{array}
$$

**(Norm-Other)**

$$
\begin{array}{l}
c\ \ne \ \mathsf{CR}\quad c\ \ne \ \mathsf{LF}\quad \Gamma \ \vdash \ \operatorname{NormalizeLF}(U)\ \Downarrow \ V \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{NormalizeLF}([c]\ \mathbin{++} \ U)\ \Downarrow \ [c]\ \mathbin{++} \ V
\end{array}
$$

**Logical Line Map.**

$$
\begin{array}{l}
\operatorname{Utf8Offsets}([])\ =\ [0] \\
\operatorname{Utf8Offsets}(c\mathbin{::} \mathsf{cs})\ =\ [0]\ \mathbin{++} \ [o\ +\ \operatorname{Utf8Len}(c)\ \mid \ o\ \in \ \operatorname{Utf8Offsets}(\mathsf{cs})]
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LineStarts}(T)\ =\ [0]\ \mathbin{++} \ [\operatorname{Utf8Offsets}(T)[i]\ +\ 1\ \mid \ 0\ \le \ i\ <\ \mid T\mid \ \land \ T[i]\ =\ \mathsf{LF}] \\
\operatorname{LineCount}(T)\ =\ \mid \operatorname{LineStarts}(T)\mid 
\end{array}
$$

**Locate (Line/Column).**

$$
\begin{array}{l}
L\ =\ S.\mathsf{line}_{\mathsf{starts}} \\
o'\ =\ \operatorname{min}(o,\ S.\mathsf{byte}_{\mathsf{len}}) \\
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
\forall \ i,\ \operatorname{Prohibited}(T[i])\ \Rightarrow \ \operatorname{ByteOf}(T,\ i)\ \in \ \operatorname{LiteralSpan}(T) \\
\rule{18em}{0.4pt} \\
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
\operatorname{IdKey}(s)\ =\ \operatorname{NFC}(s) \\
\operatorname{IdEq}(s_{1},\ s_{2})\ \Leftrightarrow \ \operatorname{IdKey}(s_{1})\ =\ \operatorname{IdKey}(s_{2})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{PathKey}(p)\ =\ [\operatorname{NFC}(c_{1}),\ \ldots ,\ \operatorname{NFC}(c_{n})] \\
\operatorname{PathEq}(p,\ q)\ \Leftrightarrow \ \operatorname{PathKey}(p)\ =\ \operatorname{PathKey}(q)
\end{array}
$$

### 4.1.7 Newline Tokens and Statement Termination

$$
\begin{array}{l}
\mathsf{Tokenize}\ :\ \mathsf{SourceFile}\ \rightharpoonup \ (\mathsf{Token}*\ \times \ \mathsf{DocComment}*) \\
\operatorname{Tokenize}(S)\ =\ (K,\ D)\ \Rightarrow \ \operatorname{LexNewline}(K,\ S)\ \land \ \operatorname{LexNoComments}(K,\ S)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Depth}(K,\ 0)\ =\ 0 \\
\operatorname{Depth}(K,\ i+1)\ =\ \operatorname{Depth}(K,\ i)\ +\ \delta (K[i]) \\
\delta (t)\ = \\
\ 1\ \mathsf{if}\ t\ \in \ \{\operatorname{Punctuator}(\texttt{"("}),\ \operatorname{Punctuator}(\texttt{"["})\} \\
\ -1\ \mathsf{if}\ t\ \in \ \{\operatorname{Punctuator}(\texttt{")"}),\ \operatorname{Punctuator}(\texttt{"]"})\} \\
\ 0\ \mathsf{otherwise}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{Prev}(K,\ i)\ =\ \bot \ \Leftrightarrow \ \{\ j\ \mid \ j\ <\ i\ \land \ K[j].\mathsf{kind}\ \ne \ \mathsf{newline}\ \land \ \forall \ k.\ j\ <\ k\ <\ i\ \Rightarrow \ K[k].\mathsf{kind}\ \ne \ \mathsf{newline}\ \}\ =\ \emptyset  \\
\operatorname{Prev}(K,\ i)\ =\ K[j]\ \Leftrightarrow \ j\ =\ \mathsf{max}\{\ j\ \mid \ j\ <\ i\ \land \ K[j].\mathsf{kind}\ \ne \ \mathsf{newline}\ \land \ \forall \ k.\ j\ <\ k\ <\ i\ \Rightarrow \ K[k].\mathsf{kind}\ \ne \ \mathsf{newline}\ \} \\
\operatorname{Next}(K,\ i)\ =\ \bot \ \Leftrightarrow \ \{\ j\ \mid \ j\ >\ i\ \land \ K[j].\mathsf{kind}\ \ne \ \mathsf{newline}\ \}\ =\ \emptyset  \\
\operatorname{Next}(K,\ i)\ =\ K[j]\ \Leftrightarrow \ j\ =\ \mathsf{min}\{\ j\ \mid \ j\ >\ i\ \land \ K[j].\mathsf{kind}\ \ne \ \mathsf{newline}\ \}
\end{array}
$$

$$
\begin{array}{l}
\mathsf{Ambig}\ =\ \{\texttt{"+"},\ \texttt{"-"},\ \texttt{"*"},\ \texttt{"\&"},\ \texttt{"|"}\} \\
\mathsf{RangeCont}\ =\ \{\texttt{".."},\ \texttt{"..="}\} \\
\operatorname{BeginsOperand}(t)\ \Leftrightarrow \ t.\mathsf{kind}\ \in \ \{\mathsf{Identifier},\ \mathsf{IntLiteral},\ \mathsf{FloatLiteral},\ \mathsf{StringLiteral},\ \mathsf{CharLiteral},\ \mathsf{BoolLiteral},\ \mathsf{NullLiteral}\}\ \lor \ (t.\mathsf{kind}\ =\ \mathsf{Punctuator}\ \land \ t.\mathsf{lexeme}\ \in \ \{\texttt{"("},\ \texttt{"["},\ \texttt{"\{"}\})\ \lor \ (t.\mathsf{kind}\ =\ \mathsf{Operator}\ \land \ t.\mathsf{lexeme}\ \in \ \{\texttt{"!"},\ \texttt{"-"},\ \texttt{"\&"},\ \texttt{"*"},\ \texttt{"\^{}"}\})\ \lor \ (t.\mathsf{kind}\ =\ \mathsf{Keyword}\ \land \ t.\mathsf{lexeme}\ \in \ \{\texttt{"if"},\ \texttt{"loop"},\ \texttt{"unsafe"},\ \texttt{"comptime"},\ \texttt{"quote"},\ \texttt{"move"},\ \texttt{"transmute"},\ \texttt{"widen"},\ \texttt{"parallel"},\ \texttt{"spawn"},\ \texttt{"dispatch"},\ \texttt{"yield"},\ \texttt{"sync"},\ \texttt{"race"},\ \texttt{"all"}\}) \\
\mathsf{UnaryOnly}\ =\ \{\texttt{"!"},\ \texttt{"\~{}"},\ \texttt{"?"}\} \\
\operatorname{AttrClose}(t)\ \Leftrightarrow \ t.\mathsf{kind}\ =\ \mathsf{Punctuator}\ \land \ t.\mathsf{lexeme}\ =\ \texttt{"]]"}
\end{array}
$$

$$
\operatorname{Continue}(K,\ i)\ \Leftrightarrow \ \operatorname{Depth}(K,\ i)\ >\ 0\ \lor \ (\exists \ t.\ \operatorname{Prev}(K,\ i)\ =\ t\ \land \ (t.\mathsf{lexeme}\ =\ \texttt{","}\ \lor \ (t.\mathsf{kind}\ =\ \mathsf{Operator}\ \land \ ((((t.\mathsf{lexeme}\ \in \ \mathsf{Ambig}\ \lor \ t.\mathsf{lexeme}\ \in \ \mathsf{RangeCont})\ \land \ \exists \ u.\ \operatorname{Next}(K,\ i)\ =\ u\ \land \ \operatorname{BeginsOperand}(u))\ \lor \ (t.\mathsf{lexeme}\ \notin \ \mathsf{UnaryOnly}\ \land \ t.\mathsf{lexeme}\ \notin \ \mathsf{RangeCont}))))))\ \lor \ (\exists \ u.\ \operatorname{Next}(K,\ i)\ =\ u\ \land \ u.\mathsf{lexeme}\ \in \ \{\texttt{"."},\ \texttt{"::"},\ \texttt{"\~{}>"}\})\ \lor \ (\exists \ t,\ u.\ \operatorname{Prev}(K,\ i)\ =\ t\ \land \ \operatorname{AttrClose}(t)\ \land \ \operatorname{Next}(K,\ i)\ =\ u\ \land \ \operatorname{BeginsOperand}(u))
$$

$$
\mathsf{For}\ \texttt{t.lexeme in RangeCont},\ \mathsf{continuation}\ \mathsf{across}\ \mathsf{newline}\ \mathsf{MUST}\ \mathsf{require}\ \texttt{Next(K, i)}\ \mathsf{to}\ \mathsf{begin}\ \mathsf{an}\ \mathsf{operand}.\ \mathsf{This}\ \mathsf{permits}\ \mathsf{split}\ \mathsf{forms}\ \mathsf{like}\ \texttt{a .. \textbackslash{}n b}\ \mathsf{and}\ \texttt{.. \textbackslash{}n b},\ \mathsf{while}\ \mathsf{allowing}\ \mathsf{newline}\ \mathsf{termination}\ \mathsf{after}\ \mathsf{complete}\ \texttt{a ..}\ \mathsf{and}\ \texttt{..}\ \mathsf{forms}.
$$

$$
\operatorname{Filter}(K)\ =\ [\ K[i]\ \mid \ K[i].\mathsf{kind}\ \ne \ \mathsf{newline}\ \lor \ \lnot \ \operatorname{Continue}(K,\ i)\ ]
$$

$$
\begin{array}{l}
\operatorname{IsTerminator}(t)\ \Leftrightarrow \ t\ =\ \operatorname{Punctuator}(\texttt{";"})\ \lor \ t.\mathsf{kind}\ =\ \mathsf{newline} \\
\operatorname{BoundaryTokens}(K,\ i)\ =\ \{\ t\ \mid \ t\ =\ K[i]\ \lor \ t\ =\ \operatorname{Prev}(K,\ i)\ \lor \ t\ =\ \operatorname{Next}(K,\ i)\ \}\ \setminus \ \{\bot \} \\
\operatorname{HasTerminator}(F,\ i)\ \Leftrightarrow \ \exists \ t\ \in \ \operatorname{BoundaryTokens}(F,\ i).\ \operatorname{IsTerminator}(t) \\
A\ \mathsf{newline}\ \mathsf{inside}\ \texttt{\{ ... \}}\ \mathsf{MUST}\ \mathsf{use}\ \texttt{Continue(K, i)}\ \mathsf{without}\ \mathsf{modification};\ \mathsf{the}\ \mathsf{depth}\ \mathsf{disjunct}\ \mathsf{and}\ \mathsf{non}-\mathsf{depth}\ \mathsf{disjuncts}\ \mathsf{apply}\ \mathsf{uniformly}\ \mathsf{inside}\ \mathsf{and}\ \mathsf{outside}\ \mathsf{braces}.
\end{array}
$$
Commas are separators within a single statement and are never statement terminators. A comma MUST appear only between elements of a comma-delimited production. Item-separated bodies use statement terminators instead and MUST NOT use commas as top-level separators unless their local grammar explicitly permits them. Trailing commas are permitted only when TrailingCommaAllowed (§5.5); otherwise they are ill-formed. A permitted trailing comma does not introduce an empty list element.

$$
\begin{array}{l}
\mathsf{RequiredTerminator}\ :\ \mathsf{Token}*\ \times \ \mathbb{N} \ \to \ \mathsf{Bool} \\
\mathsf{ContinuesLine}\ :\ \mathsf{Token}*\ \times \ \mathbb{N} \ \to \ \mathsf{Bool} \\
\operatorname{ContinuesLine}(K,\ i)\ \Leftrightarrow \ K[i].\mathsf{kind}\ =\ \mathsf{newline}\ \land \ \operatorname{Continue}(K,\ i) \\
\operatorname{RequiredTerminator}(K,\ i)\ \Leftrightarrow \ K[i].\mathsf{kind}\ =\ \mathsf{newline}\ \land \ \lnot \ \operatorname{ContinuesLine}(K,\ i)
\end{array}
$$

**(Missing-Terminator-Err)**

$$
\begin{array}{l}
\operatorname{RequiredTerminator}(K,\ i)\quad \lnot \ \operatorname{HasTerminator}(\operatorname{Filter}(K),\ i)\quad c\ =\ \operatorname{Code}(\mathsf{Missing}-\mathsf{Terminator}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Emit}(c)
\end{array}
$$

### 4.1.8 Source Loading Pipeline

$$
\begin{array}{l}
\mathsf{SourceLoadState}\ =\ \{\operatorname{Start}(f,\ B),\ \operatorname{Sized}(f,\ B),\ \operatorname{Decoded}(f,\ B,\ U),\ \operatorname{BomStripped}(f,\ B,\ U,\ b,\ j),\ \operatorname{Normalized}(f,\ B,\ T,\ j),\ \operatorname{LineMapped}(f,\ B,\ T,\ L),\ \operatorname{Validated}(S),\ \operatorname{Error}(\mathsf{code})\} \\
B\ \in \ \mathsf{Bytes} \\
U\ \in \ \mathsf{Scalars} \\
T\ \in \ \mathsf{Scalars} \\
L\ =\ \operatorname{LineStarts}(T) \\
j\ \in \ \mathbb{N} \ \cup \ \{\bot \}
\end{array}
$$

**(Step-Size)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\langle \operatorname{Start}(f,\ B)\rangle \ \to \ \langle \operatorname{Sized}(f,\ B)\rangle 
\end{array}
$$

**(Step-Decode)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Decode}(B)\ \Downarrow \ U \\
\rule{18em}{0.4pt} \\
\langle \operatorname{Sized}(f,\ B)\rangle \ \to \ \langle \operatorname{Decoded}(f,\ B,\ U)\rangle 
\end{array}
$$

**(Step-Decode-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Decode}(B)\ \Uparrow  \\
\rule{18em}{0.4pt} \\
\langle \operatorname{Sized}(f,\ B)\rangle \ \to \ \langle \operatorname{Error}(\operatorname{Code}(\mathsf{Step}-\mathsf{Decode}-\mathsf{Err}))\rangle 
\end{array}
$$

**(Step-BOM)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{StripBOM}(U)\ \Downarrow \ (U',\ b,\ j) \\
\rule{18em}{0.4pt} \\
\langle \operatorname{Decoded}(f,\ B,\ U)\rangle \ \to \ \langle \operatorname{BomStripped}(f,\ B,\ U',\ b,\ j)\rangle 
\end{array}
$$

**(Step-Norm)**

$$
\begin{array}{l}
T\ =\ \operatorname{NormalizeOutsideIdentifiers}(U)\quad \Gamma \ \vdash \ \operatorname{NormalizeLF}(T)\ \Downarrow \ V \\
\rule{18em}{0.4pt} \\
\langle \operatorname{BomStripped}(f,\ B,\ U,\ b,\ j)\rangle \ \to \ \langle \operatorname{Normalized}(f,\ B,\ V,\ j)\rangle 
\end{array}
$$

**(Step-EmbeddedBOM-Err)**

$$
\begin{array}{l}
j\ \ne \ \bot  \\
\rule{18em}{0.4pt} \\
\langle \operatorname{Normalized}(f,\ B,\ T,\ j)\rangle \ \to \ \langle \operatorname{Error}(\operatorname{Code}(\mathsf{Step}-\mathsf{EmbeddedBOM}-\mathsf{Err}))\rangle 
\end{array}
$$

**(Step-LineMap)**

$$
\begin{array}{l}
j\ =\ \bot \quad L\ =\ \operatorname{LineStarts}(T) \\
\rule{18em}{0.4pt} \\
\langle \operatorname{Normalized}(f,\ B,\ T,\ j)\rangle \ \to \ \langle \operatorname{LineMapped}(f,\ B,\ T,\ L)\rangle 
\end{array}
$$

**(Step-Prohibited)**

$$
\begin{array}{l}
\Gamma \ \vdash \ T\ :\ \mathsf{NoProhibited}\quad S\ =\ \langle \mathsf{path}\ =\ f,\ \mathsf{bytes}\ =\ B,\ \mathsf{scalars}\ =\ T,\ \mathsf{text}\ =\ \operatorname{EncodeUTF8}(T),\ \mathsf{byte}_{\mathsf{len}}\ =\ \operatorname{ByteLen}(T),\ \mathsf{line}_{\mathsf{starts}}\ =\ L,\ \mathsf{line}_{\mathsf{count}}\ =\ \mid L\mid \rangle  \\
\rule{18em}{0.4pt} \\
\langle \operatorname{LineMapped}(f,\ B,\ T,\ L)\rangle \ \to \ \langle \operatorname{Validated}(S)\rangle 
\end{array}
$$

**(Step-Prohibited-Err)**

$$
\begin{array}{l}
\Gamma \ \nvdash \ T\ :\ \mathsf{NoProhibited} \\
\rule{18em}{0.4pt} \\
\langle \operatorname{LineMapped}(f,\ B,\ T,\ L)\rangle \ \to \ \langle \operatorname{Error}(\operatorname{Code}(\mathsf{Step}-\mathsf{Prohibited}-\mathsf{Err}))\rangle 
\end{array}
$$

**Source Load (Big-Step)**

**(LoadSource-Ok)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Decode}(B)\ \Downarrow \ U\quad \Gamma \ \vdash \ \operatorname{StripBOM}(U)\ \Downarrow \ (U',\ b,\ \bot )\quad \Gamma \ \vdash \ \operatorname{NormalizeLF}(\operatorname{NormalizeOutsideIdentifiers}(U'))\ \Downarrow \ T\quad L\ =\ \operatorname{LineStarts}(T)\quad \Gamma \ \vdash \ T\ :\ \mathsf{NoProhibited}\quad S\ =\ \langle \mathsf{path}\ =\ f,\ \mathsf{bytes}\ =\ B,\ \mathsf{scalars}\ =\ T,\ \mathsf{text}\ =\ \operatorname{EncodeUTF8}(T),\ \mathsf{byte}_{\mathsf{len}}\ =\ \operatorname{ByteLen}(T),\ \mathsf{line}_{\mathsf{starts}}\ =\ L,\ \mathsf{line}_{\mathsf{count}}\ =\ \mid L\mid \rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LoadSource}(f,\ B)\ \Downarrow \ S
\end{array}
$$

**(LoadSource-Err)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{LoadSource}(f,\ B)\ \to *\ \langle \operatorname{Error}(c)\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LoadSource}(f,\ B)\ \Uparrow \ c
\end{array}
$$

### 4.1.9 Diagnostic Spans for Source Loading

$$
S_{\mathsf{tmp}}\ =\ \langle \mathsf{path}\ =\ f,\ \mathsf{bytes}\ =\ B,\ \mathsf{text}\ =\ \operatorname{EncodeUTF8}(T),\ \mathsf{byte}_{\mathsf{len}}\ =\ \operatorname{ByteLen}(T),\ \mathsf{line}_{\mathsf{starts}}\ =\ \operatorname{LineStarts}(T),\ \mathsf{line}_{\mathsf{count}}\ =\ \mid \operatorname{LineStarts}(T)\mid \rangle 
$$

$$
\begin{array}{l}
O\ =\ \operatorname{Utf8Offsets}(T) \\
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
\ \operatorname{LineStarts}(T)[k]\ \mathsf{if}\ k\ <\ \mid \operatorname{LineStarts}(T)\mid  \\
\ \operatorname{ByteLen}(T)\quad \mathsf{otherwise} \\
e\ =\ \operatorname{min}(s\ +\ 1,\ \operatorname{ByteLen}(T))
\end{array}
$$

$$
\mathsf{If}\ b\ =\ \mathsf{true},\ \mathsf{the}\ \mathsf{warning}\ W-\mathsf{SRC}-0101\ \mathsf{MUST}\ \mathsf{be}\ \mathsf{emitted}\ \mathsf{even}\ \mathsf{if}\ \mathsf{LoadSource}\ \mathsf{ultimately}\ \mathsf{fails}.
$$

**(Span-BOM-Warn)**

$$
\begin{array}{l}
b\ =\ \mathsf{true}\quad e\ =\ \operatorname{min}(1,\ \operatorname{ByteLen}(T)) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Emit}(W-\mathsf{SRC}-0101,\ \operatorname{SpanOf}(S_{\mathsf{tmp}},\ 0,\ e))
\end{array}
$$

**(Span-BOM-Embedded)**

$$
\begin{array}{l}
j\ \ne \ \bot \quad i\ =\ \mathsf{min}\{\ p\ \mid \ 0\ \le \ p\ <\ \mid T\mid \ \land \ T[p]\ =\ U+\mathsf{FEFF}\ \} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Emit}(E-\mathsf{SRC}-0103,\ \operatorname{SpanAtIndex}(T,\ i))
\end{array}
$$

**(Span-Prohibited)**

$$
\begin{array}{l}
i\ =\ \mathsf{min}\{\ p\ \mid \ 0\ \le \ p\ <\ \mid T\mid \ \land \ \operatorname{Prohibited}(T[p])\ \land \ O[p]\ \notin \ \operatorname{LiteralSpan}(T)\ \} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Emit}(E-\mathsf{SRC}-0104,\ \operatorname{SpanAtIndex}(T,\ i))
\end{array}
$$

**(NoSpan-Decode)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Emit}(E-\mathsf{SRC}-0101,\ \bot )
\end{array}
$$

## 4.2 Lexical Analysis

### 4.2.1 Inputs, Outputs, and Records

**LexerInput.**
T = S.scalars
B = S.text

$$
\begin{array}{l}
n\ =\ S.\mathsf{byte}_{\mathsf{len}} \\
\operatorname{LexerInput}(S)\ =\ \langle T,\ B,\ n\rangle 
\end{array}
$$

**LexerOutput.**

$$
\begin{array}{l}
\operatorname{LexerOutput}(S)\ =\ \langle K,\ D\rangle  \\
K\ \in \ \mathsf{Token}*\quad D\ \in \ \mathsf{DocComment}*
\end{array}
$$

**EOF Token.**

$$
\begin{array}{l}
\operatorname{EOFSpan}(S)\ =\ \operatorname{SpanOfText}(S,\ \mid T\mid ,\ \mid T\mid ) \\
\operatorname{TokenEOF}(S)\ =\ \langle \mathsf{EOF},\ \varepsilon ,\ \operatorname{EOFSpan}(S)\rangle 
\end{array}
$$

**LexemeBinding.**

$$
\begin{array}{l}
\operatorname{TokenRange}(S,\ t)\ =\ (i,\ j)\ \Leftrightarrow \ t.\mathsf{span}\ =\ \operatorname{SpanOfText}(S,\ i,\ j) \\
\operatorname{LexemeBinding}(S,\ T,\ K)\ \Leftrightarrow \ \forall \ t\ \in \ K.\ \exists \ i,\ j.\ \operatorname{TokenRange}(S,\ t)\ =\ (i,\ j)\ \land \ t.\mathsf{lexeme}\ =\ \operatorname{Lexeme}(T,\ i,\ j)
\end{array}
$$

**DocComment.**

$$
\mathsf{DocComment}\ =\ \langle \mathsf{kind},\ \mathsf{text},\ \mathsf{span}\rangle 
$$

$$
\begin{array}{l}
\mathsf{DocKind}\ =\ \{\mathsf{LineDoc},\ \mathsf{ModuleDoc}\} \\
\operatorname{StripLeadingSpace}(s)\ = \\
\ s[1..\mid s\mid )\ \mathsf{if}\ \mid s\mid \ >\ 0\ \land \ \operatorname{At}(s,\ 0)\ =\ U+0020 \\
\ s\quad \mathsf{otherwise} \\
\operatorname{DocBody}(T,\ i,\ j)\ =\ \operatorname{StripLeadingSpace}(T[i+3..j)) \\
\operatorname{DocMarker}(T,\ i)\ = \\
\ \mathsf{LineDoc}\quad \mathsf{if}\ T[i..i+3]\ =\ \texttt{"///"} \\
\ \mathsf{ModuleDoc}\ \mathsf{if}\ T[i..i+3]\ =\ \texttt{"//!"} \\
\ \bot \quad \mathsf{otherwise}
\end{array}
$$

**Newline Tokens.**

$$
\begin{array}{l}
\operatorname{NewlineTokenAt}(S,\ T,\ i)\ \Leftrightarrow \ T[i]\ =\ \mathsf{LF}\ \land \ \lnot \ \operatorname{InsideLiteralOrComment}(i) \\
\operatorname{LexNewline}(K,\ S)\ \Leftrightarrow \ \forall \ i.\ \operatorname{NewlineTokenAt}(S,\ T,\ i)\ \Rightarrow \ \exists \ t\ \in \ K.\ t.\mathsf{kind}\ =\ \mathsf{Newline}\ \land \ \operatorname{TokenRange}(S,\ t)\ =\ (i,\ i+1) \\
\operatorname{TokenInComment}(S,\ t)\ \Leftrightarrow \ \exists \ i,\ j,\ a,\ b.\ \operatorname{TokenRange}(S,\ t)\ =\ (i,\ j)\ \land \ (\operatorname{LineCommentRange}(T,\ a,\ b)\ \lor \ \operatorname{BlockCommentRange}(T,\ a,\ b))\ \land \ a\ \le \ i\ \land \ j\ \le \ b \\
\operatorname{LexNoComments}(K,\ S)\ \Leftrightarrow \ \forall \ t\ \in \ K.\ \lnot \ \operatorname{TokenInComment}(S,\ t)
\end{array}
$$

**Indices and Lexemes.**
T = S.scalars

$$
\begin{array}{l}
O\ =\ \operatorname{Utf8Offsets}(T) \\
\operatorname{ScalarIndex}(T)\ =\ \{\ i\ \mid \ 0\ \le \ i\ \le \ \mid T\mid \ \}
\end{array}
$$

$$
\operatorname{ByteOf}(T,\ i)\ =\ O[i]
$$

$$
\operatorname{SpanOfText}(S,\ i,\ j)\ =\ \operatorname{SpanOf}(S,\ \operatorname{ByteOf}(T,\ i),\ \operatorname{ByteOf}(T,\ j))
$$

$$
\operatorname{Lexeme}(T,\ i,\ j)\ =\ T[i..j)
$$

### 4.2.2 Character Classes

$$
c\ \in \ \mathsf{UnicodeScalar}
$$

**Whitespace.**

$$
\operatorname{Whitespace}(c)\ \Leftrightarrow \ c\ \in \ \{U+0020,\ U+0009,\ U+000C\}
$$

**Line Feed.**

$$
\operatorname{LineFeed}(c)\ \Leftrightarrow \ c\ =\ U+000A
$$

**Identifier Characters.**

$$
\begin{array}{l}
\mathsf{XID}_{\mathsf{Start}}\ :\ \mathsf{UnicodeScalar}\ \to \ \mathsf{Bool} \\
\mathsf{XID}_{\mathsf{Continue}}\ :\ \mathsf{UnicodeScalar}\ \to \ \mathsf{Bool}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{IdentStart}(c)\ \Leftrightarrow \ c\ =\ '\_'\ \lor \ \operatorname{XID_Start}(c) \\
\operatorname{IdentContinue}(c)\ \Leftrightarrow \ c\ =\ '\_'\ \lor \ \operatorname{XID_Continue}(c)
\end{array}
$$

XIDVersion = "15.0.0"

$$
\begin{array}{l}
\operatorname{XID_Start}(c)\ \Leftrightarrow \ c\ \in \ \mathsf{UAX31}_{\mathsf{XID}\_\mathsf{Start}}\_\{15.0.0\} \\
\operatorname{XID_Continue}(c)\ \Leftrightarrow \ c\ \in \ \mathsf{UAX31}_{\mathsf{XID}\_\mathsf{Continue}}\_\{15.0.0\}
\end{array}
$$

**Non-Characters.**

$$
\operatorname{NonCharacter}(c)\ \Leftrightarrow \ c\ \in \ [U+\mathsf{FDD0},\ U+\mathsf{FDEF}]\ \lor \ (c\ \&\ 0\mathsf{xFFFF})\ \in \ \{0\mathsf{xFFFE},\ 0\mathsf{xFFFF}\}
$$

**Digits.**

$$
\begin{array}{l}
\operatorname{DecDigit}(c)\ \Leftrightarrow \ c\ \in \ \{'0'\ \ldots \ '9'\} \\
\operatorname{HexDigit}(c)\ \Leftrightarrow \ \operatorname{DecDigit}(c)\ \lor \ c\ \in \ \{'a'\ \ldots \ 'f',\ 'A'\ \ldots \ 'F'\} \\
\operatorname{OctDigit}(c)\ \Leftrightarrow \ c\ \in \ \{'0'\ \ldots \ '7'\} \\
\operatorname{BinDigit}(c)\ \Leftrightarrow \ c\ \in \ \{'0',\ '1'\}
\end{array}
$$

**Lexically Sensitive Characters.**

$$
\operatorname{Sensitive}(c)\ \Leftrightarrow \ c\ \in \ \{U+202A\ \ldots \ U+202E,\ U+2066\ \ldots \ U+2069,\ U+200C,\ U+200D\}
$$

### 4.2.3 Reserved Lexemes

**Reserved.**

$$
\mathsf{Reserved}\ =\ \{\texttt{all},\ \texttt{as},\ \texttt{break},\ \texttt{class},\ \texttt{comptime},\ \texttt{continue},\ \texttt{derive},\ \texttt{dispatch},\ \texttt{else},\ \texttt{enum},\ \texttt{false},\ \texttt{defer},\ \texttt{frame},\ \texttt{from},\ \texttt{if},\ \texttt{imm},\ \texttt{import},\ \texttt{internal},\ \texttt{let},\ \texttt{loop},\ \texttt{modal},\ \texttt{move},\ \texttt{mut},\ \texttt{null},\ \texttt{parallel},\ \texttt{private},\ \texttt{procedure},\ \texttt{public},\ \texttt{quote},\ \texttt{race},\ \texttt{record},\ \texttt{region},\ \texttt{return},\ \texttt{shared},\ \texttt{spawn},\ \texttt{sync},\ \texttt{transition},\ \texttt{transmute},\ \texttt{true},\ \texttt{type},\ \texttt{unique},\ \texttt{unsafe},\ \texttt{var},\ \texttt{widen},\ \texttt{using},\ \texttt{yield},\ \texttt{const},\ \texttt{override}\}
$$

$$
\mathsf{FutureReserved}\ =\ \emptyset 
$$

**Keyword Predicate.**

$$
\operatorname{Keyword}(s)\ \Leftrightarrow \ s\ \in \ \mathsf{Reserved}
$$

**Reserved Namespaces.**

$$
\begin{array}{l}
\mathsf{ReservedNamespacePrefix}\ =\ \{\texttt{ultraviolet::}\} \\
\mathsf{ReservedIdentPrefix}\ =\ \{\texttt{gen\_}\}
\end{array}
$$
ReservedNamespacePhase = Phase3

**Universe-Protected Bindings.**

$$
\mathsf{UniverseProtected}\ =\ \{\texttt{i8},\ \texttt{i16},\ \texttt{i32},\ \texttt{i64},\ \texttt{i128},\ \texttt{u8},\ \texttt{u16},\ \texttt{u32},\ \texttt{u64},\ \texttt{u128},\ \texttt{f16},\ \texttt{f32},\ \texttt{f64},\ \texttt{bool},\ \texttt{char},\ \texttt{usize},\ \texttt{isize},\ \texttt{Self},\ \texttt{Drop},\ \texttt{Bitcopy},\ \texttt{Clone},\ \texttt{Eq},\ \texttt{Hash},\ \texttt{Hasher},\ \texttt{Iterator},\ \texttt{Step},\ \texttt{FfiSafe},\ \texttt{string},\ \texttt{bytes},\ \texttt{Modal},\ \texttt{Region},\ \texttt{RegionOptions},\ \texttt{CancelToken},\ \texttt{Context},\ \texttt{System},\ \texttt{Network},\ \texttt{ExecutionDomain},\ \texttt{Reactor},\ \texttt{CpuSet},\ \texttt{Priority},\ \texttt{Async},\ \texttt{Future},\ \texttt{Sequence},\ \texttt{Stream},\ \texttt{Pipe},\ \texttt{Exchange},\ \texttt{Tracked},\ \texttt{Spawned}\}
$$
UniverseProtectedPhase = Phase3

`Drop`, `Bitcopy`, `Clone`, and `FfiSafe` are reserved predicate names. They MUST NOT be declared as classes or used as user-defined type/value bindings.

### 4.2.4 Token Kinds

$$
\mathsf{TokenKind}\ \in \ \{\mathsf{Identifier},\ \operatorname{Keyword}(k),\ \mathsf{IntLiteral},\ \mathsf{FloatLiteral},\ \mathsf{StringLiteral},\ \mathsf{CharLiteral},\ \mathsf{BoolLiteral},\ \mathsf{NullLiteral},\ \operatorname{Operator}(o),\ \operatorname{Punctuator}(p),\ \mathsf{Newline},\ \mathsf{Unknown}\}
$$

**Operator Set.**

$$
\mathsf{OperatorSet}\ =\ \{\texttt{"+"},\ \texttt{"-"},\ \texttt{"*"},\ \texttt{"/"},\ \texttt{"\%"},\ \texttt{"**"},\ \texttt{"=="},\ \texttt{"!="},\ \texttt{"<"},\ \texttt{"<="},\ \texttt{">"},\ \texttt{">="},\ \texttt{"\&\&"},\ \texttt{"||"},\ \texttt{"!"},\ \texttt{"\&"},\ \texttt{"|"},\ \texttt{"\^{}"},\ \texttt{"<<"},\ \texttt{">>"},\ \texttt{"="},\ \texttt{"+="},\ \texttt{"-="},\ \texttt{"*="},\ \texttt{"/="},\ \texttt{"\%="},\ \texttt{"\&="},\ \texttt{"|:"},\ \texttt{"\^{}="},\ \texttt{"<<="},\ \texttt{">>="},\ \texttt{":="},\ \texttt{"<:"},\ \texttt{".."},\ \texttt{"..="},\ \texttt{"=>"},\ \texttt{"->"},\ \texttt{"::"},\ \texttt{"\~{}"},\ \texttt{"\~{}>"},\ \texttt{"\~{}!"},\ \texttt{"\~{}\%"},\ \texttt{"?"},\ \texttt{"\#"},\ \texttt{"@"},\ \texttt{"\$"}\}
$$

**Punctuator Set.**

$$
\mathsf{PunctuatorSet}\ =\ \{\texttt{"("},\ \texttt{")"},\ \texttt{"["},\ \texttt{"]"},\ \texttt{"[["},\ \texttt{"]]"},\ \texttt{"\{"},\ \texttt{"\}"},\ \texttt{","},\ \texttt{":"},\ \texttt{";"},\ \texttt{"."}\}
$$

$$
\mathsf{OperatorSet}\ \cap \ \mathsf{PunctuatorSet}\ =\ \emptyset 
$$

### 4.2.5 Comment and Whitespace Scanning

T = S.scalars

**Line Comment Scan.**

**(Scan-Line-Comment)**

$$
\begin{array}{l}
T[i]\ =\ '/'\quad T[i+1]\ =\ '/'\quad j\ =\ \mathsf{min}\{\ p\ \mid \ i\ \le \ p\ \land \ (p\ =\ \mid T\mid \ \lor \ T[p]\ =\ \mathsf{LF})\ \} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ScanLineComment}(T,\ i)\ \Downarrow \ j
\end{array}
$$

**Doc Comment Classification.**

$$
\begin{array}{l}
\mathsf{kind}\ =\ \operatorname{DocMarker}(T,\ i) \\
\mathsf{body}\ =\ \operatorname{DocBody}(T,\ i,\ j)
\end{array}
$$

**(Doc-Comment)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{ScanLineComment}(T,\ i)\ \Downarrow \ j\quad \mathsf{kind}\ \ne \ \bot  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{DocComment}(T,\ i)\ \Downarrow \ \langle \mathsf{kind},\ \mathsf{body},\ \operatorname{SpanOfText}(S,\ i,\ j)\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LineCommentTokens}(T,\ i)\ =\ [] \\
\operatorname{LineCommentNext}(T,\ i)\ =\ j\ \mathsf{where}\ \Gamma \ \vdash \ \operatorname{ScanLineComment}(T,\ i)\ \Downarrow \ j
\end{array}
$$

**Block Comment Scan (Nested).**

$$
\mathsf{BlockState}\ =\ \{\ \operatorname{BlockScan}(T,\ i,\ d,\ i_{0})\ \mid \ 0\ \le \ i_{0}\ \le \ i\ \le \ \mid T\mid \ \land \ d\ \in \ \mathbb{N} \ \}\ \cup \ \{\ \operatorname{BlockDone}(j)\ \mid \ 0\ \le \ j\ \le \ \mid T\mid \ \}
$$

**(Block-Start)**
T[i] = '/'    T[i+1] = '*'

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\langle \operatorname{BlockScan}(T,\ i,\ d,\ i_{0})\rangle \ \to \ \langle \operatorname{BlockScan}(T,\ i+2,\ d+1,\ i_{0})\rangle 
\end{array}
$$

**(Block-End)**
T[i] = '*'    T[i+1] = '/'    d > 1

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\langle \operatorname{BlockScan}(T,\ i,\ d,\ i_{0})\rangle \ \to \ \langle \operatorname{BlockScan}(T,\ i+2,\ d-1,\ i_{0})\rangle 
\end{array}
$$

**(Block-Done)**

$$
\begin{array}{l}
T[i]\ =\ '*'\quad T[i+1]\ =\ '/'\quad d\ =\ 1 \\
\rule{18em}{0.4pt} \\
\langle \operatorname{BlockScan}(T,\ i,\ d,\ i_{0})\rangle \ \to \ \langle \operatorname{BlockDone}(i+2)\rangle 
\end{array}
$$

**(Block-Step)**

$$
\begin{array}{l}
T[i..i+2]\ \ne \ \texttt{"/*"}\quad T[i..i+2]\ \ne \ \texttt{"*/"} \\
\rule{18em}{0.4pt} \\
\langle \operatorname{BlockScan}(T,\ i,\ d,\ i_{0})\rangle \ \to \ \langle \operatorname{BlockScan}(T,\ i+1,\ d,\ i_{0})\rangle 
\end{array}
$$

**(Block-Comment-Unterminated)**

$$
\begin{array}{l}
\langle \operatorname{BlockScan}(T,\ i,\ d,\ i_{0})\rangle \ \to *\ \langle \operatorname{BlockScan}(T,\ \mid T\mid ,\ d,\ i_{0})\rangle \quad d\ >\ 0\quad c\ =\ \operatorname{Code}(\mathsf{Block}-\mathsf{Comment}-\mathsf{Unterminated}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Emit}(c,\ \operatorname{SpanOfText}(S,\ i_{0},\ i_{0}+2))
\end{array}
$$

### 4.2.6 Literal Lexing

T = S.scalars

**Syntax.**

```text
integer_literal  ::= (decimal_integer | hex_integer | octal_integer | binary_integer) int_suffix?
decimal_integer  ::= dec_digit ("_"* dec_digit)*
hex_integer      ::= "0x" hex_digit ("_"* hex_digit)*
octal_integer    ::= "0o" oct_digit ("_"* oct_digit)*
binary_integer   ::= "0b" bin_digit ("_"* bin_digit)*
int_suffix       ::= "i8" | "i16" | "i32" | "i64" | "i128" | "u8" | "u16" | "u32" | "u64" | "u128" | "isize" | "usize"

float_literal ::= decimal_integer "." decimal_integer? exponent? float_suffix?
exponent      ::= ("e" | "E") ("+" | "-")? decimal_integer
float_suffix  ::= "f" | "f16" | "f32" | "f64"

string_literal   ::= '"' (string_char | escape_sequence)* '"'
string_char      ::= string_char_unit
escape_sequence  ::= "\n" | "\r" | "\t" | "\\" | "\"" | "\'" | "\0" | "\x" hex_digit hex_digit | "\u{" hex_digit+ "}"

char_literal ::= "'" (char_content | escape_sequence) "'"
char_content ::= char_content_unit

The productions `string_literal` and `char_literal` define well-formed quoted literal spellings. During tokenization, any terminated quoted span with the corresponding delimiter MUST form a `StringLiteral` or `CharLiteral` token even when its interior is ill-formed. Bad escapes and invalid character-literal contents MUST emit their corresponding diagnostics and MUST NOT suppress token formation. Unterminated quoted spans are excluded from token formation and follow the recovery rules in section4.2.11.

bool_literal ::= "true" | "false"
null_literal ::= "null"
```

**Float Suffix and Defaulting.**
Float literals MAY omit a suffix when they contain a decimal point. The suffix `f` indicates a float literal with width inferred from context; explicit suffixes `f16`, `f32`, `f64` specify the width directly. If no expected type is present, an unsuffixed decimal float literal defaults to `f32`. If an expected or declared float type is present, that expected type governs checking of unsuffixed and `f`-suffixed literals. Using an explicit width suffix with a conflicting expected type is an error.

**Escape Validity.**

$$
\begin{array}{l}
\mathsf{SimpleEscape}\ =\ \{\texttt{\textbackslash{}\textbackslash{}},\ \texttt{\textbackslash{}"},\ \texttt{\textbackslash{}'},\ \texttt{\textbackslash{}n},\ \texttt{\textbackslash{}r},\ \texttt{\textbackslash{}t},\ \texttt{\textbackslash{}0}\} \\
\operatorname{EscapeOk}(\texttt{\textbackslash{}\textbackslash{}})\ \land \ \operatorname{EscapeOk}(\texttt{\textbackslash{}"})\ \land \ \operatorname{EscapeOk}(\texttt{\textbackslash{}'})\ \land \ \operatorname{EscapeOk}(\texttt{\textbackslash{}n})\ \land \ \operatorname{EscapeOk}(\texttt{\textbackslash{}r})\ \land \ \operatorname{EscapeOk}(\texttt{\textbackslash{}t})\ \land \ \operatorname{EscapeOk}(\texttt{\textbackslash{}0}) \\
\operatorname{EscapeOk}(\texttt{"\textbackslash{}\textbackslash{}x"}\ h_{1}\ h_{2})\ \Leftrightarrow \ \operatorname{HexDigit}(h_{1})\ \land \ \operatorname{HexDigit}(h_{2}) \\
\operatorname{EscapeOk}(\texttt{"\textbackslash{}\textbackslash{}u\{"}\ h_{1}\ \ldots \ h_{n}\ \texttt{"\}"})\ \Leftrightarrow \ 1\ \le \ n\ \le \ 6\ \land \ \operatorname{UnicodeScalar}(\operatorname{HexValue}(h_{1}\ \ldots \ h_{n}))
\end{array}
$$

$$
\begin{array}{l}
\operatorname{StringChar}(c)\ \Leftrightarrow \ \operatorname{UnicodeScalar}(c)\ \land \ c\ \ne \ \texttt{"\textbackslash{}""}\ \land \ c\ \ne \ "\setminus \setminus "\ \land \ c\ \ne \ U+000A \\
\operatorname{CharContent}(c)\ \Leftrightarrow \ \operatorname{UnicodeScalar}(c)\ \land \ c\ \ne \ \texttt{"'"}\ \land \ c\ \ne \ "\setminus \setminus "\ \land \ c\ \ne \ U+000A \\
\mathsf{string}_{\mathsf{char}\_\mathsf{unit}}\ =\ \{\ c\ \mid \ \operatorname{StringChar}(c)\ \} \\
\mathsf{char}_{\mathsf{content}\_\mathsf{unit}}\ =\ \{\ c\ \mid \ \operatorname{CharContent}(c)\ \}
\end{array}
$$

**Underscore Constraints.**

$$
\begin{array}{l}
\mathsf{BasePrefix}\ =\ \{\texttt{"0x"},\ \texttt{"0o"},\ \texttt{"0b"}\} \\
\mathsf{IntSuffixSet}\ =\ \{\texttt{"i8"},\ \texttt{"i16"},\ \texttt{"i32"},\ \texttt{"i64"},\ \texttt{"i128"},\ \texttt{"u8"},\ \texttt{"u16"},\ \texttt{"u32"},\ \texttt{"u64"},\ \texttt{"u128"},\ \texttt{"isize"},\ \texttt{"usize"}\} \\
\mathsf{FloatSuffixSet}\ =\ \{\texttt{"f"},\ \texttt{"f16"},\ \texttt{"f32"},\ \texttt{"f64"}\} \\
\mathsf{NumSuffix}\ =\ \mathsf{IntSuffixSet}\ \cup \ \mathsf{FloatSuffixSet} \\
\operatorname{At}(s,\ i)\ =\ s[i] \\
\operatorname{StartsWith}(s,\ p)\ \Leftrightarrow \ s[0..\mid p\mid )\ =\ p \\
\operatorname{EndsWith}(s,\ p)\ \Leftrightarrow \ s[\mid s\mid \ -\ \mid p\mid ..\mid s\mid )\ =\ p \\
\operatorname{Remove}(s,\ c)\ =\ [\ s[i]\ \mid \ 0\ \le \ i\ <\ \mid s\mid \ \land \ s[i]\ \ne \ c\ ] \\
\operatorname{Concat}([])\ =\ \texttt{"\textbackslash{}""} \\
\operatorname{Concat}([s])\ =\ s \\
\operatorname{Concat}(s\mathbin{::} \mathsf{ss})\ =\ s\ \mathbin{++} \ \operatorname{Concat}(\mathsf{ss})\quad (\mid \mathsf{ss}\mid \ >\ 0) \\
\operatorname{Hex2}(b)\ =\ \operatorname{HexDigit}(\lfloor b/16\rfloor )\ \mathbin{++} \ \operatorname{HexDigit}(b\ \mathsf{mod}\ 16) \\
\operatorname{HexDigitValue}(\texttt{'0'})\ =\ 0\quad \operatorname{HexDigitValue}(\texttt{'1'})\ =\ 1\quad \operatorname{HexDigitValue}(\texttt{'2'})\ =\ 2\quad \operatorname{HexDigitValue}(\texttt{'3'})\ =\ 3\quad \operatorname{HexDigitValue}(\texttt{'4'})\ =\ 4\quad \operatorname{HexDigitValue}(\texttt{'5'})\ =\ 5\quad \operatorname{HexDigitValue}(\texttt{'6'})\ =\ 6\quad \operatorname{HexDigitValue}(\texttt{'7'})\ =\ 7\quad \operatorname{HexDigitValue}(\texttt{'8'})\ =\ 8\quad \operatorname{HexDigitValue}(\texttt{'9'})\ =\ 9 \\
\operatorname{HexDigitValue}(\texttt{'a'})\ =\ 10\quad \operatorname{HexDigitValue}(\texttt{'b'})\ =\ 11\quad \operatorname{HexDigitValue}(\texttt{'c'})\ =\ 12\quad \operatorname{HexDigitValue}(\texttt{'d'})\ =\ 13\quad \operatorname{HexDigitValue}(\texttt{'e'})\ =\ 14\quad \operatorname{HexDigitValue}(\texttt{'f'})\ =\ 15 \\
\operatorname{HexDigitValue}(\texttt{'A'})\ =\ 10\quad \operatorname{HexDigitValue}(\texttt{'B'})\ =\ 11\quad \operatorname{HexDigitValue}(\texttt{'C'})\ =\ 12\quad \operatorname{HexDigitValue}(\texttt{'D'})\ =\ 13\quad \operatorname{HexDigitValue}(\texttt{'E'})\ =\ 14\quad \operatorname{HexDigitValue}(\texttt{'F'})\ =\ 15 \\
\operatorname{HexValue}(h_{1}\ldots h_{n})\ =\ \sum \_\{k=1\}^\{n\}\ \operatorname{HexDigitValue}(h_{k})\ \cdot \ 16^(n-k) \\
\operatorname{DecDigitValue}(\texttt{'0'})\ =\ 0\quad \operatorname{DecDigitValue}(\texttt{'1'})\ =\ 1\quad \operatorname{DecDigitValue}(\texttt{'2'})\ =\ 2\quad \operatorname{DecDigitValue}(\texttt{'3'})\ =\ 3\quad \operatorname{DecDigitValue}(\texttt{'4'})\ =\ 4\quad \operatorname{DecDigitValue}(\texttt{'5'})\ =\ 5\quad \operatorname{DecDigitValue}(\texttt{'6'})\ =\ 6\quad \operatorname{DecDigitValue}(\texttt{'7'})\ =\ 7\quad \operatorname{DecDigitValue}(\texttt{'8'})\ =\ 8\quad \operatorname{DecDigitValue}(\texttt{'9'})\ =\ 9 \\
\operatorname{OctDigitValue}(\texttt{'0'})\ =\ 0\quad \operatorname{OctDigitValue}(\texttt{'1'})\ =\ 1\quad \operatorname{OctDigitValue}(\texttt{'2'})\ =\ 2\quad \operatorname{OctDigitValue}(\texttt{'3'})\ =\ 3\quad \operatorname{OctDigitValue}(\texttt{'4'})\ =\ 4\quad \operatorname{OctDigitValue}(\texttt{'5'})\ =\ 5\quad \operatorname{OctDigitValue}(\texttt{'6'})\ =\ 6\quad \operatorname{OctDigitValue}(\texttt{'7'})\ =\ 7 \\
\operatorname{BinDigitValue}(\texttt{'0'})\ =\ 0\quad \operatorname{BinDigitValue}(\texttt{'1'})\ =\ 1 \\
\operatorname{DecValue}(d_{1}\ldots d_{n})\ =\ \sum \_\{k=1\}^\{n\}\ \operatorname{DecDigitValue}(d_{k})\ \cdot \ 10^(n-k) \\
\operatorname{OctValue}(d_{1}\ldots d_{n})\ =\ \sum \_\{k=1\}^\{n\}\ \operatorname{OctDigitValue}(d_{k})\ \cdot \ 8^(n-k) \\
\operatorname{BinValue}(d_{1}\ldots d_{n})\ =\ \sum \_\{k=1\}^\{n\}\ \operatorname{BinDigitValue}(d_{k})\ \cdot \ 2^(n-k) \\
\operatorname{StartsWithUnderscore}(s)\ \Leftrightarrow \ \operatorname{At}(s,\ 0)\ =\ \texttt{"\_"} \\
\operatorname{EndsWithUnderscore}(s)\ \Leftrightarrow \ \operatorname{At}(s,\ \mid s\mid -1)\ =\ \texttt{"\_"} \\
\operatorname{AfterBasePrefixUnderscore}(s)\ \Leftrightarrow \ \exists \ p\ \in \ \mathsf{BasePrefix}.\ \operatorname{StartsWith}(s,\ \operatorname{Concat}(p,\ \texttt{"\_"})) \\
\operatorname{AdjacentExponentUnderscore}(s)\ \Leftrightarrow \ \exists \ i.\ \operatorname{At}(s,\ i)\ =\ \texttt{"\_"}\ \land \ ((i\ >\ 0\ \land \ \operatorname{At}(s,\ i-1)\ \in \ \{\texttt{"e"},\ \texttt{"E"}\})\ \lor \ (i+1\ <\ \mid s\mid \ \land \ \operatorname{At}(s,\ i+1)\ \in \ \{\texttt{"e"},\ \texttt{"E"}\})) \\
\operatorname{BeforeSuffixUnderscore}(s)\ \Leftrightarrow \ \exists \ \mathsf{suf}\ \in \ \mathsf{NumSuffix}.\ \operatorname{EndsWith}(s,\ \operatorname{Concat}(\texttt{"\_"},\ \mathsf{suf})) \\
\operatorname{NumericUnderscoreOk}(s)\ \Leftrightarrow \ \lnot \ \operatorname{StartsWithUnderscore}(s)\ \land \ \lnot \ \operatorname{EndsWithUnderscore}(s)\ \land \ \lnot \ \operatorname{AfterBasePrefixUnderscore}(s)\ \land \ \lnot \ \operatorname{AdjacentExponentUnderscore}(s)\ \land \ \lnot \ \operatorname{BeforeSuffixUnderscore}(s)
\end{array}
$$

**Numeric Scan (Maximal Prefix).**

$$
\begin{array}{l}
\operatorname{DecRun}(T,\ i)\ =\ \operatorname{max}(\{i\}\ \cup \ \{\ j\ \mid \ i\ <\ j\ \le \ \mid T\mid \ \land \ \forall \ k\ \in \ [i,\ j).\ (\operatorname{DecDigit}(T[k])\ \lor \ T[k]\ =\ \texttt{"\_"})\ \}) \\
\operatorname{HexRun}(T,\ i)\ =\ \operatorname{max}(\{i\}\ \cup \ \{\ j\ \mid \ i\ <\ j\ \le \ \mid T\mid \ \land \ \forall \ k\ \in \ [i,\ j).\ (\operatorname{HexDigit}(T[k])\ \lor \ T[k]\ =\ \texttt{"\_"})\ \}) \\
\operatorname{OctRun}(T,\ i)\ =\ \operatorname{max}(\{i\}\ \cup \ \{\ j\ \mid \ i\ <\ j\ \le \ \mid T\mid \ \land \ \forall \ k\ \in \ [i,\ j).\ (\operatorname{OctDigit}(T[k])\ \lor \ T[k]\ =\ \texttt{"\_"})\ \}) \\
\operatorname{BinRun}(T,\ i)\ =\ \operatorname{max}(\{i\}\ \cup \ \{\ j\ \mid \ i\ <\ j\ \le \ \mid T\mid \ \land \ \forall \ k\ \in \ [i,\ j).\ (\operatorname{BinDigit}(T[k])\ \lor \ T[k]\ =\ \texttt{"\_"})\ \})
\end{array}
$$

$$
\operatorname{SuffixMatch}(T,\ i,\ U)\ =\ \operatorname{max}(\{i\}\ \cup \ \{\ j\ \mid \ i\ <\ j\ \le \ \mid T\mid \ \land \ \operatorname{Lexeme}(T,\ i,\ j)\ \in \ U\ \})
$$

$$
\begin{array}{l}
\operatorname{ExpSignEnd}(T,\ i)\ = \\
\ i+1\ \mathsf{if}\ i\ <\ \mid T\mid \ \land \ T[i]\ \in \ \{\texttt{"+"},\ \texttt{"-"}\} \\
\ i\quad \mathsf{otherwise}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{ExpEnd}(T,\ i)\ = \\
\ \operatorname{DecRun}(T,\ \operatorname{ExpSignEnd}(T,\ i+1))\ \mathsf{if}\ i\ <\ \mid T\mid \ \land \ T[i]\ \in \ \{\texttt{"e"},\ \texttt{"E"}\} \\
\ i\quad \mathsf{otherwise}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{DecCoreEnd}(T,\ i)\ = \\
\ \operatorname{ExpEnd}(T,\ q)\ \mathsf{if}\ p\ =\ \operatorname{DecRun}(T,\ i)\ \land \ p\ <\ \mid T\mid \ \land \ T[p]\ =\ \texttt{"."}\ \land \ (p+1\ \ge \ \mid T\mid \ \lor \ T[p+1]\ \ne \ \texttt{"."})\ \land \ q\ =\ \operatorname{DecRun}(T,\ p+1) \\
\ \operatorname{ExpEnd}(T,\ p)\ \mathsf{if}\ p\ =\ \operatorname{DecRun}(T,\ i)\ \land \ (p\ \ge \ \mid T\mid \ \lor \ T[p]\ \ne \ \texttt{"."}\ \lor \ (p+1\ <\ \mid T\mid \ \land \ T[p+1]\ =\ \texttt{"."}))
\end{array}
$$

$$
A\ \mathsf{decimal}\ \mathsf{run}\ \mathsf{immediately}\ \mathsf{followed}\ \mathsf{by}\ \texttt{..}\ \mathsf{or}\ \texttt{..=}\ \mathsf{MUST}\ \mathsf{NOT}\ \mathsf{form}\ a\ \mathsf{float}\ \mathsf{core}.\ \mathsf{In}\ \mathsf{that}\ \mathsf{case}\ \texttt{DecCoreEnd(T, i) = DecRun(T, i)},\ \mathsf{and}\ \mathsf{the}\ \mathsf{following}\ \texttt{.}\ \mathsf{remains}\ \mathsf{available}\ \mathsf{to}\ \mathsf{operator}\ \mathsf{tokenization}.
$$

$$
\begin{array}{l}
\operatorname{NumericCoreEnd}(T,\ i)\ = \\
\ \operatorname{HexRun}(T,\ i+2)\ \mathsf{if}\ T[i..i+2]\ =\ \texttt{"0x"} \\
\ \operatorname{OctRun}(T,\ i+2)\ \mathsf{if}\ T[i..i+2]\ =\ \texttt{"0o"} \\
\ \operatorname{BinRun}(T,\ i+2)\ \mathsf{if}\ T[i..i+2]\ =\ \texttt{"0b"} \\
\ \operatorname{DecCoreEnd}(T,\ i)\ \mathsf{otherwise}
\end{array}
$$

$$
\operatorname{NumericScanEnd}(T,\ i)\ =\ \operatorname{SuffixMatch}(T,\ \operatorname{NumericCoreEnd}(T,\ i),\ \mathsf{NumSuffix})
$$

$$
\begin{array}{l}
\operatorname{HasDot}(T,\ i,\ j)\ \Leftrightarrow \ \exists \ p.\ i\ \le \ p\ <\ j\ \land \ T[p]\ =\ \texttt{"."} \\
\operatorname{HasExp}(T,\ i,\ j)\ \Leftrightarrow \ \exists \ p.\ i\ \le \ p\ <\ j\ \land \ T[p]\ \in \ \{\texttt{"e"},\ \texttt{"E"}\} \\
\operatorname{HasFloatCore}(T,\ i,\ j)\ \Leftrightarrow \ \operatorname{HasDot}(T,\ i,\ j)
\end{array}
$$

$$
\begin{array}{l}
\operatorname{NumericKind}(T,\ i)\ = \\
\ \mathsf{FloatLiteral}\ \mathsf{if}\ \operatorname{HasFloatCore}(T,\ i,\ \operatorname{NumericCoreEnd}(T,\ i)) \\
\ \mathsf{IntLiteral}\quad \mathsf{otherwise}
\end{array}
$$

**(Lex-Int)**

$$
\begin{array}{l}
\operatorname{DecDigit}(T[i])\quad j\ =\ \operatorname{NumericScanEnd}(T,\ i)\quad \operatorname{NumericKind}(T,\ i)\ =\ \mathsf{IntLiteral} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{IntLiteral}(T,\ i)\ \Downarrow \ j
\end{array}
$$

**(Lex-Float)**

$$
\begin{array}{l}
\operatorname{DecDigit}(T[i])\quad j\ =\ \operatorname{NumericScanEnd}(T,\ i)\quad \operatorname{NumericKind}(T,\ i)\ =\ \mathsf{FloatLiteral} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{FloatLiteral}(T,\ i)\ \Downarrow \ j
\end{array}
$$

$$
\begin{array}{l}
\operatorname{NumericLexemeOk}(T,\ i,\ j)\ \Leftrightarrow \ (\operatorname{Lexeme}(T,\ i,\ j)\ \mathsf{matches}\ \mathsf{integer}_{\mathsf{literal}}\ \lor \ \operatorname{Lexeme}(T,\ i,\ j)\ \mathsf{matches}\ \mathsf{float}_{\mathsf{literal}})\ \land \ \operatorname{NumericUnderscoreOk}(\operatorname{Lexeme}(T,\ i,\ j)) \\
\operatorname{NumericLexemeBad}(T,\ i,\ j)\ \Leftrightarrow \ \lnot \ \operatorname{NumericLexemeOk}(T,\ i,\ j)
\end{array}
$$

**(Lex-Numeric-Err)**

$$
\begin{array}{l}
\operatorname{DecDigit}(T[i])\quad j\ =\ \operatorname{NumericScanEnd}(T,\ i)\quad \operatorname{NumericLexemeBad}(T,\ i,\ j)\quad c\ =\ \operatorname{Code}(\mathsf{Lex}-\mathsf{Numeric}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Emit}(c,\ \operatorname{SpanOfText}(S,\ i,\ j))
\end{array}
$$

**Leading Zeros.**

$$
\begin{array}{l}
\operatorname{Digits}(s)\ =\ \operatorname{Remove}(s,\ \texttt{"\_"}) \\
\operatorname{DecimalLeadingZero}(T,\ i,\ j)\ \Leftrightarrow \ \operatorname{Lexeme}(T,\ i,\ j)\ \mathsf{matches}\ \mathsf{decimal}_{\mathsf{integer}}\ \land \ \mid \operatorname{Digits}(\operatorname{Lexeme}(T,\ i,\ j))\mid \ >\ 1\ \land \ \operatorname{At}(\operatorname{Digits}(\operatorname{Lexeme}(T,\ i,\ j)),\ 0)\ =\ '0'
\end{array}
$$

DecimalLeadingZero(T, i, j)

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Emit}(W-\mathsf{SRC}-0301,\ \operatorname{SpanOfText}(S,\ i,\ j))
\end{array}
$$

**EscapeSequences.**

$$
\begin{array}{l}
\operatorname{EscapeValue}(\texttt{\textbackslash{}\textbackslash{}})\ =\ 0\mathsf{x5C} \\
\operatorname{EscapeValue}(\texttt{\textbackslash{}"})\ =\ 0\mathsf{x22} \\
\operatorname{EscapeValue}(\texttt{\textbackslash{}'})\ =\ 0\mathsf{x27} \\
\operatorname{EscapeValue}(\texttt{\textbackslash{}n})\ =\ 0\mathsf{x0A} \\
\operatorname{EscapeValue}(\texttt{\textbackslash{}r})\ =\ 0\mathsf{x0D} \\
\operatorname{EscapeValue}(\texttt{\textbackslash{}t})\ =\ 0\mathsf{x09} \\
\operatorname{EscapeValue}(\texttt{\textbackslash{}0})\ =\ 0\mathsf{x00} \\
\operatorname{EscapeValue}(\texttt{"\textbackslash{}\textbackslash{}x"}\ h_{1}\ h_{2})\ =\ \operatorname{HexValue}(h_{1}\ h_{2}) \\
\operatorname{EscapeValue}(\texttt{"\textbackslash{}\textbackslash{}u\{"}\ h_{1}\ \ldots \ h_{n}\ \texttt{"\}"})\ =\ \operatorname{EncodeUTF8}(\operatorname{HexValue}(h_{1}\ \ldots \ h_{n}))
\end{array}
$$

**(Lex-String)**

$$
\begin{array}{l}
T[i]\ =\ \texttt{"\textbackslash{}""}\quad \operatorname{StringTerminator}(T,\ i)\ =\ q\quad q\ <\ \mid T\mid \quad T[q]\ =\ \texttt{"\textbackslash{}""} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{StringLiteral}(T,\ i)\ \Downarrow \ q\ +\ 1
\end{array}
$$

$$
\begin{array}{l}
\operatorname{BackslashCount}(T,\ p)\ =\ \mathsf{max}\{\ k\ \mid \ 0\ \le \ k\ \le \ p\ \land \ \forall \ r\ \in \ [p-k,\ p).\ T[r]\ =\ "\setminus \setminus "\ \} \\
\operatorname{UnescapedQuote}(T,\ p)\ \Leftrightarrow \ T[p]\ =\ \texttt{"\textbackslash{}""}\ \land \ \operatorname{BackslashCount}(T,\ p)\ \mathsf{mod}\ 2\ =\ 0 \\
\operatorname{StringTerminator}(T,\ i)\ =\ \mathsf{min}\{\ q\ \mid \ q\ >\ i\ \land \ (\operatorname{UnescapedQuote}(T,\ q)\ \lor \ T[q]\ =\ \mathsf{LF}\ \lor \ q\ =\ \mid T\mid )\ \} \\
\operatorname{LineFeedOrEOFBeforeClose}(T,\ i)\ \Leftrightarrow \ \operatorname{StringTerminator}(T,\ i)\ =\ \mid T\mid \ \lor \ T[\operatorname{StringTerminator}(T,\ i)]\ =\ \mathsf{LF} \\
\operatorname{EscapeMatch}(T,\ p,\ q)\ \Leftrightarrow \ \operatorname{Lexeme}(T,\ p,\ q)\ \mathsf{matches}\ \mathsf{escape}_{\mathsf{sequence}}\ \land \ \operatorname{EscapeOk}(\operatorname{Lexeme}(T,\ p,\ q)) \\
\operatorname{BadEscapeAt}(T,\ p)\ \Leftrightarrow \ T[p]\ =\ "\setminus \setminus "\ \land \ \lnot \ \exists \ q.\ \operatorname{EscapeMatch}(T,\ p,\ q) \\
\operatorname{FirstBadStringEscape}(T,\ i)\ =\ \mathsf{min}\{\ p\ \mid \ i\ <\ p\ <\ \operatorname{StringTerminator}(T,\ i)\ \land \ \operatorname{BadEscapeAt}(T,\ p)\ \}
\end{array}
$$

**(Lex-String-Unterminated)**

$$
\begin{array}{l}
\operatorname{LineFeedOrEOFBeforeClose}(T,\ i)\quad c\ =\ \operatorname{Code}(\mathsf{Lex}-\mathsf{String}-\mathsf{Unterminated}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Emit}(c,\ \operatorname{SpanOfText}(S,\ i,\ i+1))
\end{array}
$$

**(Lex-String-BadEscape)**

$$
\begin{array}{l}
\operatorname{FirstBadStringEscape}(T,\ i)\ =\ p\quad c\ =\ \operatorname{Code}(\mathsf{Lex}-\mathsf{String}-\mathsf{BadEscape}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Emit}(c,\ \operatorname{SpanOfText}(S,\ p,\ p+1))
\end{array}
$$

**(Lex-Char)**

$$
\begin{array}{l}
T[i]\ =\ \texttt{"'"}\quad \operatorname{CharTerminator}(T,\ i)\ =\ q\quad q\ <\ \mid T\mid \quad T[q]\ =\ \texttt{"'"} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{CharLiteral}(T,\ i)\ \Downarrow \ q\ +\ 1
\end{array}
$$

**Character Literal Encoding.**

$$
\mathsf{CharValueRange}\ =\ \{\ x\ \mid \ 0\ \le \ x\ \le \ 0\mathsf{x10FFFF}\ \land \ x\ \notin \ [0\mathsf{xD800},\ 0\mathsf{xDFFF}]\ \}
$$
CharRepr = `u32`

$$
\begin{array}{l}
\operatorname{SizeOf}(\texttt{char})\ =\ 4 \\
\operatorname{AlignOf}(\texttt{char})\ =\ 4
\end{array}
$$

$$
\begin{array}{l}
\operatorname{UnescapedApostrophe}(T,\ p)\ \Leftrightarrow \ T[p]\ =\ \texttt{"'"}\ \land \ \operatorname{BackslashCount}(T,\ p)\ \mathsf{mod}\ 2\ =\ 0 \\
\operatorname{CharTerminator}(T,\ i)\ =\ \mathsf{min}\{\ q\ \mid \ q\ >\ i\ \land \ (\operatorname{UnescapedApostrophe}(T,\ q)\ \lor \ T[q]\ =\ \mathsf{LF}\ \lor \ q\ =\ \mid T\mid )\ \} \\
\operatorname{FirstBadCharEscape}(T,\ i)\ =\ \mathsf{min}\{\ p\ \mid \ i\ <\ p\ <\ \operatorname{CharTerminator}(T,\ i)\ \land \ \operatorname{BadEscapeAt}(T,\ p)\ \} \\
\operatorname{CharLiteralInvalid}(T,\ i)\ \Leftrightarrow \ \operatorname{CharScalarCount}(T,\ i)\ \ne \ 1 \\
\operatorname{CharScalarCountFrom}(T,\ p,\ q)\ =\ 0\ \Leftrightarrow \ p\ \ge \ q \\
\operatorname{CharScalarCountFrom}(T,\ p,\ q)\ =\ 1\ +\ \operatorname{CharScalarCountFrom}(T,\ p+1,\ q)\ \Leftrightarrow \ p\ <\ q\ \land \ T[p]\ \ne \ "\setminus \setminus " \\
\operatorname{CharScalarCountFrom}(T,\ p,\ q)\ =\ 1\ +\ \operatorname{CharScalarCountFrom}(T,\ r,\ q)\ \Leftrightarrow \ p\ <\ q\ \land \ T[p]\ =\ "\setminus \setminus "\ \land \ \operatorname{EscapeMatch}(T,\ p,\ r) \\
\operatorname{CharScalarCountFrom}(T,\ p,\ q)\ =\ 1\ +\ \operatorname{CharScalarCountFrom}(T,\ p+1,\ q)\ \Leftrightarrow \ p\ <\ q\ \land \ T[p]\ =\ "\setminus \setminus "\ \land \ \lnot \ \exists \ r.\ \operatorname{EscapeMatch}(T,\ p,\ r) \\
\operatorname{CharScalarCount}(T,\ i)\ =\ \operatorname{CharScalarCountFrom}(T,\ i+1,\ \operatorname{CharTerminator}(T,\ i))
\end{array}
$$

**(Lex-Char-Unterminated)**

$$
\begin{array}{l}
\operatorname{LineFeedOrEOFBeforeClose}(T,\ i)\quad c\ =\ \operatorname{Code}(\mathsf{Lex}-\mathsf{Char}-\mathsf{Unterminated}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Emit}(c,\ \operatorname{SpanOfText}(S,\ i,\ i+1))
\end{array}
$$

**(Lex-Char-BadEscape)**

$$
\begin{array}{l}
\operatorname{FirstBadCharEscape}(T,\ i)\ =\ p\quad c\ =\ \operatorname{Code}(\mathsf{Lex}-\mathsf{Char}-\mathsf{BadEscape}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Emit}(c,\ \operatorname{SpanOfText}(S,\ p,\ p+1))
\end{array}
$$

**(Lex-Char-Invalid)**

$$
\begin{array}{l}
\operatorname{CharLiteralInvalid}(T,\ i)\quad c\ =\ \operatorname{Code}(\mathsf{Lex}-\mathsf{Char}-\mathsf{Invalid}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Emit}(c,\ \operatorname{SpanOfText}(S,\ i,\ i+1))
\end{array}
$$

**Literal Tokenization Helpers.**

$$
\begin{array}{l}
\operatorname{StringTok}(T,\ i)\ =\ \{\ (\mathsf{StringLiteral},\ j)\ \mid \ \operatorname{StringLiteral}(T,\ i)\ \Downarrow \ j\ \} \\
\operatorname{CharTok}(T,\ i)\ =\ \{\ (\mathsf{CharLiteral},\ j)\ \mid \ \operatorname{CharLiteral}(T,\ i)\ \Downarrow \ j\ \} \\
\operatorname{IntTok}(T,\ i)\ =\ \{\ (\mathsf{IntLiteral},\ j)\ \mid \ \operatorname{IntLiteral}(T,\ i)\ \Downarrow \ j\ \} \\
\operatorname{FloatTok}(T,\ i)\ =\ \{\ (\mathsf{FloatLiteral},\ j)\ \mid \ \operatorname{FloatLiteral}(T,\ i)\ \Downarrow \ j\ \}
\end{array}
$$


### 4.2.7 Identifier and Keyword Lexing

T = S.scalars

**Identifier Scan.**

$$
\operatorname{IdentScanEnd}(T,\ i)\ =\ \mathsf{min}\{\ j\ \mid \ j\ >\ i\ \land \ (\lnot \ \operatorname{IdentContinue}(T[j])\ \lor \ j\ =\ \mid T\mid )\ \land \ \forall \ k\ \in \ (i,\ j).\ \operatorname{IdentContinue}(T[k])\ \}
$$

**(Lex-Identifier)**

$$
\begin{array}{l}
\operatorname{IdentStart}(T[i])\quad j\ =\ \operatorname{IdentScanEnd}(T,\ i)\quad s\ =\ \operatorname{Lexeme}(T,\ i,\ j) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Ident}(T,\ i)\ \Downarrow \ (s,\ j)
\end{array}
$$

**(Lex-Ident-InvalidUnicode)**

$$
\begin{array}{l}
k\ =\ \mathsf{min}\{\ p\ \mid \ i\ \le \ p\ <\ j\ \land \ \operatorname{NonCharacter}(T[p])\ \}\quad c\ =\ \operatorname{Code}(\mathsf{Lex}-\mathsf{Ident}-\mathsf{InvalidUnicode}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Emit}(c,\ \operatorname{SpanOfText}(S,\ k,\ k+1))
\end{array}
$$

**(Lex-Ident-Token)**

$$
\begin{array}{l}
\Gamma \ \vdash \ \operatorname{Ident}(T,\ i)\ \Downarrow \ (s,\ j)\quad \Gamma \ \vdash \ \operatorname{ClassifyIdent}(s)\ \Downarrow \ k \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{IdentToken}(T,\ i)\ \Downarrow \ (k,\ j)
\end{array}
$$

**Keyword Classification.**

$$
\begin{array}{l}
\operatorname{ClassifyIdent}(s)\ = \\
\ \mathsf{BoolLiteral}\ \mathsf{if}\ s\ \in \ \{\texttt{"true"},\ \texttt{"false"}\} \\
\ \mathsf{NullLiteral}\ \mathsf{if}\ s\ =\ \texttt{"null"} \\
\ \operatorname{Keyword}(s)\ \mathsf{if}\ \operatorname{Keyword}(s) \\
\ \mathsf{Identifier}\ \mathsf{otherwise}
\end{array}
$$

### 4.2.8 Operator and Punctuator Lexing

OpSet = OperatorSet
PuncSet = PunctuatorSet

$$
\begin{array}{l}
\operatorname{OpMatch}(T,\ i)\ =\ \{\ (o,\ j)\ \mid \ o\ \in \ \mathsf{OpSet}\ \land \ \operatorname{Lexeme}(T,\ i,\ j)\ =\ o\ \} \\
\operatorname{PuncMatch}(T,\ i)\ =\ \{\ (p,\ j)\ \mid \ p\ \in \ \mathsf{PuncSet}\ \land \ \operatorname{Lexeme}(T,\ i,\ j)\ =\ p\ \}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{OpTok}(T,\ i)\ =\ \{\ (\operatorname{Operator}(o),\ j)\ \mid \ (o,\ j)\ \in \ \operatorname{OpMatch}(T,\ i)\ \} \\
\operatorname{PuncTok}(T,\ i)\ =\ \{\ (\operatorname{Punctuator}(p),\ j)\ \mid \ (p,\ j)\ \in \ \operatorname{PuncMatch}(T,\ i)\ \}
\end{array}
$$

### 4.2.9 Maximal-Munch Rule

T = S.scalars

$$
\begin{array}{l}
\operatorname{IsQuote}(c)\ \Leftrightarrow \ c\ \in \ \{\texttt{"\textbackslash{}""},\ \texttt{"'"}\} \\
\operatorname{Candidates}(T,\ i)\ = \\
\ \operatorname{StringTok}(T,\ i)\ \cup \ \operatorname{CharTok}(T,\ i)\ \mathsf{if}\ \operatorname{IsQuote}(T[i]) \\
\ \operatorname{FloatTok}(T,\ i)\ \cup \ \operatorname{IntTok}(T,\ i)\quad \mathsf{if}\ \operatorname{DecDigit}(T[i]) \\
\ \operatorname{IdentToken}(T,\ i)\quad \mathsf{if}\ \operatorname{IdentStart}(T[i]) \\
\ \operatorname{OpTok}(T,\ i)\ \cup \ \operatorname{PuncTok}(T,\ i)\quad \mathsf{if}\ \operatorname{OpTok}(T,\ i)\ \ne \ \emptyset \ \lor \ \operatorname{PuncTok}(T,\ i)\ \ne \ \emptyset  \\
\ \emptyset \quad \mathsf{otherwise}
\end{array}
$$

$$
\operatorname{Longest}(C)\ =\ \{\ (k,\ j)\ \in \ C\ \mid \ \forall \ (k',\ j')\ \in \ C,\ j\ \ge \ j'\ \}
$$

$$
\begin{array}{l}
\operatorname{KindPriority}(\mathsf{IntLiteral})\ =\ 3 \\
\operatorname{KindPriority}(\mathsf{FloatLiteral})\ =\ 3 \\
\operatorname{KindPriority}(\mathsf{StringLiteral})\ =\ 3 \\
\operatorname{KindPriority}(\mathsf{CharLiteral})\ =\ 3 \\
\operatorname{KindPriority}(\mathsf{BoolLiteral})\ =\ 3 \\
\operatorname{KindPriority}(\mathsf{NullLiteral})\ =\ 3 \\
\operatorname{KindPriority}(\mathsf{Identifier})\ =\ 2 \\
\operatorname{KindPriority}(\operatorname{Keyword}(\_))\ =\ 2 \\
\operatorname{KindPriority}(\operatorname{Operator}(\_))\ =\ 1 \\
\operatorname{KindPriority}(\operatorname{Punctuator}(\_))\ =\ 0
\end{array}
$$

$$
\operatorname{PickLongest}(C)\ =\ \mathsf{argmax}\_\{(k,\ j)\ \in \ C\}\ \langle j,\ \operatorname{KindPriority}(k)\rangle 
$$

**(Max-Munch)**

$$
\begin{array}{l}
\operatorname{PickLongest}(C)\ =\ (k,\ j) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{NextToken}(T,\ i)\ \Downarrow \ (k,\ j)
\end{array}
$$

**(Max-Munch-Err)**

$$
\begin{array}{l}
\operatorname{Candidates}(T,\ i)\ =\ \emptyset \quad c\ =\ \operatorname{Code}(\mathsf{Max}-\mathsf{Munch}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{NextToken}(T,\ i)\ \Uparrow \ c
\end{array}
$$

GenericCloseException = false

### 4.2.10 Lexical Security

T = S.scalars

$$
O\ =\ \operatorname{Utf8Offsets}(T)
$$

**Literal and Comment Ranges.**

$$
\begin{array}{l}
\operatorname{LineCommentRange}(T,\ i,\ j)\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{ScanLineComment}(T,\ i)\ \Downarrow \ j \\
\operatorname{BlockCommentRange}(T,\ i,\ j)\ \Leftrightarrow \ T[i..i+2]\ =\ \texttt{"/*"}\ \land \ \langle \operatorname{BlockScan}(T,\ i,\ 0,\ i)\rangle \ \to *\ \langle \operatorname{BlockDone}(j)\rangle  \\
\operatorname{StringRange}(T,\ i,\ j)\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{StringLiteral}(T,\ i)\ \Downarrow \ j \\
\operatorname{CharRange}(T,\ i,\ j)\ \Leftrightarrow \ \Gamma \ \vdash \ \operatorname{CharLiteral}(T,\ i)\ \Downarrow \ j \\
\operatorname{InsideLiteralOrComment}(i)\ \Leftrightarrow \ \exists \ a,\ b.\ a\ \le \ i\ <\ b\ \land \ (\operatorname{LineCommentRange}(T,\ a,\ b)\ \lor \ \operatorname{BlockCommentRange}(T,\ a,\ b)\ \lor \ \operatorname{StringRange}(T,\ a,\ b)\ \lor \ \operatorname{CharRange}(T,\ a,\ b))
\end{array}
$$

**Sensitive Positions in a Span.**

$$
\operatorname{SensitiveInSpan}(T,\ i,\ j)\ =\ [\ p\ \mid \ i\ \le \ p\ <\ j\ \land \ \operatorname{Sensitive}(T[p])\ ]
$$

**Unsafe Spans (Token-Only).**

$$
\begin{array}{l}
\operatorname{IsLBrace}(t)\ \Leftrightarrow \ t.\mathsf{kind}\ =\ \operatorname{Punctuator}(\texttt{"\{"}) \\
\operatorname{IsRBrace}(t)\ \Leftrightarrow \ t.\mathsf{kind}\ =\ \operatorname{Punctuator}(\texttt{"\}"})
\end{array}
$$

$$
\begin{array}{l}
\operatorname{NextNonNewline}(K,\ i)\ =\ \bot \ \Leftrightarrow \ \{\ j\ \mid \ j\ \ge \ i\ \land \ K[j].\mathsf{kind}\ \ne \ \mathsf{Newline}\ \}\ =\ \emptyset  \\
\operatorname{NextNonNewline}(K,\ i)\ =\ j\ \Leftrightarrow \ j\ =\ \mathsf{min}\{\ j\ \mid \ j\ \ge \ i\ \land \ K[j].\mathsf{kind}\ \ne \ \mathsf{Newline}\ \}
\end{array}
$$

$$
\operatorname{MatchBrace}(K,\ j)\ =\ \mathsf{min}\{\ k\ \mid \ k\ >\ j\ \land \ \operatorname{Balance}(j,\ k)\ =\ 0\ \land \ \forall \ m\ \in \ (j,\ k),\ \operatorname{Balance}(j,\ m)\ >\ 0\ \}
$$

$$
\begin{array}{l}
\operatorname{Balance}(K,\ j,\ m)\ =\ \mid \{\ x\ \mid \ j\ \le \ x\ \le \ m\ \land \ \operatorname{IsLBrace}(K[x])\ \}\mid \ -\ \mid \{\ x\ \mid \ j\ \le \ x\ \le \ m\ \land \ \operatorname{IsRBrace}(K[x])\ \}\mid  \\
\operatorname{MatchBrace}(K,\ j)\ =\ \bot \ \Leftrightarrow \ \{\ k\ \mid \ k\ >\ j\ \land \ \operatorname{Balance}(K,\ j,\ k)\ =\ 0\ \land \ \forall \ m\ \in \ (j,\ k).\ \operatorname{Balance}(K,\ j,\ m)\ >\ 0\ \}\ =\ \emptyset 
\end{array}
$$

$$
\operatorname{SpanFrom}(t_{a},\ t_{b})\ =\ \langle t_{a}.\mathsf{span}.\mathsf{file},\ t_{a}.\mathsf{span}.\mathsf{start}_{\mathsf{offset}},\ t_{b}.\mathsf{span}.\mathsf{end}_{\mathsf{offset}},\ t_{a}.\mathsf{span}.\mathsf{start}_{\mathsf{line}},\ t_{a}.\mathsf{span}.\mathsf{start}_{\mathsf{col}},\ t_{b}.\mathsf{span}.\mathsf{end}_{\mathsf{line}},\ t_{b}.\mathsf{span}.\mathsf{end}_{\mathsf{col}}\rangle 
$$

$$
\operatorname{UnsafeSpans}(K)\ =\ \{\ \operatorname{SpanFrom}(K[j],\ K[k])\ \mid \ K[i].\mathsf{kind}\ =\ \operatorname{Keyword}(\texttt{"unsafe"}),\ j\ =\ \operatorname{NextNonNewline}(K,\ i+1),\ K[j].\mathsf{kind}\ =\ \operatorname{Punctuator}(\texttt{"\{"}),\ k\ =\ \operatorname{MatchBrace}(K,\ j),\ k\ \ne \ \bot \ \}
$$

$$
\operatorname{UnsafeAtByte}(b)\ \Leftrightarrow \ \exists \ \mathsf{sp}\ \in \ \operatorname{UnsafeSpans}(K).\ b\ \in \ \operatorname{SpanRange}(\mathsf{sp})
$$

UnsafeSpanMode = TokenOnly

**Lexical Security Check.**

$$
\mathsf{Sens}\ =\ [\ p\ \mid \ \operatorname{Sensitive}(T[p])\ \land \ \lnot \ \operatorname{InsideLiteralOrComment}(p)\ ]
$$

**(LexSecure-Err)**

$$
\begin{array}{l}
i\ =\ \mathsf{min}\{\ p\ \mid \ p\ \in \ \mathsf{Sens}\ \land \ \lnot \ \operatorname{UnsafeAtByte}(\operatorname{ByteOf}(T,\ p))\ \}\quad c\ =\ \operatorname{Code}(\mathsf{LexSecure}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LexSecure}(S,\ K,\ \mathsf{Sens})\ \Uparrow \ c
\end{array}
$$

**(LexSecure-Warn)**

$$
\begin{array}{l}
\forall \ p\ \in \ \mathsf{Sens},\ \operatorname{UnsafeAtByte}(\operatorname{ByteOf}(T,\ p))\quad \Gamma \ \vdash \ \operatorname{EmitList}(\operatorname{LexSecureWarns}(S,\ \mathsf{Sens})) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{LexSecure}(S,\ K,\ \mathsf{Sens})\ \Downarrow \ \mathsf{ok}
\end{array}
$$

**Confusable Identifier Checks.**

$$
\begin{array}{l}
\operatorname{ConfusablePair}(x,\ y)\ \Leftrightarrow \ \operatorname{Skeleton}(\operatorname{NFC}(x))\ =\ \operatorname{Skeleton}(\operatorname{NFC}(y))\ \land \ \operatorname{NFC}(x)\ \ne \ \operatorname{NFC}(y) \\
\operatorname{MixedScript}(x)\ \Leftrightarrow \ \operatorname{IdentifierScripts}(\operatorname{NFC}(x))\ \mathsf{contains}\ \mathsf{more}\ \mathsf{than}\ \mathsf{one}\ \mathsf{non}-\mathsf{Common},\ \mathsf{non}-\mathsf{Inherited}\ \mathsf{script}
\end{array}
$$

**(Confusable-Err)**

$$
\begin{array}{l}
\exists \ x,\ y\ \in \ \operatorname{IdentifierLexemes}(S).\ \operatorname{ConfusablePair}(x,\ y)\quad c\ =\ \operatorname{Code}(\mathsf{Confusable}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ConfusableCheck}(S)\ \Uparrow \ c
\end{array}
$$

**(MixedScript-Err)**

$$
\begin{array}{l}
\exists \ x\ \in \ \operatorname{IdentifierLexemes}(S).\ \operatorname{MixedScript}(x)\quad c\ =\ \operatorname{Code}(\mathsf{MixedScript}-\mathsf{Err}) \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{ConfusableCheck}(S)\ \Uparrow \ c
\end{array}
$$

$$
\begin{array}{l}
\operatorname{LexSecureWarns}(S,\ \mathsf{Sens})\ =\ [\ \langle W-\mathsf{SRC}-0308,\ \operatorname{SpanOfText}(S,\ p,\ p+1)\rangle \ \mid \ p\ \in \ \mathsf{Sens}\ ] \\
\operatorname{LexSecureErrSpan}(S,\ i)\ =\ \operatorname{SpanOfText}(S,\ i,\ i+1)
\end{array}
$$

### 4.2.11 Tokenization

$$
\mathsf{LexState}\ =\ \{\operatorname{LexStart}(S),\ \operatorname{LexScan}(S,\ i,\ K,\ D,\ \mathsf{Sens}),\ \operatorname{LexDone}(K,\ D,\ \mathsf{Sens}),\ \operatorname{LexError}(\mathsf{code})\}
$$
T = S.scalars
|T| = len(T)

**(Lex-Start)**

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\langle \operatorname{LexStart}(S)\rangle \ \to \ \langle \operatorname{LexScan}(S,\ 0,\ [],\ [],\ [])\rangle 
\end{array}
$$

**(Lex-End)**

$$
\begin{array}{l}
i\ \ge \ \mid T\mid  \\
\rule{18em}{0.4pt} \\
\langle \operatorname{LexScan}(S,\ i,\ K,\ D,\ \mathsf{Sens})\rangle \ \to \ \langle \operatorname{LexDone}(K,\ D,\ \mathsf{Sens})\rangle 
\end{array}
$$

**(Lex-Whitespace)**

$$
\begin{array}{l}
\operatorname{Whitespace}(T[i]) \\
\rule{18em}{0.4pt} \\
\langle \operatorname{LexScan}(S,\ i,\ K,\ D,\ \mathsf{Sens})\rangle \ \to \ \langle \operatorname{LexScan}(S,\ i+1,\ K,\ D,\ \mathsf{Sens})\rangle 
\end{array}
$$

**(Lex-Newline)**
T[i] = LF

$$
\begin{array}{l}
\rule{18em}{0.4pt} \\
\langle \operatorname{LexScan}(S,\ i,\ K,\ D,\ \mathsf{Sens})\rangle \ \to \ \langle \operatorname{LexScan}(S,\ i+1,\ K\ \mathbin{++} \ [\langle \mathsf{newline},\ \operatorname{Lexeme}(T,\ i,\ i+1),\ \operatorname{SpanOfText}(S,\ i,\ i+1)\rangle ],\ D,\ \mathsf{Sens})\rangle 
\end{array}
$$

**(Lex-Line-Comment)**

$$
\begin{array}{l}
T[i..i+2]\ =\ \texttt{"//"}\quad T[i..i+3]\ \notin \ \{\texttt{"///"},\ \texttt{"//!"}\}\quad \Gamma \ \vdash \ \operatorname{ScanLineComment}(T,\ i)\ \Downarrow \ j \\
\rule{18em}{0.4pt} \\
\langle \operatorname{LexScan}(S,\ i,\ K,\ D,\ \mathsf{Sens})\rangle \ \to \ \langle \operatorname{LexScan}(S,\ j,\ K,\ D,\ \mathsf{Sens})\rangle 
\end{array}
$$

**(Lex-Doc-Comment)**

$$
\begin{array}{l}
T[i..i+3]\ \in \ \{\texttt{"///"},\ \texttt{"//!"}\}\quad \Gamma \ \vdash \ \operatorname{ScanLineComment}(T,\ i)\ \Downarrow \ j\quad \Gamma \ \vdash \ \operatorname{DocComment}(T,\ i)\ \Downarrow \ d \\
\rule{18em}{0.4pt} \\
\langle \operatorname{LexScan}(S,\ i,\ K,\ D,\ \mathsf{Sens})\rangle \ \to \ \langle \operatorname{LexScan}(S,\ j,\ K,\ D\ \mathbin{++} \ [d],\ \mathsf{Sens})\rangle 
\end{array}
$$

**(Lex-Block-Comment)**

$$
\begin{array}{l}
T[i..i+2]\ =\ \texttt{"/*"}\quad \langle \operatorname{BlockScan}(T,\ i,\ 0,\ i)\rangle \ \to *\ \langle \operatorname{BlockDone}(j)\rangle  \\
\rule{18em}{0.4pt} \\
\langle \operatorname{LexScan}(S,\ i,\ K,\ D,\ \mathsf{Sens})\rangle \ \to \ \langle \operatorname{LexScan}(S,\ j,\ K,\ D,\ \mathsf{Sens})\rangle 
\end{array}
$$

**(Lex-String-Unterminated-Recover)**

$$
\begin{array}{l}
T[i]\ =\ \texttt{"\textbackslash{}""}\quad \operatorname{LineFeedOrEOFBeforeClose}(T,\ i)\quad c\ =\ \operatorname{Code}(\mathsf{Lex}-\mathsf{String}-\mathsf{Unterminated})\quad \Gamma \ \vdash \ \operatorname{Emit}(c,\ \operatorname{SpanOfText}(S,\ i,\ i+1))\quad j\ =\ \operatorname{StringTerminator}(T,\ i) \\
\rule{18em}{0.4pt} \\
\langle \operatorname{LexScan}(S,\ i,\ K,\ D,\ \mathsf{Sens})\rangle \ \to \ \langle \operatorname{LexScan}(S,\ j,\ K,\ D,\ \mathsf{Sens})\rangle 
\end{array}
$$

**(Lex-Char-Unterminated-Recover)**

$$
\begin{array}{l}
T[i]\ =\ \texttt{"'"}\quad \operatorname{LineFeedOrEOFBeforeClose}(T,\ i)\quad c\ =\ \operatorname{Code}(\mathsf{Lex}-\mathsf{Char}-\mathsf{Unterminated})\quad \Gamma \ \vdash \ \operatorname{Emit}(c,\ \operatorname{SpanOfText}(S,\ i,\ i+1))\quad j\ =\ \operatorname{CharTerminator}(T,\ i) \\
\rule{18em}{0.4pt} \\
\langle \operatorname{LexScan}(S,\ i,\ K,\ D,\ \mathsf{Sens})\rangle \ \to \ \langle \operatorname{LexScan}(S,\ j,\ K,\ D,\ \mathsf{Sens})\rangle 
\end{array}
$$

**(Lex-Sensitive)**

$$
\begin{array}{l}
\operatorname{Sensitive}(T[i]) \\
\rule{18em}{0.4pt} \\
\langle \operatorname{LexScan}(S,\ i,\ K,\ D,\ \mathsf{Sens})\rangle \ \to \ \langle \operatorname{LexScan}(S,\ i+1,\ K,\ D,\ \mathsf{Sens}\ \mathbin{++} \ [i])\rangle 
\end{array}
$$

$$
\begin{array}{l}
\operatorname{SensitiveTok}(T,\ i,\ j,\ k)\ = \\
\ []\quad \mathsf{if}\ k\ \in \ \{\mathsf{StringLiteral},\ \mathsf{CharLiteral}\} \\
\ \operatorname{SensitiveInSpan}(T,\ i,\ j)\ \mathsf{otherwise}
\end{array}
$$

**Tuple Projection Lexical Disambiguation.**
The postfix form `postfix_expr "." int_literal` takes precedence over a decimal-float token that would begin immediately after an already-emitted `.` token. If the most recently emitted token in `K` has lexeme `"."`, and the source at `i` admits both an `IntLiteral` token ending at `j_i` and a `FloatLiteral` token ending at `j_f` with `j_i < j_f`, the lexer MUST emit the `IntLiteral` token over `[i, j_i)` and continue from `j_i`. The following `.` remains available for subsequent tokenization.

**(Lex-Token)**

$$
\begin{array}{l}
\lnot \ \operatorname{Whitespace}(T[i])\quad T[i]\ \ne \ \mathsf{LF}\quad T[i..i+2]\ \notin \ \{\texttt{"//"},\ \texttt{"/*"}\}\quad \lnot \ \operatorname{Sensitive}(T[i])\quad \Gamma \ \vdash \ \operatorname{NextToken}(T,\ i)\ \Downarrow \ (k,\ j) \\
\rule{18em}{0.4pt} \\
\langle \operatorname{LexScan}(S,\ i,\ K,\ D,\ \mathsf{Sens})\rangle \ \to \ \langle \operatorname{LexScan}(S,\ j,\ K\ \mathbin{++} \ [\langle k,\ \operatorname{Lexeme}(T,\ i,\ j),\ \operatorname{SpanOfText}(S,\ i,\ j)\rangle ],\ D,\ \mathsf{Sens}\ \mathbin{++} \ \operatorname{SensitiveTok}(T,\ i,\ j,\ k))\rangle 
\end{array}
$$

**(Lex-Token-Err)**

$$
\begin{array}{l}
\lnot \ \operatorname{Whitespace}(T[i])\quad T[i]\ \ne \ \mathsf{LF}\quad T[i..i+2]\ \notin \ \{\texttt{"//"},\ \texttt{"/*"}\}\quad \lnot \ (T[i]\ =\ \texttt{"\textbackslash{}""}\ \land \ \operatorname{LineFeedOrEOFBeforeClose}(T,\ i))\quad \lnot \ (T[i]\ =\ \texttt{"'"}\ \land \ \operatorname{LineFeedOrEOFBeforeClose}(T,\ i))\quad \lnot \ \operatorname{Sensitive}(T[i])\quad \Gamma \ \vdash \ \operatorname{NextToken}(T,\ i)\ \Uparrow \ c \\
\rule{18em}{0.4pt} \\
\langle \operatorname{LexScan}(S,\ i,\ K,\ D,\ \mathsf{Sens})\rangle \ \to \ \langle \operatorname{LexError}(c)\rangle 
\end{array}
$$

### 4.2.12 Tokenize

**(Tokenize-Ok)**

$$
\begin{array}{l}
\langle \operatorname{LexStart}(S)\rangle \ \to *\ \langle \operatorname{LexDone}(K,\ D,\ \mathsf{Sens})\rangle \quad \Gamma \ \vdash \ \operatorname{LexSecure}(S,\ K,\ \mathsf{Sens})\ \Downarrow \ \mathsf{ok} \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Tokenize}(S)\ \Downarrow \ (K,\ D)
\end{array}
$$

**(Tokenize-Secure-Err)**

$$
\begin{array}{l}
\langle \operatorname{LexStart}(S)\rangle \ \to *\ \langle \operatorname{LexDone}(K,\ D,\ \mathsf{Sens})\rangle \quad \Gamma \ \vdash \ \operatorname{LexSecure}(S,\ K,\ \mathsf{Sens})\ \Uparrow \ c \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Tokenize}(S)\ \Uparrow \ c
\end{array}
$$

**(Tokenize-Err)**

$$
\begin{array}{l}
\langle \operatorname{LexStart}(S)\rangle \ \to *\ \langle \operatorname{LexError}(c)\rangle  \\
\rule{18em}{0.4pt} \\
\Gamma \ \vdash \ \operatorname{Tokenize}(S)\ \Uparrow \ c
\end{array}
$$

## 4.3 Source Loading and Lexical Diagnostics

This section owns source-loading and lexical diagnostics not reintroduced by later feature chapters.

| Code         | Severity | Detection    | Condition                                                    |
| ------------ | -------- | ------------ | ------------------------------------------------------------ |
| `E-SRC-0101` | Error    | Compile-time | Invalid UTF-8 byte sequence                                  |
| `E-SRC-0102` | Error    | Compile-time | Failed to read source file                                   |
| `E-SRC-0103` | Error    | Compile-time | Embedded BOM found after the first position                  |
| `E-SRC-0104` | Error    | Compile-time | Forbidden control character or null byte                     |
| `E-SRC-0301` | Error    | Compile-time | Unterminated string literal                                  |
| `E-SRC-0302` | Error    | Compile-time | Invalid escape sequence                                      |
| `E-SRC-0303` | Error    | Compile-time | Invalid character literal                                    |
| `E-SRC-0304` | Error    | Compile-time | Malformed numeric literal                                    |
| `E-SRC-0306` | Error    | Compile-time | Unterminated block comment                                   |
| `E-SRC-0307` | Error    | Compile-time | Invalid Unicode in identifier                                |
| `E-SRC-0308` | Error    | Compile-time | Lexically sensitive Unicode character outside `unsafe` block |
| `E-SRC-0309` | Error    | Compile-time | Tokenization failed to classify a character sequence         |
| `E-SRC-0310` | Error    | Compile-time | Confusable identifier pair                                   |
| `E-SRC-0311` | Error    | Compile-time | Mixed-script identifier                                      |
| `W-SRC-0101` | Warning  | Compile-time | UTF-8 BOM present at the start of the file                   |
| `W-SRC-0301` | Warning  | Compile-time | Leading zeros in decimal literal                             |
| `W-SRC-0308` | Warning  | Compile-time | Lexically sensitive Unicode character within `unsafe` block  |
