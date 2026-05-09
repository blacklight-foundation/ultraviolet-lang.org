---
title: "Diagnostic Infrastructure"
description: "2. Diagnostic Infrastructure of the Ultraviolet language specification."
specSource: "../../Ultraviolet/SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T13:48:04.933Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## 2. Diagnostic Infrastructure

### 2.1 Source Locations and Spans

**SourceLocation.**

```text
SourceLocation = ⟨file, offset, line, column⟩

**Span.**

```text
Span = ⟨file, start_offset, end_offset, start_line, start_col, end_line, end_col⟩

SpanRange(sp) = [sp.start_offset, sp.end_offset)

**(WF-Location)**

```text
0 ≤ o    Γ ⊢ Locate(S, o) ⇓ ℓ_loc
────────────────────────────────

```text
Γ ⊢ ℓ_loc : LocationOk

**(WF-Span)**

```text
0 ≤ s ≤ e ≤ S.byte_len    Γ ⊢ Locate(S, s) ⇓ ℓ_s    Γ ⊢ Locate(S, e) ⇓ ℓ_e
──────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ⟨S.path, s, e, ℓ_s.line, ℓ_s.column, ℓ_e.line, ℓ_e.column⟩ : SpanOk

**Span Construction**
ClampSpan(S, s, e) = (s', e')
s' = min(s, S.byte_len)
e' = min(max(e, s'), S.byte_len)

**(Span-Of)**

```text
Γ ⊢ ClampSpan(S, s, e) ⇓ (s', e')    Γ ⊢ ⟨S.path, s', e', line_s, col_s, line_e, col_e⟩ : SpanOk
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ SpanOf(S, s, e) ⇓ ⟨S.path, s', e', line_s, col_s, line_e, col_e⟩

### 2.2 Token Spans

**TokenKind.**
TokenKind = TokenKind_(§4.2.4) ∪ {Unknown}

**(No-Unknown-Ok)**

```text
∀ t ∈ K. t.kind ≠ Unknown
─────────────────────────

```text
Γ ⊢ K : TokenStreamOk

**RawToken.**

```text
RawToken = ⟨kind, lexeme, s, e⟩

**Token.**

```text
Token = ⟨kind, lexeme, span⟩

**(Attach-Token-Ok)**

```text
Γ ⊢ SpanOf(S, s, e) ⇓ sp
───────────────────────────────────────────────

```text
Γ ⊢ AttachSpan(S, ⟨k, ℓ, s, e⟩) ⇓ ⟨k, ℓ, sp⟩

**Token Stream Attachment (Big-Step)**

**(Attach-Tokens-Ok)**

```text
∀ r ∈ rs, Γ ⊢ AttachSpan(S, r) ⇓ t    ts = [t | r ∈ rs]
──────────────────────────────────────────────────────────────

```text
Γ ⊢ AttachSpans(S, rs) ⇓ ts

### 2.3 Diagnostic Records and Emission

**Diagnostic.**
Severity = {Error, Warning, Info, Panic, Note}

```text
DiagCodeOpt = DiagCode ∪ {⊥}

```text
Diagnostic = ⟨code, severity, message, span⟩    where code ∈ DiagCodeOpt ∧ severity ∈ Severity

```text
Normative diagnostic tables define only code-owned diagnostics. A diagnostic `d` is code-owned iff `d.code ≠ ⊥`. Auxiliary diagnostics use `d.code = ⊥`; they are admitted only where a feature section defines them explicitly.

**Diagnostic Stream.**
Δ = [d_1, …, d_n]

**(Emit-Append)**
────────────────────────────────────────────

```text
Γ ⊢ Emit(Δ, d) ⇓ (Δ ++ [d])

**Emit (Implicit).**
SeverityColumn : DiagCode → Severity
ConditionColumn : DiagCode → String

```text
SeverityColumn(c) = sev ⇔ a normative diagnostic table in this specification defines code `c` with severity `sev`.

```text
ConditionColumn(c) = cond ⇔ a normative diagnostic table in this specification defines code `c` with condition text `cond`.

```text
Emit(c) = Emit(Δ, ⟨c, Severity(c), Message(c), ⊥⟩)

```text
Emit(c, sp) = Emit(Δ, ⟨c, Severity(c), Message(c), sp⟩)
EmitList([]) = ok

```text
EmitList([d] ++ ds) = (Γ ⊢ Emit(d)) ∧ EmitList(ds)

Severity(c) = SeverityColumn(c)
Message(c) = ConditionColumn(c)

CompileStatus(Δ) =
 fail  if HasError(Δ)
 ok    otherwise

### 2.4 Diagnostic Code Selection

SpecCode : DiagId ⇀ DiagCode

```text
SpecCode(id) = c ⇔ the owning construct section of this specification assigns diagnostic code `c` to identifier `id`.

```text
SpecCode(id) = ⊥ ⇔ no owning construct section of this specification assigns a diagnostic code to `id`.

**(Code)**
SpecCode(id) = c
────────────────────────────

```text
Γ ⊢ Code(id) ⇓ c

Appendix A is informative only. It MUST NOT define `SpecCode`, `SeverityColumn`, or `ConditionColumn`.

**DiagId-Code Mapping.**
id emits a diagnostic
────────────────────────────

```text
Γ ⊢ Emit(Code(id))

```text
⇑ ≡ ⇑ Code(id)

**Resolution Failure.**
NoDiag(↑)

### 2.5 Diagnostic Ordering

**(Order)**
Δ = [d_1, d_2, …, d_n]
──────────────────────────────────────────────────

```text
Γ ⊢ Order(Δ) ⇓ [d_1, d_2, …, d_n]

### 2.6 Diagnostic Rendering

Render(d) =

```text
 head ++ msg ++ " @" ++ loc  if d.span ≠ ⊥

```text
 head ++ msg                if d.span = ⊥

head =

```text
 d.code ++ " (" ++ sev ++ ")"  if d.code ≠ ⊥

```text
 sev                           if d.code = ⊥
sev =
 "error"   if d.severity = Error
 "warning" if d.severity = Warning
 "info"    if d.severity = Info
 "panic"   if d.severity = Panic
 "note"    if d.severity = Note
msg =
 ""        if d.message = ""
 ": " ++ d.message  otherwise
loc = d.span.file ++ ":" ++ d.span.start_line ++ ":" ++ d.span.start_col

RenderRich(d, S) =
 head_rich ++ msg ++ "\n"
  ++ "  --> " ++ loc ++ "\n"
  ++ gutter ++ " | " ++ SourceLine(S, d.span) ++ "\n"
  ++ gutter ++ " | " ++ Underline(d.span)

```text
    if d.span ≠ ⊥ ∧ S(d.span.file) ≠ ⊥
 head_rich ++ msg
    otherwise

head_rich =

```text
 sev ++ "[" ++ d.code ++ "]"  if d.code ≠ ⊥

```text
 sev                          if d.code = ⊥

SourceLine(S, span) = Line(S(span.file), span.start_line)
Underline(span) = Spaces(span.start_col - 1) ++ Repeat("^", span.end_col - span.start_col)
gutter = PadLeft(span.start_line, gutterWidth) ++ " "
PermLexeme(const) = "const"
PermLexeme(unique) = "unique"
PermLexeme(shared) = "shared"
QualLexeme(imm) = "imm"
QualLexeme(mut) = "mut"

```text
PtrStateSuffix(⊥) = ""
PtrStateSuffix(Valid) = "@Valid"
PtrStateSuffix(Null) = "@Null"
PtrStateSuffix(Expired) = "@Expired"

```text
StringStateSuffix(⊥) = ""
StringStateSuffix(View) = "@View"
StringStateSuffix(Managed) = "@Managed"

```text
BytesStateSuffix(⊥) = ""
BytesStateSuffix(View) = "@View"
BytesStateSuffix(Managed) = "@Managed"

```text
ParamRender(⟨⊥, T⟩) = TypeRender(T)

```text
ParamRender(⟨move, T⟩) = "move " ++ TypeRender(T)
TypeRender(TypePrim(name)) = name
TypeRender(TypeRange(base)) = "Range<" ++ TypeRender(base) ++ ">"
TypeRender(TypeRangeInclusive(base)) = "RangeInclusive<" ++ TypeRender(base) ++ ">"
TypeRender(TypeRangeFrom(base)) = "RangeFrom<" ++ TypeRender(base) ++ ">"
TypeRender(TypeRangeTo(base)) = "RangeTo<" ++ TypeRender(base) ++ ">"
TypeRender(TypeRangeToInclusive(base)) = "RangeToInclusive<" ++ TypeRender(base) ++ ">"
TypeRender(TypeRangeFull) = "RangeFull"
TypeRender(TypePerm(p, T)) = PermLexeme(p) ++ " " ++ TypeRender(T)
TypeRender(TypeUnion([T_1, …, T_n])) = Join(" | ", [TypeRender(T_1), …, TypeRender(T_n)])

```text
TypeRender(TypeFunc([⟨m_1, T_1⟩, …, ⟨m_n, T_n⟩], R)) = "(" ++ Join(", ", [ParamRender(⟨m_1, T_1⟩), …, ParamRender(⟨m_n, T_n⟩)]) ++ ") -> " ++ TypeRender(R)
TypeRender(TypeTuple([])) = "()"
TypeRender(TypeTuple([T])) = "(" ++ TypeRender(T) ++ ";)"
TypeRender(TypeTuple([T_1, …, T_n])) = "(" ++ Join(", ", [TypeRender(T_1), …, TypeRender(T_n)]) ++ ")"
TypeRender(TypeArray(T, e)) = "[" ++ TypeRender(T) ++ "; " ++ ArrayLen(e) ++ "]"
TypeRender(TypeSlice(T)) = "[" ++ TypeRender(T) ++ "]"
TypeRender(TypePtr(T, s)) = "Ptr<" ++ TypeRender(T) ++ ">" ++ PtrStateSuffix(s)
TypeRender(TypeRawPtr(q, T)) = "* " ++ QualLexeme(q) ++ " " ++ TypeRender(T)
TypeRender(TypeString(st)) = "string" ++ StringStateSuffix(st)
TypeRender(TypeBytes(st)) = "bytes" ++ BytesStateSuffix(st)
TypeRender(TypeDynamic(p)) = "$" ++ StringOfPath(p)

```text
TypeRender(TypeApply(p, args)) = StringOfPath(p) ++ "<" ++ Join(", ", [TypeRender(a) | a ∈ args]) ++ ">"
TypeRender(TypeModalState(modal_ref, S)) = ModalRefRender(modal_ref) ++ "@" ++ S
TypeRender(TypePath(p)) = StringOfPath(p)
ModalRefRender(TypePath(p)) = StringOfPath(p)

```text
ModalRefRender(TypeApply(p, args)) = StringOfPath(p) ++ "<" ++ Join(", ", [TypeRender(a) | a ∈ args]) ++ ">"

### 2.7 Diagnostics Without Source Spans

**(NoSpan-External)**
Origin(d) = External
──────────────────────

```text
Γ ⊢ d.span = ⊥
