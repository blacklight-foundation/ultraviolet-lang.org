---
title: "Patterns"
description: "17. Patterns of the Ultraviolet language specification."
specSource: "../../Ultraviolet/SPECIFICATION.md"
specHash: "1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e"
generatedAt: "2026-05-09T13:48:04.933Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>1b8352f24d29890df364b26bbbd80a305cd72d74ffd3cd64c998bfd213f78d6e</code></span>
</div>

## 17. Patterns

### 17.1 Basic Patterns

#### 17.1.1 Syntax

```text
```

basic_pattern ::= literal | "_" | identifier
```

#### 17.1.2 Parsing

**(Parse-Pattern-Literal)**

```text
Tok(P).kind ∈ {IntLiteral, FloatLiteral, StringLiteral, CharLiteral, BoolLiteral, NullLiteral}
───────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePatternAtom(P) ⇓ (Advance(P), LiteralPattern(Tok(P)))

**(Parse-Pattern-Wildcard)**
IsIdent(Tok(P))    Lexeme(Tok(P)) = "_"
──────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePatternAtom(P) ⇓ (Advance(P), WildcardPattern)

**(Parse-Pattern-Identifier)**
IsIdent(Tok(P))
────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePatternAtom(P) ⇓ (Advance(P), IdentifierPattern(Lexeme(Tok(P))))

#### 17.1.3 AST Representation / Form

Pattern = {LiteralPattern(lit), WildcardPattern, IdentifierPattern(name), TuplePattern(elems), RecordPattern(type_path, fields), EnumPattern(type_path, name, payload_opt), ModalPattern(state_name, fields_opt), RangePattern(kind, lo, hi)}
PatternSpan : Pattern → Span

#### 17.1.4 Static Semantics

```text
CaseJudg = {Γ ⊢ pat ◁ T ⊣ B, Γ; R; L ⊢ CaseBody(body) : T, Γ; R; L ⊢ CaseBody(body) ⇐ T}

PermWrap(T, B) =

```text
  { { x ↦ TypePerm(p, T_x) | x ↦ T_x ∈ B }    if T = TypePerm(p, U)
    B                                      otherwise }

**(Pat-StripPerm)**

```text
Γ ⊢ pat ◁ StripPerm(T) ⊣ B
──────────────────────────────────────────────

```text
Γ ⊢ pat ◁ T ⊣ PermWrap(T, B)

**Pattern Name Extraction.**

──────────────────────────────────────────────

```text
Γ ⊢ PatNames(IdentifierPattern(x)) ⇓ [x]

**(Pat-Wild)**
──────────────────────────────────────────────

```text
Γ ⊢ PatNames(WildcardPattern) ⇓ []

**(Pat-Lit)**
──────────────────────────────────────────────

```text
Γ ⊢ PatNames(LiteralPattern(lit)) ⇓ []

**(Pat-Dup-R-Err)**

```text
PatJudg = {Γ ⊢ pat ⇐ T ⊣ B}

¬ Distinct(PatNames(pat))    c = Code(Pat-Dup-Err)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ pat ◁ T ⇑ c

**(Pat-Wildcard-R)**
──────────────────────────────────────────────

```text
Γ ⊢ _ ◁ T ⊣ ∅

**(Pat-Ident-R)**
──────────────────────────────────────────────

```text
Γ ⊢ x ◁ T ⊣ {x ↦ T}

**(Pat-Literal-R)**

```text
Γ ⊢ Literal(lit) : T_l    Γ ⊢ T_l <: T
────────────────────────────────────────────────────────────────

```text
Γ ⊢ LiteralPattern(lit) ◁ T ⊣ ∅

#### 17.1.5 Dynamic Semantics

BindEnv = Ident ⇀ Value

```text
Dom(B) = {x | x ∈ Ident ∧ B[x] defined}

```text
B_1 ⊎ B_2 = B ⇔ Dom(B_1) ∩ Dom(B_2) = ∅ ∧ ∀ x. (x ∈ Dom(B_1) ⇒ B[x] = B_1[x]) ∧ (x ∈ Dom(B_2) ⇒ B[x] = B_2[x])

```text
MatchPatJudg = {MatchPattern(p, v) ⇓ B}
PatType(LiteralPattern(lit)) =
 TypePrim(t)         if lit.kind = IntLiteral ∧ IntSuffix(lit) = t

```text
 TypePrim("i32")     if lit.kind = IntLiteral ∧ IntSuffix(lit) = ⊥

```text
 TypePrim(t)         if lit.kind = FloatLiteral ∧ FloatSuffix(lit) = t ∧ t ∈ {"f16", "f32", "f64"}
 TypePrim("f32")     if lit.kind = FloatLiteral ∧ (FloatSuffix(lit) = "f" ∨ NoFloatSuffix(lit))
 TypePrim("bool")    if lit.kind = BoolLiteral
 TypePrim("char")    if lit.kind = CharLiteral
 TypeString(`@View`) if lit.kind = StringLiteral

```text
 ⊥                   if lit.kind = NullLiteral

**(Match-Wildcard)**
──────────────────────────────────────────────

```text
Γ ⊢ MatchPattern(_, v) ⇓ ∅

**(Match-Ident)**
──────────────────────────────────────────────

```text
Γ ⊢ MatchPattern(x, v) ⇓ {x ↦ v}

**(Match-Literal)**
T = PatType(ℓ)    LiteralValue(ℓ, T) = v
──────────────────────────────────────────────────────────────

```text
Γ ⊢ MatchPattern(ℓ, v) ⇓ ∅

#### 17.1.6 Lowering

No basic-pattern-specific lowering is defined beyond the shared pattern-lowering machinery in §17.5.6.

#### 17.1.7 Diagnostics

Diagnostics are defined for duplicate bindings introduced by a single pattern.

### 17.2 Tuple and Record Patterns

#### 17.2.1 Syntax

```text
```

tuple_pattern        ::= "(" tuple_pattern_elements? ")"
tuple_pattern_elements ::= pattern ";" | pattern ("," pattern)+ ","?
record_pattern       ::= type_path "{" field_pattern_list? "}"
field_pattern_list   ::= field_pattern ("," field_pattern)* ","?
field_pattern        ::= identifier (":" pattern)?
```

The semicolon form is the only valid single-element tuple-pattern spelling.

#### 17.2.2 Parsing

**(Parse-Pattern-Tuple)**

```text
IsPunc(Tok(P), "(")    Γ ⊢ ParseTuplePatternElems(Advance(P)) ⇓ (P_1, elems)    IsPunc(Tok(P_1), ")")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePatternAtom(P) ⇓ (Advance(P_1), TuplePattern(elems))

**(Parse-Pattern-Record)**

```text
Γ ⊢ ParseTypePath(P) ⇓ (P_1, path)    IsPunc(Tok(P_1), "{")    Γ ⊢ ParseFieldPatternList(Advance(P_1)) ⇓ (P_2, fields)    IsPunc(Tok(P_2), "}")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePatternAtom(P) ⇓ (Advance(P_2), RecordPattern(path, fields))

**(Parse-TuplePatternElems-Empty)**
IsPunc(Tok(P), ")")
──────────────────────────────────────────────

```text
Γ ⊢ ParseTuplePatternElems(P) ⇓ (P, [])

**(Parse-TuplePatternElems-Single)**

```text
Γ ⊢ ParsePattern(P) ⇓ (P_1, p)    IsPunc(Tok(P_1), ";")
────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseTuplePatternElems(P) ⇓ (Advance(P_1), [p])

**(Parse-TuplePatternElems-Many)**

```text
Γ ⊢ ParsePattern(P) ⇓ (P_1, p_1)    IsPunc(Tok(P_1), ",")    Γ ⊢ ParsePattern(Advance(P_1)) ⇓ (P_2, p_2)    Γ ⊢ ParsePatternListTail(P_2, [p_2]) ⇓ (P_3, ps)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseTuplePatternElems(P) ⇓ (P_3, [p_1] ++ ps)

**(Parse-FieldPatternList-Empty)**
IsPunc(Tok(P), "}")
────────────────────────────────────────────────

```text
Γ ⊢ ParseFieldPatternList(P) ⇓ (P, [])

**(Parse-FieldPatternList-Cons)**

```text
Γ ⊢ ParseFieldPattern(P) ⇓ (P_1, f)    Γ ⊢ ParseFieldPatternTail(P_1, [f]) ⇓ (P_2, fs)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseFieldPatternList(P) ⇓ (P_2, fs)

**(Parse-FieldPattern)**

```text
Γ ⊢ ParseIdent(P) ⇓ (P_1, name)    Γ ⊢ ParseFieldPatternTailOpt(P_1, name) ⇓ (P_2, pat_opt)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseFieldPattern(P) ⇓ (P_2, ⟨name, pat_opt, SpanBetween(P, P_2)⟩)

**(Parse-FieldPatternTailOpt-None)**
¬ IsPunc(Tok(P), ":")
──────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseFieldPatternTailOpt(P, name) ⇓ (P, ⊥)

**(Parse-FieldPatternTailOpt-Yes)**

```text
IsPunc(Tok(P), ":")    Γ ⊢ ParsePattern(Advance(P)) ⇓ (P_1, pat)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseFieldPatternTailOpt(P, name) ⇓ (P_1, pat)

**(Parse-FieldPatternTail-End)**
IsPunc(Tok(P), "}")
────────────────────────────────────────────────

```text
Γ ⊢ ParseFieldPatternTail(P, xs) ⇓ (P, xs)

**(Parse-FieldPatternTail-TrailingComma)**
IsPunc(Tok(P), ",")    IsPunc(Tok(Advance(P)), "}")    TrailingCommaAllowed(P_0, P, {Punctuator("}")})
────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseFieldPatternTail(P, xs) ⇓ (Advance(P), xs)

**(Parse-FieldPatternTail-Comma)**

```text
IsPunc(Tok(P), ",")    Γ ⊢ ParseFieldPattern(Advance(P)) ⇓ (P_1, f)    Γ ⊢ ParseFieldPatternTail(P_1, xs ++ [f]) ⇓ (P_2, ys)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseFieldPatternTail(P, xs) ⇓ (P_2, ys)

#### 17.2.3 AST Representation / Form

```text
FieldPattern = ⟨name, pattern_opt, span⟩

```text
FieldName(⟨f, _, _⟩) = f

```text
PatOf(⟨f, ⊥, _⟩) = IdentifierPattern(f)

```text
PatOf(⟨f, p, _⟩) = p    if p ≠ ⊥

```text
∀ i, Γ ⊢ PatNames(p_i) ⇓ N_i
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PatNames(TuplePattern([p_1, …, p_n])) ⇓ N_1 ++ ··· ++ N_n

**(Pat-Record-Field-Explicit)**

```text
Γ ⊢ PatNames(p) ⇓ N
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PatNames(⟨name, pattern_opt = p, span⟩) ⇓ N

**(Pat-Record-Field-Implicit)**
──────────────────────────────────────────────

```text
Γ ⊢ PatNames(⟨name, pattern_opt = ⊥, span⟩) ⇓ [name]

```text
∀ i, Γ ⊢ PatNames(f_i) ⇓ N_i
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PatNames(RecordPattern(_, [f_1, …, f_n])) ⇓ N_1 ++ ··· ++ N_n

#### 17.2.4 Static Semantics

**(Pat-Tuple-R-Arity-Err)**

```text
StripPerm(T) = TypeTuple([T_1, …, T_n])    ps = [p_1, …, p_m]    m ≠ n    c = Code(Pat-Tuple-Arity-Err)
───────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TuplePattern(ps) ◁ T ⇑ c

**(Pat-Tuple-R)**

```text
StripPerm(T) = TypeTuple([T_1, …, T_n])    ∀ i, Γ ⊢ p_i ◁ T_i ⊣ B_i    B = ⊎_i B_i
───────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TuplePattern([p_1, …, p_n]) ◁ T ⊣ B

**(Pat-Record-R)**

```text
StripPerm(T) = TypePath(p)    RecordDecl(p) = R    ∀ fp ∈ fs, FieldType(R, FieldName(fp)) = T_f ∧ FieldVisible(m, R, FieldName(fp)) ∧ Γ ⊢ PatOf(fp) ◁ T_f ⊣ B_f    B = ⊎_{fp ∈ fs} B_f
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ RecordPattern(p, fs) ◁ T ⊣ B

**(RecordPattern-UnknownField)**

```text
StripPerm(T) = TypePath(p)    RecordDecl(p) = R    ∃ fp ∈ fs. FieldName(fp) ∉ FieldNameSet(R)    c = Code(RecordPattern-UnknownField)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ RecordPattern(p, fs) ◁ T ⇑ c

#### 17.2.5 Dynamic Semantics

**MatchRecord.**

```text
MatchRecordJudg = {Γ ⊢ MatchRecord(fs, v) ⇓ B}

**(MatchRecord-Empty)**
──────────────────────────────────────────────

```text
Γ ⊢ MatchRecord([], v) ⇓ ∅

**(MatchRecord-Cons-Implicit)**

```text
FieldValue(v, f) = v_f    Γ ⊢ MatchRecord(fs, v) ⇓ B
──────────────────────────────────────────────────────────────────────

```text
Γ ⊢ MatchRecord([f] ++ fs, v) ⇓ (B ⊎ {f ↦ v_f})

**(MatchRecord-Cons-Explicit)**

```text
FieldValue(v, f) = v_f    Γ ⊢ MatchPattern(p, v_f) ⇓ B_1    Γ ⊢ MatchRecord(fs, v) ⇓ B_2
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ MatchRecord([⟨f, p⟩] ++ fs, v) ⇓ (B_1 ⊎ B_2)

**(Match-Tuple)**

```text
v = (v_1, …, v_n)    ∀ i, Γ ⊢ MatchPattern(p_i, v_i) ⇓ B_i    B = ⊎_i B_i
───────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ MatchPattern((p_1, …, p_n), v) ⇓ B

**(Match-Record)**

```text
Γ ⊢ MatchRecord(fs, v) ⇓ B
──────────────────────────────────────────────

```text
Γ ⊢ MatchPattern(R{fs}, v) ⇓ B

#### 17.2.6 Lowering

Tuple and record patterns use the shared lowering rules in §17.5.6.

#### 17.2.7 Diagnostics

Diagnostics are defined for tuple-pattern arity mismatch and record patterns that reference unknown fields.

### 17.3 Enum and Modal Patterns

#### 17.3.1 Syntax

```text
```

enum_pattern                  ::= type_path "::" identifier enum_payload_pattern?
enum_payload_pattern          ::= "(" enum_payload_pattern_elements? ")" | "{" field_pattern_list? "}"
enum_payload_pattern_elements ::= pattern ("," pattern)* ","?
modal_pattern        ::= "@" identifier ("{" field_pattern_list? "}")?
```

A single-element tuple enum payload pattern is written as `(p)`. It MUST NOT use the tuple single-element marker `;`, which remains specific to `tuple_pattern`.

#### 17.3.2 Parsing

**(Parse-Pattern-Enum)**

```text
Γ ⊢ ParseTypePath(P) ⇓ (P_1, path)    IsOp(Tok(P_1), "::")    Γ ⊢ ParseIdent(Advance(P_1)) ⇓ (P_2, name)    Γ ⊢ ParseEnumPatternPayloadOpt(P_2) ⇓ (P_3, payload_opt)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePatternAtom(P) ⇓ (P_3, EnumPattern(path, name, payload_opt))

**(Parse-Pattern-Modal)**

```text
IsOp(Tok(P), "@")    Γ ⊢ ParseIdent(Advance(P)) ⇓ (P_1, name)    Γ ⊢ ParseModalPatternPayloadOpt(P_1) ⇓ (P_2, fields_opt)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePatternAtom(P) ⇓ (P_2, ModalPattern(name, fields_opt))

**(Parse-EnumPatternPayloadOpt-None)**

```text
Tok(P) ∉ {Punctuator("("), Punctuator("{")}
──────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseEnumPatternPayloadOpt(P) ⇓ (P, ⊥)

**(Parse-EnumPayloadPatternElems-Empty)**
IsPunc(Tok(P), ")")
────────────────────────────────────────────────

```text
Γ ⊢ ParseEnumPayloadPatternElems(P) ⇓ (P, [])

**(Parse-EnumPayloadPatternElems-One)**

```text
Γ ⊢ ParsePattern(P) ⇓ (P_1, p)    ¬ IsPunc(Tok(P_1), ",")
────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseEnumPayloadPatternElems(P) ⇓ (P_1, [p])

**(Parse-EnumPayloadPatternElems-TrailingComma)**

```text
Γ ⊢ ParsePattern(P) ⇓ (P_1, p)    IsPunc(Tok(P_1), ",")    IsPunc(Tok(Advance(P_1)), ")")    TrailingCommaAllowed(P_0, P_1, {Punctuator(")")})
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseEnumPayloadPatternElems(P) ⇓ (Advance(P_1), [p])

**(Parse-EnumPayloadPatternElems-Many)**

```text
Γ ⊢ ParsePattern(P) ⇓ (P_1, p_1)    IsPunc(Tok(P_1), ",")    Γ ⊢ ParsePattern(Advance(P_1)) ⇓ (P_2, p_2)    Γ ⊢ ParsePatternListTail(P_2, [p_2]) ⇓ (P_3, ps)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseEnumPayloadPatternElems(P) ⇓ (P_3, [p_1] ++ ps)

**(Parse-EnumPatternPayloadOpt-Tuple)**

```text
IsPunc(Tok(P), "(")    Γ ⊢ ParseEnumPayloadPatternElems(Advance(P)) ⇓ (P_1, ps)    IsPunc(Tok(P_1), ")")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseEnumPatternPayloadOpt(P) ⇓ (Advance(P_1), TuplePayloadPattern(ps))

**(Parse-EnumPatternPayloadOpt-Record)**

```text
IsPunc(Tok(P), "{")    Γ ⊢ ParseFieldPatternList(Advance(P)) ⇓ (P_1, fs)    IsPunc(Tok(P_1), "}")
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseEnumPatternPayloadOpt(P) ⇓ (Advance(P_1), RecordPayloadPattern(fs))

**(Parse-ModalPatternPayloadOpt-None)**
¬ IsPunc(Tok(P), "{")
──────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseModalPatternPayloadOpt(P) ⇓ (P, ⊥)

**(Parse-ModalPatternPayloadOpt-Record)**

```text
IsPunc(Tok(P), "{")    Γ ⊢ ParseFieldPatternList(Advance(P)) ⇓ (P_1, fs)    IsPunc(Tok(P_1), "}")
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseModalPatternPayloadOpt(P) ⇓ (Advance(P_1), ModalRecordPayload(fs))

#### 17.3.3 AST Representation / Form

EnumPayloadPattern = {TuplePayloadPattern([Pattern]), RecordPayloadPattern([FieldPattern])}
ModalPayloadPattern = {ModalRecordPayload([FieldPattern])}

**(Pat-Enum-None)**
──────────────────────────────────────────────

```text
Γ ⊢ PatNames(EnumPattern(_, _, ⊥)) ⇓ []

**(Pat-Enum-Tuple)**

```text
∀ i, Γ ⊢ PatNames(p_i) ⇓ N_i
──────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PatNames(EnumPattern(_, _, TuplePayloadPattern([p_1, …, p_n]))) ⇓ N_1 ++ ··· ++ N_n

**(Pat-Enum-Record)**

```text
∀ i, Γ ⊢ PatNames(f_i) ⇓ N_i
──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PatNames(EnumPattern(_, _, RecordPayloadPattern([f_1, …, f_n]))) ⇓ N_1 ++ ··· ++ N_n

**(Pat-Modal-None)**
──────────────────────────────────────────────

```text
Γ ⊢ PatNames(ModalPattern(_, ⊥)) ⇓ []

**(Pat-Modal-Record)**

```text
∀ i, Γ ⊢ PatNames(f_i) ⇓ N_i
──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ PatNames(ModalPattern(_, ModalRecordPayload([f_1, …, f_n]))) ⇓ N_1 ++ ··· ++ N_n

#### 17.3.4 Static Semantics

**(Pat-Enum-Unit-R)**

```text
StripPerm(T) = TypePath(p)    EnumDecl(p) = E    VariantPayload(E, v) = ⊥
────────────────────────────────────────────────────────────────

```text
Γ ⊢ EnumPattern(p, v, ⊥) ◁ T ⊣ ∅

**(Pat-Enum-Tuple-R)**

```text
StripPerm(T) = TypePath(p)    EnumDecl(p) = E    VariantPayload(E, v) = TuplePayload([T_1, …, T_n])    ∀ i, Γ ⊢ p_i ◁ T_i ⊣ B_i    B = ⊎_i B_i
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EnumPattern(p, v, TuplePayloadPattern([p_1, …, p_n])) ◁ T ⊣ B

**(Pat-Enum-Record-R)**

```text
StripPerm(T) = TypePath(p)    EnumDecl(p) = E    VariantPayload(E, v) = RecordPayload(fs')    ∀ fp ∈ fs, EnumFieldType(E, v, FieldName(fp)) = T_f ∧ Γ ⊢ PatOf(fp) ◁ T_f ⊣ B_f    B = ⊎_{fp ∈ fs} B_f
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EnumPattern(p, v, RecordPayloadPattern(fs)) ◁ T ⊣ B

**(Pat-Modal-R)**

```text
StripPerm(T) = ModalRefType(modal_ref)    ModalDeclOf(modal_ref) = M    S ∈ States(M)    ∀ fp ∈ fs, ModalPayloadMap(modal_ref, S)(FieldName(fp)) = T_f ∧ Γ ⊢ PatOf(fp) ◁ T_f ⊣ B_f    B = ⊎_{fp ∈ fs} B_f
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ModalPattern(S, fs) ◁ T ⊣ B

**(Pat-Modal-State-R)**

```text
StripPerm(T) = TypeModalState(modal_ref, S)    ModalDeclOf(modal_ref) = M    ∀ fp ∈ fs, ModalPayloadMap(modal_ref, S)(FieldName(fp)) = T_f ∧ Γ ⊢ PatOf(fp) ◁ T_f ⊣ B_f    B = ⊎_{fp ∈ fs} B_f
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ModalPattern(S, fs) ◁ T ⊣ B

#### 17.3.5 Dynamic Semantics

```text
MatchModalJudg = {MatchModal(p, v) ⇓ B}

**(Match-Modal-Empty)**
────────────────────────────────────────────────────────────

```text
Γ ⊢ MatchModal(@S, ⟨S, v⟩) ⇓ ∅

**(Match-Modal-Record)**

```text
Γ ⊢ MatchRecord(fs, v) ⇓ B
──────────────────────────────────────────────────────────────

```text
Γ ⊢ MatchModal(@S{fs}, ⟨S, v⟩) ⇓ B

**(Match-Enum-Unit)**

```text
v = EnumValue(path', ⊥)    EnumPath(path') = path    VariantName(path') = name
───────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ MatchPattern(EnumPattern(path, name, ⊥), v) ⇓ ∅

**(Match-Enum-Tuple)**

```text
v = EnumValue(path', TuplePayload(vec_v))    EnumPath(path') = path    VariantName(path') = name    ∀ i, Γ ⊢ MatchPattern(p_i, v_i) ⇓ B_i    B = ⊎_i B_i
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ MatchPattern(EnumPattern(path, name, TuplePayloadPattern([p_1, …, p_n])), v) ⇓ B

**(Match-Enum-Record)**

```text
v = EnumValue(path', RecordPayload(vec_f))    EnumPath(path') = path    VariantName(path') = name    Γ ⊢ MatchRecord(fs, RecordPayload(vec_f)) ⇓ B
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ MatchPattern(EnumPattern(path, name, RecordPayloadPattern(fs)), v) ⇓ B

**(Match-Modal-General)**

```text
Γ ⊢ MatchModal(@S{fs}, ⟨S, v⟩) ⇓ B
──────────────────────────────────────────────────────────────

```text
Γ ⊢ MatchPattern(@S{fs}, ⟨S, v⟩) ⇓ B

**(Match-Modal-State)**

```text
Γ ⊢ MatchRecord(fs, v) ⇓ B
──────────────────────────────────────────────

```text
Γ ⊢ MatchPattern(@S{fs}, v) ⇓ B

#### 17.3.6 Lowering

Enum and modal patterns use the shared lowering rules in §17.5.6.

#### 17.3.7 Diagnostics

No additional named diagnostics are introduced for enum or modal pattern shape checking beyond the typing failures in this section and the exhaustiveness diagnostics in §17.6.

### 17.4 Range Patterns

#### 17.4.1 Syntax

```text
```

range_pattern ::= pattern (".." | "..=") pattern
```

#### 17.4.2 Parsing

**(Parse-Pattern)**

```text
Γ ⊢ ParsePatternRange(P) ⇓ (P_1, pat)
───────────────────────────────────────────────

```text
Γ ⊢ ParsePattern(P) ⇓ (P_1, pat)

**(Parse-Pattern-Err)**

```text
c = Code(Parse-Syntax-Err)    Γ ⊢ Emit(c, Tok(P).span)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePattern(P) ⇓ (P, WildcardPattern)

**(Parse-Pattern-Range-None)**

```text
Γ ⊢ ParsePatternAtom(P) ⇓ (P_1, p)    ¬ (IsOp(Tok(P_1), "..") ∨ IsOp(Tok(P_1), "..="))
──────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePatternRange(P) ⇓ (P_1, p)

**(Parse-Pattern-Range)**

```text
Γ ⊢ ParsePatternAtom(P) ⇓ (P_1, p_0)    Tok(P_1) = op ∈ {"..", "..="}    Γ ⊢ ParsePatternAtom(Advance(P_1)) ⇓ (P_2, p_1)    kind = (`Exclusive` if op = ".." else `Inclusive`)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParsePatternRange(P) ⇓ (P_2, RangePattern(kind, p_0, p_1))

#### 17.4.3 AST Representation / Form

RangePattern(kind, lo, hi)

```text
ConstPatInt(p) = n ⇔ p = LiteralPattern(IntLiteral(n))

#### 17.4.4 Static Semantics

**(Pat-Range-R)**

```text
StripPerm(T) = TypePrim(t)    t ∈ IntTypes    ConstPatInt(p_l) = n_l    ConstPatInt(p_h) = n_h    (kind = ".." ⇒ n_l < n_h)    (kind = "..=" ⇒ n_l ≤ n_h)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ RangePattern(kind, p_l, p_h) ◁ T ⊣ ∅

**(RangePattern-NonConst)**
(ConstPatInt(p_l) undefined ∨ ConstPatInt(p_h) undefined)    c = Code(RangePattern-NonConst)
───────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ RangePattern(kind, p_l, p_h) ◁ T ⇑ c

**(RangePattern-Empty)**

```text
ConstPatInt(p_l) = n_l    ConstPatInt(p_h) = n_h    ((kind = "..") ⇒ n_l ≥ n_h)    ((kind = "..=") ⇒ n_l > n_h)    c = Code(RangePattern-Empty)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ RangePattern(kind, p_l, p_h) ◁ T ⇑ c

#### 17.4.5 Dynamic Semantics

```text
ConstPat(p) = v ⇔ p = LiteralPattern(ℓ) ∧ v = LiteralValue(ℓ, PatType(p))

**(Match-Range)**

```text
ConstPat(p_l) = v_l    ConstPat(p_h) = v_h    v_l ≤ v ≤ v_h
────────────────────────────────────────────────────────────────

```text
Γ ⊢ MatchPattern(p_l `..=` p_h, v) ⇓ ∅

```text
ConstPat(p_l) = v_l    ConstPat(p_h) = v_h    v_l ≤ v < v_h
───────────────────────────────────────────────

```text
Γ ⊢ MatchPattern(p_l `..` p_h, v) ⇓ ∅

#### 17.4.6 Lowering

Range patterns use the shared lowering rules in §17.5.6.

#### 17.4.7 Diagnostics

Diagnostics are defined for range-pattern bounds that are not compile-time constants and for statically empty ranges.

### 17.5 Case Clauses

#### 17.5.1 Syntax

```text
```

if_case      ::= pattern block_expr
if_case_else ::= "else" block_expr
```

#### 17.5.2 Parsing

**Case Clauses.**

**(Parse-IfCases-Cons)**

```text
Γ ⊢ ParseIfCase(P) ⇓ (P_1, c)    Γ ⊢ ParseIfCasesTail(P_1, [c]) ⇓ (P_2, cases, else_opt)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseIfCases(P) ⇓ (P_2, cases, else_opt)

**(Parse-IfCase)**

```text
Γ ⊢ ParsePattern(P) ⇓ (P_1, pat)    Γ ⊢ ParseBlock(P_1) ⇓ (P_2, body)
────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseIfCase(P) ⇓ (P_2, ⟨pat, body⟩)

**(Parse-IfCasesTail-End)**
Tok(P) = Punctuator("}")
──────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseIfCasesTail(P, xs) ⇓ (P, xs, ⊥)

**(Parse-IfCasesTail-Else)**

```text
IsKw(Tok(P), `else`)    Γ ⊢ ParseBlock(Advance(P)) ⇓ (P_1, b)
────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseIfCasesTail(P, xs) ⇓ (P_1, xs, b)

**(Parse-IfCasesTail-Cons)**

```text
Γ ⊢ ParseIfCase(P) ⇓ (P_1, c)    Γ ⊢ ParseIfCasesTail(P_1, xs ++ [c]) ⇓ (P_2, ys, else_opt)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ ParseIfCasesTail(P, xs) ⇓ (P_2, ys, else_opt)

#### 17.5.3 AST Representation / Form

```text
IfCase = ⟨pat, body⟩

```text
BindOrder(p, B) = [⟨x, B[x]⟩ | x ∈ PatNames(p)]

#### 17.5.4 Static Semantics

```text
CaseScopeJudg = {CaseScope(Γ, e, pat, T) ⇓ Γ_case}

```text
PatternNarrowJudg = {PatternNarrow(Γ, pat, T) ⇓ T_n}

ScrutineeBinding(Identifier(x)) = x

```text
ScrutineeBinding(e) = ⊥ ⇔ e ≠ Identifier(_)

```text
RefineBinding(Γ, x, T_n) ⇓ Γ' ⇔ LookupNearestValueBinding(Γ, x) = b ∧ Γ' = ReplaceBindingType(Γ, b, T_n)

UnionOrSingle([T]) = T

```text
UnionOrSingle([T_1, …, T_n]) = TypeUnion([T_1, …, T_n]) ⇔ n ≥ 2

**(PatternNarrow-Perm)**

```text
PatternNarrow(Γ, pat, T) ⇓ T_n
──────────────────────────────────────────────────────────────

```text
PatternNarrow(Γ, pat, TypePerm(p, T)) ⇓ TypePerm(p, T_n)

**(PatternNarrow-ModalRef)**

```text
StripPerm(T) = ModalRefType(modal_ref)    ModalDeclOf(modal_ref) = M    S ∈ States(M)
────────────────────────────────────────────────────────────────────────────────────────────

```text
PatternNarrow(Γ, ModalPattern(S, fs), T) ⇓ TypeModalState(modal_ref, S)

**(PatternNarrow-ModalState)**
StripPerm(T) = TypeModalState(modal_ref, S)    ModalDeclOf(modal_ref) = M
────────────────────────────────────────────────────────────────────────────────────────────

```text
PatternNarrow(Γ, ModalPattern(S, fs), T) ⇓ TypeModalState(modal_ref, S)

**(PatternNarrow-Union)**

```text
T = TypeUnion([T_1, …, T_n])    Ns = [N_i | 1 ≤ i ≤ n ∧ PatternNarrow(Γ, pat, T_i) ⇓ N_i]    |Ns| ≥ 1    UnionOrSingle(Ns) = T_n
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
PatternNarrow(Γ, pat, T) ⇓ T_n

**(CaseScope-Narrow)**

```text
Γ ⊢ pat ◁ T_s ⊣ B    Distinct(PatNames(pat))    ScrutineeBinding(e) = x    PatternNarrow(Γ, pat, T_s) ⇓ T_n    RefineBinding(Γ, x, T_n) ⇓ Γ_r    Γ_0 = PushScope(Γ_r)    IntroAll(Γ_0, B) ⇓ Γ_case
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
CaseScope(Γ, e, pat, T_s) ⇓ Γ_case

**(CaseScope-PatternOnly)**

```text
Γ ⊢ pat ◁ T_s ⊣ B    Distinct(PatNames(pat))    (ScrutineeBinding(e) = ⊥ ∨ PatternNarrow(Γ, pat, T_s) undefined)    Γ_0 = PushScope(Γ)    IntroAll(Γ_0, B) ⇓ Γ_case
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
CaseScope(Γ, e, pat, T_s) ⇓ Γ_case

#### 17.5.5 Dynamic Semantics

```text
IfCaseJudg = {Γ ⊢ EvalIfCaseSigma(c, v, σ) ⇓ (res, σ')}

```text
IfCaseListJudg = {Γ ⊢ EvalIfCaseListSigma(cases, else_opt, v, σ) ⇓ (out, σ')}

**(EvalIfCase-Fail)**

```text
Γ ⊢ MatchPattern(pat, v) undefined
──────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalIfCaseSigma(⟨pat, body⟩, v, σ) ⇓ (NoMatch, σ)

**(EvalIfCase-Hit)**

```text
Γ ⊢ MatchPattern(pat, v) ⇓ B    BindOrder(pat, B) = binds    BlockEnter(σ, binds) ⇓ (σ_1, scope)    Γ ⊢ EvalBlockSigma(body, σ_1) ⇓ (out, σ_2)    BlockExit(σ_2, scope, out) ⇓ (out', σ_3)
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalIfCaseSigma(⟨pat, body⟩, v, σ) ⇓ (Match(out'), σ_3)

**(EvalIfCases-Head)**

```text
Γ ⊢ EvalIfCaseSigma(c, v, σ) ⇓ (Match(out), σ_1)
────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalIfCaseListSigma(c::cs, else_opt, v, σ) ⇓ (out, σ_1)

**(EvalIfCases-Tail)**

```text
Γ ⊢ EvalIfCaseSigma(c, v, σ) ⇓ (NoMatch, σ_1)    Γ ⊢ EvalIfCaseListSigma(cs, else_opt, v, σ_1) ⇓ (out, σ_2)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalIfCaseListSigma(c::cs, else_opt, v, σ) ⇓ (out, σ_2)

**(EvalIfCases-Else)**

```text
else_opt = b    Γ ⊢ EvalBlockSigma(b, σ) ⇓ (out, σ')
────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalIfCaseListSigma([], else_opt, v, σ) ⇓ (out, σ')

**(EvalIfCases-None)**

```text
else_opt = ⊥
──────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ EvalIfCaseListSigma([], else_opt, v, σ) ⇓ (Val(()), σ)

#### 17.5.6 Lowering

LowerBindJudg = {LowerBindList, LowerBindPattern, LowerIfCases}
PatternLowerJudg = {LowerBindPattern, LowerBindList, LowerIfCases, TagOf}

**(Lower-Pat-Correctness)**

```text
∀ v, Γ ⊢ MatchPattern(pat, v) ⇓ B ⇒ ExecIRSigma(IR, σ) ⇓ (ok, σ')
────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerBindPattern(pat, v) ⇓ IR

```text
IfCaseValueCorrect(Γ, scrut, cases, else_opt, v) ⇔ ∀ σ, v', σ'. Γ ⊢ EvalSigma(IfCaseExpr(scrut, cases, else_opt), σ) ⇓ (Val(v'), σ') ⇒ v = v'

**(Lower-IfCases-Correctness)**

```text
∀ σ, Γ ⊢ EvalSigma(IfCaseExpr(scrut, cases, else_opt), σ) ⇓ (out, σ') ⇒ ExecIRSigma(IR, σ) ⇓ (out, σ')    IfCaseValueCorrect(Γ, scrut, cases, else_opt, v)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIfCases(scrut, cases, else_opt) ⇓ ⟨IR, v⟩

```text
EnumValuePath(v) = path ⇔ v = EnumValue(path, payload)

```text
VariantIndex(E, name) = i ⇔ Variants(E) = [v_0, …, v_k] ∧ v_i.name = name

```text
EnumDisc(E, name) = d ⇔ EnumDiscriminants(E) ⇓ ds ∧ VariantIndex(E, name) = i ∧ ds[i] = d

```text
StateIndex(M, S) = i ⇔ States(M) = [S_0, …, S_k] ∧ S_i = S

**(TagOf-Enum)**
EnumValuePath(v) = path    EnumPath(path) = p    T = TypePath(p)    EnumDecl(p) = E    VariantName(path) = name    EnumDisc(E, name) = d
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TagOf(v, T) ⇓ d

**(TagOf-Modal)**

```text
v = ⟨S, v_S⟩    T = ModalRefType(modal_ref)    ModalDeclOf(modal_ref) = M    StateIndex(M, S) = i
───────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ TagOf(v, T) ⇓ i

**(Lower-BindList-Empty)**
──────────────────────────────────────────────

```text
Γ ⊢ LowerBindList([]) ⇓ ε

**(Lower-BindList-Cons)**

```text
Γ ⊢ LowerBindList(bs) ⇓ IR_r
──────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerBindList([⟨x, v⟩] ++ bs) ⇓ SeqIR(BindVarIR(x, v), IR_r)

**(Lower-Pat-General)**

```text
Γ ⊢ MatchPattern(pat, v) ⇓ B    BindOrder(pat, B) = binds    Γ ⊢ LowerBindList(binds) ⇓ IR
────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerBindPattern(pat, v) ⇓ IR

**(Lower-Pat-Err)**
MatchPattern(pat, v) undefined
──────────────────────────────────────────────────────

```text
Γ ⊢ LowerBindPattern(pat, v) ⇑

**(Lower-IfCases)**

```text
Γ ⊢ LowerExpr(scrut) ⇓ ⟨IR_s, v_s⟩    Γ; R; L ⊢ scrut : T_s    ∀ i, case_i = ⟨p_i, b_i⟩    ∀ i, CaseScope(Γ, scrut, p_i, T_s) ⇓ Γ_i
────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ ⊢ LowerIfCases(scrut, cases, else_opt) ⇓ ⟨SeqIR(IR_s, IfCaseIR(v_s, cases, else_opt)), v_case⟩

#### 17.5.7 Diagnostics

No additional named diagnostics are introduced for case-clause structure beyond the diagnostics of the contained patterns and the exhaustiveness rules in §17.6.

### 17.6 Exhaustiveness and Reachability

#### 17.6.1 Syntax

No additional surface syntax is introduced.

#### 17.6.2 Parsing

Exhaustiveness and reachability are not parser-owned.

#### 17.6.3 AST Representation / Form

```text
AllEq_Γ([T_1, …, T_n]) ⇔ ∀ i. Γ ⊢ T_i ≡ T_1

```text
Irrefutable(pat, T) ⇔ pat = WildcardPattern ∨ pat = IdentifierPattern(_) ∨ (pat = TuplePattern([p_1, …, p_n]) ∧ StripPerm(T) = TypeTuple([T_1, …, T_n]) ∧ ∀ i. Irrefutable(p_i, T_i)) ∨ (pat = RecordPattern(p, fs) ∧ StripPerm(T) = TypePath(p) ∧ RecordDecl(p) = R ∧ ∀ fp ∈ fs. Irrefutable(PatOf(fp), FieldType(R, FieldName(fp))))

```text
HasIrrefutableCase(cases, T) ⇔ ∃ case ∈ cases. ∃ p, b. case = ⟨p, b⟩ ∧ Irrefutable(p, T)

```text
CaseLabel(EnumPattern(path, v, _)) = ⟨`enum`, path, v⟩

```text
CaseLabel(ModalPattern(s, _)) = ⟨`modal`, s⟩

```text
CaseLabel(Pat-Union(T, _)) = ⟨`union`, T⟩

```text
CaseLabel(_) = ⊥

```text
CaseUnreachable(T, cases, i) ⇔

```text
  (∃ j. 1 ≤ j < i ∧ Irrefutable(cases[j].pat, T)) ∨

```text
  (CaseLabel(cases[i].pat) ≠ ⊥ ∧ ∃ j. 1 ≤ j < i ∧ CaseLabel(cases[j].pat) = CaseLabel(cases[i].pat))

```text
VariantNames(E) = [ v.name | v ∈ E.variants ]

```text
CaseVariants(cases) = { v | ∃ p, b. ⟨p, b⟩ ∈ cases ∧ p = EnumPattern(_, v, _) }

```text
CaseStates(cases) = { s | ∃ p, b. ⟨p, b⟩ ∈ cases ∧ p = ModalPattern(_, s) }

```text
UnionTypes(U) = [T_1, …, T_n] ⇔ U = TypeUnion([T_1, …, T_n])

```text
CaseUnionTypes(cases) = { T | ∃ p, b. ⟨p, b⟩ ∈ cases ∧ p = Pat-Union(T, _) }

```text
UnionTypesExhaustive(cases, types) ⇔ ∀ T ∈ types. ∃ case ∈ cases. ∃ p, b. case = ⟨p, b⟩ ∧ p = Pat-Union(T, _)

#### 17.6.4 Static Semantics

**Enum Case Analysis**

**(T-IfCase-Enum)**

```text
Γ; R; L ⊢ e : TypePath(p)    EnumDecl(p) = E    ∀ i, case_i = ⟨p_i, b_i⟩    ∀ i, CaseScope(Γ, e, p_i, TypePath(p)) ⇓ Γ_i    ∀ i, Γ_i; R; L ⊢ b_i : T_r    (else_opt = ⊥ ∨ Γ; R; L ⊢ else_opt : T_r)    (else_opt ≠ ⊥ ∨ HasIrrefutableCase(cases, TypePath(p)) ∨ CaseVariants(cases) = VariantNames(E))
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ IfCaseExpr(e, cases, else_opt) : T_r

**Modal Case Analysis**

**(T-IfCase-Modal)**

```text
Γ; R; L ⊢ e : ModalRefType(modal_ref)    ModalDeclOf(modal_ref) = M    ∀ i, case_i = ⟨p_i, b_i⟩    ∀ i, CaseScope(Γ, e, p_i, ModalRefType(modal_ref)) ⇓ Γ_i    ∀ i, Γ_i; R; L ⊢ b_i : T_r    (else_opt = ⊥ ∨ Γ; R; L ⊢ else_opt : T_r)    (else_opt ≠ ⊥ ∨ HasIrrefutableCase(cases, ModalRefType(modal_ref)) ∨ CaseStates(cases) = States(M))
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ IfCaseExpr(e, cases, else_opt) : T_r

**(IfCase-Modal-NonExhaustive)**

```text
Γ; R; L ⊢ e : ModalRefType(modal_ref)    ModalDeclOf(modal_ref) = M    else_opt = ⊥    ¬(HasIrrefutableCase(cases, ModalRefType(modal_ref)) ∨ CaseStates(cases) = States(M))    c = Code(IfCase-Modal-NonExhaustive)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ IfCaseExpr(e, cases, else_opt) ⇑ c

**Union Case Analysis**

**(T-IfCase-Union)**

```text
Γ; R; L ⊢ e : TypeUnion([T_1, …, T_n])    ∀ i, case_i = ⟨p_i, b_i⟩    ∀ i, CaseScope(Γ, e, p_i, TypeUnion([T_1, …, T_n])) ⇓ Γ_i    ∀ i, Γ_i; R; L ⊢ b_i : T_r    (else_opt = ⊥ ∨ Γ; R; L ⊢ else_opt : T_r)    (else_opt ≠ ⊥ ∨ HasIrrefutableCase(cases, TypeUnion([T_1, …, T_n])) ∨ UnionTypesExhaustive(cases, [T_1, …, T_n]))
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ IfCaseExpr(e, cases, else_opt) : T_r

**(IfCase-Union-NonExhaustive)**

```text
Γ; R; L ⊢ e : TypeUnion([T_1, …, T_n])    else_opt = ⊥    ¬(HasIrrefutableCase(cases, TypeUnion([T_1, …, T_n])) ∨ UnionTypesExhaustive(cases, [T_1, …, T_n]))    c = Code(IfCase-Union-NonExhaustive)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ IfCaseExpr(e, cases, else_opt) ⇑ c

**(Chk-IfCase-Union)**

```text
Γ; R; L ⊢ e : TypeUnion([T_1, …, T_n])    ∀ i, case_i = ⟨p_i, b_i⟩    ∀ i, CaseScope(Γ, e, p_i, TypeUnion([T_1, …, T_n])) ⇓ Γ_i    ∀ i, Γ_i; R; L ⊢ b_i ⇐ T    (else_opt = ⊥ ∨ Γ; R; L ⊢ else_opt ⇐ T ⊣ ∅)    (else_opt ≠ ⊥ ∨ HasIrrefutableCase(cases, TypeUnion([T_1, …, T_n])) ∨ UnionTypesExhaustive(cases, [T_1, …, T_n]))
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ IfCaseExpr(e, cases, else_opt) ⇐ T ⊣ ∅

**Other Case Analysis**

**(T-IfCase-Other)**

```text
Γ; R; L ⊢ e : T_s    ∀ i, case_i = ⟨p_i, b_i⟩    ∀ i, CaseScope(Γ, e, p_i, T_s) ⇓ Γ_i    ∀ i, Γ_i; R; L ⊢ b_i : T_r    (else_opt = ⊥ ∨ Γ; R; L ⊢ else_opt : T_r)    (else_opt ≠ ⊥ ∨ HasIrrefutableCase(cases, T_s))
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ IfCaseExpr(e, cases, else_opt) : T_r

**(Chk-IfCase-Enum)**

```text
Γ; R; L ⊢ e : TypePath(p)    EnumDecl(p) = E    ∀ i, case_i = ⟨p_i, b_i⟩    ∀ i, CaseScope(Γ, e, p_i, TypePath(p)) ⇓ Γ_i    ∀ i, Γ_i; R; L ⊢ b_i ⇐ T    (else_opt = ⊥ ∨ Γ; R; L ⊢ else_opt ⇐ T ⊣ ∅)    (else_opt ≠ ⊥ ∨ HasIrrefutableCase(cases, TypePath(p)) ∨ CaseVariants(cases) = VariantNames(E))
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ IfCaseExpr(e, cases, else_opt) ⇐ T ⊣ ∅

**(IfCase-Enum-NonExhaustive)**

```text
Γ; R; L ⊢ e : TypePath(p)    EnumDecl(p) = E    else_opt = ⊥    ¬(HasIrrefutableCase(cases, TypePath(p)) ∨ CaseVariants(cases) = VariantNames(E))    c = Code(IfCase-Enum-NonExhaustive)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ IfCaseExpr(e, cases, else_opt) ⇑ c

**(Chk-IfCase-Modal)**

```text
Γ; R; L ⊢ e : ModalRefType(modal_ref)    ModalDeclOf(modal_ref) = M    ∀ i, case_i = ⟨p_i, b_i⟩    ∀ i, CaseScope(Γ, e, p_i, ModalRefType(modal_ref)) ⇓ Γ_i    ∀ i, Γ_i; R; L ⊢ b_i ⇐ T    (else_opt = ⊥ ∨ Γ; R; L ⊢ else_opt ⇐ T ⊣ ∅)    (else_opt ≠ ⊥ ∨ HasIrrefutableCase(cases, ModalRefType(modal_ref)) ∨ CaseStates(cases) = States(M))
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ IfCaseExpr(e, cases, else_opt) ⇐ T ⊣ ∅

**(Chk-IfCase-Other)**

```text
Γ; R; L ⊢ e : T_s    ∀ i, case_i = ⟨p_i, b_i⟩    ∀ i, CaseScope(Γ, e, p_i, T_s) ⇓ Γ_i    ∀ i, Γ_i; R; L ⊢ b_i ⇐ T    (else_opt = ⊥ ∨ Γ; R; L ⊢ else_opt ⇐ T ⊣ ∅)    (else_opt ≠ ⊥ ∨ HasIrrefutableCase(cases, T_s))
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ IfCaseExpr(e, cases, else_opt) ⇐ T ⊣ ∅

**(Chk-IfIs)**

```text
Γ; R; L ⊢ e : T_s    CaseScope(Γ, e, pat, T_s) ⇓ Γ_1    Γ_1; R; L ⊢ b_t ⇐ T ⊣ ∅    Γ; R; L ⊢ b_f ⇐ T ⊣ ∅
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ IfIsExpr(e, pat, b_t, b_f) ⇐ T ⊣ ∅

**(Chk-IfIs-No-Else)**

```text
Γ; R; L ⊢ e : T_s    CaseScope(Γ, e, pat, T_s) ⇓ Γ_1    Γ_1; R; L ⊢ b_t ⇐ TypePrim(`()`) ⊣ ∅
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ IfIsExpr(e, pat, b_t, ⊥) ⇐ TypePrim(`()`) ⊣ ∅

**(IfCase-Unreachable)**

```text
Γ; R; L ⊢ e : T_s    1 ≤ i ≤ |cases|    CaseUnreachable(T_s, cases, i)    c = Code(IfCase-Unreachable)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

```text
Γ; R; L ⊢ IfCaseExpr(e, cases, else_opt) ⇑ c

#### 17.6.5 Dynamic Semantics

No additional dynamic semantics are introduced beyond the case-selection and pattern-matching rules of §17.5.5 and the surrounding `if ... is ...` expression semantics of §16.7.5.

#### 17.6.6 Lowering

No additional lowering is introduced beyond the shared `LowerIfCases` and `LowerBindPattern` rules of §17.5.6.

#### 17.6.7 Diagnostics

Diagnostics are defined for non-exhaustive `if ... is { ... }` case analysis on general modal types, union types, and enum types, and for unreachable case clauses.

### 17.7 Pattern Diagnostics Supplement

This section owns diagnostics for pattern exhaustiveness, irrefutability, and pattern-shape validity.

| Code         | Severity | Detection    | Condition                                                          |
| ------------ | -------- | ------------ | ------------------------------------------------------------------ |
| `E-SEM-2705` | Error    | Compile-time | `if ... is { ... }` case analysis is not exhaustive for union type |
| `E-SEM-2711` | Error    | Compile-time | Refutable pattern in irrefutable context (`let`)                   |
| `E-SEM-2713` | Error    | Compile-time | Duplicate binding identifier within single pattern                 |
| `E-SEM-2721` | Error    | Compile-time | Range pattern bounds are not compile-time constants                |
| `E-SEM-2722` | Error    | Compile-time | Range pattern start exceeds end (empty range)                      |
| `E-SEM-2731` | Error    | Compile-time | Record pattern references non-existent field                       |
| `E-SEM-2741` | Error    | Compile-time | `if ... is { ... }` case analysis is not exhaustive                |
| `E-SEM-2751` | Error    | Compile-time | Case clause is unreachable                                         |
