---
title: "Source Text and Lexical Structure"
description: "4. Source Text and Lexical Structure of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T17:39:45.389Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## 4. Source Text and Lexical Structure

### 4.1 Source Loading and Normalization

**Source File Record.**

```text
SourceFile = ⟨path, bytes, scalars, text, byte_len, line_starts, line_count⟩
```

S.text = EncodeUTF8(S.scalars)
S.byte_len = ByteLen(S.text)
S.line_count = |S.line_starts|

**Unicode Scalars and UTF-8.**

```text
Byte = { n ∈ ℕ | 0 ≤ n ≤ 255 }
```

Bytes = [Byte]

```text
UnicodeScalar = { u ∈ ℕ | 0 ≤ u ≤ 0x10FFFF ∧ u ∉ [0xD800, 0xDFFF] }
```

Scalars = [UnicodeScalar]
String = Scalars
Utf8Len(u) =

```text
 1  if 0 ≤ u ≤ 0x7F
 2  if 0x80 ≤ u ≤ 0x7FF
 3  if 0x800 ≤ u ≤ 0xFFFF
 4  if 0x10000 ≤ u ≤ 0x10FFFF
```

EncodeUTF8(u) =

```text
 [u]  if 0 ≤ u ≤ 0x7F
 [0xC0 ∨ (u >> 6), 0x80 ∨ (u & 0x3F)]  if 0x80 ≤ u ≤ 0x7FF
 [0xE0 ∨ (u >> 12), 0x80 ∨ ((u >> 6) & 0x3F), 0x80 ∨ (u & 0x3F)]  if 0x800 ≤ u ≤ 0xFFFF
 [0xF0 ∨ (u >> 18), 0x80 ∨ ((u >> 12) & 0x3F), 0x80 ∨ ((u >> 6) & 0x3F), 0x80 ∨ (u & 0x3F)]  if 0x10000 ≤ u ≤ 0x10FFFF
```

EncodeUTF8([]) = []
EncodeUTF8(u::U) = EncodeUTF8(u) ++ EncodeUTF8(U)

```text
DecodeUTF8(B) = U ⇔ EncodeUTF8(U) = B
Utf8Valid(B) ⇔ ∃ U. DecodeUTF8(B) = U
```

Utf8(s) = EncodeUTF8(s)

#### 4.1.1 Unicode Normalization Outside Identifiers

```text
NormalizeOutsideIdentifiers : Scalars → Scalars
```

NormalizeOutsideIdentifiers(T) = T

#### 4.1.2 Lexically Sensitive Unicode Enforcement

T = S.scalars

```text
LexSensitivePos(S) = [ p | 0 ≤ p < |T| ∧ Sensitive(T[p]) ∧ ¬ InsideLiteralOrComment(p) ]
Γ ⊢ LexSecure(S, K, LexSensitivePos(S)) ⇓ ok
```

#### 4.1.3 UTF-8 Decoding and BOM Handling

**(Decode-Ok)**

```text
DecodeUTF8(B) ⇓ U
```

────────────────────────

```text
Γ ⊢ Decode(B) ⇓ U
```

**(Decode-Err)**

```text
DecodeUTF8(B) ⇑
```

────────────────────────

```text
Γ ⊢ Decode(B) ⇑
```

StripLeadBOM([]) = []
StripLeadBOM(U+FEFF::U) = U

```text
StripLeadBOM(u::U) = u::U  if u ≠ U+FEFF
```

**(StripBOM-Empty)**
────────────────────────────────────────

```text
Γ ⊢ StripBOM([]) ⇓ ([], false, ⊥)
```

**(StripBOM-None)**

```text
U = u_0::u_1::…    u_0 ≠ U+FEFF    ∀ i > 0, u_i ≠ U+FEFF
```

────────────────────────────────────────────────────────────

```text
Γ ⊢ StripBOM(U) ⇓ (U, false, ⊥)
```

**(StripBOM-Start)**

```text
U = U+FEFF::U_1    ∀ i, U_1[i] ≠ U+FEFF
```

────────────────────────────────────────────

```text
Γ ⊢ StripBOM(U) ⇓ (U_1, true, ⊥)
```

**(StripBOM-Embedded)**

```text
U' = StripLeadBOM(U)    b = (U ≠ [] ∧ U[0] = U+FEFF)    i = min{ p | 0 ≤ p < |U'| ∧ U'[p] = U+FEFF }
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ StripBOM(U) ⇓ (U', b, i)
```

#### 4.1.4 Line Ending Normalization and Logical Lines

CR = U+000D
LF = U+000A

**(Norm-Empty)**
────────────────────────────────────────

```text
Γ ⊢ NormalizeLF([]) ⇓ []
```

**(Norm-CRLF)**

```text
Γ ⊢ NormalizeLF(U) ⇓ V
```

────────────────────────────────────────────────────────

```text
Γ ⊢ NormalizeLF([CR, LF] ++ U) ⇓ [LF] ++ V
```

**(Norm-CR)**

```text
U = [] ∨ U[0] ≠ LF    Γ ⊢ NormalizeLF(U) ⇓ V
```

──────────────────────────────────────────────────────────

```text
Γ ⊢ NormalizeLF([CR] ++ U) ⇓ [LF] ++ V
```

**(Norm-LF)**

```text
Γ ⊢ NormalizeLF(U) ⇓ V
```

────────────────────────────────────────────

```text
Γ ⊢ NormalizeLF([LF] ++ U) ⇓ [LF] ++ V
```

**(Norm-Other)**

```text
c ≠ CR    c ≠ LF    Γ ⊢ NormalizeLF(U) ⇓ V
```

────────────────────────────────────────────

```text
Γ ⊢ NormalizeLF([c] ++ U) ⇓ [c] ++ V
```

**Logical Line Map.**
Utf8Offsets([]) = [0]

```text
Utf8Offsets(c::cs) = [0] ++ [o + Utf8Len(c) | o ∈ Utf8Offsets(cs)]
```

```text
LineStarts(T) = [0] ++ [Utf8Offsets(T)[i] + 1 | 0 ≤ i < |T| ∧ T[i] = LF]
```

LineCount(T) = |LineStarts(T)|

**Locate (Line/Column).**
L = S.line_starts
o' = min(o, S.byte_len)

```text
k = max{ j | L[j] ≤ o' }
```

```text
Γ ⊢ Locate(S, o) ⇓ ⟨file = S.path, offset = o', line = k + 1, col = o' - L[k] + 1⟩
```

#### 4.1.5 Prohibited Code Points

```text
Prohibited(c) ⇔ General_Category(c) = Cc ∧ c ∉ {U+0009, U+000A, U+000C, U+000D}
```

```text
LiteralSpan(T) = ⋃ { [ByteOf(T, i), ByteOf(T, j)) | StringRange(T, i, j) ∨ CharRange(T, i, j) }
```

**(WF-Prohibited)**

```text
∀ i, Prohibited(T[i]) ⇒ ByteOf(T, i) ∈ LiteralSpan(T)
```

───────────────────────────────────────────────────────

```text
Γ ⊢ T : NoProhibited
```

#### 4.1.6 NFC Normalization for Identifiers and Module Paths

NFC(s) = UnicodeNFC_{15.0.0}(s)

CaseFold(s) = UnicodeCaseFold_{15.0.0}(s)

**Totality.**
The functions NFC and CaseFold are total on sequences of Unicode scalar values. All inputs to IdKey and PathKey MUST be Unicode scalar sequences; inputs are produced by LoadSource, which rejects invalid UTF-8.

IdKey(s) = NFC(s)

```text
IdEq(s_1, s_2) ⇔ IdKey(s_1) = IdKey(s_2)
```

PathKey(p) = [NFC(c_1), …, NFC(c_n)]

```text
PathEq(p, q) ⇔ PathKey(p) = PathKey(q)
```

#### 4.1.7 Newline Tokens and Statement Termination

Tokenize : SourceFile ⇀ (Token* × DocComment*)

```text
Tokenize(S) = (K, D) ⇒ LexNewline(K, S) ∧ LexNoComments(K, S)
```

Depth(K, 0) = 0
Depth(K, i+1) = Depth(K, i) + δ(K[i])
δ(t) =

```text
 1   if t ∈ {Punctuator("("), Punctuator("[")}
 -1  if t ∈ {Punctuator(")"), Punctuator("]")}
```

 0   otherwise

```text
Prev(K, i) = ⊥ ⇔ { j | j < i ∧ K[j].kind ≠ newline ∧ ∀ k. j < k < i ⇒ K[k].kind ≠ newline } = ∅
Prev(K, i) = K[j] ⇔ j = max{ j | j < i ∧ K[j].kind ≠ newline ∧ ∀ k. j < k < i ⇒ K[k].kind ≠ newline }
Next(K, i) = ⊥ ⇔ { j | j > i ∧ K[j].kind ≠ newline } = ∅
Next(K, i) = K[j] ⇔ j = min{ j | j > i ∧ K[j].kind ≠ newline }
```

Ambig = {"+", "-", "*", "&", "|"}
RangeCont = {"..", "..="}

```text
BeginsOperand(t) ⇔ t.kind ∈ {Identifier, IntLiteral, FloatLiteral, StringLiteral, CharLiteral, BoolLiteral, NullLiteral} ∨ (t.kind = Punctuator ∧ t.lexeme ∈ {"(", "[", "{"}) ∨ (t.kind = Operator ∧ t.lexeme ∈ {"!", "-", "&", "*", "^"}) ∨ (t.kind = Keyword ∧ t.lexeme ∈ {"if", "loop", "unsafe", "comptime", "quote", "move", "transmute", "widen", "parallel", "spawn", "dispatch", "yield", "sync", "race", "all"})
```

UnaryOnly = {"!", "~", "?"}

```text
AttrClose(t) ⇔ t.kind = Punctuator ∧ t.lexeme = "]]"
```

```text
Continue(K, i) ⇔ Depth(K, i) > 0 ∨ (∃ t. Prev(K, i) = t ∧ (t.lexeme = "," ∨ (t.kind = Operator ∧ ((((t.lexeme ∈ Ambig ∨ t.lexeme ∈ RangeCont) ∧ ∃ u. Next(K, i) = u ∧ BeginsOperand(u)) ∨ (t.lexeme ∉ UnaryOnly ∧ t.lexeme ∉ RangeCont)))))) ∨ (∃ u. Next(K, i) = u ∧ u.lexeme ∈ {".", "::", "~>"}) ∨ (∃ t, u. Prev(K, i) = t ∧ AttrClose(t) ∧ Next(K, i) = u ∧ BeginsOperand(u))
```

```text
For `t.lexeme ∈ RangeCont`, continuation across newline MUST require `Next(K, i)` to begin an operand. This permits split forms like `a .. \n b` and `.. \n b`, while allowing newline termination after complete `a ..` and `..` forms.
```

```text
Filter(K) = [ K[i] | K[i].kind ≠ newline ∨ ¬ Continue(K, i) ]
```

```text
IsTerminator(t) ⇔ t = Punctuator(";") ∨ t.kind = newline
BoundaryTokens(K, i) = { t | t = K[i] ∨ t = Prev(K, i) ∨ t = Next(K, i) } \ {⊥}
HasTerminator(F, i) ⇔ ∃ t ∈ BoundaryTokens(F, i). IsTerminator(t)
```

A newline inside `{ ... }` MUST use `Continue(K, i)` without modification; the depth disjunct and non-depth disjuncts apply uniformly inside and outside braces.
Commas are separators within a single statement and are never statement terminators. A comma MUST appear only between elements of a comma-delimited production. Item-separated bodies use statement terminators instead and MUST NOT use commas as top-level separators unless their local grammar explicitly permits them. Trailing commas are permitted only when TrailingCommaAllowed (§5.5); otherwise they are ill-formed. A permitted trailing comma does not introduce an empty list element.

```text
RequiredTerminator : Token* × ℕ → Bool
ContinuesLine : Token* × ℕ → Bool
ContinuesLine(K, i) ⇔ K[i].kind = newline ∧ Continue(K, i)
RequiredTerminator(K, i) ⇔ K[i].kind = newline ∧ ¬ ContinuesLine(K, i)
```

**(Missing-Terminator-Err)**

```text
RequiredTerminator(K, i)    ¬ HasTerminator(Filter(K), i)    c = Code(Missing-Terminator-Err)
```

──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Emit(c)
```

#### 4.1.8 Source Loading Pipeline

SourceLoadState = {Start(f, B), Sized(f, B), Decoded(f, B, U), BomStripped(f, B, U, b, j), Normalized(f, B, T, j), LineMapped(f, B, T, L), Validated(S), Error(code)}

```text
B ∈ Bytes
U ∈ Scalars
T ∈ Scalars
```

L = LineStarts(T)

```text
j ∈ ℕ ∪ {⊥}
```

**(Step-Size)**
────────────────────────────────────────

```text
⟨Start(f, B)⟩ → ⟨Sized(f, B)⟩
```

**(Step-Decode)**

```text
Γ ⊢ Decode(B) ⇓ U
```

────────────────────────────────────────────

```text
⟨Sized(f, B)⟩ → ⟨Decoded(f, B, U)⟩
```

**(Step-Decode-Err)**

```text
Γ ⊢ Decode(B) ⇑
```

───────────────────────────────────────────────────────────

```text
⟨Sized(f, B)⟩ → ⟨Error(Code(Step-Decode-Err))⟩
```

**(Step-BOM)**

```text
Γ ⊢ StripBOM(U) ⇓ (U', b, j)
```

────────────────────────────────────────────────

```text
⟨Decoded(f, B, U)⟩ → ⟨BomStripped(f, B, U', b, j)⟩
```

**(Step-Norm)**

```text
T = NormalizeOutsideIdentifiers(U)    Γ ⊢ NormalizeLF(T) ⇓ V
```

─────────────────────────────────────────────────────────────

```text
⟨BomStripped(f, B, U, b, j)⟩ → ⟨Normalized(f, B, V, j)⟩
```

**(Step-EmbeddedBOM-Err)**

```text
j ≠ ⊥
```

───────────────────────────────────────────────────────────

```text
⟨Normalized(f, B, T, j)⟩ → ⟨Error(Code(Step-EmbeddedBOM-Err))⟩
```

**(Step-LineMap)**

```text
j = ⊥    L = LineStarts(T)
```

────────────────────────────────────────────────────────────

```text
⟨Normalized(f, B, T, j)⟩ → ⟨LineMapped(f, B, T, L)⟩
```

**(Step-Prohibited)**

```text
Γ ⊢ T : NoProhibited    S = ⟨path = f, bytes = B, scalars = T, text = EncodeUTF8(T), byte_len = ByteLen(T), line_starts = L, line_count = |L|⟩
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨LineMapped(f, B, T, L)⟩ → ⟨Validated(S)⟩
```

**(Step-Prohibited-Err)**

```text
Γ ⊬ T : NoProhibited
```

────────────────────────────────────────────────────────────

```text
⟨LineMapped(f, B, T, L)⟩ → ⟨Error(Code(Step-Prohibited-Err))⟩
```

**Source Load (Big-Step)**

**(LoadSource-Ok)**

```text
Γ ⊢ Decode(B) ⇓ U    Γ ⊢ StripBOM(U) ⇓ (U', b, ⊥)    Γ ⊢ NormalizeLF(NormalizeOutsideIdentifiers(U')) ⇓ T    L = LineStarts(T)    Γ ⊢ T : NoProhibited    S = ⟨path = f, bytes = B, scalars = T, text = EncodeUTF8(T), byte_len = ByteLen(T), line_starts = L, line_count = |L|⟩
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LoadSource(f, B) ⇓ S
```

**(LoadSource-Err)**

```text
Γ ⊢ LoadSource(f, B) →* ⟨Error(c)⟩
```

──────────────────────────────────────

```text
Γ ⊢ LoadSource(f, B) ⇑ c
```

#### 4.1.9 Diagnostic Spans for Source Loading

```text
S_tmp = ⟨path = f, bytes = B, text = EncodeUTF8(T), byte_len = ByteLen(T), line_starts = LineStarts(T), line_count = |LineStarts(T)|⟩
```

O = Utf8Offsets(T)
O[|T|] = ByteLen(T)

SpanAtIndex(T, i) = SpanOf(S_tmp, O[i], O[i+1])

SpanAtLineStart(T, k) = SpanOf(S_tmp, s, e)
s =
 LineStarts(T)[k]  if k < |LineStarts(T)|
 ByteLen(T)        otherwise
e = min(s + 1, ByteLen(T))

If b = true, the warning W-SRC-0101 MUST be emitted even if LoadSource ultimately fails.

**(Span-BOM-Warn)**
b = true    e = min(1, ByteLen(T))
──────────────────────────────────────────────

```text
Γ ⊢ Emit(W-SRC-0101, SpanOf(S_tmp, 0, e))
```

**(Span-BOM-Embedded)**

```text
j ≠ ⊥    i = min{ p | 0 ≤ p < |T| ∧ T[p] = U+FEFF }
```

───────────────────────────────────────────────────────────────────

```text
Γ ⊢ Emit(E-SRC-0103, SpanAtIndex(T, i))
```

**(Span-Prohibited)**

```text
i = min{ p | 0 ≤ p < |T| ∧ Prohibited(T[p]) ∧ O[p] ∉ LiteralSpan(T) }
```

─────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Emit(E-SRC-0104, SpanAtIndex(T, i))
```

**(NoSpan-Decode)**
────────────────────────────────────────

```text
Γ ⊢ Emit(E-SRC-0101, ⊥)
```

### 4.2 Lexical Analysis

#### 4.2.1 Inputs, Outputs, and Records

**LexerInput.**
T = S.scalars
B = S.text
n = S.byte_len

```text
LexerInput(S) = ⟨T, B, n⟩
```

**LexerOutput.**

```text
LexerOutput(S) = ⟨K, D⟩
K ∈ Token*    D ∈ DocComment*
```

**EOF Token.**
EOFSpan(S) = SpanOfText(S, |T|, |T|)

```text
TokenEOF(S) = ⟨EOF, ε, EOFSpan(S)⟩
```

**LexemeBinding.**

```text
TokenRange(S, t) = (i, j) ⇔ t.span = SpanOfText(S, i, j)
LexemeBinding(S, T, K) ⇔ ∀ t ∈ K. ∃ i, j. TokenRange(S, t) = (i, j) ∧ t.lexeme = Lexeme(T, i, j)
```

**DocComment.**

```text
DocComment = ⟨kind, text, span⟩
```

DocKind = {LineDoc, ModuleDoc}
StripLeadingSpace(s) =

```text
 s[1..|s|)  if |s| > 0 ∧ At(s, 0) = U+0020
```

 s          otherwise
DocBody(T, i, j) = StripLeadingSpace(T[i+3..j))
DocMarker(T, i) =
 LineDoc    if T[i..i+3] = "///"
 ModuleDoc  if T[i..i+3] = "//!"

```text
 ⊥          otherwise
```

**Newline Tokens.**

```text
NewlineTokenAt(S, T, i) ⇔ T[i] = LF ∧ ¬ InsideLiteralOrComment(i)
LexNewline(K, S) ⇔ ∀ i. NewlineTokenAt(S, T, i) ⇒ ∃ t ∈ K. t.kind = Newline ∧ TokenRange(S, t) = (i, i+1)
TokenInComment(S, t) ⇔ ∃ i, j, a, b. TokenRange(S, t) = (i, j) ∧ (LineCommentRange(T, a, b) ∨ BlockCommentRange(T, a, b)) ∧ a ≤ i ∧ j ≤ b
LexNoComments(K, S) ⇔ ∀ t ∈ K. ¬ TokenInComment(S, t)
```

**Indices and Lexemes.**
T = S.scalars
O = Utf8Offsets(T)

```text
ScalarIndex(T) = { i | 0 ≤ i ≤ |T| }
```

ByteOf(T, i) = O[i]

SpanOfText(S, i, j) = SpanOf(S, ByteOf(T, i), ByteOf(T, j))

Lexeme(T, i, j) = T[i..j)

#### 4.2.2 Character Classes

```text
c ∈ UnicodeScalar
```

**Whitespace.**

```text
Whitespace(c) ⇔ c ∈ {U+0020, U+0009, U+000C}
```

**Line Feed.**

```text
LineFeed(c) ⇔ c = U+000A
```

**Identifier Characters.**

```text
XID_Start : UnicodeScalar → Bool
XID_Continue : UnicodeScalar → Bool
```

```text
IdentStart(c) ⇔ c = '_' ∨ XID_Start(c)
IdentContinue(c) ⇔ c = '_' ∨ XID_Continue(c)
```

XIDVersion = "15.0.0"

```text
XID_Start(c) ⇔ c ∈ UAX31_XID_Start_{15.0.0}
XID_Continue(c) ⇔ c ∈ UAX31_XID_Continue_{15.0.0}
```

**Non-Characters.**

```text
NonCharacter(c) ⇔ c ∈ [U+FDD0, U+FDEF] ∨ (c & 0xFFFF) ∈ {0xFFFE, 0xFFFF}
```

**Digits.**

```text
DecDigit(c) ⇔ c ∈ {'0' … '9'}
HexDigit(c) ⇔ DecDigit(c) ∨ c ∈ {'a' … 'f', 'A' … 'F'}
OctDigit(c) ⇔ c ∈ {'0' … '7'}
BinDigit(c) ⇔ c ∈ {'0', '1'}
```

**Lexically Sensitive Characters.**

```text
Sensitive(c) ⇔ c ∈ {U+202A … U+202E, U+2066 … U+2069, U+200C, U+200D}
```

#### 4.2.3 Reserved Lexemes

**Reserved.**
Reserved = {`all`, `as`, `break`, `class`, `comptime`, `continue`, `derive`, `dispatch`, `else`, `enum`, `false`, `defer`, `frame`, `from`, `if`, `imm`, `import`, `internal`, `let`, `loop`, `modal`, `move`, `mut`, `null`, `parallel`, `private`, `procedure`, `public`, `quote`, `race`, `record`, `region`, `return`, `shared`, `spawn`, `sync`, `transition`, `transmute`, `true`, `type`, `unique`, `unsafe`, `var`, `widen`, `using`, `yield`, `const`, `override`}

FutureReserved = ∅

**Keyword Predicate.**

```text
Keyword(s) ⇔ s ∈ Reserved
```

**Reserved Namespaces.**
ReservedNamespacePrefix = {`ultraviolet::`}
ReservedIdentPrefix = {`gen_`}
ReservedNamespacePhase = Phase3

**Universe-Protected Bindings.**
UniverseProtected = {`i8`, `i16`, `i32`, `i64`, `i128`, `u8`, `u16`, `u32`, `u64`, `u128`, `f16`, `f32`, `f64`, `bool`, `char`, `usize`, `isize`, `Self`, `Drop`, `Bitcopy`, `Clone`, `Eq`, `Hash`, `Hasher`, `Iterator`, `Step`, `FfiSafe`, `string`, `bytes`, `Modal`, `Region`, `RegionOptions`, `CancelToken`, `Context`, `System`, `Network`, `ExecutionDomain`, `Reactor`, `CpuSet`, `Priority`, `Async`, `Future`, `Sequence`, `Stream`, `Pipe`, `Exchange`, `Tracked`, `Spawned`}
UniverseProtectedPhase = Phase3

`Drop`, `Bitcopy`, `Clone`, and `FfiSafe` are reserved predicate names. They MUST NOT be declared as classes or used as user-defined type/value bindings.

#### 4.2.4 Token Kinds

```text
TokenKind ∈ {Identifier, Keyword(k), IntLiteral, FloatLiteral, StringLiteral, CharLiteral, BoolLiteral, NullLiteral, Operator(o), Punctuator(p), Newline, Unknown}
```

**Operator Set.**
OperatorSet = {"+", "-", "*", "/", "%", "**", "==", "!=", "<", "<=", ">", ">=", "&&", "||", "!", "&", "|", "^", "<<", ">>", "=", "+=", "-=", "*=", "/=", "%=", "&=", "|:", "^=", "<<=", ">>=", ":=", "<:", "..", "..=", "=>", "->", "::", "~", "~>", "~!", "~%", "?", "#", "@", "$"}

**Punctuator Set.**
PunctuatorSet = {"(", ")", "[", "]", "[[", "]]", "{", "}", ",", ":", ";", "."}

```text
OperatorSet ∩ PunctuatorSet = ∅
```

#### 4.2.5 Comment and Whitespace Scanning

T = S.scalars

**Line Comment Scan.**

**(Scan-Line-Comment)**

```text
T[i] = '/'    T[i+1] = '/'    j = min{ p | i ≤ p ∧ (p = |T| ∨ T[p] = LF) }
```

────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ScanLineComment(T, i) ⇓ j
```

**Doc Comment Classification.**
kind = DocMarker(T, i)
body = DocBody(T, i, j)

**(Doc-Comment)**

```text
Γ ⊢ ScanLineComment(T, i) ⇓ j    kind ≠ ⊥
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ DocComment(T, i) ⇓ ⟨kind, body, SpanOfText(S, i, j)⟩
```

LineCommentTokens(T, i) = []

```text
LineCommentNext(T, i) = j where Γ ⊢ ScanLineComment(T, i) ⇓ j
```

**Block Comment Scan (Nested).**

```text
BlockState = { BlockScan(T, i, d, i_0) | 0 ≤ i_0 ≤ i ≤ |T| ∧ d ∈ ℕ } ∪ { BlockDone(j) | 0 ≤ j ≤ |T| }
```

**(Block-Start)**
T[i] = '/'    T[i+1] = '*'
───────────────────────────────────────────────────────────

```text
⟨BlockScan(T, i, d, i_0)⟩ → ⟨BlockScan(T, i+2, d+1, i_0)⟩
```

**(Block-End)**
T[i] = '*'    T[i+1] = '/'    d > 1
───────────────────────────────────────────────────────────

```text
⟨BlockScan(T, i, d, i_0)⟩ → ⟨BlockScan(T, i+2, d-1, i_0)⟩
```

**(Block-Done)**
T[i] = '*'    T[i+1] = '/'    d = 1
───────────────────────────────────────────────────────

```text
⟨BlockScan(T, i, d, i_0)⟩ → ⟨BlockDone(i+2)⟩
```

**(Block-Step)**

```text
T[i..i+2] ≠ "/*"    T[i..i+2] ≠ "*/"
```

───────────────────────────────────────────────────────────

```text
⟨BlockScan(T, i, d, i_0)⟩ → ⟨BlockScan(T, i+1, d, i_0)⟩
```

**(Block-Comment-Unterminated)**

```text
⟨BlockScan(T, i, d, i_0)⟩ →* ⟨BlockScan(T, |T|, d, i_0)⟩    d > 0    c = Code(Block-Comment-Unterminated)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Emit(c, SpanOfText(S, i_0, i_0+2))
```

#### 4.2.6 Literal Lexing

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

The productions `string_literal` and `char_literal` define well-formed quoted literal spellings. During tokenization, any terminated quoted span with the corresponding delimiter MUST form a `StringLiteral` or `CharLiteral` token even when its interior is ill-formed. Bad escapes and invalid character-literal contents MUST emit their corresponding diagnostics and MUST NOT suppress token formation. Unterminated quoted spans are excluded from token formation and follow the recovery rules in §4.2.11.

bool_literal ::= "true" | "false"
null_literal ::= "null"
```

**Float Suffix and Defaulting.**
Float literals MAY omit a suffix when they contain a decimal point. The suffix `f` indicates a float literal with width inferred from context; explicit suffixes `f16`, `f32`, `f64` specify the width directly. If no expected type is present, an unsuffixed decimal float literal defaults to `f32`. If an expected or declared float type is present, that expected type governs checking of unsuffixed and `f`-suffixed literals. Using an explicit width suffix with a conflicting expected type is an error.

**Escape Validity.**
SimpleEscape = {`\\`, `\"`, `\'`, `\n`, `\r`, `\t`, `\0`}

```text
EscapeOk(`\\`) ∧ EscapeOk(`\"`) ∧ EscapeOk(`\'`) ∧ EscapeOk(`\n`) ∧ EscapeOk(`\r`) ∧ EscapeOk(`\t`) ∧ EscapeOk(`\0`)
EscapeOk("\\x" h_1 h_2) ⇔ HexDigit(h_1) ∧ HexDigit(h_2)
EscapeOk("\\u{" h_1 … h_n "}") ⇔ 1 ≤ n ≤ 6 ∧ UnicodeScalar(HexValue(h_1 … h_n))
```

```text
StringChar(c) ⇔ UnicodeScalar(c) ∧ c ≠ "\"" ∧ c ≠ "\\" ∧ c ≠ U+000A
CharContent(c) ⇔ UnicodeScalar(c) ∧ c ≠ "'" ∧ c ≠ "\\" ∧ c ≠ U+000A
```

string_char_unit = { c | StringChar(c) }
char_content_unit = { c | CharContent(c) }

**Underscore Constraints.**
BasePrefix = {"0x", "0o", "0b"}
IntSuffixSet = {"i8", "i16", "i32", "i64", "i128", "u8", "u16", "u32", "u64", "u128", "isize", "usize"}
FloatSuffixSet = {"f", "f16", "f32", "f64"}

```text
NumSuffix = IntSuffixSet ∪ FloatSuffixSet
```

At(s, i) = s[i]

```text
StartsWith(s, p) ⇔ s[0..|p|) = p
EndsWith(s, p) ⇔ s[|s| - |p|..|s|) = p
Remove(s, c) = [ s[i] | 0 ≤ i < |s| ∧ s[i] ≠ c ]
```

Concat([]) = `"\""`
Concat([s]) = s
Concat(s::ss) = s ++ Concat(ss)    (|ss| > 0)
Hex2(b) = HexDigit(⌊b/16⌋) ++ HexDigit(b mod 16)
HexDigitValue(`'0'`) = 0    HexDigitValue(`'1'`) = 1    HexDigitValue(`'2'`) = 2    HexDigitValue(`'3'`) = 3    HexDigitValue(`'4'`) = 4    HexDigitValue(`'5'`) = 5    HexDigitValue(`'6'`) = 6    HexDigitValue(`'7'`) = 7    HexDigitValue(`'8'`) = 8    HexDigitValue(`'9'`) = 9
HexDigitValue(`'a'`) = 10    HexDigitValue(`'b'`) = 11    HexDigitValue(`'c'`) = 12    HexDigitValue(`'d'`) = 13    HexDigitValue(`'e'`) = 14    HexDigitValue(`'f'`) = 15
HexDigitValue(`'A'`) = 10    HexDigitValue(`'B'`) = 11    HexDigitValue(`'C'`) = 12    HexDigitValue(`'D'`) = 13    HexDigitValue(`'E'`) = 14    HexDigitValue(`'F'`) = 15
HexValue(h_1…h_n) = ∑_{k=1}^{n} HexDigitValue(h_k) · 16^(n-k)
DecDigitValue(`'0'`) = 0    DecDigitValue(`'1'`) = 1    DecDigitValue(`'2'`) = 2    DecDigitValue(`'3'`) = 3    DecDigitValue(`'4'`) = 4    DecDigitValue(`'5'`) = 5    DecDigitValue(`'6'`) = 6    DecDigitValue(`'7'`) = 7    DecDigitValue(`'8'`) = 8    DecDigitValue(`'9'`) = 9
OctDigitValue(`'0'`) = 0    OctDigitValue(`'1'`) = 1    OctDigitValue(`'2'`) = 2    OctDigitValue(`'3'`) = 3    OctDigitValue(`'4'`) = 4    OctDigitValue(`'5'`) = 5    OctDigitValue(`'6'`) = 6    OctDigitValue(`'7'`) = 7
BinDigitValue(`'0'`) = 0    BinDigitValue(`'1'`) = 1
DecValue(d_1…d_n) = ∑_{k=1}^{n} DecDigitValue(d_k) · 10^(n-k)
OctValue(d_1…d_n) = ∑_{k=1}^{n} OctDigitValue(d_k) · 8^(n-k)
BinValue(d_1…d_n) = ∑_{k=1}^{n} BinDigitValue(d_k) · 2^(n-k)

```text
StartsWithUnderscore(s) ⇔ At(s, 0) = "_"
EndsWithUnderscore(s) ⇔ At(s, |s|-1) = "_"
AfterBasePrefixUnderscore(s) ⇔ ∃ p ∈ BasePrefix. StartsWith(s, Concat(p, "_"))
AdjacentExponentUnderscore(s) ⇔ ∃ i. At(s, i) = "_" ∧ ((i > 0 ∧ At(s, i-1) ∈ {"e", "E"}) ∨ (i+1 < |s| ∧ At(s, i+1) ∈ {"e", "E"}))
BeforeSuffixUnderscore(s) ⇔ ∃ suf ∈ NumSuffix. EndsWith(s, Concat("_", suf))
NumericUnderscoreOk(s) ⇔ ¬ StartsWithUnderscore(s) ∧ ¬ EndsWithUnderscore(s) ∧ ¬ AfterBasePrefixUnderscore(s) ∧ ¬ AdjacentExponentUnderscore(s) ∧ ¬ BeforeSuffixUnderscore(s)
```

**Numeric Scan (Maximal Prefix).**

```text
DecRun(T, i) = max({i} ∪ { j | i < j ≤ |T| ∧ ∀ k ∈ [i, j). (DecDigit(T[k]) ∨ T[k] = "_") })
HexRun(T, i) = max({i} ∪ { j | i < j ≤ |T| ∧ ∀ k ∈ [i, j). (HexDigit(T[k]) ∨ T[k] = "_") })
OctRun(T, i) = max({i} ∪ { j | i < j ≤ |T| ∧ ∀ k ∈ [i, j). (OctDigit(T[k]) ∨ T[k] = "_") })
BinRun(T, i) = max({i} ∪ { j | i < j ≤ |T| ∧ ∀ k ∈ [i, j). (BinDigit(T[k]) ∨ T[k] = "_") })
```

```text
SuffixMatch(T, i, U) = max({i} ∪ { j | i < j ≤ |T| ∧ Lexeme(T, i, j) ∈ U })
```

ExpSignEnd(T, i) =

```text
 i+1  if i < |T| ∧ T[i] ∈ {"+", "-"}
```

 i    otherwise

ExpEnd(T, i) =

```text
 DecRun(T, ExpSignEnd(T, i+1))  if i < |T| ∧ T[i] ∈ {"e", "E"}
```

 i                              otherwise

DecCoreEnd(T, i) =

```text
 ExpEnd(T, q)  if p = DecRun(T, i) ∧ p < |T| ∧ T[p] = "." ∧ (p+1 ≥ |T| ∨ T[p+1] ≠ ".") ∧ q = DecRun(T, p+1)
 ExpEnd(T, p)  if p = DecRun(T, i) ∧ (p ≥ |T| ∨ T[p] ≠ "." ∨ (p+1 < |T| ∧ T[p+1] = "."))
```

A decimal run immediately followed by `..` or `..=` MUST NOT form a float core. In that case `DecCoreEnd(T, i) = DecRun(T, i)`, and the following `.` remains available to operator tokenization.

NumericCoreEnd(T, i) =
 HexRun(T, i+2)  if T[i..i+2] = "0x"
 OctRun(T, i+2)  if T[i..i+2] = "0o"
 BinRun(T, i+2)  if T[i..i+2] = "0b"
 DecCoreEnd(T, i)  otherwise

NumericScanEnd(T, i) = SuffixMatch(T, NumericCoreEnd(T, i), NumSuffix)

```text
HasDot(T, i, j) ⇔ ∃ p. i ≤ p < j ∧ T[p] = "."
HasExp(T, i, j) ⇔ ∃ p. i ≤ p < j ∧ T[p] ∈ {"e", "E"}
HasFloatCore(T, i, j) ⇔ HasDot(T, i, j)
```

NumericKind(T, i) =
 FloatLiteral  if HasFloatCore(T, i, NumericCoreEnd(T, i))
 IntLiteral    otherwise

**(Lex-Int)**
DecDigit(T[i])    j = NumericScanEnd(T, i)    NumericKind(T, i) = IntLiteral
───────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ IntLiteral(T, i) ⇓ j
```

**(Lex-Float)**
DecDigit(T[i])    j = NumericScanEnd(T, i)    NumericKind(T, i) = FloatLiteral
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ FloatLiteral(T, i) ⇓ j
```

```text
NumericLexemeOk(T, i, j) ⇔ (Lexeme(T, i, j) matches integer_literal ∨ Lexeme(T, i, j) matches float_literal) ∧ NumericUnderscoreOk(Lexeme(T, i, j))
NumericLexemeBad(T, i, j) ⇔ ¬ NumericLexemeOk(T, i, j)
```

**(Lex-Numeric-Err)**
DecDigit(T[i])    j = NumericScanEnd(T, i)    NumericLexemeBad(T, i, j)    c = Code(Lex-Numeric-Err)
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Emit(c, SpanOfText(S, i, j))
```

**Leading Zeros.**
Digits(s) = Remove(s, "_")

```text
DecimalLeadingZero(T, i, j) ⇔ Lexeme(T, i, j) matches decimal_integer ∧ |Digits(Lexeme(T, i, j))| > 1 ∧ At(Digits(Lexeme(T, i, j)), 0) = '0'
```

DecimalLeadingZero(T, i, j)
──────────────────────────────────────────────

```text
Γ ⊢ Emit(W-SRC-0301, SpanOfText(S, i, j))
```

**EscapeSequences.**
EscapeValue(`\\`) = 0x5C
EscapeValue(`\"`) = 0x22
EscapeValue(`\'`) = 0x27
EscapeValue(`\n`) = 0x0A
EscapeValue(`\r`) = 0x0D
EscapeValue(`\t`) = 0x09
EscapeValue(`\0`) = 0x00
EscapeValue("\\x" h_1 h_2) = HexValue(h_1 h_2)
EscapeValue("\\u{" h_1 … h_n "}") = EncodeUTF8(HexValue(h_1 … h_n))

**(Lex-String)**
T[i] = "\""    StringTerminator(T, i) = q    q < |T|    T[q] = "\""
─────────────────────────────────────────────────────────────────────

```text
Γ ⊢ StringLiteral(T, i) ⇓ q + 1
```

```text
BackslashCount(T, p) = max{ k | 0 ≤ k ≤ p ∧ ∀ r ∈ [p-k, p). T[r] = "\\" }
UnescapedQuote(T, p) ⇔ T[p] = "\"" ∧ BackslashCount(T, p) mod 2 = 0
StringTerminator(T, i) = min{ q | q > i ∧ (UnescapedQuote(T, q) ∨ T[q] = LF ∨ q = |T|) }
LineFeedOrEOFBeforeClose(T, i) ⇔ StringTerminator(T, i) = |T| ∨ T[StringTerminator(T, i)] = LF
EscapeMatch(T, p, q) ⇔ Lexeme(T, p, q) matches escape_sequence ∧ EscapeOk(Lexeme(T, p, q))
BadEscapeAt(T, p) ⇔ T[p] = "\\" ∧ ¬ ∃ q. EscapeMatch(T, p, q)
FirstBadStringEscape(T, i) = min{ p | i < p < StringTerminator(T, i) ∧ BadEscapeAt(T, p) }
```

**(Lex-String-Unterminated)**
LineFeedOrEOFBeforeClose(T, i)    c = Code(Lex-String-Unterminated)
────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Emit(c, SpanOfText(S, i, i+1))
```

**(Lex-String-BadEscape)**
FirstBadStringEscape(T, i) = p    c = Code(Lex-String-BadEscape)
───────────────────────────────────────────────────────────────

```text
Γ ⊢ Emit(c, SpanOfText(S, p, p+1))
```

**(Lex-Char)**
T[i] = "'"    CharTerminator(T, i) = q    q < |T|    T[q] = "'"
─────────────────────────────────────────────────────────────────

```text
Γ ⊢ CharLiteral(T, i) ⇓ q + 1
```

**Character Literal Encoding.**

```text
CharValueRange = { x | 0 ≤ x ≤ 0x10FFFF ∧ x ∉ [0xD800, 0xDFFF] }
```

CharRepr = `u32`
SizeOf(`char`) = 4
AlignOf(`char`) = 4

```text
UnescapedApostrophe(T, p) ⇔ T[p] = "'" ∧ BackslashCount(T, p) mod 2 = 0
CharTerminator(T, i) = min{ q | q > i ∧ (UnescapedApostrophe(T, q) ∨ T[q] = LF ∨ q = |T|) }
FirstBadCharEscape(T, i) = min{ p | i < p < CharTerminator(T, i) ∧ BadEscapeAt(T, p) }
CharLiteralInvalid(T, i) ⇔ CharScalarCount(T, i) ≠ 1
CharScalarCountFrom(T, p, q) = 0 ⇔ p ≥ q
CharScalarCountFrom(T, p, q) = 1 + CharScalarCountFrom(T, p+1, q) ⇔ p < q ∧ T[p] ≠ "\\"
CharScalarCountFrom(T, p, q) = 1 + CharScalarCountFrom(T, r, q) ⇔ p < q ∧ T[p] = "\\" ∧ EscapeMatch(T, p, r)
CharScalarCountFrom(T, p, q) = 1 + CharScalarCountFrom(T, p+1, q) ⇔ p < q ∧ T[p] = "\\" ∧ ¬ ∃ r. EscapeMatch(T, p, r)
```

CharScalarCount(T, i) = CharScalarCountFrom(T, i+1, CharTerminator(T, i))

**(Lex-Char-Unterminated)**
LineFeedOrEOFBeforeClose(T, i)    c = Code(Lex-Char-Unterminated)
─────────────────────────────────────────────────────────────────

```text
Γ ⊢ Emit(c, SpanOfText(S, i, i+1))
```

**(Lex-Char-BadEscape)**
FirstBadCharEscape(T, i) = p    c = Code(Lex-Char-BadEscape)
─────────────────────────────────────────────────────────

```text
Γ ⊢ Emit(c, SpanOfText(S, p, p+1))
```

**(Lex-Char-Invalid)**
CharLiteralInvalid(T, i)    c = Code(Lex-Char-Invalid)
────────────────────────────────────────────────────────

```text
Γ ⊢ Emit(c, SpanOfText(S, i, i+1))
```

**Literal Tokenization Helpers.**

```text
StringTok(T, i) = { (StringLiteral, j) | StringLiteral(T, i) ⇓ j }
CharTok(T, i) = { (CharLiteral, j) | CharLiteral(T, i) ⇓ j }
IntTok(T, i) = { (IntLiteral, j) | IntLiteral(T, i) ⇓ j }
FloatTok(T, i) = { (FloatLiteral, j) | FloatLiteral(T, i) ⇓ j }
```


#### 4.2.7 Identifier and Keyword Lexing

T = S.scalars

**Identifier Scan.**

```text
IdentScanEnd(T, i) = min{ j | j > i ∧ (¬ IdentContinue(T[j]) ∨ j = |T|) ∧ ∀ k ∈ (i, j). IdentContinue(T[k]) }
```

**(Lex-Identifier)**
IdentStart(T[i])    j = IdentScanEnd(T, i)    s = Lexeme(T, i, j)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ Ident(T, i) ⇓ (s, j)
```

**(Lex-Ident-InvalidUnicode)**

```text
k = min{ p | i ≤ p < j ∧ NonCharacter(T[p]) }    c = Code(Lex-Ident-InvalidUnicode)
```

────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Emit(c, SpanOfText(S, k, k+1))
```

**(Lex-Ident-Token)**

```text
Γ ⊢ Ident(T, i) ⇓ (s, j)    Γ ⊢ ClassifyIdent(s) ⇓ k
```

──────────────────────────────────────────────────────────────

```text
Γ ⊢ IdentToken(T, i) ⇓ (k, j)
```

**Keyword Classification.**
ClassifyIdent(s) =

```text
 BoolLiteral  if s ∈ {"true", "false"}
```

 NullLiteral  if s = "null"
 Keyword(s)   if Keyword(s)
 Identifier   otherwise

#### 4.2.8 Operator and Punctuator Lexing

OpSet = OperatorSet
PuncSet = PunctuatorSet

```text
OpMatch(T, i) = { (o, j) | o ∈ OpSet ∧ Lexeme(T, i, j) = o }
PuncMatch(T, i) = { (p, j) | p ∈ PuncSet ∧ Lexeme(T, i, j) = p }
```

```text
OpTok(T, i) = { (Operator(o), j) | (o, j) ∈ OpMatch(T, i) }
PuncTok(T, i) = { (Punctuator(p), j) | (p, j) ∈ PuncMatch(T, i) }
```

#### 4.2.9 Maximal-Munch Rule

T = S.scalars

```text
IsQuote(c) ⇔ c ∈ {"\"", "'"}
```

Candidates(T, i) =

```text
 StringTok(T, i) ∪ CharTok(T, i)  if IsQuote(T[i])
 FloatTok(T, i) ∪ IntTok(T, i)    if DecDigit(T[i])
```

 IdentToken(T, i)                 if IdentStart(T[i])

```text
 OpTok(T, i) ∪ PuncTok(T, i)      if OpTok(T, i) ≠ ∅ ∨ PuncTok(T, i) ≠ ∅
```

 ∅                                otherwise

```text
Longest(C) = { (k, j) ∈ C | ∀ (k', j') ∈ C, j ≥ j' }
```

KindPriority(IntLiteral) = 3
KindPriority(FloatLiteral) = 3
KindPriority(StringLiteral) = 3
KindPriority(CharLiteral) = 3
KindPriority(BoolLiteral) = 3
KindPriority(NullLiteral) = 3
KindPriority(Identifier) = 2
KindPriority(Keyword(_)) = 2
KindPriority(Operator(_)) = 1
KindPriority(Punctuator(_)) = 0

```text
PickLongest(C) = argmax_{(k, j) ∈ C} ⟨j, KindPriority(k)⟩
```

**(Max-Munch)**
PickLongest(C) = (k, j)
──────────────────────────────

```text
Γ ⊢ NextToken(T, i) ⇓ (k, j)
```

**(Max-Munch-Err)**
Candidates(T, i) = ∅    c = Code(Max-Munch-Err)
────────────────────────────────────────────────

```text
Γ ⊢ NextToken(T, i) ⇑ c
```

GenericCloseException = false

#### 4.2.10 Lexical Security

T = S.scalars
O = Utf8Offsets(T)

**Literal and Comment Ranges.**

```text
LineCommentRange(T, i, j) ⇔ Γ ⊢ ScanLineComment(T, i) ⇓ j
BlockCommentRange(T, i, j) ⇔ T[i..i+2] = "/*" ∧ ⟨BlockScan(T, i, 0, i)⟩ →* ⟨BlockDone(j)⟩
StringRange(T, i, j) ⇔ Γ ⊢ StringLiteral(T, i) ⇓ j
CharRange(T, i, j) ⇔ Γ ⊢ CharLiteral(T, i) ⇓ j
InsideLiteralOrComment(i) ⇔ ∃ a, b. a ≤ i < b ∧ (LineCommentRange(T, a, b) ∨ BlockCommentRange(T, a, b) ∨ StringRange(T, a, b) ∨ CharRange(T, a, b))
```

**Sensitive Positions in a Span.**

```text
SensitiveInSpan(T, i, j) = [ p | i ≤ p < j ∧ Sensitive(T[p]) ]
```

**Unsafe Spans (Token-Only).**

```text
IsLBrace(t) ⇔ t.kind = Punctuator("{")
IsRBrace(t) ⇔ t.kind = Punctuator("}")
```

```text
NextNonNewline(K, i) = ⊥ ⇔ { j | j ≥ i ∧ K[j].kind ≠ Newline } = ∅
NextNonNewline(K, i) = j ⇔ j = min{ j | j ≥ i ∧ K[j].kind ≠ Newline }
```

```text
MatchBrace(K, j) = min{ k | k > j ∧ Balance(j, k) = 0 ∧ ∀ m ∈ (j, k), Balance(j, m) > 0 }
```

```text
Balance(K, j, m) = |{ x | j ≤ x ≤ m ∧ IsLBrace(K[x]) }| - |{ x | j ≤ x ≤ m ∧ IsRBrace(K[x]) }|
MatchBrace(K, j) = ⊥ ⇔ { k | k > j ∧ Balance(K, j, k) = 0 ∧ ∀ m ∈ (j, k). Balance(K, j, m) > 0 } = ∅
```

```text
SpanFrom(t_a, t_b) = ⟨t_a.span.file, t_a.span.start_offset, t_b.span.end_offset, t_a.span.start_line, t_a.span.start_col, t_b.span.end_line, t_b.span.end_col⟩
```

```text
UnsafeSpans(K) = { SpanFrom(K[j], K[k]) | K[i].kind = Keyword("unsafe"), j = NextNonNewline(K, i+1), K[j].kind = Punctuator("{"), k = MatchBrace(K, j), k ≠ ⊥ }
```

```text
UnsafeAtByte(b) ⇔ ∃ sp ∈ UnsafeSpans(K). b ∈ SpanRange(sp)
```

UnsafeSpanMode = TokenOnly

**Lexical Security Check.**

```text
Sens = [ p | Sensitive(T[p]) ∧ ¬ InsideLiteralOrComment(p) ]
```

**(LexSecure-Err)**

```text
i = min{ p | p ∈ Sens ∧ ¬ UnsafeAtByte(ByteOf(T, p)) }    c = Code(LexSecure-Err)
```

──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LexSecure(S, K, Sens) ⇑ c
```

**(LexSecure-Warn)**

```text
∀ p ∈ Sens, UnsafeAtByte(ByteOf(T, p))    Γ ⊢ EmitList(LexSecureWarns(S, Sens))
```

──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LexSecure(S, K, Sens) ⇓ ok
```

**Confusable Identifier Checks.**

```text
ConfusablePair(x, y) ⇔ Skeleton(NFC(x)) = Skeleton(NFC(y)) ∧ NFC(x) ≠ NFC(y)
MixedScript(x) ⇔ IdentifierScripts(NFC(x)) contains more than one non-Common, non-Inherited script
```

**(Confusable-Err)**

```text
∃ x, y ∈ IdentifierLexemes(S). ConfusablePair(x, y)    c = Code(Confusable-Err)
```

──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ConfusableCheck(S) ⇑ c
```

**(MixedScript-Err)**

```text
∃ x ∈ IdentifierLexemes(S). MixedScript(x)    c = Code(MixedScript-Err)
```

──────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ConfusableCheck(S) ⇑ c
```

```text
LexSecureWarns(S, Sens) = [ ⟨W-SRC-0308, SpanOfText(S, p, p+1)⟩ | p ∈ Sens ]
```

LexSecureErrSpan(S, i) = SpanOfText(S, i, i+1)

#### 4.2.11 Tokenization

LexState = {LexStart(S), LexScan(S, i, K, D, Sens), LexDone(K, D, Sens), LexError(code)}
T = S.scalars
|T| = len(T)

**(Lex-Start)**
────────────────────────────────────────────

```text
⟨LexStart(S)⟩ → ⟨LexScan(S, 0, [], [], [])⟩
```

**(Lex-End)**

```text
i ≥ |T|
```

──────────────────────────────────────────────

```text
⟨LexScan(S, i, K, D, Sens)⟩ → ⟨LexDone(K, D, Sens)⟩
```

**(Lex-Whitespace)**
Whitespace(T[i])
───────────────────────────────────────────────

```text
⟨LexScan(S, i, K, D, Sens)⟩ → ⟨LexScan(S, i+1, K, D, Sens)⟩
```

**(Lex-Newline)**
T[i] = LF
──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨LexScan(S, i, K, D, Sens)⟩ → ⟨LexScan(S, i+1, K ++ [⟨newline, Lexeme(T, i, i+1), SpanOfText(S, i, i+1)⟩], D, Sens)⟩
```

**(Lex-Line-Comment)**

```text
T[i..i+2] = "//"    T[i..i+3] ∉ {"///", "//!"}    Γ ⊢ ScanLineComment(T, i) ⇓ j
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨LexScan(S, i, K, D, Sens)⟩ → ⟨LexScan(S, j, K, D, Sens)⟩
```

**(Lex-Doc-Comment)**

```text
T[i..i+3] ∈ {"///", "//!"}    Γ ⊢ ScanLineComment(T, i) ⇓ j    Γ ⊢ DocComment(T, i) ⇓ d
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨LexScan(S, i, K, D, Sens)⟩ → ⟨LexScan(S, j, K, D ++ [d], Sens)⟩
```

**(Lex-Block-Comment)**

```text
T[i..i+2] = "/*"    ⟨BlockScan(T, i, 0, i)⟩ →* ⟨BlockDone(j)⟩
```

──────────────────────────────────────────────────────────────────────────────

```text
⟨LexScan(S, i, K, D, Sens)⟩ → ⟨LexScan(S, j, K, D, Sens)⟩
```

**(Lex-String-Unterminated-Recover)**

```text
T[i] = "\""    LineFeedOrEOFBeforeClose(T, i)    c = Code(Lex-String-Unterminated)    Γ ⊢ Emit(c, SpanOfText(S, i, i+1))    j = StringTerminator(T, i)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨LexScan(S, i, K, D, Sens)⟩ → ⟨LexScan(S, j, K, D, Sens)⟩
```

**(Lex-Char-Unterminated-Recover)**

```text
T[i] = "'"    LineFeedOrEOFBeforeClose(T, i)    c = Code(Lex-Char-Unterminated)    Γ ⊢ Emit(c, SpanOfText(S, i, i+1))    j = CharTerminator(T, i)
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨LexScan(S, i, K, D, Sens)⟩ → ⟨LexScan(S, j, K, D, Sens)⟩
```

**(Lex-Sensitive)**
Sensitive(T[i])
────────────────────────────────────────────────────────────────────

```text
⟨LexScan(S, i, K, D, Sens)⟩ → ⟨LexScan(S, i+1, K, D, Sens ++ [i])⟩
```

SensitiveTok(T, i, j, k) =

```text
 []                    if k ∈ {StringLiteral, CharLiteral}
```

 SensitiveInSpan(T, i, j)  otherwise

**Tuple Projection Lexical Disambiguation.**
The postfix form `postfix_expr "." int_literal` takes precedence over a decimal-float token that would begin immediately after an already-emitted `.` token. If the most recently emitted token in `K` has lexeme `"."`, and the source at `i` admits both an `IntLiteral` token ending at `j_i` and a `FloatLiteral` token ending at `j_f` with `j_i < j_f`, the lexer MUST emit the `IntLiteral` token over `[i, j_i)` and continue from `j_i`. The following `.` remains available for subsequent tokenization.

**(Lex-Token)**

```text
¬ Whitespace(T[i])    T[i] ≠ LF    T[i..i+2] ∉ {"//", "/*"}    ¬ Sensitive(T[i])    Γ ⊢ NextToken(T, i) ⇓ (k, j)
```

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨LexScan(S, i, K, D, Sens)⟩ → ⟨LexScan(S, j, K ++ [⟨k, Lexeme(T, i, j), SpanOfText(S, i, j)⟩], D, Sens ++ SensitiveTok(T, i, j, k))⟩
```

**(Lex-Token-Err)**

```text
¬ Whitespace(T[i])    T[i] ≠ LF    T[i..i+2] ∉ {"//", "/*"}    ¬ (T[i] = "\"" ∧ LineFeedOrEOFBeforeClose(T, i))    ¬ (T[i] = "'" ∧ LineFeedOrEOFBeforeClose(T, i))    ¬ Sensitive(T[i])    Γ ⊢ NextToken(T, i) ⇑ c
```

──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
⟨LexScan(S, i, K, D, Sens)⟩ → ⟨LexError(c)⟩
```

#### 4.2.12 Tokenize

**(Tokenize-Ok)**

```text
⟨LexStart(S)⟩ →* ⟨LexDone(K, D, Sens)⟩    Γ ⊢ LexSecure(S, K, Sens) ⇓ ok
```

──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Tokenize(S) ⇓ (K, D)
```

**(Tokenize-Secure-Err)**

```text
⟨LexStart(S)⟩ →* ⟨LexDone(K, D, Sens)⟩    Γ ⊢ LexSecure(S, K, Sens) ⇑ c
```

─────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ Tokenize(S) ⇑ c
```

**(Tokenize-Err)**

```text
⟨LexStart(S)⟩ →* ⟨LexError(c)⟩
```

────────────────────────────────────

```text
Γ ⊢ Tokenize(S) ⇑ c
```

### 4.3 Source Loading and Lexical Diagnostics

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
